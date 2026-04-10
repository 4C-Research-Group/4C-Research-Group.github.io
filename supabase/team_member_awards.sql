-- Optional awards list per team member (JSON array).
-- Run in Supabase SQL Editor if the column is missing.

alter table public.team_members
  add column if not exists awards jsonb not null default '[]'::jsonb;
