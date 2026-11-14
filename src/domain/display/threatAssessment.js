/**
 * domain/display/threatAssessment.js — the defense-readiness threat rows.
 *
 * `buildThreatAssessment` reframes a settlement's defense profile as five
 * "how ready is it against each pressure" rows (Beasts & Monsters, Invasion &
 * War, Internal Security, Economic Survival, Disasters & Famine), each with a
 * colour and a prose assessment. It is a PURE function of the settlement it is
 * handed — it reads `defenseProfile`, `economicState`, and `config` and returns
 * plain row objects; it draws no randomness and touches no clock.
 *
 * ⭐ IT ASKS THE ONE SET OF DEFENCE FACTS BEFORE IT SAYS ANYTHING (lane DEFENSE,
 * 2026-11-03). What stands and what tends the sick come from
 * `domain/defense/defenseFacts.js :: defenseFactsOf` — the live roster — so a row never
 * speaks of garrison pay where no garrison stands, or of a hospital where there is one
 * healer. It prints no stored food: that is the Economy tab's (the owner's word, 2026-11-03).
 * Its imports are that domain leaf and the score-band leaf, so the no-generator-edge reason
 * below still holds.
 *
 * ⭐ THE FAMINE ROW READS THE ONE FOOD RECORD (lane RUNG1B-F9 unit 1, 2026-11-04; the chair's
 * end-to-end reading: Al-karez printed "Food Security Deficit — active famine" on the Overview
 * and "Disasters & Famine: Adequate" here). `disasterReadinessScore` is the row's ONE score,
 * read by this tab and the PDF's readiness rows alike: under an ACTIVE FAMINE (the stored
 * record's `band === 'famine'`, `foodBalance.js :: deriveFoodRecord`) it is held to Weak at
 * most, and the row's sentence names the famine (never the stores: those are the Food
 * endurance line's, beside the bars). Without one nothing changes.
 *
 * It lives here (dependency-free leaf) rather than in generators/defenseGenerator
 * so the eager Defense/Economics display path (domain/display/defenseDisplay.js
 * and the Defense tab) can consume it WITHOUT statically importing the generator
 * engine chunk. defenseGenerator is generation-time code (the ~656 kB lazy
 * engine); this row-builder is display-time derivation and belongs with the
 * other display derivations. Moving it here cut the last eager
 * domain→generators edge in the defense surface. Verbatim extraction — behaviour
 * is byte-identical to its former home.
 */

import { defenseFactsOf } from '../defense/defenseFacts.js';
import { SCORE_BAND_CUTS } from './defenseScoreBands.js';

/** The top of the Weak band: the highest a famine-struck place's disaster readiness may read. */
export const FAMINE_DISASTER_CEILING = SCORE_BAND_CUTS.adequate - 1;

/**
 * The fields the famine and disaster-readiness readers consult.
 * @typedef {{
 *   defenseProfile?: { scores?: { disaster?: number, economic?: number } | null } | null,
 *   economicState?: {
 *     foodSecurity?: { foodRecord?: { band?: unknown } | null, resilienceScore?: number } | null,
 *     compound?: { inst?: { hasGranary?: unknown, hasHospital?: unknown, hasChurch?: unknown } | null } | null,
 *   } | null,
 * } | null | undefined} FamineReadinessRecord
 */

/**
 * Is the place in an active famine, by the one food record? Read, never re-derived.
 * @param {FamineReadinessRecord} r
 * @returns {boolean}
 */
export function inActiveFamine(r) {
  return r?.economicState?.foodSecurity?.foodRecord?.band === 'famine';
}

/**
 * The Disasters & Famine row's ONE readiness score — the stored disaster score (re-judged by
 * the world pulse as the campaign advances), else the food model's resilience score, else the
 * legacy blend — held to the top of Weak under an active famine.
 * @param {FamineReadinessRecord} r
 * @returns {number}
 */
export function disasterReadinessScore(r) {
  const scores = r?.defenseProfile?.scores || {};
  const f = r?.economicState?.compound?.inst || {};
  const raw = scores.disaster
    ?? r?.economicState?.foodSecurity?.resilienceScore
    ?? Math.round((((scores.economic || 0) * 0.4) + (f.hasGranary ? 60 : 20) + (f.hasHospital ? 70 : f.hasChurch ? 40 : 10)) / 2);
  return inActiveFamine(r) ? Math.min(raw, FAMINE_DISASTER_CEILING) : raw;
}

/**
 * The famine's own sentence. It names the famine and nothing in store: stored food is the
 * Economy tab's row, and its siege reading is the Food endurance line beside these bars (the
 * owner's word, 2026-11-03; tests/domain/defenseWordsFindings.test.js pins the tab's silence).
 */
export const FAMINE_SENTENCE = 'In famine. Hunger is the disaster this row grades, and it has already come.';

/**
 * The healer named by what it is: a monastic house's infirmary, or a healer.
 * @param {string|null} healerName the roster name from `defenseFactsOf`
 * @returns {string}
 */
export function healerSubject(healerName) {
  return /monaster|friary|infirmar/i.test(String(healerName || '')) ? 'The monastic infirmary' : 'A healer';
}

/**
 * @param {any} r A settlement object (reads `defenseProfile`, `economicState`,
 *   and `config`; tolerant of missing fields via optional chaining).
 * @returns {{label: string, color: string, assess: string}[]}
 *
 * NO ICON FIELD (owner icon-sweep directive, 2026-08-03). Each row previously
 * carried an empty-string icon slot — residue of an earlier emoji strip — which
 * the DefenseTab rendered as an empty span that still consumed its flex gap. The
 * label carries the meaning; the slot and its phantom spacing are both gone.
 * Do not reintroduce the slot: tests/lint/copyCorruption.test.js SIG 1 bans it.
 */
export function buildThreatAssessment(r) {
  const d = r?.defenseProfile || {};
  const scores = d.scores || {};
  const sp = r?.economicState?.safetyProfile || {};
  const f = r?.economicState?.compound?.inst || {};
  const threat = r?.config?.monsterThreat || 'frontier';
  const facts = defenseFactsOf(r);
  const { hasWalls, hasGarrison, hasMilitia, hasCharter } = facts;
  // The enclosure by its own kind: a palisade is never called walls, stone walls never a palisade.
  const palisade = facts.wallKind === 'palisade';
  const result = [];

  const monColor = threat === 'plagued'
    ? '#8b1a1a'
    : threat === 'frontier'
      ? '#7a5010'
      : '#1a5a28';
  let mon;
  if (threat === 'plagued') {
    if (hasWalls && hasGarrison) {
      mon = 'Embattled region: constant creature pressure. Walls and garrison have established a survivable posture. Defense is an ongoing operational necessity. '
        + (hasCharter
          ? 'Charter hall coordinates specialist monster response.'
          : 'No specialist monster hunters on retainer: the garrison handles everything.');
    } else if (hasWalls && hasMilitia) {
      mon = (palisade ? 'Palisade' : 'Walls') + ' and citizen militia provide a viable but demanding posture in an embattled region. Watch rotations are thin. Simultaneous incursions will break coverage. '
        + (hasCharter
          ? 'Charter hall provides specialist backup.'
          : 'No specialist monster hunters.');
    } else if (hasCharter) {
      mon = 'No perimeter, but the charter hall provides specialist response for coordinated threats. Creatures that get past initial response reach homes directly.';
    } else if (hasWalls) {
      mon = (palisade ? 'A palisade stands' : 'Walls exist')
        + ' but no organized force to sustain a watch rotation. The '
        + (palisade ? 'palisade' : 'wall')
        + ' creates a chokepoint but holding it requires people, and there are not enough for sustained watch.';
    } else if (hasGarrison) {
      mon = 'Military force present but no perimeter walls. The garrison engages in the open. Creatures can approach from any direction.';
    } else {
      mon = 'embattled region with no organized defense and no perimeter. Survival depends on terrain, luck, and the ability to flee. This settlement is in extreme danger.';
    }
  } else if (threat === 'frontier') {
    if (hasWalls && hasGarrison) {
      mon = 'Active frontier. Walls and garrison provide credible deterrence: most creature threats will not press a defended perimeter. '
        + (hasCharter
          ? 'Charter hall handles anything above the garrison usual remit. '
          : '')
        + 'Adequate for the threat level.';
    } else if (hasWalls && hasMilitia) {
      mon = (palisade ? 'A palisade' : 'Walls') + ' and a militia, as most frontier places have: enough for most creatures, not for several attacks at once.'
        + (hasCharter
          ? ' The charter hall sends specialists when the militia is not enough.'
          : '');
    } else if (hasGarrison || hasMilitia) {
      mon = 'Active frontier with '
        + (hasGarrison ? 'a garrison' : 'a militia')
        + ' but no perimeter. Defense is reactive. Attackers choose the point of engagement. Adequate for routine threats; exposed to anything coordinated.';
    } else {
      mon = 'Wild country all round and nobody organised to meet it; any creature of real size would get in.';
    }
  } else {
    if (hasWalls && hasGarrison) {
      mon = 'Quiet country, and far more defences than it calls for.';
    } else if (hasWalls || hasGarrison || hasMilitia || hasCharter) {
      mon = 'Safe heartland with minimal creature activity. Existing defenses are appropriate. The primary threats here are internal.';
    } else {
      mon = 'Quiet country and no organised defence, which is all the country asks.';
    }
  }
  result.push({
    label: 'Beasts & Monsters',
    color: monColor,
    assess: mon,
  });

  const milScore = scores.military || 0;
  const milColor = milScore >= 60
    ? '#1a4a2a'
    : milScore >= 35
      ? '#7a5010'
      : '#8b1a1a';
  let mil;
  if (hasWalls && hasGarrison) {
    mil = (palisade ? 'A palisade and a professional garrison provide' : 'Walls and professional garrison provide')
      + ' meaningful deterrence against raiding and conventional assault. Not rated for sustained siege without significant supply stockpiles.';
  } else if (hasWalls && hasMilitia) {
    mil = (palisade ? 'A palisade' : 'Walls') + ' and armed townsfolk: enough to turn raiders away, not enough against an army that brings siege gear.';
  } else if (hasWalls) {
    mil = palisade
      ? 'A palisade but no organized military force to man it. A determined attacker is over it with ladders and time.'
      : 'Walls present but no organized military force to man them. A determined attacker takes the walls if they have ladders and time.';
  } else if (hasGarrison) {
    mil = 'Professional garrison without perimeter walls. Effective against raiders; cannot hold against a siege.';
  } else if (hasMilitia) {
    mil = 'Armed citizens who know their ground. Effective against disorganized raiders. No counter to a disciplined military force.';
  } else {
    mil = 'No walls or garrison. Cannot resist organized military aggression. Survival depends entirely on distance, diplomacy, or irrelevance to the attacker.';
  }
  result.push({
    label: 'Invasion & War',
    color: milColor,
    assess: mil,
  });

  const intScore = scores.internal || 0;
  const intColor = intScore >= 60
    ? '#1a4a2a'
    : intScore >= 35
      ? '#7a5010'
      : '#8b1a1a';
  const sl = sp.safetyLabel || 'Moderate';
  let intA = 'Internal security: ' + sl + '. ';
  if (sl.includes('Dangerous')) {
    intA += 'Violence and organised crime are the main danger here. ';
  }
  if (f.hasCourtSystem && f.hasPrison) {
    intA += 'Arrest, trial and gaol all work here.';
  } else if (f.hasCourtSystem) {
    intA += 'There is a court but almost nowhere to hold anyone.';
  } else if (f.hasPrison) {
    intA += 'People are locked up without trial.';
  } else {
    intA += 'No court and no gaol; order rests on whoever is armed.';
  }
  result.push({
    label: 'Internal Security',
    color: intColor,
    assess: intA,
  });

  const econScore = scores.economic || 0;
  const econColor = econScore >= 60
    ? '#1a4a2a'
    : econScore >= 35
      ? '#7a5010'
      : '#8b1a1a';
  let econA;
  if (econScore >= 65) {
    econA = 'Money enough to ride out a long crisis: emergency measures can be paid for, and '
      + (hasGarrison ? 'the garrison kept paid' : 'the defenders kept paid')
      + ' while it lasts.';
  } else if (econScore >= 40) {
    econA = 'Money enough for a short crisis; a long siege would start eating the reserves within months.';
  } else if (econScore >= 25) {
    econA = 'The defenders are already paid late; a long crisis would empty the reserves and '
      + (hasGarrison ? 'wear out the garrison\'s patience.' : 'wear down the people who defend the place.');
  } else {
    econA = 'There is no money to meet a crisis; any lasting trouble would find nothing to spend.';
  }
  result.push({
    label: 'Economic Survival',
    color: econColor,
    assess: econA,
  });

  // ⛔ NO STORED-FOOD OR GRANARY SENTENCE ON THE DEFENSE TAB (the owner's word, 2026-11-03:
  // "Do add storehouse months the economy tab."). Stored food is the Economy tab's, printed once
  // in months; this row speaks of who tends the sick, and of a famine by name (F9 unit 1).
  // Under an active famine the row's sentence names it first (F9 unit 1).
  const care = facts.hasHospital
    ? 'The hospital can isolate the sick and keep an outbreak from spreading.'
    : facts.hasHealer
      ? healerSubject(facts.healerName) + ' treats the sick one at a time; an outbreak would outrun it.'
      : f.hasChurch
        ? 'Clergy provide basic wound care: better than nothing, worse than a hospital.'
        : 'Nobody here treats the sick, and a plague would run until it burned out.';
  const disA = inActiveFamine(r) ? `${FAMINE_SENTENCE} ${care}` : care;
  result.push({
    label: 'Disasters & Famine',
    color: '#1a4a5a',
    assess: disA,
  });

  return result;
}
