/**
 * power/governanceLabelRoster.js — what the governance labels read off a ROSTER (BIRTH-1 D3, the tenth chair's PRERELEASE-LIST
 * D3, intake 2): the house flags, the stress flags, the native houses' names, the noble house. A leaf, so the power step and
 * the assembly's late replay read one roster the same way (`rulingStructure.js :: generatePowerStructure`; F31's line ceiling
 * is met by a split, never a raise).
 *
 * WHY: the power step writes `powerStructure.recentConflict` over the roster it holds, and the coherence repair adds houses
 * after it (a militia, a palisade, a street gang). The late replay re-runs the writer and kept only the stability, so the
 * stored sentence could be the branch of a roster the place no longer has (V dp-hamlet-2: "The last harvest failed badly…"
 * beside the militia the repair added, where the writer over the settled roster says "Food is short…"). The replay now hands
 * the SETTLED roster for the sentence alone (`projection.sentenceInstitutions`). The writer draws nothing, so no draw moves.
 */
import { getInstFlags, getStressFlags } from '../helpers.js';
import {
  isMaterializedCustomContent,
  nativeSemanticName,
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';
import { defenseFactsOf } from '../../domain/defense/defenseFacts.js';
import { noGrazingQuarrelOf } from '../../data/powerSiblings.js';

/** The words a native house's name carries where it is a noble one. */
const NOBLE_HOUSE_WORDS = Object.freeze(['lord', 'noble', 'manor', 'royal seat', 'feudal']);

/** Does a native roster hold a noble house (a lord's, a manor, a royal seat, a feudal one)? @param {Array<any>} native */
export const hasNobleHouseIn = (native) => native.some((inst) => {
  const nameLower = nativeSemanticName(inst).toLowerCase();
  return NOBLE_HOUSE_WORDS.some((word) => nameLower.includes(word));
});

/**
 * The roster's own inputs to `buildGovernanceLabels`, exactly as the power step derives them from the roster it holds.
 * @param {Record<string, any>} config @param {Array<any>} institutions @param {Record<string, any> | null | undefined} economicState
 */
export function governanceLabelRosterOf(config, institutions, economicState) {
  const native = (institutions || []).filter((institution) => !isMaterializedCustomContent(institution));
  const instNames = nativeSemanticNames(native).map((name) => name.toLowerCase());
  return {
    stressFlags: getStressFlags(config, institutions),
    instFlags: {
      ...getInstFlags(config, institutions),
      garrisonStands: defenseFactsOf({ institutions: native }).hasGarrison,
      noGrazingQuarrel: noGrazingQuarrelOf({ institutionNames: instNames, pastoral: economicState?.foodSecurity?.chains?.['Pastoral & livestock'] === true, grounds: config?.nearbyResources }),
    },
    instNames,
    hasNobleInstitution: hasNobleHouseIn(native),
  };
}
