/**
 * fortuneLawSavedTown.test.js — THE FORTUNE LAW'S OWN SAVED-TOWN ARM: THE SURVEYOR'S PREVIEW IS UNMINTED, ON THE LIT
 * BUILD (FORTUNE-4, unit U7 "SAVED-TOWN"; tests only).
 *
 * ⭐ WHAT THIS FILE HOLDS SINCE THE JOIN (CLOSE-1 unit 3, the chair's E61 (4)): THE FORTUNE LAW'S OWN ARM, AND ONLY
 * THAT. The arms every generation law shares moved to `tests/domain/generationLawsSavedPlace.test.js`, which walks
 * every row of `GENERATION_LAWS` at once with every dial lit, on this file's own harness (`buildUnder`, generalised
 * to a set of lit laws): the fixture's ground and the re-derive's NEGATIVE CONTROL (old 0 and 1's control) are its
 * (f); NO MIGRATION through save, load, regenSection, the edit re-derive, the clone seam and play (old 1) its (a); THE
 * CONVERSE (old 2) its (b); "Apply Saved Configuration & Regenerate" and the full reroll are BIRTHS (old 4a, 4b) its
 * (d); THE LEGACY EDGE (old 5) its (e); THE IMPORT (old 6) the import step of its (a) and (b). What stays is what only
 * the fortune lane ruled: the surveyor's construction preview is a PREVIEW, so the dossier its commit saves is
 * unminted even on the lit build (arm 3, its number kept).
 *
 * ⭐ TWO BUILDS IN ONE FILE, BY THE WIRING FILE'S SEAM. The fortune law's module is replaced through `vi.doMock` with
 * its real reader kept and only the dial and the mint set, and the generation graph is re-imported under it: once
 * DARK (the dial at the default: the product today) and once LIT (`NEW_SETTLEMENT_FORTUNE_LAW_VERSION =
 * SIZE_RELATIVE_FORTUNE_LAW_VERSION`, so a birth mints 2). Neither half reads the product's dial, so the chair's flip
 * cannot make either half vacuous, and the arm opens by asserting the build it runs on IS lit.
 *
 * @enforced-by this test
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const LAW = '../../src/domain/fortune/fortuneLaw.js';
const KEY = '_fortuneLawVersion';

/** A metropolis the law WOULD move (its standing band differs between the two laws). */
const METRO = Object.freeze({
  settType: 'metropolis',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'crossroads',
  monsterThreat: 'civilized',
});
const SEED = 'saved-town-metropolis-0';
const LONG = 180_000;

/**
 * The generation graph re-imported under a fortune dial set to `version`: the wiring file's seam
 * (`fortuneLawWiring.test.js :: boundaryWithLitFortuneLaw`), with the real reader kept.
 * @param {number} version
 */
async function buildUnder(version) {
  vi.resetModules();
  vi.doMock(LAW, async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      NEW_SETTLEMENT_FORTUNE_LAW_VERSION: version,
      newSettlementFortuneLaw: () => (version === actual.DEFAULT_FORTUNE_LAW_VERSION
        ? {}
        : { [actual.FORTUNE_LAW_CONFIG_KEY]: version }),
    };
  });
  const law = await import('../../src/domain/fortune/fortuneLaw.js');
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const vocab = await import('../../src/domain/construct/configVocabulary.js');
  const localPipeline = await import('../../src/lib/localPipeline.js');
  await boundary.loadGenerationLawPayloads();
  return { law, boundary, vocab, localPipeline };
}

/** The law a world (or a bare config) carries, read by the real reader of graph `G`. */
function lawOf(G, worldOrConfig) {
  const isWorld = Object.hasOwn(worldOrConfig, 'name') || Object.hasOwn(worldOrConfig, '_config');
  const config = isWorld ? worldOrConfig.config : worldOrConfig;
  const echo = isWorld ? worldOrConfig._config : undefined;
  return {
    config: config && Object.hasOwn(config, KEY) ? config[KEY] : 'absent',
    echo: echo && Object.hasOwn(echo, KEY) ? echo[KEY] : 'absent',
    reads: G.law.resolveFortuneLawVersion(worldOrConfig),
  };
}

/** @type {Awaited<ReturnType<typeof buildUnder>>} */
let DARK;
/** @type {Awaited<ReturnType<typeof buildUnder>>} */
let LIT;

beforeAll(async () => {
  DARK = await buildUnder(1);
  LIT = await buildUnder(2);
}, LONG);

afterAll(() => {
  vi.doUnmock(LAW);
  vi.resetModules();
});

/** THE GUARD at the top of the arm: the build this file calls lit IS lit, and the dark one dark. */
function expectBuildsLit() {
  expect(LIT.law.NEW_SETTLEMENT_FORTUNE_LAW_VERSION, 'the LIT build is not lit — the arm is vacuous')
    .toBe(LIT.law.SIZE_RELATIVE_FORTUNE_LAW_VERSION);
  expect(LIT.boundary.birthConfig({ ...METRO })[KEY], 'a birth on the LIT build mints no marker').toBe(2);
  expect(DARK.law.NEW_SETTLEMENT_FORTUNE_LAW_VERSION).toBe(DARK.law.DEFAULT_FORTUNE_LAW_VERSION);
  expect(Object.hasOwn(DARK.boundary.birthConfig({ ...METRO }), KEY), 'a DARK birth minted a marker').toBe(false);
}

describe('SAVED-TOWN: the fortune law\'s own saved-town arm, on the LIT build', () => {
  it('3. THE FORTUNE LAW\'S OWN — the surveyor\'s preview is UNMINTED, pinned as ruled: ConstructionPanel commit saves a markerless law-1 dossier on the LIT build', async () => {
    expectBuildsLit();
    // The module path the commit's dossier comes from: the config wall, then the local engine
    // seam's pipeline door with NO birthConfig (`ConstructionPanel.jsx :: generate`), then the
    // row `{ settlement: dossier, config: result.config }` (`:: commit`).
    const { config } = LIT.vocab.validateSettlementConfig({ ...METRO });
    const { generateSettlementPipeline } = await LIT.localPipeline.loadLocalPipeline();
    const dossier = generateSettlementPipeline(config, null, { seed: SEED });
    const row = { name: dossier.name, tier: dossier.tier, settlement: dossier, config };
    expect(lawOf(LIT, row.settlement)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
    expect(lawOf(LIT, row.config)).toEqual({ config: 'absent', echo: 'absent', reads: 1 });
    // The ground of the ruling: the same config through a BIRTH on this build is law 2.
    expect(LIT.boundary.birthConfig(config)[KEY]).toBe(2);
  }, LONG);
});
