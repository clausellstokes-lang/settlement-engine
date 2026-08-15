/**
 * SP-6 narration-kit walker — WR-3's governed lineage cohort.
 *
 * The five annex kinds pay every reader join together: five structural prose
 * families, stable family identity, closed significance/audience metadata,
 * WHAT_PHRASES, and the intended Herald desk. This is presentation evidence,
 * never a claim that the dark lineage scorer has executed.
 */
import { describe, expect, test } from 'vitest';

import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { newsVoiceCategory } from '../../src/domain/display/newsVoice.js';
import { SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import { WIZARD_NEWS_SIGNIFICANCE } from '../../src/domain/region/wizardNews.js';
import {
  lineageReceipt,
  WAR_LINEAGE_KIND_REGISTRY,
  WAR_LINEAGE_KINDS,
} from '../../src/domain/worldPulse/eventProse.js';

const EXPECTED = Object.freeze([
  Object.freeze({ kind: 'lineage_edge_recorded', significance: 'notable', audience: 'public', section: 'events' }),
  Object.freeze({ kind: 'casus_lineage_claim_parent', significance: 'major', audience: 'public', section: 'war' }),
  Object.freeze({ kind: 'casus_lineage_claim_child', significance: 'major', audience: 'public', section: 'war' }),
  Object.freeze({ kind: 'mirror_kinship_bond', significance: 'notable', audience: 'public', section: 'events' }),
  Object.freeze({ kind: 'lineage_claim_suppressed', significance: 'routine', audience: 'dm-only', section: 'war' }),
]);

const INTERP = Object.freeze({
  settlement: 'Daughterford',
  counterpart: 'Oldbridge',
  band: 'far',
  house: 'House Rowan',
});

describe('SP-6 phrased-kind registry — WR-3 lineage', () => {
  test('the five-kind census is exact and every metadata join agrees', () => {
    expect(WAR_LINEAGE_KINDS).toEqual(EXPECTED.map((row) => row.kind));
    expect(WAR_LINEAGE_KIND_REGISTRY).toHaveLength(5);
    const significance = new Set(Object.values(WIZARD_NEWS_SIGNIFICANCE));
    for (const value of ['major', 'notable', 'routine']) expect(significance.has(value)).toBe(true);

    for (const expected of EXPECTED) {
      const row = WAR_LINEAGE_KIND_REGISTRY.find((candidate) => candidate.kind === expected.kind);
      expect(row).toMatchObject(expected);
      expect(row.pool).toHaveLength(5);
      expect(row.requiredSlots).toHaveLength(5);
      expect(WHAT_PHRASES[row.kind], `${row.kind}: missing WHAT_PHRASES`).toBeTruthy();
      expect(WHAT_PHRASES[row.kind]).not.toMatch(/_/);
      expect(SECTION_OF(row.kind), `${row.kind}: wrong Herald desk`).toBe(row.section);
      expect(newsVoiceCategory({ impactKind: row.kind }), `${row.kind}: borrowed crier voice`).toBeNull();
    }
  });

  test.each(WAR_LINEAGE_KIND_REGISTRY)(
    '$kind has five distinct, number-free structural families',
    (row) => {
      const rendered = row.pool.map((variant) => (
        typeof variant === 'function' ? String(variant(INTERP)) : String(variant)
      ));
      expect(new Set(rendered).size).toBe(5);
      for (const line of rendered) {
        expect(line).toBe(line.trim());
        expect(line).not.toMatch(/\$\{|\bundefined\b|\bNaN\b/);
        expect(line).not.toMatch(/\d|%|×/);
        expect(line).not.toContain(row.kind);
      }
    },
  );

  test.each(WAR_LINEAGE_KIND_REGISTRY)(
    '$kind selects deterministically and reaches every family',
    (row) => {
      const receipts = Array.from({ length: 300 }, (_, index) => (
        lineageReceipt(row.kind, `lineage:${index}`, INTERP)
      ));
      expect(receipts.every(Boolean)).toBe(true);
      expect(new Set(receipts.map((receipt) => receipt.familyId)).size).toBe(5);
      expect(lineageReceipt(row.kind, 'fixed-seed', INTERP))
        .toEqual(lineageReceipt(row.kind, 'fixed-seed', INTERP));
    },
  );

  test('missing optional truths skip their templates instead of fabricating them', () => {
    const seeds = Array.from({ length: 500 }, (_, index) => `truth:${index}`);
    const houseSeed = seeds.find((seed) => (
      lineageReceipt('casus_lineage_claim_child', seed, INTERP)?.familyId
        === 'casus_lineage_claim_child.3'
    ));
    const bandSeed = seeds.find((seed) => (
      lineageReceipt('casus_lineage_claim_parent', seed, INTERP)?.familyId
        === 'casus_lineage_claim_parent.1'
    ));
    expect(houseSeed).toBeTruthy();
    expect(bandSeed).toBeTruthy();

    const withoutHouse = lineageReceipt('casus_lineage_claim_child', houseSeed, {
      settlement: INTERP.settlement,
      counterpart: INTERP.counterpart,
      band: INTERP.band,
    });
    const withoutBand = lineageReceipt('casus_lineage_claim_parent', bandSeed, {
      settlement: INTERP.settlement,
      counterpart: INTERP.counterpart,
      house: INTERP.house,
    });
    expect(withoutHouse.familyId).not.toBe('casus_lineage_claim_child.3');
    expect(withoutHouse.line).not.toMatch(/undefined|House Rowan/);
    expect(withoutBand.familyId).not.toBe('casus_lineage_claim_parent.1');
    expect(withoutBand.line).not.toMatch(/undefined|\bfar\b/);

    // Families with no truth slots remain honest fallbacks; an unknown kind does not.
    expect(lineageReceipt('lineage_edge_recorded', null, {})).toMatchObject({
      familyId: 'lineage_edge_recorded.3',
      significance: 'notable',
      audience: 'public',
      section: 'events',
    });
    expect(lineageReceipt('not_a_lineage_kind', 'seed', INTERP)).toBeNull();
  });

  test('only suppression is private and both claims are major war stories', () => {
    const suppression = WAR_LINEAGE_KIND_REGISTRY.find((row) => row.kind === 'lineage_claim_suppressed');
    expect(suppression).toMatchObject({ audience: 'dm-only', significance: 'routine', section: 'war' });
    expect(WAR_LINEAGE_KIND_REGISTRY.filter((row) => row.audience === 'dm-only'))
      .toEqual([suppression]);
    expect(WAR_LINEAGE_KIND_REGISTRY.filter((row) => row.kind.startsWith('casus_')))
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ kind: 'casus_lineage_claim_parent', significance: 'major', section: 'war' }),
        expect.objectContaining({ kind: 'casus_lineage_claim_child', significance: 'major', section: 'war' }),
      ]));
  });
});
