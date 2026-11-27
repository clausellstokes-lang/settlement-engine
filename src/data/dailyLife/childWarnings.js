/**
 * data/dailyLife/childWarnings.js — THE `child_warnings` POOLS (DAILY-1 `lines/L1/LINES-1.md` § child_warnings, revised by
 * `lines/L1/LINES-1b.md`, as the chair ruled: 18:37 (ruling 8: a kind from a rating alone is not taken; corruption and cult
 * are no pools and fall to `default`; siege S0 and rival N0 reworded; `none` gains X8 to X17), 18:53 and 18:56 (ruling 11:
 * every line declared in the vocabulary's own atoms, `facts/factVocabulary.js`)).
 *
 * `CHILD_WARNINGS`: one frozen array a branch, keyed by the warning KIND `domain/dailyLife.js :: deriveChildWarnings`
 * takes (a threat kind; `default` for a kind with no pool; `none` where the record holds no real kind). A kind's line is
 * the phrase said after "about" (two kinds join "Children are warned about A, and about B."); a `none` line is a whole
 * sentence. A line is `{ id, text, needs }` as in `dawnWork.js`; `{house}` a house the deriver names from the live roster
 * (never a hideable house, never an access-only row), printed `the <noun>` through `display/institutionSentenceNoun.js`.
 * The deriver hands `CHILD_WARNINGS[kind]` to `facts/drawDeclared.js :: filterDeclared` and picks one eligible line by
 * `kernel/proseHash.js :: pickRendezvous` keyed `<record.name>::dailyLife.child_warnings::<kind>`. No line needs a
 * hideable house or a crime fact (`tests/domain/dailyLifeAtoms.test.js`, arm (c)).
 *
 * DAILY-2's cure of 2026-11-20 (a stricter need, wordings unchanged; the presumed-things walker's `streets`): U7 and P9 say
 * "the streets", so beside the population band (`notSmallPop`) they declare `tier: ≥ village`.
 *
 * NOT BUILT (a need with no atom, ruling 11; `dailyLifeAtoms.test.js :: NOT_GRANTED`): E0 "the empty stalls in the trade
 * quarter" (`tradeQuarter`); rival N0 "anything bearing the colours of the neighbour" and N1 "trusting anyone who comes
 * from the neighbouring place" (`neighbour`).
 *
 * THE SAMENESS LINES OF D5C-2 (the chair's E133 (2); `lines/D4C/DRAFT-2.md`,
 * taken 2026-11-22 21:55 UTC): monster_pressure P10 to P13, appended at the branch's end, its keyed pick unchanged
 * (`tests/domain/dailyLifeNewLines.test.js`).
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string> }} WarningLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[] }>} lines @returns {ReadonlyArray<WarningLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({ ...l, needs: Object.freeze([...l.needs]) })));

/** The pools by warning kind (the deriver's branch key → its lines). */
export const CHILD_WARNINGS = Object.freeze({
  /** `unrest`: the record holds a live trouble (ruling 8), not a rating alone. */
  unrest: frozen([
    { id: 'U0', text: 'crowds that gather quickly', needs: ['population: ≥ middling'] },
    { id: 'U1', text: 'getting mixed up in the grown-ups\' quarrels', needs: [] },
    { id: 'U2', text: 'repeating what they hear said at home about those in charge', needs: [] },
    { id: 'U3', text: 'hanging about {market} when tempers are short', needs: ['market'] },
    { id: 'U4', text: 'loitering by {inn} when voices are raised', needs: ['institution: tavern'] },
    { id: 'U5', text: 'taking sides in arguments that are not theirs', needs: [] },
    { id: 'U6', text: 'carrying tales from one household to another', needs: [] },
    { id: 'U7', text: 'getting caught up when people gather in the streets', needs: ['population: ≥ middling', 'tier: ≥ village'] },
    { id: 'U8', text: 'joining in when the grown-ups\' talk turns angry', needs: [] },
    { id: 'U9', text: 'wandering into other households while feelings are running high', needs: ['institution: dwellings'] },
    { id: 'U10', text: 'picking quarrels of their own while their elders have quarrels enough', needs: [] },
  ]),

  /** `economic_collapse`: prosperity struggling or poor, or a real economic stress (ruling 8), not a rating alone. */
  economic_collapse: frozen([
    { id: 'E1', text: 'asking for what the household cannot spare', needs: [] },
    { id: 'E2', text: 'wasting anything that could still be mended or used again', needs: [] },
    { id: 'E3', text: 'losing anything, however small, that the household paid for', needs: [] },
    { id: 'E4', text: 'handling goods at {market} that there is no coin to buy', needs: ['market'] },
    { id: 'E5', text: 'begging favours from neighbours who have little enough themselves', needs: [] },
    { id: 'E6', text: 'breaking or spoiling what cannot easily be replaced', needs: [] },
    { id: 'E7', text: 'giving anything away without asking first', needs: [] },
    { id: 'E8', text: 'grumbling about going without', needs: ['prosperity: ≤ poor'] },
  ]),

  monster_pressure: frozen([
    { id: 'P0', text: 'the road past sundown', needs: ['route open'] },
    { id: 'P1', text: 'straying out of sight of the houses once the light starts to go', needs: ['institution: dwellings', 'tier: ≤ village'] },
    { id: 'P2', text: 'the woods once the light goes', needs: ['timber at hand'] },
    { id: 'P3', text: 'the far edges of the fields after dark', needs: ['institution: farmland'] },
    { id: 'P4', text: 'going anywhere alone after dark', needs: [] },
    { id: 'P5', text: 'going out to look for whatever is heard in the night', needs: [] },
    { id: 'P6', text: 'following the beasts out beyond calling distance', needs: ['livestock'] },
    { id: 'P7', text: 'going down for water alone after dark', needs: ['institution: waterSource'] },
    { id: 'P8', text: 'being outside the walls once the gates are shut', needs: ['walls', 'gate'] },
    { id: 'P9', text: 'wandering beyond the last streets after dark', needs: ['population: ≥ middling', 'tier: ≥ village'] },
    { id: 'P10', text: 'slipping out of doors once it is dark', needs: [] },
    { id: 'P11', text: 'answering any call that comes out of the dark', needs: [] },
    { id: 'P12', text: 'staying out once the evening comes on', needs: [] },
    { id: 'P13', text: 'leaving a door unbarred at night', needs: [] },
  ]),

  plague: frozen([
    { id: 'L0', text: 'the sick-house and unfamiliar coughs', needs: ['sick house'] },
    { id: 'L1', text: 'going near any house where someone has fallen sick', needs: [] },
    { id: 'L2', text: 'sharing cups and spoons with anyone outside the household', needs: [] },
    { id: 'L3', text: 'unfamiliar coughs, and anyone who has one', needs: [] },
  ]),

  siege: frozen([
    { id: 'S0', text: 'staying close when the bells ring', needs: ['sacredHouse'] },
    { id: 'S1', text: 'climbing up to look out over the walls', needs: ['walls'] },
    { id: 'S2', text: 'straying far from home while there is danger outside', needs: [] },
  ]),

  famine: frozen([
    { id: 'A0', text: 'wandering off: bread is short', needs: [] },
    { id: 'A1', text: 'eating anything they find without asking first', needs: [] },
    { id: 'A2', text: 'wasting so much as a crust', needs: [] },
  ]),

  bandit_raids: frozen([
    { id: 'R0', text: 'strangers who linger at the gates', needs: ['gate'] },
    { id: 'R1', text: 'riders they do not know', needs: [] },
    { id: 'R2', text: 'going out along the road alone', needs: ['route open'] },
  ]),

  rival_neighbor: frozen([
    { id: 'N2', text: 'strangers who ask questions about the place', needs: [] },
  ]),

  arcane_instability: frozen([
    { id: 'Z0', text: 'shimmering air and unfamiliar lights', needs: [] },
    { id: 'Z1', text: 'touching anything that glows, hums or moves on its own', needs: [] },
  ]),

  /** `default`: a kind with no pool of its own (corruption and cult among them, ruling 8). */
  default: frozen([
    { id: 'D0', text: 'straying far from home on their own', needs: [] },
  ]),

  /** `none`: the record holds no real kind (whole sentences; LINES-1b X8 to X17 the usual things of a small place). */
  none: frozen([
    { id: 'X0', text: 'Children are warned about the usual things: the deep well, the strangers\' road, the woods at twilight.', needs: ['institution: waterSource', 'route open', 'timber at hand'] },
    { id: 'X1', text: 'Children are warned about the usual things: getting lost among the stalls at {market}, and keeping close in a crowd.', needs: ['market', 'population: ≥ middling'] },
    { id: 'X2', text: 'Children are warned about the usual things: the forge and its sparks, and straying too far from home.', needs: ['institution: smith'] },
    { id: 'X3', text: 'Children are warned about the usual things: playing too near the water, and straying too far from home.', needs: ['navigable'] },
    { id: 'X4', text: 'Children are warned to keep away from the edge of {docks}, and to be home before dark.', needs: ['docks'] },
    { id: 'X5', text: 'Children are warned not to climb about on {bridge}, and to be home before dark.', needs: ['institution: bridge'] },
    { id: 'X6', text: 'Children are warned about the usual things: straying too far from home, and talking to strangers.', needs: [] },
    { id: 'X7', text: 'Children are warned to keep clear of the turning stones at {mill}, and to be home before dark.', needs: ['institution: mill'] },
    { id: 'X8', text: 'Children are warned about the usual things: going down to the water alone, and wandering out of sight of the houses.', needs: ['institution: waterSource', 'institution: dwellings', 'tier: ≤ village'] },
    { id: 'X9', text: 'Children are warned about the usual things: trampling the young crops, and straying past the last of the fields.', needs: ['institution: farmland', 'tier: ≤ village'] },
    { id: 'X10', text: 'Children are warned about the usual things: getting under the feet of the beasts, and letting any of them stray.', needs: ['livestock'] },
    { id: 'X11', text: 'Children are warned about the usual things: going into the woods alone, and being out after dark.', needs: ['timber at hand'] },
    { id: 'X12', text: 'Children are warned about the usual things: the road and the strangers on it, and being home before dark.', needs: ['route open'] },
    { id: 'X13', text: 'Children are warned about the usual things: the boats and the water\'s edge, and being home before dark.', needs: ['institution: fishingLanding'] },
    { id: 'X14', text: 'Children are warned about the usual things: straying out of call of the houses, and playing with fire.', needs: ['institution: dwellings', 'tier: ≤ village'] },
    { id: 'X15', text: 'Children are warned about the usual things: the water\'s edge, the far fields, and being home before dark.', needs: ['institution: waterSource', 'institution: farmland', 'tier: ≤ village'] },
    { id: 'X16', text: 'Children are warned about the usual things: talking to strangers, and getting under the grown-ups\' feet at work.', needs: [] },
    { id: 'X17', text: 'Children are warned about the usual things: leaning over the water to look in, and straying far from home.', needs: ['institution: waterSource'] },
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
/** Every warning is a consequence (what a condition makes the grown-ups tell the children). */
export const CHILD_WARNINGS_DOES = Object.freeze(Object.fromEntries(Object.keys(CHILD_WARNINGS).map((b) => [b, Object.freeze({ consequence: true })])));
