import { Section } from './section';
const CATS = ['AI & Automation','Infrastructure','Dev Tools','Design & Marketing'];
export function Skills({ skills }: { skills: any[] }) {
  return (
    <Section id="skills" eyebrow="Stack" title="Tools I reach for.">
      <div className="grid gap-6 md:grid-cols-2">
        {CATS.map(cat => {
          const items = skills.filter(s => s.category === cat);
          if (!items.length) return null;
          return (
            <div key={cat} className="rounded-xl border border-border p-6">
              <div className="text-sm font-mono uppercase tracking-widest text-accent mb-4">{cat}</div>
              <div className="flex flex-wrap gap-2">
                {items.map(s => (
                  <span key={s.id} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm">
                    <span className="text-accent">●</span>{s.name}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
