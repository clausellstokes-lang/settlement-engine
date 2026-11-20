/**
 * claimRungReadsRoster.test.js — POWERS-11 (REVIEW-POWERS-3 L2, the reader's four LOW placements): A RUNG THE CLAIM
 * TABLE PLACES NAMES NO COUNCIL, NO MERCHANT CAPITAL AND NO "NOT YET DOMINANT" ITS OWN ROSTER MAKES FALSE.
 * power/claimStanding.js :: settleClaimsToLabel replaces a commanding claim beside a Minor or Suppressed label with its
 * ladder's rung; four rungs carried a clause their town could make false:
 *  - the criminal Minor rung's "present in council discussions through intermediaries" where no council sits (40 on
 *    the census's 720 at ec72918d4, 12 of them the ladder's own line, untouched): where none sits, the ladder's lower
 *    rung ("Criminal network operating in shadows ...", a protection operation in the small tiers);
 *  - the gentry rung's "outpaced by merchant capital" where no merchant power stands ahead, and the noble rung's
 *    "competitive with merchant capital" where none stands at all: the ladder's lowest, "Minor landed families ...";
 *  - the merchants' rung "without yet being the dominant commercial voice" on the town's leading merchant power where no
 *    merchant power governs: "... a consistent civic presence, though other powers set the course here." (new words).
 * No draw: the rungs are fixed lines chosen by the roster. Every expected word is a literal.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { settleClaimsToLabel } from '../../../src/generators/power/claimStanding.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';

const COUNCIL = 'present in council discussions through intermediaries';
const SHADOWS = 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.';
const LESSER = 'Minor landed families with limited political reach; present in civic life but rarely decisive.';
const OUTPACED = 'Gentry families with local landholdings; active in civic politics but outpaced by merchant capital in raw financial leverage';
const COMPETITIVE = 'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.';
const LOCAL = 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.';
const LEADING = 'Merchants with local reach; a consistent civic presence, though other powers set the course here.';
const CRIME = 'Criminal organisations have captured significant influence; corruption is systemic, not exceptional.';
const NOBLE = 'Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the seat cannot easily override.';
const TRADE = 'Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.';

/** @param {string} seat @param {Array<[string, number, string, string?]>} rows name, power, label, desc */
function roster(seat, rows) {
  return [{ faction: seat, power: 40, powerLabel: 'Strong', isGoverning: true, desc: 'x' },
    ...rows.map(([faction, power, powerLabel, desc]) => ({ faction, power, powerLabel, desc: desc || 'x' }))];
}
const descOf = (/** @type {any[]} */ f, /** @type {string} */ name) => f.find((x) => x.faction === name).desc;

describe('POWERS-11 · the claim table\'s rungs read the roster (L2)', () => {
  it('the criminal Minor rung speaks of council discussions only where a council sits', () => {
    const ducal = roster('Ducal Governorship', [["Thieves' Guild", 12, 'Minor', CRIME]]);
    settleClaimsToLabel(ducal, 'city');
    expect(descOf(ducal, "Thieves' Guild")).toBe(SHADOWS);
    const council = roster('Town Council', [["Thieves' Guild", 12, 'Minor', CRIME]]);
    settleClaimsToLabel(council, 'city');
    expect(descOf(council, "Thieves' Guild")).toContain(COUNCIL);
  });
  it('the noble rungs name merchant capital only where a merchant power stands (ahead of a town\'s gentry)', () => {
    const none = roster('Royal Authority', [['Landed Gentry', 14, 'Minor', NOBLE]]);
    settleClaimsToLabel(none, 'town');
    expect(descOf(none, 'Landed Gentry')).toBe(LESSER);
    const behind = roster('Royal Authority', [['Landed Gentry', 14, 'Minor', NOBLE], ['Merchant Guilds', 9, 'Minor']]);
    settleClaimsToLabel(behind, 'town');
    expect(descOf(behind, 'Landed Gentry')).toBe(LESSER);
    const ahead = roster('Royal Authority', [['Landed Gentry', 14, 'Minor', NOBLE], ['Merchant Guilds', 20, 'Minor']]);
    settleClaimsToLabel(ahead, 'town');
    expect(descOf(ahead, 'Landed Gentry')).toBe(OUTPACED);
    const city = roster('Royal Authority', [['Noble Families', 14, 'Minor', NOBLE]]);
    settleClaimsToLabel(city, 'city');
    expect(descOf(city, 'Noble Families')).toBe(LESSER);
    const cityMerchants = roster('Royal Authority', [['Noble Families', 14, 'Minor', NOBLE], ['Merchant Guilds', 9, 'Minor']]);
    settleClaimsToLabel(cityMerchants, 'city');
    expect(descOf(cityMerchants, 'Noble Families')).toBe(COMPETITIVE);
  });
  it('the town\'s leading merchant power, where no merchant power governs, is not "not yet the dominant commercial voice"', () => {
    const lead = roster('Royal Authority', [['Merchant Guilds', 14, 'Minor', TRADE], ['Craft Guilds', 9, 'Minor']]);
    settleClaimsToLabel(lead, 'city');
    expect(descOf(lead, 'Merchant Guilds')).toBe(LEADING);
    const behind = roster('Royal Authority', [['Merchant Guilds', 14, 'Minor', TRADE], ['The Trade Compact', 20, 'Minor']]);
    settleClaimsToLabel(behind, 'city');
    expect(descOf(behind, 'Merchant Guilds')).toBe(LOCAL);
    const governed = roster('Merchant oligarchy', [['Merchant Guilds', 14, 'Minor', TRADE]]);
    settleClaimsToLabel(governed, 'city');
    expect(descOf(governed, 'Merchant Guilds')).toBe(LOCAL);
  });
});

describe('POWERS-11 · the guard towns (the census\'s 720 shape)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @param {string} tier @param {string} seed */
  const born = (tier, seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: tier }), null, { seed, customContent: {} });
  it('r2r-town-40 (no council sits): its Thieves\' Guild reads the lower rung; r2r-town-9: its leading merchants read the new rung', () => {
    const t40 = born('town', 'r2r-town-40').powerStructure.factions;
    expect(String(t40.find((f) => f.faction === "Thieves' Guild")?.desc)).toMatch(/^Criminal network operating in shadows/);
    const t9 = born('town', 'r2r-town-9').powerStructure.factions;
    expect(String(t9.find((f) => f.faction === 'Merchant Guilds')?.desc)).toMatch(/^Merchants with local reach; a consistent civic presence, though other powers set the course here\./);
  }, 120_000);
});
