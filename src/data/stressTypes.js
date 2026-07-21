// stressTypes.js — PURE DATA (A+ Track H / data-schema.3).
//
// The executable `summary: (r) => …` closures (which captured rngContext.random
// and a runtime-global getInstFlags) were extracted to
// src/generators/stressNarrative.js (stressSummary). This file now holds only
// pure stressor fields — no runtime imports, no RNG capture — and is covered by
// the src/data purity lint (eslint.config.js) + tests/domain/dataPurity.test.js.
// De-minified from original minified identifiers.

export const STRESS_TYPE_MAP = {
  under_siege: {
    label: "Under Siege",
    icon: "",
    colour: "#8b1a1a",
    probability: 0.025,
    requiresTier: null,
    crisisHook:
      "The settlement is surrounded. Someone in the leadership is considering terms. Someone else is considering a desperate sortie. The players arrive as this decision is being forced.",
    viabilityNote:
      "Land-based economic activity is suspended. Port access (if present) provides a partial lifeline. The only metric that matters is how long food, water, and ammunition hold out.",
    historyColour: "military",
  },
  famine: {
    label: "Famine",
    icon: "",
    colour: "#8b5a1a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "A grain merchant has food, enough to matter. They will sell it, but their price is not money. The players can intervene in how this plays out.",
    viabilityNote: "Short-term economic viability is critically compromised. Normal income projections do not apply.",
    historyColour: "economic",
  },
  occupied: {
    label: "Under Occupation",
    icon: "",
    colour: "#4a3a6b",
    probability: 0.021,
    requiresTier: null,
    crisisHook:
      "A resistance cell needs outside help: people who aren't known faces. The occupation's local collaborators include someone the players will recognise.",
    viabilityNote: "Revenue flows to the occupying authority. Local institutions continue under oversight.",
    historyColour: "political",
  },
  politically_fractured: {
    label: "Politically Fractured",
    icon: "",
    colour: "#5a4a1a",
    probability: 0.034,
    requiresTier: null,
    crisisHook:
      "Something important (a resource, a prisoner, a decision) falls into the contested space between factions. The players can't avoid taking a side.",
    viabilityNote:
      "Decision-making is paralysed. Infrastructure maintenance is being neglected. Crisis is deferred, not resolved.",
    historyColour: "political",
  },
  indebted: {
    label: "Indebted to Outside Power",
    icon: "",
    colour: "#1a4a5a",
    probability: 0.036,
    requiresTier: null,
    crisisHook:
      "The creditor has sent a representative to collect (not money, but something specific). Locals are divided between compliance and resistance, and neither option is clean.",
    viabilityNote:
      "A significant portion of revenue is being extracted by the creditor. Capital investment has stopped.",
    historyColour: "economic",
  },
  recently_betrayed: {
    label: "Recently Betrayed",
    icon: "",
    colour: "#6b1a2a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "The betrayal had consequences that are still unfolding. The betrayer may still be here. The players know something that could help identify them, or they are the only people who don't have a motive.",
    viabilityNote: "Trust in institutions is low. Some key systems are not operating at full capacity as a result.",
    historyColour: "political",
  },
  infiltrated: {
    label: "Infiltrated",
    icon: "",
    colour: "#1a3a4a",
    probability: 0.023,
    requiresTier: null,
    crisisHook:
      "Something is slightly wrong: a decision that doesn't make sense, a face seen in too many places, a piece of information that reached the wrong hands. The players can notice if they pay attention.",
    viabilityNote: "No economic impact yet. The infiltration is strategic, not extractive (so far).",
    historyColour: "political",
  },
  plague_onset: {
    label: "Disease Outbreak",
    icon: "",
    colour: "#2a5a2a",
    probability: 0.027,
    requiresTier: null,
    crisisHook:
      "The healer who identified the outbreak first has gone quiet. Their last message suggested the disease is not natural. Accessing them means navigating a quarantine that is not being enforced consistently.",
    viabilityNote: "Market activity is reduced. Travel is being discouraged. Some supply chains are disrupted.",
    historyColour: "disaster",
  },
  succession_void: {
    label: "Succession Void",
    icon: "",
    colour: "#5a3a1a",
    probability: 0.03,
    requiresTier: null,
    crisisHook:
      "Three different factions have approached the players for support, each believing they represent the legitimate or best claim. All three are partly right.",
    viabilityNote: "Major decisions are deferred. Some institutions are operating autonomously, for better or worse.",
    historyColour: "political",
  },
  monster_pressure: {
    label: "Beast & Raider Threat",
    icon: "",
    colour: "#3a1a1a",
    probability: 0.03,
    requiresTier: null,
    crisisHook:
      "The attacks are following a pattern that suggests coordination, not desperation. Someone is directing this (whether a rival lord, a beast of unusual cunning, or something stranger). The evidence is there for anyone who looks carefully.",
    viabilityNote:
      "Trade disruption is reducing income. Defensive expenditure is increasing. Population anxiety is rising.",
    historyColour: "military",
  },
  insurgency: {
    label: "Insurgency",
    icon: "",
    colour: "#6b1a3a",
    probability: 0.029,
    requiresTier: null,
    crisisHook:
      "The governing faction knows what is happening but cannot admit it publicly without legitimising the insurgency. They need something done that cannot be official.",
    viabilityNote:
      "Tax collection is contested. Several institutions have stopped forwarding revenue to the central authority. Normal governance is functioning on momentum.",
    historyColour: "political",
  },
  religious_conversion: {
    label: "Religious Conversion",
    icon: "",
    colour: "#3a1a5a",
    probability: 0.023,
    requiresTier: null,
    crisisHook:
      "The contested religious authority has left a gap in the institutions that depended on it: records, oaths, property, sanctuary. Someone is about to exploit that gap.",
    viabilityNote:
      "Tithing income splits or redirects. Religious market days and fairs are contested or duplicated. Properties of the old institution are in legal ambiguity. Cross-faith trade is complicated.",
    historyColour: "religious",
  },
  slave_revolt: {
    label: "Slave Revolt",
    icon: "",
    colour: "#6b1a1a",
    probability: 0.012,
    requiresTier: "town",
    crisisHook:
      "The revolt's leadership has demands. Some of them are negotiable. The governing faction has not admitted this publicly, and one of them is attempting to open a back channel.",
    viabilityNote:
      "The slave market's commercial operations are suspended. Labour-dependent production is disrupted. The security apparatus is entirely focused on containment.",
    historyColour: "political",
  },
  wartime: {
    label: "Wartime",
    icon: "",
    colour: "#5a2a0a",
    probability: 0.026,
    requiresTier: null,
    crisisHook:
      "A crown officer has arrived with requisition orders that will strip the settlement of something it cannot spare. The governing faction must decide whether to comply, negotiate, or find a third option.",
    viabilityNote:
      "Military expenditure dominates the economy. Trade disruption is significant but offset by war contracts for some. Labour shortage from conscription affects agricultural and craft output.",
    historyColour: "military",
  },
  mass_migration: {
    label: "Mass Migration",
    icon: "",
    colour: "#2a4a6b",
    probability: 0.025,
    requiresTier: null,
    crisisHook:
      "The question is not whether things will change, but who will shape the change and what they will want in return.",
    viabilityNote:
      "Immigration: food balance stressed, labour market disrupted, criminal opportunity elevated. Emigration: tax base shrinking, institutions hollowing, labour shortage emerging.",
    historyColour: "demographic",
  },
};
