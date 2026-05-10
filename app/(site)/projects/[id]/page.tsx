import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;
export default async function ProjectPage({ params }: { params: { id: string } }) {
  const sb = createClient();
  const { data: p } = await sb.from('projects').select('*').eq('id', params.id).maybeSingle();
  if (!p) notFound();
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">{p.title}</h1>
      <p className="text-lg text-muted-foreground mt-4 max-w-2xl">{p.description}</p>
      <div className="flex flex-wrap gap-1.5 mt-4">
        {(p.tags || []).map((t: string) => <Badge key={t}>{t}</Badge>)}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border mt-8">
        {p.client && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Client</div>
            <div className="font-medium">{p.client}</div>
          </div>
        )}
        {p.role && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Role</div>
            <div className="font-medium">{p.role}</div>
          </div>
        )}
        {p.duration && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Duration</div>
            <div className="font-medium">{p.duration}</div>
          </div>
        )}
        {(p.demo_url || p.github_url) && (
          <div>
            <div className="text-sm text-muted-foreground mb-1">Links</div>
            <div className="flex flex-wrap gap-3 font-medium">
              {p.demo_url && (
                <a href={p.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent transition-colors">
                  <ExternalLink className="h-4 w-4" /> Live
                </a>
              )}
              {p.github_url && (
                <a href={p.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-accent transition-colors">
                  <Github className="h-4 w-4" /> Code
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {p.thumbnail_url && (
        <div className="aspect-[16/9] relative my-8 rounded-xl overflow-hidden border border-border">
          <Image src={p.thumbnail_url} alt={p.title} fill className="object-cover"/>
        </div>
      )}
      {p.case_study && <div className="prose prose-invert max-w-none mt-8" dangerouslySetInnerHTML={{ __html: p.case_study }}/>}
    </div>
  );
}
