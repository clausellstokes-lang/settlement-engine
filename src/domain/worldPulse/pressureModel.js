import { activeChannelsFrom } from '../region/index.js';

function clamp01(value) {
  const n = Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

function pressureFromScore(score, invert = true) {
  const value = Number.isFinite(score) ? score : 50;
  return invert ? clamp01((70 - value) / 70) : clamp01(value / 100);
}

function hasCondition(item, pattern) {
  return (item.activeConditions || []).some(c =>
    pattern.test(`${c.archetype || ''} ${c.label || ''} ${c.description || ''}`.toLowerCase())
  );
}

function countChannels(snapshot, settlementId, types = []) {
  const set = new Set(types);
  return activeChannelsFrom(snapshot.regionalGraph, settlementId, { types }).filter(channel => set.has(channel.type)).length;
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
    if (supplier && hasCondition(supplier, /famine|import_shortage|food_anchor/)) return true;
  }
  return false;
}

export function deriveSettlementPressures(snapshot) {
  const out = [];
  const season = snapshot.worldState.calendar?.season;

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
    if (hasCondition(item, /import_shortage|food_anchor|famine|migration/)) {
      food += 0.18;
      foodReasons.push('existing food or migration condition');
    }
    if (countChannels(snapshot, item.id, ['trade_dependency']) > 0 && scores.trade_connectivity < 45) {
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
    if (hasCondition(item, /migration|plague|disease/)) {
      disease += 0.14;
      diseaseReasons.push('migration or disease condition');
    }
    if ((scores.housing_pressure ?? 70) < 45) {
      disease += 0.08;
      diseaseReasons.push('housing pressure weakens containment');
    }
    out.push({ ...base, kind: 'disease', label: 'Disease pressure', score: clamp01(disease), reasons: diseaseReasons });

    const conflictReasons = [];
    let conflict = pressureFromScore(scores.defense_readiness);
    if (hasCondition(item, /conflict|protection_gap|war|siege|occupation/)) {
      conflict += 0.18;
      conflictReasons.push('active conflict or protection pressure');
    }
    if (countChannels(snapshot, item.id, ['war_front', 'military_protection']) > 0) {
      conflict += 0.08;
      conflictReasons.push('military regional channel exists');
    }
    const hostility = relationshipHostility(snapshot, item.id);
    if (hostility > 0.4) {
      conflict += hostility * 0.18;
      conflictReasons.push('a hostile neighbour relationship raises conflict pressure');
    }
    out.push({ ...base, kind: 'conflict', label: 'Conflict pressure', score: clamp01(conflict), reasons: conflictReasons });

    const tradeReasons = [];
    let trade = pressureFromScore(scores.trade_connectivity);
    if (hasCondition(item, /route|export_market|tax_revenue|import_shortage/)) {
      trade += 0.16;
      tradeReasons.push('route or market condition');
    }
    out.push({ ...base, kind: 'trade', label: 'Trade pressure', score: clamp01(trade), reasons: tradeReasons });

    const legitimacyReasons = [];
    let legitimacy = pressureFromScore(scores.public_legitimacy);
    if (hasCondition(item, /authority|corruption|leadership|information|religious/)) {
      legitimacy += 0.16;
      legitimacyReasons.push('authority or trust condition');
    }
    out.push({ ...base, kind: 'legitimacy', label: 'Legitimacy pressure', score: clamp01(legitimacy), reasons: legitimacyReasons });

    const crimeReasons = [];
    let crime = pressureFromScore(scores.criminal_opportunity, false);
    if (hasCondition(item, /criminal|route|famine|plague/)) {
      crime += 0.12;
      crimeReasons.push('criminal opportunity condition');
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
  for (const pressure of pressures) {
    map.set(`${pressure.settlementId}:${pressure.kind}`, pressure);
  }
  return {
    get: (settlementId, kind) => map.get(`${settlementId}:${kind}`) || null,
    strongest: (settlementId, kinds = []) => kinds
      .map(kind => map.get(`${settlementId}:${kind}`))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)[0] || null,
  };
}

