/**
 * couplingDesk.walker.test.js — CW-0w slice 3: THE DESK WALKER.
 *
 * THE CLASS. A coupling row declares the desk its story belongs on
 * (`intendedDesk`); heraldRouting.js decides where the event actually files
 * (SECTION_OF). When those two drift apart nothing tells anyone: the registry
 * keeps reading as the layer/desk authority while the paper prints the story
 * somewhere else. That is the belief_misjudgment-under-faith misfile class,
 * generalised — and CW-1's braid derivation and CW-3's aliveness rows are both
 * specced to trust the registry's desks.
 *
 * WHAT THE SPEC ASKED FOR, AND WHAT THE TREE SAYS. Both DESIGN_FP_COUPLINGS.md
 * §6 CW-0 and the CW architecture's §4 slice 3 state the rule as "every registry
 * row's kinds route to intendedDesk". MEASURED against the live tree, that rule
 * holds for 5 of the 12 rows whose receiptField names Herald kinds and fails for
 * 7 — and heraldRouting.js says why in its own WR-10 comment: "the four
 * adjudication kinds cannot do the same (adjudication is never a token output)
 * and fall to the events catch-all". Ten registry rows carry
 * `intendedDesk: 'adjudication'`, a desk SECTION_OF can never return.
 *
 * So this walker does NOT quietly enforce the rule over whichever rows happen to
 * satisfy it — that would guard the easy cases and exempt exactly the disputed
 * ones. It enforces four things instead:
 *
 *   1. AGREEMENT — every kind a row DECLARES routes to that row's desk, and
 *      routes EXPLICITLY (an exact entry, a lifecycle delegation or a family
 *      prefix), never by falling through to the `events` catch-all. A kind that
 *      agrees only because both sides landed in the catch-all agrees by
 *      accident.
 *   2. NO ESCAPE BY SILENCE — the receiptField strings are SCANNED for
 *      `kind=...` tokens, so a row cannot dodge the join by declining to declare
 *      `kinds`. Every scanned kind is either declared-and-agreeing or named in
 *      the disputed register below.
 *   3. THE DISPUTED REGISTER — the measured disagreements (7 rows, 11 row-kind
 *      pairs), frozen EXACTLY with
 *      the section each kind really routes to. A NEW disagreement reds; a
 *      repaired one must be DELETED from the register, so it only shrinks. The
 *      dispute is now machine-visible instead of being a sentence in a comment,
 *      and the chair holds the ruling on which side moves: the desks are
 *      editorial intent (owner-facing) and SECTION_OF is the paper's single-home
 *      law, so neither is this walker's to re-rule.
 *   4. THE STRUCTURAL-DESK LAW — a row that declares kinds may not claim a desk
 *      SECTION_OF cannot return. Today that is `adjudication` (and, at the
 *      record layer, the emerging-stage arm of `divination`): filing there is a
 *      property of the RECORD, not of the token.
 *
 * PRECEDENCE, STATED (J-CPL-10, closed by adoption of IN-5's ruling): IN-5 owns
 * the belief_misjudgment refile and the no-word-association assertion. This
 * walker asserts registry-vs-routing AGREEMENT over CURRENT desks and must NEVER
 * pin the pre-refile seat. When IN-5 mints the knowledge desk and flips
 * `belief_misjudgment` out of faith, IN-5's own commit moves the affected rows'
 * intendedDesk in the same change (the same-commit obligation covers desk
 * moves), and this walker stays green through the flip by construction — it
 * reads both sides live and pins neither spelling.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import { COUPLING_REGISTRY } from '../../src/domain/certification/couplingRegistry.js';
import {
  HERALD_SECTIONS,
  SECTION_OF,
  isExplicitlyRouted,
} from '../../src/domain/realm/heraldRouting.js';

/** `pulseRecord.xEvidence[kind=a|b].{…}` — the receiptField's own kind syntax. */
const KIND_TOKEN_RE = /kind=([a-z_|]+)\]/g;

/** Every Herald kind a row's receiptField names, declared or not. */
function scannedKindsOf(row) {
  return [...String(row.receiptField).matchAll(KIND_TOKEN_RE)]
    .flatMap((match) => match[1].split('|'))
    .filter(Boolean);
}

/**
 * Desks that are NOT token outputs. heraldRouting's header states the law:
 * adjudication is decided at the record layer (a proposal or a resolved ruling),
 * so SECTION_OF can never return it and a kinds-carrying row can never reach it.
 */
const STRUCTURAL_ONLY_DESKS = Object.freeze(['adjudication']);

/**
 * THE DISPUTED REGISTER — measured 2026-08-04, SHRINK-ONLY.
 *
 * Each entry: the row, the kind its receiptField names, and the section
 * SECTION_OF really returns for it. Seven rows, eleven row-kind pairs. FIVE of
 * the seven are the structural-desk case heraldRouting already documents (an
 * adjudication row whose tokens fall to `events`). The other TWO are genuine
 * splits with no such excuse: WR-6's coalition settlement claims `trade` while
 * one of its two kinds files under `events`, and WR-7's envoy encounter claims
 * `war` while two of its four file under `events`. Those two are the rows the
 * chair's ruling most needs to reach.
 *
 * TO COMPLY when this reds: a NEW row disagreeing means either its desk or its
 * kind's routing is wrong — argue it, do not add a row here without a chair
 * ruling. A disagreement that got REPAIRED must have its entry deleted so the
 * win is banked; the register never grows on its own.
 */
const DISPUTED = Object.freeze([
  { couplingId: 'CPL-1.WAR_TO_TRADE.WR-6.coalition_settlement', kind: 'coalition_apportionment', desk: 'trade', routesTo: 'events' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-6.pairwise_settlement', kind: 'coalition_separate_peace', desk: 'adjudication', routesTo: 'events' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-6.pairwise_settlement', kind: 'coalition_apportionment', desk: 'adjudication', routesTo: 'events' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-6.pairwise_settlement', kind: 'coalition_spoils_divided', desk: 'adjudication', routesTo: 'trade' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.peace_dispatch', kind: 'envoy_departed', desk: 'adjudication', routesTo: 'events' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.self_parlay', kind: 'interceptor_parlays_own_edge', desk: 'adjudication', routesTo: 'events' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.envoy_encounter', kind: 'envoy_parlaying', desk: 'war', routesTo: 'events' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.envoy_encounter', kind: 'envoy_held', desk: 'war', routesTo: 'events' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.two_picture_parlay', kind: 'envoy_terms_agreed', desk: 'adjudication', routesTo: 'events' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.two_picture_parlay', kind: 'parlay_terms_neither_court_drafted', desk: 'adjudication', routesTo: 'events' },
  { couplingId: 'CPL-5.GRAMMAR_TO_WAR.WR-7.home_delivery', kind: 'envoy_home', desk: 'adjudication', routesTo: 'events' },
]);

const disputedKey = (entry) => `${entry.couplingId} :: ${entry.kind}`;
const DISPUTED_KEYS = new Set(DISPUTED.map(disputedKey));

/** Floors measured when this walker landed — they tighten, never loosen. */
const DECLARING_ROW_FLOOR = 7;
const DECLARED_KIND_FLOOR = 9;

describe('CW-0w desk walker — anti-vacuity anchors', () => {
  test('the registry, the routing table and the kind scan are all live', () => {
    // Every agreement claim below is worthless if the registry emptied, the
    // routing table stopped classifying, or the receiptField scan stopped
    // matching. All three are asserted to still work before anything is trusted.
    expect(COUPLING_REGISTRY.length).toBeGreaterThan(0);
    expect(HERALD_SECTIONS).toContain('war');
    expect(SECTION_OF('coalition_entry_priced')).toBe('war');
    const scanned = COUPLING_REGISTRY.flatMap(scannedKindsOf);
    expect(scanned.length, 'the receiptField kind scan matched nothing').toBeGreaterThan(10);
  });

  test('the declared join is non-empty and every declared list is frozen and real', () => {
    const declaring = COUPLING_REGISTRY.filter((row) => row.kinds !== undefined);
    expect(declaring.length).toBeGreaterThanOrEqual(DECLARING_ROW_FLOOR);
    expect(declaring.flatMap((row) => row.kinds).length).toBeGreaterThanOrEqual(DECLARED_KIND_FLOOR);
    for (const row of declaring) {
      // Absent, never empty (T4): a row that mints no kinds omits the field.
      expect(row.kinds.length, `${row.couplingId} declares an EMPTY kinds[] — omit the field`).toBeGreaterThan(0);
      expect(Object.isFrozen(row.kinds), row.couplingId).toBe(true);
      expect(new Set(row.kinds).size, `${row.couplingId} repeats a kind`).toBe(row.kinds.length);
    }
  });
});

describe('CW-0w desk walker — registry-vs-routing agreement', () => {
  test('every DECLARED kind routes explicitly, and to its row\'s own desk', () => {
    const violations = [];
    for (const row of COUPLING_REGISTRY) {
      if (row.kinds === undefined) continue;
      for (const kind of row.kinds) {
        if (!isExplicitlyRouted(kind)) {
          violations.push(`${row.couplingId}: '${kind}' is not explicitly routed — it falls through to`
            + ' the events catch-all, so any agreement is an accident. File it in heraldRouting.');
          continue;
        }
        const section = SECTION_OF(kind);
        if (section !== row.intendedDesk) {
          violations.push(`${row.couplingId}: '${kind}' routes to '${section}' but the row's`
            + ` intendedDesk is '${row.intendedDesk}'. One of the two is wrong — the registry row`
            + ' and heraldRouting must move together, in one commit.');
        }
      }
    }
    expect(violations).toEqual([]);
  });

  test('a row declaring kinds may not claim a desk SECTION_OF cannot return', () => {
    // heraldRouting's own header: adjudication is never a token output. A row
    // that declares kinds AND claims it is asserting something unreachable.
    for (const desk of STRUCTURAL_ONLY_DESKS) {
      // The law is only meaningful if the desk really is unreachable; prove it
      // over the whole declared vocabulary rather than asserting it.
      const reachable = COUPLING_REGISTRY
        .flatMap(scannedKindsOf)
        .filter((kind) => SECTION_OF(kind) === desk);
      expect(reachable, `'${desk}' is reachable from SECTION_OF after all — re-argue this law`).toEqual([]);
    }
    const offenders = COUPLING_REGISTRY
      .filter((row) => row.kinds !== undefined && STRUCTURAL_ONLY_DESKS.includes(row.intendedDesk))
      .map((row) => `${row.couplingId} declares kinds while filing at the structural desk`
        + ` '${row.intendedDesk}', which SECTION_OF never returns.`);
    expect(offenders).toEqual([]);
  });
});

describe('CW-0w desk walker — the disputed register (shrink-only)', () => {
  test('every scanned kind is either declared-and-agreeing or a KNOWN dispute', () => {
    // The escape this closes: a row whose kinds disagree could simply not
    // declare `kinds` and vanish from the agreement test above. The receiptField
    // scan sees it anyway.
    const unaccounted = [];
    for (const row of COUPLING_REGISTRY) {
      const declared = new Set(row.kinds ?? []);
      for (const kind of scannedKindsOf(row)) {
        if (declared.has(kind) && SECTION_OF(kind) === row.intendedDesk) continue;
        if (DISPUTED_KEYS.has(disputedKey({ couplingId: row.couplingId, kind }))) continue;
        unaccounted.push(`${row.couplingId}: '${kind}' routes to '${SECTION_OF(kind)}' against desk`
          + ` '${row.intendedDesk}' and is neither declared-and-agreeing nor a recorded dispute.`);
      }
    }
    expect(unaccounted).toEqual([]);
  });

  test('the register is EXACT: every frozen dispute is still a live disagreement', () => {
    const stale = [];
    for (const entry of DISPUTED) {
      const row = COUPLING_REGISTRY.find((candidate) => candidate.couplingId === entry.couplingId);
      if (!row) {
        stale.push(`${entry.couplingId} no longer exists — DELETE its register entries.`);
        continue;
      }
      if (!scannedKindsOf(row).includes(entry.kind)) {
        stale.push(`${entry.couplingId} no longer names '${entry.kind}' — DELETE the entry.`);
        continue;
      }
      if (row.intendedDesk !== entry.desk || SECTION_OF(entry.kind) !== entry.routesTo) {
        stale.push(`${entry.couplingId}/'${entry.kind}' moved: desk '${row.intendedDesk}'`
          + ` (frozen '${entry.desk}') routes to '${SECTION_OF(entry.kind)}' (frozen '${entry.routesTo}').`
          + ' If the dispute is RESOLVED, delete the entry so the win is banked.');
        continue;
      }
      if (row.intendedDesk === SECTION_OF(entry.kind)) {
        stale.push(`${entry.couplingId}/'${entry.kind}' AGREES now — DELETE the entry.`);
      }
    }
    expect(stale).toEqual([]);
    // The register may not carry a phantom: each entry names a real live
    // disagreement, proven above, and the count is frozen so it cannot grow
    // silently while individual rows churn.
    expect(DISPUTED).toHaveLength(11);
    expect(new Set(DISPUTED.map(disputedKey)).size).toBe(DISPUTED.length);
  });
});
