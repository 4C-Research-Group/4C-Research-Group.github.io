-- Fix: "infinite recursion detected in policy for relation blog_post_comments"
-- Cause: INSERT policy subqueried blog_post_comments, which re-entered RLS on the same table.
-- Run once in Supabase SQL Editor (after blog_community_and_comments.sql).

create or replace function public.blog_comment_parent_valid(
  p_post_id uuid,
  p_parent_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_parent_id is null
    or exists (
      select 1
      from public.blog_post_comments c
      where c.id = p_parent_id
        and c.post_id = p_post_id
    );
$$;

revoke all on function public.blog_comment_parent_valid(uuid, uuid) from public;
grant execute on function public.blog_comment_parent_valid(uuid, uuid) to authenticated;

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
    and public.blog_comment_parent_valid(post_id, parent_id)
  );
