/**
 * SP-6 narration-kit walker — WR-2's first governed phrased-kind cohort.
 *
 * WHAT_PHRASES registration is no longer a string-only checkbox. Every governed
 * kind must join an authored pool of at least four structural families, the one
 * significance vocabulary, an explicit audience, a Herald section, and a conscious
 * crier-voice decision. The exact WR-2 census anchors the denominator.
 */
import { describe, expect, test } from 'vitest';

import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { newsVoiceCategory } from '../../src/domain/display/newsVoice.js';
import { SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import { WIZARD_NEWS_SIGNIFICANCE } from '../../src/domain/region/wizardNews.js';
import {
  dispositionReceipt,
  WAR_DISPOSITION_KIND_REGISTRY,
  WAR_DISPOSITION_KINDS,
} from '../../src/domain/worldPulse/eventProse.js';

const EXPECTED_KINDS = Object.freeze([
  'disposition_martial_crossed',
  'disposition_mercantile_crossed',
  'disposition_diplomatic_crossed',
  'disposition_insular_crossed',
  'disposition_reversal',
  'deity_war_pressure',
  'deity_peace_pressure',
  'war_culture_suppressed',
]);

const INTERP = Object.freeze({
  settlement: 'Ashford',
  band: 'guarded',
  good: 'grain',
  house: 'House Rowan',
  temple: 'Harvest Chapter',
  domain: 'hunt',
  lean: 'toward force',
  weight: 'more',
  answer: 'bolder',
  welcome: 'more readily',
  aspect: 'martial',
  practice: 'the use of force',
});

function registrationIssues(rows, phrases = WHAT_PHRASES) {
  const significance = new Set(Object.values(WIZARD_NEWS_SIGNIFICANCE));
  const issues = [];
  for (const row of rows) {
    if (!phrases[row.kind]) issues.push(`${row.kind}:missing-WHAT_PHRASES`);
    if (!Array.isArray(row.pool) || row.pool.length < 4) {
      issues.push(`${row.kind}:pool-floor:${Array.isArray(row.pool) ? row.pool.length : 0}`);
    }
    if (!Array.isArray(row.requiredSlots) || row.requiredSlots.length !== row.pool.length) {
      issues.push(`${row.kind}:slot-contract-mismatch`);
    }
    if (!significance.has(row.significance)) issues.push(`${row.kind}:bad-significance`);
    if (row.audience !== 'public' && row.audience !== 'dm-only') issues.push(`${row.kind}:bad-audience`);
    if (SECTION_OF(row.kind) !== row.section) issues.push(`${row.kind}:bad-section`);
    if (newsVoiceCategory({ impactKind: row.kind }) !== null) issues.push(`${row.kind}:mis-voiced`);
  }
  return issues;
}

describe('SP-6 phrased-kind registry — WR-2', () => {
  test('the governed census is exact and every registration join is paid', () => {
    expect(WAR_DISPOSITION_KINDS).toEqual(EXPECTED_KINDS);
    expect(WAR_DISPOSITION_KIND_REGISTRY.map((row) => row.kind)).toEqual(EXPECTED_KINDS);
    expect(registrationIssues(WAR_DISPOSITION_KIND_REGISTRY)).toEqual([]);
  });

  test.each(WAR_DISPOSITION_KIND_REGISTRY)(
    '$kind has five clean structural templates above the floor',
    (row) => {
      expect(row.pool).toHaveLength(5);
      const rendered = row.pool.map((variant) => (
        typeof variant === 'function' ? String(variant(INTERP)) : String(variant)
      ));
      expect(new Set(rendered).size).toBe(5);
      for (const line of rendered) {
        expect(line).toBe(line.trim());
        expect(/\$\{|\bundefined\b|\bNaN\b/.test(line)).toBe(false);
        expect(/\d|%|×/.test(line)).toBe(false);
      }
    },
  );

  test('the family-aware selector is deterministic and reaches every family', () => {
    const rows = Array.from({ length: 200 }, (_, index) => (
      dispositionReceipt('disposition_martial_crossed', `ashford:${index}`, INTERP)
    ));
    expect(rows.every(Boolean)).toBe(true);
    expect(new Set(rows.map((row) => row.familyId)).size).toBe(5);
    expect(new Set(rows.map((row) => row.line)).size).toBe(5);
    expect(dispositionReceipt('disposition_martial_crossed', 'ashford:7', INTERP))
      .toEqual(dispositionReceipt('disposition_martial_crossed', 'ashford:7', INTERP));
    expect(dispositionReceipt('not_a_governed_kind', 'ashford', INTERP)).toBeNull();
  });

  test('truth-slot resolution skips an ineligible house template instead of fabricating', () => {
    const candidateSeeds = Array.from({ length: 300 }, (_, index) => `ashford:${index}`);
    const houseSeed = candidateSeeds.find((seed) => (
      dispositionReceipt('disposition_insular_crossed', seed, INTERP)?.familyId
        === 'disposition_insular_crossed.2'
    ));
    expect(houseSeed).toBeTruthy();
    const withTruth = dispositionReceipt('disposition_insular_crossed', houseSeed, INTERP);
    expect(withTruth).toMatchObject({ familyId: 'disposition_insular_crossed.2' });
    expect(withTruth.line.includes('House Rowan')).toBe(true);

    const withoutHouse = dispositionReceipt('disposition_insular_crossed', houseSeed, {
      settlement: 'Ashford',
      band: 'guarded',
      lean: 'toward its own walls',
      weight: 'less',
      answer: 'more guarded',
      welcome: 'more warily',
      aspect: 'inward',
      practice: 'outside ties',
      domain: 'hunt',
    });
    expect(withoutHouse).toBeTruthy();
    expect(withoutHouse.familyId === 'disposition_insular_crossed.2').toBe(false);
    expect(withoutHouse.line.includes('undefined')).toBe(false);
    expect(withoutHouse.line.includes('House Rowan')).toBe(false);
  });

  test.each(WAR_DISPOSITION_KIND_REGISTRY)(
    '$kind stays authored when optional house/good/temple truths are absent',
    (row) => {
      const partial = {
        settlement: 'Ashford', band: 'guarded', lean: 'toward force', weight: 'more',
        answer: 'bolder', welcome: 'more readily', aspect: 'martial',
        practice: 'the use of force', domain: 'hunt',
      };
      const receipts = Array.from({ length: 80 }, (_, index) => (
        dispositionReceipt(row.kind, `partial:${index}`, partial)
      ));
      expect(receipts.every(Boolean)).toBe(true);
      expect(receipts.every((receipt) => !receipt.line.includes('undefined'))).toBe(true);
    },
  );

  test('the dm-only suppression receipt is routine; every public crossing is notable', () => {
    const suppression = WAR_DISPOSITION_KIND_REGISTRY.find((row) => row.kind === 'war_culture_suppressed');
    expect(suppression).toMatchObject({ audience: 'dm-only', significance: 'routine', section: 'war' });
    const publicRows = WAR_DISPOSITION_KIND_REGISTRY.filter((row) => row.kind !== 'war_culture_suppressed');
    expect(publicRows).toHaveLength(7);
    expect(new Set(publicRows.map((row) => `${row.audience}:${row.significance}`)))
      .toEqual(new Set(['public:notable']));
  });

  test('mutants: a two-template pool and a missing phrase both red the same walker', () => {
    const first = WAR_DISPOSITION_KIND_REGISTRY[0];
    const shallow = [{ ...first, pool: first.pool.slice(0, 2) }];
    expect(registrationIssues(shallow)).toEqual([
      'disposition_martial_crossed:pool-floor:2',
      'disposition_martial_crossed:slot-contract-mismatch',
    ]);
    expect(registrationIssues([first], {})).toEqual([
      'disposition_martial_crossed:missing-WHAT_PHRASES',
    ]);
  });
});
