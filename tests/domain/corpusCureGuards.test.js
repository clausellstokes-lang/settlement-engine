// THE CORPUS LANE'S CURE GUARDS (W2-WRITE, the read of 2026-11-13, finding M5: "no guard reds when a
// cure's crisis disqualifier is undone or mis-written").
//
// Every disqualifier cure on the dossier's state prose (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md and the
// files generated from it) has a row here: a FIXED TOWN, born as the app births it, in which the cured line
// must not be eligible. Each row also proves the town still reaches the pool, so a guard can never pass
// because its town drifted away from the case it guards: a town that no longer reads the pool reds by name,
// and the row is re-keyed to a new town (by identity, with the cause), never dropped.
//
// The town is born in the app's own configuration shape: DEFAULT_CONFIG as the store ships it, the stress
// panel with Random off (`selectedStressesRandom: false`, the ticked crises), and the priorities randomised.
// Every public prose site is then drawn as the owner's page draws it, and the kernel's draw records which
// lines of each pool were eligible.
import { beforeAll, describe, expect, it, vi } from 'vitest';

const seen = vi.hoisted(() => ({ cur: /** @type {Record<string, Set<number>>|null} */ (null) }));

vi.mock('../../src/domain/display/stateProse/stateProseKernel.js', async (importOriginal) => {
  const kernel = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...kernel,
    drawVariant: (/** @type {any[]} */ eligible, /** @type {string} */ blockId, /** @type {string} */ poolKey, /** @type {string} */ seed) => {
      if (seen.cur) {
        const row = (seen.cur[`${blockId}::${poolKey}`] ||= new Set());
        for (const variant of eligible || []) row.add(variant.vid);
      }
      return kernel.drawVariant(eligible, blockId, poolKey, seed);
    },
  };
});

/**
 * One row per cure: the town (its seed names its size and its ticked crises), the pool, the cured line's
 * vid, and what makes the line false there. A row marked `by: 'record'` guards a line the public sites
 * never draw (a `dm-only` line, read on the owner's page only): it reads the fixed town's own record
 * against the line's declaration through the kernel's one rule, and its control is that another line of
 * the same pool is admitted there.
 * @type {ReadonlyArray<{seed: string, pool: string, vid: number, why: string, by?: 'record'}>}
 */
const GUARDS = [
  { seed: 'w5-village-under_siege-1', pool: 'DS-ECO-9::DEFICIT', vid: 1, why: 'a siege: "not enough comes in" presumes a road that is open (the second seat\'s `no crisis: under_siege`)' },
  { seed: 'w5-village-under_siege-1', pool: 'DS-DEF-2::Invasion & War: neither walls nor force', vid: 5, why: 'a siege: "each household is deciding for itself whether to stay" where nobody can leave (LINES-READ, village-under_siege-1)' },
  { seed: 'w5-hamlet-occupied-2', pool: 'DS-DEF-2::Invasion & War: neither walls nor force', vid: 4, why: 'an occupation: "the threat now at hand has noticed both" of a town the threat already holds' },
  { seed: 'w5-town-under_siege-1', pool: 'DS-DEF-2::Invasion & War: walls with NO force', vid: 6, why: 'a town watch: "had nobody to put on its walls until the siege came" (the read\'s H3; its siblings v1-v3 carry `no watch`)' },
  { seed: 'rww-town-occupied-1', pool: 'DS-DEF-2::Invasion & War: walls with NO force', vid: 4, why: 'an occupation: "kept by its watch and nobody else" beside the occupiers\' troops (the read\'s H5, its own town)' },
  { seed: 'w5-hamlet-occupied-104', pool: 'DS-DEF-2::Invasion & War: walls with NO force', vid: 1, why: 'an occupation: "has walls and nobody to put on them" of walls the occupier holds' },
  { seed: 'w5-town-monster_pressure-2', pool: 'DS-DEF-2::Beasts & Monsters: settled, nothing organized', vid: 6, why: 'a town watch: "nothing organised against what has come out of the country" (the read\'s H4)' },
  { seed: 'w5-village-under_siege-3', pool: 'DS-DEF-2::Beasts & Monsters: settled, nothing organized', vid: 6, why: 'a siege: the threat at hand is an army, not what came out of the country' },
  { seed: 'w5-hamlet-occupied-2', pool: 'DS-DEF-2::Beasts & Monsters: settled, nothing organized', vid: 6, why: 'an occupation with no beasts on the page (the read\'s H4, Malotsy)' },
  { seed: 'w5-metropolis-under_siege-6', pool: 'DS-GEN-17::GREAT HOUSE: monastery', vid: 1, why: 'a siege: "a common sight on the way into" a town nobody can enter by road (the read\'s H5)' },
  { seed: 'w5-town-under_siege-102', pool: 'DS-GEN-17::GREAT HOUSE: monastery', vid: 3, why: 'a siege: "anyone new ... is sent to the monks" where nobody new arrives' },
  { seed: 'w5-metropolis-under_siege-2', pool: 'DS-DEF-5::garrison PRESENT', vid: 3, why: 'a siege: "everyone entering is counted at the gate" of a town nobody enters' },
  { seed: 'w5-thorp-under_siege-3', pool: 'DS-ECO-12::INCOME WEIGHT: the religious houses', vid: 4, why: 'a siege: "the feast days set the calendar of buying and selling" where nothing is bought or sold (the read\'s H5)' },
  { seed: 'w5-thorp-under_siege-3', pool: 'DS-ECO-12::INCOME WEIGHT: the religious houses', vid: 3, why: 'a siege: "what its people give for their faith leaves with them on the feast days" out of a town nobody leaves' },
  { seed: 'rww-city-under_siege-1', pool: 'DS-GEN-13::MARKET-OPEN', vid: 3, why: 'a siege: "Visitors find X\'s market without asking" beside a market critically impaired by the siege (the read\'s M2)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-GEN-13::MARKET-OPEN', vid: 3, why: 'a siege: the same (the read\'s M2, its second town)' },
  { seed: 'rw3-town-under_siege-1', pool: 'DS-GEN-13::MARKET-OPEN', vid: 4, why: 'a siege: "The market stands where carts always stopped" beside "the caravans have stopped coming" (the read\'s M4, #964)' },
  { seed: 'w5-city-slave_revolt-102', pool: 'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)', vid: 7, by: 'record', why: 'a slave revolt: "its watch keeps the streets" while the revolt holds them (LINES-READ, slave_revolt-town-3)' },
  { seed: 'w5-city-slave_revolt-102', pool: 'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)', vid: 8, by: 'record', why: 'a slave revolt: "A watch walks X\'s streets" (v7\'s twin)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-GEN-18::STALLED', vid: 2, why: 'a siege: "depends on goods brought in from outside" as if they still came (the read\'s M6; the siege twin is v4)' },
  { seed: 'w5-city-famine-6', pool: 'DS-DEF-2::CHAIN: food trades working', vid: 1, why: 'a famine: "the town would not run short at once if it were cut off" of a town already short of food (W2-WRITE-6 B, Wadikot)' },
  { seed: 'w5-city-under_siege-1', pool: 'DS-DEF-11::WALLED-STRAINED', vid: 3, why: 'a garrison: "had too few hands ... most of them are learning as they go" beside a standing garrison (LINES-READ, metropolis-under_siege-1; W2-WRITE-7 B, Tihono)' },
  { seed: 'w5-hamlet-occupied-104', pool: 'DS-DEF-11::WALLED-STRAINED', vid: 6, why: 'an occupation: "nobody in the town has the work of manning them" of defences the occupier holds (LINES-READ, thorp-24; W2-WRITE-7 B, Ulfås)' },
  { seed: 'w5-thorp-occupied-1', pool: 'DS-DEF-11::WALLED-STRAINED', vid: 7, why: 'an occupation: "the only people who would stand on them are the town\'s own" beside the occupiers\' troops (W2-WRITE-7 B, Shangou)' },
  { seed: 'w5-village-wartime-1', pool: 'DS-DEF-5::NO organized force at all', vid: 4, why: 'a war with no front at the town: "the people defending it now are neighbours who stepped forward" where nobody attacks it (LINES-READ, hamlet-5, thorp-55; W2-WRITE-7 B, Nishidao)' },
  { seed: 'w5-village-wartime-1', pool: 'DS-DEF-5::NO organized force at all', vid: 5, why: 'a war with no front at the town: "whoever leads the defence now is learning the work as the trouble goes on" (LINES-READ, hamlet-53; the sibling of v4, W2-WRITE-7 B, Nishidao)' },
  { seed: 'w5-thorp-famine-2', pool: 'DS-DEF-12::CAPACITY: enough', vid: 1, why: 'a famine: "the town gets by on its own: enough for an ordinary year" beside a food record in famine (W2-WRITE-8 C, #58\'s pool)' },
  { seed: 'w5-thorp-famine-2', pool: 'DS-DEF-12::CAPACITY: enough', vid: 2, why: 'a famine: "What X raises covers an ordinary year ... one bad harvest would leave it short" where it is short now (W2-WRITE-8 C, #58)' },
  { seed: 'w5-village-under_siege-6', pool: 'DS-DEF-12::CAPACITY: enough', vid: 1, why: 'a siege with a food deficit: "enough for an ordinary year" (W2-WRITE-8 C)' },
  { seed: 'w5-thorp-plague_onset-2', pool: 'DS-DEF-12::CAPACITY: enough', vid: 2, why: 'a food record that depends on imports: "What X raises covers an ordinary year" (W2-WRITE-8 C)' },
  { seed: 'w5-town-occupied-101', pool: 'DS-POW-6::GM ADVISORY: the commander is a political actor', vid: 3, by: 'record', why: 'an occupation: "Occupation Authority answers to the Military Council in name only" of an occupier that answers to nobody here (W2-WRITE-SIDE-REST; the read\'s LOW at r2s-occupied-city-0)' },
  { seed: 'w5-metropolis-occupied-101', pool: 'DS-GEN-17::GARRISONED', vid: 1, why: 'an occupation: "The metropolis keeps people under arms for its defence" of a town its occupiers hold (W2-WRITE-SIDE-REST C, the fourth seat\'s #1033 re-read)' },
  { seed: 'w5-city-occupied-101', pool: 'DS-GEN-17::GARRISONED', vid: 2, why: 'an occupation: "the money is found every season" beside "The occupiers take the revenue" (W2-WRITE-SIDE-REST C)' },
  { seed: 'w5-city-occupied-101', pool: 'DS-POW-5::FLAG: merchantArmy', vid: 1, why: 'an occupation: "a private army that keeps order ... the guards usually win" beside "Keeping order in X is the occupiers\' business now" (W2-WRITE-SIDE-REST-2 D, round three #1075)' },
  { seed: 'w5-city-occupied-101', pool: 'DS-POW-5::FLAG: merchantArmy', vid: 2, why: 'an occupation: "Order at X is kept by a private army of hired swords" where the occupiers keep it (round three #1075, HIGH)' },
  { seed: 'w5-hamlet-under_siege-102', pool: 'DS-GEN-13::ENTREPOT', vid: 1, why: 'a siege: "X\'s market handles more than the hamlet could ever use" of a market the siege has cut off (W2-WRITE-SIDE-REST-2 D, the siege Overview\'s road lines)' },
  { seed: 'rww-city-under_siege-1', pool: 'DS-GEN-13::COMMERCE: a bank', vid: 1, why: 'a siege: "A traveller passing through X can change coin" where nobody passes through (the increment\'s ww#600; the fifth seat\'s found line)' },
  { seed: 'w5-city-under_siege+famine-102', pool: 'DS-GEN-13::COMMERCE: a merchant guild, no bank', vid: 1, why: 'a siege: "A merchant who wants to sell at X goes first to its merchant guild" where no merchant comes in' },
  { seed: 'w5-city-under_siege+famine-102', pool: 'DS-GEN-13::COMMERCE: a merchant guild, no bank', vid: 2, why: 'a siege: "its members carry the town\'s dealings outward" where nothing goes out (round three #492)' },
  { seed: 'w5-city-under_siege+famine-102', pool: 'DS-GEN-13::COMMERCE: a merchant guild, no bank', vid: 4, why: 'a siege: "An outside trader at X either accepts its merchant guild\'s terms" where no outside trader arrives (round three #861)' },
  { seed: 'w5-city-under_siege-4', pool: 'DS-GEN-13::COMMERCE: craft guilds, no merchant guild', vid: 4, why: 'a siege: "A newcomer with a trade at X must be taken on by its guild" where nobody new arrives (round two #212)' },
  { seed: 'w5-city-under_siege-1', pool: 'DS-GEN-13::WAREHOUSES', vid: 1, why: 'a siege: "Goods wait in X\'s warehouses between the road and the buyer" of a road the siege has closed' },
  { seed: 'w5-city-under_siege+famine-102', pool: 'DS-GEN-13::WAREHOUSES', vid: 3, why: 'a siege: "fill after the harvest and empty ... as the town trades out of them" (the increment\'s ww#1071, HIGH)' },
  { seed: 'rww-city-under_siege-1', pool: 'DS-GEN-13::WAREHOUSES', vid: 4, why: 'a siege: "leave goods there between journeys" where nobody journeys (the fifth seat\'s found line)' },
  { seed: 'w5-hamlet-politically_fractured-2', pool: 'DS-GEN-18::BOUGHT-IN', vid: 5, why: 'a hamlet: "Much of the work in X\'s workshops begins with unloading a cart" where a part-time smith is the only craft (round three #134, #220)' },
  { seed: 'rww-city-under_siege-1', pool: 'DS-POW-6::operation role duty evasion', vid: 1, why: 'a siege: "Goods reach X unrecorded" where nothing comes in by road (W2-WRITE-SIDE-REST-2 D)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-POW-6::operation role duty evasion', vid: 2, why: 'a siege: "A share of what arrives at X never appears at the gate" where nothing arrives' },
  { seed: 'w5-metropolis-under_siege-1', pool: 'DS-POW-6::operation role duty evasion', vid: 3, why: 'a siege: "the goods that reach X" where none reach it' },
  { seed: 'w5-city-insurgency-1', pool: 'DS-POW-5::council', vid: 1, why: 'a Royal Authority: "the whole {seat} must agree" of a seat that is one person (the increment\'s ww#796, pf#91)' },
  { seed: 'w5-city-occupied-4', pool: 'DS-POW-5::council', vid: 2, why: 'a Royal Authority: "the town\'s business goes to the whole {seat}" of one person (the increment\'s ww#42, a Feudal Stewardship)' },
  { seed: 'w5-metropolis-religious_conversion-1', pool: 'DS-POW-5::council', vid: 4, why: 'a Royal Authority: "its members cannot agree" of a seat that is one person' },
  { seed: 'w5-hamlet-succession_void-101', pool: 'DS-POW-5::council', vid: 3, why: 'a succession void: "worries less about rivals" while the seat itself is in question (the increment\'s pf#220, pf#569)' },
  { seed: 'w5-hamlet-politically_fractured-101', pool: 'DS-POW-5::council', vid: 3, why: 'a fractured town: "worries less about rivals" where a rival dominates or contests the seat (pf#220, pf#569)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', vid: 3, why: 'a siege over fifteen months of grain in the granary: "none of the grain ... has reached it, and that work has stopped or soon will" (the read\'s reason for v4, struck; v3 takes its draws)' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', vid: 1, why: 'a plague\'s quarantine: "Trade comes and goes by X\'s river" beside "Nobody comes into X and nobody leaves" (the defence page\'s QUARANTINE ACTIVE override)' },
  { seed: 'rww-metropolis-under_siege-1', pool: 'DS-ECO-11::EXPLOITATION: fullyExploited', vid: 3, why: 'a siege: "carried through here from start to finish, from what the country gives" of a town whose fields and trade have stopped (v1, its twin, carries `no crisis: under_siege`)' },
  { seed: 'rww-city-under_siege-1', pool: 'DS-ECO-10::POSTURE: established', vid: 5, why: 'a siege: "More than one of X\'s goods finds a buyer beyond the town" where nothing goes out by road (its siblings v2-v4, v6 carry `no crisis: under_siege`; v7 is the siege row)' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', vid: 1, why: 'a plague\'s quarantine: "Food carts come into X most days" beside "Nobody comes into X and nobody leaves"' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', vid: 2, why: 'a plague\'s quarantine: "the rest comes in from the farms around it and from trade" beside "Nobody comes into X and nobody leaves"' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', vid: 3, why: 'a plague\'s quarantine: "everyone knows when the next load is due" beside "Nobody comes into X and nobody leaves"' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', vid: 2, why: 'a plague\'s quarantine: "Some trade comes past X, and little of it stops" beside "Nobody comes into X and nobody leaves" (round three #212; v1 carries the same mark)' },
  { seed: 'w5-city-plague_onset-3', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', vid: 3, why: 'a plague\'s quarantine: "the {access} is busy; most of the traffic does not stop" beside "Nobody comes into X and nobody leaves" (round three #212; v1 carries the same mark)' },
  { seed: 'w5-thorp-plague_onset-1', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', vid: 6, why: 'a plague\'s quarantine: "the trade that passes by" beside "Nobody comes into X and nobody leaves" (round three #212; v1 carries the same mark)' },
  { seed: 'rww-city-calm-1', pool: 'DS-ECO-6::TIER: minor shadow activity (≥3)', vid: 0, why: 'organised crime: "a nuisance, nothing more" beside a thieves\' guild chapter and an organised syndicate (the increment\'s ww791; round three #1378; v4 v5 are the organised rows)' },
  { seed: 'rww-hamlet-famine-1', pool: 'DS-ECO-6::TIER: minor shadow activity (≥3)', vid: 0, why: 'a famine: "a nuisance, nothing more" beside "Desperate: hunger is eroding order" (the increment\'s ww36)' },
  { seed: 'rww-village-under_siege-1', pool: 'DS-ECO-6::TIER: minor shadow activity (≥3)', vid: 0, why: 'a siege: "a nuisance, nothing more" beside desperation theft and black-market food (the increment\'s ww1245)' },
  { seed: 'rww-town-under_siege-1', pool: 'DS-ECO-10::POSTURE: vulnerable', vid: 3, why: 'a siege: "a trader never knows whether a load will get through" beside "nothing comes in by road" (the increment\'s ww500; the way out is closed, not unreliable)' },
  { seed: 'w5-city-under_siege-3', pool: 'DS-ECO-10::POSTURE: vulnerable', vid: 1, why: 'a siege: "no dependable way to move them ... the road they leave by is not" beside "nothing comes in by road" (v3\'s twin, the same mark)' },
  { seed: 'w5-hamlet-calm-2', pool: 'DS-DEF-3::Moderate', vid: 3, why: 'the size ruling: "told which few streets to avoid" in a hamlet with no streets to choose among (BAR-0 HIGH #217, Saltosinum, a hamlet of 87)' },
  { seed: 'w5-thorp-calm-9', pool: 'DS-DEF-3::Moderate', vid: 3, why: 'the size ruling: the same line in a thorp (BAR-0 HIGH #217)' },
  { seed: 'w5-hamlet-indebted-101', pool: 'DS-ECO-12::INCOME WEIGHT: the religious houses', vid: 1, why: 'no church of its own: "What the religious houses take in and spend is a large part of the business" beside a wayside shrine, the walk to another parish\'s church and no faith income (BAR-0 HIGH #246, Torriplenum)' },
  { seed: 'w5-hamlet-calm-10', pool: 'DS-ECO-12::INCOME WEIGHT: the religious houses', vid: 2, why: 'no church of its own: "The religious houses ... are among its biggest buyers and employers" beside a wayside shrine and the walk to another parish\'s church (v1\'s twin, BAR-0 HIGH #246)' },
  { seed: 'w5-city-occupied-1', pool: 'DS-DEF-2::Invasion & War: walls AND professional garrison', vid: 1, why: 'an occupation: "raiders keep their distance and an army would pay dearly" of a town an army already holds (HANDBACK-9, LEFT FOR AFTER THE JOIN)' },
  { seed: 'w5-city-occupied-101', pool: 'DS-DEF-2::Invasion & War: walls AND professional garrison', vid: 2, why: 'an occupation: "any attacker would think again about the cost" of a town already taken (v1\'s sibling)' },
  { seed: 'w5-city-occupied-102', pool: 'DS-DEF-2::Invasion & War: walls AND professional garrison', vid: 3, why: 'an occupation: "People ... believe the town could be held" while the occupiers hold it (v1\'s sibling)' },
  { seed: 'rww-city-under_siege-1', pool: 'DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force', vid: 2, why: 'a siege: "the rotations run, the gates close on time, and nobody treats any of it as unusual" (the round\'s #645, Panteakra)' },
  { seed: 'w5-city-occupied-3', pool: 'DS-DEF-2::Beasts & Monsters: plagued, perimeter AND organized force', vid: 2, why: 'an occupation: the same week\'s routine of a town the occupiers hold (#645, Gankhuuiin)' },
  { seed: 'w5-hamlet-occupied-1', pool: 'DS-DEF-5::NO organized force at all', vid: 1, why: 'an occupation: "Defense here is individual armed citizens" where the occupiers\' troops stand (HANDBACK-6, Ulfas)' },
  { seed: 'w5-thorp-occupied-102', pool: 'DS-DEF-5::NO organized force at all', vid: 2, why: 'an occupation: "If X were attacked, its people would fight with no leaders" of a place already taken (v1\'s sibling)' },
  { seed: 'w5-hamlet-occupied-104', pool: 'DS-DEF-5::NO organized force at all', vid: 3, why: 'an occupation: "Nobody ... is responsible for defending the town" beside the occupiers\' troops (HANDBACK-6, Ulfas, w5-hamlet-occupied-104)' },
  { seed: 'w5-town-occupied-3', pool: 'DS-DEF-2::Beasts & Monsters: settled, defenses beyond the need', vid: 4, why: 'an occupation: "the threat now at hand is testing them in earnest" of works the occupiers already hold (W2-WRITE-11, Hochsteig)' },
  { seed: 'w5-city-occupied-104', pool: 'DS-DEF-2::Beasts & Monsters: settled, defenses beyond the need', vid: 5, why: 'an occupation: "works manned in earnest ... being held against something real" of a city an army holds (W2-WRITE-11)' },
  { seed: 'w5-town-famine-6', pool: 'DS-DEF-1::readiness CRITICAL', vid: 3, why: 'walls: "walk into the centre without being stopped, challenged or counted" of a town behind Town walls and a Citadel (the chair\'s row of 10:40, W2-WRITE-11)' },
  { seed: 'w5-hamlet-famine-5', pool: 'DS-DEF-1::readiness CRITICAL', vid: 3, why: 'walls: the same line in a hamlet behind its palisade or earthworks (W2-WRITE-11)' },
  { seed: 'w5-city-occupied-1', pool: 'DS-DEF-11::WALLED-STRAINED', vid: 2, why: 'an occupation: "fewer people turn out each season to man the city walls and gates, and the city is slow to notice" of walls the occupiers hold (HANDBACK-6, W2-WRITE-11, Markaztappa)' },
  { seed: 'w5-city-occupied-1', pool: 'DS-DEF-11::WALLED-STRAINED', vid: 1, why: 'an occupation: "accounts keep its walls in repair but fall short on the watch\'s wages" of a town whose revenue the occupiers take (v2\'s sibling, W2-WRITE-11)' },
  { seed: 'w5-hamlet-occupied-104', pool: 'DS-DEF-11::WALLED-STRAINED', vid: 5, why: 'an occupation: "keeps its works in repair and pays nobody to stand guard there" beside the occupiers\' troops (v2\'s sibling, W2-WRITE-11)' },
  { seed: 'w5-metropolis-occupied-1', pool: 'DS-DEF-1::readiness ADEQUATE', vid: 3, why: 'an occupation: "People expect to hold against the usual trouble" of a town an army already holds (the chair\'s row of 11:01, REVIEW-R3-TABS-2 R1/C3) (W2-WRITE-11)' },
  { seed: 'w5-town-occupied-3', pool: 'DS-DEF-1::readiness ADEQUATE', vid: 1, why: 'an occupation: "covered against what it is likely to face" of a town already taken (v3\'s sibling) (W2-WRITE-11)' },
  { seed: 'w5-city-occupied-104', pool: 'DS-DEF-1::readiness ADEQUATE', vid: 2, why: 'an occupation: "looks defended in the ordinary way: enough for the usual trouble" of an occupied city (v3\'s sibling) (W2-WRITE-11)' },
  { seed: 'w5-city-occupied-2', pool: 'DS-DEF-1::readiness ADEQUATE', vid: 4, why: 'an occupation: "has enough for the usual trouble and nothing spare" of an occupied city (v3\'s sibling) (W2-WRITE-11)' },
  { seed: 'w5-city-occupied-1', pool: 'DS-DEF-8::override active, viability intact', vid: 3, why: 'an occupation: "A visitor ... would not guess at the trouble from the streets" beside the occupiers\' checkpoints and curfew (BAR-0 #203, Longyuan)' },
  { seed: 'rww-town-occupied-1', pool: 'DS-DEF-8::override active, viability intact', vid: 2, why: 'an occupation: "the defence makes do with what is left over" of a defence the occupiers hold ("the arms in the town are theirs")' },
  { seed: 'w5-town-occupied-3', pool: 'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)', vid: 5, by: 'record', why: 'an occupation: "nobody is watching its officials" beside "local offices work only under their eye" (BAR-0 #200, Longyuan)' },
  { seed: 'w5-town-occupied-3', pool: 'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)', vid: 9, by: 'record', why: 'an occupation: "nobody at X is watching its officials" (v5\'s sibling, the same claim)' },
  { seed: 'w5-city-occupied-1', pool: 'DS-POW-6::capture pressure ADVANCING (weak security, poor prosperity)', vid: 3, by: 'record', why: 'an occupation: "paid little and watched less" of offices the occupiers watch' },
  { seed: 'w5-metropolis-occupied-2', pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 9, why: 'an occupation: "paying it from money it had put by" where "The occupiers take the revenue" (BAR-0 #205, Longyuan)' },
  { seed: 'w5-town-occupied-3', pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 3, why: 'an occupation: "its defenders are still paid from it" of a defence the occupiers hold' },
  { seed: 'w5-city-occupied-101', pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 12, why: 'an occupation: "its defenders are still paid on time" (v3\'s twin)' },
  { seed: 'w5-city-under_siege-103', pool: 'DS-DEF-2::Economic Survival: STRONG', vid: 9, why: 'a Struggling town: "paying it from money it had put by" off the two lowest prosperity rungs (the chair\'s ruling on BAR-0 #205)' },
];

/** @param {string} seed */
function configOf(seed) {
  const m = seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/);
  if (!m) throw new Error(`a guard seed names its size and crises: ${seed}`);
  return { settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
}

/** @type {Map<string, Record<string, Set<number>>>} */
const READ = new Map();
/** @type {Map<string, object>} */
const FACTS = new Map();
/** @type {Record<string, any>} */
const CORPUS = {};
/** @type {{ variantFactDeclaration?: Function, declarationAdmits?: Function }} */
const RULE = {};

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
  const { composePublicProse, PUBLIC_PROSE_SITES } = await import('../../src/components/new/publicProseCompose.js');
  const { publicVeiledRecordOf } = await import('../../src/domain/display/publicSafe.js');
  const { factsOf } = await import('../../src/domain/facts/factsOf.js');
  const kernel = await import('../../src/domain/display/stateProse/stateProseKernel.js');
  const vocabulary = await import('../../src/domain/facts/factVocabulary.js');
  RULE.variantFactDeclaration = kernel.variantFactDeclaration;
  RULE.declarationAdmits = vocabulary.declarationAdmits;
  for (const desk of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) {
    const leaf = Object.values(await import(`../../src/data/dossierStateProse/${desk}.generated.js`)).find((v) => v && typeof v === 'object');
    for (const [blockId, block] of Object.entries(leaf)) CORPUS[blockId] = block;
  }
  await boundary.loadGenerationLawPayloads();
  for (const seed of new Set(GUARDS.map((g) => g.seed))) {
    let town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    seen.cur = {};
    const ctx = { veiledRecord: publicVeiledRecordOf(town) };
    for (const [, draw] of PUBLIC_PROSE_SITES) {
      try { draw(town, false, ctx); } catch { /* a site that throws prints nothing; the row's own control says so */ }
    }
    READ.set(seed, seen.cur);
    FACTS.set(seed, factsOf(town));
    seen.cur = null;
  }
}, 300000);

describe('a cured line is not eligible in the fixed town that made it false', () => {
  for (const g of GUARDS) {
    it(`${g.pool} v${g.vid} at ${g.seed}: ${g.why}`, () => {
      if (g.by === 'record') {
        const [blockId, ...rest] = g.pool.split('::'); const key = rest.join('::');
        const block = CORPUS[blockId]; const pool = block?.pools?.[key] || [];
        const crisisScoped = block?.poolMeta?.[key]?.crisisScoped === true;
        const admits = (/** @type {any} */ v) => RULE.declarationAdmits?.(RULE.variantFactDeclaration?.(v), FACTS.get(g.seed), { crisisScoped }).admitted;
        expect(pool.filter((v) => v.vid !== g.vid).some(admits), `${g.seed}'s record admits no other line of ${g.pool}: re-key the row`).toBe(true);
        expect(admits(pool.find((v) => v.vid === g.vid)), `${g.pool} v${g.vid} is admitted by ${g.seed}'s record`).toBe(false);
        return;
      }
      const pools = READ.get(g.seed) || {};
      expect(Object.keys(pools), `${g.seed} no longer reads ${g.pool}: re-key the row to a town of the case`).toContain(g.pool);
      expect([...pools[g.pool]], `${g.pool} v${g.vid} is eligible at ${g.seed}`).not.toContain(g.vid);
    });
  }
});
