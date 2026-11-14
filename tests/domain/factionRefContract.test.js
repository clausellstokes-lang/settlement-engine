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
import { migrateV1toV2 } from '../../src/domain/settlementMigrations.js';
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
    // PEOPLE-LAND re-key (M-2): the structural priest belongs to its seat by a membership named by the
    // seat's display name; the retired `linkedFactionIds`/`factionAffiliation` are no longer written.
    expect(generatedPriest.memberships).toEqual([{ power: 'Religious Authorities', rank: 1, share: 1 }]);
    expect(Object.hasOwn(generatedPriest, 'linkedFactionIds')).toBe(false);

    expect(factionRefOf(authoredSeat)).toBe('faction.temple.stable');
    expect(authoredPriest.memberships).toEqual([{ power: 'Religious Authorities', rank: 1, share: 1 }]);
  });
});

describe('FactionRef consumers', () => {
  test('an id-bearing structural link propagates to the authored faction record', () => {
    const faction = religiousSeat({ id: 'faction.temple.stable', impairments: [] });
    // GREEN-TIP (2026-11-10, re-keyed with the propagation re-point): propagation's NPC hop reads the card's
    // MEMBERSHIPS (entities/propagate.js; the retired `linkedFactionIds` is on no current card). The id-bearing v1
    // link is handed through the product's own door, the save migration, which resolves the id to its power and
    // writes the membership — so the id still joins the authored record, now at the door that carries it.
    const { settlement } = migrateV1toV2({
      institutions: [],
      powerStructure: { factions: [faction] },
      npcs: [{
        id: 'npc.priest',
        name: 'High Priestess',
        importance: 'pillar',
        linkedFactionIds: ['faction.temple.stable'],
      }],
    });
    expect(settlement.npcs[0].memberships).toEqual([expect.objectContaining({ power: faction.faction })]);

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
    // PEOPLE-5B (M-7): a v2 card stands in its power through `memberships` (entityLinksFaction reads them;
    // linkedFactionIds left the card), so the retired generator's structural priest is given its membership.
    const priest = {
      ...generateFactionStructuralNpcs(faction)[0],
      memberships: [{ power: faction.faction, rank: 1, share: 1 }],
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

  // PEOPLE-5B (M-7): the cards' powers are `memberships` by the power's NAME; the roster resolves the name to
  // the authored-id faction, so two cards standing in it overlap whatever its id.
  test('successor inference joins the cards\' memberships to an authored-id faction through the roster', () => {
    const faction = religiousSeat({ id: 'faction.temple.stable' });
    const outgoing = {
      id: 'npc.outgoing',
      importance: 'pillar',
      status: 'dead',
      memberships: [{ power: 'Religious Authorities', rank: 1, share: 1 }],
      linkedInstitutionIds: [],
    };
    const successor = {
      id: 'npc.successor',
      importance: 'key',
      status: 'active',
      memberships: [{ power: 'Religious Authorities', rank: 2, share: 0.5 }],
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

  // PEOPLE-5B (M-7): a card's membership names its power, so it FOLLOWS the governed cascade whether the power
  // carries a stable id or not, and the link resolves before and after.
  test('a membership follows the governed cascade, with or without a stable faction id', () => {
    const stable = {
      powerStructure: {
        factions: [{ id: 'faction.temple.stable', faction: 'Old Temple', name: 'Old Temple' }],
      },
      npcs: [{ memberships: [{ power: 'Old Temple', rank: 1, share: 1 }] }],
    };
    applyFactionRenameToSettlement(stable, 'Old Temple', 'New Temple');
    const stableFaction = stable.powerStructure.factions[0];
    expect(stableFaction.id, 'the id is identity, never a label').toBe('faction.temple.stable');
    expect(stable.npcs[0].memberships[0].power).toBe('New Temple');
    expect(entityLinksFaction(stable.npcs[0], stableFaction, stable.powerStructure.factions)).toBe(true);

    const nameOnly = {
      powerStructure: { factions: [{ faction: 'Old Chapel', name: 'Old Chapel' }] },
      npcs: [{ memberships: [{ power: 'Old Chapel', rank: 1, share: 1 }] }],
    };
    applyFactionRenameToSettlement(nameOnly, 'Old Chapel', 'New Chapel');
    const nameFaction = nameOnly.powerStructure.factions[0];
    expect(nameOnly.npcs[0].memberships[0].power).toBe('New Chapel');
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

    // GREEN-TIP (2026-11-10, re-keyed with the propagation re-point): the handle 'Temple' is resolved id-first by the
    // save migration (powerFor -> resolveFactionRef) onto the id owner's membership, and propagation and KILL_NPC
    // join that membership — so the id owner, never the name owner, is the one wounded.
    const { settlement } = migrateV1toV2({
      institutions: [],
      powerStructure: { factions },
      npcs: [{ id: 'npc.linked', importance: 'key', linkedFactionIds: ['Temple'] }],
    });
    expect(settlement.npcs[0].memberships).toEqual([expect.objectContaining({ power: 'Council of Bells' })]);
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
