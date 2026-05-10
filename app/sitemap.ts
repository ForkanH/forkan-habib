import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const sb = createClient();
  const { data: posts = [] } = await sb.from('blog_posts').select('slug,updated_at').eq('is_published', true);
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/blog`, lastModified: new Date() },
    ...((posts || []).map((p: any) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.updated_at) }))),
  ];
}
