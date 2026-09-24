/**
 * IN-3 phrased-kind walker: `false_accusation` (the witch-hunt's receipt) and `sweep_launched`
 * (the sweep hum), the counter-game's two public beats, in their OWN walker file (L6: kinds get
 * their own walker, never rows in a foreign one). It certifies the FIVE JOINS (the annex-verbatim
 * pool, the registry row with requiredSlots and a slotless fallback, WHAT_PHRASES, the routing
 * row, the address chain through the real producer) plus the frequency-scaled floor. It is
 * presentation evidence only, never behavioral soak evidence.
 *
 * ⚠ THE ANNEX HANDLE IS NOT THE KIND FOR ONE OF THE TWO, AND THAT IS MEASURED, NOT PREFERRED.
 * The annex authors the witch-hunt's pool under `### sweep_witch_hunt` (the ending that mints the
 * receipt); the volume names the KIND `false_accusation`. The walker reads the block by its annex
 * handle and asserts the registry row by the kind, and each slice anchor occurs exactly once.
 *
 * ONE literal `describe`, literal straight-line `test` calls, nothing table-driven.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import { anchoredOnce, receiptAnnexPool, INFORMATION_ANNEX_URL } from '../helpers/receiptAnnex.js';
import { FREQUENCY_FLOORS, registrationReasons } from '../helpers/kindPoolWalker.js';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { EXACT_SECTION, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import { INFORMATION_KIND_REGISTRY, informationReceipt } from '../../src/domain/worldPulse/informationNews.js';
import { resolveSweep } from '../../src/domain/worldPulse/counterIntelSweep.js';

const ANNEX_SOURCE = readFileSync(INFORMATION_ANNEX_URL, 'utf8');
const HUNT_OPEN = '### sweep_witch_hunt (IN-3';
const HUNT_CLOSE = '### source_vetted_clean (IN-3,';
const HUM_OPEN = '### sweep_launched (IN-3)';
const HUM_CLOSE = '### sweep_catch (IN-3';
const HUNT_FULL = Object.freeze({ settlement: 'Harrowmere', npc: 'Ilse' });
const HUM_FULL = Object.freeze({ settlement: 'Harrowmere', faction: 'the Council', reason: 'a scandal at the gate' });
const rowOf = (kind) => INFORMATION_KIND_REGISTRY.find((row) => row.kind === kind);
const render = (row, interp) => row.pool.map((variant) => (typeof variant === 'function' ? String(variant(interp)) : String(variant)));
const huntAnnex = (interp) => receiptAnnexPool('sweep_witch_hunt', { source: ANNEX_SOURCE, section: HUNT_OPEN, until: HUNT_CLOSE, interp, annex: 'information' });
const humAnnex = (interp) => receiptAnnexPool('sweep_launched', { source: ANNEX_SOURCE, section: HUM_OPEN, until: HUM_CLOSE, interp, annex: 'information' });

/** @param {string} kind @param {Record<string, string>} interp */
function reachable(kind, interp) {
  const seen = new Set();
  for (let draw = 0; draw < 400; draw += 1) {
    const receipt = informationReceipt(kind, `in-3:${draw}`, interp);
    if (receipt) seen.add(receipt.templateIndex);
  }
  return [...seen].sort((a, b) => a - b);
}

/** A lit world where the home holds a scandal and a held scar, with one nameable resident. */
function sweptWorld(scarred) {
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: { infoMode: 'full', counterIntelEnabled: true },
    spatialLedgers: {},
    relationshipStates: scarred ? { 'e-h-v': { resentment: 0.7, recentIncidents: [{ tick: 3, type: 'spy_exposed' }] } } : {},
  };
  const home = { id: 'h', name: 'Harrowmere', npcs: [{ id: 'ilse', name: 'Ilse', role: 'Mayor', importance: 'key' }], ...(scarred ? { activeConditions: [{ archetype: 'corruption_exposed' }] } : {}) };
  const settlements = [{ id: 'h', settlement: home }, { id: 'v', settlement: { id: 'v', name: 'Velden', npcs: [] } }];
  return { worldState, snapshot: { settlements, byId: new Map(settlements.map((s) => [s.id, s])), regionalGraph: { edges: [{ id: 'e-h-v', from: 'h', to: 'v' }] } } };
}

describe('SP-6 phrased-kind registry — IN-3 the counter-game\'s two public beats', () => {
  test('the registry rows and the five typed joins are exact', () => {
    const hunt = rowOf('false_accusation');
    const hum = rowOf('sweep_launched');
    expect(hunt).toMatchObject({ kind: 'false_accusation', significance: 'notable', audience: 'public', section: 'war' });
    expect(hum).toMatchObject({ kind: 'sweep_launched', significance: 'routine', audience: 'public', section: 'war' });
    for (const row of [hunt, hum]) {
      expect(Object.isFrozen(row)).toBe(true);
      expect(row.requiredSlots).toHaveLength(row.pool.length);
      expect(row.pool.length).toBeGreaterThanOrEqual(FREQUENCY_FLOORS[row.significance]);
      expect(row.requiredSlots.filter((slots) => slots.length === 0).length).toBeGreaterThan(0);
      expect(registrationReasons(row, { phrases: WHAT_PHRASES, sectionOf: SECTION_OF })).toEqual([]);
      expect(EXACT_SECTION[row.kind]).toBe('war');
      expect(SECTION_OF(row.kind)).toBe(SECTION_OF('infowar_spy_exposed'));
      expect(typeof WHAT_PHRASES[row.kind]).toBe('string');
    }
  });

  test('the pools are the annex blocks, verbatim and in order, and the annex decides the arity', () => {
    expect(render(rowOf('false_accusation'), HUNT_FULL)).toEqual(huntAnnex(HUNT_FULL).lines);
    expect(render(rowOf('sweep_launched'), HUM_FULL)).toEqual(humAnnex(HUM_FULL).lines);
    const slotsOf = (annex, row, all) => {
      const sentinel = Object.fromEntries(all.map((slot) => [slot, `<<${slot}>>`]));
      const fromAnnex = annex(sentinel).lines.map((line) => all.filter((slot) => line.includes(sentinel[slot])).sort());
      expect(fromAnnex).toEqual(row.requiredSlots.map((slots) => [...slots].sort()));
    };
    slotsOf(huntAnnex, rowOf('false_accusation'), ['settlement', 'npc']);
    slotsOf(humAnnex, rowOf('sweep_launched'), ['settlement', 'faction', 'reason']);
    for (const line of [...render(rowOf('false_accusation'), HUNT_FULL), ...render(rowOf('sweep_launched'), HUM_FULL)]) {
      expect(line.length).toBeGreaterThan(0);
      // anchored: each rendered line is pinned equal to its annex block above and is non-empty.
      expect(line).not.toMatch(/\d|%|×|_|\$\{|\bundefined\b|\bNaN\b|!|—/);
      // anchored: the same lines. NO-FATES: the accused is named, never removed.
      expect(line).not.toMatch(/\b(?:hanged|killed|executed|exiled|shuttered|murdered|slain)\b/i);
    }
  });

  test('THE FIRST-MATCH LAW: every slice anchor occurs exactly once in the volume', () => {
    expect(() => anchoredOnce(ANNEX_SOURCE, /^### sweep_witch_hunt \(IN-3(?=[ \n])/gm, 'hunt open')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^### source_vetted_clean \(IN-3,(?=[ \n])/gm, 'hunt close')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^### sweep_launched \(IN-3\)(?=[ \n])/gm, 'hum open')).not.toThrow();
    expect(() => anchoredOnce(ANNEX_SOURCE, /^### sweep_catch \(IN-3(?=[ \n])/gm, 'hum close')).not.toThrow();
  });

  test('the eligible sets: what the producer supplies reaches every variant it can honestly fill', () => {
    expect(reachable('false_accusation', HUNT_FULL)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(reachable('false_accusation', { settlement: 'Harrowmere' })).toEqual([0, 4, 5]);
    // The producer supplies no faction and no reason at this base: variants 2 and 3 declared unreachable.
    expect(reachable('sweep_launched', { settlement: 'Harrowmere' })).toEqual([0, 3, 4, 5, 6, 7, 8]);
    expect(reachable('sweep_launched', HUM_FULL)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('the address chain: the one producer addresses the home court, in the registered voices', () => {
    const rng = { fork: () => ({ random: () => 0 }) };
    const hunt = resolveSweep({ ...sweptWorld(true), settlementId: 'h', tick: 5, rng, posture: 'paranoid', nameFor: (id) => `${id}-town` });
    const [beat, ...rest] = hunt.newsEntries;
    expect(rest).toEqual([]);
    expect(beat).toMatchObject({
      id: 'wizard_news.5.false_accusation.h', kind: 'false_accusation', impactKind: 'false_accusation', settlementIds: ['h'],
      npcIds: ['h:ilse'], audience: 'public', section: 'war', significance: 'notable', tick: 5,
    });
    const voiced = informationReceipt('false_accusation', 'sweep:h:5', { settlement: 'h-town', npc: 'Ilse' });
    expect(beat.summary).toBe(voiced.line);
    expect(beat.familyId).toBe(voiced.familyId);
    expect(beat.reasons).toHaveLength(2);
    const quiet = resolveSweep({ ...sweptWorld(false), settlementId: 'h', tick: 5, rng, nameFor: (id) => `${id}-town` });
    const [hum] = quiet.newsEntries;
    expect(hum).toMatchObject({ id: 'wizard_news.5.sweep_launched.h', kind: 'sweep_launched', impactKind: 'sweep_launched', audience: 'public', section: 'war', significance: 'routine' });
    expect(hum.summary).toBe(informationReceipt('sweep_launched', 'sweep:h:5', { settlement: 'h-town', npc: '' }).line);
    // anchored: the accusation beat above carries its npcIds; a quiet sweep names nobody.
    expect(hum).not.toHaveProperty('npcIds');
  });
});
