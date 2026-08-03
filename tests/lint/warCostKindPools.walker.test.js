/**
 * SP-6 narration-kit walker — WR-4 comparative costs and the home front.
 *
 * This proves the nine annex kinds have exact authored families, stable
 * identity, closed metadata, honest slot resolution, and complete reader joins
 * independently of the evaluator's behavioral reachability tests.
 */
import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { HERALD_SECTIONS, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import { ensureWizardNewsFeed } from '../../src/domain/region/wizardNews.js';
import {
  warCostReceipt,
  WAR_COST_KIND_REGISTRY,
  WAR_COST_KINDS,
} from '../../src/domain/worldPulse/eventProse.js';

const EXPECTED = Object.freeze([
  Object.freeze({ kind: 'war_trajectory_winning', significance: 'notable', audience: 'public', section: 'war' }),
  Object.freeze({ kind: 'war_trajectory_losing', significance: 'notable', audience: 'public', section: 'war' }),
  Object.freeze({ kind: 'home_front_roads', significance: 'notable', audience: 'public', section: 'trade' }),
  Object.freeze({ kind: 'home_front_stores', significance: 'notable', audience: 'public', section: 'events' }),
  Object.freeze({ kind: 'home_front_hands', significance: 'notable', audience: 'public', section: 'events' }),
  // Corrected before build: an impaired institution is structural events news,
  // not an adjudication.
  Object.freeze({ kind: 'home_front_institutions', significance: 'notable', audience: 'public', section: 'events' }),
  Object.freeze({ kind: 'home_front_markets', significance: 'notable', audience: 'public', section: 'trade' }),
  Object.freeze({ kind: 'winning_abroad_losing_at_home', significance: 'major', audience: 'public', section: 'war' }),
  Object.freeze({ kind: 'trajectory_misread', significance: 'routine', audience: 'dm-only', section: 'war' }),
]);

const EXPECTED_SLOTS = Object.freeze({
  war_trajectory_winning: [['settlement'], ['fieldReport'], ['offerHistory'], [], ['fieldReport', 'band', 'courierDelay']],
  war_trajectory_losing: [['settlement', 'newsLag'], [], ['fieldReport'], ['term'], []],
  home_front_roads: [['route', 'tollLoss'], ['causewayNeglect'], [], ['bridgeDamage'], ['settlement', 'band']],
  home_front_stores: [['settlement', 'band', 'granary'], ['seedGood'], [], [], ['breadSupply']],
  home_front_hands: [['settlement', 'band'], ['harvestLabor'], ['smithMuster'], ['npc'], []],
  home_front_institutions: [['settlement', 'courtOffice'], ['temple', 'school'], [], ['courtOffice'], []],
  home_front_markets: [['house', 'settlement'], ['wharfLabor'], ['good'], [], ['tollLoss']],
  winning_abroad_losing_at_home: [['settlement', 'counterpart', 'band', 'storesEvidence', 'occupation'], ['marketAccount'], ['breadPrice'], ['compoundLoss'], []],
  trajectory_misread: [['fieldReport'], ['settlement'], [], ['draftedTerms'], ['intentEvidence']],
});

const INTERP = Object.freeze({
  settlement: 'Ashford',
  counterpart: 'Eastvale',
  band: 'noticeably',
  term: 'concession',
  route: 'The Eastvale road',
  good: 'grain',
  npc: 'Aldric Venn',
  temple: 'Harvest Chapter',
  house: 'House Rowan',
  fieldReport: 'a corroborated field report',
  offerHistory: 'the earlier offer book',
  courierDelay: 'a dated courier record',
  newsLag: 'a dated news comparison',
  tollLoss: 'the route toll ledger',
  causewayNeglect: 'the causeway maintenance roll',
  bridgeDamage: 'the bridge inspection',
  seedGood: 'seed grain',
  breadSupply: 'the bread ledger',
  granary: 'the granary inventory',
  harvestLabor: 'the harvest labour roll',
  smithMuster: 'the smiths muster roll',
  courtOffice: 'the court office roll',
  school: 'the school roll',
  wharfLabor: 'the wharf labour roll',
  storesEvidence: 'the wartime stores ledger',
  occupation: 'the occupation record',
  marketAccount: 'the market account',
  breadPrice: 'the bread-price ledger',
  compoundLoss: 'the three-source loss receipt',
  draftedTerms: 'the current draft terms',
  intentEvidence: 'the court testimony',
});

const NOW = '2026-01-01T00:00:00.000Z';

function normalized(extra) {
  return ensureWizardNewsFeed({
    entries: [{
      id: 'wr4:test',
      tick: 4,
      headline: 'A governed war-cost receipt',
      ...extra,
    }],
  }, { now: NOW }).entries[0];
}

function renderedPool(row, interp = INTERP) {
  return row.pool.map((variant) => (
    typeof variant === 'function' ? String(variant(interp)) : String(variant)
  ));
}

function annexLines(kind) {
  const source = readFileSync(new URL('../../docs/content/RECEIPT_POOLS_WAR.md', import.meta.url), 'utf8');
  const wr4 = source.slice(source.indexOf('# WR-4'), source.indexOf('# WR-5'));
  const heading = `### ${kind} `;
  const start = wr4.indexOf(heading);
  expect(start, `${kind}: missing WR-4 annex heading`).toBeGreaterThanOrEqual(0);
  const rest = wr4.slice(start + heading.length);
  const next = rest.indexOf('\n### ');
  const block = next >= 0 ? rest.slice(0, next) : rest;
  return [...block.matchAll(/^\d+\. (.+)$/gm)].map((match) => (
    match[1].replace(/\{(\w+)\}/g, (_, slot) => String(INTERP[slot]))
  ));
}

describe('SP-6 phrased-kind registry — WR-4 war costs', () => {
  test('the nine-kind census, metadata, truth slots, and reader joins are exact', () => {
    expect(WAR_COST_KINDS).toEqual(EXPECTED.map((row) => row.kind));
    expect(WAR_COST_KIND_REGISTRY).toHaveLength(9);

    for (const expected of EXPECTED) {
      const row = WAR_COST_KIND_REGISTRY.find((candidate) => candidate.kind === expected.kind);
      expect(row).toMatchObject(expected);
      expect(row.pool).toHaveLength(5);
      expect(row.requiredSlots).toEqual(EXPECTED_SLOTS[row.kind]);
      expect(Object.isFrozen(row)).toBe(true);
      expect(Object.isFrozen(row.requiredSlots)).toBe(true);
      expect(WHAT_PHRASES[row.kind], `${row.kind}: missing WHAT_PHRASES`).toBeTruthy();
      expect(WHAT_PHRASES[row.kind]).not.toMatch(/_/);
      expect(SECTION_OF(row.kind), `${row.kind}: wrong Herald desk`).toBe(row.section);
    }
  });

  test('Wizard News preserves every valid supplied desk and rejects unknown values', () => {
    for (const section of HERALD_SECTIONS) {
      expect(normalized({ section }).section, `${section}: lost in normalization`).toBe(section);
    }
    expect('section' in normalized({ section: 'not-a-desk' })).toBe(false);
    expect('section' in normalized({})).toBe(false);
  });

  test('the corrected institution desk and private misread metadata survive together', () => {
    const institution = normalized({
      kind: 'home_front_institutions',
      impactKind: 'home_front_institutions',
      familyId: 'home_front_institutions.1',
      audience: 'public',
      section: 'events',
    });
    expect(institution).toMatchObject({
      impactKind: 'home_front_institutions',
      audience: 'public',
      section: 'events',
    });

    const misread = normalized({
      kind: 'trajectory_misread',
      impactKind: 'trajectory_misread',
      familyId: 'trajectory_misread.1',
      significance: 'routine',
      audience: 'dm-only',
      section: 'war',
      covert: true,
    });
    expect(misread).toMatchObject({
      significance: 'routine',
      audience: 'dm-only',
      section: 'war',
      covert: true,
    });
  });

  test.each(WAR_COST_KIND_REGISTRY)(
    '$kind retains the five receipt-annex families verbatim',
    (row) => {
      const rendered = renderedPool(row);
      expect(rendered).toEqual(annexLines(row.kind));
      expect(new Set(rendered).size).toBe(5);
      for (const line of rendered) {
        expect(line).toBe(line.trim());
        expect(line).not.toMatch(/\$\{|\bundefined\b|\bNaN\b/);
        expect(line).not.toMatch(/\d|%|×/);
        expect(line).not.toContain(row.kind);
      }
    },
  );

  test.each(WAR_COST_KIND_REGISTRY)(
    '$kind selects deterministically and reaches every family',
    (row) => {
      const receipts = Array.from({ length: 300 }, (_, index) => (
        warCostReceipt(row.kind, `war-cost:${index}`, INTERP)
      ));
      expect(receipts.every(Boolean)).toBe(true);
      expect(new Set(receipts.map((receipt) => receipt.familyId)).size).toBe(5);
      expect(warCostReceipt(row.kind, 'fixed-seed', INTERP))
        .toEqual(warCostReceipt(row.kind, 'fixed-seed', INTERP));
    },
  );

  test.each(WAR_COST_KIND_REGISTRY)(
    '$kind skips every family whose named truth is unavailable',
    (row) => {
      for (const [templateIndex, requiredSlots] of row.requiredSlots.entries()) {
        if (requiredSlots.length === 0) continue;
        const familyId = `${row.kind}.${templateIndex + 1}`;
        const seed = Array.from({ length: 500 }, (_, index) => `truth:${index}`)
          .find((candidate) => warCostReceipt(row.kind, candidate, INTERP)?.familyId === familyId);
        expect(seed, `${familyId}: reachable with complete truth`).toBeTruthy();

        const partial = { ...INTERP };
        for (const slot of requiredSlots) delete partial[slot];
        const receipt = warCostReceipt(row.kind, seed, partial);
        expect(receipt, `${familyId}: an authored fallback remains`).toBeTruthy();
        expect(receipt.familyId).not.toBe(familyId);
        expect(receipt.line).not.toMatch(/\bundefined\b|\bNaN\b/);
      }
    },
  );

  test('slotless families remain honest fallbacks and unknown kinds stay closed', () => {
    for (const row of WAR_COST_KIND_REGISTRY) {
      const receipt = warCostReceipt(row.kind, null, {});
      expect(receipt, `${row.kind}: no-truth fallback`).toBeTruthy();
      expect(row.requiredSlots[receipt.templateIndex]).toEqual([]);
    }
    expect(warCostReceipt('war_trajectory_even', 'seed', INTERP)).toBeNull();
    expect(warCostReceipt('not_a_war_cost_kind', 'seed', INTERP)).toBeNull();
  });

  test('the producer-sized truth set cannot reach source details the receipt did not prove', () => {
    const productionTruth = {
      war_trajectory_winning: { settlement: 'Ashford', counterpart: 'Eastvale', band: 'noticeably' },
      war_trajectory_losing: { settlement: 'Ashford', counterpart: 'Eastvale' },
      home_front_roads: { settlement: 'Ashford', route: 'the Eastvale road', band: 'noticeably' },
      home_front_stores: { settlement: 'Ashford', band: 'little' },
      home_front_hands: { settlement: 'Ashford', band: 'many' },
      home_front_institutions: { settlement: 'Ashford', temple: 'Harvest Chapter' },
      home_front_markets: { settlement: 'Ashford', counterpart: 'Eastvale', good: 'grain' },
      winning_abroad_losing_at_home: { settlement: 'Ashford', counterpart: 'Eastvale', band: 'little' },
      trajectory_misread: { settlement: 'Ashford', counterpart: 'Eastvale' },
    };
    const unsupported = {
      war_trajectory_winning: /word from the field|spring|harvest|courier|fortnight|enemy is spent/i,
      war_trajectory_losing: /report|faster than the news|term they draft/i,
      home_front_roads: /toll|causeway|drover|bridge|\bford\b|brush|mud|poorer/i,
      home_front_stores: /seed|bread|carried the winter|drawn down|drawing down/i,
      home_front_hands: /harvest|smith|craftsmen|names that ran the market/i,
      home_front_institutions: /assize|clerk|justice|working court/i,
      home_front_markets: /factor|wharf|toll|house|generation to open/i,
      winning_abroad_losing_at_home: /banner|wall|courier|reeve|market square|bread|craftsman|hunger|victory/i,
      trajectory_misread: /field says|terms about to be drafted|wrong on purpose/i,
    };

    for (const kind of WAR_COST_KINDS) {
      const lines = Array.from({ length: 500 }, (_, index) => (
        warCostReceipt(kind, `production:${index}`, productionTruth[kind])?.line || ''
      ));
      expect(lines.every(Boolean), `${kind}: production truth lost every fallback`).toBe(true);
      expect(lines.join('\n'), `${kind}: unsupported source detail became reachable`)
        .not.toMatch(unsupported[kind]);
    }
  });

  test('only the combined story is major and only a trajectory misread is private', () => {
    expect(WAR_COST_KIND_REGISTRY.filter((row) => row.significance === 'major'))
      .toEqual([expect.objectContaining({ kind: 'winning_abroad_losing_at_home' })]);
    expect(WAR_COST_KIND_REGISTRY.filter((row) => row.audience === 'dm-only'))
      .toEqual([expect.objectContaining({ kind: 'trajectory_misread', significance: 'routine' })]);
    expect(WAR_COST_KIND_REGISTRY.find((row) => row.kind === 'home_front_institutions'))
      .toMatchObject({ section: 'events' });
  });
});
