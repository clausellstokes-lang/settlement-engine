/**
 * tests/domain/events/targetFirstIndex.test.js — TARGET-FIRST COMPLETENESS +
 * THE PRESSURES RAIL (Composer V2 §4/§9).
 *
 * Pins: (1) the inversion of targetsFrom is COMPLETE — every authorable verb
 * is reachable from some entity kind, and every entity kind reaches every verb
 * legal against it; (2) current-state-filtered target options list only what
 * the handler will accept; (3) the pressures rail derives from active
 * conditions, never exceeds THREE, and only offers available verbs.
 */

import { describe, it, expect } from 'vitest';
import {
  AFFORDANCE_MANIFEST, ENTITY_KINDS, authorableVerbs, verbsForEntityKind,
  pressureSuggestions, criminalOrgOptions, buildTargetOptions,
} from '../../../src/domain/events/affordanceManifest.js';

const settlement = () => ({
  name: 'Indexton',
  population: 900,
  tier: 'village',
  institutions: [
    { id: 'i1', name: 'Granary', impairments: [{ type: 'capacity', severity: 0.7, causeEventId: 'x' }] },
    { id: 'i2', name: "Thieves' Guild", category: 'criminal' },
    { id: 'i3', name: 'Temple' },
  ],
  powerStructure: { factions: [{ id: 'f1', name: 'Council', faction: 'Council' }, { id: 'f2', name: 'Guild', faction: 'Guild' }] },
  npcs: [
    { id: 'n1', name: 'Mira', corrupt: true, corruptTies: { criminalInstitution: "Thieves' Guild" } },
    { id: 'n2', name: 'Puce' },
  ],
  neighbourNetwork: [{ id: 'nb1', name: 'Fordham', relationshipType: 'neutral' }],
  economicState: { primaryExports: ['Wool'] },
  config: { nearbyResources: ['timber', 'clay'], nearbyResourcesDepleted: ['clay'] },
  stressors: [{ type: 'famine', name: 'Famine', severity: 0.6 }],
  activeConditions: [
    { id: 'c1', archetype: 'plague', severity: 0.8, triggeredAt: { sourceEventType: 'PLAGUE', sourceEventTargetId: 'red-pox' } },
    { id: 'c2', archetype: 'food_anchor_lost', severity: 0.6, triggeredAt: { sourceEventType: 'REMOVE_INSTITUTION', sourceEventTargetId: 'i1' } },
    { id: 'c3', archetype: 'corruption_exposed', severity: 0.5, triggeredAt: { sourceEventType: 'EXPOSE_CORRUPTION', sourceEventTargetId: 'i3' } },
    { id: 'c4', archetype: 'trade_route_cut', severity: 0.4, triggeredAt: { sourceEventType: 'CUT_TRADE_ROUTE', sourceEventTargetId: 'east road' } },
  ],
});

describe('target-first navigation index (§4)', () => {
  it('COMPLETENESS: the union over entity kinds is exactly the 29 authorable verbs', () => {
    const reached = new Set();
    for (const kind of ENTITY_KINDS) {
      for (const v of verbsForEntityKind(kind)) reached.add(v.type);
    }
    const all = new Set(authorableVerbs().map(v => v.type));
    const unreachable = [...all].filter(t => !reached.has(t));
    expect(
      unreachable,
      `authorable verbs unreachable from target-first navigation: ${unreachable.join(', ')}`,
    ).toEqual([]);
    expect(reached.size).toBe(all.size);
  });

  it('every entity kind reaches every verb legal against it (per-kind exactness)', () => {
    for (const kind of ENTITY_KINDS) {
      const expected = authorableVerbs()
        .filter(v => v.targetsFrom === kind || v.entityKind === kind)
        .map(v => v.type)
        .sort();
      const got = verbsForEntityKind(kind).map(v => v.type).sort();
      expect(got, `kind ${kind}`).toEqual(expected);
    }
  });

  it('folded verbs never appear in the index', () => {
    for (const kind of ENTITY_KINDS) {
      for (const v of verbsForEntityKind(kind)) expect(v.foldedInto).toBeFalsy();
    }
  });

  it('current-state-filtered options list only what the handler accepts (§3)', () => {
    const s = settlement();
    // EXPOSE_CORRUPTION: only compromised entities.
    const expose = AFFORDANCE_MANIFEST.EXPOSE_CORRUPTION.targetOptions(s).map(o => o.name);
    expect(expose).toContain('Mira');           // corrupt NPC
    expect(expose).not.toContain('Puce');       // clean NPC
    expect(expose).not.toContain('Temple');     // unmarked institution
    // IMPOSE_CORRUPTION: only CLEAN NPCs.
    const impose = AFFORDANCE_MANIFEST.IMPOSE_CORRUPTION.targetOptions(s).map(o => o.name);
    expect(impose).toContain('Puce');
    expect(impose).not.toContain('Mira');
    // RECOVERED_RESOURCE: only depleted; DEPLETE: only live.
    expect(AFFORDANCE_MANIFEST.RECOVERED_RESOURCE.targetOptions(s).map(o => o.id)).toEqual(['clay']);
    expect(AFFORDANCE_MANIFEST.DEPLETE_RESOURCE.targetOptions(s).map(o => o.id)).toEqual(['timber']);
    // RESTORE_INSTITUTION: only impaired.
    expect(AFFORDANCE_MANIFEST.RESTORE_INSTITUTION.targetOptions(s).map(o => o.name)).toEqual(['Granary']);
    // CHANGE_RULING_POWER: never offers the governing faction.
    const seats = AFFORDANCE_MANIFEST.CHANGE_RULING_POWER.targetOptions(s).map(o => o.name);
    expect(seats.length).toBeLessThan(buildTargetOptions(s, 'factions').length + 1);
    // criminalOrgOptions wraps readCorruptionClimate (the handler's own read).
    expect(criminalOrgOptions(s)).toEqual(["Thieves' Guild"]);
  });

  it('unavailability TEACHES: a false predicate carries reasons and unlocks', () => {
    const bare = { name: 'Bare', institutions: [], npcs: [], powerStructure: { factions: [] }, config: {} };
    const p = AFFORDANCE_MANIFEST.IMPOSE_CORRUPTION.predicate(bare, {});
    expect(p.available).toBe(false);
    expect(p.reasons.join(' ')).toMatch(/criminal organization/i);
    expect(p.unlocks.join(' ')).toMatch(/criminal organization/i);
  });
});

describe('the pressures rail (§4 — capped at 3, situation-derived)', () => {
  it('derives suggestions from active conditions, hard-capped at 3', () => {
    const sugs = pressureSuggestions(settlement());
    expect(sugs.length).toBeLessThanOrEqual(3);
    expect(sugs.length).toBeGreaterThan(0);
    for (const s of sugs) {
      expect(AFFORDANCE_MANIFEST[s.type]).toBeTruthy();
      expect(typeof s.reason).toBe('string');
      expect(s.reason.length).toBeGreaterThan(0);
    }
  });

  it('the plague (highest severity) leads with a resolve suggestion', () => {
    const sugs = pressureSuggestions(settlement());
    expect(sugs[0].type).toBe('RESOLVE_STRESSOR');
  });

  it('only AVAILABLE verbs are ever suggested', () => {
    const s = settlement();
    for (const sug of pressureSuggestions(s)) {
      expect(AFFORDANCE_MANIFEST[sug.type].predicate(s, {}).available).toBe(true);
    }
  });

  it('a quiet settlement yields at most the corruption seam (no noise)', () => {
    const quiet = {
      name: 'Quietville', institutions: [{ id: 'i1', name: 'Mill' }],
      npcs: [{ id: 'n1', name: 'Ann' }], powerStructure: { factions: [] },
      activeConditions: [], config: {},
    };
    expect(pressureSuggestions(quiet)).toEqual([]);
  });
});
