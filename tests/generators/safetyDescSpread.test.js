/**
 * tests/generators/safetyDescSpread.test.js — PLACE-1's first unit (2026-11-20; the owner's order "comprehensively fix the
 * sameness fault"; `docs/chair/2026-11-20/content/place/BRIEF-BUILD-safetyDesc.md`, `safetyDesc-MEASURE.md`).
 *
 * The Defense tab's safety line (`economicState.safetyProfile.safetyDesc`) printed one sentence in 67 of 100 thorps and 73
 * of 100 towns: the Moderate line (small place, and village and up) and the city's Unsafe-with-a-garrison line. The cure
 * draws each sentence slot from its own declared pool (`src/data/safetyDescLines.js`), by keyed hash with no roll.
 *
 *   (a) THE BAR: on 150 places a size (`hxd-<size>-0..149`, born and masked as the chair's stored-sentence census births
 *       and masks them), no sentence of the line in more than 15% of a size's places (22 of 150);
 *   (b) every pool row the stored line prints is admitted by the FINAL record (its declared `needs` / `excludes`);
 *   (c) CANONICAL AT ZERO: a seedless `generateSafetyProfile` prints today's line, byte for byte, in every branch the cure
 *       composes (Moderate small place with and without walls; Moderate village-and-up under each force; Unsafe with a
 *       garrison);
 *   (d) the planted control: the same lines with every pool collapsed to one row (what a one-row pool prints) red (a);
 *   (e) the chair's condition of 16:51 UTC, corrected at 17:13 UTC (the line prints on player and public pages): no row
 *       needs or excludes a house of a hideable kind (`cardVeil.js :: isHideableHouse`: criminal or clandestine) nor any
 *       fact about crime or a clandestine thing, so a shared page never reveals a hidden house by which sentence it got.
 *       Each atom a row declares is mapped to the catalogue houses its home reads; planted controls: a row needing
 *       organised crime, and a market read by name (which takes in the black market), are caught.
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { generateSafetyProfile } from '../../src/generators/safetyProfile.js';
import { defenceOf } from '../../src/domain/facts/defence.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomsOf, declarationAdmits, declarationOf, parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { DEFENSE_BUCKET_KEYWORDS } from '../../src/domain/institutions/defenseInstitutionBuckets.js';
import { isMarketInstitution } from '../../src/domain/facts/market.js';

const SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const N = 150;
const BAR = Math.floor(0.15 * N); // 22 of 150: no more than 15% of a size's places (the chair's bar on 150, 18:36 UTC)
const SLOW = 300_000;

/** The pool module (absent before the build: every test that reads it reds on its absence, not on a load error). */
let poolsLoaded = false;
/** @type {Record<string, any> | null} */ let POOLS = null;
async function pools() {
  if (!poolsLoaded) {
    poolsLoaded = true;
    POOLS = await import('../../src/data/safetyDescLines.js').catch(() => null);
  }
  return POOLS;
}
/** Every pool of the module, by name: `[name, rows]` (an object of pools, such as the force slot's, flattened). */
function poolList(mod) {
  /** @type {Array<[string, ReadonlyArray<{ text: string }>]>} */ const out = [];
  for (const [name, v] of Object.entries(mod || {})) {
    if (Array.isArray(v)) out.push([name, v]);
    else if (v && typeof v === 'object') for (const [k, rows] of Object.entries(v)) if (Array.isArray(rows)) out.push([`${name}.${k}`, rows]);
  }
  return out;
}

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const sentences = (s) => String(s).split(/(?<=[.!?])\s+/).filter(Boolean);

let loaded = false;
/** @type {Record<string, Array<{ seed: string, t: any, stored: string, masked: string, mask: (s: string) => string }>>} */
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
    const stored = String(t.economicState?.safetyProfile?.safetyDesc ?? '');
    out.push({ seed, t, stored, masked: mask(stored), mask });
  }
  BORN[size] = out;
  return out;
}

/** The sentences printed in more than BAR of the places: `["<count> <sentence>"]`. @param {string[]} lines masked */
function overBar(lines) {
  const m = new Map();
  for (const l of lines) for (const s of new Set(sentences(l))) m.set(s, (m.get(s) || 0) + 1);
  return [...m].filter(([, c]) => c > BAR).sort((a, b) => b[1] - a[1]).map(([s, c]) => `${c} ${s}`);
}

describe('(a) the bar: no sentence of the safety line in more than 15% of 150 places a size', () => {
  for (const size of SIZES) {
    it(`${size}: no sentence of safetyDesc in more than ${BAR} of ${N} places`, async () => {
      const born = await bornOf(size);
      expect(born).toHaveLength(N);
      expect(overBar(born.map((b) => b.masked))).toEqual([]);
    }, SLOW);
  }
});

describe('(b) every pool row the line prints is admitted by the FINAL record', () => {
  it('the pool module exists and every printed row\'s needs and excludes hold on the final record (0 refused)', async () => {
    const mod = await pools();
    expect(mod, 'src/data/safetyDescLines.js: the pools of the safety line').not.toBeNull();
    const refused = [];
    let checked = 0; let beyondIndexZero = 0;
    for (const size of SIZES) {
      for (const b of await bornOf(size)) {
        const facts = factsOf(b.t);
        for (const [name, rows] of poolList(mod)) {
          rows.forEach((row, i) => {
            if (!b.stored.includes(row.text)) return;
            checked++; if (i > 0) beyondIndexZero++;
            const v = declarationAdmits(declarationOf(row), facts);
            if (!v.admitted) refused.push(`${b.seed} ${name}[${i}]: ${row.text.trim().slice(0, 60)} (${(v.refused || []).join(', ')})`);
          });
        }
      }
    }
    expect(checked, 'rows found printed').toBeGreaterThan(400);
    expect(beyondIndexZero, 'rows beyond index 0 printed').toBeGreaterThan(200);
    expect(refused).toEqual([]);
  }, SLOW);
});

/** Today's line, spelled as the writer spelled it before the cure, for the branches the cure composes. */
const TODAY = Object.freeze({
  tiny: 'The neighbours keep an eye on one another, and what trouble there is, everyone soon hears of.',
  moderateWalls: ' The walls keep the trouble inside, off the roads beyond.',
  force: { garrison: 'The garrison patrols', watch: 'The watch covers', militia: 'Militia volunteers patrol', none: 'Locals watch over' },
  unsafe: 'Crime is a persistent and visible problem. The garrison is overwhelmed or corrupt. Travelers are advised to move in groups and keep valuables hidden.',
  unsafeWalls: " Walls slow entry but don't solve what happens inside them.",
});

describe('(c) canonical at zero: a seedless call prints today\'s line in every composed branch', () => {
  it('Moderate (small place; village and up under each force; walls or none) and Unsafe with a garrison, byte for byte', async () => {
    const seen = new Set();
    const wrong = [];
    for (const size of SIZES) {
      for (const b of await bornOf(size)) {
        const { config, tier, institutions } = b.t;
        const p = generateSafetyProfile(config, tier, institutions); // no active stream: seedless
        const d = defenceOf({ institutions });
        const walls = d.walls;
        let kind = null; let want = null;
        if (p.safetyLabel === 'Moderate') {
          const wallNote = walls ? TODAY.moderateWalls : '';
          if (['thorp', 'hamlet'].includes(tier)) { kind = `moderate.tiny${walls ? '+walls' : ''}`; want = `${TODAY.tiny}${wallNote}`; }
          else {
            const force = d.garrison ? 'garrison' : d.watch ? 'watch' : d.militia ? 'militia' : 'none';
            kind = `moderate.${force}${walls ? '+walls' : ''}`;
            want = `A mix of safer and more exposed areas. ${TODAY.force[force]} the main paths; quieter spots after dark carry genuine risk. Residents know which corners to avoid.${wallNote}`;
          }
        } else if (p.safetyLabel === 'Unsafe' && d.garrison) {
          kind = `unsafe.garrison${walls ? '+walls' : ''}`; want = `${TODAY.unsafe}${walls ? TODAY.unsafeWalls : ''}`;
        }
        if (!kind) continue;
        seen.add(kind);
        if (p.safetyDesc !== want) wrong.push(`${b.seed} ${kind}: "${p.safetyDesc}"`);
      }
    }
    expect(wrong).toEqual([]);
    expect([...seen].sort()).toEqual(expect.arrayContaining([
      'moderate.tiny', 'moderate.tiny+walls', 'moderate.garrison+walls', 'moderate.watch', 'moderate.watch+walls',
      'moderate.militia+walls', 'moderate.none', 'moderate.none+walls', 'unsafe.garrison+walls',
    ]));
  }, SLOW);
});

/**
 * THE HOUSES EACH ATOM READS (the chair's condition, corrected 17:13 UTC). Each dimension a row may declare is mapped to
 * the catalogue houses its home counts (`defenseInstitutionBuckets.js :: DEFENSE_BUCKET_KEYWORDS` for the defence atoms,
 * `defenseFacts.js`'s timber and gate words for `palisade` and `gate`, `orderForce.js`'s houses for the force's hours,
 * `market.js :: isMarketInstitution` for the market). The tier, the route and a crisis read no house (the tier, the config,
 * the stresses). A dimension not mapped here is red, so a new atom is mapped before a row may declare it.
 */
const CATALOGUE = (() => {
  const byName = new Map();
  for (const shelves of Object.values(institutionalCatalog)) for (const [category, rows] of Object.entries(shelves || {})) {
    for (const [name, row] of Object.entries(rows || {})) if (!byName.has(name)) byName.set(name, { name, category, ...row });
  }
  return [...byName.values()];
})();
const named = (bucket) => (h) => DEFENSE_BUCKET_KEYWORDS[bucket].some((kw) => h.name.toLowerCase().includes(kw));
const TIMBER = /palisade|earthwork/i; // defenseFacts.js :: TIMBER_ENCLOSURE_RE
const GATE = /\bgates?\b/i; // defenseFacts.js :: GATE_RE
/** @type {Record<string, (h: any) => boolean>} */
const ATOM_HOUSES = Object.freeze({
  walls: named('walls'),
  palisade: (h) => named('walls')(h) && TIMBER.test(h.name),
  gate: (h) => (named('walls')(h) && !TIMBER.test(h.name)) || GATE.test(h.name),
  watch: named('watch'), garrison: named('garrison'), militia: named('militia'),
  guardPresence: (h) => ['watch', 'garrison', 'militia', 'mercenary'].some((b) => named(b)(h)) || /\bfree company\b/i.test(h.name),
  'force walks by day': (h) => ['watch', 'garrison', 'militia'].some((b) => named(b)(h)),
  market: (h) => isMarketInstitution(h),
});
const NO_HOUSE = new Set(['tier', 'route', 'crisis']);
/** A fact about crime or a clandestine thing, by its dimension's name. */
const CRIME_OR_CLANDESTINE = /crim|clandest|smuggl|thie|black|gang|fence|underground|veil|hidden|covert|guild|capture|bribe|corrupt/i;

/**
 * Every row's atoms against the houses they read: `{ violations, houses }`, `houses` the catalogue houses each pool's
 * declarations read (by pool name). @param {Array<[string, ReadonlyArray<object>]>} poolRows @param {Record<string, (h: any) => boolean>} map
 */
function hideableReads(poolRows, map = ATOM_HOUSES) {
  const violations = []; /** @type {Record<string, Set<string>>} */ const houses = {};
  for (const [name, rows] of poolRows) {
    houses[name] = new Set();
    rows.forEach((row, i) => {
      for (const atom of atomsOf(declarationOf(row))) {
        const parsed = parseAtom(String(atom).replace(/^no\s+/, ''));
        const d = parsed?.dimension ?? String(atom);
        const at = `${name}[${i}] ${atom}`;
        if (CRIME_OR_CLANDESTINE.test(d)) { violations.push(`${at}: a fact about crime or a clandestine thing`); continue; }
        if (NO_HOUSE.has(d)) continue;
        const reads = map[d];
        if (!reads) { violations.push(`${at}: the houses it reads are not mapped`); continue; }
        const hs = CATALOGUE.filter(reads);
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
    expect(mod, 'src/data/safetyDescLines.js: the pools of the safety line').not.toBeNull();
    const { violations, houses } = hideableReads(poolList(mod));
    expect(violations).toEqual([]);
    expect(Object.values(houses).some((s) => s.size > 0), 'the rows read some house').toBe(true);
  });
  it('the planted controls: a row needing organised crime is caught; an atom whose houses include a hideable one is caught', () => {
    const planted = [['PLANTED', [Object.freeze({ text: 'Organised crime has the run of the place.', needs: Object.freeze(['crime: organized']) })]]];
    expect(hideableReads(/** @type {any} */ (planted)).violations).toEqual(['PLANTED[0] crime: organized: a fact about crime or a clandestine thing']);
    const market = [['PLANTED', [Object.freeze({ text: 'The market is busy.', needs: Object.freeze(['market']) })]]];
    const wide = { ...ATOM_HOUSES, market: (h) => /market/i.test(h.name) }; // a market read by its name takes in the black market
    expect(hideableReads(/** @type {any} */ (market), wide).violations.some((v) => /hideable house \(Black market\)/.test(v))).toBe(true);
    expect(hideableReads(/** @type {any} */ (market)).violations).toEqual([]);
  });
});

describe('(d) the planted control: a one-row pool reds the bar', () => {
  it('every size\'s lines, each pool collapsed to its index 0, are over the bar', async () => {
    const mod = await pools();
    expect(mod, 'src/data/safetyDescLines.js: the pools of the safety line').not.toBeNull();
    const collapse = (line) => {
      let out = line;
      for (const [, rows] of poolList(mod)) for (const row of rows.slice(1)) if (out.includes(row.text)) out = out.split(row.text).join(rows[0].text);
      return out;
    };
    const green = [];
    for (const size of SIZES) {
      const born = await bornOf(size);
      if (overBar(born.map((b) => b.mask(collapse(b.stored)))).length === 0) green.push(size);
    }
    expect(green, 'sizes a one-row pool leaves under the bar').toEqual([]);
  }, SLOW);
});
