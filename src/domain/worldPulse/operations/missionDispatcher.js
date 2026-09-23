/**
 * missionDispatcher.js — W-OPS car O1: §3.12's DELIBERATION ROAD, and nothing else.
 *
 * docs/DESIGN_W_OPS.md §2 and §8b (the panel fold); docs/DESIGN_FP_ARCH_ES.md §3.12
 * (spy-before-decision: deliberation, urgency, the timeout); ODQ §806 finding F5.
 *
 * ── ⛔ WHAT THIS IS NOT, FIRST, BECAUSE THE REFUSAL IS LOAD-BEARING ────────────────────
 * The ES certification row records, in its own words, that ES-Da built "not the autonomous
 * per-tick dispatcher ES-7 was refused for, but a RIDER". THAT REFUSAL STANDS AND IS CITED
 * HERE. This module is therefore NOT an autonomous cadence: it never asks "should this
 * court spy today", it holds no clock of its own, and it walks no roster. It answers only
 * the charter-sanctioned question — GIVEN a decision this principal is already about to
 * take on a belief it is not sure of, may that decision WAIT for a confirmation? — and it
 * answers it by calling §3.12's own `deliberationRead`, never by re-spelling it.
 *
 * ⭐ THE IMPORT IS THE GUARANTEE. Re-implementing the verdict here would give the estate
 * two spellings of one law, and DESIGN_W_OPS §0 rules that this volume "EXTENDS §3.4/§3.4b
 * upward and re-rules none of its math". A copied threshold is a re-ruling that nobody
 * notices until the two drift, so the coupling is DECLARED (the ARGUED_UNLAYERED row for
 * this file names the one INFO read and its reason) rather than avoided by duplication.
 *
 * ── ⛔ THE ONE-MINT LAW (F5's second half), AND THE SEAM IT RESTS ON ───────────────────
 * "A demand the rider satisfies is CONSUMED — the dispatcher reads UNMET demands only. No
 * double-mint."
 *
 * ⚠ THIS LANE SEARCHED FOR THE RIDER'S SATISFACTION MARKER AND THERE IS NONE, ANYWHERE.
 * Measured at this tip: `espionageRider.js` is pure, returns cargo, and mutates nothing;
 * `normalizeCovertMission` emits an exact key set with no satisfaction member; the only
 * symbol in the tree that names satisfaction is `gatherOrGovernRead`'s `demandMet`
 * parameter, which is an INJECTED boolean with NO PRODUCER and no caller. So the marker is
 * NAMED here, not invented:
 *
 *   THE DEMAND-CONSUMPTION SEAM. `openOperations` is an INPUT. At wiring time its supplier
 *   must DERIVE the open set from live covert errand rows — a covert sub-record on an
 *   errand row already names its `subjectId`, so "this principal already has a watcher out
 *   about this subject" is readable with ZERO new state, on the `ransomDwellRead`
 *   precedent (derive from the row on every read, store nothing). ⛔ It must NOT be cured
 *   by minting a `satisfied` field: the ES §1 canonical model's whole fight was zero new
 *   persisted keys, and a consumption flag would be a second source for a fact the errand
 *   ledger already carries.
 *
 * Because the input is injected, this module's one-mint rule is TOTAL over what it is
 * given and cannot be the place the law leaks; what remains owed is the supplier, and that
 * is car O2's, recorded rather than assumed.
 *
 * ── THE CAPS, AND WHY THE DEFAULT IS DERIVED RATHER THAN AUTHORED ──────────────────────
 * DESIGN_W_OPS §7 risk 1: "dispatcher flood → per-principal per-tick caps, need-driven
 * only, seeded, codepoint-stable". The cap is an ARGUMENT with a default, so no caller is
 * forced to accept a knob this lane chose. The default MIRRORS the errand family's
 * `MAX_CONCURRENT_ENVOYS` (CR-WIRE-C's "a court cannot flood the roads with spies") rather
 * than importing it, because that module matches the GRAMMAR layer family and this leaf
 * would acquire a second cross-layer read for one integer. The mirror is PARITY-PINNED
 * test-side against the live constant, the newsVoice/marketPrices precedent, so a retune
 * reds instead of drifting.
 *
 * ── DETERMINISM: CODEPOINT-STABLE ORDER FIRST, THEN ONE SEEDED KEY ─────────────────────
 * `stableSampleByWeight`'s own contract is that the caller canonicalises order BEFORE the
 * draw. This module does the same in its own shape: survivors are sorted by
 * `compareCodepoint` on the demand id — a rename-stable identity, never a display name —
 * and only then ranked by a keyed hash over `(principalId, tick, demandId)`. Same world,
 * same order, same cut, on every device and in every locale.
 *
 * ── DARK: NO PRODUCTION CALLER — AND THE FLAG IS MINTED, JUST NOT HERE ─────────────────
 * Nothing under src/ imports this module; tests/domain/missionDispatcher.test.js walks the
 * src tree and asserts the empty importer set. That half stands.
 *
 * ⛔ THE OTHER HALF WAS "NO FLAG IS MINTED HERE", AND IT WENT FALSE AT CAR LGT-P5-WOPS 2/4
 * — CORRECTED 2026-09-05 BY LANE L-CHAIR-901. It described a mint that had not happened
 * yet and a cost the flag car would meet. The flag car HAS run: `missionDispatcherEnabled`
 * is a live member of `ENGINE_GATED_VIRTUAL_RULE_KEYS` (35 members at this tip) with its
 * AUTHORED row in `certification/subsystemRowsOps.js`, and a header that still promises the
 * mint sends the next reader looking for work that is done.
 *
 * ⭐ AND THE SENTENCE IS NOT SIMPLY DELETED, BECAUSE ITS LITERAL CLAIM IS STILL TRUE AND
 * LOAD-BEARING: NO GATE READ LIVES IN THIS LEAF. The door was deliberately NOT put here.
 * Its one by-name strict read is `missionDispatcherActive`, and it lives in THE ESPIONAGE
 * FAMILY DOOR MODULE, AND-composed with that layer's own predicate, so a lit dispatcher over
 * a dark espionage layer stays dark. The reason the obvious home is the wrong one is
 * recorded beside that predicate: this leaf is INJECTED — every input arrives as an argument
 * and it never reads a world — so it has no receiver to gate on; and it is the espionage
 * set's ONE ADMITTED IMPORTER, whose reachability-chain arm in
 * tests/property/espionageDormancyFence.test.js asserts that this file names neither that
 * module nor the layer flag.
 *
 * ⛔⛔ WHICH IS WHY THE ADDRESS ABOVE IS WRITTEN IN WORDS AND NOT AS A PATH, AND THAT IS A
 * MEASURED CONSTRAINT RATHER THAN A STYLE. The fence's negative is a RAW-SOURCE
 * `not.toContain` — comments are not stripped — so spelling the door module's filename in
 * this very paragraph REDS it. Executed: naming the path here failed the reachability arm
 * on the run before this wording, and the run after it is green again. The estate already
 * had the idiom for exactly this — the operations voice leaf's own door prose says "its
 * one by-name strict gate lives in the espionage family door module" and names no file —
 * so this header follows it rather than inventing a second way to say the same thing.
 *
 * ⚠ SO WHAT THIS HEADER OWES A READER IS AN ADDRESS, NOT A PLAN: the door is
 * `missionDispatcherEnabled` (DESIGN_W_OPS §6); its read is at the family door named above;
 * its manifest entry and its certification row are landed; its dark proof is this module's
 * own suite, driving the key false against a lit world with the lit control and the
 * conjunction beside it, which is why no `tests/property/*DormancyFence.test.js` file exists
 * for the key (the disposition is written into
 * tests/lint/engineGatedRuleKeys.walker.test.js's no-fence roster). ⭐ THE WALL THIS HEADER
 * ONCE NAMED IS ALSO GONE: it read "BLOCKED —
 * `subsystemRowsVirtual.js` sits at 800/800 effective lines, so the authored row cannot be
 * added until that file is decomposed", and TE-VIRT-1's decomposition car did exactly that
 * at the ENGINE-HYGIENE landing, giving the W-OPS family its own reserved leaf to author
 * into. Both the wall and the mint are now history rather than cost.
 *
 * PURE: no Date, no Math.random, no store, no I/O, no mutation, no world read. Every input
 * arrives as an argument.
 *
 * @enforced-by tests/domain/missionDispatcher.test.js
 */
import { compareCodepoint } from '../../deterministicSort.js';
import { hash01 } from '../../region/contestMath.js';
import { DOCTRINE_TARGETINGS } from '../espionage/espionageDoctrine.js';
import { DELIBERATION_VERDICTS, deliberationRead } from '../espionage/espionageMath.js';
import { stablePart } from '../stablePart.js';
import { MISSION_KINDS, isDispatchableKind, missionKindRow } from './operationGrammar.js';

/**
 * ── ES-5's DOCTRINE TARGETING, APPLIED — AND THE HALF THAT DOES NOT EXIST, NAMED ───────
 *
 * `espionageDoctrine.js` exposes WHO A COURT CONSIDERS A LEGITIMATE TARGET as a closed
 * three-word vocabulary, and a read doctrine carries one of those words. What the estate
 * has NEVER built is the other half: nothing anywhere resolves a targeting word against a
 * particular subject. Measured at this tip, the ONE consumer of `targeting` is
 * `captorLeniencyRead`, which reads the word to grade a captor's temper and never asks
 * whether some court is a foe.
 *
 * So the eligibility table below is DERIVED FROM THE PRODUCER'S OWN WORDS rather than
 * minted beside them — `foes_only` admits a foe, `rivals_and_foes` admits a rival or a
 * foe, `all_courts` admits anyone — and the standing itself arrives as an ARGUMENT. ⛔ The
 * PRODUCER of that standing is the named seam: car O2 supplies it from the existing
 * relationship/alliance reads, and until it does, a demand carrying no standing is
 * admitted ONLY under `all_courts`. FAIL-CLOSED TOWARD THE DOCTRINE is the safe direction:
 * a court that cannot establish a subject is a foe does not send a spy to find out.
 */
const TARGETING_ADMITS = Object.freeze({
  all_courts: Object.freeze(['foe', 'rival', 'neutral', '']),
  rivals_and_foes: Object.freeze(['foe', 'rival']),
  foes_only: Object.freeze(['foe']),
});

/**
 * THE CAP DEFAULT — a MIRROR of `MAX_CONCURRENT_ENVOYS` (2), parity-pinned test-side. See
 * the header: mirrored rather than imported to keep this leaf's cross-layer reach at one
 * declared INFO read.
 */
export const DISPATCH_CAP_PER_PRINCIPAL_PER_TICK = 2;

/**
 * THE CLOSED REFUSAL VOCABULARY. Every demand that does not become a candidate says why,
 * in one of these words, and every word is separately reachable — a dispatcher that
 * refused everything for one reason would look identical to a dispatcher that worked.
 *
 * ⚠ `act_now` and `wait_expired` are DELIBERATELY the verdict words themselves rather than
 * a re-spelling: they are §3.12's own vocabulary, and the totality pin derives this set
 * from `DELIBERATION_VERDICTS` so a fourth verdict upstream reds here instead of falling
 * silently into a default arm.
 */
export const DISPATCH_REFUSALS = Object.freeze([
  'malformed_demand',
  'kind_unqualified',
  'doctrine_excludes',
  'already_open',
  'act_now',
  'wait_expired',
  'over_cap',
]);

/**
 * The standings a doctrine word can admit, DERIVED from `DOCTRINE_TARGETINGS` so the two
 * sets cannot disagree. Exported so the totality pin walks the module's own idea of the
 * domain rather than the test author's.
 *
 * @param {unknown} targeting
 * @returns {readonly string[] | null} null when the word is not a doctrine targeting
 */
export function admittedStandings(targeting) {
  const word = text(targeting);
  if (!DOCTRINE_TARGETINGS.includes(word)) return null;
  return /** @type {Record<string, readonly string[]>} */ (TARGETING_ADMITS)[word];
}

/**
 * THE CANDIDATE TYPE, and it is a NEW discriminator on purpose.
 *
 * ⛔ NOT `'npc'`. `applyWorldPulse.js` dispatches appliers on `outcome.type`, and a
 * mission candidate wearing the npc word would have `applyNpcPatch` run against it. This
 * word matches NO applier arm in the tree, so a candidate from this module is inert even
 * if something wires it by accident — dark by construction rather than by care. The
 * applier arm for operations is car O2's to open, gated, and this constant is where it
 * will look.
 */
export const OPERATION_CANDIDATE_TYPE = 'operation';

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Clamp to the unit interval, fail-closed to 0 on garbage. The estate spells 0..1 values
 * this way everywhere; a NaN reaching a candidate's `probability` would sort unpredictably.
 *
 * @param {unknown} value @returns {number}
 */
function unit(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * Read one string field off an unknown row without an any-cast. The zero-ceiling law binds
 * new files at `base[file] ?? 0` in all three type ratchets, so the narrowing is done once
 * here rather than cast away at each site.
 *
 * @param {unknown} row @param {string} key @returns {string}
 */
function fieldText(row, key) {
  if (!row || typeof row !== 'object') return '';
  return text(/** @type {Record<string, unknown>} */ (row)[key]);
}

/**
 * THE DISPATCH STREAM'S IDENTITY — one keyed stream, spelled once (zero new PRNG streams).
 *
 * Keyed on `(principalId, tick)` exactly as the charter asks, and namespaced `ops.` so it
 * cannot collide with the espionage lane's `es.dispatch.` / `es.rider.` streams. The
 * per-demand suffix is applied at the draw site, so two demands in one principal-tick get
 * different rolls while the tick itself stays the seed.
 *
 * @param {unknown} principalId
 * @param {unknown} tick
 * @returns {string}
 */
export function dispatchKey(principalId, tick) {
  return `ops.dispatch.${stablePart(principalId)}.${Number(tick) || 0}`;
}

/**
 * Is this demand already covered by an operation that is open about the same subject for
 * the same principal? THE ONE-MINT RULE, total over the injected set.
 *
 * Matching is on `(principalId, subjectId)` and NOT on kind: a court that already has a
 * watcher out about a neighbour does not need a second one because it wants a different
 * product. That is the anti-flood reading, and it is the stricter one.
 *
 * @param {{principalId: string, subjectId: string}} demand
 * @param {readonly unknown[]} openOperations
 * @returns {boolean}
 */
function coveredByOpenOperation(demand, openOperations) {
  return openOperations.some((row) => {
    if (!row || typeof row !== 'object') return false;
    const open = /** @type {Record<string, unknown>} */ (row);
    return text(open.principalId) === demand.principalId
      && text(open.subjectId) === demand.subjectId;
  });
}

/**
 * Normalize one demand row, or refuse it. A demand is the §3.12 shape: an unconfirmed
 * belief standing before a decision.
 *
 * @param {unknown} row
 * @param {string} principalId
 * @returns {{demandId: string, kind: string, subjectId: string, principalId: string,
 *   subjectStanding: string, decidingConfidence01: unknown, urgent: boolean,
 *   dispatched: boolean, ticksSinceDispatch: unknown} | null}
 */
function normalizeDemand(row, principalId) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
  const src = /** @type {Record<string, unknown>} */ (row);
  const demandId = text(src.demandId);
  const kind = text(src.kind);
  const subjectId = text(src.subjectId);
  if (!demandId || !kind || !subjectId) return null;
  return {
    demandId,
    kind,
    subjectId,
    principalId,
    subjectStanding: text(src.subjectStanding),
    decidingConfidence01: src.decidingConfidence01,
    urgent: src.urgent === true,
    dispatched: src.dispatched === true,
    ticksSinceDispatch: src.ticksSinceDispatch,
  };
}

/**
 * §3.12's DELIBERATION ROAD, run over one principal's unmet demands for one tick.
 *
 * Six doors, in this order, each separately reachable and separately named:
 *   1. the demand is a demand at all             → `malformed_demand`
 *   2. the task qualification law admits the kind → `kind_unqualified`
 *   3. ES-5's doctrine targeting                  → `doctrine_excludes`
 *   4. the ONE-MINT law                           → `already_open`
 *   5. §3.12's own verdict                        → `act_now` | `wait_expired`
 *   6. the per-principal per-tick cap             → `over_cap`
 *
 * ⚠ DOOR 5 IS AN IMPORT, NOT A RULE OF THIS FILE. Only `dispatch_and_wait` proceeds:
 * `act_now` means the decision is taken now (urgency forces it, or the deciding belief is
 * already good enough) and `wait_expired` means patience ran out and the court decides on a
 * picture staler than when it began waiting. Both are refusals to dispatch, and both keep
 * the charter's drama rather than flattening it into "no".
 *
 * @param {{principalId?: unknown, tick?: unknown, demands?: unknown,
 *   openOperations?: unknown, targeting?: unknown, frequency01?: unknown,
 *   castable?: unknown, cap?: unknown}} [args]
 * @returns {{candidates: Array<Record<string, unknown>>,
 *   refusals: Array<{demandId: string, reason: string}>, cap: number, considered: number}}
 */
export function dispatchMissionCandidates({
  principalId, tick, demands, openOperations, targeting, frequency01, castable, cap,
} = {}) {
  const principal = text(principalId);
  const capValue = Number.isInteger(cap) && Number(cap) >= 0
    ? Number(cap)
    : DISPATCH_CAP_PER_PRINCIPAL_PER_TICK;
  const empty = { candidates: [], refusals: [], cap: capValue, considered: 0 };
  if (!principal || !Array.isArray(demands)) return empty;
  const open = Array.isArray(openOperations) ? openOperations : [];
  const admitted = admittedStandings(targeting) || [];

  /** @type {Array<{demandId: string, reason: string}>} */
  const refusals = [];
  /** @type {Array<ReturnType<typeof normalizeDemand>>} */
  const survivors = [];

  for (const row of demands) {
    const demand = normalizeDemand(row, principal);
    if (demand === null) {
      refusals.push({ demandId: fieldText(row, 'demandId'), reason: 'malformed_demand' });
      continue;
    }
    if (!isDispatchableKind(demand.kind)) {
      refusals.push({ demandId: demand.demandId, reason: 'kind_unqualified' });
      continue;
    }
    // DOOR 3 — ES-5's DOCTRINE TARGETING. An unreadable or absent targeting word admits
    // nothing: a court whose doctrine did not resolve has not decided anyone is a target,
    // and inventing `all_courts` for it would be the loosest possible default in the one
    // place that decides whom a realm spies on.
    if (!admitted.includes(demand.subjectStanding)) {
      refusals.push({ demandId: demand.demandId, reason: 'doctrine_excludes' });
      continue;
    }
    if (coveredByOpenOperation(demand, open)) {
      refusals.push({ demandId: demand.demandId, reason: 'already_open' });
      continue;
    }
    const verdict = deliberationRead({
      decidingConfidence01: demand.decidingConfidence01,
      frequency01,
      urgent: demand.urgent,
      castable,
      dispatched: demand.dispatched,
      ticksSinceDispatch: demand.ticksSinceDispatch,
    });
    if (verdict !== 'dispatch_and_wait') {
      refusals.push({ demandId: demand.demandId, reason: verdict });
      continue;
    }
    survivors.push(demand);
  }

  // CANONICAL ORDER FIRST — codepoint on a rename-stable id — THEN the seeded rank. The
  // two steps are separate on purpose: the sort makes the input order irrelevant, and the
  // hash makes the CUT unbiased by alphabet, so a principal whose subjects all begin with
  // 'a' is not permanently favoured over one whose subjects begin with 'z'.
  const key = dispatchKey(principal, tick);
  const ranked = survivors
    .slice()
    .sort((a, b) => compareCodepoint(a?.demandId, b?.demandId))
    .map((demand) => ({ demand, roll: hash01(`${key}.${demand?.demandId}`) }))
    .sort((a, b) => (a.roll - b.roll) || compareCodepoint(a.demand?.demandId, b.demand?.demandId));

  /** @type {Array<Record<string, unknown>>} */
  const candidates = [];
  for (let i = 0; i < ranked.length; i += 1) {
    const demand = /** @type {NonNullable<ReturnType<typeof normalizeDemand>>} */ (ranked[i].demand);
    if (i >= capValue) {
      refusals.push({ demandId: demand.demandId, reason: 'over_cap' });
      continue;
    }
    candidates.push(operationCandidate(demand, tick, ranked[i].roll, frequency01));
  }
  return { candidates, refusals, cap: capValue, considered: demands.length };
}

/**
 * Compose one candidate in the EXISTING candidate grammar's shape.
 *
 * The field set mirrors `npcAgency.js`'s candidate literal — id / type / candidateType /
 * ruleId / ruleFamily / targetSaveId / severity / probability / applyMode / headline /
 * summary / reasons / metadata / conflictTags — and the mirror is PARITY-PINNED test-side
 * against a real npcAgency candidate, so a grammar change upstream reds here rather than
 * producing a candidate the collector silently drops.
 *
 * ⚠ `applyMode: 'proposal'`, ALWAYS, and this is the ES-7 refusal honoured in the data. A
 * dispatcher that auto-applied would be the autonomous dispatcher by another name; routing
 * the mint as a proposal a seat answers is J-ES-12's own shape ("the DM plays the world,
 * the court keeps its character"), one rung earlier.
 *
 * ⛔ `severity` AND `probability` ARE NOT THE RANK ROLL, and the distinction is the whole
 * reason this function takes three numbers. The roll is a TIEBREAK over an already-canonical
 * order and means nothing outside this module; putting it in the two fields a collector
 * ranks on would hand every future consumer an arbitrary hash dressed as an importance.
 * Both are DERIVED from what §3.12 actually measures: severity is the CONFIDENCE GAP (an
 * unreadable deciding belief is maximally unconfirmed, which is also how `deliberationRead`
 * treats it, so the two agree by construction), and probability is the court's own doctrine
 * cadence — how ready this principal is to act at all. The roll rides `metadata.rank01`,
 * where it is auditable and cannot be mistaken for a judgement.
 *
 * @param {NonNullable<ReturnType<typeof normalizeDemand>>} demand
 * @param {unknown} tick
 * @param {number} roll
 * @param {unknown} frequency01
 * @returns {Record<string, unknown>}
 */
function operationCandidate(demand, tick, roll, frequency01) {
  const row = missionKindRow(demand.kind);
  const tickNumber = Number(tick) || 0;
  const confidence = Number(demand.decidingConfidence01);
  const severity = Number.isFinite(confidence) ? unit(1 - confidence) : 1;
  return {
    id: `candidate.operation.${stablePart(demand.kind)}.${stablePart(demand.demandId)}.${tickNumber}`,
    type: OPERATION_CANDIDATE_TYPE,
    candidateType: `operation_${demand.kind}`,
    ruleId: `operation_mission_${demand.kind}`,
    ruleFamily: 'operation',
    targetSaveId: demand.subjectId,
    severity,
    probability: unit(Number(frequency01)),
    applyMode: 'proposal',
    headline: `${demand.principalId} may send about ${demand.subjectId}`,
    summary: 'An unconfirmed belief stands before a decision, and the deliberation read allows the wait.',
    reasons: [
      `Deliberation verdict dispatch_and_wait for demand ${demand.demandId}.`,
      `Receipt family ${row ? row.receiptFamily : 'unknown'} is verified against the live tree.`,
    ],
    metadata: {
      operationClass: 'MISSION',
      kind: demand.kind,
      principalId: demand.principalId,
      subjectId: demand.subjectId,
      demandId: demand.demandId,
      receiptFamily: row ? row.receiptFamily : null,
      rank01: roll,
    },
    conflictTags: [
      `operation:${demand.principalId}`,
      `operation:subject:${demand.subjectId}`,
    ],
  };
}

/**
 * The refusal words this module may emit, DERIVED from §3.12's verdict set rather than
 * transcribed beside it. Exported so the totality pin walks the module's own idea of the
 * domain — the mountain_pass lesson, institutionalised.
 *
 * @returns {readonly string[]}
 */
export function dispatchRefusalTotality() {
  const fromVerdicts = DELIBERATION_VERDICTS.filter((verdict) => verdict !== 'dispatch_and_wait');
  return Object.freeze([
    'malformed_demand',
    'kind_unqualified',
    'doctrine_excludes',
    'already_open',
    ...fromVerdicts,
    'over_cap',
  ]);
}

// ── EM-E7: "SEND ON A MISSION" IS A DIRECTION, NOT A SECOND DISPATCHER ────────────────────
//
// design §17 puts the seal on the PERSON'S CARD and §19 ruling 8 measures what it is: a
// DIRECTION over `MISSION_KINDS`, resolved at the tick by the estate's own procedure. The
// three verbs below are the whole of that, and together they add no rule: they read a decree,
// shape it into THE DEMAND ROW this module already takes, and call `dispatchMissionCandidates`
// unchanged. Every door that refuses — the qualification law, ES-5's doctrine, the one-mint
// law, §3.12's verdict, the cap — refuses a directed demand exactly as it refuses an
// endogenous one, in the same word, and nothing here may soften any of them.
//
// ⛔ WHY A DIRECTION AND NOT A PIN, IN ONE LINE, BECAUSE THE DISTINCTION IS THE CHARTER'S:
// HBF-35 is STAY-DETERMINISTIC PERMANENTLY — the roll in `dispatchMissionCandidates` is an
// unweighted tiebreak over an already-canonical order, and the only thing a load could tilt
// is WHICH SUBJECT a court watches, which is the autonomous dispatcher ES-7 was refused for.
// A DM does not tilt the cut; a DM NAMES THE MISSION, and the world casts and resolves it.

/**
 * The one directive op type this member binds, spelled once and beside the procedure that
 * resolves it. The op catalogue's row is the edit layer's to author; this is the word the
 * tick reads (`PIN_FORK_TYPE`'s idiom, one fork over).
 */
export const SEND_ON_MISSION_TYPE = 'send-on-mission';

/**
 * ONE DECREE'S DIRECTION, or nothing. Total on garbage: an entry whose op is not a
 * `send-on-mission`, or whose payload carries no kind this catalog knows and no subject,
 * reads as no direction at all.
 *
 * ⭐ THE KIND IS JUDGED AGAINST `MISSION_KINDS` — ALL SEVEN — AND NOT AGAINST
 * `DISPATCHABLE_MISSION_KINDS`, and the difference is the whole honesty of the seal. A DM may
 * STAGE any kind the catalog carries; what the three UNVERIFIED kinds then meet at the tick is
 * the task qualification law's own refusal, `kind_unqualified`, from the door that already
 * owns that judgment. Refusing them at the reader instead would hide a measured gap behind a
 * seal that simply never appeared, and the catalog's own header exists to stop exactly that.
 *
 * @param {unknown} entry a registry entry, or a bare op-bearing bag
 * @returns {{kind: string, subjectId: string}|null}
 */
export function sendOnMissionOf(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null;
  const row = /** @type {Record<string, unknown>} */ (entry);
  const op = row.op && typeof row.op === 'object' && !Array.isArray(row.op)
    ? /** @type {Record<string, unknown>} */ (row.op)
    : row;
  if (text(op.type) !== SEND_ON_MISSION_TYPE) return null;
  const payload = op.payload && typeof op.payload === 'object' && !Array.isArray(op.payload)
    ? /** @type {Record<string, unknown>} */ (op.payload)
    : {};
  const kind = text(payload.kind);
  const subjectId = text(payload.subjectId);
  // The catalog's own set, widened to `string` for the membership test alone: `MISSION_KINDS`
  // is a tuple of literal kinds, and a narrow tuple refuses `includes(aString)` outright. The
  // widening is the registry leaf's own idiom and it narrows nothing that matters — the
  // ANSWER is what this reader uses, and the answer is the catalog's.
  const catalogKinds = /** @type {readonly string[]} */ (MISSION_KINDS);
  if (!catalogKinds.includes(kind) || !subjectId) return null;
  return { kind, subjectId };
}

/**
 * THE DIRECTED DEMANDS for one principal, in this module's own demand shape.
 *
 * ⛔ `decidingConfidence01` IS DELIBERATELY ABSENT, AND THAT IS A READING RATHER THAN A HOLE.
 * §3.12 waits on a decision the court is UNSURE of, and a court that has just been told to
 * send somebody holds no confidence reading at all about the thing it was told to confirm —
 * which `deliberationRead` reads as stale, which is the honest answer. Writing a number here
 * would be inventing the court's own picture on the DM's behalf.
 *
 * ⛔ `urgent` IS FALSE AND A DM CANNOT SET IT. Urgency is §3.12's closed three-member list of
 * banded world reads (a siege at the gate, an overflow, war strain) and it FORCES `act_now`,
 * which is a refusal to dispatch. A directive that could set it would be a seal whose only
 * effect is to cancel itself.
 *
 * THE DEMAND ID is derived from `(kind, subjectId)` through `stablePart`, never from a display
 * name and never minted, so the same direction yields the same id on every replay and the
 * STAY-deterministic cut above stays reproducible.
 *
 * @param {unknown} directions the due `send-on-mission` entries, in the registry's own order
 * @param {unknown} [standingFor] the injected `(subjectId) => standing` read (ES-5's doctrine
 *   half; absent ⇒ every subject carries no standing, which `all_courts` alone admits)
 * @returns {Array<Record<string, unknown>>}
 */
export function directedMissionDemands(directions, standingFor) {
  const rows = Array.isArray(directions) ? directions : [];
  const standing = typeof standingFor === 'function'
    ? /** @type {(id: string) => unknown} */ (standingFor)
    : null;
  /** @type {Array<Record<string, unknown>>} */
  const demands = [];
  for (const row of rows) {
    const direction = sendOnMissionOf(row);
    if (direction === null) continue;
    demands.push({
      demandId: `demand.direction.${stablePart(direction.kind)}.${stablePart(direction.subjectId)}`,
      kind: direction.kind,
      subjectId: direction.subjectId,
      subjectStanding: standing ? text(standing(direction.subjectId)) : '',
      urgent: false,
      dispatched: false,
      ticksSinceDispatch: 0,
    });
  }
  return demands;
}

/**
 * THE DIRECTION, RESOLVED AT THE TICK BY THE ESTATE'S OWN PROCEDURE (design §17, §19 ruling 8).
 *
 * One composition and no second rule: the due directives become demands, and
 * `dispatchMissionCandidates` runs over them with every door it already owns. The result is
 * the module's own `{candidates, refusals, cap, considered}` record, unrenamed, so a caller
 * reading `kind_unqualified` off a directed mission is reading the same word the qualification
 * law writes for an endogenous one.
 *
 * ⚠ THE CANDIDATES STAY `applyMode: 'proposal'`, because `operationCandidate` writes that word
 * unconditionally and this verb does not touch it. That is ES-7's refusal honoured one rung
 * up: a direction proposes a mission a seat answers; it does not apply one.
 *
 * @param {{principalId?: unknown, tick?: unknown, directions?: unknown, standingFor?: unknown,
 *   openOperations?: unknown, targeting?: unknown, frequency01?: unknown,
 *   castable?: unknown, cap?: unknown}} [args]
 * @returns {ReturnType<typeof dispatchMissionCandidates>}
 */
export function dispatchDirectedMissions({
  principalId, tick, directions, standingFor, openOperations, targeting, frequency01, castable,
  cap,
} = {}) {
  return dispatchMissionCandidates({
    principalId,
    tick,
    demands: directedMissionDemands(directions, standingFor),
    openOperations,
    targeting,
    frequency01,
    castable,
    cap,
  });
}
