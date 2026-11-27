/**
 * data/dailyLife/gatheringPlaces.js — THE `gathering_places` POOLS (DAILY-1 `lines/L1/LINES-1.md` § gathering_places, as
 * the chair ruled: 18:37 (ruling 7: N0 reworded; N17, N23, P5, P8 need a small place; N26, N27, P12 cut, no well
 * landmark) and 18:56 (ruling 12: every line declared in the vocabulary's own atoms, `facts/factVocabulary.js`)).
 *
 * Two branches, chosen by `domain/dailyLife.js`: `named` (the record holds a live, non-hideable sacred house, market or
 * inn the line may name) and `plain` (it holds none). A line is `{ id, text, needs }`: `id` its LINES-1 number, `needs`
 * the atoms the record must hold (a conjunction), `{house}` a house the deriver names from the live roster (never a
 * hideable house, never an access-only row), printed `the <noun>` through `display/institutionSentenceNoun.js`. A line
 * whose house the roster cannot name is not eligible. The deriver filters a branch to its eligible lines
 * (`facts/drawDeclared.js :: filterDeclared`) and picks one by `kernel/proseHash.js :: pickRendezvous` keyed
 * `<record.name>::dailyLife.gathering_places::<branch>`. Index 0 of each branch is TODAY's text (N0 as reworded, P0).
 *
 * Need → atom (ruling 12 (2)): sacred → `sacredHouse`; church → `church`; cathedral → `church` (its house a cathedral);
 * market → `market`; square → `market` + `institution: square`; inn → `institution: tavern`; mill, bathhouse, bridge →
 * their kinds; theater → `institution: theatre`; docks → `docks`; water / well → `institution: waterSource`; common →
 * `institution: commonGrazing`; farming → `institution: farmland`; dwellings, landing (`fishingLanding`), rootCellar,
 * shepherd → their kinds; elder → `office: elders` (WORDS-2 E5: the governing row's elders form; `ruler: elder` also held at a Headman's Authority); small → `tier: ≤ village` (LINES-1b, from the tier).
 *
 * N11 also excludes a siege in force (`excludes: ['crisis: under_siege']`: no boats come in under a siege; the chair's ruling of
 * 2026-11-20 19:41). No line needs a hideable house or a crime fact (`tests/domain/dailyLifeAtoms.test.js`, arm (c)).
 *
 * THE SAMENESS LINES OF D5C-2 (the chair's E133 (2); `lines/D4C/DRAFT-2.md`,
 * taken 2026-11-22 21:55 UTC): named N29 to N34 (N29 and N30 name `{sacred}`), plain P16 to P20, each appended at its
 * branch's end, its keyed pick unchanged (`tests/domain/dailyLifeNewLines.test.js`); P16 and P20 need
 * `institution: dwellings` (the chair's ruling (b), 2026-11-23 01:57 UTC: a line that needs nothing has no place in a
 * branch whose own condition is an absence).
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string>, readonly excludes?: ReadonlyArray<string> }} GatheringLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[], excludes?: string[] }>} lines @returns {ReadonlyArray<GatheringLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({
  ...l, needs: Object.freeze([...l.needs]), ...(l.excludes ? { excludes: Object.freeze([...l.excludes]) } : {}),
})));

/** The `named` branch: the record holds a live sacred house, market or inn the line may name. */
export const GATHERING_NAMED = frozen([
  { id: 'N0', text: 'By midday people are gathered on the steps of {church}, at {market} and at {inn}: talking, trading, and watching.', needs: ['church', 'market', 'institution: tavern'] },
  { id: 'N1', text: 'Most days people stop to talk by {sacred} on their way to and from their work.', needs: ['sacredHouse'] },
  { id: 'N2', text: 'People meet where the water is drawn and again by {sacred}, and most news passes between them.', needs: ['sacredHouse', 'institution: waterSource'] },
  { id: 'N3', text: 'In the evenings people gather at {inn}, where the day\'s news is passed around.', needs: ['institution: tavern'] },
  { id: 'N4', text: 'People gather at {market} as much to talk as to buy.', needs: ['market'] },
  { id: 'N5', text: 'People meet at {market} by day and at {inn} once the work is done.', needs: ['market', 'institution: tavern'] },
  { id: 'N6', text: 'Between {sacred} and {inn}, most people cross paths at some point in the day.', needs: ['sacredHouse', 'institution: tavern'] },
  { id: 'N7', text: 'People gather in {square} at midday to talk, to trade a little, and to watch the day go by.', needs: ['market', 'institution: square'] },
  { id: 'N8', text: 'Many go to {bathhouse} as much for the talk as for the water.', needs: ['institution: bathhouse'] },
  { id: 'N9', text: 'People meet while they wait their turn at {mill}, and again by {sacred}.', needs: ['institution: mill', 'sacredHouse'] },
  { id: 'N10', text: 'People stop to talk on {bridge} and at {market}, where most comings and goings pass.', needs: ['institution: bridge', 'market'] },
  { id: 'N11', text: 'When the boats come in, people gather at {docks} to see what has been landed.', needs: ['docks'], excludes: ['crisis: under_siege'] },
  { id: 'N12', text: 'In the evenings people gather at {theater}, and the talk carries on afterwards at {inn}.', needs: ['institution: theatre', 'institution: tavern'] },
  { id: 'N13', text: 'People gather on the steps of {cathedral}, where there is always someone to talk to.', needs: ['church'] },
  { id: 'N14', text: 'In the evenings people gather at {inn} or out on the common.', needs: ['institution: commonGrazing', 'institution: tavern'] },
  { id: 'N15', text: 'People meet on the common and by {sacred}, where most of the talk of the place goes on.', needs: ['institution: commonGrazing', 'sacredHouse'] },
  { id: 'N16', text: 'After a service people linger on the steps of {church}; on other days they meet where the water is drawn.', needs: ['church', 'institution: waterSource'] },
  { id: 'N17', text: 'People talk in the fields while they work, and gather by {sacred} when the work is done.', needs: ['sacredHouse', 'institution: farmland', 'tier: ≤ village'] },
  { id: 'N18', text: 'Of an evening people sit out at their doors, and by day they meet by {sacred}.', needs: ['sacredHouse', 'institution: dwellings'] },
  { id: 'N19', text: 'People meet while they wait their turn at {mill}, and again where the water is drawn.', needs: ['institution: mill', 'institution: waterSource'] },
  { id: 'N20', text: 'People meet at {mill} and at {market}, and the talk at each is of prices and of one another.', needs: ['institution: mill', 'market'] },
  { id: 'N21', text: 'People cross {square} on their way to {sacred}, and many stop to talk on the way.', needs: ['market', 'institution: square', 'sacredHouse'] },
  { id: 'N22', text: 'People meet where the water is drawn by day, and at {inn} in the evening.', needs: ['institution: tavern', 'institution: waterSource'] },
  { id: 'N23', text: 'After the day in the fields, people gather at {inn} to talk it over.', needs: ['institution: tavern', 'institution: farmland', 'tier: ≤ village'] },
  { id: 'N24', text: 'People meet at {market} and where the water is drawn, and between them most news gets about.', needs: ['market', 'institution: waterSource'] },
  { id: 'N25', text: 'People meet at {market} and out on the common, where there is always someone about.', needs: ['market', 'institution: commonGrazing'] },
  { id: 'N28', text: 'Of an evening people drift from their doors to {inn} to talk the day over.', needs: ['institution: tavern', 'institution: dwellings'] },
  { id: 'N29', text: 'People pass the time of day by {sacred}, and the talk there is of the work and of one another.', needs: ['sacredHouse'] },
  { id: 'N30', text: 'News goes round by {sacred} and from door to door, and little stays private for long.', needs: ['sacredHouse', 'institution: dwellings'] },
  { id: 'N31', text: 'People meet out on the common by day, and at one another\'s doors of an evening.', needs: ['institution: commonGrazing', 'institution: dwellings'] },
  { id: 'N32', text: 'Where the water is drawn and out on the common, people stop to talk as they pass.', needs: ['institution: waterSource', 'institution: commonGrazing'] },
  { id: 'N33', text: 'Most of the news is passed on in the fields and where the water is drawn.', needs: ['institution: farmland', 'institution: waterSource', 'tier: ≤ village'] },
  { id: 'N34', text: 'People talk at one another\'s doors and where the water is drawn, and little news is missed.', needs: ['institution: dwellings', 'institution: waterSource'] },
]);

/** The `plain` branch: it holds none of the three. */
export const GATHERING_PLAIN = frozen([
  { id: 'P0', text: 'People gather where they can: the well, the bridge, the open square.', needs: ['institution: waterSource', 'institution: bridge', 'market', 'institution: square'] },
  { id: 'P1', text: 'People meet where the water is drawn, and most of the day\'s news is passed on there.', needs: ['institution: waterSource'] },
  { id: 'P2', text: 'Morning and evening, people stop to talk where the water is drawn.', needs: ['institution: waterSource'] },
  { id: 'P3', text: 'People talk where the water is drawn and over one another\'s doorsteps, morning and evening.', needs: ['institution: waterSource', 'institution: dwellings'] },
  { id: 'P4', text: 'People gather at one another\'s doors in the evening, and by day where the water is drawn.', needs: ['institution: waterSource', 'institution: dwellings'] },
  { id: 'P5', text: 'Most talk happens in the fields while the work goes on, and again where the water is drawn.', needs: ['institution: waterSource', 'institution: farmland', 'tier: ≤ village'] },
  { id: 'P6', text: 'Where the water is drawn is where people meet and pass on their news.', needs: ['institution: waterSource'] },
  { id: 'P7', text: 'Of an evening people sit out by their doors and talk across to their neighbours.', needs: ['institution: dwellings'] },
  { id: 'P8', text: 'People meet at the field edges at midday, when the work stops for a while.', needs: ['institution: farmland', 'tier: ≤ village'] },
  { id: 'P9', text: 'People see most of one another where the water is drawn, and the talk there is of the work and of each other.', needs: ['institution: waterSource'] },
  { id: 'P10', text: 'When the boats are drawn up, people gather at the landing to sort the catch and talk.', needs: ['institution: fishingLanding'] },
  { id: 'P11', text: 'People meet on the common, where the beasts graze and there is always someone about.', needs: ['institution: commonGrazing'] },
  { id: 'P13', text: 'Matters of any weight are talked over at the elder\'s door, where people gather of an evening.', needs: ['office: elders'] }, // WORDS-2 E5 (intake 3): the elders' own form, never a headman's
  { id: 'P14', text: 'People meet at the communal root cellar, where the stores are kept and the news is passed along.', needs: ['institution: rootCellar'] },
  { id: 'P15', text: 'When the flocks are brought in, people gather to help and to talk.', needs: ['institution: shepherd'] },
  { id: 'P16', text: 'People talk wherever the day\'s work brings them together, and the news goes round with them.', needs: ['institution: dwellings'] },
  { id: 'P17', text: 'News is passed from door to door here, and most of it is known by nightfall.', needs: ['institution: dwellings'] },
  { id: 'P18', text: 'People meet in the fields and on the paths between the houses, and talk as they go.', needs: ['institution: farmland', 'institution: dwellings', 'tier: ≤ village'] },
  { id: 'P19', text: 'Most news here is passed on at the doorstep, a few words at a time.', needs: ['institution: dwellings'] },
  { id: 'P20', text: 'Most of the talk here goes on out of doors, wherever people are at work.', needs: ['institution: dwellings'] },
]);

/**
 * THE DECLARATION (D4C-1, the chair's E133 (1)), one a BRANCH (every line of a branch does the same): what the branch's
 * line DOES on the page. `{ states: '<condition key>' }` it states a condition (the key as D4C's measure, table 1,
 * names it: `threat:<kind>`, `food:want`, `defence:want`, …); `{ consequence: true }` it says what a condition makes
 * people do, or the quiet as they live it; `{ names: true }` it only names a house or a place. `domain/dailyLife.js`
 * reads the declaration, never the line's words: the outsider line yields a part whose condition another printed slot
 * states (`tests/domain/dailyLifeNoRepeat.test.js`).
 */
/** Both branches name where people meet (a house, or the well, the common, the doors). */
export const GATHERING_DOES = Object.freeze({ named: Object.freeze({ names: true }), plain: Object.freeze({ names: true }) });
