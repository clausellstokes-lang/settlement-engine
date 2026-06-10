/**
 * tests/joins/services.test.js — Wave 3 slice: services lookup precedence,
 * LOCALE_SERVICE_OVERRIDES target integrity, and the defence-services bucket.
 *
 * Join contract under test:
 *   - getServicesForInstitution resolves a dedicated INSTITUTION_SERVICES
 *     entry (exact name, case-insensitive) BEFORE the legacy override table,
 *     so an institution with its own service set always surfaces that set.
 *   - LOCALE_SERVICE_OVERRIDES is fallback-only: every row must point at a
 *     real INSTITUTION_SERVICES key, and no row may shadow a dedicated entry.
 *   - 'Defence services' (Garrison) is employment, not criminal: a lawful,
 *     well-garrisoned settlement keeps its defence service on every seed.
 */
import { describe, it, expect } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/generators/rngContext.js';
import { createPRNG } from '../../src/generators/prng.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { LOCALE_SERVICE_OVERRIDES } from '../../src/data/servicesData.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';

const KEYS_LC = new Map(Object.keys(INSTITUTION_SERVICES).map((k) => [k.toLowerCase(), k]));

const SEEDS = Array.from({ length: 25 }, (_, i) => `services-join-${i}`);

/** Run generateAvailableServices under a seeded PRNG (deterministic per seed). */
function servicesWithSeed(seed, tier, institutions, config) {
  setActiveRng(createPRNG(seed));
  try {
    return generateAvailableServices(tier, institutions, {}, config);
  } finally {
    clearActiveRng();
  }
}

/** Flatten all bucket entries into [{name, institution, bucket}]. */
function allEntries(buckets) {
  return Object.entries(buckets).flatMap(([bucket, list]) =>
    list.map((e) => ({ ...e, bucket }))
  );
}

// ── Join harness: override table integrity ──────────────────────────────────

describe('LOCALE_SERVICE_OVERRIDES join integrity', () => {
  it('every override target exists as an INSTITUTION_SERVICES key', () => {
    const dangling = Object.entries(LOCALE_SERVICE_OVERRIDES)
      .filter(([, target]) => !INSTITUTION_SERVICES[target])
      .map(([src, target]) => `${src} -> ${target}`);
    expect(dangling).toEqual([]);
  });

  it('no override row shadows a dedicated INSTITUTION_SERVICES entry', () => {
    // A dedicated entry wins at lookup time, so a shadowing row is dead
    // weight that silently rots — it must be deleted, not kept around.
    const shadowing = Object.keys(LOCALE_SERVICE_OVERRIDES).filter((src) =>
      KEYS_LC.has(src.toLowerCase())
    );
    expect(shadowing).toEqual([]);
  });

  it('the absurd legacy redirects are gone and dedicated keys serve those institutions', () => {
    // Each of these used to redirect to an unrelated provider (airship docks,
    // inn, mill, blacksmith, alchemist, major port) while its own richer
    // service set sat unreachable.
    const migrated = [
      'teleportation circle', // was -> Airship
      'aqueduct or water system', // was -> Inn/Tavern
      'bakers (5-15)', // was -> Mill
      'carpenter (part-time)', // was -> Blacksmith
      'carpenters (5-15)', // was -> Blacksmith
      'apothecary', // was -> Alchemist
      'shipyard', // was -> Major Port
    ];
    for (const src of migrated) {
      expect(LOCALE_SERVICE_OVERRIDES[src], `${src} should have no override row`).toBeUndefined();
      expect(KEYS_LC.has(src), `${src} should have a dedicated INSTITUTION_SERVICES entry`).toBe(true);
    }
  });
});

// ── Behavior: dedicated entry wins over legacy redirect / fuzzy match ───────

describe('dedicated INSTITUTION_SERVICES entry wins the lookup', () => {
  // tier 'village' + settType village keeps the synthetic town+ informal-crime
  // injection out of the buckets so every surfaced entry traces to the
  // institution under test.
  const CONFIG = { settType: 'village', magicExists: true, priorityCriminal: 8, priorityMilitary: 70 };

  const CASES = [
    // [institution, category, service names that the LEGACY redirect offered]
    ['Teleportation circle', 'Magic', ['Aerial reconnaissance', 'Cargo shipping', 'Passenger transport']],
    ['Aqueduct or water system', 'Infrastructure', ['Lodging', 'Gambling', 'Meals and drink', 'Hiring hall']],
    ['Bakers (5-15)', 'Crafts', ['Sawing timber', 'Grain milling', 'Fulling cloth']],
    ['Carpenters (5-15)', 'Crafts', ['Horseshoeing', 'Weapon creation', 'Tool repair']],
    ['Apothecary', 'Crafts', ['Poisons (discreet)', 'Potions and elixirs']],
    ['Shipyard', 'Economy', ['International shipping', 'Customs brokerage']],
  ];

  it.each(CASES)('%s surfaces only its own dedicated services', (name, category, legacyNames) => {
    const ownKeys = new Set(Object.keys(INSTITUTION_SERVICES[name]));
    for (const seed of SEEDS) {
      const buckets = servicesWithSeed(seed, 'village', [{ name, category }], { ...CONFIG });
      for (const entry of allEntries(buckets)) {
        expect(ownKeys.has(entry.name), `${name} offered foreign service '${entry.name}' (seed ${seed})`).toBe(true);
        expect(legacyNames).not.toContain(entry.name);
      }
    }
  });
});

// ── Behavior: defence services are not crime-gated ───────────────────────────

describe("Garrison 'Defence services' bucket and crime gate", () => {
  const INSTS = [{ name: 'Garrison', category: 'Defense' }];
  const CONFIG = { settType: 'town', priorityCriminal: 8, priorityMilitary: 70, magicExists: true };

  it('the fixture really is a low-crime, well-garrisoned town', () => {
    const flags = getInstFlags(CONFIG, INSTS);
    expect(flags.criminalEffective).toBeLessThan(38);
    expect(flags.militaryEffective).toBeGreaterThan(50);
  });

  it('a low-crime garrisoned town keeps Defence services on EVERY seed, under employment', () => {
    for (const seed of SEEDS) {
      const buckets = servicesWithSeed(seed, 'town', INSTS, { ...CONFIG });
      const defence = buckets.employment.find((e) => e.name === 'Defence services');
      expect(defence, `Defence services missing on seed ${seed}`).toBeTruthy();
      expect(defence.institution).toBe('Garrison');
      // And it must never surface under the Criminal Services header.
      expect(buckets.criminal.map((e) => e.name)).not.toContain('Defence services');
    }
  });

  it('genuinely criminal providers are still crime-gated in lawful settlements', () => {
    // The exemption is provider-scoped, not a removal of the gate: a thieves'
    // guild's illicit services still scale with criminal presence. At
    // criminalEffective ~7 the per-service keep chance is ~10%, so across 25
    // seeds the guild's full catalogue must NOT survive every time.
    const guild = [{ name: "Thieves' guild chapter", category: 'Criminal' }];
    const guildServiceCount = Object.keys(INSTITUTION_SERVICES["Thieves' guild chapter"]).length;
    let keptTotal = 0;
    for (const seed of SEEDS) {
      const buckets = servicesWithSeed(seed, 'town', guild, { ...CONFIG });
      keptTotal += allEntries(buckets).filter((e) => e.institution === "Thieves' guild chapter").length;
    }
    expect(keptTotal).toBeLessThan(guildServiceCount * SEEDS.length);
  });
});
