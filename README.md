# Forkan — AI Automation Portfolio

A production-ready, dark-first personal portfolio + admin CMS built with Next.js 14, Supabase, and Tailwind. Self-host on Coolify or any Docker host.

## Stack
- Next.js 14 App Router + TypeScript
- Tailwind CSS + Framer Motion
- Supabase (Postgres + Auth + Storage)
- Tiptap (blog rich text), dnd-kit (drag-and-drop)
- Resend (optional contact-form email)

## Quick start (local)
```bash
cp .env.example .env.local       # fill in values
npm install
npm run dev                      # http://localhost:3000
```

## Supabase setup
1. Create a new Supabase project.
2. Open the SQL Editor and run **`supabase/schema.sql`** (creates tables, RLS, storage buckets, seed data).
3. Copy your **Project URL**, **anon key**, and **service-role key** into `.env.local`.

### Create your admin user
1. Go to **Authentication → Users → Add user** in Supabase, create yourself with email + password.
2. Copy the new user's UUID.
3. Run in SQL Editor:
   ```sql
   insert into public.admins (user_id) values ('YOUR-USER-UUID');
   ```
4. Visit `/admin/login` and sign in.

## Email notifications (optional)
Set `RESEND_API_KEY` and `ADMIN_NOTIFICATION_EMAIL` in env to receive contact form submissions by email. The site works without it.

## Deploy on Coolify
1. Push this repo to GitHub.
2. In Coolify: **New Resource → Application → Public/Private repo**.
3. Build pack: **Dockerfile** (auto-detected).
4. Set the env vars from `.env.example`.
5. Expose port **3000** and assign your domain.
6. Deploy.

## Project structure
```
app/                Next.js routes (site + admin + api)
components/         Reusable UI
lib/                Supabase clients, validation, helpers
supabase/           schema.sql with seed data
public/             SVGs, favicon
```

## Customizing
- Colors: `app/globals.css` (`--accent`)
- Fonts: `app/layout.tsx`
- Site sections: edit content directly via `/admin`

Built with Next.js & ❤️ in Bangladesh.
