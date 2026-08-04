/**
 * razingExecution.js — WR-8 amendments R + R2: THE RAZING, ASSEMBLED.
 *
 * `razing.js` is the LAW and holds NO IMPORTS AT ALL, deliberately: every gate in
 * it is worth exactly as much as the guarantee that nothing can lean on it. That
 * purity has a price — the law cannot reach a relationship edge, a grievance
 * ledger, a belief map or a license record, and all four are things the razing
 * must actually consult. THIS file pays that price in one place. It is the
 * ASSEMBLY layer: it gathers the banded facts the law eats, calls the law, and
 * returns a PLAN. It decides nothing the law could have decided and it writes
 * nothing at all.
 *
 * ── THE DIRECTION LAW (chair ruling CR-WR8-G, 2026-08-03, vetoable) ──────────
 * The occupation/razing writers MAY read the belief stage's outputs. K3 fences
 * belief and negotiation paths from reading TRUTH; it does not fence a writer
 * from reading BELIEFS, and the amendment's own required receipts — the mercy
 * receipt ("they could have taken everything and did not") and the
 * mistaken-feasibility receipt — cannot be produced without exactly this read.
 *
 * ⚠️ THE DIRECTION IS THE WHOLE OF THE RULING AND IT IS PINNED AS ONE. This file
 * imports belief READERS (`readConquestFeasibilityFor`, `readConquestIntentFor`,
 * `conquestMercyReceipt`, `mistakenFeasibilityReceipt`) and nothing in the belief
 * or negotiation estate may import THIS file. A belief module that imported the
 * razing writer would have acquired a road to the world's truth through the back
 * door, which is the exact leak K3 exists to prevent. `envoyK3BeliefSeam.test.js`
 * asserts the arrow, not the mere presence of an import — a pin that only checked
 * "the writer imports a reader" would stay green through the inversion.
 *
 * ── R-WZ-1: THE INSTITUTION STATUS FOLLOWS THE TRUTH (vetoable) ──────────────
 * The same shape as CR-WR8-F's tier ruling, applied one estate over. K1's
 * institution-status estate derives every status from LIVE CAUSES and re-derives
 * presence on every advance — "presence is re-derived from live state every
 * advance and is NOT stored (the no-orphan law made structural)". A razing that
 * WROTE a status would therefore be a second writer whose write the very next
 * `advanceInstitutionStatus` audits away, because no live cause backs it: the
 * ghost-write class, dressed as a feature.
 *
 * So the razing writes THE MECHANISM and lets K1 grade it. It stamps a `capacity`
 * impairment — the exact signal K1's `damage` cause reads
 * (`INSTITUTION_CAUSE_SIGNAL.damage` tests `impairmentTypes.has('capacity')`) —
 * at a severity this file derives, and K1's next advance reads the new truth and
 * says the word. `razedInstitutions` in the law leaf keeps its role as the
 * DESCRIPTOR of what the fire did; it is not, and must not become, the writer.
 *
 * ── R-WZ-2: THE RAZING'S "SHELL" IS CAPACITY-ZERO, NOT K1's SHELL (vetoable) ─
 * A seam mismatch the amendment's own wording hides, and it is written down here
 * rather than papered over. K1's SHELL is a NARROW predicate and says so: intact,
 * closed and UNFUNDED — `_worldPulseEconomyClosed === true` with status
 * `remnant`, "nothing is wrong with it; the money stopped". That is not what a
 * burned building is. Setting K1's shell flag would lie about the mechanism and
 * would let the reopen path launder a razing as a funding lapse.
 *
 * What amendment R actually describes by "shell" is stated in its own words:
 * "the building remembers what it was and does nothing". In K1's vocabulary that
 * is capacity01 === 0, and K1 reaches it through SEVERITY — its own tuning calls
 * severity 1 "a full suspension… temporarily zero". So the razing's shell band
 * stamps a capacity impairment at K1's MAX_SEVERITY and the institution grades
 * `impaired` with capacity01 0. The razing NEVER sets `_worldPulseEconomyClosed`,
 * and a negative control asserts that it never does.
 *
 * ── R-WZ-3: SEVERITY IS DERIVED FROM THE QUARREL, AND FORKS NO STREAM ────────
 * How hard a town burns is not a roll. The war layer's determinism contract
 * forks exactly one stream per siege (`siege:<target>:<tick>`) and the razing
 * rides the verdict that stream already produced; adding a second fork here
 * would move every existing campaign's siege sequence. Severity is therefore a
 * pure function of how hot the quarrel already is — the resentment above
 * hostility's own baseline, and the live grievance — both of which the extremity
 * composite has already read. A deeper wound burns harder, and the number is
 * reproducible from the world rather than from a die.
 *
 * PURE over its arguments: no rng, no wall-clock, no mutation, no writes. Every
 * fold is codepoint-sorted.
 */

import { compareCodepoint } from '../deterministicSort.js';
import {
  RAZING_TUNING,
  razingGate,
  readRelationshipExtremity,
  conservedSack,
  razingEdgeFlips,
  razedInstitutions,
  razingDeparture,
  razingSpoils,
} from './razing.js';
// THE BELIEF STAGE, READ-ONLY (CR-WR8-G). Readers only, and the arrow never
// reverses — see the direction law above.
import {
  conquestDoctrineActive,
  readConquestFeasibilityFor,
  readConquestIntentFor,
  ownNatureBandFor,
  openWarFrontCount,
} from './conquestDoctrineStage.js';
import { conquestMercyReceipt } from './conquestIntent.js';
import { mistakenFeasibilityReceipt } from './conquestFeasibility.js';
import { heldLicense, vengeanceLicensesActive } from './vengeanceLicense.js';
// The grievance conjunct of the extremity composite. `aggregateReasons01` is the
// war layer's OWN cause magnitude, already banded by the machinery that owns
// causes; this file neither derives nor decays it (razing.js's own note).
import { warReasonsFor, aggregateReasons01 } from './warReasons.js';
import {
  ensureRelationshipState,
  normalizeRelationshipEdge,
  getRelationshipSettlements,
  relationshipKeyFromEdge,
} from './relationshipState.js';
// R-WZ-1: the severities are K1's own, imported rather than re-declared. A leaf
// that must not acquire reach re-declares a constant and pins the two equal;
// this is an assembly layer that already imports the estate's neighbours, so the
// stronger discipline is available and taken — there is no second spelling to
// drift.
import { INSTITUTION_STATUS_TUNING } from './institutionStatusModel.js';

/**
 * @typedef {import('./razing.js').ExtremityRead} ExtremityRead
 * @typedef {import('./razing.js').RazingVerdict} RazingVerdict
 * @typedef {import('./razing.js').SackAccounting} SackAccounting
 */

/**
 * The impairment TYPE this writer stamps. It is K1's `damage` signal spelled the
 * way K1 reads it, and it is a named constant so the pin that proves the stamp
 * lands on the cause K1 actually tests can name the same string once.
 */
export const RAZING_IMPAIRMENT_TYPE = 'capacity';

export const RAZING_EXECUTION_TUNING = Object.freeze({
  // ── R-WZ-3: THE SEVERITY DERIVATION ──────────────────────────────────────
  // The floor is what a razing is at its coldest — a court that just cleared
  // every extremity conjunct and no more. It is deliberately well above zero:
  // by the time this function is reached the gate has already refused everyone
  // whose quarrel was merely bad.
  SEVERITY_FLOOR: 0.35,
  // How much of the remaining room the resentment ABOVE hostility's own baseline
  // buys, and how much the live grievance buys. They sum to the room, so a
  // maximal quarrel reaches 1 exactly and nothing has to be clamped to get there.
  SEVERITY_RESENTMENT_W: 0.35,
  SEVERITY_GRIEVANCE_W: 0.3,
  // The band above which the fire leaves a building that "remembers what it was
  // and does nothing". Read off the law leaf so the two cannot disagree about
  // where the shell band starts.
  SHELL_BAND: RAZING_TUNING.SHELL_SEVERITY,
});

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {number} */
function clamp01(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** @param {number} value @returns {number} 4-dp round, the repo's byte-tidy float */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {unknown} value @returns {ReadonlyArray<unknown>} */
function arrayOf(value) {
  return Array.isArray(value) ? value : [];
}

// ─────────────────────────────────────────────────────────────────────────────
// THE PAIR READ — the one place this file touches the relationship substrate.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The relationship state on the EXISTING edge between two settlements, or null.
 *
 * ⚠️ IT MINTS NOTHING, AND THE NULL IS LOAD-BEARING (CR-WR8-A). Relationship
 * states exist per regional-graph NEIGHBOUR edge; a razer who is nobody's
 * neighbour has no object that could ever reach an extreme, and "a razing mints
 * no edge to strangers" is enforced by this function refusing to invent one
 * rather than by a rule somewhere else remembering not to.
 *
 * @param {unknown} snapshot the pre-tick snapshot (regionalGraph + worldState)
 * @param {unknown} worldState
 * @param {string} aId @param {string} bId
 * @returns {{ relState: Record<string, unknown>, edge: unknown, key: string }|null}
 */
export function razingPairRelationship(snapshot, worldState, aId, bId) {
  const snap = recordOf(snapshot);
  const graph = recordOf(snap.regionalGraph);
  const states = recordOf(recordOf(worldState).relationshipStates);
  const a = String(aId || '');
  const b = String(bId || '');
  if (!a || !b || a === b) return null;
  for (const rawEdge of arrayOf(graph.edges)) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const ends = getRelationshipSettlements(edge);
    const from = String(ends.from || '');
    const to = String(ends.to || '');
    if (!((from === a && to === b) || (from === b && to === a))) continue;
    const key = relationshipKeyFromEdge(rawEdge);
    return {
      relState: recordOf(ensureRelationshipState(edge, states[key])),
      edge: rawEdge,
      key,
    };
  }
  return null;
}

/**
 * THE EXTREMITY COMPOSITE, ASSEMBLED (CR-WR8-B). Three conjuncts, three sources:
 * the edge TYPE and the RESENTMENT off the existing relationship state, and the
 * LIVE GRIEVANCE off the war layer's own cause ledger.
 *
 * ONE FUNCTION, BOTH DIRECTIONS — which is the point. R's own gate asks it of
 * the RAZER about the VICTIM; R2's license coupling asks it of a HOLDER about
 * the RAZER. A second assembler for the second question is exactly how the two
 * halves of one ruling drift apart.
 *
 * NO EDGE MEANS NOT EXTREME, and it means so through the law leaf rather than
 * through an early return here: an absent pair reads an empty edge type and a
 * zero resentment, and `readRelationshipExtremity` refuses on its own terms with
 * its own receipt. The refusal prose stays in one file.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, partyId?: unknown,
 *   counterpartId?: unknown }} args
 * @returns {ExtremityRead}
 */
export function razingExtremityFor({
  worldState = null, snapshot = null, partyId = '', counterpartId = '',
} = {}) {
  const party = String(partyId || '');
  const counterpart = String(counterpartId || '');
  const pair = razingPairRelationship(snapshot, worldState, party, counterpart);
  const grievance = aggregateReasons01(
    /** @type {Parameters<typeof aggregateReasons01>[0]} */ (
      warReasonsFor(
        /** @type {Parameters<typeof warReasonsFor>[0]} */ (worldState), party, counterpart,
      )
    ),
  );
  return readRelationshipExtremity({
    partyId: party,
    counterpartId: counterpart,
    edgeType: pair ? pair.relState.relationshipType : '',
    resentment01: pair ? pair.relState.resentment : 0,
    grievance01: grievance,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// THE VERDICT — the law's own gate, handed assembled facts.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} RazingDecision
 * @property {boolean} active        the doctrine is lit for this world
 * @property {RazingVerdict} verdict the law's answer
 * @property {ExtremityRead} extremity
 * @property {string} alignmentBand  the razer's own nature, as the law reads it
 * @property {boolean} licenseHeld
 * @property {string|null} licenseId the live license the vengeance road spends
 */

/**
 * MAY THIS VICTOR BURN THIS TOWN? The one entry the mouth calls.
 *
 * WHAT IS ASSEMBLED AND WHAT IS NOT. The siege is a fact the caller already
 * holds (it just resolved one); the alignment band is a SELF-READ through the
 * belief stage's own `ownNatureBandFor`, which is the same derived-alignment
 * read the intent layer uses, so the razer's nature means one thing across
 * WR-8; the extremity is assembled above; and the license is a validating read
 * of a persisted world fact. Nothing here decides — `razingGate` does.
 *
 * DORMANT IS A REFUSAL WITH A REASON, NOT A CRASH. With the doctrine dark the
 * function returns `active: false` and the law's own `no_siege`-shaped refusal
 * is never reached, because the caller never asks. A world that never lit WR-8
 * pays one boolean.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, razerId?: unknown,
 *   victimId?: unknown, tick?: unknown, siegeWon?: unknown }} args
 * @returns {RazingDecision}
 */
export function razingDecisionFor({
  worldState = null, snapshot = null, razerId = '', victimId = '', tick = 0, siegeWon = false,
} = {}) {
  const razer = String(razerId || '');
  const victim = String(victimId || '');
  const extremity = razingExtremityFor({
    worldState, snapshot, partyId: razer, counterpartId: victim,
  });
  if (!conquestDoctrineActive(worldState) || !razer || !victim || razer === victim) {
    return {
      active: false,
      verdict: {
        permitted: false, road: null, refusal: 'no_siege',
        receipt: 'the conquest doctrine is not lit in this world; no town burns by it.',
      },
      extremity,
      alignmentBand: 'unknown',
      licenseHeld: false,
      licenseId: null,
    };
  }
  const byId = recordOf(snapshot).byId;
  const item = byId instanceof Map ? byId.get(razer) : null;
  const alignmentBand = ownNatureBandFor(item, worldState);
  // THE LICENSE IS READ, NEVER ASSUMED. `heldLicense` validates on the way out,
  // so a forged save record cannot arm this court however it got into the file.
  const license = vengeanceLicensesActive(worldState)
    ? heldLicense(worldState, { holderId: razer, razerId: victim, tick })
    : null;
  const verdict = razingGate({
    siegeWon: siegeWon === true,
    extremity,
    alignmentBand,
    licenseHeld: license != null,
    actorId: razer,
    victimId: victim,
  });
  return {
    active: true,
    verdict,
    extremity,
    alignmentBand,
    licenseHeld: license != null,
    licenseId: license ? String(license.id) : null,
  };
}

/**
 * R-WZ-3 — HOW HARD IT BURNS. A pure function of how hot the quarrel already is:
 * the resentment above what open hostility itself implies, and the live
 * grievance. No die is rolled and no stream is forked, so wiring the razing
 * cannot move a single existing campaign's siege sequence.
 *
 * @param {ExtremityRead|null|undefined} extremity
 * @param {{ resentment01?: unknown, grievance01?: unknown }} [measured]
 *   the raw axis values behind the composite; the composite reports only which
 *   conjuncts were met, so the magnitudes are passed alongside it.
 * @returns {{ severity01: number, receipt: string }}
 */
export function razingSeverityFrom(extremity, measured = {}) {
  const T = RAZING_EXECUTION_TUNING;
  const row = recordOf(measured);
  const baseline = RAZING_TUNING.HOSTILE_RESENTMENT_BASELINE;
  const resentment = clamp01(row.resentment01);
  const grievance = clamp01(row.grievance01);
  // The room ABOVE the baseline, normalized. A hostile edge sitting exactly on
  // its own floor contributes nothing here, which is what makes the floor mean
  // "as hot as the structure implies" rather than "hot".
  const over = baseline >= 1 ? 0 : clamp01((resentment - baseline) / (1 - baseline));
  const severity01 = round4(clamp01(
    T.SEVERITY_FLOOR + over * T.SEVERITY_RESENTMENT_W + grievance * T.SEVERITY_GRIEVANCE_W,
  ));
  const heat = severity01 > T.SHELL_BAND ? 'to the ground' : 'hard';
  return {
    severity01,
    receipt: recordOf(extremity).extreme === true
      ? `the quarrel burns ${heat}: resentment ${round4(resentment)} against a floor of ${baseline},`
        + ` and a live grievance at ${round4(grievance)}.`
      : 'no quarrel stands hot enough to price a burning.',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// THE PLAN — what the fire does, in the estates' own mechanisms.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * R-WZ-1/R-WZ-2 — THE INSTITUTION DAMAGE STAMPS.
 *
 * One `capacity` impairment per non-protected institution, at K1's own severity
 * for the mechanism: the `damage` default below the shell band, and MAX_SEVERITY
 * (a full suspension — "temporarily zero") at or above it. K1's next advance
 * reads the stamps as its `damage` cause and grades the institution itself.
 *
 * PROTECTED INSTITUTIONS GET NO STAMP AND ARE STILL REPORTED, on the law leaf's
 * own reasoning: a caller that has to infer "untouched" from an omission is a
 * caller that will one day infer it from a bug.
 *
 * ⚠️ `_worldPulseEconomyClosed` IS NEVER SET HERE and never anywhere else in the
 * razing (R-WZ-2). K1's shell means the money stopped; a burned building is not
 * an unfunded one, and stamping the flag would let a close/reopen cycle launder
 * an atrocity into a budget line.
 *
 * @param {ReadonlyArray<unknown>} institutions the victim's roster
 * @param {unknown} severity01
 * @param {{ causeRef?: unknown, sinceTick?: unknown }} [stamp]
 * @returns {Array<{ id: string, name: string, status: string, protected: boolean,
 *   impairment: { type: string, severity: number, causeEventId: string, sinceTick: number }|null }>}
 */
export function razingInstitutionStamps(institutions, severity01, stamp = {}) {
  const severity = clamp01(severity01);
  const row = recordOf(stamp);
  const causeEventId = text(row.causeRef) || 'razing';
  const sinceTick = Number.isFinite(Number(row.sinceTick)) ? Math.trunc(Number(row.sinceTick)) : 0;
  const rows = arrayOf(institutions).map((raw) => {
    const inst = recordOf(raw);
    // The law leaf keys on `id`; a roster row that carries only a name is keyed
    // by its name, because the estate's own status ref does the same and an
    // unkeyed institution would silently drop out of the census.
    const id = text(inst.id) || text(inst.name);
    return { id, name: text(inst.name) || id, protectedFromSack: inst.protectedFromSack === true };
  }).filter((inst) => inst.id !== '');
  // THE DESCRIPTOR AND THE STAMP ARE THE SAME CENSUS, in the same order, so the
  // word the Herald says and the mechanism the world feels cannot disagree about
  // which building they are talking about.
  const described = razedInstitutions(
    rows.map((inst) => ({ id: inst.id, protectedFromSack: inst.protectedFromSack })),
    severity,
  );
  const byId = new Map(described.map((d) => [d.id, d.status]));
  const stampSeverity = severity > RAZING_EXECUTION_TUNING.SHELL_BAND
    ? INSTITUTION_STATUS_TUNING.MAX_SEVERITY
    : INSTITUTION_STATUS_TUNING.defaultSeverity.damage;
  return rows
    .slice()
    .sort((a, b) => compareCodepoint(a.id, b.id))
    .map((inst) => ({
      id: inst.id,
      name: inst.name,
      status: String(byId.get(inst.id) || 'intact'),
      protected: inst.protectedFromSack,
      impairment: inst.protectedFromSack ? null : {
        type: RAZING_IMPAIRMENT_TYPE,
        severity: stampSeverity,
        causeEventId,
        sinceTick,
      },
    }));
}

/**
 * @typedef {Object} RazingPlan
 * @property {string} road            the road taken, one of RAZING_ROADS
 * @property {number} severity01
 * @property {SackAccounting} sack    the conserved arithmetic, to the person
 * @property {ReturnType<typeof razingInstitutionStamps>} institutions
 * @property {ReturnType<typeof razingEdgeFlips>} edges
 * @property {ReturnType<typeof razingDeparture>} departure
 * @property {ReturnType<typeof razingSpoils>} spoils
 * @property {string} receipt
 */

/**
 * THE WHOLE PLAN, from a permitted verdict. Every piece comes from the law leaf;
 * this function's entire job is to hand each one the facts it cannot reach.
 *
 * ⚠️ NO OCCUPATION, NO GARRISON, NO TERMS — and the plan says so out loud rather
 * than by omission (`departure` carries the three explicit nulls). The victor
 * leaves; the departure IS the receipt.
 *
 * ⚠️ NO TIER IS COMPUTED, PROPOSED OR TARGETED (CR-WR8-F). The sack writes
 * people and `tierEligibility` reads the new truth. Nothing below names a rung.
 *
 * THE PLAN DOES NOT CARRY THE EXTREMITY, and the omission is deliberate: the
 * plan is what the fire DID, and the relationship that licensed it is the
 * VERDICT's business. A plan that also republished the gate's inputs would
 * invite a consumer to re-litigate a decision that has already been made.
 *
 * @param {{ verdict?: RazingVerdict|null,
 *   severity01?: unknown, population?: unknown, namedCastCount?: unknown,
 *   institutions?: unknown, movableWealth?: unknown, razerName?: unknown,
 *   victimName?: unknown, holderEdges?: unknown, causeRef?: unknown,
 *   tick?: unknown }} args
 * @returns {RazingPlan|null} null when the verdict did not permit a razing
 */
export function razingPlanFor({
  verdict = null, severity01 = 0, population = null,
  namedCastCount = 0, institutions = [], movableWealth = 0, razerName = '',
  victimName = '', holderEdges = [], causeRef = '', tick = 0,
} = {}) {
  const row = recordOf(verdict);
  if (row.permitted !== true) return null;
  const severity = clamp01(severity01);
  const sack = conservedSack({ population, severity01: severity, namedCastCount });
  const departure = razingDeparture({ razerName, victimName });
  const spoils = razingSpoils({ movableWealth, population });
  return {
    road: text(row.road),
    severity01: round4(severity),
    sack,
    institutions: razingInstitutionStamps(arrayOf(institutions), severity, { causeRef, sinceTick: tick }),
    edges: razingEdgeFlips(
      /** @type {Parameters<typeof razingEdgeFlips>[0]} */ (arrayOf(holderEdges)),
    ),
    departure,
    spoils,
    receipt: `${text(row.receipt)} ${sack.receipt} ${spoils.receipt} ${departure.receipt}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// THE TWO BELIEF RECEIPTS (CR-WR8-G's whole reason for existing).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * THE MERCY AND MISTAKEN-FEASIBILITY RECEIPTS, both read off the belief stage.
 *
 * MERCY IS NOT THE RAZING'S OPPOSITE — it is the CONQUEST's. `conquestMercyReceipt`
 * fires for a court that believed a conquest within reach and chose terms on
 * conscience, and it is emitted at the same seam the razing is decided because
 * that is the moment the world learns what the victor was willing to do. A
 * victor that razed is not merciful and the receipt correctly returns null for
 * it; a victor that could have taken everything and rode home with nothing is,
 * and says so in its own words.
 *
 * THE MISTAKEN RECEIPT NEVER REWRITES THE BELIEF. It reports what was believed,
 * what happened, and — only when they disagree — that the court was wrong. Both
 * directions are reachable: a court that believed a conquest in reach and was
 * not, and a court that believed itself doomed and was not.
 *
 * Returns nulls rather than throwing on a dark or unreadable world: a receipt
 * that cannot be honest is not emitted.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, observerId?: unknown,
 *   rivalId?: unknown, conquestSucceeded?: unknown, wasConquered?: unknown }} args
 * @returns {{ feasibility: unknown, intent: unknown,
 *   mercy: { merciful: boolean, receipt: string }|null,
 *   mistaken: { mistaken: boolean, direction: string, receipt: string }|null }}
 */
export function razingBeliefReceipts({
  worldState = null, snapshot = null, observerId = '', rivalId = '',
  conquestSucceeded = false, wasConquered = false,
} = {}) {
  if (!conquestDoctrineActive(worldState)) {
    return { feasibility: null, intent: null, mercy: null, mistaken: null };
  }
  const observer = String(observerId || '');
  const rival = String(rivalId || '');
  const feasibility = readConquestFeasibilityFor({
    worldState,
    snapshot,
    observerId: observer,
    rivalId: rival,
    openFronts: openWarFrontCount(snapshot, observer),
  });
  const intent = readConquestIntentFor({
    worldState, snapshot, observerId: observer, rivalId: rival,
  });
  return {
    feasibility,
    intent,
    mercy: conquestMercyReceipt(
      /** @type {Parameters<typeof conquestMercyReceipt>[0]} */ (intent),
      /** @type {Parameters<typeof conquestMercyReceipt>[1]} */ (feasibility),
    ),
    mistaken: feasibility
      ? mistakenFeasibilityReceipt(
        /** @type {Parameters<typeof mistakenFeasibilityReceipt>[0]} */ (feasibility),
        { conquestSucceeded: conquestSucceeded === true, wasConquered: wasConquered === true },
      )
      : null,
  };
}
