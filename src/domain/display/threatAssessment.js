/**
 * domain/display/threatAssessment.js — the defense-readiness threat rows.
 *
 * `buildThreatAssessment` reframes a settlement's defense profile as five
 * "how ready is it against each pressure" rows (Beasts & Monsters, Invasion &
 * War, Internal Security, Economic Survival, Disasters & Famine), each with a
 * colour and a prose assessment. It is a PURE function of the settlement it is
 * handed — it reads `defenseProfile`, `economicState`, and `config` and returns
 * plain row objects; it draws no randomness, touches no clock, and imports
 * nothing.
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
  const inst = d.institutions || {};
  const scores = d.scores || {};
  const sp = r?.economicState?.safetyProfile || {};
  const f = r?.economicState?.compound?.inst || {};
  const threat = r?.config?.monsterThreat || 'frontier';
  const hasWalls = (inst.walls || []).length > 0;
  const hasGarrison = (inst.garrison || []).length > 0;
  const hasMilitia = (inst.militia || []).length > 0;
  const hasCharter = (inst.charter || []).length > 0;
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
          : 'No specialist monster hunters on retainer — the garrison handles everything.');
    } else if (hasWalls && hasMilitia) {
      mon = 'Palisade and citizen militia provide a viable but demanding posture in an embattled region. Watch rotations are thin — simultaneous incursions will break coverage. '
        + (hasCharter
          ? 'Charter hall provides specialist backup.'
          : 'No specialist monster hunters.');
    } else if (hasCharter) {
      mon = 'No perimeter, but the charter hall provides specialist response for coordinated threats. Creatures that get past initial response reach homes directly.';
    } else if (hasWalls) {
      mon = 'Walls exist but no organized force to sustain a watch rotation. The palisade creates a chokepoint but holding it requires people, and there are not enough for sustained watch.';
    } else if (hasGarrison) {
      mon = 'Military force present but no perimeter walls. The garrison engages in the open. Creatures can approach from any direction.';
    } else {
      mon = 'embattled region with no organized defense and no perimeter. Survival depends on terrain, luck, and the ability to flee. This settlement is in extreme danger.';
    }
  } else if (threat === 'frontier') {
    if (hasWalls && hasGarrison) {
      mon = 'Active frontier. Walls and garrison provide credible deterrence — most creature threats will not press a defended perimeter. '
        + (hasCharter
          ? 'Charter hall handles anything above the garrison usual remit. '
          : '')
        + 'Adequate for the threat level.';
    } else if (hasWalls && hasMilitia) {
      mon = 'Palisade and militia are standard frontier resilience — effective against most creature threats, strained by simultaneous incursions. '
        + (hasCharter
          ? 'Charter hall provides specialist backup. '
          : '')
        + 'Honest posture for a frontier settlement.';
    } else if (hasGarrison || hasMilitia) {
      mon = 'Active frontier with '
        + (hasGarrison ? 'a garrison' : 'a militia')
        + ' but no perimeter. Defense is reactive — attackers choose the point of engagement. Adequate for routine threats; exposed to anything coordinated.';
    } else {
      mon = 'Active frontier with no organized defense. Vulnerable to any monster of moderate capability.';
    }
  } else {
    if (hasWalls && hasGarrison) {
      mon = 'Safe heartland — the existing defenses are substantially more than the threat level requires.';
    } else if (hasWalls || hasGarrison || hasMilitia || hasCharter) {
      mon = 'Safe heartland with minimal creature activity. Existing defenses are appropriate. The primary threats here are internal.';
    } else {
      mon = 'Safe heartland with no organized defense. Acceptable given the threat environment.';
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
    mil = 'Walls and professional garrison provide meaningful deterrence against raiding and conventional assault. Not rated for sustained siege without significant supply stockpiles.';
  } else if (hasWalls && hasMilitia) {
    mil = 'Walls with citizen militia — credible deterrence against raiders, inadequate against any professional force with siege capability.';
  } else if (hasWalls) {
    mil = 'Walls present but no organized military force to man them. A determined attacker takes the walls if they have ladders and time.';
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
    intA += 'Active violence and organized crime make internal order the primary threat. ';
  }
  if (f.hasCourtSystem && f.hasPrison) {
    intA += 'Full legal infrastructure provides enforcement capacity.';
  } else if (f.hasCourtSystem) {
    intA += 'Courts prosecute but limited detention.';
  } else if (f.hasPrison) {
    intA += 'Detention without systematic prosecution.';
  } else {
    intA += 'No legal infrastructure — order relies on force alone.';
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
    econA = 'Strong economic base can absorb a sustained crisis. Tax revenue funds emergency measures and sustains garrison pay during prolonged engagement.';
  } else if (econScore >= 40) {
    econA = 'Adequate economic resilience for a short-term crisis. A prolonged siege will begin straining reserves within months.';
  } else if (econScore >= 25) {
    econA = 'Chronic underfunding limits emergency response. A sustained crisis will exhaust reserves and undermine garrison morale.';
  } else {
    econA = 'Economic base cannot support crisis response. Any sustained threat quickly overwhelms the capacity to respond.';
  }
  result.push({
    label: 'Economic Survival',
    color: econColor,
    assess: econA,
  });

  const disA = (f.hasGranary
    ? 'Granary provides food buffer — the community can absorb a bad harvest without immediate hardship.'
    : 'No food reserves. A crop failure or supply disruption causes immediate hardship.')
    + (f.hasHospital
      ? ' Hospital infrastructure enables disease containment and systematic quarantine.'
      : f.hasChurch
        ? ' Parish clergy provide basic wound care — better than nothing, worse than a hospital.'
        : ' No medical infrastructure. Plague spreads until it burns out.');
  result.push({
    label: 'Disasters & Famine',
    color: '#1a4a5a',
    assess: disA,
  });

  return result;
}
