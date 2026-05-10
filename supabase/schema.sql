-- Forkan Portfolio schema
-- Run this once in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ============ ADMIN GATING ============
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = uid);
$$;

create policy "admins readable by self" on public.admins
  for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

-- ============ HERO STATS ============
create table if not exists public.hero_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  order_index int default 0
);
alter table public.hero_stats enable row level security;
create policy "public read hero_stats" on public.hero_stats for select using (true);
create policy "admin write hero_stats" on public.hero_stats for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ ABOUT ============
create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  bio_1 text,
  bio_2 text,
  bio_3 text,
  photo_url text,
  is_available boolean default true,
  social_links jsonb default '{}'::jsonb,
  values jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);
alter table public.about enable row level security;
create policy "public read about" on public.about for select using (true);
create policy "admin write about" on public.about for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ SKILLS ============
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  icon text,
  proficiency int,
  order_index int default 0
);
alter table public.skills enable row level security;
create policy "public read skills" on public.skills for select using (true);
create policy "admin write skills" on public.skills for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ SERVICES ============
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  price text,
  cta_link text,
  is_visible boolean default true,
  order_index int default 0
);
alter table public.services enable row level security;
create policy "public read services" on public.services for select using (is_visible = true or public.is_admin(auth.uid()));
create policy "admin write services" on public.services for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ PROJECTS ============
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail_url text,
  tags text[] default '{}',
  demo_url text,
  github_url text,
  client text,
  role text,
  duration text,
  case_study text,
  is_featured boolean default false,
  is_visible boolean default true,
  order_index int default 0,
  created_at timestamptz default now()
);
alter table public.projects enable row level security;
create policy "public read projects" on public.projects for select using (is_visible = true or public.is_admin(auth.uid()));
create policy "admin write projects" on public.projects for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ TESTIMONIALS ============
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  company text,
  photo_url text,
  text text not null,
  rating int default 5,
  is_visible boolean default true,
  order_index int default 0
);
alter table public.testimonials enable row level security;
create policy "public read testimonials" on public.testimonials for select using (is_visible = true or public.is_admin(auth.uid()));
create policy "admin write testimonials" on public.testimonials for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ BLOG ============
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_url text,
  tags text[] default '{}',
  reading_time int default 3,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.blog_posts enable row level security;
create policy "public read published posts" on public.blog_posts for select using (is_published = true or public.is_admin(auth.uid()));
create policy "admin write blog" on public.blog_posts for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ CONTACT ============
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);
alter table public.contacts enable row level security;
create policy "public insert contacts" on public.contacts for insert with check (true);
create policy "admin read contacts" on public.contacts for select using (public.is_admin(auth.uid()));
create policy "admin update contacts" on public.contacts for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin delete contacts" on public.contacts for delete using (public.is_admin(auth.uid()));

-- ============ SITE SETTINGS ============
create table if not exists public.site_settings (
  key text primary key,
  value text
);
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select using (true);
create policy "admin write settings" on public.site_settings for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ STORAGE ============
insert into storage.buckets (id, name, public) values
  ('avatars','avatars',true),
  ('projects','projects',true),
  ('blog','blog',true),
  ('cv','cv',true)
on conflict (id) do nothing;

-- Public read for all listed buckets
create policy "public read storage" on storage.objects
  for select using (bucket_id in ('avatars','projects','blog','cv'));

create policy "admin write storage" on storage.objects
  for insert with check (public.is_admin(auth.uid()) and bucket_id in ('avatars','projects','blog','cv'));

create policy "admin update storage" on storage.objects
  for update using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "admin delete storage" on storage.objects
  for delete using (public.is_admin(auth.uid()));

-- ============ SEED DATA ============
insert into public.hero_stats (label, value, order_index) values
  ('Projects delivered', '40+', 1),
  ('Workflows built', '120+', 2),
  ('Happy clients', '25+', 3)
on conflict do nothing;

insert into public.about (bio_1, bio_2, bio_3, is_available, social_links, values) values (
  'I''m Forkan — an AI automation specialist based in Bangladesh. I help founders and teams ship intelligent systems that quietly do the work of an entire department.',
  'For the past few years I''ve been deep in n8n workflows, self-hosted infrastructure, and AI-first product development — building things like UkilAI, AI Chobiwala, and bilingual legal tools.',
  'I treat every project as a craft: minimal moving parts, sensible defaults, and code you can hand off without a manual. If it can be automated, I''ll find a way.',
  true,
  '{"linkedin":"https://linkedin.com/in/forkan","github":"https://github.com/forkan","facebook":"https://facebook.com/forkan","youtube":"https://youtube.com/@forkan"}'::jsonb,
  '[
    {"title":"Automate the boring","description":"Workflows should free your hours, not consume them."},
    {"title":"Own your stack","description":"Self-hosted, portable, no vendor lock-in."},
    {"title":"Ship craft","description":"Minimal interfaces. Reliable systems. Quiet quality."}
  ]'::jsonb
);

insert into public.skills (name, category, icon, proficiency, order_index) values
  ('n8n','AI & Automation','Workflow',95,1),
  ('OpenAI / Anthropic APIs','AI & Automation','Brain',90,2),
  ('LangChain','AI & Automation','Link',80,3),
  ('Vector DBs','AI & Automation','Database',75,4),
  ('Coolify','Infrastructure','Server',92,1),
  ('Docker','Infrastructure','Container',90,2),
  ('VPS / Hetzner','Infrastructure','Cloud',85,3),
  ('Supabase','Infrastructure','Database',88,4),
  ('Next.js','Dev Tools','Code',90,1),
  ('TypeScript','Dev Tools','FileCode',88,2),
  ('Python','Dev Tools','Terminal',82,3),
  ('Git','Dev Tools','GitBranch',90,4),
  ('Figma','Design & Marketing','Figma',75,1),
  ('Meta Ads','Design & Marketing','Megaphone',80,2),
  ('Copywriting','Design & Marketing','PenTool',78,3);

insert into public.services (title, description, icon, price, order_index) values
  ('n8n Workflow Design','Design and deploy production workflows that connect every tool in your stack.','Workflow','from $500',1),
  ('AI-Powered App Development','Custom apps with LLMs, RAG, agents — built to ship and scale.','Sparkles','from $2k',2),
  ('Self-Hosted Infrastructure','VPS + Coolify setup. Own your stack with one-click deploys.','Server','from $400',3),
  ('Facebook Ads & Growth Automation','Funnels, automation, and reporting that runs itself.','Megaphone','from $600',4),
  ('AI Photo Editing Solutions','White-label AI editors and pipelines for studios.','Image','from $1.2k',5),
  ('Custom AI Chatbot Integration','Site-aware, multilingual chatbots for support and sales.','MessageSquare','from $800',6);

insert into public.projects (title, description, tags, demo_url, is_featured, order_index) values
  ('UkilAI','Legal tech mobile app for Bangladeshi lawyers — case lookup, AI drafting, and bilingual research.', ARRAY['Legal Tech','AI Apps'], 'https://ukilai.com', true, 1),
  ('AI Chobiwala','AI photo editing platform with one-tap restorations, background swaps, and studio finishes.', ARRAY['AI Apps','Design'], 'https://aichobiwala.com', true, 2),
  ('Bilingual Legal Drafts','Generate English + Bengali legal documents with structured templates and LLM polish.', ARRAY['Legal Tech','Automation'], 'https://example.com', true, 3),
  ('n8n Lead Pipeline','End-to-end lead capture, enrichment, and CRM sync via n8n.', ARRAY['Automation'], 'https://example.com', false, 4);

insert into public.testimonials (name, role, company, text, rating, order_index) values
  ('Rashed Khan','Founder','LegalEdge','Forkan rebuilt our intake in n8n and cut response time by 80%. Pure craft.',5,1),
  ('Sadia Rahman','PM','Studio Bloom','UkilAI wouldn''t exist without him. He thinks in systems and ships fast.',5,2),
  ('Tanvir Ahmed','CTO','Northwind','Self-hosted setup on Coolify saved us four figures monthly. Bulletproof docs.',5,3);

insert into public.blog_posts (title, slug, excerpt, content, tags, reading_time, is_published) values
  ('Why I self-host everything in 2025','self-host-2025','Owning your stack isn''t paranoia — it''s leverage.','<p>Self-hosting on Coolify gives me speed, cost control, and zero vendor anxiety...</p>', ARRAY['Infrastructure','Coolify'], 4, true);

insert into public.site_settings (key, value) values
  ('site_title','Forkan — AI Automation Expert'),
  ('site_description','I build intelligent systems that work while you sleep. n8n workflows, self-hosted infra, and AI-first products from Bangladesh.'),
  ('contact_email','hello@forkan.dev'),
  ('whatsapp_url','https://wa.me/8801000000000'),
  ('cv_url','')
on conflict (key) do nothing;
