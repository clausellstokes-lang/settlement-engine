/**
 * The transitional FactionRef contract: linkedFactionIds stores an authored id
 * when one exists, otherwise the generated seat's canonical display handle.
 * Readers accept those historical forms without fuzzy or ambiguous joins.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  entityLinksFaction,
  factionMatchesRef,
  factionRefOf,
  resolveFactionRef,
} from '../../src/domain/factionRefs.js';
import { propagateImpairment } from '../../src/domain/entities/propagate.js';
import { inferSuccessors } from '../../src/domain/entities/successors.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { applyFactionRenameToSettlement } from '../../src/domain/factionRename.js';
import { readClergyPlane } from '../../src/domain/worldPulse/clergyTraitPlane.js';
import { ladderFactionKey, npcInFaction } from '../../src/domain/worldPulse/npcLadderState.js';
import { generateFactionStructuralNpcs } from '../../src/generators/factionRoles.js';

const religiousSeat = (extra = {}) => ({
  faction: 'Religious Authorities',
  category: 'religious',
  ...extra,
});

describe('FactionRef production', () => {
  test('the shared helper stays a zero-import leaf', () => {
    const source = readFileSync(path.join(process.cwd(), 'src/domain/factionRefs.js'), 'utf8');
    // LIVENESS ANCHOR: the subject is file TEXT and nothing else here reads it, so a
    // moved or emptied leaf would satisfy "no imports" perfectly. Pin the leaf by an
    // export it must carry before asking what it does NOT carry.
    expect(source).toContain('export function factionRefOf');
    // anchored: the leaf is proven live by its own factionRefOf export above
    expect(source).not.toMatch(/^\s*import\s/m);
  });

  test('structural NPCs preserve generated name-only seats and authored id-bearing seats', () => {
    const generatedSeat = religiousSeat();
    const authoredSeat = religiousSeat({ id: 'faction.temple.stable' });

    const generatedPriest = generateFactionStructuralNpcs(generatedSeat)[0];
    const authoredPriest = generateFactionStructuralNpcs(authoredSeat)[0];

    expect(factionRefOf(generatedSeat)).toBe('Religious Authorities');
    expect(generatedPriest.linkedFactionIds).toEqual(['Religious Authorities']);
    expect(generatedPriest.factionAffiliation).toBe('Religious Authorities');

    expect(factionRefOf(authoredSeat)).toBe('faction.temple.stable');
    expect(authoredPriest.linkedFactionIds).toEqual(['faction.temple.stable']);
    expect(authoredPriest.factionAffiliation).toBe('Religious Authorities');
  });
});

describe('FactionRef consumers', () => {
  test('an id-bearing structural link propagates to the authored faction record', () => {
    const faction = religiousSeat({ id: 'faction.temple.stable', impairments: [] });
    const settlement = {
      institutions: [],
      powerStructure: { factions: [faction] },
      npcs: [{
        id: 'npc.priest',
        name: 'High Priestess',
        importance: 'pillar',
        linkedFactionIds: ['faction.temple.stable'],
      }],
    };

    const next = propagateImpairment({
      settlement,
      origin: {
        entityType: 'npc',
        entityId: 'npc.priest',
        impairment: {
          type: 'leadership',
          severity: 1,
          causeEventId: 'event.priest_removed',
          description: 'The priesthood lost its leader.',
        },
      },
      opts: { maxHops: 1 },
    });

    expect(next.powerStructure.factions[0].impairments).toEqual([
      expect.objectContaining({ type: 'leadership', causeEventId: 'event.priest_removed' }),
    ]);
  });

  test('ordinary generated religious seats and name-linked structural clergy enter the clergy plane', () => {
    const faction = religiousSeat(); // actual generated shape: category + .faction, no id/archetype
    const priest = {
      ...generateFactionStructuralNpcs(faction)[0],
      personality: { dominant: 'ruthless', flaw: 'corrupt' },
    };

    const reading = readClergyPlane({
      powerStructure: { factions: [faction] },
      npcs: [priest],
    });

    expect(reading.weight).toBeGreaterThan(0);
    expect(reading.taint).toBeGreaterThan(0);
    expect(reading.e).toBeGreaterThan(0);
    expect(npcInFaction(priest, faction, ladderFactionKey(faction), [faction])).toBe(true);
  });

  test('successor inference joins legacy name handles to authored ids through the roster', () => {
    const faction = religiousSeat({ id: 'faction.temple.stable' });
    const outgoing = {
      id: 'npc.outgoing',
      importance: 'pillar',
      status: 'dead',
      linkedFactionIds: ['faction.temple.stable'],
      linkedInstitutionIds: [],
    };
    const successor = {
      id: 'npc.successor',
      importance: 'key',
      status: 'active',
      linkedFactionIds: ['Religious Authorities'], // pre-id migration save shape
      linkedInstitutionIds: [],
    };

    expect(inferSuccessors({
      outgoing,
      settlement: {
        powerStructure: { factions: [faction] },
        npcs: [outgoing, successor],
      },
    })).toEqual([successor]);
  });

  test('stable ids survive a rename while name-only handles follow the governed cascade', () => {
    const stable = {
      powerStructure: {
        factions: [{ id: 'faction.temple.stable', faction: 'Old Temple', name: 'Old Temple' }],
      },
      npcs: [{ factionAffiliation: 'Old Temple', linkedFactionIds: ['faction.temple.stable'] }],
    };
    applyFactionRenameToSettlement(stable, 'Old Temple', 'New Temple');
    const stableFaction = stable.powerStructure.factions[0];
    expect(stable.npcs[0].linkedFactionIds).toEqual(['faction.temple.stable']);
    expect(entityLinksFaction(stable.npcs[0], stableFaction, stable.powerStructure.factions)).toBe(true);

    const nameOnly = {
      powerStructure: { factions: [{ faction: 'Old Chapel', name: 'Old Chapel' }] },
      npcs: [{ factionAffiliation: 'Old Chapel', linkedFactionIds: ['Old Chapel'] }],
    };
    applyFactionRenameToSettlement(nameOnly, 'Old Chapel', 'New Chapel');
    const nameFaction = nameOnly.powerStructure.factions[0];
    expect(nameOnly.npcs[0].linkedFactionIds).toEqual(['New Chapel']);
    expect(entityLinksFaction(nameOnly.npcs[0], nameFaction, nameOnly.powerStructure.factions)).toBe(true);
  });

  test('resolution is exact, id-first, and refuses ambiguous or unknown name joins', () => {
    const idOwner = { id: 'Temple', faction: 'Council of Bells', impairments: [] };
    const nameOwner = { id: 'faction.other', faction: 'Temple', impairments: [] };
    const factions = [idOwner, nameOwner];

    expect(resolveFactionRef(factions, 'Temple')).toBe(idOwner);
    expect(factionMatchesRef(nameOwner, 'temple')).toBe(false);
    expect(resolveFactionRef(factions, 'missing')).toBeNull();
    expect(resolveFactionRef([
      { id: 'one', faction: 'Shared Name' },
      { id: 'two', faction: 'Shared Name' },
    ], 'Shared Name')).toBeNull();

    const settlement = {
      institutions: [],
      powerStructure: { factions },
      npcs: [{ id: 'npc.linked', importance: 'key', linkedFactionIds: ['Temple'] }],
    };
    const next = propagateImpairment({
      settlement,
      origin: {
        entityType: 'npc',
        entityId: 'npc.linked',
        impairment: {
          type: 'membership',
          severity: 1,
          causeEventId: 'event.id_priority',
          description: 'An exact id owns the handle.',
        },
      },
      opts: { maxHops: 1 },
    });
    expect(next.powerStructure.factions[0].impairments).toHaveLength(1);
    expect(next.powerStructure.factions[1].impairments).toHaveLength(0);

    const killed = mutateSettlement({
      settlement,
      event: { id: 'event.kill_id_priority', type: 'KILL_NPC', targetId: 'npc.linked', payload: {} },
    });
    expect(killed.powerStructure.factions[0].impairments).toHaveLength(1);
    expect(killed.powerStructure.factions[1].impairments).toHaveLength(0);
  });

  test('event targeting rejects folded/label ambiguity and keeps folded IDs ahead of names', () => {
    const ambiguousCase = {
      powerStructure: {
        factions: [
          { id: 'faction.upper', faction: 'Temple', impairments: [] },
          { id: 'faction.lower', faction: 'temple', impairments: [] },
        ],
      },
    };
    const afterCaseCollision = mutateSettlement({
      settlement: ambiguousCase,
      event: {
        id: 'event.case_collision',
        type: 'IMPAIR_FACTION',
        targetId: 'TEMPLE',
        payload: { dimension: 'public_support', severity: 0.5 },
      },
    });
    expect(afterCaseCollision).toStrictEqual(ambiguousCase);
    expect(afterCaseCollision.powerStructure.factions.every((f) => !f.impairments.length)).toBe(true);

    const ambiguousLabel = {
      powerStructure: {
        factions: [
          { id: 'faction.guard.one', name: 'Temple Guard', impairments: [] },
          { id: 'faction.guard.two', name: 'temple guard', impairments: [] },
        ],
      },
    };
    const afterLabelCollision = mutateSettlement({
      settlement: ambiguousLabel,
      event: {
        id: 'event.label_collision',
        type: 'IMPAIR_FACTION',
        targetId: 'faction.temple_guard',
        payload: { dimension: 'public_support', severity: 0.5 },
      },
    });
    expect(afterLabelCollision).toStrictEqual(ambiguousLabel);
    expect(afterLabelCollision.powerStructure.factions.every((f) => !f.impairments.length)).toBe(true);

    const uniqueLegacyLabel = {
      powerStructure: {
        factions: [{ id: 'faction.guard', name: 'Temple Guard', impairments: [] }],
      },
    };
    const afterUniqueLabel = mutateSettlement({
      settlement: uniqueLegacyLabel,
      event: {
        id: 'event.unique_legacy_label',
        type: 'IMPAIR_FACTION',
        targetId: 'faction.temple_guard',
        payload: { dimension: 'public_support', severity: 0.5 },
      },
    });
    expect(afterUniqueLabel.powerStructure.factions[0].impairments).toHaveLength(1);

    const idOwner = { id: 'TEMPLE', faction: 'Council of Bells', impairments: [] };
    const nameOwner = { id: 'faction.other', faction: 'Temple', impairments: [] };
    const idPriority = { powerStructure: { factions: [nameOwner, idOwner] } };
    const afterIdPriority = mutateSettlement({
      settlement: idPriority,
      event: {
        id: 'event.folded_id_priority',
        type: 'IMPAIR_FACTION',
        targetId: 'temple',
        payload: { dimension: 'public_support', severity: 0.5 },
      },
    });
    expect(afterIdPriority.powerStructure.factions[0].impairments).toHaveLength(0);
    expect(afterIdPriority.powerStructure.factions[1].impairments).toHaveLength(1);

    const canonical = { id: 'faction.canonical', faction: 'Temple Wardens', impairments: [] };
    const staleLegacy = { id: 'faction.legacy', name: 'TEMPLE WARDENS', impairments: [] };
    const authorityTiers = {
      powerStructure: { factions: [canonical] },
      factions: [staleLegacy],
    };
    const afterAuthorityResolution = mutateSettlement({
      settlement: authorityTiers,
      event: {
        id: 'event.canonical_roster_priority',
        type: 'IMPAIR_FACTION',
        targetId: 'TEMPLE WARDENS',
        payload: { dimension: 'public_support', severity: 0.5 },
      },
    });
    expect(afterAuthorityResolution.powerStructure.factions[0].impairments).toHaveLength(1);
    expect(afterAuthorityResolution.factions[0].impairments).toHaveLength(0);
  });
});
