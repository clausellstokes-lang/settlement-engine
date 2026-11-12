/**
 * missingLeaves.test.js — the leaves the class table named and the source lacked (W2-A-LEAVES, 2026-11-12):
 * presence on a card, the chain's carrier, beasts readiness against threat, the leader's lead, the founder and
 * the imports as printed. Each is held to the fault it exists to end, with a control.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FOUNDER_KIND, FOUNDER_KINDS, founderOf } from '../../../src/domain/facts/founder.js';
import { leaderLeadOf, leaderLeadOfRecord } from '../../../src/domain/facts/leaderLead.js';
import { foldHouseName, houseHere } from '../../../src/domain/facts/presence.js';
import { beastsReadinessOf } from '../../../src/domain/facts/beastsReadiness.js';
import { chainCarrierOf } from '../../../src/domain/facts/chainCarrier.js';
import { importsAsPrinted } from '../../../src/domain/display/tradeListDisplay.js';

describe('the founder (pattern 7a: one founder, the "Founded by" row is its home)', () => {
  test('the kind table classes EVERY line of the founder tables, and nothing else', () => {
    const src = readFileSync(join(process.cwd(), 'src/generators/narrativeGenerator.js'), 'utf8');
    const block = src.slice(src.indexOf('const FOUNDERS_BY_TIER = {'), src.indexOf('};', src.indexOf('const FOUNDERS_BY_TIER = {')));
    const lines = [...block.matchAll(/^\s+'([^']+)',$/gm)].map((m) => m[1]);
    expect(lines.length).toBeGreaterThan(20);
    expect(Object.keys(FOUNDER_KIND).sort()).toEqual([...new Set(lines)].sort());
    for (const kind of Object.values(FOUNDER_KIND)) expect(FOUNDER_KINDS).toContain(kind);
  });
  test('the record\'s founder and its kind; an unknown line reads as other; no founder is null', () => {
    expect(founderOf({ history: { founding: { foundedBy: 'military veterans given land grants who brought their skills with them' } } }))
      .toEqual({ text: 'military veterans given land grants who brought their skills with them', kind: 'military' });
    expect(founderOf({ history: { founding: { foundedBy: 'a wandering bard' } } })).toEqual({ text: 'a wandering bard', kind: 'other' });
    expect(founderOf({ history: {} })).toBeNull();
    expect(founderOf(null)).toBeNull();
  });
});

describe('the leader\'s lead (pattern 4: "three powers stand almost level" beside a leader far ahead)', () => {
  test('the margins against the leader, strongest first; the neighbours\' gaps beside them', () => {
    expect(leaderLeadOf([{ faction: 'A', power: 80 }, { faction: 'B', power: 30 }, { faction: 'C', power: 27 }])).toEqual({ leader: 'A', powers: [80, 30, 27], leadOverSecond: 50, leadOverThird: 53, gaps: [50, 3] });
    expect(leaderLeadOf([{ faction: 'C', power: 35 }, { faction: 'A', power: 40 }, { faction: 'B', power: 37 }])).toMatchObject({ leader: 'A', powers: [40, 37, 35], leadOverThird: 5, gaps: [3, 2] });
    // the census's own case (pattern 4): neighbours close, the leader not — the leaf states it in the leader's margin
    expect(leaderLeadOf([{ power: 50 }, { power: 39 }, { power: 36 }])).toMatchObject({ leadOverThird: 14, gaps: [11, 3] });
    expect(leaderLeadOfRecord({})).toEqual({ leader: null, powers: [], leadOverSecond: null, leadOverThird: null, gaps: [] });
  });
});

describe('presence on a card (patterns 8 and 18: never by the first word)', () => {
  const record = { institutions: [{ name: 'Parish hall' }, { name: "Tanners' quarter" }, { name: 'Merchant guilds (15-40)' }, { name: 'Cathedral' }] };
  test('the first-word test\'s false positive is gone; the same house under a range or a longer name is here', () => {
    expect(houseHere(record, 'Parish church')).toBe(false);
    expect(houseHere(record, 'Tanners')).toBe(true);
    expect(houseHere({ institutions: [{ name: 'Tannery' }] }, 'Tanners')).toBe(false);
    expect(houseHere(record, 'Merchant guilds (15-40)')).toBe(true);
    expect(houseHere(record, 'Merchant guilds')).toBe(true);
    expect(houseHere(record, 'Cathedral')).toBe(true);
    expect(houseHere(record, '')).toBe(false);
    expect(foldHouseName('  Merchant  Guilds (15-40) ')).toBe('merchant guilds');
  });
});

describe('beasts readiness against threat (pattern 9)', () => {
  test('settled country graded weak is named; a frontier grade is read as it is', () => {
    expect(beastsReadinessOf({ config: { monsterThreat: 'heartland' }, defenseProfile: { scores: { monster: 5 } } })).toMatchObject({ family: 'settled', grade: 'CRITICAL', settledAndWeak: true });
    expect(beastsReadinessOf({ config: { monsterThreat: 'heartland' }, defenseProfile: { scores: { monster: 90 } } })).toMatchObject({ family: 'settled', grade: 'STRONG', settledAndWeak: false });
    expect(beastsReadinessOf({ config: { monsterThreat: 'frontier' }, defenseProfile: { scores: { monster: 5 } } })).toMatchObject({ family: 'frontier', settledAndWeak: false });
  });
});

describe('the chain\'s carrier (pattern 11: never the catalogue\'s resource where the town lacks it)', () => {
  const town = { config: { nearbyResources: ['iron_deposits'] } };
  test('own, substitute, transit, bought and none', () => {
    expect(chainCarrierOf({ resource: 'Iron deposits', resourceKey: 'iron_deposits', resourceActive: true }, town)).toEqual({ kind: 'own', resource: 'Iron deposits' });
    expect(chainCarrierOf({ resource: 'Grazing land', resourceKey: 'grazing_land', resourceActive: false, substituteActive: true }, town)).toEqual({ kind: 'substitute', resource: null });
    expect(chainCarrierOf({ resource: 'Grazing land', resourceKey: 'grazing_land', entrepot: true }, town)).toEqual({ kind: 'transit', resource: null });
    expect(chainCarrierOf({ resource: 'Grazing land', resourceKey: 'grazing_land' }, town)).toEqual({ kind: 'bought', resource: null });
    expect(chainCarrierOf({ resource: null, resourceKey: null }, town)).toEqual({ kind: 'none', resource: null });
    // a held resource that is not active does not carry the chain
    expect(chainCarrierOf({ resource: 'Iron deposits', resourceKey: 'iron_deposits', resourceActive: false }, town).kind).toBe('bought');
  });
});

describe('the imports as printed (pattern 6: one list, read by the pills and the gap reader)', () => {
  test('the record\'s imports, then each terrain-critical import none of them names; the export wins', () => {
    const s = { tier: 'town', economicState: { primaryImports: ['Iron', 'Salt'], primaryExports: ['Salt'] }, resourceAnalysis: { imports: { critical: ['iron', 'timber'] } } };
    expect(importsAsPrinted(s)).toEqual(['Iron', 'timber']);
    expect(importsAsPrinted({ economicState: { primaryImports: ['Grain'] }, resourceAnalysis: { imports: [] } })).toEqual(['Grain']);
    expect(importsAsPrinted(null)).toEqual([]);
  });
});
