/**
 * fortuneLastingVeil.test.js — FORTUNE U7 step 1: THE VEIL PROOF FOR LASTING'S INPUT, before any merit code (the chair's
 * decision E32, 2026-11-22 04:51 UTC; the brief `docs/chair/2026-11-20/content/fortune/briefs/U7-LASTING.md`).
 *
 * ⭐ WHAT THIS FILE PROVES. The second merit (a place that has lasted) reads `history.age` against its size. A merit
 * reads only what every shared read serves (the seventh chair's rulings of 19:33 and 19:38 UTC 2026-11-20), so on places
 * born at every size under the fortune law (the fixture arm `{ ...birthConfig(cfg), _fortuneLawVersion: 2 }` after
 * `loadGenerationLawPayloads()`), `history.age`, `history.founding.age` and the size the merit reads (`tier`) are served
 * UNCHANGED, the owner's own values, on every shared projection:
 *   - `toPublicSafe(record)` (`display/publicSafe.js`), its default and full forms;
 *   - the gallery payload (`display/galleryVeil.js :: galleryPayloadFor`), plain and with the DM share;
 *   - `applyVeil` at a share's defaults, and under THE WIDEST VEIL (every registered grouping, every class switch, every
 *     institution card and every field of every card in the record; the measure `measures/lasting/veil-probe.mjs ::
 *     widestOf`), on the default and the full payload;
 *   - the reader's stored-delta path (`projectShareVeil` over `writeShareVeil`, the widest veil as stored deltas);
 *   - `publicVeiledRecordOf`, `veilPublicPayload(toPublicSafe(record))` and the town map's player audience.
 * TEETH: the widest veil really cuts (a smaller payload than the default share's, on every birth).
 *
 * Every expectation is the owner's own record's value, read from the birth; none is quoted.
 *
 * @enforced-by this test
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { FORTUNE_LAW_CONFIG_KEY, SIZE_RELATIVE_FORTUNE_LAW_VERSION } from '../../src/domain/fortune/fortuneLaw.js';
import { toPublicSafe, publicVeiledRecordOf, veilPublicPayload } from '../../src/domain/display/publicSafe.js';
import {
  CARD_KINDS, GROUPING_REMOVERS, VEIL_MAX_DELTAS, applyVeil, defaultVeilFor, galleryPayloadFor, projectShareVeil, writeShareVeil,
} from '../../src/domain/display/galleryVeil.js';
import { projectSettlementForTownMapAudience } from '../../src/domain/townMap/audienceProjection.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const TIMEOUT = 240_000;
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PER_SIZE = 3;

/** @param {unknown} v @returns {v is Record<string, any>} */
const isRec = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
/** @param {any} s @param {string[]} path */
const listAt = (s, path) => {
  let v = s;
  for (const k of path) v = isRec(v) ? v[k] : undefined;
  return Array.isArray(v) ? v.filter(isRec) : [];
};
/** every card of a kind in a record, by the registry's own list paths (`*` walks an owner's list) @param {any} s @param {string} kind */
const cardsOf = (s, kind) => {
  /** @type {any[]} */
  const out = [];
  for (const path of /** @type {any} */ (CARD_KINDS)[kind].lists) {
    const star = path.indexOf('*');
    if (star < 0) { out.push(...listAt(s, path)); continue; }
    for (const owner of listAt(s, path.slice(0, star))) out.push(...listAt(owner, path.slice(star + 1)));
  }
  return out;
};
/** THE WIDEST VEIL (veil-probe.mjs :: widestOf): every grouping, every class switch, every institution card, every card's fields. @param {any} pub */
const widestOf = (pub) => {
  const a = [...Object.keys(GROUPING_REMOVERS),
    ...Object.entries(CARD_KINDS).flatMap(([kind, k]) => Object.keys(k.fields).map((f) => `class:${kind}:${f}`))];
  for (const [kind, k] of Object.entries(CARD_KINDS)) {
    for (const card of cardsOf(pub, kind)) {
      const id = /** @type {any} */ (k).idOf(card);
      if (!id) continue;
      if (kind === 'institution') a.push(`card:institution:${id}`);
      for (const f of Object.keys(k.fields)) a.push(`field:${kind}:${id}:${f}`);
    }
  }
  return a;
};

/** @type {Array<[string, (r: any) => any]>} the shared projections, each handed its own copy of the owner's record */
const PROJECTIONS = [
  ['toPublicSafe(record)', (r) => toPublicSafe(r)],
  ['toPublicSafe(record, { full: true })', (r) => toPublicSafe(r, { full: true })],
  ['galleryPayloadFor(record)', (r) => galleryPayloadFor(r)],
  ['galleryPayloadFor(record, { shareDm: true })', (r) => galleryPayloadFor(r, { shareDm: true })],
  ['applyVeil(payload, defaultVeilFor(payload))', (r) => { const p = toPublicSafe(r); return applyVeil(p, defaultVeilFor(p)); }],
  ['applyVeil(payload, WIDEST)', (r) => { const p = toPublicSafe(r); return applyVeil(p, widestOf(p)); }],
  ['applyVeil(full payload, WIDEST)', (r) => { const p = toPublicSafe(r, { full: true }); return applyVeil(p, widestOf(p)); }],
  ['projectShareVeil(payload, writeShareVeil(null, WIDEST as stored deltas))', (r) => {
    const p = toPublicSafe(r);
    const deltas = widestOf(p).slice(0, VEIL_MAX_DELTAS).map((address) => ({ address, hidden: true }));
    return projectShareVeil(p, writeShareVeil(null, deltas));
  }],
  ['publicVeiledRecordOf(record)', (r) => publicVeiledRecordOf(r)],
  ['veilPublicPayload(toPublicSafe(record))', (r) => veilPublicPayload(toPublicSafe(r))],
  ['projectSettlementForTownMapAudience(record, \'player\')', (r) => projectSettlementForTownMapAudience(r, 'player')],
];

/** what the merit reads, as a projection serves it @param {any} p */
const servedOf = (p) => ({ age: p?.history?.age, founding: p?.history?.founding?.age, tier: p?.tier });

/** @type {Array<{ seed: string, size: string, record: any }>} */
const BORN = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) {
    for (let i = 0; i < PER_SIZE; i += 1) {
      const seed = `visitor-${size}-${i}`;
      const config = { ...birthConfig({ ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true }), [FORTUNE_LAW_CONFIG_KEY]: SIZE_RELATIVE_FORTUNE_LAW_VERSION };
      BORN.push({ seed, size, record: generateSettlementPipeline(config, null, { seed, customContent: {} }) });
    }
  }
}, TIMEOUT);

describe('U7 step 1: history.age is served unchanged on every shared read, the widest veil included', () => {
  it('every size is born under law 2, each with a numeric age equal to its founding age (anti-vacuity)', () => {
    expect(BORN.length).toBe(SIZES.length * PER_SIZE);
    expect([...new Set(BORN.map(({ record }) => record.tier))].sort()).toEqual([...SIZES].sort());
    expectNoSeedFailures(collectSeedFailures(BORN, ({ seed, size, record }) => {
      expect(record.config?.[FORTUNE_LAW_CONFIG_KEY], seed).toBe(SIZE_RELATIVE_FORTUNE_LAW_VERSION);
      expect(record.tier, seed).toBe(size);
      expect(typeof record.history?.age, seed).toBe('number');
      expect(record.history.founding?.age, seed).toBe(record.history.age);
    }), 'every birth of the arm');
  });

  it('the widest veil has teeth: it cuts the default share on every birth, and fits the stored-delta cap', () => {
    expectNoSeedFailures(collectSeedFailures(BORN, ({ seed, record }) => {
      const p = toPublicSafe(structuredClone(record));
      const widest = widestOf(p);
      expect(widest.length, seed).toBeGreaterThan(Object.keys(GROUPING_REMOVERS).length);
      expect(widest.length, seed).toBeLessThanOrEqual(VEIL_MAX_DELTAS);
      expect(JSON.stringify(applyVeil(p, widest)).length, seed).toBeLessThan(JSON.stringify(p).length);
    }), 'every birth of the arm');
  });

  it('on all eleven shared projections, history.age, history.founding.age and tier are the owner\'s own', () => {
    expect(PROJECTIONS.length).toBe(11);
    expectNoSeedFailures(collectSeedFailures(BORN.flatMap(({ seed, record }) => PROJECTIONS.map(([name, project]) => ({ seed, record, name, project }))),
      ({ seed, record, name, project }) => {
        expect(servedOf(project(structuredClone(record))), `${seed} on ${name}`).toEqual(servedOf(record));
      }), 'every birth on every projection');
  });
});
