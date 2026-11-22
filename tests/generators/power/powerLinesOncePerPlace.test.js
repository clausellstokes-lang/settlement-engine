/**
 * tests/generators/power/powerLinesOncePerPlace.test.js — PEOPLE-2 builder B2b, resumed by PEOPLE-3 builder B2
 * (2026-11-22): NO TWO POWERS OF ONE PLACE PRINT THE SAME SENTENCE WHILE ANOTHER ADMITTED LINE STANDS (the chair's order of
 * 20:44 UTC: "a sentence still repeated inside one place" is one of the owner's three stop conditions).
 *
 * THE SAMPLE is the chair's instrument's (as `powerLinesVoiced.test.js`): 150 places a size, seeds `hxd-<size>-0..149`, born
 * through the real pipeline, the place's own names masked to `#` and digits to `0`.
 *
 * THE UNIT: every sentence of every power's printed description (opening, standing codas, stress tails), owned by its
 * power, and every relation narrative, counted whole, owned by its pair. A REPEAT is one masked sentence with two or more
 * owners in one place.
 *
 * THE LAW (red at the B2 cure): a repeat of a POOLED line (`src/data/powerLineVariants.js`: an opening, a coda or a relation
 * branch's line, today's or a wording) fails where the pool had another admitted line the place had not printed (its
 * declaration admitted by the record's facts, its tie not refused): the pass holds a line printed in the place from later
 * powers' picks (`voicePowerLines`, the hold). A repeat with no admitted alternative (an unpooled line: a stress tail, an
 * unvoiced standing; a pool the place has exhausted) is COUNTED and printed, not failed.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOf } from '../../../src/domain/facts/factVocabulary.js';
import { standingLevelOf } from '../../../src/generators/power/factionStanding.js';
import * as V from '../../../src/data/powerLineVariants.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const N = 150;

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const maskerOf = (names) => {
  const list = [...names].sort((a, b) => b.length - a.length);
  const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
  return (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');
};
const sentencesOf = (s) => String(s).match(/[^.!?]+[.!?]+(\s|$)/g)?.map((x) => x.trim()) || [String(s).trim()];
/** a wording as a pattern: `{…}` a power's name or a verb, `$n` a coda's carried words */
const patternOf = (text, anchored) => new RegExp(`${anchored ? '^' : ''}${esc(text).replace(/\\\{[^}]*\\\}/g, '.+?').replace(/\\\$\d/g, '.+?')}${anchored ? '$' : ''}`, 'i');

/**
 * Every pooled line a description or a relation row prints, by its pool and its identity in it (`today` or the row's id),
 * with the rows the pool could have given there.
 * @returns {Array<{ pool: string, id: string, printed: string, options: ReadonlyArray<any>, level: boolean, todayRefused: boolean }>}
 */
function pooledOf(t, f, row) {
  const out = [];
  if (f) {
    const desc = String(f.desc || '');
    for (const [open, pool] of Object.entries(V.DESC_POOLS)) {
      const options = [{ id: 'today', text: open, needs: pool.todayNeeds }, ...pool.rows];
      const printed = options.find((w) => desc === w.text || desc.startsWith(`${w.text} `));
      if (printed) out.push({ pool: `DESC_POOLS.${pool.id}`, id: printed.id, printed: printed.text, options, level: false, todayRefused: false });
    }
    for (const c of V.CODA_POOLS) {
      if (!c.rows.length) continue;
      const level = standingLevelOf(t.powerStructure.factions, f, c.id) === true;
      const todayRefused = c.today === 'never' || (c.today === 'excludesLevel' && level);
      const options = [{ id: 'today', re: c.re }, ...c.rows.map((r) => ({ ...r, re: patternOf(r.text, false) }))];
      for (const o of options) {
        const m = o.re.exec(desc);
        if (m) out.push({ pool: `CODA_POOLS.${c.id}`, id: o.id, printed: m[0], options, level, todayRefused });
      }
    }
  }
  if (row) {
    const n = String(row.narrative || '');
    const today = V.relationBranchOf(row);
    if (today) out.push({ pool: `RELATION_POOLS.${today.id}`, id: 'today', printed: n, options: [{ id: 'today' }, ...(V.RELATION_POOLS[today.id] || [])], level: false, todayRefused: false });
    else {
      for (const [branch, rows] of Object.entries(V.RELATION_POOLS)) {
        const hit = rows.find((r) => patternOf(r.text, true).test(n));
        if (hit) out.push({ pool: `RELATION_POOLS.${branch}`, id: hit.id, printed: n, options: [{ id: 'today' }, ...rows], level: false, todayRefused: false });
      }
    }
  }
  return out;
}

/** @type {Record<string, { places: number, failed: string[], unavoidable: number, repeats: Map<string, number> }>} */
const SAMPLE = {};

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) {
    const failed = [];
    const repeats = new Map();
    let places = 0;
    let unavoidable = 0;
    for (let i = 0; i < N; i++) {
      const seed = `hxd-${size}-${i}`;
      const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
      const names = new Set();
      const addName = (x) => {
        if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim());
      };
      addName(t.name);
      for (const p of t.npcs || []) {
        addName(p.name);
        for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) addName(w);
      }
      for (const f of t.powerStructure?.factions || []) {
        addName(f.name);
        addName(f.faction);
      }
      const mask = maskerOf(names);
      const facts = factsOf(t);
      /** masked sentence -> its owners, and the pooled lines that carry it */
      const owners = new Map();
      const own = (s, who, pooled) => {
        let e = owners.get(s);
        if (!e) {
          e = { who: new Set(), pooled: [] };
          owners.set(s, e);
        }
        e.who.add(who);
        e.pooled.push(...pooled);
      };
      /** pool -> the identities the place printed from it */
      const printedOf = new Map();
      const lines = [];
      for (const f of t.powerStructure?.factions || []) lines.push({ who: `power:${f.faction}`, text: String(f.desc || ''), pooled: pooledOf(t, f, null) });
      for (const r of t.powerStructure?.factionRelationships || []) {
        if (typeof r.narrative === 'string' && r.narrative.trim()) lines.push({ who: `pair:${[...(r.pair || [])].map(String).sort().join('||')}`, text: r.narrative.trim(), pooled: pooledOf(t, null, r), whole: true });
      }
      for (const l of lines) {
        for (const p of l.pooled) {
          if (!printedOf.has(p.pool)) printedOf.set(p.pool, new Set());
          printedOf.get(p.pool).add(p.id);
        }
        const sentences = l.whole ? [l.text] : sentencesOf(l.text);
        for (const s of sentences) own(mask(s), l.who, l.pooled.filter((p) => p.printed.includes(s)));
      }
      let repeated = false;
      for (const [s, e] of owners) {
        if (e.who.size < 2) continue;
        repeated = true;
        repeats.set(s, (repeats.get(s) || 0) + 1);
        const pooled = e.pooled[0];
        if (!pooled) {
          unavoidable++;
          continue;
        }
        const used = printedOf.get(pooled.pool) || new Set();
        const free = pooled.options.filter((o) => !used.has(o.id) && !(o.id === 'today' && pooled.todayRefused) && !(pooled.level && o.excludesLevel) && declarationAdmits(declarationOf(o), facts).admitted);
        if (free.length) failed.push(`${seed} ${pooled.pool} ${pooled.id} on ${[...e.who].join(' & ')} (free: ${free.map((o) => o.id).join(', ')})`);
        else unavoidable++;
      }
      if (repeated) places++;
    }
    SAMPLE[size] = { places, failed, unavoidable, repeats };
    const common = [...repeats].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s, k]) => `${k} | ${s}`).join(' · ');
    console.log(`B2b ${size}: places repeating a sentence ${places}/${N} · avoidable ${failed.length} · with no admitted alternative ${unavoidable} · commonest: ${common}`);
  }
}, 1_200_000);

describe('no two powers of one place print one pooled sentence while another admitted line stands', () => {
  for (const size of SIZES) {
    it(`${size}: every pooled repeat had no admitted line left`, () => {
      expect(SAMPLE[size].failed).toEqual([]);
    });
  }
});

describe('the hold leaves a seedless record as it came', () => {
  it('a seedless record with two powers of one opening keeps both openings byte for byte', () => {
    const open = Object.keys(V.DESC_POOLS).find((o) => o.startsWith('The trades regulate'));
    const rec = { _seed: '', tier: 'metropolis', population: 90000, institutions: [], powerStructure: { factions: [
      { faction: 'Craft Guilds', power: 20, desc: open },
      { faction: 'Artisans\' Guild', power: 18, desc: open },
    ], factionRelationships: [] } };
    const before = JSON.stringify(rec);
    V.voicePowerLines(rec, standingLevelOf);
    expect(JSON.stringify(rec)).toBe(before);
  });
  it('the same record with a seed prints two different openings', () => {
    const open = Object.keys(V.DESC_POOLS).find((o) => o.startsWith('The trades regulate'));
    for (let k = 0; k < 20; k++) {
      const rec = { _seed: `hold-${k}`, tier: 'metropolis', population: 90000, institutions: [], powerStructure: { factions: [
        { faction: 'Craft Guilds', power: 20, desc: open },
        { faction: 'Artisans\' Guild', power: 18, desc: open },
      ], factionRelationships: [] } };
      V.voicePowerLines(rec, standingLevelOf);
      expect(rec.powerStructure.factions[0].desc).not.toBe(rec.powerStructure.factions[1].desc);
    }
  });
});
