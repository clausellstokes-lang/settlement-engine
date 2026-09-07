/**
 * mapDressResolver.test.js — THE SEASON / STATE / FESTIVAL PORTRAIT RESOLVER
 * (src/domain/townMap/mapDress.js).
 *
 * ⚰⭐ WHAT THIS FILE USED TO BE, AND WHY IT IS STILL HERE (ODQ §725/§772). It was
 * `townMapSeasonDress.test.js`, and two thirds of it pinned the GROUND-DRESS MARKS the
 * legacy settlement map drew from this resolver's output — dormancy at unit strength, the
 * season swaps, the DRESS_CAP budget, the accessible lens staying dress-free. Those marks
 * left with the draw stack and their pins went with them.
 *
 * THE RESOLVER DID NOT LEAVE, and it is not dormant: the retained town-scene living layer
 * reads it (`domain/townScene/sceneLiving.js`), so the derivation below is live product
 * behaviour, not residue. Renamed for what it actually tests. Its contract:
 *   • SEASON   — from `worldState.calendar`, bounded and lowercased; absent ⇒ null.
 *   • SEVERITY — re-derived from the seeded verdict, never persisted; no seed ⇒ null.
 *   • STATE    — scars ⇒ worst severity, rebirths ⇒ deduped sorted classes, a deployment
 *                targeting the settlement ⇒ besieged. Each read dormant-absent.
 *   • FESTIVAL — the grandest in-window, unsuppressed observance from the traditions mirror.
 *   • THE PIN  — a saved `seasonOverride` wins over the live clock for the season LABEL only.
 *   • DORMANCY — nothing to dress ⇒ null, which is what every caller relies on.
 */
import { describe, expect, it } from 'vitest';

import { resolveMapDress } from '../../src/domain/townMap/mapDress.js';
import { seasonalSeverityFor } from '../../src/domain/worldPulse/seasons.js';

describe('season dress — resolveMapDress (the season source)', () => {
  it('null / calendar-less worldState ⇒ null (seasonless base, the dormancy source)', () => {
    expect(resolveMapDress({ id: 's1' }, null)).toBeNull();
    expect(resolveMapDress({ id: 's1' }, {})).toBeNull();
    expect(resolveMapDress({ id: 's1' }, { calendar: {} })).toBeNull();
    expect(resolveMapDress({ id: 's1' }, { calendar: { season: 'nonsense' } })).toBeNull();
  });

  it('derives season from the calendar + severity from the seeded verdict', () => {
    const worldState = { rngSeed: 'seed-xyz', calendar: { season: 'Winter', year: 4 } };
    const dress = resolveMapDress({ id: 's7' }, worldState);
    expect(dress).not.toBeNull();
    expect(dress.season).toBe('winter'); // lowercased, bounded
    expect(dress.severity).toBe(seasonalSeverityFor('seed-xyz', 4, 's7')); // exact seeded match
  });

  it('no rngSeed / no id ⇒ season only, severity null', () => {
    expect(resolveMapDress({ id: 's7' }, { calendar: { season: 'summer', year: 2 } }).severity).toBeNull();
    expect(resolveMapDress(null, { rngSeed: 'x', calendar: { season: 'summer', year: 2 } }).severity).toBeNull();
  });
});

describe('state dress (IT3-b) — resolveMapDress wires the reads', () => {
  it('SCARS — urbanFabric.scars ⇒ state.scarLevel = the worst severity', () => {
    const settlement = { id: 's9', urbanFabric: { scars: [{ kind: 'siege_repairs', severity: 0.4, week: 10 }, { kind: 'lean_years', severity: 0.8, week: 12 }] } };
    const d = resolveMapDress(settlement, null);
    expect(d).not.toBeNull();
    expect(d.state.scarLevel).toBe(0.8);
  });

  it('REBIRTH — urbanFabric.rebirths ⇒ state.rebuiltCategories (deduped, sorted)', () => {
    const settlement = { id: 's9', urbanFabric: { rebirths: [{ classes: ['market', 'civic'], type: 'fire', week: 8 }, { classes: ['civic'], type: 'flood', week: 9 }] } };
    const d = resolveMapDress(settlement, null);
    expect(d.state.rebuiltCategories).toEqual(['civic', 'market']);
  });

  it('SIEGE — a deployment targeting the settlement ⇒ state.besieged', () => {
    const worldState = { deployments: { enemyTown: { targetId: 's9' } } };
    const d = resolveMapDress({ id: 's9' }, worldState);
    expect(d.state.besieged).toBe(true);
    // a settlement NOT targeted ⇒ not besieged
    expect(resolveMapDress({ id: 'other' }, worldState)).toBeNull();
  });
});

describe('season override (IT3-c) — the pin wins over the live clock', () => {
  it('a mapEdits.seasonOverride overrides the live calendar season', () => {
    const settlement = { id: 's9', mapEdits: { seasonOverride: 'winter' } };
    const worldState = { rngSeed: 'x', calendar: { season: 'summer', year: 2 } };
    expect(resolveMapDress(settlement, worldState).season).toBe('winter');   // pin wins
    // severity still derives from the LIVE year (the pin fixes the season LABEL, not the year)
    expect(resolveMapDress(settlement, worldState).severity)
      .toBe(seasonalSeverityFor('x', 2, 's9'));
  });

  it('a pinned season paints even with NO campaign (severity null)', () => {
    const settlement = { id: 's9', mapEdits: { seasonOverride: 'autumn' } };
    const d = resolveMapDress(settlement, null);
    expect(d).not.toBeNull();
    expect(d.season).toBe('autumn');
    expect(d.severity).toBeNull();
  });

  it('an absent / invalid override falls back to the live clock (dormancy)', () => {
    expect(resolveMapDress({ id: 's9', mapEdits: { seasonOverride: 'nonsense' } }, { calendar: { season: 'summer', year: 1 } }).season).toBe('summer');
    expect(resolveMapDress({ id: 's9' }, null)).toBeNull();  // no pin, no clock ⇒ seasonless
  });
});

describe('festival dress (Wave C, §10) — the resolver reads the traditions mirror', () => {
  it('resolveMapDress reads the traditions mirror: an in-window observance ⇒ festival, out-of-window ⇒ none', () => {
    // elapsedWeeks 3 ⇒ weekOfYear 4. A rite whose window opens week 4 is OPEN; one at week 30 is not.
    const inWindow = { window: { startWeekOfYear: 4, weeks: 1 }, scaleBand: 5, suppressedBy: null };
    const outWindow = { window: { startWeekOfYear: 30, weeks: 1 }, scaleBand: 5, suppressedBy: null };
    const worldState = { calendar: { season: 'spring', year: 1, elapsedWeeks: 3 } };
    const open = resolveMapDress({ id: 's1', traditions: [inWindow] }, worldState);
    expect(open.festival).not.toBeNull();
    expect(open.festival.scale).toBe(5);
    expect(resolveMapDress({ id: 's1', traditions: [outWindow] }, worldState).festival).toBeNull();
    // a SUPPRESSED rite does not occur ⇒ no festival even in its window
    const suppressed = { window: { startWeekOfYear: 4, weeks: 1 }, scaleBand: 5, suppressedBy: { overlordId: 'o', sinceYear: 1 } };
    expect(resolveMapDress({ id: 's1', traditions: [suppressed] }, worldState).festival).toBeNull();
    // the GRANDEST in-window observance sets the scale
    const two = resolveMapDress({ id: 's1', traditions: [{ window: { startWeekOfYear: 4, weeks: 2 }, scaleBand: 2 }, inWindow] }, worldState);
    expect(two.festival.scale).toBe(5);
  });
});
