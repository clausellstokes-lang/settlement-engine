/**
 * CENSUS-1e unit 2 (Appendix B row 118, the threat template lookup): CENSUS-5b's
 * `THREAT_TEXT_SIBLINGS` resolve where `deriveThreatProfile` prints the template. The siege
 * description declares `walls` (the perimeter, ruling 3) and has a twin; the civil-unrest victim
 * "the watch" declares `watch` (a list item, kind A: it leaves the list where the record refuses it).
 * With no settlement handed the template prints as before (unanswered keeps, resolveSibling's rule).
 */
import { describe, expect, it } from 'vitest';
import { deriveThreatProfile } from '../../src/domain/threatProfile.js';

const WALLED = { institutions: [{ name: 'Town walls', category: 'Defense' }, { name: 'Town watch', category: 'Defense' }] };
const OPEN = { institutions: [{ name: 'Market square', category: 'Economy' }] };

describe('threatProfile THREAT_TEXT_SIBLINGS (CENSUS-1e unit 2)', () => {
  it('(a) the siege description: the walls where the record holds a perimeter, the twin where it does not', () => {
    expect(deriveThreatProfile({ raw: { type: 'siege' } }, WALLED)?.description).toBe('External military force pressing or potentially pressing the walls.');
    expect(deriveThreatProfile({ raw: { type: 'siege' } }, OPEN)?.description).toBe('External military force pressing or potentially pressing the settlement.');
  });

  it('(b) the civil-unrest victims: "the watch" only where the record holds a watch', () => {
    const type = 'unrest';
    expect(deriveThreatProfile({ raw: { type } }, WALLED)?.victims).toEqual(['the watch', 'merchants', 'minorities']);
    expect(deriveThreatProfile({ raw: { type } }, OPEN)?.victims).toEqual(['merchants', 'minorities']);
  });

  it('(c) no settlement handed: the template prints unchanged', () => {
    expect(deriveThreatProfile({ raw: { type: 'siege' } }, undefined)?.description).toBe('External military force pressing or potentially pressing the walls.');
    expect(deriveThreatProfile({ raw: { type: 'unrest' } }, undefined)?.victims).toEqual(['the watch', 'merchants', 'minorities']);
  });
});
