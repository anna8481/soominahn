-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- ============================================================================
-- artworks (shown on / carousel and /work yearly grid)
-- ============================================================================
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  statement text,            -- artist statement / description
  medium text,
  dimensions text,           -- e.g. "120 x 90 cm"
  image_url text,
  featured boolean not null default false,  -- show in home carousel
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artworks_year_order_idx
  on public.artworks (year desc, display_order asc, created_at desc);

-- ============================================================================
-- cv_entries (shown on /cv, grouped by section)
-- ============================================================================
-- section values: 'education' | 'solo' | 'group' | 'award' | 'collection' | 'info'
create table if not exists public.cv_entries (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  year int,                  -- nullable for 'info' rows
  year_end int,              -- optional range end (e.g. education 2018–2020)
  title text not null,       -- exhibition/program/award title
  location text,             -- venue / institution / city
  detail text,               -- extra notes
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cv_entries_section_year_idx
  on public.cv_entries (section, year desc nulls last, display_order asc);

-- ============================================================================
-- shared updated_at trigger
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists artworks_set_updated_at on public.artworks;
create trigger artworks_set_updated_at
  before update on public.artworks
  for each row execute function public.set_updated_at();

drop trigger if exists cv_entries_set_updated_at on public.cv_entries;
create trigger cv_entries_set_updated_at
  before update on public.cv_entries
  for each row execute function public.set_updated_at();

-- ============================================================================
-- RLS: public read; writes go through server actions w/ service role key
-- ============================================================================
alter table public.artworks enable row level security;
alter table public.cv_entries enable row level security;

drop policy if exists "artworks public read" on public.artworks;
create policy "artworks public read"
  on public.artworks for select
  using (true);

drop policy if exists "cv_entries public read" on public.cv_entries;
create policy "cv_entries public read"
  on public.cv_entries for select
  using (true);

-- ============================================================================
-- Storage bucket: artworks (public read)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('artworks', 'artworks', true)
on conflict (id) do update set public = true;

drop policy if exists "artworks bucket public read" on storage.objects;
create policy "artworks bucket public read"
  on storage.objects for select
  using (bucket_id = 'artworks');
