/**
 * compendium/CatalogHubs.jsx — the Deities, Lenses, Facets and Calamity hubs.
 *
 * All render from the generated drift-contract artifact. Each entry carries a stable
 * slug anchor (id="deity-<slug>" etc.) so a shared deep-link survives regeneration.
 */

import { useState, useMemo } from 'react';
import { GOLD, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, serif_, sans, FS } from '../theme.js';
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { slug, ANCHOR_SCROLL_MARGIN } from './registrySlug.js';
import { Tag, Card, Row } from './primitives.jsx';
import Button from '../primitives/Button.jsx';

const ALIGN_COLOR = { good: '#1a5a28', neutral: '#6b5340', evil: '#8b1a1a' };
const RANK_LABEL = { major: 'Major', minor: 'Minor', cult: 'Cult' };
const RANK_ORDER = ['major', 'minor', 'cult'];

// ── DEITIES — the core pantheon bank ─────────────────────────────────────────
export function DeitiesHub() {
  const [rank, setRank] = useState('all');
  const filters = ['all', ...RANK_ORDER];
  const shown = useMemo(
    () => CD.deities.entries.filter((d) => rank === 'all' || d.rank === rank),
    [rank],
  );
  return (
    <div id="deities" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 12px', fontFamily: sans, maxWidth: '40em' }}>
        The {CD.deities.count} deities of the core pantheon. Assign one and the living pantheon
        contests converts, seats, and the axes each god steers. Author your own under My Custom
        Content. The same alignment / temperament / rank vocabulary applies.
      </p>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
        {filters.map((f) => (
          <Button key={f} onClick={() => setRank(f)} variant={rank === f ? 'primary' : 'ghost'} size="sm" aria-pressed={rank === f}>
            {f === 'all' ? 'All' : RANK_LABEL[f]}
          </Button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 8 }}>
        {shown.map((d) => (
          <div key={d.slug} id={`deity-${slug(d.slug)}`}
            style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN, border: `1px solid ${BOR}`,
              borderLeft: `3px solid ${ALIGN_COLOR[d.alignment] || GOLD}`, padding: '10px 12px' }}>
            <div style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK, marginBottom: 3 }}>{d.name}</div>
            <div style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.5, marginBottom: 6, maxWidth: '32em' }}>{d.portfolio}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Tag label={d.rank} color={GOLD} />
              <Tag label={d.alignment} color={ALIGN_COLOR[d.alignment] || GOLD} />
              <Tag label={d.law} color="#3a1a7a" />
              <Tag label={d.temperament} color="#6b5340" />
              <Tag label={d.domain} color="#1a3a7a" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── LENSES — the map styles + the style-schema wall ──────────────────────────
export function LensesHub() {
  const { lenses } = CD;
  return (
    <div id="lenses" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 12px', fontFamily: sans, maxWidth: '40em' }}>
        Every town map renders in one of {lenses.count} lenses. A bespoke or AI-styled lens must
        stay inside the same schema vocabulary below, the wall that keeps a custom style legible.
      </p>
      {lenses.entries.map((l) => (
        <div key={l.id} id={`lens-${slug(l.id)}`} style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
          <Row label={l.label} lw={130}><code style={{ fontFamily: 'monospace', fontSize: FS.xs, color: MUT }}>{l.id}</code></Row>
        </div>
      ))}
      <div style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '16px 0 8px' }}>The style schema</div>
      <Card title="Furniture" accent="#a0762a">{lenses.schema.furniture.join(' · ')}</Card>
      <Card title="Hazard glyphs" accent="#8b1a1a">{lenses.schema.hazardGlyphs.join(' · ')}</Card>
      <Card title="Anchor glyphs" accent="#1a3a7a">{lenses.schema.anchorGlyphs.join(' · ')}</Card>
      <Card title="Contrast levels" accent="#1a5a28">{lenses.schema.contrastLevels.join(' · ')}</Card>
    </div>
  );
}

// ── FACETS — the interior grammar vocabulary ─────────────────────────────────
export function FacetsHub() {
  const { facets } = CD;
  return (
    <div id="facets" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 12px', fontFamily: sans, maxWidth: '40em' }}>
        An institution&rsquo;s <em>nature</em> facet resolves to an interior kind, and its rooms and
        furnishings are drawn from that kind&rsquo;s vocabulary. This is the grammar behind every
        building interior.
      </p>
      <Card title={`Institution natures: ${facets.natures.length}`} accent="#3a1a7a" lead>
        {facets.natures.join(' · ')}
      </Card>
      <Card title={`Interior kinds: ${facets.interiorKinds.length}`} accent="#1a3a7a">
        {facets.interiorKinds.join(' · ')}
      </Card>
      <Card title={`Room kinds: ${facets.roomKinds.length}`} accent="#a0762a">
        {facets.roomKinds.join(' · ')}
      </Card>
      <Card title={`Furnishing kinds: ${facets.furnishingKinds.length}`} accent="#6b5340">
        {facets.furnishingKinds.join(' · ')}
      </Card>
    </div>
  );
}

// ── CALAMITY — the one unified bucket, honestly ──────────────────────────────
export function CalamityHub() {
  const { calamity } = CD;
  return (
    <div id="calamity" style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
      <p style={{ fontSize: FS.sm, color: SEC, lineHeight: 1.6, margin: '0 0 12px', fontFamily: sans, maxWidth: '40em' }}>
        There is one calamity mechanic: the Great Calamity. Its <em>type</em> is cosmetic flavour
        chosen from the terrain; the mechanics are the same underneath. Honest by design: a flood and
        a fire differ in the telling, not in the maths.
      </p>
      <div style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '4px 0 8px' }}>Flavours</div>
      {calamity.flavors.map((f) => (
        <div key={f.key} id={`calamity-${slug(f.key)}`} style={{ scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>
          <Row label={f.title} lw={140}><code style={{ fontFamily: 'monospace', fontSize: FS.xs, color: MUT }}>{f.key}</code></Row>
        </div>
      ))}
      <div style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '16px 0 8px' }}>Severity bands</div>
      {calamity.severityBands.map((b) => (
        <Row key={b.key} label={b.key} lw={140}>scale ×{b.scale} · k-factor {b.kFactor}</Row>
      ))}
      <div style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '16px 0 8px' }}>Terrain chooses the flavour</div>
      {calamity.terrainMap.map((t) => (
        <Row key={t.terrain} label={t.terrain} lw={140}>{t.type}</Row>
      ))}
    </div>
  );
}
