'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/admin/image-upload';

export default function AboutAdmin() {
  const sb = createClient();
  const [v, setV] = useState<any>({ social_links: {}, values: [] });
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    sb.from('about').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) { setV(data); setId(data.id); }
    });
  }, []);
  const social = v.social_links || {};
  function setSocial(k: string, val: string) { setV({ ...v, social_links: { ...social, [k]: val } }); }

  async function save() {
    const payload = { ...v };
    delete payload.id;
    const res = id
      ? await sb.from('about').update(payload).eq('id', id)
      : await sb.from('about').insert(payload).select().single().then(r => { if (r.data) setId(r.data.id); return r; });
    if ((res as any).error) toast.error((res as any).error.message);
    else toast.success('Saved');
  }
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold mb-6">About</h1>
      <div className="space-y-4">
        {[1,2,3].map(n => (
          <div key={n}><Label>Bio paragraph {n}</Label><Textarea className="mt-1.5" value={v[`bio_${n}`] || ''} onChange={e => setV({ ...v, [`bio_${n}`]: e.target.value })}/></div>
        ))}
        <div><Label>Photo</Label><ImageUpload bucket="avatars" value={v.photo_url || ''} onChange={url => setV({ ...v, photo_url: url })}/></div>
        <label className="flex items-center gap-2"><input type="checkbox" checked={!!v.is_available} onChange={e => setV({ ...v, is_available: e.target.checked })}/> Open to projects</label>
        <div className="grid grid-cols-2 gap-3">
          {(['linkedin','github','facebook','youtube'] as const).map(k => (
            <div key={k}><Label className="capitalize">{k}</Label><Input className="mt-1.5" value={social[k] || ''} onChange={e => setSocial(k, e.target.value)}/></div>
          ))}
        </div>
        <div>
          <Label>Values (JSON array of {`{title, description}`})</Label>
          <Textarea className="mt-1.5 font-mono text-xs" rows={6} value={JSON.stringify(v.values || [], null, 2)} onChange={e => { try { setV({ ...v, values: JSON.parse(e.target.value) }); } catch {} }}/>
        </div>
        <Button variant="accent" onClick={save}>Save</Button>
      </div>
    </div>
  );
}
