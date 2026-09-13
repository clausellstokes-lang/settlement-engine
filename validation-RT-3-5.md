# VALIDATION-RT-3-5 — a Fable seat's retrospective review of `items-RT-2-5.md` §3–§5

**Seat.** Fable 5.1, 2026-09-12, read-only. **Range.** Every row whose id begins `OV-`, `VIS-`, `D-F`, `G-F`, `P-R` (plus the two `P-W` rows that sit inside §5.4), `S-F`, `W-` — **227 rows**: OV 39 · VIS 19 · D-F 28 · G-F 45 · P-R 25 + P-W 2 · S-F 34 · W 35. **Not in either seat's range and validated by nobody:** `PS-01…PS-29` (§4.1 power slots, 29 rows) and `E-F1…E-F21` (§5.3 economy, 21 rows) — 50 rows.

**Dock.** All citations resolved at `f2da5a3ee` in `scratchpad/dock-f2da5a3ee` (CONFIRMED `git log -1` = `f2da5a3ee5743e…`). Every file:line quoted below as CONFIRMED was read in that tree.

**Column (a) — old law verbatim.** The fidelity adversary byte-compared all 567 VERBATIM cells against `verbatim/REFERENT-TABLE.as-ratified.md` and found zero mismatches. I spot-checked `OV-16` (verbatim line 424), `D-F23` (line 543) and `VIS-12` (line 502) by hand: match. I do not restate (a) per row; it is ✓ throughout unless a row says otherwise.

**Marks.** `OK` · `CHALLENGE: <argument>` · `REVERSE: <should be | field:line | floor>`. Every conclusion carries **CONFIRMED** (executed check in the dock or the record) or **PLAUSIBLE** (reasoning only).

**Fields verified in the dock, used repeatedly below (all CONFIRMED):**
- `priorityHelpers.js:45-67` — `hasMilitaryInst`(45) `hasGarrison`(46) `hasMilitia`(47) `hasWatch`(48) `hasMercenary`(49) `hasCharterHall`(51) `hasWalls`(52) `hasGates`(53) `hasPrison`(54) `hasCourtSystem`(55) `hasMarket`(56) `hasGuild`(57) `hasWarehouse`(60) `hasPort`(61) `hasNavy`(62) `hasGranary`(63) `hasHospital`(64) `hasChurch`(65). `PORT_INFRA_RE` at :32.
- `safetyProfile.js:56-62` communityOrderBonus with no law body; `:283` prints "A functioning court system means…" off `hasCourtSystem`; `:300` "There is no meaningful guard presence."; `:463-464` "no gates to bribe".
- `corruption.js:630` `SECURITY_INSTITUTION_RE`; `:654-658` covert/revealed semantics; `:665-666` `nameMatches` on raw `inst.name`; `:670-681` `impairments[].covert !== true`; `:683-689` unexposed-stooge route.
- `defenseInstitutionBuckets.js:83-108` the seven buckets (`'professional city watch'` in both garrison :90 and watch :97; mercenary bucket :98-100 lacks `hireling hall`).
- `holderTable.js:129-143` `capturedRulingStructure`; `:279-288` muster kind = `Citizen militia` only; `:599-615` `holdersOf` resolves on the settlement passed.
- `stateProseKernel.js:133-138` `AUDIENCE_DM`/`AUDIENCE_PLAYER`/`COVERT_MARK='dm-only'`; `:174-178` `variantIsAudible` — the DM sees everything, a player sees no variant whose `marks` include `dm-only`.
- `PowerTab.jsx:194` `audience = playerView ? 'player' : 'dm'`; `:198-215` `publicDossier` nulls contenders/deskReadings and `includeCovert: !playerView`; **`:344-350` the "Criminal Capture" badge (`Criminal: Corrupted Officials` / `Criminal: Governance Captured`) renders with NO `playerView` gate** — only `crimCapture !== 'none'`.
- `economyDeskRead.js:101`, `:113`; `wiringCensus.js:1252-1259` `COVERT_SOURCES`; `:1265-1269` `isCovertPath`; `:1681` `row.covert = row.reads.some(isCovertPath)`.
- `mobilization.js:128`, `:147`, `:418` `covert`; `brokeragePatronage.js:296` `covert: house.legality === 'illegal'`; `:319-328` player projection writes `patronName: 'unknown'`.
- `warFaithStateProse.js:96` "`templeWealth` HAS NO WRITER ANYWHERE IN THE ENGINE"; `:168-175` `properFill` (rejects only a leading determiner, a digit, snake_case — `(hidden)` passes); `:251-262` `mobilizationPoolKey`; `:930-933` `counterpartName` = occupier || counterpart.
- `powerStateProse.js:634` `const slots = {` in `powerLadderRung` (the first `const slots =` in the file); `:860` `governing`; `:875-876` the two-bag comment; `:900-901`; `:953`; `:962` `faction: governing`.
- `governanceNarrative.js:98` `'the guard'` fallback; `:101-105` `deriveCouncilLabel` (thorp → 'the household heads'); `:128-130` 'the clergy' conditioned on church/cathedral/parish; `:138-148` `deriveWatchLabel`.
- `institutionalCatalog.js:104` `Household levy`; `:1340-1354` `Citizen militia` / `Town watch` (`exclusiveGroup: 'civilianDefense'`, Town watch `required: true`, "Part-time guards. Night patrol and gate duty."); `:8`, `:16`, `:274` `Informal elder consensus` / `Head-of-household consensus`.
- `defenseStateProse.js:1269-1276` `forceCorePoolKey` (`NO organized force at all` consults six buckets); `defenseDisplay.js:183-195` `deriveCriminalStructure` (`organized` label); `:221` "Irregular pay, worn equipment, morale risk."; `:230-233` `Legal Infrastructure: Court only / Prison only / None`.
- `treatyDocument.js:58` "The compelled banner still answers the muster"; `:63` "no muster gathers where none is allowed"; `:68` "The garrison keeps the walls"; `:73` "The installed seat still sits"; `:78` "The court stays open to watching eyes".
- `stressFactions.js:105-107` `'Unknown Faction (hidden)'`, power 15, "Its presence is not known to the settlement."; `stressNarrative.js:96` "The settlement does not know."
- `rulingStructure.js:273`, `:280` `'Corrupt Council'`; `:571` `if (militaryPower > 5 && (tier !== 'thorp' || priorities.military > 60))` mints `'Military/Guard'` (:596) — a PRIORITY test, roster-blind; `:762-767` `adversarial` "asserts enforcement is WINNING".
- `stressorDynamics.js:688-717` the VARIANT hooks (barracks_coup :689-690, arcane_ascendancy :701 "failed twice this tenday", council_schism :705-706, tax_revolt :716-717 "last week not at all" and "these ten years"); `:877`, `:912` `barracks_coup` chosen off the leading challenger's `military` archetype; `:787-796` `attackerLabel: null`; `:844` the `reason` "The levies of a drowning treasury finally broke the commons."
- `defenseGenerator.js:177-178` `hasAnyDefense` counts `hasWatch`; `:189-191` one `milUpkeepMult`; `:244` `hasLawInfra`; `:250-253` order purse; `:462-472` `economicGates`.
- `customContentSemanticAuthority.js:41-47` `nativeSemanticName` returns `''` for materialized custom content.
- `npcGenerator.js:1524`, `:1532` `'Corrupt Official'` under `occupied` / `insurgency`; `:1511-1517` `TIER_MANDATORY_ROLES` (village+: `'Guard Captain'`, `'Mayor'`).
- `foodStockpile.js:185-195` `has('mill')` substring ×1.25; `institutionServices.js:530` `Customs house`; `:1323` Town watch `Gate duty: {on: true}`.
- `economy.generated.js:1592-1598` the `≥15` canonical row carries no `marks`; `EconomicsTab.jsx:664` the same string.
- `dossierMounts.js:483-490` `UNMOUNTED_BLOCKS` includes **`DS-GEN-1`, `DS-GEN-10`, `DS-POP-1`, `DS-POP-2`, `DS-DEF-7`, `DS-DEF-10`** — every G-F row on those blocks is DARK today.
- `tests/helpers/dossierComposedFill.js:138` `resolveBag` — a TEST HELPER that regex-scans `powerStateProse.js` source for `const <bag> =`; `dmFieldProjection.js` whole (the DM-pen projection; it is about DM-EDITABLE fields, not audience).
- Annex `RECEIPT_POOLS_DOSSIER_STATE.md:455-465` §0e AUDIENCE; `:2834-2858` DS-DEF-4 pools (corrupted/capture every variant `dm-only`); `:3622-3625` `sovereignty · strained` (all three `dm-only`); `:4120-4125` INFILTRATED #4 (player) "the town knows it without knowing who" and #5 `[ledger · dm-only]`; `:1095-1097` DS-ECO-6 "The whole block is `dm-only`"; `:3445-3448` mobilization COVERT.

---

## §3 THE OVERLAPS — OV-1 … OV-39

| id | verdict | (b) ground real at the line? | (c) permission safe? / worst sentence licensed | mark |
|---|---|---|---|---|
| OV-1 | CONTRADICTION | ✓ `defenseInstitutionBuckets.js:90`,`:96-97` — CONFIRMED | "either word at city; never the contrast" — safe; F1-29 carries it | **OK** (CONFIRMED) |
| OV-2 | CONTRADICTION | ✓ `hasWatch` :48 | "pick any register; the town must have the row" — safe | **OK** (CONFIRMED) |
| OV-3 | STRUCK | rule 3 "same row" is a construction rule — the two tables read ONE row (`holderTable.js:317-323` vs buckets :95-97) | worst: a body read and an organ read on one row unannounced — same referent, so no reader misled | **OK** (PLAUSIBLE) |
| OV-4 | MODEL | ✓ `defenseGenerator.js:177-178`, `:189-191`, `:244-253` — CONFIRMED one multiplier per purse; F4-02/F4-19 | "one purse over wall maintenance and wages" — safe | **OK** (CONFIRMED) |
| OV-5 | CONTRADICTION | ✓ `holderTable.js:279-288`, `:599-615` — CONFIRMED | "the muster as the class word; a ROLL needs the row" — safe (F1-03, R-8) | **OK** (CONFIRMED) |
| OV-6 | CONTRADICTION | ✓ `priorityHelpers.js:45` includes `walls`,`citadel`,`watch` — CONFIRMED the gloss is false of the key | cell "write walls, gates, the line" reads unconditioned; the bar is kept (F1-07/F1-08) but the cell drops the `hasWalls` condition | **CHALLENGE:** the permission cell should say "walls and gates where the flag stands"; as written it licenses "the line" on an unwalled town (CONFIRMED flag; PLAUSIBLE reading) |
| OV-7 | CONTRADICTION | ✓ `:49-51` hireling hall in the FLAG, bucket :98-100 lacks it — CONFIRMED | nothing handed back; NF-1 | **OK** (CONFIRMED) |
| OV-8 | STRUCK | ✓ `hasCourtSystem` :55 fires on town/city hall — CONFIRMED; and `safetyProfile.js:283` PRINTS "A functioning court system" off the same flag, so the page's own surface calls it a court system | worst: "the court sat late" on a Town-hall-only town — the WORD agrees with the printed courtNote; a TRIAL is F1-12 and survives (R-4) | **OK** (CONFIRMED) — the closing essay's case against the court strike is weaker than it reads: the engine prints "court system" beside the face |
| OV-9 | CONTRADICTION | ✓ `governingName` / `rulingPower` | cell "write the chamber, the office, the moot as places" — a chamber AS A PLACE below town collides with F1-20 (`institutionServices.js:1448-1453`; `institutionalCatalog.js:8/:16` consensus rows) which the same fold kept | **CHALLENGE:** add "at town and up" to the place words, as D-F22/S-F13 did (CONFIRMED F1-20 exists) |
| OV-10 | STRUCK | the role bar — tone | "write the reeve as a person or as the office": `'Elder'` is the tier's mandated singular NPC at thorp/hamlet (`npcGenerator.js:1512-1513`), `Village reeve` emits an NPC `'Reeve'`; F3-06 (minted in the table) bars an unnamed person's act in the singular office the tier names | **CHALLENGE:** qualify by F3-06 — a reeve "slow with the books" is that NPC to every reader (CONFIRMED F3-06 + mandated roles) |
| OV-11 | STRUCK | a tag is not a person | `[archivist's reading]` "write the sentence" is over-broad: the ELDERS as a body is KEPT at RT2.2-11 / F1-22 (`holderTable.js:332-336`) | **CHALLENGE:** template misfire — should read "the tag is free; the body case is F1-22" (CONFIRMED F1-22) |
| OV-12 | CONTRADICTION | ✓ `:56`; `generalStateProse.js:1109` | nothing handed back | **OK** (CONFIRMED flag) |
| OV-13 | CONTRADICTION | ✓ `brokeragePatronage.js:296` vs `religionState.js:620` — CONFIRMED | "name which patron" — safe (F1-125) | **OK** (CONFIRMED) |
| OV-14 | CONTRADICTION | ✓ `foodStockpile.js:185-195` — CONFIRMED substring `mill` | nothing handed back | **OK** (CONFIRMED) |
| OV-15 | CONTRADICTION | ✓ `:64-67` — CONFIRMED `hasHospital` includes `healer`, `hasChurch` includes `priest`,`shrine` | "write care and faith generically" — safe; this is the hospital row the essay's item 5 wants SPLIT for RT2.1-19/RT2.2-22 (sibling's) — this row already refuses the building | **OK** (CONFIRMED) |
| OV-16 | STRUCK | "a roster question for the register car" — `hasNavy` :62 exists; `'Navy'`/`'Major Port'` not found as catalog rows (grep CONFIRMED none in `institutionalCatalog.js`) | `[corrected]` hands nothing back; nouns kept at RT2.2-23 | **OK** (CONFIRMED the correction) |
| OV-17 | CONTRADICTION | ✓ `governanceNarrative.js:98`, `:148`; `safetyProfile.js:300` — CONFIRMED | "the guard wherever any law body stands" — safe (R-5) | **OK** (CONFIRMED) |
| OV-18 | CONTRADICTION | ✓ `rulingStructure.js:596`; `stressFactions.js:105-107` — CONFIRMED | "never read the class word inside a NAME as a standing" — safe (F1-118) | **OK** (CONFIRMED) |
| OV-19 | CONTRADICTION | ✓ `:273`,`:280` `'Corrupt Council'` — CONFIRMED | "write around the label" — safe (F1-117) | **OK** (CONFIRMED) |
| OV-20 | MODEL | ✓ `holderTable.js:129-143`; `rulingStructure.js:762-767` — CONFIRMED | "each rung at its engine meaning" — safe (F4-15) | **OK** (CONFIRMED) |
| OV-21 | CONTRADICTION | ✓ `corruption.js:683-689`; `wiringCensus.js:1252-1259` — CONFIRMED | "the DM line names the OFFICE, never the officer" — safe (F4-13) | **OK** (CONFIRMED) |
| OV-22 | SCOPE | floor 3 — the typed edge exists; product scope | "an UNNAMED person may hold, act, be resented" — safe subject to F3-06 | **OK** (PLAUSIBLE) |
| OV-23 | STRUCK | the role bar | "write captain, reeve, overseer, healer, collector": `'Guard Captain'` is ONE mandated NPC at village+ (`npcGenerator.js:1514-1516`) | **CHALLENGE:** as OV-10 — "the captain" unnamed and acting IS Guard Captain ⟨Name⟩ to the reader (F3-06) |
| OV-24 | STRUCK | ✓ the engine bakes the words (`safetyProfile.js:262-300`, `governanceNarrative.js:95-148`, `hookEscalation.js:394-421` — all CONFIRMED) | "write as the engine's own strings write" — but NF-12 rightly says an engine self-contradiction does not rescue a writer who repeats it | **OK** (CONFIRMED), with NF-12's caveat |
| OV-25 | STRUCK | an instrument refusal | template "write the sentence" — nothing was barred | **OK** (PLAUSIBLE) |
| OV-26 | CONTRADICTION | ✓ `customContentSemanticAuthority.js:41-47`; `corruption.js:665-666` — CONFIRMED | nothing handed back; NF-3, F1-30 | **OK** (CONFIRMED) |
| OV-27 | CONTRADICTION | ✓ `institutionalCatalog.js:104`; `defenseStateProse.js:1269-1276` — CONFIRMED the levy matches no bucket | nothing handed back; NF-2 | **OK** (CONFIRMED) |
| OV-28 | STRUCK | the fill names a row the town HAS | worst: a defense body as an economy subject on a player face — a public roster row, no secret | **OK** (PLAUSIBLE) |
| OV-29 | CONTRADICTION | ✓ `warFaithStateProse.js:930-933` — CONFIRMED | "seat the possessor explicitly" — safe (F1-120/123) | **OK** (CONFIRMED) |
| OV-30 | STRUCK | the label is the engine's string | template — nothing barred | **OK** (PLAUSIBLE) |
| OV-31 | STRUCK | wiring (`{controller}` fill) | nothing handed back | **OK** (PLAUSIBLE) |
| OV-32 | STRUCK | wiring | nothing handed back | **OK** (PLAUSIBLE) |
| OV-33 | STRUCK | W24 struck wholesale | "use any record noun" — safe; F1-24 keeps the HOLDER condition | **OK** (CONFIRMED F1-24) |
| OV-34 | CONTRADICTION | ✓ `treatyDocument.js:58` vs `:63` — CONFIRMED | "seat the possessor" — safe (F1-124) | **OK** (CONFIRMED) |
| OV-35 | STRUCK | the archetype face cannot name WHICH institution | "write a scandal without naming the office" is safe; but VIS-03's twin cell "name one as a hook" is not: where one roster row carries the `corruption_exposed` impairment (`institutionStatusModel.js:118`), naming a DIFFERENT office denies a printed impairment row (floor 1) | **CHALLENGE:** the permission must be "name none, or the one the impairment names" (PLAUSIBLE on the impairment's printing) |
| OV-36 | CONTRADICTION | ✓ `wiringCensus.js:1681`; `warFaithStateProse.js:251-262` — CONFIRMED | nothing handed back; NF-5 | **OK** (CONFIRMED) |
| OV-37 | STRUCK | research — but the fidelity's F8 is right that this is a live engine fact (City hall carries `Small prison/stocks` as a SERVICE) | nothing handed back | **OK** (PLAUSIBLE) |
| OV-38 | STRUCK | wiring (dark counterforce pool) | nothing handed back | **OK** (PLAUSIBLE) |
| OV-39 | STRUCK | ADDENDUM 14 dissolves the tagging | template — nothing barred | **OK** (PLAUSIBLE) |

## §4.2 VISIBILITY — VIS-01 … VIS-19 (every row; leak decidable under the four floors?)

| id | verdict | (b) field real? | leak possible under the four floors? / does the `[corrected]` cell hand nothing back? | mark |
|---|---|---|---|---|
| VIS-01 | CONTRADICTION | ✓ `corruption.js:670-681` `impairments[].covert === true` — CONFIRMED | a player face naming a covert impairment is refutable under F4-13 (the engine's model). No leak licensed | **OK** (CONFIRMED) |
| VIS-02 | STRUCK | a licence (revealed = `covert !== true`, :654-658 CONFIRMED) | nothing to leak — a revealed impairment is public | **OK** (CONFIRMED) |
| VIS-03 | STRUCK | silence | "name no office, or name one as a hook" — the "name one" half can name the wrong office (see OV-35) | **CHALLENGE** (as OV-35) |
| VIS-04 | CONTRADICTION | ✗ the ground is `holderTable.js:129-143` (`capturedRulingStructure` — a rung with NO audience field) + AUTHORED marks. **No field denies a player face.** And `PowerTab.jsx:344-350` prints "Criminal: Corrupted Officials" / "Criminal: Governance Captured" with no `playerView` gate — CONFIRMED | Under the four floors a player face saying "the hall is bought" AGREES with the badge the same page shows the player; it cannot be refuted. The verdict rests on authored marks exactly as VIS-12/VIS-18 do, and R-11's "MODEL (F4-13)" does not reach it (`criminalCaptureState` is not on `COVERT_SOURCES`). The DM-only marks on DS-DEF-4/DS-POW-6 conceal prose that restates a printed badge | **REVERSE:** should be the same residual class as VIS-12/VIS-18 (STRUCK-unrefutable, referred to the chair) **plus a NEW WIRING row**: the capture badge is player-visible, `PowerTab.jsx:344-350`; floor 4 if the chair rules the badge a leak, else the marks are preference (CONFIRMED) |
| VIS-05 | STRUCK | a licence | `[corrected]` hands nothing back — correct | **OK** (CONFIRMED) |
| VIS-06 | STRUCK | provenance bar | "cite a state organ's record on any face" — safe ONLY with F1-24's holder condition (`composedWalker.js:1071-1073`); a citation to a holder the roster does not seat is still a finding | **CHALLENGE:** the cell should carry F1-24 (CONFIRMED F1-24 in the table) |
| VIS-07 | CONTRADICTION | ✓ `brokeragePatronage.js:296`, `:326` — CONFIRMED player projection writes `'unknown'` | refutable under F4-13; the positive move ("the town does not know who") is in the table | **OK** (CONFIRMED) |
| VIS-08 | CONTRADICTION | ✓ `mobilization.js:128`, `:147`, `:418` — CONFIRMED | refutable under F4-13 | **OK** (CONFIRMED) |
| VIS-09 | STRUCK | ✓ `wiringCensus.js:1681` reads the token — CONFIRMED | `[corrected]` hands nothing back — correct | **OK** (CONFIRMED) |
| VIS-10 | CONTRADICTION | ✓ `settlementPolitics.js:423-436` `covert: true` on a compromise glue — CONFIRMED | "a revealed leash is a public scandal both faces may name" — safe | **OK** (CONFIRMED) |
| VIS-11 | STRUCK | wiring — `religionState.js` has no `covert` (PLAUSIBLE; not grepped) | nothing handed back | **OK** (PLAUSIBLE) |
| VIS-12 | STRUCK | no field: annex `:3622-3625` all three variants `dm-only` — CONFIRMED; the treaty term's compliance state is the OBSERVED, public one (F1-86) | `[corrected]` hands nothing back — correct. Under the four floors a player face "somebody is being funded from outside" is unrefutable; but it is not an ENGINE secret — no covert path exists. The residual is an authored preference, correctly left to the chair | **OK** as corrected (CONFIRMED); see FIFTH FLOOR |
| VIS-13 | CONTRADICTION | ✓ `stressorDynamics.js:787-796` — CONFIRMED | "say the town does not know" — safe (F1-70) | **OK** (CONFIRMED) |
| VIS-14 | CONTRADICTION | ✓ `economy.generated.js:1592-1598` no marks; `EconomicsTab.jsx:664` — CONFIRMED | an ENGINE leak (NF-6, W-14 wiring) — nothing handed back | **OK** (CONFIRMED) |
| VIS-15 | STRUCK | an instrument mismatch | nothing handed back | **OK** (CONFIRMED annex :4124) |
| VIS-16 | CONTRADICTION | ✓ `stressFactions.js:105-107`; `properFill` :168-175 passes `(hidden)` — CONFIRMED | nothing handed back; NF-11. **Wider than NF-11 says:** `PowerTab.jsx:139` renders `r.factions` unfiltered, so the hidden faction's NAME and its desc "Its presence is not known to the settlement" print in the faction LIST for a player (CONFIRMED no `(hidden)` gate anywhere in `src/components`) | **OK** on the row; new WIRING candidate noted |
| VIS-17 | MODEL | ✓ `npcGenerator.js:1524`, `:1532` — CONFIRMED | nothing handed back (F4-14) | **OK** (CONFIRMED) |
| VIS-18 | STRUCK | no field — §0e is an editorial test (annex :455-465 CONFIRMED) | `[corrected]` hands nothing back — correct. But the mark IS read by the engine (`variantIsAudible`, `stateProseKernel.js:174-178`): the audience model exists; what is authored is WHICH variant carries the mark | **OK** as corrected (CONFIRMED); see FIFTH FLOOR |
| VIS-19 | STRUCK | ✓ `PowerTab.jsx:194`, `:198-215`; `economyDeskRead.js:101`, `:113` — CONFIRMED gates run | `[corrected]` hands nothing back — correct | **OK** (CONFIRMED) |

## §5.1 THE DEFENSE DESK — D-F1 … D-F28

| id | verdict | (b) | (c) / worst sentence | mark |
|---|---|---|---|---|
| D-F1 | CONTRADICTION | ✓ `hasWatch`; `safetyProfile.js:300` — CONFIRMED | "write the wall against its keeping, where a watch stands" — safe | **OK** (CONFIRMED) |
| D-F2 | CONTRADICTION | ✓ `safetyProfile.js:56-62` — CONFIRMED Moderate off a community bonus | nothing handed back; NF-13 | **OK** (CONFIRMED) |
| D-F3 | CONTRADICTION | ✓ :48 | nothing handed back | **OK** |
| D-F4 | CONTRADICTION | ✓ :48 | "the watch's temper where the watch stands" — safe | **OK** |
| D-F5 | CONTRADICTION | ✓ :48 | nothing handed back | **OK** |
| D-F6 | STRUCK | floor 3 relaxed | "keep it" — the face is `dm-only` (annex :2851). Worst: "Somebody at the {seat}" reads as the Mayor (village+ mandated NPC, `npcGenerator.js:1514-1516`) carrying a leash — F3-06's rider, minted after the fold | **CHALLENGE:** keep, but the rider applies: "somebody at the seat" in a town with ONE named Mayor names that NPC's fate (PLAUSIBLE) |
| D-F7 | SPLIT | KEPT `hasWalls` :52 ✓; STRUCK the person | "give the job to somebody, on a walled town" — both halves intact; "somebody whose job that is" at the gate is Guard Captain ⟨Name⟩ at village+ (F3-06) | **OK** both halves (CONFIRMED); F3-06 note |
| D-F8 | STRUCK | ADDENDUM 14 names "keep a key" | worst: "depends on who is holding the keys" — plot hook; no field | **OK** (CONFIRMED the relaxation) |
| D-F9 | STRUCK | as D-F8 | same | **OK** |
| D-F10 | STRUCK | as D-F8 | "somebody willing to enforce it" on Legal Infrastructure: None — no field; F1-12's `safetyProfile.js:333` denies a TRIAL, not an enforcer | **OK** |
| D-F11 | STRUCK | as D-F8 | "somebody's charge rather than nobody's" — safe | **OK** |
| D-F12 | STRUCK | an unmodelled permission is silence | safe | **OK** |
| D-F13 | STRUCK | as D-F8 | safe | **OK** |
| D-F14 | CONTRADICTION | ✓ :48 | "the operator half is now free" — safe | **OK** |
| D-F15 | STRUCK | ✓ `defenseDisplay.js:221` — CONFIRMED the band's own note is arrears | "already owed" = late pay — F4-04 licenses short/late/thin | **OK** (CONFIRMED) |
| D-F16 | STRUCK | silence on cause | "the town has decided that arming itself when needed costs less" — the militia is the unpaid community baseline (`defenseGenerator.js:186-187` comment) so "costs less" agrees with the model | **OK** (CONFIRMED) |
| D-F17 | STRUCK | as D-F16 | safe | **OK** |
| D-F18 | STRUCK | as D-F16 — but the QUOTE is "an end … the town has not yet had to think about": a perfect tense plus a modal future | F2-05 (the table's own row: "the perfect, the durative … the modal future") denies it; the fold declared floor 2 untokened in this slice and this face slipped through as "a cause" | **REVERSE:** should be `[F2]` PROMISE on the temporal half (F2-05, grammar-decidable; no engine field); the cause half stays free. False sentence licensed: "an end the town has not yet had to think about" on a birth-time state with no elapsed course (CONFIRMED F2-05 wording) |
| D-F19 | SPLIT | KEPT `defenseDisplay.js:183-195` ✓ CONFIRMED; STRUCK the possessive | both halves intact | **OK** (CONFIRMED) |
| D-F20 | STRUCK | silence on the reciprocal | `rulingStructure.js:762-767` — `adversarial` = enforcement winning, so "moves against… move back" agrees; "the hall" carries D-F22's kept half below town | **OK** (CONFIRMED) |
| D-F21 | STRUCK | ✓ `safetyProfile.js:283` prints "court system" off the flag — CONFIRMED | "the town's courts" (functional plural) agrees with the printed note; R-4 | **OK** (CONFIRMED) |
| D-F22 | SPLIT | KEPT existence below town + `{seat}` label; STRUCK the baked-power bar | both halves intact; "write the hall at town and up" | **OK** (CONFIRMED F1-20) |
| D-F23 | STRUCK | "as D-F22's struck half — i.e. this row falls **exactly as D-F22 does**" — the gloss STILL contradicts the preserved words (fidelity Finding 6 NOT repaired) | worst: "a falling-out with the hall" on DS-DEF-9 (any tier) at a thorp — F1-20's kept half applies; the row's permission "write the sentence" drops it | **CHALLENGE:** (i) the Finding-6 gloss is unrepaired; (ii) the permission needs D-F22's KEPT half (town and up) — CONFIRMED the cell text |
| D-F24 | CONTRADICTION | ✓ :52 | "write the manning; the perimeter needs the works" — safe | **OK** |
| D-F25 | CONTRADICTION | ✓ :46 | "name the body the town has" — safe | **OK** |
| D-F26 | SPLIT | KEPT walls; STRUCK the layer-crossing on the watch pool | both halves intact | **OK** |
| D-F27 | CONTRADICTION | ✓ `rulingStructure.js:273`,`:280` — CONFIRMED (cited :284/:452; substance holds) | nothing handed back (F1-117) | **OK** (CONFIRMED) |
| D-F28 | CONTRADICTION | ✓ :46/:47 | nothing handed back | **OK** |

## §5.2 THE GENERAL DESK — G-F1 … G-F83

⚠ `DS-GEN-1` (G-F9, 10, 11, 19, 20, 21, 22, 23, 24, 37), `DS-GEN-10` (G-F31) and `DS-POP-1` (G-F15, 16, 17) are in `UNMOUNTED_BLOCKS` (`dossierMounts.js:483-490`, CONFIRMED) — dark today. Their rows bind only when a mount car lights them.

| id | verdict | (b) | (c) / worst sentence | mark |
|---|---|---|---|---|
| G-F1 | CONTRADICTION | ✓ `holderTable.js:279-288` — CONFIRMED | nothing handed back (F1-03) | **OK** (CONFIRMED) |
| G-F2 | CONTRADICTION | the WEAK band arithmetic (PLAUSIBLE) | nothing handed back (F1-29) | **OK** |
| G-F3 | STRUCK | a metonym | "counted in … what the hall issues" — DS-GEN-3 is MOUNTED and fires at every tier; "what the hall issues" is a pure decree-metonym, weaker than G-F30's locative | **CHALLENGE (weak):** the metonym family lacks the tier qualifier the fold gave D-F22/S-F13; at thorp the roster prints `Head-of-household consensus` and the page's own label is "the household heads" (`governanceNarrative.js:101-105`) |
| G-F4 | CONTRADICTION | negation of a printed body | nothing handed back (F1-25) | **OK** |
| G-F5 | SPLIT | KEPT `hasWatch` ✓; STRUCK `dutyNamed: 0` | "say what the watch is for" — both halves intact | **OK** (CONFIRMED) |
| G-F6 | CONTRADICTION | ✓ `defenseGenerator.js:244` — CONFIRMED | nothing handed back | **OK** (CONFIRMED) |
| G-F7 | CONTRADICTION | Fortress reachable without all three (PLAUSIBLE; `defenseGenerator.js:510` readiness formula) | nothing handed back | **OK** |
| G-F8 | CONTRADICTION | ✓ :52 | nothing handed back | **OK** |
| G-F9 | CONTRADICTION | ✓ :48 (dark block) | "a thick book — where there is a watch" — safe | **OK** |
| G-F10 | CONTRADICTION | ✓ :48 (dark) | nothing | **OK** |
| G-F11 | CONTRADICTION | negation (dark) | nothing | **OK** |
| G-F12 | CONTRADICTION | ✓ :48 | nothing | **OK** |
| G-F13 | CONTRADICTION | ✓ :48 | "the capacity claim is free" — safe | **OK** |
| G-F14 | CONTRADICTION | ✓ :48 | nothing | **OK** |
| G-F15 | STRUCK | W24 (dark) | "the burial rolls run longer than the harvest explains" — a relation, not a count; F1-24 would need the parish holder if CITED | **OK** (PLAUSIBLE) |
| G-F16 | STRUCK | a capacity phrase (dark) | safe | **OK** |
| G-F17 | STRUCK | W24 (dark) | "The departure rolls are empty" — a record no holder kind keeps; F1-24's spirit (a record cited to nobody) but no kind to resolve | **CHALLENGE (weak):** note F1-24; dark today |
| G-F18 | STRUCK | W24 + a comparative | "more entries opened than closed" — a relation; F2-01 bars magnitudes, not relations | **OK** (PLAUSIBLE) |
| G-F19 | CONTRADICTION | ✓ :52 (dark) | nothing | **OK** |
| G-F20 | CONTRADICTION | existence (dark) | nothing (F1-20) | **OK** |
| G-F21 | STRUCK | a metonym (dark) | "neither holds enough of the hall" — possession of a hall at thorp | **CHALLENGE (weak, dark):** as G-F3 |
| G-F22 | CONTRADICTION | existence across an occupation (dark) | nothing | **OK** |
| G-F23 | STRUCK | a metonym (dark) | "what is argued IN the hall now" — a locative: F1-20 reads it as a place | **CHALLENGE (dark):** locative metonyms presuppose the room; tier-qualify |
| G-F24 | STRUCK | the seat is the class word (dark) | safe | **OK** |
| G-F25 | STRUCK | a metonym (DS-GEN-7, mounted) | "arrangements the hall would rather not itemise" — the hall as an agent; no room asserted | **OK** (PLAUSIBLE), the essay's case is weakest here |
| G-F26 | STRUCK | a metonym + class word (mounted) | "its own hall still governs" under an occupation — `stressTypes.js:38-39` "Local institutions continue under oversight" (F1-78) makes "still governs" the engine's own state; "still" is licensed by a recorded present condition | **OK** (CONFIRMED F1-78 text) |
| G-F27 | STRUCK | `{govFaction}` exists | the SECOND quote "they meet in the market rather than in the hall" seats a MARKET — F1-10 (`hasMarket`, :56) — on DS-GEN-7's temple-economy pool, whose key reads no market flag; the strike hands back "write the sentence" over both quotes | **REVERSE:** should be SPLIT — KEPT: "the market" as a standing body (`inst.hasMarket` false, `priorityHelpers.js:56`, floor 1); STRUCK: the seat metonym. False sentence licensed: "they meet in the market rather than in the hall" on a marketless town whose roster prints no market row (CONFIRMED flag; PLAUSIBLE that the pool fires on such a town) |
| G-F28 | STRUCK | silence on the decreeing body | "keep it" — safe | **OK** |
| G-F29 | STRUCK | metonym ×2 (DS-REL-1, mounted) | "both halls" — the neighbour's hall at an unknown tier | **CHALLENGE (weak):** as G-F3 |
| G-F30 | STRUCK | a metonym (DS-HK-1, MOUNTED) | "Instructions from {settlement}'s hall are being complied with slowly" fires on any legitimacy_crisis clock at any tier; at thorp the roster prints a consensus row and the label "the household heads" — the sentence presupposes a hall the page denies (F1-20) | **CHALLENGE (strong):** tier-qualify or SPLIT as D-F22 was; the fold's own F1-20 reads "a hall … as a PLACE, below town tier" and "from the hall" is locative (CONFIRMED mount + F1-20) |
| G-F31 | STRUCK | a metonym (DS-GEN-10, DARK) | "{settlement}'s hall, and the rooms that matter more" asserts a BUILDING WITH ROOMS — not a metonym at all | **CHALLENGE (strong; dark today):** SPLIT when lit — KEPT below town (F1-20); STRUCK the power half. Recorded as CHALLENGE not REVERSE only because `DS-GEN-10` is unmounted at `f2da5a3ee` (CONFIRMED) |
| G-F32 | STRUCK | unnamed person licensed | safe | **OK** |
| G-F33 | STRUCK | role bar | "rules here have rooms, and the rooms have officers" — ADMINISTERED = `hasCourtSystem && hasPrison`, so a hall/courthouse row backs the rooms | **OK** (CONFIRMED key) |
| G-F34 | STRUCK | atmosphere on a founding-age read | "has not yet been improved on" — a perfect, but the read hands the age band | **OK** (PLAUSIBLE) |
| G-F35 | STRUCK | unnamed person | safe | **OK** |
| G-F36 | STRUCK | persons | safe | **OK** |
| G-F37 | STRUCK | persons (dark) | safe | **OK** |
| G-F38 | STRUCK | a typed power with no read | nothing handed back | **OK** |
| G-F39 | CONTRADICTION | ✓ :45 — CONFIRMED | nothing (NF-4) | **OK** (CONFIRMED) |
| G-F40 | STRUCK | wiring | nothing | **OK** |
| G-F41 | CONTRADICTION | ✓ :48 | nothing | **OK** |
| G-F42 | CONTRADICTION | ✓ :63 | nothing | **OK** |
| G-F43 | CONTRADICTION | both disjuncts | "assert one" — safe | **OK** |
| G-F44-48 | STRUCK | ✓ `hookEscalation.js:394-421` — CONFIRMED the five strings | `[corrected]` hands nothing back — correct. But the cell's pointer to "NF-5 · NF-9 for the sibling instrument defects" substitutes: the hookEscalation strings are in NONE of NF-1…13 (the fold's `see newFindings` was dangling and remains so) | **OK** on the row; fidelity 9b PARTIAL |
| G-F49-83 | STRUCK | W24 | "write rolls, books, counts, ledgers on any read" — F1-24 (holder) survives for a CITED record; the words are free | **OK** (CONFIRMED F1-24) |

## §5.4 THE POWER DESK — P-R1a … P-R6, P-W1, P-W2

| id | verdict | (b) | (c) / worst sentence | mark |
|---|---|---|---|---|
| P-R1a | CONTRADICTION | ✓ :48 | nothing | **OK** |
| P-R1b | CONTRADICTION | ✓ :52/:48 | nothing | **OK** |
| P-R1c | CONTRADICTION | negation | nothing (F1-25) | **OK** |
| P-R1d | CONTRADICTION | ✓ :48 | nothing | **OK** |
| P-R1e | CONTRADICTION | ✓ :48 | nothing | **OK** |
| P-R1f | CONTRADICTION | ✓ :63 | nothing | **OK** |
| P-R1g | STRUCK | a place-metonym at town+ | "write the hall" — the cell drops its own ground's "at town+"; DS-POW-2 fires at every tier | **CHALLENGE:** the cell must carry the tier qualifier its ground states (F1-20) |
| P-R1h | CONTRADICTION | ✓ `institutionServices.js:530` — CONFIRMED | nothing (F1-21) | **OK** (CONFIRMED) |
| P-R1i | STRUCK | a body word with NO engine row | "keep the clearinghouse" — a BUILDING through which goods move back into lawful circulation; the institutions roster is a closed world (floor 1 as the brief states it) and F1-19 already keeps "a warehouse, a yard, a bonded store as a BUILDING" on `hasWarehouse` :60. The clearinghouse is that class under another name | **CHALLENGE (strong):** either the closed-roster reading applies (F1-19's class, floor 1) or fold rule 1's "on the list" test does — the two disagree and the fidelity's 9c (RT2.4-09) is the same structure |
| P-R1j | STRUCK | the key IS `council` | safe | **OK** |
| P-R4a | STRUCK | 'City Clerk' emitted; act charge rested on the person bar | "the clerks" plural — F3-06's plural escape | **OK** |
| P-R4b | STRUCK | as P-R4a | safe | **OK** |
| P-R4c | STRUCK | as P-R4a | safe | **OK** |
| P-R4d | STRUCK | a person with a disposition | "enough officials are agreeable" — plural; `'Corrupt Official'` singular mandated only under occupied/insurgency (`:1524`, `:1532`) | **OK** (CONFIRMED) |
| P-R4e | STRUCK | unnamed person; `dm-only` carries visibility | "The person who speaks for {faction} … is not free to speak" — the mark is honoured by `variantIsAudible`; but see VIS-04: the page's capture badge already tells the player the rung | **OK** (CONFIRMED mark honoured) |
| P-R4f | STRUCK | unnamed criminal person | safe | **OK** |
| P-R4g | STRUCK | unnamed leader | "A leader who bound the combination … left the seat" — an EVENT the record did not run (F2-04: "the seat was lost"); `leaderNpcId` is typed and unread, and nothing records a departure | **REVERSE:** should be `[F2]` PROMISE (F2-04) on the departure; the unnamed leader stays free. False sentence licensed: a leader "left the seat" on a birth record that ran no such event (PLAUSIBLE — no departure field found; the archive's own VERBATIM says the desk reads `leaderNpcId` nowhere) |
| P-R4h | STRUCK | maxim frame | safe | **OK** |
| P-R5a | STRUCK | fused agent | safe | **OK** |
| P-R5b | SPLIT | KEPT `powerStateProse.js:962` `faction: governing` ✓ CONFIRMED; STRUCK person/depth/relation | both halves intact | **OK** (CONFIRMED) |
| P-R5c | STRUCK | unread scalar; `dm-only` | safe | **OK** |
| P-R5d | CONTRADICTION | ✓ `:860` + `:953` `seat: governing, faction: governing` — CONFIRMED | nothing (F1-119) | **OK** (CONFIRMED) |
| P-R2 | CONTRADICTION | ✓ `:875-876`, `:953`, `:962` — CONFIRMED | nothing | **OK** (CONFIRMED) |
| P-R3 | CONTRADICTION | ✓ `:900-901`, `:962` — CONFIRMED | nothing (NF-7) | **OK** (CONFIRMED) |
| P-R6 | CONTRADICTION | `factionDynamics.js:132-133` (PLAUSIBLE) | nothing (F1-59) | **OK** |
| P-W1 | CONTRADICTION | `resolveBag` is NOT in product code: it is `tests/helpers/dossierComposedFill.js:138`, a regex scanner over `powerStateProse.js` source; `powerStateProse.js:634` is `const slots = {` inside `powerLadderRung` — the first bag the scanner meets — CONFIRMED | the substance holds (the card prints the ladder's bag for DS-POW-1); the ground's wording ("`resolveBag` first-match at `powerStateProse.js:634`") reads as if the product had the function | **CHALLENGE (cite):** name the helper; the finding stands (CONFIRMED) |
| P-W2 | CONTRADICTION | `powerStateProse.js:709-713` (not read; PLAUSIBLE) | nothing | **OK** (PLAUSIBLE) |

## §5.5 THE STRESSORS DESK — S-F1 … S-F34

| id | verdict | (b) | (c) / worst sentence | mark |
|---|---|---|---|---|
| S-F1 | SPLIT | KEPT `hasGarrison` ✓; STRUCK "invented" (`stressorDynamics.js:689` CONFIRMED the hook) | both halves intact | **OK** (CONFIRMED) |
| S-F2 | CONTRADICTION | ✓ :52 | nothing | **OK** |
| S-F3 | STRUCK | class plural + decision | "have decided to finance something else" — a present-perfect decision; borderline F2-05 but a standing condition | **OK** (PLAUSIBLE) |
| S-F4 | CONTRADICTION | ✓ :65 | "the pulpit needs a house" — safe | **OK** |
| S-F5 | STRUCK | the engine's hook `:701` "Wards around the council hall failed twice this tenday" — CONFIRMED | "have failed more than once" — an ordinal over events (F2-05). The hook itself is a product F2 breach; the table's W-16 says "never lift the clause verbatim (craft)" while this cell says "write the sentence" | **CHALLENGE:** the two dispositions collide; the face should be the standing condition ("the wards do not hold") not the count |
| S-F6 | STRUCK | hook `:705` — CONFIRMED | "A rump session voted itself emergency powers" — an EVENT the record did not run (F2-04), lifted from the hook | **CHALLENGE:** as S-F5 (W-16) |
| S-F7 | CONTRADICTION | ✓ :46/:52 | "write the occupier's men" — safe (F1-121) | **OK** |
| S-F8 | STRUCK | dark pool, no read (DS-CND-1 war layer aggressor side — `stressorsStateProse.js:341-342` lists the family; PLAUSIBLE it never fires) | `[corrected]` hands nothing back — correct | **OK** (CONFIRMED the correction) |
| S-F9 | STRUCK | dark pool | "Garrisons, administrators and suppression tie down strength" — bare "garrisons" for the AGGRESSOR's holdings; F1-121/F1-122 bind when lit | **CHALLENGE (dark):** the cell should carry the possessive when the pool lights |
| S-F10 | CONTRADICTION | ✓ :48 | "write patrols" — safe | **OK** |
| S-F11 | STRUCK | ✓ `defenseGenerator.js:244-253` — CONFIRMED the watch arms the order purse (and :177-178 the military) | safe (F4-19) | **OK** (CONFIRMED) |
| S-F12 | STRUCK | ✓ `:844` — CONFIRMED verbatim `reason` | safe (rule 3); the `reason` prints on the page | **OK** (CONFIRMED) |
| S-F13 | SPLIT | KEPT thorp has no hall; STRUCK hall-as-agent | both halves intact | **OK** |
| S-F14 | CONTRADICTION | ✓ :63 | "write the issuing rule" — F1-76 bars "by rule rather than by price" on a famine (`stressorDynamics.js:469`); the cell's own permission names the barred clause | **CHALLENGE:** the cell hands back exactly the clause F1-76 keeps (CONFIRMED F1-76 in the table) |
| S-F15 | CONTRADICTION | ✓ :56 | "write the price" — F1-104 bars a price CAUSE; a price is a magnitude (F2-01) | **CHALLENGE (weak):** "the price has become …" is free only as a standing condition, never a figure |
| S-F16 | CONTRADICTION | the roster's religious rows | the GROUND says "the recency is now free" — "the tending is new" is an age/elapsed claim (F2-05/F2-07) | **CHALLENGE:** the ground hands back a floor-2 clause inside a CONTRADICTION row |
| S-F17 | STRUCK | hook `:706` — CONFIRMED | safe | **OK** |
| S-F18 | STRUCK | unnamed person (the ADDENDUM 14 example) | safe | **OK** |
| S-F19 | STRUCK | unnamed role | "the clerks" plural — F3-06 plural escape | **OK** |
| S-F20 | STRUCK | 'overseer' is a role token | safe (the GENERATION slave_revolt record asserts the revolt — F1-80) | **OK** |
| S-F21 | STRUCK | hook `:716` — CONFIRMED "The collectors now travel in pairs, then in fours, and last week not at all" | "then in fours, and lately not at all" — a TREND (F2-08) and an elapsed course, lifted from a hook whose sibling says "these ten years" | **CHALLENGE:** as S-F5 (W-16) |
| S-F22 | SPLIT | KEPT `hasWalls` ✓; STRUCK role plural/loyalty/"ruler" (hook `:690` "loyal to the seat" CONFIRMED) | both halves intact | **OK** (CONFIRMED) |
| S-F23 | STRUCK | already REFUTED | safe | **OK** |
| S-F24 | STRUCK | hook `:679` | safe | **OK** |
| S-F25 | STRUCK | role tokens; "the movement claims are free" | "The mages who fled … have not come back" — a departure EVENT (F2-04) and a perfect (F2-05); no field records a flight | **REVERSE:** should be `[F2]` PROMISE on the movement claims (F2-04/F2-05); the role words stay free. False sentence licensed: "the mages who fled have not come back" on a birth record that ran no flight (PLAUSIBLE — no departure field; the archive's VERBATIM itself says "the MOVEMENT claims are the finding") |
| S-F26 | STRUCK | hook `:706` | safe | **OK** |
| S-F27 | STRUCK | a collective person with an intention | "The soldiers here have stopped being the seat's instrument" seats a standing BODY on a `barracks_coup` pool. `barracks_coup` is chosen off the leading challenger's `military` archetype (`stressorDynamics.js:877`, `:912`); the `'Military/Guard'` faction is minted on `militaryPower > 5` (`rulingStructure.js:571`, `:596`) — a PRIORITY test that never reads the roster. S-F1 KEPT `hasGarrison` for the SAME pool | **REVERSE:** should be SPLIT — KEPT: "the soldiers here" as a standing body, `inst.hasGarrison`/`hasMilitaryInst` false (`priorityHelpers.js:45-46`; DS-DEF-5 prints "NO organized force at all", `defenseStateProse.js:1276`), floor 1 (F1-02/F1-04); STRUCK: the intention. False sentence licensed: "The soldiers here have stopped being the seat's instrument" on a hamlet whose roster prints no force row (CONFIRMED all four cites) |
| S-F28 | STRUCK | activity vs body | the body half is kept at S-F10 | **OK** |
| S-F29 | CONTRADICTION | `factions[].power` prints | "the deadlock without the arithmetic" — safe | **OK** |
| S-F30 | STRUCK | dark pool | "costs the occupier more each season" — a trend (F2-08) | **CHALLENGE (dark):** floor 2 when lit |
| S-F31 | CONTRADICTION | `.find()` picks the wrong class (W-17) | "name the crisis" — safe | **OK** |
| S-F32 | STRUCK | instrument mismatch | nothing | **OK** |
| S-F33 | STRUCK | unnamed persons | the `:4122` face "Somebody in {settlement} answers elsewhere, and the town KNOWS IT without knowing who" is a PLAYER face on INFILTRATED; `stressFactions.js:107` prints "Its presence is not known to the settlement." as the hidden faction's desc and `stressNarrative.js:96` "The settlement does not know." — F1-73 (kept in the table) | **REVERSE (partial):** should be SPLIT — KEPT: the town KNOWING (`stressFactions.js:107`; `stressNarrative.js:96`; floor 1, F1-73); STRUCK: the person referents (`:4114`, "somebody"). False sentence licensed: "the town knows it without knowing who" beside a faction row that says the town does not know (CONFIRMED both strings) |
| S-F34 | STRUCK | record words | safe | **OK** |

## §5.6 THE WARFAITH DESK — W-1 … W-35

| id | verdict | (b) | (c) / worst sentence | mark |
|---|---|---|---|---|
| W-1 | CONTRADICTION | ✓ :56 + the hall row | nothing (F1-10/F1-20) | **OK** |
| W-2 | CONTRADICTION | a Garrison + Parish church town draws it | nothing (F1-25) | **OK** |
| W-3 | CONTRADICTION | the roster's religious rows | "no predicate on a deity" — safe (F3-02) | **OK** |
| W-4 | CONTRADICTION | as W-3 | "keep the crossroads" — safe | **OK** |
| W-5 | CONTRADICTION | a share band | "write the calendar" — safe | **OK** |
| W-6 | CONTRADICTION | a share band | nothing | **OK** |
| W-7 | STRUCK | the pool is not routed (PLAUSIBLE; the annex names it) | `[corrected]` hands nothing back — correct | **OK** |
| W-8 | CONTRADICTION | ✓ :46 | nothing | **OK** |
| W-9 | CONTRADICTION | a cause token | "write the unmarked days" — safe; F1-97 keeps "a suppressed creed's shrines closed" as a finding, which is exactly this face's other half | **OK**, F1-97 note |
| W-10 | STRUCK | role bar | safe | **OK** |
| W-11 | STRUCK | person-plural inside a metonym | "nobody IN the hall" — locative at thorp (F1-20) | **CHALLENGE (weak):** as G-F30's family |
| W-12 | STRUCK | unnamed decider | safe | **OK** |
| W-13 | STRUCK | unnamed person; `dm-only` carries visibility | "Somebody at {settlement} is being funded from outside" — the mark is honoured; the fact is not an engine secret (VIS-12) | **OK** (CONFIRMED mark) |
| W-14 | STRUCK | person-plural | "people AT the hall" — locative | **CHALLENGE (weak):** as W-11 |
| W-15 | STRUCK | as W-11 (dark) | safe today | **OK** |
| W-16 | STRUCK | the field has NO WRITER — identical to VIS-11's wiring ground | `[archivist's reading]` "write the sentence" where VIS-11 got "nothing is handed back" for the same fact | **CHALLENGE:** template misfire — route as VIS-11 (CONFIRMED the two cells) |
| W-17 | CONTRADICTION | ✓ `governanceNarrative.js:128-130` — CONFIRMED | nothing (F1-23) | **OK** (CONFIRMED) |
| W-18 | CONTRADICTION | as W-17 | nothing | **OK** |
| W-19 | STRUCK | silence | "keep the councils" — safe (followers' organ, D-01 untouched) | **OK** |
| W-20 | STRUCK | ✓ `warFaithStateProse.js:96` — CONFIRMED no writer | `[corrected]` hands nothing back — correct | **OK** (CONFIRMED) |
| W-21 | STRUCK | role bar | safe | **OK** |
| W-22 | STRUCK | record words on a dark pool | safe; `tenure` never projected (F2-02) | **OK** |
| W-23 | CONTRADICTION | ✓ `treatyDocument.js:73` vs `religionState.js:620` — CONFIRMED | "name which seat" — safe (F1-125) | **OK** (CONFIRMED) |
| W-24 | CONTRADICTION | ✓ `occupationStatus.js:95-103` (PLAUSIBLE) + :46 | nothing (F1-121) | **OK** |
| W-25 | CONTRADICTION | ✓ `:58` vs `:63` — CONFIRMED | "seat the possessor" — safe (F1-124) | **OK** (CONFIRMED) |
| W-26 | STRUCK | ✓ `:78` — CONFIRMED the engine's own string | safe | **OK** (CONFIRMED) |
| W-27 | CONTRADICTION | ✓ `holderTable.js:599-615` — CONFIRMED | nothing (F1-122) | **OK** (CONFIRMED) |
| W-28 | STRUCK | fused sequencing | safe | **OK** |
| W-29 | CONTRADICTION | ✓ :52/:53 | nothing | **OK** |
| W-30 | STRUCK | ✓ instrument defect — CONFIRMED `:1681` | `[archivist's reading]` "write the sentence" where VIS-09, the same defect, got `[corrected] nothing is handed back` | **CHALLENGE:** template inconsistency; harmless (the three pools ARE player pools) but the cell is the archivist's, not the fold's |
| W-31 | STRUCK | the fence is vacuous while DS-WAR-5 is dark (`dossierMounts.js` lists DS-WAR-4/5 dark — CONFIRMED) | safe | **OK** (CONFIRMED) |
| W-32 | STRUCK | standpoint | safe | **OK** |
| W-33 | STRUCK | an angle tag | safe | **OK** |
| W-34 | CONTRADICTION | ✓ `:930-933` — CONFIRMED | nothing (F1-120) | **OK** (CONFIRMED) |
| W-35 | CONTRADICTION | ✓ `:599-615` — CONFIRMED | nothing (F1-122) | **OK** (CONFIRMED) |

---

## THE STRIKES MOST LIKELY TO BE WRONG — my ruling on each, for my range

1. **The court** (`RT2.1-14`/`RT2.2-07`, sibling's; `OV-8` mine). The essay's case is weaker than written: `safetyProfile.js:283` prints "A functioning court system means…" off `hasCourtSystem` on a Town-hall-only town, so the page ITSELF calls it a court system; the WORD cannot contradict the page. R-4 keeps the criminal PROCEDURE (F1-12). **OV-8 OK** (CONFIRMED).
2. **The hall metonyms** (`G-F3/21/23/25/30`). The essay is right on the LOCATIVE members (G-F23 "in the hall", G-F30 "from the hall", and G-F31 "the rooms") and weakest on the pure agent-metonyms (G-F25). Two of the five sit on a dark block (`DS-GEN-1`); G-F30 is mounted (`DS-HK-1`) and fires at every tier. **CHALLENGE, tier-qualify** — the fold already drew this line at D-F22/S-F13 and did not carry it here.
3. **"The line"** (`RT2.1-37`, sibling's). Not ruled here.
4. **The visibility marks** (`VIS-05/18/19`). The corrected cells hand nothing back — correct. But the essay's own premise ("no engine field will catch it") is FALSE as a matter of the dock: the engine models audience (`variantIsAudible`, `COVERT_SOURCES`, the player projections). What is authored is WHICH variant carries the mark. And the row the essay treats as the safe comparator, **VIS-04**, is the one that is wrong: the capture badge is player-visible (`PowerTab.jsx:344-350`). See THE FIFTH-FLOOR QUESTION.
5. **The hospital** (`RT2.1-19`/`RT2.2-22`, sibling's; `OV-15` mine). OV-15 keeps the building as CONTRADICTION already (F1-14 names the `Healer` PERSON row). **OV-15 OK**.

## APPENDIX NF rows — read against the dock

NF-1 OK (CONFIRMED) · NF-2 OK (CONFIRMED) · NF-3 OK (CONFIRMED) · NF-4 OK (CONFIRMED) · NF-5 OK (CONFIRMED `:1681`) · NF-6 OK (CONFIRMED) · NF-7 OK (CONFIRMED) · NF-8 OK (CONFIRMED) · NF-9 CHALLENGE (cite: `resolveBag` is a test helper, see P-W1) · NF-10 OK (PLAUSIBLE) · NF-11 OK but UNDER-STATED (the faction LIST also prints it, `PowerTab.jsx:139`) · NF-12 OK (CONFIRMED) · NF-13 OK (CONFIRMED) · NF-14 GAP carried verbatim ("forty on the roll") — OK · NF-15 GAP carried — OK, but it omits the VIS-04 badge fact that decides it.

**NEW WIRING candidates found by this seat (not in NF-1…15):** (W-20) `PowerTab.jsx:344-350` renders the criminal-capture badge to the player audience; (W-21) `PowerTab.jsx:139` renders `'Unknown Faction (hidden)'` and its "not known to the settlement" desc in the faction list to the player audience. Both CONFIRMED by reading the component; neither has a `playerView` gate.
