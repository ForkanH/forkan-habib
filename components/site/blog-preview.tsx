import Link from 'next/link';
import Image from 'next/image';
import { Section } from './section';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function BlogPreview({ posts }: { posts: any[] }) {
  if (!posts.length) return null;
  return (
    <Section id="blog" eyebrow="Insights" title="Latest writing.">
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map(p => (
          <Link key={p.id} href={`/blog/${p.slug}`} className="group rounded-xl border border-border overflow-hidden hover:border-accent/50 transition-colors">
            <div className="aspect-[16/9] bg-gradient-to-br from-accent/10 to-transparent relative">
              {p.cover_url && <Image src={p.cover_url} alt={p.title} fill className="object-cover"/>}
            </div>
            <div className="p-5">
              <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()} · {p.reading_time} min read</div>
              <h3 className="font-display text-lg font-semibold mt-2 group-hover:text-accent transition-colors">{p.title}</h3>
              {p.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8"><Button variant="outline" asChild><Link href="/blog">View all posts <ArrowRight className="h-4 w-4"/></Link></Button></div>
    </Section>
  );
}
