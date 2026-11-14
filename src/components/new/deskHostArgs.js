/**
 * components/new/deskHostArgs.js — THE DESK HOSTS' ARGUMENTS, EXTRACTED (STYLE-RULINGS-2 B10(a);
 * lane SW-B7b PROJECTION).
 *
 * A host tab computes some of the arguments it hands its desk (the live trade-flow drift, the
 * one impaired house, …). The public prose projection's composer (`publicProseCompose.js`)
 * must hand the desk THE SAME arguments on the owner's record at save time, or the public page
 * would print a sentence the owner's player view never drew. So each such computation lives
 * HERE, as a pure helper the tab and the composer both call: one derivation, never a second.
 *
 * Plain module, no React and no store: the composer is reached from the save path, and a tab
 * import from there would close a cycle through the store.
 */
import { flowDerivedDependency } from '../../domain/display/tradeFlowEconomics.js';
import { deriveFoodBalance, deriveGranaryOutlook } from '../../domain/display/dossierViewModel.js';
import { compareCodepoint } from '../../domain/deterministicSort.js';
import { deriveCriminalStructure } from '../../domain/display/defenseDisplay.js';

/**
 * M6d FLOW-DERIVED ECONOMICS: the owning campaign's live arrivals tally projected through the
 * marker-gated selector, or null (no save id, no campaign, flow absent). The composer holds no
 * campaign list at the save boundary, so it passes none and the drift is absent there.
 * @param {{settlement: any, economicState: any, campaigns?: ReadonlyArray<any>|null, saveId?: unknown}} args
 * @returns {any}
 */
export function flowDriftOf({ settlement, economicState, campaigns = null, saveId = null }) {
  const sid = saveId != null ? String(saveId) : (settlement?.id != null ? String(settlement.id) : null);
  if (!sid || !Array.isArray(campaigns)) return null;
  const campaign = campaigns.find((c) => (c?.settlementIds || []).map(String).includes(sid));
  if (!campaign) return null;
  return flowDerivedDependency({ worldState: campaign.worldState, economicState, settlementId: sid, tier: settlement?.tier });
}

/**
 * The economics tab's three desk arguments: the food balance, the granary outlook, the flow drift.
 * @param {any} settlement @param {{economicState?: any, campaigns?: ReadonlyArray<any>|null, saveId?: unknown, flowDrift?: any}} [opts]
 *   `flowDrift`, when the host has already memoised it, is taken as given.
 */
export function economicsDeskArgs(settlement, opts = {}) {
  const economicState = opts.economicState ?? settlement?.economicState;
  return {
    foodBalance: deriveFoodBalance(settlement),
    granaryOutlook: deriveGranaryOutlook(settlement),
    flowDrift: opts.flowDrift !== undefined ? opts.flowDrift
      : flowDriftOf({ settlement, economicState, campaigns: opts.campaigns ?? null, saveId: opts.saveId ?? null }),
  };
}

/**
 * THE ONE IMPAIRED HOUSE THE DESK MAY NAME (DS-SUP-3's second lens), out of the services tab's
 * own impairment set (`computeChainSets(settlement).impaired`): the first institution, by
 * CODEPOINT (never localeCompare — THE PROMISE is cross-device stability), of a rendered
 * category's service whose house is impaired. A house in the set already makes its category's
 * impaired count non-zero, so no per-category count is needed to find it.
 * @param {Record<string, ReadonlyArray<any>>|null|undefined} services the tab's `availableServices`
 * @param {{has: (name: string) => boolean}} impaired
 * @returns {string|null}
 */
export function impairedInstitutionOf(services, impaired) {
  return Object.keys(services || {})
    .filter((cat) => services?.[cat]?.length)
    .flatMap((cat) => (services?.[cat] || []).map((svc) => (typeof svc === 'object' ? svc?.institution || '' : '')))
    .filter((inst) => inst && impaired.has(inst))
    .sort(compareCodepoint)[0] || null;
}

/**
 * The Overview's own normalized stress list (one banner per entry; a single entry or none read
 * as a list). The general desk keys DS-GEN-5's suppression on it, so the composer must hand the
 * desk the same list the arrival scene above it keys on.
 * @param {any} settlement @returns {any[]}
 */
export function overviewStressesOf(settlement) {
  return (Array.isArray(settlement?.stress) ? settlement.stress : settlement?.stress ? [settlement.stress] : []).filter(Boolean);
}

/**
 * The Defense tab's criminal structure reading (the card's classification), or null where the
 * gallery veil covers the block. The defense desk's criminal lens is handed `.key` of this, so
 * the sentence and the card beneath it read one classification on every page.
 * @param {any} settlement @param {boolean} [crimeVeiled] @returns {any}
 */
export function criminalStructureOf(settlement, crimeVeiled = false) {
  return crimeVeiled ? null : deriveCriminalStructure(settlement);
}
