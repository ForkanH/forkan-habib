'use client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
export function LogoutButton() {
  const router = useRouter();
  return (
    <Button variant="ghost" size="sm" className="justify-start" onClick={async () => {
      await createClient().auth.signOut();
      router.replace('/admin/login');
      router.refresh();
    }}><LogOut className="h-4 w-4"/>Sign out</Button>
  );
}
