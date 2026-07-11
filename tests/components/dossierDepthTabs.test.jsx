/** @vitest-environment jsdom */
/**
 * dossierDepthTabs.test.jsx — Phase 5 W4e dossier-depth tabs.
 *
 * Pins the three new Systems sub-tabs and, above all, THE CONSTITUTIONAL CHECK:
 * the War & Faith tab is built on OUR gated FaithSection, so a FREE / ANON viewer
 * NEVER sees a deity name in it (no live pantheon, no leak). It also pins that
 * Substrate + Magic render their read-models and that a magic-free settlement's
 * Magic tab is dormant (honest, not fabricated).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock the store: WarFaithTab reads campaigns/savedSettlements/auth, and its
// composed FaithSection reads auth.tier/isElevated/the upsell seam.
vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      auth: { tier: 'anon' },
      isElevated: () => false,
      setPurchaseModalOpen: () => {},
      setActivePricingMoment: () => {},
      campaigns: [],
      savedSettlements: [],
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import WarFaithTab from '../../src/components/new/tabs/WarFaithTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';

// A distinctive latent-deity name — if it ever appears in a free War & Faith
// render, the constitutional privacy gate has failed.
const LATENT_NAME = 'Zzyraxil the Unnamed';
const latentPantheonTown = () => ({
  name: 'Quietford',
  config: { latentPantheon: { patron: { name: LATENT_NAME, _deityRef: 'deity:core:zzyraxil' }, cults: [{ name: 'The Whispering Ash' }] } },
});
const activePatronTown = () => ({
  name: 'Sunhold',
  config: { primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun', alignmentAxis: 'good' } },
});

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('WarFaithTab — the constitutional gate (free/anon see NO deity names)', () => {
  it('ANON + a latent-pantheon town shows the generic teaser and NEVER a deity name', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    const { container } = render(<WarFaithTab settlement={latentPantheonTown()} saveId={null} />);
    expect(screen.getByTestId('war-faith-tab')).toBeTruthy();
    // The gated faith surface degrades to the generic true-neutral teaser.
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(screen.queryByTestId('faith-section')).toBeNull();
    // No live campaign ⇒ no war block.
    expect(screen.queryByTestId('war-block')).toBeNull();
    // THE non-negotiable guarantee: no latent deity / cult name reaches the DOM.
    expect(container.textContent).not.toContain(LATENT_NAME);
    expect(container.textContent).not.toContain('Whispering Ash');
    expect(container.textContent).toMatch(/no single creed holds sway/i);
  });

  it('FREE + a latent-pantheon town also shows only the teaser (never the latent name)', () => {
    useStore.__set({ auth: { tier: 'free' } });
    const { container } = render(<WarFaithTab settlement={latentPantheonTown()} saveId={null} />);
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(container.textContent).not.toContain(LATENT_NAME);
  });

  it('an owned/shared embed renders the read-only faith panel to everyone (a shared pantheon)', () => {
    // An anon viewer of a faith-active dossier legitimately sees the OWNED embed
    // (never the latent seed) — the same behaviour FaithSection guarantees.
    useStore.__set({ auth: { tier: 'anon' } });
    render(<WarFaithTab settlement={activePatronTown()} saveId={null} publicDossier />);
    expect(screen.getByTestId('faith-section')).toBeTruthy();
    expect(screen.getByTestId('faith-patron').textContent).toMatch(/Sunlord Aurelian/);
  });
});

describe('SubstrateTab — surfaces OUR 16-variable causal read-model', () => {
  it('renders the substrate grid for a settlement', () => {
    const { container } = render(<SubstrateTab settlement={{ name: 'Testburg', config: { size: 'town' } }} />);
    expect(screen.getByTestId('substrate-tab')).toBeTruthy();
    // The read-model yields the 16 system variables as rows.
    expect(container.querySelectorAll('[data-substrate-row]').length).toBeGreaterThan(0);
    expect(screen.getByTestId('substrate-pressures')).toBeTruthy();
  });
});

describe('MagicTab — 10-facet posture + magic-free dormancy', () => {
  it('renders the envelope facets + roles for a magical settlement', () => {
    const { container } = render(<MagicTab settlement={{ config: { magicLevel: 'moderate' } }} />);
    expect(screen.getByTestId('magic-tab')).toBeTruthy();
    expect(container.querySelectorAll('[data-facet]').length).toBe(6);
    expect(screen.getByTestId('magic-roles')).toBeTruthy();
  });

  it('is DORMANT for a magic-free world — honest, not fabricated (no facets)', () => {
    const { container } = render(<MagicTab settlement={{ config: { magicExists: false } }} />);
    expect(screen.getByTestId('magic-tab')).toBeTruthy();
    // Dormancy law: no fabricated envelope for a dead-magic world.
    expect(container.querySelectorAll('[data-facet]').length).toBe(0);
    expect(container.textContent).toMatch(/does not function/i);
  });

  it('surfaces the deity⇄magic-legality coupling when a MAJOR deity regulates', () => {
    const settlement = { config: { magicLevel: 'moderate', primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major' } } };
    render(<MagicTab settlement={settlement} />);
    expect(screen.getByTestId('magic-deity-coupling').textContent).toMatch(/magic legality/i);
  });
});
