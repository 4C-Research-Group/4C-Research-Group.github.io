/** Fallback when Supabase is unavailable or team_members has not loaded. Prefer data in public.team_members (see seed_team_members.sql, /admin/team/). */
export type TeamMemberCategory = "staff" | "student";

export interface TeamMember {
  slug: string;
  photoFile: string;
  name: string;
  initials: string;
  role: string;
  category: TeamMemberCategory;
  superpower: string;
}

export function findStaticTeamMemberBySlug(
  slug: string,
): TeamMember | undefined {
  return [...teamMembers, ...teamAlumni].find((m) => m.slug === slug);
}

export const teamMembers: TeamMember[] = [
  {
    slug: "team-2",
    photoFile: "team-2.jpg",
    name: "Maysaa Assaf",
    initials: "MA",
    role: "Clinical Research Coordinator",
    category: "staff",
    superpower: "My smile!",
  },
  {
    slug: "team-3",
    photoFile: "team-3.jpg",
    name: "Karen Wong",
    initials: "KW",
    role: "PhD Student",
    category: "student",
    superpower: "I play on the Women's Football team at Western!",
  },
  {
    slug: "team-6",
    photoFile: "team-6.jpg",
    name: "Srinidhi Srinivasan",
    initials: "SS",
    role: "Research Assistant",
    category: "staff",
    superpower: "I am a long-distance runner!",
  },
  {
    slug: "team-7",
    photoFile: "team-7.jpg",
    name: "Kyle Sun",
    initials: "KS",
    role: "MSc Student",
    category: "student",
    superpower: "Still searching for my superpower... check back later!",
  },
  {
    slug: "team-8",
    photoFile: "team-8.jpg",
    name: "Tallulah Nyland",
    initials: "TN",
    role: "MSc Student",
    category: "student",
    superpower: "Still searching for my superpower... check back later!",
  },
  {
    slug: "team-10",
    photoFile: "team-10.jpg",
    name: "Sukhnoor Riar",
    initials: "SR",
    role: "BSc Student in Biology and Medical Science",
    category: "student",
    superpower: "Quoting Bollywood songs and movies!",
  },
  {
    slug: "hashmeet",
    photoFile: "",
    name: "Hashmeet",
    initials: "HS",
    role: "Research Assistant",
    category: "staff",
    superpower: "Bringing positive energy to the lab!",
  },
  {
    slug: "saanvi",
    photoFile: "",
    name: "Saanvi Mittal",
    initials: "SM",
    role: "MSc Student",
    category: "student",
    superpower: "Creative problem solver!",
  },
];

export const teamAlumni: TeamMember[] = [
  {
    slug: "brian",
    photoFile: "team-4.jpg",
    name: "Brian Krivoruk",
    initials: "BK",
    role: "MSc Student (Alumni)",
    category: "student",
    superpower: "Making music and DJing as a side job!",
  },
  {
    slug: "hiruthika",
    photoFile: "team-5.jpg",
    name: "Hiruthika Ravi",
    initials: "HR",
    role: "MSc Student (Alumni)",
    category: "student",
    superpower: "Intense puzzler (2000+ pieces especially!)",
  },
  {
    slug: "daniela",
    photoFile: "team-9.jpg",
    name: "Daniela Carvalho",
    initials: "DC",
    role: "Research Assistant (Alumni)",
    category: "staff",
    superpower: "Major bookworm! (Guess my favourite genre)",
  },
  {
    slug: "sara",
    photoFile: "team-11.jpg",
    name: "Sara Gehlaut",
    initials: "SG",
    role: "BHSc Student (Alumni)",
    category: "student",
    superpower: "Bollywood trivia!",
  },
  {
    slug: "donna",
    photoFile: "team-14.jpg",
    name: "Donna",
    initials: "D",
    role: "Research Coordinator (Alumni)",
    category: "staff",
    superpower: "Organizing wizard!",
  },
  {
    slug: "hafsa",
    photoFile: "team-15.jpg",
    name: "Hafsa",
    initials: "H",
    role: "Research Assistant (Alumni)",
    category: "staff",
    superpower: "Detail-oriented researcher!",
  },
  {
    slug: "julia",
    photoFile: "team-12.jpg",
    name: "Julia",
    initials: "J",
    role: "MSc Student (Alumni)",
    category: "student",
    superpower: "Data analysis expert!",
  },
  {
    slug: "megha",
    photoFile: "team-17.jpg",
    name: "Megha Shetty",
    initials: "MS",
    role: "PhD Student (Alumni)",
    category: "student",
    superpower: "Neuroscience enthusiast!",
  },
  {
    slug: "brennan",
    photoFile: "team-18.jpg",
    name: "Brennan Donville",
    initials: "BD",
    role: "MSc Student (Alumni)",
    category: "student",
    superpower: "Critical care researcher!",
  },
];
