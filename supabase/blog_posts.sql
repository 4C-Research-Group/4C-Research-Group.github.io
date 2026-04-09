-- Blog posts (run in Supabase SQL Editor after cms_schema.sql).
-- Public reads published posts; admins see drafts; writes for admin/superuser.

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'General',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  read_time text not null default '5 min read',
  image_url text not null default '',
  tags jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default true,
  author_name text not null default '',
  author_role text not null default '',
  author_image_url text not null default ''
);

create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_category_idx on public.blog_posts (category);
create index if not exists blog_posts_featured_idx on public.blog_posts (featured);
create index if not exists blog_posts_created_idx on public.blog_posts (created_at desc);
create index if not exists blog_posts_published_idx on public.blog_posts (published);

create or replace function public.touch_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row
  execute function public.touch_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read"
  on public.blog_posts for select
  using (published = true);

drop policy if exists "blog_posts_admin_read" on public.blog_posts;
create policy "blog_posts_admin_read"
  on public.blog_posts for select
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "blog_posts_admin_insert" on public.blog_posts;
create policy "blog_posts_admin_insert"
  on public.blog_posts for insert
  with check (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "blog_posts_admin_update" on public.blog_posts;
create policy "blog_posts_admin_update"
  on public.blog_posts for update
  using (public.current_app_role() in ('admin', 'superuser'));

drop policy if exists "blog_posts_admin_delete" on public.blog_posts;
create policy "blog_posts_admin_delete"
  on public.blog_posts for delete
  using (public.current_app_role() in ('admin', 'superuser'));
