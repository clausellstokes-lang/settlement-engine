/**
 * tests/generators/crossSettlementConflicts.test.js
 *
 * F10 regression pins. crossSettlementConflicts previously drew from the
 * ambient rngContext, but ALL its callers (RelationshipsTab render, the
 * SettlementsPanel link UI, neighbourBackLink save flow) run OUTSIDE any
 * setActiveRng scope — so every draw fell back to Math.random() and the same
 * settlement pair produced DIFFERENT conflicts on every mount/save/export.
 * The module now takes an explicit rng, and the deterministic wrapper seeds
 * that rng off the pair's STABLE IDENTITY, so a given (A, B, relType) yields
 * the same conflicts forever. These tests lock that in.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, test, expect } from 'vitest';
import { createPRNG } from '../../src/generators/prng.js';
import {
  generateCrossSettlementConflicts,
  generateCrossSettlementConflictsDeterministic,
  stableIdOf,
} from '../../src/generators/crossSettlementConflicts.js';

// Two settlements with matching-category NPCs and factions so the generator
// has real material to draw from (a conflict + a faction engagement).
function makeSettlement(idPart, seed) {
  return {
    _seed: seed,
    id: `id_${idPart}`,
    name: `Settlement ${idPart}`,
    npcs: [
      { id: `${idPart}_e1`, name: `${idPart} Merchant`, role: 'Trader', category: 'economy' },
      { id: `${idPart}_m1`, name: `${idPart} Captain`, role: 'Officer', category: 'military' },
      { id: `${idPart}_c1`, name: `${idPart} Fixer`, role: 'Broker', category: 'criminal' },
    ],
    factions: [
      { name: `${idPart} Guild`, dominantCategory: 'economy' },
      { name: `${idPart} Watch`, dominantCategory: 'military' },
    ],
  };
}

describe('crossSettlementConflicts — determinism (F10)', () => {
  test('deterministic wrapper: same (A, B, relType) ⇒ deep-equal conflicts', () => {
    const a = makeSettlement('A', 'seed-a');
    const b = makeSettlement('B', 'seed-b');
    const first = generateCrossSettlementConflictsDeterministic(a, b, 'rival', 'link_1');
    const second = generateCrossSettlementConflictsDeterministic(a, b, 'rival', 'link_1');
    expect(second).toEqual(first);
    // And produced real content, so the equality is not the trivial empty case.
    expect(first.forA.length).toBeGreaterThan(0);
    expect(first.forB.length).toBe(first.forA.length);
  });

  test('deterministic wrapper is stable across structurally-equal (fresh) objects', () => {
    // Re-allocate identical settlements — the React memo / save flow re-creates
    // these objects constantly. Identity-seeded rng must ignore object identity.
    const first = generateCrossSettlementConflictsDeterministic(
      makeSettlement('A', 'seed-a'), makeSettlement('B', 'seed-b'), 'hostile', 'link_x');
    const second = generateCrossSettlementConflictsDeterministic(
      makeSettlement('A', 'seed-a'), makeSettlement('B', 'seed-b'), 'hostile', 'link_x');
    expect(second).toEqual(first);
  });

  test('different relType usually yields different conflicts', () => {
    const a = makeSettlement('A', 'seed-a');
    const b = makeSettlement('B', 'seed-b');
    const rival = generateCrossSettlementConflictsDeterministic(a, b, 'rival', 'l');
    const cold = generateCrossSettlementConflictsDeterministic(a, b, 'cold_war', 'l');
    expect(cold).not.toEqual(rival);
  });

  test('different pair usually yields different conflicts', () => {
    const a = makeSettlement('A', 'seed-a');
    const b = makeSettlement('B', 'seed-b');
    const c = makeSettlement('C', 'seed-c');
    const ab = generateCrossSettlementConflictsDeterministic(a, b, 'rival', 'l');
    const ac = generateCrossSettlementConflictsDeterministic(a, c, 'rival', 'l');
    expect(ac).not.toEqual(ab);
  });

  test('linkId is stamped onto every emitted entry', () => {
    const { forA, forB } = generateCrossSettlementConflictsDeterministic(
      makeSettlement('A', 'seed-a'), makeSettlement('B', 'seed-b'), 'rival', 'link_42');
    [...forA, ...forB].forEach(e => expect(e.linkId).toBe('link_42'));
  });
});

describe('crossSettlementConflicts — explicit rng contract', () => {
  test('core requires an rng and throws a helpful error without one', () => {
    const a = makeSettlement('A', 'seed-a');
    const b = makeSettlement('B', 'seed-b');
    expect(() => generateCrossSettlementConflicts(a, b, 'rival', 'l')).toThrow(/rng/i);
  });

  test('same seeded rng reproduces the wrapper output exactly', () => {
    const a = makeSettlement('A', 'seed-a');
    const b = makeSettlement('B', 'seed-b');
    const viaCore = generateCrossSettlementConflicts(a, b, 'rival', 'l',
      createPRNG(`xconflict:${stableIdOf(a)}:${stableIdOf(b)}:rival`));
    const viaWrapper = generateCrossSettlementConflictsDeterministic(a, b, 'rival', 'l');
    expect(viaCore).toEqual(viaWrapper);
  });
});

describe('stableIdOf identity precedence', () => {
  test('prefers _seed, then id, then name', () => {
    expect(stableIdOf({ _seed: 's', id: 'i', name: 'n' })).toBe('s');
    expect(stableIdOf({ id: 'i', name: 'n' })).toBe('i');
    expect(stableIdOf({ name: 'n' })).toBe('n');
    expect(stableIdOf({})).toBe('');
    expect(stableIdOf(null)).toBe('');
  });
});

describe('crossSettlementConflicts — no ambient RNG (source pin)', () => {
  test('the module never imports rngContext nor draws Math.random (code, not comments)', () => {
    const raw = readFileSync(
      fileURLToPath(new URL('../../src/generators/crossSettlementConflicts.js', import.meta.url)),
      'utf8',
    );
    // Strip block + line comments so the docstring (which names both, on purpose)
    // does not trip the scan — we assert on executable code only.
    const code = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(code).not.toMatch(/rngContext/);
    expect(code).not.toMatch(/Math\.random/);
    expect(code).not.toMatch(/from\s+['"][^'"]*rngContext/);
  });
});
