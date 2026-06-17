import { useState, useEffect } from 'react';
import { GOLD, GOLD_BG, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, PARCH, sans, FS, swatch, R, ELEV, PAGE_MAX, PROSE_MAX } from './theme.js';
import { Search, Layers, Coins, Shield, Sparkles, AlertTriangle, Link2, Building2 } from 'lucide-react';
import { useStore } from '../store/index.js';
import CompendiumGlobalSearch from './compendium/CompendiumGlobalSearch.jsx';
import { TiersTab, EconomyTab, PowerTab_, ArcaneTab, StressTab, NeighbourTab, InstitutionsTab } from './compendium/CatalogTabs.jsx';
import { CustomContentManager } from './compendium/CustomContent.jsx';

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
