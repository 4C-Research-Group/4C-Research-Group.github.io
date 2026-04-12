/** Hub + registration copy for Knowledge Mobilization (`km_page_settings.payload`). */

export type KmProgramGroup = {
  id: string;
  title: string;
  summary: string;
  /** Module slugs in display order (must match `km_modules.slug`). */
  moduleSlugs: string[];
};

export type KmPagePayload = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  heroPill1: string;
  heroPill2: string;
  heroPill3: string;
  howItWorksTitle: string;
  howItWorksSyncSignedIn: string;
  howItWorksSyncGuest: string;
  /** Link label between `howItWorksSyncGuest` and `howItWorksGuestAfterLink` (guests only). */
  howItWorksGuestSignInLinkText: string;
  /** Text after the sign-in link on the hub (guests only). */
  howItWorksGuestAfterLink: string;
  howItWorksSyncAnonymous: string;
  howItWorksBullet1: string;
  howItWorksBullet2: string;
  howItWorksBullet3: string;
  programsSectionTitle: string;
  programsSectionIntro: string;
  programs: KmProgramGroup[];
  startPageTitle: string;
  startPageIntro: string;
  startPrivacyNote: string;
  startSubmitLabel: string;
  startFullNameLabel: string;
  startUseSeparateNamesHint: string;
  certificateBlurb: string;
};

export const kmPageDefaults: KmPagePayload = {
  heroBadge: "Professional Development",
  heroTitle: "Knowledge Mobilization",
  heroSubtitle: "Refresher modules for nurses and staff",
  heroIntro:
    "Review topics and videos, then pass each module quiz (80% or higher) to unlock the next.",
  heroPill1: "Self-paced Learning",
  heroPill2: "Certificate Available",
  heroPill3: "80% Passing Score",
  howItWorksTitle: "How it works",
  howItWorksSyncSignedIn:
    "Signed in — your progress syncs to your account so you can continue on another device after logging in again.",
  howItWorksSyncGuest:
    "Without a full site account, quiz progress stays in this browser. You may",
  howItWorksGuestSignInLinkText: "sign in here",
  howItWorksGuestAfterLink: "with an email account to sync across devices.",
  howItWorksSyncAnonymous:
    "After you register below, we start a private learner session so your quiz progress can sync in the cloud (no password). If that is unavailable, progress stays on this device only.",
  howItWorksBullet1:
    "Open a module and mark each topic as reviewed when you have read or watched it.",
  howItWorksBullet2:
    "Take the end-of-module quiz. You need 80% or more to pass and unlock the next module.",
  howItWorksBullet3:
    "If you score below 80%, retake the quiz until you pass — your best score is saved.",
  programsSectionTitle: "Programs & micro-credentials",
  programsSectionIntro:
    "Group modules into a named track (micro-credential). Learners who pass every module in a track get a certificate that lists only those modules. Empty list hides this section.",
  programs: [],
  startPageTitle: "Before you begin",
  startPageIntro:
    "Enter your name and email so we can track your module progress and certificate. You do not need a separate password or account.",
  startPrivacyNote:
    "We use this information for learning progress and reporting only, consistent with your organization’s policies. You can reset progress from the hub.",
  startSubmitLabel: "Continue to modules",
  startFullNameLabel: "Full name (if you prefer one field)",
  startUseSeparateNamesHint: "Or use first and last name below.",
  certificateBlurb:
    "Download a certificate with your name, or print / save as PDF. Use Reset progress only if you need to redo the track — that can clear your saved certificate name and any synced progress.",
};
