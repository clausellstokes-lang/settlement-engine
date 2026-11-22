/**
 * tests/domain/dailyLifeOwnerSlot.test.js — DAILY-3 · B3 E1, THE OWNER-ONLY SLOT `commoner_resentments_dm` AND ITS GATE
 * (the chair's ruling 6 of 2026-11-20, `docs/chair/2026-11-20/content/daily/DAILY-2-HANDBACK.md` § 3; the dispatch
 * `briefs/B3-E1-DAILY-3-DISPATCH.md`).
 *
 * `src/domain/dailyLife.js :: deriveDailyLife(record, { audience })` derives `commoner_resentments_dm` ONLY when
 * `audience === 'owner'`; every other read (no options, no audience, any other value) carries NO such key (absent, not
 * ''). The crime clauses (criminal opportunity >= 55 / >= 70) leave the public `commoner_resentments` for it. Arms, over
 * 30 births, five a size (M1's recipe, `measures/M1/measure.m1.mjs`, seeds `hxd-<size>-0..4`; the chair's ruling 3 of
 * 2026-11-22 06:17 cut the 900, every size and every arm kept). THE GATE WAS PROVED ON THE 900 BY THE MEASURE
 * (`docs/chair/2026-11-20/content/daily/measures/B3/E1/measure.e1.mjs`, out file `e1.out.txt`, re-run on B3 F1's built
 * code): the owner's read carries the key on 900 of 900 and a no-audience read on 0 of 900.
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
 *   (e) A "smugglers" line needs smuggling in the record (RE-READ at B3 F2, the chair's ruling 2 of 2026-11-22 06:17 and
 *       its word of 08:54): a line that says smugglers is in the pool ONLY with `house: smuggling` among its needs (a
 *       smuggling house on the live roster, `facts/causeHouses.js :: causeHouseStands`), and no owner's read prints one
 *       where no smuggling house stands (the 30 births, criminal opportunity forced to 60: the crime55 branch).
 *   (f) THE CHAIR'S crime70 K70_4 (B3 F1; `DAILY-3-HANDBACK.md` § 2 item 4): in the pool with no need, and at criminal
 *       opportunity 100 the owner's crime70 pick takes it on a born place.
 *   (g) THE CHAIR'S crime55 K55_0 to K55_3 (B3 F2): LINES-2b § 6's four smugglers lines, verbatim, in the crime55 pool,
 *       each with `house: smuggling` beside its other needs in the vocabulary's own atoms (`gate`, `route open`, `market`).
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
const N = 5;
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
/** A per-test timeout for the arms that walk the born places. */
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
  it('the born places number 30, five a size (M1\'s births; the 900 by the measure)', () => {
    expect(births).toHaveLength(30);
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

  it('the key is ABSENT on every toPublicSafe document and on the read of it, on the 900 born places (here the 30; the 900 by the measure)', () => {
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
    // anchored: the two toContain above pin each file's own deriveDailyLife call text, so the source read is live
    for (const rel of ['src/domain/regenerationDelta.js', 'src/domain/aiGrounding.js']) expect(src(rel), rel).not.toMatch(/audience/);
  });

  it('deriveRegenerationDelta and buildAiGroundingPayload never carry the key or the owner\'s text, on the 30 born places', () => {
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
  it('each toPublicSafe document carries none of the three, and the public derivation reads none beyond the substrate\'s own reads (the count over 30 documents)', () => {
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
    expect(total.documents).toBe(30);
  }, HEAVY);
});

describe('a "smugglers" line needs smuggling in the record', () => {
  it('a line that says smugglers is in the owner-only pool only with house: smuggling among its needs, and no owner\'s read prints one where no smuggling house stands (the 30, criminal opportunity forced to 60)', async () => {
    const { COMMONER_RESENTMENTS_DM } = await import('../../src/data/dailyLife/commonerResentmentsDm.js');
    const { causeHouseStands } = await import('../../src/domain/facts/causeHouses.js');
    const lines = Object.values(COMMONER_RESENTMENTS_DM).flat();
    const smugglers = lines.filter((l) => /smuggl/i.test(l.text));
    expect(smugglers.length, 'the pool\'s lines that say smugglers').toBeGreaterThan(0);
    for (const l of smugglers) expect(l.needs, `${l.id}: its needs`).toContain('house: smuggling');
    /** @type {string[]} */ const unhoused = [];
    let housed = 0;
    withCrime(() => {
      for (const b of births) {
        const text = deriveDailyLife(b.rec, { audience: 'owner' }).slots[DM]?.text ?? '';
        if (!/smuggl/i.test(text)) continue;
        if (causeHouseStands(b.rec, 'smuggling')) housed++; else unhoused.push(`${b.seed}: "${text}"`);
      }
    }, 60);
    process.stderr.write(`dailyLifeOwnerSlot (e): smugglers printed at 60 on ${housed} place(s) with a smuggling house, ${unhoused.length} without\n`);
    expect(unhoused, 'an owner\'s read printing smugglers where no smuggling house stands').toEqual([]);
  }, HEAVY);
});

describe('the chair\'s crime70 line K70_4 (B3 F1)', () => {
  const K70_4 = 'Ordinary folk resent that the law here bends for anyone who can pay.';
  it('K70_4 is in the crime70 pool with no need, and at criminal opportunity 100 the owner\'s pick takes it on a born place', async () => {
    const { COMMONER_RESENTMENTS_DM } = await import('../../src/data/dailyLife/commonerResentmentsDm.js');
    const line = COMMONER_RESENTMENTS_DM.crime70.find((l) => l.id === 'K70_4');
    expect(line, 'crime70 K70_4').toBeDefined();
    expect(line?.text).toBe(K70_4);
    expect(line?.needs).toEqual([]);
    /** @type {string[]} */ const took = [];
    withCrime(() => { for (const b of births) if (deriveDailyLife(b.rec, { audience: 'owner' }).slots[DM].text === K70_4) took.push(b.seed); }, 100);
    expect(took.length, 'the born places whose crime70 pick is K70_4').toBeGreaterThan(0);
  }, HEAVY);
});

describe('the chair\'s crime55 lines K55_0 to K55_3 (B3 F2)', () => {
  const K55 = Object.freeze([
    { id: 'K55_0', text: 'Commoners resent the smugglers who pay no tax while honest carts queue.', needs: ['house: smuggling', 'gate', 'route open'] },
    { id: 'K55_1', text: 'Commoners resent the smugglers who slip goods past while honest traders pay their dues.', needs: ['house: smuggling', 'market'] },
    { id: 'K55_2', text: 'People grumble that smuggled goods undercut honest sellers at the market.', needs: ['house: smuggling', 'market'] },
    { id: 'K55_3', text: 'Honest carriers resent waiting their turn while smugglers come and go as they please.', needs: ['house: smuggling', 'route open'] },
  ]);
  it('K55_0 to K55_3 are in the crime55 pool with LINES-2b § 6\'s texts and needs, each beside house: smuggling', async () => {
    const { COMMONER_RESENTMENTS_DM } = await import('../../src/data/dailyLife/commonerResentmentsDm.js');
    for (const want of K55) {
      const line = COMMONER_RESENTMENTS_DM.crime55.find((l) => l.id === want.id);
      expect(line, `crime55 ${want.id}`).toBeDefined();
      expect(line?.text, want.id).toBe(want.text);
      expect(line?.needs, want.id).toEqual(want.needs);
    }
  });
});
