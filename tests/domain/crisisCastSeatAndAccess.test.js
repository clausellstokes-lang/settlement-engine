/**
 * ROUND THREE item 4 (the chair's ruling; the increment's rows on rpf-town-succession_void-13 and
 * rpf-village-succession_void-13, the cut's #864, CENSUS-2's "the Access to parish church holds the key to it"):
 *   - "already carries more weight than whoever holds the seat" is said only where someone holds the seat (the empty seat's
 *     one home, people/seatKeeper.js :: isSeatVacant): under an empty seat the rival is named by what it gains;
 *   - a power "holds what the crisis makes scarce" only where a member faces a house of that kind, never by its name;
 *   - an "Access to …" row is not a house here (record 375): never a lever; and a hook names a house through houseInProse.
 * Births in the app's own shape (the readers' rpf- and the census's r2r-/r2s- configurations).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CAST_REASONS, STAKE_REASONS, deriveStakes } from '../../src/domain/crisis/crisisCast.js';
import { crisisHooksOf, houseInProse } from '../../src/domain/crisis/crisisHooks.js';
import { isSeatVacant } from '../../src/domain/people/seatKeeper.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** @param {string} seed */
function cfgFor(seed) {
  let m = seed.match(new RegExp(`^rpf-${SIZE}-([a-z_+]+)-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
  m = seed.match(new RegExp(`^rr2s-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
  m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
}
const EMPTY = ['rpf-town-succession_void-13', 'rpf-village-succession_void-13'];
const HELD = 'r2s-politically_fractured-thorp-0'; // GUARD: a held, contested seat keeps the rival's weight
const ACCESS = ['r2r-thorp-17', 'r2r-thorp-38']; // the famine's only "lever" was "Access to external mill"
const GRAIN = 'rr2s-city-under_siege+famine-rand-1'; // Grain Holders, whose members face no granary
/** @type {Record<string, any>} */
const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of [...EMPTY, HELD, ...ACCESS, GRAIN]) born[seed] = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
}, 300000);
/** @param {any} s @returns {any[]} */
const entries = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);

describe('ROUND THREE · the crisis cast reads the empty seat, the roster and the road', () => {
  it('the readers\' two empty seats: no role, stake or hook says the rival outweighs whoever holds the seat', () => {
    for (const seed of EMPTY) {
      const s = born[seed];
      expect(isSeatVacant(s), seed).toBe(true);
      const e = entries(s).find((x) => x.type === 'succession_void');
      const instigator = e.cast.roles.find((r) => r.role === 'instigator');
      expect(instigator?.reason, seed).toBe(CAST_REASONS.instigatorGains);
      const said = [...e.cast.roles.map((r) => r.reason), ...e.cast.stakes.map((k) => k.reason), ...crisisHooksOf(s, e).map((h) => h.text)];
      expect(said.filter((x) => /whoever holds the seat/.test(x)), seed).toEqual([]);
      expect(e.cast.stakes.some((k) => k.reason === STAKE_REASONS.gainsClaim), seed).toBe(true);
    }
  });
  it('GUARD: a held seat keeps "already carries more weight than whoever holds the seat"', () => {
    const s = born[HELD];
    expect(isSeatVacant(s)).toBe(false);
    const e = entries(s)[0];
    expect(e.cast.roles.some((r) => r.reason === CAST_REASONS.instigatorRival)).toBe(true);
  });
  it('an "Access to …" row is never a lever: the famine with no house of its own is held by the one who stepped in', () => {
    for (const seed of ACCESS) {
      const e = entries(born[seed]).find((x) => x.type === 'famine');
      expect(e.cast.levers.map((l) => l.institution).filter((n) => /^access to/i.test(n)), seed).toEqual([]);
      const lever = e.cast.roles.find((r) => r.role === 'lever');
      expect(lever, seed).toMatchObject({ kind: 'npc', temporary: true, reason: CAST_REASONS.leverTemporary });
      expect(crisisHooksOf(born[seed], e).filter((h) => /access to/i.test(h.text)), seed).toEqual([]);
    }
  });
  it('a power "holds what the crisis makes scarce" only where one of its members faces a house of that kind', () => {
    const e = entries(born[GRAIN]).find((x) => x.type === 'famine');
    const grain = e.cast.stakes.find((k) => k.factionId === 'Grain Holders');
    expect(grain).toBeDefined();
    expect(grain.reason).not.toBe(STAKE_REASONS.gainsHolds); // anchored: the stake row itself is asserted defined on the line just above
  });
  it('GUARD: where a member of the power DOES face a granary, the power holds what the famine makes scarce', () => {
    const s = structuredClone(born[GRAIN]);
    const member = s.npcs.find((n) => (n.memberships || []).some((m) => m.power === 'Grain Holders') && n.institution?.kind === 'house');
    expect(member).toBeDefined();
    member.institution = { ...member.institution, key: 'City granaries' };
    const grain = deriveStakes(s, 'famine').find((k) => k.factionId === 'Grain Holders');
    expect(grain?.reason === STAKE_REASONS.gainsHolds || grain?.reason === STAKE_REASONS.split, String(grain?.reason)).toBe(true);
    expect(grain?.reason).not.toBe(STAKE_REASONS.untouched);
  });
  it('a hook names an institution holder through houseInProse, never the raw catalogue name', () => {
    const cast = { nature: 'social', rank: 1, roles: [{ role: 'instigator', kind: 'institution', id: 'Professional city watch', name: 'Professional city watch', reason: 'its power gains from the crisis', temporary: false }], absent: [], stakes: [], levers: [], ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: [], links: [] };
    const texts = crisisHooksOf({ name: 'Albamunicipium', npcs: [], institutions: [] }, { type: 'insurgency', cast }).map((h) => h.text);
    expect(houseInProse('Professional city watch')).toBe('professional city watch');
    expect(texts.join(' ')).toContain('the professional city watch is stirring it');
  });
  it('ruling (c): a PLURAL house holds no line-role clause (every clause verb is singular); the lever hook still stands', () => {
    const row = { role: 'instigator', kind: 'institution', id: 'Houses of worship (10-30)', name: 'Houses of worship (10-30)', reason: 'its power gains from the crisis', temporary: false };
    const levers = [{ institution: 'Council hall', holderId: null, holderName: null }];
    const cast = { nature: 'social', rank: 1, roles: [row], absent: [], stakes: [], levers, ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: [], links: [] };
    const hooks = crisisHooksOf({ name: 'Albamunicipium', npcs: [], institutions: [] }, { type: 'insurgency', cast });
    expect(hooks.map((h) => h.bound)).toEqual(['lever']);
    // anchored: the line above proves the collection is live (it holds exactly the one lever hook)
    expect(hooks.map((h) => h.text).join(' ')).not.toMatch(/houses of worship is/i);
    const pair = { ...cast, roles: [{ ...row, id: 'Inns and taverns (district)', name: 'Inns and taverns (district)' }] };
    expect(crisisHooksOf({ name: 'Albamunicipium', npcs: [], institutions: [] }, { type: 'insurgency', cast: pair }).map((h) => h.bound)).toEqual(['lever']);
  });
});
