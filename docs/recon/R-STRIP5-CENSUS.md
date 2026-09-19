LANE RECON REPORT — R-STRIP5 CENSUS (entitlements strip) at build tip eba286607 (read-only; repo /Users/cstokes/Desktop/settlement-engine; all code receipts from `git show`/`git grep` at that tip; docs/ledger receipts at HEAD of the ledger branch; charter = DESIGN_MAP_MODULE_SPLIT.md §11.2 STRIP-5 row + §11.3 Q8-CLOSED)

METHOD + DENOMINATORS. Two-pass sweep per lane law 4. Pass 1 (exact names): full-tree `git grep` at eba286607 for `entitlementLadder` (hit files: PACKET_MANIFEST.json, WEB-8.md, INDEX.md, .observed-shape-readers-baseline.json, AboutManifesto.jsx, PricingBands.jsx, entitlementLadder.js, pricingPage.js, the 3 importing test files, sovereigntyLightingContract.walker.test.js — no api/, no supabase/, no scripts/*.mjs), and for each exported symbol (`LENS_COUNT`, `ENTITLEMENT_LADDER`, `DEFERRED_LADDER_ROWS`, `VIEWING_PAYWALLS_PENDING_514`, `FOUNDER_EQUALS_CARTOGRAPHER_FOREVER`, `RETENTION_MONTHS`). Pass 2 (aliases/strings): row-id spellings (`map-editing|dm-pins|fog-table|change-view`) over src/api/supabase/scripts/tests; camelCase aliases (`fogTable|dmPins|mapEditing|canEditMap|canPinMap`) — sole hit a mutation-manifest key; display-label strings (`DM pins|Map lenses|fog table layer|The panorama view`) over src + e2e — sole non-copy hit CompendiumPanel.jsx:107 (a compendium section title, STRIP-1/6 territory, not a ladder consumer); `five lenses|all five` over src/api/supabase/scripts — no code hits. Edge-bundle bill checked directly: `entitlementLadder|config/pricing|tierFacts` over all five `supabase/functions/_shared/*Bundle.meta.json` = ZERO hits (CONFIRMED: the ladder feeds no edge bundle). All claims CONFIRMED by quoted receipt unless marked PLAUSIBLE.

== A. src/config/entitlementLadder.js — complete disposition (205 lines at the tip) ==

| lines | thing | disposition |
|---|---|---|
| 1–46 | header: verbatim 2026-07-17 ruling transcription (:6–15 names map editing, DM pins, lenses, fog, interiors, v1→v2 redraw), retired-marker history (:29–37 names `SettlementMapPane`, dead since STRIP-1), walker-law prose | REWRITE — keep the ruling as cited history marked superseded by §725/§726 (absence-decay law: don't erase a transcribed owner ruling silently) |
| 48 | `import { TIERS, SINGLE_DOSSIER } from './pricing.js'` | STAY |
| 49 | `import { TIER_FACTS } from './tierFacts.js'` | STAY |
| 50 | `import { TOWN_MAP_STYLE_IDS } from '../design/townMapStyles.js'` | DELETE (the charter's named import) |
| 57 | `export const LENS_COUNT = TOWN_MAP_STYLE_IDS.length` | DELETE |
| 70 | row `every-size` (parity-class, `TIER_GATE.free.maxTier`) | STAY |
| 71 | row `saves` (`TIER_GATE.maxSaves`) | STAY — spine |
| 72 | row `custom-content` (`TIER_GATE.customContent`) | STAY — spine |
| 73 | row `gallery-viewing` (`parity`) | STAY — carries the `parity` marker but is a gallery row, not a settlement-map row; the Q8 phrase "lens/parity display rows" reads as the maps-exports viewing set. Flag for chair confirmation (§D3) |
| 79 | row `same-engine` (`constitutional`) | STAY |
| 80 | row `living-realm` (`TIER_GATE.neighbour`) | STAY — spine |
| 81 | row `map-chains` (`TIER_GATE.mapChains`) | STAY — spine, named realm-surface in Q8 |
| 87 | row `map-view` (`parity`) | DELETE |
| 88 | row `provenance-hover` (`parity`) | DELETE |
| 89 | row `all-lenses` (`TOWN_MAP_STYLE_IDS`, interpolates LENS_COUNT) | DELETE |
| 90 | row `panorama` (`parity`) | DELETE |
| 91 | row `map-editing` (`viewerCanAuthor`) | DELETE — WEB-8 requiredSymbol, see §C4 |
| 92 | row `dm-pins` (`viewerCanAuthor`) | DELETE |
| 93 | row `change-view` (`viewerCanAuthor`) | DELETE — WEB-8 requiredSymbol |
| 94 | row `fog-table` (`viewerCanAuthor`) | DELETE |
| 95 | row `export-bundle` (`TIER_GATE.export`) | STAY — spine |
| 84–97 | the `maps-exports` group itself | STAYS with 1 row (export-bundle). Copy label `'Maps & exports'` (pricingPage.js:119) optionally re-labels to exports-only wording — copy-level, vetoable, not a tier-sale change |
| 101 | row `surveyor-stages` (`SURVEYOR_AI_COSTS`) | STAY — but see §D5 (styleOverhaul task) |
| 106–134 | VIEWING_PAYWALLS_PENDING_514 doc block (:120 cites MapOverlay/LayersPanel/RoutesToolbar — live realm files; :122–128 cite SettlementMapNotes.jsx + fog/SettlementMapFogControls.jsx — dead since STRIP-1) | TRIM prose to the surviving entry |
| 135–139 | `VIEWING_PAYWALLS_PENDING_514`: keep :136 `map-chains`; DELETE :137 `change-view` + :138 `fog-table` | TRIM — mandatory, not optional: walker line 261 pins the ledger EXACTLY equal to the measured claiming-viewing set, which becomes `['map-chains']` |
| 141–171 | DEFERRED doc block (:158–163 v2-redraw prose cites mapEdits.js internals) | TRIM to interiors-only |
| 172–189 | `DEFERRED_LADDER_ROWS`: keep `interiors` (:173–180; survives per charter + ODQ §748.4 — teaser never published, walker-pinned); DELETE `v2-redraw` (:181–188) | TRIM. ⚠ interiors' `returnsAt: 'map activation D3b/P6'` (:178) is a LEGACY-map address now pointing at a program the owner struck; walker :174 pins the string verbatim. Re-addressing it to module-land is a paired 2-line edit (row + walker pin) — flag, vetoable (§D4) |
| 191–196 | `FOUNDER_EQUALS_CARTOGRAPHER_FOREVER` | STAY — adjacent observation: ZERO importers anywhere at the tip (full-tree grep = definition only). Dead export, NOT STRIP-5 scope |
| 198–205 | `RETENTION_MONTHS` | STAY — consumers AboutManifesto.jsx:37/:217, PricingBands.jsx:21/:289, pricingPageBands.test.jsx:62/:139–163 |

Net: 8 ladder rows + 2 pending-ledger entries + 1 deferred row + LENS_COUNT + 1 import leave; every Q8 spine row verified untouched by receipt above.

== B. Every consumer of each removed key (the complete blast set) ==

B1. `ENTITLEMENT_LADDER` importers (4, exhaustive): PricingBands.jsx:21 (render loop :255 is fully generic — `ENTITLEMENT_LADDER.map(group…)`, labels via `tp('band4.rows')` :236 — NO EDIT NEEDED); pricingPageBands.test.jsx:62 (ladder walker :119–132 iterates rows generically, direction is row→label so removed rows just leave — NO EDIT NEEDED; denominator: grep for every map row id/label over the file = 0 hits); enforcement walker :62 (TRIM, §C1); illustratedLensFree.test.js:19 (DELETE, §C2).

B2. `LENS_COUNT`: entitlementLadder.js:57/:89; illustratedLensFree.test.js:19/:32–41 (whole subject). Prose only: design/townMapStyles.js:67/:72 comments (file is STRIP-4's), packet MDs TC-5A.md:589/:722, TC-5B-II.md:144 (docs, non-gating).

B3. Removed row-id spellings across code surfaces (denominator: `git grep "map-editing|dm-pins|fog-table|change-view" eba286607 -- src api supabase scripts tests`): src/config/entitlementLadder.js (above), src/copy/pricingPage.js:130–137 (labels), the enforcement walker (:107,:177–182,:197,:216,:222,:260,:281–286), changeViewDepthGate.test.jsx (name+prose only), WorldMap.jsx:61/:763 + RealmMobileGate.jsx:4 + worldMapMobileGate.test.jsx:6 ("map-editing canvas" prose about the REALM — world surface, no relation, DO NOT TOUCH). **api/ = ZERO. supabase/ = ZERO** (the `entitlement` hits under supabase/ are dossier/surveyor purchase entitlements — a different, server-side system this strip never touches). Enforcement of all four features is client-only via `viewerCanAuthor`.

B4. Copy labels (src/copy/pricingPage.js band4.rows :128–140): DELETE `map-view`(:130), `provenance-hover`(:131), `all-lenses`(:132), `panorama`(:133), `map-editing`(:134), `dm-pins`(:135), `change-view`(:136), `fog-table`(:137), `v2-redraw`(:139). KEEP `interiors`(:138) — walker rule C pins its label survival. Label readers: PricingBands.jsx:236, walker :197, pricingPageBands :122 — all key-driven, tolerate deletion once the walker's v2-redraw label pin (:188) is trimmed in the same act. No copy census pins band4 (denominator: `band4|pricingPage` over tests/copy/copy.test.js, pricingP9.test.js, localeParity.test.js = 0 hits).

B5. `viewerCanAuthor` — RETAINED. Live non-map consumers at the tip: OutputContainer.jsx:32/:260, SettlementDetail.jsx:23/:226, SettlementWorkbenchMount.jsx:11/:52, UnaffiliatesSection.jsx:40/:101, plus premiumGateSingleSource.test.js (chokepoint census) and npcAuthoringScope/settlementWorkbench suites. STRIP-5 removes only the four ladder references + the walker's now-orphaned RESOLVERS entry (:80–88) and import (:64). src/lib/viewerAuthority.js STAYS.

B6. `VIEWING_PAYWALLS_PENDING_514` + `DEFERRED_LADDER_ROWS`: sole consumer is the enforcement walker (:62,:172–182,:208,:261–262,:276). `TOWN_MAP_STYLE_IDS`'s other consumers are STRIP-4's problem (see §E3).

== C. The five enforcement tests + every instrument the removals move ==

**Identification (charter correction).** At eba286607 the referent of "its five enforcement tests" is a FIVE-FILE set — WEB-8's A7 roster (manifest :27377) named "the ladder walker in pricingPageBands, illustratedLensFree, and the four gate suites dmPinsTierGate, fogTierGate, changeViewDepthGate and settlementMapPaneEdit"; settlementMapPaneEdit.test.jsx died with STRIP-1 (absent from the tip tree), leaving exactly five entitlement-enforcement files that reference the stripped rows:

| file (its/describes at tip) | disposition |
|---|---|
| tests/config/entitlementLadder.enforcement.test.js (17/4) | **TRIM, NEVER DELETE** — rules A/B/E/F still guard the five surviving claiming rows + four parity rows (the paid spine); WEB-8 pins its CREATE row + `claims` + `RESOLVERS` requiredSymbols verbatim; and deleting a paid-surface guard is the exact class §11.4 ruled out of scope for STRIP-3. If the owner truly meant delete-all-five, that is an owner-gated guard removal — escalate before acting. Note the charter's row was also written against a 5-suite file: rule D was ALREADY retired by TE-STRIP-1 (:280–287), 4 live describes remain |
| tests/config/illustratedLensFree.test.js (3/1) | DELETE — subject is LENS_COUNT + the lens rows entirely; also unblocks STRIP-4 (§E) |
| tests/components/dmPinsTierGate.test.jsx (1/1) | DELETE — subject row dies. ⚠ residual: it is the only tier-blindness scan over RETAINED mapEdits.js (:27–30); accept the loss or re-home one line into a surviving domain-purity walker — vetoable |
| tests/components/fogTierGate.test.jsx (3/1) | DELETE — scans fogGeometry.js/fogSessions.js (:47–50), both STRIP-4 presentation deletions; coupled ordering per §E |
| tests/components/changeViewDepthGate.test.jsx (1/1) | DELETE — scans changeView.js (:24–27), a STRIP-4 deletion; same coupling |

C1. **Walker trim spec** (receipts at tip line numbers): claiming pin :105–108 → `['saves','custom-content','living-realm','map-chains','export-bundle']`; parity pin :109–112 → `['every-size','gallery-viewing','same-engine','surveyor-stages']` (non-empty guards :114–115 still hold — no vacuity); wrong-predicate victims :141 → `['surveyor-stages']`; PARITY_MARKERS :95–97 drop `'TOWN_MAP_STYLE_IDS'`; RESOLVERS :86–87 + import :64 drop `viewerCanAuthor`; marked-parity ids :154 → `['gallery-viewing']`; rule C :172 → `['interiors']`, drop v2-redraw arms :182/:188/:199, **re-point the 3 `dm-pins` anchors** (:181,:182,:197) at a surviving same-pipeline row (`export-bundle` / its band4 label); axis split :216 → `['custom-content']`, :220–223 → `['gallery-viewing','map-chains']`, :224–226 unchanged; rule F measured set :260 + ledger pin :261 → `['map-chains']`; rule D comment :286 ("what the tier sells… is STRIP-5 / Q8") now answered — update; header §471-figures prose rewrite with cause cited.

C2. **Lighting census** (tests/lint/sovereigntyLightingContract.walker.test.js): live tuple at :6667 `files: 2493, parked: 364, credited: 2129, titles: 20862, suiteTitles: 5788`. Deleting 4 files removes 8 its/4 describes (per-file counts above); the walker trim keeps all 17 titles if arrays are edited in place (title strings unchanged). Figures are WALKED off failure messages, never computed — treat my counts as prediction only. ⚠ TWO OTHER WALKERS PIN THIS FILE'S TEXT: newsHeadlineContract.walker.test.js:207 and proseFamilyContract.walker.test.js:273 both `toContain('files: 2412, parked: 365, …')` — an ANCESTRY line (:4038). A re-freeze must append a new row and keep ancestry comments verbatim, or two unrelated walkers red. ⚠⚠ TE-STRIP-2 is re-freezing this same tuple concurrently (§G1).

C3. **negativeAssertionAnchor.walker.test.js** — FROZEN_UNANCHORED_NEGATIVES rows: changeViewDepthGate :216 (1), dmPinsTierGate :228 (1), illustratedLensFree :286 (1); fogTierGate has NO row (left at EST-B, comment :235–243). The inventory-honesty arm (:793–800) reds on a deleted roster file: "deleted or moved — remove its FROZEN_UNANCHORED_NEGATIVES row" — remove the 3 rows in the same act. Regeneration is manual by design (UPDATE_EPISTEMIC_ALLOWLIST prints and fails; paste by hand). The enforcement walker has no row here (its negatives ride the anchored helper) — denominator: `grep -c entitlementLadder` over the file = 0.

C4. **Packet validator** (scripts/implementation-packets.mjs; LANDED packets' changeManifest rows must exist and requiredSymbols must be present verbatim — :119–120; checks arrays are shape-validated only, :814, so WEB-8's checks naming the deleted files do NOT red). Rows needing `retiredBy` (§731.3; must cite a ledger §, e.g. `"§725/§726"` — an uncited retirement is REFUSED, :133): **WEB-8** requiredSymbols `id: 'map-editing', …` (manifest :27315) and `id: 'change-view', …` (:27319 vicinity). WEB-8's `DEFERRED_LADDER_ROWS`/`VIEWING_PAYWALLS_PENDING_514`/`claims`/`RESOLVERS` symbols and its entitlementLadder.js + walker changeManifest rows all SURVIVE under the trim dispositions above — a walker deletion would instead force 3 more retirements (another reason to trim). **EST-B** (manifest :7497+): changeManifest MODIFY `tests/components/fogTierGate.test.jsx` (:7504) + requiredSymbol `"the derivation stays tier-blind (source scan)"` (:7521) — both need `retiredBy` when fogTierGate deletes.

C5. **observed-shape census**: scripts/.observed-shape-readers-baseline.json pins src/config/entitlementLadder.js THREE times (sha256 fd4c2090…, size 5959 — rows near :6796/:21922/:36950). Any byte change to the ladder re-freezes via `npm run check:observed-shape-readers` in the same act.

C6. **mutation-coverage-manifest.json:260** — `"tests/components/dmPinsTierGate.test.jsx": { "kind": "uncovered" }` — remove the row with the file (consumers: tests/lint/mutationCoverage.shared.mjs + freshness suites; a row naming a missing file is PLAUSIBLE-red, verify at implementation). No rows exist for the other four files (denominator grep).

C7. **NOT moved (checked, negative results with denominators):** `scripts/.test-ratchet-baseline.json` — zero rows for any of the five files (it baselines only failing tests; all five are green); `scripts/.size-baseline.json` — zero rows for entitlementLadder/pricingPage/illustratedLens/townMapStyles (it holds per-file max-lines ceilings; tests/lint/sizeBaseline.test.js reds only on baselined files); `.full-typecheck-baseline.json` + `.domain-strict-baseline.json` — zero rows; copy censuses (B4); edge bundles (header). PLAUSIBLE-unmoved: pricing lazy-chunk build censuses (row removals only shrink the chunk; ceilings are maxima) — the full gate proves it. No package.json byte moves ⇒ no mint trigger.

== D. Paid-surface caution rows (owner-gated by nature) ==

D1. **The Q8 spine is untouched by every disposition above** — saves :71, custom-content :72, living-realm :80, map-chains :81, export-bundle :95, plus FOUNDER_EQUALS (:193) and RETENTION_MONTHS (:205): receipts in §A. No finding in this census requires touching any spine row.
D2. **Walker delete-vs-trim** is itself a paid-surface call: deletion removes the only executable guard that the surviving five paywalls resolve. Recommendation TRIM stands unless the owner explicitly orders the guard's death.
D3. **gallery-viewing**: `parity`-marked but not a settlement-map row; removing it would shrink the advertised FREE surface for a live feature — read Q8 as keeping it. Chair to confirm (1-word ruling).
D4. **interiors row**: survives with a stale `returnsAt` naming the struck legacy program (D3b/P6). Re-addressing changes a frozen paid-surface promise's wording — vetoable, 2-line paired edit.
D5. **The styleOverhaul Surveyor task is a PAID legacy-map surface no strip wave charters**: pricing.js:110 (`styleOverhaul: 3, // one bespoke map-style definition`), aiTaskConfig.js:49, copy band3 taskMenu :88 ('Design a bespoke map style'), edge function supabase/functions/style-overhaul/, and the aiCharter bundle grounds on the style registry (§E3). TE-STRIP-2 holds only the PANEL's disposition. What the Surveyor sells is owner-gated — flagged, not decided.
D6. **VIEWING_PAYWALLS_PENDING_514 shrink** moots two of the three open §514.1b owner items (change-view, fog-table) by removing their subjects; `map-chains` remains the ledger's only live question. Authorized by the strip order; recorded here so the mooting is a visible consequence, not a silent one.

== E. Dependency order vs STRIP-2/3/4/6 ==

E1. **STRIP-5 needs NOTHING first.** Every deletion target exists and is severable at the tip; no STRIP-4 deletion is a prerequisite (the charter question inverts).
E2. **STRIP-4 is blocked ON STRIP-5** at its registry step: deleting design/townMapStyles.js while entitlementLadder.js:50 and illustratedLensFree.test.js:20 still import it reds the build and the suite; deleting changeView.js/fogGeometry.js/fogSessions.js while changeViewDepthGate/fogTierGate still `readFileSync` them reds both. STRIP-5 lands before (or in the same act as) those steps.
E3. **Charter gap for STRIP-4, found here**: src/domain/aiCharter.js:42 imports `buildStyleVocabulary` from design/townMapStyleWall.js, so the style registries ride the aiCharterBundle EDGE bundle (aiCharterBundle.meta.json inputs list townMapStyles.js, townMapStyleWall.js, townMapExportPalette.js, townGlyphs/*) — deleting them without severing aiCharter.js breaks `build:edge-shared`, the five freshness suites and the committed-tree reproducibility pin (mutation manifest :1952). Also live non-map importers of townMapStyles.js at the tip: interior/interiorDraw.js, interior/interiorEdits.js (retained interiors program), realmMap/realmPlateRenderer.js (retained realm), compendium/generated/compendiumData.generated.js. R-STRIP4's census does not carry the edge-bundle row — pass this to the STRIP-4 lane.
E4. **STRIP-2 (concurrent)**: no shared CODE targets — collisions are instrument-only (§G). STRIP-3: none (already landed in the TE-STRIP-1/3 stack this tip contains). **STRIP-6**: the ladder header rewrite and copy deletions shrink its terminal map-word roster; the surviving `map-chains` row + 'Map chains' label are realm-surface and pass the §11.4 directory-allowlist reading.

== F. Traps ==

F1. The walker's absence pins read ROW VALUES, never source text (:27–30) — the header rewrite cannot false-green anything; conversely a grep-based "removal proof" over the file would match its own history prose. Prove removals off `ENTITLEMENT_LADDER` values.
F2. The `dm-pins` anchor is used THREE times (:181,:182,:197); a trim that deletes the row but forgets the anchors makes rule C red honestly — re-point all three in the same edit.
F3. The lighting tuple is walked, never computed; and its ANCESTRY lines are text-pinned by two other walkers (§C2) — append, never rewrite.
F4. A `--no-verify` checkpoint hides ratchet reds, and pre-commit `eslint --fix` re-stages — re-prove at the committed tip (standing lane law; both have bitten).
F5. "Five enforcement tests" counted from a tree where rule D still lived; at this tip the walker has 4 suites and the fifth "test" is a retirement comment (:280–287). Do not go hunting for a fifth suite to delete.
F6. WorldMap.jsx/RealmMobileGate.jsx "map-editing" prose hits are the WORLD map (stays) — a row-id grep that auto-edits would damage the realm surface.
F7. mapChainsTierGate.test.jsx (3 anchor-walker sites, :270 vicinity) guards the SURVIVING spine row — it is not one of the five; leave it.
F8. The interiors row's survival is enforced BOTH directions by rule C (present in DEFERRED, absent from ladder, label present in copy) — a lane that "tidies" the deferred ledger to empty reds three arms.
F9. FOUNDER_EQUALS_CARTOGRAPHER_FOREVER has zero importers — do not mistake it for a removal target (out of charter; adjacent dead-export note for a later sweep).
F10. The resume-block sha law: this census's line numbers are sealed to eba286607; TE-STRIP-2's landing will shift PACKET_MANIFEST.json and walker line numbers — re-resolve from the dispatch worktree's HEAD, never from these receipts.

== G. STRIP-2-DELTA — rows TE-STRIP-2's charter could move ==

| my row | collision |
|---|---|
| §C2 lighting tuple (:6667 figures) | TE-STRIP-2 re-freezes the SAME tuple (its charter names the lighting-census re-freeze). Single frozen figure, two writers ⇒ serialize: STRIP-5 rebases onto TE-STRIP-2's tip and re-walks; figures here go stale at that landing |
| §C4 PACKET_MANIFEST.json receipts (:27315 etc., :7504/:7521) | TE-STRIP-2's 12 figure-pin packet edits shift lines and may add neighbouring `retiredBy` rows — re-locate by symbol text, not line |
| §C5 observed-shape baseline line refs | TE-STRIP-2's export-lib deletions re-freeze the same baseline; the ladder's three sha rows persist but move |
| §C3 anchor-walker roster line refs | TE-STRIP-2's export/PDF test deletions and the styleOverhaulCompile trim (roster row :468) edit the same frozen literal |
| §D5 styleOverhaul flag | TE-STRIP-2 rules the StyleOverhaulPanel's disposition; if the panel dies, pricing.js:110 + copy :88 + the edge function become sell-side orphans — coordinate the owner flag so it is raised once, not twice |
| §E2 townMapStyles ordering | TE-STRIP-2's coerceStyleId re-home EDITS consumers of townMapStyles.js but does not delete the file — the ladder's :50 import stays green through that landing; no new constraint |

Scratch artifacts: none beyond this report; all receipts reproducible from the two commands in the header.
