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
 *
 * ⛔ DATED AT BIRTH, NEVER RE-DERIVED (WIRING-W0 cause 5, the chair's R-W7 (d), 2026-11-07). An annotation reads the
 * legitimacy, prosperity and food of the record AS IT IS BORN (historyCoherence.js re-runs this against the final
 * economicState, still at birth) and nothing refreshes it when a campaign advances, so its present-day half is a
 * fact of the founding survey, not of the living town. Each annotation therefore SAYS so, in its own text ("As of the
 * founding survey, …"), the way the history already dates every event relative to the record's birth ("N years
 * ago"). The text is the one home of the date: a field beside it was read by nothing (writer reach). A re-derive on
 * advance is the realm program's (after FPZ), not this file's.
 */

import { createGenerationWorldLaw } from './generationContext.js';

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

/** The annotation's own date, the record's birth, opens its text (R-W7 d). */
const AS_OF_OPENING = 'As of the founding survey, ';

function buildAnnotation(ev, relationship, suffix) {
  return AS_OF_OPENING + annotationBody(ev, relationship, suffix);
}

function annotationBody(ev, relationship, suffix) {
  // Mid-sentence after the date opening, an event named "The …" reads "the …". MERGE-R2 (the chair's
  // ruling 3): W0's dated form is the ruled one (w0-04), so F11's capitalised fallback, which opened
  // an undated annotation, is dropped: the fallback no longer opens a sentence.
  const name   = String(ev.name || 'a significant historical event').replace(/^The /, 'the ');
  const effect = (ev.lastingEffects || [])[0] || null;

  // relationship: 'unresolved' | 'recovery' | 'drift'
  const effectClause = effect
    ? ` What it left behind (${effect.charAt(0).toLowerCase() + effect.slice(1)}) is still part of the place.`
    : '';

  if (relationship === 'unresolved') {
    return `${name} (${ev.yearsAgo} years ago) left trouble that has never been put right: ${suffix}${effectClause}`;
  }
  if (relationship === 'recovery') {
    return `${name} (${ev.yearsAgo} years ago) hit the settlement hard, and it has since recovered: ${suffix}${effectClause}`;
  }
  if (relationship === 'drift') {
    return `${name} (${ev.yearsAgo} years ago) set up ways of doing things that have since changed: ${suffix}${effectClause}`;
  }
  return `${name} (${ev.yearsAgo} years ago): ${suffix}${effectClause}`;
}

// ── Match each event against current state ────────────────────────────────────
// ── MG-3c / leak L5 — THE MUNDANE VOICE OF AN OLD "MAGICAL" EVENT ─────────────
// Four variants per relationship slot (the SP-6 content-depth floor). The pick is a
// STABLE function of the event's own identity rather than an rng draw: this derivation
// runs from two different callers with no shared seeded stream, and a per-event pick
// means the same world always tells the same story while different events in the same
// settlement do not repeat one stock phrase. No rng is touched, so a world where magic
// functions is byte-identical.
const MUNDANE_LEGACY_VOICE = {
  drift: [
    'the institutions founded after it still hold the authority they were given then.',
    'the offices raised to answer it never gave the standing back. That authority is still theirs.',
    'the families who took charge of it kept the charge, and the town still defers to them.',
    'the emergency powers of that season quietly became the ordinary order of the place.',
  ],
  unresolved: [
    'the scholars who studied it and the settlement\'s rulers have never settled which of them has the say.',
    'no one ever settled who answers for it, and the question surfaces again in every hard year.',
    'the records of it are contested, and so is the authority that rests on them.',
    'the town has never agreed whether what happened then was a warning or a windfall.',
  ],
};

/**
 * A stable 0..3 index derived from an event's own identity — deterministic, pure, and
 * independent of any rng stream (see MUNDANE_LEGACY_VOICE above).
 * @param {any} ev @returns {number}
 */
function stableEventPick(ev) {
  const text = String(ev?.name ?? ev?.title ?? ev?.type ?? '') + String(ev?.yearsAgo ?? '');
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash % 4;
}

/**
 * The mundane re-voicing of a magical event's legacy suffix.
 * @param {any} ev @param {'drift'|'unresolved'} slot @returns {string}
 */
function mundaneLegacyVoice(ev, slot) {
  const pool = MUNDANE_LEGACY_VOICE[slot];
  return pool[stableEventPick(ev) % pool.length];
}

function scoreEvent(ev, legState, prosState, foodState, factions, magicFunctionsHere = true) {
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
      suffix = 'people\'s distrust of those who rule today began here, before the present troubles.';
      score = 90 + sevBonus;
    } else if (legState === 'contested' && yrs <= maxAge('political', 'legitimacy')) {
      relationship = 'unresolved';
      suffix = 'the quarrel over who should rule today is the same quarrel, never settled.';
      score = 70 + sevBonus;
    } else if (prosState === 'prosperous' && yrs <= maxAge('political', 'institutional')) {
      relationship = 'recovery';
      suffix = 'the present calm was partly built in the rebuilding that followed.';
      score = 45;
    } else if (yrs <= maxAge('political', 'governing_model')) {
      relationship = 'drift';
      suffix = 'the way the settlement is ruled today was largely settled then.';
      score = 30;
    }
  }

  if (type === 'economic') {
    if (prosState === 'stressed' && yrs <= maxAge('economic', 'current_economy')) {
      relationship = 'unresolved';
      suffix = 'the present money troubles began then, in what the settlement came to depend on.';
      score = 85 + sevBonus;
    } else if (foodState === 'crisis' && yrs <= maxAge('economic', 'current_food')) {
      relationship = 'unresolved';
      suffix = 'the food shortages of today began with it.';
      score = 80;
    } else if (prosState === 'prosperous' && yrs <= maxAge('economic', 'institutional')) {
      relationship = 'recovery';
      suffix = 'the trade that keeps the settlement prosperous today was rebuilt, piece by piece, after it.';
      score = 50;
    } else if (['Dominant','Strong'].includes(mercPow) && yrs <= maxAge('economic', 'faction_balance')) {
      relationship = 'drift';
      suffix = 'the merchants have mattered here ever since, and their power today was built up slowly over the years.';
      score = 40;
    } else if (['Minor','Suppressed'].includes(mercPow) && yrs > 20 && yrs <= maxAge('economic', 'faction_balance')) {
      relationship = 'drift';
      suffix = 'the merchants lost the place they held then, and have never won it back.';
      score = 35;
    }
  }

  if (type === 'disaster') {
    if (prosState === 'stressed' && yrs <= maxAge('disaster', 'current_economy')) {
      relationship = 'unresolved';
      suffix = 'the settlement is still exposed to the hardships that calamity showed it.';
      score = 80 + sevBonus;
    } else if (legState !== 'fractured' && prosState !== 'stressed' && yrs <= maxAge('disaster', 'institutional')) {
      relationship = 'recovery';
      suffix = 'the changes made to get through that crisis are still how the place works today.';
      score = 40;
    }
  }

  if (type === 'religious') {
    const isWeak   = ['Minor','Suppressed'].includes(relPow);
    const isStrong = ['Dominant','Strong'].includes(relPow);
    if (isWeak && yrs > 60 && yrs <= maxAge('religious', 'institutional')) {
      relationship = 'drift';
      suffix = 'the faith has lost much of its hold here since, and the settlement now runs its affairs with little say from the clergy.';
      score = 55;
    } else if (isStrong && yrs > 60 && yrs <= maxAge('religious', 'institutional')) {
      relationship = 'drift';
      suffix = 'the faith has kept its hold here ever since, and its strength today was built up over the years.';
      score = 45;
    } else if (yrs <= maxAge('religious', 'faction_balance')) {
      relationship = 'unresolved';
      suffix = 'the quarrel it started between the clergy and the settlement\'s rulers has never been settled.';
      score = 35;
    }
  }

  if (type === 'magical') {
    // MG-3c (leak L5): this arm branched on the event type alone and NEVER read the
    // world's magic law, so a settlement where magic does not function still had its
    // history explained by arcane practitioners and arcane civic status. History
    // generation already refuses to MINT magical events in such a world; what reaches
    // here is an authored or legacy event, and MG-LAW-4 says an authored premise
    // survives — so the event is kept and RE-VOICED in mundane terms rather than
    // dropped. A magical world reads exactly as it always did.
    const arcaneVoice = magicFunctionsHere !== false;
    if (['Dominant','Strong'].includes(arcPow) && yrs <= maxAge('magical', 'institutional')) {
      relationship = 'drift';
      suffix = arcaneVoice
        ? 'the arcane houses still hold the standing in public affairs they were given then.'
        : mundaneLegacyVoice(ev, 'drift');
      score = 50;
    } else if (yrs <= maxAge('magical', 'institutional')) {
      relationship = 'unresolved';
      suffix = arcaneVoice
        ? 'the mages and the settlement\'s rulers have never settled which of them has the say.'
        : mundaneLegacyVoice(ev, 'unresolved');
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

  // MG-3c (leak L5): the ONE arbiter every other generator consults. Built from the
  // settlement's own config (MG-LAW-1 — per-settlement truth, never a realm-level rule),
  // so a magical or axis-less settlement answers exactly as before.
  const magicFunctionsHere = createGenerationWorldLaw(settlement.config || {}).magicEnabled;

  const candidates = [];
  for (const ev of history.historicalEvents) {
    const match = scoreEvent(ev, legState, prosState, foodState, factions, magicFunctionsHere);
    if (match) candidates.push(match);
  }

  if (!candidates.length) return [];

  candidates.sort((a,b) => b.score - a.score);

  // One annotation per event type, max 3 total
  const seen = new Set();
  const result = [];
  for (const { ev, relationship, suffix, _score } of candidates) {
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
