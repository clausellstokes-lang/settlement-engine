/**
 * subsystemRowsVirtual.test.js — the ENGINE-GATED VIRTUAL certification rows
 * (CR-WR10-C), and the source claims they make.
 *
 * A certification row is a CLAIM ABOUT SOURCE: "this module gates on this key, owns
 * these containers, and emits nothing else the receipt can see". A row nobody
 * re-checks becomes fiction the first time a module is renamed or grows a candidate,
 * and a fictional row grades UNOBSERVED forever while reading like diligence. So this
 * file does three jobs, on the subsystemRowsEpistemics model:
 *
 *   1. SHAPE    the rows are authored (not pending), sit in the census because
 *               the manifest put them there, and conform to the registry contract.
 *   2. TRACE    every declared channel — and every DELIBERATELY UNdeclared one — is
 *               re-derived from the live source. The single-writer claims behind the
 *               two stateKeys rows are re-measured by scanning every setSpatialLedger
 *               call in the tree, and the "this lane mints no candidate" claim behind
 *               the empty eventTypes is re-measured against the lane's own leaves. A
 *               new writer or a new candidate reds HERE rather than rotting silently.
 *   3. VERDICT  each row reaches each verdict it can reach, against receipts that
 *               differ in exactly one field — including the one that matters most for
 *               this cohort: a receipt that cannot resolve the key at all grades
 *               UNOBSERVED, never DORMANT_BY_CONFIG, because no soak preset declares
 *               these keys and claiming "recorded off" would be a claim the receipt
 *               never made.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  SUBSYSTEM_SOAK_EVIDENCE,
  SUBSYSTEM_TEMPOS,
  evaluateSubsystemCertification,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import {
  VIRTUAL_PENDING_RULE_KEYS,
  VIRTUAL_SUBSYSTEM_ROWS,
} from '../../src/domain/certification/subsystemRowsVirtual.js';
import { ENGINE_GATED_VIRTUAL_RULE_KEYS } from '../../src/domain/worldPulse/simulationRules.js';
import { VENGEANCE_LICENSE_LEDGER_KEY } from '../../src/domain/worldPulse/vengeanceLicense.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const AXES = 'beliefAxesEnabled';
const CONQUEST = 'conquestDoctrineEnabled';
const STATECRAFT = 'infoStatecraftEnabled';
const RUMORS = 'migrationRumorsEnabled';
// Joined 2026-08-04 by lane WW-A: the WR-10 conveyance landed its first gate read, and
// CR-WR10-C item 4 binds the manifest entry and the certification row to that same
// commit. The lane's fifth row is the ZERO-KEY case — every other row here declares at
// least the shape of a container, while a conveyance rewrites three containers it does
// not own and adds none, which is why its aliveness channels are empty on purpose.
const SOVEREIGNTY = 'sovereigntyTradeEnabled';
// Joined 2026-08-04 by FP wave GR-1 under the same CR-WR10-C atomicity: the oath-holder
// identity landed its first by-name gate read, its manifest entry and its row in one
// commit. It is the lane's SECOND zero-key case, and for a different reason than the
// conveyance's — it adds one conditional FIELD inside a treaty record the peace engine
// writes on every war exit, so the census cannot separate a stamped world from an
// unstamped one even in principle.
const OATH = 'oathHolderEnabled';
// Joined 2026-08-04 by FP wave GR-0 under the same CR-WR10-C atomicity. A THIRD zero-key
// case, and the one whose emptiness was hardest to keep honest: this lane really does own
// two news kinds outright, so its row could have named a mover family and looked richer
// than its neighbours. BEHAVIORAL_MOVER_FAMILIES is a closed ten-member BEHAVIOURAL
// vocabulary, not a list of wizard_news kinds, and the only member these beats could ride
// is `war` — which would grade the row alive off the war layer's traffic in worlds where
// the flag has never been true. Empty on purpose, like the three above it.
const LIFECYCLE_VOICE = 'treatyLifecycleVoiceEnabled';
// Joined 2026-08-04 by FP wave TR-1, and CONVERTED FROM A WAVE PENDING ENTRY to an
// authored row by the cycle-1 landing lane. The conversion is not bookkeeping: a key in
// ENGINE_GATED_VIRTUAL_RULE_KEYS reaches the census, and the partition assertion below
// then demands a row and refuses a pending entry anywhere, so "manifested here, pending
// in the wave lane" is a shape this contract cannot hold. A FOURTH zero-key case, and the
// only one whose emptiness is a MOUNT fact rather than a shape fact: the lane owns a real
// single-writer container and nothing in src/ calls the writer, so a declared channel
// would grade the row SILENT in every world instead of admitting that nothing has run.
const CASUS = 'casusCommerciiEnabled';
// Joined 2026-08-05 by FP wave SP-B, all three in one commit with their manifest entries
// and their first by-name gate reads. THREE keys rather than one is J-SP-3's ruling: the
// per-family flags are what let TRADE, POPULATIONS and FAITH light their own subject
// independently, and the cost is exactly these two extra rows. All three are zero-key
// cases of the SAME shape as AXES above — each writes one OPTIONAL FIELD inside the belief
// records another subsystem's container already holds — which is why every channel on all
// three is empty and why the emptiness is a shape fact rather than a mount fact.
const SCARCITY = 'believedScarcityEnabled';
const CONDITIONS = 'believedConditionsEnabled';
const DEVOTION = 'believedDevotionEnabled';
// Joined 2026-08-05 by FP wave ES-0, with its manifest entry and its first by-name gate
// read in one commit. A FIFTH zero-key case, and the only one whose emptiness is neither
// a shape fact nor a mount fact but a BUILD fact: ES-0 lands the gate and the pure leaves
// and nothing imports them, so the layer has no caller at all yet. That is the honest
// reading and it is why the row declares unobserved with every channel empty — a
// declared channel would grade an unbuilt subsystem SILENT, which reads as broken.
const ESPIONAGE = 'espionageEnabled';
// Joined 2026-08-06 by FP wave SP-C, with its manifest entry and its first by-name gate
// read in one commit. A SIXTH zero-key case, and the only one whose emptiness is a shape
// fact AND a mount fact at once: the whole persisted surface is one optional facet inside
// worldState.dispositionStats (a container the WR-2 layer fills wherever ITS flag is lit,
// so declaring the key would grade this row off a different subsystem), and nothing calls
// the writer yet — the gate lands before its callers, on the ES-0 precedent.
const POSTURE = 'strategicPostureEnabled';
// Joined 2026-08-06 by FP wave SP-D, with its manifest entry and its first by-name gate
// read in one commit. A SEVENTH zero-key case, and the first whose emptiness is a fact
// about the KIND of wave rather than about a mount: this one is a GENERALIZATION. It adds
// no ledger, no stage and no news kind — it turns the war errand into the estate's one
// purposeful-travel substrate, and the whole persisted surface is up to three optional
// WORDS on a row worldPulse/envoyErrand.js already writes wherever ITS six war flags are
// lit. Declaring that container would grade this row off the WR-7a layer's presence.
const SPINE = 'errandSpineEnabled';
// AUTHORING ORDER, not alphabetical: the assertion below is an exact ordered equality
// against VIRTUAL_SUBSYSTEM_ROWS, so this list mirrors the file's own section order.
const VIRTUAL_RULES = Object.freeze([
  AXES, ESPIONAGE, SCARCITY, CONDITIONS, DEVOTION, POSTURE, SPINE,
  CONQUEST, STATECRAFT, RUMORS, OATH, SOVEREIGNTY, LIFECYCLE_VOICE, CASUS,
]);

const rowFor = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);

/**
 * The lane's OWN leaves — the files whose gate defines each subsystem. The rows'
 * `module` lists are wider than this (they name the callers a reader needs), and the
 * callers are shared kernels that mint candidates for a dozen other lanes, so the
 * "this lane mints no candidate" trace is scoped to the leaves. Scoping it to the
 * whole module list would measure other subsystems' vocabulary.
 */
const LANE_LEAVES = Object.freeze({
  [AXES]: ['src/domain/worldPulse/beliefAxes.js'],
  // All three subject families share ONE gate door (beliefAxes.subjectAxesActive) and ONE
  // derivation leaf, so all three name the same pair. That is the honest scope: the leaf
  // is where the bodies are, and the door is where the flag is read.
  [SCARCITY]: ['src/domain/worldPulse/beliefAxisSubjects.js', 'src/domain/worldPulse/beliefAxes.js'],
  [CONDITIONS]: ['src/domain/worldPulse/beliefAxisSubjects.js', 'src/domain/worldPulse/beliefAxes.js'],
  [DEVOTION]: ['src/domain/worldPulse/beliefAxisSubjects.js', 'src/domain/worldPulse/beliefAxes.js'],
  // The espionage lane's own leaves: the gate door where the flag is read, and the two
  // pure leaves where the bodies are. lawWord.js is in the row's wider `module` list but
  // NOT here — it is estate-wide shared vocabulary spelled by four ports, so tracing this
  // lane's claims through it would measure the war and grammar layers' words.
  [ESPIONAGE]: [
    'src/domain/worldPulse/espionage/espionageGate.js',
    'src/domain/worldPulse/espionage/espionageDoctrine.js',
    'src/domain/worldPulse/espionage/espionageMath.js',
  ],
  // The posture lane's own leaves: the door where the flag is read together with the
  // composition it feeds, and the ledger that owns the facet. Both are the lane's, and
  // the row's `module` list is the same pair — unusually narrow here and deliberately
  // so: the ledger is shared substrate, but the facet, its learn map and its decay all
  // live in it, so scoping the trace anywhere else would measure the WR-2 layer instead.
  [POSTURE]: ['src/domain/worldPulse/strategicPosture.js', 'src/domain/worldPulse/dispositionLedger.js'],
  // The spine's own leaves: the head where the flag is read and the journey is priced,
  // and the vocabulary leaf that owns the six classes, the mapping row, the consumer
  // registry and the one reader. The WRITER it delegates from (envoyErrand.js) is
  // deliberately NOT here — it is the WR-7a layer's file and tracing this lane's claims
  // through it would measure the war layer's vocabulary.
  [SPINE]: ['src/domain/worldPulse/errandMint.js', 'src/domain/worldPulse/envoyErrandVocabulary.js'],
  [CONQUEST]: ['src/domain/worldPulse/vengeanceLicense.js', 'src/domain/worldPulse/conquestDoctrineStage.js'],
  [STATECRAFT]: ['src/domain/worldPulse/informationStatecraft.js', 'src/domain/worldPulse/brokerageStamps.js'],
  [RUMORS]: ['src/domain/spatial/migrationRumors.js'],
  // The conveyance's own leaves: the writer that performs it and the read that gates
  // it. The wider `module` list names the four pure market reads a caller needs, which
  // are appraisal and reach leaves that mint nothing at all.
  [SOVEREIGNTY]: [
    'src/domain/worldPulse/sovereigntyTransfer.js',
    'src/domain/worldPulse/sovereigntyAssets.js',
  ],
  // The identity's own leaf is the whole lane: the gate, the read and the one stamp
  // writer live in a single file. The row's `module` list is the same single entry,
  // which is unusual here and is the point — the three mint doors it stamps at belong
  // to the peace engine, and naming them would measure the war layer's vocabulary.
  [OATH]: ['src/domain/worldPulse/oathHolder.js'],
  // The voice's own leaves: the gate and the beat composers, plus the registry that
  // selects their sentences. The corpus file beside them is frozen prose and mints
  // nothing, so it stays out of the trace scope for the same reason the appraisal
  // leaves do above.
  [LIFECYCLE_VOICE]: [
    'src/domain/worldPulse/treatyLifecycleVoice.js',
    'src/domain/worldPulse/grammarNews.js',
  ],
  // The casus commercii's own leaves: the gate and its writer, and the projection that
  // joins the typed evidence to the authored corpus. The taxonomy leaf beside them is a
  // dependency-free table and the receipt pools are frozen prose; both mint nothing, so
  // they stay out of the trace scope for the same reason the appraisal leaves do above.
  [CASUS]: [
    'src/domain/worldPulse/commercialReasons.js',
    'src/domain/worldPulse/commercialReasonsNews.js',
  ],
});

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const sourceFiles = walk(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p))
  .map((p) => ({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') }));

/** Resolve the ledger-key identifiers this file needs to read a write call. */
const LEDGER_KEY_IDENTIFIERS = Object.freeze({
  VENGEANCE_LICENSE_LEDGER_KEY,
});

/**
 * Every `setSpatialLedger(<state>, <key>, …)` call in src/, as key -> writing files.
 * The key argument is either a string literal or a module constant this file
 * resolves; anything else is recorded under its raw token so a new indirection is
 * visible rather than silently dropped.
 */
function spatialLedgerWriters() {
  /** @type {Map<string, Set<string>>} */
  const writers = new Map();
  const call = /setSpatialLedger\(\s*[^,()]+,\s*([^,]+?)\s*,/g;
  for (const { rel, src } of sourceFiles) {
    for (const match of src.matchAll(call)) {
      const raw = match[1].trim();
      const literal = /^'([^']+)'$/.exec(raw) || /^"([^"]+)"$/.exec(raw);
      const key = literal ? literal[1] : (LEDGER_KEY_IDENTIFIERS[raw] ?? raw);
      if (!writers.has(key)) writers.set(key, new Set());
      writers.get(key).add(rel);
    }
  }
  return writers;
}

const ledgerWriters = spatialLedgerWriters();

/** One synthetic observed year, carrying only the fields the evaluator reads. */
function year(index, { eventTypeCounts = {}, moverCounts = {} } = {}) {
  return {
    year: index,
    eventCount: Object.values(eventTypeCounts).reduce((total, value) => total + value, 0),
    eventTypeCounts,
    moverCounts,
    selectedMoverCounts: moverCounts,
    postApplyMoverCounts: {},
  };
}

/** A v5 receipt: it records its own configuration and a TOTAL worldState census. */
function receiptV5({ rules = {}, years = [year(1), year(2)], stateKeys = {} } = {}) {
  return {
    schemaVersion: 5,
    kind: 'whole_world_soak',
    caseId: 'fixture-virtual-cohort',
    seed: 'fixture',
    years: years.length,
    settlements: 12,
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

const gradeOf = (rule, receipt) => evaluateSubsystemCertification(receipt).rows
  .find((row) => row.rule === rule);

/** Every switch the census knows, lit, so a fixture only has to name what it turns OFF. */
function litRules(overrides = {}) {
  const rules = {};
  for (const key of simulationRuleKeys()) rules[key] = true;
  return { ...rules, ...overrides };
}

describe('engine-gated virtual rows — shape and partition', () => {
  test('every lane rule is authored here, in the census, and manifested', () => {
    expect(VIRTUAL_SUBSYSTEM_ROWS.map((row) => row.rule)).toEqual(VIRTUAL_RULES);
    expect(VIRTUAL_PENDING_RULE_KEYS).toEqual([]);
    // The manifest is WHY these keys are censusable at all: neither
    // DEFAULT_SIMULATION_RULES nor any preset spread declares one of them, so before
    // CR-WR10-C every row here would have read back as `unknownRows`.
    expect([...ENGINE_GATED_VIRTUAL_RULE_KEYS].sort()).toEqual([...VIRTUAL_RULES].sort());
    for (const rule of VIRTUAL_RULES) {
      expect(rowFor(rule), `${rule} has no authored row`).toBeTruthy();
      expect(simulationRuleKeys(), `${rule} did not reach the census`).toContain(rule);
      // anchored: the two assertions just above prove this rule is a live census key carrying a live authored row, so a drifted registry or census reds there first.
      expect(SUBSYSTEM_CERTIFICATION_PENDING_KEYS, `${rule} is authored AND still pending`).not.toContain(rule);
    }
  });

  test('each row conforms to the registry contract', () => {
    for (const rule of VIRTUAL_RULES) {
      const row = rowFor(rule);
      expect(SUBSYSTEM_TEMPOS).toContain(row.expectedTempo);
      expect(SUBSYSTEM_SOAK_EVIDENCE).toContain(row.soakEvidence);
      expect(row.title.length).toBeGreaterThan(0);
      // The prose is the row's whole value for a cohort no receipt can grade: it is
      // where the gate, the blind spot, and the observation that would close it live.
      expect(row.aliveness.other.length, `${rule}: the row must say what it gates and what nothing can see`).toBeGreaterThan(400);
      expect(row.invariants.length, `${rule}: a row with no invariants claims nothing falsifiable`).toBeGreaterThan(0);
      for (const invariant of row.invariants) {
        expect(invariant.name.length).toBeGreaterThan(0);
        expect(invariant.check.length).toBeGreaterThan(0);
      }
      for (const path of row.module.split(',').map((part) => part.trim())) {
        expect(sourceFiles.some((file) => file.rel === path), `${rule}: module path does not exist: ${path}`).toBe(true);
      }
    }
  });
});

describe('engine-gated virtual rows — TRACE against live source', () => {
  test('the scan is non-vacuous (a broken regex would pass every trace below)', () => {
    expect(sourceFiles.length).toBeGreaterThan(200);
    expect(ledgerWriters.size).toBeGreaterThan(10);
    // A key with a known, ordinary writer: if this stopped resolving, the
    // single-writer traces below would be measuring an empty map.
    expect(ledgerWriters.get('beliefMaps')).toBeTruthy();
  });

  test('the conquest row single-writer claim holds: one file writes the license ledger', () => {
    const writers = [...(ledgerWriters.get(VENGEANCE_LICENSE_LEDGER_KEY) || [])].sort();
    expect(writers).toEqual(['src/domain/worldPulse/vengeanceLicense.js']);
    expect(rowFor(CONQUEST).aliveness.stateKeys).toEqual([`spatialLedgers.${VENGEANCE_LICENSE_LEDGER_KEY}`]);
  });

  test('the statecraft row single-writer claims hold for all four declared containers', () => {
    const declared = rowFor(STATECRAFT).aliveness.stateKeys;
    expect(declared).toEqual([
      'spatialLedgers.credibility',
      'spatialLedgers.disinfo',
      'spatialLedgers.secrecyPostures',
      'spatialLedgers.sightPostures',
    ]);
    for (const dotted of declared) {
      const key = dotted.replace('spatialLedgers.', '');
      const writers = [...(ledgerWriters.get(key) || [])].sort();
      expect(writers, `${key} must have exactly one writer for the row's claim to be dispositive`)
        .toEqual(['src/domain/worldPulse/informationStatecraft.js']);
    }
    // beliefMaps is DELIBERATELY NOT declared even though the lie lifecycle writes
    // overrides into it: the beliefs layer owns it behind its own gate, so a lit-beliefs
    // dark-statecraft world carries the key. This trace proves the shared ownership is
    // real rather than assumed.
    expect([...(ledgerWriters.get('beliefMaps') || [])].length).toBeGreaterThan(1);
    // anchored: the assertion immediately above proves the beliefMaps writer set is populated and shared, so this exclusion cannot pass on an emptied map.
    expect(declared, 'a shared container can never carry ALIVE for one row').not.toContain('spatialLedgers.beliefMaps');
  });

  test('the empty-eventTypes claim holds: no lane leaf mints a candidate', () => {
    for (const rule of VIRTUAL_RULES) {
      expect(rowFor(rule).aliveness.eventTypes, `${rule}: the row declares no candidate vocabulary`).toEqual([]);
      for (const leaf of LANE_LEAVES[rule]) {
        const file = sourceFiles.find((entry) => entry.rel === leaf);
        expect(file, `${rule}: lane leaf missing: ${leaf}`).toBeTruthy();
        // A `candidateType` literal appearing here means the lane grew a vocabulary
        // the receipt CAN see, and the row owes it an eventTypes entry. The evidence
        // law runs in this direction too: under-claiming rots exactly like
        // over-claiming, it just reads as modesty.
        expect(
          file.src.includes('candidateType'),
          `${rule}: ${leaf} now names candidateType — declare the literal in the row's eventTypes`,
        ).toBe(false);
      }
    }
  });

  test('the empty-moverFamilies claim holds across the cohort', () => {
    for (const rule of VIRTUAL_RULES) {
      // `knowledge` is the contaminated residual family; the other nine belong to
      // lanes these subsystems do not own. Empty is the only honest reading.
      expect(rowFor(rule).aliveness.moverFamilies, `${rule}: no mover family can carry this row`).toEqual([]);
    }
  });

  test('the two zero-channel rows declare unobserved, and the two channelled rows do not', () => {
    const channels = (rule) => rowFor(rule).aliveness.eventTypes.length
      + rowFor(rule).aliveness.moverFamilies.length
      + rowFor(rule).aliveness.stateKeys.length;
    expect(channels(AXES)).toBe(0);
    expect(channels(RUMORS)).toBe(0);
    expect(rowFor(AXES).soakEvidence).toBe('unobserved');
    expect(rowFor(RUMORS).soakEvidence).toBe('unobserved');
    // A channelled row that ALSO declared `unobserved` would join the ceilinged
    // escape-hatch population (subsystemCertificationCorpus), which is full at five.
    // `indirect` is the W-J reading: the channel is real and readable the day a
    // receipt carries the flag.
    expect(channels(CONQUEST)).toBeGreaterThan(0);
    expect(channels(STATECRAFT)).toBeGreaterThan(0);
    expect(rowFor(CONQUEST).soakEvidence).toBe('indirect');
    expect(rowFor(STATECRAFT).soakEvidence).toBe('indirect');
  });
});

describe('engine-gated virtual rows — the verdicts they can reach', () => {
  test('UNOBSERVED, not DORMANT_BY_CONFIG, when the receipt cannot resolve the key', () => {
    // THE COHORT'S DEFINING VERDICT. No preset declares these keys, so a soak whose
    // rules came from the full_simulation spread carries no entry for them at all.
    // DORMANT_BY_CONFIG would claim the receipt RECORDED the switch off; it recorded
    // nothing, and an honest instrument says so.
    const receipt = receiptV5({ rules: { warLayerEnabled: true } });
    for (const rule of VIRTUAL_RULES) {
      const row = gradeOf(rule, receipt);
      expect(row.ruleState, `${rule}: an undeclared key must resolve to unknown`).toBe('unknown');
      expect(row.verdict, `${rule}: unknown configuration can never mint SILENT`).toBe('UNOBSERVED');
    }
  });

  test('DORMANT_BY_CONFIG when a receipt does record the key off', () => {
    const receipt = receiptV5({ rules: litRules(Object.fromEntries(VIRTUAL_RULES.map((r) => [r, false]))) });
    for (const rule of VIRTUAL_RULES) {
      expect(gradeOf(rule, receipt).verdict).toBe('DORMANT_BY_CONFIG');
    }
  });

  test('ALIVE for a channelled row whose own container is populated', () => {
    const receipt = receiptV5({
      rules: litRules(),
      stateKeys: {
        'spatialLedgers.vengeanceLicenses': { years: 1, maxEntries: 3, finalEntries: 0 },
      },
    });
    // maxEntries is the aliveness signal precisely because the license ledger DRAINS:
    // a final reading of zero means the debts were collected, not that nothing ran.
    expect(gradeOf(CONQUEST, receipt).verdict).toBe('ALIVE');
    // Its sibling read zero on the same receipt, so the fixture is discriminating
    // rather than lighting the whole cohort at once.
    expect(gradeOf(STATECRAFT, receipt).verdict).toBe('SILENT');
  });

  test('SILENT for a channelled row whose containers are instrumented and empty', () => {
    const receipt = receiptV5({ rules: litRules() });
    expect(gradeOf(CONQUEST, receipt).verdict).toBe('SILENT');
    expect(gradeOf(STATECRAFT, receipt).verdict).toBe('SILENT');
    // And the zero-channel rows CANNOT be dragged to a verdict by a loud world: they
    // declare nothing, so there is nothing for another subsystem's noise to fire.
    for (const rule of [AXES, RUMORS]) {
      expect(gradeOf(rule, receipt).verdict).toBe('UNOBSERVED');
      expect(gradeOf(rule, receipt).instrumentedChannels).toEqual([]);
    }
  });
});
