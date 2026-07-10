// generate-narrative/jsonUtils.ts — pure JSON helpers (parse, deep clone, path
// read, mutation-applied check, empty-payload check). Extracted verbatim from
// index.ts; behaviour-identical. Pure leaf — imports nothing.

function safeJsonParse(text: string): any {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Invalid JSON from model: ${(e as Error).message}`);
  }
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function getByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let ref = obj;
  for (const k of keys) {
    if (ref == null || typeof ref !== 'object') return undefined;
    ref = ref[k];
  }
  return ref;
}

/**
 * Detect when spec.apply produced no change despite a non-empty extract +
 * a successful Haiku response. This is the "silent shape mismatch" failure
 * mode: the model returned valid JSON but in a shape the apply doesn't
 * recognize (e.g. wrapping in `items` when the apply expects flat fields,
 * or using `source/target` when the apply checks `from/to`). Without this
 * detection the pass reports "succeeded" but the field stays raw — exactly
 * what the user reported for dmCompass and connectionsMap.
 *
 * Compares serialized snapshots. Returns true if apply mutated something at
 * (or under) snapshotPath.
 */
function applyMutated(beforeJson: string, afterValue: unknown): boolean {
  try {
    return beforeJson !== JSON.stringify(afterValue);
  } catch {
    // Cyclic or otherwise unstringifiable — assume mutation happened to
    // avoid spurious warnings.
    return true;
  }
}

/** Check whether a pass's extracted payload has anything to refine. */
function isEmptyPayload(payload: unknown): boolean {
  if (payload == null) return true;
  if (Array.isArray(payload)) return payload.length === 0;
  if (typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    return Object.keys(obj).length === 0 ||
      Object.values(obj).every((v) =>
        v == null ||
        (typeof v === 'string' && v.length === 0) ||
        (Array.isArray(v) && v.length === 0)
      );
  }
  return false;
}

export { safeJsonParse, deepClone, getByPath, applyMutated, isEmptyPayload };

