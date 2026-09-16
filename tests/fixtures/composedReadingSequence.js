/**
 * composedReadingSequence.js — THE COMPOSED DOSSIER READING, through the SHIPPED desks, with
 * EVERY reading the shipped caller passes.
 *
 * ── WHY THIS EXISTS, AND WHAT IT REPLACES ──────────────────────────────────────────
 * MOVE-GRAMMAR §4.1 item 4 says the consecutive-pair statistics are taken over a simulated
 * READING and never over a pool dump. The first cut of that sequence executed 29 lines, all
 * 29 from `powerStateProse`, over 7 blocks of 68 — and the V1 share and run rate it produced
 * were carried into SITTING K.2 as the reconstruction wave's whole case. They are POWER-DESK
 * figures. Two defects made them so, and both are closed here:
 *
 *   1. **THE `politics` READING WAS OMITTED.** `PowerTab.jsx:208` passes
 *      `politics: settlementBlocs({...})`, and omitting it is NOT "no politics": with no
 *      projection, `politicsPresencePoolKey(null, …)` returns the literal pool key
 *      `'layer DORMANT (no ledger materialized)'`, so DS-POW-7 draws the ABSENCE pool on
 *      every seed — the same line, every town, presented as variety.
 *   2. **THE GENERAL DESK'S LINES WERE INVISIBLE.** `generalDeskLines` returns finished
 *      STRINGS with no rung around them, so a walk that harvests `{blockId, poolKey}`
 *      provenance sees none of them. Measured over 3 towns: 85 sentences the provenance walk
 *      could not see, against 202 it could.
 *
 * ⛔ AND THE DORMANT DRAW IS A FACT ABOUT THE WORLD, NOT ABOUT THE PROBE. A headless
 * generated town carries no politics ledger — the layer is written during play — so passing
 * the REAL reading on a fresh world still answers DORMANT. `materialisePolitics` builds a
 * minimal ledger to the shipped reader's own declared shape so the limb is executable in both
 * directions: 3 draws on a fresh world, 0 with the ledger present.
 *
 * ⭐ IT IS A FIXTURE, NOT AN INSTRUMENT. It composes and reports; it gates nothing, persists
 * nothing, and writes no settlement field. The 200-town run lives in
 * `$SC/instr-912/reading-sequence-9.mjs` because 200 towns is seconds of generation and this
 * estate already carries one lint arm close to its own timeout.
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generalStateProse } from '../../src/domain/display/stateProse/generalStateProse.js';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { economyDeskRead } from '../../src/components/new/economyDeskRead.js';
import { powerStateProse } from '../../src/domain/display/stateProse/powerStateProse.js';
import * as defense from '../../src/domain/display/stateProse/defenseStateProse.js';
import { stressorsStateProse } from '../../src/domain/display/stateProse/stressorsStateProse.js';
import { warFaithStateProse } from '../../src/domain/display/stateProse/warFaithStateProse.js';
import { structuralLensOf } from '../../src/domain/spatial/cohesionWeave.js';
import { coupContenders, coupRiskLabel } from '../../src/domain/rulingPowerCoup.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';
import { faithPanelModel } from '../../src/components/settlement/faithPanelModel.js';
import { settlementBlocs } from '../../src/domain/display/politicsRead.js';
import { economyDeskOptions } from '../../scripts/prose-rate-corpus.mjs';

/** The pool key `politicsPresencePoolKey` answers when no ledger exists. */
export const DORMANT_POOL_KEY = 'layer DORMANT (no ledger materialized)';

/** The eight defence entry points, exactly as `DefenseTab.jsx:94-120` calls them. */
const DEFENSE_DESKS = Object.freeze([
  'defenseStateProse', 'defenseThreatProse', 'defenseForcesProse', 'defensePostureProse',
  'defenseWallRationaleProse', 'defenseMilitaryStatusProse', 'defenseSupportingProse',
  'defenseMagicDependencyProse',
]);

/**
 * A materialised politics ledger, built to `politicsRead`'s own declared shape.
 * @param {string} settlementId
 * @returns {{politicsLedgers: Record<string, {blocs: Array<Record<string, unknown>>}>}}
 */
export function materialisedPoliticsWorld(settlementId) {
  return {
    politicsLedgers: {
      [String(settlementId)]: {
        blocs: [{
          id: 'bloc-guilds',
          members: ['the weavers', 'the carters'],
          end: 'tax',
          strain: 0.2,
          sinceTick: 4,
          glue: [{ type: 'trade' }],
          covert: false,
        }],
      },
    },
  };
}

/**
 * Every rung carrying provenance, with its sentence.
 * @param {unknown} node
 * @param {Array<{block: string, pool: string, text: string}>} found
 * @param {number} [depth]
 */
function walkRungs(node, found, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 10) return;
  const row = /** @type {Record<string, any>} */ (node);
  const prov = (typeof row.blockId === 'string' && typeof row.poolKey === 'string')
    ? row
    : (row.provenance && typeof row.provenance.blockId === 'string' && typeof row.provenance.poolKey === 'string'
      ? row.provenance : null);
  if (prov) {
    found.push({ block: prov.blockId, pool: prov.poolKey, text: String(row.sentence || row.text || '') });
    return;
  }
  for (const value of Object.values(row)) walkRungs(value, found, depth + 1);
}

/**
 * The general desk's BARE SENTENCE STRINGS — a finished sentence, never a glance word.
 * @param {unknown} node
 * @param {string[]} out
 * @param {number} [depth]
 */
function harvestBareStrings(node, out, depth = 0) {
  if (typeof node === 'string') {
    const s = node.trim();
    if (s.split(/\s+/).length >= 4 && /[.?!]$/.test(s)) out.push(s);
    return;
  }
  if (!node || typeof node !== 'object' || depth > 8) return;
  for (const value of Object.values(/** @type {Record<string, unknown>} */ (node))) {
    harvestBareStrings(value, out, depth + 1);
  }
}

/**
 * Compose N towns through all six desks.
 * @param {number} n
 * @param {{materialisePolitics?: boolean, settType?: string, seedPrefix?: string,
 *   audience?: string}} [options]
 *   `audience` is the face the desks compose at. It defaults to `dm` — the value every
 *   caller before MEASURE car 3 got implicitly — and exists so the two faces can be
 *   compared, which is the arm cure 2's own defect would have passed.
 * @returns {{towns: number, lines: string[], rungs: Array<{block: string, pool: string,
 *   text: string}>, bare: string[], blocks: string[], composers: string[],
 *   dormantDraws: number, deskThrows: Record<string, number>}}
 */
export function composedReadingSequence(n, options = {}) {
  const settType = options.settType || 'town';
  const prefix = options.seedPrefix || 'instr-912-car9';
  /** @type {Array<{block: string, pool: string, text: string}>} */
  const rungs = [];
  /** @type {string[]} */
  const bare = [];
  /** @type {Set<string>} */
  const composers = new Set();
  /** @type {Record<string, number>} */
  const deskThrows = {};
  let towns = 0;
  for (let i = 0; i < n; i += 1) {
    const settlement = generateSettlementPipeline(
      {
        settType, culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road',
      },
      null,
      { seed: `${prefix}-${i}`, customContent: {} },
    );
    towns += 1;
    const opts = {
      seed: String(settlement._seed ?? settlement.id ?? i),
      audience: options.audience || 'dm',
    };
    /** @param {string} name @param {() => unknown} fn */
    const desk = (name, fn) => {
      try {
        const before = rungs.length;
        walkRungs(fn(), rungs);
        if (rungs.length > before) composers.add(name);
      } catch { deskThrows[name] = (deskThrows[name] || 0) + 1; }
    };
    const eco = settlement.economicState || {};
    const dp = settlement.defenseProfile || {};
    const via = settlement.economicViability || {};
    desk('general', () => generalStateProse(settlement, {
      scores: dp.scores,
      prosperity: eco.prosperity,
      safetyLabel: eco.safetyProfile?.safetyLabel,
      viable: via.viable,
      readinessLabel: dp.readiness?.label,
      foodSecurityLabel: eco.foodSecurity?.label,
      terrainType: settlement.config?.terrainType,
      institutions: settlement.institutions,
      tradeRouteAccess: settlement.config?.tradeRouteAccess,
      isEntrepot: eco.isEntrepot,
      inst: eco.compound?.inst,
      conflicts: settlement.conflicts,
      structuralViolations: settlement.structuralViolations,
      structuralSuggestions: settlement.structuralSuggestions,
      coherenceNotes: settlement.coherenceNotes,
      govFaction: (settlement.powerStructure?.factions || []).find((f) => f?.isGoverning)?.faction,
      tier: settlement.tier,
      foodBalance: via.metrics?.foodBalance,
      history: settlement.history,
      prominentRelationship: settlement.prominentRelationship,
      relationships: settlement.relationships,
      criticalIssueCount: via.metrics?.criticalIssueCount,
      governingName: settlement.powerStructure?.governingName,
      activeChains: eco.activeChains,
      exploitation: settlement.resourceAnalysis?.exploitation,
      primaryImports: eco.primaryImports,
    }, opts));
    try {
      const before = bare.length;
      harvestBareStrings(generalDeskLines(settlement, { publicDossier: false, playerView: false }), bare);
      if (bare.length > before) composers.add('generalDeskLines (bare strings)');
    } catch { deskThrows.generalDeskLines = (deskThrows.generalDeskLines || 0) + 1; }
    // ⛔ THE ECONOMY DESK BY ITS SHIPPED RECIPE, ONE SPELLING (MEASURE fold cure 2). This
    // line carried `economyDeskRead(settlement, opts)` and car 0's `deskReturns` took the
    // defect from here: four caller readings defaulted to `null` and the audience keyed on a
    // `playerView` nobody passed. The options are built by the ONE function both instruments
    // now call, so a third spelling cannot drift from either.
    desk('economy', () => economyDeskRead(settlement, economyDeskOptions(settlement, opts)));
    desk('power', () => {
      let contenders = null;
      try { contenders = coupContenders(settlement); } catch { /* the tab reads null too */ }
      const worldState = options.materialisePolitics ? materialisedPoliticsWorld(settlement.id) : null;
      return powerStateProse(settlement, {
        ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
        structuralLens: structuralLensOf(settlement),
        politics: settlementBlocs({
          worldState, settlementId: settlement.id, includeGroundTruth: true, includeCovert: true,
        }),
      }, opts);
    });
    for (const name of DEFENSE_DESKS) desk(name, () => defense[name](settlement, opts));
    desk('stressors', () => stressorsStateProse(settlement, {
      banners: Array.isArray(settlement.stress) ? settlement.stress : (settlement.stress ? [settlement.stress] : []),
      conditions: deriveAllActiveConditions(settlement),
      worldStressor: null,
    }, opts));
    desk('warFaith', () => {
      const model = faithPanelModel(settlement);
      return warFaithStateProse(settlement, { faith: model, hasPatron: !!model.hasEmbed }, opts);
    });
  }
  return {
    towns,
    rungs,
    bare,
    lines: [...rungs.map((r) => r.text), ...bare].filter((t) => t && t.length > 3),
    blocks: [...new Set(rungs.map((r) => r.block))].sort(),
    composers: [...composers].sort(),
    dormantDraws: rungs.filter((r) => r.pool === DORMANT_POOL_KEY).length,
    deskThrows,
  };
}
