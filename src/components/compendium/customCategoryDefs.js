/**
 * customCategoryDefs.js — the UI-facing custom-content category definitions (the
 * inline defs that drive the CustomContentManager tabs: icon + colour + label +
 * fields + dependency descriptors). Extracted from CustomContent.jsx so that file
 * stays under the component-size ratchet (WB-j: it sat at 599/600 effective lines,
 * with no room to add the traditions lane inline).
 *
 * This is distinct from ./customCategories.js, which holds a data-only copy (no
 * icons) plus the AUTHORING_LANES grouping consumed by the dependency engine and
 * content-pack importers. The two are intentionally separate consumers; the
 * rendered tabs read THIS file (via CATEGORY_BY_KEY), the importers read that one.
 *
 * Per-category schema:
 *   fields:        flat scalar fields rendered in the main form
 *   dependencies:  refId-array fields rendered in the always-visible Dependencies
 *                  section (it's what wires custom content into generation + chain
 *                  discovery, so it never collapses). Each dep field is
 *                  { key, label, category | categories[], single?, hint? } where
 *                  `category` (or `categories` for a multi-bucket picker, e.g.
 *                  tradeGoods + services) is the registry category to pick from.
 */
import { Sparkles, AlertTriangle, Link2, Building2, Package, HeartHandshake, Flag, Coins, CalendarDays } from 'lucide-react';
import { swatch } from '../../design/tokens.js';

export const CUSTOM_CATEGORIES = [
  { key:'institutions', label:'Institutions', Icon:Building2, color:'#1a3a7a',
    fields:['name','category','authority','tags','essential','magical','criminal','defenseRole','foodImpact','satisfies','description','tierMin','tierMax'],
    dependencies: [
      { key:'produces',    label:'Produces (goods/services)', categories:['tradeGoods','services'],
        hint:'Trade goods or services this institution generates when present.' },
      { key:'requires',    label:'Requires (inputs)',          categories:['resources','tradeGoods','services'],
        hint:'Resources, goods, or services this institution consumes — its absence makes the institution viability-marginal.' },
      { key:'subsumes',    label:'Subsumes (absorbs)',         category:'institutions',
        hint:'Institutions this one represents — when present, the smaller ones aren’t listed separately.' },
    ],
  },
  { key:'services',     label:'Services',     Icon:HeartHandshake, color:'#0e7c86',
    fields:['name','category','authority','criticality','economicWeight','magical','criminal','foodImpact','description','tierMin','tierMax'],
    dependencies: [
      { key:'providedBy', label:'Provided by (institution)', category:'institutions', single:true,
        hint:'The institution that offers this service (a service is something an institution provides).' },
      { key:'requires',   label:'Requires (inputs)',          categories:['resources','tradeGoods','services'],
        hint:'Resources, goods, or services this service consumes to operate.' },
    ],
  },
  { key:'resources',    label:'Resources',    Icon:Package,   color:'#1a5a28',
    fields:['name','category','criticality','foodImpact','commodities','description'],
    dependencies: [
      { key:'yields',  label:'Output (goods/services)', categories:['tradeGoods','services'],
        hint:'Goods or services this base resource yields once worked (built-in + custom) — feeds supply-chain discovery as the resource → processor → output flow.' },
      { key:'enables', label:'Enables institutions', category:'institutions',
        hint:'Institutions whose viability is boosted by access to this resource.' },
    ],
  },
  { key:'stressors',    label:'Stressors',    Icon:AlertTriangle, color:'#8b1a1a',
    fields:['name','description','severity','affects'],
    dependencies: [
      { key:'disablesInstitutions', label:'Disables institutions', category:'institutions',
        hint:'Institutions suspended or degraded while this stressor is active.' },
      { key:'disablesGoods',        label:'Disables trade goods',  category:'tradeGoods',
        hint:'Goods whose production halts under this stressor.' },
    ],
  },
  { key:'tradeGoods',   label:'Trade Goods',  Icon:Coins,     color:'#a0762a',
    fields:['name','category','criticality','economicWeight','foodImpact','satisfies','description'],
    dependencies: [
      { key:'requiredInstitution', label:'Required institution',  category:'institutions', single:true,
        hint:'Single institution that must be present for this good to be produced.' },
      { key:'requiredResources',   label:'Required resources',     categories:['resources','tradeGoods','services'],
        hint:'Resources, intermediate goods, or services needed to produce this good (built-in + custom).' },
    ],
  },
  // Deities — homebrew gods (premium custom content). PURE authoring: the axes
  // ride an embed only once a DM ASSIGNS the deity as a settlement's patron
  // (DeityAssignmentPanel → the SET_PRIMARY_DEITY canon event); tier NEVER touches
  // generation. `portfolio` is a free-text flavor field with ZERO mechanics.
  { key:'deities',      label:'Deities',      Icon:Sparkles,  color:'#7c3aed', singular:'Deity',
    fields:['name','alignmentAxis','lawAxis','rankAxis','portfolio','domain'] },
  // Traditions — homebrew holidays/festivals/rites (premium custom content; WB-j).
  // PURE authoring: `motifElement`/`motifAct` pick from the frozen genesis vocab
  // (TRADITION_ELEMENT_KEYS/TRADITION_ACT_KEYS) and `epithet` is a free-text flavor
  // line (≤300). They surface in a dossier's Traditions tab via the view-consumer
  // merge (customFounding.js); they never touch generation or the tick.
  { key:'traditions',   label:'Traditions',   Icon:CalendarDays, color:swatch['#8A5A1A'], singular:'Tradition',
    fields:['name','motifElement','motifAct','epithet'] },
  { key:'factions',     label:'Factions',     Icon:Flag,      color:'#6a1a4a',
    fields:['name','authority','archetype','agenda','scale','methods','magical','criminal','defenseRole','description','tierMin'],
    dependencies: [
      { key:'controls',  label:'Controls institutions', category:'institutions',
        hint:'Institutions this faction holds sway over.' },
      { key:'rivals',    label:'Rivals (conflicts with)', category:'factions',
        hint:'Factions this one is in conflict with — flagged if both are present.' },
    ],
  },
  // Supply Chains are DISCOVERED (inferred from the inputs/outputs of the types
  // above), not hand-authored — this tab renders its own discover/verify
  // manager (SupplyChainsManager) instead of the generic add form.
  { key:'supplyChains', label:'Supply Chains', Icon:Link2,   color:'#a0762a', discovered:true },
  // Trade Routes / Power Presets / Defense Presets removed (§14): redundant with
  // the trade-route, government, and defense controls already in the generation
  // config. Supply chains are not hand-authored here either — they're discovered
  // (see the Supply Chains tab) from entity inputs/outputs.
];

// Resolve a bucket key → its CUSTOM_CATEGORIES definition (the W-C4 inline defs,
// so tab colours/icons/labels stay the authored set). The two authoring lanes
// reference bucket KEYS; the defs come from here.
export const CATEGORY_BY_KEY = Object.fromEntries(CUSTOM_CATEGORIES.map((c) => [c.key, c]));
