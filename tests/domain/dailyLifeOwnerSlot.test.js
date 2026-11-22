/**
 * tests/domain/dailyLifeOwnerSlot.test.js — DAILY-3 · B3 E1, THE OWNER-ONLY SLOT `commoner_resentments_dm` AND ITS GATE
 * (the chair's ruling 6 of 2026-11-20, `docs/chair/2026-11-20/content/daily/DAILY-2-HANDBACK.md` § 3; the dispatch
 * `briefs/B3-E1-DAILY-3-DISPATCH.md`).
 *
 * `src/domain/dailyLife.js :: deriveDailyLife(record, { audience })` derives `commoner_resentments_dm` ONLY when
 * `audience === 'owner'`; every other read (no options, no audience, any other value) carries NO such key (absent, not
 * ''). The crime clauses (criminal opportunity >= 55 / >= 70) leave the public `commoner_resentments` for it. Arms, over
 * M1's 900 births (`measures/M1/measure.m1.mjs`'s recipe, seeds `hxd-<size>-0..149`, 150 a size):
 *   (a) THE GATE: the owner's read carries the key on every place; a no-audience read, an `{ audience: 'reader' }` read
 *       (and any other value), the read of the place's `toPublicSafe` document and that document itself never do; the
 *       eight public slots are byte-equal whatever the audience.
 *   (b) THE CRIME FACT: with `deriveCausalState().scores.criminal_opportunity` forced to 0 and to 100 (a pass-through
 *       mock of `causalState.js`), the eight public slots are byte-equal: the public slot is chosen by no crime fact; the
 *       owner's slot is '' below 55 and a `crime70` line at 100.
 *   (c) THE CALL SITES that must never carry it: `src/domain/regenerationDelta.js :: deriveRegenerationDelta` (its
 *       `compareDailyLife(deriveDailyLife(before), deriveDailyLife(after))`) and `src/domain/aiGrounding.js ::
 *       buildAiGroundingPayload` (its `dailyLife: deriveDailyLife(settlement)`): neither passes an audience, and neither
 *       result carries the key or the owner's text.
 *   (d) THE COUNT: a getter trap on every person of each `toPublicSafe` document counts the reads of `secret`,
 *       `plotHooks` and `goal` during the public derivation of that document.
 *   (e) A "smugglers" line needs smuggling in the record: no fact home answers it, so no pool line says it.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

/** The crime score the pass-through mock forces (null: the real score). */
const forced = vi.hoisted(() => ({ crime: /** @type {number|null} */ (null) }));
vi.mock('../../src/domain/causalState.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    deriveCausalState: (/** @type {unknown} */ s) => {
      const c = actual.deriveCausalState(s);
      return forced.crime === null ? c : { ...c, scores: { ...c.scores, criminal_opportunity: forced.crime } };
    },
  };
});

const { deriveDailyLife, DAILY_LIFE_SLOTS } = await import('../../src/domain/dailyLife.js');
const { deriveRegenerationDelta } = await import('../../src/domain/regenerationDelta.js');
const { buildAiGroundingPayload } = await import('../../src/domain/aiGrounding.js');
const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
const { deriveAllFactionProfiles } = await import('../../src/domain/factionProfile.js');
const { deriveAllSupplyChainStates } = await import('../../src/domain/supplyChainState.js');
const { deriveAllActiveConditions } = await import('../../src/domain/activeConditions.js');
const { deriveAllThreatProfiles } = await import('../../src/domain/threatProfile.js');
const { deriveAllCapacities } = await import('../../src/domain/capacityModel.js');
const { deriveCausalState } = await import('../../src/domain/causalState.js');
const { deriveHistoryBeats } = await import('../../src/domain/historyBeats.js');
const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');

const DM = 'commoner_resentments_dm';
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
/** A per-test timeout for the arms that walk the 900 places (each takes seconds to a minute). */
const HEAVY = 600_000;

/** @type {Array<{ seed: string, size: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  const t0 = Date.now();
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    births.push({ seed, size, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
  process.stderr.write(`dailyLifeOwnerSlot: ${births.length} births in ${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
}, 600_000);

const seeds = () => births.map((b) => b.seed);
const at = (/** @type {string} */ seed) => /** @type {{ seed: string, size: string, rec: any }} */ (births.find((b) => b.seed === seed));
/** @param {{ slots: Record<string, { text: string }> }} life @returns {Record<string, string>} the eight public texts */
const publicTexts = (life) => Object.fromEntries(DAILY_LIFE_SLOTS.map((k) => [k, life.slots[k].text]));
/** Every key anywhere in a value (own keys, arrays and objects walked). @param {unknown} v @param {Set<string>} [out] */
function keysIn(v, out = new Set()) {
  if (Array.isArray(v)) for (const x of v) keysIn(x, out);
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { out.add(k); keysIn(x, out); }
  return out;
}
/** @param {() => void} fn @param {number} crime */
const withCrime = (fn, crime) => { forced.crime = crime; try { fn(); } finally { forced.crime = null; } };

describe('the owner-only slot commoner_resentments_dm: the gate (ruling 6; fails closed)', () => {
  it('the born places number 900, 150 a size (M1\'s births)', () => {
    expect(births).toHaveLength(900);
    for (const size of SIZES) expect(births.filter((b) => b.size === size), size).toHaveLength(N);
  });

  it('the owner\'s read derives the key on every born place, and nothing else changes the eight public slots', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec } = at(seed);
      const owner = deriveDailyLife(rec, { audience: 'owner' });
      expect(Object.hasOwn(owner.slots, DM), `${seed}: the owner's read carries ${DM}`).toBe(true);
      expect(typeof owner.slots[DM].text, seed).toBe('string');
      expect(publicTexts(owner), `${seed}: owner vs no audience`).toEqual(publicTexts(deriveDailyLife(rec)));
    });
    expectNoSeedFailures(failures, 'the owner\'s read carries the dm slot and the same eight public slots');
  }, HEAVY);

  it('the key is ABSENT on a no-audience read, an { audience: \'reader\' } read and any other audience value', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec } = at(seed);
      for (const [label, life] of /** @type {Array<[string, any]>} */ ([['no options', deriveDailyLife(rec)], ['{}', deriveDailyLife(rec, {})],
        ['null', deriveDailyLife(rec, null)], ['reader', deriveDailyLife(rec, { audience: 'reader' })],
        ['Owner', deriveDailyLife(rec, /** @type {any} */ ({ audience: 'Owner' }))], ['owner as a flag', deriveDailyLife(rec, /** @type {any} */ ({ owner: true }))]])) {
        expect(Object.hasOwn(life.slots, DM), `${seed} (${label})`).toBe(false);
        expect(keysIn(life).has(DM), `${seed} (${label}): anywhere in the envelope`).toBe(false);
      }
    });
    expectNoSeedFailures(failures, 'no read but the owner\'s carries the dm key');
  }, HEAVY);

  it('the key is ABSENT on every toPublicSafe document and on the read of it, on the 900 born places', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec } = at(seed);
      const doc = toPublicSafe(rec);
      expect(keysIn(doc).has(DM), `${seed}: the toPublicSafe document itself`).toBe(false);
      const read = deriveDailyLife(doc);
      expect(Object.hasOwn(read.slots, DM), `${seed}: the read of the toPublicSafe document`).toBe(false);
      expect(keysIn(read).has(DM), `${seed}: anywhere in that envelope`).toBe(false);
    });
    expectNoSeedFailures(failures, 'no toPublicSafe document, and no read of one, carries the dm key');
  }, HEAVY);
});

describe('the owner-only slot: the crime clauses leave the public slot', () => {
  it('the eight public slots are chosen by no crime fact: byte-equal with criminal opportunity forced to 0 and to 100', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec } = at(seed);
      /** @type {Record<string, string>} */ let low = {}; /** @type {Record<string, string>} */ let high = {};
      withCrime(() => { low = publicTexts(deriveDailyLife(rec)); }, 0);
      withCrime(() => { high = publicTexts(deriveDailyLife(rec)); }, 100);
      expect(high, `${seed}: the public slots at criminal opportunity 100 vs 0`).toEqual(low);
      const refs = deriveDailyLife(rec).slots.commoner_resentments.references;
      expect(refs.some((/** @type {{ id: string }} */ r) => r.id === 'var.criminal_opportunity'), `${seed}: the public slot cites no crime`).toBe(false);
    });
    expectNoSeedFailures(failures, 'the public slots do not move with the crime score');
  }, HEAVY);

  it('the owner\'s slot is \'\' below 55 and a crime70 line at 100, citing the crime score', async () => {
    const { COMMONER_RESENTMENTS_DM } = await import('../../src/data/dailyLife/commonerResentmentsDm.js');
    const crime70 = new Set(COMMONER_RESENTMENTS_DM.crime70.map((l) => l.text));
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec } = at(seed);
      withCrime(() => {
        const s = deriveDailyLife(rec, { audience: 'owner' }).slots[DM];
        expect(s.text, `${seed} at 54`).toBe('');
        expect(s.references, `${seed} at 54`).toEqual([]);
      }, 54);
      withCrime(() => {
        const s = deriveDailyLife(rec, { audience: 'owner' }).slots[DM];
        expect(crime70.has(s.text), `${seed} at 100: "${s.text}"`).toBe(true);
        expect(s.references.some((/** @type {{ id: string }} */ r) => r.id === 'var.criminal_opportunity'), seed).toBe(true);
      }, 100);
    });
    expectNoSeedFailures(failures, 'the owner\'s slot follows the crime ladder');
  }, HEAVY);
});

describe('the call sites that never receive the owner-only slot', () => {
  const src = (/** @type {string} */ rel) => readFileSync(`${ROOT}${rel}`, 'utf8');
  it('src/domain/regenerationDelta.js :: deriveRegenerationDelta and src/domain/aiGrounding.js :: buildAiGroundingPayload pass no audience', () => {
    expect(src('src/domain/regenerationDelta.js')).toContain('compareDailyLife(deriveDailyLife(before), deriveDailyLife(after))');
    expect(src('src/domain/aiGrounding.js')).toContain('dailyLife:       deriveDailyLife(settlement),');
    for (const rel of ['src/domain/regenerationDelta.js', 'src/domain/aiGrounding.js']) expect(src(rel), rel).not.toMatch(/audience/);
  });

  it('deriveRegenerationDelta and buildAiGroundingPayload never carry the key or the owner\'s text, on the 900 born places', () => {
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec, size } = at(seed);
      const i = Number(seed.split('-').pop());
      const next = at(`hxd-${size}-${(i + 1) % N}`).rec;
      withCrime(() => {
        const owner = deriveDailyLife(rec, { audience: 'owner' }).slots[DM].text;
        expect(owner.length, seed).toBeGreaterThan(0);
        const delta = deriveRegenerationDelta(rec, next);
        expect(keysIn(delta).has(DM), `${seed}: the regeneration delta`).toBe(false);
        expect(JSON.stringify(delta).includes(owner), `${seed}: the delta carries the owner's text`).toBe(false);
        const payload = buildAiGroundingPayload(rec);
        expect(keysIn(payload).has(DM), `${seed}: the grounding payload`).toBe(false);
        expect(JSON.stringify(payload).includes(owner), `${seed}: the payload carries the owner's text`).toBe(false);
      }, 100);
    });
    expectNoSeedFailures(failures, 'the delta and the grounding payload never carry the dm slot');
  }, HEAVY);
});

describe('THE COUNT: the public derivation of a shared read\'s document reads no person\'s secret, plotHooks or goal', () => {
  const TRAPPED = Object.freeze(['secret', 'plotHooks', 'goal']);
  /** A getter trap on every person of a document: each read of a trapped key counted, with whether it gave a value. */
  function trap(/** @type {any} */ doc) {
    const count = { people: 0, reads: 0, valued: 0 };
    for (const npc of Array.isArray(doc.npcs) ? doc.npcs : []) {
      if (!npc || typeof npc !== 'object') continue;
      count.people++;
      for (const k of TRAPPED) {
        const had = Object.hasOwn(npc, k);
        const value = npc[k];
        Object.defineProperty(npc, k, { configurable: true, enumerable: had, get() { count.reads++; if (value !== undefined) count.valued++; return value; } });
      }
    }
    return count;
  }
  it('each toPublicSafe document carries none of the three, and the public derivation reads none beyond the substrate\'s own reads (the count over 900 documents)', () => {
    const total = { documents: 0, people: 0, substrateReads: 0, dailyLifeReads: 0, valued: 0 };
    const failures = collectSeedFailures(seeds(), (seed) => {
      const { rec } = at(seed);
      const doc = toPublicSafe(rec);
      for (const npc of Array.isArray(doc.npcs) ? doc.npcs : []) for (const k of TRAPPED) expect(Object.hasOwn(npc, k), `${seed}: a public person carries ${k}`).toBe(false);
      const count = trap(doc);
      deriveAllFactionProfiles(doc); deriveAllSupplyChainStates(doc); deriveAllActiveConditions(doc); deriveAllThreatProfiles(doc);
      deriveAllCapacities(doc); deriveCausalState(doc); deriveHistoryBeats(doc);
      const substrate = count.reads;
      count.reads = 0;
      deriveDailyLife(doc);
      total.documents++; total.people += count.people; total.substrateReads += substrate; total.dailyLifeReads += count.reads; total.valued += count.valued;
      expect(count.reads, `${seed}: the public derivation's reads vs the substrate derivers' own`).toBe(substrate);
      expect(count.valued, `${seed}: a trapped read gave a value`).toBe(0);
    });
    process.stderr.write(`THE COUNT (dailyLifeOwnerSlot): ${total.documents} toPublicSafe documents, ${total.people} people trapped; `
      + `reads of secret/plotHooks/goal during deriveDailyLife: ${total.dailyLifeReads} (the seven substrate derivers alone: ${total.substrateReads}); reads that gave a value: ${total.valued}\n`);
    expectNoSeedFailures(failures, 'the public derivation reads no person\'s secret, plotHooks or goal of its own, and no value');
    expect(total.documents).toBe(900);
  }, HEAVY);
});

describe('a "smugglers" line needs smuggling in the record', () => {
  it('no fact home answers smuggling, so no line of the owner-only pool says smugglers, and no owner\'s read prints one', async () => {
    const { COMMONER_RESENTMENTS_DM } = await import('../../src/data/dailyLife/commonerResentmentsDm.js');
    const lines = Object.values(COMMONER_RESENTMENTS_DM).flat();
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.filter((l) => /smuggl/i.test(l.text)).map((l) => l.id)).toEqual([]);
    const said = births.map((b) => deriveDailyLife(b.rec, { audience: 'owner' }).slots[DM]?.text ?? '').filter((t) => /smuggl/i.test(t));
    expect(said).toEqual([]);
  }, HEAVY);
});
