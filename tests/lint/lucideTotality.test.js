/**
 * lucideTotality.test.js — THE ICONS-OFF RATCHET (lane LU).
 *
 * WHAT RULE THIS ENFORCES. `src/components/primitives/IconsContext.js` is the
 * estate's ratified icons-off gate: "the redesign suppresses lucide/SVG icons
 * on EVERY surface except the Realm map". One Provider (AppViews.jsx:109) opts
 * the map subtree back in; everything else renders icons-off by the default.
 *
 * WHY IT NEEDED A GUARD RATHER THAN A COMMENT. The gate was documented and
 * unenforced, and both halves of it had quietly become fiction:
 *   1. IconsContext.js NAMED seven primitives as consulting the gate. FIVE of
 *      them — IconButton, StateBadge, CanonBadge, PhaseBadge and Disclosure —
 *      never called useIconsOn at all, so every state badge in the product
 *      rendered its lucide glyph straight through the redesign that had banned
 *      it. (This paragraph said FOUR until lane VT recounted it against
 *      423270de^: Disclosure was the fifth, and it gained the gate in the same
 *      LU-1 commit that deleted the badges' channels. A miscount inside the
 *      finding "the count was fiction" is that same defect one level up, so it
 *      is corrected rather than quietly left — and this is why the roster is
 *      now parsed instead of read.)
 *   2. 184 files imported lucide-react directly and rendered around the gate
 *      entirely, which no test could see because nothing counted them.
 * A prose contract that nobody can execute drifts silently for as long as it
 * exists. This file makes both halves executable.
 *
 * THE FOUR POPULATIONS, and the only legal moves for each. (It was three until
 * lane VT: IconsContext.js named TWELVE consulting primitives and this file
 * pinned NINE, because the ninth list's membership proof requires a lucide
 * import and three consumers take their glyph as a PROP instead. Three of the
 * estate's own named gate consumers were therefore covered by nothing at all.)
 *
 *   MAP_SUBTREE — the Realm map. The chair ruled (2026-08-03) that the map
 *     exception SURVIVES: "the map is a diagram, its icons encode data
 *     (TierIcon, MapLegend, RelationshipEdges opt in as today)". These files
 *     render inside the Provider and are ALLOWED to import lucide. The list is
 *     FROZEN AND ENUMERATED, deliberately NOT a `src/components/map/**` glob:
 *     a glob would silently exempt every future file dropped into that folder,
 *     which is precisely the ghost-headroom failure this whole lane exists to
 *     close. A genuinely new map-diagram file is added here on purpose, in a
 *     commit that says why.
 *     KNOWN BREADTH, RECORDED AS A DECISION NOT AS DRIFT: this list is wider
 *     than the diagram. It is the map subtree AS IT EXISTS TODAY, which the
 *     chair's "opt in as today" preserves, and it therefore also covers the
 *     map's panels and toolbars (HeraldStrip, RealmDashboard, WorldPulsePanel,
 *     TimelapsePanel, ...) whose icons are chrome rather than data. Narrowing
 *     it to the diagram proper is a chair call, not a maintenance call — see
 *     the lane LU STOP report. Until then these are fenced, not forgotten.
 *
 *   GATE_PRIMITIVES — primitives that import lucide but render it ONLY through
 *     `useIconsOn()`, so their glyphs appear inside the map Provider and vanish
 *     everywhere else. Membership is not self-declared: the honesty test below
 *     PROVES each one actually calls useIconsOn. That single assertion is the
 *     structural cure for defect (1) above — a primitive can never again be
 *     listed as consulting the gate while not consulting it.
 *
 *   PROP_ICON_CONSUMERS — primitives that consult the gate and import NO lucide,
 *     because the glyph arrives as a prop (IconButton, Pill, Segmented, Stat).
 *     The source scan is blind to them by construction, so they are pinned by
 *     name and proved to call useIconsOn — and a TOTALITY test asserts that
 *     these two consumer lists together are EXACTLY the set of files in src/
 *     that consult the gate, which is what makes "covered by nothing" a state
 *     the guard can no longer be in.
 *
 *   FROZEN_DIRECT_IMPORTERS — the surviving offenders. Every file here still
 *     imports lucide-react outside the map and outside the gate. The set is
 *     asserted EXACTLY, which makes it shrink-only in both directions:
 *       * a NEW file importing lucide is not in the set  -> RED
 *       * a file you CLEANED is still in the set         -> RED until you
 *         delete its row, so the win is banked and the list cannot go stale
 *         in the permissive direction.
 *     THE ONLY LEGAL MOVE IS TO DELETE A ROW. Never add one. If you are here
 *     because you added an icon, you do not need the icon: pass it to a gated
 *     primitive, or render the text the estate already renders beside it.
 *
 * HOW TO CLEAR A ROW (the whole recipe, so nobody has to re-derive it):
 *   1. If the icon is passed to a gated primitive (`<Button icon={...}>`,
 *      `<Badge icon=...>`, `<Stat icon=...>`, `<Segmented options=[{Icon}]>`),
 *      it is ALREADY suppressed at render — deleting the prop is dead-code
 *      removal with zero layout delta.
 *   2. If it is rendered directly (`<Sword className=... />`), delete the
 *      render AND ITS SLOT. Removing the glyph but leaving the wrapper span,
 *      the fixed-width box, or the literal space beside it leaves a phantom
 *      column — lane IC found 94 of those eating flex gaps across the dossier.
 *      A bare icon inside a `gap` flex row is safe to delete alone (the gap
 *      collapses); an icon inside its OWN sized/bordered element is not, and
 *      the element goes with it (see Dialog.jsx, DesktopOnlyGate.jsx,
 *      InstitutionCard.jsx for the house shape).
 *   3. If it is an AFFORDANCE rather than decoration (close, chevrons, +/-),
 *      it keeps a channel: fall back to the unicode TEXT glyph, which
 *      IconsContext.js explicitly rules "not icons and unaffected by this
 *      gate" (see Badge.jsx, Dialog.jsx, BottomSheet.jsx, Disclosure.jsx).
 *   4. Delete the file's row here. Run this test. It should stay green.
 *
 * ACCEPTED GAPS OF A SOURCE-SCAN GATE, stated so nobody trusts it past its
 * coverage. The detector matches the import SPECIFIER, not the renders, so:
 *   - it counts a file that imports lucide and renders nothing (harmless, and
 *     such a file should drop its import anyway);
 *   - it cannot see an icon reached through a dynamic `import('lucide-react')`
 *     or a re-export barrel. No such indirection exists in src today, and the
 *     non-vacuity test below proves the walk actually reads the tree, but a
 *     future barrel would be invisible here and is a known blind spot;
 *   - it does not police inline hand-authored <svg>, which the redesign also
 *     suppresses. That population is lane IC's, guarded by copyCorruption.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** The import specifier that brings a lucide glyph into a module. */
const LUCIDE_IMPORT = /(?:from|import)\s*\(?\s*['"]lucide-react['"]/;
/** The one call that proves a module routes its glyph through the gate. */
const CONSULTS_GATE = /useIconsOn\s*\(/;

/** Every .js/.jsx under src/, as forward-slashed repo-relative paths. */
function sourceFiles(dir = SRC, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) sourceFiles(abs, out);
    else if (/\.jsx?$/.test(name)) out.push(relative(ROOT, abs).split(sep).join('/'));
  }
  return out;
}

const FILES = sourceFiles();
const importsLucide = (f) => LUCIDE_IMPORT.test(readFileSync(join(ROOT, f), 'utf8'));
const consultsGate = (f) => CONSULTS_GATE.test(readFileSync(join(ROOT, f), 'utf8'));
const ACTUAL_IMPORTERS = FILES.filter(importsLucide).sort();

// ─────────────────────────────────────────────────────────────────────────────
// THE CENSUS. Frozen 2026-08-03 (lane LU), hand-audited, generated from the
// tree at that commit. Every path is forward-slashed so the guard reads the
// same on POSIX and Windows CI.
// ─────────────────────────────────────────────────────────────────────────────

/** The Realm map, opted back in by AppViews.jsx's IconsContext.Provider. */
const MAP_SUBTREE = Object.freeze([
  'src/components/map/AddressChain.jsx',
  'src/components/map/AdvanceReport.jsx',
  'src/components/map/AnnotateToolbar.jsx',
  'src/components/map/AssignDeityFromMap.jsx',
  'src/components/map/AutoplacementConsent.jsx',
  'src/components/map/BeliefDivergenceBand.jsx',
  'src/components/map/CampaignEmptyState.jsx',
  'src/components/map/CauseWalkPanel.jsx',
  'src/components/map/ChronicleScrollback.jsx',
  'src/components/map/ChroniclersLetterPanel.jsx',
  'src/components/map/GatheredAdjudication.jsx',
  'src/components/map/HeraldAdjudication.jsx',
  'src/components/map/HeraldBody.jsx',
  'src/components/map/HeraldCommandBody.jsx',
  'src/components/map/HeraldForecast.jsx',
  'src/components/map/HeraldHeadline.jsx',
  'src/components/map/HeraldJudgmentPointer.jsx',
  'src/components/map/HeraldMobileCompanion.jsx',
  'src/components/map/HeraldStrip.jsx',
  'src/components/map/LayersPanel.jsx',
  'src/components/map/LiveWarStatus.jsx',
  'src/components/map/MapLegend.jsx',
  'src/components/map/MapShareEditorOverlay.jsx',
  'src/components/map/ModeSwitch.jsx',
  'src/components/map/PantheonPanel.jsx',
  'src/components/map/PlacementDetailCard.jsx',
  'src/components/map/RealmDashboard.jsx',
  'src/components/map/RealmDocket.jsx',
  'src/components/map/RealmForecast.jsx',
  'src/components/map/RealmInspector.jsx',
  'src/components/map/RealmVerbComposer.jsx',
  'src/components/map/RoutesToolbar.jsx',
  'src/components/map/SettlementPalette.jsx',
  'src/components/map/SimulationRulesDialog.jsx',
  'src/components/map/TerrainToolbar.jsx',
  'src/components/map/TimelapsePanel.jsx',
  'src/components/map/TreatyPanel.jsx',
  'src/components/map/WarCausalBrief.jsx',
  'src/components/map/WarResolveSection.jsx',
  'src/components/map/WhileYouWereAway.jsx',
  'src/components/map/WizardNewsPanel.jsx',
  'src/components/map/WorldMapStage.jsx',
  'src/components/map/WorldMapToolbar.jsx',
  'src/components/map/WorldPulsePanel.jsx',
  'src/components/map/WorldPulsePrimitives.jsx',
]);

/** Primitives that import lucide but render it ONLY through useIconsOn(). */
const GATE_PRIMITIVES = Object.freeze([
  'src/components/primitives/ActionRail.jsx',
  'src/components/primitives/Badge.jsx',
  'src/components/primitives/BottomSheet.jsx',
  'src/components/primitives/Button.jsx',
  'src/components/primitives/DesktopOnlyGate.jsx',
  'src/components/primitives/Dialog.jsx',
  'src/components/primitives/Disclosure.jsx',
  'src/components/primitives/FounderBadge.jsx',
  'src/components/primitives/InstitutionCard.jsx',
]);

/**
 * The surviving offenders — SHRINK-ONLY. 127 rows on 2026-08-03.
 * Delete a row when you clear its file. Never add one.
 */
const FROZEN_DIRECT_IMPORTERS = Object.freeze([
  'src/App.jsx',
  'src/components/AccountMenu.jsx',
  'src/components/AiAnalystPanel.jsx',
  'src/components/AuthModal.jsx',
  'src/components/BuyThisDossier.jsx',
  'src/components/CampaignSyncBanner.jsx',
  'src/components/ChroniclePanel.jsx',
  'src/components/CompendiumPanel.jsx',
  'src/components/ControlsStrip.jsx',
  'src/components/EntityPicker.jsx',
  'src/components/FeedbackWidget.jsx',
  'src/components/GalleryDescriptionEditor.jsx',
  'src/components/GalleryPage.jsx',
  'src/components/HomeHero.jsx',
  'src/components/HomeLanding.jsx',
  'src/components/InterviewPanel.jsx',
  'src/components/OutputContainer.jsx',
  'src/components/PostGenCoach.jsx',
  'src/components/PublicDossierView.jsx',
  'src/components/PurchaseModal.jsx',
  'src/components/SessionEvictedBanner.jsx',
  'src/components/SettlementDetail.jsx',
  'src/components/SettlementsPanel.jsx',
  'src/components/ShareToGallery.jsx',
  'src/components/SingleDossierSuccessPage.jsx',
  'src/components/StaleNarrativeModal.jsx',
  'src/components/TableView.jsx',
  'src/components/UndoHistoryPanel.jsx',
  'src/components/compendium/CompendiumGlobalSearch.jsx',
  'src/components/compendium/ContentPackBar.jsx',
  'src/components/compendium/CustomContent.jsx',
  'src/components/compendium/CustomContentGate.jsx',
  'src/components/compendium/PantheonActivationStrip.jsx',
  'src/components/compendium/SupplyChainsManager.jsx',
  'src/components/compendium/customCategoryDefs.js',
  'src/components/contentStudio/ArchivedContentLibrary.jsx',
  'src/components/contentStudio/ContentDefinitionHistory.jsx',
  'src/components/contentStudio/ContentDraftEntry.jsx',
  'src/components/dev/DevFlagPanel.jsx',
  'src/components/dossier/CascadePreviewPanel.jsx',
  'src/components/dossier/DossierLadderModal.jsx',
  'src/components/dossier/DossierNarrativeButtons.jsx',
  'src/components/dossier/DossierTabStrip.jsx',
  'src/components/dossier/SimulationDrawer.jsx',
  'src/components/founders/ChairDrawer.jsx',
  'src/components/generate/ChangeModeBar.jsx',
  'src/components/generate/FoundingWorlds.jsx',
  'src/components/generate/SaveToLibraryButton.jsx',
  'src/components/generate/WizardLoadedBanners.jsx',
  'src/components/generate/WizardOutputToolbar.jsx',
  'src/components/guidance/SurveyorGlossary.jsx',
  'src/components/home/LandingArtifacts.jsx',
  'src/components/home/LandingBelowFold.jsx',
  'src/components/home/RegionWakeReplay.jsx',
  'src/components/home/WelcomeBackCard.jsx',
  'src/components/library/LibraryToolbar.jsx',
  'src/components/new/npcComponents.jsx',
  'src/components/new/tabs/NPCsTab.jsx',
  'src/components/new/tabs/NotesTab.jsx',
  'src/components/new/tabs/ServicesTab.jsx',
  'src/components/primitives/PortablePopup.jsx',
  'src/components/region/RegionalCausalChainViewer.jsx',
  'src/components/region/RegionalGraphSummary.jsx',
  'src/components/region/RegionalImpactInbox.jsx',
  'src/components/session/SessionMode.jsx',
  'src/components/settlement/AIInlineCard.jsx',
  'src/components/settlement/CatalogPicker.jsx',
  'src/components/settlement/CoherencePanel.jsx',
  'src/components/settlement/EventComposer.jsx',
  'src/components/settlement/ExportSheet.jsx',
  'src/components/settlement/FaithSection.jsx',
  'src/components/settlement/NarrativeArchivePanel.jsx',
  'src/components/settlement/NextActionRail.jsx',
  'src/components/settlement/PendingIntentions.jsx',
  'src/components/settlement/SuccessorPrompt.jsx',
  'src/components/settlement/Timeline.jsx',
  'src/components/settlement/eventComposer/ApplyControls.jsx',
  'src/components/settlement/eventComposer/BatchCart.jsx',
  'src/components/settlement/eventComposer/ComposerNavigator.jsx',
  'src/components/settlement/eventComposer/EventComposerConstants.js',
  'src/components/settlement/eventComposer/EventComposerTargetField.jsx',
  'src/components/settlementDetail/CharterRoadCard.jsx',
  'src/components/settlementDetail/SettlementDetailActions.jsx',
  'src/components/settlementDetail/SettlementDetailLinkNeighbourCard.jsx',
  'src/components/settlements/BulkActionBar.jsx',
  'src/components/settlements/CampaignFolder.jsx',
  'src/components/settlements/CampaignImportPanel.jsx',
  'src/components/settlements/LivingWorldGates.jsx',
  'src/components/settlements/SampleDashboard.jsx',
  'src/components/settlements/SettlementCard.jsx',
  'src/components/settlements/StructuredCampaignReconciliation.jsx',
  'src/components/surveyor/AutonomyPanel.jsx',
  'src/components/surveyor/CorpusFactoryPanel.jsx',
  'src/components/surveyor/InterpretApplyPanel.jsx',
  'src/components/surveyor/SurveyorDoor.jsx',
  'src/components/surveyor/SurveyorWorkshop.jsx',
  'src/components/surveyor/surveyorPanelKit.jsx',
]);

/**
 * Primitives whose icon channel was DELETED outright (lane LU-1), pinned at
 * zero so the removal cannot be quietly undone. Each keeps the two channels
 * IconsContext documents as surviving an icons-off badge: the kind's COLOR and
 * its uppercase TEXT label (P7).
 */
const NO_ICON_CHANNEL = Object.freeze([
  'src/components/primitives/StateBadge.jsx',
  'src/components/primitives/CanonBadge.jsx',
  'src/components/settlement/PhaseBadge.jsx',
]);

/**
 * THE FOURTH POPULATION — primitives that consult the gate and import NO lucide,
 * because their glyph arrives as a PROP (`icon={Sword}`, `options=[{ Icon }]`).
 *
 * WHY THEY NEED THEIR OWN LIST AND CANNOT JOIN GATE_PRIMITIVES. That list's
 * honesty test requires a lucide import — a row without one is reported as stale
 * and told to delete itself — so filing Pill/Segmented/Stat there would red the
 * guard for doing the right thing. But leaving them nowhere was the hole lane VT
 * found: IconsContext.js NAMED twelve consulting primitives and this file pinned
 * NINE, so three of the estate's own named gate consumers were covered by
 * nothing at all. A prop-fed primitive that quietly stopped calling useIconsOn
 * would render its caller's glyph on every surface, and the source scan — which
 * looks for a lucide IMPORT — is blind to it by construction. That is the same
 * blindness LU-2a recorded for IconButton, and the same cure: pin it by name.
 *
 * IconButton belongs here too, as of LU-2a's `glyph` twin. Its four render arms
 * are additionally pinned behaviourally in
 * tests/components/iconButtonGlyphChannel.test.jsx — the stronger proof — but
 * the row is kept because the TOTALITY test below is only total if every gate
 * consumer is named in exactly one place.
 */
const PROP_ICON_CONSUMERS = Object.freeze([
  'src/components/primitives/IconButton.jsx',
  'src/components/primitives/Pill.jsx',
  'src/components/primitives/Segmented.jsx',
  'src/components/primitives/Stat.jsx',
]);

/**
 * The gate's own declaration. It is not a consumer, and it is excluded from the
 * totality census by NAME rather than by luck: `CONSULTS_GATE` is a source match,
 * so it sees the hook's own definition line and — as lane VT proved on itself —
 * any COMMENT that spells the call with its parentheses. This file is the one
 * place whose prose must discuss that call, so it is named here instead of the
 * detector being weakened for everyone.
 */
const GATE_DECLARATION = 'src/components/primitives/IconsContext.js';

const ALLOWED = new Set([...MAP_SUBTREE, ...GATE_PRIMITIVES, ...FROZEN_DIRECT_IMPORTERS]);

/**
 * THE ROSTER PARSE (lane VT). IconsContext.js publishes its consumers as three
 * lettered rosters in a fixed shape — `ROSTER <letter>`, a colon closing the
 * description, then comma-separated names until the blank comment line. Reading
 * them here is what turns that comment from documentation into a contract: the
 * tests below assert each roster equals the set this file pins from the source,
 * so the prose and the code cannot disagree in either direction.
 */
function rosterNames(letter) {
  const doc = readFileSync(join(SRC, 'components/primitives/IconsContext.js'), 'utf8');
  const seg = doc.split(new RegExp(`ROSTER ${letter}\\b`))[1] || '';
  // The roster ends at the first blank comment line (` *` with nothing after it),
  // and the names begin after the LAST colon inside it — the descriptions carry
  // colons of their own, and taking the first one ate a name on the first run.
  const block = seg.split(/\n\s*\*\s*\n/)[0] || '';
  return block.slice(block.lastIndexOf(':') + 1)
    .replace(/^\s*\*/gm, ' ')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => /^[A-Z][A-Za-z]+$/.test(s))
    .sort();
}

/** `src/components/primitives/Pill.jsx` -> `Pill`. */
const basenames = (files) => files.map((f) => f.split('/').pop().replace(/\.jsx?$/, '')).sort();

/** Ratchet kindness: the failure message IS this guard's documentation. */
function newOffenderMessage(file) {
  return [
    file + ": imports lucide-react, and is in none of this guard's three lists.",
    'The estate suppresses icons on every surface except the Realm map',
    '(src/components/primitives/IconsContext.js). A new direct import renders',
    'AROUND that gate, which is the exact hole lane LU closed.',
    'TO COMPLY: pass the icon to a gated primitive (Button/Badge/Pill/Stat/',
    'Segmented/ActionRail all drop it automatically), or render the text label',
    'the surface already shows beside it, or — for a close/chevron AFFORDANCE —',
    'use the unicode text glyph the way Badge.jsx and Dialog.jsx do.',
    'THE LEGAL MOVES ARE COMPLY OR SHRINK. Do not add a row to',
    'FROZEN_DIRECT_IMPORTERS to make this pass.',
  ].join('\n  ');
}

describe('lucide totality — the icons-off gate is enforced, not merely documented', () => {
  test('the walk is not vacuous: it reads the real component tree', () => {
    // A zero-hit scan is only evidence if the scan read something. Lane IC was
    // bitten by exactly this: copyCorruption had been scanning two folders and
    // reporting clean for as long as it had existed.
    expect(FILES.length).toBeGreaterThan(500);
    for (const dir of [
      'src/components/primitives/', 'src/components/map/',
      'src/components/gallery/', 'src/components/account/',
    ]) {
      expect(FILES.some((f) => f.startsWith(dir))).toBe(true);
    }
    // And the detector finds the population it is meant to police.
    expect(ACTUAL_IMPORTERS.length).toBeGreaterThan(50);
  });

  test('no file outside the map, the gated primitives, and the frozen list imports lucide-react', () => {
    const violations = ACTUAL_IMPORTERS.filter((f) => !ALLOWED.has(f)).map(newOffenderMessage);
    expect(violations).toEqual([]);
  });

  test('honesty: every frozen offender still exists and still offends', () => {
    const stale = [];
    for (const file of FROZEN_DIRECT_IMPORTERS) {
      if (!FILES.includes(file)) {
        stale.push(file + ': gone or moved — delete its row from FROZEN_DIRECT_IMPORTERS.');
      } else if (!importsLucide(file)) {
        stale.push(file + ': CLEARED — delete its row from FROZEN_DIRECT_IMPORTERS so the win is banked.');
      }
    }
    expect(stale).toEqual([]);
  });

  test('honesty: every map-subtree exemption still exists and still imports lucide', () => {
    const stale = [];
    for (const file of MAP_SUBTREE) {
      if (!FILES.includes(file)) {
        stale.push(file + ': gone or moved — delete its row from MAP_SUBTREE.');
      } else if (!importsLucide(file)) {
        stale.push(file + ': no longer imports lucide — delete its row from MAP_SUBTREE.');
      }
    }
    expect(stale).toEqual([]);
  });

  test('THE CURE FOR THE DEFECT THAT STARTED THIS LANE: every gated primitive really calls useIconsOn', () => {
    // IconsContext.js used to NAME its consumers in prose. Four of the seven it
    // named never called useIconsOn, and nothing could tell. Membership of
    // GATE_PRIMITIVES is now proved from the source, on every run.
    const liars = [];
    for (const file of GATE_PRIMITIVES) {
      if (!FILES.includes(file)) {
        liars.push(file + ': gone or moved — delete its row from GATE_PRIMITIVES.');
        continue;
      }
      if (!importsLucide(file)) {
        liars.push(file + ': no longer imports lucide — delete its row from GATE_PRIMITIVES.');
      }
      if (!consultsGate(file)) {
        liars.push([
          file + ': listed as routing its icon through the gate, but it never calls useIconsOn().',
          'It therefore renders lucide on EVERY surface, including the ones the',
          'redesign suppresses. Either call useIconsOn() and gate the render, or',
          'drop the icon and move this file to FROZEN_DIRECT_IMPORTERS.',
        ].join('\n  '));
      }
    }
    expect(liars).toEqual([]);
  });

  test('THE THREE UNCOVERED CONSUMERS: a prop-fed primitive really calls useIconsOn', () => {
    // The companion to the test above, for the primitives the source scan cannot
    // reach. Each must exist, must consult the gate, and must NOT import lucide —
    // that last one is not decoration, it is the discriminator that says this file
    // belongs in THIS list rather than in GATE_PRIMITIVES.
    const liars = [];
    for (const file of PROP_ICON_CONSUMERS) {
      if (!FILES.includes(file)) {
        liars.push(file + ': gone or moved — delete its row from PROP_ICON_CONSUMERS.');
        continue;
      }
      if (!consultsGate(file)) {
        liars.push([
          file + ': listed as gating its prop-fed glyph, but it never calls useIconsOn().',
          'It therefore renders whatever glyph its CALLER passes on every surface,',
          'including the ones the redesign suppresses — and no lucide import exists',
          'here for the source scan to catch, which is the whole reason this row is',
          'pinned by name. Either call useIconsOn() and gate the render, or say in',
          'IconsContext.js that this primitive is not a gate consumer.',
        ].join('\n  '));
      }
      if (importsLucide(file)) {
        liars.push([
          file + ': imports lucide-react now, so it is no longer a PROP-fed consumer.',
          'Move its row to GATE_PRIMITIVES, where the honesty test requires the import.',
        ].join('\n  '));
      }
    }
    expect(liars).toEqual([]);
  });

  test('TOTALITY: every gate consumer in src/ is in one of the two consumer lists', () => {
    // The hole lane VT found was not a wrong row, it was a MISSING population:
    // IconsContext named twelve consulting primitives and this file pinned nine,
    // so three were covered by nothing. An exact set equality closes it in both
    // directions — a new consumer nobody listed reds, and a listed file that
    // stopped consulting reds too.
    const declared = [...GATE_PRIMITIVES, ...PROP_ICON_CONSUMERS].sort();
    const actual = FILES.filter(consultsGate).filter((f) => f !== GATE_DECLARATION).sort();
    expect(actual.length).toBeGreaterThan(8); // not a vacuous walk
    expect(actual).toEqual(declared);
    // The one exclusion is named, exists, and is not a consumer of its own hook.
    // Whether it TRIPS the detector depends on how its own prose is worded — this
    // lane made it trip by writing `useIconsOn()` with parentheses in a roster
    // heading, and un-tripped it by dropping them — which is precisely why the
    // exclusion is by NAME and not by a cleverer regex.
    expect(FILES).toContain(GATE_DECLARATION);
    expect(declared).not.toContain(GATE_DECLARATION);
  });

  test('THE ROSTER IS PARSED, NOT READ: IconsContext.js names exactly these files', () => {
    // The defect that started this lane was a comment nobody could execute. The
    // comment is now executed: each lettered roster is compared to the set pinned
    // above, so prose and code cannot drift apart in either direction.
    expect(rosterNames('A')).toEqual(basenames([...GATE_PRIMITIVES]));
    expect(rosterNames('B')).toEqual(basenames([...PROP_ICON_CONSUMERS]));
    expect(rosterNames('C')).toEqual(basenames([...NO_ICON_CHANNEL]));
    // NON-VACUITY: a parse that silently returned nothing would pass an empty
    // list against an empty list forever. Each roster is really populated, and
    // the letters really select different blocks.
    expect(rosterNames('A').length).toBe(9);
    expect(rosterNames('B').length).toBe(4);
    expect(rosterNames('C').length).toBe(3);
    expect(rosterNames('A')).not.toEqual(rosterNames('B'));
    // …and a letter that does not exist parses to nothing rather than to
    // everything, which is what makes the three assertions above discriminating.
    expect(rosterNames('Z')).toEqual([]);
  });

  test('the primitives whose icon channel was deleted stay deleted', () => {
    const regressions = [];
    for (const file of NO_ICON_CHANNEL) {
      if (!FILES.includes(file)) {
        regressions.push(file + ': gone or moved — this pin needs re-anchoring.');
        continue;
      }
      if (importsLucide(file)) {
        regressions.push([
          file + ': imports lucide-react again. Lane LU-1 removed its icon channel',
          'outright because it has no call site inside the map Provider. Its surviving',
          'channels are the kind COLOR and the uppercase TEXT label — restoring a glyph',
          're-opens the hole.',
        ].join('\n  '));
      }
    }
    expect(regressions).toEqual([]);
  });

  test('NEGATIVE CONTROL: the detector actually catches what it claims to catch', () => {
    // A guard that never fires is indistinguishable from a guard that cannot.
    expect(LUCIDE_IMPORT.test("import { Sword } from 'lucide-react';")).toBe(true);
    expect(LUCIDE_IMPORT.test('import { Sword, Crown } from "lucide-react"')).toBe(true);
    expect(LUCIDE_IMPORT.test("const m = await import('lucide-react');")).toBe(true);
    expect(LUCIDE_IMPORT.test("import { Sword } from 'lucide-react-native';")).toBe(false);
    expect(LUCIDE_IMPORT.test('// we deliberately do not use lucide-react here')).toBe(false);
    expect(CONSULTS_GATE.test('const iconsOn = useIconsOn();')).toBe(true);
    expect(CONSULTS_GATE.test("import { useIconsOn } from './IconsContext.js';")).toBe(false);
  });

  test('MUTANT: a new direct importer in a clean folder would be reported', () => {
    // Proves ALLOWED is a real gate and not a tautology over its own census.
    const invented = 'src/components/someNewSurface/BrandNewPanel.jsx';
    expect(ALLOWED.has(invented)).toBe(false);
    const msg = newOffenderMessage(invented);
    expect(msg).toContain('imports lucide-react');
    expect(msg).toContain('THE LEGAL MOVES ARE COMPLY OR SHRINK');
    // ...and a file that IS in the census is not reported.
    expect(ALLOWED.has(FROZEN_DIRECT_IMPORTERS[0])).toBe(true);
  });

  test('the lists are disjoint and carry no duplicate rows', () => {
    const all = [
      ...MAP_SUBTREE, ...GATE_PRIMITIVES, ...FROZEN_DIRECT_IMPORTERS, ...PROP_ICON_CONSUMERS,
    ];
    expect(all.length).toBe(new Set(all).size);
  });
});
