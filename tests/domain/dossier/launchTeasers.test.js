/**
 * launchTeasers.test.js — the teaser predicates behind the strip's launch hue (THE OWNER,
 * 2026-11-01, ODQ §934.103). Each predicate mirrors the tab body's own teaser decision:
 * RumorsTab's `view` is null without a campaign rumor ledger; FaithTab's live panel needs
 * a deity embed; WarTab's `warTabHasContent` needs an owning campaign at all.
 */
import { describe, it, expect } from 'vitest';
import {
  rumorsTabHasContent, faithTabHasContent, warTeaserSync, LAUNCH_TONE,
} from '../../../src/domain/dossier/launchTeasers.js';

const town = { id: 'town-1', name: 'Xindao', config: {} };
const owning = (extra = {}) => ({ id: 'c1', settlementIds: ['town-1'], worldState: {}, ...extra });

describe('launchTeasers — the predicates mirror the tab bodies', () => {
  it('rumors: live only when an owning campaign carries a rumor ledger', () => {
    expect(rumorsTabHasContent(town, { campaigns: [] })).toBe(false);
    expect(rumorsTabHasContent(town, { campaigns: undefined })).toBe(false);
    expect(rumorsTabHasContent(town, { campaigns: [owning()] })).toBe(false);
    expect(rumorsTabHasContent(town, { campaigns: [owning({ worldState: { spatialLedgers: { rumorLedgers: {} } } })] })).toBe(true);
    // a campaign that owns another settlement does not count, even with a ledger
    expect(rumorsTabHasContent(town, { campaigns: [{ id: 'c2', settlementIds: ['elsewhere'], worldState: { spatialLedgers: { rumorLedgers: {} } } }] })).toBe(false);
    // the save id, when given, is the key RumorsTab uses
    expect(rumorsTabHasContent(town, { saveId: 'save-9', campaigns: [{ id: 'c3', settlementIds: ['save-9'], worldState: { spatialLedgers: { rumorLedgers: {} } } }] })).toBe(true);
  });

  it('faith: live only over an embedded deity snapshot', () => {
    expect(faithTabHasContent(town)).toBe(false);
    expect(faithTabHasContent({ ...town, config: { primaryDeitySnapshot: null } })).toBe(false);
    expect(faithTabHasContent({ ...town, config: { primaryDeitySnapshot: 'Sunlord' } })).toBe(false);
    expect(faithTabHasContent({ ...town, config: { primaryDeitySnapshot: { name: 'Sunlord Aurelian' } } })).toBe(true);
  });

  it('war: a settlement no campaign owns is a teaser without the war chunk; an owned one defers to the full predicate', () => {
    expect(warTeaserSync(town, { campaigns: [] })).toBe(true);
    expect(warTeaserSync(town, { campaigns: undefined })).toBe(true);
    expect(warTeaserSync(town, { campaigns: [owning()] })).toBe(null);
    expect(warTeaserSync(town, { saveId: 'save-9', campaigns: [{ id: 'c3', settlementIds: ['save-9'] }] })).toBe(null);
  });

  it('the tone word is the one both strips read', () => {
    expect(LAUNCH_TONE).toBe('launch');
  });
});
