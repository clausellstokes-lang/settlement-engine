function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

function pressureFromScore(score, invert = true) {
  const value = Number.isFinite(score) ? score : 50;
  return invert ? clamp01((70 - value) / 70) : clamp01(value / 100);
}

// ── Condition → pressure matching ────────────────────────────────────────────
// Conditions classify by archetype id ONLY (the activeConditions.js catalog) —
// label/description prose must never score (a 'Warehouse collapse' label must
// not read as war pressure; 'siege_lifted' is recovery, not siege). DM-authored
// custom_crisis conditions carry catalog affectedSystems instead of a mapped
// archetype, so they contribute through that systems signal.
const FOOD_ARCHETYPES = new Set(['famine', 'food_anchor_lost', 'regional_import_shortage', 'regional_migration_pressure']);
const SUPPLIER_FOOD_CRISIS_ARCHETYPES = new Set(['famine', 'food_anchor_lost', 'regional_import_shortage']);
const DISEASE_ARCHETYPES = new Set(['plague', 'regional_migration_pressure']);
const CONFLICT_ARCHETYPES = new Set(['war_pressure', 'regional_conflict_pressure', 'regional_protection_gap']);
// Trade and economy share one commerce class: every route/market/tax archetype,
// plus vassal_extraction — tribute drains wealth (it is NOT war, so it must never
// read as conflict/defense pressure). vassal_trade_coercion (gated) routes a
// forced ruinous trade through the SAME trade pressure lever so vassalStrain rises
// and `vassal_rebellion` stays reachable — byte-neutral when the war layer is OFF
// (the condition never exists then).
const TRADE_ARCHETYPES = new Set(['trade_route_cut', 'regional_route_disruption', 'regional_export_market_loss', 'regional_tax_revenue_disruption', 'regional_import_shortage', 'cold_war_sanctions', 'vassal_extraction', 'vassal_trade_coercion']);
const LEGITIMACY_ARCHETYPES = new Set(['regional_authority_instability', 'corruption_exposed', 'dominant_npc_removed', 'regional_information_shock', 'regional_religious_pressure', 'government_overthrown']);
const DEFENSE_ARCHETYPES = new Set(['war_pressure', 'regional_conflict_pressure', 'regional_protection_gap', 'rebellion']);
const CRIME_ARCHETYPES = new Set(['regional_criminal_pressure', 'trade_route_cut', 'regional_route_disruption', 'famine', 'plague']);

// Returns the deduped archetype ids that matched — reason strings must name
// the real matched archetypes, never a fabricated classification.
function matchedConditionArchetypes(item, archetypes, systems = []) {
  const matched = [];
  for (const c of item.activeConditions || []) {
    if (!c) continue;
    if (archetypes.has(c.archetype)) matched.push(c.archetype);
    else if (c.archetype === 'custom_crisis'
      && (c.affectedSystems || []).some(s => systems.includes(s))) matched.push('custom_crisis');
  }
  return [...new Set(matched)];
}

// Build ONE from-keyed index of confirmed channels per pressure pass.
// countChannels/activeChannelsFrom used to re-run ensureRegionalGraph (a full
// graph re-normalize) on every call — ~3N times per tick. The snapshot's graph
// is already ensured, so a single Map<fromId, channel[]> over its confirmed
// channels lets the per-settlement lookups stay O(matching channels).
/** @param {any} graph */
function buildConfirmedChannelIndex(graph) {
  /** @type {Map<string, any[]>} */
  const index = new Map();
  for (const channel of graph?.channels || []) {
    if (channel?.status !== 'confirmed') continue;
    const from = String(channel.from);
    const bucket = index.get(from);
    if (bucket) bucket.push(channel);
    else index.set(from, [channel]);
  }
  return index;
}

/** @param {Map<string, any[]>} channelIndex */
function countChannels(channelIndex, settlementId, types = []) {
  const set = new Set(types);
  const bucket = channelIndex.get(String(settlementId));
  if (!bucket) return 0;
  return bucket.filter(channel => set.has(channel.type)).length;
}

// ── Relationship → pressure feedback ─────────────────────────────────────────
// The world feels interconnected when a settlement's *relationships* shape its
// pressures, not just its local causal scores. Two channels:
//   • a hostile/cold-war/rival neighbour raises CONFLICT pressure
//   • a trade-dependency supplier in a food crisis raises the dependent's FOOD
//     pressure (the supplier's famine becomes the dependent's problem)

function relationshipsTouching(snapshot, settlementId) {
  const sid = String(settlementId);
  const states = snapshot.worldState?.relationshipStates || {};
  const out = [];
  for (const edge of snapshot.regionalGraph?.edges || []) {
    const from = String(edge.from || edge.source || '');
    const to = String(edge.to || edge.target || '');
    if (from !== sid && to !== sid) continue;
    const st = states[edge.id || `rel.${from}.${to}`];
    if (st) out.push(st);
  }
  return out;
}

function relationshipHostility(snapshot, settlementId) {
  let max = 0;
  for (const r of relationshipsTouching(snapshot, settlementId)) {
    if (['hostile', 'cold_war', 'rival'].includes(r.relationshipType)) {
      max = Math.max(max, (r.fear || 0) * 0.6 + (r.resentment || 0) * 0.4);
    }
  }
  return max;
}

function supplierInFoodCrisis(snapshot, settlementId) {
  // trade_dependency channels point supplier → dependent.
  const channels = (snapshot.regionalGraph?.channels || []).filter(c =>
    c.status === 'confirmed' && c.type === 'trade_dependency' && String(c.to) === String(settlementId));
  for (const c of channels) {
    const supplier = snapshot.byId?.get?.(String(c.from));
    if (supplier && matchedConditionArchetypes(supplier, SUPPLIER_FOOD_CRISIS_ARCHETYPES, ['food_security']).length) return true;
  }
  return false;
}

export function deriveSettlementPressures(snapshot) {
  const out = [];
  const season = snapshot.worldState.calendar?.season;
  // Index the confirmed channels once for all per-settlement lookups
  // below instead of re-normalizing the whole graph on each countChannels call.
  const channelIndex = buildConfirmedChannelIndex(snapshot.regionalGraph);

  for (const item of snapshot.settlements) {
    const scores = item.causal?.scores || {};
    const base = {
      settlementId: item.id,
      settlementName: item.name,
    };
    const foodReasons = [];
    let food = pressureFromScore(scores.food_security);
    if (season === 'winter') {
      food += 0.08;
      foodReasons.push('winter raises food pressure');
    }
    const foodConditions = matchedConditionArchetypes(item, FOOD_ARCHETYPES, ['food_security']);
    if (foodConditions.length) {
      food += 0.18;
      foodReasons.push(`active condition: ${foodConditions.join(', ')}`);
    }
    if (countChannels(channelIndex, item.id, ['trade_dependency']) > 0 && scores.trade_connectivity < 45) {
      food += 0.08;
      foodReasons.push('trade-dependent food access is strained');
    }
    if (supplierInFoodCrisis(snapshot, item.id)) {
      food += 0.12;
      foodReasons.push('a trade-dependency supplier is in a food crisis');
    }
    out.push({ ...base, kind: 'food', label: 'Food pressure', score: clamp01(food), reasons: foodReasons });

    const diseaseReasons = [];
    let disease = pressureFromScore(scores.healing_capacity);
    const diseaseConditions = matchedConditionArchetypes(item, DISEASE_ARCHETYPES, ['healing_capacity']);
    if (diseaseConditions.length) {
      disease += 0.14;
      diseaseReasons.push(`active condition: ${diseaseConditions.join(', ')}`);
    }
    if ((scores.housing_pressure ?? 70) < 45) {
      disease += 0.08;
      diseaseReasons.push('housing pressure weakens containment');
    }
    out.push({ ...base, kind: 'disease', label: 'Disease pressure', score: clamp01(disease), reasons: diseaseReasons });

    const conflictReasons = [];
    let conflict = pressureFromScore(scores.defense_readiness);
    const conflictConditions = matchedConditionArchetypes(item, CONFLICT_ARCHETYPES, ['defense_readiness']);
    if (conflictConditions.length) {
      conflict += 0.18;
      conflictReasons.push(`active condition: ${conflictConditions.join(', ')}`);
    }
    if (countChannels(channelIndex, item.id, ['war_front', 'military_protection']) > 0) {
      conflict += 0.08;
      conflictReasons.push('military regional channel exists');
    }
    const hostility = relationshipHostility(snapshot, item.id);
    if (hostility > 0.4) {
      conflict += hostility * 0.18;
      conflictReasons.push('a hostile neighbour relationship raises conflict pressure');
    }
    out.push({ ...base, kind: 'conflict', label: 'Conflict pressure', score: clamp01(conflict), reasons: conflictReasons });
    out.push({
      ...base,
      kind: 'hostility',
      label: 'Hostility pressure',
      score: clamp01(hostility),
      reasons: hostility > 0
        ? ['hostile, cold-war, or rival relationships are exerting pressure']
        : ['no major hostile relationship pressure detected'],
    });

    const tradeReasons = [];
    let trade = pressureFromScore(scores.trade_connectivity);
    const tradeConditions = matchedConditionArchetypes(item, TRADE_ARCHETYPES, ['trade_connectivity']);
    if (tradeConditions.length) {
      trade += 0.16;
      tradeReasons.push(`active condition: ${tradeConditions.join(', ')}`);
    }
    out.push({ ...base, kind: 'trade', label: 'Trade pressure', score: clamp01(trade), reasons: tradeReasons });

    const economyReasons = [];
    const economyScore = Math.round((
      (scores.trade_connectivity ?? 50)
      + (scores.labor_capacity ?? 50)
      + (scores.infrastructure_condition ?? 50)
      + (scores.food_security ?? 50)
    ) / 4);
    let economy = pressureFromScore(economyScore);
    const economyConditions = matchedConditionArchetypes(item, TRADE_ARCHETYPES, ['trade_connectivity']);
    if (economyConditions.length) {
      economy += 0.14;
      economyReasons.push(`active condition: ${economyConditions.join(', ')}`);
    }
    if ((scores.criminal_opportunity ?? 50) > 65) {
      economy += 0.06;
      economyReasons.push('criminal opportunity drags on commerce');
    }
    out.push({ ...base, kind: 'economy', label: 'Economic pressure', score: clamp01(economy), reasons: economyReasons });

    const legitimacyReasons = [];
    let legitimacy = pressureFromScore(scores.public_legitimacy);
    const legitimacyConditions = matchedConditionArchetypes(item, LEGITIMACY_ARCHETYPES, ['public_legitimacy', 'ruling_authority']);
    if (legitimacyConditions.length) {
      legitimacy += 0.16;
      legitimacyReasons.push(`active condition: ${legitimacyConditions.join(', ')}`);
    }
    out.push({ ...base, kind: 'legitimacy', label: 'Legitimacy pressure', score: clamp01(legitimacy), reasons: legitimacyReasons });

    const defenseReasons = [];
    const defenseScore = Math.round((
      (scores.defense_readiness ?? 50)
      + (scores.infrastructure_condition ?? 50)
      + (scores.labor_capacity ?? 50)
    ) / 3);
    let defense = pressureFromScore(defenseScore);
    const defenseConditions = matchedConditionArchetypes(item, DEFENSE_ARCHETYPES, ['defense_readiness']);
    if (defenseConditions.length) {
      defense += 0.16;
      defenseReasons.push(`active condition: ${defenseConditions.join(', ')}`);
    }
    if (countChannels(channelIndex, item.id, ['war_front']) > 0) {
      defense += 0.08;
      defenseReasons.push('war-front regional channel exists');
    }
    out.push({ ...base, kind: 'defense', label: 'Defense pressure', score: clamp01(defense), reasons: defenseReasons });

    const crimeReasons = [];
    let crime = pressureFromScore(scores.criminal_opportunity, false);
    const crimeConditions = matchedConditionArchetypes(item, CRIME_ARCHETYPES, ['criminal_opportunity']);
    if (crimeConditions.length) {
      crime += 0.12;
      crimeReasons.push(`active condition: ${crimeConditions.join(', ')}`);
    }
    out.push({ ...base, kind: 'crime', label: 'Criminal pressure', score: clamp01(crime), reasons: crimeReasons });
  }

  return out.map(p => ({
    ...p,
    reasons: p.reasons.length ? p.reasons : [`${p.label.toLowerCase()} derived from causal state`],
  }));
}

export function pressureIndex(pressures = []) {
  const map = new Map();
  const bySettlement = {};
  for (const pressure of pressures) {
    map.set(`${pressure.settlementId}:${pressure.kind}`, pressure);
    const id = String(pressure.settlementId);
    if (!bySettlement[id]) bySettlement[id] = [];
    bySettlement[id].push(pressure);
  }
  return {
    bySettlement,
    get: (settlementId, kind) => map.get(`${settlementId}:${kind}`) || null,
    strongest: (settlementId, kinds = []) => kinds
      .map(kind => map.get(`${settlementId}:${kind}`))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)[0] || null,
  };
}
