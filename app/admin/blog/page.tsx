'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { slugify } from '@/lib/utils';

export default function BlogList() {
  const sb = createClient();
  const [rows, setRows] = useState<any[]>([]);
  async function load() { const { data } = await sb.from('blog_posts').select('id,title,slug,is_published,created_at').order('created_at', { ascending: false }); setRows(data || []); }
  useEffect(() => { load(); }, []);
  async function create() {
    const title = prompt('Post title?');
    if (!title) return;
    const { data, error } = await sb.from('blog_posts').insert({ title, slug: slugify(title) + '-' + Date.now().toString(36), excerpt: '', content: '', is_published: false }).select().single();
    if (error) return toast.error(error.message);
    window.location.href = `/admin/blog/${data.id}/edit`;
  }
  async function del(id: string) { if (!confirm('Delete?')) return; await sb.from('blog_posts').delete().eq('id', id); load(); }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-display text-3xl font-semibold">Blog</h1>
        <Button variant="accent" onClick={create}><Plus className="h-4 w-4"/>New post</Button>
      </div>
      <div className="rounded-xl border border-border divide-y divide-border">
        {rows.length === 0 && <div className="p-6 text-muted-foreground text-sm">No posts yet.</div>}
        {rows.map(p => (
          <div key={p.id} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.is_published ? 'Published' : 'Draft'} · /{p.slug}</div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" asChild><Link href={`/admin/blog/${p.id}/edit`}><Pencil className="h-4 w-4"/></Link></Button>
              <Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="h-4 w-4"/></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
