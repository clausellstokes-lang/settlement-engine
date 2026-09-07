/**
 * determinismLeaks.test.js — A+ P0.5.
 *
 * The domain kernel must be pure + deterministic: no IO/flag reads, no Math.random
 * in functions that feed persisted state. Removes three confirmed leaks and pins
 * each so it cannot return (Phase-1 widens the determinism eslint guard over all of
 * src/domain; until then these source pins are the enforcement).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { buildEdit } from '../../src/domain/pendingEdits.js';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '../../src/domain');
const read = (rel) => readFileSync(join(SRC, rel), 'utf8');

describe('deriveSystemState is a pure function of its input (no flag leak)', () => {
  const fixture = {
    name: 'Ashford', tier: 'town', population: 1500,
    config: { tradeRouteAccess: 'road' },
    economicState: { primaryExports: ['Grain', 'Wool'], primaryImports: ['Iron'] },
    institutions: [], powerStructure: { factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };

  test('same input → byte-identical output (deterministic)', () => {
    expect(JSON.stringify(deriveSystemState(fixture))).toBe(JSON.stringify(deriveSystemState(fixture)));
  });

  test('source no longer reads the canonicalViewModel flag (no lib/flags import or flag() call)', () => {
    const src = read('state/deriveSystemState.js');
    expect(src).not.toMatch(/from ['"][^'"]*lib\/flags/);
    expect(src).not.toMatch(/\bflag\s*\(/);
  });
});

describe('normalizeSettlement is idempotent + stable-id (no Math.random)', () => {
  test('a settlement with no id and no _seed gets a STABLE id across calls', () => {
    const s = { name: 'Ashford', tier: 'town', population: 1500 };
    expect(normalizeSettlement(s).id).toBe(normalizeSettlement(s).id);
  });

  test('normalize(normalize(s)) deep-equals normalize(s) (idempotency contract)', () => {
    const s = { name: 'Ashford', tier: 'town', population: 1500 };
    const once = normalizeSettlement(s);
    const twice = normalizeSettlement(normalizeSettlement(s));
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
  });

  test('distinct content yields distinct ids', () => {
    const a = normalizeSettlement({ name: 'A', tier: 'town', population: 500 });
    const b = normalizeSettlement({ name: 'B', tier: 'town', population: 500 });
    expect(a.id).not.toBe(b.id);
  });

  test('source contains no Math.random', () => {
    expect(read('normalizeSettlement.js')).not.toMatch(/Math\.random\s*\(/);
  });
});

describe('pendingEdits.buildEdit produces deterministic ids (persisted state)', () => {
  test('same (kind, payload, clock) → same id', () => {
    const a = buildEdit('rename-npc', { npcId: 'a', newName: 'B' }, 5);
    const b = buildEdit('rename-npc', { npcId: 'a', newName: 'B' }, 5);
    expect(a.id).toBe(b.id);
  });

  test('different payload → different id', () => {
    const a = buildEdit('rename-npc', { npcId: 'a', newName: 'B' }, 5);
    const b = buildEdit('rename-npc', { npcId: 'a', newName: 'C' }, 5);
    expect(a.id).not.toBe(b.id);
  });

  test('source contains no Math.random', () => {
    expect(read('pendingEdits.js')).not.toMatch(/Math\.random\s*\(/);
  });
});
