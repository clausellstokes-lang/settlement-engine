import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { buildObservedCorpus, OBSERVED_SCALAR_FIELDS, scalarObservationsOf } from '../../scripts/lib/observed-shape-corpus.mjs';
import {
  PROSE_FAMILY_PROTECTED_SUBSTRATE,
  compareProseFamilyRows,
  deriveProseFamilyContract,
  proseFamilyRowsSha256,
  validateProseFamilyBaseline,
} from '../../scripts/lib/prose-family-contract.mjs';
import { NEWS_VOICE_PROTECTED_SUBSTRATE } from '../../scripts/lib/news-voice-contract.mjs';
import { PREDICATES, makeContext } from '../../scripts/lib/premortem-triggers.mjs';
import * as canonEventModule from '../../src/domain/events/prepareCanonEvent.js';
import * as chronicleModule from '../../src/lib/chronicle.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const clone = (value) => JSON.parse(JSON.stringify(value));
const codepoint = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const normalizedPath = (row) => row.path.map((part) => (part.kind === 'index' ? '[]' : part.value))
  .reduce((out, part) => (part === '[]' ? `${out}[]` : out ? `${out}.${part}` : part), '');
const projectionOf = (rows) => rows.map((row) => [normalizedPath(row), row.value])
  .sort((left, right) => codepoint(JSON.stringify(left), JSON.stringify(right)));
const replace = (rows, target, update) => rows.map((row) => (row === target ? update(row) : row));
const familyTotal = (contract, family) => contract.familyTotals.find((row) => row.family === family);
const EXPECTED_PROSE_SUBSTRATE = [
  'scripts/lib/observed-shape-corpus.mjs', 'scripts/lib/prose-family-contract.mjs',
  'src/domain/events/applyEvent.js', 'src/domain/events/eventPipeline.js',
  'src/domain/events/prepareCanonEvent.js', 'src/domain/events/registry.js',
  'src/domain/region/graph.js', 'src/domain/region/propagation.js',
  'src/domain/worldPulse/advanceInterval.js', 'src/domain/worldPulse/provenanceKernel.js',
  'src/domain/worldPulse/pulseKernel.js', 'src/domain/worldPulse/warTermination.js',
  'src/domain/worldPulse/worldState.js', 'src/lib/chronicle.js',
  'tests/lint/.prose-family-contract-baseline.json',
];
const EXPECTED_UNION = [
  'scripts/lib/news-headline-contract.mjs', 'scripts/lib/news-voice-contract.mjs',
  'scripts/lib/observed-shape-corpus.mjs', 'scripts/lib/prose-family-contract.mjs',
  'src/domain/events/applyEvent.js', 'src/domain/events/eventPipeline.js',
  'src/domain/events/prepareCanonEvent.js', 'src/domain/events/registry.js',
  'src/domain/region/graph.js', 'src/domain/region/propagation.js',
  'src/domain/region/wizardNews.js', 'src/domain/worldPulse/advanceInterval.js',
  'src/domain/worldPulse/applyWorldPulse.js', 'src/domain/worldPulse/npcAgency.js',
  'src/domain/worldPulse/provenanceKernel.js', 'src/domain/worldPulse/pulseKernel.js',
  'src/domain/worldPulse/warTermination.js', 'src/domain/worldPulse/worldPulseFeedCuration.js',
  'src/domain/worldPulse/worldState.js', 'src/lib/chronicle.js',
  'tests/lint/.news-headline-contract-baseline.json', 'tests/lint/.news-voice-baseline.json',
  'tests/lint/.prose-family-contract-baseline.json',
];

let baseline; let scalarRows; let scalarMeta; let live; let second; let canonRoad; let chronicleRoad;

describe('four durable prose-family exact-totality contract', () => {
  beforeAll(async () => {
    baseline = validateProseFamilyBaseline(JSON.parse(readFileSync(
      join(ROOT, 'tests/lint/.prose-family-contract-baseline.json'), 'utf8',
    )));
    const prepareSpy = vi.spyOn(canonEventModule, 'prepareAuthoritativeCanonEvent');
    const createSpy = vi.spyOn(chronicleModule, 'createChronicleEntry');
    const appendSpy = vi.spyOn(chronicleModule, 'appendChronicleEntry');
    const corpus = await buildObservedCorpus({ scalarFields: OBSERVED_SCALAR_FIELDS });
    const canonIndex = prepareSpy.mock.calls.findIndex(([input]) => input?.event?.id === 'osr.canon.cut-route');
    const createIndex = createSpy.mock.calls.findIndex(([input]) => input?.triggeredBy === 'observed-shape-corpus');
    const entry = createSpy.mock.results[createIndex]?.value;
    const appendIndex = appendSpy.mock.calls.findIndex(([, candidate]) => candidate === entry);
    canonRoad = { input: prepareSpy.mock.calls[canonIndex]?.[0], result: prepareSpy.mock.results[canonIndex]?.value };
    chronicleRoad = { createInput: createSpy.mock.calls[createIndex]?.[0], entry,
      appendList: appendSpy.mock.calls[appendIndex]?.[0], appendEntry: appendSpy.mock.calls[appendIndex]?.[1],
      appended: appendSpy.mock.results[appendIndex]?.value };
    prepareSpy.mockRestore(); createSpy.mockRestore(); appendSpy.mockRestore();
    scalarRows = corpus.scalarObservations; scalarMeta = corpus.scalarMeta;
    live = deriveProseFamilyContract(scalarRows, scalarMeta);
    second = deriveProseFamilyContract(scalarRows, scalarMeta);
  }, 900_000);

  it('A1 reconstructs the exact four-family AO-0 corpus twice from one build', () => {
    expect(second).toEqual(live);
    expect(live.corpus).toEqual(baseline.corpus);
    expect(live).toMatchObject({ familyTotals: baseline.familyTotals, totals: baseline.totals });
    const roots = [...new Set(scalarRows.map((row) => `${row.root}:${row.rootOrdinal}`))];
    expect(roots).toEqual([
      ...[...Array(12).keys()].map((index) => `pulseResult:${index}`),
      'worldState:12', 'wizardNews:13', 'canonEventResult:14', 'aiChronicle:15',
    ]);
    expect(live.rows.some((row) => /wizardNews/i.test(row.path))).toBe(false);
    expect(live.rows.some((row) => /(?:^|\.)(?:id|time|timestamp|createdAt|updatedAt|editedAt|appliedAt)(?:\[\]|\.|$)/.test(row.path))).toBe(false);
  });

  it('A2 rejects malformed selector axes while retaining nulls and projected nested gaps', () => {
    const narrative = scalarRows.find((row) => row.root === 'canonEventResult'
      && row.path.at(-1)?.value === 'narrativeSummary');
    expect(narrative).toBeTruthy();
    const selectedFamily = (row) => (
      (row.root === 'canonEventResult' && row.path[0]?.value === 'nextEventLog')
      || (row.root === 'worldState' && row.path[0]?.value === 'pulseHistory')
      || (row.root === 'pulseResult' && row.path[0]?.value === 'regionalGraph' && row.path[1]?.value === 'eventLog')
      || row.root === 'aiChronicle'
    );
    const nullHomes = new Map();
    for (const row of scalarRows.filter((candidate) => candidate.value === null && selectedFamily(candidate))) {
      const path = normalizedPath(row); nullHomes.set(path, (nullHomes.get(path) || 0) + 1);
    }
    expect(Object.fromEntries([...nullHomes].sort(([left], [right]) => codepoint(left, right)))).toEqual({
      'pulseHistory[].consequenceOutcomes[].type': 5,
      'pulseHistory[].impactDigest[].channelType': 148,
      'pulseHistory[].mechanicalOutcomes[].type': 4,
      'pulseHistory[].mechanicalRumorSeeds[].channelType': 30,
      'pulseHistory[].selectedOutcomes[].type': 1,
    });
    const pathEdit = (row, index, value) => ({ ...row, path: row.path.map((part, offset) => (
      offset === index ? value(part) : part
    )) });
    const regional = scalarRows.find((row) => row.root === 'pulseResult'
      && row.path[0]?.value === 'regionalGraph' && row.path[1]?.value === 'eventLog');
    const movedRegional = scalarRows.map((row) => (row.rootOrdinal === regional.rootOrdinal
      && row.path[2]?.value === regional.path[2].value ? pathEdit(row, 2, (part) => ({ ...part, value: 999 })) : row));
    const invalid = [
      [...scalarRows, clone(narrative)],
      replace(scalarRows, narrative, (row) => pathEdit(row, row.path.length - 1, (part) => ({ ...part, extra: true }))),
      replace(scalarRows, narrative, (row) => pathEdit(row, 1, (part) => ({ ...part, value: 1 }))),
      replace(scalarRows, narrative, (row) => pathEdit(row, row.path.length - 1, () => ({ kind: 'field', value: 'narrative.Summary' }))),
      replace(scalarRows, narrative, (row) => ({ ...row, value: ' ' })),
      replace(scalarRows, narrative, (row) => ({ ...row, value: 1 })),
      scalarRows.filter((row) => row.root !== 'aiChronicle'),
      [...scalarRows, { root: 'campaign', rootOrdinal: 16, path: [{ kind: 'field', value: 'summary' }], value: 'fifth' }],
      movedRegional,
    ];
    for (const candidate of invalid) expect(() => deriveProseFamilyContract(candidate, scalarMeta)).toThrow();
    const nested = scalarRows.find((row) => row.root === 'worldState'
      && row.path.some((part) => part.value === 'rollExplanations'));
    expect(nested).toBeTruthy();
    expect(() => deriveProseFamilyContract(scalarRows.filter((row) => row !== nested), scalarMeta)).not.toThrow();
  });

  it('A3 freezes all 63 identities counts bytes digest and movement polarities', () => {
    expect(live.rows).toEqual(baseline.rows);
    expect(compareProseFamilyRows(live.rows, baseline.rows)).toBe(true);
    expect(Buffer.byteLength(JSON.stringify(live.rows))).toBe(8280);
    expect(live.rowsSha256).toBe('8f83fa6ca2fc1411376220e55235ea392e76d98596f1bfd8c3eb52480b8469ae');
    const counted = live.rows.findIndex((row) => row.occurrences > row.distinctValues);
    const movements = [
      [...clone(live.rows), { family: 'timeline', path: 'zz', field: 'type', distinctValues: 1, occurrences: 1 }],
      clone(live.rows).map((row, index) => (index === counted ? { ...row, occurrences: row.occurrences + 1 } : row)),
      clone(live.rows).map((row, index) => (index === counted ? { ...row, occurrences: row.occurrences - 1 } : row)),
      clone(live.rows).slice(1),
      clone(live.rows).map((row, index) => (index === live.rows.length - 1 ? { ...row, path: 'zz' } : row)),
    ];
    for (const candidate of movements) expect(() => compareProseFamilyRows(candidate, baseline.rows)).toThrow(/new|grown|shrunk|vanished|sorted/);
    const counterfeit = clone(baseline); counterfeit.rows = counterfeit.rows.slice(7);
    counterfeit.familyTotals[0] = { family: 'chronicle', identities: 0, distinctValues: 0, occurrences: 0 };
    counterfeit.totals = { families: 3, identities: 56, distinctValues: 1301, occurrences: 5878 };
    counterfeit.rowsSha256 = proseFamilyRowsSha256(counterfeit.rows);
    expect(() => validateProseFamilyBaseline(counterfeit)).toThrow(/immutable/);
    for (const mutate of [
      (row) => { row.rowsSha256 = '0'.repeat(64); },
      (row) => { row.rows[0].extra = true; },
      (row) => { row.rows.splice(1, 0, clone(row.rows[0])); },
      (row) => { [row.rows[0], row.rows[1]] = [row.rows[1], row.rows[0]]; },
    ]) { const candidate = clone(baseline); mutate(candidate); expect(() => validateProseFamilyBaseline(candidate)).toThrow(); }
  });

  it('A4 closes the one authoritative timeline road at 4 8 12', () => {
    expect(familyTotal(live, 'timeline')).toEqual({ family: 'timeline', identities: 4, distinctValues: 8, occurrences: 12 });
    const timeline = scalarRows.filter((row) => row.root === 'canonEventResult');
    expect(timeline).toHaveLength(12);
    const values = new Map(timeline.map((row) => [normalizedPath(row), row.value]));
    expect(values.get('nextEventLog[].event.type')).toBe('CUT_TRADE_ROUTE');
    expect(values.get('nextEventLog[].event.cause')).toBe('player_action');
    expect(values.get('nextEventLog[].narrativeSummary')).toEqual(expect.stringMatching(/\S/));
    expect([...values.keys()].some((path) => /flavor|rename|destroy|table/i.test(path))).toBe(false);
    expect(canonRoad.input).toMatchObject({ phase: 'canon', eventLog: [], now: '2026-01-01T00:00:00.000Z',
      event: { id: 'osr.canon.cut-route', type: 'CUT_TRADE_ROUTE', targetId: 'Observed North Road', payload: {}, cause: 'player_action' } });
    expect(canonRoad.result).toMatchObject({ ok: true }); expect(canonRoad.result.nextEventLog).toHaveLength(1);
    expect(projectionOf(scalarObservationsOf([{ name: 'canonEventResult', value: { nextEventLog: canonRoad.result.nextEventLog } }], { fields: OBSERVED_SCALAR_FIELDS })))
      .toEqual(projectionOf(timeline));
  });

  it('A5 closes twelve pulse-history records and pins overlapping headline aliases', () => {
    expect(familyTotal(live, 'pulseHistory')).toEqual({ family: 'pulseHistory', identities: 50, distinctValues: 1286, occurrences: 5665 });
    const history = scalarRows.filter((row) => row.root === 'worldState');
    expect([...new Set(history.map((row) => row.path[1].value))]).toEqual([...Array(12).keys()]);
    const headline = (home) => live.rows.find((row) => row.path === `pulseHistory[].${home}[].headline`);
    expect(headline('selectedOutcomes')).toMatchObject({ distinctValues: 80, occurrences: 151 });
    expect(headline('mechanicalOutcomes')).toMatchObject({ distinctValues: 24, occurrences: 77 });
    expect(headline('consequenceOutcomes')).toMatchObject({ distinctValues: 81, occurrences: 240 });
  });

  it('A6 reaches the regional audit log while proving its selected prose zero', () => {
    expect(familyTotal(live, 'regionalLog')).toEqual({ family: 'regionalLog', identities: 2, distinctValues: 7, occurrences: 201 });
    expect(scalarMeta).toMatchObject({ regionalEventLog: 109, regionalEventLogUnique: 109 });
    const regional = scalarRows.filter((row) => row.root === 'pulseResult'
      && row.path[0]?.value === 'regionalGraph' && row.path[1]?.value === 'eventLog');
    expect([...new Set(regional.map((row) => row.rootOrdinal))]).toEqual([...Array(12).keys()]);
    expect(new Set(regional.map((row) => `${row.rootOrdinal}|${row.path[2].value}`)).size).toBe(109);
    expect(live.rows.filter((row) => row.family === 'regionalLog')).toEqual([
      { family: 'regionalLog', path: 'regionalGraph.eventLog[].changes[].kind', field: 'kind', distinctValues: 6, occurrences: 92 },
      { family: 'regionalLog', path: 'regionalGraph.eventLog[].sourceEvent.type', field: 'type', distinctValues: 1, occurrences: 109 },
    ]);
    const prose = new Set(['headline', 'narrativeSummary', 'reason', 'reasons', 'summary', 'summaryText', 'thesis', 'triggeredBy']);
    expect(live.rows.filter((row) => row.family === 'regionalLog' && prose.has(row.field))).toEqual([]);
  });

  it('A7 closes the pure Chronicle create-and-append road at 7 7 7', () => {
    expect(familyTotal(live, 'chronicle')).toEqual({ family: 'chronicle', identities: 7, distinctValues: 7, occurrences: 7 });
    const chronicle = scalarRows.filter((row) => row.root === 'aiChronicle');
    expect(chronicle).toHaveLength(7);
    expect(Object.fromEntries(chronicle.map((row) => [normalizedPath(row), row.value]))).toEqual({
      '[].reason': 'progression', '[].aiSettlement.thesis': 'Observed settlement thesis',
      '[].aiDailyLife.summary': 'Observed daily life summary', '[].triggeredBy': 'observed-shape-corpus',
      '[].mode': 'full', '[].thesis': 'Observed settlement thesis', '[].summaryText': 'Observed settlement thesis',
    });
    expect(chronicle.some((row) => ['id', 'createdAt'].includes(row.path.at(-1)?.value))).toBe(false);
    expect(scalarRows.some((row) => row.root === 'campaign')).toBe(false);
    expect(chronicleRoad.createInput).toEqual({ reason: 'progression',
      aiSettlement: { thesis: 'Observed settlement thesis' }, aiDailyLife: { summary: 'Observed daily life summary' },
      triggeredBy: 'observed-shape-corpus', mode: 'full' });
    expect(chronicleRoad.appendList).toEqual([]); expect(chronicleRoad.appendEntry).toBe(chronicleRoad.entry);
    expect(chronicleRoad.appended).toEqual([chronicleRoad.entry]);
    expect(projectionOf(scalarObservationsOf([{ name: 'aiChronicle', value: chronicleRoad.appended }], { fields: OBSERVED_SCALAR_FIELDS })))
      .toEqual(projectionOf(chronicle));
  });

  it('A8 reconciles hazard premortem mutation and lighting governance', () => {
    expect(Object.isFrozen(PROSE_FAMILY_PROTECTED_SUBSTRATE)).toBe(true);
    expect(PROSE_FAMILY_PROTECTED_SUBSTRATE).toEqual(EXPECTED_PROSE_SUBSTRATE); expect(PROSE_FAMILY_PROTECTED_SUBSTRATE).toHaveLength(15);
    const hazardRegistry = JSON.parse(readFileSync(join(ROOT, 'scripts/hazard-registry.json'), 'utf8'));
    const hazard = hazardRegistry.classes.find((row) => row.id === 'HZ-CROSSHOME');
    expect(Object.keys(hazard)).toHaveLength(10);
    expect({ classes: hazardRegistry.classes.length, status: hazard.status, acceptedReason: hazard.acceptedReason, instances: hazard.instances, inChain: hazard.enforcer.inChain })
      .toEqual({ classes: 29, status: 'MACHINERY', acceptedReason: null, instances: 53, inChain: true });
    expect(hazard.enforcer.paths).toEqual(expect.arrayContaining([
      'tests/lint/proseFamilyContract.walker.test.js', 'scripts/lib/prose-family-contract.mjs',
      'tests/lint/.prose-family-contract-baseline.json',
    ]));
    const predicate = PREDICATES.find((row) => row.id === 'cross-home-voice-substrate-touched');
    const context = makeContext({ root: ROOT, rev: null });
    const union = [...new Set([...NEWS_VOICE_PROTECTED_SUBSTRATE, ...PROSE_FAMILY_PROTECTED_SUBSTRATE])].sort(codepoint);
    expect(union).toEqual(EXPECTED_UNION); expect(union).toHaveLength(23); expect(predicate.population(context).items).toEqual(EXPECTED_UNION);
    expect(predicate.sources).toEqual(['scripts/lib/news-voice-contract.mjs', 'scripts/lib/prose-family-contract.mjs']);
    expect(predicate.run(context, predicate.synthetic(context))).toHaveLength(1);
    const mutation = JSON.parse(readFileSync(join(ROOT, 'scripts/mutation-coverage-manifest.json'), 'utf8')).invariants['tests/lint/proseFamilyContract.walker.test.js'];
    expect(mutation).toMatchObject({ kind: 'rationale' }); expect(mutation.rationale).toContain("AO-5's eight ordinary cases");
    expect(readFileSync(join(ROOT, 'tests/lint/sovereigntyLightingContract.walker.test.js'), 'utf8'))
      .toContain('files: 2412, parked: 365, credited: 2047, titles: 19984, suiteTitles: 5638');
  });
});
