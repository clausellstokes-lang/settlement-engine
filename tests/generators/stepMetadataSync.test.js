/**
 * stepMetadataSync.test.js — structural-prevention sync test.
 *
 * The pipeline-rail receipts must stay in lockstep with the registered pipeline
 * steps. A registered step missing from them falls back to its raw machine name in
 * the rail; an entry for a step that isn't registered is dead. The file header
 * promised this test "loud in DEV" but it never existed — corruptionPass had
 * silently drifted out of STEP_METADATA.
 *
 * ⛔ IT IS NOW TWO TABLES AND THE SYNC LAW BINDS BOTH. stepMetadata.js holds the
 * worker's `summary(ctx)` closures in STEP_METADATA and the rail's words in
 * STEP_PRESENTATION, so that 2.9 kB of rail copy stops riding into the generation
 * worker's bundle. Two tables is two places to drift, which is exactly the failure
 * this file exists to make loud, so every arm below runs over BOTH — including the
 * key-set equality that says a step can never have words without a summary row or
 * the reverse.
 *
 * Importing steps/index.js registers every step; getStepMeta() then enumerates
 * the registry.
 */

import { describe, it, expect } from 'vitest';
import '../../src/generators/steps/index.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import {
  STEP_METADATA, STEP_PRESENTATION, metaForStep, presentationForStep,
} from '../../src/generators/steps/stepMetadata.js';

describe('STEP_METADATA ↔ pipeline registry sync', () => {
  const registered = getStepMeta().map(s => s.name).sort();
  const documented = Object.keys(STEP_METADATA).sort();
  const presented = Object.keys(STEP_PRESENTATION).sort();

  it('every registered pipeline step has a STEP_METADATA entry', () => {
    const missing = registered.filter(name => !(name in STEP_METADATA));
    expect(missing, `registered steps missing from STEP_METADATA: ${missing.join(', ')}`).toEqual([]);
  });

  it('every STEP_METADATA entry maps to a registered step (no dead entries)', () => {
    const regSet = new Set(registered);
    const dead = documented.filter(name => !regSet.has(name));
    expect(dead, `STEP_METADATA entries with no registered step: ${dead.join(', ')}`).toEqual([]);
  });

  it('the two tables carry the SAME step ids, so neither half can drift alone', () => {
    // The split is the only reason the rail's words leave the worker bundle; a step
    // with a summary row and no words row reads as a raw machine name on the rail,
    // and one with words and no summary row emits a blank line under its label.
    expect(presented, 'STEP_PRESENTATION ids do not match STEP_METADATA ids').toEqual(documented);
  });

  it('every registered pipeline step has rail WORDS, and none of them dangles', () => {
    const missing = registered.filter(name => !(name in STEP_PRESENTATION));
    expect(missing, `registered steps with no STEP_PRESENTATION row: ${missing.join(', ')}`).toEqual([]);
    const blank = presented.filter(name => !presentationForStep(name).label
      || !presentationForStep(name).description);
    expect(blank, `STEP_PRESENTATION rows with an empty label or description: ${blank.join(', ')}`).toEqual([]);
    // The fallback the rail relies on for a name it has no row for: the raw id, so
    // the surface still reads rather than rendering `undefined`.
    expect(presentationForStep('noSuchStep')).toEqual({ label: 'noSuchStep', description: '' });
  });

  it('a step id that names an Object.prototype member resolves to the fallback, not a function', () => {
    // ⛔ A BARE `TABLE[name]` RETURNS Object.prototype's member for these, and each is
    // TRUTHY, so the `||` fallback was skipped and a FUNCTION was handed to the rail.
    // The rail's ids come off a PERSISTED receipt, so the name is not this file's to
    // trust. Both lookups are `Object.hasOwn` guarded; this is the proof.
    for (const hostile of ['constructor', 'toString', 'valueOf', 'hasOwnProperty']) {
      expect(presentationForStep(hostile), hostile).toEqual({ label: hostile, description: '' });
      expect(typeof metaForStep(hostile).summary, hostile).toBe('function');
      expect(metaForStep(hostile).summary({}), hostile).toBe(null);
    }
  });

  it('every summary(ctx) is callable and tolerates an empty context', () => {
    for (const name of documented) {
      const meta = metaForStep(name);
      expect(typeof meta.summary).toBe('function');
      // Must not throw on a bare context (the rail can render mid-pipeline).
      expect(() => meta.summary({})).not.toThrow();
    }
  });
});
