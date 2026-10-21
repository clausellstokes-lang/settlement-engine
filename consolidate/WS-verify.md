# FV-WS — THE FIDELITY VERIFIER OVER THE CONSOLIDATED `docs/DESIGN_FP_ARCH_WS.md` (P8a; 2026-10-20)

**COUNTS: sampled 186 of 282 ledger rows · holds 186 · fails 0.** No STOP raised.

Inputs: old = `history/WS-bracketed-1beabdc85.md` (`git show 1beabdc85:docs/DESIGN_FP_ARCH_WS.md | cmp -` → identical); new = `docs/DESIGN_FP_ARCH_WS.md` (`cmp` with `consolidate/WS-new.md` → identical); ledger = `consolidate/WS-ledger.md`. Method: a balanced-bracket scan of the old text (257 brackets) → the old text with every bracket span removed → a word-level diff of that against the new text (95 hunks, every one read), so every non-bracket edit the lane made was seen. Then each sampled bracket's content was read against the new passage. A script also checked every backticked token, quote and number inside each bracket against the new text; 43 brackets had a missing item, and each of those 43 was read by hand. Scratch work is in the session scratchpad `fv-ws/` (`brackets.json`, `old-stripped.md`, `diff.txt`, `keycheck.txt`).

## 1. THE RATCHET (re-run, verbatim argument from ledger §5)
`python3 tools/consolidate-ratchet.py history/WS-bracketed-1beabdc85.md docs/DESIGN_FP_ARCH_WS.md --allow-missing "<ledger §5 list>"` → exit 1. Its output: tokens old 708 · new 653 · missing 1 · cites 68 → 69, missing 0 · laws 19 = 19 · OD 41 = 41 · ⭐ 20 → 27 · DRAFT 38 = 38 · UNMEASURED 16 = 16 · waves 1 = 1 · flags 23 = 23 · review markers 0. Last line:

**`RATCHET 1 DIFFERENCE CLASSES`**

The one difference is EXPLAINED, and I proved it. The missing "token" is `), so it neither pre-empts a situation nor leans a drive-reading host] | `. It is a regex artifact: §0.1's `atrocityBrakeFor({ … })` code span is longer than the ratchet's 80-character token cap. I re-ran a scratch copy of the ratchet with the cap at 200 (`fv-ws/ratchet-200.py`) and it printed `tokens: old 711 · new 656 · missing 0` → **`RATCHET CLEAN`**. Every short form in the allow-missing list still appears in the new text inside its full cite (checked one by one). Every superseded name in the list is struck by a later ruling. Every trail file name in the list lived only in old §17.

Two ⭐ marks sat inside old §17. They moved verbatim to `history/WS-cure-record.md`. All 18 ⭐ in the old body survive. The 9 added ⭐ go only on shapes that §15 already marks OWNER (OD-WS-1, OD-WS-3, OD-WS-23, OD-WS-40). `history/WS-cure-record.md` contains old lines 680–782 and 3–11 verbatim (checked by substring).

## 2. THE MARKER COUNT (mine)
- Brackets: `[CURED ` 217, `[REFINED ` 38, `[ADDED ` 1, `[STOP ` 1, for 257 by balanced scan. There are no `[CORRECTED|AMENDED|OPENED|RULED`.
- Round and section header lines: 14 (lines 8–11, 31, 93–95, 680, 682, 720, 740, 763, 778).
- Unbracketed `STOP WS-S` marks: 11 (lines 92, 107, 265, 302, 355, 442, 578, 579, 627, 628, 629).
- There are no `↳` rows. There is no `(fp-final rN)` outside a bracket. The 256 `(fp-final P6…)` stamps all sit inside brackets.

Total 282, which equals the ledger's 282 rows (folded 241 · dropped 8 · moved 21 · kept 12). The STOP marks moved as expected: old S1/S2/S3 = 5/3/4 at the same 12 sites, new = 6/4/5, which is those 12 sites plus THE OPEN STOPS line.

## 3. THE TABLE (row · verdict · receipt)

| rows | verdict | receipt |
|---|---|---|
| 41 BLOCKING id-only stamps (B015 B017 B018 B021 B029 B034 B050 B057 B060 B064 B068 B069 B083 B106 B126 B127 B131 B150 B154 B162 B163 B170 B171 B172 B178 B180 B185 B187 B189 B191 B194 B205 B213 B219 B220 B222 B223 B228 B229 B233 B242) | HOLD | Each one's whole text is `[CURED date (fp-final P6 rN) — <ids> (<tag>)]`, with no prose and nothing to carry. Removing it loses only provenance, which §15's "ruled" column now holds. |
| B009 B010 B011 (THE ANSWER) | HOLD | The new paragraph names the strengths alone, the character counted once, a tie said as a tie, the hand as a label, the character-borne turns only where no situation holds, and the deed "the host … thinned … most of the men Kell itself could spare". |
| B016 · B036 · B037 · B012 (§0.1/§0.3) | HOLD | The atrocity-brake quote is kept whole. "it" becomes "the plan", and its referent is unchanged. §0.3 says "which the way's fit never reads" and "a read-only label beside it, never an input". |
| B039 B040 B042 (WS2) | HOLD | WS2 carries the door `atrocityBrakeFor`, "0 of 50,544" and "9,540 · 6,226 · 11,232", the drive's inputs (`actorProfileOf`, `computeMalice`) and "no fifth term … dossier chip, the PDF, the alignment read". 296/972 and 25,140 moved to S17. The dropped rationale is superseded by D.5/E.1. |
| B044 B046 B067 (WS3/WS5/WS19) | HOLD | WS5 says "The temper's terms, WR-2's channels and the nerve never move a way". WS19 says "the label may flip with the war's scar and moves nothing (WS5)". |
| B075 (§2.2) | HOLD | THE DOORS AND THE LATCH says "P2 is ONE WEEK for EVERY court … the season's latch … is P4, a declared OWNER shape". |
| B077 B079 B080 B081 B082 (§2.3) | HOLD | The `unique`, `tiedWith`, `foeId`, `applied`, KEEP and "no `books`" rows are present, and the grip is in `wayStrengthsOf`. The ×1 rationale is kept. `methodBroke`, `wayPersonalityOf` and `temperSteps` are superseded names. |
| B084 B085 B086 (§2.4/2.5/§14) | HOLD | `purse_empty` and `shipped` became §2.5 homonym rows and §14 "NOT used" notes. "There is no seat, temper, channel, nerve or method cause" is present, and so is "read in this order; the last two character-borne". |
| B093 B095 B099 (§3.1/3.2) | HOLD | WHAT THE TEMPER IS BUILT FROM has the four terms, the "duplicated read waiting to drift" quote, `standing` as the lesson again, and `will` as neither a term nor a strength. "The grip is a capability, not a character" is present. |
| B102 B103 B105 (§3.3) | HOLD | The ratchet sentence and its default, 3213/6174 vs 0/6174, merchant 0/441 · military 441/441 · 231/441, and the LABEL column are all present. The WS-r1-9 harassment price is in the §3.3 row and in WS4. |
| B111 · B114 · B116 · B160 (DROPPED, BLOCKING) | HOLD | Each is superseded by a later ruling: B112 (§3.4, "a seat never moves a way"), B115 (§4.1 hostLean-r2), B117 (the pair "a copy of the court's character") and B161 (§7, "a seat moves no way at all"). |
| B113 B115 (§4.1) | HOLD | 11,232 and 6,226 of 50,544, 972/972, ×1.1200 and 0.94 · 1.06 · 1.00 · 0.94 · 0.94 are present. The "1 · 1 · 1 · 1 · 1" ×1 claim is superseded by transparency. |
| B119 (§4.2) | HOLD | NOTES ON THE TABLE carries: no C3, harassment's deploy/raid, the ST6 quote, the C12 slot, subversion's passivity struck "even when it lights", C5 on MG's 35 motive keys and `[0.25, 4]`, and C10's joint leaf. "C4 and C5" is corrected by B121 (SEAMS-P6-4/I.4: C4 alone). |
| B125 B134 B142 B145 (§5) | HOLD | The plan is ordered after the situations. The smallness-test refutation is present (200; 38 · 57 · 79; `SIEGE_MAX_AGE` 60). The 9,540 control and "transparent, never ×1" are present. |
| B156 B157 B158 (§6.1) | HOLD | "No believed TEMPER half", the hand as a label rather than a believed tie-break, and the PLAUSIBLE affected-only read "at WS-5" are present. |
| B166 B168 B169 B177 B190 B198 B199 B200 (§8–§12) | HOLD | `armies_meet` is STANDING-at-contact (S5). The deviation flag requires P4 (OD-WS-23). Pins (7b) and (12c) are present. WS-2 says "there is no C3". S17 is titled DIRECTION AND SIZE. §12 has 24 S rows and no blank line splits the table. |
| B206 B207 B208 B211 B212 (§13/§14) | HOLD | The couplings rows are in their final form (conscription cars, foe address, `treatyEnforcement.js :: treatyBlocksWar`). The census rows replace the per-round rows without losing a FREE token. |
| B221 B224 B239 B256 (§15/§16) | HOLD | OD-WS-25 adds "with no method tie-break", and OD-WS-35 is transparent. #9 is "true by construction", #14 is "only where no situation turned the war" and #15 is a tie said as a tie. |
| B052 · B110 · B144 · B238 (DROPPED, others) | HOLD | B052 and B144 are superseded by B145, and "the general enters once" survives as WS6 and §5.2's heading. B110 is superseded by B112. B238 is superseded by B237/B239 (OD-WS-35: "never ×1 … no KEEP"). |
| B097 + S01–S11 (every STOP) | HOLD | All 12 sites keep ⛔ STOP WS-S1/S2/S3. THE OPEN STOPS reads "none", with the three named as ruled slots (OD-WS-12/13/14). |
| H01–H04 · H09–H14 · B000–B008 · B053 · B149 (MOVED) | HOLD | Part 1 and Part 2 of the history file are byte-verbatim. B053 and B149 are editorial notes. |
| H05–H08 (§0 header; §0.4 ROUND lines) | HOLD | I mapped R1–R29 to the 18 new bullets: every un-superseded R survives (R3→R14, R4→R16, R7→R19, R12→R18, R22→R26, R23→R27, R25→R28), and none is added. |
| random non-BLOCKING 17 (B033 B038 B043 B049 B055 B063 B071 B098 B117 B124 B128 B183 B234 B237 B240 B252 B254) | HOLD | Each one's content is at its place. For example, WS3 has "no strategy input … frozen constants" and §2.1 has THE PARKED MEMBER verbatim. "Non-parked" became "candidate", which means the same thing. |
| 28 more read (B020 B023 B045 B047 B074 B092 B094 B108 B120–B123 B129 B130 B132 B133 B138 B141 B152 B153 B155 B164 B241 B243 B247 B248 B250 B255) | HOLD | B023's "once, at the host's march (P5)" is G.4, which is later and already in §5.1/§13. B094's "the fit" became "the temper", which is D.5 and declared in the ledger at §3.4. B247/B248 put the alternative carrier and the 28-of-30 edge in OD-WS-40. "Outside the declared edge of §12 S24" matches the probe (10 cases at 0, the edge case at 28). |

## 4. THE READER'S GUIDE AND THE RULINGS, read whole
- **The guide's claims hold against the old text.** Owner and writers: P4, P5 and P3 with their one writer each. Mounts: C1 `enumerateMoves` through WC's car, C2, C6, three byte-identical export cars, zero lines in the three hosts (WS13). Chain: C20 after WC's car, C4 and MG (§10 ORDER; RULINGS-P6 §C names "C20 after WC's chooser car and C4"). READ BY includes PL-4/WC-5 and ES as a slot (§13). DO NOT CONFUSE covers `temperamentPresets.js`. The guide is 8 lines. **Note (not a fail):** item 1 says only that "a situation" may turn a war. The character-borne turns and the DM's pin are stated in THE ANSWER and in §5.1.
- **The rulings carry every old row's text.** There are 40 = 40 rows. The only text changes are tags removed and five folded brackets (B221, B234, B237, B241/B243, B247/B248), plus one declared reading. That reading is in OD-WS-26 and in §0.1's W-DOCTRINE-1 row: the dossier carries the hand "only as the deeds its own receipts recorded". It is not new: WS19, S23 and §2.3 already said it in the old text (WS-Vm3, the latest cure). The "ruled" column's RULINGS-P6 citations are inferred from the removed tags, and I checked them against `briefs/RULINGS-P6.md` (A.1/A.2/A.7/A.8, B.2's "WS-S2's proxy stands meanwhile", B.3, §C's C20, G.3 = WS-V7, G.4, I.4). No ruling is superseded within WS, and THE OPEN STOPS is none.
- **The voice law holds.** The only "the chair" left is inside THE OWNER'S WORDS, which is unchanged. Dates appear only in the header, §0.2's law identifiers and §15. "round", "rN", "skeptic" and "verifier" appear only in receipt paths and §17. Every own "§x" resolves. Every foreign section exists (FS §7.5, MG §5.1–5.3, PS §5.2/§5.6, CH §4.8/§7/§16b, WC §1.10, fold §3.1.23/§3.1.24/§3.4/§5/§6).
- **Cosmetic issues only.** The ledger's row H14 says "§11 P6" where the header is §17's P6c block; its disposition is right. §17 THE REVIEW TRAIL is a long line rather than the template's one line.

**CONFIRMED vs PLAUSIBLE:** The ratchet line, the marker count, the cmp/verbatim checks, the 200-cap re-run and the per-bracket key scan are CONFIRMED, because I executed them. The 186 HOLD verdicts are my reading of old against new; each has the receipt above, and none is upgraded past what was read.
