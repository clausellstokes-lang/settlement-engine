/**
 * compendium/customCategories.js — the per-bucket authoring schema + the two
 * authoring lanes. Extracted from CustomContent.jsx so the data is
 * importable without pulling the whole manager component (and to break the
 * CustomContent ↔ Dependencies ↔ FactionEventBanner import cycle).
 *
 * Pure data + the lane grouping. No store, no React state.
 */

// Per-category schema:
//   fields:        flat scalar fields rendered in the main form
//   dependencies:  refId-array fields rendered in the always-visible Dependencies
//                  section (it's what wires custom content into generation + chain
//                  discovery, so it never collapses). Each dep field is
//                  { key, label, category | categories[], single?, hint? } where
//                  `category` (or `categories` for a multi-bucket picker, e.g.
//                  tradeGoods + services) is the registry category to pick from.
export const CUSTOM_CATEGORIES = [
  { key:'institutions', label:'Institutions',  color:'#1a3a7a',
    fields:['name','category','authority','tags','essential','magical','criminal','defenseRole','foodImpact','satisfies','description','tierMin','tierMax'],
    dependencies: [
      { key:'produces',    label:'Produces (goods/services)', categories:['tradeGoods','services'],
        hint:'Trade goods or services this institution generates when present.' },
      { key:'requires',    label:'Requires (inputs)',          categories:['resources','tradeGoods','services'],
        hint:'Resources, goods, or services this institution consumes. Its absence makes the institution viability-marginal.' },
      { key:'subsumes',    label:'Subsumes (absorbs)',         category:'institutions',
        hint:'Institutions this one represents. When present, the smaller ones aren’t listed separately.' },
    ],
  },
  { key:'services',     label:'Services',      color:'#0e7c86',
    fields:['name','category','authority','criticality','economicWeight','magical','criminal','foodImpact','description','tierMin','tierMax'],
    dependencies: [
      { key:'providedBy', label:'Provided by (institution)', category:'institutions', single:true,
        hint:'The institution that offers this service (a service is something an institution provides).' },
      { key:'requires',   label:'Requires (inputs)',          categories:['resources','tradeGoods','services'],
        hint:'Resources, goods, or services this service consumes to operate.' },
    ],
  },
  { key:'resources',    label:'Resources',     color:'#1a5a28',
    fields:['name','category','criticality','foodImpact','commodities','description'],
    dependencies: [
      { key:'yields',  label:'Output (goods/services)', categories:['tradeGoods','services'],
        hint:'Goods or services this base resource yields once worked (built-in + custom). Feeds supply-chain discovery as the resource → processor → output flow.' },
      { key:'enables', label:'Enables institutions', category:'institutions',
        hint:'Institutions whose viability is boosted by access to this resource.' },
    ],
  },
  { key:'stressors',    label:'Stressors',     color:'#8b1a1a',
    fields:['name','description','severity','affects'],
    dependencies: [
      { key:'disablesInstitutions', label:'Disables institutions', category:'institutions',
        hint:'Institutions suspended or degraded while this stressor is active.' },
      { key:'disablesGoods',        label:'Disables trade goods',  category:'tradeGoods',
        hint:'Goods whose production halts under this stressor.' },
    ],
  },
  { key:'tradeGoods',   label:'Trade Goods',    color:'#a0762a',
    fields:['name','category','criticality','economicWeight','foodImpact','satisfies','description'],
    dependencies: [
      { key:'requiredInstitution', label:'Required institution',  category:'institutions', single:true,
        hint:'Single institution that must be present for this good to be produced.' },
      { key:'requiredResources',   label:'Required resources',     categories:['resources','tradeGoods','services'],
        hint:'Resources, intermediate goods, or services needed to produce this good (built-in + custom).' },
    ],
  },
  { key:'factions',     label:'Factions',       color:'#6a1a4a',
    fields:['name','authority','archetype','agenda','scale','methods','magical','criminal','defenseRole','description','tierMin'],
    dependencies: [
      { key:'controls',  label:'Controls institutions', category:'institutions',
        hint:'Institutions this faction holds sway over.' },
      { key:'rivals',    label:'Rivals (conflicts with)', category:'factions',
        hint:'Factions this one is in conflict with. Flagged if both are present.' },
    ],
  },
  // Deities (Feature D) — a homebrew god with three frozen tag axes
  // (alignment · temperament · rank). INERT until assigned as a settlement's
  // primary deity (the embed-on-assign bridge in SettlementDetail). No
  // dependencies — a deity stands alone; it acts through the assignment, not
  // through generation wiring.
  { key:'deities',      label:'Deities',       color:'#7a5a1a',
    fields:['name','alignmentAxis','temperamentAxis','rankAxis','lawAxis','domain','description'],
  },
  // Supply Chains are DISCOVERED (inferred from the inputs/outputs of the types
  // above), not hand-authored — this tab renders its own discover/verify
  // manager (SupplyChainsManager) instead of the generic add form.
  { key:'supplyChains', label:'Supply Chains',  color:'#a0762a', discovered:true },
  // Trade Routes / Power Presets / Defense Presets removed:
  // redundant with the trade-route, government, and defense controls already in
  // the generation config. PRUNED from the authoring UI + registry, but the
  // slice still tolerates a save/profile that carries them (migration-safe — they
  // stay in the EMPTY shape so a cloud/local load never drops into an undefined
  // bucket and the read-only/grandfathered viewer can still surface them).
];

// ── Two authoring lanes ─────────────────────────────────────────────────────
// The flat 8-bucket row is reorganized into two labeled lanes so the worldbuilder
// sees the conceptual split: STATIC settlement content vs the LIVING-WORLD content
// that powers the simulation. Each lane lists its own bucket keys (referencing
// CUSTOM_CATEGORIES above); the dead buckets (tradeRoutes/powerPresets/
// defensePresets) appear in NEITHER lane — that's the migration-safe pruning.
export const AUTHORING_LANES = [
  {
    key: 'settlement',
    label: 'Settlement Content',
    blurb: 'Institutions, services, resources, trade goods, and the supply chains they form: the static building blocks a generation draws on.',
    buckets: ['institutions', 'services', 'resources', 'tradeGoods', 'stressors', 'supplyChains'],
  },
  {
    key: 'living',
    label: 'Living World (powers the simulation)',
    blurb: 'Deities and factions. Deities are dormant until assigned + religion dynamics are on; factions enter an existing world through an event, not generation.',
    buckets: ['deities', 'factions'],
  },
];

/** Resolve a bucket key → its CUSTOM_CATEGORIES definition. */
export const CATEGORY_BY_KEY = Object.fromEntries(CUSTOM_CATEGORIES.map((c) => [c.key, c]));
