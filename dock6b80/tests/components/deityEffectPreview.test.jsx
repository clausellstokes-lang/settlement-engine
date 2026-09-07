/** @vitest-environment jsdom */
/**
 * DeityEffectPreview — Phase 5 W-C4 deity authoring effect preview.
 *
 * Pins that the preview renders from the DRAFT through the SINGLE SOURCE
 * (describeDeityDraft → the shared domain/display/deityEffects couplings + the
 * deityAxes/deityStance stance & synergy vocabulary), and that a fully-neutral,
 * unranked draft yields the dormancy guarantee (no couplings, the teaching line).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

import DeityEffectPreview from '../../src/components/compendium/DeityEffectPreview.jsx';
import { describeDeityDraft } from '../../src/components/compendium/deityDraftPreview.js';

afterEach(() => cleanup());

describe('DeityEffectPreview — renders from a draft (single source)', () => {
  it('a fully-neutral, unranked draft shows the dormancy empty state (no couplings)', () => {
    const { container } = render(<DeityEffectPreview draft={{}} />);
    expect(screen.getByTestId('deity-effect-preview')).toBeTruthy();
    expect(container.textContent).toMatch(/No registered living-world effect/i);
    // No engine coupling bullet.
    expect(container.querySelector('ul')).toBeNull();
  });

  it('a good · lawful · major draft renders the exact engine couplings + stance + synergy', () => {
    const draft = { alignmentAxis: 'good', lawAxis: 'lawful', rankAxis: 'major' };
    const { container } = render(<DeityEffectPreview draft={draft} />);
    const text = container.textContent;
    // Engine couplings (from describeDeityEffects — never hand-copied).
    expect(text).toMatch(/exposes corruption/i);
    expect(text).toMatch(/strengthens law and order/i);
    expect(text).toMatch(/anchors religious authority/i);
    expect(text).toMatch(/magic legality/i);
    // Stance geometry (good ⇒ consolidated against evil).
    expect(text).toMatch(/direct hostility toward evil rivals/i);
    // Government synergy (lawful ⇒ props the mandate).
    expect(text).toMatch(/props a traditional ruler/i);
    // The dormancy reminder is always present.
    expect(text).toMatch(/Dormant until you assign/i);
  });

  it('an evil · chaotic draft renders the transactional stance + mandate-undercut synergy', () => {
    const { container } = render(<DeityEffectPreview draft={{ alignmentAxis: 'evil', lawAxis: 'chaotic', rankAxis: 'cult' }} />);
    const text = container.textContent;
    expect(text).toMatch(/lets corruption take root/i);
    expect(text).toMatch(/tolerates corruption/i);          // chaotic law line
    expect(text).toMatch(/cooperate only transactionally/i); // evil stance
    expect(text).toMatch(/Undercuts a traditional ruler/i);
  });

  it('a supported domain previews conditional war pressure without claiming the deity acts', () => {
    const { container } = render(<DeityEffectPreview draft={{ domain: 'War' }} />);
    const text = container.textContent;
    expect(text).toMatch(/war-domain worship lowers the settlement’s bar for war/i);
    expect(text).toMatch(/disposition channels active/i);
    expect(text).not.toMatch(/this god (?:acts|will)|the deity acts/i);
  });

  it('an arbitrary domain remains presentation-only', () => {
    const { container } = render(<DeityEffectPreview draft={{ domain: 'sun' }} />);
    expect(container.querySelector('ul')).toBeNull();
    expect(container.textContent).toMatch(/No registered living-world effect/i);
    expect(container.textContent).not.toMatch(/bar for war/i);
  });
});

describe('describeDeityDraft — the pure single source', () => {
  it('neutral draft ⇒ no couplings, no stance, no synergy', () => {
    expect(describeDeityDraft({})).toEqual({ couplings: [], stance: null, synergy: null });
  });

  it('a lawful-neutral draft has synergy but no moral stance', () => {
    const out = describeDeityDraft({ lawAxis: 'lawful', rankAxis: 'minor' });
    expect(out.stance).toBeNull();
    expect(out.synergy).toMatch(/props a traditional ruler/i);
    expect(out.couplings.length).toBeGreaterThan(0);
  });
});
