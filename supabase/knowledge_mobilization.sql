-- Knowledge Mobilization curriculum (modules, topics, quizzes).
-- Run in Supabase SQL Editor after cms_schema.sql (needs is_admin_or_superuser).
--
-- Public read; CMS writes for admin/superuser only.
-- Seed: npm run seed-km (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)

create table if not exists public.km_modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.km_topics (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.km_modules (id) on delete cascade,
  topic_key text not null,
  sort_order int not null default 0,
  topic_type text not null check (topic_type in ('text', 'video', 'audio')),
  title text not null,
  paragraphs jsonb not null default '[]'::jsonb,
  embed_url text,
  video_caption text,
  unique (module_id, topic_key)
);

create index if not exists km_topics_module_sort_idx
  on public.km_topics (module_id, sort_order);

create table if not exists public.km_questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.km_modules (id) on delete cascade,
  question_key text not null,
  sort_order int not null default 0,
  prompt text not null,
  options jsonb not null,
  correct_index int not null,
  unique (module_id, question_key)
);

create index if not exists km_questions_module_sort_idx
  on public.km_questions (module_id, sort_order);

create or replace function public.touch_km_modules_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists km_modules_set_updated_at on public.km_modules;
create trigger km_modules_set_updated_at
  before update on public.km_modules
  for each row
  execute function public.touch_km_modules_updated_at();

alter table public.km_modules enable row level security;
alter table public.km_topics enable row level security;
alter table public.km_questions enable row level security;

drop policy if exists "km_modules_public_read" on public.km_modules;
create policy "km_modules_public_read"
  on public.km_modules for select
  using (true);

drop policy if exists "km_modules_admin_insert" on public.km_modules;
create policy "km_modules_admin_insert"
  on public.km_modules for insert
  with check (public.is_admin_or_superuser());

drop policy if exists "km_modules_admin_update" on public.km_modules;
create policy "km_modules_admin_update"
  on public.km_modules for update
  using (public.is_admin_or_superuser());

drop policy if exists "km_modules_admin_delete" on public.km_modules;
create policy "km_modules_admin_delete"
  on public.km_modules for delete
  using (public.is_admin_or_superuser());

drop policy if exists "km_topics_public_read" on public.km_topics;
create policy "km_topics_public_read"
  on public.km_topics for select
  using (true);

drop policy if exists "km_topics_admin_insert" on public.km_topics;
create policy "km_topics_admin_insert"
  on public.km_topics for insert
  with check (public.is_admin_or_superuser());

drop policy if exists "km_topics_admin_update" on public.km_topics;
create policy "km_topics_admin_update"
  on public.km_topics for update
  using (public.is_admin_or_superuser());

drop policy if exists "km_topics_admin_delete" on public.km_topics;
create policy "km_topics_admin_delete"
  on public.km_topics for delete
  using (public.is_admin_or_superuser());

drop policy if exists "km_questions_public_read" on public.km_questions;
create policy "km_questions_public_read"
  on public.km_questions for select
  using (true);

drop policy if exists "km_questions_admin_insert" on public.km_questions;
create policy "km_questions_admin_insert"
  on public.km_questions for insert
  with check (public.is_admin_or_superuser());

drop policy if exists "km_questions_admin_update" on public.km_questions;
create policy "km_questions_admin_update"
  on public.km_questions for update
  using (public.is_admin_or_superuser());

drop policy if exists "km_questions_admin_delete" on public.km_questions;
create policy "km_questions_admin_delete"
  on public.km_questions for delete
  using (public.is_admin_or_superuser());
