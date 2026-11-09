# TIER-PARITY-FIX — every tier gate outside the owner's seven re-keyed to view and data (2026-11-09)

**Seat:** TIER-PARITY-FIX (one build seat; child of the cloud chair `session_01FbPLbejcfwX5nii12VM673`; this session `session_01FbPLbekXj1M4E9fSmE6Y54`). **Base:** `2053a809c` on `lane/integration-2026-11-07` (the wave's clean final tip, verified by `git rev-parse`). **Branch:** `lane/tier-parity-fix-2026-11-09`. **Brief:** `docs/chair/2026-11-09/BRIEF-TIER-PARITY-FIX-2026-11-09.md` (on `lane/chair-2026-11-08`). **Census:** `docs/chair/2026-11-09/TIER-PARITY-CENSUS-2026-11-09.md` (on `lane/tier-parity-census-2026-11-09`, 766d9e536). Merged by STYLE-2-MERGE after the train; this lane signs nothing.

**The law (the owner, 2026-11-09, verbatim):** *"Renenber, the only thing that is premium abd up is up is the ability to edit post generation, access to the simulator, custom content, unlimited export, import from gallery, access to the world map, and access to the surveyor. Everything else is at parity to the free account."* The owner's answers of 03:5x: the save cap of three STAYS (the eighth premium item, owner-ruled); the Surveyor is PREMIUM ONLY; regenerating a SECTION is post-generation editing (law (1)); U1 closed (no world map yet); R1 resolved by the Surveyor row.

## §1 The rows, before → after (the gate expression quoted)

| Row | Where | Before | After | Commit |
|---|---|---|---|---|
| V1 | `RumorsTab.jsx:136` | `(tier === 'premium' \|\| elevated) && !playerView && !publicDossier` (two store reads) | `!playerView && !publicDossier`; both reads deleted | e5473f068 |
| V1 | `WarTab.jsx:589` | the same, RumorsTab verbatim | `!playerView && !publicDossier`; both reads deleted | e5473f068 |
| V1 | `useLaunchTones.js:30` | `viewerIsPremium && !playerView && !publicDossier` | `!playerView && !publicDossier`; the arg dropped | e5473f068 |
| V1 | `RelationshipsTab.jsx:43` (+ `OutputContainer`'s prop) | `viewerIsPremium && …` | `!playerView && !publicDossier`; the prop dropped | e5473f068 |
| V1 | `HousesBlock.jsx:33`, `WatchPanel.jsx:51` (unmounted) | `viewerIsPremium && …` | `!playerView && !publicDossier`; the prop dropped | e5473f068 |
| V1 | `UnaffiliatesSection.jsx:108` | `seesSecrets = canAuthor && !playerView && !publicDossier` fed both the covert read and the verbs | `seesCovert = !playerView && !publicDossier` feeds `unaffiliateRows`; the verbs keep `canAuthor && seesCovert` (world writes, (2)) | e5473f068 |
| V1 | `src/pdf/lib/liveWorld.js:182` | `includeGroundTruth: true` | NO BYTE — it reads no tier; the export is always the owner's view; the tier term is `faithUnlocked` (census-DERIVED). The chair RULED this default (05:1x): the census's V1 PDF row was mis-classed. PDF snapshot delta 0. | — |
| V1-map | `BeliefDivergenceBand`, `PerspectiveStandings`, `RelationshipChronicleSection`, `NpcTrailSection`, `TreatyPanel` | `tier === 'premium' \|\| elevated` | `includeGroundTruth = true` (the world map's outer gate carries law (6)); store reads and four now-unused imports deleted | 8b8bacff8 (+ 9464c09b3 register) |
| V2 | `OutputContainer.jsx:529` | `!!embed \|\| (!viewerIsPremium && !publicDossier)` | `!!embed \|\| !publicDossier`; `viewerIsPremium` deleted | 642e76af8 |
| V2 | `FaithSection.jsx` | HIDDEN: `if (isPremium) return null` | the teaser (heading + the nameless faith line) for every owner; the upsell `showUpsell={!isPremium}` and never public | 642e76af8 (+ 0c79de632 register) |
| V2 | `FaithTab.jsx` | the honest-absence branch mirrored HIDDEN (`!faithWillRender`, premium re-printed the line at `faith.teaser`) | removed: unreachable once HIDDEN went; the line prints once | 642e76af8 |
| V3 | `VersionsTab.jsx` | `isPaid = tier === 'premium'` → LockedDestination | deleted: timeline, compare, manual snapshot and REVERT for every owner (the chair's ruling) | 9bf42031c |
| V4 | `chronicle.js` + `aiChronicleAppend.js` | `CHRONICLE_LIMITS {free 5, premium ∞, elevated ∞}` read by tier | `CHRONICLE_LIMIT = Infinity`, no tier read | 955c0fdb4 |
| V5 | `settlementLifecycleHelpers.js` `activateFaithIfEntitled` | `tier === 'premium' \|\| isElevated()` | activates for every owner; callers byte-identical | 0b355449c |
| V6 | `src/copy/en.js` | Neighbour System to free; "cloud sync" ×4; canon snapshots / variants; dead `cloud_save` | struck (old → new in the commit) | a5fbd8241 |
| V6 | `src/copy/landing.js` forge.ceiling | "forge up to a Town" | "forge a Town" | f82e3c252 |
| V6 | `src/components/HowToUse.jsx` | premium verbs unmarked; anon "up to a Town" | export, campaigns, Edit Names, World Map placement/overlays, Link Neighbour, custom content marked Cartographer; anon a Town only | 85be95a15 |
| V6 | `send-email/index.ts` + `emailTemplates.js` | "…or claim a Founder Lifetime seat (limited to the first 30 supporters)" | struck; the cap clause HELD | 02b0eb76f |
| Cap (keep) | `src/copy/landing.js` brief.library / brief.saveNote | "keep every town … organized by campaign" / "keeps every draft" | "keep your towns in your Library" / "saves to your Library"; no new literal of the cap | 1180defb1 |
| Regen | `OutputContainer.jsx:751` History reroll | `onRegenerate ? …` (open to free and anon) | `npcAuthoringAllowed && onRegenerate ? …` (the NPC reroll's gate) | 283f8c7ed, ea8f2dd08 |
| Surveyor (client) | `surveyorGate.js` `isSurveyorTier` (+ its byte twin) | entitlement row ∨ isFounder ∨ staff (a bare Cartographer refused) | `tier === 'premium'` ∨ isFounder ∨ staff ∨ the server's answer | 82b8fbe0a |
| Surveyor (copy) | `pricingPage.js`, the ladder's `surveyor-stages`, `landing.js` Surveyor card | "No subscription required"; "on either plan"; free 'per task' | "with Cartographer"; free `false`, enforcement `isSurveyorTier` | 7d53efb2e |
| Surveyor (server) | `supabase/migrations/209_surveyor_premium_only.sql` (NEW, UNAPPLIED) | 201: staff ∨ any active row | staff ∨ `current_user_has_premium_access()` ∨ an active row with source `'grant'` | cf4d0e61e |

R2 folds into V1: every `tier === 'premium' || isElevated()` V1 touched was DELETED, not copied; `isElevated()` went with it where it only mirrored the tier.

## §2 The twelve towns, four viewers (the lane's pin: `tests/components/tierViewerRender.test.jsx`)

The census's twelve soak births (`scripts/audit/soak-review/corpus.mjs :: birth(0..11)`), all twenty dossier tabs with the props `renderHarness.mjs` passes, as the free owner, the premium owner, the player (premium, `playerView`) and the public reader (premium, `publicDossier`).

| Measure | At the base 2053a809c | At the lane tip |
|---|---|---|
| free ≠ premium, per tab, the upsell aside | Faith 12 of 12 (free alone: the heading "Faith" and the upsell; the faith line identical) | 0 of 240 |
| `sf-tab-faith` registered (OutputContainer, World group) | free 12/12, premium 0/12 | free 12/12, premium 12/12 |
| The planted truth (a `campaign.worldState`: units abroad under a cut courier line + a belief map) — `war-unit-truth`, `war-beliefs` | premium yes, FREE NO; player and public no | free and premium yes; player and public no |
| A free owner with no world state | no truth | no truth (the data gate holds) |

Every other tab printed byte-identical text for free and premium at both ends. The only free-only block left is the Faith upsell, which sells (2) and (3) to the account that does not hold them.

## §3 The regeneration boundary — every per-section regenerate or reroll control

| Control | Where | Gate at the base | Ruling | After |
|---|---|---|---|---|
| History ↺ Reroll | `HistoryTab` `onReroll`, OutputContainer | `onRegenerate` (= `!readOnly`): OPEN to free and anon | a section of the generated record: law (1) | `npcAuthoringAllowed && onRegenerate` (premium/founder/staff, never player or public) |
| NPC ↺ Reroll | `NPCsTab` `onRerollNPCs`, OutputContainer | `npcAuthoringAllowed && onRegenerate` | already law (1) | unchanged |
| Apply Saved Configuration & Regenerate | `SettlementDetail` behind `editMode` | the Edit door (`viewerCanAuthor`) | whole settlement, behind (1) | unchanged |
| Regenerate the Narrative Layer | `DossierNarrativeButtons`, `NextActionRail` `onRegenerateAi`, `StaleNarrativeModal` | credits only | credit-metered AI prose; rewrites no settlement data — PARITY (the chair, 06:1x) | unchanged; pinned |
| Regenerate Daily Life | `DailyLifeTab` | credits only | the same | unchanged; pinned (free holds the button) |
| Regenerate draft / anon's daily rerolls | `GenerateWizard` toolbar | anon's 1 + 2 per day | whole-settlement generation | unchanged |
| World map Regenerate | `WorldMapToolbar` | `authTier !== 'anon'` | U1 — closed by the owner (no world map yet) | unchanged |

`regenSection` regenerates exactly two sections (`src/lib/engineRemote.js`, `REMOTE_REGEN_SECTIONS = ['npcs', 'history']`). Pin: `tests/components/sectionRerollBoundary.test.jsx` — red at the base on History, green here; the narrative arm pins parity.

## §4 The Surveyor's rows — who holds one today

Measured from the tree (the live table is the owner's): no migration and no seed inserts a `surveyor_entitlements` row. Rows are minted only by the service-role `grant_surveyor_entitlement` (159; re-stated in 178), called from exactly two places — the `stripe-webhook` (source `'subscription'`, the dark Surveyor product; purchases closed until launch) and `admin-actions` `grant_surveyor` (source `'grant'`, highest role, audited, two-key). So from the tree nobody provably holds a row; a live `'subscription'` row would be a pre-launch test purchase, and any `'grant'` row is a staff grant, which 209 keeps honouring. The BYOK RPCs (159, 191) already admit `has_surveyor_entitlement() OR is_founder` and follow 209 unchanged.

## §5 The deltas, UNSIGNED, per cause (for STYLE-2-MERGE)

Measured after every cause commit on the lane tree (`tests/property/generatorGoldenMaster`, the three espionage fences, `heraldKnowledgeDeskGolden`, `dossierProseManifest`, `presetLightingWitness`, `tests/pdf/goldenViewModel`), each run exit 0:

| Cause | gm /525 | fence /360 | herald | prose | witness | pdf /18 |
|---|---|---|---|---|---|---|
| every cause of this lane | 0 | 0 | 0 | 0 | 0 | 0 |

No golden, fence, herald desk, manifest, witness or PDF snapshot byte moved, so nothing is owed to the signing seat. The PDF's 0 includes the `liveWorld.js` ruling above.

Registers moved through their doors: `premiumGateSingleSource` EXEMPTIONS (−2 V1, −5 V1-map, −1 V2, −1 V3, −1 V5; +1 reason class `surveyor-entitlement` with its two rows); `.prose-numerics-baseline.json` re-addressed (identities unchanged, lines only); `negativeAssertionAnchor` faithSection 7 → 6; `.lighting-census-baseline.json` refrozen through its door at cf4d0e61e (files 3123 → 3128); the migration rehearsal manifest (the 209 wave, head 209); `docs/DEPLOY.md`, `ARCHITECTURE.md`, `docs/CURRENT_STATE.md` migration figures.

## §6 The pins, re-keyed by cause (never loosened)

`dossierDepthTabs` (War band: "never for anon" → the public dossier; the free owner asserted present; the premium deity-free Faith town → the faith line, no desk teaser, no upsell; the patron-less church town → the line, once) · `counterIntelSurfacesIn3` (the "non-premium viewer" arm removed with the prop; player, public, dark world and no world stay closed) · `npcTrailSection`, `relationshipChronicleSection`, `beliefDivergenceBand`, `warFaithSurfacing` (the fail-closed claim pinned at its two real homes: the read model's player projection on the same fixture, anchored by its DM projection, and the no-campaign page) · `faithSection` (premium + latent-only: the nameless line, never the latent name, no upsell) · `versionsTab`, `versionsTabPitchHonesty` (the free owner holds every lever; no locked pitch; the mechanism halves unchanged) · `chronicle` (the three caps → the one limit; the census probe as the pin) · `settlementSlice.faithActivation` (free and anon activate as premium does) · `landingClaimsParity` (the anon size phrase "forge a {label}") · `surveyorDoor`, `surveyorGateParity` (premium admitted, free refused, by both copies) · `entitlementLadder.enforcement` (`surveyor-stages` moves to the claiming set with a driven `isSurveyorTier` resolver; the equal-string control stands on its planted row, the real set asserted empty — said in its header) · `migrationRehearsal` (the 209 wave).

New red-first tests: `tierViewerRender` (12 towns × 4 viewers), `aiChronicleAppendOneLimit`, `sectionRerollBoundary`, `surveyorPremiumOnly` (both hooks), `surveyorPremiumOnly.pglite` (139 + 201 + 209 applied for real; the 201 defect executed). Each was run at the base in a clean worktree and red there.

## §7 The reds, named

**At the base, not this lane's:** `versionsTab.test.jsx` "asks for a second pick, then renders the comparison" (the lazy diff view never resolves under `findByText`); `layerBoundaries` import-cycle set; `verify:dist`'s four SKIPPED `engineAbsentWhenRemote` rows (strict dist refuses skips at the base too).

**This lane's, by construction (the brief numbered the migration 209):** 207 (the allegiance cars' public-hall veil) and 208 (the party link) are not on this lane, so `validate:migration-head`, `migrationContiguity`, `migrationSequenceAll`'s gapless arm and `migrationRehearsal` red here; they close at the merge. Measured in a scratch worktree at the base with 207 from `lane/allegiance-car2-2026-11-08` and a no-op 208 stand-in: the whole chain applies 209 and `migrationSequenceAll` and `migrationContiguity` pass.

**THE CEILING — a STOP:** see §8.

## §8 The first-paint ceiling (STOP)

`verify:dist`'s `vendorPdfLazy` Brotli row: the lane's entry closure measures 288,472 B against the budget of 288,452 B, which the base meets exactly (288,452 B, measured the same way at 2053a809c). The +20 B are all in the eager entry chunk `index-*.js` (128,131 → 128,151 B Brotli); every other closure chunk is byte-equal.

THE BISECT (each point a fresh `npm run build` in a clean scratch worktree, the closure measured by the walker's own `entryTransferMeasurement`):

| After commit | Closure Brotli (B) | vs budget 288,452 |
|---|---|---|
| base 2053a809c | 288,452 | 0 |
| 0b355449c (V1–V5) | 288,370 | −82 |
| a5fbd8241 (V6 en.js) | 288,252 | −200 |
| f82e3c252 (V6 landing, six characters) | 288,440 | −12 |
| 1180defb1 (the cap keep path) | 288,374 | −78 |
| 82b8fbe0a (the Surveyor client, with the regen and HowToUse and email commits before it) | 288,153 | −299 |
| 7d53efb2e (the Surveyor copy) | 288,472 | **+20** |

The walk is not monotonic: a six-character copy edit moved the entry by +188 B. Most of the movement is the entry chunk's import map re-hashing every lazy chunk's name, which Brotli compresses differently each build. The commit that CROSSES is the Surveyor copy (+319 B on its parent; the landing Surveyor card's added "with Cartographer" is the eager part of it). This was a STOP under the brief. RULED by the chair (06:59 UTC): the default stands — the +20 B Brotli is recorded as bytes OWED, attributed to this lane's Surveyor copy (7d53efb2e), the crossing being the import map's chunk-name re-hash and not the words; no lane moves a ceiling and no copy is trimmed to pay for a hash ("with Cartographer" stays); STYLE-2-MERGE re-records the first-paint figures once at its composed tip, attributed by lane.

## §9 CONFIRMED against PLAUSIBLE

**CONFIRMED (run here):** every before → after of §1 that a test drives (V1 War truth, V2 presence and text, V3 levers, V4 facade, V5 activation, the History reroll, the Surveyor on both hooks and in pglite against the real 139/201/209 SQL), each red at the base in a clean worktree and green at the tip; the §2 render; the §5 zero deltas; the §7 reds and their causes; the ceiling figure and its chunk.
**PLAUSIBLE (read, not driven):** the reachability of the V1 surfaces in production (only a downgraded Cartographer's retained realm carries the data); the copy rows' reading under the style law; the live state of `surveyor_entitlements` (the owner's table); the narrative family's metering-only reading; that the 207/208 merge closes the four gap reds (measured with a stand-in 208, not the party link's real file).
