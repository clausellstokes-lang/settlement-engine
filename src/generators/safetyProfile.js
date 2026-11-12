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
import { crimeSignalOf } from '../domain/crimeSignal.js';
import { runningCriminalChains } from '../domain/display/defenseDisplay.js';
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
  const inst    = { ...flags.inst, hasWalls: defence.walls, hasWatch: defence.watch, hasGarrison: defence.garrison, hasGates: defence.gate, hasMilitia: defence.militia, hasMercenary: defence.mercenary };
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
    const milRef = inst.hasGarrison ? 'The garrison keeps order' : 'The military command has taken charge of the streets';
    safetyStrains.push({ strain: strainLabel, condition: 'Active Siege' });
    safetyDescs.push(
      `${milRef}, and more harshly as the food runs down. People quarrel over rations, food is sold ` +
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
        said('Armed rebels are active. Patrols have changed their routes, some districts are closed off, ' +
        'and nobody is sure whose side a neighbour is on.')
      );
    }
    if (hasStress('slave_revolt')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Dangerous' : 'Critical';
      safetyStrains.push({ strain: strainLabel, condition: 'Slave Revolt' });
      safetyDescs.push(
        said('Rebels and guards are fighting in the contested districts. People keep off certain streets, ' +
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
        'No stable governing authority. Enforcement is inconsistent; which power controls a district determines what rules apply.'
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
        said("More people have arrived than there are roofs or work for, and newcomers and old residents quarrel in the streets. " +
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
    safetyDesc = `The streets are unusually quiet. ${visibleAuthority} Residents face little risk from ` +
      `common thieves and considerably more from the authorities themselves. Unofficial disappearances are not discussed openly.`;
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
    const wallNote   = inst.hasWalls ? said(' Everyone comes in by the gates, where the guard sees them.') : '';
    const charNote   = inst.hasCharterHall ? said(" The adventurers' charter hall handles threats the watch cannot.") : ''; // F12: the watch, where it stands
    // Canonical threat vocabulary is heartland/frontier/plagued ('embattled' was never emitted).
    const threatNote = threat === 'plagued' ? ' The constant monster threat keeps the guard exceptionally well-drilled and alert.' : '';
    safetyDesc = `Visitors can walk anywhere at any hour, and there is little crime; the ${lawRef} sees to that.` +
      `${wallNote}${charNote}${threatNote}`;
  } else if (effectiveSafety >= 2) {
    safetyLabel = 'Safe';
    const lawRef  = inst.hasGarrison ? 'The garrison' : inst.hasWatch ? 'The watch' : inst.hasMilitia ? 'The militia' : 'Local enforcement';
    const wallNote = inst.hasWalls ? ' The walls keep most trouble outside.' : '';
    const courtNote = inst.hasCourtSystem ? ' With a working court, organised crime treads carefully.' : '';
    safetyDesc = `Crime exists but is well-managed. ${lawRef} is present and responsive. Petty theft is the primary risk; ` +
      `organized crime has a limited foothold.${courtNote}${wallNote}`;
  } else if (effectiveSafety >= 1.2) {
    safetyLabel = 'Moderate';
    const lawRef  = inst.hasGarrison ? 'The garrison patrols' : inst.hasWatch ? 'The watch covers'
                  : inst.hasMilitia  ? 'Militia volunteers patrol' : 'Locals watch over';
    const wallNote = inst.hasWalls ? ' The walls keep the trouble inside, off the roads beyond.' : '';
    safetyDesc = `A mix of safer and more exposed areas. ${lawRef} the main paths; quieter spots after dark carry genuine risk. ` +
      `Residents know which corners to avoid.${wallNote}`;
  } else if (effectiveSafety >= 0.6) {
    safetyLabel = 'Unsafe';
    const lawRef =
      inst.hasGarrison  ? 'The garrison is overwhelmed or corrupt.'   :
      inst.hasWatch      ? 'The watch is stretched far beyond its capacity.' :
      inst.hasMilitia    ? 'The militia cannot maintain consistent coverage. They have other jobs to do.' :
      inst.hasMercenary  ? 'The mercenary company focuses on protecting those who pay them, not the general population.' :
                           'There is no meaningful guard presence.';
    const wallNote = inst.hasWalls ? " Walls slow entry but don't solve what happens inside them." : '';
    safetyDesc = `Crime is a persistent and visible problem. ${lawRef} Travelers are advised to move in groups and keep valuables hidden.${wallNote}`;
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
    safetyDesc = `Violence and theft are routine. ${lawRef} Residents protect themselves through community networks or tribute paid to whoever controls their street.${courtNote}${wallNote}`;
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

    const prisonNote = inst.hasCourtSystem && inst.hasPrison
      ? voiceOf('courtAndPrison', COURT_AND_PRISON(lawRef)) // SW-B5 FRAMES: the original is index 0
      : inst.hasCourtSystem
      ? voiceOf('courtNoPrison', COURT_NO_PRISON(lawRef))
      : inst.hasPrison
      ? ' Offenders can be jailed, but without a working court system enforcement is arbitrary.'
      : ' Without courts or prison, enforcement relies entirely on fines, exile, or summary violence.';

    // COHERENCE-AGREE-3 (F5): the gate home answers "gates"; walls with no gate take the twin that names none.
    // (A template over the force noun, so it is chosen here by the home, not keyed in the sibling table; the twin carries its declaration, COHERENCE-AGREE-4.)
    const wallNote = !inst.hasWalls ? ''
      : inst.hasGates ? ` Everyone comes and goes by the gates, so smugglers have to get past the ${lawRef}.`
        : lineText({ text: ` The walls leave few ways in, so smugglers have to get past the ${lawRef}.`, needs: ['walls'], excludes: ['gate'] });

    if (stress.stateCrime) {
      guardEffectivenessDesc = `The ${lawRef} is well organised and works for the rulers' purses, not for the public; ` +
        `it is loyal to whoever pays it.${prisonNote}`;
    } else if (flags.militaryEffective < 30 && pri.economy < 35) {
      const militiaNote = inst.hasMilitia ? ': these are volunteers with day jobs, not soldiers' : '';
      guardEffectivenessDesc = `The ${lawRef} exists on paper. Chronically underpaid and poorly equipped${militiaNote}. ` +
        `Susceptible to bribery; enforcers who can be bought by whoever has coin.${prisonNote}`;
    } else if (stress.merchantArmy) {
      const secRef = inst.hasMercenary ? 'mercenary companies' : 'private security';
      const guildRef = inst.hasMerchantGuild ? 'The merchant guilds' : 'Wealthy interests';
      guardEffectivenessDesc = `Public law enforcement is largely a formality. ${guildRef} maintain their own ${secRef}: ` +
        `real protection exists, but only for those with the right associations.${prisonNote}`;
    } else if (inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch) {
      if (flags.militaryEffective >= 55) {
        guardEffectivenessDesc = `The citizen militia is well organised and willing: these are people defending their own homes. ` +
          `They do not patrol like professionals, but they know every lane.${prisonNote}${wallNote}`;
      } else {
        guardEffectivenessDesc = `The citizen militia musters when needed but cannot maintain consistent patrol. ` +
          `Volunteers with other work to do; reliable in a crisis, absent during routine crime.${prisonNote}`;
      }
    } else if (inst.hasMercenary && !inst.hasGarrison) {
      guardEffectivenessDesc = `A mercenary company provides enforcement: professional and effective, but loyal to the contract, not the community. ` +
        `When the coin stops, so does the protection.${prisonNote}${wallNote}`;
    } else if (inst.hasCharterHall && !inst.hasGarrison && !inst.hasWatch) {
      guardEffectivenessDesc = `The adventurers' charter hall coordinates emergency response to threats. Effective for monster incursions and major disturbances, ` +
        `less so for routine crime prevention. Not a police force.${prisonNote}`;
    } else if (flags.militaryEffective >= 65 && pri.economy >= 50) {
      guardEffectivenessDesc = `The ${lawRef} is well paid, well equipped and patrols properly. ` +
        `They come when called, and though some take bribes, it is not the custom.${prisonNote}${wallNote}`;
    } else if (flags.militaryEffective >= 65 && pri.economy < 40) {
      guardEffectivenessDesc = `The ${lawRef} is disciplined but resource-constrained: motivated with inadequate equipment and irregular pay. ` +
        `Effective in a fight; vulnerable to sustained corruption.${prisonNote}${wallNote}`;
    } else {
      guardEffectivenessDesc = voiceOf('standardPatrol', STANDARD_PATROL(lawRef)) + // SW-B5 FRAMES: the original is index 0
        `${prisonNote}${wallNote}`;
    }
  } else if (inst.hasCourtSystem) {
    guardEffectivenessDesc = 'There is no watch, only a court. ' +
      'When a quarrel turns violent, the neighbours or whoever is strongest nearby step in.';
  } else {
    guardEffectivenessDesc = ['thorp', 'hamlet', 'village'].includes(tier)
      ? voiceOf('noWatchSmall', NO_WATCH_SMALL) // SW-B5 FRAMES: the original is index 0
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
      type: 'Criminal governance',
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
    const coverClause = inst.hasChurch
      ? "The church's moral authority provides cover"
      : 'Religious structures provide cover';
    crimeTypes.push({
      type: 'Religious fraud',
      desc: `${coverClause} for sophisticated fraud. Fake relics, forged dispensations, and corrupt clergy who treat their position as a commercial opportunity.`,
    });
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
      desc: `Practitioners misuse ${magRef} for profit. Identity alteration, scrying, alchemical fraud, or targeted curses-for-hire.`,
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
      desc: `An active ${routeType} smuggling operation moves contraband through the settlement. The routes are established and the operators have learned the patrol schedules.${gateNote}${prosecuteNote}`,
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
      desc: `Territorial gangs control specific districts, extorting local businesses and residents. Violence is episodic rather than constant: mostly enforcing territorial boundaries.${garRef}${wallNote}`,
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
    addCrimeIfMissing('black market food',
      'Controlled goods (grain, salt, preserved meat) changing hands at extortionate prices through unofficial channels.');
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
      'Price gouging on medicines, protective herbs, and burial services. Often conducted by otherwise respectable merchants.');
  }
  if (hasStress('indebted')) {
    addCrimeIfMissing('debt evasion', DEBT_EVASION_DESC);
  }
  if (hasStress('insurgency')) {
    const insurgentDriven = (flags.criminalEffective || 0) > (flags.militaryEffective || 0);
    addCrimeIfMissing('political violence',
      insurgentDriven
        ? said('Street-level confrontations between insurgent supporters and the watch. Officially categorised as riot and disorder.')
        : 'Targeted intimidation and occasional violence against officials loyal to the current authority. Professionally executed.');
    addCrimeIfMissing('loyalty testing',
      'Both the governing power and the insurgency pressure individuals to declare allegiance. Refusal is dangerous. False declarations are common.');
    addCrimeIfMissing('information trade',
      'Intelligence about the other side commands real money. Both sides pay for names, plans, and movements.');
  }
  if (hasStress('slave_revolt')) {
    addCrimeIfMissing('revolt violence',
      said('Active armed conflict between revolt participants and security forces in contested districts. Civilians are avoiding specific streets. The watch has abandoned normal patrol patterns.'));
    addCrimeIfMissing('escape networks',
      'Organised infrastructure helping enslaved persons escape. Safe houses, forged papers, passage out of the settlement. The same network that was small and cautious is now large and urgent.');
    addCrimeIfMissing('informant pressure',
      'Both the authorities and the revolt leadership are pressing people for information. Silence is being interpreted as allegiance. Some residents have already left, so they will not be forced to choose.');
    addCrimeIfMissing('weapons trade',
      'Stolen and improvised weapons circulating in the revolt-held districts. Some are being smuggled in from outside. The black market is very active.');
  }
  if (hasStress('religious_conversion')) {
    addCrimeIfMissing('underground worship',
      'Banned or contested religious practice continuing in private homes, cellars, and outbuildings. Informal networks providing space, materials, and warning of enforcement activity.');
    addCrimeIfMissing('religious fraud',
      'False conversion declarations sold or arranged for a fee. Forged certification of compliance. Priests accepting payment to record conversions that did not occur.');
    addCrimeIfMissing('contested property',
      "Religious buildings, land, and endowments whose ownership is legally ambiguous following the change in religious authority. Being occupied, transferred, or stripped by whoever moves fastest.");
    addCrimeIfMissing('informant networks',
      'Enforcement authorities paying for information about non-compliant households. Neighbour reporting on neighbour. Some reports are sincere. Many are settled scores.');
  }
  if (hasStress('wartime')) {
    addCrimeIfMissing('war profiteering',
      "Suppliers adulterating grain and leather sold to crown contracts. Inspectors are overworked or bribed. The settlement's reputation for reliable supply is being consumed for short-term profit.");
    addCrimeIfMissing('deserter networks',
      'Deserters passing through require food, forged papers, and discretion. A small industry has emerged to provide all three. Officially classified as harbouring criminals.');
    addCrimeIfMissing('conscription fraud',
      'Wealthy families paying poorer ones to send sons in their place. The practice is illegal, widespread, and poorly enforced. It concentrates the actual dying in specific households.');
  }
  if (hasStress('mass_migration')) {
    addCrimeIfMissing('displacement crime',
      said('Theft and petty fraud by new arrivals with no local ties and no established credit. The watch struggles to distinguish transients from residents.'));
    addCrimeIfMissing('cultural friction',
      'Violent incidents between established residents and newcomers. Usually starts with an economic dispute and escalates.');
    addCrimeIfMissing('black market passage',
      'Forged residence documents, unofficial lodging, underground routes for those authorities have turned away. Very profitable.');
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
  if (blackMarketCapture > 15) {
    economicDragDesc = 'Goods change hands here in back rooms and after dark, the duty on them goes unpaid, and the stalls that pay their fees lose custom to the ones that do not.';
  } else if (blackMarketCapture > 5) {
    economicDragDesc = 'Some goods change hands here without a licence or a duty paid. It is noticed, and so far it does little harm.';
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
    plotHooks.push("A part from the wizard's tower has gone missing, and the black market has it; the fence wants a price the wizard will not pay.");
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
    if (drawn.line != null) plotHooks.push(String(lineText(drawn.line)));
  }
  if (stress.crusaderSynthesis) {
    plotHooks.push(said("The garrison chaplain and the commander are the same man. He's authorizing military action for reasons that sound theological."));
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
 * @param {Parameters<typeof crimeSignalOf>[0]} lists the FINAL roster's seats and the estate
 * @returns {E}
 */
export function settleCrimeLinesToSignal(economicState, lists) {
  const safetyProfile = economicState?.safetyProfile;
  const crimes = safetyProfile?.crimeTypes;
  if (!Array.isArray(crimes) || !crimes.length) return economicState;
  const present = crimeSignalOf(lists).present;
  const infrastructure = present
    || (Array.isArray(safetyProfile?.criminalInstitutions) && safetyProfile.criminalInstitutions.length > 0)
    || runningCriminalChains({ economicState: { activeChains: economicState?.activeChains } }).length > 0;
  const lineFor = { 'Survival crime': infrastructure ? DESPERATION_THEFT_DESC : SURVIVAL_NO_NETWORK_DESC,
    'debt evasion': present ? DEBT_EVASION_DESC : DEBT_EVASION_NO_NETWORK_DESC };
  let settled = crimes.map((entry) => {
    const desc = lineFor[/** @type {keyof typeof lineFor} */ (String(entry?.type))];
    return desc !== undefined && entry.desc !== desc ? { ...entry, desc } : entry;
  });
  if (infrastructure && settled.some((entry) => entry?.type === 'Survival crime')) {
    settled = settled.filter((entry) => !(entry?.type === 'desperation theft' && entry.desc === DESPERATION_THEFT_DESC));
  }
  if (settled.length === crimes.length && settled.every((entry, i) => entry === crimes[i])) return economicState;
  return { ...economicState, safetyProfile: { ...safetyProfile, crimeTypes: settled } };
}

/**
 * One declared sibling set: the original, `needs` its atoms; its twin (when the slot needs one)
 * `excludes` them. @param {string} text @param {string[]} needs @param {string} [twin]
 */
const declaredSet = (text, needs, twin) => Object.freeze([
  Object.freeze({ text, needs: Object.freeze(needs) }),
  ...(twin === undefined ? [] : [Object.freeze({ text: twin, twinOf: text, excludes: Object.freeze(needs) })]),
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
    ' The walls leave few ways in, and the guard watches them.'),
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
  "The garrison chaplain and the commander are the same man. He's authorizing military action for reasons that sound theological.": declaredSet(
    "The garrison chaplain and the commander are the same man. He's authorizing military action for reasons that sound theological.", ['garrison'],
    "The settlement's chaplain also leads its armed men. He's authorizing military action for reasons that sound theological."),
});

// ─── SW-B5 FRAMES: the guard assessment's frames get vantages ────────────────
// ⚠ AT THE END OF THE FILE ON PURPOSE: the prose wiring census's holder table cites this file's
// producer writes by LINE, so nothing is inserted above them.
import { hashKey } from '../domain/display/stateProse/stateProseKernel.js';
import { getActiveRng } from '../kernel/rngContext.js';

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
function COURT_AND_PRISON(lawRef) {
  return [
    ' A functioning court and prison mean crimes carry real consequences.',
    ' A wrong done here goes before the court, and the guilty can be locked up for it.',
    ` Offenders the ${lawRef} catches are tried at the court and held in the prison.`,
    ' Thieves here know that the court sits and the cells are real.',
  ];
}

/** #17's sibling: a court and no prison. @param {string} lawRef */
function COURT_NO_PRISON(lawRef) {
  return [
    ' A court exists, though there is nowhere to hold the guilty.',
    ' The court can try a case, but there is little room to hold anyone it convicts.',
    ` Offenders the ${lawRef} catches go before the court; there is little room to hold them after.`,
  ];
}

/** #18: the force patrols at the ordinary standard. @param {string} lawRef */
function STANDARD_PATROL(lawRef) {
  return [
    `The ${lawRef} maintains standard patrol coverage. Effective against opportunistic crime; ` +
      'less effective against organized operations that can plan around patrol routes.',
    `The ${lawRef} walks the usual rounds. That stops a pickpocket or a brawl; anyone who has learned the rounds can work between them.`,
    `The ${lawRef} patrols on a regular round, so petty theft is often caught and planned crime seldom is.`,
    `You will see the ${lawRef} on the rounds most hours of the day; it catches the careless and misses the careful.`,
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
