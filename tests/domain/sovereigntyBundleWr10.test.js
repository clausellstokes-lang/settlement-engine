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
 * ⚠ THAT MESSAGE HAS BEEN DELIVERED AND ACTED ON (GR-3, 2026-08-06), so the sentence
 * above is HISTORY and is kept only because it explains why section D is shaped the way
 * it is. Do not read it as a live prediction. What actually happened: GR-3 minted the
 * three trade-rights rows under a `commercial` family (plus `faith` and `population`),
 * PIN 1b and PIN 5 were re-pointed at the fired position, and PIN 2 was RETARGETED
 * rather than deleted — the thing it protected was never "nobody may spell these words"
 * but "the spelling may not FORK", and that is now stated directly. The bundle itself
 * needed no edit at all, which was the design.
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
import {
  CLASS_TERM, TERM_CATALOG, TERM_FAMILIES, TERM_TYPES,
} from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { appraiseSettlementAsset, sovereigntyValueBand } from '../../src/domain/worldPulse/sovereigntyAppraisal.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

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

/**
 * A DECIMAL IN A SENTENCE — the engine's 0..1 notation, which addendum A-1 forbids in
 * reader prose. Deliberately NOT "any digit": these receipts legitimately name whole
 * counts (`1 offered component(s)`, `of 9 component families`), and both halves of that
 * distinction are executed in the pin below.
 */
const DECIMAL_IN_PROSE = /\d*\.\d+/;

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

  it('EVERY VERDICT\'S RECEIPT SPEAKS BANDS, and the whole counts survive (addendum A-1)', () => {
    // WR-10r's structural half, the behavioural twin of the prose-numerics source scan:
    // the scan sees only the template that exists today, this sees what the composer
    // actually says. All four verdict roads plus a valuation are run, because a leak
    // reintroduced on the branch nobody exercised is exactly how the class returns.
    const cleared = trade({
      components: DEGRADED_BUNDLE,
      sellerNeeds: { economic: 0.9, relational: 0.3, peace: 0.5 },
      buyerNeeds: { economic: 0.5, relational: 0.6, peace: 0.4 },
    });
    const ceiling = trade({
      components: [
        { family: 'economic', magnitude01: 0.9 },
        { family: 'relational', magnitude01: 0.8 },
        { family: 'peace', magnitude01: 0.7 },
      ],
      sellerNeeds: { economic: 0.9, relational: 0.9, peace: 0.9 },
      buyerNeeds: { economic: 0.95, relational: 0.9, peace: 0.9 },
    });
    const unmet = trade({
      components: [{ family: 'economic', magnitude01: 0.1 }],
      sellerNeeds: { economic: 0.9 }, buyerNeeds: { economic: 0.5 },
    });
    const unpriced = trade({
      components: DEGRADED_BUNDLE, sellerNeeds: {}, buyerNeeds: {},
      seller: sellerSees({ trajectoryBand: 'unknown' }),
    });
    const valuation = valueBundleThroughNeeds({
      partyId: 'ironvale',
      components: [{ family: 'economic', magnitude01: 0.5 }, { family: 'a_family_that_does_not_exist', magnitude01: 1 }],
      needs: { economic: 0.8 },
    });
    // Non-vacuity: all four verdict roads really were taken, so the loop is not four
    // copies of one sentence.
    expect(new Set([cleared, ceiling, unmet, unpriced].map((c) => c.verdict)).size).toBe(4);

    for (const read of [cleared, ceiling, unmet, unpriced, valuation]) {
      expect(read.receipt.length, 'a receipt must be a real sentence').toBeGreaterThan(30);
      // anchored: the receipt is asserted to be a non-trivial sentence on the line above,
      // so this absence cannot pass by the composer returning an empty string.
      expect(DECIMAL_IN_PROSE.test(read.receipt), read.receipt).toBe(false);
    }
    // THE COUNTS ARE STILL THERE — the rule bans the engine's notation, not arithmetic
    // the reader can hold up on their fingers.
    expect(valuation.receipt).toContain('could not weigh 1 offered component');
    expect(cleared.receipt).toContain(`of ${cleared.componentsAvailable.length} component families`);
    // GUARD-THE-GUARD (executed mutant): the identical predicate MUST catch the sentence
    // this wave replaced.
    expect(DECIMAL_IN_PROSE.test('ironvale values the bundle at 0.3487 against a reserve of 0.2915.')).toBe(true);

    // AND THE TRANSLATION IS NOT A DELETION: the bands the sentences now carry are the
    // SAME ladder the numeric fields band to, so the prose and the arithmetic agree.
    expect(cleared.receipt).toContain(sovereigntyValueBand(cleared.reserve01).replace(/_/g, ' '));
    expect(ceiling.receipt).toContain(sovereigntyValueBand(ceiling.ceiling01).replace(/_/g, ' '));
    expect(unmet.receipt).toContain(sovereigntyValueBand(unmet.reserve01).replace(/_/g, ' '));
    expect(valuation.receipt).toContain(sovereigntyValueBand(valuation.total01).replace(/_/g, ' '));
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

  it('PIN 1b — THE TRIPWIRE HAS FIRED AND BEEN DISCHARGED (GR-3, 2026-08-06)', () => {
    // THIS PIN USED TO ASSERT `false`, AND ITS RED WAS THE INSTRUCTION. GR-3 delivered
    // the message: the catalog gained `commercial` (the trade-rights rows WR-10's bundle
    // names), plus `faith` and `population`. The instruction has been carried out — the
    // degradation note in sovereigntyBundle.js is re-read and re-written, and the arm is
    // NARROWED rather than deleted because TR-5 still owes the executors. So the wire is
    // now asserted in its FIRED position, which is the only honest state for it.
    expect(catalogGrewSinceWr10()).toBe(true);
    // ...and it fired for the reason claimed, not for some other family drifting in. The
    // grown-past set is named EXACTLY, so a fourth family arriving reds here rather than
    // being absorbed by a `true` that had stopped meaning anything.
    const grown = TERM_FAMILIES.filter((family) => !WR10_FAMILIES_AT_LANDING.includes(family));
    expect([...grown].sort()).toEqual(['commercial', 'faith', 'population']);
    // THE LANDING RECORD IS STILL THE LANDING RECORD. It is deliberately NOT widened —
    // its own docstring calls it a record and not a policy, and widening it would erase
    // the fact this pin exists to preserve. Every WR-10-era family is still in the live
    // catalog (a family DELETED under it would be a different and much worse event).
    for (const family of WR10_FAMILIES_AT_LANDING) expect(TERM_FAMILIES).toContain(family);
    expect(WR10_FAMILIES_AT_LANDING.length).toBe(8); // non-vacuity + the record is frozen
  });

  it('PIN 2 — the trade-rights spellings live in ONE file, and the rejected ones nowhere', () => {
    // RETARGETED BY GR-3, WHICH IS THE WAVE THIS PIN WAS WAITING FOR. The original read
    // "NO trade-rights literal is spelled in src/", and its reason was explicit: spelling
    // one would pre-empt chair ruling R3, which makes GRAMMAR §4 canonical for their
    // spelling. GR-3 IS the wave that exercises R3, so a blanket ban would now forbid the
    // canonical list from containing the canonical rows. What the pin was actually
    // protecting — that the spelling cannot FORK — survives intact and is now stated
    // directly: the minted tokens appear in the catalog and NOWHERE else in src/.
    const CATALOG_HOME = 'src/domain/worldPulse/peaceTermsCatalog.js';
    // (a) The spellings GR-3 MINTED. Lawful in the catalog, forbidden everywhere else —
    // any second home is the second list R3 exists to forbid.
    const MINTED = ['exclusivity', 'market_access', 'toll_exemption'];
    // (b) The spellings GR-3 REJECTED. Still forbidden tree-wide, INCLUDING the catalog:
    // `trade_exclusivity` is FP-TRADE's TR-5 draft spelling and the chair documents say
    // bare `exclusivity`, so a row appearing under the other name anywhere is the
    // divergence itself arriving. The camelCase variants were never anyone's proposal.
    const REJECTED = ['trade_exclusivity', 'tradeExclusivity', 'marketAccess', 'tollExemption'];
    const files = walkJs(join(ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100); // the scan really walked a tree

    // ⚠ WHOLE TOKENS, NOT SUBSTRINGS, AND THAT IS A MEASURED CORRECTION rather than a
    // tidy-up. `exclusivity` is a SUBSTRING of `trade_exclusivity`, so the original
    // `body.includes(token)` predicate would report the rejected spelling as ALSO being
    // the minted one wherever it appeared — the two would be blind through the same hole,
    // and "no second speller" would have been unprovable in exactly the case that matters.
    // `_` is a word character, so `\bexclusivity\b` genuinely does not fire inside
    // `trade_exclusivity`; the separation is proved by the executed mutants below.
    /** @param {string} body @param {readonly string[]} words @returns {string[]} */
    const hitsOf = (body, words) => words.filter(
      (token) => new RegExp(`\\b${token}\\b`).test(body),
    );
    /** @param {string} body @returns {string[]} */
    const hits = (body) => hitsOf(body, [...MINTED, ...REJECTED]);
    const offenders = [];
    const rejectedAnywhere = [];
    const mintedHomes = [];
    for (const file of files) {
      const rel = file.slice(ROOT.length + 1);
      const body = code(rel);
      if (hitsOf(body, REJECTED).length) rejectedAnywhere.push(`${rel}: ${hitsOf(body, REJECTED).join(',')}`);
      const minted = hitsOf(body, MINTED);
      if (!minted.length) continue;
      if (rel === CATALOG_HOME) mintedHomes.push(rel);
      else offenders.push(`${rel}: ${minted.join(',')}`);
    }
    // No second speller...
    expect(offenders).toEqual([]);
    // ...no rejected spelling anywhere at all...
    expect(rejectedAnywhere).toEqual([]);
    // ...and the ONE lawful home really does spell all three, so the emptiness above is a
    // measurement rather than the scan having quietly stopped finding anything.
    expect(mintedHomes).toEqual([CATALOG_HOME]);
    expect(hitsOf(code(CATALOG_HOME), MINTED).sort()).toEqual([...MINTED].sort());

    // GUARD-THE-GUARD. A scan that silently stopped matching would pass as compliance,
    // so the identical predicate must FIND a token that genuinely is in the tree...
    expect(code('src/domain/worldPulse/peaceTermsCatalog.js').includes('tribute')).toBe(true);
    // ...and must FIND a forbidden token when one is actually present (executed mutant).
    // THE FIRST MUTANT IS THE ALIASING CONTROL: the body carries `trade_exclusivity` and
    // NOT the minted `exclusivity`, so a substring predicate would return BOTH and this
    // exact-equality assertion is what forbids the two tokens sharing one hole.
    expect(hits('const x = { trade_exclusivity: 1 };')).toEqual(['trade_exclusivity']);
    expect(hits('const y = { tollExemption: 1 };')).toEqual(['tollExemption']);
    // ...and the separation runs in the other direction too: the minted spelling alone
    // must NOT be read as the rejected one.
    expect(hits('const z = { exclusivity: 1 };')).toEqual(['exclusivity']);

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

  it('PIN 5 — the trade-rights dimension is now NAMEABLE, and still UNPRODUCED', () => {
    // WHAT THIS PIN USED TO SAY: "an HONEST PERMANENT ZERO" — nothing could report a
    // trade-rights contribution because the family was not in the derived set at all.
    // GR-3 moved exactly half of that. `commercial` IS in the set now, so a court can
    // weigh such a component through its own needs and the receipt can name it...
    const available = bundleComponentFamilies();
    expect(available.length).toBe(TERM_FAMILIES.length + SOVEREIGNTY_NON_CATALOG_COMPONENTS.length);
    expect(available).toContain('commercial');
    // ...and it composes for real, not merely as a legal name: a bundle carrying one is
    // weighed by the same arithmetic every other family gets.
    const weighed = valueBundleThroughNeeds({
      partyId: 'ironvale',
      components: [{ family: 'commercial', magnitude01: 0.8 }],
      needs: { commercial: 0.5 },
    });
    expect(weighed.offered.map((line) => line.family)).toEqual(['commercial']);
    expect(weighed.total01).toBe(0.4);
    // THE OTHER HALF IS STILL OWED, and this is the half that keeps TR-5 honest: the
    // three commercial rows are `executor:'seam'` with NO producer, so no engine path can
    // mint one to put on a table. The day that changes, this reds — which is the seam-2
    // instruction to move the reachability obligation into TR-5's own commit.
    const commercial = TERM_TYPES.filter((type) => TERM_CATALOG[type].family === 'commercial');
    expect([...commercial].sort()).toEqual(['exclusivity', 'market_access', 'toll_exemption']);
    for (const type of commercial) expect(TERM_CATALOG[type].executor).toBe('seam');
    // ANCHORED on `tribute`, a live CLASS_TERM value read the identical way: an empty or
    // re-shaped CLASS_TERM would otherwise certify `exclusivity` as producer-less for a
    // reason that has nothing to do with TR-5.
    expectAbsentWithAnchor(Object.values(CLASS_TERM), 'exclusivity', 'tribute',
      'the trade-rights rows stay producer-less until TR-5 lands');
  });

  it('PIN 6 — the two volumes\' degradation notes are now TWINS (chair ruling CR-WR10-B)', () => {
    // TIGHTENED 2026-08-04. This pin was born recording a KNOWN divergence: the war
    // volume's degraded list carried `peace` and FP-TRADE §3 Seam One's did not, while
    // both sentences called themselves twins of each other. The chair ruled the WAR
    // volume correct — the cession rider is a component, and it is why WR-10 sequences
    // after WR-7 — and amended FP-TRADE to match. So the pin drops its
    // known-divergence allowance and becomes what it was always meant to become: a
    // plain equality, which reds on ANY future drift in EITHER direction.
    const flat = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/\s+/g, ' ');
    const DEGRADED_RE = () => /bundle composes ([a-z/ ]+?) only/g;
    const listOf = (rel) => {
      const m = /bundle composes ([a-z/ ]+?) only/.exec(flat(rel));
      return m ? m[1].replace(/\s+/g, '').split('/').filter(Boolean) : [];
    };
    // UNIQUENESS FIRST, and it is not decoration. `exec` returns the FIRST match, so a
    // volume that grew a SECOND degradation sentence — an amendment row restating the
    // list, say — would silently retarget this pin onto the new one and keep saying
    // "twins" about two sentences nobody compared. Each volume states the list ONCE.
    const occurrences = (rel) => [...flat(rel).matchAll(DEGRADED_RE())].length;
    expect(occurrences('docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md'), 'the war volume states it exactly once').toBe(1);
    expect(occurrences('docs/DESIGN_FP_TRADE.md'), 'the trade volume states it exactly once').toBe(1);

    const war = listOf('docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md');
    const trade = listOf('docs/DESIGN_FP_TRADE.md');
    expect(war.length, 'the war volume states a degraded list').toBeGreaterThan(0);
    expect(trade.length, 'the trade volume states a degraded list').toBeGreaterThan(0);
    const RECONCILED = ['streams', 'stores', 'allyship', 'settlements', 'peace'];
    expect(war).toEqual(RECONCILED);
    expect(trade).toEqual(RECONCILED);
    expect(war).toEqual(trade); // the plain equality the ruling bought
    // ...and the module still follows that list: `peace` is a component here.
    expect([...SOVEREIGNTY_NON_CATALOG_COMPONENTS]).toEqual(['peace']);
    expect(bundleComponentFamilies()).toContain('peace');
  });
});
