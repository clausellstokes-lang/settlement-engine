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

function extractFullContext(s) {
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
  const conflicts = ps.conflicts || [];
  const tensions  = hist.currentTensions || [];
  const instNames = insts.map(i => i.name);
  const instByCat = insts.reduce((acc, i) => {
    (acc[i.category] = acc[i.category] || []).push(i.name);
    return acc;
  }, {});

  const fb = via.metrics?.foodBalance;
  const foodSituation = fb
    ? (fb.deficit
      ? `${Math.round(fb.deficitPercent || 0)}% food deficit`
      : `${Math.round(fb.surplus || 0)}% food surplus`)
    : 'food self-sufficient';

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
    prosperity:   via.summary?.split('—')[0]?.trim() || null,
    econScore:    Math.round(eco.compound?.economyOutput ?? scores.economic ?? 50),
    chains:       chains.map(c => `${c.label || c.chainId} (${c.status || 'ok'})`).slice(0, 8),
    incomeSources: via.incomeSources?.length || 0,
    foodSituation,
    tradeDeps:    eco.tradeDependencies
      ?.filter(d => d.severity === 'critical')
      .map(d => d.institution).slice(0, 4) || [],

    // Safety
    safetyLabel:  sp.safetyLabel || null,
    safetyScore:  Math.round(scores.internal ?? 50),
    crimeTypes:   sp.crimeTypes?.slice(0, 4) || [],
    criminalInsts: (instByCat.Criminal || []).slice(0, 3),

    // Defense
    defense:      dp.readiness?.label || null,
    milScore:     Math.round(scores.military ?? 50),
    walls:        instNames.filter(n => /wall|gate|fortif|palisade/i.test(n)).slice(0, 2),
    garrison:     instNames.filter(n => /garrison|barracks|soldier|knight/i.test(n)).slice(0, 2),

    // Power
    governing:    governing ? `${governing.faction} (${governing.power}%)` : 'none',
    govCat:       governing?.category || null,
    stability:    ps.stability ?? 50,
    factionCount: factions.length,
    factions:     factions.slice(0, 5).map(f => `${f.faction} (${f.power}%)`),
    conflicts:    conflicts.slice(0, 3).map(c => c.description || c.type).filter(Boolean),
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
    services:       (s.availableServices || []).slice(0, 8).map(svc => svc.name || svc),
    resources:      (s.resourceAnalysis?.nearbyResources || []).slice(0, 5),
    criticalImports: (via.metrics?.criticalImports || []).slice(0, 3),

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
    plotHooks:    (s.plotHooks || []).slice(0, 4).map(h => h.text || h),

    // Spatial
    quarters:     (s.spatialLayout?.quarters || []).map(q => q.name).slice(0, 6),
  };
}

// ── Prompt builder ──────────────────────────────────────────────────────────

function buildAiLayerPrompt(ctx) {
  const lines = [];

  lines.push('SETTLEMENT DATA');
  lines.push(`Name: ${ctx.name}`);
  lines.push(`Tier: ${ctx.tier}${ctx.population ? ` — population ~${ctx.population.toLocaleString()}` : ''}`);
  if (ctx.culture)    lines.push(`Culture: ${ctx.culture}`);
  if (ctx.terrain)    lines.push(`Terrain: ${ctx.terrain}`);
  lines.push(`Trade access: ${ctx.tradeRoute}`);
  if (ctx.stresses.length) lines.push(`Active stresses: ${ctx.stresses.join(', ')}`);
  if (ctx.quarters.length) lines.push(`Districts/Quarters: ${ctx.quarters.join(', ')}`);

  lines.push('\nPOWER & GOVERNANCE');
  lines.push(`Governing: ${ctx.governing}${ctx.govCat ? ` [${ctx.govCat}]` : ''}`);
  lines.push(`Political stability: ${ctx.stability}/100`);
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

// ── API call ─────────────────────────────────────────────────────────────────

export async function runAiLayer(settlement, onProgress) {
  const ctx    = extractFullContext(settlement);
  const prompt = buildAiLayerPrompt(ctx);

  onProgress?.('Reading the settlement…');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: 'You are a worldbuilding consultant for tabletop RPG game masters. You write specific, grounded, non-generic content. You always return valid JSON exactly as requested — no markdown, no code fences.',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  onProgress?.('Weaving the narrative…');

  const data = await res.json();
  const text = data.content
    ?.filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
    .trim();
  if (!text) throw new Error('Empty response from API');

  // Parse JSON — strip any accidental markdown fences
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (e) {
    throw new Error('AI returned invalid JSON — try again');
  }

  // Validate structure
  if (!parsed.thesis || !parsed.dailyLife || !parsed.tabNotes) {
    throw new Error('AI response missing required fields — try again');
  }

  return parsed;
}
