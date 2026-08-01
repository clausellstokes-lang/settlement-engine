/**
 * subsystemRowsEconomy.test.js — the ECONOMY / TRADE certification rows.
 *
 * A certification row is a CLAIM ABOUT SOURCE: these event types are the ones the
 * module emits, these ledgers are the ones it writes, this mover family is the one
 * the observer files its records under. A row nobody checks rots the moment the
 * module is renamed, and it rots SILENTLY, because a stale row simply reads zero
 * and the evaluator dutifully reports a silence that is really an instrument fault.
 * This file makes that impossible for the eight economy and trade rows.
 *
 *   1. SOURCE     every declared event literal and every declared ledger key is
 *                 extracted from the row's OWN declared module paths, through
 *                 tests/helpers/sourceContract.js, which throws rather than
 *                 returning an empty string when its target is gone.
 *   2. EXCLUSION  the containers these rows deliberately refuse to declare stay
 *                 refused, each anchored by a sibling that IS declared, so the
 *                 refusal cannot go vacuous when the list drifts.
 *   3. OBSERVER   the one mover-family claim in the cohort is checked against the
 *                 production classifier rather than asserted, and the reason the
 *                 other seven rows make no family claim is itself pinned.
 *   4. VERDICT    each row reaches the verdicts it can reach, against receipts
 *                 differing in exactly one field.
 *
 * MEASURED NUMBERS in the row prose come from artifacts/soak (gitignored, so no
 * test may read it). Where a measurement matters to a verdict, the fixture below
 * reproduces its SHAPE and names the case it was transcribed from.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  SUBSYSTEM_SOAK_EVIDENCE,
  SUBSYSTEM_TEMPOS,
  evaluateSubsystemCertification,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { appendObservedWizardNewsEntries, appendWizardNewsEntries } from '../../src/domain/region/wizardNews.js';
import { climbDownNews } from '../../src/domain/worldPulse/momentum.js';
import { moverFamilyOf } from '../../scripts/audit/behavioral-observation.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { mustExtract } from '../helpers/sourceContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** The eight rules this cohort certifies. */
const ECONOMY_RULES = Object.freeze([
  'commodityFlowEnabled',
  'constructiveFlowsEnabled',
  'momentumEnabled',
  'resourceDriftEnabled',
  'resourceDynamicsEnabled',
  'settlementStrategyEnabled',
  'supplyWebWarfareEnabled',
  'tradeFlowsEnabled',
]);

const rowOf = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);
const modulesOf = (rule) => rowOf(rule).module.split(',').map((part) => part.trim());
const sourcesOf = (rule) => modulesOf(rule).map(read).join('\n');

/** Every boolean switch lit, so a fixture only names what it turns OFF. */
function litRules(overrides = {}) {
  const rules = {};
  for (const key of simulationRuleKeys()) rules[key] = true;
  return { ...rules, ...overrides };
}

/**
 * One synthetic observed year, shaped like behavioral-observation.mjs emits. NOTE
 * the observer's own arithmetic: moverCounts is the SUM of the selected and the
 * post-apply lanes, and only the two sub-tallies are disjoint. A post-apply-only
 * lane therefore shows up in moverCounts AND postApplyMoverCounts with zero
 * selected, which is exactly the generosity signature the fixtures below reproduce.
 */
function year(index, { eventTypeCounts = {}, moverCounts = {}, postApplyMoverCounts = {} } = {}) {
  const selected = {};
  for (const [family, count] of Object.entries(moverCounts)) {
    selected[family] = count - (postApplyMoverCounts[family] || 0);
  }
  return {
    year: index,
    eventCount: Object.values(eventTypeCounts).reduce((total, value) => total + value, 0),
    eventTypeCounts,
    moverCounts,
    selectedMoverCounts: selected,
    postApplyMoverCounts,
  };
}

/** A v5 receipt: it records its own configuration and a TOTAL worldState census. */
function receiptV5({ rules = litRules(), years = [], stateKeys = {} } = {}) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'economy-fixture-3y-4s',
    seed: 'economy-fixture',
    years: years.length,
    settlements: 4,
    subsystems: {
      schemaVersion: 5,
      kind: 'soak_subsystem_configuration',
      presetId: 'full_simulation',
      rules,
      stateKeysComplete: true,
      stateKeys,
    },
    behavioral: { schemaVersion: 4, kind: 'whole_world_behavioral_observation', settlementIds: [], yearly: years },
  };
}

/** A v4 receipt: the shape every COMPLETED release case actually has. */
function receiptV4(years) {
  return {
    schemaVersion: 4,
    kind: 'whole_world_soak',
    caseId: 'economy-fixture-v4',
    years: years.length,
    settlements: 4,
    behavioral: { schemaVersion: 4, yearly: years },
  };
}

const ledgerEntry = (years, entries) => ({ years, maxEntries: entries, finalEntries: entries });

describe('economy certification rows — the source claims', () => {
  test('all eight rules are authored here and none is still listed as pending', () => {
    for (const rule of ECONOMY_RULES) {
      expect(rowOf(rule), `no authored row for ${rule}`).toBeTruthy();
      expectAbsentWithAnchor(
        SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
        rule,
        // The anchor travels the SAME list and the SAME lane files: while any key
        // is still pending, the burn-down list is demonstrably live and keyed the
        // way this assertion assumes.
        SUBSYSTEM_CERTIFICATION_PENDING_KEYS[0],
        `${rule} authored but still pending`,
      );
    }
  });

  test('every declared event literal is extracted from the row\'s own declared modules', () => {
    // The four rows whose vocabulary is a VERBATIM literal in source. mustExtract
    // throws (never returns a falsy sentinel) when a rename lands, so this reds
    // loudly rather than passing against emptiness.
    for (const rule of ['resourceDriftEnabled', 'resourceDynamicsEnabled', 'tradeFlowsEnabled']) {
      const source = sourcesOf(rule);
      expect(rowOf(rule).aliveness.eventTypes.length, `${rule} declares no event type`).toBeGreaterThan(0);
      for (const type of rowOf(rule).aliveness.eventTypes) {
        expect(mustExtract(source, `candidateType: '${type}'`, `${rule} emits ${type}`)).toBeTruthy();
      }
    }
    // The strategy row's types are COMPOSED, not written out: the chooser builds
    // `strategy_${move}`, so the pin is the composition site plus each move name as
    // a quoted literal in the same module. A renamed move reds on its own line.
    const strategy = sourcesOf('settlementStrategyEnabled');
    expect(mustExtract(strategy, 'candidateType: `strategy_${move}`', 'strategy composition site')).toBeTruthy();
    for (const type of rowOf('settlementStrategyEnabled').aliveness.eventTypes) {
      const move = type.replace(/^strategy_/, '');
      expect(mustExtract(strategy, `'${move}'`, `strategy move ${move}`)).toBeTruthy();
    }
  });

  test('every declared state key is written by the row\'s own declared modules', () => {
    const declared = ECONOMY_RULES.flatMap((rule) => rowOf(rule).aliveness.stateKeys.map((key) => [rule, key]));
    // Four rows carry ledgers (commodity, constructive, momentum, supply-web); the
    // count is asserted so an emptied row cannot make this loop vacuous.
    expect(declared.length, 'the cohort should declare eleven ledger keys across four rows').toBe(11);
    for (const [rule, key] of declared) {
      const ledger = mustExtract(key, /^spatialLedgers\.(.+)$/, `${rule} state key shape`).replace('spatialLedgers.', '');
      expect(
        mustExtract(sourcesOf(rule), `setSpatialLedger(`, `${rule} writes a spatial ledger`),
      ).toBeTruthy();
      expect(
        mustExtract(sourcesOf(rule), `'${ledger}'`, `${rule} names the ${ledger} ledger`),
      ).toBeTruthy();
    }
  });

  test('the deliberately refused containers stay refused, each anchored by a declared sibling', () => {
    // supplyShipments is written on the M2 path too (the spatial marker alone), so
    // declaring it would grade commodity continuity ALIVE in a world that never
    // opted in. commodityStocks is the anchor: same census namespace, same row.
    expectAbsentWithAnchor(
      rowOf('commodityFlowEnabled').aliveness.stateKeys,
      'spatialLedgers.supplyShipments',
      'spatialLedgers.commodityStocks',
      'commodity continuity refuses the shared shipment ledger',
    );
    // obligations has five writers across the estate, so it cannot witness the
    // generosity gate. generosityWillingness is the anchor: exclusively written by
    // the same kernel, downstream of the same dormancy gate.
    expectAbsentWithAnchor(
      rowOf('constructiveFlowsEnabled').aliveness.stateKeys,
      'spatialLedgers.obligations',
      'spatialLedgers.generosityWillingness',
      'generosity refuses the shared obligation ledger',
    );
    // defend and hold always carry recordMode suppression_only, which
    // isPublicOutcome rejects, so they can never reach eventTypeCounts. deploy is
    // the anchor: the same composition site, the same chooser, one sample apart.
    for (const suppressed of ['strategy_defend', 'strategy_hold']) {
      expectAbsentWithAnchor(
        rowOf('settlementStrategyEnabled').aliveness.eventTypes,
        suppressed,
        'strategy_deploy',
        `${suppressed} is structurally unobservable`,
      );
    }
    // The suppression is a SOURCE fact, not a convention: pin both halves of it.
    expect(mustExtract(
      sourcesOf('settlementStrategyEnabled'),
      /move === 'defend' \|\| move === 'hold' \|\| inertLever/,
      'the suppression-only branch',
    )).toBeTruthy();
    expect(mustExtract(
      read('src/domain/worldPulse/pulseHelpers.js'),
      'isSuppressionOnlyOutcome(outcome)',
      'isPublicOutcome rejects suppression-only records',
    )).toBeTruthy();
  });
});

describe('economy certification rows — the observer claims', () => {
  test('the one mover-family claim is what the production classifier actually returns', () => {
    // DERIVED from source, never re-typed: the impact kinds the generosity news
    // builders author. A renamed kind shrinks this set and reds the comparison.
    const kinds = [...read('src/domain/worldPulse/generosityNews.js')
      .matchAll(/impactKind: '([a-z_]+)'/g)].map((match) => match[1]);
    expect(kinds.length, 'generosityNews should author six impact kinds').toBe(6);
    // Classify each through the SAME function the soak observer uses, in the SAME
    // record shape it sees (a wizard-news entry carrying id, kind and impactKind).
    const families = new Set(kinds.map((impactKind) => moverFamilyOf({
      id: `wizard_news.5.${impactKind.replace('generosity_', '')}.a.b`,
      kind: 'applied',
      impactKind,
    })));
    expect([...families].sort()).toEqual(rowOf('constructiveFlowsEnabled').aliveness.moverFamilies.slice().sort());
  });

  test('the other seven rows make no family claim, and the reason is a live source fact', () => {
    for (const rule of ECONOMY_RULES.filter((key) => key !== 'constructiveFlowsEnabled')) {
      expect(rowOf(rule).aliveness.moverFamilies, `${rule} must not claim a mover family`).toEqual([]);
    }
    // WHY: the classifier matches on the FIRST family whose token list hits a
    // concatenation that includes the runtime `type` field, and `condition` is a
    // pressure token. So the same strategy move lands in a different family
    // depending on a field no module source declares.
    expect(mustExtract(
      read('scripts/audit/behavioral-observation.mjs'),
      'record?.type,',
      'the classifier reads the runtime type field',
    )).toBeTruthy();
    const bare = moverFamilyOf({ ruleFamily: 'strategy', candidateType: 'strategy_credit', ruleId: 'settlement_strategy_credit' });
    const withType = moverFamilyOf({ ruleFamily: 'strategy', candidateType: 'strategy_credit', ruleId: 'settlement_strategy_credit', type: 'condition' });
    expect(bare).toBe('place');
    expect(withType).toBe('pressure');
  });

  test('the climb-down and campaign receipts carry the id the feed requires, so both lanes narrate', () => {
    // THIS PIN WAS INVERTED on 2026-07-31, and the old direction is the point of the
    // new one. It used to assert the DEFECT: momentum's climbDownNews and supply-web's
    // four campaign builders authored a kind, a headline and reasons but NO id, and an
    // id-less entry is refused twice over (normalizeEntry returns null; the audit sink
    // pushes only id-carrying entries), so both subsystems fired and narrated nothing.
    // Both rows' `other` prose recorded that as live. The defect is repaired, so the
    // pin and the prose move together, which is why they live in one commit.
    const NOW = '2026-01-01T00:00:00.000Z';
    // Drive the REAL author rather than a hand-shaped literal: a pin built from a
    // transcribed object proves the transcription, not the writer.
    const nameOf = (id) => ({ 'sv1:aldermoor': 'Aldermoor', 'sv1:brackwater': 'Brackwater' })[id] || String(id);
    const authored = climbDownNews('sv1:aldermoor', 'sv1:brackwater', nameOf, 2.4, 1.2, { price01: 0.6 }, 'mediation', 7);
    expect(authored.id, 'the real writer mints an id in the house shape').toBe(
      'wizard_news.7.momentum_climb_down.crack.sv1_aldermoor.sv1_brackwater',
    );
    // The `crack` segment is PROVENANCE, and it is load-bearing: this receipt has a second
    // author (the DM's FORCE_RECONSIDERATION verb, realmVerbExecution.js) which can price
    // the same pair on the same tick. The feed dedupes by id, so identical ids would merge
    // the two reversals into one beat and lose a receipt the world earned.
    const forced = climbDownNews('sv1:aldermoor', 'sv1:brackwater', nameOf, 2.4, 1.2, { price01: 0.6 }, '', 7, 'forced');
    expect(forced.id).not.toBe(authored.id);
    const bothLanes = appendWizardNewsEntries({}, [authored, forced], { now: NOW });
    expect(bothLanes.entries.length, 'a forced and an organic climb-down coexist').toBe(2);

    // It survives BOTH sinks through the exact seam the kernel uses (pulseKernel appends
    // every mover's receipts through appendObservedWizardNewsEntries).
    const sink = [];
    const feed = appendObservedWizardNewsEntries({}, [authored], { now: NOW }, sink);
    expect(feed.entries.length, 'the canonical feed accepts it').toBe(1);
    expect(sink.length, 'the audit receipt sink records it').toBe(1);
    expect(feed.entries[0].headline).toContain('Aldermoor');

    // THE CONTROL, and the reason an id is mandatory rather than decorative: the SAME
    // authored entry with exactly one field removed still lands zero in both sinks. So
    // the ones above measure the id, not a feed that accepts anything.
    const { id: _dropped, ...idless } = authored;
    const controlSink = [];
    const refused = appendWizardNewsEntries({}, [idless], { now: NOW });
    expect(refused.entries.length, 'the id-less control is still refused').toBe(0);
    expect(controlSink.length).toBe(0);

    // And every emission site in both modules mints one. mustExtract throws rather than
    // returning empty when its target is gone, so each pair is anchored: the kind literal
    // proves the site still exists in this source before the id literal is required of it.
    const momentumSrc = read('src/domain/worldPulse/momentum.js');
    expect(mustExtract(momentumSrc, /kind: 'momentum_climb_down',/, 'climb-down receipt')).toBeTruthy();
    expect(mustExtract(momentumSrc, /id: `wizard_news\.\$\{tick\}\.momentum_climb_down\./, 'climb-down id')).toBeTruthy();
    const webwarSrc = read('src/domain/worldPulse/supplyWebWarfare.js');
    for (const kind of ['webwar_campaign_minted', 'webwar_campaign_abandoned', 'webwar_campaign_complete']) {
      expect(mustExtract(webwarSrc, new RegExp(`kind: '${kind}',`), `${kind} receipt`)).toBeTruthy();
      expect(mustExtract(webwarSrc, new RegExp(`id: \`wizard_news\\.\\$\\{tick\\}\\.${kind}\\.`), `${kind} id`)).toBeTruthy();
    }
    // The raid builder mints its kind through a hoisted `kind` const (it splits into
    // webwar_raid / webwar_wrong_village), so its id interpolates that const instead.
    expect(mustExtract(webwarSrc, /id: `wizard_news\.\$\{tick\}\.\$\{kind\}\./, 'raid id')).toBeTruthy();
  });
});

describe('economy certification rows — the verdicts', () => {
  test('a row with its own vocabulary grades ALIVE, and DORMANT when the switch is off', () => {
    // Transcribed SHAPE from release-30y-12s-seed1: the strategy chooser carried
    // events in every observed year, the resource lanes in most.
    const years = [
      year(1, { eventTypeCounts: { strategy_credit: 29, resource_discovery: 1 } }),
      year(2, { eventTypeCounts: { strategy_deploy: 4, resource_removal: 2 } }),
      year(3, { eventTypeCounts: { strategy_reroute: 34, flow_trade_scarcity: 1, resource_depletion: 1 } }),
    ];
    const lit = evaluateSubsystemCertification(receiptV5({ years }));
    for (const rule of ['settlementStrategyEnabled', 'resourceDynamicsEnabled', 'resourceDriftEnabled', 'tradeFlowsEnabled']) {
      expect(lit.rows.find((row) => row.rule === rule).verdict, `${rule} should be ALIVE`).toBe('ALIVE');
    }
    // CONTROL: the identical receipt with one switch dark reaches a different
    // verdict, so the ALIVE above is caused by the vocabulary and the flag together.
    const dark = evaluateSubsystemCertification(receiptV5({ rules: litRules({ settlementStrategyEnabled: false }), years }));
    expect(dark.rows.find((row) => row.rule === 'settlementStrategyEnabled').verdict).toBe('DORMANT_BY_CONFIG');
    expect(dark.rows.find((row) => row.rule === 'resourceDynamicsEnabled').verdict).toBe('ALIVE');
  });

  test('a ledger-only row is UNOBSERVED on a v4 envelope and SILENT once the census can see it', () => {
    const years = [year(1, { eventTypeCounts: { strategy_credit: 3 } }), year(2), year(3)];
    // A v4 envelope carries no worldState census, so the ONLY channel these rows
    // have is not derivable. That is an instrument gap, never a silence.
    const v4 = evaluateSubsystemCertification(receiptV4(years));
    for (const rule of ['commodityFlowEnabled', 'momentumEnabled', 'supplyWebWarfareEnabled']) {
      const row = v4.rows.find((entry) => entry.rule === rule);
      expect(row.verdict, `${rule} on a v4 receipt`).toBe('UNOBSERVED');
      expect(row.unobservedChannels).toEqual(['stateKeys']);
    }
    // A v5 TOTAL census that simply never contains the ledger is a real silence.
    const silent = evaluateSubsystemCertification(receiptV5({
      years,
      stateKeys: { pulseHistory: ledgerEntry(3, 3) },
    }));
    for (const rule of ['commodityFlowEnabled', 'momentumEnabled', 'supplyWebWarfareEnabled']) {
      expect(silent.rows.find((entry) => entry.rule === rule).verdict, `${rule} on a total census`).toBe('SILENT');
    }
    // CONTROL: the same receipt whose census DOES carry each ledger grades ALIVE,
    // proving the SILENT above measures the ledgers rather than ignoring them.
    const alive = evaluateSubsystemCertification(receiptV5({
      years,
      stateKeys: {
        'spatialLedgers.campaignPlans': ledgerEntry(2, 1),
        'spatialLedgers.commitments': ledgerEntry(3, 2),
        'spatialLedgers.commodityStocks': ledgerEntry(3, 9),
      },
    }));
    for (const rule of ['commodityFlowEnabled', 'momentumEnabled', 'supplyWebWarfareEnabled']) {
      const row = alive.rows.find((entry) => entry.rule === rule);
      expect(row.verdict, `${rule} with its ledger censused`).toBe('ALIVE');
      expect(row.firedChannels).toEqual(['stateKeys']);
    }
  });

  test('generosity cannot ride its shared families to ALIVE', () => {
    // Transcribed SHAPE from release-30y-12s-seed1: a large POST-APPLY constructive
    // family against zero selected, with no census to attribute it to this lane.
    const years = [
      year(1, { moverCounts: { constructive: 612, economy: 4 }, postApplyMoverCounts: { constructive: 612, economy: 4 } }),
      year(2, { moverCounts: { constructive: 604, economy: 9 }, postApplyMoverCounts: { constructive: 604, economy: 9 } }),
    ];
    const shared = evaluateSubsystemCertification(receiptV5({ years, stateKeys: { pulseHistory: ledgerEntry(2, 2) } }));
    const row = shared.rows.find((entry) => entry.rule === 'constructiveFlowsEnabled');
    expect(row.verdict).toBe('SILENT');
    expect(row.corroboratingOnlyEvidence).toBe(true);
    expect(row.tempo.yearsWithEvidence, 'a shared family must not lend its cadence').toBe(0);
    // CONTROL: the same receipt whose census carries a generosity-owned ledger
    // grades ALIVE, so the SILENT above is the attribution rule and not a dead row.
    const owned = evaluateSubsystemCertification(receiptV5({
      years,
      stateKeys: { 'spatialLedgers.generosityWillingness': ledgerEntry(2, 3) },
    }));
    expect(owned.rows.find((entry) => entry.rule === 'constructiveFlowsEnabled').verdict).toBe('ALIVE');
  });

  test('a slowing lane stays ALIVE and says so, at the share the completed corpus measured', () => {
    // Transcribed from release-100y-4s-seed1: resource drift touched 4 of 100
    // observed years, just under the multi_year floor of 0.05.
    const years = Array.from({ length: 100 }, (_, index) => (
      index % 25 === 0
        ? year(index, { eventTypeCounts: { resource_depletion: 2, resource_recovery: 1 } })
        : year(index, { eventTypeCounts: { resource_discovery: 1 } })
    ));
    const evaluation = evaluateSubsystemCertification(receiptV5({ years }));
    const drift = evaluation.rows.find((row) => row.rule === 'resourceDriftEnabled');
    expect(drift.verdict, 'a slowing lane is still alive').toBe('ALIVE');
    expect(drift.tempo).toMatchObject({ observedYears: 100, yearsWithEvidence: 4, floor: 0.05, meetsExpectedTempo: false });
    expect(evaluation.slowing).toContain('resourceDriftEnabled');
    // CONTROL: the sibling lane over the SAME receipt clears its own floor, so the
    // flag above tracks the measured cadence rather than the fixture being quiet.
    const dynamics = evaluation.rows.find((row) => row.rule === 'resourceDynamicsEnabled');
    expect(dynamics.tempo.meetsExpectedTempo).toBe(true);
  });

  test('every economy row is well shaped, and declares an honest tempo and evidence grade', () => {
    for (const rule of ECONOMY_RULES) {
      const row = rowOf(rule);
      expect(SUBSYSTEM_TEMPOS, `${rule}: unknown tempo`).toContain(row.expectedTempo);
      expect(SUBSYSTEM_SOAK_EVIDENCE, `${rule}: unknown evidence grade`).toContain(row.soakEvidence);
      expect(row.invariants.length, `${rule}: a row with no invariant certifies nothing`).toBeGreaterThan(0);
      for (const invariant of row.invariants) {
        expect(invariant.check.length, `${rule}: invariant ${invariant.name} has no receipt-expressible check`).toBeGreaterThan(40);
      }
      // No row in this cohort may declare soakEvidence 'unobserved': every one has a
      // channel the v5 census CAN read, and declaring the gap on the row would
      // permanently suppress the SILENT diagnosis (the soakEvidence branch of gradeRow).
      expect(row.soakEvidence, `${rule}: the evaluator, not the row, reports this instrument gap`).not.toBe('unobserved');
      expect(row.aliveness.other.length, `${rule}: the reader needs the gates and the blind spots`).toBeGreaterThan(200);
    }
  });
});
