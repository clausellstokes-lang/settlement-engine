/**
 * WR-5 phrased-kind walker: exact census, five authored families, governed
 * significance/audience/desk joins, and no-fabrication slot selection.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import {
  heraldSectionOfRecord,
  SECTION_OF,
} from '../../src/domain/realm/heraldRouting.js';
import {
  WAR_RULING_KIND_REGISTRY,
  WAR_RULING_KINDS,
  warRulingReceipt,
} from '../../src/domain/worldPulse/eventProse.js';

const EXPECTED = Object.freeze([
  ['sued_for_peace_seat', 'major', 'public', 'adjudication'],
  ['sued_for_peace_realm', 'major', 'public', 'adjudication'],
  ['war_continued_for_the_seat', 'major', 'public', 'war'],
  ['war_ended_against_rival_triumph', 'major', 'public', 'war'],
  ['peace_refused', 'major', 'public', 'adjudication'],
  ['refusal_cost_legitimacy', 'notable', 'public', 'adjudication'],
  ['refusal_cost_ally_patience', 'notable', 'public', 'war'],
  ['ruler_books_compromised', 'major', 'dm-only', 'adjudication'],
  ['war_party_overturns_peacemaker', 'major', 'public', 'adjudication'],
  ['peace_party_overturns_warmonger', 'major', 'public', 'adjudication'],
  ['succession_demand_inherited', 'notable', 'public', 'adjudication'],
  ['successor_repudiates_war', 'major', 'public', 'war'],
  ['successor_escalates_war', 'major', 'public', 'war'],
  ['war_dissolved_by_verdict', 'major', 'public', 'adjudication'],
]);

const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Eastvale',
  npc: 'Aldric Venn',
  faction: 'House Rowan',
  third_party: 'Greywatch',
  reason: 'the seat chose to keep the field',
  route: 'the Eastvale road',
  band: 'deeply',
});

function annexLines(kind) {
  const source = readFileSync(new URL('../../docs/content/RECEIPT_POOLS_WAR.md', import.meta.url), 'utf8');
  const wr5 = source.slice(source.indexOf('# WR-5'), source.indexOf('# WR-6'));
  const heading = `### ${kind} `;
  const start = wr5.indexOf(heading);
  expect(start, `${kind}: missing WR-5 annex heading`).toBeGreaterThanOrEqual(0);
  const rest = wr5.slice(start + heading.length);
  const next = rest.indexOf('\n### ');
  const block = next >= 0 ? rest.slice(0, next) : rest;
  return [...block.matchAll(/^\d+\. (.+)$/gm)].map((match) => (
    match[1]
      .replace(/\s+\*\(§8\)\*$/, '')
      .replace(/\{(\w+)\}/g, (_, slot) => String(INTERP[slot]))
  ));
}

describe('SP-6 phrased-kind registry — WR-5 war rulings', () => {
  test('the fourteen-kind census and every governed join are exact', () => {
    expect(WAR_RULING_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(WAR_RULING_KIND_REGISTRY).toHaveLength(14);
    for (const [kind, significance, audience, section] of EXPECTED) {
      const row = WAR_RULING_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(5);
      expect(row.requiredSlots).toHaveLength(5);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      expect(WHAT_PHRASES[kind]).toBeTruthy();
      expect(WHAT_PHRASES[kind]).not.toMatch(/_/);
      if (section === 'war') expect(SECTION_OF(kind)).toBe('war');
      else expect(SECTION_OF(kind)).toBe('events');
      expect(heraldSectionOfRecord({
        kind,
        section,
        sectionAuthority: 'war_rulings_registry',
      })).toBe(section);
    }
  });

  test.each(WAR_RULING_KIND_REGISTRY)(
    '$kind retains the five annex families without editorial cross-references',
    (row) => {
      const rendered = row.pool.map((variant) => (
        typeof variant === 'function' ? String(variant(INTERP)) : String(variant)
      ));
      expect(rendered).toEqual(annexLines(row.kind));
      expect(new Set(rendered).size).toBe(5);
      for (const line of rendered) {
        expect(line).toBe(line.trim());
        expect(line).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b/);
      }
    },
  );

  test.each(WAR_RULING_KIND_REGISTRY)(
    '$kind is deterministic and all five structural families are reachable',
    (row) => {
      const receipts = Array.from({ length: 400 }, (_, index) => (
        warRulingReceipt(row.kind, `wr-five:${index}`, INTERP)
      ));
      expect(receipts.every(Boolean)).toBe(true);
      expect(new Set(receipts.map((receipt) => receipt.familyId)).size).toBe(5);
      expect(warRulingReceipt(row.kind, 'same', INTERP))
        .toEqual(warRulingReceipt(row.kind, 'same', INTERP));
    },
  );

  test.each(WAR_RULING_KIND_REGISTRY)(
    '$kind skips a family when its named evidence is absent',
    (row) => {
      for (const [templateIndex, requiredSlots] of row.requiredSlots.entries()) {
        if (!requiredSlots.length) continue;
        const familyId = `${row.kind}.${templateIndex + 1}`;
        const seed = Array.from({ length: 600 }, (_, index) => `slot:${index}`)
          .find((candidate) => warRulingReceipt(row.kind, candidate, INTERP)?.familyId === familyId);
        expect(seed, `${familyId}: complete evidence reaches family`).toBeTruthy();
        const partial = { ...INTERP };
        for (const slot of requiredSlots) delete partial[slot];
        const fallback = warRulingReceipt(row.kind, seed, partial);
        expect(fallback).toBeTruthy();
        expect(fallback.familyId).not.toBe(familyId);
        expect(fallback.line).not.toMatch(/\bundefined\b|\bNaN\b/);
      }
    },
  );

  test('unknown kinds stay closed and the sole private row is exact', () => {
    expect(warRulingReceipt('war_ruling_unknown', 'seed', INTERP)).toBeNull();
    expect(WAR_RULING_KIND_REGISTRY.filter((row) => row.audience === 'dm-only'))
      .toEqual([expect.objectContaining({ kind: 'ruler_books_compromised', section: 'adjudication' })]);
  });
});
