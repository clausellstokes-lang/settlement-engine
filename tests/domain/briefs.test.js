/**
 * tests/domain/briefs.test.js — the S2 brief composers (DESIGN_AI_CONTROL_SURFACE §2
 * stage 2). Pins the citation law + the STRUCTURAL audience rule that the whole
 * Surveyor ship rests on:
 *
 *   PIN A (citation-coverage floor): every section of every composed bundle carries a
 *     KNOWN source — bundleCitationCoverage === 1. Nothing is renderable un-cited.
 *   PIN B (player-safe = public projection, structural): the player brief's settlement
 *     section IS exactly toPublicSafe(settlement); no private key leaks.
 *   PIN C (audience purity, fail-closed): a player-audience bundle can carry ONLY
 *     player-safe sources; wiring a DM source into a player bundle THROWS.
 *   PIN D (dormancy): a quiet world yields an empty bundle (byte-identical off-state).
 *   PIN E (purity): same input ⇒ byte-identical output, input never mutated.
 */
import { describe, it, expect } from 'vitest';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import {
  BRIEF_COMPOSERS, BRIEF_KINDS,
  settlementBrief, playerSafeBrief, factionBrief, regionalBrief, weeklyDigest,
  sessionPrep, dramaticIronyBrief,
  bundleCitationCoverage, isPlayerSafeSource, isKnownSource, assembleBrief, section, SOURCE,
} from '../../src/domain/briefs/index.js';

// ── fixtures ─────────────────────────────────────────────────────────────────

function treaty(victorId, loserId, terms = [{ type: 'tribute', complianceState: 'honored' }]) {
  return { victorId, loserId, parties: [victorId, loserId], terms };
}

/** A lit realm world with treaties (spheres), blocs, and credibility. */
function realmWorld() {
  return {
    tick: 20,
    deployments: { thorn: { targetId: 'a' } }, // one active war pair (both directions)
    spatialLedgers: {
      treaties: {
        t1: treaty('thorn', 'a'),
        t2: treaty('thorn', 'b', [{ type: 'compelled_alliance', complianceState: 'honored' }]),
        t3: treaty('thorn', 'c', [{ type: 'puppet_seat', complianceState: 'honored' }]),
      },
      credibility: { s1: { score: 8, lastUpdateTick: 5, holder: 'people_held' } },
    },
    politicsLedgers: {
      s1: {
        blocs: [
          { id: 'b1', members: ['The Guildhall'], glue: [{ type: 'commerce', detail: 'x' }], end: 'commerce', strain: 0.4, sinceTick: 3 },
          { id: 'c1', members: ['The Whispered Court'], glue: [{ type: 'threat', detail: 'y' }], end: 'seats', strain: 0.2, sinceTick: 4, covert: true },
        ],
      },
    },
  };
}

const SETTLEMENTS = [
  { id: 'thorn', name: 'Thornwall' }, { id: 'a', name: 'Ashford' },
  { id: 'b', name: 'Briarwatch' }, { id: 'c', name: 'Caldmoor' }, { id: 's1', name: 'Ashford' },
];

/** A settlement carrying BOTH public and DM-private content. */
function litSettlement() {
  return {
    id: 's1', name: 'Ashford', tier: 'town', population: 1200,
    thesis: 'A river town that runs on grain and grievance.',
    npcs: [{
      id: 'n1', name: 'Mira Venn', role: 'reeve', title: 'Reeve', power: 8, influence: 'high',
      secret: { what: 'skimming the granary tithe' }, goal: { short: 'buy the upper mill' },
      plotHooks: ['the tithe ledger'], relationships: [{ to: 'n2', kind: 'rival' }],
    }],
    // DM-private — must never reach the player bundle:
    dmNotes: 'The reeve is the villain.',
    dmCompass: { theme: 'quiet corruption' },
    aiData: { aiSettlement: { thesis: 'x' } },
    plotHooks: [{ text: 'the missing tithe', priority: 9, source: 'granary' }],
    _seed: 992211,
  };
}

// ── PIN A + registry: every composer is fully cited ──────────────────────────

describe('briefs — citation coverage (PIN A)', () => {
  const world = realmWorld();
  const settlement = litSettlement();
  const cases = {
    settlement: settlementBrief({ settlement, worldState: world, tick: 5 }),
    playerSafe: playerSafeBrief({ settlement, worldState: world, tick: 5 }),
    faction: factionBrief({ worldState: world, settlements: SETTLEMENTS, audience: 'dm' }),
    regional: regionalBrief({ worldState: world, settlements: SETTLEMENTS, tick: 5 }),
    weekly: weeklyDigest({ worldState: world, settlements: SETTLEMENTS, tick: 5 }),
    sessionPrep: sessionPrep({ settlement, worldState: world, tick: 5 }),
    dramaticIrony: dramaticIronyBrief({ settlement, worldState: world, tick: 5 }),
  };

  it('every registered kind has a composer + declared audience', () => {
    expect([...BRIEF_KINDS].sort()).toEqual(Object.keys(cases).sort());
    for (const kind of BRIEF_KINDS) expect(typeof BRIEF_COMPOSERS[kind].compose).toBe('function');
  });

  for (const [kind, brief] of Object.entries(cases)) {
    it(`${kind}: coverage is 1 and every section tags a KNOWN source`, () => {
      expect(brief.kind).toBe(kind);
      expect(bundleCitationCoverage(brief)).toBe(1);
      expect(brief.sections.length).toBeGreaterThan(0); // the lit fixture produces content
      for (const s of brief.sections) {
        expect(isKnownSource(s.source)).toBe(true);
        expect(Array.isArray(s.items) && s.items.length > 0).toBe(true);
      }
    });
  }
});

// ── PIN B: player brief IS the public projection ─────────────────────────────

describe('briefs — player-safe is the public projection (PIN B)', () => {
  it('the player settlement section EQUALS toPublicSafe(settlement), byte-for-byte', () => {
    const settlement = litSettlement();
    const brief = playerSafeBrief({ settlement, worldState: realmWorld(), tick: 5 });
    const settlementSection = brief.sections.find((s) => s.id === 'settlement');
    expect(settlementSection.source).toBe(SOURCE.SETTLEMENT_PUBLIC);
    expect(settlementSection.items[0].public).toEqual(toPublicSafe(settlement, { full: false }));
  });

  it('no DM-private field survives into the player bundle', () => {
    const brief = playerSafeBrief({ settlement: litSettlement(), worldState: realmWorld(), tick: 5 });
    const blob = JSON.stringify(brief);
    for (const leak of ['dmNotes', 'dmCompass', 'aiData', '_seed', 'skimming the granary tithe', 'buy the upper mill', 'the tithe ledger']) {
      expect(blob).not.toContain(leak);
    }
  });
});

// ── PIN C: audience purity, fail-closed ──────────────────────────────────────

describe('briefs — audience purity (PIN C)', () => {
  it('every player-audience bundle carries ONLY player-safe sources', () => {
    const player = playerSafeBrief({ settlement: litSettlement(), worldState: realmWorld(), tick: 5 });
    expect(player.audience).toBe('player');
    for (const s of player.sections) expect(isPlayerSafeSource(s.source)).toBe(true);

    const playerFactions = factionBrief({ worldState: realmWorld(), settlements: SETTLEMENTS, audience: 'player' });
    for (const s of playerFactions.sections) expect(isPlayerSafeSource(s.source)).toBe(true);
  });

  it('the DM settlement brief DOES carry DM-only sources (the reads differ by audience)', () => {
    const dm = settlementBrief({ settlement: litSettlement(), worldState: realmWorld(), tick: 5 });
    const dmSources = dm.sections.map((s) => s.source);
    expect(dmSources).toContain(SOURCE.NPC_TABLE);
    expect(dmSources.some((src) => !isPlayerSafeSource(src))).toBe(true);
  });

  it('FAIL CLOSED: handing a player bundle a DM source THROWS at construction', () => {
    expect(() => assembleBrief({
      kind: 'playerSafe', audience: 'player',
      sections: [section('leak', 'x', SOURCE.NPC_TABLE, [{ a: 1 }])],
    })).toThrow(/non-player-safe source/);
    // …and a DM bundle accepts it (the guard is player-only).
    expect(() => assembleBrief({
      kind: 'settlement', audience: 'dm',
      sections: [section('ok', 'x', SOURCE.NPC_TABLE, [{ a: 1 }])],
    })).not.toThrow();
  });

  it('an unknown source is rejected at section construction (fail-closed)', () => {
    expect(() => section('x', 't', 'read:not-a-real-source', [{ a: 1 }])).toThrow(/unknown source/);
  });
});

// ── PIN D: dormancy ──────────────────────────────────────────────────────────

describe('briefs — dormancy (PIN D)', () => {
  it('a quiet world yields empty bundles (nothing to cite, coverage 1)', () => {
    const dormant = { tick: 0 };
    const bare = {}; // no public fields ⇒ empty projection ⇒ no settlement section
    for (const brief of [
      settlementBrief({ settlement: bare, worldState: dormant }),
      playerSafeBrief({ settlement: bare, worldState: dormant }),
      factionBrief({ worldState: dormant, settlements: [] }),
      regionalBrief({ worldState: dormant, settlements: [] }),
      weeklyDigest({ worldState: dormant, settlements: [] }),
      sessionPrep({ settlement: bare, worldState: dormant }),
      dramaticIronyBrief({ settlement: bare, worldState: dormant }),
    ]) {
      expect(brief.sections).toEqual([]);
      expect(bundleCitationCoverage(brief)).toBe(1);
    }
  });

  it('INERT-NOT-CRASH on null/garbage inputs', () => {
    expect(() => settlementBrief({ settlement: null, worldState: null })).not.toThrow();
    expect(() => factionBrief({ worldState: null, settlements: null })).not.toThrow();
    expect(() => regionalBrief({ worldState: { deployments: 42 }, settlements: null })).not.toThrow();
  });
});

// ── PIN E: purity ────────────────────────────────────────────────────────────

describe('briefs — purity (PIN E)', () => {
  it('same input ⇒ byte-identical output; input never mutated', () => {
    const world = realmWorld();
    const settlement = litSettlement();
    const frozenWorld = JSON.stringify(world);
    const frozenSettlement = JSON.stringify(settlement);
    const a = regionalBrief({ worldState: world, settlements: SETTLEMENTS, tick: 5 });
    const b = regionalBrief({ worldState: world, settlements: SETTLEMENTS, tick: 5 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    const p1 = playerSafeBrief({ settlement, worldState: world, tick: 5 });
    const p2 = playerSafeBrief({ settlement, worldState: world, tick: 5 });
    expect(JSON.stringify(p1)).toBe(JSON.stringify(p2));
    expect(JSON.stringify(world)).toBe(frozenWorld);
    expect(JSON.stringify(settlement)).toBe(frozenSettlement);
  });
});
