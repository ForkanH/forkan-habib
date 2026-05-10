import { Section } from './section';
import { Star } from 'lucide-react';
export function Testimonials({ items }: { items: any[] }) {
  if (!items.length) return null;
  return (
    <Section id="testimonials" eyebrow="Words" title="What people say.">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map(t => (
          <div key={t.id} className="rounded-xl border border-border p-6 flex flex-col">
            <div className="flex gap-0.5 text-accent mb-4">{Array.from({length: t.rating || 5}).map((_,i) => <Star key={i} className="h-4 w-4 fill-current"/>)}</div>
            <p className="text-foreground/90 flex-1">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 text-accent grid place-items-center font-semibold">{t.name?.[0]}</div>
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
