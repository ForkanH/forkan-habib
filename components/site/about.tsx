import Image from 'next/image';
import { Section } from './section';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Facebook, Youtube } from 'lucide-react';

type Value = { title: string; description: string };
export function About({ data }: { data: any }) {
  const socials = data?.social_links ?? {};
  const values: Value[] = data?.values ?? [];
  return (
    <Section id="about" eyebrow="About" title="A craftsman of automated systems.">
      <div className="grid gap-10 md:grid-cols-[260px_1fr]">
        <div>
          <div className="aspect-square rounded-2xl border border-border overflow-hidden bg-gradient-to-br from-accent/10 to-transparent relative">
            {data?.photo_url ? (
              <Image src={data.photo_url} alt="Forkan" fill className="object-cover"/>
            ) : (
              <div className="absolute inset-0 grid place-items-center font-display text-6xl text-accent/40">F.</div>
            )}
          </div>
          <Badge className={`mt-4 ${data?.is_available ? 'border-accent text-accent' : 'border-muted-foreground text-muted-foreground'}`}>
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${data?.is_available ? 'bg-accent animate-pulse' : 'bg-muted-foreground'}`}/>
            {data?.is_available ? 'Open to projects' : 'Currently busy'}
          </Badge>
          <div className="flex gap-3 mt-4">
            {socials.linkedin && <a href={socials.linkedin} aria-label="LinkedIn" className="text-muted-foreground hover:text-accent"><Linkedin className="h-5 w-5"/></a>}
            {socials.github && <a href={socials.github} aria-label="GitHub" className="text-muted-foreground hover:text-accent"><Github className="h-5 w-5"/></a>}
            {socials.facebook && <a href={socials.facebook} aria-label="Facebook" className="text-muted-foreground hover:text-accent"><Facebook className="h-5 w-5"/></a>}
            {socials.youtube && <a href={socials.youtube} aria-label="YouTube" className="text-muted-foreground hover:text-accent"><Youtube className="h-5 w-5"/></a>}
          </div>
        </div>
        <div>
          <div className="space-y-4 text-base md:text-lg text-foreground/85">
            {data?.bio_1 && <p>{data.bio_1}</p>}
            {data?.bio_2 && <p>{data.bio_2}</p>}
            {data?.bio_3 && <p>{data.bio_3}</p>}
          </div>
          {values.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm font-mono uppercase tracking-widest text-accent mb-4">What I believe in</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {values.map(v => (
                  <div key={v.title} className="rounded-xl border border-border p-5">
                    <div className="h-8 w-8 rounded-md bg-accent/10 text-accent grid place-items-center mb-3">◆</div>
                    <div className="font-medium">{v.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
