/** @vitest-environment jsdom */
/**
 * FaithSection — Phase 4 W-F6 dossier faith surface + THE PREMIUM GATE.
 *
 * Pins the three tier modes and, most importantly, the non-negotiable privacy
 * guarantee: a FREE / ANON render of a settlement that carries a latent pantheon
 * must NEVER name a latent deity (the surface reads faithProfile / embeds only,
 * never config.latentPantheon).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Mock the store; each test sets what useStore returns.
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
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import FaithSection from '../../src/components/settlement/FaithSection.jsx';
import { recordPatronFall } from '../../src/domain/worldPulse/patronFall.js';

// A distinctive latent-deity name — if it ever appears in a free render, the
// privacy gate has failed.
const LATENT_NAME = 'Zzyraxil the Unnamed';

function latentOnly() {
  return { config: { latentPantheon: { patron: { name: LATENT_NAME, _deityRef: 'deity:core:zzyraxil' }, cults: [{ name: 'The Whispering Ash' }] } } };
}

function activePatron() {
  return { config: { primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun', alignmentAxis: 'good' } } };
}

function livePantheon() {
  return {
    config: {
      primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun', alignmentAxis: 'good' },
      faithProfile: {
        patron: { name: 'Sunlord Aurelian', deityRef: 'deity:core:sun', share: 62, legitimacy: 0.82 },
        deities: [
          { deityRef: 'deity:core:sun', name: 'Sunlord Aurelian', share: 62, standing: 'ascendant', legitimacy: 0.82, isPatron: true },
          { deityRef: 'deity:core:ash', name: 'Ashmother', share: 24, standing: 'established', legitimacy: 0.28, isPatron: false },
        ],
        contested: false, patronSecurity: 0.72, unaffiliated: 14,
        piety: {
          local01: 0.4, structuralTarget: 0.56, localMult: 1.12, realmMult: 1.0, composite: 1.12, moralMult: 1.12,
          clergyIntegrity: 0.7,
          causes: [
            { source: 'religious_authority', value: 0.5 },
            { source: 'institutions', value: 0.6 },
            { source: 'devotion', value: 0.42 },
            { source: 'clergy_distortion', value: 0.3 },
            { source: 'conduct_drift', value: 0.22 },
          ],
          dampener: { megaphoneCombined: 1, megaphoneMoral: 1, megaphoneLaw: 1, dLaw: 0, dMoral: 0, rivals: [] },
        },
      },
    },
    powerStructure: { government: 'theocracy', publicLegitimacy: { score: 60 } },
  };
}

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('FaithSection — tier gating', () => {
  it('ANON + a latent pantheon renders the generic teaser and NEVER names a latent deity', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    const { container } = render(<FaithSection settlement={latentOnly()} />);
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(screen.queryByTestId('faith-section')).toBeNull();
    // THE non-negotiable guarantee: no latent deity / cult name reaches the DOM.
    expect(container.textContent).not.toContain(LATENT_NAME);
    expect(container.textContent).not.toContain('Whispering Ash');
    // The generic true-neutral line is present.
    expect(container.textContent).toMatch(/no single creed holds sway/i);
  });

  it('FREE + a latent pantheon also renders the teaser (never the latent name)', () => {
    useStore.__set({ auth: { tier: 'free' } });
    const { container } = render(<FaithSection settlement={latentOnly()} />);
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(container.textContent).not.toContain(LATENT_NAME);
  });

  it('a public dossier (readOnly, no owner) hides the upsell but keeps the generic line', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    const { container } = render(<FaithSection settlement={latentOnly()} publicDossier />);
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(container.textContent).toMatch(/no single creed holds sway/i);
    expect(container.textContent).not.toMatch(/Awaken the pantheon/i);
  });

  it('PREMIUM + a latent-only settlement (activation not fired) renders nothing — never the latent name', () => {
    useStore.__set({ auth: { tier: 'premium' } });
    const { container } = render(<FaithSection settlement={latentOnly()} />);
    expect(container.firstChild).toBeNull();
    expect(container.textContent).not.toContain(LATENT_NAME);
  });

  it('an active patron renders the READ-ONLY panel to EVERYONE (a shared premium pantheon)', () => {
    // Anon viewer of a shared, faith-active dossier still sees the full panel.
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithSection settlement={activePatron()} publicDossier />);
    expect(screen.getByTestId('faith-section')).toBeTruthy();
    expect(screen.getByTestId('faith-patron').textContent).toMatch(/Sunlord Aurelian/);
    expect(screen.getByTestId('faith-patron').textContent).toMatch(/lawful/);
  });
});

describe('FaithSection — the live faith panel + cause chains as sentences', () => {
  it('renders the piety arc, pantheon standings, unaffiliated share, mandate, and cause sentences', () => {
    useStore.__set({ auth: { tier: 'premium' } });
    const { container } = render(<FaithSection settlement={livePantheon()} />);
    // Piety arc: rising (local01 0.40 → target 0.56).
    const piety = screen.getByTestId('faith-piety');
    expect(piety.textContent).toMatch(/rising/i);
    // Amplifier receipt (composite 1.12 > 1.05).
    expect(piety.textContent).toMatch(/amplified ×1\.12/);
    // Pantheon standings with both creeds + legitimacy bands.
    const standings = screen.getByTestId('pantheon-standings');
    expect(standings.textContent).toMatch(/Sunlord Aurelian/);
    expect(standings.textContent).toMatch(/Ashmother/);
    expect(standings.textContent).toMatch(/secure/);   // 0.82 legitimacy
    // LEGIBILITY LAW: the 0..1 legitimacy scalar reads as what it measures — a
    // creed's rightful claim — not as the engine's field name.
    expect(standings.textContent).toMatch(/rightful claim 82%/);
    expect(standings.textContent).not.toMatch(/legitimacy/i);
    expect(standings.textContent).toMatch(/14% keep no god/);
    // Cause chains as sentences (legibility law).
    expect(container.textContent).toMatch(/no longer lives like its god/i);   // conduct_drift
    expect(container.textContent).toMatch(/compromised priesthood/i);          // clergy scandal
    expect(container.textContent).toMatch(/Crisis calls the faithful home/i);  // revival (rising + unaffiliated)
    // Divine mandate line (theocracy).
    expect(container.textContent).toMatch(/[Dd]ivine mandate/);
  });

  it('a live realm term names WHICH faith is carrying the amplification, in words', () => {
    // realmMult ≠ 1 (a campaign with faith spread) is the branch that used to
    // print the two raw factors as "(local ×1.05, realm ×1.25)".
    const s = livePantheon();
    Object.assign(s.config.faithProfile.piety, { localMult: 1.05, realmMult: 1.25, composite: 1.31 });
    useStore.__set({ auth: { tier: 'premium' } });
    render(<FaithSection settlement={s} />);

    const piety = screen.getByTestId('faith-piety');
    expect(piety.textContent).toMatch(/Mostly the faith of the wider realm\./);
    expect(piety.textContent).not.toMatch(/local ×/);
    expect(piety.textContent).not.toMatch(/realm ×/);
  });

  it('WF-1E A6 · a lit patron fall renders as the FIRST cause sentence, and a dark panel renders none', () => {
    useStore.__set({ auth: { tier: 'premium' } });
    // THE RING RECORD IS BUILT BY ITS REAL WRITER, never hand-mirrored: a fixture that
    // retypes the deriver's own shape can never see a shape change (the recorded
    // fixture-mirrors-deriver vacuity class).
    const ring = {};
    recordPatronFall(ring, { ref: 'deity:core:ash', cause: 'suppressed', atTick: 12 });
    expect(ring.patronFalls).toHaveLength(1);

    const litSettlement = livePantheon();
    litSettlement.config.faithProfile.patronFall = ring.patronFalls[0];
    const { container } = render(<FaithSection settlement={litSettlement} />);

    // THE POSITIVE CONTROLS: the panel really mounted and the cause-chain block really
    // rendered its SIBLING sentences in this same render. Without them a "the sentence is
    // absent" arm below would pass over a component that never rendered at all — the
    // rendered-surface-negative second vacuity.
    expect(screen.getByTestId('faith-section')).toBeTruthy();
    expect(container.textContent).toMatch(/no longer lives like its god/i);
    expect(container.textContent).toMatch(/Crisis calls the faithful home/i);
    // The fall sentence is in the DOM, inside the cause-chain block that holds those siblings.
    expect(container.textContent).toMatch(/The patron fell — suppressed: the creed was driven from its seat by force/);
    // AND IT LEADS: a seat changing hands outranks devotion-drift lines, so it renders FIRST
    // inside the block. Ordering is the claim — compare positions, not mere presence.
    const fallAt = container.textContent.indexOf('The patron fell —');
    const driftAt = container.textContent.search(/no longer lives like its god/i);
    const sinkAt = container.textContent.search(/Crisis calls the faithful home/i);
    expect(fallAt).toBeGreaterThan(-1);
    expect(fallAt).toBeLessThan(driftAt);
    expect(fallAt).toBeLessThan(sinkAt);
    // No deity slug or ref reaches the rendered panel — the line names the act, not the creed.
    // anchored: the fall sentence was just asserted present in this same rendered DOM, so the panel demonstrably rendered and this absence is the ref really being withheld
    expect(container.textContent).not.toContain('deity:core:ash');

    cleanup();
    // THE DARK ARM: the identical panel with no projected patronFall renders no fall line,
    // while its sibling cause sentences still render — the fence, not an empty surface.
    const { container: dark } = render(<FaithSection settlement={livePantheon()} />);
    expect(dark.textContent).toMatch(/no longer lives like its god/i);
    // anchored: the sibling cause sentence one line up proves the cause-chain block rendered in THIS dark render too, so the absence below is the fence holding
    expect(dark.textContent).not.toMatch(/The patron fell/);
  });

  it('a freshly-activated settlement (embeds, no faithProfile yet) shows the day-one static state', () => {
    useStore.__set({ auth: { tier: 'premium' } });
    const { container } = render(<FaithSection settlement={activePatron()} />);
    expect(screen.getByTestId('faith-section')).toBeTruthy();
    expect(screen.queryByTestId('pantheon-standings')).toBeNull();
    expect(container.textContent).toMatch(/only just taken root/i);
  });
});
