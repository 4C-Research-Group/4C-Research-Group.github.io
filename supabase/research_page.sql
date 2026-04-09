-- Singleton research landing page (JSON document). Run after cms_schema.sql.
-- Public reads when published; admins read/write all rows.

create table if not exists public.research_page (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique default 'main',
  document jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists research_page_slug_idx on public.research_page (slug);

create or replace function public.touch_research_page_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists research_page_set_updated_at on public.research_page;
create trigger research_page_set_updated_at
  before update on public.research_page
  for each row
  execute function public.touch_research_page_updated_at();

alter table public.research_page enable row level security;

drop policy if exists "research_page_public_read" on public.research_page;
create policy "research_page_public_read"
  on public.research_page for select
  using (published = true);

drop policy if exists "research_page_admin_read" on public.research_page;
create policy "research_page_admin_read"
  on public.research_page for select
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "research_page_admin_insert" on public.research_page;
create policy "research_page_admin_insert"
  on public.research_page for insert
  with check (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "research_page_admin_update" on public.research_page;
create policy "research_page_admin_update"
  on public.research_page for update
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "research_page_admin_delete" on public.research_page;
create policy "research_page_admin_delete"
  on public.research_page for delete
  using (public.current_app_role() in ('admin', 'superuser'));
