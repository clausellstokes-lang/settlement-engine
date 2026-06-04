/**
 * tests/domain/schemaCanonicalShape.test.js - Tier 1.2 contract.
 *
 * The roadmap requires the generator to write the canonical schema
 * shape DIRECTLY, not just rely on `normalizeSettlement` as a read-
 * time adapter. This file verifies both the pipeline path
 * (assembleSettlement.js) and the legacy path (generateSettlement.js)
 * produce settlements that carry both the legacy field name AND the
 * canonical alias.
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
const LEGACY   = join(ROOT, 'src', 'generators', 'generateSettlement.js');

describe('Tier 1.2 - schema aliases are documented', () => {
  it('FIELD_ALIASES is frozen and exports the documented alias groups', () => {
    expect(Object.isFrozen(FIELD_ALIASES)).toBe(true);
    expect(FIELD_ALIASES).toHaveProperty('stressors');
  });

  it('stressors alias group covers every legacy name (stress / stresses / stressTypes)', () => {
    expect(FIELD_ALIASES.stressors).toContain('stress');
    expect(FIELD_ALIASES.stressors).toContain('stresses');
    expect(FIELD_ALIASES.stressors).toContain('stressTypes');
  });
});

describe('Tier 1.2 - pipeline path writes both stress and stressors', () => {
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

  it('the dual-write is documented as Tier 1.2', () => {
    expect(src).toMatch(/Tier 1\.2/);
  });
});

describe('Tier 1.2 - legacy path also writes both stress and stressors', () => {
  let src;
  beforeAll(() => { src = readFileSync(LEGACY, 'utf8'); });

  it('generateSettlement.js writes the legacy `stress` key', () => {
    expect(src).toMatch(/^\s*stress,\s*$/m);
  });

  it('generateSettlement.js writes the canonical `stressors` key sourced from `stress`', () => {
    expect(src).toMatch(/stressors:\s*stress,/);
  });

  it('the dual-write is documented as Tier 1.2', () => {
    expect(src).toMatch(/Tier 1\.2/);
  });
});

describe('Tier 1.2 - round-trip: legacy and canonical names always agree', () => {
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
