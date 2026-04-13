-- Community blog drafts + threaded comments on published posts.
-- Run in Supabase SQL Editor after cms_schema.sql and blog_posts.sql.
-- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS where needed.

-- --- Blog posts: submitting user + RLS (skip if you already applied the latest blog_posts.sql) ---
alter table public.blog_posts
  add column if not exists author_user_id uuid references auth.users (id) on delete set null;

create index if not exists blog_posts_author_user_idx on public.blog_posts (author_user_id);

drop policy if exists "blog_posts_author_read" on public.blog_posts;
create policy "blog_posts_author_read"
  on public.blog_posts for select
  to authenticated
  using (
    author_user_id is not null
    and author_user_id = auth.uid()
  );

drop policy if exists "blog_posts_member_insert" on public.blog_posts;
create policy "blog_posts_member_insert"
  on public.blog_posts for insert
  to authenticated
  with check (
    auth.uid() is not null
    and not (public.current_app_role() in ('admin', 'superuser'))
    and featured = false
    and published = false
    and author_user_id = auth.uid()
  );

-- --- Threaded comments (signed-in users; public read on published posts) ---
create table if not exists public.blog_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts (id) on delete cascade,
  parent_id uuid references public.blog_post_comments (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  author_display_name text not null default '',
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_post_comments_body_len check (
    char_length(trim(body)) > 0 and char_length(body) <= 8000
  )
);

create index if not exists blog_post_comments_post_idx
  on public.blog_post_comments (post_id, created_at);

create index if not exists blog_post_comments_parent_idx
  on public.blog_post_comments (parent_id)
  where parent_id is not null;

create or replace function public.touch_blog_post_comments_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_post_comments_set_updated_at on public.blog_post_comments;
create trigger blog_post_comments_set_updated_at
  before update on public.blog_post_comments
  for each row
  execute function public.touch_blog_post_comments_updated_at();

alter table public.blog_post_comments enable row level security;

drop policy if exists "blog_post_comments_public_read" on public.blog_post_comments;
create policy "blog_post_comments_public_read"
  on public.blog_post_comments for select
  using (
    exists (
      select 1 from public.blog_posts p
      where p.id = blog_post_comments.post_id
        and p.published = true
    )
  );

drop policy if exists "blog_post_comments_insert_own" on public.blog_post_comments;
create policy "blog_post_comments_insert_own"
  on public.blog_post_comments for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.blog_posts p
      where p.id = post_id and p.published = true
    )
    and (
      parent_id is null
      or exists (
        select 1 from public.blog_post_comments c
        where c.id = parent_id
          and c.post_id = post_id
      )
    )
  );

drop policy if exists "blog_post_comments_update_own" on public.blog_post_comments;
create policy "blog_post_comments_update_own"
  on public.blog_post_comments for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "blog_post_comments_delete_own" on public.blog_post_comments;
create policy "blog_post_comments_delete_own"
  on public.blog_post_comments for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "blog_post_comments_delete_admin" on public.blog_post_comments;
create policy "blog_post_comments_delete_admin"
  on public.blog_post_comments for delete
  using (public.current_app_role() in ('admin', 'superuser'));

grant select on public.blog_post_comments to anon, authenticated;
grant insert, update, delete on public.blog_post_comments to authenticated;
