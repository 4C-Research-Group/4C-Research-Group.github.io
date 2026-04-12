-- Public bucket for Knowledge Mobilization podcast / audio episodes.
-- Run in Supabase SQL Editor after cms_schema.sql (needs is_admin_or_superuser()).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'km-audio',
  'km-audio',
  true,
  104857600,
  array[
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/webm',
    'audio/ogg'
  ]::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "km_audio_public_read" on storage.objects;
create policy "km_audio_public_read"
  on storage.objects for select
  using (bucket_id = 'km-audio');

drop policy if exists "km_audio_admin_insert" on storage.objects;
create policy "km_audio_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'km-audio'
    and public.is_admin_or_superuser()
  );

drop policy if exists "km_audio_admin_update" on storage.objects;
create policy "km_audio_admin_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'km-audio'
    and public.is_admin_or_superuser()
  )
  with check (
    bucket_id = 'km-audio'
    and public.is_admin_or_superuser()
  );

drop policy if exists "km_audio_admin_delete" on storage.objects;
create policy "km_audio_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'km-audio'
    and public.is_admin_or_superuser()
  );
