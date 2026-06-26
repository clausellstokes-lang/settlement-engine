/**
 * aiLayer.js — Narrative Layer AI engine
 *
 * Builds a structured prompt from the full settlement object,
 * calls the Claude API, and returns a structured narrative object:
 * {
 *   thesis:    string,            // 2-3 para settlement character overview
 *   dailyLife: string,            // 3-4 para daily life prose (replaces DailyLifeTab generate)
 *   tabNotes: {                   // per-tab 3-5 sentence coherence addendums
 *     overview, economics, services, power, defense,
 *     npcs, history, resources, viability, plot_hooks
 *   }
 * }
 */

// ── Data extraction ─────────────────────────────────────────────────────────

/**
 * availableServices is a category-keyed object ({ lodging:[], food:[], … }),
 * but some older/edge paths hand back a plain array instead. Normalize either
 * shape into one flat list so callers can slice/map it. An object has no
 * `.slice`, which is the "(s.availableServices || []).slice is not a function"
 * crash this guards against in the AI narrative path.
 */
export function flattenServices(services) {
  if (Array.isArray(services)) return services;
  if (services && typeof services === 'object') return Object.values(services).flat();
  return [];
}

/**
 * Plot hooks arrive in three shapes: economicViability.plotHooks entries are
 * { category, hook, severity } objects whose hook text carries a literal
 * ' PLOT HOOK: ' marker (redundant under the prompt's EMERGING PLOT HOOKS
 * header), history event hooks are plain strings, and the legacy top-level
 * settlement.plotHooks (never written today) used { text } / string. Reduce
 * all of them to clean prompt-ready text; non-strings normalize to ''.
 */
export function normalizePlotHook(h) {
  const text = typeof h === 'string' ? h : (h?.hook ?? h?.text ?? '');
  if (typeof text !== 'string') return '';
  return text.replace(/^\s*PLOT HOOK:\s*/i, '').trim();
}

/**
 * powerStructure.stability is a LABEL ('Stable', 'Ordered (strong military
 * presence)', 'Tense (external threat)', 'Unstable — criminal governance', …;
 * powerGenerator's vocabulary), not a 0-100 score. Rendering it as
 * `${label}/100` produced 'Tense (external threat)/100', and `>= 60` against
 * a string is always false — every settlement's power note claimed contested
 * authority. Branch on the label head; numbers (older saves) keep the old
 * threshold.
 */
const ORDERED_STABILITY_RE = /^(stable|ordered|enforced|rigid)\b/i;

export function isOrderedStability(stability) {
  if (typeof stability === 'number') return stability >= 60;
  return typeof stability === 'string' && ORDERED_STABILITY_RE.test(stability.trim());
}

export function formatStability(stability) {
  if (typeof stability === 'number') return `${stability}/100`;
  return stability || 'unrecorded';
}

export function extractFullContext(s) {
  const cfg  = s.config    || {};
  const eco  = s.economicState || {};
  const via  = s.economicViability || {};
  const dp   = s.defenseProfile || {};
  const ps   = s.powerStructure || {};
  const hist = s.history   || {};
  const sp   = eco.safetyProfile || {};
  const insts = s.institutions || [];
  const npcs  = s.npcs || [];
  const chains = eco.activeChains || [];
  const stresses = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);

  const scores = dp.scores || {};
  const factions = ps.factions || [];
  const governing = factions.find(f => f.isGoverning);
  // Conflicts are written TOP-LEVEL by assembleSettlement (which now also
  // dual-writes them onto powerStructure); reading only ps.conflicts meant
  // every settlement looked conflict-free to the prompt. Prefer the live
  // top-level write, keep ps.conflicts for the dual-written/edge shapes.
  const conflicts = s.conflicts || ps.conflicts || [];
  const tensions  = hist.currentTensions || [];
  const instNames = insts.map(i => i.name);
  const instByCat = insts.reduce((acc, i) => {
    (acc[i.category] = acc[i.category] || []).push(i.name);
    return acc;
  }, {});

  const fb = via.metrics?.foodBalance;
  // Missing data must stay neutral — defaulting to 'food self-sufficient'
  // let the AI assert self-sufficiency for settlements with no food ledger.
  // fb.surplus is an ABSOLUTE lb/day quantity (economicGenerator), not a
  // percent — derive the percent from dailyNeed; the deficit branch already
  // carries a real percent in deficitPercent. Coverage (mundane imports +
  // magical offset) is attributed explicitly, matching generate-narrative's
  // summarizeFoodSituation.
  const foodCover = (fb?.importCoverage || 0) + (fb?.magicFoodOffset || 0);
  const coverNote = foodCover > 0
    ? ` (imports${(fb?.magicFoodOffset || 0) > 0 ? '/magic' : ''} cover ${Math.round(foodCover)} lb/day)`
    : '';
  const surplusPct = fb?.dailyNeed > 0 ? Math.round(((fb.surplus || 0) / fb.dailyNeed) * 100) : null;
  const foodSituation = fb
    ? (fb.deficit
      ? `${Math.round(fb.deficitPercent || 0)}% food deficit${coverNote}`
      : (surplusPct != null
        ? `${surplusPct}% food surplus${coverNote}`
        : `food surplus of ${Math.round(fb.surplus || 0)} lb/day${coverNote}`))
    : 'food situation unrecorded';

  return {
    // Identity
    name:       s.name || 'Settlement',
    tier:       s.tier || 'village',
    population: s.population,
    culture:    cfg.culture || null,
    terrain:    cfg.terrainOverride || null,
    tradeRoute: cfg.tradeRouteAccess || 'road',

    // Stress
    stresses: stresses.map(st => st?.label || st?.type).filter(Boolean),

    // Economy
    prosperity:   via.summary?.split(/[—:]/)[0]?.trim() || null,
    econScore:    Math.round(eco.compound?.economyOutput ?? scores.economic ?? 50),
    chains:       chains.map(c => `${c.label || c.chainId} (${c.status || 'ok'})`).slice(0, 8),
    // incomeSources live on economicState (economicGenerator's return), NOT
    // on the viability report — via.incomeSources never exists, so this
    // always rendered 'Income sources: 0'. via kept as a legacy fallback.
    incomeSources: (eco.incomeSources || via.incomeSources)?.length || 0,
    foodSituation,
    tradeDeps:    eco.tradeDependencies
      ?.filter(d => d.severity === 'critical')
      .map(d => d.institution).slice(0, 4) || [],

    // Safety
    safetyLabel:  sp.safetyLabel || null,
    safetyScore:  Math.round(scores.internal ?? 50),
    // crimeTypes entries are { type, desc } objects (safetyProfile) —
    // joining them raw rendered '[object Object]' in the prompt.
    crimeTypes:   (sp.crimeTypes || []).slice(0, 4).map(c => c?.type || c).filter(Boolean),
    criminalInsts: (instByCat.Criminal || []).slice(0, 3),

    // Defense
    defense:      dp.readiness?.label || null,
    milScore:     Math.round(scores.military ?? 50),
    walls:        instNames.filter(n => /wall|gate|fortif|palisade/i.test(n)).slice(0, 2),
    garrison:     instNames.filter(n => /garrison|barracks|soldier|knight/i.test(n)).slice(0, 2),

    // Power
    governing:    governing ? `${governing.faction} (${governing.power}%)` : 'none',
    govCat:       governing?.category || null,
    stability:    ps.stability ?? null,
    factionCount: factions.length,
    factions:     factions.slice(0, 5).map(f => `${f.faction} (${f.power}%)`),
    // Conflict entries are { parties, issue, stakes, desc, … } (powerGenerator's
    // generateConflicts) — description/type exist only on legacy/edge shapes.
    conflicts:    conflicts.slice(0, 3).map(c => c.desc || c.description || c.issue || c.type).filter(Boolean),
    tensions:     tensions.slice(0, 3).map(t => t.title || t.type).filter(Boolean),

    // NPCs
    npcsCount:    npcs.length,
    keyNPCs:      npcs.filter(n => n.influence === 'high').slice(0, 5).map(n => `${n.name} (${n.role})`),
    relationships: (s.relationships || []).filter(r => ['rival','enemy','ally'].includes(r.type)).length,

    // History
    age:              hist.age || null,
    historicalChar:   hist.historicalCharacter || null,
    eventTypes:       [...new Set((hist.historicalEvents || []).map(e => e.type))].slice(0, 5),
    siegeNarrative:   hist.siegeNarrative || null,

    // Services & Resources
    services:       flattenServices(s.availableServices).slice(0, 8).map(svc => svc?.name || svc),
    resources:      (s.resourceAnalysis?.nearbyResources || []).slice(0, 5),
    // via.metrics has no criticalImports key (only foodBalance/tradeAccess/
    // counts) — the live critical-imports source is economicState.
    // necessityImports: plain strings ('Grain', 'Salt', …), stress-augmented
    // by economicGenerator (siege/famine push Grain+Salt, plague pushes
    // Medicinal herbs). via.metrics kept as a legacy fallback.
    criticalImports: (eco.necessityImports || via.metrics?.criticalImports || []).slice(0, 3),

    // Viability
    viable:       via.viable,
    viabilitySummary: via.summary || null,
    criticalIssues: (via.issues || []).filter(i => i.severity === 'critical').map(i => i.title).slice(0, 3),

    // Magic
    magic:        cfg.priorityMagic || 0,
    magicInsts:   (instByCat.Magic || []).slice(0, 3),

    // Institutions by category (key ones)
    govInsts:     (instByCat.Government || []).slice(0, 3),
    infraInsts:   (instByCat.Infrastructure || []).slice(0, 3),
    econInsts:    (instByCat.Economy || []).slice(0, 4),
    craftsInsts:  (instByCat.Crafts || []).slice(0, 4),
    defenseInsts: (instByCat.Defense || []).slice(0, 3),
    religionInsts:(instByCat.Religious || []).slice(0, 3),
    // settlement.plotHooks is never written — the live hooks are
    // economicViability.plotHooks ({ category, hook, severity } objects) and
    // the per-event history.historicalEvents[].plotHooks (strings). Merge
    // both (top-level kept as a legacy fallback), normalize to plain text,
    // dedupe, and cap at 4 to keep the prompt budget where it was.
    plotHooks:    [...new Set([
      ...(via.plotHooks || []),
      ...(hist.historicalEvents || []).flatMap(e => e?.plotHooks || []),
      ...(s.plotHooks || []),
    ].map(normalizePlotHook).filter(Boolean))].slice(0, 4),

    // Spatial
    quarters:     (s.spatialLayout?.quarters || []).map(q => q.name).slice(0, 6),
  };
}

// ── Prompt builder ──────────────────────────────────────────────────────────

export function buildAiLayerPrompt(ctx) {
  const lines = [];

  lines.push('SETTLEMENT DATA');
  lines.push(`Name: ${ctx.name}`);
  lines.push(`Tier: ${ctx.tier}${ctx.population ? ` — population ~${ctx.population.toLocaleString('en-US')}` : ''}`);
  if (ctx.culture)    lines.push(`Culture: ${ctx.culture}`);
  if (ctx.terrain)    lines.push(`Terrain: ${ctx.terrain}`);
  lines.push(`Trade access: ${ctx.tradeRoute}`);
  if (ctx.stresses.length) lines.push(`Active stresses: ${ctx.stresses.join(', ')}`);
  if (ctx.quarters.length) lines.push(`Districts/Quarters: ${ctx.quarters.join(', ')}`);

  lines.push('\nPOWER & GOVERNANCE');
  lines.push(`Governing: ${ctx.governing}${ctx.govCat ? ` [${ctx.govCat}]` : ''}`);
  lines.push(`Political stability: ${formatStability(ctx.stability)}`);
  lines.push(`Factions (${ctx.factionCount}): ${ctx.factions.join('; ')}`);
  if (ctx.conflicts.length) lines.push(`Conflicts: ${ctx.conflicts.join('; ')}`);
  if (ctx.tensions.length)  lines.push(`Current tensions: ${ctx.tensions.join('; ')}`);

  lines.push('\nECONOMY & TRADE');
  lines.push(`Economic score: ${ctx.econScore}/100 — ${ctx.foodSituation}`);
  lines.push(`Income sources: ${ctx.incomeSources}`);
  if (ctx.chains.length) lines.push(`Active supply chains: ${ctx.chains.join(', ')}`);
  if (ctx.tradeDeps.length) lines.push(`Critical import dependencies: ${ctx.tradeDeps.join(', ')}`);
  if (ctx.criticalImports.length) lines.push(`Critical imports: ${ctx.criticalImports.join(', ')}`);

  lines.push('\nSAFETY & DEFENSE');
  lines.push(`Safety: ${ctx.safetyLabel || ctx.safetyScore+'/100'}`);
  lines.push(`Defense posture: ${ctx.defense || 'unrated'} — military score ${ctx.milScore}/100`);
  if (ctx.walls.length)    lines.push(`Fortifications: ${ctx.walls.join(', ')}`);
  if (ctx.garrison.length) lines.push(`Military presence: ${ctx.garrison.join(', ')}`);
  if (ctx.crimeTypes.length) lines.push(`Crime types: ${ctx.crimeTypes.join(', ')}`);
  if (ctx.criminalInsts.length) lines.push(`Criminal institutions: ${ctx.criminalInsts.join(', ')}`);

  lines.push('\nINSTITUTIONS');
  if (ctx.govInsts.length)    lines.push(`Government: ${ctx.govInsts.join(', ')}`);
  if (ctx.econInsts.length)   lines.push(`Economy: ${ctx.econInsts.join(', ')}`);
  if (ctx.craftsInsts.length) lines.push(`Crafts: ${ctx.craftsInsts.join(', ')}`);
  if (ctx.defenseInsts.length)lines.push(`Defense: ${ctx.defenseInsts.join(', ')}`);
  if (ctx.religionInsts.length)lines.push(`Religious: ${ctx.religionInsts.join(', ')}`);
  if (ctx.infraInsts.length)  lines.push(`Infrastructure: ${ctx.infraInsts.join(', ')}`);
  if (ctx.magicInsts.length)  lines.push(`Magic: ${ctx.magicInsts.join(', ')} (priority ${ctx.magic}/100)`);
  if (ctx.services.length)    lines.push(`Available services: ${ctx.services.join(', ')}`);

  lines.push('\nNPCS & RELATIONSHIPS');
  lines.push(`${ctx.npcsCount} NPCs total — ${ctx.relationships} rivalries/alliances`);
  if (ctx.keyNPCs.length) lines.push(`Key figures: ${ctx.keyNPCs.join('; ')}`);

  lines.push('\nHISTORY');
  if (ctx.age) lines.push(`Age: ~${ctx.age} years — ${ctx.historicalChar || 'varied history'}`);
  if (ctx.eventTypes.length) lines.push(`Event history: ${ctx.eventTypes.join(', ')}`);
  if (ctx.siegeNarrative) lines.push(`Historical memory: ${ctx.siegeNarrative}`);

  lines.push('\nRESOURCES & VIABILITY');
  if (ctx.resources.length) lines.push(`Nearby resources: ${ctx.resources.join(', ')}`);
  lines.push(`Economic viability: ${ctx.viabilitySummary || (ctx.viable ? 'viable' : 'not viable')}`);
  if (ctx.criticalIssues.length) lines.push(`Critical issues: ${ctx.criticalIssues.join('; ')}`);

  if (ctx.plotHooks.length) {
    lines.push('\nEMERGING PLOT HOOKS');
    ctx.plotHooks.forEach(h => lines.push(`- ${h}`));
  }

  lines.push('\n---');
  lines.push(`\nYou are a worldbuilding consultant for a tabletop RPG dungeon master.`);
  lines.push(`The settlement above was generated by a procedural engine. Each system (economy, power, defense, history, NPCs) ran independently. Your job is to find the threads that connect them, surface the coherent story they tell together, and add the narrative layer that makes this feel like a real place rather than a collection of stats.`);
  lines.push(`\nReturn ONLY valid JSON — no markdown, no code fences, no preamble. The JSON must have this exact structure:`);
  lines.push(`{
  "thesis": "2-3 paragraphs. The defining character of this settlement — what kind of place it is, what its central tension is, and how its systems interact. Written for a DM who needs to run this place in 10 minutes. Grounded and specific, not generic.",
  "dailyLife": "3-4 paragraphs. What is it like to be an ordinary person here? Not the political structure — the texture of daily existence. Food, safety, governance as felt from the street, the rhythm of the week. Weave in terrain, culture, and trade access as physical and social realities. Show how conditions interact — a criminal faction + unstable government + food shortage reads differently from the same criminal faction in a prosperous stable city.",
  "tabNotes": {
    "overview": "3-5 sentences. What the overview data reveals when read as a whole — the key tension or coherence that ties together the settlement identity, economics, and safety profile.",
    "economics": "3-5 sentences. What the economic picture means for this specific settlement — how its supply chains, income sources, and trade dependencies create its particular kind of wealth or precarity.",
    "services": "3-5 sentences. What the available services say about who this settlement serves and who it excludes. What is conspicuously absent given the tier and prosperity level.",
    "power": "3-5 sentences. How the faction dynamics, stability level, and conflicts create the specific political texture here — not just that factions exist, but what the balance between them means in practice.",
    "defense": "3-5 sentences. What the defense posture means for how people actually live — not military capability as an abstract score, but the lived experience of walls, watches, garrisons, and threat level.",
    "npcs": "3-5 sentences. How the key figures connect to the settlement systems — which NPCs are the human face of the economic, political, or criminal dynamics at play.",
    "history": "3-5 sentences. How the historical events, the historical character, and the current tensions connect — what the past reveals about the present situation.",
    "resources": "3-5 sentences. What the resource situation means for this settlement's economic identity and vulnerability — which resources define it and which absences shape its dependencies.",
    "viability": "3-5 sentences. What the viability picture means as a whole — not just the score, but the pattern of what works, what strains, and what the settlement is doing about it.",
    "plot_hooks": "3-5 sentences. What the emerging plot hooks have in common — the underlying tensions they all draw from, and which hook is most deeply rooted in the settlement systems."
  }
}`);

  return lines.join('\n');
}

// ── Local fallback ───────────────────────────────────────────────────────────

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function cloneSettlement(settlement) {
  try {
    return structuredClone(settlement);
  } catch {
    return JSON.parse(JSON.stringify(settlement || {}));
  }
}

function joinList(items, fallback) {
  const clean = (items || []).filter(Boolean);
  if (!clean.length) return fallback;
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(', ')} and ${clean.at(-1)}`;
}

function buildLocalThesis(ctx) {
  const governing = ctx.governing && ctx.governing !== 'none'
    ? `Power gathers around ${ctx.governing}`
    : 'Power is diffuse enough that daily authority has to be negotiated in public';
  const economy = ctx.viabilitySummary || ctx.prosperity || 'a practical economy with visible constraints';
  const stress = ctx.stresses.length
    ? `Its visible strain is ${joinList(ctx.stresses, 'pressure from several directions')}.`
    : 'Its pressure points are quieter: habit, dependency, and the ordinary cost of keeping people fed.';

  return `${ctx.name} reads as a ${ctx.tier} whose identity comes from the collision between governance, trade, and survival. ${governing}, while the economy presents as ${economy}. ${stress}\n\nFor a DM, the useful angle is not a single villain or single resource, but the pattern: institutions are doing enough to keep the settlement legible, while shortages, loyalties, and public order decide which promises people believe.`;
}

function buildLocalDailyLife(ctx) {
  const food = ctx.foodSituation || 'ordinary food security';
  const safety = ctx.safetyLabel || `${ctx.safetyScore}/100 safety`;
  const services = joinList(ctx.services.slice(0, 4), 'the market, shrine, workshop, and public well');

  return `Morning gathers around ${services}. People learn the day by watching who arrives early, which doors stay shut, and whether prices move before noon.\n\nFood feels like ${food}, and safety feels like ${safety}. Those facts shape small choices: when children are sent on errands, how loudly debts are discussed, and whether strangers are treated as opportunity or trouble.\n\nBy evening, the settlement narrows into familiar rooms and repeated bargains. News travels faster than law, reputation does more work than paperwork, and the public mood is set by whoever can make tomorrow feel predictable.`;
}

function buildLocalNotes(ctx) {
  return {
    overview: `${ctx.name} is best read through its central balance: ${ctx.viabilitySummary || 'the settlement keeps functioning, but not without tradeoffs'}. The important table-facing question is who benefits from that balance and who absorbs the cost.`,
    economics: `The economic picture turns on ${ctx.foodSituation || 'food supply'} and ${joinList(ctx.chains, 'local production')}. Shortages and trade dependencies should show up as prices, favors, and pressure on marginal households.`,
    services: `The service mix points to who the settlement is built to serve. ${joinList(ctx.services.slice(0, 5), 'Basic civic services')} define the visible public life, while any absence at this tier is a useful adventure hook.`,
    power: `${ctx.governing || 'No single faction'} sets the political texture. Stability of '${formatStability(ctx.stability)}' means authority should feel ${isOrderedStability(ctx.stability) ? 'recognizable and procedural' : 'personal, contested, and frequently renegotiated'}.`,
    defense: `Defense is ${ctx.defense || 'uneven'}. Use that as a lived detail: gates, watches, drills, avoided roads, or the simple fact that some people know exactly where to run.`,
    npcs: `Key figures should personify systems rather than merely decorate them. ${joinList(ctx.keyNPCs, 'Local notables')} are strongest when each one reveals a pressure point in economy, power, faith, or safety.`,
    history: `The past matters because it explains what people think is normal. ${ctx.historicalChar || 'The settlement history'} should color how residents interpret every current threat or opportunity.`,
    resources: `Resources define both pride and vulnerability. ${joinList(ctx.resources, 'Local materials')} can be treated as the reason outsiders care, while missing imports explain who has leverage.`,
    viability: `${ctx.viabilitySummary || 'Viability is mixed'}. Translate the abstract result into queues, delayed repairs, political excuses, and household-level compromises.`,
    plot_hooks: `The strongest hooks grow from the same systems that shape ordinary life. ${joinList(ctx.plotHooks, 'Local tensions')} should feel like symptoms of the settlement, not events pasted on top.`,
  };
}

function buildLocalCompass(ctx) {
  return {
    hooks: ctx.plotHooks.slice(0, 3),
    redFlags: [
      ...(ctx.criticalIssues || []),
      ...(ctx.tradeDeps || []).map(dep => `Critical dependency: ${dep}`),
    ].slice(0, 4),
    twist: ctx.conflicts?.[0] || ctx.tensions?.[0] || 'The public story of who keeps the settlement stable is probably incomplete.',
  };
}

export async function runAiLayer(settlement, onProgress) {
  const ctx    = extractFullContext(settlement);
  const _prompt = buildAiLayerPrompt(ctx);

  onProgress?.('Reading the settlement…');
  await delay(200);

  onProgress?.('Weaving the narrative…');
  await delay(200);

  const base = cloneSettlement(settlement);
  const narrativeNotes = buildLocalNotes(ctx);

  return {
    ...base,
    thesis: buildLocalThesis(ctx),
    dailyLife: buildLocalDailyLife(ctx),
    tabNotes: narrativeNotes,
    narrativeNotes,
    dmCompass: buildLocalCompass(ctx),
    identityMarkers: [
      ctx.governing && ctx.governing !== 'none' ? `Governed by ${ctx.governing}` : null,
      ctx.foodSituation,
      ctx.defense ? `Defense posture: ${ctx.defense}` : null,
      ctx.magicInsts.length ? `Magic institutions: ${joinList(ctx.magicInsts, 'none')}` : null,
    ].filter(Boolean),
    frictionPoints: [
      ...ctx.conflicts,
      ...ctx.tensions,
      ...ctx.criticalIssues,
    ].filter(Boolean).slice(0, 6),
    connectionsMap: [
      ...(ctx.keyNPCs || []).slice(0, 3).map(npc => `${npc} reflects the settlement's public pressures.`),
      ...(ctx.factions || []).slice(0, 3).map(faction => `${faction} has visible leverage in civic life.`),
    ],
  };
}
