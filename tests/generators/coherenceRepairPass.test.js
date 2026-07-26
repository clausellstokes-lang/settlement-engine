/**
 * coherenceRepairPass.test.js — generator-owned contradictions are repaired
 * before the economy, population, and narrative layers read the institution
 * roster. Explicit author choices remain protected by the existing toggle and
 * by-design contracts.
 */

import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const FORTIFICATION = /\bwall|citadel|garrison|barracks|palisade|earthwork|fortress\b/i;
const FORCE = /\bgarrison|guard|militia|levy|barracks|mercenary|watch\b/i;

function generate(config, seed) {
  return generateSettlementPipeline(config, null, {
    seed,
    customContent: {},
  });
}

describe('deterministic generation coherence repair', () => {
  it('gives every plagued settlement a tier-plausible perimeter and defending force', () => {
    for (const tier of TIERS) {
      for (let index = 0; index < 8; index += 1) {
        const settlement = generate({
          settType: tier,
          monsterThreat: 'plagued',
          tradeRouteAccess: 'road',
          magicExists: false,
          priorityMagic: 0,
          priorityMilitary: 0,
        }, `plagued-defense-${tier}-${index}`);
        const names = settlement.institutions.map(institution => institution.name);
        const hardSurvival = settlement.structuralViolations.filter(violation => (
          violation.type === 'survival_crisis'
          && ['error', 'critical'].includes(violation.severity)
        ));

        expect(
          names.some(name => FORTIFICATION.test(name)),
          `${tier} lacks a fortification`,
        ).toBe(true);
        expect(
          names.some(name => FORCE.test(name)),
          `${tier} lacks a defending force`,
        ).toBe(true);
        expect(hardSurvival, `${tier} retains a survival crisis`).toEqual([]);
      }
    }
  }, 60_000);

  it('records repairs without consuming a random branch or changing replay output', () => {
    const config = {
      settType: 'thorp',
      monsterThreat: 'plagued',
      tradeRouteAccess: 'road',
      magicExists: false,
      priorityMagic: 0,
      priorityMilitary: 0,
    };
    const first = generate(config, 'coherence-repair-replay');
    const replay = generate(config, 'coherence-repair-replay');

    expect(first).toEqual(replay);
    expect(first.generationCoherenceReceipt.repairs).toEqual(expect.arrayContaining([
      expect.objectContaining({
        type: 'threat_defense',
        action: 'added',
      }),
    ]));
  });

  it('repairs defense before power prose and provenance read the roster', () => {
    const settlement = generate({
      settType: 'hamlet',
      culture: 'germanic',
      terrainOverride: 'plains',
      tradeRouteAccess: 'road',
      monsterThreat: 'plagued',
      priorityMilitary: 5,
    }, 'repair-audit-2');
    const institutionCountPhrase =
      `${settlement.institutions.length} institutions`;
    const powerTraces = settlement.simulationTrace.filter(
      trace => trace.step === 'generatePower',
    );

    expect(settlement.powerStructure.recentConflict).toMatch(
      /militia is stretched thin/i,
    );
    expect(settlement.powerStructure.recentConflict).not.toMatch(
      /whether to build defenses/i,
    );
    expect(powerTraces.length).toBeGreaterThan(0);
    for (const trace of powerTraces) {
      const institutionCause = trace.causes?.find(
        cause => cause.source === 'institutionMix',
      );
      if (!institutionCause) continue;
      expect(institutionCause.reason).toContain(institutionCountPhrase);
    }
    expect(settlement.generationCoherenceReceipt.repairs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'threat_defense',
          subject: 'Palisade or earthworks',
        }),
        expect.objectContaining({
          type: 'threat_defense',
          subject: 'Citizen militia',
        }),
      ]),
    );
  });

  it('never generates a fishmonger without water or a supplying trade route', () => {
    for (let index = 0; index < 40; index += 1) {
      const settlement = generate({
        settType: 'village',
        tradeRouteAccess: 'isolated',
        terrainOverride: 'mountain',
      }, `isolated-fishmonger-${index}`);
      expect(
        settlement.institutions.some(institution => institution.name === 'Fishmonger'),
      ).toBe(false);
    }
  }, 60_000);
});
