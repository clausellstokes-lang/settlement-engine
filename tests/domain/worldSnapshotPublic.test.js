/** @vitest-environment node */
import { describe, expect, test } from 'vitest';

import {
  serializeWorldSnapshotPublic,
  WORLD_SNAPSHOT_PUBLIC_SCHEMA_VERSION,
  WORLD_SNAPSHOT_HARD_DENY,
} from '../../src/domain/display/worldSnapshotPublic.js';

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY-CRITICAL public serializer — the realm-scoped sibling of toPublicSafe.
//
// Proves the ALLOWLIST + HARD-DENY contract: even with EVERY section enabled and a
// fully-loaded DM-private worldState, no denied key, no covert channel, no rng seed,
// no roll/dice prose, and no pause cursor (which embeds a full pre-tick world) ever
// reaches the public snapshot; only `visibility === 'public'` channels survive; and
// section-gating includes a section ONLY when its opt-in key is on.
// ═══════════════════════════════════════════════════════════════════════════════

/** A worst-case worldState: every HARD-DENY ledger is populated with poison, plus
 *  a public + covert war front, a flipped trade prize, disposition stats, a
 *  pantheon, simulation rules, and a chronicle carrying rollExplanations. */
function poisonWorldState() {
  return {
    schemaVersion: 1,
    tick: 7,
    calendar: { elapsedMonths: 7, month: 8, year: 1, season: 'autumn' },
    rngSeed: 'world-pulse:SECRET-SEED-DO-NOT-LEAK',
    volatility: 'turbulent',
    simulationRules: {
      presetId: 'dramatic_campaign', propagationMode: 'full', intensity: 'dramatic', migrationMode: 'distributed',
      warLayerEnabled: true, religionDynamicsEnabled: true,
    },
    // ── HARD-DENY ledgers (all carry secrets that must NEVER leak) ──────────────
    npcStates: { 'npc:aldric': { goal: 'seize the throne', secret: 'is the bastard heir', covert: true } },
    factionStates: { 'fac:cabal': { scheme: 'assassinate the duke', covert: true } },
    relationshipStates: { 'a:b': { relationshipType: 'hostile', secret: 'blackmail' } },
    pendingEvents: [{ id: 'pe1', type: 'plague', secret: 'planted by the cult' }],
    proposals: [{ id: 'prop1', headline: 'unrevealed plot', summary: 'DM has not surfaced this' }],
    stressors: [{ id: 's1', kind: 'famine', prose: 'whispered dread', rollExplanation: 'd20=3 vs DC 15' }],
    settlementTickStates: { 'set:1': { hiddenScore: 0.42, covert: true } },
    pausedAdvance: {
      interval: 'one_year', ticksTotal: 48, ticksDone: 3, resumeTick: 3,
      preSnapshot: { worldState: { rngSeed: 'LEAK', npcStates: {} }, regionalGraph: {}, saves: [] },
      pendingMajors: [{ id: 'm1', secret: 'true' }],
    },
    deferredImpacts: [{ id: 'di1', covert: true }],
    deferredWarFronts: [{ instigatorId: 'x', targetId: 'y', covert: true }],
    // ── Public-derivable ledgers ────────────────────────────────────────────────
    dispositionStats: { warhawk: { wins: 3, losses: 1, score: 2 }, forge: { wins: 0, losses: 0 } },
    tradeWarState: {
      'warhawk:iron': { winnerId: 'forge', incumbentId: 'oldforge', lastFlipTick: 4 },
      'town:salt': { winnerId: 'mine' }, // never flipped → excluded
    },
    pantheon: {
      'deity:Vael': { tier: 'major', seats: 5, wins: 6, losses: 1 },
      'deity:Morr': { tier: 'cult', seats: 0, wins: 0, losses: 3 },
    },
    pulseHistory: [
      {
        tick: 7,
        selectedOutcomes: [{
          id: 'o1', headline: 'Warhawk marches on Forge', summary: 'An army sets out.',
          applyMode: 'auto',
          targetSaveId: 'forge', rollExplanation: 'd20=18 + 4 = 22 vs DC 12', candidateId: 'cand:secret',
          populationDeltas: { forge: -200 },
        }],
        impactDigest: [{ kind: 'applied', settlementIds: ['warhawk', 'forge'] }],
      },
    ],
  };
}

/** A graph with a PUBLIC war_front (warhawk→forge), a COVERT/gm war_front
 *  (secret→forge), a public trade_dependency carrying the commodity label, and a
 *  gm + hidden information_flow channel that must be filtered out. */
function poisonGraph() {
  return {
    channels: [
      { id: 'wf-pub', type: 'war_front', from: 'warhawk', to: 'forge', status: 'confirmed', visibility: 'public', strength: 0.8 },
      { id: 'wf-gm', type: 'war_front', from: 'secret', to: 'forge', status: 'confirmed', visibility: 'gm', strength: 0.7 },
      { id: 'td-pub', type: 'trade_dependency', from: 'forge', to: 'warhawk', status: 'confirmed', visibility: 'public', strength: 0.6, goods: [{ id: 'iron', label: 'Iron' }] },
      { id: 'crim-gm', type: 'criminal_corridor', from: 'forge', to: 'warhawk', status: 'confirmed', visibility: 'gm', strength: 0.9, explanation: 'smuggling ring detail' },
      { id: 'info-hidden', type: 'information_flow', from: 'a', to: 'b', status: 'confirmed', visibility: 'hidden', strength: 0.4 },
    ],
  };
}

const MEMBERS = [
  { id: 'warhawk', settlement: { name: 'Warhawk' } },
  { id: 'forge', settlement: { name: 'Forgeholt' } },
  { id: 'secret', settlement: { name: 'Shadowvale' } },
];

const ALL_SECTIONS = Object.freeze({
  worldClock: true, chronicle: true, pantheon: true, warNetwork: true, dashboard: true,
});

/** Recursively collect every object key present anywhere in a value. */
function allKeys(value, acc = new Set()) {
  if (Array.isArray(value)) { for (const v of value) allKeys(v, acc); return acc; }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) { acc.add(k); allKeys(v, acc); }
  }
  return acc;
}

/** Recursively collect every string value present anywhere in a value. */
function allStrings(value, acc = []) {
  if (Array.isArray(value)) { for (const v of value) allStrings(v, acc); return acc; }
  if (value && typeof value === 'object') { for (const v of Object.values(value)) allStrings(v, acc); return acc; }
  if (typeof value === 'string') acc.push(value);
  return acc;
}

describe('serializeWorldSnapshotPublic — HARD-DENY (every section enabled)', () => {
  const out = serializeWorldSnapshotPublic(poisonWorldState(), poisonGraph(), MEMBERS, ALL_SECTIONS);
  const keys = allKeys(out);
  const strings = allStrings(out).join('\n');

  test('is versioned + serializable to plain JSON', () => {
    expect(out.schemaVersion).toBe(WORLD_SNAPSHOT_PUBLIC_SCHEMA_VERSION);
    expect(() => JSON.parse(JSON.stringify(out))).not.toThrow();
    expect(JSON.parse(JSON.stringify(out))).toEqual(out);
  });

  test('every HARD-DENY key is absent anywhere in the output', () => {
    for (const denied of WORLD_SNAPSHOT_HARD_DENY) {
      expect(keys.has(denied)).toBe(false);
    }
    // Belt-and-suspenders explicit list (independent of the exported constant).
    for (const denied of [
      'npcStates', 'factionStates', 'relationshipStates', 'pendingEvents', 'proposals',
      'stressors', 'pausedAdvance', 'settlementTickStates', 'rngSeed',
      'deferredImpacts', 'deferredWarFronts', 'preSnapshot', 'pendingMajors',
    ]) {
      expect(keys.has(denied)).toBe(false);
    }
  });

  test('no rng seed / roll-explanation / dice prose / covert string leaks', () => {
    expect(strings).not.toContain('SECRET-SEED');
    expect(strings).not.toContain('rollExplanation');
    expect(strings).not.toMatch(/d20=/);
    expect(strings).not.toContain('seize the throne');
    expect(strings).not.toContain('bastard heir');
    expect(strings).not.toContain('assassinate the duke');
    expect(strings).not.toContain('unrevealed plot');
    expect(strings).not.toContain('whispered dread');
    expect(strings).not.toContain('cand:secret');
    expect(strings).not.toContain('smuggling ring detail');
    // No 'covert' key survives anywhere.
    expect(keys.has('covert')).toBe(false);
  });

  test('the public chronicle keeps headlines + affected ids/names, strips the rest', () => {
    expect(Array.isArray(out.chronicle)).toBe(true);
    expect(out.chronicle).toHaveLength(1);
    const entry = out.chronicle[0];
    expect(entry.tick).toBe(7);
    expect(entry.headlines[0].headline).toBe('Warhawk marches on Forge');
    expect(entry.headlines[0].summary).toBe('An army sets out.');
    // affected ids/names present; NO rollExplanation / candidateId on the headline.
    expect(entry.affectedSettlementIds).toEqual(['forge', 'warhawk']);
    expect(entry.affectedSettlementNames).toEqual(['Forgeholt', 'Warhawk']);
    expect(allKeys(entry).has('rollExplanation')).toBe(false);
    expect(allKeys(entry).has('candidateId')).toBe(false);
    expect(allKeys(entry).has('populationDeltas')).toBe(false);
  });
});

describe('serializeWorldSnapshotPublic — only PUBLIC channels survive', () => {
  const out = serializeWorldSnapshotPublic(poisonWorldState(), poisonGraph(), MEMBERS, ALL_SECTIONS);

  test('warNetwork.channels contains only visibility=public channels', () => {
    const ids = out.warNetwork.channels.map((/** @type {any} */ c) => c.id).sort();
    expect(ids).toEqual(['td-pub', 'wf-pub']);
    // gm + hidden channel ids must be absent.
    for (const c of out.warNetwork.channels) {
      expect(c.id).not.toBe('wf-gm');
      expect(c.id).not.toBe('crim-gm');
      expect(c.id).not.toBe('info-hidden');
    }
  });

  test('sieges are built only from PUBLIC war fronts (the gm front is dropped)', () => {
    expect(out.warNetwork.sieges).toHaveLength(1);
    const siege = out.warNetwork.sieges[0];
    expect(siege.targetId).toBe('forge');
    expect(siege.targetName).toBe('Forgeholt');
    // Only the public besieger (warhawk) — the gm besieger (secret/Shadowvale) is gone.
    expect(siege.coalition).toEqual(['warhawk']);
    expect(siege.coalitionNames).toEqual(['Warhawk']);
    expect(siege.coalition).not.toContain('secret');
  });

  test('trade-war + disposition aggregates surface only flipped/non-zero records as ids+names', () => {
    expect(out.warNetwork.tradeWars).toHaveLength(1); // town:salt never flipped → excluded
    expect(out.warNetwork.tradeWars[0].winnerName).toBe('Forgeholt');
    expect(out.warNetwork.tradeWars[0].commodityLabel).toBe('Iron');
    expect(out.warNetwork.dispositions).toHaveLength(1); // forge 0/0 excluded
    expect(out.warNetwork.dispositions[0].id).toBe('warhawk');
    expect(out.warNetwork.dispositions[0].name).toBe('Warhawk');
  });
});

describe('serializeWorldSnapshotPublic — allowed public sections', () => {
  const out = serializeWorldSnapshotPublic(poisonWorldState(), poisonGraph(), MEMBERS, ALL_SECTIONS);

  test('worldClock is scalar tick + calendar only', () => {
    expect(out.worldClock).toEqual({
      tick: 7,
      calendar: { elapsedMonths: 7, month: 8, year: 1, season: 'autumn' },
    });
  });

  test('pantheon carries only public deity fields', () => {
    expect(out.pantheon).toEqual([
      { deityId: 'deity:Morr', name: 'Morr', tier: 'cult', seats: 0, wins: 0, losses: 3 },
      { deityId: 'deity:Vael', name: 'Vael', tier: 'major', seats: 5, wins: 6, losses: 1 },
    ]);
  });

  test('dashboard carries the simulationRules subset + a derived realm-arc summary', () => {
    expect(out.dashboard.simulationRules).toEqual({
      presetId: 'dramatic_campaign', propagationMode: 'full', intensity: 'dramatic', migrationMode: 'distributed',
    });
    // The private rule keys (warLayerEnabled etc.) are NOT in the allowlisted subset.
    expect(out.dashboard.simulationRules.warLayerEnabled).toBeUndefined();
    expect(Array.isArray(out.dashboard.realmArcLines)).toBe(true);
    expect(out.dashboard.realmArcLines.join(' ')).toContain('The Ascendancy of Vael');
    expect(out.dashboard.realmArcLines.join(' ')).toContain('The War of Forgeholt');
  });
});

describe('serializeWorldSnapshotPublic — section gating', () => {
  const ws = poisonWorldState();
  const graph = poisonGraph();

  test('a disabled section is absent; an enabled one is present', () => {
    const onlyClock = serializeWorldSnapshotPublic(ws, graph, MEMBERS, { worldClock: true });
    expect(onlyClock.worldClock).toBeDefined();
    expect(onlyClock.chronicle).toBeUndefined();
    expect(onlyClock.pantheon).toBeUndefined();
    expect(onlyClock.warNetwork).toBeUndefined();
    expect(onlyClock.dashboard).toBeUndefined();
  });

  test('each section key gates exactly its own block', () => {
    for (const key of ['worldClock', 'chronicle', 'pantheon', 'warNetwork', 'dashboard']) {
      const out = serializeWorldSnapshotPublic(ws, graph, MEMBERS, { [key]: true });
      expect(out[key]).toBeDefined();
      for (const other of ['worldClock', 'chronicle', 'pantheon', 'warNetwork', 'dashboard']) {
        if (other !== key) expect(out[other]).toBeUndefined();
      }
    }
  });

  test('no opts → only the version envelope (no section leaks by default)', () => {
    const out = serializeWorldSnapshotPublic(ws, graph, MEMBERS, {});
    expect(out.schemaVersion).toBe(WORLD_SNAPSHOT_PUBLIC_SCHEMA_VERSION);
    expect(Object.keys(out).sort()).toEqual(['schemaVersion', 'sourceWorldStateSchemaVersion']);
  });

  test('HARD-DENY holds even with all sections on AND covert opt-in attempts ignored', () => {
    // There is no covert/full opt-in; passing bogus opts must not widen exposure.
    const out = serializeWorldSnapshotPublic(ws, graph, MEMBERS, {
      ...ALL_SECTIONS, includeCovert: true, full: true, includePrivate: true,
    });
    const keys = allKeys(out);
    for (const denied of WORLD_SNAPSHOT_HARD_DENY) expect(keys.has(denied)).toBe(false);
    expect(keys.has('covert')).toBe(false);
    expect(allStrings(out).join('\n')).not.toContain('SECRET-SEED');
  });
});

describe('serializeWorldSnapshotPublic: chronicle player-visibility gate (finding 1)', () => {
  // A pulse whose selectedOutcomes carries BOTH a surfaced auto-applied outcome and
  // an un-surfaced PROPOSAL (the DM-private plot + NPC goal). Only the auto one may
  // reach the public chronicle.
  function ws() {
    return {
      schemaVersion: 1,
      pulseHistory: [{
        tick: 3,
        selectedOutcomes: [
          {
            id: 'auto1', applyMode: 'auto',
            headline: 'The harvest fails in Forgeholt', summary: 'Granaries run low.',
            targetSaveId: 'forge',
          },
          {
            id: 'prop1', applyMode: 'proposal',
            headline: 'Aldric plots to seize the throne',
            summary: 'A DM-private proposal the players have never seen: the bastard heir moves against the duke.',
            targetSaveId: 'warhawk', populationDeltas: { warhawk: -50 },
          },
        ],
      }],
    };
  }

  test('a proposal (un-surfaced, DM-private) outcome is dropped; only auto-applied surfaces', () => {
    const out = serializeWorldSnapshotPublic(ws(), {}, MEMBERS, { chronicle: true });
    expect(out.chronicle).toHaveLength(1);
    const entry = out.chronicle[0];
    expect(entry.headlines).toHaveLength(1);
    expect(entry.headlines[0].headline).toBe('The harvest fails in Forgeholt');
    // The proposal's private plot, NPC goal, and its affected id never leak.
    const strings = allStrings(out).join('\n');
    expect(strings).not.toContain('seize the throne');
    expect(strings).not.toContain('bastard heir');
    expect(strings).not.toContain('DM-private proposal');
    // The proposal's populationDeltas key (warhawk) is not folded into affected ids
    // from this outcome (only the auto outcome's target survives).
    expect(entry.affectedSettlementIds).toEqual(['forge']);
  });

  test('an outcome with no applyMode is treated as not-surfaced and dropped', () => {
    const bare = {
      schemaVersion: 1,
      pulseHistory: [{ tick: 1, selectedOutcomes: [{ id: 'x', headline: 'Ambiguous', summary: '' }] }],
    };
    const out = serializeWorldSnapshotPublic(bare, {}, MEMBERS, { chronicle: true });
    // The tick slot still exists (the headline gate runs per-outcome) but carries no headlines.
    expect(out.chronicle[0].headlines).toEqual([]);
  });
});

describe('serializeWorldSnapshotPublic: DM-approved proposals surface in the chronicle (regression)', () => {
  // REGRESSION: applyWorldPulseProposal flips the PROPOSAL ROW to status='applied'
  // but never rewrites the original selectedOutcomes entry, which keeps
  // applyMode='proposal' forever. An applyMode-only gate therefore PERMANENTLY HIDES
  // the realm's most significant approved events (government changes, conquests,
  // diplomatic relabels). The applied-proposal id set must re-admit them; a still
  // pending/dismissed proposal must stay hidden; a digest proposal must not leak.
  function ws() {
    return {
      schemaVersion: 1,
      // The applied + pending + dismissed proposal ROWS (the source of truth the
      // outcome entries are never rewritten to match).
      proposals: [
        { id: 'prop-applied', status: 'applied', outcome: { id: 'approved1' } },
        { id: 'prop-pending', status: 'pending', outcome: { id: 'pending1' } },
        { id: 'prop-dismissed', status: 'dismissed', outcome: { id: 'dismissed1' } },
      ],
      pulseHistory: [{
        tick: 5,
        selectedOutcomes: [
          {
            // DM-APPROVED proposal — its row is status='applied' but the entry still
            // reads applyMode='proposal'. MUST surface.
            id: 'approved1', applyMode: 'proposal',
            headline: 'The crown of Forgeholt changes hands', summary: 'A new government takes the seat.',
            targetSaveId: 'forge',
          },
          {
            // Still pending — DM has not approved it. MUST stay hidden.
            id: 'pending1', applyMode: 'proposal',
            headline: 'A pending plot the players have not seen', summary: 'Unrevealed scheming.',
            targetSaveId: 'warhawk', populationDeltas: { warhawk: -50 },
          },
          {
            // Dismissed — never surfaced. MUST stay hidden.
            id: 'dismissed1', applyMode: 'proposal',
            headline: 'A dismissed proposal', summary: 'Cut from the canon.',
            targetSaveId: 'secret',
          },
        ],
        impactDigest: [
          // An APPROVED proposal's digest news row carries kind='applied' (newsEntry-
          // ForOutcome stamps 'applied' on approval), so it surfaces its ids...
          { id: 'wizard_news.7.world_pulse.applied.approved1', kind: 'applied', settlementIds: ['forge'] },
          // ...but a PENDING proposal's row is kind='queued' and must NOT leak its ids.
          { id: 'wizard_news.7.world_pulse.proposal.pending1', kind: 'queued', settlementIds: ['warhawk', 'secret'] },
        ],
      }],
    };
  }

  test('an approved proposal (row status=applied) surfaces; pending/dismissed do not', () => {
    const out = serializeWorldSnapshotPublic(ws(), {}, MEMBERS, { chronicle: true });
    expect(out.chronicle).toHaveLength(1);
    const entry = out.chronicle[0];
    const headlines = entry.headlines.map((/** @type {any} */ h) => h.headline);
    expect(headlines).toEqual(['The crown of Forgeholt changes hands']);
    const strings = allStrings(out).join('\n');
    expect(strings).not.toContain('pending plot');
    expect(strings).not.toContain('dismissed proposal');
  });

  test('the approved-proposal digest surfaces ids; a pending-proposal digest does not leak', () => {
    const out = serializeWorldSnapshotPublic(ws(), {}, MEMBERS, { chronicle: true });
    const entry = out.chronicle[0];
    // 'forge' from the approved outcome target + its approved digest entry; the
    // pending digest's 'warhawk'/'secret' must be absent.
    expect(entry.affectedSettlementIds).toEqual(['forge']);
    expect(entry.affectedSettlementIds).not.toContain('warhawk');
    expect(entry.affectedSettlementIds).not.toContain('secret');
  });
});

describe('serializeWorldSnapshotPublic: deferredPartyImpacts is HARD-DENIED', () => {
  test('deferredPartyImpacts is in the frozen HARD-DENY array and never serializes', () => {
    expect(WORLD_SNAPSHOT_HARD_DENY).toContain('deferredPartyImpacts');
    const ws = {
      schemaVersion: 1,
      deferredPartyImpacts: [{ id: 'dpi1', secret: 'queued party fallout', covert: true }],
    };
    const out = serializeWorldSnapshotPublic(ws, {}, MEMBERS, ALL_SECTIONS);
    expect(allKeys(out).has('deferredPartyImpacts')).toBe(false);
    expect(allStrings(out).join('\n')).not.toContain('queued party fallout');
  });
});

describe('serializeWorldSnapshotPublic: trade-war name resolution (finding 2)', () => {
  // A prizeId that is the SLUG form (lowercased / non-alnum → underscore) while the
  // real ids carry capitals + punctuation. Splitting the slug would render slug
  // names; reading the persisted buyerId/commodityId renders real names.
  const SLUG_MEMBERS = [
    { id: 'Warhawk-7', settlement: { name: 'Warhawk Keep' } },
    { id: 'Forge.Holt', settlement: { name: 'Forgeholt' } },
  ];
  function ws() {
    return {
      schemaVersion: 1,
      tradeWarState: {
        // prizeId is the slug; buyerId/commodityId are the real ids the ledger now persists.
        warhawk_7: { winnerId: 'Forge.Holt', incumbentId: 'old', buyerId: 'Warhawk-7', commodityId: 'iron', lastFlipTick: 4 },
      },
    };
  }

  test('buyer name resolves from the persisted real id, not the slugged prizeId', () => {
    const out = serializeWorldSnapshotPublic(ws(), {}, SLUG_MEMBERS, { warNetwork: true });
    expect(out.warNetwork.tradeWars).toHaveLength(1);
    const tw = out.warNetwork.tradeWars[0];
    expect(tw.buyerId).toBe('Warhawk-7');
    expect(tw.buyerName).toBe('Warhawk Keep');     // NOT the slug 'warhawk_7'
    expect(tw.winnerName).toBe('Forgeholt');
    // The slug must not be the rendered buyer name.
    expect(tw.buyerName).not.toBe('warhawk_7');
  });
});

describe('serializeWorldSnapshotPublic: affected ids exclude powerTransfer names (finding 3)', () => {
  // powerTransfer.losers carries display NAMES, not save ids. They must not pollute
  // affectedSettlementIds / Names.
  function ws() {
    return {
      schemaVersion: 1,
      pulseHistory: [{
        tick: 2,
        selectedOutcomes: [{
          id: 'pt1', applyMode: 'auto',
          headline: 'A power transfer', summary: 'The crown changes hands.',
          targetSaveId: 'forge',
          populationDeltas: { warhawk: -10 },
          // These are DISPLAY NAMES, not ids, so they must be ignored.
          powerTransfer: { losers: ['Shadowvale', 'The Free City of Brindle'] },
        }],
      }],
    };
  }

  test('powerTransfer.losers display names never enter affected ids/names', () => {
    const out = serializeWorldSnapshotPublic(ws(), {}, MEMBERS, { chronicle: true });
    const entry = out.chronicle[0];
    // Only genuine ids: targetSaveId + populationDeltas keys.
    expect(entry.affectedSettlementIds).toEqual(['forge', 'warhawk']);
    expect(entry.affectedSettlementIds).not.toContain('Shadowvale');
    expect(entry.affectedSettlementIds).not.toContain('The Free City of Brindle');
    expect(entry.affectedSettlementNames).not.toContain('The Free City of Brindle');
  });
});

describe('serializeWorldSnapshotPublic — purity + tolerance', () => {
  test('does not mutate its inputs', () => {
    const ws = poisonWorldState();
    const graph = poisonGraph();
    const wsCopy = JSON.parse(JSON.stringify(ws));
    const graphCopy = JSON.parse(JSON.stringify(graph));
    serializeWorldSnapshotPublic(ws, graph, MEMBERS, ALL_SECTIONS);
    expect(ws).toEqual(wsCopy);
    expect(graph).toEqual(graphCopy);
  });

  test('is deterministic — identical inputs yield identical output', () => {
    const a = serializeWorldSnapshotPublic(poisonWorldState(), poisonGraph(), MEMBERS, ALL_SECTIONS);
    const b = serializeWorldSnapshotPublic(poisonWorldState(), poisonGraph(), MEMBERS, ALL_SECTIONS);
    expect(a).toEqual(b);
  });

  test('a dormant/empty realm serializes to its empty shape, never throws', () => {
    const out = serializeWorldSnapshotPublic({}, {}, [], ALL_SECTIONS);
    expect(out.schemaVersion).toBe(WORLD_SNAPSHOT_PUBLIC_SCHEMA_VERSION);
    expect(out.pantheon).toEqual([]);
    expect(out.chronicle).toEqual([]);
    expect(out.warNetwork.sieges).toEqual([]);
    expect(out.warNetwork.tradeWars).toEqual([]);
    expect(out.warNetwork.dispositions).toEqual([]);
    expect(out.warNetwork.channels).toEqual([]);
    expect(out.dashboard.realmArcLines).toEqual([]);
  });

  test('tolerates null/undefined inputs', () => {
    expect(() => serializeWorldSnapshotPublic(null, null, null, null)).not.toThrow();
    const out = serializeWorldSnapshotPublic(null, undefined, undefined, undefined);
    expect(out.schemaVersion).toBe(WORLD_SNAPSHOT_PUBLIC_SCHEMA_VERSION);
  });
});
