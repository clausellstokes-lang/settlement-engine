# PL — FIDELITY VERIFICATION OF THE COMPLETED CONSOLIDATION (P8, seat FV-PL, cloud session, 2026-10-23)

**COUNTS: sampled 104 ledger rows (plus THE READER'S GUIDE, THE RULINGS §12 whole, the cure record, a whole-volume sweep) · holds 102 · fails 2 (F1 THE READER'S GUIDE item 3; F2 row B099's trailing clause).** Four notes (N1–N4) are not fidelity fails.

**THE RATCHET (re-run on `docs/DESIGN_FP_ARCH_PL.md` as it stands, with `PL-allow.txt`): `RATCHET 5 DIFFERENCE CLASSES`.** The counts are tokens 1151 → 1050 · missing 0 · new-in-new 7; cites 64 = 64; laws 17 = 17; OD 70 → 67; ⭐ 0 → 4; DRAFT 31 → 26; UNMEASURED 28 → 25; wave ids 15 → 13; flags 36 → 35; review markers left 0. These match ledger §5 line for line, and `cmp consolidate/PL-new.md` against the volume shows them IDENTICAL. **I re-proved each of the five explanations by script (`scratchpad/fvpl/diffs.py`):**
- **OD.** The three lost ids, `OD-PR-27` (old L831), `OD-PT-28` (L838) and `OD-PS-42` (L869), sit only in the moved cure record. Old body ids minus new ids = ∅, and 61 = 61 OD-PL rows.
- **DRAFT.** The old body has 28 and the cure record 3. The two body losses are exactly L181 (B085) and L588 (B379's struck "resentment ≥ DRAFT 0.5"). L543's mark survives as "the age term is DRAFT, UNMEASURED" (new L552).
- **UNMEASURED.** The old body has 26 and the cure record 2. The one body loss is L181 (B085).
- **Wave ids.** The two lost ids are `STOP-1` and `STOP-2`, the labels the pattern catches at old L332/L334. Waves PL-0 … PL-12 all stand.
- **Flags.** `paragonGateEnabled` occurs only at old L792 (cure record).
- **⭐.** The four new marks are OD-PL-5, -12, -60 and the §12 legend (see N1).
- **New tokens.** They are trail paths, plus one backtick-parity artefact: the `kind ∈ …` list in §4.6 is 209 characters in old and new, beyond the ratchet's 200-character limit. No token was minted.

**The allow file (108 lines), checked line by line against ledger §4 (script: where each token is backticked in the old text):**
- The 9 header-template tokens sit only on old L7.
- The 38 review-trail paths sit only in the header block, the cure record or brackets.
- The 1 + 2 superseded names and the 2 + 1 seat-2 paths sit only inside brackets.
- The 53 cure-record tokens sit only at old L705+.
- **Zero allow tokens occur in old running text**, and none occurs in the new text. The section totals (9 + 38 + 1 + 2 + 3 + 2 + 53 = 108) match ledger §4 once the withdrawn `cure/D-PL-r4.md` line is netted out.

**THE MARKER COUNT (my own balanced scan, `scratchpad/fvpl/count.py`):** **634 = the ledger's 634.** The breakdown:
- Top-level brackets: 480 (head 9 + body 471: CURED 423 · REFINED 46 · RE-RULED 11) + 1 in the cure record.
- Nested: 52 (44 nested brackets + 8 `↳` inside brackets).
- Outside brackets: 7 `↳` (3 body + 4 cure), 46 round words (7 + 17 + 22), 32 `STOP` (5 + 9 + 18) and 1 `(fp-final …)` stamp.
- Header and status lines: 6 (L3–L7, L9).
- Cure-record headers: 9 (L705, 758, 804, 827, 842, 865, 903, 936, 954).
- Row ids are unique.
- Dispositions: FOLDED 550 · DROPPED 2 · MOVED 82.

**THE CURE RECORD:** `history/PL-cure-record.md` contains old L3–9 (Part 1) and old L705–967 (Part 2) **verbatim** (substring assertion, `True` / `True`). Its other content is only a title, a one-line provenance note and two part headings.

**THE CHAIR'S RULING ON ⛔ STOP PL-C-1 — APPLIED as written:**
- PL8 reads "Down: PROTECTION, ARBITRATION, the TOLL EXEMPTION (`toll_exemption`)" (L101).
- §4.5 reads "**4.5 The toll exemption and passage.** The toll exemption (`toll_exemption`) is a CHARTER TERM … the CHARTER's `toll_exemption` is tolls only" (L261).
- The §8 flags row reads "the toll exemption (`toll_exemption`)" (L400).
- PL-5 reads "the toll exemption (`toll_exemption`) through EC-6's executor" (L451).
- §15.12 reads "PL §4.5's charter carries tolls only (its `toll_exemption`)" (L712).
- THE READER'S GUIDE item 8 carries the ruling's sentence (L18).
- §3.4's `armyTransitKernel.js` cell reads "in PL the bare word "passage" carries THE PASSAGE's meaning, and the charter's toll right is always named by its registered term `toll_exemption` (PL8, §4.5)" (L221).
- Ledger rows B099 and B138 say "FOLDED per the chair's ruling of PL-C-1 (2026-10-23)".
- **No `⛔ STOP PL-C-1` and no `PL-C-1` remains in the volume** (grep 0; the one ⛔ left is §15.2's design mark "The coup budget is FULL", already in the old text).
- Every remaining bare "passage" (about 40 hits) carries THE PASSAGE's meaning.
- One trailing clause in the §3.4 cell is the lane's, not the ruling's: **F2**.

**THE GUIDE CHECK (item 3 "WHAT IT READS", against every truth read the text makes):** **FAIL (F1).** The guide says "BELIEF for every observer's picture … ; TRUTH only for the CONTRACT …, for a liege's DECLARED label and open war and a court's `publicLegitimacy` …, and in the omniscient preset." The text makes at least two truth reads outside that list:
- §5.5's verdict defaults: "each with the DEFAULT CONDITION the engine reads from the field (**truth-side, like every executing writer**; …)" (new L336 = old L325, running text).
- PL-1 (b) / OD-PL-42: "THE BORDERS LENS … is **host truth** drawn over the SEAT territory" (new L443, L610).

Every other hit is covered by item 3, or is a record or a belief read:
- PL16, OD-PL-38, §3.5 `D̄`/`L`/`P`, and the omniscient arms of PL-2/4/5/6/8/9 are named in item 3.
- §0's landed `vassalConfidence` TRUE strength and `settlementStrategy` contract read are landed substrate.
- The many "AS IT STANDS" reads are reads of the answer line or row, or of the liege's belief inputs (§4.3, §10, P45/P48/P55, OD-PL-48/53/55/59).
- §15.2 reads public signs.

The rest of THE READER'S GUIDE HOLDS against the old header, §1, §2, §7, §8, §9 and the fold:
- Flags are §8's nine.
- Hearing kinds are §7's nine, plus `call_in_answer` as WC's; relief is no kind.
- The chain is the fold's C9 ↳ ("PL-10 THE MEASURE as car 0, then PL-0 …").
- The writers are those of PL8, PL14 (B047) and OD-PL-3.
- Item 8 is the ruling's text.
- Item 5 has a small slip (N2).

**THE RULINGS (§12, whole):**
- **HOLDS.** 61 = 61 rows. Each row was diffed against its old text with brackets stripped (`scratchpad/fvpl` OD diff), and every inserted span traces to that row's own bracket.
- **OD-PL-56: the latest bracket won.** B434 + B154 give "`crownReachAt`'s `share01` per rung — a member's own band share toward its immediate liege, never the crown's own share — F.2's lend `max(1, floor(n × s × hold01))` …, the crown's own `hold01` entering once". The superseded "the net PR's composition × the crown's own `hold01`" is gone, which agrees with §4.7 F.2.
- **OD-PL-51: the latest bracket won.** B421 makes `riders_quartered` "a closed kind of shape 3, the fealty record — the PRECEDENCE FRICTION's row with ONE resentment patch … never a weave incident", and `riders_lent` "is the wear registered in §15.9's closed incident list". The old base sentence ("`riders_quartered` is registered in §15.9's closed incident list") is gone, which agrees with §4.6, F.6 (b) and §15.9.
- **OD-PL-48: B413 is DROPPED correctly.** B414 RE-RULED ("the r5 bracket just above is WITHDRAWN for the incursion"). The row now reads "'at first sight' the first week the unit is witnessed …, on the liege's own inputs as they stand (the per-reliever belief window binds siege relief only, OD-PL-55)".
- **The Ruled column's dates (script).**
  - Every date in an old row's brackets appears in the new row's Ruled column, and the latest date matches in all 61 rows.
  - OD-PL-1..37 carry the compile date 2026-10-17 as their base. OD-PL-38+ carry the date of the bracket that added them.
  - No date appears in a row body. The heading keeps "the 2026-10-16 and 2026-10-17 words".
  - THE OPEN STOPS: none, with PL-C-1 named as ruled and applied.

**§4.3's nested bracket (B136, 12 nested markers N10–N21 + the parent), read side by side against old L246:**
- **HOLDS.** (1) THE SHARE keeps PS §7.5's defence on FIELD FORCE (the quotation is restated as PS's rule, with `cure/D-PL-r4-probe/measure.out` kept).
- (2) N14 RE-RULED is applied. The withdrawn r5 text ("only once the LIEGE BELIEVES the unit …") is absent. The new text reads "the per-candidate window binds SIEGE relief only …, never the incursion: PS's first-sight default stands as PS writes it, and the outcome row follows (3) after that answer". THE MINT WAITS FOR THE WEEK, "ONCE MINTED, THE ROW IS THE LINE" (N15's freeze) and the decreed-`kept` sentence (N16) all stand. "The mirror and the first-member tie rule are a reading by delegation, vetoable."
- (3) N18/N21 RE-RULED is applied. The new text reads "AFTER EITHER ANSWER the outcome is by the crossing's HARM … (the same rule after `sent` and after `kept`: the ANSWER moves trust, so an answer never moves `P`, §4.9)" and "The harm rule applies after either answer, and the refusal is priced by `relief_kept`'s resentment patch (P47 (c), OD-PL-54)". A.6's `kept` clause is not restated. The N19 town-raid read, the bought-off harm, and N20's "THE HARM READ IS DARK … no `concludedWarRecord` read … PLAUSIBLE until [PL-4's car-0] does" all stand.
- (4) The dark gates are byte-identical.

**WHOLE-VOLUME SWEEP (`scratchpad/fvpl/sweep.py`).** Each of the 489 old body lines was stripped of brackets and aligned to the new text, then checked for a lost numeral or a lost never/not/no/only/every/always. All 41 flagged lines were read. Each one is one of:
- a removed finding id, ruling tag or date;
- a struck clause restated as the design's own statement (§4.5 "No rule makes members' armies friendly …"; §15.2 "'Strained' is never the member↔liege RESENTMENT …");
- the superseded P52 readings "(the r4 rule read 0.053 / 0.009)";
- an alignment artefact.

No law was softened or hardened, and no DRAFT, UNMEASURED or PLAUSIBLE mark was lost outside the B085/B379 pair.

**Voice and cross-references.**
- There is no `[CURED|REFINED|RE-RULED|ADDED`, no `RULINGS-…`, no `CHAIR-NOTES`, no SPL/SX/P5C/SEAMS/HOST id, no "the chair", "the lane" or "verifier", and no "round n" in the running text.
- The `PL-rN` hits are executed probe paths under `cure/` (kept by design).
- The dates left are only in the header, the owner's words and §12.

## THE FAILS
- **F1 — THE READER'S GUIDE item 3 over-claims (a hardened law in a new sentence; the same class as the CH/PT/MN guide fails).** The guide reads "TRUTH only for the CONTRACT …, for a liege's DECLARED label and open war and a court's `publicLegitimacy` …, and in the omniscient preset". The text names two more truth reads:
  - §5.5: "the DEFAULT CONDITION the engine reads from the field (truth-side, like every executing writer …)".
  - PL-1 (b) / OD-PL-42: "THE BORDERS LENS … is host truth drawn over the SEAT territory".

  **Cure:** add "…; the engine's verdict defaults read the field truth-side, as every executing writer does (§5.5); the borders lens draws host truth (§9 PL-1)", or drop "only".
- **F2 — row B099 (§3.4's `armyTransitKernel.js` cell): a new claim about another volume.** OLD reads "…in PL, "passage" names only the charter's toll right (PL8, §4.5); **the fold §5 register row is the chair's**". NEW reads "…the charter's toll right is always named by its registered term `toll_exemption` (PL8, §4.5); **the fold §5 registers the homonym**". The ruling's sentence is applied verbatim, but the trailing clause turns a pending routing into an asserted fact. The fold §5 (THE VOCABULARY REGISTER, `docs/DESIGN_FP_COHERENCE_FOLD.md` L776–1098) holds no "passage" homonym row: its only passage rows are the `PRECEDENCE_CLASSES` — NINE ↳ row and PS's token rows. The fold's §3.1.1 ↳ still says "PASSAGE as a polity-wide `toll_exemption`". **Cure:** restate the clause as "the homonym is for the fold §5 register", or drop it. The fold lane (P8d) should apply PL-C-1 at the fold's §3.1.1 ↳ and register the homonym.

## NOTES (not fails)
- **N1 — ⭐ on OD-PL-12.** The §12 legend says "⭐ marks the owner's own rows". OD-PL-12 is "⚑ OWNER-VISIBLE: a reading by delegation … for his veto", not an owner's ruling. Its Ruled column is honest ("by delegation · vetoable · the OWNER's veto (VISIBLE)"). OD-PL-60 ("the owner's shape") and OD-PL-5 ("THE OWNER'S ROW") fit the legend. Suggested repair (vetoable): change the legend to "⭐ marks the owner's own rows and those set VISIBLE for his veto".
- **N2 — THE READER'S GUIDE item 5.** It says "each host above 740 lines takes ONE polity hook (… `occupation.js` …)". §9's HOOKS table gives `occupation.js` 738 lines. PL14's list of hosts above 740 names `factionCompetition.js` (775), which neither the HOOKS table nor the guide carries. The PL14/table gap is inherited; the guide's wording is new. Cosmetic.
- **N3 — §4.5 (B138): the same class as F2, PLAUSIBLE.** OLD reads "its coupling row with PL is the chair's at P4"; NEW reads "the fold holds its coupling row with PL". I did not confirm the row in the fold, so I am not counting this as a fail.
- **N4 — B085 (DROPPED, superseded by B084): correct.** The ledger's gloss "the UNMEASURED marks … stand on every DRAFT cell" is slightly broad. §3.2's "(DRAFT; the rung is written into EC's volume)" carries no UNMEASURED, but neither did old L193/L199, so nothing was lost.

## THE TABLE
| row | verdict | receipt |
|---|---|---|
| B010 · B028 · B066 · B084 · B119 · B263 · B303 (PL-r1-1, BLOCKING) | HOLD | PL4 carries the band map, no clip, and the rationale "Keying the share to the hold would leave a frayed liege heard in no live decision … a clip at `0.45` would flatten the owner's scaling above `strong`" (L93); `narrowed_voice` "never `narrowed_sphere`" (L245); "ten landed call sites plus TWO new consumers"; pin provenance only (B303) |
| B047 · B145 · B190 · B193 · B195 · B211 · B235 · B278 · B282 · B386 · B389 (PL-r1-2, BLOCKING) | HOLD | PL14 has "ONE call into a leaf" per HOST (B047 verbatim). Shape 3 has the `fealty_sworn` baseline and the episode key, with "never renews the oath" (B145). §5.5 opens "The writer never relabels — a relabel in this engine is four writes plus the cascade …" (L326). "differ only in the majors marker (a reading by delegation, vetoable)" (B195). §10 opens with B282 |
| B011 · B020 (PL-r1-3, BLOCKING) | HOLD | §0 `foreignSeatOf` row: the four steps and the basis, with "Codepoint-first on same-substrate multiplicity" (L40). PL1: "treaty ties alone … the walk filters on basis, and P34 pins it. An edgeless matured-rung member …" |
| B107 · B200 · B217 · B304 · B393 · B394 (PL-r1-4, BLOCKING) | HOLD | `INTERVAL_WEEKS` real keys and "`.season` and `.year` do not exist" (L336). §7 has "Relief is never a kind (`relief_answer` is no PL kind)" (L371). OD-PL-40 carries the landed keys |
| B015 · B053 · B260 · B261 · B398 (HOST-r1-1, BLOCKING) | HOLD | The tuple is sent per seat in H13 "by the host's law … need not re-derive it". "the map MAY adopt it … an ASK …, never a supersession". The owner's word stands, with its date removed (L443) |
| B149 · B305 · B323 · B407 · B410 (PS-r2-3, BLOCKING) | HOLD | "PS's STABLE unit key (… never `departTick`)". The four prefixes are the contract. "so no `riders:` prefix exists" (OD-PL-46, §4.6). OD-PL-48 has "never `departTick`, so a held week keeps one answer" |
| B027 · B362 · B095 · B097 · B029 · B180 · B036 · B139 · B373 (SPL-B1–B5, BLOCKING) | HOLD | No κ (OD-PL-4 "no κ"); PL5 "There is NO FIFTH BOOK"; PL8 "never as turning points (the turning-point filter …)"; §0 `rulerBiases` counterparty-blind with §3.3 directional |
| B085 (DROPPED → B084) · B413 (DROPPED → B414) | HOLD | B085's SPHERE column was itself replaced by the band map (N4). B413's r5 belief condition was withdrawn for the incursion by B414 and is not restated anywhere |
| S06–S14 (STOP labels in the body) | HOLD | PEACE_STEP row "(the suit is refused on a suspended link, §5.5)"; "§5.6's precedent"; old L332 removed (THE MEMBER WARS "the ruled path (A′)", FALLBACK (B) named); §5.6 "THE DM'S KILL/ASSIGN — the gap is ACCEPTED AND RECORDED"; P53 / §11 labels removed |
| S01–S05 · S15–S32 · L03–L09 · R01–R09 · H01–H07 · F01 · A04–A07 · C000 (MOVED) | HOLD | contained verbatim in `history/PL-cure-record.md` (assertion) |
| B099 · B138 (PL-C-1) | B099 **FAIL (F2)** · B138 HOLD (N3) | The ruling's sentence is applied in every named place (above). B099's trailing "the fold §5 registers the homonym" is new and untrue of the fold |
| B136 + N10–N21 (§4.3, the riskiest fold) | HOLD | as above: the incursion uses PS's first-sight answer; the harm rule after either answer; the line frozen at the mint; DARK harm read; the tie rule vetoable |
| B412 · B414 · B421 · B434 · B154 | HOLD | OD-PL-48 / -51 / -56 and §4.7 F.2, as above |
| B017 · B120 · B143 · B156 · B159 · B160 · B195 · B250 · B275 (vetoable readings) | HOLD | Each keeps its "reading by delegation, vetoable": the patron exclusion (L79); the direct summons (ii); `oathSince` "reads the STANDING oath" (with `lastTransitionTick` rejected, the receipt 0.200); "the late-answer clause is a reading by delegation, vetoable"; "Both are readings by delegation, vetoable" (the one home of `riders_quartered`); §8's two placements; PL-8's "Every settlement is read, sworn or not … (a reading by delegation, vetoable; PLAUSIBLE until …)" |
| random 18: B018 B019 B037 B041 B055 B056 B110 B131 B163 B182 B184 B223 B271 B276 B291 B325 B467 B479 | HOLD | old bracket and new passage read side by side: `vassalageSeatsOf` "the two registered surfaces"; the three faith facts in the §0 rows; `stand_by` "never `remnant`"; `A` "turns on no other family's flag save OBLIGATION's" with §10's import path; "(4)(b) and (4)(a)'s unguarded cases ARE this row"; coup backing; `0.82`; PL-5's friction line; P42 "ALTERNATIVES"; §15.2 public signs; "never 'wardens'" with the H9 events window |
| A03 · H22 | HOLD | `truce?`: "ONLY if … AND (B) is ruled in" (the condition is kept); OD-PL-52's "round 4 adds" restated |
| THE READER'S GUIDE | **FAIL (F1)** · N2 | items 1, 2, 4, 6, 7, 8 hold; item 3 over-claims |
| THE RULINGS §12 | HOLD · N1 | 61 = 61; latest brackets win; Ruled dates verified by script; OPEN STOPS none |

**CONFIRMED vs PLAUSIBLE:** CONFIRMED by executed scripts and side-by-side reads:
- the ratchet re-run and all five of its explanations;
- the allow-file location check;
- my marker count (634 = 634);
- the cure-record containment;
- the PL-C-1 sites;
- the §12 date and row-diff scripts;
- the whole-volume sweep;
- both FAILs (the fold §5 grep for F2);
- every row receipt above.

PLAUSIBLE only:
- N3 (the fold's coupling row, not looked up);
- the judgement that N1, N2 and N4 are not fidelity fails.
