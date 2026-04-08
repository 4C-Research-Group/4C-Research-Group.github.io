-- One-time: copy legacy static team into public.team_members (idempotent on slug).
-- Run in Supabase SQL Editor after cms_schema.sql (or run supabase/team_member_portfolio.sql
-- once if your DB was created before portfolio + publications). Admins manage rows at /admin/team/.

insert into public.team_members (
  slug,
  name,
  initials,
  role_title,
  category,
  superpower,
  photo_file,
  is_alumni,
  sort_order
)
values
  (
    'team-2',
    'Maysaa Assaf',
    'MA',
    'Clinical Research Coordinator',
    'staff',
    $$My smile!$$,
    'team-2.jpg',
    false,
    10
  ),
  (
    'team-3',
    'Karen Wong',
    'KW',
    'PhD Student',
    'student',
    $$I play on the Women's Football team at Western!$$,
    'team-3.jpg',
    false,
    20
  ),
  (
    'team-6',
    'Srinidhi Srinivasan',
    'SS',
    'Research Assistant',
    'staff',
    $$I am a long-distance runner!$$,
    'team-6.jpg',
    false,
    30
  ),
  (
    'team-7',
    'Kyle Sun',
    'KS',
    'MSc Student',
    'student',
    $$Still searching for my superpower... check back later!$$,
    'team-7.jpg',
    false,
    40
  ),
  (
    'team-8',
    'Tallulah Nyland',
    'TN',
    'MSc Student',
    'student',
    $$Still searching for my superpower... check back later!$$,
    'team-8.jpg',
    false,
    50
  ),
  (
    'team-10',
    'Sukhnoor Riar',
    'SR',
    'BSc Student in Biology and Medical Science',
    'student',
    $$Quoting Bollywood songs and movies!$$,
    'team-10.jpg',
    false,
    60
  ),
  (
    'hashmeet',
    'Hashmeet',
    'HS',
    'Research Assistant',
    'staff',
    $$Bringing positive energy to the lab!$$,
    '',
    false,
    70
  ),
  (
    'saanvi',
    'Saanvi Mittal',
    'SM',
    'MSc Student',
    'student',
    $$Creative problem solver!$$,
    '',
    false,
    80
  ),
  (
    'brian',
    'Brian Krivoruk',
    'BK',
    'MSc Student (Alumni)',
    'student',
    $$Making music and DJing as a side job!$$,
    'team-4.jpg',
    true,
    90
  ),
  (
    'hiruthika',
    'Hiruthika Ravi',
    'HR',
    'MSc Student (Alumni)',
    'student',
    $$Intense puzzler (2000+ pieces especially!)$$,
    'team-5.jpg',
    true,
    100
  ),
  (
    'daniela',
    'Daniela Carvalho',
    'DC',
    'Research Assistant (Alumni)',
    'staff',
    $$Major bookworm! (Guess my favourite genre)$$,
    'team-9.jpg',
    true,
    110
  ),
  (
    'sara',
    'Sara Gehlaut',
    'SG',
    'BHSc Student (Alumni)',
    'student',
    $$Bollywood trivia!$$,
    'team-11.jpg',
    true,
    120
  ),
  (
    'donna',
    'Donna',
    'D',
    'Research Coordinator (Alumni)',
    'staff',
    $$Organizing wizard!$$,
    'team-14.jpg',
    true,
    130
  ),
  (
    'hafsa',
    'Hafsa',
    'H',
    'Research Assistant (Alumni)',
    'staff',
    $$Detail-oriented researcher!$$,
    'team-15.jpg',
    true,
    140
  ),
  (
    'julia',
    'Julia',
    'J',
    'MSc Student (Alumni)',
    'student',
    $$Data analysis expert!$$,
    'team-12.jpg',
    true,
    150
  ),
  (
    'megha',
    'Megha Shetty',
    'MS',
    'PhD Student (Alumni)',
    'student',
    $$Neuroscience enthusiast!$$,
    'team-17.jpg',
    true,
    160
  ),
  (
    'brennan',
    'Brennan Donville',
    'BD',
    'MSc Student (Alumni)',
    'student',
    $$Critical care researcher!$$,
    'team-18.jpg',
    true,
    170
  )
on conflict (slug) do update set
  name = excluded.name,
  initials = excluded.initials,
  role_title = excluded.role_title,
  category = excluded.category,
  superpower = excluded.superpower,
  photo_file = excluded.photo_file,
  is_alumni = excluded.is_alumni,
  sort_order = excluded.sort_order,
  updated_at = now();
