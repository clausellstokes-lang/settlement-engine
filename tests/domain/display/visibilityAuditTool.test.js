/** @vitest-environment node */
import { describe, expect, test } from 'vitest';

import { runVisibilityAudit } from '../../../src/domain/display/visibilityAudit.js';

// The RUNTIME audit tool (the admin Sim-Tuning panel's button). It must PASS
// against the worst-case covert fixtures — proving the player-safe property
// holds at runtime, mirroring the static beta-gate test.

describe('runVisibilityAudit — the runtime player-safe audit tool', () => {
  test('passes against covert mobilization + smuggling worst-case fixtures', () => {
    const result = runVisibilityAudit();
    expect(result.ok).toBe(true);
    expect(result.checks.length).toBeGreaterThanOrEqual(4);
    expect(result.checks.every(c => c.pass)).toBe(true);
  });

  test('every check has a human label', () => {
    for (const c of runVisibilityAudit().checks) {
      expect(typeof c.label).toBe('string');
      expect(c.label.length).toBeGreaterThan(0);
    }
  });
});
