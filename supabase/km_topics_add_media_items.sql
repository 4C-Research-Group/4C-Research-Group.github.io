-- Add support for multiple media entries (video/audio) per KM topic.
-- Run once in Supabase SQL Editor for existing databases.

alter table public.km_topics
  add column if not exists media_items jsonb not null default '[]'::jsonb;

-- Backfill single legacy embed_url + video_caption into media_items[0]
-- only when media_items is currently empty.
update public.km_topics
set media_items = jsonb_build_array(
  jsonb_build_object(
    'url', trim(embed_url),
    'caption', coalesce(trim(video_caption), '')
  )
)
where coalesce(trim(embed_url), '') <> ''
  and (
    media_items is null
    or media_items = '[]'::jsonb
  );
