-- Run once in Supabase SQL Editor if superusers only see themselves in "All users".
-- Root cause: RLS used current_app_role() on public.users, which breaks per-row; use is_superuser() instead.

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

drop policy if exists "users_super_read_all" on public.users;
create policy "users_super_read_all"
  on public.users for select
  using (public.is_superuser());

drop policy if exists "users_update_own_or_super" on public.users;
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
