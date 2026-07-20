import { useState, useEffect } from 'react';
import { GOLD, INK, MUTED as MUT, BORDER as BOR, CARD, PARCH, sans, FS, swatch, PAGE_MAX, PROSE_MAX } from './theme.js';
// Icons reuse the set already bundled in the eager vendor-icons chunk (List rides
// in via HowToUse) — no NEW lucide icon is introduced, so first paint is unmoved.
import { Search, Layers, Coins, Shield, Sparkles, AlertTriangle, Link2, Building2, Globe, List } from 'lucide-react';
import Button from './primitives/Button.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import MobileTabStrip from './primitives/MobileTabStrip.jsx';
import DesktopOnlyGate from './primitives/DesktopOnlyGate.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { navigate } from '../hooks/useRoute.js';
import { useStore } from '../store/index.js';
import CompendiumGlobalSearch from './compendium/CompendiumGlobalSearch.jsx';
import { TiersTab, EconomyTab, PowerTab_, ArcaneTab, StressTab, NeighbourTab, InstitutionsTab } from './compendium/CatalogTabs.jsx';
import { OperationsHub, SystemsHub } from './compendium/RegistryHubs.jsx';
import { DeitiesHub, LensesHub, FacetsHub, CalamityHub } from './compendium/CatalogHubs.jsx';
import { CompendiumOverview, AtoZIndex } from './compendium/CompendiumDashboard.jsx';
import { CustomContentManager, ReadOnlyCustomContentList, CUSTOM_CATEGORIES } from './compendium/CustomContent.jsx';
// The flat per-entry index (already in the compendium chunk via the global
// search) + the lazy per-entry head helpers — V-19 long-tail routing.
import { COMPENDIUM_INDEX } from '../domain/compendium/searchIndex.js';
import { setCompendiumEntryMeta, clearCompendiumEntryMeta } from '../lib/seoCompendium.js';

// The custom-content bucket keys a ?cat= deep-link may open (validated so an
// arbitrary query value can never select a non-existent bucket).
const CUSTOM_CAT_KEYS = new Set(CUSTOM_CATEGORIES.map((c) => c.key));

// ── Built-in Catalog Tabs ───────────────────────────────────────────────────

const TABS = [
  { id:'overview',    label:'Overview',           Icon: Layers },
  { id:'tiers',       label:'Tiers & Routes',     Icon: Layers },
  { id:'economy',     label:'Economy',            Icon: Coins },
  { id:'power',       label:'Power & Factions',   Icon: Shield },
  { id:'institutions',label:'Institutions',       Icon: Building2 },
  { id:'operations',  label:'Operations',         Icon: Shield },
  { id:'arcane',      label:'Magic & Religion',   Icon: Sparkles },
  { id:'deities',     label:'Deities',            Icon: Sparkles },
  { id:'living',      label:'Living World',       Icon: Globe },
  { id:'lenses',      label:'Map Lenses',         Icon: Globe },
  { id:'facets',      label:'Facets',             Icon: Building2 },
  { id:'stress',      label:'Stress',             Icon: AlertTriangle },
  { id:'calamity',    label:'Calamity',           Icon: AlertTriangle },
  { id:'neighbour',   label:'Neighbour System',   Icon: Link2 },
  { id:'az',          label:'A–Z Index',     Icon: List },
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
  'living-world': 'living',
  'systems':      'living',
  'pressures':    'living',
  'presets':      'living',
  'operations':   'operations',
  'deities':      'deities',
  'lenses':       'lenses',
  'facets':       'facets',
  'calamity':     'calamity',
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
  living:       { title: 'Living World reference: SettlementForge Compendium',
                  desc: 'The systems that wake once a campaign advances: the causal substrate, pressures, the world pulse, the war layer, and the living pantheon. Opt-in, off by default.' },
  stress:       { title: 'Stress conditions: SettlementForge Compendium',
                  desc: 'Famine, siege, plague, political fracture, monster pressure: how each stress shifts institutions, factions, and supply chains.' },
  neighbour:    { title: 'Neighbour System reference: SettlementForge Compendium',
                  desc: 'Trade partner, ally, patron, client, rival, cold war, hostile. How linked settlements modify each other\'s economy, military, and criminal presence.' },
  institutions: { title: 'Institutional catalog: SettlementForge Compendium',
                  desc: 'Every institution the simulator can generate, the conditions that select it, what it implies for the settlement, and how it interacts with others.' },
  overview:     { title: 'The SettlementForge Compendium',
                  desc: 'Every catalog the deterministic engine renders from its own registries: tiers, institutions, archetypes, deities, the operation registry, map lenses, facets, calamity, and the Living World systems.' },
  operations:   { title: 'The operation registry: SettlementForge Compendium',
                  desc: 'Every operation the engine can perform, with its class (canon / macro / mechanical), scope, the receipt it leaves, and whether it can be undone. The AI never appears as an author.' },
  deities:      { title: 'Deities & pantheon: SettlementForge Compendium',
                  desc: 'The core pantheon: each deity\'s portfolio, alignment, temperament, rank, and domain. The vocabulary for authoring your own gods.' },
  lenses:       { title: 'Map lenses & style schema: SettlementForge Compendium',
                  desc: 'The map rendering lenses (parchment, watercolor, dark fantasy, VTT, accessible) and the style-schema vocabulary a bespoke lens must stay inside.' },
  facets:       { title: 'Facets & interior grammar: SettlementForge Compendium',
                  desc: 'The institution-nature facets and the interior grammar — the interior kinds, room kinds, and furnishing kinds every building draws from.' },
  calamity:     { title: 'Calamity reference: SettlementForge Compendium',
                  desc: 'The one unified calamity mechanic, its cosmetic terrain flavours, and its severity bands. Honest by design: a flood and a fire differ in the telling, not the maths.' },
  az:           { title: 'A–Z index: SettlementForge Compendium',
                  desc: 'Every named Compendium entry in one alphabetical index — archetypes, deities, operations, systems, and more, each a stable deep-link.' },
});

export default function CompendiumPanel({ config, standalone=false, routeEntry }) {
  // V-19 long tail: /compendium/<entry-id> lands here with routeEntry set. Resolve
  // it to the flat index entry (id -> tab + anchor) so the panel opens on that
  // entry's section and its head matches the prerendered page.
  const entryFromRoute = routeEntry
    ? COMPENDIUM_INDEX.find((e) => e.id === routeEntry) || null
    : null;
  // Honor a ?cat=<bucket> deep-link on mount — a direct link into the custom-
  // content workspace focused on one authoring bucket (e.g. ?cat=deities from an
  // "Author a deity" CTA). Only a valid CUSTOM_CATEGORIES key is honored.
  const initialCat = (() => {
    if (typeof window === 'undefined') return null;
    const c = new URLSearchParams(window.location.search).get('cat');
    return c && CUSTOM_CAT_KEYS.has(c) ? c : null;
  })();
  // Honor a ?mode=custom deep-link on mount (the EventComposer deity field's
  // "Author a deity" CTA lands here) so the custom-content tab opens directly. A
  // valid ?cat= implies custom mode — the buckets live only in the custom workspace.
  const initialMode = (() => {
    if (typeof window === 'undefined') return 'catalog';
    if (new URLSearchParams(window.location.search).get('mode') === 'custom') return 'custom';
    return initialCat ? 'custom' : 'catalog';
  })();
  const [mode, setMode] = useState(initialMode); // 'catalog' | 'custom'
  // Honor a ?tab=foo deep-link on mount so search-engine landing pages
  // open the right section. Falls back to 'tiers' when missing/invalid.
  //
  // P127 / CP-3 — Also honor URL hash anchors (#trade-routes etc.) so
  // the HelpPopover's "Read full reference →" links can deep-link
  // into a specific section. We map the hash to the matching tab via
  // ANCHOR_TO_TAB below; if the hash doesn't match a known anchor, we
  // ignore it and respect ?tab= instead.
  const initialTab = (() => {
    // A per-entry route (/compendium/<id>) opens directly on the entry's tab.
    if (entryFromRoute) return entryFromRoute.tab;
    if (typeof window === 'undefined') return 'tiers';
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    if (TAB_META[t]) return t;
    const hash = (window.location.hash || '').replace(/^#/, '');
    const fromHash = ANCHOR_TO_TAB[hash];
    if (fromHash) return fromHash;
    return 'overview';
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
  // ONE reactive mobile flag for every mobile branch below. Desktop reads this
  // as false and every desktop branch renders exactly as before.
  const isMobile = useIsMobile();

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

  // V-19 long tail: arriving via /compendium/<id> refines the head to THAT entry
  // (so a JS-rendering crawler's DOM matches the prerendered page — bar 14) and
  // scrolls its section into view. Runs after the per-tab head effect so the
  // entry head wins on mount; its cleanup removes the DefinedTerm JSON-LD when
  // the panel unmounts (leaving the compendium).
  useEffect(() => {
    if (!standalone || !entryFromRoute) return undefined;
    setCompendiumEntryMeta(entryFromRoute);
    const timer = setTimeout(() => {
      if (typeof document === 'undefined') return;
      const el = document.getElementById(entryFromRoute.anchor);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 140);
    return () => {
      clearTimeout(timer);
      clearCompendiumEntryMeta();
    };
  }, [standalone, entryFromRoute]);

  // Jump to a tab and scroll a section/entry anchor into view (used by the
  // Overview dashboard's hub links and the A–Z index's per-entry links).
  const goto = (tab, anchor) => {
    setActiveTab(tab);
    if (typeof window === 'undefined' || !anchor) return;
    try { window.history.replaceState(null, '', `#${anchor}`); } catch { /* hash unavailable */ }
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 140);
  };

  const renderTab = () => {
    const q = search.toLowerCase();
    switch(activeTab) {
      case 'overview':     return <CompendiumOverview onNavigate={goto}/>;
      case 'tiers':        return <TiersTab search={q}/>;
      case 'economy':      return <EconomyTab/>;
      case 'power':        return <PowerTab_ search={q}/>;
      case 'institutions': return <InstitutionsTab config={config} search={search}/>;
      case 'operations':   return <OperationsHub/>;
      case 'arcane':       return <ArcaneTab/>;
      case 'deities':      return <DeitiesHub/>;
      case 'living':       return <SystemsHub/>;
      case 'lenses':       return <LensesHub/>;
      case 'facets':       return <FacetsHub/>;
      case 'stress':       return <StressTab search={q}/>;
      case 'calamity':     return <CalamityHub/>;
      case 'neighbour':    return <NeighbourTab search={q}/>;
      case 'az':           return <AtoZIndex onNavigate={goto}/>;
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
  // The grid/wide hubs fill the frame (flow into more columns); the prose tabs keep
  // a comfortable reading measure so lines don't sprawl.
  const WIDE_TABS = new Set(['overview', 'power', 'institutions', 'operations', 'deities', 'living', 'lenses', 'facets', 'calamity', 'az']);
  const gridTab = WIDE_TABS.has(activeTab);
  const contentColumn = standalone
    ? { maxWidth: gridTab ? '100%' : PROSE_MAX, marginLeft: 'auto', marginRight: 'auto' }
    : { maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' };

  const panel = (
    <div style={standalone
      ? { maxWidth: PAGE_MAX, margin:'0 auto', width:'100%', background:CARD, border:`1px solid ${BOR}`, overflow:'hidden' }
      : { overflow:'hidden' }}>
      {/* Mode toggle. On mobile the two-option pill can exceed 375px; the band
          scrolls horizontally so the toggle stays whole instead of clipping. */}
      <div style={{ display:'flex', background:swatch['#F5EDE0'], borderBottom:`1px solid ${BOR}`, padding:'6px 14px', gap:4, ...(isMobile ? { overflowX:'auto', WebkitOverflowScrolling:'touch' } : {}) }}>
        <Button onClick={()=>setMode('catalog')} variant={mode==='catalog'?'gold':'ghost'} size="sm" icon={<Building2 size={13}/>} aria-pressed={mode==='catalog'} style={{ flex:1 }}>
          Built-in Catalog
        </Button>
        <Button onClick={()=>setMode('custom')} variant={mode==='custom'?'ai':'ghost'} size="sm" icon={<Sparkles size={13}/>} aria-pressed={mode==='custom'} style={{ flex:1 }}>
          My Custom Content
          {customContentCount > 0 && <span style={{ fontSize:FS.micro, fontWeight:700, background: swatch['#FAF8F4'], color:swatch['#7C3AED'], padding:'1px 6px' }}>{customContentCount}</span>}
        </Button>
      </div>

      {mode === 'catalog' ? (
        <>
          {/* P139 / CP-4 — global type-ahead search across every section. */}
          <CompendiumGlobalSearch onSelect={handleGlobalSelect} />
          {/* Tab bar + search. The tab strip is a WAI-ARIA tablist; the content
              region below is its labelled tabpanel. On mobile the strip silently
              clips off-screen, so we swap in MobileTabStrip (active-into-view,
              edge fades, keyboard pattern). idPrefix="compendium" makes it stamp
              the same compendium-tab-<id> / compendium-panel-<id> ids the panel
              labels itself by, so the aria wiring carries over unchanged. */}
          <div style={{ background:PARCH, borderBottom:`1px solid ${BOR}` }}>
            {isMobile ? (
              <MobileTabStrip
                tabs={TABS}
                value={activeTab}
                onChange={setActiveTab}
                ariaLabel="Compendium sections"
                idPrefix="compendium"
              />
            ) : (
            <div role="tablist" aria-label="Compendium sections" style={{ display:'flex', overflowX:'auto', gap:0 }}>
              {TABS.map(({ id, label, Icon }) => (
                <button key={id} type="button" role="tab" id={`compendium-tab-${id}`} aria-selected={activeTab===id} aria-controls={`compendium-panel-${id}`} onClick={()=>setActiveTab(id)} style={{ display:'flex', alignItems:'center', gap:5, padding:'11px 13px', minHeight:44, background:activeTab===id?CARD:'transparent', border:'none', borderBottom:activeTab===id?`2px solid ${GOLD}`:'2px solid transparent', cursor:'pointer', color:activeTab===id?INK:MUT, fontFamily:sans, fontSize:FS.xs, fontWeight:activeTab===id?700:500, whiteSpace:'nowrap', flexShrink:0 }}>
                  <Icon size={12}/> {label}
                </button>))}
            </div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderTop:`1px solid ${BOR}` }}>
              <Search size={12} style={{ color:MUT, flexShrink:0 }}/>
              <input aria-label="Search catalog" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{ flex:1, border:'none', background:'transparent', fontFamily:sans, fontSize:FS.sm, color:INK, outline:'none' }}/>
              {search && <Button onClick={()=>setSearch('')} variant="ghost" size="sm" aria-label="Clear search">x</Button>}
            </div>
          </div>
          <div role="tabpanel" id={`compendium-panel-${activeTab}`} aria-labelledby={`compendium-tab-${activeTab}`} style={{ padding:'14px', background:CARD, ...(standalone || isMobile ? {} : { maxHeight:'60vh', overflowY:'auto' }) }}>
            <div style={contentColumn}>
              {renderTab()}
            </div>
          </div>
        </>
      ) : isMobile ? (
        <>
          {/* MOBILE: the custom-content manager is desktop-grade authoring
              (multi-bucket forms, dependency pickers, pack import/export). We
              still let you SEARCH and READ existing items, then gate authoring
              behind a calm "best on desktop" panel. */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:PARCH, borderBottom:`1px solid ${BOR}`, minHeight:36 }}>
            <Search size={12} style={{ color:MUT, flexShrink:0 }}/>
            <input aria-label="Search custom content" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search custom content..." style={{ flex:1, border:'none', background:'transparent', fontFamily:sans, fontSize:FS.sm, color:INK, outline:'none' }}/>
            {search && <Button onClick={()=>setSearch('')} variant="ghost" size="sm" aria-label="Clear search">x</Button>}
          </div>
          <div style={{ padding:'14px', background:CARD }}>
            <DesktopOnlyGate
              title="Author custom content on desktop"
              message="Building institutions, deities, trade goods, and content packs takes the full authoring workspace, which has room to work on a larger screen. Your existing items are listed below to read, and you can open this on desktop to add or edit them."
              cta={<Button variant="secondary" size="sm" onClick={() => navigate('generate')}>Test custom content in a generation</Button>}
            />
            {/* Read-only browse of any items already saved — the mobile read path.
                Renders nothing when there are no items, so the gate stands alone. */}
            <ReadOnlyCustomContentList search={search.toLowerCase()} initialCat={initialCat} />
          </div>
        </>
      ) : (
        <>
          {/* Custom content search */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:PARCH, borderBottom:`1px solid ${BOR}` }}>
            <Search size={12} style={{ color:MUT, flexShrink:0 }}/>
            <input aria-label="Search custom content" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search custom content..." style={{ flex:1, border:'none', background:'transparent', fontFamily:sans, fontSize:FS.sm, color:INK, outline:'none' }}/>
            {search && <Button onClick={()=>setSearch('')} variant="ghost" size="sm" aria-label="Clear search">x</Button>}
          </div>
          <div style={{ padding:'14px', background:CARD, ...(standalone ? {} : { maxHeight:'60vh', overflowY:'auto' }) }}>
            <CustomContentManager search={search.toLowerCase()} initialCat={initialCat}/>
          </div>
        </>
      )}
    </div>
  );

  if (!standalone) return panel;

  // Standalone page identity: the canonical Page frame + PageHeader (eyebrow /
  // serif title / italic subtitle), matching the Library/Gallery/Pricing
  // pattern. Embedded panels keep their host heading and skip this.
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
