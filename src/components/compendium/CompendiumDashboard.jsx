/**
 * compendium/CompendiumDashboard.jsx — the landing grid + the A–Z index.
 *
 * The landing (/compendium) is the intro and one flush grid of boxes, a box per
 * section with its count (from the generated artifact) where it has one. The A–Z index is the orphan-proof HTML sitemap:
 * every named entry across every catalog, alphabetised, each a stable deep-link into
 * its hub + section anchor.
 */

import { useMemo } from 'react';
import { GOLD, GOLD_TXT, INK, CARD, MUTED as MUT, SECOND as SEC, BORDER as BOR, serif_, sans, FS } from '../theme.js';
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { slug } from './registrySlug.js';
import { sectionSlugForTab } from '../../lib/compendiumSections.js';
import { compareCodepoint } from '../../domain/deterministicSort.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

// Real, crawlable URL for a hub/entry — the A–Z is an HTML sitemap, so its links
// are true hrefs (SEO + open-in-new-tab); onClick does the smooth in-page nav.
// Since the owner's word of 2026-11-10 every section is its own page: /compendium/<slug>.
const hubHref = (tab, anchor) => `/compendium/${sectionSlugForTab(tab)}${anchor ? `#${anchor}` : ''}`;
const onLink = (e, onNavigate, tab, anchor) => { e.preventDefault(); onNavigate(tab, anchor); };

// THE LANDING'S COUNTS AND LINES, keyed by section tab. The owner, 2026-11-10: the
// first page "lists in boxes that are flush to each other"; the chair's ruling H1:
// a box shows its count where the old Overview card carried one, and ONE line that
// is that section's own existing Overview-card sentence or its own first intro
// sentence, VERBATIM — no new prose. A section with neither shows name (and count)
// alone. Every count is read from the generated artifact, never typed.
const BOX_FACTS = {
  tiers:        { count:CD.tiers.length,               line:'Settlement size tiers and their population bands.' },
  // EconomyTab's own italic lead-in.
  economy:      { line:'How prosperity is produced, traded, and stressed.' },
  power:        { count:CD.archetypes.count,           line:'Emergent settlement archetypes keyed to slider + threat conditions.' },
  institutions: { count:CD.institutions.distinctNames, line:'Every institution the engine can place, across all tiers.' },
  operations:   { count:CD.operations.count,           line:'Every operation the engine can perform, with its class and receipt.' },
  // ArcaneTab's first intro sentence: the first sentence of the artifact's own
  // faith.authorship paragraph, read from it so the box cannot drift from the page.
  arcane:       { line:firstSentence(CD.faith.authorship) },
  living:       { count:CD.systems.length,             line:'The endgame systems, the causal substrate, and the presets that light them.' },
  // StressTab's first intro sentence.
  stress:       { line:'Multiple stresses compound.' },
  calamity:     { count:CD.calamity.flavors.length,    line:'The one unified calamity mechanic and its terrain flavours.' },
  neighbour:    { count:CD.relationships.count,        line:'Neighbour relationship types and their mechanical effects.' },
};

/** @param {unknown} text @returns {string} the text up to and including its first full stop. */
function firstSentence(text) {
  const t = String(text || '');
  const i = t.indexOf('. ');
  return i === -1 ? t : t.slice(0, i + 1);
}

// The landing's lead: the old Overview's one paragraph and its sample-world line.
export function CompendiumIntro() {
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
    </div>
  );
}

/**
 * THE LANDING GRID (ruling H1): one box per section, FLUSH — no space between boxes,
 * shared hairline rules (the grid's 1px track gap shows the border colour through)
 * and one outer border; four columns by three rows on desktop and tablet, two by six
 * on a phone. Each box is a LINK to its section page, inside a nav landmark.
 *
 * @param {{ sections: ReadonlyArray<{ slug: string, tab: string, label: string, Icon: any }>,
 *   customCount?: number, onOpen: (slug: string) => void }} props
 */
export function CompendiumHubGrid({ sections, customCount = 0, onOpen }) {
  const mobile = useIsMobile();
  const azTotal = useMemo(() => buildIndexEntries().length, []);
  return (
    <nav aria-label="Compendium sections">
      <ul data-compendium-grid="" style={{ listStyle:'none', margin:0, padding:0, display:'grid',
        gridTemplateColumns: mobile ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))',
        gap:1, background:BOR, border:`1px solid ${BOR}` }}>
        {sections.map(({ slug: s, tab, label, Icon }) => {
          const facts = tab === 'az'
            // No count of its own (the Overview carried no A–Z card); its first intro
            // sentence already carries the total.
            ? { line:`Every named entry in the Compendium (${azTotal} in all) in one alphabetical index.` }
            : tab === 'custom'
              ? { count: customCount > 0 ? customCount : undefined }
              : (BOX_FACTS[tab] || {});
          return (
            <li key={s} style={{ display:'flex', minWidth:0, background:CARD }}>
              <a href={`/compendium/${s}`} onClick={(e) => { e.preventDefault(); onOpen(s); }}
                style={{ display:'flex', flexDirection:'column', gap:4, width:'100%', minWidth:0, minHeight: mobile ? 96 : 112,
                  boxSizing:'border-box', padding: mobile ? '12px 10px' : '14px 16px', textDecoration:'none', cursor:'pointer' }}>
                <span style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:6 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:6, minWidth:0, fontFamily:serif_, fontSize: mobile ? FS.sm : FS.md, fontWeight:700, color:INK, overflowWrap:'anywhere' }}>
                    <Icon size={14} aria-hidden="true" style={{ color:GOLD, flexShrink:0 }} />{label}
                  </span>
                  {facts.count !== undefined && (
                    <span style={{ fontFamily:serif_, fontSize:FS.lg, fontWeight:700, color:GOLD_TXT, fontVariantNumeric:'oldstyle-nums', flexShrink:0 }}>{facts.count}</span>
                  )}
                </span>
                {facts.line && (
                  <span style={{ fontSize:proseFontSize(FS.xs, mobile), color:SEC, lineHeight:1.5, overflowWrap:'anywhere' }}>{facts.line}</span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
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
  for (const r of CD.relationships.entries) out.push({ term:r.label, tab:'neighbour', anchor:'neighbours', kind:'Relationship' });
  for (const t of CD.tiers) out.push({ term:t.label, tab:'tiers', anchor:'tiers', kind:'Tier' });
  for (const f of CD.calamity.flavors) out.push({ term:f.title, tab:'calamity', anchor:`calamity-${slug(f.key)}`, kind:'Calamity' });
  return out;
}

export function AtoZIndex({ onNavigate }) {
  const mobile = useIsMobile();
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
                <span style={{ fontSize:chromeFontSize(FS.xxs, mobile), color:MUT }}>{e.kind}</span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
