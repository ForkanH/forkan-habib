import Link from 'next/link';
import { Github, Linkedin, Facebook, Youtube } from 'lucide-react';
export function Footer({ socials = {} as Record<string,string> }) {
  return (
    <footer className="border-t border-border mt-24">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-display text-xl font-bold">Forkan<span className="text-accent">.</span></div>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">AI Automation Expert. Building intelligent systems that work while you sleep.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/#about" className="text-muted-foreground hover:text-foreground">About</Link>
          <Link href="/#services" className="text-muted-foreground hover:text-foreground">Services</Link>
          <Link href="/#projects" className="text-muted-foreground hover:text-foreground">Projects</Link>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link>
          <Link href="/#contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
        </div>
        <div>
          <div className="flex gap-3">
            {socials.linkedin && <a href={socials.linkedin} aria-label="LinkedIn" className="text-muted-foreground hover:text-accent"><Linkedin className="h-5 w-5"/></a>}
            {socials.github && <a href={socials.github} aria-label="GitHub" className="text-muted-foreground hover:text-accent"><Github className="h-5 w-5"/></a>}
            {socials.facebook && <a href={socials.facebook} aria-label="Facebook" className="text-muted-foreground hover:text-accent"><Facebook className="h-5 w-5"/></a>}
            {socials.youtube && <a href={socials.youtube} aria-label="YouTube" className="text-muted-foreground hover:text-accent"><Youtube className="h-5 w-5"/></a>}
          </div>
          <p className="text-xs text-muted-foreground mt-6">Built with Next.js & ❤️ in Bangladesh.</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Forkan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
