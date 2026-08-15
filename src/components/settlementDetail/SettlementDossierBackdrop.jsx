/**
 * SettlementDossierBackdrop — THE LIVING BACKDROP (owner ruling 2026-07-18).
 *
 * The library settlement view's background = that settlement's LAST-VIEWED town
 * map (device-local memory, src/lib/lastMapView.js) rendered as a faint ink wash
 * on parchment UNDER the dossier plates + the right rail. Pure derivation over the
 * frozen town-map model through the SAME buildTownMapSvg the card thumbnail / PDF
 * plate use — it persists NOTHING and adds no golden shift. Honors the owner's
 * cosmetic mapEdits (WYSIWYG with what they last saw), exactly like the thumbnail.
 *
 * DECORATIVE + INERT: pointer-events none, aria-hidden, NO animation (reduced-
 * motion safe by construction), NO blur (banned), NO raster (a self-contained
 * inline vector SVG carried as a data: URI — no canvas, no external refs). The
 * wash strength is a single exported opacity the contrast pin proves AA-safe.
 *
 * LAZY: mounted through the hero's own lazy boundary so buildTownMapModel's
 * fork-key fingerprint (::town-map:v1) never reaches the first-paint static
 * closure (tests/build/townMapLazy.test.js). Renders null when there is no saved
 * id with a drawable map (never-viewed, map-less settlement, or unreadable entry).
 */
import { useMemo } from 'react';
import {
  buildTownMapModel, readMapEdits, hasDrawableMap, buildTownMapSvg, buildTownMapPanoramaSvg,
} from '../../domain/townMap/index.js';
import { readLastMapView } from '../../lib/lastMapView.js';
import { PARCH } from '../theme.js';

// The wash strength — a faint ink ghost, not a background image. EXPORTED so the
// contrast pin (tests/design/contrast.test.js) proves dossier text stays AA-legible
// over the parchment+wash composite at exactly this value (raise it ⇒ re-prove).
export const WASH_INK_OPACITY = 0.1;
// The model's native 0..1000 square; CSS `object-fit: cover` scales it to the pane.
const WASH_SIZE = 1000;

/**
 * @param {{ settlement: any, saveId?: string|number|null }} props
 */
export default function SettlementDossierBackdrop({ settlement, saveId }) {
  // Build once per open (stable settlement + saveId). view/lens are read from the
  // device-local memory here; never-viewed ⇒ plan view under the default lens.
  const svg = useMemo(() => {
    const last = readLastMapView(saveId);
    const model = buildTownMapModel(settlement, readMapEdits(settlement));
    if (!hasDrawableMap(model)) return null;
    // A stale/unknown lens id resolves to the default lens inside resolveTownMapStyle,
    // so an undefined style is the default parchment — no throw, no special-casing.
    const opts = { style: last?.lens || undefined, width: WASH_SIZE, height: WASH_SIZE };
    // A remembered 3D portrait uses the panorama's dimensional ink wash. The
    // backdrop is decorative and must never initialize WebGL behind the dossier;
    // the canonical plan remains the fallback when no dimensional view was used.
    return last?.view === 'panorama' || last?.view === 'portrait3d'
      ? buildTownMapPanoramaSvg(model, opts)
      : buildTownMapSvg(model, opts);
  }, [settlement, saveId]);

  if (!svg) return null;
  const src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: PARCH,
      }}
    >
      <img
        src={src}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: WASH_INK_OPACITY }}
      />
    </div>
  );
}
