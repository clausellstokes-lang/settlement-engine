/**
 * @vitest-environment jsdom
 *
 * tests/ui/landingRealmMapOverlay.test.jsx — THE REALM CARD NEVER NAMES A TOWN
 * TWICE, AND ITS PINS SIT ON THE PHOTOGRAPH'S OWN MARKERS.
 *
 * The landing's realm card lays overlay pins over a photograph of the realm
 * (public/landing-maps/realm-cnocby.png) that already draws every town's marker
 * and prints its name. The overlay used to sit at guessed box percentages with
 * its own labels, so Cnocby and Penshaw each read twice (VISIBLE-BUGS item 1,
 * 2026-11-12). The ruling: an overlay pin sits ON its town's marker; where the
 * photograph prints the name the overlay prints none; a town the photograph
 * does not name keeps its overlay label.
 *
 * The names the photograph prints are read from its provenance record (the
 * capture's own list of what was in frame), not from the component, so the
 * duplicate arm cannot be satisfied by editing a list beside the code.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RealmMapCard } from '../../src/components/home/LandingArtifacts.jsx';
import { fixture } from '../../src/components/home/landingFixture.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const provenance = JSON.parse(readFileSync(join(ROOT, 'public/landing-maps/realm-cnocby.provenance.json'), 'utf8'));
const PRINTED = provenance.settlements.map((s) => s.name);

afterEach(cleanup);

/** The map half: the element painted with the realm photograph. */
function mapHalf(container) {
  const el = [...container.querySelectorAll('div')].find((d) => (d.getAttribute('style') || '').includes('realm-cnocby'));
  expect(el, 'the realm card paints the photograph').toBeTruthy();
  return el;
}

describe('realm card overlay: one name per town, pins on the drawn markers', () => {
  test('no overlay text in the map repeats a name the photograph prints', () => {
    const { container } = render(<RealmMapCard />);
    const texts = [...mapHalf(container).querySelectorAll('*')]
      .filter((el) => el.children.length === 0)
      .map((el) => el.textContent.trim())
      .filter(Boolean);
    const dupes = texts.filter((t) => PRINTED.includes(t));
    expect(dupes).toEqual([]);
  });

  test('every fixture pin is placed at its town\'s measured marker on the photograph', async () => {
    const { REALM_MAP_GEOMETRY } = await import('../../src/components/home/LandingArtifacts.jsx');
    const { container } = render(<RealmMapCard />);
    const placed = [...mapHalf(container).querySelectorAll('[data-realm-pin]')];
    expect(placed.map((p) => p.getAttribute('data-realm-pin'))).toEqual(fixture.realm.pins.map((p) => p.name));
    for (const p of placed) {
      const m = REALM_MAP_GEOMETRY.markers[p.getAttribute('data-realm-pin')];
      expect(m, `${p.getAttribute('data-realm-pin')} has a measured marker`).toBeTruthy();
      expect(p.style.left).toBe(`${m.x}%`);
      expect(p.style.top).toBe(`${m.y}%`);
    }
  });

  test('the geometry is the photograph\'s: its size and printed names match the capture record', async () => {
    const { REALM_MAP_GEOMETRY } = await import('../../src/components/home/LandingArtifacts.jsx');
    expect([...REALM_MAP_GEOMETRY.printedNames].sort()).toEqual([...PRINTED].sort());
    expect(Object.keys(REALM_MAP_GEOMETRY.markers).sort()).toEqual([...PRINTED].sort());
    const png = readFileSync(join(ROOT, 'public/landing-maps/realm-cnocby.png'));
    // PNG IHDR: width and height are big-endian u32 at bytes 16 and 20.
    expect({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) }).toEqual(REALM_MAP_GEOMETRY.size);
  });
});
