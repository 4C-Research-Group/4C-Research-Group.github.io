-- Public bucket for Knowledge Mobilization curriculum videos (MP4/WebM/MOV).
-- Run in Supabase SQL Editor after cms_schema.sql or storage_team_photos.sql
-- (needs public.is_admin_or_superuser()).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'km-videos',
  'km-videos',
  true,
  104857600,
  array['video/mp4', 'video/webm', 'video/quicktime']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "km_videos_public_read" on storage.objects;
create policy "km_videos_public_read"
  on storage.objects for select
  using (bucket_id = 'km-videos');

drop policy if exists "km_videos_admin_insert" on storage.objects;
create policy "km_videos_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'km-videos'
    and public.is_admin_or_superuser()
  );

drop policy if exists "km_videos_admin_update" on storage.objects;
create policy "km_videos_admin_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'km-videos'
    and public.is_admin_or_superuser()
  )
  with check (
    bucket_id = 'km-videos'
    and public.is_admin_or_superuser()
  );

drop policy if exists "km_videos_admin_delete" on storage.objects;
create policy "km_videos_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'km-videos'
    and public.is_admin_or_superuser()
  );
