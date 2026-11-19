/**
 * domain/display/magicProvisionShown.js — THE PROVISION A PAGE CLAIMS IS OF A TRADITION THE TOWN HOLDS (W2-C-LEAVES-5
 * item 5, 2026-11-14; the round-three cut's #1153: "Blessed stores; divine provision fills the gap" and "40% recovery" on
 * a metropolis whose defence holds no divine tradition and whose Magic tab says "Economic role: absent").
 *
 * RULED (record 387): one home for "the town has clergy with powers", the defence's tradition facts (`facts/magic.js`:
 * `defenceHoldsDivine`, `defenceHoldsDruidic`, a separate tradition, and `defenceHoldsArcane`). Where the town does not
 * hold a tradition, no provision of that tradition is claimed in words: a chain card's magic note of it leaves, and the
 * food row and sentence name no kind of provision. The figures stand as the record's; the record is not touched (the
 * disagreement is named in the lane's hand-back with its count). A tradition with no home of its own (alchemy) is not
 * denied here.
 *
 * Pure: no randomness, no clock, no write.
 */
import { defenceHoldsArcane, defenceHoldsDivine, defenceHoldsDruidic, economyShowsMagic, magicOf } from '../facts/magic.js';
import { MAGIC_NOTE_TRADITION } from '../facts/magicSource.js';
import { chainNeedsMagic, deriveMagicReliance, foodMagicShare, FOOD_SUPPLY_DEPENDENT } from '../magicReliance.js';
import { standingDefenseForces } from '../institutions/defenseInstitutionBuckets.js'; // BAR2-LABELS-4: the standing (ruin-filtered) magic bucket
import { magicSourceOf } from '../facts/magicSource.js'; // BAR3-LABELS-2 L1c: the houses that supply the magic, one home
import { liveInstitutions } from '../institutions/institutionRoster.js'; // L1c: the live roster the supply names its houses from

/**
 * Whether the town holds the tradition a provision is of.
 * @param {unknown} record the settlement record
 * @param {unknown} tradition 'divine' | 'druid' | 'arcane' | 'alchemy' (`facts/magicSource.js :: MagicTradition`)
 * @returns {boolean}
 */
export function magicTraditionHolds(record, tradition) {
  return tradition === 'divine' ? defenceHoldsDivine(record)
    : tradition === 'druid' ? defenceHoldsDruidic(record)
      : tradition === 'arcane' ? defenceHoldsArcane(record)
        : true;
}

/**
 * The magic note a chain card prints: the record's note (`chain.magicNote`, written only by
 * `generators/chainMagicSubstitution.js`) where the town holds the tradition that wrote it (`MAGIC_NOTE_TRADITION`),
 * else '' (the card claims nothing).
 * @param {{ magicNote?: unknown } | null | undefined} chain
 * @param {unknown} record the settlement record
 * @returns {unknown} the note as the card prints it
 */
export function magicNoteShown(chain, record) {
  const note = chain?.magicNote;
  if (typeof note !== 'string' || !note) return note;
  if (!magicTraditionHolds(record, MAGIC_NOTE_TRADITION[note])) return '';
  if (MAGIC_FOOD_NOTES.has(note) && !(foodMagicShare(record) > 0)) return '';
  return foodNoteAsWorded(note, chain, record);
}

/** The step's notes OUTSIDE its food branch (its timber, healing and extraction branches): every other note it writes claims food. */
const NOT_FOOD_NOTES = new Set([
  'Druidic forest management accelerates regrowth and sustainable yield',
  'Divine healing supplements mundane medicine',
  'Alchemical remedies supplement treatment',
  'Arcane fabrication provides processed goods from alternative sources',
  'Arcane fabrication and stone-shaping partially offset depleted extraction',
]);

/**
 * THE NOTES THAT CLAIM FOOD MADE BY MAGIC (TAIL-DISPLAY-ECON, the chair's ruling X3, 2026-11-14): every note the food
 * branch of `generators/chainMagicSubstitution.js` writes (its FOOD_CHAIN_IDS). The step writes them on a food chain
 * that is impaired or short of its ground, before the food model credits any provision; the food record's own share
 * (`foodMagicShare`) is the one home of whether magic feeds the town, and a card claims no food by magic where it is none.
 */
export const MAGIC_FOOD_NOTES = Object.freeze(new Set(Object.keys(MAGIC_NOTE_TRADITION).filter((note) => !NOT_FOOD_NOTES.has(note))));

/**
 * THE FOOD RECORD'S MAGIC SHARE, ONE READER (X3): `magicReliance.js :: foodMagicShare` (TAIL-DISPLAY-ECON-2, X10: the
 * reliance reading counts the food's provision as a dependent, so the reader moved to the leaf the reading lives in and
 * is re-exported here unchanged; the chain cards' food notes, the Magic tab's dependence line and its chain notes read it).
 */
export { foodMagicShare };


/** The grounds a farmland is (the food record's grain ground, `chainStateShown.js :: FOOD_SOURCE_GROUND.grain`). */
const FARMLAND = new Set(['grain_fields', 'fertile_floodplain']);

/**
 * A food note in the words the record bears (X3): "fills the gap" only where the food record leaves no shortfall, else
 * the provision eases it; "depleted farmland" only on a chain whose ground is farmland, else the depleted ground.
 * @param {string} note @param {unknown} chain @param {unknown} record
 * @returns {string}
 */
function foodNoteAsWorded(note, chain, record) {
  if (note === 'Blessed stores; divine provision fills the gap') {
    const deficit = Number(/** @type {{ economicState?: { foodSecurity?: { deficit?: unknown } | null } | null } | null} */ (record)?.economicState?.foodSecurity?.deficit);
    return deficit > 0 ? 'Blessed stores; divine provision eases the shortfall' : note;
  }
  if (note === 'Druidic cultivation supplements depleted farmland') {
    const ground = /** @type {{ resourceInputKey?: unknown } | null} */ (chain)?.resourceInputKey;
    return FARMLAND.has(String(ground)) ? note : 'Druidic cultivation supplements the depleted ground';
  }
  // TAIL-DISPLAY-ECON-3 (23037): the timber branch's note claims a "sustainable yield" on a ground the record holds
  // depleted (48 of the 49 cards that print it: the woodland cleared and timber bought in, or a marsh cut over); there
  // the druids speed its regrowth, and a marsh is not a forest. An available ground keeps the note.
  if (note === 'Druidic forest management accelerates regrowth and sustainable yield') {
    const ground = String(/** @type {{ resourceInputKey?: unknown } | null} */ (chain)?.resourceInputKey ?? '');
    if (!groundDepleted(record, ground)) return note;
    return WOODLAND.has(ground) ? 'Druidic forest management speeds the regrowth of the cleared woodland' : 'Druidic tending speeds the regrowth of the depleted ground';
  }
  return note;
}

/** The timber grounds (`data/resourceData.js`: the managed, coastal and mountain stands). */
const WOODLAND = new Set(['managed_forest', 'shipbuilding_timber', 'mountain_timber']);

/**
 * Whether the record holds a ground depleted (`resourceAnalysis.resourceConditions`, the Resources tab's own reading).
 * @param {unknown} record @param {string} ground
 * @returns {boolean}
 */
function groundDepleted(record, ground) {
  const rows = /** @type {{ resourceAnalysis?: { resourceConditions?: unknown } | null } | null} */ (record)?.resourceAnalysis?.resourceConditions;
  return (Array.isArray(rows) ? rows : []).some((r) => {
    const row = /** @type {{ key?: unknown, resourceKey?: unknown, condition?: unknown } | null} */ (r);
    return (row?.key ?? row?.resourceKey) === ground && row?.condition === 'depleted';
  });
}

/**
 * THE ECONOMIC ROLE BESIDE THE FOOD RECORD'S PROVISION (TAIL-DISPLAY-ECON-5, the chair's ruling X32, 2026-11-15; vetoable
 * by the owner). The magic profile's economic role (`magicProfile.js :: role`) is drawn from the arcane powers and the
 * practitioners and never reads the food; the reliance reading above it on the Magic tab counts the food record's own
 * provision (`foodMagicShare`, X10). So "Economic role: occasional" printed under "Reliance on magic: Relied upon" in 63
 * of the census's 720 towns whose food record has magic making part of each day's food (a thorp fed a quarter by
 * magic among them). A provision made every day is not occasional: the row prints the ladder's smallest word true of
 * it ("common": regular, not foundational). A band of "common" or above, and every town without such a provision, keep
 * the profile's word. The record is not touched.
 * @param {unknown} record the settlement record
 * @param {unknown} band the magic profile's economic band
 * @returns {unknown} the band the row prints
 */
export function economicRoleBandShown(record, band) {
  return (band === 'absent' || band === 'occasional') && foodMagicShare(record) > 0 ? 'common' : band;
}

// ── WHAT MAGIC DOES HERE, AS THE PAGE SHOWS IT (BAR2-LABELS LB1, the chair's ruling of 2026-11-15; vetoable by the owner) ──
// THE ONE HOME OF THE MAGIC WORDS' FACTS. Every magic word the page prints reads what the record shows magic DOES here:
// the share of the food magic makes (`foodMagicShare`), a house of magic among the defences (`defenceHoldsArcane`, the
// defence's own `institutions.magicDef`), a made magical service (an active chain that needs magic, `chainNeedsMagic`),
// and a chain card's magic note where the card prints it (`magicNoteShown`, above: a note of a tradition the town does
// not hold is not printed, so it is not counted). Measured on the census's 720 at f8042b61a (the hand-back's truth table).

/** @param {unknown} record @returns {Array<Record<string, unknown>>} */
function activeChainsOf(record) {
  const chains = /** @type {{ economicState?: { activeChains?: unknown } | null } | null} */ (record)?.economicState?.activeChains;
  return Array.isArray(chains) ? chains.filter((c) => c && typeof c === 'object') : [];
}

/** A made magical service: an active chain the generator's own gate says needs magic. @param {unknown} record @returns {boolean} */
export function magicServiceMade(record) {
  return activeChainsOf(record).some((c) => chainNeedsMagic(c));
}

/**
 * A house of magic among the defences: the defence's tradition, or a magic house that still stands (BAR2-LABELS-4: the
 * bucket read off the live roster, `standingDefenseForces`, so a ruin fields nothing; ruinFilterRoster's law).
 * @param {unknown} record @returns {boolean}
 */
export function magicAmongDefences(record) {
  return defenceHoldsArcane(record) || standingDefenseForces(/** @type {{ institutions?: unknown } | null} */ (record)).magicDef.present;
}

/** The notes that claim a medical provision, and those that claim built work (every other note claims food or goods). */
const MEDICAL_NOTES = new Set(['Divine healing supplements mundane medicine', 'Alchemical remedies supplement treatment']);
const WORKS_NOTES = new Set(['Arcane fabrication and stone-shaping partially offset depleted extraction']);

/** The chain notes the page prints (`magicNoteShown` non-empty). @param {unknown} record @returns {string[]} the record's notes */
function notesShown(record) {
  return activeChainsOf(record).filter((c) => { const shown = magicNoteShown(c, record); return typeof shown === 'string' && shown !== ''; })
    .map((c) => String(c.magicNote));
}

/**
 * THE DEPENDENTS THE PAGE BEARS OUT: the reliance reading's census (`magicReliance.js :: magicDependents`) read through
 * what the page shows: an active chain that needs magic, a chain whose magic note prints, and the food supply where
 * magic makes part of it. A note the card does not print (a tradition the town does not hold) is not a dependent here.
 * @param {unknown} record the settlement record
 * @returns {string[]} chain ids, then the food supply
 */
export function magicDependentsShown(record) {
  const chains = magicDependentChainsShown(record).map((c) => String(c.chainId ?? 'a supply chain')); // counted, never printed: the chain's id, not its name
  return [...chains, ...(foodMagicShare(record) > 0 ? [FOOD_SUPPLY_DEPENDENT] : [])];
}

/**
 * THE DEPENDENT CHAINS THEMSELVES (BAR3-LABELS-2 L1b, the chair's direction of 2026-11-15; vetoable by the owner): the
 * active chains `magicDependentsShown` counts (one filter, one home), handed whole to a page that NAMES what relies on
 * magic: the page prints each one's name through its leaf (`chainPrintName.js`, the `chainPrintSites` law), never here.
 * @param {unknown} record the settlement record
 * @returns {Array<Record<string, unknown>>} the active chains that need magic or whose magic note prints, in record order
 */
export function magicDependentChainsShown(record) {
  return activeChainsOf(record).filter((c) => {
    if (chainNeedsMagic(c)) return true;
    const shown = magicNoteShown(c, record);
    return typeof shown === 'string' && shown !== '';
  });
}

/** Whether the food supply is among the dependents (`magicDependentsShown`'s own last entry). @param {unknown} record @returns {boolean} */
export function foodAmongMagicDependents(record) {
  return foodMagicShare(record) > 0;
}

/**
 * THE RELIANCE READING THE PAGE PRINTS: the one reading (`magicReliance.js :: deriveMagicReliance`) never above what the
 * page shows magic doing (`magicDependentsShown`), by the reading's own rule: a dependent makes it relied upon, two
 * (or the top band) with a practitioner make it integral; with none, practitioners alone make it present. Never raises.
 * @param {unknown} record the settlement record
 * @param {{ reading: string, practitioners: readonly unknown[] }} reliance the one reading
 * @returns {string} the reading
 */
export function relianceReadingShown(record, reliance) {
  if (reliance.reading !== 'relied-upon' && reliance.reading !== 'integral') return reliance.reading;
  const deps = magicDependentsShown(record).length;
  if (deps === 0) return reliance.practitioners.length > 0 ? 'present' : 'none';
  if (reliance.reading === 'integral' && relianceDepth(record) < 2 && magicOf(/** @type {Parameters<typeof magicOf>[0]} */ (record)).level !== 'high') return 'relied-upon';
  return reliance.reading;
}

/**
 * THE WORD THE PAGE PRINTS, AS ONE FACT (BAR5-MAGIC, LAW 1 rule 1a; the audit's finding: the record's reading and the
 * page's word are two readings of one thing). `relianceReadingShown` over the one reading: the reading the Magic tab
 * and Foundations print ("Reliance on magic: …"). EVERY SENTENCE ABOUT RELIANCE READS THIS, never `deriveMagicReliance`
 * alone: the DS-DEF-9 desk (`defenseStateProse.js :: reliesOnMagic`) and the `magic reliance` atom
 * (`facts/factVocabulary.js`). The stored `defenseProfile.magicDependency` is not touched.
 * @param {unknown} record the settlement record
 * @returns {string} one of `magicReliance.js :: MAGIC_RELIANCE_READINGS`
 */
export function relianceShownOf(record) {
  return relianceReadingShown(record, deriveMagicReliance(/** @type {import('../magicReliance.js').MagicRelianceSource} */ (record)));
}

/**
 * HOW DEEP THE DEPENDENCE GOES (BAR3-LABELS L1, the chair's direction of 2026-11-15; vetoable by the owner): the
 * dependents the page bears out (`magicDependentsShown`), with every made magical service (an active chain that needs
 * magic: spellcasting, enchanting, alchemy) counted ONCE, as the town's one magic trade. "Integral" said a low- or
 * mid-magic town could not run without magic where all that depended on magic was its own magic trade (a Wizard's tower
 * selling spells and enchanted goods, impaired, beside a magic that is low and food made by none: the bar's
 * metropolis-calm-rand-7; 40 of the census's 720 at 59185b62a). Two or more SEPARATE things held up by magic (the trade,
 * the food, a chain whose magic note prints) keep "Integral"; the top band keeps it as before.
 * @param {unknown} record the settlement record
 * @returns {number}
 */
export function relianceDepth(record) {
  const services = new Set(activeChainsOf(record).filter((c) => chainNeedsMagic(c)).map((c) => String(c.chainId ?? '')));
  const deps = magicDependentsShown(record);
  return deps.filter((d) => !services.has(d)).length + (deps.some((d) => services.has(d)) ? 1 : 0);
}

/**
 * THE ROLE BAND A MAGIC ROLE ROW PRINTS (BAR3-LABELS L1, the chair's direction of 2026-11-15; vetoable by the owner). The
 * magic profile's military and medical bands (`magicProfile.js :: deriveRoles`) are raised by the world's dial alone
 * ("occasional" at a medium or high level) or by a healing house of any kind ("common"), and never read the defence or the
 * healing the record holds: "Military role: occasional" printed beside "DEFENCE magic: none" in 354 of the census's 720
 * towns, and "Medical role: common" with no healing that needs magic in 315. Where the record holds nothing of the role
 * (`magicRoleHeld`, the one home of LB1's facts) the row prints the profile's own word for nothing, "absent"; where it
 * holds the role, the band is the profile's. The economic row keeps X32's reader (`economicRoleBandShown`); the
 * infrastructure row is the profile's. The record is not touched.
 * @param {unknown} record the settlement record
 * @param {string} role 'economic' | 'military' | 'medical' | 'infrastructure'
 * @param {unknown} band the magic profile's band
 * @returns {unknown} the band the row prints
 */
export function magicRoleBandShown(record, role, band) {
  // BAR5-MAGIC (LAW 1 rule 1a; vetoable by the owner): "integral" is a dependence; under a reliance word that says nothing
  // depends on magic (None, Present) the row prints the ladder's next word, "common" (r2s-religious_conversion-city-3:
  // "Economic role: integral" and "Infrastructure role: integral" under "Reliance on magic: Present"; 1 town of 1,080).
  const shown = band === 'integral' && !['relied-upon', 'integral'].includes(relianceShownOf(record)) ? 'common' : band;
  if (role === 'economic') return economicRoleBandShown(record, shown);
  if ((role === 'military' || role === 'medical') && shown !== 'absent' && !magicRoleHeld(record, role)) return 'absent';
  return shown;
}

/**
 * WHETHER THE RECORD HOLDS ANYTHING OF A MAGIC ROLE (a role row prints "absent" only where it holds nothing of it):
 *   economic: the economy's own words (`economyShowsMagic`), a made magical service, a chain note the page prints, or
 *     food made by magic; military: a house of magic among the defences; medical: an active healing chain that needs
 *     magic, or a healing note the page prints; infrastructure: a note of arcane stone-shaping the page prints.
 * @param {unknown} record the settlement record
 * @param {string} role 'economic' | 'military' | 'medical' | 'infrastructure'
 * @returns {boolean}
 */
export function magicRoleHeld(record, role) {
  const notes = notesShown(record);
  if (role === 'economic') return economyShowsMagic(record) || magicServiceMade(record) || notes.length > 0 || foodMagicShare(record) > 0;
  if (role === 'military') return magicAmongDefences(record);
  if (role === 'medical') return activeChainsOf(record).some((c) => chainNeedsMagic(c) && /heal/i.test(String(c.chainId ?? '')))
    || notes.some((n) => MEDICAL_NOTES.has(n)) || healingByMagicShown(record);
  if (role === 'infrastructure') return notes.some((n) => WORKS_NOTES.has(n));
  return false;
}

/** A healing row's own words that say it heals by magic. */
const HEALS_BY_MAGIC = /\b(?:magic\w*|divine|spell\w*)\b/i;

/**
 * BAR4-SERVICES S3 (C45429; the chair's direction of 2026-11-16; vetoable by the owner): A HEALING ROW THE SERVICES TAB
 * PRINTS THAT HEALS BY MAGIC IS THE MEDICAL ROLE HELD. "Medical role: absent" printed beside the priest's "Divine healing
 * magic for the sick and injured." in 33 towns of the census's 720 at 8aef8e7d4 (20 of the fresh 300): the role row reads
 * the healing chain and the notes, and not the healing the page itself offers. One settled reading: a row of the record's
 * healing services (`availableServices.healing`, not custom) whose own words name magic, the divine or a spell holds the role.
 * @param {unknown} record
 * @returns {boolean}
 */
function healingByMagicShown(record) {
  const rows = /** @type {{ availableServices?: { healing?: unknown } }} */ (record ?? {}).availableServices?.healing;
  return Array.isArray(rows) && rows.some((r) => r && typeof r === 'object' && r.custom !== true && r.source !== 'custom'
    && HEALS_BY_MAGIC.test(`${typeof r.name === 'string' ? r.name : ''} ${typeof r.desc === 'string' ? r.desc : ''}`));
}

/** The ledger's band words, as the Magic tab's headline prints the record's own level. */
const LEVEL_WORD = Object.freeze({ low: 'Low', medium: 'Medium', high: 'High' });

/**
 * THE MAGIC TAB'S HEADLINE WORD (LB1): the record's own level (`facts/magic.js :: magicOf`, the ledger's band), not the
 * envelope's availability (which the envelope prints one line below, raised a step by an arcane house or lowered by
 * want of coin). A record with no level band (none, or no dial) keeps the availability word.
 * @param {unknown} record the settlement record
 * @param {unknown} availability the envelope's availability band
 * @returns {string}
 */
export function magicHeadlineWord(record, availability) {
  const level = magicOf(/** @type {Parameters<typeof magicOf>[0]} */ (record)).level;
  if (Object.hasOwn(LEVEL_WORD, level)) return LEVEL_WORD[/** @type {'low'|'medium'|'high'} */ (level)];
  const a = String(availability || '');
  return a.charAt(0).toUpperCase() + a.slice(1);
}

/** The acceptance words a faith's own supply of magic qualifies (the scale's hostile end: `magicProfile.js`). */
const ACCEPTANCE_OUTSIDE_OWN_HOUSES = Object.freeze(['hostile', 'wary']);

/**
 * THE RELIGIOUS ACCEPTANCE WORD THE MAGIC TAB PRINTS (BAR3-LABELS-2, the chair's RULING L1c of 2026-11-15 20:25 UTC;
 * vetoable by the owner). "Religious acceptance: hostile" printed beside "supplied by House of worship": the faith's
 * houses supply the town's magic while the faith is hostile to it. BOTH FACTS STAND (the profile's acceptance is not
 * moved): where a house that supplies the magic (`facts/magicSource.js :: magicSourceOf`) is a religious house on the
 * live roster and the word is hostile or wary, the word says what the hostility is toward: magic outside the faith's
 * own houses. Every other word prints as the profile's.
 * @param {unknown} record the settlement record
 * @param {unknown} word the magic profile's religious acceptance
 * @returns {unknown} the word the row prints
 */
export function religiousAcceptanceShown(record, word) {
  if (typeof word !== 'string' || !ACCEPTANCE_OUTSIDE_OWN_HOUSES.includes(word)) return word;
  const supplying = new Set(magicSourceOf(record).houses);
  const religious = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (record))
    .some((inst) => supplying.has(String(/** @type {{ name?: unknown }} */ (inst).name ?? '')) && /** @type {{ category?: unknown }} */ (inst).category === 'Religious');
  return religious ? `${word} outside the faith's own houses` : word;
}
