# D-FOLD-r2b — DISPOSITION LOG for the coherence fold, the spine and CN, P3 round 2b (lane D-FOLD-r2b, chair a73343ed; seat Opus 5.5; started 2026-10-18 12:00 EDT by `date`)

Status: DONE 2026-10-18 12:2x EDT — 38 of 38 items disposed (cured 33 · refuted 0 · stop 0 · noted 5); insertions-only proof PASS (§6). A previous D-FOLD-r2b seat died on the 5-hour limit at ~08:44 EDT after taking snapshots and a token census (`D-FOLD-r2b-probe/{FOLD,SPINE,CN}.before-r2b.md`, `tokens-r2b.out`); it wrote nothing to the three owned files (`cmp` of each snapshot against the live file: IDENTICAL at 12:0x EDT). This seat re-uses those snapshots as the insertions-only base.

Input: every id `skeptic/SEAMS-r2.md` routes to FOLD (1, 2, 3, 4, 6, 8, 9, 10, 12, 14, 16, 19) and `skeptic/HOST-r2.md` routes to FOLD (1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 15, 16, 21); the items `briefs/RULINGS-ROUND2b.md` names for the fold (incl. its ADDENDUM); the fold routes in `cure/D-MN-r2.md` §4 and `cure/D-PT-r2.md` §5. Files owned: `docs/DESIGN_FP_COHERENCE_FOLD.md`, `docs/DESIGN_FP_SPINE.md`, `docs/DESIGN_FP_ARCH_CN.md` (INSERTIONS-ONLY), this log, `D-FOLD-r2b-probe/`. No git, no test suite.

## Progress
- 12:00 EDT: orientation reads done (README, COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, OWNERSHIP, BOARD whole, every rulings file incl. ROUND2b + ADDENDUM, CHAIR-NOTES, SEAMS-r2 whole, HOST-r2 whole, D-FOLD-r2, D-MN-r2 §4, D-PT-r2 §5; the sibling round-2b logs' fold routes: D-PS-r2, D-ST-r2, D-PR-r2, D-PL-r2b, D-MN-r2b, D-RN-r2b, D-CH-r2b). Next: measure (code receipts for the sea, the seasons, custody, the canon root), read the fold's touched sections and the siblings' current text, write anchored insertions.
- 12:05–12:14 EDT: MEASURED (receipts `D-FOLD-r2b-probe/receipts-r2b.out`, host lines `host-lines.out`, tokens `tokens-r2b-seat2.out`); read the fold's touched sections (§3.1–§3.4, §5, §6, §7, §9.6) and the siblings' CURRENT text for every cross-reference (PR §0.3/§2.1–§2.3/§6/§8.2–§8.3/§10.3–§10.5/§11/§13; PS2/§2.7/§4.4/OD-PS-13; ST ST1/§2.1/§2.4/§7.2/OD-ST-39; MN §3.3/§5.5; PL §4.1/§4.6/OD-PL-46; CH §16b/§18; RN §2.1–§2.2; PT §4/§15). Next: write `texts_r2b.py`, dry-run, write, proof.
- 12:14–12:20 EDT: `texts_r2b.py` written (22 anchored insertions, fold only), dry-run clean (engine checks: unique anchors, pipe counts, no `path:line`, no CLAIM_RE, no forbidden phrase); `cmp` showed the fold byte-identical to the snapshot (no concurrent writer); WRITTEN 12:20; proof PASS.

## 1. MEASURED FIRST (master `81f1cd963`, read-only; `D-FOLD-r2b-probe/receipts-r2b.out`, `host-lines.out`, `tokens-r2b-seat2.out`)
| # | Question | Receipt | Verdict |
|---|---|---|---|
| M1 | Is the navy landed and lit (SEAMS-r2-1)? | `docs/DESIGN_NAVY.md` header ("owner-commissioned: navies convoy own/allied armies … a sea battle with LAND-PARITY semantics"); `navalKernel.js` header ("SEA BATTLES: two HOSTILE navies whose paths share a SEA EDGE collide there"; "MINTS A SIEGE"); `simulationRules.js :: WAVES` `navalEnabled: true` under "THE NINE ENGINE-WAVE GATES (W-R2-LIGHT owner ruling, 2026-07-16)"; `armyTransit.js :: ARMY_ROLES` `CONVOY: 'convoy', BLOCKADE: 'blockade'`; `seaRoads.js` S1–S3; `navalLayer.js` "adds NO danger math", "no naval-patrol damper"; `W11` 0 hits in master `docs`/`src` | CONFIRMED (read) |
| M2 | Seasons (SEAMS-r2-3, HOST-r2-1) | `spatialCost.js :: SLOW_NOT_SEVER_MAX = 6` ("NEVER infinite/cut"), `SEASON_TERRAIN_COST`, `SEASONAL_OVERLAY_VERSION = 2`; `seasons.js :: climateBandFor` / `seasonalContextFor` ("the food year's amplitude comes from the MEASURED band"); `spatialDigest.js :: CLIMATE_BAND_VERSION = 1`; `pestilenceKernel.js` `hopWeeks(digest, id, nb.neighbourId, season)`; `migration.js :: SEASON_ROAD_DEATH`; `supplyKernel.js :: advanceSettlementSupply(… season …)`; `distanceRead.js :: stormSeasonFactor` "Always ≥ 1 (slow, not sever)"; `armyTransit.js :: planMarch` → `hopWeeks(…, season)`; `attrition.js` 0 season reads | CONFIRMED (read): harvest, plague, column deaths, shipments, march travel are seasonal; army attrition is season-blind (the one unbuilt arm) |
| M3 | Custody reach of a patrol (SEAMS-r2-2) | `foreignGuestHold.js :: normalizeForeignGuestHold` "`if (!id \|\| !npcId \|\| !errandId \|\| !encounterId …`"; `envoyInterceptionStage.js :: holdInterruptedEnvoy({ worldState, errand, encounter, … })`; `envoyEncounter.js` "Exact node equality is the whole collision law" | CONFIRMED (read) |
| M4 | The counter-term stamp and the worst gate (SEAMS-r2-4, -19) | `stressors.js :: ageRoamingStressors` "`counterforce: assessment`"; `smuggle.js` "the route's WORST gate (`worstGate`)", `smuggleSuccessChance` | CONFIRMED (read) |
| M5 | Host-document rows (HOST-r2-4, -5, -9, -10, -12, -15, -16) | `host-lines.out`: H7 (deps H2; M-W1; H4; H5), H11 (M-W1 → M-W2), H12/H13 (M-W2), H16 (inbound; "Each part optional"), H22 (deps H5; H7; H8; H12; "Lands on the owner's schedule"), H23–H30 under "### With M-W5" (H26, H27, H28 behind H23; H28 adds the holy-site adoption command, waits on V14 §11 Q2), HR:529/534 (seat force band vs `PolitySite`), HR:601 (M-SITE-A reveal path), HR:670 law 9, HR:671 law 10, HR:676 law 15, HR:677 law 16, HR:830 ("Extending the deferral needs the owner's word"), HR:888 J384 (4) | CONFIRMED (read) |
| M6 | Audience of a site row (HOST-r2-7, cited in (j)) | `worldSnapshotPublic.js :: WORLD_SNAPSHOT_HARD_DENY` holds `'spatialLedgers'` (inside the frozen array) | CONFIRMED (read) |
| M7 | Tokens registered this round | `tokens-r2b-seat2.out`: `spentTick` `menaceSpentAt` `menacePressSet` `columnTerm` `partySeq` `party_reached_site` `party_cleared_site` `party_revealed_site` `made_known` `kept_secret` `keptSecret` `settlementFundingBand` `fundingBandOfSettlement` `garrisonBandOf` `mapSiteRef` `requestFealtyRow` `FEALTY_EPISODE_PREFIXES` `riders_quartered` `PATROL_CADENCES` `every_four_weeks` `every_thirteen_weeks` `patrol_engages` `patrol_joins` `patrolCounterTerm` all 0 src · 0 tests; `gateKey` 1 src (a function-local in `display/defenseDisplay.js`, a homonym); `'u:` 0 files; `'revealed'` 2 files (LANDED literal); `corps` 3 prose files | CONFIRMED (executed) |

## 2. THE RECORD (the fold's §9.6 round-2b block carries the same table)
| id | sev | disposition | where (the fold unless named) | receipt |
|---|---|---|---|---|
| SEAMS-r2-1 | B | CURED — CHAIR-NOTES 14 applied as corrected: THE SEA IS IN THE BOOKS (M8 · W-NAVY · D-6); FP mints no sea law | §3.3.14 | M1 |
| SEAMS-r2-2 | B | CURED — envoy STOPPED only on PS's envoy arm; never `envoy_intercepted`/`envoy_held` | §5 `patrol` ↳ r2b (1); §3.4 WHERE `road` ↳ r2b | M3; RULINGS-ROUND2b SEAMS-r2-2; PR §8.2 |
| HOST-r2-1 | B | CURED — CHAIR-NOTES 13 applied as corrected: slow never cut; one open piece (H11's band, one travel table); army attrition by season a slot; wind no consumer | §3.1 INBOX ↳ r2b (seasons, (k)); §6 prereq ↳ | M2; RULINGS-ROUND2b HOST-r2-1 |
| HOST-r2-2 | B | CURED (fold half) — the sea row cites PS2 (ii)'s sea arm | §3.3.14 (d); §6 prereq ↳ PS | PS2, §2.7, §6.2 (round 2b) |
| SEAMS-r2-3 | M | CURED — harvest and plague season landed; struck as second laws | §3.1 INBOX ↳ r2b (seasons) | M2 |
| SEAMS-r2-4 | M | CURED — one entry (ST's slot); MN's wear through the stamp | §5 `patrol` ↳ r2b (1); WC INBOX ↳ r2b (3); OD-FC-2 ↳ r2b | M4; PR §6.2; MN §5.5 |
| SEAMS-r2-6 | M | CURED — `corps` an actor kind; `u:<unitKey>`; PS/PT arms | §3.3.12 ↳ r2b; OD-FC-57 ↳; §5 regard keys ↳ | RULINGS-ROUND2b SEAMS-r2-6; RN/CH/PS r2b |
| SEAMS-r2-8 | M | CURED — THE ONE STRETCH KEY in the WHERE companion | §3.4 WHERE `road` ↳ r2b | PR §2.2; PS §2.7 |
| SEAMS-r2-9 | M | CURED — one body of men as ST/PR state; the alternative for the chair | §3.1.29 ↳ r2b | ST OD-ST-39; PR §10.5, OD-PR-41 |
| SEAMS-r2-10 | M | CURED — riders an input line on `call_in_answer`; `requestFealtyRow` + prefixes; no `patrol_order` | §3.4 `call_in_answer` ↳ r2b | PL §4.1/§4.6/OD-PL-46; PR §10.3 |
| SEAMS-r2-12 | M | CURED — the band always on, DM ceiling; coin W-COIN's; one spelling (ST's) | §3.1 INBOX ↳ r2b (W-COIN); §5 funding band | RULINGS-ROUND2b ST-r2-1; ST §2.4 |
| HOST-r2-4 | M | CURED — an ask, never a supersession (the owner's 05:57 word postdates the ADDENDUM) | §3.1.26 ↳ r2b; INBOX ↳ r2b (a) | PL-1 (c); HR:671, HR:499 |
| HOST-r2-5 | M | CURED — the window (H9/H23/H13, H25), never H16 | INBOX ↳ r2b (h); §5 `patrol` ↳ r2b (2); §6 prereq ↳ PR | RULINGS-ROUND2b HOST-r2-5; PR §13 |
| HOST-r2-6 | M | CURED — one cadence meaning (a period); presence sent | §5 `patrol` ↳ r2b (2) | PR §2.3; HR:813 |
| HOST-r2-8 | M | CURED — `mapSiteRef` join; re-emission asked; re-kinding keeps the id | INBOX ↳ r2b (j) | ST §2.1, §6.5 (round 2b); ENC-MS-06 |
| HOST-r2-9 | M | CURED — site garrisons only (`garrisonBandOf`); seat force band a slot | §3.1.29 ↳ r2b | HR:529, HR:534; ST §2.4 |
| HOST-r2-10 | M | CURED — H28 split, one writer each | §6 prereq ↳ C5 | HR:107; ST §6.2 |
| HOST-r2-12 | M | CURED — H26/H27 on M-W5; M-SITE-A/F; PR row; canon root; H11 | §6 prereq ↳ (eight rows) | M5 |
| HOST-r2-13 | M | CURED — storms are the landed storm law; a port town's storm its own stressor | §3.3.14 (e) | M1, M2 |
| SEAMS-r2-14 | m | CURED — road arms of `person_at_the_gate` and `party_gate` (STOP-PR-2 RULED) | §3.4 WHERE `road` ↳ r2b | CH §18; RULINGS-ROUND2b STOP-PR-2 |
| SEAMS-r2-16 | m | CURED — the BENCH officer's personality | §3.4 `person_banned` ↳ r2b | CH §18 |
| SEAMS-r2-19 | m | CURED — goods at the worst gate | §5 `patrol` ↳ r2b (1) | M4; PR §6.4 |
| HOST-r2-15 | m | CURED (RECORDED, not ruled) — the 05:57 word put to the owner; A.12 kept | OD-FC-66 ↳ r2b | HR:66, HR:830 |
| HOST-r2-16 | m | CURED — PS widths and weights spectrum-relative; PR mints no week band | OD-FC-28 ↳ r2b | PS §4.4, OD-PS-13 |
| HOST-r2-21 | m | CURED — the patrol clause struck from the map ask | INBOX ↳ r2b (f); OD-FC-2 ↳ r2b | HR:104, HR:555 |
| R2b PR Q3 (J-ES-1) | — | CURED — the fold's amendment of record; the in-volume ES bracket a P4 bracket lane's | INBOX ↳ r2b (ES) | ES §3.3/J-ES-1 (read); PR §8.2 |
| R2b PR Q5 (patrol rows superseded) | — | CURED | §5 `patrol` ↳ r2b (1); OD-FC-2 ↳ r2b; WC INBOX ↳ r2b (3) | PR §6.2 |
| R2b PR Q7 (C16 after C15) | — | CURED | THE ORDER NOTE ↳ r2b (1) | the ruling |
| R2b PR Q6 (`army_beaten`) | — | CURED (mirror) | §5 `menace_met` outcomes ↳ | MN §7 (round 2b) |
| R2b ADDENDUM ST-r2-14 | — | CURED | §3.3.12 ↳ r2b; OD-FC-57 ↳ | the ADDENDUM; ST4 |
| D-MN-r2 §4 (MN tokens) | — | CURED — three-feeder sentence; four names | §5 MN round-1 tokens ↳ | MN §3.3 (round 2b); M7 |
| D-PT-r2 §5 (tokens, `revealed`) | — | CURED | §5 PT round-2 tokens ↳ | PT §2.4, §4; ST §2.1; M7 |
| D-PT-r2 §5 (RN-3 before PT-1) | — | CURED | §6 C13 ↳ r2b; ORDER NOTE ↳ r2b (2) | PT §15, OD-PT-17 |
| R2b FOLD-V1 (`upheld`) | — | NOTED — already applied in round 2 | §3.4 backing ↳ r2; §5 `upheld` ↳ | — |
| R2b FOLD-V2 (owner row) | — | NOTED — already applied in round 2 (OD-FC-62 ↳) | OD-FC-62 ↳ | — |
| R2b OD-PT-28 | — | NOTED — PT's ruling, accepted; no fold text describes the party impact's undo beyond §2's `undoToken:null` substrate | — | — |
| D-MN-r2 §4 (patrol producer) | — | NOTED — the same cure as SEAMS-r2-4 | — | — |
| D-PT-r2 §5 (§3.4 party rows) | — | NOTED — already applied in round 2 | §3.4 r2 party rows | — |

**Counts:** disposed 38 of 38 (25 skeptic ids: SEAMS-r2 12 = 2B · 7M · 3m, HOST-r2 13 = 2B · 8M · 3m; 13 routed items): cured 33 · refuted 0 · stop 0 · noted 5.

## 3. STOPs
None. Two cures touch chair texts and are recorded as vetoable readings, not silent re-rulings:
- **HOST-r2-4** restates `briefs/RULINGS-ROUND1.md` ADDENDUM HOST-r1-1's "the map's own chain rule is superseded" as an ASK. Why not a STOP: the ADDENDUM itself framed the point "as a cross-program ask back to the map program", and the owner's 05:57 word (after the ADDENDUM) accepted the map document with its owner-ruled sway; the owner's words outrank rulings (kit law). PL's round-2b lane reached the same reading (`cure/D-PL-r2b.md` §3). The chair may restate the ADDENDUM clause in a rulings file.
- **HOST-r2-15** records the owner's 05:57 word against OD-FC-66 and asks him one confirmation; A.12's consequence ("no wave cites either branch as settled") is KEPT until he answers. The stronger reading (hole 6 already accepted J385's bounded arm) is the chair's to take or refuse.

## 4. REFINED (each marked in the fold, vetoable)
1. Travel reads the climate band ONLY through ONE re-versioned `SEASON_TERRAIN_COST` table (a `SEASONAL_OVERLAY_VERSION` step), never a second multiplier (INBOX ↳ r2b seasons row) — one travel law.
2. Army attrition by season recorded as the one unbuilt seasonal arm, with its slot on the war volume's attrition kernel (measured: `attrition.js` reads no season).
3. `gateKey` registered as a homonym of `defenseDisplay.js`'s function-local (found by this lane's census).
4. J-ES-1's third exposure class reconciled with the owner's earlier "ONLY at route segments carrying enemy military" by his own 10-18 word that patrols are military units.

## 5. FOR THE CHAIR — open questions, sibling halves, ODQ rows (not written into other volumes)
- **SEAMS-r2-9 (one body of men):** ST and PR chose "the keep is defensibility, never men"; the seams skeptic's stationed-share alternative (OD-PR-41) is a same-seed shift on every war with a keep. The fold mirrors the volumes; the chair's veto only.
- **CHAIR-NOTES items 13 and 14** are APPLIED as corrected in the fold (INBOX ↳ r2b seasons row; §3.3.14); P4 must fold those rows, not the notes' first text. Item 16's actor-kind and `u:` rows are applied in §3.3.12 ↳ r2b; its §7 row and WC inbox row (the parked mercenary market closes into CH) stay P4's. `briefs/RULINGS-ROUND2.md` §E still says patrols wait until the host "opens H16" (D-PL-r2b flagged it) — the chair's own file.
- **Sibling halves still owed (the fold's rows are the status of record meanwhile):** PT (its round-2b lane died; PT mtime 07:30): `party_gate`'s road WHERE (STOP-PR-2), the exclusion edge's `corps` arm, §4's "`SITE_STATUS revealed`" (ST's word is now `made_known`) and its "ST's widening of the actor convention … `site`" clause, l.377 "opens H16". PR: `fundingBandOfSettlement` → ST's `settlementFundingBand`. ES: J-ES-1's in-volume bracket (a P4 bracket lane). CH: aligned by its resumed seat at 12:14 (its `site` echo removed).
- **Held for P4 (routed by sibling logs, not in this lane's input):** PS's §5 rows (`passage` vs "transit", tolerance band, crossing kinds, envoy-arm verdicts, deed kinds `passage_kept · passage_breached · passage_trespassed`, unit-key prefixes `army: · column: · patrol: · corps:`); ST's §7 shape rows OD-ST-33/34 and its round-2 tokens; PR's registry rows (`patrol_engages`, `patrol_joins`: +2 kinds) and §5 rows (`placement`, `patrolPlacementOf`, `found_nothing`); RN's §5 rows (`TELLING_SOURCES`, `heardTick`) and §3.1.22's three bindings; CH's §5 rows (`paragon_leak`, `paragon_findings`, `paragonId`, `rendezvous:`); D-PL-r2b's "transit" row; the C14 · C15 · C16 chain rows themselves.
- **Open, not this lane's:** RN's question on `party_voiced`'s trigger wording ("a court, or a person of `regional` fame" vs RN's holder-fame reading — `cure/D-RN-r2b.md` §6); the spine's SP-4 "an explicit SP-4a amendment HERE" clause has carried no bracket for the fold's actor-kind amendment since 10-17 (observation only).
- **ODQ §934.93 rows owed by the chair (new this round):** the map asks (a) restated, (f) struck, (h) the window, (j) the site join key and re-emission, (k) the climate band; OD-FC-66's one confirmation; the seat force band slot (HOST-r2-9).

## 6. PROOF
`python3 -I D-FOLD-r2b-probe/proof_r2b.py <docs> D-FOLD-r2b-probe` → `proof_r2b.out`: FOLD +78/−0, SPINE +0/−0, CN +0/−0; removing the inserted lines restores each snapshot byte for byte: PASS. (The engine rewrote SPINE and CN with identical bytes, so their mtimes moved to 12:20; content unchanged.) No git command, no test suite.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: the token census (`tokens-r2b-seat2.out`) and the insertions-only proof. CONFIRMED by read at `81f1cd963`: M1–M6 and every symbol quoted in the new rows; the host document's rows (`host-lines.out`). CONFIRMED by reading the sibling volumes' current text: PR, PS, ST, MN, PL, RN, CH (CH re-read after its resumed seat's 12:14 write). PLAUSIBLE, not upgraded: that H11's re-version is best read through one re-versioned terrain table (a design choice, REFINED 1); the army-attrition season slot's shape (recorded, not designed); every DRAFT constant cited (unchanged, UNMEASURED); PT's state, since its round-2b lane may resume and change the halves listed in §5 — the round-2b verifier must re-check PT and CH against these rows.
