/**
 * inventionSignal.ts — a LOGGING-ONLY advisory signal that flags proper nouns the AI
 * gave a mechanical/structural role in refined prose that resolve against NEITHER the
 * settlement's canon entity set NOR the DM's sanctioned guidance text.
 *
 * WHY (audit): the overlay verifier is structural (diffs entity arrays); the model's
 * most likely invention vector is PROSE — naming a temple or guildmaster that never
 * enters an entity array. Whether to ENFORCE against that is a paid-path product
 * decision (see aiOverlayVerifier.js scope boundary). This does not enforce: it MEASURES,
 * turning "is a prose-invention check's false-positive rate tolerable?" from an opinion
 * into a number from real generations, at zero user-facing / money-path risk.
 *
 * SAFETY: every export here is PURE and total (no I/O, no throw on garbage input). The
 * caller logs the result inside a try/catch placed AFTER `send({done})` — a throw on
 * this path would reach the stream's catch-all refund() and spuriously refund a
 * successful paid generation, so it must never affect control flow.
 *
 * SCOPE (deliberately conservative — a false positive is only log noise, but a signal
 * drowned in noise informs nothing): only proper nouns bearing a TITLE ("Guildmaster
 * X") or a STRUCTURE role ("the X Temple", "Order of X") are candidates — not every
 * capitalized token. The prompt sanctions naming DM-context lore as color, so the DM
 * guidance text is subtracted. daily-life beats are out of scope for now (no settlement
 * shape at that done-site + the highest-FP surface).
 */
import { collectEntityNameRefs } from './entityRefWrapper.ts';

// Strip the entity-ref fence tokens (⟦entity:<id>|<name>⟧) so a wrapped KNOWN name
// reads as plain text and is correctly recognised as canon, not flagged as invented.
const FENCE = /⟦entity:[^|]+\|([^⟧]+)⟧/g;
const stripFences = (s: string): string => s.replace(FENCE, '$1');

/**
 * The FULL canon proper-noun set (lowercased) the model is allowed to name: entities
 * (NPC / faction / neighbour via collectEntityNameRefs) + institutions + districts +
 * the settlement name. Completeness matters — an omitted institution becomes a false
 * "invention". Total: never throws on a malformed settlement.
 */
export function collectFullCanon(settlement: any): Set<string> {
  const canon = new Set<string>();
  const add = (n: unknown) => {
    const s = typeof n === 'string' ? n.trim().toLowerCase() : '';
    if (s.length >= 2) canon.add(s);
  };
  try {
    for (const ref of collectEntityNameRefs(settlement)) add(ref?.name);
  } catch { /* collectEntityNameRefs is total, but stay defensive */ }
  for (const inst of (settlement?.institutions || [])) add(inst?.name);
  for (const d of (settlement?.districts || settlement?.districtProfile?.districts || [])) add(d?.name);
  add(settlement?.name);
  return canon;
}

/** Read-only prose fields off a refined settlement clone (thesis, per-tab notes, NPC goals). */
export function proseFieldsOf(settlement: any): string[] {
  const out: string[] = [];
  if (typeof settlement?.thesis === 'string') out.push(settlement.thesis);
  const nn = settlement?.narrativeNotes;
  if (nn && typeof nn === 'object') {
    for (const k of Object.keys(nn)) if (typeof nn[k] === 'string') out.push(nn[k]);
  }
  for (const npc of (settlement?.npcs || [])) {
    if (typeof npc?.goal?.short === 'string') out.push(npc.goal.short);
  }
  return out;
}

const TITLE = '(?:Guildmaster|Guildmistress|Captain|Commander|Lord|Lady|Sir|Dame|Baron|Baroness|Count|Countess|Duke|Duchess|King|Queen|Prince|Princess|High\\s+Priest(?:ess)?|Archmage|Warden|Steward|Reeve|Sheriff|Chancellor|Magister|Abbot|Prior|Bishop|Master|Mistress|Elder|Chief|Overseer|Marshal)';
const STRUCT = '(?:Temple|Order|House|Guild|Church|Cult|Cathedral|Chapel|Shrine|Company|Brotherhood|Sisterhood|College|Academy|Lodge|Bank|Consortium)';
const PROPER = '([A-Z][a-z]+(?:\\s+[A-Z][a-z]+){0,2})';
const PATTERNS: RegExp[] = [
  new RegExp(`\\b${TITLE}\\s+${PROPER}`, 'g'),          // "Guildmaster Ferrick"
  new RegExp(`\\bthe\\s+${PROPER}\\s+${STRUCT}\\b`, 'g'), // "the Ferrick Temple"
  new RegExp(`\\b${STRUCT}\\s+of\\s+(?:the\\s+)?${PROPER}`, 'g'), // "Order of the Iron Hand"
];

/**
 * Scan prose for role-marked proper nouns absent from BOTH the canon set and the DM
 * guidance text — candidate invented entities. Pure + total. Returns a count + up to
 * a handful of distinct sample NAMES (never full prose / PII).
 */
export function scanProseForInvention(
  prose: string[],
  canon: Set<string>,
  dmText: string,
): { count: number; samples: string[] } {
  const dm = (typeof dmText === 'string' ? dmText : '').toLowerCase();
  const hits = new Set<string>();
  try {
    for (const raw of (prose || [])) {
      if (typeof raw !== 'string' || !raw) continue;
      const text = stripFences(raw);
      for (const re of PATTERNS) {
        re.lastIndex = 0;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
          const name = (m[1] || '').trim();
          const key = name.toLowerCase();
          if (key.length < 3) continue;
          // Canon (whole-or-part, either direction) → known, not invented.
          let known = false;
          for (const c of canon) { if (c.includes(key) || key.includes(c)) { known = true; break; } }
          if (known) continue;
          if (dm && dm.includes(key)) continue; // sanctioned DM color
          hits.add(name);
        }
      }
    }
  } catch { /* total by contract */ }
  return { count: hits.size, samples: [...hits].slice(0, 8) };
}
