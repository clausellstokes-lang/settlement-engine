/**
 * @vitest-environment jsdom
 *
 * realmStrip.test.jsx — the campaign-folder "state of the realm" strip (UX Phase 3).
 *
 * Pins the self-hide invariant (dormant campaign → renders NOTHING, byte-identical)
 * and the canonized-campaign readout (clock + siege count + dominant faith), plus
 * the dominantFaith tie-break (highest tier, then seats).
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import RealmStrip, { dominantFaith } from '../../src/components/settlements/RealmStrip.jsx';

afterEach(cleanup);

describe('RealmStrip — self-hide when dormant', () => {
  it('renders nothing for a campaign whose world is not canonized', () => {
    const { container } = render(<RealmStrip campaign={{ name: 'Dormant', worldState: { canonizedAt: null, tick: 0 } }} settlements={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for a campaign with no worldState at all', () => {
    const { container } = render(<RealmStrip campaign={{ name: 'Fresh' }} settlements={[]} />);
    expect(container.firstChild).toBeNull();
  });
});

describe('RealmStrip — canonized realm readout', () => {
  it('shows the in-world clock + siege count when canonized', () => {
    const campaign = {
      name: 'The March',
      worldState: {
        canonizedAt: '2026-01-01T00:00:00Z',
        tick: 4,
        calendar: { season: 'autumn', year: 2 },
        deployments: { 'a': { targetId: 'b' } },
      },
    };
    render(<RealmStrip campaign={campaign} settlements={[{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]} />);
    expect(screen.getByTestId('realm-strip')).toBeTruthy();
    expect(screen.getByText(/Autumn/)).toBeTruthy();
    expect(screen.getByText(/Year 2/)).toBeTruthy();
    // One siege (a → b).
    expect(screen.getByText(/1 siege/)).toBeTruthy();
  });

  it('shows the dominant faith pill when a pantheon is materialized', () => {
    const campaign = {
      name: 'The Faithful',
      worldState: {
        canonizedAt: '2026-01-01T00:00:00Z',
        tick: 1,
        calendar: { season: 'spring', year: 1 },
        pantheon: {
          'deity:Sol': { tier: 'major', seats: 5 },
          'deity:Mara': { tier: 'cult', seats: 1 },
        },
      },
    };
    render(<RealmStrip campaign={campaign} settlements={[
      { id: 's1', settlement: { config: { primaryDeitySnapshot: { name: 'Sol', _deityRef: 'deity:Sol' } } } },
    ]} />);
    expect(screen.getByText('Sol')).toBeTruthy();
  });
});

describe('dominantFaith — tie-break', () => {
  it('null for a dormant (no-pantheon) campaign', () => {
    expect(dominantFaith({ worldState: {} }, [])).toBeNull();
    expect(dominantFaith({ worldState: { pantheon: {} } }, [])).toBeNull();
  });

  it('highest tier wins over more seats at a lower tier', () => {
    const campaign = {
      worldState: { pantheon: {
        'deity:Major': { tier: 'major', seats: 1 },
        'deity:Cult':  { tier: 'cult', seats: 9 },
      } },
    };
    const faith = dominantFaith(campaign, []);
    expect(faith?.tier).toBe('major');
  });

  it('within a tier, more seats wins', () => {
    const campaign = {
      worldState: { pantheon: {
        'deity:Lo': { tier: 'minor', seats: 2 },
        'deity:Hi': { tier: 'minor', seats: 7 },
      } },
    };
    expect(dominantFaith(campaign, []).name).toBe('Hi');
  });
});

// ── §69.3 / §113: the player-facing strip carries no raw counter ─────────────
// Both arms mount the real strip first and read its RENDERED text, because a
// "no raw counter survives" negative asserted against an unmounted component
// passes for the wrong reason — and this component self-hides on a dormant
// world, which is exactly the shape that would make it vacuous.
describe('RealmStrip — the week reads as a span, never as an engine counter', () => {
  const canonized = (tick, campaignExtra = {}) => ({
    name: 'The March',
    worldState: { canonizedAt: '2026-01-01T00:00:00Z', tick, calendar: { season: 'spring', year: 1 } },
    ...campaignExtra,
  });

  it('states the week within the year in the sanctioned span idiom', () => {
    const { container } = render(<RealmStrip campaign={canonized(60)} settlements={[]} />);
    const text = container.textContent || '';
    expect(text).toContain('Year 1'); // the strip really mounted
    expect(text).toContain('week 9 of 52');
    expect(/·\s*week\s+60\b/.test(text), `raw counter survived: ${text}`).toBe(false);
  });

  it('reads a news age as prose, singular and plural both byte-identical to the spelling replaced', () => {
    const single = render(
      <RealmStrip campaign={canonized(5, { wizardNews: { currentTick: 5, entries: [{ tick: 4 }] } })} settlements={[]} />,
    );
    expect(single.container.textContent || '').toContain('News 1 week ago');
    cleanup();
    const many = render(
      <RealmStrip campaign={canonized(5, { wizardNews: { currentTick: 5, entries: [{ tick: 2 }] } })} settlements={[]} />,
    );
    expect(many.container.textContent || '').toContain('News 3 weeks ago');
  });
});
