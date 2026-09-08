import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  PULSE_STAGE_MANIFEST_VERSION,
  PULSE_STAGE_TOPOLOGY,
} from '../../src/domain/worldPulse/pulseStageManifest.js';

const kernelSource = readFileSync(
  new URL('../../src/domain/worldPulse/pulseKernel.js', import.meta.url),
  'utf8',
);

describe('pulse stage topology', () => {
  it('is a total acyclic order with named ownership', () => {
    expect(PULSE_STAGE_MANIFEST_VERSION).toBe(1);
    const seen = new Set();
    for (const stage of PULSE_STAGE_TOPOLOGY) {
      expect(seen.has(stage.id)).toBe(false);
      expect(stage.owns.length).toBeGreaterThan(0);
      expect(stage.purpose).toBeTruthy();
      for (const dependency of stage.after) expect(seen.has(dependency)).toBe(true);
      seen.add(stage.id);
    }
  });

  it('pins one ordered marker per phase in the execution authority', () => {
    let priorIndex = -1;
    for (const stage of PULSE_STAGE_TOPOLOGY) {
      const marker = `@pulse-stage: ${stage.id}`;
      const first = kernelSource.indexOf(marker);
      expect(first, `missing ${marker}`).toBeGreaterThan(priorIndex);
      expect(
        kernelSource.indexOf(marker, first + marker.length),
        `duplicate ${marker}`,
      ).toBe(-1);
      priorIndex = first;
    }
  });
});
