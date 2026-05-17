# soomin ahn — portfolio

Next.js + Supabase site for Soomin Ahn.

- **/** — home, carousel of featured artworks (image + title + statement + size)
- **/work** — yearly grid of all artworks
- **/cv** — text CV (education, exhibitions, awards, info)
- **/admin** — password-protected admin to manage everything

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Supabase Postgres (data) + Supabase Storage (images)
- Cookie-based admin auth (HMAC-signed, single password)
- Deployed on Vercel with GitHub auto-deploy

---

## 1. Set up Supabase

1. Create a project at https://supabase.com (free tier is fine).
2. Open **SQL Editor** and paste the contents of [`supabase-schema.sql`](./supabase-schema.sql), then **Run**. This creates the `artworks` and `cv_entries` tables, sets RLS, and creates the public `artworks` storage bucket.
3. Go to **Project Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` (server-only!)

## 2. Local env

```bash
cp .env.local.example .env.local
# Edit .env.local — fill in Supabase keys, choose an ADMIN_PASSWORD,
# and generate AUTH_SECRET with:
openssl rand -hex 32
```

## 3. Run locally

```bash
npm install
npm run dev
# → http://localhost:3000
# → http://localhost:3000/admin/login
```

## 4. Push to GitHub

```bash
git add -A
git commit -m "Initial commit"

# create a new empty repo on GitHub (private is fine), then:
git remote add origin git@github.com:YOUR-USERNAME/soom.git
git branch -M main
git push -u origin main
```

## 5. Deploy on Vercel (GitHub auto-deploy)

1. Go to https://vercel.com/new
2. **Import** the GitHub repo you just pushed.
3. Framework: **Next.js** (auto-detected). Leave build settings as-is.
4. **Environment Variables** — add all 5 keys from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `AUTH_SECRET`
5. Click **Deploy**.

Every push to `main` will now auto-deploy. Pull requests get preview URLs.

---

## File structure

```
app/
  layout.tsx              site shell (nav: home / work / cv)
  page.tsx                home — server fetch
  HomeCarousel.tsx        client carousel
  work/page.tsx           yearly grid
  cv/page.tsx             text CV grouped by section
  admin/
    page.tsx              dashboard
    login/page.tsx        password form
    actions.ts            server actions (login, CRUD, upload)
    artworks/             artwork list + new + edit
    cv/                   cv-entry list + new + edit
lib/
  auth.ts                 HMAC session token
  supabase/public.ts      anon client (read)
  supabase/admin.ts       service-role client (write)
  types.ts                Artwork, CVEntry, CV_SECTIONS
middleware.ts             protects /admin/* (except /admin/login)
supabase-schema.sql       run in Supabase SQL editor
```

## Notes

- Public pages (`/`, `/work`, `/cv`) use ISR with a 60-second revalidation window. After admin edits, affected paths are revalidated immediately via `revalidatePath`.
- All admin writes go through server actions using the service-role key. The service-role key is never exposed to the browser.
- Image uploads go to the public `artworks` storage bucket; the public URL is stored in `artworks.image_url`.
- To rotate the admin password: update `ADMIN_PASSWORD` in Vercel and redeploy. To force-logout all sessions, also rotate `AUTH_SECRET` (existing cookies will fail signature check).
