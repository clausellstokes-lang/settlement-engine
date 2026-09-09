/**
 * deityNames.test.js — content-immersion-r2-4 / domain-display-readmodels-1.
 *
 * The shared deity-name resolver. A minted ref is deity:<scope>:<underscore_slug>,
 * so the old tail-pop returned only the LAST word ("War Father" → "Father"). The
 * floor now title-cases every slug token; the snapshot resolver recovers the
 * authored name (primary AND cult). The drift pin proves the two PUBLIC arc-line
 * producers (worldSnapshotPublic + realmArcSummary) resolve the SAME name.
 */
import { describe, it, expect } from 'vitest';
import { deityDisplayNameFromRef, deityNameFromSnapshots } from '../../src/domain/display/deityNames.js';
import { deityDisplayName } from '../../src/domain/display/pantheonDepth.js';
import { realmArcLines } from '../../src/domain/display/realmArcSummary.js';
import { serializeWorldSnapshotPublic } from '../../src/domain/display/worldSnapshotPublic.js';

describe('deityDisplayNameFromRef — the loss-minimizing floor', () => {
  it('a scoped multi-word minted ref keeps EVERY word (the bug: was "Father")', () => {
    expect(deityDisplayNameFromRef('deity:lu_a:war_father')).toBe('War Father');
  });
  it('the three-word case', () => {
    expect(deityDisplayNameFromRef('deity:lu_x:the_silent_queen')).toBe('The Silent Queen');
  });
  it('a legacy single-word ref is unchanged (the existing pins stay green)', () => {
    expect(deityDisplayNameFromRef('deity:Vael')).toBe('Vael');
    expect(deityDisplayNameFromRef('deity:Morr')).toBe('Morr');
  });
  it('a converted: ref recovers all words (was "Dawnfather")', () => {
    expect(deityDisplayNameFromRef('converted:aurelion_the_dawnfather')).toBe('Aurelion The Dawnfather');
  });
  it('mixed separators and the pantheonDepth twin delegate to the same floor', () => {
    expect(deityDisplayName('deity:lu_a:war_father')).toBe('War Father');
  });
});

describe('deityNameFromSnapshots — authored name from primary AND cult', () => {
  const withPrimary = [{ id: 's1', settlement: { config: { primaryDeitySnapshot: { _deityRef: 'deity:lu_a:war_father', name: 'War Father' } } } }];
  const withCult = [{ id: 's2', settlement: { config: { cultDeitySnapshots: [{ _deityRef: 'deity:lu_b:the_lantern', name: 'The Lantern' }] } } }];

  it('resolves the authored name from a primary snapshot', () => {
    expect(deityNameFromSnapshots(withPrimary, 'deity:lu_a:war_father')).toBe('War Father');
  });
  it('resolves the authored name from a CULT snapshot (the primary-only copy missed this)', () => {
    expect(deityNameFromSnapshots(withCult, 'deity:lu_b:the_lantern')).toBe('The Lantern');
  });
  it('falls back to the floor when no snapshot carries the deity (zero-seat twilight)', () => {
    expect(deityNameFromSnapshots([], 'deity:lu_a:war_father')).toBe('War Father');
  });
});

describe('snapshot↔selector drift pin — the two public producers agree on the name', () => {
  const REF = 'deity:lu_a:war_father';
  const worldState = { pantheon: { [REF]: { tier: 'major', seats: 5, wins: 6, losses: 1 } } };
  const settlements = [{ id: 's1', settlement: { config: { primaryDeitySnapshot: { _deityRef: REF, name: 'War Father' } } } }];
  const graph = { edges: [], channels: [] };

  it('worldSnapshotPublic pantheon + dashboard arc lines resolve "War Father" (not "Father")', () => {
    const snap = serializeWorldSnapshotPublic(worldState, graph, settlements, { pantheon: true, dashboard: true });
    expect(snap.pantheon[0].name).toBe('War Father');
    expect(snap.dashboard.realmArcLines.join(' ')).toContain('The Ascendancy of War Father');
  });

  it('realmArcSummary resolves the SAME name — no fork between the two producers', () => {
    const lines = realmArcLines({ worldState, regionalGraph: graph, settlements });
    expect(lines.join(' ')).toContain('The Ascendancy of War Father');
    // The pin: both public arc-line producers agree on the deity name.
    const snap = serializeWorldSnapshotPublic(worldState, graph, settlements, { dashboard: true });
    const publicAscendancy = snap.dashboard.realmArcLines.find((l) => l.startsWith('The Ascendancy of'));
    const summaryAscendancy = lines.find((l) => l.startsWith('The Ascendancy of'));
    expect(publicAscendancy.split('(')[0].trim()).toBe(summaryAscendancy.split('(')[0].trim());
  });
});
