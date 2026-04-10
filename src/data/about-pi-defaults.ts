/**
 * Defaults for `/about-pi`. Supabase `about_pi_page_settings` payload merges on top.
 */

import { aboutPiData, type AboutPiPagePayload } from "./about-pi";

function clone<T>(v: T): T {
  return structuredClone(v);
}

function serialDefaults(): AboutPiPagePayload {
  const base = JSON.parse(JSON.stringify(aboutPiData)) as AboutPiPagePayload;
  return {
    ...base,
    linkedinUrl: aboutPiData.linkedinUrl ?? "",
    googleScholarUrl: aboutPiData.googleScholarUrl ?? "",
    researchgateUrl: aboutPiData.researchgateUrl ?? "",
    orcidUrl: aboutPiData.orcidUrl ?? "",
  };
}

export const ABOUT_PI_DEFAULTS: AboutPiPagePayload = serialDefaults();

function mergeRecord(
  def: Record<string, unknown>,
  over: unknown,
): Record<string, unknown> {
  if (!over || typeof over !== "object" || Array.isArray(over)) {
    return { ...def };
  }
  const r = over as Record<string, unknown>;
  const out: Record<string, unknown> = { ...def };
  for (const k of Object.keys(def)) {
    const dv = def[k];
    const rv = r[k];
    if (rv === undefined) continue;
    if (Array.isArray(dv)) {
      out[k] = Array.isArray(rv) ? rv : dv;
    } else if (
      dv !== null &&
      typeof dv === "object" &&
      !Array.isArray(dv)
    ) {
      out[k] = mergeRecord(dv as Record<string, unknown>, rv);
    } else {
      out[k] = rv;
    }
  }
  return out;
}

/** Deep-merge stored JSON onto built-in defaults (arrays replace wholesale). */
export function mergeAboutPiPayload(raw: unknown): AboutPiPagePayload {
  const def = clone(ABOUT_PI_DEFAULTS) as unknown as Record<string, unknown>;
  if (!raw || typeof raw !== "object") {
    return clone(ABOUT_PI_DEFAULTS);
  }
  return mergeRecord(def, raw) as AboutPiPagePayload;
}
