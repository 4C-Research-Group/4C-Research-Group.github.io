-- Research projects CMS (run in Supabase SQL Editor after cms_schema.sql).
-- Public read for published rows; admins see drafts; writes for admin/superuser only.

create table if not exists public.research_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  long_description text not null default '',
  category text not null default '',
  status text not null default 'active'
    check (status in ('active', 'completed', 'upcoming')),
  start_date date not null,
  end_date date,
  link text not null default '',
  funding text not null default '',
  additional_info text not null default '',
  tags text[] not null default '{}',
  objectives text[] not null default '{}',
  team_members jsonb not null default '[]'::jsonb,
  publications jsonb not null default '[]'::jsonb,
  gallery_urls text[] not null default '{}',
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists research_projects_sort_idx
  on public.research_projects (sort_order, title);

create or replace function public.touch_research_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists research_projects_set_updated_at on public.research_projects;
create trigger research_projects_set_updated_at
  before update on public.research_projects
  for each row
  execute function public.touch_research_projects_updated_at();

alter table public.research_projects enable row level security;

drop policy if exists "research_projects_public_read" on public.research_projects;
create policy "research_projects_public_read"
  on public.research_projects for select
  using (published = true);

drop policy if exists "research_projects_admin_read" on public.research_projects;
create policy "research_projects_admin_read"
  on public.research_projects for select
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "research_projects_admin_insert" on public.research_projects;
create policy "research_projects_admin_insert"
  on public.research_projects for insert
  with check (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "research_projects_admin_update" on public.research_projects;
create policy "research_projects_admin_update"
  on public.research_projects for update
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "research_projects_admin_delete" on public.research_projects;
create policy "research_projects_admin_delete"
  on public.research_projects for delete
  using (public.current_app_role() in ('admin', 'superuser'));
