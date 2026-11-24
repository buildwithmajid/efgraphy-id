-- =============================================================
-- Efgraphy.id — Supabase schema
-- Jalankan seluruh file ini di Supabase Dashboard → SQL Editor.
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- Tabel ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  image_url text not null,
  location text,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  subtitle text,
  price_mode text not null default 'request_pricelist'
    check (price_mode in ('start_from', 'request_pricelist')),
  starting_price bigint,
  features jsonb not null default '[]'::jsonb,
  wa_message text,
  is_popular boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  event_type text,
  quote text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  video_url text not null,
  thumbnail_url text not null,
  aspect_ratio text not null default 'vertical'
    check (aspect_ratio in ('vertical', 'landscape')),
  duration text,
  location text,
  is_featured boolean not null default true,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.categories   enable row level security;
alter table public.portfolios   enable row level security;
alter table public.packages     enable row level security;
alter table public.testimonials enable row level security;
alter table public.videos       enable row level security;
alter table public.site_settings enable row level security;

-- Publik: hanya baca
create policy "public read categories"   on public.categories   for select using (true);
create policy "public read portfolios"   on public.portfolios   for select using (true);
create policy "public read packages"     on public.packages     for select using (is_active or auth.role() = 'authenticated');
create policy "public read testimonials" on public.testimonials for select using (is_active or auth.role() = 'authenticated');
create policy "public read videos"       on public.videos       for select using (is_active or auth.role() = 'authenticated');
create policy "public read settings"     on public.site_settings for select using (true);

-- Admin (login): kelola semua
create policy "admin write categories"   on public.categories   for all to authenticated using (true) with check (true);
create policy "admin write portfolios"   on public.portfolios   for all to authenticated using (true) with check (true);
create policy "admin write packages"     on public.packages     for all to authenticated using (true) with check (true);
create policy "admin write testimonials" on public.testimonials for all to authenticated using (true) with check (true);
create policy "admin write videos"       on public.videos       for all to authenticated using (true) with check (true);
create policy "admin write settings"     on public.site_settings for all to authenticated using (true) with check (true);

-- ---------- Storage bucket foto & video ----------
insert into storage.buckets (id, name, public)
values
  ('portfolio-images', 'portfolio-images', true),
  ('portfolio-videos', 'portfolio-videos', true)
on conflict (id) do nothing;

create policy "public read portfolio images" on storage.objects
  for select using (bucket_id in ('portfolio-images', 'portfolio-videos'));
create policy "admin upload portfolio images" on storage.objects
  for insert to authenticated with check (bucket_id in ('portfolio-images', 'portfolio-videos'));
create policy "admin update portfolio images" on storage.objects
  for update to authenticated using (bucket_id in ('portfolio-images', 'portfolio-videos'));
create policy "admin delete portfolio images" on storage.objects
  for delete to authenticated using (bucket_id in ('portfolio-images', 'portfolio-videos'));

-- ---------- Data awal ----------
insert into public.categories (name, slug, description, sort_order) values
  ('Wedding', 'wedding', 'Akad, resepsi, dan momen persiapan sebelum ijab.', 1),
  ('Prewedding', 'prewedding', 'Sesi indoor studio maupun outdoor dengan cahaya sore.', 2),
  ('Engagement', 'engagement', 'Lamaran & tunangan, hangat bersama dua keluarga.', 3),
  ('Birthday & Wisuda', 'birthday-wisuda', 'Picnic birthday, ulang tahun anak, dan hari kelulusan.', 4),
  ('Event & Lainnya', 'event', 'Tedhak siten, anniversary, acara kampus & komunitas.', 5)
on conflict (slug) do nothing;

insert into public.site_settings (key, value) values
  ('whatsapp_number', '6283843081428'),
  ('hero_title', 'Memory of Lens'),
  ('hero_subtitle', 'Dokumentasi foto & video untuk wedding, prewedding, lamaran, hingga hari bahagia kecilmu di Kendal, Semarang, dan sekitarnya.'),
  ('instagram_url', 'https://www.instagram.com/efgraphy.id/'),
  ('tiktok_url', 'https://www.tiktok.com/@efgraphy.id'),
  ('address', 'Jl. KH. Mukhsin, RT.02/RW.08, Tegolayang, Tegorejo, Kec. Pegandon, Kab. Kendal, Jawa Tengah 51357'),
  ('maps_url', 'https://www.google.com/maps/place/Efgraphy/data=!4m2!3m1!1s0x0:0x68a9d494f7b3b812'),
  ('service_area', 'Kendal · Semarang · Batang · Pekalongan'),
  ('founded_year', '2019')
on conflict (key) do nothing;

-- Setelah membuat akun admin (Authentication → Users → Add user),
-- matikan "Allow new users to sign up" di Authentication → Providers → Email.
