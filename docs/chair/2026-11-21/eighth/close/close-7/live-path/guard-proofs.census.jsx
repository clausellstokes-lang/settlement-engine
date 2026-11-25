/** @vitest-environment node */
/**
 * GUARD PROOFS (CLOSE-7; R24j 5 (b), (c), (d)). The live-path measure (`live-path.census.jsx`, the RED) run through the same
 * store doors on a tree, with each place's record compared BY HASH with the newcomer's own rows set apart.
 *
 * MODES (env GP_MODE):
 *   master  (b): the 180 master-born saved rows (`GP_SAVED`, MASTER-REDERIVE's) loaded and ticked on the tree.
 *   born    (c): 180 places born on THE TREE's own engine (the C corpus's birth: `birthConfig({ settType })`, seeds
 *                `dp-<size>-<i>`, options `{ seed, customContent: {} }` after `loadGenerationLawPayloads()`), saved in the row
 *                shape (data, config, seed through JSON), loaded and ticked.
 *   next    (d): as `born`, then the constant moved once more in a TEST DOUBLE (`vi.doMock` of `settlement.schema.js` with
 *                GENERATOR_VERSION '0.11.0', modules reset) and the tick run through the re-imported store.
 * The decree: `stageAddDecreeIntent` → `markDecreeApplied` → `applyRosterDecreesAtTick`, exactly as `live-path.census.jsx`.
 *
 * Per place: the receipt (`rederived`), the newcomer's count on the roster, BEYOND (the record minus `dmLayer`, `decrees` and
 * the newcomer's row, hashed before and after: equal or not), the top-level keys that moved beyond the newcomer, the saved people
 * whose own row moved, and the named columns of the live-path measure (houses, powers, government, events, stress, pressure).
 * Env: GP_TREE, GP_MODE, GP_SAVED (master mode), GP_OUT (file), GP_SIZES, GP_N (default 30).
 */
import { test, vi } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const TREE = String(process.env.GP_TREE); const MODE = String(process.env.GP_MODE || 'master');
const SAVED = String(process.env.GP_SAVED || ''); const OUT = String(process.env.GP_OUT); const N = Number(process.env.GP_N || 30);
const SIZES = process.env.GP_SIZES ? process.env.GP_SIZES.split(',') : ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const NEWCOMER = 'Aldous Newcombe';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const hash = (v) => createHash('sha256').update(JSON.stringify(v ?? null)).digest('hex').slice(0, 16);
const names = (arr, key) => (Array.isArray(arr) ? arr : []).map((x) => String((isObj(x) ? (x[key] ?? x.name) : x) ?? ''));
const diffBag = (a, b) => { const m = new Map(); for (const x of a) m.set(x, (m.get(x) || 0) + 1); const lost = []; const gained = [];
  const n = new Map(); for (const x of b) n.set(x, (n.get(x) || 0) + 1);
  for (const [k, c] of m) for (let i = 0; i < c - (n.get(k) || 0); i++) lost.push(k);
  for (const [k, c] of n) for (let i = 0; i < c - (m.get(k) || 0); i++) gained.push(k); return { lost, gained }; };
const IGNORE = new Set(['decrees', 'dmLayer']);
/** the record with the newcomer's own rows set apart: no dmLayer, no decrees, no newcomer on the roster */
const apart = (s) => { const out = {}; for (const k of Object.keys(s || {}).sort()) if (!IGNORE.has(k)) out[k] = s[k];
  if (Array.isArray(out.npcs)) out.npcs = out.npcs.filter((p) => p?.name !== NEWCOMER); return out; };
const keysMoved = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => hash(a[k]) !== hash(b[k])).sort();

async function storeDoors(T) {
  return {
    es: await import(/* @vite-ignore */ `${T}/src/store/editSlice.js`),
    norm: (await import(/* @vite-ignore */ `${T}/src/domain/normalizeSettlement.js`)).normalizeSettlement,
    poolValues: (await import(/* @vite-ignore */ `${T}/src/domain/edit/pools.js`)).poolValues,
  };
}

async function tick(doors, row, seed) {
  const { es, norm, poolValues } = doors;
  const saveId = `save-${seed}`;
  const settlement = norm(structuredClone(row.data));
  const state = { activeSaveId: saveId, settlement, savedSettlements: [{ id: saveId, name: row.name, tier: row.tier, settlement, config: row.config, seed: row.seed }] };
  const get = () => state;
  const set = (fn) => { const r = typeof fn === 'function' ? fn(state) : fn; if (isObj(r) && r !== state) Object.assign(state, r); };
  const loaded = structuredClone(settlement);
  const pool = poolValues('npc.role', settlement);
  const out = { seed, size: seed.split('-')[1], err: null, bornWith: row.data?.generatorVersion ?? null, loadedWith: loaded.generatorVersion ?? null };
  try {
    const staged = es.stageAddDecreeIntent(get, set, { cardType: 'npc', values: { name: NEWCOMER, role: pool[0] ?? '' },
      pools: { 'npc.role': pool }, orderedAt: '2026-11-25T00:00:00.000Z' });
    if (!staged.ok) throw new Error(`stage refused: ${staged.reason}`);
    const applied = es.markDecreeApplied(get, set, { saveId, entryId: staged.decreeId,
      meta: { appliedAt: '2026-11-25T00:00:01.000Z', tickRef: `pulse:guard:${seed}:1` } });
    if (!applied.ok) throw new Error(`markApplied refused: ${applied.reason}`);
    const receipt = await es.applyRosterDecreesAtTick(get, set, { saveId });
    out.receipt = { ok: receipt.ok, minted: [...(receipt.minted || [])], rederived: receipt.rederived, unapplied: receipt.unapplied };
  } catch (e) { out.err = String(e?.message || e).slice(0, 300); }
  const after = state.settlement;
  const A = apart(loaded); const B = apart(after);
  const byId = new Map((loaded.npcs || []).map((p) => [`${p?.id}|${p?.name}`, hash(p)]));
  Object.assign(out, {
    newcomerCount: (after.npcs || []).filter((p) => p?.name === NEWCOMER).length,
    newcomerLast: after.npcs?.at(-1)?.name === NEWCOMER,
    beyondEqual: hash(A) === hash(B),
    keysMovedBeyond: keysMoved(A, B),
    savedPeopleRowsMoved: (after.npcs || []).filter((p) => p?.name !== NEWCOMER && byId.has(`${p?.id}|${p?.name}`) && byId.get(`${p?.id}|${p?.name}`) !== hash(p)).length,
    peopleLostOrGained: diffBag(names(loaded.npcs, 'name'), names(after.npcs, 'name').filter((n) => n !== NEWCOMER)),
    houses: diffBag(names(loaded.institutions, 'name'), names(after.institutions, 'name')),
    powers: diffBag(names(loaded.powerStructure?.factions, 'faction'), names(after.powerStructure?.factions, 'faction')),
    government: [loaded.powerStructure?.governingName ?? null, after.powerStructure?.governingName ?? null],
    pressureSentence: hash(loaded.pressureSentence) === hash(after.pressureSentence) ? null : [loaded.pressureSentence, after.pressureSentence],
    rowSameAsView: state.savedSettlements[0].settlement === after,
  });
  const dump = (process.env.GP_DUMP || '').split(',');
  if (dump.includes(seed) && process.env.GP_DUMP_DIR) writeFileSync(`${process.env.GP_DUMP_DIR}/${seed}.json`, JSON.stringify({ loaded, after }));
  return out;
}

test(`guard proofs (${MODE})`, async () => {
  const rowsIn = [];
  if (MODE === 'master') {
    for (const size of SIZES) for (let i = 0; i < N; i++) {
      const seed = `dp-${size}-${i}`; rowsIn.push([seed, JSON.parse(readFileSync(`${SAVED}/${seed}.json`, 'utf8'))]);
    }
  } else {
    const pipe = await import(/* @vite-ignore */ `${TREE}/src/generators/generateSettlementPipeline.js`);
    const B = await import(/* @vite-ignore */ `${TREE}/src/domain/density/densityCreateBoundary.js`);
    await B.loadGenerationLawPayloads();
    for (const size of SIZES) for (let i = 0; i < N; i++) {
      const seed = `dp-${size}-${i}`;
      const born = pipe.generateSettlementPipeline(B.birthConfig({ settType: size }), null, { seed, customContent: {} });
      rowsIn.push([seed, JSON.parse(JSON.stringify({ name: born.name, tier: born.tier, data: born, config: born._config || null,
        seed: born._seed ?? null }))]);
    }
  }
  if (MODE === 'next') {
    vi.resetModules();
    vi.doMock(`${TREE}/src/domain/settlement.schema.js`, async (importOriginal) => ({ ...(await importOriginal()), GENERATOR_VERSION: '0.11.0' }));
  }
  const doors = await storeDoors(TREE);
  if (MODE === 'next') {
    const v = (await import(/* @vite-ignore */ `${TREE}/src/domain/settlement.schema.js`)).GENERATOR_VERSION;
    if (v !== '0.11.0') throw new Error(`the test double did not take: GENERATOR_VERSION reads ${v}`);
  }
  const rows = [];
  for (const [seed, row] of rowsIn) rows.push(await tick(doors, row, seed));
  writeFileSync(OUT, `${rows.map((r) => JSON.stringify(r)).join('\n')}\n`);
}, 1200000);
