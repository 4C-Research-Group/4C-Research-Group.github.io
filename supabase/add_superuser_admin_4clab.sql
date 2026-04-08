-- admin@4clab.com → superuser (two steps)
--
-- Step 1 — Create the login (pick one):
--   • Dashboard: Authentication → Users → Add user → email admin@4clab.com + password, OR
--   • Your site: Sign up with admin@4clab.com (same Supabase project as .env.local).
--
-- Step 2 — After that user appears in auth.users, run this in SQL Editor:

insert into public.users (id, email, name, role, created_at, updated_at)
select u.id, u.email, split_part(coalesce(u.email, ''), '@', 1), 'superuser', now(), now()
from auth.users u
where lower(u.email) = lower('admin@4clab.com')
on conflict (id) do update set role = 'superuser', updated_at = now();

-- Verify:
-- select id, email, role from public.users where lower(email) = lower('admin@4clab.com');
