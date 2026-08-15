/**
 * townLayoutV2.test.js — TOWN LAYOUT v2 (#38): the VERSIONING LAW pins, the fabric
 * both-branches pins, the total-assignment/determinism/no-mutation invariants, and
 * the lens/export inheritance pin.
 *
 * The v2 engine is a SIBLING generation that emits the identical TownMapModel shape,
 * so the render substrate (draw layer, four lenses, exports, hover, pins) inherits it
 * unchanged. These pins hold the law that makes that safe: v1 stays byte-identical,
 * v2 is opt-in, a redraw is non-destructive, and the fabric read shapes v2 when lit
 * yet falls back to full quality when dark.
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import {
  readLayoutLawVersion, withLayoutLawVersion, withPinNudge, withStyleLens,
  withLegendPref, newSettlementMapEdits, NEW_SETTLEMENT_LAYOUT_LAW_VERSION,
} from '../../src/domain/townMap/mapEdits.js';
import { anchorForInstitution } from '../../src/domain/townMap/anchors.js';
import { HAMLET_CLUSTER_ID } from '../../src/domain/townMap/institutionAssignment.js';
import {
  buildTownMapDrawList, buildTownMapSvg, hasDrawableMap,
} from '../../src/domain/townMap/townMapDraw.js';
import { TOWN_MAP_STYLE_IDS } from '../../src/design/townMapStyles.js';
import { makeTownFixture, makeFabricMirror } from '../fixtures/townMapFixtures.js';

const stable = (v) => JSON.stringify(v);
const clone = (v) => JSON.parse(JSON.stringify(v));
const V2 = { layoutLawVersion: 2 };

describe('v2 versioning law — default is v1, v2 is opt-in', () => {
  const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'v2law-1' });

  it('a settlement with NO marker renders v1 (byte-identical to view-only)', () => {
    const noEdits = buildTownMapModel(s);
    expect(noEdits.layoutLawVersion).toBe(1);
    expect(noEdits.townMapGeometryVersion).toBe(1);
    // absent / empty / v1-marker / lens-only are ALL v1 (the marker is dormant unless 2)
    expect(stable(buildTownMapModel(s, {}))).toBe(stable(noEdits));
    expect(stable(buildTownMapModel(s, { layoutLawVersion: 1 }))).toBe(stable(noEdits));
    expect(buildTownMapModel(s, { styleLens: 'vtt' }).layoutLawVersion).toBe(1);
  });

  it('the v2 marker selects v2 — different bytes, geometry v2', () => {
    const v1 = buildTownMapModel(s);
    const v2 = buildTownMapModel(s, V2);
    expect(v2.layoutLawVersion).toBe(2);
    expect(v2.townMapGeometryVersion).toBe(2);
    expect(stable(v2)).not.toBe(stable(v1));
    // …and the OUTPUT SHAPE is a SUPERSET of v1 (every render key v1 has, v2 has too —
    // so every consumer inherits it — plus the additive `provenance` map v2 alone carries)
    for (const k of Object.keys(v1)) expect(v2).toHaveProperty(k);
    for (const k of ['frame', 'skeleton', 'districts', 'buildings', 'fortifications', 'overlays', 'meta', 'reserved']) {
      expect(v2).toHaveProperty(k);
    }
    expect(v2).toHaveProperty('provenance'); // v2-only additive output
    expect(Object.keys(v1)).not.toContain('provenance');
  });

  it('newSettlementMapEdits mints the v2 marker (new settlements mint v2)', () => {
    const minted = newSettlementMapEdits();
    expect(readLayoutLawVersion(minted)).toBe(2);
    expect(buildTownMapModel(s, minted).layoutLawVersion).toBe(2);
  });

  it('THE ONE DIAL: the mint reads NEW_SETTLEMENT_LAYOUT_LAW_VERSION (taste veto = one line)', () => {
    // The default-mint the three create chokepoints stamp is driven by ONE exported constant,
    // so a taste veto flips it in one place. Today it ships v2.
    expect(NEW_SETTLEMENT_LAYOUT_LAW_VERSION).toBe(2);
    expect(newSettlementMapEdits().layoutLawVersion).toBe(NEW_SETTLEMENT_LAYOUT_LAW_VERSION);
  });
});

describe('v2 versioning law — the opt-in redraw is NON-DESTRUCTIVE', () => {
  const s = makeTownFixture({ tier: 'town', terrain: 'hills', walls: true, water: true, seed: 'v2redraw-1' });

  it('redraw v1→v2 preserves EVERY other edit (pins, lens, legend, variant)', () => {
    const anchor = buildTownMapModel(s).buildings[2].anchorKey;
    let edits = withPinNudge(null, anchor, 33, -21);
    edits = withStyleLens(edits, 'darkFantasy');
    edits = withLegendPref(edits, 'showLabels', true);
    edits = { ...edits, layoutVariant: 4 };

    const redrawn = withLayoutLawVersion(edits, 2);
    expect(readLayoutLawVersion(redrawn)).toBe(2);
    expect(redrawn.pins).toEqual(edits.pins);          // pins survive
    expect(redrawn.styleLens).toBe('darkFantasy');      // lens survives
    expect(redrawn.legendPrefs).toEqual({ showLabels: true });
    expect(redrawn.layoutVariant).toBe(4);              // reroll salt survives
  });

  it('a v1 pin still nudges the SAME building under v2 (version-independent anchors)', () => {
    const anchor = buildTownMapModel(s).buildings[3].anchorKey;
    const redrawn = withLayoutLawVersion(withPinNudge(null, anchor, 40, -30), 2);
    const base = buildTownMapModel(s, V2);
    const pinned = buildTownMapModel(s, redrawn);
    const b0 = base.buildings.find((b) => b.anchorKey === anchor);
    const b1 = pinned.buildings.find((b) => b.anchorKey === anchor);
    expect(b1.position.x).toBe(Math.max(0, Math.min(1000, b0.position.x + 40)));
    expect(b1.position.y).toBe(Math.max(0, Math.min(1000, b0.position.y - 30)));
    // every OTHER building is untouched
    for (const b of base.buildings) {
      if (b.anchorKey === anchor) continue;
      const after = pinned.buildings.find((x) => x.anchorKey === b.anchorKey);
      expect(stable(after)).toBe(stable(b));
    }
  });

  it('redraw v2→v1 clears the marker ⇒ byte-identical dormancy', () => {
    const backToV1 = withLayoutLawVersion(V2, 1);
    expect(backToV1).toBeNull(); // the only edit removed ⇒ null container
    expect(readLayoutLawVersion(backToV1)).toBe(1);
  });

  it('a dangling-anchor pin under v2 is dropped (no throw, no phantom)', () => {
    const base = stable(buildTownMapModel(s, V2));
    let edited;
    expect(() => { edited = buildTownMapModel(s, { layoutLawVersion: 2, pins: [{ anchor: 'name:no-such-zzz', dx: 40, dy: 40 }] }); }).not.toThrow();
    expect(stable(edited)).toBe(base);
  });
});

describe('v2 engine — invariants (total assignment, determinism, no mutation)', () => {
  it('every institution is placed exactly once (total assignment)', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'plains', walls: true, water: false, seed: 'v2total-1' });
    const model = buildTownMapModel(s, V2);
    const expected = s.institutions.map(anchorForInstitution).sort();
    const placed = model.buildings.map((b) => b.anchorKey).sort();
    expect(placed).toEqual(expected);
    expect(new Set(placed).size).toBe(model.buildings.length);
  });

  it('the quarter-less floor places every institution in the hamlet cluster', () => {
    const s = makeTownFixture({ tier: 'hamlet', terrain: 'hills', walls: false, water: false, seed: 'v2floor-1', quarters: [] });
    const model = buildTownMapModel(s, V2);
    expect(model.meta.hamletCluster).toBe(true);
    expect(model.districts[0].id).toBe(HAMLET_CLUSTER_ID);
    for (const b of model.buildings) expect(b.districtId).toBe(HAMLET_CLUSTER_ID);
  });

  it('same (settlement, edits) builds byte-identically twice', () => {
    const s = makeTownFixture({ tier: 'metropolis', terrain: 'coastal', walls: true, water: true, seed: 'v2det-1' });
    expect(stable(buildTownMapModel(s, V2))).toBe(stable(buildTownMapModel(s, V2)));
  });

  it('leaves the settlement and mapEdits objects unchanged', () => {
    const s = makeTownFixture({ tier: 'city', terrain: 'riverside', walls: false, water: true, seed: 'v2nomut-1' });
    const sBefore = clone(s);
    const edits = { layoutLawVersion: 2, layoutVariant: 3, pins: [{ anchor: 'name:whatever', dx: 5, dy: 5 }] };
    const editsBefore = clone(edits);
    buildTownMapModel(s, edits);
    expect(s).toEqual(sBefore);
    expect(edits).toEqual(editsBefore);
  });

  it('a positive layoutVariant rerolls the v2 arrangement deterministically', () => {
    const s = makeTownFixture({ tier: 'town', terrain: 'plains', walls: true, water: false, seed: 'v2reroll-1' });
    const base = stable(buildTownMapModel(s, V2));
    const r = stable(buildTownMapModel(s, { layoutLawVersion: 2, layoutVariant: 2 }));
    expect(r).not.toBe(base);
    expect(r).toBe(stable(buildTownMapModel(s, { layoutLawVersion: 2, layoutVariant: 2 })));
  });
});

describe('v2 engine — URBAN FABRIC consumption, both branches', () => {
  const base = makeTownFixture({ tier: 'city', terrain: 'hills', walls: true, water: false, seed: 'v2fab-1' });

  it('DARK (no urbanFabric mirror) ⇒ full-quality fallback, hasFabric false', () => {
    const dark = buildTownMapModel(base, V2);
    expect(dark.meta.hasFabric).toBe(false);
    expect(dark.meta.districtCount).toBeGreaterThan(0);
    expect(dark.meta.buildingCount).toBe(base.institutions.length);
    expect(dark.meta.lynchScore).toBeGreaterThan(0.4);
  });

  it('LIT (populated mirror) ⇒ hasFabric true, and the layout DIFFERS from dark', () => {
    const lit = buildTownMapModel({ ...base, urbanFabric: makeFabricMirror() }, V2);
    const dark = buildTownMapModel(base, V2);
    expect(lit.meta.hasFabric).toBe(true);
    expect(stable(lit.districts)).not.toBe(stable(dark.districts)); // prominence/drift/scars reshape
    expect(lit.meta.buildingCount).toBe(dark.meta.buildingCount);   // same roster, different grain
  });

  it('fabric absence is NOT neutrality (drift null ≠ 0.5): a mid-drift mirror differs from dark', () => {
    const dark = buildTownMapModel(base, V2);
    const midDrift = buildTownMapModel({ ...base, urbanFabric: { drift: 0.5, stocks: {}, scars: [], rebirths: [] } }, V2);
    // a lit mirror even at drift 0.5 takes the hasFabric branch — it is NOT the dark path
    expect(midDrift.meta.hasFabric).toBe(true);
    expect(dark.meta.hasFabric).toBe(false);
  });
});

describe('v2 engine — lens + export inheritance (the substrate is unchanged)', () => {
  const s = makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'v2lens-1' });
  const v2 = buildTownMapModel(s, V2);

  it('a v2 model is drawable and renders under ALL FOUR lenses', () => {
    expect(hasDrawableMap(v2)).toBe(true);
    const perLens = {};
    for (const lens of TOWN_MAP_STYLE_IDS) {
      const ops = buildTownMapDrawList(v2, lens);
      expect(ops.length).toBeGreaterThan(0);
      perLens[lens] = stable(ops);
    }
    // the lenses produce DISTINCT bytes (they actually re-skin — geometry identical)
    expect(perLens.parchment).not.toBe(perLens.vtt);
    expect(perLens.watercolor).not.toBe(perLens.darkFantasy);
  });

  it('a v2 model exports through the existing SVG matrix under every lens', () => {
    for (const lens of TOWN_MAP_STYLE_IDS) {
      const svg = buildTownMapSvg(v2, { style: lens });
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg.trim().endsWith('</svg>')).toBe(true);
      expect(svg).not.toContain('href='); // self-contained, taint-free
    }
  });
});

describe('v2 engine — the export list is read at its LIVE spelling (TCD-3)', () => {
  /**
   * The economy writes `economicState.primaryExports`; `exports` is a legacy SAVE
   * alias it has never written (measured over the full pipeline: primaryExports
   * 60/60, exports 0/60). This engine used to read `exports` directly, so the export
   * list was empty on every generated settlement and the whole RESOURCE family — the
   * sited work-quarters AND the STAGE-0 water/landform substance that reads the same
   * list — never fired. The read now goes through canonExports.
   *
   * ⚠ THE v2 GOLDEN CANNOT PIN THIS. Its one export-bearing fixture (the marsh
   * landform config, townMapFixtures.js) writes the LEGACY alias, so it resolves
   * through canonExports's fallback and is byte-identical either way — the golden
   * stayed green across this whole fix. These pins drive the LIVE spelling instead,
   * which is the only spelling a generated settlement actually carries.
   */
  const base = makeTownFixture({ tier: 'town', terrain: 'plains', walls: false, water: false, seed: 'tcd3-live' });
  const withEconomy = (eco) => buildTownMapModel({ ...base, economicState: { ...base.economicState, ...eco } }, V2);

  const none = withEconomy({});
  const live = withEconomy({ primaryExports: ['Peat fuel', 'Reeds and thatch'] });

  it('ANCHORED NEGATIVE: the export-less control is a real, drawable map', () => {
    // Without this, the contrast below could pass against an empty harness: an engine
    // that produced nothing at all would also "differ" from the export-bearing model.
    expect(none.districts.length).toBeGreaterThan(0);
    expect(hasDrawableMap(none)).toBe(true);
    // dry plains, no economy to substantiate water ⇒ a bare plain site
    expect(none.meta.siteKind).toBe('plain');
    expect(none.frame.landform ?? null).toBeNull();
    expect(none.frame.water ?? null).toBeNull();
  });

  it('primaryExports reaches STAGE 0 — a reed/peat economy substantiates the wetland', () => {
    expect(live.meta.siteKind).toBe('marsh');
    expect(live.frame.landform?.kind).toBe('marsh');
    expect(live.frame.landform.marks.length).toBeGreaterThan(0);
    // the whole model moves, not merely the site label
    expect(stable(live)).not.toBe(stable(none));
  });

  it('primaryExports reaches STAGE 1 — a quarry export sites a named resource cause', () => {
    const stone = withEconomy({ primaryExports: ['Quarried stone'] });
    const causes = Object.values(stone.provenance).flat()
      .filter((p) => p.sourceFamily === 'resource').map((p) => p.sourceRef);
    // derived from the fixture, not restated: the cause must name the export itself
    expect(causes.some((c) => c.includes('Quarried stone'))).toBe(true);
    expect(Object.values(none.provenance).flat().some((p) => p.sourceFamily === 'resource')).toBe(false);
  });

  it('the legacy `exports` alias still resolves identically (old saves unmoved)', () => {
    const legacy = withEconomy({ exports: ['Peat fuel', 'Reeds and thatch'] });
    expect(stable(legacy)).toBe(stable(live));
  });
});
