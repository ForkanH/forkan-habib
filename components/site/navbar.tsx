'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

const links = [
  { href: '/#about', label: 'About' },
  { href: '/#services', label: 'Services' },
  { href: '/#projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">Forkan<span className="text-accent">.</span></Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => <Link key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</Link>)}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle/>
          <Button variant="accent" size="sm" asChild><Link href="/#contact">Hire Me</Link></Button>
        </div>
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle/>
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open menu"><Menu className="h-5 w-5"/></Button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <span className="font-display text-xl font-bold">Forkan<span className="text-accent">.</span></span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-5 w-5"/></Button>
          </div>
          <nav className="container flex flex-col gap-4 pt-4">
            {links.map(l => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-2xl font-display">{l.label}</Link>)}
            <Button variant="accent" asChild className="mt-4 w-full"><Link href="/#contact" onClick={() => setOpen(false)}>Hire Me</Link></Button>
          </nav>
        </div>
      )}
    </header>
  );
}
