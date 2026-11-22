/**
 * premiumGateSingleSource.test.js — Wave R-4 premium-gate scan
 * (docs/CAPABILITY_REMEDIATION_PLAN.md; the R-0 deity single-source cure
 * generalized, closing the R-2/R-3 spelling-drift class).
 *
 * THE BUG CLASS. The dossier AUTHORING authority — premium / founder /
 * elevated — was hand-copied into two surfaces. A third surface (the Create
 * flow) simply forgot to copy it, and shipped un-gated until Wave R-2 found it.
 * Hand-copied gates drift; a forgotten copy is a fail-OPEN on a paid surface.
 *
 * TWO ASSERTIONS, deliberately different in kind:
 *
 *   A. SINGLE SOURCE (zero exemptions). The authoring-authority spelling — a
 *      tier compared against 'founder', or a ['premium','founder'] membership
 *      literal — may appear ONLY in src/lib/viewerAuthority.js. Every consumer
 *      imports `viewerCanAuthor`. Non-vacuity is proven by asserting the
 *      chokepoint itself matches the signature.
 *
 *   B. EXEMPTION CENSUS (frozen exact set). Every OTHER file in src that spells
 *      a raw premium-tier comparison is enumerated below with a reason class.
 *      A NEW file spelling one reds this test, forcing its author to either
 *      import the single source or record why its question is a different one.
 *      The set is EXACT in both directions: a stale entry (the file stopped
 *      spelling it) also reds, so the census can never rot into a permissive
 *      allowlist. The reason CLASSES are exact in both directions too — a class
 *      no row claims reds (R-5b, when the alignment emptied one).
 *
 * WAVE R-5b — THE DIVERGENCE CLOSED (owner-authorized 2026-07-27). R-4 recorded
 * `npcAuthoringAllowed` (OutputContainer) as a deliberate divergence: on the
 * Create flow it admitted EVERY tier while the Workbench mount withheld the
 * Change Dock below the authoring authority, so free/anon users held queueEdit
 * levers with no review surface. The owner authorized alignment; OutputContainer
 * is now asserted as the THIRD consumer of the single source, and the
 * 'documented-divergence' reason class retired with it. Its census row stays,
 * reclassified to 'content-visibility', because the file still spells one raw
 * comparison — `viewerIsPremium`, the War & Faith tab-PRESENCE gate, which asks a
 * different question and omits the founder tier.
 *
 * WHY THE CENSUS IS NOT JUST "CONVERGE THEM ALL". These surfaces ask genuinely
 * different questions of the same field. Converging them would be a behaviour
 * change on paid surfaces, which is owner-gated. Each reason class says which
 * question is being asked; see REASON_CLASSES.
 *
 * OUT OF SCOPE BY CONSTRUCTION (not scanned, stated so the boundary is legible):
 *   - supabase/functions/** (edge). Server-side entitlement is a separate
 *     authority with its own deploy lifecycle; a client predicate cannot be its
 *     single source, and the edge suite gates it.
 *   - tests/**. Fixtures must be free to spell tiers literally.
 *
 * CANNOT-CATCH (accepted regex-gate gaps, recorded honestly): a drifter who
 * reads the tier through an indirection the regex cannot see — e.g.
 * `const PAID = 'premium'; tier === PAID`, or a `TIER_GATE` lookup keyed by a
 * computed string. Residual is covered by the behaviour pins on both consumers
 * (tests/components/workbenchProseEditor.test.jsx) rather than by widening the
 * pattern into false positives.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(REPO, 'src');
const CHOKEPOINT = 'src/lib/viewerAuthority.js';

/**
 * (A) The AUTHORING-AUTHORITY signature. `'founder'` is the discriminator: it is
 * the one tier literal that only this authority speaks. The receiver must END in
 * `tier` (so `tier`, `authTier`, `auth?.tier`, `s.auth.tier` match, while the
 * pricing catalog's `tier.key === 'founder'` and `pricingPrimaryKey === 'founder'`
 * — row keys, not account tiers — do not).
 */
const AUTHORITY_SIGNATURES = [
  /(?:^|[^A-Za-z0-9_])[A-Za-z0-9_?.]*[Tt]ier\s*(?:===|!==)\s*['"]founder['"]/,
  /\[\s*['"]premium['"]\s*,\s*['"]founder['"]\s*\]/,
  /\[\s*['"]founder['"]\s*,\s*['"]premium['"]\s*\]/,
];

/** (B) Any raw comparison of a tier/product value against the paid literals. */
const PREMIUM_COMPARISON = /(?:===|!==)\s*['"](?:premium|founder)['"]/;

/**
 * The reason classes. Each says what question that surface is really asking, and
 * therefore why routing it through `viewerCanAuthor` would be wrong (or would be
 * a paid-surface behaviour change this program is not authorized to make).
 */
const REASON_CLASSES = {
  'tier-producer':
    'PRODUCES or normalizes the tier/product value itself (auth resolution, Stripe '
    + 'product mapping, checkout reconciliation). It cannot consult a predicate whose '
    + 'input it is still computing.',
  'sell-to-the-tier':
    'Reads the tier IN ORDER TO SELL to it (pricing, purchase, subscription, referral, '
    + 'founder recognition). Routing these through the authoring authority would gate '
    + 'the upgrade path on already being upgraded, and would offer upgrades to elevated '
    + 'roles who never pay. Explicitly out of scope per the R-4 brief.',
  'route-guard':
    'App-shell route/view guard. Asks "may this VIEW open", intersected with anon and '
    + 'loading states the authoring predicate does not model.',
  'content-visibility':
    'Gates whether premium CONTENT is rendered (faith, ground truth, rumors, session '
    + 'mode, the export faith chapter). Aligning it with authoring authority would '
    + 'change what founders/elevated viewers can SEE — paid-surface behaviour.',
  'quota-or-limit':
    'A saves/credits/history/versions quota or limit read, not an authoring right.',
  'campaign-or-import-entitlement':
    'Campaign management, gallery import, or cloud sync entitlement — spelled with the '
    + 'ROLE literals (developer/admin) rather than isElevated(). A separate convergence '
    + 'candidate with its own owner queue entry; not this lane.',
  'surveyor-entitlement':
    'Access to the Surveyor, the AI control surface — law (7) of the owner\'s tier law '
    + '(2026-11-09: "Premium only"): premium (Founders folded in) OR staff OR the server\'s '
    + 'own has_surveyor_entitlement() answer (migration 209). It deliberately omits nothing the '
    + 'server admits and admits nothing the server refuses; the two lazy-chunk copies are kept '
    + 'byte-identical by tests/components/surveyorGateParity.test.js.',
};

/**
 * The frozen exemption census: every src file (other than the chokepoint) that
 * spells a raw premium-tier comparison today, mapped to its reason class.
 * Frozen 2026-07-27 by hand audit of all 54 matching lines.
 */
const EXEMPTIONS = {
  'src/App.jsx': 'route-guard',
  'src/AppViews.jsx': 'route-guard',
  // ⬇ TIER-PARITY-FIX V2 (2026-11-09, the owner's tier law) STRUCK the OutputContainer row.
  // R-5b had kept it for one raw comparison, `viewerIsPremium`, the War & Faith tab-PRESENCE
  // gate; V1 moved the War tone and the Relationships truth onto the view, and V2 the Faith
  // tab's presence onto the embed and the view, so the read is DELETED and the file is a
  // plain consumer of the single source (asserted below). The census shrinks by one.
  'src/components/PricingPage.jsx': 'sell-to-the-tier',
  'src/components/PurchaseModal.jsx': 'sell-to-the-tier',
  'src/components/SettlementsPanel.jsx': 'campaign-or-import-entitlement',
  'src/components/account/AccountDataPrivacySection.jsx': 'quota-or-limit',
  'src/components/account/AccountSubscriptionSection.jsx': 'sell-to-the-tier',
  // TIER-PARITY-FIX (2026-11-09): the Surveyor is premium only; the account's inlined twin of
  // isSurveyorTier now reads the tier (see the surveyorGate.js row).
  'src/components/account/useAccountSurveyorGate.js': 'surveyor-entitlement',
  'src/components/gallery/GalleryCampaigns.jsx': 'campaign-or-import-entitlement',
  'src/components/gallery/GalleryDetail.jsx': 'campaign-or-import-entitlement',
  'src/components/gallery/GalleryMaps.jsx': 'campaign-or-import-entitlement',
  'src/components/instant/InstantWorldEntry.jsx': 'quota-or-limit',
  // ⬇ TIER-PARITY-FIX V1-map (2026-11-09, the owner's tier law) STRUCK five rows here:
  // BeliefDivergenceBand, TreatyPanel, PerspectiveStandings, RelationshipChronicleSection and
  // NpcTrailSection. Each spelled `tier === 'premium' || elevated` to ask "may this viewer see
  // DM knowledge", but each mounts only inside the world map's campaign Herald, whose outer gate
  // (useWorldMapCampaignModel, the row below) already carries law (6): the inner term mirrored
  // it, and it is DELETED (`includeGroundTruth = true`). The withholding still lives in each
  // read model, fail-closed by default. The census shrinks by five.
  'src/components/map/useWorldMapCampaignModel.js': 'campaign-or-import-entitlement',
  // ⬇ TIER-PARITY-FIX V1 (2026-11-09, the owner's tier law) STRUCK the RumorsTab and WarTab
  // rows: their DM truth now keys on the view and the data (`!playerView && !publicDossier`),
  // the tier read DELETED, so neither file spells a premium comparison. The census shrinks.
  // §805 split: FaithTab mirrors FaithSection's mode resolution to decide the honest-absence
  // note — the content-visibility question the old combined tab carried.
  'src/components/new/tabs/FaithTab.jsx': 'content-visibility',
  // ⬇ ROW O-16 STRUCK THIS ROW, AND THE STRIKE IS THE WIN, NOT A WAIVER.
  // src/components/pricing/FounderTile.jsx used to spell `tier !== 'premium'`
  // itself, in a copy of the same three-condition gate that
  // hooks/useFounderTileEligible.js spells — two homes for one entitlement
  // question, held in agreement by a comment. The tile now reads that hook's
  // `useFounderRecognition()`, so the raw comparison exists in ONE place, the
  // hook's row below covers it, and this census demanded the dead row go
  // ("delete their EXEMPTIONS rows so the census cannot rot into a permissive
  // allowlist"). One fewer raw premium comparison in `src/`.
  'src/components/pricing/PricingTierCards.jsx': 'sell-to-the-tier',
  'src/components/session/SessionMode.jsx': 'content-visibility',
  'src/components/settlement/FaithSection.jsx': 'content-visibility',
  // ⬇ TIER-PARITY-FIX V3 (2026-11-09) STRUCK the VersionsTab row: version history is at parity
  // (revert included, the chair's ruling), the `isPaid` read DELETED. The census shrinks by one.
  'src/components/settlementDetail/resolveExportSeam.js': 'content-visibility',
  'src/components/settlements/SaveQuotaMeter.jsx': 'quota-or-limit',
  // TIER-PARITY-FIX (2026-11-09): THE Surveyor predicate (isSurveyorTier) admits an active
  // premium tier, as the server's 209 does — law (7). A different question from authoring.
  'src/components/surveyor/surveyorGate.js': 'surveyor-entitlement',
  'src/hooks/useCustomContentCloudSync.js': 'campaign-or-import-entitlement',
  'src/hooks/useFounderTileEligible.js': 'sell-to-the-tier',
  'src/hooks/useReferralIntent.js': 'sell-to-the-tier',
  'src/lib/auth.js': 'tier-producer',
  'src/lib/checkoutReconcile.js': 'tier-producer',
  'src/lib/pricingMoments.js': 'sell-to-the-tier',
  'src/lib/stripe.js': 'tier-producer',
  'src/store/accountImportBody.js': 'campaign-or-import-entitlement',
  'src/store/authSlice.js': 'tier-producer',
  'src/store/campaignImportedCreation.js': 'campaign-or-import-entitlement',
  'src/store/campaignSlice.js': 'campaign-or-import-entitlement',
  'src/store/campaignWorldPulseSlice.js': 'quota-or-limit',
  'src/store/galleryImportMap.js': 'campaign-or-import-entitlement',
  'src/store/galleryImportSettlement.js': 'campaign-or-import-entitlement',
  // ⬇ TIER-PARITY-FIX V5 (2026-11-09) STRUCK the settlementLifecycleHelpers row: W-F6's
  // activateFaithIfEntitled lost its tier arm (premade gods are engine content, not custom
  // content), so the file spells no premium comparison. The census shrinks by one.
};

/** Strip block + line comments so a signature named in prose is not a hit. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** Recursively collect .js / .jsx / .mjs under src, forward-slash normalized. */
function sourceFiles(dir = SRC, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, e.name);
    if (e.isDirectory()) sourceFiles(abs, acc);
    else if (/\.(jsx?|mjs)$/.test(e.name)) acc.push(relative(REPO, abs).split(sep).join('/'));
  }
  return acc;
}

function bodyOf(file) {
  return stripComments(readFileSync(join(REPO, file), 'utf8'));
}

describe('premium authoring gate — one spelling (src/lib/viewerAuthority.js)', () => {
  it('the chokepoint itself matches the authority signature (guard non-vacuity)', () => {
    const src = bodyOf(CHOKEPOINT);
    expect(AUTHORITY_SIGNATURES.some((re) => re.test(src))).toBe(true);
  });

  it('the chokepoint keeps the dead founder disjunct verbatim (owner-gated retirement)', () => {
    // No code path produces auth.tier === 'founder' today (authSlice resolveTier
    // yields anon|free|premium; the founder grant sets tier:'premium' plus
    // isFounder). Retiring the disjunct is the OWNER'S word — pinned so a future
    // "dead branch" cleanup has to go through the owner queue, not a drive-by.
    expect(bodyOf(CHOKEPOINT)).toMatch(
      /tier === 'premium' \|\| tier === 'founder'/,
    );
  });

  it('the chokepoint fails closed and imports nothing (eager-cheap, no store dependency)', () => {
    const src = bodyOf(CHOKEPOINT);
    expect(src).not.toMatch(/^\s*import\s/m);
    expect(src).toMatch(/typeof state\?\.isElevated === 'function'/);
    expect(src).toMatch(/state\.isElevated\(\) === true/);
  });

  it('no other file in src spells the authoring authority', () => {
    const offenders = [];
    for (const file of sourceFiles()) {
      if (file === CHOKEPOINT) continue;
      const src = bodyOf(file);
      if (AUTHORITY_SIGNATURES.some((re) => re.test(src))) offenders.push(file);
    }
    expect(
      offenders,
      'the premium/founder/elevated AUTHORING authority must be spelled only in '
        + `${CHOKEPOINT} — import { viewerCanAuthor } instead of hand-rolling it. `
        + `Offending files:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  it('every authoring consumer reads the single source', () => {
    for (const consumer of [
      'src/components/SettlementDetail.jsx',
      'src/components/dossier/SettlementWorkbenchMount.jsx',
      // R-5b: the third consumer. `npcAuthoringAllowed` was the documented
      // divergence; the owner-authorized alignment made it a consumer, so the
      // Create flow's NPC levers and the Workbench Change Dock open and close
      // on the SAME predicate. Behaviour pins: tests/components/
      // npcAuthoringScope.test.jsx (per-tier matrix).
      'src/components/OutputContainer.jsx',
    ]) {
      const src = bodyOf(consumer);
      expect(src, `${consumer} imports the single source`)
        .toMatch(/import \{ viewerCanAuthor \} from '.*viewerAuthority\.js'/);
      expect(src, `${consumer} uses it as the store selector`)
        .toMatch(/useStore\(viewerCanAuthor\)/);
    }
  });
});

describe('premium-tier comparison census — exact frozen exemption set', () => {
  it('reason classes and census rows match in BOTH directions', () => {
    for (const [file, reason] of Object.entries(EXEMPTIONS)) {
      expect(Object.keys(REASON_CLASSES), `${file} names a defined reason class`)
        .toContain(reason);
    }
    // The reverse direction (added R-5b, when the alignment emptied the
    // 'documented-divergence' class): a class no row claims is a rationale that
    // outlived its subject, and a stale rationale is exactly how a census rots
    // into a permissive allowlist. Retire it with its last tenant.
    const claimed = new Set(Object.values(EXEMPTIONS));
    const orphans = Object.keys(REASON_CLASSES).filter((r) => !claimed.has(r));
    expect(
      orphans,
      'these reason classes are claimed by no census row — delete them, or the '
        + `census keeps a rationale with no subject:\n  ${orphans.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the census equals the set of src files spelling a raw premium comparison', () => {
    const found = sourceFiles()
      .filter((f) => f !== CHOKEPOINT)
      .filter((f) => PREMIUM_COMPARISON.test(bodyOf(f)))
      .sort();
    const declared = Object.keys(EXEMPTIONS).sort();
    const undeclared = found.filter((f) => !declared.includes(f));
    const stale = declared.filter((f) => !found.includes(f));
    expect(
      undeclared,
      'a NEW raw premium-tier comparison landed. Either import viewerCanAuthor from '
        + `${CHOKEPOINT}, or add the file to EXEMPTIONS with the reason class that says `
        + `which different question it asks:\n  ${undeclared.join('\n  ')}`,
    ).toEqual([]);
    expect(
      stale,
      'these files no longer spell a raw premium comparison — delete their EXEMPTIONS '
        + `rows so the census cannot rot into a permissive allowlist:\n  ${stale.join('\n  ')}`,
    ).toEqual([]);
  });
});
