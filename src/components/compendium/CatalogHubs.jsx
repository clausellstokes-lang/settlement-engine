/**
 * compendium/CatalogHubs.jsx — the Lenses, Facets and Calamity hubs.
 *
 * All render from the generated drift-contract artifact. Each entry carries a stable
 * slug anchor (id="lens-<slug>" etc.) so a shared deep-link survives regeneration.
 *
 * The premade-deity roster is intentionally absent (owner ruling 2026-07-21: no
 * premade deities; deities enter a world only via custom-content authoring). The
 * deity roster hub, its generated data block, and its index rows were removed with
 * that ruling; custom-deity authoring lives in the My Custom Content workspace.
 */

import { INK, MUTED as MUT, SECOND as SEC, serif_, sans, FS } from '../theme.js';
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { slug, ANCHOR_SCROLL_MARGIN } from './registrySlug.js';
import { Card, Row } from './primitives.jsx';

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
          <Row label={l.label} lw={130}>{l.reading} <code style={{ fontFamily: 'monospace', fontSize: FS.xs, color: MUT }}>{l.id}</code></Row>
        </div>
      ))}
      <p style={{ fontSize: FS.xs, color: MUT, fontStyle: 'italic', margin: '6px 0 0', fontFamily: sans }}>{lenses.illustratedNote}</p>
      <div style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '16px 0 8px' }}>The style schema</div>
      <Card title="Furniture" accent="#a0762a">{lenses.schema.furniture.join(' · ')}</Card>
      <Card title="Hazard glyphs" accent="#8b1a1a">{lenses.schema.hazardGlyphs.join(' · ')}</Card>
      <Card title="Anchor glyphs" accent="#1a3a7a">{lenses.schema.anchorGlyphs.join(' · ')}</Card>
      <Card title="Contrast levels" accent="#1a5a28">{lenses.schema.contrastLevels.join(' · ')}</Card>
      {/* Districts — the per-quarter map vocabulary (distinct from settlement-wide Prosperity). */}
      <div id="districts" style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '18px 0 6px', scrollMarginTop: ANCHOR_SCROLL_MARGIN }}>District bands</div>
      <p style={{ fontSize: FS.xs, color: MUT, fontStyle: 'italic', margin: '0 0 8px', fontFamily: sans }}>{CD.districts.note}</p>
      <div style={{ fontFamily: serif_, fontSize: FS.sm, fontWeight: 700, color: INK, margin: '6px 0 2px' }}>Wealth</div>
      {CD.districts.wealth.map((d) => (<Row key={d.label} label={d.label} lw={120}>{d.reading}</Row>))}
      <div style={{ fontFamily: serif_, fontSize: FS.sm, fontWeight: 700, color: INK, margin: '10px 0 2px' }}>Safety</div>
      {CD.districts.safety.map((d) => (<Row key={d.label} label={d.label} lw={120}>{d.reading}</Row>))}
      <Card title={`District categories: ${CD.districts.categories.length}`} accent="#6b5340">{CD.districts.categories.join(' · ')}</Card>
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
      <p style={{ fontSize: FS.xs, color: MUT, fontStyle: 'italic', margin: '0 0 8px', fontFamily: sans, maxWidth: '40em' }}>Scale multiplies the deaths and exodus a calamity rolls; k-factor caps how far the settlement can rebuild afterward. The moderate band is exactly 1 and 1, so a forced strike is identical to a natural one.</p>
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
