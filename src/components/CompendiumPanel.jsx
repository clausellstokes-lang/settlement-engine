import { useState, useEffect, useRef } from 'react';
import { INK, MUTED as MUT, BORDER as BOR, CARD, PARCH, sans, FS, PAGE_MAX, PROSE_MAX } from './theme.js';
// Icons reuse the set already bundled in the eager vendor-icons chunk (List rides
// in via HowToUse) — no NEW lucide icon is introduced, so first paint is unmoved.
import { Search, Layers, Coins, Shield, Sparkles, AlertTriangle, Link2, Building2, Globe, List, ChevronLeft } from 'lucide-react';
import Button from './primitives/Button.jsx';
import Page from './primitives/Page.jsx';
import PageHeader from './primitives/PageHeader.jsx';
import DesktopOnlyGate from './primitives/DesktopOnlyGate.jsx';
import useIsMobile from '../hooks/useIsMobile.js';
import { navigate } from '../hooks/useRoute.js';
import { purchasesOpen } from '../lib/launchGate.js';
import { useStore } from '../store/index.js';
import CompendiumGlobalSearch from './compendium/CompendiumGlobalSearch.jsx';
import { TiersTab, EconomyTab, PowerTab_, ArcaneTab, StressTab, NeighbourTab, InstitutionsTab } from './compendium/CatalogTabs.jsx';
import { OperationsHub, SystemsHub } from './compendium/RegistryHubs.jsx';
import { CalamityHub } from './compendium/CatalogHubs.jsx';
import { CompendiumHubGrid, AtoZIndex } from './compendium/CompendiumDashboard.jsx';
import { CustomContentManager, ReadOnlyCustomContentList, CUSTOM_CATEGORIES } from './compendium/CustomContent.jsx';
// The flat per-entry index (already in the compendium chunk via the global
// search) + the lazy per-entry head helpers — V-19 long-tail routing.
import { COMPENDIUM_INDEX } from '../domain/compendium/searchIndex.js';
import { setCompendiumEntryMeta, clearCompendiumEntryMeta, setCompendiumSectionMeta } from '../lib/seoCompendium.js';
import { COMPENDIUM_SECTIONS, sectionSlugForTab, tabForSectionSlug } from '../lib/compendiumSections.js';

// The custom-content bucket keys a ?cat= deep-link may open (validated so an
// arbitrary query value can never select a non-existent bucket).
const CUSTOM_CAT_KEYS = new Set(CUSTOM_CATEGORIES.map((c) => c.key));

// Entry pages the Compendium no longer has (owner order 2026-09-16: the Map Lenses page
// left the Compendium). Each id was prerendered and listed in the production sitemap, so
// an old link must not keep its dead address: the panel replaces it with /compendium, and
// the route head (title, description, canonical, og and twitter tags) then describes the
// Overview on screen. This lives here, in the lazy Compendium chunk, rather than as an
// alias in lib/routes.js because the router is first-paint code: a compact `legacy: true`
// alias built there measured 1,048,020 B against the 1,048,000 B entry budget.
// Pinned in tests/ui/compendiumHubs.test.jsx.
const REMOVED_ENTRY_IDS = new Set([
  'lens-parchment', 'lens-watercolor', 'lens-darkfantasy', 'lens-vtt', 'lens-accessible',
]);

// ── The sections ─────────────────────────────────────────────────────────────
// THE OWNER'S WORD (2026-11-10): "Rather than a horizontal scroll, I would like that
// the first page of compendium lists in boxes that are flush to each other maybe in 3
// rows each of the different tabs. Then when one clicks on it they are taken to a
// different page. There is always a back button and clicking the compendium tab when
// not on the main compendium page brings you back to the main compendium page. Custom
// content itself now joins the other tabs."
// The old tab row (and its Overview tab and the Built-in / Custom mode toggle) is
// gone: /compendium is a grid of twelve boxes, each a link to /compendium/<slug>
// (lib/compendiumSections.js owns the slugs and their order).
const SECTION_LOOK = {
  tiers:        { label:'Tiers & Routes',   Icon: Layers },
  economy:      { label:'Economy',          Icon: Coins },
  power:        { label:'Powers',           Icon: Shield },
  institutions: { label:'Institutions',     Icon: Building2 },
  operations:   { label:'Operations',       Icon: Shield },
  arcane:       { label:'Magic & Religion', Icon: Sparkles },
  living:       { label:'Living World',     Icon: Globe },
  stress:       { label:'Stress',           Icon: AlertTriangle },
  calamity:     { label:'Calamity',         Icon: AlertTriangle },
  neighbour:    { label:'Neighbour System', Icon: Link2 },
  az:           { label:'A–Z Index',        Icon: List },
  custom:       { label:'My Custom Content', Icon: Sparkles },
};
const SECTIONS = COMPENDIUM_SECTIONS.map((s) => ({ ...s, ...SECTION_LOOK[s.tab] }));
const SECTION_BY_TAB = Object.freeze(Object.fromEntries(SECTIONS.map((s) => [s.tab, s])));

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
  'calamity':     'calamity',
  'stress':       'stress',
  'threat':       'stress',
  'neighbours':   'neighbour',
  'institutions': 'institutions',
});

/**
 * Where an old-style compendium address now lives (ruling H5), or null when the
 * address is already the landing's own. Pure (exported for the pin).
 * @param {string} search  location.search
 * @param {string} hash    location.hash
 * @returns {{ section?: string, search: string, hash: string }|null}
 */
export function legacyCompendiumTarget(search, hash) {
  const params = new URLSearchParams(search || '');
  const anchor = String(hash || '').replace(/^#/, '');
  const cat = params.get('cat');
  const validCat = cat && CUSTOM_CAT_KEYS.has(cat) ? cat : null;
  if (params.get('mode') === 'custom' || validCat) {
    return { section: 'custom', search: validCat ? `?cat=${encodeURIComponent(validCat)}` : '', hash: '' };
  }
  const tab = params.get('tab');
  if (tab !== null) {
    const slugFor = sectionSlugForTab(tab);
    // A live section keeps its anchor; overview / a removed tab land on the landing.
    return slugFor && tab !== 'custom'
      ? { section: slugFor, search: '', hash: anchor ? `#${anchor}` : '' }
      : { search: '', hash: '' };
  }
  if (anchor && ANCHOR_TO_TAB[anchor]) {
    return { section: sectionSlugForTab(ANCHOR_TO_TAB[anchor]), search: '', hash: `#${anchor}` };
  }
  return null;
}

// ── Main component ──────────────────────────────────────────────────────────

// The landing's own head (the old Overview tab's). Each section page's head lives in
// lib/seoCompendium.js (COMPENDIUM_SECTION_META), shared with the prerender.
const LANDING_META = Object.freeze({
  title: 'The SettlementForge Compendium',
  desc: 'Every catalog the deterministic engine renders from its own registries: tiers, institutions, archetypes, the operation registry, calamity, and the Living World systems.',
});

export default function CompendiumPanel({ config, standalone=false, routeEntry, routeSection }) {
  // Three kinds of page share this panel (ruling H2):
  //   /compendium                → the LANDING: the intro, the global search, the grid.
  //   /compendium/<section-slug> → a SECTION page: Back, the title, its search, its body.
  //   /compendium/<entry-id>     → an ENTRY page (V-19 long tail): its section's page,
  //                                scrolled to the entry, with the entry's own head.
  // An entry id that is not in the index resolves to null and lands on the landing; a
  // REMOVED id (REMOVED_ENTRY_IDS above) also has its dead address replaced below.
  const entryFromRoute = routeEntry
    ? COMPENDIUM_INDEX.find((e) => e.id === routeEntry) || null
    : null;
  // Outside the standalone page (no router props) the panel keeps its own section.
  const [localTab, setLocalTab] = useState(null);
  const activeTab = standalone
    ? (routeSection ? tabForSectionSlug(routeSection) || null : (entryFromRoute ? entryFromRoute.tab : null))
    : localTab;
  const section = activeTab ? SECTION_BY_TAB[activeTab] || null : null;

  useEffect(() => {
    if (!standalone || !routeEntry || !REMOVED_ENTRY_IDS.has(routeEntry)) return;
    navigate('compendium', { replace: true, scroll: false });
  }, [standalone, routeEntry]);
  // OLD LINKS KEEP WORKING (ruling H5). Before the owner's word of 2026-11-10 a
  // section was `/compendium?tab=<id>` (or a bare `#anchor` that ANCHOR_TO_TAB maps to a
  // tab) and custom content was `?mode=custom` (a valid `?cat=` implied it). Each is
  // REPLACED (no new history entry) by its section page, the anchor and `?cat=` kept.
  // `?tab=overview`, an unknown tab and an unknown anchor land on the landing itself.
  useEffect(() => {
    if (!standalone || routeSection || routeEntry || typeof window === 'undefined') return;
    const to = legacyCompendiumTarget(window.location.search, window.location.hash);
    if (!to) return;
    navigate('compendium', { params: to.section ? { section: to.section } : undefined, search: to.search, hash: to.hash, replace: true, scroll: false });
  }, [standalone, routeSection, routeEntry]);
  // Honor a ?cat=<bucket> deep-link — a direct link into the custom-content page
  // focused on one authoring bucket (e.g. ?cat=deities from an "Author a deity" CTA).
  // Only a valid CUSTOM_CATEGORIES key is honored.
  const initialCat = (() => {
    if (typeof window === 'undefined') return null;
    const c = new URLSearchParams(window.location.search).get('cat');
    return c && CUSTOM_CAT_KEYS.has(c) ? c : null;
  })();

  // P127 / CP-3 — scroll a section anchor (#trade-routes etc.) into view once the
  // section's content is in the DOM. Re-runs when the page changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = (window.location.hash || '').replace(/^#/, '');
    if (!hash) return;
    const id = setTimeout(() => {
      if (typeof document === 'undefined') return;
      const el = document.getElementById(hash);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
    return () => clearTimeout(id);
  }, [activeTab]);
  // Each page has its own search: a query typed on one section page does not follow
  // the reader to the next. (The global search hands its term to the page it opens.)
  const [searchState, setSearchState] = useState({ tab: null, q: '' });
  const search = searchState.tab === activeTab ? searchState.q : '';
  const setSearch = (q) => setSearchState({ tab: activeTab, q });
  const customContentCount = useStore(s => s.getCustomContentCount());
  // H8 — ONE SEARCH PER PAGE, AND IT FILTERS (the owner, 2026-11-10: "The search bar acts as a
  // search bar that filters based on string matching"). On a section page the one box narrows
  // what the page shows IN PLACE: every entry on the page whose text does not CONTAIN the typed
  // string —
  // case-insensitive, plain substring — is hidden; clearing the box shows everything again.
  // The sections that already filtered by their own search prop keep doing so underneath.
  const filterRoot = useRef(null);
  useEffect(() => {
    const root = filterRoot.current;
    if (!root || activeTab === 'custom') return undefined;
    const apply = () => {
      for (const el of root.querySelectorAll('[data-filter-hidden]')) {
        el.style.display = el.getAttribute('data-filter-hidden');
        el.removeAttribute('data-filter-hidden');
      }
      const q = search.trim().toLowerCase();
      if (!q) return;
      // Walk down from the page: a child that does not contain the string is hidden whole; a
      // child that does is kept, and is itself narrowed only when it is a list (five or more
      // children) — so an entry's own parts (its title, key, line, chip) are never split.
      const narrow = (list) => {
        for (const child of list.children) {
          if (!(child.textContent || '').toLowerCase().includes(q)) {
            child.setAttribute('data-filter-hidden', child.style.display || '');
            child.style.display = 'none';
          } else if (child.children.length >= 5) {
            narrow(child);
          }
        }
      };
      narrow(root);
    };
    apply();
    const t = setTimeout(apply, 60);
    return () => clearTimeout(t);
  }, [search, activeTab]);
  // ONE reactive mobile flag for every mobile branch below.
  const isMobile = useIsMobile();

  // The document head (standalone only; embedded hosts keep their own title). The
  // landing carries the compendium's own head; a section page its section head; an
  // entry page its entry head (the effect after this one).
  useEffect(() => {
    if (!standalone || entryFromRoute) return;
    if (routeSection) { setCompendiumSectionMeta(routeSection); return; }
    if (activeTab) return;
    document.title = LANDING_META.title;
    let descEl = document.querySelector('meta[name="description"]');
    if (!descEl) {
      descEl = document.createElement('meta');
      descEl.setAttribute('name', 'description');
      document.head.appendChild(descEl);
    }
    descEl.setAttribute('content', LANDING_META.desc);
  }, [standalone, routeSection, entryFromRoute, activeTab]);

  // V-19 long tail: arriving via /compendium/<id> refines the head to THAT entry
  // (so a JS-rendering crawler's DOM matches the prerendered page — bar 14) and
  // scrolls its section into view. Its cleanup removes the DefinedTerm JSON-LD when
  // the entry page is left.
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

  // Open a section's page (pushed, so the browser's Back returns), optionally at an
  // anchor inside it. Used by the landing grid, the A–Z index and the global search.
  const openSection = (tab, anchor) => {
    if (!standalone) { setLocalTab(tab); return; }
    const slugFor = sectionSlugForTab(tab);
    if (!slugFor) return;
    navigate('compendium', { params: { section: slugFor }, hash: anchor ? `#${anchor}` : '', scroll: !anchor });
    if (!anchor) return;
    setTimeout(() => {
      if (typeof document === 'undefined') return;
      const el = document.getElementById(anchor);
      if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 140);
  };
  const backToLanding = () => {
    if (!standalone) { setLocalTab(null); return; }
    navigate('compendium');
  };

  const renderTab = () => {
    const q = search.toLowerCase();
    switch(activeTab) {
      case 'tiers':        return <TiersTab search={q}/>;
      case 'economy':      return <EconomyTab/>;
      case 'power':        return <PowerTab_ search={q}/>;
      case 'institutions': return <InstitutionsTab config={config} search={search}/>;
      case 'operations':   return <OperationsHub/>;
      case 'arcane':       return <ArcaneTab/>;
      case 'living':       return <SystemsHub/>;
      case 'stress':       return <StressTab search={q}/>;
      case 'calamity':     return <CalamityHub/>;
      case 'neighbour':    return <NeighbourTab search={q}/>;
      case 'az':           return <AtoZIndex onNavigate={openSection}/>;
      default:             return null;
    }
  };

  // P139 / CP-4 — global-search result → the owning section's page, its own search
  // pre-filled with the term, the entry's anchor scrolled into view.
  const handleGlobalSelect = (entry) => {
    if (!entry) return;
    setSearchState({ tab: entry.tab, q: entry.term });
    openSection(entry.tab, entry.anchor);
  };

  // P139 / CP-3 — content width. The grid/wide sections fill the frame (flow into
  // more columns); the prose sections keep a comfortable reading measure.
  const WIDE_TABS = new Set(['power', 'institutions', 'operations', 'living', 'calamity', 'az']);
  const gridTab = !activeTab || WIDE_TABS.has(activeTab);
  const contentColumn = standalone
    ? { maxWidth: gridTab ? '100%' : PROSE_MAX, marginLeft: 'auto', marginRight: 'auto' }
    : { maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' };

  const searchBar = (label, placeholder) => (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', background:PARCH, borderBottom:`1px solid ${BOR}`, minHeight:36 }}>
      <Search size={12} style={{ color:MUT, flexShrink:0 }}/>
      <input aria-label={label} value={search} onChange={e=>setSearch(e.target.value)} placeholder={placeholder} style={{ flex:1, minWidth:0, border:'none', background:'transparent', fontFamily:sans, fontSize:FS.sm, color:INK, outline:'none' }}/>
      {search && <Button onClick={()=>setSearch('')} variant="ghost" size="sm" aria-label="Clear search">x</Button>}
    </div>
  );

  let body;
  if (!section) {
    // THE LANDING (ruling H1): the global search and the grid of twelve boxes. (The intro paragraph
    // and the sample-world line were removed by the owner's word of 2026-11-10: "remove the
    // everything here is rednedered by the deteremistic.... all the way to the sample world cnocby...")
    body = (
      <>
        <CompendiumGlobalSearch onSelect={handleGlobalSelect} />
        <div style={{ padding:'14px', background:CARD }}>
          <CompendiumHubGrid sections={SECTIONS} customCount={customContentCount} launchLocked={!purchasesOpen()} onOpen={(s) => openSection(tabForSectionSlug(s))} />
        </div>
      </>
    );
  } else if (activeTab !== 'custom') {
    body = (
      <>
        {searchBar('Search catalog', 'Search...')}
        <div style={{ padding:'14px', background:CARD, ...(standalone || isMobile ? {} : { maxHeight:'60vh', overflowY:'auto' }) }}>
          <div ref={filterRoot} data-compendium-filter-root="" style={contentColumn}>
            {renderTab()}
          </div>
        </div>
      </>
    );
  } else if (isMobile) {
    // MY CUSTOM CONTENT on a phone (ruling H4: its gates unchanged inside its page).
    // The manager is desktop-grade authoring; the phone can SEARCH and READ existing
    // items, and authoring sits behind a calm "best on desktop" panel.
    body = (
      <>
        {searchBar('Search custom content', 'Search custom content...')}
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
    );
  } else {
    body = (
      <>
        {searchBar('Search custom content', 'Search custom content...')}
        <div style={{ padding:'14px', background:CARD, ...(standalone ? {} : { maxHeight:'60vh', overflowY:'auto' }) }}>
          <CustomContentManager search={search.toLowerCase()} initialCat={initialCat}/>
        </div>
      </>
    );
  }

  const panel = (
    <div style={standalone
      ? { maxWidth: PAGE_MAX, margin:'0 auto', width:'100%', background:CARD, border:`1px solid ${BOR}`, overflow:'hidden' }
      : { overflow:'hidden' }}>
      {body}
    </div>
  );

  // Every sub-page leads with the dossier's own Back control (the same Button, style
  // and chevron as SettlementDetail's back-to-list), returning to the landing.
  const back = section && (
    <div style={{ marginBottom:12 }}>
      <Button variant="secondary" size="sm" icon={<ChevronLeft size={13}/>} onClick={backToLanding}>
        Back
      </Button>
    </div>
  );

  if (!standalone) return <>{back}{panel}</>;

  // Standalone page identity: the canonical Page frame + PageHeader. The landing keeps
  // the compendium's kicker, title and subtitle; a section page names its section.
  return (
    <Page>
      {back}
      {section ? (
        <PageHeader eyebrow="Compendium" title={section.label} />
      ) : (
        <PageHeader
          eyebrow="Rules and data reference"
          title="Compendium"
          subtitle="How the simulator builds and runs a settlement: the rules behind every dossier."
        />
      )}
      {panel}
    </Page>
  );
}
