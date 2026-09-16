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
import { plotHookText } from '../../lib/proseSeams.js';
import { collectPlotHooks } from '../../domain/dossier/plotHooks.js';
import { deriveFoodBalance, deriveViability } from '../../domain/display/dossierViewModel.js';
import { isViabilityItem } from '../../domain/display/viabilityFilter.js';
import { summarizeMagic, deriveMagicProfile } from '../../domain/magicProfile.js';
import { humanize } from './format.js';
import { buildPdfLiveWorld } from './liveWorld.js';
import { directionalRelationshipLabel } from '../../domain/relationships/canonicalRelationship.js';
import { buildDossierEntityIndex, entityIdFor, slugifyEntity } from '../../domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../lib/entities.js';
import { ownerGenerationContracts } from './generationContracts.js';
// The four settlement-body chapters and the shared small readers moved out under
// THE DECOMPOSITION WAVE (lane D); buildViewModel below still calls them in the
// same order with the same arguments.
import { economicsSlice, defenseSlice, servicesSlice, resourcesSlice } from './viewModelBodySlices.js';
import { stressArray, foodCore, avgScore } from './viewModelPrimitives.js';

// Human labels for the publicLegitimacy breakdown factors
// (factionDynamics.computePublicLegitimacy emits { prosperity, safety, defense,
// food }). ScoreWithBreakdown prints "<±delta> <label>"; any unmapped key falls
// back to humanize() so a new factor still reads as a Title-Case word.
const LEGITIMACY_FACTOR_LABELS = {
  prosperity: 'Prosperity',
  safety:     'Safety',
  defense:    'Defense',
  food:       'Food security',
};

const TIER_LABELS = {
  thorp: 'Thorp', hamlet: 'Hamlet', village: 'Village',
  town: 'Town', city: 'City', metropolis: 'Metropolis',
};


/**
 * Coerce a prose value that may be a string, a {primary, ...} object, or an
 * array into a single string safe to hand to <Text> (which throws / garbles on
 * objects). Mirrors historySlice's settlementReason handling.
 */
function coerceProse(v) {
  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return v.filter(Boolean).join('\n') || null;
  if (typeof v === 'object') return v.primary || null;
  return String(v);
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
  // The LIVE campaign world for this settlement ({ worldState, regionalGraph,
  // settlements?, nameById? }). Threaded ONLY for premium exports. When absent /
  // dormant the liveWorld slice resolves to `null` — so a non-campaign / free /
  // anon export is byte-identical (the Faith & War chapter renders nothing, and
  // SettlementPDF additionally gates it on the faith premium seam).
  campaign = null,
} = /** @type {{ settlement?: any, aiSettlement?: any, aiDailyLife?: any, narrativeMode?: boolean, systemState?: any, eventLog?: any[], phase?: string, campaign?: any }} */ ({})) {
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
    // Live campaign slice for the Faith & War chapter. `null` off-campaign /
    // dormant ⇒ chapter renders nothing.
    liveWorld: buildPdfLiveWorld({ settlement: raw, campaign }),

    // Entity index the PDF EntityRef primitive resolves ⟦entity:…⟧ tokens
    // against (NotableNPCs / Institutions / NPCQuickRef read vm.entityIndex).
    // Built from the canonical `raw` save so ids are stable across the raw/ai
    // pair; additive (derived from existing fields), so a non-narrative export
    // is byte-identical except for the additive in-PDF <Link> anchors. When a
    // token's id does not resolve, EntityRef degrades to plain <Text>.
    entityIndex:   buildDossierEntityIndex(raw),

    summary:       summarySlice(active, ai, useAi, aiDailyLife),
    // Identity prose may follow the selected raw/AI presentation, but generation
    // contracts are owner facts from the canonical save. Passing both prevents a
    // partial AI overlay from hiding or rewriting the culture/coherence receipt.
    identity:      identitySlice(active, raw),
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

function identitySlice(s, canonical = s) {
  const ec = s?.economicState || {};
  const dp = s?.defenseProfile || {};
  const sp = ec?.safetyProfile || {};
  // A+ P1.8: source food via the shared deriveFoodBalance (clamped, screen-parity),
  // not the raw unclamped metrics.foodBalance — the anchor mirrors DailyLifeTab, so
  // it must show the same number the screen + the PDF overview do (one source per fact).
  const food = deriveFoodBalance(s);
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
    ...ownerGenerationContracts(canonical, s),
    quarters:       (s?.spatialLayout?.quarters || []).map(q => ({
      name: q?.name || 'Quarter',
      // engine field is `desc`; the old `description`-only read printed nothing.
      description: q?.desc || q?.description || null,
      landmarks: q?.landmarks || [],
    })),
    // Anchor facts (mirror DailyLifeTab anchor panel)
    anchor: {
      governingName:  governing?.faction || governing?.name || null,
      prosperity:     ec?.prosperity || null,
      complexity:     ec?.economicComplexity || null,
      safety:         sp?.safetyLabel || null,
      foodDeficit:    food.deficit ?? null,
      foodSurplus:    food.surplus ?? null,
      culturalNotes:  canonical?.culturalNotes ?? s?.culturalNotes ?? null,
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
      description: q?.desc || q?.description || null,
      landmarks: q?.landmarks || [],
    })),
    // Coerce: settlementReason can be an object ({primary,...}); handing that raw
    // to <Text> crashes/garbles the whole export.
    settlementReason:   coerceProse(s?.settlementReason),
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
    // coherenceNotes/structuralSuggestions live at the settlement root, not on
    // economicViability — the old v?.* reads were always empty in the PDF.
    coherenceNotes:    s?.coherenceNotes || v?.coherenceNotes || [],
    structuralSuggestions: s?.structuralSuggestions || v?.structuralSuggestions || [],
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
    // Phase-D anchor identity — the canonical faction id (snake) the index keys
    // factions by and an NPC's `factionLink` resolves to. The faction card uses
    // it to set its own anchor target; mentions elsewhere link to it.
    id:          factionIdFromName(f?.faction || f?.name || f?.label) || null,
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
    // The engine emits breakdown as an object map ({ factor: delta }); normalize
    // to the stable array the section iterates. Each factor carries a human
    // `label` (ScoreWithBreakdown prints "<±delta> <label>", e.g. "+12 Prosperity")
    // — without it the chip rendered a bare delta with nothing naming what
    // contributed. Labels match the derivation factors in
    // factionDynamics.computePublicLegitimacy (prosperity / safety / defense /
    // food security) and the PDF section's title-case voice.
    legitimacyBreakdown: Array.isArray(s?.powerStructure?.publicLegitimacy?.breakdown)
      ? s.powerStructure.publicLegitimacy.breakdown
      : Object.entries(s?.powerStructure?.publicLegitimacy?.breakdown || {})
          .map(([key, delta]) => ({ key, delta, label: LEGITIMACY_FACTOR_LABELS[key] || humanize(key) })),
    governanceFractured: !!s?.powerStructure?.publicLegitimacy?.governanceFractured,
    criminalCapture: s?.powerStructure?.criminalCaptureState || null,
    governmentType:  s?.powerStructure?.governmentType || s?.governmentType || null,
    // Rule & Succession lineage — the conquest/coup provenance the engine records
    // on `previousGovernments` (warDeployment mints a `conquest`-cause transfer
    // when a siege falls). Self-gating: an empty array renders nothing, so a
    // settlement with no regime history is byte-identical.
    lineage: (Array.isArray(s?.powerStructure?.previousGovernments)
      ? s.powerStructure.previousGovernments
      : []).map(g => ({
        government: g?.government || g?.governingName || g?.name || null,
        cause: g?.cause || null,
        tick: Number.isFinite(g?.tick) ? g.tick : null,
        by: g?.by || g?.successor || null,
      })).filter(g => g.government || g.cause),
    conflicts,
    tensions,
  };
}






// Arcane supply chains (mirrors computeActiveChains' arcane detection) — the
// PDF Viability chapter renders these as "magically sustained" tags.
const ARCANE_CHAIN_IDS = ['alchemy', 'spellcasting', 'magical_goods', 'planar'];
function isArcaneChain(ch) {
  const id = String(ch?.chainId || ch?.id || '').toLowerCase();
  const label = String(ch?.label || '').toLowerCase();
  return ARCANE_CHAIN_IDS.some(a => id.includes(a)) || /arcane|magic|spell/.test(label);
}

function viabilitySlice(active) {
  const s = active || {};
  const v = s?.economicViability || {};
  const dp = s?.defenseProfile || {};
  const stress = stressArray(s);

  // The engine doesn't emit stressConsequences / byDesignContradictions /
  // activeMagicChains directly — derive them the same way the web ViabilityTab
  // does, and exclude the special-typed issues from the main list so they don't
  // render twice (they get their own PDF sections).
  const stressConsequences = [...(v.issues || []), ...(v.warnings || [])].filter(i => i?.type === 'stress_consequence');
  // pdf-3: by_design items are pushed to the settlement-root structuralViolations
  // (structuralValidator), NOT economicViability.issues — so the old issues-only
  // filter was permanently empty and those authored plot seeds printed as garbled
  // STRUCTURAL VIOLATIONS. Derive from the real home (union v.issues for any path
  // that routes them there), and exclude them from the violations list below.
  const byDesignContradictions = [...(v.issues || []), ...(s?.structuralViolations || [])]
    .filter(i => i?.severity === 'by_design');
  const activeMagicChains = (s?.economicState?.activeChains || []).filter(isArcaneChain);

  // Magic legality facets — the 10-facet magic profile summarized
  // for the Viability/Identity chapter, via the SAME summarizeMagic the screen
  // Magic sub-tab reads. Self-gating: a dead-magic world (magicExists === false)
  // yields { exists:false, lines:[] } ⇒ the section renders nothing extra, so a
  // no-magic save is byte-identical. The profile is `null` for a null settlement.
  const magicProf = deriveMagicProfile(s);
  const magicProfile = magicProf
    ? {
        exists: magicProf.magicExists !== false,
        legality: magicProf.legality || null,
        availability: magicProf.availability || null,
        institutionalControl: magicProf.institutionalControl || null,
        lines: magicProf.magicExists === false ? [] : summarizeMagic(s),
      }
    : { exists: false, legality: null, availability: null, institutionalControl: null, lines: [] };

  return {
    viable:                v.viable,
    verdict:               v?.verdict || (v?.viable === true ? 'viable' : v?.viable === false ? 'notViable' : null),
    verdictTone:           VIABILITY_TONE[(v?.verdict || '').toLowerCase()] || (v?.viable === true ? 'good' : v?.viable === false ? 'bad' : 'muted'),
    summary:               viabilitySummaryFor(s),
    metrics:               v.metrics || {},
    // pdf-6: honour the web's curated routing — dependency/resource-chain/
    // opportunity/food items live in Economics & Resources, not Viability, and
    // must not double-print here. Shared predicate with ViabilityTab.
    issues:                (v.issues || [])
      .filter(iss => iss?.severity !== 'by_design' && iss?.type !== 'stress_consequence' && isViabilityItem(iss))
      .map(iss => ({
        severity: iss?.severity,
        title: iss?.title,
        description: iss?.description,
        institution: iss?.institution,
        priorityNote: iss?.priorityNote,
        suggestedFixes: iss?.suggestedFixes || [],
      })),
    criticalIssues:        v?.criticalIssues || (v?.issues || []).filter(i => (i?.severity || '').toLowerCase() === 'critical' && i?.type !== 'stress_consequence'),
    // pdf-6 (golden): warnings honour the Viability filter — dependency/food/
    // resource-chain items belong to Economics, not here.
    warnings:              [...(v?.warnings || []), ...(s?.warnings || [])].filter(isViabilityItem),
    // pdf-3 (main): by_design tensions are surfaced as plot seeds (byDesignContradictions),
    // so exclude them here — they must not double-print as apparent defects.
    structuralViolations:  (s?.structuralViolations || []).filter(x => x?.severity !== 'by_design'),
    stress:                stress.map(x => ({ label: x?.label || x?.icon, summary: x?.summary, hook: x?.crisisHook })),
    stressConsequences:    v?.stressConsequences?.length ? v.stressConsequences : stressConsequences,
    magicDependency:       !!dp?.magicDependency,
    activeMagicChains:     v?.activeMagicChains?.length ? v.activeMagicChains : activeMagicChains,
    byDesignContradictions: v?.byDesignContradictions?.length ? v.byDesignContradictions : byDesignContradictions,
    magicProfile,
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
    // Phase-D anchor identity. `id` keys this NPC's card anchor (matches the
    // index entry built off the SAME raw npc); `factionLink` is the canonical
    // faction id (== a faction card's id) the NPC's stated affiliation resolves
    // to, so the affiliation chip can link to that faction with no name match.
    const factionRefName = labelOfFactionRef(n?.factionAffiliation || n?.faction || n?.category);
    return {
      id: n?.id || entityIdFor('npc', n),
      factionLink: factionRefName ? factionIdFromName(factionRefName) : null,
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

// Map the on-screen plot-hook CATEGORY (collectPlotHooks) to the PDF section's
// SOURCE group key (PlotHooks.jsx groups + labels by `source`). Keeps the two
// surfaces rendering the SAME hooks from the SAME aggregator.
const HOOK_CATEGORY_TO_SOURCE = Object.freeze({
  npc: 'npc',
  faction: 'conflict',
  tension: 'tension',
  economics: 'crisis',
  safety: 'crime',
  history: 'history',
  relationship: 'relationship',
});

// collectPlotHooks priority is a 0–9 NUMBER; the PDF section keys its priority
// dot/tag off a BAND string (PRIORITY_TONE in PlotHooks.jsx).
function hookPriorityBand(n) {
  if (n >= 8) return 'high';
  if (n >= 6) return 'medium';
  return 'low';
}

function hooksSlice(active) {
  const s = active || {};
  // PARITY: the on-screen Plot Hooks tab and the PDF chapter now BOTH derive from
  // the shared aggregator (domain/dossier/plotHooks.collectPlotHooks) — same seven
  // sources, same `PLOT HOOK:`-prefix cleanup, same priority sort. The previous
  // hand aggregation here used a different source set (neighbour/prominent-
  // relationship hooks instead of settlement.relationships), no sort, no cleanup,
  // and a priority that was null for every plain-string hook. We adapt the shared
  // output to the PDF section's {source, sourceName, hook, priority, category} shape.
  const all = collectPlotHooks(s).map((h) => ({
    source: HOOK_CATEGORY_TO_SOURCE[h.category] || 'other',
    sourceName: h.source,
    hook: h.text,
    priority: hookPriorityBand(h.priority),
    category: h.category,
  }));
  return {
    all,
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
    neighbours:      (s?.neighbourNetwork || s?.neighbours || []).map(n => {
      const name = n?.neighbourName || n?.name || 'Neighbour';
      return {
        // Phase-D anchor identity — matches the index's neighbourIdFor (the
        // entry's own id, or a name-derived `neighbour.<slug>`). The card sets
        // this as its anchor target; trade partners resolve to it.
        id: n?.id || `neighbour.${slugifyEntity(name)}`,
        name,
        type: n?.relationshipType || n?.type || null,
        // For the asymmetric pairs (overlord/vassal, patron/client), the
        // directional label states WHICH SIDE this settlement is, naming the
        // neighbour ("Overlord of X"); null for symmetric links / legacy rows,
        // so the card keeps its plain titled label.
        directionalLabel: directionalRelationshipLabel(n, name),
        description: n?.description || null,
        hooks: n?.plotHooks || [],
        lastEvent: n?.lastEvent || null,
        flavour: n?.flavour || n?.flavor || null,
      };
    }),
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
  return plotHookText(h);
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
  return arr.filter(h => plotHookText(h).trim().length > 0);
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

function firstSentence(s) {
  if (!s || typeof s !== 'string') return s || '';
  const idx = s.search(/[.!?](\s|$)/);
  if (idx === -1) return s;
  return s.slice(0, idx + 1);
}

export default buildViewModel;
