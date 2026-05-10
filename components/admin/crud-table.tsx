'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Pencil, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { RichEditor } from '@/components/admin/rich-editor';

export type FieldDef =
  | { name: string; label: string; type: 'text' | 'number' | 'url'; required?: boolean }
  | { name: string; label: string; type: 'textarea' | 'richtext'; required?: boolean }
  | { name: string; label: string; type: 'boolean' }
  | { name: string; label: string; type: 'tags' }
  | { name: string; label: string; type: 'select'; options: string[] };

export function CrudTable({ table, fields, columns, orderBy = 'order_index', allowReorder = false, defaults = {} }:
  { table: string; fields: FieldDef[]; columns: string[]; orderBy?: string; allowReorder?: boolean; defaults?: Record<string, any> }) {
  const sb = createClient();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await sb.from(table).select('*').order(orderBy, { ascending: true });
    if (error) toast.error(error.message);
    setRows(data || []); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function onSave(values: any) {
    const payload = { ...defaults, ...values };
    if (editing?.id) {
      const { error } = await sb.from(table).update(payload).eq('id', editing.id);
      if (error) return toast.error(error.message);
      toast.success('Saved');
    } else {
      const { error } = await sb.from(table).insert(payload);
      if (error) return toast.error(error.message);
      toast.success('Created');
    }
    setShowForm(false); setEditing(null); load();
  }
  async function onDelete(id: string) {
    if (!confirm('Delete this?')) return;
    const { error } = await sb.from(table).delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted'); load();
  }
  async function reorder(id: string, dir: -1 | 1) {
    const idx = rows.findIndex(r => r.id === id);
    const j = idx + dir;
    if (j < 0 || j >= rows.length) return;
    const a = rows[idx], b = rows[j];
    await sb.from(table).update({ order_index: b.order_index ?? j }).eq('id', a.id);
    await sb.from(table).update({ order_index: a.order_index ?? idx }).eq('id', b.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">{rows.length} {rows.length === 1 ? 'item' : 'items'}</div>
        <Button variant="accent" onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="h-4 w-4"/>New</Button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-left">
            <tr>{columns.map(c => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}<th className="px-4 py-3 w-32"/></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={columns.length + 1} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!loading && rows.length === 0 && <tr><td colSpan={columns.length + 1} className="p-6 text-center text-muted-foreground">No items yet.</td></tr>}
            {rows.map(r => (
              <tr key={r.id} className="border-t border-border">
                {columns.map(c => <td key={c} className="px-4 py-3 align-top max-w-xs truncate">{formatCell(r[c])}</td>)}
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    {allowReorder && <>
                      <Button variant="ghost" size="icon" onClick={() => reorder(r.id, -1)}><ArrowUp className="h-3.5 w-3.5"/></Button>
                      <Button variant="ghost" size="icon" onClick={() => reorder(r.id, 1)}><ArrowDown className="h-3.5 w-3.5"/></Button>
                    </>}
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(r); setShowForm(true); }}><Pencil className="h-3.5 w-3.5"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(r.id)}><Trash2 className="h-3.5 w-3.5"/></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <FormDialog fields={fields} initial={editing || {}} onSave={onSave} onClose={() => { setShowForm(false); setEditing(null); }}/>
      )}
    </div>
  );
}

function formatCell(v: any) {
  if (v === null || v === undefined) return '—';
  if (Array.isArray(v)) return v.join(', ');
  if (typeof v === 'boolean') return v ? '✓' : '—';
  if (typeof v === 'string' && v.length > 80) return v.slice(0, 80) + '…';
  return String(v);
}

function FormDialog({ fields, initial, onSave, onClose }: { fields: FieldDef[]; initial: any; onSave: (v: any) => void; onClose: () => void }) {
  const [v, setV] = useState<any>(initial);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-xl font-semibold mb-4">{initial?.id ? 'Edit' : 'New'}</h3>
        <div className="space-y-3">
          {fields.map(f => (
            <div key={f.name}>
              <Label>{f.label}</Label>
              {f.type === 'richtext' ? (
                <div className="mt-1.5"><RichEditor value={v[f.name] ?? ''} onChange={html => setV({ ...v, [f.name]: html })}/></div>
              ) : f.type === 'textarea' ? (
                <Textarea className="mt-1.5" value={v[f.name] ?? ''} onChange={e => setV({ ...v, [f.name]: e.target.value })}/>
              ) : f.type === 'boolean' ? (
                <div className="mt-1.5"><input type="checkbox" checked={!!v[f.name]} onChange={e => setV({ ...v, [f.name]: e.target.checked })}/> </div>
              ) : f.type === 'tags' ? (
                <Input className="mt-1.5" placeholder="comma,separated,tags"
                  value={Array.isArray(v[f.name]) ? v[f.name].join(', ') : (v[f.name] ?? '')}
                  onChange={e => setV({ ...v, [f.name]: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}/>
              ) : f.type === 'select' ? (
                <select className="mt-1.5 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                  value={v[f.name] ?? ''} onChange={e => setV({ ...v, [f.name]: e.target.value })}>
                  <option value="">—</option>
                  {f.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <Input className="mt-1.5" type={f.type === 'number' ? 'number' : 'text'} value={v[f.name] ?? ''}
                  onChange={e => setV({ ...v, [f.name]: f.type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value })}/>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="accent" onClick={() => onSave(v)}>Save</Button>
        </div>
      </div>
    </div>
  );
}
