/**
 * power/governingStressVignettes.js — the four primary-stress vignettes that speak of the governing
 * faction (insurgency, wartime, religious conversion, mass migration), each a pure function of the
 * institution flags, the governing faction's display name and (migration) the stress entry.
 * `governanceNarrative.js :: buildStressNarratives` assembles them with the rest of the stress
 * narratives. Moved VERBATIM out of governanceNarrative.js (LANDING-R2, the chair's ruling under
 * ODQ §934.105: the module ceiling is cured by a split, never raised); the one edit is `export`.
 */
import { migrationDirectionOf } from '../../domain/crisis/migrationDirection.js';

export const buildInsurgencyNarrative = (
  institutionFlags,
  _governingFactionName, // RUNG2-F13: the vignette names no house (kept for the call's shape)
) => {
  const insurgencyOutmusclesAuthority =
    (institutionFlags.criminalEffective || 0) >
      (institutionFlags.militaryEffective || 0) &&
    (institutionFlags.economyOutput || 50) < 48;

  if (insurgencyOutmusclesAuthority) {
    return "The commons no longer accept the authority's account of events. Inflammatory pamphlets are being distributed. Two guild masters refused to attend the last civic assembly. The governing faction has intelligence about cells meeting at night, but hasn't moved, because moving publicly would confirm what it officially denies.";
  }
  return (
    'The challenge to the governing faction is institutional, not popular. ' +
    'Key officials are slow-walking orders. Revenue is being collected but held rather than forwarded. ' +
    // RUNG2-F13 (soak1k-3000): this named the GOVERNING house as the one meeting against the
    // governing house. The plotter is the crisis cast's instigator (the Crisis tab names them);
    // the vignette names no house.
    'Meetings are being held between people who should not be meeting privately. ' +
    'The governing faction has noticed and is considering whether to act before the coalition is complete.'
  );
};

export const buildWartimeNarrative = (institutionFlags, governingFactionName) => {
  const isWellSupplied =
    (institutionFlags.militaryEffective || 50) >= 55 &&
    (institutionFlags.economyOutput || 50) >= 45;

  if (isWellSupplied) {
    return (
      'The war is present here as money and absence. The garrison has doubled in size and is well-supplied. The crown is paying for this one. ' +
      'Contracts for grain, leather, and ironwork are flowing to anyone with the capacity to fill them. ' +
      'The men who left to fight have not returned, which is a grief that runs beneath the commerce. ' +
      `${governingFactionName} is navigating the difference between what it can extract for the war effort and what the settlement can actually spare.`
    );
  }
  return 'The war is present here as scarcity and fear. Conscription has taken workers, not soldiers. The farms and workshops feel their absence. Supply caravans pass through on crown requisition and local needs come second. Prices have risen and will rise further. A crown officer arrived last week and left with a list of what will be requisitioned next month. The governing faction signed the order. There was no alternative that anyone could see.';
};

export const buildReligiousConversionNarrative = (governingFactionName) => {
  // The governing label has historically selected the stable prose variant.
  // Keep that deterministic selector until a seeded narrative selector owns it.
  const variant = governingFactionName ? governingFactionName.length % 3 : 0;
  if (variant === 0) {
    return 'The new faith does not yet have a building. It has kitchens, meeting rooms in private homes, and a preacher who travels a circuit. The old institution has the building, the records, the accumulated donations, and a congregation that is quietly redistributing itself. Neither party is ready to force a confrontation. Both are watching the numbers.';
  }
  if (variant === 1) {
    return (
      'The schism is now formal. Two priests, two congregations, two sets of records (births, deaths, marriages) that may or may not be recognised depending on which authority the other party acknowledges. ' +
      `${governingFactionName || 'The governing authority'} has not declared which succession is legitimate, ` +
      'which means every legal document dependent on religious sanction is in a grey zone.'
    );
  }
  return (
    `The conversion order came from ${governingFactionName || 'outside authority'} ` +
    'and was formally acknowledged within the week. The speed of the formal compliance was remarkable. ' +
    'The depth of the actual compliance is a different question. The old faith does not hold services openly. ' +
    'It is not clear it has stopped holding them.'
  );
};

export const buildMigrationNarrative = (institutionFlags, governingFactionName, migrationEntry = null) => {
  if ((institutionFlags.economyOutput || 50) >= 50) {
    return (
      'The settlement is receiving more people than its infrastructure was built for. ' +
      'New arrivals come faster than housing, food, and employment can absorb them. ' +
      'The old residents and the new ones are not yet the same community. ' +
      `${governingFactionName} is being asked to do something about it and cannot agree what that something is.`
    );
  }
  // RUNG2-F13 (soak1k-0, soak1k-4204): the weak-economy arm told a DEPARTURE under an influx. It
  // reads the one direction now (domain/crisis/migrationDirection.js); the power step holds the
  // kind, not the entry, and the entry is born from the same catalog fact. No draw either way.
  // CENSUS-1b unit B: the power step now receives the stress ENTRIES, so the direction is the entry's.
  if (migrationDirectionOf(migrationEntry) === 'exodus') {
    return 'Three families left this week. Two more last week. The departure is quiet and orderly, which makes it worse. The people leaving have thought it through. What remains is those who cannot leave, those who choose to stay, and institutions running on fewer people than they were designed for.';
  }
  return (
    'More families arrived this week, and more the week before. The work they came for is not here, and every household taken in is one more the stores must cover. ' +
    `${governingFactionName || 'The governing authority'} is being asked to choose between the residents who were here first and the ones still arriving, and has not chosen.`
  );
};
