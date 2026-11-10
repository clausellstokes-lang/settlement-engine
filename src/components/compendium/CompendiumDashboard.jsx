/**
 * compendium/CompendiumDashboard.jsx — the landing grid + the A–Z index.
 *
 * The landing (/compendium) is the intro and one flush grid of boxes, a box per
 * section with its count (from the generated artifact) where it has one. The A–Z index is the orphan-proof HTML sitemap:
 * every named entry across every catalog, alphabetised, each a stable deep-link into
 * its hub + section anchor.
 */

import { useMemo } from 'react';
import { GOLD_TXT, GOLD_B, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, serif_, sans, FS, launchSkin } from '../theme.js';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { slug } from './registrySlug.js';
import { sectionSlugForTab } from '../../lib/compendiumSections.js';
import { compareCodepoint } from '../../domain/deterministicSort.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';

// Real, crawlable URL for a hub/entry — the A–Z is an HTML sitemap, so its links
// are true hrefs (SEO + open-in-new-tab); onClick does the smooth in-page nav.
// Since the owner's word of 2026-11-10 every section is its own page: /compendium/<slug>.
const hubHref = (tab, anchor) => `/compendium/${sectionSlugForTab(tab)}${anchor ? `#${anchor}` : ''}`;
const onLink = (e, onNavigate, tab, anchor) => { e.preventDefault(); onNavigate(tab, anchor); };

// THE LANDING'S COUNTS, keyed by section tab: a tile carries its count where the old
// Overview card carried one, read from the generated artifact, never typed. (The tile's
// one-line description was dropped with the imagery — the owner, 2026-11-10: "Behind each
// box should be imagery … with regal gold for the lettering of the button".)
const BOX_COUNTS = {
  tiers:        CD.tiers.length,
  power:        CD.archetypes.count,
  institutions: CD.institutions.distinctNames,
  operations:   CD.operations.count,
  living:       CD.systems.length,
  calamity:     CD.calamity.flavors.length,
  neighbour:    CD.relationships.count,
};

// THE TILE'S PAINTING: one image per section, a crop of the repository's own stock
// (public/backgrounds/*), sized for the tile at 2x (800 x 320 webp) and committed under
// public/backgrounds/compendium/<slug>.webp. Never a new or generated image.
const TILE_W = 800;
const TILE_H = 320;
// THE SCRIM: ink at 0.80 over the painting. Measured: regal gold (gold-400, #D9B566) on the
// scrim over the painting's brightest possible pixel (pure white) is 5.02:1 — AA at the
// worst region of every tile. The launch tile's scrim is the launch ground's deepest stop.
const SCRIM = 'rgba(27,20,8,0.80)';
const LAUNCH_SCRIM = 'rgba(28,21,64,0.86)';

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
 * THE LANDING GRID (rulings H1, H13, H14): one tile per section, FLUSH — no space between
 * tiles, shared hairline rules (the grid's 1px track gap shows the border colour through) and
 * one outer border; three columns at every width (the owner: "three columns not three rows"),
 * the kicker hidden on a phone. Each tile is a LINK to its section page inside a nav landmark:
 * a painting behind a scrim, the kicker, the name in regal gold and the serif, its count.
 * My Custom Content wears the launch skin with the existing "Available at launch" pill while
 * purchases are closed (lib/launchGate.js).
 *
 * @param {{ sections: ReadonlyArray<{ slug: string, tab: string, kicker?: string, label: string }>,
 *   customCount?: number, onOpen: (slug: string) => void, launchLocked?: boolean }} props
 */
export function CompendiumHubGrid({ sections, customCount = 0, onOpen, launchLocked = false }) {
  const mobile = useIsMobile();
  return (
    <nav aria-label="Compendium sections">
      <ul data-compendium-grid="" style={{ listStyle:'none', margin:0, padding:0, display:'grid',
        gridTemplateColumns:'repeat(3, minmax(0, 1fr))',
        gap:1, background:BOR, border:`1px solid ${BOR}` }}>
        {sections.map(({ slug: s, tab, kicker, label }) => {
          const isCustom = tab === 'custom';
          const count = isCustom ? (customCount > 0 ? customCount : undefined) : BOX_COUNTS[tab];
          const locked = isCustom && launchLocked;
          return (
            <li key={s} style={{ display:'flex', minWidth:0, position:'relative', background:INK }}>
              <a href={`/compendium/${s}`} onClick={(e) => { e.preventDefault(); onOpen(s); }}
                data-skin={locked ? 'launch' : undefined}
                style={{ position:'relative', display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:2,
                  width:'100%', minWidth:0, minHeight: mobile ? 104 : 132, boxSizing:'border-box', overflow:'hidden',
                  padding: mobile ? '10px 8px' : '14px 16px', textDecoration:'none', cursor:'pointer' }}>
                <img src={`/backgrounds/compendium/${s}.webp`} alt="" aria-hidden="true" loading="lazy" decoding="async"
                  width={TILE_W} height={TILE_H}
                  style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:0 }} />
                <span aria-hidden="true" style={{ position:'absolute', inset:0, background: locked ? LAUNCH_SCRIM : SCRIM, zIndex:0 }} />
                {kicker && !mobile && (
                  <span data-tile-kicker="" style={{ position:'relative', zIndex:1, fontFamily:sans, fontSize:chromeFontSize(FS.xxs, mobile), fontWeight:700,
                    letterSpacing:'0.08em', textTransform:'uppercase', color:GOLD_B }}>{kicker}</span>
                )}
                {/* On a phone the count takes its own line, so a long name ("Institutions") wraps
                    between words and never inside one. */}
                <span style={{ position:'relative', zIndex:1, display:'flex', flexDirection: mobile ? 'column' : 'row',
                  alignItems: mobile ? 'flex-start' : 'baseline', justifyContent:'space-between', gap: mobile ? 0 : 6, minWidth:0 }}>
                  <span data-tile-name="" style={{ fontFamily:serif_, fontSize: mobile ? FS.sm : FS.lg, fontWeight:700, lineHeight:1.2, color:GOLD_B,
                    overflowWrap:'break-word', minWidth:0, maxWidth:'100%', ...(locked ? launchSkin.shimmer : {}) }}>{label}</span>
                  {count !== undefined && (
                    <span data-tile-count="" style={{ fontFamily:serif_, fontSize: mobile ? FS.xs : FS.sm, fontWeight:700, color:GOLD_B, fontVariantNumeric:'oldstyle-nums', flexShrink:0 }}>{count}</span>
                  )}
                </span>
                {locked && (
                  <span style={{ position:'relative', zIndex:1, marginTop:4, maxWidth:'100%' }}><AvailableAtLaunchPill style={mobile ? { whiteSpace:'normal', maxWidth:'100%', boxSizing:'border-box' } : undefined} /></span>
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
