/**
 * kindRegistryRoster.js — THE ONE ROSTER of every phrased-kind registry in the tree.
 *
 * WHY THIS FILE EXISTS (ODQ §356.2, R-6; the single-source law applied to a test):
 * this roster was transcribed TWICE — once in tests/lint/kindPoolFloors.walker.test.js
 * and once, by hand, inside tests/domain/pantheon.test.js's A5. WF-8a registered the
 * FAITH family, moved the shared denominators, and reddened the hand copy that no
 * packet had named. A hand-copied denominator drifts the moment the original moves.
 * With one roster, drift breaks BOTH consumers identically instead of letting one
 * silently disagree with the other — which is the whole point of the law.
 *
 * Listed rather than globbed, deliberately: a registry that stopped being imported
 * would silently leave the estate-wide claim, and a missing entry here is a review
 * conversation, not a quiet shrink of the denominator.
 *
 * ⭐ AND THE FIGURES NOW LIVE HERE TOO (ruled by the Fable chair, 2026-09-05). The line this
 * paragraph used to carry — "the FIGURES derived from this roster stay literal in each
 * consumer" — left SIX freezes hand-copied into two files, and the fork it left open bit
 * TWICE: WF-8a moved the walker's copies and reddened pantheon A5's, and ENC-4 did it again
 * one wave later, landing four RED arms nobody saw. The freezes stay LITERAL numbers — a
 * freeze derived from the tree is an assertion that cannot fail — but they live in ONE
 * roster of record, below.
 *
 * CONSUMERS: tests/lint/kindPoolFloors.walker.test.js · tests/domain/pantheon.test.js
 */
import {
  ENVOY_KIND_REGISTRY,
  WAR_COALITION_KIND_REGISTRY,
  WAR_COST_KIND_REGISTRY,
  WAR_DISPOSITION_KIND_REGISTRY,
  WAR_LINEAGE_KIND_REGISTRY,
  WAR_RULING_KIND_REGISTRY,
} from '../../src/domain/worldPulse/eventProse.js';
import { CHANCE_MEETING_KIND_REGISTRY } from '../../src/domain/worldPulse/envoyChanceMeetingNews.js';
import { COMMERCIAL_KIND_REGISTRY } from '../../src/domain/worldPulse/commercialReasonsNews.js';
import { MARKET_KIND_REGISTRY } from '../../src/domain/worldPulse/marketNews.js';
import { GRAMMAR_KIND_REGISTRY } from '../../src/domain/worldPulse/grammarNews.js';
import { FAITH_KIND_REGISTRY } from '../../src/domain/worldPulse/faithNews.js';
import { INFORMATION_KIND_REGISTRY } from '../../src/domain/worldPulse/informationNews.js';
import { SOVEREIGNTY_KIND_REGISTRY } from '../../src/domain/worldPulse/sovereigntyNews.js';

/**
 * EVERY phrased-kind registry in the tree, named by its program.
 * @type {ReadonlyArray<readonly [string, ReadonlyArray<any>]>}
 */
export const KIND_REGISTRIES = Object.freeze([
  ['WAR_DISPOSITION', WAR_DISPOSITION_KIND_REGISTRY],
  ['WAR_LINEAGE', WAR_LINEAGE_KIND_REGISTRY],
  ['WAR_COST', WAR_COST_KIND_REGISTRY],
  ['WAR_RULING', WAR_RULING_KIND_REGISTRY],
  ['WAR_COALITION', WAR_COALITION_KIND_REGISTRY],
  ['ENVOY', ENVOY_KIND_REGISTRY],
  ['COMMERCIAL', COMMERCIAL_KIND_REGISTRY],
  // TR-3: the THIRTEENTH registry family, and the estate's FOURTH deliberately one-row one,
  // declared beside its TRADE sibling rather than appended (SR-7). Its single kind is the T-1
  // tellable, the wrong-market arrival, which CARRIES a desk (an EXACT_SECTION row at trade),
  // so like FAITH's obituary it moves ROUTED_TOKENS and REGISTERED_KIND_COUNT together and
  // leaves the registered-minus-routed difference where it was.
  ['MARKET', MARKET_KIND_REGISTRY],
  ['GRAMMAR', GRAMMAR_KIND_REGISTRY],
  ['SOVEREIGNTY', SOVEREIGNTY_KIND_REGISTRY],
  // IN-1c-a: the fifth FP registry family, and the estate's first ONE-ROW registry. Its single
  // kind is a DOSSIER LINE with `section: null`, so it registers WITHOUT routing — which is why
  // it moves REGISTERED_KIND_COUNT and the divergence identity while leaving ROUTED_TOKENS
  // exactly where it is.
  ['INFORMATION', INFORMATION_KIND_REGISTRY],
  // WF-8a: the SIXTH FP registry family, and the estate's SECOND deliberately one-row one. Its
  // single kind is the settlement extinction obituary, which DOES carry a Herald desk — so
  // unlike INFORMATION's dossier line it moves ROUTED_TOKENS and REGISTERED_KIND_COUNT
  // together and leaves the registered-minus-routed difference exactly where it was.
  ['FAITH', FAITH_KIND_REGISTRY],
  // ENC-4: the SEVENTH FP registry family, and the estate's THIRD deliberately one-row one. Its
  // single kind is the meeting neither court arranged, which DOES carry a Herald desk — so like
  // FAITH's obituary and unlike INFORMATION's dossier line it moves ROUTED_TOKENS and
  // REGISTERED_KIND_COUNT together and leaves the registered-minus-routed difference where it was.
  ['CHANCE_MEETING', CHANCE_MEETING_KIND_REGISTRY],
]);

/**
 * ⭐⭐ THE SIX REGISTRATION FREEZES — THE ONE ROSTER OF RECORD.
 *
 * A COMMIT THAT REGISTERS A KIND MOVES THIS FILE. That is the whole contract, and it is
 * why these figures sit beside the registry list they are counted from: a registry joining
 * IS what moves them, so a registering commit has exactly ONE place to edit.
 *
 * —— THE ATTRIBUTION RULE, so a registering commit can predict every figure it owes ——
 *
 *   A NEW REGISTRY FAMILY          → `registries` +1; and if the family lands with FEWER
 *                                    THAN FIVE rows it joins `smallFamilies` too, in
 *                                    registry declaration order.
 *   A NEW KIND (one registry row)  → `registeredKinds` +1, ALWAYS.
 *     └ and it CARRIES A DESK       → `routedTokens` +1 as well (its own EXACT_SECTION row),
 *        (an EXACT_SECTION row)      and `registeredMinusRouted` DOES NOT MOVE.
 *     └ or it is `section: null`    → `routedTokens` DOES NOT MOVE (a dossier line or a
 *        (the NO-DESK class)          GRAMMAR row files no Herald desk), and
 *                                     `registeredMinusRouted` +1.
 *   A TOKEN ROUTED WITH NO ROW     → `routedTokens` +1 AND `unvoicedTokens` +1 — ⛔ which is
 *                                    a STOP, not a move: `unvoicedTokens` is asserted
 *                                    SHRINK-ONLY and has no lawful growth cure. Route the
 *                                    kind by its family PREFIX instead, or phrase a pool.
 *
 * A kind routed by PREFIX with no exact row and no registry row moves NOTHING (WF-1C's
 * `pantheon_extinction` is the precedent, and pantheon A5 pins its absence).
 *
 * ⛔⛔ EVERY FIGURE HERE IS A LITERAL AND MUST STAY ONE. Deriving any of them from the live
 * registries would turn its consumers' arms into assertions that cannot fail — the freeze IS
 * the instrument. Both consumers compare these literals against the LIVE tree.
 *
 * ⚠⚠ FOUR OF THE SIX ARE ALSO SPELLED, DELIBERATELY, IN kindPoolFloors.walker.test.js, AND
 * THAT DUPLICATION MAY NOT BE TIDIED AWAY. `scripts/base-state-capsule.mjs` PARSES the
 * walker's SOURCE for `REGISTERED_KIND_COUNT` (:384), `LEGACY_UNVOICED_TOKENS` (:387), the
 * `expect(REGISTRIES).toHaveLength(n)` identity (:388) and the `routedAndRegistered` `.toBe(n)`
 * identity (:385), and `tests/scripts/baseStateCapsule.test.js` (:155-:159) re-reads the same
 * four by REGEX with a second engine. Both FAIL CLOSED on a non-literal. So the walker keeps
 * those four numerals and BINDS each to this roster with an executed equality: roster ==
 * walker == tree, all three asserted, so a commit that moves one side alone REDS. The other
 * two figures are read from here and appear nowhere else.
 *
 * @type {Readonly<{ registries: number, smallFamilies: ReadonlyArray<string>,
 *   registeredKinds: number, routedTokens: number, unvoicedTokens: number,
 *   registeredMinusRouted: number }>}
 */
export const KIND_REGISTRATION_FREEZES = Object.freeze({
  /** Registry families in KIND_REGISTRIES above. ENC-4 took this 11 → 12 (CHANCE_MEETING); TR-3 12 → 13 (MARKET). */
  registries: 13,
  /**
   * The families under five rows, in registry declaration order. ⛔ A family joining this
   * list is a REVIEWED ACT, never a number that slipped, and each entry carries a recorded
   * shrink-back obligation on the member that takes its family to five rows or more.
   */
  // ⭐ TR-3 ADMITS MARKET, a one-row family, as the reviewed act this list exists to force: the
  // TRADE annex authors eight TR-3 kinds and this wave registers the one whose producer exists
  // (the WHERE composer's wrong-market evidence). ⛔ THE SHRINK-BACK IS A RECORDED OBLIGATION of
  // the TR-3 member that takes MARKET to five rows or more: strike it from this list in that commit.
  smallFamilies: Object.freeze(['MARKET', 'INFORMATION', 'FAITH', 'CHANCE_MEETING']),
  /** Every registry row in the estate. ENC-4 took this 113 → 114, and ENC-4b (§900) 114 → 115
   * with `chance_meeting_exposed`, the seventh family's second desk-bearing exact row. */
  // +1 at LIT1b-pre U4 (SR-1, SR-8): `signed`, the pact stage's signing beat, a desk-bearing GRAMMAR row.
  registeredKinds: 123, // the UNION at the FP integration pick, 2026-09-24 (the chair): 115 + 2 (GR-2b) + 1 (TR-3) + 1 (IN-2) + 1 (GR-6) + 2 (IN-3: false_accusation, sweep_launched) + 1 (LIT1b-pre U4: signed) — measured by the roster's readers at the tip
  /** `Object.keys(EXACT_SECTION).length`. ENC-4 took this 379 → 380, WITH registeredKinds, and
   * ENC-4b (§900) 380 → 381 with `chance_meeting_exposed`. */
  // +1 at LIT1b-pre U4: `signed` on its own EXACT_SECTION row (trade), REGISTERED in the commit that routes it.
  routedTokens: 389, // the UNION at the FP integration pick, 2026-09-24: 381 + 2 + 1 + 1 + 1 + 2 + 1
  /**
   * Herald-routed tokens with no phrased pool at all. ⛔ SHRINK-ONLY: the content annexes'
   * wiring waves lower it; nothing may raise it. Unmoved since the freeze: GR-2b's two new
   * EXACT_SECTION rows (`pact_proposed`, `realm_verb_propose_pact`) are REGISTERED in the same
   * commit that routes them, which is the only lawful road for a desk-bearing token.
   */
  unvoicedTokens: 274,
  /**
   * Registered kinds that route by NO EXACT_SECTION row — the NO-DESK class (dossier lines
   * and the GRAMMAR rows). The census's honesty check: a kind routed without a registry row,
   * or a desk-bearing kind registered without routing, breaks it. Unmoved since IN-1c-a.
   */
  registeredMinusRouted: 8,
});
