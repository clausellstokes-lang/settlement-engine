/**
 * wizardNextSteps.test.js — P134 / W-4 contract over the pure next-step
 * builder. buildNextSteps() derives the ordered "what's next" checklist
 * from settlement + save/auth state; it is folded into the final step of
 * PostGenCoach. Tested here in isolation (no DOM).
 */

import { describe, it, expect } from 'vitest';
import { buildNextSteps } from '../../src/components/generate/nextSteps.js';

const ids = (g) => g.steps.map(s => s.id);
const stepById = (g, id) => g.steps.find(s => s.id === id);

describe('buildNextSteps', () => {
  it('headlines with the settlement NAME when present; falls back to tier, then "settlement"', () => {
    // Peak/end binds to the artifact's identity, not a generic category label.
    expect(buildNextSteps({ settlement: { name: 'Hollowmere', tier: 'Village' } }).headline)
      .toBe('Hollowmere is ready.');
    // No name → tier headline.
    expect(buildNextSteps({ settlement: { tier: 'Village' } }).headline)
      .toBe('Your Village is ready.');
    expect(buildNextSteps().headline).toBe('Your settlement is ready.');
    expect(buildNextSteps({ settlement: {} }).headline).toBe('Your settlement is ready.');
  });

  it('returns the four forward-building steps in order; "Generate another" is a detached footer', () => {
    // "Generate another" discards the dossier rather than building on it, so it
    // is intentionally NOT the final recency slot of `steps` — it returns as a
    // separate quiet `footer`.
    const g = buildNextSteps({ settlement: { tier: 'Town' } });
    expect(ids(g)).toEqual(['save', 'export', 'refine', 'map']);
    expect(g.footer.id).toBe('another');
    for (const s of [...g.steps, g.footer]) {
      expect(typeof s.label).toBe('string');
      expect(s.label.length).toBeGreaterThan(0);
      expect(typeof s.hint).toBe('string');
      expect(s.hint.length).toBeGreaterThan(0);
    }
  });

  it('anonymous users get the free-account save framing', () => {
    const g = buildNextSteps({ canSave: false, signedIn: false });
    expect(stepById(g, 'save').label).toMatch(/free account/i);
  });

  it('signed-in users who can save get the library framing', () => {
    const g = buildNextSteps({ canSave: true, signedIn: true });
    expect(stepById(g, 'save').label).toMatch(/library/i);
  });

  it('signed-in users who cannot save get the cap/upgrade framing', () => {
    const g = buildNextSteps({ canSave: false, signedIn: true });
    expect(stepById(g, 'save').label).toMatch(/slot|upgrade/i);
    expect(stepById(g, 'save').hint).toMatch(/cap/i);
  });

  it('save framing prefers canSave even if signedIn is unknown', () => {
    // canSave is the authoritative "you can save right now" signal.
    expect(stepById(buildNextSteps({ canSave: true }), 'save').label).toMatch(/library/i);
  });

  it('defends against missing args', () => {
    const g = buildNextSteps();
    expect(g.steps).toHaveLength(4);
    expect(g.footer.id).toBe('another');
    // Default (no auth info) → anonymous framing.
    expect(stepById(g, 'save').label).toMatch(/free account/i);
  });
});
