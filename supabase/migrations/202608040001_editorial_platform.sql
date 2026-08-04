create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published', 'archived');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'referred', 'converted', 'closed');

create table public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'editor' check (role in ('editor', 'administrator')),
  created_at timestamptz not null default now()
);

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff_profiles
    where user_id = (select auth.uid())
  );
$$;

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null default '{"en":"","pt":""}',
  excerpt jsonb not null default '{"en":"","pt":""}',
  body jsonb not null default '{"en":"","pt":""}',
  category text not null default 'Family guide',
  author text not null,
  hero_image_url text,
  hero_image_alt jsonb not null default '{"en":"","pt":""}',
  seo_title jsonb not null default '{"en":"","pt":""}',
  seo_description jsonb not null default '{"en":"","pt":""}',
  reading_time text not null default '4 min read',
  link_policy text not null default 'follow' check (link_policy in ('follow', 'nofollow')),
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.schools (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary jsonb not null default '{"en":"","pt":""}',
  description jsonb not null default '{"en":"","pt":""}',
  address text not null default '',
  region text not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  website_url text,
  telephone text,
  admissions_email text,
  tuition_from numeric(12,2),
  tuition_to numeric(12,2),
  fee_currency text not null default 'EUR',
  fee_year text,
  application_fee numeric(12,2),
  registration_fee numeric(12,2),
  stages text[] not null default '{}',
  curricula text[] not null default '{}',
  languages text[] not null default '{}',
  provider_type text not null default 'International school',
  support_services text[] not null default '{}',
  facilities text[] not null default '{}',
  transport_available boolean not null default false,
  boarding_available boolean not null default false,
  logo_url text,
  cover_image_url text,
  gallery_urls text[] not null default '{}',
  prospectus_url text,
  video_url text,
  verified boolean not null default false,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.magazines (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null default '{"en":"","pt":""}',
  description jsonb not null default '{"en":"","pt":""}',
  issue_number text not null,
  cover_date date,
  cover_image_url text,
  document_url text,
  external_reader_url text,
  allow_download boolean not null default true,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title jsonb not null default '{"en":"","pt":""}',
  description jsonb not null default '{"en":"","pt":""}',
  summary jsonb not null default '{"en":"","pt":""}',
  institution text not null,
  location text not null,
  category text not null,
  employment_type text not null,
  salary text,
  application_email text,
  application_url text,
  closes_at date,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  source text not null,
  source_path text,
  school_id uuid references public.schools(id) on delete set null,
  name text not null,
  email text not null,
  telephone text,
  organisation text,
  subject text,
  message text not null,
  consent boolean not null,
  status public.lead_status not null default 'new',
  assigned_to uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  staff_user_id uuid references auth.users(id) on delete set null,
  activity_type text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index articles_status_published_idx on public.articles(status, published_at desc);
create index schools_status_region_idx on public.schools(status, region);
create index jobs_status_closes_idx on public.jobs(status, closes_at);
create index leads_status_created_idx on public.leads(status, created_at desc);
create index lead_activities_lead_idx on public.lead_activities(lead_id, created_at desc);

alter table public.staff_profiles enable row level security;
alter table public.articles enable row level security;
alter table public.schools enable row level security;
alter table public.magazines enable row level security;
alter table public.jobs enable row level security;
alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;

create policy "Published articles are public" on public.articles for select to anon, authenticated
using (status = 'published' or public.is_editor());
create policy "Published schools are public" on public.schools for select to anon, authenticated
using (status = 'published' or public.is_editor());
create policy "Published magazines are public" on public.magazines for select to anon, authenticated
using (status = 'published' or public.is_editor());
create policy "Published current jobs are public" on public.jobs for select to anon, authenticated
using ((status = 'published' and (closes_at is null or closes_at >= current_date)) or public.is_editor());

create policy "Editors manage articles" on public.articles for all to authenticated
using (public.is_editor()) with check (public.is_editor());
create policy "Editors manage schools" on public.schools for all to authenticated
using (public.is_editor()) with check (public.is_editor());
create policy "Editors manage magazines" on public.magazines for all to authenticated
using (public.is_editor()) with check (public.is_editor());
create policy "Editors manage jobs" on public.jobs for all to authenticated
using (public.is_editor()) with check (public.is_editor());
create policy "Editors view staff profiles" on public.staff_profiles for select to authenticated
using (public.is_editor());
create policy "Editors manage leads" on public.leads for all to authenticated
using (public.is_editor()) with check (public.is_editor());
create policy "Editors manage lead activity" on public.lead_activities for all to authenticated
using (public.is_editor()) with check (public.is_editor());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('editorial-images', 'editorial-images', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif']),
  ('magazine-editions', 'magazine-editions', true, 52428800, array['application/pdf'])
on conflict (id) do nothing;

create policy "Public editorial media can be read" on storage.objects for select to anon, authenticated
using (bucket_id in ('editorial-images', 'magazine-editions'));
create policy "Editors upload editorial media" on storage.objects for insert to authenticated
with check (bucket_id in ('editorial-images', 'magazine-editions') and public.is_editor());
create policy "Editors update editorial media" on storage.objects for update to authenticated
using (bucket_id in ('editorial-images', 'magazine-editions') and public.is_editor())
with check (bucket_id in ('editorial-images', 'magazine-editions') and public.is_editor());
create policy "Editors delete editorial media" on storage.objects for delete to authenticated
using (bucket_id in ('editorial-images', 'magazine-editions') and public.is_editor());

grant execute on function public.is_editor() to anon, authenticated;
