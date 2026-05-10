import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { createClient } from '@/lib/supabase/server';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const sb = createClient();
  const { data } = await sb.from('about').select('social_links').limit(1).maybeSingle();
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1">{children}</main>
      <Footer socials={data?.social_links ?? {}}/>
    </div>
  );
}
