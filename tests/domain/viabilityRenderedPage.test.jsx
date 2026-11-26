/** @vitest-environment jsdom */
/**
 * viabilityRenderedPage.test.jsx — VIABILITY-TRUE-2 (the tenth chair's G68 on the second reader of 119-C): THE OUTLOOK'S
 * VIABILITY LINE HOLDS TO ITS CLAIM AGAINST THE RENDERED PAGE. THE ORACLE IS THE PAGE'S OWN TEXT, rendered here (the
 * Economics tab's Food Security row; the Overview), never the field the line's gate reads: an oracle that reads the gate's
 * own input proves nothing.
 * (V2) A record with no food record (the shape written before 2026-11-03): the Economics tab falls back to the viability
 * view and still prints pounds brought in ("Production: 31 lbs/day + 1 imported"), and the line said "feeds itself" beside
 * them (soak1k-84 with its food record removed). RED FIRST at 7279e571c.
 */
import React from 'react';
import { beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { birth as soakBirth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

/** The lines that say the place grows its own food (L1 to L5: what the Economics tab's pounds brought in deny). */
const FEEDS_ITSELF = /feeds itself|grows what it eats|What .* eats it grows|Nothing .* needs to get through the year has to come from outside/;
/** The pounds the rendered Economics tab prints as brought in (its Food Security row), 0 where it prints none. @param {any} s */
function poundsPrinted(s) {
  const { container } = render(<EconomicsTab economicState={s.economicState} settlement={s} />);
  const m = /\+\s*([\d,]+)\s*imported/.exec(container.textContent || '');
  cleanup();
  return m ? Number(m[1].replace(/,/g, '')) : 0;
}

beforeAll(async () => { await ensureLaws(); }, 120000);

describe('V2: a record with no food record — the line reads the pounds the tab prints, its fallback included', () => {
  test('soak1k-84, food record removed: the tab prints pounds brought in, and no line says the place feeds itself', () => {
    const s = structuredClone(soakBirth(84).settlement);
    delete s.economicState.foodSecurity.foodRecord;
    expect(poundsPrinted(s)).toBeGreaterThan(0); // not vacuous: the fallback row prints imported pounds
    const summary = String(deriveViability(s).summary);
    expect(summary).toMatch(/VIABLE/);
    expect(summary).not.toMatch(FEEDS_ITSELF);
  }, 120000);
});
