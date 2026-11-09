/**
 * domain/crisis/crisisHooks.js — THE HOOKS A CRISIS ADDS, BOUND TO ITS CAST.
 *
 * SOAK-1000 §3 (2026-11-03) measured that stress does not move the number of plot hooks (η 0.09):
 * a crisis added hooks no faster than calm did, and the count was a tier step. The chair's rule
 * (the HOOKS-UNDER-STRESS lane, 2026-11-04): each ACTIVE crisis contributes at least one hook bound
 * to its cast — the holder of a line role, by name, with the role's reason as the hook's fact — and
 * one bound to a lever — what the players can push, and the faction that loses — collected FIRST,
 * ahead of the hooks every place carries, so the tier's count stays the floor and not the whole.
 *
 * ⭐ DERIVED, NEVER INVENTED. Every name, house, reason and stake in these sentences is read off
 * the crisis record's own `cast` (`src/domain/crisis/crisisCast.js :: deriveCrisisCast`). The
 * sentence frames below are new prose and are listed in the lane's report as proposals for the
 * chair; nothing else here authors a word.
 *
 * ⛔ NO DRAW, AND NOTHING STORED. The line role, the lever and the losing faction are each the
 * FIRST that fits, in the cast's own order; nothing is chosen by chance, so no stream moves
 * anywhere — a calm place is untouched by construction (it has no crisis entry to read). The
 * hooks are read off the cast where the page reads them (`collectPlotHooks`, through
 * `effectiveCastOf`, so the DM's cast is the one named) and where the record is checked
 * (`hookTruthFindings`): a stored copy would carry person and faction names that the rename
 * cascades do not reach (measured: four undeclared paths in each of the two rename
 * denominators) and would go stale under the DM's cast edit.
 *
 * ⛔ A HOOK CHECKS THE PLACE BEFORE IT IS STORED. Each sentence is spoken through the estate's
 * one tier-noun rewrite and read by the one classifier (`src/domain/coherence/hookTruth.js`);
 * where the crisis's own noun is what the record contradicts (a famine entry on a place the food
 * analysis calls fed), the sentence says "the crisis" instead; where it still contradicts the
 * record, it is not written.
 *
 * Pure: no store, no React, no I/O, no rng.
 */

import { hookTruthViolations, settlementHookFacts, speakHookTruthfully } from '../coherence/hookTruth.js';
import { CAST_REASONS, effectiveCastOf, requiredRolesOf } from './crisisCast.js';
import { resolveDeclared, lineText } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { firstRankMembershipOf, powerOrderOf } from '../people/membership.js';
import { institutionDisplayName } from '../display/institutionDisplayName.js';

/** @typedef {import('./crisisCast.js').CrisisCast} CrisisCast */
/** @typedef {import('./crisisCast.js').CastRow} CastRow */
/** @typedef {import('./crisisCast.js').CrisisRole} CrisisRole */

/**
 * A stored crisis hook. `link` names the cast member the hook is bound to, so the page can link
 * the card to the person or house.
 * @typedef {{ text: string, bound: 'cast' | 'lever', link: { kind: 'npc' | 'faction' | 'institution', id: string, label: string } | null }} CrisisHook
 */

/** The noun each kind is spoken of by ("In the siege, …"). PROPOSAL N1 (the lane's report). */
export const CRISIS_NOUN = Object.freeze(/** @type {Record<string, string>} */ ({
  under_siege: 'siege',
  famine: 'famine',
  occupied: 'occupation',
  politically_fractured: 'split', // SW-6 CRISIS-SURFACES (B3, C·P1): "In the factional split" carried the retired word
  indebted: 'debt crisis',
  recently_betrayed: 'betrayal',
  infiltrated: 'infiltration',
  plague_onset: 'outbreak',
  succession_void: 'succession crisis',
  monster_pressure: 'raids',
  insurgency: 'insurgency',
  religious_conversion: 'conversion',
  slave_revolt: 'revolt',
  wartime: 'war',
  mass_migration: 'migration',
}));

/** The noun of last resort: an unknown kind, or a noun the record contradicts. */
const PLAIN_NOUN = 'crisis';

/** The crisis nouns that take a plural verb ("the raids turn"; B3: "The raids turns on …"). */
const PLURAL_NOUNS = Object.freeze(new Set(['raids']));

/**
 * A house as a sentence speaks it (SW-6 CRISIS-SURFACES, B3: "the Blacksmiths (3-10)", "the Inns and taverns
 * (district)", "the Professional city watch"): the setting-neutral label (`institutionDisplayName`), without the
 * roster's count or district tag, and lower-led where the catalogue's sentence case would put a capital mid-
 * sentence. A name with a capital past its first letter (a DM's own "Stormwatch Keep") keeps its case.
 * @param {string} name @returns {string}
 */
export function houseInProse(name) {
  const label = institutionDisplayName(name).replace(/\s*\((?:\d+(?:\s*[-–]\s*\d+)?|district)\)\s*$/i, '').trim();
  return /^[A-Z][^A-Z]*$/.test(label) ? label[0].toLowerCase() + label.slice(1) : label;
}

/**
 * The line roles as a clause naming their holder. PROPOSAL C1 (the lane's report): one clause per
 * line role, the holder's name in it, so a house or an institution reads as well as a person.
 * @type {Readonly<Record<string, (holder: string) => string>>}
 */
export const LINE_ROLE_CLAUSE = Object.freeze({
  // W7 HOOKS (the owner's style law of 2026-11-07; worklist rows 262, 272): the holder first, in plain verbs.
  brunt: (h) => `${h} takes the worst of it`,
  lever: (h) => `${h} holds the key to it`,
  instigator: (h) => `${h} is stirring it`,
  target: (h) => `it is aimed at ${h}`,
  defender: (h) => `${h} leads the defence`,
  treater: (h) => `${h} is the one who would come to terms`,
  // SW-6 CRISIS-SURFACES (W4 row 262; B3's garbled line "Occupation Authority speaks for the occupier here: leads
  // the occupying power"): the occupier's orders reach the place through the holder, a person or the house itself.
  face: (h) => `the occupier's orders come through ${h}`,
});

/**
 * The reasons a line role's clause already says (SW-6 CRISIS-SURFACES, B3: "leads the defence: leads the
 * military"; "speaks for the occupier here: leads the occupying power"). Where the holder's reason is one of
 * these, the cast hook is the clause alone, never the clause and its echo.
 * @type {ReadonlySet<string>}
 */
const CLAUSE_SAYS = new Set([CAST_REASONS.face, CAST_REASONS.defenderMilitary]);

/** @param {unknown} v @returns {string} */
const str = (v) => (typeof v === 'string' ? v : '');

/**
 * @typedef {Object} HookSettlement
 * @property {Array<{ id?: unknown, name?: unknown, memberships?: unknown }>=} npcs
 * @property {unknown=} powerStructure
 */

/**
 * How a cast row is named in a hook: a person with their house, a house by its name, an
 * institution with its article. A person's "house" is its FIRST-RANK power (the people car,
 * PEOPLE-2 CAST-DERIVED, 2026-11-07: the card's best standing, read from its memberships; the
 * hook text is lane 3's — only the party read changed here).
 * @param {HookSettlement} s @param {CastRow} row
 * @returns {string}
 */
function holderWords(s, row) {
  if (row.kind === 'npc') {
    const npc = (Array.isArray(s.npcs) ? s.npcs : []).find((n) => !!n && (str(n.id) || str(n.name)) === row.id);
    const house = str(firstRankMembershipOf(npc, powerOrderOf(s))?.power);
    return house ? `${row.name} of ${house}` : row.name;
  }
  return row.kind === 'institution' ? `the ${row.name}` : row.name;
}

/** @param {CastRow} row */
const linkOf = (row) => ({ kind: row.kind, id: row.id, label: row.name });

/**
 * The cast's line-role holder a hook is bound to: the first line role (the kind's required roles,
 * in the cast's own order) held by a PERSON, else the first held at all.
 * @param {string} kind @param {CrisisCast} cast
 * @returns {CastRow | null}
 */
export function lineRoleHolderOf(kind, cast) {
  const line = new Set(requiredRolesOf(kind));
  const rows = (Array.isArray(cast?.roles) ? cast.roles : []).filter((r) => line.has(r.role) && !!str(r.name));
  return rows.find((r) => r.kind === 'npc') || rows[0] || null;
}

/**
 * The cast's lever a hook is bound to — the first house the crisis turns on that has a holder,
 * else the first house — and the first faction that loses by the crisis.
 * @param {CrisisCast} cast
 * @returns {{ lever: import('./crisisCast.js').CastLever | null, loser: import('./crisisCast.js').CastStake | null }}
 */
export function leverAndLoserOf(cast) {
  const levers = (Array.isArray(cast?.levers) ? cast.levers : []).filter((l) => !!str(l.institution));
  const lever = levers.find((l) => !!str(l.holderName)) || levers[0] || null;
  const loser = (Array.isArray(cast?.stakes) ? cast.stakes : []).find((k) => k.stake === 'loses' && !!str(k.factionId)) || null;
  return { lever, loser };
}

/**
 * The cast hook's sentence for a noun. PROPOSAL C1.
 * @param {string} noun @param {string} clause @param {string} reason
 */
const castSentence = (noun, clause, reason) => (CLAUSE_SAYS.has(reason) ? `In the ${noun}, ${clause}.` : `In the ${noun}, ${clause}: ${reason}.`);

/**
 * The lever hook's sentence for a noun. PROPOSAL L1 (with a loser) and L2 (none loses).
 * @param {string} noun @param {string} house @param {string} holder @param {import('./crisisCast.js').CastStake | null} loser
 */
function leverSentence(noun, house, holder, loser) {
  const run = holder ? `, run by ${holder}` : '';
  // SW-6 CRISIS-SURFACES (W4 rows 266, 267; B3): the verb agrees with a plural noun, and the house reads as prose.
  const [turns, goes] = PLURAL_NOUNS.has(noun) ? ['turn', 'go'] : ['turns', 'goes'];
  const place = houseInProse(house);
  // W7 HOOKS (rows 263, 271): what the crisis turns on and who loses, in plain words; "the players can push
  // on" was machinery (the DM decides what the players push on).
  return loser
    ? `The ${noun} ${turns} on the ${place}${run}: if it gives way, ${loser.factionId} loses most, because ${loser.reason}.`
    : `The ${noun} ${turns} on the ${place}${run}: whoever wins it over decides how the ${noun} ${goes}.`;
}

/**
 * Speak one sentence as this place may: the tier noun rewritten, the crisis's own noun dropped
 * for "the crisis" where the record contradicts it, and nothing at all where it still does.
 * @param {(noun: string) => string} compose @param {string} noun
 * @param {import('../coherence/hookTruth.js').HookFacts} facts
 * @returns {string}
 */
function speakTrue(compose, noun, facts) {
  for (const n of noun === PLAIN_NOUN ? [noun] : [noun, PLAIN_NOUN]) {
    const text = speakHookTruthfully(compose(n), facts);
    if (text && hookTruthViolations(text, facts).length === 0) return text;
  }
  return '';
}

/**
 * The hooks one active crisis adds: one bound to its cast, one bound to its lever, each present
 * only where the cast holds what the sentence names and the record does not contradict it.
 * @param {unknown} settlement the record (its NPCs, food and defence facts)
 * @param {{ type?: unknown, cast?: CrisisCast | null }} entry the crisis entry and the cast to read
 * @param {import('../coherence/hookTruth.js').HookFacts} [facts] the place's facts, when the caller holds them
 * @returns {CrisisHook[]}
 */
export function crisisHooksOf(settlement, entry, facts = settlementHookFacts(settlement)) {
  const cast = entry?.cast;
  const kind = str(entry?.type);
  if (!cast || !kind) return [];
  const s = /** @type {HookSettlement} */ (settlement && typeof settlement === 'object' ? settlement : {});
  const noun = CRISIS_NOUN[kind] || PLAIN_NOUN;
  /** @type {CrisisHook[]} */
  const out = [];

  const holder = lineRoleHolderOf(kind, cast);
  // CENSUS-1d unit 2 (Appendix B row 94, kind T): the role's clause is resolved through
  // `resolveDeclared` (a declared clause is answered by this record's `factsOf`, read only when it
  // declares) and noted in the ledger; a clause is a template of the holder.
  const clauseOf = holder && LINE_ROLE_CLAUSE[holder.role]
    ? lineText(resolveDeclared(LINE_ROLE_CLAUSE[holder.role], {
      facts: () => factsOf(settlement), poolId: `LINE_ROLE_CLAUSE.${holder.role}`, surface: 'crisis',
    }).line)
    : null;
  if (holder && clauseOf && str(holder.reason)) {
    const text = speakTrue((n) => castSentence(n, clauseOf(holderWords(s, holder)), holder.reason), noun, facts);
    if (text) out.push({ text, bound: 'cast', link: linkOf(holder) });
  }

  const { lever, loser } = leverAndLoserOf(cast);
  if (lever) {
    const text = speakTrue((n) => leverSentence(n, lever.institution, str(lever.holderName), loser), noun, facts);
    if (text) {
      out.push({ text, bound: 'lever', link: loser ? { kind: 'faction', id: loser.factionId, label: loser.factionId } : null });
    }
  }
  return out;
}

// ── The crisis hook's name slot (CRISIS-2's open note; docs/DESIGN_CRISIS_TAB.md) ──────────

/**
 * The `{holder}` slot of each catalog `crisisHook` that NAMES a role the cast holds. `phrase` is
 * the sentence's own words for the role, which the slot replaces; `fill` says how the name
 * stands in it. Only a PERSON holding the role fills the slot; a crisis with no such holder
 * keeps its sentence as written. The two sentences that name the governing FACTION (insurgency,
 * slave revolt) take no slot here: a faction name stored in prose needs a row in the faction
 * rename cascade (`src/domain/factionRename.js`), which is the chair's to rule with the cast's
 * own open rows, so they are a proposal in the lane's report. A test
 * holds every phrase to occur exactly once in its catalog sentence, so this is a slot in the
 * sentence, never a second one.
 * @type {Readonly<Record<string, ReadonlyArray<{ role: CrisisRole, phrase: string, fill: string, kinds: ReadonlyArray<'npc' | 'faction' | 'institution'> }>>>}
 */
export const CRISIS_HOOK_SLOTS = Object.freeze({
  under_siege: Object.freeze([
    Object.freeze({ role: /** @type {CrisisRole} */ ('treater'), phrase: 'Someone in the leadership', fill: '{holder}', kinds: Object.freeze(/** @type {const} */ (['npc'])) }),
    Object.freeze({ role: /** @type {CrisisRole} */ ('defender'), phrase: 'Someone else', fill: '{holder}', kinds: Object.freeze(/** @type {const} */ (['npc'])) }),
  ]),
  famine: Object.freeze([
    Object.freeze({ role: /** @type {CrisisRole} */ ('lever'), phrase: 'A grain merchant', fill: '{holder}', kinds: Object.freeze(/** @type {const} */ (['npc'])) }),
  ]),
  occupied: Object.freeze([
    Object.freeze({ role: /** @type {CrisisRole} */ ('collaborator'), phrase: 'someone the players will recognise', fill: '{holder}, someone the players will recognise', kinds: Object.freeze(/** @type {const} */ (['npc'])) }),
  ]),
  plague_onset: Object.freeze([
    Object.freeze({ role: /** @type {CrisisRole} */ ('lever'), phrase: 'The healer who identified the outbreak first', fill: '{holder}, the healer who identified the outbreak first,', kinds: Object.freeze(/** @type {const} */ (['npc'])) }),
  ]),
});

/**
 * The entry's crisis hook with its slots filled from the cast by name. A slot with no fitting
 * holder leaves the sentence's own words; a sentence that does not carry the phrase (a custom
 * kind, a DM's own text) is returned as it is.
 * @param {string} kind @param {unknown} text @param {CrisisCast | null | undefined} cast
 * @returns {string}
 */
export function slotCrisisHook(kind, text, cast) {
  let line = str(text);
  const slots = CRISIS_HOOK_SLOTS[/** @type {keyof typeof CRISIS_HOOK_SLOTS} */ (kind)];
  if (!line || !slots || !cast) return line;
  const roles = Array.isArray(cast.roles) ? cast.roles : [];
  /** @type {Set<string>} one person fills one slot: two slots of one sentence name two people */
  const named = new Set();
  for (const slot of slots) {
    const row = roles.find((r) => r.role === slot.role && slot.kinds.includes(r.kind) && !!str(r.name));
    if (!row || named.has(`${row.kind}:${row.id}`) || !line.includes(slot.phrase)) continue;
    named.add(`${row.kind}:${row.id}`);
    const filled = slot.fill.split('{holder}').join(row.name);
    line = line.replace(slot.phrase, () => filled);
  }
  return line;
}

/**
 * THE CRISIS HOOK AS A READER SHOWS IT (the chair's ruling 4, 2026-11-04): the entry's stored
 * sentence is the TEMPLATE — the catalog's own words, never stored filled — and every surface that
 * prints it fills the `{holder}` slot here, from the cast the page shows (`effectiveCastOf`: the
 * DM's word where the DM spoke), so a cast edit renames the holder everywhere at once.
 * @param {unknown} settlement
 * @param {{ type?: unknown, crisisHook?: unknown, cast?: CrisisCast | null, _userEdits?: Record<string, { value?: unknown }> } | null | undefined} entry
 * @returns {string}
 */
export function crisisHookFor(settlement, entry) {
  if (!entry || typeof entry !== 'object') return '';
  const { cast } = effectiveCastOf(/** @type {never} */ (settlement && typeof settlement === 'object' ? settlement : {}), /** @type {never} */ (entry));
  return slotCrisisHook(str(entry.type), entry.crisisHook, cast);
}
