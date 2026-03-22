/**
 * Knowledge Mobilization curriculum — replace copy, video URLs, and quiz items
 * with your own teaching materials. Video `embedUrl` should be a YouTube (or
 * similar) embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID
 */

export type KMTopic =
  | {
      id: string;
      title: string;
      type: "text";
      /** Short paragraphs shown as refresh content */
      paragraphs: string[];
    }
  | {
      id: string;
      title: string;
      type: "video";
      paragraphs: string[];
      /** Optional — if omitted, UI shows a placeholder for staff to add a link */
      embedUrl?: string;
      videoCaption?: string;
    };

export interface KMQuestion {
  id: string;
  /** Question stem */
  prompt: string;
  /** Exactly four choices (validated when authoring curriculum). */
  options: string[];
  /** Index 0–3 of the correct option */
  correctIndex: number;
}

export interface KMModule {
  slug: string;
  title: string;
  summary: string;
  order: number;
  topics: KMTopic[];
  questions: KMQuestion[];
}

export const KM_PASS_PERCENT = 80;

export const kmModules: KMModule[] = [
  {
    slug: "picu-neuro-basics",
    order: 0,
    title: "PICU neuro basics for bedside staff",
    summary:
      "Refresh core ideas about brain-focused care, screening, and when to escalate — built for nurses and allied staff.",
    topics: [
      {
        id: "why-brain-matters",
        title: "Why brain health matters in the PICU",
        type: "text" as const,
        paragraphs: [
          "Critically ill children are at risk for delirium, secondary brain injury, and subtle changes in consciousness. Early recognition helps the team intervene sooner and communicate clearly with families.",
          "You already observe behaviour, sleep–wake cycles, and interaction every shift. Structured screening turns those observations into actionable signals for the medical team.",
          "This module is a refresher, not a substitute for unit protocols or orders. Always follow your hospital’s policies and escalate per local chain of command.",
        ],
      },
      {
        id: "delirium-screening",
        title: "Delirium screening — quick concepts",
        type: "text" as const,
        paragraphs: [
          "Pediatric delirium can look like withdrawal, agitation, flat affect, or sleep–wake reversal. A calm, inattentive child may still have delirium.",
          "Consistency matters: try to assess around the same time when possible, with minimal stimulation, and document what you see in the flow sheet your unit uses.",
          "If scores trend up or the child’s baseline shifts, notify the bedside team and use your unit’s communication tool (SBAR, huddle, etc.).",
        ],
      },
      {
        id: "safety-huddle",
        title: "Video: safety and handoff reminders",
        type: "video" as const,
        paragraphs: [
          "Before watching, think about your last shift: one moment when a small detail in report or monitoring made a difference for a patient.",
          "Use this clip as a discussion starter with your charge nurse or educator — your site may replace it with a locally produced briefing.",
        ],
        embedUrl: "https://www.youtube.com/embed/ZbZSehyN1Bs",
        videoCaption:
          "Placeholder video for layout testing — replace with your unit’s approved embed.",
      },
    ],
    questions: [
      {
        id: "q1",
        prompt:
          "Which statement best reflects a helpful approach to delirium screening in the PICU?",
        options: [
          "Only agitated children need screening.",
          "Consistent, documented observations support earlier recognition and team communication.",
          "Delirium screening replaces the need for physician assessment.",
          "Screening should be done only once per admission.",
        ],
        correctIndex: 1,
      },
      {
        id: "q2",
        prompt:
          "You notice a quiet child with sleep–wake reversal and reduced engagement. What is the most appropriate first step?",
        options: [
          "Assume this is normal for ICU and take no action.",
          "Wait until rounds to mention it informally.",
          "Follow unit protocol for assessment/notification and document findings.",
          "Discontinue all sedation without notifying the team.",
        ],
        correctIndex: 2,
      },
      {
        id: "q3",
        prompt:
          "This Knowledge Mobilization site is intended to:",
        options: [
          "Replace hospital policies and medical orders.",
          "Replace informed consent for research participation.",
          "Support staff refresher learning alongside local protocols.",
          "Diagnose individual patients.",
        ],
        correctIndex: 2,
      },
      {
        id: "q4",
        prompt:
          "Why is trending behaviour and screening scores useful?",
        options: [
          "It removes the need for family updates.",
          "It helps detect change from a child’s baseline and triggers timely escalation.",
          "It is only relevant for surgical patients.",
          "It should never be documented in the medical record.",
        ],
        correctIndex: 1,
      },
      {
        id: "q5",
        prompt:
          "After completing a refresher module, your professional responsibility is to:",
        options: [
          "Ignore unit-specific procedures if they differ from the module.",
          "Apply learning within institutional policies and scope of practice.",
          "Provide independent medical treatment plans.",
          "Share quiz answers publicly to help others pass.",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "neuromonitoring-communication",
    order: 1,
    title: "Neuromonitoring & team communication",
    summary:
      "Strengthen how we describe neurological observations, monitoring basics, and clear escalation.",
    topics: [
      {
        id: "obs-language",
        title: "Describing what you see",
        type: "text" as const,
        paragraphs: [
          "Objective, specific language helps consultants and bedside physicians act quickly. Note stimulation level, response to voice, movement quality, pupils if within your scope, and any seizures or staring spells.",
          "Pair observations with time and context: before/after suctioning, after medication, or when the family is present.",
        ],
      },
      {
        id: "monitoring-limits",
        title: "Monitors and alarms — a refresher",
        type: "text" as const,
        paragraphs: [
          "Alarms are adjuncts, not replacements for assessment. When an alarm fires, correlate with the child’s clinical picture and follow unit policy.",
          "If EEG or other neuro-monitoring is in use, avoid assumptions about waveforms unless you are trained to interpret them — instead, note clinical changes and notify the appropriate provider.",
        ],
      },
      {
        id: "family-updates",
        title: "Video: family-centred updates (placeholder)",
        type: "video" as const,
        paragraphs: [
          "Family partners often notice subtle differences. A short, structured update reduces anxiety and improves shared decision-making.",
          "Replace this embed with your communication lab or ethics team’s approved clip.",
        ],
        videoCaption: "Add your approved training video embed URL in the curriculum file.",
      },
    ],
    questions: [
      {
        id: "m2q1",
        prompt:
          "When reporting a neurological concern to the medical team, what is most useful?",
        options: [
          "General statements without timing or context.",
          "Specific observations with time, context, and change from baseline.",
          "Only numeric monitor values, with no behavioural description.",
          "Waiting until the end of shift to report everything at once.",
        ],
        correctIndex: 1,
      },
      {
        id: "m2q2",
        prompt:
          "If you are not trained to interpret EEG waveforms, you should:",
        options: [
          "Change monitor settings independently.",
          "Document clinical changes and notify the responsible clinician per policy.",
          "Ignore alarms if the child looks comfortable.",
          "Discontinue monitoring.",
        ],
        correctIndex: 1,
      },
      {
        id: "m2q3",
        prompt:
          "Family-centred communication in critical care best includes:",
        options: [
          "Avoiding updates until discharge.",
          "Jargon-only explanations to save time.",
          "Clear, compassionate updates aligned with the care team’s plan.",
          "Guaranteeing specific outcomes.",
        ],
        correctIndex: 2,
      },
      {
        id: "m2q4",
        prompt:
          "Alarms on bedside equipment should prompt you to:",
        options: [
          "Silence them permanently without assessment.",
          "Assess the patient and follow unit policy for notification.",
          "Ignore them if another nurse is on break.",
          "Wait for automatic resolution only.",
        ],
        correctIndex: 1,
      },
      {
        id: "m2q5",
        prompt:
          "Documenting neurological observations is important because it:",
        options: [
          "Replaces direct patient assessment by physicians.",
          "Creates a timeline that supports continuity and safer handoffs.",
          "Should only be done by physicians.",
          "Is optional for stable patients.",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "quality-knowledge-sharing",
    order: 2,
    title: "Quality improvement & knowledge sharing",
    summary:
      "How refresher learning ties to safety culture, incident learning, and spreading good practice on your unit.",
    topics: [
      {
        id: "qi-basics",
        title: "From refresher to practice",
        type: "text" as const,
        paragraphs: [
          "Short modules like these work best when paired with huddles, checklists, and simulation your hospital already uses.",
          "When you spot a gap between learning and workflow, escalate through your educator or manager — that feedback improves future content.",
        ],
      },
      {
        id: "peer-learning",
        title: "Peer learning and psychological safety",
        type: "text" as const,
        paragraphs: [
          "Asking questions after a refresher is a strength. Use structured forums (unit council, practice council) to share barriers and solutions.",
          "Psychological safety means staff can speak up about risks without fear of retaliation — leaders set the tone.",
        ],
      },
    ],
    questions: [
      {
        id: "m3q1",
        prompt:
          "The best way to close the gap between online refreshers and real practice is often to:",
        options: [
          "Work only from memory without unit discussion.",
          "Pair learning with local protocols, huddles, and simulation.",
          "Avoid giving feedback to educators.",
          "Skip documentation to save time.",
        ],
        correctIndex: 1,
      },
      {
        id: "m3q2",
        prompt:
          "Psychological safety on a unit means:",
        options: [
          "Avoiding all difficult conversations.",
          "Staff can raise concerns about risks and care without fear of punishment.",
          "Only managers may suggest improvements.",
          "Incident reports are discouraged.",
        ],
        correctIndex: 1,
      },
      {
        id: "m3q3",
        prompt:
          "Feedback to educators or leadership about module content should be:",
        options: [
          "Avoided to prevent conflict.",
          "Shared constructively to improve future training.",
          "Only shared anonymously outside the hospital.",
          "Ignored if one person disagrees.",
        ],
        correctIndex: 1,
      },
      {
        id: "m3q4",
        prompt:
          "Knowledge mobilization in healthcare refers to:",
        options: [
          "Storing research PDFs without use.",
          "Moving evidence and learning into practical use by staff and teams.",
          "Replacing all in-person training.",
          "Publishing without staff access.",
        ],
        correctIndex: 1,
      },
    ],
  },
].sort((a, b) => a.order - b.order);

export function getModuleBySlug(slug: string): KMModule | undefined {
  return kmModules.find((m) => m.slug === slug);
}
