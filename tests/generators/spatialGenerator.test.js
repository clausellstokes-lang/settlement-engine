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

const inst = (...names) => names.map((name, i) => ({ id: `i${i}`, name }));
const quarterNames = (layout) => layout.quarters.map((q) => q.name);

describe('waterfront district gate', () => {
  it("an isolated settlement whose only 'port-ish' institution is a Teleportation circle gets NO waterfront", () => {
    const layout = generateSpatialLayout('city', inst('Teleportation circle'), 'isolated');
    expect(quarterNames(layout)).not.toContain('Waterfront District');
  });

  it("'Barge and river transport company' alone does not conjure a waterfront on an isolated route", () => {
    const layout = generateSpatialLayout('town', inst('Barge and river transport company'), 'isolated');
    expect(quarterNames(layout)).not.toContain('Waterfront District');
  });

  it('a city with real docks on a port route DOES get a waterfront district', () => {
    const layout = generateSpatialLayout('city', inst('Docks/port facilities'), 'port');
    expect(quarterNames(layout)).toContain('Waterfront District');
  });

  it("a river city with a Harbour master's office gets a waterfront district", () => {
    const layout = generateSpatialLayout('city', inst("Harbour master's office"), 'river');
    expect(quarterNames(layout)).toContain('Waterfront District');
  });

  it('a dock institution on a land route is not enough — both gates are required', () => {
    const layout = generateSpatialLayout('town', inst('Shipyard'), 'road');
    expect(quarterNames(layout)).not.toContain('Waterfront District');
  });
});
