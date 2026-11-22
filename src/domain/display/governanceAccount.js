/**
 * display/governanceAccount.js — WHO RUNS THE PLACE, IN ONE PARAGRAPH (OWNER-WORDS-DOSSIER item 3).
 *
 * The owner, 2026-11-09, on the Power tab's governance block: "The governance description itself seemed
 * disconnected and not to our standard wouldn't you agree?" It read as three pieces of machinery — a
 * legitimacy reading ("the space its authority does not occupy", "the gap widens"), a hall line, and a
 * pool vignette that said "two factions" without a name — while the seat and the powers were named an
 * inch above and unused. The chair's ruling: ONE paragraph, under the style law (evidence before
 * judgment; the event, the people, the consequence; no machinery; words that hold in any size of place):
 *
 *   1. THE SEAT, by name and title, from the record (`rulingChainOf`: the ladder's first rung, else the
 *      generation-time seat-holder; a vacancy or an unrecorded seat said plainly).
 *   2. THE STANDING: the legitimacy band as a word, with the one or two causes its breakdown names.
 *   3. THE POWERS THAT HAVE BROKEN WITH IT, NAMED from the record's relationships with the ruler — a
 *      `corrupted` pair (bought, or captured), a `competitive` one (no longer answers to it), a `tense`
 *      one (at odds with it). Never a count without a name; the word "faction" is not used.
 *   4. THE CONSEQUENCE, in plain words, from the gravest of those ties.
 *   5. THE VIGNETTE (`powerStructure.recentConflict`): under a stress other than politically_fractured it
 *      closes the paragraph as its event sentence; the fractured and the unstressed lines print only as
 *      the fallback, where the record names no estranged power.
 *
 * No contradicted-decision sentence is written: the record holds no named decision, and inventing one is
 * the thing this composer exists to refuse. Pure, zero-draw, total: the same record reads the same words
 * on the screen and in print. Every sentence is a template over record names; the connective copy is the
 * owner's to veto (docs/chair/2026-11-09/OWNER-WORDS-DOSSIER-2026-11-09.md).
 */
import { rulingChainOf } from '../dossier/powerStrata.js';
import { powerNameWithArticle, powerSentenceName } from './powerSentenceName.js';
import { seatKeeperOf } from '../people/seatKeeper.js';
import { drawDeclared, resolveDeclared } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { textOf } from '../facts/textOf.js';
import { meritsOf, weatheredCatastrophe } from '../fortune/fortuneMerits.js';
import { FORTUNE_LAW_TUNING } from '../fortune/fortuneLaw.js';
import { pickVariantMixed } from '../../kernel/proseHash.js';
import { FORTUNE_MERIT_LINES, FORTUNE_MERIT_RECENT_YEARS, FORTUNE_MERIT_TIME_WORDS } from '../../data/fortuneMeritLines.js';
import { FORTUNE_LASTING_CENTURIES_YEARS, FORTUNE_LASTING_LINES, FORTUNE_LASTING_TIME_WORDS } from '../../data/fortuneLastingLines.js';

/** THE SEAT UNDER AN OCCUPATION (TAIL-POWERS-2, P4): the twins of the seat sentences, by draw (0-2), and of the headless
 *  (3) and unnamed (4) seat; each declared on the vocabulary's crisis atom, so it prints only where the record is occupied. */
const OCCUPIED_SEAT = Object.freeze([
  { text: '{Ruler} answers to the occupiers of {place}. {who} holds its seat.', crisis: ['occupied'] },
  { text: '{who} holds the seat of {ruler}. {Ruler} answers to the occupiers of {place}.', crisis: ['occupied'] },
  { text: '{Ruler} answers to the occupiers of {place}. Its seat is held by {whoEnd}.', crisis: ['occupied'] },
  { text: '{Ruler} answers to the occupiers of {place}. It has no head.', crisis: ['occupied'] },
  { text: '{Ruler} answers to the occupiers of {place}. No one is named to its seat.', crisis: ['occupied'] },
]);

/** @param {unknown} v @returns {string} */
const text = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * A power's name as a sentence carries it: a trailing parenthetical qualifier ("Merchant Guilds
 * (dominant)") is the roster's annotation, not the name, and a catalogue label takes its prose form
 * (`powerSentenceName.js`); a name that opens on "The" keeps it, lowered mid-sentence; every other name takes "the".
 * @param {string} name @param {boolean} [start] @returns {string}
 */
export function powerNameInProse(name, start = false) {
  // TAIL-DISPLAY-CIVIC-3 V1 (the chair's ruling of 2026-11-15): the name is the one leaf's prose form, its own "The"
  // struck for the article this sentence sets ("Military/Guard" -> "the Guard", never "the Military/Guard"). NAMES-1
  // (the seventh chair's ruling CN1 of 2026-11-20): the body is the data leaf's, so every composer, the data layer's
  // included, reads one article form (data/people/powerSentenceName.js :: powerNameWithArticle)
  return powerNameWithArticle(text(name), start);
}

/** @param {string[]} items @returns {string} */
function listOf(items) {
  if (items.length <= 1) return items[0] || '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** @param {string} s @returns {string} */
const capFirst = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
/** A list that opens on "The …" carried mid-sentence. @param {string} s @returns {string} */
const lowerFirst = (s) => s.replace(/^The /, 'the ');

/** The breakdown's four causes, adverse and favourable, in words that hold in any size of place. */
const CAUSE_WORDS = Object.freeze({
  prosperity: Object.freeze({ adverse: 'poverty', favourable: 'prosperity' }),
  safety: Object.freeze({ adverse: 'crime', favourable: 'safety' }),
  defense: Object.freeze({ adverse: 'weak defences', favourable: 'strong defences' }),
  food: Object.freeze({ adverse: 'hunger', favourable: 'full stores' }),
});
const CAUSE_ORDER = Object.freeze(['prosperity', 'safety', 'defense', 'food']);
/** BAR7-LINES (the LOW "Weak defences is the reason", 42 towns of the census's 720): the cause words that are plural nouns. */
const PLURAL_CAUSE_WORDS = new Set(['weak defences', 'strong defences', 'full stores']);

/** The bands that read their ADVERSE causes; the other two read their favourable ones. */
const ADVERSE_BANDS = new Set(['Legitimacy Crisis', 'Contested', 'Tolerated']);

/**
 * ⭐ THE SAFETY CAUSE IS NAMED BY WHAT LOWERED IT (TAIL-DISPLAY-CIVIC, READ-ALL B05826 B05840 06098 06102 B05843 06101
 * 06043): the breakdown's safety part is `factionDynamics.js :: safetyContrib` over the record's safety label, and a crisis
 * writes that label with its cause after a dash ("Dangerous — Monster Threat", "Tense — Mass Migration", "Suspicious —
 * Aftermath of Betrayal"). There "crime" named a cause the town's own label does not hold ("Crime is the reason" in a
 * migration town with no criminal power, 427 of the census's 720 towns at f663a2699), so the adverse word is "insecurity",
 * which every such label bears, and "the curfew" under an occupation's curfew alone (a "Controlled" label docks order
 * without consent, not danger; a curfew joined by another crisis, "+ Famine Conditions", reads "insecurity").
 * A plain label ("Unsafe", "Dangerous") is the crime ratio's own band, and keeps "crime".
 * @param {unknown} safetyLabel the record's `economicState.safetyProfile.safetyLabel` @returns {string}
 */
function adverseSafetyWord(safetyLabel) {
  const label = text(safetyLabel);
  if (!/\s—\s/.test(label)) return CAUSE_WORDS.safety.adverse;
  return /curfew/i.test(label) && !label.includes('+') ? 'the curfew' : 'insecurity';
}

/**
 * The one or two causes the breakdown names for the band's direction, largest first; ties break in
 * the fixed order above, so an unrelated edit cannot reorder them.
 * @param {unknown} breakdown @param {boolean} adverse
 * @param {unknown} [safetyLabel] the record's safety label (a crisis-named label reads "insecurity" or "the curfew", not "crime")
 * @returns {string[]}
 */
export function legitimacyCausesOf(breakdown, adverse, safetyLabel = null) {
  const b = breakdown && typeof breakdown === 'object' ? /** @type {Record<string, unknown>} */ (breakdown) : {};
  return CAUSE_ORDER
    .map((field, order) => ({ field, order, value: typeof b[field] === 'number' && Number.isFinite(b[field]) ? /** @type {number} */ (b[field]) : 0 }))
    .filter(({ value }) => (adverse ? value < 0 : value > 0))
    .sort((a, z) => Math.abs(z.value) - Math.abs(a.value) || a.order - z.order)
    .slice(0, 2)
    .map(({ field }) => (field === 'safety' && adverse ? adverseSafetyWord(safetyLabel)
      : CAUSE_WORDS[/** @type {keyof typeof CAUSE_WORDS} */ (field)][adverse ? 'adverse' : 'favourable']));
}

// TAIL-TIES-7 (ruling T25 (b)): `pluralPowerName` moved verbatim to the pure leaf `./pluralPowerName.js` (so
// `dossier/faithReading.js` reaches no `factsOf` through this file); re-exported here for every caller of this path.
import { pluralPowerName } from './pluralPowerName.js';
export { pluralPowerName };

/** @param {string} named the name as prose carries it @returns {string} */
const possessive = (named) => (/s$/i.test(named) ? `${named}'` : `${named}'s`);

/**
 * THE ARRANGEMENT (the chair's condition (e), 2026-11-09): a slotted sentence whose frame would repeat
 * near-verbatim across towns takes one of two or three ARRANGEMENTS of the same facts, chosen by the
 * town's own seed (FNV-1a of `<seed>::<slot>`): same words of fact, a different order, never ornament.
 * Pure and zero-draw: the same town reads the same arrangement on every surface, forever.
 * @param {string} seed @param {string} slot @param {number} n @returns {number}
 */
export function arrangementOf(seed, slot, n) {
  let h = 0x811c9dc5;
  const key = `${seed}::${slot}`;
  for (let i = 0; i < key.length; i += 1) { h ^= key.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return n > 1 ? h % n : 0;
}

/**
 * The standing sentence: the causes first (the evidence), then the band (the judgment), in one of two
 * arrangements.
 * @param {string} label the producer's band word @param {string[]} causes @param {string} place
 * @param {string} ruler the ruling power as prose carries it, lower-case article
 * @param {(slot: string, n: number) => number} pick
 * @returns {string}
 */
function standingSentence(label, causes, place, ruler, pick) {
  // the verb agrees with what it names: one cause whose word is singular ("Hunger has …"), never "Weak defences is …"
  const one = causes.length === 1 && !PLURAL_CAUSE_WORDS.has(causes[0]);
  const by = capFirst(listOf(causes));
  const a = pick(`standing:${label}:${causes.length ? 'causes' : 'bare'}`, causes.length ? 2 : 1);
  switch (label) {
    case 'Legitimacy Crisis':
      if (!causes.length) return `Few in ${place} still accept ${possessive(ruler)} right to rule.`;
      return a === 0
        ? `${by} ${one ? 'has' : 'have'} cost ${ruler} its standing. Few in ${place} still accept its right to rule.`
        : `Few in ${place} still accept ${possessive(ruler)} right to rule. ${by} ${one ? 'has' : 'have'} cost it its standing.`;
    case 'Contested':
      if (!causes.length) return `${capFirst(possessive(ruler))} right to rule is contested in ${place}.`;
      return a === 0
        ? `${by} ${one ? 'has' : 'have'} left ${possessive(ruler)} right to rule contested in ${place}.`
        : `In ${place}, ${possessive(ruler)} right to rule is contested. ${by} ${one ? 'is' : 'are'} the reason.`;
    case 'Tolerated':
      if (!causes.length) return `${place} tolerates ${ruler}, and no more.`;
      return a === 0
        ? `${by} ${one ? 'keeps' : 'keep'} ${place} from more than tolerating ${ruler}.`
        : `${place} tolerates ${ruler} and no more. ${by} ${one ? 'is' : 'are'} the reason.`;
    case 'Approved':
      if (!causes.length) return `${place} approves of ${ruler}.`;
      return a === 0
        ? `${by} ${one ? 'has' : 'have'} earned ${ruler} the approval of ${place}.`
        : `${capFirst(ruler)} has the approval of ${place}. ${by} earned it.`;
    case 'Endorsed':
      if (!causes.length) return `${place} stands behind ${ruler}.`;
      return a === 0
        ? `${by} ${one ? 'has' : 'have'} won ${ruler} the backing of ${place}.`
        : `${place} stands behind ${ruler}. ${by} won it over.`;
    default:
      return '';
  }
}

/** The ruler's ties the composer reads as estrangement, gravest first. */
const ESTRANGED_ORDER = Object.freeze(['capture', 'corrupted', 'competitive', 'tense']);

/**
 * The powers that have broken with the ruler, NAMED from the record: each relationship whose pair holds
 * the governing power and whose type is `corrupted` (split by its capture state), `competitive` or
 * `tense`. One entry per power, its gravest tie kept.
 * @param {unknown} settlement @param {string} governing
 * @returns {Array<{ name: string, tie: 'capture' | 'corrupted' | 'competitive' | 'tense' }>}
 */
export function estrangedPowersOf(settlement, governing) {
  const ps = /** @type {{ factionRelationships?: unknown }} */ ((settlement && typeof settlement === 'object' && /** @type {{ powerStructure?: unknown }} */ (settlement).powerStructure) || {});
  const rels = Array.isArray(ps.factionRelationships) ? ps.factionRelationships : [];
  /** @type {Map<string, 'capture' | 'corrupted' | 'competitive' | 'tense'>} */
  const byName = new Map();
  for (const rel of rels) {
    if (!rel || typeof rel !== 'object') continue;
    const pair = Array.isArray(rel.pair) ? rel.pair.map(text) : [];
    if (!governing || !pair.includes(governing)) continue;
    const other = pair.find((/** @type {string} */ n) => n && n !== governing);
    if (!other) continue;
    // R3-CODE-C-9 (the bar's n15, bar0-metropolis-calm-rand-1, Shankou): the criminal row at the adversarial capture
    // rung (factionDynamics.js :: govCriminalRelation, "... is hunting {criminals} in earnest") is the hall pursuing a
    // rival it is beating (the same tab: "{criminals} works against {ruler}, and {ruler} is winning",
    // dmPowerLines.js); it has not broken with the hall, so the account names it neither as refusing the hall's orders
    // nor as a cost to them ("It can no longer make its orders hold alone"). 30 of the reader's 1,722 accounts.
    if (rel.type === 'competitive' && rel.captureState === 'adversarial') continue;
    // TAIL-DISPLAY-CIVIC (READ-ALL 19954, 18 of the census's 720 towns at f663a2699): the criminal row at the truce rung
    // (`captureState: 'equilibrium'`) is the hall leaving the underworld alone, and its own narrative says so ("Guild Council
    // leaves Thieves' Guild alone because stamping it out would cost more than it saves", factionDynamics.js), as does the
    // tab's DM line ("... leave each other alone", dmPowerLines.js). It is not named as at odds with the hall.
    if (rel.type === 'tense' && rel.captureState === 'equilibrium') continue;
    const tie = rel.type === 'corrupted' ? (rel.captureState === 'capture' ? 'capture' : 'corrupted')
      : rel.type === 'competitive' ? 'competitive'
        : rel.type === 'tense' ? 'tense' : null;
    if (!tie) continue;
    const held = byName.get(other);
    if (!held || ESTRANGED_ORDER.indexOf(tie) < ESTRANGED_ORDER.indexOf(held)) byName.set(other, tie);
  }
  return [...byName].map(([name, tie]) => ({ name, tie }))
    .sort((a, z) => ESTRANGED_ORDER.indexOf(a.tie) - ESTRANGED_ORDER.indexOf(z.tie));
}

/**
 * THE BLOCS A FRACTURE ADDS (the chair's condition (c), 2026-11-09): a politically_fractured town's
 * stress adds two powers to the roster (generators/power/stressFactions.js :: applyStressEventFactions)
 * that hold no relationship row with the ruler, so the estrangement read cannot see them, and the
 * fractured vignette said "two … have stopped coming to meetings" without a name. The record keeps each
 * bloc's own description, which says what it is; each reading here is that description in plain words.
 * Pinned against the generator's own writer (tests/domain/governanceAccount.test.js), so a reworded
 * description reds there rather than silently dropping a name.
 * @type {ReadonlyArray<{ desc: RegExp, withdrawn: boolean, line: (names: string, plural: boolean) => string }>}
 */
const FRACTURE_BLOCS = Object.freeze([
  Object.freeze({ desc: /^Claims legitimate authority through different means/, withdrawn: true,
    line: (/** @type {string} */ n, /** @type {boolean} */ pl) => `${n} ${pl ? 'claim' : 'claims'} the right to rule by other means, and no longer ${pl ? 'come' : 'comes'} to the hall's meetings.` }),
  Object.freeze({ desc: /^Noble houses that want a renegotiation of feudal obligations/, withdrawn: true,
    line: (/** @type {string} */ n, /** @type {boolean} */ pl) => `${n} ${pl ? 'want' : 'wants'} the old obligations renegotiated, and no longer ${pl ? 'cooperate' : 'cooperates'}.` }),
  Object.freeze({ desc: /^Noble houses backing the current crown line/, withdrawn: false,
    line: (/** @type {string} */ n, /** @type {boolean} */ pl) => `${n} ${pl ? 'back' : 'backs'} the crown for as long as its favours last.` }),
  Object.freeze({ desc: /^Would support stability, if a price can be agreed/, withdrawn: false,
    line: (/** @type {string} */ n, /** @type {boolean} */ pl) => `${n} will back whichever side meets ${pl ? 'their' : 'its'} price.` }),
]);

/**
 * The fields of the record the paragraph reads (the rest reach the readers it calls as the record itself).
 * @typedef {{ id?: unknown, name?: unknown, _seed?: unknown, stress?: unknown, powerStructure?: { factions?: Array<{ isGoverning?: unknown, desc?: unknown, faction?: unknown } | null>, publicLegitimacy?: { label?: unknown, breakdown?: unknown } | null, recentConflict?: unknown }, economicState?: { safetyProfile?: { safetyLabel?: unknown } | null } | null }} GovernedRecord
 */

/**
 * The fracture's blocs the record names, each reading once, in the order above.
 * @param {GovernedRecord} s @param {Set<string>} already names the estrangement read has said
 * @returns {{ lines: string[], withdrawn: boolean, names: string[] }}
 */
function fractureBlocsOf(s, already) {
  const factions = Array.isArray(s.powerStructure?.factions) ? s.powerStructure.factions : [];
  const lines = [];
  const names = [];
  let withdrawn = false;
  for (const reading of FRACTURE_BLOCS) {
    const of = factions.filter((f) => f && !f.isGoverning && reading.desc.test(text(f.desc)) && !already.has(text(f.faction)))
      .map((f) => text(/** @type {{ faction?: unknown }} */ (f).faction)).filter(Boolean);
    if (!of.length) continue;
    names.push(...of);
    lines.push(reading.line(capFirst(listOf(of.map((n) => powerNameInProse(n)))), of.length > 1 || pluralPowerName(powerSentenceName(of[0]))));
    if (reading.withdrawn) withdrawn = true;
  }
  return { lines, withdrawn, names };
}

/**
 * The record's active stress types, in the record's order — what the caller ranks for `opts.primaryStress`.
 * @param {unknown} settlement @returns {string[]}
 */
export function governanceStressTypesOf(settlement) {
  const s = settlement && typeof settlement === 'object' ? /** @type {GovernedRecord} */ (settlement) : null;
  if (!s) return [];
  return (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [])
    .map((x) => text(x && typeof x === 'object' ? x.type : x)).filter(Boolean);
}

/**
 * THE PARAGRAPH, or null where the record names no governing power.
 *
 * The primary stress is the CALLER's reading (the generalStateProse idiom: domain code takes it in rather than
 * importing the generators' ranking — the domain → generators boundary stays at its frozen five). The two surfaces
 * pass `resolvePrimaryStress(governanceStressTypesOf(settlement))` (generators/stressPriority.js); with none passed,
 * the record's first stress stands in.
 * @param {unknown} settlement
 * @param {{ primaryStress?: string | null }} [opts]
 * @returns {{ text: string, estranged: Array<{ name: string, tie: string }>, fallback: boolean } | null}
 */
export function governanceAccountOf(settlement, opts = {}) {
  const s = settlement && typeof settlement === 'object' ? /** @type {GovernedRecord} */ (settlement) : null;
  if (!s) return null;
  const chain = rulingChainOf(/** @type {import('../dossier/powerStrata.js').RulingChainSettlement} */ (/** @type {unknown} */ (s)));
  const governing = text(chain.power?.name);
  if (!governing) return null;
  const place = text(s.name) || 'this place';
  const ruler = powerNameInProse(governing);
  const sentences = [];
  const seed = String(s._seed ?? s.id ?? s.name ?? '');
  /** @param {string} slot @param {number} n */
  const pick = (slot, n) => arrangementOf(seed, slot, n);

  // THE CONNECTIVE COPY IS STRUCK (the owner, 2026-11-09 03:5x, "No." to the joining phrases proposed by
  // OWNER-WORDS-DOSSIER item 3; SW-9): the seat, the band and its causes, the estranged powers and the
  // consequence stand as plain sentences in sequence under the block law. No clause joins two of them
  // (", and …", ", which governs …", ", now that …", ", earned by …", ", won over by …", "Until it is
  // filled, …"); nothing else of the paragraph changed.
  // 1. THE SEAT. TAIL-POWERS-2 (the chair's ruling P4 of 2026-11-14): under an occupation the seat does not govern; it
  // answers to the occupiers (the occupier's own card: "all significant decisions require approval or reversal",
  // stressFactions.js). Each draw keeps its slot; its twin is declared on the crisis atom and drawn through the door.
  const facts = () => factsOf(s);
  /** @param {number} i @param {Record<string, string>} slots @returns {string | null} the slot's twin, where the record is occupied */
  const underOccupation = (i, slots) => {
    const { line } = resolveDeclared(OCCUPIED_SEAT[i], { facts, poolId: `governanceAccount:OCCUPIED_SEAT.${i}`, surface: 'power', drawKind: 'T' });
    return line ? textOf(line).replace(/\{(\w+)\}/g, (_m, k) => slots[k] ?? '') : null;
  };
  const slots = { Ruler: capFirst(ruler), ruler, place };
  if (chain.npc && text(chain.npc.name)) {
    const role = text(chain.npc.role);
    const who = role ? `${text(chain.npc.name)}, ${role},` : text(chain.npc.name);
    const whoEnd = role ? `${text(chain.npc.name)}, ${role}` : text(chain.npc.name);
    const i = pick('seat', 3);
    sentences.push(underOccupation(i, { ...slots, who, whoEnd }) ?? [
      `${place} is governed by ${ruler}. ${who} holds its seat.`,
      `${who} holds the seat of ${ruler}. ${capFirst(ruler)} governs ${place}.`,
      `${capFirst(ruler)} governs ${place}. Its seat is held by ${whoEnd}.`,
    ][i]);
  } else if (chain.absence?.kind === 'missing_seat') {
    // THE VACANCY IS THE FIRST FACT (the chair's condition (b), 2026-11-09): 65 of the 1,000. Then what
    // fills the gap, from the record: the claimants it names, else the power governing without a head.
    sentences.push(`No one holds the seat at ${place}.`);
    // TAIL-DISPLAY-CIVIC-3 V1: a claimant power's catalogue label takes the leaf's prose form ("Noble Claimant (Senior
    // Line)" -> "The Senior Line"), its "The" lowered after the first; a claimant's own name is left as it is
    const claimants = (Array.isArray(chain.absence.claimants) ? chain.absence.claimants.map(text).filter(Boolean) : [])
      .map((n, i) => { const said = powerSentenceName(n); return i > 0 ? said.replace(/^The /, 'the ') : said; });
    // R3-CODE-C-3 (ROUND-3-CUT-INCREMENT #pf-260, rpf-city-succession_void+politically_fractured-13): "governs without
    // a head" beside the same tab's "Acting Governor Iulia Laenas keeps the seat meanwhile". The keeper has one home
    // (people/seatKeeper.js :: seatKeeperOf); where one keeps the seat the power is not headless, and the tab's seat row
    // already names the keeper, so the sentence is left out rather than said twice.
    if (claimants.length) sentences.push(`${listOf(claimants)} ${claimants.length === 1 ? 'contends' : 'contend'} for it.`);
    else if (!seatKeeperOf(s)) sentences.push(underOccupation(3, slots) ?? `${capFirst(ruler)} governs without a head.`);
  } else {
    sentences.push(underOccupation(4, slots) ?? `${place} is governed by ${ruler}. No one is named to its seat.`);
  }

  // 2. THE STANDING.
  const leg = s.powerStructure?.publicLegitimacy;
  const label = leg && typeof leg === 'object' ? text(leg.label) : '';
  if (label) {
    const safetyLabel = s.economicState?.safetyProfile?.safetyLabel;
    const causes = legitimacyCausesOf(/** @type {{ breakdown?: unknown }} */ (leg).breakdown, ADVERSE_BANDS.has(label), safetyLabel);
    const standing = standingSentence(label, causes, place, ruler, pick);
    if (standing) sentences.push(standing);
    // THE MERIT'S REASON (FORTUNE U5b; the seventh chair's ruling of 22:26 UTC 2026-11-20, vetoable by the owner): where
    // the fortune law's merit credits the record (`fortuneMerits.js :: meritsOf`, the predicate the birth used), the
    // event `weatheredCatastrophe` returns is named directly after the standing, opening on its stored name. The time
    // words band its `yearsAgo` (the pool's own `FORTUNE_MERIT_RECENT_YEARS`, then the law's `weatheredWithinYears`), never a figure.
    // The wording is the kernel's mixed keyed pick through the one door, keyed on the place's name and the event's (what
    // every shared read serves, so the owner's page and a shared one say the same line); no roll.
    const meritRecord = /** @type {import('../fortune/fortuneMerits.js').MeritRecord} */ (/** @type {unknown} */ (s));
    const merits = standing ? meritsOf(meritRecord) : [];
    const weathered = merits.includes('weathered') ? weatheredCatastrophe(meritRecord) : null;
    const event = weathered ? text(weathered.name) : '';
    const yearsAgo = weathered && typeof weathered.yearsAgo === 'number' ? weathered.yearsAgo : null;
    const band = yearsAgo === null ? null
      : yearsAgo <= FORTUNE_MERIT_RECENT_YEARS ? FORTUNE_MERIT_TIME_WORDS.recent
        : yearsAgo <= FORTUNE_LAW_TUNING.standing.weatheredWithinYears ? FORTUNE_MERIT_TIME_WORDS.generation : null;
    let meritPrinted = false;
    if (event && band) {
      const identity = `${place}::${event}::${yearsAgo}`;
      const { line } = drawDeclared(FORTUNE_MERIT_LINES, {
        draw: (pool) => pickVariantMixed(pool, identity),
        key: `${identity}::fortuneMerit`,
        facts,
        poolId: 'fortuneMeritLines:FORTUNE_MERIT_LINES',
        surface: 'power',
        drawKind: 'H',
      });
      /** @type {Record<string, string>} */
      const meritSlots = { event, place, seat: ruler, ...band };
      if (line) { sentences.push(textOf(line).replace(/\{(\w+)\}/g, (_m, k) => meritSlots[k] ?? '')); meritPrinted = true; }
    }
    // THE LASTING REASON (FORTUNE U7b; the chair's words E57 and E57 amended, 2026-11-22, vetoable by the owner): where
    // `meritsOf` credits 'lasting', the place's age is named after the standing and after the first merit's sentence. The
    // time words band `history.age` by the pool's own `FORTUNE_LASTING_CENTURIES_YEARS`, never a figure. Where LASTING
    // credits alone, the wording is the kernel's mixed keyed pick among the drawn rows through the one door, keyed on the
    // place's name and age (both served on every shared read); where both merits credit, the one fixed row, with no draw.
    // The chair's ruling of 12:28 UTC 2026-11-22 (U7d): the fixed row prints only where the first merit's sentence PRINTED
    // in this paragraph; where both credit but it did not (an event whose stored name is empty), the drawn rows, as alone.
    // E57 amended (2): a drawn row opens on "It" where the standing is a bare line that opens on the place.
    const age = meritRecord.history?.age;
    if (merits.includes('lasting') && typeof age === 'number') {
      const both = meritPrinted;
      const identity = `${place}::${age}`;
      const lasting = both ? FORTUNE_LASTING_LINES.find((l) => l.when === 'both') : drawDeclared(FORTUNE_LASTING_LINES, {
        draw: (pool) => pickVariantMixed(pool.filter((l) => l.when === 'alone'), identity),
        key: `${identity}::fortuneLasting`,
        facts,
        poolId: 'fortuneLastingLines:FORTUNE_LASTING_LINES',
        surface: 'power',
        drawKind: 'H',
      }).line;
      const wording = lasting ? textOf(lasting) : '';
      const onIt = !both && !causes.length && standing.startsWith(`${place} `);
      /** @type {Record<string, string>} */
      const lastingSlots = { place, seat: ruler, ...(age < FORTUNE_LASTING_CENTURIES_YEARS ? FORTUNE_LASTING_TIME_WORDS.generations : FORTUNE_LASTING_TIME_WORDS.centuries) };
      if (wording) sentences.push((onIt ? wording.replace(/^\{place\}/, 'It') : wording).replace(/\{(\w+)\}/g, (_m, k) => lastingSlots[k] ?? ''));
    }
  }

  // 3 + 4. THE POWERS THAT HAVE BROKEN WITH IT, AND WHAT THAT COSTS THE HALL.
  const estranged = estrangedPowersOf(s, governing);
  // TAIL-DISPLAY-CIVIC-3 V1: each name's number is read off the form the sentence prints ("Third Bloc (Neutrals)" -> "The
  // Neutrals": "their"), here and in the fracture's blocs
  // TAIL-POWERS-2 (P4): the occupier never took the hall's orders, so it is not among those who "take its orders no
  // longer"; a rival occupier is at odds with the hall (the tense line), its tie and the consequence below unchanged.
  /** @param {{ name: string, tie: string }} e */
  const lineOf = (e) => (e.tie === 'competitive' && e.name === 'Occupation Authority' ? 'tense' : e.tie);
  /** @param {string} tie @returns {{ names: string, plural: boolean } | null} */
  const named = (tie) => {
    const of = estranged.filter((e) => lineOf(e) === tie);
    if (!of.length) return null;
    return { names: capFirst(listOf(of.map((e) => powerNameInProse(e.name)))), plural: of.length > 1 || pluralPowerName(powerSentenceName(of[0].name)) };
  };
  const capture = named('capture');
  const corrupted = named('corrupted');
  const competitive = named('competitive');
  const tense = named('tense');
  if (capture) sentences.push([
    `${capture.names} ${capture.plural ? 'decide' : 'decides'} what the hall decides.`,
    `What the hall decides, ${lowerFirst(capture.names)} ${capture.plural ? 'decide' : 'decides'}.`,
  ][pick('capture', 2)]);
  if (corrupted) sentences.push([
    `${corrupted.names} ${corrupted.plural ? 'have' : 'has'} bought people inside the hall.`,
    `People inside the hall have been bought by ${lowerFirst(corrupted.names)}.`,
  ][pick('corrupted', 2)]);
  if (competitive) sentences.push([
    `${competitive.names} no longer ${competitive.plural ? 'take' : 'takes'} its orders.`,
    `${competitive.names} ${competitive.plural ? 'take' : 'takes'} its orders no longer.`,
  ][pick('competitive', 2)]);
  if (tense) sentences.push([
    `${tense.names} ${tense.plural ? 'are' : 'is'} at odds with it.`,
    `The hall is at odds with ${lowerFirst(tense.names)}.`,
  ][pick('tense', 2)]);
  const gravest = estranged[0]?.tie;
  /** @type {Record<string, string[]>} */
  const CONSEQUENCE = {
    capture: [
      'The hall keeps its title and its meetings, but not its decisions.',
      'Its decisions are no longer the hall\'s, though it keeps its title and its meetings.',
    ],
    corrupted: [
      'The hall still sits, but its arrests and its offices are no longer its own to give.',
      'Its arrests and its offices are no longer the hall\'s own to give, though it still sits.',
    ],
    competitive: [
      'The hall still gives its orders, but it can no longer make them hold alone.',
      'It can no longer make its orders hold alone, though the hall still gives them.',
      'Alone, the hall can no longer make its orders hold, though it still gives them.',
    ],
    tense: [
      'Nothing large is settled in the hall without bargaining with them first.',
      'The hall settles nothing large without bargaining with them first.',
      'Without bargaining with them first, the hall settles nothing large.',
    ],
  };
  // BAR3-POWERS (C31100, the chair's P3): under an occupation the occupier does not bargain and the hall carries out what it
  // decides (the seat's twin above): the tense consequence takes its twin, the occupier's approval where the occupier is the
  // gravest, else the bargaining bounded by what the occupiers leave the hall. The slot keeps its draw.
  const occupiedHall = gravest === 'tense' && governanceStressTypesOf(s).includes('occupied');
  if (gravest) sentences.push(occupiedHall
    ? (estranged[0]?.name === 'Occupation Authority' || !tense
      ? 'Nothing large is settled in the hall until the occupiers have approved it.'
      : `Even what the occupiers leave to the hall is not settled without bargaining with ${lowerFirst(tense.names)} first.`)
    : CONSEQUENCE[gravest][pick(`consequence:${gravest}`, CONSEQUENCE[gravest].length)]);

  // 4b. A FRACTURE'S BLOCS, NAMED (condition (c)): where the town is politically fractured and the
  // record holds the blocs the stress added, they are named, and the fractured line's own consequence
  // follows them; the unnamed fractured line is then not printed.
  const stressTypes = governanceStressTypesOf(s);
  const blocs = stressTypes.includes('politically_fractured')
    ? fractureBlocsOf(s, new Set(estranged.map((e) => e.name)))
    : { lines: [], withdrawn: false, names: [] };
  sentences.push(...blocs.lines);
  if (blocs.withdrawn) sentences.push([
    'Each side makes its own decisions now, and the others overturn them within days.',
    'Each side now makes its own decisions, and within days the others overturn them.',
  ][pick('fracture', 2)]);

  // 5. THE VIGNETTE. The generator's vignette is its primary stress's (stressPriority.js's order, the
  // generator's own). Under a stress OTHER than politically_fractured it is the EVENT sentence the style
  // law asks for, and it closes the paragraph whatever else is named (the chair's ruling on the seat's
  // STOP, 2026-11-09: 470 of the 1,000 lost theirs under the first reading). The fractured line
  // ("two … have stopped coming to meetings") and the unstressed baseline line are the ones the names
  // replace: they print only as the fallback, where no estranged power is named.
  const vignette = text(s.powerStructure?.recentConflict);
  const primary = typeof opts?.primaryStress === 'string' ? opts.primaryStress : (stressTypes[0] ?? null);
  const eventVignette = !!primary && primary !== 'politically_fractured';
  const fallback = estranged.length === 0 && blocs.names.length === 0 && !!vignette;
  if (vignette && (eventVignette || fallback)) sentences.push(vignette);

  return { text: sentences.join(' '), estranged, fallback };
}
