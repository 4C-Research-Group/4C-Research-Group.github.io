-- Run in Supabase SQL Editor after you have public.users from sign-up.
-- 1) Helper: reads role without RLS recursion
create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select u.role from public.users u where u.id = auth.uid()),
    'user'
  );
$$;

-- 2) Team CMS
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

-- 3) Page content (key/value per section)
create table if not exists public.page_content (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  body text not null default '',
  updated_at timestamptz default now(),
  unique (page_slug, section_key)
);

alter table public.page_content enable row level security;

drop policy if exists "page_content_public_read" on public.page_content;
create policy "page_content_public_read"
  on public.page_content for select
  using (true);

drop policy if exists "page_content_admin_write" on public.page_content;
create policy "page_content_admin_insert"
  on public.page_content for insert
  with check (public.current_app_role() in ('admin', 'superuser'));

create policy "page_content_admin_update"
  on public.page_content for update
  using (public.current_app_role() in ('admin', 'superuser'));

create policy "page_content_admin_delete"
  on public.page_content for delete
  using (public.current_app_role() in ('admin', 'superuser'));

-- 4) Users: allow reading profile for auth; superuser sees all
alter table public.users enable row level security;

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own"
  on public.users for insert
  with check (id = auth.uid());

drop policy if exists "users_self_read" on public.users;
create policy "users_self_read"
  on public.users for select
  using (id = auth.uid());

drop policy if exists "users_super_read_all" on public.users;
create policy "users_super_read_all"
  on public.users for select
  using (public.current_app_role() = 'superuser');

drop policy if exists "users_self_update" on public.users;
drop policy if exists "users_super_role_update" on public.users;
create policy "users_update_own_or_super"
  on public.users for update
  to authenticated
  using (
    id = auth.uid()
    or public.current_app_role() = 'superuser'
  )
  with check (
    id = auth.uid()
    or public.current_app_role() = 'superuser'
  );

-- 5) Bootstrap first superuser (set YOUR email, run once)
-- update public.users set role = 'superuser' where email = 'you@example.com';
