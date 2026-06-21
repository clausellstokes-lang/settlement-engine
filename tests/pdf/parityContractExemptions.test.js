/**
 * parityContractExemptions.test.js — A+ pdf.8.
 *
 * Closes the gap the PDF_PARITY_AUDIT.md tracked BY HAND: screen↔PDF parity was
 * verified manually, doc-by-doc. viewModelParity.test.js already walks
 * SHARED_FIELDS and pins canon === PDF view-model per fact. The remaining hand-
 * audited surface is the OTHER half of the contract — PARITY_EXEMPT — which the
 * value walk never touches. An exemption is the escape hatch from "must match";
 * if it is wrong (a SHARED fact mis-filed as exempt, or an exemption that no
 * longer reflects reality), the value walk can't catch it because the field is,
 * by definition, excluded from the walk.
 *
 * This test makes the WHOLE contract self-policing for a fixed seed, so the
 * manual audit can retire:
 *
 *   1. FIXED-SEED FULL WALK — re-asserts every SHARED_FIELDS fact matches between
 *      the on-screen dossier source (deriveDossierViewModel — the single canon)
 *      and the single PDF source of truth (buildViewModel), for one pinned seed,
 *      honoring each row's normalizeVm. This is the "golden parity" anchor the
 *      lane asks for, at one deterministic config.
 *
 *   2. PARTITION RATCHET — SHARED_FIELDS and PARITY_EXEMPT must be DISJOINT and
 *      well-formed. A fact cannot be both pinned and exempt; an exemption must
 *      carry a reason. This is the structural guard that stops a developer from
 *      "exempting away" a fact that the contract pins (or vice versa).
 *
 *   3. EXEMPTIONS ARE REAL, NOT THEATER — the AI-only exemptions (thesis,
 *      arrivalScene, aiAppendix, daily passages) are asserted to be EMPTY on the
 *      non-AI data path (the path SHARED_FIELDS parity is pinned against) and
 *      POPULATED on the AI path. This proves two things at once: the exemption
 *      genuinely tracks AI-only-ness (so the reason on the row is honest), AND no
 *      AI prose can leak into a raw export to silently break the parity the
 *      value walk guards. If a future change makes one of these render on the raw
 *      path, it is no longer AI-only — the exemption is stale and this fails.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { deriveDossierViewModel } from '../../src/domain/display/dossierViewModel.js';
import { SHARED_FIELDS, PARITY_EXEMPT, getByPath } from '../../src/domain/display/parityContract.js';

const CFG = { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' };
const SEED = 'parity-contract-exemptions-2026';

describe('parityContract — fixed-seed value parity (canon ↔ single PDF buildViewModel)', () => {
  const settlement = generateSettlementPipeline(CFG, null, { seed: SEED, customContent: {} });
  const canon = deriveDossierViewModel(settlement);
  const vm = buildViewModel({ settlement });

  it('every SHARED_FIELD matches between the dossier source and the PDF view-model', () => {
    expect(SHARED_FIELDS.length).toBeGreaterThan(0);
    for (const row of SHARED_FIELDS) {
      const canonVal = getByPath(canon, row.canonPath);
      for (const vmPath of row.vmPaths) {
        const raw = getByPath(vm, vmPath);
        const vmVal = row.normalizeVm ? row.normalizeVm(raw) : raw;
        expect(
          vmVal,
          `${row.fact} — PDF ${vmPath} must equal canon ${row.canonPath}`,
        ).toBe(canonVal);
      }
    }
  });
});

describe('parityContract — partition ratchet (SHARED_FIELDS ⊥ PARITY_EXEMPT)', () => {
  it('no fact is both pinned and exempt, and every exemption carries a reason', () => {
    const sharedFacts = new Set(SHARED_FIELDS.map((r) => r.fact));
    const sharedPaths = new Set(SHARED_FIELDS.flatMap((r) => r.vmPaths));

    expect(PARITY_EXEMPT.length).toBeGreaterThan(0);
    for (const ex of PARITY_EXEMPT) {
      expect(typeof ex.fact, `exemption missing fact: ${JSON.stringify(ex)}`).toBe('string');
      expect(ex.fact.length).toBeGreaterThan(0);
      expect(typeof ex.reason, `exemption "${ex.fact}" missing reason`).toBe('string');
      expect(ex.reason.length).toBeGreaterThan(0);
      // A fact cannot be simultaneously pinned (must-match) and exempt (may-differ):
      // that would let a real divergence hide behind the exemption.
      expect(sharedFacts.has(ex.fact), `"${ex.fact}" is both a SHARED_FIELD and PARITY_EXEMPT`).toBe(false);
      // Wildcard ('aiAppendix.*') / prose exemptions name a SLICE, not an exact vmPath;
      // a concrete exempt path must never collide with a pinned vmPath either.
      if (!ex.fact.includes('*')) {
        expect(sharedPaths.has(ex.fact), `exempt path "${ex.fact}" collides with a pinned vmPath`).toBe(false);
      }
    }
  });
});

describe('parityContract — AI-only exemptions are genuinely AI-only (not theater)', () => {
  const settlement = generateSettlementPipeline(CFG, null, { seed: SEED, customContent: {} });

  // The data (non-AI) path: this is the surface SHARED_FIELDS parity is pinned
  // against. The AI prose fields MUST be absent here, or they would leak into a
  // raw export and break the value parity the walk above guards.
  const dataVm = buildViewModel({ settlement, narrativeMode: false });

  // A minimal-but-real AI overlay routed through the SAME buildViewModel inputs
  // production uses (aiSettlement + aiDailyLife + narrativeMode). The slices read
  // ai.thesis / ai.arrivalScene / appendixSlice(ai) / aiDailyLife.* — populate
  // exactly those so the AI path lights the exempted fields up the real way.
  const aiOverlay = {
    ...settlement,
    thesis: 'A river town living on the knife-edge of its grain ledger.',
    arrivalScene: 'You cross the bridge as the mill-wheels groan to a stop.',
    pressureSentence: 'Everyone is counting sacks and nobody is counting friends.',
    identityMarkers: [{ label: 'Smell', text: 'wet stone and spent malt' }],
    frictionPoints: [{ parties: ['Miller', 'Reeve'], note: 'a disputed toll' }],
    connectionsMap: [{ from: 'Miller', to: "Reeve's office", relationship: 'owes' }],
    dmCompass: { hooks: ['The toll books are forged.'], redFlags: ['Watch the reeve.'], twist: 'The miller is the reeve.' },
  };
  const aiDailyLife = {
    dawn: 'Bakers stoke cold ovens.',
    morning: 'The market fills with thin crowds.',
    midday: 'Carts queue at the bridge gate.',
    evening: 'Tallies are read aloud in the square.',
    night: 'The watch counts the granary locks.',
  };
  const aiVm = buildViewModel({ settlement, aiSettlement: aiOverlay, aiDailyLife, narrativeMode: true });

  it('confirms the AI path actually engaged (guards against a silent no-op fixture)', () => {
    expect(dataVm.narrativeMode).toBe(false);
    expect(aiVm.narrativeMode).toBe(true);
  });

  // Each entry: the exempt fact label and where it lives in the view-model, so we
  // assert the SAME slice that the section renders is empty on raw / present on AI.
  const AI_ONLY = [
    { fact: 'overview.thesis',      read: (m) => m.overview.thesis },
    { fact: 'summary.arrivalScene', read: (m) => m.summary.arrivalScene },
    { fact: 'aiAppendix.*',         read: (m) => m.aiAppendix },
    { fact: 'daily.passages',       read: (m) => (m.daily.hasPassages ? m.daily.passages : null) },
  ];

  for (const { fact, read } of AI_ONLY) {
    it(`"${fact}" is in PARITY_EXEMPT, empty on the raw path, and populated on the AI path`, () => {
      // The fact is actually declared exempt (keeps this test honest if the
      // registry changes out from under it).
      expect(PARITY_EXEMPT.some((e) => e.fact === fact), `"${fact}" must be listed in PARITY_EXEMPT`).toBe(true);

      const rawVal = read(dataVm);
      const rawEmpty = rawVal == null || (Array.isArray(rawVal) && rawVal.length === 0);
      expect(rawEmpty, `"${fact}" must be empty on the non-AI data path (else it would break SHARED_FIELDS parity)`).toBe(true);

      const aiVal = read(aiVm);
      const aiPopulated = aiVal != null && (!Array.isArray(aiVal) || aiVal.length > 0);
      expect(aiPopulated, `"${fact}" must be populated on the AI path (else the exemption is dead)`).toBe(true);
    });
  }
});
