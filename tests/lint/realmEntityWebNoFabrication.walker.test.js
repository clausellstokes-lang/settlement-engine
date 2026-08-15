/**
 * tests/lint/realmEntityWebNoFabrication.walker.test.js — THE NO-FABRICATION
 * INVARIANT (INSPECTOR-ADDRESS-WEB, owner 2026-07-22).
 *
 * The address-chain resolver must NEVER invent a faction or a power. Every
 * faction/power level it emits must name a REAL faction of that settlement (the
 * generated roster); when a level is not derivable it is DROPPED, not guessed.
 * This walker drives the resolver over a realm fixture that deliberately mixes
 * affiliated and UNAFFILIATED subjects and asserts the invariant directly.
 *
 * E-A: the sweep plant "address-web/fabricated faction level" (scripts/
 * mutation-sweep.sh) makes the resolver's degrade path emit a fabricated faction;
 * this walker must red on it. @manifest scripts/mutation-coverage-manifest.json
 */
import { describe, expect, test } from 'vitest';

import { buildRealmEntityWeb } from '../../src/domain/dossier/realmEntityWeb.js';

/** A realm whose second npc in each settlement is UNAFFILIATED, so the resolver's
 *  no-faction degrade path is exercised (the plant's target). */
function realm() {
  return [
    {
      id: 's1',
      name: 'Jirak',
      settlement: {
        id: 's1', name: 'Jirak',
        npcs: [
          { id: 'n_a', name: 'Abir', factionAffiliation: 'Twin Towers' },
          { id: 'n_b', name: 'Bael' }, // unaffiliated — MUST NOT gain a faction level
        ],
        powerStructure: { factions: [
          { faction: 'Religious Authorities', isGoverning: true },
          { faction: 'Twin Towers' },
        ] },
      },
    },
    {
      id: 's2',
      name: 'Vasca',
      settlement: {
        id: 's2', name: 'Vasca',
        npcs: [
          { id: 'n_c', name: 'Mira', factionAffiliation: 'Harbor Guild' },
          { id: 'n_d', name: 'Doran' }, // unaffiliated
        ],
        powerStructure: { factions: [{ faction: 'Harbor Guild', isGoverning: true }] },
      },
    },
  ];
}

/** The real faction display names, per settlement save id. */
function realFactionNames(saves) {
  /** @type {Map<string, Set<string>>} */
  const m = new Map();
  for (const s of saves) {
    const names = new Set((s.settlement.powerStructure.factions || []).map(f => f.faction));
    m.set(String(s.id), names);
  }
  return m;
}

describe('realmEntityWeb — no fabrication (E-A walker)', () => {
  test('every faction/power level names a REAL faction of its settlement', () => {
    const saves = realm();
    const web = buildRealmEntityWeb(saves);
    const realNames = realFactionNames(saves);

    /** @type {string[]} */
    const offenders = [];
    for (const s of saves) {
      for (const npc of s.settlement.npcs) {
        const chain = web.resolveNpc(`${s.id}:${npc.id}`) || [];
        for (const level of chain) {
          if (level.role !== 'faction' && level.role !== 'power') continue;
          const names = realNames.get(String(level.settlementSaveId));
          if (!names || !names.has(level.label)) {
            offenders.push(`${s.id}:${npc.id} -> ${level.role} "${level.label}" is not a real faction of settlement ${level.settlementSaveId}`);
          }
        }
      }
    }
    expect(offenders, 'the resolver fabricated a faction/power level not present in the settlement roster').toEqual([]);
  });

  test('an unaffiliated npc gets NO faction level (degrade, never invent)', () => {
    const web = buildRealmEntityWeb(realm());
    for (const id of ['s1:n_b', 's2:n_d']) {
      const chain = web.resolveNpc(id) || [];
      expect(chain.some(l => l.role === 'faction'), `${id} must not gain a faction level`).toBe(false);
    }
  });
});
