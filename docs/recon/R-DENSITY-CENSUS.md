# R-DENSITY-CENSUS — TE-DENSITY-1 census report (ODQ §810.3 R6 + §813)

**Lane:** TE-DENSITY-1 CENSUS (Fable seat, read-only recon). **Measurement tree:** `laneDENS-tree` at `b8504409937f968a04a1baa7f10843969ebc8d33` (clean, verified). **Corpus:** 360 settlements — 60 per tier × 6 tiers (thorp→metropolis), seeds `dens-<tier>-000..059`, driven through the real `generateSettlementPipeline` headless (`customContent:{}`), zero generation errors, determinism spot-checked identical on 2 tiers (CONFIRMED). Harvest salvaged from the predecessor lane and integrity-verified: 360/360 rows parse, per-tier counts exact, aggregate re-derived from rows on 5 spot-checked figures with exact agreement (CONFIRMED). A second, independent 360-generation probe (stress + seat membership) was executed by this lane and reproduces the seat-floor figures (CONFIRMED).

---

## 1. VERDICT

**The measured world does NOT violate the §810.3 seat floor today — 0 of 360 settlements lack a named NPC in the ruling power's faction (CONFIRMED, measured twice independently).** Every settlement has a governing faction (`isGoverning`) and every governing faction has ≥1 *pipeline* (non-placeholder) named member; the floor is not even resting on structural placeholders.

**But the measured world violates nearly every other §810 shape:**

1. **The R17 atomic-mint state is mass-produced today: 172 of 2,140 power factions (8.0%) carry ZERO named NPCs** (CONFIRMED), worst at village (14.2%) and town (10.5%). "NPC-less factions are unrepresentable" is a false statement about the current generator at every tier.
2. **Faction counts sit 100% ABOVE the candidate bands at hamlet, village, and town (60/60 each), and 43% above at thorp** (CONFIRMED). The current generator mints roughly one faction per ranked power at every tier, so small settlements carry big-settlement politics.
3. **NPC mass sits BELOW the proposed floor at the top: 24/60 metropolises are under the candidate 18–30 band's floor; 3/60 cities under 12** (CONFIRMED). The proposed ladder *raises* density at the top and *slashes* faction counts at the bottom — both are real distribution moves, neither is a ratification of the status quo.
4. **The rank-ceiling law ("no pillars below town; a thorp's head at most notable") is contradicted by 7/60 thorps, 22/60 hamlets, and 37/60 villages carrying ≥1 pillar NPC, and 20/60 thorps carrying key-or-pillar figures** (CONFIRMED) — mostly minted by `factionRoles.js`'s hardcoded pillar/key structural roles, which apply uniformly at all tiers.
5. **R13's legitimized-absence path is entirely unbuilt: 9/360 settlements carry the existing `succession_void` stressor today, and every one of them still births a seated ruler** (CONFIRMED — govMembers ≥1 in all 9). The typed missing-seat stressor family exists in the vocabulary (`succession_void`, prob-rolled, severity 5); what does not exist is any generation path where it lifts the floor.
6. **City and metropolis draw faction counts from one undifferentiated distribution** (freq {8:46, 9:10, 10:4} at both tiers, not per-index identical — 38/60 match — so it is one shared law, not an artifact) (CONFIRMED). The candidate ladder separates them (5–8 vs 7–10); a city rolling 5–7 factions is unreachable today.

Net: **the seat floor needs no remediation wave — it needs only the R15 walker to keep it true. Everything else in Register VII is a real generation-law change**, and the consumer sweep (§4) found two consumers that block as-is, five that need bridges, and no consumer that breaks outright on count changes alone.

---

## 2. Per-tier distributions (CONFIRMED, n=60 per tier)

### 2.1 Factions per settlement (`powerStructure.factions`)

| Tier | min | p25 | med | p75 | max | mean | freq |
|---|---|---|---|---|---|---|---|
| thorp | 2 | 2 | 2 | 3 | 6 | 2.68 | 2:34 · 3:15 · 4:8 · 5:2 · 6:1 |
| hamlet | 3 | 4 | 4 | 4 | 7 | 3.93 | 3:14 · 4:38 · 5:7 · 7:1 |
| village | 5 | 6 | 6 | 7 | 8 | 6.10 | 5:14 · 6:29 · 7:14 · 8:3 |
| town | 6 | 6 | 6 | 6 | 8 | 6.35 | 6:47 · 7:5 · 8:8 |
| city | 8 | 8 | 8 | 8 | 10 | 8.30 | 8:46 · 9:10 · 10:4 |
| metropolis | 8 | 8 | 8 | 8 | 10 | 8.30 | 8:46 · 9:10 · 10:4 |

### 2.2 Named NPCs per settlement

`npcTotal` = pipeline NPCs + structural placeholders (`generatedAs: 'faction_structural'`, the "The High Priestess"-style office fillers).

| Tier | npcTotal (min/med/max, mean) | npcPipeline (mean, matches `getNPCCountRange`) | npcStructural (mean) | unaffiliated |
|---|---|---|---|---|
| thorp | 2 / 3 / 6, 3.03 | 2.42 (range 2–3) | 0.62 | 0 |
| hamlet | 4 / 6 / 9, 5.65 | 4.03 (range 3–5) | 1.62 | 0 |
| village | 5 / 6 / 8, 6.32 | 5.45 (range 4–7) | 0.87 | 0 |
| town | 6 / 9 / 11, 8.62 | 8.12 (range 6–10) | 0.50 | 0 |
| city | 11 / 14 / 17, 13.78 | 12.82 (range 10–15) | 0.97 | 0 |
| metropolis | 15 / 18 / 22, 18.23 | 17.50 (range 15–20) | 0.73 | 0 |

The pipeline counts land exactly inside `npcGenerator.js`'s `getNPCCountRange` table (thorp 2–3 … metropolis 15–20) — that table IS the current mass band, hardcoded (CONFIRMED). **Every named NPC is faction-affiliated at every tier (unaffiliated 0/360 settlements)** — mechanism: the assignment cascade in `npcGenerator.js` (~line 1120) ends at `pool = [...factions]`, so assignment cannot fail while factions exist (CONFIRMED by measurement; mechanism read from source).

### 2.3 NPCs per faction (dispersal, measured across all factions of the tier)

| Tier | med | p75 | max | mean | zero-member share | factions w/ ≤1 member | denominator |
|---|---|---|---|---|---|---|---|
| thorp | 1 | 1 | 3 | 1.13 | **6.2%** | 87% | 161 |
| hamlet | 1 | 2 | 3 | 1.44 | 3.4% | 61% | 236 |
| village | 1 | 1 | 3 | 1.04 | **14.2%** | 83% | 366 |
| town | 1 | 2 | 5 | 1.36 | **10.5%** | 67% | 381 |
| city | 1 | 2 | 7 | 1.66 | 7.6% | 52% | 498 |
| metropolis | 2 | 3 | 9 | 2.20 | 4.8% | 32% | 498 |

Dispersal shape: the all-in-the-ruling-power pattern never occurs (0/360 settlements put every NPC in the governing faction); the spread-one-each pattern dominates small tiers (32/60 thorps, 13/60 villages have no faction above 1 member); median share held by the largest faction falls from 0.50 (thorp) to 0.26 (metropolis) (all CONFIRMED). The current disperser is `npcGenerator.js`'s power-proportional `factionTarget` with `Math.max(1, Math.round(...))` — concentration already loosely follows power, but the floor-at-1 and the always-affiliate cascade produce the thin-spread shape.

### 2.4 Importance mix (rung raw material)

Totals across each tier's 60 settlements (minor / notable / key / pillar):

| Tier | minor | notable | key | pillar | per-settlement pillar mean |
|---|---|---|---|---|---|
| thorp | 143 | 15 | 17 | **7** | 0.12 |
| hamlet | 158 | 28 | 130 | **23** | 0.38 |
| village | 205 | 15 | 115 | **44** | 0.73 |
| town | 249 | 14 | 161 | 93 | 1.55 |
| city | 425 | 69 | 215 | 118 | 1.97 |
| metropolis | 614 | 87 | 223 | 170 | 2.83 |

Rung relevance: the pulse derives `dotRank` from `notability(npc)` (npcAgency.js:262 — ≥0.82→3, ≥0.6→2, else 1) and ladder eligibility from `importanceWeight ≥ 0.4` (notable+, `RUNG_ELIGIBLE_FLOOR`, npcLadderState.js). At thorp, 143/182 NPCs are minor — i.e., most of the small-tier world is **ladder-invisible today** (CONFIRMED mix; eligibility mapping read from source). `RUNG_CAP_BY_TIER` is thorp 1 · hamlet 2 · village 3 · town 3 · city 4 · metropolis 5.

### 2.5 Governing category + archetype carriage

| Tier | governing faction category (freq) | archetype carriage (share of settlements carrying ≥1 faction of category) |
|---|---|---|
| thorp | government 60 | gov 1.00 · econ 0.97 · relig 0.27 · other 0.17 · mil 0.10 · noble 0.03 |
| hamlet | government 60 | gov 1.00 · econ 1.00 · mil 1.00 · noble 0.63 · other 0.12 · crim 0.02 |
| village | government 25 · **other 35** | econ 1.00 · relig 1.00 · mil 0.98 · noble 0.70 · other 0.65 · gov 0.42 |
| town | government 31 · **economy 28** · noble 1 | econ/relig/mil 1.00 · noble 0.97 · gov 0.53 · other 0.13 · crim 0.10 |
| city | government 38 · **economy 22** | econ/mil/relig/noble/crim/magic 1.00 · gov 0.63 · other 0.12 |
| metropolis | government 29 · **economy 31** | econ/mil/relig/magic/noble/crim 1.00 · gov 0.52 · other 0.08 |

At village+ the ruling seat is frequently non-`government`-categorized (village: 35/60 "other"; metropolis: economy is the modal ruler) (CONFIRMED). R3/R16's "top influence ≠ ruling power" drama trigger will fire against a world where mixed-category rule is already normal.

The separate NPC-grouping list `settlement.factions` (npcGroupFactions) runs 1–8 per settlement (thorp med 1, metropolis med 3) and is a *different* list from `powerStructure.factions` — `factionRoles.js` explicitly treats powerStructure as authoritative (CONFIRMED both lists exist and diverge in count everywhere).

---

## 3. Seat-floor table (§810.3 — the charter's question (b))

| Tier | gov faction missing | gov faction w/ 0 members | gov w/ 0 *pipeline* members | gov member dist |
|---|---|---|---|---|
| thorp | 0 | 0 | 0 | 1:47 · 2:12 · 3:1 |
| hamlet | 0 | 0 | 0 | 1:1 · 2:41 · 3:18 |
| village | 0 | 0 | 0 | 1:43 · 2:15 · 3:2 |
| town | 0 | 0 | 0 | 1:9 · 2:26 · 3:18 · 4:5 · 5:2 |
| city | 0 | 0 | 0 | 1:6 · 2:14 · 3:25 · 4:7 · 5:5 · 6:2 · 7:1 |
| metropolis | 0 | 0 | 0 | 2:2 · 3:11 · 4:18 · 5:17 · 6:9 · 7:2 · 9:1 |

**Current violation rate: 0/360 (0.0%), CONFIRMED twice** (salvaged harvest + this lane's independent probe). `govMembersDist == govRealMembersDist` at every tier — the ruling seat is never held only by a structural placeholder. Mechanism (PLAUSIBLE, from source): the leadership roles the pipeline always mints per tier (Elder … Governor, npcGenerator.js ~1485) role-keyword-lock into the governing faction in assignment Pass 1.

**R13 cross-check (executed):** 9/360 settlements carry `succession_void` today (thorp 2 · hamlet 0 · village 1 · town 2 · city 2 · metropolis 2; overall stress carriage 97/360 across 14 types). All 9 still have 1–4 named NPCs in the governing faction — so **no settlement is born rulerless today under any path**, and the missing-seat stressor exists only as climate/narrative, never as a floor-lift. R13's work is a pure build (wire the existing `succession_void` family into the roll as the typed floor-lift + vacancy-and-yearner at the throne), not a repair (CONFIRMED).

---

## 4. Count-sensitive consumer sweep (charter question (c))

**Denominator and how it was established (CONFIRMED):** union of every `src/` file at `b85044099` reading any moved quantity, by exhaustive grep over the five quantity surfaces — `powerStructure.factions` (49 files), `factionAffiliation` (31), importance buckets/`importanceWeight`/`inferImportance` (27 + 15 bucket-literal), `factionSeat`/`dotRank` (11), `memberNpcIds` (3) — **union: 93 unique files**. Every file was classified; the 14 count-SENSITIVE consumers below are dispositioned individually, and the remaining ~79 fall into four count-NEUTRAL classes dispositioned at the end.

| # | Consumer (file:symbol) | What density moves in it | Disposition |
|---|---|---|---|
| 1 | `factionCompetition.js:469 seatNpcsIntoFactions` | roster size per faction → `memberNpcIds` length; seats filled per `factionSeat` | **Moves-safely mechanically** (filter+sort over any roster). ⚠ but seat/rung occupancy is *derived* (`dotRankFor` off notability), not read from generation — see #8's bridge. |
| 2 | `espionagePresence.js:91 presentShare01` (+ bench math `presenceSharesFor` → council bench + contest) | roster size is the denominator of the absence ratio | **Moves-safely.** Empty roster → identity 1 by construction; `max(1, n)` guards; range clamped [0.5, 1]. Note: 1-member rosters (52% of city factions today) make the discount binary 1.0/0.5 — density's 2–3 suites *smooth* this consumer, they don't stress it. |
| 3 | `clergyTraitPlane.js:133 ORG_POWER` minor=0 floor (mirrors `religionLegitimacy.orgPower`, `entities/npcs.importanceWeight`; same 0.4 threshold as `RUNG_ELIGIBLE_FLOOR`) | importance mix per faction | **Needs-a-bridge.** A minor-only clergy roster carries weight 0 → the whole plane reads dark (weight 0 ⇒ every field 0). Under the rank-ceiling law, low-tier temples trend minor/notable — the band fixture must either guarantee an occupied head rung rolls ≥ notable, or the owner signs "dark planes at thorp/hamlet are intended." Same fork governs ladder eligibility (#8). |
| 4 | `factionCapture.js advanceFactionCapture` | more members → higher chance a seat-holder is corrupt → capture climb rates drift up at city+ | **Moves-safely, tuning note.** Reads `internalSeats` (post-#1); no count assumption breaks. The upward capture drift is a declared distribution shift for the tuning pass. |
| 5 | `factionCompetition.js:207 topFactionEntries` (contest weights) | faction count vs the fixed `slice(0, 3)` | **Needs-a-bridge (design).** Only the top-3 by raw power are ever evaluated; today ≥50% of factions at village+ never contest, and under the candidate ladder a metropolis keeps ≥57% unevaluated. R4's intra-power rivals may not *both* reach top-3, making the doubled-niche contest invisible to the very machinery R4 reuses. The existing D8 judgment (selection on raw power, chair-CONFIRMED) governs the *key*, not the *width*. Secondary: `factionPower`'s index fallback (`0.72 − 0.16·index`, floor 0.18) flattens all factions at index ≥4 that lack a `power` value (rare — generation writes power). |
| 6 | `factionRoles.js ensureFactionStructuralNpcs` | appends office placeholders AFTER the roster exists (measured +0.5–1.6 NPCs/settlement) | **BLOCKS as-is.** Under R10's two-stage roll + the §810.2b "zero mass outside the band" fixture, a post-roll appender is a band violation by construction — measured proof: thorp *pipeline* mass is 60/60 inside the candidate 1–3 band, but structural top-ups push 15/60 thorps above it. R17's atomic mint is also exactly this file's job done properly. TE-DENSITY-1 must subsume office-coverage into the dispersal roll (or gate this writer off under the new law version). |
| 7 | `npcGenerator.js` faction assignment (`factionTarget` power-proportional, `Math.max(1, round)`, `CATEGORY_COMPAT`, always-affiliate cascade) | this IS the current dispersal machinery | **Superseded by R10** (replace, don't bridge). Two behaviors the replacement must consciously keep or type away: every NPC affiliated (unaffiliated is currently an impossible state — measured 0/360) and concentration-follows-power. |
| 8 | `npcLadderState.js` (`RUNG_CAP_BY_TIER` 1/2/3/3/4/5, `RUNG_ELIGIBLE_FLOOR` 0.4) + `npcAgency.js dotRankFor/roleSeatFor` | rolled rung occupancy vs derived rungs | **Needs-a-bridge.** The law's head/middle/lowest is a 3-rung roster shape at every tier; the ladder caps at 1 rung (thorp) to 5 (metropolis), and occupancy is *derived* from notability at pulse time — an authored vacancy (R11's vacancy-plus-yearner) survives only if the derivation cannot silently re-fill it, and a thorp's 1-rung ladder cannot represent a middle/lowest occupant at all. The rolled-rung ↔ derived-dotRank mapping is a car of its own. |
| 9 | `npcLadderState.js designateHeir` | needs `rungs.length ≥ 2` | **Moves-safely, succession note.** 1-member ruling factions (47/60 thorps today; the R2 one-person polity) have no designated heir — §810.7's claim vocabulary is the intended fallback; the succession car should assert this path exists before the resolution clock (R24) leans on it. |
| 10 | `mutateEntities.js` CREATE_FACTION (mints `memberNpcIds: []`) | the event layer can mint an NPC-less faction | **Needs-a-bridge / owner call.** Contradicts R17's "unrepresentable at birth on every generation path" if DM-authored events count as a path. Either the affordance co-mints a member, or the owner exempts authored content (it is the owner's world, not the roll's). |
| 11 | `personaSlicer.js:146` roster `slice(0, 8)` | faction count vs the AI-context cap | **Moves-safely, note.** Metropolis 7–10 slightly overflows: factions 9–10 invisible to the parley persona. Cheap widen or accepted truncation — flag at the values pass. |
| 12 | `roads/state.js factionPowerStanding01` + `embassyEnvoyWeight01` (+ espionage notoriety, a declared verbatim reuse) | importance mix + faction power of envoys | **Moves-safely.** Per-NPC reads; only distributions shift (tuning-pass input). |
| 13 | `factionCompetition.js` coalition trust (`coGoverningFactionIds`, `MAX_PAIRS_PER_SETTLEMENT`) + `ensureFactionStates` | more factions → more pair candidates, more minted state | **Moves-safely.** Pair deposits are explicitly bounded; state minting is per-faction linear; `factionId` is name-keyed (not index-keyed), so identity does not churn with count. |
| 14 | `entities/successors.js successorScore` | candidate pool size + importance mix | **Moves-safely.** Ranking improves with more candidates; importance weighting is a preference, not a floor. |

**Count-neutral remainder (79 files, dispositioned as classes — moves-safely):** (a) UI renderers and view models (NPCsTab, npcComponents, SettlementWorkbench, VersionDiffView, EventComposer, pdf/viewModel, publicSafe, …) — iterate whatever exists; (b) event mutators/undo/propagation (mutateHelpers, undoEvent, propagate, factionResponses, factionRename, rename helpers) — per-entity, count-blind; (c) generation-side siblings that write rather than read the moved quantities (generatePopulation, neighbourFactions, powerGenerator, narrativeGenerator, receipts) — they are the *law's own* rewrite surface; (d) schema/manifest/fingerprint (settlement.schema, fieldManifest, structuralFingerprint) — shape-preserving; fingerprints move only for new-law worlds, which R5's versioning already declares. No file in the 93 was left unclassified.

---

## 5. Candidate-band comparison (measured vs Register VII ladder)

Bands: factions — thorp 1(+1)·hamlet 1–2·village 2–3·town 3–5·city 5–8·metropolis 7–10; mass — 1–3·2–4·3–6·6–10·12–20·18–30. Thorp factions scored against 1–2 (conditional +1 granted).

| Tier | factionCount in/above/below band | npcTotal in/above/below | npcPipeline in-band |
|---|---|---|---|
| thorp | 34 / **26** / 0 | 45 / 15 / 0 | **60/60** |
| hamlet | **0 / 60 / 0** | 4 / **56** / 0 | 43/60 |
| village | **0 / 60 / 0** | 34 / 26 / 0 | 44/60 |
| town | **0 / 60 / 0** | 56 / 4 / 0 | 60/60 |
| city | 46 / 14 / 0 | 57 / 0 / 3 | 44/60 |
| metropolis | 60 / 0 / 0 | 36 / 0 / **24** | 29/60 |

Readings (all CONFIRMED):
- **Where reality already sits inside the proposal:** metropolis faction count (60/60), city faction count (46/60), town and thorp *pipeline* mass (60/60 each). The town mass band 6–10 is essentially today's 6–10 table — a ratification.
- **Where the proposal cuts:** hamlet/village/town faction counts (100% above band — the ladder halves village politics and quarters hamlet's), thorp faction count (43% above).
- **Where the proposal raises:** metropolis mass (40% of today's metropolises are below the new 18 floor; today's hard cap of 20+structural cannot reach the band's 30, and "full suites on select pillars" — 2–3 per faction — is only 53% of metropolis factions today, 43% at city).
- **Dispersal:** the ladder's city/metropolis 2–3-per-faction suites vs measured med 1 (city) / 2 (metropolis); the one-per-ranked-power town shape is already the de-facto pattern (med 1.36/faction).
- **Band-edge conflicts inside the current data:** pillars below town (74 total across thorp+hamlet+village) and thorp key/pillar heads (20/60 settlements) contradict the rank-ceiling rider — driven by `FACTION_ROLES`' tier-blind pillar/key importances, which the density car must re-spec per tier.

---

## 6. Open questions for the chair

1. **Which total does the mass band govern?** Pipeline NPCs only, or pipeline + structural placeholders? Thorp is in-band 60/60 on pipeline and violated 15/60 only via placeholders. (§4 #6's disposition assumes the band governs the whole named roster; if so `ensureFactionStructuralNpcs` must fold into the roll.)
2. **R17 scope over the event layer:** does DM-authored CREATE_FACTION (mints `memberNpcIds: []`) count as a "generation path," or is authored content exempt from the atomic mint?
3. **The minor=0 / RUNG_ELIGIBLE floor vs low-tier rank ceilings:** guarantee an occupied head rung ≥ notable, or sign dark clergy planes and empty ladders at thorp/hamlet as intended behavior?
4. **Contest top-3 width:** keep `slice(0,3)` (D8's selection judgment) knowing R4's doubled-niche rivals may both miss the cut, or widen the evaluated set with density?
5. **Rung model reconciliation:** the law's universal head/middle/lowest vs `RUNG_CAP_BY_TIER` 1–5 and pulse-time dotRank derivation — which representation owns rolled vacancies, and how does a vacancy survive `dotRankFor`'s re-derivation?
6. **Which faction list does Register VII govern?** `powerStructure.factions` (measured here, authoritative per factionRoles) — and does the NPC-grouping `settlement.factions` list (1–8/settlement, divergent counts) get re-derived, frozen, or retired under the new law?
7. **City band floor reachability:** city 5–8 implies cities rolling 5–7 factions, a state the current generator never produces (min 8) — confirm the band intends to *thin* city politics vs today, not merely cap it.
8. **The always-affiliated invariant:** unaffiliated named NPCs are impossible today (0/360). Does the new dispersal preserve that, or type an unaffiliated state (with its own consumer sweep)?
9. **presentShare01's binary discount on one-person factions** (R2 makes them common at thorp): acceptable spike (0.5 or 1.0, nothing between), or damp for singleton rosters at the tuning pass?

### Figure provenance
All distribution figures, violation counts, band comparisons, and the stress cross-check: **CONFIRMED** (executed against the pinned tree; harvest independently re-derived on 5 figures; seat floor measured twice). Mechanism attributions (why the floor holds, why affiliation never fails): **PLAUSIBLE** (read from source at the pinned sha, consistent with all measurements, not perturbation-tested). Consumer dispositions: file:line evidence at `b85044099`; the 93-file denominator is grep-exhaustive over the five moved-quantity surfaces (spelling variants beyond those five idioms would evade it — none were observed in the files read).

*Artifacts: salvaged harvest (`dens-census.mjs`, `dens-census-rows.jsonl`, `dens-census-aggregate.json`) in the predecessor scratchpad; this lane's probe (`dens-stress-probe.mjs`, `dens-stress-probe.out.json`) in the current scratchpad.*
