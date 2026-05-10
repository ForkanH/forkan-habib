'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function Messages() {
  const sb = createClient();
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState<any | null>(null);
  async function load() { const { data } = await sb.from('contacts').select('*').order('created_at', { ascending: false }); setRows(data || []); }
  useEffect(() => { load(); }, []);
  async function toggleRead(r: any) { await sb.from('contacts').update({ is_read: !r.is_read }).eq('id', r.id); load(); }
  async function del(id: string) { if (!confirm('Delete?')) return; await sb.from('contacts').delete().eq('id', id); toast.success('Deleted'); load(); }
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-6">Messages</h1>
      <div className="rounded-xl border border-border divide-y divide-border">
        {rows.length === 0 && <div className="p-6 text-muted-foreground text-sm">No messages yet.</div>}
        {rows.map(r => (
          <div key={r.id} className={`p-4 flex items-start gap-3 ${!r.is_read ? 'bg-accent/5' : ''}`}>
            <button onClick={() => toggleRead(r)} className="mt-1 text-accent">{r.is_read ? <MailOpen className="h-4 w-4"/> : <Mail className="h-4 w-4"/>}</button>
            <div className="flex-1 cursor-pointer" onClick={() => setOpen(r)}>
              <div className="flex justify-between gap-3"><div className="font-medium">{r.name} <span className="text-muted-foreground text-sm">&lt;{r.email}&gt;</span></div><div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</div></div>
              <div className="text-sm text-muted-foreground">{r.subject}</div>
              <div className="text-sm mt-1 line-clamp-2">{r.message}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => del(r.id)}><Trash2 className="h-4 w-4"/></Button>
          </div>
        ))}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setOpen(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="font-display text-xl font-semibold">{open.subject}</div>
            <div className="text-sm text-muted-foreground mt-1">{open.name} · {open.email}</div>
            <p className="mt-4 whitespace-pre-wrap">{open.message}</p>
            <div className="flex justify-end gap-2 mt-6"><Button variant="ghost" onClick={() => setOpen(null)}>Close</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}
