/**
 * negativeAssertionAnchor.walker.test.js — habitat removal for the DRIFT-NEUTERED
 * NEGATIVE ASSERTION class (epistemic prevention, wave EP-1).
 *
 * THE CLASS: a bare `expect(collection).not.toContain` is TRUE for two very different
 * reasons — the subject was correctly excluded, or the collection drifted out from
 * under the test entirely (renamed, re-shaped, emptied, never built). The second is a
 * VACUOUS green: the assertion outlives the regression it was written to catch, and it
 * does so silently. The `re-rt-1` roster case was caught by hand once; every other
 * instance in the estate is unenforced. `not.toMatch` and `not.toHaveProperty` carry
 * the same defect — a prose assertion that no longer sees prose passes forever.
 *
 * THE WALK: scan the WHOLE tests/ corpus for
 * `not.toContain|not.toMatch|not.toHaveProperty` and count every site that is NOT
 * anchored, where anchored means one of:
 *   1. the assertion goes through tests/helpers/anchoredNegatives.js
 *      (`expectPresentThenAbsent` / `expectAbsentWithAnchor` on the same line), or
 *   2. the site carries `// anchored: <why this cannot go vacuous>` on the assertion
 *      line or the line immediately above it.
 * Surviving un-anchored sites are frozen below, SHRINK-ONLY, and swept by wave EP-2.
 *
 * SCOPE (2026-07-30): the walk covered four generation-facing trees, and the class lived
 * on unguarded in the other twenty — 1,332 un-anchored sites across 454 files, two
 * orders of magnitude larger than the swept population. It now walks `tests` itself, so
 * a new tree is covered the day it lands. The four swept trees are held at EXACT zero
 * (they may not even take a frozen row); the newly-visible habitat is enumerated in
 * FROZEN_UNANCHORED_NEGATIVES below as a shrink-only burn-down worklist.
 *
 * WHY A PER-FILE COUNT rather than a per-line pin: line numbers churn under every
 * unrelated edit and would make the ratchet a nuisance gate. A per-file exact count is
 * stable under formatting, still catches a NEW un-anchored negative in an already-dirty
 * file, and — because the assertion is exact equality, not `<=` — forces the sweep to
 * bank each win by lowering the row.
 *
 * KNOWN EDGES (line-scan heuristic, accepted; the spatialLedgerCoverage idiom):
 *   - A negative split across lines (`expect(x)` on one line, `.not.toContain` on the
 *     next) is counted at the `.not.` line, and an `// anchored:` comment must sit on
 *     that line or the one above it — not above the `expect(`. Rare in the estate and
 *     self-evident when it reds.
 *   - `not.toContain` inside a template literal or a comment counts as a site. Since the
 *     widening there are 18 such sites across 5 files (documentation prose and detector
 *     fixtures); a false positive costs one frozen row, never a miss, so the rule stays
 *     a plain line scan. Annotate the line where it reads naturally.
 *   - Other negative matchers (`not.toBe`, `not.toEqual`, `not.toBeDefined`) are OUT of
 *     scope: they compare against a value the test names, so drift changes the value
 *     rather than emptying the subject. The three scanned matchers are the ones whose
 *     subject is a COLLECTION that can vanish.
 *   - The helper-call exemption is a same-line source match, so a helper invoked
 *     through an alias or a wrapper is not recognised. Call them by name.
 *
 * REGENERATION: `UPDATE_EPISTEMIC_ALLOWLIST=1 npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js`
 * PRINTS a fresh literal and FAILS with instructions. It never writes a file — the
 * allowlist is a reviewed artifact, and a self-updating ratchet ratchets nothing.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The WHOLE test corpus. Scanning `tests` itself rather than a list of trees removes
 *  the scope-drift class outright: a new tree is covered the day it lands. */
const SCAN_ROOTS = ['tests'];

/** The four trees the EP-1/EP-2 sweep drove to zero. They stay at EXACT zero: no frozen
 *  row may name a file here, so the banked win cannot be quietly spent. */
const GENERATION_FACING_ROOTS = ['tests/generators', 'tests/joins', 'tests/simulation', 'tests/property'];

const inGenerationTree = (rel) => GENERATION_FACING_ROOTS.some((root) => rel.startsWith(`${root}/`));

/** The three matchers whose subject is a collection that can silently vanish. */
const BARE_NEGATIVE_RE = /not\.(?:toContain|toMatch|toHaveProperty)\(/g;

/** Same-line use of an anchoring helper from tests/helpers/anchoredNegatives.js. */
const HELPER_RE = /expectPresentThenAbsent|expectAbsentWithAnchor/;

/** The reviewed inline escape hatch: `// anchored: <reason>`. */
const ANNOTATION_RE = /\/\/\s*anchored:/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/**
 * Count un-anchored negative-assertion sites per file.
 * @returns {Record<string, { count: number, lines: number[] }>}
 */
function scanUnanchoredNegatives() {
  /** @type {Record<string, { count: number, lines: number[] }>} */
  const found = {};
  for (const root of SCAN_ROOTS) {
    const abs = join(ROOT, root);
    if (!existsSync(abs)) continue;
    for (const filePath of walk(abs)) {
      const rel = relative(ROOT, filePath).replace(/\\/g, '/');
      if (!/\.test\.(js|jsx)$/.test(rel)) continue;
      const lines = readFileSync(filePath, 'utf8').split(`\n`);
      const hits = [];
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        BARE_NEGATIVE_RE.lastIndex = 0;
        const occurrences = [...line.matchAll(BARE_NEGATIVE_RE)].length;
        if (!occurrences) continue;
        if (HELPER_RE.test(line)) continue;
        if (ANNOTATION_RE.test(line)) continue;
        if (i > 0 && ANNOTATION_RE.test(lines[i - 1])) continue;
        for (let k = 0; k < occurrences; k += 1) hits.push(i + 1);
      }
      if (hits.length) found[rel] = { count: hits.length, lines: hits };
    }
  }
  return found;
}

/** Render the current scan as a paste-ready FROZEN_UNANCHORED_NEGATIVES literal. */
function renderLiteral(found) {
  const rows = Object.keys(found)
    .sort()
    .map((file) => `  '${file}': ${found[file].count},`)
    .join(`\n`);
  return `const FROZEN_UNANCHORED_NEGATIVES = Object.freeze({\n${rows}\n});`;
}

/**
 * ── THE INVENTORY, AND WHY IT WAS RE-FROZEN ────────────────────────────────────
 *
 * FROZEN 2026-07-27 from this walker's own scan at composite-r4 d0fdcf7c over four trees
 * (55 files / 181 sites), RE-FROZEN the same day after the EP-2 sweep banked the win,
 * driven to zero on 2026-07-28 by the EP-6 wave, and RE-FROZEN 2026-07-30 at the SCOPE
 * WIDENING when the walk grew from four trees to the whole corpus (449 files / 1,309
 * sites became visible at once).
 *
 * RE-FROZEN 2026-08-07 at composite-r4 36e50c73 — 516 files / 1560 sites in the general
 * roster plus the quarantine below. Measured by this walker's own
 * UPDATE_EPISTEMIC_ALLOWLIST regeneration inside an integrity-counted `git archive` of
 * that sha (6,196 paths in, 6,196 out), never transcribed from a reporter's summary.
 *
 * ⚠⚠ WHY A RE-FREEZE WAS OWED — READ THIS BEFORE BANKING ANYTHING HERE.
 * Between 2026-07-30 and 2026-08-07 this walker was RED, and its failing rows were banked
 * in the step-12 per-test census (scripts/.test-ratchet-baseline.json). A tolerated
 * failing row is BYTE-IDENTICAL however much worse it gets, so the inventory INSIDE it
 * grew from the 447 rows / 1,303 sites actually frozen here to 519 rows / 1,565 live
 * sites — 72 new offending files, 262 new sites — while the gate stayed green and nothing
 * announced it. (Both ends MEASURED 2026-08-07: the frozen total by summing the literal
 * this commit replaced, the live total by regeneration in the archive.)
 * That is the recorded "a RED ratchet's contents grow INVISIBLY" hazard, and it is why
 * this walker must never again be carried in the test census: a failing TEST is debt, a
 * failing WALKER is a disabled guard, and the two may not share one freezing mechanism.
 * The debt lives HERE now — shrink-only, and a NEW site still reds.
 *
 * The heaviest files by count are the natural next sweep (measured, descending):
 * tests/security/mapForkXssChain (61), tests/domain/worldSnapshotPublic (24),
 * tests/edgeFunctions/contracts (23), tests/security/townScenePlayerSafe (17),
 * tests/domain/warCosts (16), tests/edgeFunctions/surveyorByok (15).
 *
 * To bank a win: anchor the site (prefer expectPresentThenAbsent /
 * expectAbsentWithAnchor; use `// anchored: <reason>` only where the anchor is genuinely
 * structural), then LOWER this file's number — delete the row at 0. Never raise a number;
 * never add a file. A new file needing a row means a new un-anchored negative was
 * authored, which is the thing this gate exists to stop. Regenerate with
 * UPDATE_EPISTEMIC_ALLOWLIST=1 (it prints, never writes), then split the generation-facing
 * rows out by hand into READMITTED_GENERATION_FACING — the arms below refuse them here.
 */
const FROZEN_UNANCHORED_NEGATIVES = Object.freeze({
  'tests/application/commands/commandEnvelope.test.js': 1,
  'tests/architecture/archViewWall.test.js': 14,
  'tests/architecture/k0GeometryTracery.test.js': 3,
  'tests/architecture/surveyorCommandBoundary.test.js': 5,
  'tests/build/accountImportLazy.test.js': 2,
  'tests/build/bootSmoke.test.js': 2,
  'tests/build/ciGateHardening.test.js': 2,
  'tests/build/contentIdentityLazy.test.js': 2,
  'tests/build/customContentPreviewLazy.test.js': 2,
  'tests/build/customRegistryLazy.test.js': 11,
  'tests/build/engineChunkLazy.test.js': 6,
  'tests/build/firstPaintNonJs.test.js': 2,
  'tests/build/fontsAndMeta.test.js': 5,
  'tests/build/foundryLazy.test.js': 5,
  'tests/build/injectGalleryMeta.test.js': 7,
  'tests/build/metaShell.test.js': 5,
  'tests/build/ogImageRaster.test.js': 2,
  'tests/build/sitemap.test.js': 2,
  'tests/build/statusPageSelfContained.test.js': 5,
  'tests/build/surveyorPanelsLazy.test.js': 2,
  'tests/build/townScene3dLazy.test.js': 3,
  'tests/build/townSceneLocalMatrixAudit.test.js': 1,
  'tests/build/vendorPdfLazy.test.js': 4,
  'tests/build/worldPageLazy.test.js': 3,
  'tests/components/adminSimTuningPantheon.test.jsx': 1,
  'tests/components/advanceReport.test.jsx': 1,
  'tests/components/aiAnalystPanelMusings.test.jsx': 1,
  'tests/components/appShellResilience.test.jsx': 2,
  'tests/components/bandPolarityDisplay.test.jsx': 8,
  'tests/components/causeWalkPanel.test.jsx': 3,
  'tests/components/causeWalkPanelTranslation.test.jsx': 1,
  'tests/components/changeViewDepthGate.test.jsx': 1,
  'tests/components/chronicleEditGate.test.js': 2,
  'tests/components/covenantClaimsParity.test.js': 1,
  'tests/components/culturalTraditionPresentation.test.js': 1,
  'tests/components/customContentPresentationTranslation.test.jsx': 6,
  'tests/components/customContentSavedCard.test.jsx': 3,
  'tests/components/customContentUsageEcho.test.jsx': 1,
  'tests/components/deityAssignmentPanel.test.jsx': 4,
  'tests/components/deityEffectPreview.test.jsx': 2,
  'tests/components/deityPanelManifestParity.test.jsx': 1,
  'tests/components/deityRestoreFromWorldPanel.test.jsx': 1,
  'tests/components/destroyConfirmSurfaces.test.jsx': 1,
  'tests/components/dmPinsTierGate.test.jsx': 1,
  'tests/components/dossierDepthTabs.test.jsx': 5,
  'tests/components/dossierLadderModal.test.jsx': 1,
  'tests/components/economicsPlotHookSeam.test.jsx': 1,
  'tests/components/economicsTabMalformedFlows.test.jsx': 1,
  'tests/components/engineSections.test.jsx': 2,
  'tests/components/faithSection.test.jsx': 8,
  'tests/components/fogTierGate.test.jsx': 1,
  'tests/components/frozenTenseDefenseCopy.test.js': 2,
  'tests/components/g5FirstSurveyCopy.test.js': 6,
  'tests/components/g5FirstSurveyPdfTwins.test.js': 3,
  'tests/components/gallery/galleryMapsUtils.test.js': 2,
  'tests/components/gallery/mapShareEditorCachedShareKind.test.jsx': 4,
  'tests/components/gallery/mapShareEditorPreserveOnOmit.test.jsx': 4,
  'tests/components/generatorPresentationTranslation.test.jsx': 3,
  'tests/components/handbookClaimsParity.test.js': 2,
  'tests/components/handbookVoice.test.jsx': 2,
  'tests/components/heraldCommandBrief.test.jsx': 1,
  'tests/components/heraldCommandDecisions.test.jsx': 3,
  'tests/components/heraldCommandSelectors.test.js': 1,
  'tests/components/heraldCommandSession.test.js': 1,
  'tests/components/heraldTranslationFloor.test.js': 1,
  'tests/components/mapChainsTierGate.test.jsx': 3,
  'tests/components/mobilePrimitives.test.jsx': 2,
  'tests/components/navDividers.test.jsx': 2,
  'tests/components/navFletching.test.jsx': 13,
  'tests/components/navFlowArrows.test.jsx': 1,
  'tests/components/npcRowLockToggle.test.jsx': 2,
  'tests/components/pantheonActivationStrip.test.jsx': 2,
  'tests/components/pantheonPanel.test.jsx': 1,
  'tests/components/primitivesTi.test.js': 1,
  'tests/components/privacyPolicyParity.test.js': 2,
  'tests/components/provenanceEditGate.test.js': 1,
  'tests/components/publicChronicleTab.test.jsx': 2,
  'tests/components/realmForecastHonesty.test.jsx': 2,
  'tests/components/realmVerbComposerTranslation.test.jsx': 2,
  'tests/components/roadScenePanel.test.jsx': 2,
  'tests/components/saveQuotaMeter.test.jsx': 2,
  'tests/components/sessionMode.test.jsx': 4,
  'tests/components/simulationDrawerPresentation.test.jsx': 1,
  'tests/components/statBandsOverDigits.test.jsx': 6,
  'tests/components/surveyorConsentWiring.test.jsx': 2,
  'tests/components/tableLedgerPanel.test.jsx': 2,
  'tests/components/termsRefundsSection.test.jsx': 1,
  'tests/components/tradeDynamicsGoodsSource.test.js': 2,
  'tests/components/uiMiscHardening.test.jsx': 1,
  'tests/components/versionsTabPitchHonesty.test.js': 4,
  'tests/components/warFaithMapOverlay.test.jsx': 1,
  'tests/components/worldMapShellMemo.test.jsx': 1,
  'tests/components/worldPulseTranslation.test.jsx': 1,
  'tests/config/illustratedLensFree.test.js': 1,
  'tests/config/pageBackgrounds.test.js': 1,
  'tests/copy/copy.test.js': 3,
  'tests/copy/localeParity.test.js': 1,
  'tests/copy/narrativeArchiveDisclosure.test.js': 1,
  'tests/copy/pricingP9.test.js': 8,
  'tests/data/roadmapLedger.test.js': 3,
  'tests/design/brandLockup.test.jsx': 4,
  'tests/design/compositedBarAA.test.js': 2,
  'tests/design/organicInk.test.js': 1,
  'tests/design/organicLogo.test.js': 4,
  'tests/design/organicRules.test.js': 1,
  'tests/design/organicSamples.test.js': 2,
  'tests/design/townMapStyleWall.test.js': 6,
  'tests/docs/abuseModelFreshness.test.js': 1,
  'tests/docs/architectureFreshness.test.js': 1,
  'tests/docs/docCounts.test.js': 9,
  'tests/docs/enforcement-claims.test.js': 4,
  'tests/domain/advanceCampaignWorldInterval.test.js': 1,
  'tests/domain/advanceIntervalProgressYield.test.js': 1,
  'tests/domain/aiAnalyst.test.js': 14,
  'tests/domain/aiCharter.test.js': 8,
  'tests/domain/aiGrounding.test.js': 2,
  'tests/domain/aiGroundingLensSource.test.js': 1,
  'tests/domain/aiInterpret.test.js': 7,
  'tests/domain/aiOutputSchema.test.js': 9,
  'tests/domain/aiParley.test.js': 6,
  'tests/domain/aiSpendAlarm.test.js': 2,
  'tests/domain/applyDispatch.test.js': 3,
  'tests/domain/atrocityCasusWr8.test.js': 3,
  'tests/domain/bandPolarity.test.js': 4,
  'tests/domain/beliefAxisSubjects.test.js': 1,
  'tests/domain/believedRazingCasusWr8.test.js': 2,
  'tests/domain/briefs.test.js': 1,
  'tests/domain/brokerageIntercept.test.js': 8,
  'tests/domain/calamity.kernel.integration.test.js': 5,
  'tests/domain/candidateTypeVoicePhrasing.walker.test.js': 1,
  'tests/domain/capacityModel.test.js': 1,
  'tests/domain/causalThreatCorrectnessFixes.test.js': 2,
  'tests/domain/causeConjunctionContent.test.js': 4,
  'tests/domain/causeResolutionLifecycle.test.js': 5,
  'tests/domain/causeWalk.test.js': 3,
  'tests/domain/certificationClaimsParity.test.js': 1,
  'tests/domain/changeAuthorityPolicy.contract.test.js': 3,
  'tests/domain/chronicleAndReconcile.test.js': 1,
  'tests/domain/chronicleGraph.test.js': 2,
  'tests/domain/chronicleTimeline.test.js': 2,
  'tests/domain/chroniclersLetter.test.js': 2,
  'tests/domain/commercialReasons.test.js': 3,
  'tests/domain/conquestExecutionWr8.test.js': 5,
  'tests/domain/conquestFeasibilityWr8.test.js': 1,
  'tests/domain/conquestIntentWr8.test.js': 1,
  'tests/domain/constructCompile.test.js': 2,
  'tests/domain/corpusStaging.test.js': 2,
  'tests/domain/councilSchismKernel.test.js': 3,
  'tests/domain/customCategories.test.js': 2,
  'tests/domain/customContentCompile.test.js': 2,
  'tests/domain/customContentPresentationClaims.test.js': 6,
  'tests/domain/customContentSchema.test.js': 2,
  'tests/domain/customContentTierGates.test.js': 1,
  'tests/domain/customTownScenePresentation.test.js': 3,
  'tests/domain/dailyLife.test.js': 2,
  'tests/domain/deploymentReturnLevyConservation.test.js': 1,
  'tests/domain/deploymentReturnOccupied.test.js': 3,
  'tests/domain/determinismLeaks.test.js': 4,
  'tests/domain/discourseKernel.test.js': 5,
  'tests/domain/display/armyStrength.test.js': 5,
  'tests/domain/display/bTrackSurfacingSoak.test.js': 2,
  'tests/domain/display/dossierViewModel.test.js': 3,
  'tests/domain/display/mobilizationStatus.test.js': 2,
  'tests/domain/display/occupationStatus.test.js': 1,
  'tests/domain/display/publicSafe.test.js': 5,
  'tests/domain/display/tradePressure.test.js': 2,
  'tests/domain/display/visibilityAudit.test.js': 2,
  'tests/domain/display/warTradeReadModels.test.js': 5,
  'tests/domain/dispositionChannels.test.js': 1,
  'tests/domain/dispositionNews.test.js': 5,
  'tests/domain/districtProfile.test.js': 1,
  'tests/domain/dmScreenView.test.js': 2,
  'tests/domain/domainCoreReviewFixes.test.js': 4,
  'tests/domain/dossier/entityIndex.test.js': 1,
  'tests/domain/economyStateProseDesk.test.js': 4,
  'tests/domain/entrepots.kernel.integration.test.js': 1,
  'tests/domain/envoyBelief.test.js': 1,
  'tests/domain/envoyDiplomacy.test.js': 8,
  'tests/domain/envoyErrand.test.js': 8,
  'tests/domain/envoyNews.test.js': 7,
  'tests/domain/evaluateInstitutionLifecycle.test.js': 2,
  'tests/domain/eventPipeline.test.js': 4,
  'tests/domain/eventProse.test.js': 2,
  'tests/domain/events/forceReconsiderationComposite.test.js': 1,
  'tests/domain/events/realmCoverage.walker.test.js': 1,
  'tests/domain/events/restoreFoodAnchorScope.test.js': 2,
  'tests/domain/events/restoreScope.test.js': 2,
  'tests/domain/events/targetFirstIndex.test.js': 3,
  'tests/domain/events/wave2Producers.test.js': 4,
  'tests/domain/eventsSubsystemFixes.test.js': 2,
  'tests/domain/explanation.test.js': 2,
  'tests/domain/factionNamePrecedence.test.js': 1,
  'tests/domain/factionProfile.test.js': 1,
  'tests/domain/forecastRun.test.js': 2,
  'tests/domain/formatNumber.test.js': 3,
  'tests/domain/generosityEV.test.js': 1,
  'tests/domain/generosityKernel.credit.test.js': 1,
  'tests/domain/generosityKernel.purchase.test.js': 1,
  'tests/domain/generosityKernel.refuge.test.js': 1,
  'tests/domain/generosityKernel.zeroGrainGift.test.js': 2,
  'tests/domain/guidanceRegistry.walker.test.js': 2,
  'tests/domain/hegemonyRead.test.js': 1,
  'tests/domain/heraldIndex.test.js': 2,
  'tests/domain/heraldIntegrity.test.js': 5,
  'tests/domain/historyBeats.test.js': 2,
  'tests/domain/hookEscalation.test.js': 1,
  'tests/domain/humanizeEngineTokens.test.js': 1,
  'tests/domain/infoModeUnlock.test.js': 1,
  'tests/domain/institutionLifecycle.test.js': 1,
  'tests/domain/institutionsForCategory.test.js': 1,
  'tests/domain/institutionsForPower.test.js': 2,
  'tests/domain/intentAtlasSoakDistiller.test.js': 2,
  'tests/domain/interview.test.js': 9,
  'tests/domain/interviewCampaignScope.test.js': 1,
  'tests/domain/legacyGeneratorQuarantine.test.js': 1,
  'tests/domain/lineageClaim.test.js': 3,
  'tests/domain/lineageNews.test.js': 4,
  'tests/domain/marketPrices.test.js': 10,
  'tests/domain/migrationWithMortality.test.js': 2,
  'tests/domain/momentumLedger.test.js': 1,
  'tests/domain/negotiationExportLeg.test.js': 1,
  'tests/domain/neighbourBackLink.test.js': 1,
  'tests/domain/newsBody.test.js': 1,
  'tests/domain/npc/npcStasisSnapshot.test.js': 1,
  'tests/domain/npcAgencyExposeSubject.test.js': 1,
  'tests/domain/npcCredibilityLadderHook.test.js': 1,
  'tests/domain/npcDmVerbs.test.js': 7,
  'tests/domain/npcInteriorityRead.test.js': 3,
  'tests/domain/npcLadderBonds.test.js': 1,
  'tests/domain/npcLadderContest.test.js': 2,
  'tests/domain/npcProfile.test.js': 3,
  'tests/domain/peaceCausalVerbs.test.js': 2,
  'tests/domain/peaceReasons.test.js': 1,
  'tests/domain/pendingEdits.test.js': 2,
  'tests/domain/personaSlicer.test.js': 2,
  'tests/domain/personaSlicerFactionRoster.test.js': 1,
  'tests/domain/pietyDynamics.test.js': 1,
  'tests/domain/politicsEventsReligionG1c.test.js': 1,
  'tests/domain/pressureModel.test.js': 6,
  'tests/domain/razingWitnessWr8.test.js': 3,
  'tests/domain/razingWr8.test.js': 4,
  'tests/domain/realmItemAttention.test.js': 1,
  'tests/domain/realmMagicDefaultConsumers.test.js': 1,
  'tests/domain/realmPlateRenderer.test.js': 2,
  'tests/domain/reasonHeadlineRegister.test.js': 1,
  'tests/domain/regionRelationshipB06Fixes.test.js': 2,
  'tests/domain/regionalEngine.test.js': 2,
  'tests/domain/regionalEventLogBounds.test.js': 2,
  'tests/domain/regionalNowThreading.test.js': 7,
  'tests/domain/regionalPropagationDedupe.test.js': 1,
  'tests/domain/relationshipCompatibility.test.js': 2,
  'tests/domain/relationshipDynamics.test.js': 2,
  'tests/domain/relationshipHierarchyCascade.test.js': 1,
  'tests/domain/relationshipMemory.test.js': 1,
  'tests/domain/resourceDynamicsApply.test.js': 3,
  'tests/domain/resourceDynamicsKernel.test.js': 3,
  'tests/domain/round3WaveF3Couplings.test.js': 2,
  'tests/domain/ruinFilter.probe.test.js': 1,
  'tests/domain/schemaCanonicalShape.test.js': 2,
  'tests/domain/schemaDrift.test.js': 1,
  'tests/domain/seaLanes.test.js': 1,
  'tests/domain/seasonalFoodYear.test.js': 3,
  'tests/domain/sendTwoDivergenceWr7d.test.js': 1,
  'tests/domain/settlementBeliefs.test.js': 1,
  'tests/domain/settlementLifecycleFirstClass.test.js': 1,
  'tests/domain/settlementRumors.test.js': 2,
  'tests/domain/simulationProfileLegacyNormalize.test.js': 3,
  'tests/domain/simulationProfileValidate.test.js': 2,
  'tests/domain/simulationRulesPreset.stability.test.js': 10,
  'tests/domain/simulationSpine.test.js': 4,
  'tests/domain/statefulArmies.test.js': 2,
  'tests/domain/stressorCounterforces.test.js': 2,
  'tests/domain/styleOverhaulCompile.test.js': 3,
  'tests/domain/subsystemRowsWar.test.js': 1,
  'tests/domain/successors.test.js': 2,
  'tests/domain/tableEvents.test.js': 2,
  'tests/domain/tableLedger.test.js': 6,
  'tests/domain/tempoGovernor.property.test.js': 4,
  'tests/domain/tierResourceDynamics.test.js': 8,
  'tests/domain/tonightAtTheTable.test.js': 1,
  'tests/domain/townLayoutV2.test.js': 2,
  'tests/domain/townMapFog.test.js': 1,
  'tests/domain/townMapIllustratedLens.test.js': 1,
  'tests/domain/townMapSkinRegistry.test.js': 1,
  'tests/domain/townPanorama.test.js': 2,
  'tests/domain/townSceneManifest.test.js': 1,
  'tests/domain/tradeCoercion.test.js': 2,
  'tests/domain/tradeSalience.test.js': 1,
  'tests/domain/traditionsKernel.test.js': 2,
  'tests/domain/traditionsRelations.test.js': 1,
  'tests/domain/treatyLifecycleVoice.test.js': 7,
  'tests/domain/upswingKernel.test.js': 3,
  'tests/domain/userEdits.test.js': 4,
  'tests/domain/validation/consistency.test.js': 6,
  'tests/domain/vengeanceLicenseWr8.test.js': 7,
  'tests/domain/warCoalitionEvidence.test.js': 3,
  'tests/domain/warCoalitionExpenditure.test.js': 3,
  'tests/domain/warCoalitionNews.test.js': 8,
  'tests/domain/warCoalitionRuntimeEvidenceWr6.test.js': 1,
  'tests/domain/warCoalitionWr6.test.js': 7,
  'tests/domain/warCosts.test.js': 16,
  'tests/domain/warCostsIntegration.test.js': 3,
  'tests/domain/warCostsNews.test.js': 2,
  'tests/domain/warDeployment.test.js': 1,
  'tests/domain/warMechanicsG1b.test.js': 1,
  'tests/domain/warRulingsNews.test.js': 4,
  'tests/domain/warRulingsWr5Regressions.test.js': 1,
  'tests/domain/warSeatBooksFactionAddress.test.js': 1,
  'tests/domain/wave1CohesionFixes.test.js': 1,
  'tests/domain/wizardNewsHeadlineFallback.test.js': 4,
  'tests/domain/worldPulseChronicleCuration.test.js': 1,
  'tests/domain/worldPulseLitBurndown.test.js': 1,
  'tests/domain/worldPulseNewsCuration.test.js': 3,
  'tests/domain/worldPulseRecordModes.test.js': 2,
  'tests/domain/worldPulseTickClock.test.js': 1,
  'tests/domain/worldSnapshotPublic.test.js': 24,
  'tests/domain/worldStateLedger.persistence.test.js': 7,
  'tests/edgeFunctions/accountActionsSupportWrite.test.js': 3,
  'tests/edgeFunctions/accountDeletionDurableWorker.test.js': 4,
  'tests/edgeFunctions/aiGroundingContract.test.js': 7,
  'tests/edgeFunctions/aiOutputToolWiring.test.js': 8,
  'tests/edgeFunctions/aiProviderAbstraction.test.js': 6,
  'tests/edgeFunctions/analyticsEventsBundle.freshness.test.js': 1,
  'tests/edgeFunctions/autoReloadLifetime.test.js': 1,
  'tests/edgeFunctions/autoReloadWebhookRace.test.js': 2,
  'tests/edgeFunctions/autonomyCore.test.js': 2,
  'tests/edgeFunctions/checkoutAsyncPaymentFailure.test.js': 3,
  'tests/edgeFunctions/contracts.test.js': 23,
  'tests/edgeFunctions/creditFlow.test.js': 3,
  'tests/edgeFunctions/customContentManifestAuthority.test.js': 4,
  'tests/edgeFunctions/entityRefWrapper.test.js': 2,
  'tests/edgeFunctions/intentAtlasBundle.freshness.test.js': 1,
  'tests/edgeFunctions/paymentRefundDurableWorker.test.js': 4,
  'tests/edgeFunctions/promptEfficiency.test.js': 1,
  'tests/edgeFunctions/surveyorByok.test.js': 15,
  'tests/edgeFunctions/surveyorKillSwitch.test.js': 1,
  'tests/foundry/foundryFaithGate.test.js': 7,
  'tests/foundry/foundryManifest.test.js': 4,
  'tests/foundry/foundryWorldModule.test.js': 10,
  'tests/foundry/markdownEscapeSingleWriter.test.js': 6,
  'tests/helpers/kindPoolWalker.test.js': 1,
  'tests/helpers/sourceContract.test.js': 2,
  'tests/lib/accountContentPortability.test.js': 1,
  'tests/lib/accountData.test.js': 1,
  'tests/lib/accountImport.test.js': 6,
  'tests/lib/advanceParanoia.test.js': 2,
  'tests/lib/advanceWorkerClient.test.js': 1,
  'tests/lib/analyticsQueue.test.js': 1,
  'tests/lib/authSecurity.test.js': 1,
  'tests/lib/constructionUsage.test.js': 2,
  'tests/lib/contentPacks.test.js': 6,
  'tests/lib/crashForensics.test.js': 1,
  'tests/lib/customContentArchive.test.js': 2,
  'tests/lib/customContentLocalLedger.test.js': 7,
  'tests/lib/editFingerprint.test.js': 1,
  'tests/lib/emailTemplates.test.js': 7,
  'tests/lib/errorReporter.test.js': 5,
  'tests/lib/flags.test.js': 1,
  'tests/lib/gallery.test.js': 4,
  'tests/lib/galleryChronicle.test.js': 1,
  'tests/lib/galleryDescriptionScrub.test.js': 6,
  'tests/lib/galleryRealmArc.test.js': 1,
  'tests/lib/galleryTagsClamp.test.js': 2,
  'tests/lib/galleryTitleAliveness.test.js': 2,
  'tests/lib/imFellFace.test.js': 2,
  'tests/lib/importReconciliation.test.js': 1,
  'tests/lib/importReconciliationRecovery.test.js': 6,
  'tests/lib/importScrub.test.js': 1,
  'tests/lib/instantWorld/composeInstantWorld.test.js': 1,
  'tests/lib/instantWorld/factionDedup.test.js': 3,
  'tests/lib/instantWorld/mundaneRealmProjection.test.js': 2,
  'tests/lib/mapLayerAnalytics.test.js': 1,
  'tests/lib/mapRuntimeConfig.test.js': 2,
  'tests/lib/mapShareGalleryFields.test.js': 5,
  'tests/lib/pulseFingerprint.test.js': 5,
  'tests/lib/regionalFingerprint.test.js': 2,
  'tests/lib/regionalMapOverlay.test.js': 2,
  'tests/lib/roadNetworkMst.test.js': 1,
  'tests/lib/sanitizeGalleryHtml.test.js': 7,
  'tests/lib/sanitizeGalleryHtmlIsolation.test.js': 4,
  'tests/lib/seo.test.js': 4,
  'tests/lib/seoCompendium.test.js': 1,
  'tests/lib/shareImage.test.js': 5,
  'tests/lib/spatialUsage.test.js': 5,
  'tests/lib/structuralFingerprint.test.js': 1,
  'tests/lib/surveyorByok.test.js': 2,
  'tests/lib/terrainReaderRouting.test.jsx': 3,
  'tests/lib/townMapFogExport.test.js': 4,
  'tests/lint/bandPolaritySingleSourceScan.test.js': 1,
  'tests/lint/commercialKindPools.walker.test.js': 3,
  'tests/lint/copyCorruption.test.js': 1,
  'tests/lint/determinismBanCoverage.test.js': 1,
  'tests/lint/domainStrictFailClosed.test.js': 2,
  'tests/lint/envoyErrandLedgerSingleWriter.walker.test.js': 1,
  'tests/lint/envoyKindPools.walker.test.js': 4,
  'tests/lint/grammarLifecycleKindPools.walker.test.js': 6,
  'tests/lint/lineageKindPools.walker.test.js': 6,
  'tests/lint/localeCompareGuard.test.js': 1,
  'tests/lint/localeFormatGuard.test.js': 1,
  'tests/lint/lucideTotality.test.js': 1,
  'tests/lint/namedPersonTransitTotality.walker.test.js': 1,
  'tests/lint/premiumGateSingleSource.test.js': 1,
  'tests/lint/significanceMigration.census.test.js': 4,
  'tests/lint/testRatchet.test.js': 2,
  'tests/lint/vocabularyTotality.walker.test.js': 1,
  'tests/lint/warCoalitionKindPools.walker.test.js': 3,
  'tests/lint/warCostKindPools.walker.test.js': 6,
  'tests/lint/warRulingKindPools.walker.test.js': 3,
  'tests/ops/advanceWorkerEvidence.test.js': 1,
  'tests/ops/backupRestoreDrill.test.js': 5,
  'tests/ops/behavioralObservation.test.js': 1,
  'tests/ops/migrationRehearsal.test.js': 2,
  'tests/ops/postDeployVerify.test.js': 3,
  'tests/ops/wholeWorldSoakSpatialFixture.test.js': 2,
  'tests/ops/worktreeInventory.test.js': 2,
  'tests/pdf/exportDateSeam.test.js': 1,
  'tests/pdf/missingValuePlaceholders.test.js': 7,
  'tests/pdf/pdfLiveWorldParity.test.js': 1,
  'tests/pdf/proseText.test.jsx': 2,
  'tests/pdf/restoredSubsections.test.js': 5,
  'tests/pdf/timelineTimestampTimezone.test.js': 4,
  'tests/pdf/viewModelDocReference.test.js': 1,
  'tests/pdf/worldBook.test.js': 5,
  'tests/security/accountDeletionCleanupQueue.pglite.test.js': 2,
  'tests/security/accountDeletionProcessing.pglite.test.js': 4,
  'tests/security/adminLeastPrivilege.pglite.test.js': 7,
  'tests/security/adminUserManagement.pglite.test.js': 7,
  'tests/security/byokNeverLogged.test.js': 8,
  'tests/security/cspForkIsolation.test.js': 5,
  'tests/security/cspHeaderShape.test.js': 7,
  'tests/security/customContentDeities.pglite.test.js': 2,
  'tests/security/customContentLockOrder.postgres.test.js': 1,
  'tests/security/customContentVersions.pglite.test.js': 1,
  'tests/security/dossierEntitlements.pglite.test.js': 3,
  'tests/security/edgeLogRedaction.test.js': 3,
  'tests/security/factionMemberPublicParity.pglite.test.js': 2,
  'tests/security/founderSeats.pglite.test.js': 1,
  'tests/security/foundersRoll.pglite.test.js': 3,
  'tests/security/galleryCommentModeration.pglite.test.js': 2,
  'tests/security/galleryMapMemberCount.pglite.test.js': 3,
  'tests/security/galleryReactions.pglite.test.js': 1,
  'tests/security/gallerySanitize.pglite.test.js': 2,
  'tests/security/gallerySeedLeak.pglite.test.js': 6,
  'tests/security/galleryUnlisted.pglite.test.js': 1,
  'tests/security/gallery_privacy.contract.test.js': 12,
  'tests/security/importReconciliationCommands.pglite.test.js': 2,
  'tests/security/intentAtlasIdFree.test.js': 11,
  'tests/security/ipPrivacy.test.js': 2,
  'tests/security/mapForkXssChain.test.js': 61,
  'tests/security/moneyRpcNetCurrentGuards.test.js': 1,
  'tests/security/neighbourBacklinkMerge.pglite.test.js': 1,
  'tests/security/referralRedeem.pglite.test.js': 3,
  'tests/security/refundLedger.contract.test.js': 3,
  'tests/security/reviewedSupplyChainPersistence.pglite.test.js': 1,
  'tests/security/supportTickets.pglite.test.js': 3,
  'tests/security/surveyorByokHealth.pglite.test.js': 1,
  'tests/security/surveyorProbeTierSql.pglite.test.js': 5,
  'tests/security/surveyorProvisioning.pglite.test.js': 2,
  'tests/security/systemConfigPublicRead.pglite.test.js': 1,
  'tests/security/tierCreditMultiplierSql.pglite.test.js': 3,
  'tests/security/townMapEditsPublicDrop.test.js': 1,
  'tests/security/townMapFogPublicDrop.test.js': 1,
  'tests/security/townMapGalleryOptIn.test.js': 4,
  'tests/security/townMapPlayerProjection.test.js': 1,
  'tests/security/townSceneFogFailClosed.test.js': 2,
  'tests/security/townScenePlayerSafe.test.js': 17,
  'tests/store/accountImportSlice.test.js': 9,
  'tests/store/campaignSlice.worldPulse.test.js': 1,
  'tests/store/campaignWorldPulseControlLayer.test.js': 2,
  'tests/store/customContentHydrationOrdering.test.js': 1,
  'tests/store/destroyWriterConvergence.test.js': 1,
  'tests/store/importReconciliationRpcProjection.test.js': 4,
  'tests/store/importTableEvents.test.js': 1,
  'tests/store/lifecycleRoundTrip.test.js': 9,
  'tests/store/narrativeStampParity.test.js': 2,
  'tests/store/npcVerbs.test.js': 2,
  'tests/store/onboardingNudge.test.js': 2,
  'tests/store/operations.test.js': 1,
  'tests/store/outbox.test.js': 1,
  'tests/store/pendingEditTransaction.test.js': 2,
  'tests/store/persistSaveUpdate.unify.test.js': 1,
  'tests/store/proposalUndoRing.test.js': 2,
  'tests/store/pulseUndoAdvertising.test.js': 1,
  'tests/store/tableEventCommit.test.js': 5,
  'tests/store/uncanonizeTombstone.test.js': 2,
  'tests/ui/AiOverlayViolations.test.jsx': 1,
  'tests/ui/BandPill.test.jsx': 1,
  'tests/ui/CanonBadge.test.jsx': 2,
  'tests/ui/RegenerationDeltaCard.test.jsx': 1,
  'tests/ui/UndoHistoryPanel.test.jsx': 2,
  'tests/ui/beliefDivergenceBand.test.jsx': 2,
  'tests/ui/chronicleSnapshotShape.test.jsx': 7,
  'tests/ui/compendiumHubs.test.jsx': 1,
  'tests/ui/economicsTabFlow.test.js': 1,
  'tests/ui/heraldForecast.test.jsx': 2,
  'tests/ui/heraldHeadline.test.jsx': 5,
  'tests/ui/homeHeroAnonGauge.test.jsx': 3,
  'tests/ui/homeLanding.test.jsx': 1,
  'tests/ui/howToUseLivingWorld.test.jsx': 2,
  'tests/ui/libraryLivingSurface.test.jsx': 1,
  'tests/ui/mapDirtyFingerprint.test.js': 1,
  'tests/ui/networkEffectsAdvisoryPin.test.jsx': 4,
  'tests/ui/outputContainerFriendlyError.test.js': 2,
  'tests/ui/placementsLayerHover.test.jsx': 1,
  'tests/ui/pricingPageBands.test.jsx': 1,
  'tests/ui/realmHub.test.jsx': 3,
  'tests/ui/realmMagicWizardDefault.test.jsx': 1,
  'tests/ui/settlementMapLegibility.test.jsx': 1,
  'tests/ui/settlementPalette.a11y.test.jsx': 3,
  'tests/ui/settlementScene3D.test.jsx': 1,
  'tests/ui/spinnerKeyframeGlobal.test.js': 1,
  'tests/ui/uiA11yWave5.test.jsx': 1,
  'tests/ui/whileYouWereAway.test.jsx': 3,
  'tests/ui/wizardEmptyState.proofPair.test.jsx': 1,
  'tests/ui/wizardOutputToolbar.test.jsx': 1,
  'tests/ui/worldMapInWords.test.jsx': 1,
});

/**
 * ⛔ THE QUARANTINE — generation-facing debt, held APART and audited EXACTLY.
 *
 * The EP-2/EP-6 sweep drove tests/generators, tests/joins, tests/simulation and
 * tests/property to zero and this walker declared that win UNSPENDABLE. From 2026-07-30
 * the declaration went UNENFORCED, because the arm asserting it was itself frozen in the
 * test census, and in that window three files re-offended. Deleting the arm would hide the
 * re-offences; leaving it in the census would leave the guard disabled. So the
 * re-admissions are recorded here, in their own map, under a STRICTER rule than the
 * general roster:
 *
 *   • EXACT IDENTITY, never a ceiling. A new generation-facing file reds. A quarantined
 *     file that GROWS reds. A quarantined file that SHRINKS reds too, so a win cannot sit
 *     unbanked and quietly become slack for the next offender.
 *   • The general roster may not name a generation-facing file AT ALL, so this map is the
 *     only legal home for such a row and the ceiling lookup cannot be laundered.
 *   • THE TARGET IS `{}`. This is a burn-down worklist carrying a debt, not an amnesty and
 *     not a new ceiling. Emptying it restores the EP-2/EP-6 win outright.
 *
 * ⚠ OWNER-VISIBLE: this relaxes an absolute in-tree claim ("EXACT zero") to "exactly this
 * enumerated set". Enforcement against NEW offenders is UNCHANGED — strictly stronger, in
 * fact, since the census no longer tolerates the row. What is lost is the aspiration, and
 * it is owed back. Recorded in docs/FABLE_VALIDATION_QUEUE.md.
 */
const READMITTED_GENERATION_FACING = Object.freeze({
  'tests/generators/settlementOriginProse.test.js': 1,
  'tests/property/secrecyTradeDormancyFence.test.js': 1,
  'tests/property/treatyLifecycleVoiceDormancyFence.test.js': 3,
});

/** One file's ceiling: the general roster, else the quarantine, else ZERO. */
const ceilingFor = (file) => FROZEN_UNANCHORED_NEGATIVES[file] ?? READMITTED_GENERATION_FACING[file] ?? 0;

describe('negative-assertion anchor walker (habitat removal)', () => {
  const found = scanUnanchoredNegatives();
  const scannedFileCount = SCAN_ROOTS.reduce((total, root) => {
    const abs = join(ROOT, root);
    if (!existsSync(abs)) return total;
    return total + walk(abs).filter((filePath) => /\.test\.(js|jsx)$/.test(filePath)).length;
  }, 0);

  if (process.env.UPDATE_EPISTEMIC_ALLOWLIST) {
    test('REGENERATION MODE: prints the fresh literal and fails on purpose', () => {
      // Printed, never written. The allowlist is a reviewed artifact: an auto-writing
      // ratchet silently absorbs the regressions it exists to surface.
      console.log(`\n${renderLiteral(found)}\n`);
      expect(
        false,
        `UPDATE_EPISTEMIC_ALLOWLIST is set: the fresh FROZEN_UNANCHORED_NEGATIVES literal was`
        + ` printed above. Review every changed row, paste it into this file by hand, and re-run`
        + ` WITHOUT the env var. This mode always fails so it can never be mistaken for a pass.`,
      ).toBe(true);
    });
    return;
  }

  test('no NEW un-anchored negative assertion anywhere in the test corpus', () => {
    const violations = [];
    for (const [file, { count, lines }] of Object.entries(found)) {
      const ceiling = ceilingFor(file);
      if (count > ceiling) {
        violations.push(
          `${file}: ${count} un-anchored negative assertion(s) at line(s) ${lines.join(`, `)}`
          + ` (frozen ceiling ${ceiling}). A bare not.toContain/not.toMatch/not.toHaveProperty`
          + ` passes just as happily when the COLLECTION drifted away as when the member was`
          + ` correctly excluded — it outlives the regression it was written to catch. Pair it`
          + ` with a liveness anchor: expectPresentThenAbsent(before, after, member) for a`
          + ` removal, expectAbsentWithAnchor(collection, member, anchor) for a selection`
          + ` (tests/helpers/anchoredNegatives.js). If the anchor is genuinely structural, say`
          + ` why on the line: // anchored: <reason>.`,
        );
      }
    }
    expect(violations).toEqual([]);
  });

  test('inventory honesty: every frozen row still exists and still offends at its count', () => {
    // The GENERAL roster only. The quarantine is audited by exact identity below, which
    // already reds on a shrink, a growth, a deletion and an addition alike.
    const stale = [];
    for (const [file, ceiling] of Object.entries(FROZEN_UNANCHORED_NEGATIVES)) {
      const actual = found[file]?.count ?? 0;
      if (!existsSync(join(ROOT, file))) {
        stale.push(`${file}: deleted or moved — remove its FROZEN_UNANCHORED_NEGATIVES row`);
      } else if (actual < ceiling) {
        stale.push(
          `${file}: ${actual} un-anchored site(s) found, ceiling ${ceiling} — a site was`
          + ` anchored; LOWER the row to ${actual} (delete it at 0) to bank the win`,
        );
      }
    }
    expect(stale).toEqual([]);
  });

  test('the scan is not vacuous (it walks the whole corpus and still sees the habitat)', () => {
    expect(scannedFileCount, 'test files visited across the whole corpus').toBeGreaterThanOrEqual(1500);
    const totalFound = Object.values(found).reduce((n, { count }) => n + count, 0);
    const totalFrozen = [...Object.values(FROZEN_UNANCHORED_NEGATIVES),
      ...Object.values(READMITTED_GENERATION_FACING)].reduce((a, b) => a + b, 0);
    expect(
      totalFound,
      'the scan found fewer un-anchored negatives than the frozen inventory — either sites'
      + ' were anchored (lower their rows) or the scanner broke',
    ).toBeGreaterThanOrEqual(totalFrozen);
  });

  test('the general roster may never launder a generation-facing file', () => {
    // THE ONE LAUNDERING PATH that would blind everything else: a generation-facing row in
    // the GENERAL roster raises that file's ceiling in the arm above, so a new un-anchored
    // negative in a swept tree would stop reding. Generation-facing debt has exactly one
    // legal home — the quarantine — and that home is audited by exact identity.
    const laundered = Object.keys(FROZEN_UNANCHORED_NEGATIVES).filter(inGenerationTree).sort();
    expect(laundered, 'a generation-facing file may not take a general roster row').toEqual([]);
    const misfiled = Object.keys(READMITTED_GENERATION_FACING).filter((f) => !inGenerationTree(f)).sort();
    expect(misfiled, 'the quarantine holds generation-facing files ONLY').toEqual([]);
  });

  test('the generation-facing quarantine is EXACT (a new, grown or unbanked offender reds)', () => {
    // ⛔ EXACT IDENTITY, both directions — this is the EP-2/EP-6 win's replacement guard,
    // and it is deliberately stricter than a ceiling. New file reds; grown count reds;
    // SHRUNK count reds too, so a repair must be banked here the moment it lands.
    // TARGET: {}.
    const live = Object.fromEntries(
      Object.entries(found)
        .filter(([file]) => inGenerationTree(file))
        .map(([file, { count }]) => [file, count]),
    );
    expect(
      live,
      'the live generation-facing population must equal READMITTED_GENERATION_FACING EXACTLY'
      + ' — a new un-anchored negative in a swept tree, or growth in a quarantined one, reds here',
    ).toEqual({ ...READMITTED_GENERATION_FACING });
  });

  // ── GUARD-THE-GUARD: the detector, on fixtures ─────────────────────────────
  // A scanner regression reads as "no offenders", which is indistinguishable from
  // success. Prove the detection rules directly. `countIn` mirrors the per-line logic
  // of scanUnanchoredNegatives exactly, so a change to one that is not made to the
  // other reds here.
  const countIn = (source) => {
    const lines = source.split(`\n`);
    let n = 0;
    for (let i = 0; i < lines.length; i += 1) {
      BARE_NEGATIVE_RE.lastIndex = 0;
      const occurrences = [...lines[i].matchAll(BARE_NEGATIVE_RE)].length;
      if (!occurrences) continue;
      if (HELPER_RE.test(lines[i])) continue;
      if (ANNOTATION_RE.test(lines[i])) continue;
      if (i > 0 && ANNOTATION_RE.test(lines[i - 1])) continue;
      n += occurrences;
    }
    return n;
  };

  test('the detector fires on every bare negative spelling', () => {
    // anchored: detector fixture — the matcher lives inside the string under test
    expect(countIn(`expect(roster).not.toContain('re-rt-1');`), 'bare not.toContain').toBe(1);
    // anchored: detector fixture
    expect(countIn(`expect(prose).not.toMatch(/\\bstone\\b/i);`), 'bare not.toMatch').toBe(1);
    // anchored: detector fixture
    expect(countIn(`expect(world).not.toHaveProperty('deityPool');`), 'bare not.toHaveProperty').toBe(1);
    // anchored: detector fixture
    expect(countIn(`expect(a).not.toContain('x');\nexpect(b).not.toContain('y');`), 'two sites, two lines').toBe(2);
    expect(
      // anchored: detector fixture
      countIn(`expect(x).not.toContain('a') && expect(y).not.toContain('b');`),
      'two sites sharing one line are both counted',
    ).toBe(2);
  });

  test('the detector stays silent on anchored forms', () => {
    expect(
      countIn(`expectPresentThenAbsent(before, after, 're-rt-1');`),
      'helper call carries no bare matcher at all',
    ).toBe(0);
    expect(
      countIn(`expectAbsentWithAnchor(roster, 're-rt-1', 're-rt-2', 'roster selection');`),
      'anchor helper',
    ).toBe(0);
    expect(
      countIn(`expect(roster).not.toContain('re-rt-1'); // anchored: length pinned above`),
      'same-line annotation',
    ).toBe(0);
    expect(
      countIn(`// anchored: the roster length is pinned two lines up\nexpect(roster).not.toContain('re-rt-1');`),
      'preceding-line annotation',
    ).toBe(0);
  });

  test('the detector ignores out-of-scope matchers and positive assertions', () => {
    // These compare against a value the test names, so drift changes the value rather
    // than emptying the subject — a different (and much louder) failure mode.
    expect(countIn(`expect(x).not.toBe(3);`), 'not.toBe is out of scope').toBe(0);
    expect(countIn(`expect(x).not.toEqual([]);`), 'not.toEqual is out of scope').toBe(0);
    expect(countIn(`expect(roster).toContain('re-rt-1');`), 'a positive assertion').toBe(0);
  });

  test('an annotation two lines above does NOT exempt (the escape hatch stays tight)', () => {
    // A reason must sit where a reader of the assertion will see it. Widening the
    // lookback would let an unrelated comment mute a whole block.
    expect(
      countIn(`// anchored: too far away to count\nconst roster = build();\nexpect(roster).not.toContain('x');`),
    ).toBe(1);
  });
});
