/**
 * power/governingStressVignettes.js — the four primary-stress vignettes that speak of the governing
 * faction (insurgency, wartime, religious conversion, mass migration), each a pure function of the
 * institution flags, the governing faction's display name and (migration) the stress entry.
 * `governanceNarrative.js :: buildStressNarratives` assembles them with the rest of the stress
 * narratives. Moved VERBATIM out of governanceNarrative.js (LANDING-R2, the chair's ruling under
 * ODQ §934.105: the module ceiling is cured by a split, never raised); the one edit is `export`.
 */
import { migrationDirectionOf } from '../../domain/crisis/migrationDirection.js';
import { powerNameWithArticle } from '../../domain/display/powerSentenceName.js'; // NAMES-1 (CN1): the seat named in a sentence takes its article

import { resolveDeclared } from '../../domain/facts/drawDeclared.js';
import { textOf } from '../../domain/facts/textOf.js';

/**
 * THE SEAT UNDER AN OCCUPATION (TAIL-POWERS-2, the chair's ruling P4 of 2026-11-14: "governs <town>" under an occupation
 * takes a twin true in that state). Every seat's own line (rulingStructure.js :: govDescByLabel and its siblings) says
 * the seat governs: "A duke or duchess governs the metropolis", "holds civic authority", "no lord stands over them".
 * Under an occupation the seat stands, and the occupier's own card says "all significant decisions require approval
 * or reversal" (stressFactions.js): the twin says exactly that of the seat. Declared on the vocabulary's crisis atom
 * (`occupied`) and drawn through the door, so it prints only where the record's crisis is an occupation.
 */
const OCCUPIED_SEAT = Object.freeze([
  Object.freeze({ text: "{seat} keeps the seat, but under the occupation nothing it decides stands without the occupiers' approval.", crisis: Object.freeze(['occupied']) }),
]);
/**
 * The seat's line under an occupation, or null where the record holds none.
 * @param {unknown} governingFactionName @param {() => any} facts the birth's facts (domain/facts/factsOf.js :: birthFactsOf)
 * @returns {string | null}
 */
export const occupiedSeatLine = (governingFactionName, facts) => {
  const { line } = resolveDeclared(OCCUPIED_SEAT, { facts, poolId: 'governingStressVignettes:OCCUPIED_SEAT', surface: 'power', drawKind: 'T' });
  return line ? textOf(line).replace('{seat}', powerNameWithArticle(governingFactionName, true)) : null;
};

export const buildInsurgencyNarrative = (
  institutionFlags,
  _governingFactionName, // RUNG2-F13: the vignette names no house (kept for the call's shape)
) => {
  const insurgencyOutmusclesAuthority =
    (institutionFlags.criminalEffective || 0) >
      (institutionFlags.militaryEffective || 0) &&
    (institutionFlags.economyOutput || 50) < 48;

  if (insurgencyOutmusclesAuthority) {
    return 'Pamphlets against those in charge pass from hand to hand, and several who were expected stayed away from the last assembly. Those in charge know that cells meet at night, and they have not moved, because moving would admit there is a rising.';
  }
  return (
    'The trouble is inside the government, not in the streets. ' +
    'Officials drag their feet on orders, and taxes are collected but not handed over. ' +
    // RUNG2-F13 (soak1k-3000): this named the GOVERNING house as the one meeting against the
    // governing house. The plotter is the crisis cast's instigator (the Crisis tab names them);
    // the vignette names no house.
    'Certain people are meeting in private who have no business meeting at all. ' +
    'Those in charge have noticed, and must decide whether to act before the plotters are ready.'
  );
};

// TAIL-POWERS-4 (05663, 15434): conscription's toll and the empty seats claim no workshop and no guild (a thorp of 8 holds
// neither): every household is short-handed; "several who were expected" stayed away.
export const buildWartimeNarrative = (institutionFlags, governingFactionName, institutionNames = []) => {
  // COHERENCE-POWERS-7 (cold list REVIEW-W2A-3 #706 #707): a town that governs itself as an independent polity (the
  // roster's City-state government: "No higher lord, no external charter") has no crown to pay, take or send an officer
  const sovereign = (institutionNames || []).some((n) => /^city-state government$/i.test(String(n || '')));
  if (governingFactionName) governingFactionName = powerNameWithArticle(governingFactionName, true); // NAMES-1 (CN1): the seat opens its sentence
  const isWellSupplied =
    (institutionFlags.militaryEffective || 50) >= 55 &&
    (institutionFlags.economyOutput || 50) >= 45;

  if (isWellSupplied) {
    return (
      (sovereign ? 'Those under arms have doubled, and the city treasury pays their keep, so contracts for grain, leather and ironwork go to anyone who can fill them. ' : 'The garrison has doubled and the crown pays its bills, so contracts for grain, leather and ironwork go to anyone who can fill them. ') +
      'The men who left to fight have not come back. ' +
      `${governingFactionName} must decide how much more the settlement can give to the war.`
    );
  }
  if (sovereign) return 'Conscription has taken the workers, and every household is short-handed. The army\'s supply carts take what they need first, and local needs come second. Prices have risen and will rise again. An army quartermaster came last week and left with a list of what will be taken next month, and those in charge signed it because they saw no other choice.';
  return 'Conscription has taken the workers, and every household is short-handed. Crown supply carts take what they need first, and local needs come second. Prices have risen and will rise again. A crown officer came last week and left with a list of what will be taken next month, and those in charge signed it because they saw no other choice.';
};

export const buildReligiousConversionNarrative = (governingFactionName) => {
  // The governing label has historically selected the stable prose variant.
  // Keep that deterministic selector until a seeded narrative selector owns it.
  const variant = governingFactionName ? governingFactionName.length % 3 : 0;
  if (governingFactionName) governingFactionName = powerNameWithArticle(governingFactionName, variant === 1); // NAMES-1 (CN1): the seat opens variant 1's sentence, and stands inside variant 2's
  if (variant === 0) {
    return 'The new faith does not yet have a building. It has kitchens, meeting rooms in private homes, and a preacher who travels a circuit. The old faith has the building, the records, the donations of generations, and a congregation that is quietly slipping away to the new one. Neither side is ready to force a confrontation, and both are counting who comes on holy days.';
  }
  if (variant === 1) {
    return (
      'The split is now open: two priests, two congregations, two registers of births, deaths and marriages. ' +
      `${governingFactionName || 'The governing authority'} has not said which is lawful, ` +
      'so nobody knows whose wedding, will or deed would stand.'
    );
  }
  return (
    `The order to convert came from ${governingFactionName || 'outside authority'} ` +
    'and was obeyed on paper within the week. The old faith no longer holds services openly. ' +
    'Nobody believes it has stopped holding them.'
  );
};

export const buildMigrationNarrative = (institutionFlags, governingFactionName, migrationEntry = null) => {
  // MERGE-R2 (the chair's ruling 1; WIRING-W0, R-W7 e): the DIRECTION decides first and alone —
  // W0's one field, read through F13's reader; the economy below only chooses between the two
  // ARRIVALS wordings (F13's), never a direction.
  if (governingFactionName) governingFactionName = powerNameWithArticle(governingFactionName, true); // NAMES-1 (CN1): the seat opens its sentence
  if (migrationDirectionOf(migrationEntry) === 'exodus') {
    return 'Three families left this week and two more the week before, quietly and in good order; they have thought it through. Those left behind are the ones who cannot go and the ones who will not, and every trade and office is short of hands.';
  }
  if ((institutionFlags.economyOutput || 50) >= 50) {
    return (
      'Newcomers arrive faster than they can be housed, fed or given work. ' +
      'The old residents and the new are not yet one community. ' +
      `${governingFactionName} is being asked to do something about it and cannot agree what.`
    );
  }
  // RUNG2-F13 (soak1k-0, soak1k-4204): the weak-economy arm told a DEPARTURE under an influx. It
  // reads the one direction now (domain/crisis/migrationDirection.js); the power step holds the
  // kind, not the entry, and the entry is born from the same catalog fact. No draw either way.
  // CENSUS-1b unit B: the power step now receives the stress ENTRIES, so the direction is the entry's.
  return (
    'More families arrived this week, and more the week before. The work they came for is not here, and every household taken in is one more the stores must cover. ' +
    `${governingFactionName || 'The governing authority'} is being asked to choose between the residents who were here first and the ones still arriving, and has not chosen.`
  );
};
