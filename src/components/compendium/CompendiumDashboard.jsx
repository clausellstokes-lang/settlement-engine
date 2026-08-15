/**
 * compendium/CompendiumDashboard.jsx — the Overview dashboard + the A–Z index.
 *
 * The Overview is the legends-viewer landing: per-catalog counts (all from the
 * generated artifact) as hub cards. The A–Z index is the orphan-proof HTML sitemap:
 * every named entry across every catalog, alphabetised, each a stable deep-link into
 * its hub + section anchor.
 */

import { useMemo } from 'react';
import { GOLD, GOLD_TXT, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, serif_, sans, FS } from '../theme.js';
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { slug } from './registrySlug.js';
import { compareCodepoint } from '../../domain/deterministicSort.js';

// Real, crawlable URL for a hub/entry — the A–Z is an HTML sitemap, so its links
// are true hrefs (SEO + open-in-new-tab); onClick does the smooth in-page nav.
const hubHref = (tab, anchor) => `/compendium?tab=${tab}${anchor ? `#${anchor}` : ''}`;
const onLink = (e, onNavigate, tab, anchor) => { e.preventDefault(); onNavigate(tab, anchor); };

// The catalogs shown on the dashboard, in reading order. `count`, `blurb`, and the
// destination tab/anchor drive both the Overview cards and (via ENTRY_SOURCES) the
// A–Z index — one description of the catalog set, two surfaces.
const CATALOGS = [
  { tab:'institutions', anchor:'institutions', label:'Institutions', count:CD.institutions.distinctNames, blurb:'Every institution the engine can place, across all tiers.' },
  { tab:'power',        anchor:'archetypes',   label:'Archetypes',   count:CD.archetypes.count,    blurb:'Emergent settlement archetypes keyed to slider + threat conditions.' },
  { tab:'operations',   anchor:'operations',   label:'Operations',   count:CD.operations.count,    blurb:'Every operation the engine can perform, with its class and receipt.' },
  { tab:'living',       anchor:'systems',      label:'Living World',  count:CD.systems.length,     blurb:'The endgame systems, the causal substrate, and the presets that light them.' },
  { tab:'lenses',       anchor:'lenses',       label:'Map Lenses',   count:CD.lenses.count,        blurb:'The map rendering lenses and the bespoke-style schema.' },
  { tab:'facets',       anchor:'facets',       label:'Facets',       count:CD.facets.natures.length, blurb:'The institution natures and the interior grammar built on them.' },
  { tab:'tiers',        anchor:'tiers',        label:'Tiers',        count:CD.tiers.length,        blurb:'Settlement size tiers and their population bands.' },
  { tab:'neighbour',    anchor:'neighbours',   label:'Relationships', count:CD.relationships.count, blurb:'Neighbour relationship types and their mechanical effects.' },
  { tab:'calamity',     anchor:'calamity',     label:'Calamity',     count:CD.calamity.flavors.length, blurb:'The one unified calamity mechanic and its terrain flavours.' },
];

export function CompendiumOverview({ onNavigate }) {
  return (
    <div id="overview">
      <p style={{ fontSize:FS.md, color:SEC, lineHeight:1.7, margin:'0 0 6px', fontFamily:sans, maxWidth:'42em' }}>
        Everything here is rendered by the deterministic engine from its own registries, the same
        code that builds your worlds. It cannot drift from what the simulator actually does.
      </p>
      <p style={{ fontSize:FS.sm, color:MUT, lineHeight:1.6, margin:'0 0 16px', fontFamily:sans }}>
        The sample world is <strong style={{ color:INK }}>{CD.meta.demoWorld.name}</strong> (seed{' '}
        <code style={{ fontFamily:'monospace', color:GOLD_TXT }}>{CD.meta.demoWorld.seed}</code>).
      </p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
        {CATALOGS.map((c) => (
          <a key={c.tab} href={hubHref(c.tab, c.anchor)} onClick={(e) => onLink(e, onNavigate, c.tab, c.anchor)}
            style={{ display:'block', textDecoration:'none', border:`1px solid ${BOR}`, borderLeft:`3px solid ${GOLD}`,
              padding:'12px 14px', cursor:'pointer' }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8, marginBottom:4 }}>
              <span style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:700, color:INK }}>{c.label}</span>
              {/* Drawer-label count: old-style figures sit the number into the
                  running serif line — the lexicon register, not a chrome badge. */}
              <span style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:700, color:GOLD_TXT, fontVariantNumeric:'oldstyle-nums' }}>{c.count}</span>
            </div>
            <div style={{ fontSize:FS.xs, color:SEC, lineHeight:1.5 }}>{c.blurb}</div>
          </a>
        ))}
      </div>
      <p style={{ fontSize:FS.sm, color:SEC, margin:'16px 0 0', fontFamily:sans }}>
        Looking for a specific name?{' '}
        <a href={hubHref('az', 'az')} onClick={(e) => onLink(e, onNavigate, 'az', 'az')}
          style={{ color:GOLD_TXT, textDecoration:'underline', textUnderlineOffset:3, fontWeight:600, fontFamily:sans, fontSize:FS.sm }}>
          Browse the A–Z index.
        </a>
      </p>
    </div>
  );
}

// Every named entry, flattened, with its destination tab + entry anchor.
function buildIndexEntries() {
  const out = [];
  for (const a of CD.archetypes.entries) out.push({ term:a.name, tab:'power', anchor:'archetypes', kind:'Archetype' });
  // The A–Z entry shows the operation's authored, human label (not the raw camelCase
  // opType); the anchor stays op-<slug(opType)> so existing deep-links survive.
  for (const o of CD.operations.entries) out.push({ term:o.label, tab:'operations', anchor:`op-${slug(o.opType)}`, kind:'Operation' });
  for (const s of CD.systems) out.push({ term:s.label, tab:'living', anchor:`system-${slug(s.id)}`, kind:'System' });
  for (const l of CD.lenses.entries) out.push({ term:l.label, tab:'lenses', anchor:`lens-${slug(l.id)}`, kind:'Lens' });
  for (const r of CD.relationships.entries) out.push({ term:r.label, tab:'neighbour', anchor:'neighbours', kind:'Relationship' });
  for (const t of CD.tiers) out.push({ term:t.label, tab:'tiers', anchor:'tiers', kind:'Tier' });
  for (const f of CD.calamity.flavors) out.push({ term:f.title, tab:'calamity', anchor:`calamity-${slug(f.key)}`, kind:'Calamity' });
  return out;
}

export function AtoZIndex({ onNavigate }) {
  const groups = useMemo(() => {
    const entries = buildIndexEntries().sort((a, b) => compareCodepoint(a.term.toLowerCase(), b.term.toLowerCase()));
    const byLetter = new Map();
    for (const e of entries) {
      const c = e.term[0]?.toUpperCase() || '#';
      const key = /[A-Z]/.test(c) ? c : '#';
      if (!byLetter.has(key)) byLetter.set(key, []);
      byLetter.get(key).push(e);
    }
    return [...byLetter.entries()];
  }, []);
  const total = useMemo(() => groups.reduce((n, [, list]) => n + list.length, 0), [groups]);
  return (
    <div id="az">
      <p style={{ fontSize:FS.sm, color:SEC, lineHeight:1.6, margin:'0 0 14px', fontFamily:sans, maxWidth:'42em' }}>
        Every named entry in the Compendium ({total} in all) in one alphabetical index. Each is a
        stable link into its catalog.
      </p>
      {groups.map(([letter, list]) => (
        <section key={letter} style={{ marginBottom:14 }}>
          <div style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:700, color:GOLD_TXT, borderBottom:`1px solid ${BOR}`, marginBottom:6 }}>{letter}</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'2px 16px' }}>
            {list.map((e) => (
              <a key={`${e.kind}-${e.term}`} href={hubHref(e.tab, e.anchor)} onClick={(ev) => onLink(ev, onNavigate, e.tab, e.anchor)}
                style={{ textDecoration:'none', padding:'3px 0', cursor:'pointer', display:'flex', gap:6, alignItems:'baseline' }}>
                <span style={{ fontSize:FS.sm, color:GOLD_TXT, textDecoration:'underline', textUnderlineOffset:2 }}>{e.term}</span>
                <span style={{ fontSize:FS.xxs, color:MUT }}>{e.kind}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
