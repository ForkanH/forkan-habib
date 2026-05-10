import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
export default async function AdminDashboard() {
  const sb = createClient();
  const [{ count: projects }, { count: posts }, { count: unread }, { data: { user } }] = await Promise.all([
    sb.from('projects').select('*', { count: 'exact', head: true }),
    sb.from('blog_posts').select('*', { count: 'exact', head: true }),
    sb.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false),
    sb.auth.getUser(),
  ]);
  const items = [
    { label: 'Projects', value: projects ?? 0 },
    { label: 'Blog posts', value: posts ?? 0 },
    { label: 'Unread messages', value: unread ?? 0 },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold mb-2">Welcome back.</h1>
      <p className="text-sm text-muted-foreground mb-8">Signed in as {user?.email} · last sign-in {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '—'}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(i => (
          <Card key={i.label}><CardContent className="pt-6"><div className="text-sm text-muted-foreground">{i.label}</div><div className="font-display text-4xl font-semibold mt-2">{i.value}</div></CardContent></Card>
        ))}
      </div>
    </div>
  );
}
