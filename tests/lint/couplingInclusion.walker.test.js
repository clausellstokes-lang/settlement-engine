/**
 * couplingInclusion.walker.test.js — CW-0w slice 2: THE CROSS-LAYER INCLUSION
 * RATCHET. The machinery behind the same-commit registry obligation (seam SC-1).
 *
 * THE CLASS. DESIGN_FP_COUPLINGS.md §0.3 and the SOL_QUEUE chair checkpoint both
 * say "any cross-layer read adds its CW-0 registry row in the SAME commit", and
 * the CW architecture's substrate audit found that obligation enforced by review
 * courtesy alone: no walker existed. Every wave that lands a quiet cross-layer
 * import without a row makes the registry a partial map that READS as a total
 * one — the most expensive kind of wrong, because CW-3's aliveness floors and
 * CW-1's layer counting both treat the registry as the layer authority.
 *
 * WHY BASELINE-FROZEN AND NOT GREENFIELD-CLEAN (the implementation-grade
 * correction recorded in the CW architecture's §4, vetoable): the volume's own
 * §4 documents dozens of LIVE pre-program cross-layer reads in its EXISTS
 * blocks. Rows are never pre-registered and the registry enumerates DESIGNED
 * couplings, so those legacy edges will not get rows retroactively. A clean scan
 * would red 152 pairs on day one and be deleted by Friday. So today's inventory
 * is FROZEN by (importer, imported) pair identity, and:
 *
 *   1. A NEW cross-layer pair absent from the baseline REDS unless a registry
 *      row licenses it — the row IS the license, which is why licensed pairs
 *      need no baseline edit and the baseline can only shrink.
 *   2. A baseline pair whose import is GONE REDS, demanding the entry be deleted
 *      so the reduction is banked (the sizeBaseline honesty idiom).
 *   3. The baseline may never GROW: an entry naming a pair that is not a live
 *      cross-layer import is stale by definition and reds under (2).
 *
 * Declared-empty directions stay enforced as the ABSENCE of rows (J-CPL-2 — no
 * forbidden-list lives anywhere in this estate).
 *
 * THE LAYER MAP is a frozen in-walker table of MODULE SETS resolved from
 * patterns at scan time, never a list of filenames: a module that relocates out
 * of its family drops out of the set, its frozen pairs go stale, and (2) reds.
 * That is the cure for the recorded filename-anchored-pin vacuity class. The
 * seven layers are DESIGN_FP_COUPLINGS.md §2's seven ports.
 *
 * DELIBERATELY UNMAPPED — the infrastructure hosts (pulseKernel.js,
 * applyWorldPulse.js, worldState.js, settlementLifecycleKernel.js). A host that
 * mounts every layer's stages is not a layer; mapping one would mint a pair for
 * every mount and drown the signal in hosting. settlementLifecycleKernel.js is
 * named explicitly because L1 routes every future FP stage through it.
 *
 * @enforced-by this file
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

import { COUPLING_REGISTRY } from '../../src/domain/certification/couplingRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/lint/.coupling-inclusion-baseline.json');

/**
 * The seven ports of DESIGN_FP_COUPLINGS.md §2, as module SETS. Each pattern
 * names a family, not a file. Membership is asserted non-empty per layer below,
 * so a family that emptied reds instead of silently excusing every pair in it.
 */
const LAYER_PATTERNS = Object.freeze({
  WAR: [
    /^src\/domain\/worldPulse\/war[A-Z]/,
    /^src\/domain\/worldPulse\/(?:occupation|deploymentReturn|mobilization|razing|conquest|siege|vengeance|atrocity)/,
    /^src\/domain\/spatial\/(?:armyTransit|embattlement|navalLayer)\.js$/,
  ],
  TRADE: [
    /^src\/domain\/worldPulse\/(?:routeNetwork|tradeRoute|tradeWar|commodity|merchant|foodStockpile|foodLedger)/,
    /^src\/domain\/spatial\/(?:tradeFlow|commodityFlow|supplyShipments|entrepots|dispatchEV|smuggle|seaLanes)\.js$/,
  ],
  FAITH: [
    /^src\/domain\/worldPulse\/(?:faith|sacred|religion|pantheon|conversion|piety|deity|temple)/,
  ],
  POP: [
    /^src\/domain\/worldPulse\/(?:demographics|population|lineageClaim|steading|settlementLifecycleFirstClass)/,
    /^src\/domain\/spatial\/(?:migration|migrationRumors)\.js$/,
  ],
  INFO: [
    /^src\/domain\/worldPulse\/(?:beliefMap|belief[A-Z]|credibility|brokerage|information|disinfo|intel|sightPosture|outboundImpression)/,
    /^src\/domain\/spatial\/(?:rumorNetwork|intelActs)\.js$/,
  ],
  GRAMMAR: [
    /^src\/domain\/worldPulse\/(?:treaty|peaceTerms|peaceReasons|peaceEngine|negotiationPictures|envoy)/,
  ],
  INTERIOR: [
    /^src\/domain\/worldPulse\/(?:faction|legitimacy|relationship|institution|commons|disposition|generosity|grievance|rulingPower|npcLadder|seatBooks)/,
  ],
});

/** Per-layer floors: the family sizes measured when this ratchet landed. */
const LAYER_FLOORS = Object.freeze({
  WAR: 40, TRADE: 20, FAITH: 6, POP: 15, INFO: 10, GRAMMAR: 30, INTERIOR: 28,
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

/** Every domain module, repo-relative with forward slashes. */
const DOMAIN_MODULES = walk(join(ROOT, 'src/domain'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

/** module -> layer, plus the modules two families both claimed (must be none). */
const LAYER_OF = new Map();
const DOUBLE_CLAIMED = [];
for (const rel of DOMAIN_MODULES) {
  for (const [layer, patterns] of Object.entries(LAYER_PATTERNS)) {
    if (!patterns.some((re) => re.test(rel))) continue;
    if (LAYER_OF.has(rel)) DOUBLE_CLAIMED.push(`${rel}: ${LAYER_OF.get(rel)} + ${layer}`);
    else LAYER_OF.set(rel, layer);
  }
}

/** Static `from '...'` specifiers only — a dynamic import is a different seam. */
const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\b[^;'"]*?from\s*['"]([^'"]+)['"]/g;

function relativeImportsOf(rel) {
  const source = readFileSync(join(ROOT, rel), 'utf8');
  const out = new Set();
  for (const match of source.matchAll(IMPORT_RE)) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) continue;
    out.add(relative(ROOT, resolve(dirname(join(ROOT, rel)), specifier)).replace(/\\/g, '/'));
  }
  return [...out].sort();
}

/** `${sourceLayer}→${consumerLayer}` — the registry's own direction spelling. */
function scanCrossLayerPairs() {
  const pairs = [];
  for (const [rel, layer] of [...LAYER_OF].sort()) {
    for (const dep of relativeImportsOf(rel)) {
      const depLayer = LAYER_OF.get(dep);
      if (!depLayer || depLayer === layer) continue;
      pairs.push({ importer: rel, imported: dep, direction: `${depLayer}→${layer}` });
    }
  }
  return pairs.sort((a, b) => (`${a.importer}|${a.imported}` < `${b.importer}|${b.imported}` ? -1 : 1));
}

const keyOf = (pair) => `${pair.importer}|${pair.imported}|${pair.direction}`;
const LIVE_PAIRS = scanCrossLayerPairs();
const LIVE_KEYS = new Set(LIVE_PAIRS.map(keyOf));
const BASELINE = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const BASELINE_KEYS = new Set(BASELINE.map(keyOf));

/** A row licenses a pair when it names the IMPORTER as its read (or its
 *  counterforce) home AND records the same direction. Registry rows address a
 *  module as `path.js#symbol`; the module half is the join key. */
const moduleOf = (address) => String(address || '').split('#')[0];
function licensingRows(pair) {
  return COUPLING_REGISTRY.filter((row) => row.direction === pair.direction
    && (moduleOf(row.read) === pair.importer || moduleOf(row.counterforce) === pair.importer));
}

describe('CW-0w cross-layer inclusion ratchet — anti-vacuity anchors', () => {
  test('the scanned corpus, the layer map and the registry are all non-empty', () => {
    // Every absence claim below is worthless if the walk, the map or the
    // registry silently emptied. Floors tighten toward reality; they are never
    // raised to admit a budget.
    expect(DOMAIN_MODULES.length).toBeGreaterThan(500);
    expect(COUPLING_REGISTRY.length).toBeGreaterThan(0);
    expect(LIVE_PAIRS.length).toBeGreaterThan(100);
    expect(Object.keys(LAYER_PATTERNS)).toHaveLength(7);
  });

  test('every layer family resolves to a real, non-empty, exclusive module set', () => {
    const sizes = {};
    for (const [, layer] of LAYER_OF) sizes[layer] = (sizes[layer] || 0) + 1;
    for (const [layer, floor] of Object.entries(LAYER_FLOORS)) {
      expect(sizes[layer] ?? 0, `${layer} family emptied or shrank past its floor`)
        .toBeGreaterThanOrEqual(floor);
    }
    // A module has exactly ONE layer home; two families claiming it would make
    // the direction of every pair through it a coin flip.
    expect(DOUBLE_CLAIMED).toEqual([]);
  });

  test('the infrastructure hosts are deliberately unmapped', () => {
    // Stated, not omitted: a host that mounts every layer is not a layer. If one
    // ever acquires a layer home, this reds and the exclusion must be argued.
    for (const host of [
      'src/domain/worldPulse/pulseKernel.js',
      'src/domain/worldPulse/applyWorldPulse.js',
      'src/domain/worldPulse/worldState.js',
      'src/domain/worldPulse/settlementLifecycleKernel.js',
    ]) {
      expect(DOMAIN_MODULES, `${host} vanished — re-aim the exclusion`).toContain(host);
      expect(LAYER_OF.has(host), `${host} acquired a layer home`).toBe(false);
    }
  });

  test('POSITIVE CONTROL: the scan finds WR-4\'s registered trade read and the join licenses it', () => {
    // Guard-the-guard (the K3 idiom): before trusting what the detector does NOT
    // flag, prove it sees a coupling everyone agrees is there. readWarHomeFront
    // reads the route network for the home front's roads-and-markets band, and
    // WR-4 registered it as CPL-1 TRADE→WAR.
    const control = LIVE_PAIRS.find((pair) => pair.importer === 'src/domain/worldPulse/warCosts.js'
      && pair.imported === 'src/domain/worldPulse/routeNetworkLedger.js');
    expect(control, 'the known TRADE→WAR read is invisible to the scan').toBeTruthy();
    expect(control.direction).toBe('TRADE→WAR');
    const rows = licensingRows(control);
    expect(rows.map((row) => row.couplingId)).toContain('CPL-1.TRADE_TO_WAR.WR-4.home_front_trade');
  });
});

describe('CW-0w cross-layer inclusion ratchet — the shrink-only inventory', () => {
  test('a NEW cross-layer import is either licensed by a registry row or REDS', () => {
    const unlicensed = LIVE_PAIRS
      .filter((pair) => !BASELINE_KEYS.has(keyOf(pair)))
      .filter((pair) => licensingRows(pair).length === 0)
      .map((pair) => `${pair.importer} imports ${pair.imported} (${pair.direction})`
        + ' — add its couplingRegistry row in THIS commit (the same-commit obligation,'
        + ' DESIGN_FP_COUPLINGS.md §0.3), naming the importer as the row\'s read address.');
    expect(unlicensed).toEqual([]);
  });

  test('a baseline pair whose import is GONE reds so the win is banked', () => {
    const stale = BASELINE
      .filter((pair) => !LIVE_KEYS.has(keyOf(pair)))
      .map((pair) => `${pair.importer} no longer imports ${pair.imported} (${pair.direction})`
        + ' — DELETE its baseline entry; the inventory only shrinks.');
    expect(stale).toEqual([]);
  });

  test('the committed baseline is exact, unique, and never grew', () => {
    expect(BASELINE.length).toBeGreaterThan(100);
    expect(new Set(BASELINE.map(keyOf)).size).toBe(BASELINE.length);
    for (const pair of BASELINE) {
      expect(typeof pair.importer === 'string' && pair.importer.startsWith('src/domain/')).toBe(true);
      expect(typeof pair.imported === 'string' && pair.imported.startsWith('src/domain/')).toBe(true);
      expect(pair.direction).toMatch(/^[A-Z]+→[A-Z]+$/);
    }
    // The two tests above are jointly an exact-set assertion for UNLICENSED
    // pairs; this states it as one readable claim: the baseline never carries a
    // pair the live scan does not see.
    expect(BASELINE.filter((pair) => !LIVE_KEYS.has(keyOf(pair)))).toEqual([]);
  });
});
