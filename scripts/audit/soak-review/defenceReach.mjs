/**
 * scripts/audit/soak-review/defenceReach.mjs — the defence-words check reads CLAIMS, not words
 * (F1 DEFENCE-WORDS unit 4, soak 1000 rung 1B, 2026-11-04; docs/F1_DEFENCE_WORDS_2026-11-04.md §2
 * bucket a).
 *
 * `coh:defense-words` (`src/domain/coherence/defenseWordsFindings.js`) flags a sentence that names
 * a garrison, soldiers, walls or a hospital the place's record lacks. Some of those words claim no
 * defence and no house: one soldier is a person; a walled plot is the plot's wall; a quarry that
 * "builds the walls and churches of half the region" names its trade; a church that "may keep a
 * hospital" hedges; a bowyer that supplies "garrison and militia" names its customers. This module
 * licenses those READINGS, by rule and never by seed: a finding is reach only when EVERY use of
 * its term in the sentence is one of them, so a sentence that also makes a real claim stays red.
 *
 * Pure: no randomness, no clock.
 */

/** Building nouns a `walled` qualifies: the building's own wall, not the place's. */
const WALLED_BUILDING = /^(?:\s+|-)?(?:plots?|compounds?|enclosures?|waystations?|gardens?|yards?|courtyards?|holdings|cloisters?|closes?)\b/i;
/**
 * A building whose own walls a sentence may name without claiming the place's (F11 unit 2, the
 * chair's ruling of 2026-11-04: a building's own walls are NOT a fortification). "the lower walls
 * of the oldest houses", "the walls of the great temple", "the hall's walls".
 */
const BUILDING = String.raw`(?:houses?|homes?|halls?|keeps?|temples?|churche?s?|chapels?|shrines?|cathedrals?|monaster(?:y|ies)|abbe(?:y|ys)|priory|inns?|taverns?|warehouses?|granar(?:y|ies)|barns?|mills?|manors?|palaces?|workshops?|forges?|smith(?:y|ies)|cellars?|rooms?|chambers?|buildings?|compounds?|cloisters?|caravanserais?|yards?|courtyards?)`;
/** `walls of the <building>`: the building's own walls. */
const WALLS_OF_BUILDING = new RegExp(String.raw`^\s+of\s+(?:the|a|an|its|their|this|that)\s+(?:[\w'-]+\s+){0,3}?${BUILDING}\b`, 'i');
/** `the <building>'s walls`: the building's own walls. */
const BUILDING_POSSESSIVE_BEFORE = new RegExp(String.raw`\b${BUILDING}'s\s+(?:own\s+)?(?:[\w-]+\s+)?$`, 'i');
/**
 * `its walls` / `their walls`: an ENCLOSURE only where the sentence is the building's own
 * description (an institution's `desc` in the record), so "its" is the building. Measured
 * 2026-11-04: more than twenty generation and pool lines say "its walls" of the SETTLEMENT
 * ("armed men on its walls", "outside its walls", "cannot grow its staples within its walls"),
 * so a possessive alone is not read as an enclosure.
 */
const POSSESSIVE_BEFORE = /\b(?:its|their)\s+(?:own\s+)?(?:[\w-]+\s+)?$/i;

/** One soldier, or soldiers past or out of service: people, not a standing force. */
const SOLDIER_PERSON_BEFORE = /\b(?:a|an|one|any|each|every|retired|old|former|discharged|veteran|wounded|failed|ex-)\s*$/i;
/** Soldiers named as a trade's customers ("for soldiers and servants", "serving merchants, soldiers, and travellers"). */
const CUSTOMER_BEFORE = /\b(?:for|serving|outfits|supplies|supply(?:ing)?\s+(?:\w+\s+){0,4}to)\s+(?:[\w'-]+,\s+)*$/i;
/** A garrison named as a hired company's or a supplier's work, not as the place's force. */
const GARRISON_TRADE_AFTER = /^\s+(?:duty|work|contracts?)\b/i;
/** A hedged or exemplary hospital: "may keep a hospital", "found an institution (a hospital, a school)". */
const HOSPITAL_HEDGE_BEFORE = /\b(?:may|might|sometimes|occasionally|found|founding)\b[^.;:!?]{0,30}$|\(\s*a\s*$/i;

/**
 * @typedef {object} ReachContext
 * @property {boolean} [ownDescription] the sentence is (part of) a roster institution's own description
 */
/**
 * @typedef {object} ReachRule
 * @property {RegExp} re the term's uses in a sentence (global)
 * @property {(before: string, word: string, after: string, sentence: string, context: ReachContext) => boolean} reach true when this use claims nothing
 */

/** @type {Readonly<Record<string, ReachRule>>} */
const RULES = Object.freeze({
  soldiers: {
    re: /\bsoldiers?\b/gi,
    reach: (before, word, after) => (
      /^Soldier$/.test(word)                     // a role title: "Veteran Soldier", "Wounded Soldier"
      || /^soldier$/i.test(word) && !/\bthe\s*$/i.test(before) // one soldier is a person
      || SOLDIER_PERSON_BEFORE.test(before)
      || CUSTOMER_BEFORE.test(before)
      || /^\s+(?:and|or)\s+(?:servants|travellers|travelers|sellswords|mercenaries)\b/i.test(after) && /\b(?:for|retired|old)\s*$/i.test(before)
    ),
  },
  walls: {
    re: /\b(?:walls|walled)\b/gi,
    reach: (before, word, after, sentence, context) => (
      /^walled$/i.test(word) && WALLED_BUILDING.test(after)
      || /^walls$/i.test(word) && WALLS_OF_BUILDING.test(after)                       // F11: the walls of a building
      || /^walls$/i.test(word) && BUILDING_POSSESSIVE_BEFORE.test(before)             // F11: a building's walls
      || /^walls$/i.test(word) && context.ownDescription === true && POSSESSIVE_BEFORE.test(before) // F11: a building's own description, "within its walls"
      || /^walls$/i.test(word) && /^\s+and churches\b/i.test(after)                  // the masons' or quarry's trade
      || /^walls$/i.test(word) && /\bduring construction\b/i.test(sentence) && /\binside the\s*$/i.test(before) // a building's walls
      || /^walled$/i.test(word) && /^\s+apart\b/i.test(after)                         // two quarters walled off from each other
    ),
  },
  garrison: {
    re: /\bgarrison(?:s|ed)?\b(?! Commander)/gi,
    reach: (before, word, after) => (
      GARRISON_TRADE_AFTER.test(after)
      || /\bto\s*$/i.test(before) && /^\s+and militia\b/i.test(after) && /\bsupply\b/i.test(before)
    ),
  },
  hospital: {
    re: /\bhospitals?\b/gi,
    reach: (before) => HOSPITAL_HEDGE_BEFORE.test(before),
  },
});

/**
 * Is this defence-words finding instrument reach: does every use of its term in the sentence
 * read as a person, a building's wall, a trade or a hedge rather than a claim on the place?
 *
 * @param {string} term the check's term (`soldiers`, `walls`, `garrison`, `hospital`, …)
 * @param {string} sentence the flagged sentence
 * @param {ReachContext} [context] what the record says about where the sentence came from
 * @returns {boolean} true when the finding claims nothing the record could deny
 */
export function isDefenceReach(term, sentence, context = {}) {
  const rule = Object.hasOwn(RULES, term) ? RULES[term] : null;
  if (!rule) return false;
  const text = String(sentence ?? '');
  rule.re.lastIndex = 0;
  /** @type {RegExpExecArray | null} */
  let m;
  let uses = 0;
  while ((m = rule.re.exec(text))) {
    uses += 1;
    const before = text.slice(0, m.index);
    const after = text.slice(m.index + m[0].length);
    if (!rule.reach(before, m[0], after, text, context)) return false;
  }
  return uses > 0;
}

/**
 * Is `sentence` (part of) the description of an institution on the record's roster?
 * @param {string} sentence @param {any} settlement @returns {boolean}
 */
export function isOwnDescription(sentence, settlement) {
  // The Foundry journal prints a house as "- **Name**: desc", escaped for markdown
  // (foundry-module/scripts/markdownEscape.js): its label and escaping are undone first.
  const text = String(sentence ?? '')
    .replace(/^[-*\s]*\*\*[^*]+\*\*:?\s*/, '')
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&')
    .replace(/\\([\\`*_[\]()#+~|])/g, '$1')
    .trim();
  if (!text) return false;
  const institutions = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  return institutions.some((/** @type {any} */ inst) => typeof inst?.desc === 'string' && inst.desc.includes(text));
}

/**
 * The soak's reading of one battery finding: false for a `defense-words` finding that is reach.
 * @param {{ check?: string, quote?: string, detail?: string }} finding a coherence-battery finding
 * @param {any} [settlement] the record the finding was read on (for a building's own description)
 * @returns {boolean} true when the finding is a defence claim the record denies (or another check)
 */
export function isDefenceClaim(finding, settlement) {
  if (finding?.check !== 'defense-words') return true;
  const term = String(finding.detail ?? '').split(' without ')[0];
  const quote = String(finding.quote ?? '');
  return !isDefenceReach(term, quote, { ownDescription: isOwnDescription(quote, settlement) });
}
