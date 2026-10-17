# FINDINGS — THE EPOCH (EP: the advance epoch, living futures) — reader seat, FP coherence read, 2026-10-16

**Read:** `volumes-master/DESIGN_FP_ARCH_EP.md`, all 4117 lines. The `volumes/` copy has 4099 lines and differs from master only by the 18-line "ARCHITECTED, NOT BUILT" banner at master L2-19. Line numbers below are MASTER lines unless marked otherwise.
**Also read:** SPINE §1 (L17-110). The fold `DESIGN_FP_ARCHITECTURE.md`: header L25-37, §3 row 63 L544, L583-590, the §4/§5 EP rows L677/L729/L816-828/L913-922/L946/L1377-1430/L2346-2356, the seam row L2720, and the census L3094/L3240-3241. The ruling record `docs/architected-volumes-pending-fold/EP_CHAIR_RULINGS.md` (§1, Q1-Q5, B2, §4.4, §9). Memory `advance-epoch-living-futures-directive.md`. The ODQ by grep (§197, §213, L6970-6982, L7176-7192, L10226-10240, L14560-14566). Board and census `fp-kit-87797a6a-2026-09-23/{FP-ORDER.md, findings/FP-CENSUS-ES-HB-WC-EP.md, findings/LIT-1-MEASUREMENT.md}`.
**Code of record:** `<SP>/master-00b648c9d` (HEAD `00b648c9d`, "Merge pull request #59"). Static reads only. No test was run.
**Evidence class:** every claim is a READ (a quoted line, a file:line, or a test's own text). Anything I reasoned is marked **PLAUSIBLE**.

---

## 1. THESIS

EP is **not** the "advance years" program. Advancing a year already exists and is user-facing: `INTERVAL_WEEKS.one_year: 52` (`src/domain/worldPulse/intervalWeeks.js:11`), offered as "Year" in `WorldMapToolbar.jsx:469`, `CampaignFolder.jsx:322`, `RealmForecast.jsx:24` and `AuspicePanel.jsx:42`. Under the default-on `advanceMultiTick` (`src/lib/flagRegistry.js:88`) a year runs as 52 `one_week` ticks (EP L1024-1029).

What EP does is make the **un-lived future re-drawable**. Each user advance mints a nonce, and that nonce is appended to the pulse root and to the 25 side-channel draws (14 tick-varying, 9 year-keyed, 1 tick-free, 1 display). Undo followed by re-advance then yields a different but coherent future, while lived years keep their draws (the `byYear` FIRST-WINS ledger) and replay stays byte-exact from the recorded nonces. The owner's purpose, verbatim (L265-270): "now he undos and advances time again to see a different plausible history still coherent."

**The DM-felt sentence: none exists, by design.** The epoch is DM/owner-private (§8.2 L3835-3850, "allowlist by construction"), and no Herald line or receipt names it. What the DM feels is that a re-advanced year differs: another succession winner (row 19, L2186-2190) or another city choice (row 23). The only DM-readable text EP plans is EP-5's copy, e.g. `WorldPage.jsx`: *"The same seed always builds the same starting world; the history each table lives from it is their own."* (L3977-3979). EP-5 is NOT STARTED, so that sentence does not ship.

**Judged against "advance a year and read what happened, with receipts":**
- EP does not add the year advance. It makes a re-run of that year different.
- At the year clock, three costs bite that the volume does not state. They are in §6 (S1, S2) and §7: the replay/receipt horizon falls from 80 to 29, the undo ring dies on reload, and a lit forecast mispredicts the year.

---

## 2. STATUS, TRUTHFULLY

**The volume's own claims.**
- Header L2-12: "**ARCHITECTED, NOT BUILT** … `advanceEpochEnabled` … **zero occurrences anywhere under `src/`** … `epochSegment.js` is absent." This was measured 2026-08-14 at `60083174`.
- L33-47: "**LANDING IS NOT SEALING, AND THIS VOLUME IS NOT SEALED.** It is a DRAFT AT ROUND SEVEN … no §9 and no attestation block … ALL FIVE §7 chair questions RULED (Q1=ARM A · Q2=LINEAR-WITH-DISCARD · Q3=ACCEPT-AND-DECLARE · Q4=`advanceEpochEnabled` · Q5 split) … B1=(a) · B2=(a); 4 owner-gated parked rows … 1 recorded deferral."
- L247-257: the seventh pass closes E5 under C1/C2/C3.
- The fold header L33 repeats "EP is a DRAFT AT ROUND SEVEN with no attestation block."

**What the record and the code show.** EP-0 through EP-3 LANDED on 2026-08-16, two days AFTER the banner's measurement. The banner is therefore stale in its central claim. The fold's own census (L946, L3094) and the kit census (FP-CENSUS-ES-HB-WC-EP.md rows 41-46) agree with this.

| wave/unit | volume's claim | board / census | code at `00b648c9d` | verdict |
|---|---|---|---|---|
| EP-0 pure segment + root census | "ARCHITECTED, NOT BUILT" (L4) | LANDED `6e4f9c3de` 2026-08-16 (census row 41) | `src/kernel/prng.js:112` `export function epochSuffix`; `tests/lint/entropyRootCensus.walker.test.js` and `tests/kernel/advanceEpochStreamIdentity.test.js` present | **LANDED.** The banner is stale. |
| EP-1 kernel seam + flag | flag has "zero occurrences" (L6-8) | LANDED `01388030b` + cures `da8207f3e`, `0cf18bed1` (row 42) | `pulseKernel.js:338` `const epochTerm = simulationRules?.advanceEpochEnabled === true ? advan…`; `:352` `createPRNG(…${epochSuffix(epochTerm)})`; `simulationRules.js:241` manifest key; the cert row is in `subsystemRowsVirtual.js:405`, **NOT** in a new `subsystemRowsEpoch.js` (absent) | **LANDED, with J-EP-1 not followed** (see §6 S7). |
| EP-2 fork semantics | (as above) | LANDED `20df088ba` (row 43) | `campaignAdvanceSession.js:403` M2 spread; `:1231-1232` resume three-term; `campaignWorldPulseDeferred.js:124` preview; `forecastRun.js:111` | **LANDED.** The preview is inherit-only (see §5 C1). |
| EP-3A family-1 + ledger + stamp | slice A per G1 | LANDED `9e8ea20bd` (row 44) | `src/domain/advanceEpochLedger.js` (224 lines) with `stampAdvanceEpochYear`, `tickStreamSeedOf`; `pulseKernel.js:362` `worldState = stampAdvanceEpochYear(worldState, epochTerm)`; `spatialUsage.js:348` EXEMPT row | **LANDED.** The accessor signature differs from the volume (§6 S3). |
| EP-3B family-2 `byYear` (Q1 Arm A) | Q1-gated | LANDED `0fa3ac541` (row 44) | `pulseKernel.js:14` import `{ stampAdvanceEpochYear, yearStreamSeedOf }`; `:568` `yearStreamSeedOf(worldState, seasonClock.year, { base: startingWorldState.rngSeed, yearBase: 1 })`; `:608` `rngSeed: seasonSeed` | **LANDED** |
| EP-4 generator-side law | three slices, 2 parked | NOT STARTED (row 45); FP-ORDER pair 7 "EP-4 (slices 2–3)" | `scripts/regen-affordance-manifest.json` and `tests/lint/regenAffordances.walker.test.js` absent. H1 was cured OUTSIDE EP by `9f75594fc` (census row 45), which deliberately KEEPS the `seed` admission | **NOT STARTED.** Slice 1's removal half is refuted by a later ruling. |
| EP-5 promise amendment | lands LAST | NOT STARTED (row 46); FP-ORDER pair 7 "EP-5 LAST" | `landingClaimsParity` still binds the old claim (census row 46) | **NOT STARTED** |
| flag lighting | marketing guard closed until lit in a shipped build (L307-309, §8.3) | LIT-1: "L-DEFAULT kept it dark ('decision (ii) unspent')" (LIT-1-MEASUREMENT.md:291) | key appears only in `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js:241`), in no preset | **LANDED DARK, in every preset.** The guard holds. |
| seal | "NOT SEALED … no attestation block" (L33-35) | EP_CHAIR_RULINGS §1.1: "The volume is a DRAFT … its `_SEALED` filename provably did not come from any chair act" | n/a | **NOT SEALED**, and the memory file's "CHAIR-ATTESTED" is false (§3 below) |
| kernel size | "BANKED PERMANENTLY at 1580" (L1236) + declared +1 (J-EP-11) | ODQ L7187-7189 "kernel ledger SPENT at 1581, +0 enforced" | `scripts/.size-baseline.json:13` `"src/domain/worldPulse/pulseKernel.js": 1581` | **1581 = 1580 + the declared +1.** The volume never records that it was spent. |

**Exactly what is drafted, ruled, owner-said, and sealed:**
- **Drafted (and built):** the whole of §0-§8.
- **Chair-ruled:** Q1-Q5, B1, B2 (EP_CHAIR_RULINGS, 2026-08-06, "Prepared under Opus 5, NOT Fable 5 … FABLE SURVEY OWED") and E5 under C1/C2/C3.
- **Owner-said:** the 08-05 directive verbatim (L265-299) and the standing marketing guard (L307-309).
- **Owner-signed by blanket:** §7a rows 1-3 (header L3760-3765).
- **Escalated to the owner and never answered:** row 4 (the FORCE_RESETTLE tick term), E1 (persist the undo ring) and E3 (DM orders mint fresh). My grep of the ODQ for `pulseUndoStack|undo ring` finds no owner ruling.
- **Sealed:** nothing.

---

## 3. LAWS AND OWNER-SETTLED ITEMS (verbatim; the fold may not re-narrate these)

**The owner, 2026-08-05 (L265-270, = memory file):** "the DM that loved a starting world so much that they go back to it to see a completely different yet plausible history. on our end, we can recreate the exact clicks and determinism to chase bugs, but for them... the user that backtracked because he didn't like the direction based on vibes. now he undos and advances time again to see a different plausible history still coherent."

**The owner, same exchange (L288-289):** "and the same thing for the generator side".

**Memory provenance:** the directive file's heading records "(owner, 2026-08-05, in-chat — 'that is what i want')".

**The design, "chair, accepted by owner in the same exchange" (L272-285).** The amendment to THE PROMISE is OWNER-SIGNED (L286-292):
> a seed is a starting world, forever; a lived history, once lived, forever.

**MARKETING GUARD, "owner, standing" (L307-309):**
> "the same world can tell entirely different histories" becomes TRUE only when this program SHIPS LIT — not claimable in copy before then.

**Laws and binding rules inside the volume:**
- L1-L5, THE EPOCH INVARIANT CHAIN (L957-1003): "DARK ⇒ `epochTerm` IS `null`" … "L3 ∧ L4 ⇒ BYTE-IDENTICAL. Reached by construction."
- The dark contract is FLAG-DRIVEN, not value-driven: §2.3b L872ff and J-EP-9 L3534-3546, "dropping the gate silently is the one refactor this volume forbids by name."
- The per-path dark identity, L1035-1043: "**The claim is never made ACROSS paths**."
- §1.4 L744-753: "absent ⇒ the term is not concatenated at all" and NEVER "absent ⇒ epoch 0".
- §1.5 L755-762: ONE epoch per USER ADVANCE, never per tick.
- §3c L2499-2503: "A pulseHistory entry, once written and committed, is NEVER rewritten."
- The ledger's FIVE laws (L1453-1491), including law 1 "FIRST-WINS, NEVER OVERWRITE — ON `byYear`" and law 5 "`latest` IS PER-TICK AND SELF-INVALIDATING."
- The declared non-invariant, L1493-1525: "`byYear` ROW COUNT ≠ `pulseHistory` LENGTH … THIS IS DESIGN."
- THE DISPLAY-SURFACE RULE (binding), L2185-2196: it "may NEVER read the CURRENT pending epoch".
- J-EP-10, L3548-3558: "⛔ EP DOES NOT ADD A TICK TERM" at FORCE_RESETTLE.
- "A composition with no disposition row is a build STOP" (L373, L2087).
- J-WR-13 STOP (L97-99): "LIVE CODE OUTRANKS EVERY TABLE HERE; navigate by SYMBOL."
- The revision-6 generalized rule, L4092-4096: "for every symbol this volume declares, name (a) where its value comes from, (b) the body that produces it, and (c) the executed pin … a declaration missing any one of them is a build STOP."

**Chair rulings (EP_CHAIR_RULINGS, vetoable):**
- Q1 = ARM A: "Arm A no longer buys a single new line anywhere."
- Q2 = LINEAR-WITH-DISCARD, with its rider ESCALATED (E1).
- Q3 = ACCEPT AND DECLARE the 80 bound. It carries the obligation that "EP-5's promise amendment must not claim unbounded byte-exact replay."
- Q4 = `advanceEpochEnabled`.
- Q5 = LIVING DOOR, signed by the blanket for §7a row 1. The H1 independence clause is chair-ruled.
- B1: report, never delete.
- B2 = reading (a): "a DM order is an ACTION IN THE WORLD; replaying it identically is correct". The volume's premise is REFUTED and the DM door count falls "TWO → ONE".
- E5: closed under C1/C2/C3 (L247-257).

**Not vetoable by the chair:**
- §7a row 4 (FORCE_RESETTLE tick term): "SAME-SEED SHIFT / THE PROMISE" (L3780), the owner's.
- E1 (persist `pulseUndoStack`): owner, persistence shape.
- E3 (B2 reading (b)): owner, new capability.

---

## 4. CROSS-PROGRAM CLAIMS

| # | EP claim (line) | Reads / writes / assumes | Other side | Verdict |
|---|---|---|---|---|
| X1 | Row 24, WR-10's sovereignty buyer race re-rooted (L486, L2172) | reads `worldState.rngSeed` at `sovereigntyMarketStage.js` | code: the re-root is present (census: `tickStreamSeedOf(` in 8 src files) | AGREES (code) |
| X2 | Row 13, the intel-trade year-keyed draw, the IN family (L366, L2252) | re-roots at `generosityKernel.js` RS-3, `yearBase: 0` | code: present (census: `yearStreamSeedOf(` in 9). IN volume grep: SILENT on the epoch | AGREES (code) / SILENT (IN vol) |
| X3 | Rows 6-9, traditions, faith-adjacent (L360-363) | year anchor | WF/FAITH volumes: SILENT | SILENT |
| X4 | Rows 2-5/10-12, roads and sea storms, WY/TR (L357-367) | tick and year anchors | WY volume: SILENT | SILENT |
| X5 | `warTermination.js` synthetic pulseHistory record excluded by identity (§8.1 row 9, L3828-3833) | assumes the shape `{tick, warTerminationReads}` | war volume SILENT; code not re-checked | PLAUSIBLE-AGREES |
| X6 | `spatialUsage.js` EXEMPT row (§8.1 row 10) | writes a manifest row | `spatialUsage.js:348` present | AGREES |
| X7 | Sequencing: EP-1..3 "after the CR-WR10-H discharge … SP-B + SP-B2 + ES-4 landed" (L3343-3349) | assumes SP/ES order | all landed before EP on 08-16 (fold L946) | AGREES (history) |
| X8 | The fold places "**EP-0..EP-4** … immediately after the CR-WR10-H discharge" (fold L917) | — | EP L3361-3364: EP-0 is EARLY-ELIGIBLE and EP-4 "an INDEPENDENT LANE and may interleave anywhere after EP-0" | **DISAGREES** (the fold mis-folds EP item 3) |
| X9 | The fold's canonical model publishes "`spatialLedgers.advanceEpoch = {byYear}`" "EP-3 Arm A ONLY" (fold L729, L816-818 = EP §5 item 2 L3330-3336) | ledger shape | EP §3b.1a L1332-1337: `{ latest, byYear }`, with `latest` in slice A under EITHER arm (G1); code `advanceEpochLedger.js` writes both | **STALE in both the fold and EP §5 item 2** |
| X10 | The fold's seam row 103-112 lists "32 goldens · 27 fixtures · 8 oracle suites · 4 four-fence sets" (fold L2720) | dormancy estate | EP §8.1 row 4 (L3811): "the published 32 · 27 · 8 · 4 set was refuted … **53 goldens · 16 fixtures · 49 oracle suites · 12 four-fence sets**" | **DISAGREES** (the fold carries the refuted count) |
| X11 | HB inherits "the FOURTEEN inherited paths" and "`MAX_HISTORY = 80` advances exactly as epoch replay is" (HB L925, L4183) | the replay horizon | code: a year advance nets the ring to 29 (§6 S1) | **STALE in both EP and HB** |
| X12 | HB quotes the `latest` restore story (HB L4127-4131) and "HABIT VALUES NEVER ENTER A STREAM ADDRESS" | — | EP L3943-3949 | AGREES |
| X13 | EC loops `previewCampaignWorldPulse` with "the inherited epoch" (EC L1660) | the preview's inherited epoch | EP §3c / code `campaignWorldPulseDeferred.js:124`: inherited = `pausedAdvance?.advanceEpoch \|\| null`, so it is null on an unpaused world | AGREES with EP, and inherits EP's defect C1 (§5) |
| X14 | WC cites "`EPOCH_living-futures_round7-snapshot.md` -> 10 rows" (WC L6624, L6655) | EP's seam count | EP §8.1: TEN | AGREES |
| X15 | SPINE §1 req 9: "every mechanism declares its clock … denominated against INTERVAL_WEEKS" (SPINE L67-73) | — | EP declares its grain (per user advance, §1.5) but no INTERVAL_WEEKS clock and no two-timescale echo; its three year derivations use literal `WEEKS_PER_YEAR = 52` (`worldState.js:41`, `intelActs.js:71`) | **SILENT (a req-9 gap, PLAUSIBLE-minor:** EP is substrate) |
| X16 | Every NEW FP mechanism that keys a draw off `worldState.rngSeed` must join the census (walker, L2353ff) | a cross-family obligation | walker grew 22→23 read sites at ENC-3 (`entropyRootCensus.walker.test.js:349`, RS-23 `envoyChanceMeetingStage.js:414` uses `tickStreamSeedOf`). No other FP volume names the obligation (grep `entropyRootCensus\|tickStreamSeedOf` across volumes-master returns 0 outside EP) | **SILENT across all families.** Enforced by the walker, unknown to the designs. |

---

## 5. INTERNAL CONTRADICTIONS

**C1 — The preview and forecast are said to "predict the actual future", yet they cannot hold the epoch the advance will mint.** This is the most load-bearing contradiction.
- The volume says it must work:
  - §3c L2518: the preview must "**INHERIT, NEVER MINT** — it must be threaded the SAME epoch the committed advance would use. Predicting the actual future is its entire job."
  - L2519 says the same of the forecast.
- The volume also says where the epoch comes from:
  - §2.2 L819-826: the advance mints at the store, `const advanceEpoch = epochLit ? (options.epoch || generateSeed()) : null;`
  - J-EP-12 L3598-3612 STRUCK the only persisted home a pending epoch could have had (`current`), on the ground that "the pending epoch is ARGS-BORNE."
- So on an UNPAUSED lit world no pending epoch exists. The preview and forecast get `null`, and the kernel composes the LEGACY stream (`epochTerm = null`), while the Advance button composes a fresh epoch-bearing one. CONFIRMED by read:
  - `campaignWorldPulseDeferred.js:124` `advanceEpoch: previewCampaign.worldState?.pausedAdvance?.advanceEpoch || null`
  - `forecastRun.js:111` `const advanceEpoch = ws.pausedAdvance?.advanceEpoch ?? null;`
- The code comment at `campaignWorldPulseDeferred.js:118-122` names this exact failure as the reason not to mint: "A preview that minted its own would show the DM a future the Advance button then refuses to produce." Not minting produces the same failure.
- §4 EP-2's pin, "preview↔commit agreement from identical state with the same pending epoch" (L2951-2953), is green because the test HANDS both runs one epoch. That is the vacuity class this volume bans.
- **DM consequence when lit (PLAUSIBLE, reasoned from the code):** the Auspice panel's "A year" forecast (`AuspicePanel.jsx:42`, which runs `simulatePendingFuture`) shows one year, and the DM's advance produces a different one.
- **This is not an implementation bug; the directive and the forecast conflict.** A living future cannot be forecast unless the epoch is pre-minted. If it is pre-minted, undo restores the same pending epoch and re-advance replays the same future, which kills the directive unless undo re-mints. An owner question (§11 Q-A).

**C2 — The mandatory negative control.**
- EP-0 charter L2886-2887: "plus the ONE mandatory negative control (`personaSlicer.js`'s entity-seeded `rngSeed:` key must NOT match)".
- §3b.2a L2040-2061 (T6) and L2373-2381 make `economyReconciliation.js` (NC-1) the MANDATORY control and `personaSlicer.js` the WEAK secondary one.
- The code agrees with T6 (`entropyRootCensus.walker.test.js:182-185`).

**C3 — J-EP-11's heading versus its body.**
- Heading L3560: "**EP-3 SLICE B BUYS ONE LINE ON `pulseKernel.js`**".
- Body L3584-3586 (G1): "EP-3 SLICE A budgets ONE new import line." The heading was never amended.

**C4 — J-EP-12 versus §3b.1a.**
- J-EP-12 L3599-3600: "**The ledger is `{ byYear }` only.**" (present tense, unannotated).
- §3b.1a L1332-1337 has the ledger as `{ latest, byYear }`, and `latest` is written under EITHER arm (G1).
- §5 item 2 (L3330-3336) publishes the stale `{byYear}` into the fold.

**C5 — The DM doors: TWO versus ONE.**
- §3b.1b L1871-1879, J-EP-15 L3659-3663 and §7b B2 L3791/L3796 all state TWO DM doors (`mintRealmVerbProposal` and `applyWorldPulseProposal`).
- The volume's own C1 pointer (L3020-3029) acknowledges the pin was "VACUOUS".
- EP_CHAIR_RULINGS B2 refutes the count: "`mintRealmVerbProposal` composes **no seed at all**"; "The DM door count is ONE, not TWO, everywhere."
- The §7b table still presents B2 as an open question built on the refuted premise.

**C6 — The flag row number.**
- §5 L3297-3300: "Post-fold flag count = 52, and EP's row is **53** — that arithmetic is MEASURED-AT-BOTH-ENDS and survives."
- §5 item 1 L3313: "row 63, THE LANDED ROW."
- The fold L544 confirms 63, so the L3297 sentence is false in the present tense.

**C7 — The replay horizon is "80 ADVANCES".**
- §3d L2631 and Q3 L3726 bound replay at "the newest 80 advances."
- §1.5 L755-762 itself says a year advance runs 52 ticks into a ring capped at 80, and the volume never composes the two facts. See §6 S1 for the code refutation.

**C8 — The banner versus its own body.**
- Banner L8 names `epochSegment.js`, a module the volume never charters. Its function is `epochSuffix` in `prng.js` and its leaf is `advanceEpochLedger.js`.
- The banner is a phantom name and a stale measurement (§2).

**C9 — The promotion note's head is a placeholder.** L3253: "re-counted at `%(head)s`". The landing lane's template stamp was never rendered.

---

## 6. STALE PREMISES (checked against `00b648c9d`)

**S1 — The replay and receipt horizon is not 80 at the year clock. CONFIRMED by test text, read and not executed.**
- `tests/domain/historyRingCollapse.test.js:150` is titled 'a one_year advance on a saturated ring still leaves exactly one interval record'. Line `:159` reads "52 appended, collapsed to 1 ⇒ ring nets to 80 - 51 = 29."
- The mechanism is in the `advanceInterval.js:132-137` docblock: "The one-week kernel slices its ring to MAX_HISTORY=80 every tick … an interior tick appends AND evicts."
- The consequence for EP (PLAUSIBLE, arithmetic from the code):
  - Every year advance keeps at most 28 earlier records.
  - A DM who advances only by years has a replayable horizon of **29 advances**, not 80.
  - SPINE L734-737 says the cause walk prints UNRECEIPTED_HOP "an earlier cause" for "a receipt aged past MAX_HISTORY=80", so receipts age out about 2.7× faster at the year clock.
  - `provenanceKernel.js:309-312` retains a removed row "when any surviving/manual row reaches it as an ancestor", which mitigates part of this.
- This refutes EP §3d L2631, Q3 L3726, the ruling's Q3, and HB L4183's inheritance of the figure.

**S2 — The headline user story dies on reload. CONFIRMED.**
- `campaignWorldPulseSlice.js:16`: "`pulseUndoStack` state (NOT persisted; a reload clears it)."
- `PULSE_UNDO_CAP = 10` (`pulseUndoCap.js:32`).
- The volume flags this (§3c row 1 L2508 and the Q2 note L3721-3725), and the ruling escalated it as E1: "If the undo ring dies on reload, the headline user story dies on reload".
- No owner ruling exists. EP-0..3 shipped, and the directive's verb ("he undos and advances time again") is still reachable only within a session.

**S3 — The accessor argument was renamed `base`, not `absent`. CONFIRMED.**
- The volume says `tickStreamSeedOf(worldState, { absent })` (L1806-1811, §3b.3 L2479-2483) and `yearStreamSeedOf(worldState, year, { absent, yearBase })`.
- The code has `tickStreamSeedOf(worldState, { base })` and `yearStreamSeedOf(worldState, year, { base, yearBase })` (`advanceEpochLedger.js:160, :213`).
- The leaf's own header at `:133-138` says: "`base` IS THE SITE'S OWN COERCION, HANDED IN … THAT IS A CORRECTION TO THE VOLUME'S SKETCHED SIGNATURE … the volume's `{ absent }` shape … cannot do it for five of the six sites."
- Pulse call site: `pulseKernel.js:568` `{ base: startingWorldState.rngSeed, yearBase: 1 }`, versus the volume's `{ absent: undefined, yearBase: 1 }` (L3002-3004).
- The volume was never amended. ODQ L7180-7183 deferred the §2.3b/§3b.1b amendments "to the docs act".

**S4 — "TWENTY-TWO read sites … SIXTEEN modules" is out of date. CONFIRMED.**
- The walker asserts "the roster is exactly the twenty-three dispositioned sites" with "22 → 23 at ENC-3 (2026-09-03): RS-23, the chance-meeting stage's own seed read" (`entropyRootCensus.walker.test.js:348-350`).
- It also asserts "modules composing a root" `.toBe(15)`, with the comment "THE VOLUME SAYS SIXTEEN MODULES AND THE MEASURED FIGURE IS FIFTEEN" (`:673-676`).
- The volume states 22 and 16 at L334-336, L350 and L2001, and in the closing record.

**S5 — The top banner "ARCHITECTED, NOT BUILT … zero occurrences" (L2-12) is stale. CONFIRMED.** EP-0..3 landed on 2026-08-16 (§2 table). `advanceEpochEnabled` is read at `pulseKernel.js:338` and `campaignAdvanceSession.js:672`.

**S6 — "BANKED PERMANENTLY at 1580" (L1236). CONFIRMED moved.** The baseline is 1581 (`.size-baseline.json:13`), which is the J-EP-11 +1 spent. The ODQ L7187-7189 says "kernel ledger SPENT at 1581, +0 enforced". The volume still invites a builder to "never inherit the 1580 figure" (L1287) without saying it was spent.

**S7 — J-EP-1's new lane `subsystemRowsEpoch.js` (L807-811, L3446-3452) was not built. CONFIRMED.** The row lives in `subsystemRowsVirtual.js:405`, and the census row 42 says "That was not followed". `subsystemRowsVirtual.test.js` is in the epoch file list, so the frozen-eight trap was edited, not avoided.

**S8 — EP-4 slice 1 (H1), "remove `seed` from `CONFIG_PATCH_EXTRA_KEYS`" (L3201-3215), is refuted as a plan.**
- Per census row 45, H1's live break was cured outside EP by `9f75594fc` (2026-09-16, `delete birthInputs.seed`).
- That commit "deliberately **keeps** `seed` admitted ('pruning it would change saved-config loads … a product call')".
- The removal half is therefore a reversed decision, owned by whoever made that "product call".

**S9 — The B2 / J-EP-15 premise is refuted (see C5).** EP_CHAIR_RULINGS B2, measured at `cbd348a5`: `mintRealmVerbProposal` routes through the `applyMode === 'proposal'` `continue`, so it never reaches `applyRealmVerbOrder`.

**S10 — The fold's seam row carries the refuted dormancy counts.** See X10: fold L2720 has 32/27/8/4 against EP's own 53/16/49/12.

**S11 — The memory file claims an attestation that does not exist.** `advance-epoch-living-futures-directive.md` reads "✅ ARCHITECTED COHESIVE — CHAIR-ATTESTED after SIX adversarial rounds". EP_CHAIR_RULINGS §1.2(g) says "A document is not sealed because a memory file says so." The memory row is stale (a memory-keeper correction, not a volume edit).

**S12 — The premises still hold, verified.**
- `MAX_HISTORY = 80` (`worldState.js:16`, applied at `:599` and `:798`).
- `INTERVAL_WEEKS` = 1/4/13/52.
- The root composition at `pulseKernel.js:352`.
- Seam edit 9 at `:362`.
- `advanceMultiTick: true` (`flagRegistry.js:88`).
- `forkSeedFor` is still a pure function of (sample, forker) (`sampleSettlements.js:210-214`). Its suffix is now the whole `forkerId`, not `.slice(0, 8)` as the ruling quotes, which is immaterial.
- `collapseIntervalHistory` composes by spread (`advanceInterval.js:207-214`).

---

## 7. THE CLOCK AND THE TIER

**The epoch's own clock.** The epoch's grain is the USER ADVANCE (§1.5), not a cadence, and every interval inherits it. The year anchor (`byYear`) is a YEARLY-clock object (FIRST-WINS per calendar year). `latest` is per-tick. All of EP is ASPATIAL: no spatial canon and no lit preset is needed, and LIT-1 reports `RUN` in all seven presets (LIT-1-MEASUREMENT.md:101). The flag is dark everywhere.

| mechanism | clock / dwell | aspatial? | where the felt drama lives |
|---|---|---|---|
| Pulse-root epoch (EP-1) | per advance; varies every tick's draws | yes | **re-advance of any interval.** Felt most at season/year, where enough ticks pass for divergence to show. PLAUSIBLE: a one-week re-advance mostly re-draws the same quiet week. |
| Family-1 re-roots (succession `tieBreak`, demographic response, sovereignty buyer, roads hazards, realm verbs) | tick-varying; the outcomes resolve over seasons and years | yes | **seasonal/yearly.** A succession contest or a city's "rest of a campaign" response (row 23) resolves on long clocks. |
| Family-2 year anchor (weather severity, traditions, road cadence, intel trade, ladder support) | **yearly** (FIRST-WINS per calendar year) | yes | **yearly**: "a DM re-advancing a decade sees the same winters" is the Arm-B tell (L2293-2296) that Arm A removes |
| Display rule (mapDress, cause walk) | view time over lived state | yes | n/a (it must NOT move) |
| Pause/resume cursor (M2) | within one advance | yes | invisible |
| Undo ring | session; cap 10 | yes | **dies on reload** (S2). A DM who advances a few weeks per session and comes back next week cannot backtrack last session's advance. |
| Generator-side doors (EP-4) | per click | yes | immediate (generation), NOT STARTED |

**The flag:**
- **Every family-1/2 mechanism's drama lives at the seasonal or yearly clock.** That fits the chair's thesis that years are the product's answer.
- **But EP's value is only felt by a DM who undoes and re-advances in the same session.** The persisted undo ring (E1) is the unbuilt half of the epoch's felt value, not an aside.
- **At the year clock, each advance costs 51 history slots** (S1), so the receipts a DM reads after re-advancing a year are thinner than after a month.

**Performance (PLAUSIBLE, from the code reads; nothing was measured):**
- The lit cost per tick is one extra `setSpatialLedger` world spread plus one small object (law 2, L1462-1474). A year advance therefore costs about 52 extra shallow spreads.
- The epoch adds no draws and does not change draw order (`advanceEpochForkParity.test.js` compares the fork-label sequence lit vs dark, per `subsystemRowsVirtual.js:446`).
- Determinism cost: "Every user advance draws a fresh random nonce, so same-seed replay of the future ends for every world born into the preset" (LIT-1-MEASUREMENT.md:291 (d)). This is the directive working as intended, but it ends the "same seed, same future" property the dormancy estate leans on. Lit soaks must thread `soakAdvanceEpoch` (`tickOpBudget.test.js:203`, ODQ §213 ruling (a)).

---

## 8. DEPTH VS FELT VALUE

| mechanism | what a DM sees | judgment |
|---|---|---|
| EP-1 root epoch + flag + store mint (landed) | a re-advanced interval differs | **KEEP.** Built, dark. It is the directive's core. |
| EP-2 fork semantics: cursor M2, resume re-thread, catch-up/surveyor MINT (landed) | nothing (correctness) | **KEEP** (built) |
| EP-2 preview/forecast INHERIT (landed) | under lit, an Auspice "A year" forecast that does not match the advance | **KEEP the law, but it is incoherent under lit (C1).** Before lighting, owner/chair must choose: pre-mint a pending epoch, or relabel the forecast as "a plausible year". |
| EP-3A family-1 re-roots (landed) | a different succession winner or city choice on re-advance: the actual felt drama | **KEEP** |
| EP-3B `byYear` anchor (landed) | lived winters hold; un-lived ones re-draw | **KEEP** (built; Q1 ruled) |
| Census walker + 9 positive / 2 negative controls + two baselines (landed) | nothing | **KEEP as an instrument.** In the volume, **CUT-TO-SENTENCE** the 300+ lines of R1-R13 revision archaeology (L345-650, L89-241) to a pointer. The walker file IS the record now. |
| Five fences + fence 5 + four-mutant matrices ×2 (§2.5, §3b.1a, §3b.1b) | nothing | **CUT-TO-SENTENCE in the volume.** They are built and pinned in `tests/property/advanceEpochDormancyFence.test.js` and `tests/domain/advanceEpochStampSurvival.test.js`. About 900 lines of spec now duplicate executed tests. |
| EP-4 slice 1 H1 | — | **CUT.** Cured outside EP (`9f75594fc`); the removal half reverses a later product call (S8). |
| EP-4 slice 2 (A3 instant-world reroll, H7 world-map regen) behind the flag | "Generate" gives a new realm each click | **KEEP but DEFER.** It rides the same flag; it lands only when the flag lights. |
| EP-4 slice 3 (H4 door swaps + affordance walker) | none (same freshness) | **FOLD** H4's two door swaps into any generator-hygiene lane; the walker is DEFER |
| EP-5 promise amendment (45 homes) | the copy | **KEEP, at lighting time only.** It is the marketing guard's release. It must carry Q3's bound, and S1 says the bound is 29 at the year clock. |
| **Persisted undo ring (E1, outside EP)** | the DM can backtrack after reload | **The highest felt value per line in this family; not chartered anywhere.** The owner's decision. |
| §7a row 4 (FORCE_RESETTLE tick term) | invisible until a second resettle | **DEFER**; the owner's. |

---

## 9. VOCABULARY (closed ladders and enums EP mints)

- **Composition classes** (walker clause 3, L2390-2395): {TICK-VARYING, YEAR-KEYED, TICK-FREE, DISPLAY, OUT-OF-DENOMINATOR}.
- **Families:** "family 1" (tick-varying, nonce-safe) and "family 2" (year-keyed, nonce-hostile) (L2093, L2235).
- **Materializations M1 / M2 / M3** and chain links **L1-L5** (L962-1003). ⚠ **HOMONYM:** the FP fold's §1 laws are also numbered L1-L9 (EP L62, "§1 laws L1-L9") and the fold has an L10 (THE EDITOR). EP's chain links L1-L5 collide by name.
- **Affordance dispositions** (§3e): ALREADY-COMPLIANT · NEEDS-FRESH-DRAW · NEEDS-EDIT-PRESERVATION · NOT-APPLICABLE. The struck one is NON-SANCTIONED-DOOR.
- **Manifest row types** (L2843-2846): `mints` | `address` | `non-prng` | `deferred-with-reason` | `owner-gated`.
- **Doors:** "ADDRESS door" / "LIVING door" (L294-296, Q5).
- **Read-site ids:** RS-1..RS-22, and RS-23 in code. **Negative controls:** NC-1, NC-2. **Rows:** A1..A18, H1/H4/H5/H7, B1/B2, J-EP-1..15, R1..R13, plus the revision rulings P1-P9, T1-T6, F1-F8, G1-G4, C1-C3, E1-E5.
  - ⚠ **HOMONYM:** EP's C1-C3 (round-7 conditions) and E1-E5 (escalations) collide with other families' "C1"/"E1" ids. My own section uses C1-C9 for contradictions; the chair should prefix them `EP-C1`.
- **"epoch":** ⚠ **A MAJOR HOMONYM.**
  - ODQ §240 "OWNER LAW: EPOCH GENERATION — CORE, WALL, RING" (ODQ L8555-8596) uses "epoch" for town-map construction eras ("the version/epoch axis", MF-ARCH-2).
  - Memory has `stamped-vintage-collapses-the-epoch-ladder.md`.
  - ODQ L15526 already has to disambiguate: "the advance-epoch ledger is the sim stamp, not a construction date."
  - The fold should always say "advance epoch" for EP.
- **Flag:** `advanceEpochEnabled`. **Ledger key:** `spatialLedgers.advanceEpoch = { latest: {tick, epoch}, byYear: {year: epoch} }`. **Record field:** `pulseHistory[].epoch`. **Cursor field:** `pausedAdvance.advanceEpoch`.

---

## 10. REFINEMENTS (in-place, dated-bracket idiom; no law rewritten)

1. `[EP:2-12]`
   - Current: "This volume is **ARCHITECTED, NOT BUILT** … zero occurrences anywhere under `src/`"
   - Insert before L2: `[CORRECTED 2026-10-16 (coherence fold) — STALE BY EVENT: EP-0 6e4f9c3de, EP-1 01388030b, EP-2 20df088ba, EP-3A 9e8ea20bd, EP-3B 0fa3ac541 LANDED 2026-08-16, DARK in every preset; EP-4 and EP-5 NOT STARTED. The 08-14 measurement below is history. 'epochSegment.js' was never a chartered module (the function is prng.js#epochSuffix, the leaf advanceEpochLedger.js).]`
   - Reason: S5, C8.
2. `[EP:33-35]`
   - Current: "THIS VOLUME IS NOT SEALED … DRAFT AT ROUND SEVEN"
   - Append: `[CORRECTED 2026-10-16 (coherence fold) — still NOT SEALED and now also BUILT (waves 0-3): the draft is the spec of landed code, and where they differ the code's in-file corrections govern (advanceEpochLedger.js:133-138 'base', not 'absent'). The memory row calling this CHAIR-ATTESTED is false (EP_CHAIR_RULINGS §1.2(g)).]`
   - Reason: S3, S11.
3. `[EP:1236]`
   - Current: "BANKED PERMANENTLY at 1580 effective lines"
   - Append: `[CORRECTED 2026-10-16 (coherence fold) — the J-EP-11 +1 was SPENT at EP-3A: the baseline reads 1581 (scripts/.size-baseline.json; ODQ 'kernel ledger SPENT at 1581, +0 enforced'). Any further kernel line is a new chair-signed ratchet.]`
   - Reason: S6.
4. `[EP:1806-1811, 2479-2483, 3002-3004]`
   - Current: `tickStreamSeedOf(worldState, { absent })` / `{ absent: undefined, yearBase: 1 }`
   - Bracket at each: `[CORRECTED 2026-10-16 (coherence fold) — AS BUILT the accessors take { base } (the site's OWN coerced seed, handed in) and { base, yearBase }: the { absent } sketch could not reproduce five of six coercions (advanceEpochLedger.js:133-138). §3b.3's per-site fidelity law is met by construction at the call site.]`
   - Reason: S3. This is the ODQ L7180-7183 "docs act" that never came.
5. `[EP:334-336, 350, 2001]`
   - Current: "TWENTY-TWO runtime READ SITES … SIXTEEN modules"
   - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — the walker is the record: 23 read sites (RS-23 envoyChanceMeetingStage.js, ENC-3 2026-09-03) and 15 composing modules (entropyRootCensus.walker.test.js:348-350, :673-676).]`
   - Reason: S4.
6. `[EP:2631 and 3726]`
   - Current: "THE REPLAY HORIZON IS BOUNDED AT 80 ADVANCES"
   - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — 80 RECORDS, not 80 advances: a one_year advance appends 52 into the 80-ring before collapsing to 1, so the ring nets to 29 (historyRingCollapse.test.js:150-159). A year-cadence DM's replay and receipt horizon is ~29 advances; EP-5's replay sentence and HB L4183 must carry this figure.]`
   - Reason: S1, C7, X11.
7. `[EP:2518-2519]`
   - Current: "INHERIT, NEVER MINT — … Predicting the actual future is its entire job"
   - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — UNSATISFIABLE ON AN UNPAUSED LIT WORLD: no pending epoch exists (minted at advance time, J-EP-12 struck its persisted home), so preview/forecast compose the legacy stream while the advance composes a fresh one (campaignWorldPulseDeferred.js:124, forecastRun.js:111). EP-2's agreement pin hands both runs one epoch and cannot see this. Ruling owed before the flag lights (findings EP §11 Q-A).]`
   - Reason: C1.
8. `[EP:2886-2887]`
   - Current: "the ONE mandatory negative control (`personaSlicer.js`'s …)"
   - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — superseded by T6: the MANDATORY control is NC-1 economyReconciliation.js; personaSlicer.js is the WEAK secondary (§3b.2a; walker :182-185).]`
   - Reason: C2.
9. `[EP:3560]`
   - Current: "J-EP-11 — EP-3 SLICE B BUYS ONE LINE"
   - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — SLICE A bought it (G1/J-EP-14); the body below already says so.]`
   - Reason: C3.
10. `[EP:3599-3600]`
    - Current: "**The ledger is `{ byYear }` only.**"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — superseded by G1: the ledger is { latest, byYear }, latest written under EITHER arm (§3b.1a). J-EP-12's strike of `current` stands.]`
    - Reason: C4.
11. `[EP:3330-3336]` (§5 item 2) **and** `[FOLD:729, 816-818]`
    - Current: "`spatialLedgers.advanceEpoch = {byYear}`" … "EP-3 Arm A ONLY"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — { latest, byYear }; latest + the writer + the EXEMPT row are SLICE A (either arm); byYear is Arm A (ruled, built 0fa3ac541).]`
    - Reason: X9.
12. `[EP:1871-1879, 3659-3663, 3791-3796]`
    - Current: "two of the others (`mintRealmVerbProposal`, `applyWorldPulseProposal`)" / "THIS TABLE'S OWN COUNT IS TWO"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — REFUTED (EP_CHAIR_RULINGS B2): mintRealmVerbProposal composes no seed (the 'proposal' continue); ONE DM door, applyWorldPulseProposal. B2 is RULED reading (a); reading (b) is owner escalation E3.]`
    - Reason: C5, S9.
13. `[EP:3297-3300]`
    - Current: "EP's row is 53 — that arithmetic is MEASURED-AT-BOTH-ENDS and survives"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — HISTORY; the landed row is 63 (item 1; fold §3 L544).]`
    - Reason: C6.
14. `[EP:3253]`
    - Current: "re-counted at `%(head)s`"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — unrendered template; the promotion banner L54 names eca65c8a.]`
    - Reason: C9.
15. `[EP:3446-3452]` (J-EP-1)
    - Current: "EP CERTIFIES IN ITS OWN LANE … `subsystemRowsEpoch.js`"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — NOT FOLLOWED at EP-1: the row landed in subsystemRowsVirtual.js:405 and that file's test was edited; no subsystemRowsEpoch.js exists.]`
    - Reason: S7.
16. `[EP:3201-3215]` (EP-4 slice 1)
    - Current: "remove `seed` from `CONFIG_PATCH_EXTRA_KEYS`"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — H1's break CURED outside EP (9f75594fc, 2026-09-16) and the admission deliberately KEPT as 'a product call'; slice 1's removal half is withdrawn unless that call is reversed.]`
    - Reason: S8.
17. `[EP:2508 / 3721-3725]`
    - Current: "`pulseUndoStack` is SESSION-ONLY … flagged, not decided here"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — ESCALATED as E1 (EP_CHAIR_RULINGS §9) and still UNANSWERED; confirmed at 00b648c9d (campaignWorldPulseSlice.js:16). Until ruled, the directive's undo-and-re-advance story holds within a session only.]`
    - Reason: S2.
18. `[FOLD:917]`
    - Current: "**EP-0..EP-4** land immediately after the CR-WR10-H discharge"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — EP §5 item 3: EP-0 EARLY-ELIGIBLE; EP-1..3 after CR-WR10-H (all LANDED 08-16); EP-4 an independent lane whose slice 2 may not light before EP-1; FP-ORDER pair 7 now carries EP-4 slices 2-3 ‖ EP-5 LAST.]`
    - Reason: X8.
19. `[FOLD:2720]`
    - Current: "(32 goldens · 27 fixtures · 8 oracle suites · 4 four-fence sets)"
    - Bracket: `[CORRECTED 2026-10-16 (coherence fold) — refuted by EP §8.1 row 4: 53 · 16 · 49 · 12 at the EP-F round; re-derive at any re-use.]`
    - Reason: X10.
20. `[EP:after L4117, a new closing line]`
    - Insert: `[CORRECTED 2026-10-16 (coherence fold) — CUT-TO-POINTER candidate: §0.3 R1-R13 and the header revision blocks L89-257 are revision archaeology for waves now landed; the walker and fence files carry the executed record.]` The chair may fold these to a 10-line pointer.
    - Reason: §8 depth.

---

## 11. OPEN QUESTIONS FOR THE OWNER (only what is his)

- **Q-A, the living future versus the forecast** (C1; it is new capability either way, and the Auspice is a DM-facing surface).
  - (a) **Pre-mint:** each advance also mints and persists the NEXT pending epoch, so the forecast, preview and Advance share it, and undo re-mints. That is a new persisted field (persistence shape) and partly revives J-EP-12's struck `current`.
  - (b) **Relabel:** under the lit flag the forecast/Auspice says it shows "a plausible year, not the year", with copy and no state.
  - (c) **Keep the forecast dark-only:** the Auspice is unavailable while the flag is lit.
  - Must be ruled before `advanceEpochEnabled` lights.
- **Q-B, persisting the undo ring (E1)** — persistence shape, plus a 2-4 MB upsert cost per the ruling. Without it, the directive's own sentence works only within a session. The ruling's cheaper alternative is to persist only the newest one or two entries.
- **Q-C, the horizon at the year clock** (S1). Should a year advance be allowed to evict 51 history records, so the ring nets to 29? Options:
  - accept and declare it;
  - raise the cap for collapsed intervals (persistence size);
  - collapse BEFORE eviction, so a year costs one slot (a ring-policy change on a persisted array; this touches every family's receipts, not just EP).
- **Q-D, lighting `advanceEpochEnabled` at all.** It ends same-seed future replay for every world born into the preset (LIT-1 (d)), and it unlocks the parked marketing claim. Lighting is the owner's act (L-DEFAULT "decision (ii) unspent"; the §8.3 gate).
- **Q-E, §7a row 4: the FORCE_RESETTLE tick term** (a same-seed shift on shipped saves, recorded golden shift). Escalated as E2 and never answered.
- **Q-F, E3: should DM orders mint fresh** (B2 reading (b))? New capability. The chair ruled (a) and recorded the path.
- **Q-G, EP-4 slice 1's removal half** (S8): only if the owner wants to reverse `9f75594fc`'s "product call" to keep `seed` admitted.
