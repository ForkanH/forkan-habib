'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const sb = createClient();
    const { error } = await sb.auth.signInWithPassword({ email: String(fd.get('email')), password: String(fd.get('password')) });
    setLoading(false);
    if (error) return toast.error(error.message);
    router.replace('/admin');
    router.refresh();
  }
  return (
    <div className="min-h-screen grid place-items-center px-6 bg-background">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-border p-8 space-y-5">
        <div>
          <div className="font-display text-2xl font-semibold">Admin sign in</div>
          <p className="text-sm text-muted-foreground mt-1">Forkan portfolio control panel.</p>
          {search.get('error') === 'forbidden' && <p className="text-sm text-red-500 mt-2">Account is not an admin.</p>}
        </div>
        <div><Label>Email</Label><Input name="email" type="email" required className="mt-1.5"/></div>
        <div><Label>Password</Label><Input name="password" type="password" required className="mt-1.5"/></div>
        <Button type="submit" variant="accent" className="w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</Button>
      </form>
    </div>
  );
}
