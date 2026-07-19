import { useState, useMemo } from 'react';
import { GOLD, GOLD_TXT, INK, BODY, MUTED as MUT, SECOND as SEC, BORDER as BOR, serif_, FS, SP, swatch, EMPTY_VALUE } from '../theme.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes';
import { getInstitutionalCatalog, getFullCatalogWithTierMeta } from '../../generators/lookups.js';
// THE REGISTRY-RENDER LAW: tiers, archetypes and relationships all render from the
// generated drift-contract artifact (tiers from the engine's POPULATION_RANGES;
// archetypes/relationships routed through from the authored catalogData taxonomy).
// A divergent constant fails tests/docs/compendiumDataFreshness.test.js.
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { Tag, Row, Card } from './primitives.jsx';
import Button from '../primitives/Button.jsx';

// Gold-as-TEXT clears AA only at the darker token (#7A5A1A, 6.16:1 on card); the
// lighter #a0762a passes as a fill/border but FAILS as text (3.98:1). The Tag
// label and the tier/route/threat name cells render this value as coloured TEXT,
// so it must clear AA as text.
const ECON_TXT = swatch['#7A5A1A'];
// Archetypes + relationships render from the generated artifact CD (see import
// block above). CAT_COLORS stays here — it's display-only.
const CAT_COLORS = { Economic:ECON_TXT, Military:'#8b1a1a', Religious:'#1a4a2a', Magic:'#3a1a7a', Criminal:'#4a1a4a', Balanced:'#1a3a7a' };

// ── Tab content ─────────────────────────────────────────────────────────────

// Section sub-heading inside the prose/row tabs. Builds hierarchy from multiple
// channels (FS.xl serif + weight + the section's domain accent + a left rule) so
// a heading reads as a level ABOVE its child cards (P4) rather than sitting a
// pixel over the card titles.
function SectionHeading({ id, accent=INK, children }) {
  return (
    <div id={id} style={{ fontFamily:serif_, fontSize:FS.xl, fontWeight:700, color:accent, borderLeft:`3px solid ${accent}`, paddingLeft:8, margin:`${SP.xl}px 0 ${SP.sm}px` }}>
      {children}
    </div>
  );
}

// Per-tier display metadata — the population BANDS render from CD.tiers (the engine
// POPULATION_RANGES, corrected: the old inline bands were wrong, e.g. Thorp 20-80 vs
// the real 8-60). Only the colour + institution-count prose stays authored here.
const TIER_META = {
  thorp:      { color:'#8b1a1a', desc:'Single institution. Subsistence only.' },
  hamlet:     { color:'#a05010', desc:'2-3 institutions. Local subsistence. Minimal trade.' },
  village:    { color:ECON_TXT, desc:'4-6 institutions. Surplus production begins. Weekly market.' },
  town:       { color:'#1a5a28', desc:'7-10 institutions. Specialization appears. Guilds form.' },
  city:       { color:'#1a3a7a', desc:'11-14 institutions. Full institutional diversity. Factional politics.' },
  metropolis: { color:'#4a1a6a', desc:'15+ institutions. All systems active. Complex faction dynamics.' },
};

export function TiersTab({ _search='' }) {
  return <>
    <p id="tiers" style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>
      Tier determines the maximum institution count, population band, and available institution categories.
    </p>
    {CD.tiers.map((t)=>{
      const meta = TIER_META[t.id] || { color:GOLD, desc:'' };
      const pop = `${t.min.toLocaleString()}–${t.max.toLocaleString()}`;
      return (
      <div key={t.id} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${BOR}`, alignItems:'flex-start' }}>
        <div style={{ minWidth:96, flexShrink:0 }}><div style={{fontSize:FS.md,fontWeight:700,color:meta.color}}>{t.label}</div><div style={{fontSize:FS.xxs,color:MUT}}>{pop} pop.</div></div>
        <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{meta.desc}</div>
      </div>);
    })}
    <SectionHeading id="trade-routes" accent={swatch['#A0762A']}>Trade Route Access</SectionHeading>
    {[['Road','Standard land access. Moderate trade volume.','#6b5340'],['Crossroads','Multiple road intersections. Higher institution diversity.',ECON_TXT],['Port','Sea or river access. Maritime exports, fishing, naval institutions.','#1a3a7a'],['River','Inland waterway. Cheaper bulk movement. Mill and granary likely.','#1a5a28'],['Mountain Pass','Strategic chokepoint. Toll and garrison institutions likely.','#8b1a1a'],['Isolated','No trade route. Subsistence by necessity.','#4a1a4a']].map(([name,desc,color])=>(
      <div key={name} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
        <span style={{ fontSize:FS.xs, fontWeight:700, color, minWidth:110, flexShrink:0 }}>{name}</span>
        <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{desc}</span>
      </div>))}
    <SectionHeading id="threat" accent={swatch['#8B1A1A']}>Monster Threat</SectionHeading>
    {[['Safe','Civilian institutions dominate. Military is law enforcement only.','#1a5a28'],['Frontier','Active but managed threat. Walls and garrison elevated.',ECON_TXT],['Dangerous','Constant threat. Military dominates. Civilian life constrained.','#8a5010'],['Plagued','Active monster plague. Crisis conditions. Siege-like dynamics.','#8b1a1a']].map(([name,desc,color])=>(
      <div key={name} style={{ display:'flex', gap:10, padding:'6px 0', borderBottom:`1px solid ${BOR}` }}>
        <span style={{ fontSize:FS.xs, fontWeight:700, color, minWidth:110, flexShrink:0 }}>{name}</span>
        <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{desc}</span>
      </div>))}
  </>;
}

export function EconomyTab() {
  return <>
    <div id="economy" />
    {/* Italic descriptor lead-in — the per-tab one-liner that frames the section
        before its cards. */}
    <div style={{ fontSize:FS.xs, color:BODY, fontStyle:'italic', margin:'0 0 12px' }}>
      How prosperity is produced, traded, and stressed.
    </div>
    {/* The lead concept — prosperity is an OUTPUT, not a dial — is the focal
        tier; the rest are the quieter supporting set (P4). */}
    <Card title="Prosperity Tiers" accent={GOLD} lead>Subsistence to Affluent. Derived from export volume, income sources, supply chains, trade route, and safety. Not a dial. An output.</Card>
    <Card title="Priority Sliders" accent='#a0762a'>Sliders shift institutional probability, not guarantee it. They interact: high Religion + low Magic triggers heresy suppression.</Card>
    <Card title="Exports & Imports" accent='#1a5a28'>Exports are surplus production. Imports are gaps. Heavy import dependency creates trade vulnerability.</Card>
    <Card title="Supply Chains" accent='#1a3a7a'>Linked production sequences. A broken input degrades the output. Magic can substitute for some missing material inputs.</Card>
    <Card title="Viability Score" accent='#8b1a1a'>Economic stress analysis showing which factors are supporting prosperity and which are fragile.</Card>
  </>;
}

export function PowerTab_({ search='' }) {
  const cats = ['All', ...CD.archetypes.categories];
  const [cat, setCat] = useState('All');
  // Dead-first-click guard: a routed global-search jump (search prop present)
  // must reveal its target regardless of a stale local category filter, or the
  // AND below could land the reader on an empty grid — a dead first click (P8).
  // We derive the effective category instead of mutating state in an effect: an
  // active search forces 'All', and the picker still reflects the user's pick
  // once search clears.
  const effectiveCat = search ? 'All' : cat;
  const filtered = CD.archetypes.entries.filter(a => (effectiveCat==='All'||a.cat===effectiveCat) && (!search||a.name.toLowerCase().includes(search)||a.desc.toLowerCase().includes(search)));
  return <>
    <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>Archetypes emerge when slider combinations cross thresholds. Faction power = institutional base x public legitimacy.</p>
    <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:12 }}>
      {cats.map(c => <Button key={c} onClick={() => setCat(c)} variant={effectiveCat===c?'primary':'ghost'} size="sm" aria-pressed={effectiveCat===c}>{c}</Button>)}
    </div>
    {filtered.length === 0 ? (
      <div style={{ padding:'20px 16px', textAlign:'center' }}>
        <div style={{ fontSize:FS.sm, color:BODY, marginBottom:10 }}>No archetypes match the current filter.</div>
        <Button onClick={() => setCat('All')} variant="secondary" size="sm">Clear filter</Button>
      </div>
    ) : (
    <div id="archetypes" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:8 }}>
      {filtered.map(a => (
        <div key={a.name} style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid ${CAT_COLORS[a.cat]||GOLD}`, padding:'10px 12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <span style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:700, color:INK, flex:1 }}>{a.name}</span>
            <Tag label={a.cat} color={CAT_COLORS[a.cat]||GOLD}/>
          </div>
          <div style={{ fontSize:FS.xxs, color:MUT, fontStyle:'italic', marginBottom:4 }}>{a.cond}</div>
          <div style={{ fontSize: FS['11.5'], color:SEC, lineHeight:1.5 }}>{a.desc}</div>
        </div>))}
    </div>
    )}
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
    <div id="stress" style={{ padding:'10px 12px', background:`${GOLD}10`, border:`1px solid ${GOLD}40`, borderLeft:`3px solid ${GOLD}`, marginBottom:12 }}>
      <div style={{ fontSize:FS.xs, fontWeight:800, color:GOLD_TXT, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>Stresses Compound</div>
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55, margin:0 }}>Multiple stresses compound. Famine + Political Fracture means food distribution is contested by factions.</p>
    </div>
    {list.filter(s=>!search||(s.label||'').toLowerCase().includes(search)||(s.description||s.desc||'').toLowerCase().includes(search)).map(s => (
      <div key={s.label||s.id} style={{ padding:'8px 0', borderBottom:`1px solid ${BOR}` }}>
        <div style={{ fontSize:FS.md, fontWeight:700, color:swatch.danger, marginBottom:3 }}>{s.label}</div>
        <div style={{ fontSize:FS.sm, color:SEC, lineHeight:1.55 }}>{s.description||s.desc||EMPTY_VALUE}</div>
      </div>))}
  </>;
}

export function NeighbourTab({ search='' }) {
  return <>
    <p id="neighbours" style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 12px' }}>Relationship types modify the economic engine, faction weights, and institution probabilities before generation.</p>
    {CD.relationships.entries.filter(r=>!search||r.label.toLowerCase().includes(search)||r.effect.toLowerCase().includes(search)).map(r => (
      <div key={r.id} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:`1px solid ${BOR}`, alignItems:'flex-start' }}>
        <span style={{ fontSize:FS.xs, fontWeight:700, color:r.color, minWidth:105, flexShrink:0, background:`${r.color}14`, padding:'2px 7px', textAlign:'center' }}>{r.label}</span>
        <span style={{ fontSize:FS.sm, color:SEC, lineHeight:1.5 }}>{r.effect}</span>
      </div>))}
    <SectionHeading accent={INK}>Cross-Settlement Systems</SectionHeading>
    {[['NPC Contacts','Named NPCs from both settlements paired by category and relationship type.'],['Cross-Settlement Conflicts','Mechanically-derived disputes: market contests, border incursions, intelligence operations.'],['Bidirectional Cascade','Renaming an NPC or faction propagates to all linked partner records.'],['Delink Cleanup','Removing a link removes all cross-settlement contacts and conflicts from both settlements.']].map(([label,desc])=><Row key={label} label={label} lw={160}>{desc}</Row>)}
  </>;
}

export function InstitutionsTab({ _config, search }) {
  // Catalog load can throw (the live lookups read generated data). Track the
  // failure explicitly so a load FAILURE is distinguishable from a zero-result
  // SEARCH below — otherwise both render the same "no matches" copy and the
  // reader is told to clear a search that isn't the problem (P10).
  const { catalog, loadFailed } = useMemo(() => {
    try { return { catalog: getFullCatalogWithTierMeta(), loadFailed: false }; }
    catch {
      try { return { catalog: getInstitutionalCatalog('all'), loadFailed: false }; }
      catch { return { catalog: {}, loadFailed: true }; }
    }
  }, []);
  const all = useMemo(() => {
    const seen = new Set();
    return Object.entries(catalog).flatMap(([cat, catData]) =>
      Object.entries(catData||{}).map(([name, props]) => ({ name, category:cat, ...props }))
    ).filter(i => { if(!i.name||seen.has(i.name)) return false; seen.add(i.name); return true; });
  }, [catalog]);
  // Economy uses the gold-as-text token (#7A5A1A): catColors is the Tag color,
  // which renders as label TEXT, so #a0762a (AA fail as text) can't be used here.
  const catColors = { Economy:ECON_TXT, Military:'#8b1a1a', Magic:'#3a1a7a', Religion:'#1a4a2a', Criminal:'#4a1a4a', 'Government/Admin':'#1a3a7a' };
  const filtered = useMemo(() => {
    if (!search) return all.slice(0, 48);
    const q = search.toLowerCase();
    return all.filter(i => (i.name||'').toLowerCase().includes(q) || (i.desc||'').toLowerCase().includes(q) || (i.category||'').toLowerCase().includes(q) || (i.tags||[]).some(t=>(t||'').toLowerCase().includes(q))).slice(0,80);
  }, [all, search]);
  // A catalog-load failure (no data AND nothing was searched) is a real error,
  // not an empty result — surface it as such with a reload affordance (P10).
  if (loadFailed && all.length === 0) {
    return (
      <div role="alert" style={{ padding:'20px 16px', textAlign:'center' }}>
        <div style={{ fontSize:FS.sm, color:BODY, marginBottom:10, lineHeight:1.5 }}>
          The institution catalog could not load.
        </div>
        <Button onClick={() => { if (typeof window !== 'undefined') window.location.reload(); }} variant="secondary" size="sm">Reload</Button>
      </div>
    );
  }
  return <>
    {/* Italic descriptor lead-in, the one-liner above the entry list. */}
    <div style={{ fontSize:FS.xs, color:BODY, fontStyle:'italic', margin:'0 0 8px' }}>
      Every institution the simulator can generate, and what selects it.
    </div>
    {/* The load-bearing fact (the counts) reads loud in BODY/bold; the label
        words around it are quieted, not the value. */}
    <p style={{ fontSize:FS.sm, color:BODY, lineHeight:1.5, margin:'0 0 10px' }}>
      {search
        ? <><strong>{filtered.length}</strong> results</>
        : <>Showing first <strong>48</strong> of <strong>{all.length}</strong> institutions. Use search to filter.</>}
    </p>
    {filtered.length === 0 ? (
      <div style={{ padding:'20px 16px', textAlign:'center', fontSize:FS.sm, color:BODY }}>
        No institutions match your search. Clear the search box above to see the full catalog.
      </div>
    ) : (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:6 }}>
      {filtered.map(inst => (
        <div key={inst.name} style={{ border:`1px solid ${BOR}`, padding:'8px 10px' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:5, marginBottom:3 }}>
            <span style={{ fontFamily:serif_, fontSize: FS['12.5'], fontWeight:700, color:INK, flex:1, lineHeight:1.3 }}>{inst.name}</span>
            {inst.required && <Tag label="Core" color='#1a3a7a' title="Always present at this tier. Generated every time, never rolled by chance."/>}
          </div>
          {inst.category && <Tag label={inst.category} color={catColors[inst.category]||GOLD}/>}
          {inst.desc && <div style={{ fontSize:FS.xs, color:SEC, lineHeight:1.4, marginTop:4 }}>{inst.desc}</div>}
        </div>))}
    </div>
    )}
  </>;
}
