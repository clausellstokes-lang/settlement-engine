/**
 * assizeDormancyGolden.test.js — V-22 THE ASSIZE DORMANCY + DIRECTION (Vision lane V-K).
 * The virtual flag `assizeEnabled` is ABSENT from DEFAULT_SIMULATION_RULES, so a world with a
 * fresh (age-one) corruption exposure at a settlement with a court behaves EXACTLY as pre-wire:
 * no verdict, no legitimacy/stressor delta, no obligation, no news.
 *
 * Blocks: (a) DORMANCY CONTRACT; (b) BYTE-IDENTICAL determinism; (c) LIT ANTI-VACUITY;
 * (d) JUST-vs-SHAM DIRECTION pins (just ⇒ relief + legitimacy lift; sham ⇒ unrest + legitimacy
 * tax); (e) NO-DEATH roster permutation (the condemned remain citizens; order-invariant);
 * (f) THE COMMONS COUPLING (a live petition amplifies the verdict's masses reaction);
 * (g) THE COMPOSED LOOP (a just verdict's legitimacy/unrest relief de-escalates the commons).
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { advanceAssize } from '../../src/domain/worldPulse/assizeKernel.js';
import { advanceCommonsVoice } from '../../src/domain/worldPulse/commonsVoiceKernel.js';

const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const TICK = 100;

/**
 * @param {object} [opts]
 * @param {boolean} [opts.sham]  put the accused inside the governing faction (a captured bench)
 * @param {number} [opts.legit]  the seat's legitimacy
 * @param {number} [opts.unrest]  a rebellion stressor severity (0 ⇒ none)
 * @param {Record<string, unknown>} [opts.commons]  a live commonsVoice ledger
 */
function build({ sham = false, legit = 50, unrest = 0.5, commons = undefined } = {}) {
  const accused = { id: 'x', name: 'Graftly', corrupt: true, timesExposed: 1, ...(sham ? { faction: 'The Council' } : {}) };
  const stressors = unrest > 0 ? [{ id: 'st1', type: 'rebellion', severity: unrest }] : [];
  const s1 = {
    id: 's1', name: 'Assizeton',
    settlement: {
      name: 'Assizeton', npcs: [accused], institutions: [{ name: 'Courthouse' }],
      powerStructure: { publicLegitimacy: { score: legit }, factions: [{ name: 'The Council', isGoverning: true }] },
      stressors,
    },
  };
  const p = { id: 'p', name: 'Patronia', settlement: { name: 'Patronia', npcs: [], institutions: [], powerStructure: { publicLegitimacy: { score: 60 }, factions: [] }, stressors: [] } };
  const settlements = [s1, p];
  const worldState = {
    tick: TICK, calendar: { elapsedWeeks: TICK, year: 2 },
    spatialLedgers: {
      exposedCorruption: { 's1>p': { magnitude01: 0.5, tick: TICK - 1 } },   // AGE ONE ⇒ judged this tick
      ...(commons ? { commonsVoice: commons } : {}),
    },
  };
  return { snapshot: { settlements }, worldState, settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })) };
}
function run(rules, opts) {
  const fx = build(opts);
  fx.worldState.simulationRules = rules;
  return advanceAssize({ ...fx, tick: TICK, now: null });
}
const DARK = {};                          // assizeEnabled ABSENT
const LIT = { assizeEnabled: true };
const legitOf = (r) => r.settlementUpdates.find((u) => u.saveId === 's1')?.settlement?.powerStructure?.publicLegitimacy?.score;
const unrestOf = (r) => r.settlementUpdates.find((u) => u.saveId === 's1')?.settlement?.stressors?.find((s) => s.id === 'st1')?.severity;

describe('V-22 assizeDormancy + direction', () => {
  it('(a) CONTRACT: dark ⇒ no verdict, no legitimacy/stressor delta, no obligation, no news', () => {
    const r = run(DARK, {});
    expect(r.changed).toBe(false);
    expect(r.newsEntries).toEqual([]);
    expect(legitOf(r)).toBe(50);
    expect(unrestOf(r)).toBe(0.5);
    expect(r.worldState.spatialLedgers?.obligations).toBeUndefined();
    expect(r.worldState.factionPairStates).toBeUndefined();
  });

  it('(b) BYTE-IDENTICAL: two dark runs hash-equal', () => {
    expect(sha(run(DARK, {}).worldState)).toBe(sha(run(DARK, {}).worldState));
  });

  it('(c) ANTI-VACUITY: LIT ⇒ a seated verdict beat appears (dark is not vacuous)', () => {
    const r = run(LIT, {});
    expect(r.changed).toBe(true);
    const beat = r.newsEntries.find((e) => e.impactKind === 'assize_verdict');
    expect(beat, 'an assize_verdict beat is emitted').toBeTruthy();
    expect(sha(r.worldState)).not.toBe(sha(run(DARK, {}).worldState));
  });

  it('(d) DIRECTION: a JUST verdict of a hated figure LIFTS legitimacy + RELIEVES unrest + fines the patron', () => {
    const r = run(LIT, { sham: false, legit: 50, unrest: 0.5 });
    expect(legitOf(r)).toBeGreaterThan(50);          // lift
    expect(unrestOf(r)).toBeLessThan(0.5);           // relief
    const beat = r.newsEntries.find((e) => e.impactKind === 'assize_verdict');
    expect(beat.tags).toContain('assize_just');
    // the fine: a reparation obligation from the patron to the exposed settlement (foldObligations)
    const obl = r.worldState.spatialLedgers?.obligations || {};
    expect(Object.values(obl).some((o) => o.from === 'p' && o.to === 's1' && o.kind === 'assize_reparation')).toBe(true);
  });

  it('(d2) DIRECTION: a SHAM (captured bench judging its own) TAXES legitimacy + RAISES unrest + fines no one', () => {
    const r = run(LIT, { sham: true, legit: 50, unrest: 0.5 });
    expect(legitOf(r)).toBeLessThan(50);             // tax
    expect(unrestOf(r)).toBeGreaterThan(0.5);        // unrest
    const beat = r.newsEntries.find((e) => e.impactKind === 'assize_verdict');
    expect(beat.tags).toContain('assize_sham');
    expect(r.worldState.spatialLedgers?.obligations).toBeUndefined();   // a sham fines no one
  });

  it('(e) NO-DEATH: the condemned remains on the roster; the verdict is order-invariant', () => {
    const r = run(LIT, { sham: false });
    const roster = r.settlementUpdates.find((u) => u.saveId === 's1')?.settlement?.npcs || [];
    expect(roster.some((n) => n.id === 'x'), 'the accused is still a citizen (no death)').toBe(true);
    // permute the (two-settlement) input order ⇒ the s1 verdict is identical (codepoint-ordered).
    const fx = build({ sham: false });
    fx.worldState.simulationRules = LIT;
    fx.snapshot.settlements = [...fx.snapshot.settlements].reverse();
    fx.settlementUpdates = [...fx.settlementUpdates].reverse();
    const permuted = advanceAssize({ ...fx, tick: TICK, now: null });
    expect(legitOf(permuted)).toBe(legitOf(r));
  });

  it('(f) COMMONS COUPLING: a live petition naming the accused AMPLIFIES the just verdict', () => {
    const petition = { s1: { rung: 2, since: 90, grievance: 0.7, kind: 'corruption', accusedNid: 'x' } };
    const coupled = run(LIT, { sham: false, legit: 50, unrest: 0.5, commons: petition });
    const uncoupled = run(LIT, { sham: false, legit: 50, unrest: 0.5 });
    // the crowd got the justice it demanded ⇒ a LARGER legitimacy lift + a LARGER relief
    expect(legitOf(coupled)).toBeGreaterThan(legitOf(uncoupled));
    expect(unrestOf(coupled)).toBeLessThan(unrestOf(uncoupled));
    const beat = coupled.newsEntries.find((e) => e.impactKind === 'assize_verdict');
    expect(beat.summary).toMatch(/commons/);          // the beat names the answered petition
  });

  it('(g) COMPOSED LOOP: a just verdict de-escalates the commons NEXT tick (petition→judgment→reaction)', () => {
    const petition = { s1: { rung: 2, since: 90, grievance: 0.7, kind: 'corruption', accusedNid: 'x' } };
    // 1) the assize answers the petition (just) — legitimacy up, unrest relieved.
    const verdict = run(LIT, { sham: false, legit: 30, unrest: 0.6, commons: petition });
    const newLegit = legitOf(verdict);
    expect(newLegit).toBeGreaterThan(30);
    // 2) NEXT tick, the commons re-reads the recovered legitimacy + eased grievance and steps DOWN.
    const s1 = { id: 's1', name: 'Assizeton', settlement: { name: 'Assizeton', npcs: [], institutions: [], powerStructure: { publicLegitimacy: { score: newLegit + 25 }, factions: [{ name: 'The Council', isGoverning: true }] }, stressors: [] } };
    const ws = { tick: TICK + 1, calendar: { elapsedWeeks: TICK + 1, year: 2 }, simulationRules: { commonsVoiceEnabled: true }, spatialLedgers: { commonsVoice: petition } };
    const next = advanceCommonsVoice({ snapshot: { settlements: [s1] }, worldState: ws, settlementUpdates: [{ saveId: 's1', settlement: s1.settlement }], tick: TICK + 1, now: null });
    const led = next.worldState.spatialLedgers?.commonsVoice || {};
    const rung = led.s1 ? led.s1.rung : 0;
    expect(rung, 'the answered grievance de-escalates the commons').toBeLessThan(2);
  });
});
