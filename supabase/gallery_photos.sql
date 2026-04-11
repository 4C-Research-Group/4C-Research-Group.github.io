-- Unlimited gallery images (sort order = layout: see GALLERY_CURATED_COUNT in app).
-- Run after cms_schema.sql (uses current_app_role).

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  alt text not null default '',
  title text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists gallery_photos_sort_order_idx
  on public.gallery_photos (sort_order asc);

alter table public.gallery_photos enable row level security;

drop policy if exists "gallery_photos_public_read" on public.gallery_photos;
create policy "gallery_photos_public_read"
  on public.gallery_photos for select
  using (true);

drop policy if exists "gallery_photos_admin_insert" on public.gallery_photos;
create policy "gallery_photos_admin_insert"
  on public.gallery_photos for insert
  with check (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "gallery_photos_admin_update" on public.gallery_photos;
create policy "gallery_photos_admin_update"
  on public.gallery_photos for update
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "gallery_photos_admin_delete" on public.gallery_photos;
create policy "gallery_photos_admin_delete"
  on public.gallery_photos for delete
  using (public.current_app_role() in ('admin', 'superuser'));
