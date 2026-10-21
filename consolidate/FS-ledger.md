# FS — THE FIDELITY LEDGER of the consolidation (P8, lane C-FS, 2026-10-20 ~22:xx CDT; Opus 5.5)

**Old text:** `history/FS-bracketed-1beabdc85.md` (byte-identical to `docs/DESIGN_FP_ARCH_FS.md` at the start — `cmp` IDENTICAL). **New text:** `consolidate/FS-new.md` → copied over `docs/DESIGN_FP_ARCH_FS.md`. **Cure record:** `history/FS-cure-record.md` (old lines 677–771 verbatim under a two-line provenance header; `tail -n +3 | cmp` VERBATIM-OK).

## COUNTS
Old markers (counted by script `inv.py` — the lane's scripts `inv.py`, `apply.py`, `sec0.py` … `sec17.py`, the dispositions store `disp.tsv` and the ratchet runs are in `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6eb7b5b6-80cf-4cc0-a114-2e95f5dbc3d3/scratchpad/cfs/` — every `[CURED …]`, `[REFINED …]`, `[NOTED …]` and bare `[FS-…]` bracket, nesting-aware; every header review line 3–11; every round header incl. §19's heading; every `STOP-FS-n` / `⛔ STOP` mention; `↳` rows: 0): **361** = 332 brackets (328 in the body, 4 in the cure record) · 9 header lines · 5 round headers · 15 STOP mentions. Ledger rows: **361** (reconciled by script: missing 0 · extra 0).
Dispositions: **old markers 361 · folded 284 · dropped 14 · moved 51 · kept 12** (FOLDED = the bracket's content now stated in the new section named; DROPPED = superseded by the later marker or ruling named; MOVED = pure trail — its text is in git `1beabdc85` and, for the cure record, verbatim in `history/FS-cure-record.md`; KEPT = a design mark the volume still carries).

## THE OLD → NEW SECTION MAP
The identity for every section §0–§18 and every subsection (§0.1 … §16), so the ~50 citations of FS sections in other volumes (`FS §7.2`, `FS §16`, `FS §18`, …) and of `STOP-FS-n` (POP, the fold) resolve unchanged. Old §19 THE CURE RECORD → MOVED to `history/FS-cure-record.md`; new §19 = THE REVIEW TRAIL (one line). New before §0: THE READER'S GUIDE. §7.2's title changed from "STRUCK in round r1" to "— none" (its content is the final design: no neighbour read). Every own-section cross-reference in the new text resolves to a heading (script check: 0 unresolved; the two non-FS hits are BD §9.10 and the §92.2 certification law).

## STOPS (⛔) — NONE
No passage holds two brackets left open in conflict. Two readings are logged below as OBSERVATIONS for the chair (O-1, O-2); each is single-voiced in the old text and kept as written.

## JUDGMENT CALLS (vetoable — say "veto" to flip)
- **J1** — chose to keep the section numbering identical (and §7.2 as a section) over renumbering, because other volumes cite FS by section and STOP id; the map above is the identity.
- **J2** — chose to move every `RULINGS-P6 x.n` citation out of the running text into §17's new **Ruled** column (date + provenance) over leaving them inline, because the voice law wants the design in its own voice and the rulings table is the shape's home for provenance; `RULINGS-P5 A.2` is kept inline (O-4).
- **J3** — chose to DROP superseded names (ALLOW-MISSING below) over keeping them as "withdrawn" notes, except where a live rule names them: `setBy` (the import rule), and the "never" guards `coffersRead(...).score01`, `temperament`, `legitimacyFragility01`, `advanceEpochLedger` (folded from their brackets as prohibitions).
- **J4** — chose to restate the negative controls measured against superseded texts (249,161 of 847,836; 1,320 · 1,386 · 924; 66 · 66 · 0) as the reds of mutants (l) and (l2) in §11 over dropping them, because each is exactly that mutant's measurement; 61,578 (row 31 (b) under round 2) MOVED to history.
- **J5** — chose to mark all seven owner rows ⭐ in §17 (OD-FS-2 · 6 · 9 · 11 · 13 · 14 · 24) per the output shape (only OD-FS-9 carried ⭐ before); nothing about the rows' substance changed.
- **J6** — chose to keep `STOP-FS-1/2/3` as design marks (headings of §5.4/§5.5, FS3, FS18, OD-FS-3/10/11, §15) because POP and the fold cite them.
- **J7** — chose to rewrite FS6, FS7, §2.1's note block, §3.4's completion bullet, §6.1–§6.3's heads, §7.2, §14 row 31, §15's W-COIN/POP/EDITOR/WS/SP-9 rows and §17 whole (their brackets carried most of the latest rulings), and every other passage by exact single-occurrence substitution against the old lines (scripts `sec*.py`, each substitution asserted to occur once), so unchanged text is byte-faithful.

## COHERENCE REPAIRS (non-bracket sentences the latest ruling had already overtaken; each the latest text winning, nothing decided anew)
- **C-1** FS1 "A court's fiscal stance" → "fiscal decision" — §2.4's register ("prose never says 'fiscal stance'", the REFINED rename of "EXTRACTION STANCE").
- **C-2** §3.4 Tier "The neighbour's read (§7.2) is belief-infoMode." → "There is no neighbour's read (§7.2)." — stale after the r1 strike (FS-r1-12; OD-FS-16 withdrawn).
- **C-3** §3.5 "— the coverage-shortfall trigger is struck, FS-r1-1" removed — a finding id in the running text; the trigger list (§3.4) has no such trigger.
- **C-4** §12 FS-1 "the SYSTEM-LEVEL ANTI-LOOP pin (§14 row 17 …)" and §15's W-COIN row "the system-level anti-loop pin rides FS-1 … W-COIN's car-0 confirms the system pin" → the input-level pin §14 row 17 (a) rides FS-1; the war-layer soak row 17 (b) is W-COIN's car-0's — the r2 retitle of row 17 (FS-V1: "re-titled from 'system level' — it holds the war fixed") and OD-FS-23 are the latest.
- **C-5** §8 "composed into the catalogue 'at the unfreeze' (the chair's)" → "(the owner's act, OD-FS-24)" — D.11 Q2 made the lighting the owner's; §0.1's verbatim code quote of `directions.js` ("… is the chair's, at the unfreeze") stays verbatim (it is master's comment).
- **C-6** §7.2 retitled (above); §13.1 veil "(§7.2 struck)" → "(§7.2)".
- **C-7** §13.1 import "a legacy `setBy` key or a stored `wonted` from a compile-era draft is malformed" → "a `setBy` key or a stored `wonted` is malformed" (the rule unchanged).
- **C-8** every "ROUTE X" / "routed" in the running text → "X's side, §15" (the couplings table carries each seam); "the fold lane" → "the fold".
- **C-9** bare ruling ids (D.8 · D.9 · D.10 · E.8 · E.9 · G.5 · A.1 · A.7 · A.8 · B.4 · D.11 Q2) removed from the running text and from §14's row titles; provenance in §17's Ruled column (J2).
- **C-10** the owner-words section's annotations: "the chair scheduled" → passive; the panel's "finding" → "observation"; "as P6a's fourth compile" dropped (the voice law; the owner's words themselves untouched).
- **C-11** FS9's folded reason moved into its own sentence (readability); the dates "2026-10-18"/"2026-10-19" in running text (§10.2, §2.2) dropped ("the owner's word …"), per the no-dates-in-running-text rule.
- **C-12** §16's reads row note "`setFiscalHand` · `believedHandOf` · `fiscalStrainOf` WITHDRAWN …; `shortfallHandOf` WITHDRAWN" → "the leaves under `src/domain/fiscal/`" (J3).

## OBSERVATIONS (for the chair; not STOPs)
- **O-1** RULINGS-P6 A.8 words the need as "the BELIEVED DEMAND (the war chest, dues due, readiness, a ransom, a coalition's purse), never the stock". The volume, from its r1 cure on (HOLD at the r1 and r2 verifiers), reads the demand as the court's TRUTH of what it is ASKED TO PAY, struck the coalition purse (WSV-N-FS-2, r2: WS hires nothing) and holds the dues and the keep as slots. The old text is single-voiced on this, so the consolidation keeps it (FS2, §3.2) and drops A.8's quote from the running text; the chair may wish to align A.8's wording in the rulings file.
- **O-2** FS-r3v-n1 (cure record r4): "the chair's confirmation is needed only for that reading of 'de-escalates'" — the stamp clears the tick the ladder stands below `refusal` (or at a refusal of another act). RULINGS-P6 I.4 confirms "The FS carrier reading (G.5 as the residue lane read it)"; no ruling names this de-escalation reading by itself (grep of `briefs/RULINGS-P6.md` for "r3v-n1" and "de-escalat": E.8's own text only). The old text (r3 and r4 brackets agree) is single-voiced, so it is kept. PLAUSIBLE that I.4 covers it; one line from the chair settles it.
- **O-3** The cure record's closing "Routed" line ("POP's unbuilt riot→refusal step with a live target is the ease FS counts from — POP names it at its unit") is carried into §15's POP row, so the coupling survives the record's move (old-text content placed in the volume, not a new decision).
- **O-4** `RULINGS-P5 A.2` stays in the running text (§3.2 ransom row, §7.5, §12 FS-5): it states ES-2b's status (another volume's), not FS's own review trail.
- **O-5** The ratchet's wave counter reads 7 against 6: the extra match is "J-INT-3 — OD-FS-3" inside FS3, an artifact of its pattern, not a wave.
- **O-6** The ratchet's last two MISSING tokens, `skeptic/{OP,MG,WS}-r2.md` and `skeptic/{OP,MG,WS}-r3.md`, contain commas, so `--allow-missing` (comma-split) cannot carry them; both are cure-record paths MOVED to history.
- **O-7** The `custom` token lived only inside a quote of G.5; the quote now stands in OD-FS-8's Ruled column, so the token survives as provenance.

## ALLOW-MISSING (51; passed to the ratchet except the two comma-bearing paths, O-6)
- **Superseded names (12):** `<seasonIndex>` (the old decision key; now the world week) · `attrition` (the struck way-of-war need term) · `believedHandOf` · `fiscalStrainOf` (the struck neighbour read) · `coverageTicks < 1` (the struck vault trigger) · `empty_vault` · `plenty` (the struck vault causes) · `lean` (row 5's struck vault clause) · `setBy: 'dm'` · `setFiscalHand` (the struck DM field and verb) · `short` · `shortfallHandOf` (the struck shortfall band).
- **Review-marker templates (9):** `[CURED 2026-10-20 (fp-final P6 r1) — <id>: …]` · `[CURED 2026-10-20 (fp-final P6 r2) — <id>: …]` · `[CURED 2026-10-20 (fp-final P6 r3) — <id>: …]` · `[CURED 2026-10-20 (fp-final P6 r4) — <id>: what changed]` · `[REFINED 2026-10-20 (fp-final P6 r1) — …]` · `[REFINED 2026-10-20 (fp-final P6 r2) — …]` · `[REFINED 2026-10-20 (fp-final P6 r3) — …]` · `[REFINED 2026-10-20 (fp-final P6 r4) — …]` · `[REFINED 2026-10-20 (fp-final P6) — what; why]` — the header's bracket convention itself, gone with the brackets.
- **MOVED to history — the review trail's files (22):** `skeptic/FS-r1-probe/roll-weights.out` · `skeptic/FS-r2.md` · `skeptic/FS-r3.md` · `skeptic/SEAMS-P6.md` · `skeptic/WS-r1-verify.md` · `skeptic/WS-r2-verify.md` · `skeptic/{OP,MG,WS}-r2.md` · `skeptic/{OP,MG,WS}-r3.md` · `MG-r1-verify.md` · `MG-r1.md` · `MG-r2-verify.md` · `OP-r1-verify.md` · `OP-r1.md` · `OP-r2-verify.md` · `WS-r1-verify.md` · `WS-r1.md` · `cure/D-MG-r2.md` · `cure/D-OP-r2.md` · `cure/D-WS-r1.md` · `cure/D-WS-r2.md` · `cure/L-WS.md` · `date`.
- **MOVED to history — short forms whose full form survives in the volume (8):** `completion.out` · `homefront-bound.out` · `posture-live.out` · `untargeted-riot-r4.out` (the full `cure/…-probe/…` paths stand) · `fiscal:<id>:<week>` (the volume's key is `fiscal:<settlementId>:<week>`) · `readWarHomeFront` · `warTermination` (the cites `warCosts.js :: readWarHomeFront`, `warTermination.js` stand) · `termsBand` (CH's retainer field, named only in the cure record).

**NEW tokens in the new text (9), none a mint:** `1beabdc85` · `cure/` · `skeptic/` · `history/FS-cure-record.md` · `settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/FS-cure-record.md` (the header and the trail line the output shape requires) · `factionDensityKernel.js` · `fiscalNeedOf` · `heardCommonsOf` · `treasury.js :: advanceTreasury` (landed or §16-registered symbols named bare in THE READER'S GUIDE; the cite count 50 → 51 is the last).

## THE RATCHET (its last run)
```
tokens: old 613 · new 571 · missing 2 · new-in-new 9
  MISSING (old tokens absent from the new text; superseded names must be listed in the ledger and passed with --allow-missing):
   - skeptic/{OP,MG,WS}-r2.md
   - skeptic/{OP,MG,WS}-r3.md
  NEW tokens in the new text (each must be a registered name, never a mint):
   + 1beabdc85
   + cure/
   + factionDensityKernel.js
   + fiscalNeedOf
   + heardCommonsOf
   + history/FS-cure-record.md
   + settlement-engine-kits/fp-final-a73343ed-2026-10-17/history/FS-cure-record.md
   + skeptic/
   + treasury.js :: advanceTreasury
cites (path :: symbol): old 50 · new 51 · missing 0
laws (XX1–XXn bold): old 18 · new 18
OD rulings: old 28 · new 28
owner rows ⭐: old 5 · new 15
DRAFT marks: old 21 · new 21
UNMEASURED marks: old 8 · new 8
wave ids (XX-n): old 6 · new 7
flags (…Enabled): old 16 · new 16
review markers left in the new text: 0
RATCHET 1 DIFFERENCE CLASSES
```
The one remaining difference class is the two comma-bearing cure-record paths (O-6); every other count is equal or higher (laws 18 = 18 · OD rulings 28 = 28 · DRAFT 21 = 21 · UNMEASURED 8 = 8 · flags 16 = 16 · cites 50 → 51 · ⭐ 5 → 15 · waves 6 → 7, O-5) and the review markers left in the new text are 0.

## THE ROWS (one per old marker; id · old line · old section · kind · first 60 characters · what happened)
| id | line | old § | kind | old text (first 60 chars) | disposition | where / why |
|---|---|---|---|---|---|---|
| M001 | 3 | header | header-line | Chair session 6eb7b5b6 (Fable 5.1; the program of chairs a73 | FOLDED | header (line 2: the compile log, measurements and probe directories); the seat/session attribution MOVED to history (git 1beabdc85, the cure record) |
| M002 | 4 | header | header-line | Compiled on the owner's word; DARK behind two virtual flags  | FOLDED | header line 1 (compiled; DARK behind two flags; nothing scheduled) |
| M003 | 5 | header | header-line | Bound by the FP constitution's requirements 1–24 (`DESIGN_FP | FOLDED | header line 3 (kept verbatim) |
| M004 | 6 | header | header-line | `[REFINED 2026-10-20 (fp-final P6) — what; why]` marks every | FOLDED | header line 3 ("every OD-FS-n ruling is vetoable; the owner's words outrank the design"); the [REFINED …] bracket convention MOVED to history (no bracket remains in the running text; refinements are rows of §17) |
| M005 | 7 | header | header-line | Siblings compiling beside this volume (P6a): THE OPPORTUNITY | DROPPED | superseded by the compiled siblings — OP · MG · WS are compiled volumes; their seams live in §15 and THE READER'S GUIDE |
| M006 | 8 | header | header-line | DISPOSED IN ROUND r1 (P6b, 2026-10-20; lane D-FS-r1, Opus 5. | MOVED | history — round header r1 (inputs, lane, rulings §A.1/A.7/A.8/B.4); the rulings' provenance now in §17's Ruled column |
| M007 | 9 | header | header-line | DISPOSED IN ROUND r2 (P6b, 2026-10-20; lane D-FS-r2, Opus 5. | MOVED | history — round header r2 (RULINGS-P6 §D); provenance in §17's Ruled column |
| M008 | 10 | header | header-line | DISPOSED IN ROUND r3 (P6b, 2026-10-20; lane D-FS-r3, Opus 5. | MOVED | history — round header r3 (RULINGS-P6 §E); provenance in §17's Ruled column |
| M009 | 11 | header | header-line | CONSOLIDATED IN ROUND r4 (P6d, 2026-10-20; the residue lane  | MOVED | history — round header r4 (RULINGS-P6 §G.5); G.5's ruled text FOLDED into FS6, §2.1, §3.4, §6.1–§6.3, §14 row 31 (f); provenance in §17 OD-FS-8 |
| M010 | 29 | THE ANSWER, IN ONE PARAGRAPH | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 (RULINGS-P6 A.8 | FOLDED | THE ANSWER ("what it is ASKED TO PAY … never … its vault"); the trail (the empty vault and the lord's dues leaving the need) MOVED to history |
| M011 | 29 | THE ANSWER, IN ONE PARAGRAPH | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5): r3's "in t | FOLDED | THE ANSWER ("while ANY riot holds the streets … counted afresh from the day the riot ends"); the quoted r3 wording it replaced DROPPED as superseded by this bracket (G.5) |
| M012 | 29 | THE ANSWER, IN ONE PARAGRAPH | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 (RULINGS-P6 E.8): | FOLDED | THE ANSWER ("its answer reaches the collectors, and the street, from the next week" — E.9); its riot half ("the refusal stands through a riot") DROPPED as superseded by M011 (G.5) |
| M013 | 29 | THE ANSWER, IN ONE PARAGRAPH | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (A.7): the DM's | FOLDED | THE ANSWER (the DM's lever is the landed `set-levy`); its "a held raise is collected short" half DROPPED as superseded by M014 (D.8 time-based completion) |
| M014 | 29 | THE ANSWER, IN ONE PARAGRAPH | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (RULINGS-P6 D.8 | FOLDED | THE ANSWER (custom first, one step a season; the answer reaches the mint the next week; a DM-directed raise never put to a hearing) |
| M015 | 48 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 (A.8): W-COIN's | FOLDED | §0.1 `treasuryBandOf` row (the anti-loop law's two pinned quotes bind it; vault → hand → band → mint) |
| M016 | 49 | §0.1 | bracket | [REFINED 2026-10-20 (fp-final P6 r1) — beyond FS-r1-1, which | FOLDED | §0.1 `coffersRead` row (the demand's wage term is the wage bill over the gross; the probe receipt `demand-stockfree.out` kept; the superseded term named as the one never read) |
| M017 | 50 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm2] | FOLDED | §0.1 war-costs row (the attacker-only reading stands in the row; the tag MOVED to history) |
| M018 | 50 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V1] | FOLDED | §0.1 war-costs row (the loop and its EXECUTED bound stand in the row; the tag MOVED to history) |
| M019 | 53 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (A.7)] | FOLDED | §0.1 `set-levy` row (content stands; tag MOVED) |
| M020 | 54 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9] | FOLDED | §0.1 `levySuspension` row (content stands; tag MOVED) |
| M021 | 55 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3] | FOLDED | §0.1 `participation01` row (content stands; tag MOVED) |
| M022 | 56 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11] | FOLDED | §0.1 `blocDecisionFactor` row (content stands; tag MOVED) |
| M023 | 58 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-17] | FOLDED | §0.1 `calendar.elapsedWeeks` row (content stands; tag MOVED) |
| M024 | 61 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-23: the outer cha | FOLDED | §0.1 assize row (the outer chain stands in the row; the zero-kernel-line mount is FS17) |
| M025 | 61 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (RULINGS-P6 D.9 | FOLDED | §0.1 assize row (every FS write reaches the mint the NEXT week; D.9 provenance in §17 OD-FS-22) |
| M026 | 61 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4 (RULINGS-P6 E.9:  | FOLDED | §0.1 assize row ("the NEXT tick too (OD-FS-22)"; the E.9 quote's provenance in §17 OD-FS-22) |
| M027 | 65 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-10 · WS-r1-6 (RUL | FOLDED | §0.1 `entityThreshold` row (NOT READ; the shared read `courtTemperOf`, OD-FS-17) |
| M028 | 66 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WS-r1-6 (RULINGS-P6 D.1 | FOLDED | §0.1 `courtPostureOf` row (the live `standing` term and the `books` rule stand in the row); "was false" MOVED to history |
| M029 | 69 | §0.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-12: the neighbour | FOLDED | §0.1 `beliefMap.js` row ("NOT READ by FS — FS has no neighbour's read of a hand (§7.2)") |
| M030 | 80 | §0.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1.] | FOLDED | §0.2 W-COIN A1.16 bullet ("stands UNAMENDED … OD-FS-23"); tag MOVED |
| M031 | 81 | §0.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 · FS-r1-5.] | FOLDED | §0.2 EDITOR bullet (§8 and §6.3 bindings stand); tag MOVED |
| M032 | 81 | §0.2 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm1 (RULINGS-P6 E.9: | FOLDED | §0.2 EDITOR bullet (FS binds the NEW direction and design ruling 2 only; the military-levy reading; EDITOR's side in §15) |
| M033 | 93 | §0.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-8: the compile's  | MOVED | history — the withdrawal of the per-tick premise; §0.3's H-FS-1 sentence states the final (magnitude) hazard |
| M034 | 95 | §0.3 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WS-r1-6 (RULINGS-P6 D.1 | MOVED | history — the withdrawal of the r1 "neutral until SP-4" claim; §0.3 states the live posture as master has it |
| M035 | 102 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (RULINGS-P6 A.7 | FOLDED | §1 FS1 ("the four hand words stay the SEAT's decision vocabulary; the per-form OUTPUT is `TAX_RATE_BANDS`") |
| M036 | 102 | §1 | bracket | [NOTED 2026-10-20 (fp-final P6 r2) — D11-Q1 (RULINGS-P6 D.11 | MOVED | history — D.11 Q1's confirmation ("nothing changes"); FS1 reads as confirmed; §17 OD-FS-1 carries the provenance |
| M037 | 102 | §1 | bracket | [REFINED 2026-10-20 (fp-final P6) — the brief's candidate vo | FOLDED | §1 FS1 (the four words FREE; the landed `lenient · customary · heavy · ruinous` refused with their cites; a shift, not a rate); "the brief's" attribution MOVED to history |
| M038 | 104 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 (A.8): "its OWN | FOLDED | §1 FS2 ("it NEVER reads its vault … neither a full vault nor an empty one moves a hand"); the struck wording MOVED to history |
| M039 | 104 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V1 · FS-V-n1] | FOLDED | §1 FS2 (the system-level loop and the `books` rule stand in the law; tag MOVED) |
| M040 | 104 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm2: the continuatio | FOLDED | §1 FS2 (the attacker-only reading, with its quote, folded into the war-layer sentence) |
| M041 | 106 | §1 | bracket | [REFINED 2026-10-20 (fp-final P6) — the brief's "a `heavy`/` | FOLDED | §1 FS3 (J-INT-3's reason and STOP-FS-1 kept; "the brief's … withdrawn" MOVED to history) |
| M042 | 106 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3: an `abated` han | FOLDED | §1 FS3 (an `abated` hand still presses a raise, so its season pays as held) |
| M043 | 106 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (RULINGS-P6 D.8 | FOLDED | §1 FS3 ("ONCE PER REFUSED SEASON"); the superseded "each week" DROPPED (superseded by this bracket's D.8) |
| M044 | 106 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6: the pressed-th | FOLDED | §1 FS3 ("so that holding firm is never free for a non-coercive raise") |
| M045 | 106 | §1 | stop | s this one (STOP-FS-1, `cure/L-FS.md` §3).] The hand's legit | KEPT | design mark — STOP-FS-1 in FS3 (resolved on J-INT-3; OD-FS-3 records it) |
| M046 | 108 | §1 | bracket | [REFINED 2026-10-20 (fp-final P6) — the brief's "the tithe s | FOLDED | §1 FS4 (the tithe keeps one decider; the seven secular forms because the mint is form-total); "the brief's" MOVED to history |
| M047 | 110 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3 (RULINGS-P6 B.4 | FOLDED | §1 FS5 (the composite's signature POP's, the caller W-SEAT's — §15; the pin §14 row 25) |
| M048 | 112 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2: the DM-directed  | FOLDED | §1 FS6 (a DM-directed raise is not a refusal target; POP-2's no-target jump); the struck wording MOVED |
| M049 | 112 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 (E.8)] | FOLDED | §1 FS6 ("THE REFUSAL'S LIFE IS THE LADDER'S" — stands at `refusal`/`riot`, ends below `refusal`, a returning refusal from custom; `stamp-law.out` kept); its "continuous refusal on the ladder's own rungs" count NARROWED by M050 (G.5) to the `refusal` rung |
| M050 | 112 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (MAJOR, the r3 ve | FOLDED | §1 FS6 ("THE RIOT REFUSES EVERYTHING" with the r4 probe's figures); the negative controls (r3's law 1,320 · 1,386 · 924 and 66 · 66 · 0) FOLDED as mutant (l2)'s reds in §11; "r3's stamp followed only…" MOVED to history |
| M051 | 112 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3] | FOLDED | §1 FS6 (the riot comes first for a hard hand; the re-run probe kept) |
| M052 | 112 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3] | FOLDED | §1 FS6 (the dip on a season opened `held_firm` or `abated`) |
| M053 | 112 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (RULINGS-P6 D.8 | FOLDED | §1 FS6 (TIME-BASED COMPLETION, custom first, one band step a season); "round 1's shortfall REPLACED" MOVED to history |
| M054 | 112 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6 (RULINGS-P6 B.4 | DROPPED | superseded by M053 (D.8: the SHORTFALL band replaced by time-based completion); its surviving clause (a council raising rents pays to hold firm — the dip on every form) is FOLDED in FS3/FS6 |
| M055 | 114 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-10: the `entityTh | MOVED | history — the `entityThreshold` cliff's removal; FS7's default reads posture, standing and demand (final) |
| M056 | 114 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4 (E.9: "requiremen | FOLDED | §1 FS7 (requirement 24 (b)'s "first" met at the hearing; the resolver never re-mounted ahead of the commons — OD-FS-22) |
| M057 | 114 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (D.9): round 1' | FOLDED | §1 FS7 ("No SP-9 stage is claimed — no head-of-tick resolve stage exists at master, and SP-9 registers the kind and its seal only") |
| M058 | 114 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-5 · FS-r1-7 (RULI | DROPPED | superseded by M057 (D.9) — its SP-9 resolve-first stage; its "two deciders removed" is FOLDED as FS7's ONE DECIDER, ONE DM DOOR |
| M059 | 116 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-16: "AT MOST ONE  | FOLDED | §1 FS8 ("The law is pinned (§14 row 26)"); the false "per season" wording and the struck shortfall trigger MOVED to history |
| M060 | 118 | §1 | bracket | [REFINED 2026-10-20 (fp-final P6 r2) — beyond FS-V2: once a  | FOLDED | §1 FS9 (why `handRaisedAt` reads the effective bands — a DM-directed raise's riots and rebellion told as a tax revolt; one read for the row, the telling and the war-tax words) |
| M061 | 118 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3 (the coup's rea | FOLDED | §1 FS9 (the war-tax words are the stressor lane's car, W-SEAT's side — §15; the mult is OD-FS-13 (c)) |
| M062 | 118 | §1 | bracket | [REFINED 2026-10-20 (fp-final P6) — the brief proposed a hea | FOLDED | §1 FS9 (`tax_revolt` LANDED as the origin variant with its `stressors.js` quote; never a hearing kind; the hearing is `tax_refusal`) |
| M063 | 122 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-8 · FS-r1-17.] | FOLDED | §1 FS11 (content stands; tag MOVED) |
| M064 | 126 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2 (`skeptic/FS-r1-v | FOLDED | §1 FS13 (one clause kept: a DM raise refused on a `wonted` court would have nowhere to be stored); the struck r1 sentences and the withdrawn EDITOR lift path MOVED to history |
| M065 | 126 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (RULINGS-P6 A.7 | MOVED | history — `setFiscalHand` and `setBy: 'dm'` struck (superseded names, ALLOW-MISSING) and FS13's retitle; FS13 states the final lever |
| M066 | 132 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3: "a stored hand | FOLDED | §1 FS16 (the inert stored hand made true by the row's context stands in the law; the trail MOVED) |
| M067 | 134 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6] | FOLDED | §1 FS17 (the pressed band in the car's count; tag MOVED) |
| M068 | 134 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7] | FOLDED | §1 FS17 (the answer reaches the mint the next week; tag MOVED) |
| M069 | 134 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4] | FOLDED | §1 FS17 (the commons and the assize the next week, OD-FS-22; tag MOVED) |
| M070 | 134 | §1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-23 · FS-r1-7 · FS | FOLDED | §1 FS17 (content stands; tag MOVED) |
| M071 | 136 | §1 | bracket | [REFINED 2026-10-20 (fp-final P6 r1) — this sentence contrad | MOVED | history — FS18's restatement to §5.5's receipt (the final sentence stands) |
| M072 | 136 | §1 | stop | o commons — STOP-FS-3, §5.5) and waits on the owner's OD-FS- | KEPT | design mark — STOP-FS-3 in FS18 (the flight slot, OD-FS-11 ⭐) |
| M073 | 160 | §2.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (A.7): `setBy`  | FOLDED | §2.1 record notes ("No DM field"; "The causes": `avarice`/`need_passed` FREE, `greed` refused, the two slot words out until their legs land); `setBy`, `empty_vault`, `plenty` DROPPED as superseded names (ALLOW-MISSING) |
| M074 | 160 | §2.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (RULINGS-P6 D.8 | FOLDED | §2.1 record notes ("`pressedSteps`": why the writer stamps it, the formula, FREE, OD-FS-2 VISIBLE) |
| M075 | 160 | §2.1 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 (RULINGS-P6 E.8): | FOLDED | §2.1 record notes ("The stamp's life is the ladder's") |
| M076 | 160 | §2.1 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5): the stamp  | FOLDED | §2.1 record notes ("The stamp is also the riot's carrier to the mint") |
| M077 | 160 | §2.1 | bracket | [REFINED 2026-10-20 (fp-final P6 r4) — G.5's "no stamp is ne | KEPT | design mark — the vetoable carrier choice (`riotSinceWeek` the alternative, an addition to OD-FS-2) in §2.1's notes and on OD-FS-8; confirmed by RULINGS-P6 I.4 ("The FS carrier reading … is CONFIRMED by the seat and by the chair"), recorded in §17's Ruled column |
| M078 | 163 | §2.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (RULINGS-P6 D.9 | FOLDED | §2.1 ONE WRITER (every FS write reaches the mint the NEXT week); the struck SP-9 stage DROPPED (superseded by D.9) |
| M079 | 164 | §2.1 | bracket | [REFINED 2026-10-20 (fp-final P6) — the brief asked to "meas | FOLDED | §2.1 "Why on `economicState`" (it rides no other landed record, and why); "the brief asked" MOVED to history |
| M080 | 168 | §2.2 | bracket | [REFINED 2026-10-20 (fp-final P6) — measured: a by-name read | FOLDED | §2.2 `fiscalHandActive` (the fourth-door measurement as a sentence) |
| M081 | 169 | §2.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2: `setBy` gone f | MOVED | history — `setBy` gone from the read (superseded name) |
| M082 | 170 | §2.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6: `shortfallHand | DROPPED | superseded by `pressedHandOf` (D.8) — the struck `shortfallHandOf` (ALLOW-MISSING) |
| M083 | 171 | §2.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 (A.8).] | FOLDED | §2.2 `fiscalNeedOf` (content stands; tag MOVED) |
| M084 | 173 | §2.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 · FS-V2: the as | FOLDED | §2.2 `effectiveFormBandsOf` (the asked/collected split stands; tag MOVED) |
| M085 | 174 | §2.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3: the context; F | FOLDED | §2.2 `exaction01` (the context rule stands; "a DM-directed raise is grieved like any raise" folded into the bullet) |
| M086 | 175 | §2.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-12 · L-WS-R-FS: ` | FOLDED | §2.2 "No neighbour's read" bullet (the wired-to-something reason and the public veil); `believedHandOf`, `fiscalStrainOf` DROPPED as superseded names (ALLOW-MISSING) |
| M087 | 182 | §2.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 · FS-r1-9: `emp | FOLDED | §2.3 causes row (the slot words held until their legs land); `empty_vault`/`plenty` DROPPED as superseded names |
| M088 | 190 | §2.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11] | FOLDED | §2.3 INT move-token row ("INT's side (§15)") |
| M089 | 191 | §2.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2: `setFiscalHand | MOVED | history — `setFiscalHand`, `believedHandOf`, `fiscalStrainOf` struck (superseded names, ALLOW-MISSING) |
| M090 | 191 | §2.3 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6: `shortfallHand | FOLDED | §2.3 the reads row (`pressedHandOf` FREE, its census file); `shortfallHandOf` DROPPED as superseded |
| M091 | 196 | §2.4 | bracket | [REFINED 2026-10-20 (fp-final P6) — the brief's "EXTRACTION  | MOVED | history — the brief's "EXTRACTION STANCE" renamed; §2.4's `stance` row states the rule |
| M092 | 197 | §2.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (A.7): the thir | FOLDED | §2.4 `levy` row (the third meaning registered stands; tag MOVED) |
| M093 | 212 | §3.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WS-r1-6 (D.10): round 1 | MOVED | history — the r1 "degraded arm is every preset" claim withdrawn and the `books` path closed; §3.1 states the live posture and the `books` rule (WS's side, §15) |
| M094 | 212 | §3.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-10 · WS-r1-6 (RUL | MOVED | history — one character read shared with WS; the struck `entityThreshold` arm and its "hand-over"; §3.1 states the final read (OD-FS-17) |
| M095 | 214 | §3.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11 (RULINGS-P6 B. | MOVED | history — the counsel now exists to be overridden; §3.1's counsel paragraph states it (INT's side, §15) |
| M096 | 218 | §3.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 (RULINGS-P6 A.8 | FOLDED | §3.2 the demand (the wage term is the wage bill over the custom's gross, never `coffersRead`'s coverage; the anti-loop law unamended; the pin §14 row 17 (a)); A.8's quoted "BELIEVED DEMAND" wording rendered as the volume's TRUTH reading — see OBSERVATIONS O-1 |
| M097 | 226 | §3.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WSV-N-FS-2: "WS's coali | FOLDED | §3.2 upkeep row ("WS hires nothing, §7.5"); the struck "coalition purse" DROPPED (superseded by WSV-N-FS-2) |
| M098 | 228 | §3.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9 (RULINGS-P6 B.4 | FOLDED | §3.2 (FS reads NO way-of-war term — why; the residual loop §7.5; the riders' purse is PR/ST's `patrols` row); the struck `attrition` · `coalition` term DROPPED as superseded (ALLOW-MISSING `attrition`); the clause "the coalition's hire joins only as a coin sink" DROPPED as superseded by M097 (WS hires nothing) |
| M099 | 234 | §3.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-10: `temperament` | FOLDED | §3.2 THE CHARACTER ("Never `entityThreshold`'s `temperament` or `legitimacyFragility01`") |
| M100 | 240 | §3.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 · FS-r1-10 · FS | FOLDED | §3.3 (the two candidacy laws make §14 rows 4, 4b hold by construction; `roll-r1.out` kept) |
| M101 | 244 | §3.3 | bracket | [REFINED 2026-10-20 (fp-final P6 r1) — with `plenty` struck, | MOVED | history — why the step back to custom became always admitted; §3.3's second candidacy bullet states the law |
| M102 | 256 | §3.3 | bracket | [REFINED 2026-10-20 (fp-final P6 r1) — the compile's `<seaso | FOLDED | §3.3 the draw ("a trigger roll and the season roll never share a key"); the superseded `<seasonIndex>` key DROPPED (ALLOW-MISSING) |
| M103 | 256 | §3.3 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WS-r1-6: the posture is | FOLDED | §3.3 (monotone at every posture, `roll-r2.out` kept; tag MOVED) |
| M104 | 260 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7] | FOLDED | §3.4 trigger (ii) (the verdict reaches the mint the next week; tag MOVED) |
| M105 | 260 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1: the compile's  | FOLDED | §3.4 cadence ("No trigger reads the vault (FS2)"); the struck vault trigger DROPPED as superseded (ALLOW-MISSING `coverageTicks < 1`) |
| M106 | 261 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9 (RULINGS-P6 B.4 | FOLDED | §3.4 suspension (content stands; tag MOVED) |
| M107 | 262 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-16.] | FOLDED | §3.4 dwell (content stands; tag MOVED) |
| M108 | 263 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §3.4 the refusal's completion (the riot re-write: `refusedSinceWeek` held, `pressedSteps` dropped) |
| M109 | 263 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 (E.8)] | FOLDED | §3.4 the refusal's completion (clears below `refusal`; a re-entry restamps; continuous refusal) |
| M110 | 263 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5): the dip's  | FOLDED | §3.4 the refusal's completion (the dip never in a riot week, and why) |
| M111 | 263 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3: round 2 signall | FOLDED | §3.4 the refusal's completion (`held_firm` or `abated`; `remitted` ends the target) |
| M112 | 263 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (RULINGS-P6 D.8 | FOLDED | §3.4 the refusal's completion (D.8's schedule; tag MOVED) |
| M113 | 264 | §3.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-17: the compile's | FOLDED | §3.4 the world week ("Never `advanceEpochLedger`, a nonce … never a week") |
| M114 | 273 | §3.5 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-20.] | FOLDED | §3.5 the impact kind's homes (content stands; tag MOVED) |
| M115 | 300 | §4.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — D11-Q2 (RULINGS-P6 D.11 | FOLDED | §4.2 host car (OD-FS-24 VISIBLE stands; tag MOVED) |
| M116 | 301 | §4.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6: `short`/`short | FOLDED | §4.2 (the pressed band per refused season — FS6); the struck `short`/`shortfallHandOf` DROPPED as superseded (ALLOW-MISSING `short`) |
| M117 | 302 | §4.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-24] | FOLDED | §4.2 (EC-6's notch after the hand's steps, one clamp; tag MOVED) |
| M118 | 303 | §4.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2: "the DM's raise  | FOLDED | §4.2 (a directed form collected WHOLE, never a refusal target); the struck "collected short" wording MOVED to history |
| M119 | 303 | §4.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §4.2 (the DM's direction replaces both bands; tag MOVED) |
| M120 | 304 | §4.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8): the one- | FOLDED | §4.2 (`band = refused ? pressed : raised` — time-based completion); the "SHORTFALL replaced" trail MOVED |
| M121 | 304 | §4.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6: the yield unde | DROPPED | superseded by M120 (D.8) — the r1 SHORTFALL yield band |
| M122 | 307 | §4.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7] | FOLDED | §4.2 "Why the settlement" (the verdict rides the same lag — OD-FS-22; tag MOVED) |
| M123 | 311 | §4.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1: "the roll's ne | MOVED | history — "the roll's need term makes this rare" withdrawn with the vault term; §4.3 states the final |
| M124 | 313 | §4.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-15: the self-cont | MOVED | history — the self-contradicting clause struck; §4.3 states the price IS charged |
| M125 | 313 | §4.3 | bracket | [REFINED 2026-10-20 (fp-final P6) — measured: the landed min | FOLDED | §4.3 siege bullet (the landed charge under siege and occupation; the Why panel names it; hazard H-FS-2, W-COIN's — OD-FS-13 (b)) |
| M126 | 313 | §4.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9: "the roll's ne | MOVED | history — "the roll's need term carries the siege" withdrawn; §3.4's suspension rule states the final |
| M127 | 324 | §4.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1: `coffersRead`  | MOVED | history — `coffersRead` no longer cited as an FS input (the row states the final) |
| M128 | 325 | §4.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-25 · FS-r1-9] | FOLDED | §4.4 liege row (the rule and the condition archetype, two names; tag MOVED) |
| M129 | 326 | §4.4 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6] | FOLDED | §4.4 EC-6 row (the time-based completion; tag MOVED) |
| M130 | 326 | §4.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-24] | FOLDED | §4.4 EC-6 row (one composition order, one clamp — EC's side, §15) |
| M131 | 327 | §4.4 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2] | FOLDED | §4.4 `set-levy` row (collected whole, never refused; tag MOVED) |
| M132 | 327 | §4.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §4.4 `set-levy` row (the landed cite; tag MOVED) |
| M133 | 336 | §5.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3.] | FOLDED | §5.1 (the signature POP's, the caller W-SEAT's — §15; tag MOVED) |
| M134 | 348 | §5.3 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3] | FOLDED | §5.3 road 3 (`held_firm` or `abated`; tag MOVED) |
| M135 | 348 | §5.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6.] | FOLDED | §5.3 road 3 (POP's road on every form; tag MOVED) |
| M136 | 348 | §5.3 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (RULINGS-P6 D.8 | FOLDED | §5.3 road 3 ("ONCE PER REFUSED SEASON"); the superseded "each week" DROPPED (superseded by this bracket's D.8) |
| M137 | 349 | §5.3 | stop | or of FS's (STOP-FS-1, `cure/L-FS.md` §3; the brief's design | KEPT | design mark — STOP-FS-1 in §5.3 road 4 (resolved on J-INT-3; "the brief's design withdrawn" MOVED to history) |
| M138 | 351 | §5.4 | stop | n plane — ⛔ STOP-FS-2 (a slot, not an invention) | KEPT | design mark — §5.4's heading "⛔ STOP-FS-2 (a slot, not an invention)" (OD-FS-10; cited by the fold) |
| M139 | 355 | §5.5 | stop |  Flight — ⛔ STOP-FS-3 (measured: no road; a slot) | KEPT | design mark — §5.5's heading "⛔ STOP-FS-3 (measured: no road; a slot)" (OD-FS-11 ⭐; cited by POP and the fold) |
| M140 | 357 | §5.5 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — RULINGS-P6 B.4 STOP-FS- | FOLDED | §5.5 (the recommendation on the VISIBLE owner row OD-FS-11 ⭐, not decided here) |
| M141 | 357 | §5.5 | stop | INGS-P6 B.4 STOP-FS-3 applied: OD-FS-11 stays the OWNER's, v | FOLDED | §5.5 (STOP-FS-3 applied as the owner row; the id stays in the heading — M139) |
| M142 | 369 | §6.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2] | FOLDED | §6.1 (never a DM-directed form; the no-target jump; tag MOVED) |
| M143 | 369 | §6.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §6.1 (the target `hand` is the seat's raise; tag MOVED) |
| M144 | 369 | §6.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-22.] | FOLDED | §6.1 (`hand` ranks after an underway §5c plan; POP's side, §15) |
| M145 | 369 | §6.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6: "no shortfall" | FOLDED | §6.1 degraded arm ("no time-based completion"); the superseded "no shortfall" wording DROPPED (superseded by D.8) |
| M146 | 369 | §6.1 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §6.1 ("THE RIOT NEEDS NO TARGET"; the degraded arm unchanged) |
| M147 | 373 | §6.2 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5): r3's "AT O | FOLDED | §6.2 head (the stamp at `refusal` and while ANY riot stands, the steps dropped); r3's "AT OR ABOVE REFUSAL" wording DROPPED as superseded by this bracket (G.5) |
| M148 | 373 | §6.2 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3] | FOLDED | §6.2 (the dip on a season opened `held_firm` or `abated`) |
| M149 | 373 | §6.2 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §6.2 receipts (the two riot receipts and when each is spoken) |
| M150 | 373 | §6.2 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5): r3's "The  | FOLDED | §6.2 ("WHILE ANY RIOT STANDS … the completion begins again at the riot's EASE … never more than custom"); r3's quoted sentence MOVED to history |
| M151 | 373 | §6.2 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §6.2 (the full schedule only where the seat outlasts its streets; trace (C) and `untargeted-riot-r4.out` kept) |
| M152 | 373 | §6.2 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 (E.8): round 2's  | MOVED | history — round 2's stamp clearing at `riot`; its negative control (249,161 of 847,836) FOLDED as mutant (l)'s red in §11 |
| M153 | 373 | §6.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (RULINGS-P6 D.8 | FOLDED | §6.2 (TIME-BASED COMPLETION); the r1 shortfall trail and the struck DM-directed clause MOVED to history |
| M154 | 373 | §6.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6 (RULINGS-P6 B.4 | DROPPED | superseded by M153 (D.8) — the r1 SHORTFALL band |
| M155 | 377 | §6.3 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4 (E.9): round 2's  | FOLDED | §6.3 head (requirement 24 (b)'s "first" met AT THE HEARING; the commons and the assize read the answer the next tick) |
| M156 | 377 | §6.3 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (D.9): the SP-9 | FOLDED | §6.3 head ("No SP-9 resolve-first stage exists or is asked for … SP-9 registers the kind and its seal only"; `cure/D-FS-r2.md` §1 kept) |
| M157 | 377 | §6.3 | bracket | [REFINED 2026-10-20 (fp-final P6 r2) — the chair's receipt p | FOLDED | §6.3 head (the receipt in FS's register — "taxes", never "the levy") |
| M158 | 377 | §6.3 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-7 (RULINGS-P6 B.4 | DROPPED | superseded by M156 (D.9) — the r1 SP-9 resolve-first stage and its route to SP-9 · FOLD |
| M159 | 379 | §6.3 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2: the lift of the  | FOLDED | §6.3 `remitted` ("no FS verdict touches a DM direction"; the next week's mint at custom) |
| M160 | 379 | §6.3 | bracket | [REFINED 2026-10-20 (fp-final P6 r3) — beyond FS-V4 under E. | FOLDED | §6.3 `remitted` (the beat speaks the deed; "true when spoken"; POP's side, §15) |
| M161 | 380 | §6.3 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3] | FOLDED | §6.3 `abated` (the dip as `held_firm`; tag MOVED) |
| M162 | 381 | §6.3 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8)] | FOLDED | §6.3 `held_firm` (the dip in a refused season's first week; tag MOVED) |
| M163 | 381 | §6.3 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5): r3's "the  | FOLDED | §6.3 `held_firm` (custom while the riot stands; the count at its ease; no dip in a riot week); r3's struck wording MOVED to history |
| M164 | 381 | §6.3 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3] | FOLDED | §6.3 `held_firm` (the CARD stands at `riot`; tag MOVED) |
| M165 | 391 | §7.1 | bracket | [REFINED 2026-10-20 (fp-final P6 r2) — beyond FS-V2: a DM-di | FOLDED | §7.1 the telling (a DM-directed raise reaches the telling only through this read) |
| M166 | 392 | §7.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-13.] | FOLDED | §7.1 the birth (the stressor lane's car — §15; tag MOVED) |
| M167 | 393 | §7.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3: "the coup … no | MOVED | history — "the coup … no FS term" restated to the measured reader; §7.1 states the reader |
| M168 | 397 | §7.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-12 · L-WS-R-FS] | FOLDED | §7.2 (retitled "The neighbour's read — none"; FS has no neighbour read and no war-purse band; one seam, both sides); `believedHandOf`, `fiscalStrainOf` DROPPED as superseded names (ALLOW-MISSING) |
| M169 | 401 | §7.3 | bracket | [REFINED 2026-10-20 (fp-final P6) — the brief's "a `lenient` | FOLDED | §7.3 (the keep reads ST's band; FS adds no input row; the vault pays through ST's reserved rows); "the brief's" attribution MOVED |
| M170 | 405 | §7.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9.] | FOLDED | §7.4 (the dues term absent until W-COIN-3's leg; tag MOVED) |
| M171 | 406 | §7.4 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-21.] | FOLDED | §7.4 (`dues_paid` · `dues_short`; PL's side, §15) |
| M172 | 407 | §7.4 | bracket | [REFINED 2026-10-20 (fp-final P6) — PL5's "the vassal of my  | FOLDED | §7.4 (a liege never sets a member's hand, with PL5's reason) |
| M173 | 412 | §7.5 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WSV-N-FS-2 (`skeptic/WS | FOLDED | §7.5 (WS hires nothing; `levy_thin` the only survival of the pairing); the struck "corps purchase … read the VAULT" MOVED to history |
| M174 | 412 | §7.5 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — L-MG-R-FS.] | FOLDED | §7.5 (the riders' purse is PR/ST's `patrols` row; tag MOVED) |
| M175 | 413 | §7.5 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WSV-R-FS-1 (`skeptic/WS | FOLDED | §7.5 WS ↔ FS loop (WS reads the coffers only as two latched causes); the r1 wording MOVED to history |
| M176 | 413 | §7.5 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — WS-r1-20 (FS's half).] | FOLDED | §7.5 WS ↔ FS loop (FS's half; WS's side, §15) |
| M177 | 414 | §7.5 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm2: the attacker on | FOLDED | §7.5 war-layer loop (the attacker only; WS's side reads "a poor ATTACKING court's") |
| M178 | 414 | §7.5 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V1: round 1 named on | MOVED | history — round 1 named only the WS loop; §7.5 names, bounds and soaks the war-layer loop (final) |
| M179 | 420 | §8 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (RULINGS-P6 A.7 | FOLDED | §8 head ("FS BINDS to the landed `set-levy` (`DIRECTION_OP_TYPES['set-levy']`) … OD-FS-15; no edit verb, no Edit Mode field, no DM field on the record"); `setFiscalHand` and `setBy: 'dm'` DROPPED as superseded names (ALLOW-MISSING) |
| M180 | 422 | §8 | bracket | [REFINED 2026-10-20 (fp-final P6) — the brief's "custom cont | FOLDED | §8 first bullet ("custom content is the champions' word alone"); "the brief's" attribution MOVED |
| M181 | 424 | §8 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2: "the refusal ope | MOVED | history — the struck default-`held_firm` and DM-`remitted` lift; §8's "What it holds" states the final (never a refusal target, never on a card) |
| M182 | 425 | §8 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — D11-Q2.] | FOLDED | §8 ("FS-1's car-0 NAMES that consumer car … OD-FS-24, VISIBLE"; tag MOVED) |
| M183 | 435 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 · FS-r1-2 · FS- | FOLDED | §9 scrutiny row (content stands; tag MOVED) |
| M184 | 446 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3] | FOLDED | §9 coverage row "the refusal's time-based completion" (at `refusal`; tag MOVED) |
| M185 | 446 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §9 same row (WHILE ANY RIOT STANDS, custom; tag MOVED) |
| M186 | 446 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8) · FS-V2] | FOLDED | §9 same row (never a DM-directed form; tag MOVED) |
| M187 | 447 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3] | FOLDED | §9 "POP-2's pressed-through dip" row (`held_firm` or `abated`; tag MOVED) |
| M188 | 447 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8): "each `h | FOLDED | §9 same row (once per refused season); the superseded "each `held_firm` week" DROPPED (superseded by this bracket's D.8) |
| M189 | 447 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6] | FOLDED | §9 same row (POP's road; tag MOVED) |
| M190 | 448 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3] | FOLDED | §9 coup row (content stands; tag MOVED) |
| M191 | 451 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11] | FOLDED | §9 counsel row (content stands; tag MOVED) |
| M192 | 454 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-13] | FOLDED | §9 war-tax row (content stands; tag MOVED) |
| M193 | 456 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2] | FOLDED | §9 DM row (collected whole, never refused; tag MOVED) |
| M194 | 456 | §9 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §9 DM row (the landed `set-levy`; tag MOVED) |
| M195 | 464 | §10 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3] | FOLDED | §10 registry row Class (STANDING at `refusal` or `riot`; tag MOVED) |
| M196 | 464 | §10 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3] | FOLDED | §10 registry row Class (a riot with no target opens no card; tag MOVED) |
| M197 | 466 | §10 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-4 (RULINGS-P6 B.4 | FOLDED | §10 THE ACTOR RULE head ("(⭐ OD-FS-9, VISIBLE)") |
| M198 | 470 | §10.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-10: the `entityTh | FOLDED | §10.1 (the `roll-r1.out` default magnitudes kept as EXECUTED evidence); the struck cliff divisor MOVED to history |
| M199 | 470 | §10.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2: round 1's "Where | FOLDED | §10.1 ("No card ever answers a DM-directed raise: it is never refused (FS13)"); the struck r1 sentence MOVED |
| M200 | 470 | §10.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-19.] | FOLDED | §10.1 (the card's default sentence; tag MOVED) |
| M201 | 474 | §10.2 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4] | FOLDED | §10.2 Leave (requirement 24 (b) met at the hearing; the commons and the assize read the answer the next tick — OD-FS-22) |
| M202 | 474 | §10.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-7.] | DROPPED | superseded by M203 (D.9) — the r1 SP-9 resolve-first stage this tag carried |
| M203 | 474 | §10.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (D.9): "at SP-9 | MOVED | history — "at SP-9's resolve-first stage … STRUCK"; §10.2 Leave states the final path |
| M204 | 476 | §10.2 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (D.9)] | FOLDED | §10.2 Verdict (reaching the mint the next week; tag MOVED) |
| M205 | 478 | §10.2 | bracket | [REFINED 2026-10-20 (fp-final P6) — the requirement's text b | FOLDED | §10.2 Requirement 24's reach (the interior engagement, the `guild_war` precedent, the owner's word BD carries, the veto arm) |
| M206 | 478 | §10.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-4: the reach is n | FOLDED | §10.2 Requirement 24's reach (⭐ OD-FS-9 VISIBLE; the quarter-act test answered in §10's head) |
| M207 | 488 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-12: the neighbour | MOVED | history — the neighbour read struck from the flag's lights (the row lists what it lights) |
| M208 | 488 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3] | FOLDED | §11 (4) the ROW door (content stands; tag MOVED) |
| M209 | 488 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V-n1: the posture's  | FOLDED | §11 mutant (g) (the `books` path stands; tag MOVED) |
| M210 | 488 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1] | FOLDED | §11 mutant (g) (W-COIN's pin extended over the hand; tag MOVED) |
| M211 | 488 | §11 | bracket | [FS-r1-3] | FOLDED | §11 mutant (h) (tag MOVED) |
| M212 | 488 | §11 | bracket | [FS-r1-2; CURED 2026-10-20 (fp-final P6 r2) — FS-V2] | FOLDED | §11 mutant (i) (tag MOVED) |
| M213 | 489 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8)] | FOLDED | §11 mutant (e) (tag MOVED) |
| M214 | 489 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2] | FOLDED | §11 mutant (f) (tag MOVED) |
| M215 | 489 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (D.9)] | FOLDED | §11 mutant (j) (tag MOVED) |
| M216 | 489 | §11 | bracket | [FS-r1-5] | FOLDED | §11 mutant (k) (tag MOVED) |
| M217 | 489 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 (E.8)] | FOLDED | §11 mutant (l) (with the stamp-law probe's control 249,161 of 847,836 as its red) |
| M218 | 489 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §11 mutant (l2) (with the r4 probe's control 1,320 · 1,386 · 924 and 66 · 66 · 0 as its red; `untargeted-riot.out` kept) |
| M219 | 489 | §11 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3] | FOLDED | §11 mutant (m) (tag MOVED) |
| M220 | 495 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7] | FOLDED | §12 FS-0 (2) (no resolve stage needed — OD-FS-22; tag MOVED) |
| M221 | 495 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-8: the "weekly vs | MOVED | history — the "weekly vs monthly ticks" regime withdrawn; FS-0 (4) states the final measurement ("(restated)" dropped from the running text) |
| M222 | 495 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — D11-Q2 (RULINGS-P6 D.11 | FOLDED | §12 FS-0 (7) (OD-FS-24, VISIBLE; tag MOVED) |
| M223 | 495 | §12 | stop | .js` (759 — ⛔ STOP at build if FS-4's clause would cross 800 | KEPT | design mark — FS-0 (1)'s build-time "⛔ STOP at build if FS-4's clause would cross 800" |
| M224 | 496 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 · D11-Q2] | FOLDED | §12 FS-1 hosts (`set-levy`'s consumer car cut in the same loop — OD-FS-24) |
| M225 | 496 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1] | FOLDED | §12 FS-1 pins owed — restated to the latest text: the ANTI-LOOP pin AT THE INPUT, §14 row 17 (a) (the "SYSTEM-LEVEL" title was superseded by FS-V1's retitle of row 17; see COHERENCE REPAIRS C-4) |
| M226 | 496 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2: `setFiscalHand | MOVED | history — `setFiscalHand` struck (FS-1's EDITOR entry states the landed `set-levy`) |
| M227 | 497 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3] | FOLDED | §12 FS-2 pins owed (tag MOVED) |
| M228 | 498 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7] | FOLDED | §12 FS-3 leaves (the next week — OD-FS-22; tag MOVED) |
| M229 | 498 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 · FS-r1-7] | FOLDED | §12 FS-3 hosts (SP-9 registration and seal only; tag MOVED) |
| M230 | 498 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-5 · FS-r1-6 · FS- | FOLDED | §12 FS-3 hosts (tag MOVED) |
| M231 | 498 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6: "with nothing" | MOVED | history — "with nothing" corrected; FS-3's FIRST-VISIBLE states the custom collection |
| M232 | 499 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-13] | FOLDED | §12 FS-4 hosts (the stressor lane's car — §15; tag MOVED) |
| M233 | 500 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-12: the neighbour | FOLDED | §12 FS-5 ("FS has no neighbour's read, §7.2; FS-5 is the slots alone") |
| M234 | 500 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WSV-N-FS-2] | FOLDED | §12 FS-5 slots ("WS lands none"; tag MOVED) |
| M235 | 500 | §12 | stop | are writer (STOP-FS-2). **Slots, each a demand term at its o | KEPT | design mark — STOP-FS-2 in FS-5's car-0 (OD-FS-10) |
| M236 | 502 | §12 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11 · RULINGS-P6 § | FOLDED | §12 Order and the chains (C21 after C3 and INT-2 — OD-FS-21); "the fold lane" → "the fold" |
| M237 | 512 | §13.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §13.1 create (the DM never writes this record; tag MOVED) |
| M238 | 515 | §13.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2: "A DM set is l | MOVED | history — "A DM set is lost with it" withdrawn with the DM's set; §13.1 regenerate states the final |
| M239 | 517 | §13.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6] | FOLDED | §13.1 import (`pressedSteps` validity; tag MOVED) |
| M240 | 517 | §13.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §13.1 import ("a `setBy` key or a stored `wonted` is malformed"; "legacy … compile-era draft" wording dropped) |
| M241 | 519 | §13.1 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6] | FOLDED | §13.1 dark-after-lit (the stamp and steps re-derived at the first lit pass; tag MOVED) |
| M242 | 521 | §13.1 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-12] | FOLDED | §13.1 veil (no neighbour read, §7.2; tag MOVED) |
| M243 | 534 | §13.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §13.2 decrees row (tag MOVED) |
| M244 | 535 | §13.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-21] | FOLDED | §13.2 fealty row (tag MOVED) |
| M245 | 536 | §13.2 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11] | FOLDED | §13.2 INT-2 table row (tag MOVED) |
| M246 | 547 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-14 (RULINGS-P6 B. | MOVED | history — the compile's row 4 refuted by its own draw and re-cut (`skeptic/FS-r1-probe/roll-weights.out` ALLOW-MISSING); row 4 states the exact candidacy law and its receipt |
| M247 | 549 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-14: "a hand ≥ `ex | MOVED | history — row 5's re-cut as a direction pin and its struck `lean` vault clause (`lean` ALLOW-MISSING) |
| M248 | 552 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm3] | FOLDED | §14 row 8 (the dip on `held_firm` or `abated`, a non-coercive raise too; tag MOVED) |
| M249 | 552 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3: r3's "the same w | FOLDED | §14 row 8 (the schedule at `refusal` only; custom while ANY riot stands); r3's struck wording MOVED |
| M250 | 552 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8): the one- | FOLDED | §14 row 8 (the 96-cell schedule; the shortfall row's replacement MOVED to history) |
| M251 | 552 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6] | DROPPED | superseded by M250 (D.8) — the r1 shortfall row |
| M252 | 553 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-14 · FS-r1-10] | FOLDED | §14 row 9 (direction pins; tag MOVED) |
| M253 | 553 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2: "a refusal again | FOLDED | §14 row 9 (the DM-directed raise: no target, no stamp, no card); the struck "held_firm always" MOVED |
| M254 | 554 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-r3v-n2: "from the ne | FOLDED | §14 row 10 (the ladder's own pace — POP-2's decay tail) |
| M255 | 554 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4 (RULINGS-P6 E.9:  | FOLDED | §14 row 10 (the resolving tick may carry an escalation beat; the order by design — OD-FS-22) |
| M256 | 554 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-5] | FOLDED | §14 row 10 (one decider; tag MOVED) |
| M257 | 554 | §14 | bracket | [REFINED 2026-10-20 (fp-final P6 r2) — round 1's "that tick" | FOLDED | §14 row 10 ("the one-week lag the same law as the mint's"); round 1's "that tick" MOVED to history |
| M258 | 556 | §14 | bracket | [REFINED 2026-10-20 (fp-final P6 r2)] | FOLDED | §14 row 12 (a DM-directed raise told as `tax_revolt`; mark removed) |
| M259 | 559 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §14 row 15 (tag MOVED) |
| M260 | 559 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2: the two contradi | FOLDED | §14 row 15 (the two pins reconciled; the struck clause MOVED to history) |
| M261 | 561 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1; the compile's  | MOVED | history — the compile's neighbour row struck with the read; row 17 (a) states the input-level pin |
| M262 | 561 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V1: re-titled from " | FOLDED | §14 row 17 (a) ("the row holds the war fixed (the war-layer loop is row 17 (b))"; its title AT THE INPUT stands) |
| M263 | 562 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-Vm2] | FOLDED | §14 row 17 (b) (the attacker only; tag MOVED) |
| M264 | 562 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V1 (the verifier's c | FOLDED | §14 row 17 (b) (the lit soak stands; the cure's quote MOVED to history) |
| M265 | 567 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-8: the compile's  | MOVED | history — the monthly/yearly-tick regimes withdrawn; row 22 states the weekly clock |
| M266 | 568 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-24] | FOLDED | §14 row 23 (the pressed band — FS6; tag MOVED) |
| M267 | 569 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11] | FOLDED | §14 row 24 (tag MOVED) |
| M268 | 570 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3] | FOLDED | §14 row 25 (tag MOVED) |
| M269 | 571 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-16] | FOLDED | §14 row 26 (tag MOVED) |
| M270 | 572 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4 (RULINGS-P6 E.9)] | FOLDED | §14 row 27 (the commons and the assize one tick, as the coin) |
| M271 | 572 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-7] | DROPPED | superseded by M272 (D.9) — the r1 row 27 (the first `settlement_clock` at custom) |
| M272 | 572 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (RULINGS-P6 D.9 | FOLDED | §14 row 27 ("EXACT; no head-of-tick stage exists, so none is asserted") |
| M273 | 573 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9] | FOLDED | §14 row 28 (tag MOVED) |
| M274 | 574 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9] | FOLDED | §14 row 29 (tag MOVED) |
| M275 | 575 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WS-r1-6] | FOLDED | §14 row 30 (tag MOVED) |
| M276 | 576 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5): (a)'s "and | FOLDED | §14 row 31 (a) and (b) restated as NARROWED by (f): (a) holds a fortiori, (b) on the `refusal` rung; the round-2 negative controls (249,161; 61,578) — 249,161 FOLDED as mutant (l)'s red, 61,578 MOVED to history |
| M277 | 576 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3] | FOLDED | §14 row 31 (c)–(e) (the stamp-law and riot-first receipts kept) |
| M278 | 576 | §14 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §14 row 31 (f) (THE RIOT REFUSES EVERYTHING with its receipts; the re-run probe kept) |
| M279 | 584 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 · FS-r1-8 · FS- | FOLDED | §15 W-COIN row (the input-level pin rides FS-1; W-COIN's car-0 runs the war-layer soak — COHERENCE REPAIR C-4; H-FS-1/H-FS-2; OD-FS-12; `set-levy`'s consumer) |
| M280 | 584 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — D11-Q2 · FS-r1-6 · FS-V | FOLDED | §15 W-COIN row (OD-FS-24's car; the time-based completion; the loop's coffers half) |
| M281 | 585 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3 · 5 · 6 · 22] | FOLDED | §15 POP row (registry, signature, caps, target precedence, suppression; tag MOVED) |
| M282 | 585 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 · FS-V2] | FOLDED | §15 POP row (the dip's cadence once per refused season; the target list never admits a DM direction) |
| M283 | 585 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §15 POP row (WHILE ANY RIOT STANDS …; POP's own text carries the same words); the cure record's r4 route (POP names the riot→refusal ease) carried into the row — see OBSERVATIONS O-3 |
| M284 | 585 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 · FS-V4 · FS-Vm3] | FOLDED | §15 POP row (the target carried up to `riot`; the dip on `abated` too; "and the square emptied" not spoken in the resolving tick) |
| M285 | 585 | §15 | stop | river slot (STOP-FS-3, OD-FS-11) [CURED 2026-10-20 (fp-final | KEPT | design mark — STOP-FS-3 in §15's POP row (the push-driver slot, OD-FS-11 ⭐) |
| M286 | 586 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3 · FS-r1-13] | FOLDED | §15 W-SEAT row (tag MOVED) |
| M287 | 587 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11] | FOLDED | §15 INT row (tag MOVED) |
| M288 | 588 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 · FS-r1-5] | FOLDED | §15 EDITOR row (the consumer car and the predicate; tag MOVED) |
| M289 | 588 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r3)] | FOLDED | §15 EDITOR row (the refusal-reason pairing loses `set-levy`, §0.2) |
| M290 | 588 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2: "the lift path f | FOLDED | §15 EDITOR row ("no lift path is asked — no FS verdict touches a DM direction"); the withdrawn lift path MOVED to history |
| M291 | 592 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9 · FS-r1-21] | FOLDED | §15 PL row (tag MOVED) |
| M292 | 593 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r2)] | FOLDED | §15 WS row (the posture built with NO `books` term) |
| M293 | 593 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-10 · FS-r1-12 · W | FOLDED | §15 WS row (one read; the strike of WS's war-purse row; the instrument; the attacker-only wording from §7.5) |
| M294 | 594 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-12] | FOLDED | §15 IN row ("none — FS has no neighbour's read") |
| M295 | 596 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WSV-N-FS-2: "the corps  | FOLDED | §15 CH row (`retainers` carries the corps's pay; the struck "corps purchase" MOVED) |
| M296 | 597 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7: "the resolve-f | FOLDED | §15 SP-9 row ("NOTHING of SP-9's stage order is asked"); the withdrawn stage MOVED to history |
| M297 | 597 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-4 · FS-r1-7 · FS- | FOLDED | §15 SP-9 row (OD-FS-9 ⭐; `courtTemperOf` registered; C21 after C3 and INT-2) |
| M298 | 597 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4] | FOLDED | §15 SP-9 row (requirement 24 (b)'s "first" met at the hearing; the commons and the assize the next tick) |
| M299 | 598 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-13] | FOLDED | §15 stressor-lane row (tag MOVED) |
| M300 | 598 | §15 | bracket | [REFINED 2026-10-20 (fp-final P6 r2)] | FOLDED | §15 stressor-lane row (both read `handRaisedAt` over the effective bands; mark removed) |
| M301 | 599 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V1] | FOLDED | §15 WC row (the lit soak; tag MOVED) |
| M302 | 600 | §15 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — L-MG-R-FS] | FOLDED | §15 OP · MG row (tag MOVED) |
| M303 | 608 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §16 `fiscalHand` row (tag MOVED) |
| M304 | 609 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 · FS-r1-9] | FOLDED | §16 causes row (tag MOVED) |
| M305 | 616 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 · FS-r1-12] | DROPPED | superseded — §16's "`setFiscalHand` · `believedHandOf` · `fiscalStrainOf` WITHDRAWN" note (the names are gone from the design; ALLOW-MISSING); the row's note now names the leaves' home |
| M306 | 616 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6] | DROPPED | superseded by `pressedHandOf` — §16's "`shortfallHandOf` WITHDRAWN" note (ALLOW-MISSING) |
| M307 | 617 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8)] | FOLDED | §16 `pressedSteps` row (tag MOVED) |
| M308 | 618 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-11] | FOLDED | §16 INT move-token row (tag MOVED) |
| M309 | 619 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-21] | FOLDED | §16 dues row (tag MOVED) |
| M310 | 620 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-10] | FOLDED | §16 `courtTemperOf` row ("WS's token (OD-FS-17)") |
| M311 | 621 | §16 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2] | FOLDED | §16 `levy` row (tag MOVED) |
| M312 | 631 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-16] | FOLDED | §17 OD-FS-1 (one step per decision, the dwell; tag MOVED; provenance in the Ruled column) |
| M313 | 632 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (A.7): `setBy`  | FOLDED | §17 OD-FS-2 ⭐ (NO DM field — A.7 in the Ruled column); "the shape is SMALLER than the compile's" MOVED to history |
| M314 | 632 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8): ONE opti | FOLDED | §17 OD-FS-2 ⭐ (`pressedSteps` the one optional field, VISIBLE; D.8 in the Ruled column) |
| M315 | 633 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6] | FOLDED | §17 OD-FS-3 (tag MOVED) |
| M316 | 633 | §17 | stop |  none FS's (STOP-FS-1 resolved on J-INT-3) [CURED 2026-10-20 | KEPT | design mark — STOP-FS-1 in OD-FS-3 ("resolved on J-INT-3") |
| M317 | 635 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-3 · FS-r1-2] | FOLDED | §17 OD-FS-5 (tag MOVED) |
| M318 | 638 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5)] | FOLDED | §17 OD-FS-8 (WHILE ANY RIOT STANDS …; the carrier and its vetoable alternative; I.4's confirmation in the Ruled column) |
| M319 | 638 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 · FS-Vm3] | FOLDED | §17 OD-FS-8 (the stamp's life; the dip on `abated`; the counterforce first) |
| M320 | 638 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6 (RULINGS-P6 B.4 | DROPPED | superseded by M321 (D.8) — the r1 SHORTFALL ruling (RULINGS-P6 B.4) |
| M321 | 638 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8): the one- | FOLDED | §17 OD-FS-8 (TIME-BASED COMPLETION; D.8 in the Ruled column) |
| M322 | 639 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-4 (RULINGS-P6 B.4 | FOLDED | §17 OD-FS-9 ⭐ (B.4 in the Ruled column) |
| M323 | 640 | §17 | stop |  OD-FS-10 \| STOP-FS-2: the faction-plane lean is a SLOT at F | KEPT | design mark — STOP-FS-2 in OD-FS-10 |
| M324 | 641 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — RULINGS-P6 B.4 applied] | FOLDED | §17 OD-FS-11 ⭐ ("RECOMMENDED: YES at POP's unit …"; B.4 in the Ruled column) |
| M325 | 641 | §17 | stop | E OWNER'S — STOP-FS-3: should a burdened town's people LEAVE | KEPT | design mark — STOP-FS-3 in OD-FS-11 ⭐ |
| M326 | 642 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-9 · FS-r1-21] | FOLDED | §17 OD-FS-12 (tag MOVED) |
| M327 | 643 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-8 (the false per- | FOLDED | §17 OD-FS-13 ⭐ ("(a) restated 2026-10-20 …, (c) added the same day" in the Ruled column) |
| M328 | 645 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-2 (RULINGS-P6 A.7 | FOLDED | §17 OD-FS-15 (A.7 in the Ruled column); `setFiscalHand` DROPPED as a superseded name |
| M329 | 646 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1)] | FOLDED | §17 OD-FS-16 ("withdrawn 2026-10-20" in the Ruled column) |
| M330 | 647 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — WS-r1-6 · FS-V-n1] | FOLDED | §17 OD-FS-17 (the live posture; no `books` term; D.10 in the Ruled column) |
| M331 | 647 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-10 · WS-r1-6] | FOLDED | §17 OD-FS-17 (one read; A.1 in the Ruled column) |
| M332 | 648 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-16 · FS-r1-17 · F | FOLDED | §17 OD-FS-18 (tag MOVED) |
| M333 | 650 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 · 10 · 11 · 14] | FOLDED | §17 OD-FS-20 (tag MOVED) |
| M334 | 651 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — RULINGS-P6 §C] | FOLDED | §17 OD-FS-21 (RULINGS-P6 §C in the Ruled column) |
| M335 | 652 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7] | FOLDED | §17 OD-FS-22 (the next week by design; D.9 in the Ruled column) |
| M336 | 652 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V4] | FOLDED | §17 OD-FS-22 (the commons and the assize the next tick; requirement 24 (b) at the hearing; never re-mounted; E.9 in the Ruled column) |
| M337 | 652 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-5 · FS-r1-7] | FOLDED | §17 OD-FS-22 (one decider; B.4 in the Ruled column) |
| M338 | 653 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1 (RULINGS-P6 A.8 | FOLDED | §17 OD-FS-23 (A.8 in the Ruled column) |
| M339 | 653 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V1 · FS-V-n1] | FOLDED | §17 OD-FS-23 (the war-layer loop named, bounded, soaked; the attacker only) |
| M340 | 654 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — D11-Q2 (RULINGS-P6 D.11 | FOLDED | §17 OD-FS-24 ⭐ (D.11 Q2 in the Ruled column) |
| M341 | 655 | §17 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-V2] | FOLDED | §17 OD-FS-25 (D.12 in the Ruled column); "(the verifier's cure (b))" MOVED to history |
| M342 | 665 | §18 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-6: a held raise i | DROPPED | superseded by M343 (D.8) — "a held raise is collected short" |
| M343 | 665 | §18 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-6 (D.8): the firs | FOLDED | §18 #5 (the first refused season collects custom; the raise completes by the season — the sentences stand) |
| M344 | 666 | §18 | bracket | [CURED 2026-10-20 (fp-final P6 r2) — FS-r1-7 (D.9): the answ | MOVED | history — "the square emptied by nightfall" struck; §18 #6 states the final sentence |
| M345 | 670 | §18 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1: the vault is n | MOVED | history — `plenty` struck, `need_passed` its successor; §18 #10 stands |
| M346 | 671 | §18 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-1: "an empty vaul | MOVED | history — "an empty vault" struck; §18 #11 stands |
| M347 | 672 | §18 | bracket | [CURED 2026-10-20 (fp-final P6 r1) — FS-r1-12: the compile's | MOVED | history — the struck neighbour-read sentence replaced by the `avarice` deed; §18 #12 stands |
| M348 | 673 | §18 | bracket | [CURED 2026-10-20 (fp-final P6 r3) — FS-V3 (E.8): the riot i | FOLDED | §18 #13 (the riot over a standing refusal) |
| M349 | 673 | §18 | bracket | [CURED 2026-10-20 (fp-final P6 r4) — FS-V3 (G.5): both sente | FOLDED | §18 #13 ("both are true of ANY riot") |
| M350 | 677 | §19 | round-header | ## §19 THE CURE RECORD | MOVED | history — `history/FS-cure-record.md` (the §19 heading, verbatim); the new §19 is THE REVIEW TRAIL line |
| M351 | 679 | Round r1 (P6b, 2026-10-20; l | round-header | ### Round r1 (P6b, 2026-10-20; lane D-FS-r1, Opus 5.5; input | MOVED | history — round header r1 (verbatim in the cure record) |
| M352 | 713 | Round r1 (P6b, 2026-10-20; l | bracket | [REFINED 2026-10-20 (fp-final P6 r1)] | MOVED | history — the r1 [REFINED …] list (verbatim in the cure record; each refinement is folded where it was marked in place) |
| M353 | 715 | Round r2 (P6b, 2026-10-20; l | round-header | ### Round r2 (P6b, 2026-10-20; lane D-FS-r2, Opus 5.5; input | MOVED | history — round header r2 (verbatim) |
| M354 | 733 | Round r2 (P6b, 2026-10-20; l | bracket | [REFINED 2026-10-20 (fp-final P6 r2)] | MOVED | history — the r2 [REFINED …] list (verbatim; folded in place) |
| M355 | 735 | Round r3 (P6b, 2026-10-20; l | round-header | ### Round r3 (P6b, 2026-10-20; lane D-FS-r3, Opus 5.5; input | MOVED | history — round header r3 (verbatim) |
| M356 | 759 | Round r3 (P6b, 2026-10-20; l | bracket | [REFINED 2026-10-20 (fp-final P6 r3)] | MOVED | history — the r3 [REFINED …] list (verbatim; folded in place at §6.3 `remitted`) |
| M357 | 761 | Round r4 (P6d, consolidation | round-header | ### Round r4 (P6d, consolidation; the residue lane D-FOUR-r4 | MOVED | history — round header r4 (verbatim) |
| M358 | 769 | Round r4 (P6d, consolidation | stop | STOPs: none. The compile's STOP-FS-2 and STOP-FS-3 | MOVED | history — "STOPs: none." (verbatim) |
| M359 | 769 | Round r4 (P6d, consolidation | stop | compile's STOP-FS-2 and STOP-FS-3 stay as the chair ruled th | MOVED | history — the r4 note that STOP-FS-2 and STOP-FS-3 stand as ruled (B.4); both KEPT as design marks in the volume |
| M360 | 769 | Round r4 (P6d, consolidation | stop | -FS-2 and STOP-FS-3 stay as the chair ruled them (B.4). | MOVED | history — the same r4 note (third mention on the line) |
| M361 | 770 | Round r4 (P6d, consolidation | bracket | [REFINED 2026-10-20 (fp-final P6 r4)] | MOVED | history — the r4 [REFINED …] list (verbatim; folded in place at §2.1, §3.4, §6.1, §6.2, §18 #13) |
