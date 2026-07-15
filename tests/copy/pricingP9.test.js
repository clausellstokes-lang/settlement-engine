/**
 * tests/copy/pricingP9.test.js — UX Phase 9 funnel copy contract.
 *
 * The load-bearing invariants for the About + funnel rewrite:
 *
 *   - NO SIZE AS PREMIUM: size shipped FREE (free accounts reach metropolis).
 *     The simulation-led pricing variant + the value ladder must name the
 *     SIMULATION (advance time / campaigns / war / pantheon / chronicle) and
 *     must NOT pitch size / metropolis / capital as a PREMIUM feature. The free
 *     rung must explicitly include full-size generation.
 *   - A/B SEAM: both pricing variants are selectable behind the experiment flag;
 *     the storage/saves line stays present as a SECONDARY bullet either way.
 *   - VALUE LADDER: three rungs (tries / saves / simulates), lens-labeled.
 *   - FOOTER LINKS: About / Pricing / Compendium / Gallery / legal restored.
 *   - NEW PRICING MOMENTS: the simulation-intent moments resolve copy.
 */

import { describe, it, expect } from 'vitest';
import { tx, t, en } from '../../src/copy/index.js';
import { COPY } from '../../src/copy/strings.js';

// Words that would mean "we're selling SIZE as premium". Used to scan the
// simulation-led premium copy.
const SIZE_AS_PREMIUM = /\b(metropolis|capital|capital size|every size|larger size|up to .* size)\b/i;
// Words that mean we're selling the SIMULATION.
const SIMULATION_WORDS = /\b(advance time|simulation|campaign|war|pantheon|chronicle|the region)\b/i;

describe('no size as premium — simulation-led pricing variant', () => {
  it('the Cartographer variant features name the simulation, never size', () => {
    const features = tx('pricing.variant.tiers.cartographer.features') || [];
    expect(features.length).toBeGreaterThan(0);
    const joined = features.join(' | ');
    expect(joined).toMatch(SIMULATION_WORDS);
    expect(joined).not.toMatch(SIZE_AS_PREMIUM);
  });

  it('the Cartographer variant tagline leads with the simulation and not size', () => {
    const tagline = t('pricing.variant.tiers.cartographer.tagline');
    expect(tagline.toLowerCase()).toContain('region');
    expect(tagline).not.toMatch(SIZE_AS_PREMIUM);
  });

  it('the variant page subtitle is the simulation thesis (no size)', () => {
    const sub = t('pricing.variant.pageSubtitle');
    expect(sub.toLowerCase()).toContain('region');
    expect(sub).not.toMatch(SIZE_AS_PREMIUM);
  });

  it('the CURRENT (non-variant) Cartographer features also drop "capital size"', () => {
    // Even the legacy copy should no longer pitch capital size — size is free.
    const features = tx('pricing.tiers.cartographer.features') || [];
    const joined = features.join(' | ');
    expect(joined).not.toMatch(/capital size/i);
  });
});

describe('the free rung explicitly includes full-size generation', () => {
  it('the Wanderer (free) features include any-size / full-size generation', () => {
    const features = tx('pricing.tiers.wanderer.features') || [];
    const joined = features.join(' | ').toLowerCase();
    expect(joined).toMatch(/any size|hamlet through metropolis|full size/);
  });

  it('the variant free rung states full-size generation is free', () => {
    const features = tx('pricing.variant.tiers.wanderer.features') || [];
    const joined = features.join(' | ').toLowerCase();
    expect(joined).toMatch(/any size|metropolis|full size/);
    expect(joined).toContain('free');
  });

  it('the value-ladder free rung body names full-size generation', () => {
    const body = t('valueLadder.rungs.saves.body').toLowerCase();
    expect(body).toMatch(/any size|hamlet through metropolis|full size/);
  });
});

describe('A/B seam — storage stays a secondary bullet either way', () => {
  it('the simulation variant keeps a saves/storage line (secondary bullet)', () => {
    const features = tx('pricing.variant.tiers.cartographer.features') || [];
    const joined = features.join(' | ').toLowerCase();
    expect(joined).toMatch(/saves|cloud sync|storage/);
    // …but the saves line must NOT be the lead — the first feature is the sim.
    expect(features[0].toLowerCase()).toMatch(SIMULATION_WORDS);
  });

  it('both variants exist + are distinct (the flag has something to select)', () => {
    const current = tx('pricing.tiers.cartographer.features') || [];
    const variant = tx('pricing.variant.tiers.cartographer.features') || [];
    expect(current.length).toBeGreaterThan(0);
    expect(variant.length).toBeGreaterThan(0);
    expect(JSON.stringify(current)).not.toBe(JSON.stringify(variant));
  });
});

describe('value ladder — three lens-labeled rungs', () => {
  it('has tries / saves / simulates rungs each with eyebrow + tier + body', () => {
    for (const rung of ['tries', 'saves', 'simulates']) {
      expect(t(`valueLadder.rungs.${rung}.eyebrow`).length).toBeGreaterThan(0);
      expect(t(`valueLadder.rungs.${rung}.tier`).length).toBeGreaterThan(0);
      expect(t(`valueLadder.rungs.${rung}.body`).length).toBeGreaterThan(0);
    }
  });

  it('the premium "simulates" rung names the simulation, not size', () => {
    const body = t('valueLadder.rungs.simulates.body');
    expect(body).toMatch(SIMULATION_WORDS);
    expect(body).not.toMatch(SIZE_AS_PREMIUM);
  });

  it('has a lens-labeled headline for each reader archetype', () => {
    for (const lens of ['new', 'intermediate', 'worldbuilder']) {
      expect(t(`valueLadder.lens.${lens}`).length).toBeGreaterThan(0);
    }
  });
});

describe('About — The Living World tab copy', () => {
  it('exposes the landing thesis (generate a town, then run the region)', () => {
    expect(t('aboutLiving.thesis').toLowerCase()).toContain('region');
    expect(t('aboutLiving.thesis').toLowerCase()).toContain('town');
  });

  it('has a claim + coherence line + qualifier for each premium system', () => {
    const systems = tx('aboutLiving.systems') || {};
    const keys = Object.keys(systems);
    expect(keys).toEqual(expect.arrayContaining(['advanceTime', 'war', 'pantheon', 'chronicle']));
    for (const k of keys) {
      expect(t(`aboutLiving.systems.${k}.title`).length).toBeGreaterThan(0);
      expect(t(`aboutLiving.systems.${k}.claim`).length).toBeGreaterThan(0);
      expect(t(`aboutLiving.systems.${k}.coherence`).length).toBeGreaterThan(0);
    }
    // The opt-in / off-by-default / reversible qualifier.
    const q = t('aboutLiving.qualifier').toLowerCase();
    expect(q).toContain('off by default');
    expect(q).toContain('reversible');
  });
});

describe('AuthModal blurb leads with the simulation (size on the free line)', () => {
  it('premium blurb names the simulation, not size', () => {
    const body = t('authBlurb.premiumBody');
    expect(body).toMatch(SIMULATION_WORDS);
    expect(body).not.toMatch(SIZE_AS_PREMIUM);
  });
  it('free blurb is where full-size generation lives', () => {
    const body = t('authBlurb.freeBody').toLowerCase();
    expect(body).toMatch(/any size|metropolis|full size/);
  });
});

describe('footer links restored', () => {
  it('exposes About / Pricing / Compendium / Gallery / legal footer keys', () => {
    for (const key of ['about', 'pricing', 'compendium', 'gallery', 'contact', 'privacy', 'terms']) {
      expect(typeof en.footer[key]).toBe('string');
      expect(en.footer[key].length).toBeGreaterThan(0);
    }
  });
});

describe('new simulation-intent pricing moments resolve copy', () => {
  it('the new moments exist in the canonical registry (strings.js)', () => {
    for (const reason of ['first_advance_attempt', 'war_layer_curiosity', 'pantheon_preview']) {
      const m = COPY.pricing.moments[reason];
      expect(m, reason).toBeDefined();
      expect(m.headline.length).toBeGreaterThan(0);
      expect(m.body.length).toBeGreaterThan(0);
      // …and they name the simulation, not size.
      expect(`${m.headline} ${m.body}`).not.toMatch(SIZE_AS_PREMIUM);
    }
  });

  it('map_realm_teaser is the canonical realm-unlock moment (single surface)', () => {
    const m = COPY.pricing.moments.map_realm_teaser;
    expect(m).toBeDefined();
    expect(`${m.headline} ${m.body}`).toMatch(SIMULATION_WORDS);
  });
});

describe('pricingPitch no longer sells size as premium', () => {
  it('Cartographer audience lines name the simulation, not size', () => {
    for (const lens of ['lineNew', 'lineIntermediate', 'lineWorldbuilder']) {
      const line = t(`pricingPitch.cartographer.${lens}`);
      expect(line).not.toMatch(SIZE_AS_PREMIUM);
    }
  });
});
