/**
 * THE THREE RE-KEYED LINES ARE TRUE WHEREVER THEY PRINT (R3-CODE-C-6; the chair's ruling of 2026-11-14 04:05Z on the
 * lane's STOP, condition 1, vetoable by the owner).
 *
 * Point 49's presumed-things walker reads three of this lane's reworded lines as naming a thing the town may lack,
 * because the condition that makes each true is a key or a branch no draw door reads. The chair re-keyed them by hand
 * (`after-base: r3-code-c`, tests/lint/presumedThings.widened.register.json) ON CONDITION that this file holds each
 * one to that condition, read by the vocabulary's own readers (`factsOf`, `registeredWords.js :: REGISTERED_WORDS`):
 *   1. crisisSummaryVantage.js, wartime.defence.official: prints only in a wartime town (the war is not absent);
 *   2. the same table, occupied.cover.trade: prints only in an occupied town (the occupation is not absent);
 *   3. structuralValidator.js, the plagued-threat below-25 reason: only where a fort (walls, a palisade or a garrison)
 *      AND a force (`guardPresence`) stand.
 * Each arm also asserts it saw the line print (a guard that never sees its line proves nothing). Owed FOR THE JOIN:
 * the vantage table and the validator's reasons go through a draw door; the rows then leave by the door's --shrink.
 *
 * Line 3 never prints in a born town: generation floors a plagued town's military priority at 25
 * (`steps/resolveConfig.js`, the military floor), so the branch is reached through the edit-time checks
 * (`domain/edit/guardRules.js`, `domain/coherence/checkDraftEdit.js`), which call the validator on a record's live
 * roster and config. Its arm does the same over born rosters with the slider below 25: each roster whole, without its
 * force houses, and without its fort houses (rosters an editor can make), the facts read from that roster.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { REGISTERED_WORDS } from '../../src/domain/facts/registeredWords.js';
import { crisisSummaryForSurface } from '../../src/domain/crisis/crisisSummaryVantage.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';

const WAR_LINE = 'With men called away to the war, {name} has fewer hands than before to see to its own safety.';
const OCCUPIERS_LINE = 'Everything sold in {name} pays the occupiers their due first, and those who sell keep their prices and their opinions to themselves.';
const DEFENDERS_LINE = 'Embattled region. Infrastructure exists on paper, but the defences are so underfunded that they are barely maintained and the defenders are few. This settlement will fall.';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const SURFACES = /** @type {const} */ (['cover', 'overview', 'defence', 'tonight']);
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** @param {string} seed @param {string} settType @param {string[] | null} stresses null: the crises on random */
const born = (seed, settType, stresses) => generateSettlementPipeline(birthConfig({
  ...DEFAULT_CONFIG, ...DIALS, settType,
  ...(stresses ? { selectedStressesRandom: false, selectedStresses: stresses } : { selectedStressesRandom: true }),
}), null, { seed, customContent: {} });

/** Every vantage line a born town prints, with the town. */
const vantagePrints = (s) => [].concat(s.stress || []).flatMap((entry) => SURFACES.map((surface) => ({
  text: crisisSummaryForSurface(entry, s.name, surface), surface, kind: entry?.type,
})));

/** @type {Array<any>} */ let towns = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  towns = TIERS.flatMap((tier) => [0, 1, 2, 3, 4, 5].flatMap((k) => [
    born(`r3c6-wartime-${tier}-${k}`, tier, ['wartime']),
    born(`r3c6-occupied-${tier}-${k}`, tier, ['occupied']),
    born(`r3c6-random-${tier}-${k}`, tier, null),
  ]));
}, 300000);

describe('the re-keyed vantage lines print only under their own crisis', () => {
  it('the war line: only in a town at war', () => {
    const seen = [];
    for (const s of towns) {
      const f = factsOf(s);
      for (const p of vantagePrints(s)) {
        if (p.text !== WAR_LINE.replace('{name}', s.name)) continue;
        seen.push(s.name);
        expect({ town: s.name, kind: p.kind, warAbsent: REGISTERED_WORDS.war.absent(f), wartime: !!f.crisis?.has?.('wartime') })
          .toEqual({ town: s.name, kind: 'wartime', warAbsent: false, wartime: true });
      }
    }
    expect(seen.length).toBeGreaterThan(0);
  });

  it('the occupiers line: only in an occupied town', () => {
    const seen = [];
    for (const s of towns) {
      const f = factsOf(s);
      for (const p of vantagePrints(s)) {
        if (p.text !== OCCUPIERS_LINE.replace('{name}', s.name)) continue;
        seen.push(s.name);
        expect({ town: s.name, kind: p.kind, occupationAbsent: REGISTERED_WORDS.occupation.absent(f), occupied: !!f.crisis?.has?.('occupied') })
          .toEqual({ town: s.name, kind: 'occupied', occupationAbsent: false, occupied: true });
      }
    }
    expect(seen.length).toBeGreaterThan(0);
  });
});

describe('the re-keyed validator reason prints only where a fort and a force stand', () => {
  const FORCE = /garrison|guard|militia|levy|barracks|mercenary|watch/i;
  const FORT = /wall|citadel|garrison|barracks|palisade|earthwork/i;
  it('over born rosters, whole, without their force and without their fort, the slider below 25', () => {
    const seen = [];
    let refused = 0;
    for (const s of towns) {
      const roster = s.institutions || [];
      for (const [cut, list] of [['whole', roster], ['no force', roster.filter((i) => !FORCE.test(String(i?.name)))], ['no fort', roster.filter((i) => !FORT.test(String(i?.name)))]]) {
        const reasons = checkStructuralValidity(list, { tier: s.tier, monsterThreat: 'plagued', priorityMilitary: 12 })
          .violations.map((v) => v.reason);
        const f = factsOf({ ...s, institutions: list });
        const fort = !!(f.defence?.walls || f.defence?.palisade || f.defence?.garrison);
        const force = !REGISTERED_WORDS.armedForce.absent(f);
        if (!reasons.includes(DEFENDERS_LINE)) { if (!(fort && force)) refused++; continue; }
        seen.push(`${s.name} (${cut})`);
        expect({ town: s.name, cut, fort, force }).toEqual({ town: s.name, cut, fort: true, force: true });
      }
    }
    expect(seen.length).toBeGreaterThan(0);
    expect(refused).toBeGreaterThan(0); // the cut rosters reach towns without a fort or a force, and the line stays out
  });
});
