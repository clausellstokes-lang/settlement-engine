/**
 * generatorGoldenMaster.test.js — characterization (golden-master) guard.
 *
 * The deep-determinism test proves same-seed reproducibility WITHIN a build.
 * This proves something different and complementary: that the generator output
 * does not change ACROSS builds for a fixed corpus of configs+seeds. It exists
 * to make behavior-preserving refactors (de-minifying the big generators,
 * decomposing slices) provably safe — a pure syntactic rewrite must keep every
 * hash identical; any logic drift flips a hash and fails CI.
 *
 * The committed manifest (tests/fixtures/generator-golden-master.json) maps
 * "tier|culture|terrainOverride|trade|threat|seed" → sha256(JSON.stringify(settlement)).
 * To regenerate after an INTENTIONAL output change, run:
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js
 * and review the diff before committing.
 *
 * ── SHIFT RECORD ────────────────────────────────────────────────────────────
 * A hash manifest cannot show WHY it moved, so every re-record is written down
 * here. Re-recording without adding a row is a deleted alarm.
 *
 * 2026-08-03 — LANE MD, A ONE-BODY AMENDMENT INSIDE LANE RR'S WINDOW (1 row of
 *   525 moved). Chair-ruled as an amendment to the still-open RR window rather
 *   than a new disclosure event, and executed under that window's own recipe.
 *   Source commit 5dcad538; this is the re-record, its own commit as RR's was.
 *     THE CAUSE. `isolated.deficit` variant #1 continued past the `{channels}`
 *     splice with a bare COMMA, and `{channels}` is a LIST, so the continuation
 *     was swallowed by it: "…seasonal access, or patronage, at a price the
 *     settlement feels." reads as a fifth channel called "at a price". Closed
 *     with an em-dash. Variant #4's "…or patronage, and the arrangement is
 *     renegotiated…" was deliberately LEFT ALONE — a clause cannot be misread as
 *     a list item, only a phrase can, and touching it would have been a second
 *     unauthorised row. The rule is now `pin:channels-close` in
 *     tests/generators/settlementOriginProse.test.js, with a negative control
 *     asserting the exact shipped sentence fails it.
 *   PROVEN TO BE EXACTLY THAT ONE BODY BEFORE RE-RECORDING. All 525 settlements
 *   were regenerated as OBJECTS from COMMITTED BYTES on both sides — detached
 *   worktrees at 5ebc7b11 (the parent) and 5dcad538 — and deep-diffed field by
 *   field with array indices collapsed to [*]. The complete census of differing
 *   path-templates is ONE:
 *     $.settlementReason[*]                            1 change / 1 row
 *   Zero removed, zero added, zero array-length moves, zero key-order moves.
 *   The single row is town|germanic|plains|isolated|civilized|golden-master-v3,
 *   PREDICTED BEFORE THE EDIT by classifying all 525 rows' origin bodies by arm
 *   and variant index (isolated.deficit#1: 1 row; #2: 72 rows; the arm's other
 *   six variants: 0 rows), then confirmed by the golden reddening on that key
 *   and no other. TOTALITY: the parent-side regeneration reproduced the OLD
 *   manifest on all 525 rows (0 mismatches), which licenses the word "only" and
 *   additionally proves that nothing committed between c4de968a and 5ebc7b11 —
 *   lane MD's own pieces 1-3 included — moved generator output. The re-recorded
 *   fixture was produced in a clean detached worktree, never from the shared
 *   dirty tree, and cross-checks against an independently computed manifest with
 *   0 mismatches. Key set unchanged: 0 rows added, 0 deleted.
 *   ⚠️ CANONICAL-AT-ZERO IS UNTOUCHED: the amendment edits index 1, so every
 *   seedless caller stays byte-identical and pin:index-0 / pin:seedless are
 *   green without modification. This is a copy repair, not a widening — the pool
 *   is still eight arms of five.
 * 2026-08-03 — LANE RR, THE COMBINED RE-RECORD (all 525 rows moved). TWO causes
 *   ride one disclosed window under the chair's lane-RR ruling, so the estate
 *   takes ONE re-record instead of two. Source commit 21bf1041.
 *     (A) THE ORIGIN-RUNG WIDENING. `generateSettlementReason` held ONE sentence
 *         per arm (PT2-5: nine bodies over the whole config space, the DEFAULT
 *         road arm carrying exactly one). Each of the eight arms now holds five
 *         authored variants — 8 x 5 = 40 bodies (arithmetic corrected
 *         2026-08-03; the lane wrote 45, and commit 21bf1041's own subject line
 *         says "forty-five", which is immutable and stands uncorrected) —
 *         selected DRAW-FREE via
 *         kernel/proseHash.pickVariant from a key folding route, resolved
 *         terrain, the food-deficit flag, the special-resource endowment and the
 *         pipeline seed. Zero PRNG draws are consumed, which is why this is
 *         prose selection and not a stream fork. Pools live in
 *         src/generators/narrative/settlementOriginProse.js.
 *     (B) THE resourceIcon CAMELCASE CLOSURE. The second icon re-record this
 *         docstring predicted below. 56 dead `resourceIcon: ''` fields removed
 *         from src/data/supplyChainData.js; copyCorruption SIG 1 widened from
 *         `\bicon` (which is case-sensitive and could never see the camelCase
 *         compounds) to `[A-Za-z]*[Ii]con`.
 *   PROVEN TO BE EXACTLY THOSE TWO CLASSES BEFORE RE-RECORDING. All 525
 *   settlements were regenerated as OBJECTS from COMMITTED BYTES on both sides —
 *   detached worktrees at 32e25808 (the parent) and 21bf1041 — and deep-diffed
 *   field by field with array indices collapsed to [*]. The complete census of
 *   differing path-templates is TWO:
 *     $.economicState.activeChains[*].resourceIcon   4,462 removals / 477 rows
 *     $.settlementReason[*]                            412 changes  / 412 rows
 *   Zero `added`, zero array-length moves, zero key-order moves: no name, count,
 *   id, or rng draw moved. The 412 changes are ONE element per row — index 0,
 *   the origin body; the tier sentence at index 1 never moved, and the array
 *   lengths are unchanged (336 rows of 2, 189 rows of 1). No row ships a raw
 *   `{channels}` splice token. TOTALITY: the parent-side regeneration reproduced
 *   the OLD manifest on all 525 rows (0 mismatches), which proves these two are
 *   the ONLY sources of drift and that the four lanes that landed between
 *   0ab5e03e and 32e25808 moved no generator output. The re-recorded fixture was
 *   produced in a clean detached worktree at 21bf1041, never from the shared
 *   dirty tree, and cross-checks against an independently computed manifest with
 *   0 mismatches. Key set unchanged: 0 rows added, 0 deleted.
 *   ⚠️ THE PROMISE. This is a one-time, owner-disclosed break of the origin line
 *   every existing seed used to print. Going forward the choice is seed-stable.
 *   ⚠️ A GAP THIS CORPUS HAS, deliberately recorded rather than closed here:
 *   there is NO port × riverside row. The riverside rows take the `river` route
 *   and the port rows take coastal terrain, so the inland-river-port arm is
 *   invisible to this golden — and a world-law violation in that arm's authored
 *   prose passed this test and was caught only by generationWorldLaw.test.js.
 *   Adding a row is a golden ADDITION and therefore owner-signed (precedent
 *   aa33eba5); tests/generators/settlementOriginProse.test.js covers the arm in
 *   the meantime.
 * 2026-08-03 — THE ICON SWEEP (all 525 rows moved). Cause: d9a1ea5a, the owner's
 *   icon-sweep directive of 2026-08-03 ("remove ALL icons of any kind that are
 *   not logos"), which deleted 94 dead `icon: ""` slots from the src/data files
 *   that feed generation (resourceData.js, stressTypes.js, supplyChainData.js)
 *   and the `icon` fields of computeActiveChains.js's INSTITUTIONAL_SERVICE_MAP.
 *   PROVEN SHAPE-ONLY BEFORE RE-RECORDING: all 525 settlements were regenerated
 *   at HEAD and at HEAD-with-d9a1ea5a-reverted and deep-diffed field by field.
 *   The complete census of differing path-templates is FIVE, every one a key
 *   REMOVAL of a dead icon slot, none of them a value change:
 *     $.economicState.activeChains[*].needIcon            6,676 removals / 477 rows
 *     $.economicState.activeChains[*].resourceIcon        2,214 removals / 453 rows
 *     $.economicState.institutionalServices[*].icon       1,409 removals / 260 rows
 *     $.stress.icon                                         516 removals / 516 rows
 *     $.stressors.icon                                      516 removals / 516 rows
 *   Zero `changed`, zero `added`, zero array-length moves, zero key-order moves:
 *   no name, count, id, or rng draw moved. TOTALITY: the pre-sweep regeneration
 *   reproduced the OLD manifest on all 525 rows (0 mismatches), which proves the
 *   sweep is the ONLY cause of the drift and that nothing else had crept in.
 *   Old values removed were "" and the orphan U+FE0F variation selector — dead
 *   strings an earlier emoji strip had left behind, rendering nothing.
 *   EXPECT A SECOND ICON RE-RECORD — ⭐ TAKEN, by lane RR above, 2026-08-03.
 *   (Left as written so the prediction and its discharge sit together.) One
 *   correction the lane had to make to this paragraph's claim: of the residual
 *   slots it names, the TWO in src/domain/inferSupplyChains.js are NOT dead.
 *   They are required keys of the reviewed supply-chain persistence shape —
 *   admitReviewedSupplyChain rejects a chain missing either — so they were kept
 *   under a narrow, machine-checked allowlist in copyCorruption.test.js rather
 *   than swept. The 56 in src/data/supplyChainData.js were genuinely dead and
 *   are gone. Original text follows:
 *   the sweep removed only the slots whose value was the orphan
 *   U+FE0F, so 4,462 `activeChains[*].resourceIcon: ""` slots STILL ship in
 *   generated output, sourced from 56 residual `resourceIcon: ''` fields in
 *   src/data/supplyChainData.js (plus 2 `needIcon: ''` in
 *   src/domain/inferSupplyChains.js). tests/lint/copyCorruption.test.js SIG 1
 *   cannot see them: its regex is /\bicon\s*[:=]\s*(?:""|'')/, and `\bicon`
 *   is case-sensitive, so camelCase `resourceIcon`/`needIcon` never match.
 *   Closing that remainder will move these hashes again; that is expected.
 * 2026-08-03 — HK-3 (46255ad5), theme-aware hook draws. Owner-ruled; do not redo.
 * 2026-08-01 — I1 (99974c4a), four houses that trade in what is true. Owner-signed.
 * 2026-07-30 — mountain_pass seasonal tier (aa33eba5), a golden ADDITION. Owner-signed.
 */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { CULTURE_PROFILE_KEYS } from '../../src/domain/cultureProfiles.js';

const TIERS    = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
// Every selectable tradition is now mechanically meaningful, so stability
// coverage must include the complete canonical vocabulary. Keep the legacy
// mediterranean alias as an explicit compatibility row rather than allowing it
// to dominate a corpus that omitted most current choices.
const CULTURES = [...CULTURE_PROFILE_KEYS, 'mediterranean'];
// The pipeline's REAL terrain vocabulary. terrainOverride is the live key the
// pipeline reads (terrainHelpers.getTerrainType, resolveConfig, resolveResources);
// a bare `terrain` key is dead. These seven tokens are the ones getTerrainType
// returns and resolveConfig weights, so each value genuinely changes the terrain
// type, the terrain-specific resource pool, and the terrain institution modifiers.
const TERRAINS = ['plains', 'hills', 'forest', 'riverside', 'coastal', 'mountain', 'desert'];
// Each terrain is swept with the trade route that HONESTLY reaches its resources:
// water terrains (riverside/coastal) need river/port access to unlock their
// water-terrain resources, and a forest hamlet is reached by an isolated track.
// Pairing terrain with its natural route is what makes riverside/coastal exercise
// their full resource unlock rather than degrading to the road-access subset.
const TERRAIN_ROUTE = {
  plains: 'road', hills: 'road', forest: 'isolated',
  riverside: 'river', coastal: 'port', mountain: 'road', desert: 'road',
};
// 'mountain_pass' is the panel's seventh option. No route pool rolls it, so only an
// explicit config reaches it, and it was therefore the one selectable route with no
// golden row at all — the blind spot that let it score a neutral tier unnoticed.
const TRADE    = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass', 'none'];
const THREAT   = ['safe', 'civilized', 'frontier', 'plagued'];

/** The fixed corpus. One-dimension-at-a-time sweeps from a base config plus a
 *  full tier×culture×terrain grid — broad categorical-branch coverage without a
 *  combinatorial explosion. Each grid row pins terrainOverride (the live terrain
 *  key) paired with a terrain-honest trade route, so the seven terrains each drive
 *  a genuinely distinct output (distinct terrainType, terrain-specific resources,
 *  and terrain institution modifiers) rather than an inert echoed config string.
 *  Deterministic order; the seed is folded into each key so the manifest is
 *  stable. */
function corpus() {
  const rows = [];
  const base = { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
  const seed = 'golden-master-v3';
  // Full tier × culture × terrain grid (terrain paired with its honest route).
  for (const settType of TIERS) {
    for (const culture of CULTURES) {
      for (const terrainOverride of TERRAINS) {
        rows.push({ ...base, settType, culture, terrainOverride, tradeRouteAccess: TERRAIN_ROUTE[terrainOverride], _seed: seed });
      }
    }
  }
  // Sweep trade and threat independently from the base (plains baseline).
  for (const tradeRouteAccess of TRADE) rows.push({ ...base, tradeRouteAccess, _seed: seed });
  // The plains sweep row above holds the mountain_pass hash but exercises little of
  // it: a plains town runs a food surplus, so the seasonal import rung never bites.
  // This row puts the pass on the terrain it belongs to, where the structural
  // deficit makes the rung load-bearing.
  rows.push({ ...base, tradeRouteAccess: 'mountain_pass', terrainOverride: 'mountain', _seed: seed });
  for (const monsterThreat of THREAT) rows.push({ ...base, monsterThreat, _seed: seed });
  // Pin the random_trade machinery: the weighted terrain roll (TERRAIN_WEIGHTS)
  // and the terrain-constrained route pools (TERRAIN_ROUTE_POOLS) in
  // resolveConfig are reachable ONLY via tradeRouteAccess:'random_trade' with an
  // 'auto' (unpinned) terrain, so every fixed-route/fixed-terrain row above
  // bypasses them. terrainOverride 'auto' is required here: the base pins
  // 'plains', which suppresses the roll (doRandomTerrain needs an unset/auto
  // override). Seeded → deterministic. The 'mountain' variant pins the
  // override+random_trade interaction: the explicit override wins the terrain, so
  // doRandomTerrain stays false and the route rolls from the GENERIC pool, not
  // the terrain pool.
  for (const s of [seed, 'gm-seed-a', 'gm-seed-b', 'gm-seed-c']) {
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'auto', _seed: s });
    rows.push({ ...base, tradeRouteAccess: 'random_trade', terrainOverride: 'mountain', _seed: s });
  }
  // A few extra seeds on the base config (seed sensitivity is also locked).
  for (const s of ['gm-seed-a', 'gm-seed-b', 'gm-seed-c']) rows.push({ ...base, _seed: s });
  // The trade/threat sweeps re-include the base values; dedupe by key so each
  // config appears once.
  const seen = new Set();
  return rows.filter((c) => {
    const k = keyOf(c);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

const keyOf = (c) => [c.settType, c.culture, c.terrainOverride, c.tradeRouteAccess, c.monsterThreat, c._seed].join('|');

function hashFor(config) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master.json');

describe('generator golden master (cross-build output stability)', () => {
  const rows = corpus();

  if (process.env.UPDATE_GOLDEN) {
    // 525 full-pipeline generations overrun the root 20s testTimeout on
    // slow/parallel runners — a wall-clock false positive, not drift. Precedent:
    // worldMapMobileGate + pglite override blocks.
    // (recount 2026-08-03 — 523 was the PRE-HK-3 corpus size. This comment is
    // the one a re-recorder reads AT THE MOMENT OF RE-RECORDING, so a stale
    // figure here is the figure that ends up in the next shift record.)
    it('captures the golden manifest', () => {
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(out, Object.keys(out).sort(), 2) + '\n');
      expect(Object.keys(out).length).toBe(rows.length);
    }, 120_000);
    return;
  }

  it('manifest exists (run UPDATE_GOLDEN=1 to create it)', () => {
    expect(existsSync(MANIFEST)).toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  // Same wall-clock allowance as the capture block above.
  it('every config produces byte-identical output to the golden master', () => {
    const drift = [];
    for (const c of rows) {
      const k = keyOf(c);
      const got = hashFor(c);
      if (manifest[k] !== got) drift.push(k);
    }
    expect(drift).toEqual([]);
  }, 120_000);
});
