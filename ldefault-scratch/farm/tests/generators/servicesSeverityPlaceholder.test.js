/**
 * tests/generators/servicesSeverityPlaceholder.test.js
 *
 * The lawless "No law, bring coin" service shipped an un-interpolated template
 * placeholder in user-visible prose: "...whoever can apply more violence or pay
 * more for SEVERITY." The token 'SEVERITY' was a bare literal from the very first
 * commit (never a `${...}` interpolation), so its original intent is unrecoverable
 * from history; the honest reading — reinforced by the sibling "Protection
 * (informal)" service — is "...pay more for protection." All three sites in
 * servicesGenerator.js now render that.
 *
 * Pins: no generated service description ever contains the raw 'SEVERITY' token,
 * and the lawless recourse prose reads the corrected sentence.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// Collect every service description string off a generated settlement.
function serviceDescs(s) {
  const out = [];
  const av = s.availableServices || {};
  for (const k of Object.keys(av)) {
    const v = av[k];
    if (Array.isArray(v)) for (const it of v) if (it && typeof it.desc === 'string') out.push(it.desc);
  }
  return out;
}

// A criminal-heavy / under-policed sweep so the lawless recourse service fires.
const SWEEP = [];
for (const settType of ['village', 'town', 'city', 'metropolis']) {
  for (let i = 0; i < 40; i++) {
    SWEEP.push({
      settType, culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road',
      monsterThreat: 'frontier', priorityCriminal: 95, priorityMilitary: 5,
      _seed: `sev-${settType}-${i}`,
    });
  }
}

describe('services — SEVERITY placeholder is retired', () => {
  it('no generated service description contains the raw SEVERITY placeholder', () => {
    const offenders = [];
    for (const { _seed, ...cfg } of SWEEP) {
      const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
      for (const d of serviceDescs(s)) if (/\bSEVERITY\b/.test(d)) offenders.push(`${_seed}: ${d}`);
    }
    expect(offenders, `SEVERITY placeholder leaked: ${offenders.slice(0, 3).join(' | ')}`).toEqual([]);
  }, 240_000);

  it('the lawless recourse service reads the corrected prose and fires somewhere in the sweep', () => {
    let fired = 0;
    const failures = collectSeedFailures(SWEEP, ({ _seed, ...cfg }) => {
      const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
      const law = serviceDescs(s).find((d) => /no official recourse/i.test(d));
      if (!law) return;
      fired++;
      // The anchor IS the corrected prose: a description that no longer says
      // "pay more for protection." reds on the anchor rather than letting the
      // SEVERITY exclusion pass against a re-worded (or empty) sentence.
      expectAbsentWithAnchor(law, 'SEVERITY', 'pay more for protection.', `seed ${_seed}`);
    });
    expect(fired, 'the lawless recourse service should be produced by at least one config').toBeGreaterThan(0);
    expectNoSeedFailures(failures, 'every lawless recourse description reads the corrected prose');
  }, 240_000);
});
