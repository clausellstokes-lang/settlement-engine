# OP — THE FIDELITY LEDGER OF THE CONSOLIDATION (P8b, lane C-OP, 2026-10-20)

Old text: `history/OP-bracketed-1beabdc85.md` (253,413 bytes, 778 lines) — confirmed byte-identical to `docs/DESIGN_FP_ARCH_OP.md` by `cmp` before the pass began. New text: `consolidate/OP-new.md`, copied over the volume after the ratchet. Cure record moved verbatim: `history/OP-cure-record.md` (Part 1 = old header lines 3–11; Part 2 = old §19, lines 673–778 — both checked by substring as verbatim). The build is a script over the old text (scratchpad `c-op/`: `scan.py` the balanced-bracket scan; `strip.py` removes every bracket span with its one leading space and every `↳` row line; `part0.py`–`part3.py` hold every substitution, each asserted to match its stated number of times; `build.py` composes the volume), so every passage not named in §3 below is byte-faithful to `1beabdc85` minus its brackets.

## 1. THE COUNT (by script, before writing)
Markers in the old text: **417** =
- **346 brackets** (`[CURED …]` 279 · `[REFINED …]` 45 · `[ADDED …]` 22; balanced-bracket scan, none nested, none multi-line): 9 header templates (lines 7–11, inside backticks) + 332 in the body (lines 12–672) + 5 in the cure record. The one `[PLAUSIBLE; ⛔ build-time STOP S-3 …]` bracket (old §6.1) is a design mark, not a review marker; its STOP is counted under the STOP marks (S08).
- **18 `↳` marks** outside brackets: 11 `| ↳` table rows (lines 150, 165, 366, 391, 464, 559, 565, 575, 594, 641, 643), 3 in-row references (391, 464, 575), 3 running-text references to the fold's `↳` rows (310, 376, 378) and 1 inside the cure record (739).
- **16 round and section headers**: the four ROUND header lines (8–11); §0.2's three round lead-ins (line 57: "THE CHAIR'S RULINGS FOR THIS ROUND", "ROUND 2", "ROUND 3"); §0.4's heading (72) and its three round lead-ins (80–82); §19 THE CURE RECORD (673) and its four round blocks (675, 718, 741, 766).
- **37 STOP marks** outside brackets: 25 in the body (the build-time `⛔ S-n` / `⛔ STOP` marks and the two "the r1 STOP … RULED" sentences at 556 and 635) and 12 in the cure record. Four uses of the word that are vocabulary, not marks, are excluded: `COVERT_STOP_KEYS`/"ONE more `covert`-face STOP" (36), "EXACTLY ONE STOP" (70), "THE WASTED STOP" (181), "ONE-STOP-OFF" (212).

There are no `(fp-final rN)` or `(fp-final P5–P8 …)` stamps outside brackets and no `ROUTED-UNAPPLIED`. The ledger has **417 rows** (§6), one per marker.

**Dispositions: old markers 417 · folded 355 · dropped 3 · moved 36 · kept 23.**

| new section | folded | dropped (superseded) | moved | kept (design marks) |
|---|---|---|---|---|
| header + history | — | — | 36 | — |
| THE ANSWER · §0 | 31 | — | — | 1 |
| §1 THE LAWS | 22 | 1 | — | 1 |
| §2 THE ONTOLOGY | 35 | — | — | 1 |
| §3–§4 | 27 | 1 | — | 1 |
| §5 THE RESCUE | 17 | — | — | 3 |
| §6 THE FAVOR | 10 | 1 | — | 2 |
| §7 · §8 · §9 | 36 | — | — | 2 |
| §10 · §11 | 25 | — | — | 2 |
| §12 · §13 | 29 | — | — | 7 |
| §14 · §15 · §16 | 71 | — | — | 1 |
| §17 THE RULINGS | 45 | — | — | 2 |
| §18 | 7 | — | — | — |

STOPs of this pass: **none** (⛔ STOP OP-C-n: none raised). No conflict was left open by two brackets: the three DROPPED brackets name their successors (B055 and B101 → RULINGS-P6 A.6; B139 → B140, RULINGS-P6 D.2), and every later bracket on the same site is a later round under a later ruling (D.1/D.2 over r1's OP-r1-1/OP-r1-5 cures; E.5–E.7 over r2; G.1 over r3; the P6c `[ADDED …]` brackets of §F.4, §I.2–§I.4 and §J.5 last of all). The one review STOP of the old text (r1's STOP on RULINGS-P6 §C's IN route, old line 712) was ruled by §D.3 exactly as proposed; the volume states it as the design (§15 IN row, OD-OP-27).

## 2. THE SECTION MAP (old → new)
Header lines 1–11 → the new 4-line header (title verbatim; the compile line, the template line and the four round lines to `history/OP-cure-record.md` Part 1) + **THE READER'S GUIDE (new, 8 items)**. THE OWNER'S WORD and THE ANSWER: unchanged but for the 12:44 word now quoted verbatim (RULINGS-P6 §F.4). §0–§18 keep their numbers and titles (§0.2's first item retitled THE RULINGS OF RECORD; §0.4 retitled "What the measurement changed"); every own-section "§x" in the new text resolves (checked by script — the two old references to a non-existent "§8.2" now read "§8"). Old §19 THE CURE RECORD → `history/OP-cure-record.md` Part 2; new §19 = THE REVIEW TRAIL (one paragraph). Inside sections: §7.1 gains a lead sentence and the bullet ONE DEED PER ACT; §7.2 a lead sentence; §9 the bullet THE ERRAND'S CLASS and THE EXERT's item (iv) THE FACE; §10.1 the paragraph THE PRECEDENCE; §12 opens with THE BUILD-TIME STOPS (the cure record's final STOP state, r3/r4, restated in the body); §17 gains a "Ruled" column, lists OD-OP-1..37 in numeric order (OD-OP-23 moves between 22 and 24) and ends with THE RULINGS OF RECORD WITHOUT A ROW OF THEIR OWN and THE OPEN STOPS (none).

## 3. TEXT CORRECTIONS THAT ARE NOT MARKERS (each the latest ruling applied, or wording only)
1. §0.4 item 4: "admitted only from a captor at a T4 rung" → "only where the JAILER — the court whose cells hold the captive (`jailerOf`) — sits at a T4 rung toward the rescuer's court" — RULINGS-P6 D.2 (OP10, §4.3, OD-OP-7 and OD-OP-31 already say so); item 4 was the compile's sentence, never re-cured.
2. "§8.2" → "§8" (§0.1's habit row, §4.4): OP has no §8.2; the habit is §8's last row. "the §3.6 road ES's products use" → "the road ES's products use — ES §3.6, THE THREE PRODUCTS" (§7.2; the section read in `DESIGN_FP_ARCH_ES.md` today: "### 3.6 THE THREE PRODUCTS — exact belief-write shapes (all through the report road)").
3. Program-phase words out of the running text: "OPENED by P5 A.2" → "OPENED by `briefs/RULINGS-P5.md` A.2" (§0.1, §12 OP-3, OP-7, §15 ×2); "RN's P7 row" → "RN" (OP3 ×2, §9, §12 OP-1; OD-OP-26 "RN's row"); "requirement 24's P4 bracket" → "requirement 24" (§12 OP-8); "the P6c CH lane('s bracket)" dropped (§9, §12 OP-6, §15 CH, OD-OP-36 — the carve-out stated as CH's); "the fold lane to add" → "OP registers" (§16's heading).
4. Struck and withdrawn names restated as the design's own statement, meaning unchanged: `turned_by_captor` (§2.4, §16, OD-OP-28: "there is no `turned_by_captor`"); `caught_freeing` (§2.4, §5.3, §12 OP-3, §13 L3's struck row, §16's struck row, OD-OP-4: "there is no `caught_freeing`" / "NEVER MINTED"); "the `openLivedLeg` premise struck" → "MG keeps no `openLivedLeg` premise" (§15 MG).
5. "the chair's 12:24 answer" → "the answer to the owner's word" (OP4, §6; OD-OP-5 keeps "the 12:24 answer" in the rulings table). THE OWNER'S WORD section keeps "The chair's answer of 2026-10-20 12:24 CDT …" verbatim (a quotation record, as the pilot kept WS's). OD-OP-1: "the chair recommends against" → "the recommendation of record is against".
6. Review trail out of the running text: "OP-r1-25" (OP8, OD-OP-1); "the PS-r2-23 precedent" → "THE PASSAGE's precedent" (§11); "r2's 'at `departedTick`' cannot be read" → "a read 'at `departedTick`' cannot be made" (§2.5); "the round-r1 walls / the round-r2 walls" → "the walls the measurement found / the custody's walls" (§12 OP-0); "(widened)" / "widened" / "(restated)" / "WIDENED in r2 to" (§2.5, §6.2, §7.1 ×2, OD-OP-34); "RULED (RULINGS-P6 E.7 Q2)" → "RULINGS-P6 E.7 Q2" (§2.5) and "RULED by E.7 Q2, vetoable" → "(RULINGS-P6 E.7 Q2)" (OD-OP-31); "RULED A DEPENDENCY" → "A DEPENDENCY" (OD-OP-32); "applied by D-MG-r1 the same round" (§3.3) and "APPLIED by D-MG-r1 in the same round … read 15:2x CDT … no contradiction remains" (§15 MG) → MG §3.3 (a) quoted as the standing fact; "MG's r1 route back … since D-OP-r1 (0 hits)" → "OP holds no sentence barring a rider 'on `wild`/`way`' …" (§15 MG); "WS DECLINED the compile's route (RT-OP-1 …)" → "NONE (WS §13's OP row, `cure/D-WS-r1.md`: …)" (§15 WS); "one bracket on / with the same bracket / the same bracket, re-worded / CH's bracket" → "row" (§9 ×2, §15 ×2, OD-OP-33); the fold's `↳` references (§7.1, §10.2 ×2 — rows A03, A05, A06); "CH §10b l.569" → "CH §10b, THE ACT'S FACE" (§15 CH; a line cite dropped, CONSOLIDATE §3 (d)); "(census 2 and 3; the round's six, …)" → "(censuses 2 and 3, …)" (§16).
7. Dates out of the running text: §0.2's ruling times (14:11, 15:43, 16:18 CDT); "OPENED BY DELEGATION 2026-10-20"; "spine requirement 1's 2026-10-18 bracket" → "spine requirement 1"; "Requirement 24 with every bracket" → "as amended"; "the 10-17 restatement" → "the owner's restatement" (§10.3). Kept: the owner's-word times (THE OWNER'S WORD section, CHAIR-NOTES 20's "12:50", the owner's "08:41" word quoted in §9 and §15's CH row) — they identify the owner's words.
8. The deposit row kind `debt` → `rescue_debt` at every site the seven `[ADDED … §I.4]` twins named (§2.1 table and call-site paragraph, §6.1 ×2, §11, §12 OP-4 ×2, §13 L2 ×2, §15 fold, §16) — RULINGS-P6 §I.4. D-5's ACTION word `debt` (the freed's response — §2.4, §6, §6.1's "On `debt`", §6.2, §11's "falls to `debt`", OD-OP-34) is unchanged, as the twins require.
9. §0.2 lists §G.1, §I.2, §I.3, §I.4, §F.4 and §J.5 beside the rulings it already quoted — each is applied in the text (an index, nothing new).
10. ⭐ count 16 → 20: + the header line + the READER'S GUIDE ×4 (OD-OP-2, OD-OP-3, OD-OP-24, OD-OP-25 — each already ⭐ in §17); the two ⭐ of the deleted `↳` rows (OD-OP-1) re-placed in §2.1's rename sentence and §16's `rowKind` row; the cure record's one ⭐ (old line 693, OD-OP-24) moved to history. No row gained an owner mark it did not have.
11. DRAFT 33 → 32 (the ratchet's one difference class, EXPLAINED): the old text's 33rd DRAFT sits in the cure record (old line 750, OP-Vm2's disposition: "a declared one-errand staleness (DRAFT)"), moved verbatim to history; the design mark it records stands in the body unchanged (§2.5 `detourCandidates`: "a declared one-errand staleness, DRAFT, vetoable"). Every body DRAFT survives (31 + B150's "DRAFT, shameful", folded into §7.1). Not padded.

## 4. ALLOW-MISSING (the tokens in `consolidate/OP-allow.txt`, each with its reason)
- `rescue · false_word · debt` — SUPERSEDED: §16's `rowKind` member list now reads `rescue · false_word · rescue_debt` (RULINGS-P6 §I.4; A15).
- `0 when cost > slack` — SUPERSEDED: the old slackFactor formula named only inside B107; the law is `1 / (1 + lateWeeks(c))` (§4.2, OD-OP-12).
- `EQUALS` — trail: inside B092 ("the `EQUALS` guard is restated as what it is"); §3.3 states the guard ("must EQUAL the errand's").
- The nine header template brackets (`[CURED 2026-10-20 (fp-final P6 r1–r4) — <id>: …]` ×4, `[REFINED 2026-10-20 (fp-final P6 r1–r4) — …]` ×4, `[REFINED 2026-10-20 (fp-final P6) — what; why]`) — MOVED with the header (history Part 1).
- Review-trail paths that lived only in the header's round lines, the cure record or a trail-only bracket — MOVED (history): `cure/D-FOUR-r4.md`, `cure/D-MG-r2.md`, `cure/D-OP-r1.md`, `cure/D-OP-r2-probe/`, `cure/D-OP-r2.md`, `cure/D-OP-r3-probe/receipts.txt`, `cure/D-OP-r3.md`, `cure/L-CH-PD.md`, `cure/L-FS.md`, `cure/L-MG.md`, `cure/L-WS.md`, `skeptic/BRACKETS-p6c-verify.md`, `skeptic/MG-r1.md`, `skeptic/OP-r1-verify.md`, `skeptic/OP-r1.md`, `skeptic/OP-r2-verify.md`, `skeptic/OP-r2.md`, `skeptic/OP-r3-verify.md`, `skeptic/OP-r3.md`, `skeptic/SEAMS-P6.md`; and the cure record's words `date`, `-r2`, `-r3`.
- Short forms that lived only in the cure record, each surviving in the new text inside its full cite: `captureCauseId` (`roads/state.js :: captureCauseId`, §9), `relationshipTypeBetween` (`embassyHazard.js :: relationshipTypeBetween`, §2.5), `toldBy.tick` (the `toldBy: { road, ref, tick }` source, §9), `mouthpiece-key.out` (`cure/D-OP-r2-probe/mouthpiece-key.out`, §0.1, §7.1).

Tokens that lived only inside brackets and are FOLDED into the new text (so not allowed-missing): `PAID_PLANT_PRICE_BANDS`, `receipt.marketName`, `assertedBand = clamp(selfBand + T.INFLATE_BANDS, 0, 4)` (B145 → §7.1), `briefs/L-CH-PD.md`, `cure/OWNER-WORDS-2026-10-20.md` (B166 → §9), `envoyErrandVocabulary.js :: ENVOY_PURPOSE_CLASSES` (B167 → §9), `exertion.settlementId` (B171 → §9), `expectedReturnTick − last outbound arrival` (B076 → §2.5), `kind01` · `law01` · `force01` (B150 → §7.1), `readiness` (B108 → §12), the CONFIRMED `return namedPersonLegTicks(…)` line (B098 → §3.3); the header's `DESIGN_FP_SPINE.md`, `DESIGN_FP_COHERENCE_FOLD.md`, `briefs/L-OP.md`, `cure/L-OP-probe/` and the kit's `cure/L-OP.md` path stay in the new header.

## 5. THE RATCHET
`python3 tools/consolidate-ratchet.py history/OP-bracketed-1beabdc85.md consolidate/OP-new.md --allow-missing-file consolidate/OP-allow.txt` →

```
tokens: old 824 · new 791 · missing 0 · new-in-new 6
  NEW tokens in the new text (each must be a registered name, never a mint):
   + 1beabdc85
   + cure/
   + history/OP-cure-record.md
   + opportunityStage.js :: advanceOpportunities
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/OP-cure-record.md
   + skeptic/
cites (path :: symbol): old 75 · new 76 · missing 0
laws (XX1–XXn bold): old 19 · new 19
OD rulings: old 39 · new 39
owner rows ⭐: old 16 · new 20
DRAFT marks: old 33 · new 32  ← FEWER (explain in the ledger)
UNMEASURED marks: old 16 · new 16
wave ids (XX-n): old 9 · new 9
flags (…Enabled): old 18 · new 18
review markers left in the new text: 0
RATCHET 1 DIFFERENCE CLASSES
```

The one difference class is DRAFT 33 → 32, explained in §3 item 11. The six new tokens are the header's and the review trail's own paths (`1beabdc85`, the history path in two spellings, `cure/`, `skeptic/`) and a shorter spelling of a landed cite (`opportunityStage.js :: advanceOpportunities`, the READER'S GUIDE) — no mint.

## 6. THE ROWS (one per marker; `B` = bracket by its index in old-text order, `A` = `↳` mark, `H` = round/section header, `S` = STOP mark)

| id | old line · section | kind | first characters | disposition | new § | what happened |
|---|---|---|---|---|---|---|
| B000 | L7 header | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — what; why]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B001 | L8 header | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — <id>: …]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B002 | L8 header | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r1) — …]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B003 | L9 header | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — <id>: …]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B004 | L9 header | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r2) — …]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B005 | L10 header | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — <id>: …]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B006 | L10 header | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r3) — …]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B007 | L11 header | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — <id>: …]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B008 | L11 header | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r4) — …]` | MOVED | history Part 1 | a header template line; moved with the header block |
| B009 | L21 THE ANSWER | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-1 · OP-r1-2 · OP-` | FOLDED | THE ANSWER | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B010 | L32 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B011 | L33 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B012 | L34 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2 · OP-r1-3]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B013 | L35 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B014 | L38 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B015 | L38 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B016 | L38 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (the verifier's` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B017 | L39 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 (the verifier's` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B018 | L40 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B019 | L41 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B020 | L43 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B021 | L45 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-25]` | FOLDED | §0.1 | the answer already states the cured reading (presence and carried picture; the declared margin; the self-bluff) |
| B022 | L46 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-6]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B023 | L47 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B024 | L47 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-9]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B025 | L50 §0.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-20]` | FOLDED | §0.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B026 | L57 §0.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — the rulings applied]` | FOLDED | §0.2 | §0.2 restated as THE RULINGS OF RECORD; the §A.3 · §A.5 · §B.1 quotes kept in place |
| B027 | L57 §0.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — the round's rulings app` | FOLDED | §0.2 | §0.2 THE RULINGS OF RECORD: the §D.1 · §D.2 · §D.3 quotes kept, the round lead-in and time dropped |
| B028 | L57 §0.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — the round's rulings app` | FOLDED | §0.2 | §0.2 THE RULINGS OF RECORD: the §E.5 · §E.6 · §E.7 quotes kept, the round lead-in and time dropped |
| B029 | L70 §0.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §0.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B030 | L80 §0.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2 · 3 · 4 · 5 · 1` | FOLDED | §0.4 | §0.4 item 8 restated without its round lead-in |
| B031 | L81 §0.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 · OP-r1-5 · OP-` | FOLDED | §0.4 | §0.4 item 9 restated without its round lead-in |
| B032 | L82 §0.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V3 · OP-V4 · E.7 · X` | FOLDED | §0.4 | §0.4 item 10 restated without its round lead-in |
| B033 | L88 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V3 (E.5): the sendin` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B034 | L92 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 (D.1): the home` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B035 | L92 §1 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r2) — the carried hold filt` | FOLDED | §1 | content folded into OP3 (b): "as `map_way`'s trails are (§2.5) — a ransom begun after the traveller left is not its knowledge" |
| B036 | L92 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V4 (E.6)]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B037 | L92 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 (D.1)]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B038 | L92 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-1 · OP-r1-3: the ` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B039 | L94 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-24]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B040 | L98 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2 (BLOCKING), und` | FOLDED | §1 | the zero-slack fact stands in OP6's own sentences and §0.3 |
| B041 | L100 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B042 | L100 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B043 | L102 §1 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — the brief's new persiste` | FOLDED | §1 | folded as OP8's first sentence: "Every form the owner names already has a carrier (measured, `cure/L-OP.md` §1.3)" |
| B044 | L104 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7 · OP-r1-8]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B045 | L106 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B046 | L106 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-6]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B047 | L108 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-9 · OP-r1-10]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B048 | L110 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B049 | L110 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B050 | L112 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B051 | L112 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-13]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B052 | L116 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-22]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B053 | L118 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-r3v-m1: the bare 'na` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B054 | L124 §1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-18 · MG-r1-26]` | FOLDED | §1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B055 | L124 §1 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r1) — the chair's rung spli` | DROPPED | §1 | superseded by RULINGS-P6 A.6 — the bracket records the withdrawal of the L-MG item 11 (b) rung split; nothing of it remains to fold |
| B056 | L131 §2.1 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — the brief's per-mission ` | FOLDED | §2.1 | folded into §2.1: the mark sits on the mission's own record because a ring (the pulse history, 80) cannot carry a cap across undo, import or a long mission |
| B057 | L141 §2.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-15]` | FOLDED | §2.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B058 | L148 §2.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §2.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B059 | L148 §2.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10]` | FOLDED | §2.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B060 | L150 §2.1 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P6 §I.` | FOLDED | §2.1 | the label of the ↳ `rescue_debt` row (A01); the rename folded into §2.1's table and a sentence after it (RULINGS-P6 §I.4) |
| B061 | L152 §2.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-28]` | FOLDED | §2.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B062 | L153 §2.1 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P6 §I.` | FOLDED | §2.1 | the twin applied in §2.1's call-site paragraph: "generosity consumes a `rescue_debt` row" |
| B063 | L156 §2.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-3 · OP-r1-14 · OP` | FOLDED | §2.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B064 | L162 §2.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-9]` | FOLDED | §2.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B065 | L164 §2.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — R-PD-8]` | FOLDED | §2.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B066 | L164 §2.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-17]` | FOLDED | §2.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B067 | L165 §2.3 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; D-CH-PD-r1 route 4 · CH-PD-` | FOLDED | §2.3 | the label of the ↳ PARAGON row (A02), folded into §2.3, §7.1 and §9 |
| B068 | L167 §2.3 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — the roads' named NPCs tr` | FOLDED | §2.3 | folded into §2.3's roads-traveller SLOT cell (why a roads traveller does not rescue) |
| B069 | L169 §2.3 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — the brief's list carried` | FOLDED | §2.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B070 | L178 §2.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7]` | FOLDED | §2.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B071 | L179 §2.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7]` | FOLDED | §2.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B072 | L180 §2.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-8]` | FOLDED | §2.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B073 | L181 §2.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-6]` | FOLDED | §2.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B074 | L182 §2.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §2.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B075 | L185 §2.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-27]` | FOLDED | §2.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B076 | L194 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2: the round's pr` | FOLDED | §2.5 | folded into §2.5 `missionSlack`: "`expectedReturnTick − last outbound arrival` is the return journey's length, never slack" |
| B077 | L195 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B078 | L195 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-1 · OP-r1-3]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B079 | L196 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 (D.1)]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B080 | L196 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — n4]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B081 | L196 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-Vm2]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B082 | L196 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-r3v-m1]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B083 | L196 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-1 · OP-r1-2 · OP-` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B084 | L198 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B085 | L199 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — E.7 Q2: D-OP-r2's open ` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B086 | L199 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (the verifier's` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B087 | L200 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B088 | L201 §2.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7]` | FOLDED | §2.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B089 | L212 §3.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §3.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B090 | L215 §3.3 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r1) — the mid-leg stop's ti` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B091 | L215 §3.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — n3]` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B092 | L215 §3.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2 · OP-r1-22: the` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B093 | L215 §3.3 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — the brief assumed "a leg` | FOLDED | §3.3 | the measurement stands in §0.1's `resumeFromEncounter` row and §0.4 item 2 |
| B094 | L216 §3.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-16 · MG-r1-15 · X` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B095 | L217 §3.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B096 | L218 §3.3 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r2) — RULINGS-P6 A.3's "par` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B097 | L218 §3.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B098 | L219 §3.3 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r3) — the detour's pricer n` | FOLDED | §3.3 | folded into §3.3 THE PHYSICS: MG §8.2's name for `livedLegTicks` and the CONFIRMED line, quoted |
| B099 | L219 §3.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — X-DMG2-OP: "as MG compo` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B100 | L219 §3.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-18 · MG-r1-26]` | FOLDED | §3.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B101 | L219 §3.3 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r1) — the L-MG item 11 (b) ` | DROPPED | §3.3 | superseded by RULINGS-P6 A.6 — the twin of B055 (the withdrawn rung split) |
| B102 | L222 §3.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §3.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B103 | L225 §3.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-26]` | FOLDED | §3.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B104 | L235 §4.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7]` | FOLDED | §4.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B105 | L235 §4.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-3 · OP-r1-10]` | FOLDED | §4.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B106 | L236 §4.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-9]` | FOLDED | §4.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B107 | L237 §4.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2: the old '0 whe` | FOLDED | §4.2 | the slackFactor text is the cure; the superseded formula `0 when cost > slack` is listed under ALLOW-MISSING |
| B108 | L238 §4.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-3 · ⛔ S-1 RESOLVE` | FOLDED | §4.2 | S-1 RESOLVED → §12 THE BUILD-TIME STOPS ("never by a believed `readiness` stand-in") |
| B109 | L241 §4.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — n2: the header said BEL` | FOLDED | §4.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B110 | L242 §4.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2): in an oc` | FOLDED | §4.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B111 | L242 §4.3 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — a friend's cells are ask` | FOLDED | §4.3 | folded into §4.3 after the friend rule ("A friend's cells are asked … so admitting one would make it free") |
| B112 | L242 §4.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-6: admission by t` | FOLDED | §4.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B113 | L242 §4.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5]` | FOLDED | §4.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B114 | L242 §4.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-14]` | FOLDED | §4.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B115 | L245 §4.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — n1]` | FOLDED | §4.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B116 | L245 §4.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — n1: at master no errand` | FOLDED | §4.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B117 | L251 §5.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §5.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B118 | L251 §5.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5 · OP-r1-28]` | FOLDED | §5.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B119 | L255 §5.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §5.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B120 | L255 §5.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-6 · OP-r1-14]` | FOLDED | §5.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B121 | L256 §5.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7]` | FOLDED | §5.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B122 | L256 §5.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-8: 'turned_by_cap` | FOLDED | §5.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B123 | L259 §5.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-12]` | FOLDED | §5.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B124 | L262 §5.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §5.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B125 | L262 §5.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4: OD-OP-13 resta` | FOLDED | §5.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B126 | L262 §5.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-V5 (G.1): the deed's` | FOLDED | §5.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B127 | L263 §5.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §5.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B128 | L263 §5.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §5.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B129 | L263 §5.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §5.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B130 | L263 §5.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-V5 (G.1)]` | FOLDED | §5.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B131 | L264 §5.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-8: the 'turned_by` | FOLDED | §5.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B132 | L269 §5.4 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — one carrier per favor fo` | FOLDED | §5.4 | folded into §5.4: "— one carrier per favor for every custody kind" |
| B133 | L272 §5.5 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4 · OP-r1-8: the ` | FOLDED | §5.5 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B134 | L278 §6 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-14]` | FOLDED | §6 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B135 | L282 §6.1 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P6 §I.` | FOLDED | §6.1 | the twin applied in §6.1: "On `debt` (D-5's action word: the freed's response), OP deposits a `rescue_debt` row" and "OP's `rescue_debt` rows" |
| B136 | L285 §6.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-25]` | FOLDED | §6.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B137 | L285 §6.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1: the lean's and t` | FOLDED | §6.2 | folded into §6.2's S-8 sentence: the lean's and the mouthpiece's key are ONE key space, so one car serves both |
| B138 | L285 §6.2 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — the compromise rides the` | FOLDED | §6.2 | folded as §6.2's last sentence (the WILLED lean, never the returned-captive channel) |
| B139 | L289 §6.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5]` | DROPPED | §6.3 | superseded by B140 (RULINGS-P6 D.2): the r1 cure put the grievance on the venue's court; the latest puts it on the JAILER |
| B140 | L289 §6.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (the verifier's` | FOLDED | §6.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B141 | L292 §6.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-8]` | FOLDED | §6.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B142 | L292 §6.4 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §6.4 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B143 | L292 §6.4 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — the grievance always lan` | FOLDED | §6.4 | folded as §6.4's last sentence (the grievance lands where the jailer would believe it) |
| B144 | L298 §6.6 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-20]` | FOLDED | §6.6 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B145 | L304 §7.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-9 · OP-r1-10 (MAJ` | FOLDED | §7.1 | folded as §7.1's lead sentence (the validator's exact keys; the self-bluff's line `assertedBand = clamp(selfBand + T.INFLATE_BANDS, 0, 4)`) |
| B146 | L305 §7.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — R-PD-8: L-CH-PD measure` | FOLDED | §7.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B147 | L306 §7.1 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; D-CH-PD-r1 route 4 · CH-PD-` | FOLDED | §7.1 | folded into §7.1 THE CHOICE: less readily than a CHAOTIC god's (CH S68), the probe's numbers, the EVIL lawful god's 1.010 |
| B148 | L308 §7.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1 (MAJOR, the verif` | FOLDED | §7.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B149 | L309 §7.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §7.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B150 | L312 §7.1 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c brackets-verify; RULINGS-P6 ` | FOLDED | §7.1 | folded as §7.1's bullet ONE DEED PER ACT, MINTED AT EXPOSURE ONLY (RULINGS-P6 §J.5); "the ↳ row beside" → "beside" |
| B151 | L316 §7.2 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — the owner's "due envoy t` | FOLDED | §7.2 | folded as §7.2's lead sentence (two landed halves joined; OP mints neither) |
| B152 | L317 §7.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-23]` | FOLDED | §7.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B153 | L318 §7.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §7.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B154 | L333 §8 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §8 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B155 | L339 §8 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-19]` | FOLDED | §8 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B156 | L347 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-Vm3]` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B157 | L347 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 (BLOCKING — the` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B158 | L347 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V4 (MAJOR; E.6): r2 ` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B159 | L347 §9 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r3) — E.6's "the VENUE COUR` | FOLDED | §9 | the reading stands in §9 (the JAILER's own hold record, `jailerOf`), OD-OP-35 ("in an occupied town the occupier's") and §14 row 36 |
| B160 | L347 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-13; ⛔ S-5 RESOLVE` | FOLDED | §9 | S-5 RESOLVED → §12 THE BUILD-TIME STOPS; the row admitted under `order` (§9) |
| B161 | L347 §9 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r3) — E.5's 'court_errand' ` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B162 | L347 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V3 (MAJOR; E.5): r2 ` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B163 | L347 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-Vm1]` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B164 | L347 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-V5]` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B165 | L347 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V2 (MAJOR, the verif` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B166 | L348 §9 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §F.4 · CH-PD-r1-` | FOLDED | §9 | folded into §9's first bullet (the sentence re-attributed: a GOOD god's champion rescues more readily — `briefs/L-CH-PD.md` item 2; the owner's word `cure/OWNER-WORDS-2026-10-20.md` item 8) and the 12:44 word quoted verbatim in THE OWNER'S WORD |
| B167 | L349 §9 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-3 / RULINGS-P6 §I.` | FOLDED | §9 | folded as §9's bullet THE ERRAND'S CLASS (RULINGS-P6 §I.3), with its master cite `envoyErrandVocabulary.js :: ENVOY_PURPOSE_CLASSES` |
| B168 | L350 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-14]` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B169 | L350 §9 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — a paragon is never held ` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B170 | L350 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-21: relabelled fr` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B171 | L351 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-V5 (MAJOR; G.1): r3'` | FOLDED | §9 | `exertion.settlementId` folded into THE EXERT's (ii); the rest is the cure's history |
| B172 | L351 §9 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r4) — the act's FACE that C` | FOLDED | §9 | folded as (iv) THE FACE in THE EXERT IS THE CARD ONLY, with B173's correction; the line cite "l.569" dropped (CONSOLIDATE §3 (d)) |
| B173 | L352 §9 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; RULINGS-P6 §F.4) — "a merci` | FOLDED | §9 | applied: §9's first bullet and (iv) read "a good god's champion rescues more readily" |
| B174 | L353 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — R-PD-8: the lean bounds` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B175 | L353 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-17]` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B176 | L353 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B177 | L354 §9 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; D-CH-PD-r1 route 4 · CH-PD-` | FOLDED | §9 | the twin applied in §9 ANY PARAGON'S FALSE WORD (by reference to §7.1) |
| B178 | L355 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-15]` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B179 | L356 §9 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-18]` | FOLDED | §9 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B180 | L365 §10.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §10.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B181 | L365 §10.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5]` | FOLDED | §10.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B182 | L365 §10.1 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-12]` | FOLDED | §10.1 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B183 | L366 §10.1 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 / RULINGS-P6 §I.` | FOLDED | §10.1 | the label of the ↳ `rescue_attempt` row (A04) |
| B184 | L368 §10.1 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r1) — the brief's STANDING ` | FOLDED | §10.1 | folded into §10.1 after the card's Evidence-Law sentence: no STANDING card (OD-OP-30) |
| B185 | L369 §10.1 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 / RULINGS-P6 §I.` | FOLDED | §10.1 | folded as §10.1's paragraph THE PRECEDENCE (RULINGS-P6 §I.2; OD-OP-37); "(P7)" and the fold's ↳ dropped |
| B186 | L376 §10.2 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-23: 'carry_word' ` | FOLDED | §10.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B187 | L378 §10.2 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r2) — r1 named the leaf's a` | FOLDED | §10.2 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B188 | L381 §10.3 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-12]` | FOLDED | §10.3 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B189 | L389 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B190 | L389 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-9]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B191 | L389 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-1 · OP-r1-3]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B192 | L389 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B193 | L389 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B194 | L390 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B195 | L390 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B196 | L390 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B197 | L390 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B198 | L390 §11 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-21]` | FOLDED | §11 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B199 | L391 §11 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P6 §I.` | FOLDED | §11 | the label of the ↳ §11 row (A07) |
| B200 | L400 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2 · 3 · 4 · 5 · 9` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B201 | L400 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 · OP-r1-5 · OP-` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B202 | L401 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 · OP-V1]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B203 | L402 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — n5]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B204 | L406 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-22]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B205 | L407 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-r3v-m3]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B206 | L407 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — E.7 Q1]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B207 | L412 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §12 | stripped; the dangling "—" removed: "(`rosterKeyOf`, S-8)" |
| B208 | L412 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B209 | L418 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B210 | L418 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B211 | L419 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-12]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B212 | L424 §12 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P6 §I.` | FOLDED | §12 | the twin applied in §12 OP-4 (Leaves and Hosts read `rescue_debt`) |
| B213 | L425 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-20]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B214 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V4]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B215 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V3]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B216 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 · OP-V2]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B217 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-Vm1]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B218 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-V5]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B219 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — E.7 Q1 · OP-V3: r2 wrot` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B220 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-r3v-m5]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B221 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V3 · E.7 Q1]` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B222 | L432 §12 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-13 · 15 · 17 · 21` | FOLDED | §12 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B223 | L445 §13 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-22]` | FOLDED | §13 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B224 | L464 §13 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P6 §I.` | FOLDED | §13 | the label of the ↳ §13 L2 row (A09) |
| B225 | L480 §13 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §13 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B226 | L487 §13 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-15]` | FOLDED | §13 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B227 | L512 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5 · OP-r1-7]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B228 | L514 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B229 | L515 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-1]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B230 | L516 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-9]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B231 | L518 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4 · OP-r1-25]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B232 | L519 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B233 | L520 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-8]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B234 | L526 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-12]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B235 | L529 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — X-DMG2-OP]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B236 | L529 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-18 · MG-r1-26]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B237 | L532 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-21]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B238 | L534 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B239 | L535 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B240 | L536 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-6]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B241 | L537 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B242 | L538 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-14]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B243 | L539 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-13]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B244 | L540 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 (D.1)]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B245 | L540 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — E.7 Q1]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B246 | L541 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B247 | L542 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B248 | L543 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V2]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B249 | L543 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V3 (E.5)]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B250 | L544 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — E.7 Q2]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B251 | L545 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V4 (E.6)]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B252 | L546 §14 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-V5 (G.1)]` | FOLDED | §14 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B253 | L554 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2 · OP-r1-11]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B254 | L554 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 · OP-r1-5]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B255 | L556 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B256 | L556 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — STOP-C-IN]` | FOLDED | §15 | the STOP-C-IN ruling restated in §15's IN row as the design: "by RULINGS-P6 §D.3 …" |
| B257 | L556 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B258 | L557 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-27]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B259 | L557 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-19]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B260 | L557 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-1]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B261 | L557 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B262 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-13]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B263 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B264 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V2]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B265 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V3]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B266 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V4]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B267 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-Vm1]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B268 | L558 §15 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r4)]` | FOLDED | §15 | an empty REFINED stamp; its content is B172's act face, stated in §15's CH row |
| B269 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-V5]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B270 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-15]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B271 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-17]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B272 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — R-PD-8]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B273 | L558 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-14]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B274 | L559 §15 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-3 / RULINGS-P6 §I.` | FOLDED | §15 | the label of the ↳ CH row (A11) |
| B275 | L560 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-13]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B276 | L562 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B277 | L563 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-20]` | FOLDED | §15 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B278 | L565 §15 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 / RULINGS-P6 §I.` | FOLDED | §15 | the label of the ↳ BD row (A12) |
| B279 | L571 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-16 · MG-r1-15 · X` | FOLDED | §15 | §15's MG row restated to its standing facts (MG §3.3 (a) quoted; no `openLivedLeg` premise) |
| B280 | L571 §15 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r2) — A.3's parenthesis rea` | FOLDED | §15 | §15's MG row: the A.3 reading stands ("ROUTED to MG … once the errand-row slot lands") |
| B281 | L571 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — X-DMG-OP, NOTED]` | FOLDED | §15 | §15's MG row: the met route restated as the standing fact (no rider barred "on `wild`/`way`") |
| B282 | L572 §15 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — X-DWS-OP: r1's "a raidi` | FOLDED | §15 | §15's WS row restated to WS §13's answer |
| B283 | L575 §15 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 · SEAMS-P6-6 / R` | FOLDED | §15 | the label of the ↳ fold row (A13) |
| B284 | L587 §16 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7 · OP-r1-8]` | FOLDED | §16 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B285 | L588 §16 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §16 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B286 | L594 §16 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P6 §I.` | FOLDED | §16 | the label of the ↳ `rescue_debt` token row (A15) |
| B287 | L596 §16 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4 · OP-r1-7 · OP-` | FOLDED | §16 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B288 | L597 §16 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-22]` | FOLDED | §16 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B289 | L598 §16 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §16 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B290 | L599 §16 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1 · OP-r1-5 · OP-` | FOLDED | §16 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B291 | L600 §16 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-18 · MG-r1-26]` | FOLDED | §16 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B292 | L610 §17 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — measured: 'cure/L-OP.md'` | FOLDED | §17 | receipt folded into OD-OP-1: "measured: `cure/L-OP.md` §1.3" |
| B293 | L613 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-11]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B294 | L615 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B295 | L616 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B296 | L616 §17 | bracket REFINED | `[REFINED]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B297 | L616 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5 · OP-r1-6 · OP-` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B298 | L617 §17 | bracket REFINED | `[REFINED]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B299 | L618 §17 | bracket REFINED | `[REFINED]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B300 | L619 §17 | bracket REFINED | `[REFINED]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B301 | L620 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-7 · OP-r1-8]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B302 | L621 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-24]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B303 | L621 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2 · OP-r1-3 · OP-` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B304 | L622 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B305 | L623 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1: "has heard" na` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B306 | L624 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-5 · OP-r1-10 · OP` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B307 | L625 §17 | bracket REFINED | `[REFINED]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B308 | L627 §17 | bracket REFINED | `[REFINED]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B309 | L628 §17 | bracket REFINED | `[REFINED]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B310 | L628 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-21]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B311 | L632 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-15]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B312 | L633 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B313 | L634 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B314 | L634 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-1 · OP-r1-3]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B315 | L635 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10 · OP-r1-27]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B316 | L635 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — STOP-C-IN · OP-V1]` | FOLDED | §17 | the STOP-C-IN ruling restated in OD-OP-27 as the design |
| B317 | L636 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-8]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B318 | L637 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B319 | L638 §17 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r1) — OP-r1-24]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B320 | L639 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B321 | L639 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — E.7 Q2]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B322 | L640 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-1]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B323 | L640 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — E.7 Q1]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B324 | L641 §17 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 / RULINGS-P6 §I.` | FOLDED | §17 | the label of the ↳ OD-OP-32 row (A16) |
| B325 | L642 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V2]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B326 | L642 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V3]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B327 | L643 §17 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-3 / RULINGS-P6 §I.` | FOLDED | §17 | the label of the ↳ OD-OP-33 row (A17) |
| B328 | L644 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-V1]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B329 | L645 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r3) — OP-V4]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B330 | L646 §17 | bracket REFINED | `[REFINED]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B331 | L646 §17 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r4) — OP-V5]` | FOLDED | §17 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B332 | L647 §17 | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6) — measured, 'cure/L-OP.md'` | FOLDED | §17 | receipt folded into OD-OP-23: "(measured, `cure/L-OP.md` §1.11)" |
| B333 | L648 §17 | bracket ADDED | `[ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 / RULINGS-P6 §I.` | FOLDED | §17 | the label on OD-OP-37's row; the row stands |
| B334 | L654 §18 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-4]` | FOLDED | §18 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B335 | L656 §18 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-8]` | FOLDED | §18 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B336 | L657 §18 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-20]` | FOLDED | §18 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B337 | L661 §18 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-10]` | FOLDED | §18 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B338 | L665 §18 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-26 · OP-r1-2]` | FOLDED | §18 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B339 | L666 §18 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r1) — OP-r1-2]` | FOLDED | §18 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B340 | L667 §18 | bracket CURED | `[CURED 2026-10-20 (fp-final P6 r2) — OP-r1-5 (D.2)]` | FOLDED | §18 | the cured sentence is the text at the same place; the bracket's ids and change note stay in the text of record |
| B341 | L702 §19 cure record | bracket REFINED | `[REFINED]` | MOVED | history Part 2 | a bracket inside the cure record; moved with it |
| B342 | L716 §19 cure record | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r1)]` | MOVED | history Part 2 | a bracket inside the cure record; moved with it |
| B343 | L739 §19 cure record | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r2)]` | MOVED | history Part 2 | a bracket inside the cure record; moved with it |
| B344 | L764 §19 cure record | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r3)]` | MOVED | history Part 2 | a bracket inside the cure record; moved with it |
| B345 | L778 §19 cure record | bracket REFINED | `[REFINED 2026-10-20 (fp-final P6 r4)]` | MOVED | history Part 2 | a bracket inside the cure record; moved with it |
| A01 | L150 §2.1 | ↳ | `\| ↳ 'rescue_debt' [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6` | FOLDED | §2.1 | the ↳ `rescue_debt` row folded: the table row reads `rescue_debt`; the rename's reason a sentence after the table (OD-OP-1 ⭐ kept) |
| A02 | L165 §2.3 | ↳ | `\| ↳ PARAGON [ADDED 2026-10-20 (fp-final P6c; D-CH-PD-r1 rou` | FOLDED | §2.3 · §7.1 · §9 | the ↳ PARAGON row folded: §7.1 states the CHAOTIC comparison with its probe; §2.3 and §9 cite it |
| A03 | L310 §7.1 | ↳ | `- **THE HEARING:** IN's 'plant_taken' ('took · resisted · ex` | FOLDED | §7.1 | "the fold §3.4 `plant_taken` ↳ r2" → "the fold §3.4's `plant_taken` row" |
| A04 | L366 §10.1 | ↳ | `\| ↳ [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 / RULINGS-P` | FOLDED | §10.1 | the ↳ `rescue_attempt` row folded into the row's climax and TILT/VERDICT cells |
| A05 | L376 §10.2 | ↳ | `\| a covert traveller met on a patrolled road or a watched w` | FOLDED | §10.2 | "the fold §3.1 ↳ r2b" → "the fold §3.1's row" |
| A06 | L378 §10.2 | ↳ | `\| the caught rescuer's ransom \| 'ransom' — the registry's ` | FOLDED | §10.2 | "the fold's `ransom` ↳ P4" → "the fold's `ransom` row" |
| A07 | L391 §11 | ↳ | `\| ↳ [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P` | FOLDED | §11 | the ↳ `roadRescueEnabled` row folded: "`rescue` and `rescue_debt` rows"; "falls to `debt`" stands |
| A08 | L391 §11 | ↳ | `\| ↳ [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P` | FOLDED | §11 | the in-row "§2.1 ↳" reference, folded with its row |
| A09 | L464 §13 | ↳ | `\| ↳ [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P` | FOLDED | §13 L2 | the ↳ L2 row folded: create and read read `rescue_debt` |
| A10 | L464 §13 | ↳ | `\| ↳ [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-6 / RULINGS-P` | FOLDED | §13 L2 | the in-row "§2.1 ↳" reference, folded with its row |
| A11 | L559 §15 | ↳ | `\| ↳ CH [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-3 / RULING` | FOLDED | §15 CH | the ↳ CH row folded into the CH row (THE ERRAND'S CLASS `covert`) |
| A12 | L565 §15 | ↳ | `\| ↳ BD [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 / RULING` | FOLDED | §15 BD | the ↳ BD row folded into the BD row (THE PRECEDENCE) |
| A13 | L575 §15 | ↳ | `\| ↳ The fold [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 · ` | FOLDED | §15 fold | the ↳ fold row folded into the fold row (THE PRECEDENCE; `rescue_debt`) |
| A14 | L575 §15 | ↳ | `\| ↳ The fold [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 · ` | FOLDED | §15 fold | the in-row "`ransom` ↳" reference, folded with its row |
| A15 | L594 §16 | ↳ | `\| ↳ 'rescue_debt' [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6` | FOLDED | §16 | the ↳ `rescue_debt` token row folded into the `rowKind` row (OD-OP-1 ⭐ kept) |
| A16 | L641 §17 | ↳ | `\| ↳ OD-OP-32 [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-2 / ` | FOLDED | §17 OD-OP-32 | the ↳ OD-OP-32 row folded into OD-OP-32 (THE FOREIGN-GUEST HOLD TAKES THE SAME PRECEDENCE) |
| A17 | L643 §17 | ↳ | `\| ↳ OD-OP-33 [ADDED 2026-10-20 (fp-final P6c; SEAMS-P6-3 / ` | FOLDED | §17 OD-OP-33 | the ↳ OD-OP-33 row folded into OD-OP-33 (THE ROAD'S CLASS) |
| A18 | L739 §19 cure record | ↳ | `**[REFINED 2026-10-20 (fp-final P6 r2)] beyond the inputs, e` | MOVED | history Part 2 | inside the r2 block's REFINED list; moved with the cure record |
| H01 | L8 header | round/section header | `## ROUND r1 DISPOSED (P6b, lane D-OP-r1, Opus 5.5, 2026-10-2` | MOVED | history Part 1 | ROUND r1 DISPOSED header line |
| H02 | L9 header | round/section header | `## ROUND r2 DISPOSED (P6b, lane D-OP-r2, Opus 5.5, 2026-10-2` | MOVED | history Part 1 | ROUND r2 DISPOSED header line |
| H03 | L10 header | round/section header | `## ROUND r3 DISPOSED (P6b, lane D-OP-r3, Opus 5.5, 2026-10-2` | MOVED | history Part 1 | ROUND r3 DISPOSED header line |
| H04 | L11 header | round/section header | `## ROUND r4 CONSOLIDATED (P6d, the residue lane D-FOUR-r4, O` | MOVED | history Part 1 | ROUND r4 CONSOLIDATED header line |
| H05 | L57 §0.2 | round/section header | `- THE CHAIR'S RULINGS FOR THIS ROUND ('briefs/RULINGS-P6.md'` | FOLDED | §0.2 | "THE CHAIR'S RULINGS FOR THIS ROUND" → "THE RULINGS OF RECORD"; the 14:11 CDT time dropped |
| H06 | L57 §0.2 | round/section header | `- THE CHAIR'S RULINGS FOR THIS ROUND ('briefs/RULINGS-P6.md'` | FOLDED | §0.2 | "ROUND 2 (RULINGS-P6 §D, 15:43 CDT)" lead-in dropped; §D.1–§D.3 quoted in sequence |
| H07 | L57 §0.2 | round/section header | `- THE CHAIR'S RULINGS FOR THIS ROUND ('briefs/RULINGS-P6.md'` | FOLDED | §0.2 | "ROUND 3 (RULINGS-P6 §E, 16:18 CDT)" lead-in dropped; §E.5–§E.7 quoted in sequence |
| H08 | L72 §0.4 | round/section header | `### 0.4 What the measurement changed (each bracketed where i` | FOLDED | §0.4 | heading retitled "What the measurement changed" ("(each bracketed where it sits)" dropped) |
| H09 | L80 §0.4 | round/section header | `8. ROUND r1 (P6b) re-measured six more walls and the volume ` | FOLDED | §0.4 | item 8's "ROUND r1 (P6b) re-measured" → "Six more walls, re-measured" |
| H10 | L81 §0.4 | round/section header | `9. ROUND r2 (P6b) re-measured four more walls: a home knows ` | FOLDED | §0.4 | item 9's "ROUND r2 (P6b) re-measured" → "Four more walls" |
| H11 | L82 §0.4 | round/section header | `10. ROUND r3 (P6b) re-read four more seams: a BOUND champion` | FOLDED | §0.4 | item 10's "ROUND r3 (P6b) re-read" → "Four more seams" |
| H12 | L673 §19 cure record | round/section header | `## §19 THE CURE RECORD` | MOVED | history Part 2 | §19 THE CURE RECORD heading; new §19 = THE REVIEW TRAIL |
| H13 | L675 §19 cure record | round/section header | `### Round r1 (P6b, 2026-10-20 15:03–15:3x CDT by 'date', lan` | MOVED | history Part 2 | Round r1 block |
| H14 | L718 §19 cure record | round/section header | `### Round r2 (P6b, 2026-10-20 15:44–15:5x CDT by 'date', lan` | MOVED | history Part 2 | Round r2 block |
| H15 | L741 §19 cure record | round/section header | `### Round r3 (P6b, 2026-10-20 16:19–16:3x CDT by 'date', lan` | MOVED | history Part 2 | Round r3 block |
| H16 | L766 §19 cure record | round/section header | `### Round r4 (P6d, 2026-10-20 16:49–17:0x CDT by 'date', the` | MOVED | history Part 2 | Round r4 block |
| S01 | L79 §0.4 | STOP mark | — | KEPT | §0.4 | ⛔ S-7 (item 7) — a design mark |
| S02 | L110 §1 | STOP mark | — | KEPT | §1 OP12 | ⛔ S-4 — a design mark |
| S03 | L200 §2.5 | STOP mark | — | KEPT | §2.5 | ⛔ S-8 — a design mark; "(widened)" dropped |
| S04 | L216 §3.3 | STOP mark | — | KEPT | §3.3 | PS §6.5's ⛔ build-time STOP (S-e) — THE PASSAGE's mark, cited |
| S05 | L262 §5.3 | STOP mark | — | KEPT | §5.3 | ⛔ build-time STOP S-9 — a design mark |
| S06 | L263 §5.3 | STOP mark | — | KEPT | §5.3 | ⛔ S-7 — a design mark |
| S07 | L267 §5.4 | STOP mark | — | KEPT | §5.4 | ⛔ build-time STOP S-2 — a design mark |
| S08 | L281 §6.1 | STOP mark | — | KEPT | §6.1 | ⛔ build-time STOP S-3 inside the [PLAUSIBLE; …] design bracket — kept verbatim |
| S09 | L285 §6.2 | STOP mark | — | KEPT | §6.2 | ⛔ build-time STOP S-8 — "(WIDENED in r2 to the carrier's mouthpiece" → "(it covers the carrier's mouthpiece too" |
| S10 | L308 §7.1 | STOP mark | — | KEPT | §7.1 | ⛔ S-8 — "widened" dropped |
| S11 | L308 §7.1 | STOP mark | — | KEPT | §7.1 | ⛔ build-time STOP S-4 — "(restated)" dropped |
| S12 | L389 §11 | STOP mark | — | KEPT | §11 | ⛔ S-4 (ii) — a design mark |
| S13 | L390 §11 | STOP mark | — | KEPT | §11 | ⛔ S-7 — a design mark |
| S14 | L400 §12 | STOP mark | — | KEPT | §12 OP-0 | ⛔ STOP on any drift — the car-0 census's stop |
| S15 | L412 §12 | STOP mark | — | KEPT | §12 OP-2 | ⛔ S-4 — a design mark |
| S16 | L417 §12 | STOP mark | — | KEPT | §12 OP-3 | ⛔ S-7 — a design mark |
| S17 | L418 §12 | STOP mark | — | KEPT | §12 OP-3 | ⛔ S-9 — a design mark |
| S18 | L423 §12 | STOP mark | — | KEPT | §12 OP-4 | ⛔ S-3 — a design mark |
| S19 | L428 §12 | STOP mark | — | KEPT | §12 OP-5 | ⛔ STOP S-2 — a design mark |
| S20 | L434 §12 | STOP mark | — | KEPT | §12 OP-7 | ⛔ STOP S-6 — a design mark |
| S21 | L556 §15 | STOP mark | — | FOLDED | §15 IN | "the r1 STOP on RULINGS-P6 §C's IN line is RULED (§D.3 …)" → "by RULINGS-P6 §D.3 (§C's IN line worded as this volume proposed) …" — the ruling stated as the design |
| S22 | L562 §15 | STOP mark | — | KEPT | §15 | ⛔ S-9 — a design mark |
| S23 | L635 §17 | STOP mark | — | FOLDED | §17 OD-OP-27 | "the r1 STOP on RULINGS-P6 §C's IN text RULED by §D.3" → "by RULINGS-P6 §D.3 …" — the ruling stated as the design |
| S24 | L637 §17 | STOP mark | — | KEPT | §17 OD-OP-29 | ⛔ S-9 — a design mark |
| S25 | L644 §17 | STOP mark | — | KEPT | §17 OD-OP-34 | ⛔ S-8 — ", widened" dropped |
| S26 | L675 §19 cure record | STOP mark | — | MOVED | history Part 2 | r1 block header's "⛔ STOP" tally |
| S27 | L682 §19 cure record | STOP mark | — | MOVED | history Part 2 | OP-r1-4 row's ⛔ S-9 |
| S28 | L703 §19 cure record | STOP mark | — | MOVED | history Part 2 | OP-r1-25 row's ⛔ S-8 |
| S29 | L712 §19 cure record | STOP mark | — | MOVED | history Part 2 | the r1 ⛔ STOP for the chair (ruled by RULINGS-P6 §D.3; OD-OP-27) |
| S30 | L718 §19 cure record | STOP mark | — | MOVED | history Part 2 | r2 block header's "its STOP" |
| S31 | L718 §19 cure record | STOP mark | — | MOVED | history Part 2 | r2 block header's "⛔ STOP" tally |
| S32 | L724 §19 cure record | STOP mark | — | MOVED | history Part 2 | OP-V1 row's ⛔ S-8 |
| S33 | L726 §19 cure record | STOP mark | — | MOVED | history Part 2 | STOP-C-IN row label |
| S34 | L726 §19 cure record | STOP mark | — | MOVED | history Part 2 | "(r1's STOP)" |
| S35 | L741 §19 cure record | STOP mark | — | MOVED | history Part 2 | r3 block header's "⛔ STOP" tally |
| S36 | L758 §19 cure record | STOP mark | — | MOVED | history Part 2 | STOP-C-IN (r2-verify) row |
| S37 | L766 §19 cure record | STOP mark | — | MOVED | history Part 2 | r4 block header's "⛔ STOP" tally |

## SEAMS CURES (2026-10-23, per SEAMS-P8, the chair's rulings)

- SEAMS-P8-1 · §3.1 (the stage's registration, quoting RN-S1) · the three-pass quotation "It runs, in order, RN's pass → CH's weekly pass → PT's engagement pass … CH and PT REGISTER their passes on a closed registration list, pinned" → RN's four-pass sentence "It runs, in order, RN's pass … → CH's weekly pass → OP's stage (below) → PT's engagement pass; RN OWNS the mount (RN-1's car-0 measures it once for all four), and CH, OP and PT REGISTER their passes on a closed registration list, pinned".
- SEAMS-P8-7 · §9 (a paragon is not on the errand spine) · "(CH-V1: "no errand row can name one" at master;" → "(CH §0's measured row: "NO persisted errand row can name a paragon" at master;" (the verifier id replaced by the design object it named; the quote now CH §0's own words).
- SEAMS-P8-14 · THE READER'S GUIDE item 3 · "… the catch law's rung and the traveller's own nature for the outcome." → "… the catch law's rung and the traveller's own nature for the outcome; TRUTH also of its own errand record, and of the courts' standing at the arrival tick (the tie table)." (§2.5's `missionSlack` and `rescueMotiveOf` reads).

## LENS → READINGS (2026-10-23, the chair's ruling on the fold §5 `lens` row)
The chair's ruling (2026-10-23, by delegation, vetoable; OD-FC-63, the latest ruling wins): on every DM surface a lens is a MAP LAYER, and THE RENOWN's two ways of judging a deed are "readings" in prose, never "lenses". The LENS SWEEP seat renamed every site where "lens"/"lenses" names RN's deed reading; backticked tokens, paths and every other sense are kept (listed below). No owner quotation was edited. Line numbers are the edited text's (the volume or the part; the edits add no lines).
**Renamed: 1 sites in 1 edits** (each edit an asserted single replacement, `scratchpad/lensweep/apply.py`; an edit naming two sites in one sentence is one line below).
- L270: "so RN's lens two reads the rescue" → "so RN's reading two reads the rescue"
**Kept (not RN's deed reading):**
- none — OP's one `lens` occurrence was RN's reading two (renamed)
**Ratchet** (`python3 KIT/tools/consolidate-ratchet.py KIT/history/OP-bracketed-1beabdc85.md DOCS/DESIGN_FP_ARCH_OP.md --allow-missing-file KIT/consolidate/OP-allow.txt`): before and after BYTE-IDENTICAL output (diffed) — `tokens: old 824 · new 791 · missing 0 · new-in-new 6`; last line unchanged, `RATCHET 1 DIFFERENCE CLASSES`. No token went missing (prose only).
DOCS/DESIGN_FP_ARCH_OP.md copied to KIT/consolidate/OP-new.md after the edits (`cmp` identical).
