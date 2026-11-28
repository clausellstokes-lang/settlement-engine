/** @vitest-environment jsdom */
/**
 * defenseForceCardDesc.test.jsx — SURVEY S-A-4 (2), the chair's ruling: ONE READER FOR A HOUSE's DESCRIPTION. The Defense
 * tab's force cards printed `defenseProfile.institutions.<kind>[].desc` raw while the Institutions tab re-answered the same
 * line. Planted (the independent reader's plant): C:dp-town-0 with its walls and gates taken off the roster; the watch's
 * line must read the same on both tabs, and on the PDF's Defense chapter.
 */
import React from 'react';
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import TOWNS from '../fixtures/surveyFinalTowns.json';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { institutionDescription } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { printRecordOf } from '../../src/domain/display/printRecord.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';

afterEach(() => cleanup());

describe('S-A-4 (2): the Defense tab prints a house\'s description through the one reader', () => {
  /** @type {any} */ let planted; /** @type {any} */ let watch;
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    const row = TOWNS.find((t) => t.plan === 'C' && t.seed === 'dp-town-0');
    const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const town = withPublicProse(born, composePublicProse(born));
    const off = (i) => /wall|gate|palisade/i.test(String(i?.name));
    planted = { ...town, institutions: town.institutions.filter((i) => !off(i)) };
    watch = (planted.defenseProfile?.institutions?.watch || [])[0];
  }, 120000);

  it('NOT VACUOUS: the planted town keeps a watch whose stored line names the gates, and the roster no longer holds them', () => {
    expect(watch, 'a watch in the defence profile').toBeTruthy();
    expect(watch.desc).toMatch(/gates/);
    expect(planted.institutions.some((i) => /wall|gate/i.test(String(i.name)))).toBe(false);
  });

  it('the force card prints the line the Institutions tab prints for the same house', () => {
    const roster = planted.institutions.find((i) => i.name === watch.name) || watch;
    const line = institutionDescription(roster, planted, { audience: 'owner' });
    expect(line).not.toBe(watch.desc.trim()); // anchored: NOT VACUOUS above shows the stored line names the gates the roster lacks
    const { container, unmount } = render(<DefenseTab settlement={planted} narrativeNote={null} />);
    const text = container.textContent || '';
    unmount();
    expect(text).toContain(line);
  });

  it('the PDF\'s Defense chapter (handed the gated record) prints the same line', () => {
    const roster = planted.institutions.find((i) => i.name === watch.name) || watch;
    const line = institutionDescription(roster, planted, { audience: 'owner' });
    const vm = buildViewModel({ settlement: printRecordOf(planted) });
    const watchRows = vm.defense?.institutions?.watch || [];
    expect(watchRows.map((w) => String(w.desc || '').trim())).toContain(line);
  });
});
