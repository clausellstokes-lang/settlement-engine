/**
 * ARRIVAL-LINES-2 (the chair's read of 2026-11-20 20:02; its common rules of 20:31; its ruling 13 of 22:34): the landmark
 * SAID from the house that stands, through `src/data/arrivalLandmarkWordings.js`. `checkInstCompat` hands back the drawn
 * landmark with its branch, index and row; the arrival site composes `[drawnRowOf(landmark), ...landmarkSiblingsOf(branch)]`,
 * the list passes the door's filter WHOLE (house, then `filterDeclared` on the facts), the drawn line included, and a keyed
 * `pickVariantMixed` says one; nothing admitted, the culture's built detail speaks. Every anchor is COMPUTED: checkInstCompat's
 * lines are drawn from it at a chosen index (a held roll), the new ones read from the data file, the admitted set from the
 * record's own readers (`factsOf`, `declarationAdmits`), the "unwired" paragraph from the same composer with the door said as
 * the drawn line (a mocked door), never quoted.
 */
import { readFileSync } from 'node:fs';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { LANDMARK_WORDINGS, drawnRowOf, houseStands, landmarkSiblingsOf, sayLandmark } from '../../src/data/arrivalLandmarkWordings.js';
import { checkInstCompat } from '../../src/generators/structuralValidator.js';
import { composeArrivalScene } from '../../src/generators/narrative/arrivalScene.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** A native roster that reaches each branch of checkInstCompat (first match wins). */
const REACHES = /** @type {Record<string, string[]>} */ ({
  'great cathedral': ['great cathedral'],
  cathedral: ['cathedral (10,000+ only)'],
  'massive wall / citadel': ['massive walls and fortifications', 'citadel'],
  'wall / gatehouse': ['town walls', 'gates (if walled)'],
});
/** checkInstCompat's own landmark of a branch at an index: its one roll held at the slot's floor (never quoted). */
const drawnAt = (/** @type {string} */ branch, /** @type {number} */ index) => {
  setActiveRng({ random: () => (index + 0.5) / 2 });
  try { return /** @type {any} */ (checkInstCompat(REACHES[branch].map((name) => ({ name })), 'city', 50)); } finally { clearActiveRng(); }
};
const factsWith = ({ walls = true, gate = true, church = true, siege = false } = {}) => ({
  defence: { walls, gate },
  faith: { hasChurch: church },
  crisis: { active: siege, has: (/** @type {string} */ k) => siege && (k === 'under_siege' || k === 'any') },
});
const ALL_HOUSES = ['great cathedral', 'cathedral (10,000+ only)', 'citadel', 'massive walls and fortifications', 'city walls and gates', 'town walls', 'gates (if walled)'];
const KEYS = Array.from({ length: 400 }, (_, i) => `seed-${i}::landmark`);
const candidates = (/** @type {string} */ branch, /** @type {number} */ index) => [drawnRowOf(drawnAt(branch, index)), ...landmarkSiblingsOf(branch)];
const saidOver = (/** @type {any[]} */ list, /** @type {string[]} */ names, /** @type {any} */ facts) => new Set(KEYS.map((k) => sayLandmark(list, names, facts, k)));
const admits = (/** @type {any} */ r, /** @type {any} */ facts) => declarationAdmits(declarationOf(r), facts).admitted;
const SLOTS = LANDMARK_WORDINGS.flatMap((b) => [0, 1].map((index) => ({ branch: b.branch, index })));

afterEach(() => clearActiveRng());

describe('a literal has one home: checkInstCompat\'s lines are named by branch and index, never copied or keyed by text', () => {
  const source = readFileSync(new URL('../../src/data/arrivalLandmarkWordings.js', import.meta.url), 'utf8');
  it('each of the four branches: two lines in checkInstCompat, named by branch and index, their declarations read from their own rows, neither text in this file', () => {
    for (const b of LANDMARK_WORDINGS) {
      const drawn = [drawnAt(b.branch, 0), drawnAt(b.branch, 1)];
      expect(drawn.map((d) => [d.branch, d.index]), b.branch).toEqual([[b.branch, 0], [b.branch, 1]]);
      expect(new Set(drawn.map((d) => d.text)).size, b.branch).toBe(2);
      for (const d of drawn) {
        const row = drawnRowOf(d);
        expect(row.id).toBe(`${b.branch}/${d.index}`);
        expect(declarationOf(row), `${row.id}: the declaration is checkInstCompat's row's`).toEqual(declarationOf(typeof d.line === 'object' ? d.line : { text: d.text }));
        expect(source.includes(d.text), `copied: ${d.text}`).toBe(false);
      }
      expect(b.said.every((r) => r.id.startsWith(`${b.branch}/+`))).toBe(true);
    }
  });
});

describe('the door: a landmark line is said only where its house stands, the drawn line included', () => {
  for (const { branch, index } of SLOTS) {
    it(`${branch} [${index}]: every admitted row is reached where everything stands; none whose house is absent`, () => {
      const list = candidates(branch, index);
      const facts = factsWith();
      expect([...saidOver(list, ALL_HOUSES, facts)].sort()).toEqual(list.filter((r) => admits(r, facts)).map((r) => r.text).sort());
      for (const r of landmarkSiblingsOf(branch)) {
        const names = ALL_HOUSES.filter((n) => !r.house.some((h) => n.includes(h)));
        expect(saidOver(list, names, facts).has(r.text), `${r.id} without its house`).toBe(false);
      }
    });
  }
  it('a row whose declaration the record refuses is never said, the drawn line included (walls, gate, church taken away)', () => {
    for (const [atom, facts] of /** @type {const} */ ([['walls', factsWith({ walls: false })], ['gate', factsWith({ gate: false })], ['church', factsWith({ church: false })]])) {
      let refusedDrawn = 0;
      for (const { branch, index } of SLOTS) {
        const list = candidates(branch, index);
        if ((list[0].needs || []).includes(atom)) refusedDrawn += 1;
        for (const text of saidOver(list, ALL_HOUSES, facts)) {
          if (text == null) continue;
          expect((list.find((r) => r.text === text)?.needs || []).includes(atom), `${atom}: ${text}`).toBe(false);
        }
      }
      if (atom !== 'church') expect(refusedDrawn, atom).toBeGreaterThan(0);
    }
  });
  it('where nothing is admitted the door answers null (the built detail speaks)', () => {
    expect(saidOver(candidates('wall / gatehouse', 0), ALL_HOUSES, factsWith({ walls: false, gate: false }))).toEqual(new Set([null]));
  });
  it('under siege no line that excludes it is said, the drawn line included ("unremarkable but intact" among them)', () => {
    const siege = factsWith({ siege: true });
    let excluding = 0;
    for (const { branch, index } of SLOTS) {
      const list = candidates(branch, index);
      if ((list[0].excludes || []).includes('crisis: under_siege')) excluding += 1;
      for (const text of saidOver(list, ALL_HOUSES, siege)) {
        expect((list.find((r) => r.text === text)?.excludes || []).includes('crisis: under_siege'), String(text)).toBe(false);
      }
    }
    expect(excluding).toBeGreaterThan(0);
  });
  it('a branch with no wordings here has no siblings; every new row\'s house is a native-name fragment its branch reaches', () => {
    expect(landmarkSiblingsOf('mage tower')).toEqual([]);
    for (const b of LANDMARK_WORDINGS) for (const r of b.said) expect(houseStands(r, ALL_HOUSES), r.id).toBe(true);
  });
});

// ═════ THE WIRED SITE: `arrivalScene.js :: composeArrivalScene`, on records whose facts the real readers answer ═════
const BUILT = 'steep roofs mark the older lanes';
const record = (/** @type {string} */ tier, /** @type {Array<string | { name: string, status: string }>} */ houses, over = {}) => ({
  name: 'Q', tier,
  config: { tradeRouteAccess: 'road', culture: 'germanic', priorityMagic: 0 },
  institutions: houses.map((h) => (typeof h === 'string' ? { name: h, category: 'Infrastructure' } : { category: 'Infrastructure', ...h })),
  stress: null,
  culturalIdentity: { architecturalDetail: BUILT },
  economicState: { prosperity: 'Moderate', safetyProfile: { safetyLabel: 'Moderate' }, primaryExports: [], incomeSources: [] },
  history: { historicalEvents: [] },
  ...over,
});
/** The composer on its own seeded arrival substream, as the assembly step runs it; every call on the stream counted. */
const scene = (/** @type {any} */ compose, /** @type {any} */ rngApi, /** @type {any} */ s, /** @type {string} */ seed) => {
  const r = rngApi.createPRNG(seed).fork('arrival-scene'); let calls = 0;
  rngApi.setActiveRng(new Proxy(r, { get: (t, k) => { const v = t[k]; return typeof v === 'function' ? (/** @type {any[]} */ ...a) => { calls += 1; return v.apply(t, a); } : v; } }));
  try { return { text: /** @type {string} */ (compose(s)), calls }; } finally { rngApi.clearActiveRng(); }
};
const REAL = { createPRNG, setActiveRng, clearActiveRng };
const SEEDS = Array.from({ length: 400 }, (_, i) => `landmark-said-${i}`);
/** Every landmark row a branch can say (both drawn lines, its siblings). */
const rowsOf = (/** @type {string} */ branch) => [drawnRowOf(drawnAt(branch, 0)), drawnRowOf(drawnAt(branch, 1)), ...landmarkSiblingsOf(branch)];
/** The rows the door may say on this record: house standing among its native names, declaration admitted by its facts. */
const admittedOn = (/** @type {any} */ s, /** @type {string} */ branch) => {
  const names = s.institutions.map((/** @type {any} */ i) => String(i.name).toLowerCase());
  const facts = factsOf(s);
  return rowsOf(branch).filter((r) => houseStands(r, names) && admits(r, facts));
};
const saidRows = (/** @type {string} */ text, /** @type {string} */ branch) => rowsOf(branch).filter((r) => text.includes(r.text));

/** label, branch, tier, roster, extra: every house standing; a house absent; ruined houses (the readers refuse walls, gate, church); a siege. */
const CASES = /** @type {Array<[string, string, string, Array<string | { name: string, status: string }>, object?]>} */ ([
  ['all stand', 'great cathedral', 'metropolis', ['Great cathedral']],
  ['all stand', 'cathedral', 'city', ['Cathedral (10,000+ only)']],
  ['all stand', 'massive wall / citadel', 'city', ['Massive walls and fortifications', 'Citadel']],
  ['all stand', 'wall / gatehouse', 'town', ['Town walls', 'Gates (if walled)']],
  ['no massive walls', 'massive wall / citadel', 'city', ['Citadel']],
  ['no citadel', 'massive wall / citadel', 'city', ['Massive walls and fortifications']],
  ['no gate-named house', 'wall / gatehouse', 'town', ['Town walls']],
  ['no walls-named house', 'wall / gatehouse', 'town', ['Gates (if walled)']],
  ['ruined walls and gates', 'wall / gatehouse', 'town', [{ name: 'Town walls', status: 'ruined' }, { name: 'Gates (if walled)', status: 'ruined' }]],
  ['ruined walls', 'massive wall / citadel', 'city', [{ name: 'Massive walls and fortifications', status: 'ruined' }]],
  ['ruined cathedral', 'cathedral', 'city', [{ name: 'Cathedral (10,000+ only)', status: 'ruined' }]],
  ['ruined great cathedral', 'great cathedral', 'metropolis', [{ name: 'Great cathedral', status: 'ruined' }]],
  ['under siege (the crisis container), no vignette', 'wall / gatehouse', 'town', ['Town walls', 'Gates (if walled)'], { stressors: [{ type: 'under_siege' }] }],
]);

describe('the wired site: a landmark line is said only where its house stands and its record admits it, the drawn line included', () => {
  for (const [label, branch, tier, houses, over] of CASES) {
    it(`${branch}, ${label}: over ${SEEDS.length} seeds the lines said are exactly the admitted rows; nothing admitted, the built detail`, () => {
      const s = record(tier, houses, over);
      const expected = admittedOn(s, branch).map((r) => r.text).sort();
      const said = new Set();
      for (const seed of SEEDS) {
        const { text } = scene(composeArrivalScene, REAL, s, seed);
        const rows = saidRows(text, branch);
        expect(rows.length, `${seed}: at most one landmark line`).toBeLessThanOrEqual(1);
        if (!rows.length) expect(text.toLowerCase(), `${seed}: nothing admitted, the built detail speaks`).toContain(BUILT);
        for (const r of rows) said.add(r.text);
      }
      expect([...said].sort()).toEqual(expected);
    });
  }
  it('the refusals are not vacuous: some case refuses a drawn line by its declaration, and the siege case holds the siege and refuses a line that excludes it', () => {
    const refusedDrawn = CASES.filter(([, branch, tier, houses, over]) => {
      const s = record(tier, houses, over); const ok = admittedOn(s, branch).map((r) => r.id);
      return [0, 1].some((i) => !ok.includes(`${branch}/${i}`));
    });
    expect(refusedDrawn.length).toBeGreaterThan(0);
    const [, branch, tier, houses, over] = /** @type {any} */ (CASES.find(([label]) => label.startsWith('under siege')));
    const s = record(tier, houses, over);
    expect(factsOf(s).crisis.has('under_siege')).toBe(true);
    const excluding = rowsOf(branch).filter((r) => (r.excludes || []).includes('crisis: under_siege'));
    expect(excluding.length).toBeGreaterThan(0);
    expect(excluding.some((r) => r.id === `${branch}/0`), 'the drawn line among them').toBe(true);
    for (const r of excluding) expect(admittedOn(s, branch).map((x) => x.id)).not.toContain(r.id);
  });
});

describe('the keyed pick is draw-free', () => {
  /** The same composer with the door saying the drawn line, as the site did before it was wired (a fresh module graph). */
  let unwired = /** @type {any} */ (null);
  beforeAll(async () => {
    vi.resetModules();
    vi.doMock('../../src/data/arrivalLandmarkWordings.js', async (importOriginal) => ({
      ...(/** @type {object} */ (await importOriginal())),
      sayLandmark: (/** @type {any[]} */ list) => list[0]?.text ?? null,
    }));
    const [arrival, rng, prng, pipeline, density, store] = await Promise.all([
      import('../../src/generators/narrative/arrivalScene.js'), import('../../src/kernel/rngContext.js'), import('../../src/kernel/prng.js'),
      import('../../src/generators/generateSettlementPipeline.js'), import('../../src/domain/density/densityCreateBoundary.js'), import('../../src/store/configSlice.js'),
    ]);
    unwired = { compose: arrival.composeArrivalScene, rng: { createPRNG: prng.createPRNG, setActiveRng: rng.setActiveRng, clearActiveRng: rng.clearActiveRng },
      birth: pipeline.generateSettlementPipeline, birthConfig: density.birthConfig, load: density.loadGenerationLawPayloads, DEFAULT_CONFIG: store.DEFAULT_CONFIG };
    vi.doUnmock('../../src/data/arrivalLandmarkWordings.js');
    vi.resetModules();
    await unwired.load();
    await loadGenerationLawPayloads();
  }, 120_000);

  it('the same seed says the same line, and the arrival stream is read exactly as often as before the door', () => {
    for (const [, , tier, houses, over] of CASES) {
      const s = record(tier, houses, over);
      for (const seed of SEEDS.slice(0, 60)) {
        const a = scene(composeArrivalScene, REAL, s, seed);
        expect(scene(composeArrivalScene, REAL, s, seed)).toEqual(a);
        expect(a.calls, `${seed}: the stream's reads`).toBe(scene(unwired.compose, unwired.rng, s, seed).calls);
      }
    }
  });

  it('on a sample of births every stored field other than the arrival paragraph is unchanged, and the paragraph moves somewhere', () => {
    const born = (/** @type {any} */ g, /** @type {string} */ size, /** @type {string} */ seed) => g.birth(g.birthConfig({ ...g.DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const real = { birth: generateSettlementPipeline, birthConfig, DEFAULT_CONFIG };
    let moved = 0;
    for (const size of ['town', 'city', 'metropolis']) for (let i = 0; i < 4; i++) {
      const seed = `hxd-${size}-${i}`;
      const { arrivalScene: a, ...restA } = /** @type {any} */ (born(real, size, seed));
      const { arrivalScene: b, ...restB } = /** @type {any} */ (born(unwired, size, seed));
      expect(JSON.stringify(restA), `${seed}: every stored field but the arrival paragraph`).toBe(JSON.stringify(restB));
      if (a !== b) moved += 1;
    }
    expect(moved, 'the sample prints a keyed landmark somewhere').toBeGreaterThan(0);
  }, 120_000);
});
