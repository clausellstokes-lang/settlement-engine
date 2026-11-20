/**
 * tests/generators/economyHooksSpread.test.js — PLACE-2's unit (2026-11-20; the owner's order "comprehensively fix the
 * sameness fault"; `docs/chair/2026-11-20/content/place/BRIEF-BUILD-viabilityHooks.md`, `viabilityHooks-MEASURE.md`).
 *
 * The economy's own hooks (`economicViability.plotHooks[].hook`, the Plot Hooks tab's Outlook cards, the PDF's Plot Hooks
 * chapter, the session sheet) printed one sentence in up to 19 of 100 towns: the moderate food gap's merchant (S1t,
 * `outlookHookSiblings.js :: MODERATE_GAP_TWIN`) in the town and the metropolis, the peacetime iron events
 * (`PEACE_IRON_HOOKS`) in the city. The cure draws each of the two from its own declared pool
 * (`src/generators/economy/viabilityHookPools.js`, the measure's §D: 12 gap rows, 13 iron rows, row 0 today's text), by keyed
 * hash with no roll (`kernel/proseHash.js :: pickVariantMixed`, `${seed}::viabilityHooks::<poolId>`), through `drawDeclared`.
 *
 *   (a) THE BAR: on 100 places a size (`hxd-<size>-0..99`, born and masked as the chair's stored-sentence census births and
 *       masks them), no sentence of the field in more than 15% of a size's places (15 of 100), counted over ALL places;
 *   (b) every pool row the stored hooks print is admitted by the FINAL record (its declared `needs` / `excludes`);
 *   (c) CANONICAL AT ZERO: a seedless composer hands back every hook byte for byte (today's texts, every falsy seed); a
 *       seeded one moves only the text: the count, each hook's category and severity are kept;
 *   (d) the planted control: the same hooks with each pool collapsed to its row 0 (what a pool of one wording prints) red (a);
 *   (e) the chair's condition of 16:51 UTC, corrected at 17:13 UTC (the hooks print on the player's page): no row needs or
 *       excludes a house of a hideable kind (`cardVeil.js :: isHideableHouse`) nor any fact about crime or a clandestine
 *       thing; planted controls.
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomsOf, declarationAdmits, declarationOf, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { hasInstitution } from '../../src/domain/facts/institutions.js';
import { isMarketInstitution } from '../../src/domain/facts/market.js';
import { MODERATE_GAP_TWIN, PEACE_IRON_HOOKS } from '../../src/generators/economy/outlookHookSiblings.js';

const SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const N = 100;
const BAR = Math.floor(0.15 * N); // 15 of 100: no more than 15% of a size's places
const SLOW = 300_000;
/** Today's texts the two pools replace (each pool's canonical rows). */
const TODAY_GAP = MODERATE_GAP_TWIN;
const TODAY_IRON = Object.freeze(PEACE_IRON_HOOKS.flat());

/** The pool module (absent before the build: every test that reads it reds on its absence, not on a load error). */
let poolsLoaded = false;
/** @type {Record<string, any> | null} */ let POOLS = null;
async function pools() {
  if (!poolsLoaded) {
    poolsLoaded = true;
    POOLS = await import('../../src/generators/economy/viabilityHookPools.js').catch(() => null);
  }
  return POOLS;
}
/** The module's two pools, by name. @returns {Array<[string, ReadonlyArray<{ id: string, text: string }>]>} */
const poolList = (mod) => [['MODERATE_GAP_POOL', mod?.MODERATE_GAP_POOL], ['IRON_PEACE_POOL', mod?.IRON_PEACE_POOL]].filter(([, rows]) => Array.isArray(rows));

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sentences = (s) => String(s).split(/(?<=[.!?])\s+/).filter(Boolean);
const hookTexts = (t) => (t.economicViability?.plotHooks || []).map((h) => String(h?.hook ?? h ?? ''));

let loaded = false;
/** @type {Record<string, Array<{ seed: string, t: any, stored: string[], mask: (s: string) => string }>>} */
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
    out.push({ seed, t, stored: hookTexts(t), mask });
  }
  BORN[size] = out;
  return out;
}

/** The sentences printed in more than BAR of the places: `["<count> <sentence>"]`. @param {string[][]} places each place's masked hooks */
function overBar(places) {
  const m = new Map();
  for (const hooks of places) for (const s of new Set(hooks.flatMap(sentences))) m.set(s, (m.get(s) || 0) + 1);
  return [...m].filter(([, c]) => c > BAR).sort((a, b) => b[1] - a[1]).map(([s, c]) => `${c} ${s}`);
}

describe('(a) the bar: no sentence of the economy\'s hooks in more than 15% of 100 places a size', () => {
  for (const size of SIZES) {
    it(`${size}: no sentence of economicViability.plotHooks in more than ${BAR} of ${N} places`, async () => {
      const born = await bornOf(size);
      expect(born).toHaveLength(N);
      expect(overBar(born.map((b) => b.stored.map(b.mask)))).toEqual([]);
    }, SLOW);
  }
});

describe('(b) every pool row the hooks print is admitted by the FINAL record', () => {
  it('the pool module exists and every printed row\'s needs and excludes hold on the final record (0 refused)', async () => {
    const mod = await pools();
    expect(mod, 'src/generators/economy/viabilityHookPools.js: the two pools of the economy\'s hooks').not.toBeNull();
    const today = new Set([TODAY_GAP, ...TODAY_IRON]);
    const refused = [];
    let checked = 0; let fresh = 0;
    for (const size of SIZES) {
      for (const b of await bornOf(size)) {
        const facts = factsOf(b.t);
        for (const [name, rows] of poolList(mod)) {
          rows.forEach((row, i) => {
            if (!b.stored.includes(row.text)) return;
            checked++; if (!today.has(row.text)) fresh++;
            const v = declarationAdmits(declarationOf(row), facts);
            if (!v.admitted) refused.push(`${b.seed} ${name}[${i}] ${row.id}: ${row.text.slice(0, 60)} (${(v.refused || []).join(', ')})`);
          });
        }
      }
    }
    expect(checked, 'pool rows found printed').toBeGreaterThan(120);
    expect(fresh, 'new rows (not today\'s texts) printed').toBeGreaterThan(60);
    expect(refused).toEqual([]);
  }, SLOW);
});

describe('(c) canonical at zero, and the weight kept', () => {
  it('a falsy seed hands back every hook byte for byte: today\'s texts, and every birth\'s stored hooks', async () => {
    const mod = await pools();
    expect(mod, 'src/generators/economy/viabilityHookPools.js: viabilityHooksOf').not.toBeNull();
    const record = (await bornOf('town'))[0].t;
    const wrong = [];
    for (const text of [TODAY_GAP, ...TODAY_IRON]) {
      for (const seed of [null, undefined, '', 0]) {
        const hooks = [Object.freeze({ category: 'Strategic Resource', hook: text, severity: 'medium' })];
        const out = mod.viabilityHooksOf(hooks, record, seed);
        if (JSON.stringify(out) !== JSON.stringify(hooks)) wrong.push(`${String(seed)}: ${text.slice(0, 50)} -> ${JSON.stringify(out).slice(0, 80)}`);
      }
    }
    for (const size of SIZES) for (const b of await bornOf(size)) {
      const hooks = b.t.economicViability?.plotHooks || [];
      if (JSON.stringify(mod.viabilityHooksOf(hooks, b.t, null)) !== JSON.stringify(hooks)) wrong.push(`${b.seed}: stored hooks moved`);
    }
    expect(wrong).toEqual([]);
  }, SLOW);
  it('a seeded composer, handed today\'s texts, moves only the text: the count, the order, each category and severity kept', async () => {
    const mod = await pools();
    expect(mod, 'src/generators/economy/viabilityHookPools.js: viabilityHooksOf').not.toBeNull();
    const back = new Map(poolList(mod).flatMap(([, rows]) => rows.map((r) => [r.text, rows[0].text])));
    const wrong = []; let moved = 0;
    for (const size of SIZES) for (const b of await bornOf(size)) {
      const canon = (b.t.economicViability?.plotHooks || []).map((h) => ({ ...h, hook: back.get(h.hook) ?? h.hook }));
      const out = mod.viabilityHooksOf(canon, b.t, b.seed);
      if (out.length !== canon.length) { wrong.push(`${b.seed}: ${canon.length} -> ${out.length} hooks`); continue; }
      out.forEach((h, i) => {
        if (h.category !== canon[i].category || h.severity !== canon[i].severity) wrong.push(`${b.seed}[${i}]: ${canon[i].category}/${canon[i].severity} -> ${h.category}/${h.severity}`);
        if (h.hook !== canon[i].hook) moved++;
      });
    }
    expect(wrong).toEqual([]);
    expect(moved, 'hooks the composer re-worded').toBeGreaterThan(60);
  }, SLOW);
});

describe('(d) the planted control: a pool of one wording reds the bar', () => {
  it('the hooks with each pool collapsed to its row 0 are over the bar in the town, the city and the metropolis', async () => {
    const mod = await pools();
    expect(mod, 'src/generators/economy/viabilityHookPools.js: the two pools of the economy\'s hooks').not.toBeNull();
    const back = new Map(poolList(mod).flatMap(([, rows]) => rows.map((r) => [r.text, rows[0].text])));
    const over = [];
    for (const size of SIZES) {
      const born = await bornOf(size);
      if (overBar(born.map((b) => b.stored.map((h) => b.mask(back.get(h) ?? h)))).length > 0) over.push(size);
    }
    expect(over, 'sizes a one-row pool puts over the bar').toEqual(expect.arrayContaining(['town', 'city', 'metropolis']));
  }, SLOW);
});

/**
 * THE HOUSES EACH ATOM READS (the chair's condition, corrected 17:13 UTC). Each dimension a row may declare is mapped to
 * the catalogue houses its home counts (`institutions.js :: hasInstitution` for `institution: <kind>`,
 * `market.js :: isMarketInstitution` for the market). The route, the terrain and the war read no house (the config, the
 * world). A dimension not mapped here is red, so a new atom is mapped before a row may declare it.
 */
const CATALOGUE = (() => {
  const byName = new Map();
  for (const shelves of Object.values(institutionalCatalog)) for (const [category, rows] of Object.entries(shelves || {})) {
    for (const [name, row] of Object.entries(rows || {})) if (!byName.has(name)) byName.set(name, { name, category, ...row });
  }
  return [...byName.values()];
})();
/** @type {Record<string, (h: any, parsed: any) => boolean>} */
const ATOM_HOUSES = Object.freeze({
  institution: (h, parsed) => hasInstitution({ institutions: [h] }, parsed?.key),
  market: (h) => isMarketInstitution(h),
});
const NO_HOUSE = new Set(['route', 'terrain', 'war']);
/** A fact about crime or a clandestine thing, by its dimension's name or its key. */
const CRIME_OR_CLANDESTINE = /crim|clandest|smuggl|thie|black|gang|fence|underground|veil|hidden|covert|guild|capture|bribe|corrupt/i;

/** Every row's atoms against the houses they read: `{ violations, houses }`. @param {Array<[string, ReadonlyArray<object>]>} poolRows @param {Record<string, Function>} map */
function hideableReads(poolRows, map = ATOM_HOUSES) {
  const violations = []; /** @type {Record<string, Set<string>>} */ const houses = {};
  for (const [name, rows] of poolRows) {
    houses[name] = new Set();
    rows.forEach((row, i) => {
      for (const atom of atomsOf(declarationOf(row))) {
        const parsed = parseAtom(String(atom).replace(/^no\s+/, ''));
        const d = parsed?.dimension ?? String(atom);
        const at = `${name}[${i}] ${atom}`;
        if (CRIME_OR_CLANDESTINE.test(d) || CRIME_OR_CLANDESTINE.test(String(parsed?.key ?? ''))) { violations.push(`${at}: a fact about crime or a clandestine thing`); continue; }
        if (NO_HOUSE.has(d)) continue;
        const reads = map[d];
        if (!reads) { violations.push(`${at}: the houses it reads are not mapped`); continue; }
        const hs = CATALOGUE.filter((h) => reads(h, parsed));
        if (!hs.length) violations.push(`${at}: reads no catalogue house`);
        for (const h of hs) { if (isHideableHouse(h)) violations.push(`${at}: reads a hideable house (${h.name})`); else houses[name].add(h.name); }
      }
    });
  }
  return { violations, houses };
}

describe('(e) the chair\'s condition (16:51 UTC, corrected 17:13 UTC): no row needs a hideable house or a fact about crime', () => {
  it('every atom of every pool row reads only houses `isHideableHouse` does not hide, and no crime or clandestine fact', async () => {
    const mod = await pools();
    expect(mod, 'src/generators/economy/viabilityHookPools.js: the two pools of the economy\'s hooks').not.toBeNull();
    const { violations, houses } = hideableReads(poolList(mod));
    expect(violations).toEqual([]);
    expect(Object.values(houses).some((s) => s.size > 0), 'the rows read some house').toBe(true);
  });
  it('the planted controls: a row needing organised crime is caught; an atom whose houses include a hideable one is caught', () => {
    const planted = [['PLANTED', [Object.freeze({ text: 'Organised crime takes its cut of the grain.', needs: Object.freeze(['crime: organized']) })]]];
    expect(hideableReads(/** @type {any} */ (planted)).violations).toEqual(['PLANTED[0] crime: organized: a fact about crime or a clandestine thing']);
    const market = [['PLANTED', [Object.freeze({ text: 'Iron is sold in the market.', needs: Object.freeze(['market']) })]]];
    const wide = { ...ATOM_HOUSES, market: (h) => /market/i.test(h.name) }; // a market read by its name takes in the black market
    expect(hideableReads(/** @type {any} */ (market), wide).violations.some((v) => /hideable house \(Black market\)/.test(v))).toBe(true);
    expect(hideableReads(/** @type {any} */ (market)).violations).toEqual([]);
  });
});
