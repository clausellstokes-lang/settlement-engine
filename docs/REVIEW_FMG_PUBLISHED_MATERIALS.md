# REVIEW_FMG_PUBLISHED_MATERIALS — wiki, Patreon/blog, battle mechanics, UX affordances (2026-08-29)

**Ordered by the owner at ODQ §730: qualitative review of Azgaar's published materials for peer/analogous features, battle mechanics foremost, under the TIE-BACK LAW (2026-08-29(c)): every published claim verified against upstream source before acceptance. Review workflow `wf_6ce0f553-76f` (four study lanes + synthesis); tie-back pass `wf_8a4f0e33-8c8` (three lanes; ALL candidates survived, zero kills). Accepted candidates are chartered in `docs/DESIGN_FMG_WEAVE.md` AMENDMENT A2. Reports verbatim below.**


---

# SYNTHESIS (the addendum)

# ADDENDUM — W1–W4 study synthesis (wiki full sweep · battle deep-dive · Patreon/blog · UX affordances), deduped against §727 + WEAVE

Every claim traces to a lane finding (W1-n, W2-Fn, W3-n, W4-Fn); no new reading. Dedupe base: §727 synthesis §1–§3 (12 candidates + smaller steals) and DESIGN_FMG_WEAVE (cars SEAM/CAP/NAME/NET/POLIS/VAR/ST/W-ARMS, substrate D1–D12, Amendment A1). All four lanes were read-only; CONFIRMED = read-and-cited, nothing executed.

---

## 1. NEW EMULATION/RECONCILIATION CANDIDATES (ranked; none covered by §727/WEAVE)

**ADD-1 · Engagement-narrative deriver + battle-kind taxonomy — the owner's named example.** (W2-F3+F4, W1-1; demand receipt W3-4.)
- THEIRS: 6 geography-conditioned battle types each with a phase state machine (skirmish→melee→retreat→pursue; blockade→bombardment→sortie→storming→looting), plus an applied "engagement progression" phase record and two prose ladders (battle status, per-regiment condition) — `battle-screen.ts:455-466, 934-1086, 1238-1270, 1356-1359`.
- OURS: engagements resolve to a 4-value outcome band + receipt strings (`warDeployment.js:813-816`, `warSiegeVerdict.js:299-304`) — mechanically receipted, dramatically flat.
- Quality won: comprehensiveness + player-facing legibility; FMG's community explicitly requested the narrative record (PR #1504, W3-4).
- Reconciliation: a pure display-leaf deriver (the A1.1.1 family, `src/domain/display/` beside `warStatus.js`): (kind, outcome band, siegeAge, attrition deltas, capitulation/forcedLift, composition, terrain) → typed phase sequence from a closed per-kind vocabulary + authored prose ladders (MIT attribution if theirs are copied verbatim). The KIND is derived at render time from record data we already hold — naval-vs-naval → sea, convoy-origin siege → landing flavor, forest/wetland terrain → ambush flavor — **never a mechanical modifier** (see §2). Every narrated fact must already stand in the engagement record (clerk-never-writer). Effort **S-M**. Constitutional fit: finite semantics, zero engine state, zero golden risk; one caveat — if the record lacks a terrain stamp, one additive future-tick field is needed, same family as Q-W4's `region` grant.
- LANDS: **new car NAME-3 in W-NAME** (sibling of NAME-1's war-name deriver; same display-leaf law). Its output is also the natural legend-writer for POLIS-3's ledger-fed battlefield markers.

**ADD-2 · Typed force-composition clerk.** (W2-F2, W1-2 — convergent.)
- THEIRS: every force a legible bag of typed units generated from settlement character (`military-generator.ts:20, 72-203, 419-423`); OURS: a scalar `currentEffectiveStrength` + six abstract facets, no unit-type concept anywhere (grep-zero outside a materiel regex).
- Quality won: world legibility ("3,200 foot, 400 horse, 12 engines march on X"); our engine math stays untouched.
- Reconciliation: `deriveForceComposition(settlement, deploymentRecord) → {type: count}` over a CLOSED ~6-type medieval vocabulary (+`war_mages` under magic settings; their aviation/armored dropped — outside EUROPEAN_FANTASY_BASE), authored weight tables keyed on terrain/culture/government/materiel/port; FMG's possession-divider idea (W1-4, W2-F9a) enters as composition *weights*, display only. Derived-on-read — no record stamp, zero bytes. Composition is derived FROM strength, never an input TO it (no second engine). Effort **M**. LANDS: **new car NAME-4**, same family; feeds ADD-1 and herald/dossier.

**ADD-3 · Realm census table — our own legibility law's missing third rung.** (W4-F1.)
- THEIRS: one shared overview kit (typed sortable columns, persisted filters with "X of Y" denominators, column picker, footer aggregates) reused across 10+ overviews (`table.ts:91-104`, `military-overview.ts:140-186`). OURS: no realm-wide sortable table exists — register prose and card lists only (CONFIRMED, `heraldRegister.js`, `LiveWarStatus.jsx`).
- Reconciliation: a Gazetteer register⇄table toggle; columns drawn only from derivations that already ship (tier word, prosperity word, war status, threat); DM-instrument tier gets numeric columns, player surfaces stay banded; the militarization index (W2-F9b, W1-5 — forces as % population) debuts as a column. Pure projection over `gazetteerRows` + standings selectors; secrets seam as heraldRegister already enforces. Effort **S-M**. LANDS: **new wave W-DESK, car DESK-1** (all W-DESK cars are display-plane, post-STRIP-6 per WEAVE §4.2; no existing car owns overview surfaces).

**ADD-4 · Map↔word linkage pair.** (W4-F3+F4.) Herald rows/entity chips write the existing `hoveredSettlementId` on hover → marker glows; a "show on map" secondary affordance pans/zooms the viewport to a placement (grep: zero `zoomTo/panTo` sites in our map components vs 12 in theirs). Zero new state — the store field exists. Effort **S+S**. LANDS: **DESK-2**.

**ADD-5 · Authored comparison charts.** (W4-F5.) Their free-form chart builder is forty-sliders; the steals are the **group-by device** (one entity stacked by a second — "population by realm, colored by faith") and the bubble-pack view, delivered as a CLOSED authored set of one-question-one-picture comparisons over existing read models; banded player-side, numeric DM-tier. Effort **M**. LANDS: **DESK-3**.

**ADD-6 · Perspective-anchored standings view.** (W4-F7.) "The world as Keth believes it" — one power picked, every relation phrased in plain language with term tooltips. Fits our belief layer *better than it fits FMG* (their own matrix is omniscient; ours would be honestly belief-scoped from `domain/display/warStatus.js` reads). The N×N matrix half is NOT adopted (§4). Effort **S-M**. LANDS: **DESK-4**.

**ADD-7 · Travel-time rings.** (W1-13 + W3-5 — convergent, independently flagged.) Their party marker draws raw-distance circles; we own the substrate they lack (`hopWeeks` over the frozen digest) and would draw honest isochrones ("a week's ride / a season from here"). Render-only, recomputable, no canon writes. Effort **S-M**. LANDS: **extends POLIS-3** (D9 overlay registry) as a new feed. High DM charm; fits the owner's map leg.

**ADD-8 · Legibility texture batch.** (W4-F2/F8/F9 + W1-9/W1-10.) Filtered-denominator sentence footers ("Twelve places stand; three strained; two at war") · door→overlay affinity as a reversible one-tap chip · overlay toggles as CommandPalette commands + shortcuts shown in tooltips · named display units on distances (GAME-GRADE UX) · optional `?focus=<settlementId>` deep-link params on the world route (worldCode identity untouched — ours-better stands). All **S**, UI-state only. LANDS: **DESK-5**.

**ADD-9 · Culture sub-roster device.** (W1-8.) Their culture-*set* pool (per-entry inclusion odds) as a variability lever INSIDE our authored roster — "which of our cultures appear this world, weighted", drawn from the plan fork; content stays EUROPEAN_FANTASY_BASE; placement affinity UI-suggestion-only per §727 §3. Effort **S**, plans-only, dormant. LANDS: **extends POLIS-1** (D5's one-plan-car law — must ride its single declared plan shift, or defer to a follow-on plan car).

**Owner-gated (new capability / paid-surface — rows, no cars minted):**
- **ADD-10 · Typed data export** (W4-F6 + W1-11 merged): CSV/JSON of visible tables after viewerSecrets redaction (+ optional GeoJSON canon export later). Technically **S-M**; whether export is free or entitled is paid-surface behavior → owner row.
- **ADD-11 · State treasury / tax-typed-by-government-form** (W1-12): would feed existing `warCosts`/`coalitionExpenditure`; finite-semantics-clean but new engine state. **M**.
- **ADD-12 · DM battle theater** (W1-3, W2-F11): their apply-or-cancel interactive loop is rejected as mechanics (violates determinism/PROMISE — a battle is engine physics, not a minigame); the safe form, if ever wanted, is an interactive *replay* of ADD-1's derived narrative. Genuinely new capability.
- **ADD-13 · Engagement-kind as engine modifiers** (W1-1's original sketch — kind modulating outcome-band/attrition multipliers): the synthesis rules AGAINST it (W2-F4: new combat physics for zero product need + golden shift); recorded here as a vetoable escalation option only. Default is ADD-1's narrative-only form.

---

## 2. BATTLE MECHANICS VERDICT

**Headline (W2, CONFIRMED at source level — first coverage of `battle-screen.ts`/`military-generator.ts` by any lane):** FMG's battle layer is a manual, unseeded, consequence-free UI toy — `count × power × phase-table` rolled on ambient `Math.random`, attacker teleported to the defender, results touching only notes and a marker; a battle cannot take a burg, shift diplomacy, or scar a population (`battle-screen.ts:1252-1367`). Six years of stagnation confirm it (W3-11). Our lifecycled war stack is **categorically superior on every mechanical axis**: lifecycle/consequence (F1, F8), bounded deterministic attrition vs annihilation spirals (F5), supply/logistics (F7), determinism and receipted rolls (F10), campaign-scale morale-as-scars vs dialog-scoped morale (F6).

**What we adopt — display/derivation layers over our engagement records, never a second engine:** the "war legibility" tranche = **ADD-1** (phase narrative + kind taxonomy, S-M) + **ADD-2** (typed composition clerk, M) + the militarization index (S, rides ADD-3) — joining §727 #4 (war proper nouns, NAME-1) and #7 (ledger-fed battlefield markers, POLIS-3) as one coherent package. Their in-battle morale texture and ambush/landing flavors surface only through ADD-1's narration; ADD-1 can also surface our *honest* receipted roll ("the storm hung on a knife's edge — 0.31 against 0.34") where their visible die is unseeded theater.

**What we refuse (guard-list, §4):** ambient-RNG rolls, annihilation-to-zero, teleporting attackers, fabricated regiment backstories, mid-battle steering, their morale/supply models.

**Open questions for the chair (W2):** whether herald/dossier already surfaces any per-war force description (display layers unread — determines enrichment vs new surface); F2 vocabulary authored per-culture or global; whether engagement records carry a terrain stamp (else one additive declared field, Q-W4 family).

---

## 3. ALREADY-COVERED (mapping only)

- Culture types/expansionism/spread (W1 p.5) → §727 ANTHRO, candidate #8's cost mechanics.
- Marker registry + ~35-type vocabulary + per-type multiplier config (W1-7, W2-F8) → **#7 / POLIS-3** — the wiki list is a completeness checklist and the multiplier-with-0-off idiom is the right dormancy-friendly config shape; feed as design input.
- Heightmap DSL/templates/editor pages (W1 p.12-13) → **#12 / VAR-1** (confirms seeded reproducibility + templates-as-shareable-text ecosystem).
- River mainstem/type words + "navigable rivers" as 2026 headline feature (W1 p.15, W3-3) → **#3 / CAP-2** — demand corroboration, raises its product-value rank.
- Lock doctrine / locks-grew-monotonically (W1 p.17, changelog §C3, W4-F11) → **#11** + §2 ours-better (byte-dormancy is the stricter contract, validated).
- Goods distribution predicate DSL (W1-6) → refines the §727 resource-bias/suitability steal (D8 family): express the biasing as an authored predicate table (their `nth()` over `random()` is our determinism preference); no new car.
- War Alert formula/dividers (W1-5 substance) → §727 ANTHRO / `martialReadiness` ours-better; only the % display stat is new (rides ADD-3).
- Battle-narrative community demand (W3-4) → corroborates **#4 / NAME-1** and ADD-1.
- Trello backlog clusters (W3-10) → corroborate #1 (namegen), W-ARMS (heraldry), and §2 ours-better (alliances/diplomacy asks).
- Seed history / maplink (W1 §C) → superseded by `worldCode` (§2 ours-better).

---

## 4. OURS-BETTER / NOT-APPLICABLE (+ guard-list additions)

**Ours-better (do not regress):** war lifecycle/consequence, bounded attrition, supply, determinism, campaign morale (W2-F1/F5/F7/F8/F10/F6) · travel semantics — hopWeeks vs their "no travel time calculator" (W1-9) · world identity — worldCode vs seed+options fragility (W1-10) · QuickInspector's curated register vs 20-field cell dump (W4-F10) · pendingEdits typed-directive queue vs editable-cell mutation (W4-F11) · the W4-F12 roster (sentence-first banding, causal drill-in, time lens, single-sourced legend, secrets seam, LAPSED honesty) — recorded so no DESK car regresses them.

**Not-applicable:** heightmap brush/undo UX, image overlay, measurers/grids, hotkey chords (palette-first stays), 3D/satellite, desktop/Electron, N×N omniscient diplomacy matrix on player surfaces (belief layer), mid-battle steering, per-battle die-reroll UI, Q&A/meta pages.

**Guard-list additions (extend §727.3):** (a) **fabricated backstory mints** — their regiment "formed in year X during campaign Y" gauss-mint (`military-generator.ts:555-560`) is the painted-history idiom THE PROMISE forbids; (b) **annihilation + ambient-RNG battle rolls + teleporting attackers**; (c) **AI-as-writer** for notes/flavor (W3-6 — their notes-AI writes freeform prose; FINITE-SEMANTICS bars it; notably they too never let AI write map *data*); (d) **direct canon mutation from overview cells** (their editable War Alert cell rescaling regiments); (e) **mid-battle interactive steering** of engine physics.

---

## 5. PRODUCT SIGNALS (Patreon/changelog/market story)

1. **The thesis quote, twice over:** "The map is static. Over-time simulation is planned, but not yet implemented" (wiki KB, after 9 years) — and the live Trello roadmap still carries *Generate history · Simulate History · Economics simulation* as unstarted cards (W3-1). The market leader publicly aspires to the ground we already hold.
2. **Economy is their newest, fastest bet** (three economy releases in two months, 2026; W3-2, W1-§C6) — arriving as a static snapshot. The feature class sells; our motion-economy stays differentiated but their layer will deepen.
3. **Users' loudest demands:** shape authorship (heightmap tooling is the single biggest changelog thread — supports #12/VAR's ceiling), *my-edits-survive-regeneration* (locks grew monotonically — validates byte-dormancy and #11), narrative war history (W3-4), alliances/diplomacy depth (W3-10), watchable evolution.
4. **A paying audience for exactly our category exists:** third-party "Fantasy Map Simulator" (not Azgaar's) — Steam early access, >85% positive, users asking to import Azgaar maps (W3-8). Worth a future competitive read.
5. **Monetization ceiling of free-tool-plus-Patreon:** ~130 paid of 1,550 members (~8%), funding the person not features; single-maintainer cadence stalls, 2026 velocity leans on outside contributors (W3-7). The clearest external argument for the owner's quality-first paid-simulator position; do not model revenue on their shape.
6. **Failure modes to dodge** (W1-§C): data-in-the-render (their 1.65 river/svg re-homing — our render-derives-from-canon law pre-empts it); rolled-back blanket format change on large artifacts; forced auto-behaviors rejected by users; half-measure visualizations abandoned ("perspective view looks weak") — supports no-compromise doctrine; distribution simplicity has constituency.
7. **The late-stage polish wave** (search, pagination, configurable columns, dialog persistence, minimap, UI tour) is what a mature tool's users demand once content is solved — a ready checklist for W-DESK at our equivalent stage.
8. **Heraldry stays high-perceived-value** (6-year active investment thread, W1-§C5) — corroborates W-ARMS. Minor: their mid-session "generator updated, reload" prompt (1.139.10) is a version-skew guard relevant to our deployed train someday.

---

## 6. COVERAGE HONESTY

- **Fully read:** all 25 wiki pages (W1, 3,674 lines); `battle-screen.ts` + `military-generator.ts` end-to-end (W2 — first coverage by any lane; wiki battle tables independently match the source, incl. one stale comment: ambush is 10% in code vs "20%" comment); the FMG overview/table/highlight kit + military-overview + cell-info (W4); GitHub's 27 releases + live Trello JSON + 2 archived Patreon posts + the dormant 2017-18 blog (W3).
- **Unreadable/unobtained (W3):** Patreon tier details and 55/57 post bodies (login-walled/bot-blocked); the 2020 Military/Battle post bodies (unarchived — secondhand via search snippets, marked); **Reddit entirely unreachable — zero Azgaar reddit statements obtained**; no public design rationale for the 2026 economy arc exists (PR bodies empty).
- **Unread upstream:** regiment/military editor UI bodies, provinces/religions/cultures/labels/zones editors, markets/production overview bodies.
- **Unread ours (bounds the PLAUSIBLE claims):** herald/dossier display bodies and ~40 `war*` module bodies (W2's display-gap claims — narrative flatness, missing force description, missing militarization stat — are PLAUSIBLE at the product level, CONFIRMED at the engine-record level); `mobilization.js` body (W1-4's absence claim); economy module bodies (W1-12's no-treasury claim); routes for the focus-param absence (W1-10); the footer idiom (W4-F2).
- **Nothing executed by any lane** — every reconciliation sketch is PLAUSIBLE design by definition; all THEIRS mechanics claims in W1/W2 are CONFIRMED source reads, W3's marked items are secondhand.
- Minor upstream contradiction noted: wiki Working-offline.md denies an Electron build while v1.149.0 shipped one (W3-9 confirms shipped) — the wiki page is stale; treat wiki as point-in-time.

---

# W1 — WIKI SWEEP

**LANE W1 REPORT — THE FULL WIKI SWEEP (25/25 pages read end-to-end)**
Materials: fmg-wiki clone at `.../scratchpad/fmg-study/fmg-wiki/`; our counterparts verified against `.../fmg-study/ours/` (build tip 73f5dfc02). Cross-referenced against `REVIEW_FMG_RECONCILIATION.md` (§727 synthesis + appendices) and `weave-verify/V-genesis.md`. Nothing executed; all OURS claims are read-and-cited (CONFIRMED = quoted source, PLAUSIBLE = labelled).

---

## A. PAGE ROSTER + DISPOSITION (denominator: 25)

| # | Page | Disposition |
|---|---|---|
| 1 | Battle-Simulator.md | **FEATURE — NEW findings W1-1..W1-3 below** (the owner's named example) |
| 2 | Military-Forces.md | FEATURE — partially covered by §727 (ANTHRO read military-generator alert/modifier tables); NEW nuggets W1-4, W1-5 |
| 3 | Changelog.md | **THE EVOLUTION STORY — section C below** |
| 4 | Culture-sets.md | FEATURE — culture-set roster device; NEW-minor W1-8; content itself DIVERGENT (non-European bases barred) |
| 5 | Culture-types.md | ALREADY-COVERED (§727 ANTHRO: 7-type enum, expansionism, spread costs — "one enum, five systems") |
| 6 | Goods-spread-functions.md | FEATURE — distribution-DSL device; NEW-refines W1-6 |
| 7 | Markers.md | ALREADY-COVERED (#7 ledger-fed marker registry); wiki adds the full ~35-type vocabulary + per-type multiplier idiom (W1-7) |
| 8 | Scale-and-distance.md | FEATURE — units indirection; W1-9; measurers/grids NOT-APPLICABLE (map-tool UI) |
| 9 | URL-parameters.md | FEATURE — W1-10 (deep links); seed-sharing itself OURS-BETTER (worldCode) |
| 10 | GIS-data-export.md | FEATURE — W1-11 (structured data export), low priority |
| 11 | Ollama-text-generation.md | PEER — their AI is a notes clerk with user-supplied key, browser-only storage; matches our AI-clerk doctrine. One nugget: local-model option = zero-egress prose clerk (owner-gated future). No emulation needed |
| 12 | Heightmap-customization.md | ALREADY-COVERED (#12/F1); adds brush/undo/erase-keep-risk UX detail — NOT-APPLICABLE headless |
| 13 | Heightmap-template-editor.md | ALREADY-COVERED (#12); confirms 10-op DSL + seeded reproducibility + templates as shareable text files (community ecosystem signal, §C) |
| 14 | Heightmap-image-overlay.md | NOT-APPLICABLE (tracing aid for manual map editing) |
| 15 | River-Editor.md | ALREADY-COVERED (#3 river magnitude); adds mainstem/basin tree + type word ("fork","creek") — display vocabulary only |
| 16 | Knowledge Base.md | MIXED — economy/markets/taxes answers feed W1-12; "time does not exist / over-time simulation is planned but not implemented" is the thesis-confirmation quote; seed-reproducibility caveats feed W1-10 |
| 17 | User-Interface.md | UI reference — lock doctrine ("lock everything possible") ALREADY-COVERED (#11); layers/presets NOT-APPLICABLE |
| 18 | Quick-Start-Tutorial.md | UI reference — NOT-APPLICABLE; confirms Configure-World climate surface (covered #6/F5) |
| 19 | Hotkeys.md | NOT-APPLICABLE (bindings list) |
| 20 | Q&A.md | NOT-APPLICABLE (support/meta; MIT license + "no team" context) |
| 21 | Home.md | NOT-APPLICABLE (index page) |
| 22 | Dependencies.md | Context only — D3/Delaunator/Alea + vendored legacy bundles; confirms Alea-seeded RNG (ours-better guard already covers RNG) |
| 23 | Run-FMG-locally.md | NOT-APPLICABLE |
| 24 | Working-offline.md | NOT-APPLICABLE (also contradicts Changelog 1.149 "Desktop App support" — wiki says no Electron build; treat desktop claims as unsettled upstream) |
| 25 | _Footer.md | NOT-APPLICABLE (nav) |

---

## B. FINDINGS

**W1-1. Battle-type vocabulary conditioned on geography — NEW.**
- THEIRS: Battle-Simulator.md picks 1 of 6 typed battles from context, in order: Naval (both naval), Air, **Landing** (naval attacker w/ land units vs land defender), **Siege** (defender "stands in a burg with walls or a citadel"), **Ambush** ("10% chance when the defender is in a forest or wetland biome" — biome list given), Field (else). Each type owns a phase graph.
- OURS: two engagement kinds — siege at the walls (`warSiegeVerdict.js` header: "THE SIEGE CONTEST… the two mutually-exclusive resolution cores") and field battle on marching-column collision (`armyTransitKernel.js` header: "COLLISIONS → FIELD BATTLES… clamped resolver"). Naval strength exists (`navalStrength.js`, `navalKernel.js`) but no landing/ambush engagement kinds; terrain enters only as defender fortification/terrain scaling (`attrition.js:105-109`).
- VERDICT: **THEY-BETTER (comprehensiveness of the engagement-kind vocabulary)**; OURS-BETTER on everything downstream (their simulator is manual/UI, ours is lifecycled, deterministic, convergence-proved).
- Reconciliation: a closed `engagementKind` enum (`field|siege|ambush|landing|naval`) derived deterministically at engagement time from data we already hold — collision cell's terrain class from the frozen digest (ambush), origin-naval + coastal target (landing), naval-vs-naval (naval) — modulating the existing outcome-band probabilities and attrition band multipliers, exactly as fortification already does. Finite semantics (typed kind, authored modifier table); keyed PRNG untouched (kind is derived, not drawn); dormant behind the spatial marker like M5 (aspatial worlds byte-identical). Effort S-M. Kind lands in the war receipt → NEWS ADDRESS LAW prose ("ambushed in the Tarn woods") for free.

**W1-2. Typed unit composition with per-phase effectiveness — NEW.**
- THEIRS: 8 hard-coded unit types (melee/ranged/mounted/machinery/naval/armored/aviation/magical); strength = Σ `count × power × phase modifier`; full modifier matrices per phase per battle type (e.g. Field: Skirmish ranged 2.4 vs melee 0.2; Pursue mounted 4). Military-Forces.md: user-definable units with rural/urban conscription %, crew, power, optional biome/state/culture/religion limits (limits added at 1.71 — see §C).
- OURS: armies are aggregate scalars — `armyTransitKernel.js` header: "AGGREGATE… this moves strength/size NUMBERS only"; strength facets are supply/morale/magic/food (`attrition.js:111-115`), never composition. Materiel exists only as a goods regex (`militaryStrength.js:85`).
- VERDICT: **PEER-DIFFERENT leaning THEY-BETTER (world-legibility flavor), adoption display-side only.** Their composition is one-shot decoration; porting it into the engine would regress toward static idioms (§727.3 guard: ANTHRO already ruled "per-state standing composition is flavor — low-priority"). What the wiki adds beyond §727: the **phase-modifier matrices are a complete authored tuning artifact** worth keeping as reference data if a display-side composition deriver ever lands.
- Reconciliation (if taken): a pure display deriver — function of (settlement terrain class, culture key, tier, martialReadiness band) → typed regiment flavor rows for herald/dossier; finite-semantics clerk, zero engine state, zero same-seed risk. Effort S. Owner-gated only if it grows into engine-affecting capability.

**W1-3. DM-in-the-loop iterative battle theater — NEW (product surface).**
- THEIRS: the Battle Simulator is *interactive*: DM adds regiments to either side (no state restriction), steps iterations, re-rolls the two dice (`die/10 + 0.4` strength multiplier), overrides type/phase, names the battle, then **applies or cancels**; applying writes the regiment legend note + a battlefield marker (Battle-Simulator.md: "regiments' note… updated… and also a battlefield marker is getting added").
- OURS: engagements resolve autonomously inside the pulse; DM authority exists at the campaign level but there is no interactive engagement-resolution surface (CONFIRMED absent from the domain layer; UI layer unread — PLAUSIBLE absent overall).
- VERDICT: **THEY-BETTER (the apply-or-cancel loop as a product idea)** — but genuinely new capability ⇒ **OWNER-GATED** per standing carve-outs. Note their morale model (initial morale from strength ratio floored at 50, minus up-to-15 supply-line-length penalty) is subsumed by our lifecycled facets + courier umbilical — do not import.

**W1-4. Occupied-territory conscription dividers — NEW-minor.**
- THEIRS: Military-Forces.md possession dividers — troops divided when cell culture ≠ state's dominant culture (÷2; ÷1.2 for Unions), cell religion ≠ state-center religion (÷2.2 Theocracies, ÷1.4 others), different landmass (÷1.8; ÷1.2 Naval). A one-table "cohesion discounts mobilizable strength" law.
- OURS: mobilization (`mobilization.js`, ramps per V-genesis §40) reads posture/readiness; whether cultural/faith alignment of held territory discounts mobilized strength is PLAUSIBLE-absent (files unread in depth).
- VERDICT: PEER-DIFFERENT; the *device* (typed cohesion divider on mobilization) is a clean finite-semantics candidate for the tuning pass if occupation-era mobilization ever needs texture. Effort S. Not urgent.

**W1-5. War Alert as a legible militarization index — ALREADY-COVERED in substance** (ANTHRO read the alert tables; ours-better on dynamics via `martialReadiness.js` threat index). Wiki adds only the display convention: militarization surfaced as a % of population ("normally about 1–2%") — a cheap herald/dossier sanity stat. NEW-minor, display-only, S.

**W1-6. Goods distribution-expression DSL — NEW-refines §727's resource-bias steal.**
- THEIRS: per-good placement = closed predicate vocabulary over cells (`biome()/minHeight()/shore()/river()/type()/minTemp()/nth()/random()`), full 40-good default catalog printed; one good per cell; per-good cell cap `ceil(200 × cells/5000)`; goods reshuffled per cell so "no good gets a systematic advantage".
- OURS: terrain-compatible random tables with tier-scaled depletion (`steps/resolveResources.js` per SF-SIM §648); §727 already recommends biasing by captured pack data.
- VERDICT: **THEY-BETTER (elegance of the device)** — a closed, authored predicate table *is* our finite-semantics idiom, and `nth()` (deterministic per-cell) over `random()` is exactly our determinism preference. Reconciliation: when the §648 resource-bias steal is built, express the biasing as an authored predicate table over captured pack fields (biome/height/shore-ring/river-band) rather than ad-hoc conditionals — same behavior, auditable as data. Effort folds into the existing steal; no new candidate.

**W1-7. Marker vocabulary + per-type multiplier config — extends ALREADY-COVERED #7.** The wiki's ~35-type list (inns on busy roads, lighthouses at route-dense coasts, pirates on major sea routes, mirage in hot desert, portals "in the oldest towns", necropolises in near-empty cells, **party marker** — see W1-13) is a ready completeness checklist for the ledger-fed registry's selector set; the settings idiom (per-type multiplier, 0 = off; fantasy-only types default 0 unless a fantasy culture set is active) is the right dormancy-friendly config shape. No new effort row — feeds candidate #7's design.

**W1-8. Culture-set roster device (odd + placement-affinity scoring) — NEW-minor.**
- THEIRS: Culture-sets.md — a set is a themed pool; each entry has an *odd* (inclusion chance) and a *sort* function scoring cells for its center ("why Inuk tends to appear in cold regions"); Antique weights Roman ×4; Random set generates namesbases on the fly; cap `min(option, set max)` lowered on small maps.
- OURS: 9 authored culture keys, no roster/pool device (`cultureProfiles.js` per ANTHRO).
- VERDICT: PEER-DIFFERENT. The *content* is barred (non-European bases; geography-determined identity is §3-DIVERGENT). The *device* — authored sub-rosters with per-entry inclusion odds drawn from the plan PRNG — is a legitimate variability lever inside EUROPEAN_FANTASY_BASE if the owner ever wants themed world flavors ("which 6 of our 9 cultures appear, weighted"). Effort S, plans-only, dormant. Placement-affinity only as a UI suggestion (per §3 ruling).

**W1-9. Units indirection (scale/population-point/height-exponent) — PEER-DIFFERENT, mostly skip.**
- THEIRS: Scale-and-distance.md — one map pixel = N units (0.01–20), population *points* × configurable ratio (10–10000 people/point), urbanization ratio, height exponent 1.5–2.2 re-deriving displayed altitude (and feeding temperature).
- OURS: `distanceRead.js` derives `hopWeeks` from the frozen digest with a self-calibrating weeks-per-cost constant ("never a magic number") — **OURS-BETTER on travel semantics** (FMG's own KB: "There is no travel time calculator"). We have no *display-unit* layer (grep: no distance-unit vocabulary outside prose).
- VERDICT: OURS-BETTER on substance; the one adoptable nugget is the display convention that distances/areas surface in a named unit rather than raw numbers — GAME-GRADE UX territory, S, display-only, whenever map/travel prose surfaces distances.

**W1-10. Deep-link URL parameters — NEW-minor (render-side).**
- THEIRS: URL-parameters.md — `scale/x/y`, `burg=<id|name>`, `cell`, `preset`, `layers` open the map focused and dressed; `maplink` loads a hosted file; 1.149 added layers/preset params. Their seed-sharing caveat ("the result also depends on the generation options and the map size… a different generator version will produce a different map") is the anti-pattern.
- OURS: `worldCode.js` — versioned, checksummed, fail-closed share code regenerating "the byte-identical world client-side" (CONFIRMED, header). **OURS-BETTER on world identity.** But worldCode carries no *viewport/focus* payload: a `/world/<code>?focus=<settlementId>` deep link (focus a settlement, choose an overlay) is absent (PLAUSIBLE — routes unread).
- VERDICT: THEY-BETTER on the focus-param convenience only. Reconciliation: optional query params on the existing world route, UI-state only, zero engine surface. Effort S.

**W1-11. Structured world-data export (GeoJSON/CSV/JSON) — NEW-minor, low.**
- THEIRS: GIS-data-export.md + KB — GeoJSON per layer (cells/routes/rivers/markers/zones) with typed per-cell properties, burg CSV with lat/long + feature flags, JSON full/minimal; motivation quote: GIS gives "layers… view of the world at different times in history" and database-linked maps.
- OURS: `realmMapExport.js` (image-side); saves are JSON blobs; no analyst-grade tabular/geo export (CONFIRMED grep: no geojson/csv writers in src).
- VERDICT: PEER-DIFFERENT; a typed canon export (settlements + edges + ledger digests as CSV/JSON tables) is a cheap power-user comprehensiveness play, but no product surface demands it today. Effort S-M. Park.

**W1-12. State treasury + tax-by-government-form — NEW-minor, owner-gated.**
- THEIRS: KB — per-state Treasury; Sales tax on deals where the state sells + Poll tax per population point; base rates typed by state form ("a Theocracy taxes sales heavily, a Monarchy taxes people more, an Anarchy collects nothing"), jittered per state.
- OURS: treasury exists only as prose vocabulary (`rulingPower.js:181` "the racket is the treasury"); no per-faction fiscal ledger (PLAUSIBLE — economy modules unread in depth; SF-SIM §624h saw taxes upstream and did not claim we hold one).
- VERDICT: THEY-BETTER (comprehensiveness) *if* faction wealth ever becomes load-bearing (war chests would feed warCosts/coalitionExpenditure — both modules exist). Typed-rate-by-form is finite-semantics-clean. New engine state ⇒ **OWNER-GATED**. Effort M.

**W1-13. Party marker with travel-range rings — NEW (small, high charm).**
- THEIRS: Changelog 1.139.7 — "Party location marker with travel range rings"; Markers.md: "a single movable marker placed in a burg, meant to track the current location of an adventuring party."
- OURS: nothing party-facing on the map (MarkersLayer is user annotations, §727); but we own the real substrate FMG lacks — `hopWeeks` travel time over the frozen digest.
- VERDICT: **THEY-BETTER (product legibility), and we'd do it honestly**: rings fed by actual route-cost isochrones ("1 week / 2 weeks / a season from here") instead of their raw-distance circles. Render-layer only, recomputable, no canon writes. Effort S-M. Strong DM-surface fit with the owner's map leg.

---

## C. CHANGELOG.MD — THE FEATURE-EVOLUTION STORY (read end-to-end, 0.1b 2017 → 1.149.0 2026-08-27)

**Where they invested repeatedly (revealed user demand):**
1. **Heightmap/terrain tooling — the single biggest thread** (0.50b templates → 0.52b image converter → 0.7a world/climate config → 1.83 mask/invert + new template → 1.84 heightmap selection screen → 1.93.12 custom color schemes → 1.116 Fill brush + undo → 1.118 jagged coastlines → 1.123 eroded terrain/satellite → 1.146 preserved manual coastline vertices). Users overwhelmingly want *shape authorship*. For us this endorses candidate #12's ranking caveat: high ceiling, and demand is proven — but their demand is from map-artists; our buyer is a world-simulation buyer. Neutral-to-supportive of #12.
2. **Rivers reworked ~5 times** (0.53b, 0.56b, 1.6 flux/Penman/lake-typology, 1.62 lake handling, 1.65 "river data is now stored in object, not svg" + course preserved on edit). Two lessons: hydrology realism was worth repeated cost (supports #3/#10), and the 1.65 entry is a textbook **failure mode we already dodge** — data living in the render (svg) until it had to be painfully re-homed. Our render-derives-from-canon law is the pre-emptive fix.
3. **Locks/preservation grew monotonically** (1.61 burg locks → 1.89 states/provinces/cultures/religions locks → route locks → marker locks → 1.146 manual vertices preserved → per-option locks). Users demand *my edits survive regeneration* — the exact pressure our byte-dormancy + `regenerationPreservation.js` answers more strictly. Validates the §2 ours-better ruling; also strengthens #11 (randomize-unless-locked) as genuinely demanded UX.
4. **Military/battle** (1.3 forces → 1.4 battle sim → 1.71 unit limits by biome/state/culture/religion → 1.107 custom regiment icons): sustained but *shallow* investment — all generation/display, zero dynamics in 6 years. The demand signal is for *war texture*, which our living war layer already out-delivers; W1-1/W1-3 are the missing display/DM surfaces.
5. **Emblems/heraldry** (1.0 COAs → 1.5 generation+Armoria → 1.9 multi-color charges → 1.91 data model → 1.148 rendering optimization): long-lived, still active. Corroborates §727's heraldry row (owner-gated L) as high-perceived-value.
6. **Economy is their newest big bet** (1.124 Economy → 1.125 charts, June 2026) — the market/production/trade/tax layer arrived *last* and is still single-cycle ("numbers change only when you regenerate… not over time", KB). They are converging on our territory with a static snapshot; our motion-economy remains ours-better, but their arrival confirms the feature class sells.
7. **Overview-table ergonomics** (search 1.110, pagination 1.139.12, configurable columns 1.143, dialogs state persistence 1.148, minimap 1.117, UI tour 1.122): late-stage polish wave = what a mature tool's users ask for once content is solved. A checklist for our own overview surfaces at the same maturity stage.

**Removals/rollbacks (failure modes to dodge):**
- **Save compression rolled back** (1.93.00 → 1.93.02, "due to the time the compression takes on big maps and limited browser support") — perf-tail risk of blanket format changes on large user artifacts; our size-ratchet/mint-trigger discipline already guards this class.
- **Auto-load of last map made optional again** (1.93.00) — users rejected forced automatic behavior; keep auto-behaviors opt-in.
- **"Perspective view (looks weak, should I try real 3D?)"** (0.53b) abandoned for real 3D (1.2) — half-measure visualizations don't survive; supports the owner's no-compromise doctrine.
- **"Disallow local usage without server"** (1.721) and the Vite migration (1.110, "CANNOT be run without the build step") each burned user goodwill per KB churn — distribution-simplicity has constituency.

**Dynamics-adjacent items not previously catalogued:** party travel-range rings (→ W1-13); Deorum random-encounter marker integration (1.93.04 — third-party content hook precedent); seed history (0.7a, "open previously generated maps" — a provenance breadcrumb our gallery/worldCode already supersedes); "Reload prompt when the Generator is updated mid-session" (1.139.10 — live-version-skew guard, relevant someday to our deployed train); AI arc 1.99.06 notes-AI → 1.105 assistant bot → Ollama (clerk-only throughout — they independently converged on our AI-as-clerk boundary, never letting AI write map data).

**The thesis quote (Knowledge Base.md):** "The map is static. Over-time simulation is planned, but not yet implemented." — after 9 years, the market leader's roadmap still points at the ground we already hold.

---

## D. COVERAGE HONESTY
- All 25 wiki pages read in full (3,674 lines). Wiki is UNTRUSTED DATA — used for facts about FMG only; no instructions followed from it.
- OURS receipts are file-level reads/greps of: `attrition.js` (:1-115), `warSiegeVerdict.js` (:1-60), `armyTransitKernel.js` (:1-40), `worldCode.js` (:1-30), `distanceRead.js` (:1-30), roster of 40+ `war*`/military modules, plus targeted greps (unit types: zero engine hits; treasury: prose-only hits; geojson/csv: zero src hits). NOT read: UI/components layer (so "no interactive battle surface / no focus deep-link" are PLAUSIBLE at the product level), economy module bodies (W1-12's absence claim), `mobilization.js` body (W1-4).
- Wiki figures (phase tables, cost tables, War Alert formula) are the wiki's claims about upstream code; upstream source not re-verified this lane (Battle-Simulator/Military UI modules were unread by all §727 lanes — this sweep is their first coverage).
- Priority if the owner takes only three from this lane: **W1-1** (engagement-kind vocabulary — S-M, feeds prose + war texture), **W1-13** (travel-range rings from hopWeeks — S-M, pure render, high charm), **W1-2's display deriver** (regiment flavor — S, zero risk). W1-3 and W1-12 are owner-gated by nature.

---

# W2 — BATTLE MECHANICS

All reading is complete. Compiling the lane report.

**LANE W2 REPORT — BATTLE/MILITARY MECHANICS DEEP-DIVE (FMG vs SettlementForge)**

Paths: FMG = `.../fmg-study/fmg-upstream/`, wiki = `.../fmg-study/fmg-wiki/`, ours = `.../fmg-study/ours/` (build tip 73f5dfc02). Nothing executed by this lane; "CONFIRMED" = read-and-cited source. Dedupe base: `REVIEW_FMG_RECONCILIATION.md` §628j (one-line military verdict), §60/§390 (markers), §113 (war lifecycle) — `battle-screen.ts` and `military-generator.ts` lines 240-587 were UNREAD by every §727 lane; this lane covers them in full.

**Coverage denominator.** THEIRS read IN FULL: `src/generators/military-generator.ts` (587 L), `src/controllers/battle-screen.ts` (1406 L), wiki `Battle-Simulator.md` (117 L), `Military-Forces.md` (128 L). NOT read: `regiment-editor.ts`/`regiments-overview.ts`/`military-overview.ts`/`draw-military.ts` (editor/render UI; mechanics are fully covered by the two files above — the battle engine lives entirely in battle-screen.ts). OURS read IN FULL: `src/domain/worldPulse/warDeployment.js` (1294 L), `warSiegeVerdict.js` (340 L), `militaryStrength.js` (328 L); heads+key bodies: `attrition.js` (:1-80 incl. all tunables + band tables), `spatial/armyTransit.js` (`resolveFieldBattle`, `effectiveFieldStrength`, `fieldBattleWinProbability`, `ARMY_TRANSIT_TUNING`, `detectCollisions`), `navalKernel.js` (:1-70), `navalStrength.js` (:1-50), `armyTransitKernel.js` (:1-80), `mobilization.js` (:1-70), `conquestFeasibility.js` (:1-60), `warReasons.js` (:1-60); plus `weave-verify/V-genesis.md` §2 (evaluateWarLayer step 4 spec, adopted). NOT read: `warHomeCosts.js`, `warArmyRecord.js`, `deploymentReturn.js`, `warTermination.js`, the ~40 other `war*` modules (headers/imports only via warDeployment's own doc comments), and all display/herald surfaces — display-gap claims below are PLAUSIBLE for that reason.

---

## PART 1 — THE FMG MECHANIC SPEC (all CONFIRMED)

**Unit model.** Units are user-editable records `{icon, name, rural%, urban%, crew, power, type, separate}` with a closed 8-type behavior vocabulary: melee, ranged, mounted, machinery, naval, armored, aviation, magical (`military-generator.ts:462-515` defaults: infantry/archers/cavalry/artillery/fleet, power 1/1/2/12/50). `crew` feeds headcount display only; `power` feeds battle only; `separate` blocks merging (fleets).

**Forces generation** (`generate()`, :51-460): per state, `War Alert = clamp(expansionRate × diplomacyRate × neighborsRate, 0.1, 5)` (:209-221; expansionRate = expansionism-share/area-share clamped 0.25-4; diplomacyRate 1/0.8/0.5/0.1 off worst relation; neighborsRate from a per-stance additive table :59-70). Per unit type a state modifier keyed on culture-derived state type (`stateModifier` :72-137; Horde ×2 mounted, Republic ×1.2 naval :232-233). Per cell/burg: `troops = pop/100 [× urbanization, ×1.2 capital] ÷ possession-dividers (foreign culture /2 or /1.2 Union; foreign religion /1.4 or /2.2 Theocracy; other landmass /1.8 or /1.2 Naval) × unit% × cellTypeModifier(nomadic/wetland/highland) × stateMod × populationRate` (:253-368); naval only with a haven, placed on the water cell (:292-297). Platoons quadtree-merged smallest-first into regiments of expected size `3 × populationRate`, separate-units segregated (:370-448). Each regiment gets ordinal+province name (:517-529), dominant-unit emblem (:571-584), and a generated backstory note (formed year gauss-random, optionally "during the ${campaign.name}", :536-568) — **the backstory is fiction minted at generation, not history**.

**Regiment record** (`Regiment` :9-31): `{i, a total, u: {unitName: count}, n naval, cell, x/y, bx/by base, name, icon, state}` + transient battle fields `casualties/survivors/px/py`.

**Battle simulator** (`battle-screen.ts`, manual/UI-driven, user-in-loop): 6 auto-selected types — naval (both naval), air (all aviation), landing (naval attacker w/ land units), siege (defender in walled/citadel burg), ambush (P(0.1) in forest/marsh biomes — code :464 says 0.1 with a stale "20%" comment), field (:455-466). Iterative; per side a **phase state machine** (`selectPhase` :934-1086) driven by morale (retreat chance `P(1 − morale/25)`), iteration count, ranged-share (skirmish persistence), power ratio (siege storm chance `P((ratio−1)/2)`, naval withdrawal at ratio <0.5), machinery counts (bombardment/sortie). Phases per type (23 total incl. blockade/sortie/storming/looting/surrendering, shelling/boarding/chase, surprise/shock, landing/flee/waiting, maneuvering/dogfight) each carry an 8-type strength-modifier row (`scheme` :724-885, matching the wiki tables). **Strength** = Σ `count × power × phaseModifier[type]` / populationAdjuster (:887-892). **Initial morale** = `clamp(100 − powerDiff^1.5×10 + 10, 50, 100)` minus a supply-line fee `min(meanDistanceToBase/50, 15)` (:895-904) — supply affects initial morale only. **Die** 1-6 per side → multiplier `die/10 + 0.4` (:1106-1107). **Casualties per iteration** = `Math.random() × max(phaseCasualtyRate)` (per-phase 0-0.5 table :1110-1134) split by strength share `casualtiesA = c × defense/(attack+defense)` (:1136-1139); distributed per-unit with `0.8 + Math.random()×0.4` noise (:1161-1171). **Morale drop** = `casualties×100 + 1` per iteration (:1147-1148). RNG is ambient `Math.random`/`P`/`rand` throughout — unseeded, unreplayable.

**Persistence after apply** (:1252-1367): survivors overwrite regiment composition (`r.u = {...r.survivors}`); a battle-status ladder from relative casualties (flawless victory→stalemate→disorderly retreat, :1260-1270) and a per-regiment losses prose ladder ("was annihilated"→"emerged unscathed", :1238-1250) are appended to notes; a `battlefields` marker is pushed; a legend records initial forces, casualties, losses %, and the **engagement progression** (the phase-sequence record `phasesRecord`, :1356-1359). **Nothing else changes: no burg capture, no territory transfer, no diplomacy shift, no population effect, no economy effect.** Cancel restores everything.

---

## PART 2 — OUR WAR STACK (summary; receipts inline)

One army per settlement (`worldState.deployments[saveId]`, warDeployment.js:4). Opening a war requires: warLayerEnabled (dramatic tones only), hostile-typed edge, mobilization posture ramped over ticks (`mobilization.js` peace→alert→war_preparation→mobilized state machine, ramp rate from disposition/economy/deity/legitimacy, W-PEACE-2 treaty caps), strength ≥ HOSTILE_CONFIDENCE 0.42, CONQUEST_MARGIN 0.12 pre-filter (waived for a deliberated intent order, lifted by typed casus belli ×(1+W·case)), and the deterministic `classifyFeasibility` gate (V-genesis §2 step 4; warDeployment.js:989-1077). The army record is stateful: `currentEffectiveStrength` seeded from the 6-facet capacity model (`militaryStrength.js` — manpower/institutions/materiel/logistics/economy/will, weighted :74-81, war_exhaustion −22/war_drain −18 erosions :296), capped by the worn home's live offensive ceiling (:417-431), degraded by pure bounded attrition per engagement (`attrition.js`: base 3.5%/3% per tick, band multipliers hold 1.0 → decisive_fail 3.0 → costly_success 2.6/2.8, hard cap 0.42/tick), replenished by reinforcement (warHomeCosts). Siege verdict (`warSiegeVerdict.js`): feasibility gate → hard 60-tick ceiling → defender WILL score (0.40 will-facet + 0.25 legitimacy + 0.20 logistics + 0.15 hope; capitulation floor −0.72) → one keyed roll `rng.fork('siege:<T>:<tick>')` over log-odds `0.16×(coalition−defender) − 3 − willBias + interdiction` (aspatial) or starvation×time (spatial M5), yielding an outcome band narrow/costly_success, narrow/decisive_fail. Sub-siege verdicts: harassment raids (severity 0.22), withdrawal with disposition loss scaled by guttedness, defender banks the win (:601-674). Conquest → occupation authority or razing (one mouth, :721-801), conserved population/granary sack, disposition ratchet, war_front retirement, homecoming via deploymentReturn. Field battles between marching armies: `resolveFieldBattle` sigmoid FIELD_K 12 over strength share with **CLAMP_RATIO 3 — P(upset) exactly 0 past 3:1** ("no hand of miracle"), bounded loser loss ≤ 0.45, effective strength = size × readiness × supply × funding × ground(+25% home) × fatigue(−30% deep march). Naval: convoys, shared-fate sea battles via the same resolver, blockades minting sieges through the standard machinery (`navalKernel.js:1-28`). Belief layer: feasibility is a ZERO-IMPORT leaf over banded beliefs (`conquestFeasibility.js:10-16`), chaotic/rusty commanders classify on noisy estimates then fight at true odds (warSiegeVerdict.js:160-186), umbilical fog. Typed casus belli accumulate/decay per directed pair and ride the war record (`warReasons.js`; warDeployment.js:1104-1120).

---

## PART 3 — FINDINGS

**F1. Automated war lifecycle vs manual battle toy — the frame.**
THEIRS: battles exist only when a user clicks "Attack foreign regiment"; the attacker teleports ("It does not matter where attacked regiment is located… moved straight to the selected one", Battle-Simulator.md:3); results touch notes and a marker only.
OURS: wars open, grind, and end inside the tick kernel with feasibility, posture, attrition, exhaustion, coalitions, occupation/razing, treaties.
VERDICT: **OURS-BETTER categorically** (lifecycle, causality, consequence — confirms §727 §628j at much higher resolution). Nothing to port at the mechanics level; their whole simulator is a UI-loop toy over `count × power × table`.

**F2. Typed unit composition — the one big structural THEY-BETTER.**
THEIRS: every force is a legible bag of typed units (`Regiment.u = {infantry: 320, archers: 90, …}`, military-generator.ts:20,419-423), generated from settlement character (culture-type/terrain/form matrices :72-203), displayed everywhere, and driving per-phase battle math.
OURS: an army is a scalar `currentEffectiveStrength` plus six abstract facets (manpower/institutions/materiel/logistics/economy/will — militaryStrength.js:57-63). No unit-type concept exists anywhere in the war stack (grep `cavalry|infantry|archer` under worldPulse: only militaryStrength.js's MATERIEL_PATTERN regex :85). A war is "capacity 62.3 vs 48.1" — mechanically superior, narratively faceless.
VERDICT: **THEY-BETTER (unit-type diversity + world legibility)**; our engine math is stronger and must not change.
RECONCILIATION SKETCH (fits all laws): a pure **display/derivation clerk** `deriveForceComposition(settlement, deploymentRecord | capacityEnvelope) → {unitType: count}` over a CLOSED authored unit vocabulary (finite semantics; ~6 medieval types + optional `war_mages` under magic settings — drop their aviation/armored, outside EUROPEAN_FANTASY_BASE tech). Deterministically apportion the record's strength/manpower facet through authored weight tables keyed on the things we already read: terrain (`resolveSettlementTerrain`), culture profile, government pattern, materiel hits, port status (their stateModifier/cellTypeModifier idiom — emulate the *shape*, author our own numbers; no MIT need unless tables are copied). Zero rng or a keyed fork on the deployment outcome id for remainder-breaking. Consumed by herald/dossier/war panes ("3,200 foot, 400 horse, 12 engines march on X") and by F3's narrative. NO engine read-back — the composition is derived FROM strength, never an input TO it (guard: no second combat engine, §727.3). Effort M. Risk: zero engine bytes if purely display-side; if the composition is stamped onto the deployment record for stability across attrition ticks, that is a record-shape byte shift → dormant flag + declared shift.

**F3. Battle-phase narrative + engagement-progression receipts.**
THEIRS: a battle is a *story arc* — skirmish→melee→retreat→pursue; blockade→bombardment→sortie→storming→looting; surprise→shock; and the applied legend records the full phase sequence with counts ("Engagement progression:", battle-screen.ts:1356-1359) plus prose ladders for battle status (:1260-1270) and per-regiment condition (:1238-1250).
OURS: a resolved engagement carries verdict/ratio/pFall/roll receipt strings (warDeployment.js:813-816) and an outcome band (4 values, warSiegeVerdict.js:299-304). Mechanically receipted; dramatically flat — no phase texture, no "the sortie", no "the storming" (PLAUSIBLE for display surfaces, CONFIRMED absent in the engine records).
VERDICT: **THEY-BETTER (battle-event granularity / player-facing narrative)** — and this is exactly the owner's named example.
RECONCILIATION SKETCH: a pure display-side **engagement-narrative deriver** — function of (battle kind: siege tick/storm/field/sea/blockade, outcome band, siegeAge, attrition deltas, F2 composition, terrain, will/capitulation flag, interdiction level) → a typed phase-sequence (closed phase vocabulary per kind, their 6-type taxonomy pruned to our physics: field/siege/sea/landing-from-convoy/ambush-flavored-by-terrain) with per-phase prose drawn from authored templates via `rng.fork('battleTale:' + outcomeId)`. Every fact it narrates must already stand in the engagement record (clerk-never-writer; the phases are *derived exposition of* the band, not new state). Their two prose ladders port almost verbatim as authored tables (S, MIT attribution if copied verbatim). Capitulation (`verdict.capitulation`) → surrender narrative; harassment → raid narrative; forcedLift → grinding-siege-abandoned narrative — all already distinguishable from existing fields. Zero engine state, zero flags, zero golden risk. Effort S-M. Pairs with §727 candidate #4 (war proper nouns) and #7 (battlefield markers fed from real ledgers) into one "war legibility" tranche.

**F4. Battle-type taxonomy breadth.**
THEIRS: 6 types with distinct phase machines — notably **ambush** (biome-conditioned, battle-screen.ts:464) and **landing** (amphibious assault w/ 50% shock/defense fork, :1022-1039).
OURS: siege (aspatial roll + spatial starvation cores), field (transit collisions), sea battle, blockade→siege (navalKernel.js:14-21) — CONFIRMED. No ambush concept; landing exists only as forced convoy debark on a LOST sea battle (navalKernel.js:16-19), not as an assault mode.
VERDICT: mostly **PEER-DIFFERENT** (our four types are mechanically deeper than their six); a narrow THEY-BETTER on flavor breadth. RECONCILIATION: fold into F3 as narrative flavors (a field battle in forest terrain narrates as an ambush via the keyed fork; a convoy-origin siege opening narrates as a landing). Do NOT add mechanical ambush/landing modifiers — that would be new combat physics for zero product need and a golden shift.

**F5. Casualty math.**
THEIRS: `Math.random() × phaseRate` total casualties split by strength share, per-unit ±20% noise, morale spiral (casualties×100+1), armies annihilable to zero, unseeded (battle-screen.ts:1136-1171).
OURS: deterministic bounded proportional attrition — band-scaled, hard per-tick cap 0.42, floor 0, "a single tick can never annihilate an army", losers retreat mauled never wiped (attrition.js:22-27, ARMY_TRANSIT_TUNING.LOSER_MAX_LOSS 0.45), and the depleted strength feeds the next verdict (the keystone property).
VERDICT: **OURS-BETTER** (boundedness, determinism, auditability, anti-snowball). Guard-list: never import their ambient-RNG or annihilation idioms.

**F6. Morale/will.**
THEIRS: symmetric live per-battle morale for both sides, seeded by strength diff + supply distance, collapsing into retreat phases.
OURS: defender-side will score with capitulation (warSiegeVerdict.js:78-87, 241-260); attacker-side "morale" is the slower exhaustion/disposition/withdrawal arc; field battles carry fatigue/readiness but no in-battle morale.
VERDICT: **PEER-DIFFERENT** — theirs finer inside one battle, ours categorically stronger across a campaign (their morale evaporates when the dialog closes; our exhaustion is a scar ledger). The in-battle texture belongs in F3's narrative, not in the resolvers.

**F7. Supply.**
THEIRS: distance-to-base → up to −15 initial morale, once (battle-screen.ts:897-901); explicitly no effect on strength.
OURS: logistics facet, logisticsBurden at seed, supply interdiction augment + full siege-as-starvation core, supply-gap quality multipliers, courier umbilical fog, granary sack conservation.
VERDICT: **OURS-BETTER**, wide margin.

**F8. What persists after battle.**
THEIRS: survivor counts, two notes, one marker; the world is otherwise untouched — a "battle" cannot take a burg (CONFIRMED :1252-1367 — no state/burg/diplomacy write exists).
OURS: conquest/occupation/razing/vengeance licenses, conserved sacks, disposition ratchets both sides, exhaustion scars kept even when the layer turns off (warDeployment.js:255), coalition/treaty aftermath.
VERDICT: **OURS-BETTER categorically**. Their marker+legend surface is already §727 candidate #7 (feed markers from real ledgers) — no new candidate here, but F3's narrative is the natural legend-writer for it.

**F9. Forces generation inputs.**
THEIRS: one-shot conscription with culture/religion/landmass possession dividers and a diplomacy-driven War Alert (military-generator.ts:205-236) — a genuinely elegant *static* militarization model.
OURS: living posture ramp gated by disposition/economy/deity/legitimacy + readiness quality (mobilization.js, martialReadiness).
VERDICT: **PEER-DIFFERENT / OURS-BETTER on dynamics** (as §628j said). Two adoptable nuggets: (a) their possession-divider idea — foreign-culture/faith populations yield less levy — could enter F2's *composition* weights (display only, S); (b) a surfaced **militarization index** (their Rate % — Military-Forces.md:10) as a dossier stat over our capacity model — PLAUSIBLE gap (display layers unread), S if real.

**F10. Determinism & RNG.**
THEIRS: ambient `Math.random`/`P()`/`rand()` in every roll; die-reroll UI; unreplayable.
OURS: every roll on a stable keyed fork, quoted in receipts (`pFall/roll` in outcome reasons), clamped upsets.
VERDICT: **OURS-BETTER** (constitutional). Their visible per-side die is charming UI but its honesty is fake (unseeded); our receipted roll is the honest version and F3 can *surface* it ("the storm hung on a knife's edge — 0.31 against 0.34").

**F11. Interactive battle control (add regiments mid-fight, manual phase override, apply-anytime).**
THEIRS: full user-in-loop control (battle-screen.ts:589-674, 1213-1236).
OURS: DM authority at initiation/resolution majors (M9d proposal path, warDeployment.js:893-901) — no mid-battle steering.
VERDICT: **PEER-DIFFERENT**; mid-battle steering would violate our determinism/PROMISE frame (a battle is engine physics, not a minigame). The DM-facing analog is already built (proposals); an interactive *replay* of F3's derived narrative is the safe form if the owner ever wants a "battle screen."

---

## PART 4 — RECOMMENDED PACKAGE + FLAG NOTES

One tranche, "**war legibility**": F2 (typed composition clerk, M) + F3 (engagement-narrative deriver + prose ladders, S-M) + F9b (militarization index stat, S), joining §727 candidates #4 (war names) and #7 (ledger-fed battlefield markers) — all display/derivation layers over existing engagement records, zero second combat engine, zero engine-golden risk. The ONLY flag/shift exposure: stamping F2's composition onto deployment records (record-shape byte shift → dormant flag, declared) — avoidable by deriving on read. Everything mechanical in FMG's battle layer is either already surpassed (F1, F5, F7, F8, F10) or constitutionally rejected (ambient RNG, annihilation, teleporting attackers, fabricated backstory notes — their regiment "formed in year X during campaign Y" gauss-mint at military-generator.ts:555-560 is exactly the painted-history idiom THE PROMISE forbids). MIT attribution needed only if the two prose ladders or any modifier table is copied verbatim (precedent `public/map/LICENSE-FMG.txt`).

**Open questions for the chair:** (1) whether the herald/dossier already surfaces any per-war force description (display layers unread — if yes, F2/F3 land as enrichment, not new surface); (2) whether the owner wants the F2 vocabulary authored per-culture (9 culture keys) or global; (3) whether an `ambush`-flavored narrative needs terrain reads the engagement record doesn't currently carry (if the record lacks a terrain stamp, F3 needs one small additive field → same dormant-flag note as F2).

---

# W3 — PATREON/BLOG

All source avenues are exhausted. Compiling the lane report.

---

# LANE W3 REPORT — PATREON + DEV-BLOG SWEEP (2026-08-29)

## Access honesty (read first)

- **Patreon**: creator page and about page readable; **tier details and 55 of 57 post bodies are login-walled or bot-blocked** (direct fetch 403, browser pane blocked by policy, anonymous API strips content). Two post bodies recovered in full via Wayback Machine JSON-LD (v1.99 routes 2024-08-15, v1.109 burg groups 2026-01-08). The 2020 Military/Battle posts are **not archived** — only search-snippet summaries exist for them (secondhand, marked below). Archived creator-page capture (2026-07-30) is an 11KB stub — no tier data.
- **Reddit**: unreachable (old.reddit and www.reddit both blocked for fetch; `site:reddit.com` searches returned nothing indexed). **No Azgaar reddit statements were obtained** — that slice of the lane goal is unfilled, honestly.
- **Recovered instead**: full GitHub release history (27 releases, v1.2→v1.149.1, via API), the **live Trello devboard** (full JSON export: 112 Suggestions, 43 Planned, Done-lists 2022–2026), upstream in-app announcement text (`fmg-upstream/src/services/versioning.ts:24-45`), and 5 PR descriptions. Blog (azgaar.wordpress.com) read: **dormant since 2018-07-05** — 10 posts, all 2017–2018 era; Patreon's own about page calls it the "old blog". No post-mortems or monetization commentary exist there.

## Findings

**W3-1. FMG's official roadmap points at OUR thesis — simulated history — and it is unstarted. NEW; the single most important find.**
- THEIRS: Trello board "Fantasy Map Generator" (live JSON, 2026-08-29), 📅 Planned list: *Economics simulation [generic card, to be split]* · *Economics: define trade system* · *Generate history* · *Simulate History* · *Leaders generation* · *Travel Builder* · *Climatic zones*. The v1.99 Patreon post (2024-08-15) states the routes-data rework exists to enable the "longtime planned economic simulation", a travel builder, population redistribution (settlements growing along major roads), and a map API via model/view separation — with an explicit caveat that there is no schedule and these are ideas he may work on.
- OURS: a shipped living tick kernel, wars, economy-in-motion, demographics (REVIEW §2 ours-better, entire block).
- VERDICT: **OURS-BETTER on substance** (their history simulation is a years-old planned card; ours runs), but a strategic datapoint: the most popular tool in the space has *publicly aspired* to become a simulator since at least 2024 and has not crossed the gap. Validates the product thesis; also a competitive watch item — his stated on-ramp is data-first refactors (routes → economy → ?).

**W3-2. The 2026 dev arc is an economy sprint. Substance ALREADY-COVERED; the velocity/emphasis is NEW.**
- THEIRS: v1.124 [Economy] 2026-06-17 (PR #1401 "Economics", by Azgaar — PR body empty, no rationale published); v1.140 2026-08-12 (Azgaar PRs #1488 market, #1492 goods, #1494 economy charts, #1495 economy regeneration, #1501 enhancements, #1506 goods distribution). In-app changelog self-labels: "Economic simulation", "Trade animation" (`versioning.ts:35-36`).
- OURS: flows/entrepots/supply chains/trade wars (REVIEW §2).
- VERDICT: **OURS-BETTER** confirmed by the §727 SF-SIM read (their goods layer is a static snapshot despite the "simulation" label); NEW signal is that economy is Azgaar's #1 current investment — three economy releases in two months — so their layer will deepen. No design rationale is published anywhere public (PR bodies empty, Patreon economy post either nonexistent or member-only — not found by search or archive).

**W3-3. "Navigable rivers" shipped as a headline user-facing feature (in-app changelog, v1.123-1.149 window, 2026). ALREADY-COVERED — direct corroboration of REVIEW candidate #3** (river magnitude + navigability banding): upstream now considers navigability important enough to advertise to end users. Strengthens that candidate's product-value ranking.

**W3-4. Battle-phase narrative record — a community-demand receipt for lived war history. NEW.**
- THEIRS: PR #1504 (merged 2026-06-25, contributor AlistairHeus, in v1.140): the description says it addresses a community request to keep a record of battle-phase progression in the battle's map-marker note, so users can "write a narrative about the engagement after it concludes" — implemented as a `phasesRecord` array appended to a legend string.
- OURS: wars emit typed reasons/receipts/engagements natively (V-genesis.md; REVIEW §2 causal-explainability block).
- VERDICT: **OURS-BETTER** (their history is a string in a note; ours is queryable canon) — but this is hard evidence FMG users *ask for* narrative war history, which is exactly what REVIEW candidate #4 (war names + herald prose) sells. Mark it as demand corroboration for #4.

**W3-5. Party marker with daily/weekly/monthly travel rings. NEW.**
- THEIRS: PR #1557 (community contributor msuyar, v1.140, 2026-08-12) — a GM-campaign companion feature: where the party is, how far it can travel per day/week/month.
- OURS: absent; nothing tracks a user's party (out of product scope — world-only).
- VERDICT: **PEER-DIFFERENT** (their use-case is tabletop-companion; ours is simulation), with one transferable nugget: travel-time rings are a legibility device our digest distances could power as a pure display-side deriver on the realm/town map ("a week's ride from X") — GAME-GRADE-UX-flavored, effort S, canon-untouched. Sketch only if the owner wants the legibility win.

**W3-6. AI features: AI-as-writer for notes + an AI support assistant. NEW; guard applies.**
- THEIRS: "AI generation for notes" (PR #1112) and "AI Assistant widget" (PR #1115, merged 2024-09-22), on-demand AI for markers (Trello Done 2024), OpenAI/Claude/Ollama backends incl. fully-local Ollama (wiki `Ollama-text-generation.md`); Trello Done 2025 records "Platform Search [replaced by AI Assistant]" — an AI bot answering user questions replaced their search feature.
- OURS: FINITE-SEMANTICS law — AI = clerk, never writer.
- VERDICT: **PEER-DIFFERENT, do not emulate the writer half** (freeform AI flavor-notes are the exact idiom our constitution forbids). Two neutral observations: (a) local-model support (Ollama) is their answer to cost/privacy; (b) the AI-assistant-as-support-surface is a product-ops idea, not an engine feature — if ever considered for us it is owner-gated (new capability).

**W3-7. Monetization: the adjacent free tool converts weakly — supporters fund the person, not features. NEW.**
- DATA (Patreon, read 2026-08-29): "creating free worldbuilding tools"; 1,550 members of which **130 paid**; entry $5/mo; 57 posts (bulk member-only; release announcements the main public genre); income not public; tier benefits unrecoverable (login-walled). The v1.109 post (2026-01-08) opens by admitting the update took "long periods o[f] inactivity" plus dozens of code issues; 2026 feature velocity leans heavily on outside contributors (barrulus, Avengium, AlistairHeus, msuyar, SheepFromHeaven, JoeMcMahon87 across v1.119–v1.149).
- VERDICT: signal for our paid-surface thesis — in this market the free map tool monetizes as patronage (~8% of members pay, no gated features), and its single-maintainer cadence stalls. A quality-first paid *simulator* is a differentiated position, consistent with the owner's TIME-IS-NOT-THE-CONSTRAINT doctrine. No recommendation beyond: do not model revenue expectations on "map tool + Patreon".

**W3-8. Third-party market validation: "Fantasy Map Simulator" (NOT Azgaar's). NEW.**
- FACTS: Steam app 3035500, developer "The Stranger" (forum handle "Zero"), early access 2024-09-04, >85% positive reviews; pitch: create and watch imaginary worlds evolve over centuries; its forum shows users asking to import Azgaar maps; it ships an "Eco-Editor" update and a public roadmap. Attribution verified: only connection to Azgaar is inspiration + user requests.
- VERDICT: **NOT-APPLICABLE as emulation, important as market evidence** — a watchable FMG-style world-sim found a paying Steam audience while still in early access. Corroborates demand for exactly our category; worth a future competitive read (out of this lane's scope).

**W3-9. Desktop/offline arc. NEW, minor.** Electron desktop app v1.149.0 (2026-08-27, unsigned builds, Mac/Win/Linux), answering a years-old request (issue #287); earlier arc: PWA, then "Disallow local usage without server" (v1.72x, 2022). Demand signal: users want to *own* their maps offline. NOT-APPLICABLE to us near-term; file under user-expectation context for a paid product (export/ownership expectations).

**W3-10. Community demand backlog (Trello Suggestions, 112 cards). NEW as a corpus.** Military/diplomacy cluster: Alliances · diplomacy presets (world peace/world war) · conscription per-country · unit subtypes (archer cavalry) · CoAs for military units · regiments organized per burg/province/state. Worldgen cluster: tectonic simulation · Köppen climate zones (suggested twice, differently spelled) · namebase rework "more endings per culture". VERDICT: corroborates REVIEW §2 (our diplomacy/war depth is what their users ask for and don't have), the heraldry smaller-steal (owner-gated), and candidate #1's namegen value. No new candidates emerge from the backlog that the §727 review hasn't already ranked.

**W3-11. Historical marker: battle sim was a 2020 one-shot, then untouched until 2026's contributor PRs.** v1.3 [Military] 2020-04-01, v1.4 [Into the Battle] 2020-06-21 ("6 types of battles" per search snippet of the unarchived Patreon post — secondhand); between then and v1.140's `phasesRecord`/military-module migration, releases show zero battle-mechanics evolution. ALREADY-COVERED mechanically (wiki Battle-Simulator.md, ANTHRO lane); the *stagnation* is NEW context: battle mechanics are not where they out-develop us — the record/narrative demand (W3-4) is.

## One-line synthesis for the chair

The wiki-invisible story: since 2024 Azgaar has been executing a deliberate data-model-first march toward a "longtime planned" economic-then-historical simulation (W3-1/2) that our engine already is; his users' loudest unmet asks are narrative war history, alliances/diplomacy depth, and watchable evolution (W3-4/8/10) — all REVIEW §2 ours-better ground — while the monetization ceiling of the free-tool-plus-Patreon model (W3-7) is the clearest external argument yet for the owner's quality-first paid-simulator position. No new emulation candidates; three §727 candidates gain corroboration (#3 navigable rivers, #4 war narrative, #1 namegen), plus one optional S-effort legibility nugget (travel-time rings, W3-5).

Sources: [GitHub releases](https://github.com/Azgaar/Fantasy-Map-Generator/releases) (API, 27 releases) · [Trello devboard](https://trello.com/b/7x832DG4/fantasy-map-generator) (JSON export) · [Patreon creator/about](https://www.patreon.com/azgaar) · Wayback captures of [v1.99 routes post](https://www.patreon.com/posts/update-routes-v1-110144946) (2026-02-28 capture) and [v1.109 post](https://www.patreon.com/posts/update-custom-v1-147732577) (2026-03-11 capture) · [azgaar.wordpress.com](https://azgaar.wordpress.com) · upstream `src/services/versioning.ts` (local clone) · PRs #1401/#1504/#1115/#1494/#1495/#1557 (API) · [Fantasy Map Simulator on Steam](https://store.steampowered.com/app/3035500/Fantasy_Map_Simulator/) + [Wikipedia](https://en.wikipedia.org/wiki/Fantasy_Map_Simulator) + [Steam discussion](https://steamcommunity.com/app/3035500/discussions/0/4697909557444273436) · [geeknative battle-sim coverage](https://www.geeknative.com/74127/free-fantasy-world-map-generator-adds-battle-simulator/) (2020-06-24).

---

# W4 — UX OVERVIEWS

All reading complete. Final report follows.

---

# LANE W4 — EDITORS, OVERVIEWS, AND LEGIBILITY AFFORDANCES: upstream FMG UI vs SettlementForge surfaces

**Coverage denominator.** Upstream (restructured TS clone): read IN FULL `src/controllers/military-overview.ts` (691 L), `src/components/dialog/table.ts` (371 L), `sorting.ts` (138 L), `highlighting.ts` (57 L), `cell-info.ts` (205 L); read substantially `charts-overview.ts` (~560/1013 L), `diplomacy-editor.ts` (~250/638 + targeted greps), `regiments-overview.ts` (:1-80), `burgs-overview.ts` (grep sweep of filters/footer/toolbar), `states-editor.ts` (toolbar/tooltip grep + bubble-chart :1065-1130), `hierarchy-tree.ts` (:1-120), `elevation-profile.ts` (:1-40); zoom-affordance grep across all controllers. Wiki: User-Interface.md, Hotkeys.md in full. NOT read: provinces/religions/cultures/labels/zones editors' bodies, battle-screen.ts (other lane's territory), markets/production overviews' bodies. Ours (73f5dfc02 extract): read `tableLedger/TableLedgerPanel.jsx` (336 L, full), heads + targeted greps of `map/RealmInspector.jsx`, `RealmDashboard.jsx`, `QuickInspector.jsx`, `HeraldGazetteer.jsx`, `heraldRegister.js`, `heraldFilter.js`, `LiveWarStatus.jsx`, `MapLegend.jsx`, `RealmDocket.jsx`, `WorldPulsePanel.jsx`, `LayersPanel.jsx`, `useRealmEntityNav.js`, `TableView.jsx`, `library/LibraryToolbar.jsx`, `CommandPalette.jsx`; component-tree greps for csv/chart/hover/zoom. NOT read: HeraldBody bodies, dossier tab bodies, WorldMap stage internals. Dedupe: the §727 review's §5 states controllers/renderers were unread by all prior lanes (CONFIRMED at REVIEW_FMG_RECONCILIATION.md:148); nothing below duplicates its 12 candidates.

**The structural fact bounding everything:** every FMG overview is built on ONE shared kit — typed columns (`EditorColumn`: key/label/width/tip/sortBy/sortType/defaultSort/permanent/mobileHidden, `table.ts:91-104`), click-to-sort persisted per dialog (`sorting.ts:118-138` via `dialogState`), a column-visibility picker persisted per dialog (`table.ts:159-181, 244-348`), pagination (100/page, 20 mobile, `table.ts:4-8`), and an aggregate footer. Ten-plus overviews reuse it. All of it is display-plane: it reads `pack`, writes nothing (except the explicitly-mutating buttons, flagged below). That makes almost every steal here **zero-engine-state by construction**.

---

## F1. The realm-wide sortable overview table — the missing third rung of our own law

**THEIRS (CONFIRMED):** Military Overview = one row per state with per-unit-type columns, Total, Population, Rate %, War Alert; any column sorts, columns hide/show, footer totals (`military-overview.ts:140-186, 61-77`). Burgs Overview adds persistent filters (search + state + culture dropdowns, saved in dialogState and re-applied on reopen, `burgs-overview.ts:22-27, 120-129`) and a "Burgs: X of Y" denominator (:160-162).
**OURS (CONFIRMED):** no realm-wide sortable table exists. The Gazetteer is deliberately alphabetical sentence-rows — "The register never prints a raw population, tick, severity or score" (`heraldRegister.js` header) — and the Library sorts whole cards by one of four keys (`library/LibraryToolbar.jsx:33-51`). Standings (war exhaustion, mobilization, disposition) render as prose card lists (`RealmDashboard.jsx`, `LiveWarStatus.jsx`). Per-settlement tables exist in the dossier; nothing compares settlements or powers side by side on any sortable axis.
**VERDICT: THEY-BETTER (comprehensiveness of the *table* rung).** Our legibility law is glance → sentence → **table** — the third rung is literally named in the law and is the one register the product never built realm-wide. FMG proves the affordance set that makes such a table earn its place: sort, filter-with-denominator, aggregate footer, drill-in per row.
**Reconciliation (display-only):** a "Census" table view inside the Herald's Gazetteer door (a toggle: register ⇄ table), columns drawn ONLY from derivations that already ship — tier word, prosperity word, war status, threat, turnings-since-founding — sortable per column, with the DM-instrument tier (per §69.3) allowed numeric columns (population, forces) that player/public surfaces band. Pure projection over `gazetteerRows` + standings selectors; zero engine state; secrets seam applies as heraldRegister already does. Effort **S-M**.

## F2. Aggregate footers and filtered denominators

**THEIRS (CONFIRMED):** every overview carries a totalLine recomputed over the *filtered* set — states count, total forces, average forces/rate/alert (`military-overview.ts:297-308`), avg population/product/wealth/treasury with "0 of 0" burgs displayed (`burgs-overview.ts:159-175`).
**OURS:** stat tiles on RealmDashboard, but no filtered-denominator aggregate line on register/library surfaces (PLAUSIBLE — heads read, no footer idiom found).
**VERDICT: THEY-BETTER (small).** Reconciliation: one sentence-footer under Gazetteer/Library honoring the filter — "Twelve places stand; three strained; two at war." Effort **S**, pure display.

## F3. Bidirectional map ↔ row linkage

**THEIRS (CONFIRMED):** both directions, generically. Map→table: `applyLineHighlighting` resolves the hovered map cell to a row id and highlights that row, wired per dialog with one lambda (`highlighting.ts:6-38`; `military-overview.ts:102` maps cellId→state). Table→map: row mouseenter draws the state's border as an animated stroke-dasharray trace and tints its armies red; mouseleave fades it (`military-overview.ts:310-348`).
**OURS (CONFIRMED):** one direction, one entity class: hovering a map marker or palette card opens the QuickInspector peek (`QuickInspector.jsx:1-31`; palette wiring `SettlementPalette.jsx:220-221, 327-329`). Nothing highlights a map marker when hovering a Herald row, standings entry, or AffectedSettlements chip — grep across `src/components` + `store`: only `QuickInspector.jsx` and `mapSlice.js` reference `hoveredSettlementId`.
**VERDICT: THEY-BETTER (cohesion — the map and the words about the map acknowledge each other).**
**Reconciliation:** Herald rows and `AffectedSettlements`/`RealmEntityLink` chips write the existing `hoveredSettlementId` on hover; `PlacementsLayer` reads it to glow the marker (style single-sourced with the legend per our MapLegend idiom). The reverse direction already half-exists via QuickInspector. Zero new state — the store field is already there. Effort **S**.

## F4. Zoom-to-entity from any list

**THEIRS (CONFIRMED):** `zoomTo(x, y, 8, 2000)` rides every named thing — burgs-overview rows (`burgs-overview.ts:407, 425-428`), labels overview, markers, goods editor rows, bubble-chart circles, elevation-profile burg markers (grep: 12 sites). The states editor even zooms to a capital from its name cell ("Click to zoom into view", `states-editor.ts:386`).
**OURS (CONFIRMED):** `RealmEntityLink` navigates to the *dossier* (`useRealmEntityNav.js:41-49` — focusEntity + setSelectedSettlementId + route), which is our NEWS ADDRESS LAW strength — but no surface pans/zooms the map to a place: grep `zoomTo|panTo|centerOn|flyTo` over `components/map`: zero hits.
**VERDICT: THEY-BETTER (the spatial half of the address).** Reconciliation: a "show on map" secondary affordance on entity links (map view selected + viewport centered on the placement). Display-only; the viewport is UI state. Effort **S**.

## F5. The Data Charts builder — cross-dimensional comparison

**THEIRS (CONFIRMED):** a chart composer: entity (states/cultures/religions/provinces/biomes/markets/goods) × ~20 metrics (population, area, elevation, temperature, precipitation, production value/volume, burg profit — `charts-overview.ts:85-348`) × *group-by a second entity* (states stacked by culture) × sort × stacked/normalized bars; multiple charts kept side-by-side in 1-4 columns; per-chart CSV/SVG/PNG download and remove (:826-888); per-bar tooltips; exclude-neutral toggle.
**OURS (CONFIRMED):** zero comparison charts on any product surface — grep "chart" over `src/components`: hits only in admin panels (AdminTrendsPanel, AdminSimTuningPanel), pricing/marketing, and townMap internals.
**VERDICT: THEY-BETTER (comprehensiveness) — with a doctrine boundary.** The free-form builder is their forty-sliders idiom; our front-door doctrine (three knobs, §727 review §2) argues for an **authored closed set** of comparisons instead: settlements by tier, powers by forces (from the same mobilization/exhaustion selectors LiveWarStatus reads), faith seats by deity, prosperity across the realm — each a one-line question with one honest picture, banded on player surfaces, numeric on the DM tier. Their group-by device (one entity stacked by another) is the genuinely elegant steal — "population by realm, colored by faith" is a real DM question. Also foldable here: their states bubble chart (circle-pack sized by a selectable metric, hover info, click-zooms — `states-editor.ts:1065-1130`) as one authored view. Reconciliation: a lazy Herald "Census" door over existing read models; no engine state. Effort **M**.

## F6. CSV export of overview data

**THEIRS (CONFIRMED):** every overview downloads its exact visible table as CSV (`military-overview.ts:679-689`; burgs, regiments, diplomacy matrix `diplomacy-editor.ts:154`); charts export their data too.
**OURS (CONFIRMED):** grep `csv|CSV` over `src/components`: zero hits. Our export is the PDF — a narrative artifact, not data.
**VERDICT: THEY-BETTER (DM-tier utility).** DMs live in spreadsheets and VTT prep docs. Reconciliation: a pure serializer over `gazetteerRows`/standings **after** viewerSecrets redaction (export only what the session may see). ⚠ flag: export sits near the paid surface (ExportUnlockDialog exists) — whether CSV is free or entitled is **owner-gated** (paid-surface behavior). Effort **S** technically.

## F7. Perspective-anchored diplomacy view (and the matrix that must NOT come with it)

**THEIRS (CONFIRMED):** the diplomacy editor is perspective-first — pick a state, read every other state's relation *to it*, each colored and phrased in plain language ("is suspicious of", `diplomacy-editor.ts:27-65, 209-231`), with per-term tooltips explaining what Vassal/Suzerain/Rival *mean*; plus a full N×N matrix view (:552+) and a relations chronicle.
**OURS:** relationship edges on the map (single-sourced styles) and disposition standings in prose; no "where does Keth stand with everyone" single view (CONFIRMED absent as a surface; the reads exist in `domain/display/warStatus.js`).
**VERDICT: split.** The **perspective-anchored list is THEY-BETTER** — and it fits our belief layer *better than it fits FMG*: our diplomacy is already per-actor belief, so "the world as Keth believes it" is the honest rendering, where FMG's own matrix is omniscient. The **N×N matrix is NOT-APPLICABLE** on player surfaces (belief layer — no omniscient actors); at most a DM instrument, low priority. Their editable chronicle and relation-mutation cells: guard list (canon mutation). Reconciliation: a Herald Standings view — pick a power, sentence rows from the belief-scoped reads, colored by disposition band, each name a RealmEntityLink. Display-only. Effort **S-M**.

## F8. Contextual layer activation when a report opens

**THEIRS (CONFIRMED):** opening Military Overview force-shows states/borders/military layers (`military-overview.ts:40`); Diplomacy shows states/borders and *hides* provinces/cultures/biomes/religions (`diplomacy-editor.ts:112-116`) — the map is made to agree with the subject being read.
**OURS:** opening the Herald's War door leaves overlays untouched (PLAUSIBLE — no overlay writes found in RealmInspector chrome or HeraldBody heads).
**VERDICT: THEY-BETTER (small cohesion win).** Reconciliation: door→overlay affinity (War→war/faith overlay, Faith→faith, Trade→supply chains), applied reversibly with a "restore my layers" memory, or as a one-tap suggestion chip rather than a forced switch. UI state only. Effort **S**.

## F9. Self-describing controls + hotkey surface

**THEIRS (CONFIRMED):** `data-tip` on nearly every cell/header/button feeding one fixed bottom label that states what the thing is, what you can do, and the shortcut (User-Interface.md:71-80); sort headers auto-tip "Click to sort by X" (`table.ts:130`); ~40 single-key layer toggles + Shift-key editors (Hotkeys.md).
**OURS (CONFIRMED):** cmd/ctrl-K CommandPalette jumping to any page/settlement/figure (`CommandPalette.jsx:1-14`), guided tour, guidance whispers. **PEER-DIFFERENT** — palette-first scales better than memorized chords and is the modern idiom; no adoption of the hotkey table. One cheap steal: expose LayersPanel overlay toggles as palette commands, and show a control's shortcut in its tooltip where one exists. Effort **S**.

## F10. Cell Details inspector vs QuickInspector

**THEIRS (CONFIRMED):** a live cursor-following panel of ~20 raw facts per cell (`cell-info.ts:42-65`). **OURS-BETTER for the product register:** QuickInspector's three curated lines (name+tier, pressure sentence, top hook) *is* glance→sentence; a 20-field data dump would violate the legibility law on a player surface. No action (a DM "deep facts" peek is at most a someday item).

## F11. Locks, recalculate-in-place, editable table cells — the guard boundary (explicit)

Their per-burg locks + lock-all (`burgs-overview.ts:192`), regenerate/randomize/recalculate buttons (`states-editor.ts:184-202`, `military-overview.ts:659-677`), and the editable War Alert cell that rescales every regiment from the overview row (`military-overview.ts:281-295`) are all **lock-and-reroll / one-shot mutation idioms — NOT-APPLICABLE per the §727.3 guard list**. Ours-better counterpart already exists and is the correct shape: typed, validated directives through the pendingEdits queue with commit/discard and veto-honesty (`TableLedgerPanel.jsx` — "an offered target the engine would veto is a lie the picker told"). No overview surface we build should mutate canon directly from a cell.

## F12. Things ours does that they have no answer to (recorded so synthesis doesn't regress them)

Sentence-first register rows with banding enforced by test (`heraldRegister.js`, prose-leak allowances); entity links as "a way IN, not a dead list" with causal drill-in (WarCausalBrief/CausalityPopup — FMG names link nowhere causal because nothing has a cause); the needs-attention triage lens + severity facets + focus/search composition (`heraldFilter.js:28-45`); the time lens (this advance / whole campaign — FMG has no time); single-sourced legend colors ("the legend can never claim a color the map does not render", `MapLegend.jsx:24-31`) vs their hand-kept legend; the secrets seam (fields never *built* for unproven sessions); the Docket's LAPSED marking (staged future with honesty about preconditions).

---

**Priority if the owner takes any of it:** F1 (the census table — our own law's third rung) → F3+F4 together (map↔row linkage + show-on-map: the cohesion pair, both S) → F5 (authored comparison charts, the biggest single legibility add) → F7 (perspective standings — belief-layer-native) → F2/F8/F9 (cheap texture) → F6 (CSV — owner-gated on entitlement). Every item is display-plane over existing read models: **no engine state, no canon writes, no same-seed risk anywhere in this lane.**

Report file paths (read-only materials): upstream controllers at `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/5a850cca-94f6-4828-bc6e-0936d5f66782/scratchpad/fmg-study/fmg-upstream/src/controllers/`, shared kit at `.../src/components/dialog/`; our surfaces at `.../fmg-study/ours/src/components/` (map/, tableLedger/, library/).

---

# TIE-BACK T1 — BATTLE CLUSTER

TIE-BACK REPORT — LANE T1 (battle cluster). All quotes verified by direct read of upstream clone + ours extract; greps re-run.

**UPSTREAM CITATIONS**

1. **6 battle types, battle-screen.ts:455-466** — TIES-BACK. `getType` at exactly 455-466: `naval` (both naval), `air` (all aviation), `landing` (naval attacker w/ non-naval units), `siege` (`pack.burgs[...].walls || ...citadel`), `ambush` (`P(0.1) && [5,6,7,8,9,12].includes(pack.cells.biome[b.cell])`), `field` default. Nuance: naval/air are composition-conditioned, not geography — immaterial.
2. **Phase state machines, :934-1086** — TIES-BACK. `selectPhase` spans exactly 934-1086; six per-type machines. Field: skirmish/melee/retreat/pursue (:940-962); siege: blockade/bombardment/sortie/storming/looting + sheltering/defense/surrendering (:982-1008). Driven by morale (`P(1 - morale/25)`), iteration, ranged share, power ratio, machinery counts — as pub-battle states.
3. **Two prose ladders, :1238-1270** — TIES-BACK. `getRegimentStatus` :1238-1250 ("was annihilated" → "emerged unscathed", 11 rungs); `getBattleStatus` :1260-1270 ("attackers flawless victory"/"disorderly retreat of defenders" → 7 bands). Both inside the cited range.
4. **"Engagement progression" record, :1356-1359** — TIES-BACK verbatim: `legend += '<br><br>Engagement progression:<br>' + phasesText` at exactly 1356-1359; record accumulated at :1100-1103.
5. **count × power × phase-table on ambient Math.random** — TIES-BACK. `calculateStrength` :890: `power = sum(options.military.map(u => (forces[u.name] || 0) * u.power * scheme[phase][u.type])) / adjuster`. Casualties :1136-1137: raw `Math.random() * Math.max(phaseCasualtyRate[...])`; per-unit noise :1165 `0.8 + Math.random() * 0.4`; die `rand(1,6)` :928. `rand`/`P`/`Pint` are `Math.random` (probabilityUtils.ts:10-27). battle-screen.ts contains zero `Math.random =`/`Alea` reseeds (generators reseed; the battle never does) — "unseeded" is fair (stream position is interaction-order-dependent, unreplayable).
6. **"Attacker teleported / consequence-free", cited :1252-1367** — MISQUOTED (location) + one-clause overstatement; **claim substantively true**. (a) The outbound teleport is NOT in the cited range — it is regiment-editor.ts:~416-417: `moveRegiment(attacker, defender.x, defender.y - 8)` (instant, any distance); the cited range holds only the return leg :1304 `moveRegiment(r, r.px!, r.py!) // move regiment back to initial position`. (b) "results touching only notes and a marker" is slightly overstated: `applyResults` also permanently writes survivors onto the regiments (`r.u = { ...r.survivors }; r.a = sum(...)` :1300-1301) — regiments can be lastingly depleted/annihilated. (c) The load-bearing half is CONFIRMED: full read of `applyResults` :1252-1367 shows writes ONLY to note legends, `pack.markers` + `Layers.draw("markers")`, notes, regiment unit counts/positions — **no write to `pack.burgs`, diplomacy, or population anywhere**; "cannot take a burg, shift diplomacy, or scar a population" ties back. Also confirms manual/user-in-loop: `changeType` :1213, `changePhase` :1226 hand-override mid-battle; `cancelResults` :1369 discards everything.
7. **military-generator.ts:20** — TIES-BACK verbatim: `u: Record<string, number>; // units composition` at line 20.
8. **:72-203** — TIES-BACK: `stateModifier` :72-137 (Nomadic/Highland/Lake/Naval/Hunting/River per unit type), `cellTypeModifier` :139-170, `burgTypeModifier` :172-203; plus settlement-character inputs just outside the range (Horde ×2 mounted :232, Republic ×1.2 naval :233, culture/religion dominance divisors :266-268/:325-327, capital ×1.2 :324, port/haven gating :277/:334) — strengthens, not weakens, "typed composition from settlement character".
9. **:419-423** — TIES-BACK exactly: `const u = {}; u[r.u] = r.a; (r.children ?? []).forEach(n => { u[n.u] = (u[n.u] ?? 0) + n.a; })` — the typed-unit bag per regiment.
10. **Backstory gauss-mint, :555-560** — TIES-BACK exactly: `:555 const campaign = s.campaigns ? ra(s.campaigns) : null;` `:556-558 year = campaign ? rand(campaign.start, ...) : gauss(options.year - 100, 150, 1, options.year - 6);` `:559 conflict = ' during the ${campaign.name}';` `:560 "Regiment was formed in ${year}..."`.
11. **Ambush 10%-vs-20% stale comment** — TIES-BACK on all three legs: code `P(0.1)` (:464), same line's comment `// 20% if defenders are in forest or marshes`, wiki Battle-Simulator.md:17 and :81 both say **10%** (wiki matches code; the stale text is the code comment — exactly as the synthesis words it).

**OUR SOURCE**

12. **warSiegeVerdict.js:299-304** — TIES-BACK exactly: the 4-value band at exactly those lines: `narrow_success` / `costly_success` (falls, margin 0.18) / `narrow_fail` / `decisive_fail`. Roll is keyed: `rng.fork('siege:...:tick')` :291 — corroborates the determinism/receipted-roll axis.
13. **warDeployment.js:813-816** — TIES-BACK exactly: the `reasons` receipts at 813-816: `"Coalition current capacity X vs defender Y (feasibility: ..., ratio ...)"` and `"Fall chance ${pFall.toFixed(2)}, roll ${roll.toFixed(2)}."` — the honest receipted roll ADD-1 proposes to narrate.
14. **"No unit-type concept (grep-zero outside a materiel regex)"** — TIES-BACK with one amendment. Re-ran grep (`infantry|cavalry|archer|pikemen|spearmen|knight|artillery|regiment|battalion|platoon|unit[ _-]?type`) — denominator: 46 war/military modules under `domain/worldPulse/`, 2,185 files in src overall. Inside the war stack the ONLY hit is `militaryStrength.js:85 MATERIEL_PATTERN` (a goods-name regex), as claimed — **plus one sibling the claim omits: `tradeSalience.js:60 MATERIEL_GOOD_PATTERN`** (same idiom, adjacent module). Broad-src hits are all NPC roles/faction names/trade goods/flavor prose — no `{type: count}` force structure anywhere. Six-facet claim also ties back: manpower/institutions/materiel/logistics/economy/will (militaryStrength.js typedef :58-63, `FACET_WEIGHTS` :74-81).
15. **Terrain stamp (ADD-1 caveat)** — **NO.** The deployment record mint (`seedDeploymentState`, warArmyRecord.js:104-137) fields: `targetId, sinceTick, role, maxStartStrength, currentEffectiveStrength, accumulatedAttrition, [readiness], [sizingBias], [deployedQuality], reinforcementFlow, deploymentAge, manpower, supplyIntegrity, morale, equipmentCondition, magicSupport, commandQuality, foodReserve, logisticsBurden, objective, returnCondition` — no terrain. Siege verdict return (:305-317) likewise none. BUT: siege-side terrain is already live-readable at render time — `resolveSettlementTerrain(defenderItem)` is a pure read (attrition.js:133-134 uses it for the 0.18 terrain bonus), and field battles carry `battle.region` (armyTransitKernel.js:596). So the caveat's additive field is only strictly needed if region→terrain-class isn't derivable from the frozen digest — consistent with the synthesis's own "Q-W4 `region` grant family" framing, but narrowable.

**PER-CANDIDATE VERDICTS**

- **ADD-1 — SURVIVES** (all citations tie back; caveat confirmed real but narrowable: sieges can read `resolveSettlementTerrain` live, only transit/field engagements may need the additive field).
- **ADD-2 — SURVIVES** (amend the absence row to name both materiel regexes: militaryStrength.js:85 and tradeSalience.js:60).
- **Guard additions (a),(b),(e) — SURVIVE** ((a) lines exact; (b) all three legs sourced — annihilation `losses===1` :1239 with casualties floored only at survivors=0 :1166, ambient RNG :1137/:1165, teleport regiment-editor.ts:~417; (e) mid-battle steering = `changeType`/`changePhase` :1213-1236).
- **§2 battle verdict — SURVIVES, one AMEND**: replace "results touching only notes and a marker" with "results touching only notes, a marker, and the regiments' own troop counts — never a burg, diplomacy, or a population"; and note the teleport site is regiment-editor.ts (the cited 1252-1367 holds the return-teleport). "Categorically superior on every mechanical axis" is unaffected — the one extra consequence (regiment depletion) is itself the annihilation idiom the guard list bans.
- **Not checked by this lane** (outside battle-cluster source scope): PR #1504 demand receipt (W3), six-years-stagnation (W3-11).

Key paths: upstream `.../fmg-study/fmg-upstream/src/controllers/battle-screen.ts`, `src/controllers/regiment-editor.ts`, `src/generators/military-generator.ts`, `src/utils/probabilityUtils.ts`; ours `.../fmg-study/ours/src/domain/worldPulse/{warSiegeVerdict.js,warDeployment.js,warArmyRecord.js,militaryStrength.js,attrition.js,armyTransitKernel.js,tradeSalience.js}`; wiki `.../fmg-study/fmg-wiki/Battle-Simulator.md`.

---

# TIE-BACK T2 — UX/CULTURES

LANE T2 REPORT — TIE-BACK VERIFICATION, UX/desk cluster (ADD-3..8) + culture sets (ADD-9). All paths relative to `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/5a850cca-94f6-4828-bc6e-0936d5f66782/scratchpad/fmg-study/` (upstream = `fmg-upstream/src`, ours = `ours/src`).

**ADD-3 (shared overview kit / census table) — VERDICT: SURVIVES. All six mechanism claims TIE-BACK.**
- Typed sortable columns, `table.ts:91-104`: exact — `export type EditorColumn<T = any> = { key; label?; width?; tip?; sortBy?: (item: T) => string | number; sortType?: "alpha" | "number"; defaultSort?: "asc" | "desc"; permanent?; hidden?; mobileHidden?; align?; marginLeft? }`. TIES-BACK.
- `military-overview.ts:140-186`: exact — `getMilitaryColumns()` returns per-unit columns + State/Total/Population/Rate/"War Alert"/actions. TIES-BACK.
- Persisted filters: `components/dialog/state.ts:8-40` — `DialogStateKey = "filters" | "sorting" | "columns"` persisted to localStorage `"fmg-dialog-state"`; consumed e.g. `burgs-overview.ts:122` `filterState = dialogState.get(dialogId, "filters", () => ({search:"", stateId:-1, cultureId:-1}))`, also rivers/markers/provinces/religions. TIES-BACK.
- X-of-Y denominators: `burgs-overview.ts:161` footer `Burgs:&nbsp;<span id="burgsFooterBurgs">0 of 0</span>`, filled at `:394` `` `${view.all.length} of ${validCount}` ``; `rivers-overview.ts:218` `` `${view.all.length} of ${pack.rivers.length}` ``. TIES-BACK.
- Column picker: `table.ts:150` ("Show or hide columns" button), `bindColumnsPicker` `:244-349`, persisted via load/saveHiddenColumns `:159-181`. Footer aggregates: `military-overview.ts:297-308` `updateFooter` (states count, forces total, avg forces/rate/alert) recomputed over `view.all` (the filtered set); burgs avg population/product/wealth/treasury `:162-176`. TIES-BACK.
- "Reused across 10+ overviews": counted — 20 consumer controllers import `initEditorTable`/`renderEditorHeader`/`initColumnVisibility` (21 grep-l files minus `table.test.ts`): biomes, burgs, compare-prices, cultures, diplomacy, goods, labels, markers, market-deals, market, markets, military, provinces, regiments, religions, rivers, routes, states, trade-details, zones. TIES-BACK (understated; actual 20).
- OURS half: `ours/src/components/map/heraldRegister.js:32` "register never prints a raw population, tick, severity or score" verbatim; `LiveWarStatus.jsx` exists. TIES-BACK.

**ADD-4 (map↔word linkage / zoomTo) — VERDICT: SURVIVES, AMEND the count.**
- OURS: `grep -ri "zoomTo|panTo" src/` → zero hits (exit 1). `mapSlice.js:237` `hoveredSettlementId: null`, `:296` `setHoveredSettlementId` — "the store field exists" TIES-BACK. Footnote: `ours/public/map/main.js:504` (legacy unwired FMG bundle) defines its own `zoomTo` — outside "our map components" per the three-surfaces law, but say the surface when quoting the zero.
- THEIRS "~12 sites": MISQUOTED-mild — actual **18 invocation sites across 14 files** (excluding the definition `components/zoom.ts:124`, `window.zoomTo` assignment `:159`, and the global decl): highlight.ts:44, trade-details:112, markers-overview:328, market-deals-overview:131, minimap:97, goods-editor:298+411, states-editor:926, provinces-editor:411, labels-overview:305, burgs-overview:428+563, measurers-editor:104, burg-editor:705, markers-in-radius:132/139/204, elevation-profile:383. `panTo` does not exist upstream — zoomTo only. Undercount strengthens the candidate; amend "~12" → "18 sites".

**ADD-5 (authored comparison charts) — VERDICT: SURVIVES, AMEND bubble-pack provenance.**
- Group-by device TIES-BACK: `charts-overview.ts:55-57` `ChartOptions {entity, plotBy, groupBy}`; UI `:409-411` `<span>grouped by</span>` select ("If you don't need grouping, set it the same as the entity"); non-stackable guard `:572-574`; `renderChart` `:583+`. `entitiesMap` `:85` = 7 entities; `quantizationMap` `:138` ≈ 20 metrics — matches W4-F5.
- MISQUOTED (provenance only): the bubble-pack is **not** in the chart builder — its types are only `stackedBar`/`normalizedStackedBar` (`:430-432`). The bubble charts are separate: "Burgs bubble chart" `burgs-overview.ts:484-563` (d3 `packLayout()` `:531`, own group-by select state/culture/province `:534-539`, click-zoom `:563`) and "States bubble chart" `states-editor.ts:1065+` (dialog title `:1199`). W4-F5 had this right ("Also foldable here"); the synthesis compressed it wrongly. Both mechanisms exist upstream; candidate survives with the provenance line corrected.

**ADD-6 (perspective-anchored standings) — VERDICT: SURVIVES.**
- Perspective-first view TIES-BACK: `diplomacy-editor.ts:209-231` — selected state atop, rows tipped "List below shows relations to ${selectedName}", each phrased via `relations[relation].inText`; vocabulary `:27-65` with plain-language `inText` + explanatory tips — "is suspicious of" verbatim at `:46`, Vassal/Suzerain tips present.
- The refused half also TIES-BACK as described: omniscient N×N matrix `showRelationsMatrix` `:551-576` reading `state.diplomacy` directly. Ours anchor `ours/src/domain/display/warStatus.js` exists.

**ADD-7 (travel-time rings) — VERDICT: SURVIVES; upstream half upgraded from wiki-sourced to source-CONFIRMED.**
- Party marker: `markers-generator.ts:482` `type: "party"`, `:123` legend "Current location of the adventuring party."
- Raw-distance circle: `markers-in-radius.ts:85-91` — `radiusPx = distance / distanceScale; drawMarkerRadius(center.x, center.y, radiusPx)`, membership by `Math.hypot(...) <= radiusPx` — pure Euclidean, no travel-time anywhere in the file. Ours substrate `hopWeeks` present (`ours/src/lib/spatialUsage.js:158`, `domain/worldPulse/candidateEvents.js:504`). TIES-BACK.

**ADD-8 (legibility texture batch) — VERDICT: SURVIVES.**
- Filtered-denominator footers (W4-F2): confirmed above (their footers are label+number lines; the *sentence* form is correctly framed as our reconciliation, not their mechanism). TIES-BACK.
- Door→overlay affinity (W4-F8): `military-overview.ts:39` `Layers.show("states", "borders", "military")` on open (W4 cited :40 — off by one, immaterial); `diplomacy-editor.ts:112-115` `Layers.show("states","borders"); Layers.hide("provinces","cultures"); Layers.hide("biomes","religions")`. TIES-BACK.
- Self-describing controls (W4-F9): `table.ts:130` auto-tip `` `Click to sort by ${column.label}` `` verbatim; `components/hotkeys.ts` (158 L) holds the dozens of single-key bindings. TIES-BACK.
- Deep-link half (W1-10): upstream URL-param machinery exists (`layers-presets.ts:70` `applyURLLayers(params: URLSearchParams)`, `coordinates.ts:62` options param); ours has zero `searchParams` hits in components — the `?focus` absence claim holds. TIES-BACK.

**ADD-9 (culture sub-roster / culture sets) — VERDICT: SURVIVES.**
- `generators/cultures-generator.ts` — set-keyed rosters on `culturesSet.value`: "european" `:62`, "oriental" `:172`, "english" `:268`, "antique" `:284`, "highFantasy" `:401`, "darkFantasy" `:527`, "random" `:774`; entries shaped `{name, base, odd, sort, shield}` (e.g. `:64-70` Shwazen). Per-entry inclusion odds CONSUMED at `:1091` `` while (i < 200 && !P(culture.odd as number)) `` with all-odds-1 fast path `:1083`; set-size cap from the select's `data-max` `:1023`. Exactly "a pool with per-entry inclusion odds". TIES-BACK.

**Guard-list (d), editable War Alert cell rescaling regiments — TIES-BACK at the cited lines.** `military-overview.ts:261` editable input ("War Alert. Editable modifier to military forces number"); `changeAlert` `:281-295` mutates canon directly: `s.alert = alert;` then per regiment `r.u[u] = rn(r.u[u] * dif); r.a = sum(Object.values(r.u))` plus live SVG text update. The guard row's characterization is exact.

**W4-F10 (cell-info dump, ours-better row) — TIES-BACK, amend count.** `controllers/cell-info.ts:42-65` template = **24 fields** (Cell/X/Y, Lat, Lon, Geozone, Area, Type, Precipitation, River, Population, Elevation, Depth, Temperature, Biome, State, Province, Culture, Religion, Burg, Good, Market, Cell Production, Burg Production); header comment `:1` "everything known about the cell under the cursor". "~20-field" is a fair approximation; actual 24 — strengthens the ours-better contrast.

**Net:** ADD-3 SURVIVES · ADD-4 SURVIVES (amend "~12" → 18 sites, note the legacy public/map bundle when quoting our zero) · ADD-5 SURVIVES (amend: bubble-pack lives in burgs-overview/states-editor, not the chart builder) · ADD-6 SURVIVES · ADD-7 SURVIVES (upgraded to source-confirmed) · ADD-8 SURVIVES · ADD-9 SURVIVES · guard (d) and W4-F10 TIE-BACK (F10 count 24, not ~20). No claim in this cluster is UNVERIFIED; no candidate killed. All verification read-only; nothing executed.

---

# TIE-BACK T3 — OUR-SIDE CLAIMS

All seven claims verified by reading the actual bodies in `.../fmg-study/ours`. Per-claim receipts and candidate verdicts:

**(1) Per-war force description/composition on herald/dossier/war surfaces — PARTIALLY PRESENT (description), CONFIRMED-ABSENT (composition) → ADD-2 SURVIVES with AMEND; resolves the W2 open question as "enrichment, not new surface."**
- Composition: grep for `cavalry|infantry|archers|siege engine|pikemen|horsemen` across `src/domain/display` + `src/components` = zero real hits (only "foot"/"footer" false positives). No unit-type concept on any display surface — ties back to ADD-2's grep-zero claim.
- Description: `src/domain/display/armyStrength.js` ALREADY exists — "the heuristic latent-strength phrase" (`:48-56` STRENGTH_BANDS "a formidable host…a thin levy") + `deployedArmyStatus` (`:132` returns `remainingPhrase`/`conditionPhrase`, e.g. "battered, roughly half its strength spent"). Consumers: `src/pdf/lib/liveWorld.js:65,158,316` (the PDF Faith & War chapter renders the army line — header: "W4h RE-ADOPTION… the army-in-the-field line… WIRED instead of stubbed") and `src/components/admin/AdminSimTuningPanel.jsx:35` only. The web dossier `src/components/new/tabs/WarFaithTab.jsx:11-15` **deliberately excludes** it: "We do NOT reach for warResolve's resolve/supply band here — that pulls militaryStrength → the heavy engine chain, which would drag weight toward first paint." `LiveWarStatus.jsx` deployment rows render a fixed string ("Deployed since tick N; home garrison thinned, war chest bleeding") — no per-force description.
- AMEND for ADD-1/ADD-2: land as enrichment of the existing armyStrength/warStatus display-leaf family (the A1.1.1 precedent is already built and PDF-wired); the composition deriver must respect WarFaithTab's recorded light-import constraint (stay off the `militaryStrength` heavy chain on first-paint-adjacent surfaces or lazy-load).

**(2) Sortable realm-wide table absence — CONFIRMED-ABSENT → ADD-3 SURVIVES.**
- Zero `sortBy|sortKey|sortColumn|onSort|sortable|aria-sort` hits in all of `src/components`. `TableView.jsx` is a phone "at the table" DM overlay (`:2-8`), not a data table. `<table>` markup exists only in admin/ops panels, settlement cards, and samples — none sortable, none realm-wide product surfaces. `HeraldGazetteer.jsx:7` — rows "in the order a register reads (alphabetical, codepoint-stable)"; `:12-13` "No population count, no score, no band number reaches this page." Ties back exactly to "register prose and card lists only." Caveat carried by the synthesis already holds: player-tier numeric columns would collide with heraldRegister's legibility law (`heraldRegister.js:32-36`) — the DM-tier/banded split in ADD-3 is load-bearing, keep it.

**(3) hoveredSettlementId EXISTS + zero zoomTo/panTo — CONFIRMED both halves → ADD-4 SURVIVES with a small AMEND.**
- `src/store/mapSlice.js:237` `hoveredSettlementId: null`, setters `:296-298` (`setHoveredSettlementId`/`clearHoveredSettlementId`), consumed by `src/components/map/QuickInspector.jsx:49`. Ties back.
- `zoomTo|panTo|flyTo|centerOn|showOnMap` = zero hits in all of src. `setViewport` is written only from `WorldMap.jsx` (user-driven d3.zoom) and the unrelated `gallery/ImageCropper.jsx`. No programmatic pan-to-entity affordance exists. AMEND: the camera is **mode-specific** — `mapSlice.js:695-706` "the camera viewport is mode-specific (FMG map-pixels vs image px)… Drop the image-space camera so it can't be pushed into FMG d3.zoom on reload" — ADD-4's pan/zoom affordance must resolve per-mode coordinates, not one frame.

**(4) Treasury absence — CONFIRMED-ABSENT, with an explicit in-code standing ruling → ADD-11 SURVIVES, AMEND to cite the ruling.**
- `src/domain/worldPulse/treatyTransfer.js:13-17`: "There is NO treasury and NO conserved-coin primitive anywhere in the estate. The only `treasury` in src/domain is faction-scale flavour prose plus the factions' 0..100 `wealth` SCORE, which is an opinion about a faction, not a stock that can be moved without minting" — and cites "the f3cf639e ruling X/Z" (no-conserved-coin). All other treasury/tax hits in worldPulse are prose/metaphor (`rulingPower.js:181`, `stressorGates.js:588`, etc.). `warCosts.js`/`warCoalitionExpenditure.js` exist as claimed. AMEND: ADD-11 is not merely "new engine state ⇒ owner-gated" — it would **reverse a recorded standing ruling** (grain/`storageMonths` is deliberately the only conserved stock); the owner row must say so.

**(5) W1-4 mobilization absence — upgrades PLAUSIBLE-absent → CONFIRMED-ABSENT → W1-4 candidate SURVIVES with AMEND.**
- `src/domain/worldPulse/mobilization.js` (522 lines, read): ramp rate gated by "disposition / economy / deity / legitimacy" (`:9-11`); zero culture/religion mentions in the file. `militaryStrength.js` uses culture only inside the latent WILL facet (`:63,95,252`) — not a possession-cohesion divider. No cultural/faith-alignment discount on mobilized strength exists. AMEND: the nearest existing hook is the occupation suppression — `mobilization.js:76-83` `OCCUPIER_CONTROL_STATES = new Set(['extractive','stabilized','vassalized'])`, `:322-329` "a firmly-occupied town cannot ramp its own war machine" — a binary form of the same cohesion idea; a graded divider would live there, and our model is per-settlement, not per-cell (FMG's divider assumes cell-level held territory we don't model).

**(6) hopWeeks + no isochrones — CONFIRMED both halves → ADD-7 SURVIVES with AMEND.**
- `src/domain/spatial/distanceRead.js:9` `hopWeeks(digest, fromId, toId)` — "travel TIME in integer weeks", self-calibrating constant (`:11-15` "never a magic number"), seasonal overlay at read time (`:41-45`). Zero `isochrone|travel range|range ring` hits anywhere. `TravelersLayer.jsx:27,72` already consumes hopWeeks in a map overlay — the render precedent exists. AMEND two ways: (a) `distanceMatrix` is settlement-pair only (`:36-38`) — no per-cell cost field exists, so honest "rings" are hopWeeks-banded *settlement* groupings ("within a week's ride"), not continuous spatial contours; (b) `:28-30` "the entitlement + spatialCanonVersion gate lives at the CALL SITES" — the POLIS-3 feed must sit behind that marker.

**(7) ?focus= route param — CONFIRMED-ABSENT → ADD-8's focus-param row SURVIVES with a precedent note.**
- Zero `focus=` query-param sites in src (only `window.addEventListener('focus')`, App.jsx:339). `WorldPage.jsx:26-32` takes only the path `code` (`AppViews.jsx:150` `<WorldPage code={params.code}>`), reads no query string. The app's only query params: legacy `?view=` rewrite (`App.jsx:383`, preserves "gallery slug, flag overrides"), and `?mapview=` on settlement routes (`src/lib/mapSubTabs.js:53` "/settlements/<id>?mapview=portrait3d"). AMEND-grade note: `?mapview=` is an existing UI-state query-param convention — ADD-8's `?focus=` should follow the mapSubTabs precedent.

**Summary table:** (1) ADD-2/ADD-1 SURVIVE-AMEND (enrichment path exists: armyStrength.js + PDF wire; composition truly absent) · (2) ADD-3 SURVIVES (CONFIRMED-ABSENT) · (3) ADD-4 SURVIVES-AMEND (field exists; zero pan/zoom; dual-mode camera) · (4) ADD-11 SURVIVES-AMEND (absence is a recorded ruling f3cf639e, not an oversight) · (5) W1-4 SURVIVES-AMEND (CONFIRMED-ABSENT; occupation rungs are the hook; per-settlement not per-cell) · (6) ADD-7 SURVIVES-AMEND (hopWeeks real; rings must be settlement-banded + entitlement-gated) · (7) ADD-8 focus-param SURVIVES (CONFIRMED-ABSENT; mapview precedent). No KILLs; every §6 PLAUSIBLE row checked upgrades to CONFIRMED with the amendments above.