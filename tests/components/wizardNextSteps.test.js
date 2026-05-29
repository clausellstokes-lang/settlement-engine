/**
 * wizardNextSteps.test.js — P134 / W-4 contract over the pure next-step
 * builder. WizardNextSteps renders a post-generate "what's next" guide;
 * buildNextSteps() derives the ordered checklist from settlement + save/
 * auth state. Tested here in isolation (no DOM).
 */

import { describe, it, expect } from 'vitest';
import { buildNextSteps } from '../../src/components/generate/WizardNextSteps.jsx';

const ids = (g) => g.steps.map(s => s.id);
const stepById = (g, id) => g.steps.find(s => s.id === id);

describe('buildNextSteps', () => {
  it('headlines with the settlement tier; falls back to "settlement"', () => {
    expect(buildNextSteps({ settlement: { tier: 'Village' } }).headline)
      .toBe('Your Village is ready.');
    expect(buildNextSteps().headline).toBe('Your settlement is ready.');
    expect(buildNextSteps({ settlement: {} }).headline).toBe('Your settlement is ready.');
  });

  it('always returns the five next steps in order', () => {
    const g = buildNextSteps({ settlement: { tier: 'Town' } });
    expect(ids(g)).toEqual(['save', 'export', 'refine', 'map', 'another']);
    for (const s of g.steps) {
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
    expect(g.steps).toHaveLength(5);
    // Default (no auth info) → anonymous framing.
    expect(stepById(g, 'save').label).toMatch(/free account/i);
  });
});
