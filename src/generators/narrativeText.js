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

import { random as _rng } from "./rngContext.js";
import { pickRandom2 } from "./helpers.js";

// ─── Per-stress pressure sentences (consumed by narrativeGenerator) ──────────
// Each value is a function (detail) => string[]. Only succession_void draws rng.
export const PRESSURE_SENTENCES = {
  under_siege: (r) => [
    `${r.name} is surrounded. Supply lines are cut, morale is fracturing, and ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "the leadership"} is deciding whether to negotiate terms or hold out for relief that may not be coming.`,
    `The siege has entered its second week; ${r.govFaction || "the council"} controls the rationing and the gates, which means they control everything else too (for now).`,
    `Every ${r.commodity || "resource"} cache in ${r.name} has been inventoried and argued over; the next argument will be about what to give up and what to defend to the end.`,
  ],
  famine: (r) => [
    `${r.name} is two bad weeks from genuine starvation; ${r.topFaction || "the merchant class"} controls the remaining ${r.commodity || "grain"} reserves and is not discussing it openly.`,
    `The harvest failure has restructured every relationship in ${r.name}. Whoever controls food now controls the settlement, and at least three factions have worked this out.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "Someone"} knows where the hoarded ${r.commodity || "grain"} is, and isn't saying, and the reasons for that silence are complicated.`,
  ],
  occupied: (r) => [
    `${r.name} is under occupation; ${r.govFaction || "the administration"} answers to outside authority now, which means every decision made here is made twice: once officially, once actually.`,
    "The occupation has been running long enough that some residents have accommodated it and some have organised against it, and the divide between those two groups is not always visible from the outside.",
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "The most senior local official"} is simultaneously expected to enforce the occupiers' directives and protect the people those directives are aimed at. It is a position that is becoming untenable.`,
  ],
  politically_fractured: (r) => [
    `${r.name} has no effective government; ${r.topFaction || "the leading faction"} controls one district and the institutions inside it, a rival controls another, and the contested space between them is where things go wrong.`,
    `Three factions are each waiting for one of the other two to make a mistake. In the meantime, ${r.name} is being administered by inertia.`,
    `${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "The most senior figure"} is the only person all three factions will still speak to, which makes them either the key to resolution or the next target.`,
  ],
  indebted: (r) => [
    `${r.name} owes more than it can repay; the creditor's representative arrived last month, and every civic decision since has been made with one eye on what they might accept as partial satisfaction.`,
    `${r.topFaction || "The dominant faction"} took the loans and ${r.govFaction || "the current council"} is repaying them. The distinction has not gone unnoticed and is not forgotten.`,
    `The debt has a clause that ${r.topNPCName ? r.topNPCName + " has read" : "almost nobody has read"} and that would change the entire conversation if it became public.`,
  ],
  recently_betrayed: (r) => [
    `Someone inside ${r.name} sold something important (recently enough that the wound is open, not yet scarred over), and the settlement's institutions are running at reduced trust while everyone suspects everyone else.`,
    `The betrayal's consequences are still unfolding; ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : "the most senior official"} knows more than they've disclosed about what was sold and to whom.`,
    `${r.govFaction || "The council"} has been investigating the betrayal for three weeks with nothing to show for it, which either means they're incompetent or the answer leads somewhere they don't want to go.`,
  ],
  infiltrated: (r) => [
    `${r.name} doesn't know it's been infiltrated; decisions at the ${r.govFaction || "council"} level have been subtly shaped for months, and the direction those decisions have been shaped toward is only now becoming legible.`,
    `Someone has been in ${r.name} long enough to understand it (its vulnerabilities, its factions, its trusted figures), and has been using that understanding systematically.`,
    `Three separate things have gone slightly wrong in ${r.name} recently, in ways that look like bad luck; they are not bad luck.`,
  ],
  plague_onset: (r) => [
    `Something is spreading in ${r.name}; the quarantine is partial, the healers are overwhelmed, and the ${r.topNPCRole || "official"} who first identified it has gone quiet in a way that suggests either pressure or something worse.`,
    "The disease has not yet become a plague, but the window for preventing that outcome is narrowing; every day the quarantine is ignored or negotiated around makes the arithmetic worse.",
    `${r.govFaction || "The council"} is managing disclosure of the outbreak, which means what residents know and what is actually true have started to diverge.`,
  ],
  succession_void: (r) => [
    `${r.name} has no effective leader; the last strong authority died ${Math.floor(_rng() * 8) + 2} weeks ago, and ${r.topFaction || "the dominant faction"} is moving faster than the settlement's institutions can process what's happening.`,
    `Three different people in ${r.name} believe they should be in charge; two of them are wrong; none of them is certain; all of them are acting.`,
    "The power vacuum is obvious to everyone; the question is not who fills it but what they do to fill it and who they owe when they have.",
  ],
  monster_pressure: (r) => [
    `The attacks on ${r.name}'s outlying farmsteads are following a pattern that doesn't fit opportunistic predation; someone or something is directing this, and the evidence is available to anyone who looks carefully.`,
    `The settlement's defences are adequate for normal times; these are not normal times, and ${r.topNPCName ? r.topNPCName + ", the " + r.topNPCRole + "," : r.milForce || "the defenders"} knows it.`,
    "Three farmsteads have been abandoned in the last month; the families who abandoned them know something about what they saw that they haven't reported to the authorities.",
  ],
  insurgency: (r) => {
    var o, d, l;
    return (((o = r.compound) == null ? void 0 : o.criminalEffective) || 0) >
      (((d = r.compound) == null ? void 0 : d.militaryEffective) || 0) &&
      (((l = r.compound) == null ? void 0 : l.economyOutput) || 50) < 48
      ? [
          `The commons of ${r.name} have stopped pretending to accept the current arrangement. ${r.govFaction || "The governing authority"} still holds the buildings and the official seal, but it is governing by momentum rather than consent. The first faction leader to offer a credible alternative will find an audience.`,
        ]
      : [
          `The challenge to ${r.govFaction || "the current authority"} in ${r.name} is institutional. It is not the street but the ledger and the meeting room. Revenue is being held. Officials are slow-walking decisions. Someone is building a coalition, and ${r.govFaction || "the governing faction"} knows it but cannot act without legitimising what they are trying to suppress.`,
        ];
  },
  mass_migration: (r) => {
    var o;
    return (((o = r.compound) == null ? void 0 : o.economyOutput) || 50) >= 50
      ? [
          `${r.name} is absorbing more people than it was built for. The new arrivals and the old residents are not yet one community. They share streets and markets but not language, custom, or trust. ${r.govFaction || "The governing authority"} is managing the rate of change rather than directing it, and the rate of change is not cooperating.`,
        ]
      : [
          `${r.name} is smaller than it was. The departure is orderly, which is its own kind of alarm. It means the people leaving have thought it through. ${r.govFaction || "The governing authority"} is trying to arrest the decline without acknowledging it publicly. So far neither effort is working.`,
        ];
  },
  wartime: (r) => {
    var o, d;
    return (((o = r.compound) == null ? void 0 : o.militaryEffective) || 50) >= 55 &&
      (((d = r.compound) == null ? void 0 : d.economyOutput) || 50) >= 45
      ? [
          `${r.name} is at war and, for now, on the right side of it. Contracts are flowing, the garrison is reinforced, and the crown is paying. The men who left to fight have not come back, which is a grief that runs beneath the commerce. The question is whether the war ends before the accounts do.`,
        ]
      : [
          `${r.name} is losing people and resources to a war it did not choose the terms of. Conscription has hollowed out the skilled workforce. ${r.govFaction || "The governing authority"} signed a requisition order last week that it cannot afford and could not refuse. The settlement is loyal. It is also running thin.`,
        ];
  },
  religious_conversion: (r) => {
    const s = r.name ? r.name.length % 3 : 0;
    return s === 0
      ? [
          `The new faith in ${r.name} does not yet have a building. It has the congregation. ${r.govFaction || "The authorities"} have not yet decided whether this is a religious matter, a political one, or both. The delay in deciding is itself a decision that both sides are interpreting.`,
        ]
      : s === 1
        ? [
            `${r.name}'s religious community has formally split. Both factions hold services, keep records, and claim the legitimate succession. Every legal document that required religious sanction is now in a grey zone that the courts are not equipped to resolve quickly.`,
          ]
        : [
            `The conversion order in ${r.name} was formally acknowledged within the week. The compliance was faster than anyone expected. The depth of that compliance is a separate question that no one with authority is asking loudly, because the answer would require a response.`,
          ];
  },
  slave_revolt: (r) => [
    `The revolt in ${r.name} is past the point where it could be resolved by show of force alone. The enslaved population controls enough territory and has enough organisation that suppression would require commitment the governing faction has not yet made. The market infrastructure that generated this situation is suspended. The question now is what the settlement looks like on the other side, and who decides.`,
  ],
};

// ─── Historical character flavor text (consumed by narrativeGenerator/history) ──
// POLITICAL_FLAVOR maps history-event-type patterns to arrays of description
// template functions. Several call pickRandom2(...) at render time to select a
// representative event from the supplied list.
export const POLITICAL_FLAVOR = {
  political_heavy: [
    (r) =>
      `A settlement where power has changed hands ${r.length > 2 ? "repeatedly" : "at least once"} within living memory. The ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} left a governing structure that still hasn't fully settled`,
    (r) =>
      `Politically restless: the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} is still treated as recent history by those who were there, and recent enough to be a warning by those who weren't`,
    (r) =>
      `The current governing arrangements are a compromise nobody fully chose. They were shaped more by the ${pickRandom2(r.filter((s) => s.type === "political"))?.name || "this event"} than by any founding design`,
  ],
  disaster_heavy: [
    (r) =>
      `A settlement defined by what it survived. The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} shaped how this community thinks about risk, preparation, and who gets left behind`,
    (r) =>
      `Cautious and self-sufficient in ways that visitors find excessive. The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} made it that way and the lesson has never been unlearned`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "disaster"))?.name || "this event"} is the reference point for everything: before it, during it, after it. A generation has grown up for whom it is history rather than memory`,
  ],
  economic_heavy: [
    (r) =>
      `A settlement whose identity was built on commerce. The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} didn't create the merchant class here, but it defined what the merchant class could become`,
    (r) =>
      `Economically dynamic in ways that occasionally tip into instability: the ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} is recent enough to remind everyone that prosperity here has always been earned and can always be lost`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "economic"))?.name || "this event"} gave this place its current shape: the physical one as much as the social one`,
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
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "monster_incursion"
        ? `The ${s.name} is why this settlement has walls where others do not, why the militia drills when other villages have forgotten how, and why certain paths through the surrounding territory are still considered inadvisable`
        : `The ${s.name} is the settlement's founding trauma, not the actual founding, which is older, but the event that made everything before it feel like a different place`;
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
      `Older residents still distinguish between 'the original settlement' and 'what we have now'. The ${(r.find((o) => o.severity === "catastrophic") || r[0]).name} is where that line falls, not a clean line, but a real one`,
    (r) => {
      const s = r.find((o) => o.severity === "catastrophic") || r[0];
      return s.type === "religious"
        ? `The ${s.name} is why the relationship between civic and religious authority here is more carefully managed than in settlements that have never had to think about it`
        : `The ${s.name} is the reason this settlement is here at all, in its current form, not because it was founded then, but because it was remade then, and what was remade is what we have`;
    },
  ],
  layered_history: [
    (r) =>
      `A settlement with enough history that the layers show. The ${r[0].name} left a foundation; everything built on top of it shows the seams`,
    (r) =>
      `Old enough to have contradicted itself. The ${r[0].name} established one set of assumptions; subsequent events revised them, not always cleanly`,
    (r) =>
      `Ask what shaped this settlement and you will get different answers depending on who you ask and which generation they lived through. The ${r
        .map((s) => s.name)
        .slice(0, 2)
        .join(", ")} left different marks on different people`,
    (r) =>
      "Several significant events, no single defining one. The character formed through accumulation rather than rupture, which makes it harder to explain and more durable",
    (r) =>
      "The history here is dense enough that residents disagree about which part of it matters most. The disagreement is itself part of the character",
  ],
  stable: [
    (r) =>
      "Unremarkable in its history, which is itself a kind of distinction: no catastrophe, no conquest, no great disruption. It simply continued, which required more work than it looks",
    (r) =>
      "An ordinary settlement that has outlasted several less ordinary ones nearby, through no single great decision, but through the accumulated effect of many small adequate ones",
    (r) =>
      "The kind of place that historians overlook and travellers remember fondly, no dramatic history, but a persistent one",
    (r) =>
      "Stable enough that its tensions are the slow kind: inherited grievances, unresolved inheritances, debts that have been rolled over so many times no one remembers the original amount",
    (r) =>
      r.length >= 3
        ? `A settlement shaped by the accumulated weight of ${r
            .map((s) => s.name)
            .slice(0, -1)
            .join(
              ", ",
            )} and ${r[r.length - 1].name}, no single defining moment, but enough of them that the character formed anyway`
        : "Shaped by events that left no monuments but changed things nonetheless: the kind of history that only becomes visible in the way people behave",
    (r) =>
      r.some((s) => s.type === "economic")
        ? `A settlement that has built its identity around commerce rather than conflict. The ${(r.find((s) => s.type === "economic") || r[0]).name} proved that economic power endures longer than military prestige`
        : "The kind of place where records are well-kept and disputes are resolved through precedent, not because the people are unusually reasonable, but because they have learned the cost of the alternative",
    (r) =>
      "More complex than it appears from the road. Outsiders see a functioning market settlement. Residents know the version that has footnotes.",
  ],
  religious_heavy: [
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} divided this settlement's relationship to faith in ways that never fully healed. The institution persisted; the unity didn't`,
    (r) =>
      `Religious history here is complicated: the ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} left an official account and an unofficial one, and which version you know says something about who you are`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} is why the local clergy and the civic authority maintain a relationship of careful, documented mutual respect rather than the easy cooperation you find elsewhere`,
    (r) =>
      `Visitors sometimes ask why the people here seem so personally invested in theological questions that most settlements leave to the priests. The ${pickRandom2(r.filter((s) => s.type === "religious"))?.name || "this event"} is the explanation`,
  ],
  magical_heavy: [
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is why this settlement treats arcane matters with more caution than neighbours do. Not superstition, institutional memory`,
    (r) =>
      `A settlement with an unusual relationship to magic: the ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} made it both more dependent on arcane resources and more wary of them simultaneously`,
    (r) =>
      `The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is still discussed (carefully) by the practitioners who work here. The details are not shared with outsiders, which outsiders find either sinister or sensible depending on their own experience with magic`,
    (r) =>
      `Ask what the local policy on arcane practice is and you will get a longer answer than the question seems to warrant. The ${pickRandom2(r.filter((s) => s.type === "magical"))?.name || "this event"} is why`,
  ],
};
