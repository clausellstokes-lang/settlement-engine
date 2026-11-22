/**
 * npcLadderCoherence.test.js — THE LADDER §4b faith-coherence pins
 * (DESIGN_THE_LADDER.md §4b PATRON DEITY).
 *
 * "A RELIGIOUS institution headed against its faith is a PERMANENT window (the high priest
 * of a god he does not follow cannot rest)." Coherence reuses the deity axes + the clergy
 * trait plane; the ladder consumes it as the faith-rupture window.
 */
import { describe, it, expect } from 'vitest';
import { faithCoherence, faithRuptured, COHERENCE_RUPTURE_THRESHOLD } from '../../src/domain/worldPulse/npcLadderCoherence.js';
import { openWindows } from '../../src/domain/worldPulse/npcLadderChallenge.js';

// A good-lawful patron deity, embedded as religionStates would carry it.
const worldWithPatron = {
  religionStates: { a: { patronRef: 'deity:sol', deities: { 'deity:sol': { snapshot: { alignmentAxis: 'good', lawAxis: 'lawful' } } } } },
};
const pious = { personality: { dominant: 'pious', flaw: 'humble', modifier: 'kind' } };
const cruel = { personality: { dominant: 'cruel', flaw: 'corrupt', modifier: 'ruthless' } };
const templeFaction = { name: 'Temple of Sol', category: 'religious' };
const guildFaction = { name: "Merchants' Guild", category: 'merchant' };

describe('faith coherence — the devotee vs the patron deity', () => {
  it('a pious head coheres with a good-lawful patron (high coherence, no rupture)', () => {
    const coh = faithCoherence(pious, worldWithPatron, 'a');
    expect(coh).not.toBeNull();
    expect(coh).toBeGreaterThan(COHERENCE_RUPTURE_THRESHOLD);
    expect(faithRuptured(pious, templeFaction, worldWithPatron, 'a')).toBe(false);
  });

  it('a cruel/corrupt head of a good god\'s temple is RUPTURED — the permanent window', () => {
    const coh = faithCoherence(cruel, worldWithPatron, 'a');
    expect(coh).toBeLessThan(COHERENCE_RUPTURE_THRESHOLD);
    expect(faithRuptured(cruel, templeFaction, worldWithPatron, 'a'), 'the high priest against his god cannot rest').toBe(true);
  });

  it('only RELIGIOUS factions rupture — a cruel merchant is not a faith rupture', () => {
    expect(faithRuptured(cruel, guildFaction, worldWithPatron, 'a')).toBe(false);
  });

  it('religion DARK (no patron / no religionStates) ⇒ coherence null, never ruptured (dark-safe)', () => {
    expect(faithCoherence(cruel, {}, 'a')).toBeNull();
    expect(faithCoherence(cruel, { religionStates: { a: {} } }, 'a')).toBeNull();
    expect(faithRuptured(cruel, templeFaction, {}, 'a')).toBe(false);
  });

  it('the faith rupture opens the faith_rupture window in openWindows (a stable, clean, performing head still falls)', () => {
    const strong = { nid: 'a:priest', npc: pious, standing: 9, stigma: false, grudgeVsDefender: 0, isChallenging: false, rungIndex: 0, rungCount: 3 };
    const ctx = { faction: templeFaction, factionRising: false, factionFalling: false, worldState: {} };
    // Without rupture the strong, clean, stable head has NO window.
    expect(openWindows(strong, ctx, false, false)).toEqual([]);
    // With the faith rupture, the window opens even though nothing else is wrong.
    expect(openWindows(strong, ctx, false, true)).toContain('faith_rupture');
  });
});
