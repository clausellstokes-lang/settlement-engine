/** @vitest-environment jsdom */
/**
 * searchCardAudience.test.jsx — SURVEY S-A-4 (1), the chair's ruling on the independent reader's finding: the dossier
 * search's house card on a SHARED page re-answered a description by the OWNER's rule (roster sets included) while the
 * Institutions tab beside it printed the stored line, and that was a TELL of a hidden house.
 *   V:dp-metropolis-105, a fresh shared page: the tab prints the customs house's "...along the main roads...";
 *   the search card must print the same line, not "...through the port or the main roads...".
 *   C:dp-village-0, its only tavern (the ale house) re-classed Criminal (hidden whole by the default veil): the search card for the
 *   maltster must print one line, hidden or shown.
 * Rendered as the page renders the search (DossierSearchResults, publicDossier, playerView).
 */
import React from 'react';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import TOWNS from '../fixtures/surveyFinalTowns.json';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { galleryPayloadFor, projectShareVeil, writeShareVeil } from '../../src/domain/display/galleryVeil.js';
import DossierSearchResults from '../../src/components/dossier/DossierSearchResults.jsx';
import { institutionDescription } from '../../src/components/new/tabs/InstitutionsTab.jsx';

const partyLink = (record) => projectShareVeil(toPublicSafe(record), writeShareVeil(null, []));
const born = (plan, seed) => {
  const row = TOWNS.find((t) => t.plan === plan && t.seed === seed);
  const town = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
  return withPublicProse(town, composePublicProse(town));
};
/** The text of every search card the shared page draws for a query. */
const searchText = (served, query) => {
  const { container, unmount } = render(
    <DossierSearchResults settlement={served} query={query} tabs={[{ id: 'institutions', label: 'Institutions' }]} publicDossier playerView onOpenTab={() => {}} />,
  );
  const text = container.textContent || '';
  unmount();
  return text;
};

afterEach(() => cleanup());

describe('S-A-4 (1): the search card on a reader\'s page prints the tab\'s line', () => {
  /** @type {any} */ let metro; /** @type {any} */ let village;
  beforeAll(async () => { await loadGenerationLawPayloads(); metro = born('V', 'dp-metropolis-105'); village = born('C', 'dp-village-0'); }, 120000);

  it('V:dp-metropolis-105, a fresh shared page: the customs house card prints the stored line the tab prints', () => {
    const served = partyLink(metro);
    const house = served.institutions.find((i) => i.name === 'Customs house');
    const tab = institutionDescription(house, served, { audience: 'reader' });
    expect(tab).toBe(house.desc.trim()); // the tab: as stored (a docks set)
    const text = searchText(served, 'Customs house');
    expect(text).toContain(tab);
    expect(text).not.toContain('through the port or the main roads'); // anchored: the line above proves the card printed the stored line
  });

  it('C:dp-village-0 planted: its only tavern re-classed Criminal; the maltster\'s card is the same line hidden or shown', () => {
    const tavern = village.institutions.find((i) => /tavern|ale house|alehouse|inn\b/i.test(String(i.name)));
    expect(tavern, 'the village holds a tavern').toBeTruthy();
    const planted = { ...village, institutions: village.institutions.map((i) => (i === tavern ? { ...i, category: 'Criminal' } : i)) };
    const hidden = partyLink(planted);
    const shown = galleryPayloadFor(planted);
    expect(hidden.institutions.some((i) => i.name === tavern.name)).toBe(false); // the default veil hides it whole
    expect(shown.institutions.some((i) => i.name === tavern.name)).toBe(true);
    const maltster = shown.institutions.find((i) => i.name === 'Maltster');
    expect(maltster, 'the village holds a maltster').toBeTruthy();
    const a = searchText(hidden, 'Maltster');
    const b = searchText(shown, 'Maltster');
    expect(a).toContain(maltster.desc.trim());
    expect(b).toContain(maltster.desc.trim());
  });
});
