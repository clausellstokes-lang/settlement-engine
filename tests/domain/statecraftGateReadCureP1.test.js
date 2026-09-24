/**
 * statecraftGateReadCureP1.test.js — CURE LANE FP-P1, unit U6 (FPQ-25; measured by IN-2's
 * seat, recorded in IN-2's cure dc4001a22): THE STATECRAFT GATE'S HIDDEN READ.
 *
 * informationStatecraft.js :: infoStatecraftActive read its flag in TWO statements (the rules
 * object on one line, `.infoStatecraftEnabled === true` on the next), and the observed-shape
 * corpus (scripts/lib/observed-shape-corpus.mjs :: discoverSimulationFlags) finds the flags it
 * lights by scanning for `simulationRules…<key>` on ONE line, so the gate's own read was a true
 * reader hidden from the writer-reach instrument. The gate now reads
 * `asObject(asObject(worldState).simulationRules).infoStatecraftEnabled === true` in one
 * statement, the idiom of IN-2's cure; the behaviour is identical (the differential arm).
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { discoverSimulationFlags } from '../../scripts/lib/observed-shape-corpus.mjs';
import { infoStatecraftActive } from '../../src/domain/worldPulse/informationStatecraft.js';
import { beliefsActive } from '../../src/domain/worldPulse/beliefMap.js';

const SOURCE = readFileSync(new URL('../../src/domain/worldPulse/informationStatecraft.js', import.meta.url), 'utf8');
const OPEN = SOURCE.indexOf('export function infoStatecraftActive(');
/** The gate's own text, its declaration to the brace that closes it at column zero. */
const GATE = SOURCE.slice(OPEN, SOURCE.indexOf('\n}\n', OPEN) + 3);

/** The two-statement gate as it stood at 6af4176e4, kept here as the differential's oracle. */
function legacyGate(worldState) {
  if (!beliefsActive(worldState)) return false;
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object' && rules.infoStatecraftEnabled === true);
}

describe('CURE-P1 U6 — the statecraft gate reads its flag where the scan can see it (FPQ-25)', () => {
  it('the flag discovery sees the gate\'s own read, from the gate\'s text alone', () => {
    expect(GATE.startsWith('export function infoStatecraftActive('), 'the gate was found in its file').toBe(true);
    expect(GATE, 'and it still reads its one flag by name, strictly').toContain('infoStatecraftEnabled === true');
    expect(discoverSimulationFlags(() => GATE, ['informationStatecraft.js#infoStatecraftActive']))
      .toContain('infoStatecraftEnabled');
  });

  it('the one-statement gate answers exactly as the two-statement gate did, case for case', () => {
    const flagValues = [true, false, undefined, 'true', 1, null];
    const shapes = [];
    for (const flag of flagValues) {
      for (const infoMode of ['full', 'perfect_delayed', 'omniscient', undefined]) {
        const rules = { ...(infoMode === undefined ? {} : { infoMode }), ...(flag === undefined ? {} : { infoStatecraftEnabled: flag }) };
        shapes.push({ spatialCanonVersion: 1, simulationRules: rules });
        shapes.push({ spatialCanonVersion: 0, simulationRules: rules });
      }
    }
    shapes.push(null, undefined, {}, { spatialCanonVersion: 1 }, { spatialCanonVersion: 1, simulationRules: null });
    const answers = shapes.map((ws) => [infoStatecraftActive(ws), legacyGate(ws)]);
    expect(answers.filter(([now]) => now === true).length, 'the lit answer is reachable (not a vacuous identity)').toBeGreaterThan(0);
    expect(answers.map(([now]) => now)).toEqual(answers.map(([, was]) => was));
  });
});
