/**
 * tests/domain/hegemonyRead.test.js — THE UNNAMED EMPIRE read-model
 * (ambition-fit-2 / DESIGN_SIM_DEPTH_R2 D4(a), §F.3b). Pure display selector over
 * the `treaties` spatial ledger: derives spheres with ZERO persisted state,
 * codepoint-ordered, inert-not-crash. Golden-inert (generation never imports it).
 *
 * Mirrors the §F.3b / D4 pins: (1) no sphere below K ties; (2) a K-vassal center
 * forms a sphere; (3) descriptive-always / DM-christened label; (4) strain summary
 * bands the fraying; (5) the read is PURE (same input ⇒ identical output).
 */

import { describe, it, expect } from 'vitest';

import {
  hegemonyRead,
  hasHegemony,
  HEGEMONY_TUNING,
  SUBORDINATING_TERM_TYPES,
} from '../../src/domain/display/hegemonyRead.js';

/** A minimal treaty (peaceTerms treaty-ledger shape): victor holds a term over loser. */
function treaty(victorId, loserId, terms = [{ type: 'tribute', complianceState: 'honored' }]) {
  return { victorId, loserId, parties: [victorId, loserId], terms };
}
function worldWith(ledger) {
  return { tick: 20, spatialLedgers: { treaties: ledger } };
}
const NAMES = new Map([
  ['thorn', 'Thornwall'], ['a', 'Ashford'], ['b', 'Briarwatch'], ['c', 'Caldmoor'],
  ['d', 'Deepmoor'], ['free', 'Fenmark'],
]);
const nameFor = (id) => NAMES.get(id) || id;

describe('hegemonyRead — the derived sphere', () => {
  it('PIN 1: a center below K subordinate ties forms NO sphere (negative control)', () => {
    const led = {
      k1: treaty('thorn', 'a'),
      k2: treaty('thorn', 'b'),
    };
    const out = hegemonyRead({ worldState: worldWith(led), nameFor });
    expect(out.hasHegemony).toBe(false);
    expect(out.spheres).toEqual([]);
    expect(hasHegemony({ worldState: worldWith(led), nameFor })).toBe(false);
  });

  it('PIN 2: a K-vassal center forms a sphere and COUNTS its members', () => {
    const led = {
      k1: treaty('thorn', 'a'),
      k2: treaty('thorn', 'b', [{ type: 'compelled_alliance', complianceState: 'honored' }]),
      k3: treaty('thorn', 'c', [{ type: 'puppet_seat', complianceState: 'honored' }]),
    };
    const out = hegemonyRead({ worldState: worldWith(led), nameFor });
    expect(out.hasHegemony).toBe(true);
    expect(out.spheres).toHaveLength(1);
    const s = out.spheres[0];
    expect(s.centerId).toBe('thorn');
    expect(s.centerName).toBe('Thornwall');
    expect(s.memberCount).toBe(3);
    expect(s.members.map((m) => m.id)).toEqual(['a', 'b', 'c']); // codepoint-sorted
    expect(s.brief).toContain('Thornwall');
    expect(s.brief).toMatch(/3 settlements/);
  });

  it('PIN 3: label is DESCRIPTIVE by default, and adopts the DM canon label when christened', () => {
    const led = { k1: treaty('thorn', 'a'), k2: treaty('thorn', 'b'), k3: treaty('thorn', 'c') };
    const plain = hegemonyRead({ worldState: worldWith(led), nameFor });
    expect(plain.spheres[0].label).toBe('Thornwall and its tributaries');
    expect(plain.spheres[0].canonLabel).toBe(null);
    const christened = hegemonyRead({
      worldState: worldWith(led), nameFor,
      canonLabelFor: (id) => (id === 'thorn' ? 'The Thornwall Hegemony' : null),
    });
    expect(christened.spheres[0].label).toBe('The Thornwall Hegemony');
    expect(christened.spheres[0].canonLabel).toBe('The Thornwall Hegemony');
  });

  it('PIN 4: strain summary bands the fraying (honored ⇒ firm; some defaulted ⇒ fraying/crumbling)', () => {
    const firm = hegemonyRead({
      worldState: worldWith({ k1: treaty('thorn', 'a'), k2: treaty('thorn', 'b'), k3: treaty('thorn', 'c') }), nameFor,
    });
    expect(firm.spheres[0].strain.band).toBe('firm');
    expect(firm.spheres[0].strain.strainedCount).toBe(0);
    const fraying = hegemonyRead({
      worldState: worldWith({
        k1: treaty('thorn', 'a', [{ type: 'tribute', complianceState: 'defaulted' }]),
        k2: treaty('thorn', 'b', [{ type: 'tribute', complianceState: 'defaulted' }]),
        k3: treaty('thorn', 'c', [{ type: 'tribute', complianceState: 'honored' }]),
      }), nameFor,
    });
    expect(fraying.spheres[0].strain.strainedCount).toBe(2);
    expect(fraying.spheres[0].strain.band).toBe('crumbling'); // 2/3 ≥ 0.5
  });

  it('PIN 5: the read is PURE — same input ⇒ byte-identical output, zero writes', () => {
    const led = { k1: treaty('thorn', 'a'), k2: treaty('thorn', 'b'), k3: treaty('thorn', 'c') };
    const world = worldWith(led);
    const frozen = JSON.stringify(world);
    const a = hegemonyRead({ worldState: world, nameFor });
    const b = hegemonyRead({ worldState: world, nameFor });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(world)).toBe(frozen); // no mutation of the input
  });

  it('resource_share alone is NOT a subordinate tie (extraction, not subordination)', () => {
    const led = {
      k1: treaty('thorn', 'a', [{ type: 'resource_share', complianceState: 'honored' }]),
      k2: treaty('thorn', 'b', [{ type: 'resource_share', complianceState: 'honored' }]),
      k3: treaty('thorn', 'c', [{ type: 'resource_share', complianceState: 'honored' }]),
    };
    expect(hegemonyRead({ worldState: worldWith(led), nameFor }).hasHegemony).toBe(false);
    expect(SUBORDINATING_TERM_TYPES).not.toContain('resource_share');
  });

  it('strength share weights the sphere and bands it; strongest sphere sorts first', () => {
    const led = {
      // Thornwall: 3 tributaries.
      t1: treaty('thorn', 'a'), t2: treaty('thorn', 'b'), t3: treaty('thorn', 'c'),
      // Deepmoor: 3 tributaries (smaller).
      d1: treaty('d', 'a'), d2: treaty('d', 'b'), d3: treaty('d', 'c'),
    };
    const strengthOf = (id) => (id === 'thorn' ? 100 : id === 'd' ? 10 : 5);
    const out = hegemonyRead({ worldState: worldWith(led), nameFor, strengthOf });
    expect(out.spheres).toHaveLength(2);
    expect(out.spheres[0].centerId).toBe('thorn'); // stronger sorts first
    expect(out.spheres[0].strengthShare).toBeGreaterThan(out.spheres[1].strengthShare);
    expect(['dominant', 'major', 'regional', 'minor']).toContain(out.spheres[0].strengthBand);
  });

  it('INERT-NOT-CRASH on absent / garbage ledgers', () => {
    expect(hegemonyRead({ worldState: null }).spheres).toEqual([]);
    expect(hegemonyRead({ worldState: {} }).spheres).toEqual([]);
    expect(hegemonyRead({ worldState: { spatialLedgers: { treaties: 42 } } }).spheres).toEqual([]);
    expect(hegemonyRead({ worldState: { spatialLedgers: { treaties: { bad: null } } } }).spheres).toEqual([]);
    expect(hegemonyRead()).toEqual({ spheres: [], hasHegemony: false });
  });

  it('MIN_TIES tuning is exported for the DEPTH reason half to share', () => {
    expect(HEGEMONY_TUNING.MIN_TIES).toBe(3);
  });
});
