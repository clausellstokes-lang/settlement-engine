// THE CORPUS-ECO TAIL'S GUARDS (TAIL-CORPUS-ECO, the READ-ALL worklist of 2026-11-14: the economy and general pools,
// DS-ECO-*, DS-GEN-*, DS-SUP-*, cured in docs/content/RECEIPT_POOLS_DOSSIER_STATE.md and the leaves generated from it).
//
// ONE COLLECTED TEST A BATCH, on births: each row is a FIXED census town, born in the census's own configuration
// shape (CENSUS-3 seedcfg.mjs: `r2r-<size>-<i>` random dials, `r2s-<crisis>-<size>-<i>` the one crisis ticked), and
// every dossier prose site drawn as the owner's page draws it (the public sites and the owner's own economy and
// general reads, so a `dm-only` line is read too). The kernel's draw records, per pool, what was eligible and what
// was drawn.
//   GONE rows: a sentence that was false in that town must NOT be drawn there; the row NAMES what is drawn instead
//     (`prints`: a vid of the same pool — two where the public page and the owner's read each draw it — or `null` = the pool is silent there by design). Each was red at the base.
//   KEEP rows: a true sibling that must still be drawn in its town (green before and after), so a cure that silences
//     the pool's true lines reds here too.
// A town that no longer reads the pool reds by name, and the row is re-keyed to a town of the case (by identity, with
// the cause), never dropped.
import { beforeAll, describe, expect, it, vi } from 'vitest';

const seen = vi.hoisted(() => ({ cur: /** @type {Record<string, {e: Set<number>, d: Map<number, string>}>|null} */ (null) }));

vi.mock('../../src/domain/display/stateProse/stateProseKernel.js', async (importOriginal) => {
  const kernel = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...kernel,
    drawVariant: (/** @type {any[]} */ eligible, /** @type {string} */ blockId, /** @type {string} */ poolKey, /** @type {string} */ seed) => {
      const drawn = kernel.drawVariant(eligible, blockId, poolKey, seed);
      if (seen.cur) {
        const row = (seen.cur[`${blockId}::${poolKey}`] ||= { e: new Set(), d: new Map() });
        for (const variant of eligible || []) row.e.add(variant.vid);
        if (drawn) row.d.set(drawn.vid, drawn.text);
      }
      return drawn;
    },
  };
});

/**
 * @typedef {{seed: string, pool: string, gone: RegExp, prints: number|number[]|null, why: string}} GoneRow
 * @typedef {{seed: string, pool: string, keep: number, text: RegExp, why: string}} KeepRow
 */
/** @type {ReadonlyArray<GoneRow>} */
const GONE = [
  // ── BATCH 1 · DS-ECO-12 (the income mix and the critical imports): REWORDED, the draw unmoved (each row prints the same vid) ──
  { seed: 'r2r-hamlet-34', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', gone: /from a single trade/, prints: 1, why: 'no exports and no imports: "comes from a single trade" of a town whose one source is its farm rents (B13238; v1 now "a single source")' },
  { seed: 'r2r-thorp-17', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', gone: /depends on one trade/, prints: 2, why: 'an isolated thorp under a famine, no trade either way: "depends on one trade" (B03337; v2 now "one source of income")' },
  { seed: 'r2r-hamlet-1', pool: 'DS-ECO-12::INCOME MIX: a criminal line is present', gone: /honest traders compete/, prints: 2, why: 'no market: "honest traders compete against it" where no market stands (18271; v2 now claims no traders)' },
  { seed: 'r2r-city-19', pool: 'DS-ECO-12::INCOME MIX: a broad spread, no leader', gone: /brings in a real portion/, prints: 1, why: 'a leader at 19%: "none of them brings in a real portion" where one does by the corpus\'s own scale (DS-ECO-6, a real portion >= 15) (01193)' },
  { seed: 'r2s-famine-thorp-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /produces no \{good\}/, prints: 1, why: 'luxury goods listed as made here: "the country produces no luxury goods" (20338; v1 now "does not give the town enough")' },
  { seed: 'r2s-slave_revolt-city-2', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /None of the \{good\} used/, prints: 2, why: 'gems mined and luxury made here: "None of the luxury goods ... comes from the country here" (14987)' },
  { seed: 'r2s-monster_pressure-thorp-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /produces no \{good\}/, prints: 3, why: 'sacred wood exported: "produces no timber" (20355)' },
  { seed: 'r2r-metropolis-13', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', gone: /produces none/, prints: 1, why: 'grain grown here: "the country around the metropolis produces none" (18237)' },
  { seed: 'r2r-hamlet-12', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', gone: /^Whatever \{good\}/, prints: 2, why: 'a dairy farmer and grazing land: "Whatever livestock ... must come from elsewhere" (28786; v2 now "A good part of")' },
  // ── BATCH 2 · DS-GEN-13/17/18, DS-ECO-6/8/9/10: DECLARED (the replay's inheritor named) or REWORDED (the same vid) ──
  { seed: 'r2s-famine-metropolis-2', pool: 'DS-GEN-13::WAREHOUSES', gone: /fill after the harvest/, prints: 2, why: 'a famine: "warehouses fill after the harvest" of a harvest that failed (12197; v3 + `no crisis: famine`)' },
  { seed: 'r2s-occupied-metropolis-0', pool: 'DS-GEN-17::ADMINISTERED', gone: /keeps its own court and its own gaol/, prints: 3, why: 'an occupation: "keeps its own court and its own gaol" where the occupier holds them (21023; v1 + `no crisis: occupied`)' },
  { seed: 'r2s-succession_void-metropolis-1', pool: 'DS-ECO-8::COMFORTABLE', gone: /stores are more than the season needs/, prints: 2, why: 'a food deficit after imports: "the stores are more than the season needs" (20129; v3 + `food: ≥ secure`)' },
  { seed: 'r2s-under_siege-city-0', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', gone: /the trade that plainly goes on there/, prints: 4, why: 'a siege: "the trade that plainly goes on there" where nothing comes in by road (20457; v5 + `no crisis: under_siege`)' },
  { seed: 'r2s-plague_onset-metropolis-2', pool: 'DS-ECO-10::POSTURE: established', gone: /always something going out/, prints: 1, why: 'a plague: "There is always something going out" where travel is discouraged and goods stop (22618; v2-v6 + `no crisis: plague_onset`)' },
  { seed: 'r2s-plague_onset-metropolis-0', pool: 'DS-ECO-10::POSTURE: established', gone: /Buyers from outside come/, prints: 1, why: 'a plague: "Buyers from outside come to X for more than one thing" (04637)' },
  { seed: 'r2s-plague_onset-hamlet-1', pool: 'DS-ECO-10::POSTURE: established', gone: /The carts that leave/, prints: 1, why: 'a plague: "The carts that leave X carry several kinds of goods" (20138)' },
  { seed: 'r2s-famine-thorp-0', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', gone: /the rest comes in/, prints: 3, why: 'a famine: "the rest comes in from the farms around it and from trade" where the deficit stays uncovered (00639 22223; v2 + `no crisis: famine`)' },
  { seed: 'r2s-plague_onset-city-0', pool: 'DS-ECO-10::POSTURE: entrepot', gone: /Goods come, goods go/, prints: 1, why: 'a plague: "Goods come, goods go" as ordinary trade (09715; v3 + `no crisis: plague_onset`)' },
  { seed: 'r2r-thorp-17', pool: 'DS-ECO-8::STRUGGLING', gone: /Sellers at \{settlement\} give credit/, prints: 2, why: 'no market, no shop: "Sellers ... give credit" (17631; v6 + `market`)' },
  { seed: 'r2s-famine-city-0', pool: 'DS-ECO-8::STRUGGLING', gone: /shows in small things/, prints: 1, why: 'a famine: "The shortage shows in small things" of hunger (21997; v3 + `no crisis: hunger`, the fact atom: a `no hunger` MARK would ask the desk for a dimension it does not hand)' },
  { seed: 'r2r-thorp-17', pool: 'DS-GEN-13::NO-MARKET', gone: /house to house and on the road/, prints: 3, why: 'an isolated thorp: trade "on the road" (14619; v3 reworded "done house to house")' },
  { seed: 'r2r-hamlet-10', pool: 'DS-GEN-18::BOUGHT-IN', gone: /^Much of what changes hands/, prints: 9, why: 'two imports: "Much of what changes hands ... came from somewhere else" (14079; v9 "Some of")' },
  { seed: 'r2r-town-12', pool: 'DS-GEN-13::MARKET-NARROW', gone: /buys mostly what it makes itself/, prints: 2, why: 'grain, wool, dairy brought in: "buys mostly what it makes itself" (00473; v2 reworded)' },
  { seed: 'r2r-village-11', pool: 'DS-GEN-13::COMMERCE: a market, no guild', gone: /No guild runs/, prints: 2, why: 'a guild power: "No guild runs X\'s market" (14605; v2 "No guild keeps a house at")' },
  { seed: 'r2r-city-12', pool: 'DS-ECO-10::POSTURE: entrepot', gone: /Very little of what leaves began here/, prints: 2, why: 'every export made here: "Very little of what leaves began here" (23392; v2 reworded)' },
  { seed: 'r2r-thorp-33', pool: 'DS-ECO-8::PROSPEROUS', gone: /its halls and its defences/, prints: 1, why: 'no defence and no hall on the record: "spends it on its halls and its defences" (00755, the bar\'s #168; v1 reworded)' },
  // ── BATCH 3 · the economy desk's header, shadow, strategic, wealth, posture and food lines (TAIL-CORPUS-ECO-2): DECLARED (the replay's inheritor) or REWORDED (the same vid) ──
  { seed: 'r2r-thorp-0', pool: 'DS-ECO-1::COMBINATION C3: the middle rungs', gone: /thin margin/, prints: 2, why: 'Comfortable: "gets by on a thin margin" a rung above the margin (00583; v2 reworded: a declaration would leave a Comfortable calm town with no market and no {complexity} mute)' },
  { seed: 'r2s-famine-city-1', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', gone: /market sells little/, prints: 3, why: 'daily markets, fairs, a caravan exchange: "the market sells little" (01572; v3 reworded)' },
  { seed: 'r2r-thorp-17', pool: 'DS-ECO-1::COMBINATION C5: a low rung on a narrow approach', gone: /feeds it and no more/, prints: 3, why: 'a famine, 64% short: "feeds it and no more" (01191; v2 + `food: ≥ secure · no crisis: under_siege`)' },
  { seed: 'r2r-village-43', pool: 'DS-ECO-1::COMBINATION C5: a low rung on a narrow approach', gone: /feeds it and no more/, prints: 1, why: 'a siege, 71% short (01181)' },
  { seed: 'r2s-insurgency-hamlet-0', pool: 'DS-ECO-6::TIER: a large share off the books (≥30)', gone: /duties collected/, prints: 1, why: 'no market, no office: "The duties collected fall well short" (20456; v1 reworded)' },
  { seed: 'r2r-hamlet-17', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', gone: /outside the rolls/, prints: [6, 1], why: 'the public page draws v6, the owner\'s v1 (dm-only); no market, no office: "sits outside the rolls ... pay their duties" (02935; v1 reworded)' },
  { seed: 'r2r-hamlet-0', pool: 'DS-ECO-6::TIER: minor shadow activity (≥3)', gone: /annoy the clerks/, prints: 1, why: 'no office, no clerk: "small enough to annoy the clerks" (02770; v1 reworded)' },
  { seed: 'r2s-under_siege-city-1', pool: 'DS-ECO-11::STRATEGIC VALUE: the generator\'s assessment, framed', gone: /A newcomer to/, prints: 3, why: 'a siege: "A newcomer soon hears" where nobody arrives (B02776; v4 + `no crisis: under_siege`)' },
  { seed: 'r2r-village-2', pool: 'DS-ECO-8::WEALTHY', gone: /reserves deep enough/, prints: 3, why: 'two months of stores: "reserves deep enough to ride out most of what could happen" (B00791; v1 + `stores: ≥ 3`)' },
  { seed: 'r2s-occupied-town-2', pool: 'DS-ECO-10::POSTURE: none', gone: /the town uses/, prints: 2, why: 'an occupation, the occupier levying: "What the town makes, the town uses" (B27697; v1 + `no crisis: occupied`)' },
  { seed: 'r2s-occupied-village-1', pool: 'DS-ECO-10::POSTURE: none', gone: /surplus there is stays/, prints: 2, why: 'an occupation: "Whatever surplus there is stays" (v3 + `no crisis: occupied`)' },
  { seed: 'r2r-town-42', pool: 'DS-ECO-9::PRESSURED', gone: /grows a little less food/, prints: 1, why: 'grows 69% and buys the rest bar 6%: "grows a little less food than it needs" (00588; v1 reworded)' },
  { seed: 'r2s-wartime-thorp-3', pool: 'DS-ECO-9::IMPORT-DEPENDENT', gone: /bought rather than grown/, prints: 1, why: 'isolated, nothing imported, 17% short: "bought rather than grown ... a trade item" (03095 22253; v1 reworded)' },
  { seed: 'r2s-occupied-village-1', pool: 'DS-ECO-9::IMPORT-DEPENDENT', gone: /fed and dependent/, prints: 3, why: 'HIGH: 21% short, not viable: "is fed ... Nothing about the arrangement is failing" (00991 15068; v3 reworded)' },
  { seed: 'r2s-under_siege-hamlet-2', pool: 'DS-ECO-9::FOOD SOURCES: several, the largest named', gone: /the others carry it/, prints: 1, why: 'a siege, 35% short: "the others carry it" (20660; v2 + `food: ≥ secure`)' },
  { seed: 'r2r-thorp-41', pool: 'DS-ECO-9::FOOD SOURCES: several, the largest named', gone: /without going hungry/, prints: 1, why: 'already short: "can take a bad season ... without going hungry" (28996; v3 + `food: ≥ secure`)' },
  { seed: 'r2r-city-31', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', gone: /Food carts/, prints: 1, why: 'a river town, its food by boat: "Food carts come in most days" (09248; v1 reworded)' },
];
/** @type {ReadonlyArray<KeepRow>} */
const KEEP = [
  // ── BATCH 1 · DS-ECO-12: the reworded line still draws in its pool's other towns (its unchanged stem, green before and after) ──
  { seed: 'r2s-wartime-village-1', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', keep: 1, text: /^More than half of what \{settlement\} earns comes from a single/, why: 'a village at war, its farm rents over half its income' },
  { seed: 'r2s-mass_migration-town-2', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', keep: 2, text: /^Almost everyone's living at \{settlement\} depends on one/, why: 'the largest town v2 reaches' },
  { seed: 'r2s-wartime-metropolis-3', pool: 'DS-ECO-12::INCOME MIX: a criminal line is present', keep: 2, text: /^Some of the money in \{settlement\} is made outside the law/, why: 'a metropolis with a criminal line under its market' },
  { seed: 'r2s-famine-town-1', pool: 'DS-ECO-12::INCOME MIX: a broad spread, no leader', keep: 1, text: /^\{settlement\} lives on many/, why: 'a famine town, no source near half' },
  { seed: 'r2s-wartime-city-1', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 1, text: /^The country around \{settlement\}/, why: 'a city at war' },
  { seed: 'r2r-thorp-12', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 2, text: /of the \{good\} used at \{settlement\} comes from the country here/, why: 'the smallest it reaches' },
  { seed: 'r2s-wartime-hamlet-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 3, text: /so the town must look elsewhere/, why: 'a hamlet at war, no imports' },
  { seed: 'r2s-occupied-town-0', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', keep: 1, text: /^Some of \{settlement\}'s work cannot go on without \{good\}/, why: 'an occupied town' },
  { seed: 'r2s-wartime-metropolis-1', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', keep: 2, text: /must come from elsewhere; when none comes, that work stands idle/, why: 'a metropolis at war' },
  // ── BATCH 2 · the declared lines still draw where their towns bear them; the reworded keep their stem ──
  { seed: 'r2r-metropolis-7', pool: 'DS-GEN-13::WAREHOUSES', keep: 3, text: /fill after the harvest/, why: 'no famine' },
  { seed: 'r2r-metropolis-58', pool: 'DS-GEN-17::ADMINISTERED', keep: 1, text: /keeps its own court and its own gaol/, why: 'no occupation' },
  { seed: 'r2r-metropolis-58', pool: 'DS-ECO-8::COMFORTABLE', keep: 3, text: /stores are more than the season needs/, why: 'its food secure' },
  { seed: 'r2r-metropolis-8', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', keep: 5, text: /plainly goes on there/, why: 'no siege' },
  { seed: 'r2r-metropolis-39', pool: 'DS-ECO-10::POSTURE: established', keep: 3, text: /always something going out/, why: 'no plague' },
  { seed: 'r2r-metropolis-7', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', keep: 2, text: /the rest comes in/, why: 'no famine' },
  { seed: 'r2r-metropolis-7', pool: 'DS-ECO-10::POSTURE: entrepot', keep: 3, text: /Goods come, goods go/, why: 'no plague' },
  { seed: 'r2r-town-19', pool: 'DS-ECO-8::STRUGGLING', keep: 6, text: /give credit/, why: 'a market stands' },
  { seed: 'r2r-town-5', pool: 'DS-ECO-8::STRUGGLING', keep: 3, text: /shows in small things/, why: 'no hunger' },
  { seed: 'r2r-village-9', pool: 'DS-GEN-13::NO-MARKET', keep: 3, text: /^No market or fair stands in \{settlement\}: what trade the town does is done house to house/, why: 'the stem' },
  { seed: 'r2r-metropolis-46', pool: 'DS-GEN-18::BOUGHT-IN', keep: 9, text: /of what changes hands at \{settlement\} came from somewhere else first/, why: 'the stem' },
  { seed: 'r2r-metropolis-9', pool: 'DS-GEN-13::MARKET-NARROW', keep: 2, text: /people trade with each other/, why: 'the stem' },
  { seed: 'r2r-village-55', pool: 'DS-GEN-13::COMMERCE: a market, no guild', keep: 2, text: /the stall fee/, why: 'the stem' },
  { seed: 'r2r-metropolis-57', pool: 'DS-ECO-10::POSTURE: entrepot', keep: 2, text: /^The trade here is in the moving of things/, why: 'the stem' },
  { seed: 'r2r-metropolis-9', pool: 'DS-ECO-8::PROSPEROUS', keep: 1, text: /^\{settlement\} has money to spend/, why: 'the stem' },
  // ── BATCH 3 (TAIL-CORPUS-ECO-2) ──
  { seed: 'r2r-hamlet-12', pool: 'DS-ECO-1::COMBINATION C3: the middle rungs', keep: 2, text: /^\{settlement\} /, why: 'Moderate: the same vid' },
  { seed: 'r2r-town-18', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', keep: 3, text: /\{access\} is busy/, why: 'the stem (old and new wording)' },
  { seed: 'r2r-thorp-21', pool: 'DS-ECO-1::COMBINATION C5: a low rung on a narrow approach', keep: 2, text: /feeds it and no more/, why: 'food secure, no siege' },
  { seed: 'r2r-metropolis-4', pool: 'DS-ECO-6::TIER: a large share off the books (≥30)', keep: 1, text: /^A large share of what \{settlement\} earns/, why: 'the stem' },
  { seed: 'r2r-city-17', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', keep: 1, text: /^A real portion of \{settlement\}'s trade/, why: 'the stem' },
  { seed: 'r2r-hamlet-1', pool: 'DS-ECO-6::TIER: minor shadow activity (≥3)', keep: 1, text: /^A little of \{settlement\}'s trade/, why: 'the stem' },
  { seed: 'r2r-city-11', pool: 'DS-ECO-11::STRATEGIC VALUE: the generator\'s assessment, framed', keep: 4, text: /A newcomer to/, why: 'no siege' },
  { seed: 'r2r-metropolis-16', pool: 'DS-ECO-8::WEALTHY', keep: 1, text: /reserves deep enough/, why: 'fifteen months of stores' },
  { seed: 'r2r-hamlet-25', pool: 'DS-ECO-10::POSTURE: none', keep: 1, text: /the town uses/, why: 'no occupation' },
  { seed: 'r2r-hamlet-43', pool: 'DS-ECO-10::POSTURE: none', keep: 3, text: /surplus there is stays/, why: 'no occupation' },
  { seed: 'r2r-hamlet-49', pool: 'DS-ECO-9::PRESSURED', keep: 1, text: /every season the difference/, why: 'the stem' },
  { seed: 'r2s-slave_revolt-hamlet-3', pool: 'DS-ECO-9::IMPORT-DEPENDENT', keep: 1, text: /^A substantial part of what \{settlement\}/, why: 'the stem' },
  { seed: 'r2r-village-50', pool: 'DS-ECO-9::IMPORT-DEPENDENT', keep: 3, text: /everything (about it )?rests on/, why: 'the stem' },
  { seed: 'r2r-city-14', pool: 'DS-ECO-9::FOOD SOURCES: several, the largest named', keep: 3, text: /without going hungry/, why: 'food secure' },
  { seed: 'r2r-city-27', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', keep: 1, text: /a good part of what the town eats is grown elsewhere and brought in/, why: 'the stem' },
];

/** CENSUS-3 seedcfg.mjs's r2r-/r2s- arms, verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  throw new Error(`a guard seed is a census seed: ${seed}`);
}

/** @type {Map<string, Record<string, {e: Set<number>, d: Map<number, string>}>>} */
const READ = new Map();

beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  const { withPublicProse } = await import('../../src/domain/display/publicProse.js');
  const { composePublicProse, PUBLIC_PROSE_SITES } = await import('../../src/components/new/publicProseCompose.js');
  const { publicVeiledRecordOf } = await import('../../src/domain/display/publicSafe.js');
  const { economyDeskRead } = await import('../../src/components/new/economyDeskRead.js');
  const { generalDeskLines } = await import('../../src/components/new/generalDeskRead.js');
  const { economicsDeskArgs } = await import('../../src/components/new/deskHostArgs.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of new Set([...GONE, ...KEEP].map((g) => g.seed))) {
    let town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town));
    seen.cur = {};
    const ctx = { veiledRecord: publicVeiledRecordOf(town) };
    for (const [, draw] of PUBLIC_PROSE_SITES) {
      try { draw(town, false, ctx); } catch { /* a site that throws prints nothing; the row's own control says so */ }
    }
    // the owner's own reads (playerView false): the `dm-only` lines the owner's page prints
    try { economyDeskRead(town, { publicDossier: false, playerView: false, tier: town?.tier, ...economicsDeskArgs(town) }); } catch { /* as above */ }
    try { generalDeskLines(town, { publicDossier: false, playerView: false, tier: town?.tier }); } catch { /* as above */ }
    READ.set(seed, seen.cur);
    seen.cur = null;
  }
}, 600000);

describe('a cured sentence is not drawn in the census town that made it false; what is drawn instead is named', () => {
  for (const g of GONE) {
    it(`${g.pool} at ${g.seed}: ${g.why}`, () => {
      const pools = READ.get(g.seed) || {};
      expect(Object.keys(pools), `${g.seed} no longer reads ${g.pool}: re-key the row to a town of the case`).toContain(g.pool);
      const drawn = [...pools[g.pool].d.entries()];
      for (const [vid, text] of drawn) expect(text, `${g.pool} v${vid} at ${g.seed}`).not.toMatch(g.gone);
      expect(drawn.map(([vid]) => vid), `what ${g.pool} draws at ${g.seed}`).toEqual(g.prints === null ? [] : [g.prints].flat());
    });
  }
});

describe('a true sibling of each cured sentence still draws in its town', () => {
  for (const k of KEEP) {
    it(`${k.pool} v${k.keep} at ${k.seed}: ${k.why}`, () => {
      const pools = READ.get(k.seed) || {};
      expect(Object.keys(pools), `${k.seed} no longer reads ${k.pool}: re-key the row`).toContain(k.pool);
      const text = pools[k.pool].d.get(k.keep);
      expect(text, `${k.pool} v${k.keep} is drawn at ${k.seed}`).toBeTypeOf('string');
      expect(text).toMatch(k.text);
    });
  }
});
