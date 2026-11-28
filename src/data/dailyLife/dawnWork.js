/**
 * data/dailyLife/dawnWork.js — THE `dawn_work` POOLS (DAILY-1 `lines/L1/LINES-1.md` § dawn_work, revised by
 * `lines/L1/LINES-1b.md`, as the chair ruled: 18:37 (rulings 8 and 9: the defence branch only under a real outside
 * threat; F6, B7, B9, B10, B13 and the new calm lines need a small place; B9 reworded), 18:53 (LINES-1b approved as
 * written) and 18:56 (ruling 11: every line declared in the vocabulary's own atoms, `facts/factVocabulary.js`)).
 *
 * `DAWN_WORK`: one frozen array a branch, keyed by the branch `domain/dailyLife.js :: deriveDawnWork` chooses (its
 * selectors are not atoms; the deriver hands `DAWN_WORK[branch]` to the door itself, so the presumed-things walker sees the
 * whole table drawn). The six branches: `food` (the food
 * capacity critical or collapsed), `defence` (the defence capacity critical or collapsed AND a siege, monster pressure,
 * bandit raids or a hostile neighbour at medium or above), `craft` (craft power >= 25), `merchant_siege` (merchant power
 * >= 30 under a siege), `merchant` (merchant power >= 30), `default` (the calm place). A line is `{ id, text, needs }`:
 * `id` its LINES-1 / LINES-1b number, `needs` the atoms the record must hold (a conjunction), `{house}` a house the
 * deriver names from the live roster (never a hideable house, never an access-only row), printed `the <noun>` through
 * `display/institutionSentenceNoun.js`. A line whose house the roster cannot name is not eligible. The deriver filters a
 * branch to its eligible lines (`facts/drawDeclared.js :: filterDeclared`) and picks one by
 * `kernel/proseHash.js :: pickRendezvous` keyed `<record.name>::dailyLife.dawn_work::<branch>`. Index 0 of each branch
 * is TODAY's text, with its needs declared (F0, W0, C0, S0, M0, B0). No line true: the EMPTY string (ruling 3).
 *
 * Need → atom (`tests/domain/dailyLifeAtoms.test.js :: NEED_ATOMS`): granary, smith, mill, bathhouse, bakery,
 * warehouse, craftGuild → `institution: <kind>`; inn → `institution: tavern`; docks → `docks`; market → `market`;
 * walls, gate, militia → their atoms; guard → `guardPresence`; guild → `guild`; fishSource, gameSource, livestockSource →
 * `fish`, `game`, `livestock`; route → `route open`; timber → `timber at hand`; water → `institution: waterSource`;
 * farming → `institution: farmland`; dwellings → `institution: dwellings`; common → `institution: commonGrazing`;
 * landing → `institution: fishingLanding`; elder → `office: elders` (WORDS-2 E5: the governing row's elders form; `ruler: elder` also held at a Headman's Authority); small → `tier: ≤ village` (LINES-1b, from the tier).
 *
 * DAILY-2's cures of 2026-11-20 (stricter needs, wordings unchanged; the presumed-things and presumption-classes walkers):
 * W0 and B0 say "the watch", so they also declare `watch`; B26 says the boats go out, so it excludes a siege in force
 * (`excludes: ['crisis: under_siege']`, as N11 of `gatheringPlaces.js`); S0 says the loads do not come, so it is scoped to
 * a siege in force (`crisis: under_siege` as a need: the presumption-classes walker reads its `outside` word answered only
 * by a crisis atom that closes the threat family, and an exclusion of one kind does not).
 *
 * NOT BUILT: W12 ("With danger about in the country, …", needs `monster`): a monster_pressure threat has no fact home and
 * no atom (ruling 11; `dailyLifeAtoms.test.js :: NOT_GRANTED`), so the line cannot be declared. No line needs a hideable
 * house or a crime fact (`tests/domain/dailyLifeAtoms.test.js`, arm (c)).
 *
 * THE SAMENESS LINES OF D5C-2 (the chair's E133 (2); `lines/D4C/DRAFT-1.md`,
 * taken 2026-11-22 21:55 UTC): defence W15; default B27, which excludes a siege in force as B26 does; each appended
 * at its branch's end, its keyed pick unchanged (`tests/domain/dailyLifeNewLines.test.js`).
 *
 * THE MIRROR (CLOSE-7; the chair's RULING-R24 R24d of 2026-11-24, the words his; vetoable by the owner, on the veto list):
 * where the page prints Famine over the place's own production adequate or surplus, the food branch is taken (the fare's
 * band, bounded by the printed band, is critical), and there F6 ("… looking for anything left to gather") would say the
 * harvest failed. F6 now excludes `food production: ≥ adequate` (the vocabulary's atom, read off the capacity profile the
 * deriver hands, `facts/foodProduction.js`), and K1, the chair's line in its place, needs it with F6's own needs (a small
 * place, ruling 8; the farmland F6 read), appended after F6: K1 stands in F6's index of the eligible list.
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string>, readonly excludes?: ReadonlyArray<string> }} DawnLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[], excludes?: string[] }>} lines @returns {ReadonlyArray<DawnLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({
  ...l, needs: Object.freeze([...l.needs]), ...(l.excludes ? { excludes: Object.freeze([...l.excludes]) } : {}),
})));

/** The pools by branch (the deriver's branch key → its lines). */
export const DAWN_WORK = Object.freeze({
  /** `food`: the food capacity is critical or collapsed. */
  food: frozen([
    { id: 'F0', text: 'Dawn work is the search for food. Foragers leave before light, and the granary queue forms before the ovens are warm.', needs: ['institution: granary'] },
    { id: 'F1', text: 'Dawn work is the search for food: people are out before light to see what can be found.', needs: [] },
    { id: 'F2', text: 'Those who fish are out before light, and what they bring back decides what is eaten that day.', needs: ['fish'] },
    { id: 'F3', text: 'Hunters are out before light, and the rest of the day waits on what they bring home.', needs: ['game'] },
    { id: 'F4', text: 'People are at {market} before light, waiting to see what food comes in and what it will cost.', needs: ['market'] },
    { id: 'F5', text: 'The beasts are seen to before light, and nothing they give is wasted.', needs: ['livestock'] },
    { id: 'F6', text: 'Every hand that can be spared is in the fields at first light, looking for anything left to gather.', needs: ['institution: farmland', 'tier: ≤ village'], excludes: ['food production: ≥ adequate'] },
    { id: 'K1', text: 'Every hand that can be spared is out at first light, and what comes in is counted before it is eaten.', needs: ['institution: farmland', 'tier: ≤ village', 'food production: ≥ adequate'] },
  ]),

  /** `defence`: the defence capacity is critical or collapsed, and a real outside threat stands at medium or above (ruling 8). */
  defence: frozen([
    { id: 'W0', text: 'The walls claim the first hours: the watch musters thin at first light, and ordinary work waits until the rounds are walked.', needs: ['walls', 'guardPresence', 'watch'] },
    { id: 'W1', text: 'Before any other work, someone walks the length of the walls at first light and looks for gaps.', needs: ['walls'] },
    { id: 'W2', text: 'Those who keep guard are out at first light, and the rest wait for their word before going out to work.', needs: ['guardPresence'] },
    { id: 'W3', text: 'Those sworn to turn out in danger meet briefly at first light before going to their own work.', needs: ['militia'] },
    { id: 'W4', text: 'The gates stay shut until it is fully light, and the day\'s work waits on them.', needs: ['gate'] },
    { id: 'W5', text: 'Before anyone goes out to work, each household looks to its own door and sees that all is as it was left.', needs: ['institution: dwellings'] },
    { id: 'W6', text: 'The first light goes to walking the edges of the fields; the ordinary work begins once that is done.', needs: ['institution: farmland'] },
    { id: 'W7', text: 'Water is fetched at first light in company, never alone, and the day\'s work starts after.', needs: ['institution: waterSource'] },
    { id: 'W8', text: 'People go out to their work together at dawn, and no one strays far from the houses alone.', needs: ['institution: dwellings'] },
    { id: 'W9', text: 'The first hour is spent seeing that nothing was disturbed in the night; only then does the ordinary work begin.', needs: [] },
    { id: 'W10', text: 'Everyone keeps within call of the houses in the first hours, and the farther work waits until later in the day.', needs: ['institution: dwellings'] },
    { id: 'W11', text: 'The elder is asked at first light whether all is well before anyone goes out to work.', needs: ['office: elders'] }, // WORDS-2 E5 (intake 3): the elders' own form, never a headman's
    { id: 'W13', text: 'The beasts are let out at first light and kept close to the houses through the day.', needs: ['livestock'] },
    { id: 'W14', text: 'Doors are opened late and with care, and the day\'s work starts a little after first light.', needs: ['institution: dwellings'] },
    { id: 'W15', text: 'Before the day\'s work begins, someone looks out over the country around to see that nothing is stirring.', needs: [] },
  ]),

  /** `craft`: the craft power is 25 or more. */
  craft: frozen([
    { id: 'C0', text: 'Smithy fires light before sunrise; guild-callers move from shop to shop, and apprentices haul water before the bell.', needs: ['institution: smith', 'guild'] },
    { id: 'C1', text: 'The forges are lit before sunrise, and the first hammering is heard as it grows light.', needs: ['institution: smith'] },
    { id: 'C2', text: 'The workshops open before sunrise, and the day\'s making is well under way by first light.', needs: [] },
  ]),

  /** `merchant_siege`: the merchant power is 30 or more, under a siege. */
  merchant_siege: frozen([
    { id: 'S0', text: 'The merchants count their stock before light, and the porters wait for loads that do not come; dawn brings the smell of woodsmoke and grain.', needs: ['crisis: under_siege'] },
    { id: 'S1', text: 'The merchants are up before light, counting what is left and waiting for goods that cannot reach them.', needs: [] },
  ]),

  /** `merchant`: the merchant power is 30 or more. */
  merchant: frozen([
    { id: 'M0', text: 'Merchant caravans roll before light; porters and apprentices queue at the warehouses, and dawn brings the smell of woodsmoke and grain.', needs: ['route open', 'institution: warehouse'] },
    { id: 'M1', text: 'Traders are setting out their goods at {market} before light, and the first buyers come as it grows light.', needs: ['market'] },
    { id: 'M2', text: 'Before light, goods are carried out of the warehouses to where they will be sold.', needs: ['institution: warehouse'] },
    { id: 'M3', text: 'Loads are made ready before light for the journey out, and the merchants see them off themselves.', needs: ['route open'] },
    { id: 'M4', text: 'Boats are loaded and unloaded at {docks} from first light, and the merchants are there to watch.', needs: ['docks'] },
    { id: 'M5', text: 'The merchants are at their stalls before first light, and the first bargains of the day are struck early.', needs: ['market'] },
    { id: 'M6', text: 'The merchants are up before anyone else, and their business is under way by first light.', needs: [] },
  ]),

  /** `default`: the calm place (LINES-1b: B18 to B26 the calm small place's lines). */
  default: frozen([
    { id: 'B0', text: 'Bakers light their ovens first, then the smiths; the watch changes as the gates open.', needs: ['institution: bakery', 'institution: smith', 'guardPresence', 'watch', 'gate'] },
    { id: 'B1', text: 'The bakers have their ovens lit before first light, and the first bread is out as people wake.', needs: ['institution: bakery'] },
    { id: 'B2', text: 'The forge is lit early, and its hammering is the first sound of most mornings.', needs: ['institution: smith'] },
    { id: 'B3', text: 'The first grain of the day is carried to {mill} at first light.', needs: ['institution: mill'] },
    { id: 'B4', text: 'Stalls go up at {market} at first light, and the first buyers come soon after.', needs: ['market'] },
    { id: 'B5', text: 'Those who kept guard through the night hand over at first light and go home to sleep.', needs: ['guardPresence'] },
    { id: 'B6', text: 'The gates are opened at first light, and the first of the day\'s comings and goings begin.', needs: ['gate'] },
    { id: 'B7', text: 'Water is drawn early, and the day\'s work begins once the households have what they need.', needs: ['institution: waterSource', 'tier: ≤ village'] },
    { id: 'B8', text: 'Those who fish are out before first light and back with the catch by mid-morning.', needs: ['fish'] },
    { id: 'B9', text: 'The beasts are seen to first, before the rest of the day begins.', needs: ['livestock', 'tier: ≤ village'] },
    { id: 'B10', text: 'Most people are in the fields by first light; the rest of the work fits around them.', needs: ['institution: farmland', 'tier: ≤ village'] },
    { id: 'B11', text: 'The workshops open their doors early, and work is under way at the benches by first light.', needs: ['institution: craftGuild'] },
    { id: 'B12', text: 'At {inn}, breakfast is already being served to those who mean to set out early.', needs: ['institution: tavern', 'route open'] },
    { id: 'B13', text: 'At first light the beasts are driven out to graze on the common.', needs: ['institution: commonGrazing', 'tier: ≤ village'] },
    { id: 'B14', text: 'The first boats are being unloaded at {docks} as it grows light.', needs: ['docks'] },
    { id: 'B15', text: 'The granary doors are opened at first light, and the first grain goes out to be ground.', needs: ['institution: granary', 'institution: mill'] },
    { id: 'B16', text: 'The fires under {bathhouse} are lit before dawn, so the water is hot when the first bathers come.', needs: ['institution: bathhouse'] },
    { id: 'B17', text: 'The night\'s guard comes down off the walls at first light, and the day\'s guard goes up.', needs: ['walls', 'guardPresence'] },
    { id: 'B18', text: 'The first light goes to walking the fields to see how they stand, and then the day\'s work begins.', needs: ['institution: farmland', 'tier: ≤ village'] },
    { id: 'B19', text: 'People stop at the elder\'s door at first light, and the day\'s work is talked over there.', needs: ['office: elders'] }, // WORDS-2 E5 (intake 3): the elders' own form, never a headman's
    { id: 'B20', text: 'The beasts are let out at first light, and the day\'s other work begins after.', needs: ['livestock', 'tier: ≤ village'] },
    { id: 'B21', text: 'The households are up at first light, and the day\'s work starts close to home.', needs: ['institution: dwellings', 'tier: ≤ village'] },
    { id: 'B22', text: 'Fires are lit and the households fed before anyone goes out to the day\'s work.', needs: ['institution: dwellings', 'tier: ≤ village'] },
    { id: 'B23', text: 'The first water of the day is fetched at first light, before anything else is done.', needs: ['institution: waterSource', 'tier: ≤ village'] },
    { id: 'B24', text: 'The day begins with the walk out to the fields, and the work there runs on until midday.', needs: ['institution: farmland', 'tier: ≤ village'] },
    { id: 'B25', text: 'Some go out at first light to cut and carry wood, and the rest turn to the day\'s other work.', needs: ['timber at hand', 'tier: ≤ village'] },
    { id: 'B26', text: 'The boats go out from the landing at first light, and the catch decides the rest of the day.', needs: ['institution: fishingLanding'], excludes: ['crisis: under_siege'] },
    { id: 'B27', text: 'Carts are already coming in at the gates as it grows light, bringing the day\'s goods.', needs: ['gate'], excludes: ['crisis: under_siege'] },
  ]),
});

/**
 * THE DECLARATION (D4C-1, the chair's E133 (1)), one a BRANCH (every line of a branch does the same): what the branch's
 * line DOES on the page. `{ states: '<condition key>' }` it states a condition (the key as D4C's measure, table 1,
 * names it: `threat:<kind>`, `food:want`, `defence:want`, …); `{ consequence: true }` it says what a condition makes
 * people do, or the quiet as they live it; `{ names: true }` it only names a house or a place. `domain/dailyLife.js`
 * reads the declaration, never the line's words: the outsider line yields a part whose condition another printed slot
 * states (`tests/domain/dailyLifeNoRepeat.test.js`).
 */
/** Every dawn line is a consequence (bread first, water fetched in company, the forges lit). */
export const DAWN_WORK_DOES = Object.freeze(Object.fromEntries(Object.keys(DAWN_WORK).map((b) => [b, Object.freeze({ consequence: true })])));
