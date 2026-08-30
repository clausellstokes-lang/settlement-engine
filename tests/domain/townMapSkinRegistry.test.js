/**
 * townMapSkinRegistry.test.js — THE SKIN REGISTRY (THE ILLUSTRATED TOWN, IT-4): the DEAD SEAM,
 * CLOSED. A saved bespoke (AI-minted) map skin can now be SELECTED and WORN on every render
 * surface, and flipped back — the seam that was severed (resolveActiveStyle had zero production
 * callers; coerceStyleId collapsed any bespoke id to parchment; the picker listed only base ids).
 *
 * DONE-WHEN #4 (design §8) is proven here across the surfaces that remain + the flip-back law:
 *   • PERSISTENCE — readStyleLens/withStyleLens ADMIT a saved skin id (present in the blob's own
 *     collection); a stale id self-heals to the default; a base lens id is NEVER shadowed.
 *   • WORN — the pane's art op-list (the illustrated underlay's SINGLE source) resolves the ACTIVE
 *     style through resolveActiveStyle and carries the skin's palette.
 *   • FLIP-BACK — selecting a base lens clears the skin selection but KEEPS the saved collection;
 *     the skin is instantly re-selectable; a deleted skin never strands the map.
 * (§725/§748: the image-export SVG arm, the thumbnail-raster arm and the standalone-PDF surface
 *  this note used to cite are GONE WITH THE LANES THEMSELVES — the legacy settlement map's export,
 *  thumbnail and PDF surfaces are stripped. The picker SELECT affordance is proven in
 *  tests/components/…SkinPicker.)
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
import { validateBespokeStyle } from '../../src/domain/townMap/mapEdits.js';
import { resolveTownMapStyle } from '../../src/design/townMapStyles.js';
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

describe('skin registry — WORN on the pane art path', () => {
  it('the pane art op-list (the illustrated underlay SINGLE source) is the ONE resolved geometry', () => {
    const s = settlementWearingSkin();
    const edits = readMapEdits(s);
    const model = buildTownMapModel(s, edits);
    // The pane resolves activeStyle = resolveActiveStyle(activeLens, collection) and the underlay
    // draws buildTownMapDrawList(model, activeStyle) — the ONE geometry every surface reads.
    // (§725/§748: the export op-list this arm used to compare against is gone with the export
    // lane. A same-expression comparison would be a control that cannot fail, so it is not kept.)
    const activeStyle = resolveActiveStyle(readStyleLens(edits), readBespokeStyles(edits));
    const paneOps = buildTownMapDrawList(model, activeStyle);
    // the worn ops are materially the skin, not parchment.
    expect(stable(paneOps)).not.toBe(stable(buildTownMapDrawList(model, 'parchment')));
    expect(buildTownMapSvg(model, { style: activeStyle })).toContain(SKIN_WATER);
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

  it('DORMANCY: a settlement with no collection resolves byte-identical to a base lens', () => {
    const base = makeTownFixture({ tier: 'town', terrain: 'plains', walls: true, water: false, seed: 'skin-dormant' });
    const model = buildTownMapModel(base, readMapEdits(base));
    // resolveActiveStyle with an empty collection is byte-identical to resolveTownMapStyle.
    expect(resolveActiveStyle('watercolor', {})).toBe(resolveTownMapStyle('watercolor'));
    expect(stable(buildTownMapDrawList(model, resolveActiveStyle('parchment', {})))).toBe(
      stable(buildTownMapDrawList(model, 'parchment')),
    );
  });
});
