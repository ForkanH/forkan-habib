'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Section } from './section';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Projects({ projects }: { projects: any[] }) {
  const allTags = useMemo(() => Array.from(new Set(projects.flatMap(p => p.tags || []))), [projects]);
  const [active, setActive] = useState<string>('All');
  const filtered = active === 'All' ? projects : projects.filter(p => p.tags?.includes(active));
  return (
    <Section id="projects" eyebrow="Work" title="Selected projects.">
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', ...allTags].map(t => (
          <button key={t} onClick={() => setActive(t)}
            className={cn('px-3 py-1.5 text-sm rounded-md border transition-colors',
              active === t ? 'bg-accent text-accent-foreground border-accent' : 'border-border hover:border-accent/50')}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map(p => (
          <article key={p.id} className="group rounded-xl border border-border overflow-hidden hover:border-accent/50 transition-colors">
            <div className="aspect-[16/10] bg-gradient-to-br from-accent/10 via-accent/5 to-transparent relative overflow-hidden">
              {p.thumbnail_url ? (
                <Image src={p.thumbnail_url} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="font-display text-3xl text-accent/40">{p.title}</div>
                </div>
              )}
              {p.is_featured && <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded">Featured</span>}
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-semibold">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {(p.tags || []).map((t: string) => <Badge key={t}>{t}</Badge>)}
              </div>
              <div className="flex gap-3 mt-6 text-sm">
                {p.demo_url && <a href={p.demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-accent">Live Demo <ExternalLink className="h-3 w-3"/></a>}
                {p.case_study && <Link href={`/projects/${p.id}`} className="inline-flex items-center gap-1 hover:text-accent">Case Study <FileText className="h-3 w-3"/></Link>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
