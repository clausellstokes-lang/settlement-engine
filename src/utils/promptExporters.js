// AI Prompt exporters — narrative and map prompts
// v2: fixes plotHooks bug, adds arrivalScene, quarters, tradeDeps, terrain, factionAffiliation

const BAR  = '\u2550'.repeat(60);
const LINE = '\u2500'.repeat(60);
const sec  = (label) => `\n${BAR}\n${label.toUpperCase()}\n${BAR}`;
const sub  = (label) => `\n${LINE}\n${label}\n${LINE}`;

// ── Shared helpers ─────────────────────────────────────────────────────────────

function foundingText(f) {
  if (!f) return null;
  if (typeof f === 'string') return f;
  const parts = [];
  if (f.reason && f.foundedBy) parts.push(`The settlement ${f.reason}, founded by ${f.foundedBy}.`);
  else if (f.reason) parts.push(`The settlement ${f.reason}.`);
  if (f.initialChallenge && f.overcoming)
    parts.push(`Initial challenge: ${f.initialChallenge}, overcome ${f.overcoming}.`);
  if (f.stressNote) parts.push(f.stressNote);
  return parts.join(' ') || null;
}

function cultureDisplay(c) {
  return (c || 'germanic').split(/[_\s]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

// ── NARRATIVE AI PROMPT ────────────────────────────────────────────────────────

export const generateNarrativePrompt = (r) => {
  if (!r) return '';
  const {
    name: sName, tier, population, config: cfg = {},
    stress, arrivalScene, pressureSentence, prominentRelationship,
    settlementReason,
    economicState: eco = {}, powerStructure: ps = {},
    npcs: npcList = [], history: hist = {},
    institutions: insts = [], economicViability: via = {},
    conflicts = [], relationships = [],
    defenseProfile: dp = {}, spatialLayout: spatial = {},
    resourceAnalysis: ra = {},
    structuralViolations = [],
  } = r;

  const stresses  = Array.isArray(stress) ? stress : stress ? [stress] : [];
  const factions  = ps.factions || [];
  const tensions  = hist.currentTensions || [];
  const events    = hist.historicalEvents || [];
  const deps      = eco.tradeDependencies || [];
  const chains    = eco.activeChains || [];
  const scores    = dp.scores || {};
  const quarters  = spatial.quarters || [];
  const v = [];

  // ── Header & instructions ─────────────────────────────────────────────────────
  v.push(sec('D&D Settlement Generator — AI Synthesis Prompt'));
  v.push(`
This document contains settlement data from a D&D settlement generator. Read it, then follow the instructions below exactly.

STEP 1 — ASK TWO QUESTIONS FIRST. Do not produce any other output until the user answers.

QUESTION 1 — What do you need from this settlement right now?
Examples (they can combine or go beyond these):
  a) Session prep — ready-to-run material for an upcoming encounter or visit
  b) Campaign integration — fitting this settlement into an existing world or storyline
  c) Genre shift — reimagine it in a different setting (steampunk, sci-fi, horror, etc.)
  d) Deep dive — expand a specific NPC, faction, location, or event in detail
  e) Player-facing lore — in-world documents, rumours, or descriptions the players can receive
  f) Something else — describe what you need

QUESTION 2 — Is there anything about your campaign or table I should know?
For example: game system (5e, PF2e, OSR, etc.), tone, whether the party has already visited this place, anything that happened in a recent session, or any elements to emphasise or avoid.

STEP 2 — IDENTITY PASS (do this privately before writing anything; do not show it to the user).
A. State the settlement's core identity in 1-2 sentences.
B. Identify 3 defining themes, 3 recurring motifs, and 3 central contradictions shaping daily life.
C. Identify which details are most important and should be reinforced repeatedly.
D. If any line is clearly malformed or contradicted by stronger context, note the correct reading. Do not reproduce garbled text.

STEP 3 — GENERATE ONLY WHAT SERVES THE USER'S STATED NEED.

AVAILABLE OUTPUTS:
- DM brief: 3-4 sentences that communicate the place fast and cleanly.
- Plot hooks: actionable, rooted in this settlement's specific tensions and institutions.
- Arrival scene: foregrounds the settlement's identity immediately.
- NPC expansion: the single most interesting NPC chosen for how strongly they express the settlement's identity.
- One-week forecast: shows systems reacting to pressure — not random events.
- Tavern scene: socially and politically embedded in this settlement.
- Player-facing lore: in-world documents, rumours, or descriptions players can receive directly.
- Genre shift: reframe everything through the lens the user specified.
- Other: respond to whatever the user described.

WRITING RULES
- Make the setting feel like a real place with a hard centre, not a bag of hooks.
- Treat politics, economics, religion, and institutions as interconnected systems.
- Reinforce the same identity across every piece of output.
- Favour specificity, pressure, social texture, and consequence over decoration.
- Never surface internal validation markers, severity labels, or generator metadata.`);

  // ── Overview ──────────────────────────────────────────────────────────────────
  v.push(sub('OVERVIEW'));
  v.push(`Name:        ${sName}`);
  v.push(`Size:        ${tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : '?'} (~${population?.toLocaleString() || '?'} people)`);
  v.push(`Trade:       ${cfg.tradeRouteAccess || 'road'} access`);
  v.push(`Terrain:     ${ra.terrain || 'unknown'}${ra.strategicValue ? ' — ' + ra.strategicValue : ''}`);
  v.push(`Culture:     ${cultureDisplay(cfg.culture)}`);
  v.push(`Magic level: ${(cfg.priorityMagic ?? 50) >= 66 ? 'high' : (cfg.priorityMagic ?? 50) >= 35 ? 'medium' : 'low'}`);
  v.push(`Prosperity:  ${eco.prosperity || 'Moderate'}`);
  v.push(`Stability:   ${ps.stability || 'Stable'}`);
  v.push(`Age:         ~${hist.age || '?'} years`);
  if (hist.historicalCharacter) v.push(`Character:   ${hist.historicalCharacter}`);

  if (Object.keys(scores).length > 0) {
    v.push(`\nDefense scores: Military ${Math.round(scores.military || 0)} | Monster ${Math.round(scores.monster || 0)} | Internal ${Math.round(scores.internal || 0)} | Economic ${Math.round(scores.economic || 0)} | Magical ${Math.round(scores.magical || 0)}`);
    if (dp.readiness?.label) v.push(`Readiness: ${dp.readiness.label}`);
  }

  if (via.viable !== undefined) {
    const vLabel = via.viable === false ? 'NOT COHERENT' : via.viable === true ? 'COHERENT' : 'MARGINAL';
    const sum = (via.summary || '').replace(/^[^\w]*(NOT VIABLE:|VIABLE:)\s*/i, '').trim();
    v.push(`Coherence:   ${vLabel}${sum ? ' — ' + sum : ''}`);
  }

  // ── First impression ──────────────────────────────────────────────────────────
  if (arrivalScene || pressureSentence) {
    v.push(sub('FIRST IMPRESSION'));
    if (arrivalScene) v.push(arrivalScene);
    if (pressureSentence) v.push(`\n${pressureSentence}`);
  }

  // ── Current situation ─────────────────────────────────────────────────────────
  if (stresses.length > 0 || prominentRelationship?.phrasing) {
    v.push(sub('CURRENT SITUATION'));
    stresses.forEach(st => {
      v.push(`ACTIVE CRISIS: ${st.label || st.type || '?'}`);
      if (st.summary) v.push(`  ${st.summary}`);
      if (st.crisisHook) v.push(`  Crisis hook: ${st.crisisHook}`);
    });
    if (prominentRelationship?.phrasing) {
      v.push(`\nNotable dynamic: ${prominentRelationship.phrasing}`);
    }
  }

  // ── Origin & history ──────────────────────────────────────────────────────────
  v.push(sub('ORIGIN & HISTORY'));

  const fText = foundingText(hist.founding);
  if (fText) v.push(`Founding: ${fText}`);

  if (settlementReason) {
    const reason = Array.isArray(settlementReason)
      ? settlementReason.join(' ')
      : settlementReason?.primary || settlementReason?.text || String(settlementReason);
    if (reason && !reason.startsWith('[object')) v.push(`Origin: ${reason}`);
  }

  if (events.length > 0) {
    v.push(`\nMajor historical events:`);
    events.forEach(evt => {
      v.push(`  [${evt.yearsAgo}y ago | ${evt.type} | ${evt.severity || ''}] ${evt.name || ''}`);
      if (evt.description) v.push(`    ${evt.description}`);
      if (evt.lastingEffects?.length) v.push(`    Effects: ${evt.lastingEffects.join(' | ')}`);
    });
  }

  if (tensions.length > 0) {
    v.push(`\nCurrent tensions:`);
    tensions.forEach(t => {
      const desc  = typeof t === 'string' ? t : t.description;
      const ttype = typeof t === 'object' && t.type ? t.type.replace(/_/g, ' ') : 'tension';
      v.push(`  [${ttype}] ${desc || ''}`);
      if (typeof t === 'object' && t.factions?.length) v.push(`    Parties: ${t.factions.join(' vs ')}`);
    });
  }

  // ── Spatial layout ────────────────────────────────────────────────────────────
  if (spatial.layout || quarters.length > 0) {
    v.push(sub('SPATIAL LAYOUT'));
    if (spatial.layout) v.push(`Overall: ${spatial.layout}`);
    if (quarters.length > 0) {
      v.push('\nDistricts:');
      quarters.forEach(q => {
        v.push(`  ${q.name || 'District'}`);
        if (q.desc) v.push(`    ${q.desc}`);
        if (q.landmarks?.length) v.push(`    Landmarks: ${q.landmarks.slice(0, 3).join(' | ')}`);
      });
    }
  }

  // ── Power structure ───────────────────────────────────────────────────────────
  v.push(sub('POWER STRUCTURE'));

  if (factions.length > 0) {
    v.push('Factions (by influence):');
    factions.forEach(f => {
      v.push(`  ${f.power ? Math.round(f.power) + 'pt' : '?'}  ${f.faction}${f.isGoverning ? ' [GOVERNING]' : ''}`);
      if (f.desc) v.push(`       ${f.desc}`);
    });
  }

  if (ps.publicLegitimacy?.score !== undefined) {
    v.push(`\nPublic legitimacy: ${ps.publicLegitimacy.score}/100 — ${ps.publicLegitimacy.label || ''}`);
  }

  if (ps.criminalCaptureState && ps.criminalCaptureState !== 'none') {
    const captureLabels = {
      adversarial: 'Criminal networks actively opposed by authorities',
      equilibrium: 'Criminal networks tolerated by authorities',
      corrupted:   'Some officials corrupted by criminal networks',
      capture:     'Governance effectively captured by criminal interests',
    };
    v.push(`Criminal dynamic: ${captureLabels[ps.criminalCaptureState] || ps.criminalCaptureState}`);
  }

  if (conflicts.length > 0) {
    v.push('\nActive conflicts:');
    conflicts.forEach(c => {
      const parties = (c.parties || []).join(' vs ');
      v.push(`  ${parties}${c.issue ? ' — ' + c.issue : ''}${c.intensity ? ' [' + c.intensity + ']' : ''}`);
    });
  }

  const flagRels = (relationships || []).filter(rel => rel.flagDriven).slice(0, 5);
  if (flagRels.length > 0) {
    v.push('\nKey NPC relationships:');
    flagRels.forEach(rel => {
      v.push(`  ${rel.name || ''} [${rel.type || ''}]`);
      if (rel.desc || rel.description) v.push(`    ${rel.desc || rel.description}`);
    });
  }

  // ── Key figures ───────────────────────────────────────────────────────────────
  if (npcList.length > 0) {
    v.push(sub('KEY FIGURES'));
    npcList.forEach(npc => {
      if (!npc?.name) return;
      const factionTag = npc.factionAffiliation ? ` (${npc.factionAffiliation})` : '';
      const infTag     = npc.influence ? ` [${npc.influence} influence]` : '';
      v.push(`${npc.name} — ${npc.role || '?'}${factionTag}${infTag}`);

      if (npc.presentation?.impression) v.push(`  First impression: ${npc.presentation.impression}`);

      if (npc.personality) {
        const p = npc.personality;
        const traits = [p.dominant, p.flaw, p.modifier].filter(Boolean).join(', ');
        if (traits) v.push(`  Personality: ${traits}`);
        if (p.tell)   v.push(`  Tell: ${p.tell}`);
        if (p.speech) v.push(`  Speech: ${p.speech}`);
      }

      if (npc.physical) {
        const ph  = npc.physical;
        const app = [ph.age, ph.build, ph.feature, ph.clothes].filter(Boolean).join(', ');
        if (app) v.push(`  Appearance: ${app}`);
      }

      if (npc.goal?.short) v.push(`  Goal (short): ${npc.goal.short}`);
      if (npc.goal?.long)  v.push(`  Goal (long): ${npc.goal.long}`);

      if (npc.secret?.what) {
        v.push(`  Secret: ${npc.secret.what}`);
        if (npc.secret.stakes) v.push(`  Stakes: ${npc.secret.stakes}`);
      }

      // FIX: plotHooks is an array — old code incorrectly used npc.plotHook (undefined)
      const hooks = npc.plotHooks || [];
      if (hooks[0]) v.push(`  Plot hook: ${hooks[0]}`);
      if (hooks[1]) v.push(`  Plot hook 2: ${hooks[1]}`);

      if (npc.structuralPosition) v.push(`  Role in settlement: ${npc.structuralPosition}`);
      if (npc.activeConstraint)   v.push(`  Active constraint: ${npc.activeConstraint}`);
      v.push('');
    });
  }

  // ── Economics ─────────────────────────────────────────────────────────────────
  v.push(sub('ECONOMICS'));
  if (eco.situationDesc) v.push(eco.situationDesc);
  if (eco.primaryExports?.length)   v.push(`\nExports: ${eco.primaryExports.slice(0, 8).join(', ')}`);
  if (eco.primaryImports?.length)   v.push(`Imports: ${eco.primaryImports.slice(0, 8).join(', ')}`);
  if (eco.necessityImports?.length) v.push(`Essential imports: ${eco.necessityImports.join(', ')}`);

  if (eco.incomeSources?.length) {
    v.push(`\nIncome sources:`);
    eco.incomeSources.filter(src => src?.source).forEach(src => {
      v.push(`  ${src.percentage}%  ${src.source}${src.isCriminal ? ' [CRIMINAL]' : ''}`);
    });
  }

  if (deps.length > 0) {
    v.push(`\nTrade dependencies (what institutions need from outside):`);
    deps.forEach(dep => {
      v.push(`  ${dep.institution} — needs: ${dep.resource}${dep.severity === 'critical' ? ' [CRITICAL]' : ''}`);
      if (dep.impact) v.push(`    ${dep.impact}`);
    });
  }

  if (chains.length > 0) {
    v.push(`\nActive supply chains: ${chains.slice(0, 8).map(c => c.label).join(', ')}`);
  }

  const unexploited = ra.exploitation?.unexploited || [];
  if (unexploited.length > 0) {
    v.push(`\nUnexploited economic opportunities:`);
    unexploited.forEach(chain => {
      const res = (chain.rawResource || '').replace(/_/g, ' ');
      const missing = (chain.missingInstitutions || []).slice(0, 2).join(', ') || 'no processing infrastructure';
      v.push(`  ${res} (${chain.exportValue || 'medium'} value) — missing: ${missing}`);
    });
  }

  // ── Institutions ──────────────────────────────────────────────────────────────
  if (insts.length > 0) {
    v.push(sub('INSTITUTIONS'));
    const byCategory = {};
    insts.forEach(i => { (byCategory[i.category || 'other'] = byCategory[i.category || 'other'] || []).push(i.name); });
    Object.entries(byCategory).forEach(([cat, names]) => v.push(`${cat}: ${names.join(', ')}`));
  }

  // ── Structural tensions ───────────────────────────────────────────────────────
  const critIssues = (via.issues || []).filter(i => ['critical', 'implausible'].includes(i.severity));
  if (critIssues.length > 0 || structuralViolations.length > 0) {
    v.push(sub('STRUCTURAL TENSIONS'));
    v.push('Treat these as narrative pressure — do not reproduce as labels or diagnostic text:');
    critIssues.forEach(i => v.push(`  - ${i.title || ''}: ${i.description || i.message || ''}`));
    structuralViolations.forEach(i => v.push(`  - ${i.institution || i.group || ''}: ${i.reason || ''}`));
  }

  // ── Footer ────────────────────────────────────────────────────────────────────
  v.push(`\n${BAR}`);
  v.push('Generated by D&D Settlement Generator');
  v.push(`Settlement: ${sName} | ${tier} | ${cfg.tradeRouteAccess || 'road'} | ${new Date().toLocaleDateString()}`);
  v.push(BAR);
  return v.join('\n');
};

// ── MAP AI PROMPT ──────────────────────────────────────────────────────────────

export const generateMapPrompt = (r) => {
  if (!r) return '';
  const {
    name: sName, tier, population,
    config: cfg = {}, economicState: eco = {},
    powerStructure: ps = {}, institutions: insts = [],
    resourceAnalysis: ra = {}, history: hist = {},
    arrivalScene, spatialLayout: spatial = {},
    stress,
  } = r;

  const stresses   = Array.isArray(stress) ? stress : stress ? [stress] : [];
  const factions   = ps.factions || [];
  const quarters   = spatial.quarters || [];
  const culture    = cfg.culture || 'germanic';
  const tradeRoute = cfg.tradeRouteAccess || 'road';
  const magicPri   = cfg.priorityMagic ?? 50;
  const tier_label = { thorp:'Thorp', hamlet:'Hamlet', village:'Village', town:'Town', city:'City', metropolis:'Metropolis' }[tier] || tier;
  const pop_str    = population ? population.toLocaleString() : 'unknown';
  const terrain    = ra.terrain || '';

  const TRADE_VISUAL = {
    port:          'coastal port — natural harbour, docks, waterfront district',
    river:         'riverside — mill district, river crossing, waterfront',
    crossroads:    'crossroads — junction of major overland roads, multiple gates',
    road:          'main road — single well-travelled trade road, two gates',
    mountain_pass: 'mountain pass — fortified approach, toll road, steep terrain',
    isolated:      'isolated — no roads visible, remote wilderness setting',
  };
  const tradeVisual = TRADE_VISUAL[tradeRoute] || tradeRoute.replace(/_/g, ' ');

  const ARCH = {
    germanic:     'Germanic half-timbered buildings, steeply-pitched tiled roofs, stone gatehouses, carved timber framing',
    latin:        'Roman-influenced colonnaded stonework, terracotta roof tiles, forum-style open plazas, arched aqueducts',
    celtic:       'Celtic roundhouses and longhouses, thatched roofs, carved standing stones, wattle-and-daub construction',
    arabic:       'Arabesque domed buildings, slender minarets, ornate latticed stonework, shaded courtyard gardens',
    norse:        'Norse longhouses with carved dragon-head beams, turf-roofed structures, heavy timber, shipbuilding yard',
    slavic:       'Slavic timber construction, onion-dome church towers, painted facades, decorated gables, timber palisade',
    east_asian:   'East Asian timber pavilion construction, curved upswept roofs, red lacquer accents, lantern-lit gates',
    south_asian:  'South Asian stone temple towers, colonnaded bazaars, carved sandstone facades, sacred tank',
    steppe:       'Steppe settlement — yurt compounds on periphery, low stone walls, wide central open space',
    mesoamerican: 'Mesoamerican stepped pyramid at centre, limestone plazas, painted exterior murals',
    greek:        'Greek colonnaded agora, white marble public buildings, terracotta rooftiles, hilltop acropolis',
  };
  const archStyle = ARCH[culture.toLowerCase()] || `${cultureDisplay(culture)}-influenced architecture`;

  const magicVisual = magicPri >= 66
    ? 'High magic — wizard towers, arcane sigils on buildings, magelight lamp posts, floating constructs visible'
    : magicPri >= 35
    ? 'Moderate magic — occasional magelight lamp posts, glowing shop signs, one visible arcane tower'
    : 'Low magic — no visible arcane infrastructure';

  const threatVisual = {
    plagued:   'Monster-plagued region — heavy defensive earthworks, beacon towers, armed exterior patrols',
    frontier:  'Active frontier — maintained walls, watchtowers, guards visible at gates',
    heartland: 'Safe heartland — open gates, market flags, relaxed civic atmosphere',
  }[cfg.monsterThreat] || '';

  const CRISIS_VISUAL = {
    under_siege:           'UNDER SIEGE — siege equipment, emergency fortifications, armed civilians, no normal traffic',
    occupied:              'OCCUPIED — foreign military presence, checkpoints, occupation insignia on buildings',
    famine:                'FAMINE — empty market stalls, grain stores under guard, few fires burning',
    plague_onset:          'DISEASE OUTBREAK — quarantine markers on doors, masked healers, blocked district entrances',
    politically_fractured: 'POLITICAL FRACTURE — competing faction banners, barricaded streets',
    monster_pressure:      'MONSTER PRESSURE — emergency walls, watchtowers lit at all hours, refugee camps outside gates',
    succession_void:       'SUCCESSION CRISIS — no banners flying, factions visibly manoeuvring in public spaces',
    wartime:               'WARTIME — supply wagons, conscripts, military banners, forges running day and night',
  };
  const crisisLines = stresses.map(st => CRISIS_VISUAL[st.type] || st.label || '').filter(Boolean);

  const RESOURCE_VISUAL = {
    fishing_grounds:     'fishing boats offshore, drying nets on the quay',
    salt_flats:          'white salt pans along the shore',
    iron_deposits:       'mine shafts and slag heaps on surrounding hillsides',
    stone_quarry:        'quarried cliff face, stone blocks stacked at the edge',
    managed_forest:      'managed woodland with timber stacks and sawmill smoke',
    grain_fields:        'wide grain fields surrounding the settlement',
    river_mills:         'water wheels turning on the river',
    ancient_ruins:       'crumbling ruins visible on the outskirts',
    deep_harbour:        'deep-water harbour with dockside cranes',
    hunting_grounds:     'dense forest pressing close to the walls',
    ancient_grove:       'ancient sacred woodland visible to the east',
    hot_springs:         'steam rising from natural springs near the settlement',
    crossroads_position: 'roads converging visibly from all four directions',
    precious_metals:     'mine tailings and assay office near the gate',
    salt_mine:           'salt mine entrance on the hillside',
    river_fish:          'fishing weirs and drying racks along the river bank',
  };
  const resourceVisuals = (cfg.nearbyResources || [])
    .slice(0, 4).map(k => RESOURCE_VISUAL[k]).filter(Boolean);

  // Landmarks from institutions
  const instNames = (insts || []).map(i => (i.name || '').toLowerCase());
  const hasInst   = (kw) => instNames.some(n => n.includes(kw));
  const landmarks = [];
  if (hasInst('great cathedral'))      landmarks.push('great cathedral dominating the skyline');
  else if (hasInst('cathedral'))       landmarks.push('stone cathedral with towers');
  else if (hasInst('parish church'))   landmarks.push('parish church and churchyard');
  if (hasInst('massive wall') || hasInst('massive fortif')) landmarks.push('massive fortified walls with multiple gate towers');
  else if (hasInst('wall') || hasInst('gatehouse')) landmarks.push('defensive stone walls and arched gatehouse');
  else if (hasInst('palisade'))        landmarks.push('timber palisade encircling the settlement');
  if (hasInst('palace') || hasInst('government complex')) landmarks.push('palace/government complex on high ground');
  if (hasInst('mages\' district') || hasInst('multiple wizard')) landmarks.push('cluster of wizard towers');
  else if (hasInst('wizard') || hasInst('mages')) landmarks.push('wizard\'s tower');
  if (hasInst('great library') || hasInst('university')) landmarks.push('university complex with courtyard');
  if (hasInst('citadel'))              landmarks.push('citadel on highest ground — keep of last resort');
  if (hasInst('harbour') || hasInst('dock')) landmarks.push('harbour with cranes and merchant vessels');
  if (hasInst('aqueduct'))             landmarks.push('stone aqueduct visible on the approach');
  if (hasInst('airship'))              landmarks.push('airship docking tower');
  if (hasInst('arena') || hasInst('colosseum')) landmarks.push('arena or fighting pit');
  if (hasInst('academy of magic'))     landmarks.push('academy of magic — walled campus with towers');

  // Districts — use ACTUAL quarter data when available
  let districtLines = [];
  if (quarters.length > 0) {
    districtLines = quarters.map(q =>
      `- ${q.name || 'District'}${q.desc ? ': ' + q.desc : ''}`
    );
  } else {
    if (hasInst('cathedral') || hasInst('monastery'))
      districtLines.push('- Religious Quarter — cathedral, monasteries, pilgrims');
    if (hasInst('market') || hasInst('guild'))
      districtLines.push('- Market & Guild Quarter — market squares, guild halls, merchant warehouses');
    if (hasInst('garrison') || hasInst('barracks') || hasInst('citadel'))
      districtLines.push('- Military Quarter — garrison barracks, parade ground, armoury');
    if (hasInst('palace') || hasInst('city hall') || hasInst('court'))
      districtLines.push('- Government Quarter — administrative buildings, courts, on defensible high ground');
    if (hasInst('mages') || hasInst('wizard') || hasInst('arcane'))
      districtLines.push('- Mages\' Quarter — towers, arcane workshops, isolated area');
    if (hasInst('university') || hasInst('library') || hasInst('academy'))
      districtLines.push('- Academic Quarter — university, great library');
    if (hasInst('dock') || hasInst('port') || hasInst('harbour'))
      districtLines.push('- Waterfront — docks, cranes, warehouses, merchant vessels');
    if (hasInst('thieves') || hasInst('criminal'))
      districtLines.push('- Shadows District — narrow alleys, hidden markets');
    if (hasInst('hospital') || hasInst('healer'))
      districtLines.push('- Healer\'s District — hospital, apothecaries');
  }

  const governing = factions.find(f => f.isGoverning) || factions[0];
  const secondary = factions.find(f => !f.isGoverning);
  const govLine = governing
    ? `Governing authority: ${governing.faction}${secondary ? ', contested by ' + secondary.faction : ''}.`
    : '';

  const hr = (ch = '\u2500', n = 60) => ch.repeat(n);
  const E = [];

  E.push(hr('\u2550'));
  E.push('D&D SETTLEMENT GENERATOR — AI MAP PROMPT');
  E.push(hr('\u2550'));
  E.push('');
  E.push('You are not being shown this document for commentary or summary.');
  E.push('Treat it as an active image-generation and prompt-generation request.');
  E.push('');
  E.push('EXECUTION RULE');
  E.push('- Begin executing this document immediately when attached or pasted into chat.');
  E.push('- Do not wait for further instructions unless this document explicitly tells you to ask a question.');
  E.push('- Do not explain the file or discuss your process unless explicitly asked.');
  E.push('');
  E.push('CORE TASK');
  E.push('Generate the final image directly using the settlement data below.');
  E.push('Do not output a prompt. Do not describe the image. Produce the finished image.');
  E.push('If image generation is not available, fall back to a ready-to-paste image prompt.');
  E.push('Do not produce generic fantasy imagery. Synthesize the data into a specific place.');
  E.push('');
  E.push('IMAGE MODES — QUESTION 1 (ask before generating):');
  E.push('a) A usable settlement map (top-down, cartographic, navigable)');
  E.push('b) A pretty fantasy image (atmospheric illustration)');
  E.push('c) Both');
  E.push('Default if unanswered: usable settlement map.');
  E.push('');
  E.push('OPTIONAL — QUESTION 2 (only if "both" selected or style is ambiguous):');
  E.push('  a) Clean cartographic clarity');
  E.push('  b) Painterly fantasy illustration');
  E.push('  c) Player-handout parchment style');
  E.push('  d) Dark / crisis-state atmosphere');
  E.push('  e) Default to whatever best fits the settlement');
  E.push('');
  E.push('MAP RULES: top-down or bird\'s-eye view. Prioritise roads, walls, gates, districts, terrain, waterways, landmarks. Readability over mood.');
  E.push('SCENIC RULES: emphasise atmosphere, architecture, skyline, activity. Keep it specific — not a generic fantasy postcard.');
  E.push('');
  E.push('SOURCE PRIORITY');
  E.push('1. Settlement scale, terrain, trade access, overall footprint');
  E.push('2. District layout and spatial organisation');
  E.push('3. Major landmarks and dominant institutions');
  E.push('4. Crisis conditions affecting appearance');
  E.push('5. Cultural style and architectural motifs');
  E.push('');
  E.push('INTERNAL IDENTITY PASS (do silently before writing):');
  E.push('A. 1-2 sentence visual identity for this settlement');
  E.push('B. 3 defining visual motifs | 3 dominant structural features | 3 conditions affecting the image');
  E.push('C. Read as: orderly / strained / fortified / prosperous / fearful / decaying / sacred / commercial / arcane / mixed');
  E.push('');
  E.push(hr());
  E.push('OVERVIEW');
  E.push(hr());
  E.push(`Name:        ${sName}`);
  E.push(`Size:        ${tier_label} (~${pop_str} people)`);
  E.push(`Trade:       ${tradeVisual}`);
  if (terrain) E.push(`Terrain:     ${terrain}${ra.strategicValue ? ' — ' + ra.strategicValue : ''}`);
  E.push(`Culture:     ${cultureDisplay(culture)}`);
  E.push(`Magic:       ${magicPri >= 66 ? 'high' : magicPri >= 35 ? 'medium' : 'low'}`);
  E.push(`Prosperity:  ${eco.prosperity || 'Moderate'}`);
  E.push(`Stability:   ${ps.stability || 'Stable'}`);
  if (hist.age) E.push(`Age:         ~${hist.age} years`);
  E.push('');

  if (crisisLines.length > 0 || arrivalScene) {
    E.push(hr());
    E.push('CURRENT CONDITION');
    E.push(hr());
    crisisLines.forEach(cl => E.push(cl));
    if (arrivalScene) E.push(`\nFirst impression: ${arrivalScene}`);
    E.push('');
  }

  E.push(hr());
  E.push('SPATIAL STRUCTURE');
  E.push(hr());
  E.push(`Footprint: ${
    tier === 'metropolis' ? 'Dense urban core with sprawling suburbs — multiple wall rings' :
    tier === 'city'       ? 'Walled core with some suburban growth' :
    tier === 'town'       ? 'Compact within walls, some outlying farms' :
    tier === 'village'    ? 'Clustered around church and central green' :
    tier === 'hamlet'     ? 'Loose cluster of buildings, no walls' :
                            'Scattered farmsteads, common at centre'
  }`);
  if (spatial.layout) E.push(`Layout detail: ${spatial.layout}`);
  E.push('');

  if (districtLines.length > 0) {
    E.push('Districts:');
    districtLines.forEach(d => E.push(d));
    E.push('');
  }

  E.push(`Trade access: ${tradeVisual}`);
  if (resourceVisuals.length > 0) {
    E.push('\nVisible terrain features:');
    resourceVisuals.forEach(rv => E.push(`- ${rv}`));
  }
  E.push('');

  if (landmarks.length > 0) {
    E.push(hr());
    E.push('LANDMARK HIERARCHY');
    E.push(hr());
    landmarks.forEach((lm, i) => E.push(`${i + 1}. ${lm}`));
    E.push('');
  }

  E.push(hr());
  E.push('POWER & ATMOSPHERE');
  E.push(hr());
  if (factions.length > 0) {
    E.push('Factions (by influence):');
    factions.slice(0, 5).forEach(f =>
      E.push(`  ${Math.round(f.power || 0)}pt  ${f.faction}${f.isGoverning ? ' [GOVERNING]' : ''}`)
    );
  }
  if (govLine) E.push(`\n${govLine}`);
  E.push('');
  E.push(`Architecture: ${archStyle}`);
  E.push(`Magic:        ${magicVisual}`);
  if (threatVisual) E.push(`Threat level: ${threatVisual}`);
  if (crisisLines.length > 0) E.push(`Crisis:       ${crisisLines.join('; ')}`);
  E.push('');

  E.push(hr());
  E.push('STYLE DEFAULTS');
  E.push(hr());
  E.push('If no specific aesthetic is requested:');
  E.push('- Map mode: richly detailed fantasy cartographic map, watercolour and ink, aged parchment, decorative compass rose, readable district separation');
  E.push('- Image mode: richly detailed fantasy illustration, painterly watercolour, atmospheric light, strong architectural identity');
  E.push('');
  E.push(hr('\u2550'));
  E.push('Generated by D&D Settlement Generator');
  E.push(`Settlement: ${sName} | ${tier_label} | ${tradeRoute} | ${new Date().toLocaleDateString()}`);
  E.push(hr('\u2550'));

  return E.join('\n');
};

// ── Download helpers ───────────────────────────────────────────────────────────

export const downloadNarrativePrompt = (r) => {
  const text = generateNarrativePrompt(r);
  const url  = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a    = Object.assign(document.createElement('a'), {
    href: url, download: `${r?.name || 'settlement'}-ai-prompt.txt`,
  });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
};

export const downloadMapPrompt = (r) => {
  const text = generateMapPrompt(r);
  const url  = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a    = Object.assign(document.createElement('a'), {
    href: url, download: `${r?.name || 'settlement'}-map-prompt.txt`,
  });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
};
