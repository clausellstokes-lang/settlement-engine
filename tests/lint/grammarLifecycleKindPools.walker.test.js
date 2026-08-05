/**
 * grammarLifecycleKindPools.walker.test.js — GR-0's phrased-kind walker.
 *
 * The census of the pact grammar's lifecycle voice: the exact seven wired pools, their
 * frequency-scaled depth, their annex-verbatim text, the per-pool slot roles (one of them
 * INVERTED), the two Herald kinds' five joins, and the two pools this wave deliberately
 * did NOT wire. It certifies presentation width only; it is not behavioural soak evidence.
 *
 * THE READER IS THE SHARED ONE. tests/helpers/receiptAnnex.js was EXTENDED with the
 * GRAMMAR volume's address rather than forked, per the census's binding obligation (1):
 * the address-lie and first-match defects live in the reader, so a second volume that
 * hand-rolled its own indexOf slicing would re-open both.
 *
 * THE MOLD, NOT THE TOKEN. L7's mold-conformance warning is this program's own
 * eighty-nine-percent lesson: a substring pin cannot see grammar. Every rendered line is
 * therefore checked against the annex VERBATIM (equality, not containment) and against the
 * house sentence's shape — capitalised, terminally punctuated, digit-free, token-free.
 *
 * THE TWO DELIBERATE ABSENCES ARE PINNED, NOT REMEMBERED. `hollowed_quiet` (the DM-only
 * ending, Law One) and `treaty_priced_on_a_lie` (FP-INFORMATION's kind, GR seam 5) are
 * authored in the annex and unwired in code on purpose. A pin that only counted what
 * EXISTS would let either drift in silently; these assert the absence and name its owner.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { anchoredOnce, receiptAnnexPool, GRAMMAR_ANNEX_URL } from '../helpers/receiptAnnex.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import {
  EXACT_SECTION, KIND_SECTION_DIVERGENCES, SECTION_OF, isExplicitlyRouted,
} from '../../src/domain/realm/heraldRouting.js';
import { KIND_SECTION } from '../../src/domain/display/chroniclersLetter.js';
import {
  DEFAULT_GRAMMAR_SLOT_ROLES, GRAMMAR_HERALD_KINDS, GRAMMAR_KINDS,
  GRAMMAR_KIND_REGISTRY, GRAMMAR_SLOT_ROLES, grammarReceipt, grammarSlotRoles,
} from '../../src/domain/worldPulse/grammarNews.js';
import { PACT_ENDINGS } from '../../src/domain/worldPulse/treatyLifecycleVoice.js';

/** kind, significance, audience, desk (null = rendered into another surface), depth. */
const EXPECTED = Object.freeze([
  ['treaty_lapsed', 'notable', 'public', 'trade', 7],
  ['treaty_lapsed.road_open', 'n/a', 'public', null, 7],
  ['treaty_default_detected', 'notable', 'public', 'trade', 7],
  ['treaty_age_line', 'n/a', 'public', null, 8],
  ['treaty_true_state_chip', 'n/a', 'dm-only', null, 8],
  ['ran_its_term', 'routine', 'public', null, 8],
  ['hollowed_detected', 'notable', 'public', null, 7],
]);

/** SP-6's frequency-scaled floor. The `n/a` class is a DECLARED floor of six: a dossier
 *  line or a DM chip is met as often as a notable kind even though it files no desk. */
const FLOOR_BY_SIGNIFICANCE = Object.freeze({ routine: 8, notable: 6, major: 4, 'n/a': 6 });

const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Irontown',
  band: 'a great many',
  term: 'tribute',
  route: 'North Road',
});

const ANNEX_SOURCE = readFileSync(GRAMMAR_ANNEX_URL, 'utf8');

/**
 * The context a caller of THIS pool always supplies. Strict gating is the house rule
 * (fail closed), so a pool carrying gated families must be driven with one of its own
 * declared contexts — driving it with `null` would exclude every gated family and make an
 * absence pin below pass for the wrong reason. `null` for a pool nothing gates.
 */
const rowDefaultContext = (row) => [...new Set(row.contexts.flatMap((c) => c || []))][0] ?? null;

/** The first seed that reaches `templateIndex` under `context`, or '' when none does. */
function seedReaching(row, templateIndex, context) {
  const familyId = `${row.kind}.${templateIndex + 1}`;
  return Array.from({ length: 900 }, (_, index) => `mold:${index}`)
    .find((seed) => grammarReceipt(row.kind, seed, INTERP, context)?.familyId === familyId) || '';
}
const SECTION = '# GR-0';
const UNTIL = '# GR-1';

function annexPool(kind) {
  return receiptAnnexPool(kind, { source: ANNEX_SOURCE, section: SECTION, until: UNTIL, interp: INTERP });
}
const annexLines = (kind) => annexPool(kind).lines;

describe('SP-6 phrased-kind registry — GR-0 the lifecycle voice', () => {
  test('the seven-pool census and every registry field are exact', () => {
    expect(GRAMMAR_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(GRAMMAR_KIND_REGISTRY).toHaveLength(7);
    for (const [kind, significance, audience, section, depth] of EXPECTED) {
      const row = GRAMMAR_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(depth);
      expect(row.pool.length).toBeGreaterThanOrEqual(FLOOR_BY_SIGNIFICANCE[significance]);
      expect(row.requiredSlots).toHaveLength(depth);
      expect(row.contexts).toHaveLength(depth);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      // Every pool keeps at least one SLOTLESS family, so a receipt whose named evidence
      // is absent still has an honest authored sentence instead of a fabricated name.
      expect(row.requiredSlots.some((slots) => slots.length === 0)).toBe(true);
      // …and at least one CONTEXT-FREE family, so no context can empty a pool outright.
      expect(row.contexts.some((contexts) => contexts === null)).toBe(true);
    }
  });

  test.each(GRAMMAR_KIND_REGISTRY)('$kind is byte-identical to its authored annex block', (row) => {
    // THE TEMPLATE LAYER is annex-VERBATIM: the pool renders byte-identically to the
    // authored block, with no normalization in between. A hand edit here reds.
    const rendered = row.pool.map((variant) => (
      typeof variant === 'function' ? String(variant(INTERP)) : String(variant)));
    expect(rendered).toEqual(annexLines(row.kind));
    expect(new Set(rendered).size).toBe(row.pool.length);
    // THE RENDER LAYER carries the house mold. These are separate claims on purpose: one
    // authored family opens with a slot, so the reader's sentence and the annex's template
    // legitimately differ in ONE character, and collapsing the two checks would force a
    // corpus edit to satisfy a rendering rule.
    for (const [index, template] of rendered.entries()) {
      expect(template).toBe(template.trim());
      expect(template.length).toBeGreaterThan(20);
      const context = (row.contexts[index] || [rowDefaultContext(row)])[0];
      const line = grammarReceipt(row.kind, seedReaching(row, index, context), INTERP, context)?.line;
      expect(line, `${row.kind}.${index + 1}: unreachable`).toBeTruthy();
      // anchored: the line is pinned non-empty above, so every exclusion below is read
      // against a real sentence rather than satisfied by an empty string.
      expect(line[0]).toBe(line[0].toUpperCase());
      expect(line).toMatch(/[.!?]$/);
      expect(line).not.toMatch(/\d|%|×|_|\$\{|\{|\}|\bundefined\b|\bNaN\b/);
      expect(line).not.toMatch(/\b(?:rng|roll|score|ratio|tick|chance|probability|threshold|multiplier|schema|json|flag)\b/i);
      // The render differs from the template ONLY in leading case — nothing else is
      // normalized in, which is what keeps the corpus the single source of the words.
      expect(line.slice(1)).toBe(template.slice(1));
    }
  });

  test('every pool address resolves in the GRAMMAR volume, not a legacy forward', () => {
    const address = GRAMMAR_KINDS.map((kind) => annexPool(kind).from);
    expect(address).toHaveLength(7);
    expect([...new Set(address)]).toEqual(['war']);
  });

  test('THE FIRST-MATCH LAW: every document anchor this walker rides matches exactly once', () => {
    // An `exec`/`indexOf` document pin retargets SILENTLY when a second matching heading
    // appears (the CR-WR10-A/B hazard class). Both slice anchors and all seven kind
    // headings are asserted single here, and the mutants below prove the guard fires.
    expect(() => anchoredOnce(ANNEX_SOURCE, /^# GR-0(?=[ \n])/gm, 'GR-0 section')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^# GR-1(?=[ \n])/gm, 'terminator')).not.toThrow();
    for (const kind of GRAMMAR_KINDS) {
      const escaped = kind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      expect([...ANNEX_SOURCE.matchAll(new RegExp(`^### ${escaped}(?= )`, 'gm'))], `${kind}: heading count`)
        .toHaveLength(1);
    }
  });

  test('MUTANT — a duplicated section heading throws instead of retargeting the slice', () => {
    const doctored = `${ANNEX_SOURCE}\n# GR-0 — A SECOND HEADING NOBODY NOTICED\n`;
    expect(() => receiptAnnexPool('ran_its_term', {
      source: doctored, section: SECTION, until: UNTIL, interp: INTERP,
    })).toThrow(/expected exactly 1 match/);
  });

  test('MUTANT — a rotted kind heading throws instead of returning an empty pool', () => {
    const doctored = ANNEX_SOURCE.replace('### ran_its_term (GR-0)', '### ran_its_termX (GR-0)');
    // anchored: the UNdoctored source resolves this exact kind to eight lines two lines
    // below, so a reader that had stopped resolving anything would fail there rather than
    // let this throw-pin pass for the wrong reason.
    expect(() => receiptAnnexPool('ran_its_term', {
      source: doctored, section: SECTION, until: UNTIL, interp: INTERP,
    })).toThrow(/expected exactly 1 match/);
    expect(annexLines('ran_its_term')).toHaveLength(8);
  });

  test('⚠ THE PARTY BINDING INVERTS FOR EXACTLY ONE POOL, and it is named', () => {
    // Six pools are authored from the OWED court's side; the DM chip is authored from the
    // WITHHOLDING court's ("in fact {settlement} has sent less than it swore"). A uniform
    // binding would accuse the wrong court of quiet default — compiling, passing, and
    // exactly backwards. The inversion is declared by name, not discovered.
    expect(Object.keys(GRAMMAR_SLOT_ROLES)).toEqual(['treaty_true_state_chip']);
    expect(grammarSlotRoles('treaty_true_state_chip')).toEqual({ settlement: 'obligor', counterpart: 'obligee' });
    expect(DEFAULT_GRAMMAR_SLOT_ROLES).toEqual({ settlement: 'obligee', counterpart: 'obligor' });
    for (const kind of GRAMMAR_KINDS) {
      if (kind === 'treaty_true_state_chip') continue;
      expect(grammarSlotRoles(kind), `${kind}: unexpected inversion`).toBe(DEFAULT_GRAMMAR_SLOT_ROLES);
    }
    // NON-VACUITY: the two bindings must actually DISAGREE, or this test would pass just
    // as happily against a table whose every row equalled the default.
    expect(grammarSlotRoles('treaty_true_state_chip')).not.toEqual(DEFAULT_GRAMMAR_SLOT_ROLES);
  });

  test('THE FIVE JOINS: both Herald kinds are phrased, routed, filed and desk-consistent', () => {
    expect([...GRAMMAR_HERALD_KINDS]).toEqual(['treaty_lapsed', 'treaty_default_detected']);
    for (const kind of GRAMMAR_HERALD_KINDS) {
      // JOIN 3 — the world phrase, so no projection can fall back to an engine token.
      expect(WHAT_PHRASES[kind], `${kind}: missing WHAT_PHRASES`).toBeTruthy();
      // anchored: the toBeTruthy above pins the entry present and non-empty, so this
      // exclusion cannot be satisfied by an absent row.
      expect(WHAT_PHRASES[kind]).not.toMatch(/_/);
      // JOIN 4 — the section authority. Both file the TREATY COHORT's desk by their own
      // token, so no registry override is needed and none is claimed.
      expect(isExplicitlyRouted(kind), `${kind}: unrouted`).toBe(true);
      expect(EXACT_SECTION[kind]).toBe('trade');
      expect(SECTION_OF(kind)).toBe('trade');
      // JOIN 5 — the chronicler's letter files them beside the oathbreaking, and the
      // divergence from that section is RECORDED rather than silent.
      expect(KIND_SECTION[kind]).toBe('courts');
      expect(KIND_SECTION_DIVERGENCES[kind]).toBe('trade');
    }
    // The treaty cohort keeps ONE desk: the four kinds a reader meets as one story.
    for (const sibling of ['treaty_signed', 'treaty_breached']) {
      expect(SECTION_OF(sibling), `${sibling}: the cohort split`).toBe('trade');
    }
    // The non-Herald pools claim NO desk and take no WHAT_PHRASES row — a phrase for a
    // clause that is rendered INTO another beat would be vocabulary with no address.
    for (const row of GRAMMAR_KIND_REGISTRY.filter((r) => r.section === null)) {
      expect(WHAT_PHRASES[row.kind], `${row.kind}: claims a phrase it cannot address`).toBeUndefined();
    }
  });

  test('THE TWO DELIBERATE ABSENCES are authored in the annex and unwired in code', () => {
    // Both blocks EXIST in the corpus — read through the shared reader, so this cannot
    // pass by the headings having rotted away.
    expect(annexLines('hollowed_quiet')).toHaveLength(8);
    expect(annexLines('treaty_priced_on_a_lie')).toHaveLength(5);
    // …and neither is a wired pool. `hollowed_quiet` is Law One's: the public feed has no
    // per-key ground-truth projection, so its PROSE lands with GR-7's ground-truth
    // surface while its ENDING TOKEN lands here. `treaty_priced_on_a_lie` is GR seam 5's:
    // GR-0 lands the read, FP-INFORMATION wires the consumer and mints the kind.
    expect(GRAMMAR_KINDS).not.toContain('hollowed_quiet');
    expect(GRAMMAR_KINDS).not.toContain('treaty_priced_on_a_lie');
    expect(grammarReceipt('hollowed_quiet', 'seed', INTERP)).toBeNull();
    expect(grammarReceipt('treaty_priced_on_a_lie', 'seed', INTERP)).toBeNull();
    // The ending TOKEN is landed even though its prose is not — the deferral is of the
    // sentence, never of the vocabulary.
    expect(PACT_ENDINGS).toContain('hollowed_quiet');
    // And no orphan vocabulary rides in the other direction: no unrouted Herald claim.
    expect(WHAT_PHRASES.hollowed_quiet).toBeUndefined();
    expect(WHAT_PHRASES.treaty_priced_on_a_lie).toBeUndefined();
  });

  test.each(GRAMMAR_KIND_REGISTRY)(
    '$kind is deterministic and every structural family is reachable',
    (row) => {
      // Contexts are supplied per row so a context-gated family is reachable at all; the
      // union across the declared contexts must reach EVERY family in the pool.
      const contexts = [...new Set(row.contexts.flatMap((c) => c || [null]))];
      const reached = new Set();
      for (const context of contexts) {
        for (let index = 0; index < 1200; index += 1) {
          const receipt = grammarReceipt(row.kind, `gr-zero:${index}`, INTERP, context);
          if (receipt) reached.add(receipt.familyId);
        }
      }
      expect(reached.size, `${row.kind}: unreachable family`).toBe(row.pool.length);
      expect(grammarReceipt(row.kind, 'same', INTERP)).toEqual(grammarReceipt(row.kind, 'same', INTERP));
    },
  );

  test.each(GRAMMAR_KIND_REGISTRY)(
    '$kind skips a named family when its typed evidence is absent',
    (row) => {
      for (const [templateIndex, requiredSlots] of row.requiredSlots.entries()) {
        if (!requiredSlots.length) continue;
        const context = (row.contexts[templateIndex] || [rowDefaultContext(row)])[0];
        const familyId = `${row.kind}.${templateIndex + 1}`;
        const seed = Array.from({ length: 900 }, (_, index) => `slot:${index}`)
          .find((candidate) => grammarReceipt(row.kind, candidate, INTERP, context)?.familyId === familyId);
        expect(seed, `${familyId}: complete evidence reaches family`).toBeTruthy();
        const partial = { ...INTERP };
        for (const slot of requiredSlots) delete partial[slot];
        const fallback = grammarReceipt(row.kind, seed, partial, context);
        expect(fallback).toBeTruthy();
        expect(fallback.familyId).not.toBe(familyId);
        // The degraded receipt is a REAL authored sentence from this kind's own pool, not
        // a blank — which is the whole point of keeping slotless siblings — and the family
        // it fell back to asks only for evidence the caller still holds.
        expect(fallback.line.length).toBeGreaterThan(0);
        expect(row.requiredSlots[fallback.templateIndex].every((slot) => partial[slot])).toBe(true);
        // anchored: the fallback line is pinned non-empty and its family satisfiable above.
        expect(fallback.line).not.toMatch(/\bundefined\b|\bNaN\b/);
      }
    },
  );

  test('an unhonest CONTEXT can never draw its family, and unknown kinds stay closed', () => {
    // The context axis, proven to bite: variant 5 of the eulogy says "it kept every one of
    // them", which a hollowed ending must never be able to draw.
    const kept = 'It was written for a great many years and it kept every one of them; both courts let it go without a word.';
    expect(annexLines('treaty_lapsed')).toContain(kept);
    const hollowed = Array.from({ length: 1200 }, (_, index) => (
      grammarReceipt('treaty_lapsed', `hollow:${index}`, INTERP, 'hollowed_detected')?.line));
    expect(hollowed.every(Boolean)).toBe(true);
    expect(hollowed).not.toContain(kept);
    // NON-VACUITY: under the honest context the same family IS reachable, so the
    // exclusion above is a real filter rather than an unreachable family.
    const clean = Array.from({ length: 1200 }, (_, index) => (
      grammarReceipt('treaty_lapsed', `clean:${index}`, INTERP, 'ran_its_term')?.line));
    expect(clean).toContain(kept);
    expect(grammarReceipt('treaty_never_authored', 'seed', INTERP)).toBeNull();
  });
});
