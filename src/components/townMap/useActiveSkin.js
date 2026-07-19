/**
 * components/townMap/useActiveSkin — THE SKIN REGISTRY resolution hook (THE ILLUSTRATED TOWN, IT-4).
 *
 * Resolves the pane's ACTIVE style OBJECT through the settlement's saved bespoke collection so a
 * WORN skin drives the pane (the illustrated underlay + panorama + the viewer palette) in lockstep
 * with every export surface (the WYSIWYG law). A base lens id resolves to its base definition; a
 * saved-skin id to its saved definition; a stale/absent id is parchment-safe (flip-back). Also
 * lists the saved skins for the lens picker's rubric divider.
 *
 * A lazy leaf — imported only by the already-lazy SettlementMapPane — so the max-lines-capped pane
 * grows by ONE call and this stays out of the first-paint static closure.
 */
import { useMemo } from 'react';
import { readBespokeStyles } from '../../domain/townMap/mapEdits.js';
import { resolveActiveStyle, listBespokeStyles, viewerPalette, DEFAULT_STYLE_ID } from '../../domain/townMap/index.js';

/**
 * @param {import('../../domain/townMap/mapEdits.js').MapEdits | null | undefined} mapEdits
 * @param {string} activeLens  the active lens id (a base lens id OR a saved-skin id)
 * @returns {{ activeStyle: import('../../design/townMapStyles.js').TownMapStyle,
 *            savedSkins: Array<{ id: string, label: string }>,
 *            pal: ReturnType<typeof viewerPalette> | null, illustrated: boolean }}
 *   `pal` is the flat viewer palette for a NON-default lens (null for parchment ⇒ the pane keeps its
 *   theme-adaptive tokens); `illustrated` is true when the resolved style names a glyphSet (the
 *   glyph-underlay mode). Both read the RESOLVED style OBJECT, so a worn skin skins the viewer too.
 */
export function useActiveSkin(mapEdits, activeLens) {
  const collection = useMemo(() => readBespokeStyles(mapEdits), [mapEdits]);
  const savedSkins = useMemo(() => listBespokeStyles(collection), [collection]);
  const activeStyle = useMemo(() => resolveActiveStyle(activeLens, collection), [activeLens, collection]);
  const pal = activeLens === DEFAULT_STYLE_ID ? null : viewerPalette(activeStyle);
  return { activeStyle, savedSkins, pal, illustrated: !!(pal && pal.glyphSet) };
}
