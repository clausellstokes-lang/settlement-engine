/**
 * safetyProfile.js
 * Generates the safety label, guard effectiveness description, crime types,
 * criminal institutions list, shadow economy estimate, and plot hooks for
 * the Viability tab's crime/safety section.
 */

import { getInstFlags, getPriorities, getStressFlags, tierAtLeast } from './helpers.js';

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
  const inst    = flags.inst;
  const threat  = config.monsterThreat || 'frontier';

  // Active stress types
  const stresses = (config.stressTypes?.length)
    ? config.stressTypes
    : config.stressType ? [config.stressType] : [];
  const hasStress = (type) => stresses.includes(type);

  // Safety ratio: military effectiveness vs criminal (>1 = law winning, <1 = crime winning)
  const safetyRatio = flags.militaryEffective / Math.max(8, flags.criminalEffective);

  // Small-settlement passive community order bonus (no criminal infrastructure = community watches itself)
  const hasCriminalOrg = institutions.some(i => {
    const n = (i.name || '').toLowerCase();
    return n.includes('thieves') || n.includes('criminal') || n.includes('gang') ||
           n.includes('smuggler') || n.includes('fence');
  });
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

  const safetyLabels   = [];
  const safetyDescs    = [];

  // Priority stress: these override everything else
  if (hasStress('occupied')) {
    const garrisonRef = inst.hasGarrison
      ? 'The garrison, now under occupier command,'
      : 'Occupation authorities';
    safetyLabels.push('Controlled — Occupation Curfew');
    safetyDescs.push(
      `Movement is restricted and monitored. ${garrisonRef} enforce curfew and checkpoint protocols. ` +
      `Common crime is suppressed by authoritarian presence — residents face little risk from thieves ` +
      `and considerably more from informers and occupation officials. Resistance activity operates underground.`
    );
  }

  if (hasStress('under_siege')) {
    const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Desperate';
    const milRef = inst.hasGarrison ? 'The garrison maintains order' : 'Military command has assumed civil authority';
    safetyLabels.push(`${strainLabel} — Active Siege`);
    safetyDescs.push(
      `Siege conditions have transformed the settlement's social character. ${milRef} with increasing severity ` +
      `as supplies run low. Rationing disputes, black market food trading, and desperation theft are rising.`
    );
  }

  if (hasStress('famine')) {
    const strainLabel = safetyRatio >= 2 ? 'Strained' : safetyRatio >= 1 ? 'Unsafe' : 'Dangerous';
    const foodRef = inst.hasGarrison
      ? 'The garrison focuses on food distribution enforcement'
      : 'Authority is increasingly exercised around food access';
    safetyLabels.push(`${strainLabel} — Famine Conditions`);
    safetyDescs.push(
      `Hunger has destabilised the normal social order. ${foodRef}. ` +
      `Desperation theft is rampant and difficult to distinguish from survival. ` +
      `Those with food stores face targeted theft or worse.`
    );
  }

  if (hasStress('plague_onset')) {
    const strainLabel = safetyRatio >= 2 ? 'Quarantined' : safetyRatio >= 1 ? 'Restricted' : 'Dangerous — Plague Unrest';
    const quarRef = inst.hasGarrison ? 'The garrison enforces quarantine zones'
                  : inst.hasWatch    ? 'The watch manages quarantine compliance'
                  :                    'Informal community enforcement maintains quarantine';
    safetyLabels.push(`${strainLabel} — Plague Conditions`);
    safetyDescs.push(
      `Disease has reorganised daily life around containment and fear. ${quarRef}, with mixed compliance. ` +
      `Violence against the sick is a genuine risk. Price gouging on medicines and burial services is widespread.`
    );
  }

  // Secondary stresses (only if no primary crisis overrides)
  if (!hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')) {
    if (hasStress('insurgency')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Dangerous';
      safetyLabels.push(`${strainLabel} — Insurgency`);
      safetyDescs.push(
        'The settlement is experiencing organised resistance. Patrol patterns have changed. ' +
        'Movement between districts may be restricted. Loyalties are unclear.'
      );
    }
    if (hasStress('slave_revolt')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Dangerous' : 'Critical';
      safetyLabels.push(`${strainLabel} — Slave Revolt`);
      safetyDescs.push(
        'Active armed conflict between revolt participants and security forces in contested districts. ' +
        'Civilians are avoiding specific streets. Normal patrol patterns have been abandoned.'
      );
    }
    if (hasStress('wartime')) {
      const strainLabel = safetyRatio >= 2 ? 'Strained' : 'Tense';
      safetyLabels.push(`${strainLabel} — Wartime`);
      safetyDescs.push(
        'War has reorganised daily life. Strangers are viewed with heightened suspicion. ' +
        'Price controls and curfews are sporadically enforced.'
      );
    }
    if (hasStress('politically_fractured')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Volatile';
      safetyLabels.push(`${strainLabel} — Political Fracture`);
      safetyDescs.push(
        'No stable governing authority. Enforcement is inconsistent; which faction controls a district determines what rules apply.'
      );
    }
    if (hasStress('succession_void')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Volatile';
      safetyLabels.push(`${strainLabel} — Succession Crisis`);
      safetyDescs.push(
        "Authority is contested. The watch is uncertain whose orders to follow. Opportunistic crime is rising in the gap."
      );
    }
    if (hasStress('recently_betrayed')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Suspicious';
      safetyLabels.push(`${strainLabel} — Aftermath of Betrayal`);
      safetyDescs.push(
        'The settlement is processing a betrayal. Strangers are viewed with heightened suspicion. Informal loyalty checks are common.'
      );
    }
    if (hasStress('monster_pressure')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Dangerous';
      safetyLabels.push(`${strainLabel} — Monster Threat`);
      safetyDescs.push(
        'Monster pressure from the surrounding region has changed how the settlement operates after dark. ' +
        'Outlying areas are avoided. Night movement is restricted.'
      );
    }
    if (hasStress('indebted')) {
      const strainLabel = safetyRatio >= 2 ? 'Strained' : 'Tense';
      safetyLabels.push(`${strainLabel} — Debt Crisis`);
      safetyDescs.push(
        'Debt service obligations shape every civic decision. The creditor representative has effective veto power over enforcement priorities.'
      );
    }
    if (hasStress('mass_migration')) {
      const strainLabel = safetyRatio >= 2 ? 'Strained' : 'Tense';
      safetyLabels.push(`${strainLabel} — Mass Migration`);
      safetyDescs.push(
        "The settlement is absorbing more people than its infrastructure was built for. " +
        "Friction between established residents and newcomers is visible. The watch is overwhelmed by unfamiliar faces."
      );
    }
    if (hasStress('religious_conversion')) {
      const strainLabel = safetyRatio >= 2 ? 'Tense' : safetyRatio >= 1 ? 'Strained' : 'Suspicious';
      safetyLabels.push(`${strainLabel} — Religious Upheaval`);
      safetyDescs.push(
        'The religious shift has divided the settlement. Each faction suspects the other of reporting to the relevant authority. ' +
        'Enforcement of the new order is inconsistent.'
      );
    }
  }

  // ── Base safety label (no active stress) ─────────────────────────────────
  let safetyLabel;
  let safetyDesc;

  if (safetyLabels.length > 0) {
    // Combine stress labels into one composite string
    safetyLabel = safetyLabels[0];
    if (safetyLabels.length > 1) {
      safetyLabel += ` + ${safetyLabels.slice(1).map(l => l.split(' — ')[1] || l).join(' + ')}`;
    }
    safetyDesc = safetyDescs.join(' ');
  } else if (stress.stateCrime) {
    safetyLabel = 'Controlled — Authoritarian';
    const garRef = inst.hasGarrison ? 'The garrison' : 'Armed officials';
    safetyDesc = `The streets are unusually quiet. ${garRef} are visible everywhere. Residents face little risk from ` +
      `common thieves and considerably more from the authorities themselves. Unofficial disappearances are not discussed openly.`;
  } else if (stress.crimeIsGovt) {
    safetyLabel = 'Dangerous — Criminal Governance';
    const crimeRef = inst.hasThievesGuild ? "The thieves' guild" : 'Organized crime';
    const garNote  = inst.hasGarrison ? ' The garrison takes orders from criminal leadership.' : '';
    safetyDesc = `There is no meaningful distinction between criminal organizations and civil authority here. ` +
      `${crimeRef} provides order of a sort — its own. Protection must be purchased; those who cannot pay are unprotected.${garNote}`;
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
    const lawRef     = inst.hasGarrison ? 'garrison and watch' : inst.hasWatch ? 'city watch' : inst.hasMilitia ? 'militia' : 'law enforcement';
    const wallNote   = inst.hasWalls ? ' Walls and controlled entry points reinforce the guard\'s ability to monitor movement.' : '';
    const charNote   = inst.hasCharterHall ? " The adventurers' charter hall handles threats the watch cannot." : '';
    const threatNote = threat === 'embattled' ? ' The constant monster threat keeps the guard exceptionally well-drilled and alert.' : '';
    safetyDesc = `Effective ${lawRef} and low criminal activity make this among the safest settlements in the region. ` +
      `Visitors can move freely at all hours.${wallNote}${charNote}${threatNote}`;
  } else if (effectiveSafety >= 2) {
    safetyLabel = 'Safe';
    const lawRef  = inst.hasGarrison ? 'The garrison' : inst.hasWatch ? 'The watch' : inst.hasMilitia ? 'The militia' : 'Local enforcement';
    const wallNote = inst.hasWalls ? ' Walls limit access and give the guard leverage over smuggling and movement.' : '';
    const courtNote = inst.hasCourtSystem ? ' A functioning court system means organized crime operates with greater caution.' : '';
    safetyDesc = `Crime exists but is well-managed. ${lawRef} is present and responsive. Petty theft is the primary risk; ` +
      `organized crime has a limited foothold.${courtNote}${wallNote}`;
  } else if (effectiveSafety >= 1.2) {
    safetyLabel = 'Moderate';
    const lawRef  = inst.hasGarrison ? 'The garrison patrols' : inst.hasWatch ? 'The watch covers'
                  : inst.hasMilitia  ? 'Militia volunteers patrol' : 'Locals watch over';
    const wallNote = inst.hasWalls ? ' The walls contain the problem somewhat — crime is concentrated inside rather than spilling into the surrounding territory.' : '';
    safetyDesc = `A mix of safer and more exposed areas. ${lawRef} the main paths; quieter spots after dark carry genuine risk. ` +
      `Residents know which corners to avoid.${wallNote}`;
  } else if (effectiveSafety >= 0.6) {
    safetyLabel = 'Unsafe';
    const lawRef =
      inst.hasGarrison  ? 'The garrison is overwhelmed or corrupt.'   :
      inst.hasWatch      ? 'The watch is stretched far beyond its capacity.' :
      inst.hasMilitia    ? 'The militia cannot maintain consistent coverage — they have other jobs to do.' :
      inst.hasMercenary  ? 'The mercenary company focuses on protecting those who pay them, not the general population.' :
                           'There is no meaningful guard presence.';
    const wallNote = inst.hasWalls ? " Walls slow entry but don't solve what happens inside them." : '';
    safetyDesc = `Crime is a persistent and visible problem. ${lawRef} Travelers are advised to move in groups and keep valuables hidden.${wallNote}`;
  } else {
    safetyLabel = 'Dangerous';
    const lawRef =
      inst.hasGarrison  ? 'The garrison is a formality — present on paper, absent in practice.' :
      inst.hasWatch      ? 'The watch cannot respond effectively; reports are filed and forgotten.' :
      inst.hasMilitia    ? 'The militia musters for emergencies only; day-to-day crime is uncontested.' :
      inst.hasMercenary  ? 'The mercenary company has effectively become another criminal faction.' :
                           'There is effectively no law enforcement.';
    const wallNote   = inst.hasWalls ? ' Even the walls provide limited protection — the threat is within.' : '';
    const courtNote  = inst.hasCourtSystem ? '' : ' With no court system, violence is the primary means of dispute resolution.';
    safetyDesc = `Violence and theft are routine. ${lawRef} Residents protect themselves through community networks or tribute paid to whoever controls their street.${courtNote}${wallNote}`;
  }

  // ── Guard effectiveness description ───────────────────────────────────────
  let guardEffectivenessDesc = null;

  if (inst.hasMilitaryInst) {
    const lawRef =
      inst.hasGarrison  ? inst.hasWatch ? 'garrison and city watch' : 'garrison'  :
      inst.hasWatch      ? 'city watch'       :
      inst.hasMilitia    ? 'citizen militia'  :
      inst.hasMercenary  ? 'mercenary company':
      inst.hasCharterHall? "adventurers' charter hall" : 'local guard';

    const prisonNote = inst.hasCourtSystem && inst.hasPrison
      ? ' A functioning court and prison mean crimes carry real consequences.'
      : inst.hasCourtSystem
      ? ' A court exists, though the prison system is limited.'
      : inst.hasPrison
      ? ' Offenders can be jailed, but without a working court system enforcement is arbitrary.'
      : ' Without courts or prison, enforcement relies entirely on fines, exile, or summary violence.';

    const wallNote = inst.hasWalls
      ? ' Walls control entry points and give the guard a chokehold on smuggling routes.'
      : '';

    if (stress.stateCrime) {
      guardEffectivenessDesc = `The ${lawRef} is well-organized but deployed as an instrument of state extraction rather than public protection. ` +
        `Loyalty is to whoever controls the payroll.${prisonNote}`;
    } else if (flags.militaryEffective < 30 && pri.economy < 35) {
      const militiaNote = inst.hasMilitia ? ' — these are volunteers with day jobs, not soldiers' : '';
      guardEffectivenessDesc = `The ${lawRef} exists on paper. Chronically underpaid and poorly equipped${militiaNote}. ` +
        `Susceptible to bribery; enforcers who can be bought by whoever has coin.${prisonNote}`;
    } else if (stress.merchantArmy) {
      const secRef = inst.hasMercenary ? 'mercenary companies' : 'private security';
      const guildRef = inst.hasMerchantGuild ? 'The merchant guilds' : 'Wealthy interests';
      guardEffectivenessDesc = `Public law enforcement is largely a formality. ${guildRef} maintain their own ${secRef} — ` +
        `real protection exists, but only for those with the right associations.${prisonNote}`;
    } else if (inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch) {
      if (flags.militaryEffective >= 55) {
        guardEffectivenessDesc = `The citizen militia is well-organized and motivated — these are people defending their own homes and livelihoods, which counts for something. ` +
          `Coverage is irregular by professional standards, but local knowledge compensates.${prisonNote}${wallNote}`;
      } else {
        guardEffectivenessDesc = `The citizen militia musters when needed but cannot maintain consistent patrol. ` +
          `Volunteers with other work to do; reliable in a crisis, absent during routine crime.${prisonNote}`;
      }
    } else if (inst.hasMercenary && !inst.hasGarrison) {
      guardEffectivenessDesc = `A mercenary company provides enforcement — professional and effective, but loyal to the contract, not the community. ` +
        `When the coin stops, so does the protection.${prisonNote}${wallNote}`;
    } else if (inst.hasCharterHall && !inst.hasGarrison && !inst.hasWatch) {
      guardEffectivenessDesc = `The adventurers' charter hall coordinates emergency response to threats — effective for monster incursions and major disturbances, ` +
        `less so for routine crime prevention. Not a police force.${prisonNote}`;
    } else if (flags.militaryEffective >= 65 && pri.economy >= 50) {
      guardEffectivenessDesc = `The ${lawRef} is well-funded, properly equipped, and maintains meaningful patrol coverage. ` +
        `Response times are adequate; bribery exists but isn't normalized.${prisonNote}${wallNote}`;
    } else if (flags.militaryEffective >= 65 && pri.economy < 40) {
      guardEffectivenessDesc = `The ${lawRef} is disciplined but resource-constrained — motivated with inadequate equipment and irregular pay. ` +
        `Effective in a fight; vulnerable to sustained corruption.${prisonNote}${wallNote}`;
    } else {
      guardEffectivenessDesc = `The ${lawRef} maintains standard patrol coverage. Effective against opportunistic crime; ` +
        `less effective against organized operations that can plan around patrol routes.${prisonNote}${wallNote}`;
    }
  } else if (inst.hasCourtSystem) {
    guardEffectivenessDesc = 'No formal enforcement body exists, but a functioning court system provides some deterrence. ' +
      'Disputes that escalate to violence must rely on community pressure or the intervention of whoever is strongest locally.';
  } else {
    guardEffectivenessDesc = ['thorp', 'hamlet', 'village'].includes(tier)
      ? "There is no formal enforcement body. Order is maintained through community social pressure, the authority of established families, " +
        "and the implicit threat of collective action against those who break the peace. This works until it doesn't."
      : 'No functioning enforcement institution exists. The settlement is relying on whatever informal mechanisms remain.';
  }

  // ── Crime types ───────────────────────────────────────────────────────────
  const crimeTypes = [];

  if (stress.stateCrime) {
    const garRef = inst.hasGarrison ? 'the garrison' : 'armed officials';
    crimeTypes.push({
      type: 'State predation',
      desc: `The primary threat comes from institutional actors — ${garRef} using their authority for personal extraction. ` +
            'Tax extortion, forced confiscations, and selective enforcement targeting those without political connections.',
    });
  }
  if (stress.crimeIsGovt) {
    const crimeRef = inst.hasThievesGuild ? "The thieves' guild" : 'Organized crime';
    crimeTypes.push({
      type: 'Criminal governance',
      desc: `${crimeRef} has filled the power vacuum left by absent or failed civil authority. They provide a form of order and extract a price for it.`,
    });
  }
  if (stress.arcaneBlackMarket) {
    const alchRef = inst.hasAlchemist ? 'Alchemists and' : '';
    const mageRef = inst.hasMagesGuild ? "mages' guild" : 'magical practitioners';
    crimeTypes.push({
      type: 'Arcane black market',
      desc: `${alchRef} ${mageRef} who operate outside legal channels supply a sophisticated underground market for forbidden components, illegal rituals, and undetectable forgeries.`,
    });
  }
  if (stress.religiousFraud) {
    const authRef = inst.hasChurch ? "The church's moral authority" : 'Religious structures';
    crimeTypes.push({
      type: 'Religious fraud',
      desc: `${authRef} provide cover for sophisticated fraud — fake relics, forged dispensations, and corrupt clergy who treat their position as a commercial opportunity.`,
    });
  }
  if (stress.merchantCriminalBlur) {
    const tradeRef = inst.hasMerchantGuild ? 'Guild merchants' : 'Wealthy traders';
    crimeTypes.push({
      type: 'Commercial crime',
      desc: `${tradeRef} and criminal operators are in many cases the same people. The distinction between a successful merchant and a successful criminal is largely legal technicality.`,
    });
  }
  if (flags.criminalEffective >= 60 && pri.economy >= 60 &&
      !stress.merchantCriminalBlur && inst.hasThievesGuild) {
    const courtNote = inst.hasCourtSystem && inst.hasPrison
      ? ' Guild operations are careful and layered — they keep enough distance from violent crime that prosecution is difficult.'
      : ' With no reliable court system to fear, operations are conducted openly enough to be an open secret.';
    crimeTypes.push({
      type: 'Organized guild crime',
      desc: `The thieves' guild is well-funded and structured — protection rackets, sophisticated smuggling operations, and contract services for discerning clients.${courtNote}`,
    });
  }
  // Survival crime: requires either a criminal institution OR a settlement large enough
  // that community self-regulation breaks down. Clean thorps/hamlets don't have fences
  // or hired muscle networks — desperate people steal from neighbors quietly, not organizationally.
  if (flags.criminalEffective >= 48 && pri.economy < 35 && !_isSmallCommunity) {
    crimeTypes.push({
      type: 'Survival crime',
      desc: 'Theft driven by economic desperation rather than organization. No criminal infrastructure — just too many people with too little, doing what they must to survive.',
    });
  }
  if (flags.criminalEffective >= 45 && pri.magic >= 48 &&
      !stress.arcaneBlackMarket && inst.hasMagicInst) {
    const magRef = inst.hasWizardTower ? 'tower resources' : inst.hasAlchemist ? 'alchemical knowledge' : 'magical ability';
    crimeTypes.push({
      type: 'Magical crime',
      desc: `Practitioners misuse ${magRef} for profit — identity alteration, scrying, alchemical fraud, or targeted curses-for-hire.`,
    });
  }
  if (inst.hasSmuggling) {
    const routeType = inst.hasPort ? 'port-based' : 'overland';
    const gateNote  = inst.hasGates
      ? " The settlement's gates and walls are checkpoints that smugglers work around — bribing officials, using hidden routes, or moving shipments at shift changes."
      : ' The lack of controlled entry points makes movement relatively easy; no gates to bribe and no checkpoints to avoid.';
    const prosecuteNote = inst.hasPrison && inst.hasCourtSystem
      ? ' Arrests do happen — prosecution is real, which is why the network is careful.'
      : inst.hasPrison
      ? ' Offenders can be jailed, but without consistent courts, enforcement is sporadic.'
      : ' Without prison or courts, the risk of operating is low — arrest means a fine at worst.';
    crimeTypes.push({
      type: 'Smuggling',
      desc: `An active ${routeType} smuggling operation moves contraband through the settlement. The routes are established and the operators have learned the patrol schedules.${gateNote}${prosecuteNote}`,
    });
  }
  if (inst.hasGangInfra && crimeTypes.length === 0) {
    const garRef  = inst.hasGarrison ? ' The garrison acknowledges the problem but focuses on the walls and gates — interior policing is under-resourced.'
                  : inst.hasWatch    ? ' The watch responds to the worst incidents but cannot contest territorial control.'
                  : inst.hasMilitia  ? ' The militia is composed of locals who know the gangs personally — enforcement is complicated.'
                  :                    ' With no formal guard, the gangs operate without meaningful opposition.';
    const wallNote = inst.hasWalls ? ' District boundaries often follow the old wall lines and alleyways.' : '';
    crimeTypes.push({
      type: 'Street gang activity',
      desc: `Territorial gangs control specific districts, extorting local businesses and residents. Violence is episodic rather than constant — mostly enforcing territorial boundaries.${garRef}${wallNote}`,
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
      const lawRef  = inst.hasMilitaryInst ? 'The watch is too thinly spread to maintain order.' : 'There is no meaningful law enforcement.';
      const charNote = inst.hasCharterHall ? ' The charter hall handles external threats but is not equipped for civil enforcement.' : '';
      const courtNote = inst.hasCourtSystem ? '' : ' Without a court, there is no formal mechanism for resolving disputes peacefully.';
      crimeTypes.push({
        type: 'Lawlessness',
        desc: `${lawRef} Disputes are settled by whoever is stronger. Property is kept only by those who can defend it.${charNote}${courtNote}`,
      });
    } else {
      const courtNote = inst.hasCourtSystem && inst.hasPrison
        ? ' Consequences exist — offenders risk real prosecution — which keeps serious organised crime from taking root.'
        : ' The lack of reliable courts and detention means most offenders face no meaningful consequences.';
      crimeTypes.push({
        type: 'Background crime',
        desc: `Petty theft, minor fraud, and opportunistic violence are persistent. No single dominant organisation — just the steady pressure of too many people with too little, and too few consequences for taking.${courtNote}`,
      });
    }
  }

  // ── Stress-specific crime type additions ──────────────────────────────────
  const addCrimeIfMissing = (type, desc) => {
    if (!crimeTypes.some(c => c.type === type)) crimeTypes.push({ type, desc });
  };

  if (hasStress('famine') || hasStress('under_siege')) {
    addCrimeIfMissing('desperation theft',
      'Hunger-driven theft of food, livestock, and stored goods. Enforcement struggles to distinguish survival crime from organised theft.');
    addCrimeIfMissing('black market food',
      'Controlled goods — grain, salt, preserved meat — changing hands at extortionate prices through unofficial channels.');
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
    addCrimeIfMissing('debt evasion',
      'Residents fleeing creditor obligations, transferring assets fraudulently, or using criminal networks to avoid collection.');
  }
  if (hasStress('insurgency')) {
    const insurgentDriven = (flags.criminalEffective || 0) > (flags.militaryEffective || 0);
    addCrimeIfMissing('political violence',
      insurgentDriven
        ? 'Street-level confrontations between insurgent supporters and the watch. Officially categorised as riot and disorder.'
        : 'Targeted intimidation and occasional violence against officials loyal to the current authority. Professionally executed.');
    addCrimeIfMissing('loyalty testing',
      'Both the governing faction and the insurgency pressure individuals to declare allegiance. Refusal is dangerous. False declarations are common.');
    addCrimeIfMissing('information trade',
      'Intelligence about the other side commands real money. Both factions pay for names, plans, and movements.');
  }
  if (hasStress('slave_revolt')) {
    addCrimeIfMissing('revolt violence',
      'Active armed conflict between revolt participants and security forces in contested districts. Civilians are avoiding specific streets. The watch has abandoned normal patrol patterns.');
    addCrimeIfMissing('escape networks',
      'Organised infrastructure helping enslaved persons escape — safe houses, forged papers, passage out of the settlement. The same network that was small and cautious is now large and urgent.');
    addCrimeIfMissing('informant pressure',
      'Both the authorities and the revolt leadership are pressing people for information. Silence is being interpreted as allegiance. Some residents have left rather than be forced to choose.');
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
      'Theft and petty fraud by new arrivals with no local ties and no established credit. The watch struggles to distinguish transients from residents.');
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
    'multiple criminal factions':  'Multiple Criminal Factions',
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
  const criminalInstitutions = (Array.isArray(institutions) ? institutions : [])
    .map(i => (i.name || '').toLowerCase())
    .filter(n => CRIMINAL_INST_LABELS[n])
    .map(n => CRIMINAL_INST_LABELS[n]);

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
    economicDragDesc = `The shadow economy captures an estimated ${blackMarketCapture}% of economic activity — goods moving through unofficial channels, taxes unpaid, and legitimate merchants undercut by operators with no overhead costs.`;
  } else if (blackMarketCapture > 5) {
    economicDragDesc = `A modest shadow economy (~${blackMarketCapture}% of activity) operates alongside legitimate commerce. Noticeable but not yet structurally damaging.`;
  }

  // ── Plot hooks ────────────────────────────────────────────────────────────
  const plotHooks = [];

  if (stress.stateCrime) {
    const garRef = inst.hasGarrison ? 'the garrison' : 'armed officials';
    plotHooks.push(`A local family wants evidence of tax extortion gathered quietly — but the extorter wears an official badge.`);
  }
  if (stress.crimeIsGovt) {
    const crimeRef = inst.hasThievesGuild ? 'the guild' : 'whoever controls this block';
    plotHooks.push(`Someone approached the party seeking legitimate authority to settle a dispute. The only "authority" here is ${crimeRef}.`);
  }
  if (stress.arcaneBlackMarket) {
    plotHooks.push("A wizard's tower component went missing. The black market has it. Getting it back means either paying their price or taking it — both have consequences.");
  }
  if (stress.religiousFraud) {
    plotHooks.push("A pilgrim paid a fortune for a holy relic that is obviously fake. They want the fraud exposed without losing their faith in the process.");
  }
  if (stress.merchantCriminalBlur) {
    plotHooks.push("A guild merchant hired the party, then asked them to do something the guild officially forbids. The job was lucrative. The question is who else knows.");
  }
  if (inst.hasSmuggling) {
    plotHooks.push("The smuggling network is moving something unusual this week — not the normal contraband. Someone wants to know what it is before it arrives.");
  }
  if (stress.crusaderSynthesis) {
    plotHooks.push("The garrison chaplain and the commander are the same man. He's authorizing military action for reasons that sound theological.");
  }
  if (stress.merchantArmy) {
    plotHooks.push("The merchant guild's private security force just detained someone — with no legal authority to do so. The watch is looking the other way.");
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
