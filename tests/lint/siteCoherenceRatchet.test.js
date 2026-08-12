/**
 * tests/lint/siteCoherenceRatchet.test.js — SITE COHERENCE / WAVE 0, the contradiction
 * inventory. An IDENTITY-KEYED, ONLY-SHRINKS freeze of what the site deriver does today.
 *
 * WHAT THIS IS FOR. `SITE_COHERENCE_PLAN.md` sequences nine waves whose exit criteria are
 * all NUMBERS — "flank-on-flat fell from 23 to 4". Before this file there was no instrument
 * in the repo that could produce such a number; the audit measured its baseline with
 * throwaway probes under /tmp that died with the session. This freezes the measurement into
 * the repository so every later wave has a receipt it did not have to re-earn.
 *
 * ⛔⛔ THE LINE THIS FILE MAY NOT CROSS — INVENTORY FREEZING, NEVER CORRECTNESS ASSERTION.
 * Nothing here claims a derivation is WRONG. "A desert town must not have a river" is Wave
 * 8's assertion and it is deliberately last: this estate's pin-vacuity family is populated
 * entirely by pins authored ahead of their subject, and an assertion written before the
 * behaviour is right is an assertion written to the wrong shape. WAVE 0 FREEZES WHAT IS.
 *
 * THE ROW IDENTITY IS `(terrain, siteKind, decisiveToken)`, NEVER A BARE COUNT. A
 * count-keyed ratchet passes an identity swap — the exact soft spot HZ-READERNOWRITER
 * records, cured for the observed-shape walker at 53029151. Two contradictions trading
 * places must RED here, and they do, because the key names both of them.
 *
 * THE THREE POLARITIES, AND WHY THE THIRD IS THE POINT. A NEW key reds (a regression). A
 * GROWN count reds (the same). A SHRUNK count ALSO reds, with an instruction to lower the
 * row in the change that earned it — the inventory-honesty shape at
 * negativeAssertionAnchor.walker.test.js:773. Without that third arm a later wave's win is
 * absorbed into slack instead of banked, and the program cannot prove it did anything.
 *
 * THE INSTRUMENT READS THE REAL PRODUCTION PATH. `siteKind` is taken from
 * `buildTownLayoutV2(settlement).meta.siteKind` — the shipped call site — not from a
 * re-implementation of it. The audit's own figures came from a /tmp probe that REPLICATED
 * townLayoutV2.js:256-283,320 (its finding S13), and a probe that replicates production can
 * drift from production silently. The reconstructed `generateSite` bag this file also needs
 * (for the leave-one-out token probe) is therefore CROSS-CHECKED against the production
 * kind on all 462 rows, so the reconstruction cannot rot unnoticed.
 *
 * REGENERATION IS PRINT-ONLY AND ALWAYS FAILS. Set UPDATE_SITE_COHERENCE_BASELINE=1 to have
 * the fresh literal printed for review. It is never written. A silent --write that
 * re-baselines from whatever the tree produced at that instant is the M13/M16 failure mode
 * this estate has already been bitten by; the shape copied here is
 * negativeAssertionAnchor.walker.test.js:738-750.
 *
 * PURE: no clock, no network, no Math.random, no persistence, no module-scope mutation
 * beyond a lazy memo of the corpus. The seeds and the corpus axes are FROZEN LITERALS
 * because they are part of the inventory's identity — a corpus that drifts silently makes
 * every later wave's number incomparable.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildTownLayoutV2 } from '../../src/domain/townMap/townLayoutV2.js';
import { generateSite } from '../../src/domain/townMap/siteGenesis.js';
import { canonExports } from '../../src/domain/canonicalAccessors.js';
import { resolveTerrain } from '../../src/domain/resolveTerrain.js';
import { CULTURE_PROFILE_KEYS } from '../../src/data/cultureProfiles.js';
import { TIER_ORDER } from '../../src/data/constants.js';
import { TERRAIN_WEIGHTS } from '../../src/generators/steps/resolveConfig.js';
import { mustExtract, jsRegexTokens } from '../helpers/sourceContract.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/lint/.site-coherence-baseline.json');
const SITE_GENESIS_REL = 'src/domain/townMap/siteGenesis.js';

/** The estate's heavy-suite local budget (determinismBanCoverage.test.js:169), which is
 *  also CR-SCW0-5's ruled corpus budget. A LOCAL timeout, never a raise of the global
 *  `testTimeout` at vite.config.js:801, and never an assertion on wall clock. */
const CORPUS_BUDGET_MS = 120_000;

// ── THE CORPUS, FROZEN (SITE_COHERENCE_PLAN.md:56). 210 + 252 = 462. ────────────────────
// Arm A: 6 settTypes × 7 terrains × 5 seeds at tradeRouteAccess 'road'.
// Arm B: 6 settTypes × 7 terrains × 6 route values × 1 seed.
// ⚠ The route list EXCLUDES 'random_trade': the panel offers seven, but random_trade is a
// ROLL, not a value (ConfigurationPanel.jsx trade-route select), and rolling the axis would
// make the corpus a different corpus per terrain. 'auto' is excluded from the terrain axis
// for the same reason (resolveConfig.js:107) and C4 asserts its absence.
const SETT_TYPES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const TERRAINS = Object.freeze(['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert']);
const ROUTES = Object.freeze(['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass']);
const ARM_A_SEEDS = Object.freeze(['scw0-a1', 'scw0-a2', 'scw0-a3', 'scw0-a4', 'scw0-a5']);
const ARM_B_SEED = 'scw0-b1';
const ARM_A_ROUTE = 'road';
const MONSTER_THREAT = 'civilized';
const CORPUS_SIZE = 462;

/** The contradiction categories, exactly as the audit measured them
 *  (SITE_COHERENCE_AUDIT.md:38-45). Terrain sets, not biome regexes: the audit graded
 *  against the CONFIG's terrain, which is what a reader of a later wave's number will
 *  compare against. */
const DRY_TERRAINS = Object.freeze(['plains', 'hills', 'forest', 'mountain', 'desert']);
const FLAT_TERRAINS = Object.freeze(['plains', 'desert', 'riverside', 'coastal']);
const WET_TERRAINS = Object.freeze(['riverside', 'coastal']);

/** The sentinel for a row whose arm fired on its BIOME disjunct with no export decisive. */
const BIOME_TOKEN = '(biome)';
/** The sentinel for an export-decisive row no derived alternative accounts for. It must
 *  never appear: if it does, a predicate exists in source that the extractor below does not
 *  see, and the denominator is incomplete. C1 asserts it is absent. */
const UNATTRIBUTED_TOKEN = '(unattributed)';

// ── DERIVED, NEVER TRANSCRIBED: the export predicates, read out of siteGenesis source ────
// contractTestAntiVacuity Rule 2 reds an exhaustive claim backed by a local literal, and
// SITE_COHERENCE_PLAN.md:115's own list of predicate sites is MISSING siteGenesis.js:239 —
// a transcribed list would have been silently incomplete on the day it landed. Extraction
// routes through tests/helpers/sourceContract.js, which THROWS on absence rather than
// returning '' (the M7 silent-extractor class).

/**
 * The export-matching predicates in siteGenesis.js, in source order, each as
 * `{ site, alternatives }`. Two shapes are recognised, both structurally:
 *   (a) a NAMED const regex that the file applies to an export element
 *       (`const NAME = /…/i;` plus `NAME.test(String(e))`);
 *   (b) an INLINE literal regex applied to an export expression
 *       (`/…/i.test(String(e))` or `/…/i.test(exports.join(' '))`).
 * @param {string} src siteGenesis.js source text
 * @returns {Array<{ site: string, alternatives: string[] }>}
 */
export function exportPredicatesOf(src) {
  /** @type {Array<{ at: number, site: string, alternatives: string[] }>} */
  const found = [];
  for (const m of src.matchAll(/const\s+([A-Z][A-Z0-9_]*_RE)\s*=\s*\/([^/\n]+)\/i;/g)) {
    if (!new RegExp(`\\b${m[1]}\\.test\\(String\\(e\\)\\)`).test(src)) continue;
    found.push({ at: m.index, site: m[1], alternatives: jsRegexTokens(m[2]) });
  }
  for (const m of src.matchAll(/\/([^/\n]+)\/i\.test\((String\(e\)|exports\.join\(' '\))\)/g)) {
    const kindMatch = src.slice(m.index).match(/kind = '([a-z-]+)'/);
    const label = m[2] === "exports.join(' ')" ? 'marshSplit' : `${kindMatch ? kindMatch[1] : 'unknown'}Exports`;
    found.push({ at: m.index, site: label, alternatives: jsRegexTokens(m[1]) });
  }
  if (found.length === 0) {
    throw new Error('siteCoherenceRatchet: zero export predicates extracted from siteGenesis.js — the extractor is blind, not the file empty');
  }
  return found.sort((a, b) => a.at - b.at).map(({ site, alternatives }) => ({ site, alternatives }));
}

/** Every export alternative siteGenesis can decide on, in source order, deduped. */
function decisiveCandidatesOf(src) {
  const seen = new Set();
  const out = [];
  for (const { alternatives } of exportPredicatesOf(src)) {
    for (const alt of alternatives) {
      if (seen.has(alt)) continue;
      seen.add(alt);
      out.push(alt);
    }
  }
  return out;
}

// ── The corpus ──────────────────────────────────────────────────────────────────────────

/** The frozen config list. Culture rotates over all 11 CULTURE_PROFILE_KEYS by row index,
 *  so the axis is covered without multiplying the corpus.
 *  @returns {Array<{ cfg: Record<string, string>, seed: string, terrain: string }>} */
export function corpusConfigs() {
  /** @type {Array<{ cfg: Record<string, string>, seed: string, terrain: string }>} */
  const rows = [];
  let i = 0;
  const next = () => CULTURE_PROFILE_KEYS[i++ % CULTURE_PROFILE_KEYS.length];
  for (const settType of SETT_TYPES) {
    for (const terrainOverride of TERRAINS) {
      for (const seed of ARM_A_SEEDS) {
        rows.push({
          cfg: { settType, terrainOverride, tradeRouteAccess: ARM_A_ROUTE, monsterThreat: MONSTER_THREAT, culture: next() },
          seed,
          terrain: terrainOverride,
        });
      }
    }
  }
  for (const settType of SETT_TYPES) {
    for (const terrainOverride of TERRAINS) {
      for (const tradeRouteAccess of ROUTES) {
        rows.push({
          cfg: { settType, terrainOverride, tradeRouteAccess, monsterThreat: MONSTER_THREAT, culture: next() },
          seed: ARM_B_SEED,
          terrain: terrainOverride,
        });
      }
    }
  }
  return rows;
}

/** The `generateSite` argument bag, reconstructed exactly as townLayoutV2.js:250-283,320
 *  builds it. CROSS-CHECKED against the production kind on every row (C1), so a drift in
 *  either this reconstruction or the call site reddens instead of quietly diverging.
 *  @param {any} s a generated settlement */
export function siteBagFor(s) {
  const cfg = s.config && typeof s.config === 'object' ? s.config : {};
  const terrain = resolveTerrain(cfg);
  const tradeAccess = typeof cfg.tradeRouteAccess === 'string' ? cfg.tradeRouteAccess : null;
  const realmBiome = typeof cfg.biome === 'string' ? cfg.biome
    : (typeof cfg.terrainOverride === 'string' ? cfg.terrainOverride : null);
  return {
    terrain,
    tradeAccess,
    isCoast: tradeAccess === 'port' || tradeAccess === 'coastal' || terrain === 'coastal',
    isRiver: terrain === 'riverside' || tradeAccess === 'river',
    exports: canonExports(s),
    realmBiome,
    seed: String(s._seed ?? s.id ?? 'town-map-seedless'),
  };
}

/**
 * THE DECISIVE TOKEN, by leave-one-out against the REAL deriver — no re-implementation of
 * the arm chain anywhere. Three clauses, in order:
 *   1. Emptying the export list does not change `kind` ⇒ the arm fired on its biome
 *      disjunct and no export was decisive ⇒ the sentinel `(biome)`.
 *   2. Otherwise the FIRST alternative (in source order) whose removal from the export list
 *      changes `kind` is decisive. This is the "no earlier arm fired AND removing it would
 *      change kind" test, executed rather than reasoned.
 *   3. If no single alternative flips it (two exports independently sufficient), the first
 *      source-order alternative that matches ANY export wins — the first-match reading, and
 *      deterministic. `(unattributed)` only if even that finds nothing, which would mean the
 *      derived denominator is incomplete.
 * @param {any} bag @param {string} kind @param {string[]} candidates
 */
export function decisiveTokenFor(bag, kind, candidates) {
  const list = Array.isArray(bag.exports) ? bag.exports : [];
  if (generateSite({ ...bag, exports: [] }).kind === kind) return BIOME_TOKEN;
  let firstMatching = null;
  for (const alt of candidates) {
    const re = new RegExp(alt, 'i');
    const kept = list.filter((e) => !re.test(String(e)));
    if (kept.length === list.length) continue;
    if (firstMatching === null) firstMatching = alt;
    if (generateSite({ ...bag, exports: kept }).kind !== kind) return alt;
  }
  return firstMatching ?? UNATTRIBUTED_TOKEN;
}

/** One scan of the whole corpus. Pure; identical inputs give an identical result.
 *  @returns {{ rows: Record<string, number>, totals: Record<string, number>, size: number,
 *    errors: string[], vocabulary: string[], kinds: Record<string, number>,
 *    reconstructionMismatches: string[], terrains: string[] }} */
export function scanCorpus() {
  const src = readFileSync(join(ROOT, SITE_GENESIS_REL), 'utf8');
  const candidates = decisiveCandidatesOf(src);
  /** @type {Record<string, number>} */
  const rows = {};
  /** @type {Record<string, number>} */
  const kinds = {};
  const errors = [];
  const reconstructionMismatches = [];
  const vocabulary = new Set();
  const terrains = new Set();
  let waterOnDry = 0;
  let marshOnDry = 0;
  let flankOnFlat = 0;
  let dunesOnWet = 0;
  let anyContradiction = 0;
  let size = 0;

  for (const { cfg, seed, terrain } of corpusConfigs()) {
    let settlement;
    try {
      settlement = generateSettlementPipeline(cfg, null, { seed, customContent: {} });
    } catch (err) {
      errors.push(`${terrain}/${cfg.settType}/${cfg.tradeRouteAccess}@${seed}: ${err && err.message}`);
      continue;
    }
    size += 1;
    terrains.add(terrain);
    const bag = siteBagFor(settlement);
    for (const e of bag.exports) vocabulary.add(String(e));
    const productionKind = buildTownLayoutV2(settlement).meta.siteKind;
    const site = generateSite(bag);
    if (site.kind !== productionKind) {
      reconstructionMismatches.push(`${terrain}/${cfg.settType}/${cfg.tradeRouteAccess}@${seed}: bag ${site.kind} vs production ${productionKind}`);
    }
    const token = decisiveTokenFor(bag, site.kind, candidates);
    const key = `${terrain}|${productionKind}|${token}`;
    rows[key] = (rows[key] || 0) + 1;
    kinds[productionKind] = (kinds[productionKind] || 0) + 1;

    const dry = DRY_TERRAINS.includes(terrain);
    const water = site.hasWater && dry;
    const marsh = productionKind === 'marsh' && dry;
    const flank = productionKind === 'mountain-flank' && FLAT_TERRAINS.includes(terrain);
    const dune = productionKind === 'dunes' && WET_TERRAINS.includes(terrain);
    if (water) waterOnDry += 1;
    if (marsh) marshOnDry += 1;
    if (flank) flankOnFlat += 1;
    if (dune) dunesOnWet += 1;
    if (water || flank || dune) anyContradiction += 1;
  }

  return {
    rows,
    totals: { waterOnDry, marshOnDry, flankOnFlat, dunesOnWet, anyContradiction },
    size,
    errors,
    vocabulary: [...vocabulary].sort(),
    kinds,
    reconstructionMismatches,
    terrains: [...terrains].sort(),
  };
}

/** Lazy memo — the corpus costs seconds, and five tests read it. */
let memo = null;
function corpus() {
  if (memo === null) memo = scanCorpus();
  return memo;
}

// ── The only-shrinks comparator, as a pure function so C6 can drive it with a HAND-BUILT
// variant baseline rather than by editing the committed one. ────────────────────────────

/**
 * @param {Record<string, number>} live @param {Record<string, number>} frozen
 * @returns {{ added: string[], grown: string[], shrunk: string[], vanished: string[] }}
 */
export function diffRows(live, frozen) {
  const added = [];
  const grown = [];
  const shrunk = [];
  const vanished = [];
  for (const [key, count] of Object.entries(live)) {
    if (!(key in frozen)) { added.push(`${key} = ${count}`); continue; }
    if (count > frozen[key]) grown.push(`${key}: ${frozen[key]} → ${count}`);
    if (count < frozen[key]) {
      shrunk.push(`${key}: ${frozen[key]} → ${count} — LOWER the row to ${count} in the same change that earned the shrink, so the win is BANKED rather than absorbed into slack`);
    }
  }
  for (const key of Object.keys(frozen)) {
    if (!(key in live)) vanished.push(`${key} (frozen ${frozen[key]}, now absent) — REMOVE the row in the same change`);
  }
  return { added: added.sort(), grown: grown.sort(), shrunk: shrunk.sort(), vanished: vanished.sort() };
}

/** The frozen artifact, rendered key-sorted for a stable diff. Printed, never written. */
function renderBaseline(scan, frozenAt) {
  const rows = {};
  for (const key of Object.keys(scan.rows).sort()) rows[key] = scan.rows[key];
  return `${JSON.stringify({
    _doc: [
      'SITE COHERENCE — the frozen (terrain, siteKind, decisiveToken) contradiction inventory.',
      'Minted by SCW-0 (Wave 0) so Waves 1-9 can state their effect as a NUMBER this repository',
      're-derives. ONLY-SHRINKS, BOTH DIRECTIONS: a NEW key reds, a GROWN count reds, a SHRUNK',
      'count reds until you LOWER the row here in the same change that earned it, and a VANISHED',
      'key reds until you REMOVE it here. That third arm is the point — it is what banks a later',
      "wave's win instead of letting it be absorbed as slack.",
      'A NEW KEY IS A REGRESSION until proven otherwise: it means a (terrain, siteKind, token)',
      'combination the deriver never produced before now occurs.',
      'This file asserts NOTHING about whether any row is CORRECT. Wave 8 does that, deliberately',
      'last. Regenerate for review with UPDATE_SITE_COHERENCE_BASELINE=1 — print-only, never',
      'written, and it always exits non-zero so it can never be mistaken for a pass.',
      'frozenAt names the commit whose GENERATION SUBSTRATE produced these rows; SCW-0 itself',
      'touches zero src/ files, so the landing commit derives identically.',
    ],
    frozenAt,
    corpusMeta: {
      settlements: CORPUS_SIZE,
      settTypes: SETT_TYPES.length,
      terrains: TERRAINS.length,
      routes: ROUTES.length,
      cultures: CULTURE_PROFILE_KEYS.length,
    },
    rows,
    totals: scan.totals,
  }, null, 2)}\n`;
}

const baselineExists = existsSync(BASELINE_PATH);
/** @type {any} */
const BASELINE = baselineExists ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) : null;

describe('site-coherence contradiction ratchet (Wave 0 — inventory freezing, never correctness)', () => {
  it('REGENERATION MODE: prints the fresh baseline and fails on purpose', () => {
    if (!process.env.UPDATE_SITE_COHERENCE_BASELINE) {
      expect(baselineExists, `${BASELINE_PATH} is missing — mint it with UPDATE_SITE_COHERENCE_BASELINE=1`).toBe(true);
      return;
    }
    const scan = corpus();
    const frozenAt = process.env.SITE_COHERENCE_FROZEN_AT || (BASELINE && BASELINE.frozenAt) || '0'.repeat(40);
    console.log(`\n${renderBaseline(scan, frozenAt)}\n`);
    console.log(`[scw-0] size=${scan.size} errors=${scan.errors.length} vocabulary=${scan.vocabulary.length} kinds=${JSON.stringify(scan.kinds)}`);
    expect(
      false,
      'UPDATE_SITE_COHERENCE_BASELINE is set: the fresh baseline was printed above. Review every'
      + ' changed row, write it to tests/lint/.site-coherence-baseline.json by hand, and re-run'
      + ' WITHOUT the env var. This mode always fails so it can never be mistaken for a pass.',
    ).toBe(true);
  }, CORPUS_BUDGET_MS);

  it('C5 anti-vacuity — the corpus is exactly 462 settlements with zero generation errors', () => {
    const scan = corpus();
    expect(scan.errors, 'the corpus must build clean; a generation error is a STOP, not a skipped row').toEqual([]);
    expect(scan.size, 'the corpus size moved — the axes are frozen literals and must multiply to 462').toBe(CORPUS_SIZE);
    expect(Object.keys(scan.rows).length, 'the scan produced no rows at all — it is measuring nothing').toBeGreaterThan(0);
    expect(scan.vocabulary.length, 'the corpus produced no export strings — the vocabulary half is vacuous').toBeGreaterThan(0);
    // The three corpus axes are the ones the arithmetic 210 + 252 = 462 is built from.
    expect(SETT_TYPES.length * TERRAINS.length * ARM_A_SEEDS.length
      + SETT_TYPES.length * TERRAINS.length * ROUTES.length, 'the frozen axes no longer multiply to 462').toBe(CORPUS_SIZE);
  }, CORPUS_BUDGET_MS);

  it('C1 — the live row set equals the frozen baseline in both directions', () => {
    const scan = corpus();
    expect(scan.reconstructionMismatches,
      'the reconstructed generateSite bag disagrees with the SHIPPED buildTownLayoutV2 kind —'
      + ' either townLayoutV2.js:250-283 moved or siteBagFor rotted; this is the S13 replication'
      + ' defect caught rather than shipped').toEqual([]);
    const unattributed = Object.keys(scan.rows).filter((k) => k.endsWith(`|${UNATTRIBUTED_TOKEN}`));
    expect(unattributed,
      'an export-decisive row matched no derived alternative — siteGenesis holds an export'
      + ' predicate the extractor cannot see, so the denominator is incomplete').toEqual([]);
    // ALL FOUR CATEGORIES IN ONE ASSERTION, deliberately. Four sequential expects would stop
    // at the first non-empty one and hide the rest — the same sequenced-census trap that makes
    // a partially-red census report figures nobody measured. A wave author needs the WHOLE
    // movement in one run, not one category per iteration. The four arms are proven to fire
    // INDEPENDENTLY by C6, so nothing is lost by reporting them together here.
    expect(diffRows(scan.rows, BASELINE.rows),
      'THE CONTRADICTION INVENTORY MOVED. `added` = new (terrain, siteKind, decisiveToken)'
      + ' identities, a regression until proven otherwise. `grown` = a frozen row rose.'
      + ' `shrunk` / `vanished` = a row FELL or DISAPPEARED: that is a WIN, and it reds until you'
      + ' bank it by lowering or removing the row in tests/lint/.site-coherence-baseline.json in'
      + ' the SAME change that earned it. Never regenerate the baseline to make this pass —'
      + ' UPDATE_SITE_COHERENCE_BASELINE=1 prints for review and always fails on purpose.')
      .toEqual({ added: [], grown: [], shrunk: [], vanished: [] });
    expect(scan.totals, 'the category totals moved; re-record them beside the rows').toEqual(BASELINE.totals);
    expect(BASELINE.corpusMeta.settlements, 'the frozen corpus size disagrees with this file').toBe(CORPUS_SIZE);
    expect(/^[0-9a-f]{40}$/.test(String(BASELINE.frozenAt)), 'frozenAt must be a 40-hex committed sha').toBe(true);
  }, CORPUS_BUDGET_MS);

  it('C3 — an export-less settlement contributes only a biome-sentinel row, anchored', () => {
    const bare = { config: { terrainOverride: 'plains', tradeRouteAccess: 'road' }, _seed: 'scw0-c3', economicState: { primaryExports: [] } };
    const bareBag = siteBagFor(bare);
    expect(bareBag.exports, 'canonExports must resolve the authored empty list to []').toEqual([]);
    const src = readFileSync(join(ROOT, SITE_GENESIS_REL), 'utf8');
    const candidates = decisiveCandidatesOf(src);
    expect(candidates.length, 'the derived candidate set is empty — the probe below would be vacuous').toBeGreaterThan(0);
    const bareKind = generateSite(bareBag).kind;
    expect(decisiveTokenFor(bareBag, bareKind, candidates),
      'a settlement with no exports cannot have an export-decisive token').toBe(BIOME_TOKEN);
    // ANCHOR: the SAME terrain with a mining export DOES contribute an export-decisive row,
    // so the assertion above is a property of the empty list and not of the probe being dead.
    const laden = { config: { terrainOverride: 'plains', tradeRouteAccess: 'road' }, _seed: 'scw0-c3', economicState: { primaryExports: ['Coal'] } };
    const ladenBag = siteBagFor(laden);
    const ladenKind = generateSite(ladenBag).kind;
    expect(ladenKind, 'the anchor settlement did not leave the plain fallthrough').toBe('mountain-flank');
    expect(decisiveTokenFor(ladenBag, ladenKind, candidates), 'the anchor row is export-decisive on coal').toBe('coal');
  });

  it('C4 — sparse and malformed export shapes classify without throwing; auto is excluded', () => {
    const base = { terrain: 'plains', tradeAccess: 'road', isCoast: false, isRiver: false, realmBiome: 'plains', seed: 'scw0-c4' };
    // The audit's S3 shape, RE-DRIVEN rather than inherited.
    for (const exportsValue of [null, undefined, 'Peat fuel', [{}, 'Peat fuel'], []]) {
      const out = generateSite({ ...base, exports: exportsValue });
      expect(typeof out.kind, `generateSite threw or returned a non-string kind for ${JSON.stringify(exportsValue)}`).toBe('string');
    }
    // `terrainOverride: 'auto'` is a UI sentinel, not a terrain (resolveConfig.js:107), and the
    // corpus excludes it BY CONSTRUCTION. Asserted, because a silent 'auto' row would make the
    // terrain leg of every key meaningless.
    const overrides = corpusConfigs().map(({ cfg }) => cfg.terrainOverride);
    expectAbsentWithAnchor(overrides, 'auto', 'plains', 'the corpus terrain axis excludes the auto sentinel');
    expect(TERRAIN_WEIGHTS.map(([t]) => t).sort(), 'the corpus terrain axis drifted from the generator\'s own vocabulary')
      .toEqual([...TERRAINS].sort());
    expect([...TIER_ORDER].sort(), 'the corpus settType axis drifted from TIER_ORDER').toEqual([...SETT_TYPES].sort());
  });

  it('C5 — determinism: two scans in one run agree on rows, totals and vocabulary', () => {
    const first = corpus();
    const second = scanCorpus();
    expect(second.rows, 'the corpus is not deterministic — two scans in one run disagree on rows').toEqual(first.rows);
    expect(second.totals, 'the corpus is not deterministic — the totals disagree').toEqual(first.totals);
    expect(second.vocabulary, 'the corpus is not deterministic — the export vocabulary disagrees').toEqual(first.vocabulary);
  }, CORPUS_BUDGET_MS);

  it('C6 — the only-shrinks contract reds on a new, a grown, a shrunk and a vanished key', () => {
    // Driven against HAND-BUILT variants, never by editing the committed baseline.
    const frozen = Object.freeze({ 'plains|mountain-flank|coal': 15, 'desert|dunes|(biome)': 7 });
    const clean = { 'plains|mountain-flank|coal': 15, 'desert|dunes|(biome)': 7 };
    const withNew = { ...clean, 'hills|marsh|peat': 3 };
    const withGrown = { ...clean, 'plains|mountain-flank|coal': 16 };
    const withShrunk = { ...clean, 'plains|mountain-flank|coal': 14 };
    const withVanished = { 'plains|mountain-flank|coal': 15 };

    expect(diffRows(clean, frozen), 'the comparator reds on an unchanged inventory')
      .toEqual({ added: [], grown: [], shrunk: [], vanished: [] });
    expect(diffRows(withNew, frozen).added, 'a NEW key did not red').toEqual(['hills|marsh|peat = 3']);
    expect(diffRows(withGrown, frozen).grown, 'a GROWN count did not red').toEqual(['plains|mountain-flank|coal: 15 → 16']);
    const shrunk = diffRows(withShrunk, frozen).shrunk;
    expect(shrunk.length, 'a SHRUNK count did not red').toBe(1);
    expect(shrunk[0], 'the shrink message must carry the BANK instruction, not merely report the drop').toContain('LOWER the row');
    expect(diffRows(withVanished, frozen).vanished.length, 'a VANISHED key did not red').toBe(1);
    // ANCHOR: the REAL baseline passes all four arms, so the four reds above are properties of
    // the variants and not of a comparator that reds on everything.
    expect(diffRows(BASELINE.rows, BASELINE.rows), 'the committed baseline does not pass its own comparator')
      .toEqual({ added: [], grown: [], shrunk: [], vanished: [] });
  });

  it('C7 — the derived predicate set covers all four siteGenesis export sites', () => {
    const src = readFileSync(join(ROOT, SITE_GENESIS_REL), 'utf8');
    expect(src.length, 'the siteGenesis source read came back empty').toBeGreaterThan(0);
    mustExtract(src, /const WATER_ECONOMY_RE = \/[^/\n]+\/i;/, 'the water-economy predicate');
    const sites = exportPredicatesOf(src).map(({ site }) => site);
    expect(sites, 'the export-predicate inventory moved — SITE_COHERENCE_PLAN.md:115 lists only three,'
      + ' and siteGenesis.js:239 is the fourth (§5c item 2)')
      .toEqual(['WATER_ECONOMY_RE', 'marshSplit', 'mountain-flankExports', 'dunesExports']);
    const candidates = decisiveCandidatesOf(src);
    expect(candidates, 'the derived alternative set must contain the mountain arm\'s coal leg').toContain('coal');
    expect(candidates, 'the derived alternative set must contain the marsh split\'s peat leg').toContain('peat');
  });

  it('C8 — the hazard registry tells the truth about both classes and no floor moves', () => {
    const registry = JSON.parse(readFileSync(join(ROOT, 'scripts/hazard-registry.json'), 'utf8'));
    const byId = Object.fromEntries(registry.classes.map((c) => [c.id, c]));
    expect(byId['HZ-READERNOWRITER'].instances, 'TCD-4 is the fourth confirmed member of the class').toBe(4);
    const site = byId['HZ-SITECOHERENCE'];
    expect(site, 'HZ-SITECOHERENCE is absent — the class this packet mints is unregistered').toBeDefined();
    expect(site.status, 'a new class arrives as MACHINERY or not at all (the hazard-conversion law)').toBe('MACHINERY');
    expect(site.enforcer.paths, 'the enforcer must name this file').toContain('tests/lint/siteCoherenceRatchet.test.js');
    expect(site.enforcer.paths, 'the enforcer must name the coverage census').toContain('tests/lint/exportTokenCoverage.test.js');
    expect(site.enforcer.paths, 'the enforcer must name the frozen baseline').toContain('tests/lint/.site-coherence-baseline.json');
    for (const p of site.enforcer.paths) {
      expect(existsSync(join(ROOT, p)), `enforcer path does not exist: ${p}`).toBe(true);
    }
    // ANCHORED: the ratchets this packet must NOT move. classFloor and machineryFloor are
    // FLOORS (check-hazard-registry.mjs:139,:364) — a 28th MACHINERY class clears both without
    // an edit, so any motion here is an out-of-scope ratchet edit.
    expect(registry.classFloor, 'classFloor moved — a floor edit is out of SCW-0\'s scope').toBe(27);
    expect(registry.machineryFloor, 'machineryFloor moved — a floor edit is out of SCW-0\'s scope').toBe(9);
    expect(registry.documentBaseline, 'documentBaseline moved').toBe(6);
    expect(registry.owedBaseline, 'owedBaseline moved').toBe(18);
  });
});
