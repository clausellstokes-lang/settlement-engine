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

import { LEGITIMACY_CUTS, legitimacyBandOf } from '../data/bandLadders.js';
import { STRESS_POWER_FACES } from '../data/stressPowerFaces.js';
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
  if (l.includes('critical')   || l.includes('desperate')
      || l.includes('dangerous') || l.includes('famine'))                             return -20;
  if (l.includes('restricted') || l.includes('volatile')
      || l.includes('tense') || l.includes('strained'))                               return -12;
  if (l.includes('quarantined') || l.includes('suspicious') || l.includes('unsafe'))   return  -8;
  // An authoritarian peace suppresses ordinary crime but exacts legitimacy:
  // order without consent is deliberately worse than Moderate, not a crisis.
  if (l.includes('controlled'))                                                           return  -5;
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

// Tier scale for the defense contribution to public legitimacy. Exported so
// assembleSettlement's real-readiness patch applies the SAME scale — the
// unscaled patch stamped spurious small-tier legitimacy crises (a thorp being
// "Vulnerable" is normal life, not governance failure).
export const legitimacyDefScale = (tier) =>
  tier === 'thorp'   ? 0.3
  : tier === 'hamlet'  ? 0.4
  : tier === 'village' ? 0.6
  : tier === 'town'    ? 0.85
  : 1.0;

/**
 * The SINGLE public-legitimacy band derivation (cycle-3 Wave 2, chokepoint for
 * the M5 class). score → { label, color, bg, multipliers, boolean flags }. This
 * band map used to be hand-rolled in TWO places — computePublicLegitimacy (below)
 * and assembleSettlement's defense-readiness patch — which is exactly how the
 * patch drifted: it re-stamped label/color/multipliers on a band crossing but
 * forgot `bg` (M5). Both now delegate here, so the (label, color, bg, multiplier,
 * flag) tuple can never disagree across the band boundary again.
 *
 * NOTE (deferred): src/domain/timeProgression.js reBand() re-derives the same band
 * at PLAY time. It is intentionally NOT unified here: it lives in src/domain and
 * importing this generator export would trip the domain→generators boundary ratchet
 * (tests/build/domainGeneratorsBoundary.test.js), and its output feeds the parked
 * worldPulse goldens — a play-time change belongs to a worldPulse lane, not this
 * generation-side, golden-neutral wave. Documented, not a missed instance.
 *
 * @param {number} score  a 0..100 legitimacy score (already clamped by the caller).
 * @returns {{ label: string, color: string, bg: string, govMultiplier: number,
 *   crimMultiplier: number, isEndorsed: boolean, isApproved: boolean,
 *   isTolerated: boolean, isContested: boolean, isLegitimacyCrisis: boolean,
 *   governanceFractured: boolean }}
 */
export function legitimacyBandFor(score) {
  const { label, color, bg, govMultiplier, crimMultiplier } = legitimacyBandOf(score);
  return {
    label, color, bg, govMultiplier, crimMultiplier,
    isEndorsed:          score >= LEGITIMACY_CUTS.endorsed,
    isApproved:          score >= LEGITIMACY_CUTS.approved,
    isTolerated:         score >= LEGITIMACY_CUTS.tolerated && score < LEGITIMACY_CUTS.approved,
    isContested:         score >= LEGITIMACY_CUTS.contested && score < LEGITIMACY_CUTS.tolerated,
    isLegitimacyCrisis:  score <  LEGITIMACY_CUTS.contested,
    governanceFractured: score <  LEGITIMACY_CUTS.contested,
  };
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
  const defScale  = legitimacyDefScale(tier);
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

  // Label / colour / bg / multipliers / flags — via the single band derivation
  // (legitimacyBandFor), the chokepoint assembleSettlement's patch also uses.
  const band = legitimacyBandFor(score);

  // Key order preserved verbatim (this object is JSON.stringify-hashed in the
  // generator golden master): score, label, color, bg, breakdown, then the rest.
  return {
    score,
    label:              band.label,
    color:              band.color,
    bg:                 band.bg,
    breakdown: { prosperity: pContrib, safety: sContrib, defense: dContrib, food: fContrib },
    govMultiplier:      band.govMultiplier,
    crimMultiplier:     band.crimMultiplier,
    isEndorsed:         band.isEndorsed,
    isApproved:         band.isApproved,
    isTolerated:        band.isTolerated,
    isContested:        band.isContested,
    isLegitimacyCrisis: band.isLegitimacyCrisis,
    // Governing authority fracture — internal cohesion breaks below 30
    governanceFractured: band.governanceFractured,
  };
}


/**
 * Classify the criminal faction's relationship with formal power structures.
 * Three inflection points based on criminal power vs enforcement capacity.
 *
 * Wave 7 #1 — birth-scale reconciliation with the play-time capture ladder
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
 * The governing ↔ criminal relation row for a capture rung (the row computeFactionRelationships adds; ALLEGIANCE-CAR2
 * extracted it unchanged so the coherence seam re-reads it from the DERIVED state, the chair's ruling on STOP 3).
 * @param {{faction: string}} gov @param {{faction: string}} crim @param {string} crimCapture the capture rung
 * @param {{isLegitimacyCrisis?: boolean, isEndorsed?: boolean}} publicLeg
 */
export function govCriminalRelation(gov, crim, crimCapture, publicLeg) {
  let type, direction, narrative;

  if (crimCapture === 'capture') {
    type = 'corrupted';
    narrative = `${gov.faction} is a front. ${crim.faction} decides the taxes, who gets arrested and who gets office; the hall keeps up appearances because that suits ${crim.faction}.`;
  } else if (crimCapture === 'corrupted') {
    type = 'corrupted';
    narrative = `${crim.faction} has bought key people in ${gov.faction}. Its own crimes go unpunished, and its rivals are the ones who get arrested.`;
  } else if (crimCapture === 'equilibrium') {
    type = 'tense';
    narrative = `${gov.faction} leaves ${crim.faction} alone because stamping it out would cost more than it saves. ${crim.faction} keeps its head down, because it needs the hall standing to feed off it.`;
  } else {
    type = 'competitive';
    narrative = `${gov.faction} is hunting ${crim.faction} in earnest but not catching all of it; ${crim.faction} pulls back and regroups, and does not go away.`;
  }

  direction = publicLeg.isLegitimacyCrisis ? 'escalating'    // governance crisis empowers crime
            : publicLeg.isEndorsed          ? 'declining'     // strong governance suppresses crime
            : 'stable';

  return { pair: [gov.faction, crim.faction], type, direction,
    captureState: crimCapture, narrative,
    dmNote: crimCapture !== 'adversarial' && crimCapture !== 'none'
      ? `Ask: which specific officials have arrangements with ${crim.faction}? The answer drives dozens of plot hooks.`
      : null };
}

/**
 * The criminal ↔ military relation row for a capture rung (extracted unchanged, as above).
 * @param {{faction: string}} crim @param {{faction: string}} mil @param {string} crimCapture the capture rung
 * @param {{isContested?: boolean, isLegitimacyCrisis?: boolean}} publicLeg
 */
export function criminalMilitaryRelation(crim, mil, crimCapture, publicLeg) {
  let type, direction, narrative;

  if (crimCapture === 'corrupted' || crimCapture === 'capture') {
    type = 'corrupted';
    narrative = `${mil.faction} and ${crim.faction} have a working arrangement. Patrol routes avoid certain streets. Certain arrests never happen. The rank and file may not know; the command does.`;
  } else if (crimCapture === 'equilibrium') {
    type = 'tense';
    narrative = `${mil.faction} knows where ${crim.faction} works, and ${crim.faction} knows the patrol rota. Neither pushes the other hard enough to start a fight.`;
  } else {
    type = 'competitive';
    narrative = `${mil.faction} is hunting ${crim.faction} in earnest and making real arrests; ${crim.faction} knows the streets and the people better, hides, and comes back.`;
  }

  direction = publicLeg.isContested || publicLeg.isLegitimacyCrisis ? 'escalating' : 'stable';

  return { pair: [crim.faction, mil.faction], type, direction, captureState: crimCapture, narrative };
}

/**
 * THE CAPTURE ROWS READ THE ONE STATE (ALLEGIANCE-CAR2; J-13 read with the chair's ruling on STOP 3: "a relation row that
 * carries a `captureState` or 'is a front' is a reader … the rows must read the one writer"). A copy of `powerStructure`
 * whose relation rows that carry a `captureState` are rebuilt for `state` — the derived hall-capture state the coherence
 * seam just wrote — by the same two builders, so their type, rung, narrative and DM note follow it. A row whose powers
 * are no longer on the roster is kept as it is. Draw-free; never mutates its input.
 * @param {any} powerStructure @param {string} state @returns {any}
 */
export function withCaptureRelations(powerStructure, state) {
  const rows = Array.isArray(powerStructure?.factionRelationships) ? powerStructure.factionRelationships : null;
  if (!rows || !rows.some((r) => r && r.captureState !== undefined)) return powerStructure;
  const factions = Array.isArray(powerStructure.factions) ? powerStructure.factions : [];
  const byName = (name) => factions.find((f) => f?.faction === name) || null;
  const publicLeg = powerStructure.publicLegitimacy || {};
  const factionRelationships = rows.map((row) => {
    if (!row || row.captureState === undefined || !Array.isArray(row.pair)) return row;
    const [a, b] = row.pair.map(byName);
    if (!a || !b) return row;
    return a.isGoverning ? govCriminalRelation(a, b, state, publicLeg) : criminalMilitaryRelation(a, b, state, publicLeg);
  });
  return { ...powerStructure, factionRelationships };
}

/**
 * Compute pairwise faction relationships.
 *
 * @param {Array}  factions
 * @param {string} tier
 * @param {Object} instFlags    - from getInstFlags
 * @param {Object} publicLeg   - from computePublicLegitimacy
 * @param {Array}  stressTypes
 * @param {{ hasGarrison?: boolean, hasMercenary?: boolean, hasHospital?: boolean } | null} [defenseFacts]
 *   the place's standing forces (`domain/defense/defenseFacts.js :: defenseFactsOf`); null keeps
 *   the line unconditional for a caller that holds no roster
 * @returns {Array} relationship objects
 */

/**
 * THE MERCHANTS' AND CRAFTSMEN'S VOTE, A DECLARED PAIR (COHERENCE-POWERS-3, F2; the chair's ruling (a)). `against` names
 * the landholding power and NEEDS it on the page; `sibling` names no third power. The relationship is drawn here, at the
 * power step; the density law may trim the landholding power afterwards, and the assembly's settling pass
 * (power/rosterText.js :: settleNarrativesToRoster) then takes the sibling by the refused-winner rule, with no roll.
 */
export const MERCHANT_CRAFT_VOTE = Object.freeze({
  needs: 'the landholding power it names',
  against: (/** @type {string} */ merchants, /** @type {string} */ craft, /** @type {string} */ landholders) => `${merchants} and ${craft} vote together against ${landholders}, then fight over who keeps the profit.`,
  sibling: (/** @type {string} */ merchants, /** @type {string} */ craft) => `${merchants} and ${craft} vote together whenever trade is at stake, then fight over who keeps the profit.`,
});

export function computeFactionRelationships(factions, tier, instFlags, publicLeg, stressTypes = [], defenseFacts = null) {
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

    // R3-CODE-C (ROUND-3-CUT #1074, HIGH: "Merchant Guild Council gives the orders and Occupation Authority carries
    // them out" beside the crisis's "its own officials take their orders"): a power an occupation sends in (the
    // table's appointed row, data/stressPowerFaces.js) is filed under the military category, so `mil` can be the
    // occupier. Its row says what the crisis is at every band: the hall carries out what the occupier decides (the
    // subordinate frame, its parties the other way round). Its kind never says the hall commands (subordinate) or
    // that each needs the other (symbiotic); the bands above those (tense, competitive) stand.
    const occupier = STRESS_POWER_FACES.some((row) => row.appointed && row.power === mil.faction && stressed(row.stress));

    if (occupier) {
      type = ratio > 1.2 ? 'competitive' : 'tense';
      narrative = `${gov.faction} carries out what ${mil.faction} decides.`;
    } else if (ratio <= 0.5) {
      type = 'subordinate';
      // R6 (soak 1000 rung 1, kind 4): the soldiers sentence needs soldiers on the record, a
      // garrison or a hired company (the defence-words check's own reading of the word).
      const soldiersStand = !defenseFacts || defenseFacts.hasGarrison || defenseFacts.hasMercenary;
      narrative = `${mil.faction} carries out what ${gov.faction} decides.${soldiersStand ? ' The soldiers enforce the law; they do not make it.' : ''}`;
    } else if (ratio <= 0.85) {
      type = 'symbiotic';
      narrative = `${gov.faction} gives the orders and ${mil.faction} carries them out; each needs the other to stay strong.`;
    } else if (ratio <= 1.2) {
      type = 'tense';
      narrative = `${mil.faction} is now about as strong as ${gov.faction}. The hall asks for the commander's agreement instead of giving orders, and less and less is decided without it.`;
    } else {
      type = 'competitive';
      narrative = `${mil.faction} no longer takes orders from ${gov.faction}. ${gov.faction} keeps the title; ${mil.faction} makes the decisions that matter.`;
    }

    direction = stressed('under_siege') ? 'escalating'  // military power rising in crisis
              : stressed('indebted')    ? 'declining'    // underfunded military weakening
              : ratio > 1.0             ? 'escalating'   // military gaining on governance
              : 'stable';

    addRel({ pair: [gov.faction, mil.faction], type, direction, ratio: Math.round(ratio*100)/100, narrative,
      dmNote: type === 'competitive' ? 'The military commander is a political actor. Their cooperation must be maintained, purchased, or circumvented.' : null });
  }

  // ── Governing ↔ Merchant ────────────────────────────────────────────────────
  if (gov && merc) {
    const ratio = merc.power / Math.max(1, gov.power);
    let type, direction, narrative;

    if (ratio >= 1.2) {
      type = 'competitive';
      narrative = `Day-to-day trade here is run by ${merc.faction} more than by ${gov.faction}, and taxes are bargained over, not ordered.`;
    } else if (ratio >= 0.6) {
      type = 'dependent';
      narrative = `${gov.faction} needs the taxes and loans of ${merc.faction}, and ${merc.faction} needs ${gov.faction} to enforce its contracts and keep the law. Neither can afford to ruin the other.`;
    } else {
      type = 'subordinate';
      narrative = `${merc.faction} works under the rules ${gov.faction} sets, and pays for a hearing in the hall when it wants something.`;
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
      narrative = `${rel.faction} and ${gov.faction} are the same people in practice; the hall rules because the faith says it may.`;
    } else if (ratio >= 1.1) {
      type = 'tense';
      narrative = `People take their marriages, inheritances and hard times to ${rel.faction}, not to ${gov.faction}, and the two keep quarrelling over who decides what.`;
    } else if (ratio >= 0.5) {
      type = 'dependent';
      narrative = `${gov.faction} keeps order and collects the taxes; ${rel.faction} tells people that both are right and ordained. Each props up the other.`;
    } else {
      type = 'subordinate';
      narrative = `${rel.faction} answers to ${gov.faction}. Its priests look after their flocks and have no say in the hall.`;
    }

    direction = stressed('religious_conversion') ? 'escalating'  // religious tension rising
              : stressed('plague_onset')         ? 'escalating'  // church gains legitimacy in crisis
              : 'stable';

    addRel({ pair: [gov.faction, rel.faction], type, direction, ratio: Math.round(ratio*100)/100, narrative });
  }

  // ── Governing ↔ Criminal ────────────────────────────────────────────────────
  if (gov && crim) addRel(govCriminalRelation(gov, crim, crimCapture, publicLeg));

  // ── Merchant ↔ Craft ────────────────────────────────────────────────────────
  if (merc && craft) {
    const ratio = merc.power / Math.max(1, craft.power);
    let type, direction, narrative;

    if (ratio >= 1.8) {
      type = 'competitive';
      narrative = `${merc.faction} buys the materials, sets the prices and sells the goods; ${craft.faction} only makes them, and its masters are becoming hired hands in all but name.`;
    } else if (ratio >= 0.7) {
      type = 'tense';
      // STYLE-2 B7 (SW-7, P9): "the landlords" was a fixed noun the roster did not hold; the line names the
      // landholding power when one stands, and otherwise names none.
      narrative = noble && noble !== merc && noble !== craft
        ? MERCHANT_CRAFT_VOTE.against(merc.faction, craft.faction, noble.faction)
        : MERCHANT_CRAFT_VOTE.sibling(merc.faction, craft.faction);
    } else {
      type = 'tense';
      narrative = `Only the masters of ${craft.faction} know how to make what ${merc.faction} sells, so the merchants pay their price.`;
    }

    direction = (instFlags?.economyOutput > 65) ? 'escalating'  // expanding economy; who captures the surplus?
              : 'stable';

    addRel({ pair: [merc.faction, craft.faction], type, direction, ratio: Math.round(ratio*100)/100, narrative });
  }

  // ── Criminal ↔ Military ─────────────────────────────────────────────────────
  if (crim && mil) addRel(criminalMilitaryRelation(crim, mil, crimCapture, publicLeg));

  // ── Merchant ↔ Religious (at town+ scale) ──────────────────────────────────
  if (merc && rel && ['town','city','metropolis'].includes(tier)) {
    const merP = merc.power, relP = rel.power;
    let type, _direction, narrative;

    if (merP >= 20 && relP >= 15) {
      type = 'tense';
      narrative = `${merc.faction} and ${rel.faction} want the same households' money: tithes on one side, debts and contracts on the other. Church land exemptions and the church's rules on lending are a standing grievance with the merchants.`;
    } else if (merP > relP * 1.5) {
      type = 'competitive';
      narrative = `${merc.faction} now has more money than ${rel.faction} has sway. Merchants pay for churches, ${!defenseFacts || defenseFacts.hasHospital ? 'hospitals' : 'charities'} and indulgences, and they set the terms.`; // F1: a hospital only where one stands
    } else {
      type = 'dependent';
      narrative = `The money of ${merc.faction} pays for the charity of ${rel.faction}, and the charity keeps the poor quiet. Each needs the other, and neither likes it.`;
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
      ? `${noble.faction} hold old rights ${gov.faction} cannot take away; nothing about land, inheritance or levies gets done without their agreement.`
      : ratio >= 0.5
      ? `${noble.faction} live under the rule of ${gov.faction} but keep enough rights of their own (land, courts, levies) to bargain, not simply obey.`
      : `${noble.faction} still have their titles, but merchant money and the hall's offices have taken most of their power.`;

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
// File-local copy of power/rulingStructure's renormalizeFactionPower:
// factionDynamics must NOT import from the power modules (rulingStructure
// already imports THIS module, so importing back would close an import cycle
// the architecture test bans).
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
        // The owner's style law of 2026-11-07 (W3 POW #189): the note no longer repeats the Power tab's fracture banner and
        // DS-POW-1's fractured line; it says the one thing they do not, which powerStrata.crisisNoteFor names or drops.
        f.crisisNote = 'Holds the title, but the decisions that matter are made elsewhere.';
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
