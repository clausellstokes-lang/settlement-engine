/**
 * magicWorksAt.test.js — ES-0's neutral lift of the magic-existence predicate ⟨F7⟩.
 *
 * The claim that matters is not "the new function works" — it is that the LIFT MOVED
 * NOTHING. `warMagicFunctions` had one production consumer (`stampWarMagicLaw`, in its
 * own module) and a war-lane test suite, and both must be reading the identical
 * predicate afterwards. So the identity is pinned as an object identity, not as a
 * behavioural sample: two functions can agree on every fixture anyone thought to write
 * and diverge on the one nobody did.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { magicWorksAt } from '../../src/domain/worldPulse/magicWorksAt.js';
import { pairMagicFunctions, stampWarMagicLaw, warMagicFunctions } from '../../src/domain/worldPulse/warMagicGate.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('the lift is a re-export, not a copy', () => {
  test('warMagicGate.warMagicFunctions IS magicWorksAt (object identity)', () => {
    // R-BLD-5's shape. Identity rather than equivalence: a second BODY that happens to
    // agree today is exactly the fork this lift exists to prevent, and no sample of
    // fixtures can rule one out.
    expect(warMagicFunctions).toBe(magicWorksAt);
  });

  test('warMagicGate no longer carries a second body of the predicate', () => {
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/warMagicGate.js'), 'utf8');
    expect(source).toContain('magicWorksAt.js');
    // The tell for a re-introduced copy: the ledger accessor being read here again.
    expect(source, 'warMagicGate re-derived the predicate instead of re-exporting it')
      // anchored: the toContain('magicWorksAt.js') assertion on the line above proves
      // this source really is warMagicGate and really was read, so the absence of a
      // second ledger read is a measurement rather than an empty-file pass.
      // anchored: the toContain('magicWorksAt.js') above proves the source was read.
      .not.toMatch(/magicLedger\s*\(/);
  });

  test('the module-private TWIN is named, and it is genuinely a different function', () => {
    // The export name is distinct precisely so a sweep never conflates the two. That
    // only stays true while the twin really is different — if teleportEdges ever grows
    // a one-argument settlement read, this pin is where the collision surfaces.
    const twin = readFileSync(join(ROOT, 'src/domain/spatial/teleportEdges.js'), 'utf8');
    expect(twin, 'the teleportEdges twin vanished — the leaf header now names a ghost')
      .toMatch(/function\s+magicFunctionsAt\s*\(\s*magicById\s*,/);
    expect(twin, 'the twin was exported — the two names are now both public and confusable')
      // anchored: the toMatch above proves the twin's DECLARATION is present in this
      // same source, so "it is not exported" is measured against a file that has it.
      // anchored: the toMatch above proves the twin's declaration is present here.
      .not.toMatch(/export\s+function\s+magicFunctionsAt/);
    const leaf = readFileSync(join(ROOT, 'src/domain/worldPulse/magicWorksAt.js'), 'utf8');
    expect(leaf, 'the leaf header must name the twin and its arity').toContain('magicFunctionsAt(magicById, id)');
  });
});

describe('the predicate itself — and the guard that is the whole point', () => {
  test('THE PRESENT GUARD: a settlement with no magic axis reads as MAGICAL', () => {
    // anchored: the `magicLedger` neutral envelope for an un-generated settlement is
    // itself `magicExists:false`. An unguarded read would declare every config-less
    // fixture in the estate mundane and move goldens that have nothing to do with magic.
    expect(magicWorksAt({ settlement: { config: { priorityEconomy: 25 } } })).toBe(true);
    expect(magicWorksAt({ settlement: {} })).toBe(true);
    expect(magicWorksAt(null)).toBe(true);
    expect(magicWorksAt(undefined)).toBe(true);
  });

  test('only a settlement that CARRIES the axis and asserts absence reads mundane', () => {
    expect(magicWorksAt({ settlement: { config: { magicExists: false, priorityMagic: 0 } } })).toBe(false);
    expect(magicWorksAt({ settlement: { config: { magicExists: true, priorityMagic: 40 } } })).toBe(true);
  });

  test('both call shapes read the same — a snapshot item and a bare settlement', () => {
    const config = { magicExists: false, priorityMagic: 0 };
    expect(magicWorksAt({ config })).toBe(false);
    expect(magicWorksAt({ settlement: { config } })).toBe(false);
  });
});

describe('the war-lane consumers still behave exactly as before', () => {
  test('stampWarMagicLaw is still one-sided and identity-preserving on a magical world', () => {
    const facets = Object.freeze({ materiel: 40 });
    expect(stampWarMagicLaw(facets, { settlement: {} })).toBe(facets);
    const mundane = stampWarMagicLaw(facets, { settlement: { config: { magicExists: false, priorityMagic: 0 } } });
    expect(mundane).not.toBe(facets);
    expect(mundane.magicFunctions).toBe(false);
  });

  test('the pair rule still closes on a single mundane end', () => {
    expect(pairMagicFunctions({}, {})).toBe(true);
    expect(pairMagicFunctions({ magicFunctions: false }, {})).toBe(false);
    expect(pairMagicFunctions({}, { magicFunctions: false })).toBe(false);
  });
});
