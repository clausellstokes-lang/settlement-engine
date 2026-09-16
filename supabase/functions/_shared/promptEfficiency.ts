/**
 * _shared/promptEfficiency.ts — TOKEN-EFFICIENCY primitives for the Surveyor edge functions
 * (OWNER COMMISSION: AI TOKEN EFFICIENCY, 2026-07-17). Deno-global-free, remote-import free —
 * the SAME code the edge runs is exercised by the vitest pins (tests/edgeFunctions/
 * promptEfficiency.test.js).
 *
 * Three primitives, three directives:
 *   • canonicalJson — a COMPACT canonical encoding of a read-model slice (stable key order,
 *     null/undefined dropped) over a raw JSON dump (directive 2). Deterministic ⇒ byte-stable
 *     across calls, which also keeps the static prompt prefix cache-priceable (directive 1).
 *   • compactSlices — encodes a retrieval bundle under a PER-TASK SLICE BUDGET ({ maxSlices,
 *     maxChars }): send only what the task needs (directive 2). Never re-orders or drops a
 *     slice silently past the budget without a visible truncation marker.
 *   • overTokenBudget — the operator ANOMALY FLAG (directive 7): a call past its class budget
 *     is flagged, never silently expensive. Estimates stay labelled estimates elsewhere.
 *
 * THE QUALITY BAR (non-negotiable): compaction is LOSSLESS of grounding SUBSTANCE — it drops
 * only nulls + whitespace + JSON punctuation, never a slice's real values; the budget trims
 * whole slices (visibly), never a slice's fields, so the grounding-parity + citation-law pins
 * stay green. A budget that would cut below what a task needs is the operator's to raise.
 */

/** A minimal read-model slice (the analystCore.Slice shape, structurally). */
export interface EffSlice {
  id: string;
  source: string;
  title?: string;
  data?: unknown;
}
export interface EffBundle {
  slices?: EffSlice[];
}

/**
 * Canonical, compact JSON of a value: object keys sorted, null/undefined entries dropped, no
 * insignificant whitespace. Deterministic (same value ⇒ same bytes) so a stable slice keeps a
 * stable prompt prefix. Pure + total (cycles are not expected in read-model slices; a thrown
 * stringify degrades to '""').
 */
export function canonicalJson(value: unknown): string {
  const seen = new WeakSet<object>();
  const norm = (v: unknown): unknown => {
    if (v === null || v === undefined) return undefined;
    if (Array.isArray(v)) return v.map((x) => (norm(x) === undefined ? null : norm(x)));
    if (typeof v === 'object') {
      const o = v as Record<string, unknown>;
      if (seen.has(o)) return undefined;
      seen.add(o);
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) {
        const nv = norm(o[k]);
        if (nv !== undefined) out[k] = nv;   // drop nulls/undefined — compaction
      }
      return out;
    }
    return v;
  };
  try {
    const n = norm(value);
    return JSON.stringify(n === undefined ? null : n);
  } catch {
    return '""';
  }
}

/**
 * Encode a retrieval bundle's slices under a per-task budget. At most `maxSlices` slices, each
 * canonical-encoded and truncated to `maxChars` with a visible marker. Returns the text + the
 * count actually sent (for the usage meter). Pure.
 */
export function compactSlices(
  bundle: EffBundle | null | undefined,
  budget: { maxSlices?: number; maxChars?: number } = {},
): { text: string; sliceCount: number; truncated: boolean } {
  const maxSlices = Number.isFinite(budget.maxSlices) ? Math.max(0, Number(budget.maxSlices)) : 6;
  const maxChars = Number.isFinite(budget.maxChars) ? Math.max(0, Number(budget.maxChars)) : 2500;
  const all = Array.isArray(bundle?.slices) ? bundle!.slices : [];
  const kept = all.slice(0, maxSlices);
  const droppedSlices = all.length - kept.length;
  let truncated = droppedSlices > 0;
  const parts: string[] = [];
  for (const s of kept) {
    let body = canonicalJson(s.data ?? []);
    if (body.length > maxChars) { body = body.slice(0, maxChars) + '…(truncated)'; truncated = true; }
    const title = s.title ? ` title="${String(s.title).slice(0, 80)}"` : '';
    parts.push(`SLICE id="${s.id}" source="${s.source}"${title}\n${body}`);
  }
  if (droppedSlices > 0) parts.push(`(+${droppedSlices} more slice(s) omitted to fit the task's retrieval budget)`);
  return { text: parts.join('\n\n'), sliceCount: kept.length, truncated };
}

/** The operator anomaly flag (directive 7): a call past its class budget. Pure; 0/absent
 *  budget never flags. */
export function overTokenBudget(totalTokens: number | null | undefined, budget: number | null | undefined): boolean {
  const b = Number(budget);
  const t = Number(totalTokens);
  return Number.isFinite(b) && b > 0 && Number.isFinite(t) && t > b;
}
