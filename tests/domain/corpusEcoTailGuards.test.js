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
import { STATE_LEAVES, variantByVid } from '../helpers/drawnProse.js';

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
/**
 * A member's own authored text, as the kernel's draw record holds it (its {slots} unfilled), COMPUTED through
 * tests/helpers/drawnProse.js (TAIL-CLOSE-TESTS-C) rather than spelled as a literal: a rewording moves the member and the
 * anchor together, and the row's claim (which vid is, or is not, drawn in that town) is unchanged.
 * @param {string} pool `<blockId>::<poolKey>` @param {number} vid @returns {RegExp} the whole member, exactly
 */
function memberRe(pool, vid) {
  const at = pool.indexOf('::');
  const blockId = pool.slice(0, at);
  const poolKey = pool.slice(at + 2);
  const leaf = /** @type {Record<string, string>} */ ({ GEN: 'general', ECO: 'economy' })[blockId.split('-')[1]];
  const member = (STATE_LEAVES[leaf][blockId].pools[poolKey] || []).find((/** @type {any} */ v) => v.vid === vid);
  const slots = Object.fromEntries((member?.slots || []).map((/** @type {string} */ name) => [name, `{${name}}`]));
  const text = variantByVid({ leaf, blockId, poolKey, vid, slots });
  return new RegExp(`^${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`);
}
const MARKET_NO_GUILD = 'DS-GEN-13::COMMERCE: a market, no guild';
/** @type {ReadonlyArray<GoneRow>} */
const GONE = [
  // ── BATCH 1 · DS-ECO-12 (the income mix and the critical imports): REWORDED, the draw unmoved (each row prints the same vid) ──
  { seed: 'r2r-hamlet-34', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', gone: /from a single trade/, prints: 1, why: 'no exports and no imports: "comes from a single trade" of a town whose one source is its farm rents (B13238; v1 now "a single source")' },
  { seed: 'r2r-thorp-17', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', gone: /depends on one trade/, prints: 2, why: 'an isolated thorp under a famine, no trade either way: "depends on one trade" (B03337; v2 now "one source of income")' },
  { seed: 'r2r-hamlet-1', pool: 'DS-ECO-12::INCOME MIX: a criminal line is present', gone: /honest traders compete/, prints: 2, why: 'no market: "honest traders compete against it" where no market stands (18271; v2 now claims no traders)' },
  // TAIL-CLOSE-SWEEP-C (2026-11-15): RE-KEYED by identity from r2r-city-19: 9cc8c6826 (TAIL-DEFECON-5 R2, one shadow figure, a DECLARED
  // MOVE) holds its smuggling row at the capture, 23%: its leader passed 20 and it reads "two or three sources" now. r2r-city-18 is the case: a city, a leader at 19%, v1 drawn
  { seed: 'r2r-city-18', pool: 'DS-ECO-12::INCOME MIX: a broad spread, no leader', gone: /brings in a real portion/, prints: 1, why: 'a leader at 19%: "none of them brings in a real portion" where one does by the corpus\'s own scale (DS-ECO-6, a real portion >= 15) (01193; re-keyed from r2r-city-19, 9cc8c6826)' },
  { seed: 'r2s-famine-thorp-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /produces no \{good\}/, prints: 1, why: 'luxury goods listed as made here: "the country produces no luxury goods" (20338; v1 now "does not give the town enough")' },
  { seed: 'r2s-slave_revolt-city-2', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /None of the \{good\} used/, prints: 2, why: 'gems mined and luxury made here: "None of the luxury goods ... comes from the country here" (14987)' },
  { seed: 'r2s-monster_pressure-thorp-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /produces no \{good\}/, prints: 3, why: 'sacred wood exported: "produces no timber" (20355)' },
  { seed: 'r2r-metropolis-13', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', gone: /produces none/, prints: 1, why: 'grain grown here: "the country around the metropolis produces none" (18237)' },
  // RE-KEYED BY IDENTITY 2026-11-18 (LEFT-KEYS K5, R8), ON A CONSTRUCTED RECORD: r2r-hamlet-12 no longer reads this pool (the
  // supply rule, BIRTH-3, left its critical imports stone and salt, the terrain's form). NO BORN TOWN BEARS THE CASE: no town of
  // the 720 or the 150 reads this pool for a good a live ground of its own land gives in part. So the claim is held on
  // r2r-village-4 (a Dairy farmer beside live grazing land, and this pool's v2 drawn for its Sawmill's timber) with livestock
  // "Required by Dairy farmer" put first among its critical imports (`CONSTRUCTED` below): the same case as the row was read in.
  // RE-KEYED BY IDENTITY 2026-11-18 (BAR8-DESKS-2, the chair's ruling BR35 (b), R8): BAR8-DESKS-ECO's atom `critical import
  // brought in` reads whether the good arrives, and K5's record brought no livestock in, so its twin v4 drew there. K5's claim
  // stays on a record that BRINGS THE LIVESTOCK IN (v2 draws, the old words gone); the record with nothing of it brought in is
  // the second row: v4 draws, and the words BR35 (a) corrected ("needs {good} that the country around it does not give",
  // false beside live grazing land) are gone ("needs more {good} than the country around it gives").
  { seed: 'r2r-village-4', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', gone: /^Whatever \{good\}/, prints: 2, why: 'a dairy farmer and grazing land (a constructed record, the livestock brought in): "Whatever livestock ... must come from elsewhere" (28786; v2 now "A good part of"; re-keyed from r2r-hamlet-12)' },
  { seed: 'r2r-village-4', as: 'nothing brought in', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', gone: /that the country around it does not give,/, prints: 4, why: 'a dairy farmer and grazing land, none of the livestock brought in (a constructed record): "needs {good} that the country around it does not give" beside live grazing land (BR35: v4 now "needs more {good} than the country around it gives")' },
  // ── BATCH 2 · DS-GEN-13/17/18, DS-ECO-6/8/9/10: DECLARED (the replay's inheritor named) or REWORDED (the same vid) ──
  { seed: 'r2s-famine-metropolis-2', pool: 'DS-GEN-13::WAREHOUSES', gone: /fill after the harvest/, prints: 2, why: 'a famine: "warehouses fill after the harvest" of a harvest that failed (12197; v3 + `no crisis: famine`)' },
  { seed: 'r2s-occupied-metropolis-0', pool: 'DS-GEN-17::ADMINISTERED', gone: /keeps its own court and its own gaol/, prints: 3, why: 'an occupation: "keeps its own court and its own gaol" where the occupier holds them (21023; v1 + `no crisis: occupied`)' },
  { seed: 'r2s-succession_void-metropolis-1', pool: 'DS-ECO-8::COMFORTABLE', gone: /stores are more than the season needs/, prints: 2, why: 'a food deficit after imports: "the stores are more than the season needs" (20129; v3 + `food: ≥ secure`)' },
  { seed: 'r2s-under_siege-city-0', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', gone: /the trade that plainly goes on there/, prints: 8, why: 'a siege: "the trade that plainly goes on there" where nothing comes in by road (20457; v5 + `no crisis: under_siege`; re-keyed by batch 5: v4, its inheritor, is false under a siege too, C13, and the siege twin v8 draws)' },
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
  { seed: 'r2r-village-11', pool: 'DS-GEN-13::COMMERCE: a market, no guild', gone: /No guild runs/, prints: 5, why: 'a guild power: "No guild runs X\'s market" (14605; v2 "No guild keeps a house at") RE-KEYED by identity, batch 7: v1 "without a guild\'s leave" is false beside the guild power too; the twin v5 draws)' },
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
  // RE-KEYED (BAR5-FOOD, 2026-11-16, the chair's FD1: the rung and the `food` atom read the band the page prints): an import-dependent band with nothing imported prints Deficit, so no town of the 720 reads IMPORT-DEPENDENT with nothing imported (0 of 720): the same town and gone text, read in the rung it prints.
  { seed: 'r2s-wartime-thorp-3', pool: 'DS-ECO-9::DEFICIT', gone: /bought rather than grown/, prints: 2, why: 'isolated, nothing imported, 17% short: "bought rather than grown ... a trade item" (03095 22253; v1 reworded)' },
  { seed: 'r2s-occupied-village-1', pool: 'DS-ECO-9::IMPORT-DEPENDENT', gone: /fed and dependent/, prints: 3, why: 'HIGH: 21% short, not viable: "is fed ... Nothing about the arrangement is failing" (00991 15068; v3 reworded)' },
  // RE-KEYED BY IDENTITY (BAR4-CORPUS-ECO, 2026-11-16): the same town and the same gone text; what prints instead is the siege twin v7 (`crisis: under_siege`): v1 now refuses a siege.
  { seed: 'r2s-under_siege-hamlet-2', pool: 'DS-ECO-9::FOOD SOURCES: several, the largest named', gone: /the others carry it/, prints: 7, why: 'a siege, 35% short: "the others carry it" (20660; v2 + `food: ≥ secure`)' },
  // RE-KEYED (BAR5-FOOD, 2026-11-16, the chair's FD1: the rung and the `food` atom read the band the page prints): what prints instead is the pressured twin v9 (v1 now declares `food: ≥ secure`).
  { seed: 'r2r-thorp-41', pool: 'DS-ECO-9::FOOD SOURCES: several, the largest named', gone: /without going hungry/, prints: 9, why: 'already short: "can take a bad season ... without going hungry" (28996; v3 + `food: ≥ secure`)' },
  { seed: 'r2r-city-31', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', gone: /Food carts/, prints: 1, why: 'a river town, its food by boat: "Food carts come in most days" (09248; v1 reworded)' },
  // ── BATCH 4 · the chair's ruling C12, the siege's sea exception: the two siege lines claim the roads, not every way in (REWORDED, the same vid) ──
  { seed: 'r2s-under_siege-city-0', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', gone: /every way in/, prints: 4, why: 'a besieged port the sea keeps open (food by ship): "the siege closing every way in" (C12; v4 now "closing the roads")' },
  { seed: 'r2s-under_siege-city-0', pool: 'DS-ECO-9::IMPORT-DEPENDENT', gone: /since the siege closed the roads/, prints: 5, why: 'the same port: "none of it has come since the siege closed the roads" where ships bring food (C12; v5 now "none of it has come by road")' },
  // ── BATCH 5 · the chair's ruling C13 (TAIL-CORPUS-ECO-3: faults in the group's own new lines) and DS-GEN-13 ENTREPOT, DS-GEN-14 FOUNDED-YOUNG ──
  { seed: 'r2r-thorp-45', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /so the town buys in what it needs/, prints: 1, why: 'a siege: "so the town buys in what it needs" where nothing comes in (C13 A; v1 now claims the lack alone)' },
  { seed: 'r2r-thorp-21', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', gone: /brings in the rest/, prints: 2, why: 'isolated, the good on no import list: "the town brings in the rest" (C13 A; v2 now claims the lack alone)' },
  { seed: 'r2r-thorp-11', pool: 'DS-ECO-10::POSTURE: entrepot', gone: /yards are as busy as its workshops/, prints: 3, why: 'a thorp whose one house is access to a mill elsewhere: "yards as busy as its workshops" (C13 B; v2 + `tier: ≥ village`)' },
  { seed: 'r2s-occupied-city-0', pool: 'DS-ECO-10::POSTURE: entrepot', gone: /yards are as busy as its workshops/, prints: 3, why: 'an occupation (C13 B; v2 + `no crisis: occupied`)' },
  { seed: 'r2s-plague_onset-hamlet-0', pool: 'DS-ECO-10::POSTURE: entrepot', gone: /yards are as busy as its workshops/, prints: 1, why: 'a plague: no line gathers a crowd (C13 B, Y8; v2 + `no crisis: plague_onset`)' },
  { seed: 'r2r-village-11', pool: 'DS-GEN-13::COMMERCE: a market, no guild', gone: /No guild keeps a house at/, prints: 5, why: 'a guild power stands: "No guild keeps a house at the market" (C13 C; v2 + `no guild`) RE-KEYED by identity, batch 7: v1 "without a guild\'s leave" is false beside the guild power too; the twin v5 draws)' },
  { seed: 'r2s-indebted-city-1', pool: 'DS-ECO-8::PROSPEROUS', gone: /has money to spend, and spends it/, prints: 2, why: 'indebted to an outside power: "has money to spend, and spends it" (C13 C; v1 + `no crisis: indebted`)' },
  { seed: 'r2s-under_siege-town-2', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', gone: /price a buyer is quoted depends on whether a duty/, prints: 8, why: 'a siege: duties on goods that cannot come in (C13 C; v4 + `no crisis: under_siege`, the siege twin v8)' },
  { seed: 'r2s-under_siege-town-0', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', gone: /merchants who pay their duties and guild fees are undersold/, prints: [8, 2], why: 'a siege (C13 C; v0 + `no crisis: under_siege`)' },
  { seed: 'r2s-plague_onset-city-0', pool: 'DS-GEN-13::ENTREPOT', gone: /handles more than the town could ever use/, prints: 2, why: 'a quarantine: the market "handles more than the city could ever use" (01563; v1 + `no crisis: plague_onset`)' },
  { seed: 'r2s-occupied-hamlet-0', pool: 'DS-GEN-14::FOUNDED-YOUNG', gone: /still does the job it began with/, prints: 2, why: 'founded a stronghold, now undefended and occupied: "still does the job it began with" (07396; v2 reworded, v1 with it)' },
  // ── BATCH 6 · DS-ECO-11 EXPLOITATION unexploited, DS-GEN-18 UNWORKED: REWORDED (the same vid): every printing town lists the resource as made here and exports none ──
  { seed: 'r2r-city-44', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: medium or low', gone: /nobody has found it worth the trouble/, prints: 3, why: 'stone made here and walls of local stone: "nobody has found it worth the trouble" (09301; v3 now "worth selling beyond the town")' },
  { seed: 'r2r-village-58', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: medium or low', gone: /nobody has ever thought it worth the trouble/, prints: 2, why: 'stone made here: "nobody has ever thought it worth the trouble" (22666)' },
  { seed: 'r2r-city-14', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: medium or low', gone: /leaves its \{resource\} unworked/, prints: 1, why: 'stone made here: "leaves its stone unworked" (v1, the same claim)' },
  { seed: 'r2s-famine-thorp-2', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: high', gone: /nothing in the town works it/, prints: 1, why: 'iron ore made here: "nothing in the thorp works it" (22626)' },
  { seed: 'r2r-village-30', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: high', gone: /lies unworked/, prints: 2, why: 'iron ore made here: "lies unworked" (03918)' },
  { seed: 'r2s-plague_onset-village-3', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: high', gone: /nobody in this town is working it/, prints: 3, why: 'iron ore made here: "nobody in this village is working it" (07347)' },
  { seed: 'r2r-thorp-18', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: high', gone: /to start the work/, prints: 4, why: 'iron ore made here: "what it lacks is a house to start the work" (v4, the same claim)' },
  { seed: 'r2s-occupied-thorp-1', pool: 'DS-GEN-18::UNWORKED', gone: /goes unworked/, prints: 1, why: 'timber made here: "The timber around X goes unworked" (22267; v1 now "No house at X makes a trade of the timber around it")' },
  { seed: 'r2r-thorp-41', pool: 'DS-GEN-18::BOUGHT-IN', gone: /not at anyone in the town/, prints: 4, why: 'medicinal herbs made here and bought in: "pointed at the carts, not at anyone in the thorp" (04027; v4 reworded)' },
  { seed: 'r2s-under_siege-village-1', pool: 'DS-ECO-11::RESOURCE CONDITION: worked out, recovers in time', gone: /bothers with the/, prints: 2, why: 'a working Fisher\'s landing: "Nobody bothers with the river fisheries ... turned to other work" (14849; v2 now claims the record\'s depletion alone)' },
  // ── BATCH 7 (ruling C19: two reads of fresh towns): DECLARED (by replay, the inheritor named) or REWORDED (the same vid) ──
  { seed: 'r2r-city-14', pool: 'DS-ECO-11::RESOURCE CONDITION: worked out, recovers in time', gone: /^The \{resource\} at \{settlement\} is worked out/, prints: 2, why: 'batch 6\'s own new line read in its after run: "The fishing grounds at X is worked out" (a plural slot made the subject of "is"; v2 now "Little is left worth taking from the {resource}")' },
  { seed: 'r2r-thorp-31', pool: 'DS-ECO-6::TIER: minor shadow activity (≥3)', gone: /^A little of /, prints: [0, 1], why: 'no illicit income source on the record (farm rents 100%): "A little of X\'s trade is done out of sight" (C19; v1 now "If any of ... is done out of sight")' },
  { seed: 'r2r-thorp-23', pool: 'DS-ECO-1::COMBINATION C5: a low rung on a narrow approach', gone: /too poor to mend its road/, prints: 3, why: 'an isolated thorp with no road trade: "the road brings in too little" (C19; v3 now "poor and hard to reach")' },
  { seed: 'r2s-occupied-town-3', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', gone: /little of what passes leaves its money/, prints: 3, why: 'river tolls the first income: "little of what passes leaves its money here" (C19; v3 now claims the busy route and the poverty only)' },
  { seed: 'r2s-indebted-city-1', pool: 'DS-ECO-1::COMBINATION C1: a high rung on a working approach', gone: /money to spare/, prints: 4, why: 'indebted to an outside power: "ends each year with money to spare" (C19; v2 + `no crisis: indebted`, the twin v4)' },
  { seed: 'r2r-thorp-11', pool: 'DS-ECO-10::POSTURE: entrepot', gone: /living is the road/, prints: 3, why: 'farm rents 76% of the income: "The town\'s living is the road" (C19; v3 now claims the goods passing and the town\'s part)' },
  { seed: 'r2r-hamlet-15', pool: MARKET_NO_GUILD, gone: memberRe(MARKET_NO_GUILD, 3), prints: 5, why: 'a Merchant Guilds power, Dominant: "no guild between seller and buyer" (C19; v3 + `no guild`, the twin v5)' },
  { seed: 'r2r-village-0', pool: MARKET_NO_GUILD, gone: memberRe(MARKET_NO_GUILD, 1), prints: 5, why: 'a guild power stands: "without a guild\'s leave" (C19; v1 + `no guild`, the twin v5)' },
  { seed: 'r2s-occupied-village-2', pool: MARKET_NO_GUILD, gone: memberRe(MARKET_NO_GUILD, 4), prints: 5, why: 'an occupation and a guild power: "with nobody\'s leave but the stall-keeper\'s" (C19; v4 + `no guild · no crisis: occupied`, the twin v5)' },
  // ── BATCH 8 (ruling C20: a lone food source is not "the whole" beside a farm house or a harvest income; no atom reads that gate, so the family is REWORDED to the twin's claim, "first") ──
  // RE-KEYED BY IDENTITY (BAR4-CORPUS-ECO, 2026-11-16): the same town and the same gone text; what prints instead is the own-plots twin v6 (the chair's FW1): v1-v3 now refuse `own plots`.
  { seed: 'r2r-thorp-3', pool: 'DS-ECO-9::FOOD SOURCES: one source', gone: /and little else/, prints: 6, why: 'a farm house or a harvest income beside the one named source: "comes from its {good} and little else" (C20; v1 now "comes first of all from its {good}")' },
  // RE-KEYED BY IDENTITY (BAR4-CORPUS-ECO, 2026-11-16): the same town and the same gone text; what prints instead is the own-plots twin v7.
  { seed: 'r2r-thorp-9', pool: 'DS-ECO-9::FOOD SOURCES: one source', gone: /all goes back to the/, prints: 7, why: 'the same: "all goes back to the {good}" (C20; v2 now "its {good} comes first")' },
  // RE-KEYED BY IDENTITY (BAR4-CORPUS-ECO, 2026-11-16): the same town and the same gone text; what prints instead is the own-plots twin v6.
  { seed: 'r2r-thorp-8', pool: 'DS-ECO-9::FOOD SOURCES: one source', gone: /little food of its own but/, prints: 6, why: 'the same: "has little food of its own but its {good}" (C20; v3 now "leans first on its {good}")' },
];
/** @type {ReadonlyArray<KeepRow>} */
const KEEP = [
  // ── BATCH 1 · DS-ECO-12: the reworded line still draws in its pool's other towns (its unchanged stem, green before and after) ──
  { seed: 'r2s-wartime-village-1', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', keep: 1, text: /^More than half of what \{settlement\} earns comes from a single/, why: 'a village at war, its farm rents over half its income' },
  // TAIL-CLOSE-SWEEP-C (2026-11-15): RE-KEYED by identity from r2s-mass_migration-town-2 (its smuggling row held at 33% by 9cc8c6826, a
  // DECLARED MOVE: "two or three sources" now): no town or larger draws v2 on the 720 now; the largest it reaches is a village
  { seed: 'r2s-mass_migration-village-0', pool: 'DS-ECO-12::INCOME MIX: one source carries the town', keep: 2, text: memberRe('DS-ECO-12::INCOME MIX: one source carries the town', 2), why: 'the largest town v2 reaches (a village since 9cc8c6826)' },
  // TAIL-CLOSE-SWEEP-C (2026-11-15): RE-KEYED by identity from r2s-wartime-metropolis-3 (its syndicate row held at 21% by 9cc8c6826, a
  // DECLARED MOVE: "the criminal line leads" now): r2r-metropolis-27, a criminal syndicate at 20%, draws v2
  { seed: 'r2r-metropolis-27', pool: 'DS-ECO-12::INCOME MIX: a criminal line is present', keep: 2, text: memberRe('DS-ECO-12::INCOME MIX: a criminal line is present', 2), why: 'a metropolis with a criminal line under its market (re-keyed from r2s-wartime-metropolis-3, 9cc8c6826)' },
  { seed: 'r2s-famine-town-1', pool: 'DS-ECO-12::INCOME MIX: a broad spread, no leader', keep: 1, text: /^\{settlement\} lives on many/, why: 'a famine town, no source near half' },
  { seed: 'r2s-wartime-city-1', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 1, text: /^The country around \{settlement\}/, why: 'a city at war' },
  { seed: 'r2r-thorp-12', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 2, text: /^Not enough of the \{good\} .*comes from the country here/, why: 'the smallest it reaches' },
  { seed: 'r2s-wartime-hamlet-3', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 3, text: /so the town must look elsewhere/, why: 'a hamlet at war, no imports' },
  { seed: 'r2s-occupied-town-0', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', keep: 1, text: memberRe('DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', 1), why: 'an occupied town' },
  { seed: 'r2s-wartime-metropolis-1', pool: 'DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks', keep: 2, text: /must come from elsewhere; when none comes, that work stands idle/, why: 'a metropolis at war' },
  // ── BATCH 2 · the declared lines still draw where their towns bear them; the reworded keep their stem ──
  { seed: 'r2r-metropolis-7', pool: 'DS-GEN-13::WAREHOUSES', keep: 3, text: /fill after the harvest/, why: 'no famine' },
  { seed: 'r2r-metropolis-58', pool: 'DS-GEN-17::ADMINISTERED', keep: 1, text: /keeps its own court and its own gaol/, why: 'no occupation' },
  // RE-KEYED (BAR5-FOOD, 2026-11-16, the chair's FD1: the rung and the `food` atom read the band the page prints): r2r-metropolis-58 prints Pressured, so its food is not secure on the page; r2r-metropolis-0 (Secure) draws v3.
  { seed: 'r2r-metropolis-0', pool: 'DS-ECO-8::COMFORTABLE', keep: 3, text: /stores are more than the season needs/, why: 'its food secure' },
  { seed: 'r2r-metropolis-8', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', keep: 5, text: /plainly goes on there/, why: 'no siege' },
  { seed: 'r2r-metropolis-39', pool: 'DS-ECO-10::POSTURE: established', keep: 3, text: /always something going out/, why: 'no plague' },
  { seed: 'r2r-metropolis-7', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', keep: 2, text: /the rest comes in/, why: 'no famine' },
  { seed: 'r2r-metropolis-7', pool: 'DS-ECO-10::POSTURE: entrepot', keep: 3, text: /Goods come and go through the town/, why: 'no plague' },
  { seed: 'r2r-town-19', pool: 'DS-ECO-8::STRUGGLING', keep: 6, text: /give credit/, why: 'a market stands' },
  { seed: 'r2r-town-5', pool: 'DS-ECO-8::STRUGGLING', keep: 3, text: /shows in small things/, why: 'no hunger' },
  { seed: 'r2r-village-9', pool: 'DS-GEN-13::NO-MARKET', keep: 3, text: /^No market or fair stands in \{settlement\}: what trade the town does is done house to house/, why: 'the stem' },
  { seed: 'r2r-metropolis-46', pool: 'DS-GEN-18::BOUGHT-IN', keep: 9, text: /of what changes hands at \{settlement\} came from somewhere else first/, why: 'the stem' },
  { seed: 'r2r-metropolis-9', pool: 'DS-GEN-13::MARKET-NARROW', keep: 2, text: /people trade with each other/, why: 'the stem' },
  { seed: 'r2s-plague_onset-village-1', pool: 'DS-GEN-13::COMMERCE: a market, no guild', keep: 2, text: /the stall fee/, why: 'the stem (RE-KEYED by identity, BAR3-CLOSE-SWEEP-B 2026-11-16: BAR3-CORPUS-2 b09297a27 marks v2 `no crisis: under_siege` (its C7 class row: r2r-village-55 is besieged), so v3 draws there; v2 still draws in 3 towns of the 720 at fb59da43e, r2r-hamlet-4, r2s-plague_onset-village-1 and -3)' },
  { seed: 'r2r-metropolis-57', pool: 'DS-ECO-10::POSTURE: entrepot', keep: 2, text: /^The trade here is in the moving of things/, why: 'the stem' },
  { seed: 'r2r-metropolis-9', pool: 'DS-ECO-8::PROSPEROUS', keep: 1, text: /^\{settlement\} has money to spend/, why: 'the stem' },
  // ── BATCH 3 (TAIL-CORPUS-ECO-2) ──
  { seed: 'r2r-hamlet-12', pool: 'DS-ECO-1::COMBINATION C3: the middle rungs', keep: 2, text: /^\{settlement\} /, why: 'Moderate: the same vid' },
  { seed: 'r2r-town-18', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', keep: 3, text: /\{access\} is busy/, why: 'the stem (old and new wording)' },
  { seed: 'r2r-thorp-21', pool: 'DS-ECO-1::COMBINATION C5: a low rung on a narrow approach', keep: 2, text: /feeds it and no more/, why: 'food secure, no siege' },
  { seed: 'r2r-metropolis-4', pool: 'DS-ECO-6::TIER: a large share off the books (≥30)', keep: 1, text: /^A large share of what \{settlement\} earns/, why: 'the stem' },
  { seed: 'r2r-city-17', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', keep: 1, text: /^A real portion of \{settlement\}'s trade/, why: 'the stem' },
  { seed: 'r2r-hamlet-1', pool: 'DS-ECO-6::TIER: minor shadow activity (≥3)', keep: 1, text: /^Some of \{settlement\}'s trade is done out of sight/, why: 'the stem' }, // re-keyed by identity, BAR2-CORPUS (2026-11-15): v1 reworded (C14631: "too little to change" where the shadow income is a seventh or more)
  { seed: 'r2r-city-11', pool: 'DS-ECO-11::STRATEGIC VALUE: the generator\'s assessment, framed', keep: 4, text: /A newcomer to/, why: 'no siege' },
  { seed: 'r2r-metropolis-16', pool: 'DS-ECO-8::WEALTHY', keep: 1, text: /reserves deep enough/, why: 'fifteen months of stores' },
  { seed: 'r2r-hamlet-25', pool: 'DS-ECO-10::POSTURE: none', keep: 1, text: /the town uses/, why: 'no occupation' },
  { seed: 'r2r-hamlet-43', pool: 'DS-ECO-10::POSTURE: none', keep: 3, text: /surplus there is stays/, why: 'no occupation' },
  { seed: 'r2r-hamlet-49', pool: 'DS-ECO-9::PRESSURED', keep: 1, text: /every season the difference/, why: 'the stem' },
  { seed: 'r2s-slave_revolt-hamlet-3', pool: 'DS-ECO-9::IMPORT-DEPENDENT', keep: 1, text: /^A substantial part of what \{settlement\}/, why: 'the stem' },
  { seed: 'r2r-village-50', pool: 'DS-ECO-9::IMPORT-DEPENDENT', keep: 3, text: /everything (about it )?rests on/, why: 'the stem' },
  { seed: 'r2r-city-14', pool: 'DS-ECO-9::FOOD SOURCES: several, the largest named', keep: 3, text: /without going hungry/, why: 'food secure' },
  { seed: 'r2r-city-27', pool: 'DS-ECO-9::HOW THE NEED IS MET: much of it brought in', keep: 1, text: /a good part of what the town eats is grown elsewhere and brought in/, why: 'the stem' },
  // ── BATCH 4 (C12) ──
  { seed: 'r2s-under_siege-town-0', pool: 'DS-ECO-1::COMBINATION C4: a low rung on a working approach', keep: 4, text: /has lost what passing trade used to leave behind/, why: 'the stem, old and new' },
  // RE-KEYED (BAR5-FOOD, 2026-11-16, the chair's FD1: the rung and the `food` atom read the band the page prints): r2s-under_siege-hamlet-2 brings nothing in and prints Deficit; r2s-under_siege-city-0, besieged and still import-dependent on the page, draws v5.
  { seed: 'r2s-under_siege-city-0', pool: 'DS-ECO-9::IMPORT-DEPENDENT', keep: 5, text: /^Whatever \{settlement\} used to buy for its table, none of it has come/, why: 'the stem, old and new' },
  // ── BATCH 5 ──
  { seed: 'r2r-thorp-45', pool: 'DS-ECO-12::CRITICAL IMPORT: the land cannot give it', keep: 1, text: /^The country around \{settlement\} does not give the town enough \{good\}/, why: 'the stem, old and new' },
  { seed: 'r2r-city-10', pool: 'DS-ECO-10::POSTURE: entrepot', keep: 2, text: /yards are as busy as its workshops/, why: 'a calm city with yards and workshops' },
  { seed: 'r2r-hamlet-4', pool: 'DS-GEN-13::COMMERCE: a market, no guild', keep: 2, text: /No guild keeps a house at/, why: 'no guild house and no guild power' },
  { seed: 'r2r-city-11', pool: 'DS-ECO-8::PROSPEROUS', keep: 1, text: /has money to spend/, why: 'calm, no debt' },
  { seed: 'r2r-city-26', pool: 'DS-ECO-6::TIER: significant off-book activity (≥15)', keep: 4, text: /without anyone writing them down/, why: 'no siege' },
  { seed: 'r2r-city-10', pool: 'DS-GEN-13::ENTREPOT', keep: 1, text: /handles more than the town could ever use/, why: 'no plague' },
  { seed: 'r2r-hamlet-17', pool: 'DS-GEN-14::FOUNDED-YOUNG', keep: 2, text: /^Everything in \{settlement\} looks recently built/, why: 'the stem, old and new' },
  // ── BATCH 6 ──
  { seed: 'r2r-city-50', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: medium or low', keep: 1, text: /It would fetch barely enough to pay for the work/, why: 'the stem, old and new' },
  { seed: 'r2r-hamlet-7', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: high', keep: 1, text: /in \{settlement\}'s country worth real money/, why: 'the stem, old and new' },
  { seed: 'r2s-occupied-hamlet-1', pool: 'DS-ECO-11::EXPLOITATION: unexploited, exportValue: high', keep: 2, text: /anyone who knows its price elsewhere will want to change that/, why: 'the stem, old and new' },
  { seed: 'r2r-thorp-22', pool: 'DS-GEN-18::UNWORKED', keep: 1, text: /the \{resource\} around/i, why: 'the stem, old and new' },
  { seed: 'r2r-city-14', pool: 'DS-GEN-18::BOUGHT-IN', keep: 4, text: /^Ask where \{settlement\} gets its \{good\}/, why: 'the stem, old and new' },
  { seed: 'r2r-hamlet-31', pool: 'DS-ECO-11::RESOURCE CONDITION: worked out, recovers in time', keep: 2, text: /^Little is left worth taking from the \{resource\}/, why: 'the stem (RE-KEYED by identity, batch 7: v2 reworded so the {resource} slot, often plural, is not the subject of "is")' },
  // ── BATCH 7 ──
  { seed: 'r2r-hamlet-15', pool: 'DS-ECO-1::COMBINATION C1: a high rung on a working approach', keep: 2, text: /money to spare/, why: 'a prosperous crossroads hamlet, no debt: v2 still draws' },
  { seed: 'r2r-hamlet-11', pool: MARKET_NO_GUILD, keep: 1, text: memberRe(MARKET_NO_GUILD, 1), why: 'no guild at all: v1 still draws' },
  { seed: 'r2r-village-7', pool: MARKET_NO_GUILD, keep: 3, text: memberRe(MARKET_NO_GUILD, 3), why: 'no guild at all: v3 still draws' },
  { seed: 'r2r-hamlet-51', pool: MARKET_NO_GUILD, keep: 4, text: memberRe(MARKET_NO_GUILD, 4), why: 'no guild, no occupation: v4 still draws' },
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

/**
 * LEFT-KEYS K5 (2026-11-18): a CONSTRUCTED record, where no born town of the 720 or the 150 bears a row's case: the born town
 * with one fact of its record set to the case (named at its row). r2r-village-4 holds a Dairy farmer beside live grazing land;
 * its critical imports gain livestock as that house's need, first, in the record's own reason form.
 * @type {Record<string, (town: any) => any>}
 */
const livestockNeeded = (/** @type {any} */ town) => {
  const imports = town.resourceAnalysis?.imports || {};
  return { ...town, resourceAnalysis: { ...town.resourceAnalysis, imports: { ...imports, critical: ['livestock', ...(imports.critical || [])], reasons: { ...(imports.reasons || {}), livestock: 'Required by Dairy farmer but not available in Plains terrain' } } } };
};
// BAR8-DESKS-2 (2026-11-18, BR35 (b)): a row's record is keyed by its seed and, where one town carries two constructed records,
// its `as` (`readKey`): the K5 record now BRINGS THE LIVESTOCK IN (its primary imports carry it); its sibling brings none.
const CONSTRUCTED = {
  'r2r-village-4': (town) => {
    const t = livestockNeeded(town);
    return { ...t, economicState: { ...t.economicState, primaryImports: [...(t.economicState?.primaryImports || []), 'Livestock'] } };
  },
  'r2r-village-4 · nothing brought in': livestockNeeded,
};
/** @param {{ seed: string, as?: string }} row @returns {string} the key of the row's read */
const readKey = (row) => (row.as ? `${row.seed} · ${row.as}` : row.seed);

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
  for (const key of new Set([...GONE, ...KEEP].map((g) => readKey(/** @type {any} */ (g))))) {
    const seed = key.split(' · ')[0];
    let town = generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} });
    if (Object.prototype.hasOwnProperty.call(CONSTRUCTED, key)) town = CONSTRUCTED[key](town);
    town = withPublicProse(town, composePublicProse(town));
    seen.cur = {};
    const ctx = { veiledRecord: publicVeiledRecordOf(town) };
    for (const [, draw] of PUBLIC_PROSE_SITES) {
      try { draw(town, false, ctx); } catch { /* a site that throws prints nothing; the row's own control says so */ }
    }
    // the owner's own reads (playerView false): the `dm-only` lines the owner's page prints
    try { economyDeskRead(town, { publicDossier: false, playerView: false, tier: town?.tier, ...economicsDeskArgs(town) }); } catch { /* as above */ }
    try { generalDeskLines(town, { publicDossier: false, playerView: false, tier: town?.tier }); } catch { /* as above */ }
    READ.set(key, seen.cur);
    seen.cur = null;
  }
}, 600000);

describe('a cured sentence is not drawn in the census town that made it false; what is drawn instead is named', () => {
  for (const g of GONE) {
    it(`${g.pool} at ${readKey(/** @type {any} */ (g))}: ${g.why}`, () => {
      const pools = READ.get(readKey(/** @type {any} */ (g))) || {};
      expect(Object.keys(pools), `${g.seed} no longer reads ${g.pool}: re-key the row to a town of the case`).toContain(g.pool);
      const drawn = [...pools[g.pool].d.entries()];
      expect(drawn.map(([vid]) => vid), `what ${g.pool} draws at ${g.seed}`).toEqual(g.prints === null ? [] : [g.prints].flat());
      // anchored: the line above pins exactly which vids the town draws in this pool (the row's named instead), so the read is live
      for (const [vid, text] of drawn) expect(text, `${g.pool} v${vid} at ${g.seed}`).not.toMatch(g.gone);
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
