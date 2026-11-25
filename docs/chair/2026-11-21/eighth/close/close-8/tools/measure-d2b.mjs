// BIRTH-1, unit D2b: does the stored pressure line share a sentence with the stored prominent line? The oracle is the Overview's
// own test as it stood at the base (OverviewTab.jsx, X-50), copied verbatim here so a tree without the shared leaf is read alike.
import { createHash } from 'node:crypto';
const sentenceSet = (text) => new Set(String(text || '').split(/(?<=[.!?])\s+/)
  .map((x) => x.trim().replace(/[.!?]+$/, '')).filter((x) => x.split(/\s+/).length >= 4));
const h = (v) => createHash('sha256').update(JSON.stringify(v) ?? 'u').digest('hex').slice(0, 16);
export function measure(town) {
  const pr = town?.prominentRelationship?.phrasing ?? null;
  const ps = typeof town?.pressureSentence === 'string' ? town.pressureSentence : null;
  const prs = sentenceSet(pr);
  const shared = !!ps && [...sentenceSet(ps)].some((x) => prs.has(x));
  return { shared, equal: !!ps && ps === pr, ps, pr, psNull: ps === null,
    rest: h({ ...town, pressureSentence: null }), prHash: h(town?.prominentRelationship ?? null) };
}
