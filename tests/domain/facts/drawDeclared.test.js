/**
 * tests/domain/facts/drawDeclared.test.js — CENSUS-1b wave 1 item 3: THE ONE DRAW FUNCTION
 * (`src/domain/facts/drawDeclared.js`; `docs/DESIGN_POOL_CENSUS.md` §3.3), and the §3.3
 * walls-proof table re-run as a test over the shipped leaves.
 *
 * @enforced-by npx vitest run tests/domain/facts/drawDeclared.test.js
 */
import { describe, expect, it } from 'vitest';
import { drawDeclared, filterDeclared, resolveDeclared, lineText } from '../../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { drawVariant, eligibleVariants, hashKey, poolDimensions } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../../src/data/dossierStateProse/warFaith.generated.js';

const WALLED = factsOf({ tier: 'town', institutions: [{ name: 'Town walls', category: 'Defense' }] });
const BARE = factsOf({ tier: 'town', institutions: [] });

/** A seeded-stream stand-in: one roll per call, recorded. */
function stream(rolls) {
  let n = 0;
  const calls = [];
  return { calls, draw: (pool) => { calls.push(pool); const r = rolls[n++ % rolls.length]; return pool.length ? pool[Math.floor(r * pool.length)] : undefined; } };
}

describe('the draw-count rule: one draw, over the full pool, then resolve', () => {
  it('an undeclared pool: the same array, one draw, the same element (byte-identical)', () => {
    const pool = ['a', 'b', 'c'];
    const s = stream([0.5]);
    const out = drawDeclared(pool, { draw: s.draw, facts: null });
    expect(s.calls).toHaveLength(1);
    expect(s.calls[0]).toBe(pool);
    expect(out).toEqual({ line: 'b', text: 'b', refused: null, resolvedBy: 'drawn' });
    // an empty pool keeps the site's own behaviour (pick([]) consumes no roll there, and none here)
    expect(drawDeclared([], { draw: s.draw }).resolvedBy).toBe('none');
  });

  it('a refused winner resolves to its twin, with no further draw; twins are outside the draw', () => {
    const pool = [
      'Plain line.',
      { text: 'Behind its walls, merchants shelter.', needs: ['walls'] },
      { text: 'Inside its fences, merchants shelter.', excludes: ['walls'], twinOf: 'Behind its walls, merchants shelter.' },
    ];
    const s = stream([0.9]);
    const bare = drawDeclared(pool, { draw: s.draw, facts: BARE, key: 'k' });
    expect(s.calls[0]).toHaveLength(2); // the twin is not in the domain
    expect(bare).toMatchObject({ text: 'Inside its fences, merchants shelter.', refused: ['walls'], resolvedBy: 'twin' });
    const walled = drawDeclared(pool, { draw: stream([0.9]).draw, facts: WALLED, key: 'k' });
    expect(walled).toMatchObject({ text: 'Behind its walls, merchants shelter.', resolvedBy: 'drawn' });
    expect(s.calls).toHaveLength(1);
  });

  it('no twin: the hash argmax over the admitted members; nothing admitted: none', () => {
    const pool = [{ text: 'A walled line.', needs: ['walls'] }, 'Neutral one.', 'Neutral two.'];
    const out = drawDeclared(pool, { draw: (p) => p[0], facts: BARE, key: 'seed::P' });
    const want = hashKey('seed::P::1') > hashKey('seed::P::2') ? 'Neutral one.' : 'Neutral two.';
    expect(out).toMatchObject({ text: want, resolvedBy: 'argmax' });
    expect(drawDeclared([{ text: 'x', needs: ['walls'] }], { draw: (p) => p[0], facts: BARE }).resolvedBy).toBe('none');
  });

  it('fail-closed: a declared line drawn with no facts is refused', () => {
    const out = drawDeclared([{ text: 'x', needs: ['walls'] }, 'y'], { draw: (p) => p[0], facts: null });
    expect(out).toMatchObject({ text: 'y', resolvedBy: 'argmax', refused: ['walls'] });
  });

  it('kind A filters; kind T resolves a sibling cell; every draw is noted', () => {
    const { result, ledger } = withPresumptionLedger(() => [
      filterDeclared(['a', { text: 'b', needs: ['walls'] }], { facts: BARE, poolId: 'L', drawKind: 'A' }).map(lineText),
      resolveDeclared([{ text: 'its people stand on the walls', needs: ['walls'] }, { text: 'its people stand guard', excludes: ['walls'], twinOf: 'its people stand on the walls' }], { facts: BARE, poolId: 'T' }).text,
    ]);
    expect(result).toEqual([['a'], 'its people stand guard']);
    expect(ledger.map((e) => [e.pool, e.resolvedBy, e.atoms])).toEqual([['L', 'drawn', []], ['T', 'twin', ['no walls']]]);
  });
});

describe('§3.3 THE WALLS PROOF, re-run as a test over the shipped leaves', () => {
  const corpora = [DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_GENERAL,
    DOSSIER_STATE_PROSE_POWER, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_WAR_FAITH];
  const wallsPools = corpora.flatMap((c) => Object.entries(c).flatMap(([id, block]) => Object.entries(block.pools)
    .filter(([, pool]) => poolDimensions(pool).join() === 'walls').map(([key, pool]) => ({ id, key, pool }))));
  const SEEDS = Array.from({ length: 500 }, (_, i) => `wp-${i}`);

  it('the kernel pre-filter and draw-over-full-then-resolve agree; the gate moves only refused winners', () => {
    expect(wallsPools.length).toBeGreaterThanOrEqual(20);
    let draws = 0; let movedUnderWalls = 0; let movedOther = 0;
    for (const { id, key, pool } of wallsPools) {
      const twins = pool.filter((v) => (v.marks || []).includes('no walls'));
      const preF10 = pool.filter((v) => !twins.includes(v)).map((v) => ({ ...v, marks: (v.marks || []).filter((m) => m !== 'walls') }));
      const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
      const read = { slots, audience: 'dm' };
      const oldEligible = eligibleVariants(preF10, read);
      for (const seed of SEEDS) {
        for (const answer of ['walls', 'no walls']) {
          draws += 1;
          const gated = drawVariant(eligibleVariants(pool, { ...read, dimensions: { walls: answer } }), id, key, seed);
          const old = drawVariant(oldEligible, id, key, seed);
          if (answer === 'walls' && gated?.vid !== old?.vid) movedUnderWalls += 1;
          if (answer === 'no walls' && gated?.vid !== old?.vid) {
            const oldWasWalls = (pool.find((v) => v.vid === old?.vid)?.marks || []).includes('walls');
            const twinWon = twins.some((t) => t.vid === gated?.vid);
            if (!oldWasWalls && !twinWon) movedOther += 1;
          }
        }
      }
    }
    expect(draws).toBeGreaterThan(20000);
    // the design's table: `walls` moves 0; `no walls` moves only refused winners or twin additions
    expect({ movedUnderWalls, movedOther }).toEqual({ movedUnderWalls: 0, movedOther: 0 });
  });
});
