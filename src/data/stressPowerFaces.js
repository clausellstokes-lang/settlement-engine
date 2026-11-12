/**
 * data/stressPowerFaces.js — WHO STANDS FOR A POWER A STRESS BRINGS (COHERENCE-POWERS item 3; the chair's ruling of
 * 2026-11-12 on the second seat's item 0 STOP, vetoable by the owner). One row per power a stress pushes onto the
 * roster (generators/power/stressFactions.js :: applyStressEventFactions) that has a backing archetype, so no `other`
 * mint faces it, and that no house's share may reach. Keyed by the stress of origin, never by a pool-drawn name.
 *
 * The order the rule takes:
 *   (0) `house`: the town's house the power sits in by its nature, by the backing catalogue's kind of house
 *       (`kinds`) or the house's own name (`names`); its face is the power's first, the next such house where that
 *       face already leads another power of the town;
 *   (a) `cast`: the stress's own cast (domain/crisis/crisisCast.js): the house rule of the role that stands for
 *       the power (the defender's houses, the lever's houses), never a fabricated citizen;
 *   (b) `leaderless`: where neither (0) nor (a) stands and the power by its nature has no single voice (a committee,
 *       a congregation, a claimants' party, a band, a commons' movement), one declared line the page prints in place
 *       of its people. Every row but the appointed one carries a line (the appointed power always has its mint).
 * `appointed`: the power is sent in from outside and wears one hat (the occupier's man: the R-P4 mint row
 * people/mintTitles.js :: OTHER_MINT_ROWS gives it). `veiled`: the power works in secret, so its face is veiled.
 * `archetype` stands for a pool-drawn name (succession_void's claimants): a power of that archetype that is not the
 * roster's own, not the density law's rival and not the ruler.
 */

/**
 * @typedef {{ stress: string, power?: string, archetype?: string, house?: { kinds?: string[], names?: RegExp },
 *   cast?: RegExp, leaderless?: string, appointed?: boolean, veiled?: boolean, seated?: boolean }} StressPowerFace
 */

/** @type {ReadonlyArray<Readonly<StressPowerFace>>} */
export const STRESS_POWER_FACES = Object.freeze([
  // the defender's houses (crisisCast.js :: defenderCandidates, the house rule) for a war council
  { stress: 'under_siege', power: 'War Council', house: { kinds: ['military'] }, cast: /garrison|barracks|watch|militia|wall|guard/i,
    leaderless: 'It has no one captain: the able-bodied householders sit on it by turns and decide together.' },
  { stress: 'wartime', power: 'War Council', house: { kinds: ['military'] }, cast: /garrison|barracks|watch|militia|wall|guard/i,
    leaderless: 'It has no one captain: the able-bodied householders sit on it by turns and decide together.' },
  // SEATED (COHERENCE-POWERS-3, the chair's rulings (1) and (2) of 2026-11-12): a crisis whose own name says a power
  // holds the town, or that the realm is split, seats that power second, after the ruling power, at every size
  // (density/densityRoll.js :: rollDensityPlan reads the mark through applyDensityLaw.js :: planFor)
  { stress: 'occupied', power: 'Occupation Authority', appointed: true, seated: true },
  { stress: 'politically_fractured', power: 'Loyalist Noble Bloc', seated: true, house: { kinds: ['noble'] },
    leaderless: 'No one house speaks for it: the lords who back the crown act together.' },
  { stress: 'politically_fractured', power: 'Reform Noble Bloc', seated: true, house: { kinds: ['noble'] },
    leaderless: 'No one house speaks for it: the lords who want new terms act together.' },
  { stress: 'politically_fractured', power: 'Third Bloc (Neutrals)', seated: true },
  // a fractured realm's pool-drawn bloc (stressFactions.js :: pushPoolNamed, category 'other')
  { stress: 'politically_fractured', archetype: 'other', seated: true },
  { stress: 'occupied', power: 'Resistance Network', veiled: true,
    leaderless: 'It has no one leader: each cell knows only its own, and no one speaks for the whole.' },
  // the healing house; else the plague's lever (crisisCast.js :: CRISIS_LEVERS.plague_onset)
  { stress: 'plague_onset', power: 'Quarantine Council', house: { names: /healer|hospital|apothec|infirm|hospice/i },
    cast: /healer|hospital|apothec|infirm|hospice|temple|church|shrine/i,
    leaderless: 'It has no one head: the households of each street keep the quarantine among themselves.' },
  { stress: 'famine', power: 'Grain Holders', house: { names: /granar|storehouse|warehouse/i, kinds: ['merchant'] },
    leaderless: 'It is no one body: it is every household and dealer with a full bin.' },
  { stress: 'monster_pressure', power: 'Monster Hunters / Adventurers', house: { names: /charter|adventur/i },
    cast: /watch|garrison|militia|guard|barracks|ranger|palisade/i,
    leaderless: 'It has no one captain: the hunters come and go, and none stays long enough to lead.' },
  { stress: 'insurgency', power: "People's Council",
    leaderless: 'It has no one leader yet: the commons speak for it in the street, and no one can treat with it.' },
  { stress: 'religious_conversion', power: 'Reform Congregation', house: { kinds: ['religious'] },
    leaderless: 'It has no one priest yet: its people meet in their own houses and lead the prayers by turns.' },
  { stress: 'religious_conversion', power: 'New Faith Community', house: { kinds: ['religious'] },
    leaderless: 'It has no one preacher here: the converts meet in one another\'s houses.' },
  { stress: 'religious_conversion', power: 'Conversion Enforcement Office', house: { kinds: ['religious'] },
    leaderless: 'It has no one officer in town: its orders come from the faith\'s own seat, and the faithful carry them out.' },
  // COHERENCE-POWERS-3 (F4): every power stressFactions.js pushes whose kind is one a house backs (so no face is minted
  // for it) has its row, enumerated from the source; a power of no backed kind is minted its face (castPowers.js)
  { stress: 'indebted', power: 'Crown Creditors (Noble Coalition)', house: { kinds: ['noble'] },
    leaderless: 'No one lord speaks for it: the houses that hold the crown\'s debt act together.' },
  { stress: 'insurgency', power: "Commons' Reform Assembly",
    leaderless: 'It has no one leader yet: the commons speak for it in the street, and no one can treat with it.' },
  { stress: 'insurgency', power: 'Loyalist Noble Opposition', house: { kinds: ['noble'] },
    leaderless: 'No one house leads it: the lords who stand by the old order act together.' },
  { stress: 'insurgency', power: "Reform Stewards' Coalition",
    leaderless: 'It has no one head: the stewards who want reform speak for it together.' },
  { stress: 'religious_conversion', power: 'Underground Old Faith', veiled: true,
    leaderless: 'It has no one priest: the old faith\'s people keep its rites in secret, house by house.' },
  // a claimant's party: the old families' houses
  { stress: 'succession_void', archetype: 'noble', house: { kinds: ['noble'] },
    leaderless: 'No one claimant has stepped forward yet: the old families press the claim together.' },
]);

/**
 * A criminal power no house of its own stands behind (a small place's protection operation:
 * generators/power/rulingStructure.js gives it its own description) has its master, veiled: the guildmaster of the
 * seat mint's table (people/mintTitles.js :: SEAT_MINT_TITLES).
 */
export const HOUSELESS_CRIMINAL_FACE = Object.freeze({ title: 'the guildmaster', role: 'Guildmaster', category: 'criminal', titleKey: 'lord' });
