/**
 * couplingDesk.walker.test.js — CW-0w slice 3: THE DESK WALKER.
 *
 * THE CLASS. A coupling row declares the desk its story belongs on
 * (`intendedDesk`); the Herald decides where the event actually files. When those
 * two drift apart nothing tells anyone: the registry keeps reading as the
 * layer/desk authority while the paper prints the story somewhere else. That is the
 * belief_misjudgment-under-faith misfile class, generalised — and CW-1's braid
 * derivation and CW-3's aliveness rows are both specced to trust the registry's
 * desks.
 *
 * ── CR-FP-1: THE RULE THIS WALKER ENFORCES CHANGED, BY CHAIR RULING ──────────
 *
 * WHAT THE SPEC ASKED FOR, AND WHAT THE TREE SAID. Both DESIGN_FP_COUPLINGS.md §6
 * CW-0 and the CW architecture's §4 slice 3 stated the rule as "every registry
 * row's kinds route to intendedDesk", where routing meant SECTION_OF. MEASURED
 * against the live tree, that rule held for 5 of the 12 kind-carrying rows and
 * FAILED for 7, while TEN rows carried `intendedDesk: 'adjudication'` — a desk
 * SECTION_OF can never return. A rule falsified 7-of-12 is not a rule with
 * exceptions; it is the wrong premise.
 *
 * THE RULING (chair, recorded): ADJUDICATION IS AN AUTHORITY-ROUTED DESK — the
 * `sovereignty_registry` precedent generalized. `heraldSectionOfRecord` files by
 * token only as its LAST step; before that it honours a governed `section` carried
 * by a record whose `sectionAuthority` is one of four closed registries
 * (war_rulings, war_coalition, envoy, sovereignty). Adjudication is unreachable
 * from a token and perfectly reachable from an authority. So the walker's rule
 * generalises from TOKEN-OUTPUT to AUTHORITY-OR-TOKEN:
 *
 *   a row's intendedDesk must be reachable EITHER by its kind's explicit token
 *   route, OR by the governed kind registry of the authority the row NAMES.
 *
 * WHY THE ROWS NAME THEIR AUTHORITY RATHER THAN THE WALKER GUESSING IT. Schema v4
 * adds the optional `deskAuthority`, and the join is per-KIND, not per-word: the
 * authority's own registry says which desk it files each kind at, so naming
 * `envoy_registry` on a row whose kind that registry does not govern buys nothing
 * (proven by negative control below). A row whose token already reaches its desk
 * names no authority at all — absent, never empty.
 *
 * WHAT THE RULING RESOLVED, MEASURED. Of the eleven frozen row-kind disagreements,
 * SEVEN were the adjudication premise being wrong and are now AGREEMENTS-BY-
 * AUTHORITY. FOUR survive as genuine disputes and are frozen below. The register
 * shrank 11 → 4 by a ruling, not by an edit to either side.
 *
 * WHAT THIS WALKER STILL REFUSES TO DO. It does not quietly enforce over whichever
 * rows happen to satisfy it. It enforces four things:
 *
 *   1. AGREEMENT — every kind a row DECLARES reaches that row's desk, by token or
 *      by authority. A token-only agreement must route EXPLICITLY (an exact entry,
 *      a lifecycle delegation or a family prefix), never by falling through to the
 *      `events` catch-all: a kind that agrees only because both sides landed in
 *      the catch-all agrees by accident.
 *   2. NO ESCAPE BY SILENCE — the receiptField strings are SCANNED for `kind=...`
 *      tokens, so a row cannot dodge the join by declining to declare `kinds`.
 *   3. THE REACHABILITY LAW (the FORBID) — a row may not claim a desk NEITHER path
 *      can reach. This is the arm the ruling asked for, and it carries its own
 *      negative controls: a probe row claiming an unreachable desk is refused, a
 *      probe naming an authority that does not govern its kind is refused, and the
 *      positive twin is accepted so the refusals cannot be a predicate that says
 *      no to everything.
 *   4. THE DISPUTED REGISTER — the four surviving disagreements, frozen EXACTLY
 *      with the section each kind really files at. A NEW disagreement reds; a
 *      repaired one must be DELETED, so it only shrinks.
 *
 * PRECEDENCE, STATED (J-CPL-10, closed by adoption of IN-5's ruling): IN-5 owns
 * the belief_misjudgment refile and the no-word-association assertion. This walker
 * asserts registry-vs-routing AGREEMENT over CURRENT desks and must NEVER pin the
 * pre-refile seat. When IN-5 mints the knowledge desk and flips
 * `belief_misjudgment` out of faith, IN-5's own commit moves the affected rows'
 * intendedDesk in the same change (the same-commit obligation covers desk moves),
 * and this walker stays green through the flip by construction — it reads both
 * sides live and pins neither spelling.
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
import {
  ENVOY_KIND_REGISTRY,
  WAR_COALITION_KIND_REGISTRY,
  WAR_RULING_KIND_REGISTRY,
} from '../../src/domain/worldPulse/eventProse.js';
import { SOVEREIGNTY_KIND_REGISTRY } from '../../src/domain/worldPulse/sovereigntyNews.js';

/** `pulseRecord.xEvidence[kind=a|b].{…}` — the receiptField's own kind syntax. */
const KIND_TOKEN_RE = /kind=([a-z_|]+)\]/g;

/** Every Herald kind a row's receiptField names, declared or not. */
function scannedKindsOf(row) {
  return [...String(row.receiptField).matchAll(KIND_TOKEN_RE)]
    .flatMap((match) => match[1].split('|'))
    .filter(Boolean);
}

/**
 * The four closed record-layer authorities `heraldSectionOfRecord` honours, each
 * joined to the governed kind registry its projector files by. This map IS the
 * authority half of the rule: the section is read from the registry, never from
 * the row, so a row cannot assert a desk into existence by naming a word.
 */
const AUTHORITY_REGISTRIES = Object.freeze({
  war_rulings_registry: WAR_RULING_KIND_REGISTRY,
  war_coalition_registry: WAR_COALITION_KIND_REGISTRY,
  envoy_registry: ENVOY_KIND_REGISTRY,
  sovereignty_registry: SOVEREIGNTY_KIND_REGISTRY,
});

/** `${authority}|${kind}` → the desk that authority files the kind at. */
const GOVERNED_SECTION = new Map();
for (const [authority, registry] of Object.entries(AUTHORITY_REGISTRIES)) {
  for (const row of registry) {
    if (row && row.kind) GOVERNED_SECTION.set(`${authority}|${row.kind}`, String(row.section));
  }
}

/** The desk this row's NAMED authority files this kind at, or null when the row
 *  names none or that authority does not govern this kind. */
function governedDeskOf(row, kind) {
  if (!row.deskAuthority) return null;
  return GOVERNED_SECTION.get(`${row.deskAuthority}|${kind}`) ?? null;
}

/** Every desk this kind can ACTUALLY reach for this row — the union of the
 *  explicit token route and the row's own governed authority route. */
function reachableDesks(row, kind) {
  const out = new Set();
  if (isExplicitlyRouted(kind)) out.add(SECTION_OF(kind));
  const governed = governedDeskOf(row, kind);
  if (governed) out.add(governed);
  return out;
}

/** How this row's desk is reached for this kind: 'token', 'authority', or null. */
function agreementPathOf(row, kind) {
  if (isExplicitlyRouted(kind) && SECTION_OF(kind) === row.intendedDesk) return 'token';
  if (governedDeskOf(row, kind) === row.intendedDesk) return 'authority';
  return null;
}

/** The FORBID, as one reusable predicate so the tests and their negative controls
 *  exercise the SAME code rather than two spellings that could drift apart. */
function unreachableDeskViolation(row, kind) {
  if (agreementPathOf(row, kind)) return null;
  const reachable = [...reachableDesks(row, kind)].sort();
  return `${row.couplingId}: '${kind}' claims desk '${row.intendedDesk}', which it cannot`
    + ` reach. Reachable: ${reachable.length ? reachable.join(', ') : '(nothing — the kind'
      + ' routes only to the events catch-all and the row names no governing authority)'}.`
    + ' Move the desk, file the kind explicitly in heraldRouting, or name the'
    + ' deskAuthority whose governed registry really files it there — in ONE commit.';
}

const disputedKey = (entry) => `${entry.couplingId} :: ${entry.kind}`;

/**
 * THE DISPUTED REGISTER — re-measured under the CR-FP-1 ruling, SHRINK-ONLY.
 *
 * Each entry: the row, the kind its receiptField names, and the section that kind
 * really files at. FOUR row-kind pairs across THREE rows — down from eleven across
 * seven, because the authority arm resolved the whole adjudication family.
 *
 * These four are NOT the adjudication premise. Each is a row and its own governed
 * projector naming different desks for the same kind, with no structural excuse:
 * two rows claim a desk while their authority files the kind at `adjudication`,
 * and one claims `adjudication` while its authority files at `trade`. The desks
 * are editorial intent (owner-facing) and the governed registries are the paper's
 * single-home law, so neither is this walker's to re-rule.
 *
 * TO COMPLY when this reds: a NEW disagreement means either the desk or the
 * governed section is wrong — argue it, do not add a row here without a chair
 * ruling. A disagreement that got REPAIRED must have its entry deleted so the win
 * is banked; the register never grows on its own.
 */
const DISPUTED = Object.freeze([
  { couplingId: 'CPL-1.WAR_TO_TRADE.WR-6.coalition_settlement', kind: 'coalition_apportionment', desk: 'trade', filesAt: 'adjudication' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-6.pairwise_settlement', kind: 'coalition_spoils_divided', desk: 'adjudication', filesAt: 'trade' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.envoy_encounter', kind: 'envoy_parlaying', desk: 'war', filesAt: 'adjudication' },
  { couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-7.envoy_encounter', kind: 'envoy_held', desk: 'war', filesAt: 'adjudication' },
]);
const DISPUTED_KEYS = new Set(DISPUTED.map(disputedKey));

/** Where a kind really files for a row: its authority's desk when one governs it,
 *  otherwise its token desk. The register freezes THIS, not a guess. */
function filingDeskOf(row, kind) {
  return governedDeskOf(row, kind) ?? SECTION_OF(kind);
}

/** Floors measured when this walker landed — they tighten, never loosen. */
const DECLARING_ROW_FLOOR = 7;
const DECLARED_KIND_FLOOR = 9;
/** Rows naming an authority, measured at CR-FP-1. Absent ⇒ the arm went dead. */
const AUTHORED_ROW_FLOOR = 7;

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

  test('all four governed authority registries are live and non-empty', () => {
    // The authority arm of the rule is only meaningful if the registries it reads
    // still classify. An emptied registry would silently turn every
    // agreement-by-authority into an unreachable-desk red, which is loud — but an
    // authority map that lost a KEY would silently turn them into disputes, which
    // is not. Both directions are pinned here.
    expect(Object.keys(AUTHORITY_REGISTRIES).sort()).toEqual([
      'envoy_registry', 'sovereignty_registry', 'war_coalition_registry', 'war_rulings_registry',
    ]);
    for (const [authority, registry] of Object.entries(AUTHORITY_REGISTRIES)) {
      expect(registry.length, `${authority} registry emptied`).toBeGreaterThan(0);
      for (const row of registry) {
        expect(HERALD_SECTIONS, `${authority}/${row.kind} files at an unknown desk`)
          .toContain(row.section);
      }
    }
    expect(GOVERNED_SECTION.size).toBeGreaterThan(30);
  });

  test('THE RULING, EXECUTED: adjudication is unreachable by token and reachable by authority', () => {
    // This is the whole of CR-FP-1 in two assertions. If the first ever fails,
    // adjudication became a token output and the rule should go back to being
    // token-only. If the second fails, the authority arm is decorative.
    const byToken = COUPLING_REGISTRY
      .flatMap(scannedKindsOf)
      .filter((kind) => SECTION_OF(kind) === 'adjudication');
    expect(byToken, 'adjudication is a token output after all — re-argue the ruling').toEqual([]);
    const byAuthority = [...GOVERNED_SECTION.entries()]
      .filter(([, section]) => section === 'adjudication');
    expect(byAuthority.length, 'no authority files anything at adjudication — the arm is dead')
      .toBeGreaterThan(0);
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

  test('every named deskAuthority is a real authority that governs the row it is on', () => {
    const authored = COUPLING_REGISTRY.filter((row) => row.deskAuthority !== undefined);
    expect(authored.length).toBeGreaterThanOrEqual(AUTHORED_ROW_FLOOR);
    const idle = [];
    for (const row of authored) {
      expect(Object.keys(AUTHORITY_REGISTRIES), `${row.couplingId} names an unregistered authority`)
        .toContain(row.deskAuthority);
      // An authority naming NONE of the row's kinds is a word doing no work — the
      // exact shape a future row could use to look compliant while proving nothing.
      const kinds = [...new Set([...(row.kinds ?? []), ...scannedKindsOf(row)])];
      if (!kinds.some((kind) => governedDeskOf(row, kind) !== null)) {
        idle.push(`${row.couplingId} names '${row.deskAuthority}', which governs none of its`
          + ` kinds (${kinds.join(', ') || 'it names none'}) — drop the field or fix the join.`);
      }
    }
    expect(idle).toEqual([]);
  });
});

describe('CW-0w desk walker — registry-vs-routing agreement (authority-or-token)', () => {
  test('every DECLARED kind reaches its row\'s own desk, by token or by authority', () => {
    const violations = [];
    for (const row of COUPLING_REGISTRY) {
      if (row.kinds === undefined) continue;
      for (const kind of row.kinds) {
        const path = agreementPathOf(row, kind);
        if (path) continue;
        if (!isExplicitlyRouted(kind) && governedDeskOf(row, kind) === null) {
          violations.push(`${row.couplingId}: '${kind}' is not explicitly routed and no named`
            + ' authority governs it — it falls through to the events catch-all, so any'
            + ' agreement is an accident. File it in heraldRouting or name its authority.');
          continue;
        }
        violations.push(unreachableDeskViolation(row, kind));
      }
    }
    expect(violations).toEqual([]);
  });

  test('THE FORBID: a row may not claim a desk neither path can reach', () => {
    const offenders = [];
    for (const row of COUPLING_REGISTRY) {
      for (const kind of new Set([...(row.kinds ?? []), ...scannedKindsOf(row)])) {
        if (DISPUTED_KEYS.has(disputedKey({ couplingId: row.couplingId, kind }))) continue;
        const violation = unreachableDeskViolation(row, kind);
        if (violation) offenders.push(violation);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('NEGATIVE CONTROLS: the FORBID refuses the unreachable and admits the reachable', () => {
    // Guard-the-guard. The predicate above is only worth its greenness if it can
    // say no — and only worth its noes if it can still say yes. `envoy_home` is a
    // real kind whose token routes to `events` and whose envoy_registry files it
    // at `adjudication`, so all four probes below differ by ONE element.
    const probe = (intendedDesk, deskAuthority) => ({
      couplingId: 'CPL-5.WAR_TO_GRAMMAR.CW-1.synthetic_probe',
      intendedDesk,
      kinds: ['envoy_home'],
      ...(deskAuthority ? { deskAuthority } : {}),
    });
    // (a) POSITIVE TWIN — the authority really files envoy_home at adjudication.
    expect(unreachableDeskViolation(probe('adjudication', 'envoy_registry'), 'envoy_home')).toBeNull();
    // (b) the token desk is still reachable without naming any authority at all.
    expect(unreachableDeskViolation(probe('events', null), 'envoy_home')).toBeNull();
    // (c) A DESK NEITHER PATH REACHES — the row claims faith and nothing files there.
    expect(unreachableDeskViolation(probe('faith', 'envoy_registry'))).not.toBeNull();
    expect(unreachableDeskViolation(probe('faith', 'envoy_registry'), 'envoy_home'))
      .toContain("claims desk 'faith', which it cannot reach");
    // (d) THE JOIN IS PER-KIND, NOT PER-WORD: naming a real authority that does not
    // govern this kind buys nothing. Without this the field would be a password.
    expect(unreachableDeskViolation(probe('adjudication', 'war_coalition_registry'), 'envoy_home'))
      .toContain("claims desk 'adjudication', which it cannot reach");
    // (e) and naming NO authority leaves adjudication unreachable, which is the
    // original falsified premise, now asserted rather than assumed.
    expect(unreachableDeskViolation(probe('adjudication', null), 'envoy_home')).not.toBeNull();
  });
});

describe('CW-0w desk walker — the disputed register (shrink-only)', () => {
  test('every scanned kind is accounted for: agreeing, or a KNOWN dispute', () => {
    // The escape this closes: a row whose kinds disagree could simply not declare
    // `kinds` and vanish from the agreement test above. The receiptField scan sees
    // it anyway — and all four surviving disputes are scanned-only kinds, which is
    // exactly why this arm is the one that holds them.
    const unaccounted = [];
    for (const row of COUPLING_REGISTRY) {
      for (const kind of scannedKindsOf(row)) {
        if (agreementPathOf(row, kind)) continue;
        if (DISPUTED_KEYS.has(disputedKey({ couplingId: row.couplingId, kind }))) continue;
        unaccounted.push(`${row.couplingId}: '${kind}' files at '${filingDeskOf(row, kind)}'`
          + ` against desk '${row.intendedDesk}' and is neither agreeing (by token or by`
          + ' authority) nor a recorded dispute.');
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
      if (row.intendedDesk !== entry.desk || filingDeskOf(row, entry.kind) !== entry.filesAt) {
        stale.push(`${entry.couplingId}/'${entry.kind}' moved: desk '${row.intendedDesk}'`
          + ` (frozen '${entry.desk}') files at '${filingDeskOf(row, entry.kind)}' (frozen`
          + ` '${entry.filesAt}'). If the dispute is RESOLVED, delete the entry so the win`
          + ' is banked.');
        continue;
      }
      if (agreementPathOf(row, entry.kind)) {
        stale.push(`${entry.couplingId}/'${entry.kind}' AGREES now — DELETE the entry.`);
      }
    }
    expect(stale).toEqual([]);
    // The register may not carry a phantom: each entry names a real live
    // disagreement, proven above, and the count is frozen so it cannot grow
    // silently while individual rows churn. Eleven at slice 3; FOUR after the
    // CR-FP-1 ruling resolved the whole adjudication family.
    expect(DISPUTED).toHaveLength(4);
    expect(new Set(DISPUTED.map(disputedKey)).size).toBe(DISPUTED.length);
  });
});
