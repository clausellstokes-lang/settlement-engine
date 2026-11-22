/**
 * tests/domain/dossier/realmEntityWeb.test.js — the realm-scoped entity resolver.
 *
 * Proves the address-chain join is by TYPED ID + canonical helpers (never prose):
 *   - an npc pulse id resolves to settlement › power › faction › npc, each level
 *     carrying the dossier-index id the cross-settlement navigator focuses;
 *   - cross-settlement resolution (an id in settlement B resolves to B);
 *   - graceful DEGRADATION (unaffiliated npc drops the faction level; an unknown
 *     id / opaque record resolves to null — nothing is fabricated);
 *   - the PARITY PIN: the locally-replicated pulse-id formulas match the sim's
 *     canonical ids, so the join can never silently drift.
 */
import { describe, expect, test } from 'vitest';

import {
  buildRealmEntityWeb,
  realmNpcPulseId,
  realmFactionPulseId,
} from '../../../src/domain/dossier/realmEntityWeb.js';
import { npcId as canonicalNpcId } from '../../../src/domain/worldPulse/npcAgency.js';

/** Two-settlement realm fixture. Abir is in Jirak's "Twin Towers"; Jirak is ruled
 *  by "Religious Authorities". Bael is unaffiliated in a second settlement. */
function realmFixture() {
  return [
    {
      id: 'jirak',
      name: 'Jirak',
      settlement: {
        id: 'jirak',
        name: 'Jirak',
        npcs: [
          { id: 'npc_abir', name: 'Abir ibn Jubayr', factionAffiliation: 'Twin Towers' },
          { id: 'npc_solo', name: 'Solomne the Unbound' },
        ],
        powerStructure: {
          factions: [
            { faction: 'Religious Authorities', isGoverning: true, power: 70 },
            { faction: 'Twin Towers', power: 40 },
          ],
        },
      },
    },
    {
      id: 'vasca',
      name: 'Vasca',
      settlement: {
        id: 'vasca',
        name: 'Vasca',
        npcs: [{ id: 'npc_mira', name: 'Mira Coldwater', factionAffiliation: 'Harbor Guild' }],
        powerStructure: { factions: [{ faction: 'Harbor Guild', isGoverning: true, power: 55 }] },
      },
    },
  ];
}

describe('realmEntityWeb — the address-chain resolver', () => {
  test('an npc resolves to the full settlement › power › faction › npc chain', () => {
    const web = buildRealmEntityWeb(realmFixture());
    const chain = web.resolveNpc('jirak:npc_abir');
    expect(chain).toBeTruthy();
    expect(chain.map(l => l.role)).toEqual(['settlement', 'power', 'faction', 'npc']);
    const byRole = Object.fromEntries(chain.map(l => [l.role, l]));
    expect(byRole.settlement).toMatchObject({ label: 'Jirak', settlementSaveId: 'jirak', linked: true });
    expect(byRole.power).toMatchObject({ label: 'Religious Authorities', linked: true });
    expect(byRole.faction).toMatchObject({ label: 'Twin Towers', linked: true });
    expect(byRole.npc).toMatchObject({ label: 'Abir ibn Jubayr', entityId: 'npc_abir', linked: true });
    // Every level carries the settlement it lives in, so nav opens the right dossier.
    for (const level of chain) expect(String(level.settlementSaveId)).toBe('jirak');
  });

  test('an unaffiliated npc DROPS the faction level (degrade, never fabricate)', () => {
    const web = buildRealmEntityWeb(realmFixture());
    const chain = web.resolveNpc('jirak:npc_solo');
    expect(chain.map(l => l.role)).toEqual(['settlement', 'power', 'npc']);
    // no invented faction anywhere
    expect(chain.some(l => l.role === 'faction')).toBe(false);
  });

  test('cross-settlement: an id in the second settlement resolves to that settlement', () => {
    const web = buildRealmEntityWeb(realmFixture());
    const chain = web.resolveNpc('vasca:npc_mira');
    expect(chain).toBeTruthy();
    const settlement = chain.find(l => l.role === 'settlement');
    expect(settlement).toMatchObject({ label: 'Vasca', settlementSaveId: 'vasca' });
    // Mira governs the Harbor Guild, so power == faction collapses to one level.
    expect(chain.map(l => l.role)).toEqual(['settlement', 'faction', 'npc']);
    expect(chain.find(l => l.role === 'faction')).toMatchObject({ label: 'Harbor Guild' });
  });

  test('an unknown id resolves to null (no fabrication)', () => {
    const web = buildRealmEntityWeb(realmFixture());
    expect(web.resolveNpc('jirak:ghost')).toBeNull();
    expect(web.resolveNpc('nowhere:npc_abir')).toBeNull();
    expect(web.resolveNpc('malformed-no-colon')).toBeNull();
  });

  test('a faction name scoped to a settlement resolves to settlement › power › faction', () => {
    const web = buildRealmEntityWeb(realmFixture());
    const chain = web.resolveFaction({ settlementSaveId: 'jirak', factionName: 'Twin Towers' });
    expect(chain.map(l => l.role)).toEqual(['settlement', 'power', 'faction']);
    expect(chain.find(l => l.role === 'faction')).toMatchObject({ label: 'Twin Towers', linked: true });
  });

  test('a bare settlement id resolves to a single settlement level', () => {
    const web = buildRealmEntityWeb(realmFixture());
    const chain = web.resolveSettlement('vasca');
    expect(chain).toEqual([{ role: 'settlement', label: 'Vasca', settlementSaveId: 'vasca', entityId: expect.anything(), linked: true }]);
  });

  test('resolveSubject picks the deepest derivable chain from a mixed descriptor', () => {
    const web = buildRealmEntityWeb(realmFixture());
    // npc wins over settlement
    expect(web.resolveSubject({ npcId: 'jirak:npc_abir', settlementId: 'jirak' }).at(-1).role).toBe('npc');
    // settlement-only descriptor -> settlement level
    expect(web.resolveSubject({ settlementId: 'vasca' })).toHaveLength(1);
    // nothing addressable -> null (prose-only / subjectless)
    expect(web.resolveSubject({})).toBeNull();
    expect(web.resolveSubject({ npcId: 'jirak:ghost' })).toBeNull();
  });
});

describe('realmEntityWeb — PARITY PIN (the join can never drift)', () => {
  test('realmNpcPulseId matches the sim canonical npcId, byte-for-byte', () => {
    const cases = [
      ['jirak', { id: 'npc_abir', name: 'Abir ibn Jubayr' }, 0],
      ['vasca', { name: 'Mira Coldwater' }, 3], // no id -> slug of the name
      ['s7', { label: 'Nameless' }, 9],
      ['s7', {}, 2], // falls to `npc_<index>`
    ];
    for (const [saveId, npc, i] of cases) {
      expect(realmNpcPulseId(saveId, npc, i)).toBe(canonicalNpcId(saveId, npc, i));
    }
  });

  test('realmFactionPulseId matches the documented sim factionId formula', () => {
    // worldPulse/factionCompetition.js factionId (module-private): `${saveId}:${stablePart(faction.id||faction.faction||faction.name||faction.label||`faction_${index}`)}`
    expect(realmFactionPulseId('jirak', { faction: 'Twin Towers' }, 0)).toBe('jirak:twin_towers');
    expect(realmFactionPulseId('jirak', { id: 'fac.custom' }, 1)).toBe('jirak:fac_custom');
    expect(realmFactionPulseId('jirak', {}, 4)).toBe('jirak:faction_4');
  });
});
