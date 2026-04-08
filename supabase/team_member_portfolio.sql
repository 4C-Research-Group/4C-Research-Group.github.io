-- Idempotent: portfolio fields on team_members + team_member_publications.
-- Run in Supabase SQL Editor if your project used cms_schema before these features.

alter table public.team_members add column if not exists bio text not null default '';
alter table public.team_members add column if not exists email text not null default '';
alter table public.team_members add column if not exists linkedin_url text not null default '';

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
