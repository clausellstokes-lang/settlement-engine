/**
 * factionDynamics.js
 * Computes public legitimacy, performance multipliers, and faction
 * relationship matrix for the power structure.
 *
 * Three pillars of power:
 *   1. Raw power          — what a faction can physically do
 *   2. Institutional legitimacy — recognized right to act (from powerGenerator)
 *   3. Demonstrated legitimacy — earned through outcomes (computed here)
 *
 * Outputs:
 *   computePublicLegitimacy → score 0-100, label, breakdown, multipliers
 *   computeFactionRelationships → array of pair-wise relationship objects
 *   computeCriminalCaptureState → adversarial / equilibrium / corrupted / capture
 *   applyLegitimacyMultipliers → mutates faction array in place
 */

// ── Public legitimacy contributions ──────────────────────────────────────────
// Prosperity → ±20
const PROSPERITY_CONTRIB = {
  'Struggling': -20, 'Subsistence': -20,
  'Poor':       -10,
  'Moderate':     0,
  'Comfortable': +8,
  'Prosperous': +15,
  'Wealthy':    +20,
};

// Safety label → ±20 (matches by substring to handle stress-compound labels)
function safetyContrib(label) {
  if (!label) return 0;
  const l = label.toLowerCase();
  if (l.includes('desperate') || l.includes('dangerous') || l.includes('famine'))    return -20;
  if (l.includes('volatile')  || l.includes('tense')     || l.includes('strained'))  return -12;
  if (l.includes('suspicious')|| l.includes('unsafe'))                                return -8;
  if (l.includes('moderate'))                                                          return  0;
  if (l.includes('very safe') || l.includes('orderly'))                               return +20;
  if (l.includes('safe'))                                                              return +15;
  return 0;
}

// Defense readiness label → ±10. Exported as the SINGLE canonical map —
// assembleSettlement's legitimacy patch consumes this same table (it used to
// carry a stale local copy that lacked 'Lightly Defended', so the patch
// actively reverted that band's contribution to 0 on generated settlements).
export const DEFENSE_CONTRIB = {
  'Undefended':        -10,
  'Vulnerable':         -5,
  'Lightly Defended':   -2,  // readiness 24-37 — was missing, so the most common
                             // marginal band silently contributed 0 (same as Defensible)
  'Defensible':          0,
  'Well-Defended':      +7,
  'Fortress':          +10,
};

// Food security label → ±10
function foodContrib(label) {
  if (!label) return 0;
  const l = label.toLowerCase();
  if (l.includes('famine') || l.includes('deficit')) return -10;
  if (l.includes('dependent'))                       return  -5;
  if (l.includes('pressured'))                       return  -3;
  if (l.includes('surplus'))                         return +10;
  return 0; // Secure
}

/**
 * Compute the public legitimacy score (0-100) from settlement outcomes.
 * High score = population consents to governance. Low = legitimacy crisis.
 *
 * @param {Object} economicState   - from generateEconomicState
 * @param {string} defenseLabel    - readiness label from defenseProfile (may be null)
 * @param {string} tier
 * @returns {{ score:number, label:string, color:string, bg:string, breakdown:Object, govMultiplier:number, crimMultiplier:number, isEndorsed:boolean, isApproved:boolean, isTolerated:boolean, isContested:boolean, isLegitimacyCrisis:boolean, governanceFractured:boolean }}
 */
export function computePublicLegitimacy(economicState, defenseLabel, tier) {
  const prosperity    = economicState?.prosperity      || 'Moderate';
  const safetyLabel   = economicState?.safetyProfile?.safetyLabel || 'Moderate';
  const foodLabel     = economicState?.foodSecurity?.label || 'Secure';

  // Defense and food contributions are tier-scaled:
  // Small settlements being "Vulnerable" or "food pressured" is NORMAL, not governance failure.
  // Only at city+ scale do these represent actual policy failures.
  const defScale  = tier === 'thorp'   ? 0.3
                  : tier === 'hamlet'  ? 0.4
                  : tier === 'village' ? 0.6
                  : tier === 'town'    ? 0.85
                  : 1.0;
  const foodScale = tier === 'thorp'   ? 0.4
                  : tier === 'hamlet'  ? 0.5
                  : tier === 'village' ? 0.65
                  : tier === 'town'    ? 0.85
                  : 1.0;

  const pContrib = PROSPERITY_CONTRIB[prosperity] ?? 0;
  const sContrib = safetyContrib(safetyLabel);
  const dContrib = Math.round((DEFENSE_CONTRIB[defenseLabel] ?? 0) * defScale);
  const fContrib = Math.round(foodContrib(foodLabel) * foodScale);

  const score = Math.max(0, Math.min(100, 50 + pContrib + sContrib + dContrib + fContrib));

  // Label and color
  let label, color, bg;
  if      (score >= 75) { label = 'Endorsed';        color = '#1a5a28'; bg = '#f0faf4'; }
  else if (score >= 60) { label = 'Approved';         color = '#4a7a2a'; bg = '#f4faf0'; }
  else if (score >= 45) { label = 'Tolerated';        color = '#a0762a'; bg = '#faf8ec'; }
  else if (score >= 30) { label = 'Contested';        color = '#8a4010'; bg = '#fdf6ec'; }
  else                  { label = 'Legitimacy Crisis';color = '#8b1a1a'; bg = '#fdf4f4'; }

  // Governing authority performance multiplier
  const govMultiplier =
    score >= 75 ? 1.30 :
    score >= 60 ? 1.15 :
    score >= 45 ? 1.00 :
    score >= 30 ? 0.80 :
                  0.60;

  // Criminal faction inverse multiplier (crime fills the vacuum governance leaves)
  const crimMultiplier =
    score >= 75 ? 0.75 :
    score >= 60 ? 0.90 :
    score >= 45 ? 1.00 :
    score >= 30 ? 1.15 :
                  1.30;

  return {
    score,
    label,
    color,
    bg,
    breakdown: { prosperity: pContrib, safety: sContrib, defense: dContrib, food: fContrib },
    govMultiplier,
    crimMultiplier,
    isEndorsed:        score >= 75,
    isApproved:        score >= 60,
    isTolerated:       score >= 45 && score < 60,
    isContested:       score >= 30 && score < 45,
    isLegitimacyCrisis:score <  30,
    // Governing authority fracture — internal cohesion breaks below 30
    governanceFractured: score < 30,
  };
}


/**
 * Classify the criminal faction's relationship with formal power structures.
 * Three inflection points based on criminal power vs enforcement capacity.
 *
 * Birth-scale reconciliation with the play-time capture ladder
 * (domain/corruption.js CAPTURE_LADDER, same vocabulary):
 *  • The criminal finder EXCLUDES the governing seat. 'Corrupt Council' /
 *    'Shadow Senate' carry category 'criminal' (the 'Corrupt'/'Shadow'
 *    keywords), so the old finder compared the government against ITSELF —
 *    ratio exactly 1.0, which read 'corrupted' whenever safety was low,
 *    an artifact rather than a classification.
 *  • A criminal-flavoured GOVERNMENT is classified deliberately instead:
 *    the council is purchased at birth → at least 'corrupted'. Those names
 *    only mint when criminal is the dominant priority (>65), so ordinary
 *    settlements can't reach this branch.
 *  • Gates are calibrated to what the mint actually produces (criminal
 *    power ≈ 12×criminalEffective/50, ceiling ~24 before legitimacy
 *    multipliers ~31 after, vs governing ~26-61): deeply criminal births
 *    read equilibrium/corrupted; full capture — the underworld overtopping
 *    even its purchased government with enforcement broken — stays
 *    extraordinary (the play-time ladder is how a campaign gets there).
 *
 * @param {Array}  factions   - faction array
 * @param {number} safetyRatio
 * @param {Object} _instFlags
 * @returns {'none'|'adversarial'|'equilibrium'|'corrupted'|'capture'}
 */
export function computeCriminalCaptureState(factions, safetyRatio, _instFlags) {
  const isCrim = f => f.category === 'criminal' || f.faction?.toLowerCase().includes('thiev');
  const crim = factions.find(f => !f.isGoverning && isCrim(f));
  const gov  = factions.find(f => f.isGoverning);
  const govPurchased = !!(gov && isCrim(gov));
  if (!crim || crim.power < 5) {
    // No independent underworld faction, but the government itself is
    // criminal-flavoured: the purchase happened before the founding charter
    // was dry. Enforcement still has to be compromised for it to matter.
    return govPurchased && safetyRatio < 0.65 ? 'corrupted' : 'none';
  }

  const mil  = factions.find(f => f.faction?.toLowerCase().includes('military') || f.faction?.toLowerCase().includes('guard'));
  const crimP = crim.power;
  const milP  = mil?.power  || 0;
  const govP  = gov?.power  || 1;

  // Capture: a REAL underworld (crimP ≥ 24 needs the legitimacy/stress
  // multipliers on top of a maxed criminal mint) DOMINATES a still-standing
  // government (govP ≥ 15 — a single-digit government is a power vacuum,
  // not a capture: there is nothing left to wear as a front), with
  // enforcement broken. Measured ~1-2% across 90-criminal-priority seed
  // sweeps (380 seeds); ordinary sweeps read 0.
  if (crimP > govP * 1.5 && crimP >= 24 && govP >= 15 && safetyRatio < 0.35) return 'capture';

  // Corrupted: the council is purchased — born criminal-flavoured, or the
  // underworld's weight approaches the government's with enforcement bought.
  if (govPurchased && safetyRatio < 0.65) return 'corrupted';
  if (crimP > govP * 0.8 && safetyRatio < 0.55 && milP > 0)  return 'corrupted';

  // Equilibrium: criminal coexists with enforcement — tacit tolerance
  if (crimP > govP * 0.4 && safetyRatio < 0.9)  return 'equilibrium';

  // Adversarial: criminal is present but enforcement is winning
  if (crimP >= 5) return 'adversarial';

  return 'none';
}


/**
 * Compute pairwise faction relationships.
 *
 * @param {Array}  factions
 * @param {string} tier
 * @param {Object} instFlags    - from getInstFlags
 * @param {Object} publicLeg   - from computePublicLegitimacy
 * @param {Array}  stressTypes
 * @returns {Array} relationship objects
 */
export function computeFactionRelationships(factions, tier, instFlags, publicLeg, stressTypes = []) {
  const rels = [];
  const stressed = t => stressTypes.includes(t);

  // Helper: find faction by category or name keywords (EXCLUDING the governing faction
  // when looking for secondary factions, to prevent self-relationships)
  const find = (...keys) => factions.find(f => {
    const n = (f.faction || '').toLowerCase();
    const c = (f.category || '').toLowerCase();
    return keys.some(k => n.includes(k) || c.includes(k));
  });
  // Find a faction that is NOT the governing authority
  const findNonGov = (...keys) => factions.find(f => {
    if (f.isGoverning) return false;
    const n = (f.faction || '').toLowerCase();
    const c = (f.category || '').toLowerCase();
    return keys.some(k => n.includes(k) || c.includes(k));
  });
  // Guard: skip if pair would be self-referential
  const addRel = (obj) => {
    if (obj.pair?.[0] === obj.pair?.[1]) return; // skip self-relationships
    rels.push(obj);
  };

  const gov  = factions.find(f => f.isGoverning);
  const mil  = find('military', 'guard');
  const merc = findNonGov('merchant guild', 'merchant guilds', 'merchant oligarchy', 'grand guild', 'guild council');
  const craft= find('craft guild', 'artisan');
  const rel  = find('religious', 'church', 'clergy');
  const crim = findNonGov('thiev', 'criminal', 'underworld', 'shadow');
  const noble= find('noble', 'landed gentry', 'manor');
  const _arcane=find('arcane', 'wizard', 'mage');

  const safetyRatio  = instFlags?.safetyRatio || 1.0;
  const crimCapture  = computeCriminalCaptureState(factions, safetyRatio, instFlags);

  // ── Governing ↔ Military ────────────────────────────────────────────────────
  if (gov && mil) {
    const ratio = mil.power / Math.max(1, gov.power);
    let type, direction, narrative;

    if (ratio <= 0.5) {
      type = 'subordinate';
      narrative = `${mil.faction} operates as the executive arm of ${gov.faction}. Command authority is unambiguous. Soldiers enforce rather than govern.`;
    } else if (ratio <= 0.85) {
      type = 'symbiotic';
      narrative = `${gov.faction} commands, ${mil.faction} executes. A functional partnership: each depends on the other remaining effective.`;
    } else if (ratio <= 1.2) {
      type = 'tense';
      narrative = `${mil.faction} and ${gov.faction} hold roughly equal power. The commander's cooperation is sought, not commanded. Political decisions increasingly require military endorsement.`;
    } else {
      type = 'competitive';
      narrative = `${mil.faction} has outgrown civilian control. ${gov.faction} retains the title of governance; ${mil.faction} makes the consequential decisions.`;
    }

    direction = stressed('under_siege') ? 'escalating'  // military power rising in crisis
              : stressed('indebted')    ? 'declining'    // underfunded military weakening
              : ratio > 1.0             ? 'escalating'   // military gaining on governance
              : 'stable';

    addRel({ pair: [gov.faction, mil.faction], type, direction, ratio: Math.round(ratio*100)/100, narrative,
      dmNote: type === 'competitive' ? 'The garrison commander is a political actor. His cooperation must be maintained, purchased, or circumvented.' : null });
  }

  // ── Governing ↔ Merchant ────────────────────────────────────────────────────
  if (gov && merc) {
    const ratio = merc.power / Math.max(1, gov.power);
    let type, direction, narrative;

    if (ratio >= 1.2) {
      type = 'competitive';
      narrative = `${merc.faction} provides more practical governance of daily commercial life than ${gov.faction}. Tax policy is negotiated, not imposed.`;
    } else if (ratio >= 0.6) {
      type = 'dependent';
      narrative = `Mutual dependence: ${gov.faction} needs merchant taxes and loans, ${merc.faction} needs contract enforcement and stable law. Neither can afford to destroy the other.`;
    } else {
      type = 'subordinate';
      narrative = `${merc.faction} operates within the governance framework ${gov.faction} sets. Political access is purchased, not assumed.`;
    }

    direction = (instFlags?.economyOutput > 65) ? 'escalating'    // merchant wealth growing
              : stressed('plague_onset') || stressed('indebted') ? 'declining'
              : 'stable';

    addRel({ pair: [gov.faction, merc.faction], type, direction, ratio: Math.round(ratio*100)/100, narrative });
  }

  // ── Governing ↔ Religious ───────────────────────────────────────────────────
  if (gov && rel) {
    const ratio = rel.power / Math.max(1, gov.power);
    let type, direction, narrative;

    // If governing authority IS theocratic — special case
    const govIsTheocratic = (gov.faction || '').toLowerCase().includes('church') ||
                            (gov.faction || '').toLowerCase().includes('theocrat') ||
                            (gov.faction || '').toLowerCase().includes('ecclesiast');

    if (govIsTheocratic) {
      type = 'symbiotic';
      narrative = `${rel.faction} and ${gov.faction} are functionally the same institution. Religious legitimacy is the foundation of civic authority here.`;
    } else if (ratio >= 1.1) {
      type = 'tense';
      narrative = `${rel.faction} holds more effective influence than ${gov.faction} in significant domains: welfare, marriage, inheritance, moral authority. Jurisdiction disputes are ongoing.`;
    } else if (ratio >= 0.5) {
      type = 'dependent';
      narrative = `${gov.faction} provides the sword; ${rel.faction} provides the moral framework that makes taxation feel just and authority feel ordained. Each legitimises the other.`;
    } else {
      type = 'subordinate';
      narrative = `${rel.faction} operates within civic structures ${gov.faction} controls. Clergy serve a pastoral function without independent political leverage.`;
    }

    direction = stressed('religious_conversion') ? 'escalating'  // religious tension rising
              : stressed('plague_onset')         ? 'escalating'  // church gains legitimacy in crisis
              : 'stable';

    addRel({ pair: [gov.faction, rel.faction], type, direction, ratio: Math.round(ratio*100)/100, narrative });
  }

  // ── Governing ↔ Criminal ────────────────────────────────────────────────────
  if (gov && crim) {
    let type, direction, narrative;

    if (crimCapture === 'capture') {
      type = 'corrupted';
      narrative = `${gov.faction} is a front. ${crim.faction} makes the actual decisions on taxation, law enforcement priority, and appointments. The fiction of legitimate governance is maintained because it is useful.`;
    } else if (crimCapture === 'corrupted') {
      type = 'corrupted';
      narrative = `${crim.faction} has systematic arrangements with key figures in ${gov.faction}. Enforcement decisions are predictable: profitable crimes go unpunished, competitive threats are selectively prosecuted.`;
    } else if (crimCapture === 'equilibrium') {
      type = 'tense';
      narrative = `${gov.faction} tolerates ${crim.faction} because suppression costs more than it saves. ${crim.faction} avoids open provocation because it needs the governance structure to remain functional enough to extract from.`;
    } else {
      type = 'competitive';
      narrative = `${gov.faction} actively suppresses ${crim.faction}. Enforcement is genuine but incomplete. ${crim.faction} retreats and reorganises rather than disappearing.`;
    }

    direction = publicLeg.isLegitimacyCrisis ? 'escalating'    // governance crisis empowers crime
              : publicLeg.isEndorsed          ? 'declining'     // strong governance suppresses crime
              : 'stable';

    addRel({ pair: [gov.faction, crim.faction], type, direction,
      captureState: crimCapture, narrative,
      dmNote: crimCapture !== 'adversarial' && crimCapture !== 'none'
        ? `Ask: which specific officials have arrangements with ${crim.faction}? The answer drives dozens of plot hooks.`
        : null });
  }

  // ── Merchant ↔ Craft ────────────────────────────────────────────────────────
  if (merc && craft) {
    const ratio = merc.power / Math.max(1, craft.power);
    let type, direction, narrative;

    if (ratio >= 1.8) {
      type = 'competitive';
      narrative = `${merc.faction} sets prices, controls material supply, and markets finished goods. ${craft.faction} produces them. The distinction between independent artisan and disguised wage labour is blurring.`;
    } else if (ratio >= 0.7) {
      type = 'tense';
      narrative = `${merc.faction} and ${craft.faction} are structural allies against feudal extraction and structural rivals over value distribution. They vote together, then argue about the proceeds.`;
    } else {
      type = 'tense';
      narrative = `${craft.faction} holds unusual production leverage over ${merc.faction}. Quality monopolies and guild mysteries give artisan masters pricing power the merchants must negotiate around.`;
    }

    direction = (instFlags?.economyOutput > 65) ? 'escalating'  // expanding economy; who captures the surplus?
              : 'stable';

    addRel({ pair: [merc.faction, craft.faction], type, direction, ratio: Math.round(ratio*100)/100, narrative });
  }

  // ── Criminal ↔ Military ─────────────────────────────────────────────────────
  if (crim && mil) {
    let type, direction, narrative;

    if (crimCapture === 'corrupted' || crimCapture === 'capture') {
      type = 'corrupted';
      narrative = `${mil.faction} and ${crim.faction} have a working arrangement. Patrol routes avoid certain streets. Certain arrests never happen. The rank and file may not know; the command does.`;
    } else if (crimCapture === 'equilibrium') {
      type = 'tense';
      narrative = `${mil.faction} knows where ${crim.faction} operates. ${crim.faction} knows the watch rotation. Neither pushes the other hard enough to force a confrontation. This is not peace, but managed coexistence.`;
    } else {
      type = 'competitive';
      narrative = `${mil.faction} actively hunts ${crim.faction}. Arrests are real, enforcement is genuine. ${crim.faction} uses superior local knowledge and social embeddedness to absorb pressure and reconstitute.`;
    }

    direction = publicLeg.isContested || publicLeg.isLegitimacyCrisis ? 'escalating' : 'stable';

    addRel({ pair: [crim.faction, mil.faction], type, direction, captureState: crimCapture, narrative });
  }

  // ── Merchant ↔ Religious (at town+ scale) ──────────────────────────────────
  if (merc && rel && ['town','city','metropolis'].includes(tier)) {
    const merP = merc.power, relP = rel.power;
    let type, _direction, narrative;

    if (merP >= 20 && relP >= 15) {
      type = 'tense';
      narrative = `${merc.faction} and ${rel.faction} compete for the same population's loyalty and resources. Church tithes and merchant contracts both claim priority on household income. Church land exemptions and usury restrictions shape commercial strategy in ways merchants resent.`;
    } else if (merP > relP * 1.5) {
      type = 'competitive';
      narrative = `${merc.faction}'s capital has outpaced ${rel.faction}'s institutional influence. Merchants fund churches, endow hospitals, and purchase indulgences, but on their terms.`;
    } else {
      type = 'dependent';
      narrative = `${rel.faction} and ${merc.faction} sustain each other: church institutions provide charity that keeps social stability, merchants provide endowments that fund them. Neither is comfortable with the other's power.`;
    }

    addRel({ pair: [merc.faction, rel.faction], type, direction: 'stable', narrative });
  }

  // ── Noble ↔ Governing (feudal dynamics) ────────────────────────────────────
  if (noble && gov && !gov.faction?.toLowerCase().includes('feudal')) {
    const ratio = noble.power / Math.max(1, gov.power);
    let type, narrative;

    type = ratio >= 0.9 ? 'tense'
         : ratio >= 0.5 ? 'dependent'
         : 'subordinate';

    narrative = ratio >= 0.9
      ? `${noble.faction} hold hereditary rights ${gov.faction} cannot simply revoke. Council decisions touching land tenure, inheritance, or military levies require noble cooperation, not just noble compliance.`
      : ratio >= 0.5
      ? `${noble.faction} operate within ${gov.faction}'s framework but retain enough independent claim (land rights, judicial privilege, military obligation) to negotiate rather than merely obey.`
      : `${noble.faction} are present in civic life but declining; merchant capital and institutional governance have eroded the leverage that hereditary title once guaranteed.`;

    addRel({ pair: [noble.faction, gov.faction], type, direction: 'declining', ratio: Math.round(ratio*100)/100, narrative });
  }

  // Deduplicate by pair (sorted key) — prevents double-relationships
  const seen = new Set();
  return rels.filter(r => {
    const key = [...(r.pair || [])].sort().join('||');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


// Largest-remainder renormalisation to integer points summing to exactly 100.
// File-local copy of powerGenerator's renormalizeFactionPower: factionDynamics
// must NOT import from powerGenerator (powerGenerator already imports THIS module,
// so importing back would close an import cycle the architecture test bans).
function renormTo100(factions) {
  if (!factions || !factions.length) return;
  const total = factions.reduce((s, f) => s + (f.power || 0), 0);
  if (total <= 0) return;
  const shares = factions.map((f, i) => {
    const exact = ((f.power || 0) / total) * 100;
    const floor = Math.floor(exact);
    return { i, floor, remainder: exact - floor };
  });
  let leftover = 100 - shares.reduce((s, x) => s + x.floor, 0);
  shares.slice().sort((a, b) => b.remainder - a.remainder || a.i - b.i)
    .forEach((s) => { if (leftover > 0) { s.floor += 1; leftover -= 1; } });
  shares.forEach((s) => { factions[s.i].power = s.floor; });
}

/**
 * Apply performance legitimacy multipliers to faction powers in place.
 * Governing faction gets govMultiplier. Criminal faction gets crimMultiplier.
 * All other factions get minor friction adjustments.
 * Applies a power floor of 5 to existing factions.
 *
 * @param {Array}  factions
 * @param {Object} publicLeg   - from computePublicLegitimacy
 * @param {string} _tier
 */
export function applyLegitimacyMultipliers(factions, publicLeg, _tier) {
  const POWER_FLOOR = 5;

  factions.forEach(f => {
    const n = (f.faction || '').toLowerCase();
    const isGov   = f.isGoverning;
    const isCrim  = n.includes('thiev') || n.includes('criminal') || n.includes('underworld') || f.category === 'criminal';
    const isMil   = n.includes('military') || n.includes('guard');
    const isMerc  = n.includes('merchant') || n.includes('guild consortium');
    const isRel   = n.includes('religious') || n.includes('church') || n.includes('clergy');

    let mult = 1.0;

    if (isGov) {
      mult = publicLeg.govMultiplier;
      // Tag legitimacy crisis on governing faction
      if (publicLeg.governanceFractured) {
        f.legitimacyCrisis = true;
        f.crisisNote = 'Governing authority is internally fractured. Real decisions are being made informally. The faction that appears to govern is not the faction that governs.';
      }
    } else if (isCrim) {
      mult = publicLeg.crimMultiplier;
    } else if (isMil && publicLeg.isLegitimacyCrisis) {
      mult = 1.10; // Military gains in governance vacuum
    } else if (isRel && (publicLeg.isContested || publicLeg.isLegitimacyCrisis)) {
      mult = 1.08; // Church gains legitimacy relative to struggling governance
    } else if (isMerc && publicLeg.isEndorsed) {
      mult = 1.05; // Prosperous conditions benefit merchants
    }

    f.rawPower = f.power; // preserve original for display
    f.power    = Math.max(POWER_FLOOR, Math.round(f.power * mult));
  });

  // Restore the share invariant. The multipliers above change each faction's
  // RELATIVE power but leak the roster total off 100 — worst on small rosters
  // where a penalised governing faction is a large share (a thorp council could
  // sum to ~85%). Renormalise to integer points summing to exactly 100,
  // preserving the relative shifts; rawPower keeps the pre-dynamics value for the
  // raw→effective display. (Audit finding: faction-power leak.)
  renormTo100(factions);

  // Labels read the FINAL renormalised share so a faction's band matches its
  // displayed percentage.
  factions.forEach(f => {
    f.powerLabel = f.power >= 35 ? 'Dominant'
                 : f.power >= 25 ? 'Strong'
                 : f.power >= 18 ? 'Significant'
                 : f.power >= 10 ? 'Minor'
                 : 'Suppressed';
  });

  // Sort by effective power descending
  factions.sort((a, b) => (b.power || 0) - (a.power || 0));
}
