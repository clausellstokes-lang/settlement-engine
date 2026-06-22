import { useState, useEffect } from 'react';
import { GOLD, INK, BODY, MUTED as MUT, BORDER as BOR, CARD, PARCH, sans, FS, swatch, R, ELEV, PAGE_MAX, PROSE_MAX } from './theme.js';
import { Search, Layers, Coins, Shield, Sparkles, AlertTriangle, Link2, Building2, Globe, X } from 'lucide-react';
import IconButton from './primitives/IconButton.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import Segmented from './primitives/Segmented.jsx';
import { useStore } from '../store/index.js';
import CompendiumGlobalSearch from './compendium/CompendiumGlobalSearch.jsx';
import { TiersTab, EconomyTab, PowerTab_, ArcaneTab, LivingWorldTab, StressTab, NeighbourTab, InstitutionsTab } from './compendium/CatalogTabs.jsx';
import { CustomContentManager } from './compendium/CustomContent.jsx';

// ── Built-in Catalog Tabs ───────────────────────────────────────────────────

const TABS = [
  { id:'tiers',       label:'Tiers & Routes',         Icon: Layers },
  { id:'economy',     label:'Economy',                 Icon: Coins },
  { id:'power',       label:'Power & Factions',        Icon: Shield },
  { id:'arcane',      label:'Religion & the Pantheon', Icon: Sparkles },
  { id:'living',      label:'Living World',            Icon: Globe },
  { id:'stress',      label:'Stress',                  Icon: AlertTriangle },
  { id:'neighbour',   label:'Neighbour System',        Icon: Link2 },
  { id:'institutions',label:'Institutions',            Icon: Building2 },
];

// Tabs whose content actually consumes the per-tab filter. The prose tabs
// (economy/arcane/living) are short curated reference and take no search prop,
// so the filter row is hidden on them rather than rendering a control that
// silently no-ops — the cardinal correct-mapping failure.
const SEARCHABLE_TABS = new Set(['tiers', 'power', 'stress', 'neighbour', 'institutions']);

// Anchor → tab map. HelpPopover and external deep-links
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
  'pantheon':     'arcane',
  'living-world': 'living',
  'stress':       'stress',
  'threat':       'stress',
  'neighbours':   'neighbour',
  'institutions': 'institutions',
});

// ── Main component ──────────────────────────────────────────────────────────

// Per-tab SEO metadata. Each tab maps to a discrete
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
  arcane:       { title: 'Religion & the Pantheon reference: SettlementForge Compendium',
                  desc: 'The deity axes (alignment, temperament, rank) and their living-world effects, dormant-until-assigned, the conversion contest, magic legality, and theocratic governance in SettlementForge.' },
  living:       { title: 'The Living World reference: SettlementForge Compendium',
                  desc: 'The simulation substrate behind the generator: causal variables, pressures and settlement strength, the World Pulse, the self-ending war layer, and the pantheon.' },
  stress:       { title: 'Stress conditions: SettlementForge Compendium',
                  desc: 'Famine, siege, plague, political fracture, monster pressure: how each stress shifts institutions, factions, and supply chains.' },
  neighbour:    { title: 'Neighbour System reference: SettlementForge Compendium',
                  desc: 'Trade partner, ally, patron, client, rival, cold war, hostile. How linked settlements modify each other\'s economy, military, and criminal presence.' },
  institutions: { title: 'Institutional catalog: SettlementForge Compendium',
                  desc: 'Every institution the simulator can generate, the conditions that select it, what it implies for the settlement, and how it interacts with others.' },
});

export default function CompendiumPanel({ standalone=false }) {
  const [mode, setMode] = useState('catalog'); // 'catalog' | 'custom'
  // Honor a ?tab=foo deep-link on mount so search-engine landing pages
  // open the right section. Falls back to 'tiers' when missing/invalid.
  //
  // Also honor URL hash anchors (#trade-routes etc.) so
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

  // Scroll-to-anchor on mount when a hash points into a
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

  // Swap document.title + meta description per tab. Only
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
      case 'living':       return <LivingWorldTab/>;
      case 'stress':       return <StressTab search={q}/>;
      case 'neighbour':    return <NeighbourTab search={q}/>;
      case 'institutions': return <InstitutionsTab search={search}/>;
      default:             return null;
    }
  };

  // Global-search result → navigate. Switch to the catalog,
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

  // Content width. Embedded panels are narrow, so a fixed
  // reading cap is fine. On the standalone page we frame the whole panel
  // at PAGE_MAX (below); inside it, the grid tabs (Power, Institutions)
  // fill the frame so they flow into more columns, while the prose/row
  // tabs keep a comfortable reading measure so lines don't sprawl.
  const gridTab = activeTab === 'power' || activeTab === 'institutions';
  // Both mounts route through the shared prose cap so neither can drift back to a
  // bespoke column width (P12); the embedded panel no longer hard-codes 760.
  const contentColumn = standalone
    ? { maxWidth: gridTab ? '100%' : PROSE_MAX, marginLeft: 'auto', marginRight: 'auto' }
    : { maxWidth: PROSE_MAX, marginLeft: 'auto', marginRight: 'auto' };

  const panel = (
    <div style={standalone
      ? { maxWidth: PAGE_MAX, margin:'0 auto', width:'100%', background:CARD, border:`1px solid ${BOR}`, borderRadius:R.xl, boxShadow:ELEV[1], overflow:'hidden' }
      : { borderRadius:8, overflow:'hidden' }}>
      {/* Chrome (mode toggle → global search → tab strip) shares ONE parchment
          ground and is separated by spacing, with a single divider only at the
          content boundary (the tab strip's bottom rule). The toggle and the
          global-search band no longer carry their own full-width rules, so the
          surface presents one floor above content instead of three stacked
          ones (P5). Switching mode clears the per-region filter so a stale,
          invisible-origin term can't bleed across regions (P8). */}
      <div style={{ display:'flex', background:PARCH, padding:'6px 14px' }}>
        <Segmented
          ariaLabel="Compendium mode"
          size="sm"
          value={mode}
          onChange={(id)=>{ setMode(id); setSearch(''); }}
          options={[
            { id:'catalog', label:'Built-in catalog', icon:Building2 },
            { id:'custom', icon:Sparkles, label:(
              <>My custom content {customContentCount > 0 && <span style={{ marginLeft:4, fontSize:FS.xs, fontWeight:700, background:swatch['#7C3AED12'], color:swatch['#7C3AED'], borderRadius:8, padding:'1px 6px' }}>{customContentCount}</span>}</>
            ) },
          ]}
        />
      </div>

      {mode === 'catalog' ? (
        <>
          {/* Global type-ahead search across every section — the single
              dominant search affordance for this surface. Its own bordered input
              box marks the affordance, so the band needs no full-width rule. */}
          <CompendiumGlobalSearch onSelect={handleGlobalSelect} />
          {/* Tab navigation + an inline per-tab filter, the one control region
              that owns the divider to content. Selecting a tab clears the filter
              so the next tab doesn't silently inherit a term typed for the
              previous one (P8). */}
          <div style={{ background:PARCH, borderBottom:`1px solid ${BOR}` }}>
            <div role="tablist" aria-label="Compendium sections" style={{ display:'flex', overflowX:'auto', gap:0 }}>
              {TABS.map(({ id, label, Icon }) => (
                <button key={id} type="button" role="tab" id={`compendium-tab-${id}`} aria-selected={activeTab===id} aria-controls={`compendium-panel-${id}`} onClick={()=>{ setActiveTab(id); setSearch(''); }} style={{ display:'flex', alignItems:'center', gap:5, padding:'13px 14px', minHeight:44, background:activeTab===id?CARD:'transparent', border:'none', borderBottom:activeTab===id?`2px solid ${GOLD}`:'2px solid transparent', cursor:'pointer', color:activeTab===id?INK:BODY, fontFamily:sans, fontSize:FS.xs, fontWeight:activeTab===id?700:500, whiteSpace:'nowrap', flexShrink:0 }}>
                  <Icon size={12}/> {label}
                </button>))}
            </div>
            {SEARCHABLE_TABS.has(activeTab) && (
              <div style={{ ...contentColumn, display:'flex', alignItems:'center', gap:6, padding:'2px 14px 6px', minHeight:42 }}>
                <Search size={11} style={{ color:MUT, flexShrink:0 }}/>
                <input aria-label="Filter this tab" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Filter this tab…" style={{ flex:1, border:'none', background:'transparent', fontFamily:sans, fontSize:FS.xs, color:INK, outline:'none' }}/>
                {search && <IconButton Icon={X} label="Clear filter" tone="ghost" size="sm" onClick={()=>setSearch('')} />}
              </div>
            )}
          </div>
          <div role="tabpanel" id={`compendium-panel-${activeTab}`} aria-labelledby={`compendium-tab-${activeTab}`} style={{ padding:'14px', background:'rgba(255,251,245,0.95)', ...(standalone ? {} : { maxHeight:'60vh', overflowY:'auto' }) }}>
            <div style={contentColumn}>
              {renderTab()}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Custom content search */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:PARCH, borderBottom:`1px solid ${BOR}`, minHeight:36 }}>
            <Search size={12} style={{ color:MUT, flexShrink:0 }}/>
            <input aria-label="Search custom content" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search custom content..." style={{ flex:1, border:'none', background:'transparent', fontFamily:sans, fontSize:FS.sm, color:INK, outline:'none' }}/>
            {search && <IconButton Icon={X} label="Clear search" tone="ghost" size="sm" onClick={()=>setSearch('')} />}
          </div>
          <div style={{ padding:'14px', background:'rgba(255,251,245,0.95)', ...(standalone ? {} : { maxHeight:'60vh', overflowY:'auto' }) }}>
            <CustomContentManager search={search.toLowerCase()}/>
          </div>
        </>
      )}
    </div>
  );

  if (!standalone) return panel;

  // Standalone page identity: the canonical Page frame + PageHeader
  // (eyebrow / serif title / italic subtitle), matching the
  // Library/Gallery/Pricing pattern. Embedded panels keep their host heading
  // and skip this. Fixes the 5-second test — the surface's purpose was
  // previously carried only by document.title.
  return (
    <Page>
      <PageHeader
        eyebrow="Rules and data reference"
        title="Compendium"
        subtitle="How the simulator builds and runs a settlement: the rules behind every dossier."
      />
      {panel}
    </Page>
  );
}
