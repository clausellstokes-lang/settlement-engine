/**
 * domain/simulationSpine.js - Compact causal summary of a settlement.
 *
 * Tier 2.5 of the roadmap. The spine answers seven structured questions
 * about a settlement in single-line answers derived from existing
 * simulation fields. No new generator work needed; this is read-only
 * over current settlement state.
 *
 *   This settlement exists because...   (settlementReason / history)
 *   It survives by...                   (economy + resources)
 *   It is ruled by...                   (governance / dominant faction)
 *   Its real power lies with...         (faction power vs. legitimacy)
 *   It is currently strained by...      (stressors / volatility)
 *   Its people fear...                  (threats / conflicts)
 *   Its likely future is...             (tensions trajectory)
 *
 * Why this exists as a structured object instead of a paragraph:
 *   - The PipelineRail can render each line as a separate row.
 *   - The PDF can render it as a callout band on chapter 1.
 *   - The AI overlay can use individual lines as grounding prompts
 *     ("describe the temple's prominence given THIS spine").
 *   - The web app can show the spine on the dossier overview as a
 *     "spine card" - the user sees the settlement's identity in 7 lines.
 *
 * Tolerant of missing fields: every line falls back to a sensible
 * placeholder if the source data isn't present. A settlement loaded
 * from before this feature existed still produces a usable spine.
 *
 * Pure function - no I/O, no state, no React. Safe to call from
 * anywhere.
 */

// ── Helpers ────────────────────────────────────────────────────────────────

function firstNonEmpty(...candidates) {
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return null;
}

function topFactionByPower(power) {
  if (!power || !Array.isArray(power.factions) || power.factions.length === 0) return null;
  return [...power.factions].sort((a, b) => (b.power || 0) - (a.power || 0))[0];
}

function lowercaseFirst(s) {
  if (typeof s !== 'string' || !s) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// ── Per-line derivations ──────────────────────────────────────────────────
// Each one returns either a non-empty string or null. The composer
// (`deriveSimulationSpine`) substitutes a placeholder for null lines so
// the spine is always seven entries.

function deriveExistsBecause(s) {
  // settlementReason is the canonical "founding cause" field; historical
  // character is a secondary one. Both are free prose.
  const reason = firstNonEmpty(s.settlementReason);
  if (reason) return reason;

  const histChar = firstNonEmpty(s.history?.historicalCharacter);
  if (histChar) return `Founded in keeping with: "${histChar}"`;

  // Fallback derived from tier + tradeRoute.
  const tier = s.tier || 'settlement';
  const trade = s.config?.tradeRouteAccess;
  if (trade && trade !== 'isolated') {
    return `A ${tier} grew up along the ${trade.replace(/_/g, ' ')} route.`;
  }
  return `A ${tier} took root here for reasons no one writes down.`;
}

function deriveSurvivesBy(s) {
  // Strongest signal: top export from the economic state.
  const eco = s.economicState || s.economy || {};
  const topExport = firstNonEmpty(eco.topExport, eco.primaryExport);
  if (topExport) return `Its livelihood rests on ${lowercaseFirst(topExport)}.`;

  // Failing that, the prosperity band tells us how well it's doing.
  const band = firstNonEmpty(eco.prosperityBand, eco.prospBand);
  if (band) return `The economy runs on a ${band} footing, drawing on what the land yields.`;

  return 'Subsistence trade with neighbours and what the land offers.';
}

function deriveRuledBy(s) {
  const power = s.powerStructure || s.power;
  if (!power) return 'A loose informal authority no one questions yet.';

  // Governance label is the formal answer.
  const formal = firstNonEmpty(power.governanceType, power.governance);
  if (formal) {
    const factionName = firstNonEmpty(power.governingName);
    if (factionName) return `${formal} - currently ${factionName}.`;
    return `${formal}.`;
  }

  // Fall back to the highest-power faction.
  const top = topFactionByPower(power);
  if (top?.name) return `${top.name} holds nominal authority.`;
  return 'Authority is contested and unclear.';
}

function deriveRealPower(s) {
  // "Real power" is interesting only when it differs from "ruled by."
  // We compare the highest-power faction against the governing name.
  const power = s.powerStructure || s.power;
  if (!power) return null;

  const top = topFactionByPower(power);
  const governing = firstNonEmpty(power.governingName);

  if (!top) return null;
  if (governing && top.name && governing.toLowerCase() === top.name.toLowerCase()) {
    // Same. The spine entry becomes about legitimacy instead.
    const leg = power.publicLegitimacy?.label;
    if (leg && leg !== 'Endorsed') {
      return `The governing hand is also the strongest hand - but its legitimacy is ${leg.toLowerCase()}.`;
    }
    return 'Authority and power are aligned - for now.';
  }

  if (top.name) {
    return `${top.name} commands more practical influence than the formal authority does.`;
  }
  return null;
}

function deriveStrainedBy(s) {
  const stressors = s.stressors || s.stress;
  // Stressors can be a string, an array of strings, or an array of objects.
  if (typeof stressors === 'string' && stressors.trim()) {
    return `Strained by ${lowercaseFirst(stressors)}.`;
  }
  if (Array.isArray(stressors) && stressors.length) {
    const names = stressors.map(x => typeof x === 'string' ? x : (x?.label || x?.name)).filter(Boolean);
    if (names.length) {
      return `Strained by ${names.slice(0, 3).map(lowercaseFirst).join(', ')}${names.length > 3 ? ', and more' : ''}.`;
    }
  }

  // Economic / viability fallback.
  const issue = firstNonEmpty(s.economicViability?.issues?.[0]);
  if (issue) return `Strained by ${lowercaseFirst(issue)}.`;

  return 'Nothing strains it at the moment.';
}

function derivePeopleFear(s) {
  // Threats from defense profile.
  const threats = s.defenseProfile?.threats;
  if (Array.isArray(threats) && threats.length) {
    const labels = threats.map(t => typeof t === 'string' ? t : (t?.label || t?.name)).filter(Boolean);
    if (labels.length) {
      return `People fear ${labels.slice(0, 2).map(lowercaseFirst).join(' and ')}.`;
    }
  }

  // Conflicts from history.
  const recent = firstNonEmpty(s.powerStructure?.recentConflict);
  if (recent) return `People fear a return of ${lowercaseFirst(recent)}.`;

  // Aggregated from plot hooks.
  const hooks = Array.isArray(s.plotHooks) ? s.plotHooks : [];
  if (hooks.length) {
    return 'People watch the hooks that the DM hasn’t shown them yet.';
  }

  return 'No widely-shared dread - yet.';
}

function deriveLikelyFuture(s) {
  // Active tensions imply trajectory.
  const tensions = s.history?.currentTensions;
  if (Array.isArray(tensions) && tensions.length) {
    return `Tensions point toward ${lowercaseFirst(typeof tensions[0] === 'string' ? tensions[0] : (tensions[0]?.label || tensions[0]?.name || 'open conflict'))}.`;
  }

  // Power stability is a directional cue.
  const stability = firstNonEmpty(s.powerStructure?.stability);
  if (stability) {
    const s2 = stability.toLowerCase();
    if (s2.includes('critical') || s2.includes('desperate') || s2.includes('siege')) {
      return 'A crisis is imminent if no one intervenes.';
    }
    if (s2.includes('unstable') || s2.includes('volatile')) {
      return 'The next year will test whoever holds the chair.';
    }
    if (s2.includes('stable')) {
      return 'Continuity, with the usual slow erosion of any settlement.';
    }
  }

  return 'Whatever the table decides to make it.';
}

// ── Composer ──────────────────────────────────────────────────────────────

/**
 * Build the seven-line simulation spine. Tolerant of missing fields:
 * every line either succeeds or substitutes a placeholder so consumers
 * never need to guard against null.
 *
 * @param {Object} settlement
 * @returns {Object} { existsBecause, survivesBy, ruledBy, realPower,
 *                     strainedBy, peopleFear, likelyFuture }
 */
export function deriveSimulationSpine(settlement) {
  if (!settlement || typeof settlement !== 'object') {
    // Defensive - return a placeholder spine rather than throwing.
    return {
      existsBecause: 'Origin unknown.',
      survivesBy:    'Means unknown.',
      ruledBy:       'Authority unknown.',
      realPower:     null,
      strainedBy:    'No strain recorded.',
      peopleFear:    'No fears recorded.',
      likelyFuture:  'Future unwritten.',
    };
  }

  return {
    existsBecause: deriveExistsBecause(settlement),
    survivesBy:    deriveSurvivesBy(settlement),
    ruledBy:       deriveRuledBy(settlement),
    realPower:     deriveRealPower(settlement),
    strainedBy:    deriveStrainedBy(settlement),
    peopleFear:    derivePeopleFear(settlement),
    likelyFuture:  deriveLikelyFuture(settlement),
  };
}

/**
 * Render the spine as an ordered array of `[label, body]` pairs, ready
 * for the rail or PDF. Skips lines that came back null (only realPower
 * can be null today - it's deliberately omitted when authority and
 * real power are aligned).
 */
export function simulationSpineRows(settlement) {
  const spine = deriveSimulationSpine(settlement);
  const rows = [
    ['This settlement exists because',  spine.existsBecause],
    ['It survives by',                   spine.survivesBy],
    ['It is ruled by',                   spine.ruledBy],
    ['Its real power lies with',         spine.realPower],
    ['It is currently strained by',      spine.strainedBy],
    ['Its people fear',                  spine.peopleFear],
    ['Its likely future is',             spine.likelyFuture],
  ];
  return rows.filter(([, body]) => body != null && body !== '');
}
