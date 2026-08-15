/**
 * narrativeText.js — executable narrative template tables.
 *
 * A+ Track H (data-schema.3): these two tables were previously in
 * src/data/narrativeData.js, which forced that pure-data file to import
 * `random` and `pickRandom2` from the generators layer. Both tables hold
 * per-call template closures that draw randomness at RENDER time:
 *   - PRESSURE_SENTENCES.succession_void draws `_rng()` for the "weeks ago" count.
 *   - POLITICAL_FLAVOR closures call `pickRandom2(...)` to choose a history event.
 * Neither draws at MODULE-LOAD time (no latent non-determinism), but both are
 * runtime imports, so the tables live here in the generators layer instead.
 *
 * The closure bodies are moved VERBATIM, so every rng / pickRandom2 call fires at
 * the same point in the same order — byte-identical, same-seed output preserved.
 *
 * The pure string tables (ARRIVAL_SCENES, ARRIVAL_ADDONS, TERRAIN_NARRATIVE_HOOKS)
 * stay in src/data/narrativeData.js.
 */

import { random as _rng } from "../kernel/rngContext.js";
import { pickRandom2 } from "./helpers.js";

// AMENDMENT B — THE CASING PASS. The ${govFaction}/${topFaction} interpolations
// carry a value that is usually lowercased ("the town council"), while their
// fallback strings are capitalised or not depending on POSITION. A capitalised
// "The …" fallback marks a SENTENCE-START interpolation (the author capitalised
// the fallback there); a lowercase "the …" fallback marks a mid-sentence one.
// capFirst uppercases the first letter of a set faction value so a sentence that
// OPENS on the interpolated value no longer reads "the town council announced …".
// It is idempotent (a value already capitalised — e.g. a FACTION_DESCRIPTORS name
// — is unchanged) and passes falsy through, so the fallback path is byte-identical.
// Applied ONLY at the capitalised-fallback (sentence-start) sites; the lowercase-
// fallback (mid-sentence) sites are left untouched. One-time golden shift (this
// branch parks for the regen); prose-only, so the structural diff stays clean.
const capFirst = (s) => (typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s);

// ─── Per-stress pressure sentences (consumed by narrativeGenerator) ──────────
// Each value is a function (detail) => string[]. Only succession_void draws rng
// (a hoisted weeks count — see below). The single selector generatePressureSentence
// does ONE pickRandom2(templates) regardless of array length, so deepening any pool
// is DRAW-COUNT INVARIANT (only the chosen string moves; the per-step rng fork is
// unperturbed). CONTENT-GT-DOSSIER lane: index 0 of every pool is the pre-existing
// canonical string; new variants preserve the interpolated tokens (r.name/govFaction/
// topFaction/topNPCName+role/commodity/milForce) and, for the compound-branched
// wartime pool, the branch anchors "on the right side of it" (winning) / "losing
// people and resources" (losing) that narrativePressureCompound.test.js pins.
export const PRESSURE_SENTENCES = {
  under_siege: (r) => [
    `${r.name} is surrounded — supply lines are cut, morale is fracturing, and ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "the leadership"} is deciding whether to negotiate terms or hold out for relief that may not be coming.`,
    `The siege has entered its second week; ${r.govFaction || "the council"} controls the rationing and the gates, which means they control everything else too — for now.`,
    `Every ${r.commodity || "resource"} cache in ${r.name} has been inventoried and argued over; the next argument will be about what to give up and what to defend to the end.`,
    `The walls of ${r.name} have held so far, which is the problem — a quick fall would at least have settled the question of who was to blame, and a slow one leaves ${r.govFaction || "the council"} to answer for every day the relief does not come.`,
    `${r.name} is learning the arithmetic of a siege: how many mouths, how many days of ${r.commodity || "grain"}, how many of the people on the walls are watching the enemy and how many are watching each other.`,
    `Word came into ${r.name} three days ago that the relief column had turned back; ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "the leadership"} has not made it public, and the effort of not making it public is beginning to show.`,
  ],
  famine: (r) => [
    `${r.name} is two bad weeks from genuine starvation; ${r.topFaction || "the merchant class"} controls the remaining ${r.commodity || "grain"} reserves and is not discussing it openly.`,
    `The harvest failure has restructured every relationship in ${r.name} — whoever controls food now controls the settlement, and at least three factions have worked this out.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "Someone"} knows where the hoarded ${r.commodity || "grain"} is, and isn't saying, and the reasons for that silence are complicated.`,
    `The bakers of ${r.name} have started cutting the bread with things that are not flour; everyone can taste it, and the fact that nobody complains is the most alarming part.`,
    `${capFirst(r.govFaction) || "The council"} of ${r.name} announced a fair distribution of the ${r.commodity || "grain"} reserves last week; the announcement and the distribution are turning out to be two different things.`,
    `Hunger has made ${r.name} quiet. The market still opens, the queues still form, but the haggling has gone out of people — they take what they are given and calculate, silently, how long it will last.`,
  ],
  occupied: (r) => [
    `${r.name} is under occupation; ${r.govFaction || "the administration"} answers to outside authority now, which means every decision made here is made twice — once officially, once actually.`,
    "The occupation has been running long enough that some residents have accommodated it and some have organised against it, and the divide between those two groups is not always visible from the outside.",
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "The most senior local official"} is simultaneously expected to enforce the occupiers' directives and protect the people those directives are aimed at — a position that is becoming untenable.`,
    `The occupiers of ${r.name} are careful to leave the forms of local rule in place — ${r.govFaction || "the council"} still meets, still signs, still presides — which fools no one and is not meant to.`,
    `Every household in ${r.name} has quietly decided what it would and would not do if asked, and most of them are hoping never to find out whether they were honest with themselves.`,
    `The curfew in ${r.name} is enforced unevenly, and the unevenness is the point: no one can be sure which night, or which street, or which face at the checkpoint will decide that the rules apply to them.`,
  ],
  politically_fractured: (r) => [
    `${r.name} has no effective government; ${r.topFaction || "the leading faction"} controls one district and the institutions inside it, a rival controls another, and the contested space between them is where things go wrong.`,
    `Three factions are each waiting for one of the other two to make a mistake — in the meantime, ${r.name} is being administered by inertia.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "The most senior figure"} is the only person all three factions will still speak to, which makes them either the key to resolution or the next target.`,
    `Nothing gets decided in ${r.name} because deciding would require one faction to be seen to win, and none of them can afford to let another be seen to lose. The paralysis is not an accident; it is the only stable arrangement left.`,
    `${r.name} runs two of everything now — two watches, two courts of a kind, two versions of who is owed what — and the citizens have learned which one to approach for which favour, which is its own kind of government.`,
    `The last thing ${r.topFaction || "the leading faction"} and its rivals agreed on in ${r.name} was that the disagreement should not be allowed to reach the streets; that agreement is the only thing holding, and it is fraying.`,
  ],
  indebted: (r) => [
    `${r.name} owes more than it can repay; the creditor's representative arrived last month, and every civic decision since has been made with one eye on what they might accept as partial satisfaction.`,
    `${capFirst(r.topFaction) || "The dominant faction"} took the loans and ${r.govFaction || "the current council"} is repaying them — a distinction that has not gone unnoticed and is not forgotten.`,
    `The debt has a clause that ${r.topNPCName ? r.topNPCName + " has read" : "almost nobody has read"} and that would change the entire conversation if it became public.`,
    `The creditor has begun taking payment from ${r.name} in things other than coin — a warehouse here, a toll right there — and each transfer is legal, documented, and slightly worse than the last.`,
    `${r.name} still keeps up appearances: the civic buildings are painted, the festival was held. The money for both was borrowed, which everyone knows and no one says, because saying it would end the appearances that are the only asset left.`,
    `The interest on ${r.name}'s debt now outpaces what the ${r.commodity || "trade"} can bring in; the numbers have been quietly rearranged twice to hide it, and there is no third arrangement that works.`,
  ],
  recently_betrayed: (r) => [
    `Someone inside ${r.name} sold something important — recently enough that the wound is open, not yet scarred over — and the settlement's institutions are running at reduced trust while everyone suspects everyone else.`,
    `The betrayal's consequences are still unfolding; ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "the most senior official"} knows more than they've disclosed about what was sold and to whom.`,
    `${capFirst(r.govFaction) || "The council"} has been investigating the betrayal for three weeks with nothing to show for it, which either means they're incompetent or the answer leads somewhere they don't want to go.`,
    `Since the betrayal, ${r.name} has become a place where people finish fewer sentences and lock more doors; the trust that made the settlement work is not gone, but it is being rationed.`,
    `Everyone in ${r.name} has privately assembled their own list of who might have done it, and the lists do not agree, and the disagreement is doing almost as much damage as the original act.`,
    `The betrayal cost ${r.name} something specific — a contract, a caravan, a name that vouched for the place — and the loss of it is only now working its way through the ledgers, arriving as bad news that seems, wrongly, unrelated.`,
  ],
  infiltrated: (r) => [
    `${r.name} doesn't know it's been infiltrated; decisions at the ${r.govFaction || "council"} level have been subtly shaped for months, and the direction those decisions have been shaped toward is only now becoming legible.`,
    `Someone has been in ${r.name} long enough to understand it — its vulnerabilities, its factions, its trusted figures — and has been using that understanding systematically.`,
    `Three separate things have gone slightly wrong in ${r.name} recently, in ways that look like bad luck; they are not bad luck.`,
    `The infiltration of ${r.name} shows only in negatives — the meeting that was rescheduled at exactly the wrong moment, the shipment that was delayed just long enough, the appointment that went to the second-best candidate for reasons no one can quite reconstruct.`,
    `Whoever is inside ${r.name} has not asked for anything yet, and the waiting is the tell: they are still building the position, and by the time they spend it, it will be too late for ${r.govFaction || "the council"} to have noticed.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "One trusted figure"} has become, without anyone deciding it, the person through whom a surprising amount of ${r.name}'s sensitive business now passes — which is either coincidence or the whole design.`,
  ],
  plague_onset: (r) => [
    `Something is spreading in ${r.name}; the quarantine is partial, the healers are overwhelmed, and the ${r.topNPCRole || "official"} who first identified it has gone quiet in a way that suggests either pressure or something worse.`,
    "The disease has not yet become a plague, but the window for preventing that outcome is narrowing; every day the quarantine is ignored or negotiated around makes the arithmetic worse.",
    `${capFirst(r.govFaction) || "The council"} is managing disclosure of the outbreak, which means what residents know and what is actually true have started to diverge.`,
    `The sickness in ${r.name} has already sorted the population into those who can afford to leave, those who can afford to isolate, and those who can do neither — and the last group has noticed the sorting.`,
    `The healers of ${r.name} have stopped arguing about what the illness is and started arguing about what to do with the bodies, which is the point at which denial stops being an option for anyone.`,
    `A cordon has gone up around one quarter of ${r.name}, and the people inside it and the people outside it are already telling different stories about why — stories that will outlast the sickness whichever way it goes.`,
  ],
  succession_void: (r) => {
    const weeksAgo = Math.floor(_rng() * 8) + 2;
    return [
      `${r.name} has no effective leader; the last strong authority died ${weeksAgo} weeks ago, and ${r.topFaction || "the dominant faction"} is moving faster than the settlement's institutions can process what's happening.`,
      `Three different people in ${r.name} believe they should be in charge; two of them are wrong; none of them is certain; all of them are acting.`,
      "The power vacuum is obvious to everyone; the question is not who fills it but what they do to fill it and who they owe when they have.",
      `The old authority in ${r.name} left no clear heir and a great many people who benefited from the old arrangement; each of them is now discovering that a claim is only as good as the people willing to enforce it.`,
      `${r.name} is being run, for the moment, by whoever holds the keys, the seals, and the granary — three things that used to be held by one office and are now held by three people who do not trust one another.`,
      `The succession in ${r.name} will be settled by the ${r.commodity || "trade"} more than by any claim of blood or law: whoever the merchants and the creditors decide to deal with becomes, retroactively, the legitimate successor.`,
    ];
  },
  monster_pressure: (r) => [
    `The attacks on ${r.name}'s outlying farmsteads are following a pattern that doesn't fit opportunistic predation; someone or something is directing this, and the evidence is available to anyone who looks carefully.`,
    `The settlement's defences are adequate for normal times; these are not normal times, and ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : r.milForce || "the defenders"} knows it.`,
    "Three farmsteads have been abandoned in the last month; the families who abandoned them know something about what they saw that they haven't reported to the authorities.",
    `${r.name} has drawn its edges inward — fields left unworked, a mill standing idle — trading the ${r.commodity || "harvest"} it needs for a perimeter ${r.milForce || "the defenders"} can actually hold.`,
    `The bounty ${r.govFaction || "the council"} posted for the creature has attracted the wrong sort of help to ${r.name}: hunters who are more dangerous than useful, and who will expect payment whether or not the thing is dead.`,
    `Whatever is preying on ${r.name} has learned the settlement's patterns — when the patrols pass, where the walls are thin — which is not something a beast does, and admitting that is the first hard conversation no one wants to open.`,
  ],
  // Compound-branched pools: the DATA branch (r.compound) selects a variant array,
  // then generatePressureSentence does ONE pickRandom2 over it. Every winning-branch
  // variant keeps "on the right side of it"; every losing-branch variant keeps
  // "losing people and resources" and never the winning anchor (the pins).
  insurgency: (r) => {
    var o, d, l;
    return (((o = r.compound) == null ? void 0 : o.criminalEffective) || 0) >
      (((d = r.compound) == null ? void 0 : d.militaryEffective) || 0) &&
      (((l = r.compound) == null ? void 0 : l.economyOutput) || 50) < 48
      ? [
          `The commons of ${r.name} have stopped pretending to accept the current arrangement. ${capFirst(r.govFaction) || "The governing authority"} still holds the buildings and the official seal, but it is governing by momentum rather than consent. The first faction leader to offer a credible alternative will find an audience.`,
          `The street has gone quiet in ${r.name}, and the quiet is not calm — it is the pause before a thing that everyone can feel coming. ${capFirst(r.govFaction) || "The governing authority"} issues orders that are heard, noted, and not obeyed, and each unobeyed order costs it more than the last.`,
          `In ${r.name} the rents go uncollected, the summons go unanswered, and the men ${r.govFaction || "the governing authority"} sends to enforce either turn back or turn coat. The revolt has not started because it has, in every way that matters, already happened.`,
        ]
      : [
          `The challenge to ${r.govFaction || "the current authority"} in ${r.name} is institutional — not the street but the ledger and the meeting room. Revenue is being held. Officials are slow-walking decisions. Someone is building a coalition, and ${r.govFaction || "the governing faction"} knows it but cannot act without legitimising what they are trying to suppress.`,
          `The insurgency in ${r.name} wears a clerk's coat. Permits stall in the right offices, funds arrive short and late, and the people doing it can each point to a rule that excuses them. ${capFirst(r.govFaction) || "The governing faction"} is being strangled by its own procedures, wielded by people who have read them more carefully than it has.`,
          `No one in ${r.name} is marching, and that is what makes it dangerous. The opposition to ${r.govFaction || "the current authority"} is a patient, well-lawyered thing that means to inherit the settlement intact rather than take it by force — and it is close to being able to.`,
        ];
  },
  mass_migration: (r) => {
    var o;
    return (((o = r.compound) == null ? void 0 : o.economyOutput) || 50) >= 50
      ? [
          `${r.name} is absorbing more people than it was built for. The new arrivals and the old residents are not yet one community — they share streets and markets but not language, custom, or trust. ${capFirst(r.govFaction) || "The governing authority"} is managing the rate of change rather than directing it, and the rate of change is not cooperating.`,
          `The ${r.commodity || "trade"} that made ${r.name} worth coming to is now straining under the number who came. Housing is short, rents have doubled, and the newcomers who were welcomed as labour a year ago are being spoken of as a problem this one, though they have done nothing but arrive.`,
          `${r.name} has grown a second town at its edges — newer, poorer, and not quite governed by the same rules as the first. ${capFirst(r.govFaction) || "The governing authority"} has not decided whether the outer town is part of the settlement or a thing that has happened to it, and the indecision is becoming a policy of its own.`,
        ]
      : [
          `${r.name} is smaller than it was. The departure is orderly, which is its own kind of alarm — it means the people leaving have thought it through. ${capFirst(r.govFaction) || "The governing authority"} is trying to arrest the decline without acknowledging it publicly. So far neither effort is working.`,
          `Each season fewer households remain in ${r.name}, and the ones that go are, quietly, the ones that could go — the skilled, the connected, the solvent. What is left behind concentrates, and ${r.govFaction || "the governing authority"} presides over an emptying it dares not name.`,
          `The road out of ${r.name} is busier than the road in, and both are watched — by ${r.govFaction || "the governing authority"}, which cannot forbid people to leave, and by those who stayed, who are keeping a private account of who did not.`,
        ];
  },
  wartime: (r) => {
    var o, d;
    return (((o = r.compound) == null ? void 0 : o.militaryEffective) || 50) >= 55 &&
      (((d = r.compound) == null ? void 0 : d.economyOutput) || 50) >= 45
      ? [
          `${r.name} is at war and, for now, on the right side of it — contracts are flowing, the garrison is reinforced, and the crown is paying. The men who left to fight have not come back, which is a grief that runs beneath the commerce. The question is whether the war ends before the accounts do.`,
          `The war has been good to ${r.name} so far, which is an uncomfortable thing to be. Being on the right side of it means the forges run day and night and the ${r.commodity || "trade"} has never been dearer — and it means the settlement now needs the war to continue in order to pay for what the war has already cost it.`,
          `${r.name} is prospering on the right side of it: full warehouses, a reinforced garrison, coin moving fast. Prosperity built on a war is a wager that the war will end at the right moment, and no one in ${r.name} controls the moment.`,
        ]
      : [
          `${r.name} is losing people and resources to a war it did not choose the terms of. Conscription has hollowed out the skilled workforce. ${capFirst(r.govFaction) || "The governing authority"} signed a requisition order last week that it cannot afford and could not refuse. The settlement is loyal. It is also running thin.`,
          `The war reaches ${r.name} as a series of demands rather than battles: levies of men, of ${r.commodity || "grain"}, of coin, each one framed as duty and none of them refusable. ${r.name} is losing people and resources it will not get back, and the front it is bleeding for is somewhere it will never see.`,
          `Every capable pair of hands ${r.name} could spare, and several it could not, has gone to the war; what remains is losing people and resources by attrition — a workshop closed for want of a master, a field unsown for want of a back — while ${r.govFaction || "the governing authority"} reports the settlement loyal and does not report the rest.`,
        ];
  },
  // religious_conversion (FIXED): the old selector picked one of three SCENARIOS by
  // name.length % 3 — deterministic per name, so a settlement could never vary its
  // sentence across regens (the survey's CRITICAL finding). Now the closure returns
  // ALL scenario×phrasing variants and generatePressureSentence's single pickRandom2
  // selects one — draw-count unchanged (pickRandom2 already fired on the 1-element
  // array), real re-roll variety gained. Index 0 stays the canonical scenario-0 line.
  religious_conversion: (r) => [
    `The new faith in ${r.name} does not yet have a building. It has the congregation. ${capFirst(r.govFaction) || "The authorities"} have not yet decided whether this is a religious matter, a political one, or both — and the delay in deciding is itself a decision that both sides are interpreting.`,
    `${r.name}'s religious community has formally split. Both factions hold services, keep records, and claim the legitimate succession. Every legal document that required religious sanction is now in a grey zone that the courts are not equipped to resolve quickly.`,
    `The conversion order in ${r.name} was formally acknowledged within the week. The compliance was faster than anyone expected. The depth of that compliance is a separate question that no one with authority is asking loudly, because the answer would require a response.`,
    `The new faith has taken the young of ${r.name} first, which the old faith has noticed and cannot answer — you cannot argue a congregation back, and every festival now draws two crowds of visibly different ages to two different squares.`,
    `${capFirst(r.govFaction) || "The authorities"} in ${r.name} backed the winning faith a little too early and a little too visibly, and now find that a matter of belief has become a matter of who owes whom — the worst kind of debt to have taken on.`,
    `The conversion in ${r.name} is being managed as a property question as much as a spiritual one: which endowments, which burial rights, which festival days transfer with the congregation. The theology was settled quickly. The estate is where the fighting is.`,
  ],
  slave_revolt: (r) => [
    `The revolt in ${r.name} is past the point where it could be resolved by show of force alone. The enslaved population controls enough territory and has enough organisation that suppression would require commitment the governing faction has not yet made. The market infrastructure that generated this situation is suspended. The question now is what the settlement looks like on the other side — and who decides.`,
    `${r.name} has stopped functioning as the thing it was. The labour it was built on has withdrawn itself, by force, and every calculation the settlement made about its own wealth turns out to have rested on people who are no longer willing to be a line in the ledger.`,
    `The rising in ${r.name} did not come from nowhere, though ${r.govFaction || "the governing faction"} is speaking of it as though it did. Everyone who is honest knows the grievances were real, old, and ignored — which makes the question of how to end it far harder than the question of how it began.`,
    `In ${r.name} the two sides have discovered they cannot simply win: the enslaved cannot hold the whole settlement, and ${r.govFaction || "the governing faction"} cannot retake it without destroying the ${r.commodity || "trade"} that made it worth holding. What comes next will be a bargain neither wanted, struck between people who no longer pretend to be anything but enemies.`,
  ],
};

// ─── Historical character flavor text (consumed by narrativeGenerator/history) ──
// POLITICAL_FLAVOR maps history-event-type patterns to arrays of description
// template functions. Several call pickRandom2(...) at render time to select a
// representative event from the supplied list.
export const POLITICAL_FLAVOR = {
  political_heavy: [
    (r) =>
      `A settlement where power has changed hands ${r.length > 2 ? "repeatedly" : "at least once"} within living memory — ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} left a governing structure that still hasn't fully settled`,
    (r) =>
      `Politically restless: the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} is still treated as recent history by those who were there, and recent enough to be a warning by those who weren't`,
    (r) =>
      `The current governing arrangements are a compromise nobody fully chose — shaped more by the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} than by any founding design`,
    (r) =>
      `Authority here has a provisional quality, as though everyone is still waiting for the arrangement that followed the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} to be replaced by a permanent one that never comes`,
    (r) =>
      `The factions here have long memories and short patience — the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} settled who held power without settling whether they should, and that second question has never closed`,
    (r) =>
      `Governance is a performance everyone has agreed to keep up: the offices are filled, the seals are real, and beneath them the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} left a question of legitimacy that no one wants to reopen by answering`,
  ],
  disaster_heavy: [
    (r) =>
      `A settlement defined by what it survived — the ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} shaped how this community thinks about risk, preparation, and who gets left behind`,
    (r) =>
      `Cautious and self-sufficient in ways that visitors find excessive — the ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} made it that way and the lesson has never been unlearned`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} is the reference point for everything: before it, during it, after it. A generation has grown up for whom it is history rather than memory`,
    (r) =>
      `There is a practicality to the people here that outsiders read as coldness — the ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} taught them what sentiment costs when the accounting comes due, and the lesson stuck`,
    (r) =>
      `The settlement keeps more in reserve than its size explains — granaries a little too large, walls a little too strong. The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} is the reason, and no argument about the expense has ever won against that memory`,
    (r) =>
      `Ask why a custom here seems excessive and the answer is always the same shape: it did not used to be, until the ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} made it necessary, and now it is simply how things are done`,
  ],
  economic_heavy: [
    (r) =>
      `A settlement whose identity was built on commerce — the ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} didn't create the merchant class here, but it defined what the merchant class could become`,
    (r) =>
      `Economically dynamic in ways that occasionally tip into instability: the ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} is recent enough to remind everyone that prosperity here has always been earned and can always be lost`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} gave this place its current shape — the physical one as much as the social one`,
    (r) =>
      `Money is discussed openly here in a way that scandalises visitors from more genteel places — the ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} taught everyone that pretending not to care about it is a luxury for people who already have it`,
    (r) =>
      `The social order here maps almost exactly onto the ledger, and no one pretends otherwise. The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} settled who held the capital, and holding the capital has meant holding everything else ever since`,
    (r) =>
      `Prosperity here is worn carefully, never carelessly — the ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} is close enough in memory that flaunting wealth reads less as confidence than as a failure to have learned anything`,
  ],
  catastrophic: [
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "disaster"
        ? `Everything before the ${s.name} is referred to as 'the old settlement'. What exists now was built after, by different people, with different assumptions, over different rubble`
        : s.type === "occupation_infiltration"
          ? `The ${s.name} ended, but the habits of occupation never fully left — the way people speak about authority, the way they watch strangers, the way official records from that period are still treated with suspicion`
          : `Everything before the ${s.name} is referred to as 'the old settlement'. What exists now was built after, by different people, with different assumptions, over different rubble`;
    },
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "monster_incursion"
        ? `The ${s.name} is why this settlement has walls where others do not, why the militia drills when other villages have forgotten how, and why certain paths through the surrounding territory are still considered inadvisable`
        : `The ${s.name} is the settlement's founding trauma — not the actual founding, which is older, but the event that made everything before it feel like a different place`;
    },
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "political"
        ? `The ${s.name} produced a governing arrangement that has never been fully endorsed by everyone it governs. Ask who has legitimate authority here and you will get different answers depending on who you ask`
        : `Ask anyone here what year something happened and they will tell you whether it was before or after the ${s.name}. Time is measured by it`;
    },
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "economic"
        ? `The ${s.name} is why this settlement has no patience for debt, no tolerance for speculation, and a merchant class that keeps more coin in hand than any comparable settlement. Prosperity here is treated as temporary until proven otherwise`
        : `The ${s.name} did not destroy the settlement. It destroyed the settlement's sense of itself. What came after was rebuilt from the ground up, including what people believed about where they lived`;
    },
    (r) =>
      `Older residents still distinguish between 'the original settlement' and 'what we have now'. The ${(r.find((o) => o.severity === "catastrophic") || r[0]).name} is where that line falls — not a clean line, but a real one`,
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "religious"
        ? `The ${s.name} is why the relationship between civic and religious authority here is more carefully managed than in settlements that have never had to think about it`
        : `The ${s.name} is the reason this settlement is here at all, in its current form — not because it was founded then, but because it was remade then, and what was remade is what we have`;
    },
    (r) =>
      `The people here carry the ${(r.find((o) => o.severity === "catastrophic") || r[0]).name} the way other places carry a founding myth — except this one is remembered accurately, by people who were there, which makes it a heavier thing to live beside`,
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "disaster" || s.type === "monster_incursion"
        ? `Every plan made in this settlement now includes, unspoken, a contingency for the ${s.name} happening again — not because anyone expects it, but because expecting nothing was what the ${s.name} punished`
        : `The ${s.name} did not just change what happened next; it changed what the settlement believed was possible, and a people's sense of the possible is the slowest thing in the world to rebuild`;
    },
  ],
  layered_history: [
    (r) =>
      `A settlement with enough history that the layers show. The ${r[0].name} left a foundation; everything built on top of it shows the seams`,
    (r) =>
      `Old enough to have contradicted itself. The ${r[0].name} established one set of assumptions; subsequent events revised them, not always cleanly`,
    (r) =>
      `Ask what shaped this settlement and you will get different answers depending on who you ask and which generation they lived through — the ${r
        .map((s) => s.name)
        .slice(0, 2)
        .join(", ")} left different marks on different people`,
    (r) =>
      "Several significant events, no single defining one. The character formed through accumulation rather than rupture — which makes it harder to explain and more durable",
    (r) =>
      "The history here is dense enough that residents disagree about which part of it matters most. The disagreement is itself part of the character",
    (r) =>
      `Each generation here has left its mark on the last one's arrangements without ever quite clearing them away — the ${r[0].name} is the deepest layer still visible, and everything since has been built at an angle to it`,
    (r) =>
      "This is a settlement of accommodations and half-repairs, where every institution bears the compromise that let it survive the era before this one. It works, in the way a much-mended tool works: not elegantly, but reliably, and no one can quite remember what it looked like new",
  ],
  stable: [
    (r) =>
      "Unremarkable in its history, which is itself a kind of distinction — no catastrophe, no conquest, no great disruption. It simply continued, which required more work than it looks",
    (r) =>
      "An ordinary settlement that has outlasted several less ordinary ones nearby — through no single great decision, but through the accumulated effect of many small adequate ones",
    (r) =>
      "The kind of place that historians overlook and travellers remember fondly — no dramatic history, but a persistent one",
    (r) =>
      "Stable enough that its tensions are the slow kind: inherited grievances, unresolved inheritances, debts that have been rolled over so many times no one remembers the original amount",
    (r) =>
      r.length >= 3
        ? `A settlement shaped by the accumulated weight of ${r
            .map((s) => s.name)
            .slice(0, -1)
            .join(
              ", ",
            )} and ${r[r.length - 1].name} — no single defining moment, but enough of them that the character formed anyway`
        : "Shaped by events that left no monuments but changed things nonetheless — the kind of history that only becomes visible in the way people behave",
    (r) =>
      r.some((s) => s.type === "economic")
        ? `A settlement that has built its identity around commerce rather than conflict — the ${(r.find((s) => s.type === "economic") || r[0]).name} proved that economic power endures longer than military prestige`
        : "The kind of place where records are well-kept and disputes are resolved through precedent — not because the people are unusually reasonable, but because they have learned the cost of the alternative",
    (r) =>
      "More complex than it appears from the road. Outsiders see a functioning market settlement. Residents know the version that has footnotes.",
    (r) =>
      "A settlement whose great advantage is that nothing has ever forced it to become anything in particular. It has kept its options, its neighbours, and its temper, and it regards all three as achievements — correctly, though few visitors see why",
    (r) =>
      r.length >= 2
        ? "The tensions here are the domestic kind — inheritances, boundaries, precedence at the festival — and they are managed rather than resolved, passed down like the disputes they are, each generation adding a footnote and settling nothing"
        : "Little has happened here worth recording, which the residents will tell you is the point. The work of keeping a place uneventful is real work, and they have done it well enough that no one thanks them for it",
  ],
  religious_heavy: [
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} divided this settlement's relationship to faith in ways that never fully healed — the institution persisted; the unity didn't`,
    (r) =>
      `Religious history here is complicated: the ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} left an official account and an unofficial one, and which version you know says something about who you are`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} is why the local clergy and the civic authority maintain a relationship of careful, documented mutual respect rather than the easy cooperation you find elsewhere`,
    (r) =>
      `Visitors sometimes ask why the people here seem so personally invested in theological questions that most settlements leave to the priests. The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} is the explanation`,
    (r) =>
      `Faith here is a matter of loyalty as much as belief — the ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} drew a line through the community, and which side of it a family stood on is still remembered, still counted, still quietly held against them`,
    (r) =>
      `The calendar here is crowded with observances an outsider cannot keep straight, and the crowding is the point: the ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} left rival claims to the same holy days, and each is kept as loudly as the other`,
    (r) =>
      `There is a wariness in how people here speak of doctrine — the ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} made it dangerous to be too certain out loud, and the habit of caution has outlived the danger that taught it`,
  ],
  magical_heavy: [
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is why this settlement treats arcane matters with more caution than neighbours do — not superstition, institutional memory`,
    (r) =>
      `A settlement with an unusual relationship to magic: the ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} made it both more dependent on arcane resources and more wary of them simultaneously`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is still discussed — carefully — by the practitioners who work here. The details are not shared with outsiders, which outsiders find either sinister or sensible depending on their own experience with magic`,
    (r) =>
      `Ask what the local policy on arcane practice is and you will get a longer answer than the question seems to warrant. The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is why`,
    (r) =>
      `The settlement relies on arcane workings it does not entirely trust — the ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} proved the two feelings can coexist indefinitely, and here they do, in the same shrug people give the weather`,
    (r) =>
      `There are places in and around the settlement that people simply do not go, and the reasons have hardened into custom without needing to be spoken. The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is where the custom started`,
    (r) =>
      `The practitioners here are respected, consulted, and watched — all three at once, without contradiction. The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} taught the settlement that the useful and the dangerous are frequently the same people`,
  ],
};
