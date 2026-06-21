import { useState, useMemo } from 'react';
import { GOLD, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, serif_, FS, swatch } from '../theme.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes';
import { getInstitutionalCatalog, getFullCatalogWithTierMeta } from '../../generators/lookups.js';
// REL_TYPES + ARCHETYPES lifted to the shared pure-data module so the
// global-search index and these tabs render from one source of truth.
import { ARCHETYPES, REL_TYPES } from '../../domain/compendium/catalogData.js';
// The Religion & the Pantheon catalog tab documents the deity axes
// + their effects FROM THE SHARED SINGLE SOURCE (the same coupling strings the
// engine + the dossier read), never hand-copied numbers.
import { DEITY_AXIS_EFFECTS } from '../../domain/display/deityEffects.js';
import { Tag, Row, Card } from './primitives.jsx';
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
    <Card title="Prosperity Tiers" accent={GOLD}>Subsistence to Affluent. Derived from export volume, income sources, supply chains, trade route, and safety. Not a dial. An output.</Card>
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
  </>;
}

const DEITY_ACCENT = swatch['#7A5A1A'];

// The three deity axes documented for the catalog, each effect string pulled
// from the SHARED single source (DEITY_AXIS_EFFECTS) so the reference never
// drifts from the engine. Axis label + the per-value effect copy.
const PANTHEON_AXES = [
  {
    axis: 'Alignment', sub: 'good / evil / neutral → corruption',
    rows: [
      ['Good', DEITY_AXIS_EFFECTS.alignment.good.effect],
      ['Evil', DEITY_AXIS_EFFECTS.alignment.evil.effect],
      ['Neutral', 'No pull on corruption.'],
    ],
  },
  {
    axis: 'Temperament', sub: 'warlike / peacelike / neutral → aggression',
    rows: [
      ['Warlike', DEITY_AXIS_EFFECTS.temperament.warlike.effect],
      ['Peacelike', DEITY_AXIS_EFFECTS.temperament.peacelike.effect],
      ['Neutral', "No pull on the realm's aggression."],
    ],
  },
  {
    axis: 'Rank', sub: 'major / minor / cult → religious authority (+ magic legality)',
    rows: [
      ['Major', `${DEITY_AXIS_EFFECTS.rank.major.effect}. Only a major god also tightens magic legality (a warlike/evil major makes magic openly opposed).`],
      ['Minor', DEITY_AXIS_EFFECTS.rank.minor.effect],
      ['Cult', DEITY_AXIS_EFFECTS.rank.cult.effect],
    ],
  },
];

// Religion & the Pantheon — replaces the stale "Magic & Religion"
// tab. Documents the three deity axes + their effects (from the shared source),
// the dormant-until-assigned model, the conversion contest, tiers, and the
// Ascendancy / Twilight arcs. Keeps the legacy `#magic` anchor so search index
// + ANCHOR_TO_TAB deep-links still land here.
export function ArcaneTab() {
  return <>
    <div id="magic" />
    <p id="religion" style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
      A homebrew pantheon steers the living world through three frozen axes. A god is
      <strong> dormant</strong> until you assign it as a settlement&rsquo;s primary deity and turn on
      Religion dynamics — until then it changes nothing (byte-identical to a deity-free world).
    </p>

    {PANTHEON_AXES.map(({ axis, sub, rows }) => (
      <div key={axis} style={{ marginBottom:10 }}>
        <div style={{ fontFamily:serif_, fontSize:FS['14'], fontWeight:700, color:DEITY_ACCENT }}>{axis}</div>
        <div style={{ fontSize:FS.xxs, color:MUT, fontStyle:'italic', marginBottom:4 }}>{sub}</div>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display:'flex', gap:10, padding:'5px 0', borderBottom:`1px solid ${BOR}` }}>
            <span style={{ fontSize:FS.xs, fontWeight:700, color:DEITY_ACCENT, minWidth:70, flexShrink:0 }}>{k}</span>
            <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{v}</span>
          </div>
        ))}
      </div>
    ))}

    <div style={{ fontFamily:serif_, fontSize:FS['14'], fontWeight:600, color:INK, margin:'14px 0 8px' }}>The conversion contest</div>
    <Card title="Dormant until assigned" accent={DEITY_ACCENT}>A deity only acts once it is a settlement&rsquo;s primary god (the embed-on-assign bridge) AND the campaign&rsquo;s Religion-dynamics rule is on. No assignment, no effect.</Card>
    <Card title="Contesting converts" accent='#1a4a2a'>With religion dynamics on, neighbouring faiths contest each tick — alignment-direction match, warlike posture, and rank weight the pull. A winning faith gains seats; a losing one cedes them.</Card>
    <Card title="Tiers — major / minor / cult" accent='#3a1a7a'>Rank scales how hard a god anchors religious authority and whether it regulates magic. A major pantheon-head outweighs a fringe cult.</Card>
    <Card title="Ascendancy & Twilight arcs" accent='#5a2a8a'>A faith that keeps winning rises through an <em>Ascendancy</em> arc (more seats, firmer orthodoxy); one that keeps losing slides into a <em>Twilight</em> arc toward irrelevance.</Card>

    <div style={{ fontFamily:serif_, fontSize:FS['14'], fontWeight:600, color:INK, margin:'14px 0 8px' }}>Magic &amp; faith interplay (generation)</div>
    <Card title="Magic Suppression" accent='#5a2a8a'>Religion 65+ with Magic 38 or less triggers Heresy Suppression. Magic goods suppressed.</Card>
    <Card title="Magic as Economic Buffer" accent='#3a1a7a'>High Magic buffers deficits — arcane institutions can substitute for missing production.</Card>
    <Card title="Magic &amp; Faith Unified" accent='#2a1a6a'>Magic 70+ and Religion 65+ produces Mage Theocracy. Arcane clergy governs.</Card>
  </>;
}

// Living World — the missing static→living-world bridge in the
// reference catalog. Five plain-language groups documenting the simulation
// substrate the generator feeds into once a campaign runs.
const LIVING_WORLD_GROUPS = [
  ['Causal Substrate', '#1a3a7a',
    'Fifteen canonical variables (legitimacy, food security, unrest, religious authority, …) the engine carries per settlement. Generation seeds them; each advance re-derives them from prior state — never wall-clock.'],
  ['Pressures & Strength', '#a0762a',
    'Nine pressures (military, economic, social, religious, …) score how much a settlement is being pushed. settlementStrength rolls them into one defend/yield signal that drives strategy.'],
  ['World Pulse', '#1a5a28',
    'The per-tick advance: stressors fire, populations and trade drift, institutions are born and die, proposals queue for the DM. Off-by-default toggles keep a peacetime save byte-identical.'],
  ['War Layer', '#8b1a1a',
    'Armies march, sieges form, conquests change rulers; warExhaustion rises until a self-ending peace. Entirely dormant unless the War-layer rule is enabled.'],
  ['Religion & Pantheon', DEITY_ACCENT,
    'Assigned deities contest converts, gain seats, and steer corruption / aggression / magic legality through their axes. Dormant until a primary deity is assigned and Religion dynamics are on.'],
];

export function LivingWorldTab() {
  return <>
    <p id="living-world" style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
      The generator builds a town in seconds; the <strong>living world</strong> then runs the region for
      years. These are the systems that wake up once a campaign advances — each opt-in, off by default,
      and silent for a non-campaign save.
    </p>
    {LIVING_WORLD_GROUPS.map(([title, accent, body]) => (
      <Card key={title} title={title} accent={accent}>{body}</Card>
    ))}
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
        <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55 }}>{s.description||s.desc||', '}</div>
      </div>))}
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
