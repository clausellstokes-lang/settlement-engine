/**
 * npcStructure.js
 *
 * Derives structural position, active goal, and active constraint for
 * significant NPCs from the live settlement state.
 *
 * Two template axes:
 *   - condition: the most salient settlement pressure (6 states)
 *   - rank: whether this NPC is in the dominant faction or a subordinate one
 *     (prevents all government NPCs getting identical text in one settlement)
 *
 * activeGoal replaces the existing goal.short field on enriched NPCs so
 * the DM sees one coherent goal derived from the current situation.
 */

function getPrimaryCondition(settlement) {
  const leg     = settlement.powerStructure?.publicLegitimacy;
  const crimCap = settlement.powerStructure?.criminalCaptureState || 'none';
  const food    = settlement.economicState?.foodSecurity;
  const pros    = (settlement.economicState?.prosperity || '').toLowerCase();

  if (leg?.governanceFractured)                         return 'governance_fractured';
  if (crimCap === 'corrupted' || crimCap === 'capture') return 'corruption';
  const fl = (food?.label || '').toLowerCase();
  if (fl.includes('famine') || fl.includes('deficit'))  return 'food_crisis';
  if (pros.includes('struggling') || pros.includes('poor') || pros.includes('subsist')) return 'economic_stress';
  if (leg?.isContested)                                 return 'contested';
  return 'stable';
}

// rank: 'dominant' if NPC's faction is the highest-power faction of its type
//       'subordinate' if another faction of same or similar category has more power
function getRank(npc, allFactions) {
  const affil  = npc.factionAffiliation;
  const myFac  = allFactions.find(f => f.faction === affil);
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
// Abstract structural language only — no world facts.

const T = {};

// helper: register both ranks from a dominant template + a subordinate override
function reg(cat, cond, dom, sub) {
  T[`${cat}__${cond}__dominant`]    = dom;
  T[`${cat}__${cond}__subordinate`] = sub || {
    position:   dom.position.replace('Holds governing authority', 'Occupies a civic position')
                             .replace('Controls the primary', 'Manages a secondary')
                             .replace('Holds institutional', 'Represents an institutional'),
    goal:       `Maintain and advance the faction's position relative to the dominant authority — ${dom.goal.toLowerCase()}`,
    constraint: dom.constraint,
  };
}

// ── government ────────────────────────────────────────────────────────────────
reg('government','governance_fractured',
  { position:  'Holds nominal governing authority where the legitimacy of that position is in active question — formal title and real decision-making power are not the same thing.',
    goal:      'Restore enough perceived legitimacy to make the governing role functional, or identify an exit before the gap between title and authority becomes irreversible.',
    constraint:'Cannot take the action most likely to restore legitimacy without exposing the informal arrangements that currently keep governance functional.' },
  { position:  'Occupies a civic position whose authority depends on a governing structure that is itself under question — institutional standing is borrowed from above.',
    goal:      'Keep the institutional position viable through the governance crisis without being visibly associated with either the failure or an opportunistic alternative.',
    constraint:'Acting to protect the position looks like opportunism; doing nothing risks being caught in the collapse of the structure this position depends on.' }
);
reg('government','corruption',
  { position:  'Governs within or alongside informal arrangements with criminal interests — official and actual authority are partially different systems.',
    goal:      'Maintain governance viability without forcing a confrontation with the informal arrangements it depends on.',
    constraint:'Cannot act decisively against criminal interests without dismantling arrangements the governance structure currently relies on.' },
  { position:  'Holds a civic position inside a governance structure with compromised elements — not the source of the corruption, but operating within it.',
    goal:      'Maintain credibility by demonstrating institutional function in areas the corruption has not reached.',
    constraint:'Any investigation or challenge to the corrupt arrangements requires the cooperation of institutions that are themselves compromised.' }
);
reg('government','food_crisis',
  { position:  'Holds governing authority during supply failure — civic order and governing legitimacy are both contingent on how this crisis resolves.',
    goal:      'Stabilise the supply situation before the crisis opens political space for an alternative authority.',
    constraint:'Cannot distribute what does not exist, and cannot admit the full scale of shortage without accelerating the loss of confidence this role depends on.' },
  { position:  'Occupies a civic position with limited direct control over supply — accountable for crisis conditions without the authority to address them.',
    goal:      'Redirect accountability upward while demonstrating visible institutional effort that does not require resources this position controls.',
    constraint:'Visible effort without visible results extends accountability rather than resolving it.' }
);
reg('government','economic_stress',
  { position:  'Governs a settlement under persistent economic pressure — the faction\'s legitimacy depends partly on economic performance it cannot currently deliver.',
    goal:      'Demonstrate governance value through means that do not depend on economic conditions the settlement currently lacks.',
    constraint:'Cannot make the structural investments that would address the economic situation without resources the settlement does not have.' },
  { position:  'Holds a civic position in an economically pressured settlement where governance capacity is reduced along with fiscal capacity.',
    goal:      'Protect the institutional role by making it indispensable for whatever limited resources remain to be managed.',
    constraint:'Indispensability in a resource-constrained environment means competing with other civic positions for the same shrinking share.' }
);
reg('government','contested',
  { position:  'Holds governing authority that is contested — the position is held but not secured.',
    goal:      'Convert contested authority into stable authority before the contest resolves in someone else\'s favor.',
    constraint:'Every move to consolidate the position risks galvanizing opposition; every inaction gives the opposition time to consolidate instead.' },
  { position:  'Occupies a civic position whose institutional standing depends on a governing authority that is itself under challenge.',
    goal:      'Navigate the political contest without committing to a side until the outcome is sufficiently clear to make the commitment worthwhile.',
    constraint:'Delayed commitment reduces the value of the eventual alignment without reducing the cost of having waited.' }
);
reg('government','stable',
  { position:  'Holds governing authority in a settlement with functional legitimacy — the position is secure enough to act from rather than defend.',
    goal:      'Use current stability to address structural vulnerabilities before conditions change.',
    constraint:'Stability reduces the sense of urgency that would justify the resources and disruption required to address those vulnerabilities.' },
  { position:  'Holds a civic position in a well-functioning settlement — the role is defined by administration rather than crisis.',
    goal:      'Advance the faction\'s institutional standing through the credibility that comes from competent administration of current responsibilities.',
    constraint:'Credible administration is expected, not rewarded — the upside is limited and the downside of failure is disproportionate.' }
);

// ── military ──────────────────────────────────────────────────────────────────
reg('military','governance_fractured',
  { position:  'Commands enforcement capacity where civilian governance is failing — the military\'s relationship with civilian authority is under pressure.',
    goal:      'Maintain operational cohesion and institutional loyalty while the political situation makes the chain of command ambiguous.',
    constraint:'Cannot act unilaterally to fill the governance vacuum without becoming a political actor in ways that compromise the institutional neutrality the role requires.' },
  { position:  'Commands a subordinate enforcement unit in a settlement where institutional authority is fragmented — orders may be coming from multiple competing sources.',
    goal:      'Keep the unit functional and loyal to the institution rather than to any individual faction competing to claim the enforcement apparatus.',
    constraint:'Institutional loyalty in a fragmented governance environment requires active management that cannot be publicly acknowledged as such.' }
);
reg('military','corruption',
  { position:  'Leads enforcement in a settlement where criminal interests have arrangements with parts of the security apparatus.',
    goal:      'Determine which elements of the enforcement apparatus are reliable without triggering a response before that determination is complete.',
    constraint:'Investigating the arrangements exposes the investigators to the same pressures that created them.' },
  { position:  'Commands a subordinate enforcement unit inside a structure where corruption is known to have reached some levels.',
    goal:      'Maintain unit effectiveness and personal integrity without creating the kind of visibility that makes the unit a target for either the corrupt interests or those investigating them.',
    constraint:'Visibility in either direction — too compliant or too resistant — creates risk the unit cannot currently afford.' }
);
reg('military','food_crisis',
  { position:  'Responsible for public order during supply failure — the conditions that most reliably produce civil disorder are currently present.',
    goal:      'Maintain order through the crisis without deploying force in ways that create grievances that outlast it.',
    constraint:'Enforcement sufficient to prevent disorder may be enforcement sufficient to generate resentment — the threshold is not visible in advance.' },
  { position:  'Commands a subordinate enforcement unit during a supply crisis — responsible for a sector where the pressure is acutely felt.',
    goal:      'Keep order in the assigned sector with the resources available, without creating incidents that escalate beyond the unit\'s capacity.',
    constraint:'The resources available are not sufficient for the conditions present — performance is being evaluated against a standard the conditions make unachievable.' }
);
reg('military','economic_stress',
  { position:  'Maintains order in a settlement under economic pressure, where enforcement is more necessary and less funded than at other times.',
    goal:      'Keep enforcement visible enough to deter disorder without making the enforcement apparatus the primary civic grievance.',
    constraint:'Underfunding of enforcement is itself a product of the economic conditions that make enforcement more necessary.' },
  { position:  'Commands a subordinate enforcement unit in an economically stressed settlement where unit resources, morale, and staffing are all under pressure.',
    goal:      'Maintain unit effectiveness with reduced resources while preventing the visible deterioration in capacity from becoming an invitation.',
    constraint:'Visible deterioration invites exactly the disorder it signals the inability to contain.' }
);
reg('military','contested',
  { position:  'Commands enforcement in a settlement where competing political claims create pressure on the loyalty of the security forces.',
    goal:      'Keep the enforcement apparatus out of the political contest long enough for the contest to resolve.',
    constraint:'Both sides of the contest want enforcement on their side — neutrality requires active management that cannot be acknowledged publicly.' },
  { position:  'Leads a subordinate enforcement unit whose institutional loyalties are being tested by the political contest above it.',
    goal:      'Keep the unit\'s loyalty to the institution intact through the contest rather than allowing it to fragment along factional lines.',
    constraint:'Unit members have personal loyalties that do not necessarily align with institutional neutrality.' }
);
reg('military','stable',
  { position:  'Commands enforcement in a well-ordered settlement — the role is preventive rather than responsive, and authority derives from institutional legitimacy.',
    goal:      'Maintain the enforcement capacity and institutional culture that makes current stability possible.',
    constraint:'Stable conditions make it harder to justify the resources and authority that would be needed if conditions changed.' },
  { position:  'Leads a subordinate enforcement unit in a stable settlement — the role is routine, the risks are low, and advancement requires distinguishing the unit in conditions that offer few distinctions.',
    goal:      'Build unit reputation and institutional standing through consistent performance of routine responsibilities.',
    constraint:'Routine excellence is expected and unremarkable; meaningful advancement requires either a crisis or a patron.' }
);

// ── economy / crafts ──────────────────────────────────────────────────────────
for (const cat of ['economy','crafts']) {
reg(cat,'governance_fractured',
  { position:  'Controls organized commercial infrastructure in a settlement where governance is failing — economic institutions are currently more functional than civic ones.',
    goal:      'Formalize the independent operational authority that governance failure has created in practice, before reconsolidation reasserts control.',
    constraint:'Formalizing commercial independence too visibly invites a reconsolidated governing authority to treat it as a threat rather than an asset.' },
  { position:  'Operates commercial interests from a position secondary to the dominant commercial faction in a settlement with failing governance.',
    goal:      'Use the governance instability to advance commercial standing relative to the dominant commercial interest without triggering a defensive response.',
    constraint:'The governance instability that creates opportunity also creates uncertainty — the same conditions that allow advancement can reverse it.' }
);
reg(cat,'corruption',
  { position:  'Operates in a commercial environment where criminal interests have informal arrangements with enforcement — the line between legitimate and accommodated commerce is blurred.',
    goal:      'Maintain commercial operations without becoming either a target of the criminal arrangements or a dependent of them.',
    constraint:'The informal arrangements with enforcement make legitimate commerce partially reliant on the same corruption it must avoid.' },
  { position:  'Operates smaller commercial interests within a commercial environment compromised by criminal accommodation.',
    goal:      'Distinguish the commercial position from the corruption without provoking retaliation from the interests that benefit from it.',
    constraint:'Visible distinction from the corruption draws attention; accommodation normalizes it — neither option is cost-free.' }
);
reg(cat,'food_crisis',
  { position:  'Controls distribution infrastructure for a critical resource at a moment when that resource is in shortage — the position carries unusual leverage and unusual risk.',
    goal:      'Manage the supply situation in a way that preserves commercial relationships and reputation beyond this crisis.',
    constraint:'Any pricing or allocation decision during a shortage is a political act, regardless of intent.' },
  { position:  'Operates commercial interests in a supply crisis from a position without control over the primary distribution channel.',
    goal:      'Find commercial position in the crisis that does not depend on controlling the critical shortage commodity.',
    constraint:'Alternative commercial positions during a supply crisis are defined by what the crisis displaces — the opportunity and the instability are the same thing.' }
);
reg(cat,'economic_stress',
  { position:  'Operates in a settlement under persistent economic pressure — the commercial position is maintained but not growing.',
    goal:      'Identify which commercial relationships will survive the current stress and consolidate around those.',
    constraint:'Selective consolidation requires visibly abandoning some positions, creating vulnerability in the ones being retained.' },
  { position:  'Operates smaller commercial interests in an economically stressed settlement where consolidation by larger commercial interests reduces operational space.',
    goal:      'Find the commercial niche that larger interests do not find worth contesting.',
    constraint:'Niches that larger interests do not contest are typically ones with limited growth potential.' }
);
reg(cat,'contested',
  { position:  'Holds commercial structural influence in a settlement where governing authority is contested — commercial interests are positioned to benefit from or be damaged by how the contest resolves.',
    goal:      'Position commercial interests to maintain relevance regardless of which faction prevails.',
    constraint:'Cultivating relationships with both sides requires that neither side trusts you fully.' },
  { position:  'Operates commercial interests that are positioned between the competing factions in a contested settlement.',
    goal:      'Maintain commercial relationships with all significant factions without being treated as an asset by any of them.',
    constraint:'Commercial neutrality looks like either timidity or calculation to the factions seeking commitment.' }
);
reg(cat,'stable',
  { position:  'Controls organized commercial infrastructure in a functioning settlement — the position is secure and the leverage is real.',
    goal:      'Convert commercial leverage into more durable institutional advantages before conditions change.',
    constraint:'Visible accumulation of institutional advantage invites regulatory and political attention.' },
  { position:  'Operates commercial interests in a stable settlement from a position secondary to the dominant commercial faction.',
    goal:      'Grow commercial standing within the constraints the dominant commercial interest creates.',
    constraint:'Growth that encroaches on the dominant interest\'s commercial territory invites a response; growth that doesn\'t stays marginal.' }
);
}

// ── religious ─────────────────────────────────────────────────────────────────
reg('religious','governance_fractured',
  { position:  'Holds institutional religious authority in a settlement where civic governance is failing — religious institutions often absorb civic functions when secular authority contracts.',
    goal:      'Extend the institution\'s civic role in ways that survive whatever governance reconsolidation follows.',
    constraint:'Civic engagement that appears opportunistic risks being reversed by a reconsolidated authority that resents the encroachment.' },
  { position:  'Serves a religious position secondary to the dominant religious institution in a settlement with failing civic governance.',
    goal:      'Maintain the position\'s relevance by demonstrating pastoral function that does not depend on the failing civic structures.',
    constraint:'Pastoral relevance without institutional authority is difficult to convert into institutional standing when the governance reconsolidates.' }
);
reg('religious','corruption',
  { position:  'Holds institutional religious authority in a settlement where civic institutions are compromised — the church\'s moral authority depends on distance from the corruption.',
    goal:      'Sustain the institution\'s credibility while navigating a civic environment where most institutions have accommodated compromise.',
    constraint:'The institution depends on civic structures for land rights and legal standing — complete separation from compromised institutions is unavailable.' },
  { position:  'Holds a religious position that must maintain pastoral credibility in a community aware of institutional corruption in the settlement\'s civic structures.',
    goal:      'Build pastoral trust at the community level that is not contingent on the credibility of the civic structures above it.',
    constraint:'Pastoral trust built in opposition to civic institutions is vulnerable to any reconsolidation that restores civic legitimacy.' }
);
reg('religious','food_crisis',
  { position:  'Leads a religious institution with direct welfare capacity during a supply crisis — charitable infrastructure becomes a primary social stabilizer.',
    goal:      'Deploy welfare capacity in ways that address the crisis and reinforce the institution\'s civic indispensability.',
    constraint:'The institution\'s charitable capacity is finite; prioritizing distribution for institutional benefit rather than need creates the scandal that outlasts the crisis.' },
  { position:  'Serves a religious position with limited independent welfare capacity during a supply crisis.',
    goal:      'Connect the community under pastoral care to whatever relief infrastructure exists, maintaining pastoral standing as a reliable intermediary.',
    constraint:'Intermediary standing depends on the reliability of what is being intermediated — if the relief infrastructure fails, the position loses credibility along with it.' }
);
reg('religious','economic_stress',
  { position:  'Holds religious authority in a settlement under economic pressure — the church\'s land holdings and endowments are both assets and targets.',
    goal:      'Preserve institutional resources through the economic pressure without appearing to prosper from conditions that are harming the population.',
    constraint:'Any use of institutional resources to protect institutional interests during population-level hardship is visible.' },
  { position:  'Holds a religious position secondary to the dominant institution in an economically stressed settlement where religious endowment is under pressure.',
    goal:      'Maintain the position\'s function with reduced resource support from institutional sources.',
    constraint:'Reduced resources reduce the pastoral capacity that justifies the position\'s existence.' }
);
reg('religious','contested',
  { position:  'Holds institutional religious authority during political contestation — both sides of a political contest typically want clerical endorsement.',
    goal:      'Delay public alignment until the outcome is clear enough to make the endorsement worthwhile rather than premature.',
    constraint:'The longer neutrality is maintained, the less valuable the eventual endorsement becomes.' },
  { position:  'Serves a religious position under the dominant religious institution during political contestation.',
    goal:      'Follow the institutional alignment when it is made without appearing to have advocated for it prematurely.',
    constraint:'Following the institutional alignment requires having subordinated personal judgment to institutional authority — the cost is the same regardless of whether the alignment was correct.' }
);
reg('religious','stable',
  { position:  'Leads an established religious institution in a settlement with functional civic order.',
    goal:      'Maintain the institution\'s role in civic life through the legitimacy of pastoral service rather than political pressure.',
    constraint:'Institutional stability tends toward complacency — the challenges that would justify institutional expansion are currently absent.' },
  { position:  'Serves a religious position secondary to the dominant institution in a stable settlement.',
    goal:      'Build pastoral standing and institutional credibility through consistent service in a context where the dominant institution sets the standard.',
    constraint:'Excellence within the dominant institution\'s frame does not distinguish the position; deviation from it invites institutional friction.' }
);

// ── criminal ──────────────────────────────────────────────────────────────────
reg('criminal','governance_fractured',
  { position:  'Operates criminal interests in a settlement where governance is failing — a governance vacuum is the optimal environment for criminal operations to expand.',
    goal:      'Extend operational scope while governance is weakened in ways that become embedded before reconsolidation.',
    constraint:'Expanding too visibly during governance failure risks triggering a consolidation response specifically aimed at criminal interests.' },
  { position:  'Operates within a criminal network as a position secondary to the dominant criminal interest in a settlement with failing governance.',
    goal:      'Advance within the criminal hierarchy using the conditions of governance failure.',
    constraint:'Advancement within the hierarchy requires either demonstrating value to it or demonstiting threat to it — both are visible to the hierarchy.' }
);
reg('criminal','corruption',
  { position:  'Has arrangements with enforcement that create unusual operational freedom — the position depends on those arrangements remaining stable.',
    goal:      'Maintain the arrangements that allow current operations while managing the risk that they become a liability if political conditions change.',
    constraint:'The arrangements are known to multiple parties — they are leverage over the operation as much as they are protection for it.' },
  { position:  'Operates a position within a criminal network that benefits from the network\'s enforcement arrangements without being the architect of them.',
    goal:      'Leverage the operational freedom the arrangements provide without becoming dependent on their continuation.',
    constraint:'Operational independence from the arrangements while continuing to benefit from them requires a position the network may not tolerate.' }
);
reg('criminal','food_crisis',
  { position:  'Controls informal distribution channels for goods that are in shortage — supply crises create extraordinary criminal economic opportunity.',
    goal:      'Profit from the shortage through parallel distribution without triggering a response that uses the public interest as justification.',
    constraint:'Visible profiteering during a population-level crisis creates the moral clarity that even compromised enforcement cannot ignore.' },
  { position:  'Operates a secondary position in a criminal network that is expanding into supply crisis opportunity.',
    goal:      'Secure a reliable role in the crisis distribution network before the dominant criminal interest consolidates its position.',
    constraint:'Securing that role requires either offering something the dominant interest needs or accepting a subordinate position that leaves future leverage limited.' }
);
reg('criminal','economic_stress',
  { position:  'Operates in an economically pressured settlement where desperation expands the pool accessible to criminal recruitment and exploitation.',
    goal:      'Convert expanded recruitment opportunity into operational capacity that persists after economic conditions ease.',
    constraint:'Operations built on desperation are vulnerable to improvement in the economic conditions that created them.' },
  { position:  'Holds a secondary position in a criminal network operating in an economically stressed settlement.',
    goal:      'Build a stable position within the network that is not contingent on the economic conditions that created the opportunity.',
    constraint:'A stable position within the network requires demonstrated value that survives changing conditions — this is harder to demonstrate during the conditions themselves.' }
);
reg('criminal','contested',
  { position:  'Operates criminal interests in a contested political environment where enforcement attention is distracted.',
    goal:      'Expand operational positions during the political distraction that would face more resistance under settled conditions.',
    constraint:'Both sides of a political contest may attempt to use criminal enforcement as a tool against the other — the current operational freedom is unpredictable.' },
  { position:  'Holds a position within a criminal network that is attempting to expand during political contestation.',
    goal:      'Consolidate personal position within the network during the expansion, independent of whether the expansion succeeds.',
    constraint:'Network position consolidated during an expansion that fails is exposed when the network contracts.' }
);
reg('criminal','stable',
  { position:  'Operates within a well-ordered settlement where enforcement is functional and operational space is defined by what enforcement chooses not to pursue.',
    goal:      'Maintain operations within the constraints that functional enforcement creates, without triggering focused attention.',
    constraint:'Sustained operational success below the enforcement threshold makes the operation visible to those who look for the threshold.' },
  { position:  'Holds a secondary position in a criminal network operating in a settled environment with functional enforcement.',
    goal:      'Demonstrate reliability within the network sufficient to advance position without creating visibility that enforcement acts on.',
    constraint:'Advancement within the network requires demonstrating capacity — demonstration is visibility.' }
);

// ── magic ─────────────────────────────────────────────────────────────────────
reg('magic','governance_fractured',
  { position:  'Holds arcane institutional authority in a settlement with failing civic governance — arcane services may hold leverage if structurally necessary.',
    goal:      'Convert temporary crisis leverage into more durable institutional standing.',
    constraint:'Arcane authority claimed during a governance crisis is typically the first thing a reconsolidated government constrains.' },
  { position:  'Practices arcane arts in a secondary institutional position in a settlement with failing governance.',
    goal:      'Maintain operational position through the governance crisis without becoming associated with any faction competing to resolve it.',
    constraint:'Neutrality in a crisis that affects all institutions is difficult to sustain without appearing to have calculated it.' }
);
reg('magic','corruption',
  { position:  'Maintains arcane operations in a settlement with compromised institutions — arcane services used for concealment create leverage and obligation.',
    goal:      'Maintain institutional independence without becoming so embedded in the corruption that independence becomes unavailable.',
    constraint:'Arcane services used for concealment create relationships that are difficult to exit.' },
  { position:  'Practices arcane arts in a position secondary to the dominant arcane institution in a compromised institutional environment.',
    goal:      'Sustain the practice by providing arcane services that are not already dominated by the institutional position above.',
    constraint:'Services not dominated by the primary institution tend to be those the primary institution has declined — often for reasons.' }
);
reg('magic','food_crisis',
  { position:  'Holds arcane institutional authority in a supply crisis — magical production or preservation capacity, if available, becomes a critical resource.',
    goal:      'Deploy arcane capacity to address the crisis while establishing the institutional indispensability that justifies expanded authority.',
    constraint:'Arcane solutions to supply crises create expectations that cannot be sustained indefinitely.' },
  { position:  'Practices arcane arts in a position that could contribute to crisis response but lacks the institutional authority to deploy independently.',
    goal:      'Make the arcane contribution through institutional channels that increase rather than circumvent personal standing.',
    constraint:'Contributing through channels that constrain the contribution limits both the impact and the credit.' }
);
reg('magic','economic_stress',
  { position:  'Maintains arcane institutional operations in an economically pressured settlement — arcane services are among the first to face budget reduction.',
    goal:      'Identify which arcane services are structurally indispensable enough to be funded under economic pressure.',
    constraint:'Demonstrating indispensability may require deploying services in ways that reduce their scarcity and therefore their leverage.' },
  { position:  'Practices arcane arts in a secondary institutional position in an economically pressured settlement where arcane patronage is declining.',
    goal:      'Find the arcane service niche that survives economic pressure because it is necessary rather than convenient.',
    constraint:'Necessity-level arcane services are typically lower-status and lower-compensation than the services economic pressure eliminates.' }
);
reg('magic','contested',
  { position:  'Holds arcane authority in a contested political environment — arcane capacity is a resource both sides want access to.',
    goal:      'Preserve the institution\'s autonomy through the political transition, regardless of which faction prevails.',
    constraint:'Maintaining neutrality requires declining requests from both sides, which generates resentment from both.' },
  { position:  'Practices arcane arts in a secondary position in a contested political environment.',
    goal:      'Position the practice to be valuable to whatever governance emerges from the contest without being committed to any specific outcome.',
    constraint:'Value to multiple competing factions requires keeping the scope of arcane services narrow enough that none of them perceive a conflict of interest.' }
);
reg('magic','stable',
  { position:  'Leads established arcane institutions in a functional settlement — the position is secure, the services are in demand.',
    goal:      'Maintain and extend the arcane institution\'s role in civic and commercial life.',
    constraint:'Arcane authority in stable conditions faces gradual bureaucratic containment — institutionalization brings limits alongside legitimacy.' },
  { position:  'Practices arcane arts in a secondary institutional position in a stable settlement.',
    goal:      'Build practical arcane standing through the quality of services rather than institutional authority.',
    constraint:'Practical standing without institutional authority is vulnerable to institutional decisions about who is permitted to practice.' }
);

// ── other (noble, etc.) ───────────────────────────────────────────────────────
reg('other','governance_fractured',
  { position:  'Holds hereditary or traditional status in a settlement where formal governance is under pressure — traditional authority often gains relative standing when formal authority loses it.',
    goal:      'Convert governance instability into a restoration of prerogatives that formal governance had constrained.',
    constraint:'Traditional claims that would have been dismissed under stable governance invite more scrutiny under conditions where everyone is watching for illegitimate power grabs.' },
  { position:  'Holds traditional status secondary to the dominant traditional interest in a settlement with failing governance.',
    goal:      'Use the governance instability to close the gap between the secondary traditional position and the dominant one.',
    constraint:'Advancing relative to the dominant traditional interest during a crisis positions the advance as opportunistic rather than earned.' }
);
reg('other','stable',
  { position:  'Holds traditional or hereditary status in a stable settlement where institutional competition constrains traditional influence.',
    goal:      'Maintain traditional standing within the constraints that stable institutional competition creates.',
    constraint:'Traditional authority in stable conditions is in slow structural decline relative to institutional authority.' },
  { position:  'Holds a secondary traditional or hereditary position in a stable settlement.',
    goal:      'Convert traditional standing into operational relevance through alliances that institutional actors find useful.',
    constraint:'Usefulness to institutional actors defines the scope of permitted influence, not the traditional claim itself.' }
);
// Fill remaining conditions for 'other' with stable variants
for (const cond of ['corruption','food_crisis','economic_stress','contested']) {
  if (!T[`other__${cond}__dominant`]) {
    T[`other__${cond}__dominant`]    = T['other__stable__dominant'];
    T[`other__${cond}__subordinate`] = T['other__stable__subordinate'];
  }
}

// ── Score NPCs by power relevance ─────────────────────────────────────────────
function npcRelevanceScore(npc, powerFactions) {
  const fac = powerFactions.find(f => f.faction === npc.factionAffiliation);
  let score = fac?.power || 0;
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

  const scored = npcs.map(n => ({ npc: n, score: npcRelevanceScore(n, powerFactions) }))
                     .sort((a,b) => b.score - a.score);

  return scored.map(({ npc }, idx) => {
    if (idx >= TOP_N) return npc;

    const cat  = npc.category || 'other';
    const rank = getRank(npc, powerFactions);
    const key  = `${cat}__${condition}__${rank}`;
    const tmpl = T[key] || T[`${cat}__stable__${rank}`] || T['other__stable__dominant'];

    if (!tmpl) return npc;

    // activeGoal replaces goal.short on enriched NPCs so the DM sees one coherent goal.
    // The settlement-derived goal is more specific than the generic role goal.
    const updatedGoal = npc.goal
      ? { ...npc.goal, short: tmpl.goal }
      : { short: tmpl.goal, long: tmpl.goal };

    return {
      ...npc,
      goal:               updatedGoal,
      structuralPosition: tmpl.position,
      activeConstraint:   tmpl.constraint,
      settlementCondition: condition,
      structuralRank:     rank,
    };
  });
}
