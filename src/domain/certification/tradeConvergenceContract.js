/**
 * TR-9's trade convergence contract — the address wall, the closed vocabulary,
 * and THE LIGHTING-ORDER LAW, landed contract-first.
 *
 * This is the TRADE sibling of warConvergenceContract.js, built to that module's
 * template (DESIGN_FP_ARCH_TR.md §4 TR-9: "contract-first — the
 * warConvergenceContract.js template ... may land any time after TR-1"). It owns
 * the spellings the TR collector waves will fill and the eight-flag lighting
 * table every TR wave lights against. NOTHING IMPORTS IT AT LAND TIME, and it
 * imports nothing: it is a pure vocabulary-and-shape leaf, so it can be the
 * pre-pin the rest of the program is built against without moving a byte.
 *
 * ⛔ NO COLLECTOR, NO ENVELOPE, NO TUNING TABLE — DELIBERATELY, AND THIS IS THE
 * SCOPE LINE. The war template carries `WAR_CONVERGENCE_TUNING` beside its
 * address wall because its collector existed. TR-9's envelopes (house Gini,
 * corner frequency, pact mix, endings share) are graded against windows that
 * DESIGN_FP_TRADE.md's Clock line requires to be INTERVAL_WEEKS-derived and
 * measured against a corpus, and every one of them reads a subsystem no TR wave
 * has built yet. Authoring their numbers here would mint acceptance bands
 * against an instrument that has never been run — the exact greenwash the war
 * program's UNMEASURED_DURATIONS_MAX comment argues against — so they land with
 * the collectors that can execute them, and this module stays the part that is
 * true today.
 *
 * ⛔ NO PERSISTED WORLD STATE, NO CLOCK, NO RANDOMNESS. Every export below is a
 * frozen constant or a pure total function of its arguments. The observation
 * this module describes lives exclusively inside a soak receipt JSON.
 *
 * SPINE REQ 13 (ALIGNMENT) — DECLARED EMPTY WITH REASON: a vocabulary and shape
 * module reads no world state and colours no verb, so there is no alignment
 * surface to engage. SPINE REQ 14 (THE EDIT VERB) — ENGINE-ONLY, RECORDED: a
 * DM-editable convergence vocabulary would let one campaign rename the words its
 * own certification receipt is graded in, which is the one thing a contract may
 * never be; the DM's hand reaches the endings this contract counts through the
 * TR waves' own edit verbs, never through the counting.
 */

/** @typedef {Record<string, unknown>} UnknownRecord */

/**
 * The additive `tradeConvergence` observation carried by a soak receipt.
 *
 * v1 is the contract-first shape: the endings mix, the per-ending AVAILABILITY
 * declaration that tells a sequencing zero from a decoration zero, and the eight
 * flag certification rows. Bumps are EXACT rather than tolerant, on the war
 * module's principle: a receipt written against an earlier address wall has no
 * address for a field a later envelope grades, so silently accepting it would let
 * an envelope grade a corpus it could not actually read.
 *
 * NOTHING IS ORPHANED, MEASURED RATHER THAN ASSERTED. Measured on 2026-08-05:
 * `tradeConvergence` and `TRADE_ENDING_KEYS` appear NOWHERE in src/, tests/ or
 * scripts/ before this file — so no observation of any version exists anywhere to
 * orphan, and v1 starts clean.
 */
export const TRADE_CONVERGENCE_OBSERVATION_VERSION = 1;

/**
 * THE CLOSED TRADE-ENDING VOCABULARY (owner-settled; DESIGN_FP_TRADE.md §TR-9).
 * Six words, in the volume's own declared order. Each is a CONCLUSION a house,
 * a market or a partnership can reach — never a mechanism, and never a tuning
 * knob. The volume binds each definition to the wave that mints it, which is what
 * `TRADE_ENDING_MINT_ROWS` below writes down:
 *
 *   fortune / ruin  — house-grain conclusions (first mint TR-2; the venture is
 *                     their principal mint at TR-7).
 *   monopoly        — one supplier holding a market past a dwell band; the
 *                     corner's durable cousin, MINTED AT TR-6. (The fp-audit
 *                     correction: before it, no wave minted it, so its envelope
 *                     was structurally zero forever and the share check could not
 *                     tell sequencing from decoration. This module's availability
 *                     declaration is the machinery that keeps that distinction
 *                     legible for every one of the six, not just this one.)
 *   collapse        — a market or entrepot estate dying; an HONEST PERMANENT ZERO
 *                     while `routeLifecycleEnabled` is dark.
 *   severance       — the formal cut, minted WITH its casus named (first mint
 *                     TR-1; the pact's formal death is a second producer at TR-5).
 *   cornered        — TR-6's seasonal hold (the rarest).
 *
 * @type {ReadonlyArray<string>}
 */
export const TRADE_ENDING_KEYS = Object.freeze([
  'fortune',
  'ruin',
  'monopoly',
  'collapse',
  'severance',
  'cornered',
]);

/**
 * THE AVAILABILITY VOCABULARY — the address that tells a sequencing zero from a
 * decoration zero.
 *
 * An endings mix alone cannot say why a key read zero: the wave that mints it may
 * be dark, or it may be lit and the world simply never reached that conclusion.
 * The first is evidence about build order and must never fail an envelope; the
 * second is exactly what an envelope exists to catch. So every receipt carries a
 * state per ending beside the count.
 *
 * TWO STATES, BOTH REACHABLE BY CONSTRUCTION (the dead-band law, L1): these are
 * the only two values `tradeEndingAvailability` can return, and the walker proves
 * both arms. A third "UNBUILT" state was considered and REFUSED — this module is
 * pure and cannot see the tree, so it could never write that word, and a
 * vocabulary member no writer can produce is the never-written-fallback shape
 * this estate has already been bitten by.
 * @type {ReadonlyArray<string>}
 */
export const TRADE_ENDING_AVAILABILITY_STATES = Object.freeze([
  'MINTABLE',
  'UNMINTABLE_BY_CONFIG',
]);

/**
 * The eight TRADE program flags, IN BUILD ORDER (the compiled architecture §3
 * rows 15-22). TR-9 is flagless — it is the measurement wave — so it invents no
 * row of its own, exactly as WR-9 does not.
 *
 * Every one of these is VIRTUAL per L2: absent from DEFAULT_SIMULATION_RULES and
 * every preset spread, read with strict `=== true`, dark-never-permissive. That
 * half of L2 is asserted by this module's walker and stays true forever.
 *
 * NO BUILD-STATE DATA LIVES HERE, DELIBERATELY. At this landing none of the eight
 * exists in the tree (measured 2026-08-05: zero src files mention any of them),
 * and it would be easy to freeze that as a table. It is not, for two reasons. The
 * CQ5 manifest law — a flag joins ENGINE_GATED_VIRTUAL_RULE_KEYS with its
 * certification row in the SAME commit as its first gate read — is already
 * enforced for EVERY gated key, these eight included, by
 * tests/lint/engineGatedRuleKeys.walker.test.js, which scans the tree and audits
 * the manifest both ways; a hand-keyed copy here would be a second, weaker
 * spelling of that authority. And a frozen build-state table in a SHARED tree
 * reds the neighbouring lane that lands TR-1 CORRECTLY, which trains maintainers
 * to edit the pin instead of reading it.
 * @type {ReadonlyArray<string>}
 */
export const TRADE_RULINGS_FLAG_KEYS = Object.freeze([
  'casusCommerciiEnabled',
  'merchantHousesEnabled',
  'believedMarketsEnabled',
  'foodCaravansEnabled',
  'tradePactsEnabled',
  'corneringEnabled',
  'venturesEnabled',
  'factorErrandsEnabled',
]);

/** The certification vocabulary embedded in a TR receipt row. */
export const TRADE_FLAG_RULE_STATES = Object.freeze(['on', 'off', 'unknown']);
export const TRADE_FLAG_CERTIFICATION_VERDICTS = Object.freeze([
  'ALIVE',
  'DORMANT_BY_CONFIG',
  'SILENT',
  'UNOBSERVED',
]);

/**
 * THE FOREIGN PRECONDITION FLAGS — every non-TRADE key the lighting table reads,
 * with the program that owns it and, where one exists, the TRADE volume's own
 * SP-N alias for it.
 *
 * THE ALIAS COLUMN IS THE POINT. DESIGN_FP_ARCH_TR.md states TR's cross-program
 * preconditions in the TRADE volume's SPINE numbering ("SP-2 landed", "SP-3
 * landed", "SP-1 landed"), while the compiled architecture states them as wave
 * ids and flag keys. Those are two naming systems for the same three
 * capabilities, and re-deriving the join at each wave is how a wave ends up
 * gating on a flag spelling that does not exist. The join is resolved ONCE here,
 * from the charter's own words rather than by inference:
 *
 *   SP-1 = the errand spine  -> charter #30: "TR-8 ... needs SP-D + TR-5 + TR-7"
 *                               -> SP-D, `errandSpineEnabled`.
 *   SP-2 = believed scarcity -> charter #25: "TR-3 ... needs SP-B"
 *                               -> SP-B, `believedScarcityEnabled`.
 *   SP-3 = the pact grammar  -> DESIGN_FP_SPINE.md: "SP-3 THE PACT GRAMMAR" and
 *                               "FP-GRAMMAR: SP-3 IS this program's core";
 *                               charter #27: "TR-5 ... needs GR-2/GR-3"
 *                               -> GR-2/GR-3, `pactFormationEnabled`.
 *
 * THE FOUR ENGINE ROWS ARE PINNED AT AN ADDRESS, NOT BY A NAME. Each carries
 * `gateEvidenceFile`, the module that spells the strict gate today, and the walker
 * asserts that file both EXISTS and contains `<flag> === true`. A bare-name census
 * would pass on a comment; this passes only on a real gate. If the owning module
 * relocates, the pin REDS and demands the row be re-measured, which is the right
 * direction for the recorded filename-anchored-vacuity class — the pin never goes
 * quietly green on a moved file.
 *
 * AN FP_PROGRAM ROW CARRIES EVIDENCE THE MOMENT ITS OWNING WAVE LANDS THE FLAG,
 * AND NOT BEFORE. This table shipped with all three FP_PROGRAM rows pinned to
 * `null` and a walker that REQUIRED null of them, on the premise that "the three
 * FP_PROGRAM rows do not exist in the tree yet". SP-B falsified that premise on
 * 2026-08-05 by landing `believedScarcityEnabled`'s first real gate
 * (`beliefAxes.subjectAxesActive`), and nothing reddened: the row went on
 * recording a LANDED flag as unbuilt, in the very module TR-9c built to stop a
 * wave gating on a spelling nobody minted. J-WR-13 — live code outranks the
 * table — so the row is now measured rather than assumed.
 *
 * WHICH STATE A ROW MUST BE IN IS DECIDED BY THE CQ5 MANIFEST, NOT BY A COMMENT.
 * `ENGINE_GATED_VIRTUAL_RULE_KEYS` (simulationRules.js) is the estate's own
 * register of virtual keys that have a real gate, and the CQ5 one-commit law puts
 * a key there in the SAME commit as its first gate read. The walker therefore
 * asserts a two-way equivalence: an FP_PROGRAM row names a `gateEvidenceFile` IF
 * AND ONLY IF its flag is in that manifest — and where it does, the file must
 * exist and spell the strict gate, exactly as the ENGINE rows are checked. A
 * neighbouring wave that lands its flag now REDS this table until the row is
 * brought true, which is the direction the recorded table-drift class wants, and
 * it is a table-to-table join rather than the src/ scan this walker deliberately
 * refuses to own (see its header).
 */
export const TRADE_FOREIGN_PRECONDITION_FLAGS = Object.freeze([
  Object.freeze({
    flag: 'commodityFlowEnabled',
    origin: 'ENGINE',
    owner: 'the M6a commodity pipeline',
    spineAlias: null,
    gateEvidenceFile: 'src/domain/spatial/commodityFlow.js',
  }),
  Object.freeze({
    flag: 'demographicsEnabled',
    origin: 'ENGINE',
    owner: 'wave P, the demographic engine',
    spineAlias: null,
    gateEvidenceFile: 'src/domain/worldPulse/demographicsRates.js',
  }),
  Object.freeze({
    flag: 'routeLifecycleEnabled',
    origin: 'ENGINE',
    owner: 'wave J, the organic route lifecycle',
    spineAlias: null,
    gateEvidenceFile: 'src/domain/worldPulse/routeNetworkLedger.js',
  }),
  Object.freeze({
    flag: 'commonsVoiceEnabled',
    origin: 'ENGINE',
    owner: "the commons' voice kernel",
    spineAlias: null,
    gateEvidenceFile: 'src/domain/worldPulse/commonsVoiceKernel.js',
  }),
  Object.freeze({
    flag: 'believedScarcityEnabled',
    origin: 'FP_PROGRAM',
    owner: 'SP-B',
    spineAlias: 'SP-2',
    // LANDED at SP-B (2026-08-05). The one door where the three believed-world family
    // flags are read by name: `beliefAxes.subjectAxesActive`.
    gateEvidenceFile: 'src/domain/worldPulse/beliefAxes.js',
  }),
  Object.freeze({
    flag: 'pactFormationEnabled',
    origin: 'FP_PROGRAM',
    owner: 'GR-2/GR-3',
    spineAlias: 'SP-3',
    gateEvidenceFile: null,
  }),
  Object.freeze({
    flag: 'errandSpineEnabled',
    origin: 'FP_PROGRAM',
    owner: 'SP-D',
    spineAlias: 'SP-1',
    // LANDED at SP-D (2026-08-06). The ONE door where this key is read positively:
    // `errandMint.errandSpineActive`. A second file NAMES the key —
    // espionage/espionageGate.js spells `!== true` as ES-0's lighting-order precondition —
    // and this row deliberately points at the POSITIVE gate, because the walker below
    // searches for `<flag> === true` and a row pointing at the negative spelling would
    // read as evidence while proving the opposite.
    gateEvidenceFile: 'src/domain/worldPulse/errandMint.js',
  }),
]);

/**
 * THE LIGHTING TABLE — the TR flag-dependency ruling, made executable.
 *
 * DESIGN_FP_TRADE.md §3 and DESIGN_FP_ARCH_TR.md §2 both state it as prose and
 * both say what it is FOR: "a flag lit out of order is an invalid config the TR-9
 * certification walker reds", because "an omitted dependency certifies a config
 * whose principal mechanisms cannot run". The rows below are that table, one per
 * flag, ordered.
 *
 * `order` IS THE LIGHTING ORDER AND THE BUILD ORDER — the compiled architecture's
 * lighting contract makes them the same thing. Every `requiresTradeFlags` member
 * is asserted to sit EARLIER in this order, so the dependency graph cannot
 * contain a cycle and the table cannot quietly become unsatisfiable.
 *
 * WHAT IS NOT HERE, DELIBERATELY. Two of the volume's clauses read like
 * preconditions and are NOT: TR-5's "+ TR-4 for grain_provision's physical arm"
 * and TR-7's "new_route additionally requires routeLifecycleEnabled" describe an
 * ARM of a lit flag degrading, not a flag refusing to light. They live in
 * `TRADE_DEGRADED_ARMS` below, because encoding a degradation as a hard
 * precondition would forbid a config both volumes explicitly permit.
 */
export const TRADE_FLAG_LIGHTING_ROWS = Object.freeze([
  Object.freeze({
    flag: 'casusCommerciiEnabled',
    wave: 'TR-1',
    order: 1,
    requiresTradeFlags: Object.freeze([]),
    requiresForeignFlags: Object.freeze([]),
    requiresLandedWork: Object.freeze([]),
  }),
  Object.freeze({
    flag: 'merchantHousesEnabled',
    wave: 'TR-2',
    order: 2,
    requiresTradeFlags: Object.freeze(['casusCommerciiEnabled']),
    requiresForeignFlags: Object.freeze([]),
    requiresLandedWork: Object.freeze([]),
  }),
  Object.freeze({
    flag: 'believedMarketsEnabled',
    wave: 'TR-3',
    order: 3,
    requiresTradeFlags: Object.freeze(['casusCommerciiEnabled']),
    requiresForeignFlags: Object.freeze(['believedScarcityEnabled']),
    requiresLandedWork: Object.freeze([]),
  }),
  Object.freeze({
    flag: 'foodCaravansEnabled',
    wave: 'TR-4',
    order: 4,
    requiresTradeFlags: Object.freeze([]),
    requiresForeignFlags: Object.freeze(['commodityFlowEnabled', 'demographicsEnabled']),
    requiresLandedWork: Object.freeze([]),
  }),
  Object.freeze({
    flag: 'tradePactsEnabled',
    wave: 'TR-5',
    order: 5,
    requiresTradeFlags: Object.freeze(['casusCommerciiEnabled']),
    requiresForeignFlags: Object.freeze(['pactFormationEnabled']),
    // GR-3's five commercial TERM_CATALOG rows are a landed-work precondition,
    // not a second flag: they ride `pactFormationEnabled`'s own wave pair and
    // TR-5 pins their membership rather than gating on a key of its own.
    requiresLandedWork: Object.freeze(['GR-3 commercial TERM_CATALOG rows']),
  }),
  Object.freeze({
    flag: 'corneringEnabled',
    wave: 'TR-6',
    order: 6,
    requiresTradeFlags: Object.freeze([
      'merchantHousesEnabled',
      'believedMarketsEnabled',
      'foodCaravansEnabled',
    ]),
    // The riot counterforce consumes the BUILT/DARK commons ladder. Both volumes
    // rule that a config in which a MANDATORY counterforce is structurally dark
    // is invalid, so there is deliberately NO degraded four-of-five arm.
    requiresForeignFlags: Object.freeze(['commonsVoiceEnabled']),
    requiresLandedWork: Object.freeze([]),
  }),
  Object.freeze({
    flag: 'venturesEnabled',
    wave: 'TR-7',
    order: 7,
    requiresTradeFlags: Object.freeze(['merchantHousesEnabled', 'believedMarketsEnabled']),
    requiresForeignFlags: Object.freeze(['commodityFlowEnabled']),
    requiresLandedWork: Object.freeze([]),
  }),
  Object.freeze({
    flag: 'factorErrandsEnabled',
    wave: 'TR-8',
    order: 8,
    requiresTradeFlags: Object.freeze(['tradePactsEnabled', 'venturesEnabled']),
    requiresForeignFlags: Object.freeze(['errandSpineEnabled']),
    // WR-7b's hold writer (worldPulse/foreignGuestHold.js) is LANDED — the TR
    // architecture's S34 row, re-measured present at this landing. It is carried
    // as landed work rather than as a flag because it is a writer, not a gate.
    requiresLandedWork: Object.freeze(['WR-7b foreignGuestHold writer (landed)']),
  }),
]);

/**
 * THE NAMED DEGRADED ARMS — a lit flag whose SUB-CAPABILITY narrows because a
 * neighbour is dark. Each row names what the arm falls back to, in the volume's
 * own words, so a receipt reader can tell a degraded run from a broken one.
 *
 * These are declarations, not gates: nothing here can refuse a config. They are
 * recorded in this module because the same reader who asks "why is this envelope
 * zero" asks "why is this stream thinner than the design says", and both answers
 * belong beside the vocabulary they qualify.
 *
 * TR-8's "the venture-supercargo errand kind suppresses when TR-7 is dark" is
 * DELIBERATELY ABSENT: both volumes also make `venturesEnabled` a hard
 * precondition of `factorErrandsEnabled`, so that suppression can never be
 * reached, and minting an unreachable arm is the dead-band shape L1 forbids. It
 * is written down HERE, as prose, rather than encoded as a dead row.
 */
export const TRADE_DEGRADED_ARMS = Object.freeze([
  Object.freeze({
    flag: 'tradePactsEnabled',
    arm: 'grain_provision physical arm',
    darkWithoutFlag: 'foodCaravansEnabled',
    degradesTo: 'the conserved rate-stream arithmetic treatyTransfer already runs'
      + ' — the ONE named degraded read',
  }),
  Object.freeze({
    flag: 'venturesEnabled',
    arm: 'new_route venture kind',
    darkWithoutFlag: 'routeLifecycleEnabled',
    degradesTo: 'the venture kind set suppresses to {far_market, joint_venture}',
  }),
]);

/**
 * THE ENDING MINT TABLE — which wave first mints each ending, and the exact flag
 * conjunction under which it can be minted at all.
 *
 * `permanentZeroWhileDark` carries the volume's one HONEST PERMANENT ZERO: while
 * `routeLifecycleEnabled` is dark, `collapse` is UNMINTABLE and its zero is
 * sequencing evidence, never a tuning failure (the whole-world-soak honest-empty
 * precedent). It is a field rather than a comment precisely so the envelope wave
 * cannot fail a corpus for it by accident.
 */
export const TRADE_ENDING_MINT_ROWS = Object.freeze([
  Object.freeze({
    ending: 'fortune',
    mintedAt: 'TR-2',
    requiresFlags: Object.freeze(['merchantHousesEnabled']),
    permanentZeroWhileDark: null,
  }),
  Object.freeze({
    ending: 'ruin',
    mintedAt: 'TR-2',
    requiresFlags: Object.freeze(['merchantHousesEnabled']),
    permanentZeroWhileDark: null,
  }),
  Object.freeze({
    ending: 'monopoly',
    mintedAt: 'TR-6',
    requiresFlags: Object.freeze(['corneringEnabled']),
    permanentZeroWhileDark: null,
  }),
  Object.freeze({
    ending: 'collapse',
    mintedAt: 'TR-4',
    requiresFlags: Object.freeze(['foodCaravansEnabled', 'routeLifecycleEnabled']),
    permanentZeroWhileDark: 'routeLifecycleEnabled',
  }),
  Object.freeze({
    ending: 'severance',
    mintedAt: 'TR-1',
    requiresFlags: Object.freeze(['casusCommerciiEnabled']),
    permanentZeroWhileDark: null,
  }),
  Object.freeze({
    ending: 'cornered',
    mintedAt: 'TR-6',
    requiresFlags: Object.freeze(['corneringEnabled']),
    permanentZeroWhileDark: null,
  }),
]);

/** @param {unknown} value @returns {UnknownRecord} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {UnknownRecord} */ (value)
    : {}
);

/**
 * THE ONE GATE READ SPELLING for this whole module. Strict `=== true`:
 * `false`, absent, `'true'`, `1` and every other truthy impostor are DARK. L2's
 * dark-never-permissive law has exactly one home here so no table can drift into
 * a looser read.
 * @param {UnknownRecord} rules
 * @param {string} key
 */
const isLit = (rules, key) => rules[key] === true;

/** @param {ReadonlyArray<string>} keys @returns {Record<string, number>} */
const zeroCountMap = (keys) => Object.fromEntries(keys.map((key) => [key, 0]));

/**
 * THE LIGHTING-ORDER LAW, EXECUTED: a flag lit out of order is an INVALID CONFIG.
 *
 * For every TR flag lit in `rules`, every declared precondition must also be lit.
 * A violation names the flag, the missing key, and which kind of miss it was, so
 * a certification failure reads as an instruction rather than a puzzle.
 *
 * TOTAL AND DETERMINISTIC: rows are walked in `order`, requirements in declared
 * order, so the violation list is stable for a given config and safe to embed in
 * a receipt. A non-object `rules` is treated as the all-dark config, which is the
 * honest reading — nothing is lit, so nothing can be out of order.
 *
 * @param {unknown} rules a simulation-rules object (or anything, treated as dark)
 * @returns {{ ok: boolean, violations: Array<{
 *   flag: string, wave: string, missing: string, kind: string, message: string,
 * }> }}
 */
export function evaluateTradeFlagLighting(rules) {
  const config = asRecord(rules);
  /** @type {Array<{ flag: string, wave: string, missing: string, kind: string, message: string }>} */
  const violations = [];
  for (const row of TRADE_FLAG_LIGHTING_ROWS) {
    if (!isLit(config, row.flag)) continue;
    for (const missing of row.requiresTradeFlags) {
      if (isLit(config, missing)) continue;
      violations.push({
        flag: row.flag,
        wave: row.wave,
        missing,
        kind: 'trade_precondition_dark',
        message: `${row.flag} (${row.wave}) is lit while the TRADE flag it builds on, `
          + `${missing}, is dark — lighting order is build order, so this config `
          + 'certifies mechanisms that cannot run.',
      });
    }
    for (const missing of row.requiresForeignFlags) {
      if (isLit(config, missing)) continue;
      violations.push({
        flag: row.flag,
        wave: row.wave,
        missing,
        kind: 'foreign_precondition_dark',
        message: `${row.flag} (${row.wave}) is lit while ${missing}, the substrate it `
          + 'consumes, is dark — the principal mechanisms of this wave have nothing '
          + 'to read.',
      });
    }
  }
  return { ok: violations.length === 0, violations };
}

/**
 * KIND AVAILABILITY: which of the six endings this config can mint at all.
 *
 * This is the second half of the volume's ruling — the walker "asserts
 * KIND-AVAILABILITY under each precondition, not merely flag order" — and it is
 * what lets an envelope tell a SEQUENCING zero from a DECORATION zero. A zero
 * beside `UNMINTABLE_BY_CONFIG` is a statement about build order; a zero beside
 * `MINTABLE` is a statement about the world, and only the second may ever fail a
 * band.
 *
 * Rows come back in `TRADE_ENDING_KEYS` order, always all six.
 *
 * @param {unknown} rules
 * @returns {Array<{
 *   ending: string, state: string, mintedAt: string,
 *   blockedBy: string[], honestPermanentZero: boolean,
 * }>}
 */
export function tradeEndingAvailability(rules) {
  const config = asRecord(rules);
  return TRADE_ENDING_MINT_ROWS.map((row) => {
    const blockedBy = row.requiresFlags.filter((flag) => !isLit(config, flag));
    return {
      ending: row.ending,
      state: blockedBy.length === 0 ? 'MINTABLE' : 'UNMINTABLE_BY_CONFIG',
      mintedAt: row.mintedAt,
      blockedBy,
      // The named honest-permanent-zero flag, and only it: `collapse` blocked by
      // a dark route lifecycle is sequencing evidence. `collapse` blocked by a
      // dark grain road is the ordinary dark-wave case and reports false, so the
      // two are never conflated.
      honestPermanentZero: row.permanentZeroWhileDark !== null
        && blockedBy.includes(row.permanentZeroWhileDark),
    };
  });
}

/**
 * Start a TR-9 collector without duplicating a single closed-vocabulary spelling.
 *
 * The empty value is structurally valid and deliberately INELIGIBLE: every count
 * is zero and every flag row is UNOBSERVED, so nothing can certify until a
 * collector replaces the observations with measured evidence. Its availability
 * block is DERIVED by calling `tradeEndingAvailability({})` rather than authored,
 * so the honest empty state is the all-dark reading BY CONSTRUCTION and the two
 * can never disagree.
 */
export function createEmptyTradeConvergenceObservation() {
  const availability = Object.fromEntries(
    tradeEndingAvailability({}).map((row) => [row.ending, row.state]),
  );
  return {
    schemaVersion: TRADE_CONVERGENCE_OBSERVATION_VERSION,
    kind: 'trade_convergence_observation',
    endingsMix: zeroCountMap(TRADE_ENDING_KEYS),
    endingAvailability: availability,
    flagCertificationRows: TRADE_RULINGS_FLAG_KEYS.map((rule) => ({
      rule,
      ruleState: 'unknown',
      verdict: 'UNOBSERVED',
    })),
  };
}

/**
 * Validate one v1 trade convergence observation. This is a SHAPE AND TOTALITY
 * wall, not an envelope oracle: it proves every ending and every TR flag has an
 * address, and it refuses the one combination that is a lie rather than a
 * failure.
 *
 * THE CROSS-FIELD HONESTY WALL: an ending with a nonzero count while its
 * availability says `UNMINTABLE_BY_CONFIG` is refused outright. That is an
 * instrument reporting conclusions from a wave it also declares dark — the
 * endings-side twin of the war module's "quoting a precision it never claimed",
 * and the one shape that would let a collector launder a bug into an envelope.
 *
 * @param {unknown} raw
 * @returns {{ ok: boolean, errors: string[], observation: UnknownRecord|null }}
 */
export function validateTradeConvergenceObservation(raw) {
  /** @type {string[]} */
  const errors = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      ok: false,
      errors: ['tradeConvergence must be an object.'],
      observation: null,
    };
  }
  const observation = asRecord(raw);
  if (observation.schemaVersion !== TRADE_CONVERGENCE_OBSERVATION_VERSION) {
    errors.push(
      `tradeConvergence.schemaVersion must be ${TRADE_CONVERGENCE_OBSERVATION_VERSION}.`,
    );
  }
  if (observation.kind !== 'trade_convergence_observation') {
    errors.push('tradeConvergence.kind must be trade_convergence_observation.');
  }

  const rawMix = observation.endingsMix;
  const mix = asRecord(rawMix);
  if (!rawMix || typeof rawMix !== 'object' || Array.isArray(rawMix)) {
    errors.push('tradeConvergence.endingsMix must be an object.');
  } else {
    for (const key of TRADE_ENDING_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(mix, key)) {
        errors.push(`tradeConvergence.endingsMix is missing ${key}.`);
      } else if (!Number.isInteger(mix[key]) || Number(mix[key]) < 0) {
        errors.push(`tradeConvergence.endingsMix.${key} must be a non-negative integer.`);
      }
    }
    const expected = new Set(TRADE_ENDING_KEYS);
    for (const key of Object.keys(mix)) {
      if (!expected.has(key)) {
        errors.push(`tradeConvergence.endingsMix has unknown key ${key}.`);
      }
    }
  }

  const rawAvailability = observation.endingAvailability;
  const availability = asRecord(rawAvailability);
  if (!rawAvailability || typeof rawAvailability !== 'object' || Array.isArray(rawAvailability)) {
    errors.push('tradeConvergence.endingAvailability must be an object.');
  } else {
    for (const key of TRADE_ENDING_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(availability, key)) {
        errors.push(`tradeConvergence.endingAvailability is missing ${key}.`);
      } else if (!TRADE_ENDING_AVAILABILITY_STATES.includes(
        /** @type {string} */ (availability[key]),
      )) {
        errors.push(
          `tradeConvergence.endingAvailability.${key} must be one of: `
          + `${TRADE_ENDING_AVAILABILITY_STATES.join(', ')}.`,
        );
      }
    }
    const expected = new Set(TRADE_ENDING_KEYS);
    for (const key of Object.keys(availability)) {
      if (!expected.has(key)) {
        errors.push(`tradeConvergence.endingAvailability has unknown key ${key}.`);
      }
    }
    for (const key of TRADE_ENDING_KEYS) {
      if (Number(mix[key]) > 0 && availability[key] === 'UNMINTABLE_BY_CONFIG') {
        errors.push(
          `tradeConvergence counted ${String(mix[key])} ${key} endings while declaring `
          + `${key} UNMINTABLE_BY_CONFIG — an instrument cannot count what it says it `
          + 'could not mint.',
        );
      }
    }
  }

  if (!Array.isArray(observation.flagCertificationRows)) {
    errors.push('tradeConvergence.flagCertificationRows must be an array.');
  } else {
    const expected = new Set(TRADE_RULINGS_FLAG_KEYS);
    /** @type {Set<string>} */
    const seen = new Set();
    for (const [index, rawRow] of observation.flagCertificationRows.entries()) {
      if (!rawRow || typeof rawRow !== 'object' || Array.isArray(rawRow)) {
        errors.push(`tradeConvergence.flagCertificationRows[${index}] must be an object.`);
        continue;
      }
      const row = asRecord(rawRow);
      const rule = typeof row.rule === 'string' ? row.rule : '';
      if (!expected.has(rule)) {
        errors.push(
          `tradeConvergence.flagCertificationRows[${index}].rule is unknown: ${String(row.rule)}.`,
        );
      } else if (seen.has(rule)) {
        errors.push(`tradeConvergence.flagCertificationRows duplicates ${rule}.`);
      }
      if (rule) seen.add(rule);
      if (!TRADE_FLAG_RULE_STATES.includes(/** @type {string} */ (row.ruleState))) {
        errors.push(
          `tradeConvergence.flagCertificationRows[${index}].ruleState must be one of: `
          + `${TRADE_FLAG_RULE_STATES.join(', ')}.`,
        );
      }
      if (!TRADE_FLAG_CERTIFICATION_VERDICTS.includes(
        /** @type {string} */ (row.verdict),
      )) {
        errors.push(
          `tradeConvergence.flagCertificationRows[${index}].verdict must be one of: `
          + `${TRADE_FLAG_CERTIFICATION_VERDICTS.join(', ')}.`,
        );
      }
      if ((row.ruleState === 'off') !== (row.verdict === 'DORMANT_BY_CONFIG')) {
        errors.push(
          `tradeConvergence.flagCertificationRows[${index}] must pair off with `
          + 'DORMANT_BY_CONFIG, and only that pair.',
        );
      }
      if (row.ruleState === 'unknown' && row.verdict !== 'UNOBSERVED') {
        errors.push(
          `tradeConvergence.flagCertificationRows[${index}] cannot claim `
          + `${String(row.verdict)} from an unknown rule state.`,
        );
      }
    }
    for (const rule of TRADE_RULINGS_FLAG_KEYS) {
      if (!seen.has(rule)) {
        errors.push(`tradeConvergence.flagCertificationRows is missing ${rule}.`);
      }
    }
  }

  return { ok: errors.length === 0, errors, observation };
}
