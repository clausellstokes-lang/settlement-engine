/**
 * Step 14: generateNarratives
 *
 * Generates settlement reason, resource analysis, economic viability,
 * history, and legacy annotations.
 *
 * Narrative step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { generateSettlementReason } from '../narrativeGenerator.js';
import { generateResourceAnalysis, resolveNearbyCommodities } from '../resourceGenerator.js';
import { generateEconomicViability } from '../economicGenerator.js';
import { generateHistory } from '../historyGenerator.js';
import { deriveLegacyAnnotations } from '../legacyGenerator.js';
import { getTerrainType } from '../terrainHelpers.js';
import { getInstFlags } from '../priorityHelpers.js'; import { hasInstitution } from '../../domain/facts/institutions.js';
import { recordTrace } from '../../domain/trace.js';
import { availableNativeResourceKeys } from '../../domain/resourceSemantics.js';
import { fishBoughtIn } from '../../domain/facts/fishBoughtIn.js'; // FAULTS-ROWS (FR12 (3)): the swap's one fact, the atom `fish bought in`'s reader
import { INSTITUTION_SERVICES } from '../../data/institutionServices.js';
import { resolveServiceCatalogKey } from '../services/institutionServices.js';

/**
 * BAR8-FISH-ROWS (ruling BR24, 2026-11-17; auditor J's 11b.fish and 11b.fishTitle): WHERE THE FISH IS BOUGHT IN, a row that
 * speaks of a catch is its pool's own inland alternative (the catalogue's `inlandAlternative`, `data/institutionServices.js`:
 * the Fish market's "Fresh fish retail" is its "Preserved fish", the Fishmonger's "Fresh fish" its "Salted fish"). The story
 * is known only here, after the birth has written its imports (`resourceGenerator.js :: importsBroughtAtBirth`): the town's
 * fish grounds are used up and the stored imports hold the spent ground's own word (`facts/fishBoughtIn.js :: fishBoughtIn`, the
 * one reader the atom `fish bought in` reads too: FAULTS-ROWS, FR12 (3))
 * ("Salted fish (local … exhausted)": the bought story, as every view reads it). An IDLE town (grounds spent, no fish brought
 * in) and a town whose fishers land their own catch keep their rows. The row is replaced IN PLACE (its bucket, its index, its
 * house; the toggle and the roll that kept it are the catch row's): NO DRAW. As the roll's own inland swap does, a later row of
 * the same house already bearing the alternative's name is not printed twice.
 * @param {{ config: object, economicState: object, institutions: unknown[], resourceAnalysis: object }} record the record in the making
 * @param {Record<string, Array<Record<string, unknown>>> | null | undefined} availableServices the rolled services (economyReconcilePass), mutated in place
 */
function boughtFishRowsInPlace(record, availableServices) {
  if (!availableServices || typeof availableServices !== 'object') return;
  if (!fishBoughtIn(record)) return;
  /** @type {Record<string, Record<string, { inlandAlternative?: string, desc?: string }>>} */
  const pools = /** @type {any} */ (INSTITUTION_SERVICES);
  for (const rows of Object.values(availableServices)) {
    if (!Array.isArray(rows)) continue;
    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i];
      if (!row || typeof row !== 'object' || row.custom === true || row.source === 'custom') continue;
      const house = String(row.institution || '');
      const key = house ? resolveServiceCatalogKey(house) : null;
      const pool = key ? pools[key] : null;
      const alt = pool && Object.prototype.hasOwnProperty.call(pool, String(row.name)) ? pool[String(row.name)].inlandAlternative : undefined;
      if (typeof alt !== 'string' || !pool || !Object.prototype.hasOwnProperty.call(pool, alt)) continue;
      rows[i] = { ...row, name: alt, desc: pool[alt].desc };
      for (let j = rows.length - 1; j > i; j -= 1) if (rows[j] && rows[j].name === alt && rows[j].institution === house && rows[j].custom !== true && rows[j].source !== 'custom') rows.splice(j, 1);
    }
  }
}

registerStep('generateNarratives', {
  // economyReconcilePass (not generateEconomy): narratives must read the
  // FINAL economicState, after the faction-pull reconciliation.
  deps: ['generatePopulation', 'economyReconcilePass'],
  reads: ['availableServices', 'economicState', 'effectiveConfig', 'generationContext', 'institutions', 'population', 'powerStructure', 'tier', 'tradeRoute'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  readsVersion: { economicState: 'reconciled' },
  provides: ['settlementReason', 'resourceAnalysis', 'economicViability', 'history'],
  mutates: ['economicState', 'availableServices'], // BIRTH-1/BIRTH-3 (BR3, BR8): the resource analysis's birth writes the words a house's story buys in onto economicState.primaryImports in place (resourceGenerator.js :: importsBroughtAtBirth); BAR8-FISH-ROWS (BR24): where that story buys the fish in, the catch rows of availableServices are their pools' inland alternatives, in place (boughtFishRowsInPlace)
  phase: 'narrative',
}, (ctx) => {
  const {
    tier, population, tradeRoute, effectiveConfig,
    institutions, economicState, powerStructure,
  } = ctx;

  const terrainT = getTerrainType(tradeRoute, effectiveConfig.terrainOverride || null);
  const availableResources = availableNativeResourceKeys(effectiveConfig);

  // Resource analysis reads the settlement's ACTUALLY-rolled resources (not the
  // whole terrain slice), so two settlements on the same terrain with different
  // nearby resources get different analyses. Special resources flow through too.
  const nearbyResources = resolveNearbyCommodities(effectiveConfig, terrainT);
  const specialResources = effectiveConfig.specialResources || [];
  // The reconciled economy rides along so a gap line says which kind it is (REVIEW-INTAKE-3 R9).
  const resourceAnalysis = generateResourceAnalysis(terrainT, nearbyResources, specialResources, institutions, effectiveConfig, economicState, ctx._seed);
  // BAR8-FISH-ROWS (BR24): the imports are written; where they buy in the fish of a spent fishery, the catch rows say so.
  boughtFishRowsInPlace({ config: effectiveConfig, economicState, institutions, resourceAnalysis }, ctx.availableServices);
  // Viability first: settlementReason is deficit-aware — an isolated settlement
  // with a food shortfall must not claim self-sufficiency. Feed it the same
  // condition-filtered roster as resource analysis and the economy: terrain
  // potential is useful context, but it cannot stand in for a resource that this
  // settlement never rolled or has already exhausted.
  const economicViability = generateEconomicViability(
    { tier, population, institutions, economicState, config: { ...effectiveConfig } },
    terrainT, availableResources
  );
  // The origin rung's variant selection is draw-free and keyed on the pipeline seed,
  // exactly as generateHistory's is below — effectiveConfig itself carries no _seed,
  // so it is stamped on here. Without it the rung falls back to canonical-at-zero and
  // every settlement on a route shares one sentence, which is the defect lane RR closed.
  // #10 (W5 HIS 2026-11-07): the port reason reads whether a docks or wharf institution exists.
  // MERGE-WAVE record 10 (the chair's ruling (a), 2026-11-09): the flag lives on the institution-presence record, `.inst`;
  // read at the top level it was undefined on every birth, so the docks were never read.
  const hasDocks = Boolean(getInstFlags(effectiveConfig, institutions).inst.hasPort);
  const estate = { institutions }; // the institutions home's record shape (TAIL-CLOSE-SRC-3: its reader asked by a named record)
  const settlementReason = generateSettlementReason(
    tier, tradeRoute, null, { ...effectiveConfig, _seed: ctx._seed },
    economicViability?.metrics?.foodBalance || null,
    { hasDocks, hasTravellerHouse: hasInstitution(estate, 'tavern') }, // R2-CODE-A-4 (#154): an inn or a tavern serves travellers
  );
  // Stamp the pipeline seed onto the config so generateHistory's prose-variant selection
  // (draw-free) is stable per settlement — effectiveConfig itself carries no _seed.
  const history = generateHistory(
    tier,
    { ...effectiveConfig, _seed: ctx._seed },
    institutions,
    economicViability,
    economicState,
    powerStructure,
    ctx.generationContext,
  );

  // Legacy annotations
  const legacyAnnotations = deriveLegacyAnnotations(history, {
    powerStructure, economicState, tier, institutions,
  });
  if (legacyAnnotations.length > 0) {
    history.legacyAnnotations = legacyAnnotations;
  }

  // Causal traces — record the narrative anchors so the AI grounding
  // layer can quote "the engine decided X because Y" without re-deriving.
  if (settlementReason) {
    recordTrace(ctx, {
      targetType: 'history',
      targetId: 'settlementReason',
      step: 'generateNarratives',
      result: 'authored',
      causes: [{
        source: `tier.${tier} + tradeRoute.${tradeRoute}`,
        reason: `Founding rationale derived from settlement size, trade access, and food balance.`,
      }],
      downstreamEffects: [
        { target: 'history', effect: 'founding context' },
      ],
    });
  }

  if (economicViability) {
    recordTrace(ctx, {
      targetType: 'resource',
      targetId: 'economicViability',
      step: 'generateNarratives',
      result: 'scored',
      causes: [{
        source: `terrain.${terrainT}`,
        effect: `${availableResources.length} available native resources`,
        reason: 'Viability blends tier scaling, the settlement resource condition, institution mix, and economic state.',
      }],
      downstreamEffects: [
        { target: 'history',      effect: 'economic backstory' },
        { target: 'defenseProfile', effect: 'wealth-to-defend signal' },
      ],
    });
  }

  if (history && Array.isArray(history.events) && history.events.length) {
    recordTrace(ctx, {
      targetType: 'history',
      targetId: 'history.events',
      step: 'generateNarratives',
      result: 'composed',
      causes: [{
        source: `tier.${tier}`,
        effect: `${history.events.length} events`,
        reason: `History length scales with tier; legacy annotations link past to present.`,
      }],
      downstreamEffects: [
        ...(legacyAnnotations.length > 0
          ? [{ target: 'history.legacyAnnotations', effect: `${legacyAnnotations.length} present-day links` }]
          : []),
      ],
    });
  }

  return { settlementReason, resourceAnalysis, economicViability, history };
});
