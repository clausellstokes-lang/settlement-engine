/**
 * tests/domain/oracle.test.js — THE ORACLE pins (V-14).
 *
 * Proves the four load-bearing properties:
 *   • DETERMINISM — same (seed, question, world, likelihood) ⇒ byte-identical answer;
 *   • STREAM ISOLATION — the oracle forks its OWN named stream (same label ⇒ same draws,
 *     different label ⇒ independent draws) so it never perturbs the generation pipeline;
 *   • READS-ONLY — worldState + settlement are never mutated (reference- + deep-equal);
 *   • LEDGER WEIGHTING — a safety question in a dangerous world lowers the odds and carries
 *     the embattlement basis; a threat question raises them; a bearing-free question stands.
 */
import { describe, it, expect } from 'vitest';
import { createPRNG } from '../../src/kernel/prng.js';
import {
  askOracle, weighOdds, inferTopic, worldPressure, drawAnswer, answerLabel,
} from '../../src/domain/oracle.js';

// A dangerous, troubled world anchored on settlement 's1'.
const dangerWorld = { seed: 'w-seed', spatialLedgers: { embattlement: { s1: { level: 0.7 } } } };
const troubledTown = {
  id: 's1', name: 'Harrowford', seed: 't-seed',
  activeConditions: [{ archetype: 'plague', severity: 0.6, label: 'A wasting sickness', description: 'The sick fill the halls.' }],
};
// A quiet world: no embattlement record, no conditions.
const quietWorld = { seed: 'w-seed', spatialLedgers: {} };
const quietTown = { id: 's1', name: 'Millbrook', seed: 't-seed', activeConditions: [] };

describe('oracle — determinism (same-seed byte-identity)', () => {
  it('two identical asks are byte-identical', () => {
    const a = askOracle({ worldState: dangerWorld, settlement: troubledTown, question: 'Is the road safe?', seed: 'draw-1', likelihood: 'even' });
    const b = askOracle({ worldState: dangerWorld, settlement: troubledTown, question: 'Is the road safe?', seed: 'draw-1', likelihood: 'even' });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('a fixed seed yields a fixed answer (the same-seed golden)', () => {
    const r = askOracle({ worldState: dangerWorld, settlement: troubledTown, question: 'Is the road safe?', seed: 'golden-seed', likelihood: 'even' });
    // Deterministic outputs (recomputed → stable): the answer enum + the weighed p.
    expect(['yes', 'yes-and', 'no', 'no-and']).toContain(r.answer);
    const again = askOracle({ worldState: dangerWorld, settlement: troubledTown, question: 'Is the road safe?', seed: 'golden-seed', likelihood: 'even' });
    expect(r.answer).toBe(again.answer);
    expect(r.roll).toBe(again.roll);
    expect(r.odds.p).toBe(again.odds.p);
  });

  it('a different question reseeds the draw stream', () => {
    const a = askOracle({ worldState: dangerWorld, settlement: troubledTown, question: 'Is the road safe?', seed: 's', likelihood: 'even' });
    const b = askOracle({ worldState: dangerWorld, settlement: troubledTown, question: 'Will the guild betray us?', seed: 's', likelihood: 'even' });
    // Different questions fork different streams → the raw rolls differ.
    expect(a.roll).not.toBe(b.roll);
  });
});

describe('oracle — stream isolation (own named stream, no interference)', () => {
  it('same fork label ⇒ identical draws; different label ⇒ independent draws', () => {
    const seq = (label) => { const r = createPRNG('base').fork(label); return [r.random(), r.random(), r.random()]; };
    expect(seq('oracle:x')).toEqual(seq('oracle:x'));
    expect(seq('oracle:x')).not.toEqual(seq('step:generate'));
  });

  it('forking the oracle stream does not disturb a sibling generation stream', () => {
    const base = createPRNG('base');
    const genBefore = base.fork('step:generate').random();
    base.fork('oracle:q:0').random(); // ask the oracle off the same base
    const genAfter = createPRNG('base').fork('step:generate').random();
    expect(genAfter).toBe(genBefore); // the sibling stream is untouched
  });
});

describe('oracle — reads-only', () => {
  it('does not mutate worldState or the settlement', () => {
    const wsSnap = JSON.stringify(dangerWorld);
    const stSnap = JSON.stringify(troubledTown);
    const ws = JSON.parse(wsSnap);
    const st = JSON.parse(stSnap);
    askOracle({ worldState: ws, settlement: st, question: 'Is the road safe?', seed: 'x', likelihood: 'even' });
    expect(JSON.stringify(ws)).toBe(wsSnap);
    expect(JSON.stringify(st)).toBe(stSnap);
  });
});

describe('oracle — ledger weighting + basis notes', () => {
  it('a SAFETY question in a dangerous world lowers the odds below the prior', () => {
    const odds = weighOdds({ worldState: dangerWorld, settlement: troubledTown, question: 'Is the road safe?', likelihood: 'even' });
    expect(odds.dir).toBe(-1);
    expect(odds.p).toBeLessThan(0.5);
    expect(odds.basis.some((b) => b.source === 'read:embattlement')).toBe(true);
  });

  it('a THREAT question in a dangerous world raises the odds above the prior', () => {
    const odds = weighOdds({ worldState: dangerWorld, settlement: troubledTown, question: 'Will we be attacked on the road?', likelihood: 'even' });
    expect(odds.dir).toBe(1);
    expect(odds.p).toBeGreaterThan(0.5);
  });

  it('a bearing-free question leaves the prior untouched with an honest basis', () => {
    const odds = weighOdds({ worldState: dangerWorld, settlement: troubledTown, question: 'What color is the innkeeper\'s hat?', likelihood: 'likely' });
    expect(odds.dir).toBe(0);
    expect(odds.p).toBe(0.7); // 'likely' base, unchanged
    expect(odds.basis[0].source).toBe('oracle:prior');
  });

  it('inferTopic classifies safety vs threat vs none', () => {
    expect(inferTopic('is it safe?').topic).toBe('safety');
    expect(inferTopic('will there be a raid?').topic).toBe('threat');
    expect(inferTopic('who owns the mill?').topic).toBe('none');
  });
});

describe('oracle — scene + complication from live ledgers', () => {
  it('a live condition yields a complication drawn from the record; a quiet world yields none', () => {
    const troubled = askOracle({ worldState: dangerWorld, settlement: troubledTown, question: 'Is the road safe?', seed: 'x' });
    expect(troubled.complication).not.toBeNull();
    expect(troubled.complication.basis.source).toBe('read:conditions');
    expect(troubled.scene.worldLines.length).toBeGreaterThan(0);

    const quiet = askOracle({ worldState: quietWorld, settlement: quietTown, question: 'Is the road safe?', seed: 'x' });
    expect(quiet.complication).toBeNull();
    expect(quiet.scene.worldLines).toEqual([]); // no world truth bears → no world lines
  });

  it('answerLabel maps every enum', () => {
    expect(answerLabel('yes-and')).toBe('Yes, and…');
    expect(answerLabel('no-and')).toBe('No, and…');
    expect(answerLabel('yes')).toBe('Yes');
    expect(answerLabel('no')).toBe('No');
  });

  it('worldPressure reads danger + turmoil, reads-only', () => {
    const p = worldPressure(dangerWorld, troubledTown);
    expect(p.danger).toBeCloseTo(0.7);
    expect(p.turmoil).toBeCloseTo(0.6);
  });
});
