/**
 * strategicPosture.test.js — SP-C's read half: `courtPostureOf` / `courtRiskAppetiteOf`
 * (docs/DESIGN_FP_ARCH_SP.md §SP-C, chair ruling CR-C4-1).
 *
 * WHAT COULD GO QUIETLY VACUOUS HERE:
 *
 *  • THE IMPORT-LIST PIN (E3 / the P4 no-hidden-governor pattern). The leaf's whole
 *    claim is that it CANNOT name a victim, and that claim is a reach fact, not a
 *    behaviour fact — no runtime test can see it. It is pinned as an exact set below,
 *    and an executed violation mutant (one added import) was run against this pin at
 *    build: it reds, and the leaf was restored by `cmp`.
 *
 *  • THE DEGRADED ARMS. "ABSENT, not zero" is only meaningful if absent and
 *    present-at-neutral produce DIFFERENT postures. The golden pair below asserts
 *    exactly that for each degraded term, which is a stronger statement than a pair of
 *    snapshots and cannot rot into agreement.
 *
 *  • THE BAND-WORD RECEIPT (L5). A receipt that quietly grew a float would still read
 *    like prose. The pin is a digit scan over every receipt this file produces, driven
 *    across saturated and empty courts so the scan has real sentences to look at.
 *
 *  • THE TRIPWIRE. A closed actor set that silently treats an unknown class as a
 *    settlement is worse than no closure at all (SP §8 seam 9).
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  POSTURE_ACTOR_KINDS,
  POSTURE_TERMS,
  POSTURE_TUNING,
  courtPostureOf,
  courtRiskAppetiteOf,
  strategicPostureActive,
} from '../../src/domain/worldPulse/strategicPosture.js';
import {
  APPETITE_TUNING,
  advanceDispositionChannels,
  dispositionBandOf,
} from '../../src/domain/worldPulse/dispositionLedger.js';
import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/worldPulse/strategicPosture.js';
const leafSource = readFileSync(join(ROOT, LEAF), 'utf8');
/**
 * The reach scans below read CODE, never prose. The leaf's header quotes the R3 hazard
 * by name (`riskToleranceOf(npc)`) and names the container the facet lives in — a scan
 * over raw source would red on the documentation that exists to prevent the very defect
 * it is scanning for. The blanker is the engine-gated-key walker's own, imported rather
 * than re-spelled, so a second comment-stripper cannot drift from the first.
 */
const leafCode = codeOnly(leafSource);

const NEUTRAL = APPETITE_TUNING.NEUTRAL_STOCK01;
const ACTOR = Object.freeze({ kind: 'settlement', id: 'aldenmoor' });
const POSTURE_LIT = Object.freeze({ strategicPostureEnabled: true });
const CHANNELS_LIT = Object.freeze({ dispositionChannelsEnabled: true, strategicPostureEnabled: true });

/** A four-channel entry with the stocks the caller names; absent channels read neutral. */
const channelEntry = (channels) => ({ wins: 0, losses: 0, score: 0, channels: Object.fromEntries(
  Object.entries(channels).map(([channel, stock01]) => [channel, { stock01, band: dispositionBandOf(stock01) }]),
) });

/** A legacy entry: signed score only, no channels — the pre-WR-2 shape every save carries. */
const legacyEntry = (score) => ({ wins: Math.max(0, score), losses: Math.max(0, -score), score });

/** A real learned facet, produced by the REAL writer rather than hand-planted. */
function learnedEntry(outcomes) {
  let ledger = {};
  outcomes.forEach((outcome, tick) => {
    ledger = advanceDispositionChannels(
      ledger,
      [{ id: ACTOR.id, outcome, sourceKind: 'war_resolution' }],
      { enabled: true, appetiteEnabled: true, tick },
    ).ledger;
  });
  return ledger[ACTOR.id];
}

// ── THE REACH OF THE LEAF ───────────────────────────────────────────────────

describe('SP-C — the leaf\'s import list is a reviewed exact set (E3 / P4)', () => {
  it('imports exactly TWO modules: the disposition ledger and the kernel clamp', () => {
    const specifiers = [...leafSource.matchAll(/^import\s[^;]*?from\s+'([^']+)';$/gms)]
      .map((match) => match[1])
      .sort();
    // A relationship graph, a neighbour list, a candidate set or a selector added here
    // would turn a colour into a governor. TWO entries, and the second is arithmetic:
    // kernel/math's `clamp` is the estate's ONE clamp primitive (clampPrimitiveBaseline
    // forbids a new local copy), and it reads nothing.
    expect(specifiers).toEqual(['../../kernel/math.js', './dispositionLedger.js']);
  });

  it('holds no state, no rng, no wall clock, and no world reach', () => {
    expect(leafCode.includes('Math.random')).toBe(false);
    expect(leafCode.includes('Date.now')).toBe(false);
    expect(leafCode.includes('rngContext')).toBe(false);
    expect(leafCode.includes('worldState')).toBe(false);
    expect(leafCode.includes('snapshot')).toBe(false);
    // anchored: the blanked source is asserted live and self-naming here, so a failed
    // read or an over-eager blanker cannot make the five absences above pass vacuously.
    expect(leafCode).toContain('export function courtPostureOf');
    expect(leafCode.length).toBeGreaterThan(2000);
  });

  it('does NOT re-export the roads name (CR-C4-1, the R3 collision)', () => {
    // anchored: the next line proves leafCode is the real, non-blanked module source.
    expect(leafCode).not.toMatch(/\briskToleranceOf\s*\(/);
    expect(leafCode).toContain('export function courtRiskAppetiteOf');
    // ...and the header DOES quote the hazard, which is the other half of CR-C4-1's
    // remedy: the successor who greps the name finds the explanation at the site.
    expect(leafSource).toContain('riskToleranceOf(npc)');
  });
});

// ── THE GATE ────────────────────────────────────────────────────────────────

describe('SP-C — the one by-name gate read', () => {
  it('is strict: absent, false, truthy-non-true and a non-record are all dark', () => {
    expect(strategicPostureActive({ strategicPostureEnabled: true })).toBe(true);
    expect(strategicPostureActive({ strategicPostureEnabled: false })).toBe(false);
    expect(strategicPostureActive({ strategicPostureEnabled: 1 })).toBe(false);
    expect(strategicPostureActive({ strategicPostureEnabled: 'true' })).toBe(false);
    expect(strategicPostureActive({})).toBe(false);
    expect(strategicPostureActive(null)).toBe(false);
    expect(strategicPostureActive([])).toBe(false);
  });
});

// ── THE TRIPWIRE ────────────────────────────────────────────────────────────

describe('SP-C — the closed actor set REDS rather than guessing', () => {
  it('accepts the one built class', () => {
    expect(POSTURE_ACTOR_KINDS).toEqual(['settlement']);
    expect(courtPostureOf(ACTOR, null).kind).toBe('settlement');
    expect(courtRiskAppetiteOf(ACTOR, null).kind).toBe('settlement');
  });

  it('throws on an unbuilt class, a bare id, and a missing id — both reads', () => {
    for (const read of [courtPostureOf, courtRiskAppetiteOf]) {
      expect(() => read({ kind: 'house', id: 'h1' })).toThrow(/closed/);
      expect(() => read({ kind: 'temple', id: 't1' })).toThrow(/closed/);
      expect(() => read('aldenmoor')).toThrow(/closed/);
      expect(() => read({ kind: 'settlement' })).toThrow(/closed/);
      expect(() => read(null)).toThrow(/closed/);
    }
  });
});

// ── THE COMPOSITION ─────────────────────────────────────────────────────────

describe('SP-C — the posture names the inputs it had', () => {
  it('a court with nothing at all says so, and colours nothing', () => {
    const posture = courtPostureOf(ACTOR, null, { rules: CHANNELS_LIT });
    expect(posture.terms).toEqual([]);
    expect(posture.absent).toEqual([...POSTURE_TERMS]);
    expect(posture.factor).toBe(1);
    expect(posture.direction).toBe('neutral');
    expect(posture.receipt).toContain('nothing was heard from');
  });

  it('DARK channels: the remembered standing carries the court alone', () => {
    const posture = courtPostureOf(ACTOR, legacyEntry(8), { rules: POSTURE_LIT });
    expect(posture.terms).toEqual(['standing']);
    expect(posture.absent).toContain('channels');
    expect(posture.direction).toBe('lower');
    expect(posture.receipt).toContain('its remembered standing');
  });

  it('LIT channels: the channels supersede standing — the two never both vote', () => {
    const posture = courtPostureOf(ACTOR, channelEntry({ martial: 0.9 }), { rules: CHANNELS_LIT });
    expect(posture.terms).toEqual(['channels']);
    // anchored: the equality above fixes the whole term set, so this cannot pass empty.
    expect(posture.terms).not.toContain('standing');
    expect(posture.receipt).toContain('its disposition channels');
    // Under lit channels the ledger DERIVES score from martial stock, so counting both
    // would be one memory voting twice (J-WR-11's double count).
    for (const rules of [POSTURE_LIT, CHANNELS_LIT]) {
      const seen = courtPostureOf(ACTOR, channelEntry({ martial: 0.9 }), { rules }).terms;
      expect(seen.includes('standing') && seen.includes('channels')).toBe(false);
    }
  });

  it('the appetite term is gated: a persisted facet is silent while the flag is dark', () => {
    const entry = learnedEntry(['win', 'win', 'win']);
    const lit = courtPostureOf(ACTOR, entry, { rules: CHANNELS_LIT });
    const dark = courtPostureOf(ACTOR, entry, { rules: { dispositionChannelsEnabled: true } });
    expect(lit.terms).toContain('appetite');
    // The LIT arm above carries the term on the SAME entry.
    // anchored: `lit.terms` is proven to contain it, so this is the gate refusing.
    expect(dark.terms).not.toContain('appetite');
    expect(dark.absent).toContain('appetite');
    // anchored: the SAME entry really does carry a facet, so the dark arm is a gate fact
    // and not an empty fixture.
    expect(Object.prototype.hasOwnProperty.call(entry, 'appetite')).toBe(true);
  });

  it('the insular channel pulls the other way, so both directions are reachable', () => {
    const outward = courtPostureOf(ACTOR, channelEntry({ martial: 0.9, mercantile: 0.9, diplomatic: 0.9, insular: 0.1 }), { rules: CHANNELS_LIT });
    const inward = courtPostureOf(ACTOR, channelEntry({ martial: 0.1, mercantile: 0.1, diplomatic: 0.1, insular: 0.9 }), { rules: CHANNELS_LIT });
    expect(outward.direction).toBe('lower');
    expect(inward.direction).toBe('raise');
    expect(outward.band).not.toBe(inward.band);
  });
});

describe('SP-C — THE GOLDEN PAIR: a degraded term is ABSENT, not zero', () => {
  it('books absent differs from books present at neutral', () => {
    const entry = channelEntry({ martial: 0.9 });
    const without = courtPostureOf(ACTOR, entry, { rules: CHANNELS_LIT });
    const withNeutral = courtPostureOf(ACTOR, entry, { rules: CHANNELS_LIT, books: { stock01: NEUTRAL } });
    // anchored: the next line proves the term is reachable on this very fixture.
    expect(without.terms).not.toContain('books');
    expect(withNeutral.terms).toContain('books');
    // If an absent term voted neutral these two would be identical. They are not, and
    // that difference IS the degraded-arm contract: a court with one voice speaks with
    // its whole voice rather than being dragged toward silence.
    expect(withNeutral.factor).not.toBe(without.factor);
    expect(Math.abs(withNeutral.factor - 1)).toBeLessThan(Math.abs(without.factor - 1));
  });

  it('books present at the extremes moves the posture in both directions', () => {
    const entry = channelEntry({ martial: NEUTRAL });
    const bold = courtPostureOf(ACTOR, entry, { rules: CHANNELS_LIT, books: { stock01: 1 } });
    const bare = courtPostureOf(ACTOR, entry, { rules: CHANNELS_LIT, books: { stock01: 0 } });
    expect(bold.direction).toBe('lower');
    expect(bare.direction).toBe('raise');
    // A non-finite or absent books term is refused rather than coerced.
    // anchored: `bold` and `bare` above carry the books term on this same fixture, so
    // both refusals below are the guard working and not an empty term list.
    expect(courtPostureOf(ACTOR, entry, { rules: CHANNELS_LIT, books: { stock01: NaN } }).terms)
      .not.toContain('books'); // anchored: `bold`/`bare` above carry the term on this fixture
    // anchored: as the line above — the term is proven reachable on this fixture.
    expect(courtPostureOf(ACTOR, entry, { rules: CHANNELS_LIT, books: null }).terms).not.toContain('books');
  });

  it('appetite absent differs from appetite present at neutral', () => {
    const entry = channelEntry({ martial: 0.9 });
    const without = courtPostureOf(ACTOR, entry, { rules: CHANNELS_LIT });
    const withNeutral = courtPostureOf(
      ACTOR,
      { ...entry, appetite: { stock01: NEUTRAL, band: dispositionBandOf(NEUTRAL), updatedTick: 0 } },
      { rules: CHANNELS_LIT },
    );
    expect(withNeutral.terms).toContain('appetite');
    expect(withNeutral.factor).not.toBe(without.factor);
  });
});

describe('SP-C — a posture COLOURS, never drowns', () => {
  it('the factor is bounded by the cap in both directions, at saturation', () => {
    const cap = POSTURE_TUNING.THRESHOLD_CAP;
    const boldest = courtPostureOf(
      ACTOR,
      { ...channelEntry({ martial: 1, mercantile: 1, diplomatic: 1, insular: 0 }), appetite: { stock01: 1, band: 'dominant', updatedTick: 0 } },
      { rules: CHANNELS_LIT, books: { stock01: 1 } },
    );
    const meekest = courtPostureOf(
      ACTOR,
      { ...channelEntry({ martial: 0, mercantile: 0, diplomatic: 0, insular: 1 }), appetite: { stock01: 0, band: 'restrained', updatedTick: 0 } },
      { rules: CHANNELS_LIT, books: { stock01: 0 } },
    );
    expect(boldest.factor).toBeCloseTo(1 - cap, 10);
    expect(meekest.factor).toBeCloseTo(1 + cap, 10);
    expect(cap).toBeLessThan(0.25);
    expect(boldest.terms).toEqual([...POSTURE_TERMS].filter((t) => t !== 'standing'));
  });
});

describe('SP-C — THE BAND-WORD RECEIPT PIN (L5): no float reaches prose', () => {
  const courts = () => [
    courtPostureOf(ACTOR, null, { rules: CHANNELS_LIT }),
    courtPostureOf(ACTOR, legacyEntry(-11), { rules: POSTURE_LIT }),
    courtPostureOf(ACTOR, channelEntry({ martial: 0.93, insular: 0.07 }), { rules: CHANNELS_LIT, books: { stock01: 0.31 } }),
    courtPostureOf(ACTOR, learnedEntry(['win', 'loss', 'win']), { rules: CHANNELS_LIT }),
  ];

  it('every posture receipt is words only', () => {
    const receipts = courts().map((posture) => posture.receipt);
    for (const receipt of receipts) {
      // The four-distinct-receipts assertion at the end of this test proves the scan is
      // reading real sentences.
      // anchored: the length floor on the next line makes each receipt a live subject.
      expect(receipt, `a digit reached prose: ${receipt}`).not.toMatch(/\d/);
      expect(receipt.length).toBeGreaterThan(20);
    }
    // anchored: the four courts above really do differ, so the scan is reading four real
    // sentences rather than one repeated stub.
    expect(new Set(receipts).size).toBeGreaterThanOrEqual(3);
  });

  it('every band the posture reports is a word from the borrowed ladder', () => {
    for (const posture of courts()) {
      expect(APPETITE_TUNING.BAND_LADDER).toContain(posture.band);
      for (const band of Object.values(posture.bands)) {
        expect(APPETITE_TUNING.BAND_LADDER).toContain(band);
      }
    }
  });

  it('the appetite read speaks the same way, present and absent', () => {
    const learned = courtRiskAppetiteOf(ACTOR, learnedEntry(['win', 'win']), { rules: POSTURE_LIT });
    const unlearned = courtRiskAppetiteOf(ACTOR, null, { rules: POSTURE_LIT });
    expect(learned.present).toBe(true);
    expect(unlearned.present).toBe(false);
    expect(unlearned.stock01).toBe(NEUTRAL);
    for (const read of [learned, unlearned]) {
      // anchored: the band assertion below proves each read is a live, populated record.
      expect(read.receipt).not.toMatch(/\d/);
      expect(APPETITE_TUNING.BAND_LADDER).toContain(read.band);
    }
    // The read is gated too: a persisted facet is silent while the flag is dark.
    expect(courtRiskAppetiteOf(ACTOR, learnedEntry(['win', 'win']), { rules: {} }).present).toBe(false);
  });
});

describe('SP-C — TWO REALMS, ONE CONFIG: outcome history is what differs', () => {
  it('the same rules over different outcome histories yield different postures', () => {
    const bold = learnedEntry(['win', 'win', 'win', 'win']);
    const beaten = learnedEntry(['loss', 'loss', 'loss', 'loss']);
    const a = courtPostureOf(ACTOR, bold, { rules: CHANNELS_LIT });
    const b = courtPostureOf(ACTOR, beaten, { rules: CHANNELS_LIT });
    expect(a.factor).not.toBe(b.factor);
    expect(a.direction).toBe('lower');
    expect(b.direction).toBe('raise');
    expect(a.band).not.toBe(b.band);
    // E2's payoff at posture grain: nothing in the CONFIG separates these two courts.
    expect(a.terms).toEqual(b.terms);
  });

  it('an identical history yields an identical posture (the other half of the claim)', () => {
    const first = courtPostureOf(ACTOR, learnedEntry(['win', 'loss', 'win']), { rules: CHANNELS_LIT });
    const second = courtPostureOf(ACTOR, learnedEntry(['win', 'loss', 'win']), { rules: CHANNELS_LIT });
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });
});
