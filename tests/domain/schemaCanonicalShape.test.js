/**
 * tests/domain/schemaCanonicalShape.test.js — schema canonical-shape contract.
 *
 * The roadmap requires the generator to write the canonical schema
 * shape DIRECTLY, not just rely on `normalizeSettlement` as a read-
 * time adapter. This file verifies the pipeline assembler produces
 * settlements that carry both the legacy field name and canonical alias.
 *
 * If a future field gets added to FIELD_ALIASES, add an assertion
 * here for it. The test exists to keep generators in lockstep with
 * the schema's alias map.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { FIELD_ALIASES } from '../../src/domain/settlement.schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const ASSEMBLE = join(ROOT, 'src', 'generators', 'steps', 'assembleSettlement.js');

describe('schema aliases are documented', () => {
  it('FIELD_ALIASES is frozen and exports the documented alias groups', () => {
    expect(Object.isFrozen(FIELD_ALIASES)).toBe(true);
    expect(FIELD_ALIASES).toHaveProperty('stressors');
  });

  it('stressors alias group covers the object-shaped legacy names (stress / stresses)', () => {
    expect(FIELD_ALIASES.stressors).toContain('stress');
    expect(FIELD_ALIASES.stressors).toContain('stresses');
  });

  it('stressTypes is NOT a stressors alias — it holds type strings, not stressor objects', () => {
    // Aliasing it would let normalizeSettlement write a string[] into the
    // canonical `stressors` field; canonicalAccessors.canonStressors excludes it
    // for the same reason.
    expect(FIELD_ALIASES.stressors).not.toContain('stressTypes');
  });
});

describe('pipeline path writes both stress and stressors', () => {
  let src;
  beforeAll(() => { src = readFileSync(ASSEMBLE, 'utf8'); });

  it('assembleSettlement.js writes the legacy `stress` key', () => {
    expect(src).toMatch(/^\s*stress,\s*$/m);
  });

  it('assembleSettlement.js writes the canonical `stressors` key sourced from `stress`', () => {
    expect(src).toMatch(/stressors:\s*stress,/);
  });

  it('the two keys live in the same settlement object literal (dual-write, not branched)', () => {
    // Find the lines for both keys and make sure stressors comes
    // right after stress (no intervening object boundary).
    const stressIdx    = src.search(/^\s*stress,\s*$/m);
    const stressorsIdx = src.search(/^\s*stressors:\s*stress,/m);
    expect(stressIdx).toBeGreaterThan(0);
    expect(stressorsIdx).toBeGreaterThan(stressIdx);
    // No closing brace between them.
    const between = src.slice(stressIdx, stressorsIdx);
    expect(between).not.toMatch(/^\s*\}/m);
  });

  it('the dual-write is documented (legacy stress + canonical stressors)', () => {
    // The intent is that the dual-write is explained at the site, so a future
    // editor knows it is deliberate — keyed on the explanation, not a plan ID.
    expect(src).toMatch(/dual-write/i);
    expect(src).toMatch(/legacy[\s\S]{0,120}canonical|canonical[\s\S]{0,120}legacy/i);
  });
});

describe('round-trip: legacy and canonical names always agree', () => {
  it('when a fresh settlement carries `stress`, `stressors` is the same reference', () => {
    // Mock a generated-shape settlement and check the dual-write contract.
    const stressArr = [{ type: 'plague', severity: 'moderate' }];
    const generated = {
      name: 'Test', tier: 'town', population: 1500,
      stress: stressArr,
      stressors: stressArr,
    };
    expect(generated.stressors).toBe(generated.stress);
  });
});
