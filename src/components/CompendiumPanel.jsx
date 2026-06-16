import { useState, useMemo, useEffect } from 'react';
import { GOLD, GOLD_BG, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, PARCH, sans, serif_, FS, swatch, R, ELEV, PAGE_MAX, PROSE_MAX } from './theme.js';
import { Search, Layers, Coins, Shield, Sparkles, AlertTriangle, Link2, Building2, Plus, Edit3, Trash2, Package, HeartHandshake, Flag } from 'lucide-react';
import { CRITICALITY, ECONOMIC_WEIGHT, DEFENSE_ROLES, POWER_AUTHORITIES, FOOD_IMPACT, TRADE_CATEGORIES, satisfiesOptions } from '../domain/customContentSchema.js';
import SupplyChainsManager from './compendium/SupplyChainsManager.jsx';
import CategorySelect from './primitives/CategorySelect.jsx';
import {STRESS_TYPE_MAP} from '../data/stressTypes';
import {useStore} from '../store/index.js';
import DeleteConfirmation from './DeleteConfirmation';

import {getInstitutionalCatalog, getFullCatalogWithTierMeta} from '../generators/lookups.js';
import EntityPicker from './EntityPicker.jsx';
import { buildRegistry, customRefIdFromItem } from '../lib/customRegistry.js';
// P139 — REL_TYPES + ARCHETYPES lifted to the shared pure-data module so the
// global-search index (CP-4) and these tabs render from one source of truth.
import { ARCHETYPES, REL_TYPES } from '../domain/compendium/catalogData.js';
import CompendiumGlobalSearch from './compendium/CompendiumGlobalSearch.jsx';

// ── Shared primitives ───────────────────────────────────────────────────────

function Tag({ label, color=GOLD }) {
  return <span style={{ fontSize:FS.micro, fontWeight:800, color, background:`${color}18`, borderRadius:3, padding:'1px 6px', letterSpacing:'0.05em', textTransform:'uppercase', marginRight:4 }}>{label}</span>;
}

function Row({ label, children, lw=130 }) {
  return (
    <div style={{ display:'flex', gap:8, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
      <span style={{ fontSize:FS.sm, fontWeight:700, color:INK, minWidth:lw, flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{children}</span>
    </div>
  );
}

function Card({ title, sub, children, accent=GOLD }) {
  return (
    <div style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${accent}`, borderRadius:7,
      padding:'10px 12px', background:'rgba(255,251,245,0.95)', marginBottom:8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:sub?2:6 }}>
        <span style={{ fontFamily:serif_, fontSize: FS['14'], fontWeight:700, color:INK, flex:1 }}>{title}</span>
        {sub && <span style={{ fontSize:FS.xxs, fontWeight:700, color:accent, background:`${accent}14`,
          borderRadius:8, padding:'1px 8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{sub}</span>}
      </div>
      <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55 }}>{children}</div>
    </div>
  );
}

// ── Built-in Catalog Tabs ───────────────────────────────────────────────────

const TABS = [
  { id:'tiers',       label:'Tiers & Routes',    Icon: Layers },
  { id:'economy',     label:'Economy',            Icon: Coins },
  { id:'power',       label:'Power & Factions',   Icon: Shield },
  { id:'arcane',      label:'Magic & Religion',   Icon: Sparkles },
  { id:'stress',      label:'Stress',             Icon: AlertTriangle },
  { id:'neighbour',   label:'Neighbour System',   Icon: Link2 },
  { id:'institutions',label:'Institutions',       Icon: Building2 },
];

// P127 / CP-3 — Anchor → tab map. HelpPopover and external deep-links
// land at URL hashes like `#trade-routes` or `#magic`. The hash maps
// to a Compendium tab; once that tab mounts, the matching DOM `id`
// inside the tab is scrolled into view by the effect in
// CompendiumPanel. Adding a new anchor: add an entry here + ensure
// the tab content renders `id="<anchor>"` on the target section.
const ANCHOR_TO_TAB = Object.freeze({
  'tiers':        'tiers',
  'trade-routes': 'tiers',
  'terrain':      'tiers',
  'economy':      'economy',
  'exports':      'economy',
  'power':        'power',
  'archetypes':   'power',
  'magic':        'arcane',
  'cultures':     'arcane',
  'religion':     'arcane',
  'stress':       'stress',
  'threat':       'stress',
  'neighbours':   'neighbour',
  'institutions': 'institutions',
});

// REL_TYPES + ARCHETYPES are imported from '../domain/compendium/catalogData.js'
// (see import block above). CAT_COLORS stays here — it's display-only.
const CAT_COLORS = { Economic:'#a0762a', Military:'#8b1a1a', Religious:'#1a4a2a', Magic:'#3a1a7a', Criminal:'#4a1a4a', Balanced:'#1a3a7a' };

// ── Tab content ─────────────────────────────────────────────────────────────

function TiersTab({ _search='' }) {
  return <>
    <p id="tiers" style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
      Tier determines the maximum institution count, population band, and available institution categories.
    </p>
    {[['Thorp','20-80','#8b1a1a','Single institution. Subsistence only.'],['Hamlet','80-400','#a05010','2-3 institutions. Local subsistence. Minimal trade.'],['Village','400-900','#a0762a','4-6 institutions. Surplus production begins. Weekly market.'],['Town','900-4,000','#1a5a28','7-10 institutions. Specialization appears. Guilds form.'],['City','4,000-25,000','#1a3a7a','11-14 institutions. Full institutional diversity. Factional politics.'],['Metropolis','25,000+','#4a1a6a','15+ institutions. All systems active. Complex faction dynamics.']].map(([name,pop,color,desc])=>(
      <div key={name} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${BOR}`, alignItems:'flex-start' }}>
        <div style={{ minWidth:90, flexShrink:0 }}><div style={{fontSize:FS.md,fontWeight:700,color}}>{name}</div><div style={{fontSize:FS.xxs,color:MUT}}>{pop} pop.</div></div>
        <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{desc}</div>
      </div>))}
    <div id="trade-routes" style={{ fontFamily:serif_, fontSize: FS['14'], fontWeight:600, color:INK, margin:'16px 0 8px' }}>Trade Route Access</div>
    {[['Road','Standard land access. Moderate trade volume.','#6b5340'],['Crossroads','Multiple road intersections. Higher institution diversity.','#a0762a'],['Port','Sea or river access. Maritime exports, fishing, naval institutions.','#1a3a7a'],['River','Inland waterway. Cheaper bulk movement. Mill and granary likely.','#1a5a28'],['Mountain Pass','Strategic chokepoint. Toll and garrison institutions likely.','#8b1a1a'],['Isolated','No trade route. Subsistence by necessity.','#4a1a4a']].map(([name,desc,color])=>(
      <div key={name} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
        <span style={{ fontSize:FS.xs, fontWeight:700, color, minWidth:110, flexShrink:0 }}>{name}</span>
        <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{desc}</span>
      </div>))}
    <div id="threat" style={{ fontFamily:serif_, fontSize: FS['14'], fontWeight:600, color:INK, margin:'16px 0 8px' }}>Monster Threat</div>
    {[['Safe','Civilian institutions dominate. Military is law enforcement only.','#1a5a28'],['Frontier','Active but managed threat. Walls and garrison elevated.','#a0762a'],['Dangerous','Constant threat. Military dominates. Civilian life constrained.','#8a5010'],['Plagued','Active monster plague. Crisis conditions. Siege-like dynamics.','#8b1a1a']].map(([name,desc,color])=>(
      <div key={name} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
        <span style={{ fontSize:FS.xs, fontWeight:700, color, minWidth:110, flexShrink:0 }}>{name}</span>
        <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{desc}</span>
      </div>))}
  </>;
}

function EconomyTab() {
  return <>
    <div id="economy" />
    <Card title="Prosperity Tiers" accent={GOLD}>Subsistence to Affluent. Derived from export volume, income sources, supply chains, trade route, and safety. Not a dial. An output.</Card>
    <Card title="Priority Sliders" accent='#a0762a'>Sliders shift institutional probability, not guarantee it. They interact: high Religion + low Magic triggers heresy suppression.</Card>
    <Card title="Exports & Imports" accent='#1a5a28'>Exports are surplus production. Imports are gaps. Heavy import dependency creates trade vulnerability.</Card>
    <Card title="Supply Chains" accent='#1a3a7a'>Linked production sequences. A broken input degrades the output. Magic can substitute for some missing material inputs.</Card>
    <Card title="Viability Score" accent='#8b1a1a'>Economic stress analysis showing which factors are supporting prosperity and which are fragile.</Card>
  </>;
}

function PowerTab_({ search='' }) {
  const cats = ['All','Economic','Military','Religious','Criminal','Magic','Balanced'];
  const [cat, setCat] = useState('All');
  const filtered = ARCHETYPES.filter(a => (cat==='All'||a.cat===cat) && (!search||a.name.toLowerCase().includes(search)||a.desc.toLowerCase().includes(search)));
  return <>
    <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>Archetypes emerge when slider combinations cross thresholds. Faction power = institutional base x public legitimacy.</p>
    <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
      {cats.map(c => <button key={c} onClick={() => setCat(c)} style={{ padding:'3px 10px', borderRadius:12, fontSize:FS.xs, fontWeight:700, cursor:'pointer', border:'1px solid', background:cat===c?INK:'transparent', color:cat===c?'#f5ede0':SEC, borderColor:cat===c?INK:BOR }}>{c}</button>)}
    </div>
    <div id="archetypes" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:8 }}>
      {filtered.map(a => (
        <div key={a.name} style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${CAT_COLORS[a.cat]||GOLD}`, borderRadius:7, padding:'10px 12px', background:'rgba(255,251,245,0.95)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:700, color:INK, flex:1 }}>{a.name}</span>
            <Tag label={a.cat} color={CAT_COLORS[a.cat]||GOLD}/>
          </div>
          <div style={{ fontSize:FS.xxs, color:MUT, fontStyle:'italic', marginBottom:4 }}>{a.cond}</div>
          <div style={{ fontSize: FS['11.5'], color:SEC, lineHeight:1.5 }}>{a.desc}</div>
        </div>))}
    </div>
  </>;
}

function ArcaneTab() {
  return <>
    <div id="magic" />
    <Card title="Magic as Economic Buffer" accent='#3a1a7a'>High Magic acts as a buffer against deficits. Arcane institutions can substitute for missing production.</Card>
    <Card title="Magic Suppression" accent='#5a2a8a'>Religion 65+ with Magic 38 or less triggers Heresy Suppression. Magic goods suppressed.</Card>
    <Card title="Arcane-Criminal Ecosystem" accent='#4a1a4a'>Magic 52+ and Criminal 58+ creates an Arcane Black Market archetype.</Card>
    <Card title="Religion & Governance" accent='#1a4a2a'>Religion 72+ with low Military produces Theocracy. With strong Crime produces Religious Fraud.</Card>
    <Card title="Magic & Faith Unified" accent='#2a1a6a'>Magic 70+ and Religion 65+ produces Mage Theocracy. Arcane clergy governs.</Card>
  </>;
}

function StressTab({ search='' }) {
  const stresses = Object.values(STRESS_TYPE_MAP || {});
  const list = stresses.length > 0 ? stresses : [
    { label:'Famine', description:'Food supply failure. Grain exports collapse. Safety degrades.' },
    { label:'Plague', description:'Disease active. Population loss. Social trust collapsed.' },
    { label:'Siege', description:'Military encirclement. Imports cut. All resources redirected to defense.' },
    { label:'Political Fracture', description:'Governance contested. Multiple factions claim legitimacy.' },
  ];
  return <>
    <div id="stress" style={{ padding:'10px 12px', background:`${GOLD}10`, border:`1px solid ${GOLD}40`, borderLeft:`3px solid ${GOLD}`, borderRadius:7, marginBottom:12 }}>
      <div style={{ fontSize:FS.xs, fontWeight:800, color:GOLD, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Stresses Compound</div>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:0 }}>Multiple stresses compound. Famine + Political Fracture means food distribution is contested by factions.</p>
    </div>
    {list.filter(s=>!search||(s.label||'').toLowerCase().includes(search)||(s.description||s.desc||'').toLowerCase().includes(search)).map(s => (
      <div key={s.label||s.id} style={{ padding:'8px 0', borderBottom:`1px solid ${BOR}` }}>
        <div style={{ fontSize:FS.md, fontWeight:700, color:swatch.danger, marginBottom:3 }}>{s.label}</div>
        <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55 }}>{s.description||s.desc||', '}</div>
      </div>))}
  </>;
}

function NeighbourTab({ search='' }) {
  return <>
    <p id="neighbours" style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>Relationship types modify the economic engine, faction weights, and institution probabilities before generation.</p>
    {REL_TYPES.filter(r=>!search||r.label.toLowerCase().includes(search)||r.effect.toLowerCase().includes(search)).map(r => (
      <div key={r.id} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${BOR}`, alignItems:'flex-start' }}>
        <span style={{ fontSize:FS.xs, fontWeight:700, color:r.color, minWidth:105, flexShrink:0, background:`${r.color}14`, borderRadius:4, padding:'2px 7px', textAlign:'center' }}>{r.label}</span>
        <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{r.effect}</span>
      </div>))}
    <div style={{ fontFamily:serif_, fontSize: FS['14'], fontWeight:600, color:INK, margin:'16px 0 8px' }}>Cross-Settlement Systems</div>
    {[['NPC Contacts','Named NPCs from both settlements paired by category and relationship type.'],['Cross-Settlement Conflicts','Mechanically-derived disputes: market contests, border incursions, intelligence operations.'],['Bidirectional Cascade','Renaming an NPC or faction propagates to all linked partner records.'],['Delink Cleanup','Removing a link removes all cross-settlement contacts and conflicts from both settlements.']].map(([label,desc])=><Row key={label} label={label} lw={160}>{desc}</Row>)}
  </>;
}

function InstitutionsTab({ _config, search }) {
  const catalog = useMemo(() => { try { return getFullCatalogWithTierMeta(); } catch { try { return getInstitutionalCatalog('all'); } catch { return {}; } } }, []);
  const all = useMemo(() => {
    const seen = new Set();
    return Object.entries(catalog).flatMap(([cat, catData]) =>
      Object.entries(catData||{}).map(([name, props]) => ({ name, category:cat, ...props }))
    ).filter(i => { if(!i.name||seen.has(i.name)) return false; seen.add(i.name); return true; });
  }, [catalog]);
  const catColors = { Economy:'#a0762a', Military:'#8b1a1a', Magic:'#3a1a7a', Religion:'#1a4a2a', Criminal:'#4a1a4a', 'Government/Admin':'#1a3a7a' };
  const filtered = useMemo(() => {
    if (!search) return all.slice(0, 48);
    const q = search.toLowerCase();
    return all.filter(i => (i.name||'').toLowerCase().includes(q) || (i.desc||'').toLowerCase().includes(q) || (i.category||'').toLowerCase().includes(q) || (i.tags||[]).some(t=>(t||'').toLowerCase().includes(q))).slice(0,80);
  }, [all, search]);
  return <>
    <p style={{ fontSize:FS.sm, color:MUT, lineHeight:1.5, margin:'0 0 10px', fontStyle:'italic' }}>
      {search ? `${filtered.length} results` : `Showing first 48 of ${all.length} institutions. Use search to filter.`}
    </p>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:6 }}>
      {filtered.map(inst => (
        <div key={inst.name} style={{ border:`1px solid ${BOR}`, borderRadius:6, padding:'8px 10px', background:'rgba(255,251,245,0.95)' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:5, marginBottom:3 }}>
            <span style={{ fontFamily:serif_, fontSize: FS['12.5'], fontWeight:700, color:INK, flex:1, lineHeight:1.3 }}>{inst.name}</span>
            {inst.required && <Tag label="Core" color='#1a3a7a'/>}
          </div>
          {inst.category && <Tag label={inst.category} color={catColors[inst.category]||GOLD}/>}
          {inst.desc && <div style={{ fontSize:FS.xs, color:SEC, lineHeight:1.4, marginTop:4 }}>{inst.desc}</div>}
        </div>))}
    </div>
  </>;
}

// ── Custom Content Manager ──────────────────────────────────────────────────

// Per-category schema:
//   fields:        flat scalar fields rendered in the main form
//   dependencies:  refId-array fields rendered in the always-visible Dependencies
//                  section (it's what wires custom content into generation + chain
//                  discovery, so it never collapses). Each dep field is
//                  { key, label, category | categories[], single?, hint? } where
//                  `category` (or `categories` for a multi-bucket picker, e.g.
//                  tradeGoods + services) is the registry category to pick from.
const CUSTOM_CATEGORIES = [
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

const STRESSOR_AFFECT_CATEGORIES = [
  'economy', 'safety', 'supply chains', 'military', 'religion', 'magic',
  'criminal', 'governance', 'population', 'morale',
];

const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const SEVERITY_LEVELS = ['minor','moderate','severe','catastrophic'];
const GOV_TYPES = ['monarchy','republic','theocracy','oligarchy','tribal','military junta','council','anarchy'];
const POSTURES = ['peaceful','defensive','aggressive','fortified','guerrilla'];

// Plain-language helper text under each field, so the form explains itself
// (spec §14: as intuitive as possible). Keyed by field name; missing = no hint.
const FIELD_HINTS = {
  category:       'Which part of settlement life this belongs to — also where it appears in the dossier. Pick “+ New category…” to add your own.',
  authority:      'Which power it feeds in the settlement’s leadership — e.g. a temple → religious authority, a garrison → martial.',
  defenseRole:    'Whether and how this strengthens the settlement’s defense.',
  essential:      'Always included when this settlement is generated — like a mill or watch — never rolled probabilistically.',
  foodImpact:     'Whether this raises or drains food security (a farm produces; a large garrison consumes). Moves the deficit.',
  satisfies:      'Trade category this good belongs to — e.g. Dragonbone Greatswords → Weapons & armour. In the Economics tab the good folds into this category line (incl. its name) instead of a separate pill. Demand categories (weapons/religious/maritime/luxury/alchemical) also cover local need + export surplus. Pick “Other” to type your own — it stays available while any item uses it.',
  criticality:    'How essential this is. Critical things (food, water, timber) cause crises when supply breaks; luxuries don’t.',
  economicWeight: 'How much this reinforces the local economy.',
  magical:        'Turn on if this is arcane or enchanted in nature.',
  criminal:       'Turn on if this operates outside the law.',
  tierMin:        'Smallest settlement size where this can appear (blank = any).',
  tierMax:        'Largest settlement size where this still appears (blank = no limit).',
  archetype:      'e.g. merchant guild, thieves’ cabal, knightly order.',
  agenda:         'What this faction is trying to achieve.',
  scale:          'How much reach and influence this faction has.',
  methods:        'How it pursues its agenda — e.g. bribery, force, diplomacy.',
};

// §14 — resolve a stored enum key to its human label for the detail view.
const keyLabel = (list, key) => (list.find((o) => o.key === key)?.label) || key;

/**
 * CustomItemAttributes — the post-creation "detail sheet" for a saved custom
 * item, mirroring how the prebuilt catalog surfaces an object's properties.
 * Renders only the attributes the author actually set, as labelled chips, so a
 * saved item reads like a real compendium entry rather than just a name + blurb.
 */
function CustomItemAttributes({ item }) {
  const chips = [];
  if (item.essential === true) chips.push({ label: 'Essential', color: '#1a4a20' });
  if (item.magical === true) chips.push({ label: 'Magical', color: swatch.magic });
  if (item.criminal === true) chips.push({ label: 'Criminal', color: '#8b1a1a' });
  if (item.authority) chips.push({ label: `Authority · ${keyLabel(POWER_AUTHORITIES, item.authority)}`, color: '#1a3a7a' });
  if (item.defenseRole) chips.push({ label: `Defense · ${keyLabel(DEFENSE_ROLES, item.defenseRole)}`, color: '#8b1a1a' });
  if (item.criticality) chips.push({ label: keyLabel(CRITICALITY, item.criticality), color: '#a0762a' });
  if (item.economicWeight) chips.push({ label: keyLabel(ECONOMIC_WEIGHT, item.economicWeight), color: '#1a5a28' });
  if (item.foodImpact) chips.push({ label: `Food · ${item.foodImpact}`, color: '#7a5010' });
  if (item.satisfies) chips.push({ label: `Trade category · ${keyLabel(TRADE_CATEGORIES, item.satisfies) || item.satisfies}`, color: '#7c3aed' });
  if (item.archetype) chips.push({ label: `Archetype · ${item.archetype}`, color: '#6a1a4a' });
  if (item.scale) chips.push({ label: `Scale · ${item.scale}`, color: '#6a1a4a' });
  if (item.severity) chips.push({ label: `Severity · ${item.severity}`, color: '#8b1a1a' });
  if (item.tierMin || item.tierMax) chips.push({ label: `Tiers · ${item.tierMin || 'any'}–${item.tierMax || '∞'}`, color: '#6b5340' });
  if (!chips.length) return null;
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
      {chips.map((c, i) => <Tag key={i} label={c.label} color={c.color} />)}
    </div>
  );
}

// ── Premium upsell card (shown to free / anon users in the Custom tab) ─────
function CustomContentUpsell({ existingCount, isAnon }) {
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  return (
    <div style={{
      padding: '24px 20px', textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(160,118,42,0.06) 100%)',
      border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10,
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(124,58,237,0.12)', marginBottom: 12,
      }}>
        <Sparkles size={26} color="#7c3aed" />
      </div>
      <div style={{
        fontSize: FS['18'], fontWeight: 700, fontFamily: serif_, color: INK, marginBottom: 4,
      }}>
        Custom Compendium &mdash; Premium
      </div>
      <div style={{
        fontSize: FS.md, color: SEC, lineHeight: 1.55, marginBottom: 16,
        maxWidth: 460, margin: '0 auto 16px',
      }}>
        Build your own institutions, resources, stressors, trade goods, power presets, and defense
        scenarios. Custom content is synced to your account and available across devices.
      </div>

      {existingCount > 0 && (
        <div style={{
          padding: '10px 14px', background: 'rgba(160,118,42,0.10)',
          border: `1px solid ${GOLD}55`, borderRadius: 7,
          fontSize: FS.sm, color: GOLD, fontWeight: 600, marginBottom: 16,
          maxWidth: 460, margin: '0 auto 16px',
        }}>
          You have <strong>{existingCount}</strong> grandfathered custom item{existingCount === 1 ? '' : 's'}.
          They&rsquo;re still browseable below in read-only mode.
        </div>
      )}

      {isAnon ? (
        <div style={{ fontSize: FS.sm, color: MUT }}>Sign in and upgrade to Premium to unlock.</div>
      ) : (
        <button
          onClick={() => setPurchaseModalOpen(true)}
          style={{
            padding: '10px 22px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #5a2a8a 100%)',
            color: swatch.white, border: 'none', borderRadius: 7, cursor: 'pointer',
            fontSize: FS.md, fontWeight: 700, fontFamily: sans, letterSpacing: '0.04em',
            boxShadow: '0 3px 12px rgba(124,58,237,0.35)',
          }}
        >
          Upgrade to Premium
        </button>
      )}
    </div>
  );
}

// ── Read-only viewer for grandfathered local items (free tier) ─────────────
function ReadOnlyCustomContentList({ search }) {
  const customContent = useStore(s => s.customContent);
  const [activeCat, setActiveCat] = useState('institutions');
  const catDef = CUSTOM_CATEGORIES.find(c => c.key === activeCat);
  const items = customContent[activeCat] || [];
  const filtered = search
    ? items.filter(i => (i.name || '').toLowerCase().includes(search) || (i.description || '').toLowerCase().includes(search))
    : items;
  const totalLocal = Object.values(customContent).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  if (totalLocal === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 700, color: MUT, textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: 8,
      }}>
        Grandfathered items &middot; read only
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {CUSTOM_CATEGORIES.map(c => {
          const count = (customContent[c.key] || []).length;
          if (count === 0) return null;
          return (
            <button key={c.key} onClick={() => setActiveCat(c.key)} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
              borderRadius: 12, fontSize: FS.xs,
              fontWeight: activeCat === c.key ? 700 : 500, cursor: 'pointer',
              border: `1px solid ${activeCat === c.key ? c.color : BOR}`,
              background: activeCat === c.key ? `${c.color}14` : 'transparent',
              color: activeCat === c.key ? c.color : SEC,
            }}>
              <c.Icon size={11} /> {c.label}
              <span style={{
                fontSize: FS.micro, fontWeight: 700, background: `${c.color}20`, color: c.color,
                borderRadius: 6, padding: '0 4px', marginLeft: 2,
              }}>{count}</span>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: '14px', textAlign: 'center', fontSize: FS.sm, color: MUT }}>
          No items in {catDef.label.toLowerCase()}.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              border: `1px solid ${BOR}`, borderLeft: `3px solid #7c3aed`, borderRadius: 7,
              padding: '8px 12px', background: 'rgba(255,251,245,0.95)', opacity: 0.85,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK, flex: 1 }}>
                  {item.name}
                </span>
                <Tag label="Local" color="#7c3aed" />
                {item.category && <Tag label={item.category} color={catDef.color} />}
              </div>
              {item.description && (
                <div style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.4, marginTop: 4 }}>
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Maps a dependency field (as stored on ANOTHER custom item) to the relationship
// verb from THIS item's perspective. Powers the derived reverse-links below:
// dependencies are stored one-directionally (a service names its `providedBy`
// institution; a good names its `requiredInstitution`), but we surface the
// inverse so the institution's own card reflects the services/goods that later
// pointed at it. This is a derived view — no fragile stored back-writes, so it
// survives deletes/edits/reorders of either side.
const REVERSE_VERB = {
  providedBy:           'Provides',
  requiredInstitution:  'Produces',
  produces:             'Produced by',
  requires:             'Used by',
  requiredResources:    'Used by',
  subsumes:             'Subsumed by',
  enables:              'Enabled by',
  yields:               'Yielded by',
  controls:             'Controlled by',
  rivals:               'Rival of',
  disablesInstitutions: 'Disabled by',
  disablesGoods:        'Disabled by',
};
const CUSTOM_INK = '#7c3aed';
const CUSTOM_BG = '#7c3aed12';
const CUSTOM_BORDER = '#7c3aed40';

/**
 * DependencySummary — read-only inline display of dependency refs on a saved
 * custom item card. Resolves refIds via the registry and surfaces missing
 * targets so the user knows when a delete elsewhere created a dangling link.
 * Also derives reverse-links (other custom items that point AT this one) so the
 * relationship reads bidirectionally without storing back-references.
 */
function DependencySummary({ deps, item }) {
  const customContent = useStore(s => s.customContent);
  const registry = useMemo(() => buildRegistry(customContent), [customContent]);

  // Reverse-links: scan all custom content for items whose dependency refs point
  // at THIS item, grouped by the inverse verb (e.g. a service with providedBy=X
  // shows up under "Provides" on institution X's card).
  const reverseLinks = useMemo(() => {
    const selfRefId = item ? customRefIdFromItem(item) : null;
    if (!selfRefId) return [];
    const groups = new Map(); // verb -> Set<name>
    for (const cat of CUSTOM_CATEGORIES) {
      if (!Array.isArray(cat.dependencies)) continue;
      const list = Array.isArray(customContent?.[cat.key]) ? customContent[cat.key] : [];
      for (const other of list) {
        if (!other || customRefIdFromItem(other) === selfRefId) continue;
        for (const dep of cat.dependencies) {
          const verb = REVERSE_VERB[dep.key];
          if (!verb) continue;
          const raw = other[dep.key];
          const refs = dep.single ? (raw ? [raw] : []) : (Array.isArray(raw) ? raw : []);
          if (!refs.includes(selfRefId)) continue;
          if (!groups.has(verb)) groups.set(verb, new Set());
          groups.get(verb).add(other.name || '(unnamed)');
        }
      }
    }
    return [...groups.entries()].map(([verb, names]) => ({ verb, names: [...names] }));
  }, [item, customContent]);

  if (!item || !Array.isArray(deps)) return null;

  // Build per-field { label, entries: [{name, missing, source}] }
  const fields = deps.map(dep => {
    if (!dep || !dep.key) return null;
    const raw = item[dep.key];
    const refIds = dep.single
      ? (raw ? [raw] : [])
      : (Array.isArray(raw) ? raw : []);
    if (refIds.length === 0) return null;
    const entries = refIds.map(r => {
      const e = registry.resolve(r);
      return { refId: r, name: e?.name || '(missing)', missing: !e, source: e?.source };
    });
    return { dep, entries };
  }).filter(Boolean);

  if (fields.length === 0 && reverseLinks.length === 0) return null;

  const totalMissing = fields.reduce(
    (sum, f) => sum + f.entries.filter(e => e.missing).length, 0
  );

  return (
    <div style={{ marginTop:6, paddingTop:5, borderTop:`1px dashed ${BOR}` }}>
      {fields.map(({ dep, entries }) => (
        <div key={dep.key} style={{ display:'flex', gap:6, alignItems:'flex-start', marginTop:3 }}>
          <span style={{
            fontSize:FS.micro, fontWeight:700, color:MUT, minWidth:84, flexShrink:0,
            textTransform:'uppercase', letterSpacing:'0.04em', paddingTop:2,
          }}>{dep.label.replace(/\s*\(.*\)$/, '')}</span>
          <div style={{ display:'flex', flexWrap:'wrap', gap:3, flex:1 }}>
            {entries.map((e, i) => (
              <span
                key={`${e.refId}-${i}`}
                title={e.missing ? `Reference missing: ${e.refId}` : ''}
                style={{
                  fontSize:FS.micro, fontWeight:700,
                  color: e.missing ? '#8b1a1a' : (e.source==='custom' ? '#7c3aed' : SEC),
                  background: e.missing ? '#fdebec' : (e.source==='custom' ? '#7c3aed14' : '#0001'),
                  border:`1px solid ${e.missing ? '#f0c8cc' : (e.source==='custom' ? '#7c3aed44' : BOR)}`,
                  borderRadius:8, padding:'1px 5px',
                }}
              >
                {e.missing && '! '}{e.name}
              </span>
            ))}
          </div>
        </div>
      ))}
      {totalMissing > 0 && (
        <div style={{
          marginTop:4, fontSize:FS.xxs, color:swatch.danger,
          fontStyle:'italic',
        }}>
          {totalMissing} dangling reference{totalMissing===1?'':'s'}. Edit this item to fix.
        </div>
      )}
      {reverseLinks.length > 0 && (
        <div style={{ marginTop:5, paddingTop:4, borderTop:`1px dotted ${BOR}` }}>
          <div style={{
            fontSize:FS.nano, fontWeight:700, color:MUT, marginBottom:2,
            textTransform:'uppercase', letterSpacing:'0.05em',
          }}>
            Auto-linked from your other custom content
          </div>
          {reverseLinks.map(({ verb, names }) => (
            <div key={verb} style={{ display:'flex', gap:6, alignItems:'flex-start', marginTop:3 }}>
              <span style={{
                fontSize:FS.micro, fontWeight:700, color:CUSTOM_INK, minWidth:84, flexShrink:0,
                textTransform:'uppercase', letterSpacing:'0.04em', paddingTop:2,
              }}>{verb}</span>
              <div style={{ display:'flex', flexWrap:'wrap', gap:3, flex:1 }}>
                {names.map((n, i) => (
                  <span key={`${verb}-${i}`} style={{
                    fontSize:FS.micro, fontWeight:700, color:CUSTOM_INK,
                    background:CUSTOM_BG, border:`1px solid ${CUSTOM_BORDER}`,
                    borderRadius:8, padding:'1px 5px',
                  }}>{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Human labels for registry category keys, used to build friendly picker
// placeholders ("Search goods / services…" rather than "Add tradeGoods…").
const CAT_LABEL = {
  tradeGoods: 'goods', services: 'services', resources: 'resources',
  institutions: 'institutions', factions: 'factions', stressors: 'stressors',
  resourceChains: 'chains',
};

/**
 * DependenciesSection — always-visible group of EntityPicker rows for the
 * dependency fields of a custom-content category. Each picker stores
 * refId arrays (or a single refId for `single:true`) on the draft. Never
 * collapses — this is what wires custom content into generation + discovery.
 */
function DependenciesSection({ deps, draft, setDraft }) {
  // Always-visible (not collapsible): dependencies are what wire custom content
  // into generation + supply-chain discovery, so they shouldn't be hidden.
  const total = deps.reduce((sum, d) => {
    const v = draft[d.key];
    if (d.single) return sum + (v ? 1 : 0);
    return sum + (Array.isArray(v) ? v.length : 0);
  }, 0);
  return (
    <div style={{ marginTop:10, borderTop:`1px dashed ${BOR}`, paddingTop:8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'2px 0', marginBottom:4 }}>
        <span style={{
          fontSize:FS.xs, fontWeight:700, color:swatch.magic,
          textTransform:'uppercase', letterSpacing:'0.05em',
        }}>
          Dependencies {total > 0 && (
            <span style={{
              marginLeft:6, background:'rgba(124,58,237,0.15)', color:swatch.magic,
              borderRadius:8, padding:'1px 6px', fontSize:FS.micro, fontWeight:800,
            }}>{total}</span>
          )}
        </span>
        <span style={{ marginLeft:'auto', fontSize:FS.micro, color:MUT, fontStyle:'italic' }}>
          wire this into generation &amp; supply chains
        </span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {deps.map(dep => (
          <div key={dep.key}>
            {/* eslint-disable-next-line jsx-a11y/label-has-for -- deprecated rule; label nests the EntityPicker control + has htmlFor, but the static nesting check can't see through the component. label-has-associated-control passes. */}
            <label htmlFor={`ccm-dep-${dep.key}`} style={{
              fontSize:FS.xxs, fontWeight:700, color:MUT,
              textTransform:'uppercase', letterSpacing:'0.04em',
              display:'block', marginBottom:3,
            }}>
              {dep.label}
              <EntityPicker
                category={dep.category}
                categories={dep.categories}
                single={!!dep.single}
                value={draft[dep.key] ?? (dep.single ? '' : [])}
                onChange={(next) => setDraft(d => ({ ...d, [dep.key]: next }))}
                placeholder={`Search ${(dep.categories || [dep.category]).filter(Boolean).map(c => CAT_LABEL[c] || c).join(' / ') || 'catalog'}…`}
              />
            </label>
            {dep.hint && (
              <div style={{
                fontSize:FS.xxs, color:MUT, fontStyle:'italic', marginTop:2,
              }}>{dep.hint}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomContentManager({ search }) {
  const customContent = useStore(s => s.customContent);
  const addCustomItem = useStore(s => s.addCustomItem);
  const updateCustomItem = useStore(s => s.updateCustomItem);
  const deleteCustomItem = useStore(s => s.deleteCustomItem);
  const canUseCustomContent = useStore(s => s.canUseCustomContent());
  const authTier = useStore(s => s.auth.tier);
  const _customContentLoading = useStore(s => s.customContentLoading);
  const _customContentError = useStore(s => s.customContentError);

  const [activeCat, setActiveCat] = useState('institutions');
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState({});

  const catDef = CUSTOM_CATEGORIES.find(c => c.key === activeCat);
  const items = customContent[activeCat] || [];
  const filtered = search ? items.filter(i => {
    const tagStr = Array.isArray(i.tags) ? i.tags.join(' ') : String(i.tags || '');
    return (i.name||'').toLowerCase().includes(search)
        || (i.description||'').toLowerCase().includes(search)
        || tagStr.toLowerCase().includes(search);
  }) : items;

  // ── Premium gate ─────────────────────────────────────────────────────────
  // Free / anon users see an upsell card. If they have grandfathered local
  // items, they can browse them in read-only mode below the upsell.
  if (!canUseCustomContent) {
    const totalCount = Object.values(customContent).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    return (
      <div>
        <CustomContentUpsell existingCount={totalCount} isAnon={authTier === 'anon'} />
        <ReadOnlyCustomContentList search={search} />
      </div>
    );
  }

  const resetDraft = () => { setDraft({}); setAddingNew(false); setEditingId(null); };

  const handleSave = () => {
    if (!draft.name?.trim()) return;
    if (editingId) {
      updateCustomItem(activeCat, editingId, draft);
      setEditingId(null);
    } else {
      addCustomItem(activeCat, draft);
      setAddingNew(false);
    }
    setDraft({});
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setDraft({ ...item });
    setAddingNew(false);
  };

  // Multi-select "pill" picker for controlled-vocabulary list fields (tags,
  // commodities, stressor channels) — selectable, not free text. Stores the
  // selection as an array; parses a legacy comma-string on read so older
  // free-text entries still load.
  const renderPills = (field, options, accent) => {
    const cur = draft[field];
    const arr = Array.isArray(cur)
      ? cur
      : (typeof cur === 'string' && cur ? cur.split(',').map(s => s.trim()).filter(Boolean) : []);
    const set = new Set(arr);
    return (
      <div style={{ display:'flex', flexWrap:'wrap', gap:4, padding:'4px 0' }}>
        {options.map(opt => {
          const on = set.has(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => { const next = new Set(set); if (on) next.delete(opt); else next.add(opt); setDraft(d => ({ ...d, [field]: Array.from(next) })); }}
              style={{
                padding:'2px 8px', borderRadius:10, fontSize:FS.xxs, fontWeight:700,
                cursor:'pointer', border:`1px solid ${on?accent:BOR}`,
                background:on?`${accent}14`:'transparent',
                color:on?accent:SEC, fontFamily:sans, letterSpacing:'0.03em',
              }}
            >{opt}</button>
          );
        })}
      </div>
    );
  };

  const renderField = (field) => {
    const val = draft[field] || '';
    const shared = { id:`ccm-field-${field}`, value:val, onChange:e => setDraft(d=>({...d,[field]:e.target.value})), style:{ width:'100%', padding:'5px 8px', border:`1px solid ${BOR}`, borderRadius:4, fontSize:FS.sm, fontFamily:sans, color:INK, outline:'none', background:CARD } };

    switch(field) {
      case 'category': return <CategorySelect type={activeCat} value={val} customContent={customContent} onChange={v => setDraft(d => ({ ...d, category: v }))} style={shared.style} />;
      case 'tierMin': return <select {...shared} value={val||''}><option value="">Any tier</option>{TIERS.map(t=><option key={t} value={t}>{t}</option>)}</select>;
      case 'tierMax': return <select {...shared} value={val||''}><option value="">No upper limit</option>{TIERS.map(t=><option key={t} value={t}>{t}</option>)}</select>;
      case 'foodImpact': return <select {...shared} value={val||''}><option value="">No food impact</option>{FOOD_IMPACT.filter(f=>f.key!=='none').map(f=><option key={f.key} value={f.key}>{f.label}</option>)}</select>;
      case 'satisfies': return <CategorySelect options={satisfiesOptions(customContent)} value={val} onChange={v => setDraft(d => ({ ...d, satisfies: v }))} placeholder="Doesn’t fold into a trade category" newLabel="+ Other category…" style={shared.style} />;
      case 'authority': return <select {...shared} value={val||''}><option value="">No authority contribution</option>{POWER_AUTHORITIES.map(a=><option key={a.key} value={a.key}>{a.label}</option>)}</select>;
      case 'defenseRole': return <select {...shared} value={val||''}><option value="">No defense role</option>{DEFENSE_ROLES.map(d=><option key={d.key} value={d.key}>{d.label}</option>)}</select>;
      case 'criticality': return <select {...shared} value={val||''}><option value="">Select…</option>{CRITICALITY.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}</select>;
      case 'economicWeight': return <select {...shared} value={val||''}><option value="">Select…</option>{ECONOMIC_WEIGHT.map(w=><option key={w.key} value={w.key}>{w.label}</option>)}</select>;
      case 'scale': return <select {...shared} value={val||''}><option value="">Select…</option>{['cell','minor','significant','dominant'].map(s=><option key={s} value={s}>{s}</option>)}</select>;
      case 'essential':
      case 'magical':
      case 'criminal': {
        const on = draft[field] === true;
        const accent = field === 'essential' ? '#1a4a20' : field === 'magical' ? swatch.magic : '#8b1a1a';
        const lbl = field === 'essential' ? 'Essential' : field === 'magical' ? 'Magical' : 'Criminal';
        return (
          <button
            type="button"
            onClick={() => setDraft(d => ({ ...d, [field]: !on }))}
            aria-pressed={on}
            style={{
              display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:14,
              fontSize:FS.xs, fontWeight:700, cursor:'pointer', fontFamily:sans,
              border:`1px solid ${on ? accent : BOR}`, background:on ? `${accent}14` : 'transparent',
              color:on ? accent : SEC,
            }}
          >
            {on ? '✓ ' : ''}{lbl}
          </button>
        );
      }
      case 'severity': return <select {...shared} value={val||'moderate'}>{SEVERITY_LEVELS.map(s=><option key={s} value={s}>{s}</option>)}</select>;
      case 'governmentType': return <select {...shared} value={val||''}><option value="">Select...</option>{GOV_TYPES.map(g=><option key={g} value={g}>{g}</option>)}</select>;
      case 'posture': return <select {...shared} value={val||''}><option value="">Select...</option>{POSTURES.map(p=><option key={p} value={p}>{p}</option>)}</select>;
      case 'stability': return <select {...shared} value={val||'stable'}>{['stable','unstable','crisis','collapsing'].map(s=><option key={s} value={s}>{s}</option>)}</select>;
      case 'fortification': return <select {...shared} value={val||'none'}>{['none','basic','moderate','heavy','legendary'].map(f=><option key={f} value={f}>{f}</option>)}</select>;
      case 'militiaLevel': return <select {...shared} value={val||'none'}>{['none','volunteer','trained','professional','elite'].map(m=><option key={m} value={m}>{m}</option>)}</select>;
      case 'factionCount': return <input {...shared} type="number" min="1" max="10" placeholder="Number of factions"/>;
      case 'tags': return <input {...shared} placeholder="Comma-separated keywords (e.g. ancient, foreign, ceremonial) — used for search" onChange={e=>setDraft(d=>({...d,tags:e.target.value}))}/>;
      case 'commodities': return <input {...shared} placeholder="Comma-separated (e.g. iron ore, coal, gemstones)" onChange={e=>setDraft(d=>({...d,commodities:e.target.value}))}/>;
      case 'affects': return renderPills('affects', STRESSOR_AFFECT_CATEGORIES, '#8b1a1a');
      case 'description': return <textarea {...shared} rows={2} placeholder="Description..." style={{...shared.style, resize:'vertical'}}/>;
      default: return <input {...shared} placeholder={field.charAt(0).toUpperCase()+field.slice(1)}/>;
    }
  };

  const renderForm = () => (
    <div style={{ padding:'10px 12px', background:swatch['#F8F4FF'], border:'1px solid #d0c0e0', borderRadius:7, marginBottom:10 }}>
      <div style={{ fontSize:FS.xs, fontWeight:700, color:swatch.magic, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>
        {editingId ? 'Edit Item' : 'New Custom ' + catDef.label.slice(0,-1)}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {catDef.fields.map(f => (
          <div key={f}>
            {/* eslint-disable-next-line jsx-a11y/label-has-for -- deprecated rule; label nests the renderField control + has matching htmlFor, but the static nesting check can't see through renderField(). label-has-associated-control passes. */}
            <label htmlFor={`ccm-field-${f}`} style={{ fontSize:FS.xxs, fontWeight:700, color:MUT, textTransform:'uppercase', letterSpacing:'0.04em' }}>
              {f.replace(/([A-Z])/g,' $1')}
              {renderField(f)}
            </label>
            {FIELD_HINTS[f] && <div style={{ fontSize:FS.micro, color:MUT, fontStyle:'italic', marginTop:2, lineHeight:1.4 }}>{FIELD_HINTS[f]}</div>}
          </div>
        ))}
      </div>

      {/* Dependencies — collapsible. Categories without `dependencies` skip this. */}
      {Array.isArray(catDef.dependencies) && catDef.dependencies.length > 0 && (
        <DependenciesSection
          deps={catDef.dependencies}
          draft={draft}
          setDraft={setDraft}
        />
      )}

      <div style={{ display:'flex', gap:6, marginTop:8 }}>
        <button onClick={handleSave} disabled={!draft.name?.trim()} style={{ padding:'5px 14px', background:draft.name?.trim()?'#5a2a8a':'#ccc', color:swatch.white, border:'none', borderRadius:4, cursor:draft.name?.trim()?'pointer':'not-allowed', fontSize:FS.xs, fontWeight:700, fontFamily:sans }}>{editingId?'Update':'Add'}</button>
        <button onClick={resetDraft} style={{ padding:'5px 10px', background:CARD, color:SEC, border:`1px solid ${BOR}`, borderRadius:4, cursor:'pointer', fontSize:FS.xs, fontFamily:sans }}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Category tabs */}
      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
        {CUSTOM_CATEGORIES.map(c => {
          const count = (customContent[c.key]||[]).length;
          return (
            <button key={c.key} onClick={() => { setActiveCat(c.key); resetDraft(); }}
              style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:12, fontSize:FS.xs, fontWeight:activeCat===c.key?700:500, cursor:'pointer', border:`1px solid ${activeCat===c.key?c.color:BOR}`, background:activeCat===c.key?`${c.color}14`:'transparent', color:activeCat===c.key?c.color:SEC }}>
              <c.Icon size={11}/> {c.label}
              {count > 0 && <span style={{ fontSize:FS.micro, fontWeight:700, background:`${c.color}20`, color:c.color, borderRadius:6, padding:'0 4px', marginLeft:2 }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Supply Chains: discovered + verified, not hand-authored — its own manager. */}
      {activeCat === 'supplyChains' && <SupplyChainsManager />}

      {/* Add button */}
      {activeCat !== 'supplyChains' && !addingNew && !editingId && (
        <button onClick={() => { setAddingNew(true); setDraft({}); }} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', background:swatch.magic, color:swatch.white, border:'none', borderRadius:5, cursor:'pointer', fontSize:FS.xs, fontWeight:700, fontFamily:sans, marginBottom:10 }}>
          <Plus size={12}/> Add Custom {catDef.label.slice(0,-1)}
        </button>
      )}

      {/* Add/edit form */}
      {activeCat !== 'supplyChains' && (addingNew || editingId) && renderForm()}

      {/* Items list */}
      {activeCat !== 'supplyChains' && (filtered.length === 0 ? (
        <div style={{ padding:'20px 16px', textAlign:'center', fontSize:FS.sm, color:MUT }}>
          No custom {catDef.label.toLowerCase()} yet. Click "Add" to create one.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid #7c3aed`, borderRadius:7, padding:'8px 12px', background:'rgba(255,251,245,0.95)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:700, color:INK, flex:1 }}>{item.name}</span>
                <Tag label="Custom" color='#7c3aed'/>
                {item.category && <Tag label={item.category} color={catDef.color}/>}
                <button onClick={() => handleEdit(item)} style={{ background:'none', border:'none', color:MUT, cursor:'pointer', padding:2 }}><Edit3 size={11}/></button>
                <button onClick={() => setDeleteId(deleteId===item.id?null:item.id)} style={{ background:'none', border:'none', color:swatch.danger, cursor:'pointer', padding:2 }}><Trash2 size={11}/></button>
              </div>
              {item.description && <div style={{ fontSize:FS.xs, color:SEC, lineHeight:1.4, marginTop:4 }}>{item.description}</div>}
              <CustomItemAttributes item={item} />
              {item.tags && <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginTop:4 }}>{(typeof item.tags==='string'?item.tags.split(','):item.tags).map((t,i)=><Tag key={i} label={t.trim()} color={MUT}/>)}</div>}
              {/* Affects pills (stressors only) */}
              {Array.isArray(item.affects) && item.affects.length > 0 && (
                <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginTop:4 }}>
                  {item.affects.map((a, i) => (
                    <span key={i} style={{
                      fontSize:FS.micro, fontWeight:700, color:swatch.danger,
                      // Translucent danger fill — was solid swatch.danger on
                      // swatch.danger text, rendering the label invisible.
                      background:`${swatch.danger}14`, border:'1px solid #8b1a1a44',
                      borderRadius:8, padding:'1px 6px',
                      textTransform:'uppercase', letterSpacing:'0.04em',
                    }}>{a}</span>
                  ))}
                </div>
              )}
              {/* Dependencies summary + dangling-ref warnings */}
              {Array.isArray(catDef.dependencies) && catDef.dependencies.length > 0 && (
                <DependencySummary deps={catDef.dependencies} item={item} />
              )}
              {deleteId === item.id && (
                <DeleteConfirmation
                  entityName={item.name}
                  details="Removing from catalog only. Existing settlements that use this item keep their copy."
                  onConfirm={() => { deleteCustomItem(activeCat, item.id); setDeleteId(null); }}
                  onCancel={() => setDeleteId(null)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

// Tier 8.7 — per-tab SEO metadata. Each tab maps to a discrete
// document.title + meta description so search engines index each
// compendium section with its own snippet rather than the generic
// SettlementForge title. Standalone mode (the public route) wires
// this; embedded mode leaves the page title alone.
const TAB_META = Object.freeze({
  tiers:        { title: 'Settlement tiers & trade routes: SettlementForge Compendium',
                  desc: 'Reference for thorp through metropolis tiers, trade route effects (road / crossroads / port / river / mountain pass / isolated), and monster threat levels in SettlementForge.' },
  economy:      { title: 'Economy reference: SettlementForge Compendium',
                  desc: 'Prosperity tiers, priority sliders, exports/imports, supply chains, viability scoring. The simulator\'s economic model, documented.' },
  power:        { title: 'Power & faction archetypes: SettlementForge Compendium',
                  desc: 'Forty-plus settlement archetypes (Merchant Republic, Mage Theocracy, Frontier Outpost, Crusader Synthesis) keyed to slider + threat conditions.' },
  arcane:       { title: 'Magic & religion reference: SettlementForge Compendium',
                  desc: 'How magic and religious institutions interact in the simulator: heresy suppression, arcane economy, theocratic governance, sacred goods trade.' },
  stress:       { title: 'Stress conditions: SettlementForge Compendium',
                  desc: 'Famine, siege, plague, political fracture, monster pressure: how each stress shifts institutions, factions, and supply chains.' },
  neighbour:    { title: 'Neighbour System reference: SettlementForge Compendium',
                  desc: 'Trade partner, ally, patron, client, rival, cold war, hostile. How linked settlements modify each other\'s economy, military, and criminal presence.' },
  institutions: { title: 'Institutional catalog: SettlementForge Compendium',
                  desc: 'Every institution the simulator can generate, the conditions that select it, what it implies for the settlement, and how it interacts with others.' },
});

export default function CompendiumPanel({ config, standalone=false }) {
  const [mode, setMode] = useState('catalog'); // 'catalog' | 'custom'
  // Honor a ?tab=foo deep-link on mount so search-engine landing pages
  // open the right section. Falls back to 'tiers' when missing/invalid.
  //
  // P127 / CP-3 — Also honor URL hash anchors (#trade-routes etc.) so
  // the HelpPopover's "Read full reference →" links can deep-link
  // into a specific section. We map the hash to the matching tab via
  // ANCHOR_TO_TAB below; if the hash doesn't match a known anchor, we
  // ignore it and respect ?tab= instead.
  const initialTab = (() => {
    if (typeof window === 'undefined') return 'tiers';
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    if (TAB_META[t]) return t;
    const hash = (window.location.hash || '').replace(/^#/, '');
    const fromHash = ANCHOR_TO_TAB[hash];
    if (fromHash) return fromHash;
    return 'tiers';
  })();
  const [activeTab, setActiveTab] = useState(initialTab);

  // P127 / CP-3 — Scroll-to-anchor on mount when a hash points into a
  // specific section. The DOM IDs are stamped onto each section by the
  // tab renderers; here we just trigger the scroll once content is in
  // the DOM. Re-runs on tab change so cross-tab anchors work.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = (window.location.hash || '').replace(/^#/, '');
    if (!hash) return;
    // Small delay so the tab content has time to mount.
    const id = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
    return () => clearTimeout(id);
  }, [activeTab]);
  const [search, setSearch] = useState('');
  const customContentCount = useStore(s => s.getCustomContentCount());

  // Tier 8.7 — swap document.title + meta description per tab. Only
  // applies in standalone mode (i.e. when the compendium is the page,
  // not an in-app panel); embedded use cases keep their host title.
  useEffect(() => {
    if (!standalone) return;
    const meta = TAB_META[activeTab];
    if (!meta) return;
    const prevTitle = document.title;
    document.title = meta.title;
    let descEl = document.querySelector('meta[name="description"]');
    const prevDesc = descEl?.getAttribute('content') ?? null;
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.setAttribute('name', 'description');
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', meta.desc);
    return () => {
      document.title = prevTitle;
      if (prevDesc !== null && descEl) descEl.setAttribute('content', prevDesc);
    };
  }, [activeTab, standalone]);

  const renderTab = () => {
    const q = search.toLowerCase();
    switch(activeTab) {
      case 'tiers':        return <TiersTab search={q}/>;
      case 'economy':      return <EconomyTab/>;
      case 'power':        return <PowerTab_ search={q}/>;
      case 'arcane':       return <ArcaneTab/>;
      case 'stress':       return <StressTab search={q}/>;
      case 'neighbour':    return <NeighbourTab search={q}/>;
      case 'institutions': return <InstitutionsTab config={config} search={search}/>;
      default:             return null;
    }
  };

  // P139 / CP-4 — global-search result → navigate. Switch to the catalog,
  // activate the owning tab, pre-filter that tab's local search to the term,
  // then scroll the section anchor into view (works same-tab or cross-tab).
  const handleGlobalSelect = (entry) => {
    if (!entry) return;
    setMode('catalog');
    setActiveTab(entry.tab);
    setSearch(entry.term);
    if (typeof window === 'undefined' || !entry.anchor) return;
    try { window.history.replaceState(null, '', `#${entry.anchor}`); } catch { /* hash unavailable */ }
    setTimeout(() => {
      const el = document.getElementById(entry.anchor);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 140);
  };

  // P139 / CP-3 — content width. Embedded panels are narrow, so a fixed
  // reading cap is fine. On the standalone page we frame the whole panel
  // at PAGE_MAX (below); inside it, the grid tabs (Power, Institutions)
  // fill the frame so they flow into more columns, while the prose/row
  // tabs keep a comfortable reading measure so lines don't sprawl.
  const gridTab = activeTab === 'power' || activeTab === 'institutions';
  const contentColumn = standalone
    ? { maxWidth: gridTab ? '100%' : PROSE_MAX, marginLeft: 'auto', marginRight: 'auto' }
    : { maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' };

  return (
    <div style={standalone
      ? { maxWidth: PAGE_MAX, margin:'0 auto', width:'100%', background:CARD, border:`1px solid ${BOR}`, borderRadius:R.xl, boxShadow:ELEV[1], overflow:'hidden' }
      : { borderRadius:8, overflow:'hidden' }}>
      {/* Mode toggle */}
      <div style={{ display:'flex', background:swatch['#F5EDE0'], borderBottom:`1px solid ${BOR}`, padding:'6px 14px', gap:4 }}>
        <button onClick={()=>setMode('catalog')} style={{ flex:1, padding:'7px 12px', borderRadius:6, border:`1px solid ${mode==='catalog'?GOLD:BOR}`, background:mode==='catalog'?GOLD_BG:'transparent', color:mode==='catalog'?GOLD:SEC, fontSize:FS.sm, fontWeight:mode==='catalog'?700:500, fontFamily:sans, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <Building2 size={13}/> Built-in Catalog
        </button>
        <button onClick={()=>setMode('custom')} style={{ flex:1, padding:'7px 12px', borderRadius:6, border:`1px solid ${mode==='custom'?'#7c3aed':'transparent'}`, background:mode==='custom'?'rgba(124,58,237,0.1)':'transparent', color:mode==='custom'?'#7c3aed':SEC, fontSize:FS.sm, fontWeight:mode==='custom'?700:500, fontFamily:sans, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <Sparkles size={13}/> My Custom Content
          {customContentCount > 0 && <span style={{ fontSize:FS.micro, fontWeight:700, background:'rgba(124,58,237,0.15)', color:swatch['#7C3AED'], borderRadius:8, padding:'1px 6px' }}>{customContentCount}</span>}
        </button>
      </div>

      {mode === 'catalog' ? (
        <>
          {/* P139 / CP-4 — global type-ahead search across every section. */}
          <CompendiumGlobalSearch onSelect={handleGlobalSelect} />
          {/* Tab bar + search */}
          <div style={{ background:PARCH, borderBottom:`1px solid ${BOR}` }}>
            <div style={{ display:'flex', overflowX:'auto', gap:0 }}>
              {TABS.map(({ id, label, Icon }) => (
                <button key={id} onClick={()=>setActiveTab(id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'8px 13px', background:activeTab===id?CARD:'transparent', border:'none', borderBottom:activeTab===id?`2px solid ${GOLD}`:'2px solid transparent', cursor:'pointer', color:activeTab===id?INK:MUT, fontFamily:sans, fontSize:FS.xs, fontWeight:activeTab===id?700:500, whiteSpace:'nowrap', flexShrink:0 }}>
                  <Icon size={12}/> {label}
                </button>))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderTop:`1px solid ${BOR}` }}>
              <Search size={12} style={{ color:MUT, flexShrink:0 }}/>
              <input aria-label="Search catalog" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ flex:1, border:'none', background:'transparent', fontFamily:sans, fontSize:FS.sm, color:INK, outline:'none' }}/>
              {search && <button onClick={()=>setSearch('')} style={{ border:'none', background:'none', cursor:'pointer', color:MUT, fontSize:FS.md, padding:0 }}>x</button>}
            </div>
          </div>
          <div style={{ padding:'14px', background:'rgba(255,251,245,0.95)', ...(standalone ? {} : { maxHeight:'60vh', overflowY:'auto' }) }}>
            <div style={contentColumn}>
              {renderTab()}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Custom content search */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:PARCH, borderBottom:`1px solid ${BOR}` }}>
            <Search size={12} style={{ color:MUT, flexShrink:0 }}/>
            <input aria-label="Search custom content" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search custom content..." style={{ flex:1, border:'none', background:'transparent', fontFamily:sans, fontSize:FS.sm, color:INK, outline:'none' }}/>
            {search && <button onClick={()=>setSearch('')} style={{ border:'none', background:'none', cursor:'pointer', color:MUT, fontSize:FS.md, padding:0 }}>x</button>}
          </div>
          <div style={{ padding:'14px', background:'rgba(255,251,245,0.95)', ...(standalone ? {} : { maxHeight:'60vh', overflowY:'auto' }) }}>
            <CustomContentManager search={search.toLowerCase()}/>
          </div>
        </>
      )}
    </div>
  );
}
