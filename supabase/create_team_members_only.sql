-- Run this if you see: relation "public.team_members" does not exist
--
-- Prerequisite: public.users and public.current_app_role() must already exist.
-- If this is a fresh project, run the full supabase/cms_schema.sql instead (covers users + helpers + team + content).
-- If you only skipped the team section, run this file as postgres in the SQL Editor.

-- 2) Team CMS (same as cms_schema.sql)
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  initials text not null default '',
  role_title text not null default '',
  category text not null default 'staff'
    check (category in ('staff', 'student')),
  superpower text not null default '',
  photo_file text not null default '',
  is_alumni boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.touch_team_members_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
  before update on public.team_members
  for each row
  execute function public.touch_team_members_updated_at();

alter table public.team_members enable row level security;

drop policy if exists "team_public_read" on public.team_members;
create policy "team_public_read"
  on public.team_members for select
  using (true);

drop policy if exists "team_admin_write" on public.team_members;
create policy "team_admin_write"
  on public.team_members for insert
  with check (public.current_app_role() in ('admin', 'superuser'));

create policy "team_admin_update"
  on public.team_members for update
  using (public.current_app_role() in ('admin', 'superuser'));

create policy "team_admin_delete"
  on public.team_members for delete
  using (public.current_app_role() in ('admin', 'superuser'));

-- Portfolio + publications (also in cms_schema.sql and team_member_portfolio.sql)
alter table public.team_members add column if not exists bio text not null default '';
alter table public.team_members add column if not exists email text not null default '';
alter table public.team_members add column if not exists linkedin_url text not null default '';
