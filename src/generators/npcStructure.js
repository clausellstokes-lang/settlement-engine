/**
 * npcStructure.js
 *
 * Derives structural position, active goal, and active constraint for
 * significant NPCs from the live settlement state.
 *
 * Two template axes:
 *   - condition: the most salient settlement pressure (6 states)
 *   - rank: whether this NPC HEADS a dominant power or stands below one
 *     (prevents all government NPCs getting identical text in one settlement)
 *
 * THE PEOPLE CAR (PEOPLE-2 CAST-DERIVED, 2026-11-07; the chair's ruling of the day): a card's
 * power is no longer its `factionAffiliation` (the shim's, removed by PEOPLE-5) but its
 * FIRST-RANK power — its best standing among its `memberships` (domain/people/membership.js).
 * `structuralRank` is a real field, written on EVERY card from that standing: rank 1 = 'head',
 * 2–3 = 'inner_circle', a member ranked nowhere = 'member', no membership = 'unaffiliated'. The
 * template's rank axis reads the same standing: 'dominant' where the card HEADS its first-rank
 * power and that power leads its category within reach of the governing power (the old power
 * test, unchanged); 'subordinate' otherwise.
 *
 * activeGoal replaces the existing goal.short field on enriched NPCs so
 * the DM sees one coherent goal derived from the current situation.
 */
import { resolveDeclared, lineText } from '../domain/facts/drawDeclared.js';
import { factsOf } from '../domain/facts/factsOf.js';

import { heldByOthers } from './hookVariety.js';
import { powerOrderOf, structuralStandingOf, STANDING } from '../domain/people/membership.js';

// Shared phrases hoisted once (train EM-T16's worker buy-back, judgment 214c): each is spelled here and referenced below; every emitted value is byte-identical.
const GOVERNANCE_FRACTURED = 'governance_fractured';
const OTHER_STABLE_DOMINANT = 'other__stable__dominant'; const CALM_ONLY = Object.freeze(['no crisis']); // CENSUS-4b (Appendix B item 3): the stable entries claim calm — the ledger's `excludes: crisis` (docs/census/declarations/npcStructure.T.json; R-F 4); the T lookup is CENSUS-1d's to wire (resolveDeclared, tagged)
function getPrimaryCondition(settlement) {
  const leg     = settlement.powerStructure?.publicLegitimacy;
  const crimCap = settlement.powerStructure?.criminalCaptureState || 'none';
  const food    = settlement.economicState?.foodSecurity;
  const pros    = (settlement.economicState?.prosperity || '').toLowerCase();

  if (leg?.governanceFractured)                         return GOVERNANCE_FRACTURED;
  if (crimCap === 'corrupted' || crimCap === 'capture') return 'corruption';
  const fl = (food?.label || '').toLowerCase();
  if (fl.includes('famine') || fl.includes('deficit'))  return 'food_crisis';
  if (pros.includes('struggling') || pros.includes('poor') || pros.includes('subsist')) return 'economic_stress';
  if (leg?.isContested)                                 return 'contested';
  return 'stable';
}

// rank: 'dominant' if the NPC HEADS its first-rank power and that power is the highest-power
//       power of its type, within reach of the governing power
//       'subordinate' otherwise (a lower rank, or another power of its category has more power)
function getRank(standing, allFactions) {
  if (standing.standing !== STANDING.head) return 'subordinate';
  const myFac  = allFactions.find(f => f.faction === standing.power);
  if (!myFac) return 'subordinate';
  const myCat  = myFac.category || 'other';
  const sameCategory = allFactions.filter(f => (f.category || 'other') === myCat);
  const isTop  = sameCategory.every(f => (f.power || 0) <= (myFac.power || 0));
  const govFac = allFactions.find(f => f.isGoverning);
  const isDominantOverall = myFac.faction === govFac?.faction ||
                            (myFac.power || 0) >= (govFac?.power || 0) * 0.85;
  return (isTop && isDominantOverall) ? 'dominant' : 'subordinate';
}

// ── Template library: category × condition × rank ─────────────────────────────
// Each entry: { position, goal, constraint }
// position / constraint: abstract structural language only — no world facts.
// goal (lane R11, the chair's ruling 2026-11-04): printed after "Wants to" on the Tonight sheet,
// the Quick Guide and the NPC card, so it is written in the HOUSE REGISTER — the same intention as
// a thing the person would do tonight, at most eighteen words, concrete, and it presumes nothing
// the record may lack (no walls, watch, market, temple, river, guild hall, tier noun) beyond what
// its condition key guarantees. `tonightSheet.js :: isVoiceableWant` is the rule; every one of the
// 76 reads voiceable (tests/generators/npcStructureWantsVoiceable.test.js). Old → new, all 76:
// docs/READER_R11_TONIGHT_WANTS_2026-11-04.md §4.

const T = {};

// helper: register both ranks from a dominant template + a subordinate override
function reg(cat, cond, dom, sub) {
  T[`${cat}__${cond}__dominant`]    = dom;
  T[`${cat}__${cond}__subordinate`] = sub || {
    position:   dom.position.replace('Holds governing authority', 'Occupies a civic position')
                             .replace('Controls the primary', 'Manages a secondary')
                             .replace('Holds institutional', 'Represents an institutional'),
    goal:       dom.goal, ...(dom.tags ? { tags: dom.tags } : {}), // R11: a subordinate with no override wants what the dominant wants (dead today: every entry passes one); CENSUS-4b: its tags with it
    constraint: dom.constraint,
  };
}

// ── government ────────────────────────────────────────────────────────────────
// SW-6 CRISIS-SURFACES (STYLE-RULINGS-2 B10(b); STYLE-2-SURFACES §7·F F1/F2): the seat-holders' position and
// constraint in plain words — what a visitor would see and what binds the holder — the "Formal title … not the
// same thing" coda struck. The goals are untouched (retired by car 4's A9; dead text until a post-deploy packet).
reg('government',GOVERNANCE_FRACTURED,
  { position:  'Holds the seat in name, but fewer people come when called, and some orders go unanswered.',
    goal:      'Get the seat obeyed again before the week is out, or find a quiet way out of it.',
    constraint:'Cannot mend what is broken without bringing to light the quiet deals that keep the place running now.' },
  { position:  'Holds an office under a seat that fewer people now obey; the office is only as strong as the seat.',
    goal:      'Keep their office through the collapse without being seen with the failing seat or its rivals.',
    constraint:'Moving to protect the office looks like a grab; standing still means falling with the seat.' }
);
reg('government','corruption',
  { position:  'Holds the seat while criminals pay for favours close to it; some orders that matter are settled elsewhere.',
    goal:      'Keep the seat running without crossing the people whose payments keep it running.',
    constraint:'Cannot move against the criminals without cutting off the payments the seat now runs on.' },
  { position:  'Holds an office among officials who take bribes; not one of the takers, but working beside them.',
    goal:      'Show their own books are clean while the people above them take payments.',
    constraint:'Any honest inquiry needs the help of officials who are themselves on the take.' }
);
reg('government','food_crisis',
  { position:  'Holds the seat while the food runs short; how the hunger ends will decide whether the seat is kept.',
    goal:      'Get food to every door before a rival for the seat does it first.',
    constraint:'Cannot hand out food that is not there, and cannot say how short it is without frightening people further.' },
  { position:  'Holds an office that is blamed for the shortage but has little say over the food.',
    goal:      'Be seen handing out what little there is, and let the blame for the rest go upward.',
    constraint:'Being seen to work hard while the food stays short only spreads the blame.' }
);
reg('government','economic_stress',
  { position:  'Holds the seat while money is short, and people judge the seat by what it can no longer pay for.',
    goal:      'Win the people back with things that cost nothing: fair hearings and quick answers.',
    constraint:'Cannot pay for the repairs and relief people want without coin the place does not have.' },
  { position:  'Holds an office whose purse shrinks with everyone else\'s.',
    goal:      'Become the one person who signs off on every coin the seat still spends.',
    constraint:'Every office is after the same few coins; making this one needed means taking from the others.' }
);
reg('government','contested',
  { position:  'Holds the seat, but a rival claims it, and the matter is not settled.',
    goal:      'Win the doubters back before the challenger to the seat wins them first.',
    constraint:'Every hard move wins the rival new supporters; every delay gives the rival time.' },
  { position:  'Holds an office that hangs on a seat someone else is trying to take.',
    goal:      'Stay off both sides of the fight for the seat until it is plain who wins.',
    constraint:'Waiting to see who wins keeps the office safe today and earns no thanks from the winner.' }
);
reg('government','stable',
  { tags: CALM_ONLY, position:  'Holds the seat, and people accept it; there is room to act, not just to hold on.',
    goal:      "Find and mend the seat's weak spot before a rival finds it first.", // W3 POW (the owner's style law of 2026-11-07; STYLE-AUDIT #211): the CLAIMS 'current stability' row re-anchored
    constraint:'With nothing pressing, it is hard to win support for mending the weak spots before they break.' },
  { tags: CALM_ONLY, position:  'Holds an office that runs from day to day, with no crisis to answer.',
    goal:      'Do every task the seat hands them so well that the seat cannot do without them.',
    constraint:'Good work is expected and goes unnoticed; a mistake is remembered.' }
);

// ── military ──────────────────────────────────────────────────────────────────
reg('military',GOVERNANCE_FRACTURED,
  { position:  'Commands enforcement capacity where civilian governance is failing. The military\'s relationship with civilian authority is under pressure.',
    goal:      'Keep the people under their command together, whoever ends up giving the orders.',
    constraint:'Cannot act unilaterally to fill the governance vacuum without becoming a political actor in ways that compromise the institutional neutrality the role requires.' },
  { position:  'Commands a subordinate enforcement unit in a settlement where institutional authority is fragmented. Orders may be coming from multiple competing sources.',
    goal:      'Stop any faction buying their squad away from them while the seat is broken.',
    constraint:'Institutional loyalty in a fragmented governance environment requires active management that cannot be publicly acknowledged as such.' }
);
reg('military','corruption',
  { position:  'Leads enforcement in a settlement where criminal interests have arrangements with parts of the security apparatus.',
    goal:      'Find out which of their own officers are on the take, before the payers notice.',
    constraint:'Investigating the arrangements exposes the investigators to the same pressures that created them.' },
  { position:  'Commands a subordinate enforcement unit inside a structure where corruption is known to have reached some levels.',
    goal:      'Keep their own hands clean without catching the eye of the bribers or the inquiry.',
    constraint:'Visibility in either direction (too compliant or too resistant) creates risk the unit cannot currently afford.' }
);
reg('military','food_crisis',
  { position:  'Responsible for public order during supply failure: the conditions that most reliably produce civil disorder are currently present.',
    goal:      'Keep the hungry from rioting without striking anyone the crowd will remember.',
    constraint:'Enforcement sufficient to prevent disorder may be enforcement sufficient to generate resentment. The threshold is not visible in advance.' },
  { position:  'Commands a subordinate enforcement unit during a supply crisis. Responsible for a sector where the pressure is acutely felt.',
    goal:      'Hold their patch quiet with too few hands, and start no fight they cannot finish.',
    constraint:'The resources available are not sufficient for the conditions present. Performance is being evaluated against a standard the conditions make unachievable.' }
);
reg('military','economic_stress',
  { position:  'Maintains order in a settlement under economic pressure, where enforcement is more necessary and less funded than at other times.',
    goal:      'Be seen enough to stop trouble, and not so much that people start to hate them.',
    constraint:'Underfunding of enforcement is itself a product of the economic conditions that make enforcement more necessary.' },
  { position:  'Commands a subordinate enforcement unit in an economically stressed settlement where unit resources, morale, and staffing are all under pressure.',
    goal:      'Hide how short of pay and gear their squad has become before someone tests it.',
    constraint:'Visible deterioration invites exactly the disorder it signals the inability to contain.' }
);
reg('military','contested',
  { position:  'Commands enforcement in a settlement where competing political claims create pressure on the loyalty of the security forces.',
    goal:      'Keep everyone under their command out of the fight for the seat until it is settled.',
    constraint:'Both sides of the contest want enforcement on their side. Neutrality requires active management that cannot be acknowledged publicly.' },
  { position:  'Leads a subordinate enforcement unit whose institutional loyalties are being tested by the political contest above it.',
    goal:      'Stop their squad splitting into two camps before the fight for the seat is over.',
    constraint:'Unit members have personal loyalties that do not necessarily align with institutional neutrality.' }
);
reg('military','stable',
  { tags: CALM_ONLY, position:  'Commands enforcement in a well-ordered settlement. The role is preventive rather than responsive, and authority derives from institutional legitimacy.',
    goal:      'Keep the drills, the patrols and the pay going, and the old hands in charge of them.',
    constraint:'Stable conditions make it harder to justify the resources and authority that would be needed if conditions changed.' },
  { tags: CALM_ONLY, position:  'Leads a subordinate enforcement unit in a stable settlement. The role is routine, the risks are low, and advancement requires distinguishing the unit in conditions that offer few distinctions.',
    goal:      'Get their squad noticed for doing the dull work well, and earn a patron by it.',
    constraint:'Routine excellence is expected and unremarkable; meaningful advancement requires either a crisis or a patron.' }
);

// ── economy / crafts ──────────────────────────────────────────────────────────
for (const cat of ['economy','crafts']) {
reg(cat,GOVERNANCE_FRACTURED,
  { position:  'Controls organized commercial infrastructure in a settlement where governance is failing. Economic institutions are currently more functional than civic ones.',
    goal:      'Get their trade\'s new freedoms written down before whoever takes the seat next takes them back.',
    constraint:'Formalizing commercial independence too visibly invites a reconsolidated governing authority to treat it as a threat rather than an asset.' },
  { position:  'Operates commercial interests from a position secondary to the dominant commercial faction in a settlement with failing governance.',
    goal:      'Take customers from the biggest house in the trade while the seat is too weak to care.',
    constraint:'The governance instability that creates opportunity also creates uncertainty. The same conditions that allow advancement can reverse it.' }
);
reg(cat,'corruption',
  { position:  'Operates in a commercial environment where criminal interests have informal arrangements with enforcement. The line between legitimate and accommodated commerce is blurred.',
    goal:      'Keep trading without paying the gangs, and without needing their protection either.',
    constraint:'The informal arrangements with enforcement make legitimate commerce partially reliant on the same corruption it must avoid.' },
  { position:  'Operates smaller commercial interests within a commercial environment compromised by criminal accommodation.',
    goal:      'Be known as the honest dealer without the crooks deciding to make an example of them.',
    constraint:'Visible distinction from the corruption draws attention; accommodation normalizes it. Neither option is cost-free.' }
);
reg(cat,'food_crisis',
  { position:  'Controls distribution infrastructure for a critical resource at a moment when that resource is in shortage. The position carries unusual leverage and unusual risk.',
    goal:      'Sell what food they hold at a price nobody will hold against them after the shortage.',
    constraint:'Any pricing or allocation decision during a shortage is a political act, regardless of intent.' },
  { position:  'Operates commercial interests in a supply crisis from a position without control over the primary distribution channel.',
    goal:      'Find something else to sell while the food runs short and the big dealers hold it.',
    constraint:'Alternative commercial positions during a supply crisis are defined by what the crisis displaces. The opportunity and the instability are the same thing.' }
);
reg(cat,'economic_stress',
  { position:  'Operates in a settlement under persistent economic pressure. The commercial position is maintained but not growing.',
    goal:      'Work out which buyers will still pay next year, and drop the rest before they drag them down.',
    constraint:'Selective consolidation requires visibly abandoning some positions, creating vulnerability in the ones being retained.' },
  { position:  'Operates smaller commercial interests in an economically stressed settlement where consolidation by larger commercial interests reduces operational space.',
    goal:      'Find the small trade the big houses will not bother to fight them for.',
    constraint:'Niches that larger interests do not contest are typically ones with limited growth potential.' }
);
reg(cat,'contested',
  { position:  'Holds commercial structural influence in a settlement where governing authority is contested. Commercial interests are positioned to benefit from or be damaged by how the contest resolves.',
    goal:      'Lend to both sides of the fight for the seat, so whoever wins owes them.',
    constraint:'Cultivating relationships with both sides requires that neither side trusts you fully.' },
  { position:  'Operates commercial interests that are positioned between the competing factions in a contested settlement.',
    goal:      'Keep selling to every faction without any of them treating their goods as its own.',
    constraint:'Commercial neutrality looks like either timidity or calculation to the factions seeking commitment.' }
);
reg(cat,'stable',
  { tags: CALM_ONLY, position:  'Controls organized commercial infrastructure in a functioning settlement. The position is secure and the leverage is real.',
    goal:      'Turn their hold on the trade into a charter, a seat at the table, or a monopoly.',
    constraint:'Visible accumulation of institutional advantage invites regulatory and political attention.' },
  { tags: CALM_ONLY, position:  'Operates commercial interests in a stable settlement from a position secondary to the dominant commercial faction.',
    goal:      'Win more custom without treading on the biggest house in the trade.',
    constraint:'Growth that encroaches on the dominant interest\'s commercial territory invites a response; growth that doesn\'t stays marginal.' }
);
}

// ── religious ─────────────────────────────────────────────────────────────────
reg('religious',GOVERNANCE_FRACTURED,
  { position:  'Holds institutional religious authority in a settlement where civic governance is failing. Religious institutions often absorb civic functions when secular authority contracts.',
    goal:      'Settle the disputes the seat has stopped settling, in the faith\'s name, and keep doing it afterwards.',
    constraint:'Civic engagement that appears opportunistic risks being reversed by a reconsolidated authority that resents the encroachment.' },
  { position:  'Serves a religious position secondary to the dominant religious institution in a settlement with failing civic governance.',
    goal:      'Keep marrying, burying and comforting their flock while the seat fails around them.',
    constraint:'Pastoral relevance without institutional authority is difficult to convert into institutional standing when the governance reconsolidates.' }
);
reg('religious','corruption',
  { position:  'Holds institutional religious authority in a settlement where civic institutions are compromised. The church\'s moral authority depends on distance from the corruption.',
    goal:      'Keep the faith\'s name clean while every other office in the place takes payments.',
    constraint:'The institution depends on civic structures for land rights and legal standing. Complete separation from compromised institutions is unavailable.' },
  { position:  'Holds a religious position that must maintain pastoral credibility in a community aware of institutional corruption in the settlement\'s civic structures.',
    goal:      'Earn their flock\'s trust face to face, so it outlasts their trust in the crooked seat.',
    constraint:'Pastoral trust built in opposition to civic institutions is vulnerable to any reconsolidation that restores civic legitimacy.' }
);
reg('religious','food_crisis',
  { position:  'Leads a religious institution with direct welfare capacity during a supply crisis. Charitable infrastructure becomes a primary social stabilizer.',
    goal:      'Feed the hungry from the faith\'s stores, and make sure everyone knows who fed them.',
    constraint:'The institution\'s charitable capacity is finite; prioritizing distribution for institutional benefit rather than need creates the scandal that outlasts the crisis.' },
  { position:  'Serves a religious position with limited independent welfare capacity during a supply crisis.',
    goal:      'Get their own flock a share of whatever relief there is, and be thanked for it.',
    constraint:'Intermediary standing depends on the reliability of what is being intermediated: if the relief infrastructure fails, the position loses credibility along with it.' }
);
reg('religious','economic_stress',
  { position:  'Holds religious authority in a settlement under economic pressure. The church\'s land holdings and endowments are both assets and targets.',
    goal:      'Keep the faith\'s lands and coin intact without looking rich while the people go short.',
    constraint:'Any use of institutional resources to protect institutional interests during population-level hardship is visible.' },
  { position:  'Holds a religious position secondary to the dominant institution in an economically stressed settlement where religious endowment is under pressure.',
    goal:      'Keep their small charge going on half the alms and none of the help.',
    constraint:'Reduced resources reduce the pastoral capacity that justifies the position\'s existence.' }
);
reg('religious','contested',
  { position:  'Holds institutional religious authority during political contestation. Both sides of a political contest typically want clerical endorsement.',
    goal:      'Give no blessing to either claimant until it is plain which one will hold the seat.',
    constraint:'The longer neutrality is maintained, the less valuable the eventual endorsement becomes.' },
  { position:  'Serves a religious position under the dominant religious institution during political contestation.',
    goal:      'Back whichever claimant their superiors bless, and be seen to have waited for the word.',
    constraint:'Following the institutional alignment requires having subordinated personal judgment to institutional authority. The cost is the same regardless of whether the alignment was correct.' }
);
reg('religious','stable',
  { tags: CALM_ONLY, position:  'Leads an established religious institution in a settlement with functional civic order.',
    goal:      'Keep the faith at every naming, wedding and burial, and out of the seat\'s quarrels.',
    constraint:'Institutional stability tends toward complacency. The challenges that would justify institutional expansion are currently absent.' },
  { tags: CALM_ONLY, position:  'Serves a religious position secondary to the dominant institution in a stable settlement.',
    goal:      'Serve their flock so faithfully that their superiors cannot pass them over again.',
    constraint:'Excellence within the dominant institution\'s frame does not distinguish the position; deviation from it invites institutional friction.' }
);

// ── criminal ──────────────────────────────────────────────────────────────────
reg('criminal',GOVERNANCE_FRACTURED,
  { position:  'Operates criminal interests in a settlement where governance is failing. A governance vacuum is the optimal environment for criminal operations to expand.',
    goal:      'Take over whatever the seat has stopped watching, and dig in before it recovers.',
    constraint:'Expanding too visibly during governance failure risks triggering a consolidation response specifically aimed at criminal interests.' },
  { position:  'Operates within a criminal network as a position secondary to the dominant criminal interest in a settlement with failing governance.',
    goal:      'Climb over the boss\'s other lieutenants while nobody is enforcing anything.',
    constraint:'Advancement within the hierarchy requires either demonstrating value to it or demonstrating threat to it. Both are visible to the hierarchy.' }
);
reg('criminal','corruption',
  { position:  'Has arrangements with enforcement that create unusual operational freedom. The position depends on those arrangements remaining stable.',
    goal:      'Keep the bribed officials paid and quiet, and keep proof of every payment in case they turn.',
    constraint:'The arrangements are known to multiple parties. They are leverage over the operation as much as they are protection for it.' },
  { position:  'Operates a position within a criminal network that benefits from the network\'s enforcement arrangements without being the architect of them.',
    goal:      'Use the bought protection while it lasts, and have a way out when it ends.',
    constraint:'Operational independence from the arrangements while continuing to benefit from them requires a position the network may not tolerate.' }
);
reg('criminal','food_crisis',
  { position:  'Controls informal distribution channels for goods that are in shortage. Supply crises create extraordinary criminal economic opportunity.',
    goal:      'Sell food on the side at hungry prices, without becoming the face of the shortage.',
    constraint:'Visible profiteering during a population-level crisis creates the moral clarity that even compromised enforcement cannot ignore.' },
  { position:  'Operates a secondary position in a criminal network that is expanding into supply crisis opportunity.',
    goal:      'Get a cut of the black-market food before the boss shuts everyone else out.',
    constraint:'Securing that role requires either offering something the dominant interest needs or accepting a subordinate position that leaves future leverage limited.' }
);
reg('criminal','economic_stress',
  { position:  'Operates in an economically pressured settlement where desperation expands the pool accessible to criminal recruitment and exploitation.',
    goal:      'Sign up the desperate while they are cheap, and keep them once times get better.',
    constraint:'Operations built on desperation are vulnerable to improvement in the economic conditions that created them.' },
  { position:  'Holds a secondary position in a criminal network operating in an economically stressed settlement.',
    goal:      'Make themselves worth keeping to the crew for reasons that will survive good times.',
    constraint:'A stable position within the network requires demonstrated value that survives changing conditions. This is harder to demonstrate during the conditions themselves.' }
);
reg('criminal','contested',
  { position:  'Operates criminal interests in a contested political environment where enforcement attention is distracted.',
    goal:      'Move into new rackets while the claimants to the seat are busy with each other.',
    constraint:'Both sides of a political contest may attempt to use criminal enforcement as a tool against the other. The current operational freedom is unpredictable.' },
  { position:  'Holds a position within a criminal network that is attempting to expand during political contestation.',
    goal:      'Grab their own share of the crew\'s new ground, so they keep it if the push fails.',
    constraint:'Network position consolidated during an expansion that fails is exposed when the network contracts.' }
);
reg('criminal','stable',
  { tags: CALM_ONLY, position:  'Operates within a well-ordered settlement where enforcement is functional and operational space is defined by what enforcement chooses not to pursue.',
    goal:      'Keep the rackets small and steady enough that the law never bothers to look.',
    constraint:'Sustained operational success below the enforcement threshold makes the operation visible to those who look for the threshold.' },
  { tags: CALM_ONLY, position:  'Holds a secondary position in a criminal network operating in a settled environment with functional enforcement.',
    goal:      'Prove to the boss they can be trusted with more, without the law learning their name.',
    constraint:'Advancement within the network requires demonstrating capacity. Demonstration is visibility.' }
);

// ── magic ─────────────────────────────────────────────────────────────────────
reg('magic',GOVERNANCE_FRACTURED,
  { position:  'Holds arcane institutional authority in a settlement with failing civic governance. Arcane services may hold leverage if structurally necessary.',
    goal:      'Turn every favour the seat now begs of their spells into a right it cannot take back.',
    constraint:'Arcane authority claimed during a governance crisis is typically the first thing a reconsolidated government constrains.' },
  { position:  'Practices arcane arts in a secondary institutional position in a settlement with failing governance.',
    goal:      'Keep working spells for anyone who pays while refusing to be counted on any side.',
    constraint:'Neutrality in a crisis that affects all institutions is difficult to sustain without appearing to have calculated it.' }
);
reg('magic','corruption',
  { position:  'Maintains arcane operations in a settlement with compromised institutions. Arcane services used for concealment create leverage and obligation.',
    goal:      'Stop casting concealments for the crooks before the crooks own them outright.',
    constraint:'Arcane services used for concealment create relationships that are difficult to exit.' },
  { position:  'Practices arcane arts in a position secondary to the dominant arcane institution in a compromised institutional environment.',
    goal:      'Take the spellwork their seniors turn down, and ask no questions about why it was refused.',
    constraint:'Services not dominated by the primary institution tend to be those the primary institution has declined: often for reasons.' }
);
reg('magic','food_crisis',
  { position:  'Holds arcane institutional authority in a supply crisis. Magical production or preservation capacity, if available, becomes a critical resource.',
    goal:      'Save what food magic can save, and make the seat pay for it in rights.',
    constraint:'Arcane solutions to supply crises create expectations that cannot be sustained indefinitely.' },
  { position:  'Practices arcane arts in a position that could contribute to crisis response but lacks the institutional authority to deploy independently.',
    goal:      'Offer their spells for the shortage through their seniors, and see their own name on it.',
    constraint:'Contributing through channels that constrain the contribution limits both the impact and the credit.' }
);
reg('magic','economic_stress',
  { position:  'Maintains arcane institutional operations in an economically pressured settlement. Arcane services are among the first to face budget reduction.',
    goal:      'Work out which spells people will still pay for when the coin runs short, and keep those.',
    constraint:'Demonstrating indispensability may require deploying services in ways that reduce their scarcity and therefore their leverage.' },
  { position:  'Practices arcane arts in a secondary institutional position in an economically pressured settlement where arcane patronage is declining.',
    goal:      'Find the plain, needed spellwork that people buy even when they buy nothing else.',
    constraint:'Necessity-level arcane services are typically lower-status and lower-compensation than the services economic pressure eliminates.' }
);
reg('magic','contested',
  { position:  'Holds arcane authority in a contested political environment. Arcane capacity is a resource both sides want access to.',
    goal:      'Refuse every claimant who wants their spells, so whoever takes the seat cannot call them traitors.',
    constraint:'Maintaining neutrality requires declining requests from both sides, which generates resentment from both.' },
  { position:  'Practices arcane arts in a secondary position in a contested political environment.',
    goal:      'Be useful to whoever wins the seat, and promise nothing to anyone before then.',
    constraint:'Value to multiple competing factions requires keeping the scope of arcane services narrow enough that none of them perceive a conflict of interest.' }
);
reg('magic','stable',
  { tags: CALM_ONLY, position:  'Leads established arcane institutions in a functional settlement. The position is secure, the services are in demand.',
    goal:      'Win more of the seat\'s work for their spells, and more of everyone else\'s.',
    constraint:'Arcane authority in stable conditions faces gradual bureaucratic containment. Institutionalization brings limits alongside legitimacy.' },
  { tags: CALM_ONLY, position:  'Practices arcane arts in a secondary institutional position in a stable settlement.',
    goal:      'Become the caster people ask for by name, whatever their seniors think of them.',
    constraint:'Practical standing without institutional authority is vulnerable to institutional decisions about who is permitted to practice.' }
);

// ── other (noble, etc.) ───────────────────────────────────────────────────────
reg('other',GOVERNANCE_FRACTURED,
  { position:  'Holds hereditary or traditional status in a settlement where formal governance is under pressure. Traditional authority often gains relative standing when formal authority loses it.',
    goal:      'Take back the old family rights the seat stripped away, while it is too weak to refuse.',
    constraint:'Traditional claims that would have been dismissed under stable governance invite more scrutiny under conditions where everyone is watching for illegitimate power grabs.' },
  { position:  'Holds traditional status secondary to the dominant traditional interest in a settlement with failing governance.',
    goal:      'Catch up with the greater family while the seat is too busy to keep them apart.',
    constraint:'Advancing relative to the dominant traditional interest during a crisis positions the advance as opportunistic rather than earned.' }
);
reg('other','stable',
  { tags: CALM_ONLY, position:  'Holds traditional or hereditary status in a stable settlement where institutional competition constrains traditional influence.',
    goal:      'Keep the family\'s name honoured at every feast while the new offices take its old work.',
    constraint:'Traditional authority in stable conditions is in slow structural decline relative to institutional authority.' },
  { tags: CALM_ONLY, position:  'Holds a secondary traditional or hereditary position in a stable settlement.',
    goal:      'Marry, lend or befriend their way into the offices that now run things.',
    constraint:'Usefulness to institutional actors defines the scope of permitted influence, not the traditional claim itself.' }
);
// Fill remaining conditions for 'other' with stable variants
for (const cond of ['corruption','food_crisis','economic_stress','contested']) {
  if (!T[`other__${cond}__dominant`]) {
    T[`other__${cond}__dominant`]    = T[OTHER_STABLE_DOMINANT];
    T[`other__${cond}__subordinate`] = T['other__stable__subordinate'];
  }
}

// ── Score NPCs by power relevance ─────────────────────────────────────────────
// The people car (PEOPLE-2 CAST-DERIVED): the significant NPCs are the powers' own people, the
// heads first, then the inner circles, each by their first-rank power's figure — so the TOP_N who
// carry a structural template are the heads of the strongest powers, not whichever members of the
// strongest power the roster lists first (every member of a power shares its figure).
const STANDING_WEIGHT = Object.freeze({ [STANDING.head]: 1000, [STANDING.inner]: 500 });
function npcRelevanceScore(npc, powerFactions, standing) {
  const fac = powerFactions.find(f => f.faction === standing.power);
  let score = (STANDING_WEIGHT[standing.standing] || 0) + (fac?.power || 0);
  const role = (npc.role || '').toLowerCase();
  if (role.includes('mayor') || role.includes('governor') || role.includes('elder')) score += 25;
  if (role.includes('captain') || role.includes('commander'))                        score += 15;
  if (role.includes('merchant') || role.includes('guild master'))                    score += 12;
  if (role.includes('priest') || role.includes('bishop'))                            score += 10;
  return score;
}

// ── Main export ────────────────────────────────────────────────────────────────
export function enrichNPCsWithStructure(npcs, settlement) {
  if (!npcs?.length) return npcs;

  const powerFactions   = settlement.powerStructure?.factions || [];
  const condition       = getPrimaryCondition(settlement);
  const TOP_N           = Math.min(5, Math.max(2, Math.floor(npcs.length * 0.45)));
  /** @type {ReturnType<typeof factsOf> | null} */
  let facts = null;

  const powerOrder      = powerOrderOf(settlement);
  // the card's standing in its first-rank power (the people car): every card carries it
  const scored = npcs.map(n => {
    const standing = structuralStandingOf(n, powerOrder);
    return { npc: n, standing, score: npcRelevanceScore(n, powerFactions, standing) };
  }).sort((a,b) => b.score - a.score);
  // REVIEW-INTAKE-4: the roster's goals as they stand (in scored order). A template goal another
  // figure already carries is refused and the figure keeps its own goal; its structural position
  // and constraint are still its situation's. Draw-free.
  const goalsNow = scored.map(({ npc }) => npc?.goal?.short);

  return scored.map(({ npc, standing }, idx) => {
    if (idx >= TOP_N) return { ...npc, structuralRank: standing.standing };

    const cat  = npc.category || 'other';
    const rank = getRank(standing, powerFactions);
    const key  = `${cat}__${condition}__${rank}`;
    const looked = T[key] ? key : T[`${cat}__stable__${rank}`] ? `${cat}__stable__${rank}` : OTHER_STABLE_DOMINANT;
    // ⭐ CENSUS-1d unit 2 (the chair's R-A ruling of 2026-11-05 02:30; Appendix B item 3, kind T):
    // the registry entry is resolved through `resolveDeclared` against the record's `factsOf`
    // (CENSUS-4b's `tags`: the stable entries are CALM_ONLY, `no crisis`). A refused entry is
    // not applied: the NPC keeps its own role goal and carries no structural position that claims
    // a calm the record denies (4b's measurement: the slot never empties, so no twin is owed).
    const tmpl = T[looked]
      ? resolveDeclared(T[looked], { facts: facts ??= factsOf(settlement), tagged: true, poolId: `NPC_STRUCTURE.${looked}`, surface: 'npcs' }).line
      : null;

    if (!tmpl) return { ...npc, structuralRank: standing.standing };

    // activeGoal replaces goal.short on enriched NPCs so the DM sees one coherent goal.
    // The settlement-derived goal is more specific than the generic role goal.
    const held = heldByOthers(goalsNow, idx).has(String(lineText(tmpl.goal) ?? '').trim()); // REVIEW-INTAKE-4 + MERGE-R2: the held test reads the text the record stores
    const updatedGoal = held
      ? npc.goal
      : npc.goal
        ? { ...npc.goal, short: lineText(tmpl.goal) }
        : { short: lineText(tmpl.goal), long: lineText(tmpl.goal) }; // CENSUS-1e: a field may become `{ text, … }` (R-C); the record stores the text
    goalsNow[idx] = updatedGoal?.short;

    return {
      ...npc,
      goal:               updatedGoal,
      structuralPosition: lineText(tmpl.position),
      activeConstraint:   lineText(tmpl.constraint),
      settlementCondition: condition,
      structuralRank:     standing.standing,
    };
  });
}
