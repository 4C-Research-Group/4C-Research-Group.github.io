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
    slug: "team-4",
    photoFile: "team-4.jpg",
    name: "Brian Krivoruk",
    initials: "BK",
    role: "MSc Student",
    category: "student",
    superpower: "Making music and DJing as a side job!",
  },
  {
    slug: "team-5",
    photoFile: "team-5.jpg",
    name: "Hiruthika Ravi",
    initials: "HR",
    role: "MSc Student",
    category: "student",
    superpower: "Intense puzzler (2000+ pieces especially!)",
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
    slug: "team-9",
    photoFile: "team-9.jpg",
    name: "Daniela Carvalho",
    initials: "DC",
    role: "Research Assistant",
    category: "staff",
    superpower: "Major bookworm! (Guess my favourite genre)",
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
    slug: "team-11",
    photoFile: "team-11.jpg",
    name: "Sara Gehlaut",
    initials: "SG",
    role: "BHSc student in Health Sciences and Biology",
    category: "student",
    superpower: "Bollywood trivia!",
  },
];
