/**
 * WR-6 phrased-kind walker: exact twelve-kind census, five authored families,
 * governed metadata and desks, plus no-fabrication slot selection.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { heraldSectionOfRecord, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import {
  WAR_COALITION_KIND_REGISTRY,
  WAR_COALITION_KINDS,
  warCoalitionReceipt,
} from '../../src/domain/worldPulse/eventProse.js';

const EXPECTED = Object.freeze([
  ['coalition_entry_priced', 'notable', 'public', 'war'],
  ['coalition_joined', 'major', 'public', 'war'],
  ['coalition_refused', 'major', 'public', 'war'],
  ['casus_alliance_obligation', 'notable', 'public', 'war'],
  ['mirror_obligation_discharged', 'notable', 'public', 'events'],
  ['coalition_expenditure_read', 'notable', 'public', 'trade'],
  ['coalition_stayed', 'notable', 'public', 'war'],
  ['coalition_separate_peace', 'major', 'public', 'adjudication'],
  ['coalition_apportionment', 'major', 'public', 'adjudication'],
  ['coalition_spoils_divided', 'major', 'public', 'trade'],
  ['coalition_debt_paid', 'notable', 'public', 'trade'],
  ['coalition_debt_unpaid', 'major', 'public', 'trade'],
]);

const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Eastvale',
  third_party: 'Greywatch',
  band: 'a grave share',
  route: 'the Eastvale road',
  good: 'grain',
});

function annexLines(kind) {
  const source = readFileSync(new URL('../../docs/content/RECEIPT_POOLS_WAR.md', import.meta.url), 'utf8');
  const wr6 = source.slice(source.indexOf('# WR-6'), source.indexOf('# WR-7'));
  const heading = `### ${kind} `;
  const start = wr6.indexOf(heading);
  expect(start, `${kind}: missing WR-6 annex heading`).toBeGreaterThanOrEqual(0);
  const rest = wr6.slice(start + heading.length);
  const next = rest.indexOf('\n### ');
  const block = next >= 0 ? rest.slice(0, next) : rest;
  return [...block.matchAll(/^\d+\. (.+)$/gm)].map((match) => (
    match[1]
      .replace(/\s+\*\(§8\)\*$/, '')
      .replace(/\{(\w+)\}/g, (_, slot) => String(INTERP[slot]))
  ));
}

describe('SP-6 phrased-kind registry — WR-6 coalition graph', () => {
  test('the twelve-kind census and every reader join are exact', () => {
    expect(WAR_COALITION_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(WAR_COALITION_KIND_REGISTRY).toHaveLength(12);
    for (const [kind, significance, audience, section] of EXPECTED) {
      const row = WAR_COALITION_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(5);
      expect(row.requiredSlots).toHaveLength(5);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      expect(WHAT_PHRASES[kind]).toBeTruthy();
      expect(WHAT_PHRASES[kind]).not.toMatch(/_/);
      expect(SECTION_OF(kind)).toBe(section === 'adjudication' ? 'events' : section);
      expect(heraldSectionOfRecord({
        kind,
        section,
        sectionAuthority: 'war_coalition_registry',
      })).toBe(section);
    }
  });

  test.each(WAR_COALITION_KIND_REGISTRY)(
    '$kind retains the five receipt-annex families',
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

  test.each(WAR_COALITION_KIND_REGISTRY)(
    '$kind is deterministic and all five structural families are reachable',
    (row) => {
      const receipts = Array.from({ length: 400 }, (_, index) => (
        warCoalitionReceipt(row.kind, `wr-six:${index}`, INTERP)
      ));
      expect(receipts.every(Boolean)).toBe(true);
      expect(new Set(receipts.map((receipt) => receipt.familyId)).size).toBe(5);
      expect(warCoalitionReceipt(row.kind, 'same', INTERP))
        .toEqual(warCoalitionReceipt(row.kind, 'same', INTERP));
    },
  );

  test.each(WAR_COALITION_KIND_REGISTRY)(
    '$kind skips a family when its named evidence is absent',
    (row) => {
      for (const [templateIndex, requiredSlots] of row.requiredSlots.entries()) {
        if (!requiredSlots.length) continue;
        const familyId = `${row.kind}.${templateIndex + 1}`;
        const seed = Array.from({ length: 600 }, (_, index) => `slot:${index}`)
          .find((candidate) => warCoalitionReceipt(row.kind, candidate, INTERP)?.familyId === familyId);
        expect(seed, `${familyId}: complete evidence reaches family`).toBeTruthy();
        const partial = { ...INTERP };
        for (const slot of requiredSlots) delete partial[slot];
        const fallback = warCoalitionReceipt(row.kind, seed, partial);
        expect(fallback).toBeTruthy();
        expect(fallback.familyId).not.toBe(familyId);
        expect(fallback.line).not.toMatch(/\bundefined\b|\bNaN\b/);
      }
    },
  );

  test('unknown kinds stay closed and every coalition row is public', () => {
    expect(warCoalitionReceipt('coalition_unknown', 'seed', INTERP)).toBeNull();
    expect(new Set(WAR_COALITION_KIND_REGISTRY.map((row) => row.audience)))
      .toEqual(new Set(['public']));
  });
});
