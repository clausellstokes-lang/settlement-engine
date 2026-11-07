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

  it('adds newly visible hard dependencies and reports only final-roster additions', () => {
    const settlement = generate({
      settType: 'metropolis',
      culture: 'greek',
      terrainOverride: 'mountain',
      tradeRouteAccess: 'isolated',
      magicExists: true,
      priorityMagic: 100,
      // Seed re-pinned `-7` to `-24` on 2026-08-01. Wave I1 added four information
      // brokerage entries to the town/city catalogs and assembleInstitutions draws once
      // per candidate clearing its gates, so every metropolis stream downstream of the
      // catalog translated and `-7` no longer lands on a two-subject hard_dependency
      // repair. `-24` restores it (and adds a third subject), and is the same seed
      // tests/generators/effectReachability.coverage.test.js pins for this config.
      // Re-pinned `-24` to `-39` on 2026-09-30 (the urban band, ODQ §934.86): the registry
      // carries city functions into the metropolis block and aligns the gate table with it,
      // so far fewer dependencies go missing at all and `-24` now adds none. `-39` adds two
      // (one of them the old pin's Fighting pits) and leaves the final roster free of hard
      // violations — of the forty siblings, only -21, -38, -39 and -40 do both. The
      // effect corpus keeps `-24` for its own strata, so the two files no longer share it.
      // Re-pinned `-39` to `-28` on 2026-11-04 (X-46 car 3, the institution budget; the chair's
      // ruling 6(b)): the density factor changes which rows a metropolis rolls, so `-39` no longer
      // adds two; of `-0`..`-59` only `-28` adds two hard dependencies AND leaves the final roster
      // free of hard violations. The claim is unchanged; the subjects follow the seed.
      // Re-pinned `-28` to `-116` the same day, same cause (the chair's inverse calibration of the
      // density factor): none of -0..-59 does both now; -116 is the first above them that does.
      // Re-pinned `-116` to `-245` on 2026-11-04 (rung-1 pins, unit 1; the composed base): composed
      // onto the window branch, x46-1b's tailed metropolis roll moves this seed's population and so
      // its density factor, and `-116` adds none; of -0..-399 only -245 (Fighting pits, Underground
      // city — the same two subjects) and -318 add two AND leave no hard violation.
    }, 'effect-reach-v1-iso-metro-245');
    const names = new Set(
      settlement.institutions.map(institution => institution.name),
    );
    const additions = settlement.generationCoherenceReceipt.repairs.filter(
      repair => repair.action === 'added',
    );

    expect(additions).toEqual(expect.arrayContaining([
      // Subjects re-pinned 2026-08-01 with the seed above (same cause). The claim is
      // unchanged: MORE THAN ONE newly visible hard dependency is added and reported.
      expect.objectContaining({
        type: 'hard_dependency',
        subject: 'Fighting pits',
      }),
      expect.objectContaining({
        type: 'hard_dependency',
        subject: 'Underground city',
      }),
    ]));
    for (const repair of additions) {
      expect(
        names.has(repair.subject),
        `repair receipt says "${repair.subject}" was added but it is absent from the final roster`,
      ).toBe(true);
    }
    expect(
      settlement.structuralViolations.filter(violation => (
        violation.severity === 'error' || violation.severity === 'critical'
      )),
    ).toEqual([]);
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
    // A missing, emptied, or renamed recentConflict reds on the positive pin
    // above, so this negative is only ever reached with live repaired prose.
    // anchored: the positive toMatch above pins this same string.
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
