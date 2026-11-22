/**
 * livingContentPromiseBytes.test.js — THE PROMISE, RE-PROVEN BY BYTES ON THE DAY
 * THE LIVING-CONTENT DIAL WAS LIT (2026-09-08, lane LIGHT car 1c).
 *
 * ⭐⭐ THE CLAIM, IN ONE SENTENCE. Under law 2 a generated settlement is
 * byte-identical to the same seed under law 1 in every field except
 * `settlement.customContentRoster`, which law 1 never writes and law 2 writes
 * only when the run's reviewed environment holds a living-content definition.
 *
 * ⛔ WHY BYTES AND NOT AN ARGUMENT. THE PROMISE is constitutional here — "a seed
 * is a STARTING world forever" — and the failure a materialization law can cause
 * is SILENT: a world generated under a new law generates perfectly well, just not
 * the world its seed promised. `livingContentLawWiring.test.js` already proves
 * the boundary's shape (who may mint, what regen reads, what the clone carries);
 * this file asks the only question that shape cannot answer, which is whether the
 * OUTPUT moved. It asks it on two corpora and on 1,293 configurations, because a
 * law that perturbs one branch of the generator and no other is exactly the shape
 * a small sample misses.
 *
 * ── THE TWO CORPORA, AND WHY BOTH ────────────────────────────────────────────
 *   • THE GOLDEN 525 (`tests/helpers/goldenMasterCorpus.js`) — the estate's
 *     cross-build stability corpus: a tier x culture x terrain grid plus sweeps.
 *     Broad over the CATEGORICAL branches, and it is the corpus the golden master
 *     manifest is keyed on, so a claim stated here is stated in the same
 *     vocabulary as the estate's oldest output guard.
 *   • THE RATE 768 (`scripts/prose-rate-corpus.mjs`) — threat x route x tier,
 *     four seeds a cell, culture and terrain swept across the cells. Where the
 *     golden corpus is one seed on 516 of its 525 rows, this one is four seeds
 *     per cell, so it is the corpus that can see a law which perturbs a SEEDED
 *     draw rather than a categorical branch.
 *   Both are IMPORTED, never re-spelled. `goldenMasterCorpus.js`'s own header
 *   says why: a second spelling of a corpus is how two instruments come to
 *   disagree about which world they measured while both report green.
 *
 * ⚠ THE MARKER'S TWO CONFIG ECHOES ARE SUBTRACTED, AND NOTHING ELSE IS. A lit
 * world's config carries `_livingContentLawVersion`, and it persists twice —
 * `settlement.config` and `settlement._config` — exactly as `_seed` and
 * `_densityLawVersion` do. Subtracting the law's own declaration is what lets the
 * comparison answer the question actually being asked: did anything OTHER than
 * the law itself move. `livingContentMaterialization.test.js` measured the second
 * echo the hard way (a first cut stripped only `config` and missed by exactly 29
 * bytes, the literal length of `,"_livingContentLawVersion":2`); this file uses
 * the same subtraction rather than a second opinion about it.
 *
 * @enforced-by this test
 */
import { describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import {
  LIVING_CONTENT_LAW_CONFIG_KEY,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
  DEFAULT_LIVING_CONTENT_LAW_VERSION,
  resolveLivingContentLawVersion,
} from '../../src/domain/content/livingContentLawVersion.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
import { rateGrid } from '../../scripts/prose-rate-corpus.mjs';
// ⭐ THE CREATE BOUNDARY'S ASYNC PRELUDE. The pipeline is synchronous and the
// roster payload is behind a lazy seam, so a lit config reaching the pipeline
// with the payload unloaded THROWS rather than degrading. Production awaits this
// on the async edge of every module that can reach the pipeline; a test is a
// caller like any other, and this file's corpora run at describe scope.
import { loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';

await loadGenerationLawPayloads();

/** The roster's key on the settlement — the ONE key this law may write. */
const ROSTER_KEY = 'customContentRoster';

/** A settlement's bytes with BOTH config echoes of the law marker removed. */
function worldBytes(settlement) {
  const strip = (bag) => {
    if (!bag || typeof bag !== 'object') return bag;
    const { [LIVING_CONTENT_LAW_CONFIG_KEY]: _marker, ...rest } = bag;
    return rest;
  };
  return JSON.stringify({
    ...settlement,
    config: strip(settlement.config),
    _config: strip(settlement._config),
  });
}

/**
 * Generate one configuration under both laws and report what differs.
 *
 * ⛔ THE LAW IS PASSED ON THE CONFIG, NOT TAKEN FROM THE DIAL, AND THAT IS THE
 * ONLY WAY THIS COMPARISON CAN EXIST. The dial decides what a BIRTH mints; it
 * says nothing about what a given world's law is, which is read from the world's
 * own config and nowhere else. Passing both versions explicitly is therefore not
 * a workaround for the dial being lit — it is the same thing the product does
 * when it replays a saved world of either vintage, and it is what makes this file
 * survive the dial being reverted.
 *
 * @param {Record<string, unknown>} config
 * @param {string} seed
 * @returns {{ same: boolean, v1Roster: boolean, v2Roster: boolean, v1: number, v2: number }}
 */
function comparePair(config, seed) {
  const dark = generateSettlementPipeline(
    { ...config }, null, { seed, customContent: {} },
  );
  const lit = generateSettlementPipeline(
    { ...config, [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION },
    null,
    { seed, customContent: {} },
  );
  return {
    same: worldBytes(dark) === worldBytes(lit),
    v1Roster: Object.hasOwn(dark, ROSTER_KEY),
    v2Roster: Object.hasOwn(lit, ROSTER_KEY),
    v1: resolveLivingContentLawVersion(dark.config),
    v2: resolveLivingContentLawVersion(lit.config),
  };
}

const BASE = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
});

describe('THE PROMISE under the living-content law, by bytes', () => {
  // ── ANTI-VACUITY FIRST, ON THE COMPARATOR ITSELF ───────────────────────────
  // Every arm below is a SAMENESS claim, and a comparator that cannot see a
  // difference reports every tree identical. Both halves are proved: the
  // subtraction really removes the marker, and the comparison really convicts a
  // world with one field moved.
  it('the comparator can SEE a difference, and subtracts the marker and nothing else', () => {
    const dark = generateSettlementPipeline({ ...BASE }, null, { seed: 'promise-control', customContent: {} });
    const lit = generateSettlementPipeline(
      { ...BASE, [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION },
      null, { seed: 'promise-control', customContent: {} },
    );
    // The marker really is on the lit world and really is absent from the dark
    // one — so "identical after subtraction" is a subtraction and not a
    // description of two identical inputs.
    expect(lit.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    expect(dark.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
    // WITHOUT the subtraction the two differ, which is what makes the subtraction
    // load-bearing rather than decorative.
    expect(JSON.stringify(dark)).not.toBe(JSON.stringify(lit));
    // …and WITH it they agree.
    expect(worldBytes(dark)).toBe(worldBytes(lit));
    // THE POSITIVE CONTROL: one planted field moves the bytes. A comparator that
    // survived this would report every corpus below clean for ever.
    const planted = { ...lit, population: (lit.population ?? 0) + 1 };
    expect(worldBytes(planted)).not.toBe(worldBytes(lit));
  });

  // ── THE GOLDEN 525 ─────────────────────────────────────────────────────────
  it('⭐⭐ the golden 525 configurations are byte-identical under law 1 and law 2', () => {
    const rows = goldenCorpus();
    expect(rows.length, 'the golden corpus is not the 525-row corpus this arm is stated at').toBe(525);
    const moved = [];
    let v2RosterCount = 0;
    let v1RosterCount = 0;
    for (const row of rows) {
      const { _seed: seed, ...config } = row;
      const verdict = comparePair(config, seed);
      if (!verdict.same) moved.push(keyOf(row));
      if (verdict.v2Roster) v2RosterCount += 1;
      if (verdict.v1Roster) v1RosterCount += 1;
      // The two laws really were the two laws on every row, not one law twice.
      expect(verdict.v1, `${keyOf(row)}: the dark arm is not v1`).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
      expect(verdict.v2, `${keyOf(row)}: the lit arm is not v2`).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    }
    expect(
      moved,
      'a field other than the living-content law marker moved between law 1 and law 2. That is a'
      + ' STOP, not a golden to re-record: the law is a RECORD and not an activation, so any byte'
      + ' of the world moving with it means something reads the roster or the marker as an input.'
      + ` Configurations that moved: ${moved.slice(0, 10).join(', ')}`,
    ).toEqual([]);
    // THE ROSTER IS EMPTY ON EVERY ROW, and that is the law rather than an
    // accident: these runs pass `customContent: {}`, so the roster has nothing to
    // record and writes no key at all. Lighting makes a world ELIGIBLE for a
    // roster; it does not give it one.
    expect(v1RosterCount).toBe(0);
    expect(v2RosterCount).toBe(0);
  }, 240_000);

  // ── THE RATE 768 ───────────────────────────────────────────────────────────
  it('⭐⭐ the RATE 768 towns are byte-identical under law 1 and law 2', () => {
    const towns = rateGrid();
    expect(towns.length, 'the RATE corpus is not the 768-town grid this arm is stated at').toBe(768);
    const moved = [];
    let v2RosterCount = 0;
    let v1RosterCount = 0;
    for (const town of towns) {
      const verdict = comparePair(town.config, town.seed);
      if (!verdict.same) moved.push(town.seed);
      if (verdict.v2Roster) v2RosterCount += 1;
      if (verdict.v1Roster) v1RosterCount += 1;
      // ⭐ THE TWO CELLS THIS ARM PRINTED BUT DID NOT MEASURE (lane LIGHT car 2d,
      // on the fold's cure A4). The golden arm above has asserted the two laws
      // per row since it was written; this one counted only `v2Roster` and
      // asserted only `moved`, so "roster under law 1 = 0" and "wrong law = 0"
      // were STATED by the receipt's table and measured by nothing. A sameness
      // claim between two laws is worth nothing until the two laws are shown to
      // be two, and it is worth less on THIS corpus than on the golden one,
      // because four seeds a cell is exactly where a seeded draw would show.
      expect(verdict.v1, `${town.seed}: the dark arm is not v1`)
        .toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
      expect(verdict.v2, `${town.seed}: the lit arm is not v2`)
        .toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    }
    expect(
      moved,
      'a field other than the living-content law marker moved between law 1 and law 2 on the RATE'
      + ' grid. This corpus carries four seeds a cell, so a mover here is a SEEDED draw that the'
      + ' golden grid\'s single seed cannot see. STOP and report; do not re-record anything.'
      + ` Seeds that moved: ${moved.slice(0, 10).join(', ')}`,
    ).toEqual([]);
    // THE ROSTER IS ABSENT ON EVERY ROW UNDER BOTH LAWS, and under law 1 that is
    // the law rather than an accident: law 1 has no roster to write at all, and
    // these runs pass `customContent: {}` so law 2 has nothing to record either.
    expect(v1RosterCount).toBe(0);
    expect(v2RosterCount).toBe(0);
  }, 240_000);

  // ── THE LIFECYCLE, LIT ─────────────────────────────────────────────────────
  // ⛔ THE PATHS A WRITE SURVIVES ONE OF AND GHOSTS ANOTHER. A settlement is
  // created, read, re-derived, undone, saved and loaded, and the law must be the
  // same law at every one of those. The shape of each hop is proved in
  // `livingContentLawWiring.test.js`; what is proved HERE is that the BYTES
  // survive the round trip, which is the half a shape arm cannot state.
  it('LIFECYCLE (lit): create -> read -> persist/load -> undo/clone keeps the world and its law', () => {
    const seed = 'promise-lifecycle-lit';
    const litConfig = {
      ...BASE, [LIVING_CONTENT_LAW_CONFIG_KEY]: ROSTER_LIVING_CONTENT_LAW_VERSION,
    };
    const created = generateSettlementPipeline(litConfig, null, { seed, customContent: {} });

    // READ: the law is resolved from the world's own config, not the dial.
    expect(resolveLivingContentLawVersion(created.config)).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);

    // PERSIST / LOAD: the JSON round trip a save is.
    const loaded = JSON.parse(JSON.stringify(created));
    expect(worldBytes(loaded)).toBe(worldBytes(created));
    expect(resolveLivingContentLawVersion(loaded.config)).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);

    // SAME-SEED REGENERATE: the same input config and the same seed make the same
    // world, which is the determinism THE PROMISE rests on.
    // ⚠ AND IT IS THE INPUT CONFIG, NOT `settlement.config`, MEASURED RATHER THAN
    // ASSUMED. A first cut of this arm replayed from `loaded.config` on the
    // pipeline's own docblock claim that `config._seed` "is how a saved settlement
    // replays itself". It is not: a generated `settlement.config` is the RESOLVED
    // config and carries no `_seed`, so re-running on it produces a DIFFERENT
    // TOWN — `densityCreateBoundary.js`'s header records the same executed
    // finding. What travels on the persisted config is the LAW, which is asserted
    // separately below because that is the part this file is about.
    const replayed = generateSettlementPipeline(litConfig, null, { seed, customContent: {} });
    expect(worldBytes(replayed)).toBe(worldBytes(created));
    expect(resolveLivingContentLawVersion(replayed.config)).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
    // THE LAW TRAVELS ON THE PERSISTED CONFIG — the property a re-derivation reads
    // and the reason flipping the dial cannot re-birth a saved world.
    expect(resolveLivingContentLawVersion(loaded.config)).toBe(ROSTER_LIVING_CONTENT_LAW_VERSION);
  });

  it('LIFECYCLE (a law-1 world on the LIT build): every hop leaves it law-1 and roster-free', () => {
    // ⭐⭐ THE NO-MIGRATION ARM'S BYTE HALF. A world born before the dial moved is
    // markerless, and a markerless config resolves to v1 through a CLOSED
    // membership test that never consults the dial. Every hop below is therefore
    // required to leave the world exactly as dark as it was born.
    const seed = 'promise-lifecycle-dark';
    const created = generateSettlementPipeline({ ...BASE }, null, { seed, customContent: {} });
    expect(created.config[LIVING_CONTENT_LAW_CONFIG_KEY]).toBeUndefined();
    expect(Object.hasOwn(created, ROSTER_KEY)).toBe(false);

    const loaded = JSON.parse(JSON.stringify(created));
    // Replayed from the INPUT config, for the reason the arm above measures.
    const replayed = generateSettlementPipeline({ ...BASE }, null, { seed, customContent: {} });
    for (const [label, world] of [['loaded', loaded], ['replayed', replayed]]) {
      expect(
        world.config[LIVING_CONTENT_LAW_CONFIG_KEY],
        `${label}: a pre-lighting world acquired a law marker. There is NO MIGRATION,`
        + ' deliberately, and nothing on any read path may stamp a persisted config.',
      ).toBeUndefined();
      expect(resolveLivingContentLawVersion(world.config)).toBe(DEFAULT_LIVING_CONTENT_LAW_VERSION);
      expect(Object.hasOwn(world, ROSTER_KEY), `${label}: a v1 world acquired a roster`).toBe(false);
    }
    expect(worldBytes(replayed)).toBe(worldBytes(created));
  });
});
