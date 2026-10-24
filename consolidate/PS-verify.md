# PS — FIDELITY VERIFICATION OF THE CONSOLIDATION (P8, seat FV-PS, 2026-10-23)

**COUNTS: sampled 131 ledger rows · holds 128 · fails 3 rows (B028 · B397 · B127) + 1 volume-level (an allow-file reason) = 4 fails, 3 defects.** THE READER'S GUIDE FAILS on item 8 (the same defect as B028/B397). THE RULINGS table HOLDS. The cure record is verbatim. No numeral collapse.

**THE RATCHET (re-run on `docs/DESIGN_FP_ARCH_PS.md` as it stands, with `PS-allow.txt`): `RATCHET 1 DIFFERENCE CLASSES`.** Tokens 1163 → 1074, missing 0, new-in-new 10. Cites 89 → 90. Laws 16 = 16. OD 65 → 67. ⭐ 15 → 16. DRAFT 45 = 45. UNMEASURED 22 = 22. Wave ids 9 → 8. Flags 23 = 23. Review markers left: 0. This matches ledger §5 byte for byte (`PS-new.md` and the volume are the same file, by `cmp`).
- **The one difference is explained, and the explanation is true.** The regex matched `MG-24` inside "OD-MG-24 — " at old L152. `OD-MG-24` survives (1 = 1), and every real wave id (PS-0…PS-5, EC-17, MN-4) survives.
- **The two counts that rose are explained too.** OD 65 → 67 comes from OD-FC-103 and OD-FC-104 being cited. Both are fold rows at `1beabdc85` (fold L1359–1360, RULED 2026-10-20), and no old OD id is lost, in the body or anywhere else. ⭐ 15 → 16 comes from OD-PS-0, which the old row already called "THE OWNER'S OWN ROW", and from the Ruled-cell ⭐s. All 11 old body ⭐s survive.
- **No token is a mint.** The new cite `relationshipEvolution.js :: applyRelationshipPatch` is `export function applyRelationshipPatch` at master L490. `advancePassageCourts` is in old §4.2. `toll_exemption` is registered in the fold (2) and in PL (3) at `1beabdc85`. The ": a same-kingdom patrol…" token is a backtick-parity artefact of the `permits` row.

**THE ALLOW FILE (102 tokens), checked one by one by script against its ledger §4 reason (`scratchpad/fvps/allowchk.py`).**
- All 11 HEADER TEMPLATE tokens are in old lines 3–14 only.
- All 40 MOVED-WITH-THE-CURE-RECORD tokens are in old lines 773–1004 only.
- All 5 seat-2 review-trail paths are inside body brackets only.
- All 7 SUPERSEDED NAMES sit in the superseded bracket or line: `(B)`, `(capacity)` and `B` in B129; `road (prev, B)` in B038; the five-kind lists at old L76, B029; `protection_failed` in B086's arm, and it still stands in P14.
- **One reason is untrue — F3.** `cure/D-PS-ST-PR-p5.md` is not "cited only by header lines or brackets". It also stands OUTSIDE any bracket at old L746, in OD-PS-54's Why cell ("the P5 completeness critic; `cure/D-PS-ST-PR-p5.md`"). The new cell reads "the completeness read".

**THE MARKER COUNT (my own balanced scan, `scratchpad/fvps/count.py`).**
- **Brackets: 522 = 522.** Of these, 519 are body brackets: CURED 468, REFINED 30, ADDED 17, OPENED 2, STOP 1, RE-RULED 1. The other 3 are inside §18. All 522 B/C rows align with my bracket index by old line and first characters (0 mismatches).
- **Markers nested inside brackets: 2 brackets + 2 `↳` = the ledger's 4 N rows.** The ledger's §1 prose (and the brief's lane note) says "**2** markers nested". The 635 total is reached only with 4 N rows: 522 + 4 + `↳` 15 + round words 53 + STOP 24 + ROUTED-UNAPPLIED 10 + header lines 7 = **635 ✓**. See N1.
- **Outside-bracket markers.** `↳` 15 = 15 (17 in all, 2 of them nested). STOP 24 = 24. ROUTED-UNAPPLIED 10 = 10.
- **Two round words are missing from the ledger.** A broader scan finds two review-round words outside brackets that the ledger's H regex missed: old L239 "round P5 adds `guardLoss?`" and L677 "round-P5 reads". Both are gone from the new text, so nothing remains in the running text (N1).
- **Dispositions check out: 554 FOLDED · 67 MOVED (header 30 + §18 37) · 14 KEPT · 0 DROPPED.**
- **Every build-time STOP mark is KEPT.** S-a (L271, L458), S-e (L377, OD-PS-30), S-f (L398, L483, OD-PS-32) and S-g (L354, L491, OD-PS-44) are all present, plus "STOP if it needs a new persisted field" (L392). ⛔ in the old body: 11 = 11.

**THE NUMERAL-COLLAPSE CHECK (`scratchpad/fvps/ranges.py`): CLEAN.** The three old body ranges survive verbatim: `0..1` (L45), `W(0..m)` (L220) and `WC-10..12` (L347). The fourth range, `cure/D-OP-r1..r3.md`, sits in the moved cure record, verbatim. No digit.digit form in the new text comes from an old `x..y`. Every numeral lost from non-bracket text (script over all 597 aligned lines) is a round label, a finding id or a CHAIR-NOTES number.

**THE CURE RECORD.** `history/PS-cure-record.md` contains old L3–14 (Part 1) and old L773–1004 (Part 2) as exact substrings. Its only other content is its own title and part headings. `history/PS-bracketed-1beabdc85.md` is byte-equal to `git show 1beabdc85:docs/DESIGN_FP_ARCH_PS.md`.

**SEAT 2's EDITS IN SEAT 1's TEXT: CONFIRMED.** I diffed `scratchpad/cps/seat1_PS-new.md` against the volume's first 321 lines. Only the four logged corrections differ:
1. Guide item 3 is widened.
2. Guide item 4's ledger writers are corrected, and the hold clause now reads "every hold PS makes". The correction is true: §5.4, §5.5 and §6.5 have PS's ledger module write for PR's stage and for WC-6's and WC-10's producers.
3. PS8's "(P4)" is removed.
4. PS8's "lowest rungs" now reads "ways (its way-mode edges)". This is true by B232, whose ruling is "the r5 text read the ways as the road ladder's lowest rungs … which master's … id cannot hold".

**THE LANE NOTES, verified.**
- **STOP SEAMS-r5-2-scope.** RULINGS-ROUND6 §D reads "STOP SEAMS-r5-2-scope: PEACE AND WAR … the owner's 22:51 word names wartime as where the RISK read weighs it, not as the only time it exists". The fold at `1beabdc85` §3.3.18 reads "§D (STOP SEAMS-r5-2-scope, RULED)". New §5.6 L350 states the ruled text, and OD-PS-44 adds "in PEACE AND IN WAR (… ruled — the fold's §3.3.18)". HOLD.
- **OD-PS-29.** RULINGS-ROUND2b L41 reads "OD-PS-29. STANDS: a march prices its CHOSEN path on PS's lit arm only …". The new §5.1 and the OD-PS-29 row state it as ruled. HOLD.
- **§14 ST row and B410.** RULINGS-ROUND6 B.6 reads "a body or menace held at the approach is held by the hold helper's FREEZE at its prior position". New L630 states it, and "never by the helper" is gone. HOLD.
- **B167 (FIVE / FIFTH).** It is applied at PS9 L125, PS11 L132, §11 PS-0 car-0 L458, §14 WC row L625 ("FIFTH in §4.1's order (after MG's leaf)") and OD-PS-35 L722. "four registrants" is now in no running text. HOLD.
- **The flag rows.** The `movementGrammarEnabled` and `wingsEnabled` `↳` rows fold into plain rows. The superseded clause "requires the army's march row to carry the wing" is dropped, per the later bracket's own "SUPERSEDES". HOLD.
- **The ratchet's one difference.** It is the false wave match `OD-MG-24`, as above. HOLD.

## THE FAILS

**F1 — rows B028 (§0.2) and B397 (§14 PL row), plus THE READER'S GUIDE item 8: an over-claim the old text never made.**
- **What the new text says, in three places:**
  - Guide item 8: "in every volume the bare word carries THE PASSAGE's meaning (PS14)".
  - §0.2 L78: "(The bare word "passage" carries THE PASSAGE's meaning in every volume — PS14; …)".
  - §14 PL row L626: "so "passage" keeps one meaning — in every volume the bare word carries THE PASSAGE's meaning (PS14)".
- **What the old text said.** Old L628 has the request "THE PASSAGE asks PL to read "transit, not a decision" there so "passage" keeps one meaning". Old L657 has "the fold §5 registers "passage" = THE PASSAGE's decided crossing". The old text never claims that every volume uses the word this way.
- **What the ruling says.** The ⛔ STOP PL-C-1 ruling the ledger applies is scoped "**in PL** the bare word "passage" carries THE PASSAGE's meaning" (BOARD 16:55; PL ledger §1).
- **PS14 states no word rule.** It is "A FOREIGN ARMY IN THE KINGDOM IS THE CROWN'S BUSINESS…".
- **The claim is false.** The LANDED ES volume uses the bare word in another sense, twice: "the non-capture arms are uncaught passage" and "outcomes (`caught_spying` hold / uncaught passage / …)" (`DESIGN_FP_ARCH_ES.md`).
- **Same item, second clause.** It says "'gate' is never written bare" and drops PS2's own qualifier, which the text keeps at L105: "in this volume's own prose; quoted rulings and host lines keep their source's word". The text itself quotes J385's bare "keeps the gate".
- **CURE.**
  - At all three places, write: "the fold §5 registers the bare word "passage" as THE PASSAGE's crossing, and PL reads it so (the PL-C-1 ruling)". Cite the fold, not PS14.
  - In guide item 8, restore "in this volume's own prose" to the gate rule.

**F2 — row B127 (§2.7 `replanFromNode`): an OPEN question is restated as settled, and the OPEN mark is lost.**
- **OLD (L217, inside B127):** "⚠ OPEN (routed, NOT ruled here): whether PS's OWN step-6 reroute takes condition (c) … and which bound a NAVAL record's FREEZE hold reads when `navalKernel.js` becomes this helper's second caller … — for SEAMS-P6 / P7."
- **NEW (L220):** "…the bound a NAVAL record's FREEZE hold reads, when `navalKernel.js` becomes this helper's second caller …, is named at MG-7's unit."
- **The first half is correctly ruled.** OD-FC-104 rules condition (c), and the new text applies it.
- **The naval half has no ruling.** The fold at `1beabdc85` rules only OD-FC-103 and OD-FC-104. OD-FC-102 is the CLOSED naval RE-PLAN slot, not the hold's bound. The ledger's note "the fold's deferral to MG-7's unit" names a fold row that does not exist.
- **MG still says PS names it,** both at `1beabdc85` and as consolidated (MG L359): "routed PS, which names the bound a naval record's hold reads (… PLAUSIBLE)". The only source for "at MG-7" is the brackets lane's log (`cure/BRACKETS-A2-program-volumes.md` §5 item 3: "PS's to name at MG-7").
- **CURE.** Restore the open mark: "⚠ OPEN (unruled): the bound a NAVAL record's FREEZE hold reads … — PS's to name at MG-7's unit (MG §7.2 routes it here)". Correct the B127 ledger note.

**F3 — the allow file: one untrue reason.** The `cure/D-PS-ST-PR-p5.md` line stands under "cited only by header lines or brackets", but the path also stood in OD-PS-54's Why cell (old L746). It is a lane log, and removing it falls under ledger §3's Why-column rule, so the token loss itself is benign. **CURE:** one line in ledger §4 naming OD-PS-54's Why cell, where the path is replaced by "the completeness read".

## THE READER'S GUIDE (whole, against PS3, §2, §3, §4–§7, §9, §10, §12 and every "TRUTH / truth / self-read / PUBLIC / READ CLASS" statement in the text)

**Every truth read the text names is in item 3:**
- The border truth: the digest and `gateKeeperOf`.
- B's own contracts.
- B's own war and its liege's: L252, and L404 "truth of the liege's contract".
- `passageDefenceOf`, a self-read plus the men its liege sent: L222, OD-PS-50.
- The occupation test.
- The landed route costs.
- The witness and the standing report.
- The mover's temperament and the pair state.
- The presence feeder's TRUTH of PS's ledger and the war records: L134.
- The PUBLIC `sitesNear`, with kept-secret sites excluded: L326.
- The dark-beliefs and omniscient arm: PS3, L451.

**Every belief read the text names is in item 3:** the rung, `polityHoldOf`, `knownTrailsOf`, `reliefAnswerOf` on the liege's own inputs (L398), and A's planning reads, which carry "READ CLASS: A's BELIEF" (L215).

**Item 3 makes no "only" or "every" claim. Item 4's "only" claims hold:**
- The ledger only through PS's module: §5.4, §5.5, §6.5, §12.
- Every hold PS makes only through `holdBeforeNode`: PS9. WC's wing hold is MG's `holdWingAtContact`, which is why the claim is scoped to "PS makes".
- Trust and resentment only through `applyRelationshipPatch`: §7.1–§7.3, §7.6, §7.7.

**Items 1, 2, 5, 6 and 7** match §1, §2.7, §9, §10, §11 and PS11: nine answers, five roads, four kinds, two flags, chain C14 and waves PS-0 to PS-5. **Item 8 FAILS (F1).**

## THE RULINGS (§16, whole): HOLD

- **The rows match.** The old table has 56 rows: OD-PS-0…54 plus the `↳ OD-PS-35` row. The new one has 55, after the `↳` row is folded into OD-PS-35 clause by clause (FIVE registrants, the wing record, `replanFromNode`).
- **Every row has a Ruled cell.** The dates are derived from the rows' own brackets. I spot-checked OD-PS-21, -35, -46, -48 and -54.
- **The superseded row is shown correctly.** OD-PS-21's "WITHDRAWN AND REPLACED" becomes "re-ruled … (supersedes the compile's OD-PS-21, …)", and the paraphrase matches `cure/L-PS.md` item (11).
- **The ⭐ rows are VISIBLE:** OD-PS-0, -52 and -53.
- **THE OPEN STOPS: none.** None is needed: B235 was ruled before `1beabdc85`. F2's naval bound is an unruled OPEN question, not a STOP.

## NOTES (not fails)
- **N1** — Ledger §1 says "**2** markers nested", but it carries 4 N rows (N075 and N252 are `↳`; N085 and N247 are brackets), and 635 needs all 4. A broader round-word scan finds 637 markers: two "round P5" words (old L239, L677) have no H row, and both are gone from the text.
- **N2** — Many REFINED brackets lost their inline vetoability. Old header L7 said "each is vetoable"; examples are B193 (`reserveFor`), B210 (`planMarch`), B105 (`turned_back`, old L191) and §9's two refinements (B292 · B293, old L434). §0.4 keeps "each vetoable" only for the ten, and the header now says "every ruling is vetoable (§16)". This is CH's N3 pattern and is vetoable.
- **N3** — Guide item 3 files the rung read under BELIEF without PS3's declared-label fallback ("the declared one where B holds no belief record", PS3, §2.2 L161 and §3 L250). This follows PS3's own classification (the landed belief law, "absence is NON-paranoid"), so it is not a fail. Adding the clause would be safer.
- **N4** — Guide item 4 lists writes but omits two PS writes the text names: the `armsNear` per-town set (§7.4: `passage/incursion.js` is "the ONE writer of the signal's per-town set") and the credibility charge through CH's door (§7.3). This is incomplete, but it is not an "only" claim.
- **N5** — In PS4 (L109), "(`passageStandingOf`, PS's leaf: "THE PASSAGE's ladder, `passageStandingOf`'s ally rung for every mover")" is a quote of PL §5.3's GUARDED row. That is true at `1beabdc85` (PL L308, r6), so B051's "routed to PL … widens to" was rightly dropped. The quote now reads as a label of PS's leaf, and attributing it to PL would fix that.
- **N6** — Cosmetic and inherited issues:
  - §4.3 L309 has a lowercase sentence start after the bold ("**The creditor's request, one step warmer.** where B owes …").
  - §12's L1/L2 create rows name PR's stage but not WC-6/WC-10's producers, while §5.4 says PS's ledger module writes the column's crossings. This is INHERITED: old L511 and L526 are the same.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B014 B015 B016 B024 B027 B033 B036 B037 B039 B042 B045 (PS-r2-2 · HOST-r2-2 · SEAMS-r2-1 · BD-r4-3, BLOCKING) | HOLD | THE SEA IS IN THE BOOKS paragraph verbatim (L30). §0 lines 92–93 are identical after the strip. PS1/PS2 state the sea and teleport arms. §0.4 (L97) carries B039's corrections to (4)–(7). The `ROUTE_NETWORK_LEDGER` cell keeps "measured at `81f1cd963`" |
| B054 B152 B201 B362 B455 (PS-r2-1, BLOCKING) | HOLD | PS5 L111 "war never narrows anyone's width; `wide` is the CEILING". §4.4 L318's withdrawn liege carve-out is gone. P13 and OD-PS-13 lines are identical after the strip |
| B065 B089 B169 B347 B358 B471 (PS-r2-3 · PS-r2-4, BLOCKING) | HOLD | §2.1 key "never `departTick`" (L152). PS9's TWO MODES + THEOREM (L119–124). §4.1 step 2 THE SWEEP (L281). The stamp lines are identical after the strip |
| B062 B121 B230 B329 B428 B493 (BD-r4-3, BLOCKING) | HOLD | One known set, one network, one price: "never BD's `weeksMult` 1.5" (L117, L207). §5.6 heading and OD-PS-44 |
| B115 B145 B203 B291 B369 B371 B408 B421 B441 B451 B453 B468 B509 (BLOCKING stamps and change notes) | HOLD | Lines are identical after the strip (202, 235, 554, 582, 593, 597, 673, 764), or differ only by ruling tags (636, 694, 697, 719, 722). B291's requirement-24 words are verbatim in §9 L436 |
| B235 · C520 (STOP SEAMS-r5-2-scope) | HOLD | Ruled scope at §5.6 L350 and OD-PS-44. C520 is in history verbatim |
| S-L270.1/.2 · S-L353.1 · S-L376.1 · S-L391.1 · S-L397.1 · S-L458.1 · S-L484.1 · S-L492.1 · S-L721.1 · S-L723.1 · S-L736.1 · S-L83.1 · S-L604.1 (KEPT) | HOLD | S-a/e/f/g present at the lines above. S-L83.1 and S-L604.1 are not markers (a quoted verb; P28's title) |
| B409 · B410 (ST row, RE-RULED) | HOLD | L630 "THE HELPER'S FREEZE AT THE APPROACH … held by the hold helper's FREEZE at its prior position" |
| B167 · B311 · B396 · B481 · A-L627.1 · A-L727.1 (FIVE / FIFTH) | HOLD | PS9, PS11, L458, L625, L722 |
| B307 · B308 · A-L448.1 · A-L449.1 · B423 · A-L639.1 (flag ↳ rows; MG ↳ row) | HOLD | L448–449; MG row L636 carries both callees and "a wing has NO march row" |
| B090 · B091 (the wing) | HOLD | L156: the later bracket wins, "NO march row", bank on MG's wing row, vetoable kept |
| B068 (Bound 2 vs a chosen freeze) | HOLD | L125 states OD-FC-103 exactly (fold L1359) |
| B127 | **FAIL (F2)** | Above |
| B028 · B397 | **FAIL (F1)** | Above. The rest of each line holds: the PL quote is PL's consolidated words, and PL's call-site row read "transit, not a decision" already at `1beabdc85` (PL L210) |
| B029 · B030 (six actor kinds) | HOLD | §0.2 L80 |
| B232 · B062 (lowest rungs → way-mode edges) | HOLD | PS8 L117, per B232 and fold §3.3.18 |
| B048 · B049 · B050 · B051 · B052 (PS4) | HOLD (N5) | L109: the suspended link reads `rival`, the contest's own war is an incursion, vetoable kept; PL-C-1's `toll_exemption` in the PL §4.5 cite |
| B469 (OD-PS-29) | HOLD | RULINGS-ROUND2b L41; row L716; §5.1 sentence |
| A-L79.1 · A-L315.1 | HOLD | L83 r6 "every rung `wild · way · trail` … hidden and ×2"; L316 OD-FC-28 (a) "as amended", true (fold L1240 "(a) GAINS THE PASSAGE's rows") |
| N075 · N085 | HOLD | PS12's composer clause (L134); PS14 (1)–(2) (L138) |
| random 30: B013 B034 B038 B053 B095 B100 B129 B140 B153 B160 B181 B190 B193 B210 B250 B280 B300 B320 B340 B380 B435 B436 B497 B505 B510 B511 B517 B518 B086 B099 | HOLD (N2 on B193, B210) | Old and new read side by side (`scratchpad/fvps/show.py`, `wd.py`): each carries its latest bracket's content, with no new decision; B320 keeps "PS asks ONE through the fold's HB INBOX" |
| H-L172.1 · H-L239.1–.4 · H-L583.1 · H-L590.1 · H-L608.1 · H-L718.1–.5 | HOLD | Round labels removed. L240's persisted-shapes line restates every field the rounds added (`liegeAnswer`, `guardLoss?`, `fatigueFloor01?`, `groundCap01?`, `trailNodes`, `in_hearing`, `hidden_way`, `banner`) |
| whole-volume sweep (597 old body lines aligned to new; numeral, negation and token diffs; a coverage score per folded bracket) | HOLD except F1 and F2 | 366 lines are identical after the strip. Every changed line with a lost numeral or low coverage was read |
| THE READER'S GUIDE | **FAIL (F1, item 8)**; items 1–7 HOLD | Above |
| THE RULINGS §16 | HOLD | Above |
| cure record | HOLD | Exact substrings, above |

**CONFIRMED vs PLAUSIBLE:**
- **CONFIRMED by executed scripts and side-by-side reads:** the ratchet re-run and its one explanation, the allow-file location check, my marker count, the numeral-collapse check, the cure-record containment, the seat-1-versus-final diff, the § cross-reference resolver (unresolved hits are other volumes' sections), the ES receipt for F1, the fold and MG receipts for F2, and every row receipt above.
- **PLAUSIBLE only:** the judgement that N1–N6 are not fidelity fails, and that the unsampled stamp-only rows hold. They are covered by the "identical after the strip" line census, not read one by one.
