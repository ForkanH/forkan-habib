'use client';
import { useState } from 'react';
import { Section } from './section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Linkedin, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Contact({ settings }: { settings: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setLoading(false);
    if (r.ok) { toast.success('Message sent. I\'ll get back soon.'); (e.target as HTMLFormElement).reset(); }
    else { const j = await r.json().catch(() => ({})); toast.error(j.error || 'Failed to send'); }
  }
  return (
    <Section id="contact" eyebrow="Contact" title="Let's build something.">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-muted-foreground max-w-md">Got an idea, a workflow that’s killing you, or a system you want owned? Drop a line.</p>
          <div className="space-y-3">
            {settings.contact_email && <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-3 hover:text-accent"><Mail className="h-4 w-4 text-accent" />{settings.contact_email}</a>}
            {settings.whatsapp_url && <a href={settings.whatsapp_url} className="flex items-center gap-3 hover:text-accent"><MessageCircle className="h-4 w-4 text-accent" />WhatsApp</a>}
            <a href="https://www.linkedin.com/in/forkan-ai-automation" className="flex items-center gap-3 hover:text-accent"><Linkedin className="h-4 w-4 text-accent" />LinkedIn</a>
          </div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border p-6">
          <div><Label htmlFor="name">Name</Label><Input id="name" name="name" required maxLength={100} className="mt-1.5" /></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required maxLength={255} className="mt-1.5" /></div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <select id="subject" name="subject" required className="mt-1.5 flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm">
              <option>General</option><option>Project Inquiry</option><option>Collaboration</option>
            </select>
          </div>
          <div><Label htmlFor="message">Message</Label><Textarea id="message" name="message" required maxLength={2000} className="mt-1.5" /></div>
          <Button type="submit" variant="accent" disabled={loading} className="w-full">{loading ? 'Sending…' : 'Send message'}</Button>
        </form>
      </div>
    </Section>
  );
}
