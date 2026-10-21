# FV-OP — THE FIDELITY VERIFIER OVER THE CONSOLIDATED `docs/DESIGN_FP_ARCH_OP.md` (P8b; 2026-10-20)

**COUNTS: sampled 156 of 417 ledger rows · holds 156 · fails 0.** No STOP raised. Two observations are listed below. Neither is a fidelity fail.

Inputs: old = `history/OP-bracketed-1beabdc85.md` (778 lines). New = `docs/DESIGN_FP_ARCH_OP.md` (681 lines; `cmp` with `consolidate/OP-new.md` → SAME). Ledger = `consolidate/OP-ledger.md`. Method (scripts in the session scratchpad `fvop/`, none of them run inside the kit):
- A balanced-bracket scan of the old text.
- The old text with every bracket span removed, aligned line by line against the new text with difflib (535 old lines are byte-equal to a new line once their brackets are removed).
- A word-level diff of every non-equal body line (§0–§18) and of every OD row.
- An anchor test on each bracket: are the 50 characters on either side of it present verbatim in the new text? 288 of 346 pass. All 58 misses sit on lines whose word diffs I read.
- A context test on every DRAFT, ⛔, ⭐ and ROUTE mark.
- A verbatim-substring check of the cure record.

## 1. THE RATCHET (re-run with the lane's allow file)
`python3 tools/consolidate-ratchet.py history/OP-bracketed-1beabdc85.md docs/DESIGN_FP_ARCH_OP.md --allow-missing-file consolidate/OP-allow.txt` → exit 1. The figures: tokens old 824 · new 791 · missing 0 · new-in-new 6; cites 75 → 76, missing 0; laws 19 = 19; OD 39 = 39; ⭐ 16 → 20; **DRAFT 33 → 32**; UNMEASURED 16 = 16; waves 9 = 9; flags 18 = 18; review markers 0. Last line:

**`RATCHET 1 DIFFERENCE CLASSES`**

The difference is EXPLAINED, and I proved the explanation:
- **DRAFT.** The old body holds 32 DRAFT marks: 31 in running text plus 1 inside B150. The 33rd is in the cure record (old L750) and moved verbatim to history. The new text holds 32. Every running-text DRAFT keeps its 35 characters of context verbatim. The one exception is OD-OP-12, where only the new "Ruled" column changed the context.
- **⭐ 16 → 20.** All 15 body ⭐ survive at their sites. The 5 added ⭐ are the header line and four in the READER'S GUIDE (OD-OP-2, OD-OP-3, OD-OP-24, OD-OP-25), and each of those is already ⭐ in §17. The cure record's ⭐ (L693) moved.
- **The six new tokens** are header and trail paths, plus a short spelling of the landed cite `opportunity/opportunityStage.js :: advanceOpportunities` (old L209, L405). None is a mint.
- **The allow file.** I checked every line against the ledger's §4 reasons:
  - `rescue · false_word · debt` was renamed by §I.4.
  - `0 when cost > slack` is superseded. It lived only in B107, and OD-OP-12 now carries `1/(1 + lateWeeks)`.
  - `EQUALS` lived only in B092.
  - The rest are template brackets, `cure/…` and `skeptic/…` paths, and cure-record short forms. I confirmed each one moved, or survives inside its full cite.

## 2. THE MARKER COUNT (mine)
- Brackets: `[CURED` 279 · `[REFINED` 45 (36 dated plus 9 bare `[REFINED]` in the rulings table and cure record) · `[ADDED` 22, for **346** in total.
- `↳` outside brackets: **18**, on lines 150, 165, 310, 366, 376, 378, 391 ×2, 464 ×2, 559, 565, 575 ×2, 594, 641, 643 and 739.
- Round and section headers: **16**.
- STOP marks: **37**. The ledger's S01–S37 each map to a line I checked.
- Total: **417**, which equals the ledger's 417 rows (346 B + 18 A + 16 H + 37 S).

## 3. THE TABLE (row · verdict · receipt)

| rows | verdict | receipt |
|---|---|---|
| 43 BLOCKING id-only stamps: B010 B012 B013 B017 B029 B030 B031 B037 B050 B078 B079 B083 B089 B095 B097 B102 B153 B154 B191 B192 B200 B201 B216 B228 B229 B238 B244 B253 B254 B260 B261 B263 B289 B290 B294 B303 B305 B312 B313 B314 B322 B338 B339 (OP-r1-1 · OP-r1-2) | HOLD | Each one's whole text is `[CURED date — OP-r1-n …]`, with no prose. The cured sentence it stamped is byte-equal in the new text (anchor test). B030/B031/B200/B201/B253/B254/B314/B322 sit on edited lines, and their word diffs show only round lead-ins and "RULED"/"P5"/"r1 STOP" wording removed. |
| B009 (THE ANSWER; OP-r1-1/-2/-3/-10) | HOLD | The new ANSWER is byte-equal to the old one. It says the traveller "sees what is there in front of it, beside what its court knew when it set out", and that an envoy turns aside "only when its errand was sent with time to spare". The reader's guide item 3 states presence plus what the traveller carried. |
| B034 B038 (OP3; OP-r1-1) | HOLD | OP3 lists only lawful roads. §0.4 item 9 reads "a home knows its man is held only by a record that ARRIVED". The guide reads "Never `envoy_held` evidence, wizardNews or the court's live belief." |
| B040 B076 B107 B092 (OP6 / §2.5 / §4.2 / §3.3; OP-r1-2) | HOLD | OP6 now reads "THE MISSION'S CLOCK IS NEVER MOVED". New L202 is "`expectedReturnTick − last outbound arrival` is the return journey's length, never slack" (B076's measurement, stated). The `0 when cost > slack` formula is superseded (OD-OP-12). §3.3 states the guard as "must EQUAL". |
| B055 B101 (DROPPED) | HOLD | Both record the withdrawal of L-MG item 11 (b)'s rung split under A.6. The new text has 0 hits for "rung split" or "item 11". Both "rider's gain … WY's to rule once" sentences survive (OP19 and §3.3). |
| B139 (DROPPED) | HOLD | B140 (D.2) supersedes it. New §6.3 reads "`breakout_exposed` on the JAILER (`jailerOf` … the OCCUPIER in an occupied town)", so the grievance lands on the jailer. |
| B035 B043 B056 B098 B111 B137 B138 B143 B169 (REFINED content) | HOLD | Each one's content sits in the sentence it amended, as checked in the word diff:<br>• B035: OP3 "as `map_way`'s trails are (§2.5) — a ransom begun after the traveller left is not its knowledge".<br>• B043: OP8 "Every form the owner names already has a carrier".<br>• B056: §2.1 "a ring (the pulse history, 80) cannot carry a cap".<br>• B098: §3.3 the CONFIRMED `namedPersonLegTicks` line.<br>• B111: §4.3 "A friend's cells are asked …".<br>• B137 and B138: §6.2 "ONE key space" and "WILLED lean".<br>• B143: §6.3 "never an omniscient accusation".<br>• B169: §9 THE ACT "a failed attempt without capture". |
| B145 B150 B166 B167 (measurement and ruling brackets) | HOLD | B145 opens §7.1 verbatim, minus "the round measured that". B150 is §7.1 ONE DEED PER ACT, with `kind01` 0.25 · `law01` 0.3 · `force01` 0.5 "DRAFT, shameful". B166 (F.4): the owner's 12:44 word is quoted byte-for-byte in THE OWNER'S WORD, the §9 quote now reads "a GOOD god's", and "merciful" survives only as "no recorded axis is 'merciful'". B167 is §9 THE ERRAND'S CLASS: `covert`, "NO `order` class", and "STANDS, DARK". |
| B096 B171 B174 B146 B122 B131 B133 B110 B112 B140 B170 B187 B219 B033 B108 B135 B292 | HOLD | These are change notes. The latest text stands at each site. Of the routes and restatements:<br>• B096's MG route is carried by §15's MG row.<br>• B108's S-1 RESOLVED is restated in §12 THE BUILD-TIME STOPS.<br>• B135's renames are applied at §6.1.<br>• B292's "measured: §1.3" is now in OD-OP-1. |
| A01–A18 (↳) | HOLD | A01/A15: the `rescue_debt` table row, the rename sentence and §16's `rowKind` (OD-OP-1 ⭐ kept). A02: CHAOTIC and 1.010 in §7.1. A04 and B183: §10.1's climax and verdict cells match the old ↳ cells word for word. A07/A09/A11–A13/A16/A17: folded into their parents. A18: moved. |
| H01–H16 | HOLD | H05–H11 now carry no round lead-ins and no times. The rest moved. Old lines 3–11 and 673–778 appear verbatim in `history/OP-cure-record.md`, checked by substring. |
| S01–S37 | HOLD | Every body ⛔ appears in the new text with its context. The only edits are the "(widened)"/"(restated)" wording that ledger §3 item 6 names. S21/S23 now state D.3 as the design. §12 THE BUILD-TIME STOPS matches r4's final state (S-1 and S-5 resolved; S-2…S-9 stand). |
| THE READER'S GUIDE · §17 | HOLD | Guide items 1–8 each trace to the old text: C18 (fold L1143/1163), OD-OP-17's stage order, OP15's hosts, and §2.4/§16's homonyms. In §17, 37 = 37 OD ids. Every row's word diff is either the new Ruled column or the trail and wording edits in ledger §3. OD-OP-23 is re-ordered. ⭐ and VISIBLE are intact. |

## 4. OBSERVATIONS (not fails; for the chair)
1. §5.5 CLOCK still says "the freed's road home", while §18 item 1 says "the freed resumes his own journey" (B133's cure). The phrase is unchanged from `1beabdc85`, so this is not a consolidation change. It is a coherence residue that may want one word.
2. Guide item 1 says "at most once in a mission" without DRAFT. It mirrors THE ANSWER, which is unchanged. OP4 and OD-OP-5 keep the DRAFT mark.

## 5. CONFIRMED vs PLAUSIBLE
CONFIRMED (executed): the ratchet line, the marker count, the byte-equality and anchor tests, the mark contexts and the cure-record substring check. The judgements that each change note carried no design content are read-based and PLAUSIBLE.
