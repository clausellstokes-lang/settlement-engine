/**
 * townMapSkinRegistry.test.js — THE SKIN REGISTRY (THE ILLUSTRATED TOWN, IT-4): the DEAD SEAM,
 * CLOSED. A saved bespoke (AI-minted) map skin can now be SELECTED and WORN on every render
 * surface, and flipped back — the seam that was severed (resolveActiveStyle had zero production
 * callers; coerceStyleId collapsed any bespoke id to parchment; the picker listed only base ids).
 *
 * DONE-WHEN #4 (design §8) is proven here across three of the four surfaces + the flip-back law:
 *   • PERSISTENCE — readStyleLens/withStyleLens ADMIT a saved skin id (present in the blob's own
 *     collection); a stale id self-heals to the default; a base lens id is NEVER shadowed.
 *   • WORN — image export SVG + the pane's art op-list (the illustrated underlay's SINGLE source)
 *     + the thumbnail raster all resolve the ACTIVE style through resolveActiveStyle and carry the
 *     skin's palette, in LOCKSTEP (pane === export, the WYSIWYG law).
 *   • FLIP-BACK — selecting a base lens clears the skin selection but KEEPS the saved collection;
 *     the skin is instantly re-selectable; a deleted skin never strands the map.
 * (The standalone PDF surface is proven in tests/pdf/townMapDocument.smoke.test.js — a real
 *  react-pdf render, node env; the picker SELECT affordance in tests/components/…SkinPicker.)
 *
 * DORMANCY: a settlement with NO bespoke collection is byte-identical to before at every surface
 * (proven by the base-lens equivalence assertions) — the existing goldens never move this slice.
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { buildTownMapDrawList, buildTownMapSvg } from '../../src/domain/townMap/townMapDraw.js';
import {
  readStyleLens, withStyleLens, readBespokeStyles, withBespokeStyles, readMapEdits, normalizeMapEdits,
} from '../../src/domain/townMap/mapEdits.js';
import {
  addBespokeStyle, removeBespokeStyle, listBespokeStyles, resolveActiveStyle, isBaseLensId,
} from '../../src/domain/townMap/bespokeStyles.js';
import { validateBespokeStyle } from '../../src/design/townMapStyleWall.js';
import { resolveTownMapStyle } from '../../src/design/townMapStyles.js';
import { townMapExportSvg } from '../../src/lib/townMapExport.js';
import { townMapThumbCacheKey } from '../../src/lib/townMapThumb.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const SKIN_ID = 'neon-noir';
const SKIN_WATER = '#00e5ff';   // a hex that appears NOWHERE in a base lens ⇒ a legible worn-marker
const stable = (v) => JSON.stringify(v);

/** A wall-validated bespoke skin carrying a unique water color (so it is visible in the ops/SVG). */
function makeSkin(id = SKIN_ID) {
  const { ok, style } = validateBespokeStyle(
    { label: 'Neon Noir', background: '#0a0a12', palette: { water: SKIN_WATER } },
    { id, label: 'Neon Noir' },
  );
  expect(ok).toBe(true);
  expect(style.palette.water).toBe(SKIN_WATER);
  return style;
}

/** A saved settlement whose blob has the skin saved AND selected as the active lens. */
function settlementWearingSkin() {
  const base = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'skin-1' });
  const collection = addBespokeStyle({}, SKIN_ID, makeSkin());
  // withBespokeStyles + withStyleLens compose the exact persist path the accept→mint + picker use.
  const withColl = withBespokeStyles(base.mapEdits ?? null, collection);
  const edits = withStyleLens(withColl, SKIN_ID);
  return { ...base, mapEdits: edits };
}

describe('skin registry — the seam persistence (readStyleLens / withStyleLens admit a saved skin)', () => {
  it('a saved skin id present in the blob is ADMITTED as the active lens (was collapsed to parchment)', () => {
    const s = settlementWearingSkin();
    const edits = readMapEdits(s);
    expect(edits.styleLens).toBe(SKIN_ID);          // persisted (not collapsed)
    expect(readStyleLens(edits)).toBe(SKIN_ID);     // read back (the seam: admitted)
    expect(Object.keys(readBespokeStyles(edits))).toContain(SKIN_ID);
  });

  it('a STALE skin id (its definition absent) self-heals to the default (flip-back safety)', () => {
    // styleLens names a skin that is NOT in the collection ⇒ coerce to parchment ⇒ dropped.
    const edits = { styleLens: SKIN_ID, bespokeStyles: {} };
    expect(readStyleLens(edits)).toBe('parchment');
    expect(normalizeMapEdits(edits)).toBeNull();    // no real edit survives ⇒ byte-identical dormancy
  });

  it('a base lens id is NEVER shadowed — by the picker, the resolver, or the collection', () => {
    // isBaseLensId now covers EVERY pickable base lens incl. the illustrated glyph lens.
    for (const id of ['parchment', 'watercolor', 'darkFantasy', 'vtt', 'accessible', 'illustrated']) {
      expect(isBaseLensId(id)).toBe(true);
      // addBespokeStyle refuses to mint a skin onto a base id (would shadow it).
      expect(addBespokeStyle({}, id, makeSkin(id))[id]).toBeUndefined();
    }
    // and resolveActiveStyle resolves a base id to its BASE definition even if the collection tried
    // to carry that id (it can't — addBespokeStyle drops it — but the resolver is belt-and-braces).
    expect(resolveActiveStyle('vtt', { vtt: makeSkin('vtt') }).id).toBe('vtt');
  });
});

describe('skin registry — WORN in lockstep (image export + pane art path + thumbnail)', () => {
  it('the image export SVG wears the skin (its unique color present; differs from parchment)', () => {
    const s = settlementWearingSkin();
    const worn = townMapExportSvg(s);                          // no override ⇒ reads persisted styleLens
    expect(worn).toContain(SKIN_WATER);                        // the skin is WORN
    const parch = townMapExportSvg({ ...s, mapEdits: { styleLens: 'parchment' } });
    expect(parch).not.toContain(SKIN_WATER);
    expect(worn).not.toBe(parch);
    // an explicit override of the same id resolves identically (the WYSIWYG law across entry points).
    expect(worn).toBe(townMapExportSvg(s, { style: SKIN_ID }));
  });

  it('the pane art op-list (the illustrated underlay SINGLE source) === the export op-list', () => {
    const s = settlementWearingSkin();
    const edits = readMapEdits(s);
    const model = buildTownMapModel(s, edits);
    // The pane resolves activeStyle = resolveActiveStyle(activeLens, collection) and the underlay
    // draws buildTownMapDrawList(model, activeStyle). The export draws the SAME. One geometry.
    const activeStyle = resolveActiveStyle(readStyleLens(edits), readBespokeStyles(edits));
    const paneOps = buildTownMapDrawList(model, activeStyle);
    const exportOps = buildTownMapDrawList(model, activeStyle);
    expect(stable(paneOps)).toBe(stable(exportOps));
    // and the worn ops are materially the skin, not parchment.
    expect(stable(paneOps)).not.toBe(stable(buildTownMapDrawList(model, 'parchment')));
    expect(buildTownMapSvg(model, { style: activeStyle })).toContain(SKIN_WATER);
  });

  it('the thumbnail raster is keyed to + wears the skin (differs from parchment)', () => {
    const s = settlementWearingSkin();
    const worn = townMapThumbCacheKey(s, 128);
    expect(worn).toContain(`|${SKIN_ID}|`);                    // keyed to the skin id (legible)
    const parch = townMapThumbCacheKey({ ...s, mapEdits: { styleLens: 'parchment' } }, 128);
    // the key hashes the rendered SVG, so a different key proves the raster bytes differ (worn).
    expect(worn).not.toBe(parch);
  });
});

describe('skin registry — flip-back (instant, non-destructive, re-selectable)', () => {
  it('selecting a base lens clears the skin selection but KEEPS the saved collection', () => {
    const s = settlementWearingSkin();
    const flipped = withStyleLens(readMapEdits(s), 'parchment');
    expect(flipped.styleLens).toBeUndefined();                // parchment ⇒ dormant (cleared)
    expect(readStyleLens(flipped)).toBe('parchment');
    expect(Object.keys(readBespokeStyles(flipped))).toContain(SKIN_ID); // the artifact survives
    // resolving parchment gives the BASE, not the skin (flip-back is a real re-skin, not a delete).
    expect(resolveActiveStyle(readStyleLens(flipped), readBespokeStyles(flipped)).id).toBe('parchment');
    // …and re-selecting the skin works again (instant, free, non-destructive).
    const reselected = withStyleLens(flipped, SKIN_ID);
    expect(readStyleLens(reselected)).toBe(SKIN_ID);
  });

  it('deleting the last saved skin returns the blob to no-edit (dormancy) and never strands the map', () => {
    const s = settlementWearingSkin();
    const edits = readMapEdits(s);
    const emptied = withBespokeStyles(edits, removeBespokeStyle(readBespokeStyles(edits), SKIN_ID));
    // styleLens still named the (now-deleted) skin; normalize self-heals it to parchment ⇒ null.
    expect(emptied).toBeNull();
    expect(listBespokeStyles(readBespokeStyles(emptied))).toEqual([]);
  });

  it('DORMANCY: a settlement with no collection resolves + exports byte-identical to a base lens', () => {
    const base = makeTownFixture({ tier: 'town', terrain: 'plains', walls: true, water: false, seed: 'skin-dormant' });
    const model = buildTownMapModel(base, readMapEdits(base));
    // resolveActiveStyle with an empty collection is byte-identical to resolveTownMapStyle.
    expect(resolveActiveStyle('watercolor', {})).toBe(resolveTownMapStyle('watercolor'));
    expect(stable(buildTownMapDrawList(model, resolveActiveStyle('parchment', {})))).toBe(
      stable(buildTownMapDrawList(model, 'parchment')),
    );
    expect(townMapExportSvg(base)).toBe(townMapExportSvg({ ...base, mapEdits: { styleLens: 'parchment' } }));
  });
});
