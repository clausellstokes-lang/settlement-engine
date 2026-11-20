/**
 * data/people/goalFamilies.js — THE GOAL FAMILIES, AS DATA (WRITE-GOALS, the allegiance train's
 * writing seat A, 2026-11-08; `docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md` §6, the chair's
 * rulings J-15 and J-16; the record `docs/allegiance/WRITE_GOALS_2026-11-08.md`).
 *
 * A card's goal is drawn from the FAMILIES its record supports (design §6.1–§6.2; car 4 wires it in
 * `src/generators/people/goals.js`). This file holds only the lines: plain template strings with
 * `{slot}` tokens, in `GOAL_FAMILY_LINES[family][subKind][vantage]`, the cells of design §6.6
 * exactly (RANK 36 · POWER 48 · INSTITUTION 48 · SUPPLY 48 · TIES 60 · PERSONALITY 96 ·
 * ALLEGIANCE 128 = 464), plus UNCANNY 60 (the owner's word of 2026-11-08: rare fantasy goals, magic on
 * as the gate) = 524. No goal is keyed by title (J-16). CRISIS keeps today's lines and has no
 * cell here. APART from the cells, and outside every total above, `GOAL_RESERVE_LINES` holds 41 reserve lines (GOALS-1,
 * GR1; the chair's approval of 2026-11-20 10:48 UTC): TIES 6 · INSTITUTION 7 · RANK 7 · POWER 5; and GOALS-3 (the chair's
 * approval of 13:32 UTC): PERSONALITY 16, in 13 cells; never drawn, only taken by a repeat's rotation or the floor's walk.
 * GOALS-4, THE WANTS' TRANCHE (the owner's word of 15:54 UTC via the chair; the chair read and approved all 380 lines,
 * 16:33–17:53 UTC; the one source `docs/chair/2026-11-20/content/goals/wants/WANT-LINES-FINAL.md` at 25b63efbc): 380 DRAWN lines
 * appended verbatim to the END of 35 cells (183 → 563), so the cells now hold RANK 149 · POWER 98 · INSTITUTION 111 ·
 * SUPPLY 59 · TIES 173 · PERSONALITY 128 · ALLEGIANCE 130 · UNCANNY 60 = 908 (528 + 380); the reserve is unchanged. Every line is written to the owner's style law (WIRING-RULINGS §5–§8, STYLE-RULINGS §2,
 * WAVE-RULINGS item 16) and is listed here FOR THE OWNER'S VETO.
 *
 * ── THE VANTAGES ──
 *   short  this season: a concrete thing the person can do, or fail at.
 *   long   the life: a direction.
 *
 * ── THE SLOT CONTRACT (measured on the soak 1,000; the record §1) ──
 * Every slot fills as a COMPLETE NOUN PHRASE that reads mid-sentence, so a line never writes an
 * article before a slot and never begins with one:
 *   {power} {rival}          the power's name WITH ITS ARTICLE ("the Elder Council", "the
 *                            Independent Bloc"; "The …" where the slot opens the line: NAMES-1, the
 *                            seventh chair's ruling CN1 of 2026-11-20, goals.js :: cellCandidates fills
 *                            it through powerNameWithArticle); never "the {power}", never "{power}'s"
 *                            (many names are plural: "Merchant Guilds", "Grain Holders").
 *   {power|one|many}         THE AGREEMENT FORM (NAMES-3, the seventh chair's rulings CV1 and CV7 of
 *                            2026-11-20, vetoable by the owner): an "it"/"its" said of a power slot, or a
 *                            verb whose subject it is, is written in both numbers and takes the power's
 *                            own ("stronger than they found {power|it|them}"), filled by goals.js ::
 *                            cellCandidates through the one reader (`powerSentenceName.js ::
 *                            fillAgreement`). "They"/"their" after a singular power stand (CV7 (1)).
 *   {house} {otherHouse}     the house as "the" + its display noun (`institutionDisplayName`),
 *   {front} {targetHouse}    lower-cased, any parenthetical stripped ("the fish market", "the
 *                            mills", "the smuggling network"); never possessive, never the subject
 *                            of a verb that must agree in number ("the mills" / "the brewery").
 *   {guild}                  `allegiance.power` as printed, else `allegiance.house` as a house.
 *   ({chain} is STRUCK, POWERS-9: a chain's label is a catalogue name, "Grain & Bread", "Food Processing"; the
 *   SUPPLY lines name the work through {house}, "the work at {house}", the house's own display noun.)
 *   {resource}               the house's trade dependency, as goods with NO article (a mass noun:
 *                            "grain", "iron and fuel"), lower-cased, "+" read as "and"; a
 *                            dependency on trade access alone fills nothing, and its lines are
 *                            not drawn.
 *   {import}                 a necessity import, the same way ("salt"), parenthetical stripped.
 *   {issue}                  the conflict's issue, its first letter lower-cased ("control of the
 *                            market licensing process").
 *   {above} {below} {other}  a person, by name; a person may take "'s".
 *   {handler} {agent} {target}
 *   {flaw} {dominant} {modifier}  the card's own trait words (allowed; no line uses them).
 * A line whose slot cannot fill from the record is not drawn: the slot is its own gate.
 *
 * ── STRUCK SLOTS (the record does not hold them at birth in a form a player reads) ──
 * See `GOAL_SLOTS_STRUCK`, each with its reason. In particular `{season}` (design §6.4's WARRANT
 * line): no season field exists at birth (the fact vocabulary's ruling 8; measured), so the
 * WARRANT lines are written without it.
 *
 * ── `needs` (CENSUS-4c R-C) ──
 * A line that presumes a town fact its family's support gate does not guarantee declares it in
 * place, in the fact vocabulary's atoms (`src/domain/facts/factVocabulary.js`):
 * `{ line: '…', needs: ['market'] }`. A bare string declares nothing. A line whose words fail under a crisis in force
 * declares it on its `excludes` side (POWERS-9, the chair's ruling: a goal that presumes buying, hiring, laying in stores
 * or trade by road is not dealt under a siege, nor under a famine where its own words fail):
 * `{ line: '…', excludes: ['crisis: siege'] }`.
 *
 * Pure data: no closures, no imports, no randomness.
 *
 * @enforced-by tests/data/goalFamilies.test.js
 */

/** The families with a cell in this file, in design §6.6's order (CRISIS keeps its own lines). */
export const GOAL_FAMILIES = Object.freeze(['RANK', 'POWER', 'INSTITUTION', 'SUPPLY', 'TIES', 'PERSONALITY', 'ALLEGIANCE', 'UNCANNY']);

/** Each family's allowed slot set (design §6.1, less the struck slots; SUPPLY gains {house}). */
export const GOAL_SLOTS = Object.freeze({
  RANK: Object.freeze(['power', 'above', 'below']),
  POWER: Object.freeze(['power', 'rival', 'issue']),
  INSTITUTION: Object.freeze(['house', 'otherHouse']),
  SUPPLY: Object.freeze(['resource', 'import', 'house']),
  TIES: Object.freeze(['other']),
  PERSONALITY: Object.freeze(['flaw', 'dominant', 'modifier']),
  ALLEGIANCE: Object.freeze(['guild', 'handler', 'front', 'agent', 'target', 'targetHouse']),
  // {shrine} a sacred house on the roster, as a house (needs sacredHouse); {priest} the senior
  // cleric, by name (needs priest); {arcaneHouse} a Magic-shelf house, as a house (its own gate)
  UNCANNY: Object.freeze(['shrine', 'priest', 'arcaneHouse']),
});

/** The design's slots this file does not use, and why (measured on the soak 1,000; the record §1). */
export const GOAL_SLOTS_STRUCK = Object.freeze({
  RANK: Object.freeze({ rank: 'a number (1, 2, 3); the sub-kind (climb, defend, enter) says the rank' }),
  INSTITUTION: Object.freeze({ condition: 'no one field reads as prose: an impairment is a chain status, a dependency a "Grain + water power" key; the sub-kind says which' }),
  SUPPLY: Object.freeze({
    status: 'machinery words (vulnerable, impaired, entrepot, magically_sustained); the sub-kind says which',
    route: 'the isolation receipt holds path keys (local_foodshed, seasonal_access, reserves, patronage), not a route a player names',
    chain: 'a chain\'s label is a catalogue name ("Grain & Bread", "Food Processing", "Iron & Metalwork"), never a slot\'s words (POWERS-9, the chair\'s ruling: no slot prints a catalogue or a chain label); the lines name the work through {house}',
  }),
  TIES: Object.freeze({ kind: 'the tie type is the sub-kind; its label ("Mutual Leverage", "Outstanding Debt") is a card label, not a goal word' }),
  ALLEGIANCE: Object.freeze({ season: 'no season field at birth (the fact vocabulary has no season atom, ruling 8); the WARRANT lines are written without it' }),
});

/** The slots each sub-kind may use (a subset of its family's `GOAL_SLOTS`): what car 4 must fill. */
export const GOAL_SUBKIND_SLOTS = Object.freeze({
  RANK: Object.freeze({ climb: ['power', 'above'], defend: ['power', 'below'], enter: ['power'] }),
  POWER: Object.freeze({ tense: ['power', 'rival'], competitive: ['power', 'rival'], corrupted: ['power', 'rival'], conflict: ['power', 'rival', 'issue'] }),
  INSTITUTION: Object.freeze({ solvency: ['house'], rebuilding: ['house'], charter: ['house'], takeover: ['house', 'otherHouse'] }),
  SUPPLY: Object.freeze({ impaired: ['house'], dependency: ['resource', 'house'], isolation: ['import'], expansion: ['house'], want: ['resource', 'house'] }),
  TIES: Object.freeze({ rival_enemy: ['other'], debtor: ['other'], creditor: ['other'], ally: ['other'], family: ['other'], mentor_student: ['other'] }),
  PERSONALITY: Object.freeze(Object.fromEntries(['greed', 'hunger_for_status', 'fear', 'forbidden_patron', 'duty', 'kindness', 'mastery', 'caution', 'conviction', 'sway', 'grudge', 'impulse']
    .map((k) => [k, Object.freeze(['flaw', 'dominant', 'modifier'])]))),
  ALLEGIANCE: Object.freeze({
    serve_greed: ['guild', 'handler'], serve_hunger_for_status: ['guild', 'handler'], serve_fear: ['guild', 'handler'], serve_forbidden_patron: ['guild', 'handler'],
    escape_greed: ['guild', 'handler'], escape_hunger_for_status: ['guild', 'handler'], escape_fear: ['guild', 'handler'], escape_forbidden_patron: ['guild', 'handler'],
    keep_partnership: ['agent', 'guild'], keep_leverage: ['agent', 'guild'], keep_patron: ['agent', 'guild'], keep_cause: ['agent', 'guild'],
    front_keep: ['front', 'guild', 'handler'], front_out: ['front', 'guild', 'handler'],
    warrant: ['target', 'targetHouse'], suspicion: ['target'],
  }),
  UNCANNY: Object.freeze({ haunting: ['shrine', 'priest'], components: ['arcaneHouse'], commission: [], omen: ['shrine', 'priest'], bargain: [] }),
});

/**
 * The twelve PERSONALITY clusters (design §6.6): the four corruption vectors that birth reaches
 * (`domain/corruption.js :: FLAW_VECTOR`'s 17 flaws), then eight clusters of every other flaw and
 * temperament in `data/npcData.js :: NPC_PERSONALITY_TRAITS` (positive, negative, neutral).
 * A cluster names what such a person WANTS (the record §3 gives the reasoning).
 */
export const PERSONALITY_CLUSTERS = Object.freeze([
  'greed', 'hunger_for_status', 'fear', 'forbidden_patron',
  'duty', 'kindness', 'mastery', 'caution', 'conviction', 'sway', 'grudge', 'impulse',
]);

/** Every trait word → its cluster. Total over `NPC_PERSONALITY_TRAITS` (the test imports the lists). */
export const PERSONALITY_CLUSTER_OF = Object.freeze({
  // the four vectors: the 17 corruptible flaws, each in its own vector
  greedy: 'greed', corrupt: 'greed', 'self-serving': 'greed', ruthless: 'greed', callous: 'greed', 'cold-blooded': 'greed',
  ambitious: 'hunger_for_status', calculating: 'hunger_for_status', opportunistic: 'hunger_for_status', vain: 'hunger_for_status',
  cowardly: 'fear', suspicious: 'fear', paranoid: 'fear',
  deceitful: 'forbidden_patron', manipulative: 'forbidden_patron', mendacious: 'forbidden_patron', cynical: 'forbidden_patron',
  // duty: wants to keep faith with people and promises
  honest: 'duty', brave: 'duty', loyal: 'duty', principled: 'duty', protective: 'duty', steadfast: 'duty', incorruptible: 'duty',
  forthright: 'duty', candid: 'duty', stalwart: 'duty', dependable: 'duty', conscientious: 'duty', 'plain-dealing': 'duty',
  'fair-minded': 'duty', equitable: 'duty', tenacious: 'duty',
  // kindness: wants the good of others
  compassionate: 'kindness', generous: 'kindness', humble: 'kindness', optimistic: 'kindness', merciful: 'kindness',
  magnanimous: 'kindness', 'warm-hearted': 'kindness', gracious: 'kindness', courteous: 'kindness', 'good-humoured': 'kindness',
  hospitable: 'kindness', patient: 'kindness',
  // mastery: wants to do the work well and to understand
  wise: 'mastery', diligent: 'mastery', clever: 'mastery', resourceful: 'mastery', scholarly: 'mastery', methodical: 'mastery',
  intuitive: 'mastery', perceptive: 'mastery', discerning: 'mastery', astute: 'mastery', perfectionist: 'mastery', obsessive: 'mastery',
  // caution: wants safety and privacy
  cautious: 'caution', reserved: 'caution', secretive: 'caution', detached: 'caution', inscrutable: 'caution', stoic: 'caution',
  melancholic: 'caution', brooding: 'caution', prudent: 'caution', temperate: 'caution', 'level-headed': 'caution',
  unflappable: 'caution', pragmatic: 'caution',
  // conviction: wants what they believe to be kept, or to win
  pious: 'conviction', zealous: 'conviction', idealistic: 'conviction', traditionalist: 'conviction', iconoclast: 'conviction',
  superstitious: 'conviction', fatalistic: 'conviction', nostalgic: 'conviction',
  // sway: wants to be followed, deferred to, or seen to be right
  arrogant: 'sway', domineering: 'sway', overbearing: 'sway', imperious: 'sway', proud: 'sway', dismissive: 'sway',
  charismatic: 'sway', diplomatic: 'sway', theatrical: 'sway', stubborn: 'sway', contrarian: 'sway', hypocritical: 'sway',
  // grudge: wants to settle scores, or to have what others have
  cruel: 'grudge', wrathful: 'grudge', vengeful: 'grudge', vindictive: 'grudge', bitter: 'grudge', envious: 'grudge', petty: 'grudge',
  // impulse: wants pleasure, change and freedom from the work
  reckless: 'impulse', lazy: 'impulse', volatile: 'impulse', hedonistic: 'impulse', restless: 'impulse', mercurial: 'impulse',
  eccentric: 'impulse',
});

/**
 * Every tie type the record can produce → the TIES sub-kind for the card at each end (the
 * chair's ruling, 2026-11-08: no new cells; §6.6's counts stand; car 4 wires it). Keys are total
 * over `generators/people/ties.js :: RELATIONSHIP_STRENGTHS` (the test reads that list, never a
 * copy). `from` is the tie's `from` card, `to` its `to` card. Mapped by valence:
 *   rival, enemy, political → rival_enemy  (political is "Mutual Leverage": each holds something
 *                                           over the other, so the wary lines fit, not the ally's)
 *   ally, respect, patron_client → ally    (patron_client at birth is a working arrangement:
 *                                           "Commercial Complicity", "Security Contract")
 *   debtor_creditor → debtor at `from`, creditor at `to` (the old-debt prose names the `from`
 *                                           card as the one who owes; PLAUSIBLE, car 4 confirms)
 *   family → family · lover → family (unreachable at birth; the simulation may light it)
 *   mentor_student → mentor_student at both ends (its lines read true from either end)
 */
export const TIE_TYPE_TO_GOAL_SUBKIND = Object.freeze({
  rival: Object.freeze({ from: 'rival_enemy', to: 'rival_enemy' }),
  enemy: Object.freeze({ from: 'rival_enemy', to: 'rival_enemy' }),
  political: Object.freeze({ from: 'rival_enemy', to: 'rival_enemy' }),
  ally: Object.freeze({ from: 'ally', to: 'ally' }),
  respect: Object.freeze({ from: 'ally', to: 'ally' }),
  patron_client: Object.freeze({ from: 'ally', to: 'ally' }),
  debtor_creditor: Object.freeze({ from: 'debtor', to: 'creditor' }),
  family: Object.freeze({ from: 'family', to: 'family' }),
  lover: Object.freeze({ from: 'family', to: 'family' }),
  mentor_student: Object.freeze({ from: 'mentor_student', to: 'mentor_student' }),
});

const cell = (lines) => Object.freeze(lines.map((l) => (typeof l === 'string' ? l : Object.freeze({ line: l.line, needs: Object.freeze([...(l.needs || [])]), ...(l.excludes ? { excludes: Object.freeze([...l.excludes]) } : {}) }))));

/**
 * BAR8 K-PEOPLE (LAW 14 rule 14h, C14564; vetoable by the owner): A LINE THAT COUNTS THE PEOPLE OF ITS POWER DECLARES THE
 * POWER'S MEMBERS IT NEEDS, beside its cell (the cells' shape law keeps `line`, `needs` and `excludes` only). "Win two more
 * people in {power} ... before {above} notices" needs the person, the one above and two more: four members, as the Power tab
 * counts them (`domain/people/cardPowers.js :: facesInPower`). Read by `people/goals.js :: cellCandidates`: a power with
 * fewer marks the line refused, and the draw goes on to the family's other lines (draw-free, as the charter's refusal).
 * @type {Readonly<Record<string, number>>}
 */
export const GOAL_LINE_MIN_MEMBERS = Object.freeze({
  'Win two more people in {power} over to their side before {above} notices.': 4,
});

/**
 * GOALS-1 (the chair's check of 2026-11-20 10:48 UTC): A GENTLE LINE IS NEVER HELD ON A HARSH TIE. Beside its line, the
 * tie types and strengths (`generators/people/ties.js :: RELATIONSHIP_STRENGTHS`) a TIES line is refused on: template →
 * `{ type: [strengths] }`. Read by `people/goals.js :: cellCandidates` from the tie its TIES call reads: a line refused
 * there is marked refused (never dropped), so the list and every draw stay as they are, and a rotation passes over it.
 * @type {Readonly<Record<string, Readonly<Record<string, readonly string[]>>>>}
 */
export const GOAL_LINE_NOT_ON_TIES = Object.freeze({
  "Earn {other}'s respect, if never their friendship.": Object.freeze({ enemy: Object.freeze(['serious', 'mortal']), rival: Object.freeze(['bitter']) }),
  'Keep the rivalry with {other} a fair one, fought in the open, for as long as it lasts.': Object.freeze({ enemy: Object.freeze(['serious', 'mortal']), rival: Object.freeze(['bitter']) }),
});

/**
 * THE LINES. `GOAL_FAMILY_LINES[family][subKind][vantage]` → the variants (a string, or
 * `{ line, needs }`). Every line is FOR THE OWNER'S VETO.
 */
export const GOAL_FAMILY_LINES = Object.freeze({
  // ── RANK (own power): 3 sub-kinds × 2 vantages × 6 = 36; GOALS-4's wants' tranche +113 at the cells' ends = 149 ──
  RANK: Object.freeze({
    // a card ranked second or third: {above} is the card one place above it
    climb: Object.freeze({
      short: cell([
        "Take over one of {above}'s duties in {power} this season, and be seen to do it well.",
        'Win two more people in {power} over to their side before {above} notices.',
        'Be the one {above} sends whenever something must be done for {power} this season.',
        'Fix a problem {above} has left standing in {power}, and make sure everyone knows who fixed it.',
        'Speak for {power} in one dispute this season where {above} would usually speak.',
        'Show the rest of {power} that {above} can be wrong, without ever saying so aloud.',
        'Get the members of {power} bringing their troubles to them instead of to {above}, this season.',
        'Learn what {above} plans for {power} this season before anyone else does.',
        'Win the trust this season of the members of {power} who stand furthest from {above}.',
        'Win the trust this season of those {above} relies on most in {power}.',
        'Bring one new member into {power} this season who answers to them, not to {above}.',
        'Keep a closer eye on the work of {power} this season than {above} does.',
        'Put one idea before {power} this season that {above} would never have thought of.',
        'Take the blame for nothing this season that {above} gets wrong in {power}.',
        'Learn every duty {above} holds in {power}, in case it falls to them.',
        'Keep their own work in {power} so tidy that {above} finds nothing to fault.',
        'Settle one matter inside {power} this season on their own, without asking {above}.',
      ]),
      long: cell([
        "Lead {power} one day, with {above}'s blessing or without it.",
        "Take {above}'s place in {power}, and keep it longer than {above} did.",
        'Rise past {above} in {power} on their own merit, owing no one for the climb.',
        'Be the first person {power} would turn to, before anyone thinks to ask {above}.',
        'Reach the head of {power} and run {power|it|them} the way {above} never would.',
        'Outlast {above} in {power}, and be ready when the place falls empty.',
        'Be named by {above} as the one to come after {above} in {power}.',
        'Earn more loyalty in {power} than {above} ever had.',
        'Be the steady hand in {power} whenever {above} falters.',
        'Rise in {power} without making an enemy of {above}.',
        "Make {power} stronger under their hand than {power|it was|they were} under {above}'s.",
      ]),
    }),
    // the first of a power: {below} is its second
    defend: Object.freeze({
      short: cell([
        'Keep {below} busy with real work for {power}, too busy to gather friends of their own.',
        'Find out whether {below} has been meeting anyone from {power} in private.',
        'Give {below} one task this season that will show whether they can be trusted.',
        'Settle one quarrel inside {power} before {below} can settle it and take the credit.',
        'Make sure every decision of {power} this season goes out under their own name.',
        'Keep {below} in second place by giving them enough to want and nothing to take.',
        'Give {below} credit in public for one thing this season, and keep the rest.',
      ]),
      long: cell([
        'Stay at the head of {power} until they choose who comes after them.',
        'Hand {power} on to an heir of their own choosing, and not to {below}.',
        'Lead {power} so long and so well that no one, {below} included, thinks of replacing them.',
        'Make {power} so much their own that {power|it|they} could not run a week without them.',
        'Keep {below} loyal for life, and make loyalty pay better than ambition.',
        'Leave {power} stronger than they found {power|it|them}, with {below} still second and content.',
        'Lead {power} so fairly that even {below} has nothing to say against them.',
      ]),
    }),
    // a member who holds no rank
    enter: Object.freeze({
      short: cell([
        'Do one thing for {power} this season that the people who lead {power|it|them} cannot ignore.',
        'Be in the room the next time {power} must decide something that matters.',
        'Find a patron among those who lead {power}, and make themselves useful to them.',
        'Bring {power} a piece of news before anyone else does.',
        'Take on the work in {power} that no one else wants, and do it without complaint.',
        'Be asked for an opinion by those who lead {power}, once, this season.',
        'Bring one new member into {power} this season, and vouch for them.',
        'Take a newer member of {power} under their wing this season.',
        'Answer one public complaint against {power} this season, and answer it well.',
        'Put a proposal of their own before {power} this season, and see it carried.',
        'Arrange the next gathering of {power}, and see that it goes well.',
        'Be trusted with the keys, coin or papers of {power} this season, and hand every one of them back.',
        'Catch a costly mistake in the business of {power} before it is made, and quietly tell someone who leads {power|it|them}.',
        'Make a friend this season of one member of {power} who has been there far longer than they have.',
        'Win {power} one new piece of business or one useful friend that {power|it|they} did not have before.',
        'Carry one grievance of the newer members of {power} to those who lead {power|it|them}, and come back with an answer.',
        'Stand in for any member of {power} who falls ill this season, and keep their work going until they are back.',
        'Learn the work of one office in {power} this season, well enough to fill it if it falls empty.',
        'Keep a careful account of everything they do for {power} this season, so no one else can claim it.',
        'Speak well of those who lead {power} all season, and make sure word of it reaches them.',
        'Turn down a better offer from outside {power} this season, and let it be known why.',
        'Be at hand for every call to the members of {power} this season, without once failing to come.',
        'Help gather what is owed to {power} this season, without making enemies doing it.',
        'Learn the old quarrels inside {power} this season, before they stumble into one.',
        'Win over one member of {power} who has no reason yet to speak for them.',
        'Set down one matter plainly in writing for those who lead {power}, and have it acted on.',
        'Get to know every member of {power} by name before the season ends.',
        'Raise a sum for {power} this season among friends of their own.',
        'Settle one small dispute between {power} and an outsider this season, quietly.',
        'Put something of their own at the service of {power} this season, and ask nothing for it.',
        'Be the one who welcomes visitors to {power} this season, and sends them away pleased.',
        'Work out what {power} truly takes in and pays out, and show it to no one but those who lead {power|it|them}.',
        'Win the goodwill of the people closest to someone who leads {power}.',
        'Give up one day of rest this season to work for {power}.',
        'Learn the rules of {power} by heart this season, and never be caught breaking one.',
        'Keep the count of every vote or tally at the next meeting of {power}, and get it right.',
        'Find one way {power} could save money or time, and put it to those who lead {power|it|them}.',
        'Carry the name of {power} well this season, in every dealing outside {power|it|them}.',
        'Be there on the busiest day of the season for {power}, and stay till the work is done.',
        'Read up on one matter that concerns {power}, until they know it better than anyone.',
        'Earn a word of thanks from those who lead {power} before the season ends.',
        'Look after the hall, the stores or the gear of {power} this season, unasked.',
        'Get two members of {power} working together this season who have never worked side by side.',
        'Be the one {power} can find at any hour this season.',
        'Follow one order from those who lead {power} to the letter this season, however much they doubt it.',
        'Ask to be tested by those who lead {power} this season, and pass.',
        'Get one useful thing they have learned in their own work taken up by {power} this season.',
        'Have every duty they owe {power} done early this season.',
        'Bring one outsider worth knowing to meet those who lead {power} this season.',
        'Stop any loose talk about {power} they hear this season before it spreads.',
        'Go to {power} first with any good opening they find this season.',
        'Lend a hand at one task of {power} this season that is outside their own work.',
        'Spend one free day this season learning how another part of {power} works.',
      ]),
      long: cell([
        'Be counted one day among those who lead {power}.',
        'Earn a place among the leaders of {power} without buying it or marrying into it.',
        'Become someone {power} cannot do without.',
        'Rise in {power} far enough that their word carries weight outside {power|it|them}.',
        'Reach the top of {power} by the long road, one earned favour at a time.',
        'Be given the secrets of {power} to keep, as well as {power|its|their} errands to run.',
        'Spend a whole working life in {power}, and be thanked for it at the end.',
        'See someone of their own choosing follow them into {power}, starting higher than they did.',
        'Open the doors of {power} to people like themselves, who were kept out before.',
        'Win their own line of work a louder voice inside {power}.',
        'Be chosen to bargain for {power} with outsiders, year after year.',
        'Set down the ways of {power} in writing, so they are not lost when the old members die.',
        'Hold the purse of {power} one day, and keep it honest.',
        'Be remembered in {power} as the one who saw {power|it|them} through a hard time.',
        'Leave {power} fairer to newcomers than {power|it was|they were} to them.',
        'Never be passed over in {power} for someone with better friends.',
        'Be able to count on {power} in any trouble, after years of standing by {power|it|them}.',
        'Gather enough friends inside {power} that their word is never left standing alone.',
        'Make their place in {power} pay well enough to live on.',
        'Be the one who teaches every new member of {power} how things are done.',
        'Keep {power} true to what {power|it was|they were} founded for, whoever comes to lead {power|it|them}.',
        'Be given a say in who joins {power}, and choose well.',
        'Be buried with the honours of {power}, and have {power|its|their} members follow the coffin.',
        'Make {power} answer to {power|its|their} ordinary members as well as to those who lead {power|it|them}.',
        'See {power} hold together through their lifetime, without a split.',
        'Rise in {power} without ever stepping on a friend to do it.',
        'Win {power} a name for keeping {power|its|their} word, and keep it.',
        'Leave {power} one lasting gift of their own: a hall, a fund or a custom.',
        'Keep their place in {power} through every change of those who lead {power|it|them}.',
        'Make {power} well loved by the ordinary people here.',
        'Be counted, at the end, among the most trusted members {power} ever had.',
        'Leave {power} better at what {power|it does|they do} than when they joined.',
        'Serve {power} all their life, and never be the one who let {power|it|them} down.',
        'Spread the reach of {power} into one part of this place where {power|it has|they have} none.',
        'Be the member the young ones in {power} look up to.',
        'Serve {power} in every kind of work {power|it has|they have}, one after another.',
        'Win their own neighbours a voice inside {power}.',
        'Never let {power} forget the members who do the plain work.',
        'See {power} stand by this place in its hardest year, and be part of it.',
        'End their days with no enemy inside {power}.',
        'Earn the right to speak at every gathering of {power} without being asked.',
        'Never be ashamed of anything done in the name of {power}.',
        'Win every member of {power} a fair hearing, high or low.',
        'Have a hand in every new rule made inside {power}.',
        'Retire from the work with honour, and still be welcome at every gathering of {power}.',
        'Leave {power} standing and strong for long after they are gone.',
        'Be known in {power} as someone who never broke a confidence.',
        'Be among the few in {power} whose word is never doubted.',
        'Bring {power} through one great change without losing a member.',
        'Set up something inside {power} that helps {power|its|their} members through hard times.',
        'Know the history and the people of {power} better than anyone alive.',
        'Make {power} a home for the best of their own line of work.',
        'See fair treatment for every member of {power} while they have a say.',
        'Leave behind in {power} at least one member who rose because they helped.',
      ]),
    }),
  }),

  // ── POWER vs RIVAL: 4 sub-kinds × 2 vantages × 6 = 48; GOALS-4's wants' tranche +50 at the cells' ends = 98 ──
  POWER: Object.freeze({
    tense: Object.freeze({
      short: cell([
        'Stop {rival} from taking anything more from {power} this season.',
        'Learn the plans of {rival} against {power} before they can act on them.',
        'Win one ally of {rival} over to the side of {power}.',
        'Keep the quarrel between {power} and {rival} from turning into open trouble this season.',
        'Answer the next move by {rival} against {power}, quickly and in public.',
        'Find out which members of {power} are still friendly with {rival}, and why.',
        'Find out who pushes hardest against {power} inside {rival}, and why.',
        'Keep the members of {power} from talking loosely about {rival} in public this season.',
        'Lay up stores, money and friends for {power} in case trouble with {rival} comes this season.',
        'Hold back anyone in {power} who wants to strike at {rival} first.',
        'Find a go-between both {power} and {rival} will listen to.',
        'Keep {power} from being blamed for anything {rival} starts this season.',
        'Get one promise from {rival} this season, before witnesses, that {power} can hold them to.',
        'Make sure every member of {power} hears the same account of the trouble with {rival} this season.',
        'Mend one small thing between {power} and {rival} this season that both sides have let slide.',
        'Keep the business of {power} going this season, whatever comes from {rival}.',
        'Count the friends {power} could call on this season if the trouble with {rival} came to a head.',
        'Keep their own temper with {rival} this season, whatever is said.',
        'Get one member of {rival} to speak openly with {power} this season.',
        'Keep a tally of every slight between {power} and {rival} this season, on both sides.',
        'Find out what has reached {rival} about {power} this season, and from whom.',
        'Keep the trouble with {rival} out of the hearing of outsiders this season.',
        'Learn who outside {power} leans toward {rival}, this season.',
      ]),
      long: cell([
        'See {rival} too weak to threaten {power} again.',
        'Make peace between {power} and {rival} on terms {power} can live with.',
        'Outlast {rival}, and still be standing with {power} when they are gone.',
        'Build {power} up until {power|it is|they are} beyond the reach of {rival}.',
        'Bring {rival} under the sway of {power}, one member at a time.',
        'End the bad blood between {power} and {rival} before the next generation inherits it.',
        'Leave {rival} with no friend left who would side against {power}.',
        'Find out what lies at the root of the trouble between {power} and {rival}, and dig it out.',
        'Keep {power} clean of every wrong {rival} could ever hold against {power|it|them}.',
        'Be the one who finally sits {power} and {rival} down at one table.',
        'Never let {rival} gain a foot of ground at the expense of {power}.',
        'Leave {power} united, so {rival} can never split {power|it|them} from within.',
        'Turn the tables until {rival} must come to {power} for help.',
        'Keep a watch on {rival} all their life, and never let {power} be taken by surprise.',
        'Have this place remember {power} as the side that dealt fairly with {rival}.',
        'Teach the newer members of {power} to stand firm against {rival} long after them.',
        'Shrink the trouble with {rival} until no member of {power} thinks it worth a word.',
        'Make sure the trouble with {rival} never costs {power} a member.',
        'Give {rival} a way to back down that leaves {power} the stronger.',
        'Be the one in {power} who knows {rival} best.',
        'See {power} and {rival} deal with each other as equals one day.',
        'Make {power} strong enough to deal gently with {rival}, and still be safe.',
        'Stand with {power} at every turn of the trouble with {rival}, whatever it costs.',
      ]),
    }),
    competitive: Object.freeze({
      short: cell([
        'Gain ground for {power} at the expense of {rival} before the season is out.',
        'Take one piece of business from {rival} and bring it to {power}.',
        'Beat {rival} to the next opportunity, and win the credit for {power}.',
        'Lure one capable person away from {rival} to work for {power}.',
        'Get to whatever both {power} and {rival} want this season first.',
        'Learn why people favour {rival}, and do better for {power}.',
        'Find out what is planned next inside {rival}, before it can catch {power} out.',
        'Win one useful friend for {power} this season before {rival} can.',
        'Find one thing done better by {rival}, and match it for {power} this season.',
        'Keep the plans of {power} out of the hearing of {rival} this season.',
        'Make {power} quicker than {rival} at one thing this season, and keep the lead.',
        'Learn who does the real work inside {rival}, this season.',
        'Keep every member of {power} this season, so that none goes over to {rival}.',
        'Spend less than {rival} this season to get the same done for {power}.',
      ]),
      long: cell([
        'Make {power} the first name people think of, ahead of {rival}.',
        'Leave {rival} holding nothing that {power} could not take away.',
        'Build {power} into something {rival} can only follow.',
        'Win so much for {power} that the contest with {rival} stops being a contest.',
        'Turn the contest with {rival} into a partnership on terms set by {power}.',
        'See {power} outgrow {rival}, so {power|it never has|they never have} to look over {power|its|their} shoulder again.',
        'Make {power} the one every capable newcomer here wants to join, before {rival}.',
        'Never let {rival} set the terms for {power}, in anything.',
        'Leave {power} with abler members than {rival} could ever boast.',
        'Keep the contest between {power} and {rival} a contest, and never let it turn to hatred.',
        'Learn every skill that gives {rival} an edge, and bring it into {power}.',
        'Be the member of {power} whom every member of {rival} would like to have on their side.',
        'Win {power} a share of everything worth having here, so {rival} never holds it all.',
        'Build up {power} so that {power|it|they} can weather any bad year better than {rival}.',
      ]),
    }),
    // either end of a corrupted relation: written so that both ends read true
    corrupted: Object.freeze({
      short: cell([
        'Learn exactly what {power} and {rival} have agreed in private, and who agreed it.',
        'Keep the dealings between {power} and {rival} out of sight for another season.',
        'Gather proof of what passes between {power} and {rival}, and keep it somewhere safe.',
        'Get a bigger share of what passes between {power} and {rival}.',
        'Find out who else knows about the arrangement between {power} and {rival}.',
        'Make sure no one can trace the arrangement between {power} and {rival} back to them.',
      ]),
      long: cell([
        'Set the terms between {power} and {rival} themselves, and stop taking them from others.',
        'End the arrangement between {power} and {rival} on their own terms.',
        'Be the one who holds the arrangement between {power} and {rival} together, and so be needed by both.',
        'Grow rich on the dealings between {power} and {rival}, and be out of it before anyone looks closely.',
        'Bring the dealings between {power} and {rival} into the open, whatever it costs.',
        'Make the bond between {power} and {rival} so deep that neither can afford to break it.',
      ]),
    }),
    // a `conflicts` entry names the two powers and an issue
    conflict: Object.freeze({
      short: cell([
        'Win the dispute with {rival} over {issue} before the season is out.',
        'Bring one more ally to {power} in the quarrel over {issue}.',
        'Find a way to settle {issue} that leaves {rival} worse off than {power}.',
        'Keep the quarrel with {rival} over {issue} from coming to blows this season.',
        'Learn what {rival} will accept over {issue}, and what they will not.',
        'Hold out against {rival} over {issue} until they give way.',
      ]),
      long: cell([
        'See the question of {issue} settled for good, in favour of {power}.',
        'Win the fight over {issue} so completely that {rival} will never raise it again.',
        'Be remembered as the one who ended the quarrel between {power} and {rival} over {issue}.',
        'Make {power} strong enough to win the next quarrel with {rival}, over {issue} or anything else.',
        'Turn the fight over {issue} into the moment {rival} began to lose.',
        'Settle {issue} by agreement with {rival}, and keep the peace that follows.',
      ]),
    }),
  }),

  // ── INSTITUTION: 4 sub-kinds × 2 vantages × 6 = 48; GOALS-4's wants' tranche +63 at the cells' ends = 111 ──
  INSTITUTION: Object.freeze({
    solvency: Object.freeze({
      short: cell([
        'Get {house} through the season without borrowing.',
        'Collect what is owed to {house} before the season is out.',
        'Cut the spending at {house} by a tenth this season, and keep the work going.',
        'Find {house} one more source of money.',
        'Pay every hand at {house} in full and on time this season.',
        'Keep the accounts of {house} balanced, and show them to anyone who asks.',
        'Sell off whatever lies unused at {house} before the season is out, and keep the money.',
        'Find out where money is slipping away at {house}, and stop it this season.',
        'See that every coin taken at {house} this season is written down the same day.',
        'Bring more money into {house} this season without losing anyone who pays now.',
        'Get paid at once, this season, for all the work done or sold at {house}.',
        'Count everything held at {house} this season, and find out whether anything has gone missing.',
        'Turn away one piece of work this season that would cost {house} more than it pays.',
        'Keep the takings of {house} under lock and key this season, counted every night.',
        'Give credit at {house} this season only to those who have always paid.',
        'Find someone of means to stand surety for {house} this season.',
        'Find a buyer this season for something {house} now lets go to waste.',
        'Look over everything paid to {house} this season, and fix what loses money.',
        'Work out, before the season is out, which parts of the work at {house} make money and which lose it.',
        'Make sure everyone at {house} knows what the work costs this season, and wastes less.',
        'See that whoever pays {house} this season pays on the day.',
        'Keep the money of {house} split between more than one place this season.',
        'Have someone they trust check the counting at {house} this season.',
        "Know by the season's end how many weeks {house} could last with nothing coming in.",
      ]),
      long: cell([
        'See {house} out of debt for good, with money set aside for bad years.',
        'Build up enough savings at {house} to ride out two bad years.',
        'Be remembered as the one who kept {house} out of debt.',
        'Leave more money at {house} than there was when they took charge.',
        'Make {house} too sound for any creditor to threaten.',
        'Hand on {house} with full stores, honest accounts and nothing owed.',
        'Own outright every tool and every roof used for the work at {house}, and pay rent to no one.',
        'Make {house} a lender to others, never a borrower.',
        'Never have to go to anyone outside for money to keep {house} going.',
        'Train someone at {house} to keep the money as carefully as they do.',
        'Spread the money of {house} over more than one kind of work, so one bad year cannot sink the house.',
        'Keep {house} in hands they trust, with no outsider owed a share of it.',
        'Never take on a debt for {house} without knowing how it will be paid.',
        'Pay every hand at {house} a share when the year is good.',
        'Always know to the last coin the money going in and out of {house}.',
        'Make {house} rich enough to help this place in a hard year.',
        'Make sure {house} never leans on one purse so hard that losing it would ruin the house.',
        'Make every part of the work at {house} pay for itself, or end it.',
        "Let no one at {house} spend a coin of the house's money without their leave.",
        'Make {house} able to take on a bigger piece of work without borrowing for it.',
        'Keep the money of {house} counted apart from every other purse, to the last coin.',
        'Never let the money of {house} pass through a single pair of hands unchecked.',
        'Build {house} a fund that pays for every repair the work will ever need.',
        'Keep {house} free of any loan that would take more than a season to pay off.',
      ]),
    }),
    // the house processes an impaired chain: its supply has run thin, or a need has failed
    rebuilding: Object.freeze({
      short: cell([
        'Get the work at {house} back to full strength this season.',
        'Find a new supply for the work at {house}, and have it coming in before the season is out.',
        'Keep every hand at {house} employed while the work is short.',
        'Find out why the work at {house} fell short, and fix the cause.',
        'Win back the people who stopped relying on {house} when the work fell short.',
        'Make do at {house} with what can be had, and waste none of it.',
      ]),
      long: cell([
        'Make the work at {house} safe from the next shortfall.',
        'Restore the work at {house} to its old strength, and then go past it.',
        'Make sure the work at {house} never again hangs on one source of supply.',
        'Leave the work at {house} sounder than it was before the trouble came.',
        'Be remembered for bringing {house} through the lean years.',
        'Turn the trouble at {house} into a reason to do the work better.',
      ]),
    }),
    // the house's rights from those who govern
    charter: Object.freeze({
      short: cell([
        'Get the rights of {house} written down and sealed by those who govern, this season.',
        'Have those who govern confirm, in writing, who may give orders at {house}.',
        'Get {house} excused from one tax or levy this season.',
        'Make sure no new rule from those who govern costs {house} anything this season.',
        'Win {house} first call on any help those who govern can give this season.',
        'Have the old rights of {house} read out and recognised before anyone challenges them.',
        'Win one quarrel over the rights of {house} before those who govern, this season.',
        'Gather under one lock every paper that touches the rights of {house}.',
        'Get those who govern to promise, before witnesses, to leave the rights of {house} alone this season.',
        'Learn whether any of those who govern would gladly cut the rights of {house}, and why.',
        'Find any old rule that hurts {house}, and get it struck off this season.',
        'Invite those who govern to see the work at {house} for themselves this season.',
        'Win {house} leave this season for one new kind of work.',
        'Have one of those who govern name {house} in public as a house that serves this place well.',
        'Win {house} one friend among those who govern before the season is out.',
        'Find out what those who govern want from {house} in return for the rights of the house.',
        'Be ready to answer any complaint against {house} before those who govern can act on it.',
        'Show those who govern this season all the good done for this place at {house}.',
        'Get one new right for {house} agreed this season, however small.',
      ]),
      long: cell([
        'Secure rights for {house} that will outlast whoever governs now.',
        'Make {house} so needed by those who govern that no one dares touch the rights of the house.',
        'Win {house} a lasting privilege that no other house can claim.',
        'Have the rights of {house} set down so firmly that the next ruler must keep them too.',
        'Win {house} a voice whenever those who govern decide something that touches the work.',
        'Leave {house} protected by law, so whoever runs the house next need not fight for the same rights.',
        'Win {house} the right to choose whoever runs the house, without leave from those who govern.',
        'Have {house} written into the laws here as a house no ruler may close.',
        'Win {house} the right to settle quarrels among the people who work there.',
        'Have the rights of {house} carved or painted where everyone can read them.',
        'Win {house} freedom from the tolls and dues that others pay.',
        'Win {house} the right to take on new hands without leave from anyone.',
        'Win {house} the right to set the terms for the work done there.',
        'Have the rights of {house} kept in the same place as the laws here.',
        'Win {house} a say in who may open a house of the same work nearby.',
        'Win {house} rights that cover every hand who works there, not only the one who runs it.',
        'Win {house} a share in deciding the taxes and levies laid on that kind of work.',
        'Win {house} the right to be heard before any judgement is passed on the house.',
        'Make sure the rights of {house} can never be sold or traded away by whoever runs the house next.',
        'See {house} given a public duty by those who govern, and see it done well.',
      ]),
    }),
    // {otherHouse} shares a chain with the card's house
    takeover: Object.freeze({
      short: cell([
        'Buy a share in {otherHouse} before the season is out.',
        'Win over the best hands at {otherHouse} to work for {house}.',
        'Find out how much is owed by {otherHouse}, and to whom.',
        'Win the next big piece of work away from {otherHouse}.',
        'Get {otherHouse} to rely on {house} for something no one else can supply.',
        'Learn who really runs {otherHouse}, and what it would take to replace them.',
      ]),
      long: cell([
        'Bring {otherHouse} under the same roof as {house}.',
        'Run both {house} and {otherHouse}, and set the terms for everyone who deals with either.',
        'Make {otherHouse} a branch of {house} in all but name.',
        'Outlast {otherHouse}, and hire the hands from there when the end comes.',
        'Join {house} and {otherHouse} into one concern too big to challenge.',
        'Own every step of the work that {house} and {otherHouse} now split between them.',
      ]),
    }),
  }),

  // ── SUPPLY CHAIN: 4 sub-kinds × 2 vantages × 6 = 48 (+ LAST-VARIETY's `want`, 4 = 52); GOALS-4's wants' tranche +7 at the cells' ends = 59 ──
  SUPPLY: Object.freeze({
    // the card's house processes a chain whose status is impaired
    impaired: Object.freeze({
      short: cell([
        { line: 'Find a new source of supply for the work at {house} before what is left runs out.', excludes: ['crisis: siege'] },
        'Keep the work going at {house} through the season, whatever it takes.',
        { line: 'Bring in from outside what the work at {house} can no longer get close to home.', excludes: ['crisis: siege'] },
        'Ration what is left at {house} so the work lasts until new supply arrives.',
        { line: 'Find whoever can still supply {house}, and pay them what they ask.', excludes: ['crisis: siege'] },
        'Waste nothing at {house} while the supply is short.',
      ]),
      long: cell([
        'Make the work at {house} safe from the next shortage, with more than one source for every need.',
        'Find a lasting replacement for what the work at {house} lost in the shortage.',
        'Build up stores large enough that the work at {house} never stops for lack of supply again.',
        'Bring the work at {house} back to its full strength, and keep it there.',
        'Be the one who kept the work at {house} alive through the shortage.',
        'Change the way the work is done at {house}, so it needs less of what keeps running short.',
      ]),
    }),
    // the card's house has a trade dependency on {resource}
    dependency: Object.freeze({
      short: cell([
        { line: 'Find a second supplier of {resource}, so one lost cart cannot stop the work at {house}.', excludes: ['crisis: siege'] },
        { line: 'Lay in a season of {resource} at {house} while it can still be had.', excludes: ['crisis: siege'] },
        { line: 'Buy {resource} at the market in bulk this season, while the price is still fair.', needs: ['market'], excludes: ['crisis: siege'] },
        'Learn who controls the supply of {resource}, and get on good terms with them.',
        'Keep {house} working through the season even if the supply of {resource} should fail.',
        'Find a way to make do with less {resource} at {house}.',
      ]),
      long: cell([
        'Free {house} from depending on a single source of {resource}.',
        'Secure a steady supply of {resource} for {house} that no one else can cut off.',
        'Own a share in the supply of {resource}, so the work at {house} can never be held to ransom.',
        'Learn to do the work at {house} with half as much {resource}.',
        'Build up a store of {resource} at {house} large enough to last two bad years.',
        'Make sure the work at {house} never stops for want of {resource}.',
      ]),
    }),
    // the town's isolation receipt applies and its status is precarious or untenable
    isolation: Object.freeze({
      short: cell([
        'Get enough food put by that no household here goes hungry before the next supplies get through.',
        'Find one more way to get food in from outside, however hard the journey.',
        'Count what is in the stores, and make it last until more can be brought in.',
        'Get in enough {import} to last until the next supplies get through.',
        'Get more households growing, hunting or gathering their own food this season.',
        'Make sure the food that is here is shared fairly, and seen to be.',
      ]),
      long: cell([
        'Make this place able to feed itself, whatever happens beyond it.',
        'Open a dependable way in and out that stays open in every season.',
        'Bring enough people and land into use that no one here need fear a lean year.',
        'Build stores deep enough to carry everyone through a year with nothing coming in.',
        'Win a powerful friend outside who will send help when it is needed.',
        'Be remembered as the one who stopped this place going hungry.',
      ]),
    }),
    // the card's house processes a running or operational chain
    expansion: Object.freeze({
      short: cell([
        { line: 'Take on more hands at {house}, and keep them busy all season.', excludes: ['crisis: siege', 'crisis: famine'] },
        { line: 'Win new business for {house} beyond the people who already come.', excludes: ['crisis: siege'] },
        { line: 'Get the most out of the work at {house} while it runs well, and put the gains by.', excludes: ['crisis: siege', 'crisis: famine'] },
        { line: 'Grow the work at {house} by one more pair of hands, then another.', excludes: ['crisis: siege', 'crisis: famine'] },
        'Train an apprentice at {house} to take on part of the work.',
        'Look for a way to do more at {house} with the same hands.',
        'Find one new use for what the work at {house} already makes.',
        'Put one new tool or way of working to use at {house} this season.',
        'Take on a bigger piece of work at {house} this season than any before.',
      ]),
      long: cell([
        'Make the work at {house} the thing this place is known for.',
        'Grow the work at {house} until no one nearby can match it.',
        'Carry the name of {house} beyond this place, so people come from far off for the work done there.',
        'Build the work at {house} into a trade that will feed the next generation here.',
        'Bring every step of the trade, from the first goods to the last, under the roof of {house}.',
        'Double the work at {house}, and find the hands to do it.',
        'Find and keep the best hands in the trade for the work at {house}.',
        'Open a second place for the work of {house}.',
        'Make the work at {house} so good that other places send their young here to learn it.',
        'Make the work at {house} the first that newcomers here look for.',
      ]),
    }),
    // LAST-VARIETY (item 2; BRIEF-LAST, 2026-11-18, the chair's ruling LR2; vetoable by the owner, on the veto list): the card's house has a trade
    // dependency on {resource} that the page's need list says is needed and not brought in (`goals.js` deals this cell only
    // there, beside the dependency cell it refuses). Each line presumes the good lacking, never a supply of it; none buys
    // from outside, so none is refused under a siege.
    want: Object.freeze({
      short: cell([
        'Find something the work at {house} can use in place of {resource}.',
        'Gather what {resource} can be found close to home for the work at {house}.',
      ]),
      long: cell([
        'Open a lasting way to bring {resource} in for the work at {house}.',
        'Win those who govern here over to bringing {resource} in for the work at {house}.',
      ]),
    }),
  }),

  // ── TIES: 6 sub-kinds × 2 vantages × 5 = 60; GOALS-4's wants' tranche +113 at the cells' ends = 173 ──
  TIES: Object.freeze({
    rival_enemy: Object.freeze({
      short: cell([
        'Beat {other} at something this season, in front of people who matter.',
        'Find the weak spot in what {other} is doing, and press on it.',
        "Win over one of {other}'s friends.",
        'Keep {other} from getting the thing they want most this season.',
        'Learn what {other} has been saying about them, and to whom.',
        'Find out who {other} has been meeting this season, and what was agreed.',
        'Take one customer or supporter away from {other} before the season is out.',
        'Give {other} nothing this season that could be used against them.',
        'Find one thing {other} would want kept quiet, and keep it ready.',
        'Have an answer ready for whatever {other} tries next.',
        'Warn their own people about {other} before any harm is done.',
        'Undercut {other} on one piece of work this season, and win it.',
        'Keep their own plans hidden from {other} until it is too late to stop them.',
        'Find others who have reason to stand against {other}, and make common cause with them.',
        'Make sure {other} knows they are being watched this season.',
        'Get people who matter here to look hard at the dealings of {other} this season.',
        'Learn who {other} trusts most, and how far.',
        'Make sure {other} gets no credit for anything done here this season.',
        'Make {other} waste time and money this season on a threat that never comes.',
        'Find out who {other} is afraid of, and why.',
        'Keep the friends of {other} busy with troubles of their own this season.',
        'Be in the room this season wherever {other} hoped to speak unopposed.',
        'Lay a trap for {other} this season, and see if they walk into it.',
        'Get word to {other} this season that they will not back down.',
        'Count who stands with {other} this season, and who only pretends to.',
        'Make {other} pay full price for everything they want from them this season.',
        'Get {other} to make the first mistake this season.',
        'Turn down every offer from {other} this season, however good it looks.',
        "Make sure everyone who matters hears their side before {other}'s this season.",
        'Keep {other} guessing this season about what they will do next.',
        'Make {other} come to them this season, and not the other way round.',
        'Find out what {other} cannot do without, this season.',
        'Leave {other} one false trail to follow this season.',
        'Hear everything said about {other} at the next gathering this season.',
      ]),
      long: cell([
        'Outlast {other}, and be the one still standing.',
        'Settle things with {other} for good, one way or another.',
        'Make {other} admit, in public, that they were wrong.',
        'Leave {other} with no power left to do them harm.',
        'Get so far ahead of {other} that no one remembers they were ever rivals.',
        "Win over everyone who once took {other}'s side.",
        'Know more about {other} than {other} knows about them, for as long as they both live.',
        'Build something of their own that {other} can never take from them.',
        'Keep {other} out of every house, circle and power where they themselves have a say.',
        'See {other} leave this place, and never come back.',
        'Hold, one day, the place {other} holds now.',
        'Never once give {other} the satisfaction of seeing them beaten.',
        'Never have to bow to {other}, however things turn out.',
        'Show everyone here, past any doubt, what {other} really is.',
        'Keep a written account of every move {other} makes against them, ready for the day it is needed.',
        'Never owe {other} anything, not a coin and not a favour.',
        'Never sit at the same table as {other} again.',
        'Be the one {other} fears, and never the one who fears {other}.',
        'Grow stronger with every year that {other} stands against them.',
        'Make sure {other} is never trusted with anything that matters here.',
        'Be first, all their life, wherever {other} wants to be first.',
        'Never lose a thing to {other}, as long as they live.',
        'Win so many friends that {other} can never turn this place against them.',
        'Teach everyone who learns from them to see {other} plainly.',
        'Never let fear of {other} decide anything they do.',
        'Be remembered as the one who stood up to {other} when no one else would.',
        'Make peace with {other} only when {other} asks for it first.',
        'Leave {other} nothing to say about them that anyone would believe.',
        'Spend their life proving {other} wrong about them.',
        'Be the better of {other} in the eyes of the next generation here.',
        'Grow so strong that {other} gives up the fight.',
        'Never trust {other}, whatever {other} says or does.',
        'Gather around them people {other} can never buy.',
        'Be the one who decides, in the end, how their dealings with {other} are remembered.',
      ]),
    }),
    // the card owes {other}
    debtor: Object.freeze({
      short: cell([
        'Pay {other} back one part of what is owed before the season ends.',
        'Do {other} a favour big enough to count against what is owed.',
        'Keep {other} from calling in what is owed this season.',
        'Find out what {other} really wants in return.',
        'Make sure no one else learns how much is owed to {other}.',
        'Ask {other} for more time this season, and get it in writing.',
        'Show {other} this season that what was lent is being put to good use.',
        'Bring {other} something useful this season, as a sign that the debt is not forgotten.',
        'Tell {other} plainly this season when what is owed will be paid.',
      ]),
      long: cell([
        'Be free of what is owed to {other}, completely.',
        'Repay {other} in full, and owe nobody anything again.',
        'Turn the debt to {other} into a friendship between equals.',
        'Become someone {other} needs as much as they are needed.',
        'Clear the debt to {other} without anyone ever learning there was one.',
        'Pay {other} back in a way that leaves {other} owing them.',
        'Be someone {other} would trust with their own money, one day.',
        'Turn what they owe {other} into work done well for {other}.',
        'Prove to {other}, over the years, that the trust was not misplaced.',
      ]),
    }),
    // {other} owes the card
    creditor: Object.freeze({
      short: cell([
        'Call in one part of what {other} owes this season.',
        'Remind {other}, quietly, of what is owed.',
        'Ask {other} for a favour that settles a share of the debt.',
        'Make sure {other} keeps paying, even if late.',
        'Learn whether {other} can still pay what is owed.',
        'Agree with {other} this season on a day for the whole debt to be settled.',
      ]),
      long: cell([
        'Collect everything {other} owes, in full.',
        'Use what {other} owes to bind them as an ally for life.',
        'Forgive {other} the debt in return for one great favour, when the time comes.',
        'Make {other} the first of many who owe them.',
        'Keep {other} in debt for as long as it is useful.',
      ]),
    }),
    ally: Object.freeze({
      short: cell([
        'Stand by {other} in their next quarrel, whoever it is with.',
        'Warn {other} of any trouble before it reaches them.',
        'Do {other} one useful favour this season, unasked.',
        'Bring {other} together with someone who can help them.',
        'Keep the friendship with {other} quiet, where it does the most good.',
        'Share one piece of work with {other} this season, and split what it earns fairly.',
        'Put in a good word for {other} wherever it will count this season.',
        'Settle any small grievance with {other} this season, before it can grow.',
        "Eat at {other}'s table, or have {other} at theirs, once this season.",
        'Give {other} honest advice on one matter this season, as only a friend can.',
        'Go with {other} to one hard meeting this season, so they do not face it alone.',
        'Keep everything {other} tells them in confidence this season to themselves.',
        'Find out whether anything is quietly worrying {other}, and help if it is.',
        'Mark a day that matters to {other} with a gift or a visit this season.',
        'Send {other} word of any opening that would suit them this season.',
        'Stand surety for {other} this season, if they ask it.',
        'Stand in for {other} at one task this season, if they cannot be there.',
        'Agree with {other} this season on one thing they will both refuse to do.',
        'Sit with {other} through one long day of their work this season, to understand it.',
        'Trust {other} this season with something that matters to them.',
        'Work out with {other} this season how to keep their dealings fair to both.',
      ]),
      long: cell([
        'Keep the alliance with {other} strong for as long as both live.',
        'Rise together with {other}, and share what they win.',
        'Make sure {other} never has reason to doubt them.',
        'Protect {other} from anyone who would bring them down.',
        'Turn the bargain with {other} into real trust over the years.',
        'Remember {other} in their will, and be remembered in theirs.',
        'Never let {other} face a hard year alone.',
        'Bring their two families together, so the friendship outlives them both.',
        'Stay on the same side as {other}, whoever comes to govern here.',
        'Stay friends with {other} to the end of their days, whatever happens to their work.',
        'Never let anyone come between them and {other}.',
        'Be the first person {other} turns to, and turn to {other} first in return.',
        'Build something with {other} that carries both their names.',
        'Live out their years near {other}, close enough to call on each other.',
        'Leave {other} better off for having known them.',
        "Keep {other}'s good name safe, as if it were their own.",
        "Learn {other}'s work well enough to stand in for them at need.",
        'Be honest with {other} even when it costs the friendship something.',
        'Be trusted by {other} to see their wishes carried out when they are gone.',
        'Laugh with {other}, years from now, about all they came through together.',
        'Have {other} beside them at every turning point of their life.',
        "Be remembered as {other}'s truest friend.",
        'Keep a place at their table for {other}, always.',
      ]),
    }),
    // a family complication; the kin (blood, marriage, godparent) is not named
    family: Object.freeze({
      short: cell([
        'Keep the family trouble with {other} from reaching anyone outside the family.',
        'Sit down with {other} at the next family gathering and settle one old grievance.',
        "Make sure their work and {other}'s never clash in public this season.",
        'Help {other} with one thing this season, as family should.',
        'Keep {other} from using the family name for their own ends.',
      ]),
      long: cell([
        'Mend things with {other} before it is too late.',
        'Keep the family together, {other} included, whatever their work asks of them.',
        'Protect {other} from the trouble their work might bring on the family.',
        'Leave the family stronger, with {other} on the same side.',
        'Make peace with {other}, so the next generation inherits none of it.',
      ]),
    }),
    // either end of a mentor-and-successor tie: written so that both ends read true
    mentor_student: Object.freeze({
      short: cell([
        'Spend an evening with {other} this season and talk over the work as they once did.',
        'Ask {other} for advice on one hard decision this season.',
        'Show {other} how far they have both come since the lessons ended.',
        'Make sure {other} is not left behind by the changes in the work.',
        'Keep the old lessons between them and {other} private.',
        'Send {other} one piece of work this season that suits them better than anyone.',
        'Talk {other} through one new way of doing the work this season.',
        "Look over one piece of {other}'s work this season, as a favour, and say plainly what they think.",
        'Remind {other} of one lesson from the old days this season, when it is needed most.',
        'Bring {other} along to one meeting about the work this season.',
        "Hear {other}'s news of the work this season, and share their own.",
      ]),
      long: cell([
        'Keep the bond with {other} as the work and the years change them both.',
        'Be remembered alongside {other} as one of the best at the work.',
        'Pass on to someone new what passed between them and {other}.',
        "Never end up in {other}'s shadow.",
        'Settle, once and for all, what they and {other} owe each other.',
        'Work beside {other} again one day, as equals.',
        'Be there when {other} is honoured for the work, whenever that comes.',
        'Never let a quarrel undo what was built between them and {other}.',
        'Be proud of {other}, and give {other} reason to be proud of them.',
        'Leave {other} something of theirs to remember the work by.',
        'Stay honest with {other} about the work, however high either of them rises.',
      ]),
    }),
  }),

  // ── PERSONALITY: 12 clusters × 2 vantages × 4 = 96 (always supported: the floor); GOALS-4's wants' tranche +32 at the cells' ends = 128 ──
  PERSONALITY: Object.freeze({
    greed: Object.freeze({
      short: cell([
        'Put away more coin this season than last.',
        'Find one more way to be paid for work already being done.',
        'Get the better side of every bargain struck this season.',
        'Collect every coin they are owed, however small.',
        'Come out of one bargain this season with twice what they put in.',
        'Charge one person this season for something they used to get free.',
        'Ask a higher share this season of anything they have a hand in.',
      ]),
      long: cell([
        'Grow rich enough that no one can ever tell them no.',
        'Own something that earns while they sleep.',
        'Gather enough wealth to pass on, and leave the family rich after them.',
        'Never have to count coins again.',
        'Hold a share in every good business in this place.',
        'Never pay full price for anything again.',
        'Turn every favour they ever do into money, sooner or later.',
      ]),
    }),
    hunger_for_status: Object.freeze({
      short: cell([
        'Be seen at the right table with the right people this season.',
        'Get their name mentioned whenever something good is done here.',
        'Win a title, a seat or an honour, however small.',
        'Be asked to speak first at the next gathering that matters.',
      ]),
      long: cell([
        'Be known by name in every house here, and further off.',
        'Rise higher than anyone in the family ever has.',
        'Be remembered as one of the great figures of this place.',
        'Reach a place so high that no one keeps them waiting.',
      ]),
    }),
    fear: Object.freeze({
      short: cell([
        'Find out who has been asking about them, and why.',
        'Make sure nothing they did in the past can come back on them this season.',
        'Keep a bag packed and a way out ready.',
        'Win the protection of someone stronger before trouble comes.',
      ]),
      long: cell([
        'Live somewhere no one can reach them uninvited.',
        'Have enough friends in high places that no one dares touch them.',
        'Put the past behind them where no one can dig it up.',
        'Grow old without ever having to look over their shoulder.',
        'Live among neighbours who would stand by them if trouble came.',
      ]),
    }),
    forbidden_patron: Object.freeze({
      short: cell([
        'Learn one secret this season that someone would pay to keep.',
        'Get someone else to take the blame for a mistake of theirs.',
        "Win someone's trust this season, and keep a use for it.",
        'Tell the right story to the right person, and watch it spread.',
      ]),
      long: cell([
        'Know something about everyone who matters here.',
        'Pull the strings in this place without anyone seeing their hand.',
        'Build a life no one can see all of.',
        'Make powerful people need them without knowing why.',
        'Leave behind secrets that keep people guessing long after they are gone.',
      ]),
    }),
    duty: Object.freeze({
      short: cell([
        'Keep every promise they have made this season, even the hard ones.',
        'Stand up for someone who cannot stand up for themselves.',
        'Finish the work they have been given, properly and on time.',
        'Tell the truth about something that others keep quiet about.',
      ]),
      long: cell([
        'Be someone the people here can always count on.',
        'Leave a name that no one can say was ever bought.',
        'Protect the people in their care for as long as they are able.',
        'Do the right thing every time, and be known for it.',
      ]),
    }),
    kindness: Object.freeze({
      short: cell([
        'Help one family through a hard week this season.',
        'Make peace between two people who have stopped speaking.',
        'Give away something this season that they would sooner keep.',
        'Look after someone who has no one else to do it.',
      ]),
      long: cell([
        'Be loved by the people here for the good they did.',
        'Leave this place kinder than they found it.',
        'See every child they know grow up fed and safe.',
        'Keep a household where anyone in need can find a meal and a bed.',
      ]),
    }),
    mastery: Object.freeze({
      short: cell([
        'Solve a problem this season that has beaten everyone else.',
        'Do one piece of work so well that no one could find fault with it.',
        'Learn a new skill from someone who knows it better.',
        'Put their own work in order, down to the last detail.',
      ]),
      long: cell([
        'Become the best at their work that anyone here has known.',
        'Make something that will last long after them.',
        'Teach what they know to someone worthy of it.',
        'Understand how this place really works, every part of it.',
      ]),
    }),
    caution: Object.freeze({
      short: cell([
        'Keep their own affairs private this season, from friend and rival alike.',
        'Put something aside against bad times.',
        'Stay out of every quarrel they can this season.',
        'Check everything twice before they put their name to it.',
      ]),
      long: cell([
        "Live a quiet life, out of other people's quarrels.",
        'Have enough set by that no bad year can break them.',
        'Keep what they have safe, and never stake it on a gamble.',
        'Grow old in peace, with their secrets still their own.',
      ]),
    }),
    conviction: Object.freeze({
      short: cell([
        'Bring one more person round to what they believe this season.',
        'Speak out for what they believe at the next gathering, whoever is listening.',
        'Keep faith with what they hold true, even when it costs them.',
        'Find out who here believes as they do.',
      ]),
      long: cell([
        'See this place live by what they believe is right.',
        'Leave behind people who will carry on what they believe.',
        'Never give way on what they hold most sacred.',
        'Change the way this place thinks, one person at a time.',
      ]),
    }),
    sway: Object.freeze({
      short: cell([
        'Have the last word in the next argument that matters.',
        'Get people doing things their way this season without being asked twice.',
        'Be the one others look to when something goes wrong.',
        'Put someone who slighted them back in their place.',
        'Win over a crowd at the next gathering here, and be cheered for it.',
        'Take charge of one new thing this season, however small, and run it their way.',
        'Settle one dispute here this season by their word alone.',
        "Change one person's mind this season by argument alone.",
        'Set the rules for one game, contest or feast here this season.',
      ]),
      long: cell([
        'Be obeyed without ever having to raise their voice.',
        'Have the final say in everything that touches them.',
        'Be the person everyone here defers to.',
        'Never again be told what to do.',
        'See their way of doing things become the way everyone here does them.',
        'Have people here quote them for years after they are gone.',
        'Bring the stubbornest people here round to their way, one by one.',
        'Be the one this place sends to speak for it before outsiders.',
        'Be the one whose word decides who is welcome here.',
        'Have a hand in choosing whoever leads this place next.',
        'Make every newcomer here learn quickly whose word counts.',
        'Be listened to here even by those who dislike them.',
      ]),
    }),
    grudge: Object.freeze({
      short: cell([
        'Pay someone back for a wrong done to them.',
        'See someone who wronged them lose face in public this season.',
        'Learn the secret of someone they envy.',
        'Take one thing from a person they resent.',
        'Spread one true but unkind story about someone they envy this season.',
        'Beat someone they envy to something both of them want this season.',
        'Let someone they resent see them do well this season.',
        'Keep a careful watch this season on someone they cannot stand.',
      ]),
      long: cell([
        'Settle every score before they die.',
        'Outlast every person who ever crossed them.',
        'Have what others have, and more of it.',
        'Make sure no one wrongs them twice.',
        'Take back, one day, everything they believe was taken from them.',
        'Outdo, in every way they can, the person they have envied longest.',
        'Make sure their name stands higher here than the name of anyone who ever spoke against them.',
        'Keep their anger hidden until the day it can be used.',
        'Win, in the end, every quarrel they ever started.',
        'Count among their friends no one who ever laughed at them.',
      ]),
    }),
    impulse: Object.freeze({
      short: cell([
        'Have some fun this season, whatever it costs.',
        'Do something no one here expects of them.',
        'Get out of the work they have been given, and let someone else do it.',
        'Try their luck at something new before the season is out.',
      ]),
      long: cell([
        'Live well, and worry about tomorrow when it comes.',
        'See more of the world than this place.',
        'Never be tied to one thing for long.',
        'Have a life worth telling stories about.',
        'Spend their last coin on something wonderful, and never regret it.',
      ]),
    }),
  }),

  // ── ALLEGIANCE (DM-only: the goal never prints publicly; design §6.4): 128; GOALS-4's wants' tranche +2 at the cell's end = 130 ──
  // serve × 4 vectors × 2 vantages × 5 = 40 · escape × 4 vectors × short × 5 = 20 ·
  // the handler's keep-in-line × 4 tie kinds × short × 5 = 20 · the front's face × 2 × 2 × 6 = 24 ·
  // WARRANT 2 × 6 = 12 · SUSPICION 2 × 6 = 12
  ALLEGIANCE: Object.freeze({
    serve_greed: Object.freeze({
      short: cell([
        'Do what {handler} asks this season, and collect the payment from {guild}.',
        'Steer one more piece of business toward {guild}, for a share of the profit.',
        'Keep taking money from {guild} without anyone asking where it comes from.',
        'Do {handler} the next favour quickly, and ask for more coin in return.',
        'Prove to {handler} that they are worth a bigger cut.',
      ]),
      long: cell([
        'Grow rich on the money of {guild}, and never be caught.',
        'Become the partner {guild} cannot do without, with the profits to match.',
        'Take enough from the arrangement with {guild} to live on for the rest of their days.',
        'Hold a share of every coin that passes through {guild} here.',
        'Get rich enough from the work for {guild} to walk away whenever they like.',
      ]),
    }),
    serve_hunger_for_status: Object.freeze({
      short: cell([
        'Do the favour {handler} asks, and expect help climbing in return.',
        'Use the backing of {guild} to win one step up this season.',
        'Show {handler} that they can be trusted with more important work.',
        'Get {guild} to clear one rival out of their way this season.',
        'Win a place where they are more use to {guild}, and better seen by everyone else.',
      ]),
      long: cell([
        'Rise to the top here with {guild} behind them, and no one the wiser.',
        'Make themselves worth more to {guild} than the help is worth to them.',
        'Win the standing they want, with {guild} quietly opening the doors.',
        'Become important enough that {handler} answers to them one day.',
        'Climb as high as {guild} can lift them, and then higher alone.',
      ]),
    }),
    serve_fear: Object.freeze({
      short: cell([
        'Do exactly what {handler} asks this season, and give no cause for complaint.',
        'Keep {handler} satisfied, so that what is known stays hidden.',
        'Deliver whatever {handler} asks for, on time, every time.',
        'Stay out of sight of anyone who might connect them to {guild}.',
        'Keep their head down and their work for {guild} quiet.',
      ]),
      long: cell([
        'Stay useful enough to {guild} that what is held over them is never used.',
        'Live with the hold of {guild} on them, and keep everyone they care about out of it.',
        'Make themselves so valuable to {guild} that they are protected.',
        'Grow old with what {handler} knows still kept quiet.',
        'Serve {guild} well enough to be left alone in the end.',
      ]),
    }),
    serve_forbidden_patron: Object.freeze({
      short: cell([
        'Do the next thing {handler} asks, without asking why.',
        'Keep every meeting with {handler} secret, even from their closest friends.',
        'Carry word for {guild} to whoever needs to hear it.',
        'Cover for {guild} this season whenever anyone asks the wrong question.',
        'Win {handler} one more useful friend this season.',
      ]),
      long: cell([
        'Stay in the favour of {guild} for life, and share in what that brings.',
        'Become the voice of {guild} here, known only to those who need to know.',
        'Never let anyone learn who has been helping them, for as long as the help from {guild} lasts.',
        'Rise on the quiet favour of {guild}, owing everything and admitting nothing.',
        'Be trusted with the deepest secrets of {guild}.',
      ]),
    }),
    escape_greed: Object.freeze({
      short: cell([
        'Take the last payment from {guild}, and find a way to end the arrangement.',
        'Set money aside where {handler} cannot reach it.',
        'Find out what it would cost to buy their way free of {guild}.',
        'Stop taking work from {handler} without making an enemy of {guild}.',
        'Find an honest source of money big enough to replace the money from {guild}.',
      ]),
    }),
    escape_hunger_for_status: Object.freeze({
      short: cell([
        'Win a place high enough that {guild} can no longer touch them.',
        'Find a more respectable patron who can take the place of {handler}.',
        'Answer {handler} a little more slowly each time, until the asking stops.',
        'Bury every trace of the help they had from {guild}.',
        'Find someone powerful enough to protect them from {guild}.',
      ]),
    }),
    escape_fear: Object.freeze({
      short: cell([
        'Find out exactly what {handler} holds over them, and where it is kept.',
        "Get the proof out of {handler}'s hands.",
        'Find someone in authority who would shield them if they talked.',
        'Gather something on {handler} to hold over them in turn.',
        'Get far enough away that {guild} cannot follow.',
      ]),
    }),
    escape_forbidden_patron: Object.freeze({
      short: cell([
        'Break off from {handler} without letting {guild} see it coming.',
        'Find a patron they can name in public, and move to their side.',
        'Burn every message ever received from {handler}.',
        'Learn what {guild} would do if they walked away, before they try it.',
        'Confess to someone they trust, and ask for help getting out.',
      ]),
    }),
    // the handler keeps {agent} in line, by the handler tie's kind (design §1.5)
    keep_partnership: Object.freeze({
      short: cell([
        'Keep {agent} paid well enough to stay loyal to {guild}.',
        'Check that {agent} does the work they are paid for by {guild}, and nothing on the side.',
        'Find {agent} a new piece of work for {guild} that pays them both.',
        'Remind {agent} how much they have already earned from {guild}.',
        'Keep {agent} from spending the money where people will notice.',
      ]),
    }),
    keep_leverage: Object.freeze({
      short: cell([
        'Remind {agent}, quietly, of what could come out if they stop cooperating.',
        'Keep what is held over {agent} safe, and somewhere {agent} cannot find it.',
        'Give {agent} a task this season that ties them closer to {guild}.',
        'Watch {agent} for any sign that they are looking for a way out.',
        'Make sure {agent} never has reason to think they could win by talking.',
      ]),
    }),
    keep_patron: Object.freeze({
      short: cell([
        'Pass {agent} a favour from {guild} that they could not have won alone.',
        'Meet {agent} where no one will see them together.',
        "Make sure {agent} knows the patron's favour can be taken away as easily as it was given.",
        'Keep {agent} from learning who really stands behind {guild}.',
        'Ask {agent} for one thing this season, and reward them well when it is done.',
      ]),
    }),
    keep_cause: Object.freeze({
      short: cell([
        'Keep {agent} sure that the cause is worth what it costs them.',
        'Give {agent} a part to play this season that shows the cause needs them.',
        'Keep {agent} away from anyone who might talk them out of the cause.',
        'Remind {agent} of the oath they swore.',
        "Test {agent}'s loyalty to {guild} with one hard task.",
      ]),
    }),
    // the front's face: {front} is the agent's own house
    front_keep: Object.freeze({
      short: cell([
        'Keep the accounts at {front} clean enough to pass any inspection this season.',
        'Move what comes from {guild} through {front} without the regular hands noticing.',
        'Give every coin from {guild} an honest-looking reason to be at {front}.',
        'Keep the people working at {front} busy, paid and incurious.',
        'Turn away anyone asking too many questions about the work at {front}.',
        'Agree with {handler} what can pass through {front} this season, and what cannot.',
      ]),
      long: cell([
        'Run {front} so well that no one ever thinks to look behind the honest work.',
        'Make the honest trade at {front} large enough to hide the money from {guild}.',
        'Keep {front} serving {guild} for years without a single slip.',
        'Grow the honest work at {front} until it could stand alone, if it ever had to.',
        'Keep the people of {front} safe from whatever trouble follows {guild}.',
        'Leave {front} to an heir one day with the books clean and the secrets buried.',
      ]),
    }),
    front_out: Object.freeze({
      short: cell([
        'Find a way to stop {guild} using {front} without {handler} noticing at once.',
        'Clear the books at {front} of everything that links them to {guild}.',
        'Turn down the next thing {handler} wants moved through {front}.',
        'Find out what {guild} would do if the work at {front} stopped serving them.',
        'Quietly find a buyer for {front} who knows nothing of the arrangement.',
        'Let {handler} believe all is well at {front} while they look for a way out.',
      ]),
      long: cell([
        'Free {front} from {guild}, and run an honest business from then on.',
        'Make {front} worth so little to {guild} that the arrangement is dropped.',
        'Sell {front}, and leave with enough to start again somewhere else.',
        'See {front} clean of {guild} before handing the business on.',
        "Run an honest business at {front} again, with no one else's goods in it.",
        'Find protection strong enough that {front} can refuse {guild} for good.',
      ]),
    }),
    // the law's pursuit (design §6.4, §3.5): {target} is an open member of {targetHouse}
    warrant: Object.freeze({
      short: cell([
        'Bring {target} of {targetHouse} in before the season is out.',
        'Catch {target} with something from {targetHouse} on them, in front of witnesses.',
        'Find one person willing to speak against {target}, and keep them safe until they do.',
        'Watch who goes in and out of {targetHouse}, and write it all down.',
        'Close one of the routes that money takes into {targetHouse}.',
        'Get enough on {target} to hold them, and make it stick.',
        'Find out whether anyone warns {targetHouse} when the law comes near, and who.',
        'Learn where {target} sleeps, eats and drinks this season.',
      ]),
      long: cell([
        'Break {targetHouse}, and see {target} pay for what they have done.',
        'Rid this place of {targetHouse} for good.',
        'Build a case against {target} that no friend of {targetHouse} can buy away.',
        'Make sheltering {targetHouse} too costly for anyone to risk.',
        'See {target} and everyone above them in {targetHouse} brought to account.',
        'Leave behind people who will keep watching {targetHouse} long after them.',
      ]),
    }),
    // a hidden allegiance's holder: the target only (its guild is veiled)
    suspicion: Object.freeze({
      short: cell([
        'Prove what {target} answers to.',
        'Find out where {target} goes when no one is meant to be watching.',
        'Learn who {target} really meets, and how often.',
        "Find out where {target}'s money comes from.",
        'Get one person close to {target} to talk, quietly.',
        'Keep watching {target} until they make one mistake.',
      ]),
      long: cell([
        'Uncover who {target} truly serves, and everyone else who serves them.',
        'Prove what {target} is, so plainly that no one can look away.',
        'Bring {target} to account for whatever they are hiding.',
        'Turn {target}, and use them against whoever holds their leash.',
        'Keep {target} watched for as long as it takes to learn the truth.',
        'Follow the trail from {target} to whoever stands at the other end of it.',
      ]),
    }),
  }),
  // ── UNCANNY (the owner, 2026-11-08: "purely fantasy aesthetic goals … with magic on only as the gate …
  // peppered in the settlement very rarely if at all but scaling across population sizes"): 5 × 2 × 6 = 60.
  // Every line needs the world's magic ON (`magic`, the vocabulary's magic-functions atom); a thing the
  // town holds is a slot or a declared atom; a being the record does not hold (a dragon, a spirit, the
  // fair folk) is flavour only and presumes nothing else. ──
  UNCANNY: Object.freeze({
    // haunted by a creature or spirit; seeks an exorcist, a priest, a ward
    haunting: Object.freeze({
      short: cell([
        { line: 'Find someone who can rid their house of the thing that walks it at night.', needs: ['magic'] },
        { line: 'Get {priest} to bless the house before the next new moon.', needs: ['magic', 'priest'] },
        { line: 'Learn the name of the spirit that follows them, so it can be sent away.', needs: ['magic'] },
        { line: 'Bring an offering to {shrine} and ask for a ward against what haunts them.', needs: ['magic', 'sacredHouse'] },
        { line: 'Find out who died in the house before them, and what the dead one wants.', needs: ['magic'] },
        { line: 'Hire someone brave enough to sit up a night with them and see the thing for themselves.', needs: ['magic'] },
      ]),
      long: cell([
        { line: 'Be free of the haunting for good, and sleep a whole night again.', needs: ['magic'] },
        { line: 'Learn why the dead chose them, and put the matter right.', needs: ['magic'] },
        { line: 'Find an exorcist who can do what {priest} could not.', needs: ['magic', 'priest'] },
        { line: 'Lay the restless dead of their family to rest at {shrine}.', needs: ['magic', 'sacredHouse'] },
        { line: 'Never again let the thing that haunts them follow them through a door.', needs: ['magic'] },
        { line: 'Make peace with the ghost, since it cannot be driven out.', needs: ['magic'] },
      ]),
    }),
    // gathering components or offerings for a magical or eldritch being: a pact, a summoning, a cure
    components: Object.freeze({
      short: cell([
        { line: 'Gather the last three things the being asked for before the moon turns.', needs: ['magic'] },
        { line: 'Buy a rare reagent at {arcaneHouse} without saying what it is for.', needs: ['magic'] },
        { line: 'Find bone, salt and silver in the amounts the pact demands.', needs: ['magic'] },
        { line: 'Dig up what lies buried where the instructions say, and tell no one.', needs: ['magic'] },
        { line: 'Take one thing the summoning needs from someone who would never sell it.', needs: ['magic'] },
        { line: 'Find someone who can read the old writing on the list of what is needed.', needs: ['magic'] },
      ]),
      long: cell([
        { line: 'Complete the summoning, and get what was promised in return.', needs: ['magic'] },
        { line: 'Gather everything the being demands, and then learn what it truly wants.', needs: ['magic'] },
        { line: 'Win the cure the being promised for someone they love, whatever it costs.', needs: ['magic'] },
        { line: 'Learn enough of the old craft at {arcaneHouse} to finish the work without help.', needs: ['magic'] },
        { line: 'Keep the pact they made, so the being never comes to collect in its own way.', needs: ['magic'] },
        { line: 'Become the one the being speaks through, and keep that secret.', needs: ['magic'] },
      ]),
    }),
    // sent on a mission, a tribute or a message by a dragon or a great power
    commission: Object.freeze({
      short: cell([
        { line: "Carry the dragon's message to the person it named, and come back alive.", needs: ['magic'] },
        { line: 'Collect the tribute the dragon demands before it comes to collect it itself.', needs: ['magic'] },
        { line: 'Find the thing the dragon sent them to find, and tell no one why.', needs: ['magic'] },
        { line: 'Deliver a sealed gift from a great power to the one it was meant for, unopened.', needs: ['magic'] },
        { line: "Learn where the dragon's old enemy is hiding, as they were told to.", needs: ['magic'] },
        { line: "Keep the dragon's mark on them hidden from everyone here.", needs: ['magic'] },
      ]),
      long: cell([
        { line: "Finish the dragon's errand, and be free of its claim on them.", needs: ['magic'] },
        { line: 'Serve the great power well enough to earn its protection for life.', needs: ['magic'] },
        { line: 'Find out why the dragon chose them out of everyone here.', needs: ['magic'] },
        { line: "Win the dragon's favour, and use it to change their own fortunes.", needs: ['magic'] },
        { line: "Bring the dragon's quarrel to an end without being destroyed by it.", needs: ['magic'] },
        { line: 'Repay the dragon what was promised, and never be called on again.', needs: ['magic'] },
      ]),
    }),
    // a prophecy, dream or omen that must be answered
    omen: Object.freeze({
      short: cell([
        { line: 'Find out what the dream that keeps coming back is trying to tell them.', needs: ['magic'] },
        { line: 'Have {priest} read the omen that came to them, and do what it says.', needs: ['magic', 'priest'] },
        { line: 'Do the one thing the prophecy asks of them before the season ends.', needs: ['magic'] },
        { line: 'Find the person the omen pointed to, without telling them why.', needs: ['magic'] },
        { line: 'Write down every sign they have seen, and show it to someone who understands such things.', needs: ['magic'] },
        { line: 'Keep watch at {shrine} on the night the omen named.', needs: ['magic', 'sacredHouse'] },
      ]),
      long: cell([
        { line: 'Meet the fate the prophecy gives them on their own terms.', needs: ['magic'] },
        { line: 'Prove the omen wrong, whatever it takes.', needs: ['magic'] },
        { line: 'Live long enough to see whether the prophecy comes true.', needs: ['magic'] },
        { line: 'Become the one the old prophecy speaks of, if they are.', needs: ['magic'] },
        { line: 'Learn to read the signs for themselves, so no one else has to tell them.', needs: ['magic'] },
        { line: 'Keep this place safe from what the omen warns of.', needs: ['magic'] },
      ]),
    }),
    // a bargain with the fair folk or a spirit of the place, to fulfil or to escape
    bargain: Object.freeze({
      short: cell([
        { line: 'Pay the fair folk what is owed before the next full moon.', needs: ['magic'] },
        { line: 'Leave the right offering at the river each night until the bargain is kept.', needs: ['magic', 'river'] },
        { line: 'Find a way out of the promise made to the spirit of the wood without breaking it.', needs: ['magic', 'terrain: forest'] },
        { line: 'Keep the bargain secret, even from their own family.', needs: ['magic'] },
        { line: 'Find out exactly what was given away in the bargain, and whether it can be won back.', needs: ['magic'] },
        { line: 'Bring the spirit the one gift it asked for, and ask for nothing more.', needs: ['magic'] },
      ]),
      long: cell([
        { line: 'Escape the bargain with the fair folk, and keep everything they love.', needs: ['magic'] },
        { line: 'Keep the bargain faithfully, and live well on what it gives.', needs: ['magic'] },
        { line: 'Win back what the spirit took from them.', needs: ['magic'] },
        { line: 'Become the one person here the spirits of the place will deal with.', needs: ['magic'] },
        { line: 'End the bargain, so their children never inherit it.', needs: ['magic'] },
        { line: 'Make a second bargain good enough to undo the first.', needs: ['magic'] },
      ]),
    }),
  }),
});

/**
 * THE RESERVE LINES (GR1, GOALS-1, the chair's rule: no goal wording twice in one town). The same shape as
 * `GOAL_FAMILY_LINES` (`[family][subKind][vantage]` → `cell([...])`), kept APART from the cells: a line here is never
 * drawn, only TAKEN by a repeat's rotation (`generators/people/goals.js :: dealGoals`, pass two), so appending one moves
 * no draw (appending to a cell would change its pick's modulus and move every draw of that kind). Empty at birth; the
 * 25 lines of RANK, POWER, INSTITUTION and TIES are the chair's approval of 2026-11-20 10:48 UTC (GOALS-1, builder 4), the
 * 16 of PERSONALITY its approval of 13:32 UTC (GOALS-3, builder 7: also walked by the floor, `personalityFloor`), outside
 * the cells' totals.
 */
export const GOAL_RESERVE_LINES = Object.freeze({
  RANK: Object.freeze({
    enter: Object.freeze({
      short: cell([
        'Learn how decisions are really made in {power}, and whose word settles them.',
        'Have their name put forward for the next place that opens in {power}.',
        'Keep every promise they make inside {power} this season, however small.',
        'Speak up for {power} once this season when it costs them something to do so.',
      ]),
      long: cell([
        'Be given a rank in {power} one day for years of faithful service, and ask for nothing sooner.',
        'Be trusted by every side inside {power}, so that a quarrel there is brought to them to settle.',
        'Change one thing about the way things are done in {power}, from the inside.',
      ]),
    }),
  }),
  POWER: Object.freeze({
    tense: Object.freeze({
      short: cell([
        'Find one matter this season on which {power} and {rival} want the same thing.',
        'Give {rival} no fair cause for complaint against {power} this season.',
      ]),
      long: cell([
        'Be the one person in {power} that {rival} will always agree to hear.',
        'Keep {power} out of every quarrel with {rival} that is not truly {power|its|their} own.',
        'Free {power} of any need for what only {rival} can give.',
      ]),
    }),
  }),
  INSTITUTION: Object.freeze({
    solvency: Object.freeze({
      short: cell([
        'Put a little by at {house} every week this season, however small the sum.',
        { line: 'Win better terms from one of those who supply {house}, before the season is out.', excludes: ['crisis: siege'] },
      ]),
      long: cell([
        'Make {house} known to every supplier as a house that pays on the day.',
        'Let {house} grow only as fast as the money comes in, and no faster.',
        'Leave the accounts of {house} so plain that whoever comes next could take them up.',
        'Deal fairly with everyone {house} deals with, in good years and bad, and be trusted for it.',
      ]),
    }),
    charter: Object.freeze({
      long: cell([
        'Win rights for every house that does the same work as {house}, not for {house} alone.',
      ]),
    }),
  }),
  TIES: Object.freeze({
    rival_enemy: Object.freeze({
      short: cell([
        "Keep out of {other}'s way this season, and get on with their own work in peace.",
        "Quietly learn one thing this season from watching {other} at work.",
      ]),
      long: cell([
        "Earn {other}'s respect, if never their friendship.",
        "Leave a name that will be remembered longer than {other}'s.",
        'Come through the rivalry with {other} no meaner than they went into it.',
        'Keep the rivalry with {other} a fair one, fought in the open, for as long as it lasts.',
      ]),
    }),
  }),
  // GOALS-3 (builder 7; the chair's ruling of 13:17 UTC on cause B and approval of these lines at 13:32 UTC): a PERSONALITY cell's
  // reserve, keyed like its cells (cluster, vantage), reached only by the walk (a repeat's rotation, the floor), never by the draw
  PERSONALITY: Object.freeze({
    greed: Object.freeze({
      short: cell([
        'Spend nothing this season that someone else could be made to pay for.',
      ]),
      long: cell([
        'Have half the people here owing them money.',
      ]),
    }),
    hunger_for_status: Object.freeze({
      long: cell([
        'Live in the finest house here, and have everyone know whose it is.',
      ]),
    }),
    fear: Object.freeze({
      long: cell([
        'Never again owe anything to someone who could use it against them.',
      ]),
    }),
    forbidden_patron: Object.freeze({
      long: cell([
        "Be everyone's confidant, and no one's friend.",
        'Keep a foot in every camp here, and let each camp think it is the only one.',
      ]),
    }),
    kindness: Object.freeze({
      short: cell([
        'Keep company this season with someone who is grieving.',
      ]),
      long: cell([
        'Forgive everyone who has ever wronged them, and mean it.',
      ]),
    }),
    sway: Object.freeze({
      short: cell([
        'Be proved right this season about something everyone else doubted.',
      ]),
      long: cell([
        'Never once be seen to back down.',
        'Have a following who would go wherever they lead.',
      ]),
    }),
    grudge: Object.freeze({
      short: cell([
        'Spoil one good thing this season for someone who once slighted them.',
      ]),
      long: cell([
        'See the people who looked down on them come asking for their help.',
        'Never let a single wrong done to them be forgotten.',
      ]),
    }),
    impulse: Object.freeze({
      short: cell([
        'Slip away for a few days this season, and tell no one where.',
      ]),
      long: cell([
        "Never do a day's work they do not feel like doing.",
      ]),
    }),
  }),
});
