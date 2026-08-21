/**
 * domain/worldPulse/npcVerdictTable.js — W-H2: THE TOTAL VERDICT TABLE.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §3c the verdict table, §11 determinism + tuning;
 * laws 2 REVEALED-ONLY, 3 TOTALITY, 4 FINITE SEMANTICS, 5 DORMANCY. Directive 8's
 * amendment: BANISHED is a VERDICT and ROAMING is a STATE, so three of the four
 * outcomes resolve into the same displaced state and only the exclusion edge tells
 * banishment apart mechanically.)
 *
 * WHAT THIS IS. One pure function from (exposure context x settlement state) to a
 * verdict drawn from a four-word closed vocabulary. It is TOTAL: every cell of the
 * input domain resolves, there is no fall-through, and the domain itself is
 * enumerable (verdictCells() below) so the totality pin can WALK it rather than
 * sample it. The mountain_pass class is the recorded reason that distinction is
 * written into the module instead of left to a test author: a vocabulary gap that
 * only a missing-cell walk can see will not be found by fixtures.
 *
 * ── THE RESOLUTION ORDER, AND WHY ELIGIBILITY IS NOT CERTAINTY ────────────────
 * The design fixes the order and it is implemented literally:
 *   1. rival-compromised          ⇒ turncoat is ELIGIBLE;
 *   2. criminal-compromised AND a criminal power is present ⇒ criminal_founding
 *      is ELIGIBLE;
 *   3. otherwise                  ⇒ the base verdict stands.
 * ELIGIBLE means "enters a weighted seeded choice against the base verdict", never
 * "wins". The base verdict is prison-present ? jailed : banished, so a
 * rival-compromised official in a prison town can still simply be jailed, and the
 * pin for that is a seed FAMILY rather than one seed: a single-seed pin over a
 * weighted choice proves nothing about the arm it happened to miss.
 *
 * ── THE ROLL IS A HASH, NOT A DRAW ───────────────────────────────────────────
 * The weighted choice consumes ZERO rng. It reads an FNV-1a hash of a labelled
 * composite key (`npcfate:verdict|...`), for the same two reasons H1's mint does:
 *   (a) STREAM SAFETY. A draw taken here would steal from the pulse stream and could
 *       move a golden in a lane that has nothing to do with this one. A hash is
 *       structurally incapable of it, so the draw-accounting pin is satisfied by
 *       construction rather than by an assertion about how many draws were taken.
 *   (b) IDEMPOTENCY. A verdict must be re-derivable. Re-resolving the same exposure
 *       returns the same verdict in any process, forever, which is what lets the
 *       apply lane be re-run after a reload without inventing a second sentence.
 * The label is carried in the key so the fork is named exactly as design §11 asks.
 *
 * ── WHAT THIS DELIBERATELY DOES NOT DECIDE ───────────────────────────────────
 * Design §3c lists "faction capacities" and "NPC facets" among the table's inputs.
 * They are NOT read here, and the narrowing is a decision rather than an oversight:
 * faction capacity governs where a roamer LANDS (admission, design §6) and belongs to
 * H3's circulation table, while NPC facets are an OUTPUT of the verdict here (the
 * reputation facets a verdict mints, below) and would be circular as an input to it.
 * The three inputs that remain are the three a court can actually weigh at sentencing.
 * Recorded as vetoable.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation.
 *
 * @enforced-by tests/domain/npcVerdictTable.test.js,
 *   tests/domain/npcVerdictApply.test.js
 */

import { isCriminalInstitution, npcAlignmentScore } from '../corruption.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { resolveLeash } from '../corruptionLeash.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { importanceWeight } from '../entities/npcs.js';
import { nameOf } from '../rulingPower.js';
import {
  COMPROMISE_SOURCES,
  NOTORIETY_BANDS,
  closedValue,
  notorietyRank,
} from './npcLedgerFacets.js';
import { npcConsequencesActive } from './npcLedger.js';
import { NPC_CONSEQUENCES_TUNING } from './npcConsequencesTuning.js';

/**
 * THE CLOSED OUTCOME VOCABULARY (design §3c). Four words, and the table may return
 * nothing else. Frozen so a typo reads as undefined at the call site rather than
 * silently persisting a fifth verdict into a ledger record.
 * @type {ReadonlyArray<string>}
 */
export const VERDICTS = Object.freeze([
  'jailed',
  'banished',
  'turncoat',
  'criminal_founding',
]);

/**
 * The three verdicts that RESOLVE INTO ROAMING (design §3c, directive 8's amendment).
 * Banished is a verdict; roaming is the state all three share. The one mechanical
 * difference between them at this layer is that banishment ALSO mints an exclusion
 * edge, which is what makes the banished person's door shut rather than merely open
 * elsewhere.
 * @type {ReadonlyArray<string>}
 */
export const ROAMING_VERDICTS = Object.freeze([
  'banished',
  'turncoat',
  'criminal_founding',
]);

/**
 * The verdict that HOLDS THE NPC IN PLACE, influence-stripped, until a DM release or
 * the tunable term expires. Named rather than inlined so the apply lane's branch and
 * this module's vocabulary cannot drift apart.
 */
export const HOLDING_VERDICT = 'jailed';

/**
 * The corruption lane's own exposure vocabulary, as npcAgency.js emits it: an exposed
 * corrupt NPC is either OUSTED from their seat or DEMOTED a rung. Declared closed here
 * so the revealed-only gate reads a bank rather than a string.
 * @type {ReadonlyArray<string>}
 */
export const EXPOSURE_KINDS = Object.freeze(['ousted', 'demoted']);

/**
 * Which revealed exposures reach the verdict table.
 *
 * ONLY OUSTING. A demotion is a real revealed exposure and it is deliberately NOT a
 * verdict trigger: the settlement absorbed the scandal, took a rung off the official,
 * and kept them. Sentencing every demotion would make the corruption lane's own
 * demote/oust ladder meaningless (an exposed pillar walks that ladder down over years
 * before ousting) and would flood the pool with people the town never actually threw
 * out. Ousting is the terminal revealed outcome, and it is the one a court answers.
 * VETOABLE: widening this to 'demoted' is a one-word change here plus a re-run of the
 * totality pin, which walks the vocabulary rather than the literal.
 * @type {ReadonlyArray<string>}
 */
export const VERDICT_TRIGGERING_EXPOSURE_KINDS = Object.freeze(['ousted']);

/**
 * NPC_CONSEQUENCES_TUNING (design §11) — the house table, RE-EXPORTED.
 *
 * The table itself moved to npcConsequencesTuning.js at W-H3, verbatim, and grew its
 * circulation / replacement / residency halves THERE rather than here. Design §11 asks
 * for ONE table for the whole W-H program and this file had 65 of its 800 permitted
 * lines left, so relocating was the only way to honour that without spending the budget
 * H4 still needs. It is re-exported from this module because every H2 importer and every
 * H2 pin reads it through this name; the relocation is invisible to all of them, which
 * is what makes it a move rather than a fork.
 */
export { NPC_CONSEQUENCES_TUNING };

/** The seeded-fork label for the verdict choice (design §11's `npcfate:*` namespace). */
export const VERDICT_FORK_LABEL = 'npcfate:verdict';

/** The composite-key delimiter, named for the same reason H1 names its own. */
const KEY_DELIM = '|';

/**
 * The catalog institutions that ARE a prison (design §2: the jailed precondition is an
 * institution-presence check, not a new concept). These are the exact catalog names.
 * @type {ReadonlyArray<string>}
 */
export const PRISON_INSTITUTION_NAMES = Object.freeze([
  'Small prison/stocks',
  'Large prison',
  'Massive prison',
]);

/**
 * The custom-content fallback. A campaign may carry an imported or authored institution
 * that is plainly a prison under another name, and refusing to see it would silently
 * banish people out of a town that has a gaol. Word-bounded so 'imprisonment' in a
 * description cannot match a NAME (only names are scanned).
 */
const PRISON_NAME_RE = /\b(prison|gaol|jail|stocks|dungeon)\b/i;

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/**
 * FNV-1a 32-bit. A LOCAL copy of the estate's one hash idiom, for the same reason
 * npcLedger.js carries one: it keeps this leaf's import posture narrow, and the
 * constants are identical everywhere they appear (kernel/proseHash.js,
 * spatial/spatialSubstrateRead.js, newsVoice.js).
 * @param {string} s @returns {number} unsigned 32-bit
 */
function fnv1a32(s) {
  let h = 0x811c9dc5;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * A deterministic roll in [0, 1) from a labelled key. ZERO DRAWS: this is the whole
 * randomness surface of the verdict table, and it reads a hash rather than a stream.
 * @param {string} key
 * @returns {number}
 */
export function verdictRoll01(key) {
  return fnv1a32(key) / 0x100000000;
}

/**
 * The roll key for one person's sentencing. The tick is included so two people
 * sentenced in the same town on the same seed do not share a fate by construction,
 * and the ARM is deliberately excluded so that changing the settlement's prison
 * presence changes only which verdict the base arm names, never the roll itself.
 * That separation is what makes the resolution-order pin readable.
 *
 * @param {{ settlementSeed?: unknown, settlementId?: unknown, rosterId?: unknown, name?: unknown, tick?: unknown }} args
 * @returns {string}
 */
export function verdictRollKey({ settlementSeed, settlementId, rosterId, name, tick }) {
  return [
    VERDICT_FORK_LABEL,
    text(settlementSeed),
    text(settlementId),
    text(rosterId),
    text(name),
    String(Math.max(0, Math.floor(Number(tick) || 0))),
  ].join(KEY_DELIM);
}

// ── THE SETTLEMENT STATE READERS ──────────────────────────────────────────────
/**
 * Does this settlement keep a prison? The jailed precondition, read as an
 * institution-presence check over the settlement's own institution list.
 *
 * RUIN-FILTERED (ruinFilterRoster walker, the live-provider class). This is not a
 * bare existence gate: it is a CAPACITY read that decides a person's fate, so a
 * calamity-flattened gaol must not credit the settlement with the ability to hold a
 * prisoner. That is precisely the over-crediting defect the filter exists to stop,
 * and the verdict table is where it would be most consequential. Routed through
 * liveInstitutions() rather than a hand-rolled status check, per the same-function law.
 *
 * @param {unknown} settlement
 * @returns {boolean}
 */
export function hasPrison(settlement) {
  const catalog = new Set(PRISON_INSTITUTION_NAMES);
  for (const inst of liveInstitutions(asObject(settlement))) {
    const name = text(asObject(inst).name).trim();
    if (!name) continue;
    if (catalog.has(name) || PRISON_NAME_RE.test(name)) return true;
  }
  return false;
}

/**
 * Every faction record on a settlement, from BOTH homes.
 *
 * THE TWO FACTION HOMES ARE NOT THE SAME LIST, and conflating them is the
 * faction-key defect class in a new costume. `powerStructure.factions[]` is the POWER
 * roster (the `{ faction, power, category }` records rulingStructure mints);
 * `settlement.factions[]` is the NPC GROUPING roster (the `{ name, members[] }`
 * records factionGrouping mints, and the only home that carries members). A criminal
 * power can appear in either, so the detector reads both and never assumes one.
 *
 * @param {unknown} settlement
 * @returns {Record<string, unknown>[]}
 */
export function allFactionRecords(settlement) {
  const s = asObject(settlement);
  /** @type {Record<string, unknown>[]} */
  const out = [];
  for (const f of asArray(asObject(s.powerStructure).factions)) out.push(asObject(f));
  for (const f of asArray(s.factions)) out.push(asObject(f));
  return out;
}

/**
 * Is a criminal power present here? The criminal_founding precondition (design §3c),
 * and the same predicate design §6d generalizes across the realm.
 *
 * Detection rides the CANONICAL accessors rather than a fresh regex: factionArchetype
 * is the estate's one faction-archetype detector, and isCriminalInstitution is the one
 * criminal-organization detector. Hand-rolling either is the recorded faction-key
 * defect class. A power counts, and so does a criminal INSTITUTION, because the
 * corruption lane attributes a leash to an institution while the design speaks of a
 * "power": both spellings name the same underworld, and reading only one of them would
 * make the arm unreachable in exactly the settlements the corruption web fires in.
 *
 * THE TWO HALVES FILTER DIFFERENTLY, ON PURPOSE. The INSTITUTION half is ruin-filtered
 * (liveInstitutions): the design's own text requires a STANDING criminal organization,
 * and a razed den is not standing, so crediting one would let a flattened building
 * satisfy the criminal_founding precondition. The FACTION half is deliberately NOT
 * filtered and cannot be: a faction is an organization, not a building — it carries no
 * ruin status, and a syndicate outlives the loss of its premises.
 *
 * @param {unknown} settlement
 * @returns {boolean}
 */
export function hasCriminalPower(settlement) {
  for (const faction of allFactionRecords(settlement)) {
    if (factionArchetype(faction) === FACTION_ARCHETYPES.CRIMINAL) return true;
  }
  for (const inst of liveInstitutions(asObject(settlement))) {
    if (isCriminalInstitution(/** @type {Parameters<typeof isCriminalInstitution>[0]} */ (inst))) return true;
  }
  return false;
}

/**
 * The settlement half of the verdict table's input domain, read once.
 * @param {unknown} settlement
 * @returns {{ prisonPresent: boolean, criminalPowerPresent: boolean }}
 */
export function settlementVerdictState(settlement) {
  return {
    prisonPresent: hasPrison(settlement),
    criminalPowerPresent: hasCriminalPower(settlement),
  };
}

// ── THE EXPOSURE CONTEXT (law 2, REVEALED-ONLY) ───────────────────────────────
/**
 * Who held the leash, as a COMPROMISE_SOURCES member.
 *
 * The mapping rides corruptionLeash.js's resolver, which is the estate's single
 * normalizer for a corruption beneficiary, so this module never re-derives the
 * foreign/local question. A FOREIGN leash (its beneficiary sits in another court) is
 * a rival power; a local leash naming a criminal organization is a criminal
 * institution; anything else is 'none', which is a real cell of the table rather than
 * a failure.
 *
 * THE EXPOSURE RECORD IS AUTHORITATIVE WHEN PRESENT, and the precedence is not a
 * preference. npcAgency resolves the leash at exposure time with the settlement in
 * hand and applies its own climate.criminalInstitutions[0] fallback for the local
 * case, so re-deriving from the NPC alone afterwards can silently answer 'none' where
 * the corruption lane already named an organization. A record carrying a `kind`
 * therefore answers on its own fields, including when its answer is 'none'. The NPC
 * fallback exists only for a caller with no record (a DM verb, a replayed fixture).
 *
 * @param {{ npc?: unknown, exposure?: unknown }} args
 * @returns {string} a COMPROMISE_SOURCES member
 */
export function compromiseSourceOf({ npc = null, exposure = null } = {}) {
  const record = asObject(exposure);
  const hasRecord = record.kind != null;
  if (record.foreign === true) return 'rival_power';
  if (text(record.criminalInstitution)) return 'criminal_institution';
  if (hasRecord) return 'none';
  const leash = resolveLeash(/** @type {Parameters<typeof resolveLeash>[0]} */ (npc || {}));
  if (leash.foreign) return 'rival_power';
  if (text(leash.criminalInstitution)) return 'criminal_institution';
  return 'none';
}

/**
 * THE REVEALED-ONLY GATE (law 2, constitutional).
 *
 * The system fires exclusively on the corruption web's covert to revealed transition,
 * and that transition IS the exposure record npcAgency emits. A corrupt NPC with no
 * exposure record is COVERT: `npc.corrupt === true` is the hidden state, not the
 * revealed one, and nothing in this module may read it as a trigger. That is why this
 * function takes the exposure as its subject and the NPC only as context.
 *
 * @param {{ npc?: unknown, exposure?: unknown }} args
 * @returns {{ revealed: boolean, triggering: boolean, exposureKind: string|null, compromiseSource: string }}
 */
export function exposureContextOf({ npc = null, exposure = null } = {}) {
  const record = asObject(exposure);
  const kind = text(record.kind);
  const revealed = EXPOSURE_KINDS.includes(kind);
  return {
    revealed,
    triggering: revealed && VERDICT_TRIGGERING_EXPOSURE_KINDS.includes(kind),
    exposureKind: revealed ? kind : null,
    compromiseSource: revealed
      ? closedValue(compromiseSourceOf({ npc, exposure }), COMPROMISE_SOURCES)
      : 'none',
  };
}

// ── THE TABLE (design §3c, law 3 TOTALITY) ────────────────────────────────────
/**
 * @typedef {Object} VerdictCell
 * @property {string} compromiseSource     a COMPROMISE_SOURCES member
 * @property {boolean} prisonPresent
 * @property {boolean} criminalPowerPresent
 */

/**
 * EVERY CELL of the verdict table's input domain, enumerated.
 *
 * THIS IS THE TOTALITY INSTRUMENT, and it is exported from the module under test on
 * purpose. A totality pin that enumerates the domain in its own file proves the test
 * author's idea of the domain is total; one that walks the MODULE's enumeration proves
 * the module's is. When a future wave widens an input the walk widens with it and the
 * pin reds on the new cell instead of quietly continuing to cover the old ones.
 *
 * Ordered deterministically (vocabulary order, then false before true) so a cell walk
 * reports the same cell index in every process.
 *
 * @returns {VerdictCell[]} 3 sources x 2 prison x 2 criminal power = 12 cells
 */
export function verdictCells() {
  /** @type {VerdictCell[]} */
  const cells = [];
  for (const compromiseSource of COMPROMISE_SOURCES) {
    for (const prisonPresent of [false, true]) {
      for (const criminalPowerPresent of [false, true]) {
        cells.push({ compromiseSource, prisonPresent, criminalPowerPresent });
      }
    }
  }
  return cells;
}

/**
 * The BASE verdict: what the court does when no eligible arm wins. Prison present ⇒
 * jailed; no prison ⇒ banished. Total over the boolean, with no third reading.
 * @param {boolean} prisonPresent
 * @returns {string}
 */
export function baseVerdictFor(prisonPresent) {
  return prisonPresent === true ? 'jailed' : 'banished';
}

/**
 * @typedef {Object} VerdictDecision
 * @property {string} verdict          a VERDICTS member. NEVER null, for any cell.
 * @property {string} baseVerdict      what the base arm would have said
 * @property {string} arm              'rival_turncoat' | 'criminal_founding' | 'base'
 * @property {string|null} eligibleVerdict  the arm's own outcome, null on the base arm
 * @property {number} roll01           the hashed roll that decided a weighted arm
 * @property {{ eligible: number, base: number }|null} weights  null on the base arm
 */

/**
 * THE VERDICT FUNCTION. Total over (exposure context x settlement state), closed
 * vocabulary, deterministic seeded tie-break, no fall-through.
 *
 * Read the arms in order; the first that is ELIGIBLE runs a weighted seeded choice
 * against the base verdict, and an arm that loses its own choice yields the base. When
 * no arm is eligible the base stands unopposed. Every path assigns `verdict` before
 * returning, and the three paths are exhaustive over the enumerated domain, which is
 * what verdictCells() lets the pin prove rather than assume.
 *
 * @param {Object} args
 * @param {string} args.compromiseSource      a COMPROMISE_SOURCES member (clamped)
 * @param {boolean} args.prisonPresent
 * @param {boolean} args.criminalPowerPresent
 * @param {string} args.rollKey               from verdictRollKey
 * @returns {VerdictDecision}
 */
export function resolveVerdict({ compromiseSource, prisonPresent, criminalPowerPresent, rollKey }) {
  const source = closedValue(compromiseSource, COMPROMISE_SOURCES);
  const baseVerdict = baseVerdictFor(prisonPresent === true);
  const roll01 = verdictRoll01(text(rollKey));

  /**
   * Run one eligible arm's weighted choice. The eligible outcome takes the LOW end of
   * the unit interval, so a lower roll favours the arm and the pin can name which half
   * of the interval it is asserting about.
   * @param {string} arm @param {string} eligibleVerdict @param {{ eligible: number, base: number }} weights
   * @returns {VerdictDecision}
   */
  const weighted = (arm, eligibleVerdict, weights) => {
    const total = weights.eligible + weights.base;
    const wins = total > 0 && roll01 * total < weights.eligible;
    return {
      verdict: wins ? eligibleVerdict : baseVerdict,
      baseVerdict,
      arm,
      eligibleVerdict,
      roll01,
      weights,
    };
  };

  // 1. RIVAL-COMPROMISED ⇒ turncoat eligible.
  if (source === 'rival_power') {
    return weighted('rival_turncoat', 'turncoat', NPC_CONSEQUENCES_TUNING.VERDICT_WEIGHTS.rival_power);
  }
  // 2. CRIMINAL-COMPROMISED AND a criminal power present ⇒ criminal_founding eligible.
  //    The second conjunct is load-bearing: a criminal-compromised official in a town
  //    with no underworld has nowhere to found anything, so the arm is unreachable
  //    there and the cell falls to the base rather than to a dead outcome.
  if (source === 'criminal_institution' && criminalPowerPresent === true) {
    return weighted('criminal_founding', 'criminal_founding', NPC_CONSEQUENCES_TUNING.VERDICT_WEIGHTS.criminal_institution);
  }
  // 3. THE BASE ARM, unopposed. This is the total tail: every remaining cell lands
  //    here, and it can only produce jailed or banished, both of which are in the
  //    vocabulary.
  return { verdict: baseVerdict, baseVerdict, arm: 'base', eligibleVerdict: null, roll01, weights: null };
}

// ── THE FACETS A VERDICT MINTS (THE FACET LAW) ────────────────────────────────
/**
 * The scandal class a compromise source implies. Closed and total: three sources,
 * three classes. 'brutality' and 'heresy' exist in the bank and are unreachable from
 * this lane, which is deliberate and recorded rather than an omission: they belong to
 * causes this system does not adjudicate.
 * @type {Readonly<Record<string, string>>}
 */
const SCANDAL_BY_SOURCE = Object.freeze({
  none: 'venality',
  rival_power: 'betrayal',
  criminal_institution: 'conspiracy',
});

/**
 * How loudly a verdict is spoken of, before the repeat-offender bump. A person the
 * town threw out is talked about further than one it locked up, which is the whole
 * mechanical point of the exclusion edge travelling with them.
 * @type {Readonly<Record<string, string>>}
 */
const NOTORIETY_BY_VERDICT = Object.freeze({
  jailed: 'known',
  banished: 'notorious',
  turncoat: 'known',
  criminal_founding: 'notorious',
});

/**
 * The world's read of a person's intent, from their AUTHORED conscience traits. The
 * 'unknown' rung is reserved for a record that carries no personality at all, so it
 * means "no signal" rather than "a signal that averaged out".
 * @param {unknown} npc
 * @returns {string} an ALIGNMENT_READS member
 */
export function alignmentReadOf(npc) {
  const record = asObject(npc);
  if (!record.personality || typeof record.personality !== 'object') return 'unknown';
  const score = npcAlignmentScore(/** @type {Parameters<typeof npcAlignmentScore>[0]} */ (record));
  const band = NPC_CONSEQUENCES_TUNING.ALIGNMENT_READ_DEADBAND;
  if (score > band) return 'good';
  if (score < -band) return 'evil';
  return 'neutral';
}

/**
 * The world's read of a person's capability, from their importance tier. This is the
 * facet that keeps a disgraced but formidable official worth hiring, which is why
 * circulation is a market rather than a drain.
 * @param {unknown} npc
 * @returns {string} a COMPETENCE_READS member
 */
export function competenceReadOf(npc) {
  const weight = importanceWeight(/** @type {Parameters<typeof importanceWeight>[0]} */ (asObject(npc)));
  if (weight >= 1.0) return 'formidable';
  if (weight >= 0.7) return 'capable';
  if (weight >= 0.4) return 'adequate';
  return 'inept';
}

/**
 * The reputation facet set a verdict mints (design §3b, THE FACET LAW). Total: every
 * facet resolves to a bank member for any input, and the key order matches
 * REPUTATION_FACET_KEYS so a minted set serializes identically to a normalized one.
 *
 * @param {Object} args
 * @param {string} args.verdict           a VERDICTS member
 * @param {string} args.compromiseSource  a COMPROMISE_SOURCES member
 * @param {unknown} args.npc
 * @param {number} [args.timesExposed]    the roster record's exposure count
 * @returns {{ notorietyBand: string, edictMark: string, scandalClass: string, alignmentRead: string, competenceRead: string }}
 */
export function verdictReputationFacets({ verdict, compromiseSource, npc, timesExposed = 0 }) {
  const source = closedValue(compromiseSource, COMPROMISE_SOURCES);
  const outcome = VERDICTS.includes(text(verdict)) ? text(verdict) : 'jailed';
  const baseBand = NOTORIETY_BY_VERDICT[outcome] || 'known';
  const repeats = Number(timesExposed);
  const bump = Number.isFinite(repeats) && repeats >= NPC_CONSEQUENCES_TUNING.REPEAT_EXPOSURE_NOTORIETY_BUMP_AT ? 1 : 0;
  const band = NOTORIETY_BANDS[Math.min(NOTORIETY_BANDS.length - 1, notorietyRank(baseBand) + bump)];
  return {
    notorietyBand: band,
    // The edict mark is BANISHED-ONLY by design §3b. A jailed or turncoat person
    // carries 'none' here and records their outcome on verdictCause instead, so this
    // facet never becomes a second drifting copy of the verdict table.
    edictMark: outcome === 'banished' ? 'banishment_edict' : 'none',
    scandalClass: SCANDAL_BY_SOURCE[source] || 'venality',
    alignmentRead: alignmentReadOf(npc),
    competenceRead: competenceReadOf(npc),
  };
}

// ── THE COMPOSED ENTRY POINT ──────────────────────────────────────────────────
/**
 * @typedef {Object} NpcVerdict
 * @property {string} verdict
 * @property {string} baseVerdict
 * @property {string} arm
 * @property {string|null} eligibleVerdict
 * @property {number} roll01
 * @property {{ eligible: number, base: number }|null} weights
 * @property {string} compromiseSource   COVERT INTELLIGENCE (law 7)
 * @property {string} exposureKind
 * @property {boolean} prisonPresent
 * @property {boolean} criminalPowerPresent
 * @property {boolean} roaming           true when the verdict resolves into roaming
 * @property {{ notorietyBand: string, edictMark: string, scandalClass: string, alignmentRead: string, competenceRead: string }} reputation
 * @property {string} factionId          the vacated seat's faction id ('' when none)
 * @property {string} factionName        the vacated seat's faction name ('' when none)
 */

/**
 * SENTENCE ONE EXPOSED NPC, or return null.
 *
 * Returns null, and writes nothing anywhere, when ANY of these hold:
 *   - the economy is dark (law 5: the flag is the only door);
 *   - the exposure is not revealed (law 2: covert corruption is untouched);
 *   - the revealed exposure is not a triggering kind (a demotion is absorbed).
 * A null return is the "no verdict" reading, and it is the only one: the table itself
 * has no null cell.
 *
 * @param {Object} args
 * @param {{ simulationRules?: unknown } | null | undefined} args.worldState
 * @param {unknown} args.settlement
 * @param {unknown} args.npc            the ROSTER record (npcs[] entry)
 * @param {unknown} args.exposure       the corruption lane's exposure record
 * @param {string} args.settlementSeed
 * @param {string} args.settlementId
 * @param {number} args.tick
 * @returns {NpcVerdict | null}
 */
export function npcVerdictFor({ worldState, settlement, npc, exposure, settlementSeed, settlementId, tick }) {
  if (!npcConsequencesActive(worldState)) return null;
  const context = exposureContextOf({ npc, exposure });
  if (!context.triggering) return null;

  const record = asObject(npc);
  const seat = vacatedSeatOf(settlement, record);
  const state = settlementVerdictState(settlement);
  const decision = resolveVerdict({
    compromiseSource: context.compromiseSource,
    prisonPresent: state.prisonPresent,
    criminalPowerPresent: state.criminalPowerPresent,
    rollKey: verdictRollKey({
      settlementSeed,
      settlementId,
      rosterId: record.id,
      name: record.name,
      tick,
    }),
  });

  return {
    verdict: decision.verdict,
    baseVerdict: decision.baseVerdict,
    arm: decision.arm,
    eligibleVerdict: decision.eligibleVerdict,
    roll01: decision.roll01,
    weights: decision.weights,
    compromiseSource: context.compromiseSource,
    exposureKind: text(context.exposureKind),
    prisonPresent: state.prisonPresent,
    criminalPowerPresent: state.criminalPowerPresent,
    roaming: ROAMING_VERDICTS.includes(decision.verdict),
    reputation: verdictReputationFacets({
      verdict: decision.verdict,
      compromiseSource: context.compromiseSource,
      npc: record,
      timesExposed: Number(record.timesExposed) || 0,
    }),
    factionId: seat.factionId,
    factionName: seat.factionName,
  };
}

/**
 * The faction SEAT this person holds, read through the canonical accessor. Both fields
 * are '' when they hold none, which is a real case rather than an error: an
 * unaffiliated NPC vacates no seat and therefore opens no contest.
 *
 * The match is by MEMBERSHIP LIST first, because the grouping roster is the home that
 * actually knows who sits where; the affiliation handle on the NPC record is the
 * fallback for a settlement whose grouping roster was never built. The name is read
 * through rulingPower.nameOf rather than off `.name`, because a real faction record
 * carries its display name in `.faction` and reading the wrong key is the recorded
 * faction-key defect class.
 *
 * @param {unknown} settlement
 * @param {Record<string, unknown>} npc
 * @returns {{ factionId: string, factionName: string }}
 */
export function vacatedSeatOf(settlement, npc) {
  const id = text(asObject(npc).id);
  if (id) {
    for (const faction of allFactionRecords(settlement)) {
      for (const member of asArray(faction.members)) {
        if (text(asObject(member).id) !== id) continue;
        const name = nameOf(/** @type {Parameters<typeof nameOf>[0]} */ (faction));
        if (name) return { factionId: text(faction.id), factionName: name };
      }
    }
  }
  for (const key of ['factionAffiliation', 'factionId', 'factionLink', 'faction', 'organizationId']) {
    const value = asObject(npc)[key];
    if (typeof value === 'string' && value) return { factionId: '', factionName: value };
  }
  return { factionId: '', factionName: '' };
}
