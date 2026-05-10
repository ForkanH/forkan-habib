'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { RichEditor } from '@/components/admin/rich-editor';

export default function EditPost() {
  const sb = createClient();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [p, setP] = useState<any>(null);
  useEffect(() => { sb.from('blog_posts').select('*').eq('id', id).single().then(({ data }) => setP(data)); }, [id]);
  async function save() {
    const payload: any = { ...p }; delete payload.id; payload.updated_at = new Date().toISOString();
    const { error } = await sb.from('blog_posts').update(payload).eq('id', id);
    if (error) toast.error(error.message); else toast.success('Saved');
  }
  if (!p) return <div className="text-sm text-muted-foreground">Loading…</div>;
  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-2xl font-semibold">Edit post</h1>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!p.is_published} onChange={e => setP({ ...p, is_published: e.target.checked })}/> Published</label>
          <Button variant="ghost" onClick={() => router.push('/admin/blog')}>Back</Button>
          <Button variant="accent" onClick={save}>Save</Button>
        </div>
      </div>
      <div className="space-y-4">
        <div><Label>Title</Label><Input className="mt-1.5" value={p.title || ''} onChange={e => setP({ ...p, title: e.target.value })}/></div>
        <div><Label>Slug</Label><Input className="mt-1.5" value={p.slug || ''} onChange={e => setP({ ...p, slug: e.target.value })}/></div>
        <div><Label>Cover image URL</Label><Input className="mt-1.5" value={p.cover_url || ''} onChange={e => setP({ ...p, cover_url: e.target.value })}/></div>
        <div><Label>Excerpt</Label><Textarea className="mt-1.5" value={p.excerpt || ''} onChange={e => setP({ ...p, excerpt: e.target.value })}/></div>
        <div><Label>Tags</Label><Input className="mt-1.5" placeholder="comma,separated" value={(p.tags || []).join(', ')} onChange={e => setP({ ...p, tags: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}/></div>
        <div><Label>Reading time (min)</Label><Input className="mt-1.5" type="number" value={p.reading_time ?? 3} onChange={e => setP({ ...p, reading_time: Number(e.target.value) })}/></div>
        <div><Label>Content</Label><div className="mt-1.5"><RichEditor value={p.content || ''} onChange={(html) => setP({ ...p, content: html })}/></div></div>
      </div>
    </div>
  );
}
