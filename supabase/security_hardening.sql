-- =============================================================
-- Efgraphy.id - Skrip Security Hardening Supabase (Idempotent)
-- Jalankan seluruh file ini di Supabase Dashboard -> SQL Editor.
-- Aman dijalankan ulang kapan saja.
-- =============================================================

-- 1. Fungsi helper untuk membatasi akses tulis hanya ke akun admin resmi
create or replace function public.is_efgraphy_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select auth.role() = 'authenticated'
    and lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@efgraphy.id';
$$;

-- 2. Perketat RLS pada semua tabel publik & admin
drop policy if exists "public read packages"     on public.packages;
drop policy if exists "public read testimonials" on public.testimonials;
drop policy if exists "public read videos"       on public.videos;

create policy "public read packages"     on public.packages     for select using (is_active or public.is_efgraphy_admin());
create policy "public read testimonials" on public.testimonials for select using (is_active or public.is_efgraphy_admin());
create policy "public read videos"       on public.videos       for select using (is_active or public.is_efgraphy_admin());

drop policy if exists "admin write categories"   on public.categories;
drop policy if exists "admin write portfolios"   on public.portfolios;
drop policy if exists "admin write packages"     on public.packages;
drop policy if exists "admin write testimonials" on public.testimonials;
drop policy if exists "admin write videos"       on public.videos;
drop policy if exists "admin write settings"     on public.site_settings;

create policy "admin write categories"   on public.categories    for all to authenticated using (public.is_efgraphy_admin()) with check (public.is_efgraphy_admin());
create policy "admin write portfolios"   on public.portfolios    for all to authenticated using (public.is_efgraphy_admin()) with check (public.is_efgraphy_admin());
create policy "admin write packages"     on public.packages      for all to authenticated using (public.is_efgraphy_admin()) with check (public.is_efgraphy_admin());
create policy "admin write testimonials" on public.testimonials  for all to authenticated using (public.is_efgraphy_admin()) with check (public.is_efgraphy_admin());
create policy "admin write videos"       on public.videos        for all to authenticated using (public.is_efgraphy_admin()) with check (public.is_efgraphy_admin());
create policy "admin write settings"     on public.site_settings for all to authenticated using (public.is_efgraphy_admin()) with check (public.is_efgraphy_admin());

-- 3. Batasi tipe MIME dan ukuran file bucket Storage di sisi server
--    (Memblokir upload SVG, HTML, JS, dan file berbahaya lainnya)
update storage.buckets
set
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'portfolio-images';

update storage.buckets
set
  file_size_limit = 26214400,
  allowed_mime_types = array['video/mp4', 'video/webm']
where id = 'portfolio-videos';

-- 4. Perketat RLS pada storage.objects agar hanya admin resmi yang bisa upload/ubah/hapus
drop policy if exists "admin upload portfolio images" on storage.objects;
drop policy if exists "admin update portfolio images" on storage.objects;
drop policy if exists "admin delete portfolio images" on storage.objects;

create policy "admin upload portfolio images" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('portfolio-images', 'portfolio-videos') and public.is_efgraphy_admin());

create policy "admin update portfolio images" on storage.objects
  for update to authenticated
  using (bucket_id in ('portfolio-images', 'portfolio-videos') and public.is_efgraphy_admin())
  with check (bucket_id in ('portfolio-images', 'portfolio-videos') and public.is_efgraphy_admin());

create policy "admin delete portfolio images" on storage.objects
  for delete to authenticated
  using (bucket_id in ('portfolio-images', 'portfolio-videos') and public.is_efgraphy_admin());
