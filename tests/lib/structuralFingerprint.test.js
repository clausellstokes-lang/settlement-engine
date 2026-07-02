/**
 * structuralFingerprint.test.js — the privacy guarantee, as a test.
 *
 * The extractor is allowlist-based: it copies known-good enum/count paths only.
 * This is the canary that PROVES prose, names, and secrets cannot leak — a
 * fixture stuffed with distinctive sensitive strings is extracted, and every one
 * of those strings must be absent from the serialized output. If someone later
 * "improves" the extractor by spreading the settlement, this test fails loudly.
 * (Style precedent: the prompt-injection canaries.)
 */

import { describe, it, expect } from 'vitest';
import {
  extractReducedFingerprint,
  extractSettlementFingerprint,
  stableStringify,
  populationBand,
} from '../../src/lib/structuralFingerprint.js';

// A fixture loaded with sensitive strings that must NEVER appear in output.
const SENSITIVE = [
  'Blackmire Hollow',                 // settlement name
  'Seraphina Voss',                   // npc name
  'Spymaster of the council',         // npc role (free text)
  'paranoid and cunning',             // npc personality
  'seize the council by midwinter',   // npc goal
  'poisoned the late mayor',          // npc SECRET
  'The Hidden Hand',                  // faction name / affiliation
  'The Drowned Tankard',             // institution name
  'fleeing the Salt War',             // history prose
  'A masked merchant seeks passage',  // plot hook prose
  'private DM notes about betrayal',  // dossier notes
  'A town built on buried secrets',   // thesis prose
  'Voss family heirloom daggers',     // user-authored trade good (ADD_TRADE_GOOD)
  'Blackmire ancestor ash',           // user-authored trade good, entrepôt form
  'voss_family_heirloom_daggers',     // its custom.<slug> id form must not leak either
];

const settlement = {
  name: 'Blackmire Hollow',
  tier: 'town',
  population: 3200,
  schemaVersion: '5',
  generatorVersion: 'g1',
  _seed: 'seed-xyz',
  config: { culture: 'germanic', terrainType: 'swamp', tradeRouteAccess: 'river', magicLevel: 'low', monsterThreat: 'frontier', selectedStresses: ['famine_risk'] },
  economicState: {
    prosperity: 'struggling',
    foodSecurity: { resilienceScore: 40 },
    // Catalog labels PLUS user-authored goods, exactly as ADD_TRADE_GOOD writes
    // them (verbatim label; entrepôt takes the ' (transit)' suffixed form).
    primaryExports: ['salt', 'Voss family heirloom daggers', 'Blackmire ancestor ash (transit)'],
    primaryImports: ['grain', { label: 'Voss family heirloom daggers' }], // legacy object entry
  },
  powerStructure: {
    publicLegitimacy: { score: 30, label: 'Contested' },
    factions: [{ faction: 'The Hidden Hand', name: 'The Hidden Hand', category: 'criminal', power: 70 }],
    conflicts: [],
  },
  defenseProfile: { scores: { military: 40, monster: 30, internal: 20, economic: 50, magical: 10 }, readiness: { label: 'Underprepared' } },
  activeConditions: [{ archetype: 'famine_risk', severity: 0.6, status: 'active', affectedSystems: ['food_security'] }],
  institutions: [{ id: 'i1', name: 'The Drowned Tankard', category: 'tavern' }],
  npcs: [{
    id: 'n1', name: 'Seraphina Voss', importance: 'pillar', role: 'Spymaster of the council',
    personality: 'paranoid and cunning', goal: 'seize the council by midwinter',
    secret: 'poisoned the late mayor', factionAffiliation: 'The Hidden Hand',
  }],
  neighbourNetwork: [{ name: 'Greycairn', relationshipType: 'rival' }],
  history: 'Founded by exiles fleeing the Salt War, long ago.',
  plotHooks: [{ text: 'A masked merchant seeks passage through the marsh.' }],
  dossierNotes: 'private DM notes about betrayal',
  thesis: 'A town built on buried secrets',
};

const save = {
  campaignState: {
    phase: 'canon',
    eventLog: [{ event: { id: 'e1' } }],
    // NPC sim-state (campaign worldState) — exercises npcDistributions' evolution
    // block. The block reads ONLY the enum fields; the name/personality/secret
    // here MUST NOT leak (they are in SENSITIVE).
    worldState: {
      npcStates: {
        n1: { settlementId: 's-test', roleArchetype: 'heir', dotRank: 2, factionSeat: 'lieutenant_operator', shortGoal: 'secure_office', longGoal: 'expand_influence', ousted: true, name: 'Seraphina Voss', personality: 'paranoid and cunning', secret: 'poisoned the late mayor' },
        n2: { settlementId: 's-test', roleArchetype: 'criminal', dotRank: 1, factionSeat: 'agent_protege', shortGoal: 'profit_from_change', longGoal: 'control_institution', ousted: false },
      },
    },
  },
  versionHistory: [{ id: 'v1' }],
  aiData: { aiSettlement: { thesis: 'A town built on buried secrets' }, aiDailyLife: null, narrativeMode: 'raw' },
};

function assertNoLeak(obj) {
  const json = stableStringify(obj);
  for (const s of SENSITIVE) {
    expect(json).not.toContain(s);
  }
  return json;
}

describe('structuralFingerprint — redaction canary', () => {
  it('the FULL fingerprint leaks no names, prose, or secrets', () => {
    const fp = extractSettlementFingerprint(settlement, save);
    assertNoLeak(fp);
  });

  it('the REDUCED fingerprint leaks no names, prose, or secrets', () => {
    const fp = extractReducedFingerprint(settlement);
    assertNoLeak(fp);
  });

  it('still captures the structural signal (it is not just empty)', () => {
    const fp = extractSettlementFingerprint(settlement, save);
    expect(fp.tier).toBe('town');
    expect(fp.population_band).toBe('town_2k_10k');
    expect(fp.config.culture).toBe('germanic');
    expect(fp.power.factions).toHaveLength(1);
    expect(fp.power.factions[0]).toEqual({ idx: 'f0', category: 'criminal', power_band: 'b3' });
    expect(fp.npc_count).toBe(1);
    expect(fp.npc_importance_dist).toEqual({ pillar: 1 });
    expect(fp.institutions_by_category).toEqual({ tavern: 1 });
    expect(fp.conditions[0]).toMatchObject({ archetype: 'famine_risk', status: 'active', severityBand: 'high' });
    expect(fp.neighbours).toEqual(['rival']);
    expect(fp.lifecycle.phase).toBe('canon');
    expect(fp.ai.has_narrative).toBe(true);
    expect(Object.keys(fp.causal.bands).length).toBeGreaterThan(0);
  });

  it('trade lists emit canonical catalog ids only; user-authored goods are counted, not copied', () => {
    const fp = extractSettlementFingerprint(settlement, save);
    // catalog labels fold to stable catalog ids
    expect(fp.economy.primaryExports).toEqual(['salt']);
    expect(fp.economy.primaryImports).toEqual(['grain']);
    // the user-authored entries (string, transit-suffixed, legacy object) are
    // counted — their labels/slugs never appear (assertNoLeak covers the text)
    expect(fp.economy.custom_export_count).toBe(2);
    expect(fp.economy.custom_import_count).toBe(1);
  });

  it('the NPC sim-state evolution distributions populate (enums only, no prose)', () => {
    const fp = extractSettlementFingerprint(settlement, save);
    // generation-roster sub-block (settlement.npcs)
    expect(fp.npc.corrupt_count).toBe(0);
    // sim-state evolution sub-block (campaign worldState.npcStates)
    expect(fp.npc.role_archetype_dist).toEqual({ heir: 1, criminal: 1 });
    expect(fp.npc.seat_dist).toEqual({ lieutenant_operator: 1, agent_protege: 1 });
    expect(fp.npc.dotrank_dist).toEqual({ 1: 1, 2: 1 });
    expect(fp.npc.goal_dist).toMatchObject({ secure_office: 1, expand_influence: 1, profit_from_change: 1, control_institution: 1 });
    expect(fp.npc.ousted_count).toBe(1);
  });

  it('npcDistributions filters sim-state to the requested settlement', () => {
    const states = save.campaignState.worldState.npcStates;
    const only = extractSettlementFingerprint(settlement, save, { npcStates: states, settlementUuid: 's-test' });
    expect(only.npc.role_archetype_dist).toEqual({ heir: 1, criminal: 1 });
    const none = extractSettlementFingerprint(settlement, save, { npcStates: states, settlementUuid: 'other-settlement' });
    expect(none.npc.role_archetype_dist).toBeUndefined(); // no states for this settlement → evolution block omitted
  });

  it('the reduced fingerprint carries the essential enums + counts', () => {
    const fp = extractReducedFingerprint(settlement);
    expect(fp).toMatchObject({
      tier: 'town', population_band: 'town_2k_10k', culture: 'germanic',
      prosperity: 'struggling', npc_count: 1, faction_count: 1,
      institution_count: 1, condition_count: 1,
    });
  });

  it('population banding boundaries', () => {
    expect(populationBand(50)).toBe('hamlet_lt100');
    expect(populationBand(300)).toBe('village_100_500');
    expect(populationBand(1500)).toBe('small_town_500_2k');
    expect(populationBand(5000)).toBe('town_2k_10k');
    expect(populationBand(50000)).toBe('city_gt_10k');
  });

  it('handles a null/garbage settlement without throwing', () => {
    expect(extractReducedFingerprint(null)).toBeNull();
    expect(extractSettlementFingerprint(undefined)).toBeNull();
    expect(() => extractSettlementFingerprint({})).not.toThrow();
  });
});
