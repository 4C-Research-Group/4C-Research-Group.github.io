-- Public bucket for homepage images (safe to re-run).
-- Requires public.is_admin_or_superuser() from cms_schema.sql or storage_team_photos.sql.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'homepage-images',
  'homepage-images',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "homepage_images_public_read" on storage.objects;
create policy "homepage_images_public_read"
  on storage.objects for select
  using (bucket_id = 'homepage-images');

drop policy if exists "homepage_images_admin_insert" on storage.objects;
create policy "homepage_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'homepage-images'
    and public.is_admin_or_superuser()
  );

drop policy if exists "homepage_images_admin_update" on storage.objects;
create policy "homepage_images_admin_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'homepage-images'
    and public.is_admin_or_superuser()
  )
  with check (
    bucket_id = 'homepage-images'
    and public.is_admin_or_superuser()
  );

drop policy if exists "homepage_images_admin_delete" on storage.objects;
create policy "homepage_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'homepage-images'
    and public.is_admin_or_superuser()
  );
