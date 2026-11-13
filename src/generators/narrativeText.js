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
 * The pure string tables (ARRIVAL_SCENES, TERRAIN_NARRATIVE_HOOKS)
 * stay in src/data/narrativeData.js.
 */

import { random as _rng } from "../kernel/rngContext.js";
import { pickRandom2 } from "./helpers.js";
import { speakTierNoun } from "../domain/display/stateProse/stateProseKernel.js";
import { tierNounFor } from "../domain/display/stateProse/weaveBlock.js"; import { foodStoreWord } from "./economy/foodBalance.js"; // R2-CODE-A item 1: one line, so no cited line moves

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

/**
 * SIZE ruling 2 (2026-11-03): speak each line in the settlement's own tier noun ("the thorp no
 * longer has"), through the dossier kernel's own helper, on the pressure detail's tier.
 * Identity for a town or an unknown tier. Mapping the array draws nothing, so no pick moves.
 * @param {{tier?: unknown}} r @param {Array<string | { text: string }>} lines @returns {Array<string | { text: string }>}
 */
const speakTierLines = (r, lines) => {
  const noun = tierNounFor(r && r.tier);
  // a declared row (CENSUS-2d, R-C) keeps its declaration and speaks its text
  return lines.map((line) => (typeof line === 'string' ? speakTierNoun(line, noun) : { ...line, text: speakTierNoun(line.text, noun) }));
};

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
// ⛔ `r.commodity` IS SOMETIMES PLURAL, SO NO TEMPLATE MAY MAKE IT THE SUBJECT OF A
// NUMBER-SENSITIVE VERB. deriveTradeCommodity returns a bare label and four of its
// fifteen are plural (`gems`, `crafts`, `spices`, `medicinal herbs`), with the
// first-word fallback able to return others - and nothing on the object says which.
// A famine hook shipped reading "knows where the hoarded medicinal herbs IS, and
// isn't saying" on the Overview, the DM Summary and Table View at once. The cure is
// invariant phrasing, never agreement logic: there is no plural flag to read, and
// adding one would put a grammar field on the generated object to serve prose.
// Keep verbs after `${r.commodity}` number-free (`can be found`, `cannot`, `never
// came`), or make the commodity a modifier of a noun that carries the number itself
// (`the ${r.commodity} reserves`, `every ${r.commodity} cache`), as the pools around
// these three already do.
export const PRESSURE_SENTENCES = {
  under_siege: (r) => [
    `${r.name} is surrounded. Supply lines are cut, morale is fracturing, and ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "the leadership"} is deciding whether to negotiate terms or hold out for relief that may not be coming.`,
    { text: `The siege has entered its second week; ${r.govFaction || "the council"} controls the rationing and the gates, which means they control everything else too, for now.`, needs: ['gate'] },
    `Every ${foodStoreWord(r.foodRecord)} cache in ${r.name} has been inventoried and argued over; the next argument will be about what to give up and what to defend to the end.`,
    { text: `The walls of ${r.name} have held so far, but the relief has not come, and every day it does not, more of the blame falls on ${r.govFaction || "the council"}.`, needs: ['walls'] },
    { text: `${r.name} counts its mouths and its days of ${foodStoreWord(r.foodRecord)} every morning, and the people on the walls watch each other as closely as they watch the enemy.`, needs: ['walls'] },
    `Word came into ${r.name} three days ago that the relief column had turned back; ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "the leadership"} has not made it public, and the effort of not making it public is beginning to show.`,
  ],
  famine: (r) => [
    `${r.name} is two bad weeks from genuine starvation; the remaining ${foodStoreWord(r.foodRecord)} reserves are in few hands, and whoever holds them is not discussing it openly.`, // R2-CODE-A P1 (c): it named the leading power as the holder; the record names the holder only in the crisis cast (the granary lever), derived AFTER this line is drawn (steps/resolveCrisisCast.js), so the line names none
    `Since the harvest failed, whoever holds the food in ${r.name} holds the power, and at least three powers are fighting over the stores.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "Someone"} knows where the hoarded ${foodStoreWord(r.foodRecord)} can be found and is not saying; someone close to them is among the hoarders.`,
    `The bakers of ${r.name} have started cutting the bread with things that are not flour; everyone can taste it, and the fact that nobody complains is the most alarming part.`,
    `${capFirst(r.govFaction) || "The council"} of ${r.name} promised a fair share of the ${foodStoreWord(r.foodRecord)} reserves last week, and little of it has reached the poor.`,
    { text: `Hunger has made ${r.name} quiet. The market still opens, the queues still form, but the haggling has gone out of people. They take what they are given and calculate, silently, how long it will last.`, needs: ['market'] },
  ],
  occupied: (r) => [
    `${r.name} is occupied; ${r.govFaction || "the administration"} still meets, but nothing it decides stands until the occupiers agree.`,
    `The occupation of ${r.name} has lasted long enough to split it: some families now work with the occupiers and some hide the people who fight them, often on the same street.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "The most senior local official"} is simultaneously expected to enforce the occupiers' directives and protect the people those directives are aimed at: a position that is becoming untenable.`,
    `The occupiers of ${r.name} are careful to leave the forms of local rule in place (${r.govFaction || "the council"} still meets, still signs, still presides) which fools no one and is not meant to.`,
    `Every household in ${r.name} has decided what it would do if the occupiers asked it for names, and every one of them hopes it is never asked.`,
    `The curfew in ${r.name} is enforced unevenly, and the unevenness is the point: no one can be sure which night, or which street, or which face at the checkpoint will decide that the rules apply to them.`,
  ],
  politically_fractured: (r) => [
    `${r.name} has no effective government; ${r.topFaction || "the leading power"} controls one district and the institutions inside it, a rival controls another, and the contested space between them is where things go wrong.`,
    `Three powers in ${r.name} are each waiting for one of the others to slip, and meanwhile nothing gets mended and no quarrel gets settled.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "The most senior figure"} is the only person all three powers will still speak to, which makes them either the key to resolution or the next target.`,
    `Nothing gets decided in ${r.name}, because any decision would hand one power a win the others will not allow, and every power prefers the deadlock to losing.`,
    { text: `${r.name} has two of everything now, two watches and two courts of a kind, and people have learned which one to ask for which favour.`, needs: ['watch'] },
    `The last thing ${r.topFaction || "the leading power"} and its rivals agreed on in ${r.name} was that the disagreement should not be allowed to reach the streets; that agreement is the only thing holding, and it is fraying.`,
  ],
  indebted: (r) => [
    `${r.name} owes more than it can repay; the creditor's representative arrived last month, and every civic decision since has been made with one eye on what they might accept as partial satisfaction.`,
    `${capFirst(r.topFaction) || "The dominant power"} took the loans and ${r.govFaction || "the current council"} is repaying them: a distinction that has not gone unnoticed and is not forgotten.`,
    `The debt has a clause that ${r.topNPCName ? r.topNPCName + " has read" : "almost nobody has read"} and that would change the entire conversation if it became public.`,
    `The creditor has begun taking payment from ${r.name} in things other than coin (a warehouse here, a toll right there), and each transfer is legal, documented, and slightly worse than the last.`,
    `${r.name} still paints its civic buildings and still held its festival, all on borrowed money; everyone knows it, and nobody says it aloud.`,
    `The interest on ${r.name}'s debt now outpaces what the ${r.commodity || "trade"} can bring in; the numbers have been quietly rearranged twice to hide it, and there is no third arrangement that works.`,
  ],
  recently_betrayed: (r) => [
    `Someone inside ${r.name} sold something important not long ago, and now everyone suspects everyone else; deals that took a handshake now take a witness.`,
    `The betrayal's consequences are still unfolding; ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "the most senior official"} knows more than they've disclosed about what was sold and to whom.`,
    `${capFirst(r.govFaction) || "The council"} has been investigating the betrayal for three weeks with nothing to show for it, which either means they're incompetent or the answer leads somewhere they don't want to go.`,
    `Since the betrayal, ${r.name} has become a place where people finish fewer sentences and lock more doors; the trust that made the settlement work is not gone, but it is being rationed.`,
    `Everyone in ${r.name} has privately assembled their own list of who might have done it, and the lists do not agree, and the disagreement is doing almost as much damage as the original act.`,
    `The betrayal cost ${r.name} something specific (a contract, a caravan, a name that vouched for the place), and the loss of it is only now working its way through the ledgers, arriving as bad news that seems, wrongly, unrelated.`,
  ],
  infiltrated: (r) => [
    `${r.name} does not know it has been infiltrated; for months ${r.govFaction || "the council"} has been deciding things one way, and only now can anyone see which way.`,
    `Someone has lived in ${r.name} long enough to learn its weak points, its powers and whom it trusts, and is using all three.`,
    `Three separate things have gone slightly wrong in ${r.name} recently, in ways that look like bad luck; they are not bad luck.`,
    `The infiltration of ${r.name} shows only in negatives: the meeting that was rescheduled at exactly the wrong moment, the shipment that was delayed just long enough, the appointment that went to the second-best candidate for reasons no one can quite reconstruct.`,
    `Whoever is working inside ${r.name} has asked for nothing yet; they are still earning trust, and ${r.govFaction || "the council"} has not noticed.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "One trusted figure"} has become, without anyone deciding it, the person through whom a surprising amount of ${r.name}'s sensitive business now passes, which is either coincidence or the whole design.`,
  ],
  plague_onset: (r) => [
    { text: `Something is spreading in ${r.name}; the quarantine is partial, the healers are overwhelmed, and the ${r.topNPCRole || "official"} who first identified it has gone quiet in a way that suggests either pressure or something worse.`, needs: ['healer'] },
    "The disease is not a plague yet, but every day the quarantine is ignored or bargained around brings it closer.",
    `${capFirst(r.govFaction) || "The council"} is playing the outbreak down, and what people are told is no longer what is true.`,
    `The sickness in ${r.name} has already sorted the population into those who can afford to leave, those who can afford to isolate, and those who can do neither, and the last group has noticed the sorting.`,
    { text: `The healers of ${r.name} have stopped arguing about what the illness is and started arguing about what to do with the bodies, which is the point at which denial stops being an option for anyone.`, needs: ['healer'] },
    { text: `A cordon has gone up around one quarter of ${r.name}, and the people inside it and the people outside it are already telling different stories about why: stories that will outlast the sickness whichever way it goes.`, needs: ['population: > small'] },
  ],
  succession_void: (r) => {
    const weeksAgo = Math.floor(_rng() * 8) + 2;
    return [
      `${r.name}'s last strong leader died ${weeksAgo} weeks ago, and ${r.topFaction || "the dominant power"} is taking over the offices before anyone else can claim them.`,
      `Three different people in ${r.name} believe they should be in charge; two of them are wrong; none of them is certain; all of them are acting.`,
      "Everyone can see the seat is empty, and every claimant is buying support with promises that will have to be paid.",
      `The old ruler of ${r.name} left no clear heir, and everyone who did well under the old order is gathering followers to back a claim.`,
      { text: `${r.name} is being run, for the moment, by whoever holds the keys, the seals, and the granary: three things that used to be held by one office and are now held by three people who do not trust one another.`, needs: ['institution: granary'] },
      `The succession in ${r.name} will be settled by the ${r.commodity || "trade"} more than by any claim of blood or law: whoever the merchants and the creditors decide to deal with becomes, retroactively, the legitimate successor.`,
    ];
  },
  monster_pressure: (r) => [
    `${r.name}'s outlying farms are being hit one after another, each one near the last; whatever is out there is choosing them.`,
    `The defences of ${r.name} were built for quieter years than these, as ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : r.milForce || "the defenders"} warned at the last muster.`,
    "Three farmsteads have been abandoned in the last month; the families who abandoned them know something about what they saw that they haven't reported to the authorities.",
    { text: `${r.name} has drawn its edges inward (fields left unworked, a mill standing idle) trading the ${r.commodity || "harvest"} it needs for a perimeter ${r.milForce || "the defenders"} can actually hold.`, needs: ['institution: mill'] },
    `The bounty ${r.govFaction || "the council"} posted for the creature has attracted the wrong sort of help to ${r.name}: hunters who are more dangerous than useful, and who will expect payment whether or not the thing is dead.`,
    { text: `Whatever is preying on ${r.name} has learned the settlement's patterns (when the patrols pass, where the walls are thin) which is not something a beast does, and admitting that is the first hard conversation no one wants to open.`, needs: ['walls'] },
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
          `The commons of ${r.name} have stopped obeying. ${capFirst(r.govFaction) || "The governing authority"} still holds the buildings and the official seal, but its orders go unanswered, and the first power leader to offer something better will find people ready to follow.`,
          `The streets of ${r.name} have gone quiet, and everyone is waiting for something to break. ${capFirst(r.govFaction) || "The governing authority"} gives orders that are heard and not obeyed, and each one weakens it further.`,
          `In ${r.name} the rents go uncollected, the summons go unanswered, and the men ${r.govFaction || "the governing authority"} sends to enforce either turn back or turn coat. The revolt has not started because it has, in every way that matters, already happened.`,
        ]
      : [
          `The challenge to ${r.govFaction || "the current authority"} in ${r.name} comes from its own officials: taxes held back, decisions left unsigned, a coalition forming. ${capFirst(r.govFaction) || "The governing power"} knows it, and cannot move against it without making it stronger.`,
          `The insurgency in ${r.name} wears a clerk's coat. Permits stall in the right offices, funds arrive short and late, and the people doing it can each point to a rule that excuses them. ${capFirst(r.govFaction) || "The governing power"} is being strangled by its own procedures, wielded by people who have read them more carefully than it has.`,
          `No one in ${r.name} is marching, and that is what makes it dangerous. The opposition to ${r.govFaction || "the current authority"} is a patient, well-lawyered thing that means to inherit the settlement intact rather than take it by force, and it is close to being able to.`,
        ];
  },
  // WIRING-W0 (2026-11-07, R-W7 e): THE DIRECTION IS THE RECORD'S (`r.migrationDirection`, from
  // stress[].direction; domain/migrationDirection.js), never this closure's. The economy branch below
  // chooses only the TONE of an arrival; a record that declares departures reads the third set.
  mass_migration: (r) => speakTierLines(r, (() => {
    var o;
    if (r.migrationDirection === 'departures') return [
      `${r.name} is emptying by the season. The families who could leave have gone, and ${r.govFaction || "the governing authority"} is keeping the same offices running on half the hands.`,
      `The road out of ${r.name} is busier than the road in. Shuttered houses stand on every street, and the people who stayed are counting who will go next.`,
      `Every month fewer hearths are lit in ${r.name}. ${capFirst(r.govFaction) || "The governing authority"} has stopped calling it a bad season and has not yet found a word for what it is.`,
    ];
    return (((o = r.compound) == null ? void 0 : o.economyOutput) || 50) >= 50
      ? [
          // COHERENCE-PRESUME: the market was incidental and the draw never honoured its `needs` (presume-village-38)
          `${r.name} is taking in more people than it was built for. The newcomers and the old residents share the same streets, but not a language, customs or trust, and ${r.govFaction || "the governing authority"} cannot keep up with how fast they come.`,
          `The ${r.commodity || "trade"} that made ${r.name} worth coming to cannot keep pace with the number who came. Housing is short, rents have doubled, and the newcomers who were welcomed as labour a year ago are being spoken of as a problem this one, though they have done nothing but arrive.`,
          `Newcomers have built a second, poorer town at the edges of ${r.name}, and ${r.govFaction || "the governing authority"} has not decided whether it governs it; until it does, the outer town keeps its own rules.`,
        ]
      // ONE DIRECTION (chair ruling 2, 2026-10-30, ODQ §934.101): mass migration is an INFLUX everywhere it is
      // named (the crisis card: "receiving more people than its infrastructure was built for"), so the weak-economy
      // arm tells the same arrival as a town that cannot carry it, never a departure. Three lines for three, so the
      // draw does not move.
      : [
          { text: `${r.name} is taking in more people than it can feed. The newcomers came for work the town no longer has, and ${r.govFaction || "the governing authority"} is rationing what there is between families who have lived here for generations and families who arrived last month.`, needs: ['starving'] },
          `Every season brings more households to ${r.name} and no more work. The newcomers camp where they can, and ${r.govFaction || "the governing authority"} is counting heads it has no plan for.`,
          `The road into ${r.name} is busier than the road out, and both are watched. By ${r.govFaction || "the governing authority"}, which can neither turn people away nor keep them fed, and by the old residents, who are keeping a private account of who arrived.`,
        ];
  })()),
  wartime: (r) => {
    var o, d;
    return (((o = r.compound) == null ? void 0 : o.militaryEffective) || 50) >= 55 &&
      (((d = r.compound) == null ? void 0 : d.economyOutput) || 50) >= 45
      ? [
          { text: `${r.name} is at war and, for now, on the right side of it: contracts are flowing, the garrison is reinforced, and the crown is paying. The men who left to fight have not come back.`, needs: ['garrison'] },
          { text: `Being on the right side of it keeps the forges of ${r.name} running day and night, and the ${r.commodity || "export"} trade has never paid better, and the place now needs the war to go on to pay for what the war has already cost it.`, needs: ['institution: smith'] },
          { text: `${r.name} is prospering on the right side of it: full warehouses, a reinforced garrison, coin moving fast, and all of it lost if the war turns.`, needs: ['garrison'] },
        ]
      : [
          `${r.name} is losing people and resources to a war it did not choose the terms of. Conscription has hollowed out the skilled workforce. ${capFirst(r.govFaction) || "The governing authority"} signed a requisition order last week that it cannot afford and could not refuse. The settlement is loyal. It is also running thin.`,
          `The war reaches ${r.name} as a series of demands rather than battles: levies of men, of ${r.commodity || "grain"}, of coin, each one framed as duty and none of them refusable. ${r.name} is losing people and resources it will not get back, and the front it is bleeding for is somewhere it will never see.`,
          `Every capable pair of hands ${r.name} could spare, and several it could not, has gone to the war; what remains is losing people and resources by attrition (a workshop closed for want of a master, a field unsown for want of a back) while ${r.govFaction || "the governing authority"} reports the settlement loyal and does not report the rest.`,
        ];
  },
  // religious_conversion (FIXED): the old selector picked one of three SCENARIOS by
  // name.length % 3 — deterministic per name, so a settlement could never vary its
  // sentence across regens (the survey's CRITICAL finding). Now the closure returns
  // ALL scenario×phrasing variants and generatePressureSentence's single pickRandom2
  // selects one — draw-count unchanged (pickRandom2 already fired on the 1-element
  // array), real re-roll variety gained. Index 0 stays the canonical scenario-0 line.
  religious_conversion: (r) => [
    `The new faith in ${r.name} has no building yet, only its congregation, and ${r.govFaction || "the authorities"} cannot decide whether to treat it as a matter of faith or of politics; both sides read the delay as a sign.`,
    { text: `${r.name}'s religious community has formally split. Both sides hold services, keep records, and claim the legitimate succession. Every legal document that required religious sanction is now in a grey zone that the courts are not equipped to resolve quickly.`, needs: ['institution: temple'] },
    `The conversion order in ${r.name} was accepted within the week, faster than anyone expected, and nobody in authority is asking whether the old rites still go on behind closed doors.`,
    `The new faith has taken the young of ${r.name} first, which the old faith has noticed and cannot answer. You cannot argue a congregation back, and every festival now draws two crowds of visibly different ages to two different squares.`,
    `${capFirst(r.govFaction) || "The authorities"} in ${r.name} backed the winning faith a little too early and a little too visibly, and now find that a matter of belief has become a matter of who owes whom: the worst kind of debt to have taken on.`,
    `The conversion in ${r.name} is being managed as a property question as much as a spiritual one: which endowments, which burial rights, which festival days transfer with the congregation. The theology was settled quickly. The estate is where the fighting is.`,
  ],
  slave_revolt: (r) => [
    `The revolt in ${r.name} is too big to put down by force alone: the enslaved hold whole districts and are organised, and the governing power has not committed what crushing them would take. The slave trade has stopped. What is left to settle is what ${r.name} becomes afterwards, and who decides.`,
    `${r.name} has stopped functioning as the thing it was. The labour it was built on has withdrawn itself, by force, and every calculation the settlement made about its own wealth turns out to have rested on people who are no longer willing to be a line in the ledger.`,
    `The rising in ${r.name} did not come from nowhere, though ${r.govFaction || "the governing power"} is speaking of it as though it did. Everyone who is honest knows the grievances were real, old, and ignored, which makes the question of how to end it far harder than the question of how it began.`,
    `In ${r.name} the two sides have discovered they cannot simply win: the enslaved cannot hold the whole settlement, and ${r.govFaction || "the governing power"} cannot retake it without destroying the ${r.commodity || "trade"} that made it worth holding. What comes next will be a bargain neither wanted, struck between people who no longer pretend to be anything but enemies.`,
  ],
};

// ─── Historical character flavor text (consumed by narrativeGenerator/history) ──
// POLITICAL_FLAVOR maps history-event-type patterns to arrays of description
// template functions. Several call pickRandom2(...) at render time to select a
// representative event from the supplied list.
// CENSUS-2e unit 2 (ledger docs/census/declarations/POLITICAL_FLAVOR.json): a row that presumes a
// fact is the declared `{ text: <template>, needs?, crisis? }` (R-C), read through `textOf` by
// historyCoherence.js until CENSUS-1f wires the cascade through `drawDeclared`. The reserve row's
// walls stay with POLITICAL_FLAVOR_SIBLINGS below (CENSUS-1c, resolved after the draw), so the row
// declares only its granaries. NOT declared, recorded in the lane doc: catastrophic[1] (its walls
// and militia are one BRANCH of the closure, monster incursions only; a row atom would refuse the
// other branch) and religious_heavy[0] / [2] (their clergy and institution want a sacred house of
// any kind, not a temple: waiting on sacredHouse, R-AE).
/** The ledger's `{crisis-scoped}` pools (R-AF): the cascade's wiring passes `crisisScoped: true`. */
export const POLITICAL_FLAVOR_CRISIS_SCOPED = Object.freeze(['stable']);
/**
 * #9 (STYLE-RULINGS §1, W5 HIS 2026-11-07): THE HISTORICAL CHARACTER READS THE MAJOR EVENTS. The
 * `stable` pool is drawn at 15 per cent on ANY record, so its lines that deny a great event ("no
 * dramatic history", "events that left no monuments") printed over towns whose History tab lists a
 * major or catastrophic row. A row whose severity is `major` or `catastrophic` is a major event
 * (historyData's ladder: minor · major · catastrophic); with one on the record those lines name it.
 * @param {{severity?: unknown}} e @returns {boolean}
 */
const isMajorEvent = (e) => e?.severity === 'major' || e?.severity === 'catastrophic'; /** R2-CODE-A-2 (the cold list REVIEW-W2A-3, MEDIUM #817): THE THREE LINES THAT NAME A MAJOR EVENT READ HOW MANY THERE ARE. Each named the first and denied the rest ("aside", "Apart from", "the one event"); with two or more on the record they name the first two and deny none. A branch inside the drawn closure, so no draw moves. @param {Array<{severity?: unknown, name?: unknown}>} r @returns {string[]} the major events' names, in the record's order */ const majorNamesOf = (r) => r.filter(isMajorEvent).map((e) => String(e.name));

export const POLITICAL_FLAVOR = {
  political_heavy: [
    // COHERENCE-PRESUME (the chair's ruling B): an event past sixty years is older than its bearers
    // (heraldCausalGrammar.js :: TIME_BANDS), so the two lines below name no living witness of one.
    // The one pick each line made is made in the same place; only the words follow its age.
    (r) => {
      const e = pickRandom2(r.filter((s) => s.type === "political"));
      return `Power here has changed hands ${r.length > 2 ? "more than once " : ""}${e?.yearsAgo > 60 ? "" : "within living memory"}`.trimEnd()
        + `, and since the ${e?.name || "last upheaval"} nobody has been sure who really rules`;
    },
    (r) => {
      const e = pickRandom2(r.filter((s) => s.type === "political"));
      return e?.yearsAgo > 60
        ? `People here still argue about the ${e.name}, and every family still teaches its children which side it took`
        : `People here still argue about the ${e?.name || "this event"}: those who lived through it speak of it as if it were last year, and their children treat it as a warning`;
    },
    (r) =>
      `The current governing arrangements are a compromise nobody fully chose: shaped more by the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} than by any founding design`,
    (r) =>
      `Authority here has a provisional quality, as though everyone is still waiting for the arrangement that followed the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} to be replaced by a permanent one that never comes`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} decided who holds power here, but not whether they deserve it, and the powers are still arguing the second point`,
    (r) =>
      `The offices here are filled and the seals are real, but people still ask in private whether the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} gave the present rulers any right to rule, and nobody in charge wants the question asked aloud`,
  ],
  // R-AO (CENSUS-2f): in the mixed pools (disaster_heavy, religious_heavy, magical_heavy) every bare row was read and
  // presumes nothing: marked `colour: true`. `stable` is crisis-scoped, so its bare rows presume calm and stay bare.
  disaster_heavy: [
    { text: (r) =>
      `A settlement defined by what it survived. The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} shaped how this community thinks about risk, preparation, and who gets left behind`, colour: true },
    { text: (r) =>
      `Cautious and self-sufficient in ways that visitors find excessive. The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} made it that way and the lesson has never been unlearned`, colour: true },
    { text: (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} is the reference point for everything: before it, during it, after it. A generation has grown up for whom it is history rather than memory`, colour: true },
    { text: (r) =>
      `People here are practical to a degree that outsiders mistake for coldness. The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} taught them that in a disaster, sentiment costs lives`, colour: true },
    { text: (r) =>
      `The settlement keeps more in reserve than its size explains: granaries a little too large, walls a little too strong. The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} is the reason, and no argument about the expense has ever won against that memory`, needs: ['institution: granary'] },
    { text: (r) =>
      `Ask why a custom here seems excessive and the answer is always the same shape: it did not used to be, until the ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} made it necessary, and now it is simply how things are done`, colour: true },
  ],
  economic_heavy: [
    (r) =>
      `A settlement whose identity was built on commerce. The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} didn't create the merchant class here, but it defined what the merchant class could become`,
    (r) =>
      `Economically dynamic in ways that occasionally tip into instability: the ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} is recent enough to remind everyone that prosperity here has always been earned and can always be lost`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} gave this place its current shape: the physical one as much as the social one`,
    (r) =>
      `Money is discussed openly here in a way that scandalises visitors from more genteel places. The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} taught everyone that pretending not to care about it is a luxury for people who already have it`,
    (r) =>
      `A family's standing here is its wealth, and no one pretends otherwise. The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} decided who held the money, and those families have held everything else ever since`,
    (r) =>
      `People here are careful not to show off their money. The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} is recent enough that flaunting wealth looks like having learned nothing from it`,
  ],
  catastrophic: [
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "disaster"
        ? `Everything before the ${s.name} is referred to as 'the old settlement'. What exists now was built after, by different people, with different assumptions, over different rubble`
        : s.type === "occupation_infiltration"
          ? `The ${s.name} ended, but the habits of occupation never fully left: the way people speak about authority, the way they watch strangers, the way official records from that period are still treated with suspicion`
          : `Everything before the ${s.name} is referred to as 'the old settlement'. What exists now was built after, by different people, with different assumptions, over different rubble`;
    },
    // CENSUS-2g unit 4 (R-AS amended, the chair's answer 1): LISTED, not split, not declared. The
    // branch is chosen by the EVENT'S TYPE, so the monster branch presumes walls + a militia it never
    // verifies; printed in 0 of 1,000, both facts true on the final record wherever it could print;
    // waits on a per-branch closure declaration channel (the mechanism lane's wave 2). The other
    // branch is colour. A split would move 166 of 1,000 births by the modulus (refused).
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "monster_incursion"
        ? `The ${s.name} is why this settlement has walls where others do not, why the militia drills when other villages have forgotten how, and why certain paths through the surrounding territory are still considered inadvisable`
        : `This place is older than the ${s.name}, but people here date everything from it: before it, and after`;
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
        : `The ${s.name} left the buildings standing and changed everything else; the place was rebuilt afterwards, down to what people believe about it`;
    },
    (r) =>
      `Older residents still distinguish between 'the original settlement' and 'what we have now'. The ${(r.find((o) => o.severity === "catastrophic") || r[0]).name} is where that line falls, not a clean line, but a real one`,
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "religious"
        ? `The ${s.name} is why the relationship between civic and religious authority here is more carefully managed than in settlements that have never had to think about it`
        : `The ${s.name} is why this place looks as it does: it stood here before, but what stands today was rebuilt afterwards`;
    },
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      // COHERENCE-PRESUME (the chair's ruling B): past sixty years nobody who lived through it is alive
      return s.yearsAgo > 60
        ? `The ${s.name} is this place's defining story, and every family here still tells its own part of it`
        : `The ${s.name} is this place's defining story, and the people who lived through it are still here to tell it`;
    },
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "disaster" || s.type === "monster_incursion"
        ? `Every plan made here now allows for the ${s.name} happening again; nobody expects it, but nobody expected the first one either`
        : `The ${s.name} changed what people here believe can happen to them, and that has been slower to rebuild than any building`;
    },
  ],
  layered_history: [
    (r) =>
      `The history here comes in layers. The ${r[0].name} laid the first, and everything since sits a little awkwardly on top of it`,
    (r) =>
      `The ${r[0].name} set the first rules here; later events changed them, and not always cleanly`,
    (r) =>
      `Ask what shaped this settlement and you will get different answers depending on who you ask and which generation they lived through. The ${r
        .map((s) => s.name)
        .slice(0, 2)
        .join(", ")} left different marks on different people`,
    (r) =>
      "Several important events, none of them decisive. Its character built up slowly, with no single break, and that makes it hard to explain and hard to shake",
    (r) =>
      "So much has happened here that people disagree about which part matters most, and they enjoy the argument",
    (r) =>
      `Each generation here has changed the last one's arrangements without clearing them away. The ${r[0].name} is the oldest layer still visible, and everything since has been built around it`,
    (r) =>
      "This is a settlement of accommodations and half-repairs, where every institution bears the compromise that let it survive the era before this one. It works, in the way a much-mended tool works: not elegantly, but reliably, and no one can quite remember what it looked like new",
  ],
  stable: [
    // #9: the denial reads the major events first (see isMajorEvent above).
    (r) =>
      (majorNamesOf(r).length > 1 ? `It has come through the ${majorNamesOf(r)[0]} and the ${majorNamesOf(r)[1]} and simply continued, and that took more work than it looks` : r.some(isMajorEvent)
        ? `Apart from the ${r.find(isMajorEvent).name}, its history is steady: it simply continued, and that took more work than it looks`
        : "Unremarkable in its history: no catastrophe, no conquest, no great disruption. It simply continued, and that took more work than it looks"),
    { text: (r) =>
      "An ordinary place that has outlasted grander neighbours by getting the small things right, year after year", crisis: ['any'] },
    { text: (r) =>
      (majorNamesOf(r).length > 1 ? `It has come through the ${majorNamesOf(r)[0]} and the ${majorNamesOf(r)[1]}, and travellers still remember the place kindly` : r.some(isMajorEvent) ? `The ${r.find(isMajorEvent).name} aside, the history here is long and steady, and travellers remember the place kindly` : "No dramatic history here, only a long steady one, and travellers remember the place kindly"), crisis: ['any'] },
    (r) =>
      "Stable enough that its tensions are the slow kind: inherited grievances, unresolved inheritances, debts that have been rolled over so many times no one remembers the original amount",
    { text: (r) =>
      r.length >= 3
        ? `A settlement shaped by the accumulated weight of ${r
            .map((s) => s.name)
            .slice(0, -1)
            .join(
              ", ",
            )} and ${r[r.length - 1].name}: no single defining moment, but enough of them that the character formed anyway`
        : majorNamesOf(r).length > 1 ? `The ${majorNamesOf(r)[0]} and the ${majorNamesOf(r)[1]} are the events people here still date things by` : r.some(isMajorEvent)
          ? `The ${r.find(isMajorEvent).name} is the one event people here still date things by; the rest of its history is quieter`
          : "No great event marks this place; its history shows in people's habits, not in monuments", crisis: ['any'] },
    { text: (r) =>
      r.some((s) => s.type === "economic")
        ? `This place made its name in trade, not war, and the ${(r.find((s) => s.type === "economic") || r[0]).name} showed it that money lasts longer here than any military glory`
        : "Records here are kept carefully and disputes settled by precedent; people here learned the hard way what happens otherwise", crisis: ['any'] },
    { text: (r) =>
      "More complicated than it looks from the road. Outsiders see a busy market; the people who live here know the stories behind it.", needs: ['market'], crisis: ['any'] },
    (r) =>
      "Nothing has ever forced this place to change much. It has kept its options, its neighbours and its temper, and the people here count all three as achievements",
    (r) =>
      r.length >= 2
        ? "The tensions here are the domestic kind (inheritances, boundaries, precedence at the festival), and they are managed rather than resolved, passed down like the disputes they are, each generation adding a footnote and settling nothing"
        : "Little has happened here worth writing down, and the people here are proud of it: keeping a place quiet takes work, and nobody thanks them for it",
  ],
  religious_heavy: [
    // CENSUS-2f unit 5: [0]'s persisting institution and [2]'s local clergy presume a house of worship of any kind (R-AE's
    // `sacredHouse`, settled at this draw on all 1,000 soak births — R-V, R-AN); a refused row moves to the admitted argmax.
    { text: (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} split the faith here; its house of worship survived, but the congregation never came back together`, needs: ['sacredHouse'] },
    { text: (r) =>
      `Religious history here is complicated: the ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} left an official account and an unofficial one, and which version you know says something about who you are`, colour: true },
    { text: (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} is why the local clergy and the civic authority maintain a relationship of careful, documented mutual respect rather than the easy cooperation you find elsewhere`, needs: ['sacredHouse'] },
    { text: (r) =>
      `Visitors sometimes ask why the people here seem so personally invested in theological questions that most settlements leave to the priests. The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} is the explanation`, colour: true },
    { text: (r) =>
      `Faith here is a matter of loyalty as much as belief. The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} drew a line through the community, and which side of it a family stood on is still remembered, still counted, still quietly held against them`, colour: true },
    { text: (r) =>
      `The calendar here is crowded with observances an outsider cannot keep straight, and the crowding is the point: the ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} left rival claims to the same holy days, and each is kept as loudly as the other`, colour: true },
    { text: (r) =>
      `There is a wariness in how people here speak of doctrine. The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} made it dangerous to be too certain out loud, and the habit of caution has outlived the danger that taught it`, colour: true },
  ],
  magical_heavy: [
    { text: (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is why this settlement treats arcane matters with more caution than neighbours do, not superstition, institutional memory`, colour: true },
    { text: (r) =>
      `A settlement with an unusual relationship to magic: the ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} made it both more dependent on arcane resources and more wary of them simultaneously`, needs: ['magic'] },
    { text: (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is still discussed (carefully) by the practitioners who work here. The details are not shared with outsiders, which outsiders find either sinister or sensible depending on their own experience with magic`, needs: ['magic'] },
    { text: (r) =>
      `Ask what the local policy on arcane practice is and you will get a longer answer than the question seems to warrant. The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is why`, colour: true },
    { text: (r) =>
      `The settlement relies on arcane workings it does not entirely trust. The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} proved the two feelings can coexist indefinitely, and here they do, in the same shrug people give the weather`, needs: ['magic'] },
    { text: (r) =>
      `There are places in and around the settlement that people simply do not go, and the reasons have hardened into custom without needing to be spoken. The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is where the custom started`, colour: true },
    { text: (r) =>
      `The magic-workers here are respected, consulted and watched, all at once. The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} taught people here that the most useful people can also be the most dangerous`, needs: ['magic'] },
  ],
};

/**
 * DECLARED SIBLINGS (CENSUS-1c unit 1; `docs/DESIGN_POOL_CENSUS.md` §3.1, the twin tables
 * dissolved): the walls-free twin of POLITICAL_FLAVOR.disaster_heavy's reserve sentence (F11, rung 2B: soak1k-6879), keyed by SENTENCE because the line goes on to name a drawn event. Each set is the original line, declaring what it presumes, and beside it its
 * twin with the complementary atom (`twinOf` the original). The original stays where this table's
 * string consumers read it; the draw site resolves a drawn key through
 * `domain/facts/drawDeclared.js :: resolveSibling` (the original if the record admits it, else the
 * twin). Retired from the text-keyed tables `defenceTwinLines.js` / `inlandHookLines.js` (F5, F10),
 * every twin to the byte. VETOABLE wording, as before (the owner's).
 */
export const POLITICAL_FLAVOR_SIBLINGS = Object.freeze({
  'The settlement keeps more in reserve than its size explains: granaries a little too large, walls a little too strong.': Object.freeze([
    Object.freeze({ text: 'The settlement keeps more in reserve than its size explains: granaries a little too large, walls a little too strong.', needs: Object.freeze(['walls']) }),
    Object.freeze({ text: 'The settlement keeps more in reserve than its size explains: granaries a little too large, stores a little too deep.', twinOf: 'The settlement keeps more in reserve than its size explains: granaries a little too large, walls a little too strong.', excludes: Object.freeze(['walls']) }),
  ]),
});
