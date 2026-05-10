-- Run this script in your Supabase SQL Editor to add the new columns
alter table public.projects
add column if not exists github_url text,
add column if not exists client text,
add column if not exists role text,
add column if not exists duration text;
