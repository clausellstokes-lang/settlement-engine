import { useState, useMemo } from 'react';
import { GOLD, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, serif_, FS, swatch, EMPTY_VALUE } from '../theme.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes';
import { getInstitutionalCatalog, getFullCatalogWithTierMeta } from '../../generators/lookups.js';
// P139 — REL_TYPES + ARCHETYPES lifted to the shared pure-data module so the
// global-search index (CP-4) and these tabs render from one source of truth.
import { ARCHETYPES, REL_TYPES } from '../../domain/compendium/catalogData.js';
// W6 — banded concepts render their FULL ladder (every rung named + a one-line
// reading), derived from the engine's typed band tables. Never enumerate a band
// list by hand here; the projection lives in domain/compendium/bandLadders.js.
import { bandLaddersForTab } from '../../domain/compendium/bandLadders.js';
import { Tag, Row, Card, BandLadder } from './primitives.jsx';
import Button from '../primitives/Button.jsx';

// REL_TYPES + ARCHETYPES are imported from '../../domain/compendium/catalogData.js'
// (see import block above). CAT_COLORS stays here — it's display-only.
const CAT_COLORS = { Economic:'#a0762a', Military:'#8b1a1a', Religious:'#1a4a2a', Magic:'#3a1a7a', Criminal:'#4a1a4a', Balanced:'#1a3a7a' };

// ── Tab content ─────────────────────────────────────────────────────────────

export function TiersTab({ _search='' }) {
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

export function EconomyTab() {
  return <>
    <div id="economy" />
    {bandLaddersForTab('economy').map((l) => (
      <BandLadder key={l.id} concept={l.concept} blurb={l.blurb} levels={l.levels} accent={GOLD} />))}
    <Card title="Priority Sliders" accent='#a0762a'>Sliders shift institutional probability, not guarantee it. They interact: high Religion + low Magic triggers heresy suppression.</Card>
    <Card title="Exports & Imports" accent='#1a5a28'>Exports are surplus production. Imports are gaps. Heavy import dependency creates trade vulnerability.</Card>
    <Card title="Supply Chains" accent='#1a3a7a'>Linked production sequences. A broken input degrades the output. Magic can substitute for some missing material inputs.</Card>
    <Card title="Viability Score" accent='#8b1a1a'>Economic stress analysis showing which factors are supporting prosperity and which are fragile.</Card>
  </>;
}

export function PowerTab_({ search='' }) {
  const cats = ['All','Economic','Military','Religious','Criminal','Magic','Balanced'];
  const [cat, setCat] = useState('All');
  const filtered = ARCHETYPES.filter(a => (cat==='All'||a.cat===cat) && (!search||a.name.toLowerCase().includes(search)||a.desc.toLowerCase().includes(search)));
  return <>
    <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>Archetypes emerge when slider combinations cross thresholds. Faction power = institutional base x public legitimacy.</p>
    <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
      {cats.map(c => <Button key={c} onClick={() => setCat(c)} variant={cat===c?'primary':'ghost'} size="sm" aria-pressed={cat===c}>{c}</Button>)}
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
    {/* W6 — how far a criminal interest has taken a seat of power: the capture ladder. */}
    <div style={{ marginTop:16 }}>
      {bandLaddersForTab('power').map((l) => (
        <BandLadder key={l.id} concept={l.concept} blurb={l.blurb} levels={l.levels} accent={CAT_COLORS.Criminal} />))}
    </div>
  </>;
}

export function ArcaneTab() {
  return <>
    <div id="magic" />
    <Card title="Magic as Economic Buffer" accent='#3a1a7a'>High Magic acts as a buffer against deficits. Arcane institutions can substitute for missing production.</Card>
    <Card title="Magic Suppression" accent='#5a2a8a'>Religion 65+ with Magic 38 or less triggers Heresy Suppression. Magic goods suppressed.</Card>
    <Card title="Arcane-Criminal Ecosystem" accent='#4a1a4a'>Magic 52+ and Criminal 58+ creates an Arcane Black Market archetype.</Card>
    <Card title="Religion & Governance" accent='#1a4a2a'>Religion 72+ with low Military produces Theocracy. With strong Crime produces Religious Fraud.</Card>
    <Card title="Magic & Faith Unified" accent='#2a1a6a'>Magic 70+ and Religion 65+ produces Mage Theocracy. Arcane clergy governs.</Card>
  </>;
}

export function StressTab({ search='' }) {
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
        <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55 }}>{s.description||s.desc||EMPTY_VALUE}</div>
      </div>))}
    {/* W6 — how the resulting state reads: the settlement-stability and capacity-strain ladders. */}
    <div style={{ marginTop:16 }}>
      {bandLaddersForTab('stress').map((l) => (
        <BandLadder key={l.id} concept={l.concept} blurb={l.blurb} levels={l.levels} accent={GOLD} />))}
    </div>
  </>;
}

export function NeighbourTab({ search='' }) {
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

export function InstitutionsTab({ _config, search }) {
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

// ── Living World — the campaign-advance reference tab ────────────────────────
// Static, curated reference over the living-world systems (no backend, no store).
// Each group is [title, accent color, prose]. Accents are display-only literals,
// same convention as CAT_COLORS above.
const LIVING_WORLD_GROUPS = [
  ['Causal Substrate', '#1a3a7a',
    'Sixteen canonical variables (legitimacy, food security, unrest, religious authority, …) the engine carries per settlement. Generation seeds them; each advance re-derives them from prior state, never wall-clock.'],
  ['Pressures and Strength', '#a0762a',
    'Nine pressures (military, economic, social, religious, …) score how much a settlement is being pushed. They roll up into a single defend-or-yield signal that drives strategy.'],
  ['World Pulse', '#1a5a28',
    'The per-tick advance: stressors fire, populations and trade drift, institutions are born and die, proposals queue for the DM. Off-by-default toggles keep a peacetime save byte-identical.'],
  ['War Layer', '#8b1a1a',
    'Armies march, sieges form, conquests change rulers; warExhaustion rises until a self-ending peace. Entirely dormant unless the War-layer rule is enabled.'],
  ['Religion and Pantheon', '#7a5a1a',
    'Assigned deities contest converts, gain seats, and steer corruption / aggression / magic legality through their axes. Dormant until a primary deity is assigned and Religion dynamics are on.'],
];

export function LivingWorldTab() {
  return <>
    <p id="living-world" style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
      The generator builds a town in seconds; the <strong>living world</strong> then runs the region for
      years. These are the systems that wake up once a campaign advances. Each is opt-in, off by default,
      and silent for a non-campaign save.
    </p>
    {LIVING_WORLD_GROUPS.map(([title, accent, body]) => (
      <Card key={title} title={title} accent={accent}>{body}</Card>
    ))}
  </>;
}
