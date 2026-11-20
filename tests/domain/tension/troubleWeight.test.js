/**
 * tests/domain/tension/troubleWeight.test.js — A CALM TOWN WITHOUT A TROUBLE OF WEIGHT KEEPS TODAY'S SHEET, BYTE FOR BYTE
 * (FRAME-2 · B2, the chair's CF1 as amended and CF11, final; the owner, 2026-11-20: "A calm town should be as it currently
 * is. Just a collection of people without a central issue if there is none. Don't invent drama capitalize on what's
 * already there if it's there.").
 *
 * THE PINS were taken at the working line's commit `7e0c77ae2` (no frame code), in an archive of that commit
 * (`git archive 7e0c77ae2 | tar -x`, this checkout's `node_modules` linked beside it), over the same births: the
 * generators did not change between that commit and the frame's line, so a seed births the same town at both. Each pin is
 * the first 16 hex of the sha256 of `JSON.stringify(composeTonightSheet(s))` as composed (no key dropped), or of the
 * Foundry journal's Tonight page text.
 *
 * The calm towns were chosen by measuring the 330-town calm pool (`frame-calm-<tier>-<i>`, FRAME-1's pool script): the
 * first four of each tier that hold NO trouble of weight. The towns in crisis are the first birth of each tier, in the
 * same seed series, that carries an active crisis.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet, TONIGHT_COPY } from '../../../src/domain/summary/tonightSheet.js';
import { castTroubleFrame } from '../../../src/domain/tension/troubleCast.js';
import { buildJournalPages } from '../../../src/foundry/journalPages.js';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const digest = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);
const born = (seed) => generateSettlementPipeline({ settType: seed.split('-')[2] }, null, { seed, customContent: {} });
const tonightPageOf = (s) => buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).find((p) => p.name === TONIGHT_COPY.title)?.markdown ?? '';

/** Calm towns of every tier with no trouble of weight: the sheet's digest at `7e0c77ae2`. */
const CALM_WITHOUT_WEIGHT = Object.freeze({
  'frame-calm-thorp-0': 'eb85297cfc5b5e59',
  'frame-calm-thorp-1': '38efdead570be137',
  'frame-calm-thorp-7': 'f8baaf1868bbcff7',
  'frame-calm-thorp-9': '0dbe4d9e56157118',
  'frame-calm-hamlet-0': '2e7b1a18abb52a34',
  'frame-calm-hamlet-3': 'f248c198e2a4fc6a',
  'frame-calm-hamlet-5': 'fc803552503673a9',
  'frame-calm-hamlet-6': '0f2ea86d413136d4',
  'frame-calm-village-3': '72a02e919a368970',
  'frame-calm-village-6': '17fb4f6aa1288677',
  'frame-calm-village-8': '8f015fb66776dc1f',
  'frame-calm-village-9': '361d39bd34dd2129',
  'frame-calm-town-0': '50803a3fd91acd6c',
  'frame-calm-town-2': '288c3510ace48700',
  'frame-calm-town-3': '60993785dfe8ca81',
  'frame-calm-town-4': 'b810400e8b4d4c44',
  'frame-calm-city-1': '3c7240562c56a3f3',
  'frame-calm-city-2': 'c07a11cb60f28215',
  'frame-calm-city-5': '0cf014d418879d21',
  'frame-calm-city-6': 'b860827c3dc20ffe',
  'frame-calm-metropolis-3': '70713bfff0272234',
  'frame-calm-metropolis-4': 'b8f48be71e29eff3',
  'frame-calm-metropolis-6': 'aa21ef8debf8b3e6',
  'frame-calm-metropolis-7': '95d9a680944f6f10',
});

/** The journal's Tonight page text of two of them at `7e0c77ae2`: the rendered sheet is held, not only the object. */
const JOURNAL_TONIGHT = Object.freeze({
  'frame-calm-thorp-0': '5350507f9d517515',
  'frame-calm-thorp-1': '195c36f6e30841a1',
});

/** A town in crisis of every tier: the sheet's digest at `7e0c77ae2`. */
const IN_CRISIS = Object.freeze({
  'frame-calm-thorp-2': '05546993e0ac6ff1',
  'frame-calm-hamlet-1': 'b6150a0c2ee81edc',
  'frame-calm-village-1': 'a5387ed63cd9cac4',
  'frame-calm-town-6': '4243a02c390c9a6a',
  'frame-calm-city-24': '385c00c79c91f40b',
  'frame-calm-metropolis-0': '4b26a1c208b3f083',
});

/**
 * Towns WITH a trouble of weight, one for each strain that opens a sheet on the pool, and the tension the order picks
 * (its type and its place in `history.currentTensions`). No calm thorp of the 55 holds one.
 */
const WITH_WEIGHT = Object.freeze([
  { seed: 'frame-calm-hamlet-17', type: 'succession_crisis', at: 0, why: 'legitimacy below 45, a tension about the seat by its matter' },
  { seed: 'frame-calm-hamlet-19', type: 'corruption_scandal', at: 0, why: 'legitimacy below 45; the scandal names the ruling power as its first side' },
  { seed: 'frame-calm-village-76', type: 'legitimacy_crisis', at: 0, why: 'the incumbent ungated (graded with legitimacy below 30)' },
  { seed: 'frame-calm-village-49', type: 'succession_crisis', at: 1, why: 'legitimacy below 45 outranks the impaired chain the market crash at #0 is about' },
  { seed: 'frame-calm-city-4', type: 'corruption_scandal', at: 2, why: 'a high conflict whose party is a side' },
  { seed: 'frame-calm-village-20', type: 'resource_scarcity', at: 1, why: 'an impaired chain, a material tension' },
]);

describe('a calm town without a trouble of weight keeps today\'s sheet, byte for byte (CF11)', () => {
  it(`${Object.keys(CALM_WITHOUT_WEIGHT).length} calm towns of every tier: the sheet digests as at 7e0c77ae2, and no frame is cast`, () => {
    const failures = collectSeedFailures(Object.keys(CALM_WITHOUT_WEIGHT), (seed) => {
      const s = born(seed);
      expect(castTroubleFrame(s), `${seed} casts no frame`).toBe(null);
      expect(digest(JSON.stringify(composeTonightSheet(s))), seed).toBe(CALM_WITHOUT_WEIGHT[seed]);
    });
    expectNoSeedFailures(failures, 'a calm town without a trouble of weight keeps the sheet of 7e0c77ae2');
  }, 300000);

  it('the journal\'s Tonight page text of two of them digests as at 7e0c77ae2 (the rendered sheet, not only the object)', () => {
    const failures = collectSeedFailures(Object.keys(JOURNAL_TONIGHT), (seed) => {
      const text = tonightPageOf(born(seed));
      expect(text.length, seed).toBeGreaterThan(0);
      expect(digest(text), seed).toBe(JOURNAL_TONIGHT[seed]);
    });
    expectNoSeedFailures(failures, 'the journal Tonight page of a calm town without weight is the page of 7e0c77ae2');
  }, 300000);
});

describe('a town in crisis keeps its crisis sheet, byte for byte', () => {
  it(`${Object.keys(IN_CRISIS).length} towns in crisis, one a tier: the sheet digests as at 7e0c77ae2`, () => {
    const failures = collectSeedFailures(Object.keys(IN_CRISIS), (seed) => {
      const s = born(seed);
      const sheet = composeTonightSheet(s);
      expect(sheet.crisis, `${seed} is in crisis`).toBeTruthy();
      expect(digest(JSON.stringify(sheet)), seed).toBe(IN_CRISIS[seed]);
    });
    expectNoSeedFailures(failures, 'a town in crisis keeps the sheet of 7e0c77ae2');
  }, 300000);
});

describe('a calm town with a trouble of weight opens on the trouble the order picks (liveness)', () => {
  it(`${WITH_WEIGHT.length} towns, one for each strain that opens a sheet: the frame opens on the tension the order picks`, () => {
    const failures = collectSeedFailures(WITH_WEIGHT, ({ seed, type, at, why }) => {
      const s = born(seed);
      expect(castTroubleFrame(s), `${seed}: ${why}`).toMatchObject({ type, at });
      const sheet = composeTonightSheet(s);
      expect(sheet.frame?.type, seed).toBe(type);
      expect(sheet.frame?.line, seed).toBe(s.history.currentTensions[at].description.replace(/\s+/g, ' ').trim());
    });
    expectNoSeedFailures(failures, 'a town with a trouble of weight opens on the trouble the order picks');
  }, 300000);
});
