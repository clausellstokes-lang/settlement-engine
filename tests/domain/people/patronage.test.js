/**
 * tests/domain/people/patronage.test.js — RULING PATRONAGE's invariants (the allegiance train, car 3,
 * ALLEGIANCE-CAR3, 2026-11-08; docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §3.3, §4 I-6 / I-7; J-9).
 *
 *   I-6  no boosted power passes its ruler: a power at or below the ruler at base ends at most
 *        `ceilingGap` under the ruler (or at its own base, where the base already stands within the gap);
 *        boost 0 for every power above the ruler at base; boost ≤ cap · base; boost ≥ 0.
 *   I-7  patronage stores nothing: the stored `powerStructure` (every row's `power` and every other key)
 *        is byte-identical before and after `patronageOf`, and the stored powers still sum to 100.
 *
 * Over two populations: the soak slice (the cities and metropolises of the soak 1,000's first 240, where
 * the ruling three hold the most other memberships, every rank the generator deals), and a property
 * over arbitrary ranks, shares and strengths (fast-check, the global pinned seed). Each check reds on a
 * planted violation (its control), so a green arm proves the check is live.
 */
import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { birth, ensureLaws } from '../../../scripts/audit/soak-review/corpus.mjs';
import { patronageOf, effectiveStrengthOf, RULING_PATRONAGE_TUNING } from '../../../src/domain/people/patronage.js';

const SLICE = Array.from({ length: 240 }, (_, i) => i).filter((i) => i % 6 === 4 || i % 6 === 5);
/** @type {Map<number, any>} */
const BORN = new Map();
async function born() {
  await ensureLaws();
  for (const i of SLICE) if (!BORN.has(i)) BORN.set(i, birth(i).settlement);
  return SLICE.map((i) => ({ i, s: BORN.get(i) }));
}

/**
 * Every I-6 finding on one patronage reading.
 * @param {ReturnType<typeof patronageOf>} p @returns {string[]}
 */
export function ceilingFindings(p) {
  const T = RULING_PATRONAGE_TUNING;
  const out = [];
  for (const row of p.powers) {
    const tag = `${row.power} (base ${row.base}, ruler ${p.rulerBase})`;
    if (!(row.boost >= 0)) out.push(`I-6 ${tag}: a negative boost ${row.boost}`);
    if (row.boost > T.cap * row.base + 1e-9) out.push(`I-6 ${tag}: boost ${row.boost} over the cap`);
    if (row.base > p.rulerBase && row.boost !== 0) out.push(`I-6 ${tag}: a power above the ruler at base gained ${row.boost}`);
    if (row.base <= p.rulerBase && row.effective > Math.max(row.base, p.rulerBase - T.ceilingGap) + 1e-9) {
      out.push(`I-6 ${tag}: effective ${row.effective} passes the ceiling`);
    }
    if (Math.abs(row.effective - (row.base + row.boost)) > 1e-9) out.push(`I-6 ${tag}: effective ≠ base + boost`);
  }
  return out;
}

/** A settlement-shaped town from a property case. */
const townArb = fc.record({
  ruler: fc.integer({ min: 1, max: 100 }),
  others: fc.array(fc.integer({ min: 1, max: 100 }), { minLength: 1, maxLength: 5 }),
  vacant: fc.boolean(),
  three: fc.array(fc.record({
    shares: fc.array(fc.double({ min: 0, max: 1, noNaN: true }), { minLength: 1, maxLength: 5 }),
    hidden: fc.option(fc.integer({ min: 0, max: 4 }), { nil: null }),
  }), { minLength: 1, maxLength: 3 }),
}).map(({ ruler, others, vacant, three }) => {
  const names = others.map((_, i) => `Power ${i}`);
  return {
    powerStructure: { factions: [
      { faction: 'The Ruler', power: ruler, isGoverning: true, modifiers: vacant ? ['vacant'] : [] },
      ...others.map((power, i) => ({ faction: names[i], power, category: i === 0 ? 'criminal' : 'economy' })),
    ] },
    npcs: three.map((f, r) => ({
      id: `npc_${r}`, name: `Face ${r}`,
      memberships: [{ power: 'The Ruler', rank: r + 1, share: 0.5 },
        ...f.shares.slice(0, names.length).map((share, i) => ({ power: names[i], rank: null, share }))],
      ...(f.hidden != null ? { allegiance: { power: names[f.hidden % names.length], house: 'A Den', vector: 'greed', via: 'office', handler: 'x', share: 0.15, veiled: true, covert: true } } : {}),
    })),
  };
});

describe('ruling patronage (car 3)', () => {
  it('I-6 holds over arbitrary ranks, shares and strengths (property)', () => {
    fc.assert(fc.property(townArb, (s) => ceilingFindings(patronageOf(s)).length === 0));
  });

  it('I-6 holds on the soak slice, and is not vacuous (boosted powers exist, the cap and the ceiling bind)', async () => {
    const towns = await born();
    const findings = towns.flatMap(({ i, s }) => ceilingFindings(patronageOf(s)).map((f) => `soak1k-${i} ${f}`));
    expect(findings).toEqual([]);
    const rows = towns.flatMap(({ s }) => patronageOf(s).powers);
    expect(rows.filter((r) => r.boost > 0).length).toBeGreaterThan(20);
    expect(rows.filter((r) => r.bound === 'above-ruler').length).toBeGreaterThan(0);
  }, 300_000); // the slice's births (car 1's allegiance.test.js budget)

  it('I-6 control: a planted over-cap, past-ceiling and above-ruler boost each read as a finding', () => {
    const p = { ruler: 'R', rulerBase: 30, powers: [
      { power: 'A', base: 10, raw: 9, boost: 9, effective: 19, bound: null, hidden: false, patrons: [] },
      { power: 'B', base: 28, raw: 2, boost: 2, effective: 30, bound: null, hidden: false, patrons: [] },
      { power: 'C', base: 40, raw: 1, boost: 1, effective: 41, bound: null, hidden: false, patrons: [] },
    ] };
    const f = ceilingFindings(/** @type {any} */ (p));
    expect(f.some((x) => x.startsWith('I-6 A') && x.includes('over the cap'))).toBe(true);
    expect(f.some((x) => x.startsWith('I-6 B') && x.includes('passes the ceiling'))).toBe(true);
    expect(f.some((x) => x.startsWith('I-6 C') && x.includes('above the ruler'))).toBe(true);
  });

  it('I-7: patronageOf stores nothing — the powerStructure and the cast are byte-identical, the 100-sum holds', async () => {
    const towns = await born();
    let touched = 0;
    for (const { i, s } of towns) {
      const before = JSON.stringify({ ps: s.powerStructure, npcs: s.npcs });
      const p = patronageOf(s);
      if (p.powers.some((r) => r.boost > 0)) touched += 1;
      for (const r of p.powers) effectiveStrengthOf(s, r.power, p);
      expect(JSON.stringify({ ps: s.powerStructure, npcs: s.npcs }), `soak1k-${i}`).toBe(before);
      const sum = (s.powerStructure.factions || []).reduce((a, f) => a + (Number(f.power) || 0), 0);
      expect(sum, `soak1k-${i}`).toBe(100);
    }
    expect(touched).toBeGreaterThan(10);
  }, 300_000);

  it('I-7 control: a planted store (the effective written onto the row) reads as a change', () => {
    const s = /** @type {any} */ (fc.sample(townArb, { numRuns: 1, seed: 7 })[0]);
    s.npcs[0].memberships.push({ power: 'Power 0', rank: null, share: 1 });
    s.powerStructure.factions[0].power = 100;
    s.powerStructure.factions[1].power = 10;
    const before = JSON.stringify(s.powerStructure);
    const p = patronageOf(s);
    const row = p.powers.find((r) => r.boost > 0);
    expect(row).toBeTruthy();
    // the plant: what a storing implementation would do
    s.powerStructure.factions.find((f) => f.faction === row?.power).power = row?.effective;
    expect(JSON.stringify(s.powerStructure)).not.toBe(before);
  });

  it('the formula: rank weights × share × base, a hidden allegiance at its share, a steward at rank 2\'s weight', () => {
    const T = RULING_PATRONAGE_TUNING;
    const town = (vacant) => ({
      powerStructure: { factions: [
        { faction: 'Council', power: 50, isGoverning: true, modifiers: vacant ? ['vacant'] : [] },
        { faction: 'Guild', power: 20 },
        { faction: 'Thieves', power: 10, category: 'criminal' },
      ] },
      npcs: [
        { id: 'a', name: 'A', memberships: [{ power: 'Council', rank: 1, share: 0.5 }, { power: 'Guild', rank: null, share: 0.5 }] },
        { id: 'b', name: 'B', memberships: [{ power: 'Council', rank: 3, share: 1 }],
          allegiance: { power: 'Thieves', house: 'Den', vector: 'greed', via: 'office', handler: 'z', share: 0.15, veiled: true, covert: true } },
        { id: 'c', name: 'C', memberships: [{ power: 'Guild', rank: 1, share: 1 }] },
      ],
    });
    const p = patronageOf(town(false));
    const guild = p.powers.find((r) => r.power === 'Guild');
    const thieves = p.powers.find((r) => r.power === 'Thieves');
    expect(guild?.boost).toBeCloseTo(T.byRank[1] * 0.5 * 20, 9);
    expect(guild?.patrons.map((x) => [x.id, x.rank, x.kind])).toEqual([['a', 1, 'open']]);
    expect(thieves?.boost).toBeCloseTo(T.byRank[3] * 0.15 * 10, 9);
    expect(thieves?.hidden).toBe(true);
    expect(p.powers.map((r) => r.power)).toEqual(['Guild', 'Thieves']);
    const v = patronageOf(town(true)).powers.find((r) => r.power === 'Guild');
    expect(v?.patrons[0].rank).toBe('steward');
    expect(v?.boost).toBeCloseTo(T.steward * 0.5 * 20, 9);
    expect(effectiveStrengthOf(town(false), 'Council')).toBe(50);
  });
});
