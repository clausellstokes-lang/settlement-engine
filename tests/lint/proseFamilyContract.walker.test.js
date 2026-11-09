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
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair): three of the five null homes move with the
    // re-dealt year (consequence 5 → 6, mechanical 4 → 5, rumour seeds 17 → 16); the impact digest holds at 151 and the
    // selected lane at 1, so this is still a RETENTION arm.
    // 2026-11-05 (LANDING-5, the chair's addition (c); the walker was masked since X-46 car 1 by the duplicate regional id, so these are records 12–26 and the window's earlier records, attributed by stage at prose-family-contract.mjs's RE-RECORDED block; the residual tick itself moves only regionalEventLogUnique): consequence 6 → 5, impact digest 152 → 151, mechanical 5 → 4, rumour seeds 10 → 14; the selected lane holds at 1, so it is still a RETENTION arm.
    // 2026-11-06 (LANDING-7 R-E10; the density ceilings re-derived from the stamp bands, 20c0139c5 alone, measured byte-equal to the tip; prose-family-contract.mjs's RE-RECORDED block): consequence 5 → 4, impact digest 151 → 158, rumour seeds 14 → 11; the mechanical and selected lanes hold at 4 and 1, so it is still a RETENTION arm.
    // 2026-11-07 (the people car's landing, PEOPLE-LAND second seat, §934.105; by first-parent point at prose-family-contract.mjs's RE-RECORDED block): consequence 4 → 5, impact digest 158 → 162, rumour seeds 11 → 18, all at lane 1 (dc655f712) and held after; the mechanical and selected lanes hold at 4 and 1, so it is still a RETENTION arm.
    expect(Object.fromEntries([...nullHomes].sort(([left], [right]) => codepoint(left, right)))).toEqual({
      'pulseHistory[].consequenceOutcomes[].type': 5,
      // WAR LANDING (§876): 148 → 150, and it is the SAME reading of the same arm a third time —
      // the impact digest carries two more records because `5a529f100`'s upheaval gates author
      // two more public beats, and the null-VALUE census follows the records that produced them.
      // ⭐ THE OTHER FOUR NULL HOMES ARE UNCHANGED, INCLUDING THE RUMOUR-SEED LANE THAT MOVED LAST
      // TIME. Four of five homes standing still is what keeps this a null-RETENTION arm and not a
      // corpus-size arm — a cause that moved every home would prove nothing about retention.
      // FP BATCH 3 (2026-09-24): 150 → 151 — ONE more impact-digest record, the SAME reading of the same arm a fourth time;
      // the other four null homes UNCHANGED. Attributed by bisect to CURE-PEACE-1 U1 (c9b24fe51), see prose-family-contract.mjs.
      // 2026-11-04 (REGISTERS-4, the chair's ruling C5; FOOD-1 T1, FOOD-2 T2, SIZE-3 S5, traced by stage): 151 → 152 (T1 152, T2 154, S5 152); the
      // rumour-seed lane 16 → 10 below (T1 11, T2 11, S5 10); the other three null homes hold, so this is still a RETENTION arm.
      'pulseHistory[].impactDigest[].channelType': 161, // MERGE-WAVE (FIX-PUBLIC-VEIL merge, the veiled re-deal's year, at prose-family-contract.mjs's RE-RECORDED block)
      'pulseHistory[].mechanicalOutcomes[].type': 4,
      // TE36 (ODQ §271): 30 → 19. The retired bare-decline outcomes were seeding rumours;
      // the null-VALUE census follows the outcomes that produced them. Every other null home
      // is unchanged, so this arm still measures null RETENTION and not corpus size.
      // T8 · SHIFT (§858 + §860): 19 → 17, and it is the SAME reading of the same arm — car 2's
      // metronome cure takes one rumour out of all four ledgers, so the rumour-seed lane authors
      // two fewer records across the twelve roots and the null census follows them. The other
      // four null homes are again unchanged, which is what keeps this a RETENTION arm.
      'pulseHistory[].mechanicalRumorSeeds[].channelType': 18,
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

  it('A3 freezes all 58 identities counts bytes digest and movement polarities', () => {
    expect(live.rows).toEqual(baseline.rows);
    expect(compareProseFamilyRows(live.rows, baseline.rows)).toBe(true);
    // TE36 (ODQ §271): 8280 → 8274, six bytes, and they are DIGITS not identities — the
    // row array still holds exactly 63 paths and only their counts shrank.
    // T8 · SHIFT (§858 + §860): 8274 → 8271, three bytes, DIGITS again — 26 of the 63 rows moved
    // and not one path was added or removed, so the array is three characters shorter.
    // ⚠⚠ WAR LANDING (§876): 8271 → 8271, AND THE BYTE PIN IS THEREFORE BLIND HERE. 25 rows moved
    // their counts and the digit-width changes cancel to exactly zero, so this assertion would
    // have passed unchanged over a real movement. It is kept because a coincidence is not a
    // licence to delete a pin — but the DIGEST below is the arm that actually convicts, and this
    // is the first re-record in which the two disagree about whether anything happened.
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair): 8271 → 8000. Two identities leave (named at
    // prose-family-contract.mjs's RE-RECORDED block) and 40 of the remaining rows move a count, so bytes and digest both move.
    // 2026-11-04 (REGISTERS-4, the chair's ruling C5; FOOD-1 T1, FOOD-2 T2, SIZE-3 S5, traced by stage): 8000 → 7517. Three identities leave net (named at
    // prose-family-contract.mjs's RE-RECORDED block: four resourceTaxonomy rows out, resolvedStressors[].type in, all at FOOD-1).
    // 2026-11-05 (LANDING-5, the chair's addition (c); the walker was masked since X-46 car 1 by the duplicate regional id, so these are records 12–26 and the window's earlier records, attributed by stage at prose-family-contract.mjs's RE-RECORDED block; the residual tick itself moves only regionalEventLogUnique): 7517 → 7665, one identity in net.
    // 2026-11-06 (LANDING-7 R-E10; the density ceilings re-derived from the stamp bands, 20c0139c5 alone, measured byte-equal to the tip; prose-family-contract.mjs's RE-RECORDED block): 7665 → 7669, no identity in or out; 42 rows move a count.
    // 2026-11-07 (LANDING-R2 seat D2, the chair's 02:36 ruling, §934.105; re-taken at the tip 3d03dc723, attributed by step at prose-family-contract.mjs's RE-RECORDED block: rung 2's census-1b merge 0856c09d3 = d35532850, the census-4 merge 950b75014, the census-2 merge 2b31f33f3, census-1i unit 3 597866207, plus an interaction with rung 1): 7669 -> 7669, no identity in or out; 10 rows move a count and the digit widths cancel (rung 2 alone held 7665 -> 7665 too).
    // 2026-11-07 (MERGE-R2, the integration merge of the rung-2 landing into lane/integration-2026-11-07; re-keyed by identity with its cause, measured at the merged tip 6c3e25661, PLAUSIBLE at prose-family-contract.mjs's RE-RECORDED block: the census steps composed with the integration side's WIRING-W0 / REVIEW-INTAKE lines): 7669 -> 7669, no identity in or out; 10 pulseHistory rows move a count and the digit widths cancel again.
    // 2026-11-07 (the people car's landing, PEOPLE-LAND second seat, §934.105; by first-parent point at prose-family-contract.mjs's RE-RECORDED block): 7669 → 7523 (all at lane 1, dc655f712), one identity out (pulseHistory[].consequenceOutcomes[].proposalPayload.reason) and none in; 39 surviving rows move a count.
    // 2026-11-08 (MERGE-CAR, the people car merged into the integration branch, 8dff691f3; re-keyed by identity with its cause at prose-family-contract.mjs's RE-RECORDED block): 7523 → 7523 (digit widths), no identity in or out; one row moves a count (pulseHistory[].timeTicks[].summary[] 38/804 → 41/804).
    // 2026-11-09 (MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)): 7823 → 7798, two identities in and two out.
    expect(Buffer.byteLength(JSON.stringify(live.rows))).toBe(7798); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
    // TE36 (ODQ §271): the digest follows the counts it hashes. It is re-recorded here and in
    // prose-family-contract.mjs's EXPECTED_ROWS_SHA256 together, which is what keeps the
    // test-side and library-side denominators from ever disagreeing.
    // FP BATCH 3 (2026-09-24): 4cf433b2… → 438fe9c4…, re-recorded together with EXPECTED_ROWS_SHA256 (the bytes hold at 8271).
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair): 438fe9c4… → b172d924…, with EXPECTED_ROWS_SHA256.
    // 2026-10-02 (THE VOICE PROGRAM wave 1): b172d924… → 59c3bb5a…, with EXPECTED_ROWS_SHA256; the bytes hold at 8000.
    // 2026-11-04 (REGISTERS-4, the chair's ruling C5; FOOD-1 T1, FOOD-2 T2, SIZE-3 S5, traced by stage): 59c3bb5a… → 1d67e350…, with EXPECTED_ROWS_SHA256.
    // 2026-11-05 (LANDING-5, addition (c), by stage at prose-family-contract.mjs's RE-RECORDED block): 1d67e350… → c24ac7a8…, with EXPECTED_ROWS_SHA256.
    // 2026-11-06 (LANDING-7 R-E10; the density ceilings re-derived from the stamp bands, 20c0139c5 alone, measured byte-equal to the tip; prose-family-contract.mjs's RE-RECORDED block): c24ac7a8… → 7c53b1cd…, with EXPECTED_ROWS_SHA256.
    // 2026-11-07 (LANDING-R2 seat D2, the chair's 02:36 ruling, §934.105; re-taken at the tip 3d03dc723, attributed by step at prose-family-contract.mjs's RE-RECORDED block: rung 2's census-1b merge 0856c09d3 = d35532850, the census-4 merge 950b75014, the census-2 merge 2b31f33f3, census-1i unit 3 597866207, plus an interaction with rung 1): 7c53b1cd… -> 9f28cc22…, with EXPECTED_ROWS_SHA256.
    // 2026-11-07 (MERGE-R2, the integration merge of the rung-2 landing into lane/integration-2026-11-07; re-keyed by identity with its cause, measured at the merged tip 6c3e25661, PLAUSIBLE at prose-family-contract.mjs's RE-RECORDED block: the census steps composed with the integration side's WIRING-W0 / REVIEW-INTAKE lines): 9f28cc22… -> 4c5a458d…, with EXPECTED_ROWS_SHA256.
    // 2026-11-07 (the people car's landing, PEOPLE-LAND second seat, §934.105; by first-parent point at prose-family-contract.mjs's RE-RECORDED block): 7c53b1cd… → afddb136… (lane 1 48bcb128, lane 2 7e783477, lane 5B afddb136), with EXPECTED_ROWS_SHA256.
    // 2026-11-08 (MERGE-CAR, the people car merged into the integration branch, 8dff691f3; at prose-family-contract.mjs's RE-RECORDED block): afddb136… → 2bb92026…, with EXPECTED_ROWS_SHA256.
    // 2026-11-09 (MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)): f207dcfb… → 8a4abd46…, with EXPECTED_ROWS_SHA256.
    expect(live.rowsSha256).toBe('8a4abd460b62c9df6cf76751b259468bb1f1e5c71a5c3b67f7cf4f6739dcd34c'); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
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
    // TE36 (ODQ §271): 1301/5878 → 1236/5253. This counterfeit must stay INTERNALLY
    // CONSISTENT — it slices off the seven `chronicle` rows and must still add up — or the
    // validator rejects it at "baseline totals disagree with rows" and never reaches the
    // IMMUTABILITY guard this arm exists to prove. The seven come straight off the new
    // totals (1071 − 7, 5206 − 7), so the arithmetic tracks the re-record rather than
    // being re-chosen.
    // WAR LANDING (§876): 1064/5199 → 1067/5263, the same seven off the new totals (1074 − 7,
    // 5270 − 7). `chronicle` is byte-identical at 7/7/7 for the third re-record running, which is
    // why this counterfeit's arithmetic keeps tracking with a single subtraction.
    // FP BATCH 3 (2026-09-24): 1067/5263 → 1071/5285, the same seven off the new totals (1078 − 7, 5292 − 7); `chronicle`
    // byte-identical at 7/7/7 for the fourth re-record running.
    // 2026-10-01 (the urban band + the druid rulings): 1071/5285 → 995/5171, the same seven off the new totals (1002 − 7,
    // 5178 − 7), and identities 56 → 54 (61 − 7); `chronicle` byte-identical at 7/7/7 for the fifth re-record running.
    // 2026-10-02 (THE VOICE PROGRAM wave 1): 995/5171 → 1012/5171, the same seven off the new totals (1019 − 7, 5178 − 7);
    // `chronicle` byte-identical at 7/7/7 for the sixth re-record running.
    // 2026-11-04 (REGISTERS-4, the chair's ruling C5; FOOD-1 T1, FOOD-2 T2, SIZE-3 S5, traced by stage): 54/1012/5171 → 51/1007/5003, the same seven off the
    // new totals (58 − 7, 1014 − 7, 5010 − 7); `chronicle` byte-identical at 7/7/7 for the seventh re-record running.
    // 2026-11-05 (LANDING-5, addition (c); records 12–26 and the window's earlier records, by stage at prose-family-contract.mjs's RE-RECORDED block): 51/1007/5003 → 52/964/5220, the same seven off the
    // new totals (59 − 7, 971 − 7, 5227 − 7); `chronicle` byte-identical at 7/7/7 for the eighth re-record running.
    // 2026-11-06 (LANDING-7 R-E10; the density ceilings re-derived from the stamp bands, 20c0139c5 alone, measured byte-equal to the tip; prose-family-contract.mjs's RE-RECORDED block): 52/964/5220 → 52/969/5243, the same seven off the new totals (59 − 7, 976 − 7, 5250 − 7); `chronicle` byte-identical at 7/7/7 for the ninth re-record running.
    // 2026-11-07 (LANDING-R2 seat D2, the chair's 02:36 ruling, §934.105; re-taken at the tip 3d03dc723, attributed by step at prose-family-contract.mjs's RE-RECORDED block: rung 2's census-1b merge 0856c09d3 = d35532850, the census-4 merge 950b75014, the census-2 merge 2b31f33f3, census-1i unit 3 597866207, plus an interaction with rung 1): 52/969/5243 -> 52/970/5253, the same seven off the new totals (59 - 7, 977 - 7, 5260 - 7); `chronicle` byte-identical at 7/7/7 for the tenth re-record running.
    // 2026-11-07 (MERGE-R2, the integration merge of the rung-2 landing into lane/integration-2026-11-07; re-keyed by identity with its cause, measured at the merged tip 6c3e25661, PLAUSIBLE at prose-family-contract.mjs's RE-RECORDED block: the census steps composed with the integration side's WIRING-W0 / REVIEW-INTAKE lines): 52/970/5253 -> 52/969/5252, the same seven off the new totals (59 - 7, 976 - 7, 5259 - 7); `chronicle` byte-identical at 7/7/7 for the eleventh re-record running.
    // 2026-11-07 (the people car's landing, PEOPLE-LAND second seat, §934.105; by first-parent point at prose-family-contract.mjs's RE-RECORDED block): 52/969/5243 → 51/1039/5501, the same seven off the new totals (58 − 7, 1046 − 7, 5508 − 7); `chronicle` byte-identical at 7/7/7 for the tenth re-record running.
    // 2026-11-08 (MERGE-CAR, the people car merged into the integration branch, 8dff691f3; at prose-family-contract.mjs's RE-RECORDED block): 51/1039/5501 → 51/1042/5501, the same seven off the new totals (58 − 7, 1049 − 7, 5508 − 7); `chronicle` byte-identical at 7/7/7.
    // 2026-11-09 (MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)): 53/1066/5522 → 53/1052/5501, the same seven off the new totals (60 − 7, 1059 − 7, 5508 − 7); `chronicle` byte-identical at 7/7/7.
    counterfeit.totals = { families: 3, identities: 53, distinctValues: 1052, occurrences: 5501 }; // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
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
    // TE36 (ODQ §271): 1286/5665 → 1221/5076. IDENTITIES HOLD AT 50 — no prose path was
    // gained or lost; the lit corpus simply authors fewer outcomes once bare decline is
    // retired to demographicsKernel.
    // T8 · SHIFT (§858 + §860): 1198/5076 → 1048/5018, and IDENTITIES HOLD AT 50 again. The two
    // halves are attributable by single-variable control: with car 1's two src files restored to
    // the landing base this family reads 1057/5063, so cars 2+3 own −141 distinct / −13
    // occurrences (car 3's relabel re-spells the `reasons[]` vocabularies; car 2's dedup removes
    // records) and car 1 owns the remaining −9 / −45.
    // WAR LANDING (§876): 1048/5018 → 1051/5075, and IDENTITIES HOLD AT 50 for the third
    // re-record running. This time the halves are not split at all: a five-arm control puts the
    // WHOLE movement on `5a529f100` (T4 SEAT-2b) and measures ZERO from every other pick and from
    // all three WAR mini-window cars — including W-MEM's `publishRuling` funnel, which the lane
    // brief named as the cause and which this corpus never reaches.
    // FP BATCH 3 (2026-09-24): 1051/5075 → 1055/5097 — sixteen pulseHistory rows grow by the ONE new wizard-news id's
    // impact digest and its selected/consequence beats; identities 50 HOLD. Attributed by bisect to CURE-PEACE-1 U1 (c9b24fe51).
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair): 50/1055/5097 → 48/979/4979. IDENTITIES MOVE
    // for the first time in this arm's history: consequenceOutcomes[].proposalPayload.reason and resolvedStressors[].type leave,
    // because the re-dealt year resolves no stressor and carries no such proposal.
    // 2026-10-02 (THE VOICE PROGRAM wave 1): 48/979/4979 → 48/996/4979, the deed forms re-spelling the same records.
    // 2026-11-04 (REGISTERS-4, the chair's ruling C5; FOOD-1 T1, FOOD-2 T2, SIZE-3 S5, traced by stage): 48/996/4979 → 45/995/4838 (T1 45/971/4900, T2
    // 45/1023/4961); the three identities are named at prose-family-contract.mjs's RE-RECORDED block.
    // 2026-11-05 (LANDING-5, the chair's addition (c); the walker was masked since X-46 car 1 by the duplicate regional id, so these are records 12–26 and the window's earlier records, attributed by stage at prose-family-contract.mjs's RE-RECORDED block; the residual tick itself moves only regionalEventLogUnique): 45/995/4838 → 46/952/5051.
    // 2026-11-06 (LANDING-7 R-E10; the density ceilings re-derived from the stamp bands, 20c0139c5 alone, measured byte-equal to the tip; prose-family-contract.mjs's RE-RECORDED block): 46/952/5051 → 46/957/5042; identities hold.
    // 2026-11-07 (LANDING-R2 seat D2, the chair's 02:36 ruling, §934.105; re-taken at the tip 3d03dc723, attributed by step at prose-family-contract.mjs's RE-RECORDED block: rung 2's census-1b merge 0856c09d3 = d35532850, the census-4 merge 950b75014, the census-2 merge 2b31f33f3, census-1i unit 3 597866207, plus an interaction with rung 1): 46/957/5042 -> 46/958/5052; identities hold. Rung 2's steps -3/-14 (950b75014 -2/0, 2b31f33f3 +3/0, 597866207 -4/-14); +4/+24 interaction with rung 1.
    // 2026-11-07 (MERGE-R2, the integration merge of the rung-2 landing into lane/integration-2026-11-07; re-keyed by identity with its cause, measured at the merged tip 6c3e25661, PLAUSIBLE at prose-family-contract.mjs's RE-RECORDED block: the census steps composed with the integration side's WIRING-W0 / REVIEW-INTAKE lines): 46/958/5052 -> 46/957/5051; identities hold (the ten moving rows are named at the RE-RECORDED block).
    // 2026-11-07 (the people car's landing, PEOPLE-LAND second seat, §934.105; by first-parent point at prose-family-contract.mjs's RE-RECORDED block): 46/957/5042 → 45/1027/5331 (lane 1 45/1023/5333, lane 2 45/1029/5349, lane 5B as now); one identity out.
    // 2026-11-08 (MERGE-CAR, the people car merged into the integration branch, 8dff691f3; at prose-family-contract.mjs's RE-RECORDED block): 45/1027/5331 → 45/1030/5331 (timeTicks[].summary[] 38 → 41 distinct); identities hold. The three headline lanes below hold (96/165, 26/49, 79/186), measured.
    // 2026-11-09 (MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)): 47/1050/5341 → 47/1040/5336; two identities in and two out (named at the RE-RECORDED block).
    expect(familyTotal(live, 'pulseHistory')).toEqual({ family: 'pulseHistory', identities: 47, distinctValues: 1040, occurrences: 5336 }); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
    const history = scalarRows.filter((row) => row.root === 'worldState');
    expect([...new Set(history.map((row) => row.path[1].value))]).toEqual([...Array(12).keys()]);
    const headline = (home) => live.rows.find((row) => row.path === `pulseHistory[].${home}[].headline`);
    // FP BATCH 3 (2026-09-24): `selectedOutcomes` 78/153 → 78/154 (one occurrence, no new spelling); `mechanicalOutcomes` HOLDS at
    // 28/53; `consequenceOutcomes` 72/184 → 72/185 (one occurrence, no new spelling).
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair): selected 78/154 → 75/155, mechanical 28/53 → 22/49, consequence 72/185 → 68/181.
    // 2026-10-02 (THE VOICE PROGRAM wave 1): selected 75/155 → 84/155 and consequence 68/181 → 74/181, more SPELLINGS of the
    // same occurrences (both towns named, a deed per kind); `mechanicalOutcomes` HOLDS at 22/49.
    // 2026-11-04 (REGISTERS-4, the chair's ruling C5; FOOD-1 T1, FOOD-2 T2, SIZE-3 S5, traced by stage): selected 84/155 → 81/160 (T1 82/158, T2 84/160),
    // mechanical 22/49 → 18/41 (T1 20/44, T2 20/47), consequence 74/181 → 71/176 (T1 72/177, T2 74/182).
    // 2026-11-06 (LANDING-7 R-E10; the density ceilings re-derived from the stamp bands, 20c0139c5 alone, measured byte-equal to the tip; prose-family-contract.mjs's RE-RECORDED block): selected 81/160 → 82/166, mechanical 24/53 → 21/45, consequence 71/189 → 68/167.
    // 2026-11-07 (the people car's landing, PEOPLE-LAND second seat, §934.105; by first-parent point at prose-family-contract.mjs's RE-RECORDED block): selected 82/166 → 96/165 (lane 1, held after), mechanical 21/45 → 26/49 (lane 1 26/49, lane 2 27/50, lane 5B 26/49), consequence 68/167 → 79/186 (lane 1 79/186, lane 2 79/188, lane 5B 79/186).
    // 2026-11-09 (MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)): selected 96/164 → 97/164, mechanical 26/50 → 25/50, consequence 79/188 → 78/187.
    expect(headline('selectedOutcomes')).toMatchObject({ distinctValues: 97, occurrences: 164 }); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
    // TE36: the two lanes that carried the retired family move; `selectedOutcomes` above does
    // NOT, because ordinary population drift was already `state_only` and never selected.
    // mechanical distinctValues RISES (24 → 29) while its occurrences fall — the retired
    // family was repetitive, so removing it leaves a shorter and more varied lane.
    // T8 · SHIFT: 29/56 → 28/54 and 73/186 → 73/184. `selectedOutcomes` above is UNMOVED at
    // 80/151 for the third re-record running — the two lanes that move are the two the corruption
    // and rumour work authors into, and the lane that never carried either holds still.
    // ⭐ WAR LANDING (§876): THE LANE THAT HELD STILL FOR THREE RE-RECORDS IS THE ONE THAT MOVES
    // MOST, and that inversion is the cleanest signature in this file that the cause is a new one.
    // `selectedOutcomes` 80/151 → 78/153 (the public lane the upheaval gates author into);
    // `mechanicalOutcomes` 28/54 → 28/53, losing one occurrence and no spelling; and
    // `consequenceOutcomes` 73/184 → 72/184, losing one spelling and no occurrence — the exact
    // mirror image, and between them the arithmetic of a re-deal rather than of a gain or a loss.
    // 2026-11-05 (LANDING-5, addition (c); records 12–26 and the window's earlier records, by stage at prose-family-contract.mjs's RE-RECORDED block): mechanical 18/41 → 24/53, consequence 71/176 → 71/189; selected holds at 81/160.
    // 2026-11-07 (LANDING-R2 seat D2, the chair's 02:36 ruling, §934.105; re-taken at the tip 3d03dc723, attributed by step at prose-family-contract.mjs's RE-RECORDED block: rung 2's census-1b merge 0856c09d3 = d35532850, the census-4 merge 950b75014, the census-2 merge 2b31f33f3, census-1i unit 3 597866207, plus an interaction with rung 1): selected holds at 82/166; mechanical 21/45 -> 21/46 (597866207 -1/-1; +1/+2 interaction with rung 1); consequence 68/167 -> 67/168
    // (950b75014 -1/0, 597866207 0/-1; 0/+2 interaction with rung 1).
    // 2026-11-07 (MERGE-R2, the integration merge of the rung-2 landing into lane/integration-2026-11-07; re-keyed by identity with its cause, measured at the merged tip 6c3e25661, PLAUSIBLE at prose-family-contract.mjs's RE-RECORDED block: the census steps composed with the integration side's WIRING-W0 / REVIEW-INTAKE lines): all three headline lanes HOLD (selected 82/166, mechanical 21/46, consequence 67/168, measured).
    expect(headline('mechanicalOutcomes')).toMatchObject({ distinctValues: 25, occurrences: 50 }); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
    expect(headline('consequenceOutcomes')).toMatchObject({ distinctValues: 78, occurrences: 187 }); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
  });

  it('A6 reaches the regional audit log while proving its selected prose zero', () => {
    // TE36 (ODQ §271): 201 → 165 and 109 → 73. Both identities and their distinct-value
    // counts are UNCHANGED (2 and 7): the regional audit log records the same KINDS of change,
    // 36 fewer times, because 36 of its entries were the retired population-decline outcomes.
    // T8 · SHIFT (§858 + §860): 165 → 169 and 73 → 74, and this family moves UP where every other
    // family moved down. It is CAR 1 ALONE — with car 1's two src files restored to the landing
    // base this family reads the frozen 2/7/165 exactly, cars 2 and 3 notwithstanding. The
    // corruption-onset shift §858 priced puts one more audited event into the regional log and one
    // more distinct change KIND with it, so distinctValues rises 7 → 8 for the first time here.
    // ⭐ WAR LANDING (§876): 169 → 176 and `distinctValues` HOLDS AT 8. TE36 held both identities
    // and distinct while occurrences fell; T8 moved both; this time the audit log records the same
    // EIGHT kinds of change, seven more times. That is the shape of a re-deal — `5a529f100`'s
    // legitimacy-sensitivity table moving WHICH seats are fragile WHEN, never how many kinds of
    // thing can happen — and it is the same claim the car's own redistribution invariant makes,
    // measured here from the far side of the estate rather than from inside the gate.
    // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair): 176 → 180 and 77 → 79 events, distinct HOLDS
    // at 8 (the same kinds of change, dealt differently), and ROOT 2 LEAVES THE REACH: that pulse logged no regional event, so the
    // reach is pinned as the exact set [0,1,3..11] (the library's EXPECTED_REGIONAL_ROOTS) rather than 0..11.
    // 2026-11-04 (REGISTERS-4, the chair's ruling C5; FOOD-1 T1, FOOD-2 T2, SIZE-3 S5, traced by stage): 2/8/180 → 2/4/153 and 79 → 77 events (T1 2/4/169
    // and 80, T2 as now). FOR THE FIRST TIME THE DISTINCT COUNT MOVES: the audit log records four kinds of change, not eight,
    // from FOOD-1 on — the food cut-offs leave fewer kinds of regional event in the year. The root reach [0,1,3..11] holds.
    // 2026-11-05 (LANDING-5, the chair's addition (c); the walker was masked since X-46 car 1 by the duplicate regional id, so these are records 12–26 and the window's earlier records, attributed by stage at prose-family-contract.mjs's RE-RECORDED block; the residual tick itself moves only regionalEventLogUnique): 2/4/153 → 2/4/157 and 77/77 → 75/75 events (75/74 before the tick), and ROOT 2 RETURNS TO THE REACH from X-46 car 3 (90dc22f18): the reach is 0..11 again.
    // 2026-11-06 (LANDING-7 R-E10; the density ceilings re-derived from the stamp bands, 20c0139c5 alone, measured byte-equal to the tip; prose-family-contract.mjs's RE-RECORDED block): 2/4/157 → 2/4/189 and 75/75 → 86/86 events; the root reach 0..11 holds.
    // 2026-11-07 (the people car's landing, PEOPLE-LAND second seat, §934.105; by first-parent point at prose-family-contract.mjs's RE-RECORDED block): 2/4/189 → 2/4/158 and 86/86 → 81/81 events (lane 1 2/2/143 and 80/80, lane 2 as now); the root reach 0..11 holds.
    // 2026-11-09 (MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)): 2/8/169 → 2/4/153 and 82/82 → 80/80 events; the root reach 0..11 holds.
    expect(familyTotal(live, 'regionalLog')).toEqual({ family: 'regionalLog', identities: 2, distinctValues: 4, occurrences: 153 }); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
    expect(scalarMeta).toMatchObject({ regionalEventLog: 80, regionalEventLogUnique: 80 }); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
    const regional = scalarRows.filter((row) => row.root === 'pulseResult'
      && row.path[0]?.value === 'regionalGraph' && row.path[1]?.value === 'eventLog');
    // 2026-11-05 (LANDING-5, addition (c); records 12–26 and the window's earlier records, by stage at prose-family-contract.mjs's RE-RECORDED block): root 2 returns (X-46 car 3, 90dc22f18), and 77 → 75 distinct records (75 rows; 74 distinct before the residual tick).
    expect([...new Set(regional.map((row) => row.rootOrdinal))]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    expect(new Set(regional.map((row) => `${row.rootOrdinal}|${row.path[2].value}`)).size).toBe(80); // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
    expect(live.rows.filter((row) => row.family === 'regionalLog')).toEqual([
      // TE36: `changes[].kind` is BYTE-IDENTICAL at 6/92 — the retired outcomes carried a
      // sourceEvent but no graph change, so only the second row moves. That asymmetry is the
      // cleanest evidence in this file that the retirement was surgical.
      // T8 · SHIFT: this time BOTH rows move and in the SAME direction — 6/92 → 7/95 and 1/73 →
      // 1/74. The asymmetry is gone because the added event is the opposite kind of event to the
      // one TE36 retired: it carries a graph change AND a sourceEvent, so it lands in both rows.
      // WAR LANDING (§876): both rows move up again — 7/95 → 7/99 and 1/74 → 1/77 — and NEITHER
      // distinct count moves. Three added events carry a graph change and a sourceEvent each, and
      // four graph changes between them; no new KIND of change appears in either row, which is
      // what separates "the same world, dealt differently" from "a new kind of thing happening".
      // 2026-10-01 (the urban band + the druid rulings, ODQ §934.86 and its addendum 2; the urban-band chair): 7/99 → 7/101 and 1/77 → 1/79; neither distinct count moves.
      // 2026-11-04 (REGISTERS-4, the chair's ruling C5; FOOD-1 T1, FOOD-2 T2, SIZE-3 S5, traced by stage): 7/101 → 3/76 (T1 3/89, T2 as now) and 1/79 → 1/77
      // (T1 1/80); the changes row loses four kinds at FOOD-1.
      // 2026-11-05 (LANDING-5, addition (c); records 12–26 and the window's earlier records, by stage at prose-family-contract.mjs's RE-RECORDED block): 3/76 → 3/82 and 1/77 → 1/75; neither distinct count moves.
      // 2026-11-06 (LANDING-7 R-E10; the density ceilings re-derived from the stamp bands, 20c0139c5 alone, measured byte-equal to the tip; prose-family-contract.mjs's RE-RECORDED block): 3/82 → 3/103 and 1/75 → 1/86; neither distinct count moves.
      // 2026-11-07 (the people car's landing, PEOPLE-LAND second seat, §934.105; by first-parent point at prose-family-contract.mjs's RE-RECORDED block): 3/103 → 3/77 and 1/86 → 1/81 (lane 1 1/63 and 1/80, lane 2 as now); neither distinct count moves net.
      // 2026-11-09 (MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)): 7/87 → 3/73 and 1/82 → 1/80.
      { family: 'regionalLog', path: 'regionalGraph.eventLog[].changes[].kind', field: 'kind', distinctValues: 3, occurrences: 73 }, // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
      { family: 'regionalLog', path: 'regionalGraph.eventLog[].sourceEvent.type', field: 'type', distinctValues: 1, occurrences: 80 }, // MERGE-TRAIN (ALLEGIANCE-CAR1 merge, car 1's re-dealt year — the hidden allegiance, then J-19 — at prose-family-contract.mjs's RE-RECORDED block)
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
    expect(mutation).toMatchObject({ kind: 'mutation', label: 'corpus-coverage/chronicle summaryText projection deleted' });
    expect(readFileSync(join(ROOT, 'tests/lint/sovereigntyLightingContract.walker.test.js'), 'utf8'))
      .toContain('files: 2412, parked: 365, credited: 2047, titles: 19984, suiteTitles: 5638');
  });
});
