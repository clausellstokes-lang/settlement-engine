/**
 * viewModelBodySlices.js — the four settlement-body chapters of the PDF view
 * model, moved out of viewModel.js verbatim by THE DECOMPOSITION WAVE (lane D).
 *
 * economicsSlice, defenseSlice, servicesSlice and resourcesSlice: the four
 * slices that read the settlement itself rather than the AI overlay, the
 * identity strip or the narrative tail. buildViewModel in the head still calls
 * them in the same order with the same arguments, so the assembled view model
 * is unchanged. exploitName and normalizeIncomeSources moved with them — the
 * economics slice was their only reader.
 *
 * Shared readers (stressArray, foodCore, avgScore) come from
 * ./viewModelPrimitives.js, which the head reads too; nothing here imports the
 * head, so there is no cycle.
 */
import { criminalOpNote, criminalOpEcon, deriveCriminalStructure, deriveSupportingCapabilities,
  deriveDefenseReadiness, deriveArmedForces, deriveGuardAssessment,
  deriveDefenseVulnerabilities, DEFENSE_STRESS_STATUS } from '../../domain/display/defenseDisplay.js';
import { deriveNotableAbsences } from '../../domain/display/servicesDisplay.js';
import { isViabilityItem } from '../../domain/display/viabilityFilter.js';
import { entityIdFor } from '../../domain/dossier/entityLinks.js';
import { customSupplyChainViewModel } from './customSupplyChains.js';
import { stressArray, foodCore, avgScore } from './viewModelPrimitives.js';

// Pull the human resource name off an exploitation chain entry (engine stores
// it as `rawResource`; tolerate a few legacy shapes + bare strings).
export const exploitName = (c) =>
  typeof c === 'string' ? c : (c?.rawResource || c?.resource || c?.chainKey || c?.name || '');

export function economicsSlice(active) {
  const s = active || {};
  const ec = s?.economicState || {};
  const v = s?.economicViability || {};
  const ra = s?.resourceAnalysis || {};
  const sp = ec?.safetyProfile || {};

  // Economic flows / chains
  const chains = (ec?.activeChains || []).map(c => ({
    name: c?.name || c?.chainName || 'Chain',
    status: c?.status || 'productive',
    processingInstitutions: c?.processingInstitutions || c?.processing || [],
    outputs: c?.outputs || [],
    dependency: c?.dependency || null,
    incomeContribution: c?.incomeContribution ?? null,
    description: c?.description || null,
    hooks: c?.plotHooks || [],
    isService: c?.isService || c?.kind === 'service',
  }));

  // §14 — confirmed custom supply chains (display-only; separate from the
  // simulated activeChains so they never feed impairment math).
  const customChains = (ec?.customChains || []).map(customSupplyChainViewModel);

  // Shadow economy
  const shadow = sp?.shadowEconomy || s?.shadowEconomy || {};

  return {
    prosperity:         ec.prosperity || null,
    economicComplexity: ec.economicComplexity || null,
    economyOutput:      ec.compound?.economyOutput ?? null,
    tradeAccess:        ec.tradeAccess || s?.config?.tradeRouteAccess || null,
    incomeSources:      normalizeIncomeSources(ec.incomeSources || []),
    primaryExports:     ec.primaryExports || [], primaryImports: ec.primaryImports || [],
    customTradeLabels:  ec.customTradeLabels || { exports: [], imports: [] },  // §14 — mark these custom
    tradeLabelSources:  { native: ec.nativeTradeLabels || {}, custom: ec.customTradeEndpoints || {} },
    customCategoryExports: ec.customCategoryExports || {},  // §14 — folded category → [member good names]
    customCategoryImports: ec.customCategoryImports || {},
    tradeLinks:         ec.tradeLinks || [],   // §14 Phase 3b — good-level neighbour trade
    localProduction:    ec.localProduction || [],
    tradeDependencies:  ec.tradeDependencies || [],
    necessityImports:   !!ec.necessityImports,
    isEntrepot:         !!ec.isEntrepot,
    safetyHooks:        sp?.plotHooks || [],
    // pdf-6: the COMPLEMENT of the Viability filter — only the dependency/
    // resource-chain/opportunity/food issues belong on the Economics chapter, so
    // a single engine issue prints in exactly one chapter (never twice).
    viabilityIssues:    (v?.issues || []).filter(iss => !isViabilityItem(iss) && iss?.severity !== 'by_design' && iss?.type !== 'stress_consequence').map(iss => ({
      severity: iss?.severity,
      title: iss?.title,
      description: iss?.description,
      institution: iss?.institution,
      priorityNote: iss?.priorityNote,
      suggestedFixes: iss?.suggestedFixes || [],
    })),
    viabilityHooks:     v?.plotHooks || [],
    foodBalance: {
      ...foodCore(v),
      agricultureModifier: v?.metrics?.foodBalance?.agricultureModifier ?? null,
      stressModifier: v?.metrics?.foodBalance?.stressModifier ?? null,
      summary: v?.foodSecurity?.summary || v?.metrics?.foodBalance?.summary || null,
    },
    criticalImports:    ra?.imports?.critical || [],
    chains,
    customChains,
    serviceChains:      chains.filter(c => c.isService),
    shadowEconomy: {
      captureRate:
        shadow?.captureRate ??
        (typeof sp?.blackMarketCapture === 'number'
          ? sp.blackMarketCapture
          : sp?.blackMarketCapture?.score) ??
        null,
      // Operations = the safety profile's criminal institutions (same source the
      // web Economics tab uses), each tagged with its economic role.
      operations: (sp?.criminalInstitutions || []).map((name) => ({
        name,
        econ: criminalOpEcon(name),
      })),
      // Criminal supply chains = the criminal-economy category of active chains.
      criminalChains: (ec?.activeChains || [])
        .filter((c) => c?.needKey === 'criminal_economy')
        .map((c) => `${String(c?.chainId || '').replace(/_/g, ' ')} · ${c?.status || 'active'}`.trim()),
      crimeTypes: sp?.crimeTypes || shadow?.crimeTypes || [],
    },
    // Normalize exploitation to resource-name arrays the section renders
    // directly. Engine shape is { fullyExploited, partiallyExploited,
    // unexploited }, each a chain object whose resource lives in `rawResource`.
    resourceExploitation: {
      full:        (ra?.exploitation?.fullyExploited || []).map(exploitName).filter(Boolean),
      partial:     (ra?.exploitation?.partiallyExploited || []).map(exploitName).filter(Boolean),
      unexploited: (ra?.exploitation?.unexploited || []).map(exploitName).filter(Boolean),
    },
    terrainCriticals: ra?.terrainCriticals || [],
  };
}

export function defenseSlice(active) {
  const s = active || {};
  const dp = s?.defenseProfile || {};
  const sp = s?.economicState?.safetyProfile || {};
  const stress = stressArray(s);

  // Defense readiness rows (reframed threat assessment) + grouped armed forces,
  // both shared with the web Defense tab via deriveDefenseReadiness/Forces.
  const threatReadiness = deriveDefenseReadiness(s);
  const armedForces = deriveArmedForces(s);

  // Active military status override (from stress). Match on the stressor TYPE the
  // engine emits, via the SHARED DEFENSE_STRESS_STATUS set the web DefenseTab uses,
  // so print and screen can never drift (pdf-4).
  const militaryStress = stress.find(x => DEFENSE_STRESS_STATUS[x?.type]);

  // Criminal architecture. Operations come from the safety profile's criminal
  // institutions (the source the web Defense tab uses), each carrying an
  // enforcement note; criminalStructure classifies the overall organization.
  const criminalCapture = s?.powerStructure?.criminalCaptureState || sp?.criminalCapture || null;
  const criminalOps = (sp?.criminalInstitutions || []).map((name) => ({
    name,
    note: criminalOpNote(name),
  }));
  const criminalStructure = deriveCriminalStructure(s);
  const criminalFaction = (s?.powerStructure?.factions || s?.factions || []).find(f => (f?.category || '').toLowerCase() === 'criminal') || null;
  const orderHooks = sp?.plotHooks || [];

  return {
    scores:                dp.scores || {},
    scoreAvg:              avgScore(dp.scores),
    threatReadiness,
    militaryStress,
    readiness:             dp.readiness || null,
    guardAssessment:       deriveGuardAssessment(s),
    institutions:          dp.institutions || {},
    armedForces,
    safetyLabel:           sp.safetyLabel || null,
    safetyRatio:           sp.safetyRatio,
    criminalInstitutions:  sp.criminalInstitutions || [],
    crimeTypes:            sp.crimeTypes || [],
    blackMarketCapture:    sp.blackMarketCapture || null,
    // foodSecurity lives on economicState (economicGenerator), not
    // economicViability; prefer the defense profile's disaster score when the
    // generator persists one, keep the old path for legacy saves.
    foodResilience:        s?.defenseProfile?.scores?.disaster ??
                           s?.economicState?.foodSecurity?.resilienceScore ??
                           s?.economicViability?.foodSecurity?.resilienceScore ?? null,
    tradeAccess:           s?.config?.tradeRouteAccess || null,
    stress,
    criminalCapture,
    criminalOps,
    criminalStructure,
    criminalFaction,
    orderHooks,
    // Computed from defense scores + institution presence, mirroring the web
    // Defense tab (the engine does not emit these as fields).
    supportingCapabilities: deriveSupportingCapabilities(s),
    vulnerabilities: deriveDefenseVulnerabilities(s)
      .map((violation) => typeof violation.reason === 'string' ? violation.reason.trim() : '')
      .filter(Boolean),
    // Surfaced for defenseHeadline (it reads def.magicDependency).
    magicDependency: !!dp?.magicDependency,
    magicalCapability: dp?.magicalCapability || null,
  };
}

export function servicesSlice(active) {
  const s = active || {};
  const institutions = s?.institutions || [];
  const detailed = institutions.map(inst => ({
    // Phase-D anchor identity — matches the index entry built off this raw inst.
    id: inst?.id || entityIdFor('institution', inst),
    name: inst?.name || inst?.label || 'Institution',
    category: inst?.category || 'other',
    subCategory: inst?.subCategory || inst?.type || null,
    status: inst?.status || 'healthy',
    statusReason: inst?.statusReason || inst?.statusNote || null,
    servicesOffered: inst?.servicesOffered || inst?.services || [],
    chainDepth: inst?.chainDepth ?? null,
    source: inst?.source || null,
    notableUnits: inst?.notableUnits || null,
    notes: inst?.notes || null,
    staffing: inst?.staffing || null,
    // Extra detail: surface any narrative/structural fields the engine emits
    description:    inst?.description || inst?.blurb || null,
    leader:         inst?.leader || inst?.headedBy || inst?.master || null,
    building:       inst?.building || inst?.location || inst?.quarter || null,
    founded:        inst?.founded || inst?.foundedYear || null,
    prominence:     inst?.prominence || inst?.scale || null,
    capacity:       inst?.capacity || null,
    requirements:   inst?.requirements || inst?.dependencies || [],
    products:       inst?.products || inst?.outputs || [],
    customers:      inst?.customers || inst?.clientele || [],
    pressures:      inst?.pressures || inst?.stresses || [],
    plotHooks:      inst?.plotHooks || [],
    tags:           inst?.tags || [],
  }));

  // Health stats per category
  const byCat = {};
  for (const inst of detailed) {
    const cat = inst.category;
    if (!byCat[cat]) byCat[cat] = { total: 0, impaired: 0, degraded: 0, vulnerable: 0, healthy: 0 };
    byCat[cat].total++;
    const st = (inst.status || 'healthy').toLowerCase();
    if (byCat[cat][st] != null) byCat[cat][st]++;
  }

  const totals = {
    total: detailed.length,
    impaired:  detailed.filter(i => (i.status || '').toLowerCase() === 'impaired').length,
    degraded:  detailed.filter(i => (i.status || '').toLowerCase() === 'degraded').length,
    vulnerable: detailed.filter(i => (i.status || '').toLowerCase() === 'vulnerable').length,
  };

  return {
    available:      s?.availableServices || {},
    activeChains:   s?.economicState?.activeChains || [],
    tier:           s?.tier || null,
    institutions,
    detailed,
    categoryHealth: Object.entries(byCat).map(([cat, h]) => ({ category: cat, ...h })),
    totals,
    // Computed (expected-for-tier minus available) — the engine doesn't emit
    // this; the web ServicesTab derives it the same way.
    notableAbsences: deriveNotableAbsences(s?.tier, s?.availableServices),
  };
}

export function resourcesSlice(active) {
  const s = active || {};
  const ra = s?.resourceAnalysis || {};
  const v = s?.economicViability || {};
  const cfg = s?.config || {};

  // Convert exploitation lists into chain-flow rows. Engine keys are
  // { fullyExploited, partiallyExploited, unexploited } (resourceGenerator
  // evaluateInstitutions); fall back to the display key for legacy saves.
  // Entries are RESOURCE_CHAINS objects — resource in `rawResource`,
  // processing in `processingInstitutions[]`, outputs in `finalProducts[]`.
  const exp = ra?.exploitation || {};
  const EXP_KEYS = { full: 'fullyExploited', partial: 'partiallyExploited', unexploited: 'unexploited' };
  const chainRows = [];
  for (const [which, engineKey] of Object.entries(EXP_KEYS)) {
    for (const item of (exp?.[engineKey] || exp?.[which] || [])) {
      if (typeof item === 'string') {
        if (item) chainRows.push({ resource: item, status: which, processing: null, output: null });
      } else if (item) {
        const resource = item?.rawResource || item?.resource || item?.chainKey || item?.name || '';
        if (!resource) continue;
        chainRows.push({
          resource,
          status: which,
          processing: item?.processing || item?.institution ||
                      (item?.processingInstitutions || []).join(', ') || null,
          output: item?.output || item?.product ||
                  (item?.finalProducts || item?.outputs || []).join(', ') || null,
          chainStatus: item?.chainStatus || null,
          quality: item?.quality || null,
          accessibility: item?.accessibility || null,
        });
      }
    }
  }

  // Split nearby resources into depleted vs abundant
  const allNearby = ra.nearbyResources || cfg.nearbyResources || [];
  const depletedSet = new Set(cfg.nearbyResourcesDepleted || []);
  const depleted  = allNearby.filter(k => depletedSet.has(k));
  const abundant  = allNearby.filter(k => !depletedSet.has(k));

  return {
    terrain:            ra.terrain || null,
    strategicValue:     ra.strategicValue || null,
    economicStrengths:  ra.economicStrengths || [],
    exploitation:       exp,
    imports:            ra.imports || {},
    chainRows,
    nearbyResources:    allNearby,
    nearbyDepleted:     depleted,
    nearbyAbundant:     abundant,
    nearbyCustom:       cfg.nearbyResourcesCustom || [],   // §14 — gold-tint these
    availableCommodities: ra?.availableResources || s?.availableResources || [],
    // resourceAnalysis emits exports/gaps/priorityNotes (resourceGenerator); the
    // old exportPotential/structuralGaps/v.priorityNotes reads never resolved.
    exportPotential:    ra?.exports || ra?.exportPotential || s?.exportPotential || [],
    priorityNotes:      ra?.priorityNotes || v?.priorityNotes || [],
    structuralGaps:     ra?.gaps || ra?.structuralGaps || s?.structuralGaps || [],
    terrainEffects:     ra?.terrainEffects || s?.terrainEffects || ra?.featureEffects || [],
    terrainCriticals:   ra?.terrainCriticals || [],
    terrainAdvantages:  ra?.terrainAdvantages || [],
  };
}

/**
 * normalizeIncomeSources — engine emits incomeSources as either:
 *   - array of { source, percentage }   (percentage = 0..100)
 *   - array of { source, value }        (raw economy units)
 * If percentages don't sum to ~100, treat as raw values and re-derive percent.
 * The bar fill and the label MUST agree, otherwise the page reads broken.
 */
export function normalizeIncomeSources(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  // Zero-amount sources are dropped HERE (PDF-side): a zero source has no bar to
  // draw and would only add noise / risk a degenerate total where the bar fill
  // and label MUST agree. The screen may still list such sources; this is a
  // per-surface formatting choice, not a data disagreement. (See the
  // PARITY_EXEMPT contract in domain/display/parityContract.js.)
  const items = arr.map(s => ({
    ...s,
    raw: s?.percentage ?? s?.value ?? s?.amount ?? 0,
  })).filter(s => Number(s.raw) > 0);
  if (items.length === 0) return [];
  const total = items.reduce((n, s) => n + Number(s.raw), 0);
  // If the original "percentage" field already adds to ~100 (±5), trust it.
  const pctSum = arr.reduce((n, s) => n + Number(s?.percentage || 0), 0);
  const usePctField = pctSum >= 95 && pctSum <= 105;
  return items.map(s => ({
    ...s,
    percentage: usePctField
      ? Number(s.percentage || 0)
      : (total > 0 ? (Number(s.raw) / total) * 100 : 0),
  }));
}
