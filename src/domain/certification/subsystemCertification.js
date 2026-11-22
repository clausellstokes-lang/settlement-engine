/**
 * subsystemCertification.js — THE PER-SUBSYSTEM CERTIFICATION CONTRACT.
 *
 * WHY: behavioralContract.js certifies the world as a WHOLE (tempo, arcs, motion,
 * attention, controls). A whole-world pass is compatible with an individual
 * subsystem being completely dead: the completed 30-year soak ladder graded green
 * on every behavioral check while the knowledge mover selected nothing at all in
 * thirty years and the settlement-lifecycle lane founded and killed nothing across
 * a x4.8 population boom. Neither silence was a check failure, because no check
 * asked. This module asks, once per boolean rule key, and it never answers from a
 * claim: every verdict is derived from a soak receipt's own recorded fields.
 *
 * THE FOUR VERDICTS (a row grades exactly one):
 *   ALIVE             the rule was on and its declared, subsystem-specific
 *                     evidence is present in the receipt.
 *   DORMANT_BY_CONFIG the rule was off in the run this receipt records. Nothing
 *                     is claimed about the subsystem; it was not asked to run.
 *   SILENT            the rule was on and every instrumented channel read zero.
 *                     This is the knowledge-lane diagnosis and it is a finding,
 *                     never a pass.
 *   UNOBSERVED        the declared evidence is not derivable from this receipt's
 *                     schema, or the run's configuration is unknown. An honest
 *                     instrument gap. Never a pass either.
 *
 * DISPOSITIVE VERSUS CORROBORATING CHANNELS. eventTypes and stateKeys name
 * vocabulary and containers a single subsystem owns, so they can carry ALIVE.
 * moverFamilies are the ten broad behavioral macro-families, each fed by several
 * subsystems, so a family moving proves the WORLD moved, not that this row's
 * subsystem did. A row that declares a dispositive channel therefore cannot be
 * graded ALIVE off its mover family alone: that combination grades SILENT and
 * flags corroboratingOnlyEvidence, so the reader sees exactly what happened. This
 * is the same anti-vacuity law that governs the estate's negative assertions, and
 * it errs toward alarm, never toward comfort.
 *
 * WHEN THE INSTRUMENT IS PARTIAL. If at least one declared channel is instrumented
 * and reads zero, the row grades SILENT even when a sibling channel is not
 * derivable, and the uninstrumented channels are listed on the row. Downgrading to
 * UNOBSERVED would hide a real silence behind a schema gap; listing the gap keeps
 * the reader able to judge how complete the instrument was.
 *
 * WHEN ONE RULE KEY GATES TWO LANES. settlementLifecycleEnabled gates BOTH the
 * first-class founding and death candidates AND the satellite ledger, and the two
 * demonstrably run at different horizons: a one-year probe already seeds three
 * steadings while foundings and deaths first appear at the hundred-year horizon.
 * A row like that grades ALIVE (a lane did run) and carries partiallySilent with
 * the zero lane named, because averaging the two into one verdict would bury the
 * exact silence this contract exists to surface.
 *
 * INVARIANTS ARE DECLARED, NOT EXECUTED. Each row carries receipt-expressible
 * invariant descriptions. This evaluator grades ALIVENESS only and reports the
 * declared count; executing invariants against receipts is a deliberately deferred
 * lane, recorded here rather than implied by an empty pass.
 *
 * Pure and headless: no store, no React, no I/O, no clock, no randomness. Imported
 * only by tests, the audit scripts, and scripts/audit/certify-subsystems.mjs, so
 * it stays off every eager path.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/domain/subsystemCertification.test.js
 */

import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../worldPulse/simulationRules.js';
import { BASELINE_PENDING_RULE_KEYS, BASELINE_SUBSYSTEM_ROWS } from './subsystemRowsBaseline.js';
import { GROWTH_PENDING_RULE_KEYS, GROWTH_SUBSYSTEM_ROWS } from './subsystemRowsGrowth.js';
import { PEOPLE_PENDING_RULE_KEYS, PEOPLE_SUBSYSTEM_ROWS } from './subsystemRowsPeople.js';
import { PLACE_PENDING_RULE_KEYS, PLACE_SUBSYSTEM_ROWS } from './subsystemRowsPlace.js';
import { REGEN_PENDING_RULE_KEYS, REGEN_SUBSYSTEM_ROWS } from './subsystemRowsRegen.js';
import { VIRTUAL_PENDING_RULE_KEYS, VIRTUAL_SUBSYSTEM_ROWS } from './subsystemRowsVirtual.js';
import { WAR_PENDING_RULE_KEYS, WAR_SUBSYSTEM_ROWS } from './subsystemRowsWar.js';
import { WAVE_PENDING_RULE_KEYS, WAVE_SUBSYSTEM_ROWS } from './subsystemRowsWaves.js';

/** Bumped only on a breaking change to the verdict shape. @type {number} */
export const SUBSYSTEM_CERTIFICATION_VERSION = 1;

/** @type {ReadonlyArray<string>} */
export const SUBSYSTEM_VERDICTS = Object.freeze([
  'ALIVE',
  'DORMANT_BY_CONFIG',
  'SILENT',
  'UNOBSERVED',
]);

/** @type {ReadonlyArray<string>} */
export const SUBSYSTEM_TEMPOS = Object.freeze([
  'per_tick',
  'yearly',
  'multi_year',
  'rare',
  'reactive',
]);

/** @type {ReadonlyArray<string>} */
export const SUBSYSTEM_SOAK_EVIDENCE = Object.freeze(['measured', 'indirect', 'unobserved']);

/**
 * The minimum share of OBSERVED YEARS that should carry evidence for a subsystem
 * running at each declared tempo. Failing the floor never turns ALIVE into
 * SILENT (the subsystem demonstrably fired); it is reported as
 * meetsExpectedTempo:false so a slowing subsystem is visible before it dies.
 * rare and reactive have no floor beyond a single firing anywhere in the span.
 * @type {Readonly<Record<string, number>>}
 */
export const TEMPO_MIN_YEAR_SHARE = Object.freeze({
  per_tick: 0.5,
  yearly: 0.25,
  multi_year: 0.05,
  rare: 0,
  reactive: 0,
});

/**
 * @typedef {Object} SubsystemAliveness
 * @property {ReadonlyArray<string>} eventTypes exact candidateType literals the module emits
 * @property {ReadonlyArray<string>} moverFamilies BEHAVIORAL_MOVER_FAMILIES members, corroborating only
 * @property {ReadonlyArray<string>} stateKeys dotted worldState container paths the module writes
 * @property {string} other prose the reader needs: gates, nesting, known blind spots
 */
/**
 * @typedef {Object} SubsystemInvariant
 * @property {string} name
 * @property {string} description
 * @property {string} check receipt-expressible predicate description
 */
/**
 * @typedef {Object} SubsystemRow
 * @property {string} rule the boolean simulation-rule key this row certifies
 * @property {string} title human label
 * @property {string} module one or more repo-relative source paths, comma separated
 * @property {SubsystemAliveness} aliveness
 * @property {string} expectedTempo one of SUBSYSTEM_TEMPOS
 * @property {ReadonlyArray<SubsystemInvariant>} invariants
 * @property {string} soakEvidence one of SUBSYSTEM_SOAK_EVIDENCE
 */

/**
 * THE REGISTRY: one row per boolean rule key, composed from the lane files so no
 * two authors write the same bytes. Order is lane order then authored order.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const SUBSYSTEM_CERTIFICATION_REGISTRY = Object.freeze([
  ...BASELINE_SUBSYSTEM_ROWS,
  ...PEOPLE_SUBSYSTEM_ROWS,
  ...PLACE_SUBSYSTEM_ROWS,
  ...WAVE_SUBSYSTEM_ROWS,
  ...WAR_SUBSYSTEM_ROWS,
  ...REGEN_SUBSYSTEM_ROWS,
  ...GROWTH_SUBSYSTEM_ROWS,
  ...VIRTUAL_SUBSYSTEM_ROWS,
]);

/**
 * Rule keys awaiting a row. SHRINK-ONLY, per lane. A key in neither list is a
 * walker failure, which is what makes an uncertified new subsystem structurally
 * impossible.
 * @type {ReadonlyArray<string>}
 */
export const SUBSYSTEM_CERTIFICATION_PENDING_KEYS = Object.freeze([
  ...BASELINE_PENDING_RULE_KEYS,
  ...PEOPLE_PENDING_RULE_KEYS,
  ...PLACE_PENDING_RULE_KEYS,
  ...WAVE_PENDING_RULE_KEYS,
  ...WAR_PENDING_RULE_KEYS,
  ...REGEN_PENDING_RULE_KEYS,
  ...GROWTH_PENDING_RULE_KEYS,
  ...VIRTUAL_PENDING_RULE_KEYS,
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {unknown[]} */
function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {unknown} value @returns {number} */
function finite(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** @param {string} left @param {string} right @returns {number} */
function byName(left, right) {
  // Never localeCompare in the domain: the ordering must not read a runtime locale.
  return left < right ? -1 : left > right ? 1 : 0;
}

/**
 * Every boolean rule key the engine can present, from the default surface, from
 * every named preset's override spread (the virtual WAVES / ONE_REGEN / opt-in
 * keys live only in the spreads, so the defaults alone are not the census), and
 * from the ENGINE-GATED VIRTUAL manifest.
 *
 * THE THIRD SOURCE IS CR-WR10-C (2026-08-04). A key can be gated by the engine
 * with the strict `rules.<key> === true` idiom while appearing in NEITHER of the
 * first two surfaces — that is the deep-couplings law-1 dormancy idiom, and it is
 * exactly why the census used to be blind to a whole class of dark subsystem. The
 * alternative cure was to declare each key false in the full_simulation spread,
 * which costs every NEW campaign 32 serialized bytes per key and moves its state
 * hash; this one costs nothing on any world path, because the manifest is read
 * HERE and nowhere else. `tests/lint/engineGatedRuleKeys.walker.test.js` keeps the
 * manifest honest against the tree in both directions.
 *
 * @returns {string[]} sorted
 */
export function simulationRuleKeys() {
  /** @type {Set<string>} */
  const keys = new Set();
  for (const [key, value] of Object.entries(DEFAULT_SIMULATION_RULES)) {
    if (typeof value === 'boolean') keys.add(key);
  }
  for (const preset of Object.values(SIMULATION_RULE_PRESETS)) {
    for (const [key, value] of Object.entries(asRecord(asRecord(preset).rules))) {
      if (typeof value === 'boolean') keys.add(key);
    }
  }
  for (const key of ENGINE_GATED_VIRTUAL_RULE_KEYS) keys.add(key);
  return [...keys].sort(byName);
}

/**
 * The coverage audit the totality walker asserts on. Pure set arithmetic so the
 * walker can drive it with synthetic inputs and prove it reds (guard the guard).
 *
 * @param {{
 *   ruleKeys: ReadonlyArray<string>,
 *   registry: ReadonlyArray<SubsystemRow>,
 *   pendingKeys: ReadonlyArray<string>,
 * }} input
 * @returns {{
 *   ok: boolean,
 *   missing: string[],
 *   unknownRows: string[],
 *   unknownPending: string[],
 *   duplicatedRows: string[],
 *   duplicatedPending: string[],
 *   claimedTwice: string[],
 *   covered: number,
 *   pending: number,
 * }}
 */
export function auditSubsystemCoverage({ ruleKeys, registry, pendingKeys }) {
  const known = new Set(ruleKeys);
  const rowKeys = registry.map((row) => String(asRecord(row).rule || ''));
  const pending = pendingKeys.map(String);
  /** @param {string[]} list @returns {string[]} */
  const duplicatesOf = (list) => {
    /** @type {Set<string>} */
    const seen = new Set();
    /** @type {Set<string>} */
    const dupes = new Set();
    for (const key of list) {
      if (seen.has(key)) dupes.add(key);
      seen.add(key);
    }
    return [...dupes].sort(byName);
  };
  const rowSet = new Set(rowKeys);
  const pendingSet = new Set(pending);
  const missing = [...known].filter((key) => !rowSet.has(key) && !pendingSet.has(key)).sort(byName);
  const unknownRows = [...rowSet].filter((key) => !known.has(key)).sort(byName);
  const unknownPending = [...pendingSet].filter((key) => !known.has(key)).sort(byName);
  const claimedTwice = [...rowSet].filter((key) => pendingSet.has(key)).sort(byName);
  const duplicatedRows = duplicatesOf(rowKeys);
  const duplicatedPending = duplicatesOf(pending);
  return {
    ok: missing.length === 0 && unknownRows.length === 0 && unknownPending.length === 0
      && claimedTwice.length === 0 && duplicatedRows.length === 0 && duplicatedPending.length === 0,
    missing,
    unknownRows,
    unknownPending,
    duplicatedRows,
    duplicatedPending,
    claimedTwice,
    covered: rowSet.size,
    pending: pendingSet.size,
  };
}

/**
 * Resolve the boolean rule state the run this receipt records actually used.
 *
 * v5 receipts carry it: scripts/audit/whole-world-soak.mjs writes the effective
 * map into subsystems.rules. v4 receipts predate that section, so the state comes
 * from the harness constant instead: whole-world-soak.mjs builds its rules from
 * SIMULATION_RULE_PRESETS.full_simulation verbatim and overrides exactly one key
 * from the command line (--seasons), so every other key is known by construction
 * and seasonsEnabled alone stays unknown. Any other receipt kind resolves to an
 * unknown configuration, and unknown configuration can never mint SILENT.
 *
 * @param {Record<string, unknown>} receipt
 * @param {Record<string, unknown>|null} override caller-supplied rules, when the operator knows them
 * @returns {{ rules: Record<string, boolean>, source: string, complete: boolean }}
 */
function resolveReceiptRules(receipt, override) {
  /** @param {Record<string, unknown>} raw @returns {Record<string, boolean>} */
  const booleansOf = (raw) => {
    /** @type {Record<string, boolean>} */
    const out = {};
    for (const [key, value] of Object.entries(raw)) {
      if (typeof value === 'boolean') out[key] = value;
    }
    return out;
  };
  if (override && Object.keys(override).length > 0) {
    return { rules: booleansOf(override), source: 'caller', complete: true };
  }
  const declared = asRecord(asRecord(receipt).subsystems);
  const declaredRules = asRecord(declared.rules);
  if (Object.keys(declaredRules).length > 0) {
    return { rules: booleansOf(declaredRules), source: 'receipt', complete: true };
  }
  if (receipt.kind === 'whole_world_soak') {
    const harness = booleansOf(asRecord(asRecord(SIMULATION_RULE_PRESETS.full_simulation).rules));
    delete harness.seasonsEnabled;
    return { rules: harness, source: 'harness_default', complete: false };
  }
  return { rules: {}, source: 'unknown', complete: false };
}

/**
 * @param {Array<Record<string, unknown>>} years
 * @param {string} field
 * @param {ReadonlyArray<string>} members
 * @returns {{ declared: boolean, derivable: boolean, total: number, yearsWithEvidence: number, counts: Record<string, number> }}
 */
function perYearChannel(years, field, members) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const member of members) counts[member] = 0;
  let derivable = false;
  let total = 0;
  let yearsWithEvidence = 0;
  for (const year of years) {
    const bucket = asRecord(year[field]);
    // Derivable means the SCHEMA carries this channel, not that it is populated.
    // An empty bucket is a genuinely quiet year and must count as a zero reading,
    // otherwise a dead subsystem would hide behind an instrument-gap verdict.
    if (Object.prototype.hasOwnProperty.call(year, field)) derivable = true;
    let inYear = 0;
    for (const member of members) {
      const value = finite(bucket[member]);
      counts[member] += value;
      inYear += value;
    }
    total += inYear;
    if (inYear > 0) yearsWithEvidence += 1;
  }
  return { declared: members.length > 0, derivable, total, yearsWithEvidence, counts };
}

/**
 * @param {Record<string, unknown>} receipt
 * @param {ReadonlyArray<string>} keys
 * @param {number} observedYears
 * @returns {{ declared: boolean, derivable: boolean, total: number, years: number, counts: Record<string, number> }}
 */
function stateKeyChannel(receipt, keys, observedYears) {
  const subsystems = asRecord(asRecord(receipt).subsystems);
  const census = asRecord(subsystems.stateKeys);
  // Absence is only dispositive when the census claims to be TOTAL: it enumerated
  // every worldState container at every observed year, so a key it omits was
  // never present. Without that claim, or without a single observed year to
  // census, the channel is an instrument gap.
  const derivable = subsystems.stateKeysComplete === true && observedYears > 0;
  /** @type {Record<string, number>} */
  const counts = {};
  let total = 0;
  let years = 0;
  for (const key of keys) {
    const entry = asRecord(census[key]);
    const maxEntries = finite(entry.maxEntries);
    counts[key] = maxEntries;
    total += maxEntries;
    years = Math.max(years, finite(entry.years));
  }
  return { declared: keys.length > 0, derivable, total, years, counts };
}

/**
 * Grade one registry row against one receipt.
 *
 * @param {SubsystemRow} row
 * @param {Array<Record<string, unknown>>} years
 * @param {Record<string, unknown>} receipt
 * @param {{ rules: Record<string, boolean>, source: string }} config
 */
function gradeRow(row, years, receipt, config) {
  const aliveness = asRecord(row.aliveness);
  const eventTypes = asArray(aliveness.eventTypes).map(String);
  const moverFamilies = asArray(aliveness.moverFamilies).map(String);
  const stateKeys = asArray(aliveness.stateKeys).map(String);
  const events = perYearChannel(years, 'eventTypeCounts', eventTypes);
  const movers = perYearChannel(years, 'moverCounts', moverFamilies);
  const selectedMovers = perYearChannel(years, 'selectedMoverCounts', moverFamilies);
  const postApplyMovers = perYearChannel(years, 'postApplyMoverCounts', moverFamilies);
  const state = stateKeyChannel(receipt, stateKeys, years.length);

  const ruleValue = config.rules[row.rule];
  const ruleState = typeof ruleValue === 'boolean' ? (ruleValue ? 'on' : 'off') : 'unknown';

  /** @type {string[]} */
  const firedChannels = [];
  /** @type {string[]} */
  const unobservedChannels = [];
  /** @type {string[]} */
  const instrumentedChannels = [];
  /** @type {string[]} */
  const silentChannels = [];
  /** @param {string} name @param {{ declared: boolean, derivable: boolean, total: number }} channel */
  const classify = (name, channel) => {
    if (!channel.declared) return;
    if (!channel.derivable) {
      unobservedChannels.push(name);
      return;
    }
    instrumentedChannels.push(name);
    if (channel.total > 0) firedChannels.push(name);
    else silentChannels.push(name);
  };
  classify('eventTypes', events);
  classify('moverFamilies', movers);
  classify('stateKeys', state);

  const dispositiveDeclared = eventTypes.length > 0 || stateKeys.length > 0;
  const dispositiveFired = firedChannels.includes('eventTypes') || firedChannels.includes('stateKeys');
  const corroboratingOnlyEvidence = dispositiveDeclared
    && !dispositiveFired
    && firedChannels.includes('moverFamilies');
  const alive = dispositiveDeclared ? dispositiveFired : firedChannels.length > 0;

  let verdict;
  if (ruleState === 'off') {
    verdict = 'DORMANT_BY_CONFIG';
  } else if (alive) {
    verdict = 'ALIVE';
  } else if (row.soakEvidence === 'unobserved') {
    // The row itself declares that this soak cannot see the subsystem. Honour the
    // declaration rather than reporting a silence the instrument cannot support.
    verdict = 'UNOBSERVED';
  } else if (instrumentedChannels.length === 0 || ruleState === 'unknown') {
    verdict = 'UNOBSERVED';
  } else {
    verdict = 'SILENT';
  }

  const observedYears = years.length;
  // Tempo measures the channels that can carry ALIVE. Counting a shared mover
  // family here would give a SILENT row a healthy-looking cadence built out of
  // other subsystems' work. The stateKeys census is a per-year presence count, so
  // it stands in when the row has no per-year channel of its own.
  const yearsWithEvidence = dispositiveDeclared
    ? Math.max(events.yearsWithEvidence, events.yearsWithEvidence > 0 ? 0 : state.years)
    : movers.yearsWithEvidence;
  const floor = finite(TEMPO_MIN_YEAR_SHARE[row.expectedTempo]);
  const share = observedYears > 0 ? yearsWithEvidence / observedYears : 0;

  return {
    rule: row.rule,
    title: row.title,
    module: row.module,
    verdict,
    ruleState,
    expectedTempo: row.expectedTempo,
    soakEvidence: row.soakEvidence,
    corroboratingOnlyEvidence,
    // A rule key can gate more than ONE lane (settlementLifecycleEnabled gates
    // both the first-class founding/death candidates and the satellite ledger).
    // When one lane fires and another reads zero, the row is honestly ALIVE and
    // the zero lane is the finding, so it is named rather than averaged away.
    partiallySilent: firedChannels.length > 0 && silentChannels.length > 0,
    firedChannels,
    silentChannels,
    instrumentedChannels,
    unobservedChannels,
    evidence: {
      eventTypes: { total: events.total, counts: events.counts, derivable: events.derivable },
      moverFamilies: {
        total: movers.total,
        counts: movers.counts,
        selected: selectedMovers.counts,
        postApply: postApplyMovers.counts,
        derivable: movers.derivable,
      },
      stateKeys: { total: state.total, counts: state.counts, derivable: state.derivable },
    },
    tempo: {
      expected: row.expectedTempo,
      observedYears,
      yearsWithEvidence,
      share,
      floor,
      meetsExpectedTempo: verdict === 'ALIVE'
        && (floor === 0 ? yearsWithEvidence > 0 : share >= floor),
    },
    invariantsDeclared: asArray(row.invariants).length,
    invariantsChecked: 0,
  };
}

/**
 * Grade every registry row against one soak receipt. Pure: receipt in, verdicts
 * out. Total on garbage (a malformed receipt yields UNOBSERVED rows, never a
 * throw and never a pass).
 *
 * @param {unknown} rawReceipt a whole-world soak receipt (schema v4 or v5)
 * @param {{ rules?: Record<string, unknown> }} [options] caller-known rule state, for
 *   receipts whose configuration is not recorded and not inferable
 */
export function evaluateSubsystemCertification(rawReceipt, options = {}) {
  const receipt = asRecord(rawReceipt);
  const behavioral = asRecord(receipt.behavioral);
  const years = asArray(behavioral.yearly).map(asRecord);
  const config = resolveReceiptRules(receipt, asRecord(options.rules));
  const rows = SUBSYSTEM_CERTIFICATION_REGISTRY.map((row) => gradeRow(row, years, receipt, config));
  /** @type {Record<string, number>} */
  const counts = {};
  for (const verdict of SUBSYSTEM_VERDICTS) counts[verdict] = 0;
  for (const row of rows) counts[row.verdict] += 1;
  const coverage = auditSubsystemCoverage({
    ruleKeys: simulationRuleKeys(),
    registry: SUBSYSTEM_CERTIFICATION_REGISTRY,
    pendingKeys: SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  });
  const subsystems = asRecord(receipt.subsystems);
  return {
    schemaVersion: SUBSYSTEM_CERTIFICATION_VERSION,
    kind: 'subsystem_certification_evaluation',
    receipt: {
      caseId: receipt.caseId == null ? null : String(receipt.caseId),
      seed: receipt.seed == null ? null : String(receipt.seed),
      years: finite(receipt.years),
      settlements: finite(receipt.settlements),
      schemaVersion: finite(receipt.schemaVersion),
      behavioralSchemaVersion: finite(behavioral.schemaVersion),
      observedYears: years.length,
      presetId: subsystems.presetId == null ? null : String(subsystems.presetId),
    },
    configSource: config.source,
    configComplete: config.complete,
    rows,
    counts,
    alive: rows.filter((row) => row.verdict === 'ALIVE').map((row) => row.rule),
    silent: rows.filter((row) => row.verdict === 'SILENT').map((row) => row.rule),
    unobserved: rows.filter((row) => row.verdict === 'UNOBSERVED').map((row) => row.rule),
    dormant: rows.filter((row) => row.verdict === 'DORMANT_BY_CONFIG').map((row) => row.rule),
    slowing: rows.filter((row) => row.verdict === 'ALIVE' && !row.tempo.meetsExpectedTempo)
      .map((row) => row.rule),
    partiallySilent: rows.filter((row) => row.partiallySilent).map((row) => row.rule),
    coverage,
    pendingRuleKeys: [...SUBSYSTEM_CERTIFICATION_PENDING_KEYS].sort(byName),
    claimBoundary: 'This evaluation grades subsystem ALIVENESS against one receipt. A SILENT or UNOBSERVED row is a finding to inspect, never an engine failure by itself, and no verdict here writes or widens a certification manifest.',
  };
}
