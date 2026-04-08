-- Public bucket for team headshots. Run after cms_schema.sql (needs public.is_admin_or_superuser).
-- Dashboard: Storage → ensure bucket exists if insert fails.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'team-photos',
  'team-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "team_photos_public_read" on storage.objects;
create policy "team_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'team-photos');

drop policy if exists "team_photos_admin_insert" on storage.objects;
create policy "team_photos_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'team-photos'
    and public.is_admin_or_superuser()
  );

drop policy if exists "team_photos_admin_update" on storage.objects;
create policy "team_photos_admin_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'team-photos'
    and public.is_admin_or_superuser()
  )
  with check (
    bucket_id = 'team-photos'
    and public.is_admin_or_superuser()
  );

drop policy if exists "team_photos_admin_delete" on storage.objects;
create policy "team_photos_admin_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'team-photos'
    and public.is_admin_or_superuser()
  );
