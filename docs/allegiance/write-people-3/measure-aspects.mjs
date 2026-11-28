// WRITE-PEOPLE-3 (2026-11-08): which fallback titles still reach a CATEGORY pool for personality,
// hook and tie prose, measured on the soak 1,000 (brief §2 item 2). Measure-only; writes one JSON
// line per settlement.
//   node docs/allegiance/write-people-3/measure-aspects.mjs <out.jsonl> [from] [to]
// THE FALLBACK CENSUS is WRITE-PEOPLE's (PEOPLE-1's definition, the seat house found by
// representatives.js :: seatHouseOf): a house face; the seat house's face through the tier's seat
// role (poolMap.js :: seatPoolFor), every other face through poolMap.js :: poolFor; a fallback when
// the row says so. For each fallback card it records:
//   personality — the draw's key: npcGenerator.js :: generateReligionType draws from the flat lists
//                 NPC_PERSONALITY_TRAITS / MANNERISMS / SPEECH_PATTERNS, keyed by NEITHER title nor
//                 category; the line records whether the card carries a personality at all.
//   hook        — the card's one person hook and its pool: poolMap.js :: hookPoolFor keys the
//                 category lists of NPC_FACTION_LOYALTY (the seat draws `government`; a magic pool
//                 where magic does not work draws `other`, representatives.js); no pool by title.
//   tie         — the card's OUTGOING tie (ties.js :: drawTies, `from` = the card) and its
//                 archetype key; the archetype is chosen by computeRelTension, whose first ten
//                 branches key on the PAIR'S CATEGORIES (CATEGORY_PAIR_KEYS below) — no tie line
//                 is keyed by title.
import { appendFileSync, writeFileSync } from 'node:fs';
import { familyOfInstitution } from '../../../src/data/institutionalCatalog.js';
import { HOOK_POOLS, poolFor, seatPoolFor } from '../../../src/generators/people/poolMap.js';
import { seatHouseOf } from '../../../src/generators/people/representatives.js';

/** The archetypes only a category-pair branch of computeRelTension returns. */
export const CATEGORY_PAIR_KEYS = new Set([
  'econ_crim_blur', 'econ_crim_exploitation', 'mil_crim_corruption', 'mil_crim_suppression',
  'econ_mil_contract', 'rel_mil_crusader', 'rel_crim_fraud', 'mag_crim_market',
  'gov_econ_dependence', 'gov_mil_friction',
]);

export function measure(s, label) {
  const houseByName = new Map((s.institutions || []).map((i) => [String(i?.name || ''), i]));
  const seat = seatHouseOf(s.institutions || []);
  const seatKey = seat ? String(seat.house.name || '') : null;
  const outTie = new Map((s.relationships || []).filter((r) => r && r.from != null).map((r) => [r.from, r]));
  const rows = [];
  for (const c of (s.npcs || [])) {
    if (!c?.institution || c.institution.kind !== 'house') continue;
    const fam = familyOfInstitution(houseByName.get(c.institution.key));
    const isSeat = seatKey !== null && c.institution.key === seatKey;
    const pool = isSeat ? seatPoolFor(s.tier) : poolFor(c.title, fam?.shelf ?? null);
    if (!pool.fallback) continue;
    const tie = outTie.get(c.id) || null;
    rows.push({
      title: c.title, seat: isSeat, category: c.category,
      personality: !!(c.personality && (c.personality.dominant || c.personality.flaw || c.personality.modifier)),
      hook: Array.isArray(c.plotHooks) && c.plotHooks.length > 0,
      hookPool: isSeat ? 'government' : (HOOK_POOLS.includes(c.category) ? c.category : 'other'),
      tie: tie ? tie.archetypeKey ?? null : null,
      tieByPair: tie ? CATEGORY_PAIR_KEYS.has(String(tie.archetypeKey)) : false,
    });
  }
  return { label, faces: (s.npcs || []).filter((n) => n?.institution?.kind === 'house').length, rows };
}

const [out, from = '0', to = '1000'] = process.argv.slice(2);
if (out) {
  writeFileSync(out, '');
  const { birth, ensureLaws } = await import('../../../scripts/audit/soak-review/corpus.mjs');
  await ensureLaws();
  for (let i = Number(from); i < Number(to); i += 1) appendFileSync(out, JSON.stringify(measure(birth(i).settlement, `soak1k-${i}`)) + '\n');
}
