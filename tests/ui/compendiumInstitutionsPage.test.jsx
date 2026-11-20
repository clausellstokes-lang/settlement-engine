/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumInstitutionsPage.test.jsx — the Institutions page shows ALL institutions
 * with their backing, services and flows, each line read from a registry (H7).
 *
 * The owner, 2026-11-10, verbatim: "Abd the institution page should show ALL institutions
 * with their native power backing and services and flows into other institutions. The
 * search bar simply ends up as a filter."
 *
 * Census (measured 2026-11-10 over the 282): backing 282 (institutionBacking.js), services 262
 * (institutionServices.js, exact name: 265 names hold a table, three of them empty — Water source,
 * Multiple water sources, Sewage system — so no line), goods flowed into 153 (the supply-chain registries'
 * outputs; 157 names sit in a chain, four of those chains list no output). A field a registry does not hold prints NO line — pinned on a named silent case.
 * Institution-to-institution flows are not printed (the chains do not order their processing
 * institutions; the census STOP's default).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { institutionFacts } from '../../src/domain/compendium/institutionFacts.js';
import { distinctInstitutions, institutionAnchor } from '../../src/components/compendium/institutionSearchEntries.js';
import { backingRowFor } from '../../src/data/institutionBacking.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';

vi.mock('../../src/store/index.js', () => {
  const state = { getCustomContentCount: () => 0 };
  function useStore(selector) { return selector(state); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => state;
  return { useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

afterEach(cleanup);

describe('H7 — the facts are read from the registries', () => {
  it('the census: backing 282, services 262, goods 153, a size for all', () => {
    const all = distinctInstitutions();
    expect(all).toHaveLength(CD.institutions.distinctNames);
    const facts = all.map((i) => institutionFacts(i));
    expect(facts.filter((f) => f.backing).length).toBe(282);
    expect(facts.filter((f) => f.services).length).toBe(262);
    expect(institutionFacts({ name: 'Water source' }).services).toBeNull(); // an empty table is a silent registry
    expect(facts.filter((f) => f.flowsInto).length).toBe(153);
    expect(facts.filter((f) => f.size).length).toBe(282);
  });

  it('each backing line is the registry row itself: shares sum to one, largest first', () => {
    for (const i of distinctInstitutions()) {
      const f = institutionFacts(i);
      const row = backingRowFor(i.name);
      expect(Object.fromEntries(f.backing.map((b) => [b.archetype, b.share]))).toEqual(row.shares);
      expect(f.backing.reduce((n, b) => n + b.share, 0)).toBeCloseTo(1, 9);
      for (let k = 1; k < f.backing.length; k++) expect(f.backing[k - 1].share).toBeGreaterThanOrEqual(f.backing[k].share);
    }
  });

  it('services are the table’s own keys; a name the table does not hold has none', () => {
    expect(institutionFacts({ name: 'Mill' }).services).toEqual(Object.keys(INSTITUTION_SERVICES.Mill));
    expect(institutionFacts({ name: 'Wayside inn' }).services).toBeNull();
  });

  it('flows into are the outputs of the chains that process through the house', () => {
    const mill = institutionFacts({ name: 'Mill' }).flowsInto;
    for (const g of ['Baked goods', 'Flour and meal', 'bread']) expect(mill).toContain(g);
    expect(institutionFacts({ name: 'Periodic market' }).flowsInto).toBeNull();
  });
});

describe('H7 — the page', () => {
  it('shows ALL institutions, each card carrying exactly the lines its registries hold', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone routeSection="institutions" />);
    const cards = container.querySelectorAll('[id^="inst-"]');
    expect(cards).toHaveLength(282);
    expect(container.textContent).toMatch(/282 institutions/);
    expect(container.textContent.includes('Showing first')).toBe(false);
    const lines = (label) => container.querySelectorAll(`[data-inst-fact="${label}"]`).length;
    expect(lines('Backing')).toBe(282);
    expect(lines('Services')).toBe(262);
    expect(lines('Flows into')).toBe(153);
    expect(lines('Size')).toBe(282);
    // A silent registry prints no line: the Periodic market has no services and no chain output.
    const inn = container.querySelector(`#${institutionAnchor('Periodic market')}`);
    expect([...inn.querySelectorAll('[data-inst-fact]')].map((e) => e.getAttribute('data-inst-fact')))
      .toEqual(['Size', 'Priority slider', 'Backing']);
    // The Mill's card names what its chains turn out.
    const mill = container.querySelector(`#${institutionAnchor('Mill')}`);
    expect(mill.querySelector('[data-inst-fact="Flows into"]').textContent).toContain('Baked goods');
    expect(mill.querySelector('[data-inst-fact="Size"]').textContent).toBe('Size: Village');
    // COMPENDIUM-INSTITUTIONS-2 a2 (the chair: "a card's description is never smaller than its
    // fact lines"): the description's size is at least every fact line's (desktop here; the phone
    // floor lifts the description to 14 px there). The lines are told apart by their label ink.
    const px = (el) => parseFloat(el.style.fontSize);
    const factEl = mill.querySelector('[data-inst-fact]');
    const descEl = factEl.previousElementSibling;
    expect(descEl.textContent.length).toBeGreaterThan(20);
    expect(px(descEl)).toBeGreaterThanOrEqual(px(factEl));
  });
});
