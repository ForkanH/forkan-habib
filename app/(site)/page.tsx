import { createClient } from '@/lib/supabase/server';
import { Hero } from '@/components/site/hero';
import { About } from '@/components/site/about';
import { Skills } from '@/components/site/skills';
import { Services } from '@/components/site/services';
import { Projects } from '@/components/site/projects';
import { Testimonials } from '@/components/site/testimonials';
import { BlogPreview } from '@/components/site/blog-preview';
import { Contact } from '@/components/site/contact';

export const revalidate = 60;

export default async function HomePage() {
  const sb = createClient();
  const [stats, about, skills, services, projects, testimonials, posts, settingsRows] = await Promise.all([
    sb.from('hero_stats').select('*').order('order_index'),
    sb.from('about').select('*').limit(1).maybeSingle(),
    sb.from('skills').select('*').order('order_index'),
    sb.from('services').select('*').eq('is_visible', true).order('order_index'),
    sb.from('projects').select('*').eq('is_visible', true).order('order_index'),
    sb.from('testimonials').select('*').eq('is_visible', true).order('order_index'),
    sb.from('blog_posts').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(3),
    sb.from('site_settings').select('*'),
  ]);
  const settings: Record<string,string> = Object.fromEntries((settingsRows.data || []).map((r: any) => [r.key, r.value]));
  return (
    <>
      <Hero stats={stats.data || []} cvUrl={settings.cv_url}/>
      <About data={about.data}/>
      <Skills skills={skills.data || []}/>
      <Services services={services.data || []}/>
      <Projects projects={projects.data || []}/>
      <Testimonials items={testimonials.data || []}/>
      <BlogPreview posts={posts.data || []}/>
      <Contact settings={settings}/>
    </>
  );
}
