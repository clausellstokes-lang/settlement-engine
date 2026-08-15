/**
 * tests/lib/mapSubTabs.test.js — TC-0, the headless half of the Map tab sub-tab
 * shell (DESIGN_TOWN_CARTOGRAPHY.md §12 / J-TC-8).
 *
 * The presence gate is the CONTRACT. Reading it out of a rendered strip would
 * test the renderer instead of the rule (the `realmInspectorSectionsFor`
 * precedent), so these drive the pure resolver directly: which sub-tabs exist for
 * which viewer on which machine, and what a stale, retired, or hand-typed id
 * resolves to.
 *
 * The companion tests/ui/mapTabShell.test.jsx proves the SHELL honours what this
 * file decides; neither is sufficient alone.
 */

import { describe, expect, test } from 'vitest';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import {
  MAP_SUB_TAB_CARTOGRAPHY,
  MAP_SUB_TAB_IDS,
  MAP_SUB_TAB_PARAM,
  MAP_SUB_TAB_PLAYER,
  PRESENTATION_SUB_TAB_IDS,
  isPresentationSubTab,
  mapSubTabLabel,
  normalizeMapSubTab,
  presentationViewFor,
  readMapSubTabParam,
  resolveMapSubTabs,
  townSceneSelectable,
} from '../../src/lib/mapSubTabs.js';
import { TOWN_MAP_VIEW_IDS } from '../../src/lib/lastMapView.js';

const idsOf = (tabs) => tabs.map((t) => t.id);

describe('TC-0 — the sub-tab vocabulary is the pane vocabulary, extended by one', () => {
  test('the presentation ids ARE the persisted town-map view ids, not a second spelling', () => {
    // BUILD ON, NEVER BESIDE (§2). If someone re-spells these locally, this reds:
    // a fork here is how a strip offers a projection the pane cannot persist.
    expect(PRESENTATION_SUB_TAB_IDS).toBe(TOWN_MAP_VIEW_IDS);
    expect([...PRESENTATION_SUB_TAB_IDS]).toEqual(['plan', 'panorama', 'portrait3d']);
  });

  test('the whole vocabulary is the presentations plus the two non-projections', () => {
    expect([...MAP_SUB_TAB_IDS]).toEqual(['plan', 'panorama', 'portrait3d', 'player', 'cartography']);
    expect(MAP_SUB_TAB_PLAYER).toBe('player');
    expect(MAP_SUB_TAB_CARTOGRAPHY).toBe('cartography');
  });

  test('TC-5b-ii THE SEAT GUARD — the painter joins NO persisted vocabulary', () => {
    // The owner-gated surface this packet exists to avoid. PRESENTATION_SUB_TAB_IDS
    // IS TOWN_MAP_VIEW_IDS by direct alias — a closed, migration-bearing,
    // device-persisted list whose docblock forbids renaming an id in place. Both
    // negatives are anchored on `panorama`, which travels the identical path.
    expectAbsentWithAnchor(
      [...TOWN_MAP_VIEW_IDS], MAP_SUB_TAB_CARTOGRAPHY, 'panorama',
      'the persisted town-map view vocabulary',
    );
    expectAbsentWithAnchor(
      [...PRESENTATION_SUB_TAB_IDS], MAP_SUB_TAB_CARTOGRAPHY, 'panorama',
      'the presentation sub-tab ids',
    );
    // ...and it IS in the sub-tab vocabulary, so the two absences above measure a
    // seat decision rather than an id that was never declared at all.
    expect([...MAP_SUB_TAB_IDS]).toContain(MAP_SUB_TAB_CARTOGRAPHY);
    expect(isPresentationSubTab(MAP_SUB_TAB_CARTOGRAPHY)).toBe(false);
    expect(presentationViewFor(MAP_SUB_TAB_CARTOGRAPHY)).toBe(null);
    // The anchor for that null: a real presentation still answers with its view.
    expect(presentationViewFor('panorama')).toBe('panorama');
  });

  test('every declared id carries a reader-facing label and an unknown id carries none', () => {
    for (const id of MAP_SUB_TAB_IDS) {
      expect(typeof mapSubTabLabel(id), `label for ${id}`).toBe('string');
    }
    expect(mapSubTabLabel('illustrated')).toBe(null);
    // Prototype keys are not labels — the lookup is own-property guarded.
    expect(mapSubTabLabel('constructor')).toBe(null);
    expect(mapSubTabLabel(null)).toBe(null);
  });

  test('only the three projections are presentations', () => {
    expect(isPresentationSubTab('plan')).toBe(true);
    expect(isPresentationSubTab('panorama')).toBe(true);
    expect(isPresentationSubTab('portrait3d')).toBe(true);
    expect(isPresentationSubTab(MAP_SUB_TAB_PLAYER)).toBe(false);
    expect(isPresentationSubTab('illustrated')).toBe(false);
  });
});

describe('TC-0 — PRESENCE, never a disabled tab (the ai_notes lesson)', () => {
  test('the DM of a saved settlement on a capable machine gets all four', () => {
    const tabs = resolveMapSubTabs({ audience: 'dm', sceneAvailable: true, savedMap: true });
    expect(idsOf(tabs)).toEqual(['plan', 'panorama', 'portrait3d', 'player']);
    // Plan is first and default, permanently (§1, §12).
    expect(tabs[0].id).toBe('plan');
  });

  test('a dark or incapable 3D portrait is ABSENT from the strip, not present and inert', () => {
    const dark = resolveMapSubTabs({ audience: 'dm', sceneAvailable: false, savedMap: true });
    // Non-vacuous: the strip is really being built, the siblings are really there.
    expect(idsOf(dark)).toEqual(['plan', 'panorama', 'player']);
    const lit = resolveMapSubTabs({ audience: 'dm', sceneAvailable: true, savedMap: true });
    expect(idsOf(lit)).toContain('portrait3d');
  });

  test('a visitor and an unsaved draft have no Player View tab', () => {
    // A player/public viewer IS the player view; offering them a projection of
    // themselves is noise, and a draft has no saved fog session to project.
    expect(idsOf(resolveMapSubTabs({ audience: 'player', sceneAvailable: true, savedMap: true })))
      .toEqual(['plan', 'panorama', 'portrait3d']);
    expect(idsOf(resolveMapSubTabs({ audience: 'public', sceneAvailable: false, savedMap: true })))
      .toEqual(['plan', 'panorama']);
    expect(idsOf(resolveMapSubTabs({ audience: 'dm', sceneAvailable: false, savedMap: false })))
      .toEqual(['plan', 'panorama']);
  });

  test('the two plan projections are unconditional, and the result is frozen', () => {
    const tabs = resolveMapSubTabs();
    expect(idsOf(tabs)).toEqual(['plan', 'panorama']);
    expect(Object.isFrozen(tabs)).toBe(true);
    expect(Object.isFrozen(tabs[0])).toBe(true);
  });

  test('TC-5b-ii — cartography is present only when the BLOCK is, and it sits LAST', () => {
    // CR-TC5B-3: the fact is the block's availability, never the flag. A lit world
    // whose compile produced nothing has no sheet, and a tab whose content cannot
    // exist is ABSENT rather than present and inert.
    expect(idsOf(resolveMapSubTabs({
      audience: 'dm', sceneAvailable: true, savedMap: true, cartographyAvailable: true,
    }))).toEqual(['plan', 'panorama', 'portrait3d', 'player', 'cartography']);
    expect(idsOf(resolveMapSubTabs({
      audience: 'dm', sceneAvailable: true, savedMap: true, cartographyAvailable: false,
    }))).toEqual(['plan', 'panorama', 'portrait3d', 'player']);
    // The gate is independent of every other gate: a visitor on a dark machine with
    // no save still gets the sheet when there IS one.
    expect(idsOf(resolveMapSubTabs({ audience: 'public', cartographyAvailable: true })))
      .toEqual(['plan', 'panorama', 'cartography']);
    // ...and an omitted input defaults to absent, so no existing caller gains a tab.
    expect(idsOf(resolveMapSubTabs({ audience: 'dm', savedMap: true })))
      .toEqual(['plan', 'panorama', 'player']);
  });

  test('TC-5b-ii — a deep link may address the sheet, and its label is chrome', () => {
    expect(readMapSubTabParam('?mapview=cartography')).toBe('cartography');
    expect(mapSubTabLabel('cartography')).toBe('Cartography');
    // D-2's live bonus: `illustrated` is a paid-adjacent LENS id, never this tab's.
    expect(readMapSubTabParam('?mapview=illustrated')).toBe(null);
  });
});

describe('TC-0 — portrait selectability has exactly ONE spelling', () => {
  test('the flag and the probed capability must BOTH hold', () => {
    expect(townSceneSelectable(true, { available: true })).toBe(true);
    expect(townSceneSelectable(false, { available: true })).toBe(false);
    expect(townSceneSelectable(true, { available: false })).toBe(false);
    expect(townSceneSelectable(true, null)).toBe(false);
    expect(townSceneSelectable(undefined, undefined)).toBe(false);
  });
});

describe('TC-0 — a stale or unknown sub-tab falls back gracefully', () => {
  const present = resolveMapSubTabs({ audience: 'dm', sceneAvailable: false, savedMap: true });

  test('a present id survives untouched', () => {
    expect(normalizeMapSubTab('panorama', present)).toBe('panorama');
    expect(normalizeMapSubTab('player', present)).toBe('player');
  });

  test('an id that is gated OFF this surface lands on the first present tab', () => {
    // The exact stale-deep-link case: a link minted on a WebGL machine, opened on
    // one without. Never an empty panel.
    expect(normalizeMapSubTab('portrait3d', present)).toBe('plan');
  });

  test('unknown, retired, and non-string values all land on the first present tab', () => {
    expect(normalizeMapSubTab('illustrated', present)).toBe('plan');
    expect(normalizeMapSubTab('', present)).toBe('plan');
    expect(normalizeMapSubTab(null, present)).toBe('plan');
    expect(normalizeMapSubTab(7, present)).toBe('plan');
    expect(normalizeMapSubTab({ id: 'panorama' }, present)).toBe('plan');
  });

  test('TOTALITY GUARD: an empty present set yields null rather than an absent id', () => {
    // Not a product state — resolveMapSubTabs always seats the two plan
    // projections — but a future gate must not be able to make this return an id
    // that is not on the strip.
    expect(normalizeMapSubTab('plan', [])).toBe(null);
    expect(normalizeMapSubTab('plan', null)).toBe(null);
  });
});

describe('TC-0 — the deep link', () => {
  test('a declared id is read out of the search string, with or without the leading ?', () => {
    expect(readMapSubTabParam(`?${MAP_SUB_TAB_PARAM}=portrait3d`)).toBe('portrait3d');
    expect(readMapSubTabParam(`${MAP_SUB_TAB_PARAM}=player`)).toBe('player');
    expect(readMapSubTabParam(`?tab=faq&${MAP_SUB_TAB_PARAM}=panorama`)).toBe('panorama');
  });

  test('an undeclared, absent, or unparseable link asks for nothing at all', () => {
    // null (not 'plan') is deliberate: "the link named nothing" and "the link named
    // Plan" are different facts, and only the second should beat a stored preference.
    expect(readMapSubTabParam(`?${MAP_SUB_TAB_PARAM}=illustrated`)).toBe(null);
    expect(readMapSubTabParam('?other=plan')).toBe(null);
    expect(readMapSubTabParam('')).toBe(null);
    expect(readMapSubTabParam(null)).toBe(null);
    expect(readMapSubTabParam(undefined)).toBe(null);
  });
});

describe('TC-0 — only a presentation is mirrored into the living-backdrop sidecar', () => {
  test('each presentation maps to its own persisted view id', () => {
    expect(presentationViewFor('plan')).toBe('plan');
    expect(presentationViewFor('panorama')).toBe('panorama');
    expect(presentationViewFor('portrait3d')).toBe('portrait3d');
  });

  test('the player projection maps to NOTHING rather than silently to the plan', () => {
    // normalizeTownMapView('player') answers 'plan'. Writing that would record a
    // view the reader never chose, and the backdrop would then wash the wrong
    // composition behind the dossier.
    expect(presentationViewFor(MAP_SUB_TAB_PLAYER)).toBe(null);
    expect(presentationViewFor('illustrated')).toBe(null);
    expect(presentationViewFor(null)).toBe(null);
  });
});
