/**
 * factLayers.walker.test.js — W2-A-LEAVES's first guard (the second wave's charter, the amendment of record
 * 292, item 2; the procedure SOP-POOLS-AND-CONDITIONS §1, §7.1): ONE FACT, ONE LEAF, AND NOTHING READS AT
 * OR ABOVE ITS OWN LAYER.
 *
 * THE TABLE. `src/domain/facts/factLayers.js` gives every leaf its layer and the strata it reads;
 * `tests/lint/factLayers.poolTable.json` gives every corpus pool its layer. This walker holds both to the
 * source:
 *   - every vocabulary dimension's home, and every getter of `factsOf`, has a leaf row;
 *   - every leaf's declared reads are EXACTLY what it touches on a fixed grid of sixteen births (six sizes,
 *     calm and under crises), traced by a proxy; a stored field no stratum places is red;
 *   - every corpus pool has a row, and no row outlives its pool.
 * THE LAW, three arms, each against the shrink-only register `tests/lint/factLayers.register.json`:
 *   LEAVES   a leaf that touches a stratum at or above its layer;
 *   POOLS    a pool whose lines declare or name a fact at or above the pool's layer;
 *   READERS  the defence-reader walker generalised to every homed fact: a line outside a fact's home that
 *            answers it again by a name test.
 * The tree must read EXACTLY the register (a cure lowers it the same commit, through
 * `scripts/fact-layers-door.mjs --shrink`), and no arm's total ever rises above its first commit's.
 *
 * What it does not see, said once: a leaf's branch the grid never takes; a pool line's claim in words no
 * vocabulary registers yet (a practitioner, a capture, a margin: the register is a floor until class B
 * registers them); a name test spelled through a helper of another file.
 */
import { describe, expect, test, beforeAll } from 'vitest';
import {
  FAMILIES, POOL_TABLE_REL, REGISTER_REL, bankedReaderLines, corpusPools, gridBirths, keyReadArm, leafArm, leafTouches,
  lineKey, outsideHomeCalls, poolArm, readJson, readerArm, readsFamily, verdictOf,
} from './factLayers.shared.mjs';
import { linesReading } from './defenceFactReaders.shared.mjs';
import { LEAVES, LEAVES_OWED, STRATA, stratumOf } from '../../src/domain/facts/factLayers.js';
import { FACT_DIMENSIONS } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

const REGISTER = readJson(REGISTER_REL);
const POOL_TABLE = readJson(POOL_TABLE_REL).rows;
/** Each arm's total at the register's first commit (banked at deb1544eb): it never rises. */
const FIRST = Object.freeze({ leaves: 8, pools: 6, readers: 483 });

/** @type {Awaited<ReturnType<typeof gridBirths>>} */ let births;
/** @type {Awaited<ReturnType<typeof leafArm>>} */ let leaves;
beforeAll(async () => {
  births = await gridBirths();
  leaves = await leafArm(births);
}, 120000);

describe('the layer table covers every leaf and every pool', () => {
  test('every vocabulary dimension\'s home and every factsOf getter has a leaf row', () => {
    const homes = new Set(Object.values(FACT_DIMENSIONS).map((d) => d.home));
    for (const h of homes) expect(LEAVES[h], `the dimension home '${h}'`).toBeTruthy();
    for (const getter of Object.keys(factsOf({}))) expect(LEAVES[getter], `the factsOf getter '${getter}'`).toBeTruthy();
    for (const owed of Object.keys(LEAVES_OWED)) expect(LEAVES[owed], `'${owed}' is written: move it from LEAVES_OWED`).toBeUndefined();
  });
  test('every leaf declares exactly the strata it touches, and every stored field it reads is placed', () => {
    for (const [id, v] of Object.entries(leaves)) {
      expect({ id, undeclared: v.undeclared, unread: v.unread, unplaced: v.unplaced }).toEqual({ id, undeclared: [], unread: [], unplaced: [] });
    }
    for (const [id, row] of Object.entries(LEAVES)) {
      for (const r of row.reads) expect(STRATA[r], `${id} reads '${r}'`).toBeTypeOf('number');
      expect(Number.isInteger(row.layer) && row.layer >= 1, id).toBe(true);
    }
  });
  test('every corpus pool has a row in the pool table, and no row outlives its pool', async () => {
    const pools = await corpusPools();
    const ids = new Set(pools.map((p) => p.id));
    expect(pools.filter((p) => !POOL_TABLE[p.id]).map((p) => p.id)).toEqual([]);
    expect(Object.keys(POOL_TABLE).filter((k) => !ids.has(k))).toEqual([]);
    for (const [id, row] of Object.entries(POOL_TABLE)) expect(row.layer === 'W' || (Number.isInteger(row.layer) && row.layer >= 2), id).toBe(true);
  });
});

describe('guard-the-guard: each arm reds its planted fault', () => {
  test('LEAVES: a layer-1 leaf that reads the cast is a violation; an undeclared read and an unplaced field are caught', () => {
    const record = /** @type {Record<string, any>} */ ({ ...births[0][1], plantedField: { x: 1 } });
    const plant = { layer: 1, module: 'plant', exported: 'f', call: /** @type {const} */ ('record'), reads: ['institutions'] };
    const modules = { plant: { f: (/** @type {any} */ r) => [r.institutions.length, r.npcs.length, r.plantedField.x] } };
    const touches = leafTouches(plant, record, modules, stratumOf);
    const v = verdictOf(plant, touches, STRATA);
    expect(v.violations).toEqual(['npcs']);
    expect(v.undeclared).toEqual(['npcs']);
    expect(v.unplaced).toEqual(['UNPLACED:plantedField']);
    // the control: a layer-4 leaf may read the cast
    expect(verdictOf({ ...plant, layer: 4, reads: ['institutions', 'npcs'] }, ['institutions', 'npcs'], STRATA).violations).toEqual([]);
    // a stored leaf may hand on its own stratum, and never one above it
    expect(verdictOf({ layer: 2, reads: ['defenseProfile'], stored: true }, ['defenseProfile'], STRATA).violations).toEqual([]);
    expect(verdictOf({ layer: 2, reads: ['npcs'], stored: true }, ['npcs'], STRATA).violations).toEqual(['npcs']);
  });
  test('LEAVES: a back-written field carries its own layer, not its object\'s', () => {
    expect(stratumOf('economicState.safetyProfile.crimeTypes')).toBe('economicState.safetyProfile');
    expect(stratumOf('culturalIdentity.foodways')).toBe('culturalIdentity.foodways');
    expect(stratumOf('powerStructure.criminalCaptureState.rung')).toBe('powerStructure.criminalCaptureState');
    expect(stratumOf('economicState.foodSecurity')).toBe('economicState');
  });
  test('POOLS: a base-reading line that names the garrison is fine; the same line in a pool below it is red; an unplaced pool is red', async () => {
    const plant = [{ id: 'PLANT::a', variants: [{ text: 'The garrison drills at dawn.' }], meta: {} },
      { id: 'PLANT::b', variants: [{ text: 'Grain is dear.', marks: [] }], meta: { declares: ['other npc'] } },
      { id: 'PLANT::c', variants: [{ text: 'Nothing.' }], meta: {} }];
    const table = { 'PLANT::a': { layer: 1, src: 'plant' }, 'PLANT::b': { layer: 3, src: 'plant' } };
    const red = await poolArm(plant, table);
    expect(red.violations['PLANT::a']).toEqual(['names garrison (layer 1)']);
    expect(red.violations['PLANT::b']).toEqual(['declares other npc (layer 4)']);
    expect(red.unplaced).toEqual(['PLANT::c']);
    const green = await poolArm(plant.slice(0, 2), { 'PLANT::a': { layer: 2, src: 'plant' }, 'PLANT::b': { layer: 5, src: 'plant' } });
    expect(green.violations).toEqual({});
  });
  test('POOLS by their KEY: a pool placed below what its key reads is red; a key site that is gone is red', async () => {
    const table = { ...POOL_TABLE, 'DS-POW-6::capture reached a LEADER': { layer: 3, src: 'plant' } };
    expect((await keyReadArm(table)).violations['DS-POW-6::capture reached a LEADER']).toEqual(['key reads powerStructure.criminalCaptureState (layer 4)']);
    const gone = [{ file: 'src/domain/display/stateProse/powerStateProse.js', site: /plantedKeyFunction\(/, reads: ['npcs'], pools: [] }];
    expect((await keyReadArm(POOL_TABLE, gone)).rotted).toHaveLength(1);
  });
  test('READERS: a private name test of a homed fact is caught; a home and a bare name are not', () => {
    expect(readsFamily('market', "const hasMarket = names.some((n) => n.includes('market'));")).toBe(true);
    expect(readsFamily('faith', "const church = insts.find((i) => /church|temple/i.test(i.name));")).toBe(true);
    expect(readsFamily('crime', "if (hasInst('thieves guild')) return 'organized';")).toBe(true);
    expect(readsFamily('magic', "const wiz = roster.filter((n) => n.startsWith('wizard'));")).toBe(true);
    expect(readsFamily('market', 'const hasMarket = facts.market;')).toBe(false);
    expect(readsFamily('guild', "const g = names.some((n) => n.includes(\"thieves' guild\"));")).toBe(false);
    // a word held in a constant is read as the word (the defence-reader walker's own resolution)
    expect(linesReading("const W = 'tavern';\nconst inn = names.some((n) => n.includes(W));\n", (line) => readsFamily('tavern', line))).toBe(1);
    expect(Object.keys(FAMILIES).length).toBeGreaterThan(10);
  });
  test('READERS (REVIEW-W2A F6): a call of the home\'s own reader is the home\'s; a private helper over words is not; a swap is a new line', () => {
    expect(readsFamily('faith', outsideHomeCalls("get sacredHouse() { return hasInstitution(record, 'temple'); },"))).toBe(false);
    expect(readsFamily('tavern', outsideHomeCalls("...(facts.hasInstitution('tavern') ? ['the tavern'] : []),"))).toBe(false);
    // the generator's private helper over a list of words is a name test of its own
    expect(readsFamily('mill', outsideHomeCalls("if (hasResource(['river_mills']) && hasInstitution(['mill'])) agriMod += 0.08;"))).toBe(true);
    // banked by content: the same count with one line swapped for another is not the register
    const banked = { 'src/x.js': { crime: [{ line: "const f = factions.find((x) => /thieves/.test(x.name));", reason: 'r' }] } };
    const swapped = { 'src/x.js': { crime: [lineKey("  const s = names.some((n) =>  n.includes('smuggler'));")] } };
    expect(swapped).not.toEqual(bankedReaderLines(banked)); // anchored: the same file and family, one line each
    expect(bankedReaderLines(banked)['src/x.js'].crime).toHaveLength(1);
  });
});

describe('nothing reads at or above its own layer (shrink-only)', () => {
  test('LEAVES: the tree reads exactly the register', () => {
    const now = Object.fromEntries(Object.entries(leaves).filter(([, v]) => v.violations.length).map(([k, v]) => [k, v.violations]));
    expect(now).toEqual(REGISTER.leaves);
  });
  test('POOLS: the tree reads exactly the register, with no pool unplaced and no atom unlayered', async () => {
    const r = await poolArm(await corpusPools(), POOL_TABLE);
    expect(r.unplaced).toEqual([]);
    expect(r.unlayered).toEqual([]);
    expect(r.violations).toEqual(REGISTER.pools);
  });
  test('POOLS by their KEY (REVIEW-W2A F5): no key reads at or above its pool\'s layer, and no key site has rotted', async () => {
    const k = await keyReadArm(POOL_TABLE);
    expect(k.rotted).toEqual([]);
    expect(k.violations).toEqual({});
  });
  test('READERS: every file reads exactly its banked LINES (by content, each with its reason), and no file reads outside the register', () => {
    expect(readerArm()).toEqual(bankedReaderLines(REGISTER.readers));
    for (const fams of Object.values(REGISTER.readers)) for (const rows of Object.values(fams)) for (const row of rows) expect(row.reason.length).toBeGreaterThan(20);
  });
  test('no arm\'s total ever rises above its first commit\'s', () => {
    const count = (/** @type {Record<string, string[]>} */ o) => Object.values(o).reduce((s, l) => s + l.length, 0);
    expect(count(REGISTER.leaves)).toBeLessThanOrEqual(FIRST.leaves);
    expect(count(REGISTER.pools)).toBeLessThanOrEqual(FIRST.pools);
    const readers = Object.values(REGISTER.readers).reduce((s, f) => s + Object.values(/** @type {Record<string, unknown[]>} */ (f)).reduce((a, b) => a + b.length, 0), 0);
    expect(readers).toBeLessThanOrEqual(FIRST.readers);
  });
});
