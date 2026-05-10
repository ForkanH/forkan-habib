import { Section } from './section';
import { Card, CardContent } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

function Icon({ name }: { name?: string }) {
  const C = (Icons as any)[name || 'Sparkles'] ?? Icons.Sparkles;
  return <C className="h-5 w-5"/>;
}
export function Services({ services }: { services: any[] }) {
  return (
    <Section id="services" eyebrow="Services" title="What I help teams ship.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map(s => (
          <Card key={s.id} className="group hover:border-accent/50 transition-colors">
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-md bg-accent/10 text-accent grid place-items-center mb-4"><Icon name={s.icon}/></div>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
              <div className="flex items-center justify-between mt-6 text-sm">
                {s.price && <span className="text-accent font-mono">{s.price}</span>}
                {s.cta_link && <a href={s.cta_link} className="inline-flex items-center gap-1 hover:text-accent">Learn more <ArrowUpRight className="h-3 w-3"/></a>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
