# Knowledge Mobilization — learning flow

This document describes how the **Knowledge Mobilization** mini–learning platform works on the 4C Research website: routes, progress rules, curriculum data, and certificates.

## Audience and purpose

- Built for **nurses and staff** to **refresh** material in short **modules**.
- Each module has **topics** (text and/or embedded video) and an end-of-module **quiz**.
- Progress and quiz completion are stored **only in the visitor’s browser** (`localStorage`). There is **no server-side account** or database.

## User journey

1. **Hub** — `/knowledge-mobilization/`  
   - Lists all modules in order.  
   - Explains: review topics → pass quiz at **≥ 80%** → next module unlocks.

2. **Module** — `/knowledge-mobilization/{module-slug}/`  
   - Learner expands each **topic**, reads text and/or watches video.  
   - They check **“I have reviewed this topic”** for every topic.  
   - The **quiz** stays **locked** until all topics are marked reviewed.  
   - Multiple choice; **Submit** scores the attempt.  
   - **≥ 80%** → module marked **passed**; next module unlocks.  
   - **&lt; 80%** → **Retake quiz** clears answers; they can try again. The **best** score on that device is kept until they reach 80%+.

3. **Certificate** — `/knowledge-mobilization/certificate/`  
   - Available only if **every** module is **passed** on this device.  
   - Learner enters **full name** (saved locally for next visit).  
   - **Download PNG** — generated in the browser (canvas → file).  
   - **Print / Save as PDF** — opens a print dialog (browser “Save as PDF” is the usual workflow).

4. **Reset progress** (hub)  
   - Clears **all** module progress **and** the saved **certificate name** for this browser.

## Unlock and pass rules

| Rule | Behavior |
|------|----------|
| First module | Always **unlocked**. |
| Later modules | Unlocked only if the **previous** module in order is **passed** (best quiz score ≥ **80%**). |
| Pass threshold | `KM_PASS_PERCENT` in `src/data/knowledge-mobilization.ts` (default **80**). |
| Topic gate | Quiz is disabled until **every** topic in that module is marked reviewed. |

## Local storage keys

| Key | Purpose |
|-----|---------|
| `4c-km-progress-v1` | Per-module: reviewed topic IDs, quiz attempts, best score, `passed` flag. |
| `4c-km-certificate-name` | Display name for the certificate. |

Constants for the certificate name key are exported from `src/lib/km-certificate.ts` as `KM_CERTIFICATE_NAME_STORAGE_KEY`.

## Source files (reference)

| Area | Location |
|------|----------|
| Curriculum (modules, topics, questions) | `src/data/knowledge-mobilization.ts` |
| Progress load/save, unlock helpers, `allModulesPassed` | `src/lib/km-progress.ts` |
| Certificate canvas, PNG download, print, name save | `src/lib/km-certificate.ts` |
| Hub UI | `src/app/knowledge-mobilization/page.tsx` |
| Module + quiz UI | `src/app/knowledge-mobilization/[moduleSlug]/ModuleRunner.tsx` |
| Static params + metadata for modules | `src/app/knowledge-mobilization/[moduleSlug]/page.tsx` |
| Certificate UI | `src/app/knowledge-mobilization/certificate/page.tsx` |
| Layout metadata | `knowledge-mobilization/layout.tsx`, `certificate/layout.tsx` |
| Missing module | `src/app/knowledge-mobilization/[moduleSlug]/not-found.tsx` |

Navigation: **More → Knowledge Mobilization** in `src/components/Navbar.tsx`; footer quick link in `src/components/Footer.tsx`.

## Editing the curriculum

1. Open **`src/data/knowledge-mobilization.ts`**.  
2. **`kmModules`** — array of modules; each has:
   - `slug` (URL segment), `order` (sort order), `title`, `summary`
   - `topics`: objects with `type: "text" as const` or `type: "video" as const"`, `id`, `title`, `paragraphs`, and for video optionally `embedUrl` (YouTube embed URL), `videoCaption`
   - `questions`: `id`, `prompt`, `options` (four strings), `correctIndex` (0–3)
3. Keep **`as const`** on topic `type` literals so TypeScript narrows correctly.
4. After adding a module, **`generateStaticParams`** in `[moduleSlug]/page.tsx` picks up new slugs automatically from `kmModules`.

## Static export note

The site uses **`output: "export"`** in Next.js. Module pages are pre-rendered for each slug in `kmModules`. No server API is required for this flow.

## Limitations (good to share with stakeholders)

- Progress and certificates are **per browser / device**, not centrally verified.  
- Clearing site data or using another device **does not** carry progress.  
- **Pop-up blockers** can block **Print / Save as PDF** (new window); users may need to allow pop-ups.  
- The certificate is a **local completion record**, not a substitute for employer or college transcripts unless your institution formally adopts it.

## Quick links (paths)

- Hub: `/knowledge-mobilization/`
- Example module: `/knowledge-mobilization/picu-neuro-basics/`
- Certificate: `/knowledge-mobilization/certificate/`

*(With `basePath` enabled for GitHub Pages, these paths are prefixed in production — use in-app `Link` components for correct URLs.)*
