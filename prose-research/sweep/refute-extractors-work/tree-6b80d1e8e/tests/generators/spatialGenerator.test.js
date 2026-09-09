/**
 * tests/generators/spatialGenerator.test.js — waterfront district gate.
 *
 * The old gate was `has('port') || has('Dock')`, a case-sensitive substring:
 * 'Teleportation circle' and 'Barge and river transport company' both contain
 * 'port', so isolated settlements grew phantom wharves. The fixed gate
 * requires BOTH a dock-specific institution name AND a water trade route —
 * these pins keep the false positives dead and the true positives alive.
 */
import { describe, it, expect } from 'vitest';
import { generateSpatialLayout } from '../../src/generators/spatialGenerator.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const inst = (...names) => names.map((name, i) => ({ id: `i${i}`, name }));
const quarterNames = (layout) => layout.quarters.map((q) => q.name);

describe('waterfront district gate', () => {
  it("an isolated settlement whose only 'port-ish' institution is a Teleportation circle gets NO waterfront", () => {
    const layout = generateSpatialLayout('city', inst('Teleportation circle'), 'isolated');
    // Every city gets the residential pair unconditionally, so 'Wealthy Residential' is
    // the sibling proving this quarter list was actually built before we claim the
    // waterfront was kept out of it.
    expectAbsentWithAnchor(
      quarterNames(layout),
      'Waterfront District',
      'Wealthy Residential',
      "an isolated city's teleportation circle is not a dock",
    );
  });

  it("'Barge and river transport company' alone does not conjure a waterfront on an isolated route", () => {
    // 'Market square' is the liveness institution: it mints a Market Quarter at any
    // tier and cannot match the dock regex, so the quarter list is provably built
    // while the pinned regression — the 'port' substring inside 'transPORT' must not
    // conjure a wharf — stays exactly what it was.
    const layout = generateSpatialLayout(
      'town',
      inst('Market square', 'Barge and river transport company'),
      'isolated',
    );
    expectAbsentWithAnchor(
      quarterNames(layout),
      'Waterfront District',
      'Market Quarter',
      "a transport company's name-substring is not a dock on an isolated route",
    );
  });

  it('a city with real docks on a port route DOES get a waterfront district', () => {
    const layout = generateSpatialLayout('city', inst('Docks/port facilities'), 'port');
    expect(quarterNames(layout)).toContain('Waterfront District');
  });

  it('renders a riverside port as a barge-and-wharf district, not a seaport', () => {
    const layout = generateSpatialLayout(
      'city',
      inst('Docks/port facilities'),
      'port',
      'riverside',
    );
    const waterfront = layout.quarters.find(
      quarter => quarter.name === 'Waterfront District',
    );

    expect(layout.tradeAccess).toBe(
      'Inland river port (wharves and barge docks)',
    );
    expect(waterfront).toMatchObject({
      location: 'Along the river',
      desc: 'Warehouses, wharves, barges, dockworkers, and river traffic',
      landmarks: ['Barge Wharf', 'Warehouse Row', 'River Landing'],
    });
    // The tradeAccess toBe and the waterfront toMatchObject above pin this layout's
    // exact river-port shape, so the whole-object scan below runs over a demonstrably
    // live, populated layout rather than an empty one.
    // anchored: layout is pinned live by the tradeAccess and waterfront assertions above
    expect(JSON.stringify(layout)).not.toMatch(
      /\b(?:coastal port|harbour|shipyards?|sailors?)\b/i,
    );
  });

  it("a river city with a Harbour master's office gets a waterfront district", () => {
    const layout = generateSpatialLayout('city', inst("Harbour master's office"), 'river');
    expect(quarterNames(layout)).toContain('Waterfront District');
  });

  it('a dock institution on a land route is not enough — both gates are required', () => {
    // Same liveness pattern as the barge case: Market square proves the list is
    // populated; Shipyard IS a dock name, so this pin isolates the route half of
    // the two-part gate.
    const layout = generateSpatialLayout('town', inst('Market square', 'Shipyard'), 'road');
    expectAbsentWithAnchor(
      quarterNames(layout),
      'Waterfront District',
      'Market Quarter',
      'a real dock institution without a water route earns no waterfront',
    );
  });
});

describe('layout templates never print an authoring alternation (ODQ §767.3(e))', () => {
  // The desert-village row shipped "…central well and mosque or chapel" — the
  // template's own unresolved either/or, printed verbatim to the user, naming a
  // building ('mosque') no catalog institution ever mints. The generator now
  // DERIVES the sacred noun from the roster it was handed, so the layout line
  // can never promise a building the dossier lacks — and never hedges.

  it('a desert village with a church-family institution says "its church"', () => {
    const layout = generateSpatialLayout('village', inst('Parish church', 'Market square'), 'road', 'desert');
    expect(layout.layout).toBe('Compact walled settlement around a central well and its church');
  });

  it('a desert village with only a shrine says "a wayside shrine"', () => {
    const layout = generateSpatialLayout('village', inst('Wayside shrine', 'Market square'), 'road', 'desert');
    expect(layout.layout).toBe('Compact walled settlement around a central well and a wayside shrine');
  });

  it('a desert village with no sacred roster drops the clause instead of inventing one', () => {
    const layout = generateSpatialLayout('village', inst('Market square'), 'road', 'desert');
    expect(layout.layout).toBe('Compact walled settlement around a central well');
  });

  it('the hills town commits to the keep — the castle-or-keep hedge is gone', () => {
    const layout = generateSpatialLayout('town', inst('Market square'), 'road', 'hills');
    expect(layout.layout).toBe('Stone-walled hill town, the keep visible above the market quarter');
  });

  it('no tier×terrain layout row carries an either/or building hedge', () => {
    // Sweep the whole template table through the public API: every tier at every
    // terrain, with and without a sacred roster. An "X or Y" between building
    // nouns is the class this pins dead; ordinary prose "or" does not appear in
    // any authored row today, so the bare pattern is the honest detector.
    const tiers = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
    const terrains = ['coastal', 'riverside', 'plains', 'forest', 'hills', 'desert', 'mountain'];
    const rosters = [inst('Market square'), inst('Parish church', 'Wayside shrine', 'Market square')];
    for (const tier of tiers) for (const terrain of terrains) for (const roster of rosters) {
      const { layout } = generateSpatialLayout(tier, roster, 'road', terrain);
      // LIVENESS: this row really produced prose. Without it the sweep below would
      // pass just as happily on an empty string or a table that drifted away.
      expect(layout, `${tier}/${terrain}`).toMatch(/[a-z]{4,}/i);
      // anchored: the toMatch liveness above proves this row rendered real prose
      expect(layout, `${tier}/${terrain}`).not.toMatch(/\bor\b/);
    }
  });
});
