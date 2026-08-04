/**
 * sovereigntyBundleWr10.test.js — WR-10c: THE BUNDLE, THE CLEARING RULE, AND THE
 * TR-5 GRACEFUL-DEGRADATION CONTRACT MADE MECHANICAL.
 *
 * Both volumes declare the degradation ("until TR-5 lands, WR-10's bundle composes
 * streams/stores/allyship/settlements[/peace] only") and NEITHER pinned it. Section D
 * below is that pin set, and it is built so that its FAILURE is a message rather than
 * a defect: when GR-3 mints the trade-rights catalog rows, these tests go red and the
 * red says "widen the bundle and delete this arm".
 *
 * THE ABSENCE SCAN STRIPS COMMENTS FIRST, and that is not fussiness. This wave's own
 * modules legitimately NAME the three absent terms in their headers — explaining what
 * is missing is the whole point of a degradation note — and a raw scan would count the
 * explanation as the offence. The `envoyK3BeliefSeam` `code()` helper documents this
 * exact trap; the scan below inherits it and carries its own guard-the-guard.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  bundleComponentFamilies, catalogGrewSinceWr10, valueBundleThroughNeeds,
  clearSovereigntyTrade, SOVEREIGNTY_TRADE_VERDICTS,
  SOVEREIGNTY_NON_CATALOG_COMPONENTS, WR10_FAMILIES_AT_LANDING,
} from '../../src/domain/worldPulse/sovereigntyBundle.js';
import { TERM_FAMILIES } from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { appraiseSettlementAsset } from '../../src/domain/worldPulse/sovereigntyAppraisal.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** Source with every comment stripped — see the header. */
const code = (rel) => readFileSync(join(ROOT, rel), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

function walkJs(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkJs(p, out);
    else if (/\.(?:js|jsx)$/.test(entry)) out.push(p);
  }
  return out;
}

// ── FIXTURES ─────────────────────────────────────────────────────────────────

const sellerSees = (over = {}) => appraiseSettlementAsset({
  assetId: 'greenhollow', appraiserId: 'ironvale',
  tierBand: 'village', storesBand: 'thin', routeBand: 'stirring', trajectoryBand: 'steady',
  ...over,
});
const buyerSees = (over = {}) => appraiseSettlementAsset({
  assetId: 'greenhollow', appraiserId: 'saltmarch',
  tierBand: 'town', storesBand: 'stocked', routeBand: 'steady', trajectoryBand: 'growing',
  ...over,
});

/** The degraded bundle: streams (economic), allyship (relational), peace. */
const DEGRADED_BUNDLE = Object.freeze([
  { family: 'economic', magnitude01: 0.4 },
  { family: 'relational', magnitude01: 0.3 },
  { family: 'peace', magnitude01: 0.2 },
]);

const trade = ({ components, sellerNeeds, buyerNeeds, seller = sellerSees(), buyer = buyerSees() }) =>
  clearSovereigntyTrade({
    assetId: 'greenhollow',
    sellerAppraisal: seller,
    buyerAppraisal: buyer,
    sellerValuation: valueBundleThroughNeeds({ partyId: 'ironvale', components, needs: sellerNeeds }),
    buyerValuation: valueBundleThroughNeeds({ partyId: 'saltmarch', components, needs: buyerNeeds }),
  });

// ── A) THE CLEARING RULE ─────────────────────────────────────────────────────

describe('WR-10c — the reconciled two-sided conjunction', () => {
  it('CLEARS when the seller\'s reserve is met AND the buyer stays under its ceiling', () => {
    const out = trade({
      components: DEGRADED_BUNDLE,
      sellerNeeds: { economic: 0.9, relational: 0.3, peace: 0.5 },
      buyerNeeds: { economic: 0.5, relational: 0.6, peace: 0.4 },
    });
    expect(out.verdict).toBe('cleared');
    expect(out.cleared).toBe(true);
    expect(out.reserveMet).toBe(true);
    expect(out.withinCeiling).toBe(true);
    expect(out.sellerSees01).toBeGreaterThanOrEqual(Number(out.reserve01));
    expect(out.ceiling01).toBeGreaterThanOrEqual(Number(out.buyerSpends01));
  });

  it('CEILING REACHED BEFORE RESERVE MET is a named outcome carrying a receipt (whitePeace precedent)', () => {
    const out = trade({
      components: [
        { family: 'economic', magnitude01: 0.9 },
        { family: 'relational', magnitude01: 0.8 },
        { family: 'peace', magnitude01: 0.7 },
      ],
      sellerNeeds: { economic: 0.9, relational: 0.9, peace: 0.9 },
      buyerNeeds: { economic: 0.95, relational: 0.9, peace: 0.9 },
    });
    expect(out.verdict).toBe('ceiling_reached');
    expect(out.cleared).toBe(false);
    expect(out.reserveMet, 'arm (i) passed — it is arm (ii) that failed').toBe(true);
    expect(out.withinCeiling).toBe(false);
    expect(out.receipt).toContain('ceiling was reached before the reserve was met');
    // The machinery RAN and produced nothing: the numbers are all present.
    expect(out.reserve01).not.toBe(null); // anchored: the verdict is asserted to be a priced one ('ceiling_reached', not 'unpriced') three lines above, so this cannot pass on an unpriced read
    expect(out.buyerSpends01).toBeGreaterThan(Number(out.ceiling01));
  });

  it('RESERVE UNMET is the other named no-trade: a seller who will not sell that cheap', () => {
    const out = trade({
      components: [{ family: 'economic', magnitude01: 0.1 }],
      sellerNeeds: { economic: 0.9 },
      buyerNeeds: { economic: 0.5 },
    });
    expect(out.verdict).toBe('reserve_unmet');
    expect(out.reserveMet).toBe(false);
    expect(out.withinCeiling, 'the buyer could afford it — the seller would not take it').toBe(true);
    expect(out.receipt).toContain('does not reach what the town is worth');
  });

  it('every verdict it can produce is a member of the closed vocabulary', () => {
    const cases = [
      trade({ components: DEGRADED_BUNDLE, sellerNeeds: { economic: 0.9, relational: 0.3, peace: 0.5 }, buyerNeeds: { economic: 0.5, relational: 0.6, peace: 0.4 } }),
      trade({ components: [{ family: 'economic', magnitude01: 0.1 }], sellerNeeds: { economic: 0.9 }, buyerNeeds: { economic: 0.5 } }),
      trade({ components: DEGRADED_BUNDLE, sellerNeeds: { economic: 1 }, buyerNeeds: { economic: 1, relational: 1, peace: 1 }, buyer: buyerSees({ tierBand: 'thorp', storesBand: 'bare', routeBand: 'none', trajectoryBand: 'emptying' }) }),
      trade({ components: DEGRADED_BUNDLE, sellerNeeds: {}, buyerNeeds: {}, seller: sellerSees({ trajectoryBand: 'unknown' }) }),
    ];
    expect(new Set(cases.map((c) => c.verdict)).size).toBeGreaterThan(1); // non-vacuity
    for (const c of cases) expect(SOVEREIGNTY_TRADE_VERDICTS).toContain(c.verdict);
  });

  it('an UNPRICED side yields no trade and no invented numbers', () => {
    const out = trade({
      components: DEGRADED_BUNDLE, sellerNeeds: {}, buyerNeeds: {},
      seller: sellerSees({ trajectoryBand: 'unknown' }),
    });
    expect(out.verdict).toBe('unpriced');
    expect(out.reserve01).toBe(null);
    expect(out.ceiling01).toBe(null);
    expect(out.reserveMet).toBe(null);
  });
});

// ── B) THE SPEC'S TWO NAMED VALUE PINS ───────────────────────────────────────

describe('WR-10c — amendment S\'s named valuation pins', () => {
  it('THE VALUE-MATCHING EXAMPLE: a high-value town clears against settlement+allyship, never the lone settlement', () => {
    const rich = { tierBand: 'city', storesBand: 'deep', routeBand: 'established', trajectoryBand: 'growing' };
    const seller = sellerSees(rich);
    const buyer = buyerSees({ tierBand: 'metropolis', storesBand: 'deep', routeBand: 'established', trajectoryBand: 'swelling' });
    const sellerNeeds = { sovereignty_transfer: 0.9, relational: 0.35 };
    const buyerNeeds = { sovereignty_transfer: 0.8, relational: 0.3 };

    const lone = trade({
      components: [{ family: 'sovereignty_transfer', magnitude01: 0.85 }],
      sellerNeeds, buyerNeeds, seller, buyer,
    });
    const paired = trade({
      components: [
        { family: 'sovereignty_transfer', magnitude01: 0.85 },
        { family: 'relational', magnitude01: 0.5 },
      ],
      sellerNeeds, buyerNeeds, seller, buyer,
    });
    expect(lone.verdict).toBe('reserve_unmet');
    expect(paired.verdict).toBe('cleared');
    // BOTH APPRAISALS RECEIPTED, as the spec demands of this fixture specifically.
    expect(seller.receipt).toContain('ironvale');
    expect(buyer.receipt).toContain('saltmarch');
    expect(paired.receipt).toContain('relational');
    expect(paired.receipt).toContain('sovereignty_transfer');
  });

  it('THE INAPPROPRIATE COMPONENT: a component the seller\'s needs value at ~zero contributes ~zero', () => {
    const withoutIt = valueBundleThroughNeeds({
      partyId: 'ironvale', components: [{ family: 'economic', magnitude01: 0.5 }],
      needs: { economic: 0.8, informational: 0 },
    });
    const withIt = valueBundleThroughNeeds({
      partyId: 'ironvale',
      components: [{ family: 'economic', magnitude01: 0.5 }, { family: 'informational', magnitude01: 1 }],
      needs: { economic: 0.8, informational: 0 },
    });
    expect(withIt.total01).toBe(withoutIt.total01);
    // ...and it is APPROPRIATENESS, not a rule table: the SAME component carries the
    // deal for a court that needs it. Emergent from need-weighting, exactly as specced.
    const wanted = valueBundleThroughNeeds({
      partyId: 'saltmarch',
      components: [{ family: 'economic', magnitude01: 0.5 }, { family: 'informational', magnitude01: 1 }],
      needs: { economic: 0.8, informational: 0.9 },
    });
    expect(wanted.total01).toBeGreaterThan(Number(withIt.total01));
  });

  it('an unstated need is not a measured refusal — absent and zero are different numbers', () => {
    const unstated = valueBundleThroughNeeds({
      partyId: 'ironvale', components: [{ family: 'economic', magnitude01: 1 }], needs: {},
    });
    const refused = valueBundleThroughNeeds({
      partyId: 'ironvale', components: [{ family: 'economic', magnitude01: 1 }], needs: { economic: 0 },
    });
    expect(unstated.total01).toBeGreaterThan(Number(refused.total01));
    expect(unstated.offered[0].needStated).toBe(false);
    expect(refused.offered[0].needStated).toBe(true);
  });
});

// ── C) K4 + PURITY ───────────────────────────────────────────────────────────

describe('WR-10c — K4: four numbers, compared and never merged', () => {
  it('the clearing carries BOTH sides\' numbers separately and forms no third', () => {
    const out = trade({
      components: DEGRADED_BUNDLE,
      sellerNeeds: { economic: 0.9, relational: 0.3, peace: 0.5 },
      buyerNeeds: { economic: 0.5, relational: 0.6, peace: 0.4 },
    });
    expect(out.reserve01).not.toBe(out.ceiling01); // anchored: both are asserted finite numbers by the cleared verdict's arithmetic below, so this cannot pass on two nulls
    expect(Number.isFinite(Number(out.reserve01))).toBe(true);
    expect(Number.isFinite(Number(out.ceiling01))).toBe(true);
    expect(out.sellerSees01).not.toBe(out.buyerSpends01);
    // No averaged field exists anywhere on the result.
    expect(Object.keys(out).some((k) => /mean|average|merged|combined/i.test(k))).toBe(false);
  });

  it('PURE: same input ⇒ deep-equal output, inputs untouched', () => {
    const components = DEGRADED_BUNDLE.map((c) => ({ ...c }));
    const before = JSON.parse(JSON.stringify(components));
    const a = valueBundleThroughNeeds({ partyId: 'ironvale', components, needs: { economic: 0.5 } });
    const b = valueBundleThroughNeeds({ partyId: 'ironvale', components, needs: { economic: 0.5 } });
    expect(a).toEqual(b);
    expect(components).toEqual(before);
  });
});

// ── D) THE TR-5 GRACEFUL-DEGRADATION CONTRACT ────────────────────────────────

describe('WR-10c — TR-5 graceful degradation, pinned in both directions', () => {
  it('PIN 1 — the component family set IS the derived catalog (identity), plus the named riders', () => {
    const expected = [...new Set([...TERM_FAMILIES, ...SOVEREIGNTY_NON_CATALOG_COMPONENTS])].sort();
    expect([...bundleComponentFamilies()]).toEqual(expected);
    // ...and the derivation is what makes it identity rather than a stale copy: a
    // HARDCODED list (the failure mode this pin exists to forbid) is caught the moment
    // the catalog moves. This is the executed mutant for the identity claim.
    const staleHardcodedList = ['economic', 'relational', 'security'];
    expect([...bundleComponentFamilies()]).not.toEqual(staleHardcodedList); // anchored: the identity assertion two lines above proves the live set is the full derived catalog, so this cannot pass by the function returning nothing
    expect(bundleComponentFamilies().length).toBeGreaterThan(staleHardcodedList.length);
  });

  it('PIN 1b — THE TRIPWIRE: the catalog has NOT grown since WR-10 landed', () => {
    // WHEN THIS GOES RED IT IS AN INSTRUCTION, NOT A DEFECT: a new term family landed
    // (GR-3's trade-rights rows, most likely). Re-read the degradation note in
    // sovereigntyBundle.js, widen WR10_FAMILIES_AT_LANDING, and delete the degraded arm.
    expect(catalogGrewSinceWr10()).toBe(false);
    expect([...TERM_FAMILIES].sort()).toEqual([...WR10_FAMILIES_AT_LANDING].sort());
    expect(WR10_FAMILIES_AT_LANDING.length).toBeGreaterThan(0); // non-vacuity
  });

  it('PIN 2 — NO trade-rights literal is spelled in src/, and the same scan FINDS one that exists', () => {
    const FORBIDDEN = ['trade_exclusivity', 'market_access', 'toll_exemption',
      'tradeExclusivity', 'marketAccess', 'tollExemption'];
    const files = walkJs(join(ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100); // the scan really walked a tree

    /** @param {string} body @returns {string[]} */
    const hits = (body) => FORBIDDEN.filter((token) => body.includes(token));
    const offenders = [];
    for (const file of files) {
      const found = hits(code(file.slice(ROOT.length + 1)));
      if (found.length) offenders.push(`${file}: ${found.join(',')}`);
    }
    expect(offenders).toEqual([]);

    // GUARD-THE-GUARD. A scan that silently stopped matching would pass as compliance,
    // so the identical predicate must FIND a token that genuinely is in the tree...
    expect(code('src/domain/worldPulse/peaceTermsCatalog.js').includes('tribute')).toBe(true);
    // ...and must FIND a forbidden token when one is actually present (executed mutant).
    expect(hits('const x = { trade_exclusivity: 1 };')).toEqual(['trade_exclusivity']);
    expect(hits('const y = { tollExemption: 1 };')).toEqual(['tollExemption']);

    // COMMENT-STRIPPING IS LOAD-BEARING AND PROVED: this wave's own header names the
    // three absent components in prose, and the raw file therefore mentions them while
    // the stripped code does not. A scan without the strip would indict the explanation.
    const raw = readFileSync(join(ROOT, 'src/domain/worldPulse/sovereigntyBundle.js'), 'utf8');
    expect(raw).toContain('exclusivity');
    expect(code('src/domain/worldPulse/sovereigntyBundle.js')).not.toContain('exclusivity'); // anchored: the line directly above proves the raw file DOES contain the word, so this cannot pass by the file being unreadable or empty
  });

  it('PIN 3 — the DEGRADED arm is a LIVE arm: a bundle clears on the families that exist', () => {
    const out = trade({
      components: DEGRADED_BUNDLE,
      sellerNeeds: { economic: 0.9, relational: 0.3, peace: 0.5 },
      buyerNeeds: { economic: 0.5, relational: 0.6, peace: 0.4 },
    });
    expect(out.verdict).toBe('cleared');
    // The receipt names WHICH components it had — absent reads as absent, never zero.
    expect([...out.componentsHad]).toEqual(['economic', 'peace', 'relational']);
    expect(out.receipt).toContain('economic, peace, relational');
    expect(out.componentsAvailable.length).toBe(bundleComponentFamilies().length);
    expect(out.componentsHad.length).toBeLessThan(out.componentsAvailable.length);
  });

  it('PIN 3b — a component naming an ABSENT family is DROPPED and SAID, not silently zeroed', () => {
    const valuation = valueBundleThroughNeeds({
      partyId: 'ironvale',
      components: [{ family: 'economic', magnitude01: 0.5 }, { family: 'a_family_that_does_not_exist', magnitude01: 1 }],
      needs: { economic: 0.8 },
    });
    expect(valuation.offered.map((l) => l.family)).toEqual(['economic']);
    expect(valuation.receipt).toContain('could not weigh 1 offered component');
    // The distinction that matters: it was not priced at zero and forgotten.
    expect(valuation.total01).toBe(0.4);
  });

  it('PIN 5 — the trade-rights dimension is an HONEST PERMANENT ZERO with a declared reason', () => {
    // Nothing this wave publishes reports a trade-rights contribution at all: the
    // families simply are not in the derived set. Recorded as an explicit absence so a
    // later soak cannot read an unbuilt dependency as a bad band.
    const available = bundleComponentFamilies();
    expect(available.length).toBe(TERM_FAMILIES.length + SOVEREIGNTY_NON_CATALOG_COMPONENTS.length);
    expect(catalogGrewSinceWr10()).toBe(false);
  });

  it('PIN 6 — the two volumes\' degradation notes diverge by EXACTLY `peace`, and by nothing else', () => {
    // THE STRUCTURAL CURE for a class that has bitten once. The volumes call these
    // notes twins; they are not twins. This pin records the KNOWN divergence exactly
    // and catches any NEW one — and when the chair reconciles the two sentences it
    // tightens to a plain equality.
    const flat = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/\s+/g, ' ');
    const listOf = (rel) => {
      const m = /bundle composes ([a-z/ ]+?) only/.exec(flat(rel));
      return m ? m[1].replace(/\s+/g, '').split('/').filter(Boolean) : [];
    };
    const war = listOf('docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md');
    const trade = listOf('docs/DESIGN_FP_TRADE.md');
    expect(war.length, 'the war volume states a degraded list').toBeGreaterThan(0);
    expect(trade.length, 'the trade volume states a degraded list').toBeGreaterThan(0);
    expect(war).toEqual(['streams', 'stores', 'allyship', 'settlements', 'peace']);
    expect(trade).toEqual(['streams', 'stores', 'allyship', 'settlements']);
    expect(war.filter((x) => !trade.includes(x)), 'the ONLY divergence').toEqual(['peace']);
    expect(trade.filter((x) => !war.includes(x)), 'and nothing runs the other way').toEqual([]);
    // This module follows its OWN volume, so `peace` is a component here.
    expect([...SOVEREIGNTY_NON_CATALOG_COMPONENTS]).toEqual(['peace']);
    expect(bundleComponentFamilies()).toContain('peace');
  });
});
