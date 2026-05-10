import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
export const revalidate = 60;
export const metadata = { title: 'Blog' };
export default async function BlogPage() {
  const sb = createClient();
  const { data: posts = [] } = await sb.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false });
  return (
    <div className="container py-16">
      <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-10">Insights</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {(posts || []).map((p: any) => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="group rounded-xl border border-border overflow-hidden hover:border-accent/50">
            <div className="aspect-[16/9] bg-gradient-to-br from-accent/10 to-transparent relative">
              {p.cover_url && <Image src={p.cover_url} alt={p.title} fill className="object-cover"/>}
            </div>
            <div className="p-5">
              <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()} · {p.reading_time} min</div>
              <h2 className="font-display text-lg font-semibold mt-2 group-hover:text-accent">{p.title}</h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
