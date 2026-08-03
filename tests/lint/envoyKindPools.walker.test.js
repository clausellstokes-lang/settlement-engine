/**
 * WR-7a phrased-kind walker: exact seven-kind census, frequency-scaled
 * annex-authored families, governed metadata/desks, and no-fabrication
 * truth-slot selection.
 * This certifies presentation width only; it is not behavioral soak evidence.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { heraldSectionOfRecord, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import {
  ENVOY_KIND_REGISTRY,
  ENVOY_KINDS,
  envoyReceipt,
} from '../../src/domain/worldPulse/eventProse.js';

const EXPECTED = Object.freeze([
  ['envoy_departed', 'notable', 'public', 'adjudication', 6],
  ['envoy_on_the_road', 'routine', 'public', 'events', 12],
  ['envoy_returning', 'notable', 'public', 'adjudication', 6],
  ['envoy_home', 'major', 'public', 'adjudication', 5],
  ['envoy_lost', 'major', 'dm-only', 'adjudication', 5],
  ['envoy_silence_inference', 'major', 'public', 'divination', 5],
  ['terms_never_reached', 'major', 'dm-only', 'adjudication', 5],
]);

const FLOOR_BY_SIGNIFICANCE = Object.freeze({ routine: 8, notable: 6, major: 4 });

const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Irontown',
  npc: 'Reeve Mara',
  route: 'North Road',
});

function annexLines(kind) {
  const source = readFileSync(new URL('../../docs/content/RECEIPT_POOLS_WAR.md', import.meta.url), 'utf8');
  const wr7a = source.slice(source.indexOf('## WR-7a'), source.indexOf('## WR-7b'));
  const heading = `### ${kind} `;
  const start = wr7a.indexOf(heading);
  expect(start, `${kind}: missing WR-7a annex heading`).toBeGreaterThanOrEqual(0);
  const rest = wr7a.slice(start + heading.length);
  const next = rest.indexOf('\n### ');
  const block = next >= 0 ? rest.slice(0, next) : rest;
  return [...block.matchAll(/^\d+\. (.+)$/gm)].map((match) => (
    match[1]
      .replace(/\s+\*\(\u00a78\)\*$/, '')
      .replace(/\{(\w+)\}/g, (_, slot) => String(INTERP[slot]))
  ));
}

describe('SP-6 phrased-kind registry — WR-7a envoy errands', () => {
  test('the seven-kind census and every reader join are exact', () => {
    expect(ENVOY_KINDS).toEqual(EXPECTED.map(([kind]) => kind));
    expect(ENVOY_KIND_REGISTRY).toHaveLength(7);
    for (const [kind, significance, audience, section, depth] of EXPECTED) {
      const row = ENVOY_KIND_REGISTRY.find((candidate) => candidate.kind === kind);
      expect(row).toMatchObject({ kind, significance, audience, section });
      expect(row.pool).toHaveLength(depth);
      expect(row.pool.length).toBeGreaterThanOrEqual(FLOOR_BY_SIGNIFICANCE[significance]);
      expect(row.requiredSlots).toHaveLength(depth);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      expect(WHAT_PHRASES[kind], `${kind}: missing WHAT_PHRASES`).toBeTruthy();
      expect(WHAT_PHRASES[kind]).not.toMatch(/_/);
      expect(SECTION_OF(kind)).toBe(section === 'adjudication' ? 'events' : section);
      expect(heraldSectionOfRecord({
        kind,
        section,
        sectionAuthority: 'envoy_registry',
      })).toBe(section);
    }
  });

  test.each(ENVOY_KIND_REGISTRY)(
    '$kind retains its exact frequency-scaled receipt-annex families',
    (row) => {
      const rendered = row.pool.map((variant) => (
        typeof variant === 'function' ? String(variant(INTERP)) : String(variant)
      ));
      expect(rendered).toEqual(annexLines(row.kind));
      expect(new Set(rendered).size).toBe(row.pool.length);
      for (const line of rendered) {
        expect(line).toBe(line.trim());
        expect(line).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b/);
        expect(line).not.toMatch(/\b(?:rng|roll|score|ratio|tick|chance|probability|threshold|multiplier)\b/i);
      }
    },
  );

  test.each(ENVOY_KIND_REGISTRY)(
    '$kind is deterministic and every structural family is reachable',
    (row) => {
      const receipts = Array.from({ length: 1200 }, (_, index) => (
        envoyReceipt(row.kind, `wr-seven-a:${index}`, INTERP)
      ));
      expect(receipts.every(Boolean)).toBe(true);
      expect(new Set(receipts.map((receipt) => receipt.familyId)).size).toBe(row.pool.length);
      expect(envoyReceipt(row.kind, 'same', INTERP))
        .toEqual(envoyReceipt(row.kind, 'same', INTERP));
    },
  );

  test.each(ENVOY_KIND_REGISTRY)(
    '$kind skips a named family when its typed evidence is absent',
    (row) => {
      for (const [templateIndex, requiredSlots] of row.requiredSlots.entries()) {
        if (!requiredSlots.length) continue;
        const familyId = `${row.kind}.${templateIndex + 1}`;
        const seed = Array.from({ length: 600 }, (_, index) => `slot:${index}`)
          .find((candidate) => envoyReceipt(row.kind, candidate, INTERP)?.familyId === familyId);
        expect(seed, `${familyId}: complete evidence reaches family`).toBeTruthy();
        const partial = { ...INTERP };
        for (const slot of requiredSlots) delete partial[slot];
        const fallback = envoyReceipt(row.kind, seed, partial);
        expect(fallback).toBeTruthy();
        expect(fallback.familyId).not.toBe(familyId);
        expect(fallback.line).not.toMatch(/\bundefined\b|\bNaN\b/);
      }
    },
  );

  test('unknown kinds stay closed and remote loss truth remains DM-only', () => {
    expect(envoyReceipt('envoy_unknown', 'seed', INTERP)).toBeNull();
    expect(Object.fromEntries(ENVOY_KIND_REGISTRY.map((row) => [row.kind, row.audience])))
      .toMatchObject({
        envoy_departed: 'public',
        envoy_silence_inference: 'public',
        envoy_lost: 'dm-only',
        terms_never_reached: 'dm-only',
      });
  });
});
