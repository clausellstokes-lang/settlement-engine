/**
 * compendium/institutionFacts.js — what the Institutions page prints under each institution
 * (COMPENDIUM-INSTITUTIONS H7).
 *
 * THE OWNER'S WORD (2026-11-10, verbatim): "Abd the institution page should show ALL
 * institutions with their native power backing and services and flows into other
 * institutions. The search bar simply ends up as a filter."
 *
 * Every line is READ from the engine's own registries (the compendium's registry-render law);
 * nothing here is authored. Where a registry holds nothing for an institution the field is
 * null and the card prints no line for it — never a guess:
 *   size      institutionalCatalog.js — the one tier the catalogue places the name at
 *   priority  the catalogue row's priority slider (the page's lead names the band it shifts)
 *   backing   institutionBacking.js :: backingRowFor — archetype shares, largest first
 *   services  institutionServices.js :: INSTITUTION_SERVICES — the service names, exact name
 *   flowsInto supplyChainData.js :: SUPPLY_CHAIN_NEEDS and resourceChains.js :: RESOURCE_CHAINS —
 *             the OUTPUTS of every chain that lists the institution among its processing
 *             institutions, de-duplicated (case-insensitive), in registry order.
 * Flows into OTHER INSTITUTIONS is not printed: the chains list their processing institutions
 * as an unordered set, so no registry says which house feeds which (the census STOP of
 * 2026-11-10, sent to the chair with this default).
 */
import { INSTITUTION_FAMILIES, INSTITUTION_TIERS } from '../../data/institutionalCatalog.js';
import { backingRowFor } from '../../data/institutionBacking.js';
import { INSTITUTION_SERVICES } from '../../data/institutionServices.js';
import { SUPPLY_CHAIN_NEEDS } from '../../data/supplyChainData.js';
import { RESOURCE_CHAINS } from '../../data/resourceChains.js';

/** lower-cased name -> the tier the catalogue places it at (first placement wins). */
const TIER_BY_NAME = new Map();
for (const fam of INSTITUTION_FAMILIES) {
  for (const tier of INSTITUTION_TIERS) {
    const at = fam.at?.[tier];
    if (!at) continue;
    const n = String(at.name || fam.shared?.name || '').toLowerCase();
    if (n && !TIER_BY_NAME.has(n)) TIER_BY_NAME.set(n, tier);
  }
}

/** lower-cased service-table key -> its key. */
const SERVICE_KEY = new Map(Object.keys(INSTITUTION_SERVICES).map((k) => [k.toLowerCase(), k]));

/** lower-cased name -> the outputs of every chain that processes through it. */
const OUTPUTS_BY_NAME = new Map();
/** @param {string} name @param {ReadonlyArray<string> | undefined} outs */
function addOutputs(name, outs) {
  const k = String(name || '').toLowerCase();
  if (!k) return;
  if (!OUTPUTS_BY_NAME.has(k)) OUTPUTS_BY_NAME.set(k, []);
  const list = OUTPUTS_BY_NAME.get(k);
  for (const o of outs || []) {
    const s = String(o || '').trim();
    if (s && !list.some((x) => x.toLowerCase() === s.toLowerCase())) list.push(s);
  }
}
for (const need of Object.values(SUPPLY_CHAIN_NEEDS)) {
  for (const chain of need.chains || []) {
    for (const n of chain.processingInstitutions || []) addOutputs(n, chain.outputs);
  }
}
for (const chain of Object.values(RESOURCE_CHAINS)) {
  for (const n of chain.processingInstitutions || []) addOutputs(n, chain.finalProducts);
}

/**
 * @typedef {Object} InstitutionFacts
 * @property {string|null} size                       a tier id (thorp … metropolis)
 * @property {Array<{ archetype: string, share: number }>|null} backing  largest share first
 * @property {string[]|null} services                 service names, registry order
 * @property {string[]|null} flowsInto                chain outputs (goods), registry order
 * @property {string|null} priority                   the catalogue row's priority slider
 */

/**
 * @param {{ name: string, priorityCategory?: string }} inst  a catalogue row (InstitutionsTab's read)
 * @returns {InstitutionFacts}
 */
export function institutionFacts(inst) {
  const name = String(inst?.name || '');
  const key = name.toLowerCase();
  const row = backingRowFor(name);
  const backing = row
    ? Object.entries(row.shares || {})
      .map(([archetype, share]) => ({ archetype, share: Number(share) }))
      .sort((a, b) => b.share - a.share || (a.archetype < b.archetype ? -1 : 1))
    : null;
  const svcKey = SERVICE_KEY.get(key);
  const services = svcKey ? Object.keys(INSTITUTION_SERVICES[svcKey] || {}) : null;
  const outs = OUTPUTS_BY_NAME.get(key);
  return {
    size: TIER_BY_NAME.get(key) || null,
    backing: backing && backing.length ? backing : null,
    services: services && services.length ? services : null,
    flowsInto: outs && outs.length ? [...outs] : null,
    priority: inst?.priorityCategory ? String(inst.priorityCategory) : null,
  };
}
