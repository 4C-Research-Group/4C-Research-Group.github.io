-- Team member testimonials (Join 4C Lab page) + link auth users to profiles.
-- Run in Supabase SQL Editor after cms_schema.sql / team_member_portfolio.sql.
--
-- 1) Link app users to team_members (superuser sets this; members cannot self-assign — see trigger).
alter table public.users
  add column if not exists team_member_id uuid references public.team_members (id) on delete set null;

create index if not exists users_team_member_id_idx on public.users (team_member_id);

-- Only superusers may set or change team_member_id (prevents impersonation).
create or replace function public.users_enforce_team_member_link()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if OLD.team_member_id is distinct from NEW.team_member_id then
    if not public.is_superuser() then
      raise exception 'Only a superuser can link an account to a team profile';
    end if;
  end if;
  return NEW;
end;
$$;

drop trigger if exists users_team_member_link_guard on public.users;
create trigger users_team_member_link_guard
  before update on public.users
  for each row
  execute function public.users_enforce_team_member_link();

-- 2) One testimonial per team member (Join page format: quote, bio, education; name/role/photo from team_members).
create table if not exists public.team_member_testimonials (
  id uuid primary key default gen_random_uuid(),
  team_member_id uuid not null references public.team_members (id) on delete cascade,
  quote text not null,
  testimonial_bio text not null,
  education text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_member_id)
);

create index if not exists team_member_testimonials_updated_idx
  on public.team_member_testimonials (updated_at desc);

create or replace function public.touch_team_member_testimonials_updated_at()
returns trigger
language plpgsql
as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$;

drop trigger if exists team_member_testimonials_set_updated_at on public.team_member_testimonials;
create trigger team_member_testimonials_set_updated_at
  before update on public.team_member_testimonials
  for each row
  execute function public.touch_team_member_testimonials_updated_at();

alter table public.team_member_testimonials enable row level security;

drop policy if exists "team_member_testimonials_public_read" on public.team_member_testimonials;
create policy "team_member_testimonials_public_read"
  on public.team_member_testimonials for select
  using (true);

drop policy if exists "team_member_testimonials_member_insert" on public.team_member_testimonials;
create policy "team_member_testimonials_member_insert"
  on public.team_member_testimonials for insert
  to authenticated
  with check (
    team_member_id = (
      select u.team_member_id
      from public.users u
      where u.id = auth.uid()
        and u.team_member_id is not null
    )
  );

drop policy if exists "team_member_testimonials_member_update" on public.team_member_testimonials;
create policy "team_member_testimonials_member_update"
  on public.team_member_testimonials for update
  to authenticated
  using (
    team_member_id = (
      select u.team_member_id from public.users u where u.id = auth.uid()
    )
  )
  with check (
    team_member_id = (
      select u.team_member_id from public.users u where u.id = auth.uid()
    )
  );

drop policy if exists "team_member_testimonials_admin_delete" on public.team_member_testimonials;
create policy "team_member_testimonials_admin_delete"
  on public.team_member_testimonials for delete
  to authenticated
  using (public.is_admin_or_superuser());

-- Optional: superuser can fix typos for any row
drop policy if exists "team_member_testimonials_admin_update" on public.team_member_testimonials;
create policy "team_member_testimonials_admin_update"
  on public.team_member_testimonials for update
  to authenticated
  using (public.is_admin_or_superuser())
  with check (true);

-- 3) Link a login to a profile (run per person; replace email and slug):
--
--   update public.users u
--   set team_member_id = (select id from public.team_members m where m.slug = 'their-db-slug'),
--       updated_at = now()
--   where lower(u.email) = lower('them@example.com');
