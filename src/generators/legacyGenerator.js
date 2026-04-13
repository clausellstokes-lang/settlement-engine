/**
 * legacyGenerator.js
 *
 * Derives structural legacy annotations connecting historical events to
 * current settlement state. Uses each event's own name and lasting effects
 * so every annotation is specific to this settlement.
 *
 * Temporal rules:
 *   - Only surfaces events where age × type is causally plausible
 *   - Disaster/famine > 80yr → cannot explain current economic/safety conditions
 *   - Economic events > 150yr → cannot explain current faction balance
 *   - Political events > 200yr → cannot explain current legitimacy
 *   - Religious events > 300yr → founding character drift only
 * Returns 0–3 annotations; empty is valid.
 */

const MAX_CAUSAL_AGE = {
  disaster:  { current_safety:80, current_economy:80, current_food:30, institutional:200 },
  economic:  { current_economy:60, current_food:40, faction_balance:150, institutional:250 },
  political: { legitimacy:80, faction_balance:150, governing_model:250, institutional:300 },
  religious: { faction_balance:120, institutional:300 },
  magical:   { current_economy:40, faction_balance:80, institutional:150 },
};

function maxAge(type, domain) {
  return MAX_CAUSAL_AGE[type]?.[domain] ?? 0;
}

// ── Classify current state into named conditions ───────────────────────────────
function classifyLegitimacy(leg) {
  const s = leg?.score ?? 50;
  if (s < 30) return 'fractured';
  if (s < 45) return 'contested';
  return 'stable';
}
function classifyProsperity(p = '') {
  const l = p.toLowerCase();
  if (l.includes('struggling') || l.includes('poor') || l.includes('subsist')) return 'stressed';
  if (l.includes('prosperous') || l.includes('wealthy')) return 'prosperous';
  return 'moderate';
}
function classifyFood(f) {
  const l = (f?.label || '').toLowerCase();
  if (l.includes('famine') || l.includes('deficit')) return 'crisis';
  if (l.includes('pressured') || l.includes('dependent')) return 'pressured';
  return 'ok';
}
function factionStrength(factions, matcher) {
  const f = factions.find(matcher);
  return f?.powerLabel || 'Suppressed';
}

// ── Build annotation using the event's own content ────────────────────────────
// effect: optional lasting effect string from the event, rephrased abstractly
// The annotation is always one sentence — structural, no world-specific facts.

function buildAnnotation(ev, relationship, suffix) {
  const name   = ev.name   || 'a significant historical event';
  const effect = (ev.lastingEffects || [])[0] || null;

  // relationship: 'unresolved' | 'recovery' | 'drift'
  const effectClause = effect
    ? ` The lasting consequence — ${effect.charAt(0).toLowerCase() + effect.slice(1)} — remains structurally embedded.`
    : '';

  if (relationship === 'unresolved') {
    return `${name} (${ev.yearsAgo} years ago) created pressure that has not been fully resolved: ${suffix}${effectClause}`;
  }
  if (relationship === 'recovery') {
    return `${name} (${ev.yearsAgo} years ago) was a disruption the settlement has since moved through: ${suffix}${effectClause}`;
  }
  if (relationship === 'drift') {
    return `${name} (${ev.yearsAgo} years ago) established conditions that have since shifted: ${suffix}${effectClause}`;
  }
  return `${name} (${ev.yearsAgo} years ago): ${suffix}${effectClause}`;
}

// ── Match each event against current state ────────────────────────────────────
function scoreEvent(ev, legState, prosState, foodState, factions) {
  const type = ev.type || 'political';
  const yrs  = ev.yearsAgo || 0;
  const sev  = ev.severity || 'minor';
  const sevBonus = sev === 'catastrophic' ? 15 : sev === 'major' ? 8 : 0;

  const relPow  = factionStrength(factions, f => f.faction?.toLowerCase().match(/church|religio|clergy|temple/));
  const mercPow = factionStrength(factions, f => f.category === 'economy' || f.faction?.toLowerCase().includes('merchant'));
  const arcPow  = factionStrength(factions, f => f.category === 'magic'   || f.faction?.toLowerCase().includes('arcane'));

  let relationship = null, suffix = null, score = 0;

  if (type === 'political') {
    if (legState === 'fractured' && yrs <= maxAge('political', 'legitimacy')) {
      relationship = 'unresolved';
      suffix = 'the governing authority\'s current legitimacy deficit has structural roots that precede the present situation.';
      score = 90 + sevBonus;
    } else if (legState === 'contested' && yrs <= maxAge('political', 'legitimacy')) {
      relationship = 'unresolved';
      suffix = 'the present contestation of governing authority echoes rather than resolves that earlier disruption.';
      score = 70 + sevBonus;
    } else if (prosState === 'prosperous' && yrs <= maxAge('political', 'institutional')) {
      relationship = 'recovery';
      suffix = 'the current stability was built partly through reconstruction following that disruption.';
      score = 45;
    } else if (yrs <= maxAge('political', 'governing_model')) {
      relationship = 'drift';
      suffix = 'the governing arrangements in place today carry the shape of what was settled then.';
      score = 30;
    }
  }

  if (type === 'economic') {
    if (prosState === 'stressed' && yrs <= maxAge('economic', 'current_economy')) {
      relationship = 'unresolved';
      suffix = 'current economic pressure has structural antecedents — the present situation reflects dependencies established then.';
      score = 85 + sevBonus;
    } else if (foodState === 'crisis' && yrs <= maxAge('economic', 'current_food')) {
      relationship = 'unresolved';
      suffix = 'the supply vulnerabilities visible today have historical antecedents in this disruption.';
      score = 80;
    } else if (prosState === 'prosperous' && yrs <= maxAge('economic', 'institutional')) {
      relationship = 'recovery';
      suffix = 'current commercial strength is accumulated recovery — the present prosperity was built on what was reconstructed.';
      score = 50;
    } else if (['Dominant','Strong'].includes(mercPow) && yrs <= maxAge('economic', 'faction_balance')) {
      relationship = 'drift';
      suffix = 'commercial interests have held structural relevance since — the present merchant faction\'s strength is accumulated rather than sudden.';
      score = 40;
    } else if (['Minor','Suppressed'].includes(mercPow) && yrs > 20 && yrs <= maxAge('economic', 'faction_balance')) {
      relationship = 'drift';
      suffix = 'commercial interests have since lost the structural position they held — the present weakness reflects that displacement.';
      score = 35;
    }
  }

  if (type === 'disaster') {
    if (prosState === 'stressed' && yrs <= maxAge('disaster', 'current_economy')) {
      relationship = 'unresolved';
      suffix = 'the settlement has not fully insulated itself from the pressures that calamity revealed.';
      score = 80 + sevBonus;
    } else if (legState !== 'fractured' && prosState !== 'stressed' && yrs <= maxAge('disaster', 'institutional')) {
      relationship = 'recovery';
      suffix = 'the institutional adaptations built during that crisis remain part of the settlement\'s structural character.';
      score = 40;
    }
  }

  if (type === 'religious') {
    const isWeak   = ['Minor','Suppressed'].includes(relPow);
    const isStrong = ['Dominant','Strong'].includes(relPow);
    if (isWeak && yrs > 60 && yrs <= maxAge('religious', 'institutional')) {
      relationship = 'drift';
      suffix = 'the religious institution\'s structural prominence has declined significantly since — the settlement\'s current secular character reflects a long displacement.';
      score = 55;
    } else if (isStrong && yrs > 60 && yrs <= maxAge('religious', 'institutional')) {
      relationship = 'drift';
      suffix = 'religious institutional prominence has been sustained since — the present strength is accumulated rather than recent.';
      score = 45;
    } else if (yrs <= maxAge('religious', 'faction_balance')) {
      relationship = 'unresolved';
      suffix = 'the tension between religious and secular authority it created has not been conclusively settled.';
      score = 35;
    }
  }

  if (type === 'magical') {
    if (['Dominant','Strong'].includes(arcPow) && yrs <= maxAge('magical', 'institutional')) {
      relationship = 'drift';
      suffix = 'arcane institutions carry embedded civic status that traces to the authority established then.';
      score = 50;
    } else if (yrs <= maxAge('magical', 'institutional')) {
      relationship = 'unresolved';
      suffix = 'the settlement\'s relationship between arcane practitioners and civic governance has been uncertain since.';
      score = 30;
    }
  }

  if (!relationship) return null;
  return { ev, relationship, suffix, score };
}

// ── Main export ────────────────────────────────────────────────────────────────
export function deriveLegacyAnnotations(history, settlement) {
  if (!history?.historicalEvents?.length) return [];

  const ps       = settlement.powerStructure || {};
  const es       = settlement.economicState  || {};
  const factions = ps.factions || [];
  const legState = classifyLegitimacy(ps.publicLegitimacy);
  const prosState= classifyProsperity(es.prosperity);
  const foodState= classifyFood(es.foodSecurity);

  const candidates = [];
  for (const ev of history.historicalEvents) {
    const match = scoreEvent(ev, legState, prosState, foodState, factions);
    if (match) candidates.push(match);
  }

  if (!candidates.length) return [];

  candidates.sort((a,b) => b.score - a.score);

  // One annotation per event type, max 3 total
  const seen = new Set();
  const result = [];
  for (const { ev, relationship, suffix, score } of candidates) {
    if (seen.has(ev.type)) continue;
    seen.add(ev.type);
    result.push({
      annotation: buildAnnotation(ev, relationship, suffix),
      eventType:  ev.type,
      yearsAgo:   ev.yearsAgo,
      severity:   ev.severity,
      eventName:  ev.name,
    });
    if (result.length >= 3) break;
  }
  return result;
}
