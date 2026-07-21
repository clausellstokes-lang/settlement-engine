/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumBandLadders.test.jsx — THE BAND-LADDER TOTALITY PIN (W6).
 *
 * The owner's complaint: the Compendium described banded concepts (Prosperity,
 * settlement stability, capacity strain, criminal capture) but never ENUMERATED
 * their bands. The fix renders each banded concept's FULL ladder from the engine's
 * typed tables (domain/compendium/bandLadders.js). This pin makes the complaint
 * structurally UNREPEATABLE along two axes:
 *
 *   1. TOTALITY — every ladder the compendium declares renders every rung, and
 *      every rung carries a NON-EMPTY one-line reading, in the actual tab DOM.
 *   2. COVERAGE (both directions) — each ladder's rungs equal its CANONICAL engine
 *      table exactly. A new band added to PROSPERITY_TIERS / BAND_HINT /
 *      CAPACITY_BANDS / CAPTURE_LADDER without a reading REDS here; an orphan rung
 *      REDS too. The compendium can never again describe a band it does not name.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import {
  buildCompendiumBandLadders,
  bandLaddersForTab,
} from '../../src/domain/compendium/bandLadders.js';
import { EconomyTab, StressTab, PowerTab_ } from '../../src/components/compendium/CatalogTabs.jsx';
import { PROSPERITY_TIERS } from '../../src/data/constants.js';
import { BAND_HINT } from '../../src/domain/state/bands.js';
import { CAPACITY_BANDS } from '../../src/domain/capacityModel.js';
import { CAPTURE_LADDER } from '../../src/domain/corruption.js';

afterEach(cleanup);

// The compendium tab each ladder.tab id renders in (matches CatalogTabs wiring).
const TAB_COMPONENT = { economy: EconomyTab, stress: StressTab, power: PowerTab_ };

describe('compendium band ladders — the shape is total', () => {
  const ladders = buildCompendiumBandLadders();

  test('every ladder is well-formed with at least two named, read rungs', () => {
    expect(ladders.length).toBeGreaterThan(0);
    for (const l of ladders) {
      expect(typeof l.id, `${l.id} id`).toBe('string');
      expect(l.concept.trim().length, `${l.id} concept`).toBeGreaterThan(0);
      expect(l.blurb.trim().length, `${l.id} blurb`).toBeGreaterThan(0);
      expect(TAB_COMPONENT[l.tab], `${l.id} tab "${l.tab}" is a real compendium tab`).toBeTruthy();
      expect(l.levels.length, `${l.id} ladder is too short`).toBeGreaterThanOrEqual(2);
      for (const lvl of l.levels) {
        expect(lvl.name.trim().length, `${l.id} rung name empty`).toBeGreaterThan(0);
        expect(
          typeof lvl.reading === 'string' && lvl.reading.trim().length > 0,
          `${l.id} rung "${lvl.name}" has no interpretation`,
        ).toBe(true);
      }
    }
  });

  test('rung names never leak a raw engine slug (the humanized-term law)', () => {
    for (const l of ladders) {
      for (const { name } of l.levels) {
        expect(/^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(name), `${l.id} "${name}" is ENGINE_SNAKE`).toBe(false);
        expect(name.includes('_'), `${l.id} "${name}" leaks an underscore`).toBe(false);
        expect(/^[a-z0-9]+(-[a-z0-9]+)+$/.test(name), `${l.id} "${name}" reads as a kebab slug`).toBe(false);
        expect(/[A-Za-z]/.test(name), `${l.id} "${name}" has no letters`).toBe(true);
      }
    }
  });

  test('the derivation is pure and deterministic (two builds are equal)', () => {
    expect(buildCompendiumBandLadders()).toEqual(buildCompendiumBandLadders());
  });
});

describe('compendium band ladders — coverage is pinned to the canonical tables', () => {
  const byId = Object.fromEntries(buildCompendiumBandLadders().map((l) => [l.id, l]));
  const names = (id) => byId[id].levels.map((lvl) => lvl.name);

  test('prosperity rungs ARE PROSPERITY_TIERS, in order, each read', () => {
    expect(names('prosperity')).toEqual([...PROSPERITY_TIERS]);
    for (const lvl of byId.prosperity.levels) {
      expect(lvl.reading.trim().length, `prosperity "${lvl.name}" unread`).toBeGreaterThan(0);
    }
  });

  test('stability rungs cover every BAND_HINT band, reading IS the code hint (zero drift)', () => {
    for (const [band, hint] of Object.entries(BAND_HINT)) {
      const lvl = byId.stability.levels.find((x) => x.name === band);
      expect(lvl, `stability band "${band}" undocumented in the compendium`).toBeTruthy();
      expect(lvl.reading, `stability "${band}" drifted from BAND_HINT`).toBe(hint);
    }
    expect(byId.stability.levels.length).toBe(Object.keys(BAND_HINT).length);
  });

  test('strain rungs cover every CAPACITY_BANDS band', () => {
    expect(names('strain').map((n) => n.toLowerCase())).toEqual([...CAPACITY_BANDS]);
  });

  test('capture rungs cover every CAPTURE_LADDER rung', () => {
    expect(names('capture').map((n) => n.toLowerCase())).toEqual([...CAPTURE_LADDER]);
  });
});

describe('compendium band ladders — the tab DOM actually renders every rung', () => {
  // Group ladders by the tab that owns them, then mount that tab ONCE and assert
  // every rung name AND its reading are present in the rendered output. A ladder
  // that is declared but not wired into its tab (or a rung dropped in render) reds.
  const byTab = {};
  for (const l of buildCompendiumBandLadders()) (byTab[l.tab] ||= []).push(l);

  for (const [tab, tabLadders] of Object.entries(byTab)) {
    test(`the "${tab}" tab renders ${tabLadders.map((l) => l.concept).join(' + ')}`, () => {
      const Tab = TAB_COMPONENT[tab];
      const { container } = render(<Tab />);
      const text = container.textContent || '';
      for (const l of tabLadders) {
        expect(text.includes(l.concept), `${tab} tab missing heading "${l.concept}"`).toBe(true);
        for (const lvl of l.levels) {
          expect(text.includes(lvl.name), `${tab} tab missing rung "${lvl.name}"`).toBe(true);
          expect(text.includes(lvl.reading), `${tab} tab missing reading for "${lvl.name}"`).toBe(true);
        }
      }
    });
  }

  test('bandLaddersForTab partitions the full set with no loss', () => {
    const all = buildCompendiumBandLadders();
    const viaTab = ['economy', 'stress', 'power'].flatMap((t) => bandLaddersForTab(t));
    expect(viaTab.map((l) => l.id).sort()).toEqual(all.map((l) => l.id).sort());
  });
});
