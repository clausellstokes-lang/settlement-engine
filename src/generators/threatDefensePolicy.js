/**
 * threatDefensePolicy.js — one deterministic policy for minimum defenses.
 *
 * Threat defense is needed twice: once before the power layer reads the roster
 * and once at final reconciliation in case a later institution producer
 * changed it. This module owns the policy while the callers own materializing
 * catalog entries and recording their pipeline receipts.
 */

const DEFENSE_PREFERENCES = Object.freeze({
  thorp: Object.freeze({
    fortification: Object.freeze(['Palisade']),
    force: Object.freeze(['Household levy']),
  }),
  hamlet: Object.freeze({
    fortification: Object.freeze(['Palisade or earthworks']),
    force: Object.freeze(['Citizen militia']),
  }),
  village: Object.freeze({
    fortification: Object.freeze(['Palisade or earthworks']),
    force: Object.freeze(['Citizen militia']),
  }),
  town: Object.freeze({
    fortification: Object.freeze(['Town walls']),
    force: Object.freeze(['Town watch', 'Citizen militia', 'Barracks']),
  }),
  city: Object.freeze({
    fortification: Object.freeze(['City walls and gates', 'Citadel']),
    force: Object.freeze(['Garrison', 'Professional city watch']),
  }),
  metropolis: Object.freeze({
    fortification: Object.freeze([
      'Massive walls and fortifications',
      'City walls and gates',
    ]),
    force: Object.freeze([
      'Multiple garrisons',
      'Professional guard (hundreds)',
      'Garrison',
    ]),
  }),
});

const FORTIFICATION_NAME =
  /\bwall|citadel|garrison|barracks|palisade|earthwork|fortress\b/i;
const MILITARY_FORCE_NAME =
  /\bgarrison|guard|militia|levy|barracks|mercenary|watch\b/i;

function hasSemantic(institutions, kind) {
  const pattern = kind === 'fortification'
    ? FORTIFICATION_NAME
    : MILITARY_FORCE_NAME;
  return (institutions || []).some(institution => (
    pattern.test(String(institution?.name || ''))
  ));
}

/**
 * Return the minimum additions the resolved threat requires. The plan is
 * ordered and contains no randomness; callers choose the first compatible,
 * non-excluded catalog candidate in each `names` list.
 *
 * @param {{tier:string, threat:string, institutions:Array<any>}} input
 */
export function threatDefensePlan(input) {
  const {
    tier,
    threat,
    institutions = [],
  } = input;
  const preferences =
    DEFENSE_PREFERENCES[tier] || DEFENSE_PREFERENCES.village;
  const plan = [];
  const needsFortification = (
    threat === 'plagued'
    || (
      threat === 'frontier'
      && ['town', 'city', 'metropolis'].includes(tier)
    )
  );

  if (needsFortification && !hasSemantic(institutions, 'fortification')) {
    plan.push(Object.freeze({
      kind: 'fortification',
      names: preferences.fortification,
      type: 'threat_defense',
      reason: `${threat} pressure requires a defensible perimeter at ${tier} scale.`,
    }));
  }
  if (threat === 'plagued' && !hasSemantic(institutions, 'force')) {
    plan.push(Object.freeze({
      kind: 'force',
      names: preferences.force,
      type: 'threat_defense',
      reason: "Plagued-region survival requires people assigned to hold the settlement's defenses.",
    }));
  }

  return Object.freeze(plan);
}
