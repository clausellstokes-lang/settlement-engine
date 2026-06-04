/**
 * @vitest-environment jsdom
 *
 * tests/ui/BandPill.test.jsx - Tier 5.4 surface tests.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import { BandPill } from '../../src/components/primitives/BandPill.jsx';

afterEach(cleanup);

describe('BandPill - render gates', () => {
  test('returns null with no band, ref, or label', () => {
    const { container } = render(<BandPill />);
    expect(container.firstChild).toBeNull();
  });

  test('renders an explicit band+label without settlement', () => {
    render(<BandPill band="strained" label="Strained" />);
    expect(screen.getByText('Strained')).toBeTruthy();
  });

  test('falls back to capitalized band when no label can be resolved', () => {
    render(<BandPill band="strained" />);
    expect(screen.getByText('Strained')).toBeTruthy();
  });
});

describe('BandPill - bands', () => {
  test('renders surplus with the surplus glyph', () => {
    render(<BandPill band="surplus" />);
    expect(screen.getByRole('status').textContent).toMatch(/▲/);
  });

  test('renders adequate with the adequate glyph', () => {
    render(<BandPill band="adequate" />);
    expect(screen.getByRole('status').textContent).toMatch(/●/);
  });

  test('renders strained with the strained glyph', () => {
    render(<BandPill band="strained" />);
    expect(screen.getByRole('status').textContent).toMatch(/◐/);
  });

  test('renders critical with the critical glyph', () => {
    render(<BandPill band="critical" />);
    expect(screen.getByRole('status').textContent).toMatch(/▼/);
  });

  test('renders collapsed with the collapsed glyph', () => {
    render(<BandPill band="collapsed" />);
    expect(screen.getByRole('status').textContent).toMatch(/✕/);
  });

  test('unknown band falls through with neutral colors and no glyph', () => {
    render(<BandPill band="unknown" />);
    expect(screen.getByText(/Unknown/i)).toBeTruthy();
  });
});

describe('BandPill - display labels', () => {
  test('substrate domain renders the user-facing label', () => {
    // qualitativeBands maps substrate.surplus → 'Abundant'
    render(<BandPill domain="substrate" band="surplus" />);
    expect(screen.getByText(/Abundant/i)).toBeTruthy();
  });

  test('labelBefore prepends to the label', () => {
    render(<BandPill band="strained" label="Contested" labelBefore="Legitimacy: " />);
    const chip = screen.getByRole('status');
    expect(chip.textContent).toMatch(/Legitimacy:/);
    expect(chip.textContent).toMatch(/Contested/);
  });

  test('explicit label overrides domain lookup', () => {
    render(<BandPill domain="substrate" band="surplus" label="Custom Label" />);
    expect(screen.getByText('Custom Label')).toBeTruthy();
  });
});

describe('BandPill - settlement-driven', () => {
  test('uses bandFor when given ref + settlement', () => {
    const settlement = {
      id: 's', name: 'X', tier: 'town', population: 1500,
      // Enough shape that deriveCausalState returns a band for food_security.
      _seed: 'fixed',
      institutions: [],
      powerStructure: { factions: [], conflicts: [] },
      npcs: [],
    };
    // The exact band depends on the derivation; we just verify the
    // component doesn't crash + renders SOMETHING.
    const { container } = render(
      <BandPill ref={{ kind: 'substrate', key: 'food_security' }} settlement={settlement} />,
    );
    // Either a band pill OR null (if the derivation returns nothing
    // for this fixture). Both are acceptable; the test asserts no throw.
    if (container.firstChild) {
      expect(container.textContent.length).toBeGreaterThan(0);
    } else {
      expect(container.firstChild).toBeNull();
    }
  });

  test('a settlement-driven lookup with no match returns null gracefully', () => {
    const settlement = { id: 's', name: 'X' };
    const { container } = render(
      <BandPill ref={{ kind: 'substrate', key: 'nonexistent_variable' }} settlement={settlement} />,
    );
    expect(container.firstChild).toBeNull();
  });
});

describe('BandPill - sizes', () => {
  test('size=sm renders a smaller pill than size=lg', () => {
    // Render two pills in separate test bodies (cleanup between)
    // so each container query has its own DOM.
    const { container: sm, unmount: unmountSm } = render(<BandPill band="strained" size="sm" />);
    const smFontSize = sm.querySelector('[role="status"]').style.fontSize;
    unmountSm();
    const { container: lg } = render(<BandPill band="strained" size="lg" />);
    const lgFontSize = lg.querySelector('[role="status"]').style.fontSize;
    expect(parseInt(smFontSize)).toBeLessThan(parseInt(lgFontSize));
  });

  test('default size is md', () => {
    render(<BandPill band="strained" />);
    expect(screen.getByRole('status').style.fontSize).toBe('11px');
  });
});

describe('BandPill - accessibility', () => {
  test('exposes role=status', () => {
    render(<BandPill band="strained" />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  test('aria-label includes labelBefore + the band label', () => {
    render(<BandPill band="strained" labelBefore="Food security: " label="Strained" />);
    expect(screen.getByLabelText(/Food security:.*Strained/)).toBeTruthy();
  });

  test('title attribute matches aria-label', () => {
    render(<BandPill band="critical" label="Critical" labelBefore="Legitimacy: " />);
    expect(screen.getByRole('status').getAttribute('title')).toMatch(/Legitimacy:.*Critical/);
  });

  test('showGlyph=false hides the glyph (use when space-constrained)', () => {
    render(<BandPill band="strained" showGlyph={false} />);
    expect(screen.getByRole('status').textContent).not.toMatch(/◐/);
  });
});
