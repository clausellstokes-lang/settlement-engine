import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

import { buildObservedCorpus, OBSERVED_SCALAR_FIELDS } from '../../scripts/lib/observed-shape-corpus.mjs';
import {
  NEWS_VOICE_ADDRESSES,
  NEWS_VOICE_RETRO_ROWS,
  compareNewsVoiceDebt,
  introducedDeltaOf,
  measureNewsVoiceDebt,
  reconstructWizardNewsIntroductions,
  validateNewsVoiceBaseline,
  voiceClassOf,
} from '../../scripts/lib/news-voice-contract.mjs';
import { newsEntryForOutcome } from '../../src/domain/worldPulse/worldPulseFeedCuration.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ZERO_TOTALS = Object.freeze({ identities: 0, distinctValues: 0, occurrences: 0 });
const ENTRY_KEYS = Object.freeze([
  'id', 'tick', 'scope', 'significance', 'score', 'headline', 'summary', 'kind',
  'impactKind', 'channelType', 'severity', 'settlementIds', 'impactIds', 'channelIds',
  'sourceEventId', 'tags', 'reasons',
]);
const kinds = NEWS_VOICE_ADDRESSES.map((home) => home.split('|')[1]);
const outcomeFor = (candidateType, summary = `${candidateType} can advance through measured pressure.`) => ({
  id: `voice.${candidateType}`,
  type: 'npc',
  candidateType,
  applyMode: 'auto',
  severity: 0.4,
  headline: `${candidateType} may reform`,
  summary,
  reasons: [`reason for ${candidateType}`],
  targetSaveId: 'alpha',
});
const clone = (value) => JSON.parse(JSON.stringify(value));

let baseline;
let scalarRows;
let reconstruction;
let secondReconstruction;
let liveDebt;

describe('cross-home Wizard News voice contract', () => {
  beforeAll(async () => {
    baseline = validateNewsVoiceBaseline(JSON.parse(readFileSync(
      join(ROOT, 'tests/lint/.news-voice-baseline.json'), 'utf8',
    )));
    const corpus = await buildObservedCorpus({ scalarFields: OBSERVED_SCALAR_FIELDS });
    scalarRows = corpus.scalarObservations;
    reconstruction = reconstructWizardNewsIntroductions(scalarRows);
    secondReconstruction = reconstructWizardNewsIntroductions(scalarRows);
    liveDebt = measureNewsVoiceDebt(reconstruction.entries);
  }, 900_000);

  it('reconstructs one deterministic, conserved AO-0 Wizard News history', () => {
    expect(secondReconstruction).toEqual(reconstruction);
    expect({
      pulseRoots: reconstruction.pulseRoots,
      introductions: reconstruction.introductions,
      retirements: reconstruction.retirements,
      finalEntries: reconstruction.finalEntries,
      homes: reconstruction.homes,
    }).toEqual(baseline.corpus);
    expect(reconstruction.introductions - reconstruction.retirements)
      .toBe(reconstruction.finalEntries);
  });

  it('preserves duplicate occurrences and keeps reasons inside canonical identity', () => {
    expect(baseline.retroDetection.rows
      .reduce((sum, row) => sum + row.occurrences - row.distinctValues, 0)).toBe(5);
    const byEveryNonReasonLeaf = new Map();
    for (const entry of reconstruction.entries) {
      const key = JSON.stringify(entry.leaves.filter(([path]) => JSON.parse(path)[0][1] !== 'reasons'));
      if (!byEveryNonReasonLeaf.has(key)) byEveryNonReasonLeaf.set(key, []);
      byEveryNonReasonLeaf.get(key).push(entry);
    }
    const pair = [...byEveryNonReasonLeaf.values()].find((rows) => (
      new Set(rows.map((row) => row.signature)).size > 1
      && rows.some((row) => row.leaves.some(([path]) => path.includes('reasons')))
    ));
    expect(pair, 'AO-0 no longer carries a same-prose/different-reasons identity witness').toBeTruthy();
    expect(new Set(pair.map((row) => row.signature)).size).toBeGreaterThan(1);
    const same = (sourceIndex) => ({ signature: 'same', sourceIndex });
    expect(introducedDeltaOf([same(5)], [same(2), same(0)]).introductions.map((row) => row.sourceIndex))
      .toEqual([0]);
  });

  it('fails closed on empty, malformed, or incomplete scalar snapshots', () => {
    expect(() => reconstructWizardNewsIntroductions([])).toThrow(/empty/);
    expect(() => reconstructWizardNewsIntroductions([{
      root: 'pulseResult', rootOrdinal: 0, path: [{ kind: 'field', value: 'wizardNews' }], value: 'x',
    }])).toThrow(/empty/);
    const headline = scalarRows.find((row) => row.root === 'pulseResult'
      && row.path?.[3]?.kind === 'field' && row.path[3].value === 'headline');
    expect(headline).toBeTruthy();
    expect(() => reconstructWizardNewsIntroductions(scalarRows.filter((row) => row !== headline)))
      .toThrow(/missing headline/);
    const malformed = scalarRows.map((row) => (row === headline
      ? { ...row, path: [...row.path.slice(0, 3), { kind: 'field', value: '' }] } : row));
    expect(() => reconstructWizardNewsIntroductions(malformed)).toThrow(/malformed typed path/);
  });

  it('holds a closed seven-address and two-class voice vocabulary', () => {
    expect(NEWS_VOICE_ADDRESSES).toEqual(baseline.retroDetection.rows.map((row) => row.home));
    expect(NEWS_VOICE_ADDRESSES).toEqual([
      'applied|npc_bargain', 'applied|npc_exploit', 'applied|npc_expose',
      'applied|npc_mobilize', 'applied|npc_protect', 'applied|npc_reform',
      'applied|npc_suppress',
    ]);
    expect(voiceClassOf('A house can advance through pressure.')).toBe('prospective');
    expect(voiceClassOf('A house advances through pressure.')).toBe('indicative');
    expect(() => voiceClassOf('')).toThrow(/nonblank/);
    expect(() => voiceClassOf(null)).toThrow(/nonblank/);
  });

  it('validates the immutable denominator and rejects malformed baseline envelopes', () => {
    expect(baseline.retroDetection.rows).toEqual(NEWS_VOICE_RETRO_ROWS);
    for (const mutate of [
      (row) => { row.retroDetection.rows[0].occurrences += 1; row.retroDetection.totals.occurrences += 1; },
      (row) => { row.retroDetection.rows.push(clone(row.retroDetection.rows[0])); },
      (row) => { row.corpus.introductions = 0; },
      (row) => { row.extra = true; },
    ]) {
      const candidate = clone(baseline);
      mutate(candidate);
      expect(() => validateNewsVoiceBaseline(candidate)).toThrow();
    }
  });

  it('rejects new, grown, shrunk, and vanished debt identities in both directions', () => {
    const frozen = clone(NEWS_VOICE_RETRO_ROWS);
    expect(compareNewsVoiceDebt(frozen, frozen)).toBe(true);
    const cases = [
      [...clone(frozen), { ...clone(frozen.at(-1)), home: 'applied|npc_unknown' }],
      clone(frozen).map((row, index) => (index ? row : { ...row, occurrences: row.occurrences + 1 })),
      clone(frozen).map((row, index) => (index ? row : { ...row, occurrences: row.occurrences - 1 })),
      clone(frozen).slice(1),
    ];
    for (const candidate of cases) expect(() => compareNewsVoiceDebt(candidate, frozen)).toThrow();
  });

  it('leaves proposals, unowned summaries, and nonmatching applied summaries unchanged', () => {
    const owned = outcomeFor(kinds[0]);
    const proposal = newsEntryForOutcome(owned, 7, 'proposal');
    expect(Object.keys(proposal)).toEqual(ENTRY_KEYS);
    expect(proposal).toEqual({
      id: `wizard_news.7.world_pulse.proposal.${owned.id}`,
      tick: 7,
      scope: 'settlement',
      significance: 'notable',
      score: 32,
      headline: owned.headline,
      summary: owned.summary,
      kind: 'queued',
      impactKind: owned.candidateType,
      channelType: null,
      severity: 0.4,
      settlementIds: ['alpha'],
      impactIds: [],
      channelIds: [],
      sourceEventId: owned.id,
      tags: ['world_pulse', 'npc', owned.candidateType, 'proposal'],
      reasons: owned.reasons,
    });
    expect(proposal.reasons).toBe(owned.reasons);
    expect(proposal.reasons).toEqual(owned.reasons);
    const unowned = outcomeFor('npc_sabotage');
    expect(newsEntryForOutcome(unowned, 7, 'applied').summary).toBe(unowned.summary);
    const nonmatching = outcomeFor(kinds[0], 'The bargain already advances through pressure.');
    expect(newsEntryForOutcome(nonmatching, 7, 'applied').summary).toBe(nonmatching.summary);
  });

  it('contract -> cure -> bank completion is aligned and debt-free', () => {
    compareNewsVoiceDebt(liveDebt, baseline.current.outstanding);
    const preCure = baseline.current.outstanding.length > 0;
    for (const kind of kinds) {
      const outcome = outcomeFor(kind);
      const before = clone(outcome);
      const proposal = newsEntryForOutcome(outcome, 7, 'proposal');
      const applied = newsEntryForOutcome(outcome, 7, 'applied');
      expect(outcome).toEqual(before);
      expect(Object.keys(applied)).toEqual(ENTRY_KEYS);
      const expectedSummary = preCure
        ? outcome.summary : outcome.summary.replace(/\bcan advance through\b/, 'advances through');
      expect(applied).toEqual({
        id: `wizard_news.7.world_pulse.applied.${outcome.id}`,
        tick: 7,
        scope: 'settlement',
        significance: 'notable',
        score: 32,
        headline: `${kind} reforms`,
        summary: expectedSummary,
        kind: 'applied',
        impactKind: kind,
        channelType: null,
        severity: 0.4,
        settlementIds: ['alpha'],
        impactIds: [],
        channelIds: [],
        sourceEventId: outcome.id,
        tags: ['world_pulse', 'npc', kind, 'applied'],
        reasons: outcome.reasons,
      });
      expect(proposal.summary).toBe(outcome.summary);
      expect(voiceClassOf(applied.summary)).toBe(preCure ? 'prospective' : 'indicative');
      expect(applied.reasons).toBe(outcome.reasons);
      expect(applied.reasons).toEqual(outcome.reasons);
    }
    expect(baseline.current.totals).toEqual(ZERO_TOTALS);
  });
});
