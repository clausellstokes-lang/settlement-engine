/**
 * viewModel — translate a settlement save into PDF-ready slices.
 *
 * This is the single source of truth for what the PDF renders. Sections never
 * reach into deeply nested optional paths themselves; they read pre-shaped
 * slices keyed by section.
 *
 * The companion principle is "parity by default": if the on-screen tab shows
 * a field, the corresponding slice surfaces it. Sections then choose what
 * to render and how.
 *
 * Returned shape:
 *   raw             — original settlement object
 *   ai              — original aiSettlement (or null)
 *   active          — whichever of the two the user is currently looking at
 *   narrativeMode   — true iff AI is actually being used
 *   aiDailyLife     — five dawn-to-night prose passages (or null)
 *
 *   summary, identity, overview, daily, power, economics, defense, services,
 *   resources, viability, history, npcs, hooks, relationships, aiAppendix
 *     — pre-shaped slices.
 */

import { flag } from '../../lib/flags.js';
import { deriveFoodBalance, deriveViability } from '../../domain/display/dossierViewModel.js';
import {
  criminalOpNote, criminalOpEcon, deriveCriminalStructure, deriveSupportingCapabilities,
  deriveDefenseReadiness, deriveArmedForces,
} from '../../domain/display/defenseDisplay.js';
import { deriveNotableAbsences } from '../../domain/display/servicesDisplay.js';

const TIER_LABELS = {
  thorp: 'Thorp', hamlet: 'Hamlet', village: 'Village',
  town: 'Town', city: 'City', metropolis: 'Metropolis',
};

/**
 * settlement.stress is sometimes an array, sometimes a single stress
 * object, sometimes null/undefined — depends on which generator path
 * produced the settlement. Normalize to array at every read site so the
 * downstream code can iterate uniformly. Caught by the PDF section
 * smoke tests in tests/pdf/sections.smoke.test.js.
 */
function stressArray(s) {
  if (Array.isArray(s?.stress)) return s.stress;
  if (s?.stress) return [s.stress];
  return [];
}

/**
 * Food-balance core fields, shared by the raw + active slices. Behind the
 * canonicalViewModel flag these come from the display model (which reads the
 * real dailyProduction/dailyNeed fields and applies the §1c "Not calculated"
 * fallback); otherwise the legacy shape is preserved verbatim. `viability`
 * is the economicViability object (not the whole settlement).
 */
// imports cover this % of the pre-import gap (qty ÷ rawDeficit). Mirrors the web
// EconomicsTab ("Trade covers X% of gap"). importCoverage is a QUANTITY (lb/day),
// NOT a percent — printing it directly produced the bogus "imports cover 15929%".
// Falls back to 100% of the import qty when the gap is unknown.
function coveragePct(ic, rd) {
  return ic > 0 ? Math.round((ic / (rd || ic)) * 100) : null;
}

function foodCore(viability) {
  const fb = viability?.metrics?.foodBalance || null;
  if (flag('canonicalViewModel')) {
    const m = deriveFoodBalance({ economicViability: viability });
    return {
      production: m.produced,
      need:       m.needed,
      deficit:    m.deficit || null,
      surplus:    m.surplus || null,
      importCoverage: m.importCoverage,
      rawDeficit: m.rawDeficit,
      coveragePct: coveragePct(m.importCoverage, m.rawDeficit),
      deficitPct: m.deficitPct,
      display:    m.display,
      detail:     m.detail,
    };
  }
  const legacyNeed = Number(fb?.need) || 0;
  const legacyDef = Number(fb?.deficit) || 0;
  return {
    production: fb?.production ?? null,
    need:       fb?.need ?? null,
    deficit:    fb?.deficit ?? null,
    surplus:    fb?.surplus ?? null,
    importCoverage: fb?.importCoverage ?? null,
    rawDeficit: fb?.rawDeficit ?? null,
    coveragePct: coveragePct(fb?.importCoverage, fb?.rawDeficit),
    deficitPct: legacyNeed > 0 && legacyDef > 0 ? Math.round((legacyDef / legacyNeed) * 100) : null,
  };
}

/**
 * Viability summary (§1f). Behind canonicalViewModel, the reconciled verdict
 * from the display model (which never claims "self-sufficient" while the food
 * balance shows a deficit); otherwise the raw generator summary. The verdict
 * enum + tone are unchanged — only the prose is reconciled.
 */
function viabilitySummaryFor(settlement) {
  if (flag('canonicalViewModel')) return deriveViability(settlement).summary;
  return settlement?.economicViability?.summary || null;
}

const PROSPERITY_TONE = {
  thriving: 'good', wealthy: 'good',
  stable: 'gold', modest: 'muted', moderate: 'muted',
  struggling: 'warn', impoverished: 'bad', poor: 'bad',
};

const SAFETY_TONE = {
  safe: 'good', orderly: 'good',
  ordinary: 'muted', average: 'muted',
  tense: 'warn', uneasy: 'warn',
  dangerous: 'bad', lawless: 'bad', perilous: 'bad',
};

const VIABILITY_TONE = {
  viable: 'good', coherent: 'good',
  marginal: 'warn',
  notViable: 'bad', notCoherent: 'bad',
};

export function buildViewModel({
  settlement,
  aiSettlement = null,
  aiDailyLife = null,
  narrativeMode = false,
  // Campaign-state engine extras — passed through unchanged for the
  // SystemStateSnapshot and Timeline chapters to consume. Optional;
  // older callers that don't supply them get undefined here, which
  // those chapters handle gracefully.
  systemState = null,
  eventLog = [],
  phase = 'draft',
} = /** @type {{ settlement?: any, aiSettlement?: any, aiDailyLife?: any, narrativeMode?: boolean, systemState?: any, eventLog?: any[], phase?: string }} */ ({})) {
  const raw = settlement || {};
  const ai = aiSettlement || null;
  const useAi = !!(narrativeMode && ai);
  const active = useAi ? ai : raw;

  return {
    raw,
    ai,
    active,
    aiDailyLife,
    narrativeMode: useAi,
    systemState,
    eventLog,
    phase,

    summary:       summarySlice(active, ai, useAi, aiDailyLife),
    identity:      identitySlice(active),
    overview:      overviewSlice(active, ai, useAi),
    daily:         dailySlice(active, aiDailyLife),
    power:         powerSlice(active),
    economics:     economicsSlice(active),
    defense:       defenseSlice(active),
    services:      servicesSlice(active),
    resources:     resourcesSlice(active),
    viability:     viabilitySlice(active),
    history:       historySlice(active),
    npcs:          npcsSlice(active),
    hooks:         hooksSlice(active),
    relationships: relationshipsSlice(active),
    aiAppendix:    useAi ? appendixSlice(ai) : null,
  };
}

// ── helpers (used across slices) ─────────────────────────────────────────────

function _fmtNum(n, dec = 0) {
  if (n == null || Number.isNaN(n)) return null;
  if (typeof n !== 'number') return String(n);
  return dec === 0 ? String(Math.round(n)) : n.toFixed(dec);
}

function getGoverningFaction(active) {
  const factions = active?.powerStructure?.factions || active?.factions || [];
  return factions.find(f => f?.isGoverning) || null;
}

function avgScore(scores) {
  const vals = Object.values(scores || {}).filter(v => typeof v === 'number');
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// ── slice builders ──────────────────────────────────────────────────────────

/**
 * summarySlice — feeds the new Summary page (closes the biggest gap).
 * Mirrors SummaryTab.jsx: identity strip + crisis banner + arrival scene +
 * pressure sentence + 3-tile situation row + key figures.
 */
function summarySlice(active, ai, useAi, aiDailyLife) {
  const s = active || {};
  const governing = getGoverningFaction(active);
  const factions = s?.powerStructure?.factions || s?.factions || [];
  const npcs = (s?.npcs || []).slice().sort((a, b) => (b?.power || 0) - (a?.power || 0));
  const top4 = npcs.slice(0, 4);
  const dp = s?.defenseProfile || {};
  const ec = s?.economicState || {};
  const stress = stressArray(s).filter(Boolean);

  return {
    identity: {
      name:         s?.name || 'Unnamed Settlement',
      tier:         s?.tier ? (TIER_LABELS[s.tier] || s.tier) : null,
      tierKey:      s?.tier || null,
      population:   s?.population || 0,
      dominantRace: s?.dominantRace || s?.race || null,
      terrain:      s?.resourceAnalysis?.terrain || s?.terrain || null,
    },
    crisis: stress.length > 0 ? {
      active: true,
      chips: stress.map(x => ({
        icon: x?.icon, label: x?.label, summary: x?.summary, hook: x?.crisisHook,
      })),
    } : { active: false, chips: [] },
    arrivalScene: useAi ? (ai?.arrivalScene || ai?.aiNarrative?.arrivalScene || null) : null,
    pressureSentence: useAi ? (ai?.pressureSentence || ai?.aiNarrative?.pressureSentence || null) : null,
    situation: {
      power: {
        governanceType: s?.powerStructure?.governmentType || s?.governmentType || null,
        governingName: governing?.faction || governing?.name || null,
      },
      economy: {
        complexity: ec?.economicComplexity || null,
        topExport: labelOfThing(ec?.primaryExports?.[0]),
      },
      defense: {
        readiness: dp?.readiness?.label || null,
        scoreAvg: avgScore(dp?.scores),
      },
    },
    factionsPower: factions.slice().sort((a, b) => (b?.power || 0) - (a?.power || 0)).map(f => ({
      name: f?.faction || f?.name || '',
      power: f?.power || 0,
      isGoverning: !!f?.isGoverning,
    })),
    tensionsCount: (s?.history?.currentTensions || []).length,
    keyFigures: top4.map(npc => ({
      name: npc.name,
      title: npc.title,
      race: npc.race,
      faction: labelOfFactionRef(npc.factionAffiliation),
      power: npc.power || 0,
      sentence: characterSentence(npc),
    })),
    prominentRelationship: s?.prominentRelationship || null,
    hasAi: useAi,
    hasDailyLife: !!(aiDailyLife && (aiDailyLife.dawn || aiDailyLife.morning)),
  };
}

function identitySlice(s) {
  const ec = s?.economicState || {};
  const dp = s?.defenseProfile || {};
  const sp = ec?.safetyProfile || {};
  const fb = s?.economicViability?.metrics?.foodBalance || null;
  const governing = getGoverningFaction(s);
  return {
    name:           s?.name || 'Unnamed Settlement',
    tier:           s?.tier ? (TIER_LABELS[s.tier] || s.tier) : null,
    tierKey:        s?.tier || null,
    population:     s?.population || 0,
    dominantRace:   s?.dominantRace || s?.race || null,
    terrain:        s?.resourceAnalysis?.terrain || s?.terrain || null,
    layout:         s?.spatialLayout?.layout || null,
    age:            s?.history?.age || null,
    tradeAccess:    s?.config?.tradeRouteAccess || null,
    governmentType: s?.powerStructure?.governmentType || s?.governmentType || null,
    founding:       s?.history?.founding || null,
    quarters:       (s?.spatialLayout?.quarters || []).map(q => ({
      name: q?.name || 'Quarter',
      description: q?.description || null,
      landmarks: q?.landmarks || [],
    })),
    // Anchor facts (mirror DailyLifeTab anchor panel)
    anchor: {
      governingName:  governing?.faction || governing?.name || null,
      prosperity:     ec?.prosperity || null,
      complexity:     ec?.economicComplexity || null,
      safety:         sp?.safetyLabel || null,
      foodDeficit:    fb?.deficit ?? null,
      foodSurplus:    fb?.surplus ?? null,
      culturalNotes:  s?.culturalNotes || null,
      magicDependency: !!dp?.magicDependency,
      magicalCapability: dp?.magicalCapability || null,
      defenseLabel:   dp?.readiness?.label || null,
      defenseScoreAvg: avgScore(dp?.scores),
      activeStress:   stressArray(s).map(x => x?.label || x?.icon).filter(Boolean),
    },
  };
}

function overviewSlice(active, ai, useAi) {
  const s = active || {};
  const stress = stressArray(s).map(x => ({
    icon:    x?.icon,
    label:   x?.label,
    summary: x?.summary,
    hook:    x?.crisisHook,
  }));
  const tensions = (s?.history?.currentTensions || []).map(t => ({
    label: t?.label || t?.type,
    type: t?.type,
    severity: normSeverity(t?.severity),
    description: t?.description,
    parties: t?.factions || t?.parties || [],
    hooks: cleanHooks(t?.plotHooks),
  }));
  const conflicts = (s?.conflicts || []).map(c => ({
    parties: c?.parties || [],
    issue: c?.issue,
    stakes: c?.stakes,
    intensity: normSeverity(c?.intensity),
    description: c?.description,
    hooks: cleanHooks(c?.plotHooks),
  }));
  const ec = s?.economicState || {};
  const dp = s?.defenseProfile || {};
  const sp = ec?.safetyProfile || {};
  const v = s?.economicViability || {};
  const ra = s?.resourceAnalysis || {};

  // Institution category distribution
  const institutions = s?.institutions || [];
  const byCat = {};
  for (const inst of institutions) {
    const cat = inst?.category || 'other';
    byCat[cat] = (byCat[cat] || 0) + 1;
  }
  const totalInst = institutions.length;
  const categoryDistribution = Object.entries(byCat)
    .map(([cat, count]) => ({
      category: cat,
      count,
      percentage: totalInst ? Math.round((count / totalInst) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const prosperity = ec?.prosperity || null;
  const safety = sp?.safetyLabel || null;
  return {
    thesis:             useAi ? (ai?.thesis || null) : null,
    arrivalScene:       useAi ? (ai?.arrivalScene || ai?.aiNarrative?.arrivalScene || null) : null,
    pressureSentence:   useAi ? (ai?.pressureSentence || ai?.aiNarrative?.pressureSentence || null) : null,
    character:          s?.history?.historicalCharacter || null,
    prosperity,
    prosperityTone:     PROSPERITY_TONE[(prosperity || '').toLowerCase()] || 'muted',
    safety,
    safetyTone:         SAFETY_TONE[(safety || '').toLowerCase()] || 'muted',
    viability:          v?.viable,
    viabilityVerdict:   v?.verdict || null,
    viabilitySummary:   viabilitySummaryFor(s),
    stability:          s?.powerStructure?.stability || null,
    stress,
    tensions,
    conflicts,
    foodBalance: {
      ...foodCore(s?.economicViability),
      summary:    s?.economicViability?.foodSecurity?.summary || s?.economicViability?.metrics?.foodBalance?.summary || null,
    },
    economyOutput:      ec?.compound?.economyOutput ?? null,
    economicComplexity: ec?.economicComplexity || null,
    defenseScores:      dp?.scores || {},
    defenseScoreAvg:    avgScore(dp?.scores),
    defenseReadiness:   dp?.readiness || null,
    safetyRatio:        sp?.safetyRatio,
    magicDependency:    !!dp?.magicDependency,
    primaryExports:     ec?.primaryExports || [],
    primaryImports:     ec?.primaryImports || [],
    institutionsCount:  institutions.length,
    npcsCount:         (s?.npcs || []).length,
    factionsCount:     (s?.powerStructure?.factions || s?.factions || []).length,
    institutions,
    categoryDistribution,
    quarters:          (s?.spatialLayout?.quarters || []).map(q => ({
      name: q?.name || 'Quarter',
      description: q?.description || null,
      landmarks: q?.landmarks || [],
    })),
    settlementReason:   s?.settlementReason || null,
    history: {
      foundedBy:          s?.history?.founding?.foundedBy || s?.history?.foundedBy || null,
      initialChallenge:   s?.history?.founding?.initialChallenge || s?.history?.initialChallenge || null,
      overcoming:         s?.history?.founding?.overcoming || s?.history?.overcoming || null,
      stressNote:         s?.history?.founding?.stressNote || null,
      origin:             s?.history?.founding?.origin || s?.history?.founding?.reason || s?.history?.origin || s?.history?.reason || null,
      summary:            s?.history?.founding?.summary || null,
    },
    prominentRelationship: s?.prominentRelationship || null,
    geography: {
      terrain: ra?.terrain || s?.terrain || null,
      terrainAdvantages: ra?.terrainAdvantages || [],
      terrainCriticals:  ra?.terrainCriticals || [],
      nearbyResources:   ra?.nearbyResources || [],
    },
    coherenceNotes:    v?.coherenceNotes || [],
    structuralSuggestions: v?.structuralSuggestions || [],
    warnings:          s?.warnings || [],
  };
}

function dailySlice(active, aiDailyLife) {
  const passages = aiDailyLife
    ? [
        { time: 'Dawn',    text: aiDailyLife.dawn },
        { time: 'Morning', text: aiDailyLife.morning },
        { time: 'Midday',  text: aiDailyLife.midday },
        { time: 'Evening', text: aiDailyLife.evening },
        { time: 'Night',   text: aiDailyLife.night },
      ].filter(p => p.text)
    : [];
  return {
    hasPassages: passages.length > 0,
    passages,
    foodBalance: active?.economicViability?.metrics?.foodBalance || null,
    services:    active?.availableServices || {},
    institutions: active?.institutions || [],
    safetyRatio: active?.economicState?.safetyProfile?.safetyRatio,
    stress:      stressArray(active),
  };
}

function powerSlice(active) {
  const s = active || {};
  const factionList = s?.powerStructure?.factions || s?.factions || [];
  const factions = factionList.map(f => ({
    name:        f?.faction || f?.name || '',
    power:       f?.power || 0,
    rawPower:    f?.rawPower ?? null,
    powerLabel:  f?.powerLabel || null,
    isGoverning: !!f?.isGoverning,
    blurb:       f?.blurb || null,
    description: f?.description || f?.desc || null,
    category:    f?.category || null,
    crisisNote:  f?.crisisNote || null,
    modifiers:   (f?.modifiers || []).map(m => ({
      label: typeof m === 'string' ? m : (m?.label || m?.name || ''),
      delta: typeof m === 'object' ? (m?.delta ?? m?.value ?? null) : null,
    })),
    subFactions: f?.subFactions || f?.matchedGroups || [],
  })).sort((a, b) => (b.power || 0) - (a.power || 0));

  // Stacked bar segments — total for normalisation
  const totalPower = factions.reduce((a, f) => a + (f.power || 0), 0);
  const distribution = factions.map(f => ({
    name: f.name,
    power: f.power,
    pct: totalPower ? (f.power / totalPower) * 100 : 0,
    isGoverning: f.isGoverning,
    category: f.category,
  }));

  const tensions = (s?.history?.currentTensions || []).map(t => ({
    label: t?.label || t?.type,
    severity: normSeverity(t?.severity),
    description: t?.description,
    parties: t?.factions || t?.parties || [],
    hooks: cleanHooks(t?.plotHooks),
  }));

  const conflicts = (s?.conflicts || []).map(c => ({
    parties: c?.parties || [],
    issue: c?.issue,
    stakes: c?.stakes,
    intensity: normSeverity(c?.intensity),
    description: c?.description,
    hooks: cleanHooks(c?.plotHooks),
  }));

  return {
    factions,
    distribution,
    totalPower,
    stability:       s?.powerStructure?.stability || null,
    recentConflict:  s?.powerStructure?.recentConflict || null,
    legitimacy:      s?.powerStructure?.publicLegitimacy || null,
    legitimacyBreakdown: s?.powerStructure?.publicLegitimacy?.breakdown || [],
    governanceFractured: !!s?.powerStructure?.publicLegitimacy?.governanceFractured,
    criminalCapture: s?.powerStructure?.criminalCaptureState || null,
    governmentType:  s?.powerStructure?.governmentType || s?.governmentType || null,
    conflicts,
    tensions,
  };
}

// Pull the human resource name off an exploitation chain entry (engine stores
// it as `rawResource`; tolerate a few legacy shapes + bare strings).
const exploitName = (c) =>
  typeof c === 'string' ? c : (c?.rawResource || c?.resource || c?.chainKey || c?.name || '');

function economicsSlice(active) {
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
  const customChains = (ec?.customChains || []).map(c => ({
    name: c?.label || c?.name || c?.chainId || 'Custom chain',
    resource: c?.resource || null,
    processingInstitutions: c?.processingInstitutions || [],
    outputs: c?.outputs || [],
  }));

  // Shadow economy
  const shadow = sp?.shadowEconomy || s?.shadowEconomy || {};

  return {
    prosperity:         ec.prosperity || null,
    economicComplexity: ec.economicComplexity || null,
    economyOutput:      ec.compound?.economyOutput ?? null,
    tradeAccess:        ec.tradeAccess || s?.config?.tradeRouteAccess || null,
    incomeSources:      normalizeIncomeSources(ec.incomeSources || []),
    primaryExports:     ec.primaryExports || [],
    primaryImports:     ec.primaryImports || [],
    customTradeLabels:  ec.customTradeLabels || { exports: [], imports: [] },  // §14 — mark these custom
    customCategoryExports: ec.customCategoryExports || {},  // §14 — folded category → [member good names]
    customCategoryImports: ec.customCategoryImports || {},
    tradeLinks:         ec.tradeLinks || [],   // §14 Phase 3b — good-level neighbour trade
    localProduction:    ec.localProduction || [],
    tradeDependencies:  ec.tradeDependencies || [],
    necessityImports:   !!ec.necessityImports,
    isEntrepot:         !!ec.isEntrepot,
    safetyHooks:        sp?.plotHooks || [],
    viabilityIssues:    (v?.issues || []).map(iss => ({
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

function defenseSlice(active) {
  const s = active || {};
  const dp = s?.defenseProfile || {};
  const sp = s?.economicState?.safetyProfile || {};
  const stress = stressArray(s);

  // Defense readiness rows (reframed threat assessment) + grouped armed forces,
  // both shared with the web Defense tab via deriveDefenseReadiness/Forces.
  const threatReadiness = deriveDefenseReadiness(s);
  const armedForces = deriveArmedForces(s);

  // Active military status override (from stress)
  const militaryStress = stress.find(x => ['siege', 'occupied', 'civilWar'].includes(x?.icon || x?.key));

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
    guardAssessment:       s?.guardAssessment || dp?.guardAssessment || null,
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
    publicOrder: s?.publicOrder || null,
    lawEnforcement: s?.lawEnforcement || null,
    // Computed from defense scores + institution presence, mirroring the web
    // Defense tab (the engine does not emit these as fields).
    supportingCapabilities: deriveSupportingCapabilities(s),
    vulnerabilities: dp?.vulnerabilities || s?.defenseVulnerabilities || [],
  };
}

function servicesSlice(active) {
  const s = active || {};
  const institutions = s?.institutions || [];
  const detailed = institutions.map(inst => ({
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

function resourcesSlice(active) {
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
    exportPotential:    ra?.exportPotential || s?.exportPotential || [],
    priorityNotes:      v?.priorityNotes || [],
    structuralGaps:     ra?.structuralGaps || s?.structuralGaps || [],
    terrainEffects:     ra?.terrainEffects || s?.terrainEffects || ra?.featureEffects || [],
    terrainCriticals:   ra?.terrainCriticals || [],
    terrainAdvantages:  ra?.terrainAdvantages || [],
  };
}

function viabilitySlice(active) {
  const s = active || {};
  const v = s?.economicViability || {};
  const dp = s?.defenseProfile || {};
  const stress = stressArray(s);

  return {
    viable:                v.viable,
    verdict:               v?.verdict || (v?.viable === true ? 'viable' : v?.viable === false ? 'notViable' : null),
    verdictTone:           VIABILITY_TONE[(v?.verdict || '').toLowerCase()] || (v?.viable === true ? 'good' : v?.viable === false ? 'bad' : 'muted'),
    summary:               viabilitySummaryFor(s),
    metrics:               v.metrics || {},
    issues:                (v.issues || []).map(iss => ({
      severity: iss?.severity,
      title: iss?.title,
      description: iss?.description,
      institution: iss?.institution,
      priorityNote: iss?.priorityNote,
      suggestedFixes: iss?.suggestedFixes || [],
    })),
    criticalIssues:        v?.criticalIssues || (v?.issues || []).filter(i => (i?.severity || '').toLowerCase() === 'critical'),
    warnings:              [...(v?.warnings || []), ...(s?.warnings || [])],
    structuralViolations:  s?.structuralViolations || [],
    stress:                stress.map(x => ({ label: x?.label || x?.icon, summary: x?.summary, hook: x?.crisisHook })),
    stressConsequences:    v?.stressConsequences || [],
    magicDependency:       !!dp?.magicDependency,
    activeMagicChains:     v?.activeMagicChains || [],
    byDesignContradictions: v?.byDesignContradictions || [],
  };
}

function historySlice(active) {
  const s = active || {};
  const h = s?.history || {};
  const events = (h?.historicalEvents || []).slice().sort((a, b) => (a?.yearsAgo ?? 0) - (b?.yearsAgo ?? 0));
  // Engine emits founding.reason via genArrivalDetail; slice exposes it as
  // `origin` (the field the chapter renders). Top-level `settlementReason`
  // is the higher-level "why this place exists" prose — use it as the
  // founding summary callout when the engine doesn't supply one.
  const settlementReason = typeof s?.settlementReason === 'string'
    ? s.settlementReason
    : (s?.settlementReason?.primary || null);
  return {
    age:                 h.age || null,
    historicalCharacter: h.historicalCharacter || null,
    founding: {
      summary:          h?.founding?.summary || settlementReason || null,
      origin:           h?.founding?.origin || h?.founding?.reason || h?.origin || h?.reason || null,
      foundedBy:        h?.founding?.foundedBy || h?.foundedBy || null,
      initialChallenge: h?.founding?.initialChallenge || h?.initialChallenge || null,
      overcoming:       h?.founding?.overcoming || h?.overcoming || null,
      stressNote:       h?.founding?.stressNote || null,
    },
    events: events.map(e => ({
      type:           e?.type || e?.kind || e?.category,
      title:          e?.title || e?.name || null,
      severity:       e?.severity || e?.magnitude || e?.scale,
      yearsAgo:       e?.yearsAgo ?? e?.years_ago ?? null,
      recencyLabel:   e?.recencyLabel || e?.recency || null,
      description:    e?.description || e?.summary || e?.text || e?.detail || e?.body || null,
      cause:          e?.cause || e?.trigger || null,
      outcome:        e?.outcome || e?.resolution || null,
      lastingEffects: e?.lastingEffects || e?.consequences || e?.legacy || [],
      hooks:          e?.plotHooks || e?.hooks || [],
    })),
    tensions: (h?.currentTensions || []).map(t => ({
      label: t?.label || t?.type,
      severity: t?.severity,
      description: t?.description,
      parties: t?.factions || t?.parties || [],
      hooks: t?.plotHooks || [],
    })),
    timeline: h?.eventsTimeline || [],
  };
}

function npcsSlice(active) {
  const s = active || {};
  const culture = s?.config?.dominantCulture || s?.dominantCulture || s?.culture || null;
  const npcs = (s?.npcs || []).map(n => {
    // Engine's `personality` is an object { dominant, flaw, modifier, tell, speech }
    const p = n?.personality;
    const personalityStr = typeof p === 'string' ? p : (p && typeof p === 'object'
      ? [p.dominant, p.flaw && `Flaw: ${p.flaw}`, p.tell && `Tell: ${p.tell}`, p.speech && `Speech: ${p.speech}`]
          .filter(Boolean).join(' · ')
      : null);
    // Engine puts physical attributes under `physical`, NOT `appearance`
    const ph = n?.physical || n?.appearance;
    const appearanceStr = typeof ph === 'string' ? ph : (ph && typeof ph === 'object'
      ? [ph.age && `${ph.age}`, ph.build, ph.feature, ph.clothes].filter(Boolean).join(' · ')
      : null);
    // Engine puts goals under `goal: { short, long }`, NOT `motivation`
    const g = n?.motivation || n?.goal;
    const motivationStr = typeof g === 'string' ? g : (g && typeof g === 'object'
      ? [g.short, g.long].filter(Boolean).join(' — ')
      : null);
    // Engine puts secrets as singular `secret: { what, stakes }` not array `secrets[]`
    const sec = n?.secrets;
    const secretsArr = Array.isArray(sec) ? sec.slice() : [];
    if (n?.secret && typeof n.secret === 'object' && n.secret.what) {
      secretsArr.push(n.secret.stakes
        ? `${n.secret.what} — ${n.secret.stakes}`
        : n.secret.what);
    }
    // Drop empty/blank entries so the SECRETS subsection vanishes when no real
    // content is present (was rendering an empty header strip otherwise).
    const cleanSecrets = secretsArr.filter(x => {
      if (!x) return false;
      if (typeof x === 'string') return x.trim().length > 0;
      if (typeof x === 'object') {
        return !!(x.text || x.description || x.what || x.stakes || x.label);
      }
      return false;
    });
    // Influence might be string label, object, or numeric
    const inf = n?.influence;
    let influenceLabel = null, influenceDescription = null;
    if (typeof inf === 'string') influenceLabel = inf;
    else if (inf && typeof inf === 'object') {
      influenceLabel = inf.label || inf.level || null;
      influenceDescription = inf.description || null;
    }
    // Engine plotHooks is array of strings; titles aren't present as a separate field for some npcs
    const npcRace = n?.race || n?.culture || culture;
    return {
      name: n?.name || 'Unnamed',
      title: n?.title || n?.role || n?.presentation || null,
      race: npcRace,
      gender: n?.gender || null,
      age: n?.age || (n?.physical?.age) || null,
      factionAffiliation: n?.factionAffiliation || n?.faction || n?.category || null,
      factionLabel: labelOfFactionRef(n?.factionAffiliation || n?.faction || n?.category),
      power: n?.power || 0,
      influence: inf,
      influenceLabel,
      influenceDescription,
      blurb: n?.blurb || n?.description || null,
      personality: personalityStr,
      appearance: appearanceStr,
      motivation: motivationStr,
      secrets: cleanSecrets,
      plotHooks: cleanHooks(n?.plotHooks),
      relationships: cleanRelationships(n?.relationships),
    };
  });
  return {
    all:      npcs,
    sorted:   [...npcs].sort((a, b) => (b?.power || 0) - (a?.power || 0)),
    factions: s?.powerStructure?.factions || s?.factions || [],
    npcRelationships: s?.npcRelationships || [],
  };
}

function hooksSlice(active) {
  const s = active || {};
  const hooks = [];
  for (const npc of (s?.npcs || [])) {
    for (const h of (npc?.plotHooks || [])) {
      hooks.push({
        source: 'npc',
        sourceName: npc.name || npc.title || 'NPC',
        hook: h,
        priority: priorityOfHook(h),
        category: categoryOfHook(h),
      });
    }
  }
  for (const c of (s?.conflicts || [])) {
    for (const h of (c?.plotHooks || [])) {
      hooks.push({
        source: 'conflict',
        sourceName: Array.isArray(c.parties) ? c.parties.join(' vs ') : 'Conflict',
        hook: h,
        priority: priorityOfHook(h),
        category: categoryOfHook(h),
      });
    }
  }
  for (const h of (s?.economicState?.safetyProfile?.plotHooks || [])) {
    hooks.push({
      source: 'crime',
      sourceName: 'Underworld',
      hook: h,
      priority: priorityOfHook(h),
      category: categoryOfHook(h),
    });
  }
  for (const h of (s?.economicViability?.plotHooks || [])) {
    hooks.push({
      source: 'crisis',
      sourceName: 'Economic Crisis',
      hook: h,
      priority: priorityOfHook(h),
      category: categoryOfHook(h),
    });
  }
  // Tensions hooks
  for (const t of (s?.history?.currentTensions || [])) {
    for (const h of (t?.plotHooks || [])) {
      hooks.push({
        source: 'tension',
        sourceName: t?.label || t?.type || 'Tension',
        hook: h,
        priority: priorityOfHook(h),
        category: categoryOfHook(h),
      });
    }
  }
  // Relationship hooks
  if (s?.prominentRelationship?.plotHooks) {
    for (const h of s.prominentRelationship.plotHooks) {
      hooks.push({
        source: 'relationship',
        sourceName: s.prominentRelationship?.otherSettlement || 'Neighbour',
        hook: h,
        priority: priorityOfHook(h),
        category: categoryOfHook(h),
      });
    }
  }
  for (const n of (s?.neighbours || s?.neighbourNetwork || [])) {
    for (const h of (n?.plotHooks || [])) {
      hooks.push({
        source: 'relationship',
        sourceName: n?.neighbourName || n?.name || 'Neighbour',
        hook: h,
        priority: priorityOfHook(h),
        category: categoryOfHook(h),
      });
    }
  }
  // History event hooks
  for (const e of (s?.history?.historicalEvents || [])) {
    for (const h of (e?.plotHooks || [])) {
      hooks.push({
        source: 'history',
        sourceName: e?.type || 'Historical event',
        hook: h,
        priority: priorityOfHook(h),
        category: categoryOfHook(h),
      });
    }
  }
  return {
    all:      hooks,
    tensions: s?.history?.currentTensions || [],
  };
}

function relationshipsSlice(active) {
  const s = active || {};
  return {
    internal:        s?.relationships || [],
    interSettlement: s?.interSettlementRelationships || [],
    crossConflicts:  s?.crossSettlementConflicts || [],
    crossNpcContacts: s?.crossSettlementNPCContacts || [],
    crossFactions:   s?.crossFactions || [],
    neighbours:      (s?.neighbourNetwork || s?.neighbours || []).map(n => ({
      name: n?.neighbourName || n?.name || 'Neighbour',
      type: n?.relationshipType || n?.type || null,
      description: n?.description || null,
      hooks: n?.plotHooks || [],
      lastEvent: n?.lastEvent || null,
      flavour: n?.flavour || n?.flavor || null,
    })),
    neighborSingle:  s?.neighborRelationship || null,
    npcs:            s?.npcs || [],
    npcRelationships: s?.npcRelationships || [],
    factions:        s?.powerStructure?.factions || s?.factions || [],
    emergentConditions: s?.emergentConditions || s?.relationships?.emergentConditions || [],
    prominentRelationship: s?.prominentRelationship || null,
  };
}

function appendixSlice(ai) {
  if (!ai) return null;
  return {
    thesis:          ai.thesis || null,
    identityMarkers: ai.identityMarkers || [],
    frictionPoints:  ai.frictionPoints || [],
    connectionsMap:  ai.connectionsMap || [],
    dmCompass:       ai.dmCompass || null,
  };
}

// ── label helpers ────────────────────────────────────────────────────────────

function labelOfThing(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.good || item.name || item.label || '';
}

function labelOfFactionRef(f) {
  if (!f) return '';
  if (typeof f === 'string') return f;
  return f.faction || f.name || f.label || '';
}

function characterSentence(npc) {
  if (!npc) return '';
  if (npc.personality) return firstSentence(npc.personality);
  if (Array.isArray(npc.plotHooks) && npc.plotHooks.length) {
    return labelOfHook(npc.plotHooks[0]);
  }
  return npc.blurb || '';
}

function labelOfHook(h) {
  if (!h) return '';
  if (typeof h === 'string') return h;
  return h.hook || h.text || h.description || h.title || '';
}

/**
 * normSeverity — coerce the engine's severity field into a single string.
 * The engine sometimes emits severity as an array (`['minor', 'major']`),
 * a min/max object (`{ min: 'minor', max: 'major' }`), or just a string.
 * Without normalization, an array renders as "minormajor" because react-pdf
 * joins array children with no separator. Pick the strongest readable form.
 */
function normSeverity(s) {
  if (s == null) return null;
  if (typeof s === 'string') return s;
  if (Array.isArray(s)) {
    const parts = s.map(x => (typeof x === 'string' ? x : (x?.label || x?.value || ''))).filter(Boolean);
    if (parts.length === 0) return null;
    if (parts.length === 1) return parts[0];
    // "minor / major" reads correctly; the worst element is usually last
    return parts.join(' / ');
  }
  if (typeof s === 'object') {
    if (s.label) return s.label;
    if (s.value) return String(s.value);
    if (s.max && s.min && s.max !== s.min) return `${s.min} / ${s.max}`;
    if (s.max) return s.max;
    if (s.min) return s.min;
    if (s.level) return s.level;
    return null;
  }
  return String(s);
}

/**
 * cleanHooks — drop empty entries from a plotHooks array. The engine
 * sometimes emits `[null]` or `[{ hook: '' }]` which made an empty
 * "PLOT HOOKS" header strip render with no body.
 */
function cleanHooks(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(h => {
    if (!h) return false;
    if (typeof h === 'string') return h.trim().length > 0;
    if (typeof h === 'object') {
      return !!(h.hook || h.text || h.description || h.summary || h.title || h.label || h.body || h.content);
    }
    return false;
  });
}

/**
 * normalizeIncomeSources — engine emits incomeSources as either:
 *   - array of { source, percentage }   (percentage = 0..100)
 *   - array of { source, value }        (raw economy units)
 * If percentages don't sum to ~100, treat as raw values and re-derive percent.
 * The bar fill and the label MUST agree, otherwise the page reads broken.
 */
function normalizeIncomeSources(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
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

/**
 * cleanRelationships — drop empty relationship entries (no target name).
 */
function cleanRelationships(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(r => {
    if (!r) return false;
    if (typeof r === 'string') return r.trim().length > 0;
    if (typeof r === 'object') {
      const target = r.with || r.target || r.name;
      const desc = r.description || r.type;
      return !!(target || desc);
    }
    return false;
  });
}

function priorityOfHook(h) {
  if (!h) return null;
  if (typeof h === 'object') return h.priority || null;
  return null;
}

function categoryOfHook(h) {
  if (!h) return null;
  if (typeof h === 'object') return h.category || null;
  return null;
}

function firstSentence(s) {
  if (!s || typeof s !== 'string') return s || '';
  const idx = s.search(/[.!?](\s|$)/);
  if (idx === -1) return s;
  return s.slice(0, idx + 1);
}

export default buildViewModel;
