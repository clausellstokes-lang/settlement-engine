// stressTypes.js — PURE DATA (A+ Track H / data-schema.3).
//
// The executable `summary: (r) => …` closures (which captured rngContext.random
// and a runtime-global getInstFlags) were extracted to
// src/generators/stressNarrative.js (stressSummary). This file now holds only
// pure stressor fields — no runtime imports, no RNG capture — and is covered by
// the src/data purity lint (eslint.config.js) + tests/domain/dataPurity.test.js.
// De-minified from original minified identifiers.

// WIRING-W0 (2026-11-07, R-W7 e): the mass migration's ONE catalogue note, written once; its two
// halves (arrivals, departures) are cut from it below rather than restated (WIRING-W0-CLOSE trim).
// W4 PEOPLE second seat (2026-11-07, #30, the owner's style law): the two halves in plain words, each the
// consequence its own direction carries; the catalogue note names both, labelled, and the halves are
// cut from it after their labels, so each string still exists once.
const MIGRATION_ARRIVE = "If people arrive: ";
const MIGRATION_LEAVE = " If people leave: ";
const MIGRATION_VIABILITY_NOTE =
  "If people arrive: food will run short, there will not be work for everyone, and some newcomers will take what they cannot earn. If people leave: taxes will fall short, offices will stand empty, and the fields will lack the hands to work them.";
const MIGRATION_NOTE_CUT = MIGRATION_VIABILITY_NOTE.indexOf(MIGRATION_LEAVE);
/** @param {string} half @returns {string} the half with its first letter raised */
const sentenceOf = (half) => half.charAt(0).toUpperCase() + half.slice(1);

export const STRESS_TYPE_MAP = {
  under_siege: {
    label: "Under Siege",
    colour: "#8b1a1a",
    probability: 0.025,
    requiresTier: null,
    crisisHook:
      "The settlement is surrounded. Someone in the leadership is considering terms. Someone else is considering a desperate sortie. The players arrive as this decision is being forced.",
    viabilityNote:
      "Field work and trade have stopped, and everything now turns on how long the food and water last.",
    historyColour: "military",
  },
  famine: {
    label: "Famine",
    colour: "#8b5a1a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "A grain merchant has food, enough to matter. They will sell it, but their price is not money. The players can intervene in how this plays out.",
    viabilityNote: "No one can earn a normal living while the famine lasts, and every coin goes on food.",
    historyColour: "economic",
  },
  occupied: {
    label: "Under Occupation",
    colour: "#4a3a6b",
    probability: 0.021,
    requiresTier: null,
    crisisHook:
      "A resistance cell needs outside help: people who aren't known faces. The occupation's local collaborators include someone the players will recognise.",
    viabilityNote: "The occupiers take the revenue, and local offices work only under their eye.",
    historyColour: "political",
  },
  politically_fractured: {
    label: "Politically Fractured",
    colour: "#5a4a1a",
    probability: 0.034,
    requiresTier: null,
    crisisHook:
      "Something important (a resource, a prisoner, a decision) falls into the contested space between factions. The players can't avoid taking a side.",
    viabilityNote:
      "Nothing gets decided, repairs are put off, and every problem is left for later.",
    historyColour: "political",
  },
  indebted: {
    label: "Indebted to Outside Power",
    colour: "#1a4a5a",
    probability: 0.036,
    requiresTier: null,
    crisisHook:
      "The creditor has sent someone to collect, not money but something particular, and the locals are split between handing it over and refusing.",
    viabilityNote:
      "Much of what is earned here goes straight to the creditor, and nothing is left to build with.",
    historyColour: "economic",
  },
  recently_betrayed: {
    label: "Recently Betrayed",
    colour: "#6b1a2a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "The betrayal had consequences that are still unfolding. The betrayer may still be here. The players know something that could help identify them, or they are the only people who don't have a motive.",
    viabilityNote: "People no longer trust those in charge, and some of the work that depends on that trust has stopped.",
    historyColour: "political",
  },
  infiltrated: {
    label: "Infiltrated",
    colour: "#1a3a4a",
    probability: 0.023,
    requiresTier: null,
    crisisHook:
      "Something is slightly wrong: a decision that doesn't make sense, a face seen in too many places, a piece of information that reached the wrong hands. The players can notice if they pay attention.",
    viabilityNote: "Nothing is being taken yet; whoever has got inside wants influence, not money, for now.",
    historyColour: "political",
  },
  plague_onset: {
    label: "Disease Outbreak",
    colour: "#2a5a2a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "The healer who identified the outbreak first has gone quiet. Their last message suggested the disease is not natural. Accessing them means navigating a quarantine that is not being enforced consistently.",
    viabilityNote: "Fewer people come to market, travel is discouraged, and some goods stop arriving.",
    historyColour: "disaster",
  },
  succession_void: {
    label: "Succession Void",
    colour: "#5a3a1a",
    probability: 0.03,
    requiresTier: null,
    crisisHook:
      "Three different factions have approached the players for support, each believing they represent the legitimate or best claim. All three are partly right.",
    viabilityNote: "Big decisions wait for a new leader, and in the meantime each office does as it sees fit.",
    historyColour: "political",
  },
  monster_pressure: {
    label: "Beast & Raider Threat",
    colour: "#3a1a1a",
    probability: 0.03,
    requiresTier: null,
    crisisHook:
      "The attacks are following a pattern that suggests coordination, not desperation. Someone is directing this (whether a rival lord, a beast of unusual cunning, or something stranger). The evidence is there for anyone who looks carefully.",
    viabilityNote:
      "Trade suffers as carts stop coming, more is spent on defence, and people grow afraid.",
    historyColour: "military",
  },
  insurgency: {
    label: "Insurgency",
    colour: "#6b1a3a",
    probability: 0.029,
    requiresTier: null,
    crisisHook:
      "The governing faction knows what is happening but cannot admit it publicly without legitimising the insurgency. They need something done that cannot be official.",
    viabilityNote:
      "Taxes are disputed, some offices no longer send their revenue on, and the government runs on habit.",
    historyColour: "political",
  },
  religious_conversion: {
    label: "Religious Conversion",
    colour: "#3a1a5a",
    probability: 0.023,
    requiresTier: null,
    crisisHook:
      "The contested religious authority has left a gap in the institutions that depended on it: records, oaths, property, sanctuary. Someone is about to exploit that gap.",
    viabilityNote:
      "The tithe is split, feast days and fairs are held twice over, the old house's property has no clear owner, and trade across the faiths is harder.",
    historyColour: "religious",
  },
  slave_revolt: {
    label: "Slave Revolt",
    colour: "#6b1a1a",
    probability: 0.012,
    requiresTier: "town",
    crisisHook:
      "The revolt's leadership has demands. Some of them are negotiable. The governing faction has not admitted this publicly, and one of them is attempting to open a back channel.",
    // R-U (CENSUS-2d; the chair's answer 2 to CENSUS-2c): presumes only the enslaved and their revolt.
    // "The slave market's commercial operations are suspended." presumed a slave market, which has
    // no fact home (`institution: slave market` is listed under "needs a home").
    viabilityNote:
      "Owners keep their gangs only on work they can watch, less gets made, and everyone who keeps order is busy containing the revolt.",
    historyColour: "political",
  },
  wartime: {
    label: "Wartime",
    colour: "#5a2a0a",
    probability: 0.026,
    requiresTier: null,
    crisisHook:
      "A crown officer has arrived with requisition orders that will strip the settlement of something it cannot spare. The governing faction must decide whether to comply, negotiate, or find a third option.",
    viabilityNote:
      "The war takes most of the money: trade suffers, a few grow rich on army contracts, and the fields are short of the men called up.",
    historyColour: "military",
  },
  mass_migration: {
    label: "Mass Migration",
    colour: "#2a4a6b",
    probability: 0.025,
    requiresTier: null,
    crisisHook:
      "Whoever takes charge of the migration will decide who may stay and who must go, and will want something in return.",
    viabilityNote: MIGRATION_VIABILITY_NOTE,
    // WIRING-W0 (2026-11-07, R-W7 e): the catalogue's note above describes the TYPE both ways (the
    // compendium reads it); a settlement's entry carries the ONE half its own `direction` names
    // (stressGenerator.js :: buildStressEntry; domain/migrationDirection.js). The halves are the
    // note's own two parts, cut at " Emigration:", so the strings exist once.
    viabilityNoteByDirection: {
      arrivals: sentenceOf(MIGRATION_VIABILITY_NOTE.slice(MIGRATION_ARRIVE.length, MIGRATION_NOTE_CUT)),
      departures: sentenceOf(MIGRATION_VIABILITY_NOTE.slice(MIGRATION_NOTE_CUT + MIGRATION_LEAVE.length)),
    },
    historyColour: "demographic",
    // ONE DIRECTION (lane RUNG2-F13, on the chair's ruling 2 of 2026-10-30, ODQ §934.101): the
    // kind's direction, copied once onto the crisis entry (stressGenerator.js :: buildStressEntry)
    // and read by every migration line through domain/crisis/migrationDirection.js.
    direction: "influx",
  },
};

/**
 * THE DECLARED CELLS OF STRESS_TYPE_MAP (CENSUS-2d unit 3; Phase A's ledger
 * `docs/census/declarations/STRESS_TYPE_MAP.json`; the dissolved-twin shape CENSUS-1c keyed by
 * the original's text, accepted by the chair's R-P 3). A crisisHook / viabilityNote that presumes a
 * fact its stressor alone does not guarantee is a sibling set keyed by its own text: the original
 * with its atoms, and its twin (`twinOf`, the complementary atom) where Phase A drafted one. The
 * table's cells stay strings, so its ~20 readers are untouched; the T-branch wiring (CENSUS-1e)
 * resolves a printed cell through `resolveSibling`. A crisis-keyed cell does not re-declare its key
 * (R-B1). Each twin is the chair's ruling (R-G), recorded in docs/CENSUS_2_LANE_2026-11-04.md
 * "CENSUS-2d": a T cell, so a twin moves only the births whose original is refused, once wired.
 * @type {Readonly<Record<string, ReadonlyArray<Readonly<{ text: string, needs?: string[], excludes?: string[], twinOf?: string }>>>>}
 */
export const STRESS_TYPE_SIBLINGS = Object.freeze({
  [STRESS_TYPE_MAP.plague_onset.crisisHook]: Object.freeze([
    Object.freeze({ text: STRESS_TYPE_MAP.plague_onset.crisisHook, needs: ['healer'] }),
    Object.freeze({ text: 'The first person to name the outbreak has gone quiet. Their last message suggested the disease is not natural. Reaching them means crossing a quarantine that is not being enforced consistently.', twinOf: STRESS_TYPE_MAP.plague_onset.crisisHook, excludes: ['healer'] }),
  ]),
  [STRESS_TYPE_MAP.plague_onset.viabilityNote]: Object.freeze([
    Object.freeze({ text: STRESS_TYPE_MAP.plague_onset.viabilityNote, needs: ['market'] }),
    Object.freeze({ text: 'Travel is discouraged, and some goods stop arriving.', twinOf: STRESS_TYPE_MAP.plague_onset.viabilityNote, excludes: ['market'] }),
  ]),
  [STRESS_TYPE_MAP.religious_conversion.crisisHook]: Object.freeze([
    Object.freeze({ text: STRESS_TYPE_MAP.religious_conversion.crisisHook, needs: ['institution: temple'] }),
  ]),
  [STRESS_TYPE_MAP.religious_conversion.viabilityNote]: Object.freeze([
    Object.freeze({ text: STRESS_TYPE_MAP.religious_conversion.viabilityNote, needs: ['institution: temple', 'market'] }),
    Object.freeze({ text: 'The tithe is split, and the old house\'s property has no clear owner.', twinOf: STRESS_TYPE_MAP.religious_conversion.viabilityNote, needs: ['institution: temple'], excludes: ['market'] }),
  ]),
});
