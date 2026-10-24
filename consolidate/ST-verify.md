# ST — FIDELITY VERIFICATION OF THE COMPLETED CONSOLIDATION (P8, seat FV-ST, 2026-10-23, cloud)

**COUNTS: sampled 125 ledger rows · holds 124 · fails 1 (row-level, F1), plus 2 volume-level fails in THE READER'S GUIDE (G1, G2).** Three fails need a cure: F1 (a stale r5 belief-owner sentence in §0), G1 (guide item 5 over-claims the one leaf) and G2 (guide item 8 over-generalises "readiness"). Seven notes (N1–N7) follow. They are not fidelity fails.

**THE RATCHET (re-run on `docs/DESIGN_FP_ARCH_ST.md` as it stands, with `ST-allow.txt`): `RATCHET 3 DIFFERENCE CLASSES`.** Tokens 1035 → 946 · missing 0 · new-in-new 9; cites 58 → 57 (missing 1: `realmManifest.js :: COURSE_TARGET_SEP`); laws 20 = 20; OD 68 = 68; ⭐ 17 → 18; DRAFT 42 → 41; UNMEASURED 24 = 24; wave ids 7 → 6; flags 16 = 16; review markers left 0. `cmp consolidate/ST-new.md` against the volume gives IDENTICAL. Ledger §6c records 945 · new-in-new 8. The one extra token is `MIGHT_SEVERITY`, which the SEAMS cure added (ledger "SEAMS CURES": "one new-in-new token, `MIGHT_SEVERITY`, MN's registered name"). I re-proved each class by script:
- **Cite.** The short form `realmManifest.js :: COURSE_TARGET_SEP` occurs only at old L836 (the moved cure record). The full `events/realmManifest.js :: COURSE_TARGET_SEP` stands at old L371 and new L374.
- **DRAFT.** The one lost DRAFT is old L796 (cure record, "Q3 … unchanged, DRAFT"). The per-line sweep shows no DRAFT or UNMEASURED difference on any aligned body line.
- **Waves.** `ST-40` was a false positive: old L716 "OD-ST-40 — WITHDRAWN", the only `ST-40 — ` hit. ST-0 … ST-5 and ST-2b all stand in §10.
- **⭐.** The +1 comes from the Ruled column. The cure record's ⭐ moved with it. No body ⭐ is lost; the sweep shows additions only.
- **New tokens.** These are the trail paths, `src/domain/sites/siteLedger.js :: applySiteEvent`, `MIGHT_SEVERITY` and seat 1's tokenizer artifact (new L187; a table-cell pairing with no design text).

**THE ALLOW FILE (98 lines = 13 + 85) against ledger §4 and §6c.** I located every token in the old text by script.
- Every MOVED token occurs only in old L1–16 or L743–949.
- Every change-note or superseded token occurs only inside its named bracket (B157 L306, B143 L276, B082 L191, B308/B438, B057/B058 L94/152, B159 L310, B163/B283 L318/475).
- The one body occurrence is `cure/D-ST-r5.md` (old L707). The ledger explains it as a review-log pointer dropped with its round label.
- The three bare names have their full forms in the new text: `spatial/rumorNetwork.js :: captureContent` ×2, `warCapacityReads.js :: coalitionJoinFeasibility` ×2, and the `departTick: depart, arrivalTick: depart + weeks` line.
- No line lacks a true reason.

**THE MARKER COUNT (my own balanced scan, `scratchpad/fvst/scan.py`).** Body brackets: 521 (CURED 457 · REFINED 61 · ADDED 3). One never closes: old L394, B236, as the ledger says. Nested: 6 (one REFINED at L152 and five `↳` inside brackets). Outside brackets: `↳` 8, `STOP` 37, `(fp-final …)` 0. Header and status lines: 8. Cure-record headers: 9. Round words: 48 by the ledger's regex. **Total 637 = the ledger's 637 rows.** My B-index matches the ledger's B ids at every old line I sampled. N3 covers the round-word count.

**THE CURE RECORD.** `history/ST-cure-record.md` contains old L3–13 and old L743–949 each as one contiguous verbatim block (script). Its only other lines are its four part headings. The volume's title (old L1) is the only old header line outside it, and it stays in the volume.

**NUMERAL COLLAPSE CHECK.** Every `x..y` range of the old body survives byte for byte: `0..100` ×2, `0..1` ×4, `ENC-HL-01..03`, `OD-ST-47..50`. The second `ENC-HL-01..03` and `0..1")` sit in old L9 and L865, both moved. No decimal appears in the new text that the old text lacks. No collapse.

## THE FAILS
- **F1 — §0's `pulseKernel.js` row keeps the superseded r5 belief-owner wording (old L69, ledger B018; new L74).**
  - NEW: "the measured reason the at-hand sighting is a WRITTEN BELIEF ROW in the holder's own belief record (MN's, THE BODIES'), never a telling".
  - The later ruling (old L200's r6 text and B.2 brackets) is "THE ONE SIGHTING STORE `spatialLedgers.sightings` … its one writer `recordSighting`". New §2.4 L203 and ST2 L89 state that ruling. Ledger §3 item 4 commits to restating "the holder's own belief record (MN's, THE BODIES')" at the r6 ruling wherever it stands without its r6 bracket. L74 is the one site missed: a grep of the new text finds no other.
  - The new text now contradicts itself (§0 against §2.4).
  - **Cure:** "… a WRITTEN BELIEF ROW in MN's one sighting store (`spatialLedgers.sightings`, by `recordSighting`), never a telling …".
- **G1 — THE READER'S GUIDE item 5 over-claims the mount.**
  - GUIDE: "the keep enters … `buildCapacityLookup` … `resolveSiegeVerdict` … `evaluateWarLayer` (§4); every other lean comes from the one leaf `siteTermAt`".
  - The text names other mounts. The danger arm's two inputs are `sitePresenceFeeder` and `siteSuppression`, which §3.4 registers into MN's `presenceTerms` composed inside `embattlement.js :: advanceEmbattlement`. The approach fort is held by PS's `holdBeforeNode` in THE PASSAGE's transit leaf (§4.3). The watchtower is `siteWitnesses`, an input of PR's `witnessedCrossing` (§2.4).
  - §9 L517 lists them beside `siteTermAt` as separate leans. §2.4 and §7.1 (2) scope "the one leaf" to the hosts of §3.3.
  - The guide drops the scope and omits the danger arm's host. This is the same "every … where the text names exceptions" pattern this pass failed elsewhere.
  - **Cure:** "every other lean of §3.3 comes from the one leaf `siteTermAt` …; the danger feeder and suppressor register into MN's one presence composition (`embattlement.js :: advanceEmbattlement`, §3.4), and the approach fort is held by THE PASSAGE's `holdBeforeNode` (§4.3)".
- **G2 — THE READER'S GUIDE item 8 over-generalises the "readiness" ruling.**
  - GUIDE: "'readiness' — a site's garrison value `siteReadiness01` and its words `SITE_READINESS`, never the landed `readiness01` (a town's or an army's martial readiness) …".
  - The volume uses "readiness" for the landed town index in several places:
    - ST9 L103: "The readiness index (`buildThreatByCid`) … the town mobilizes … A held fort adds no readiness term". `buildThreatByCid` lives in master's `martialReadiness.js`, which is `readiness01`'s module.
    - Guide item 3 itself: "for the readiness index (… ST9)".
    - OD-ST-51 L700: "the veil holds at the readiness index".
  - The fold §5 ruling is "prose always qualifies ('war readiness', 'the keep's readiness')". It is not "the word means the site's value".
  - **Cure:** name the third sense: "'readiness' — a site's garrison value `siteReadiness01` and its words `SITE_READINESS`; never the landed `readiness01` (a town's or an army's martial readiness, which the readiness index `buildThreatByCid` of ST9 moves) or `beliefMap.js`'s believed `readiness` — prose always qualifies".

## NOTES (not fails)
- **N1 — cosmetic.** New L97 (ST6) reads "never by this clock (§6.1 step 3).. COIN is the W-COIN slot". It is a double period (old "3). ." with a bracket between).
- **N2 — B141 lost its inline "vetoable" (old L272).** The bracket: "the raider gate is the same double count one seam over …; vetoable; ROUTE BD to confirm no third row". New L275 keeps the content without "vetoable". The vetoability is carried by OD-ST-44's Ruled cell ("a refinement beyond the brief (the gate row) · by delegation · vetoable") and by the header. This is the same kind as CH's N3.
- **N3 — the round-word count is regex-relative.** The ledger's 48 H rows leave six body round words outside brackets without a row (old L228, 634, 681, 687, 690 and one at L102). Each is removed or restated in the new text: "rounds 1–5 minted" is gone; "round-4 arithmetic" became "truth-keyed arithmetic"; "the round-2/-3/-4 additions" were restated by their OD ids. A grep of the new text finds "round" only in design senses ("PR's round", "the patrol round trip") and §15. Nothing survives, and no row is missing a disposition.
- **N4 — OD-ST-49's dropped "horizon" clause (the lane's PLAUSIBLE reading): HOLDS, CONFIRMED.** The r6 tail makes the store MN's. MN §3.5 item 9 states the store's horizon ("forgotten at the long rumor TTL"). ST §13.1 THE MENACE keeps "MN's horizon, e.g. the rumor TTL" (L710). BD's (1) correctly drops "with BD's horizon", because the row is no longer BD's. No counterforce is lost.
- **N5 — the old r4 phrase in THE VEIL (new L203).** "written into the holder's one belief for THAT court alone" is compatible with the one store (one belief per court × subject) and is not the r5 belief-owner wording. Left as is.
- **N6 — §2.2 (new L176).** "The map's own kind vocabulary was NOT reported" became "is the map's". The ruled consequence stands (ST maps the quoted words; V14's full list is asked of the map program). It is a fair restatement of a closed open question.
- **N7 — the twelve SEAMS cures (ruled corrections, not lane folds): all twelve verified.** Old body MN17 sites: L200 ×5 (a sixth at L200 sits inside a bracket), L349, L420, L467, L605, L625, L682 and L714, giving twelve. The new text has 0 "MN17".
  - "might↔magnitude map" → MN §4.1's `MIGHT_SEVERITY` table (MN L269: "ONE table for the press and for the news … by `magnitudeBandOf`").
  - The typed `menaceId`/`menaceName` → MN §3.5 (3) ("Two rumor content slots — `menaceId`, `menaceName`").
  - Tellings, rumors, raise news and the typed-slot idiom → MN7 ("THE WORLD KNOWS IT BY REPORT … typed fields (`menaceId`, `menaceName`) on the Herald entry and the rumor content").
  - Each names the right MN law or section.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B014 · B031 · B056 · B085 · B172 · B388 · B436 · B509 (ST-r2-1, BLOCKING) | HOLD | ST6 (new L97) states the derived band; THE DM'S BAND IS A CEILING `min(fundingSet, derived)`; COIN is the W-COIN slot with its one leaf-first car; the settlement band is exported for the owner's patrol word (quoted). §6.1 step 3 states the open walk-away. OD-ST-5 carries the ceiling, and STOP-ST-1 (RULED) carries the ruling |
| B069 · B135 · B294 · B475 (ST-r2-2 · HOST-r2-3, BLOCKING) | HOLD | crossing row: J385 wins, "SLOWS the pass and never cuts it — `spatialCost.js :: SLOW_NOT_SEVER_MAX`"; tags only removed (new L265, L485, L685) |
| B034 · B050 · B063 · B124 · B133 · B256 · B395 · B459 (SEAMS-r3-1, BLOCKING) | HOLD | "A CONCLAVE MAKES NO DEN" (ST15 L115); `band`/`cult` "never holder kinds" with the census and the owner's quote (L157); the §3.1 paragraph (L251) "never a hazard to anyone; a cult is never an `untied` holder"; the shrine "carries no untied `religiousConversionGate` row" (L263); OD-ST-24 keeps the owner's quote and supersedes "cults (WF, emergent when it lands)" in Ruled |
| B057 · B064 · N03 · B126 · N05 · B245 (DROPPED) | HOLD | B057's `holder.ref` comparison superseded by B058's FULL IDENTITY (L156, L351) and its `seenBy` by B059. B064/N03 are withdrawn by their own ↳. B126's zeroing was struck by B127, whose M53 consequence stands (L260). B245's "(n)" was refuted by B246, so the text reads (j) (L405) |
| S06 · S07 · S08 · S09 · S14 · S15 · S21 (resource cells; STOP-ST-2 RULED) | HOLD | every `resource` cell states the slot: §0 L48, §3.3 heading L256 ("a SLOT where none exists, §13") and both cells of L266, §3.5 L292, §5 L337, §7.4 L472, §10 L546 and L560: "a SLOT on EC (EC-13/14's supply reads when lit — recorded, not designed, §13)" |
| S24 · S25 · S26 · B509 (the two STOP rows) | HOLD | `STOP-ST-1 (RULED)` (L704) keeps the measurement, then "RULED: new `UPKEEP_LEDGERS` rows `sites` · `retainers` when W-COIN lights … the DM's band a CEILING … applied at ST6, §6.1 step 3 and OD-ST-5" and the car-0 STOP CONDITIONS. "SEAT-8's widening car" and "The chair confirms or re-rules" are gone, superseded. `STOP-ST-2 (RULED)` (L705) is the slot on EC. Both ids are kept; the ⛔ is gone |
| S10 · S11 · S12 · S16 · S17 · S19 · S20 (KEPT car-0 STOPs) | HOLD | build-time STOP conditions with their fallbacks stand (L313, L529, L534, L543) |
| B236 · B237 · B238 (the never-closing bracket) | HOLD | new L397 is ONE closed caller list, equal to B238's ("the realm verb arm, ST's stage and its closing call, … PT's clearing door, and THE BODIES' ledger and stage — … re-points the site's holder in the same act, §6.7"), plus B237's BODIES entries and "nothing else calls it". The patrol's look goes "into MN's one sighting store by its door `recordSighting`" |
| B023 · B024 · B025 (ST2) | HOLD | ST2 (L89) has the closing call (B238), "ST's record holds only the TRUTH of the holder", and sightings to "MN's one sighting store by its door `recordSighting`" (r6) |
| **B018 (§0 L69)** | **FAIL (F1)** | see F1 |
| B058 · N02 · B059 · B060 · B061 (§2.1 paragraph) | HOLD | L156: full identity with `creed` and `ref.bodyKind`; `wantSince` and `fundingSet` dropped and `holderSince` set; "no `holder.seenBy`"; MN's one store; no `siege.quietWeeks`; `holderSince` "the ONE stored tenure" (its drop when unheld is at L351 and L584); cites OD-ST-34/-40/-43/-49/-52 |
| OD-ST-34 · -40 · -43 · -49 · -52 kept (§2.1 cites them) | HOLD | all five rows stand (L683, L689, L692, L698, L701). §13 has 57 lines = 57: OD-ST-1..54 plus the two STOP rows, with the ↳ OD-ST-5 row folded |
| A02 · B438 · B435 · B437 (↳ OD-ST-5) | HOLD | OD-ST-5 (L654) closes with the fiscal seat's demand-term paragraph verbatim less ", A.8"; Ruled "amended 2026-10-20 (the fiscal seat's demand term) · a refinement beyond the brief (the brief's sink does not exist)" |
| A08 · B505 (OD-ST-49, the horizon) | HOLD (N4) | one store, one door, read by place; the superseded routing quoted in Ruled |
| B246 · B505 · B511 (OD-ST-51 "(n)" → "(j)") | HOLD | B246 and B511 ("(n) was wrong … re-pointed to (j)"); OD-ST-51 (L700) reads "map (j) rows"; L405 reads "its row (n) is THE HIDDEN WAYS" |
| B464 · B465 (OD-ST-25) | HOLD | L674 states "only the anchor's side joins … every other mover is a challenger side"; Ruled "supersedes its joining of every court that moves on the site as one force" |
| B470–B474 (OD-ST-35) | HOLD | ONE BELIEF OF A HOLDER'S MIGHT; MN's one store; the id-less gang by the told arm alone (OD-ST-49); the veil; every unmaking told; the reclaim reads belief |
| A03 · A04 · A05 · A06 · A07 · B493–B495 (↳ tails of OD-ST-40/43/44/45/46) | HOLD | each row reads its final text. OD-ST-45's seizure clause is superseded by OD-ST-50 (Ruled names it), and OD-ST-46's `protection_kept` condition is folded in |
| OD-ST-1 · -42 · -53 · -54 (⭐ rows) | HOLD | all four are VISIBLE with "⭐ THE OWNER'S (…)" in Ruled; owner quotes and clock stamps (00:53, 05:57) kept |
| OD-ST-3 · -27 · -39 (latest-wins restatements) | HOLD | "align by §2.2's mapping" (Q1 is ruled in §2.2, L176); six kinds, superseding "gains `site`" and five kinds; OD-ST-39 supersedes "one body of men …" and L-PR item 3 |
| A01 · B373 · §7.4/§8/§11/§12 one-store sites | HOLD | a grep of the new text for "own belief record" / "belief owner" / "BD's door" / "BD's horizon" finds only L74 (F1), L203/L486 ("no belief owner" for the id-less gang, correct) and L698's quoted supersession |
| R1 · R2 · R3 (guide items 1, 3, 4) | HOLD | item 1 = ST3 verbatim ("PLACES … ADOPTS … accepts 'leave a ruin'"); item 3 holds no "only" and names every truth/belief read I found (all truth/TRUTH/belief hits read in context); item 4 names `site_siege` (a fall) as a telling (OD-ST-35, §2.4) |
| R4 · R5 (cross-volume cites) | HOLD | PL §15.9 exists ("15.9 Wear … typed decaying incident", PL L706). DESIGN_EDIT_MODE_AND_DECREES §20 item 3 reads "A pending decree that no longer resolves is WITHDRAWN WITH ITS REASON" (L328), with "⚠ AMENDED BY §20.3" at L45 |
| SEAMS-P8-5 (twelve MN17 sites) | HOLD (N7) | each names the right MN law or section |
| B164 · B165 · B166 · B082 · B141 | HOLD (N2 on B141) | §4.4 "never a weave incident and never a PL §15.9 incident word"; "the step REACHES site funding … (a reading by delegation, vetoable)" (L194) |
| random and others, 40: B042 B043 B044 N01 B073 B074 B075 B076 B077 B078 B079 B098 B099 B100 B101 B107 B108 B125 B127 B139 B147 B169 B170 B171 B173 B174 B175 B176 B177 B198 B260 B428 B452 B514 B515 B516 B517 B518 B519 B520 | HOLD | old and new were read side by side (`scratchpad/fvst/show.py`). A novelty scan of every inserted span of six or more words against the whole old text (`newtext.py`) traced each flagged span to its own bracket: B042, B082, B098, B125, B141, B169, B198, B260, B452. Every other flagged span is a Ruled cell or a ruled restatement. No new decision |
| whole-volume sweep (726 old body lines aligned) | HOLD | numerals, ranges, ⭐/DRAFT/UNMEASURED/PLAUSIBLE/CONFIRMED/EXECUTED, negations and OD ids compared per line. Lost numerals are finding ids or dates; the one "OD LOST" is a misalignment (OD-ST-40 stands at L689) |
| cross-references | HOLD | every bare "§x" resolves; every unresolved "§x" is prefixed by another volume, and I checked each of them (BD §6.4/§7.1/§8.2/§8.3/§9.2/§9.4/§9.9/§9.10/§15/§19/§22, PS §2.5/§4.1/§5.1/§7.5, MN §2/§3.3/§3.5/§4.1/§4.2/§5.2, PR §6.1/§6.2/§6.5/§9.2, PL §4.6/§4.7/§15.9, CH §16, WC §1.8, EDIT_MODE §20) |
| THE READER'S GUIDE (whole) | **FAIL (G1, G2)**; items 1–4, 6 and 7 HOLD | four flags = §9's four; five kinds = §8's five; C15 beside C14 = fold §6; waves ST-0..ST-5 + ST-2b = §10 |
| THE RULINGS §13 (whole) | HOLD | 57 = 57 lines; ⭐ rows VISIBLE; each row's latest text; Ruled column dates from its brackets; THE OPEN STOPS: none |
| the cure record | HOLD | contiguous verbatim blocks (script) |

**CONFIRMED vs PLAUSIBLE:** CONFIRMED by executed scripts and side-by-side reads: the ratchet re-run and every one of its difference classes, the allow-file location check, my marker count (637 = 637), the cure-record containment, the numeral-collapse and per-line mark sweep, the cross-reference resolver, the MN, BD, PL, EDIT_MODE and fold section lookups, the code-of-record check that `buildThreatByCid` lives in `martialReadiness.js`, and every row receipt above. PLAUSIBLE: only the judgements that N1–N6 are not fidelity fails, and that G1 and G2 are guide over-claims rather than inherited text. G1 echoes the text's own "the ONE LEAF every host calls", which is scoped to §3.3; G2 is a new guide sentence.
