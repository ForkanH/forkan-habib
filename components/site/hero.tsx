'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';

const ROLES = ['AI Automation Expert', 'n8n Workflow Builder', 'Vibe Coder'];

export function Hero({ stats, cvUrl }: { stats: { label: string; value: string }[]; cvUrl?: string }) {
  const [text, setText] = useState('');
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const full = ROLES[i];
    const t = setTimeout(() => {
      if (!del && text === full) { setTimeout(() => setDel(true), 1500); return; }
      if (del && text === '') { setDel(false); setI((i + 1) % ROLES.length); return; }
      setText(del ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
    }, del ? 40 : 70);
    return () => clearTimeout(t);
  }, [text, del, i]);

  return (
    <section className="relative overflow-hidden">
      {/* dot grid */}
      <div aria-hidden className="absolute inset-0 -z-10 opacity-[0.15]"
        style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-to-b from-accent/10 to-transparent" />
      <div className="container pt-6 pb-10 md:pt-10 md:pb-16">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-sm font-mono text-accent mb-4">Hi, I&apos;m Forkan 👋</p>
              <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] max-w-4xl">
                <span className="block">{text}<span className="inline-block w-[2px] h-[0.9em] align-middle bg-accent ml-1 animate-pulse" /></span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl">I build intelligent systems that work while you sleep.</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button variant="accent" size="lg" asChild><Link href="/#projects">See My Work <ArrowRight className="h-4 w-4" /></Link></Button>
              </div>
            </motion.div>
            {stats.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-3 gap-4 md:gap-8 mt-10 max-w-2xl">
                {stats.map(s => (
                  <div key={s.label} className="border-l-2 border-accent pl-4">
                    <div className="font-display text-2xl md:text-3xl font-semibold">{s.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:flex justify-end relative"
          >
            <div className="relative w-[550px] h-[550px]">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
              <Image
                src="/hero-image.png"
                alt="Forkan - AI Automation Expert"
                fill
                className="object-contain drop-shadow-2xl z-10"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
