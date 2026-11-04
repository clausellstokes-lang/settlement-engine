/**
 * domain/magicReliance.js — HOW MUCH DOES THIS PLACE RELY ON MAGIC? The one reading.
 *
 * Lane MAGIC (chair ruling 2, 2026-11-03; docs/GENERATION_ROOT_CAUSES_2026-11-02.md,
 * appendix 3, causes 3 and 4). The dossier answered this question three ways: the Magic
 * tab's role lines from the slider alone (a dial at 66 read "integral" in a thorp with no
 * practitioner), its reliance sentence from a flag the defence generator sets only during
 * a siege, famine or plague, and the Overview's badge from that same flag. Five private
 * word lists decided who practises, and none of them read the NPC list, so a Hedge Witch
 * was never counted.
 *
 * THE READING IS DERIVED ONCE, HERE, FROM TWO CENSUSES:
 *   • PRACTITIONERS — live institutions the CATALOGUE says practise
 *     (`isArcaneInstitution`: the declared magic licence first, then the authored tag;
 *     R-BLD-5's one detector, never a name list of this module's own), and NPCs whose
 *     role or title asserts functional magic in the estate's shared vocabulary
 *     (`textAssertsFunctionalMagic`, the leaf the generation world law reads).
 *   • DEPENDENTS — active supply chains that need magic (`chainNeedsMagic`, the very
 *     predicate the chain generator gates on) or that magic is holding up (a chain
 *     carrying a `magicNote`, which only the magic-substitution step writes).
 *
 * ONE OF FOUR WORDS: none · present · relied-upon · integral.
 *   - none         nobody practises and nothing depends on magic (and always where magic
 *                  does not function at all: `magicWorksAt`).
 *   - present      someone practises; nothing depends on them.
 *   - relied-upon  something depends on magic.
 *   - integral     a practitioner AND a dependent, and the dependence is deep: two or more
 *                  dependents, or the world's top magic band. The slider alone never says
 *                  integral, and the siege/famine/plague flag never enters at all.
 *
 * Pure; tolerant of partial records; never throws.
 */
import { isArcaneInstitution } from './arcaneInstitutionIdentity.js';
import { textAssertsFunctionalMagic } from './magicAssertionText.js';
import { liveInstitutions } from './institutions/institutionRoster.js';
import { nativeSemanticName } from './content/customContentSemanticAuthority.js';
import { magicLedger } from './magicLedger.js';
import { magicWorksAt } from './worldPulse/magicWorksAt.js';

// The world's one "does magic work here" answer, re-exported beside the reading it gates so the
// dossier view model reads both from one leaf.
export { magicWorksAt };

/** The four readings, weakest first. */
export const MAGIC_RELIANCE_READINGS = Object.freeze(['none', 'present', 'relied-upon', 'integral']);

/**
 * The one wording of each reading. Every surface that prints the reading prints this word,
 * so no two tabs can say it differently.
 * @type {Readonly<Record<string, string>>}
 */
export const MAGIC_RELIANCE_WORD = Object.freeze({
  none: 'None',
  present: 'Present',
  'relied-upon': 'Relied upon',
  integral: 'Integral',
});

/**
 * The chain ids the supply-chain generator treats as arcane. Lifted VERBATIM from
 * `generators/computeActiveChains.js`'s no-magic gate, which now reads `chainNeedsMagic`
 * below, so the generator's gate and this census are one predicate.
 */
const ARCANE_CHAIN_IDS = Object.freeze(['alchemy', 'spellcasting', 'magical_goods', 'planar']);

/**
 * Does this supply chain NEED magic to run? The generator's own gate (a chain the
 * generator suppresses where the magic dial reads zero), moved here unchanged.
 * @param {{ id?: unknown, chainId?: unknown, label?: unknown } | null | undefined} chain
 * @returns {boolean}
 */
export function chainNeedsMagic(chain) {
  const id = String(chain?.id ?? chain?.chainId ?? '');
  const label = String(chain?.label ?? '').toLowerCase();
  return ARCANE_CHAIN_IDS.includes(id)
    || label.includes('arcane')
    || label.includes('magic')
    || label.includes('spell');
}

/**
 * @typedef {Object} MagicRelianceSource
 * @property {unknown} [institutions]
 * @property {unknown} [npcs]
 * @property {{ activeChains?: unknown } | null} [economicState]
 * @property {{ magicLevel?: string, priorityMagic?: number, magicExists?: boolean } | null} [config]
 */

/**
 * @typedef {Object} MagicReliance
 * @property {'none'|'present'|'relied-upon'|'integral'} reading
 * @property {string} word            the one wording (`MAGIC_RELIANCE_WORD`)
 * @property {boolean} magicWorksHere the world's one answer (`magicWorksAt`); named apart from
 *   DS-DEF-5's `magicWorks` reading so the prose census never mistakes one for the other
 * @property {string[]} practitioners names: institutions first, then people
 * @property {string[]} dependents    chain labels
 */

/** @param {unknown} value @returns {Record<string, unknown>} */
function asRecord(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function str(value) {
  return value == null ? '' : String(value).trim();
}

/**
 * The live institutions the catalogue says practise magic.
 * @param {MagicRelianceSource | null | undefined} settlement
 * @returns {Record<string, unknown>[]}
 */
export function practisingInstitutions(settlement) {
  // A DM's custom institution keeps its display name presentation-only: the census reads
  // the native semantic name (empty for custom content) and the record's own authored tags.
  return liveInstitutions(settlement)
    .filter((inst) => isArcaneInstitution({ ...inst, name: nativeSemanticName(inst) }, asRecord(inst).category));
}

/**
 * Is this person a magic practitioner? Their role or title asserts functional magic.
 * @param {unknown} npc
 * @returns {boolean}
 */
export function isPractisingNpc(npc) {
  const person = asRecord(npc);
  // Only a person still at work counts. Read as "not active" rather than as a list of the away
  // statuses, so the test is total over the NpcStatus union by construction.
  const status = str(person.status).toLowerCase();
  if (status && status !== 'active') return false;
  return textAssertsFunctionalMagic(`${str(person.role)} ${str(person.title)}`);
}

/**
 * The practitioner census: institutions by catalogue identity, people by role.
 * @param {MagicRelianceSource | null | undefined} settlement
 * @returns {string[]}
 */
export function magicPractitioners(settlement) {
  const houses = practisingInstitutions(settlement)
    .map((inst) => str(inst.name) || 'an arcane institution');
  const people = (Array.isArray(settlement?.npcs) ? settlement.npcs : [])
    .filter(isPractisingNpc)
    .map((npc) => str(asRecord(npc).name) || str(asRecord(npc).role) || 'a practitioner');
  return [...houses, ...people];
}

/**
 * The dependent census: active chains that need magic or that magic holds up.
 * @param {MagicRelianceSource | null | undefined} settlement
 * @returns {string[]}
 */
export function magicDependents(settlement) {
  const chains = settlement?.economicState?.activeChains;
  return (Array.isArray(chains) ? chains : [])
    .filter((c) => chainNeedsMagic(c) || str(asRecord(c).magicNote) !== '')
    .map((c) => str(asRecord(c).label) || str(asRecord(c).chainId) || 'a supply chain');
}

/**
 * MAGIC IS ABSENT HERE BY THE PLACE'S OWN DIAL (MG-3d; lifted to this leaf by lane RUNG1B-F9
 * unit 2, 2026-11-04, so the Magic tab's envelope and the DS-DEF-9 reliance desk ask one
 * predicate): the world has magic, the settlement carries a magic axis that reads zero, and no
 * live house practises. `magicProfile.js :: deriveMagicProfile` prints "Availability absent"
 * on exactly this answer. A zero dial with an arcane house standing is an authored premise and
 * reads false (MG-LAW-4). A dead-magic world is `magicWorksAt`'s answer, not this one.
 * @param {MagicRelianceSource | null | undefined} settlement
 * @returns {boolean}
 */
export function magicDialAbsent(settlement) {
  if (!settlement || settlement.config?.magicExists === false) return false;
  const ledger = magicLedger(settlement);
  return ledger.present && ledger.magicLevel === 'none' && practisingInstitutions(settlement).length === 0;
}

/**
 * THE ONE READING.
 * @param {MagicRelianceSource | null | undefined} settlement
 * @returns {MagicReliance}
 */
export function deriveMagicReliance(settlement) {
  const magicWorksHere = magicWorksAt({ settlement });
  if (!settlement || !magicWorksHere) {
    return { reading: 'none', word: MAGIC_RELIANCE_WORD.none, magicWorksHere, practitioners: [], dependents: [] };
  }
  const practitioners = magicPractitioners(settlement);
  const dependents = magicDependents(settlement);
  const topBand = magicLedger(settlement).magicLevel === 'high';
  /** @type {MagicReliance['reading']} */
  let reading = 'none';
  if (dependents.length > 0) {
    reading = practitioners.length > 0 && (dependents.length >= 2 || topBand) ? 'integral' : 'relied-upon';
  } else if (practitioners.length > 0) {
    reading = 'present';
  }
  return { reading, word: MAGIC_RELIANCE_WORD[reading], magicWorksHere, practitioners, dependents };
}
