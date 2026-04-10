-- Run in Supabase SQL Editor (Dashboard → SQL) as a project admin.
-- Order: this file is self-contained — creates public.users if missing, then CMS tables + RLS.
--
-- After running, promote your account once (see bottom): then open Admin → Users to edit anyone’s role.

-- 0) App profile per auth user (roles for CMS / admin)
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  role text not null default 'user'
    check (role in ('user', 'admin', 'superuser')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_lower_idx on public.users (lower(email));

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

-- True when the signed-in user’s row in public.users has role superuser. Used in RLS on public.users
-- so we never call current_app_role() during a per-row users scan (that only ever exposed “self”).
create or replace function public.is_superuser()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid()
      and u.role = 'superuser'
  );
$$;

-- Admin or superuser (for Storage CMS policies; SECURITY DEFINER avoids RLS oddities on lookups).
create or replace function public.is_admin_or_superuser()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users u
    where u.id = auth.uid()
      and u.role in ('admin', 'superuser')
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
  bio text not null default '',
  email text not null default '',
  linkedin_url text not null default '',
  degree text not null default '',
  orcid_url text not null default '',
  google_scholar_url text not null default '',
  researchgate_url text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.team_members add column if not exists bio text not null default '';
alter table public.team_members add column if not exists email text not null default '';
alter table public.team_members add column if not exists linkedin_url text not null default '';
alter table public.team_members add column if not exists degree text not null default '';
alter table public.team_members add column if not exists orcid_url text not null default '';
alter table public.team_members add column if not exists google_scholar_url text not null default '';
alter table public.team_members add column if not exists researchgate_url text not null default '';

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

-- 2b) Team member publications (manual list per person; shown on /team/[slug]/)
create table if not exists public.team_member_publications (
  id uuid primary key default gen_random_uuid(),
  team_member_id uuid not null references public.team_members (id) on delete cascade,
  title text not null,
  authors text not null default '',
  venue text not null default '',
  year text not null default '',
  url text not null default '',
  notes text not null default '',
  status text not null default 'in_preparation'
    check (status in (
      'in_preparation',
      'submitted',
      'under_review',
      'accepted',
      'published',
      'other'
    )),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_member_publications_member_idx
  on public.team_member_publications (team_member_id, sort_order);

create or replace function public.touch_team_member_publications_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists team_member_publications_set_updated_at on public.team_member_publications;
create trigger team_member_publications_set_updated_at
  before update on public.team_member_publications
  for each row
  execute function public.touch_team_member_publications_updated_at();

alter table public.team_member_publications enable row level security;

drop policy if exists "team_member_publications_public_read" on public.team_member_publications;
create policy "team_member_publications_public_read"
  on public.team_member_publications for select
  using (true);

drop policy if exists "team_member_publications_admin_insert" on public.team_member_publications;
create policy "team_member_publications_admin_insert"
  on public.team_member_publications for insert
  with check (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "team_member_publications_admin_update" on public.team_member_publications;
create policy "team_member_publications_admin_update"
  on public.team_member_publications for update
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "team_member_publications_admin_delete" on public.team_member_publications;
create policy "team_member_publications_admin_delete"
  on public.team_member_publications for delete
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
  with check (
    id = auth.uid()
    and role = 'user'
  );

drop policy if exists "users_self_read" on public.users;
create policy "users_self_read"
  on public.users for select
  using (id = auth.uid());

drop policy if exists "users_super_read_all" on public.users;
create policy "users_super_read_all"
  on public.users for select
  using (public.is_superuser());

drop policy if exists "users_self_update" on public.users;
drop policy if exists "users_super_role_update" on public.users;
create policy "users_update_own_or_super"
  on public.users for update
  to authenticated
  using (
    id = auth.uid()
    or public.is_superuser()
  )
  with check (
    id = auth.uid()
    or public.is_superuser()
  );

-- Superuser-only listing: plain SELECT from the client often returns only your own row because RLS
-- evaluates policies per row and current_app_role() + self-read interact badly. This runs as the
-- function owner (bypasses RLS on the scan) after verifying the caller is superuser.
create or replace function public.admin_list_app_users()
returns table (
  id uuid,
  email text,
  name text,
  role text
)
language sql
stable
security definer
set search_path = public
as $$
  select u.id, u.email, u.name, u.role
  from public.users u
  where (select public.is_superuser())
  order by u.email asc nulls last;
$$;

revoke all on function public.admin_list_app_users() from public;
grant execute on function public.admin_list_app_users() to authenticated;

-- Only superusers may change the role column (stops self-promotion via API).
create or replace function public.users_enforce_role_change()
returns trigger
language plpgsql
as $$
begin
  if OLD.role is distinct from NEW.role then
    if not public.is_superuser() then
      raise exception 'Only a superuser can change user roles';
    end if;
  end if;
  return NEW;
end;
$$;

drop trigger if exists users_role_guard on public.users;
create trigger users_role_guard
  before update on public.users
  for each row
  execute function public.users_enforce_role_change();

-- 5) Bootstrap your first superuser (run in SQL Editor; then use Admin → Users for everyone else)
--
-- If UPDATE returns "UPDATE 0", there was no public.users row yet (common when you only ever signed in,
-- not signed up through the app). Use this one statement instead (replace email):
--
--   insert into public.users (id, email, name, role, created_at, updated_at)
--   select u.id, u.email, split_part(coalesce(u.email, ''), '@', 1), 'superuser', now(), now()
--   from auth.users u
--   where lower(u.email) = lower('you@example.com')
--   on conflict (id) do update set role = 'superuser', updated_at = now();
--
-- Or, if the row already exists:
--   update public.users
--   set role = 'superuser', updated_at = now()
--   where lower(email) = lower('you@example.com');
--
-- If Authentication has more users than public.users (All users list is short), backfill:
--   insert into public.users (id, email, name, role, created_at, updated_at)
--   select u.id, u.email, split_part(coalesce(u.email, ''), '@', 1), 'user', now(), now()
--   from auth.users u
--   where not exists (select 1 from public.users p where p.id = u.id);
