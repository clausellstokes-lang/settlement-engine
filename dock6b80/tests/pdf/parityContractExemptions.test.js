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
import { prominentProse } from '../../src/pdf/lib/format.js';
import { deriveDossierViewModel } from '../../src/domain/display/dossierViewModel.js';
import { SHARED_FIELDS, PARITY_EXEMPT, getByPath } from '../../src/domain/display/parityContract.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';
import { QUEUE_WIRED_PROSE_PATHS } from '../../src/store/settlementPendingEdits.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';

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

/**
 * ⭐⭐ §373.2 — THE EDITABLE-PATH ↔ CONSUMER AGREEMENT PIN.
 *
 * WHY IT EXISTS. The reader-with-no-writer ratchet is structurally BLIND to this
 * class. A PARTIAL writer satisfies its detector: `assembleInstitutions`'s custom
 * arm does write `description` on an institution record, so the slice's
 * `inst?.description` read has a writer and mints no row — while the MAJORITY
 * producer (the catalog, and the variant picker that writes back to it) puts the
 * prose on `desc`, a key the slice never asked for. The result was 933 authored
 * one-liners that no export has ever printed, with every ratchet green.
 *
 * The instrument that SEES the class is not a shape census but an agreement pin:
 * apply a marked DM edit to every queue-wired editable prose path, then assert the
 * marker arrives at the exact key its rendered export surface reads. A path whose
 * edit lands nowhere the export looks is caught the moment it is wired, not four
 * hundred sections later.
 *
 * SHAPE (§373.2 J6). ONE statically-registered title. The sixteen paths iterate
 * INSIDE the body rather than through a per-path generator, because loop-registered
 * titles are invisible to the test census and can park silently; the failure ARRAY
 * preserves per-path attribution, so a red still names the exact path that
 * disagreed rather than blurring into an aggregate.
 *
 * THE EXCLUSION REGISTER is declared classification, never banked failure. Each
 * EXCLUDED row cites the docket that owns it, and the completeness arm below makes
 * the register total: a path added to the edit queue without a classification reds,
 * and a register row whose path leaves the queue reds. That two-direction closure
 * is what retires the class — no future editable path can ship unclassified.
 */
const AGREEMENT_MARK = (p) => `<<DM-EDIT ${p}>>`;
const AGREEMENT_EDITED_AT = '2026-08-22T00:00:00.000Z';

/**
 * Every queue-wired editable prose path, classified. `read` names the RENDERED
 * slice key the export surface actually consumes — never a pass-through container.
 */
const EDITABLE_PATH_CONSUMERS = [
  { kind: 'faction', path: 'desc', expect: 'REACHES', read: (vm) => vm.power.factions[0]?.description },
  { kind: 'institution', path: 'desc', expect: 'REACHES', read: (vm) => vm.services.detailed[0]?.description },
  { kind: 'settlement', path: 'settlementReason', expect: 'REACHES', read: (vm) => vm.overview.settlementReason },
  { kind: 'settlement', path: 'prominentRelationship.phrasing', expect: 'REACHES', read: (vm) => prominentProse(vm.overview.prominentRelationship) },
  { kind: 'settlement', path: 'history.historicalCharacter', expect: 'REACHES', read: (vm) => vm.history.historicalCharacter },
  { kind: 'settlement', path: 'history.founding.reason', expect: 'REACHES', read: (vm) => vm.overview.history?.origin },
  { kind: 'settlement', path: 'history.founding.initialChallenge', expect: 'REACHES', read: (vm) => vm.overview.history?.initialChallenge },
  { kind: 'settlement', path: 'history.founding.overcoming', expect: 'REACHES', read: (vm) => vm.overview.history?.overcoming },
  { kind: 'settlement', path: 'history.founding.stressNote', expect: 'REACHES', read: (vm) => vm.overview.history?.stressNote },
  { kind: 'settlement', path: 'history.founding.foundedBy', expect: 'REACHES', read: (vm) => vm.overview.history?.foundedBy },
  // The prototype census hardcoded all three safetyProfile paths as unreadable. This
  // one DOES reach, through deriveGuardAssessment (domain/display/defenseDisplay.js)
  // into defenseSlice's guardAssessment, which DefenseSecurity.jsx renders.
  { kind: 'settlement', path: 'economicState.safetyProfile.guardEffectivenessDesc', expect: 'REACHES', read: (vm) => vm.defense.guardAssessment },
  { kind: 'settlement', path: 'arrivalScene', expect: 'EXCLUDED', why: 'The PDF reads this prose from the AI overlay only; the settlement scalar exists and is screen-rendered. Whether the export gains the scalar fallback is an open owner product call (ODQ §373.3) — the PARITY_EXEMPT row states the same ground, and the not-theater arm above is its tripwire.' },
  { kind: 'settlement', path: 'pressureSentence', expect: 'EXCLUDED', why: 'Same ground as arrivalScene: AI-overlay-only in the export, canonical scalar on the screen, owner product call open (ODQ §373.3).' },
  { kind: 'settlement', path: 'economicViability.summary', expect: 'EXCLUDED', why: 'Read-time reconciliation replaces this field on BOTH surfaces (viabilitySummaryFor under canonicalViewModel returns deriveViability(settlement).summary), so the DM edit is discarded before either renderer sees it. Chartered for its own diagnosis (ODQ §373.3).' },
  { kind: 'settlement', path: 'economicState.safetyProfile.safetyDesc', expect: 'EXCLUDED', why: 'No export reader exists for this path at any surface; adding one is new capability, on the owner-cull docket (ODQ §369.2).' },
  { kind: 'settlement', path: 'economicState.safetyProfile.economicDragDesc', expect: 'EXCLUDED', why: 'No export reader exists for this path at any surface; adding one is new capability, on the owner-cull docket (ODQ §369.2).' },
];

/** The rendered chapters. `raw`/`active`/`ai`/`entityIndex` hold the live settlement
 *  objects by reference, so scanning them would make every marker trivially present. */
const AGREEMENT_RENDERED_SLICES = [
  'summary', 'identity', 'overview', 'daily', 'power', 'economics', 'defense',
  'services', 'resources', 'viability', 'history', 'npcs', 'hooks', 'relationships', 'aiAppendix',
];

describe('parityContract — every queue-wired DM edit reaches the export key its surface reads (§373.2)', () => {
  it('classifies all 16 editable prose paths and each REACHES row lands at its rendered consumer', () => {
    // ── ARM 1: completeness, BOTH directions. This is what closes the class. ──
    const registered = EDITABLE_PATH_CONSUMERS.map((r) => `${r.kind}.${r.path}`).sort();
    const queueWired = Object.entries(QUEUE_WIRED_PROSE_PATHS)
      .flatMap(([kind, paths]) => paths.map((p) => `${kind}.${p}`)).sort();
    expect(
      registered,
      'the exclusion register must classify EXACTLY the queue-wired prose paths: a path '
      + 'added to QUEUE_WIRED_PROSE_PATHS without a row here would ship unclassified, and a '
      + 'row whose path left the queue is a stale classification',
    ).toEqual(queueWired);

    // ── The fixture: a real catalog institution spread the way assembleInstitutions
    //    mints it (it carries `desc`), PLUS a custom-shaped one (it carries
    //    `description` and no catalog key) so the desc-first ordering is exercised
    //    where BOTH keys are populated on one record.
    const catalogDef = institutionalCatalog.thorp.Government['Household elder'];
    const catalogInst = {
      category: 'Government', name: 'Household elder',
      ...structuredClone(catalogDef), source: 'generated', status: 'healthy',
    };
    const customInst = {
      category: 'Trade', name: 'The Salt Counting-House',
      isCustom: true, source: 'custom', required: false, tags: [],
      description: 'The generated line for a custom counting-house.',
      status: 'healthy',
    };
    const governingFaction = { faction: "The Reeve's Hall", power: 6, desc: 'generated faction blurb', isGoverning: true };
    const fixture = {
      name: 'Probeholt', tier: 'thorp', population: 90,
      institutions: [catalogInst, customInst],
      powerStructure: { factions: [governingFaction], conflicts: [] },
      npcs: [],
      arrivalScene: 'generated arrival scene',
      pressureSentence: 'generated pressure sentence',
      settlementReason: 'generated settlement reason',
      prominentRelationship: { npc1: 'A', npc2: 'B', type: 'Quiet Rivalry', phrasing: 'generated phrasing', full: 'generated full', tension: 'generated tension' },
      history: {
        historicalCharacter: 'generated historical character',
        founding: {
          reason: 'generated founding reason',
          initialChallenge: 'generated initial challenge',
          overcoming: 'generated overcoming',
          stressNote: 'generated stress note',
          foundedBy: 'generated founded by',
        },
        historicalEvents: [], currentTensions: [],
      },
      economicViability: { viable: true, summary: 'generated outlook summary', dependencies: ['grain'] },
      economicState: {
        safetyProfile: {
          safetyDesc: 'generated safety desc',
          guardEffectivenessDesc: 'generated guard effectiveness desc',
          economicDragDesc: 'generated economic drag desc',
        },
        activeChains: [],
      },
    };
    const serializeRendered = (m) => JSON.stringify(
      Object.fromEntries(AGREEMENT_RENDERED_SLICES.map((k) => [k, m[k]])),
      (k, v) => (k === '_userEdits' || k === 'raw' ? undefined : v),
    );

    // ── ARM 2: baseline-no-marker control. Before any edit the rendered slices carry
    //    ZERO markers, so a later PRESENT reading cannot be the fixture handing itself
    //    its own anchor. // anchored: the marker token is minted by this test and the
    //    fixture strings above deliberately never contain it, so a non-zero count here
    //    would mean the scan is reading a container that echoes the input.
    const beforeEdits = buildViewModel({ settlement: fixture, narrativeMode: false });
    expect(
      (serializeRendered(beforeEdits).match(/<<DM-EDIT /g) || []).length,
      'the rendered slices already contain an edit marker before any edit was applied',
    ).toBe(0);

    // ── ARM 4: positive controls. The row must exist and its siblings must flow, or a
    //    green `description` reading below could be an empty list agreeing with itself.
    expect(beforeEdits.services.detailed.length).toBeGreaterThanOrEqual(1);
    expect(beforeEdits.services.detailed[0].name).toBe('Household elder');
    expect(beforeEdits.services.detailed[0].category).toBe('Government');
    // A2 baseline: the custom row renders its GENERATED text when no edit exists, which
    // is why the `description` arm of the cured chain survives rather than being struck.
    expect(beforeEdits.services.detailed[1].description).toBe('The generated line for a custom counting-house.');

    // ── The edits, written ONLY through applyUserEdit on the editable path — never
    //    directly at a reader's key. This is the exact call applyUserEditAction makes.
    for (const p of QUEUE_WIRED_PROSE_PATHS.settlement) {
      applyUserEdit(fixture, p, AGREEMENT_MARK(`settlement.${p}`), { editedAt: AGREEMENT_EDITED_AT });
    }
    applyUserEdit(governingFaction, 'desc', AGREEMENT_MARK('faction.desc'), { editedAt: AGREEMENT_EDITED_AT });
    applyUserEdit(catalogInst, 'desc', AGREEMENT_MARK('institution.desc'), { editedAt: AGREEMENT_EDITED_AT });
    applyUserEdit(customInst, 'desc', AGREEMENT_MARK('institution.desc.custom'), { editedAt: AGREEMENT_EDITED_AT });

    const vm = buildViewModel({ settlement: fixture, narrativeMode: false });

    // ── ARM 3: rendered-reads-only. Every REACHES row reads a rendered slice key; the
    //    disagreements collect so the message names each path rather than the first.
    const disagreements = [];
    for (const row of EDITABLE_PATH_CONSUMERS) {
      if (row.expect !== 'REACHES') continue;
      const key = `${row.kind}.${row.path}`;
      if (row.read(vm) !== AGREEMENT_MARK(key)) disagreements.push(key);
    }
    expect(
      disagreements,
      'a DM edit on these queue-wired paths did NOT arrive at the export key their rendered '
      + 'surface reads — the edit is staged, accepted and persisted, and then silently dropped '
      + 'at the projection. Either repair the read or move the path to the EXCLUDED register '
      + 'with the docket that owns it.',
    ).toEqual([]);

    // ── A2 — the ORDERING arm. The custom row carries BOTH keys once edited; `desc`
    //    first means the DM's pen wins its position over the generated text.
    expect(
      vm.services.detailed[1].description,
      'a custom institution carrying both a generated `description` and a DM `desc` edit '
      + 'must render the DM edit — the ordering is pinned, not incidental',
    ).toBe(AGREEMENT_MARK('institution.desc.custom'));
  });
});
