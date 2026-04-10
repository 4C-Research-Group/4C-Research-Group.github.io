/** Default copy for `/join-4c-lab`. CMS payload merges on top. */

const DEFAULT_EMAIL = "rishi.ganesan@lhsc.on.ca";

export type Join4cLabPagePayload = {
  contactEmail: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBody: string;
  heroPill1: string;
  heroPill2: string;
  heroPill3: string;
  introTitle: string;
  card1Title: string;
  card1Description: string;
  card2Title: string;
  card2Description: string;
  card3Title: string;
  card3Description: string;
  applySectionTitle: string;
  requiredDocumentsHeading: string;
  applicationStepsHeading: string;
  requiredDocuments: string[];
  /** Use `{{email}}` where the contact email should appear. */
  applicationSteps: string[];
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonialsMobileHint: string;
  testimonialsEmptyMessage: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  ctaButtonLink: string;
};

export const join4cLabPageDefaults: Join4cLabPagePayload = {
  contactEmail: DEFAULT_EMAIL,
  heroBadge: "Join Our Team",
  heroTitle: "Join 4C Research Group",
  heroSubtitle: "We are always looking for passionate students to join our team",
  heroBody:
    "If you are interested in joining our team, please send your CV to:",
  heroPill1: "Research Excellence",
  heroPill2: "Collaborative Environment",
  heroPill3: "Innovation & Growth",
  introTitle:
    "Read more about previous students' experiences with the 4C Research Group below!",
  card1Title: "Research Excellence",
  card1Description:
    "Work on cutting-edge research in cognition, consciousness, and critical care. Gain hands-on experience with state-of-the-art methodologies and technologies.",
  card2Title: "Collaborative Environment",
  card2Description:
    "Join a diverse team of researchers, clinicians, and students. Learn from experts and contribute to meaningful research that makes a difference.",
  card3Title: "Innovation & Growth",
  card3Description:
    "Develop your skills in a supportive environment that encourages innovation and personal growth. Build your research portfolio and network.",
  applySectionTitle: "How to Apply",
  requiredDocumentsHeading: "Required Documents",
  applicationStepsHeading: "Application Steps",
  requiredDocuments: [
    "Updated CV/Resume",
    "Cover letter explaining your interest",
    "Academic transcripts (if applicable)",
    "References (upon request)",
  ],
  applicationSteps: [
    "Send your CV to {{email}}",
    "Include a brief cover letter in the email",
    "Wait for our team to review your application",
    "We'll contact you for an interview if selected",
  ],
  testimonialsTitle: "Student Testimonials",
  testimonialsSubtitle:
    "Hear from our previous students about their experiences with the 4C Research Group",
  testimonialsMobileHint: "Swipe sideways to read more",
  testimonialsEmptyMessage:
    "No testimonials available at the moment. Check back soon!",
  ctaTitle: "Ready to Join Our Mission?",
  ctaDescription:
    "Send your CV today and take the first step towards contributing to groundbreaking research in cognition, consciousness, and critical care.",
  ctaButtonText: "Send Your CV",
  ctaButtonLink: `mailto:${DEFAULT_EMAIL}`,
};
