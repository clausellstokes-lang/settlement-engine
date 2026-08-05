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
};

/**
 * The frozen exemption census: every src file (other than the chokepoint) that
 * spells a raw premium-tier comparison today, mapped to its reason class.
 * Frozen 2026-07-27 by hand audit of all 54 matching lines.
 */
const EXEMPTIONS = {
  'src/App.jsx': 'route-guard',
  'src/AppViews.jsx': 'route-guard',
  // R-5b: was 'documented-divergence' (npcAuthoringAllowed). That divergence is
  // CLOSED — npcAuthoringAllowed now reads viewerCanAuthor, and the file is
  // asserted below as a consumer of the single source. The row does NOT retire
  // outright, because one raw comparison remains and asks a DIFFERENT question:
  // `viewerIsPremium` (OutputContainer.jsx) gates War & Faith tab PRESENCE and
  // deliberately omits the founder tier.
  'src/components/OutputContainer.jsx': 'content-visibility',
  'src/components/PricingPage.jsx': 'sell-to-the-tier',
  'src/components/PurchaseModal.jsx': 'sell-to-the-tier',
  'src/components/SettlementsPanel.jsx': 'campaign-or-import-entitlement',
  'src/components/account/AccountDataPrivacySection.jsx': 'quota-or-limit',
  'src/components/account/AccountSubscriptionSection.jsx': 'sell-to-the-tier',
  'src/components/gallery/GalleryCampaigns.jsx': 'campaign-or-import-entitlement',
  'src/components/gallery/GalleryDetail.jsx': 'campaign-or-import-entitlement',
  'src/components/gallery/GalleryMaps.jsx': 'campaign-or-import-entitlement',
  'src/components/instant/InstantWorldEntry.jsx': 'quota-or-limit',
  'src/components/map/BeliefDivergenceBand.jsx': 'content-visibility',
  // Joined 2026-08-04 by FP wave GR-0's DM true-state chip. The comparison is
  // BeliefDivergenceBand's line VERBATIM, two files away — `tier === 'premium' ||
  // elevated` — and it asks that file's question exactly: may this viewer be shown
  // GROUND TRUTH, which is the reason class's own first example. Routing it through
  // viewerCanAuthor would admit the founder tier to a surface premium-or-elevated
  // currently defines, i.e. a paid-surface behaviour change, which this walker's header
  // records as owner-gated. Recorded rather than converged, for that reason.
  // ⚠ AND THE CHIP IS NOT DARK. treatyTrueStateChip is fail-closed on this AUTHORITY
  // and NOT on treatyLifecycleVoiceEnabled: driven with the flag absent and lit it
  // returns the identical sentence (executed 2026-08-04). GR-0's sibling surface, the
  // longevity age line, IS flag-gated and returns null dark. So this row banks a live
  // premium content surface, not a dormant one — reported to the chair as a stop, and
  // this comment is where the next reader finds it.
  'src/components/map/TreatyPanel.jsx': 'content-visibility',
  'src/components/map/useWorldMapCampaignModel.js': 'campaign-or-import-entitlement',
  'src/components/new/tabs/RumorsTab.jsx': 'content-visibility',
  'src/components/new/tabs/WarFaithTab.jsx': 'content-visibility',
  'src/components/pricing/FounderTile.jsx': 'sell-to-the-tier',
  'src/components/pricing/PricingTierCards.jsx': 'sell-to-the-tier',
  'src/components/session/SessionMode.jsx': 'content-visibility',
  'src/components/settlement/FaithSection.jsx': 'content-visibility',
  'src/components/settlement/VersionsTab.jsx': 'quota-or-limit',
  'src/components/settlementDetail/resolveExportSeam.js': 'content-visibility',
  'src/components/settlements/SaveQuotaMeter.jsx': 'quota-or-limit',
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
  // W-F6's activateFaithIfEntitled — the raw comparison this exemption covers —
  // moved here from settlementSlice.js under THE DECOMPOSITION WAVE (lane D),
  // byte-identical. The exemption follows the CODE, not the filename.
  'src/store/settlementLifecycleHelpers.js': 'content-visibility',
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
