/**
 * power/governanceNarrative.js — the governance TEXT layer: stability label,
 * recent-conflict vignette, and stress-narrative selection, plus the
 * institution/tier phrasing rewriter they all feed through.
 */

// rewriteFactionPhrasing — rewrite generic faction phrasing in `text` to match
// the settlement's actual institutions and tier.
//   text                  — narrative string to rewrite
//   instNames             — lowercased institution names present
//   tier                  — settlement tier
//   governingBodyOverride — explicit governing-body label, else derived from tier
const rewriteFactionPhrasing = (text, instNames, tier, governingBodyOverride) => {
  const hasInst = (keyword) => instNames.some((name) => name.includes(keyword)),
    isSmall = ['thorp', 'hamlet', 'village'].includes(tier),
    guardLabel = hasInst('garrison')
      ? 'the garrison'
      : hasInst('barracks')
        ? 'the barracks guard'
        : hasInst('professional guard')
          ? 'the professional guard'
          : hasInst('city watch') || hasInst('town watch')
            ? 'the watch'
            : hasInst('militia')
              ? 'the militia'
              : hasInst('mercenary')
                ? 'the mercenary company'
                : isSmall
                  ? 'the able-bodied'
                  : 'the guard',
    councilLabel =
      governingBodyOverride ||
      (isSmall
        ? tier === 'thorp'
          ? 'the household heads'
          : 'the village elders'
        : tier === 'town'
          ? 'the town council'
          : tier === 'city'
            ? 'the city council'
            : tier === 'metropolis'
              ? 'the grand council'
              : 'the council'),
    merchantLabel =
      hasInst('merchant') || hasInst('guild') || hasInst('market')
        ? 'the merchants'
        : isSmall
          ? 'the wealthiest household'
          : 'the traders',
    healerLabel = hasInst('hospital')
      ? 'the hospital staff'
      : hasInst('monastery') || hasInst('friary')
        ? 'the monastery brothers'
        : hasInst('healer')
          ? 'the healers'
          : hasInst('church') || hasInst('cathedral') || hasInst('parish')
            ? 'the clergy'
            : isSmall
              ? 'the local herbalist'
              : 'the healers',
    watchLabel =
      hasInst('city watch') || hasInst('town watch')
        ? 'the watch'
        : hasInst('garrison') || hasInst('guard')
          ? 'the guard'
          : hasInst('militia')
            ? 'the militia'
            : isSmall
              ? 'the neighbours'
              : 'the guard';
  return text
    .replace(/\bthe garrison commander\b/gi, guardLabel.replace(/^the /, 'the ') + "'s commander")
    .replace(/\bthe garrison\b/gi, guardLabel)
    .replace(/\bthe public watch\b/gi, watchLabel)
    .replace(/\bthe watch\b/gi, watchLabel)
    .replace(/\bthe council\b/gi, councilLabel)
    .replace(/\ba council\b/gi, councilLabel)
    .replace(/\bcouncil meetings\b/gi, councilLabel.replace(/^the /, '') + ' meetings')
    .replace(/\binside the council\b/gi, 'inside ' + councilLabel)
    .replace(/\bthe grain merchants\b/gi, merchantLabel)
    .replace(/\bgrain merchants\b/gi, merchantLabel)
    .replace(/\btwo healers\b/gi, 'two ' + healerLabel.replace(/^the /, ''))
    .replace(/\bthe healers\b/gi, healerLabel)
    .replace(
      /\bthe mages' quarter\b/gi,
      hasInst('wizard') || hasInst('mage') || hasInst('alchemist') ? "the mages' quarter" : 'the arcane practitioners'
    );
};

// buildGovernanceLabels — derive the stability label and recent-conflict
// vignette for the settlement. Returns { stability, recentConflict }.
export const buildGovernanceLabels = ({
  factions,
  config,
  stressFlags,
  instFlags,
  tradeRoute,
  instNames,
  priorities,
  tier,
  P,
  S,
  ge,
  fe,
}) => {
  const ke = (N) => ge.includes(N);
  let oa; // temp for the null-safe governing-faction lookup below
  const Gt = (config == null ? void 0 : config.monsterThreat) || 'frontier';
  let Me;
  (stressFlags.stateCrime
    ? (Me = 'Enforced Order (authoritarian)')
    : stressFlags.crimeIsGovt
      ? (Me = 'Unstable — criminal governance')
      : stressFlags.crusaderSynthesis
        ? (Me = 'Rigid (militant theocracy)')
        : stressFlags.merchantArmy
          ? (Me = 'Fragile (private security, no public law)')
          : instFlags.criminalEffective > 75 && instFlags.militaryEffective < instFlags.criminalEffective - 8
            ? (Me = 'Unstable (pervasive organized crime)')
            : instFlags.militaryEffective > 70 && instFlags.economyOutput < 32
              ? (Me = 'Tense (militarised, chronically underfunded)')
              : stressFlags.theocraticEconomy
                ? (Me = 'Stable (theocratic governance)')
                : (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'Hostile rival' ||
                    (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'hostile_rival' ||
                    (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'cold_war' ||
                    (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'Cold war' ||
                    (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'tense'
                  ? (Me = 'Tense (external threat)')
                  : instFlags.economyOutput > 68 && instFlags.militaryEffective < 30
                    ? (Me = 'Vulnerable (prosperous but underdefended)')
                    : instFlags.militaryEffective > 68
                      ? (Me = 'Ordered (strong military presence)')
                      : (Me = 'Stable'),
    ke('under_siege')
      ? (Me = 'Critical (active siege — survival priority)')
      : ke('occupied')
        ? (Me = 'Suppressed (under occupation — resistance simmers)')
        : ke('politically_fractured')
          ? (Me = 'Fractured — no stable governing authority')
          : ke('recently_betrayed')
            ? (Me = 'Shaken — institutional trust collapsed')
            : ke('famine')
              ? (Me = 'Desperate — hunger is eroding order')
              : ke('plague_onset')
                ? (Me = 'Anxious — disease is overriding normal authority')
                : ke('succession_void')
                  ? (Me = 'Volatile — power is available to whoever moves first')
                  : ke('infiltrated')
                    // Intentional no-op: 'infiltrated' stressor doesn't override
                    // the public-tone label set by prior cases. Wrapped as an
                    // explicit identity to keep the ternary chain consistent.
                    // eslint-disable-next-line no-self-assign
                    ? (Me = Me)
                    : ke('indebted')
                      ? Me.includes('Unstable') || (Me = 'Strained — debt obligations constrain every decision')
                      : ke('monster_pressure') &&
                        (Me.toLowerCase().includes('tense') ||
                          (Me = 'Tense (monster pressure from surrounding region)')),
    // Canonical threat vocabulary is heartland/frontier/plagued — the old
    // 'embattled'/'high' literals were never emitted, so a plagued settlement
    // never received its monster-threat governance annotation.
    Gt === 'plagued' &&
      (Me = [
        'tense',
        'unstable',
        'fragile',
        'rigid',
        'vulnerable',
        'enforced',
        'desperate',
        'anxious',
        'volatile',
        'shaken',
        'suppressed',
        'fractured',
        'critical',
        'strained',
        'ordered',
      ].some((N) => Me.toLowerCase().includes(N))
        ? Me + '; monster threat active'
        : 'Tense — regional monster threat'));
  let We;
  const At = instNames.some(function (N) {
      return (
        N.includes('garrison') ||
        N.includes('barracks') ||
        N.includes('militia') ||
        N.includes('watch') ||
        N.includes('guard') ||
        N.includes('mercenary')
      );
    }),
    Qt = instNames.some(function (N) {
      return (
        N.includes('guild') ||
        N.includes('market district') ||
        N.includes('merchant house') ||
        N.includes('trading company')
      );
    }),
    aa = instNames.some(function (N) {
      return N.includes('mage') || N.includes('wizard') || N.includes('arcane') || N.includes('alchemist');
    }),
    Le = instNames.some(function (N) {
      return (
        N.includes('council') ||
        N.includes('court') ||
        N.includes('magistrate') ||
        N.includes('hall') ||
        N.includes('charter') ||
        N.includes('guild hall')
      );
    }),
    br = instNames.some(function (N) {
      return N.includes('market') || N.includes('merchant') || N.includes('guild') || N.includes('trading');
    }),
    Re = instNames.some(function (N) {
      return (
        N.includes('church') ||
        N.includes('cathedral') ||
        N.includes('monastery') ||
        N.includes('temple') ||
        N.includes('parish') ||
        N.includes('shrine')
      );
    }),
    Hr = P && P.includes('Royal Authority'),
    Jr =
      S ||
      factions.some(function (N) {
        return (
          N.faction === 'Noble Families' ||
          N.faction === 'Noble Houses' ||
          N.faction === 'Landed Gentry' ||
          N.faction === 'Manor Household'
        );
      });
  stressFlags.stateCrime
    ? (We = At
        ? 'Several households disappeared following a tax audit. The garrison commander has not been available for comment.'
        : 'Several households stopped paying what they owe. The person collecting those payments has not been seen since.')
    : stressFlags.crimeIsGovt
      ? (We =
          Qt || Le
            ? 'The guild and the district council both claim authority over the new market. Violence has settled some of the disputes; more is expected.'
            : 'Two of the stronger families have been resolving disputes between themselves rather than involving the elders. The rest of the community is watching nervously.')
      : stressFlags.crusaderSynthesis
        ? (We = At
            ? 'The commander-prelate has declared a heresy investigation into a rival settlement. The garrison is mobilizing.'
            : 'The local priest has declared a neighbouring settlement heretical. Relations between the two communities have broken down entirely.')
        : stressFlags.merchantArmy
          ? (We =
              Qt && At
                ? "A guild's private soldiers arrested a rival's factor. The public watch is refusing to intervene in what they call a 'merchant matter'."
                : "One household's hired hands roughed up a rival's farmhand over a grazing dispute. Neither side will involve the elders.")
          : stressFlags.heresySuppression
            ? (We = aa
                ? "A hedge wizard was dragged before the ecclesiastical court. The mages' quarter is very quiet at the moment."
                : Re && Le
                  ? 'The priest has summoned someone before the church court. The village is divided on whether they deserved it.'
                  : "The priest has been asking questions about a local family's practices. The family has become very quiet.")
            : stressFlags.merchantCriminalBlur
              ? (We = Qt
                  ? "Two guild masters are having each other's warehouses robbed. Both deny it publicly. Both are losing patience."
                  : "Two households have been undercutting each other on market day for months. Last week someone's cart was damaged. No one saw anything.")
              : tradeRoute
                ? (We = `Ongoing tensions with ${tradeRoute.neighborName}`)
                : instFlags.criminalEffective > 65
                  ? (We =
                      At || Le
                        ? 'Crime rates are rising; several merchants have been found murdered, and the guard is being accused of inaction.'
                        : 'Someone has been stealing from the communal stores. Everyone suspects someone. No one is saying anything.')
                  : Hr && Jr && priorities.military > 55
                    ? (We =
                        priorities.economy < 40
                          ? 'The crown has called in military levies from the noble houses. Two houses have complied. One has not, and has not explained why.'
                          : priorities.military > 70
                            ? 'A noble house has begun recruiting its own soldiers beyond its traditional levy obligation. The crown has noticed and has not yet decided what to say about it.'
                            : "The crown's relationship with the noble houses is transactional and increasingly strained. The last royal directive was delayed six weeks while passing through noble intermediaries.")
                    : Jr && instFlags.economyOutput > 55
                      ? (We =
                          priorities.economy > 65
                            ? 'The merchant class is outbuying noble landholdings. Three estates have changed hands in the last decade. The families that lost them have not forgotten.'
                            : "A noble family is contesting a merchant's right to operate in their traditional market territory. The council is hearing the case and wishes it were not.")
                      : instFlags.militaryEffective > 68
                        ? (We = At
                            ? 'The military commanders are pushing for expanded authority over civilian courts — and the council is losing ground.'
                            : Le
                              ? 'The village militia captain is pushing for authority over disputes that the reeve used to handle.'
                              : "The strongest armed household has started making decisions on everyone's behalf without asking.")
                        : instFlags.religionInfluence > 68
                          ? (We = Le
                              ? 'The church is demanding veto power over council appointments. The council has not yet refused publicly.'
                              : Re
                                ? 'The church wants approval rights over market day activities. The village reeve disagrees.'
                                : 'The priest has been insisting on a say in who can marry whom and what gets planted when. Several families are unhappy.')
                          : instFlags.economyOutput > 68
                            ? (We = Qt
                                ? 'Two rival guilds are contesting control of the main trade route. Neither side will back down and the council is avoiding the question.'
                                : br
                                  ? 'The miller and the largest farming household are in dispute over prices and access.'
                                  : 'The household that sells the most at market has been throwing its weight around in community decisions.')
                            : (config == null ? void 0 : config.monsterThreat) === 'plagued'
                              ? (We = At
                                  ? 'A monster incursion last season destroyed outlying farms. The garrison is stretched thin and the council cannot agree on whether to raise a levy or hire mercenaries.'
                                  : Le
                                    ? 'Monster attacks on the outlying farms have not stopped. The village is debating whether to build proper defences or petition the nearest lord for help.'
                                    : 'Farms nearby have been abandoned after attacks. The community cannot agree on whether to shelter in place, build defences, or leave.')
                              : (We =
                                  Le || Qt
                                    ? 'The council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost.'
                                    : br
                                      ? 'A dispute over field rotation and grazing rights has divided the village for most of this season.'
                                      : 'A dispute over grazing rights and water access has been running for two seasons. It has stopped being about grazing rights and water access.');
  const na = ge.length
      ? [
          'under_siege',
          'occupied',
          'famine',
          'plague_onset',
          'politically_fractured',
          'recently_betrayed',
          'succession_void',
          'indebted',
          'infiltrated',
          'monster_pressure',
          'insurgency',
          'mass_migration',
          'wartime',
          'religious_conversion',
          'slave_revolt',
        ].find((N) => ge.includes(N)) || ge[0]
      : fe,
    Ie = ((oa = factions.find((N) => N.isGoverning)) == null ? void 0 : oa.faction) || null,
    Na = instNames.some(function (N) {
      return N.includes('garrison');
    })
      ? 'The garrison'
      : instNames.some(function (N) {
            return N.includes('militia');
          })
        ? 'The militia'
        : instNames.some(function (N) {
              return N.includes('watch');
            })
          ? 'The watch'
          : instNames.some(function (N) {
                return N.includes('mercenary');
              })
            ? 'The mercenary company'
            : ['thorp', 'hamlet', 'village'].includes(tier)
              ? 'The community'
              : 'The guard',
    sa = {
      under_siege:
        'The settlement is under active siege. Every resource decision is a military decision. The debate is no longer about policy — it is about survival.',
      famine:
        At || Le || br
          ? 'Food shortages have sharpened every tension in the settlement. Those with stocks are not advertising the fact. Those without are watching those with.'
          : 'The last harvest failed badly. What remains is being rationed by whoever holds the stores. Neighbours who shared meals last winter are watching each other carefully.',
      occupied:
        'An occupying officer arrested a local elder for "seditious speech". ' +
        Ie +
        ' filed a formal protest. The protest was returned unread.',
      politically_fractured:
        Le || At || Qt
          ? 'Two of the three factions are no longer attending joint council meetings. Decisions are being made unilaterally and contradicted by rivals within days.'
          : 'The community is split. Two households are not speaking to each other or to anyone who sides with the other. Everything requiring collective decision has stopped.',
      indebted:
        Hr && Jr
          ? "The crown's debt to the noble houses has become structural. Three major policy decisions this year were reversed after private meetings with creditor lords. No one publicly acknowledges the connection."
          : "The creditor's representative blocked the infrastructure repair budget. Publicly they cited fiscal responsibility. Privately they cited a clause in the debt agreement.",
      recently_betrayed:
        Hr && Jr
          ? 'A noble house passed intelligence to a rival power. The crown knows. The house denies it. The crown cannot yet afford to act — it needs their levies.'
          : Le
            ? (function () {
                var N = [
                    'Elected Reeve',
                    'Feudal Appointee',
                    'Feudal Stewardship',
                    'Noble Governorship',
                    'Royal Authority',
                    'Household Council',
                  ],
                  ye = N.includes(Ie) ? 'within the office of the ' : 'inside ',
                  he = N.includes(Ie) ? Ie.toLowerCase() : Ie;
                return (
                  'The investigation into the betrayal has been obstructed twice. The obstruction came from ' +
                  ye +
                  he +
                  '. No one will say who.'
                );
              })()
            : 'Someone talked. Information that should have stayed inside the settlement reached an outside party. No one has admitted it. Everyone suspects someone.',
      infiltrated: We,
      plague_onset:
        'The quarantine has been imposed on the affected district. Compliance is partial. Two people who attempted to enforce it were assaulted.',
      succession_void: Hr
        ? Jr
          ? 'Two noble houses are contesting the succession. Both have legal arguments. Both have soldiers. The settlement is watching which house the other noble families back, because that is what will decide it.'
          : 'The throne is vacant and the council of succession has deadlocked. Every faction that benefits from the current stalemate is quietly prolonging it.'
        : Le
          ? 'Two candidates for the vacant position each held separate public assemblies on the same day. Both claimed the other was illegal.'
          : 'The elder who kept the peace is gone. No one has stepped forward to take that role. Small disputes that would have been settled quickly are now sitting open.',
      monster_pressure: At
        ? 'A farmstead three miles out was destroyed last night. The farmer and his family are unaccounted for. ' +
          Na +
          ' is not going out to look.'
        : 'A farmstead a short walk from here was destroyed last night. The family is gone. No one is going to look for them.',
      insurgency: (function () {
        return (instFlags.criminalEffective || 0) > (instFlags.militaryEffective || 0) &&
          (instFlags.economyOutput || 50) < 48
          ? "The commons no longer accept the authority's account of events. Inflammatory pamphlets are being distributed. Two guild masters refused to attend the last civic assembly. The governing faction has intelligence about cells meeting at night — but hasn't moved, because moving publicly would confirm what it officially denies."
          : 'The challenge to the governing faction is institutional, not popular. Key officials are slow-walking orders. Revenue is being collected but held rather than forwarded. ' +
              Ie +
              ' is conducting meetings with people who should not be meeting privately. The governing faction has noticed and is considering whether to act before the coalition is complete.';
      })(),
      wartime: (function () {
        return (instFlags.militaryEffective || 50) >= 55 && (instFlags.economyOutput || 50) >= 45
          ? 'The war is present here as money and absence. The garrison has doubled in size and is well-supplied — the crown is paying for this one. Contracts for grain, leather, and ironwork are flowing to anyone with the capacity to fill them. The men who left to fight have not returned, which is a grief that runs beneath the commerce. ' +
              Ie +
              ' is navigating the difference between what it can extract for the war effort and what the settlement can actually spare.'
          : 'The war is present here as scarcity and fear. Conscription has taken workers, not soldiers — the farms and workshops feel their absence. Supply caravans pass through on crown requisition and local needs come second. Prices have risen and will rise further. A crown officer arrived last week and left with a list of what will be requisitioned next month. The governing faction signed the order. There was no alternative that anyone could see.';
      })(),
      religious_conversion: (function () {
        const N = Ie ? Ie.length % 3 : 0;
        return N === 0
          ? 'The new faith does not yet have a building. It has kitchens, meeting rooms in private homes, and a preacher who travels a circuit. The old institution has the building, the records, the accumulated donations, and a congregation that is quietly redistributing itself. Neither party is ready to force a confrontation. Both are watching the numbers.'
          : N === 1
            ? 'The schism is now formal. Two priests, two congregations, two sets of records — births, deaths, marriages — that may or may not be recognised depending on which authority the other party acknowledges. ' +
              (Ie || 'The governing authority') +
              ' has not declared which succession is legitimate, which means every legal document dependent on religious sanction is in a grey zone.'
            : 'The conversion order came from ' +
              (Ie || 'outside authority') +
              ' and was formally acknowledged within the week. The speed of the formal compliance was remarkable. The depth of the actual compliance is a different question. The old faith does not hold services openly. It is not clear it has stopped holding them.';
      })(),
      mass_migration: (function () {
        return (instFlags.economyOutput || 50) >= 50
          ? 'The settlement is receiving more people than its infrastructure was built for. New arrivals come faster than housing, food, and employment can absorb them. The old residents and the new ones are not yet the same community. ' +
              Ie +
              ' is being asked to do something about it and cannot agree what that something is.'
          : 'Three families left this week. Two more last week. The departure is quiet and orderly — which makes it worse. The people leaving have thought it through. What remains is those who cannot leave, those who choose to stay, and institutions running on fewer people than they were designed for.';
      })(),
      slave_revolt: (function () {
        return (
          'The revolt began at ' +
          (instNames.some(function (he) {
            return he.includes('slave market');
          })
            ? 'the slave market'
            : "the settlement's labour system") +
          " and has not been contained. The security response has been slow, partly because no one in authority wanted to admit publicly how organised the resistance was. Buildings controlled by the revolt's leadership are marked. Movement in and out of certain districts is contested. The governing faction's official position is that this is being handled. Its private position involves considerably more urgency."
        );
      })(),
    };
  if (We) We = rewriteFactionPhrasing(We, instNames, tier, Ie);
  if (na && sa[na]) We = rewriteFactionPhrasing(sa[na], instNames, tier, Ie);
  return { stability: Me, recentConflict: We };
};
