# CH — FIDELITY VERIFICATION OF THE COMPLETED CONSOLIDATION (P8, seat FV-CH, second seat, 2026-10-21)

**COUNTS: sampled 141 ledger rows · holds 141 · fails 0.** Six notes below (N1–N6) are NOT fidelity fails (inherited text, cosmetic, or the ledger's own bookkeeping); N1 is the one I would repair before the landing (one token, three places, vetoable).

**THE RATCHET (re-run, on `docs/DESIGN_FP_ARCH_CH.md` as it stands, with the lane's `CH-allow.txt`): `RATCHET 5 DIFFERENCE CLASSES`** — tokens 2006 → 1792 · missing 0 · new-in-new 6; cites 144 → 142; laws 22 = 22; OD 72 → 70; ⭐ 9 → 7; DRAFT 53 → 51; UNMEASURED 24 = 24; wave ids 17 → 14; flags 40 = 40; review markers left 0. Identical to ledger §5. **Every class is explained, and I re-proved each explanation by script:** the two lost cites (`deityCommitEmbed.js :: DEITY_AUTHORED_CHARACTER_KEYS`, short-path `urbanFabricKernel.js :: leaderOf`) occur only at old L1452 / L1374 (the moved cure record; the body's L188 token `…DEITY_AUTHORED_CHARACTER_KEYS` survives at new L195); `OD-PS-21` / `OD-PS-29` occur only at old L1258 / L1257; ⭐ old body 7 = new 7 (cure record 2); DRAFT old body 52 = new 51 + old L10's STATUS "COMPILED DRAFT" (moved); `RU-1..3` are finding ids (old L79, 239, 633, 652 … all inside `[CURED … RU-n …]` brackets); every OD id of the body survives (body − new = ∅). New tokens: trail paths + the final P3 shape — no mint.

**The allow file (232 lines) checked line by line against ledger §4:** every "MOVED WITH THE CURE RECORD" token has ZERO occurrences in old body lines 13–1115 (script); every superseded name sits at the old body line its successor replaced (e.g. `patronLean`/`PATRON_LEAN_WEIGHT`/`patron_creed_conflict` old L1035 → the `sworn…` family; `exposed?` L548 → `exposedAt`; `recruit` L507 → `recruiters`; `body.leaderRef` L223/511 → `leads`); short forms are carried in full in the new text; the review-trail paths sit in the moved header block or in dropped finding quotes. No unexplained line.

**THE MARKER COUNT (my own balanced scan, `scratchpad/fvch/count.py`):** body brackets 685 = 681 B rows + 4 `[CONFIRMED …]` (ledger F01–F04); cure-record brackets 4 = C01–C03 + the `[RENAMED …]` (F08); `↳` outside brackets 24 + 17 = 41 (A rows 41); `STOP` outside 20 + 26 = 46 (S rows 46); round words (the ledger's regex) 52 + 29 = 81 (H rows 81); `(fp-final …)` outside brackets 3 (F09–F11); header lines 8; cure headers 13. **Unique markers 881; the ledger's 884 rows count three markers twice** (C01–C03 and their own stamps F05–F07, all MOVED) — N2; nothing is missing. All 681 B rows align with my bracket index by old line (0 mismatches). The cure record (old L1116–1499) is contained VERBATIM in `history/CH-cure-record.md`, and old L3–12 line by line (script).

**THE READER'S GUIDE (whole, against the old header/§1/§18/§19/§20):** HOLDS — flags = §19's six; the nine CH hearing kinds = §18 less the `ransom` (war volume/ES/BD) and `party_visit` (PT) rows, "no custody kind" true; CHAIN C12, waves CH-0..CH-11; every host cite in item 5 present in the body; item 3 now carries the crown's-ban exception (the first seat's F4, cured). **N1:** item 3 says "a capped carried picture (§4.6)"; the picture is §4.7 ("Drift, the picture, the material life") — §4.6 is Habits. INHERITED: old CH7 (L124) and P2's comment (L216) already said §4.6; the guide copies it.
**THE RULINGS (§23, whole):** HOLDS — 57 rows = 57 (OD-CH-1..56 + OD-OP-24), the three ⭐ rows (OD-CH-51, OD-CH-56, OD-OP-24) VISIBLE; per-row similarity scan with lost-numeral check: every lost numeral is a round number or a dropped quote; the ↳ OD-CH-52 and ↳ OD-CH-55 rows folded whole into their parents (verified clause by clause); OD-CH-11 carries the P5 A.2 opening; OD-CH-16 the `sworn…` family; THE OPEN STOPS: none (no ⛔ STOP CH-C-n raised; none needed).

**The first seat's fails, re-verified:** F1 cured (`cmp` CH-new.md = volume); F2 cured (allow complete, above); F3 cured (0 "RULINGS" in the running text); F4 cured; F5 cured (0 "routed"/"ROUTED"; dates only in the owner's words, the header, §23 and the 2026-07-28 design threshold); B109 cured (new L240: "fame, regard and the whereabouts read one heard doer (RN OD-RN-31)").

## NOTES (not fails)
- **N1** (above) — repair `(§4.6)` → `(§4.7)` at new L13, L132, L218 (vetoable; inherited, so outside the fidelity law strictly).
- **N2** — ledger §1's 884 double-counts three moved cure-record markers (F05–F07 = the stamps inside C01–C03); unique 881.
- **N3** — three REFINED brackets lost their inline "vetoable": B087 (old L195, `heldOffice` — "the alternative … would give two bound wardens one office"), B100 (old L225 — "the alternative names … are not minted"), B192 (old L402 — "… is not taken"). Each is carried vetoable in §23 (OD-CH-46 names the alternative; OD-CH-16; OD-CH-32) and the header says every ruling is vetoable; the lane elsewhere kept 22 inline "(vetoable: …)". PLAUSIBLE minor inconsistency.
- **N4** — B286 trimmed WS's quoted row "(never the market)" from the citation (new L517); WS keeps it; CH's own law (the corps born only by the DM, §16b) stands.
- **N5** — cosmetic: " ; both halves" (new L625); the unbalanced "(PR14, PR §13: …" at new L450 is inherited (old L453).
- **N6** — a few `cure/` evidence paths dropped with their change notes (e.g. `cure/D-CH-r4-probe/census-r4.out` at CH16) though ledger §3 item 7 says `cure/` receipts are kept; all in the allow list; no design fact.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B009 · B024 · B050 · B091 · B110 · B155 · B184 · B187 · B217 · B221 · B274 · B287 · B307 · B442 · B484 · B492 · B497 · B524 · B533 (CH-V1, BLOCKING) | HOLD | no errand row names a paragon (new L446 "lighting OD-FC-39's unit changes nothing"); `court_errand` never a candidate (L397); recruiter a priced journey (L503); §8 restated on the DM's direction + own leg (new §8 lead); a HELD paragon takes no aim (L397); "LIGHT with OD-FC-39" absent |
| B012 · B047 · B085 · B173 · B293 · B308 · B413 · B569 (CH-r1-1 · SEAMS-r1-1, BLOCKING) | HOLD | custody "waits on ES-2b's custody wave"; no `foreignGuestHolds` lifecycle row; the DM's hand `authored.heldAt` the only hold (new §12.4, L551, L923) |
| B412 · B414 · B415 · B416 (§12.4 rewrite; BD-r5-1 BLOCKING in B415) | HOLD | four paragraphs carry: ES-2b + WR-7d OPEN by delegation, "an ORDER, no longer an owner gate"; `pay · hunt · wait`; the 18:54 owner word verbatim; the PARTITION; the free paragon's no-clock case (vetoable); B412's global reading applied at §8, §9, §11, §18, §19, §21 L7, OD-CH-11 (script: no ES-2b "owner's slot" phrase left; the errand-row slot untouched) |
| B016 · B062 · B149 · B321 · B378 (CH-r1-2, BLOCKING) | HOLD | `stanceOf` via `cooperation`/`betrayalHazard`, `aggression` never read (new L148, L567, L625); `rival_creed` renamed `opposed_creed`; `enemy_in_service` one meaning |
| B045 · B067 · B219 · B254 · B498 (HOST-r1-2, BLOCKING) | HOLD | "canonized ≠ premium — the COMPATIBLE ruling … requirement 17 carries it in the fold" (L821); `epidemicActive` row (L479) |
| B029 · B030 · B215 · B656 (BD-r4-3, BLOCKING) | HOLD | the ways on the ONE ladder, `HIDDEN_PATH_SLOWDOWN` 2; "no `TRAIL_WEEKS_MULT` — the LANDED constant wins" (L1057) |
| B058 · B156 · B229 · B272 (ST-r2-1, BLOCKING) | HOLD | BAND always on / COIN W-COIN's `retainers` row (L138, L501) |
| B225 · B226 · B649 (HOST-r2-1) · B227 (SEAMS-r2-1) · B234 (SEAMS-r2-2) · B286 (WS-r1-1) · B429 (OP-r1-1) | HOLD | one re-versioned `SEASON_TERRAIN_COST`, never closes a pass; landed carriers only (L448, L1052); WS lean `WS_LEAN_W` [0.88, 1.12] (L517; N4); `captive_held` row minted only from the arrived record (L711) |
| B017 · B018 · B019 (DROPPED → B020) | HOLD | new L81 "THE ACTOR CONVENTION IS SIX KINDS … corps … keyed `u:` … menace …" |
| B051 (→ B052) · B059 (→ B057) · B282 (→ B281) | HOLD | "ONE mover per record … CH's OWN law" (L134); W-COIN slot + the frozen-kernel fact on the full `advanceTreasury` cite (L138, L511) |
| B138 (→ B139) · B178 (→ B179) | HOLD | one `false_word` row (L255); RN's stage MEETS the threading, EXECUTED receipt kept (L379) |
| B313 (→ B315) · B344 (→ B345) · B628 (→ B629) | HOLD | two-step bound + the TRUE bound a RATE (L555); envelope as measured, "±0.15" history gone (L593); OD-CH-16 lists the `sworn…` family, `patronDeity` landed sense alone (L1031) |
| S01–S13 (header STOP words) | HOLD (MOVED) | old L10/L12 in history Part 1, line-by-line contained |
| S14 · S15 · S16 · S17 · S19 · S20 | HOLD | labels removed, content intact ("PL accepts this" L644; OD-PS-19 kept L980, L1057) |
| S18 (KEPT) | HOLD | "The DM may NAME any paragon or STOP the hunt" — the DM's verb (L802) |
| B331 · B332 · B333 · B252 · B248 · F01 · F02 (§10b, the riskiest fold) | HOLD | TRAVELS WITH ITS SAINT: the world's snapshot first, the oath's copy only where none; "a creed seated nowhere enters with its saint" WITHDRAWN; admitted WITHOUT A CONTEST (vetoable) (L583, L478); NO NEW FLAG (L616) |
| B343 · B345 · B607 · A21 (monotone per half) | HOLD | `act = align × bold` MONOTONE PER HALF; 0.9722 / 1.0233 / 1.0535 said plainly (L593, OD-CH-52, S68 L1007) |
| B597 · B604 · A19 · A20 (S60, S61 · S65) | HOLD | order on IDENTICAL state; counts REPORTED, never pinned; vetoable kept (L999–L1004) |
| A23 · A24 · B673 · F03 · F04 (↳ OD rows) | HOLD | folded into OD-CH-52 / OD-CH-55 (seated-nowhere admission; the wholly neutral creed, `lean2.out.txt` T5) |
| B679 · B680 (§24) | HOLD | closing line "in the sworn lines the followers act" from B679; `suppressDeity` cite kept |
| B087 · B100 · B192 | HOLD (N3) | content folded; vetoability carried in OD-CH-46 / OD-CH-16 / OD-CH-32 |
| B109 · B179 · B281 · B314 · B315 · B629 | HOLD | as above |
| random 28: B035 B039 B100 B127 B142 B231 B243 B248 B253 B273 B278 B317 B375 B383 B430 B466 B468 B475 B478 B521 B556 B575 B578 B597 B600 B604 B607 B626 | HOLD | old passage vs new passage read side by side (`scratchpad/fvch/show.py`); each the latest bracket's content, no new decision; B383's withdrawn same-pass leg absent ("the next leg opens the next tick") |
| whole-volume sweep (737 old lines aligned to new, negation and numeral diffs) | HOLD | every flagged line read: rewrites carry their brackets' latest text; lost numerals are round numbers, history ("1.0002 against 1.0235") or dropped quotes |
| THE READER'S GUIDE | HOLD (N1) | above |
| THE RULINGS §23 | HOLD | 57 = 57 rows, ⭐ rows VISIBLE, Ruled column derived from each row's latest bracket date |

**CONFIRMED vs PLAUSIBLE:** CONFIRMED by executed scripts and side-by-side reads — the ratchet re-run and each of its five explanations, the allow-file location check, my marker count, the cure-record containment, the § cross-reference resolver (every local § resolves; the unresolved hits are other volumes' sections) and every row receipt above; PLAUSIBLE only the judgement that N3–N6 are not fidelity fails and that N1, being inherited, is outside the fidelity law.

---

## APPENDIX — THE FIRST FV-CH SEAT'S REPORT (2026-10-20 ~22:5x CDT, on the half-done lane), kept verbatim because ledger §3 item 10 cites its F1–F5 and B109
# CH — FIDELITY VERIFICATION (P8, seat FV-CH, 2026-10-20 ~22:5x CDT)

**COUNTS: sampled 76 ledger rows · holds 75 · fails 6 (1 row-level: B109; 5 volume-level: F1–F5).**
**Ratchet (as instructed, on the volume as it stands):** `RATCHET 1 DIFFERENCE CLASSES` — tokens 2006 = 2006, cites 144 = 144, every count equal, **review markers left in the new text: 736**. The volume is NOT consolidated.
Supplementary ratchets: on the lane's partial `consolidate/CH-new.md` → `RATCHET 8 DIFFERENCE CLASSES` (the pending §6–§24); old lines 1–458 vs `CH-new.md` → `RATCHET 5 DIFFERENCE CLASSES` (residue explained below).

## THE STATE OF THE OBJECT (F1, blocking for this seat)
- `docs/DESIGN_FP_ARCH_CH.md` is byte-identical to `history/CH-bracketed-1beabdc85.md` (`cmp` → IDENTICAL) and to `git show 1beabdc85:docs/DESIGN_FP_ARCH_CH.md`.
- The lane C-CH stopped PARTIAL: its ledger heading says "header..§5 DONE · NEXT IS §6 THE GIFTS (old line 459)"; `ledger_rows.json` → PENDING 486 · FOLDED 257 · MOVED 134 · DROPPED 7 (884). The consolidated volume this seat was to refute does not exist yet. Everything below verifies the DONE PART (`consolidate/CH-new.md`, old lines 1–458) so the finishing seat inherits a checked base.

## THE MARKER COUNT (my own script, `scratchpad/fv/count.py`)
884 = the ledger's 884. Brackets 684 (681 body + 3 in the cure record): my first regex missed the three spaceless forms `[REFINED, M9]`, `[REFINED, M11]`, `[REFINED]` (L1026, L1033, L1036) — the lane's inventory has them (B611, B621, B630). ↳ 41 = 41; round words 81 = 81; STOP 46 = 46; header 8; cure headers 13; `(fp-final …)` stamps 11 = the four top-level `[CONFIRMED …]` brackets (F01–F04) + 7 in the cure record. The one `[RE-RULED …]` (L679) is nested inside B415, covered by its row. ⚠ For the finishing seat: `[CONFIRMED …]`, `[RENAMED …]`, `[RE-RULED …]`, `[REFINED]` and `[REFINED, Mn]` are outside the ratchet's MARKERS regex — only the `(fp-final P6 r1)` stamp catches the first; `[REFINED]` / `[REFINED, M9]` / `[REFINED, M11]` in §23 would survive the ratchet unseen.

## THE FAILS
1. **F1 — the volume is unconsolidated** (above).
2. **F2 — the allow list's "COMPLETE" claim (ledger §4, last bullet) is false.** Its completeness test excluded tokens present anywhere in old 459–1499, so tokens that survive only in the MOVED cure record were never listed: `a␟b` (B233), `lean2.out.tsv`, `settlement · person · party · menace`, `settlement · person · party · menace · corps`, `… · menace · site` (all three superseded by B020), `turned.atTick` (B092), `{ mult }` (B104) — each's meaning is carried, but each is absent from `CH-allow.txt`; plus 25 review-trail paths of header..§5 (`briefs/RULINGS-ROUND2..5.md`, `briefs/RULINGS-P6.md`, `assessments/P5-COMPLETENESS-2026-10-20.md`, `cure/D-CH-r1..r5.md`, `skeptic/CH-r1.md`, `skeptic/SEAMS-r1.md`, …) against the 9 the allow file names. The final ratchet will list all of them MISSING.
3. **F3 — a dangling ruling-file citation.** New §0 cites "RULINGS §1", "RULINGS §3", "RULINGS §4" eleven times (new L56, 60, 61, 68, 71, 73, 74 …). Its referent (`briefs/L-CH.md` "as amended by `briefs/RULINGS-AFTER-RESEARCH.md`") was defined only in old line 12, which moved to history; ledger §3 item 7 says ruling-file citations were removed. The new text cites a section of a file it never names (law (d)).
4. **F4 — THE READER'S GUIDE item 3 states a narrower law than the text.** Guide: "TRUTH only in the omniscient arm and for a deciding court's own facts (CH7, §2.2 `gateDefault`)". The `gateDefault` row it cites (B115 folded) says: "and TRUTH for the deciding court's own facts … and for ONE public fact of another court, the CROWN'S PROCLAIMED BAN at a member (§11 step 2)". The guide drops the named exception — a hardened law in a new sentence.
5. **F5 — voice (law (e)), minor.** "routed" / "ROUTED to the fold §5" left in running text (new L162 ×2, L208, L246, L252, L328), and a dated stamp outside the owner's-words blocks: "(the host document's newest version, 2026-10-18: …)" in §5 "Patrols considered" (new L450/453).
6. **B109 (row) — a lost cross-volume clause and an unexplained OD drop.** OLD (L239 bracket): "RN's clause is added — fame, regard and the whereabouts read one heard doer (RN OD-RN-31)". NEW `believedWhereabouts` row keeps "a version heard under ANOTHER doer places nobody" but not the clause that fame and regard read the same heard doer, nor OD-RN-31. OD-RN-31 occurs only on old L239, so the final volume loses it; the slice ratchet shows OD rulings 16 → 15 and the ledger calls B109 "a change note" without naming the loss.

## RETRACTED CANDIDATE (checked, holds)
`religionState.js :: suppressDeity` vanished from the new §0–§5 with B006 (a "change note") — but the cite also stands at old L1109 (§24, pending), and §10b's lines 604/636 carry who suppresses a creed. HOLDS on condition the §24 seat keeps L1109's cite.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B002 | HOLD | the 10-18 doctrines + the 06:35 question folded verbatim as "And on 2026-10-18 — …" (difflib: the six doctrines and the answer identical) |
| B003 · B004 · B005 | HOLD | stamps; the owner's words unchanged |
| B006 | HOLD (cond.) | the paragraph keeps CH-PD-r1-17/-1; the suppressDeity cite survives at old L1109 (§24, pending) |
| B009 (CH-V1, BLOCKING) | HOLD | new §0 errand row: "NO persisted errand row can name a paragon" — the withdrawn "LIGHT with OD-FC-39" absent (grep 0) |
| B012 (CH-r1-1 · SEAMS-r1-1, BLOCKING) | HOLD | "a held paragon's custody WAITS ON ES-2b … no landed custody arm as live design (§12.4)" |
| B014 · B015 · S14 | HOLD | the W-COIN slot stands; "STOP-ST-1's ruling" label removed, ruling content kept |
| B016 · B062 · B149 (CH-r1-2, BLOCKING) | HOLD | `stanceOf` read only through `cooperation`, `betrayalHazard`; `aggression` never read; `rival_creed` FREE row intact |
| B017 · B018 · B019 (DROPPED) | HOLD | every surviving clause of the five/four-kind conventions (corps decides, keyed `u:`; menace's course; site a WHERE and a subject, ST4's quote) is in new L73 |
| B020 | HOLD | "THE ACTOR CONVENTION IS SIX KINDS, `settlement · person · party · menace · corps · body`" + its body clauses verbatim |
| B024 · B110 · B184 · B217 (CH-V1, BLOCKING) | HOLD | stamps; cured text stands at the same place |
| B030 · B148 · B230 | HOLD | stamps; text unchanged |
| B045 · B067 · B219 (HOST-r1-2, BLOCKING) | HOLD | canon-born world: "this arm is never taken"; CANONIZED ≠ PREMIUM kept in CH18 |
| B047 · B173 · B085 (SEAMS-r1-1, BLOCKING) | HOLD | custody waits on ES-2b; the DM's hand `heldAt` row (new L193); `holderKind`, `heldAt` in P1 |
| B050 (CH-V1) | HOLD | bound = placed at its seat; the priced journey (§7) |
| B051 (DROPPED) · B052 | HOLD | "ONE mover per record … CH's OWN law … built on the two landed refusals … never a general landed rule" — B051's general reading correctly gone |
| B057 · B058 · B059 (DROPPED) | HOLD | r1 struck the row, r2 restored it as the W-COIN slot: latest wins; the frozen-kernel fact kept on the full cite (ledger §3 item 4) |
| B065 | HOLD | CH16's role-label correction verbatim in new text |
| B071 · B123 | HOLD | the two monotone halves; "neutral god" on all three |
| B082 | HOLD | `patronDeityId` → the embed; "the OWNER's persisted shape, OD-CH-51" stands in CH22 (new L162) |
| B086 · B087 | HOLD (note) | `creedRef`, `renown`, `heldOffice` present; B087's alternative kept but the word "Vetoable" dropped (covered by the header's "every ruling is vetoable") — PLAUSIBLE minor |
| B091 · B092 · B093 · B095 · B096 | HOLD | P1 carries `exertion?: { tick, outcome, settlementId }`, `banKeys?: [≤8 { settlementId, episode, untilTick }]`, `leads` "THE ONE LEADER RECORD — THE BODIES store no copy … `bodyLeaderOf`"; struck `liaisonId` / `marks.turnedAt` absent |
| B099 | HOLD | P3 `paragonBeliefs[observerId][subjectId]` |
| B103 · B104 | HOLD | `patrol_will` the fourth word; `x × mult`, never additive |
| **B109** | **FAIL** | see fail 6 |
| B115 | HOLD | the crown's-ban exception named once in `gateDefault` (but see F4) |
| B130 | HOLD | one door for a hunt's success |
| B138 (DROPPED) · B139 · A04 | HOLD | ONE `false_word` row, OP's DRAFT set, minted at exposure only; §2.2b's paragraph re-worded as the ↳ row ordered |
| B155 | HOLD | `corps` only as a `holderKind` value |
| B163 | HOLD | `patronDeity` registered as the SETTLEMENT's landed seat |
| B178 (DROPPED) · B179 | HOLD | the threading requirement MET by RN; the harbouring clause kept |
| B187 · B221 (CH-V1, BLOCKING) | HOLD | `court_errand` never a candidate until the slot lands; a HELD paragon takes no aim |
| B196 | HOLD | the season read from the digest overlay; `seasonsEnabled` survives in pending §6+ |
| B215 | HOLD | ONE NETWORK; the warden's ways are the office's; the landed constant wins |
| B225 · B226 (HOST-r2-1, BLOCKING) | HOLD | "SLOWS the pass and never cuts it (`SLOW_NOT_SEVER_MAX = 6` …)" |
| B227 (SEAMS-r2-1, BLOCKING) | HOLD | "The navy is landed, lit and owner-commissioned … CH rests on the landed carriers alone." |
| B233 | HOLD | `stretch:<a\|b>` — the digest's own `pairKey` form (the `a␟b` token unlisted: F2) |
| B234 (SEAMS-r2-2, BLOCKING) · S15 | HOLD | `envoy_intercepted` / `envoy_held` stay the army interception's; STOP-PR-0 label removed, ruling kept |
| A07 · A08 · A09 | HOLD | both `answer_call` ↳ rows folded into the parent: the `captive_held` venue, the friend rule, the `covert` class, REGARD ONLY |
| H17 · H21 · H22 (+ the P5/P6 lead-ins) | HOLD | lead-ins removed, rows intact |
| READER'S GUIDE | 7 of 8 items HOLD | flags six = old header "six virtual flags"; nine CH hearing kinds = old §18 less PT's `party_visit` and the war volume's `ransom`; waves CH-0..CH-11 = old §20; C12 = fold §6 L1132; item 3 FAILS (F4) |
| THE RULINGS (§23) | NOT VERIFIABLE | PENDING, not yet written |

**CONFIRMED vs PLAUSIBLE:** CONFIRMED by executed reads: the `cmp` identity, the three ratchet runs, my marker count, the token-shadow script and every row receipt above (old and new text read side by side). PLAUSIBLE: the B087 "Vetoable" note and the judgement that F2's seven tokens lose no meaning.
