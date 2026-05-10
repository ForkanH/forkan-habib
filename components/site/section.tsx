'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
export function Section({ id, eyebrow, title, children, className }: { id?: string; eyebrow?: string; title?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn('container py-20 md:py-28 scroll-mt-20', className)}>
      {(eyebrow || title) && (
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-10 max-w-2xl">
          {eyebrow && <div className="text-xs font-mono uppercase tracking-widest text-accent mb-2">{eyebrow}</div>}
          {title && <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>}
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.05 }}>
        {children}
      </motion.div>
    </section>
  );
}
