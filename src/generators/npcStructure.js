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
// SW-6 second seat (B10(b)): the armed seat-holders in plain words, the machinery struck; the goals untouched.
reg('military',GOVERNANCE_FRACTURED,
  { position:  'Commands those under arms while the seat loses its hold; whoever gives the orders next will want them.',
    goal:      'Keep the people under their command together, whoever ends up giving the orders.',
    constraint:'Cannot step in to keep order without taking a side in the fight over the seat.' },
  { position:  'Leads a squad that now takes orders from more than one master.',
    goal:      'Stop any power buying their squad away from them while the seat is broken.',
    constraint:'Keeping the squad in hand takes quiet favours that no one can be told about.' }
);
reg('military','corruption',
  { position:  'Commands those under arms while criminals pay some of the people in their ranks.',
    goal:      'Find out which of their own officers are on the take, before the payers notice.',
    constraint:'Anyone sent to look into the payments is offered the same coin.' },
  { position:  'Leads a squad in a force where some officers are known to take bribes.',
    goal:      'Keep their own hands clean without catching the eye of the bribers or the inquiry.',
    constraint:'Going along too easily or pushing back too hard both draw notice the squad cannot afford.' }
);
reg('military','food_crisis',
  { position:  'Keeps order while the food runs short, when hungry crowds are quickest to riot.',
    goal:      'Keep the hungry from rioting without striking anyone the crowd will remember.',
    constraint:'Enough force to stop a riot can be enough to start the next, and nobody knows beforehand how much is too much.' },
  { position:  'Leads a squad that keeps order among people who are going hungry.',
    goal:      'Hold their patch quiet with too few hands, and start no fight they cannot finish.',
    constraint:'Has too few hands for the work, and is judged as though it had enough.' }
);
reg('military','economic_stress',
  { position:  'Keeps order while money is short, when trouble grows and the pay for stopping it shrinks.',
    goal:      'Be seen enough to stop trouble, and not so much that people start to hate them.',
    constraint:'The same lack of coin that stirs the trouble cuts the pay of those sent to stop it.' },
  { position:  'Leads a squad that is short of pay, gear and hands.',
    goal:      'Hide how short of pay and gear their squad has become before someone tests it.',
    constraint:'If anyone sees how thin the squad has worn, they will test it.' }
);
reg('military','contested',
  { position:  'Commands those under arms while rivals fight over the seat, and each side wants them.',
    goal:      'Keep everyone under their command out of the fight for the seat until it is settled.',
    constraint:'Keeping those under arms out of the fight takes quiet work that cannot be owned in public.' },
  { position:  'Leads a squad whose members are being pulled toward one side or the other in the fight for the seat.',
    goal:      'Stop their squad splitting into two camps before the fight for the seat is over.',
    constraint:'Some of the squad have loyalties of their own, and they do not all point the same way.' }
);
reg('military','stable',
  { tags: CALM_ONLY, position:  'Commands those under arms in quiet times; the work is keeping trouble from starting.',
    goal:      'Keep the drills, the patrols and the pay going, and the old hands in charge of them.',
    constraint:'With nothing threatening, it is hard to win the coin and the say that would be needed if trouble came.' },
  { tags: CALM_ONLY, position:  'Leads a squad in quiet times, where the work is routine and the risks are low.',
    goal:      'Get their squad noticed for doing the dull work well, and earn a patron by it.',
    constraint:'Steady work earns no notice; getting ahead takes a crisis or a patron.' }
);

// ── economy / crafts ──────────────────────────────────────────────────────────
for (const cat of ['economy','crafts']) {
// SW-6 second seat (B10(b)): the trade's seat-holders in plain words, the machinery struck; the goals untouched.
reg(cat,GOVERNANCE_FRACTURED,
  { position:  'Heads the leading house in the trade while the seat fails; deals still get done where orders do not.',
    goal:      'Get their trade\'s new freedoms written down before whoever takes the seat next takes them back.',
    constraint:'Taking new freedoms too openly makes whoever next holds the seat see the house as a threat.' },
  { position:  'Runs a smaller house behind the leading one in the trade while the seat fails.',
    goal:      'Take customers from the biggest house in the trade while the seat is too weak to care.',
    constraint:'The disorder that lets the house get ahead can just as quickly knock it back.' }
);
reg(cat,'corruption',
  { position:  'Heads the leading house in the trade where criminals have deals with those who keep order; honest and protected business are hard to tell apart.',
    goal:      'Keep trading without paying the gangs, and without needing their protection either.',
    constraint:'Some of the trade\'s own dealings lean on the same bought officials it must keep clear of.' },
  { position:  'Runs a smaller house in a trade where many pay the criminals to be left alone.',
    goal:      'Be known as the honest dealer without the crooks deciding to make an example of them.',
    constraint:'Standing apart from the crooked dealing draws the crooks\' eye; going along makes it everyone\'s habit.' }
);
reg(cat,'food_crisis',
  { position:  'Heads the leading house in the trade while food is short; what it sells, and to whom, is now watched.',
    goal:      'Sell what food they hold at a price nobody will hold against them after the shortage.',
    constraint:'Every price it sets during the shortage is taken as a side chosen, whatever was meant.' },
  { position:  'Runs a smaller house in the trade while food is short, with no hand in who gets the food.',
    goal:      'Find something else to sell while the food runs short and the big dealers hold it.',
    constraint:'What can be sold now depends on what the shortage has pushed aside, and that can change overnight.' }
);
reg(cat,'economic_stress',
  { position:  'Heads the leading house in the trade while money is short; it holds on, but does not grow.',
    goal:      'Work out which buyers will still pay next year, and drop the rest before they drag them down.',
    constraint:'Keeping the best buyers means dropping others in plain view, and rivals notice the gaps.' },
  { position:  'Runs a smaller house while money is short and the bigger houses take more of the trade.',
    goal:      'Find the small trade the big houses will not bother to fight them for.',
    constraint:'The work the big houses leave alone is the work that pays least.' }
);
reg(cat,'contested',
  { position:  'Heads the leading house in the trade while rivals fight over the seat; whoever wins can make or break it.',
    goal:      'Lend to both sides of the fight for the seat, so whoever wins owes them.',
    constraint:'Keeping friends on both sides means neither side fully trusts the house.' },
  { position:  'Runs a smaller house that sells to both sides in the fight for the seat.',
    goal:      'Keep selling to every power without any of them treating their goods as its own.',
    constraint:'To both sides, staying out of it looks like fear or scheming.' }
);
reg(cat,'stable',
  { tags: CALM_ONLY, position:  'Heads the leading house in the trade in quiet times; its hold is secure and its say is real.',
    goal:      'Turn their hold on the trade into a charter, a seat at the table, or a monopoly.',
    constraint:'Every new privilege it gathers in plain sight draws the eye of the seat and of its rivals.' },
  { tags: CALM_ONLY, position:  'Runs a smaller house behind the leading one in quiet times.',
    goal:      'Win more custom without treading on the biggest house in the trade.',
    constraint:'Growing into the leading house\'s trade invites a reply; staying out of it means staying small.' }
);
}

// ── religious ─────────────────────────────────────────────────────────────────
// SW-6 second seat (B10(b)): the faith's seat-holders in plain words, the machinery struck; the goals untouched.
reg('religious',GOVERNANCE_FRACTURED,
  { position:  'Leads the faith while the seat fails, and people bring it the quarrels the seat no longer settles.',
    goal:      'Settle the disputes the seat has stopped settling, in the faith\'s name, and keep doing it afterwards.',
    constraint:'Whatever the faith takes on now, whoever next holds the seat firmly may resent and take back.' },
  { position:  'Serves the faith under its leaders while the seat fails around them.',
    goal:      'Keep marrying, burying and comforting their flock while the seat fails around them.',
    constraint:'The flock\'s trust is easy to earn now, but it buys no say once someone holds the seat firmly again.' }
);
reg('religious','corruption',
  { position:  'Leads the faith among officials who take bribes; its good name rests on keeping clear of them.',
    goal:      'Keep the faith\'s name clean while every other office in the place takes payments.',
    constraint:'The faith still needs those same officials for its lands and its rights, so it cannot cut them off.' },
  { position:  'Serves the faith among people who know their officials take bribes.',
    goal:      'Earn their flock\'s trust face to face, so it outlasts their trust in the crooked seat.',
    constraint:'Trust won by standing against the crooked officials can fade once honest ones return.' }
);
reg('religious','food_crisis',
  { position:  'Leads the faith while the food runs short, and its alms are among the few things holding people together.',
    goal:      'Feed the hungry from the faith\'s stores, and make sure everyone knows who fed them.',
    constraint:'The faith\'s stores will run out; feeding its own first, or for show, would be a scandal remembered long after the hunger.' },
  { position:  'Serves the faith with little of its own to give while the food runs short.',
    goal:      'Get their own flock a share of whatever relief there is, and be thanked for it.',
    constraint:'Its standing rests on the relief it passes on; if the relief fails, the blame falls on it too.' }
);
reg('religious','economic_stress',
  { position:  'Leads the faith while money is short; its lands and alms are both a help and a target.',
    goal:      'Keep the faith\'s lands and coin intact without looking rich while the people go short.',
    constraint:'Anything it does to guard its own wealth while people go short is seen by all.' },
  { position:  'Serves the faith on shrinking alms while money is short.',
    goal:      'Keep their small charge going on half the alms and none of the help.',
    constraint:'With less to give, there is less reason for the post to exist.' }
);
reg('religious','contested',
  { position:  'Leads the faith while rivals fight over the seat, and both sides want its blessing.',
    goal:      'Give no blessing to either claimant until it is plain which one will hold the seat.',
    constraint:'The longer it waits to bless one side, the less the blessing will be worth.' },
  { position:  'Serves the faith under its leaders while rivals fight over the seat.',
    goal:      'Back whichever claimant their superiors bless, and be seen to have waited for the word.',
    constraint:'Following the leaders\' choice means setting aside one\'s own judgment, and paying for it whether they chose well or not.' }
);
reg('religious','stable',
  { tags: CALM_ONLY, position:  'Leads the faith in quiet times, at peace with the seat beside it.',
    goal:      'Keep the faith at every naming, wedding and burial, and out of the seat\'s quarrels.',
    constraint:'With nothing pressing, it is easy to grow comfortable and hard to argue for growing.' },
  { tags: CALM_ONLY, position:  'Serves the faith under its leaders in quiet times.',
    goal:      'Serve their flock so faithfully that their superiors cannot pass them over again.',
    constraint:'Doing the work well, the leaders\' way, goes unnoticed; doing it another way brings trouble.' }
);

// ── criminal ──────────────────────────────────────────────────────────────────
// SW-6 second seat (B10(b)): the crews' seat-holders in plain words, the machinery struck; the goals untouched.
reg('criminal',GOVERNANCE_FRACTURED,
  { position:  'Heads the leading crew while the seat fails; whatever the seat stops watching is there to take.',
    goal:      'Take over whatever the seat has stopped watching, and dig in before it recovers.',
    constraint:'Growing too openly now may make the crew the first thing a recovered seat goes after.' },
  { position:  'Holds a place under the crew\'s boss while the seat fails.',
    goal:      'Climb over the boss\'s other lieutenants while nobody is enforcing anything.',
    constraint:'Climbing means being worth more to the boss or being more of a danger, and the boss can see both.' }
);
reg('criminal','corruption',
  { position:  'Heads the crew that has bought some of those who keep order, and works freely while they stay bought.',
    goal:      'Keep the bribed officials paid and quiet, and keep proof of every payment in case they turn.',
    constraint:'Too many people know about the payments; they hold the crew as much as they shield it.' },
  { position:  'Holds a place in a crew that has bought protection, without having arranged it.',
    goal:      'Use the bought protection while it lasts, and have a way out when it ends.',
    constraint:'Living off the bought protection while keeping clear of it is a balance the crew may not allow.' }
);
reg('criminal','food_crisis',
  { position:  'Heads the crew that moves goods on the side while food is short, and the shortage pays well.',
    goal:      'Sell food on the side at hungry prices, without becoming the face of the shortage.',
    constraint:'Open profit from the hunger makes the crew a target even the bought officials cannot ignore.' },
  { position:  'Holds a place in a crew that is moving into the black-market food trade.',
    goal:      'Get a cut of the black-market food before the boss shuts everyone else out.',
    constraint:'A share of it means offering the boss something needed, or taking a small part and no say later.' }
);
reg('criminal','economic_stress',
  { position:  'Heads the crew while money is short, and desperate people are easy to recruit and use.',
    goal:      'Sign up the desperate while they are cheap, and keep them once times get better.',
    constraint:'A crew built on desperation shrinks when times get better.' },
  { position:  'Holds a place in a crew while money is short.',
    goal:      'Make themselves worth keeping to the crew for reasons that will survive good times.',
    constraint:'Staying worth keeping means showing a value that will last, which is hard to show in the middle of hard times.' }
);
reg('criminal','contested',
  { position:  'Heads the crew while rivals fight over the seat and those who keep order look elsewhere.',
    goal:      'Move into new rackets while the claimants to the seat are busy with each other.',
    constraint:'Either side may turn on the crew to hurt the other, so today\'s freedom could end without warning.' },
  { position:  'Holds a place in a crew that is pushing into new ground while the seat is fought over.',
    goal:      'Grab their own share of the crew\'s new ground, so they keep it if the push fails.',
    constraint:'Ground taken in a push that fails is the first to be lost when the crew pulls back.' }
);
reg('criminal','stable',
  { tags: CALM_ONLY, position:  'Heads the crew in quiet times, working only where those who keep order choose not to look.',
    goal:      'Keep the rackets small and steady enough that the law never bothers to look.',
    constraint:'Staying just under notice for too long draws the eye of anyone who looks for exactly that.' },
  { tags: CALM_ONLY, position:  'Holds a place in a crew in quiet times, with order well kept around it.',
    goal:      'Prove to the boss they can be trusted with more, without the law learning their name.',
    constraint:'Getting ahead in the crew means showing what one can do, and showing it is how one gets noticed.' }
);

// ── magic ─────────────────────────────────────────────────────────────────────
// SW-6 second seat (B10(b)): the casters' seat-holders in plain words, the machinery struck; the goals untouched.
reg('magic',GOVERNANCE_FRACTURED,
  { position:  'Heads the casters while the seat fails; if the seat needs their spells, it now owes them.',
    goal:      'Turn every favour the seat now begs of their spells into a right it cannot take back.',
    constraint:'Rights won from a weak seat are the first a recovered seat takes back.' },
  { position:  'Works spells under the senior casters while the seat fails.',
    goal:      'Keep working spells for anyone who pays while refusing to be counted on any side.',
    constraint:'Staying on no side while everyone suffers is hard to do without looking like a calculation.' }
);
reg('magic','corruption',
  { position:  'Heads the casters among bribe-taking officials, where spells that hide things buy favour and debt.',
    goal:      'Stop casting concealments for the crooks before the crooks own them outright.',
    constraint:'Once their spells have hidden someone\'s dealings, getting free of those people is hard.' },
  { position:  'Works spells under the senior casters, among officials who take bribes.',
    goal:      'Take the spellwork their seniors turn down, and ask no questions about why it was refused.',
    constraint:'The work the seniors turn down is often turned down for a reason.' }
);
reg('magic','food_crisis',
  { position:  'Heads the casters while food is short, and any spell that grows or keeps food is suddenly worth a great deal.',
    goal:      'Save what food magic can save, and make the seat pay for it in rights.',
    constraint:'People fed by spells once will expect it again, and it cannot go on for ever.' },
  { position:  'Works spells that could help with the shortage, but cannot use them without the seniors\' leave.',
    goal:      'Offer their spells for the shortage through their seniors, and see their own name on it.',
    constraint:'Helping through the seniors limits both what the help can do and who gets the credit.' }
);
reg('magic','economic_stress',
  { position:  'Heads the casters while money is short, and spellwork is among the first things people stop paying for.',
    goal:      'Work out which spells people will still pay for when the coin runs short, and keep those.',
    constraint:'Proving the spells are needed may mean casting them so often that they lose their price.' },
  { position:  'Works spells under the senior casters while money is short and patrons drop away.',
    goal:      'Find the plain, needed spellwork that people buy even when they buy nothing else.',
    constraint:'The spells people still buy in hard times are the humble ones that pay least.' }
);
reg('magic','contested',
  { position:  'Heads the casters while rivals fight over the seat, and both sides want their spells.',
    goal:      'Refuse every claimant who wants their spells, so whoever takes the seat cannot call them traitors.',
    constraint:'Staying out of it means refusing both sides, and both will remember.' },
  { position:  'Works spells under the senior casters while rivals fight over the seat.',
    goal:      'Be useful to whoever wins the seat, and promise nothing to anyone before then.',
    constraint:'Serving more than one side means keeping the work small enough that none of them sees a betrayal.' }
);
reg('magic','stable',
  { tags: CALM_ONLY, position:  'Heads the casters in quiet times; their place is secure and their spells are in demand.',
    goal:      'Win more of the seat\'s work for their spells, and more of everyone else\'s.',
    constraint:'In quiet times the seat slowly hems the casters in with rules; recognition comes with limits.' },
  { tags: CALM_ONLY, position:  'Works spells under the senior casters in quiet times.',
    goal:      'Become the caster people ask for by name, whatever their seniors think of them.',
    constraint:'Skill without a senior post leaves the caster at the mercy of whoever decides who may cast.' }
);

// ── other (noble, etc.) ───────────────────────────────────────────────────────
// SW-6 second seat (B10(b)): the old families' seat-holders in plain words, the machinery struck; the goals untouched. The stable rows also serve the four conditions below, so they claim no calm of their own.
reg('other',GOVERNANCE_FRACTURED,
  { position:  'Heads an old family while the seat fails, and old names count for more when the seat counts for less.',
    goal:      'Take back the old family rights the seat stripped away, while it is too weak to refuse.',
    constraint:'Old claims that would once have been laughed off are now watched by everyone looking for a grab at power.' },
  { position:  'Belongs to a lesser family behind the leading one while the seat fails.',
    goal:      'Catch up with the greater family while the seat is too busy to keep them apart.',
    constraint:'Getting ahead of the greater family now will look like seizing a chance, not earning a place.' }
);
reg('other','stable',
  { tags: CALM_ONLY, position:  'Heads an old family while the seat\'s offices take up more of what the family once did.',
    goal:      'Keep the family\'s name honoured at every feast while the new offices take its old work.',
    constraint:'The family\'s say slowly shrinks beside the offices that run things.' },
  { tags: CALM_ONLY, position:  'Belongs to a lesser old family, behind the leading one.',
    goal:      'Marry, lend or befriend their way into the offices that now run things.',
    constraint:'The family has as much say as the offices find it useful to give, whatever its old claim.' }
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
