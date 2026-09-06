/**
 * factionStructuralOfficeCoverage.test.js — [generators-domain-2].
 *
 * The structural-NPC resolver must synthesize a placeholder leader ONLY for an
 * office no realized NPC already holds, and must dedup by OFFICE-EQUIVALENCE
 * (role-KEY / archetype), not by exact role string. Before the fix,
 * `ensureFactionStructuralNpcs` walked the NPC-grouping list (which classifies as
 * 'other') and deduped on exact role + faction id, so it synthesized DUPLICATES
 * beside realized leaders (e.g. "The Watch Captain" beside a "Guard Captain") AND
 * missed genuinely-unled offices. The fix reads the authoritative
 * powerStructure.factions seats and dedups by role-key.
 *
 * Probe cases from the register:
 *   A. ordinary town — no 'The Watch Captain' beside a realized guard captain.
 *   B. a genuinely-uncovered office still gets its placeholder.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { ensureFactionStructuralNpcs } from '../../src/generators/factionRoles.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });

describe('generators-domain-2 — structural-NPC office coverage', () => {
  it('PROBE A — never synthesizes a Watch Captain beside a realized guard captain (full pipeline sweep)', () => {
    const terrains = ['plains', 'mountain', 'coastal', 'desert', 'forest', 'hills', 'riverside'];
    let sawGuardCaptainSettlements = 0;
    for (const terrainOverride of terrains) {
      for (const s of ['gm-a', 'gm-b', 'gm-c', 'gm-d']) {
        const settlement = gen({ settType: 'town', terrainOverride }, s);
        const npcs = settlement.npcs || [];
        const hasGuardCaptain = npcs.some((n) => n.role === 'Guard Captain');
        if (!hasGuardCaptain) continue;
        sawGuardCaptainSettlements++;
        const synthWatch = npcs.filter(
          (n) => n.generatedAs === 'faction_structural' && n.role === 'Watch Captain',
        );
        expect(
          synthWatch,
          `${terrainOverride}|${s} synthesized a Watch Captain beside a realized Guard Captain`,
        ).toHaveLength(0);
      }
    }
    // The sweep must actually exercise the guard-captain-present case, or the
    // assertion is vacuous.
    expect(sawGuardCaptainSettlements).toBeGreaterThan(0);
  });

  it('office-equivalence — a realized Guard Captain covers the watch office (no Watch Captain placeholder)', () => {
    const out = ensureFactionStructuralNpcs({
      tier: 'town',
      institutions: [],
      powerStructure: { factions: [{ faction: 'Military/Guard', category: 'military' }] },
      npcs: [{ id: 'npc_1', role: 'Guard Captain', factionAffiliation: 'Military/Guard' }],
    });
    const synth = (out.npcs || []).filter((n) => n.generatedAs === 'faction_structural');
    expect(synth).toHaveLength(0);
  });

  it('PROBE B — a genuinely-uncovered office still gets its placeholder', () => {
    const out = ensureFactionStructuralNpcs({
      tier: 'town',
      institutions: [{ id: 'inst_temple', name: 'Grand Temple' }],
      powerStructure: { factions: [{ faction: 'Religious Authorities', category: 'religious' }] },
      npcs: [{ id: 'npc_1', role: 'Mayor', factionAffiliation: 'Elected Reeve' }], // no religious NPC
    });
    const synth = (out.npcs || []).filter((n) => n.generatedAs === 'faction_structural');
    expect(synth.length).toBeGreaterThan(0);
    const priest = synth.find((n) => n.role === 'High Priestess');
    expect(priest).toBeTruthy();
    // Stamped: belongs to its seat and links the temple institution.
    expect(priest.factionAffiliation).toBe('Religious Authorities');
    expect(priest.linkedFactionIds).toEqual(['Religious Authorities']);
    expect(priest.linkedInstitutionIds).toContain('inst_temple');
  });

  it('a realized office-holder under a DIFFERENT role name suppresses the placeholder (Deacon covers temple)', () => {
    const out = ensureFactionStructuralNpcs({
      tier: 'town',
      institutions: [],
      powerStructure: { factions: [{ faction: 'Religious Authorities', category: 'religious' }] },
      npcs: [{ id: 'npc_1', role: 'Deacon/Curate', factionAffiliation: 'Religious Authorities' }],
    });
    const synth = (out.npcs || []).filter((n) => n.generatedAs === 'faction_structural');
    expect(synth).toHaveLength(0);
  });

  it('per-archetype dedup — two economy seats + one merchant leader synthesizes no second merchant office', () => {
    const out = ensureFactionStructuralNpcs({
      tier: 'city',
      institutions: [],
      powerStructure: {
        factions: [
          { faction: 'Merchant Guilds', category: 'economy' },
          { faction: 'Craft Guilds', category: 'economy' },
        ],
      },
      npcs: [{ id: 'npc_1', role: 'Guild Master', factionAffiliation: 'Merchant Guilds' }],
    });
    const synth = (out.npcs || []).filter((n) => n.generatedAs === 'faction_structural');
    expect(synth).toHaveLength(0);
  });

  /**
   * REGRESSION PIN for the ONE-TIME CORRECTION of 2026-08-11 (owner-approved).
   *
   * `linkedInstitutionIds` was built from a bare `?.id`, but a GENERATED
   * institution carries no `id` at all (measured at HEAD 4a9b6cf4: 3632 of 3632
   * institutions across 120 seeded generations had none), so the array was
   * unconditionally empty for every faction structural NPC. The identity the
   * consumers join on is `domain/entities/propagate.js`'s
   * `instId = (i) => i.id || i.name`.
   *
   * PROBE B above feeds an institution that DOES carry an `id` — a shape the
   * generator never produces — so it passed throughout the defect. This pin feeds
   * the id-less PRODUCTION shape, which is exactly the negative control: restoring
   * the bare `?.id` read makes the expected array empty and reds this test.
   */
  it('links an id-less institution by NAME — the production shape', () => {
    const out = ensureFactionStructuralNpcs({
      tier: 'town',
      institutions: [{ name: 'Grand Temple', category: 'Religious' }],
      powerStructure: { factions: [{ faction: 'Religious Authorities', category: 'religious' }] },
      npcs: [{ id: 'npc_1', role: 'Mayor', factionAffiliation: 'Elected Reeve' }],
    });
    const priest = (out.npcs || []).find((n) => n.role === 'High Priestess');
    expect(priest).toBeTruthy();
    expect(priest.linkedInstitutionIds).toEqual(['Grand Temple']);
  });

  it('an id-BEARING institution is still linked by its id, never downgraded to its name', () => {
    const out = ensureFactionStructuralNpcs({
      tier: 'town',
      institutions: [{ id: 'inst_temple', name: 'Grand Temple', category: 'Religious' }],
      powerStructure: { factions: [{ faction: 'Religious Authorities', category: 'religious' }] },
      npcs: [{ id: 'npc_1', role: 'Mayor', factionAffiliation: 'Elected Reeve' }],
    });
    const priest = (out.npcs || []).find((n) => n.role === 'High Priestess');
    expect(priest.linkedInstitutionIds).toEqual(['inst_temple']);
  });

  it('a role whose linkToInst matches nothing present still links nothing', () => {
    // The temple seat is the anchor: the same call synthesizes its High Priestess
    // and, when a matching institution IS present, links it (pinned directly
    // above). With only a smithy on the roster there is nothing for the temple
    // pattern to match, so an empty array here is the matcher declining rather
    // than the linking step having disappeared.
    const out = ensureFactionStructuralNpcs({
      tier: 'town',
      institutions: [{ name: 'Village smithy', category: 'Crafts' }],
      powerStructure: { factions: [{ faction: 'Religious Authorities', category: 'religious' }] },
      npcs: [{ id: 'npc_1', role: 'Mayor', factionAffiliation: 'Elected Reeve' }],
    });
    const priest = (out.npcs || []).find((n) => n.role === 'High Priestess');
    expect(priest).toBeTruthy();
    expect(priest.linkedInstitutionIds).toEqual([]);
  });

  it('idempotent — a second pass adds nothing (placeholders cover their own office)', () => {
    const base = {
      tier: 'town',
      institutions: [],
      powerStructure: { factions: [{ faction: 'Religious Authorities', category: 'religious' }] },
      npcs: [{ id: 'npc_1', role: 'Mayor', factionAffiliation: 'Elected Reeve' }],
    };
    const once = ensureFactionStructuralNpcs(base);
    const twice = ensureFactionStructuralNpcs(once);
    expect(twice.npcs.length).toBe(once.npcs.length);
  });
});
