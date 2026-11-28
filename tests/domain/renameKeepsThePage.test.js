/**
 * tests/domain/renameKeepsThePage.test.js — POINT 124, "A RENAME KEEPS THE PAGE", unit K1: THE KEYS STAND ON THE ID
 * (the chair's ruling E26; RENAME-BUILD; the measure RENAME-MEASURE, `docs/chair/2026-11-27/eleventh/rename/`).
 *
 * A town's page picks many lines at view time by a hash of a KEY. Where the key held the TOWN's NAME (Daily Life A1-A10,
 * the crisis vantage A18, the fortune lines A19/A20, the food-gap hook A16, the PDF/Foundry overview headline A26) a
 * rename of the town re-dealt the page; where it held a PERSON's name (the people headline A28) a rename of that person
 * did; where it held `_seed` (the desks A12-A14, viability A11, the arrangement A21, the tradition draws A22/A23, the
 * ring note A25, the scope line A29) an IMPORTED copy (the JSON import, the share, the gallery import drop `_seed`)
 * re-dealt it. Every one now keys on the record's own `id` through ONE helper, `domain/display/pickKey.js ::
 * pickKeyOf`, whose fallback (a record with no id) is the key the site had.
 *   (a) THE HELPER: the holder's id where it is a non-empty string; else the fallback, unchanged.
 *   (b) A TOWN's RENAME (the name only, as `renameSettlementImpl` writes it) re-deals no pick: every surface of the
 *       renamed town prints the base town's line with the new name in the old one's place.
 *   (c) A PERSON's RENAME (the converged writer, `applyNpcRenameToSettlement`) leaves the people headline's line.
 *   (d) AN IMPORTED COPY (the record with `_seed` dropped, as every road out of the owner's library drops it) prints
 *       the owner's line at every `_seed` site (a tradition set held fixed: the founding PREVIEW, `genesis.js`, is a
 *       golden-pinned founding derivation the world tick also mints from and is NOT re-keyed, see the build's notes).
 *   (e) THE FALLBACK: a record with no id keys as it did (its Daily Life is the Daily Life of the same record whose id
 *       IS its name: the name key).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { pickKeyOf } from '../../src/domain/display/pickKey.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { overviewHeadline, npcsHeadline } from '../../src/pdf/lib/headlines.js';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { governanceAccountOf } from '../../src/domain/display/governanceAccount.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { cultureScopeLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { describeTraditions } from '../../src/domain/traditions/traditionDescription.js';
import { applyNpcRenameToSettlement } from '../../src/domain/factionRename.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const NEW_TOWN = 'Quillmarsh';
const NEW_PERSON = 'Odalric Venn';
const HEAVY = 600_000;
/** @param {unknown} v */ const clone = (v) => JSON.parse(JSON.stringify(v));

/** @type {Array<{ seed: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) {
    const seed = `rename-keeps-${size}-0`;
    births.push({ seed, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
}, HEAVY);

/** @param {any} s */
const vmOf = (s) => buildViewModel({ settlement: s, aiSettlement: null, aiDailyLife: null, narrativeMode: false, systemState: null, eventLog: [], phase: 'draft', campaign: null });

/**
 * Every K1 surface of one record, as text: the Daily Life slots (owner), the PDF/Foundry overview headline and the
 * cover/overview crisis summaries, the Defense-side vantage (the PDF's defence slice), the Tonight sheet, the
 * governance paragraph (fortune), the plot hooks (the food-gap hook).
 * @param {any} s
 */
function townSurfaces(s) {
  const vm = vmOf(s);
  const life = deriveDailyLife(s, { audience: 'owner' });
  return {
    dailyLife: Object.entries(life.slots).map(([k, v]) => `${k}: ${/** @type {any} */ (v).text}`),
    overviewHeadline: String(overviewHeadline(vm.overview, vm.identity) ?? ''),
    vmCrisis: JSON.stringify([vm.crisis, vm.overview?.stress, vm.defense ?? null]),
    tonight: JSON.stringify(composeTonightSheet(s)),
    governance: String(governanceAccountOf(s)?.text ?? ''),
    hooks: collectPlotHooks(s).map((h) => String(h.text)),
  };
}

/** @param {unknown} v @param {string} from @param {string} to */
const swap = (v, from, to) => JSON.parse(JSON.stringify(v).split(from).join(to));

describe('(a) the helper: the id, else the site\'s own key', () => {
  it('takes a non-empty string id; anything else keeps the fallback unchanged', () => {
    expect(pickKeyOf({ id: 's_1', name: 'Ashford' }, 'Ashford')).toBe('s_1');
    expect(pickKeyOf({ name: 'Ashford' }, 'Ashford')).toBe('Ashford');
    expect(pickKeyOf({ id: '' }, 'Ashford')).toBe('Ashford');
    expect(pickKeyOf({ id: 7 }, 'Ashford')).toBe('Ashford');
    expect(pickKeyOf({ id: null }, null)).toBe(null);
    expect(pickKeyOf(null, 'x')).toBe('x');
    expect(pickKeyOf('s_1', 'x')).toBe('x');
  });
});

describe('(b) a town\'s rename re-deals no pick', () => {
  it('every K1 surface of the renamed town is the base town\'s with the new name in the old one\'s place', () => {
    const failures = collectSeedFailures(births, ({ seed, rec }) => {
      const base = townSurfaces(rec);
      const renamed = townSurfaces({ ...clone(rec), name: NEW_TOWN });
      expect(swap(renamed, NEW_TOWN, rec.name), `${seed} (${rec.name})`).toEqual(base);
    });
    expectNoSeedFailures(failures, 'a town\'s rename re-deals no pick on any birth');
  }, HEAVY);
});

describe('(c) a person\'s rename leaves the people headline', () => {
  it('the headline of the renamed top person is the base headline with the new name in the old one\'s place', () => {
    let seen = 0;
    const failures = collectSeedFailures(births, ({ seed, rec }) => {
      const vm = vmOf(rec);
      const top = vm.npcs?.sorted?.[0] ?? vm.npcs?.all?.[0];
      if (!top?.name || (vm.npcs?.all || []).length < 2) return;
      seen += 1;
      const before = String(npcsHeadline(vm.npcs) ?? '');
      const copy = clone(rec);
      applyNpcRenameToSettlement(copy, top.name, NEW_PERSON);
      const after = String(npcsHeadline(vmOf(copy).npcs) ?? '');
      expect(after.split(NEW_PERSON).join(top.name), `${seed} (${top.name})`).toBe(before);
    });
    expectNoSeedFailures(failures, 'a person\'s rename leaves the people headline on every birth');
    expect(seen, 'the arm saw a people headline that picks').toBeGreaterThan(0);
  }, HEAVY);
});

describe('(d) an imported copy prints the owner\'s line at every `_seed` site', () => {
  it('the desks (print prose), viability, the governance arrangement, the scope line, the ring note and the tradition draws', () => {
    const failures = collectSeedFailures(births, ({ seed, rec }) => {
      const copy = { ...clone(rec), _seed: undefined };
      delete copy._seed;
      const set = deriveFoundingTraditions(rec);
      const of = (/** @type {any} */ s) => JSON.stringify({
        prose: buildPrintProse(s), viability: deriveViability(s), governance: governanceAccountOf(s)?.text ?? null,
        scope: cultureScopeLine(s), ring: deriveCriminalStructure(s), traditions: describeTraditions(set, s),
      });
      expect(of(copy), `${seed} (${rec.name})`).toBe(of(rec));
    });
    expectNoSeedFailures(failures, 'an imported copy prints the owner\'s line at every `_seed` site');
  }, HEAVY);
});

describe('(e) the fallback: a record with no id keys as it did', () => {
  it('Daily Life of an id-less record is the Daily Life of the same record whose id is its name (the name key)', () => {
    const failures = collectSeedFailures(births, ({ seed, rec }) => {
      const idless = clone(rec); delete idless.id;
      const named = { ...clone(rec), id: rec.name };
      expect(deriveDailyLife(idless, { audience: 'owner' }), seed).toEqual(deriveDailyLife(named, { audience: 'owner' }));
    });
    expectNoSeedFailures(failures, 'an id-less record keys as it did on every birth');
  }, HEAVY);
});
