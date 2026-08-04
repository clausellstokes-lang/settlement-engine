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
 * "the building remembers what it was and does nothing".
 *
 * ⚠️⚠️ R-WZ-2-REVISED (chair, 2026-08-03, vetoable) — AND THE FIRST VERSION OF
 * THIS RULING WAS FALSE ABOUT THE SEAM. WZ-1 stamped K1's MAX_SEVERITY on the
 * shell band and recorded that "the institution grades impaired with capacity01
 * 0". IT DOES NOT, AND IT CANNOT. K1's `damage` cause fires on a TYPE — the
 * signal is literally `impairmentTypes.has('capacity')` — and the severity it
 * then grades is its OWN engine default for that cause, unless a PERSISTED
 * status annotation carries a `dmSeverity` override. So the number this writer
 * puts in the stamp reaches K1's grading through no path at all: a razing's
 * severity could only be carried by writing `dmSeverity` onto the institution-
 * status record, which is a change to the SHAPE of a persisted ledger and
 * therefore OWNER-GATED. It is NOT taken here, and it is NOT silently dropped —
 * it is recorded as an owner decision for later.
 *
 * SO v1 SHIPS SHELL-AS-STRONGEST-DAMAGE. Both bands stamp the SAME thing K1
 * reads, at K1's OWN default for the cause, and K1 grades them identically —
 * which is now stated honestly instead of being claimed away. THE DISTINCTION
 * LIVES IN THE RECEIPT: the razing's own descriptor still says `shell` and the
 * impairment prose says the building burned to a shell, so the Herald keeps the
 * word the amendment asked for while the mechanism keeps the truth.
 *
 * The razing NEVER sets `_worldPulseEconomyClosed`, and a negative control
 * asserts that it never does.
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
import {
  consumeVengeanceLicense,
  heldLicense,
  mintVengeanceLicenses,
  vengeanceLicensesActive,
} from './vengeanceLicense.js';
// The grievance conjunct of the extremity composite. The magnitudes are the war
// layer's OWN, already banded by the machinery that owns causes; this file
// neither derives nor decays them (razing.js's own note). Which of them the
// conjunct reads is CR-WR8-B-CLARIFIED's ruling — see `strongestLiveGrievance01`.
import { warReasonsFor, topReasons, REASON_TUNING } from './warReasons.js';
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

/**
 * THE ONE FROZEN EMPTY. Every dormant answer returns THIS OBJECT rather than a
 * fresh `{}`, so "byte-identical when dark" is a reference identity a pin can
 * assert with `toBe` instead of a deep-equality a drift could satisfy.
 */
export const EMPTY_PATCH = Object.freeze({});

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
// THE GRIEVANCE CONJUNCT (chair ruling CR-WR8-B-CLARIFIED, 2026-08-03, vetoable)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * THE STRONGEST SINGLE LIVE CAUSE this party holds against that counterpart.
 *
 * ⚠️ THIS IS A CORRECTION, AND THE THING IT CORRECTS SHIPPED. WZ-1 read the
 * conjunct through `aggregateReasons01`, which is Σ(scores) / AGGREGATE_SATURATION
 * 2.5 against an adequacy band of 0.6 — so ONE cause at its absolute maximum
 * aggregated to 0.4 and could not clear the band however monstrous it was, and a
 * razing silently required at least TWO strong live causes. That floor was a
 * side effect of a divisor, not a ruling: CR-WR8-B's own text says "a LIVE
 * grievance", singular, and one razing is historically enough to license the
 * answer to it. The two-strong-causes floor is RETIRED.
 *
 * THE UBIQUITY BRAKE SURVIVES, AND IT IS THE HONEST ONE. It is now about how bad
 * the worst thing is rather than how many things there are: a pile of small
 * quarrels no longer sums its way onto the extreme, because the maximum of a set
 * of weak causes is still weak. `topReasons` is the war layer's own score-desc
 * ordering — no second spelling of "which cause is worst" is minted here — and
 * a cause under the layer's own MIN_SCORE is not live at all.
 *
 * @param {unknown} worldState @param {string} partyId @param {string} counterpartId
 * @returns {number} 0..1
 */
export function strongestLiveGrievance01(worldState, partyId, counterpartId) {
  const entry = warReasonsFor(
    /** @type {Parameters<typeof warReasonsFor>[0]} */ (worldState), partyId, counterpartId,
  );
  const [top] = topReasons(/** @type {Parameters<typeof topReasons>[0]} */ (entry), 1);
  const score = clamp01(recordOf(top).score);
  return score >= REASON_TUNING.MIN_SCORE ? score : 0;
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
  // CR-WR8-B-CLARIFIED: the STRONGEST SINGLE LIVE CAUSE, not the saturated
  // aggregate. See `strongestLiveGrievance01` for why the divisor's floor was a
  // side effect rather than a ruling.
  const grievance = strongestLiveGrievance01(worldState, party, counterpart);
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
 * R-WZ-1/R-WZ-2-REVISED — THE INSTITUTION DAMAGE STAMPS.
 *
 * One `capacity` impairment per non-protected institution, at K1's OWN default
 * severity for the `damage` cause — ONE number, both bands, because that is the
 * only number K1 will ever grade this stamp at (see R-WZ-2-REVISED in the module
 * header: the cause signal reads the TYPE, and the severity comes from K1's own
 * table unless a persisted `dmSeverity` override says otherwise, which is an
 * owner-gated persistence-shape change and is not taken).
 *
 * THE SHELL BAND THEREFORE LIVES IN THE RECEIPT, NOT IN THE NUMBER. Each row
 * carries the law leaf's own status word AND a sentence saying what the fire
 * did, so a razed institution reads as a shell to the Herald and as a damaged
 * one to K1 — which is exactly what is true.
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
 *   receipt: string,
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
  // R-WZ-2-REVISED: ONE severity, both bands. K1 grades this stamp at its own
  // default for the `damage` cause whatever number sits here, so writing a
  // second number would be a field that looks load-bearing and carries nothing —
  // the ghost-write class wearing a tuning constant's clothes.
  const stampSeverity = INSTITUTION_STATUS_TUNING.defaultSeverity.damage;
  return rows
    .slice()
    .sort((a, b) => compareCodepoint(a.id, b.id))
    .map((inst) => {
      const status = String(byId.get(inst.id) || 'intact');
      return {
        id: inst.id,
        name: inst.name,
        status,
        protected: inst.protectedFromSack,
        // THE SHELL LIVES HERE. The word the amendment asked for is said by the
        // receipt, on the same row, in the same census — never by a severity K1
        // would not have read.
        receipt: inst.protectedFromSack
          ? `${inst.name} was spared the fire and still stands.`
          : status === 'shell'
            ? `${inst.name} burned to a shell: it remembers what it was and does nothing.`
            : `${inst.name} came out of the fire damaged and working badly.`,
        impairment: inst.protectedFromSack ? null : {
          type: RAZING_IMPAIRMENT_TYPE,
          severity: stampSeverity,
          causeEventId,
          sinceTick,
        },
      };
    });
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
// THE MOUTH'S ONE CALL (WZ-2). Everything above is assembly; this is the single
// entry `evaluateWarLayer` reaches at the siege-verdict site.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * THE SEVERITY OF THIS PARTICULAR QUARREL, read off the world rather than passed
 * in. `razingSeverityFrom` takes the magnitudes because the extremity composite
 * reports only which conjuncts were met; this reads those magnitudes from the
 * same two places the composite read them, so the mouth cannot hand the severity
 * function a number the extremity never saw.
 *
 * @param {unknown} worldState @param {unknown} snapshot
 * @param {string} razerId @param {string} victimId
 * @param {ExtremityRead|null} extremity
 * @returns {{ severity01: number, receipt: string }}
 */
export function razingSeverityForPair(worldState, snapshot, razerId, victimId, extremity) {
  const pair = razingPairRelationship(snapshot, worldState, razerId, victimId);
  return razingSeverityFrom(extremity, {
    resentment01: pair ? pair.relState.resentment : 0,
    grievance01: strongestLiveGrievance01(worldState, razerId, victimId),
  });
}

/**
 * THE EDGES LAW 5 MAY RE-TYPE, ASSEMBLED FROM THE SUBSTRATE.
 *
 * `razingEdgeFlips` takes a list of edges the razer ALREADY SHARES with someone
 * and each holder's adequacy to the VICTIM; it mints nothing and it cannot reach
 * the graph. This is the reach, and it is deliberately narrow: it walks only the
 * regional-graph edges INCIDENT TO THE RAZER, so a court the razer has never
 * bordered can never appear — CR-WR8-A's "a razing mints no edge to strangers"
 * enforced by what this function can see rather than by a rule it remembers.
 *
 * ⚠️ ADEQUACY IS `trust`, AND THAT IS A JUDGMENT (J-WZ2-2, vetoable). The
 * license mint asks for "allies, close friends, patrons", and the relationship
 * substrate's authored axes are trust / resentment / fear. Trust is the only one
 * of the three that means "was close to them"; resentment and fear both measure
 * the opposite pole of a different question. No new axis is minted, and no new
 * band: the floor stays the ONE `LICENSE_ADEQUACY_01`.
 *
 * @param {unknown} worldState @param {unknown} snapshot
 * @param {string} razerId @param {string} victimId
 * @returns {Array<{ holderId: string, edgeType: string, adequacyToVictim01: number }>}
 *   codepoint-sorted by holder id
 */
export function razingHolderEdgesFor(worldState, snapshot, razerId, victimId) {
  const graph = recordOf(recordOf(snapshot).regionalGraph);
  const razer = String(razerId || '');
  const victim = String(victimId || '');
  /** @type {Array<{ holderId: string, edgeType: string, adequacyToVictim01: number }>} */
  const out = [];
  if (!razer || !victim) return out;
  const states = recordOf(recordOf(worldState).relationshipStates);
  for (const rawEdge of arrayOf(graph.edges)) {
    const edge = normalizeRelationshipEdge(rawEdge);
    const ends = getRelationshipSettlements(edge);
    const from = String(ends.from || '');
    const to = String(ends.to || '');
    if (from !== razer && to !== razer) continue;
    const holderId = from === razer ? to : from;
    // The victim is not its own avenger, and neither is the razer.
    if (!holderId || holderId === razer || holderId === victim) continue;
    const relState = recordOf(ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]));
    const toVictim = razingPairRelationship(snapshot, worldState, holderId, victim);
    out.push({
      holderId,
      edgeType: text(relState.relationshipType),
      adequacyToVictim01: toVictim ? clamp01(toVictim.relState.trust) : 0,
    });
  }
  return out.sort((a, b) => compareCodepoint(a.holderId, b.holderId));
}

/**
 * THE ONE PATCH THE RAZING ASKS THE KERNEL TO PERSIST, AND IT IS FROZEN-EMPTY
 * IN EVERY WORLD THAT DID NOT BURN A TOWN.
 *
 * ⚠️⚠️ WHY A PATCH AND NOT A WRITE. `evaluateWarLayer` returns a bag; it cannot
 * mutate `worldState`, and the two files that CAN — `pulseKernel.js` at 1580 and
 * `applyWorldPulse.js` at 941 — are both frozen at their exact ceilings with
 * tolerance zero. So the license ledger travels as a patch on the bag and the
 * kernel spreads it into the ONE line it already writes, changing that line's
 * shape and adding none. When nothing is minted or consumed this returns the
 * SAME FROZEN OBJECT, so the spread is byte-neutral rather than merely equal.
 *
 * ✅ THE UNWIRED LEDGER IS RETIRED (lane WZ-3, under chair ruling CR-PK-1). It
 * stood here through lane WZ-2 because the consumer it named could not be
 * staged: the kernel carried two `no-useless-assignment` errors and the repair
 * had been recorded as unsafe. That analysis turned out to be false on both
 * legs — the flagged reassignment is not inside a conditional at all, and the
 * merge it feeds reads every group through `Array.isArray(group) ? group : []`,
 * so `undefined` and `[]` were never distinguishable there. The kernel now
 * spreads this patch at pulseKernel.js `...war.worldStatePatch, deployments:
 * war.deployments` — the ON-path re-seat inside `if (simulationRules.warLayerEnabled)`,
 * never the war-off wind-down twin, which `warDeployment.test.js` forbids
 * forever. The line's shape changed and its count did not: 1580 effective
 * before and after. A razing's licenses are now MINTED, CARRIED and PERSISTED.
 *
 * ⚠️ THE CLOSED LOOP IS NOT RE-IMPLEMENTED HERE. `mintVengeanceLicenses` refuses
 * the `vengeance` road at the only door that can create a license, so the
 * eye-for-an-eye cascade is structurally impossible; this function does not
 * repeat that check, because a second spelling of a closed loop is how a closed
 * loop opens.
 *
 * @param {{ worldState?: unknown, decision?: RazingDecision|null, plan?: RazingPlan|null,
 *   razerId?: unknown, victimId?: unknown, tick?: unknown, candidates?: unknown }} args
 * @returns {Readonly<Record<string, unknown>>}
 */
export function razingLicensePatch({
  worldState = null, decision = null, plan = null,
  razerId = '', victimId = '', tick = 0, candidates = [],
} = {}) {
  const before = recordOf(worldState);
  if (!plan || !decision || !vengeanceLicensesActive(before)) return EMPTY_PATCH;
  const razer = String(razerId || '');
  const victim = String(victimId || '');
  let next = /** @type {Record<string, unknown>} */ (before);
  next = mintVengeanceLicenses({
    worldState: next, razerId: razer, victimId: victim, tick, road: plan.road, candidates,
  });
  // AND THE AVENGER SPENDS WHAT IT CAME TO SPEND. "The license is CONSUMED on
  // use" — by its HOLDER, which on this road is the razer itself.
  if (plan.road === 'vengeance' && decision.licenseId) {
    next = consumeVengeanceLicense({
      worldState: next, licenseId: decision.licenseId, coalitionId: razer, tick,
    });
  }
  if (next === before) return EMPTY_PATCH;
  return Object.freeze({ spatialLedgers: next.spatialLedgers });
}

/**
 * ⚠️⚠️ THE RAZING'S ONE EMISSION, AND IT REPLACES THE CONQUEST RATHER THAN
 * RIDING IT. LAW 6 is the amendment's signature — "no occupation record, no
 * garrison, no vassal ledger, no terms" — so a razed town CANNOT also mint the
 * conquest power-transfer that hands it to an occupation authority. The mouth
 * therefore branches: this outcome or that one, never both.
 *
 * ⚠️ THE OUTCOME IS A MINOR, AND THAT IS A JUDGMENT RATHER THAN AN OVERSIGHT
 * (J-WZ2-1, vetoable). `candidateType: 'razing'` is deliberately NOT registered
 * in `CAMPAIGN_ALTERING_CANDIDATE_TYPES`, and the outcome carries no
 * `powerTransfer`, so `deriveDecisionTier` grades it `minor` and it auto-applies.
 * Registering it a MAJOR would make it DM-dismissable — and a dismissed razing
 * would have to strip its own out-of-band residue (the sacked population, the
 * institution stamps, the flipped edges) exactly as a dismissed conquest strips
 * the occupation seed. That strip lives in `pulseKernel.js`, which chair ruling
 * R-BLD-10 banks permanently at 1580 effective with tolerance zero. A
 * half-registered major — dismissable, with its residue left standing — is
 * strictly worse than an honest minor: the town would stay burned for a burning
 * that "did not happen". So v1 is a minor, and the major is a named follow-up.
 *
 * WHY THIS LIVES HERE AND NOT AT THE MOUTH. `warDeployment.js` measures 658
 * effective against an 800 ceiling; the whole razing fork has 142 lines to live
 * in, and the decision + the plan + this shape do not fit in them. The mouth
 * keeps the BRANCH (which it owns, because it owns the siege) and this file
 * keeps the assembly (which it already owns).
 *
 * ⚠️⚠️ `licenseState` IS THE ACCUMULATOR SEAM, AND IT EXISTS BECAUSE A TICK CAN
 * BURN TWO TOWNS. The mouth's razing branch lives inside the per-target siege
 * loop, so two sieges resolving on the same tick call this function twice. Each
 * call derives its patch from the worldState it is HANDED — so if both were
 * handed the same untouched one, the second patch would REPLACE the first and
 * the first razing's minted licenses would be silently lost the moment the
 * kernel spreads the last patch. The caller therefore threads the accumulating
 * ledger through `licenseState` while `worldState` stays the tick's ORIGINAL
 * picture. THE SPLIT IS THE POINT and it is not an accident of convenience:
 * every DECISION read (doctrine, beliefs, held licenses, the extremity walk)
 * must see the tick's opening state, or a license minted by the first burning
 * could arm the second one in the same tick — the eye-for-an-eye cascade,
 * re-entering through the accumulator door that was opened to prevent a leak.
 * Absent (`null`) it falls back to `worldState`, so a single-razing tick and
 * every existing caller are byte-identical.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, razerId?: unknown,
 *   victimId?: unknown, razerName?: unknown, victimName?: unknown,
 *   tick?: unknown, population?: unknown, namedCastCount?: unknown,
 *   institutions?: unknown, movableWealth?: unknown, holderEdges?: unknown,
 *   licenseState?: unknown }} args
 * @returns {{ decision: RazingDecision, plan: RazingPlan,
 *   worldStatePatch: Readonly<Record<string, unknown>>, outcome: Record<string, unknown> }|null}
 *   null when the doctrine is dark or the law refused — and the caller then does
 *   exactly what it did before this file existed.
 */
export function razingSiegeEmission({
  worldState = null, snapshot = null, razerId = '', victimId = '',
  razerName = '', victimName = '', tick = 0, population = null,
  namedCastCount = 0, institutions = [], movableWealth = 0, holderEdges = [],
  licenseState = null,
} = {}) {
  const razer = String(razerId || '');
  const victim = String(victimId || '');
  const decision = razingDecisionFor({
    worldState, snapshot, razerId: razer, victimId: victim, tick, siegeWon: true,
  });
  if (!decision.active || decision.verdict.permitted !== true) return null;
  const heat = razingSeverityForPair(worldState, snapshot, razer, victim, decision.extremity);
  const causeRef = `razing.${razer}.${victim}.${Math.trunc(Number(tick) || 0)}`;
  // The caller may hand its own edge list (the tests do, to walk the three
  // dispositions); absent one, the substrate is walked here. Either way
  // `razingEdgeFlips` decides, and it still mints nothing.
  const edges = arrayOf(holderEdges).length
    ? holderEdges
    : razingHolderEdgesFor(worldState, snapshot, razer, victim);
  const plan = razingPlanFor({
    verdict: decision.verdict, severity01: heat.severity01, population,
    namedCastCount, institutions, movableWealth,
    razerName, victimName, holderEdges: edges, causeRef, tick,
  });
  if (!plan) return null;
  const name = text(razerName) || razer;
  const victimLabel = text(victimName) || victim;
  return {
    decision,
    plan,
    // THE LEDGER WRITE, AS A PATCH THE KERNEL SPREADS (see razingLicensePatch).
    // The MINT reads the accumulating ledger (so a second burning on the same
    // tick composes rather than replaces); every DECISION above read the tick's
    // original picture. See the licenseState note in this function's contract.
    worldStatePatch: razingLicensePatch({
      worldState: licenseState || worldState,
      decision, plan, razerId: razer, victimId: victim, tick,
      candidates: arrayOf(edges).map((raw) => ({
        holderId: recordOf(raw).holderId,
        adequacyToVictim01: recordOf(raw).adequacyToVictim01,
        // Every row of the walk is an edge the razer ALREADY SHARES — that is
        // the walk's entire selection criterion — so the mint's second filter
        // is satisfied by construction rather than by a flag somebody set.
        sharesEdgeWithRazer: true,
      })),
    }),
    outcome: {
      id: causeRef.replace(/^razing\./, 'world_outcome.razing.'),
      type: 'condition',
      candidateType: 'razing',
      ruleId: 'war_layer_razing',
      ruleFamily: 'stressor',
      applyMode: 'auto',
      probability: 1,
      targetSaveId: victim,
      severity: plan.severity01,
      headline: `${name} burns ${victimLabel}`,
      summary: `${name}'s army took ${victimLabel} and put it to the torch.`
        + ` ${plan.departure.receipt}`,
      reasons: [decision.verdict.receipt, heat.receipt, plan.sack.receipt],
      // THE SACK IS ONE DELTA AND ONLY ONE. A conquest carries captives home; a
      // razing does not — "they burned it and rode home" — so nobody gains.
      ...(plan.sack.known && plan.sack.losses > 0 ? {
        populationDeltas: [{
          saveId: victim,
          delta: -plan.sack.losses,
          reason: `${name}'s army burns ${victimLabel}.`,
        }],
      } : {}),
      condition: {
        archetype: 'war_pressure',
        severity: plan.severity01,
        triggeredAt: { tick, sourceEventType: 'WAR_LAYER_RAZING', sourceEventTargetId: victim },
        causes: [{
          source: razer,
          effect: 'war_pressure',
          reason: `${name} razed ${victimLabel}.`,
        }],
      },
      // The mechanisms the downstream estates consume, carried on the outcome so
      // they ride the razing atomically the way the conquest's sack rides it.
      razing: {
        road: plan.road,
        severity01: plan.severity01,
        licenseId: decision.licenseId,
        institutions: plan.institutions,
        edges: plan.edges,
        departure: plan.departure,
        spoils: plan.spoils,
      },
    },
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
