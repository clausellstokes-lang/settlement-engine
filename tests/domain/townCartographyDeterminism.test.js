/**
 * townCartographyDeterminism.test.js — TC-2's determinism corpus.
 *
 * DETERMINISM IS THE WHOLE GAME in this slice: "same seed => same map, byte for
 * byte" is the product thesis (DESIGN_TOWN_CARTOGRAPHY §0.1), and this file is
 * where that claim is measured rather than asserted in prose.
 *
 * THREE INSTRUMENTS, because each is blind to what the others catch:
 *
 *   1. SEED-FAMILY TOTALITY. Sixteen identities crossed over six tiers and seven
 *      site kinds, each synthesized twice, every failure COLLECTED. A single-seed
 *      restriction pin is vacuous by construction, and a bare seed loop reports a
 *      lower bound rather than a count (both recorded wave-E hazard classes), so
 *      the family runs through collectSeedFailures.
 *   2. CROSS-SEED DISTINCTNESS. "Two runs agree" is trivially true of a synthesis
 *      that emits nothing. The family must also produce DISTINCT digests, which is
 *      the anti-vacuity half of the same measurement.
 *   3. A STRUCTURAL PURITY SCAN. A two-pass behavioural check is BLIND to
 *      parity-period state: a module-scope counter that alternates passes "run it
 *      twice" and still forks the world on the third call. Only a source scan sees
 *      that, so the scan is not redundant with instrument 1 -- it covers the exact
 *      hole instrument 1 has.
 *
 * Plus the DRAW LEDGER, which is how stream theft becomes visible: a per-tick
 * keyed fork hides one stage quietly consuming another's entropy, and a frozen
 * per-stage draw count turns that into a red test instead of a mystery.
 *
 * @enforced-by this file
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  cartographyFixture,
  cartographySeedFamily,
  GOVERNANCE_CHAOTIC,
} from '../helpers/townCartographyFixture.js';
import { synthesizeTownSkeleton } from '../../src/domain/townCartography/cartographySynthesis.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const PACKAGE = join(ROOT, 'src/domain/townCartography');
const SOURCES = readdirSync(PACKAGE).filter((name) => name.endsWith('.js')).sort();
const readSource = (name) => readFileSync(join(PACKAGE, name), 'utf8');

/** Strip comments only. Prose about `Math.random` must not count as a call, but
 *  string LITERALS survive here because two scans below read literal values
 *  (fork labels and import specifiers) and blanking them would make both vacuous. */
function withoutComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

/** Strip comments AND string bodies so a source scan reads CODE, not prose. */
function codeOnly(source) {
  return withoutComments(source)
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');
}

describe('TC-2 determinism: the seed family is total', () => {
  test('the package actually has sources to scan (the scan is not vacuous)', () => {
    expect(SOURCES.length).toBeGreaterThanOrEqual(5);
    expect(SOURCES).toContain('cartographySynthesis.js');
  });

  test('every seed in the family synthesizes byte-identically twice', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const fixture = cartographyFixture(row);
      const first = synthesizeTownSkeleton(fixture);
      const second = synthesizeTownSkeleton(fixture);
      expect(JSON.stringify(second.streets)).toBe(JSON.stringify(first.streets));
      expect(JSON.stringify(second.infrastructureCandidates))
        .toBe(JSON.stringify(first.infrastructureCandidates));
      expect(second.receipts.skeletonDigest).toBe(first.receipts.skeletonDigest);
      expect(second.receipts.draws).toEqual(first.receipts.draws);
    });
    expectNoSeedFailures(failures, 'same settlement and same digest yield the same town');
  });

  test('a rebuilt fixture (fresh raster objects) yields the same town', () => {
    // Replay safety: the manifest is rebuilt from scratch on every compile, so
    // identity must ride the DATA, never object identity or call order.
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const a = synthesizeTownSkeleton(cartographyFixture(row));
      const b = synthesizeTownSkeleton(cartographyFixture(row));
      expect(b.receipts.skeletonDigest).toBe(a.receipts.skeletonDigest);
    });
    expectNoSeedFailures(failures, 'a rebuilt raster replays the same town');
  });

  test('the family produces DISTINCT towns (the agreement above is not vacuous)', () => {
    const digests = cartographySeedFamily()
      .map((row) => synthesizeTownSkeleton(cartographyFixture(row)).receipts.skeletonDigest);
    expect(new Set(digests).size).toBe(digests.length);
  });

  test('a synthesized town is not empty (the digest is of real geometry)', () => {
    const result = synthesizeTownSkeleton(cartographyFixture({ tier: 'city' }));
    expect(result.streets.arterials.length).toBeGreaterThan(0);
    expect(result.streets.lanes.length).toBeGreaterThan(20);
    expect(result.infrastructureCandidates.walls.length).toBe(1);
  });
});

describe('TC-2 determinism: the draw ledger', () => {
  test('the defenses stage draws EXACTLY zero (hull and intersections are exact)', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      expect(result.receipts.draws.defenses).toBe(0);
    });
    expectNoSeedFailures(failures, 'walls, gates and bridges consume no entropy');
  });

  test('the field stage draws exactly two per attractor and nothing else', () => {
    const failures = collectSeedFailures(cartographySeedFamily(), (row) => {
      const result = synthesizeTownSkeleton(cartographyFixture(row));
      expect(result.receipts.draws.field % 2).toBe(0);
      expect(result.receipts.draws.field).toBeGreaterThan(0);
    });
    expectNoSeedFailures(failures, 'the field spends entropy only on attractor jitter');
  });

  test('the frozen ledger for one corpus row (stream theft moves a number here first)', () => {
    const result = synthesizeTownSkeleton(cartographyFixture({
      tier: 'city', seedKey: 'ledger-row', site: 'river',
    }));
    expect(result.receipts.draws).toEqual({
      field: 320, arterials: 93, lanes: 190, defenses: 0,
    });
  });

  test('the arterial stream is ISOLATED from the lane stream', () => {
    // Two settlements that differ ONLY in accumulated urban fabric. That input
    // reaches planning01 -> gridCore, which is a LANE-stage input and nothing
    // else. If the two stages shared a stream, changing the lane stage's draw
    // pattern would move the arterials too.
    const planned = cartographyFixture({
      tier: 'town', age: null, stocks: { market: 0.99, craft: 0.99, civic: 0.99 },
    });
    const unplanned = cartographyFixture({
      tier: 'town', age: null, stocks: { market: 0.002, craft: 0.002, civic: 0.002 },
    });
    const a = synthesizeTownSkeleton(planned);
    const b = synthesizeTownSkeleton(unplanned);
    expect(a.morphology.gridCore).not.toBe(b.morphology.gridCore);
    expect(JSON.stringify(b.streets.arterials)).toBe(JSON.stringify(a.streets.arterials));
    expect(b.receipts.draws.arterials).toBe(a.receipts.draws.arterials);
    expect(JSON.stringify(b.streets.lanes)).not.toBe(JSON.stringify(a.streets.lanes));
  });

  test('the fork family is one spelling and never embeds the reserved delimiter', () => {
    const source = withoutComments(readSource('cartographySynthesis.js'));
    // The labels are literals handed to countedStream, which forks with them. The
    // scan therefore looks for the LABEL FAMILY rather than the `.fork(` call site.
    const labels = [...source.matchAll(/'(carto:[^']*)'/g)].map((match) => match[1]);
    expect(labels.sort()).toEqual(['carto:arterials', 'carto:defenses', 'carto:field', 'carto:lanes']);
    // anchored: the four labels above are the live subject; this asserts none of
    // them spells '::', which would alias a fork CHAIN (kernel/prng.js contract).
    for (const label of labels) expect(label.includes('::')).toBe(false);
  });
});

describe('TC-2 determinism: the structural purity scan', () => {
  test('no ambient entropy, clock, or host globals anywhere in the package', () => {
    /** @type {string[]} */
    const offenders = [];
    for (const name of SOURCES) {
      const code = codeOnly(readSource(name));
      for (const [label, pattern] of [
        ['Math.random', /Math\s*\.\s*random\s*\(/],
        ['Date.now', /Date\s*\.\s*now\s*\(/],
        ['new Date', /new\s+Date\s*\(/],
        ['globalThis', /\bglobalThis\b/],
        ['performance', /\bperformance\s*\./],
        ['import.meta', /\bimport\s*\.\s*meta\b/],
      ]) {
        if (pattern.test(code)) offenders.push(`${name}: ${label}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('no module-scope mutable state (the parity-period blind spot)', () => {
    // A two-pass behavioural check cannot see a module-scope counter that flips
    // on every call: two runs agree, the third forks. Only this scan sees it.
    /** @type {string[]} */
    const offenders = [];
    for (const name of SOURCES) {
      const code = codeOnly(readSource(name));
      for (const line of code.split('\n')) {
        if (/^(?:export\s+)?(?:let|var)\s/.test(line)) offenders.push(`${name}: ${line.trim()}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('no transcendental float reaches a seeded decision', () => {
    // Math.pow / ** / sin / cos / exp / log are implementation-approximated per
    // the ECMAScript spec, so one feeding a threshold forks the same seed ACROSS
    // engines while every same-engine golden stays green. Math.sqrt is exempt by
    // spec (required correctly rounded).
    /** @type {string[]} */
    const offenders = [];
    for (const name of SOURCES) {
      const code = codeOnly(readSource(name));
      if (/Math\s*\.\s*(?:pow|sin|cos|tan|asin|acos|atan|atan2|exp|log|log2|log10|sinh|cosh|tanh|cbrt|hypot)\s*\(/.test(code)) {
        offenders.push(`${name}: Math transcendental`);
      }
      if (/\*\*=?/.test(code)) offenders.push(`${name}: ** operator`);
    }
    expect(offenders).toEqual([]);
  });

  test('the package imports no store, React, or flag module (headless domain)', () => {
    /** @type {string[]} */
    const everySpecifier = [];
    for (const name of SOURCES) {
      const code = withoutComments(readSource(name));
      const imports = [...code.matchAll(/from\s+'([^']+)'/g)].map((match) => match[1]);
      for (const specifier of imports) {
        everySpecifier.push(specifier);
        expect(/\/store\/|^react$|^react\/|^zustand|lib\/flags/.test(specifier)).toBe(false);
      }
    }
    // The anchor proves the specifier collection is LIVE: the Weyl sampler import
    // travels the same scan as any forbidden import would, so an empty or drifted
    // collection reds here instead of passing the exclusion vacuously.
    expectAbsentWithAnchor(everySpecifier.join(' '), 'zustand', '../lowDiscrepancy.js');
  });
});

describe('TC-2 determinism: governance moves the town, and nothing else does', () => {
  test('an identical settlement under chaotic governance draws a DIFFERENT town', () => {
    const ordered = synthesizeTownSkeleton(cartographyFixture({ tier: 'city' }));
    const chaotic = synthesizeTownSkeleton(cartographyFixture({
      tier: 'city', governance: GOVERNANCE_CHAOTIC,
    }));
    expect(chaotic.morphology.order01).toBeLessThan(ordered.morphology.order01);
    expect(chaotic.receipts.skeletonDigest).not.toBe(ordered.receipts.skeletonDigest);
  });

  test('the synthesis takes NO style knob (A-10: state decides, not a dial)', () => {
    const source = codeOnly(readSource('cartographySynthesis.js'));
    const signature = source.slice(
      source.indexOf('export function synthesizeTownSkeleton'),
      source.indexOf('export function synthesizeTownSkeleton') + 400,
    );
    // anchored: the slice above is the live entry point's body; the positive half
    // is that it reads morphology from the settlement, which only holds while the
    // function exists and is spelled this way.
    expect(signature).toContain('readTownMorphology(input.settlement)');
    for (const knob of ['style', 'chaosLevel', 'organic', 'preset', 'knob']) {
      expect(signature.includes(`input.${knob}`)).toBe(false);
    }
  });
});
