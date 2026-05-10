'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const KEYS = ['site_title','site_description','contact_email','whatsapp_url','cv_url','google_analytics_id'];

export default function Settings() {
  const sb = createClient();
  const [v, setV] = useState<Record<string,string>>({});
  const [pw, setPw] = useState('');
  useEffect(() => {
    sb.from('site_settings').select('*').then(({ data }) => {
      const o: any = {};
      (data || []).forEach((r: any) => { o[r.key] = r.value || ''; });
      setV(o);
    });
  }, []);
  async function save() {
    const rows = KEYS.map(k => ({ key: k, value: v[k] ?? '' }));
    const { error } = await sb.from('site_settings').upsert(rows);
    if (error) toast.error(error.message); else toast.success('Saved');
  }
  async function changePw() {
    if (pw.length < 6) return toast.error('Min 6 chars');
    const { error } = await sb.auth.updateUser({ password: pw });
    if (error) toast.error(error.message); else { toast.success('Password updated'); setPw(''); }
  }
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold mb-6">Settings</h1>
      <div className="space-y-4">
        {KEYS.map(k => (
          <div key={k}>
            <Label className="capitalize">{k.replace(/_/g, ' ')}</Label>
            {k === 'site_description'
              ? <Textarea className="mt-1.5" value={v[k] || ''} onChange={e => setV({ ...v, [k]: e.target.value })}/>
              : <Input className="mt-1.5" value={v[k] || ''} onChange={e => setV({ ...v, [k]: e.target.value })}/>}
          </div>
        ))}
        <Button variant="accent" onClick={save}>Save settings</Button>
      </div>
      <div className="border-t border-border mt-10 pt-8">
        <h2 className="font-display text-xl font-semibold mb-4">Change password</h2>
        <div className="flex gap-2 max-w-sm">
          <Input type="password" placeholder="New password" value={pw} onChange={e => setPw(e.target.value)}/>
          <Button onClick={changePw}>Update</Button>
        </div>
      </div>
    </div>
  );
}
