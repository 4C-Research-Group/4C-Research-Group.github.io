-- Allow podcast-style audio topics in KM curriculum (existing databases).
-- Run once in Supabase SQL Editor after knowledge_mobilization.sql.

alter table public.km_topics drop constraint if exists km_topics_topic_type_check;

alter table public.km_topics
  add constraint km_topics_topic_type_check
  check (topic_type in ('text', 'video', 'audio'));
