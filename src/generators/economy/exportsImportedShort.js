/**
 * economy/exportsImportedShort.js — the export list's shortage rule, carried beside `economicState.js ::
 * generateEconomicState`, whose final trade lists it settles in place. Moved VERBATIM out of economicState.js
 * (BAR3-CLOSE-SWEEP-B, 2026-11-16, letter f: the module ceiling is cured by a split, never raised); its one caller
 * imports it from here. Behaviour byte-identical (the golden master's drifting rows the same set before and after).
 */
import { resourceShortageImport } from '../../domain/resourceSemantics.js';

/**
 * A GOOD THE TRADE RECORD BRINGS IN AS A SHORTAGE IS NOT ALSO LISTED AS EXPORTED (BAR3-DEFECON-2, the chair's word of
 * 2026-11-15 21:27 UTC, vetoable by the owner; the wide read's header flag on bar0-city-wartime-rand-12: "Dates and fruit"
 * exported by the oasis chain while "Dates and desert produce (local orchards unproductive)" is imported). A depleted
 * ground's shortage import (`resourceSemantics.js :: resourceShortageImport`) names its good before the parenthesis; an
 * export that names the same good (its lead words, whole: "Dates" takes "Dates and fruit", never "Salted fish" for "Salt"
 * nor "Arcane services" for "Arcane reagents") leaves the export list. The chain's output stays on the chain's own card
 * (`activeChains[].outputs` is untouched). Measured on the census's 720 at 7a4b48a84: 2 towns (r2r-city-39,
 * r2s-famine-city-1). In place; no draw.
 * @param {string[]} primaryExports @param {string[]} primaryImports @param {string[]} depletedResources
 */
export function dropExportsImportedShort(primaryExports, primaryImports, depletedResources) {
  const leads = (depletedResources || []).map((r) => resourceShortageImport(r)).filter((label) => typeof label === 'string' && primaryImports.includes(label))
    .map((label) => label.split(' (')[0].split(' and ')[0].trim().toLowerCase()).filter(Boolean);
  if (!leads.length) return;
  const kept = primaryExports.filter((exp) => {
    const e = String(exp).toLowerCase();
    return !leads.some((lead) => e === lead || e.startsWith(`${lead} `) || e.startsWith(`${lead},`));
  });
  if (kept.length !== primaryExports.length) primaryExports.splice(0, primaryExports.length, ...kept); // TAKES_AWAY: it adds no good
}
