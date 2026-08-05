# TR-ARCHITECTURE — THE FP-TRADE PROGRAM, COMPILED IMPLEMENTATION LAYER

## TR program architect, 2026-08-04. Measured against the live tree at
## claude/composite-r4 @ e564e135 (worktree minifold). This file COMPILES
## DESIGN_FP_TRADE.md (the design law — where they conflict, the volume wins and
## the conflict is a bug to report) into the war-volume build idiom
## (DESIGN_WAR_RULINGS_ARCHITECTURE.md is the format precedent; its §10
## implementer protocol binds here verbatim, plus the TR deltas in FP_TRADE §10).
## Every substrate premise below was RE-MEASURED by grep/read on this date;
## LIVE CODE OUTRANKS EVERY TABLE IN THIS FILE — re-verify anything you build on.
## Judgments are labeled JUDGMENT and are vetoable by the chair or the owner.

**Status: IMPLEMENTATION ARCHITECTURE. Nothing here is scheduled until the owner
sequences it per SPINE §5 (SP → GRAMMAR → INFO → TRADE). Every wave ships DARK.**

---

## §1 SUBSTRATE CLAIMS — every existing-code premise, re-measured 2026-08-04

Verdicts: **VERIFIED** (receipt quoted from the live tree), **VERIFIED/MOVED**
(mechanism confirmed, the volume's line address rotted — navigate by SYMBOL),
**REFUTED** (the claim as stated is wrong; the correction is binding on the wave
that builds on it).

### 1a The commerce physics substrate

| # | Claim (FP_TRADE §2) | Live receipt | Verdict |
|---|---|---|---|
| S1 | M6a five-term integer conservation; kernel refuses to persist imbalance | `commodityFlow.js:260 assertGoodsConservation`; `MAX_SHIP: 12` at :117; refuse-to-persist guard `supplyKernel.js:488-493` (exact) | VERIFIED |
| S2 | Seizures conscience-gated (W-C2), conserve loot to the seizer | `commodityFlow.js:606-620` (`seizureTake(rec.carried, smuggle.conscienceOf(worst.id))` at :613); `conscienceOf` contract :369-370 | VERIFIED |
| S3 | `commodityFlowEnabled` virtual, lit only in full_simulation | `simulationRules.js:490` (claim said :424) | VERIFIED/MOVED |
| S4 | M2 shipments: K-ranked producers, hostile-gate cut, starvation latch + mandatory receipt | `supplyShipments.js:227 starvationReceipt` (exact); total-cut latch :261-352 | VERIFIED |
| S5 | M2 excludes FOOD by design | `supplyKernel.js:18-19` — "FOOD is deliberately EXCLUDED (category 'food'): foodStockpile remains the food-specific buffer" | VERIFIED |
| S6 | M6b earned centrality, derived toll (TOLL_MAX cap), founding ladder, gini guard | `entrepots.js:84 TOLL_MAX`, founding ladder :102-110, `centralityGini` :370 (exact) | VERIFIED |
| S7 | M6c belief gates WHETHER only; per-origin appetite; emboldened receipts | `dispatchEV.js:12-14` netDanger formula (exact); header: "nothing yet chooses WHERE"; ledgers `merchantAppetite`/`dispatchWillingness` `supplyKernel.js:566-581`; emboldened receipts :599-602 (exact) | VERIFIED |
| S8 | M6d display tally; GENERATION IS SACRED | `tradeFlow.js:13-18` (exact): "This tally is DISPLAY SUBSTRATE ONLY. It never writes economicState" | VERIFIED |
| S9 | M7 smuggle: warrant, one-roll-vs-worst-gate, relational table, rumor carrier | `CONTRABAND_TABLE` smuggle.js:87, `smugglePipeline` :258, `worstGate` :287 (all exact); EV-spill warrant :74 (claim :335); carrier `pulseKernel.js:1917-1942` (claim :1758-1783) | VERIFIED/MOVED |
| S10 | M8 sea-lane capacity recorded, unenforced | `seaLanes.js:84-87` — `SEA_LANE_CAPACITY = 10`, "no capacity throttle yet" | VERIFIED |
| S11 | J route lifecycle: 17 modules, DARK, ZERO Herald presence | `ls src/domain/worldPulse/routeNetwork*` = exactly 17; `routeLifecycleEnabled: false` simulationRules.js:528 (claim :449-462); zero `route_*` rows in WHAT_PHRASES (settlementRumors.js:116); candidate types exist at routeNetworkCharter.js:138-141 + routeNetworkDecay.js:123-134 | VERIFIED (addresses MOVED) |
| S12 | K4 magic substitution BUILT DARK | `magicSubstitution.js` + `magicSubstitutionReagents.js`; `magicEconomyEnabled: false` simulationRules.js:547 | VERIFIED |
| S13 | Goods vocabulary: canonical ids, grain criticality 0.95, alias folding; hostile ⇒ NO_TRADE | `goodsCatalog.js:30-36` (grain, `criticality: 0.95` at :35); `NO_TRADE_RELATIONSHIPS = new Set(['hostile'])` tradeLinks.js:26 (exact) | VERIFIED |

### 1b The food lane (TR-4's ground truth)

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S14 | NO per-tick import term; import coverage NETTED into the generation stash; FOOD_IMPORT_RATES reaches the tick lane only through the blockade arm; three BUILT bypass counterforces; six-term effective deficit | `foodStockpile.js:288` baseDeficitPct stash (exact); `_bypassShare` :314-315 (teleport/airshipBesieged), `_underwaysShare` :320, combined+subtracted :321-323 (exact); six-term sum :347 (exact); rates in `src/data/foodImportRates.js` (:18-20 teleport 0.3 / airshipBesieged 0.15), imported at foodStockpile.js:46 | VERIFIED — the flagship-good asymmetry stands |
| S15 | FIVE world-write sites move storageMonths (T3's census) | (1) tick advance `foodStockpile.js:406`; (2) the delta applicator `generosityUpdates.js:46-65 applyFoodDeltasToUpdates`; (3) a second near-identical fold in `applyWorldPulse.js:92-110` ("target loses, victor gains") — claim said :322, REFUTED ADDRESS, fold confirmed; (4) `magicBufferApply.js:349-357` (exact); (5) `mutateWorld.js:1125-1143` (exact) | VERIFIED at five (one address MOVED) |
| S16 | Treaty grain: applicator named; no-coin ruling recorded | `treatyTransfer.js:11-32` (f3cf639e ruling quoted; "generosityUpdates.applyFoodDeltasToUpdates, the existing single applicator" at :32; call at :122-136) | VERIFIED |

### 1c The treaty/term substrate (TR-5's ground truth)

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S17 | "TERM_CATALOG's economic family is EXACTLY four ... at peaceTerms.js:164-191" | The FAMILY claim holds: `{tribute, reparations, restitution, resource_share}` all `family: 'economic', stream: true` — but at **`peaceTermsCatalog.js:142-151`**, NOT peaceTerms.js. The catalog was EXTRACTED (an R2-style leaf split already executed); peaceTerms.js re-exports at :1153. `sovereignty_transfer` (family `sovereignty_transfer`) joined at :185 since the survey. **TR-5's rows land in peaceTermsCatalog.js** (80 effective lines — cheap), never back in peaceTerms | **REFUTED** (location; family membership VERIFIED) |
| S18 | trade_exclusivity / market_access / toll_exemption return ZERO hits tree-wide | Re-grepped BOTH spellings each (`trade_exclusivity\|tradeExclusivity`, `market_access\|marketAccess`, `toll_exemption\|tollExemption`): zero src hits | VERIFIED ABSENT |
| S19 | 52-week treaty year + legacy-12 provenance markers (WR-0c item 4) | `treatyClock.js:6-7` — `LEGACY_TREATY_TICKS_PER_YEAR = 12`, `CURRENT_TREATY_TICKS_PER_YEAR = INTERVAL_WEEKS.one_year`; `treatyTicksPerYearOf` :22 | VERIFIED |
| S20 | peaceTerms "at 794/800 lines" (the R2 net-zero premise) | Effective (comment/blank-stripped) count TODAY: **766/800** (wc -l 1181). The extraction (S17) bought headroom; the R2 net-zero-seam-lines law still binds (measure with the enforcer Linter AT the publishing commit — never inherit this figure) | **REFUTED** (stale figure; law unchanged) |
| S21 | Typed channels: the trade triple | `graph.js:47-64 REGIONAL_CHANNEL_TYPES` — trade_dependency, export_market, trade_route (exact) | VERIFIED |
| S22 | trade_partner relationship rules | `relationshipEvolution.js:48+ RELATIONSHIP_RULE_MATRIX` ("neutral_to_trade_partner" …) | VERIFIED |
| S23 | tradeWar: hysteresis + FLIP_COOLDOWN 6; escalation deposits a war INTENT through the one opener | `FLIP_COOLDOWN_TICKS = 6` tradeWar.js:81 (exact); escalation block :620-670 deposits `warIntent: { fromId, targetId }` at :670 (claim :500-599) — WR-0c item 3 confirmed landed | VERIFIED/MOVED |
| S24 | tradeSalience per-commodity value-of-tie | `tradeSalience.js` present (531 lines); `signedTradeSalienceFactor` re-exported relationshipEvolution.js:46 | VERIFIED |

### 1d Agency, embargo, commons, pressure

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S25 | Three organic embargo entries; no typed grievance record names WHY | `EMBARGO_FLOOR: 0.15` institutionTolerance.js:59 + tolerance math :114-135; weaponized-dependency block relationshipRulesAdversarial.js:535-627 (exact range); merchant lever `LEVER_NUDGE = 0.05` settlementStrategy.js:199-205; `commercialReasons` zero hits | VERIFIED |
| S26 | Merchant agency: MERCHANT_OBJECTIVE, archetype regex fallback, interest domains | `MERCHANT_OBJECTIVE` scoringObjective.js:72-114 (exact); factionArchetypes.js — category-first :52-56, MERCHANT name-regex fallback :81, resolution order :133-142 (claims :63/:85-96 MOVED). The rename-sensitivity TR-2 fences is CONFIRMED: the fallback is a name/description regex | VERIFIED/MOVED |
| S27 | Commons voice ladder BUILT DARK; consumer+reframer law; crowd may TRIGGER, never move goods | `commonsVoiceKernel.js:155 RUNG_KIND` (exact — petition/gathering/riot); virtual `commonsVoiceEnabled` :41-50; caller `assizeKernel.js` | VERIFIED |
| S28 | realmPressure01 half-wired: ONLY the war path consumes | consumers `demographicsWar.js:172, :295-312` (exact); `warReasons.js:801-853` (claim :696-747 MOVED); producer `demographicsObservation.js:137`; no trade-agreement consumer anywhere | VERIFIED — TR-5's dead consumer is real |
| S29 | perceivedScarcityOf exists; sole consumer war-motive | `demographicsWar.js:206` (def), :302 (consumer) — exact | VERIFIED |
| S30 | Generosity estate + trade overture; census row | `tradeOvertureNews` generosityNews.js:173 (exact); `'spatialLedgers.tradeOverture'` subsystemRowsWaves.js:172 (exact — the fp-audit's corrected citation held) | VERIFIED |
| S31 | Plan-lane fence | `demographicsPlans.js:21` — "This is not a general planning system and must not become one" (verbatim) | VERIFIED |
| S32 | Moral substrate present; drift module path VERIFY-AT-BUILD | **RESOLVED**: `src/domain/spatial/moralDrift.js` (`advanceMoralDrift`, `moralReckoningNewsEntries`, spatial ledger `'moralDrift'`; consumed pulseKernel.js:106/:2180) + `worldPulse/moralInstitutionPressure.js` + `worldPulse/moralMartialLean.js`. TR-6 reads THESE, never rebuilds | VERIFIED (path now pinned) |

### 1e The war-program seams TR consumes (all landed since the surveys)

| # | Claim | Live receipt | Verdict |
|---|---|---|---|
| S33 | negotiationPictures (WR-7) built — TR-5 consumes, never duplicates | `negotiationPictures.js` (512 effective lines): per-party picture create/normalize/mutate machinery | VERIFIED |
| S34 | WR-7 envoy estate + WR-7b hold writer landed — TR-8's substrate | `envoyErrand{Offer,Records,Evidence,Vocabulary}.js`, `foreignGuestHold.js` (one writer), `envoyDiplomacyEnabled: false` simulationRules.js:472 | VERIFIED |
| S35 | Treaties carry the orientation reader + victor-free mint road | `treatyOrientation.js` — `TREATY_ORIENTATION_KINDS = ['unknown','wartime','sale']`, `treatyOrientationOf` :120 (CR-WR10-G, landed @ e564e135) | VERIFIED |
| S36 | TR-5 degradation contract pinned BOTH ways with tripwire | `catalogGrewSinceWr10()` sovereigntyBundle.js:166 (derives families from `TERM_FAMILIES` at call time, peaceTermsCatalog.js:77 import); pins tests/domain/sovereigntyBundleWr10.test.js:321, :388 | VERIFIED |
| S37 | War taxonomy parallel: "war's 13↔13 has no commercial sibling" | `warReasonTaxonomy.js:24-60` — the live taxonomy is **16↔16** (lineage_claim, alliance_obligation, atrocity_answer + mirrors landed since the survey). The "no commercial sibling" half stands (commercialReasons: zero hits). NO TR pin may hard-code war's count | **REFUTED** (count; the bijection discipline and the absence both stand) |

### 1f 2026-08 estate mechanics (not in the volume's census; binding on every wave)

| # | Fact | Receipt |
|---|---|---|
| S38 | Flag manifest home: `ENGINE_GATED_VIRTUAL_RULE_KEYS`, five members today; **a member also owes a certification row or a declared-pending entry** (the manifest's own comment) | `simulationRules.js:185` (beliefAxes/conquestDoctrine/infoStatecraft/migrationRumors/sovereigntyTrade); comment :180-182 |
| S39 | All 8 TR flags + `syndicateHousesEnabled` return zero engine hits — clean namespace | multi-spelling grep, zero src hits |
| S40 | Size-ratchet currency is ESLint EFFECTIVE lines: baseline holds pulseKernel **1580** / applyWorldPulse **941** / settlementStrategy **812** (wc -l reads 2820/1291/1360 — do not confuse the two); engine layer ceiling **800**, components **600** | `scripts/.size-baseline.json` (15 entries); `eslint.config.js:513` (600), :563-573 (800) |
| S41 | **beliefMap.js is a HOT FILE: 771/800 effective** — TR-3/SP-2 work CANNOT land inside it (see Q3) | measured this date |
| S42 | Keyed-hash determinism helper: `hash01` | `region/contestMath.js:45` |
| S43 | Spatial-ledger conditional materialization primitives | `getSpatialLedger`/`setSpatialLedger` spatial/distanceRead.js:166/:180; drop pattern supplyKernel.js:577-581 |
| S44 | New-kernel mount road (pulseKernel/applyWorldPulse are ZERO-EDIT): existing in-cycle hosts | pulseKernel imports `advanceSettlementSupply` :64 + `advanceEntrepotLayer` :65 (landed before the bank); commonsVoiceKernel mounts inside `assizeKernel.js`; the WR-10 stage mounts via the treaty mint fold + `sovereigntyTransfer.js` leaf |
| S45 | Herald registry: `WHAT_PHRASES` settlementRumors.js:116 (canonical arm 63 kinds, fallback arm 107); heraldRouting rows live in per-kind *News.js modules (envoyNews.js is the walker template); pacing machinery = `narrativeTempo.js` |
| S46 | Verified-ABSENT list re-confirmed: tradeAgreement/trade_pact zero engine hits; demographicsRates.js:268-280 carries the admission verbatim ("No standing food-export treaty quantity exists in the tree yet"); no `TRADE_ENDING_KEYS`/tradeConvergence in warConvergenceContract.js (its :283 is `sovereigntyTradeEnabled`); no `spatialLedgers.errands`, no `believedScarcity`/`SCARCITY_BANDS`, no `postureOf` (roads' npc-grain `riskToleranceOf` roads/state.js:319 is NOT the SP-4 read) — **SP-1, SP-2, SP-3, SP-4 are UNBUILT** |

**THE ADDRESS-ROT RULING (systemic — S3, S9, S11, S15, S23, S26, S28):** seven of
the volume's file:line citations rotted while every cited MECHANISM survived.
This is the recorded hand-keyed-line-address-rot class. BINDING on implementers:
navigate by SYMBOL (grep the export), never by the volume's line number; a wave
brief that inherits a line address re-greps it first.

**Tally: 39 substrate rows re-measured — 36 VERIFIED (7 of them with moved
addresses), 3 REFUTED (S17 catalog location, S20 stale size figure, S37 taxonomy
count).**

---

## §2 THE FLAG FAMILY (law-2 shape + manifest timing)

Eight program flags (TR-9 is flagless; `syndicateHousesEnabled` is RESERVED by
the TR-2b chair amendment — a recorded decision, drafted only when the owner
sequences it). Every flag, identically:

- **Shape:** ABSENT from DEFAULT_SIMULATION_RULES (virtual); every gate read is
  strict `=== true`; dark-never-permissive; at least ONE by-name read per flag
  (the conjunction-gate hole: a flag read only through a frozen-list `.every()`
  is invisible to the gate walker).
- **Manifest timing:** the flag joins `ENGINE_GATED_VIRTUAL_RULE_KEYS`
  (simulationRules.js:185) **in the SAME commit as its first real gate read**,
  with the walker asserting exactly that one-key delta, and — per the manifest's
  own comment (S38) — a certification row **or a DECLARED-PENDING entry** in the
  same commit (see Q4: pending at the wave, real row at TR-9).
- **Four-fence dormancy set per flag** (own-footprint golden · absent-vs-false
  differential · call-path spy · gate-polarity census) **plus the lit-mutant
  control** proving the fences see (the differential alone is blind by design).
- Lit only in full_simulation at the owner-signed soak, in build order.

| Flag | Wave | First-gate-read commit | Lit-preconditions (volume §3, re-measured) | Buildable against TODAY's tree? |
|---|---|---|---|---|
| `casusCommerciiEnabled` | TR-1 | TR-1's one commit | — | **YES** |
| `merchantHousesEnabled` | TR-2 | TR-2's one commit | TR-1 | **YES** (after TR-1) |
| `believedMarketsEnabled` | TR-3 | TR-3's one commit | **SP-2 landed** + TR-1 | NO — SP-2 unbuilt (S46) |
| `foodCaravansEnabled` | TR-4 | slice-1 commit | `commodityFlowEnabled` + `demographicsEnabled` (both exist: S3, simulationRules.js:579); collapse arm additionally `routeLifecycleEnabled` (dark ⇒ honest permanent zero) | **YES** |
| `tradePactsEnabled` | TR-5 | TR-5's one commit | **SP-3 landed** + TR-1 (+ TR-4 for grain_provision's physical arm; dark-TR-4 = the named conserved-rate degraded read) + **GR-3 rows** | NO — SP-3/GR-3 unbuilt |
| `corneringEnabled` | TR-6 | TR-6's one commit | TR-2 + TR-3 + TR-4 + `commonsVoiceEnabled` (exists BUILT/DARK: S27) | NO — via TR-3 |
| `venturesEnabled` | TR-7 | TR-7's one commit | TR-2 + TR-3 + `commodityFlowEnabled`; `new_route` kind additionally `routeLifecycleEnabled` (dark ⇒ suppresses to {far_market, joint_venture}) | NO — via TR-3 |
| `factorErrandsEnabled` | TR-8 | slice-1 commit | **SP-1 landed** + TR-5 + TR-7 + WR-7b hold writer (landed: S34) | NO — SP-1 unbuilt |

TR-9's certification walker enforces KIND-AVAILABILITY under each precondition
(the volume's ruling) — a flag lit out of order is an invalid config it reds.

**JUDGMENT (buildability split, vetoable):** the spine-blocked rows are stated as
facts, not as license to re-sequence. TR-1, TR-2, TR-4 and TR-9's contract
module are the only waves whose every substrate dependency measured BUILT today.
Sequencing stays the owner's (Q1).

---

## §3 CANONICAL MODEL — the L4 fight, won: ZERO new top-level worldState keys

All new state = THREE sub-keys of the existing `spatialLedgers` home, written
via `setSpatialLedger`/`dropSpatialLedger` (S43): conditionally materialized,
drop-when-empty at every level, zero eager bytes, absent ⇒ byte-identical,
exactly ONE writer module each. Conditional fields drop-when-absent — never
null (T4: an empty array is a key and a key is a byte).

```
spatialLedgers.commercialReasons   — TR-1, writer commercialReasons.js
  { "<from>><to>": [ { type, magnitude01, receipt, atTick } ] }
spatialLedgers.houses              — TR-2, writer houseLedger.js
  { [factionId]: { books: { holdings, credit, interests[] },
      appetite, credibility, updatedTick,
      dormantSince? } }              // conditional — the rename/eligibility-loss
                                     // latch; drop-when-absent
spatialLedgers.ventures            — TR-7, writer ventureLedger.js
  [ { id, houseId, kind, stakeBand, legs/shipmentRefs,
      departedTick, expectedTick, state } ]
```

NOT new state (the volume's rulings, all re-verified buildable): pacts ride the
treaties artifact (+ the commercial term rows in peaceTermsCatalog.js — S17;
the beneficiary/directional-term field is a GRAMMAR-§4-owned model change TR-5
points at); believed scarcity rides the beliefMap SP-2 family (as a SIBLING
leaf — S41); factor errands ride SP-1's ledger; corner positions are house
book interests over real M6a stocks; grain rides commodityStocks/
supplyShipments + the granary.

**Lifecycle-paths clause (per L4 — lands BEFORE each writer builds):**

- **commercialReasons** — create: per-pair accrual from live state reads, pulse
  cadence; read: consumers via one read module (magnitude bands, never raw);
  persist: JSON-round-trip pinned; **regenerate-under-THE-PROMISE: RE-DERIVED
  from state (the one rebuildable ledger here)** — same seed, same world ⇒ same
  entries; undo/import: round-trip; migrate: none (new key, drop-when-empty; no
  load-time normalizer ⇒ shape discipline pinned AT the writer); veil: casus
  receipts are public except covert-sourced entries (includeCovert); every
  dossier payload builder returns through veilPublicPayload (standing law); a
  settlement's death drops its pairs through the writer.
- **houses** — create: the TR-2 formation rule (eligibility predicate +
  deterministic selection, codepoint tie-break); read: band words only; persist:
  JSON-round-trip (members ARE npcs[] — JSON-alias round-trip mandatory);
  **regenerate: books are event-accrued, NOT re-derivable — regen PRESERVES
  books (the J-TR-3 disclosed exception, second instance of J-WR-3's idiom)**;
  undo/import: round-trip both shapes; migrate: a load-time normalizer LANDS
  WITH THE WRITER (the dormant-with-books shape needs one — rename/eligibility
  loss must round-trip from old saves); veil: covert interests ride
  includeCovert fail-closed upstream; DM rename → dormant-with-books + receipt,
  dissolution → closed through the one writer, never orphaned.
- **ventures** — create: band-crossing trigger through ventureLedger.js only;
  read: state + expected return in band words; persist: JSON-round-trip;
  **regenerate: in-flight ventures PRESERVED (event-accrued)**; undo/import:
  round-trip; shipmentRefs resolve at load or the venture closes `failed` with
  a receipt (no dangling refs — the lifecycle-bug class); migrate: none (new
  key); veil: house-voice news public; DM-KILL of the supercargo closes errand
  `lost` + venture `failed` through their own writers.

**Single-writer enforcement (L4):** each ledger ships a shrink-only source-scan
census over write-capable modules + an EXECUTED third-writer plant (cp backup,
cmp/md5-exact restore — never checkout-family). TR-4 additionally lands the
no-SIXTH-storageMonths-writer source scan fencing S15's five sites.

---

## §4 THE WAVES (dependency order; one commit each; TR-4/TR-8 two slices, one
## commit per slice; focused gates per slice, full gate at wave end, ledger row)

Common to EVERY wave (stated once): the flag work of §2 (manifest + four-fence
+ lit-mutant + by-name read); dormancy golden BEFORE wiring; every authored
file byte-scanned (python3 — the Write-tool NUL class); pathspec commits under
the staged-set law; every load-bearing conjunction gets an executed mutant +
a `mutationCoverageManifest` entry (tests/lint/mutationCoverage.shared.mjs);
new negatives carry `// anchored:`; doc-reading pins assert EXACTLY-ONCE;
every new kind lands WHAT_PHRASES + heraldRouting + its OWN walker file
(envoyNews.js template) in the SAME commit as its first mint; every new module
is a lazy leaf under the 800 effective-line engine ceiling; sizes below are
effective lines measured 2026-08-04 — re-measure with the enforcer Linter at
the publishing commit (S40).

### TR-1 — THE CASUS COMMERCII (`casusCommerciiEnabled`) — buildable today
- **New leaves:** `commercialReasonTaxonomy.js` (~70 eff; the 8 severance ↔
  partnership pairs, REASON_MIRRORS-shaped — warReasonTaxonomy.js:24-60 is the
  shape template, NOT shared code; never import war's tables, J-TR-2);
  `commercialReasons.js` (writer + 8 scorers + amendment-B suppression, ~350
  eff); `commercialReasonsNews.js` (~120 eff, kind joins per L6). Own walker
  file: totality + bijection + suppression-receipt family.
- **Files touched:** simulationRules.js (291 eff — one manifest key + pending
  cert entry); settlementRumors.js (482 eff — WHAT_PHRASES rows);
  tradeWar.js (435 eff — THE ONE T9 SEAM EDIT: the escalation deposit at
  :620-670 gains a severance-magnitude pressure read, gated
  `casusCommerciiEnabled === true` by name; dark ⇒ byte-identical).
- **Pins (from the volume, named):** healthy-partnership-mints-nothing negative
  on generated corpora; bijection walker green without exemptions;
  amendment-B suppression receipt (famine_profiteering vs physically-empty
  stocks ⇒ 0, receipt names the stock read); decay-to-zero on healed state;
  T-7 TELLABLE fixture (nine 52-week years honored → breach mint, Herald
  sentence verbatim, exactly-once); dormancy golden; four-fence + lit-mutant.
- **Mutants:** (1) plant a 9th severance type without mirror ⇒ walker reds;
  (2) sever the suppression conjunct ⇒ suppression pin reds; (3) lit-mutant
  control. All manifest-rowed.
- **Req 13 Alignment:** DECLARED EMPTY with reason — a state-derived zero-RNG
  ledger has no decision surface; posture/alignment enter at consumers.
- **Req 14 Edit-verb story:** DM relationship/market edits re-derive entries
  next pulse (state-derived); settlement deletion drops pairs; no DM-editable
  field carries machine prose (the content-program law).
- **Collision map:** tradeWar.js is WAR substrate (T9) — seam edit only, named
  above; warReasons/warReasonTaxonomy UNTOUCHED; concurrent-lane law on
  simulationRules.js + settlementRumors.js (re-grep after rebase).

### TR-2 — THE HOUSE (`merchantHousesEnabled`) — buildable after TR-1
- **New leaves:** `houseLedger.js` (writer + formation/ruin-latch/rename rules
  + load-time normalizer, ~400 eff); `houseActs.js` (threshold chooser over the
  closed verb set, T4 — import-pinned, ~250 eff); `houseFactorCasting.js`
  (deterministic read-wiring, codepoint tie-break, ~120 eff);
  `houseNews.js` (~120 eff). Reads eligibility ONLY via `factionArchetype()`
  (S26 — rename-sensitivity is real; the rename round-trip pin is mandatory).
- **Files touched:** simulationRules.js, settlementRumors.js (rows).
- **Pins:** T4 no-hidden-governor import pin + guard-the-guard (positive
  control at a legitimate truth reader — e.g. the TR-6 truth census when it
  exists, or supplyKernel); no-micro-agent source scan over the diff; ruin
  reachable from top band (T5 reversal); MAX_HOUSES_PER_SETTLEMENT binds;
  JSON-alias round-trip; writer/reader spelling pin boots the REAL writer;
  rename round-trip (dormant-with-books or closed-with-receipt, never
  orphaned); formation determinism (two eligible, one slot — codepoint decides,
  same-seed identical); no-undead-house cooldown negative; dormancy golden;
  T-4 TELLABLE fixture; four-fence + lit-mutant.
- **Mutants:** hidden-governor plant (relationship-graph import into
  houseActs ⇒ scan reds); cap mutant; ruin-latch mutant. Manifest-rowed.
- **Req 13 Alignment:** ENGAGED, thin — acts are posture-priced (SP-4a house
  instance); no alignment GATE anywhere (T6; the moral pricing arrives TR-6).
- **Req 14 Edit-verb:** DM rename → dormant-with-books receipt; faction
  dissolution → closed entry; books are NEVER DM-editable fields; factor is
  cast, so NPC edits never orphan house state.
- **Collision:** FAITH's tithe executor will READ house books (CPL-7/CPL-12 —
  TR builds a read surface only, §5 seam 9); INT-1 seatBooks absent-not-zero.

### TR-3 — BELIEVED MARKETS (`believedMarketsEnabled`) — BLOCKED on SP-2 (S46)
- **New leaves:** `beliefScarcity.js` (the SP-2 subject-family instance as a
  SIBLING leaf — beliefMap.js is 771/800 and receives NET-ZERO seam lines only,
  S41/Q3; ~300 eff); `dispatchDestination.js` (the WHERE composer — Seam
  Three's whitelisted DISPATCH COMPOSER: believed dearness belief-side,
  needPremium a truth-side NEED read that never touches a scarcity band, ~200
  eff). dispatchEV.js (118 eff) gains the destination-consumer seam.
- **Pins:** dormancy golden (omniscient path byte-identical); K3 structural set
  per consumer (import pin + token scan + guard-the-guard, positive control at
  the truth-side scarcity derivation); the no-merge pin (arithmetic-combination
  token scan + the two-composer whitelist enumerated in FP_TRADE §3 Seam Three
  ONLY); guard-the-guard seeds a deliberate band-average ⇒ scan reds;
  staleness reachable (≥ two bands, receipted); T-1 TELLABLE (came for the
  famine, found the harvest); four-fence + lit-mutant.
- **Mutants:** whitelist widen plant (a third co-importing module ⇒ census
  reds); merge-expression plant. Manifest-rowed.
- **Req 13 Alignment:** DECLARED EMPTY with reason — belief writes/reads carry
  no moral axis; alignment prices arrive with TR-6's observer scaling.
- **Req 14 Edit-verb:** DM truth edits reach belief ONLY through arrivals/rumor
  (news speed — the structural honesty); a DM band override is a truth edit,
  never a belief write.
- **Collision:** SP-2's registry (SPINE) — seam 6; INFO's LURE writes this
  surface THERE.

### TR-4 — THE GRAIN ROAD (`foodCaravansEnabled`; two slices) — buildable today
- **Slice 1 new leaves:** `grainFlow.js` (surplus derivation from the SAME
  harvest/foodLedger truth — one source, two denominations, the derivation
  pin; ~250 eff); `grainArrivalCredit.js` (the lit-only arrivals term:
  units → months via ONE authored GRAIN_UNITS_PER_MONTH, credited through
  `applyFoodDeltasToUpdates` — S16; plus the equal-and-opposite lit-only offset
  netting the stash's import share, computed FROM foodStockpile's :288 stash;
  ~150 eff). **Files touched:** commodityFlow.js (448 eff — grain enters the
  balance; assertGoodsConservation extends for free per J-TR-8);
  foodStockpile.js (253 eff — the offset term joins the :347 sum, own-flag
  gated by name; the generation stash at :288 is NEVER rewritten — GENERATION
  IS SACRED, S8); supplyKernel mount seam (486 eff, own-flag-before-host-gate).
  pulseKernel/applyWorldPulse: ZERO edits (S44).
- **Slice 2:** treaty streams ride caravans — treatyTransfer.js (49 eff) gains
  the lit fork (dispatch as caravans / conserved arithmetic when dark);
  robbery → claim on the I2 reparations-claim shape with the creditor's-picture
  fork (J-TR-6).
- **Pins (slice 1):** dormancy golden (dark ⇒ rate arithmetic byte-identical);
  THE CALM-EQUIVALENCE PIN (within one authored band of the old rate — the
  disclosed lit-path shift, bounded and stated); **the T7 walker LANDS IN THIS
  SLICE** (exactly one of {netted rate share, physical arrivals} live per
  settlement per tick, BOTH flag states); the BYPASS-PRESERVATION pin — three
  arms EACH executed (teleport 0.3 / airshipBesieged 0.15 / underways trickle —
  S14's receipts); conservation with grain rows; grain-months conservation at
  the applicator (units in == months × constant); belief-cannot-starve
  negative; T-6 TELLABLE (siege fixture, week-by-week fall to the physical
  trickle, bounded by wave P's floor) + its open-route negative; four-fence +
  lit-mutant. (Slice 2:) robbery-claim round-trip both belief arms (T-9).
- **Lifecycle (the R9 delegation, discharged honestly):** slice 1 LANDS the
  commodityStocks/supplyShipments serialize→regen→undo→import round-trip pin
  itself (the volume's audit found none exists — do not inherit).
- **Mutants:** T7 both-arms-live plant ⇒ walker reds; offset-severed plant
  (arrivals credited, stash share NOT netted ⇒ calm-equivalence reds — the
  double-count made visible); sixth-writer plant ⇒ source scan reds.
- **Req 13 Alignment:** ENGAGED, one line — the seller-posture export appetite
  (insular holds grain at fair: priced, receipted, never forbidden, T6).
- **Req 14 Edit-verb:** a DM cutting a road on the map changes the food line
  within the season (the dossier round-trip); DM siege toggles run the physical
  arm; the granary stays DM-writable through mutateWorld's existing leg (S15
  site 5) — TR-4 adds no DM verb.
- **Collision:** the applyWorldPulse.js:92-110 second fold is REPORTED to the
  validation chair at build time per T3 — never silently ruled (Q2);
  supplyWebWarfare/tradeWar untouched (T9).

### TR-5 — THE PACT LANE (`tradePactsEnabled`) — BLOCKED on SP-3 + GR-3
- **New leaves:** `commercialTermExecutors.js` (five executors as lazy siblings
  consuming peaceTerms exports — R2; ~300 eff); `tradeDemandTrigger.js` (the
  crossing: believed-dear × salient good × realmPressure01 hunger arm × posture
  — THE DEAD CONSUMER LANDS, S28; ~200 eff). **Files touched:**
  peaceTermsCatalog.js (80 eff → ~110: the five rows — S17's corrected home;
  spelling CANONICAL IN GRAMMAR §4, this program points, never re-derives);
  peaceTerms.js NET-ZERO seam lines only (766/800, S20).
- **THE WR-10 DISCHARGE (same commit, non-optional):** the catalog rows TRIP
  `catalogGrewSinceWr10()` BY DESIGN (S36). This commit therefore also: widens
  the bundle per sovereigntyBundle.js's own header instruction, retires the
  no-growth pins (sovereigntyBundleWr10.test.js:321/:388) per their headers,
  and DELETES the war volume's §3 CR-WR10-B dependency row as that row itself
  instructs. A TR-5 that lands the rows without this discharge is REJECTED.
- **Pins:** below-threshold mints NO proposal (both reachability arms); T-5
  TELLABLE end-to-end (pact forms → delivery lands → realmPressure falls →
  war-motive weight falls; five subsystems, receipts at every link) + the same
  fixture DARK byte-identical; K3 absurdity twin (signed for grain the seller
  no longer has — the mismatch becomes the next grievance); lean-year
  suspension → buyer-belief fork; every term names duration in 52-week years
  with the INTERVAL_WEEKS identity pin (S19); bijection stays green (the family
  extends the CATALOG, not the casus taxonomy); amendment-shaped formation (one
  instrument per pair — proposal AMENDS, minting when absent); dormancy golden;
  four-fence + lit-mutant.
- **Req 13 Alignment:** ENGAGED, one line — proposal/acceptance consume
  postureOf; an insular seat's refused good pact is priced in missed-relief
  receipts.
- **Req 14 Edit-verb:** DM treaty edits ride the treaties artifact's existing
  verbs; a DM-voided pact feeds contract_default exactly as a lived breach
  (the record does not distinguish the pen from the world — receipt names the
  editor); labor_compact stays GRAMMAR's (deferred consumer, recorded).
- **Collision:** peaceTermsCatalog.js is WR-shared substrate — coordinate with
  any WR lane in flight (STOP-and-report on conflict, T9); negotiationPictures
  consumed never duplicated (S33).

### TR-6 — THE CORNER + FAMINE SPECULATOR (`corneringEnabled`) — BLOCKED via TR-3
- **New leaves:** `cornerGate.js` (the INDEPENDENT truth-side supply census —
  denominator never from the house's own interests; ~200 eff);
  `cornerComposer.js` (Seam Three's whitelisted composer: belief motive, truth
  gate, two outputs, no combining expression; ~250 eff);
  `warehouseSeizure.js` (NEW conserved machinery — one writer in the
  commodityFlow family, five-term balance, months only at the one applicator;
  serves BOTH the riot counterforce and the seat's forced sale; ~200 eff);
  `monopolyDwell.js` (share × MONOPOLY_DWELL seasons — INTERVAL_WEEKS-derived;
  ~120 eff); `cornerNews.js` (~150 eff). Moral pricing READS
  spatial/moralDrift.js + moralInstitutionPressure.js (S32 — path resolved,
  nothing rebuilt).
- **Pins:** NO PHANTOM CORNER (independent census negative); corner-at-glut
  impossible (FALSE branch reachability); amendment-B suppression from this
  side; ALIGNMENT NEVER GATES both arms (good house corners and pays
  conscience+credibility+commons; evil pays less morally, equally physically);
  EACH counterforce WINS on its own fixture — five fixtures (arrivals break /
  smuggle undercuts / riot seizes [commonsVoiceEnabled lit — a §2
  precondition] / seat forces sale / carry ruins); warehouse-seizure + forced-
  sale conservation pins; NO PHANTOM MONOPOLY; monopoly reachable-but-rare;
  ENTRY breaks the monopoly via TR-2's formation rule; cornered
  reachable-but-rarest; appetite reversal after ruin; T-2/T-3 TELLABLE pins;
  dormancy golden; four-fence + lit-mutant.
- **Mutants:** self-referential-denominator plant (census swapped for the
  house's own map ⇒ pin reds); combining-expression plant in the composer ⇒
  no-merge scan reds. Manifest-rowed.
- **Req 13 Alignment:** ENGAGED IN FULL — this is the program's moral-pricing
  crown: observer-alignment consequence scaling, the conscience arm, moral
  drift movement; never a gate (T6/J-TR-7).
- **Req 14 Edit-verb:** DM-KILL of the cast factor mid-corner: the factor
  flees to the roster (never engine-killed), the position stands in the books;
  DM stock edits move the truth census next read (state-derived gate).
- **Collision:** commonsVoiceKernel CONSUMED (its header law: no new writer —
  the seizure writer is TR's own leaf); commodityFlow writer-family census
  grows by exactly one (the shrink-only census admits it in the same commit).

### TR-7 — VENTURES (`venturesEnabled`) — BLOCKED via TR-3
- **New leaves:** `ventureLedger.js` (the plan GRAMMAR re-implemented at house
  grain — demographicsPlans.js untouched per its :21 fence, S31/J-TR-12; ~350
  eff); `ventureLegs.js` (M6a/M8 dispatch binding — the road prices duration;
  ~200 eff); `ventureNews.js` (~120 eff).
- **Pins:** stake genuinely at risk (failed venture ⇒ books band falls);
  one-active-venture cap; trigger is a CROSSING not drift; joint-venture split
  + default arm both arms; appetite reversal executed; T-10 TELLABLE (the
  Bardi arc: fortune → failed venture → ruin on ONE fixture, receipts each
  step); DM-KILL closes errand `lost` + venture `failed` through their own
  writers; dangling-shipmentRef closes `failed` with receipt; dormancy golden;
  four-fence + lit-mutant.
- **Req 13 Alignment:** ENGAGED, one line — overreach (staking above posture)
  is priced news; seatBooks colour is ABSENT-not-zero until INT-1 (seam 8).
- **Req 14 Edit-verb:** DM route/map edits reprice legs next tick; DM-KILL as
  pinned above; ventures are never DM-editable rows (receipted state only).
- **Collision:** demographicsPlans.js ZERO edits (the fence); INT-1 seam
  reserved here.

### TR-8 — THE TRAVELING FACTOR (`factorErrandsEnabled`; two slices) — BLOCKED on SP-1
- **Slice 1 new leaves:** `commercialErrands.js` (SP-1 purpose `commercial`;
  kinds {pact proposal/renewal — the TR-5 call-site suppression switch, WR-7a
  idiom verbatim; venture supercargo; fair circuit with ARRIVAL-grade belief
  writes}; K.2 snapshot decays, never truth-refreshed; ~300 eff).
- **Slice 2:** compromised factor (declared vs true purpose on the covert
  seam) + the prize: capture lands in `foreignGuestHold.js` through ITS one
  writer (S34 — consumed, import pin proves no second hold writer); ransom on
  the I2 person-subject claim.
- **Pins:** speed-floor walker extends to commercial errands (every movement
  site through WR-7a's one transit kernel — totality); stale-arrival pin (T-8);
  suppression-at-call-site (lit ⇒ abstract rounds suppressed, dark ⇒
  byte-identical); compromised-factor both arms; capture→hold→ransom→return
  round-trip on war machinery; JSON-alias round-trip; dormancy golden;
  four-fence + lit-mutant.
- **Req 13 Alignment:** ENGAGED, one line — the traitor factor's covert
  purpose is corruption-web material; no alignment gate on dispatch.
- **Req 14 Edit-verb:** DM-KILL closes the errand `lost` through the one
  writer; a DM-freed captive closes the hold through foreignGuestHold's writer.
- **Collision:** WR-7 substrate CONSUMED throughout — any WR lane in flight on
  envoy files is a STOP-and-report.

### TR-9 — TRADE CONVERGENCE INSTRUMENTATION (no flag)
- **New leaves:** `tradeConvergenceContract.js` (contract-first — the
  warConvergenceContract.js template, 820 raw lines, S46; may land any time
  after TR-1; `TRADE_ENDING_KEYS = {fortune, ruin, monopoly, collapse,
  severance, cornered}` CLOSED, owner-settled names); soak observation joins
  (behavioral-observation.mjs realmSelfSufficiency lane ~:856; the
  whole-world-soak honest-empty precedent ~:625-640 — `collapse` reports an
  HONEST PERMANENT ZERO while routeLifecycleEnabled is dark).
- **The Herald debt paid (T-11):** WHAT_PHRASES + heraldRouting rows for the
  five route_* kinds (settlementRumors.js:116; candidate types verified at
  routeNetworkCharter.js:138-141 / routeNetworkDecay.js:123-134) + a TOTALITY
  pin over exactly those five; the 17-module route estate speaks.
- **Certification rows** for all eight flags (converting §2's declared-pending
  entries — Q4); the kind-availability walker enforcing §2's precondition
  table; tickScanBudget lanes for flows/supplyKernel/commodityFlow/
  entrepotKernel + every new TR kernel; house-Gini + corner-envelope +
  pact-mix + endings-share health guards, every window INTERVAL_WEEKS-derived.
- **Pins:** every envelope carries a mutant negative control; non-vacuity gates
  (verdicts require measured evidence); out-of-order lighting reds; T-11
  totality pin. **Declared empty with reasons (req 13/14 discharged the
  volume's way):** no forces, no casting, no posture, no couplings, no dossier
  surface — the auditor audits.
- **Collision:** subsystemRowsWaves.js (363 eff) + settlementRumors.js are
  shared certification/Herald surfaces — pathspec discipline, re-grep after
  every rebase.

---

## §5 SEAM CONTRACTS

### 5a Already-pinned seams this program HONORS (tripwires named)

1. **WR-10 ↔ TR-5, the degradation contract** — tripwire
   `catalogGrewSinceWr10()` (sovereigntyBundle.js:166; pins
   sovereigntyBundleWr10.test.js:321/:388). TR-5's catalog commit executes the
   full discharge (§4 TR-5) or is rejected.
2. **CR-WR10-B, the twin degradation sentence** — Seam One's sentence
   (peace INCLUDED) is byte-equal across both volumes, PIN-6-guarded with a
   uniqueness clause: NO TR edit may mint a SECOND degradation sentence in
   either volume; any Seam One wording change lands in both volumes in one
   commit or reds.
3. **The pact transport seam** — one evaluator, two transports:
   negotiationPictures.js (S33) is CONSUMED; a second terms evaluator anywhere
   is a design defect; the K3 pin-set membership grows by TR-5/TR-8's modules,
   guard-the-guard control stays OUTSIDE the negotiation set.
4. **WR-7b's hold writer** — TR-8 slice 2 consumes foreignGuestHold.js; an
   import pin proves no second hold writer exists after the wave.
5. **The T7 granary fence** — the exactly-one-arm walker lands IN TR-4 slice 1
   and runs in BOTH flag states forever; the five-site storageMonths census is
   shrink-only with an executed sixth-writer plant.

### 5b Pre-pins this program lands TOWARD its unbuilt neighbors (the TR-5
### pattern: pinned from both sides, with a tripwire)

6. **Toward SPINE SP-2 (believed scarcity):** TR-3 pins the subject-family
   name + banded shape from the consumer side; tripwire = a registry-membership
   assertion that reds if SP-2 lands a different family spelling or beliefMap's
   export surface moves. CROSS-PROGRAM NOTE to the SPINE architect: beliefMap
   is 771/800 (S41) — SP-2 must build as a sibling leaf.
7. **Toward GRAMMAR GR-3 (the five term spellings):** canonical in GRAMMAR §4
   (R3); TR-5 lands a TERM_CATALOG membership pin asserting each of the five
   appears EXACTLY ONCE with its GRAMMAR spelling — red on drift from either
   side. Until GR-3 lands, trade_demand runs GR-2's declared dark arm.
8. **Toward INTERIOR INT-1 (seatBooks):** TR-7's venture-appetite books term
   is ABSENT-not-zero until `seatBooksEnabled` exists; tripwire = an
   absence-then-presence pin pair (the reserved line in TR-7's Posture bullet).
9. **Toward FAITH WF-2a/WF-7 (the tithe):** TRADE exports READ-ONLY house
   band reads (booksBandOf-shaped); no TR stream-physics API for external
   consumers, ever (the fp-audit's ownership ruling); tripwire = a consumer
   import census on houseLedger.js that admits FAITH's executor as reader only.
10. **Toward POPULATIONS (the commons + departure memory):** TR-6 consumes
    commonsVoiceKernel's rung reads under its header cohesion law (no new
    effect vocabulary, no new writer — the seizure writer is TR's own leaf,
    fenced by the commodityFlow writer-family census); the gouge's
    diaspora-grade memory is POPULATIONS' surface, TR provides the receipt.
11. **Toward INFO (the LURE):** plants write believed scarcity through the
    EXISTING belief machinery only; TR builds no plant surface; tripwire =
    TR-3's K3 token scan, which reds any truth-side injection road.

---

## §6 OPEN CHAIR QUESTIONS (max 4, each with recommendation)

- **Q1 — Pre-spine partial build?** TR-1, TR-2, TR-4 and TR-9's contract
  module measured buildable against today's tree (§2); TR-3/5/6/7/8 are
  spine-blocked (SP-1/2/3 unbuilt, S46). RECOMMENDATION: hold SPINE §5
  sequencing as ordered; if the owner wants TRADE motion early, authorize
  exactly TR-1 + TR-9's contract module (ledger + contract, no physics, no
  cross-program seams) and nothing further — TR-4 deserves the spine-era soak
  instruments before its calm-equivalence band is proven.
- **Q2 — The applyWorldPulse.js:92-110 second delta fold** (S15; T3 defers the
  ruling to TR-4 build time). RECOMMENDATION: chair pre-rules it
  REPORTED-NOT-DEFECT — it is the banked file's own treaty fold, TR-4 routes
  zero traffic through it, and the sixth-writer scan fences it; carry the
  report row in FABLE_VALIDATION_QUEUE now so TR-4's lane never stalls on it.
- **Q3 — Where does believed scarcity live?** beliefMap.js is 771/800 (S41).
  RECOMMENDATION: rule NOW (feeding the SPINE architect) that SP-2's family and
  TR-3's consumers are sibling lazy leaves; beliefMap gains net-zero seam lines;
  pre-pin the module-set census so relocation can't leave filename-anchored
  pins vacuous.
- **Q4 — Certification-row timing per flag** (the manifest's own comment
  demands a row or declared-pending at join, S38). RECOMMENDATION: each TR wave
  lands its flag with a DECLARED-PENDING entry in the same commit; TR-9
  converts all eight to real rows — certification tracks reality (the WW-A
  precedent on sovereigntyTradeEnabled).

---

*Implementer protocol: DESIGN_WAR_RULINGS_ARCHITECTURE.md §10 verbatim + the
FP_TRADE §10 deltas (two commits for TR-4/TR-8; WHAT_PHRASES + heraldRouting
before first mint; the T7 walker in TR-4 slice 1; J-WR-13's STOP rule on a
fourth census overstatement; CW-0 registry row in the same commit as any
cross-layer read). STOP-and-report on measured blockers is a SUCCESS mode.*
