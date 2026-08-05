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
 * DELIBERATELY UNMAPPED — see ARGUED_UNLAYERED below: the four infrastructure
 * hosts and, since CR-FP-11, the two SP substrate leaves. Each carries a written
 * reason and is asserted to still exist and still have no layer.
 *
 * ── CR-FP-11: WHAT THIS FILE COULD NOT CATCH, AND WHY IT CAN NOW ─────────────
 *
 * THE REACH GAP (measured, repaired 2026-08-05). The layer map was a frozen table
 * of family PREFIXES, and `scanCrossLayerPairs` iterated only LAYERED modules as
 * importers while skipping any dependency with no layer. A module matching no
 * pattern was therefore invisible on BOTH sides at once — not merely unclassified
 * but unscannable. Nine of the ten leaves FP cycle 1 landed matched nothing, and
 * an unregistered WAR read inside one of them left this walker fully green, while
 * the SAME import in a layered sibling reds by name. That matched pair is the
 * proof, and it is why arm B exists: an inventory that grows only by pattern will
 * always trail an estate that grows by file, so the unclaimed are now COUNTED.
 *
 * THE STANDING CANNOT-CATCH LIST — stated so the next gap is documented before it
 * is discovered, not after:
 *   • DYNAMIC imports. IMPORT_RE reads static `from '…'` specifiers only; an
 *     `await import()` crosses layers with nothing here to see it.
 *   • RE-EXPORT LAUNDERING. A→B→C shows two pairs, and if B is unlayered (now
 *     impossible in scope) or same-layer, the A→C coupling is never named.
 *   • NON-IMPORT COUPLING. Reading a foreign key straight off worldState needs no
 *     import at all; the registry's receipt addresses, not this scan, cover that.
 *   • ANYTHING OUTSIDE THE CENSUS SCOPE. The census is total over
 *     src/domain/worldPulse and src/domain/spatial only; a layer leaf that lands
 *     in a third directory is unclaimed and uncounted until the scope widens.
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
    // CR-FP-11 arm A: TR-1's casus-commercii family. Four leaves landed in FP cycle 1
    // matching NO pattern here, which made them invisible on BOTH sides of the scan.
    /^src\/domain\/worldPulse\/commercial[A-Z]/,
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
    // CR-FP-11 arm A: GR-0's news/receipt pools and GR-1's oath-holder identity. The
    // pact grammar's own leaves are GRAMMAR whatever noun they are named after.
    /^src\/domain\/worldPulse\/(?:grammar[A-Z]|oath[A-Z])/,
  ],
  INTERIOR: [
    /^src\/domain\/worldPulse\/(?:faction|legitimacy|relationship|institution|commons|disposition|generosity|grievance|rulingPower|npcLadder|seatBooks)/,
  ],
});

/**
 * Per-layer floors, RE-MEASURED at CR-FP-11 against the widened table above. They
 * tighten toward reality and are never raised to admit a budget: a floor set at the
 * measured size means a module leaving a family reds rather than shrinking it in
 * silence. (Landing measurement: WAR 40 · TRADE 20 · FAITH 6 · POP 15 · INFO 10 ·
 * GRAMMAR 30 · INTERIOR 28 — every family has GROWN since, and none may fall back.)
 */
const LAYER_FLOORS = Object.freeze({
  WAR: 52, TRADE: 30, FAITH: 8, POP: 19, INFO: 13, GRAMMAR: 42, INTERIOR: 34,
});

/**
 * THE ARGUED EXCLUSIONS — modules inside the FP scope that deliberately carry NO
 * layer home, each with the reason it is not a port. Stated, never omitted: the
 * census below reds on any OTHER unlayered module, so this map is the only door.
 *
 * The four infrastructure hosts were argued when the ratchet landed: a host that
 * mounts every layer's stages is not a layer, and mapping one would mint a pair for
 * every mount and drown the signal in hosting. settlementLifecycleKernel.js is named
 * explicitly because L1 routes every future FP stage through it.
 *
 * CR-FP-11 adds the two SP substrate leaves on the SAME argument one rung down: they
 * are the shared band/severity/decay VOCABULARY every layer spells against, not a
 * port that owns a subject. Giving them a family would make every layer's reading of
 * a band word a cross-layer coupling, which is hosting by another name.
 */
const ARGUED_UNLAYERED = Object.freeze({
  'src/domain/worldPulse/pulseKernel.js': 'infrastructure host — mounts every layer\'s stages',
  'src/domain/worldPulse/applyWorldPulse.js': 'infrastructure host — the apply-side mount',
  'src/domain/worldPulse/worldState.js': 'infrastructure host — the state shape itself',
  'src/domain/worldPulse/settlementLifecycleKernel.js': 'infrastructure host — L1 routes every FP stage through it',
  'src/domain/worldPulse/bandFamilies.js': 'SP substrate — the shared band/severity vocabulary, spelled by every layer',
  'src/domain/worldPulse/bandedStock.js': 'SP substrate — the shared decay law over that vocabulary',
});

/** The FP scope the unlayered census is TOTAL over. */
const CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//;
const UNLAYERED_BASELINE_PATH = join(ROOT, 'tests/lint/.coupling-unlayered-baseline.json');

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

/** Scoped modules with no layer home and no argued exclusion — the census subject. */
const LIVE_UNLAYERED = DOMAIN_MODULES
  .filter((rel) => CENSUS_SCOPE_RE.test(rel))
  .filter((rel) => !LAYER_OF.has(rel))
  .filter((rel) => !Object.prototype.hasOwnProperty.call(ARGUED_UNLAYERED, rel));
const LIVE_UNLAYERED_SET = new Set(LIVE_UNLAYERED);
const UNLAYERED_BASELINE = JSON.parse(readFileSync(UNLAYERED_BASELINE_PATH, 'utf8'));

/**
 * THE OWED-ROWS REGISTER — CR-FP-11, measured 2026-08-05, SHRINK-ONLY.
 *
 * Widening the layer table did not merely make future waves visible; it revealed two
 * cross-layer reads FP cycle 1 had already landed with no registry row, because the
 * importer matched no family and the scan skipped it on both sides. They are real
 * couplings, not legacy edges: both landed inside the program, days ago, under the
 * same-commit obligation they escaped only through this blindness.
 *
 * They are frozen HERE rather than dropped into the legacy baseline on purpose. The
 * baseline is for the volume's §4 pre-program EXISTS blocks; putting a program-era
 * violation in it would launder the debt into permanent invisibility, which is the
 * "partial map that READS as a total one" failure this file exists to prevent. So the
 * omission is machine-visible instead, exactly the way the desk walker's DISPUTED
 * register carries its measured disagreements.
 *
 * WHOSE RULING: minting a registry row declares a coupling's direction, desk, flags
 * and receipt address, and the GRAMMAR row additionally needs a registry LEAF that
 * does not exist yet plus a widening of the owningVolume set pin. That is a chair
 * declaration, not a walker repair, so this lane measured and froze it rather than
 * improvising it.
 *
 * TO COMPLY: when a row lands, DELETE the entry — the licensing join then covers the
 * pair and the exactness test below reds until the entry is gone, so the win is
 * banked. The register never grows without a chair ruling.
 */
const REACH_OWED_ROWS = Object.freeze([
  Object.freeze({
    importer: 'src/domain/worldPulse/commercialReasons.js',
    imported: 'src/domain/worldPulse/relationshipState.js',
    direction: 'INTERIOR→TRADE',
    owingWave: 'TR-1',
    reads: 'ensureRelationshipState / relationshipKeyFromEdge / normalizeRelationshipType — the trust and resentment the commercial scorers price',
  }),
  Object.freeze({
    importer: 'src/domain/worldPulse/oathHolder.js',
    imported: 'src/domain/worldPulse/npcLadderState.js',
    direction: 'INTERIOR→GRAMMAR',
    owingWave: 'GR-1',
    reads: 'ladderFactionKey / npcInFaction / compareCodepoint — the sanctioned affiliation test the oath-holder identity is composed from',
  }),
]);
const OWED_KEYS = new Set(REACH_OWED_ROWS.map(keyOf));

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

  test('every argued exclusion is a real module that still has no layer', () => {
    // Stated, not omitted: a host that mounts every layer is not a layer, and the SP
    // substrate leaves are vocabulary rather than a port. If one ever acquires a layer
    // home — or vanishes — this reds and the exclusion must be re-argued. Each carries
    // a written reason, so the map can never grow a silent member.
    for (const [module, reason] of Object.entries(ARGUED_UNLAYERED)) {
      expect(DOMAIN_MODULES, `${module} vanished — re-aim the exclusion`).toContain(module);
      expect(LAYER_OF.has(module), `${module} acquired a layer home`).toBe(false);
      expect(reason.length, `${module} is excluded without a reason`).toBeGreaterThan(20);
    }
    // The four infrastructure hosts are named, so a future edit cannot quietly drop one
    // of them out of the map and leave the census to catch it as ordinary debt.
    expect(Object.keys(ARGUED_UNLAYERED)).toEqual(expect.arrayContaining([
      'src/domain/worldPulse/pulseKernel.js',
      'src/domain/worldPulse/applyWorldPulse.js',
      'src/domain/worldPulse/worldState.js',
      'src/domain/worldPulse/settlementLifecycleKernel.js',
    ]));
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
      // The two CR-FP-11 discoveries are accounted for by name in the owed register
      // above, whose own exactness test reds the moment either gains its row.
      .filter((pair) => !OWED_KEYS.has(keyOf(pair)))
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

  test('the owed register is EXACT: each entry is still live, and still unlicensed', () => {
    const stale = [];
    for (const entry of REACH_OWED_ROWS) {
      if (!LIVE_KEYS.has(keyOf(entry))) {
        stale.push(`${entry.importer} no longer imports ${entry.imported} (${entry.direction})`
          + ' — DELETE its owed-register entry; the register only shrinks.');
        continue;
      }
      if (licensingRows(entry).length > 0) {
        stale.push(`${entry.importer} → ${entry.imported} (${entry.direction}) IS licensed now`
          + ` by ${licensingRows(entry).map((row) => row.couplingId).join(', ')}`
          + ' — DELETE its owed-register entry so the win is banked.');
      }
    }
    expect(stale).toEqual([]);
    // Frozen count: the register cannot grow silently while individual rows churn. A
    // third owed row is a chair conversation, not an edit.
    expect(REACH_OWED_ROWS).toHaveLength(2);
    expect(new Set(REACH_OWED_ROWS.map(keyOf)).size).toBe(REACH_OWED_ROWS.length);
    // Every entry is a pair the baseline does NOT already excuse, so the register can
    // never be green merely by duplicating legacy debt.
    for (const entry of REACH_OWED_ROWS) expect(BASELINE_KEYS.has(keyOf(entry))).toBe(false);
  });
});

/**
 * ARM B — THE HABITAT. The ratchet above can only see a module a family pattern
 * claims: `scanCrossLayerPairs` iterates layered importers and skips any dependency
 * with no layer, so a module matching NO pattern is invisible on BOTH sides and an
 * unregistered cross-layer read through it is silent. That is how nine FP cycle-1
 * leaves escaped, and it was invisible because nothing counted the unclaimed.
 *
 * This census removes the habitat rather than the instance: every module in the FP
 * scope is layered, argued, or frozen debt. A NEW unlayered module reds and must pick
 * one of the three. The frozen set only shrinks, so the estate walks toward total
 * coverage instead of accumulating blind spots faster than families.
 */
describe('CW-0w cross-layer inclusion ratchet — the unlayered-module census (CR-FP-11)', () => {
  test('the census subject is real and the scope is non-empty', () => {
    // Guard-the-guard: an absence claim over an empty scan is worthless. The scope
    // must still resolve modules, and the layer map must still claim most of them.
    const scoped = DOMAIN_MODULES.filter((rel) => CENSUS_SCOPE_RE.test(rel));
    expect(scoped.length).toBeGreaterThan(300);
    expect(scoped.filter((rel) => LAYER_OF.has(rel)).length).toBeGreaterThan(150);
    expect(UNLAYERED_BASELINE.length).toBeGreaterThan(100);
  });

  test('a NEW unlayered module REDS — it must get a family, an argument, or the baseline', () => {
    const frozen = new Set(UNLAYERED_BASELINE);
    const escaped = LIVE_UNLAYERED
      .filter((rel) => !frozen.has(rel))
      .map((rel) => `${rel} matches NO layer family pattern, so every cross-layer read`
        + ' through it is INVISIBLE to this ratchet. Give it a LAYER_PATTERNS home (the'
        + ' usual answer), or an ARGUED_UNLAYERED entry with a written reason, or — only'
        + ' for pre-program debt — a line in tests/lint/.coupling-unlayered-baseline.json.');
    expect(escaped).toEqual([]);
  });

  test('a baseline module that FOUND a home reds so the win is banked', () => {
    const stale = UNLAYERED_BASELINE
      .filter((rel) => !LIVE_UNLAYERED_SET.has(rel))
      .map((rel) => `${rel} is no longer unclaimed debt (${LAYER_OF.get(rel) || 'gone or argued'})`
        + ' — DELETE its line from tests/lint/.coupling-unlayered-baseline.json; the'
        + ' census only shrinks.');
    expect(stale).toEqual([]);
  });

  test('the frozen unlayered set is exact, unique, in scope, and never grew', () => {
    expect(new Set(UNLAYERED_BASELINE).size).toBe(UNLAYERED_BASELINE.length);
    for (const rel of UNLAYERED_BASELINE) {
      expect(typeof rel === 'string' && CENSUS_SCOPE_RE.test(rel), rel).toBe(true);
      expect(DOMAIN_MODULES, `${rel} vanished — delete its baseline line`).toContain(rel);
    }
    // The two tests above are jointly an exact-set assertion; this states it once as a
    // readable claim, so neither direction can drift without a named failure.
    expect([...UNLAYERED_BASELINE].sort()).toEqual([...LIVE_UNLAYERED].sort());
    // An argued module may never ALSO sit in the baseline — two doors for one module
    // would let a deleted argument pass unnoticed through the other.
    for (const module of Object.keys(ARGUED_UNLAYERED)) {
      expect(UNLAYERED_BASELINE, `${module} is both argued and baselined`).not.toContain(module);
    }
  });
});
