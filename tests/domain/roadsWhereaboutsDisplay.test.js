/**
 * roadsWhereaboutsDisplay.test.js — the dossier whereabouts line + badge (R-5b; §12). Pure.
 */
import { describe, it, expect } from 'vitest';
import { whereaboutsLine, whereaboutsBadge, npcIsHostage } from '../../src/domain/roads/whereaboutsDisplay.js';

describe('roads whereabouts display (§12)', () => {
  const wa = (state, extra = {}) => ({ state, placeId: 'e', purposeKind: 'trade', ...extra });

  it('formats a line per state, resolving place ids to names', () => {
    const resolve = (id) => (id === 'e' ? 'Dulwich' : null);
    expect(whereaboutsLine(wa('hostage'), resolve)).toBe('Held in Dulwich — the ransom is being raised.');
    expect(whereaboutsLine(wa('returning'), resolve)).toBe('On the road home from Dulwich.');
    expect(whereaboutsLine(wa('visiting', { purposeKind: 'observance' }), resolve)).toBe('Away in Dulwich, on a tradition.');
    expect(whereaboutsLine(wa('traveling', { purposeKind: 'diplomacy' }), resolve)).toBe('On the road to Dulwich, on a diplomatic errand.');
  });

  it('falls back to the raw place id when no resolver / unknown id', () => {
    expect(whereaboutsLine(wa('hostage'))).toBe('Held in e — the ransom is being raised.');
    expect(whereaboutsLine(wa('traveling', { placeId: '' }))).toBe('On the road to the road, on trade business.');
  });

  it('returns null for absent / unreadable / unknown-state whereabouts', () => {
    expect(whereaboutsLine(null)).toBeNull();
    expect(whereaboutsLine(undefined)).toBeNull();
    expect(whereaboutsLine({})).toBeNull();
    expect(whereaboutsLine(wa('home'))).toBeNull();
  });

  it('badge is a short label, or null', () => {
    expect(whereaboutsBadge(wa('hostage'))).toBe('Held');
    expect(whereaboutsBadge(wa('returning'))).toBe('Returning');
    expect(whereaboutsBadge(wa('visiting'))).toBe('Away');
    expect(whereaboutsBadge(wa('traveling'))).toBe('Traveling');
    expect(whereaboutsBadge(null)).toBeNull();
  });

  it('npcIsHostage gates the intervention affordance', () => {
    expect(npcIsHostage({ whereabouts: wa('hostage') })).toBe(true);
    expect(npcIsHostage({ whereabouts: wa('traveling') })).toBe(false);
    expect(npcIsHostage({})).toBe(false);
  });
});
