# D-FOLD-r1 — DISPOSITION LOG for the coherence fold, the spine §1 and CN, P3 round 1 (lane D-FOLD-r1, chair a73343ed; seat Opus 5.5; started 2026-10-18 01:41 EDT by `date`)

Status: DONE 2026-10-18 05:4x EDT — 33 of 33 disposed: CURED 33 · REFUTED 0 · STOP 0 · NOTED 0; insertions-only proof PASS (§6). Findings in scope: SEAMS-r1-1, -5, -6, -11, -15, -16, -17, -19, -20, -21, -22, -23 and HOST-r1-1, -2, -3, -4, -5, -6, -7, -8, -9, -12, -13, -14, -15, -16, -17, -18, -21, -23, -25, -26, -27 (33 ids). Files owned: `docs/DESIGN_FP_COHERENCE_FOLD.md`, `docs/DESIGN_FP_SPINE.md`, `docs/DESIGN_FP_ARCH_CN.md` (all INSERTIONS-ONLY: the fold is on master; a cure is a dated bracket beside the row). Probe dir: `cure/D-FOLD-r1-probe/` (pre-round copies `FOLD.before-r1.md`, `SPINE.before-r1.md`, `CN.before-r1.md`, taken 01:41 EDT). No git, no test suite.

## Progress
- 01:41 EDT: orientation reads done (README, COMPILE-COMMON, DISPOSE, OWNERSHIP, the five rulings files in order, cure/L-FOLD, skeptic SEAMS-r1 and HOST-r1 whole, BOARD, the sibling lanes' fold asks in D-CH/D-MN/D-RN-r1). Snapshots taken.
- 01:41–02:0x EDT: measured (§1 below), read the fold whole (§9.1–9.4 by skim), the spine §1 whole, CN's cn-5 brackets, the host document's cited rows, and the sibling volumes' current text for every cross-reference (PL/MN/RN/CH cured in round 1; PT not yet). Dispositions planned; insertion script next.
- 05:15–05:35 EDT (the seat RESUMED after the 5-hour limit killed it at ~01:54; the owned files were byte-identical to the 01:41 snapshots, so nothing had been inserted): re-read the rulings incl. RULINGS-ROUND1's ADDENDUM (05:1x — it rules SEAMS-r1-1, -2, -3, -6, -19 and HOST-r1-1, -2, -7), the sibling lanes' fold asks (D-PL/D-MN/D-RN/D-CH §§4–6), the cited host-document rows, and the cured volumes' current text; re-verified M3/M4 and the canonize gate's function (`canonizeCampaignWorldSpatial`); token census `D-FOLD-r1-probe/tokens-r1.out` (pure-Python, `tokens_r1.py`). Insertion script next.
- 05:35–05:4x EDT: anchored insertions written by `D-FOLD-r1-probe/apply_r1.py` (+ `texts_r1.py`, second pass `texts_r1b.py`); fold +158 lines, spine +2, CN +1, zero deletions; proof `D-FOLD-r1-probe/proof_r1.py` → `proof_r1.out` PASS; every id checked present in the fold body and in §9.6's round-1 table (script).

## 1. MEASURED FIRST (code of record: the detached master worktree `master-81f1cd963`, read-only)
| # | Question | Receipt | Verdict |
|---|---|---|---|
| M1 | Does a freshly born campaign carry the default preset's switches? (BOARD host ruling (4); HOST-r1-2) | EXECUTED `D-FOLD-r1-probe/bornRules.mjs` → `bornRules.out.json`: `simulationRules.js :: newCampaignSimulationRules()` (the one birth reader, called by `worldState.js :: createNewCampaignWorldState`) returns `presetId: 'realistic_regional'` while 23 keys that preset lights are absent (`pactFormationEnabled`, `faithUnseatingEnabled`, `disastersEnabled`, `commodityFlowEnabled`, `roadsEnabled`, `traditionsEnabled`, `npcLadderEnabled` …); `NEW_CAMPAIGN_SIMULATION_PRESET_ID = null`; an instant world applies its tone preset (`composeInstantWorld.js :: applyTonePreset`, fallback `realistic_regional`) | CONFIRMED (executed). OD-EC-5 (owner-ruled, ODQ §934.90 addendum 1) is the cure already ruled |
| M2 | The premium gates (HOST-r1-2) | `campaignWorldPulseSlice.js:391` `if (state.auth?.tier !== 'premium') return { ok: false, reason: 'not_entitled' };` · `campaignSlice.js:586` `const canCreate = current.auth?.tier === 'premium' \|\| staffUnlocksPaidFeatures(current.auth?.role);` | CONFIRMED: campaigns are created only by premium or staff, so H22's bypass of the canonize entitlement bites staff and any future lower tier; the behaviour switch is the live question |
| M3 | Custody row (SEAMS-r1-1) | `foreignGuestHold.js:320` `if (!id \|\| !npcId \|\| !errandId \|\| !encounterId \|\| !captorId \|\| !venueId`; sole production opener `envoyInterceptionStage.js:396` `openForeignGuestHold({` | CONFIRMED: only an errand interrupted by an army encounter can be held |
| M4 | The W-H3 loop's callers (SEAMS-r1-16) | `rg 'advanceResidency\(\|advanceWanderer\('` outside tests: defined in `npcResidency.js:275` / `npcCirculationTransit.js:190`, called only inside `npcResidency.js` | CONFIRMED: no caller |
| M5 | Tokens (SEAMS-r1-19/-22; new fold tokens) | `generationForkRegistry.js:46` `@property {'drawn' \| 'pure' \| 'label'} class`; `indecisive` 0 src; `crown_ban`/`polity_ban` 0; `expelled` `roadsKernel.js`; `overlooked` `beliefAxisSubjects.js`; `rival_creed` 2 generated corpus files; `honoured` 0, `honored` 3 files; `TESTIMONY_CREDIBILITY_BANDS = ['discredited','doubted','ordinary','trusted']`; `credibilityRead.js` `BAND_WORDS = ['discredited','doubted','trusted','unimpeachable']`; `backerRole`, `BACKER_ROLES`, `ENGAGEMENT_WHERE_KINDS`, `border_segment`, `economicCapacity01Of` 0 files each | CONFIRMED (`rg -lw`) |
| M6 | Map seams (HOST-r1-1/-8/-14/-16) | `hegemony.js:56` `SUBORDINATING_TERM_TYPES = ['tribute','compelled_alliance','puppet_seat','occupation_continuation']`; `rulingPowerSeat.js:532` `basis: 'treaty_subordinating_ties'`; `tableLedger.js:131` `OBLIGATION_TYPES = ['debt','famine','scarcity','unrest','siege','plague']`; `advanceInterval.js:130` "slices its ring to MAX_HISTORY=80"; `prosperityRank.js :: prosperityRank01` ("THE ONE ladder for a prosperity LABEL as 0..1"); nine private `prosperity01Of` (`demographicsPushPull.js:347` exported); `rg -ci prosperity` over the fold = 0 | CONFIRMED |
| M7 | ODQ §934.87's words (HOST-r1-1) | the owner's verbatim choice is "Build real realm borders"; "the seat read `foreignSeatOf`, its root sovereign, over the territory partition" is the recording seat's description (D-PL's correction, PL §0) | CONFIRMED by read |
| M8 | The host document = the owner's attachment | `cmp refs/HOST-REQUIREMENTS-2026-10-18.md ~/Desktop/HOST-REQUIREMENTS-2026-10-18.md` → SAME | CONFIRMED |
| M9 | The canonize gate's function (HOST-r1-2) | `campaignWorldPulseSlice.js :: canonizeCampaignWorldSpatial` holds the `not_entitled` line (re-read 05:2x) — it is the CANONIZE entitlement, not the simulator's advance; the simulator is premium because only premium or staff create campaigns (`campaignSlice.js :: createCampaign`) | CONFIRMED (read) |
| M10 | Round-1 token census (pure Python over `src/`, `D-FOLD-r1-probe/tokens_r1.py` → `tokens-r1.out`) | FREE: `whereaboutsOf` `sourceEventRef` `backerRole` `ENGAGEMENT_WHERE_KINDS` `party_voiced` `let_be` `border_segment` `indecisive` `opposed_creed` `polity_ban` `gateDefault` `seatChangedSince` `narrowed_voice` `crownReachAt` `polity_verdict` `menaceCounterTerms` `in_office` `paragon_employer` `legend_recorded`; LANDED literals: `honored` (18 files), `withheld` (1), `expelled` (`roadsKernel.js`), `overlooked` (`beliefAxisSubjects.js`), `rival_creed` (corpus), `drawn` (`generationForkRegistry.js`), `banished_found`'s reason `banished_from_here` (`npcCirculationTable.js`); `honoured` 0 literals | CONFIRMED (executed) |

## 2. THE RECORD (every FOLD-routed id; the same table is the fold's §9.6 round-1 block)
| id | sev | disposition | where (the fold unless named) | receipt |
|---|---|---|---|---|
| SEAMS-r1-1 | B | CURED — RULINGS-ROUND1 ADDENDUM (custody waits on ES-2b) executed | §3.3.13 ↳; §3.4 `envoy_held` ↳, `ransom` ↳, `banished_found` ↳; §2 CH ↳; OD-FC-48 ↳, OD-FC-60 ↳ | M3; `normalizeForeignGuestHold` (line 308) returns null without `errandId`/`encounterId`; ES-2's `custodyWritten false` |
| SEAMS-r1-5 | M | CURED (fold half) | §3.1.25; §3.4 `person_at_the_gate` ↳; §5 the town's gate ↳ | CH §11 / CH12 `gateDefault` (cured round 1) |
| SEAMS-r1-6 | M | CURED — ADDENDUM: PT's `party_voiced` | §1 req 24 ↳; §3.4 `party_voiced` + recount; OD-FC-47/49/50 ↳; SPINE req 24 ↳ | ADDENDUM SEAMS-r1-6 |
| SEAMS-r1-11 | M | CURED | §3.3.12 ↳ (`backerRole ∈ court · faction · creed · polity`); §5 PT tokens | RN §2.2's per-role mapping; M10 (`backerRole` free) |
| SEAMS-r1-15 | M | CURED | §6 C11 ↳, C13 ↳, ORDER NOTE ↳ | RN §13 / OD-RN-20 (cured) |
| SEAMS-r1-16 | M | CURED — the loop stays callerless; slot W-H (a reading of CH-r1-3, vetoable) | §2 CH ↳; INBOX ↳ W-H; OD-FC-48 ↳ | M4; RN §5.4 (cured) says the same |
| SEAMS-r1-17 | M | CURED | OD-FC-45/46/47/48/49 ↳; §3.4 `polity_war` ↳, `relief_answer` ↳ (STRUCK); §5 `PRECEDENCE_CLASSES` ↳, `narrowed_voice` ↳; §2 PL ↳ | RULINGS-ROUND1 PL/MN/RN/CH/PT items; D-PL §1 (patch channel, recall stamp) |
| SEAMS-r1-19 | m | CURED — ADDENDUM: `indecisive` | §3.4 `champion_duel` ↳; §5 `indecisive` ↳ | M10 (`indecisive` free; `drawn` landed) |
| SEAMS-r1-20 | m | CURED (fold half) | §1 req 24 ↳ (2); §3.4 anchor ↳; SPINE req 24 ↳ | — |
| SEAMS-r1-21 | m | CURED | §3.1.24 (one leaf per seam, fixed order, joint cap) | RN §5.4 "Shared seams"; CH-3 |
| SEAMS-r1-22 | m | CURED | §5 round-1 rows; §3.4 `banished_found` ↳, `backing_repudiated` ↳ | M5, M10 |
| SEAMS-r1-23 | m | CURED | §3.1.22 ↳ (deed seeding in `advanceRumorLedgers`); §2 CH ↳ (`admissionFor` refused) | RN §3.4/§10; CH §11, `cure/L-CH.md` M10 |
| HOST-r1-1 | B | CURED — ADDENDUM: the host exposes PL's walk | §3.1.26; INBOX ↳ map (a); OD-FC-45 ↳ | M6, M7; HR:530, 909 |
| HOST-r1-2 | B | CURED — ADDENDUM: canonized ≠ premium; born-campaign switches EXECUTED | §1 req 17 ↳; §2 one-lit-chain ↳; OD-FC-62; SPINE req 17 ↳ | M1 (executed), M2, M9; HR:84, 88, 898 |
| HOST-r1-3 | M | CURED | §3.1.27; INBOX ↳ map (b); §6 MAP PREREQUISITES | HR:26, 83, 102, 117 |
| HOST-r1-4 | M | CURED (chair part) + OWNER ROW | OD-FC-22 ↳; OD-FC-66 | HR:66, 709, 900 |
| HOST-r1-5 | M | CURED | §5 THE MAP REGISTER (16 rows) | HR:513, 543; PL §2 "X's ring" (cured) |
| HOST-r1-6 | M | CURED | §3.4 THE WHERE OF EVERY KIND; §1 req 24 ↳ (3); OD-FC-50 ↳ | HR:655; BOARD host ruling (3) |
| HOST-r1-7 | M | CURED — ADDENDUM | OD-FC-63 (defects cited; 25d/e/g the owner's; RN-3 lights after 25e/25g) | HR:261–299; RN-3 (cured) |
| HOST-r1-8 | M | CURED | §3.1.9 ↳; OD-FC-64; INBOX ↳ PG | M6 (`OBLIGATION_TYPES`); HR:448, 468, 479; CH §0/§6.2 (cured) |
| HOST-r1-9 | M | CURED (fold half) | §3.1.28; INBOX ↳ map (g) | HR:600, 646, 872; BOARD host ruling (2) |
| HOST-r1-12 | M | CURED | §6 THE MAP PREREQUISITES + flag-serialization note | HR:79, 821; the build-order table |
| HOST-r1-13 | M | CURED | §3.1.27; INBOX ↳ map (c) | HR:390, 895 |
| HOST-r1-14 | M | CURED | OD-FC-51 ↳; INBOX ↳ map (e) | M6 (`MAX_HISTORY=80`); HR:68, 768 |
| HOST-r1-15 | M | CURED | §3.1.29; §5 MAP REGISTER (four strength quantities); INBOX ↳ WC | HR:528, 533; OD-PL-33 (cured) |
| HOST-r1-16 | M | CURED | §2 PROSPERITY row + TR/POP/CN·LG·PG·MF ↳; §5 `prosperity` | M6; HR:311, 381, 409–411, 431, 453 |
| HOST-r1-17 | M | CURED | §3.1.26 | HR:498, 909; OD-PL-13 (cured) |
| HOST-r1-18 | M | CURED | §6 C0.5 ↳; INBOX ↳ map (d) | HR:42, 82 |
| HOST-r1-21 | m | CURED (fold half) | §3.1.28 | HR:640–645 |
| HOST-r1-23 | m | CURED | OD-FC-2 ↳, OD-FC-13 ↳; INBOX ↳ map (f), WC | HR:104, 358, 375; BOARD host ruling (5) |
| HOST-r1-25 | m | CURED | OD-FC-32 ↳; INBOX ↳ map (e) | HR:742, 768 |
| HOST-r1-26 | m | CURED | OD-FC-28 ↳ (a) | HR:51 |
| HOST-r1-27 | m | CURED by an OWNER ROW | OD-FC-28 ↳ (b); OD-FC-65 | HR:473, 891 |

**Counts:** disposed 33 of 33: cured 33 · refuted 0 · stop 0 · noted 0 (SEAMS 12: 1B/6M/5m; HOST 21: 2B/14M/5m).

## 3. STOPs
None. The three seams/host rows that were STOP-class at round 1 (SEAMS-r1-1, -6, -19) and the host BLOCKING rows (HOST-r1-1, -2) were ruled by the chair's ADDENDUM before this seat wrote; I executed those rulings. HOST-r1-4 (J385 defers an OWNER directive) and HOST-r1-27 (a tuning signature's timing) are owner-class and are written as OWNER ROWS (OD-FC-66, OD-FC-65), not ruled by delegation.

## 4. REFINED (beyond the routed ids; each a dated bracket)
1. §3.1.10 ↳ records the ADDENDUM's `seatChangedSince` (SEAMS-r1-3) in the ownership row it amends.
2. CN's cn-5: SEAMS-r1-25's CN part ("pinned" → "sealed"; `besiegerKind` → the `menaces` list), routed by `cure/D-MN-r1.md` §4.
3. §5 `MENACE_STRESSOR_LABELS` ↳ and "MN avoided words" ↳ (MN's round-1 cures, routed by D-MN).
4. OD-FC-46 ↳: SEAMS-r1-17's rule applied to MN-r1-1/-2/-3, which the skeptic's list omitted (incl. SEAMS-r1-18's id-kept answer).
5. §2 PL ↳: seven → NINE virtual flags after round 1 (PL header and §8).
6. §1 req 17 ↳ corrects the skeptics' framing: the `not_entitled` line is the CANONIZE call's entitlement, not the simulator's; H22 therefore crosses no paying boundary that exists today (M2, M9).
7. §3.4 recount; §8's round-1 line.

## 5. FOR THE CHAIR — open questions and cross-file follow-ups (not mine to write)
- **Open (PLAUSIBLE, needs a measurement):** CH's OD-CH-11/§12.4 keeps a narrow arm — a BOUND paragon on a court errand intercepted by an army rides the landed `foreignGuestHold`. The ADDENDUM withdraws custody entirely. If a bound paragon ever travels as an `envoyErrands` row, the landed interception stage (`envoyInterceptionStage.js :: holdInterruptedEnvoy`) would hold it as an envoy with no FP code at all; CH's round-2 lane must say whether a paragon rides as an errand's NPC, and the chair whether that landed hold is acceptable as an envoy hold (not "paragon custody").
- **Vetoable reading:** SEAMS-r1-16 — I read CH-r1-3's "the default for ordinary roamers" as design scope; the loop stays callerless with a W-H slot. The chair may instead charter an ordinary-roamer wave.
- **Recorded as ruled, worth a round-2 look:** `party_voiced` defaults to `spoken` (the ADDENDUM) where D-RN proposed `unspoken`; requirement 24's party default reads "nothing has happened to the party yet" — the ADDENDUM's "it decides nothing FOR the party" is the reconciliation.
- **ODQ §934.93 rows owed by the chair:** OD-FC-62 (born switches + H22's new-world shift), OD-FC-63 (alignment-25d/e/g), OD-FC-65, OD-FC-66; the map program's cross-program asks (§3.1 INBOX ↳ (a)–(g)); OD-PL-12 (D-PL).
- **PT's lane (in flight):** add `party_voiced` (row + card); re-express `backing` with `backerRole`; `whereaboutsOf`; `honored`; §13 anchors and WHERE; §9.2 calls `gateDefault`; §15's head unit; PT reads the map's known-places record (no copy); PT §2.4's one closed list.
- **Round 2:** CH reconciles OD-CH-11/§12.4/CH12 with the custody re-ruling and writes `indecisive` without the STOP mark; PL names the `seatChangedSince` leaf (§5.6); MN changes `wilds` → `wildland` (D-CH's route); each map-facing volume names its H17/H13/H23 port row; the §2 MN/RN/CH/PT rows are restated after round 2 (P4).
- **Not run:** `tools/docs-proof.sh` (the chair's P4; it writes into the shared master worktree). The engine's own checks ran on every inserted line: no `file.js:NNN` citation (master's source-citation gate), no `enforcement-claims` CLAIM_RE phrase, no `@enforced-by`, none of the spine/TRADE walker phrases, table pipe counts equal to their tables.

## 6. PROOF
`python3 -I cure/D-FOLD-r1-probe/proof_r1.py <docs> <probe>` → `proof_r1.out`: FOLD +158/−0, SPINE +2/−0, CN +1/−0; removing the inserted lines restores each 01:41 snapshot byte for byte: PASS. No git command, no test suite.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: the born-campaign switches (M1; re-executed by this seat at 05:4x, `bornRules.rerun.json` byte-identical to the 01:43 run: preset id `null`, born `realistic_regional`, 23 lit keys absent), the token census (M10), the insertions-only proof and the id-presence check. CONFIRMED by read at `81f1cd963`: M2–M7, M9 and every symbol quoted in the brackets. PLAUSIBLE (read from the host document or reasoned, not executed): the map's own claims cited by HR line (the pre-FP movers, plague-10.1-1/-2/-23, the M-W milestone for each lens ask), the end-to-end polity war closure (PL's own PLAUSIBLE), and the open question on CH's narrow errand arm.
