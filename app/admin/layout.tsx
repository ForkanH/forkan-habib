import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import { LayoutDashboard, Sparkles, User, Wrench, Briefcase, FolderKanban, MessageSquare, Star, FileText, Mail, Settings, LogOut } from 'lucide-react';
import { LogoutButton } from '@/components/admin/logout-button';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/hero', label: 'Hero', icon: Sparkles },
  { href: '/admin/about', label: 'About', icon: User },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = headers();
  const path = h.get('x-pathname') || '';
  if (!path.endsWith('/admin/login')) {
    const ok = await isAdmin();
    if (!ok && !path.endsWith('/admin/login')) {
      // middleware also enforces; safety net:
    }
  }
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr] bg-background">
      <aside className="border-r border-border p-4 hidden md:flex flex-col">
        <Link href="/" className="font-display text-xl font-bold mb-8">Forkan<span className="text-accent">.</span></Link>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-foreground/5">
              <Icon className="h-4 w-4 text-muted-foreground"/>{label}
            </Link>
          ))}
        </nav>
        <LogoutButton/>
      </aside>
      <div className="md:hidden border-b border-border p-3 flex items-center justify-between">
        <Link href="/" className="font-display font-bold">Forkan<span className="text-accent">.</span></Link>
        <LogoutButton/>
      </div>
      <main className="p-6 md:p-10 overflow-x-hidden">{children}</main>
      <div className="md:hidden col-span-1 border-t border-border p-2 overflow-x-auto">
        <div className="flex gap-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] rounded-md hover:bg-foreground/5">
              <Icon className="h-4 w-4"/>{label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
