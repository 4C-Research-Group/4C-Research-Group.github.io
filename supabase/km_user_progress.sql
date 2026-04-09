-- Per-user Knowledge Mobilization progress (JSON payload) — survives logout / new device.
-- Run in Supabase SQL Editor after auth is enabled.

create table if not exists public.km_user_progress (
  user_id uuid not null primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{"version":1,"modules":{}}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_km_user_progress_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists km_user_progress_set_updated_at on public.km_user_progress;
create trigger km_user_progress_set_updated_at
  before update on public.km_user_progress
  for each row
  execute function public.touch_km_user_progress_updated_at();

alter table public.km_user_progress enable row level security;

drop policy if exists "km_user_progress_select_own" on public.km_user_progress;
create policy "km_user_progress_select_own"
  on public.km_user_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "km_user_progress_insert_own" on public.km_user_progress;
create policy "km_user_progress_insert_own"
  on public.km_user_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "km_user_progress_update_own" on public.km_user_progress;
create policy "km_user_progress_update_own"
  on public.km_user_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "km_user_progress_delete_own" on public.km_user_progress;
create policy "km_user_progress_delete_own"
  on public.km_user_progress for delete
  to authenticated
  using (auth.uid() = user_id);
