/**
 * reputationRaceIn4.test.js — FP IN-4 THE ROAD: the wave's acceptance file (the FP kit's
 * BUILD-FP-I2 brief; the compiled block #20 in docs/DESIGN_FP_ARCHITECTURE.md §5;
 * docs/DESIGN_FP_ARCH_IN.md §2, §4 IN-4 and §6 Q3).
 *
 * COMMIT 1 — J-INA-4, THE INVISIBLE KEY DECLARED. `intelTradeEnabled` has been a real, strict
 * gate since deep-couplings D-3 landed (`intelActs.intelTradeActive`), and the engine-gated walker
 * carried it on its measured BACKLOG because nothing declared it. The describe below is the
 * membership test the brief names: a source scan that names the key's ONE read site and the two
 * doors that call it, the manifest entry at its codepoint-sorted position, the authored row and
 * its one exact channel, and the byte-identity of the declaration (no rules surface names the key,
 * so the declaration is dark on every path and moves no world byte).
 *
 * ONE literal `describe`, literal straight-line `test` calls, nothing table-driven (the lighting
 * census parks a table-driven file whole).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { codeOnly } from '../helpers/codeOnlySource.js';
import {
  DEFAULT_SIMULATION_RULES,
  ENGINE_GATED_DORMANT_RULE_KEYS,
  ENGINE_GATED_VIRTUAL_RULE_KEYS,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';
import { VIRTUAL_SUBSYSTEM_ROWS } from '../../src/domain/certification/subsystemRowsVirtual.js';
import {
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { INTEL_COOLDOWN_LEDGER, intelTradeActive } from '../../src/domain/spatial/intelActs.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const KEY = 'intelTradeEnabled';
const LEAF = 'src/domain/spatial/intelActs.js';

/** @param {string} dir @param {string[]} out @returns {string[]} */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

/** Every src module as CODE: comments and string contents blanked, offsets kept. */
const SOURCES = walk(join(ROOT, 'src'))
  .filter((path) => /\.(js|jsx)$/.test(path))
  .map((path) => ({
    rel: relative(ROOT, path).replace(/\\/g, '/'),
    code: codeOnly(readFileSync(path, 'utf8')),
  }))
  .sort((a, b) => (a.rel < b.rel ? -1 : a.rel > b.rel ? 1 : 0));

describe('IN-4 commit 1 (J-INA-4): intelTradeEnabled is declared, and the declaration moves nothing', () => {
  test('THE MEMBERSHIP SCAN: the key has exactly one code read in src, strict, inside intelTradeActive', () => {
    // NON-VACUITY FIRST: a scan that read nothing would pass the equality below on an empty set.
    expect(SOURCES.length).toBeGreaterThan(1000);
    const readers = SOURCES.filter((file) => /\bintelTradeEnabled\b/.test(file.code)).map((file) => file.rel);
    expect(readers).toEqual([LEAF]);
    const { code } = /** @type {{ code: string }} */ (SOURCES.find((file) => file.rel === LEAF));
    const hits = [...code.matchAll(/\bintelTradeEnabled\b/g)];
    expect(hits).toHaveLength(1);
    // The one read is the STRICT idiom on the JSDoc-cast receiver, and it sits inside the gate.
    const at = /** @type {number} */ (hits[0].index);
    expect(code.slice(at, at + 'intelTradeEnabled === true'.length)).toBe('intelTradeEnabled === true');
    const open = code.indexOf('export function intelTradeActive(');
    const close = code.indexOf('export function', open + 1);
    expect(open).toBeGreaterThan(-1);
    expect(at).toBeGreaterThan(open);
    expect(at).toBeLessThan(close);
    // …and it behaves as the strict idiom reads: only a literal true opens it.
    expect(intelTradeActive({ simulationRules: { intelTradeEnabled: true } })).toBe(true);
    expect(intelTradeActive({ simulationRules: {} })).toBe(false);
    expect(intelTradeActive({ simulationRules: { intelTradeEnabled: false } })).toBe(false);
    expect(intelTradeActive({ simulationRules: { intelTradeEnabled: 'true' } })).toBe(false);
    expect(intelTradeActive({ simulationRules: { intelTradeEnabled: 1 } })).toBe(false);
    expect(intelTradeActive(null)).toBe(false);
  });

  test('THE TWO DOORS: the deposit in generosityKernel and the consume arm in informationStatecraft call the gate, and nothing else does', () => {
    const callers = SOURCES
      .filter((file) => file.rel !== LEAF && /\bintelTradeActive\s*\(/.test(file.code))
      .map((file) => file.rel);
    expect(callers).toEqual([
      'src/domain/worldPulse/generosityKernel.js',
      'src/domain/worldPulse/informationStatecraft.js',
    ]);
    // Each door calls it once, so a deleted guard cannot hide behind a surviving one.
    for (const rel of callers) {
      const { code } = /** @type {{ code: string }} */ (SOURCES.find((file) => file.rel === rel));
      expect([...code.matchAll(/\bintelTradeActive\s*\(/g)], rel).toHaveLength(1);
    }
  });

  test('the manifest carries the key at its codepoint-sorted position, and the census and the registry carry its row', () => {
    const at = ENGINE_GATED_VIRTUAL_RULE_KEYS.indexOf(KEY);
    expect(at).toBeGreaterThan(0);
    // SR-7: its neighbours sort around it, so a parallel lane's sorted insertion merges cleanly.
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS[at - 1] < KEY).toBe(true);
    expect(KEY < ENGINE_GATED_VIRTUAL_RULE_KEYS[at + 1]).toBe(true);
    expect(ENGINE_GATED_VIRTUAL_RULE_KEYS.filter((key) => key === KEY)).toHaveLength(1);
    const row = VIRTUAL_SUBSYSTEM_ROWS.find((entry) => entry.rule === KEY);
    expect(row).toBeTruthy();
    expect(SUBSYSTEM_CERTIFICATION_REGISTRY.some((entry) => entry.rule === KEY)).toBe(true);
    expect(simulationRuleKeys()).toContain(KEY);
    expect(row?.module.split(',')).toEqual([
      LEAF,
      'src/domain/worldPulse/generosityKernel.js',
      'src/domain/worldPulse/informationStatecraft.js',
    ]);
    expect(row?.aliveness.stateKeys).toEqual([`spatialLedgers.${INTEL_COOLDOWN_LEDGER}`]);
    expect(row?.soakEvidence).toBe('indirect');
  });

  test('the declaration is byte-identical: no rules surface names the key, so it is dormant on every path', () => {
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, KEY)).toBe(false);
    const presets = Object.entries(SIMULATION_RULE_PRESETS);
    expect(presets.length).toBeGreaterThan(0);
    for (const [name, preset] of presets) {
      const rules = /** @type {Record<string, unknown>} */ ((preset && preset.rules) || {});
      expect(Object.prototype.hasOwnProperty.call(rules, KEY), `${name} names ${KEY}`).toBe(false);
    }
    // The DERIVED dark list agrees: a register member no surface lights is dormant.
    expect(ENGINE_GATED_DORMANT_RULE_KEYS).toContain(KEY);
  });

  test('the row channel is exact: one module writes the cooldown ledger, the one behind the gate', () => {
    expect(INTEL_COOLDOWN_LEDGER).toBe('intelCooldown');
    // The ledger's name reaches a writer only through the exported constant (codeOnly blanks
    // string literals, so a quoted spelling cannot hide a second writer from the scan below:
    // it is caught by the raw-text arm instead).
    const writers = SOURCES
      .filter((file) => /\b(?:setSpatialLedger|dropSpatialLedger)\s*\([^;]*\bINTEL_COOLDOWN_LEDGER\b/.test(file.code))
      .map((file) => file.rel);
    expect(writers).toEqual(['src/domain/worldPulse/generosityKernel.js']);
    const quoted = walk(join(ROOT, 'src'))
      .filter((path) => /\.(js|jsx)$/.test(path))
      .filter((path) => /(?:setSpatialLedger|dropSpatialLedger)\s*\([^;]*['"`]intelCooldown['"`]/.test(readFileSync(path, 'utf8')));
    expect(quoted).toEqual([]);
  });
});
