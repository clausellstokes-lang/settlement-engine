/**
 * commonsVoiceDormancyGolden.test.js — V-23 THE COMMONS' VOICE DORMANCY (Vision lane V-K).
 * The virtual flag `commonsVoiceEnabled` is ABSENT from DEFAULT_SIMULATION_RULES, so a world
 * with high grievance (low legitimacy + an exposed corrupt figure) behaves EXACTLY as pre-wire:
 * no `commonsVoice` ledger key, no legitimacy delta, no news.
 *
 * Blocks (the traditions/ransom dormancy idiom): (a) DORMANCY CONTRACT — no key, no delta, no
 * news; (b) BYTE-IDENTICAL determinism — two dark runs hash-equal; (c) LIT ANTI-VACUITY — the
 * SAME fixture LIT mints a petition (so the dark proof is not vacuous); (d) ESCALATION +
 * DE-ESCALATION direction pins; (e) BOUNDED + no-rng determinism.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { advanceCommonsVoice } from '../../src/domain/worldPulse/commonsVoiceKernel.js';

const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

/**
 * @param {object} opts
 * @param {number} opts.legit  publicLegitimacy.score
 * @param {boolean} [opts.corrupt]  seat carries an exposed corrupt figure
 * @param {number} [opts.tick]
 * @param {Record<string, unknown>} [opts.priorLedger]  a prior commonsVoice ledger
 */
function build({ legit, corrupt = false, tick = 100, priorLedger = undefined }) {
  const npcs = corrupt ? [{ id: 'boss', name: 'The Boss', corrupt: true, timesExposed: 1 }] : [];
  const settlement = {
    name: 'Grumbleton', npcs, institutions: [],
    powerStructure: { publicLegitimacy: { score: legit }, factions: [{ name: 'The Ring', isGoverning: true }] },
    stressors: [],
  };
  const settlements = [{ id: 's1', name: 'Grumbleton', settlement }];
  const worldState = {
    tick, calendar: { elapsedWeeks: tick, year: 2 },
    spatialLedgers: priorLedger ? { commonsVoice: priorLedger } : {},
  };
  return { snapshot: { settlements }, worldState, settlementUpdates: settlements.map((it) => ({ saveId: it.id, settlement: it.settlement })) };
}
function run(rules, opts) {
  const fx = build(opts);
  fx.worldState.simulationRules = rules;
  return advanceCommonsVoice({ ...fx, tick: fx.worldState.tick, now: null });
}
const DARK = {};                                  // commonsVoiceEnabled ABSENT
const LIT = { commonsVoiceEnabled: true };
const legitOf = (r) => r.settlementUpdates[0]?.settlement?.powerStructure?.publicLegitimacy?.score;

describe('V-23 commonsVoiceDormancy', () => {
  it('(a) CONTRACT: dark ⇒ no commonsVoice key, no legitimacy delta, no news, changed:false', () => {
    const r = run(DARK, { legit: 12, corrupt: true });
    expect(r.changed).toBe(false);
    expect(r.worldState.spatialLedgers?.commonsVoice).toBeUndefined();
    expect(legitOf(r)).toBe(12);        // untouched
    expect(r.newsEntries).toEqual([]);
  });

  it('(b) BYTE-IDENTICAL: two dark runs hash-equal (deterministic dormancy)', () => {
    expect(sha(run(DARK, { legit: 12, corrupt: true }).worldState.spatialLedgers))
      .toBe(sha(run(DARK, { legit: 12, corrupt: true }).worldState.spatialLedgers));
  });

  it('(c) ANTI-VACUITY: the SAME fixture LIT mints a petition (dark is not vacuous)', () => {
    const r = run(LIT, { legit: 12, corrupt: true });
    const led = r.worldState.spatialLedgers?.commonsVoice || {};
    expect(led.s1, 'a commons entry appears').toBeTruthy();
    expect(led.s1.rung).toBeGreaterThanOrEqual(1);
    expect(r.newsEntries.length, 'an escalation beat is emitted').toBeGreaterThanOrEqual(1);
    expect(r.newsEntries[0].impactKind).toMatch(/^commons_/);
    // the lit run DIFFERS from the dark run (the layer is observable)
    expect(sha(r.worldState.spatialLedgers)).not.toBe(sha(run(DARK, { legit: 12, corrupt: true }).worldState.spatialLedgers));
    // and legitimacy took the escalation dip (routed through the applicator)
    expect(legitOf(r)).toBeLessThan(12);
  });

  it('(d) DIRECTION: a high grievance ESCALATES; a low grievance never mints; relief DE-ESCALATES', () => {
    // low grievance (healthy legitimacy, no corruption) ⇒ no entry
    const calm = run(LIT, { legit: 90, corrupt: false });
    expect(calm.worldState.spatialLedgers?.commonsVoice).toBeUndefined();
    expect(calm.changed).toBe(false);
    // a prior riot whose grievance has been ANSWERED (legitimacy restored) steps DOWN
    const prior = { s1: { rung: 3, since: 90, grievance: 0.9, kind: 'misrule' } };
    const relieved = run(LIT, { legit: 95, corrupt: false, priorLedger: prior });
    const led = relieved.worldState.spatialLedgers?.commonsVoice || {};
    // rung dropped (either to a lower rung or dissolved away entirely)
    const nextRung = led.s1 ? led.s1.rung : 0;
    expect(nextRung).toBeLessThan(3);
  });

  it('(e) DETERMINISM: same input ⇒ byte-identical lit output (no rng, no Date)', () => {
    expect(sha(run(LIT, { legit: 12, corrupt: true }).worldState.spatialLedgers))
      .toBe(sha(run(LIT, { legit: 12, corrupt: true }).worldState.spatialLedgers));
  });
});
