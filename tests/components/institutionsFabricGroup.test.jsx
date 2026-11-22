/** @vitest-environment jsdom */
/**
 * X-46 car 3 — THE FABRIC ON THE INSTITUTIONS TAB (the chair's ruling, 2026-11-04, X46-3 hand-back
 * ruling 3): no Overview fabric line is built. The fabric rows (institutionalCatalog.js ::
 * isFabricInstitution) stay on the Institutions tab, in their own group at the BOTTOM of the
 * list headed "The fabric of the place", without a Backs row; the houses' list above holds houses
 * only. Pinned on a real village seed, rendered.
 */
import React from 'react';
import { describe, it, expect, afterEach, beforeAll, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));

import InstitutionsTab from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { isFabricInstitution } from '../../src/data/institutionalCatalog.js';
import { institutionDisplayName } from '../../src/domain/display/institutionDisplayName.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** @type {any} */
let village;
beforeAll(async () => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
  await loadGenerationLawPayloads();
  village = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'village' }), null, { seed: 'x46-fabric-village-1' });
}, 120_000);
afterEach(() => cleanup());

const labelsIn = (root) => [...(root?.querySelectorAll('[data-testid="institution-card"]') || [])]
  .map((card) => card.querySelector('span')?.textContent);

describe('X-46 car 3 — the fabric of the place, its own group at the foot of the Institutions tab', () => {
  it('the village seed carries fabric rows and houses (the premise of the render below)', () => {
    expect(village.tier).toBe('village');
    // Re-keyed by identity 2026-11-04 (rung-1 pins, unit 1): x46-2 renamed the village Dwellings row
    // "Dwellings (80-180)" → "Dwellings (15-100)" (4ecd7f3, the owner's household column); same row.
    expect(village.institutions.filter(isFabricInstitution).map((i) => i.name).sort()).toEqual(['Dwellings (15-100)', 'Multiple water sources']);
    expect(village.institutions.filter((i) => !isFabricInstitution(i)).length).toBeGreaterThan(4);
  });

  it('lists houses only in the houses\' stack, and the fabric in its own group headed "The fabric of the place", last, with no Backs row', () => {
    const { container } = render(<InstitutionsTab settlement={village} />);
    const stack = container.querySelector('[data-testid="institutions-stack"]');
    const fabric = container.querySelector('[data-testid="institutions-fabric"]');
    expect(fabric).toBeTruthy();
    expect(fabric.querySelector('[data-testid="institutions-fabric-heading"]').textContent).toBe('The fabric of the place');

    const houseLabels = village.institutions.filter((i) => !isFabricInstitution(i)).map(institutionDisplayName).sort();
    const fabricLabels = village.institutions.filter(isFabricInstitution).map(institutionDisplayName).sort();
    expect(labelsIn(stack).sort()).toEqual(houseLabels);
    expect(labelsIn(fabric).sort()).toEqual(fabricLabels);

    // the group sits after the houses
    expect(stack.compareDocumentPosition(fabric) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // no Backs row on a fabric card — anchored: the houses above do carry Backs rows
    expect(stack.querySelectorAll('[data-testid="institution-backs"]').length).toBeGreaterThan(0);
    expect(fabric.querySelectorAll('[data-testid="institution-backs"]').length).toBe(0);
  });

  it('prints no fabric group for a roster with no fabric rows', () => {
    const housesOnly = { ...village, institutions: village.institutions.filter((i) => !isFabricInstitution(i)) };
    const { container } = render(<InstitutionsTab settlement={housesOnly} />);
    expect(container.querySelector('[data-testid="institutions-stack"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="institutions-fabric"]')).toBeNull();
  });
});
