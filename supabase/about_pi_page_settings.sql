-- About PI page CMS (single row JSON). Run after cms_schema.sql (uses current_app_role).

create table if not exists public.about_pi_page_settings (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

alter table public.about_pi_page_settings enable row level security;

drop policy if exists "about_pi_page_settings_public_read" on public.about_pi_page_settings;
create policy "about_pi_page_settings_public_read"
  on public.about_pi_page_settings for select
  using (true);

drop policy if exists "about_pi_page_settings_admin_insert" on public.about_pi_page_settings;
create policy "about_pi_page_settings_admin_insert"
  on public.about_pi_page_settings for insert
  with check (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "about_pi_page_settings_admin_update" on public.about_pi_page_settings;
create policy "about_pi_page_settings_admin_update"
  on public.about_pi_page_settings for update
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "about_pi_page_settings_admin_delete" on public.about_pi_page_settings;
create policy "about_pi_page_settings_admin_delete"
  on public.about_pi_page_settings for delete
  using (public.current_app_role() in ('admin', 'superuser'));
