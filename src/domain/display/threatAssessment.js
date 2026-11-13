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
import { SCORE_BAND_CUTS, economicSurvivalBandOf, scoreBand } from './defenseScoreBands.js';
import { laidByBeforeCrisis } from './prosperityInCrisis.js';
import { standingDefenseForces } from '../institutions/defenseInstitutionBuckets.js';

/**
 * A FORCE STANDS (UPKEEP-8, F3, the chair's ruling (a)): a garrison, a militia (a household levy is one), a watch or a
 * contracted company, read from the lane's one projection and from no list of names of its own. A row's sentence that
 * says no force stands prints only where none does.
 * @param {{ institutions?: unknown } | null | undefined} r
 * @returns {boolean}
 */
export const forceStands = (r) => {
  const f = standingDefenseForces(r);
  return f.garrison.present || f.militia.present || f.watch.present || f.mercenary.present;
};

/** Every band: a sentence that judges nothing is true under each. */
const BANDS = Object.freeze(['STRONG', 'ADEQUATE', 'WEAK', 'CRITICAL']);

/**
 * The first of a branch's sentences whose words are true under the band its row prints, or '' (the band alone).
 * @param {ReadonlyArray<[string, ReadonlyArray<string>]>} lines @param {string} band @returns {string}
 */
const trueUnder = (lines, band) => (lines.find(([, bands]) => bands.includes(band)) || [''])[0];

/**
 * WHAT MONEY THE PLACE HAS TO MEET A CRISIS: the Economic Survival row's own band, read from its ONE home
 * (`defenseScoreBands.js :: economicSurvivalBandOf`, COHERENCE-UPKEEP-6, the chair's ruling A), the band its
 * badge, its colour, the screen's row and the guard's purse clauses read. Its score is paid at the standing label.
 * @param {{ defenseProfile?: { scores?: { economic?: unknown } | null } | null } | null | undefined} r
 * @returns {'long' | 'short' | 'late' | 'none'}
 */
const moneyRungOf = (r) => {
  const band = economicSurvivalBandOf(r);
  return band === 'STRONG' ? 'long' : band === 'ADEQUATE' ? 'short' : band === 'WEAK' ? 'late' : 'none';
};

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
  const force = forceStands(r);
  const result = [];

  const monColor = threat === 'plagued'
    ? '#8b1a1a'
    : threat === 'frontier'
      ? '#7a5010'
      : '#1a5a28';
  // F3 (UPKEEP-8, the chair's ruling (b)): each sentence is printed only under the bands its own words are true of.
  // A branch offers its sentence and, where its contradicted cell held fifteen rows or more, ONE twin that says what
  // the place holds and what its country asks; a row with no true sentence prints its band alone.
  const monBand = scoreBand(scores.monster || 0);
  const milBand = scoreBand(scores.military || 0);
  const wallWord = palisade ? 'a palisade' : 'walls';
  /** @type {Array<[string, ReadonlyArray<string>]>} */
  let monLines = [];
  if (threat === 'plagued') {
    if (hasWalls && hasGarrison) {
      monLines = [['Embattled region: constant creature pressure. Walls and garrison have established a survivable posture. Defense is an ongoing operational necessity. '
        + (hasCharter
          ? 'Charter hall coordinates specialist monster response.'
          : 'No specialist monster hunters on retainer: the garrison handles everything.'), ['ADEQUATE', 'STRONG']]];
    } else if (hasWalls && hasMilitia) {
      monLines = [[(palisade ? 'Palisade' : 'Walls') + ' and citizen militia provide a viable but demanding posture in an embattled region. Watch rotations are thin. Simultaneous incursions will break coverage. '
        + (hasCharter
          ? 'Charter hall provides specialist backup.'
          : 'No specialist monster hunters.'), ['ADEQUATE', 'WEAK']],
      [`An embattled region, and only ${wallWord} and a citizen militia to hold it.`, ['WEAK', 'CRITICAL']]];
    } else if (hasCharter) {
      monLines = [['No perimeter, but the charter hall provides specialist response for coordinated threats. Creatures that get past initial response reach homes directly.', ['ADEQUATE', 'WEAK']]];
    } else if (hasWalls && !force) {
      monLines = [[(palisade ? 'A palisade stands' : 'Walls exist')
        + ' but no organized force to sustain a watch rotation. The '
        + (palisade ? 'palisade' : 'wall')
        + ' creates a chokepoint but holding it requires people, and there are not enough for sustained watch.', ['WEAK', 'CRITICAL']]];
    } else if (hasGarrison) {
      monLines = [['Military force present but no perimeter walls. The garrison engages in the open. Creatures can approach from any direction.', ['ADEQUATE', 'WEAK']]];
    } else if (!force && !hasWalls) {
      monLines = [['embattled region with no organized defense and no perimeter. Survival depends on terrain, luck, and the ability to flee. This settlement is in extreme danger.', ['CRITICAL']]];
    }
  } else if (threat === 'frontier') {
    if (hasWalls && hasGarrison) {
      monLines = [['Active frontier. Walls and garrison provide credible deterrence: most creature threats will not press a defended perimeter. '
        + (hasCharter
          ? 'Charter hall handles anything above the garrison usual remit. '
          : '')
        + 'Adequate for the threat level.', ['STRONG', 'ADEQUATE']]];
    } else if (hasWalls && hasMilitia) {
      monLines = [[(palisade ? 'A palisade' : 'Walls') + ' and a militia, as most frontier places have: enough for most creatures, not for several attacks at once.'
        + (hasCharter
          ? ' The charter hall sends specialists when the militia is not enough.'
          : ''), ['ADEQUATE']]];
    } else if (hasGarrison || hasMilitia) {
      const held = hasGarrison ? 'a garrison' : 'a militia';
      monLines = [['Active frontier with ' + held
        + ' but no perimeter. Defense is reactive. Attackers choose the point of engagement. Adequate for routine threats; exposed to anything coordinated.', ['ADEQUATE', 'WEAK']],
      [`Active frontier with ${held} but no perimeter, and too little to meet what the country sends.`, ['CRITICAL']]];
    } else if (!force) {
      monLines = [['Wild country all round and nobody organised to meet it; any creature of real size would get in.', ['WEAK', 'CRITICAL']]];
    } else if (hasWalls && standingDefenseForces(r).watch.present) {
      monLines = [[`Active frontier, with ${wallWord} and a watch to meet what comes.`, BANDS]];
    }
  } else {
    if (hasWalls && hasGarrison) {
      monLines = [['Quiet country, and far more defences than it calls for.', ['STRONG']]];
    } else if (hasWalls || force || hasCharter) {
      monLines = [['Safe heartland with minimal creature activity. Existing defenses are appropriate. The primary threats here are internal.', ['ADEQUATE', 'STRONG']],
        ['Quiet country, and little is kept against it.', ['WEAK', 'CRITICAL']]];
    } else {
      monLines = [['Quiet country and no organised defence, which is all the country asks.', ['ADEQUATE', 'STRONG']],
        ['Quiet country, and nothing organised is kept against it.', ['WEAK', 'CRITICAL']]];
    }
  }
  const mon = trueUnder(monLines, monBand);
  result.push({
    label: 'Beasts & Monsters',
    color: monColor,
    assess: mon, // '' where no sentence is true of what stands under the band: the row prints its band alone
  });

  const milScore = scores.military || 0;
  const milColor = milScore >= 60
    ? '#1a4a2a'
    : milScore >= 35
      ? '#7a5010'
      : '#8b1a1a';
  /** @type {Array<[string, ReadonlyArray<string>]>} */
  let milLines = [];
  if (hasWalls && hasGarrison) {
    milLines = [[(palisade ? 'A palisade and a professional garrison provide' : 'Walls and professional garrison provide')
      + ' meaningful deterrence against raiding and conventional assault. Not rated for sustained siege without significant supply stockpiles.', ['STRONG', 'ADEQUATE']]];
  } else if (hasWalls && hasMilitia) {
    milLines = [[(palisade ? 'A palisade' : 'Walls') + ' and armed townsfolk: enough to turn raiders away, not enough against an army that brings siege gear.', ['ADEQUATE', 'WEAK']],
      [palisade ? 'A palisade and armed townsfolk who know how to hold it.' : 'Walls and armed townsfolk who know how to hold them.', ['STRONG']]];
  } else if (hasWalls && !force) {
    milLines = [[palisade
      ? 'A palisade but no organized military force to man it. A determined attacker is over it with ladders and time.'
      : 'Walls present but no organized military force to man them. A determined attacker takes the walls if they have ladders and time.', ['WEAK', 'CRITICAL']],
    [palisade
      ? 'A palisade and nobody organised to man it: enough to turn away a raid, not a determined attack.'
      : 'Walls and nobody organised to man them: enough to turn away a raid, not a determined attack.', ['ADEQUATE']]];
  } else if (hasWalls && standingDefenseForces(r).watch.present && !hasGarrison && !hasMilitia) {
    milLines = [[palisade ? 'A palisade, and a watch to keep it.' : 'Walls, and a watch to keep them.', BANDS]];
  } else if (hasGarrison) {
    milLines = [['Professional garrison without perimeter walls. Effective against raiders; cannot hold against a siege.', ['ADEQUATE', 'WEAK']]];
  } else if (hasMilitia) {
    milLines = [['Armed citizens who know their ground. Effective against disorganized raiders. No counter to a disciplined military force.', ['ADEQUATE', 'WEAK']],
      ['Armed citizens who know their ground, and no walls: too few to turn back any force that comes in earnest.', ['CRITICAL']]];
  } else if (!hasWalls) {
    milLines = [['No walls or garrison. Cannot resist organized military aggression. Survival depends entirely on distance, diplomacy, or irrelevance to the attacker.', ['WEAK', 'CRITICAL']],
      ['No walls or garrison, but enough here to turn away raiders; nothing that could hold off an army.', ['ADEQUATE']]];
  }
  const mil = trueUnder(milLines, milBand);
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

  // C-L7 (UPKEEP-8): the bar's colour reads the band its row prints (the Economic Survival band's ONE home), not cuts of its own.
  const econBand = economicSurvivalBandOf(r);
  const econColor = econBand === 'STRONG'
    ? '#1a4a2a'
    : econBand === 'ADEQUATE'
      ? '#7a5010'
      : '#8b1a1a';
  let econA;
  const money = moneyRungOf(r);
  // Where the crisis has lowered the word the page prints, the money that can pay was laid by before it: one clause,
  // the crisis named by the two-label sentence's own home (COHERENCE-UPKEEP-7, the third read's 1b-M3).
  const laid = laidByBeforeCrisis(r);
  const laidClause = laid ? `, ${laid}` : '';
  if (money === 'long') {
    econA = `Money enough to ride out a long crisis${laidClause}: emergency measures can be paid for, and `
      + (hasGarrison ? 'the garrison kept paid' : 'the defenders kept paid')
      + ' while it lasts.';
  } else if (money === 'short') {
    econA = `Money enough for a short crisis${laidClause}; a long siege would start eating the reserves within months.`;
  } else if (money === 'late') {
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
