/**
 * realmExportFaithSeam.test.js — THE REALM-SCALE FAITH SEAM (owner ruling 2026-07-30).
 *
 * The settlement lane has carried this guarantee since W4f (faithWarGate.test.js): the
 * export surface passes `faithUnlocked`, the DEFAULT is false, and a free / lapsed /
 * anon export therefore never prints a deity name. The two REALM artifacts, both on the
 * jsPDF lane, had no such seam — generateCampaignPDF painted the Pantheon standing and
 * the "Ascendancy of <deity>" arcs, and generateWorldBook collected them, gated only by
 * whichever screen happened to call them.
 *
 * The seam now lives in `collectRealmSummary`, the ONE collector both realm exporters
 * read, so the two can never drift. Locked ⇒ the realm is read WITHOUT its pantheon
 * ledger, so neither deity-name producer runs: whole-section omission, matching the
 * sibling's shape, never a blanked name.
 *
 * The pins are shaped as TRANSITIONS (tests/helpers/anchoredNegatives.js): each
 * "no deity name" assertion is anchored by the premium render of the SAME fixture,
 * so a fixture that stopped producing the name at all reds on the anchor instead of
 * passing vacuously. The campaign PDF is asserted on its PAINTED TEXT (the artifact
 * itself); the World Book is asserted on its collected model, which is that file's
 * documented contract (its painter never renders pantheon or arcs at all).
 */
import { describe, it, expect } from 'vitest';
import { rmSync } from 'node:fs';
import { collectRealmSummary, generateCampaignPDF } from '../../src/utils/generateCampaignPDF.js';
import { collectWorldBook } from '../../src/utils/generateWorldBook.js';
import { paintedText } from '../helpers/jsPdfPaintedText.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

// A minted ref whose display name is one distinctive token, so a substring assertion
// over painted bytes is unambiguous. No settlement carries a deity snapshot, so both
// name resolvers (deityDisplayNameFromRef for the standings, deityNameFromSnapshots
// for the arcs) land on the same floor spelling.
const DEITY_REF = 'deity:realm_seam:sablemark';
const DEITY_NAME = 'Sablemark';

const saves = [
  { id: 'ashford', name: 'Ashford', settlement: { name: 'Ashford', tier: 'town', population: 1800 } },
  { id: 'grimhold', name: 'Grimhold', settlement: { name: 'Grimhold', tier: 'village', population: 700 } },
];

/** A canonized realm that is BOTH at war and worshipping: the war content must survive
 *  a locked export, the faith content must not. */
function faithAndWarCampaign() {
  return {
    id: 'camp-faith-seam',
    name: 'Faith Seam Realm',
    settlementIds: ['ashford', 'grimhold'],
    wizardNews: { currentTick: 8, entries: [] },
    worldState: {
      canonizedAt: '2026-01-01T00:00:00.000Z',
      tick: 8,
      // Grimhold marches on Ashford: a live siege plus the scar it leaves.
      deployments: { grimhold: { targetId: 'ashford', sinceTick: 6, role: 'attacker' } },
      warExhaustion: { grimhold: 0.84 },
      // A major faith holding three seats: standings row AND an Ascendancy arc line.
      pantheon: { [DEITY_REF]: { seats: 3, tier: 'major', wins: 2, losses: 0 } },
      disposition: {},
    },
  };
}

/** The same realm with the war taken out: faith is then the ONLY living content. */
function faithOnlyCampaign() {
  const campaign = faithAndWarCampaign();
  delete campaign.worldState.deployments;
  delete campaign.worldState.warExhaustion;
  return campaign;
}

describe('collectRealmSummary — the faith seam is the collector, and it fails closed', () => {
  it('the pantheon standing is collected for premium and NOT collected by default', () => {
    const campaign = faithAndWarCampaign();
    const unlocked = collectRealmSummary(campaign, saves, { faithUnlocked: true });
    const locked = collectRealmSummary(campaign, saves);
    expectPresentThenAbsent(
      unlocked.pantheon.map(p => p.id),
      locked.pantheon.map(p => p.id),
      DEITY_REF,
      'realm pantheon standing',
    );
    expect(locked.pantheon).toEqual([]);
  });

  it('the deity ARC LINE is never produced for a locked export (not blanked, not produced)', () => {
    const campaign = faithAndWarCampaign();
    const unlocked = collectRealmSummary(campaign, saves, { faithUnlocked: true });
    const locked = collectRealmSummary(campaign, saves);
    expectPresentThenAbsent(
      unlocked.arcs.join(' | '),
      locked.arcs.join(' | '),
      DEITY_NAME,
      'realm arc lines',
    );
    // The Ascendancy line is gone; the WAR arc from the same producer is untouched.
    expect(unlocked.arcs.some(a => a.startsWith('The Ascendancy of'))).toBe(true);
    expect(locked.arcs.some(a => a.startsWith('The War of Ashford'))).toBe(true);
  });

  it('war, siege and chronicle content are untouched by the seam', () => {
    const campaign = faithAndWarCampaign();
    const locked = collectRealmSummary(campaign, saves);
    expect(locked.present).toBe(true);
    expect(locked.sieges.map(sg => sg.targetId)).toEqual(['ashford']);
    expect(locked.weary.map(w => w.id)).toEqual(['grimhold']);
    expect(locked.nameFor('ashford')).toBe('Ashford');
  });

  it('the DEFAULT is the safe one: omitting opts equals passing faithUnlocked:false', () => {
    const campaign = faithAndWarCampaign();
    const omitted = collectRealmSummary(campaign, saves);
    const explicit = collectRealmSummary(campaign, saves, { faithUnlocked: false });
    // nameFor is a fresh closure per call, so the data fields are compared.
    for (const key of ['present', 'majors', 'sieges', 'weary', 'standings', 'pantheon', 'arcs']) {
      expect(omitted[key], `field ${key} diverges between the omitted and explicit lock`).toEqual(explicit[key]);
    }
  });

  it('a faith-ONLY realm degrades to no chapter at all (whole-section omission)', () => {
    const campaign = faithOnlyCampaign();
    // Premium: the chapter exists and carries the pantheon.
    expect(collectRealmSummary(campaign, saves, { faithUnlocked: true }).present).toBe(true);
    // Locked: nothing is left to print, so the chapter is skipped whole rather than
    // painted with an empty Pantheon heading.
    expect(collectRealmSummary(campaign, saves).present).toBe(false);
  });
});

describe('generateCampaignPDF — the painted realm chapter carries ZERO deity names by default', () => {
  const FILE = 'campaign-faith-seam-realm.pdf';

  it('premium paints the deity name; the default export paints none, war content intact', () => {
    const campaign = faithAndWarCampaign();
    // Left undefined on purpose: if a painter throws, the anchored-negative helper
    // reds with "the collection cannot answer a toContain question" rather than
    // comparing two empty strings and passing.
    let premiumText;
    let freeText;
    try {
      generateCampaignPDF(campaign, saves, { now: 'Cyfrin 1, 2026', faithUnlocked: true });
      premiumText = paintedText(FILE);
      generateCampaignPDF(campaign, saves, { now: 'Cyfrin 1, 2026' });
      freeText = paintedText(FILE);
    } finally {
      rmSync(FILE, { force: true });
    }
    expectPresentThenAbsent(premiumText, freeText, DEITY_NAME, 'campaign PDF faith seam');
    // The chapter itself still painted for the free export, war content and all, so
    // the absence above measures the seam and not a missing chapter.
    expect(freeText).toContain('STATE OF THE REALM');
    expect(freeText).toContain('Grimhold besieges Ashford.');
    expect(freeText).toContain('The War of Ashford');
    // The premium export is the same document PLUS the faith rows.
    expect(premiumText).toContain('Grimhold besieges Ashford.');
    expect(premiumText).toContain('PANTHEON');
  });
});

describe('collectWorldBook — the seam rides through, orthogonal to the dm/player face', () => {
  it('the DM face of a locked account carries no deity name anywhere in the book', () => {
    const campaign = faithAndWarCampaign();
    const unlocked = collectWorldBook(campaign, saves, { mode: 'dm', faithUnlocked: true });
    const locked = collectWorldBook(campaign, saves, { mode: 'dm' });
    // JSON.stringify skips realm.nameFor (a function), so this walks the DATA only.
    expectPresentThenAbsent(
      JSON.stringify(unlocked),
      JSON.stringify(locked),
      DEITY_NAME,
      'world book faith seam (dm face)',
    );
    // The realm chapter still binds: the siege survives the lock.
    expect(locked.realm.present).toBe(true);
    expect(locked.realm.sieges.map(sg => sg.targetId)).toEqual(['ashford']);
  });

  it('is orthogonal to mode: the player face of a premium account still binds the faith', () => {
    const campaign = faithAndWarCampaign();
    const playerPremium = collectWorldBook(campaign, saves, { mode: 'player', faithUnlocked: true });
    const playerLocked = collectWorldBook(campaign, saves, { mode: 'player' });
    expectPresentThenAbsent(
      JSON.stringify(playerPremium),
      JSON.stringify(playerLocked),
      DEITY_REF,
      'world book faith seam (player face)',
    );
  });
});
