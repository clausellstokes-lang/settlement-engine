/**
 * SP-6 phrase-repetition evidence: Wizard News preserves the metadata the audit
 * needs, the audit groups the reader's real settlement/season cells, and the
 * collapsed-pool mutant escapes the authored envelope.
 */
import { describe, expect, test } from 'vitest';

import {
  appendWizardNewsEntries,
  summarizeWizardNews,
  WIZARD_NEWS_SIGNIFICANCE,
} from '../../src/domain/region/wizardNews.js';
import { dispositionReceipt } from '../../src/domain/worldPulse/eventProse.js';
import { newsBodyText } from '../../src/domain/display/newsBody.js';
import { observeBehavioralYear } from '../../scripts/audit/behavioral-observation.mjs';
import {
  evaluatePhraseRepetitionEnvelope,
  measurePhraseRepetition,
  PHRASE_SEASON_TICKS,
} from '../../scripts/audit/phrase-repetition.mjs';

const NOW = '2026-08-02T00:00:00.000Z';
const INTERP = Object.freeze({
  settlement: 'Ashford', band: 'guarded', good: 'grain',
  house: 'House Rowan', temple: 'Harvest Chapter',
  domain: 'hunt', lean: 'toward force', weight: 'more', answer: 'bolder',
  welcome: 'more readily', aspect: 'martial', practice: 'the use of force',
});

function rawEntry(receipt, index, extra = {}) {
  return {
    id: `wizard_news.4.disposition.${index}`,
    tick: 4,
    createdAt: NOW,
    scope: 'settlement',
    significance: receipt.significance,
    score: 45,
    severity: 0.35,
    headline: 'Ashford changes its temper',
    summary: receipt.line,
    kind: 'applied',
    impactKind: receipt.kind,
    settlementIds: ['ashford'],
    settlementNames: ['Ashford'],
    impactIds: [],
    channelIds: [],
    reasons: ['The disposition ledger crossed an authored band.'],
    familyId: receipt.familyId,
    ...extra,
  };
}

function fiveFamilies() {
  const byFamily = new Map();
  for (const index of Array.from({ length: 300 }, (_, value) => value)) {
    const receipt = dispositionReceipt('disposition_martial_crossed', `ashford:${index}`, INTERP);
    if (receipt && !byFamily.has(receipt.familyId)) byFamily.set(receipt.familyId, receipt);
  }
  return [...byFamily.values()].sort((left, right) => (
    left.familyId < right.familyId ? -1 : left.familyId > right.familyId ? 1 : 0
  ));
}

describe('SP-6 metadata survives Wizard News normalization', () => {
  test('routine, settlement names, and structural family all survive', () => {
    const receipt = dispositionReceipt('war_culture_suppressed', 'ashford', INTERP);
    const feed = appendWizardNewsEntries({}, [rawEntry(receipt, 1, { covert: true })], { now: NOW });
    expect(feed.entries).toHaveLength(1);
    expect(feed.entries[0]).toMatchObject({
      significance: WIZARD_NEWS_SIGNIFICANCE.ROUTINE,
      settlementIds: ['ashford'],
      settlementNames: ['Ashford'],
      familyId: receipt.familyId,
      covert: true,
    });
    const summary = summarizeWizardNews(feed);
    expect(summary.major).toHaveLength(0);
    expect(summary.notables).toHaveLength(1);
    expect('routine' in summary).toBe(false);
    expect(summary.threads[0].significance).toBe(WIZARD_NEWS_SIGNIFICANCE.ROUTINE);
    expect(newsBodyText(feed.entries[0])).toBe(receipt.line);
  });

  test('legacy rows remain absent-tolerant instead of gaining empty metadata keys', () => {
    const feed = appendWizardNewsEntries({}, [{
      id: 'legacy', tick: 1, significance: 'notable', headline: 'Old news',
    }], { now: NOW });
    expect(feed.entries).toHaveLength(1);
    expect('settlementNames' in feed.entries[0]).toBe(false);
    expect('familyId' in feed.entries[0]).toBe(false);
    expect(feed.entries[0].significance).toBe(WIZARD_NEWS_SIGNIFICANCE.NOTABLE);
  });

  test('pre-WR-2 producers passing names do not acquire a new persisted v1 field', () => {
    const feed = appendWizardNewsEntries({}, [{
      id: 'legacy-with-names', tick: 1, significance: 'notable', headline: 'Old news',
      settlementIds: ['ashford'], settlementNames: ['Ashford'],
    }], { now: NOW });
    expect(feed.entries[0].settlementIds).toEqual(['ashford']);
    expect('settlementNames' in feed.entries[0]).toBe(false);
    expect('familyId' in feed.entries[0]).toBe(false);
  });

  test('the parallel name chain preserves two settlements with the same name', () => {
    const receipt = dispositionReceipt('disposition_diplomatic_crossed', 'twins', INTERP);
    const feed = appendWizardNewsEntries({}, [rawEntry(receipt, 2, {
      settlementIds: ['east-twin', 'west-twin'],
      settlementNames: ['Twinford', 'Twinford'],
    })], { now: NOW });
    expect(feed.entries[0].settlementIds).toEqual(['east-twin', 'west-twin']);
    expect(feed.entries[0].settlementNames).toEqual(['Twinford', 'Twinford']);
  });
});

describe('SP-6 phrase-repetition instrument', () => {
  test('five structural families in one settlement-season measure no repeat', () => {
    const receipts = fiveFamilies();
    expect(receipts).toHaveLength(5);
    const entries = receipts.map((receipt, index) => rawEntry(receipt, index));
    const result = evaluatePhraseRepetitionEnvelope(entries, {
      maxFamilyRepeatRate: 0.2,
      minObservations: 5,
    });
    expect(result.powered).toBe(true);
    expect(result.passed).toBe(true);
    expect(result.measurement).toMatchObject({
      windowTicks: PHRASE_SEASON_TICKS,
      observations: 5,
      windows: 1,
      exactRepeats: 0,
      familyRepeats: 0,
      exactRepeatRate: 0,
      familyRepeatRate: 0,
      untrackedFamilies: 0,
    });
  });

  test('MUTANT: collapsing the pool to one family reds the same envelope', () => {
    const receipts = fiveFamilies();
    expect(receipts).toHaveLength(5);
    const entries = receipts.map((receipt, index) => rawEntry(receipt, index));
    const first = entries[0];
    const collapsed = entries.map((entry) => ({
      ...entry,
      summary: first.summary,
      familyId: first.familyId,
    }));
    const result = evaluatePhraseRepetitionEnvelope(collapsed, {
      maxFamilyRepeatRate: 0.2,
      minObservations: 5,
    });
    expect(result.powered).toBe(true);
    expect(result.passed).toBe(false);
    expect(result.measurement.exactRepeats).toBe(4);
    expect(result.measurement.familyRepeats).toBe(4);
    expect(result.measurement.familyRepeatRate).toBe(0.8);
  });

  test('the collision cell is settlement plus season, not the whole corpus', () => {
    const receipt = fiveFamilies()[0];
    expect(receipt).toBeTruthy();
    const entries = [
      rawEntry(receipt, 1, { tick: 2 }),
      rawEntry(receipt, 2, { tick: PHRASE_SEASON_TICKS + 2 }),
      rawEntry(receipt, 3, { settlementIds: ['brill'], settlementNames: ['Brill'], tick: 2 }),
    ];
    const measured = measurePhraseRepetition(entries);
    expect(measured.observations).toBe(3);
    expect(measured.windows).toBe(3);
    expect(measured.familyRepeats).toBe(0);
  });

  test('the maintained behavioral observation actually emits the instrument', () => {
    const receipt = fiveFamilies()[0];
    const entry = rawEntry(receipt, 1);
    const year = observeBehavioralYear({
      year: 1,
      result: { worldState: { tick: 52, simulationRules: {} } },
      beforeSaves: [],
      afterSaves: [],
      rawWizardNewsEntries: [entry],
    });
    expect(year.phraseRepetition).toMatchObject({
      kind: 'phrase_repetition',
      observations: 1,
      windows: 1,
      untrackedFamilies: 0,
    });
  });
});
