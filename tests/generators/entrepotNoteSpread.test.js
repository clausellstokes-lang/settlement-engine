/**
 * tests/generators/entrepotNoteSpread.test.js — PLACE-1's second unit (2026-11-20; the owner's order "comprehensively fix
 * the sameness fault"; `docs/chair/2026-11-20/content/place/BRIEF-BUILD-entrepotNote.md`, the chair's ruling of 17:18 UTC
 * verbatim there, and `entrepotNote-MEASURE.md`).
 *
 * The chain cards' entrepôt note (`economicState.activeChains[].entrepotNote`, printed under a card on the Economics tab's
 * Economic Flows and in the PDF's chain cards) was one fixed sentence a chain: the luxury note in 81 of 100 cities, the fur
 * note in 76 of 100 metropolises. The cure draws each chain's note from its own declared pool (`src/data/entrepotNotes.js`),
 * index 0 today's sentence, by the mixed keyed pick (`pickVariantMixed`, key `${seed}::entrepotNote::${chainId}`), no roll.
 *
 *   (a) THE BAR: on 100 places a size (`hxd-<size>-0..99`, born and masked as the chair's stored-sentence census births and
 *       masks them), no sentence of the field in more than 15 of a size's places (every held note: the census's reading and
 *       the PDF's, which prints a held note ungated; the tab prints a subset of it);
 *   (b) every stored note is a row of its chain's pool, and the row's declared `needs` / `excludes` hold on the FINAL record
 *       (a chain-scoped atom read with the chain);
 *   (c) CANONICAL AT ZERO: a seedless call returns today's sentence, byte for byte;
 *   (d) the planted control: every pool collapsed to one wording reds (a);
 *   (e) the chair's condition (16:51, corrected 17:13 UTC): no row needs or excludes a hideable house or a crime fact
 *       (held statically over every row and by its effect, with a planted control); the houses the rows need are named;
 *       the smuggling pool's exemption is declared, never silent;
 *   (f) THE ATOM the chair granted ("ATOM carrier: own|transit : src/domain/facts/chainCarrier.js :: chainCarrierOf :
 *       chain-scoped"), read through `factsOf` with the chain in context;
 *   (g) the chair's calls and rewordings: an own row names the record's own resource; every row of a chain that can be
 *       the place's own that says the good comes from elsewhere declares `carrier: transit`; row 0 is drawn only where its
 *       own route claim holds; the eight rewordings stand verbatim; the luxury rows name fine metalwork and jewellery only
 *       where the chain's record names them; the pick is the mixed one.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { computeActiveChains } from '../../src/generators/computeActiveChains.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { tradeRouteOf } from '../../src/domain/facts/terrain.js';
import { FACT_DIMENSIONS, ROUTE_WORDS, atomHolds, declarationAdmits, declarationOf, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { isHideableHouse, isVeiledPower } from '../../src/domain/people/cardVeil.js';

const SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const N = 100;
const BAR = 15;
const SLOW = 400_000;
const POOL_FILE = 'src/data/entrepotNotes.js';

/** The pool module (absent before the build: every test that reads it reds on its absence, not on a load error). */
let modLoaded = false;
/** @type {Record<string, any> | null} */ let MOD = null;
async function pools() {
  if (!modLoaded) {
    modLoaded = true;
    MOD = await import('../../src/data/entrepotNotes.js').catch(() => null);
  }
  return MOD;
}

/** Today's sentence of every chain that carries one, spelled as `supplyChainData.js` spells it before the cure. */
const TODAY = Object.freeze({
  salt: 'Salt is among the most-traded commodities. Port and crossroads settlements profit from redistribution.',
  luxury_goods: 'Luxury goods are the primary cargo of long-distance trade. Entrepôt cities profit enormously from the markup.',
  spices_dyes: 'Produced in distant lands. Crossroads and port settlements control distribution and take the markup.',
  silk_luxury_textiles: 'Silk is not produced locally anywhere. Port cities control import; crossroads cities control inland distribution.',
  transit_finance: 'Entrepôt cities develop banking infrastructure to facilitate large-volume trade. The bank profits from the flow of others.',
  warehouse_logistics: 'Ports and crossroads profit by charging for storage, loading, and onward transport, not by producing anything themselves.',
  furs_north: 'Furs travel from the hunting grounds through trading posts, and the settlements along the route profit from the trade.',
  wine_spirits: 'Wine is produced in specific vineyard regions and consumed everywhere. Port and river settlements profit from redistribution.',
  magical_goods: 'Magical items are among the highest-value trade goods. Cities near magical nodes become distribution hubs.',
  planar: 'Planar goods are extreme-value entrepôt items. Only a metropolis can support the infrastructure.',
  smuggling: 'Smuggling is the entrepôt trade run in the dark. Goods that cannot be taxed or declared flow through criminal networks.',
});
/** The catalogue's note of a chain id (today's sentence, read from its home). @param {string} id */
function catalogueNote(id) {
  for (const need of Object.values(SUPPLY_CHAIN_NEEDS)) for (const c of /** @type {any} */ (need).chains) if (c.id === id) return c.entrepotNote || null;
  return null;
}

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sentences = (s) => String(s).split(/(?<=[.!?])\s+/).filter(Boolean);
const noted = (t) => (t.economicState?.activeChains || []).filter((c) => c && c.entrepotNote);

let loaded = false;
/** @type {Record<string, Array<{ seed: string, t: any, mask: (s: string) => string }>>} */
const BORN = {};
/** The census's births and mask, verbatim (docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs at bca8c6fe3). */
async function bornOf(size) {
  if (!loaded) { await loadGenerationLawPayloads(); loaded = true; }
  if (BORN[size]) return BORN[size];
  const out = [];
  for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const nm = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) nm.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...nm].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');
    out.push({ seed, t, mask });
  }
  BORN[size] = out;
  return out;
}
async function allBorn() {
  const out = [];
  for (const size of SIZES) out.push(...await bornOf(size));
  return out;
}

/** The sentences held in more than BAR of the places: `["<count> <sentence>"]`. @param {string[][]} placeNotes masked */
function overBar(placeNotes) {
  const m = new Map();
  for (const notes of placeNotes) for (const s of new Set(notes.flatMap(sentences))) m.set(s, (m.get(s) || 0) + 1);
  return [...m].filter(([, c]) => c > BAR).sort((a, b) => b[1] - a[1]).map(([s, c]) => `${c} ${s}`);
}

describe('(a) the bar: no sentence of the entrepôt note in more than 15 of 100 places a size', () => {
  for (const size of SIZES) {
    it(`${size}: no sentence of entrepotNote in more than ${BAR} of ${N} places`, async () => {
      const born = await bornOf(size);
      expect(born).toHaveLength(N);
      expect(overBar(born.map((b) => noted(b.t).map((c) => b.mask(String(c.entrepotNote)))))).toEqual([]);
    }, SLOW);
  }
});

/** A row's declaration, as the draw reads it. @param {any} row @param {any} facts @param {any} chain */
const admits = (row, facts, chain) => declarationAdmits(declarationOf(row), facts, { ctx: { chain } });
/**
 * A chain's pool, each row's text as it prints for the chain in the record (today's sentence `note` at index 0), or null.
 * @param {any} mod @param {any} chain @param {any} record @param {string|null} note
 */
const rowsOf = (mod, chain, record, note) => {
  const pool = mod.entrepotNotePoolOf(chain);
  return pool ? pool.map((r) => ({ ...r, text: mod.entrepotNoteTextOf(r, chain, record, note) })) : null;
};

describe('(b) every stored note is a row of its chain\'s pool, admitted by the FINAL record', () => {
  it('the pool module exists; every stored note is a pool row whose needs and excludes hold on the final record (0 refused)', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const refused = []; const unknown = [];
    let checked = 0; let beyondIndexZero = 0;
    for (const b of await allBorn()) {
      const facts = factsOf(b.t);
      for (const c of noted(b.t)) {
        const rows = rowsOf(mod, c, b.t, catalogueNote(c.chainId));
        if (!rows) { if (c.entrepotNote !== catalogueNote(c.chainId)) unknown.push(`${b.seed} ${c.chainId}: no pool, "${c.entrepotNote}"`); continue; }
        const i = rows.findIndex((r) => r.text === c.entrepotNote);
        if (i < 0) { unknown.push(`${b.seed} ${c.chainId}: "${c.entrepotNote}"`); continue; }
        checked++; if (i > 0) beyondIndexZero++;
        const v = admits(rows[i], facts, c);
        if (!v.admitted) refused.push(`${b.seed} ${c.chainId}[${rows[i].id}] (${v.refused.join(', ')})`);
      }
    }
    expect(unknown).toEqual([]);
    expect(checked, 'notes checked').toBeGreaterThan(1100);
    expect(beyondIndexZero, 'notes beyond index 0').toBeGreaterThan(800);
    expect(refused).toEqual([]);
  }, SLOW);
});

describe('(c) canonical at zero: a seedless call returns today\'s sentence, byte for byte', () => {
  it('the catalogue and a seedless computeActiveChains hold today\'s sentence for every chain', async () => {
    for (const [id, note] of Object.entries(TODAY)) expect(catalogueNote(id), id).toBe(note);
    const wrong = [];
    for (const size of ['town', 'city', 'metropolis']) {
      for (const b of (await bornOf(size)).slice(0, 20)) {
        const chains = computeActiveChains(b.t.institutions, b.t.config?.nearbyResources || [], b.t.tier, tradeRouteOf(b.t));
        for (const c of chains) if (c.entrepotNote && c.entrepotNote !== TODAY[c.chainId]) wrong.push(`${b.seed} ${c.chainId}`);
      }
    }
    expect(wrong).toEqual([]);
  }, SLOW);
  it('the composer with a falsy seed hands every chain back with today\'s sentence', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the composer`).not.toBeNull();
    const wrong = [];
    for (const b of await allBorn()) {
      const today = noted(b.t).map((c) => ({ ...c, entrepotNote: TODAY[c.chainId] }));
      for (const seed of [undefined, null, '', 0]) {
        const out = mod.entrepotNotesOf(today, b.t, seed);
        out.forEach((c, i) => { if (c.entrepotNote !== today[i].entrepotNote) wrong.push(`${b.seed} ${c.chainId} (${String(seed)})`); });
      }
    }
    expect(wrong).toEqual([]);
  }, SLOW);
});

describe('(d) the planted control: a one-wording pool reds the bar', () => {
  it('every pool collapsed to its index 0 leaves a size over the bar (town, city and metropolis)', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const over = [];
    for (const size of SIZES) {
      const born = await bornOf(size);
      const collapsed = born.map((b) => noted(b.t).map((c) => {
        const rows = rowsOf(mod, c, b.t, catalogueNote(c.chainId));
        return b.mask(rows ? rows[0].text : String(c.entrepotNote));
      }));
      if (overBar(collapsed).length) over.push(size);
    }
    expect(over).toEqual(expect.arrayContaining(['town', 'city', 'metropolis']));
  }, SLOW);
});

/** Every row of every pool, filled for one chain: `[chainId, row]`. */
function everyRow(mod) {
  /** @type {Array<[string, any]>} */ const out = [];
  for (const [id, rows] of Object.entries(mod.ENTREPOT_NOTES)) for (const row of /** @type {any[]} */ (rows)) out.push([id, row]);
  return out;
}
/** The crime facts (a dimension whose answer is the place's crime) and the hideable kinds no row may need or exclude. */
const CRIME_DIMENSIONS = Object.freeze(['crime', 'organised crime', 'criminal income', 'crime wave', 'rival rings']);
/** @param {any} row @returns {string[]} the row's atoms that name a crime fact */
const crimeAtoms = (row) => [...(row.needs || []), ...(row.excludes || [])].filter((a) => {
  const p = parseAtom(String(a).replace(/^no\s+/i, ''));
  return !p || CRIME_DIMENSIONS.includes(p.dimension);
});
/** @param {any} rec */
function struck(rec) {
  const ps = rec.powerStructure;
  return {
    ...rec,
    institutions: (rec.institutions || []).filter((i) => !isHideableHouse(i)),
    ...(ps ? { powerStructure: { ...ps, factions: (ps.factions || []).filter((f) => !isVeiledPower(f)) } } : {}),
  };
}
/** The rows a hideable thing decides (admitted on the record, refused with the hideable struck, or the reverse). */
function hiddenDecides(rowsOf, births) {
  const out = new Set();
  const verdict = (row, rec, chain) => { try { return admits(row, factsOf(rec), chain).admitted; } catch (e) { return `throws: ${e.message}`; } };
  for (const b of births) {
    const bare = struck(b.t);
    for (const c of noted(b.t)) for (const row of rowsOf(c, b.t) || []) {
      if (verdict(row, b.t, c) !== verdict(row, bare, c)) out.add(`${c.chainId}[${row.id}]`);
    }
  }
  return [...out].sort();
}

describe('(e) the chair\'s condition: no row needs or excludes a hideable house or a crime fact', () => {
  it('no row of any pool declares a crime fact or an atom outside the vocabulary', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    expect(everyRow(mod).flatMap(([id, row]) => crimeAtoms(row).map((a) => `${id}[${row.id}]: ${a}`))).toEqual([]);
  });
  it('every row reads the same with every hideable house and veiled power struck from the record', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    expect(hiddenDecides((c, t) => rowsOf(mod, c, t, catalogueNote(c.chainId)), await allBorn())).toEqual([]);
  }, SLOW);
  it('the planted control: a row that needs a crime fact is caught both ways', async () => {
    const planted = Object.freeze({ id: 'planted', text: 'Organised crime runs the trade here.', needs: Object.freeze(['crime: organized']) });
    expect(crimeAtoms(planted)).toEqual(['crime: organized']);
    expect(hiddenDecides(() => [planted], await allBorn())).not.toEqual([]);
  }, SLOW);
  it('the houses and places the rows need are exactly the listed ones (for the security reader)', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const needed = new Set();
    for (const [id, row] of everyRow(mod)) for (const a of [...(row.needs || []), ...(row.excludes || [])]) {
      const p = parseAtom(String(a).replace(/^no\s+/i, ''));
      if (p && !['route', 'carrier'].includes(p.dimension)) needed.add(`${id}: ${a}`);
    }
    // the houses: market (luxury, silk, spices) and bank (finance); the tavern row was re-ruled to no house (18:52 UTC). The rest
    // are the class declarations (imports, exports, silk-steady's prosperity: PLACE-2's cure, the chair's ruling (2))
    expect([...needed].sort()).toEqual([
      'furs_north: exports', 'furs_north: imports',
      'luxury_goods: exports', 'luxury_goods: market',
      'silk_luxury_textiles: imports', 'silk_luxury_textiles: market', 'silk_luxury_textiles: prosperity: ≥ poor',
      'spices_dyes: imports', 'spices_dyes: market',
      'transit_finance: institution: bank',
      'wine_spirits: imports',
    ]);
  });
  it('the smuggling pool declares its chain\'s own scope (its rows print on that chain\'s card alone)', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    expect(Object.keys(mod.CHAIN_SCOPED_POOLS)).toEqual(['smuggling']);
    expect(String(mod.CHAIN_SCOPED_POOLS.smuggling)).toMatch(/EconomicsTab\.jsx :: EconomicFlowsSection/);
    expect(String(mod.CHAIN_SCOPED_POOLS.smuggling)).toMatch(/Services\.jsx :: ChainCard/);
  });
});

describe('(f) the atom the chair granted: carrier: own|transit, chain-scoped, read by chainCarrierOf', () => {
  it('the dimension is appended, homed on factsOf, and needs the chain', () => {
    const keys = Object.keys(FACT_DIMENSIONS);
    expect(keys[keys.length - 1]).toBe('carrier');
    expect(FACT_DIMENSIONS.carrier).toMatchObject({ shape: 'presence', home: 'chainCarrier', keys: ['own', 'transit'], needsContext: 'chain' });
  });
  it('own where the chain\'s resource is the place\'s own; transit where it runs on passing trade; unanswered without the chain', () => {
    const chain = { chainId: 'salt', resource: 'Salt flats', resourceKey: 'salt_flats', resourceActive: true, entrepot: true };
    const own = factsOf({ config: { nearbyResources: ['salt_flats'] } });
    const away = factsOf({ config: { nearbyResources: [] } });
    expect(atomHolds('carrier: own', own, { chain })).toBe(true);
    expect(atomHolds('carrier: transit', own, { chain })).toBe(false);
    expect(atomHolds('carrier: transit', away, { chain })).toBe(true);
    expect(atomHolds('carrier: own', own, {})).toBeUndefined();
  });
});

/** A text that says the good comes from elsewhere (the chair's call (2), its phrases and their plain kin). */
const FROM_ELSEWHERE = /\bcomes? in\b|\bcoming (?:in|through)\b|\barriv|\bfrom far away\b|\bfrom distant lands\b|\bbought in\b|other places' goods|from several directions|\bbrought in\b|\bcomes? (?:up|down) the river\b|\bfrom elsewhere\b|\belsewhere and\b|\bcarried a long way to reach\b/i;
const OWNABLE = Object.freeze(['salt', 'furs_north', 'luxury_goods', 'magical_goods']);

describe('(g) the chair\'s calls, rewordings and conditions (17:18 UTC)', () => {
  it('(1) an own row names the record\'s own resource, never a fixed noun', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const bad = everyRow(mod).filter(([, r]) => (r.needs || []).includes('carrier: own'))
      .filter(([, r]) => !String(r.text).includes('{resource}') || /salt flats|hunting grounds|veins|ley line|node/i.test(String(r.text)))
      .map(([id, r]) => `${id}[${r.id}]`);
    expect(bad).toEqual([]);
    expect(everyRow(mod).filter(([, r]) => typeof r.text === 'string' && r.text.includes('{resource}') && !(r.needs || []).includes('carrier: own')).map(([id, r]) => `${id}[${r.id}]`)).toEqual([]);
  });
  it('(2) every row of a chain that can be the place\'s own that says the good comes from elsewhere declares carrier: transit', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const bad = everyRow(mod).filter(([id, r]) => OWNABLE.includes(id) && typeof r.text === 'string' && FROM_ELSEWHERE.test(r.text) && !(r.needs || []).includes('carrier: transit'))
      .map(([id, r]) => `${id}[${r.id}]: ${r.text}`);
    expect(bad).toEqual([]);
  });
  it('(3) row 0 is today\'s sentence, drawn only where its own route claim holds', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const CLAIMS = {
      salt: ['crossroads', 'port'], luxury_goods: ['crossroads', 'port', 'river'], spices_dyes: ['crossroads', 'port'],
      silk_luxury_textiles: ['crossroads', 'port'], transit_finance: ['crossroads', 'port', 'river'], warehouse_logistics: ['crossroads', 'port'],
      wine_spirits: ['port', 'river'], smuggling: ['crossroads', 'port', 'river'], furs_north: [...ROUTE_WORDS].sort(), magical_goods: [...ROUTE_WORDS].sort(),
    };
    expect(Object.keys(mod.ENTREPOT_NOTES).sort()).toEqual(Object.keys(CLAIMS).sort());
    for (const [id, routes] of Object.entries(CLAIMS)) {
      const row0 = mod.ENTREPOT_NOTES[id][0];
      expect(row0.id, id).toBe('canonical');
      expect(rowsOf(mod, { chainId: id, entrepotNote: TODAY[id] }, {}, TODAY[id])[0].text, id).toBe(TODAY[id]);
      const held = ROUTE_WORDS.filter((route) => declarationAdmits(declarationOf(row0), /** @type {any} */ ({ route })).admitted).sort();
      expect(held, id).toEqual(routes);
    }
  });
  it('the eight rewordings stand verbatim (three of them as the chair re-ruled them at 18:52 UTC)', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const text = (id, rowId) => mod.ENTREPOT_NOTES[id].find((r) => r.id === rowId)?.text;
    expect(text('salt', 'salt-own-keep')).toBe('{resource} nearby supply the salt, for preserving food here and for selling on.');
    expect(text('furs_north', 'furs-port')).toBe('Furs are gathered here and shipped on by sea.');
    expect(text('furs_north', 'furs-own')).toBe('Many of the furs sold here are taken on the place\'s own {resource}.');
    expect(text('furs_north', 'furs-transit')).toBe('None of these furs are taken here; they come from hunting grounds elsewhere and are traded on.');
    expect(text('luxury_goods', 'lux-own')).toBe('The luxury trade here begins with the {resource} nearby.');
    expect(text('silk_luxury_textiles', 'silk-steady')).toBe('Fine cloth from far away is a steady trade here, silk among it.');
    expect(text('wine_spirits', 'wine-tavern')).toBe('Some of the wine coming through is drunk here; the rest is sold on.');
    // "(no needs)": no house; its one atom is the goods class's declaration (imports), held wherever the wine chain is
    expect(mod.ENTREPOT_NOTES.wine_spirits.find((r) => r.id === 'wine-tavern').needs).toEqual(['imports']);
    expect(text('magical_goods', 'magic-own')).toBe('The enchanted goods sold here begin at the {resource} nearby, and go on to buyers elsewhere.');
  });
  it('(a) the luxury rows name fine metalwork and jewellery only where the chain\'s own record names them', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const named = { chainId: 'luxury_goods', outputs: ['Luxury manufactured goods', 'Fine metalwork and jewelry'] };
    const bare = { chainId: 'luxury_goods', outputs: ['Luxury manufactured goods'] };
    const textOf = (chain, rowId) => rowsOf(mod, chain, {}, TODAY.luxury_goods).find((r) => r.id === rowId).text;
    for (const rowId of ['lux-kinds', 'lux-market']) {
      expect(textOf(named, rowId), rowId).toMatch(/jewellery/);
      expect(textOf(bare, rowId), rowId).not.toMatch(/jewel|metalwork/);
      expect(textOf(bare, rowId), rowId).toMatch(/costly goods/i);
    }
  });
  it('the chair\'s ruling of 18:52 UTC: two more furs rows; the four open-trade rows dropped (the draw cannot read a siege)', async () => {
    const mod = await pools();
    expect(mod, `${POOL_FILE}: the pools of the entrepôt note`).not.toBeNull();
    const row = (id, rowId) => mod.ENTREPOT_NOTES[id].find((r) => r.id === rowId);
    expect(mod.ENTREPOT_NOTES.furs_north).toHaveLength(13);
    for (const rowId of ['furs-among', 'furs-leather']) {
      // no need of the place's own: the goods class's declaration only (imports / exports: held wherever the chain is)
      expect((row('furs_north', rowId).needs || []).filter((a) => !['imports', 'exports'].includes(a)), rowId).toEqual([]);
      expect(row('furs_north', rowId).excludes, rowId).toBeUndefined();
    }
    const OPEN_TRADE = [['salt', 'salt-wanted'], ['luxury_goods', 'lux-value'], ['wine_spirits', 'wine-through'], ['transit_finance', 'fin-lend']];
    for (const [id, rowId] of OPEN_TRADE) expect(row(id, rowId), `${id}[${rowId}]`).toBeUndefined();
  });
  it('the pick is the mixed keyed pick, keyed on the seed, the field and the chain', () => {
    const src = readFileSync(POOL_FILE, 'utf8');
    expect(src).toMatch(/pickVariantMixed\(/);
    expect(src).not.toMatch(/\bpickVariant\(/);
    expect(src).toContain('`${seed}::entrepotNote::${chain.chainId}`');
  });
});
