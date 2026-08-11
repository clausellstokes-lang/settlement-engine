/** CW-0: independently-owned cross-layer reads remain pure and same-evidence. */
import { describe, expect, test } from 'vitest';

import {
  COUPLING_REGISTRY,
  COUPLING_REGISTRY_SCHEMA_VERSION,
  WR3_LINEAGE_COUPLING,
  WR4_BELIEF_TRAJECTORY_COUPLING,
  WR4_HANDS_HOME_FRONT_COUPLING,
  WR4_INSTITUTION_HOME_FRONT_COUPLING,
  WR4_TRADE_HOME_FRONT_COUPLING,
  WR4_WAR_COST_COUPLINGS,
  WR5_BILATERAL_PEACE_COUPLING,
  WR5_REFUSAL_PRICE_COUPLING,
  WR5_SEAT_ACCEPTANCE_COUPLING,
  WR5_SEAT_BOOKS_COUPLING,
  WR5_WAR_DECISION_GRIEVANCE_COUPLING,
  WR5_WAR_RULING_COUPLINGS,
  WR6_ALLIANCE_RISK_COUPLING,
  WR6_COALITION_BOOKS_COUPLING,
  WR6_COALITION_RELATIONSHIP_COUPLING,
  WR6_COALITION_SETTLEMENT_TRADE_COUPLING,
  WR6_PAIRWISE_SETTLEMENT_COUPLING,
  WR6_PEOPLE_EXPENDITURE_COUPLING,
  WR6_TRADE_EXPENDITURE_COUPLING,
  WR6_WAR_COALITION_COUPLINGS,
  WR7_ENVOY_COUPLINGS,
  WR7_CARRIED_SHEET_COUPLING,
  WR7_ENCOUNTER_COUPLING,
  WR7_ENVOY_PLANT_COUPLING,
  WR7_HOME_DELIVERY_COUPLING,
  WR7_MOVING_PICTURE_COUPLING,
  WR7_PEACE_DISPATCH_COUPLING,
  WR7_SELF_PARLAY_COUPLING,
  WR7_SILENCE_INFERENCE_COUPLING,
  WR7_TWO_PICTURE_PARLAY_COUPLING,
  TR1_CASUS_COMMERCII_COUPLINGS,
  TR1_SEVERANCE_PRESSURE_COUPLING,
  GR2_BELIEVED_DEMAND_COUPLING,
  GR2_PACT_FORMATION_COUPLINGS,
  GR2_SHARED_THREAT_COUPLING,
  GR3_FAITH_GRANT_COUPLING,
  GR3_MUTUAL_DEFENSE_COUPLING,
  GR3_POPULATION_GRANT_COUPLING,
  GR3_TERM_FAMILY_COUPLINGS,
  ES1_COVERT_MISSION_MINT_COUPLING,
  ES1_HIDDEN_FRANCHISE_COUPLING,
  ES1_MISSION_VOCABULARY_COUPLING,
  ES2_GAUNTLET_DWELL_READ_COUPLING,
  ES2_GAUNTLET_TRANSIT_CURSOR_COUPLING,
  ES3_FLAW_DISTORTION_COUPLING,
  ES3_GRADIENT_AMENDER_COUPLING,
  ES5B_ABSENCE_BENCH_COUPLING,
  ES5C_CAREER_LADDER_COUPLING,
  ES5D_CAREER_CREDIT_COUPLING,
  ES5_DOCTRINE_MORAL_LADDER_COUPLING,
  ES6A_DOUBLE_AGENT_LEAK_COUPLING,
  ES_ESPIONAGE_COUPLINGS,
  IN0A_PLANT_HANDOFF_COUPLING,
  IN0C_DISCLOSURE_SIGNING_CREDIT_COUPLING,
  IN_INFORMATION_COUPLINGS,
  couplingRowFor,
  couplingRowsFor,
} from '../../src/domain/certification/couplingRegistry.js';

/**
 * The twelve chartered volume prefixes (DESIGN_FP_ARCHITECTURE.md §9 seam row 32 /
 * CW seam SC-7). A thirteenth volume must amend BOTH this list and that seam row.
 *
 * ES (ESPIONAGE) and WY (WAYFARE) were admitted at the 2026-08-05
 * owner-amendment fold — ES tenth, WY eleventh (docs/DESIGN_FP_ARCH_ES.md §6;
 * docs/DESIGN_FP_ARCH_WY.md §5b item 7). HB (HABIT) is the TWELFTH, admitted at
 * the 2026-08-07 fold under HB chair question Q4, RULED YES with its own
 * couplingRegistryHabit.js leaf (docs/DESIGN_FP_ARCH_HB.md §7 Q4; the first row
 * lands at HB-2). ⛔ NEITHER OF THAT FOLD'S OTHER TWO VOLUMES JOINS, AND BOTH
 * ABSTENTIONS ARE REASONED RATHER THAN OVERSIGHTS: EP declines explicitly (its
 * §5 item 7 — "NO PREFIX ADMISSION IS OWED": couplingInclusion.walker scopes its
 * census to src/domain/{worldPulse,spatial}/, so src/store and src/kernel are
 * outside it, pulseKernel.js and worldState.js are ARGUED_UNLAYERED, and an epoch
 * is SUBSTRATE, not a subject any layer family owns); and WC mints no coupling id
 * of its own — it carries zero CPL- ids in 6,492 lines. ADMISSION IS
 * DOCUMENT-ONLY: nothing
 * in this file or in the coupling walkers demands a registry row per admitted
 * prefix, so a chartered prefix with zero live rows is green by design. The
 * obligation runs the other way — every live row must carry a chartered
 * prefix. The FIRST ES or WY row additionally widens the owningVolume set
 * asserted below, in that row's own commit.
 */
const CHARTERED_VOLUME_PREFIXES = Object.freeze(['WR', 'TR', 'GR', 'WF', 'POP', 'IN', 'INT', 'SP', 'CW', 'ES', 'WY', 'HB']);

/**
 * `CPL-<pair>.<DIRECTION>.<VOLUME>-<wave>[letter].<facet>`, built FROM the list
 * above so the closed set has exactly one spelling. A hand-copied alternation
 * beside the list would be one edit away from disagreeing with it silently.
 */
const COUPLING_ID_SHAPE = new RegExp(
  `^CPL-\\d+\\.[A-Z_]+\\.(?:${CHARTERED_VOLUME_PREFIXES.join('|')})-\\d+[a-z]?\\.[a-z_]+$`,
);

describe('CW-0 coupling registry', () => {
  test('schema v4 preserves prior waves and appends later waves in decision-flow order', () => {
    expect(COUPLING_REGISTRY_SCHEMA_VERSION).toBe(4);
    expect(WR4_WAR_COST_COUPLINGS).toEqual([
      WR4_TRADE_HOME_FRONT_COUPLING,
      WR4_HANDS_HOME_FRONT_COUPLING,
      WR4_BELIEF_TRAJECTORY_COUPLING,
      WR4_INSTITUTION_HOME_FRONT_COUPLING,
    ]);
    expect(COUPLING_REGISTRY).toEqual([
      WR3_LINEAGE_COUPLING,
      ...WR4_WAR_COST_COUPLINGS,
      ...WR5_WAR_RULING_COUPLINGS,
      ...WR6_WAR_COALITION_COUPLINGS,
      ...WR7_ENVOY_COUPLINGS,
      ...TR1_CASUS_COMMERCII_COUPLINGS,
      // FP GR-2 (2026-08-06): the THIRD volume leaf, appended in wave order like the
      // second. Three rows, one per direction peacetime formation reads across.
      ...GR2_PACT_FORMATION_COUPLINGS,
      // FP GR-3 (2026-08-06): the same leaf's SECOND set, and the first rows in this
      // registry that point OUT of their owning volume rather than into it. GR-2's three
      // read other layers' evidence; these three expose GRAMMAR's own standing-right reads
      // to consumers that have not landed (FAITH WF-6, POP-5b, and the war layer's
      // `defensive_pact` readers). They are FORWARD DECLARATIONS and the leaf says so — the
      // producer/consumer law forbids shipping a right with its consumer side merely
      // unmentioned, which is `non_intervention`'s recorded lesson.
      ...GR3_TERM_FAMILY_COUPLINGS,
      // FP IN-0a (2026-08-06): the FOURTH volume leaf. One row — the paid plant's handoff
      // into the envoy-picture stage — and INFORMATION's first cross-layer read.
      ...IN_INFORMATION_COUPLINGS,
      // FP ES-1 (2026-08-06): the first ESPIONAGE rows, appended in wave order.
      ...ES_ESPIONAGE_COUPLINGS,
    ]);
    expect(WR3_LINEAGE_COUPLING).toEqual({
      couplingId: 'CPL-3.POP_TO_WAR.WR-3.lineage',
      pairId: 'CPL-3',
      direction: 'POP→WAR',
      read: 'src/domain/worldPulse/lineageClaim.js#makeLineageClaimRead.lineageClaimOf',
      receiptField: 'lineageClaimOf(...).suppression.receipt',
      counterforce: 'src/domain/worldPulse/lineageClaim.js#makeLineageClaimRead.kinshipBondOf',
      flags: [
        'demographicsEnabled',
        'lineageClaimEnabled',
        'peaceEngineEnabled',
        'warLayerEnabled',
      ],
      owningVolume: 'WAR',
      owningWave: 'WR-3',
      intendedDesk: 'war',
    });
  });

  test('the claim and counterforce resolve through one evidence factory', () => {
    const targetOf = (address) => address.split('#')[0];
    const factoryOf = (address) => address.split('#')[1].split('.')[0];
    expect(targetOf(WR3_LINEAGE_COUPLING.read)).toBe(targetOf(WR3_LINEAGE_COUPLING.counterforce));
    expect(factoryOf(WR3_LINEAGE_COUPLING.read)).toBe('makeLineageClaimRead');
    expect(factoryOf(WR3_LINEAGE_COUPLING.counterforce)).toBe('makeLineageClaimRead');
    expect(WR3_LINEAGE_COUPLING.receiptField).toContain('suppression.receipt');
  });

  test('records all four WR-4 foreign reads with same-evidence counterforces', () => {
    expect(WR4_WAR_COST_COUPLINGS.map((row) => [row.pairId, row.direction, row.intendedDesk]))
      .toEqual([
        ['CPL-1', 'TRADE→WAR', 'trade'],
        ['CPL-3', 'POP→WAR', 'events'],
        ['CPL-4', 'INFO→WAR', 'war'],
        ['CPL-6', 'INTERIOR→WAR', 'events'],
      ]);
    expect(WR4_TRADE_HOME_FRONT_COUPLING.receiptField)
      .toContain('homeFrontComponents.{roads,markets}.{band,stateRead}');
    expect(WR4_HANDS_HOME_FRONT_COUPLING.receiptField)
      .toContain('homeFrontComponents.hands.{band,stateRead}');
    expect(WR4_BELIEF_TRAJECTORY_COUPLING.receiptField)
      .toContain('believedBalanceBand,truthBalanceBand,trajectory,trajectoryMisread');
    expect(WR4_INSTITUTION_HOME_FRONT_COUPLING.receiptField)
      .toContain('homeFrontComponents.institutions.{band,stateRead}');

    for (const row of WR4_WAR_COST_COUPLINGS) {
      expect(row.read, row.couplingId).toBe(row.counterforce);
      expect(row.flags, row.couplingId).toEqual(['warLayerEnabled', 'warTerminationEnabled']);
      expect(row.owningVolume).toBe('WAR');
      expect(row.owningWave).toBe('WR-4');
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.flags)).toBe(true);
    }
    expect(WR4_INSTITUTION_HOME_FRONT_COUPLING.intendedDesk).not.toBe('adjudication');
  });

  test('records exactly five WR-5 reads against their live receipt surfaces', () => {
    expect(WR5_WAR_RULING_COUPLINGS).toEqual([
      {
        couplingId: 'CPL-6.INTERIOR_TO_WAR.WR-5.seat_books',
        pairId: 'CPL-6',
        direction: 'INTERIOR→WAR',
        read: 'src/domain/worldPulse/warSeatBooks.js#readWarSeatBooks',
        receiptField: 'pulseRecord.warTerminationReads[].{authoritySignature,booksInterest,booksDirection,rulerSecurityBand,rulerLawfulnessBand,rulerMoralityBand,booksReason,booksPublicReason}',
        counterforce: 'src/domain/worldPulse/warSeatBooks.js#readWarSeatBooks',
        flags: ['warLayerEnabled', 'warTerminationEnabled'],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'war',
      },
      {
        couplingId: 'CPL-6.WAR_TO_INTERIOR.WR-5.war_decision_grievance',
        pairId: 'CPL-6',
        direction: 'WAR→INTERIOR',
        read: 'src/domain/worldPulse/warPoliticalLoop.js#applyWarDecisionPolitics',
        receiptField: 'worldState.factionPairStates[...].incidents[].{type,context.{decisionId,actualAction,desiredAction}}',
        counterforce: 'src/domain/worldPulse/warPoliticalLoop.js#applyWarDecisionPolitics',
        flags: [
          'warLayerEnabled',
          'warTerminationEnabled',
          'factionCompetitionEnabled',
          'memoryWeaveEnabled',
        ],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'adjudication',
      },
      {
        couplingId: 'CPL-5.WAR_TO_GRAMMAR.WR-5.bilateral_peace',
        pairId: 'CPL-5',
        direction: 'WAR→GRAMMAR',
        read: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        receiptField: 'readWarPeaceDecision(...).receipt.{decision,actualAction,decidingTerm,bands,reason}',
        counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        flags: ['warLayerEnabled', 'warTerminationEnabled'],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'adjudication',
      },
      {
        couplingId: 'CPL-21.INTERIOR_TO_GRAMMAR.WR-5.seat_acceptance',
        pairId: 'CPL-21',
        direction: 'INTERIOR→GRAMMAR',
        read: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        receiptField: 'readWarPeaceDecision(...).receipt.{decision,actualAction,booksDirection,booksInterest,interestServed,inheritedDemand,booksPublicReason}',
        counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        flags: ['warLayerEnabled', 'warTerminationEnabled'],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'adjudication',
      },
      {
        couplingId: 'CPL-21.GRAMMAR_TO_INTERIOR.WR-5.refusal_price',
        pairId: 'CPL-21',
        direction: 'GRAMMAR→INTERIOR',
        read: 'src/domain/worldPulse/warPeaceRefusal.js#applyWarPeaceRefusal',
        receiptField: 'applyWarPeaceRefusal(...).evidence[].{kind,id,settlementId,counterpartId,thirdPartyId,decision,interestServed}',
        counterforce: 'src/domain/worldPulse/warPeaceDecision.js#readWarPeaceDecision',
        flags: ['warLayerEnabled', 'warTerminationEnabled'],
        owningVolume: 'WAR',
        owningWave: 'WR-5',
        intendedDesk: 'adjudication',
      },
    ]);
    expect(Object.isFrozen(WR5_WAR_RULING_COUPLINGS)).toBe(true);
    for (const row of WR5_WAR_RULING_COUPLINGS) {
      expect(Object.isFrozen(row), row.couplingId).toBe(true);
      expect(Object.isFrozen(row.flags), row.couplingId).toBe(true);
    }
  });

  test('records the seven WR-6 reads from alliance risk through pairwise settlement', () => {
    expect(WR6_WAR_COALITION_COUPLINGS).toEqual([
      WR6_ALLIANCE_RISK_COUPLING,
      WR6_COALITION_BOOKS_COUPLING,
      WR6_PEOPLE_EXPENDITURE_COUPLING,
      WR6_TRADE_EXPENDITURE_COUPLING,
      WR6_COALITION_SETTLEMENT_TRADE_COUPLING,
      WR6_COALITION_RELATIONSHIP_COUPLING,
      WR6_PAIRWISE_SETTLEMENT_COUPLING,
    ]);
    expect(WR6_WAR_COALITION_COUPLINGS.map((row) => [row.pairId, row.direction]))
      .toEqual([
        ['CPL-4', 'INFO→WAR'],
        ['CPL-6', 'INTERIOR→WAR'],
        ['CPL-3', 'POP→WAR'],
        ['CPL-1', 'TRADE→WAR'],
        ['CPL-1', 'WAR→TRADE'],
        ['CPL-6', 'WAR→INTERIOR'],
        ['CPL-5', 'WAR→GRAMMAR'],
    ]);
    for (const row of WR6_WAR_COALITION_COUPLINGS) {
      expect(row.flags).toEqual([
        'warLayerEnabled', 'warTerminationEnabled', 'peaceEngineEnabled', 'coalitionLedgerEnabled',
      ]);
      expect(row.owningVolume).toBe('WAR');
      expect(row.owningWave).toBe('WR-6');
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.flags)).toBe(true);
    }
  });

  test('records WR-7 transport, parlay, authority, and belief reads under only CPL-5 and CPL-19', () => {
    expect(WR7_ENVOY_COUPLINGS).toEqual([
      WR7_PEACE_DISPATCH_COUPLING,
      WR7_SELF_PARLAY_COUPLING,
      WR7_ENCOUNTER_COUPLING,
      WR7_TWO_PICTURE_PARLAY_COUPLING,
      WR7_HOME_DELIVERY_COUPLING,
      WR7_CARRIED_SHEET_COUPLING,
      WR7_MOVING_PICTURE_COUPLING,
      WR7_ENVOY_PLANT_COUPLING,
      WR7_SILENCE_INFERENCE_COUPLING,
    ]);
    expect(WR7_ENVOY_COUPLINGS.map((row) => [row.pairId, row.direction, row.intendedDesk]))
      .toEqual([
        ['CPL-5', 'WAR→GRAMMAR', 'adjudication'],
        ['CPL-5', 'WAR→GRAMMAR', 'adjudication'],
        ['CPL-5', 'WAR→GRAMMAR', 'war'],
        ['CPL-5', 'WAR→GRAMMAR', 'adjudication'],
        ['CPL-5', 'GRAMMAR→WAR', 'adjudication'],
        ['CPL-5', 'GRAMMAR→WAR', 'adjudication'],
        ['CPL-19', 'INFO→GRAMMAR', 'events'],
        ['CPL-19', 'INFO→GRAMMAR', 'events'],
        ['CPL-19', 'GRAMMAR→INFO', 'divination'],
      ]);
    for (const row of WR7_ENVOY_COUPLINGS) {
      const requiredFlags = [
        'warLayerEnabled',
        'warTerminationEnabled',
        'peaceEngineEnabled',
        'envoyDiplomacyEnabled',
        'npcConsequencesEnabled',
        'routeLifecycleEnabled',
      ];
      expect(row.flags.slice(0, requiredFlags.length), row.couplingId).toEqual(requiredFlags);
      if (row === WR7_ENVOY_PLANT_COUPLING) {
        expect(row.flags.slice(requiredFlags.length)).toEqual([
          'infoStatecraftEnabled',
          'informationBrokeragesEnabled',
        ]);
      } else {
        expect(row.flags).toEqual(requiredFlags);
      }
      expect(row.owningVolume).toBe('WAR');
      expect(row.owningWave).toBe('WR-7');
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.flags)).toBe(true);
    }
    expect(WR7_PEACE_DISPATCH_COUPLING.read)
      .toBe('src/domain/worldPulse/envoyDiplomacy.js#dispatchAcceptedPeaceEnvoy');
    expect(WR7_HOME_DELIVERY_COUPLING.read)
      .toBe('src/domain/worldPulse/envoyDiplomacy.js#envoyReturnAcceptance');
    expect(WR7_MOVING_PICTURE_COUPLING.read)
      .toBe('src/domain/worldPulse/envoyDiplomacy.js#envoyRumorPatchFor');
    expect(WR7_SILENCE_INFERENCE_COUPLING.read)
      .toBe('src/domain/worldPulse/beliefMap.js#applyEnvoySilenceInference');
    expect(WR7_SILENCE_INFERENCE_COUPLING.counterforce)
      .toBe('src/domain/worldPulse/beliefMap.js#clearEnvoySilenceInference');
    expect(WR7_SELF_PARLAY_COUPLING.read)
      .toBe('src/domain/worldPulse/envoyEncounter.js#censusProactiveSelfParlays');
    expect(WR7_ENCOUNTER_COUPLING.read)
      .toBe('src/domain/worldPulse/envoyEncounter.js#selectEnvoyEncounters');
    expect(WR7_TWO_PICTURE_PARLAY_COUPLING.read)
      .toBe('src/domain/worldPulse/negotiationEvaluation.js#negotiateFromPictures');
    expect(WR7_CARRIED_SHEET_COUPLING.read)
      .toBe('src/domain/worldPulse/peaceTerms.js#materializeCarriedTermSheet');
    expect(WR7_ENVOY_PLANT_COUPLING.read)
      .toBe('src/domain/worldPulse/informationStatecraft.js#processLies');
    expect(new Set(WR7_ENVOY_COUPLINGS.map((row) => row.pairId)))
      .toEqual(new Set(['CPL-5', 'CPL-19']));
  });

  test('records TR-1 as the registry\'s first non-WAR row, one factory, no claimed kinds', () => {
    // THE GROWTH PATH, EXERCISED. CW-0w slice 1 split the rows into per-volume leaves and
    // widened the couplingId shape precisely so this row could exist; until it did, both
    // changes were untested capability. This is the proof they work.
    expect(TR1_CASUS_COMMERCII_COUPLINGS).toEqual([TR1_SEVERANCE_PRESSURE_COUPLING]);
    expect(TR1_SEVERANCE_PRESSURE_COUPLING).toEqual({
      couplingId: 'CPL-1.TRADE_TO_WAR.TR-1.severance_pressure',
      pairId: 'CPL-1',
      direction: 'TRADE→WAR',
      read: 'src/domain/worldPulse/commercialReasons.js#makeCommercialPressureRead.severancePressureOf',
      receiptField: 'spatialLedgers.commercialReasons[...][].{type,magnitude01,receipt}',
      counterforce: 'src/domain/worldPulse/commercialReasons.js#makeCommercialPressureRead.partnershipRestraintOf',
      flags: ['warLayerEnabled', 'casusCommerciiEnabled'],
      owningVolume: 'TRADE',
      owningWave: 'TR-1',
      intendedDesk: 'trade',
    });
    // SAME-EVIDENCE: claim and counterforce resolve through ONE factory in ONE module,
    // the WR-3 idiom — a counterforce with its own evidence could disagree with its force.
    const targetOf = (address) => address.split('#')[0];
    const factoryOf = (address) => address.split('#')[1].split('.')[0];
    expect(targetOf(TR1_SEVERANCE_PRESSURE_COUPLING.read))
      .toBe(targetOf(TR1_SEVERANCE_PRESSURE_COUPLING.counterforce));
    expect(factoryOf(TR1_SEVERANCE_PRESSURE_COUPLING.read)).toBe('makeCommercialPressureRead');
    expect(factoryOf(TR1_SEVERANCE_PRESSURE_COUPLING.counterforce)).toBe('makeCommercialPressureRead');
    // NO CLAIMED KINDS, asserted rather than left to chance: the read moves an existing
    // war-pressure deposit and mints no Herald kind of its own. A future edit that adds
    // one must argue it against the desk walker instead of inheriting agreement here.
    expect('kinds' in TR1_SEVERANCE_PRESSURE_COUPLING).toBe(false);
    // anchored: at least one live row DOES declare kinds, so the assertion above cannot
    // be green because the optional field stopped being readable.
    expect(COUPLING_REGISTRY.some((row) => 'kinds' in row)).toBe(true);
    // The volume prefix is TRADE while the wave prefix is TR — the two vocabularies are
    // separate and this row is the first place they meet.
    // GRAMMAR joined at FP GR-2 (2026-08-06), in that row's own commit, exactly as the
    // CHARTERED_VOLUME_PREFIXES docstring says a new volume must: peacetime formation is
    // the first GRAMMAR wave that reads across a layer boundary, and it reads across three
    // at once (INFO for the believed demand, INTERIOR for the posture reserve, WAR for the
    // shared threat). The set is asserted rather than derived so a fourth volume arriving
    // silently still reds here.
    //
    // INFORMATION is that FOURTH volume, and it arrived exactly as designed: FP IN-0a
    // (2026-08-06) reds this line, and the line is amended in the commit that admits the
    // volume rather than derived into agreement with whatever the registry happens to hold.
    // ESPIONAGE is the FIFTH, and it arrived the same way: FP ES-1 (2026-08-06) reds
    // this line, and the line is amended in the commit that admits the volume. ES was
    // CHARTERED as a prefix at the 2026-08-05 owner-amendment fold and carried zero rows
    // until now — the header above records that a chartered prefix with no rows is green
    // by design, so this widening is the row's arrival and not the charter's.
    expect(new Set(COUPLING_REGISTRY.map((row) => row.owningVolume)))
      .toEqual(new Set(['WAR', 'TRADE', 'GRAMMAR', 'INFORMATION', 'ESPIONAGE']));
  });

  test('every schema-v3 row has one stable unique identity and a closed shape', () => {
    const requiredKeys = [
      'couplingId', 'pairId', 'direction', 'read', 'receiptField',
      'counterforce', 'flags', 'owningVolume', 'owningWave', 'intendedDesk',
    ].sort();
    // v3's `kinds` and v4's `deskAuthority`. Absent, never empty — an empty array
    // is a key and a key is a byte (T4) — so the closed shape is the required set
    // plus exactly whichever optionals a row actually carries.
    const OPTIONAL_KEYS = ['kinds', 'deskAuthority'];
    /** The four closed record-layer authorities heraldSectionOfRecord honours. */
    const REGISTERED_AUTHORITIES = [
      'war_rulings_registry', 'war_coalition_registry', 'envoy_registry', 'sovereignty_registry',
    ];
    expect(new Set(COUPLING_REGISTRY.map((row) => row.couplingId)).size)
      .toBe(COUPLING_REGISTRY.length);
    let declaring = 0;
    let authored = 0;
    for (const row of COUPLING_REGISTRY) {
      const keys = Object.keys(row).sort();
      const expected = [...requiredKeys, ...OPTIONAL_KEYS.filter((key) => key in row)].sort();
      expect(keys, row.couplingId).toEqual(expected);
      if ('kinds' in row) {
        declaring += 1;
        expect(row.kinds.length, row.couplingId).toBeGreaterThan(0);
        expect(Object.isFrozen(row.kinds), row.couplingId).toBe(true);
      }
      if ('deskAuthority' in row) {
        authored += 1;
        // A desk authority the record router does not honour would be a claim
        // nothing can check — fail closed on the closed set, not on truthiness.
        expect(REGISTERED_AUTHORITIES, row.couplingId).toContain(row.deskAuthority);
      }
      expect(row.couplingId).toMatch(COUPLING_ID_SHAPE);
    }
    // Non-empty floor: BOTH optional fields are proven OPTIONAL in both
    // directions — some rows carry each, some do not — so no arm above is vacuous.
    expect(declaring).toBeGreaterThan(0);
    expect(declaring).toBeLessThan(COUPLING_REGISTRY.length);
    expect(authored).toBeGreaterThan(0);
    expect(authored).toBeLessThan(COUPLING_REGISTRY.length);
  });

  test('the kinds field survives the freeze factory as a frozen copy', () => {
    const declaring = COUPLING_REGISTRY.filter((row) => 'kinds' in row);
    expect(declaring.length).toBeGreaterThanOrEqual(5);
    for (const row of declaring) {
      expect(() => {
        /** @type {any} */ (row.kinds).push('mutation_probe');
      }, row.couplingId).toThrow();
    }
  });

  // CW-0w slice 1 / seam SC-7. The shape pin used to hard-code the WR- wave
  // prefix, so the FIRST non-WAR registry row would have RED this file — the
  // growth path the whole FP program depends on was locked at its own gate.
  // The alternation is deliberately CLOSED: a THIRTEENTH volume prefix reds here
  // until it is consciously admitted, which is the tripwire, not a nuisance.
  // ES and WY were consciously admitted at the 2026-08-05 owner-amendment fold,
  // and HB at the 2026-08-07 one (HB Q4, RULED) — the tripwire working as
  // designed, not bypassed. EP and WC came through that same fold and did NOT
  // join: see the CHARTERED_VOLUME_PREFIXES docstring, where both abstentions
  // are reasoned, so a later reader does not mistake them for a missed edit.
  describe('the couplingId shape admits every chartered volume prefix and no other', () => {
    const SYNTHETIC = (prefix) => `CPL-1.TRADE_TO_WAR.${prefix}-1.synthetic_row`;

    test('all twelve chartered volume prefixes pass, including the INT/IN pair', () => {
      // INT and IN share a leading two characters; both are asserted so the
      // alternation's ORDER can never silently swallow the longer one.
      expect(CHARTERED_VOLUME_PREFIXES)
        .toEqual(['WR', 'TR', 'GR', 'WF', 'POP', 'IN', 'INT', 'SP', 'CW', 'ES', 'WY', 'HB']);
      for (const prefix of CHARTERED_VOLUME_PREFIXES) {
        expect(SYNTHETIC(prefix), prefix).toMatch(COUPLING_ID_SHAPE);
      }
      // A lettered wave (WR-7a) is a real spelling in this estate.
      expect('CPL-5.WAR_TO_GRAMMAR.WR-7a.lettered_wave').toMatch(COUPLING_ID_SHAPE);
    });

    test('an unlisted prefix and the malformed shapes are refused', () => {
      // The live registry is non-empty and every live row passes, so this
      // negative cannot be green because the pin stopped seeing ids.
      expect(COUPLING_REGISTRY.length).toBeGreaterThan(0);
      for (const row of COUPLING_REGISTRY) expect(row.couplingId).toMatch(COUPLING_ID_SHAPE);
      expect(SYNTHETIC('TR')).toMatch(COUPLING_ID_SHAPE);
      // Each refusal below differs from that PASSING id by exactly one element.
      // anchored: the same SYNTHETIC builder passes two lines up, so a shape that had stopped matching anything reds there first.
      expect(SYNTHETIC('XX')).not.toMatch(COUPLING_ID_SHAPE);
      // anchored: the wave number is the only difference from the WR- ids every live row above just matched.
      expect('CPL-1.TRADE_TO_WAR.WR.no_wave_number').not.toMatch(COUPLING_ID_SHAPE);
      // anchored: same builder shape with a capitalised facet; its lower_snake twin passes two assertions up.
      expect('CPL-1.TRADE_TO_WAR.TR-1.Synthetic_Row').not.toMatch(COUPLING_ID_SHAPE);
      // anchored: valid tail, missing only the CPL- pair head that the live-row loop above just re-proved.
      expect('TRADE_TO_WAR.TR-1.synthetic_row').not.toMatch(COUPLING_ID_SHAPE);
    });
  });

  test('multi-row lookup preserves the legacy first-row result and fails closed', () => {
    expect(Object.isFrozen(COUPLING_REGISTRY)).toBe(true);
    expect(Object.isFrozen(WR3_LINEAGE_COUPLING)).toBe(true);
    expect(Object.isFrozen(WR3_LINEAGE_COUPLING.flags)).toBe(true);
    const popWar = couplingRowsFor('CPL-3', 'POP→WAR');
    expect(popWar).toEqual([
      WR3_LINEAGE_COUPLING,
      WR4_HANDS_HOME_FRONT_COUPLING,
      WR6_PEOPLE_EXPENDITURE_COUPLING,
    ]);
    expect(Object.isFrozen(popWar)).toBe(true);
    expect(couplingRowFor('CPL-3', 'POP→WAR')).toBe(WR3_LINEAGE_COUPLING);
    expect(couplingRowsFor('CPL-1', 'TRADE→WAR')).toEqual([
      WR4_TRADE_HOME_FRONT_COUPLING,
      WR6_TRADE_EXPENDITURE_COUPLING,
      TR1_SEVERANCE_PRESSURE_COUPLING,
    ]);
    expect(couplingRowFor('CPL-4', 'INFO→WAR')).toBe(WR4_BELIEF_TRAJECTORY_COUPLING);
    const interiorWar = couplingRowsFor('CPL-6', 'INTERIOR→WAR');
    expect(interiorWar).toEqual([
      WR4_INSTITUTION_HOME_FRONT_COUPLING,
      WR5_SEAT_BOOKS_COUPLING,
      WR6_COALITION_BOOKS_COUPLING,
    ]);
    expect(Object.isFrozen(interiorWar)).toBe(true);
    expect(couplingRowFor('CPL-6', 'INTERIOR→WAR')).toBe(WR4_INSTITUTION_HOME_FRONT_COUPLING);
    expect(couplingRowsFor('CPL-6', 'WAR→INTERIOR'))
      .toEqual([WR5_WAR_DECISION_GRIEVANCE_COUPLING, WR6_COALITION_RELATIONSHIP_COUPLING]);
    expect(couplingRowFor('CPL-5', 'WAR→GRAMMAR')).toBe(WR5_BILATERAL_PEACE_COUPLING);
    expect(couplingRowsFor('CPL-5', 'WAR→GRAMMAR'))
      .toEqual([
        WR5_BILATERAL_PEACE_COUPLING,
        WR6_PAIRWISE_SETTLEMENT_COUPLING,
        WR7_PEACE_DISPATCH_COUPLING,
        WR7_SELF_PARLAY_COUPLING,
        WR7_ENCOUNTER_COUPLING,
        WR7_TWO_PICTURE_PARLAY_COUPLING,
        // GR-2's `shared_threat`: the war layer read from the PEACE side, and the first
        // row on this pair whose owning volume is GRAMMAR rather than WAR. The legacy
        // first-row tiebreak is unaffected, and the line below re-asserts it.
        GR2_SHARED_THREAT_COUPLING,
      ]);
    // GR-3's `mutual_defense` is the THIRD read on this direction and the first owned by
    // GRAMMAR. It is deliberately LAST: registration order is the legacy first-row
    // tiebreak, and WR-7's home delivery keeps that seat.
    expect(couplingRowsFor('CPL-5', 'GRAMMAR→WAR'))
      .toEqual([
        WR7_HOME_DELIVERY_COUPLING,
        WR7_CARRIED_SHEET_COUPLING,
        GR3_MUTUAL_DEFENSE_COUPLING,
      ]);
    expect(couplingRowFor('CPL-5', 'GRAMMAR→WAR')).toBe(WR7_HOME_DELIVERY_COUPLING);
    // GR-3's other two open their pairs: nobody had read across CPL-14 or CPL-17 before.
    expect(couplingRowsFor('CPL-14', 'GRAMMAR→FAITH')).toEqual([GR3_FAITH_GRANT_COUPLING]);
    expect(couplingRowsFor('CPL-17', 'GRAMMAR→POP')).toEqual([GR3_POPULATION_GRANT_COUPLING]);
    // IN-0a's handoff is the FOURTH independently-owned read on this direction and the
    // first owned by INFORMATION; the legacy first-row tiebreak below is unmoved by it.
    expect(couplingRowsFor('CPL-19', 'INFO→GRAMMAR'))
      .toEqual([
        WR7_MOVING_PICTURE_COUPLING,
        WR7_ENVOY_PLANT_COUPLING,
        GR2_BELIEVED_DEMAND_COUPLING,
        IN0A_PLANT_HANDOFF_COUPLING,
      ]);
    expect(couplingRowFor('CPL-19', 'INFO→GRAMMAR')).toBe(WR7_MOVING_PICTURE_COUPLING);
    // IN-0C's disclosure credit is the SECOND read on this direction and the first owned by
    // INFORMATION — the INFO volume composes ahead of ESPIONAGE, so it takes that seat and
    // shifts the mission rows down one. ES-1's two are the THIRD and FOURTH; ES-2's gauntlet
    // pair the FIFTH and SIXTH — the stage reads the errand ledger to find who is standing
    // still, and borrows the family's one schedule cursor rather than deriving a second
    // position fraction. Registration order is the legacy first-row tiebreak and WR-7's
    // silence inference keeps that seat, which the line below re-asserts across three waves.
    expect(couplingRowsFor('CPL-19', 'GRAMMAR→INFO'))
      .toEqual([
        WR7_SILENCE_INFERENCE_COUPLING,
        IN0C_DISCLOSURE_SIGNING_CREDIT_COUPLING,
        ES1_COVERT_MISSION_MINT_COUPLING,
        ES1_MISSION_VOCABULARY_COUPLING,
        ES2_GAUNTLET_DWELL_READ_COUPLING,
        ES2_GAUNTLET_TRANSIT_CURSOR_COUPLING,
        // ES-3 is the SEVENTH, and the first of them that WRITES: the gradient amender puts
        // `covert.{gathered,standoff}` on the errand row through `writeErrands`. Every row
        // above it is a read, which is why the direction's row list is worth reading in
        // order rather than as a set.
        ES3_GRADIENT_AMENDER_COUPLING,
      ]);
    expect(couplingRowFor('CPL-19', 'GRAMMAR→INFO')).toBe(WR7_SILENCE_INFERENCE_COUPLING);
    // ES-1's third row OPENS a pair: nobody had read across TRADE and GRAMMAR before, and
    // the read is one constant — the traveller-kind franchise the covert route plan needs.
    expect(couplingRowsFor('CPL-22', 'TRADE→GRAMMAR')).toEqual([ES1_HIDDEN_FRANCHISE_COUPLING]);
    // ES-3's second row points at the volume's OWN anchor for INFO × INTERIOR rather than
    // minting a twenty-second pair: the standoff's flaw distortion extends the ladder's
    // `riskAppetiteOf` instead of re-parsing personality words.
    expect(couplingRowsFor('CPL-20', 'INTERIOR→INFO')).toEqual([ES3_FLAW_DISTORTION_COUPLING]);
    // ES-5c is the SECOND INFO→INTERIOR row under CPL-20 and the FIRST touching the ladder.
    // It needs its own row rather than ES-5b's because `licensingRows` joins on the IMPORTER
    // module, and the two rows name different importers — so this pair is licensed here or
    // it is not licensed at all.
    // ES-5d is the THIRD, and the SECOND touching the ladder. It needs its own row for the
    // same mechanical reason and no other: the importer is `npcLadderKernel.js`, which neither
    // sibling names, and `licensingRows` joins on the importer module. Three rows on one
    // pair+direction is the shape this lookup exists to keep honest.
    expect(couplingRowsFor('CPL-20', 'INFO→INTERIOR'))
      .toEqual([ES5B_ABSENCE_BENCH_COUPLING, ES5C_CAREER_LADDER_COUPLING, ES5D_CAREER_CREDIT_COUPLING]);
    // ES-5 OPENS A DIRECTION on a pair that was already busy the other way: WR-4 and WR-6
    // both read INFO→WAR across CPL-4, and the doctrine stage is the first read back the
    // other way — the espionage doctrine spelling its moral axis with the estate's ONE
    // exported moral ladder rather than growing a private band inside the ES family.
    expect(couplingRowsFor('CPL-4', 'WAR→INFO')).toEqual([ES5_DOCTRINE_MORAL_LADDER_COUPLING]);
    expect(couplingRowFor('CPL-4', 'WAR→INFO')).toBe(ES5_DOCTRINE_MORAL_LADDER_COUPLING);
    // The leaf composes exactly its rows, in wave order.
    expect(ES_ESPIONAGE_COUPLINGS).toEqual([
      ES1_COVERT_MISSION_MINT_COUPLING,
      ES1_MISSION_VOCABULARY_COUPLING,
      ES1_HIDDEN_FRANCHISE_COUPLING,
      ES2_GAUNTLET_DWELL_READ_COUPLING,
      ES2_GAUNTLET_TRANSIT_CURSOR_COUPLING,
      ES3_GRADIENT_AMENDER_COUPLING,
      ES3_FLAW_DISTORTION_COUPLING,
      ES5_DOCTRINE_MORAL_LADDER_COUPLING,
      // ES-5b appends in wave order (the array is wave-ordered, not alphabetical), so the
      // bench row lands after ES-5's doctrine row rather than beside its ES5-prefixed name.
      ES5B_ABSENCE_BENCH_COUPLING,
      // ES-5c appends the career register — the FIRST espionage→ladder edge in the repo.
      ES5C_CAREER_LADDER_COUPLING,
      // ES-5d appends the career CREDIT — the same direction's first HANDOFF rather than a
      // derived read: espionage deposits, the ladder's own writer spends.
      ES5D_CAREER_CREDIT_COUPLING,
      // ES-6a appends the double agent's leak. It is the volume's first row whose edge the
      // inclusion walker CANNOT SEE — the dependency it records is unlayered — so the row is
      // pure record under CR-ES5B-4 rather than a licence for a pair that would otherwise red.
      ES6A_DOUBLE_AGENT_LEAK_COUPLING,
    ]);
    // ES-6a OPENS A DIRECTION on the volume's own anchor, and it is the first SAME-LAYER
    // direction in the espionage set: both ends of the recorded edge carry INFO, because the
    // corruption dependency it names holds no layer at all and naming it a port it does not
    // hold would be an unfalsifiable claim. The row's docstring carries what the arrow cannot.
    expect(couplingRowsFor('CPL-20', 'INFO→INFO')).toEqual([ES6A_DOUBLE_AGENT_LEAK_COUPLING]);
    expect(couplingRowsFor('CPL-1', 'WAR→TRADE'))
      .toEqual([WR6_COALITION_SETTLEMENT_TRADE_COUPLING]);
    expect(couplingRowFor('CPL-21', 'INTERIOR→GRAMMAR')).toBe(WR5_SEAT_ACCEPTANCE_COUPLING);
    expect(couplingRowFor('CPL-21', 'GRAMMAR→INTERIOR')).toBe(WR5_REFUSAL_PRICE_COUPLING);
    expect(couplingRowFor('CPL-3', 'WAR→POP')).toBeNull();
    expect(couplingRowFor('CPL-99', 'POP→WAR')).toBeNull();
    expect(couplingRowFor(null, null)).toBeNull();
    const missing = couplingRowsFor('CPL-99', 'POP→WAR');
    expect(missing).toEqual([]);
    expect(Object.isFrozen(missing)).toBe(true);
    expect(couplingRowsFor(null, null)).toBe(missing);
  });
});
