/**
 * npcStructureVariants.js — PEOPLE-1 B1 (2026-11-20; the chair's ruling of 16:41 UTC on
 * `docs/chair/2026-11-20/content/people/PROPOSAL-structuralPosition.md`, as amended by `READ-M1-npcStructure.md`): THE
 * POOLED WORDINGS OF A CARD'S PLACE IN THE ORDER (`npcs[].structuralPosition`), keyed by the writer's own `T` key
 * (`generators/npcStructure.js`).
 *
 * Each row is a declared line `{ text, needs, excludes }`, resolved by `drawDeclared.js :: filterDeclared` against
 * `factsOf(settlement)` (the card handed as `ctx.npc` for the `own house` atom), and the card's wording is chosen among the
 * admitted rows by `kernel/proseHash.js :: pickVariantMixed`, keyed `<settlement _seed>::npcStructure.structuralPosition::<card
 * id>`: no roll. CANONICAL-AT-ZERO: index 0 of every pool is the writer's own line today, byte for byte, and a seedless
 * call prints it. The stable pools' rows inherit their row's own declaration (`excludes: crisis`, the writer's CALM_ONLY);
 * the crisis pools' rows claim no calm. A `{house}` slot is the card's own house stamped public at birth (`people/goals.js :: houseFill`; never a criminal or clandestine one), an
 * `{export}` or `{import}` slot the place's first good of that list (`people/goals.js :: resourceFill`); a row whose slot
 * fills with nothing is not a candidate.
 *
 * LEFT OUT, by the ruling: the faith's blessing custom (struck); the old family's "Heads one of {house}" (the card's own
 * house is not its family: the docks, the dairy, the fisher's landing on the births read). `activeConstraint` is not
 * pooled here (the chair has not ruled it); a constraint pool sits beside `POSITION_VARIANTS` when it is.
 *
 * Pure data. The census declaration: `docs/census/declarations/npcStructureVariants.POSITION_VARIANTS.json`.
 * @enforced-by tests/generators/people/npcPositionPools.test.js
 */

/** @typedef {Readonly<{ text: string, needs: ReadonlyArray<string>, excludes: ReadonlyArray<string> }>} PositionRow */

/** @type {Readonly<Record<string, ReadonlyArray<PositionRow>>>} */
export const POSITION_VARIANTS = Object.freeze({
  // the seat's holder in a calm place: every wording opens "Holds the seat" (N1, N3); the dual-hat holder's house follows
  government__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Holds the seat, and people accept it; there is room to act, not just to hold on.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat with the council beside it; in quiet times the work is the ordinary business.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat; the market days run and the dues come in.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat; quarrels that need judging go to the court.', needs: ['court sits'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat, and in a place this small everyone knows it; most quarrels end at its door.', needs: ['population: small'], excludes: ['crisis'] }),
    Object.freeze({ text: "Holds the seat in good years; the place is comfortable, and the seat's costs are met.", needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat; there is enough coin for the everyday work, if little over.', needs: ['prosperity: moderate'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat while {export} goes out and coin comes back; there is room to act.', needs: ['export good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds the seat in a quiet season; there is time to act.', needs: [], excludes: ['crisis'] }),
  ]),
  military__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Commands those under arms in quiet times; the work is keeping trouble from starting.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands {house} in quiet times: the drill, the roster and the gear kept ready.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms in quiet times; the walls are walked, and little more is asked.', needs: ['walls'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms in quiet times; most days the work is the market crowds and the odd brawl.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms in a large place at peace; the work is many small quarrels, not one big one.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Keeps those under arms ready in a quiet season; nothing calls on them but routine.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms while the place is quiet; the work is the rounds, the roll and the pay.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Commands those under arms in quiet times; the hard part is keeping idle hands sharp.', needs: [], excludes: ['crisis'] }),
  ]),
  religious__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Leads the faith in quiet times, whatever it thinks of the seat beside it.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith from {house}; in quiet times the work is the services, the feast days and the burials.', needs: ['own house'], excludes: ['crisis'] }),
    // the read's rewrite: the count of houses struck, the large place alone
    Object.freeze({ text: 'Leads the faith across a large place, where its people are too many for one priest to know.', needs: ['population: large', 'church'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith in a small place, where the priest knows every family by name.', needs: ['population: small', 'church'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith in an ordinary year: services, feast days, weddings and burials.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith while the place is at peace; the work is the round of services and the needs of the poor.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Leads the faith in a settled season, with no crisis to call the faithful together.', needs: [], excludes: ['crisis'] }),
  ]),
  economy__stable__subordinate: Object.freeze([
    Object.freeze({ text: 'Runs a smaller house behind the leading one in quiet times.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Keeps {house} going in quiet times, a smaller house behind the leading one in the trade.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs a smaller house behind the leading one, in a place that sends out {export}.', needs: ['export good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs a smaller house in the trade, second to the leading one, in a steady season.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs one of the many smaller houses of a large place, behind the leading one in the trade.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs a smaller house behind the leading one; it keeps its own regulars on market days.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Runs a smaller house in the guild, behind the leading one, in a steady season.', needs: ['guild'], excludes: ['crisis'] }),
  ]),
  // claims no secure hold and no say, so a head of low standing may read any of it (`positionForStanding` maps index 0 alone)
  economy__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Heads the leading house in the trade in quiet times; its hold is secure and its say is real.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads {house}, the leading house in the trade, in a steady season.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the leading house in a trade that sends {export} out of the place.', needs: ['export good'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the leading house in the trade of a large place, with many smaller houses behind it.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the leading house in the trade while business is steady and no one presses it.', needs: [], excludes: ['crisis'] }),
  ]),
  government__stable__subordinate: Object.freeze([
    Object.freeze({ text: 'Holds an office that runs from day to day, with no crisis to answer.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Keeps {house} for the seat, day to day, with no crisis to answer.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds a post under the council; the work is the daily round, and the round is quiet.', needs: ['ruling body'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds a small post of the seat and does its daily work; nothing out of the ordinary is asked of it.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds a post of the seat whose busiest days are market days.', needs: ['market'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Holds a post of the seat in good years, when the work is steady and the purse sound.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
  ]),
  // claims no secure hold, so a head of low standing may read any of it (`positionForStanding` maps index 0 alone)
  magic__stable__dominant: Object.freeze([
    Object.freeze({ text: 'Heads the casters in quiet times; their place is secure and their spells are in demand.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads {house} in quiet times; the work is the ordinary run of spellwork.', needs: ['own house'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the casters of a large place, where there is call for spells every day.', needs: ['population: large'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the casters in good years, when people can afford to pay for spellwork.', needs: ['prosperity: ≥ comfortable'], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads the casters in a quiet season; the work is the ordinary run of charms and wards.', needs: [], excludes: ['crisis'] }),
  ]),
  // the old families' row also serves the four crisis keys the writer fills from it, so its wordings claim no calm
  other__stable__dominant: Object.freeze([
    Object.freeze({ text: "Heads an old family while the seat's offices take up more of what the family once did.", needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads an old family whose name still opens doors here.', needs: [], excludes: ['crisis'] }),
    Object.freeze({ text: 'Heads an old family among many in a large place, where an old name opens doors but does not rule.', needs: ['population: large'], excludes: ['crisis'] }),
  ]),
  // the small places' crisis rows: a trouble the record already names; the wordings change the vantage, never the weight
  government__governance_fractured__dominant: Object.freeze([
    Object.freeze({ text: 'Holds the seat in name, but fewer people come when called, and some orders go unanswered.', needs: [], excludes: [] }),
    Object.freeze({ text: 'Holds the seat, but the council no longer moves when it asks, and some orders go unanswered.', needs: ['ruling body'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat in name; in a place this small everyone sees who no longer comes when called.', needs: ['population: small'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat in name; when it calls the neighbours out, fewer come than used to.', needs: ['militia'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat, but its word now carries only as far as people choose to let it.', needs: [], excludes: [] }),
  ]),
  government__economic_stress__dominant: Object.freeze([
    Object.freeze({ text: 'Holds the seat while money is short, and people judge the seat by what it can no longer pay for.', needs: [], excludes: [] }),
    Object.freeze({ text: 'Holds the seat while money is short, in a place that lives on what its {export} fetches.', needs: ['export good'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat while money is short, and {import} must still be bought in at whatever it costs.', needs: ['import good'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat in a small place gone short of coin, where everyone knows what has gone unpaid.', needs: ['population: small'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat while money is short, and every council meeting comes back to the same few coins.', needs: ['ruling body'], excludes: [] }),
    Object.freeze({ text: 'Holds the seat in lean years, and every cost it asks is counted.', needs: [], excludes: [] }),
  ]),
  religious__economic_stress__dominant: Object.freeze([
    Object.freeze({ text: 'Leads the faith while money is short; its lands and alms are both a help and a target.', needs: [], excludes: [] }),
    Object.freeze({ text: 'Leads the faith from {house} while money is short, and more people come to its door for alms.', needs: ['own house'], excludes: [] }),
    Object.freeze({ text: 'Leads the faith in a small place gone short of coin, where the priest knows which households are going without.', needs: ['population: small', 'church'], excludes: [] }),
    Object.freeze({ text: 'Leads the faith through lean years, when people lean on it more and give it less.', needs: [], excludes: [] }),
  ]),
  religious__governance_fractured__dominant: Object.freeze([
    Object.freeze({ text: 'Leads the faith while the seat fails, and people bring it the quarrels the seat no longer settles.', needs: [], excludes: [] }),
    Object.freeze({ text: "Leads the faith while the seat fails; more disputes now end at {house} than at the seat's door.", needs: ['own house'], excludes: [] }),
    Object.freeze({ text: 'Leads the faith while fewer heed the seat, and more ask the faith to settle what the seat once did.', needs: [], excludes: [] }),
  ]),
  religious__contested__dominant: Object.freeze([
    Object.freeze({ text: "Leads the faith while many doubt the seat's right, and the seat wants its blessing.", needs: [], excludes: [] }),
    Object.freeze({ text: "Leads the faith from {house} while many doubt the seat's right; both sides listen for what is said there.", needs: ['own house'], excludes: [] }),
    Object.freeze({ text: "Leads the faith while the seat's right is in doubt, and people wait to hear which way it leans.", needs: [], excludes: [] }),
  ]),
  government__contested__dominant: Object.freeze([
    Object.freeze({ text: 'Holds the seat, but many doubt its right to it, and the doubt has not gone away.', needs: [], excludes: [] }),
    Object.freeze({ text: 'Holds the seat while many question its right, and the questions are asked openly.', needs: [], excludes: [] }),
  ]),
});

// every row's declaration frozen with it (the rows are written with plain arrays, as the declaration walkers read them)
for (const pool of Object.values(POSITION_VARIANTS)) for (const row of pool) { Object.freeze(row.needs); Object.freeze(row.excludes); }

/**
 * The `T` keys whose row is another key's row (the writer's own tables): the crafts rows are the trade's, word for word; the
 * old families' four crisis keys are the old families' stable row itself (`npcStructure.js`'s fill loop). Each reads that
 * key's pool.
 * @type {Readonly<Record<string, string>>}
 */
export const POSITION_POOL_OF = Object.freeze({
  crafts__stable__dominant: 'economy__stable__dominant',
  crafts__stable__subordinate: 'economy__stable__subordinate',
  other__corruption__dominant: 'other__stable__dominant',
  other__food_crisis__dominant: 'other__stable__dominant',
  other__economic_stress__dominant: 'other__stable__dominant',
  other__contested__dominant: 'other__stable__dominant',
});
