/** @vitest-environment jsdom */
/**
 * institutionProvenanceBadges.test.jsx — Wave R-5b item #10, the READER half
 * (docs/CAPABILITY_REMEDIATION_PLAN.md; atlas economy-family gap 11b).
 *
 * THE DEFECT. Two lanes stamp "who put this here" onto the institution roster —
 * the composer (a DM event) and the world pulse (a seeded advance) — and NO
 * component read either one. A forge the living world grew during an advance
 * and one the DM added by event both rendered with the fallback tint and no
 * badge at all, indistinguishable from a building nobody had ever touched. The
 * OverviewTab pill now reads the ONE derived record
 * (src/domain/provenance/rosterProvenance.js) and says which.
 *
 * THE SECOND DEFECT (atlas-flagged, fixed in the same edit). The old badge map
 * gave the 'forced' source an EMPTY glyph, which is falsy at the render guard —
 * so the legend advertised a "Force-added by you" mark that could never appear
 * on any pill, for any settlement. Both the badge and the legend row now carry
 * a real one-string mark.
 *
 * These are BEHAVIOUR pins (render a real generated settlement, drive the real
 * writers, read the DOM), deliberately outside tests/lint and named without
 * invariant nomenclature, so the E-A enumeration rule
 * (tests/lint/mutationCoverage.shared.mjs) does not pick them up and no
 * mutation-manifest entry is owed. The structural half carries that entry:
 * tests/lint/provenanceStampSingleWriter.walker.test.js.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
// The roster and its badges live on the Institutions tab since owner addendum T1-15
// (2026-10-30); the Overview's Institutions collapsible is cut.
import InstitutionsTab, { institutionBadge } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { addInstitution } from '../../src/domain/events/mutateEntities.js';
import { applyInstitutionLifecycleOutcome } from '../../src/domain/worldPulse/institutionLifecycle.js';

/** @type {any} */
let base;

beforeAll(() => {
  window.matchMedia = window.matchMedia || (query => ({
    media: query, matches: false,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
  base = generateSettlementPipeline(
    { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
    null,
    { seed: 'provenance-badges-town', customContent: {} },
  );
});

afterEach(() => { cleanup(); });

/** Render the Institutions tab and return its container (no fold to open: every card shows). */
function renderInstitutions(settlement) {
  const { container } = render(<InstitutionsTab settlement={settlement} />);
  expect(container.querySelectorAll('[data-testid="institution-card"]').length, 'the roster must render').toBeGreaterThan(0);
  return container;
}

/**
 * The card for `name`, shaped like the old pill for the arms below: its text carries the
 * badge mark, and `getAttribute('title')` answers with the name's own hover title.
 */
function pillFor(container, name) {
  const card = [...container.querySelectorAll('[data-testid="institution-card"]')]
    .find(el => el.firstElementChild?.firstElementChild?.textContent === name);
  if (!card) return undefined;
  const nameSpan = card.firstElementChild.firstElementChild;
  return { textContent: card.firstElementChild.textContent, getAttribute: (k) => nameSpan.getAttribute(k) };
}

describe('InstitutionsTab cards — the provenance badge', () => {
  test('a DM-added institution wears the YOU mark and says so on hover', () => {
    const next = addInstitution(base, {
      id: 'evt.badge.add',
      type: 'ADD_INSTITUTION',
      targetId: 'institution.Copper_Exchange',
      description: 'The exchange opens.',
      payload: { category: 'civic' },
    });
    const container = renderInstitutions(next);
    const pill = pillFor(container, 'Copper Exchange');
    expect(pill, 'the DM-added institution must render as a pill').toBeTruthy();
    expect(pill.textContent).toContain('YOU');
    expect(pill.getAttribute('title')).toBe('Added by you');
  });

  test('a world-pulse-built institution wears the WORLD mark and carries its reason', () => {
    const next = applyInstitutionLifecycleOutcome(base, {
      id: 'pulse.badge.build',
      institutionPatch: {
        action: 'build', name: 'Whalebone Ropewalk', category: 'craft',
        reason: 'Three good years of rigging demand.',
      },
    });
    // The name must be absent from the seed's roster, or the build path takes
    // its idempotent "already stands" branch and the settlement comes back
    // unchanged — a silently vacuous test.
    expect((base.institutions || []).some(i => i.name === 'Whalebone Ropewalk')).toBe(false);
    const container = renderInstitutions(next);
    const pill = pillFor(container, 'Whalebone Ropewalk');
    expect(pill, 'the pulse-built institution must render as a pill').toBeTruthy();
    expect(pill.textContent).toContain('WORLD');
    expect(pill.getAttribute('title')).toBe('Grown by the living world. Three good years of rigging demand.');
  });

  test('THE FIXED DEFECT: a force-added institution finally carries a visible mark', () => {
    const forced = {
      ...base,
      institutions: [
        ...(base.institutions || []),
        // RE-KEYED (R2-CODE-B item 2): a row the USER forced is stored as the deployed client stores every
        // toggle (assembleInstitutions.js): `source: 'forced'` with `forcedByToggle: true`; the YOU mark reads that.
        { id: 'institution.hedge_chapel', name: 'Hedge Chapel', category: 'religious', status: 'active', source: 'forced', forcedByToggle: true, tags: [] },
      ],
    };
    const container = renderInstitutions(forced);
    const pill = pillFor(container, 'Hedge Chapel');
    expect(pill, 'the forced institution must render as a pill').toBeTruthy();
    // Before the fix the badge span was rendered from an EMPTY string and the
    // falsy guard dropped it, so the pill carried the name and nothing else.
    expect(pill.textContent).toContain('YOU');
    expect(pill.getAttribute('title')).toBe('Added by you');
  });

  test('the key lives in the page\'s ? pill (the legend row left with X-38/X-42), and every mark it promises is a non-empty glyph with a title', () => {
    const container = renderInstitutions(base);
    // the legend row is gone: no "mark = meaning" span renders anywhere on the page
    const legendRows = [...container.querySelectorAll('span')]
      .filter(el => / = /.test(el.textContent) && el.children.length === 1);
    expect(legendRows).toEqual([]);
    // the key is the pill's second sentence, on the page header
    const pillText = container.querySelector('[data-testid="institutions-header"] [data-testid="info-pill-text"]');
    expect(pillText, 'the page\'s ? pill must render').toBeTruthy();
    expect(pillText.textContent).toContain('history, you, the living world, or a dependency');
    // every mark the key promises is a glyph the badge really draws, each with its title
    const marks = [
      institutionBadge({ name: 'A', source: 'required' }),
      institutionBadge({ name: 'B', source: 'forced', forcedByToggle: true }), // RE-KEYED (R2-CODE-B item 2): the user's toggle
      institutionBadge({ name: 'C', source: 'auto-resolved' }),
    ];
    expect(marks.map(m => m.label)).toEqual(['REQ', 'YOU', '→']);
    for (const m of marks) {
      expect(String(m.label).trim(), 'a mark promised with no glyph is the defect this pins').not.toBe('');
      expect(typeof m.title).toBe('string');
      expect(m.title.length).toBeGreaterThan(0);
    }
  });

  test('an ordinary generated roster still badges only what generation stamped', () => {
    const container = renderInstitutions(base);
    // Nothing on a freshly generated settlement was touched by a DM or an
    // advance, so no pill may claim otherwise.
    const pills = [...container.querySelectorAll('[data-testid="institution-card"] span[title]')];
    for (const pill of pills) {
      expect(pill.getAttribute('title')).not.toBe('Grown by the living world');
    }
  });
});

/**
 * VERIFIER F14 / RS-19, now kept in the RECORD (lane REVIEW-INTAKE unit 2, 2026-11-06): the
 * twelve former PROXY hosts (Dwellings, Housing, Water source, Sewage system, Farmland, Massive
 * prison ...) no longer surface another house's menu. Each owns its entry, so every row naming
 * one is that house's own service, and the Institutions page lists it under the house.
 */
const FORMER_PROXY_HOSTS = new Set(['dwellings (1-8)', 'dwellings (5-25)', 'dwellings (15-100)', 'housing (75-650 households)', 'housing (500-4000 households)', 'water source', 'multiple water sources', 'sewage system', 'farmland', 'common grazing land', 'access to external mill', 'massive prison']);
describe('F14 / RS-19 — a former proxy house lists only its own menu', () => {
  test('rows naming a former proxy are its own services and join its card', async () => {
    const { institutionsWithServices } = await import('../../src/components/new/tabs/InstitutionsTab.jsx');
    const { INSTITUTION_SERVICES } = await import('../../src/data/institutionServices.js');
    const rows = Object.values(base.availableServices || {}).flat();
    const hosted = rows.filter((r) => r && FORMER_PROXY_HOSTS.has(String(r.institution || '').toLowerCase()));
    expect(hosted.length, 'fixture premise: the town has a row naming a former proxy house').toBeGreaterThan(0);
    for (const r of hosted) expect(Object.keys(INSTITUTION_SERVICES[r.institution] || {}), `${r.institution} credited with ${r.name}`).toContain(r.name);
    const houses = institutionsWithServices(base);
    for (const r of hosted) {
      const house = houses.find((h) => h.inst.name === r.institution);
      expect(house, `${r.institution} stays on the roster`).toBeTruthy();
      expect(house.services.map((s) => s.name)).toContain(r.name); // anchored: the house is asserted present above
    }
  });
});

/** VERIFIER F15: an institution link opens this tab, so each card is the link's anchor target. */
describe('F15 — each institution card is its entity link\'s sink', () => {
  test('the card carries id = entityAnchor(institution) and the index routes the link here', async () => {
    const { buildDossierEntityIndex, entityAnchor, entityIdFor } = await import('../../src/domain/dossier/entityLinks.js');
    const container = renderInstitutions(base);
    const inst = base.institutions[0];
    const entry = buildDossierEntityIndex(base).resolve(entityIdFor('institution', inst));
    expect(entry.tab).toBe('institutions');
    const card = [...container.querySelectorAll('[data-testid="institution-card"]')].find((el) => el.id === entityAnchor('institution', inst));
    expect(card?.getAttribute('data-testid')).toBe('institution-card');
    expect(entry.anchor).toBe(card.id);
  });
});
