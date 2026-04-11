import { kmPageDefaults, type KmPagePayload } from "./km-page";

function clone<T>(v: T): T {
  return structuredClone(v);
}

export const KM_PAGE_DEFAULTS: KmPagePayload = clone(kmPageDefaults);

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
    if (k === "programs" && Array.isArray(rv)) {
      out[k] = rv;
      continue;
    }
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

export function mergeKmPagePayload(raw: unknown): KmPagePayload {
  const def = clone(KM_PAGE_DEFAULTS) as unknown as Record<string, unknown>;
  if (!raw || typeof raw !== "object") {
    return clone(KM_PAGE_DEFAULTS);
  }
  return mergeRecord(def, raw) as KmPagePayload;
}
