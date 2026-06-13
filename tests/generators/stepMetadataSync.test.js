/**
 * stepMetadataSync.test.js — structural-prevention sync test.
 *
 * The pipeline-rail receipts (STEP_METADATA) must stay in lockstep with the
 * registered pipeline steps. A registered step missing from STEP_METADATA falls
 * back to its raw machine name in the rail; a STEP_METADATA entry for a step that
 * isn't registered is dead. The file header promised this test "loud in DEV" but
 * it never existed — corruptionPass had silently drifted out of STEP_METADATA.
 *
 * Importing steps/index.js registers every step; getStepMeta() then enumerates
 * the registry.
 */

import { describe, it, expect } from 'vitest';
import '../../src/generators/steps/index.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { STEP_METADATA, metaForStep } from '../../src/generators/steps/stepMetadata.js';

describe('STEP_METADATA ↔ pipeline registry sync', () => {
  const registered = getStepMeta().map(s => s.name).sort();
  const documented = Object.keys(STEP_METADATA).sort();

  it('every registered pipeline step has a STEP_METADATA entry', () => {
    const missing = registered.filter(name => !(name in STEP_METADATA));
    expect(missing, `registered steps missing from STEP_METADATA: ${missing.join(', ')}`).toEqual([]);
  });

  it('every STEP_METADATA entry maps to a registered step (no dead entries)', () => {
    const regSet = new Set(registered);
    const dead = documented.filter(name => !regSet.has(name));
    expect(dead, `STEP_METADATA entries with no registered step: ${dead.join(', ')}`).toEqual([]);
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
