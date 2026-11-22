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
  'Bring Corvin Ashe of the black market in', // ALLEGIANCE-CAR4: a shape-2 card's goal TEXT (a pursuit naming a person)
  'npc_target_corvin',                // ... its keyed intent's target ID
  'Corvin Ashe',                      // ... the second card's name
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
    // ⚠ THE HOOK MOVED OFF THE SETTLEMENT ROOT (2026-08-11). It used to sit at
    // `settlement.plotHooks`, which no writer produces, so `hook_count` read 0 on
    // every fingerprint ever captured and this fixture was the only shape in which
    // it did not. It now sits at a live address the canonical collector walks.
    plotHooks: [{ text: 'A masked merchant seeks passage through the marsh.' }],
  }, {
    // ALLEGIANCE-CAR4 (shape 2): a card of the new shape — a fallback title, a ranked membership and a keyed goal whose
    // text and target must never leave; only the counts (rank, title class, intent family) may.
    id: 'npc_target_corvin', name: 'Corvin Ashe', importance: 'minor', title: 'the miller',
    memberships: [{ power: 'The Hidden Hand', rank: 2, share: 1 }],
    goal: { short: 'Bring Corvin Ashe of the black market in before the season is out.', long: 'Be free of the debt.',
      intent: { short: { family: 'ALLEGIANCE', kind: 'warrant', key: 'pursue_warrant', target: { kind: 'npc', id: 'npc_target_corvin' } },
        long: { family: 'TIES', kind: 'debtor', key: 'repay_debt', target: null } } },
  }],
  neighbourNetwork: [{ name: 'Greycairn', relationshipType: 'rival' }],
  history: 'Founded by exiles fleeing the Salt War, long ago.',
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
    expect(fp.npc_count).toBe(2);
    // hook_count is counted through the canonical collector. It read
    // `settlement.plotHooks || settlement.hooks` until 2026-08-11 — two keys no
    // writer produces on a settlement root — so it was 0 on every real capture.
    expect(fp.hook_count).toBe(1);
    expect(fp.npc_importance_dist).toEqual({ pillar: 1, minor: 1 });
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
    // ALLEGIANCE-CAR1 (2026-11-08, J-17): corrupt_count -> allegiance_count, re-keyed with the cause
    expect(fp.npc.allegiance_count).toBe(0);
    // anchored: fp.npc is the live block: allegiance_count is pinned on the line above
    expect(fp.npc).not.toHaveProperty('corrupt_count');
    // ALLEGIANCE-CAR4 (shape 2, the chair's row): the card's rank, the fallback-title count and the keyed goal's family
    // per vantage — counts and enums only; the shape is versioned so a research row tells old from new
    expect(fp.fingerprint_shape).toBe(2);
    expect(fp.npc.membership_rank_dist).toEqual({ unranked: 1, rank2: 1 });
    expect(fp.npc.fallback_title_count).toBe(1);
    expect(fp.npc.intent_family_dist).toEqual({ short: { ALLEGIANCE: 1 }, long: { TIES: 1 } });
    // anchored: fp.npc carries intent_family_dist, pinned on the line above with its two families
    expect(stableStringify(fp.npc), 'no kind, key or target leaves with the family').not.toMatch(/warrant|pursue_warrant|repay_debt|"target"/);
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
      prosperity: 'struggling', npc_count: 2, faction_count: 1,
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
