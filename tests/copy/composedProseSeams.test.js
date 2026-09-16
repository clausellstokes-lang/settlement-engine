/**
 * composedProseSeams.test.js - the generator-side prose-seam shrink-only ratchet.
 *
 * WHAT IT CLOSES. proseLeak.test.js scans reader-facing COMPOSER output and
 * component JSX source, but it never looked at the RAW output of the settlement
 * GENERATOR pipeline (generateSettlementPipeline). That is exactly where the cold
 * review found the composed-prose seams: generator templates bake authoring
 * scaffolding into the strings they emit -
 *   - a leading ' PLOT HOOK: ' marker on economic/safety hooks (finding H2 on the
 *     display side; the generator-side marker retire is H5-adjacent T4 work);
 *   - doubled articles at seam joins, 'the the ...' / 'the The ...' (H6 / M3);
 *   - unfilled '{brace}' template tokens (H5);
 *   - a 'The The'-prefixed event name reused in a sentence (H7).
 * This guard regenerates a deterministic corpus (mirroring the generatorGoldenMaster
 * sweep), scans the RAW generator prose for each seam-defect class, and BANKS the
 * counts as a SHRINK-ONLY baseline. That makes the owner-gated ONE-REGEN debt
 * (H5/H6/H7/M1/M3/M4) VISIBLE and monotonically shrinking: when the generator-side
 * fixes land in the owner's ONE REGEN, the counts fall and the baseline is
 * re-banked in the same commit (the regen diff IS the shrink proof).
 *
 * DISPLAY VS SOURCE. Two of the four classes are neutralised at DISPLAY time by
 * the shared chokepoint src/lib/proseSeams.js (normalizePlotHook zeroes the
 * ' PLOT HOOK: ' class; collapseDoubledArticles zeroes the doubled-article class).
 * This file proves that neutralisation over the SAME corpus - so the reader never
 * sees these two even while the generator still emits them. The other two (brace
 * tokens, 'The The') have no display stripper and are pure T4 debt: banked and
 * watched, not claimed fixed.
 *
 * NOT double-counted: raw camelCase flag-key leakage in reader prose is owned by
 * proseLeak.test.js (its `flagKey` detector over composer output + JSX). It is a
 * different surface (advance-time chronicler letter, finding M1, owner-gated) and
 * is deliberately NOT re-asserted here.
 *
 * CORPUS. Reconstructed inline (tiers x cultures x terrains paired with a
 * terrain-honest route, plus a threat sweep, fixed seed) rather than imported from
 * tests/property/generatorGoldenMaster.test.js - importing that test module would
 * re-run its parked/red golden assertions here. Read-only corpus use: same
 * generator, same seed, an equivalent config sweep.
 *
 * RE-BANK (after an APPROVED generator-side change shifts the counts):
 *   UPDATE_PROSE_SEAMS_BASELINE=1 npx vitest run tests/copy/composedProseSeams.test.js
 * then review the diff before committing.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { normalizePlotHook, collapseDoubledArticles } from '../../src/lib/proseSeams.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const BASELINE_PATH = join(HERE, '.composed-prose-seams-baseline.json');
const UPDATE = process.env.UPDATE_PROSE_SEAMS_BASELINE === '1';

// ── The corpus (deterministic; mirrors the generatorGoldenMaster sweep) ───────
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'celtic', 'norse', 'mediterranean'];
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
const TERRAIN_ROUTE = { plains: 'road', hills: 'road', forest: 'isolated', riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road' };
const THREAT = ['safe', 'civilized', 'frontier', 'plagued'];
const SEED = 'golden-master-v3';

function corpusConfigs() {
  const base = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
  const rows = [];
  for (const settType of TIERS)
    for (const culture of CULTURES)
      for (const terrainOverride of TERRAINS)
        rows.push({ ...base, settType, culture, terrainOverride, tradeRouteAccess: TERRAIN_ROUTE[terrainOverride] });
  for (const monsterThreat of THREAT) rows.push({ ...base, monsterThreat });
  return rows;
}

/** Pull the RAW generator prose fields - the strings BEFORE any display-side
 *  chokepoint runs. This is the surface proseLeak never saw. */
function rawProse(settlement) {
  const out = [];
  const push = (v) => { if (typeof v === 'string' && v) out.push(v); };
  const hookText = (h) => (h && typeof h === 'object' ? (h.hook ?? h.text ?? '') : h);
  const ev = settlement?.economicViability;
  for (const h of ev?.plotHooks || []) push(hookText(h));
  for (const h of settlement?.economicState?.safetyProfile?.plotHooks || []) push(hookText(h));
  for (const t of settlement?.history?.currentTensions || []) {
    push(t?.description);
    for (const h of t?.plotHooks || []) push(hookText(h));
  }
  for (const e of settlement?.history?.historicalEvents || []) {
    push(e?.description);
    push(e?.name);
    for (const h of e?.plotHooks || []) push(hookText(h));
  }
  for (const n of settlement?.npcs || []) for (const h of n?.plotHooks || []) push(hookText(h));
  return out;
}

// ── Detectors: seam-defect CLASS → count in a string ──────────────────────────
const DETECTORS = {
  // Owned by the display chokepoint (normalizePlotHook / collapseDoubledArticles).
  plotHookPrefix: (t) => (t.match(/\bPLOT HOOK:/gi) || []).length,
  doubledArticle: (t) => (t.match(/\bthe\s+(?:the|a|an)\s+/gi) || []).length,
  // Pure T4 debt - no display stripper (H5 brace-fill, H7 'The The').
  braceToken: (t) => (t.match(/\{[a-z_][a-z0-9_]*\}/gi) || []).length,
  theThePrefix: (t) => (t.match(/\bThe The\b/g) || []).length,
};
const ZERO = { plotHookPrefix: 0, doubledArticle: 0, braceToken: 0, theThePrefix: 0 };

function countAll(strings) {
  const counts = { ...ZERO };
  for (const s of strings) for (const [k, fn] of Object.entries(DETECTORS)) counts[k] += fn(s);
  return counts;
}

// Generate + scan ONCE, memoized (the generation is the expensive part).
let _scan = null;
function scan() {
  if (_scan) return _scan;
  const strings = [];
  for (const cfg of corpusConfigs()) {
    const s = generateSettlementPipeline(cfg, null, { seed: SEED, customContent: {} });
    strings.push(...rawProse(s));
  }
  _scan = { strings, counts: countAll(strings) };
  return _scan;
}

if (UPDATE) {
  const { counts } = scan();
  writeFileSync(BASELINE_PATH, JSON.stringify(counts, null, 2) + '\n');
}

describe('composed prose seams - generator-output shrink-only ratchet', () => {
  it('the committed baseline exists (run UPDATE_PROSE_SEAMS_BASELINE=1 to create it)', () => {
    expect(
      existsSync(BASELINE_PATH),
      'baseline missing - for an APPROVED re-bank run: UPDATE_PROSE_SEAMS_BASELINE=1 npx vitest run tests/copy/composedProseSeams.test.js',
    ).toBe(true);
  });

  it('the corpus actually produced generator prose (did not silently go empty)', () => {
    const { strings } = scan();
    expect(strings.length).toBeGreaterThan(200);
  }, 120_000);

  it('raw seam-defect counts EXACTLY equal the committed baseline (grew ⇒ a new seam leaked; shrank ⇒ bank the ONE-REGEN win)', () => {
    const { counts } = scan();
    const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
    // Directions: a class GREW ⇒ a generator template introduced a new seam
    // (fix it at the source or, for the two display-owned classes, confirm the
    // chokepoint still neutralises it). A class SHRANK ⇒ the owner's ONE REGEN
    // retired some debt; re-bank with UPDATE_PROSE_SEAMS_BASELINE=1.
    expect(counts).toEqual(baseline);
  }, 120_000);

  it('the display chokepoint neutralises the two classes it owns over the SAME corpus', () => {
    const { strings } = scan();
    // normalizePlotHook removes every ' PLOT HOOK: ' marker...
    const afterHook = strings.map(normalizePlotHook);
    expect(countAll(afterHook).plotHookPrefix).toBe(0);
    // ...and collapseDoubledArticles removes every doubled article.
    const afterArticles = strings.map(collapseDoubledArticles);
    expect(countAll(afterArticles).doubledArticle).toBe(0);
  }, 120_000);

  it('generation is deterministic: a second scan yields identical counts (same seed)', () => {
    const first = scan().counts;
    const strings = [];
    for (const cfg of corpusConfigs()) {
      const s = generateSettlementPipeline(cfg, null, { seed: SEED, customContent: {} });
      strings.push(...rawProse(s));
    }
    expect(countAll(strings)).toEqual(first);
  }, 120_000);

  // Detector self-tests: a green ratchet means nothing unless the scanners fire.
  describe('detectors discriminate (positive + negative controls)', () => {
    it('catches every seam class in a seeded string', () => {
      const seeded = countAll([
        ' PLOT HOOK: the the harbour flooded the The lower districts, reshaping {quarter} into a ruin.',
        'The The Long Frost is still remembered.',
      ]);
      expect(seeded.plotHookPrefix).toBeGreaterThanOrEqual(1);
      expect(seeded.doubledArticle).toBeGreaterThanOrEqual(1);
      expect(seeded.braceToken).toBeGreaterThanOrEqual(1);
      expect(seeded.theThePrefix).toBeGreaterThanOrEqual(1);
    });
    it('stays quiet on clean prose', () => {
      expect(countAll(['The harbour flooded the lower districts, reshaping the mill quarter.'])).toEqual(ZERO);
    });
  });
});
