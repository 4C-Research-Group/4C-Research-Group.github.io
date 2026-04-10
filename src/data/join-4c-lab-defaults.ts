/**
 * Merge stored `/join-4c-lab` JSON onto built-in defaults (arrays replace wholesale).
 */

import {
  join4cLabPageDefaults,
  type Join4cLabPagePayload,
} from "./join-4c-lab-page";

function clone<T>(v: T): T {
  return structuredClone(v);
}

export const JOIN_4C_LAB_DEFAULTS: Join4cLabPagePayload =
  clone(join4cLabPageDefaults);

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

export function mergeJoin4cLabPayload(raw: unknown): Join4cLabPagePayload {
  const def = clone(JOIN_4C_LAB_DEFAULTS) as unknown as Record<
    string,
    unknown
  >;
  if (!raw || typeof raw !== "object") {
    return clone(JOIN_4C_LAB_DEFAULTS);
  }
  return mergeRecord(def, raw) as Join4cLabPagePayload;
}
