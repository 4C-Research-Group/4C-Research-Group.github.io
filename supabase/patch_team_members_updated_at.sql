-- Optional: run if your project already had team_members before the updated_at trigger was added.
--
-- If you get ERROR: relation "public.team_members" does not exist, run
-- create_team_members_only.sql (or full cms_schema.sql) first — do not run this patch alone.

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
