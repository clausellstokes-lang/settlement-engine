# FV-MG — THE FIDELITY VERIFIER OVER THE CONSOLIDATED `docs/DESIGN_FP_ARCH_MG.md` (P8b; 2026-10-20)

**COUNTS: sampled 284 of 284 ledger rows (102 read by hand, old and new side by side; the other 182 checked by script) · holds 284 · fails 0.** No STOP was raised and none is owed.

Inputs: old = `history/MG-bracketed-1beabdc85.md` (601 lines). New = `docs/DESIGN_FP_ARCH_MG.md` (553 lines; `cmp` with `consolidate/MG-new.md` → IDENTICAL). Ledger = `consolidate/MG-ledger.md`. Allow file = `consolidate/MG-allow.txt`. Fold of record for the cross-volume rulings = `history/COHERENCE_FOLD-bracketed-1beabdc85.md` §7. My scripts are in the session scratchpad `…/scratchpad/fvmg/` (`strip.py`, `novel.py`, the context check).

Method:
- I stripped every bracket from the old text by balanced scan.
- I word-diffed the stripped old text against the new volume (`git diff --no-index --word-diff`). That isolates every change that is more than removing a bracket. There were 52 hunks, and I read each one against the bracket it came from.
- I ran a 4-gram novelty scan over every inserted span. It flagged 99 spans with no source in the old text. All of them fall in four places: the new header, THE READER'S GUIDE, the §17 Class/Ruled columns, and the §19 trail line. The exceptions are folded bracket text reworded into the design's own voice, and the fold-ruling statements T-74..76.
- For every body bracket, I checked that the 50 characters on each side survive verbatim in the new text. 183 of 219 pass. The other 36 are exactly the hunks I read by hand.

## 1. THE RATCHET (re-run, the brief's exact command)
`python3 tools/consolidate-ratchet.py history/MG-bracketed-1beabdc85.md docs/DESIGN_FP_ARCH_MG.md --allow-missing-file consolidate/MG-allow.txt` → exit 1. Output: tokens old 712 · new 679 · missing 0 · new-in-new 6 (`1beabdc85`, `cure/`, `skeptic/`, three `history/` paths — trail and header only) · cites 30 = 30, missing 0 · laws 15 = 15 · OD 29 → 40 · ⭐ 18 → 17 FEWER · DRAFT 17 → 16 FEWER · UNMEASURED 4 = 4 · waves 4 = 4 · flags 12 = 12 · review markers left 0.

**Last line: `RATCHET 2 DIFFERENCE CLASSES`.** Both are EXPLAINED, and I proved each one:
- **⭐ 18 → 17.** All 15 ⭐ in the old body survive at the same sites (old L123·285·295·301·348·380·459·462·467·468·469·476·487·488×2 → new L130·311·321·331·384·417·496·499·504·505·506·513·524·525×2). The other 3 old ⭐ sat in §19 (L589·593·599), which moved verbatim. The 2 added ⭐ are in the header and in guide item 4.
- **DRAFT 17 → 16.** 14 of the 15 DRAFT marks in the old body survive at their constants. The one that does not is old L336, inside bracket B172 ("given its DRAFT values"); the constant `RIDING_MISSIONS` (DRAFT) stands. The other 2 old marks sat in §19 and moved. The 2 added marks are in the Class column of OD-MG-12 and OD-MG-17.
- **OD 29 → 40.** All 29 old ids survive. The 11 added ids are all fold rows (OD-FC-95..104, 116). No OD-MG id was minted.

**Allow file vs the ledger's §4.** I checked all 33 lines against the reasons in ledger §4:
- (a) Ten review-marker templates.
- (b) Nineteen trail paths or probe names, including `settlementStrategy.js :: beliefAwareBesieged`. Its §19 short form is gone, but the full cite survives at new L275.
- (c) Nine superseded names. Each one appears only in a provenance bracket that names its replacement.

Every line is explained. Two further checks:
- **Moved text.** The old header (lines 1–11) and old §19 (lines 509–599) are contained VERBATIM in `history/MG-cure-record.md`, by a substring test.
- **Flag counts.** The flag-mention drops (believedDoctrine 4→3, habitAnticipation 7→5, wings 13→11) are all §19 text or bracket rationale. All 12 distinct flags survive.

## 2. THE MARKER COUNT (mine)
| Marker | Count |
|---|---|
| Brackets (balanced scan): CURED 190 · REFINED 33 · ADDED 4 · WITHDRAWN 1 · NOTED 1 | 229 |
| Round/section headers (H01–H14) | 14 |
| `↳` | 1 |
| Unbracketed S-MG marks (42 in total, minus 2 inside brackets) | 40 |
| **Total** | **284** |

No `(fp-final …)` stamp sits outside a bracket, and there is no ROUTED-UNAPPLIED. The total equals the ledger's 284 rows: B 229 · H 14 · A 1 · S 40. The disposition sums also match: folded 216 · dropped 5 · moved 27 · kept 36.

STOP marks, old body → new body, per id:
- S-MG-1: 11 → 12, the +1 being THE OPEN STOPS line.
- S-MG-2 and S-MG-3: equal.
- S-MG-a: 3 → 4, also THE OPEN STOPS line.
- S-MG-b: 15 → 14. That is 13 in the body (12 unbracketed + 1 in B095) + 2 in §19, which moved, against 13 + 1 OPEN STOPS line.

## 3. THE TABLE (row · verdict · receipt)
| rows | verdict | receipt |
|---|---|---|
| 5 DROPPED: B030 · B091 · B134 · B192 · B219 | HOLD | Each one is a bare stamp, and its successor's text stands. New L72 reads `foeId`, with no `warId`/`warKey`. §5.2 cites `WAY_DEVIATION_CAUSES` by symbol and quotes no members. §3.2 keeps the "§6.3" pointer of B091. The §11 `wingsEnabled` row and the §16 `stranger_land` row read "ON THE DEGRADED ARM ONLY", which is the r4/G.2 text. |
| 39 BLOCKING-sourced (MG-r1-1..8): B013 B015 B016 B018 B022 B023 B034 B035 B037 B039 B041 B045 B047 B049 B052 B057 B066 B069 B070 B071 B072 B074 B085 B089 B102 B113 B114 B116 B123 B130 B141 B143 B161 B163 B167 B175 B179 B189 B228 | HOLD | 34 pass the context check: only the bracket is gone, and both contexts survive verbatim (script). For the ones that carried a rationale (B037 · B049 · B057 · B113 · B130 · B175), I confirmed by grep that the substance is in the text. B039, B041, B161, B167 and B228 were read by hand. For the rows with content, the content survives in the new text: B045 → MG1 "no `FORCED_RIDING`, `FORCED_FATIGUE`, `FORCED_WEAR`, `FORCED_SAIL_RISK` or `AMBUSH_LEAN`"; B049 → "MG reads NO rung word and bars NO way" ×2; B057 → "DERIVED each tick … never stored here"; B089 → condition (c) plus "(OD-MG-18, vetoable)"; B113 → "its learning has no writer"; B161 → "the readiness ceiling read as a speed (`armyMarchWeeks(w, 1)` …)"; B167 → "MG keeps no `FORCED_SAIL_RISK`"; B179 → "no `FORCED_RIDING` and no winter-rest rule"; B228 → the 12 §18 deeds, unchanged. B039/B041 differ only by the (l) move. |
| 40 STOP rows S01–S40 | HOLD | The 36 KEPT marks survive per id at their sites (counts above). The 4 MOVED marks are verbatim in the cure record. THE OPEN STOPS line matches the old §17 S-rows. |
| 14 H rows + A01 | HOLD | H01–H04 and H06–H14 are verbatim in the cure record. H05: only the review clause is gone from the §0.5 heading. A01 → "fold §3.3.16, its P4 (8) row". |
| B095 (ADDED, the wing's passage and bank) | HOLD | Restated word for word, except that "The chair ruled … over PS's 16:5x §2.1 bracket … PS marks that clause SUPERSEDED" becomes "This is the ruled reading (RULINGS-P6 D.4 · E.4 · G.2 …); it supersedes PS's earlier §2.1 statement … and PS §2.1 and WC Arc A's read carry the same words." The ruling is unchanged and the date and seat are removed. |
| B076–B084 (§3.2 order and holds) | HOLD | The IMPOSED-outranks-CHOSEN sentence survives. B081 → "PS is the only writer of its ledger, so … WAITS there — its parent's answer, not its own (OD-MG-26, vetoable)". B084's alternative → "(OD-MG-25, vetoable)". In the old §17, OD-MG-25 and OD-MG-26 name exactly these REFINED items. The probe arms are renamed by what they run ("a wing stepped without step (0) (b)"). That is consistent with B083 ("r2's step (0) only stepped the wings"). |
| B058 · B060 · B062 · B067 · B099 · B100 · B142 · B144 · B152 · B178 · B180 · B181 · B182 · B197 | HOLD | Each bracket's content is folded into its sentence nearly verbatim. Examples: new L155 holds the `advance`/`rejoin`/`forced_sail` reasons; L311 "Arrival is seen only by a producer"; L321 "no tag event is minted"; L331 "(the split banks as a re-plan does — PLAUSIBLE until MG-2's pin; … ⭐ OD-MG-1; vetoable)"; L417 LIGHTING IS A DECLARED SHIFT. |
| B105 (row 2 receipt) | HOLD | The executed probe lines are kept verbatim. One of them contains "r2's flag-level reading" inside the quoted probe output; ledger item 78 declares it. This is quoted evidence, not running text. |
| B134/B136 (§5.2) | HOLD | "STRUCK — two bundles, two bounds and two desperation laws" → "MG keeps no bundle of its own … no `[0.25, 4]` … no second desperation law …: there is one bundle, one bound and one desperation law, WS's." The law is the same, stated as the design. |
| B166 · ledger T-74 (§7.2, §15, OD-MG-21) | HOLD | Old: "a SLOT for the chair … until it is ruled and built". New: "the owner's class, held CLOSED FOR NOW at the fold (OD-FC-102)". This is the fold's own text at `1beabdc85`: "CLOSED FOR NOW, by delegation (vetoable): … a widening of a landed program, the OWNER's class, never MG's". It is the latest ruling, not a new one. |
| ledger T-75 (§15 PS, OD-FC-103) | HOLD | Old: "whether a COMMANDER'S chosen FREEZE … spends Bound 2 … PS's and the chair's to rule". New: "does NOT spend … the fold rules (OD-FC-103, vetoable) that Bound 2 prices only the IMPOSED holds (border · fort · screen · contact)". The fold at `1beabdc85` says "NO — PS9's Bound 2 does NOT count a CHOSEN freeze … only the IMPOSED holds (border · fort · screen · contact)". |
| ledger T-76 (§15 PS, OD-MG-18, OD-FC-104) | HOLD | New: "the refusals bind MG's and the leg-at-a-time movers' re-plans, never PS's own step-6 reroute". The fold says "the helper's three refusals bind MG's and the leg-at-a-time movers' re-plans only". |
| T-7 (§0.5 (l) last sentence) | HOLD | "Only PS banks them, and only on its land march row" → "Only PS's arithmetic banks them — on its land march row for an army, and on MG's own wing row for a wing (§6.3) — and nothing banks a fleet's (§7.2)." This is the r4/G.2 text of §6.3 and OD-MG-24 (B151, B095) together with §7.2. It is the latest ruling, and nothing is decided anew. |
| §17 (OD-MG-1..27, S-MG-1/2/3/a) | HOLD | All 32 rows are present, and every ⭐ is present. Each Class tag matches its fold row: OD-FC-95/96/97/98/99/100/101/116 are "⭐ THE OWNER'S — declared by delegation for his confirmation at its unit (VISIBLE; re-confirmed in chat at the unit; vetoable)". OD-MG-4, 10, 11 and 17 restate "withdrawn" as the design, and OD-MG-17 names `RIDING_LAPSE` as BD's, as fold OD-FC-97 does. |
| THE READER'S GUIDE (8 items) | HOLD | Every claim resolves in the body: the leaf files (L12 ↔ L423); the rolled classes `army · wing · fleet · air_fleet` (§2.1, §2.3); MG11's zero lines and `navalKernel.js` one call (L113); C19 and the first felt chain MG-0 → MG-1 → MG-4, which match fold §6 C19 word for word; and the homonyms, which match §16's `hold`, `rejoin` and `mounted` rows. |
| Cross-references | HOLD | Every "§x" in the new text resolves to a heading (my scan found 0 unresolved). Four external references (§746.2, BD §9.1, BD §9.7, fold §3.3.14) pre-exist verbatim in the old text. §13's "(§2.2)" → "(§5.4)" points to the section that states "no world-wide feint ring". |

**Observations (not fails):**
- In §17 the Ruled column of S-MG-1/S-MG-3 reads "by delegation". Their Class column says "OWNER row, VISIBLE". The ruled item is B.2's darkening; the owner row is the capability. That reading is coherent, but the chair may prefer the ⭐-row wording.
- `L-BD 11i (v)` ×4 and `L-CH-PD` ×3 are brief citations that pre-exist in the old running text. The lane did not introduce them, and the ratchet does not count them as markers.
- The ledger's §6 SEEN items (the fold OD-FC-99 "`rejoin`" homonym, and the fold §5 copies of "WITHDRAWN (r1)") belong to the fold lane. They are correctly not edited here.

**CONFIRMED vs PLAUSIBLE:** Everything above is CONFIRMED by executed comparison:
- the ratchet re-run;
- my own balanced marker count;
- the word diff and the 4-gram novelty scan;
- the 50-character context check on every body bracket;
- substring tests of the moved text against the cure record;
- quotes from the fold's §7 rows at `1beabdc85`.

One verdict is a judgment of meaning: that "a weekly restart without the three conditions" fairly names "the compile's weekly restart" in the §3.2 probe sentence. That one is PLAUSIBLE.
