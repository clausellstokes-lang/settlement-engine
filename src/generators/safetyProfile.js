/**
 * safetyProfile.js
 * Generates the safety label, guard effectiveness description, crime types,
 * criminal institutions list, shadow economy estimate, and plot hooks for
 * the Viability tab's crime/safety section.
 */

import { getInstFlags, getPriorities, getStressFlags, tierAtLeast } from './helpers.js';
import {
  institutionMatchesNativeName,
  institutionMatchesRegex,
} from '../domain/institutionClassify.js';
import { institutionCategoryFlags } from './roleCategory.js';
import { CRIMINAL_GOVERNANCE_TYPE, crimeSignalOf } from '../domain/crimeSignal.js';
import { runningCriminalChains } from '../domain/facts/criminalStructureKey.js'; // BAR6-CRIME: the crime fact's leaf (defenseDisplay re-exports it), so the engine core reaches no display
import { defenceOf } from '../domain/facts/defence.js';
import { factsOf } from '../domain/facts/factsOf.js';
import { drawDeclared, lineText, resolveSibling } from '../domain/facts/drawDeclared.js';

/**
 * The pool's own "desperation theft" line, held once because two entries print it: the famine
 * and siege crime type below, and (lane RUNG1-TRUTH unit C) the survival-crime entry where the
 * record carries a criminal network.
 */
const DESPERATION_THEFT_DESC =
  'Hunger-driven theft of food, livestock, and stored goods. Enforcement struggles to distinguish survival crime from organised theft.';
/** The survival-crime line where no network exists (the economy step's own text, held once for
 *  `settleCrimeLinesToSignal` below). */
const SURVIVAL_NO_NETWORK_DESC =
  'Theft driven by economic desperation rather than organization. No criminal infrastructure: just too many people with too little, doing what they must to survive.';
/** The indebted stress's debt-evasion line, and the same line without the network it names
 *  (lane RUNG1B-F4 unit 4b: the clause is dropped, no word is added). */
const DEBT_EVASION_DESC =
  'Residents fleeing creditor obligations, transferring assets fraudulently, or using criminal networks to avoid collection.';
const DEBT_EVASION_NO_NETWORK_DESC =
  'Residents fleeing creditor obligations or transferring assets fraudulently to avoid collection.';

// ─── generateSafetyProfile ────────────────────────────────────────────────────

/**
 * Build the full safety profile for a settlement.
 *
 * @param {Object} config       - Settlement config (priorities, stress, threat, etc.)
 * @param {string} tier         - Settlement tier
 * @param {Array}  institutions - Settlement institution objects
 * @returns {Object} Safety profile with labels, descriptions, crime types, plot hooks
 */
export const generateSafetyProfile = (config = {}, tier = 'town', institutions = []) => {
  const pri     = getPriorities(config);
  const flags   = getInstFlags(config, institutions);
  const stress  = getStressFlags(config, institutions);
  // CENSUS-1 wave 0, fact 3: the defence atoms are the live roster's (`domain/facts/defence.js`),
  // never the raw roster's substring flags; the other presence flags are still priorityHelpers'.
  // CENSUS-1b unit A (a), the chair's ruling: the militia atom is the home's too (a ruined
  // militia patrols nothing; a household levy is a militia). It moves births, counted by cause.
  const defence = defenceOf({ institutions });
  // COHERENCE-AGREE: the mercenary atom is the home's too (priorityHelpers' own list of names named
  // "a mercenary company" in towns whose defence record lists none).
  const inst    = { ...flags.inst, hasWalls: defence.walls, hasWatch: defence.watch, hasGarrison: defence.garrison, hasGates: defence.gate, hasMilitia: defence.militia, hasMercenary: defence.mercenary }, courthouse = defenseFactsOf({ institutions }).hasCourthouse, small = SMALL_PLACES.includes(tier), tiny = TINY_PLACES.includes(tier), rosterRecord = { institutions }; // UPKEEP-8: the home's narrower court fact; the census's small places
  // CENSUS-1e unit 2 (Appendix B item 23, the inline T branches): each line CENSUS-5b declared in
  // SAFETY_LINE_SIBLINGS (below) resolves at the branch that prints it, against the live roster's
  // facts — the original where the record holds its atom, else its twin. Draw-free.
  const said = (/** @type {string} */ line) => resolveSibling(line, SAFETY_LINE_SIBLINGS, { facts: () => factsOf({ institutions }), poolId: 'safetyProfile:SAFETY_LINE_SIBLINGS', surface: 'defense', drawKind: 'T' });
  const threat  = config.monsterThreat || 'frontier';
  const watchLabel =
    tier === 'town'
      ? 'town watch'
      : tierAtLeast(tier, 'city')
        ? 'city watch'
        : 'local watch';

  // Active stress types
  const stresses = (config.stressTypes?.length)
    ? config.stressTypes
    : config.stressType ? [config.stressType] : [];
  const hasStress = (type) => stresses.includes(type);

  // Safety ratio: military effectiveness vs criminal (>1 = law winning, <1 = crime winning)
  const safetyRatio = flags.militaryEffective / Math.max(8, flags.criminalEffective);

  // Small-settlement passive community order bonus (no criminal infrastructure = community watches itself)
  const hasCriminalOrg = institutions.some(institution => (
    institutionMatchesRegex(
      institution,
      /thieves|criminal|gang|smuggler|fence/i,
    )
  ));
  // Small community flag — used to gate crime types that require criminal infrastructure
  const _isSmallCommunity = ['thorp','hamlet'].includes(tier) && !hasCriminalOrg;

  const communityOrderBonus =
    hasCriminalOrg    ? 0 :
    tier === 'thorp'  ? 1.25 :
    tier === 'hamlet' ? 1.20 :
    tier === 'village'? 1.20 :
    tier === 'town'   ? 1.20 :  // Raised: clean towns should read Moderate like villages
    tier === 'city'   ? 0.8  : 0;

  // For settlements with criminal orgs but formal courts: partial floor
  // A court system actively suppresses crime even if not eliminating it
  const hasFormatLaw = inst.hasCourtSystem || inst.hasPrison;
  const courtOrderFloor =
    !hasCriminalOrg ? 0 :
    hasFormatLaw && tierAtLeast(tier, 'city')  ? 1.25 :  // city+: garrison+watch+court → Moderate floor
    hasFormatLaw && tier === 'town'            ? 1.20 :  // town with court → Moderate floor (court suppresses crime)
    0;

  // Effective safety score used for label assignment
  const effectiveSafety = Math.max(safetyRatio, communityOrderBonus, courtOrderFloor);

  // ── Safety label and description ─────────────────────────────────────────
  // Stress conditions override the base label with crisis-specific ones.

  /**
   * The active stress strains, TYPED — band and condition kept SEPARATE.
   *
   * ⛔ WHY NOT AN ARRAY OF RENDERED LABELS, which is what this was until
   * 2026-09-05: the composite below needs each further strain's CONDITION back,
   * and it recovered it by re-parsing the label it had just composed
   * (`l.split(' — ')[1]`). That is a producer parsing its own output, and it was
   * WRONG: `'Dangerous — Plague Unrest'` is itself one of the strain values below,
   * so the plague leaf emits `'Dangerous — Plague Unrest — Plague Conditions'` and
   * `[1]` recovers `'Plague Unrest'` — the strain's own tail — instead of
   * `'Plague Conditions'`. Keeping the parts means never having to guess.
   *
   * Local to this function, so it costs zero persisted bytes: only the composed
   * `safetyLabel` string leaves here, exactly as before.
   * @type {Array<{strain: string, condition: string}>}
   */
  const safetyStrains  = [];
  const safetyDescs    = [];

  // Priority stress: these override everything else
  if (hasStress('occupied')) {
    const curfewAuthority = inst.hasGarrison
      ? 'The garrison, now under occupier command, enforces'
      : 'Occupation authorities enforce';
    safetyStrains.push({ strain: 'Controlled', condition: 'Occupation Curfew' });
    safetyDescs.push(
      `${curfewAuthority} the curfew at the checkpoints. Thieves are scarce now; the danger is informers ` +
      `and occupation officials, and the resistance works out of sight.`
    );
  }

  if (hasStress('under_siege')) {
    const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Desperate';
    const milRef = inst.hasGarrison ? 'The garrison keeps order' : small ? 'Those holding the place keep order' : 'The military command has taken charge of the streets'; // UPKEEP-8: no command or streets in a small place
    // BAR2-LABELS LB5 (C14738 C15234): no garrison, militia, watch or hired force stands: no one holds the place (the twin)
    safetyStrains.push({ strain: strainLabel, condition: 'Active Siege' });
    safetyDescs.push(
      `${inst.hasGarrison || inst.hasMilitia || inst.hasWatch || inst.hasMercenary || inst.hasCharterHall ? `${milRef}, and more harshly as the food runs down` : SIEGE_NO_FORCE_ORDER}. People quarrel over rations, food is sold ` +
      `under the counter, and the hungry have started to steal.`
    );
  }

  if (hasStress('famine')) {
    const strainLabel = safetyRatio >= 2 ? 'Strained' : safetyRatio >= 1 ? 'Unsafe' : 'Dangerous';
    const foodRef = inst.hasGarrison
      ? 'The garrison spends its days guarding the food'
      : 'Whoever controls the food now has the say';
    safetyStrains.push({ strain: strainLabel, condition: 'Famine Conditions' });
    safetyDescs.push(
      `People are hungry and stealing to eat. ${foodRef}. ` +
      `Anyone known to have food hidden away is robbed, or worse.`
    );
  }

  if (hasStress('plague_onset')) {
    const strainLabel = safetyRatio >= 2 ? 'Quarantined' : safetyRatio >= 1 ? 'Restricted' : 'Dangerous — Plague Unrest';
    const quarRef = inst.hasGarrison ? 'The garrison holds the quarantine lines'
                  : inst.hasWatch    ? 'The watch keeps the quarantine'
                  :                    'Neighbours keep the quarantine among themselves';
    safetyStrains.push({ strain: strainLabel, condition: 'Plague Conditions' });
    safetyDescs.push(
      `${quarRef}, but not everyone obeys. Frightened neighbours turn on the sick, ` +
      `and medicine and burials cost whatever the seller asks.`
    );
  }

  // Secondary stresses (only if no primary crisis overrides)
  if (!hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')) {
    if (hasStress('insurgency')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Dangerous';
      safetyStrains.push({ strain: strainLabel, condition: 'Insurgency' });
      safetyDescs.push(
        small ? 'Armed rebels are active, and nobody is sure whose side a neighbour is on.' : said('Armed rebels are active. Patrols have changed their routes, some districts are closed off, ' +
        'and nobody is sure whose side a neighbour is on.')
      );
    }
    if (hasStress('slave_revolt')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Dangerous' : 'Critical';
      safetyStrains.push({ strain: strainLabel, condition: 'Slave Revolt' });
      safetyDescs.push(
        small ? 'The rebels are loose and armed. People keep to their homes, and nobody goes out after dark.' : said('Rebels and guards are fighting in the contested districts. People keep off certain streets, ' +
        'and the regular patrols have stopped.')
      );
    }
    if (hasStress('wartime')) {
      const strainLabel = safetyRatio >= 2 ? 'Strained' : 'Tense';
      safetyStrains.push({ strain: strainLabel, condition: 'Wartime' });
      safetyDescs.push(
        'The war has changed daily life: strangers are watched closely, ' +
        'and curfews and fixed prices are enforced now and then.'
      );
    }
    if (hasStress('politically_fractured')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Volatile';
      safetyStrains.push({ strain: strainLabel, condition: 'Political Fracture' });
      safetyDescs.push(
        small || !(inst.hasGarrison || inst.hasWatch || inst.hasMilitia || inst.hasMercenary) ? 'No stable governing authority; whoever holds sway decides what rules apply, and that changes.' : 'No stable governing authority. Enforcement is inconsistent; which power controls a district determines what rules apply.'
      );
    }
    if (hasStress('succession_void')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Volatile';
      safetyStrains.push({ strain: strainLabel, condition: 'Succession Crisis' });
      safetyDescs.push(
        said("Authority is contested. The watch is uncertain whose orders to follow. Opportunistic crime is rising in the gap.")
      );
    }
    if (hasStress('recently_betrayed')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Suspicious';
      safetyStrains.push({ strain: strainLabel, condition: 'Aftermath of Betrayal' });
      safetyDescs.push(
        "Since the betrayal, strangers are watched closely and neighbours quietly test each other's loyalty."
      );
    }
    if (hasStress('monster_pressure')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Dangerous';
      safetyStrains.push({ strain: strainLabel, condition: 'Monster Threat' });
      safetyDescs.push(
        'Creatures come close after dark. People keep away from the outlying houses, ' +
        'and nobody walks out at night.'
      );
    }
    if (hasStress('indebted')) {
      const strainLabel = safetyRatio >= 2 ? 'Strained' : 'Tense';
      safetyStrains.push({ strain: strainLabel, condition: 'Debt Crisis' });
      safetyDescs.push(
        "The debt comes before everything. The creditor's agent decides which wrongs are chased and which are let go."
      );
    }
    if (hasStress('mass_migration')) {
      const strainLabel = safetyRatio >= 2 ? 'Strained' : 'Tense';
      safetyStrains.push({ strain: strainLabel, condition: 'Mass Migration' });
      safetyDescs.push(
        tiny ? 'More people have arrived than there are roofs or work for, and newcomers and old residents quarrel over what there is.' : said("More people have arrived than there are roofs or work for, and newcomers and old residents quarrel in the streets. " +
        "The watch cannot tell one stranger from the next.")
      );
    }
    if (hasStress('religious_conversion')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Suspicious';
      safetyStrains.push({ strain: strainLabel, condition: 'Religious Upheaval' });
      safetyDescs.push(
        'The change of faith has split the people here. Each side suspects the other of informing, ' +
        'and the new rules are enforced one day and ignored the next.'
      );
    }
  }

  // ── Base safety label (no active stress) ─────────────────────────────────
  let safetyLabel;
  let safetyDesc;

  if (safetyStrains.length > 0) {
    // Combine the stress strains into one composite string: the leading strain in
    // full, then each further strain's CONDITION — read off the typed entry, never
    // parsed back out of a rendered label. See the safetyStrains docblock for the
    // two-em-dash plague strain that made the old parse wrong.
    safetyLabel = `${safetyStrains[0].strain} — ${safetyStrains[0].condition}`;
    if (safetyStrains.length > 1) {
      safetyLabel += ` + ${safetyStrains.slice(1).map(e => e.condition).join(' + ')}`;
    }
    safetyDesc = safetyDescs.join(' ');
  } else if (stress.stateCrime) {
    safetyLabel = 'Controlled — Authoritarian';
    const visibleAuthority = inst.hasGarrison
      ? 'The garrison is visible everywhere.'
      : 'Armed officials are visible everywhere.';
    // BAR6-CRIME (LAW 5 widened, size): no streets in a thorp or a hamlet; SEAM-DESKS (2026-11-17): the gate in the guard's sight (`tierKey`)
    // LAST-DECLARE (2026-11-18): the streets line declares its size (`tier: ≥ village`, SAFETY_LINE_SIBLINGS below) and resolves
    // through the door on the town's tier; its twin is the small place's line, exactly where the tier test printed it before.
    const quietOpening = resolveSibling('The streets are unusually quiet.', SAFETY_LINE_SIBLINGS, { facts: () => factsOf({ institutions, tier }), poolId: 'safetyProfile:SAFETY_LINE_SIBLINGS', surface: 'defense', drawKind: 'T' });
    safetyDesc = `${quietOpening} ${visibleAuthority} Residents face little risk from common thieves and considerably more from the authorities themselves. Unofficial disappearances are not discussed openly.`;
  } else if (stress.crimeIsGovt) {
    safetyLabel = 'Dangerous — Criminal Governance';
    const crimeRef = inst.hasThievesGuild ? "The thieves' guild" : 'Organized crime';
    const garNote  = inst.hasGarrison ? ' The garrison takes orders from criminal leadership.' : '';
    safetyDesc = `The criminals are the government here. ${crimeRef} keeps its own kind of order: ` +
      `protection is bought, and those who cannot pay go without.${garNote}`;
  // ── Safety label thresholds ─────────────────────────────────────────────
  // effectiveSafety = max(militaryEffective/criminalEffective, communityBonus, courtFloor)
  // Intended meaning:
  //   >= 3.5  Very Safe   — military 3.5× stronger than criminal presence (fortress towns, occupations)
  //   >= 2.0  Safe        — military clearly dominant, criminal elements suppressed
  //   >= 1.2  Moderate    — functional equilibrium; law present but crime exists
  //   >= 0.6  Unsafe      — criminal activity measurably outpaces enforcement
  //   <  0.6  Dangerous   — organized crime or crisis has overwhelmed the watch
  } else if (effectiveSafety >= 3.5) {
    safetyLabel = 'Very Safe';
    const lawRef =
      inst.hasGarrison
        ? inst.hasWatch
          ? `garrison and ${watchLabel}`
          : 'garrison'
        : inst.hasWatch
          ? watchLabel
          : inst.hasMilitia
            ? 'militia'
            : 'local guard';
    // COHERENCE-AGREE-3 (F5): the gates are the gate home's (defence.gate), not the walls'; a palisade has no gate of record.
    const wallNote   = !inst.hasWalls ? '' : inst.hasGates && beneathTheWalls(institutions) ? GATES_KEPT_SMUGGLERS_BENEATH : said(' Everyone comes in by the gates, where the guard sees them.'); // BAR3-DEFECON (C20212 C26238): safetyLineTruth.js
    const charNote   = inst.hasCharterHall ? said(" The adventurers' charter hall handles threats the watch cannot.") : ''; // F12: the watch, where it stands
    // Canonical threat vocabulary is heartland/frontier/plagued ('embattled' was never emitted).
    const threatNote = threat !== 'plagued' ? '' : inst.hasGarrison || inst.hasWatch ? ' The constant monster threat keeps the guard exceptionally well-drilled and alert.' : MONSTER_THREAT_NO_DRILL; // BAR3-DEFECON (C55188): no drilled guard where only volunteers stand
    const seesTo = lawRef === 'local guard' ? '' : `; the ${lawRef} sees to that`; // TAIL-DEFECON (#23466): no garrison, watch or militia, no force named
    safetyDesc = `Visitors can walk anywhere at any hour, and there is little crime${seesTo}.` +
      `${wallNote}${charNote}${threatNote}`;
  } else if (effectiveSafety >= 2) {
    safetyLabel = 'Safe';
    // COHERENCE-UPKEEP-7 (item 3, the round-three cut's #104): where no garrison, watch or militia stands, no
    // enforcement is "present": the neighbours keep order (the tab's own "Nobody here is paid to keep order").
    const lawLine = inst.hasGarrison ? 'The garrison is present and responsive.' : inst.hasWatch ? 'The watch is present and responsive.'
      : inst.hasMilitia ? 'The militia is present and responsive.' : 'Neighbours notice trouble and deal with it themselves.';
    const wallNote = inst.hasWalls ? ' The walls keep most trouble outside.' : '';
    const courtNote = inst.hasCourtSystem && courthouse ? ' With a working court, organised crime treads carefully.' : ''; // UPKEEP-8: a court named only where a courthouse stands
    safetyDesc = `Crime exists but is well-managed. ${lawLine} Petty theft is the primary risk; ` +
      `organized crime has ${footholdWord(hasCriminalOrg || flags.inst.hasCriminalInst || institutions.some((i) => /gambl/i.test(String(i?.name ?? ''))))}.${courtNote}${wallNote}`; // TAIL-DISPLAY-CIVIC-4 (V10): safetyLineTruth.js
  } else if (effectiveSafety >= 1.2) {
    safetyLabel = 'Moderate';
    const force = inst.hasGarrison ? 'garrison' : inst.hasWatch ? 'watch' : inst.hasMilitia ? 'militia' : 'none'; // PLACE-1 (2026-11-20): each sentence slot is drawn
    const slot = (/** @type {string} */ id, /** @type {ReadonlyArray<{ text: string }>} */ pool) => safetyDescSlot(id, pool, institutions, tier, config); // from its declared pool (src/data/safetyDescLines.js)
    const wallNote = inst.hasWalls ? slot('walls', MODERATE_WALLS) : '';
    safetyDesc = tiny ? `${slot('tiny', TINY_MODERATE)}${wallNote}` : `${slot('opening', MIXED_OPENING)} ${slot(`force.${force}`, MIXED_FORCE[force])} ` + // UPKEEP-14 (f): no areas, paths or corners in a thorp or hamlet
      `${slot('corners', MIXED_CORNERS)}${wallNote}`;
  } else if (effectiveSafety >= 0.6) {
    safetyLabel = 'Unsafe'; const composed = inst.hasGarrison && !hasStress('under_siege'), slot = (/** @type {string} */ id, /** @type {ReadonlyArray<{ text: string }>} */ pool) => (composed ? safetyDescSlot(`unsafe.${id}`, pool, institutions, tier, config) : String(lineText(pool[0]))); // PLACE-1: with a garrison, each slot from its pool
    const lawRef =
      inst.hasGarrison  ? slot('garrison', UNSAFE_GARRISON) :
      inst.hasWatch      ? 'The watch is stretched far beyond its capacity.' :
      inst.hasMilitia    ? 'The militia cannot maintain consistent coverage. They have other jobs to do.' :
      inst.hasMercenary  ? 'The mercenary company focuses on protecting those who pay them, not the general population.' :
                           'There is no meaningful guard presence.';
    const wallNote = inst.hasWalls ? slot('walls', UNSAFE_WALLS) : '';
    safetyDesc = `${slot('opening', UNSAFE_OPENING)} ${lawRef} ${hasStress('under_siege') ? lineText({ text: 'Inside the siege lines, people are advised to move in groups and keep valuables hidden.', needs: ['crisis: siege'] }) : slot('advice', UNSAFE_ADVICE)}${wallNote}`; // BAR5-SAFETY (LAW 5): no travellers come in under a siege
  } else {
    safetyLabel = 'Dangerous';
    const lawRef =
      inst.hasGarrison  ? 'The garrison is a formality: present on paper, absent in practice.' :
      inst.hasWatch      ? 'The watch cannot respond effectively; reports are filed and forgotten.' :
      inst.hasMilitia    ? 'The militia musters for emergencies only; day-to-day crime is uncontested.' :
      inst.hasMercenary  ? 'The mercenary company has effectively become another gang.' :
                           'There is effectively no law enforcement.';
    const wallNote   = inst.hasWalls ? ' Even the walls provide limited protection. The threat is within.' : '';
    const courtNote  = inst.hasCourtSystem ? '' : ' With no court, quarrels are settled with fists and knives.';
    const selfHelp = tiny ? 'Residents protect themselves through their neighbours, or by paying whoever is strongest.' // TAIL-DEFECON (#16568): no streets to control in a thorp or a hamlet
      : 'Residents protect themselves through community networks or tribute paid to whoever controls their street.';
    safetyDesc = `Violence and theft are routine. ${lawRef} ${selfHelp}${courtNote}${wallNote}`;
  }

  // ── Guard effectiveness description ───────────────────────────────────────
  let guardEffectivenessDesc;

  if (inst.hasMilitaryInst) {
    const lawRef =
      inst.hasGarrison  ? inst.hasWatch ? `garrison and ${watchLabel}` : 'garrison'  :
      inst.hasWatch      ? watchLabel       :
      inst.hasMilitia    ? 'citizen militia'  :
      inst.hasMercenary  ? 'mercenary company':
      inst.hasCharterHall? "adventurers' charter hall" : 'local guard';

    const prisonNote = inst.hasCourtSystem && courthouse && inst.hasPrison
      ? voiceOf('courtAndPrison', COURT_AND_PRISON(lawRef)) // SW-B5 FRAMES: the original is index 0
      : inst.hasCourtSystem
      ? (courthouse ? voiceOf('courtNoPrison', COURT_NO_PRISON(lawRef)) : '') // UPKEEP-8: the court flag with no courthouse names no court (the flag is #598's, step 7)
      : inst.hasPrison
      ? ' Offenders can be jailed, but without a working court system enforcement is arbitrary.'
      : ' Without courts or prison, enforcement relies entirely on fines, exile, or summary violence.';

    // COHERENCE-AGREE-3 (F5): the gate home answers "gates"; walls with no gate take the twin that names none.
    // (A template over the force noun, so it is chosen here by the home, not keyed in the sibling table; the twin carries its declaration, COHERENCE-AGREE-4.)
    const many = manyForce(lawRef); // TAIL-DEFECON (#20612 #20616): "the garrison and city watch" take a plural verb
    const wallNote = !inst.hasWalls ? ''
      : inst.hasGates ? (hasStress('under_siege') ? lineText({ text: ` The gates are shut against the siege, and the ${lawRef} ${many ? 'hold' : 'holds'} them.`, needs: ['crisis: siege'] }) // TAIL-DEFECON (#07371 #07373, ruling D3)
        : gatesSmugglersLine(lawRef, many, institutions)) // TAIL-DISPLAY-CIVIC-4 (V7): safetyLineTruth.js
        : lineText({ text: ` The walls leave few ways in, so smugglers have to get past the ${lawRef}.`, needs: ['walls'], excludes: ['gate'] });

    if (stress.stateCrime) {
      guardEffectivenessDesc = (many ? `The ${lawRef} are well organised and work for the rulers' purses, not for the public; they are loyal to whoever pays them.`
        : `The ${lawRef} is well organised and works for the rulers' purses, not for the public; it is loyal to whoever pays it.`) + prisonNote;
    } else if (flags.militaryEffective < 30 && pri.economy < 35 && lawRef !== "adventurers' charter hall") { // TAIL-DEFECON (#18786): a charter hall is no enforcer; its own branch below
      const militiaNote = inst.hasMilitia ? ': these are volunteers with day jobs, not soldiers' : '';
      guardEffectivenessDesc = `The ${lawRef} ${many ? 'exist' : 'exists'} on paper. Chronically underpaid and poorly equipped${militiaNote}. ` +
        `Susceptible to bribery; enforcers who can be bought by whoever has coin.${prisonNote}`;
    } else if (stress.merchantArmy) {
      const secRef = inst.hasMercenary ? 'mercenary companies' : 'private security';
      const guildRef = inst.hasMerchantGuild ? 'The merchant guilds' : 'Wealthy interests';
      guardEffectivenessDesc = (inst.hasGarrison || inst.hasWatch ? `${guildRef} keep their own ${secRef} beside the ${lawRef}: ` : `Public law enforcement is largely a formality. ${guildRef} maintain their own ${secRef}: `) + // UPKEEP-8 (#1080)
        `real protection exists, but only for those with the right associations.${prisonNote}`;
    } else if (inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch) {
      if (flags.militaryEffective >= 55) {
        guardEffectivenessDesc = `The citizen militia is well organised and willing: these are people defending their own homes. ` +
          `They do not patrol like professionals, but they know every lane.${prisonNote}${wallNote}`;
      } else {
        guardEffectivenessDesc = `The citizen militia musters when needed but cannot maintain consistent patrol. ` +
          `Volunteers with other work to do; reliable in a crisis, absent during routine crime.${prisonNote}`;
      }
    } else if (inst.hasMercenary && !inst.hasGarrison && !inst.hasWatch) { // COHERENCE-UPKEEP-7 (the cut's #640): where a watch stands, its own line
      guardEffectivenessDesc = `A mercenary company provides enforcement: professional and effective, but loyal to the contract, not the community. ` +
        `When the coin stops, so does the protection.${prisonNote}${wallNote}`;
    } else if (inst.hasCharterHall && !inst.hasGarrison && !inst.hasWatch) {
      guardEffectivenessDesc = `The adventurers' charter hall coordinates emergency response to threats. Effective for monster incursions and major disturbances, ` +
        `less so for routine crime prevention. Not a police force.${prisonNote}`;
    } else if (flags.militaryEffective >= 65 && pri.economy >= 50) {
      // TAIL-DISPLAY-CIVIC-3 V3: under a siege, an occupation or a famine, the twin (safetyLineTruth.js :: patrolTwin)
      guardEffectivenessDesc = (patrolTwin(lawRef, patrolCrisisOf(hasStress), true) ?? `The ${lawRef} ${many ? 'are well paid, well equipped and patrol' : 'is well paid, well equipped and patrols'} properly. ` +
        'They come when called, and though some take bribes, it is not the custom.') + `${prisonNote}${wallNote}`;
    } else if (flags.militaryEffective >= 65 && pri.economy < 40) {
      guardEffectivenessDesc = `The ${lawRef} ${many ? 'are' : 'is'} disciplined but resource-constrained: motivated with inadequate equipment and irregular pay. ` +
        `Effective in a fight; vulnerable to sustained corruption.${prisonNote}${wallNote}`;
    } else {
      // SW-B5 FRAMES: the original is index 0. BAR8-K-WATCH (13e, BAR8-AUDIT-K's 13e.hours; the seventh read's C42053): #18 is
      // drawn WITH ITS DECLARATION, the seed's frame as `voiceOf` chooses it (no roll); "most hours of the day" presumes the force
      // walks by day (the atom `force walks by day`, `forceHours.js`), and where every force's own text walks the night ("after
      // dark", "walk the night") the refused frame resolves to an admitted line of the same pool (`drawDeclared`: only a refused
      // winner moves).
      const frames = STANDARD_PATROL(lawRef), drawn = String(drawDeclared([...frames.slice(0, 3), { text: frames[3], needs: ['force walks by day'] }], { draw: (pool) => pool[frames.indexOf(voiceOf('standardPatrol', frames))], facts: () => factsOf({ institutions }), key: `${getActiveRng()?.seed ?? ''}::safetyProfile:standardPatrol`, poolId: 'safetyProfile:STANDARD_PATROL', surface: 'defense', drawKind: 'T' }).text ?? frames[0]);
      guardEffectivenessDesc = (patrolTwin(lawRef, patrolCrisisOf(hasStress)) ?? drawn) + `${prisonNote}${wallNote}`; // TAIL-DISPLAY-CIVIC-3 V3: the draw kept, its twin
    }
  } else if (inst.hasCourtSystem) {
    guardEffectivenessDesc = (courthouse ? 'There is no watch, only a court. ' : 'There is no watch. ') + // UPKEEP-8: a court named only where a courthouse stands
      'When a quarrel turns violent, the neighbours or whoever is strongest nearby step in.';
  } else {
    const noWatch = voiceOf('noWatchSmall', NO_WATCH_SMALL);
    guardEffectivenessDesc = ['thorp', 'hamlet', 'village'].includes(tier)
      ? quarrelUnderViolence(hasStress('occupied') && noWatch === NO_WATCH_SMALL[2] ? NO_WATCH_OCCUPIED : noWatch, safetyLabel) // SW-B5 FRAMES: the original is index 0; TAIL-DEFECON (#B14103): the occupiers keep order; BAR3-DEFECON (C25320): safetyLineTruth.js
        /* the old families' line and its vantages: NO_WATCH_SMALL at the end of this file */
      : 'There is no watch and nobody in charge of order; people look after themselves and their own.';
  }

  // ── Crime types ───────────────────────────────────────────────────────────
  const crimeTypes = [];

  if (stress.stateCrime) {
    const garRef = inst.hasGarrison ? 'the garrison' : 'armed officials';
    crimeTypes.push({
      type: 'State predation',
      desc: `The worst thieves here hold office: ${garRef} use their authority to line their own pockets. ` +
            'Tax extortion, forced confiscations, and selective enforcement targeting those without political connections.',
    });
  }
  if (stress.crimeIsGovt) {
    const crimeRef = inst.hasThievesGuild ? "The thieves' guild" : 'Organized crime';
    crimeTypes.push({
      type: CRIMINAL_GOVERNANCE_TYPE, // the label's one home (TAIL-CLOSE-SRC-4)
      desc: `${crimeRef} has filled the power vacuum left by absent or failed civil authority. It provides a form of order and extracts a price for it.`,
    });
  }
  if (stress.arcaneBlackMarket) {
    const providers =
      inst.hasAlchemist && inst.hasMagesGuild
        ? "Alchemists and members of the mages' guild"
        : inst.hasAlchemist
          ? 'Alchemists and other magical practitioners'
          : inst.hasMagesGuild
            ? "Members of the mages' guild"
            : 'Magical practitioners';
    crimeTypes.push({
      type: 'Arcane black market',
      desc: `${providers} who operate outside legal channels supply a sophisticated underground market for forbidden components, illegal rituals, and undetectable forgeries.`,
    });
  }
  if (stress.religiousFraud) {
    // BAR3-DEFECON (C14930): the cover and the clergy are a church of the place's own (the temple leaf), not access to a neighbour's
    crimeTypes.push({ type: 'Religious fraud', desc: hasInstitution(rosterRecord, 'temple') ? "The church's moral authority provides cover for sophisticated fraud. Fake relics, forged dispensations, and corrupt clergy who treat their position as a commercial opportunity." : RELIGIOUS_FRAUD_NO_CHURCH });
  }
  if (stress.merchantCriminalBlur) {
    const tradeRef = inst.hasMerchantGuild ? 'Guild merchants' : 'Wealthy traders';
    crimeTypes.push({
      type: 'Commercial crime',
      desc: `${tradeRef} and the criminals are often the same people; what separates them is a licence.`,
    });
  }
  if (flags.criminalEffective >= 60 && pri.economy >= 60 &&
      !stress.merchantCriminalBlur && inst.hasThievesGuild) {
    const courtNote = inst.hasCourtSystem && inst.hasPrison
      ? ' Guild operations are careful and layered. They keep enough distance from violent crime that prosecution is difficult.'
      : inst.hasCourtSystem // COHERENCE-AGREE: a court and no prison is not "no court"
      ? lineText({ text: ' With nowhere to hold the guilty, operations are conducted openly enough to be an open secret.', needs: ['court'], excludes: ['prison'] })
      : ' With no reliable court system to fear, operations are conducted openly enough to be an open secret.';
    crimeTypes.push({
      type: 'Organized guild crime',
      desc: `The thieves' guild is rich and well run: protection rackets, smuggling, and jobs done for whoever pays.${courtNote}`,
    });
  }
  // Survival crime: requires either a criminal institution OR a settlement large enough
  // that community self-regulation breaks down. Clean thorps/hamlets don't have fences
  // or hired muscle networks — desperate people steal from neighbors quietly, not organizationally.
  //
  // ⛔ "NO CRIMINAL INFRASTRUCTURE" IS FALSE BESIDE A NETWORK (lane RUNG1-TRUTH unit C, 2026-11-04;
  // docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 16, A-06; the chair's ruling C). Where the roster
  // carries a criminal-category institution (the Institutions tab's own mark,
  // `institutionCategoryFlags`), the entry prints the pool's existing desperation-theft line
  // instead. The TYPE is kept, so the services menu that reads it (the fence by word of mouth)
  // is unchanged; nothing here draws.
  if (flags.criminalEffective >= 48 && pri.economy < 35 && !_isSmallCommunity) {
    crimeTypes.push({
      type: 'Survival crime',
      desc: institutionCategoryFlags(institutions).hasCriminal
        ? DESPERATION_THEFT_DESC
        : SURVIVAL_NO_NETWORK_DESC,
    });
  }
  if (flags.criminalEffective >= 45 && pri.magic >= 48 &&
      !stress.arcaneBlackMarket && inst.hasMagicInst) {
    const magRef = inst.hasWizardTower ? 'tower resources' : inst.hasAlchemist ? 'alchemical knowledge' : 'magical ability';
    crimeTypes.push({
      type: 'Magical crime',
      desc: `Practitioners misuse ${magRef} for profit. Identity alteration, scrying, ${inst.hasAlchemist ? 'alchemical fraud' : 'fraud'}, or targeted curses-for-hire.`,
    });
  }
  if (inst.hasSmuggling) {
    const routeType = inst.hasPort ? 'port-based' : 'overland';
    const gateNote  = inst.hasGates
      ? said(" The settlement's gates and walls are checkpoints that smugglers work around. Bribing officials, using hidden routes, or moving shipments at shift changes.")
      : ' The lack of controlled entry points makes movement relatively easy; no gates to bribe and no checkpoints to avoid.';
    const prosecuteNote = inst.hasPrison && inst.hasCourtSystem
      ? ' Arrests do happen. Prosecution is real, which is why the network is careful.'
      : inst.hasPrison
      ? ' Offenders can be jailed, but without consistent courts, enforcement is sporadic.'
      : inst.hasCourtSystem // COHERENCE-AGREE: a court and no prison is not "no court"
      ? lineText({ text: ' With nowhere to hold the guilty, the risk of operating is low. Arrest means a fine at worst.', needs: ['court'], excludes: ['prison'] })
      : ' Without prison or courts, the risk of operating is low. Arrest means a fine at worst.';
    crimeTypes.push({
      type: 'Smuggling',
      desc: hasStress('under_siege') ? lineText({ text: 'The siege has shut the roads, so what contraband is already inside is hoarded and sold dear by those who know the patrol schedules.', needs: ['crisis: siege'] }) + prosecuteNote // TAIL-DEFECON (#B03371): under a siege nothing moves through
        : `An active ${routeType} smuggling operation moves contraband through the settlement. The routes are established and the operators have learned the patrol schedules.${gateNote}${prosecuteNote}`,
    });
  }
  if (inst.hasGangInfra && crimeTypes.length === 0) {
    const garRef  = inst.hasGarrison ? said(' The garrison acknowledges the problem but focuses on the walls and gates. Interior policing is under-resourced.')
                  : inst.hasWatch    ? ' The watch responds to the worst incidents but cannot contest territorial control.'
                  : inst.hasMilitia  ? ' The militia is composed of locals who know the gangs personally. Enforcement is complicated.'
                  :                    ' With no formal guard, the gangs operate without meaningful opposition.';
    const wallNote = inst.hasWalls ? ' District boundaries often follow the old wall lines and alleyways.' : '';
    crimeTypes.push({
      type: 'Street gang activity',
      desc: GANG_HOUSES_OF(institutions) >= 2 && !small ? `Territorial gangs control specific districts, extorting local businesses and residents. Violence is episodic rather than constant: mostly enforcing territorial boundaries.${garRef}${wallNote}` // UPKEEP-8 (#ww-516): one gang, or a small place
        : `A street gang controls part of the place, extorting local businesses and residents. Its violence comes and goes, mostly over its territory.${garRef}`,
    });
  }

  // Fallback if safety is bad but no specific crime type identified
  const isDangerous = safetyLabel === 'Unsafe' || safetyLabel === 'Dangerous' ||
                      safetyLabel === 'Dangerous — Criminal Governance' ||
                      safetyLabel === 'Controlled — Authoritarian';

  // Small communities: if still no crime types, skip the fallback entirely —
  // community pressure handles order without generating criminal service entries.
  if (_isSmallCommunity && crimeTypes.length === 0) {
    // No crime type for clean small communities — community order handles it
    // (already reflected in communityOrderBonus above)
  } else if (crimeTypes.length === 0 && (isDangerous || flags.criminalEffective >= 45)) {
    if (flags.criminalEffective < 35 || effectiveSafety < 0.6) {
      const lawRef  = inst.hasMilitaryInst ? said('The watch is too thinly spread to maintain order.') : 'There is no meaningful law enforcement.';
      const charNote = inst.hasCharterHall ? ' The charter hall handles external threats but is not equipped for civil enforcement.' : '';
      const courtNote = inst.hasCourtSystem ? '' : ' Without a court, there is no formal mechanism for resolving disputes peacefully.';
      crimeTypes.push({
        type: 'Lawlessness',
        desc: `${lawRef} Disputes are settled by whoever is stronger. Property is kept only by those who can defend it.${charNote}${courtNote}`,
      });
    } else {
      const courtNote = inst.hasCourtSystem && inst.hasPrison
        ? ' Consequences exist (offenders risk real prosecution) which keeps serious organised crime from taking root.'
        : inst.hasCourtSystem // COHERENCE-AGREE: a court and no prison is not "no court"
        ? lineText({ text: ' With nowhere to hold the guilty, most offenders face no meaningful consequences.', needs: ['court'], excludes: ['prison'] })
        : ' The lack of reliable courts and detention means most offenders face no meaningful consequences.';
      crimeTypes.push({
        type: 'Background crime',
        desc: `Petty theft, minor fraud, and opportunistic violence are persistent. No single dominant organisation: just the steady pressure of too many people with too little, and too few consequences for taking.${courtNote}`,
      });
    }
  }

  // ── Stress-specific crime type additions ──────────────────────────────────
  const addCrimeIfMissing = (type, desc) => {
    if (!crimeTypes.some(c => c.type === type)) crimeTypes.push({ type, desc });
  };

  if (hasStress('famine') || hasStress('under_siege')) {
    // The survival entry may already print this line (unit C above): printed once, never twice.
    if (!crimeTypes.some((c) => c.desc === DESPERATION_THEFT_DESC)) {
      addCrimeIfMissing('desperation theft', DESPERATION_THEFT_DESC);
    }
    addCrimeIfMissing('black market food', tiny ? "What food there is goes to whoever can pay the holder's price." // TAIL-DEFECON (#05801): no controls or channels in a thorp or a hamlet; TAIL-CORPUS-DEF-5: no stores named (the Defense tab prints none)
      : 'Controlled goods (grain, salt, preserved meat) changing hands at extortionate prices through unofficial channels.');
  }
  if (hasStress('occupied')) {
    addCrimeIfMissing('resistance activity',
      'Sabotage, information-passing, and low-level violence against occupation infrastructure. Officially classified as criminal; morally contested.');
    addCrimeIfMissing('collaboration fraud',
      "Residents profiting by informing on neighbours or manipulating occupation administration. Source of deep social tension.");
  }
  if (hasStress('plague_onset')) {
    addCrimeIfMissing('quarantine violation',
      'Movement restrictions ignored for economic necessity or family access. Creates both genuine public health risk and enforcement revenue.');
    addCrimeIfMissing('plague profiteering',
      inst.hasMarket || inst.hasMerchantGuild ? 'Price gouging on medicines, protective herbs, and burial services. Often conducted by otherwise respectable merchants.' : 'Price gouging on medicines, protective herbs, and burial services.');
  }
  if (hasStress('indebted')) {
    addCrimeIfMissing('debt evasion', DEBT_EVASION_DESC);
  }
  if (hasStress('insurgency')) {
    const insurgentDriven = (flags.criminalEffective || 0) > (flags.militaryEffective || 0);
    addCrimeIfMissing('political violence',
      insurgentDriven
        ? said(said('Street-level confrontations between insurgent supporters and the watch. Officially categorised as riot and disorder.')) // TAIL-DEFECON (#18708): its twin through its own set
        : 'Targeted intimidation and occasional violence against officials loyal to the current authority. Professionally executed.');
    addCrimeIfMissing('loyalty testing',
      'Both the governing power and the insurgency pressure individuals to declare allegiance. Refusal is dangerous. False declarations are common.');
    addCrimeIfMissing('information trade',
      'Intelligence about the other side commands real money. Both sides pay for names, plans, and movements.');
  }
  if (hasStress('slave_revolt')) {
    addCrimeIfMissing('revolt violence', small ? 'Armed fighting between the rebels and those set against them. People keep to their homes.' :
      said('Active armed conflict between revolt participants and security forces in contested districts. Civilians are avoiding specific streets. The watch has abandoned normal patrol patterns.'));
    addCrimeIfMissing('escape networks',
      'Organised infrastructure helping enslaved persons escape. Safe houses, forged papers, passage out of the settlement. The same network that was small and cautious is now large and urgent.');
    addCrimeIfMissing('informant pressure',
      'Both the authorities and the revolt leadership are pressing people for information. Silence is being interpreted as allegiance. Some residents have already left, so they will not be forced to choose.');
    addCrimeIfMissing('weapons trade',
      small ? 'Stolen and improvised weapons circulating among the rebels. Some are being smuggled in from outside.' : 'Stolen and improvised weapons circulating in the revolt-held districts. Some are being smuggled in from outside. The black market is very active.');
  }
  if (hasStress('religious_conversion')) {
    addCrimeIfMissing('underground worship',
      'Banned or contested religious practice continuing in private homes, cellars, and outbuildings. Informal networks providing space, materials, and warning of enforcement activity.');
    addCrimeIfMissing('religious fraud',
      inst.hasChurch ? 'False conversion declarations sold or arranged for a fee. Forged certification of compliance. Priests accepting payment to record conversions that did not occur.' : 'False conversion declarations sold or arranged for a fee. Forged certification of compliance.');
    if (institutions.some((i) => RELIGIOUS_HOUSE.test(String(i?.name ?? '')) && !/^access to/i.test(String(i?.name ?? '')))) { // TAIL-DEFECON (#16495): only where a religious house stands
      addCrimeIfMissing('contested property',
        "Religious buildings, land, and endowments whose ownership is legally ambiguous following the change in religious authority. Being occupied, transferred, or stripped by whoever moves fastest.");
    }
    addCrimeIfMissing('informant networks',
      'Enforcement authorities paying for information about non-compliant households. Neighbour reporting on neighbour. Some reports are sincere. Many are settled scores.');
  }
  if (hasStress('wartime')) {
    // BAR6-CRIME (the chair's SV1): the army's contracts, no crown named. TAIL-DEFECON (#18752 #11777 #21987 #03039 #B27552): no crown contracts, inspectors, industry or wealthy families in a thorp or a hamlet
    // TAIL-DISPLAY-CIVIC-3 V3: a place with no trade route sells nothing to an army's buyers (r2s-wartime-thorp-2: isolated, no
    // exports, no imports); the deserters' food is settled against the food record at assembly (settleCrimeLinesToSignal)
    if (config.tradeRouteAccess !== 'isolated') addCrimeIfMissing('war profiteering', tiny ? "Whatever the army's buyers will take is sold to them dear, and not all of it is as sound as it is said to be."
      : "Suppliers adulterating the grain and provisions sold to the army's contracts. Inspectors are overworked or bribed. The settlement's reputation for reliable supply is being consumed for short-term profit."); // SEAM-DESKS (2026-11-17): no leather named (the draw reads the roster alone, and no atom on the line names the leather trade)
    addCrimeIfMissing('deserter networks', tiny ? DESERTERS_FED_TINY : DESERTERS_FED);
    if (!tiny) addCrimeIfMissing('conscription fraud',
      'Wealthy families paying poorer ones to send sons in their place. The practice is illegal, widespread, and poorly enforced. It concentrates the actual dying in specific households.');
  }
  if (hasStress('mass_migration')) {
    addCrimeIfMissing('displacement crime',
      said('Theft and petty fraud by new arrivals with no local ties and no established credit. The watch struggles to distinguish transients from residents.'));
    addCrimeIfMissing('cultural friction',
      'Violent incidents between established residents and newcomers. Usually starts with an economic dispute and escalates.');
    addCrimeIfMissing('black market passage', tiny ? 'A way onward, sold quietly to newcomers who were told to move on.' // TAIL-DISPLAY-CIVIC-3 V3: no bed is presumed (r2s-mass_migration-thorp-3: seven people, no inn or lodging house); TAIL-DEFECON (#09343): no documents or authorities in a thorp or a hamlet
      : 'Forged residence documents, unofficial lodging, underground routes for those authorities have turned away. Very profitable.');
  }

  // ── Criminal institutions present (named) ─────────────────────────────────
  const CRIMINAL_INST_LABELS = {
    "thieves' guild chapter":      "Thieves' Guild Chapter",
    "thieves' guild (powerful)":   "Thieves' Guild (Powerful)",
    "assassins' guild":            "Assassins' Guild",
    'multiple criminal factions':  'Rival Gangs',
    'black market':                'Black Market',
    'black market bazaar':         'Black Market Bazaar',
    'smuggling operation':         'Smuggling Operation',
    'smuggling network':           'Smuggling Network',
    'street gang':                 'Street Gang',
    'front businesses':            'Front Businesses',
    'underground city':            'Underground City',
    'gambling den':                'Gambling Den',
    'gambling halls':              'Gambling Halls',
    'gambling district':           'Gambling District',
    'red light district':          'Red Light District',
  };
  const criminalInstitutions = institutions
    .map(institution => Object.entries(CRIMINAL_INST_LABELS).find(
      ([canonicalName]) => (
        institutionMatchesNativeName(institution, canonicalName)
      ),
    )?.[1] || null)
    .filter(Boolean);

  // ── Shadow economy estimate ───────────────────────────────────────────────
  const baseShadowPercent = Math.round(Math.max(0, (flags.criminalEffective - 25) / 3));

  // Stress conditions add to shadow economy — scaled by tier
  // Small settlements have no meaningful organised economy to capture
  const tierShadowScale = { thorp:0.1, hamlet:0.2, village:0.4, town:0.7, city:1.0, metropolis:1.0 };
  const shadowScale = tierShadowScale[tier] ?? 1.0;

  let stressShadowBonus = 0;
  if (hasStress('under_siege'))         stressShadowBonus += 20;
  if (hasStress('famine'))              stressShadowBonus += 15;
  if (hasStress('occupied'))            stressShadowBonus += 10;
  if (hasStress('plague_onset'))        stressShadowBonus += 8;
  if (hasStress('insurgency'))          stressShadowBonus += 18;
  if (hasStress('mass_migration'))      stressShadowBonus += 12;
  if (hasStress('wartime'))             stressShadowBonus += 8;
  if (hasStress('religious_conversion'))stressShadowBonus += 10;
  if (hasStress('slave_revolt'))        stressShadowBonus += 22;
  stressShadowBonus = Math.round(stressShadowBonus * shadowScale);

  const blackMarketCapture = Math.min(80, baseShadowPercent + stressShadowBonus);

  let economicDragDesc = null;
  if (blackMarketCapture > 15) { // TAIL-DEFECON (#09714, ruling D3): under a siege nothing comes in; no stalls where no market stands
    economicDragDesc = hasStress('under_siege') ? lineText({ text: 'With the siege closed round the place, what goods are left change hands in back rooms and after dark, at whatever the holder asks.', needs: ['crisis: siege'] })
      : !inst.hasMarket ? 'Goods change hands here in back rooms and after dark, and nobody accounts for them.'
        : 'Goods change hands here in back rooms and after dark, the duty on them goes unpaid, and the stalls that pay their fees lose custom to the ones that do not.';
  } else if (blackMarketCapture > 5) {
    economicDragDesc = tiny ? 'A little changes hands here quietly, between neighbours, and no one reckons it up.' : factsOf({ institutions }).crime === 'organized' ? 'Some goods change hands here without a licence or a duty paid.' : 'Some goods change hands here without a licence or a duty paid. It is noticed, and so far it does little harm.'; // UPKEEP-8 (#1377): no 'little harm' beside an organised criminal power; TAIL-DEFECON (#18208 #B11404): no licence or duty in a thorp or a hamlet
  }

  // ── Plot hooks ────────────────────────────────────────────────────────────
  const plotHooks = [];

  if (stress.stateCrime) {
    const _garRef = inst.hasGarrison ? 'the garrison' : 'armed officials';
    plotHooks.push(`A local family wants evidence of tax extortion gathered quietly, but the extorter wears an official badge.`);
  }
  if (stress.crimeIsGovt) {
    // ⚠ 'whoever controls this block' READ WRONG BELOW A TOWN. The hook fires at
    // every tier, and a thorp of forty people has no blocks: the reference has to
    // name something the settlement actually has. A quarter exists from a town up;
    // below that the unit of local power is the road through the place.
    const crimeTurf = ['town', 'city', 'metropolis'].includes(tier)
      ? 'whoever holds this quarter'
      : 'whoever holds this stretch of road';
    const crimeRef = inst.hasThievesGuild ? 'the guild' : crimeTurf;
    plotHooks.push(`Someone approached the party seeking legitimate authority to settle a dispute. The only "authority" here is ${crimeRef}.`);
  }
  if (stress.arcaneBlackMarket) {
    if (inst.hasWizardTower) plotHooks.push("A part from the wizard's tower has gone missing, and the black market has it; the fence wants a price the wizard will not pay."); // TAIL-DEFECON (#02876): silent where no tower stands
  }
  if (stress.religiousFraud) {
    plotHooks.push("A pilgrim paid a fortune for a holy relic that is obviously fake. They want the fraud exposed without losing their faith in the process.");
  }
  if (stress.merchantCriminalBlur) {
    plotHooks.push("A guild merchant hired the party, then asked for something the guild forbids; the pay is good, and someone else in the guild already knows.");
  }
  if (inst.hasSmuggling) {
    // ONE SENTENCE STOOD IN EVERY SMUGGLING TOWN (COHERENCE-QUARREL cure 4): 107 of 181 safety
    // hooks on the lane's corpus. The seed chooses among four tellings of the same thought,
    // without a roll; with no seed the original prints.
    const seed = getActiveRng()?.seed;
    const drawn = drawDeclared(SMUGGLING_HOOKS, {
      draw: (pool) => (seed ? pool[hashKey(`${seed}::safetyProfile:SMUGGLING_HOOKS`) % pool.length] : pool[0]),
      facts: () => factsOf({ institutions }), key: `${seed ?? ''}::safetyProfile:SMUGGLING_HOOKS`,
      poolId: 'safetyProfile:SMUGGLING_HOOKS', surface: 'plot_hooks', drawKind: 'H',
    });
    if (drawn.line != null) plotHooks.push(smugglingHookUnderSiege(String(lineText(drawn.line)), hasStress('under_siege'))); // TAIL-DISPLAY-CIVIC-4 (V10)
  }
  if (stress.crusaderSynthesis) { // BAR6-CRIME (g), LAW 10's 10b (C130353 C130354): the hook names its holder without a sex; the roster's commander may be a woman
    plotHooks.push(said("The garrison chaplain and the commander are the same person, who is authorizing military action for reasons that sound theological."));
  }
  if (stress.merchantArmy) {
    plotHooks.push(said("The merchant guild's private security force just detained someone, with no legal authority to do so. The watch is looking the other way."));
  }

  return {
    safetyLabel,
    safetyDesc,
    guardEffectivenessDesc,
    crimeTypes,
    criminalInstitutions,
    economicDragDesc,
    blackMarketCapture,
    plotHooks,
    safetyRatio:   Math.round(safetyRatio * 10) / 10,
    flags:         stress,
    compound:      flags,
  };
};

/**
 * ⛔ THE CRIME LINES READ THE FINAL CRIME SIGNAL (lane RUNG1B-F4 unit 4, 2026-11-04;
 * docs/F4_CRIME_SIGNAL_2026-11-04.md; soak1k-393 and -248). The safety profile is born at the
 * economy step, BEFORE the power roster exists, and the density law trims that roster only at
 * assembly, so two of its crime lines could not read whether organised crime exists here: the
 * survival-crime line printed "No criminal infrastructure" beside a roster Thieves' Guild (4
 * places), and the indebted stress's debt-evasion line named "criminal networks" where none
 * existed (38 places; nine of A-06's 16). Assembly calls this once, after the trim, and each line
 * takes its text from the crime signal's one home (`domain/crimeSignal.js :: crimeSignalOf`):
 *   - survival crime: the pool's desperation-theft line beside a network, the clause without one
 *     (unit C's rule, now on the final record); the famine/siege desperation-theft entry is then
 *     printed once, never twice, as at the economy step;
 *   - debt evasion: the same line without its "criminal networks" clause where none exists.
 * ⛔ NOR BESIDE THE BLOCK'S OWN LIST (RUNG-2 LANDING phase C unit 3, 2026-11-06; rung 2E's A-06 in
 * soak1k-6759, -6885, -7485, -7845: "No criminal infrastructure" beside the listed Gambling Den
 * whose line "funds broader criminal network"). The survival line also reads the safety profile's
 * own `criminalInstitutions` and the running criminal supply chains — the two lists RUNG1B-F9 made
 * the Defense structure read (`defenseDisplay.js :: deriveCriminalStructure`, `listed`). A listed
 * operation is infrastructure, not a network: the debt-evasion line still reads the signal alone.
 * Every entry's TYPE is kept (the services menu reads types). No draw. Returns the input
 * `economicState` BY REFERENCE when no line changes, else a copy with a copied crime list.
 *
 * @template {{ safetyProfile?: { crimeTypes?: Array<{ type?: unknown, desc?: unknown }>, criminalInstitutions?: unknown[] } | null, activeChains?: Array<{ needKey?: unknown, status?: unknown, chainId?: unknown } | null> } | null | undefined} E
 * @param {E} economicState
 * @param {Parameters<typeof crimeSignalOf>[0] & { tensions?: unknown, services?: unknown }} lists the FINAL roster's seats and the estate; the
 *   record's live tensions (`history.currentTensions`, BAR3-DEFECON-2: a crime wave settles the kept-in-hand lines)
 * @returns {E}
 */
export function settleCrimeLinesToSignal(economicState, lists) {
  return settleCrimeLinesOnly(settleCrimeWaveLines(settleTheocraticFlag(economicState, lists?.seats), lists?.tensions), lists); // BAR3-DEFECON: the theocratic flag, read at the same late point; BAR3-DEFECON-2 (grant AS1): the crime wave's twins
}
/** @param {any} economicState @param {Parameters<typeof settleCrimeLinesToSignal>[1]} lists */
function settleCrimeLinesOnly(economicState, lists) {
  const safetyProfile = economicState?.safetyProfile;
  const crimes = safetyProfile?.crimeTypes;
  if (!Array.isArray(crimes) || !crimes.length) return economicState;
  const present = crimeSignalOf(lists).present;
  const infrastructure = present
    || (Array.isArray(safetyProfile?.criminalInstitutions) && safetyProfile.criminalInstitutions.length > 0)
    || runningCriminalChains({ economicState: { activeChains: economicState?.activeChains } }).length > 0
    || covertCrimeHeld({ economicState, availableServices: lists?.services }); // BAR4-SAFETY (F3, C46446; SF1 c): the key's own two readings
  const hunger = hungerIn(economicState) || crimes.some((entry) => entry?.type === 'desperation theft'); // UPKEEP-8 (#1173): "Hunger-driven" only where the record holds hunger (the famine's or siege's own entry is that record)
  const lineFor = { 'Survival crime': infrastructure ? (hunger ? DESPERATION_THEFT_DESC : THEFT_NETWORK_DESC) : SURVIVAL_NO_NETWORK_DESC,
    'debt evasion': present ? DEBT_EVASION_DESC : DEBT_EVASION_NO_NETWORK_DESC };
  let settled = crimes.map((entry) => {
    const desc = lineFor[/** @type {keyof typeof lineFor} */ (String(entry?.type))];
    return desc !== undefined && entry.desc !== desc ? { ...entry, desc } : entry;
  });
  settled = settleRosterCrimeLines(settled, lists?.seats, crimeSignalOf(lists).seated || oneRingRules(economicState, lists)); // TAIL-DEFECON (#15308, #14654); TAIL-CLOSE-SRC-2: the signal's own answer, not its powers list read here; BAR3-DEFECON (C12387): or the one ring the Defense tab names
  if (hunger) settled = settleDesertersUnfed(settled); // TAIL-DISPLAY-CIVIC-3 V3: under hunger no line offers food
  if (infrastructure && settled.some((entry) => entry?.type === 'Survival crime')) {
    settled = settled.filter((entry) => !(entry?.type === 'desperation theft' && entry.desc === DESPERATION_THEFT_DESC));
  }
  // UPKEEP-14 (the chair's ruling (h), the bar's #256 #280): a line that names enforcement reads the roster: where no
  // watch, court, militia or garrison stands on the final roster, the sentence stops at the theft.
  const enforced = defenceOf({ institutions: lists?.estate ?? [] });
  if (!(enforced.watch || enforced.court || enforced.militia || enforced.garrison)) {
    settled = settled.map((entry) => typeof entry?.desc === 'string' && entry.desc.endsWith(ENFORCEMENT_STRUGGLES)
      ? { ...entry, desc: entry.desc.slice(0, -ENFORCEMENT_STRUGGLES.length) } : entry);
  }
  if (settled.length === crimes.length && settled.every((entry, i) => entry === crimes[i])) return economicState;
  return { ...economicState, safetyProfile: { ...safetyProfile, crimeTypes: settled } };
}

/**
 * One declared sibling set: the original, `needs` its atoms; its twin (when the slot needs one)
 * `excludes` them. `shared`: the atoms both lines name, which both NEED; the pair stays keyed on
 * `needs` alone (the complement rule, narrowed: COHERENCE-AGREE-6, fd10c7dc6).
 * @param {string} text @param {string[]} needs @param {string} [twin] @param {string[]} [shared]
 */
const declaredSet = (text, needs, twin, shared = []) => Object.freeze([
  Object.freeze({ text, needs: Object.freeze([...needs, ...shared]) }),
  ...(twin === undefined ? [] : [Object.freeze({ text: twin, twinOf: text, ...(shared.length ? { needs: Object.freeze([...shared]) } : {}), excludes: Object.freeze(needs) })]),
]);

/**
 * DECLARED SIBLINGS, CARRIED (CENSUS-5b unit 2, 2026-11-05; `docs/DESIGN_POOL_CENSUS.md` §3.1,
 * the chair's ruling R-C). The safety profile's inline T branches print lines that presume a fact
 * their branch does not guarantee: the watch named under a stress any place can carry, the walls
 * named beside a garrison or a gate (a gate row stands without walls). The originals stay where
 * they are spelled above; each is declared here, keyed by its printed text, with its twin. Each
 * printing branch resolves through `said` → `resolveSibling` (CENSUS-1e unit 2), so a twin prints
 * where the record refuses its original's atom. Measured on the 1,000 (soak1k-0..999) before the change, printed / false by the record:
 * the succession watch 61 / 30, the migration watch 63 / 28, the revolt watch 61 / 25, the
 * insurgent watch 43 / 22, the displacement watch 71 / 32, the garrison's walls 52 / 3, the
 * smuggler's walls 229 / 0, the thin watch 2 / 1, the merchant army's watch 32 / 0, the garrison
 * chaplain 12 / 0. Each twin is the chair's ruling (R-G), recorded in the lane doc.
 */
export const SAFETY_LINE_SIBLINGS = Object.freeze({
  'Authority is contested. The watch is uncertain whose orders to follow. Opportunistic crime is rising in the gap.': declaredSet(
    'Authority is contested. The watch is uncertain whose orders to follow. Opportunistic crime is rising in the gap.', ['watch'],
    'Authority is contested. Whoever keeps order is uncertain whose orders to follow. Opportunistic crime is rising in the gap.'),
  'More people have arrived than there are roofs or work for, and newcomers and old residents quarrel in the streets. The watch cannot tell one stranger from the next.': declaredSet(
    'More people have arrived than there are roofs or work for, and newcomers and old residents quarrel in the streets. The watch cannot tell one stranger from the next.', ['watch'],
    'More people have arrived than there are roofs or work for, and newcomers and old residents quarrel in the streets. Whoever keeps order cannot tell one stranger from the next.'),
  'Active armed conflict between revolt participants and security forces in contested districts. Civilians are avoiding specific streets. The watch has abandoned normal patrol patterns.': declaredSet(
    'Active armed conflict between revolt participants and security forces in contested districts. Civilians are avoiding specific streets. The watch has abandoned normal patrol patterns.', ['watch'],
    'Active armed conflict between revolt participants and security forces in contested districts. Civilians are avoiding specific streets.'),
  // SW-B6 (2026-11-09, STYLE-RULINGS-2 B1(a)/B6): the guard assessment's "There is no watch" is the ONE
  // reader of the force fact; these two stress lines name guards and patrols, so they read it too —
  // `guardPresence` (watch ∨ garrison ∨ militia ∨ hired company, `factsOf`), the twin where none stands.
  'Armed rebels are active. Patrols have changed their routes, some districts are closed off, and nobody is sure whose side a neighbour is on.': declaredSet(
    'Armed rebels are active. Patrols have changed their routes, some districts are closed off, and nobody is sure whose side a neighbour is on.', ['guardPresence'],
    'Armed rebels are active. Some districts are closed off, and nobody is sure whose side a neighbour is on.'),
  'Rebels and guards are fighting in the contested districts. People keep off certain streets, and the regular patrols have stopped.': declaredSet(
    'Rebels and guards are fighting in the contested districts. People keep off certain streets, and the regular patrols have stopped.', ['guardPresence'],
    'The rebels hold some districts. People keep off those streets, and nobody walks them after dark.'),
  'Street-level confrontations between insurgent supporters and the watch. Officially categorised as riot and disorder.': declaredSet(
    'Street-level confrontations between insurgent supporters and the watch. Officially categorised as riot and disorder.', ['watch'],
    'Street-level confrontations between insurgent supporters and those who keep order. Officially categorised as riot and disorder.'),
  // TAIL-DEFECON (#18708): the twin above names those who keep order, so it needs a force of any kind; its own twin names none.
  'Street-level confrontations between insurgent supporters and those who keep order. Officially categorised as riot and disorder.': declaredSet(
    'Street-level confrontations between insurgent supporters and those who keep order. Officially categorised as riot and disorder.', ['guardPresence'],
    "Confrontations between the rebels' supporters and those loyal to the current authority. Officially categorised as riot and disorder."),
  'Theft and petty fraud by new arrivals with no local ties and no established credit. The watch struggles to distinguish transients from residents.': declaredSet(
    'Theft and petty fraud by new arrivals with no local ties and no established credit. The watch struggles to distinguish transients from residents.', ['watch'],
    'Theft and petty fraud by new arrivals with no local ties and no established credit. Those who keep order struggle to distinguish transients from residents.'),
  ' The garrison acknowledges the problem but focuses on the walls and gates. Interior policing is under-resourced.': declaredSet(
    ' The garrison acknowledges the problem but focuses on the walls and gates. Interior policing is under-resourced.', ['walls'],
    ' The garrison acknowledges the problem but focuses on the approaches. Interior policing is under-resourced.'),
  " The settlement's gates and walls are checkpoints that smugglers work around. Bribing officials, using hidden routes, or moving shipments at shift changes.": declaredSet(
    " The settlement's gates and walls are checkpoints that smugglers work around. Bribing officials, using hidden routes, or moving shipments at shift changes.", ['walls'],
    " The settlement's gates are checkpoints that smugglers work around. Bribing officials, using hidden routes, or moving shipments at shift changes."),
  // COHERENCE-AGREE-3 (REVIEW-AGREE F5, 2026-11-12): the safety line's gates read the gate home; a palisade
  // has no gate of record. Measured on the 2,866-birth L2 corpus at 65ce74ce6: printed with no gate 15.
  ' Everyone comes in by the gates, where the guard sees them.': declaredSet(
    ' Everyone comes in by the gates, where the guard sees them.', ['gate'],
    ' The walls leave few ways in.'), // BAR3-DEFECON (C55187): no gate, and in every town it printed in no watch or garrison to watch one
  // COHERENCE-AGREE-3 (REVIEW-AGREE F12): the charter hall's line names the watch, so it needs the watch; the
  // twin names no force. Measured on the 2,866-birth L2 corpus at 65ce74ce6: printed with no watch 11.
  " The adventurers' charter hall handles threats the watch cannot.": declaredSet(
    " The adventurers' charter hall handles threats the watch cannot.", ['watch'],
    " The adventurers' charter hall takes the jobs that need hunters, not guards."),
  'The watch is too thinly spread to maintain order.': declaredSet(
    'The watch is too thinly spread to maintain order.', ['watch'],
    'Enforcement is too thinly spread to maintain order.'),
  "The merchant guild's private security force just detained someone, with no legal authority to do so. The watch is looking the other way.": declaredSet(
    "The merchant guild's private security force just detained someone, with no legal authority to do so. The watch is looking the other way.", ['watch'],
    "The merchant guild's private security force just detained someone, with no legal authority to do so. No one with the authority to stop it is trying."),
  // LAST-DECLARE (2026-11-18; vetoable by the owner): both chaplain lines name the church's man, so both declare `church` (the
  // crusade's synthesis fires only where a church stands: `priorityHelpers.js :: crusaderInst`; true in every town that prints
  // either). Written as rows: the walker reads `declaredSet`'s frozen arrays as no builder's, so its declaration went unread.
  "The garrison chaplain and the commander are the same person, who is authorizing military action for reasons that sound theological.": Object.freeze([Object.freeze({ text: "The garrison chaplain and the commander are the same person, who is authorizing military action for reasons that sound theological.", needs: Object.freeze(['garrison', 'church']) }), Object.freeze({ text: "The settlement's chaplain also leads its armed men, and is authorizing military action for reasons that sound theological.", twinOf: "The garrison chaplain and the commander are the same person, who is authorizing military action for reasons that sound theological.", needs: Object.freeze(['church']), excludes: Object.freeze(['garrison']) })]),
  // LAST-DECLARE (2026-11-18): the streets line names streets, which a thorp or a hamlet has none of; its twin is the small
  // place's own line (the tier test that chose between them, now the declaration). No new text.
  'The streets are unusually quiet.': Object.freeze([Object.freeze({ text: 'The streets are unusually quiet.', needs: Object.freeze(['tier: ≥ village']) }), Object.freeze({ text: 'The place is unusually quiet.', twinOf: 'The streets are unusually quiet.', excludes: Object.freeze(['tier: ≥ village']) })]),
  // COHERENCE-UPKEEP (the chair's ruling 7 of 2026-11-12): what the place can pay for its hired
  // force, said in the guard assessment. Resolved AFTER prosperity by `keptGuardLine` (below), by the
  // `prosperity` atom (`prosperity: ≥ moderate` is `keepOf().bought` ≥ 0.6); each twin is today's
  // line. The hired company, the garrison and the charter hall each line names are the branch's own
  // guarantee (`keptGuardLine` reads them off the defence home), so a twin excludes the purse alone.
  // The hired company (`mercenary`) and the garrison a pair BOTH name, both declare (the chair's
  // ruling P6 of 2026-11-12, the complement rule narrowed in fd10c7dc6): the branch guarantees
  // them, so the declaration moves no line.
  'There is no standing guard; a hired company is paid to keep the peace, and gives what it is paid for.': declaredSet(
    'There is no standing guard; a hired company is paid to keep the peace, and gives what it is paid for.', ['prosperity: ≥ moderate'],
    'A mercenary company provides enforcement: professional and effective, but loyal to the contract, not the community.', ['mercenary']),
  'A hired company is on the books, but the coin to keep it runs short; it comes when called and leaves when the coin does.': declaredSet(
    'A hired company is on the books, but the coin to keep it runs short; it comes when called and leaves when the coin does.', ['prosperity: ≤ poor'],
    'A mercenary company provides enforcement: professional and effective, but loyal to the contract, not the community.', ['mercenary']),
  'Hired swords back the garrison when the purse allows.': declaredSet(
    'Hired swords back the garrison when the purse allows.', ['prosperity: ≤ comfortable'],
    'Hired swords back the garrison.', ['garrison']),
  "The adventurers' charter hall takes bounty work against threats, as far as the purse runs.": declaredSet(
    "The adventurers' charter hall takes bounty work against threats, as far as the purse runs.", ['prosperity: ≤ comfortable'],
    "The adventurers' charter hall coordinates emergency response to threats."),
  // COHERENCE-UPKEEP-6 (the review's F7): the charter hall's two true readings, as the hired company's pair:
  // the coin for bounties short (Poor and below); its twin, the purse line above (Moderate and Comfortable).
  "The adventurers' charter hall takes bounty work against threats, but the coin for bounties runs short.": declaredSet(
    "The adventurers' charter hall takes bounty work against threats, but the coin for bounties runs short.", ['prosperity: ≤ poor'],
    "The adventurers' charter hall takes bounty work against threats, as far as the purse runs."),
  // COHERENCE-UPKEEP-6 (the chair's ruling 1(b) on REVIEW-UPKEEP-2): the crisis lines that stood here ("paid
  // from what the hunger leaves", and the siege's) are RETIRED. They were written because a famine or a siege
  // capped the label these purse lines read; the purse lines now read the standing label, the one that speaks
  // for pay, so the crisis no longer speaks through them, and the page names the crisis beside the label.
});

// ─── SW-B5 FRAMES: the guard assessment's frames get vantages ────────────────
// ⚠ AT THE END OF THE FILE ON PURPOSE: the prose wiring census's holder table cites this file's
// producer writes by LINE, so nothing is inserted above them.
import { hashKey } from '../domain/display/stateProse/stateProseKernel.js';
import { getActiveRng } from '../kernel/rngContext.js';
import { partitionDefenseInstitutions } from '../domain/institutions/defenseInstitutionBuckets.js';

/**
 * ⭐ THE FRAMES GET VANTAGES (lane SW-B5 FRAMES, 2026-11-09; STYLE-RULINGS-2 B5; the owner's
 * style law, WIRING-RULINGS §7–§8). Three guard-assessment lines printed word for word in 260 to
 * 367 of the 1,000 towns (#5–6, #17 and #18 of STYLE-0's twenty frames). Each pool below keeps its
 * ORIGINAL at index 0 and adds plainer lines that state the SAME facts as the branch that prints
 * them. No new fact is read; `lawRef` is the branch's own force noun. The town's seed chooses
 * without a draw: `hashKey(seed::pool)`, with the seed read off the active stream and no roll
 * taken, so no other line of the birth moves. With no seed (a gallery or fixture call) the
 * original prints. Index 0 is never reordered, and a new line is appended at the end.
 * @param {string} poolId @param {ReadonlyArray<string>} pool @returns {string}
 */
function voiceOf(poolId, pool) {
  const seed = getActiveRng()?.seed;
  return seed ? pool[hashKey(`${seed}::safetyProfile:${poolId}`) % pool.length] : pool[0];
}

/**
 * The smuggling hook's four tellings (COHERENCE-QUARREL cure 4). The original stays at index 0.
 * Each carries its text as its id, so the census counts a line, not a slot.
 */
const SMUGGLING_HOOKS = Object.freeze([
  'The smuggling network is moving something unusual this week, not the normal contraband. Someone wants to know what it is before it arrives.',
  'A smuggler wants one crate moved quietly and will pay well, but will not say what is in it.',
  'The smugglers have stopped moving their usual goods this week, and nobody can say why.',
  'A smuggled load went missing on the way in, and the people who paid for it are asking questions.',
].map((text) => Object.freeze({ id: text, text })));

/** #17: a court AND a prison stand (the branch's two facts). @param {string} lawRef */
export function COURT_AND_PRISON(lawRef) {
  return [
    ' A functioning court and prison mean crimes carry real consequences.',
    ' A wrong done here goes before the court, and the guilty can be locked up for it.',
    ` Offenders the ${lawRef} catches are tried at the court and held in the prison.`,
    ' Thieves here know that the court sits and the cells are real.',
  ];
}

/** #17's sibling: a court and no prison. @param {string} lawRef */
export function COURT_NO_PRISON(lawRef) {
  return [
    ' A court exists, though there is nowhere to hold the guilty.',
    ' The court can try a case, but there is little room to hold anyone it convicts.',
    ` Offenders the ${lawRef} catches go before the court; there is little room to hold them after.`,
  ];
}

/** #18: the force patrols at the ordinary standard. @param {string} lawRef */
function STANDARD_PATROL(lawRef) {
  const many = manyForce(lawRef); // TAIL-DEFECON (#20616): two bodies, a plural verb
  return [
    `The ${lawRef} ${many ? 'maintain' : 'maintains'} standard patrol coverage. Effective against opportunistic crime; ` +
      'less effective against organized operations that can plan around patrol routes.',
    `The ${lawRef} ${many ? 'walk' : 'walks'} the usual rounds. That stops a pickpocket or a brawl; anyone who has learned the rounds can work between them.`,
    `The ${lawRef} ${many ? 'patrol' : 'patrols'} on a regular round, so petty theft is often caught and planned crime seldom is.`,
    `You will see the ${lawRef} on the rounds most hours of the day; ${many ? 'they catch the careless and miss' : 'it catches the careless and misses'} the careful.`,
  ];
}

/** #5–6: a thorp, hamlet or village with no watch, no force and no court. */
export const NO_WATCH_SMALL = Object.freeze([ // exported for the no-watch pin (STYLE-2-MERGE at SW-B6's point): test visibility, no behaviour
  'There is no watch. The old families keep the peace, and anyone who breaks it answers to all the neighbours at once; ' +
    'when the families fall out among themselves, nobody keeps it.',
  'There is no watch. When someone does wrong, the neighbours deal with it themselves, and the oldest families have the last word.',
  'Nobody here is paid to keep order. A quarrel goes to the heads of the oldest families, and most are settled before they come to blows.',
  'There is no watch here. A thief is known by name within a day, and everyone shuns them until they make it right.',
]);

// ─── COHERENCE-UPKEEP: the hired force's lines, after prosperity ─────────────
// ⚠ AT THE END OF THE FILE for the same reason as the frames above (LINE citations).

/**
 * Today's leads the upkeep lines stand in for (each is its declared line's twin). The mercenary lead
 * is read off its declared set, where it declares the hired company it names (P6), not spelled again.
 */
const MERCENARY_LEAD = SAFETY_LINE_SIBLINGS['There is no standing guard; a hired company is paid to keep the peace, and gives what it is paid for.'][1].text;
const CHARTER_LEAD = "The adventurers' charter hall coordinates emergency response to threats.";
/**
 * The merchant-army lead (the safety writer's own branch, above): the guilds' companies serve "only those
 * with the right associations", so no line after it puts them behind the public garrison (COHERENCE-UPKEEP-5,
 * the review's F5).
 */
const MERCHANT_ARMY_LEAD = 'Public law enforcement is largely a formality.';

/**
 * THE GUARD ASSESSMENT SAYS WHAT THE PLACE CAN PAY (COHERENCE-UPKEEP, the chair's ruling 7 of
 * 2026-11-12). The safety profile is written before prosperity (prosperity reads its black-market
 * figure), so the economy hands the guard assessment back here once the label is known. Draw-free:
 * every line resolves through the declared siblings above, against the live roster and the label.
 *   - a hired company and no standing guard: the paid line (Moderate and above) or the short line
 *     (Poor and below) in place of today's lead;
 *   - a hired company beside a garrison: one more sentence, the purse-bound line below Prosperous;
 *   - a charter hall with no garrison and no watch: the bounty line below Prosperous, short at Poor and
 *     below (COHERENCE-UPKEEP-6, F7).
 * The lines read the label that speaks for pay, the STANDING one (COHERENCE-UPKEEP-6, the chair's ruling
 * 1(b)): a crisis in force changes none of them (its crisis lines are retired; the page names the crisis
 * beside the label).
 * @param {string} desc the guard assessment as the safety profile wrote it
 * @param {Array<{ name?: string }>} institutions the roster
 * @param {unknown} prosperity the word that speaks for pay: the Economic Survival band's purse word
 *   (`purseWordOfBand`, COHERENCE-UPKEEP-6, the chair's ruling A); the assembly hands it after the defence profile
 * @returns {string}
 */
/**
 * THE PURSE WORD FOR WHAT THE TOWN CAN PAY (COHERENCE-UPKEEP-6, the chair's ruling A): the purse lines are declared
 * on the prosperity ladder's words, so the Economic Survival band (their one home,
 * `defenseScoreBands.js :: economicSurvivalBandOf`) is handed to them as the word whose rung it is: Strong the
 * rung that keeps a company in full (Prosperous), Adequate the middling purse (Moderate), Weak and Critical
 * the short one (Poor). A record with no band reads its standing label, as before.
 * @param {string | null} band @param {unknown} standing @returns {unknown}
 */
export function purseWordOfBand(band, standing) {
  return band ? ({ STRONG: 'Prosperous', ADEQUATE: 'Moderate', WEAK: 'Poor', CRITICAL: 'Poor' })[band] ?? standing : standing;
}

/** @param {string} desc @param {Array<{ name?: string }>} institutions @param {unknown} prosperity
 * @param {{ forceScore?: unknown, tradeDependencies?: unknown, militaryGate?: unknown }} [read] the record's readings after the defence profile (BAR2-LABELS-2 LB4: `militaryGate`, `defenseProfile.economicGates.military`) @returns {string} */
export function keptGuardLine(desc, institutions, prosperity, read = {}) {
  const text = payTruth(rotaTruth(patrolTruth(paperTruth(String(desc || ''), prosperity, read), read, STANDARD_PATROL), institutions), read.militaryGate); // BAR4-SAFETY (F1, C44796): an unpaid rota takes no wage; UPKEEP-8 (#713 #1201, #459); BAR2-LABELS-2 LB4: the pay by the record's military gate
  /** @type {Omit<import('../domain/facts/drawDeclared.js').DrawDeclaredOptions, 'draw'>} */
  const opts = {
    facts: () => factsOf({ institutions, economicState: { prosperity } }),
    poolId: 'safetyProfile:SAFETY_LINE_SIBLINGS', surface: 'defense', drawKind: 'T',
  };
  const said = (/** @type {string} */ line) => resolveSibling(line, SAFETY_LINE_SIBLINGS, opts);
  /**
   * A purse line through its own set, and its twin through its own in turn (the charter hall's chain: the
   * short line, the purse line, today's lead; no loop). @param {string} first
   */
  const resolved = (first) => {
    let line = first;
    for (let next = said(line); next !== line; next = said(line)) line = next;
    return line;
  };
  const d = defenceOf({ institutions });
  const standing = d.garrison || d.watch || d.militia;
  if (text.startsWith(MERCENARY_LEAD) && d.mercenary && !standing) {
    const paid = said('There is no standing guard; a hired company is paid to keep the peace, and gives what it is paid for.');
    const lead = paid !== MERCENARY_LEAD ? paid
      : resolved('A hired company is on the books, but the coin to keep it runs short; it comes when called and leaves when the coin does.');
    return lead + text.slice(MERCENARY_LEAD.length);
  }
  if (text.startsWith(CHARTER_LEAD)) {
    return resolved("The adventurers' charter hall takes bounty work against threats, but the coin for bounties runs short.") + text.slice(CHARTER_LEAD.length);
  }
  // "Hired swords" only where a company is CONTRACTED (COHERENCE-UPKEEP-6, the chair's ruling B on the third read,
  // 1b-M2): the defence home's mercenary bucket (a mercenary company or quarter, hired muscle). A charter hall or a
  // free company hall offers swords for hire; it does not back the garrison.
  const contracted = partitionDefenseInstitutions(institutions).mercenary.length > 0;
  if (contracted && d.garrison && !text.startsWith(MERCENARY_LEAD) && !text.startsWith(MERCHANT_ARMY_LEAD) && !MERCHANT_ARMY_BESIDE.test(text)) {
    return `${text} ${resolved('Hired swords back the garrison when the purse allows.')}`;
  }
  return text;
}

// ─── UPKEEP-8 (2026-11-13): the safety lines say only what the record holds (safetyLineTruth.js) ─────────────
// At the END of the file, as the frames above, so no producer write moves.
import { defenseFactsOf } from '../domain/defense/defenseFacts.js';
import { footholdWord, gatesSmugglersLine, GANG_HOUSES_OF, smugglingHookUnderSiege, MERCHANT_ARMY_BESIDE, SMALL_PLACES, THEFT_NETWORK_DESC, TINY_PLACES, DESERTERS_FED, DESERTERS_FED_TINY, hungerIn, manyForce, NO_WATCH_OCCUPIED, paperTruth, patrolCrisisOf, patrolTruth, patrolTwin, payTruth, rotaTruth, covertCrimeHeld, RELIGIOUS_HOUSE, settleDesertersUnfed, settleRosterCrimeLines, SIEGE_NO_FORCE_ORDER } from './safetyLineTruth.js';

/** The enforcement sentence the desperation-theft lines end on (UPKEEP-14, ruling (h)): dropped where no enforcer stands. */
const ENFORCEMENT_STRUGGLES = ' Enforcement struggles to distinguish survival crime from organised theft.';

// ─── PLACE-1 (2026-11-20): the safety line's sentence slots, each from its declared pool (at the end, so no line above moves) ───
// UPKEEP-14 (the chair's ruling (f), the bar's #166 #218) stands in the pools: a thorp's or a hamlet's Moderate line names no
// areas, main paths or corners (`TINY_MODERATE`, index 0 its line of then); the village-and-up slots are the others.
import { pickVariantMixed } from '../kernel/proseHash.js'; import { MIXED_CORNERS, MIXED_FORCE, MIXED_OPENING, MODERATE_WALLS, TINY_MODERATE, UNSAFE_ADVICE, UNSAFE_GARRISON, UNSAFE_OPENING, UNSAFE_WALLS } from '../data/safetyDescLines.js'; // one line: the file's line ceiling (max-lines)

/**
 * ONE SENTENCE SLOT OF THE SAFETY LINE (PLACE-1, the owner's order of 2026-11-20 on the sameness fault;
 * `docs/chair/2026-11-20/content/place/safetyDesc-MEASURE.md` §D–§F). The pool is drawn whole by keyed hash
 * (`kernel/proseHash.js :: pickVariantMixed`, the chair's order of 17:18 UTC; no roll), keyed on the active stream's step-qualified seed as `voiceOf` keys
 * (`config._seed` is absent here); a refused winner resolves to the admitted argmax (`drawDeclared`). The facts are the
 * writer's own: the roster, the tier and the config (which answers the route). A falsy seed prints index 0, today's sentence.
 * @param {string} id the slot @param {ReadonlyArray<{ text: string }>} pool @param {Array<object>} institutions
 * @param {string} tier @param {object} config @returns {string}
 */
function safetyDescSlot(id, pool, institutions, tier, config) { const seed = getActiveRng()?.seed; return String(drawDeclared(pool, { draw: (p) => pickVariantMixed(p, seed ? `${seed}::safetyProfile:safetyDesc:${id}` : null), facts: () => factsOf({ institutions, tier, config }), key: `${seed ?? ''}::safetyProfile:safetyDesc:${id}`, poolId: `safetyProfile:safetyDesc:${id}`, surface: 'defense', drawKind: 'H' }).text ?? pool[0].text); } // one line: the file's line ceiling

// ─── BAR3-DEFECON (2026-11-15): the safety lines against the page's own state (at the end, so no line above moves) ───
import { hasInstitution } from '../domain/facts/institutions.js';
import { beneathTheWalls, GATES_KEPT_SMUGGLERS_BENEATH, MONSTER_THREAT_NO_DRILL, oneRingRules, quarrelUnderViolence, RELIGIOUS_FRAUD_NO_CHURCH, settleCrimeWaveLines, settleTheocraticFlag } from './safetyLineTruth.js';
