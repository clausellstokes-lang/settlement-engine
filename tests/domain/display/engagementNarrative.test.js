import { describe, expect, test } from 'vitest';

import {
  ENGAGEMENT_KINDS,
  ENGAGEMENT_CLASSES,
  ENGAGEMENT_PHASES,
  TERRAIN_WORDS,
  engagementKindOf,
  deriveEngagementNarrative,
  liveSiegeNarratives,
} from '../../../src/domain/display/engagementNarrative.js';
import { KIND_SECTION } from '../../../src/domain/display/chroniclersLetter.js';
import { EXACT_SECTION } from '../../../src/domain/realm/heraldRouting.js';
import { WAR_DESK_KINDS } from '../../../src/domain/display/rumorPhrasePools.js';
import { WHAT_PHRASES } from '../../../src/domain/display/settlementRumors.js';
import { TERRAIN_OPTIONS } from '../../../src/components/gallery/galleryUtils.js';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';

// ─────────────────────────────────────────────────────────────────────────────
// WEAVE NAME-3 — the battle-kind taxonomy and the engagement-narrative deriver.
// The load-bearing assertions here are the ROUTING containment (a taxonomy member
// the chronicle would drop reds on arrival) and the PLACE RULE (terrain exists
// exactly where the record holds a place, and nowhere else).
// ─────────────────────────────────────────────────────────────────────────────

const NAMES = /** @type {Record<string, string>} */ ({
  kelby: 'Kelby', ashford: 'Ashford', morrow: 'Morrow', thane: 'Thanebridge',
});
const nameFor = (/** @type {unknown} */ id) => NAMES[String(id)] || String(id);

const snapshot = {
  byId: new Map([
    ['ashford', { id: 'ashford', settlement: { id: 'ashford', config: { terrainType: 'hills' } } }],
    ['morrow', { id: 'morrow', settlement: { id: 'morrow', config: { terrainType: 'coastal' } } }],
    ['thane', { id: 'thane', settlement: { id: 'thane', config: { terrainType: 'riverside' } } }],
  ]),
};

const ENTRIES = /** @type {Record<string, Record<string, unknown>>} */ ({
  field_battle: { impactKind: 'field_battle', settlementIds: ['kelby', 'ashford'], tags: ['world_pulse', 'war', 'field_battle'] },
  sea_battle: { impactKind: 'sea_battle', settlementIds: ['kelby', 'morrow'], tags: ['world_pulse', 'war', 'sea_battle'] },
  intervention_clash: { impactKind: 'intervention_clash', settlementIds: ['kelby', 'morrow', 'thane'], tags: ['world_pulse', 'war', 'intervention', 'field_battle'] },
  blockade_declared: { impactKind: 'blockade_declared', settlementIds: ['kelby', 'morrow'], tags: ['world_pulse', 'war', 'blockade'] },
  blockade_lifted: { impactKind: 'blockade_lifted', settlementIds: ['kelby', 'morrow'], tags: ['world_pulse', 'war', 'blockade'] },
  conquest: { type: 'power_transfer', candidateType: 'conquest', targetSaveId: 'ashford', settlementIds: ['kelby', 'ashford'] },
  siege_lifted: { kind: 'siege_lifted', targetId: 'ashford', settlementIds: ['kelby', 'ashford'] },
});

describe('battle-kind taxonomy — it classifies what the chronicle already routes', () => {
  test('every taxonomy member is routed by BOTH section tables', () => {
    for (const kind of Object.keys(ENGAGEMENT_KINDS)) {
      expect(KIND_SECTION[kind], `${kind} has no chronicler's-letter section`).toBe('wars');
      expect(EXACT_SECTION[kind], `${kind} has no Herald section`).toBe('war');
    }
  });

  test('every taxonomy member has a live rumor phrase — all seven, outcomes included', () => {
    for (const kind of Object.keys(ENGAGEMENT_KINDS)) {
      expect(WHAT_PHRASES[kind], `${kind} has no rumor phrase`).toBeTruthy();
    }
  });

  test('the ONE rumor-desk gap is frozen as a named exception, not left to be rediscovered', () => {
    // ⚠ DEFERRED, NOT FIXED (NAME-3, recorded in the module header): `sea_battle`
    // is routed by both section tables and carries its live rumor phrase, but the
    // rumor-phrase retrofit never wired it into the war desk, so it gets its single
    // anchor phrase where its siblings get pools. Wiring it is a content wave's act
    // — it owes an authored pool and moves the unvoiced-token backlog — and it
    // changes reader-visible rumor phrasing, so it is outside this lane's charter.
    // The exception is FROZEN here: the day someone wires it, this reds and the
    // header note must be retired with it.
    const minted = Object.keys(ENGAGEMENT_KINDS).filter((k) => k !== 'conquest' && k !== 'siege_lifted');
    const unwired = minted.filter((kind) => !WAR_DESK_KINDS.includes(kind)).sort();
    expect(unwired).toEqual(['sea_battle']);
  });

  test('the classes are closed and every kind lands in one of them', () => {
    expect([...ENGAGEMENT_CLASSES].sort()).toEqual([...ENGAGEMENT_CLASSES]);
    expect(new Set(Object.values(ENGAGEMENT_KINDS))).toEqual(new Set(ENGAGEMENT_CLASSES));
  });

  test('every kind has a four-phase arc, and no phase leaks an engine scalar', () => {
    for (const kind of Object.keys(ENGAGEMENT_KINDS)) {
      const phases = ENGAGEMENT_PHASES[kind];
      expect(phases, `${kind} has no phase arc`).toBeDefined();
      expect(phases.length).toBe(4);
      for (const phase of phases) {
        expect(phase.length).toBeGreaterThan(0);
        // anchored: the non-empty assertion on the line above
        expect(phase).not.toMatch(/\d/);
      }
    }
  });

  test('the two deliberate exclusions stay excluded, and the anchors prove the roster is live', () => {
    // `razing` is a terminal act against a town, not a contest of arms (and the
    // letter's own section table does not carry it either); `hostile_raid` is a raid
    // on a settlement, not an engagement between hosts. `field_battle` is the anchor:
    // it travels the same roster and would vanish under the same drift.
    const kinds = Object.keys(ENGAGEMENT_KINDS);
    expectAbsentWithAnchor(kinds, 'razing', 'field_battle', 'engagement taxonomy');
    expectAbsentWithAnchor(kinds, 'hostile_raid', 'field_battle', 'engagement taxonomy');
  });
});

describe('terrain — one vocabulary, and only where the record holds a place', () => {
  test('the transcribed terrain words are exactly resolveTerrain\'s seven classes', () => {
    // The drift guard for the deliberate transcription: domain may not import the
    // gallery's exported list, so the two are compared here instead.
    expect(Object.keys(TERRAIN_WORDS).sort()).toEqual([...TERRAIN_OPTIONS].sort());
    expect(Object.keys(TERRAIN_WORDS)).toHaveLength(7);
  });

  test('no token of the OTHER terrain vocabulary can appear', () => {
    // spatialCost.terrainClassOf's exclusive members. `forest` is the anchor: it is
    // in both vocabularies, so its presence proves the map is live and correctly
    // keyed while the five below are correctly kept out.
    const keys = Object.keys(TERRAIN_WORDS);
    for (const foreign of ['water', 'grassland', 'tundra', 'glacier', 'wetland']) {
      expectAbsentWithAnchor(keys, foreign, 'forest', 'terrain word map');
    }
  });

  test('THE PLACE RULE: terrain is derived exactly where the record holds a place', () => {
    const withPlace = ['conquest', 'siege_lifted', 'blockade_declared', 'blockade_lifted', 'intervention_clash'];
    const withoutPlace = ['field_battle', 'sea_battle'];
    for (const kind of withPlace) {
      const n = deriveEngagementNarrative({ entry: ENTRIES[kind], snapshot, nameFor });
      expect(n.placeId, `${kind} lost its place`).not.toBeNull();
      expect(n.terrain, `${kind} lost its terrain`).toBeTruthy();
      expect(TERRAIN_WORDS[n.terrain]).toBe(n.terrainWord);
    }
    for (const kind of withoutPlace) {
      const n = deriveEngagementNarrative({ entry: ENTRIES[kind], snapshot, nameFor });
      expect(n.placeId, `${kind} acquired a place the record does not hold`).toBeNull();
      expect(n.terrain).toBeNull();
      expect(n.terrainWord).toBeNull();
    }
  });

  test('intervention_clash reads its place from the CONTESTED SEAT, not from a combatant', () => {
    const n = deriveEngagementNarrative({ entry: ENTRIES.intervention_clash, snapshot, nameFor });
    expect(n.placeId).toBe('thane');
    expect(n.parties).toEqual(['kelby', 'morrow']);
    expect(n.terrain).toBe('riverside');
    expect(n.line).toContain('over Thanebridge in river country');
  });

  test('a place the world no longer knows is named without a terrain claim', () => {
    const n = deriveEngagementNarrative({ entry: ENTRIES.conquest, snapshot: { byId: new Map() }, nameFor });
    expect(n.placeId).toBe('ashford');
    expect(n.terrain).toBeNull();
    expect(n.line).toContain("Ashford's walls");
    // anchored: the placeId and containment assertions above prove the narrative was built
    expect(n.line).not.toContain('country');
  });
});

describe('the narrative — every fact stands in the record', () => {
  test('a non-engagement entry, and an absent one, surface nothing', () => {
    expect(deriveEngagementNarrative({ entry: { impactKind: 'harvest', settlementIds: ['kelby'] } })).toBeNull();
    expect(deriveEngagementNarrative({ entry: {} })).toBeNull();
    expect(deriveEngagementNarrative({})).toBeNull();
    expect(engagementKindOf(null)).toBeNull();
    expect(engagementKindOf({ impactKind: 'field_battle' })).toBe('field_battle');
    expect(engagementKindOf({ candidateType: 'conquest' })).toBe('conquest');
    expect(engagementKindOf({ kind: 'siege_lifted' })).toBe('siege_lifted');
  });

  test('a placeless engagement SAYS it has no place rather than implying one', () => {
    const field = deriveEngagementNarrative({ entry: ENTRIES.field_battle, snapshot, nameFor });
    expect(field.line).toContain("no town's fields and no walls");
    const sea = deriveEngagementNarrative({ entry: ENTRIES.sea_battle, snapshot, nameFor });
    expect(sea.line).toContain('open water');
  });

  test('the fogged register is minted only from the fought_blind tag', () => {
    const clear = deriveEngagementNarrative({ entry: ENTRIES.field_battle, snapshot, nameFor });
    const blind = deriveEngagementNarrative({
      entry: { ...ENTRIES.field_battle, tags: [...ENTRIES.field_battle.tags, 'fought_blind'] },
      snapshot,
      nameFor,
    });
    expect(clear.fogged).toBe(false);
    expect(blind.fogged).toBe(true);
    expect(blind.line).toContain('half-blind');
    expect(clear.line.length).toBeGreaterThan(0);
    // anchored: blind.line is asserted to CONTAIN the clause and clear.line to be non-empty, so neither side can go vacuous
    expect(clear.line).not.toContain('half-blind');
  });

  test('the two blockade halves are opposite acts and read as such', () => {
    const laid = deriveEngagementNarrative({ entry: ENTRIES.blockade_declared, snapshot, nameFor });
    const lifted = deriveEngagementNarrative({ entry: ENTRIES.blockade_lifted, snapshot, nameFor });
    expect(laid.line).toContain('closed');
    expect(lifted.line).toContain('stood down');
    expect(laid.engagementClass).toBe('blockade');
    expect(lifted.engagementClass).toBe('blockade');
  });

  test('the record\'s party ORDER is preserved, never sorted away', () => {
    const n = deriveEngagementNarrative({ entry: ENTRIES.field_battle, snapshot, nameFor });
    // The minters write [winner, loser]; sorting would destroy the one thing the
    // order says. 'kelby' > 'ashford' by codepoint, so a sort would flip these.
    expect(n.parties).toEqual(['kelby', 'ashford']);
    expect(n.line.indexOf('Kelby')).toBeLessThan(n.line.indexOf('Ashford'));
  });

  test('no narrative line leaks an engine scalar, across every kind', () => {
    for (const kind of Object.keys(ENGAGEMENT_KINDS)) {
      const n = deriveEngagementNarrative({ entry: ENTRIES[kind], snapshot, nameFor });
      expect(n.line.length, `${kind} produced no line`).toBeGreaterThan(0);
      // anchored: the non-empty assertion on the line above
      expect(n.line).not.toMatch(/\d/);
    }
  });
});

describe('live sieges — narratable with zero new persisted bytes', () => {
  test('a dormant campaign narrates nothing', () => {
    expect(liveSiegeNarratives({ worldState: {}, snapshot, nameFor })).toEqual([]);
    expect(liveSiegeNarratives({})).toEqual([]);
  });

  test('one besieger reads as an army, several as a coalition, and terrain comes off the town', () => {
    const narratives = liveSiegeNarratives({
      worldState: { deployments: { kelby: { targetId: 'ashford' }, morrow: { targetId: 'ashford' }, thane: { targetId: 'morrow' } } },
      snapshot,
      nameFor,
    });
    expect(narratives.map((n) => n.targetId)).toEqual(['ashford', 'morrow']);
    expect(narratives[0].besiegers).toEqual(['kelby', 'morrow']);
    expect(narratives[0].line).toContain('a coalition of two realms'.replace(/^./, (c) => c.toUpperCase()));
    expect(narratives[0].line).toContain('broken hill country');
    expect(narratives[1].line).toContain("Thanebridge's army");
    expect(narratives[1].terrain).toBe('coastal');
    for (const n of narratives) {
      expect(n.line.length).toBeGreaterThan(0);
      // anchored: the non-empty assertion on the line above
      expect(n.line).not.toMatch(/\d/);
    }
  });

  test('a besieged town the snapshot does not know still narrates, without a terrain claim', () => {
    const narratives = liveSiegeNarratives({
      worldState: { deployments: { kelby: { targetId: 'elsewhere' } } },
      snapshot,
      nameFor,
    });
    expect(narratives).toHaveLength(1);
    expect(narratives[0].terrain).toBeNull();
    expect(narratives[0].line).toContain("elsewhere's walls");
  });
});
