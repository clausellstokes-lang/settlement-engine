import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

import { buildObservedCorpus, OBSERVED_SCALAR_FIELDS } from '../../scripts/lib/observed-shape-corpus.mjs';
import {
  KNOWN_INERT_HEADLINE_REWRITES,
  analyzeHeadlineRewriteLiveness,
  addressRowsSha256,
  compareHeadlineRewriteRows,
  compareNewsAddressRows,
  deriveNewsAddressRows,
  measureHeadlineRewriteLiveness,
  rawHeadlineLivenessOf,
  selectPersistedHeadlineRows,
  validateNewsHeadlineBaseline,
} from '../../scripts/lib/news-headline-contract.mjs';
import { PROSE_FAMILY_PROTECTED_SUBSTRATE } from '../../scripts/lib/prose-family-contract.mjs';
import { NEWS_VOICE_PROTECTED_SUBSTRATE, reconstructWizardNewsIntroductions } from '../../scripts/lib/news-voice-contract.mjs';
import { PREDICATES, makeContext } from '../../scripts/lib/premortem-triggers.mjs';
import { FACTION_VERB_PHRASES } from '../../src/domain/worldPulse/factionCompetition.js';
import {
  APPLIED_HEADLINE_REWRITES,
  newsEntryForOutcome,
} from '../../src/domain/worldPulse/worldPulseFeedCuration.js';
import { mechanicalPulseRecordFields, partitionPulseOutcomeLanes } from '../../src/domain/worldPulse/pulseOutcomePartition.js';
import { isPublicOutcome, isStateOnlyOutcome, isSuppressionOnlyOutcome } from '../../src/domain/worldPulse/pulseHelpers.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = join(ROOT, 'tests/lint/.news-headline-contract-baseline.json');
const clone = (value) => JSON.parse(JSON.stringify(value));
const codepoint = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const sortAddressRows = (rows) => rows.sort((left, right) => codepoint(`${left.home}|${left.field}|${left.voiceClass}`, `${right.home}|${right.field}|${right.voiceClass}`));
const sortInertRows = (rows) => rows.sort((left, right) => codepoint(`${left.source}|${left.flags}|${left.replacement}`, `${right.source}|${right.flags}|${right.replacement}`));
const outcome = (extra = {}) => ({
  id: 'candidate.faction.challenge',
  type: 'faction',
  candidateType: 'faction_government_challenge',
  applyMode: 'auto',
  severity: 0.55,
  headline: 'Military/Guard may press a challenge to the government',
  appliedHeadline: 'Military/Guard presses a challenge to the government',
  summary: 'Military/Guard sees an opening to press military order interests.',
  reasons: ['A faction sees an opening.'],
  targetSaveId: 'alpha',
  proposalPayload: { kind: 'government_change' },
  ...extra,
});
const addressEntry = (impactKind = 'ordinary') => ({ fields: { kind: 'applied', impactKind, headline: 'The deed is done.', summary: 'The deed now stands.' } });

let baseline;
let scalarRows;
let reconstruction;
let secondReconstruction;
let addressRows;
let rawRows;
let rawTelemetry;
let finalLiveness;

describe('complete Wizard News address and headline rewrite contract', () => {
  beforeAll(async () => {
    baseline = validateNewsHeadlineBaseline(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')));
    const corpus = await buildObservedCorpus({ scalarFields: OBSERVED_SCALAR_FIELDS });
    scalarRows = corpus.scalarObservations;
    reconstruction = reconstructWizardNewsIntroductions(scalarRows);
    secondReconstruction = reconstructWizardNewsIntroductions(scalarRows);
    addressRows = deriveNewsAddressRows(reconstruction.entries);
    rawRows = selectPersistedHeadlineRows(scalarRows);
    rawTelemetry = rawHeadlineLivenessOf(rawRows);
    finalLiveness = measureHeadlineRewriteLiveness(rawRows, APPLIED_HEADLINE_REWRITES);
  }, 900_000);

  it('A1 reconstructs once and proves the persisted public and mechanical partition law', () => {
    expect(secondReconstruction).toEqual(reconstruction);
    expect({ pulseRoots: reconstruction.pulseRoots, introductions: reconstruction.introductions, retirements: reconstruction.retirements, finalEntries: reconstruction.finalEntries, homes: reconstruction.homes }).toEqual(baseline.corpus);
    expect(reconstruction.introductions - reconstruction.retirements).toBe(reconstruction.finalEntries);
    const publicControl = outcome({ id: 'public.control' });
    const mechanicalControl = outcome({ id: 'mechanical.control', recordMode: 'state_only' });
    const suppressionControl = outcome({ id: 'suppression.control', recordMode: 'suppression_only' });
    const partition = partitionPulseOutcomeLanes({ structuralCandidates: [suppressionControl], selected: [publicControl, mechanicalControl] });
    expect(partition.selectedForApply.map((row) => row.id)).toEqual(['public.control', 'mechanical.control']);
    expect(partition.publicSelectedOutcomes.map((row) => row.id)).toEqual(['public.control']);
    const laneFields = mechanicalPulseRecordFields({ applied: { autoApplied: [publicControl, mechanicalControl, suppressionControl], rumorSeedEntries: [] }, selectedForApply: partition.selectedForApply });
    expect(laneFields.mechanicalOutcomes.map((row) => row.id)).toEqual(['mechanical.control']);
    expect([...partition.publicSelectedOutcomes, ...laneFields.mechanicalOutcomes].some((row) => row.id === 'suppression.control')).toBe(false);
    expect(isPublicOutcome(publicControl) && isStateOnlyOutcome(mechanicalControl) && isSuppressionOnlyOutcome(suppressionControl)).toBe(true);

    const publicRows = Array.from({ length: 30 }, (_, index) => outcome({ id: `public.${index}` }));
    const publicPersisted = partitionPulseOutcomeLanes({ selected: publicRows }).publicSelectedOutcomes.slice(0, 24);
    expect(publicPersisted.map((row) => row.id)).toEqual(publicRows.slice(0, 24).map((row) => row.id));
    const mechanicalRows = Array.from({ length: 30 }, (_, index) => outcome({ id: `mechanical.${index}`, recordMode: 'state_only' }));
    const mechanicalPersisted = mechanicalPulseRecordFields({ applied: { autoApplied: mechanicalRows, rumorSeedEntries: [] }, selectedForApply: mechanicalRows }).mechanicalOutcomes;
    expect(mechanicalPersisted.map((row) => row.id)).toEqual(mechanicalRows.slice(0, 8).map((row) => row.id));

    const interleaved = publicRows.flatMap((row, index) => [row, mechanicalRows[index]]);
    const overlapFields = mechanicalPulseRecordFields({ applied: { autoApplied: mechanicalRows, rumorSeedEntries: [] }, selectedForApply: interleaved });
    expect(overlapFields.consequenceOutcomes).toHaveLength(24);
    expect(overlapFields.consequenceOutcomes.filter(isPublicOutcome)).toHaveLength(12);
    expect(overlapFields.consequenceOutcomes.filter(isStateOnlyOutcome)).toHaveLength(12);
  });

  it('A2 freezes all 106 address rows and their canonical digest', () => {
    expect(compareNewsAddressRows(addressRows, baseline.addressTotality.rows)).toBe(true);
    expect(addressRowsSha256(addressRows)).toBe(baseline.addressTotality.rowsSha256);
    expect(baseline.addressTotality.totals).toEqual({ homes: 53, fields: 2, identities: 106, prospectiveIdentities: 14, indicativeIdentities: 92, distinctValues: 400, occurrences: 544 });
  });

  it('A3 freezes both raw lanes and all 26 exact rewrite counts', () => {
    expect(rawTelemetry).toEqual(baseline.rewriteLiveness.raw);
    expect(finalLiveness.totals).toEqual(baseline.rewriteLiveness.totals);
    expect(compareHeadlineRewriteRows(finalLiveness.rows, baseline.rewriteLiveness.rows)).toBe(true);
    expect(finalLiveness.gaps).toEqual([]);
    expect(finalLiveness.overlaps).toEqual([]);
    expect(finalLiveness.indicativeMatches).toEqual([]);
    expect(rawRows.map((row) => row.pulseIndex)).toEqual([...rawRows.map((row) => row.pulseIndex)].sort((a, b) => a - b));
  });

  it('A4 rejects malformed envelopes and address identities including null collisions', () => {
    const nullable = [addressEntry(null), addressEntry(null), addressEntry('ordinary')];
    expect(deriveNewsAddressRows(nullable).map((row) => row.home)).toEqual([
      'applied|null', 'applied|null', 'applied|ordinary', 'applied|ordinary',
    ]);
    const nullEntries = reconstruction.entries.filter((entry) => entry.fields.impactKind === null);
    expect(nullEntries).toHaveLength(8);
    expect(Object.fromEntries([...new Set(nullEntries.map((entry) => entry.fields.kind))].sort().map((kind) => [kind, nullEntries.filter((entry) => entry.fields.kind === kind).length]))).toEqual({ webwar_campaign_complete: 4, webwar_campaign_minted: 4 });
    expect(() => deriveNewsAddressRows([])).toThrow();
    expect(() => deriveNewsAddressRows([addressEntry(), { ...addressEntry(), fields: { ...addressEntry().fields, headline: 'The deed may happen.' } }])).toThrow(/mixed voice/);
    for (const impactKind of [undefined, '', '   ', 3, true, [], {}, 'null', 'bad|token']) {
      expect(() => deriveNewsAddressRows([{ fields: { kind: 'applied', impactKind, headline: 'H', summary: 'S' } }])).toThrow();
    }
    expect(() => deriveNewsAddressRows([{ fields: { kind: 'applied', headline: 'H', summary: 'S' } }])).toThrow();
    expect(() => deriveNewsAddressRows([{ fields: { kind: 'bad|kind', impactKind: 'ok', headline: 'H', summary: 'S' } }])).toThrow();
    for (const mutate of [
      (value) => { value.extra = true; },
      (value) => { value.addressTotality.rows.push(clone(value.addressTotality.rows[0])); },
      (value) => { value.rewriteLiveness.totals.activeRules += 1; },
      (value) => { value.corpus.introductions = 0; },
    ]) {
      const value = clone(baseline); mutate(value); expect(() => validateNewsHeadlineBaseline(value)).toThrow();
    }
    expect(() => compareNewsAddressRows([], baseline.addressTotality.rows)).toThrow();
    for (const mutate of [
      (rows) => rows.push({ ...rows.at(-1), home: 'queued|new' }),
      (rows) => { rows[0].occurrences += 1; },
      (rows) => { rows.find((row) => row.occurrences > row.distinctValues).occurrences -= 1; },
      (rows) => rows.shift(),
      (rows) => { rows[0].voiceClass = rows[0].voiceClass === 'indicative' ? 'prospective' : 'indicative'; },
    ]) {
      const rows = clone(baseline.addressTotality.rows); mutate(rows); sortAddressRows(rows); expect(() => compareNewsAddressRows(rows, baseline.addressTotality.rows)).toThrow();
    }
    const rewriteRows = clone(baseline.rewriteLiveness.rows); rewriteRows.find((row) => row.occurrences > 0).occurrences += 1;
    expect(() => compareHeadlineRewriteRows(rewriteRows, baseline.rewriteLiveness.rows)).toThrow();
    const withoutChallenge = APPLIED_HEADLINE_REWRITES.filter(([pattern]) => pattern.source !== '\\bmay press a challenge to the government\\b');
    expect(() => measureHeadlineRewriteLiveness(rawRows, withoutChallenge)).toThrow(/uncovered 2\/selectedOutcomes\/0/);
    const capBreach = clone(rawRows); const selectedIndex = capBreach.findLastIndex((row) => row.field === 'selectedOutcomes' && row.pulseIndex === 0); capBreach[selectedIndex].outcomeIndex = 24;
    expect(() => rawHeadlineLivenessOf(capBreach)).toThrow(/cap 24/);
  });

  it('A5 keeps exactly nine scoped written reasons on exactly the zero-count rules', () => {
    expect(baseline.rewriteLiveness.knownInert).toEqual(KNOWN_INERT_HEADLINE_REWRITES);
    expect(finalLiveness.rows.filter((row) => row.occurrences === 0).map((row) => `${row.source}|${row.flags}|${row.replacement}`)).toEqual(KNOWN_INERT_HEADLINE_REWRITES.map((row) => `${row.source}|${row.flags}|${row.replacement}`));
    const moved = clone(baseline); moved.rewriteLiveness.knownInert[0].reason += ' changed'; expect(() => validateNewsHeadlineBaseline(moved)).toThrow();
    const blank = clone(baseline); blank.rewriteLiveness.knownInert[0].reason = ' '; expect(() => validateNewsHeadlineBaseline(blank)).toThrow();
    const missing = clone(baseline); missing.rewriteLiveness.knownInert.pop(); expect(() => validateNewsHeadlineBaseline(missing)).toThrow();
    const active = baseline.rewriteLiveness.rows.find((row) => row.occurrences > 0); const quarantined = clone(baseline); quarantined.rewriteLiveness.knownInert[0] = { source: active.source, flags: active.flags, replacement: active.replacement, reason: 'Active rules cannot enter quarantine.' }; sortInertRows(quarantined.rewriteLiveness.knownInert); expect(() => validateNewsHeadlineBaseline(quarantined)).toThrow();
    const added = clone(baseline); added.rewriteLiveness.knownInert.push({ source: 'new', flags: '', replacement: 'new', reason: 'New inert rows require authority.' }); sortInertRows(added.rewriteLiveness.knownInert); expect(() => validateNewsHeadlineBaseline(added)).toThrow();
  });

  it('A6 closes the sole live challenge gap with the exact producer twin', () => {
    const withoutChallenge = APPLIED_HEADLINE_REWRITES.filter(([pattern]) => pattern.source !== '\\bmay press a challenge to the government\\b');
    const pre = analyzeHeadlineRewriteLiveness(rawRows, withoutChallenge);
    expect({ rules: pre.totals.rules, activeRules: pre.totals.activeRules, inertRules: pre.totals.inertRules, overlaps: pre.overlaps.length, indicativeMatches: pre.indicativeMatches.length }).toEqual({ rules: 25, activeRules: 16, inertRules: 9, overlaps: 0, indicativeMatches: 0 });
    expect(pre.gaps).toEqual([{ location: '2/selectedOutcomes/0', headline: 'Military/Guard may press a challenge to the government' }]);
    const did = FACTION_VERB_PHRASES.faction_government_challenge.did;
    expect(APPLIED_HEADLINE_REWRITES.find(([pattern]) => pattern.source === '\\bmay press a challenge to the government\\b')?.[1]).toBe(did);
    expect(newsEntryForOutcome(outcome(), 7, 'proposal').headline).toBe(outcome().headline);
    expect(newsEntryForOutcome(outcome(), 7, 'applied').headline).toBe(outcome().appliedHeadline);
    expect(newsEntryForOutcome(outcome({ appliedHeadline: undefined }), 7, 'applied').headline).toBe(`Military/Guard ${did}`);
  });

  it('A7 leaves unrelated prose and every non-headline feed field byte-identical', () => {
    const input = outcome({ appliedHeadline: undefined }); const before = clone(input);
    const actual = newsEntryForOutcome(input, 7, 'applied');
    expect(input).toEqual(before);
    const unrelated = newsEntryForOutcome(outcome({ headline: 'Military/Guard already acts', appliedHeadline: undefined }), 7, 'applied');
    expect(unrelated.headline).toBe('Military/Guard already acts');
    const explicit = newsEntryForOutcome(outcome(), 7, 'applied');
    expect({ ...actual, headline: explicit.headline }).toEqual(explicit);
    expect(actual.summary).toBe(input.summary);
    expect(actual.reasons).toBe(input.reasons);

    const hazard = JSON.parse(readFileSync(join(ROOT, 'scripts/hazard-registry.json'), 'utf8')).classes.find((row) => row.id === 'HZ-CROSSHOME');
    expect({ status: hazard.status, acceptedReason: hazard.acceptedReason, instances: hazard.instances, inChain: hazard.enforcer.inChain }).toEqual({ status: 'MACHINERY', acceptedReason: null, instances: 53, inChain: true });
    expect(hazard.enforcer.paths).toEqual(expect.arrayContaining(['tests/lint/newsHeadlineContract.walker.test.js', 'scripts/lib/news-headline-contract.mjs', 'tests/lint/.news-headline-contract-baseline.json']));
    const preMortem = PREDICATES.find((row) => row.id === 'cross-home-voice-substrate-touched'); const context = makeContext({ root: ROOT, rev: null });
    expect(preMortem.population(context).items).toEqual([...new Set([
      ...NEWS_VOICE_PROTECTED_SUBSTRATE, ...PROSE_FAMILY_PROTECTED_SUBSTRATE,
    ])].sort(codepoint));
    expect(preMortem.run(context, { changes: [{ status: 'A', path: 'scripts/lib/news-headline-contract.mjs', oldPath: null }] })).toHaveLength(1);
    const mutation = JSON.parse(readFileSync(join(ROOT, 'scripts/mutation-coverage-manifest.json'), 'utf8')).invariants['tests/lint/newsHeadlineContract.walker.test.js'];
    expect(mutation.kind).toBe('rationale'); expect(mutation.rationale).toContain("AO-4's eight ordinary cases");
    expect(readFileSync(join(ROOT, 'tests/lint/sovereigntyLightingContract.walker.test.js'), 'utf8')).toContain('files: 2412, parked: 365, credited: 2047, titles: 19984, suiteTitles: 5638');
  });

  it('A8 fails closed on duplicate, overlapping, indicative, and third-lane inputs', () => {
    expect(() => measureHeadlineRewriteLiveness(rawRows, [...APPLIED_HEADLINE_REWRITES, APPLIED_HEADLINE_REWRITES[0]])).toThrow(/duplicate/);
    expect(() => measureHeadlineRewriteLiveness(rawRows, [...APPLIED_HEADLINE_REWRITES, [/\bmay\b/, 'acts']])).toThrow(/overlap/);
    const indicative = clone(rawRows); indicative[0].headline = 'mayless'; expect(() => measureHeadlineRewriteLiveness(indicative, [[/mayless/, 'x']])).toThrow(/indicative/);
    const third = clone(rawRows); third[0].field = 'consequenceOutcomes'; expect(() => rawHeadlineLivenessOf(third)).toThrow(/persisted liveness lane/);
    const duplicate = clone(rawRows); duplicate.splice(1, 0, clone(duplicate[0])); expect(() => rawHeadlineLivenessOf(duplicate)).toThrow();
  });
});
