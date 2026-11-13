/**
 * power/rosterText.js — EVERY TEXT THAT NAMES A POWER READS THE FINAL ROSTER (COHERENCE-POWERS-3, F2; REVIEW-POWERS
 * F2). The density law sizes the roster at assembly (density/applyDensityLaw.js :: resizePoliticalRoster: the seats,
 * the fold, the power with no house), after the power step wrote each power's standing sentence
 * (power/factionStanding.js :: annotateFactionStanding) and the history step wrote its tensions' parties. A sentence
 * that names a power the page no longer shows, or ranks a power against powers the page does not show, is written
 * again from the final roster; a tension's party that left is pruned, or, where it was folded into the ruler of its
 * own kind, re-pointed to that ruler (the party is still in the quarrel, under the ruler's name). No draw: the
 * standing is the factionStanding table's own sentence for the final roster, and every other line is left as it
 * was born.
 */
import { annotateFactionStanding } from './factionStanding.js';
import { MERCHANT_CRAFT_VOTE } from '../factionDynamics.js';
import { inferFactionCategory } from './factionCategories.js';
import { backingArchetypeOf, RULER_KINDS } from '../../domain/dossier/powerSupport.js';
import { defenseFactsOf, forceWordsOf } from '../../domain/defense/defenseFacts.js';
import { isMaterializedCustomContent } from '../../domain/content/customContentSemanticAuthority.js';

/** @typedef {{ faction: string, power?: number, isGoverning?: boolean, desc?: string }} RosterSeat */

/**
 * The roster as the standing sentences read it: by power, the strongest first, ties in the roster's order (the order
 * the power step annotates on: factionDynamics.js :: applyLegitimacyMultipliers's re-sort), each seat a copy with no
 * description.
 * @param {ReadonlyArray<Record<string, any>>} factions @returns {RosterSeat[]}
 */
export function standingRosterOf(factions) {
  return (Array.isArray(factions) ? factions : [])
    .map((f) => ({ faction: String(f?.faction || ''), power: Number(f?.power) || 0, isGoverning: f?.isGoverning === true, desc: '' }))
    .filter((f) => f.faction)
    .sort((a, b) => b.power - a.power);
}

/**
 * The force the standing sentences name, as the power step reads it (rulingStructure.js :: generatePowerStructure: the
 * native roster's defence words).
 * @param {unknown} institutions @returns {{ body: string }}
 */
export function standingForceOf(institutions) {
  const native = (Array.isArray(institutions) ? institutions : []).filter((house) => !isMaterializedCustomContent(house));
  return forceWordsOf(defenseFactsOf({ institutions: native }));
}

/**
 * Each power's standing sentence on a roster, by name, and its rank there.
 * @param {RosterSeat[]} roster the standing roster (standingRosterOf) @param {{ body: string }} force
 * @returns {Map<string, { standing: string, rank: number }>}
 */
function standingsOf(roster, force) {
  const seats = roster.map((f) => ({ ...f, desc: '' }));
  annotateFactionStanding(seats, force);
  return new Map(seats.map((f, rank) => [f.faction, { standing: String(f.desc || ''), rank }]));
}

/**
 * The power each name that left the roster folded into, where it did: a power of the ruler's own kind goes into the
 * ruler (power/rulerKin.js :: settleHouselessPowers, the fold); any other power that left was trimmed or not built.
 * @param {string[]} gone @param {RosterSeat[]} finalRoster @returns {Map<string, string>}
 */
function foldedInto(gone, finalRoster) {
  const ruler = finalRoster.find((f) => f.isGoverning) || null;
  const kindOf = (/** @type {string} */ name) => backingArchetypeOf({ faction: name, category: inferFactionCategory(name) });
  const rulerKind = ruler ? kindOf(ruler.faction) : null;
  const out = new Map();
  if (!ruler || !RULER_KINDS.includes(rulerKind)) return out;
  for (const name of gone) if (kindOf(name) === rulerKind) out.set(name, ruler.faction);
  return out;
}

/**
 * The descriptions' standing sentences settled to the final roster. `annotated` is the roster the power step's
 * standing sentences were written on (standingRosterOf, taken before the resize). A power whose sentence names a
 * power that left, or was written for a rank it no longer holds, takes the sentence the final roster gives it, in
 * place of the old one at its description's end. A power whose description does not end in the old sentence (a
 * description another step rewrote) is left as it is. Returns the same object where nothing moves.
 * @template {{ factions?: Array<Record<string, any>> }} P
 * @param {P} powerStructure the final roster @param {RosterSeat[]} annotated @param {{ body: string }} force
 * @returns {P}
 */
export function settleStandingToRoster(powerStructure, annotated, force) {
  const factions = Array.isArray(powerStructure?.factions) ? powerStructure.factions : null;
  if (!factions || !annotated.length) return powerStructure;
  const finalRoster = standingRosterOf(factions);
  const onPage = new Set(finalRoster.map((f) => f.faction));
  const gone = annotated.map((f) => f.faction).filter((name) => !onPage.has(name));
  const before = standingsOf(annotated, force);
  const after = standingsOf(finalRoster, force);
  const namesGone = (/** @type {string} */ line) => gone.some((name) => line.toLowerCase().includes(name.toLowerCase()));
  let moved = false;
  const next = factions.map((f) => {
    const name = String(f?.faction || '');
    // COHERENCE-POWERS-7 (cold list REVIEW-W2A-3 #291): a density-law rival (`contestsNiche`) was minted as a copy of its
    // host, its host's standing sentence included; it settles from that sentence to its own
    const host = !before.get(name) && f?.contestsNiche ? String(f.contestsNiche) : null;
    const old = before.get(name) || (host ? before.get(host) : undefined);
    const now = after.get(name);
    if (!old || !now || !old.standing || old.standing === now.standing) return f;
    if (!namesGone(old.standing) && old.rank === now.rank) return f;
    const desc = String(f.desc || '');
    const base = desc === old.standing ? '' : desc.endsWith(` ${old.standing}`) ? desc.slice(0, -old.standing.length - 1) : null;
    if (base === null) return f;
    moved = true;
    return { ...f, desc: base && now.standing ? `${base} ${now.standing}` : (base || now.standing) };
  });
  return moved ? { ...powerStructure, factions: next } : powerStructure;
}

/**
 * The tensions' parties settled to the final roster: a party that left is pruned, or re-pointed to the ruler it folded
 * into (once). `annotated` names the roster before the resize, so a party that was never a power (the hoarders, the
 * desperate poor) is never touched. Returns the same object where nothing moves.
 * @template {{ currentTensions?: Array<Record<string, any>> }} H
 * @param {H} history @param {{ factions?: Array<Record<string, any>> }} powerStructure @param {RosterSeat[]} annotated
 * @returns {H}
 */
export function settleTensionsToRoster(history, powerStructure, annotated) {
  const tensions = Array.isArray(history?.currentTensions) ? history.currentTensions : null;
  if (!tensions || !annotated.length) return history;
  const finalRoster = standingRosterOf(powerStructure?.factions || []);
  const onPage = new Set(finalRoster.map((f) => f.faction));
  const gone = new Set(annotated.map((f) => f.faction).filter((name) => !onPage.has(name)));
  if (!gone.size) return history;
  const into = foldedInto([...gone], finalRoster);
  let moved = false;
  const next = tensions.map((t) => {
    const parties = Array.isArray(t?.factions) ? t.factions : null;
    if (!parties || !parties.some((p) => gone.has(String(p)))) return t;
    moved = true;
    /** @type {string[]} */
    const settled = [];
    for (const p of parties) {
      const name = gone.has(String(p)) ? into.get(String(p)) : String(p);
      if (name && !settled.includes(name)) settled.push(name);
    }
    return { ...t, factions: settled };
  });
  return moved ? { ...history, currentTensions: next } : history;
}

/**
 * The relationships' narratives settled to the final roster: the merchants' and craftsmen's vote names the landholding
 * power and needs it (factionDynamics.js :: MERCHANT_CRAFT_VOTE, a declared pair); where that power left, the row takes
 * the pair's sibling, which names none (the refused-winner rule: no roll). Returns the same object where nothing moves.
 * @template {{ factions?: Array<Record<string, any>>, factionRelationships?: Array<Record<string, any>> }} P
 * @param {P} powerStructure @param {RosterSeat[]} annotated @returns {P}
 */
export function settleNarrativesToRoster(powerStructure, annotated) {
  const rows = Array.isArray(powerStructure?.factionRelationships) ? powerStructure.factionRelationships : null;
  if (!rows || !annotated.length) return powerStructure;
  const onPage = new Set(standingRosterOf(powerStructure?.factions || []).map((f) => f.faction));
  const gone = annotated.map((f) => f.faction).filter((name) => !onPage.has(name));
  if (!gone.length) return powerStructure;
  let moved = false;
  const next = rows.map((row) => {
    const [merchants, craft] = Array.isArray(row?.pair) ? row.pair.map(String) : [];
    if (!merchants || !craft) return row;
    if (!gone.some((name) => row.narrative === MERCHANT_CRAFT_VOTE.against(merchants, craft, name))) return row;
    moved = true;
    return { ...row, narrative: MERCHANT_CRAFT_VOTE.sibling(merchants, craft) };
  });
  return moved ? { ...powerStructure, factionRelationships: next } : powerStructure;
}
