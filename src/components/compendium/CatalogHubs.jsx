/**
 * compendium/CatalogHubs.jsx — the Calamity hub.
 *
 * Renders from the generated drift-contract artifact. Each entry carries a stable
 * slug anchor (id="calamity-<slug>") so a shared deep-link survives regeneration.
 *
 * The premade-deity roster is intentionally absent (owner ruling 2026-07-21: no
 * premade deities; deities enter a world only via custom-content authoring). The
 * deity roster hub, its generated data block, and its index rows were removed with
 * that ruling; custom-deity authoring lives in the My Custom Content workspace.
 *
 * The Map Lenses hub (with its district bands) and the Facets hub (the interior
 * grammar) are intentionally absent too (owner order 2026-09-16: remove the map
 * lenses and interior pages from the compendium; neither feature ships). Their
 * generated data blocks, dashboard cards, A to Z and search rows, and the per-entry
 * /compendium/lens-* pages went with them (docs/FIRST_CONTACT_BACKLOG.md).
 */

import { INK, MUTED as MUT, SECOND as SEC, serif_, sans, FS } from '../theme.js';
import { COMPENDIUM_DATA as CD } from '../../domain/compendium/generated/compendiumData.generated.js';
import { slug, ANCHOR_SCROLL_MARGIN } from './registrySlug.js';
import { Row } from './primitives.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

// ── CALAMITY — the one unified bucket, honestly ──────────────────────────────
export function CalamityHub() {
  const mobile = useIsMobile();
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
          <Row label={f.title} lw={140}><code style={{ fontFamily: 'monospace', fontSize: chromeFontSize(FS.xs, mobile), color: MUT }}>{f.key}</code></Row>
        </div>
      ))}
      <div style={{ fontFamily: serif_, fontSize: FS['14'], fontWeight: 600, color: INK, margin: '16px 0 8px' }}>Severity bands</div>
      <p style={{ fontSize: proseFontSize(FS.xs, mobile), color: MUT, fontStyle: 'italic', margin: '0 0 8px', fontFamily: sans, maxWidth: '40em' }}>Scale multiplies the deaths and exodus a calamity rolls; k-factor caps how far the settlement can rebuild afterward. The moderate band is exactly 1 and 1, so a forced strike is identical to a natural one.</p>
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
