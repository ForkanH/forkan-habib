import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const revalidate = 60;
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const sb = createClient();
  const { data } = await sb.from('blog_posts').select('title,excerpt,cover_url').eq('slug', params.slug).maybeSingle();
  if (!data) return { title: 'Post not found' };
  return { title: data.title, description: data.excerpt || undefined, openGraph: { title: data.title, description: data.excerpt || undefined, images: data.cover_url ? [data.cover_url] : [] } };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const sb = createClient();
  const { data: post } = await sb.from('blog_posts').select('*').eq('slug', params.slug).eq('is_published', true).maybeSingle();
  if (!post) notFound();
  return (
    <article className="container py-16 max-w-3xl">
      <div className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()} · {post.reading_time} min read</div>
      <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mt-3">{post.title}</h1>
      {post.excerpt && <p className="text-lg text-muted-foreground mt-4">{post.excerpt}</p>}
      {post.cover_url && (
        <div className="aspect-[16/9] relative my-8 rounded-xl overflow-hidden border border-border">
          <Image src={post.cover_url} alt={post.title} fill className="object-cover"/>
        </div>
      )}
      <div className="prose prose-invert max-w-none mt-8 [&>p]:mb-4 [&>h2]:text-2xl [&>h2]:font-display [&>h2]:mt-8 [&>h2]:mb-3 [&>a]:text-accent" dangerouslySetInnerHTML={{ __html: post.content || '' }}/>
    </article>
  );
}
