/**
 * tests/domain/recordInvariants.test.js — EM-R0b, THE TOWN'S OWN INVARIANTS AS A MODULE.
 *
 * SEVEN ARMS, A1 to A7, straight-line under ONE literal describe. A8 — the layering
 * boundary — is homed in `tests/build/domainGeneratorsBoundary.test.js`, which this packet
 * RUNS and never edits, so it lands no case here.
 *
 * ⭐ THE STRIDE, AND WHY IT IS SPELLED HERE. The packet's control needs a reproducible
 * sample of the golden corpus and `tests/helpers/goldenMasterCorpus.js` defines no stride,
 * sample or slice: it exports the rows and the key function and nothing else. The rule is
 * therefore written as ONE line of source below, so the sample is reproducible from the tree
 * alone, and it is GUARDED by an explicit length assertion — a stride that silently changed
 * cardinality, or that missed the pinned row, would make A1 vacuous, and no walker governs
 * `tests/domain` for vacuity.
 *
 * ⚠ EVERY LOOP COLLECTS AND ASSERTS ONCE. `tests/lint/seedLoopTotality.walker.test.js` scans
 * `tests` whole and convicts a loop that asserts inside its own body: the first failure would
 * throw and hide every row behind it, which is exactly what a totality arm must not do.
 *
 * ⚠ THE GENERATIONS ARE MEMOISED. Each stride row is a full pipeline generation; the arms
 * share one cache so the file pays for the sample once.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';
import {
  recordInvariants, CHECK_META, CHECK_IDS, CROSS_KEY_CHECKS,
} from '../../src/domain/edit/recordInvariants.js';
import {
  FLAGS_EVER_TRUE, FLAG_FIELDS, KNOWN_VIOLATIONS, FLAG_CORPUS,
} from '../../src/domain/edit/recordInvariantFlags.js';
import { RECORD_CLASSES } from '../../src/domain/edit/recordRegister.js';
import { FOOD_SECURITY_BANDS, FOOD_SECURITY_CUTS, LEGITIMACY_BANDS } from '../../src/data/bandLadders.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/edit/recordInvariants.js';

/** ⭐ THE STRIDE RULE — one line of source, reproducible from the tree alone. */
const strideOf = (rows) => rows.filter((_, at) => at % 8 === 6);

const PIN_KEY = 'town|germanic|mountain|mountain_pass|civilized|golden-master-v3';
const STRIDE_ROWS = 65;
const CHECK_COUNT = 33;
const CROSS_KEY_COUNT = 7;
const CROSS_KEY_IDS = [
  'V-EVIDENCE-ROSTER', 'V-EVIDENCE-EVENTS', 'V-EVIDENCE-TENSION', 'V-EVIDENCE-STRESS',
  'V-EVIDENCE-CONFLICT', 'V-DEFENSE-INST', 'V-STRESS-IDENTITY',
];

const generate = (config) => generateSettlementPipeline(config, null, { seed: config._seed, customContent: {} });
const copy = (value) => JSON.parse(JSON.stringify(value));

/** @type {{ key: string, record: Record<string, any> }[] | null} */
let sample = null;
function strideSample() {
  if (sample === null) {
    sample = strideOf(goldenCorpus()).map((config) => ({ key: keyOf(config), record: generate(config) }));
  }
  return sample;
}

const evidenceOf = (record) => (record.generationCoherenceReceipt?.judgments || [])
  .flatMap((judgment) => judgment.evidence || []);

/** A stride row rich enough that every check has its inputs, and clean before mutation. */
function richBase() {
  const rows = strideSample().filter((row) => {
    const record = row.record;
    const balance = record.economicViability?.metrics?.foodBalance;
    const evidence = evidenceOf(record);
    return Boolean(balance && Number.isFinite(balance.rawDeficit) && Number.isFinite(balance.importCoverage))
      && (record.activeConditions || []).length > 0
      && (record.conflicts || []).length > 0
      && evidence.some((row2) => row2.path === 'conflicts[0]')
      && evidence.some((row2) => String(row2.path).startsWith('stress['))
      && evidence.some((row2) => row2.path === 'history.currentTensions[0]')
      && evidence.some((row2) => row2.path === 'finalGraph')
      && evidence.some((row2) => row2.path === 'narrative')
      && Object.values(record.defenseProfile?.institutions || {}).flat().length > 0
      && (record.economicState?.incomeSources || []).length > 0
      && (record.powerStructure?.factions || []).some((faction) => faction.isGoverning === true)
      && Boolean(record.powerStructure?.publicLegitimacy?.breakdown)
      && recordInvariants(record).length === 0;
  });
  return rows[0];
}

/** The SMALLEST mutation of a real record that must convict exactly one check. */
const MUTANTS = {
  'V-DEPCOUNT': (r) => { r.economicViability.metrics.dependencyCount += 1; },
  'V-WARNCOUNT': (r) => { r.economicViability.metrics.warningCount += 1; },
  'V-SUMMARY-DEPS': (r) => {
    const stated = Number(r.economicViability.summary.match(/(\d+)\s+operational dependenc/)[1]);
    r.economicViability.summary = r.economicViability.summary
      .replace(`${stated} operational dependenc`, `${stated + 1} operational dependenc`);
  },
  'V-SUMMARY-HOOKS': (r) => {
    const stated = Number(r.economicViability.summary.match(/(\d+)\s+plot hooks? available/)[1]);
    r.economicViability.summary = r.economicViability.summary
      .replace(`${stated} plot hook`, `${stated + 1} plot hook`);
  },
  'V-FOOD-RAW': (r) => { r.economicViability.metrics.foodBalance.dailyProduction += 2; },
  'V-FOOD-DEF': (r) => { r.economicViability.metrics.foodBalance.deficit += 2; },
  'V-FOOD-PCT': (r) => { r.economicViability.metrics.foodBalance.deficitPercent += 2; },
  'V-FOODSEC-RAW': (r) => { r.economicState.foodSecurity.dailyProduction += 2; },
  'V-FOODSEC-DEF': (r) => { r.economicState.foodSecurity.deficit += 2; },
  'V-FOODSEC-PCT': (r) => { r.economicState.foodSecurity.deficitPct += 2; },
  'V-FOODSEC-CHAINS': (r) => { r.economicState.foodSecurity.activeChainsCount += 1; },
  'V-FOODSEC-FLAGS': (r) => {
    const card = r.economicState.foodSecurity;
    const carried = FLAG_FIELDS.economicState.filter((flag) => card[flag] === true);
    carried.forEach((flag) => { card[flag] = false; });
  },
  'V-BAND-FOODSEC': (r) => { r.economicState.foodSecurity.label = FOOD_SECURITY_BANDS.importDependent.label; },
  'V-ISOLATION': (r) => { r.isolationSupport.deficit += 1; },
  'V-COND-BAND': (r) => {
    const entry = r.activeConditions[0];
    entry.severityBand = entry.severityBand === 'low' ? 'high' : 'low';
  },
  'V-BAND-READINESS': (r) => { r.defenseProfile.readiness.label = 'Undefended'; },
  'V-INCOME-100': (r) => { r.economicState.incomeSources[0].percentage += 3; },
  'V-POWER-100': (r) => { r.powerStructure.factions[0].power += 3; },
  'V-LEGIT-SUM': (r) => {
    const card = r.powerStructure.publicLegitimacy;
    card.breakdown[Object.keys(card.breakdown)[0]] += 3;
  },
  'V-LEGIT-FLAGS': (r) => {
    const card = r.powerStructure.publicLegitimacy;
    const carried = FLAG_FIELDS.powerStructure.filter((flag) => card[flag] === true);
    carried.forEach((flag) => { card[flag] = false; });
  },
  'V-BAND-LEGITIMACY': (r) => {
    const card = r.powerStructure.publicLegitimacy;
    const part = Object.keys(card.breakdown)[0];
    card.score -= 25;
    card.breakdown[part] -= 25;
  },
  'V-GOVERNING': (r) => { r.powerStructure.governingName = `${r.powerStructure.governingName} of Nowhere`; },
  'V-FLAGVEC': (r) => {
    const card = r.economicState.foodSecurity;
    card[FLAG_FIELDS.economicState.find((flag) => card[flag] !== true)] = true;
  },
  'V-EVIDENCE-ROSTER': (r) => { r.npcs.push(copy(r.npcs[0])); },
  'V-EVIDENCE-EVENTS': (r) => { r.history.historicalEvents.push(copy(r.history.historicalEvents[0])); },
  'V-EVIDENCE-TENSION': (r) => {
    evidenceOf(r).find((row) => row.path === 'history.currentTensions[0]').evidence = 'no_such_tension';
  },
  'V-EVIDENCE-STRESS': (r) => {
    evidenceOf(r).find((row) => String(row.path).startsWith('stress[')).evidence = 'No Such Stress';
  },
  'V-EVIDENCE-CONFLICT': (r) => { r.conflicts.length = 0; },
  'V-DEFENSE-INST': (r) => {
    const held = r.defenseProfile[CHECK_META['V-DEFENSE-INST'].paths[0].split('.')[1]];
    const slot = Object.keys(held).find((name) => (held[name] || []).length > 0);
    held[slot][0].name = 'A Keep That Is Not On The Roster';
  },
  'V-STRESS-IDENTITY': (r) => { r.stressors.label = `${r.stressors.label} (moved)`; },
  'V-DEFENSE-MAGICDEP': (r) => { r.defenseProfile.magicDependency = !r.defenseProfile.magicDependency; },
  'V-DEFENSE-TRADITIONS': (r) => {
    const traditions = r.defenseProfile.traditions;
    const first = Object.keys(traditions)[0];
    traditions[first] = !traditions[first];
  },
  'V-HISTORY-AGE': (r) => { r.history.age += 1; },
};

/** A record carrying ONLY a food card, so the band reading is the only check with inputs. */
const foodOnly = (label, deficitPct, surplusPct) => ({
  economicState: { foodSecurity: { label, deficitPct, surplusPct } },
});

/** The module's own source with comments and string bodies blanked — code text only. */
const codeOnly = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/\/\/[^\n]*/g, ' ')
  .replace(/`(?:[^`\\]|\\.)*`/g, '``')
  .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
  .replace(/"(?:[^"\\\n]|\\.)*"/g, '""');

describe('EM-R0b — recordInvariants: the town\'s own invariants as a module', () => {
  it('EM-R0b A1 — the control over the declared stride, and the one known pin in both directions', () => {
    const rows = strideSample();
    expect(rows.length, 'the declared stride must keep its cardinality or the control below is a different sample')
      .toBe(STRIDE_ROWS);
    expect(rows.map((row) => row.key).includes(PIN_KEY), 'a stride that misses the pinned row makes this arm vacuous')
      .toBe(true);

    const offenders = [];
    for (const row of rows) {
      const found = recordInvariants(row.record);
      if (found.length > 0) offenders.push({ key: row.key, ids: found.map((v) => v.id), messages: found.map((v) => v.message) });
    }
    expect(rows.length - offenders.length, 'every plain generated record but the pin is clean').toBe(STRIDE_ROWS - 1);
    expect(offenders.map((row) => row.key).sort(), 'the violating-row SET equals the declared pins, both directions')
      .toEqual(KNOWN_VIOLATIONS.map((known) => known.corpusKey).sort());
    expect(offenders.map((row) => row.ids), 'and the pin carries exactly its declared check')
      .toEqual([[KNOWN_VIOLATIONS[0].id]]);
    expect(offenders[0].messages, 'with its exact message, which renders no figure')
      .toEqual(['the viability summary names a dependency count the dependencies roster does not carry']);
    expect(FLAG_CORPUS.helper, 'the declared table names the corpus it was taught on')
      .toBe('tests/helpers/goldenMasterCorpus.js');
  });

  it('EM-R0b A2 — CHECK_META is total both ways, its keys resolve in the register, and a violation carries them', () => {
    expect(CHECK_IDS.length, 'the declared roster').toBe(CHECK_COUNT);
    expect(CHECK_IDS.filter((id) => !(id in CHECK_META)), 'every declared id has a metadata row').toEqual([]);
    expect(Object.keys(CHECK_META).filter((id) => !CHECK_IDS.includes(id)), 'and every row names a declared id').toEqual([]);

    const classed = Object.keys(RECORD_CLASSES);
    const named = [...new Set(CHECK_IDS.flatMap((id) => CHECK_META[id].keys))].sort();
    expect(named.filter((key) => !classed.includes(key)), 'every key a row names is a key the register classes').toEqual([]);
    const strayPaths = [];
    for (const id of CHECK_IDS) {
      const row = CHECK_META[id];
      const astray = row.paths.filter((path) => !row.keys.includes(path.split('.')[0].replace(/\[\]$/, '')));
      if (astray.length > 0) strayPaths.push(`${id} :: ${astray.join(', ')}`);
    }
    expect(strayPaths, 'and every path entry heads at a key its own keys carry').toEqual([]);

    const derived = CHECK_IDS.filter((id) => !CHECK_META[id].arms && CHECK_META[id].keys.length > 1);
    expect([...CROSS_KEY_CHECKS], 'the cross-key set is derived, never hand-listed').toEqual(derived);
    expect([...CROSS_KEY_CHECKS], 'and it is the seven the design ships').toEqual(CROSS_KEY_IDS);
    expect(CROSS_KEY_CHECKS.length, 'a hand-added eighth reds here').toBe(CROSS_KEY_COUNT);

    const pin = strideSample().find((row) => row.key === PIN_KEY);
    const carried = recordInvariants(pin.record);
    expect(carried.every((violation) => typeof violation.kind === 'string' && violation.keys.length > 0),
      'every violation the stride produces carries its kind and at least one key').toBe(true);
    const armed = copy(richBase().record);
    MUTANTS['V-FLAGVEC'](armed);
    const flagvec = recordInvariants(armed);
    expect(flagvec.map((violation) => violation.id), 'the armed record fires the two-armed row').toEqual(['V-FLAGVEC']);
    expect(flagvec[0].keys, 'and it carries the keys of the arm that fired, never the union').toEqual(['economicState']);
  });

  it('EM-R0b A3 — guard the guard: every check has a mutation that convicts it and nothing else', () => {
    const base = richBase();
    expect(base, 'a clean stride row rich enough for every check, or the table below is vacuous').toBeTruthy();
    const verdicts = [];
    for (const id of CHECK_IDS) {
      const mutated = copy(base.record);
      MUTANTS[id](mutated);
      verdicts.push(`${id} -> ${recordInvariants(mutated).map((violation) => violation.id).join(',')}`);
    }
    expect(verdicts, 'each mutation convicts exactly its own check').toEqual(CHECK_IDS.map((id) => `${id} -> ${id}`));
    expect(Object.keys(MUTANTS).sort(), 'and no check ships without a planted mutant').toEqual([...CHECK_IDS].sort());
  });

  it('EM-R0b A4 — no threshold is written and no envelope is learned in the reading leaf', () => {
    const source = readFileSync(join(ROOT, LEAF), 'utf8');
    const code = codeOnly(source);
    const calls = ['legitimacyBandOf(', 'readinessBandOf(', 'foodSecurityBandOf(', 'severityBand('];
    expect(calls.filter((call) => !code.includes(call)), 'the four band readings call the producers own tables').toEqual([]);
    expect(code.match(/(?<![\w.])\d+\.\d+(?![\w.])/g) || [], 'no decimal literal anywhere in the code text').toEqual([]);
    const offenders = [];
    for (const line of code.split('\n')) {
      const numerals = line.match(/(?<![\w.$])\d+(?![\w.])/g) || [];
      const declares = /^const (wholeShare|neutralLegitimacyScore|oneStep) = \d+;$/.test(line.trim());
      if (!declares && numerals.some((numeral) => numeral !== '0' && numeral !== '1')) offenders.push(line.trim());
    }
    expect(offenders, 'and every numeral outside the three declared constants is a structural nought or one').toEqual([]);
  });

  it('EM-R0b A5 — the rounding rule forgives exactly half a unit at each published cut and never more', () => {
    const importDependent = FOOD_SECURITY_BANDS.importDependent.label;
    const pressured = FOOD_SECURITY_BANDS.pressured.label;
    const deficit = FOOD_SECURITY_BANDS.deficit.label;
    const secure = FOOD_SECURITY_BANDS.secure.label;
    const atImportCut = FOOD_SECURITY_CUTS.importDependent;
    const atPressuredCut = FOOD_SECURITY_CUTS.pressured;
    const table = [
      [importDependent, atImportCut], [pressured, atImportCut], [deficit, atImportCut],
      [pressured, atPressuredCut], [secure, atPressuredCut], [importDependent, atPressuredCut],
    ].map(([label, published]) => `${label} at ${published} -> ${recordInvariants(foodOnly(label, published, 0)).map((v) => v.id).join(',') || 'clean'}`);
    expect(table, 'both adjacent labels pass at each cut and a label two rungs away still reds').toEqual([
      `${importDependent} at ${atImportCut} -> clean`,
      `${pressured} at ${atImportCut} -> clean`,
      `${deficit} at ${atImportCut} -> V-BAND-FOODSEC`,
      `${pressured} at ${atPressuredCut} -> clean`,
      `${secure} at ${atPressuredCut} -> clean`,
      `${importDependent} at ${atPressuredCut} -> V-BAND-FOODSEC`,
    ]);
  });

  it('EM-R0b A6 — the flag data is declared from the corpus, never derived from a published share', () => {
    const rows = strideSample();
    const bands = [];
    for (const row of rows) {
      const label = row.record.economicState?.foodSecurity?.label;
      const key = Object.keys(FOOD_SECURITY_BANDS).find((name) => FOOD_SECURITY_BANDS[name].label === label);
      if (key !== undefined && !bands.includes(key)) bands.push(key);
    }
    expect(bands.filter((key) => !(key in FLAGS_EVER_TRUE.economicState)),
      'the declared table covers every food band the stride shows').toEqual([]);
    const legitBands = [];
    for (const row of rows) {
      const label = row.record.powerStructure?.publicLegitimacy?.label;
      const at = LEGITIMACY_BANDS.findIndex((band) => band.label === label);
      const key = at < 0 ? undefined : Object.keys(FLAGS_EVER_TRUE.powerStructure)[at];
      if (key !== undefined && !legitBands.includes(key)) legitBands.push(key);
    }
    expect(legitBands.filter((key) => !(key in FLAGS_EVER_TRUE.powerStructure)),
      'and every legitimacy band the stride shows').toEqual([]);

    const disagreements = [];
    for (const row of rows) {
      const card = row.record.economicState?.foodSecurity;
      const derived = Boolean(card) && card.deficitPct > FOOD_SECURITY_CUTS.importDependent;
      if (card && derived !== card.isDeficit) disagreements.push(`${row.key} -> the record says ${card.isDeficit}`);
    }
    expect(disagreements.length, 'a flag DERIVED from the published share disagrees with the record it describes, '
      + 'which is why the table is taught rather than computed').toBeGreaterThan(0);
  });

  it('EM-R0b A7 — absence, an unseen band, purity, idempotency and the duplication pairs', () => {
    const base = richBase().record;
    const stripped = copy(base);
    delete stripped.economicViability;
    delete stripped.isolationSupport;
    delete stripped.activeConditions;
    expect(recordInvariants(stripped).map((v) => v.id), 'a record missing three readings abstains on all of them').toEqual([]);

    const unseen = copy(base);
    unseen.economicState.foodSecurity.label = 'No Such Band';
    expect(recordInvariants(unseen).map((v) => v.id), 'a band outside the producer table abstains, never convicts').toEqual([]);

    const before = JSON.stringify(base);
    const first = recordInvariants(base);
    const second = recordInvariants(base);
    expect(JSON.stringify(base), 'the reading never mutates its argument').toBe(before);
    expect(JSON.stringify(first), 'and two readings of one record are equal').toBe(JSON.stringify(second));
    expect(Array.isArray(recordInvariants(null)) && recordInvariants(null).length, 'total over a missing record').toBe(0);

    const halves = [];
    for (const id of ['V-DEFENSE-MAGICDEP', 'V-DEFENSE-TRADITIONS', 'V-HISTORY-AGE']) {
      const one = copy(base);
      const paths = CHECK_META[id].paths;
      const owner = paths[0].split('.');
      const holder = owner.slice(0, -1).reduce((node, step) => node[step], one);
      delete holder[owner[owner.length - 1]];
      halves.push(`${id} -> ${recordInvariants(one).map((v) => v.id).join(',') || 'abstains'}`);
    }
    expect(halves, 'each duplication check abstains when either side of its pair is absent').toEqual([
      'V-DEFENSE-MAGICDEP -> abstains', 'V-DEFENSE-TRADITIONS -> abstains', 'V-HISTORY-AGE -> abstains',
    ]);
  });
});
