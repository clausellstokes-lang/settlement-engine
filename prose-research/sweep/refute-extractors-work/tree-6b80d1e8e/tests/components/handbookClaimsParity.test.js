/**
 * tests/components/handbookClaimsParity.test.js — HANDBOOK ↔ ENGINE claims parity
 * (C3-experience findings 1 + 9, bar-90 "every claim demonstrable on demand").
 *
 * The Keeper's Handbook (src/components/HowToUse.jsx) makes the product's most
 * concrete mechanical claims — slider interactions, neighbour-relationship
 * effects, stress stacking — yet until this guard the only HowToUse test
 * asserted TAB RENDERING. Pricing, founding-seeds, and tier facts are
 * parity-bound; this binds the higher-claim prose the same way:
 *
 *   • the relationship-type roster in prose  ⟷  REL_DYNAMICS keys
 *   • Rival / Patron / Cold War effect prose ⟷  economy modes, military bias,
 *     and the live faction-label generators (the Cold War line used to promise
 *     "intelligence NPCs"; the engine mints intelligence FACTIONS — fixed and
 *     pinned here so the class cannot silently return)
 *   • slider-interaction prose               ⟷  the priorityHelpers mechanisms,
 *     bound by DIRECTION (>= / <=) not by numerals, so tuning the thresholds
 *     does not flake this test but flipping a mechanism's direction does
 *   • "multiple stresses compound"           ⟷  a real pipeline forge carrying
 *     famine + politically_fractured simultaneously
 *
 * CANNOT-CATCH: rewordings that keep the bound tokens while changing meaning;
 * the "DM Summary names the compound condition" sentence (the Active Crisis
 * line LISTS every active stress — verified by hand 2026-07-21 — but no single
 * compound-name table exists to bind); claims made on surfaces other than
 * HowToUse.jsx. Residual coverage: tests/generators/flagshipCoherence.test.js
 * probes the conceptIntro's flagship coherence bundle end-to-end.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  REL_DYNAMICS,
  getMirrorFactionLabel,
} from '../../src/generators/neighbourGenerator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf-8');
const handbook = read('src/components/HowToUse.jsx');
const helpers = read('src/generators/priorityHelpers.js');

const titleize = (k) => k.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

describe('Keeper’s Handbook ↔ engine claims parity', () => {
  it('the prose relationship roster is exactly the engine’s linkable REL_DYNAMICS set', () => {
    const linkable = Object.keys(REL_DYNAMICS).filter((k) => k !== 'neutral');
    expect(linkable.sort()).toEqual(
      ['allied', 'client', 'cold_war', 'hostile', 'patron', 'rival', 'trade_partner'].sort(),
    );
    for (const k of linkable) {
      expect(handbook, `handbook must name the ${k} relationship`).toContain(titleize(k));
    }
  });

  it('Rival: compete-economy + military hardening are real; the struck "elevates criminal presence" drift stays out', () => {
    expect(REL_DYNAMICS.rival.economyMode).toBe('compete');
    expect(REL_DYNAMICS.rival.militaryBias).toBeGreaterThan(0);
    expect(handbook).toMatch(/Rival crowds into the same export markets/);
    // The engine has NO rival→criminal-presence knob (REL_DYNAMICS carries
    // economyMode/govMirrorW/govAntithesisW/militaryBias only) — the old prose
    // claim drifted and was struck (C3 finding 1). Keep it out.
    expect(handbook).not.toMatch(/elevates criminal presence/);
    // "embedded agents and saboteur factions" ⟷ the live rival faction labels.
    expect(getMirrorFactionLabel('military', 'rival', 'X')).toMatch(/Intelligence Agents \(embedded\)/);
    expect(getMirrorFactionLabel('criminal', 'rival', 'X')).toMatch(/Saboteurs/);
  });

  it('Patron: the dependency-chain claim rides the dependent economy mode', () => {
    expect(REL_DYNAMICS.patron.economyMode).toBe('dependent');
    expect(handbook).toMatch(/Patron creates dependency chains/);
  });

  it('Cold War: clandestine intelligence FACTIONS — never "intelligence NPCs" (finding 9)', () => {
    expect(handbook).not.toMatch(/intelligence NPCs/);
    expect(handbook).toMatch(/Cold War seeds clandestine intelligence factions/);
    expect(getMirrorFactionLabel('military', 'cold_war', 'X')).toMatch(/Deep Cover Operatives/);
    expect(getMirrorFactionLabel('criminal', 'cold_war', 'X')).toMatch(/Clandestine Network/);
  });

  it('slider-interaction prose maps to real mechanisms with the promised DIRECTION', () => {
    // "High Religion + low Magic triggers heresy suppression"
    expect(handbook).toMatch(/High Religion \+ low Magic triggers heresy suppression/);
    expect(helpers).toMatch(/heresyCond\s*=\s*pri\.religion >= \d+ && pri\.magic <= \d+/);
    // "High Criminal + low Military enables shadow governance"
    expect(handbook).toMatch(/High Criminal \+ low Military enables shadow governance/);
    expect(helpers).toMatch(/crimeGovtCond = flags\.criminalEffective >= \d+ && flags\.militaryEffective <= \d+/);
  });

  it('multiple stresses genuinely stack in one settlement (the "stresses compound" claim)', () => {
    const s = generateSettlementPipeline(
      {
        settType: 'town', culture: 'germanic', terrain: 'grassland',
        tradeRouteAccess: 'road', monsterThreat: 'civilized',
        stressTypes: ['famine', 'politically_fractured'],
      },
      null,
      { seed: 'handbook-compound-1', customContent: {} },
    );
    // `stress` may be a SINGLE OBJECT, not an array (chronicle snapshot-shape
    // hazard) — normalize before reading.
    const entries = Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [];
    const types = new Set(entries.map((e) => e?.type));
    expect(types.has('famine'), 'forced famine must confirm').toBe(true);
    expect(types.has('politically_fractured'), 'forced fracture must confirm').toBe(true);
  });
});
