-- Optional degree + academic profile URLs on team_members.
-- Safe to re-run. Run in Supabase SQL Editor after team_members exists.

alter table public.team_members
  add column if not exists degree text not null default '';

alter table public.team_members
  add column if not exists orcid_url text not null default '';

alter table public.team_members
  add column if not exists google_scholar_url text not null default '';

alter table public.team_members
  add column if not exists researchgate_url text not null default '';
