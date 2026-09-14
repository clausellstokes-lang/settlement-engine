# RULINGS SHEET — every walked row, its calls, verdicts and evidence (read-only extract, 2026-09-05)

Source: the 20 COMPLETE §892 walk slices, restored from `refs/preserve/sitting-892-kit-2026-09-04d`.
This is INPUT for the Fable seat to rule from; it contains no ruling itself.

## §882.8  —  2 call(s): AMEND 1, RATIFY 1
- **AMEND** [S01, CONFIRMED] laneG0RR-receipt.md mtime 09:08; a MODEL limit not a session limit; the three partial states
  - evidence: stat: '2026-09-02 09:08:35 laneG0RR-receipt.md' (SP2; no copy in SP); receipt tail '### RESUME POINT — 09:09 ET — LANE COMPLETE'. fold-batch1.py 05:27 (G0-1..19), fold-batch2.py 05:33 (G0-20..31), batch3..7 10:10–10:25 (G0-32..93); HORIZON footer: 'continued a
  - note: The 09:08 mtime, the 31-marker G0 state and the '6 of 24' header are CONFIRMED. The failure text 'You've reached your Fable limit' is transcript-only (PLAUSIBLE; no durable trace exists to settle it).
- **RATIFY** [S01, CONFIRMED] the marking machinery exists and was applied to all three folds
  - evidence: chair-commit.sh L34 grep for '^Seat: ...Opus 5 — Fable-unvalidated$'; L42-45 QUEUED=yes only if docs/FABLE_RETROVALIDATION_QUEUE.md is a mapped path; L53-59 'The blob must actually DIFFER from the parent's' + rev-parse of refs/heads/review-fixes-2026-07-08:doc
  - note: The commit log shows §882.8 at 10:03:13 (43dc69853) and §882.9 at 10:23:03 (9965b4df7); ledger tip at the switch f46be1d1f = §882.7 08:35:59 as the row says.

## §882.8.1  —  4 call(s): AMEND 1, RATIFY 3
- **AMEND** [S01, CONFIRMED] holding would strand three partial files; the folds write design documents only; veto = re-fold from the same inputs
  - evidence: fold.json chairRows: 'CR-1 web split provisional (§882.3) — CHARSET adopts web-display verbatim (fold JUDGMENT)', CR-2, CR-3, CR-4, CR-8, CR-13, CR-15, CR-16 all '(fold JUDGMENT)'; HORIZON heading '## §18 THE INSTR CAR LIST AS RE-CUT — every car of HORIZON-INS
  - note: The dispatch decision holds (the marking law was obeyed, the veto shape is real, nothing product-side landed) but its stated GROUND is false for G0: 62 of 93 marks, the INSTR car re-cut (§18) and eigh
- **RATIFY** [S01, PLAUSIBLE] no Fable-authored analysis silently re-authored by Opus
  - evidence: t13-order-panel/comp.json 05:06:02, bill.json 05:24:55; encounters-panel/promise.json 05:03:57, estate.json 05:22:54 — none rewritten after the 10:0x resume. T13 order L3: 'fold lane RESUMED on the OPUS 5 seat'; DESIGN_ENCOUNTERS L3: 'RESUMED and COMPLETED on 
  - note: The 'not re-run' half is CONFIRMED by mtimes; the run-id resume mechanics are PLAUSIBLE only — no workflow run record exists on disk. Settling command: open the Workflow runtime's record for wf_3b941f
- **RATIFY** [S01, CONFIRMED] no landing act preceded the folded order
  - evidence: git log --format='%h %cd' 9a0584f0f..7f974e855: first pick f010d26da committed 09-02 10:25:42, second 10:26:12; ledger §882.8 43dc69853 10:03:13, §882.9 9965b4df7 10:23:03; brief-T13LAND.md mtime 10:21; refs/preserve/t13-consist-2026-09-02 = 9f0df13a1 (dock un
  - note: Every landing act post-dates the folded order (10:18) and the dispatch ledger row (10:23).
- **RATIFY** [S01, CONFIRMED] the seat is correct, not merely available
  - evidence: HORIZON §4.5: 'Car 0 — THE INVARIANTS MODULE + THE MEASUREMENT: the module + soakInvariants…'; brief-G0-SOAK-car0.md: 'the MODULE half of Car 0 is an HORIZON-INSTR build car, NOT yours: you commit nothing and mint no module'; laneG0SOAK-receipt.md L3 '⟦OPUS-AU
  - note: Minor label mismatch: the brief (mtime 08:36) says 'dispatched ... by the Fable 5.1 chair' — it was pre-written at the 08:35 re-dispatch (when the four slots went to G0 fold/RR/ENC/T13-order per §882.

## §882.9  —  13 call(s): AMEND 5, RATIFY 8
- **AMEND** [S01, CONFIRMED] 5 missing / 9 partial
  - evidence: L3: 'this header still reading 6 of 24 while ⟦A1⟧–⟦A6⟧, ⟦A8⟧, ⟦A9⟧, ⟦A11⟧, ⟦A12⟧, ⟦A14⟧, ⟦A16⟧, ⟦A18⟧–⟦A21⟧ and ⟦A23⟧ were already placed, several of them PARTIAL — the resumed seat completed those and folded the five that were missing entirely: ⟦A7 · COMP-4⟧,
  - note: 'Five missing' is CONFIRMED by the header's own enumeration; 'nine PARTIAL' is the fold's unreceipted self-count (the artifact says only 'several') — EVIDENCE-THIN as a figure. The header also misattr
- **AMEND** [S01, CONFIRMED] 'this panel's amendments always carry the finding id; a bare number is the OTHER one'
  - evidence: T13 order bare: ⟦A11⟧×4 ⟦A12⟧×5 ⟦A13⟧×3 (TAIL-F: ×2/×6/×3). Inherited sites = exactly the four ⟦A22⟧ names: L425 §4.2 row 2 (=TAIL-F L319 probe C can-it-see), L459 §5 heading + L470 §5.4 (=TAIL-F L352 whole family), L516 §6.1.8 (=TAIL-F L403 hygiene by name). 
  - note: No renumber is owed — the inherited set is exactly four sites, enumerated exhaustively and verified against TAIL-F, so the ambiguity is resolved by the SITE LIST, not by the stated rule. The rule as w
- **RATIFY** [S01, CONFIRMED] §7 row 1's wording
  - evidence: L563: 'EXACTLY ONE dormancy-golden row DID flip and is named here as the REC required: momentumDormancyGolden key mo-b|8|one_month ... attributed to ⏳<family> by single-family revert and re-recorded ONCE inside the window. The flip enumeration is that ONE row,
  - note: The re-cut is honest and was escalated as a chair row and then carried on §883 as owner-visible. One wording caution for the owner surface: row 1 says 'Measured: ... ZERO of the 525 ... at both the bu
- **AMEND** [S01, CONFIRMED] row 11's composed-tip fact is settled by the §0.5.2 blob comparator so a re-point buys nothing
  - evidence: L685 CR-17: '(a) for row 11, (b) for row 12. Row 11's composed-tip fact is already settled by §0.5.2's blob comparator'. Receipt R-T13L-1: 'CR-17(a) was executed as (b) for row 11 as well ... the probe printed 686 mismatches, not 0 — because the DOCK has advan
  - note: The split's reasoning held but its (a) form was stale by execution time (the dock's Car 5 tip rewrote bandedStock.js); the lane executed (b) for both. The §882.9 stratum row carries no supersession ma
- **RATIFY** [S01, CONFIRMED] 26–29
  - evidence: L514: '⟦A5⟧⟦A6⟧ 26–29, not the author's 24–27 — the two new cures/re-records are landing commits'; §8b 23 same. git rev-list --count 9a0584f0f..7f974e855 = 28 (§882.15: '28 commits over C′').
  - note: Measured 28, inside the raised band and outside the author's 24–27 — the raise was necessary.
- **AMEND** [S01, CONFIRMED] two lawful MOVED lines; manifest identical; fixture checked at §6.3.8
  - evidence: Comparator: 'pick paths: 48 / MOVED 2 [tests/kernel/detMathIdentity.test.js, vite.config.js]'. generator-golden-master.json b99a14d1a… at 9a0584f0f AND 7f974e855. momentum-dormancy-golden.json 32f9bf326… at 9a0584f0f and 9f0df13a1, 7a92f25c4… at 7f974e855. L53
  - note: The two-line claim, the manifest scoping and the fixture movement are all CONFIRMED and consistent with §882.15 'MOVED 2' and §883. Two text defects remain in the order: the cross-reference 'check it 
- **RATIFY** [S01, CONFIRMED] Car 5 committed; seal + branch + four §882 rows present; pipeline return at :193
  - evidence: L611 '⟦A2⟧ SETTLED — Car 5 COMMITTED at 04:31/04:33 (f95305812 · 9f0df13a1, dock porcelain 0, 16 over $BASE)'; L613 '⟦A2⟧ SETTLED — all THREE present: claude/composite-r4 = 9a0584f0f, refs/preserve/landing-TAILF-2026-09-02 = 9a0584f0f…'; L615 '⟦A15 · BILL-8⟧ S
  - note: Each SETTLED mark rests on a read I reproduced.
- **RATIFY** [S01, CONFIRMED] 17 folded / 0 refused
  - evidence: L648: 'Seventeen findings, seventeen FOLDED, ZERO refused'; §9.1 rows L654–L670: 16 + 1 = 17 '**FOLDED**' (COMP-1…7, BILL-1…10); L674: 'Nothing was refused. Every clause of every finding is folded at its point. Two clauses are folded as CHOICES ... (COMP-2's d
  - note: Refutation attempt: the one clause that later failed (BILL-2's form (a)) was folded as a CHOICE and would not have been a refusal. CR-16's cost was paid and repaid: row 6b found the attribution at bot
- **RATIFY** [S01, CONFIRMED] the dock is a sealed sixteen-car consist
  - evidence: git log 9a0584f0f..7f974e855: '6c31fcf00 10:42:33 T13 landing cure 2/2: two liveness anchors for Car 1's kernel-identity suite'; refs/preserve/t13-consist-2026-09-02 = 9f0df13a1 (16 over 8b07ce45f, unchanged); §882.15 blob comparator: 'tests/kernel/detMathIden
  - note: Executed exactly as ruled; the dock's count stayed 16.
- **RATIFY** [S01, CONFIRMED] T13's window is the SIGNED one (§879.11 REC) and the arc's last ruled same-seed mover; an attributed, declared movement inside it is what the window exists for
  - evidence: §879.11: 'THE T13 REC IS SIGNED HERE, under the owner's refreshed grant (§876.4 ... "i leave all judgements to you"), LOUDLY VETOABLE — the veto window is OPEN from this row until Car 4's gate ... one declared, fully-recorded ~1e-14 shift with every flipped ro
  - note: Chair-class holds: the re-record is a TEST FIXTURE inside a declared, attributed same-seed window the REC explicitly promised ('every flipped row named'); THE PROMISE governs tuning signatures and liv
- **RATIFY** [S01, CONFIRMED] home (a) closed by pick 15; no test pins the sentence
  - evidence: git log: 'dbe469084 10:50:18 Landing hygiene: the soak replay template's transcendental claim is FALSE after Car 5'; L672: '⟦A21⟧ §2.2's home (a) is CLOSED (pick 15 committed without the sentence) so home (b) is the plan · ⟦A23⟧ no test pins §2.2's sentence (g
  - note: Landed as ruled.
- **RATIFY** [S01, CONFIRMED] the base arm is what makes a tip red attributable
  - evidence: laneT13LAND-receipt.md L225: '6b | ⭐ CR-16 — the WHOLE family, enumerated BY COMMAND (ls-files tests/property/*Golden* *Fence* *Dormancy* → 70 files of the directory's 84) | 70/70 files · 535 tests (312 + 223), ALL …'; L228/L229 rows 9 and 10 'green (inside ro
  - note: The both-arms run is exactly what made the single red classifiable as a MOVE and attributable by revert.
- **AMEND** [S01, CONFIRMED] the figures
  - evidence: wc -lc → 694 237768 (file ends with a newline; python line count 694); L3 verdict string exact; markers A1…A24 each present; 17 **FOLDED**; git rev-list --count 8b07ce45f..9f0df13a1 = 16; refs/preserve/landing-TAILF-2026-09-02 = 9a0584f0f; brief mtime 10:21; f
  - note: One figure: 695 lines → 694 (the brief repeats 695). Everything else exact.

## §882.10  —  17 call(s): AMEND 8, RATIFY 9
- **AMEND** [S02, CONFIRMED] The estate's own writer/reader colocation (gratitudeBonds.js:67/:90, espionageCareerCredit.js:234, kernel imports :91–93); the leaf cures P-7 structurally; road (a) re-creates P-7 and splits the writer from the literal k
  - evidence: gratitudeBonds.js:67 `export function applyGratitudeBondLedger(`, :90 `export function readGratitudeBondEvents(`; espionageCareerCredit.js:234 `export function readMissionCreditEvents(`; npcLadderKernel.js:91–93 import the three readers from their writer leave
  - note: The call holds: the colocation precedents are exact at fab576aba, the kernel imports its readers from the writer leaves, and ENC-2 built road (b) and landed it at §889. Two grounds overstate: (i) 'cur
- **AMEND** [S02, CONFIRMED] mintLeashOnto already writes conspiracy:'foreign_web' (corruptionWeb.js:721), resolveLeash carries the slot through (corruptionLeash.js:69–95), the slot has no closed vocabulary and exactly one src writer; zero persisted
  - evidence: fab576aba corruptionWeb.js:721 `conspiracy: 'foreign_web',`; corruptionLeash.js:69 `export function resolveLeash(` … :88 `conspiracy: explicit.conspiracy != null ? String(explicit.conspiracy) : (ties.conspiracy != null ? String(ties.conspiracy) : null),`; 2nd 
  - note: VALUE-in-slot over a boolean holds (zero shape; both feeders are carried by resolveLeash). Two amendments: (1) the fold chose the literal `'chance_meeting'` while §12 row 6 of the same volume already 
- **AMEND** [S02, CONFIRMED] A willed leash cannot exist while the flag is dark, so FENCE 1 proves the dark arm byte-identical and the shift lives inside the flag's declared lighting; the difference is declared in the volume.
  - evidence: Landed npcAgency.js:805–808 `const leash = resolveLeash(npc, item.settlement); if (isWilledLeash(leash)) return; const exposeP = exposureChance({…}); if (local.random() >= exposeP) return;`; comment :793–797 'returning before local.random() means a willed leas
  - note: The placement and the declaration hold: the difference is confined to worlds that have deposited a lean channel, which only the flag-lit stage can do, so a never-lit world is byte-identical and the do
- **RATIFY** [S02, CONFIRMED] The train lands DARK so no record can ghost before the flag lights; a cure is cheaper than a docket row with a named owner.
  - evidence: fab576aba: `git grep npcLadder -- '*regenIdentityFold.js'` returns nothing. f3523cb2d 'ENC-6: a man's standing stops being handed to whoever takes his slot — the ladder joins the reroll fold on both of its grains' — src/domain/npc/regenIdentityFold.js +200, te
  - note: The defect was real at the tip, the cure landed as a car of the dark train ahead of lighting, and the gate order (lighting, not landing) was honoured without holding the train.
- **AMEND** [S02, CONFIRMED] meet 0.375 · approach 0.094 · compromised ≈0.03 · rejected ≈0.066 · exposed ≈0.016 (modal); worst case exposed ≈0.04; a measured rate off by more than 2× is a FINDING for the tuning sitting.
  - evidence: Arithmetic: 3/8=0.375; ×2/8=0.09375≈0.094; ×(2..3)/8≈0.023–0.035≈0.03; rejected ≈0.094−0.03≈0.064 (volume writes 0.066); ×2/8≈0.016; worst: 2/8×3/8=0.094, rejections ≈0.05×7/8≈0.044≈0.04 — all reproduce. Landed register: `approachBaseRung: 2, approachAtOddsRun
  - note: The die and the written-down rates hold and reproduce. The discrepancy, recorded with both figures: predicted exposed 0.016 (modal) / 0.04 (worst); measured 0.006 per §885.7 — 2.7× under the modal and
- **RATIFY** [S02, CONFIRMED] No new state; the funnel's refusal vocabulary is CLOSED and chartered (twelve members).
  - evidence: fab576aba FUNNEL_REFUSALS: 12 members ('ambient_without_span' … 'unknown_axis'), header 'THE CLOSED REFUSAL VOCABULARY'. 30c1667bc MEETING_REFUSALS: 8 members, the 8th `'already_taught_this_season'`. characterDriftOf returns `{ [wnpcId]: { [axisId]: { offset, 
  - note: The design call holds on every ground (no new state; the funnel vocabulary is closed at 12; the leaf carries the word). Beyond the row: the UNCOMMITTED ENC-3 implementation in laneENC-tree ignores `ni
- **RATIFY** [S02, CONFIRMED] Tuning is the owner's and LAST; the design owes the arithmetic and the measurement, not the choice.
  - evidence: 30c1667bc register: `CHANCE_MEETING_TUNING_PROVENANCE … status: 'CANDIDATE, OWNER-UNSIGNED (§12 row 7; enrolled in TUNEREG at its landing)', signedBy: null`; `lessonCadenceTicks: 13` (one season = 13 weeks, ageBands.js:15 'one_season:13'); §12 row 7 carries th
  - note: Landed as a draft row named lessonCadenceTicks (the volume's LESSON_CADENCE_TICKS), value 13, unsigned, with both settings' arithmetic in row 7. No signature anywhere.
- **RATIFY** [S02, CONFIRMED] NON_LIT_RE excludes dormancy fences from lit credit; a registry row must be re-validated whenever its evidence string moves.
  - evidence: fab576aba mechanismLitCoverage.test.js:67 `const NON_LIT_RE = /(dormanc|byteidentity)/i;`. 30c1667bc: no `envoyChanceMeeting` entry in tests/fixtures/mechanism-lit-coverage-baseline.json and none in LIT_COVERED_BY; tests/domain/envoyChanceMeetingLedger.test.js
  - note: The two landed leaves are auto-credited by direct lit-eligible tests and the shrink-only baseline took no new row. The stage's own test is ENC-3's (uncommitted) and outside this row.
- **RATIFY** [S02, CONFIRMED] meet 0.375 / 0.25 · approach 0.094 / 0.094 · compromised ≈0.03 / ≈0.05 · rejected ≈0.066 / ≈0.05 · exposed ≈0.016 / ≈0.04 · a mark ≈0.28 of stops.
  - evidence: modal: 3/8=0.375 · 0.375×2/8=0.094 · 0.094×2.5/8≈0.03 · 0.094−0.03≈0.064–0.066 · 0.066×2/8≈0.016 · marks 0.375×6/8≈0.28; worst: 2/8×3/8=0.094 · rejected ≈0.05 · ×7/8≈0.044≈0.04. Table cells at §7.4 lines 402–409 match. P-2's amendment asked that '§7.4 must PRE
  - note: Authorship is correctly attributed (the panel asked for a table; the fold wrote the numbers) and every cell reproduces within rounding (0.064 vs the written 0.066).
- **AMEND** [S02, CONFIRMED] Six fate-chain sites at the tip: npcAgency.js:214–235, :778–819; corruption.js:170; pulseKernel.js:634–641 (`replaceOustedNpcs`); npcVerdictTable.js:18–23, :343–350.
  - evidence: npcAgency.js:230 `...(ousted ? { ousted: true } : {})`; :778 `if (local.random() >= exposeP) return;` … :800 `if (atBottom && local.random() < CORRUPTION_TUNING.outReplaceAtNotable) { … ousted: true`; corruption.js:170 `outReplaceAtNotable: 0.08,`; pulseKernel
  - note: The question is correct and the chain is real at the tip: five of six citations are exact; the sixth compresses the replacement into pulseKernel.js:634–641, where only the condition mint lives (replac
- **AMEND** [S02, CONFIRMED] They are leaf-local, finite and unpersisted, so FINITE SEMANTICS holds in substance.
  - evidence: §12 row 15: 'Four NEW closed vocabularies are minted by this design and persisted nowhere: … `leaning · won_over` … The persisted words (`kind`, `band` on the deposit rows) are named in rows 1, 2 and 3.' §5.4: 'value `{ patronId, targetId, npcKey, depositTick,
  - note: Row 15 contradicts itself: `leaning · won_over` is the persisted `band` of every meetingLeanChannels row (a persisted-shape vocabulary already covered by row 1), so only THREE of the four vocabularies
- **RATIFY** [S02, CONFIRMED] regenIdentityFold.js names npcLadder nowhere (verified at the tip); a reroll hands a man's standing to whoever takes his slot.
  - evidence: fab576aba grep: empty. §882.13: '9 YES to BOTH grains and onto the critical path before lighting'. f3523cb2d regenIdentityFold.js:212 '`regenIdentityFold.js` named `npcLadder` NOWHERE. So a reroll' and :261 `npcLadderAfterRosterReroll`. §12 preamble: 'Rows 4 a
  - note: The widened question rested on a verified absence and was answered and built within the span. The residue is the chair's, not the fold's: §882.1 had reserved rows 4 and 9 as never-chair-ruled, and §88
- **RATIFY** [S02, CONFIRMED] SEVEN cars, FIVE on the critical path: ENC-1, 2, 3, 4, 6.
  - evidence: §10: '| ENC-6 | folds BOTH grains … moves from "recommended" to the critical path before E5 LIGHTING (not before landing) | A14 |'. Landed f3523cb2d in the §889 train, before any lighting car.
  - note: Consistent with J25/J34 and honoured by the build order.
- **AMEND** [S02, CONFIRMED] Three rows are gates the build cannot pass without an answer.
  - evidence: §17.4: 'ENC-2 is blocked until §12 rows 1, 5 and 5b are answered, and ENC-5 until rows 2 and 3.' §882.13 (same day, later in the ledger): 'ENCOUNTERS row 1 YES … 5 YES … 5b NO — THE THREE FENCES STAND … 2 YES … 3 YES'. §887.1: 'the claim was false, and false s
  - note: Correct when written (at 10:23 the three rows were unruled owner rows by the volume's own class rules) and superseded within hours by §882.13; what decayed was the card, not the fold. The stratum row 
- **RATIFY** [S02, CONFIRMED] Seventeen rows in §12 (fifteen numbered plus 1b and 5b); 20 of 20 folded, 0 refused; markers A1–A20 complete.
  - evidence: Rows 1, 1b, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 5b, 15 = 17. §15: '20 folded (19 findings + 1 chair ruling), 0 refused, 3 owner rows opened or widened by the fold (5b NEW, 15 NEW, 9 WIDENED), 8 new judgments (J31–J38)'. Marker census A1…A20 all present
  - note: The header's own counts reconcile with the table and the markers.
- **RATIFY** [S02, CONFIRMED] A1–A4 sit in §0 and §1; the chair's re-dispatch said there were none.
  - evidence: DESIGN line 8 `⟦A1 · E-8⟧ **Anchor, re-stated at the fold.**` (the header block, before '## §0' at line 13); line 24 `⟦A2 · P-3(d), P-4⟧` (§0); lines 33 and 36 `⟦A3 · P-3(d), P-4⟧`, `⟦A4 · P-6⟧` (§1); header line 3 'a Fable seat that folded A1 to A4 and died a
  - note: The four markers and the chair's `0 of 20` are both on the record; the 05:38 timestamp and the counter's literal text are PLAUSIBLE only (the pre-fold header was overwritten in place and no copy exist
- **AMEND** [S02, CONFIRMED] The receipts line as written.
  - evidence: 825f209c…/scratchpad/DESIGN_ENCOUNTERS.md: 714 lines, 198,167 bytes, md5 3684c6978fb9512af4f017501969d493, mtime Sep 2 10:24; '## §15 PANEL DISPOSITION' :640, '## §16 REFUTE-ME, AMENDED' :671, '## §17 THE BUILD CHARTER SKELETON' :688; header 'Nothing was execu
  - note: 714 lines / 198 KB, the sections and the markers are CONFIRMED; 542 / 120 KB and 'nothing executed' are PLAUSIBLE only (no pre-fold copy; no settling act exists). The path must read SP2 (825f209c…) by

## §882.11  —  14 call(s): AMEND 5, RATIFY 8, REVERSE 1
- **AMEND** [S03, CONFIRMED] Two copies exist by design and can drift; the table is redundant to the inline folds.
  - evidence: Volumes identical (md5 ec389c5a…, 728,943 B). Inline sites found: C1 L537 ⟦G0-34⟧ · C3/C4 L537 ⟦G0-36⟧ · C5/C10 L534 ⟦G0-33⟧ · C6 L537 ⟦G0-35⟧ · C7/C8 L537 ⟦G0-37⟧ · C11 L534 ⟦G0-32⟧ — each figure equal to the table (0/7 over 1,029 · 0/1,323 · 516/525 · 36 · :
  - note: Duplication is real for 9 of 11 and they agree today. But C2 and C9 exist ONLY in the table inside §6, so the block is load-bearing, not redundant: the row's veto ('delete the ⟦G0-39⟧ block; every cor
- **RATIFY** [S03, CONFIRMED] 958‰ would otherwise ship as a four-part figure although the actor layer never resolves.
  - evidence: Source :754 ADDRESS_LEVELS = settlement→power→faction→npc; depth counted contiguously (`if (!carriesAny(entry, keys)) break; depth += 1`); `if (depth >= 1 && hasAction && hasSettlements && hasReason) fullyAddressed += 1`. Receipt :239 `fullyAddressedRateMilli`
  - note: Elevating a receipt recommendation about a customer-facing score to a vetoable chair row is the right register. One nuance for the rubric author: depth 2 is `power` (a polity), so [2..4] counts a powe
- **REVERSE** [S03, CONFIRMED] All seven canonical tokens are unreached; the mapping makes the exemption moot.
  - evidence: Raw: receipt :173 'All 7 canonical tokens score 0 rows' (persisted legacy seven). Under the RULED cure (⟦G0-34⟧ 'RULED (§882.5): the field's read(s) APPLIES canonicalSupplyChainStatus'), the fold's own log — `status on activeChains [derived] vocab:pinned(7)` —
  - note: The rationale is a raw-reading fact; under the cure the same act ruled (CR-9) the drafted exemption named precisely the right two, is already narrow, and cannot red as `exempt-but-reached` (0 rows) or
- **AMEND** [S03, PLAUSIBLE] The reader runner's advance-only figure is a lower bound on the soak's per-year fixture cost.
  - evidence: L1423: 'an ADVANCE-only figure on the reader runner's composer, **not** the soak's own per-year observation legs, so it does not discharge (a) but it bounds it from below'. §4 (a) = 'the Tier-1 fixture's cost — century-a SHIPPED 10 years ×3, median ms/year'. L
  - note: The half-discharge is honest; the phrase 'bounds it from below' is not established: per-year advance cost scales with world content, and the soak's fixture is lighter (2 NPCs/settlement, no conditions
- **AMEND** [S03, CONFIRMED] Markers are the truth; one batch2 replacement was never applied.
  - evidence: [DRY batch2 CHARSET] would-apply reps: 1 / 33 (32 BAD count=0 = consumed; 1 OK). md5 before/after ec389c5a… / 594eaa7a… unchanged. The survivor is batch2 #13 'STOP: probe 4 > 0 (redesign the reads before any bytes); probe 2 ≠ 8 faces…' — old-present=1 new-pres
  - note: The decision (trust markers, resume at 32) holds and the 32/33 figure reproduces today. But the characterisation is wrong: all 33 batch2 replacements WERE applied; the anchor survives only because its
- **RATIFY** [S03, CONFIRMED] Every mark 1..93 is present; none missing.
  - evidence: distinct marks: 93 max: 93; gaps in 1..93: (none); 377 total occurrences. pre-g0.bak ⟦G0- count: 0. Batch docstrings: batch2 'CHARSET … ⟦G0-20⟧ … ⟦G0-31⟧'; batch3 'COVERAGE … into §6'; batch4 'WORKER … §9'; batch5 'READERREVIEW … §5'; batch6 '§14'. Only other 
  - note: The '⟦G0 PARTIAL: 19⟧' at L1465 is historical prose, not a stray checkpoint.
- **RATIFY** [S03, CONFIRMED] The committed blob equals the scratch volume; the product branch does not carry it; briefs read it from the ledger line.
  - evidence: 82c073af9 (Fixture, Sep 2 10:28:24 2026 -0400) touches docs/DESIGN_HORIZON.md (315+/116−), FRQ (+12), ODQ (+1). Blob md5 ec389c5abb3fec1dd27c3ce05df7202c == SP == SP2 == HEAD:docs/DESIGN_HORIZON.md. `cat-file -e ca651d54b:docs/DESIGN_HORIZON.md` → fatal: path 
  - note: Claim satisfied: the bytes on the ledger line are the bytes the briefs direct lanes to read. Parent blob = 589,393 B pre-G0 (md5 1affeecb…), so the 631,264 B intermediate was never committed — consist
- **RATIFY** [S03, CONFIRMED] Both claims were unledgered, refuted by execution, and load-bearing.
  - evidence: Receipt :205 'Two rows §14 does not carry that Car 0 has now measured…' :207 '`status on activeChains` vocabulary claim … never entered … REFUTED by execution: 0/7 canonical tokens over 1,029 rows' :208 '`severityBand on activeConditions` "0 by construction" …
  - note: Figures match the receipt cell-for-cell; entering-and-closing is the ledger-completeness law applied.
- **RATIFY** [S03, CONFIRMED] Folding a correction to a miscitation that does not exist would be a phantom.
  - evidence: pre-g0.bak: tests/generators/generatorGoldenMaster 0 | tests/property/generatorGoldenMaster 1; current: 0 | 2; all other citations are bare `generatorGoldenMaster.test.js`. ls-tree 9a0584f0f: tests/property/generatorGoldenMaster.test.js exists. ENFORCER_DIRS (
  - note: The receipt's premise was false; K11's caution about bare-basename citations is a fair residue.
- **RATIFY** [S03, CONFIRMED] The dispatch assumed only §5 remained.
  - evidence: batch1 = WRWALKER + §1 (G0-1..19), batch2 = CHARSET (20–31, `F.checkpoint(31, '~52')`); batch3 = COVERAGE §6 (32–46), batch4 = WORKER §9 (47–58), batch5 = READERREVIEW §5 (59–73) — all three in dispatch 3 (mtimes 10:10–10:19). §882.8: 'the G0 fold (having adva
  - note: The '~52' was the Fable dispatch-1 lane's own header estimate, echoed by the chair. The ledger row under-states its own correction: it says '§5 AND §9' while crediting COVERAGE 32–46 to the same dispa
- **RATIFY** [S03, CONFIRMED] Byte/line figures and the header are as stated.
  - evidence: 728943 / 1469 on SP, SP2 and 82c073af9:docs/DESIGN_HORIZON.md. L3 carries '⟦G0 FOLDED 2026-09-02 10:25 ET · OPUS-AUTHORED — Fable retrovalidation OWED: the INSTR cars are cut; WRWALKER Car 1 on web-display⟧'. pre-g0.bak 589393 B, md5 1affeecb636af40204557c7ac8
  - note: The 631,264 resume figure alone is unverifiable (no intermediate copy survives); the endpoints are exact.
- **AMEND** [S03, CONFIRMED] The four counts describe the volume.
  - evidence: fold.json: folded 93, refused [], chairRows 18 (CR-1…CR-16 + OWNER WK-11 + OWNER RR-10), settled14 27 entries. §14 rows carrying ⟦G0-: 27. ⟦G0-n⟧ **REFUSE… marks: 0. §19 table rows in the volume: CR-8 … CR-16 (9) + WK-11 + RR-10 + '(carried)'; grep for CR-1…CR
  - note: 93/0/27 hold. '18 chair rows' counts fold.json entries; the volume's §19 — which says it 'hands up' the fold's decisions — carries only 9 CR rows plus 2 owner rows. Amend to '16 chair rows (9 tabled i
- **AMEND** [S03, CONFIRMED] Mechanism and read-only posture as stated.
  - evidence: foldlib.rep: `if n != count: raise AssertionError`; save() writes once per batch; batch3 `f.checkpoint(46, 84)`, batch4 `(58, 84)`, batch5 `(73, 90)`, batch6 `(92, 96)`, batch7 flip='⟦G0 FOLDED…'. No write_text/open/shutil/subprocess in any batch. But $ME/g0-f
  - note: Anchor/atomic/checkpoint claims hold. 'nothing executed' is overstated: dispatch 1 executed two read-only node probes against the G0 docks (no vitest/build/npm/git). Amend to the colophon's wording pl
- **RATIFY** [S03, CONFIRMED] Committing was the only option that kept the briefs' citations resolvable.
  - evidence: brief-INSTR-WRW/-SOAK/-TUNEREG and brief-HORIZONDARK cite `docs/DESIGN_HORIZON.md` and read it via `git -C $R show HEAD:docs/DESIGN_HORIZON.md` because the ledger working tree has it `D ` (staged deletion).
  - note: Nothing owed; the alternative is worse for the reasons stated.

## §882.12  —  7 call(s): RATIFY 5, AMEND 2
- **RATIFY** [S04, CONFIRMED] SHIPPED 100 y 53.44 s, LIT 100 y 105.27 s, 300/300 distinct hashes, extrapolation wrong in sign
  - evidence: receipt §3: 'century-a SHIPPED 100 y … 53.44 s real … 523.5 | LIT 100 y … 105.27 s real … 1,117.5 | … 30 y + replay … 474.5 | 10 y × 3 … 435.5'; JSON: seed century-a years 100 lit True finalTick 5200 totalMs 104900, distinct hashes 100 of 100; nine logs each e
  - note: LIT figures re-derived from the primary JSON; SHIPPED 53.44 s and the 300/300 rest on the receipt plus the nine exit-0 logs (the SHIPPED JSONs were not re-parsed — `python3 -c` over soak-car0-c-shippe
- **AMEND** [S04, CONFIRMED] the rule admits no value; the recommended replacement admits every LIT year; the law belongs to CAPACITY's author
  - evidence: MAX ratio 3.5741 at leg-c year 15; years >1.5: [12,14,15,16,17,18,19,20] count 8; leg-c y11→y12: pop 277→221, bound 394→108, density 720→108, binding granary→walls. RE-SHAPE `1.5 × max(bound(y), bound(y−1))` VIOLATIONS: [(15,'leg-c',386,108,108),(16,393,117,10
  - note: The REFUSAL holds and the routing is right. But the parenthetical carried into ledger §882.12, §883.4, soakInvariants.mjs:58, centuryLegSoak.test.js:42 and H-1 ('admits ALL 100 LIT years') is FALSE fo
- **RATIFY** [S04, CONFIRMED] E12 stays owed to the first scheduled run; still unsettled at ca651d54b
  - evidence: receipt: '0.51 s/settlement-year (61,249 ms / 120 settlement-years) … 17.8× cheaper than the LEDGER's own 30y×12s datum (3,276 s / 360 = 9.1 …)'; 61249/120 = 510 ms ✓, 3276/360 = 9.1 ✓; volume :1185 '| E12 | research-lit-4s fits a 360-min hosted job … | the FI
  - note: Still deliberately unsettled at ca651d54b — no later act, row or register closed it. Wording nit: 'the ledger's own 9.1' is a ledger-BRANCH doc figure, not an ODQ ruling; harmless but should be cited 
- **RATIFY** [S04, CONFIRMED] composition measured not guessed; two seeds leave 1.62× margin against three's 1.29×
  - evidence: receipt §7: '1 seed … 162.7 s | 45.2 % | 2.21× · 2 seeds … 222.5 s | 61.8 % | 1.62× · 3 seeds … 279.9 s | 77.8 % | 1.29×'; 162.7/360=0.452, 222.5/360=0.618, 279.9/360=0.7775, 360/222.5=1.618, 360/279.9=1.286 ✓; century-b 60.50 s, century-c 58.02 s each TRUE_EX
  - note: The call is a CI-budget judgment (§4.5 binds the count to the hosted job, cumulative with two sibling lanes); the figures and the vetoable form are exactly as the row states.
- **AMEND** [S04, CONFIRMED] two beyond-charter findings: the dead LIT major stream; the §4.1 JUDGMENT's non-transferring ground
  - evidence: receipt R6 'Reported the LIT major-stream death'; R7 'Left century-c's year-23 zero-population-then-18 remnant unruled … leg-c reaches 0 at y23 WITH a died flag … repopulates to 18 at y24 … an owner-adjacent world question'; JSON leg-c y22-25 pop/died: [(22,14
  - note: Count is at least THREE beyond-charter findings: R7 (a died settlement repopulating — a remnant-law / owner-adjacent question) is recorded only in the receipt and is not routed anywhere. The receipt a
- **RATIFY** [S04, CONFIRMED] 82c073af9 carries three files; the stale text; cured at 3a0b39c0d; anchor-assert-first + handoff read-back
  - evidence: 82c073af9 stat: 'docs/DESIGN_HORIZON.md | 431 … docs/FABLE_RETROVALIDATION_QUEUE.md | 12 + … docs/OWNER_DECISION_QUEUE.md | 1 + … 3 files changed'; word-diff 82c073af9→3a0b39c0d removed '[-(four of four, all Opus):**-] … [-**G0 FOLD** (resumes `$SP/DESIGN_HORI
  - note: The miss is real and self-reported accurately. The stratum records the lesson as a rule; it does not say the cure was implemented — it WAS, in kit-883 (writer refuses on a prefix mismatch and aborts b
- **RATIFY** [S04, CONFIRMED] the receipt's provenance block
  - evidence: wc: 384 laneG0SOAK-receipt.md; nine non-fold logs, each 'TRUE_EXIT=0'; dock HEAD 9a0584f0fdbf74f30bcf910f53fe429fb1dbdc4a, porcelain '?? soakCar0.probe.mjs / ?? soakCar0Fold.probe.mjs'; md5 1a76dc26fb008c7629e3facdbaa9938a at 9a0584f0f:package-lock.json and in
  - note: The ~10:26 sibling appearance is the lane's own board observation and is not independently reproducible now; every figure it brackets is consistent with the artifact mtimes.

## §883.7  —  19 call(s): AMEND 8, RATIFY 10, EVIDENCE-THIN 1
- **AMEND** [S04, CONFIRMED] base choice and its two-boarding-shapes consequence
  - evidence: dock HEAD 2ed4483a1, five commits over 7f974e855; refs/preserve/landing-T13-2026-09-02 = 7f974e855; is-ancestor 7f974e855→e2967f2a1: 1 (no), →f3d33e4b9: 1 (no), →2ed4483a1: 0 (yes); INSTR-LANDING-ORDER.md:114 'This order picks all nineteen in chain order, from
  - note: The two-BASE fact holds and the lane stated it honestly. But the ruling's operative sentence did not survive: the landing order chose ONE boarding shape — nineteen plain picks, SOAK's five as base==ou
- **RATIFY** [S04, CONFIRMED] no such constant exists; the measurement admits none
  - evidence: module exports: POPULATION_ENVELOPE {min:0.05,max:20}, YEARLY_BYTES_PER_SETTLEMENT_CEILING 900_000, WALL_TIME_TREND, LIVENESS_FLOOR, LIVENESS_FAILURE_KINDS, LIVENESS_CHECK_TITLE + five functions — no bound/allowance constant; the only '1.5' hits are docblock :
  - note: The refusal is exactly as described and is byte-stable through the §891 train. The docblock's own :58 re-shape claim is the false figure amended under §882.12 (2); the 'second, harder reason' (the cen
- **RATIFY** [S04, CONFIRMED] the pin exists as an executed test; the kind enum is three; the weekly job is the lit profile
  - evidence: module :118 `LIVENESS_FAILURE_KINDS = Object.freeze(['silent', 'monoculture', 'frozen'])`; :308-310 minMajorsPerDecade / majorSilentDecades / majorSilentDecadeNumbers; volume :342 (under '### §4.1 The mechanism' at :319) '`LivenessFailureKind` (3)'; test :102 
  - note: Figure to amend everywhere it is carried (ledger §882.12, §883.4, module :64, H-2, both stratum sections): the LIT century has ZERO majors in 87 of 100 years (y13–y100 minus y23), not 78. The decade p
- **AMEND** [S04, CONFIRMED] the count, the attribution, and the zero-headroom consequence
  - evidence: baseline 7f974e855: entries=10 totalTests=30788 totalFiles=2445 (4 voiceMechanics · enforcement-claims · clampPrimitiveBaseline · 3 warCostKindPools · warRulingKindPools); unchanged at 2ed4483a1; still 10 at ca651d54b/4233031ba. tip log 'Test Files 6 failed | 
  - note: The measurement and the one-for-one attribution are exact. But 'ZERO HEADROOM / cannot be banked' is a POLICY ceiling — §4.1's JUDGMENT text ('10/10 with no headroom') — not a mechanical one: the ratc
- **RATIFY** [S04, CONFIRMED] the measured register and world figures
  - evidence: consist diff: 18 files, +3415/−73, `-- src/` EMPTY; ci.yml '8 insertions(+)'; dock lighting baseline unchanged 2497/370/2127/22491/6078 (2501… is measured, not banked); 16+1+10+9+8=44, 30788+44=30832, 2445+4=2449; car1 vs car0 (my comparison): 'element-wise eq
  - note: Every figure I could re-derive or read from a primary log matched. The 3-year cured run and the base-tuple lighting probe were not re-executed (settle: `node scripts/audit/whole-world-soak.mjs --years
- **AMEND** [S04, CONFIRMED] the handover is correctly routed and correctly stated
  - evidence: volume :384 'R3 the LIT leg violates the envelope or 1.5× on a whole-pulse world — low-medium; a CAPACITY finding, and a good one; never bank'; H-1 text 'measured, that admits ALL 100 LIT years'; receipt-capacity.md (354 lines): zero hits for bound(y|H-1|E11|3
  - note: Routing right, content wrong, delivery missing. (a) The recommended shape does not do what the row says — see §882.12 (2). (b) The CAPACITY lane (§891, ec6b0a132/6bddd6183/d02c5acde) built from a desi
- **RATIFY** [S04, CONFIRMED] the remaining handover rows
  - evidence: ci.yml: '1 file changed, 8 insertions(+)' (receipt erratum: commit 0df1524b5's body says +9); car3 verbose 'Duration 259.10s … tests 253.91s', unit run '288.73 s'; INSTR-LANDING-ORDER.md:114 '(b) ⭐ It is the only consist that lengthens the gate — Car 3's centu
  - note: H-2 inherits the 87-not-78 figure amendment; H-6 inherits the policy-vs-mechanism amendment. Whether the four 'confirmed' volume amendments were FOLDED into DESIGN_HORIZON.md after §884 was not checke
- **RATIFY** [S04, CONFIRMED] the lane's process claims
  - evidence: HEAD 2ed4483a1f94d69288033cdcf2fb73684a6ed298; `status --porcelain -uall` empty (before and after my single-file run); five commits c09e1ccfc 572230b66 0df1524b5 15f82a820 2ed4483a1; `%(trailers:key=Seat,valueonly)` = 'Opus 5 (lane INSTR-SOAK)' on all five; re
  - note: 'no --amend' is not directly provable after the fact; intact trailers on all five commits are the available proxy.
- **RATIFY** [S04, PLAUSIBLE] the lane's remaining self-flagged calls
  - evidence: centuryLegSoak.test.js: no `toBeLessThan|toBeGreaterThan` hits; `const SEEDS = ['century-a', 'century-b']`; module :390 `yearlyBytesVerdict` and :419 `LIVENESS_CHECK_TITLE` exist; both baselines unchanged in the dock; E12 row unchanged at ledger HEAD.
  - note: S4, S5, S9, S10 and the module half of S7 are CONFIRMED as above. S6, S8 and the CLI half of S7 rest on the receipt only — settle with `git show 2ed4483a1:scripts/soak/evaluate.mjs | grep -n fullInstr
- **RATIFY** [S04, CONFIRMED] the two chair rulings on this lane
  - evidence: See §883.7 S3 (kinds pinned at three; weekly cron on the lit profile; the pin executed 16/16) and §883.7 S1 (is-ancestor results; INSTR-LANDING-ORDER.md:114 'The ground for that shape is measured, not assumed: every whole-stack dry run onto C″ has ZERO conflic
  - note: The expose-not-judge ruling is sound and its consequence (the pin is the specification for a chair-added band) is in the tree. The base-cut ruling's factual half holds; its 'two boarding shapes' half 
- **RATIFY** [S12, CONFIRMED] The chair reasoned from the finite-semantics law to a quality verdict without reading the prose, withdrew it and measured instead.
  - evidence: ledger 32372: 'The chair's earlier claim that it was not was an INFERENCE PRESENTED AS A JUDGMENT ... without reading one line of the prose'. git hash-object SP/tree/src/domain/display/stateProse/economyStateProse.js = afe25281a = 7f974e855 blob; phraseRepetit
  - note: The self-report is honest and the correction was executed, not promised. HIGH priority for the process failure stands.
- **EVIDENCE-THIN** [S12, CONFIRMED] Three lenses and two adversaries returned those verdicts; the critic conceded on an every-109th sample of 2,734.
  - evidence: grep -rl 'That attack line fails' SP SP2 (excluding queue copies) -> no files. grep 'every 109th' SP/more.mjs:28-29: '// systematic sample every 109th' / 'SYSTEMATIC SAMPLE (every 109th, unbiased)'. The quoted concession exists only inside ledger row 32372.
  - note: The most-cited piece of evidence in the row (the hostile critic's concession) survives only as the chair's transcription. The sampling script is reproducible; the concession is a judgment and is not. 
- **AMEND** [S12, CONFIRMED] Estate and corpus census as stated; annexes hand-authored.
  - evidence: variants.json: variants 2734, distinct texts 2734, naming>=1 slot 2207 (80.7%), occurrences 3238, distinct slots 39, pools 786, blocks 146, mean words 23.5, total words 64344. ast-prose.json: list of 22651 strings over 771 files, 21945 distinct, 378008 words —
  - note: Corpus figures RATIFIED exactly. The estate-wide triple is unreproducible from what survives (raw scan is 22,651/771/378k) — label it 'chair-filtered, filter not preserved'. Replace 'hand-authored' wi
- **AMEND** [S12, CONFIRMED] Corpus has zero product consumers; only economyStateProse.js reads it; docs/DESIGN_FP_SPINE.md says 'THE READER IS BUILT AND DARK'.
  - evidence: git grep -n 'stateProse' 7f974e855 -- src/components/ | wc -l -> 0. Callers outside src/domain/display/stateProse/: none. ls-tree 7f974e855 src/domain/display/stateProse/: causalDossierProse.js dmFieldProjection.js economyStateProse.js legibilityRung.js stateP
  - note: Substance holds and is the lighting wave's measured size. The SPINE quotation is not verbatim and is about Lane H's herald display slice, not 'the reader'; quote it as such or drop it.
- **AMEND** [S12, CONFIRMED] As stated; cured by §884.3.
  - evidence: economyStateProse.js@7f974e855:101-107 'const ACCESS_PROSE = Object.freeze({ road: "the road", river: "the river", ...})'; :219 'access: ACCESS_PROSE[access]'. stateProseKernel.js:173-181 fillSlots = text.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g, ... String(val
  - note: Mechanism, cure and leaf-identity all hold. Two figures must change: the count is 10 of 20 (not 11) on the chair's own deterministic probe; the seven variants live in DS-ECO-1 (6) and DS-ECO-10 (1), a
- **AMEND** [S12, CONFIRMED] The instrument would sign off on the exact failure it exists to catch.
  - evidence: phraseRepetitionEnvelope.js:133-186: buckets are Map<settlementId, Map<window, lines>>; :169 'const distinct = new Set(lines).size' per settlement per window; :82 POWERED_WINDOW_MINIMUM = 4; :66-74 ceiling 'UNRATIFIED until the owner signs it'; docblock 'Consu
  - note: The conclusion (rendered-line counting is the wrong measure) survives, but on different evidence than the row gives. The instrument never scored 0.3667 and never passed that stream: on its own contrac
- **AMEND** [S12, CONFIRMED] Both sites as stated; §886 cured them.
  - evidence: wizardNews.js@7f974e855:478 'if (transition === \'applied\') return `${label} takes hold in ${target}`;' (line 478, not 477). @d1a6c773e the template is gone; :181 comment 'so a reader met "Conflict pressure takes hold in Elmspur"'. §886 cars: 7d0987ea0 NEWSTR
  - note: Line is 478. The headline frame is cured at §886. The slug half is GATED, not cured: the quoted example occupation_burden_cleared is a registered kind whose variant 1 is still the computed 'burden cle
- **RATIFY** [S12, CONFIRMED] Capturing model quality while discarding model behaviour is the stated design goal and is strictly stronger than re-rolling per session; the critic's 'purchasable' point stands unanswered.
  - evidence: git log --diff-filter=A -- docs/content/RECEIPT_POOLS_DOSSIER_STATE.md -> 9a9094a33 (Mon Aug 3 03:59:17 2026), 1 file, 5520 insertions. Message: 'Run wf_444949dc-ca7 (8 agents, 0 errors): two-surveyor census ... four cluster writers ... two verifiers PASS with
  - note: My own view, for the ruling: (1) every guarantee the product sells — THE PROMISE's immutable lived history, same-seed determinism, no invented harbour, no per-read cost — is a property of fixed text, 
- **RATIFY** [S12, CONFIRMED] The tree holds an executed record of LLM failure modes and two in-repo cures for the corpus's failure mode.
  - evidence: prompts.ts:53 HOUSE_STYLE 'No adjective fatigue, no "nestled," no "bustling,"'; :77 six-noun enumeration; :125-126 docblock above summarizeFoodSituation (:128) 'ledger to check its prose against and "isolated" drifts into "feeds itself entirely" — even when th
  - note: Every quotation checks out verbatim at 7f974e855.

## S05-1  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] The sentence restates §170/§217/§223 + the 08-10 grant; the by-nature carve-outs (tuning values/signature, paid tier, re-opening a specific owner ruling, budget raise) survive it.
  - evidence: §881.6: "I leave all decisions to you" RULED "the full delegation (§879.6, §880.12) is REAFFIRMED with the owner-gated classes by nature untouched (push and deploy, legal, data deletion, tuning VALUES, security posture, persisted shapes)". §763.1: "THE BY-NATU
  - note: The reading is the program's settled pattern (§464, §763.1, §881.6) and the chair's carve-out list is a superset of the 08-10 four, consistent with the canonical judgment-ledger §3 list quoted in CLAU

## S05-2  —  1 call(s): AMEND 1
- **AMEND** [S05, CONFIRMED] Sound, rests on §725's finding, expires at launch.
  - evidence: §725.1 owner verbatim: "We have no existing users… we are still prelaunch." §884.6 owner: "there is no save before this fix; we are entirely prelaunch." 08-10 grant: "the OSR freeze docket becomes Fable-ruleable". BUT same morning: §881.6 lists "persisted shap
  - note: Substance holds: the ground is the owner's own words twice over, the OSR docket was already chair-ruleable since 08-10, and the expiry at launch is correctly stated. Two amendments: (a) the row must N

## S05-3  —  1 call(s): AMEND 1
- **AMEND** [S05, CONFIRMED] Application of existing law; the design owes DISCOVERY and LAPSE ends.
  - evidence: §881.11 (owner): "compromised to another settlement" ⇒ "a leash band … never a change of sides … 'never executes, permanently turns, or ends a named character' stand unchanged". §881.10 chair refinement (1): "'turned' is expressed as a leash band, not a defect
  - note: The NO is RATIFIED and is an application, not a new law — but of §881.11's specific word and §881.10(1)/the architecture's no-turn law; npcLadderKernel's STATE-NEVER-FATE is the rank-law sibling, and 

## S05-4  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] Each is the owner's by nature; the holds were correct at the time.
  - evidence: simulationRules.js:639-642: "Owner ruling (golden sign-off — LIGHT EVERYTHING RECOMMENDED): dramatic_campaign … It stays LIGHTER than full_simulation (no deep war sub-flags / religionDynamics ceiling)". faithTuningSurface.js:15-21: "Until then every value belo
  - note: All five holds correct when made; the owner delegated O-12/O-16/O-17/O-10(b) in chat on 09-03 (§889) and they landed or closed (O-10(b) with residual zero, no raise). Two wording notes: O-17's quoted 

## S05-5  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] As recommended; supported by the design text.
  - evidence: Design row 1 recommended: "YES: both drop-when-empty, both under the namespace that costs zero first-paint bytes, both readers total". envoyChanceMeetingLedger.js @30c1667bc :120 `dropSpatialLedger(nextWorldState, 'meetingMarkEvents')`, :171 `dropSpatialLedger
  - note: Ruled and executed in §889 (ENC-2). Its legitimacy as a chair ruling depends on S05-2's boundary (the design itself classed it 'persisted shape (by nature)').

## S05-6  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] The only road on which the owner's clause 2 reaches the people he named.
  - evidence: Design row 4: "YES: the only road on which the owner's clause 2 reaches the people he named (nearly every operative is a non-holder)". Preamble: "Rows 4 and 9 … NEVER chair-ruled". enc2346 receipt: "npcLadderKernel.js — … the orphan-pass apply, THE ORPHAN MINT
  - note: As recommended and landed. Ruled against the design's own 'NEVER chair-ruled' label — valid only under S05-2's boundary, which must name that label as superseded.

## S05-7  —  1 call(s): AMEND 1
- **AMEND** [S05, CONFIRMED] As recommended; the words remain owner's.
  - evidence: Design row 6: "YES, at lighting (the wave's declared shift); the pool sentences are the pen's to amend at the voice sitting". enc4 receipt: "`chance_meeting` IS ALREADY A LIVE TOKEN … corruptionLeash.js:70 export const WILLED_MEETING_CONSPIRACY = 'chance_meeti
  - note: The ruling holds (show both kinds at lighting; words to the pen), but the first kind's NAME as ruled was superseded by §889.1(a) → `chance_meeting_recorded`; the stratum's §882.13 text still carries `

## S05-8  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] As recommended.
  - evidence: Design row 8: "LEAVE IT TO THE WAVE with the dependency recorded (this row)". At 9a0584f0f the only src reference to eliteBleed outside its own file is a comment (sovereigntyTransfer.js:69) — unwired at the tip, as the design says. §887.1: "ENC-7 is DEFERRED t
  - note: Ground supported by the tree.

## S05-9  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] regenIdentityFold names npcLadder nowhere; a reroll hands a man's standing to whoever takes his slot.
  - evidence: `git grep -c 'npcLadder' 9a0584f0f -- src/domain/npc/regenIdentityFold.js` → no match. @30c1667bc :212 "`regenIdentityFold.js` named `npcLadder` NOWHERE. So a reroll…", :261 `export function npcLadderAfterRosterReroll(worldState, settlementId, preserved)`. Des
  - note: Ground verified at the tip; landed in §889 (ENC-6) before the lighting wave, as ruled. Like row 4, ruled against the design's 'NEVER chair-ruled' label — valid under S05-2 once the supersession is nam

## S05-10  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] One substrate per train.
  - evidence: §2.1: "roads visitor | a different substrate (`whereabouts.state`, `spatialLedgers.roads.missions`) with NO projection into the envoy census | never, by this design"; "JUDGMENT (vetoable): v1 covers the errand spine only. The roads visitor arm is a DOCUMENTED 
  - note: As recommended; the projector is named in the design as the row requires.

## S05-11  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] Margin stays until the lighting wave's cars are measured; banking a ceiling before its consumers are measured makes a self-imposed constant a design constraint.
  - evidence: §19 WK-11: "the chair's standing recommendation is NOT before the lighting wave, revisited at the tuning sitting". vendorPdfLazy.test.js: @9a0584f0f :509 `const CLOSURE_BUDGET_BYTES = 1_047_000;` → @ca651d54b and @4233031ba :565 `const CLOSURE_BUDGET_BYTES = 1
  - note: Executed evidence: the ceiling was not lowered at any later tip. The §882.6 'carried' row correctly treats the T13 banking question as the same object.

## S05-12  —  1 call(s): AMEND 1
- **AMEND** [S05, CONFIRMED] A chair act; without it the LIT-PREVIEW corpus cannot serve its purpose.
  - evidence: §19 CR-13 (a CHAIR row): "`PREVIEW_OVERLAY` gains `errandSpineEnabled` | YEAR + THE CONJUNCTION MEMBER"; RR-10: "The chair's minimum act is already folded and is not the owner's". readerCorpus.mjs @4233031ba :101-115 (READERREVIEW Car 2, authored 2026-09-03 15
  - note: The ruling is right (it restates the fold's own CR-13) — but it is UNEXECUTED and the §891 train's car states the opposite in code, so at 4233031ba the preview corpus's espionage member is exactly the

## S05-13  —  1 call(s): AMEND 1
- **AMEND** [S05, CONFIRMED] Without it warMemoryEnabled writes records nobody can read; LAZY/PROSE_RENDER, droppable at zero cost.
  - evidence: §7.A O-5 why-owner: "NEW CAPABILITY by HORIZON RR-2's own class; 'must be given one' is the chair's application of the owner's nine words, not the owner's sentence". HORIZON :510: "Owner-gated, exactly: … a war-memory RENDERER (RR-2 — no surface reads `conclud
  - note: Defensible: §881.4 is a validated ruling and a lit flag with no reader is a walk absence, and the car is droppable. But the row reverses two explicit 'new capability / owner-gated' classifications (HO

## S05-14  —  1 call(s): AMEND 1
- **AMEND** [S05, CONFIRMED] Persisted/exported shapes, chair-class under the pre-launch boundary.
  - evidence: §7.A O-11: "persisted / exported shapes (publicSafe allowlist = DM-share export shape; accountImportBody id-resolution = import shape; provenance receiptHash = a hash input — §874.7) | SIGN | 0 B, one sentence; unsigned → the MAT dial stays at v1". §882.1: "Th
  - note: As recommended; its validity is exactly S05-2's boundary (export/import shapes have no installed consumers pre-launch). Same amendment: name §882.1's own by-nature classification as superseded.

## S05-15  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] Every belief-conjoined shift record says PREMIUM.
  - evidence: campaignWorldPulseSlice.js:389-391 @9a0584f0f: "// ENTITLEMENT — read at the store call site … if (state.auth?.tier !== 'premium') return { ok: false, reason: 'not_entitled' };". §7.A O-14 recommended: "premium-only stays as designed for launch; every belief-c
  - note: Choosing the shipped state changes no paid surface; the 'canonize at birth' build stays unpriced and unordered, as the row says.

## S05-16  —  1 call(s): AMEND 1
- **AMEND** [S05, CONFIRMED] The owner's own words (§881.10 'bond, rivalry or respect'); the grudge mirrors the bond.
  - evidence: §881.10 owner: "a new bond / rivalry / respect across settlements". @30c1667bc and @4233031ba npcLadderState.js:407 `BOND_KINDS = … ['loyalty','gratitude','friendship']`, :383 `GRUDGE_KINDS = … ['contest_loss','contest_forestalled']`; :450 `const k = … BOND_KI
  - note: Both rulings are as recommended and well-grounded (the owner's own three words). But NEITHER is executed at 30c1667bc, 4233031ba or in the uncommitted ENC-3: `respect` is silently coerced to `friendsh

## S05-17  —  1 call(s): RATIFY 1
- **RATIFY** [S05, CONFIRMED] Each as the design recommended.
  - evidence: Row 1b: "AGREE (no new field): the priced-not-taken road … costs an OSR shape on a 6,507-row corpus". Row 10 executed: livedExperienceFunnel.js:585 @30c1667bc "⛔ ENC-2 (§12 row 10) THE THIRD ADMISSION ARM. A `vectorSupplied` row …". Row 11: §881.4 "the walk's 
  - note: All six match the design's recommended answers and their grounds are the owner's own rulings or leaf-local facts. Row 13's DOCKET has no visible docket entry anywhere at HEAD beyond the ruling row — E

## §882.14  —  2 call(s): RATIFY 2
- **RATIFY** [S06, CONFIRMED] The seven GOLDEN cars were alive only on a detached worktree HEAD and are now reachable from a ref.
  - evidence: for-each-ref: `ba08939d718b43702bcf1dd5ca37b650370b55d6 commit refs/preserve/golden-build-2026-09-02` · `9f0df13a1e9fe0062884207293b1caba02bf6102 commit refs/preserve/t13-consist-2026-09-02` · `f02fd7c4bcbb70d148b9e2eec6a604c3902cbb65 commit refs/preserve/paid
  - note: The seal is still the ONLY holder: none of the seven cars' files exist at ca651d54b or 4233031ba (git ls-tree empty for all five paths). See beyond[0].
- **RATIFY** [S06, CONFIRMED] Thirteen calls with no queue row and no ledger collection row.
  - evidence: ODQ :32316 (§879.15): `GOLDEN-BUILD DISPATCHED as a fifth, a JUDGMENT (vetoable)`. AUDIT.md :165–168: `Not a queue row, not a ledger collection row … thereafter only as a dock sha in survey lines (§880.3, §880.7, §880.11, §881.19: laneGOLDEN-tree ba08939d7 p0)
  - note: Receipt drafted its own row at laneGOLDEN-receipt.md :391–409 (R1–R13); the stratum reproduces it faithfully in substance.

## §882.14.1  —  14 call(s): RATIFY 9, AMEND 4, OUT-OF-SCOPE 1
- **RATIFY** [S06, CONFIRMED] A second test file costs a second three-census bill for zero extra enforcement; charter prices ONE walker file and marks the door 'no census'.
  - evidence: ls-tree ba08939d7 tests/helpers/goldenRecordDoor.test.js tests/lint/goldenRecordDoor.test.js → 0 entries. Walker describes :619 `the signed door — refusal 1: the record, not the env var`, :671 `action verbs`, :703 `refusal 2 [A3]: the dirty-tree check`, :755 `
  - note: Reversal is genuinely trivial (move four describes; pay one more three-census bill).
- **RATIFY** [S06, CONFIRMED] Adding titles to an existing suite moves the lighting tuple and needs a refreeze the brief forbids in-lane.
  - evidence: Commits touching religionDormancy.byteIdentity.test.js in the seven cars: 0. `git diff --stat 8b07ce45f ba08939d7 -- tests/lint/.lighting-census-baseline.json` → 0 lines (tuple stays files 2480 / titles 21877 / suiteTitles 5965). Brief :21: `NOT YOURS: the fen
- **RATIFY** [S06, CONFIRMED] Turns an interrupted freeze act into a conviction instead of a pass; the brief mandates an explicit frozenAt: null.
  - evidence: Register keys: `frozenAt: null frozenAtSha: null genesis: null`; walker :122 `const FROZEN = REGISTER.frozenAt !== null && REGISTER.frozenAt !== undefined;` :306–313 `it('frozenAt, frozenAtSha and genesis are null together or set together' … expect(new Set(sta
  - note: Sound and cheap to veto (one field, one arm). Schema note for the freeze act: once frozen, `frozenAt` and the charter's `genesis.date` carry the same fact in two places and no arm asserts them equal —
- **AMEND** [S06, CONFIRMED] A bare-string list is the unit-less-field hazard; an exclusion nobody can justify is one nobody will remove.
  - evidence: 7 entries, every one `envSpelling,files,reason`; reasons 58–303 chars, none blank. Probe: all 7 `files` lists accurate at ba08939d7 (each listed file reads `process.env.<spelling>`). Walker reads the object ONLY at :208 `new Set((REGISTER.excludedEnvSpellings 
  - note: The shape holds. Amend the row to state: the walker asserts only `envSpelling`; `files` and `reason` are unasserted prose, so a `files` entry that stops reading its spelling rots silently (the spellin
- **RATIFY** [S06, CONFIRMED] A constant added or deleted convicts today, not at L9 (plant 5).
  - evidence: Register: espionage-dormancy-fence constantSites 1 · mission 11 · rider 11. Tree at ba08939d7 (`grep -oE "'[0-9a-f]{64}'"`): 1 / 11 / 11. Walker :486–487: `if (row.constantSites !== constants.length) drift.push(\`${rel}: register says ${row.constantSites} site
  - note: Plant 5's message in the receipt (:315 `register says 1 sites, tree has 2`) matches the source template.
- **RATIFY** [S06, CONFIRMED] Silently enrolling them would downgrade real protection.
  - evidence: Exactly 4 rows carry `governance`. Headers at ba08939d7: espionageDormancyFence :212–213 `Any movement outside T13's own recorded window is a STOP, never a re-record`; espionageRiderDormancyFence :68 `⛔ THIS NUMBER MOVING IS A STOP, NEVER A RE-RECORD — it is t
  - note: 'Two stronger seals + one un-refusable writer' is an accurate count (dormancy fence + rider fence; PDF snapshot). Nothing foreclosed — each rider hands the ruling to the freeze act. Because the walker
- **RATIFY** [S06, CONFIRMED] An item neither enrolled nor written-excluded is the silence the design forbids; it cannot be resolved by forgetting.
  - evidence: Roster names 6 suites (assize, commonsVoice, naval, reframe, seaRoads, thirdPartyRansom). ls-tree ba08939d7 → 6/6 exist (also 6/6 at 4233031ba); UPDATE_GOLDEN readers among them 0; writeFileSync 0. Charter :219 row 5 prices `32 suites (one register row EACH…)`
  - note: One over-claim in the walker's own comment (:347–348 says the arm reds if a suite is 'deleted or given a manifest'): the code asserts EXISTENCE only. The manifest-gain direction is still closed, by th
- **AMEND** [S06, CONFIRMED] Removing it widens every hunk for zero enforcement.
  - evidence: `existsSync(dirname` carriers among the 43: 34 at base, 34 at tip; `mkdirSync` carriers: 43 at base, 43 at tip (nothing removed). Drift of the 43 since base: only `tests/property/generatorGoldenMaster.test.js | 108 +` (at both ca651d54b and 4233031ba), hunk `@
  - note: Substance holds; wording: 'each migrated call site' → 'the 34 that carried it (all 43 keep their mkdirSync form)'. Record the forward figure: as of 4233031ba one of the 43 has moved, offset-only, so t
- **RATIFY** [S06, CONFIRMED] It becomes unused and would fail lint.
  - evidence: writeFileSync among the 43 migrated files at ba08939d7: 0. recordGolden importers under tests/ (excluding door + walker): 43. Car 6 stat: `43 files changed, 129 insertions(+), 86 deletions(-)`. Walker :512–516 `it('no enrolled capture arm still calls writeFile
- **RATIFY** [S06, CONFIRMED] Half a corpus definition is worse than none: it would be frozen and then believed; the corpus half of probe C is REC Q2's to rule.
  - evidence: Source :172–176: `if (args.arm === 'soak') { die('the \`soak\` arm is deliberately unbuilt: probe C's corpus definition is not recorded anywhere this script can read, and inventing one would mint a frozen corpus rather than build an instrument. It is REC Q2's 
  - note: The refusal is an exit-3 die, not a silent no-op — a fallback branch that prints no finding. Correct shape.
- **AMEND** [S06, CONFIRMED] Hooks do not exist on every line; installing one mutates shared config.
  - evidence: §709.5: `The sandbox branch tracks eight top-level entries and carries zero scripts/, zero eslint.config, zero .husky/ — against the build branch's 176 scripts/ files, an eslint config and a husky shim.` ls-tree at 8b07ce45f, ba08939d7, ca651d54b: `.husky/pre-
  - note: The decision (no hook) stands — on charter §4.3 and the shared-surface ground. Two corrections owed: (1) 'absent exactly where it matters' is misapplied — the zero-.husky line is the map-module sandbo
- **RATIFY** [S06, CONFIRMED] Not its, not dispatched; an unattributed fix inside a freeze consist is worse than a reported red.
  - evidence: Baseline at 8b07ce45f lists all five as banked known failures: :49 `clampPrimitiveBaseline … baseline exactly matches the files that still define a local clamp/clamp01`, :57/:65/:73 the three `warCostKindPools … retains the five receipt-annex families verbatim
  - note: No routing is owed: the five are already banked in the known-failure census at the base (which is FULL, 10/10). The stratum's 'reported for routing' should read 'banked known failures, no action'.
- **OUT-OF-SCOPE** [S06, CONFIRMED] Receipt §426 executed check-test-ratchet at ba08939d7.
  - evidence: Receipt :428–429: `sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs at ba08939d7, exclusive tier, completed. It reports 3 failing tests not in the frozen census` — the lighting census bill (2481 vs 2480), the mutation-manifest TOTALITY bil
  - note: Not a live judgment. The two census bills and the manifest entry remain unpaid because the cars are unlanded (beyond[0]).
- **AMEND** [S06, CONFIRMED] The freeze act at L9 is the arc's own gate and this register governs every output change after it.
  - evidence: R3/R4/R6/R7 all hold (one AMEND on R4's unasserted fields). R11 carries the only consequential gap: the §4.3 backstop is unwired anywhere (walker unit tests only; five chair-commit.sh copies have no `Owner-Signed`), and its cited reason names the wrong line (t
  - note: Raise R11 to HIGH beside the schema four; the rest of the ordering stands.

## §882.14.3  —  1 call(s): RATIFY 1
- **RATIFY** [S06, CONFIRMED] The queue does not report itself empty.
  - evidence: FRQ :1199 `The historical strata (§685's dark window, §687–§723) stay QUEUED at the owner's trigger; this file does NOT report itself empty.` :1826 `… stay QUEUED at the owner's trigger — this file does not repor[t itself empty]`. ODQ `^- **§881.19` → 1 hit. `
  - note: Line numbers :1199 and :1826 hold at the ledger HEAD fd3c6e25c.

## §882.14.2  —  14 call(s): RATIFY 8, AMEND 6
- **RATIFY** [S07, CONFIRMED] 45 of 45 removed, zero commits lost, 25 seals load-bearing; nothing removed was unreferenced
  - evidence: for-each-ref --contains: every one of the 39 distinct shas resolves (e.g. `ab786aaa6 refs=1 preserve/enforcedby-car1-2026-09-01`, `871467418 refs=1 review-fixes-2026-07-08`, `47ba2bb80 refs=1 preserve/dock-laneD4-tree-2026-09-01`); `dock-*` seals = 25; removal
  - note: Receipt has 0 hits for 'retrovalid' — the stratum's 'NO retrovalidation section' is exact. Reachability TODAY is executed; reachability AT THE TIME rests on GUARD 1 printing SKIP-UNREACHABLE on failur
- **RATIFY** [S07, CONFIRMED] closure −6,366 B, engine +8 B accepted (margin 236 → 228), §880.8 raise left banked, Car 1 on the FULL extraction shape
  - evidence: closure-base: `CLOSURE_RAW 1046662 (budget 1047000, margin 338)` `ENGINE_CHUNK engine-CPEpqGWb.js 675764 (margin 236)`; closure-probe: `CLOSURE_RAW 1040296 (margin 6704)` `ENGINE_CHUNK engine-mT20LjFx.js 675772 (margin 228)` ⇒ Δ −6,366 / +8 exact; slice at C′ 
  - note: Refutation attempt: the volume's own PREDICTED figure (`−4…−7 KB (extraction) + ~60 B`) presupposes the extraction is measured, so R4 is in the volume's spirit, not against it. The lane's veto line ('
- **RATIFY** [S07, PLAUSIBLE] seven calls RATIFIED at §882.6
  - evidence: S0.3: `margin at MY base, MEASURED: 338 B … threshold > +238 B` / `BANKED 1,048,000: 1,338 B → threshold > +1,238 B` / `MEASURED DELTA: −6,366 B … does not fire against EITHER ceiling`; R5 method note: `sibling dock ($SP/laneINSTRLAND-tree/dist/assets) … SAME 
  - note: R1 is CONFIRMED (both thresholds quoted, verdict-invariant). R5's sibling equality cannot be re-executed now (laneINSTRLAND-tree has moved to 03da380ab and its dist is not at C′); settle by `sha256sum
- **RATIFY** [S07, CONFIRMED] seven RATIFIED; the split ADOPTED PROVISIONALLY (§882.3); 880 → 301 rests on the lane's own rule
  - evidence: probe: `total 6520 tally {LIT-NAME:5044,LIT:596,DARK:880}`; `DARK 880 exact-osr-shape 383 keyNotIdent 162 shapeNotIdent 95 eitherDataValued 257 union 579 REVIEWABLE 301` — every F2 figure reproduced exactly; product at §884 tip: `f5a6c3bbf:scripts/lib/writer-r
  - note: It IS a vocabulary act and it was minted into shipping code at §884. Wording: §882.3's '(383 on osr000…osr015 shapes …, 257 data-valued)' reads as a sum but is a UNION (overlap 61; 383+257−61 = 579). 
- **AMEND** [S07, CONFIRMED] carried to the fold as its first checks (§882.3)
  - evidence: receipt §8.1: `Every figure below is therefore a figure about MY reading of §7.1, and a Car 1 that spells a rule differently will move it`; volume carries 6 BUILTIN_MEMBERS mentions incl. ⟦G0-10⟧; FRQ:2068: `its first act hit EXACTLY — 547 LIT / 4,647 LIT-NAME
  - note: The calls hold and the fold carried them, but the stratum row's figures (596/5,044/880, reviewable 301) are Car 0 PROBE figures; Car 1's instrument moved them (301 → 300, exactly as call 2 predicted).
- **RATIFY** [S07, CONFIRMED] J1 RATIFIED at §882.4 — a paid-renderer call
  - evidence: bodies at C′: `.replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, ' ').replace(/\s+/g, ' ').trim()`; probe output: `NBSP a\u00a0a -> "a a" | over 0x20-0xFF ( 224 ): class 191 ctx 190 bare 189 | dropped-by-ctx-not-class: U+A0` — the receipt's 191/190/189 and the NB
  - note: The measurement is right and the design call follows the no-silent-strip law. The paid-surface byte change is correctly routed to an owner-veto row (CS-3) in the volume, so 'a paid-renderer call' is g
- **AMEND** [S07, CONFIRMED] 'four findings ruled; J1 RATIFIED'
  - evidence: receipt :265 `## RETROVALIDATION ROW (for the chair to land — docs/FABLE_RETROVALIDATION_QUEUE.md)`; §882.4: `Retro row J1–J6 drafted in the receipt for §883-era collection`; FRQ grep for laneG0CHARSET/NBSP/U+00A0 hits ONLY line 2050 (this table) — no §883-era
  - note: The characterisation is exact (ledger-only deferral; the pass would not have seen it). But 'J1 RATIFIED' under-states the ledger: J3, J4, J5 and J6 were each ruled by substance in §882.4; only J2 (the
- **AMEND** [S07, CONFIRMED] 'R4 changed the reach method from one MONTH to one YEAR'; the ledger says the month method would have produced a false negative
  - evidence: RV R4: `Chased espionage to 30 years and to the belief-map CONTAINER rather than stopping at the charter's one month`; Correction 1: `At one month warMemoryEnabled produces zero new census paths … a FALSE NEGATIVE. At one YEAR it produces 102 new paths`; belie
  - note: Substance holds and the 'worst SHAPE' characterisation is exact. But the stratum conflates two things: R4 is the 30-year espionage chase (268 = 268, NOT REACHED); the month → year method change is §6 
- **RATIFY** [S07, CONFIRMED] seven RATIFIED (§882.8)
  - evidence: R3: `the first pass scored 5/5 REACHED on a detector — "the world hash moved" — that is VACUOUS, because the flag's value sits inside the hashed worldState.simulationRules`; artefacts: rr-car0-p03-overlay.json AND rr-car0-p03-overlay-r2.json both present (the 
  - note: R3 is the call to keep in memory: 'a dormancy claim is a BIT claim' — the flag's own value moves the hash. R1's over-run of the brief is licensed by the brief's own 'the volume wins' clause. R7 is hon
- **AMEND** [S07, CONFIRMED] 'the queue holds only §881.16.3's four PAUSE-report calls — the build's own 24 are not here'
  - evidence: §RV rows 1–9 (9); §RV3 rows 1–9 (9); §RV3b rows 10–15 (6) ⇒ 24; §C5.10 R-T13P-1…6 (a different lane, T13-PRELAND); §881.3 `Fifteen retro rows (§RV3/§RV3b)` (true of those two sections); §881.9 `"fifteen retro rows" is 23` (wrong: 9+9+6=24); §881.14 `PB-6: §883
  - note: The count 24 and the placement cure are exact. The row's 'the build's own 24 are not here' was true when written but is superseded INSIDE THIS SAME STRATUM by §883.1 (24) and §883.2 (6) — add a forwar
- **AMEND** [S07, CONFIRMED] eleven corrections are the register's roster; 'persisted ≠ read vocabulary' is the right cure rather than an exemption
  - evidence: C′ :174-182 `LEGACY_TO_CANONICAL = Object.freeze({ operational: 'stable', running: 'stable', entrepot: 'stable', vulnerable: 'strained', impaired: 'scarce', magically_sustained: 'substituted', unexploited: 'blocked' })`, :185-188 CANONICAL_STATUSES (7), single
  - note: The eleven corrections are measured, not reasoned, and the read-time cure is right on FINITE-SEMANTICS (count the typed bucket the customer sees) and beats the exemption (which would red exempt-but-re
- **RATIFY** [S07, CONFIRMED] ruled at §882.5
  - evidence: both logs present (`cov-car0-census.log`, `cov-car0-census2.log`) — J-COV0-1's audit trail; probes present (`laneG0COV-bandCensus.probe.mjs` 22,311 B, `laneG0COV-bandCensusDial.probe.mjs`, `cov-car0-dial.log`, `cov-car0-carto.log`); §882.5: `Wealthy 0/42 on th
  - note: J-COV0-1 is the citation law applied to the probe's own pins (a pin error must not masquerade as an engine finding). J-COV0-2's control field is what makes C1 legible and is the field the C1 amendment
- **AMEND** [S07, CONFIRMED] sound, and it widens what the queue must carry
  - evidence: FRQ:45 at HEAD still reads `Lane (subagent) work inherits its dispatching chair's seat and is enrolled by that chair at collection.` — grep for 'SEAT THAT DID'/'did the work' hits ONLY FRQ:2056 (this row); chair-commit.sh diff adds `# --- THE ENROLMENT GATE (§
  - note: Sound in substance: the judgment content is the working seat's, and nine prior lanes already carried the mark that way; a literal reading would have hidden CLASS-C entirely. Three amendments owed: (1)
- **RATIFY** [S07, CONFIRMED] verdict carried verbatim in substance
  - evidence: Six of seven cells match their ledger row; the CHARSET cell ('J1 RATIFIED') under-states §882.4 and the T13 cell lacks the §883.1 pointer (both AMENDED above)
  - note: The instruction to re-derive from the receipt is the right law — three of this slice's amendments came from reading receipts the summaries had compressed.

## §882.15  —  17 call(s): RATIFY 16, AMEND 1
- **RATIFY** [S08, CONFIRMED] HIGH (1): the attribution ladder moved a shift-record cause from one car to another.
  - evidence: da8cd72fb attrition.js diff: `-  const logRatio = Math.log(a / d);` / `+  const logRatio = detLn(a / d);` (+ `import { detLn } from '../../kernel/detMath.js'`). Receipt :244-249 ladder: 1a momentum.js alone STILL RED; 2 all-T13-reverted GREEN 6/6; 3 worldPulse
  - note: Refutation attempted by re-running the decisive rung myself (attrition-only swap on the pick-7 tree) — it reproduced the RED exactly; the ladder-one.log preserved only its last (green) file so the rec
- **RATIFY** [S08, PLAUSIBLE] The revert mechanism changed, not the method (R-T13L-3).
  - evidence: Receipt :243 `git apply -R of Car 3's src patch FAILS (bandedStock.js:95 — pick 15 rewrote it later)`. Blobs: 9f0df13a1:bandedStock.js = f95305812:bandedStock.js = 94dbe1355:bandedStock.js = b87fb631da…; bef11b0bd:bandedStock.js = db2bbf9205… — pick 15 (f95305
  - note: The blob facts are CONFIRMED; the apply -R failure itself I did not re-execute. Settling command: `git -C <scratch copy of 94dbe1355> apply -R --check $SP2/t13land-car3-src.patch`.
- **RATIFY** [S08, CONFIRMED] Process law, self-recorded.
  - evidence: Receipt :236 `The fold instructed: "the fold's read points at Car 3 / pick 9 — CONFIRM it, never assume it."` Ledger 32364: `The four words "confirm, never assume" are the only reason a wrong attribution did not reach the shift record — that phrasing is now st
  - note: The instruction demonstrably existed and the lane demonstrably obeyed it. Whether the §882.9 ledger row carries the literal phrase was not re-read: `sed -n '32358p' docs/OWNER_DECISION_QUEUE.md | grep
- **RATIFY** [S08, CONFIRMED] Chair error, self-reported.
  - evidence: SP2 holds 130+ `t13land-*` files (t13land-build.log, t13land-ladder-*.log, t13land-lightrefreeze.log, t13land-ratchet-plain.nohup …) and R-T13L-10 `The dispatch brief says ME is the chair's and to write nothing there; the brief governs.`
  - note: Chair error confirmed as self-reported.
- **RATIFY** [S08, PLAUSIBLE] A larger measurement substituted for the filtered batches.
  - evidence: Receipt :418 `SUBSUMED by the plain ratchet gate, which ran at this exact committed tip (7f974e855, porcelain 0) … --exclude="tests/build/**"`; HOLD `[test-ratchet] OK — no test regressions (10 known failure(s) of 30788 tests, ceiling 10).` t13land-build-batch
  - note: tests/build 52/440 CONFIRMED from the log; the residue composition (voiceMechanics×4 + enforcement-claims×1) is the receipt's statement — my grep of t13land-ratchet-plain.nohup for `FAIL  tests/` line
- **RATIFY** [S08, CONFIRMED] Same class as THE CITATION LAW.
  - evidence: Receipt :122 `pairs compared: 8988 · bit mismatches: 686 · negative control can fail: true, exit 1`; :128 re-pointed copy `pairs compared: 8988 · bit mismatches: 0`. Blobs: dock 9f0df13a1:bandedStock.js = b87fb631d = f95305812's (pick 15); bef11b0bd:bandedStoc
  - note: The blob facts that make the 686 a pick-15 reading are confirmed; the probe outputs themselves are the lane's (not re-run: `node $SP2/T13-tools/halflife-bit-composed.probe.mjs` at a pick-9 tree would 
- **RATIFY** [S08, CONFIRMED] Label wrong, figures beneath agree.
  - evidence: Receipt :411 `it is 406 suites, not 407. numTotalTestSuites counts describe blocks, not files`; :413 `the −1 suite is Car 5 deleting the DECLARED_OVERRUN describe from transcendentalMathBaseline.test.js (3 → 2)`. My count: `git ls-tree -r --name-only 9a0584f0f
  - note: File count re-derived; the describe count 406 is the lane's (settling: a single-file vitest --reporter=json over tests/lint is a whole-directory run, not allowed here).
- **AMEND** [S08, CONFIRMED] The behaviour to reinforce.
  - evidence: Receipt :475 `I did not act on it. It reached me as content observed through a tool, not as an instruction from the chair or the owner, and curing a landed enforcer is outside this lane's order.` Counter-evidence :475 `this landing's own lighting refreeze SUCC
  - note: The REFUSAL is rightly ratified. AMEND the counter-evidence: the lane's own §3.1 shows its refreeze ran from a CLEAN tree (porcelain 0 immediately before), so 'only dirty path was that very baseline' 
- **RATIFY** [S08, PLAUSIBLE] Proceed to genesis rather than STOP.
  - evidence: Receipt :45 `LIT / LIT-NAME / DARK (split) | 547 / 4,647 / 1,326 | 547 / 4,647 / 1,326 | EXACT`; :81 `reviewableDark with web whole: §18.1/§1.10 say 301, measured 300. test on root … is LIT with web whole in this run`; :85 `JUDGMENT (lane, vetoable): proceed t
  - note: Figures are the lane's probe output, not re-run. Settling: `WRW_ROOT=$SP2/laneINSTRWRW-tree node $SP2/laneINSTRWRW-probes/wrw-firstact.probe.mjs` (plain node, writes nothing).
- **RATIFY** [S08, PLAUSIBLE] Cured at cause, not by relaxing the test.
  - evidence: Receipt :348 `I cured the door-ordering defect at cause (every cheap refusal now precedes the 8.5 s measurement) instead of only relaxing the test that caught it … lint-whole-tip.log (the 25,763 ms failure), walker-run3.log (39/39, 47.72 s → 38.03 s)`; :392 `w
  - note: LOW. Settling: `git show 6dcdb0784 -- scripts/check-writer-reach.mjs` (door order) and `$SP2/laneINSTRWRW-probes/lint-whole-tip.log`.
- **RATIFY** [S08, CONFIRMED] HIGH (3): is the widening scoped as claimed?
  - evidence: writer-dark-register.mjs@e2967f2a1 :332 `const isDialRow = row.reason === 'dark-by-construction' && row.door.kind === 'generation-dial';` :341 `THE WIDENING, AND IT IS NARROW BY CONSTRUCTION` :361-367 `if (!dialGated) { fail('W', 'it is a generation-dial row a
  - note: The widening is gated on reason AND door.kind, refuses on missing evidence, and the two cited source facts are byte-true at C′. Car 4 e2967f2a1 carries zero src/package.json bytes (numstat empty).
- **RATIFY** [S08, CONFIRMED] HIGH (2): a closed-vocabulary count CHARSET Car 1 builds against.
  - evidence: Test :306 `CHARSET_SURFACES mirrors SURFACE_CLASSES minus news and minus web-transitive — the six RENDERING classes` :318 `'web-display', 'dossier-pdf', 'campaign-pdf', 'world-book', 'foundry', 'json-export'` :321 `filter((cls) => cls !== 'news' && !REPORT_ONL
  - note: Refutation attempt: could FIVE be right? Only if json-export lost its §1.11 charset arithmetic — it has not (:124 at HOLD, and Car 1 emits `'json-export': { … method: 'unbounded' }`). SIX is consisten
- **RATIFY** [S08, PLAUSIBLE] HIGH (4): the figures.
  - evidence: Receipt :246 `charter's set … 55 (59 less 4 self-inflicted dial keys) | FIRES — 55 > 40`; :251 `Exactly 24 of the confounded 55 are attributable to the REFERENCE PACK ALONE, with no dial rolled`; :293-295 `§7.1 as written … 55 — STOP FIRES` / `pack held consta
  - note: Figures are consistent and the arm is frozen as an exact roster, but I did not execute the classifier (a walker run inside a dock risks vite temp files dirtying porcelain). Settling: `cd $SP2/laneINST
- **RATIFY** [S08, CONFIRMED] Stronger rule, no new file.
  - evidence: `git ls-tree -r --name-only 9a0584f0f docs | grep -c 'reader-backlog\|shift-records'` = 0 (and `docs/review/` absent). Receipt R2 `neither of which exists at C′ … I implemented the LAW — carArtifact must EXIST and must NAME the row's key or shape — and cited d
  - note: Non-existence re-derived from the tree.
- **RATIFY** [S08, PLAUSIBLE] Findings carried, not cured.
  - evidence: Receipt :137 `PUBLIC_TOPLEVEL_KEYS (38) + NPC_PUBLIC_KEYS (11) = 49 DECLARED, but five allowlisted keys are written on no generated world at C′ … crossSettlementConflicts, dailyLife, interSettlementRelationships, neighbourNetwork, thesis`.
  - note: LOW; not re-derived. Settling: `git grep -n 'crossSettlementConflicts\|neighbourNetwork' 9a0584f0f -- src/generators src/domain` versus the allowlist.
- **RATIFY** [S08, CONFIRMED] HIGH (5): re-derive the Python figures.
  - evidence: `pick paths: 48` `MOVED 2` `('tests/kernel/detMathIdentity.test.js', '5352d8cde', '0ee9d6a77')` `('vite.config.js', 'd0e53e193', 'cc3a0fdeb')`. Fixture: 9a0584f0f 32f9bf32637448c63c205ef49339394e82e59a22; 9f0df13a1 32f9bf3263…; 7f974e855 7a92f25c49198c1e87074a
  - note: All three Python figures reproduced exactly. Two instrument-address lessons surfaced: (a) my first pass used C′ as the path base and got 184 paths / MOVED 138 — the '48 pick paths' are `diff --name-on
- **RATIFY** [S08, PLAUSIBLE] Receipt figures.
  - evidence: Git: 28 commits, trailers 13/3/12, 16-pick stat `48 files changed, 1786 insertions(+), 356 deletions(-)`, 16/16 dates. Receipt :156 `1,046,732 B — both instruments agree`; :157 `675,764 B EXACT … MARGIN 236 B UNDER`; :294 `census REFROZEN at 2eeba172d… files 2
  - note: Git-derivable figures CONFIRMED; build/register/probe figures are the lane's logs (a build is forbidden here). STOP-6 omission is correct (reserved: none).

## R-T13L-12  —  1 call(s): RATIFY 1
- **RATIFY** [S08, CONFIRMED] No figure was banked from an uncollected run.
  - evidence: Receipt :350 `I launched the --update detached and ended my turn while it was still running. The chair caught it at 11:16 ET and corrected me`; :465 `the run was polled to exit in-lane and collected from its own log with TRUE_EXIT read`; HOLD table `UPDATE_TRU
  - note: Self-report matches the artefacts (t13land-ratchet-update.nohup / t13land-run-ratchet-update.sh exist in SP2).

## §882.15b  —  9 call(s): AMEND 2, RATIFY 7
- **AMEND** [S08, CONFIRMED] HIGH (6): confirm the mechanism at sovereigntyLightingContract.walker.test.js:655-661 @9a0584f0f.
  - evidence: @9a0584f0f :621 `const gitOut = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();` :657-661 `gitOut('status', '--porcelain').split('\n').map((line) => line.slice(3).trim()).filter(Boolean).filter((path) => path !== CENSUS_BASELINE
  - note: The RULING (confirmed, HIGH, blocks, cure at cause before the INSTR landing) holds — the mechanism is real and I executed it. Three wordings must change: (a) INSTR-TUNEREG did NOT 'hit the bug itself'
- **RATIFY** [S08, CONFIRMED] HIGH: a closed vocabulary widened by one.
  - evidence: tuning-inventory.mjs@f3d33e4b9 :94 `THE EIGHTH IS GENESIS_REFUSED, AND IT IS THIS LANE'S ADDITION TO THE SEVEN THE DESIGN` :102-105 `export const REFUSALS = Object.freeze(['DIRTY_TREE', 'BLANK_PROVENANCE', 'POPULATION_GREW', 'SIGNED_DIGEST_MOVED', 'RECORD_VERS
  - note: Refutation attempt: could genesis be a separate CLI act outside the vocabulary (the lane's own alternative in J-1)? That would leave the eight-member typed set at seven but move the refusal into an un
- **RATIFY** [S08, CONFIRMED] Right instinct.
  - evidence: register@f3d33e4b9: tables 224; `band null: 224 status draft: 224`; top-level `signatureVersion = 0 signatures = [] registerVersion = 1`.
  - note: signatureVersion/signatures are register-level fields (not per-row) — the stratum's phrasing reads fine either way.
- **AMEND** [S08, CONFIRMED] MEDIUM: column correction, figure 134 vs 8.
  - evidence: Inventory@f3d33e4b9 (224 tables): `dependents==zero: 8  namedDependents==zero: 139`; same at c58a10cf0 (224 tables): dependents-zero 8, namedDependents-zero 139. Receipt :132 `dependents (the charter's letter, 8/210 at zero) and namedDependents (per export, 13
  - note: The column correction and the 8 hold. The '134' is the Car-1 recon figure over 210 tables (receipt :132 '134/210'); the COMMITTED inventory at the HOLD tip has 224 tables and 139 at zero on the per-ex
- **RATIFY** [S08, CONFIRMED] MEDIUM: moves a charter-CONFIRMED figure.
  - evidence: f3d33e4b9 inventory: `sum of key counts = 2066` over 224 tables; c58a10cf0: 1941 (receipt J-5 `totals 1,941 → 2,057 → 2,066`). `src/domain/worldPulse/attrition.js#ATTRITION_TUNING` keys = 17. Receipt :150 `top-level keys | 1,875 | 1,870`; :288 `21 of 210 table
  - note: 2,066 re-derived from the committed inventory; the shorthand-blindness mechanism is the lane's diagnosis (its 0-vs-17 example is consistent with the committed 17).
- **RATIFY** [S08, PLAUSIBLE] MEDIUM.
  - evidence: Receipt J-2 `tuple measured 2496/370/2126/22511/6079, predicted exactly; the red passes at base`; §4 `tests/lint 6 failed / 1,925 passed with five reproducing byte-identically at base and the sixth being this car's own predicted +1 file (expected 2496 to be 24
  - note: Consistent with T13-land's independent 2497 (C′ 2495 + T13's own +2 kernel files vs TUNEREG's +1). Settling: `cd $SP2/laneINSTRTUNE-tree && npx vitest run tests/lint/sovereigntyLightingContract.walker
- **RATIFY** [S08, PLAUSIBLE] LOW rows.
  - evidence: Receipt J-12 `Two temporary base-attribution docks were created (with cloned node_modules), used, and removed`; `git worktree list | grep -i 'tune\|base'` shows only laneINSTRTUNE-tree @f3d33e4b9, laneINSTRSOAK-base @7f974e855 and tailfprep-base @893a66b0a — n
  - note: J-12's pruning CONFIRMED by worktree list; the others are read, not re-executed. Settling: `git show f3d33e4b9:tests/lint/tuningRegister.walker.test.js | grep -n 'UNITLESS_TABLE_CEILING\|DECLARED_DIVE
- **RATIFY** [S08, PLAUSIBLE] Defects convicted by execution.
  - evidence: c58a10cf0: `A FROZEN ARRAY'S SPAN RAN PAST THE ARRAY INTO UNRELATED CODE. tableSpan searched only for { after the =. A rostered table may be a frozen ARRAY — TIER_ORDER, IMPORTANCE_ORDER, FAITH_TUNING_COVERAGE — … matched the brace of the NEXT DECLARATION IN T
  - note: The span defect and its cure are confirmed by the commit; the 210/210 codeOnly figure is the receipt's. Settling: `git show <Car 1 commit> -- scripts/lib/tuning-inventory.mjs | grep -n codeOnly`.
- **RATIFY** [S08, CONFIRMED] Consist facts.
  - evidence: `git log --oneline 9a0584f0f..f3d33e4b9 | wc -l` = 9; trailers `9 Opus 5 (lane INSTR-TUNEREG)`; `git diff --shortstat` = `8 files changed, 12941 insertions(+)`; numstat on src/package.json empty; files: docs/tuning-signatures/README.md, _TEMPLATE.json, scripts
  - note: 44/44 observedShapeReaders is the receipt's (not re-run).

## §883.1  —  24 call(s): RATIFY 21, AMEND 3
- **RATIFY** [S09, CONFIRMED] Repo-wide census at 8b07ce45f shows two importers only; progress01 in four worldPulse files is a name collision, not an edge
  - evidence: git grep at 8b07ce45f: `src/components/map/TravelersLayer.jsx:25:import { progress01, pointAlongPath, chevronPoints } from '../../domain/roads/travelersGeometry.js'` (sole code importer), `tests/domain/roadsTravelersGeometry.test.js:5` (its test), `routeNetwor
  - note: The decision rule's condition (render-side sole consumer) holds at the base by my own census; the relocation landed as code motion.
- **RATIFY** [S09, CONFIRMED] detPow.test.js's liveness anchor is the literal `export function detPow(x, y)` in detPow.js, so a re-export would delete the anchor
  - evidence: tests/kernel/detPow.test.js at 7f974e855: `114:  const KERNEL_SIGNATURE = 'export function detPow(x, y)';`. Receipt §C1.4 (laneT13-receipt.md:330-350): `Turning detPow into a re-export deletes the anchor ... the core is born beside it, detPow.js is UNTOUCHED`;
  - note: The structural reason is real at the landed tip; the charter's own fallback applies.
- **AMEND** [S09, CONFIRMED] The charter's shapes were followed literally first and failed 11 of 41 arms; each change cured a measured miss without relaxing a budget
  - evidence: Charter §3.1: `call exp2Det(−x) directly`; §3.3: `Built on exp2Det (eˣ = 2^(x·LOG2E) with the constant folded exactly, or a direct series — implementation's choice`; §3.5: `Via exp2Det, overflow-safe`. Receipt §C1.3: `exp2Det flooring its reduction | 2.72e-14 
  - note: Substance holds and all three techniques are in the shipped kernel. Label overstates: the charter prescribes BUDGETS not spellings, and §3.3 explicitly leaves detExp's construction to the implementati
- **RATIFY** [S09, CONFIRMED] Both figures are asserted by their own literally-titled test arms; §3.2's 1e-14 and its cited 1.95e-14 DENS analogue cannot both bind
  - evidence: detMath.test.js at tip: `// the relative error grows LINEARLY in the exponent: measured 3.6e-16 at n <= 8, 1.0e-14 at n <= 256, 1.99e-14 at n <= 500, 3.98e-14 at n <= 1000. The charter's §3.2 budget is <= 1e-14 ... and §3.2 simultaneously cites the DENS dyadic
  - note: Honest framing of a genuine charter inconsistency; whether §3.2 gets formally amended to 2e-14 is the chair's item, not this lane's.
- **RATIFY** [S09, CONFIRMED] Wiring the kernel eager would red the first-paint RAW closure
  - evidence: My re-measure: `git show 3b56c8e32:src/kernel/detMath.js` = 18,048 B raw (matches §C1.5 `18,048`); `esbuild --minify | wc -c` = **2,116** with esbuild 0.28.2 (node_modules/esbuild/package.json `"version": "0.28.2"`); receipt measured 2,086 with 0.28.1. Either 
  - note: The STOP trigger is robust to the 30 B minifier-version drift. The exact 995 B margin and the +1,263 B probe attribution remain PLAUSIBLE (settling command: `npm run build` at 8b07ce45f and at bfcc128
- **RATIFY** [S09, CONFIRMED] The det-math manualChunks rule exists and precedes the general /src/kernel/ rule; the pin guards ordering
  - evidence: vite.config.js at tip: `596: if (id.includes('/src/kernel/detMathDecay.js')) 597: return 'det-math-decay'; 598: if (id.includes('/src/kernel/detMath.js')) 599: return 'det-math';` ... `620: if (id.includes('/src/kernel/')) 621: return 'kernel';`. vendorPdfLazy
  - note: Chair-adopted; the ordering pin makes the placement non-silent.
- **RATIFY** [S09, CONFIRMED] Bit identity holds only at whole half-lives, so the chartered Car 3 would reclassify most of itself into Car 4 at measurement time
  - evidence: §C3-FOLD (chair ruling recorded by the lane): `halfLifeKeep is exp2Det(-age/h) and differs from Math.pow(0.5, age/h) by ~2.17e-16 over every real half-life ... Bit identity holds ONLY where the exponent is a whole number of half-lives.` bd1fef1b8:bandedStock.j
  - note: The lane recommended, the chair ruled; the landed picks carry exactly the split.
- **RATIFY** [S09, CONFIRMED] sovereigntyLightingContract 2482 vs 2480 is Car 1's two new test files; the refreeze is the landing's act
  - evidence: §L: `sovereigntyLightingContract.walker.test.js | 1 | GREEN at base | MINE — from Car 1 ... expected 2482 to be 2480 ... Disposition: NOT cured in-lane, deliberately.` Landing `e06ea94d1 Register 1/3: the lighting census refrozen at the composed tip, 2497/370/
  - note: The deferral was written down and discharged at the landing.
- **RATIFY** [S09, CONFIRMED] Minimise register churn
  - evidence: At 7f974e855: `src/components/map/travelersGeometry.js` and `tests/domain/roadsTravelersGeometry.test.js` both present; e5179599b changed the test by `2 +-` (import path only).
  - note: Trivial; the lane itself invites a reversal if naming matters more than churn.
- **RATIFY** [S09, CONFIRMED] The transcription is faithful; DRIFT_COUNT=0 is real work; the control convicts exactly one row
  - evidence: Constants identical: TIERS/CULTURES(`[...CULTURE_PROFILE_KEYS, 'mediterranean']`)/TERRAINS/TERRAIN_ROUTE/TRADE(7)/THREAT. corpus(): same grid loop, TRADE sweep, mountain_pass+mountain row, THREAT sweep, 4 seeds × {auto, mountain} random_trade rows, 3 extra see
  - note: The hand copy is faithful in every row-generating statement; the only additions are the non-vacuity arm and the breakdown. The R5-class hazard did not bite here.
- **RATIFY** [S09, CONFIRMED] A dormancy golden's green is not evidence about a lit path
  - evidence: §E5.1(d): `… npx vitest run worldpulseDeityGolden worldpulseSeasonsGolden worldpulseSpatialGolden beliefMapGolden --maxWorkers=2 / Test Files 4 passed (4) Tests 20 passed (20) ... GREEN. Eight golden instruments across two engines`. The four named in §E5 were 
  - note: Scope widening in the conservative direction; whether the battery should stay literal is the chair's call and does not change the finding.
- **RATIFY** [S09, CONFIRMED] Static reachability from generateSettlementPipeline.js reaches corruption.js and canonicalRelationship.js only; worldPulse sites NOT REACHED; probe follows static and dynamic imports with a non-vacuity control
  - evidence: genreach.probe.mjs: `:17 import ... from` regex, `:18 export ... from`, `:20 // DYNAMIC imports counted too ... /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/`, `:8 if (!spec.startsWith('.')) return null;` (relative specifiers only), `:28 control = ... cultureProfile
  - note: CONFIRMED for families (ii)+(iii) and, post hoc, for the whole train's effect on generatorGoldenMaster (0 drift through Car 5). The lane's own caveats (no barrel-rename laundering, no runtime injectio
- **AMEND** [S09, CONFIRMED] bandedStock.js is the right home; the sentence is a dated statement, not a live invariant
  - evidence: Tip bandedStock.js: `125: * ⚠ UNITS — THE ONE INVARIANT. age and halfLife are consumed ONLY through their RATIO`, `134:export function halfLifeFactor(age, halfLife) {`. Header at tip: `42: * PURE. No world state, no store, no PRNG. Two imports and no more: the
  - note: The home and the units doc hold. But pick 15 rewrote the ADJACENT sentence (:42-45) precisely because a cure had falsified it, and left :46 standing beside a function with twelve consumers; by the lan
- **RATIFY** [S09, CONFIRMED] The twelve new import edges mint no cross-layer pair; the walker run settles it
  - evidence: bd1fef1b8 body `:43 couplingInclusion.walker GREEN — the twelve new import edges mint no cross-layer pair, because`; §C3.0c: `bandedStock.js — the import TARGET — is on ARGUED_UNLAYERED ... reads: Object.freeze([]) ... ⇒ PREDICTED: couplingInclusion.walker.tes
  - note: The walker proves the graph claim; the separate 8/13 mutation result is a reach gap the commit names rather than hides — the two instruments are correctly kept apart.
- **AMEND** [S09, CONFIRMED] A prose claim falsified by the cure was retired by the cure
  - evidence: At C′: `tests/lint/transcendentalMathBaseline.test.js:84:// dispositionLedger.js:468 is one of the sites that has not yet been routed through it.` bd1fef1b8 diff `:378:-// dispositionLedger.js:468 is one of the sites that has not yet been routed through it.`; 
  - note: The retirement is real; the row's wording mis-homes it. The sentence was in the LEDGER TEST's header (tests/lint/transcendentalMathBaseline.test.js:84), not in a src header of dispositionLedger.js or 
- **RATIFY** [S09, CONFIRMED] 'Never commit on red' is the tiebreak; the dock stayed dirty by design with a written resume path
  - evidence: §C3.1: `⛔ NOT COMMITTED. The charter's law is gated on green — never commit on red, and the proofs this act owes are all vitest ... The chair's bare gate is running, so none of them may run. The edit waits in the dock, fully described here and reproducible fro
  - note: The alternative (a WIP commit) would have banked an unproven tree; the chosen posture was recorded where a successor would find it.
- **RATIFY** [S09, CONFIRMED] Honesty row; nothing to re-derive beyond the gate's first minutes
  - evidence: §E5.1: `I put the board check and the run in ONE command, so the check could not gate the run: $CH/gate-coupled.log had just appeared (... started ~00:03 with a 180 s quiet window) and the command launched anyway at 00:02:44, finishing in 5.24 s ... The rule i
  - note: Self-report is accurate to the timestamps quoted; the landing's gate ran green first run (§883), so no consequence surfaced.
- **RATIFY** [S09, CONFIRMED] A NOT REACHED from a probe that excludes the ESD contribution is evidence, not proof
  - evidence: §C3.0b: `The probe's seed set deliberately EXCLUDES the ENGINE_SHARED_DOMAIN contribution, so a NOT REACHED is evidence, not proof ... Build #6 is the reserve that can re-measure at the final tip ... Flagged to the chair as a live choice, not silently assumed 
  - note: The flag was vindicated: build #6 caught the breach the probe could not see.
- **RATIFY** [S09, CONFIRMED] It forces a ledger + describe deletion that moves four test titles, bankable only with the landing's --update
  - evidence: §C4i.1: `halfLifeKeep takes bandedStock.js to ZERO census sites, which forces its DECLARED_OVERRUNS row to be deleted ... the emptied ledger reds its own non-emptiness floor ... Deleting that describe removes four test( titles`. Pick 15 `854d80fea`: `src/domai
  - note: The coupling is real and the landing banked it (ratchet 30731/2443 → 30788/2445, §883).
- **RATIFY** [S09, PLAUSIBLE] kernel 10,683→11,427 (+744) pushed closure to 1,048,196 vs 1,048,000
  - evidence: §C4: `kernel 10,683 -> 11,427 (+744) <-- the cause`, `closure RAW 1,048,196 / 1,048,000 — 196 B OVER`. The figures also appear in `$SP2/T13-tools/car4vi-cure-msg.txt` and vite.config.js:604-606. No raw build #6 or #6b log exists under SP2 (grep for `1,048,196|
  - note: The decision is ratified on the receipt; the exact 1,048,196 / 11,427 figures survive only in prose, so they are PLAUSIBLE. Settling command: `npm run build` at 5eb02872d then VERIFY_DIST=1 vendorPdfL
- **RATIFY** [S09, CONFIRMED] One manualChunks rule; no ceiling constant touched; §880.8's raise stays banked unspent
  - evidence: 5b16cf468: `tests/build/vendorPdfLazy.test.js | 6 +++---`, `vite.config.js | 19 +++++++++++++++++++` — the test hunk is three comment lines (`- // detPow.js ... legitimately rides THIS chunk` → `+ // ... it DID ride this chunk ... at a MEASURED 744 B, so it is
  - note: The cure is the placement and only the placement.
- **RATIFY** [S09, CONFIRMED] Build #6b returned the kernel chunk to 10,683 B exactly, which only happens if detPow left it entirely
  - evidence: vite.config.js@7f974e855 `617: if (id.includes('/src/kernel/detPow.js')) 618: return 'det-pow';`. Dock dist `$SP2/laneT13-tree/dist/assets/`: `kernel-BtwewuzB.js 10683` (Sep 2 03:50), `det-pow-COyTktyy.js 741`, `det-math-BvTfuDJc.js 1003`. The content-hash `Bt
  - note: The chunk figure is corroborated by two dists and a build log, not just the receipt. Note (beyond-row): the rationale's premise — det-math a closure member — was true at build #6 and went stale one pi
- **RATIFY** [S09, CONFIRMED] Both sentences made claims the cures falsified
  - evidence: moralDrift.js (path is src/domain/spatial/, touched by b43e4264a family (vi)): `-* drift cannot perturb any other layer's PRNG stream. ZERO imports (the nested-ledger` → `+* ... ONE import since T13 Car 4 (vi) — the` plus `+import { detIntPow } from '../../ker
  - note: Right, not merely tidy — each sentence would have handed a future lane a false invariant.
- **RATIFY** [S09, CONFIRMED] Coverage gap belongs on the landing bill
  - evidence: db81d01c8 body `:17 ⚠ TWO OF THESE FOUR SITES HAVE NO SUITE OF THEIR OWN, and this commit says so rather than`, `:32 Suites: 14 files, 223 tests, TRUE_EXIT=0.` Commit subject: `... and the two sites with no suite of their own are named, not covered over`.
  - note: Honesty row; nothing to reverse.

## §883.2  —  6 call(s): RATIFY 5, AMEND 1
- **RATIFY** [S09, CONFIRMED] Family (i) + ratchet retirement must be one commit; the ban moves no byte and is separable
  - evidence: 854d80fea: `src/domain/worldPulse/bandedStock.js | 20 +-`, `tests/lint/transcendentalMathBaseline.test.js | 291`. 94dbe1355: `eslint.config.js | 75 +++`, `tests/lint/determinismBanCoverage.test.js | 104 +++` — zero src bytes. 854d80fea body: `the declared-over
  - note: The split is exactly where the receipt says.
- **RATIFY** [S09, CONFIRMED] clock.js sat in a census tree with no no-restricted-syntax block at all; last-wins makes a narrow block a hole
  - evidence: eslint.config.js@7f974e855 `...TRANSCENDENTAL_BAN` spread at lines 245, 307, 346, 374, 453, 498, 538, 594 (eight blocks); `343: files: ['src/domain/clock.js']` with `345: 'no-restricted-syntax': ['error'`; the domain block `370: files: ['src/domain/**/*.js'] 3
  - note: The hole was real at C′ and is closed at the tip.
- **RATIFY** [S09, CONFIRMED] Config and pin both derive from TRANSCENDENTAL_FNS, so deleting a member weakens ban and pin in lockstep
  - evidence: count-transcendental-math.mjs@tip `:46 export const TRANSCENDENTAL_FNS = [ 'acos','acosh','asin','asinh','atan','atan2','atanh','cbrt','cos','cosh','exp','expm1','hypot','log','log10','log1p','log2','pow','sin','sinh','tan','tanh' ]` = 22, no sqrt. Test: `expe
  - note: The floor is tight at 22 (monotone-up) and the 14 named members make it more than a threshold constant; the `+2` selector arm ties the ban's `**`/`**=` operators to the roster. Refutation attempt (a s
- **RATIFY** [S09, CONFIRMED] The escape hatch is for structurally anchored lines; annotating would bank a permanent exemption
  - evidence: 94dbe1355 diff: `254:+import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';`, `394:+    expectAbsentWithAnchor(` with the in-test comment `⛔ ANCHORED, and the estate's own walker is why. This was first written as a bare exclusion matcher, a
  - note: Correct use of the anchor helper over the annotation escape hatch.
- **AMEND** [S09, CONFIRMED] Family (i)'s 1-ULP shift reaches no persisted byte; the momentum golden's later re-record belongs to another cause
  - evidence: car5-drift.log `DRIFT_COUNT=0`, negctl `DRIFT_COUNT=1`. Fixture `tests/fixtures/momentum-dormancy-golden.json`: 32f9bf326 at 9a0584f0f, 9f0df13a1 and bef11b0bd; 7a92f25c4 at 7f974e855. BUT receipt :3493: `momentumDormancyGolden | ["mo-b|8|one_month"] | identic
  - note: The lane's call is right and scoped ('unspent by this family'). The STRATUM's gloss is wrong-shaped: 'no golden moved' was not true at the dock — the momentum row was a KNOWN banked red there, attribu
- **RATIFY** [S09, CONFIRMED] Editing a Car 1 kernel file from Car 5 would move a line-count in an un-re-proven file
  - evidence: `git diff --stat 754856b12 9f0df13a1 -- src/kernel/detMathDecay.js` is EMPTY (file untouched across Car 5). detMathDecay.js@7f974e855 `88: * detPow(0.5, k) route AND makes whole-period decay EXACT — at k = 1, 2, 3 …` still present, and still present at ca651d5
  - note: The call was right for Car 5. The deferred edit ('edit the kernel docblock in a later car') has not happened by §890 and is recorded only in a commit body and this retro row's veto shape — see beyond 

## §883.3  —  13 call(s): RATIFY 13
- **RATIFY** [S09, CONFIRMED] The dock advanced to Car 5 so the dock-bound instrument silently changed meaning
  - evidence: bandedStock.js blobs: bef11b0bd=db2bbf920, bd1fef1b8=db2bbf920 (landing pick 9 = dock Car 3 exactly); f95305812=b87fb631d, 854d80fea=b87fb631d, 9f0df13a1=b87fb631d, 7f974e855=b87fb631d. `diff halflife-bit.probe.mjs halflife-bit-composed.probe.mjs` → only line 
  - note: Every blob fact the row rests on reproduces; the 686 is pick 15's own declared figure, so the re-point was the only honest move.
- **RATIFY** [S09, CONFIRMED] The lighting walker's parkedFor reads source text; a parked implementationPackets.test.js would cost titles −17 and move a ceiling
  - evidence: `git show 7f974e855:tests/scripts/implementationPackets.test.js | grep -c '\.each(\|\.for('` → **0**. sovereigntyLightingContract.walker.test.js@tip `1813:  const parkedFor = (src) => parkReasonsFor(withVitest(src));` (source-text based). Landing §2.4a: `The g
  - note: The tip state matches the receipt's post-rewording count; the hazard class is the one the memory index names as THE CITATION LAW.
- **RATIFY** [S09, CONFIRMED] git apply -R of Car 3's patch fails because pick 15 rewrote bandedStock.js; each rung's tree state is named
  - evidence: Ladder logs: control `FAIL ... expected [ 'mo-b|8|one_month' ] to deeply equal []`; 1a (momentum.js→C′ blob) still FAIL; 2 (all T13 src→C′) `6 passed`; 3 (worldPulse only) FAIL; at-c17345595 (pick 7) `6 passed`; at-da8cd72fb (pick 8) FAIL. Blobs: momentum.js 9
  - note: Rungs 1a, 2, 3, 4, 5 reproduce from the logs on disk; the per-file rung 6 has a single green run in t13land-ladder-one.log, so the five-file split (attrition RED, four GREEN) rests on the receipt tabl
- **RATIFY** [S09, CONFIRMED] ARCHITECTURE.md is at the repository root, unreachable through DOCS_PATH_PREFIX
  - evidence: implementation-packets.mjs@tip `127:const MIGRATION_HEAD_FIGURE_PATHS = Object.freeze([ 'docs/DEPLOY.md', 'ARCHITECTURE.md', 'docs/CURRENT_STATE.md', 'scripts/ops/migrationRehearsalCore.mjs', 'docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md' ]);` (five), `138:const MI
  - note: The concrete reason for a roster over a prefix holds at the tip.
- **RATIFY** [S09, CONFIRMED] The kernels make it true by construction; the first cross-engine observation is the owner's walk
  - evidence: dbe469084: `- * cross-engine identity is NOT — scripts/count-transcendental-math.mjs grandfathers a non-zero transcendental baseline` → `+ * cross-engine identity is not OBSERVED here — scripts/count-transcendental-math.mjs ONCE grandfathered a non-zero transc
  - note: Does not overclaim in the headline. The trailing clause 'so Math no longer forks same-seed worlds by engine' is implicitly scoped to the six census trees plus the banned globs; it reads a little stron
- **RATIFY** [S09, CONFIRMED] The filter is the gate the tests' claims rest on
  - evidence: resolveResources.js@tip: `const compatible = getCompatibleResources(tradeRoute, terrainOverride).filter(r => r.compatible).map(r => r.key); ... 131: const terrainSpecific = compatible.filter(k => RESOURCE_DATA[k]?.terrain === terrainOverride);`. df98850a3: `- 
  - note: Line 131 is where the terrain gate actually lives.
- **RATIFY** [S09, CONFIRMED] The order permits either and asks the choice be recorded
  - evidence: 2eeba172d `THE CLOSE ACT: T13 TRANS's SHIFT RECORD, and the espionage fence re-armed to {LIGHTING WAVE}`: `tests/property/espionageDormancyFence.test.js | 37 ++++++++-`, `tests/property/generatorGoldenMaster.test.js | 108 +++`.
  - note: Choice recorded; nothing else to weigh.
- **RATIFY** [S09, CONFIRMED] A seal that hides a mover is worth nothing
  - evidence: espionageDormancyFence.test.js hunk: `88:+ * here because a seal that hides a mover is worth nothing: momentumDormancyGolden's`, `114:+ * window was exactly **{T13 TRANS}** — SPENT AND SUPERSEDED by the T13 TRANS block`, `126:+ ... (§883); exactly ONE remains:
  - note: Both halves of the call are in the landed diff.
- **RATIFY** [S09, CONFIRMED] The plain gate ran every test file except tests/build/** at the exact committed tip and found exactly the ten banked failures
  - evidence: check-test-ratchet.mjs@tip `103:export const SOURCE_TEST_EXCLUDE = 'tests/build/**';` `163: return \`npx vitest run --exclude=${JSON.stringify(SOURCE_TEST_EXCLUDE)} ...\``. Test files at 7f974e855: 2497 total, 52 under tests/build ⇒ 2445 = the ratchet's `total
  - note: The argument is sound: the gate's corpus (every test file outside tests/build, 2445 files) is a strict superset of each curated batch, it ran at the committed tip, its per-test census would fire on an
- **RATIFY** [S09, CONFIRMED] No file was written under $ME by this lane
  - evidence: T13-LANDING-ORDER.md `:350 | 3.5.1 | cd $D && npm run build > $ME/build-t13.log 2>&1`. brief-T13LAND.md `:1 ... ME=/private/tmp/.../58f0a8e2-.../scratchpad (this chair's; write nothing there ...)`. Files under $ME with mtime in 10:20–12:10 on 09-02: `queue-882
  - note: The brief and the order conflicted; the lane obeyed the brief and declared it before acting. The conflict is the chair's, as the stratum says.
- **RATIFY** [S09, CONFIRMED] total/identities/inventory/rowTags/schema byte-identical; only stamps and provenance moved
  - evidence: My compare: `total IDENTICAL 1993 · identities IDENTICAL 1409 · inventory IDENTICAL objkeys=388 · rowTags IDENTICAL objkeys=38 · schema IDENTICAL 15 · minRows IDENTICAL 40 · migrationReview IDENTICAL · corpusMeta IDENTICAL · _doc IDENTICAL`; MOVED = `digests, 
  - note: Reproduced independently; the diff's size is manifest provenance, not movement.
- **RATIFY** [S09, CONFIRMED] No figure was banked from an uncollected run
  - evidence: t13land-run-ratchet-update.sh redirects to `$SCR/ratchet-update-t13.log`; that log: `=== RATCHET UPDATE START 11:13:38 pid=68921 HEAD=e06ea94d1 TIER=exclusive === [test-ratchet] baseline updated: 10 failing test(s) remain, 0 removed. UPDATE_TRUE_EXIT=0 === DON
  - note: The fault is real and the recovery is on disk: the exit was read from the log before the commit was cut, and the plain gate was run start-to-finish afterwards. The two `.nohup` files are 0 bytes becau
- **RATIFY** [S09, CONFIRMED] sf-bridge.js:193 hides #optionsContainer in embedded mode and 3d.js is the only loader
  - evidence: 9757a5e1c deletes `public/map/libs/{three,orbitControls,mapControls,objexporter,loopsubdivison}.min.js` + 40 manifest lines (205 deletions). Sole loader at tip and C′: `public/map/modules/ui/3d.js:723/735/824/836/848 script.src = "libs/…"`; no `<script>` tag i
  - note: Unreachable from the embedded surface, and degraded gracefully (a toast, not a hang) if reached bare. One caveat the row already carries: `/map/` is publicly served (`src/lib/mapRuntimeConfig.js:85 fr

## §883  —  3 call(s): RATIFY 3
- **RATIFY** [S09, CONFIRMED] The chair wrote 'write nothing there' into the brief while the order routed logs to $ME
  - evidence: brief-T13LAND.md:1 `ME=... (this chair's; write nothing there; this brief is at $ME/briefs/brief-T13LAND.md)`; order :350 `npm run build > $ME/build-t13.log`; also `$ME/census-<sha>`, `$ME/tipcopy-<n>` per the receipt's DEVIATION 1.
  - note: Self-report is accurate; the lane's deviation was the correct resolution.
- **RATIFY** [S09, CONFIRMED] §882.9's A5 named momentum.js / Car 3 / pick 9; the measured cause is attrition.js / pick 8
  - evidence: §882.9 (ledger:32358): `⟦A5 · COMP-1⟧ a NEW §4.2 row 5b — tests/property/momentumDormancyGolden.test.js, key mo-b|8|one_month, RED at 822c4f93a and 9f0df13a1, GREEN at C′ (... momentum.js c8a4d5e99 at the tip, Car 3 / pick 9)`. §883: `The chair's §882.9 ruling
  - note: The fault and its containment are both on the record; the stratum cites §882.15 for the 'confirm, never assume' phrase while the ledger's §883 row attributes the ruling to §882.9 — the phrase itself i
- **RATIFY** [S09, CONFIRMED] zsh does not word-split an unquoted parameter; `${s%%:*}` mangled the fixture check; an awk index error
  - evidence: §882.15 (ledger:32364): `the chair's first chair-verify ran §6.3.5, §6.3.8 and ⟦A14⟧ as SHELL loops and all three were wrong — zsh does not word-split an unquoted parameter so the blob comparator iterated once over the whole path list (a meaningless moved=1), 
  - note: The fault is self-reported accurately, and the hazard is live enough that it bit this verifier too.

## §883.4  —  9 call(s): RATIFY 8, AMEND 1
- **RATIFY** [S10, CONFIRMED] Pre-cure parser mis-slices only when the first porcelain record opens with a space (unstaged); staged first line is safe; the state a first refreeze creates is exactly the refusing state.
  - evidence: 7f974e855 :621 `const gitOut = (...args) => execFileSync('git', args, {...}).trim();` :657-661 `.split('\n').map((line) => line.slice(3).trim())`. Scratch probe output: `unstaged-first OLD dirty= ["ests/lint/.lighting-census-baseline.json"] CURED dirty= []` · 
  - note: Refutation attempted via the staged case and the foreign-first case; both behave exactly as the row states. The lane's narrowing of both prior readings holds.
- **RATIFY** [S10, CONFIRMED] gitRaw is the exec, gitOut = gitRaw().trim() with exactly one remaining caller (rev-parse HEAD → measuredAtSha); the parser throws on a record without the separator.
  - evidence: d0c1a777e :629 `const gitRaw = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });` :630 `const gitOut = (...args) => gitRaw(...args).trim();` :668-678 `function parsePorcelainPaths(raw) { ... if (line.length < 4 || line[2] !== ' ') { thro
  - note: The assertion is per-record (map over every line), so it also refuses a damaged second record — stronger than the row states.
- **AMEND** [S10, CONFIRMED] The trade is right; the enabled battery is a later act.
  - evidence: Receipt :157-166 `every spelling of it inside this file mints a test title and therefore moves titles 22491 → 22492 ... chose the asserted separator + a priced handover row over an in-file regression test`. Scratch probe at laneCUREPORC-tree @d0c1a777e: `TUPLE
  - note: The call holds; the amendment is that the stratum should state the battery it enabled has NOT been built through §891 and the fold of the two parsePorcelainPaths copies is likewise unbuilt, with no do
- **RATIFY** [S10, CONFIRMED] Handover accurate at 7f974e855; cure real at c422ee824.
  - evidence: 7f974e855 base-state-capsule.mjs :125 execFileSync(...) returned UNTRIMMED; :431-434 `porcelain.split('\n').map((line) => line.slice(3).trim()).filter(Boolean).filter((path) => DIRTY_SCOPES.some((scope) => path === scope || path.startsWith(scope)))` — unexport
  - note: The prefix allowlist at :434 is what makes the mangled path DROP rather than refuse — verified by reading; the false-CLEAN direction is real.
- **RATIFY** [S10, CONFIRMED] Re-cut cost nothing; predictions answer to the live tip.
  - evidence: `git rev-list --count 9a0584f0f..7f974e855` → 28; `merge-base --is-ancestor 9a0584f0f 7f974e855` → ANCESTOR=yes; `git diff --stat 9a0584f0f 7f974e855 -- tests/lint/sovereigntyLightingContract.walker.test.js` → (empty). d0c1a777e parent = 7f974e8555c8… (`git sh
  - note: Whether a lane may re-cut its own dock mid-dispatch: the receipt recorded it vetoably in §0 and §6 J-1; the chair ratified; nothing to reverse.
- **RATIFY** [S10, CONFIRMED] Executed as ruled.
  - evidence: Pick 1 of 23 = `20f089aaa CURE-PORCELAIN (1/1): the lighting refreeze stops refusing the one path it exists to permit`; pick 22 = `d124eae45 INSTR-land register 1/2: the lighting census refrozen at 2503/370/2133/22665/6099 — and the repaired refreezer proves i
  - note: This live P1b at the landing is the strongest receipt for the whole row and the stratum does not cite it.
- **RATIFY** [S10, CONFIRMED] Executed: CURE-CAPSULE is absent from 7f974e855..f5a6c3bbf and landed at §885.
  - evidence: No CURE-CAPSULE commit among the 23 in 7f974e855..f5a6c3bbf; `9feb645f8 in f5a6c3bbf: no`, `9feb645f8 in 2d5112851: yes`; `git log --reverse f5a6c3bbf..2d5112851` → pick 1 of 6 = `9feb645f8 CURE-CAPSULE (1/1)…`, pick 4 = `d4b91b26a §885 register 1/2: the light
  - note: Consistent with the ordering law too: the capsule car rode ahead of §885's own refreeze.
- **RATIFY** [S10, CONFIRMED] Registers and plant as stated.
  - evidence: `7f974e855 it/test:34` · `d0c1a777e it/test:34`; scratch probe tuple at d0c1a777e dock 2497/370/2127/22491/6078; ratchet baseline `entries 10 · voiceMechanics 4 · sovereigntyLighting 0`, totalTests 30788 totalFiles 2445 measuredAtSha e06ea94d1; probe P2b/P3 ou
  - note: OSR 1993/1409/388 UNMOVED and the throwaway base-dock attribution are PLAUSIBLE from the receipt only; settling commands: `node scripts/check-observed-shape-readers.mjs` in laneCUREPORC-tree, and the 
- **RATIFY** [S10, CONFIRMED] Dispositions sound; arithmetic closes.
  - evidence: implementation-session.mjs :157-158 `'status', '--porcelain=v1', '-z', '--untracked-files=all'` with `parseStatus(rawStatus, …)`; receipt §5 rows: lighting (CURED), implementation-session (CORRECT/model), base-state-capsule (HANDOVER), realm-scale/releaseEvide
  - note: J-3's reasoning (a whitespace-only difference must never compare EQUAL to the register path) is the conservative direction; ratified.

## §883.5  —  6 call(s): RATIFY 5, AMEND 1
- **RATIFY** [S10, CONFIRMED] Built as ruled at e2967f2a1.
  - evidence: register :332 `const isDialRow = row.reason === 'dark-by-construction' && row.door.kind === 'generation-dial';` :361-370 `if (!dialGated) fail('W', '…An absent measurement is not an acquittal.'); if (!dialGated.has(row.identity)) fail('W', …BIT claim…)`; :389 
  - note: The 'first live --report reported both dial rows as STRUCK' narrative is PLAUSIBLE (commit message + receipt §11.2; no log file names it). Small gap flagged under beyond: compareDark's 'ROLLED' (prese
- **RATIFY** [S10, CONFIRMED] All three exist and pass.
  - evidence: (a) walker :809 `test('THE WIDENING IS NARROW: a generation-dial identity that is NOT dial-gated still convicts at clause W'` → `toContain('not in the measured dialGated set')`; admitted via `new Set([...live.dialGated, notGated.identity])` → writeProof `dialG
  - note: 'Absent measurement is not an acquittal' is enforced at the one clause that admits the reason (W); D-dial and S both run after W, so no dial row can reach them without a measured set.
- **RATIFY** [S10, CONFIRMED] A real false-green shape, found and cured inside Car 4.
  - evidence: 355ff603b walker :733 `const row = WRITER_DARK_REGISTER[0];` — register[0].reason `engine-internal` at 355ff603b (:81) vs `dark-by-construction` at e2967f2a1 (:85). walker-car4.log: `FAIL … the structural law refuses a malformed, duplicated, wrong-reason, or f
  - note: The lane's own first-run log is the primary receipt for this finding; the receipt narrates it without quoting the log.
- **RATIFY** [S10, CONFIRMED] Counts correct; reverse direction enforced.
  - evidence: `grep -c "kind: 'generation-dial'"` on the register → 2; walker :91 `const FROZEN_DIAL_GATED = Object.freeze([` with 31 entries (counted), :1201-1204 `expect([...gated].sort()).toEqual([...FROZEN_DIAL_GATED]); expect(FROZEN_DIAL_GATED.length).toBe(31);` :907 `
  - note: The probes dir's frozen-dialgated.txt is the stale 34-entry (pack-control-only) roster, not the committed 31 — a stale artifact, harmless to the tree but misleading to a reader (see beyond).
- **RATIFY** [S10, CONFIRMED] Figures reproduce.
  - evidence: Scratch probe at laneINSTRWRW-tree @e2967f2a1: `TUPLE {"files":2496,"parked":370,"credited":2126,"titles":22493,"suiteTitles":6075}` — EXACT. Baseline diff: only frozenAtSha, detectorDigest, registerDigest. test(/describe( counts: 6dcdb0784 39/5 · b2d4e961e 45
  - note: typecheck 173/1121 and eslint 0 are PLAUSIBLE (receipt only); settling commands in the dock: `node scripts/check-full-typecheck.mjs`, `node scripts/check-domain-strict.mjs`, `npx eslint <five files>`.
- **AMEND** [S10, CONFIRMED] There is a Car 4 §879-form row.
  - evidence: Receipt §6 holds R1–R9 only; §12 says `Nine rows at §6 remain as written; R5 is now DISCHARGED BY RULING AND BUILT`; no R10 and no Car 4 row exists — Car 4's calls (clause design, the three plants, the positional-index cure) are narrated in §11.1–11.3 without 
  - note: Change 'plus Car 4's' to 'Car 4's calls are narrated in §11, not rowed' — a returning seat looking for a tenth row will not find one.

## §883.6  —  11 call(s): RATIFY 6, AMEND 4, REVERSE 1
- **RATIFY** [S10, CONFIRMED] Mechanism correct at 7f974e855; now reds loudly.
  - evidence: 7f974e855 :434 `.filter((path) => DIRTY_SCOPES.some((scope) => path === scope || path.startsWith(scope)))` — ` M scripts/x` trimmed → `M scripts/x` → slice(3) `ripts/x` matches no scope → dropped → `dirty.length` 0 → main proceeds (:450-452). Committed D4: `ex
  - note: The five-arm pre-cure execution is the lane's (PLAUSIBLE as to its run), but the mechanism is fully derivable from the code and the committed D4 case encodes it.
- **AMEND** [S10, CONFIRMED] A general law.
  - evidence: Lighting consumer is an EXCLUSION filter (`.filter((path) => path !== CENSUS_BASELINE_REL)`): a mangled record stays in `dirty` → refusal (shouts). Capsule consumer is an INCLUSION allowlist → mangled record dropped (lies). Models: worktree-inventory.mjs :37-3
  - note: The law holds for the two live sites and generalises, but its precise form is the consumer's DEFAULT for an unrecognised record — fail-closed (exclusion/equality: unknown stays dirty) shouts, fail-ope
- **RATIFY** [S10, CONFIRMED] Zero movement; veto priced exactly.
  - evidence: `git show --stat c422ee824` → 2 files, +141/−5, 0 created; test diff adds only the import line, a retitle, and D1–D7 inside the existing `it('reads porcelain by its column law, and throws naming the row …')`; my run `Tests 9 passed (9)` (9 before per receipt §
  - note: The lighting tuple at the CURECAP dock cannot be re-probed against 2497/… because the dock now sits on the rebased base f5a6c3bbf; zero movement is established by construction (no title, no file, no d
- **RATIFY** [S10, CONFIRMED] The label is honest and the components hold.
  - evidence: `const floor = Math.floor((baseline.totalTests || 0) * SCOPE_FLOOR_RATIO); if (baseline.totalTests && rows.length < floor) { scopeFailures.push('total test count collapsed…')` — count arm reds only on COLLAPSE. Baseline entries: 10, `baseStateCapsule` 0. Batte
  - note: A PLAUSIBLE flagged and priced, later discharged by the landing gate; nothing to amend.
- **RATIFY** [S10, CONFIRMED] As stated.
  - evidence: `git show c422ee824:scripts/base-state-capsule.mjs | shasum -a 256` → 1ee9fb67fd3095b540667508e1fbaf21c538a7b8b65a255c20c874c3d3671438 (matches the receipt). d0c1a777e parent 7f974e855 and `d0c1_ANCESTOR=no` for the INSTR tip — never in the CURECAP dock's tree
  - note: The negative-control run itself is PLAUSIBLE (receipt quote); settling command: copy the file to scratch, delete the assertion, run the battery against the copy. The fold of the two copies remains owe
- **AMEND** [S10, CONFIRMED] Denominator reproducible.
  - evidence: Table rows: capsule (cured), lighting (live-not-ours), implementation-session (GOLD), worktree-inventory, premortem ×2 (3 models), the `git ls-files` class row labelled `NEW class (5)` listing 4 files / 5 locations, realm-scale, track-voice, releaseEvidenceCor
  - note: Substance unaffected (no affected site either way); the figure '17 sites' should be stated with its counting convention or corrected to 18. The 4,852-file count is receipt-only (PLAUSIBLE).
- **AMEND** [S10, CONFIRMED] The dock is at the car.
  - evidence: laneCURECAP-tree HEAD = 62be253f3278cf88cfd3656d39e8f9e2357e59bf, parent f5a6c3bbf, trailer `Opus 5 — Fable-unvalidated` (the §884.4 rebase); seals `refs/preserve/curecapsule-2026-09-02` → c422ee824 and `curecapsule-rebased-2026-09-02` → 62be253f3; `git diff -
  - note: Not a chair error at §883.6's time (the rebase is §884.4's act) but the stratum's dock pointer is now stale; a returning seat should read c422ee824 via the seal, not via the dock.
- **REVERSE** [S11, CONFIRMED] POPULATION_GREW is raised before the wholesale `...measured` write, so a refreeze cannot clear arms 2/4; the DECLARED_GROWTH row is the gate
  - evidence: f3d33e4b9 walker: `:92 const verdict = refreezeRefusals({` · `:104 if (!verdict.ok) {` throw · `:120 ...measured,` · `:124 renameSync(temporary, INVENTORY_PATH)`. tuning-inventory.mjs@f5a6c3bbf `:1055 const declared = declaredGrowth[population]?.[file];` … `:1
  - note: The REVERSE is of the §883.6 ruling, exactly as §883.8 already recorded; the chair's self-report is correct on every point. AMEND one address: the stratum's `:71–78` / `:117–121` / `:92-103` / `:104-1
- **RATIFY** [S11, CONFIRMED] Zero headroom measured
  - evidence: unit === null on 220 of 224 tables; signatureVersion 0; ceiling `UNITLESS_TABLE_CEILING: 220`.
  - note: Refutation attempted: 'a factual unit (persons) is a census fact'. It fails on posture — every row is draft at signatureVersion 0 and the walker's own docblock calls the register 'the pen's'; writing 
- **RATIFY** [S11, CONFIRMED] src is in the build-input set
  - evidence: Set (a) begins `src api public index.html package.json …`; `refs/preserve/landing-T13-2026-09-02` seals 7f974e855.
- **AMEND** [S11, CONFIRMED] The defect recurs at every landing unless cured
  - evidence: Walker diff f5a6c3bbf..4233031ba: `1 file changed, 96 insertions(+)` — only ARM 42 (CAPACITY C1); no base-relative logic. Inventory measuredAtSha: f5a6c3bbf→32573759e · 30c1667bc/ca651d54b→dfcc8eb72 ('chair, §889 train') · 4233031ba→250d4e464 ('§891 train'); r
  - note: The law holds. But 'that design question is queued' is FALSE — no queue row, docket row or LANE-QUEUE entry exists. What exists is a de-facto standing register act (each landing that moves the measure

## §883.8  —  3 call(s): RATIFY 2, AMEND 1
- **RATIFY** [S11, CONFIRMED] Door shape {introducedAt, cause, sites}; ceilings landed as ruled; the act is attribution not authoring
  - evidence: f3d33e4b9:72-77 `BARE_DECIMAL_CEILING: 7003` `UNREGISTERED_NAMED_CEILING: 534` `DECLARED_GROWTH_CEILING: 0`; f5a6c3bbf `…: 6985` `…: 535` `…: 2`. Register@f5a6c3bbf declaredGrowth: canonicalRelationship.js {sites 1, introducedAt 754856b12…, cause 350 chars}; t
  - note: The attributing-vs-authoring distinction holds on the code: a declaredGrowth row carries no value/unit/band and is validated only as a citation (sha resolves, cause length, sites). The E4 arm-5 outcom
- **AMEND** [S11, CONFIRMED] T13 gave a magic number a name and the instrument charged it
  - evidence: `git merge-base --is-ancestor 754856b12 7f974e855` exit 0. numstat `42 6 src/domain/relationships/canonicalRelationship.js` · `24 1 src/domain/worldPulse/thievesGuild.js`. Hunk: `+const POPULATION_SATURATION = 2511886.43150957906619;` and the removed line `-  
  - note: The +1/−1 same-file same-commit fact is exact. But the −1 bare is the CAP `0.8`, and the +1 named is a DIFFERENT, measured value (the population at which the old bonus saturated) — the act is 'a cappe
- **RATIFY** [S11, CONFIRMED] Self-reported chair error
  - evidence: HANDOFF at 9b7d6998b (§883.6) and efcf98b89 (§883.7): 51,035 B ✓; at bf883f01c (§883.8): 52,117 B (recovered + edited); §884.2 corroborates 'the §883.8 truncation, whose first retry also failed its own guessed bound (1000 guessed, 905 real)'.
  - note: The 4,580 B transient size is unverifiable now (PLAUSIBLE); the pre-size and the fact nothing truncated was committed are confirmed.

## §883.5(a)  —  4 call(s): AMEND 2, REVERSE 1, RATIFY 1
- **AMEND** [S11, CONFIRMED] Boarding it would stale every §3 bill; composition unaffected either way
  - evidence: `85 3 scripts/base-state-capsule.mjs` · `56 2 tests/scripts/baseStateCapsule.test.js`; file EXISTS at 7f974e855 (315 lines). Added test titles in the +56: exactly ONE — `+  it('reads porcelain by its column law, and throws naming the row when a home is missing
  - note: The ruling holds (prevention car must not ride the landing it guards; disjoint paths confirmed; executed at §884.4). Wording must change: '+56/−2 is titles' (and ledger §884's '+56 titles consequence'
- **REVERSE** [S11, CONFIRMED] ~45 files were owned by nobody (a dropped thread by construction)
  - evidence: package.json@7f974e855 `:56 "verify:dist": "… node scripts/check-test-ratchet.mjs --verify-dist"`, `:58 "check": … && npm run build && npm run verify:dist`. check-test-ratchet.mjs@f5a6c3bbf `:702 if (VERIFY_DIST) runnerEnv.VERIFY_DIST = '1';`; strict block `:8
  - note: Exactly as §884(2) self-reports: the premise was false (verify:dist already owns every dist-reading suite with the flag set), and the chair's own flagless re-run was the vacuous one (57 skipped, exit 
- **AMEND** [S11, CONFIRMED] The plain gate must prove the COMMITTED state after the register commit
  - evidence: Receipt: `--update … 1,589 s` · `§3.4.5 run 1 … 1,046 s … writerReach.walker "TIMEOUT"` (uncapped pool, load 48.98/8) · `§3.4.5 run 2 (quiet re-run) --maxWorkers=2 … 1,488 s … fieldBattleRegion ASSERTION` — the foreign 0.392% flake surfaced HERE. Ledger §884: 
  - note: The ruling holds and paid for itself; the §883.5 stratum text still carries the ~+250 s figure, which was wrong by 4–6× per run. Receipt-read; wall-clocks not re-executed.
- **RATIFY** [S11, CONFIRMED] prebuild/postbuild under scripts/; prerender-routes.mjs:56 imports ../api/_galleryMeta.js; eslint.config.js:32 imports scripts/count-transcendental-math.mjs; REALM_SCALE_SOURCE_PATHS names scripts/audit, where the consis
  - evidence: package.json:8-10 `"prebuild": "node scripts/generate-sitemap.mjs"`, `"build": "vite build"`, `"postbuild": "node scripts/prerender-routes.mjs"`. scripts/prerender-routes.mjs:56 `import { injectGalleryMeta, SITE_NAME } from '../api/_galleryMeta.js';`. eslint.c
  - note: All four addresses verified at 7f974e855 without a dock. The lane executed the corrected two-set instrument: receipt §3.5.1 '(a) … → ZERO ROWS · (b) … FOUR ROWS, all under scripts/audit · the 33-path 

## §883.5(b)  —  10 call(s): AMEND 2, RATIFY 7, REVERSE 1
- **AMEND** [S11, CONFIRMED] Both skeptics re-executed the apparatus and everything reproduced; the closure would be caught by §6.3.7 measuring from the gate's own build
  - evidence: Gate: `GATE_START=2026-09-02T21:09:30Z` → `GATE_END=…21:27:18Z` (=1,068 s); `:392 [test-ratchet] OK — no test regressions (10 known failure(s) of 30962 tests, ceiling 10).`; `:925 TRUE_EXIT=0`. Lighting census blob @f5a6c3bbf 2503/370/2133/22665/6099, measured
  - note: F-10 and O-2 hold on outcome (green first run, every register exact, zero build-input rows). But the ledger §884 sentence 'first-paint closure stays 1,046,732 — 268 B under the UNRAISED 1,047,000 — wi
- **RATIFY** [S11, CONFIRMED] A proof that reds for a non-build reason will be argued around rather than obeyed
  - evidence: Receipt :107-110 `(a) … → ZERO ROWS` · `(b) certification-fingerprint set (scripts/audit tests/fixtures/spatialPackFixtures.js) → FOUR ROWS, all under scripts/audit … EXPECTED, and NOT a build finding` · `the 33-path intersection … IN PYTHON → EMPTY`. My diff:
  - note: Nothing is hidden by the split: both sets are run and both results printed; the certification-fingerprint move is carried at §3.2 (B-3) rather than dropped.
- **AMEND** [S11, CONFIRMED] Attribution of the panel's own judgment calls
  - evidence: comp.json keys: ['lens','verdict','findings','survived','seat','base'] — findings A-1..A-5 only, NO own-judgment-call table, no 'classifier' text. bill.json `own_judgment_calls_for_the_retrovalidation_queue`: SB-1 … SB-5, with `SB-4 | I did not attempt to re-d
  - note: The three-method-tuple call is Skeptic B's SB-4, not Skeptic A's; Skeptic A's 'five' are its five FINDINGS, and Skeptic B has FIVE own calls (SB-1..SB-5), not one. §884's enrolment line 'Skeptic A 5 ·
- **RATIFY** [S11, CONFIRMED] Sequencing and scoping calls of the order's author
  - evidence: `33 files changed, 34011 insertions(+), 78 deletions(-)` at 72b513b85 — the order's figure to the byte; receipt :76 pick 11 `+16788/−0 — THE UNION LANDED … ZERO markers`; L-4 `4 of 9 measurement arms carry a proving control`; registers table `probe C @ final t
  - note: All executed as ruled and reproduced; O-8 is moot in the event.
- **RATIFY** [S11, CONFIRMED] Fence constant untouched, blob unedited
  - evidence: tests/property/espionageDormancyFence.test.js@f5a6c3bbf:262 `const PRE_COUPLING_CORPUS_SHA = '72acacd8583f70f6b0a5a551ad067f32eb35060e5e08cf8589e8e2135a5c4f6d';`; blob b83b44c05 at BOTH 7f974e855 and f5a6c3bbf.
- **RATIFY** [S11, CONFIRMED] Repeatability demonstrated on the landing tree
  - evidence: Tip blob `a4a905bf443a7bbae51efb2d37829cfbc40acef4 tests/lint/.lighting-census-baseline.json`; receipt: `REFROZE again, 2503 -> 2503 on all five, zero refusals, zero "Dirty: ests/" occurrences, register blob a4a905bf4 byte-identical across both runs`. Receipt 
  - note: Blob identity checked by me; the two runs are receipt-read.
- **RATIFY** [S11, CONFIRMED] OSR stamp unmoved across the landing
  - evidence: 7f974e855: frozenAtSha `b0c3e2bb43c6674ee541ea1e9dd25cd0a80ea2ba` schema 15; f5a6c3bbf: identical. Receipt: `OSR … 1993 finding(s), exactly matching`.
- **RATIFY** [S11, CONFIRMED] Fold-side corrections and refusals
  - evidence: eslint.config.js@7f974e855 :28-32 — the import is at :32, :1 is a docblock. `git ls-tree -r --name-only 7f974e855 tests | grep -E 'Golden|Fence|Dormancy' | wc -l` → 86 (case-insensitive 'golden' alone gives 92; 'Golden' alone 48 — so 86 is the family, not a co
  - note: F-8's 86 reproduces exactly; F-3's named exclusion is a receipt line, meaningfully different from silent curation.
- **RATIFY** [S11, CONFIRMED] The figure appears in the §882 row
  - evidence: Hits at ledger lines 32346 (§881.17), 32348 (§881.19), 32349 (§882), 32350 (§882.1), 32355, 32356 — the §882 TAIL-F row is line 32349.
- **REVERSE** [S11, CONFIRMED] ~45 files owned by nobody — a dropped thread by construction
  - evidence: verify:dist runs the whole of tests/build with VERIFY_DIST=1 as the last stage of `npm run check` (package.json:58; check-test-ratchet.mjs:702); gate-instr.log:924 `STRICT DIST OK — 52 … 440 test(s), zero … non-run`.
  - note: The hole did not exist for the gate; §884 marks CR-2 as unnecessary but F-6 — the fold call that created it — is not marked. It should carry the same disposition.

## §883.5(c)  —  1 call(s): RATIFY 1
- **RATIFY** [S11, CONFIRMED] A live structural gap
  - evidence: HEAD blob before §883.5 (e4f840774~1): 319,498 B / 2,180 lines ✓. kit-883/queue-883.md: 300,067 B / 2,118 lines ✓. HANDOFF at e4f840774~1: 46,617 B ✓. chair-commit.sh:54-64 carries only `# … The blob must actually DIFFER from the parent's.` … `if [ "$QNEW" = "
  - note: The gap is still open: no copy of chair-commit.sh carries the prefix check. The (1) stale-worktree figures 152,041 B / 1,410 lines are transient and unverifiable now (PLAUSIBLE); the staged-delete-plu

## §884  —  3 call(s): AMEND 2, RATIFY 1
- **AMEND** [S11, CONFIRMED] Diagnosis and deferral
  - evidence: f5a6c3bbf src/domain/region/wizardNews.js:552 `createdAt: entry.createdAt || options.now || nowIso(),`; blob 787999905 at BOTH 7f974e855 and f5a6c3bbf (foreign). Test :109 `appendWizardNewsEntries({}, [battleRow()], { now: null })`. Later: `b6822dcae … a byte-
  - note: Diagnosis exact; the deferral was DISCHARGED test-side at §888 and fenced at §889, and the §884 row is not marked superseded. Path should be spelled in full (src/domain/region/wizardNews.js — the brie
- **AMEND** [S11, CONFIRMED] Arithmetic over the moved ceilings
  - evidence: Three ceilings moved: DECLARED_GROWTH 0→2 (+2), UNREGISTERED_NAMED 534→535 (+1), BARE_DECIMAL 7003→6985 (−18). Receipt scoped its figure: `Net movement across the counted populations: −18 +1 = −17`.
  - note: −17 is the P2/P3 population figure; across all ceilings the net is −15. The stratum's phrase 'net ceiling movement' should say −15, or keep −17 with the receipt's 'counted populations' qualifier. Stil
- **RATIFY** [S11, CONFIRMED] The landing's executed figures
  - evidence: `git log --format=%B 7f974e855..f5a6c3bbf | grep -c '^Seat: '` → 23 (1 CURE-PORCELAIN · 9 TUNEREG · 4 WRW · 5 SOAK · 2 INSTR-land · 2 Fable-unvalidated); `35 files changed, 34054 insertions(+), 88 deletions(-)`; `refs/preserve/landing-INSTR-2026-09-02` → f5a6c

## §884.1  —  2 call(s): AMEND 2
- **AMEND** [S12, CONFIRMED] Scheduling judgment; zero consumers make the fix free today and impossible after wiring.
  - evidence: scripts/.test-ratchet-baseline.json@f5a6c3bbf carries 'becomes impossible the day the stack is wired' (git grep match, lines 13/44/61/94). panel :463 'fill-layer, FIRST and ALONE, with amendments A7–A10'; :465 'This should not wait for anything.' panel R1 :593
  - note: The ranking is sound and I would not reverse it: the door is one-way, the car is one commit, and the alternative cost is a declared shift on every lit surface. But 'both skeptics reached the same sequ
- **AMEND** [S12, CONFIRMED] Standing instruction hard-codes a seat; the chair followed intent and refused the trailer.
  - evidence: mcp scheduled-tasks list -> 'No scheduled tasks found.' git show -s 17970ea7c | grep '^Seat:' -> 'Seat: Opus 5 — Fable-unvalidated'. The heartbeat text survives only in ledger row 32375 ('carries stale text naming `gate-tailf.log` ... instructing the chair to 
  - note: The refusal is CONFIRMED by outcome (the commit carries the Opus trailer). The heartbeat text itself is EVIDENCE-THIN — no scheduled task exists now, so it was session-bound (a /loop) and did not outl

## §884.2  —  2 call(s): AMEND 1, RATIFY 1
- **AMEND** [S12, CONFIRMED] As stated.
  - evidence: git show --stat 17970ea7c: 'docs/FABLE_RETROVALIDATION_QUEUE.md | 12 ++++' 'docs/OWNER_DECISION_QUEUE.md | 1 +' '2 files changed, 13 insertions(+)'. git rev-parse 17970ea7c:docs/HANDOFF_CURRENT.md = 17970ea7c^:docs/HANDOFF_CURRENT.md = 59ee278b4. git diff 1797
  - note: The failure and its one-fact cost are CONFIRMED (identical blob; the refresh was exactly one line). 'Carries three files' is wrong — the commit changed two files; an unchanged handoff is not in a comm
- **RATIFY** [S12, PLAUSIBLE] Necessary completion of the §882.11 cure.
  - evidence: kit-884/run-cr2.sh and run-gate-instr.sh both end in 'exit $TRUE_EXIT' (tail -5 of each); no ritual script with the guard-and-continue shape is preserved to re-test.
  - note: The law is correct and the recurrence is proven by 17970ea7c. On the re-derivation question: yes — a single Python program that measures every span, asserts, and writes all files (or none) removes the

## §884.3  —  7 call(s): RATIFY 6, AMEND 1
- **RATIFY** [S12, CONFIRMED] As stated.
  - evidence: adb9f19b7 parent f5a6c3bbfd86…; trailer 'Seat: Opus 5 — Fable-unvalidated'. laneFILLLAYER-tree HEAD adb9f19b7, porcelain 0 lines. for-each-ref --contains adb9f19b7 -> refs/heads/claude/lane-filllayer-2026-09-02 (= adb9f19b70fa…). diff --diff-filter=A f5a6c3bbf
  - note: Every structural claim checks.
- **RATIFY** [S12, CONFIRMED] As stated.
  - evidence: render-base.json rows 3696, header non-null 3696, distinct 144, broken(det|cap) 118; render-fixed.json rows 3696, non-null 3696, distinct 23, broken 0. filllayer/RECEIPT.md:63-68 'BEFORE ADJACENT-DET 1100 · DOUBLED-WORD 836 · DET+CAPITAL 660 · DASH 140 / AFTER
  - note: 144 -> 23 distinct, 0 broken after, and 3,696/3,696 non-null are CONFIRMED by my re-derivation; the 133 (vs my 118 and the panel's 122) is detector-dependent and the four-detector template-differenced
- **RATIFY** [S12, CONFIRMED] As stated.
  - evidence: variants.json: 2734 variants (all distinct), 2207 naming >=1 slot (80.7%), 3238 occurrences, 39 distinct slots, 786 pools, 146 blocks; 'variants with a digit in raw text 20; with a digit outside slot tokens 0'. economyStateProse.js@7f974e855:216-221 slots = { 
  - note: Every figure re-derives exactly; shape split PLAUSIBLE from the receipt (settling: node -e over scripts/lib/dossier-slot-shapes.mjs at adb9f19b7).
- **RATIFY** [S12, CONFIRMED] As stated.
  - evidence: dossierCausalProse.generated.js e0b6dbb27 SAME; dossierStateProse/{defense b8fd3da29, economy daa7bcd8e, general 92926389e, power df7f3dc92, stressors dd024cc15, warFaith f8aa31ec9} SAME (and the other four generated leaves in the tree also SAME). ledger 32381
  - note: All chair reads hold and the build correction was honoured at §885. One thing the chair's verification did not flag: the FILL-LAYER dock (and the CURECAP dock) carry materialised cp -Rc node_modules, 
- **RATIFY** [S12, CONFIRMED] As stated.
  - evidence: RECEIPT.md:32-34 'economyStateProseDesk.test.js fixture L40 is `economicComplexity: \'a mixed market economy\'` — a LOWERCASE DETERMINER-LED fill ... which neither the designer nor either skeptic reported'; :14-18 the register split (2-col §0c, 3-col §0c-2, ca
  - note: Fixture, header-by-name and generator side effects CONFIRMED by reading the sources; the 108/101/150 floors are PLAUSIBLE from the receipt (settling: run tests/data/dossierStateProseProjection.contrac
- **AMEND** [S12, CONFIRMED] Deferral, not blocker, because the economy desk has zero consumers; the collapse costs nothing today.
  - evidence: annex@adb9f19b7:219 '### §0c-3 THE COMPLEXITY BAND — **OPEN, THE CHAIR'S** (2026-09-02)'; :223-224 '**11 of 11 are refused**'; :229-232 'Eligible variants per DS-ECO-1 pool while the slot stays dark: C1 **1 of 3** · C2 2 of 3 · C3 2 of 3 · C4 3 of 3 · C5 2 of 
  - note: The ruling is right today and I would not reverse it: with zero consumers the collapse costs zero rendered bytes, and minting eleven reader-facing forms is chair/owner content. Two amendments: (1) the
- **RATIFY** [S12, CONFIRMED] Deferred and documented at annex §0c-4; not dropped.
  - evidence: annex@adb9f19b7:242 '### §0c-4 THE SHAPE RESIDUE — recorded, deliberately deferred, with its cure named'; :246-247 'A SENTENCE-INITIAL LOWERCASE SEAM, 20 sites over six slots ({timeband_since} 8, {good} 5, {reason} 3, {stakes} 2, {issue} 1, {burden} 1)'; :250-
  - note: Recorded where a successor will find it, with the cure named. The 20-site figure is PLAUSIBLE (settling: regex over variants.json for a slot at template index 0).

## §884.4  —  7 call(s): RATIFY 5, AMEND 2
- **RATIFY** [S12, CONFIRMED] As stated.
  - evidence: diff-tree -p c422ee824 | md5 = 35319b292ae643a99a4bf69feb26e69d = diff-tree -p 62be253f3 | md5; touched-blob sets both 13d206e4a…. 62be253f3 P=f5a6c3bbf; c422ee824 P=7f974e855. refs containing 62be253f3: refs/heads/preserve/curecapsule-rebased-2026-09-02; c422
  - note: All figures re-derive. One precision: the re-based car's seal is a branch under refs/heads/preserve/, not refs/preserve/, so the brief's for-each-ref refs/preserve census would not list it. CR-1's 'no
- **AMEND** [S12, CONFIRMED] As stated.
  - evidence: receipt:391-393 'launched as `npm run test:ratchet > log 2>&1; echo $? > sentinel`. The harness reported the task **"completed (exit code 0)"** because the final `echo` succeeded. The ratchet's own exit was **1**.' :277-282 'writerReach.walker.test.js ... `Err
  - note: The law, the false-green mechanism, the honest wrappers and 'not the car's' all hold (the car cannot reach the file; it failed again later with the file unchanged; 56/56 standalone re-confirmed by me)
- **AMEND** [S12, CONFIRMED] As stated.
  - evidence: chair-commit.sh:34 'SEATLINE=$(grep -c \'^Seat: \\(Fable 5 — validated\\|Fable 5\\.1 — validated\\|Opus 5 — Fable-unvalidated\\)$\' "$MSGFILE" || true)'. §883 9a0584f0f..7f974e855: 28 commits, lane-form 28. §884 7f974e855..f5a6c3bbf: 23 commits, lane-form 21, 
  - note: Every figure the row states was true when written, and the ruling on the lane's edit is right. But the actual split over the asked range is 5 lane-form / 43 strict / 1 none: the 'ungated product conve
- **RATIFY** [S12, CONFIRMED] Ratified: carrying a green you did not run is the citation-law defect.
  - evidence: tests/lint/.lighting-census-baseline.json@7f974e855: files 2497, parked 370, credited 2127, titles 22491, suiteTitles 6078; @f5a6c3bbf: 2503/370/2133/22665/6099. receipt:252-258 'RV-6 ⭐ THE MOST VETOABLE ACT OF THIS LANE — I rewrote part of a commit message I 
  - note: Both tuples are exactly the two baselines, so the original message was a true citation of the wrong base. Retiring the un-run readings was vindicated the same night: strict-domain was in fact dirty at
- **RATIFY** [S12, PLAUSIBLE] Ratified as the model control.
  - evidence: receipt:136-147 'Plant: deleted lines 489-495, the ENTIRE column-law assertion ... Blob moved `8ec4773ff` → `49a5ca485` ... Tests 1 failed | 8 passed (9) ... AssertionError: expected [Function] to throw an error ... Restore → blob back to `8ec4773ff` (**sha-id
  - note: The receipt is specific, blob-addressed and internally consistent; I did not re-execute it. Settling command: re-run the lane's C-B harness (its transform is described at receipt:153-156) at 62be253f3
- **RATIFY** [S12, CONFIRMED] As stated for the re-based CURE-CAPSULE car.
  - evidence: @f5a6c3bbf lighting 2503/370/2133/22665/6099; scripts/.test-ratchet-baseline.json totalTests 30962, totalFiles 2451. receipt:310-313 'totalFiles 2451 ... CONFIRMED / totalTests 30962 ... CONFIRMED / passed 30950, failed 11, skipped 1'; :335 '[test-ratchet] OK 
  - note: Δ=0 holds for the CURE-CAPSULE car alone (its D1–D7 cases sit inside one existing it()). The consist then moved +11 titles/tests from the FILL-LAYER arms, which §885 predicted and refroze — consistent
- **RATIFY** [S12, CONFIRMED] PLAUSIBLE deferral with a home.
  - evidence: git log f5a6c3bbf..2d5112851: 9feb645f8 CURE-CAPSULE, 36f04bfcd FILL-LAYER, 37e285498 '§885 cure 1/1: the fill-layer car changed a slot's type and an existing consumer went strict-dirty', d4b91b26a register 1/2, c8b83b25e register 2/2, 2d5112851 cure 2/2.
  - note: The deferral was honoured at the consist gate and it paid: strict-domain was dirty there (from the FILL-LAYER car). The scope argument (a scripts/ porcelain parser cannot mint an OSR shape) is PLAUSIB

## §884.5  —  22 call(s): AMEND 5, RATIFY 14, EVIDENCE-THIN 1, REVERSE 1, OUT-OF-SCOPE 1
- **AMEND** [S13, CONFIRMED] The kernel enforces slots via variantIsAnchored and silently ignores marks; compensating marks filter lives outside the kernel.
  - evidence: stateProseKernel.js:155-161 `return pool.filter((variant) => variantIsAudible(variant, audience) && variantIsAnchored(variant, slots))`; :145-146 `const marks = variant?.marks; return !Array.isArray(marks) || !marks.includes(COVERT_MARK)`; :130-134 checks `var
  - note: Substance holds. Wording: the kernel does read `marks`, for exactly one value (`dm-only`, the audience gate) — it ignores every DIMENSION mark (severity, deficit, anchored, arm). 'Silently ignores the
- **AMEND** [S13, CONFIRMED] Pool/state census figures and the pin-validated method.
  - evidence: Probe: {blocks: 68, pools: 708, variants: 2266, markedVariants: 186}; pools with dimension marks 24 (DS-GEN-1 10, DS-GEN-6 6, DS-GEN-9 8) → states 10×3+6×2+8×2 = 58 exact; pools with NO marks at all 652; pools with no dimension mark 684. dm-only marks 83; rece
  - note: 708, 58 and 89 reproduce to the digit. '650 unmarked pools' is 708 − 58, which subtracts STATES from POOLS; the pool figure is 684 (no dimension marks) or 652 (no marks). 687/708 not re-derived here (
- **RATIFY** [S13, CONFIRMED] Draw key is `${seed}::${blockId}::${poolKey}`.
  - evidence: stateProseKernel.js:197 `return eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length];`
  - note: Exact; sectionTarget absent from the key.
- **RATIFY** [S13, CONFIRMED] Wiring moves no ratchet; the em-dash debt is already banked.
  - evidence: voiceMechanics.test.js:164-167 `const SCANNED_FILES = [...walkJs(join(ROOT, 'src/data')), ...walkJs(join(ROOT, 'src/domain'))]`. Baseline entries 3 and 4 of 10: 'E2 voiceMechanics — src/data + src/domain string-literal ratchet (shrink-only) per-file debt exact
  - note: Line cite is :164-167 (four lines), trivial.
- **RATIFY** [S13, CONFIRMED] The leaf carries an import against its docblock claim.
  - evidence: economy.generated.js:6 `import { ECONOMY_FRESHNESS_SENTENCES } from '../../domain/display/economyFreshness.js';` under the header 'A canonical row that IS a live engine string is IMPORTED, never inlined'.
- **AMEND** [S13, CONFIRMED] Threading audience props must add zero lines.
  - evidence: eslint.config.js:667 `'max-lines': ['error', { max: 600, skipBlankLines: true, skipComments: true }]` for src/components/**/*.jsx; OutputContainer absent from scripts/.size-baseline.json; docs/implementation/BASE_STATE.json:18 `"src/components/OutputContainer.
  - note: The figure is the lane's ESTIMATE, not a measurement; the committed record says 599/600 (one line of headroom). Say 'estimated at the 600 ceiling' rather than 'measures'.
- **RATIFY** [S13, CONFIRMED] The lighting charter carries no car for the state-prose corpus (2,734 sentences).
  - evidence: `wc -l` → 436; `grep -c -E 'stateProse|dossierStateProse|readStateProse|DS-GEN|DS-ECO'` → 0 (grep exit 1). Probe: six desk leaves 2266 variants + receipt :63 causal 'variants 468' = 2734, matching the ledger row's '2,734 authored sentences'.
- **EVIDENCE-THIN** [S13, CONFIRMED] The lane breached a constraint and declared it.
  - evidence: Receipt header :3 'Read-only lane. Every figure below was executed by this lane against `git show f5a6c3bbf:<path>`, not inherited.' No line in the 41,507-byte receipt mentions JSON parses, ~1 s CPU, or a declared breach. Brief :5-8 '⛔ FORBIDDEN, without excep
  - note: The flag the chair ratified is not in the persisted receipt; it can only have lived in the lane's chat return. Settle: search the chair session 58f0a8e2 transcript for 'JSON' in the DARKREADER return.
- **RATIFY** [S13, CONFIRMED] Pooled headlines would break metronome suppression; single-valued frames do not.
  - evidence: :119 `export const DRIFT_REEMIT_COOLDOWN_TICKS = 6;` :140-151 `priorEntries.some((prior) => prior.kind === 'applied' && normalizedTick - (prior.tick ?? -Infinity) < DRIFT_REEMIT_COOLDOWN_TICKS && prior.impactKind === entry.impactKind && prior.headline === entr
  - note: Refutation attempt: a pooled headline drawn per entry would make two same-input entries differ in `headline`, so the `===` arm fails and the entry survives — the suppressor is disabled exactly as clai
- **RATIFY** [S13, CONFIRMED] The chair briefed an owner-gated token as the flagship defect.
  - evidence: :138-151 `const MUTILATED_ANCHORS = Object.freeze(['coup_detat', ..., 'occupation_burden', 'occupation_burden_cleared', 'occupation_resistance'])` — 12 entries; :221-229 `it('each mutilated anchor is still the live computed string, unrepaired', ...)` with the 
- **RATIFY** [S13, CONFIRMED] The thirteenth label is intercepted before the frames.
  - evidence: wizardNews.js:194 `relief: 'Regional relief',` :471-473 `// relief reads as a POSITIVE beat (pressure eases), not "faces relief" / "relief takes hold". if (impact.kind === 'relief') {`.
  - note: 12×6 = 72 follows if IMPACT_LABELS has 13 keys; not counted here (PLAUSIBLE).
- **AMEND** [S13, CONFIRMED] A naming convention enforced by a comment is not machinery.
  - evidence: treatySuccessionVoice.js:61-68 '`kind`, `impactKind` and `ending` below are spelled as STRING LITERALS on purpose ... a kind minted through a constant is INVISIBLE to it ... Measured here, not theorised: this file failed that walker until the literals went in.
  - note: Docblock CONFIRMED (spans :61-68, not a single line). The six-shape/20-site count is the lane's and was SUPERSEDED at §885.5 by the sound scan: '199 sites — 147 literal, 14 template families, 11 throu
- **AMEND** [S13, CONFIRMED] Census anchored on the estate's pins.
  - evidence: rumorFallbackPhrasePools.test.js:163-164 `expect(Object.keys(PARSED).length).toBe(107); expect(FALLBACK_WIRED_KINDS.length).toBe(107);`. Receipt :79-84 table 379/214/174/107, :95 'news-reaching field ... **36**', :99 'I could not reproduce the brief's "52 live
  - note: 379/214/174/107 stand; '19 BARE, live and reader-reachable' was ruled partly unsound one row later (§885.5) and the §884.5 stratum text carries no superseded mark.
- **RATIFY** [S13, CONFIRMED] Best and worst sentence describe the same event.
  - evidence: subsystemRowsWaves.js:55 'the first-class lane first fires at the 100-year horizon (20 deaths and 20 resettlements in release-100y-4s-seed1)'; settlementLifecycleFirstClass.js:224 `headline: `${name} is dying`,`; heraldRouting.js:323/653 `settlement_terminal_d
  - note: 'Twenty times' is PLAUSIBLE (20 distinct settlements → 20 distinct headlines, none metronome-suppressed); the liveness trace mint→render is the receipt's (:69), not re-executed.
- **RATIFY** [S13, CONFIRMED] A §883-class false green.
  - evidence: settlementRumors.js:113-114 '// Exported for the impactKind walker (tests/domain/settlementRumors.walker.test.js), // which source-scans every minted impactKind and reds until it is phrased here.' `git cat-file -e` → 'fatal: path ... does not exist in f5a6c3bb
  - note: Line cite is :113-114 at f5a6c3bbf (row says :112-113), trivial.
- **RATIFY** [S13, CONFIRMED] Ratified on the metronome ground.
  - evidence: See N1; the news-headline contract baseline is count-shaped (`distinctValues`/`occurrences` per home|field), so single-valued frames also leave its distinctValues unchanged.
- **RATIFY** [S13, CONFIRMED] In-place re-authoring is safe.
  - evidence: wizardNews.js:180 `const IMPACT_LABELS = Object.freeze({` (not exported); only other src hit is a comment at heraldRouting.js:196; consumer :272.
  - note: 'Two prose-only consumers' not counted (PLAUSIBLE).
- **RATIFY** [S13, CONFIRMED] The fallback reaches persisted data.
  - evidence: wizardNews.js:260 `function human(value)`; :271-272 `function impactLabel(kind) { return IMPACT_LABELS[kind] || human(kind) || 'Regional pressure'; }`; normalizeEntry :556 `headline: entry.headline || 'Regional update',` — passthrough of a persisted headline.
- **RATIFY** [S13, CONFIRMED] Deterministic, parallel-safe control.
  - evidence: Receipt :172 'C1 — DISCOVERY control (the arm no existing walker has). `mkdtempSync(join(tmpdir(), 'newslayer-'))`; write one fixture file containing `impactKind: 'newslayer_probe_unregistered'`; run `scanMints(fixtureRoot)`'.
  - note: The refusal's grounds (poison file a sibling stages) are sound: the §890.4/§891 era docks show untracked files graded by fs scanners (memory: 'an untracked file is still inside a filesystem scanner').
- **RATIFY** [S13, CONFIRMED] Housekeeping.
  - evidence: Receipt :99 'I could not reproduce the brief's "52 live", and I do not think it is recoverable — it sits between my 36 (news-reaching fields) and 72 (all four fields)'.
- **REVERSE** [S13, CONFIRMED] Urgency ruling.
  - evidence: Mechanism CONFIRMED (normalizeEntry :556 passthrough). Premise refuted by the owner (§884.6: 'there is no save before this fix. we are entirely prelaunch') and by the tree: no committed fixture or golden carries a persisted headline of the template (O1).
  - note: Already reversed by §884.6; as a §884.5 call it was wrong — a mechanism ruled on an unverified antecedent. The stratum's §884.5 text carries the ruling with no inline superseded mark.
- **OUT-OF-SCOPE** [S13, CONFIRMED] Owner-gated items not absorbed.
  - evidence: Anchors are owner-gated by pin (:221-229); wordings were later owner-approved at §885.5.
  - note: Correctly routed.

## §884.6  —  4 call(s): RATIFY 4
- **RATIFY** [S13, CONFIRMED] No saves exist; the fixture question is the last persistence exposure.
  - evidence: Five .js hits, all assertion templates or comments: impactKindWalkers.test.js:10 (comment), rumorFallbackPhrasePools.test.js:286 and rumorPhrasePools.test.js:231 `expect(`Merchants bring word of ${variant} in Thornwall`).toContain(variant)`, settlementRumors.t
  - note: SETTLED: no committed fixture or golden carries a persisted headline of the rumor template; Cure A moves only a rendered assertion in settlementRumors.test.js:437 and the contract baselines' counts st
- **RATIFY** [S13, CONFIRMED] Pattern: mechanism verified, antecedent assumed.
  - evidence: §883.8 (line 32373): '`refreezeRefusals(...)` is called at `walker:92-103` and throws at `:104-106`, UPSTREAM of that write, and the chair never opened it. The chair saw a guard, assumed it knew what the guard guarded, and ruled from the half it had read.' §88
- **RATIFY** [S13, CONFIRMED] Wiring, not saving.
  - evidence: Consumers of the leaves at f5a6c3bbf: economyFreshness.js (comment), economyStateProse.js:40 (imports the economy leaf), stateProseKernel.js. Outside src/domain/display/stateProse/ the only hit is a docblock at src/generators/narrative/settlementOriginProse.js
  - note: Zero product (component) consumers CONFIRMED at f5a6c3bbf.
- **RATIFY** [S13, PLAUSIBLE] A statement about goldens, not saves.
  - evidence: normalizeEntry :551 `createdAt: entry.createdAt || options.now || nowIso(),` — a wall-clock fallthrough that a golden recorded at freeze time would pin.
  - note: Settle: identify the golden that serialises wizardNews entries (git grep -n createdAt -- tests/fixtures tests/**/*golden*).

## §885  —  11 call(s): RATIFY 9, AMEND 2
- **RATIFY** [S13, CONFIRMED] Landing facts.
  - evidence: `git log --oneline f5a6c3bbf..2d5112851` = 6 commits (9feb645f8, 36f04bfcd, 37e285498, d4b91b26a, c8b83b25e, 2d5112851); `--shortstat` '13 files changed, 1188 insertions(+), 94 deletions(-)'; refs/preserve/landing-885-2026-09-03 → 2d5112851c2e…; all six carry 
  - note: The ledger row's '20 stages' vs package.json `check` at f5a6c3bbf = 17 stages (16 `&&`) — minor; pre-gate.mjs also says 17.
- **RATIFY** [S13, PLAUSIBLE] Prevention car proven.
  - evidence: 9feb645f8 'CURE-CAPSULE (1/1): the capsule's dirt gate stops depending on a politeness nothing stated — the hazard proved by execution first ... a parser that had no coverage at all now has seven cases'; trailer 'Lane: CURE-CAPSULE (re-based by lane CURE-CAPSU
  - note: Settle: read SP2/laneCURECAP-receipt.md control section and `npx vitest run` the capsule parser test at laneCURECAP-tree (HEAD 62be253f3, porcelain 0).
- **RATIFY** [S13, PLAUSIBLE] Cure at the annex.
  - evidence: 36f04bfcd 'FILL-LAYER: the slot contract grows its missing half — a shape — and the eight seams that printed "off its the road" print prose again'.
  - note: Settle: SP2 lane FILLLAYER receipt (laneFILLLAYER-tree HEAD adb9f19b7, porcelain 0).
- **AMEND** [S13, CONFIRMED] Attempt enumeration and the exit-signature law.
  - evidence: Four LOGGED attempts: gate-885-run1-RED-strict.log 23:06:39→23:07:10 (31 s) HEAD 36f04bfcd TRUE_EXIT=1 (domain-strict: economyStateProse.js +1); run2-RED-census.log 23:12:37→23:29:18 (1,001 s) HEAD 37e285498 TRUE_EXIT=1 (sovereigntyLightingContract.walker not 
  - note: There were FIVE launches: one unlogged parse death plus four logged runs. The §885 list drops the writerReach-red run (c8b83b25e, 1,136 s) as an attempt, while §885.1's '31 + 1,001 + 1,136 + 1,214' co
- **RATIFY** [S13, CONFIRMED] Defect in a reached line.
  - evidence: run1 log: '[domain-strict] strict-type regressions in the domain kernel ... src/domain/display/stateProse/economyStateProse.js: 1 strict errors (baseline 0) — +1'; car 37e285498 '§885 cure 1/1: the fill-layer car changed a slot's type and an existing consumer 
  - note: The behaviour-identity claim (`text(undefined)` returns '' and legibilityRung drops '' as it drops undefined) is PLAUSIBLE here; settle: git show 37e285498 and read legibilityRung.js at that sha.
- **RATIFY** [S13, CONFIRMED] Process defect.
  - evidence: run2 log :394-395 '1 failing test(s) NOT in the frozen census: tests/lint/sovereigntyLightingContract.walker.test.js :: the sovereignty lighting condition — a marker is EVIDENCE only in a live title'; :403 'Frozen census is 10 failing test(s), measured at d124
  - note: The 18-minute figure = 1,001 s, exact.
- **AMEND** [S13, CONFIRMED] Instrument misreports its governing budget.
  - evidence: run3 log: 'TIMEOUT · ran 21758ms against a 300000ms budget (vite.config.js testTimeout; the file also declares 300000ms) — vitest serialises a timeout kill as `Error: STACK_TRACE_ERROR`'. vite.config.js:892 `testTimeout: 20000,`. check-test-ratchet.mjs:818 `co
  - note: Substance holds and the mechanism is now named: the message prints max(config, file literals) under the CONFIG's source label. The row's quotation truncates the message — it also says '; the file also
- **RATIFY** [S13, CONFIRMED] Cured as the instrument prescribes.
  - evidence: 2d5112851 stat: 'tests/lint/writerReach.walker.test.js | 2 +-' with the only hunk `-  });` / `+  }, 120_000);` (now :525). scripts/.test-ratchet-baseline.json at 2d5112851: 10 `"file":` entries, none for writerReach; vite.config.js testTimeout still 20000. Ins
- **RATIFY** [S13, CONFIRMED] Declared limits.
  - evidence: `git log --format='%h %ad' -1 f5a6c3bbf -- tests/lint/writerReach.walker.test.js` → 5e324d614 2026-09-02, i.e. the file and its budgets predate the consist; the per-test-durations gap is stated in the row itself.
- **RATIFY** [S13, CONFIRMED] Discipline honoured.
  - evidence: update-885-run1-REFUSED.log (1,095 B) TRUE_EXIT=1, UPDATE_END 2026-09-02T23:51:24Z; update-885.log (575 B) TRUE_EXIT=0, UPDATE_END 2026-09-03T00:12:42Z, UPDATE_PORCELAIN_POST=[ M scripts/.test-ratchet-baseline.json ]. Both on disk; c8b83b25e's title records wr
- **RATIFY** [S13, CONFIRMED] Predictions matched.
  - evidence: tests/lint/.lighting-census-baseline.json: f5a6c3bbf files 2503 / parked 370 / credited 2133 / titles 22665 / suiteTitles 6099 → 2d5112851 2503/370/2133/22676/6101 (titles +11, suiteTitles +2). scripts/.test-ratchet-baseline.json: totalTests 30962 → 30973 (+11

## §885.1  —  10 call(s): RATIFY 10
- **RATIFY** [S13, CONFIRMED] Lane facts.
  - evidence: One commit 41a565e8b 'PREGATE: the cheap half of the gate learns to report every failure at once...'; diff --stat 'scripts/pre-gate.mjs 215, scripts/pre-gate.sh 36, scripts/register-preflight.mjs 570 — 3 files changed, 821 insertions(+)'.
  - note: The lanePREGATE-tree dock now sits at 9a95d6799 (later work), porcelain 0.
- **RATIFY** [S13, CONFIRMED] Honest savings model.
  - evidence: Timestamps give exactly 31 / 1,001 / 1,136 / 1,214 s (sum 3,382). msg-pregate.txt: 'fourteen stages, 88.0 seconds, of which lint is 58.9'; C2 'At base f5a6c3bbf and tip 37e285498 ... BLOCKER on both registers ... exit 1, in 0.9 seconds. That gate spent 1,001 s
  - note: The 2,439 s counterfactual is the lane's model (PLAUSIBLE); the measured inputs reproduce.
- **RATIFY** [S13, CONFIRMED] Right target, honest figure.
  - evidence: msg-pregate.txt C2: 'At the run-4 tip 2d5112851 it returns CAUTION, not a red, and that gate was green'. Lighting baseline measuredAtSha at 2d5112851 = 37e285498 confirms the refreeze predates the tip. 88.0 s stated with load caveat in the row.
  - note: Not re-executed; the receipt's own figures are quoted.
- **RATIFY** [S13, CONFIRMED] Instrument audited itself.
  - evidence: :29-30 'called a src-only consist CLEAR for the ratchet, which is a FALSE GREEN — the one output class this instrument may never produce. So a register declares one group per input set, and CLEAR'; :43 'BLOCKER (exit 1) — the inputs moved and the register was 
  - note: The measuredAtSha re-derivation discriminator is at :291-300.
- **RATIFY** [S13, CONFIRMED] Registers frozen before the last cure.
  - evidence: tests/lint/.lighting-census-baseline.json:27 `"measuredAtSha": "37e285498924655df568ff4204a24ceb1c4ad48a"`; scripts/.test-ratchet-baseline.json:3 `"measuredAtSha": "d4b91b26ac8825ce52c2cb063b5ec2b197f83702"`; consist order 9feb645f8 → 36f04bfcd → 37e285498 → d
- **RATIFY** [S13, CONFIRMED] Currency by execution.
  - evidence: 2d5112851: '1 file changed, 1 insertion(+), 1 deletion(-)'; hunk `-  });` `+  }, 120_000);`. gate-885.log TRUE_EXIT=0 at GATE_HEAD_POST=2d5112851; the ratchet line 'writerReach is NO LONGER a known red ... explicit 120000ms budget against a measured 21758ms ex
- **RATIFY** [S13, CONFIRMED] Ordering law banked.
  - evidence: Harmlessness rested on a title-neutral car 6 that nobody checked before landing; a `test(...)` addition would have moved titles/totalTests behind both registers.
  - note: No gate enforces it; register-preflight's CAUTION arm is the closest instrument.
- **RATIFY** [S13, CONFIRMED] Scheduling ruling.
  - evidence: SP carries pregate-889.log, pregate-890.log, pregate-891.log, pregate-enc.log, pregate-enc2.log and run-pregate-889/890/891.sh — the instruments were used from the dock at every later landing.
  - note: Whether they landed with TRAIN 1 is outside this slice.
- **RATIFY** [S13, CONFIRMED] Design choices.
  - evidence: pre-gate.mjs:24-25 'THE CHEAP/EXPENSIVE SPLIT IS ALSO DERIVED, AND IT FAILS SAFE. A stage is EXPENSIVE only if its resolved command text ... names' one of EXPENSIVE_MARKERS (:55, :119); :181-182 `const bin = st.name === null ? 'sh' : 'npm'; spawnSync(bin, argv
  - note: '27 of 29' and the APFS-clone/branch choices are the lane's report (PLAUSIBLE; settle: `node scripts/register-preflight.mjs` at lanePREGATE-tree and `ls -la lanePREGATE-tree/node_modules`).
- **RATIFY** [S13, CONFIRMED] Deferrals written down.
  - evidence: register-preflight.mjs unknown map: 'parked: needs the espree grammar in sovereigntyLightingContract.walker.test.js', 'titles: needs the espree grammar — a title counts only if its opener resolves', 'totalTests: needs collection'. msg-pregate.txt: 'prints `UNK

## §885.2  —  16 call(s): RATIFY 11, AMEND 5
- **RATIFY** [S14, CONFIRMED] three surfaces saying three different things is unachievable, not merely unwise
  - evidence: thin.log: every DS-GEN-1 pool's mark multiset = ["minor","major","major","catastrophic","minor"] (10 pools, exactly one catastrophic each); RECEIPT_POOLS_DOSSIER_STATE.md:5035 'TRIPLE-RENDER NOTE (R-DST-W4-d): HistoryTab, PowerTab and OverviewTab all render th
  - note: Refutation attempt: could an angle-keyed draw still vary at minor/major? Yes, but the note specifies per-surface angles for ALL renders and at catastrophic only one variant survives, so the note canno
- **AMEND** [S14, CONFIRMED] a later owner ruling makes R-DST-W4-d contrary to owner doctrine
  - evidence: annex note authored 9a9094a33 2026-08-03; CHAIR-AMENDMENT-angle-is-a-ladder.md:3 'Withdrawn 2026-09-02 by owner ruling. The chair proposed selecting the prose ANGLE by reader intent... THE OWNER REFUSED IT, on two grounds' / :7 'The angles were authored as ant
  - note: The ruling exists and post-dates the annex (09-02 > 08-03), so J1's second ground holds in substance. But the brief-DARKREADER-REDESIGN.md citation 'Ledger §883.7 ... carr[ies] it' is false: the owner
- **RATIFY** [S14, CONFIRMED] preserves the option with its price attached
  - evidence: DESIGN-dark-reader-recut.md R5: 'PARKED, PRICED, NOT REJECTED: if the owner later rules that one block may speak at two positions, this is the correct mechanism and should be re-costed then' — and 'it adds a mount term to the draw key, which is behind the one-
  - note: Craft judgment; the price (draw-key term behind the one-way door) is named in the design, so the park is honest.
- **RATIFY** [S14, CONFIRMED] no generator change, no regeneration, no annex edit; the alternative disturbs seven byte-identical leaves
  - evidence: f60457296 adds STATE_MARK_DIMENSIONS to stateProseKernel.js only (numstat 116/6 kernel, 0 lines under src/data); kernel imports: grep '^import' on base and tip → none; leaves: 6 src/data/dossierStateProse/*.generated.js + 1 dossierCausalProse.generated.js = 7
  - note: Veto shape ('move it when a generator change happens anyway') is now live: C9 (8029536bb, landed §889) DID change the generator and moved four leaves 584 bytes — nobody re-asked J3 then. Flag for the 
- **RATIFY** [S14, CONFIRMED] DS-GEN-9 founding is unmarked; DS-GEN-6 tier overlay: city is mixed
  - evidence: DS-GEN-9 'founding' pool (general.generated.js:3546ff): 7 variants, angles elder/ledger/street/visitor/counterforce/elder/street, ZERO 'marks' keys; DS-GEN-6 'tier overlay: city' (:2608ff): 3 variants, two carry 'marks', the visitor variant carries none
  - note: A per-block rule would either mark 'founding' (wrong) or unmark the city overlay (wrong). Forced by the data as stated.
- **RATIFY** [S14, CONFIRMED] R-DST-K already means silence; a throw on a display path is worse than a blank
  - evidence: kernel tip: 'if (typeof value !== "string" || !STATE_MARK_DIMENSIONS[dimension].includes(value)) return [];' with comment 'Not a throw — this is a display path, and a blank surface beats a crashed one'; drawVariant: '!Array.isArray(eligible) || eligible.length
  - note: Mutant A/B logs show the null is what T2 asserts ('reads NOTHING from a partitioned pool the caller did not answer').
- **AMEND** [S14, CONFIRMED] parser repair separable from routing decision
  - evidence: memory :29 'Against the EIGHT the shipped rule left 26 of 45' blocks unroutable; 8029536bb 'the SECTION-TARGET parser stops splitting on a comma... four prose leaves move 584 bytes' landed in 30c1667bc
  - note: Ruling holds; the figure is 26 of 45 (58%), not '50%'. Wording should carry the measured figure.
- **RATIFY** [S14, CONFIRMED] an assert-to-zero needs an eleventh known-failure slot and there is none
  - evidence: baseline entries = 10; thin.log 'MODE player: states=58 thin=14' so an assert-to-zero is red today; §886 row: 'ratchet 10 known of 30,994 against a ceiling of 10'
  - note: The flag is correct and the re-ask trigger ('census gains headroom by curing a banked failure') is well-formed. The ceiling constant's source location was not located by grep in check-test-ratchet.mjs
- **RATIFY** [S14, CONFIRMED] consistent with the owner's ruling that the reader chooses depth
  - evidence: legibilityRung.js exists (2 hits) and economyStateProse.js uses it (6 hits); CHAIR-AMENDMENT-angle-is-a-ladder.md GROUND 2: 'The depth problem is ALREADY solved correctly by legibilityRung... the reader chooses depth by where they look and the software guesses
  - note: Same durability caveat as J1 ground 2: the owner framing is recorded only in the scratch note.
- **RATIFY** [S14, CONFIRMED] follows in-tree precedent rather than inventing a scheme
  - evidence: vite.config.js:520 'manualChunks(id) {' and :600 '// ── T13 Car 4 (v): detPow JOINS THE LAZY SIDE, and this rule is MEASURED ──'
  - note: Precedent confirmed; the naming choice itself is taste and unexercised in my slice's commits.
- **RATIFY** [S14, CONFIRMED] C9 is free at any time
  - evidence: drawVariant: 'avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`))' — no sectionTarget; kernel's only sectionTarget is a typedef property (:59); generator writes block.sectionTarget at :330 in the parser branch, pool keys minted elsewhere
  - note: C9 later landed at §889 without a golden shift to the draw — consistent.
- **AMEND** [S14, CONFIRMED] fixing the import would inline a live engine string the generator deliberately refuses
  - evidence: economy.generated.js:4-6 '// A canonical row that IS a live engine string is IMPORTED, never inlined — see LIVE_STRING_BINDINGS in the generator.' + 'import { ECONOMY_FRESHNESS_SENTENCES }'; generator :89 'const LIVE_STRING_BINDINGS = ['; grep 'no imports|impo
  - note: The keep-the-import half is sound. The 'docblock that claims the leaves are import-free' could not be located at 2d5112851; the row (and §884.5) should name the file:line or drop the correction. EVIDE
- **RATIFY** [S14, CONFIRMED] banked debt today, customer-visible the day a desk lights; lane default 'none' is correct
  - evidence: DESIGN-dark-reader-recut.md O1: 'Conservative default until ruled: none — this genuinely blocks the first desk car, and it is not the chair's to absorb'; .test-ratchet-baseline.json cause: 'The residual 338 stay with the owner-signed T5-ONE-REGEN constituent'
  - note: Correct routing of an owner-signed ONE-REGEN constituent; superseded within the hour by §885.3's grant.
- **AMEND** [S14, PLAUSIBLE] the restrictive read is the safe one until ruled
  - evidence: PublicDossierView.jsx:115 '<OutputContainer settlement={settlement} readOnly playerView={!shareDm} .../>'; OutputContainer.jsx:446 'const publicDossier = readOnly && !saveId;' :703 "case 'economics': return <EconomicsTab settlement={s} narrativeNote={null} sav
  - note: The default is stated but the desk car the chair dispatched under it (DESK CAR 1, in the unlanded §891 train) wires state prose into a tab OutputContainer renders for public dossiers with no gate. Set
- **AMEND** [S14, CONFIRMED] acceptable to operate under; the ratchet only falls
  - evidence: thin.log 'MODE player: states=58 thin=14' / 'MODE dm: states=58 thin=13'
  - note: Operating rule holds; the bill is 14 (player read), corrected by §885.4 itself. §885.2/§885.3 should carry 14.
- **RATIFY** [S14, CONFIRMED] stops being a blocker because the angle axis was refused
  - evidence: 3·(1−(2/3)^10) = 3·(1−0.01734) = 2.948; design line 214 'E[distinct] = 2.95 of 3'
  - note: Arithmetic checks; the 'ten settlements' premise is the design's model, not a product measurement.

## §885.3  —  7 call(s): OUT-OF-SCOPE 1, RATIFY 4, AMEND 2
- **OUT-OF-SCOPE** [S14, PLAUSIBLE] owner re-grant in chat
  - evidence: quoted identically in ledger line 32384 and the stratum
  - note: An owner act; consistent with the 08-10 full-delegation memory. Unverifiable from receipts.
- **RATIFY** [S14, CONFIRMED] cheap now, permanent later; ratchet can only fall
  - evidence: d32bb8832 '§888: the 338 reader-facing em dashes leave...' IS ancestor of 30c1667bc (§889) and ca651d54b; NOT ancestor of bbba1be24 (§888); em dashes in general.generated.js: 2d5112851=34, ca651d54b=1, 4233031ba=1; DESK CAR 1 a59e66e5a IS ancestor only of the 
  - note: Within the grant (taste, VOICE_AND_TONE §3, banked debt) and honoured in execution: the cure landed at §889, the first desk car is still unlanded in §891. Nit: the cure car is titled '§888' but rode t
- **RATIFY** [S14, CONFIRMED] register law makes wording testable, so no longer taste-without-a-rule
  - evidence: R1_FORBIDDEN defined in rumorFallbackPhrasePools.test.js:246, rumorPhrasePools.test.js:190, newsSubjectVocabulary.walker.test.js:428; chair review exercised at §885.5
  - note: The frame-fit law is still untestable (as §885.5 admits); the review was done — see my §885.5 wording entry.
- **RATIFY** [S14, CONFIRMED] holding a wave for corpus authoring inverts the cost
  - evidence: thin.log 14/13; T4 pins both audiences (f60457296 commit text: 'T4 pins both so neither audience can drift unseen, and adds a zero-tolerance arm for a state going silent')
  - note: Bill figure should read 14.
- **RATIFY** [S14, CONFIRMED] survive every delegation by nature
  - evidence: MEMORY index: 'FULL DELEGATION GRANT... carve-outs BY NATURE: legal, cull, tuning signature, each push'; 'TAIL RULED 08-06 walk + ONE REGEN BEFORE the terminal soak; TUNING IS LAST'; CLAUDE.md §3 lists 'paid-surface behavior' as owner-gated
  - note: Correct list. But see O2 entry: stating the paid-surface default is not the same as implementing it.
- **AMEND** [S14, CONFIRMED] an owner ruling exists whose ground the chair would be guessing at
  - evidence: ledger grep LEG-7 → only §884.5; grep 'de-slug|DEFECT-1/2/3|J-LEG-4|coup_detat' → nothing; RECEIPT_POOLS_LEGACY.md:2874 'LEG-7 — OWNER-GATED, SEPARATE COMMIT. The DEFECT-1/2/3 de-slugging... Do not bundle either into a pool-wiring wave' (lane-authored annex, 2
  - note: LEG-7 is a lane-authored wiring note that ROUTES the de-slugging to the owner; no owner ruling on the twelve exists in the ledger. The non-exercise is still defensible on its other two grounds (not on
- **AMEND** [S14, CONFIRMED] execution order
  - evidence: NEWSTRAIN cars 7d0987ea0/6c862159e/e2f4993cf landed in §886 (d1a6c773e); KERNELMARK C1 63f706b31 NOT ancestor of d1a6c773e, IS ancestor of f12360185 (§887); DESK CAR 1 a59e66e5a in the unlanded §891 train
  - note: The stop line and gated items are right; the executed order was TRAIN 2 then TRAIN 1 (§886 then §887). Harmless (independent cars) but the row's order is not what happened; record the swap.

## §885.4  —  16 call(s): RATIFY 16
- **RATIFY** [S14, CONFIRMED] as stated
  - evidence: f60457296 parent 2d5112851c2ef...; numstat 116/6 stateProseKernel.js, 173/0 dossierStateProseProjection.contract.test.js, 98/1 stateProseKernel.test.js; commit.log '3 files changed, 387 insertions(+), 7 deletions(-)'
  - note: 'porcelain 0' at the time is not re-derivable; the dock now sits at 4233031ba with one foreign dirty path.
- **RATIFY** [S14, CONFIRMED] the binding constraint held
  - evidence: diff exit: 0; md5 05d317921e8e7a41518ecad548abc1e8 for both; body 'return eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length];'
  - note: Also: 63f706b31 (the landed rebase) carries the same kernel per its landing at §887; not re-diffed.
- **RATIFY** [S14, CONFIRMED] pure headless leaf preserved
  - evidence: no matches at 2d5112851 or f60457296
- **RATIFY** [S14, CONFIRMED] em=0 bang=0 under the scanner's logic
  - evidence: added lines with '—': 3, all comment lines ('* @property ... inline marks — `dm-only`', '* projection did not demote a dimension into —', '// ... Not a throw — this is a display path'); added lines with '!': one, "typeof value !== 'string' || !STATE_MARK_DIMEN
  - note: 'four apparent bang hits' is a grep artefact of `!==`/`!` on one line; substance holds.
- **RATIFY** [S14, CONFIRMED] gate and filter proven independently
  - evidence: ctl1: 'TypeError: poolDimensions is not a function' / 'Tests no tests'; ctl2: '2 failed | 17 passed (19)' × 'reads NOTHING from a partitioned pool...' × 'never returns a variant that contradicts...'; ctl3: '1 failed | 18 passed (19)' × contradicts only; tip: '
  - note: I re-derived the byte-identity of mutant A's reader body myself; the mutant script uses replaceOnce with uniqueness aborts, so the mutation is exact.
- **RATIFY** [S14, CONFIRMED] 24 pools ignoring severity/deficit/anchor
  - evidence: 'expected { spoke: [ …(24) ], mute: [] } to deeply equal { spoke: [], mute: [] }' listing 10 DS-GEN-1 + 6 DS-GEN-6 + 8 DS-GEN-9 pools, e.g. 'DS-GEN-1 :: leadership_vacuum :: The absence at the top of X is no longer being waited out'
  - note: 24 = the census's 'POOLS with >=1 dimension = 24'.
- **RATIFY** [S14, CONFIRMED] a car after a register act is refused per §885.1
  - evidence: lint4-BASE 'Tests 5 failed | 110 passed (115)'; lint4-TIP 'Tests 6 failed | 109 passed (115)' with the added FAIL 'sovereigntyLightingContract.walker.test.js > THE CENSUS IS AN ASSERTION'; titles-both.log 'expected 22680 to be 22676'; .lighting-census-baseline
  - note: §885.1 (ledger 32382) is the cited law: register acts must be the LAST cars.
- **RATIFY** [S14, CONFIRMED] counting arms would predict +6 and be wrong; proven by isolation runs
  - evidence: titles-kernelOnly.log (contract at base, kernel test at tip): 'Tests 1 passed | 33 skipped (34)' i.e. census PASSED at the pinned figure; titles-contractOnly.log: 'expected 22680 to be 22676'; titles-both.log same +4; kernel test carries top-level 'for (const 
  - note: The isolation proof is executed and decisive. The 'PARKED' attribution is consistent with the walker's rules but I did not run parkReasonsFor on the file; settling command: `npx vitest run tests/lint/
- **RATIFY** [S14, CONFIRMED] an instrument that stops at its first mismatch under-reports its own drift
  - evidence: suite-probe bumps '"titles": 22676' → 22680 in the register, runs, restores (REGISTER_RESTORED cmp); suiteprobe.log 'expected 6102 to be 6101' at walker :7462; the files assertion sits at :7446 and titles precedes suiteTitles
  - note: A real instrument defect, not just a lane inconvenience: the walker cannot report two drifts in one run.
- **RATIFY** [S14, CONFIRMED] O3's bill moves to 14
  - evidence: thin.log 'infiltration_fear: ["minor","major","major+dm-only","catastrophic","minor"]' and 'MODE player: states=58 thin=14 / MODE dm: states=58 thin=13'; census.log lists 'DS-GEN-1 :: infiltration_fear :: severity=major -> 1' among 14 thin states
  - note: Moves an owner row (O3) — §885.2/§885.3 still say 13.
- **RATIFY** [S14, CONFIRMED] DS-GEN-1's 30 states split 19 multi-voiced / 11 thin (player)
  - evidence: census.log THIN states: 11 DS-GEN-1 entries (10 catastrophic + infiltration_fear major) of 30 DS-GEN-1 states; DM read drops infiltration_fear major → 10
  - note: Same fact as (1) restated per block.
- **RATIFY** [S14, CONFIRMED] design stale by 11
  - evidence: baseline '"totalTests": 30973'; DESIGN-dark-reader-recut.md:460 '`totalTests 30962`, `totalFiles 2451`'
- **RATIFY** [S14, CONFIRMED] T1 pins the measured figure
  - evidence: census.log 'CAUSAL MARKS distinct = 92' / 'CAUSAL marks intersecting dimension vocabulary = 0'; design :200 '105 causal arm names, zero in the dimension vocabulary'
- **RATIFY** [S14, CONFIRMED] as stated; the §885 gate typechecked 173/173 in its own dock
  - evidence: package.json:103 '"@types/node": "25.6.0"', :119 '"pg": "^8.22.0"'; ls node_modules/@types/node and node_modules/pg → 'No such file or directory'; dock entries are symlinks to /Users/cstokes/Desktop/settlement-engine/node_modules/...; ledger 32381 'typecheck *
  - note: Real hazard, correctly labelled PLAUSIBLE by the lane (no typecheck run).
- **RATIFY** [S14, CONFIRMED] the car carries the seat trailer and no co-author line
  - evidence: f60457296 / 4b00f971b / af838ffbb / 0362adcd4: 0 'Co-Authored-By' lines each, 1 'Seat: Opus 5 — Fable-unvalidated' line each
  - note: 'asked rather than assuming' is a chat claim — PLAUSIBLE only.
- **RATIFY** [S14, CONFIRMED] no rendered byte moves, no golden to re-record
  - evidence: git grep 'DOSSIER_STATE_PROSE_GENERAL|dossierStateProse/general' 2d5112851 -- src → only the leaf's own export line; the 24 dimension-bearing pools are all in DS-GEN-1/6/9 (census.log), i.e. in general.generated.js
  - note: Holds at 2d5112851. The §891 desk car wires economy blocks, not DS-GEN-*, so it stays true through the train.

## §885.5  —  17 call(s): RATIFY 17
- **RATIFY** [S14, CONFIRMED] as stated
  - evidence: parents: 4b00f971b→2d5112851, af838ffbb→4b00f971b, 0362adcd4→af838ffbb; files 2+5+2=9; 'tests/lint/newsSubjectVocabulary.walker.test.js | 642 ++++'; each message ends 'Seat: Opus 5 — Fable-unvalidated'
  - note: 'porcelain 0' at the time not re-derivable; dock now 9885cfb97 porcelain 0.
- **RATIFY** [S14, CONFIRMED] the cure unifies two registers rather than adding a third
  - evidence: 2d5112851:src/domain/display/settlementRumors.js:129 "conflict_pressure: 'the drums of war'", :343 "migration_pressure: 'people on the move'"; rumorPhrasePools.js:780 'conflict_pressure — doc variants 2..8; variant 1 (the drums of war) is the live'
  - note: The walker's cross-layer mirror arm (controls.log ARM 5, 'IMPACT_LABELS mirrors WHAT_PHRASES for every regional kind') now pins all twelve equal; only two of the twelve pre-existed verbatim at base — 
- **RATIFY** [S14, CONFIRMED] all twelve read in all six frames
  - evidence: IMPACT_LABELS = 12 keys exactly as listed; frames: '{Town} braces for X' / 'wakes to X' / 'has seen the last of X' / 'pays no heed to X' / 'is spared X' / 'has word of X'; e.g. 'Elmspur is spared the drums of war', 'Elmspur wakes to coffers running short', 'El
  - note: My own read of all 72: ten are clean in every frame. Two additional notes beyond the chair's: 'a shaken authority' is the weakest in the READY frame ('braces for a shaken authority' — one braces for a
- **RATIFY** [S14, CONFIRMED] software stops naming its own parameters in diegetic copy
  - evidence: wizardNews diff: NEUTRAL_SUBJECT = 'a hard turn in its fortunes'; summary fallbacks "|| 'a neighbouring town'" / "|| 'a far settlement'"; probe FALLBACK: 'A far settlement braces for the roads gone bad, come from a neighbouring town across the region.'; UNREGI
  - note: 'a hard turn in its fortunes' is negative in sign, unlike Cure B's phrase; for an unregistered REGIONAL impact that is defensible (impacts are pressures), but the two neutral subjects are not symmetri
- **RATIFY** [S14, CONFIRMED] as stated
  - evidence: sitesfinal.json: 199 sites {literal:147, prefix-family:14, resolved-token:11, unresolvable-mint:27}; literal+resolved tokens absent from WHAT_PHRASES (214 keys at base) = 38, of which 12 (ally_burden, calamity_forced, casus_declared, cold_war_supply_sanctions,
  - note: Independent recount reproduces 26 exactly. 25 of them got words in Cure B (plus 'relief' and 4 BROKERAGE_ACTS = 29), 2 deferred.
- **RATIFY** [S14, CONFIRMED] a live class, now closed
  - evidence: walker :21-23 lists the seven; :189 "return { verdict: 'unresolvable-mint', expr: rhs }"; :321 "expect(tokens.has('npc_verdict'), 'the module-constant route went dark')"; sitesfinal resolved-token tokens = the 7 npc_* + route_chartered + route_revived (11 site
  - note: HIGH item confirmed. Residual: the walker deliberately does not scan `kind:` (docblock says 93 noisy convictions) — that arm is closed by the refusal only, as the row states.
- **RATIFY** [S14, CONFIRMED] as stated
  - evidence: af838ffbb touches 4 test files; diff carries 7 'RE-AUTHORED, AND THE CHANGE IS DECLARED'-class comment lines covering the six pins named in the commit; rumorFallbackPhrasePools.test.js:398 'THE GATE IS THE REGISTRATION, NOT THE SHAPE — the 107 are byte-identic
- **RATIFY** [S14, CONFIRMED] as stated
  - evidence: brokerageServicesRules.js:59 'export const BROKERAGE_ACTS = Object.freeze([' ; Cure B adds brokerage_query/feed/intercept/plant with comment 'Their own local census in tests/domain/brokerageServices.test.js requires the word `brokerage` to survive'
  - note: The 'census caught it' narrative is the lane's; the four rows and the constant are confirmed.
- **RATIFY** [S14, CONFIRMED] same bytes by construction; canonical-at-zero preserved; two lines not 107 rows
  - evidence: commit: 'the strip computation is KEPT and gated on §4 registration... Veto looks like: author the literal table'; positive control proves all 107 still compute their canonical
- **RATIFY** [S14, CONFIRMED] address law applied against the chair-approved exemplar
  - evidence: comment: 'sourceSettlementId is optional on a hand-built impact, so a frame that named a source would ASSERT an origin the record may not hold'; probe with no source: summary 'come from a neighbouring town' (fallback), headline names one address
- **RATIFY** [S14, CONFIRMED] reader already protected; information deferred
  - evidence: walker :352 "UNROUTABLE_DEFERRED = Object.freeze(['route_chartered', 'route_revived'])" :358 exact-set pin; heraldRouting.js:410 '274 is asserted SHRINK-ONLY and has no lawful growth cure — `occupation_posture` shipped'
  - note: Both tokens render 'a matter of some moment' until routed — a documented deferral, and the §885.5 row says so.
- **RATIFY** [S14, CONFIRMED] the lane could not have known
  - evidence: 4b00f971b: 'This is mint-side and PERSISTED, which is why it wants to land before the golden freeze... THE PROMISE forbids migrating it'; §884.6 (32380): 'there is no save before this fix; we are entirely prelaunch... Cure A is NOT freeze-blocking, it is freez
  - note: Chair correctly credits the lane's reasoning while correcting its premise.
- **RATIFY** [S14, CONFIRMED] as stated
  - evidence: 'nowIso' lines in the src diff: 0; em dashes in added non-comment src lines: 0; diff --stat touches only settlementRumors.js and wizardNews.js under src; the mis-slice trigger exists: wizardNews diff comment "software's — \"a far settlement\""
  - note: Self-reported chair error confirmed as a real hazard instance (apostrophe inside a comment opening a false literal).
- **RATIFY** [S14, CONFIRMED] expect(whatPhrase('coup_detat')).toBe('detat')
  - evidence: tests/domain/rumorFallbackPhrasePools.test.js:407 "expect(whatPhrase('coup_detat')).toBe('detat');" and :408 institution_capture→'capture'
  - note: 'Execution at the tip confirms all four' is the chair's own run; not re-executed here.
- **RATIFY** [S14, PLAUSIBLE] §884.4's false-green class caught in a lane
  - evidence: final.wrap is 0 bytes (23:06:14); final1.log is a foreground run started 23:07:05 ending 'TRUE_EXIT=0' with 1179 files / 17833 tests; run.sh always appends 'TRUE_EXIT=$TRUE_EXIT'; no log or brief in SP mentions 'nohup'
  - note: The artefact pattern (empty wrapper log immediately followed by a foreground run) matches the claim; the exit-0 report itself is only in the lane's chat. Settling command: none — the launcher's stdout
- **RATIFY** [S14, CONFIRMED] not reproduced
  - evidence: final2.log (637 files, 23:26): 'npcAuthoringScope.test.jsx (16 tests | 1 failed)' × 'a public dossier denies writers...'; final.log is the 1179+637 join (same FAIL set); npc-tip.log '16 passed'; mixed-base.log (636 files) vs mixed-tip2.log (637 files) FAIL lis
  - note: Failed exactly once (final2); the 'identical batch' at base is mixed-base (636 vs 637 files, the new walker being the difference).
- **RATIFY** [S14, CONFIRMED] as stated
  - evidence: census.log: 'the estate's file count moved — re-measure, do not re-word: expected 2504 to be 2503' TRUE_EXIT=1; base baseline files 2503; brief :21 'Predict every register figure IN WRITING before its instrument runs (E4)'
  - note: The written prediction itself was not found in SP logs (chat), so 'written E4 prediction' is PLAUSIBLE; §886 later reports it landed exact.

## §885.6  —  3 call(s): RATIFY 3
- **RATIFY** [S15, CONFIRMED] TRAIN 2's --update refused on simulationRulesDialog at load 94 with nothing of the chair's running; test passes 6/6 standalone; not in blast radius; a different test than the prior writerReach refusal
  - evidence: update-886-run1-REFUSED-loaded.log: UPDATE_HEAD=108a02ef4 / UPDATE_LOAD_AT_START=1.70 4.02 28.73 / '--update REFUSED ... tests/components/simulationRulesDialog.test.jsx :: SimulationRulesDialog previews and saves a selected preset' / TRUE_EXIT=1 / UPDATE_LOAD_
  - note: Sub-claims (1) the named ps -r consumers and (2) the '6/6 standalone, exit 0' run have NO retained receipt — only the ledger's word (PLAUSIBLE; settle: none possible now, the window is gone). The refu
- **RATIFY** [S15, CONFIRMED] §885's 'passed at load 47, failed at load 3.8 DISPROVES the load diagnosis' over-stated; the cure stands on the 21,758 ms > 20,000 ms arithmetic
  - evidence: ODQ:32381 '...which **DISPROVES** the earlier lane's load diagnosis rather than inheriting it; the real cause is that it blew the suite-wide testTimeout: 20000 at 21,758 ms.' Three later runs show start-low/end-high: update-886-run1 1.70 -> 94.64; ratchet-enc 
  - note: The refinement is the correct reading and is later strengthened at §887.2 (duration, not start). The §885 cure's warrant (budget arithmetic) is independent, as the row says.
- **RATIFY** [S15, CONFIRMED] Dock at 108a02ef4, 4 cars over 2d5112851, census 2504/370/2134/22696/6110; resume when build_hd_index gone and 1-min load < ~5
  - evidence: git log: 108a02ef4 <- e2f4993cf <- 6c862159e <- 7d0987ea0 <- 2d5112851 (4 cars). 108a02ef4 diff: files 2503->2504, credited 2133->2134, titles 22676->22696, suiteTitles 6101->6110 (parked untouched). update-886.log: UPDATE_LOAD_PRE=2.29 2.35 3.98 / UPDATE_LOAD
  - note: The load half of the condition is evidenced (1.90). The process half ('build_hd_index gone from ps -r') has no retained ps receipt; §886's 'checked, not assumed' rests on the load figure alone (PLAUSI

## §885.7  —  20 call(s): RATIFY 16, AMEND 3, EVIDENCE-THIN 1
- **RATIFY** [S15, CONFIRMED] general -413 -> 182,623; power -83 -> 81,910; defense -51 -> 111,938; warFaith -37 -> 115,928; economy, stressors, causal 0
  - evidence: general 183036->182623 (-413); power 81993->81910 (-83); defense 111989->111938 (-51); warFaith 115965->115928 (-37); economy 90337->90337; stressors 59482->59482; src/data/dossierCausalProse.generated.js 210454->210454. Sum -584. numstat: 4 leaves touched, ec
  - note: Every figure exact, recomputed from the objects.
- **RATIFY** [S15, CONFIRMED] Legitimate, dark, stated rather than discovered
  - evidence: commit c461dc296: '⛔ THE DECLARED SHIFT: THE LEAVES ARE NO LONGER BYTE-IDENTICAL. The lane before this one found the seven prose leaves byte-identical across its work and treated that as a proven property. This car breaks it, deliberately, on four of the seven
  - note: Declared in the car's own message; no golden owed since no variant text moved (consistent with T6-style byte-identity claims elsewhere).
- **RATIFY** [S15, CONFIRMED] The brief's and the design's figures do not reproduce; the conclusion survives only because the causal leaf is byte-identical
  - evidence: PARENT census: declaring blocks 45 | >=1 string outside the eight: 26 | outside the ten: 13 | distinct strings: 30. TIP census: 68 state blocks, 43 with sectionTarget, 25 without; distinct strings 10 = defense,economy,faith,history,overview,population,power,re
  - note: 26/13 and 30 distinct strings reproduce exactly from the parent leaves; the three live readers and the test arm all read causalFamily().sectionTarget, i.e. the causal leaf, which measured delta 0.
- **RATIFY** [S15, CONFIRMED] A brief that carries a live reading must timestamp it or omit it
  - evidence: brief-PARSER.md:7 '⚠⚠ **THE BOX IS UNDER HEAVY EXTERNAL LOAD RIGHT NOW** — Apple Remote Desktop`s build_hd_index (two instances) and a macOS find sweep, load ~60-90 on 8 cores, none of it ours.' The same sentence is in brief-REGISTRY.md:7. The lane's measured 
  - note: The brief carried the transient figure untimestamped (CONFIRMED); the lane's counter-reading is PLAUSIBLE only. The chair's self-report is accurate.
- **RATIFY** [S15, CONFIRMED] No governed migration is owed; the landing takes the --write
  - evidence: check-observed-shape-readers.mjs:2700 (at c461dc296) " These are generated/data inputs, not detector sources, so the shrink-only". §887 register 2/3 = 342cccd90 'the observed-shape baseline refrozen, exactly as the parser lane predicted'; baseline at 342cccd90
  - note: Executed as predicted; figures unchanged, input fingerprint only.
- **RATIFY** [S15, CONFIRMED] The registry is empty at birth by design; the corpus's darkness is a number
  - evidence: dossierMounts.js:102 'export const DOSSIER_MOUNTS = Object.freeze([]);' :116-136 UNMOUNTED_BLOCKS list; probe: 'DOSSIER_MOUNTS length: 0 UNMOUNTED_BLOCKS length: 68 unique: 68'; file has no import statement. 5e749a0b0 --stat: mutation-coverage-manifest.json +4
- **RATIFY** [S15, CONFIRMED] rung is a field on every row; the router answers with at most one position or nothing
  - evidence: dossierMounts.js:175-181 'export function sentenceMountForBlock(blockId) { ... const speaking = DOSSIER_MOUNTS.filter((row) => row.blockId === blockId && row.rung === MOUNT_RUNGS.SENTENCE); return speaking.length === 1 ? speaking[0] : null; }' Probe: sentenceM
  - note: length === 1 is the fail-closed shape: two claimants return null, not first-wins.
- **RATIFY** [S15, CONFIRMED] Striking DS-CND-1 from the dark half reds the totality arm alone (15 passed, 1 failed)
  - evidence: mutation-sweep.sh (+): '# 48. TRAIN 1 C2 — THE MOUNT REGISTRY'S TOTALITY LAW ... Strike DS-CND-1 from the dark half without mounting it anywhere.' then perl -0pi -e "s/  'DS-STR-1', 'DS-STR-2', 'DS-CND-1',\n/  'DS-STR-1', 'DS-STR-2',\n/" + check_caught 'dossie
  - note: 15+1 = 16 arms, matching §887's '16 arms'. The plant's execution result is the lane's word (PLAUSIBLE; settle: sh scripts/mutation-sweep.sh entry 48 on a dock at 0fdbc53a0).
- **RATIFY** [S15, CONFIRMED] The lane refused three design figures
  - evidence: eslint.config.js:665 files: ['src/components/**/*.jsx'] / :667 'max-lines': ['error', { max: 600, skipBlankLines: true, skipComments: true }]. package.json:109 "eslint": "^10.4.0" (flat-config era). recut:434 'npx eslint --no-eslintrc --rule ...' (a legacy-con
  - note: The eslint-command claim is PLAUSIBLE by version (eslint >= 9 rejects --no-eslintrc); settle with `npx eslint --no-eslintrc` in any dock. The T5 arm-1 correction is CONFIRMED by reading the arm's defi
- **AMEND** [S15, CONFIRMED] A measured correction to the ratchet's reputation
  - evidence: check-test-ratchet.mjs:97 'export const SCOPE_FLOOR_RATIO = 0.9;' :1117-1123 '(2) COUNT FLOOR ... if (baseline.totalTests && rows.length < floor)'; :1139-1144 '(2b) FILE FLOOR ... if (baseline.totalFiles && totalFiles < fileFloor)'. No growth ceiling on either
  - note: True of the TEST RATCHET's two totals. The sentence 'a new test file does not red without a refreeze' is over-broad as written: the LIGHTING census's `files` arm does red on a new test file (§886 and 
- **AMEND** [S15, CONFIRMED] The multi-lane form of registers-last
  - evidence: 5e749a0b0 touches no .lighting-census-baseline.json or .test-ratchet-baseline.json. Message tail: 'NOT TAKEN, and owed to the landing: scripts/.test-ratchet-baseline.json moves by one file and sixteen tests. Registers are the landing's act, never a lane's.' Th
  - note: The refusal is CONFIRMED; the quoted reasoning is chair-transcribed from a lane report that was not retained — mark the quotation as such. Its prediction (+1 file, +16 tests) plus KERNELMARK's +6 sums
- **AMEND** [S15, CONFIRMED] The lane built ENC-1 and refused the rest rather than absorbing a row
  - evidence: DESIGN_ENCOUNTERS.md:714 'The build lane may cut the dock and author ENC-1 immediately; **ENC-2 is blocked until §12 rows 1, 5 and 5b are answered**, and ENC-5 until rows 2 and 3.' bbe56b957 (09-03 00:59): '⛔ NO OWNER ROW ABSORBED ... the seventeen rows of DES
  - note: The lane's conduct (refuse to absorb a row) was right for its brief. The chair's framing 'only one car buildable' was FALSE when written: rows 1/2/3/5/5b were ruled the day before. §887.1 corrects it,
- **RATIFY** [S15, CONFIRMED] 'The arm exists because the plant found its absence'
  - evidence: test.js:276-281 "test('P1 GUARD — the CENSUS itself is a function of its inputs, drawn from no ambient source', () => { // ⚠ THIS ARM EXISTS BECAUSE THE PLANT FOUND ITS ABSENCE. A `Math.random()` planted in the resident pick passed the whole suite: the resolut
  - note: The arm and its origin are recorded in the shipped test itself; the plant run is the lane's word.
- **RATIFY** [S15, CONFIRMED] The design's 'equivalently npcTraitPlane walked by disclosed axes' was FALSE until planeFromChart existed
  - evidence: leaf:388-393 planeFromChart docblock: 'Not every legacy personality word has an axis home: `ambitious` carries a real plane lean and lives in no axis, so an axis-only projection silently drops it ... The design's "equivalently `npcTraitPlane` walked by disclos
  - note: Defects 2 and 3 are CONFIRMED in the shipped source. Defects 1 (axis id dropped) and 4 (eighth arm no receipt) are PLAUSIBLE only — the lane's build receipt is not retained; settle: none cheaply (the 
- **RATIFY** [S15, CONFIRMED] Four cures at source, no ceiling raised
  - evidence: tuningRegister.walker.test.js:85 'UNITLESS_TABLE_CEILING: 220,' and :506 computes it as tables with r.unit === null. leaf:142 'export const CHANCE_MEETING_TUNING_PROVENANCE = Object.freeze({'. test:147-150 'the provenance is unsigned and the table is frozen' e
  - note: The structure is CONFIRMED; the 220->221 counterfactual is PLAUSIBLE by construction of the ceiling's own formula.
- **RATIFY** [S15, CONFIRMED] Its list is identical to the control
  - evidence: Nine added lines in src/domain carry an em dash; all nine are comment/docblock lines (e.g. '+ * envoyChanceMeeting.js — ENC-1.', '+  // Rule 5 — traveller x traveller', '+  // T1 — how different the target is'); none is inside a string literal.
  - note: The committed state carries 0 string-literal em dashes; the 'three cured' pre-commit state is the lane's word.
- **EVIDENCE-THIN** [S15, PLAUSIBLE] A tuning value; tuning is gated
  - evidence: No retained receipt outside the ledger copies (queue-*.md) carries '0.6%' or the factor; the test file at bbe56b957 has no such arm. The tuning table ships draft: bbe56b957 message 'Every tuning value lands draft and unsigned, the register row is declared with
  - note: The figure cannot be re-derived from anything retained. 'Moved no rung' is consistent with the draft/unsigned register (CONFIRMED). Settle: a scratch driver over resolveChanceMeeting at the worst-case
- **RATIFY** [S15, CONFIRMED] The leaf is dark and can end no one
  - evidence: leaf:84 outcome vocabulary "'nothing', 'bond', 'respect', 'rivalry', 'compromised', 'rejected', 'exposed'" — no ousting/death/verdict outcome. Importers under src at ea8451bbb: only habitForkRegistry.js, and that hit is the registry's `module: 'src/domain/worl
  - note: The '0/525 goldens' figure has no retained receipt (PLAUSIBLE; it follows from no importer).
- **RATIFY** [S15, CONFIRMED] A chair-authorized registry mint, recorded beside the constant
  - evidence: habitForkRegistry.js (+): HBF-36 drawMeet STAY; HBF-37 drawPick STAY; HBF-38 drawApproach DEFER + closeOwed; HBF-39 drawMark DEFER + closeOwed; HBF-40 drawCompromise DEFER + closeOwed; HBF-41 drawExposure DEFER + closeOwed. ea8451bbb diff: '-const DEFER_CEILIN
  - note: Six rows, four DEFER (31+4=35) and two STAY, exactly as both messages say. The 'expected 35 to be 31' red text and the 8/8 are the chair's word (PLAUSIBLE; settle: npx vitest run tests/lint/chooserTot
- **RATIFY** [S15, CONFIRMED] TRAIN 1 composes to three
  - evidence: f60457296 parent 2d5112851; c461dc296 parent f60457296; 5e749a0b0 parent f60457296; bbe56b957 parent 2d5112851; ea8451bbb parent bbe56b957. §887 landed 7 cars: 63f706b31 (C1), 8029536bb (C9), 0fdbc53a0 (C2+C3) + 4 chair cars.
  - note: Lane cars were rebased (new shas) onto d1a6c773e for the landing; the composition arithmetic holds.

## §885.8  —  3 call(s): EVIDENCE-THIN 1, RATIFY 2
- **EVIDENCE-THIN** [S15, PLAUSIBLE] A consolidation is not a fold
  - evidence: MEMORY.md is 16,348 B now (mtime Sep 3 18:51, edited by later sessions); the memory directory is 'fatal: not a git repository', so no earlier byte states survive. The three figures cannot be re-derived from anything retained.
  - note: The lesson (consolidate for clarity, fold for size, measure which) stands on its logic regardless. Settle: none available; a future fold should record before/after sizes in the archive header.
- **RATIFY** [S15, CONFIRMED] archive-2026-09-03-false-report-family.md (three rows + two later faces) and archive-2026-09-03-index-fold-30.md (four settled rows), both in archive-index.md
  - evidence: ls: archive-2026-09-03-false-report-family.md 2676 B; archive-2026-09-03-index-fold-30.md 2137 B. archive-index.md:20 '[FOLD 30 (2026-09-03, at §885.7)](archive-2026-09-03-index-fold-30.md) — four BUILD-ERA rows: the map-module descope, the retrovalidation mar
- **RATIFY** [S15, CONFIRMED] Lanes write topic files; the chair indexes
  - evidence: MEMORY.md carries '⛔ [REGENERATING a dossier-prose leaf REDS the OSR input arm — a landing register act, not a lane's]' and '⭐ [C9: SECTION-TARGET is a CLOSED VOCABULARY of ten, and the shipped comma-split made 26 of 45 blocks unroutable]'. HANDOFF_CURRENT.md 
  - note: The card's §885.7 content has since been overwritten by later refreshes (0 mentions at HEAD), as the card's design intends.

## §886  —  8 call(s): RATIFY 3, AMEND 4, EVIDENCE-THIN 1
- **RATIFY** [S15, CONFIRMED] The eleventh landing
  - evidence: 5 cars: 7d0987ea0, 6c862159e, e2f4993cf, 108a02ef4, d1a6c773e, each single-parent with trailer 'Opus 5 — Fable-unvalidated'. diff: 11 files changed, 987 insertions(+), 95 deletions(-). refs/preserve/landing-886-2026-09-03 = d1a6c773e. gate-886.log: GATE_HEAD=d
  - note: typecheck 173/173 and domain-strict 1121/1121 not re-read from the gate log body (PLAUSIBLE).
- **RATIFY** [S15, CONFIRMED] Only the good sentence ships now
  - evidence: d1a6c773e wizardNews.js:181 '// frames, so a reader met "Conflict pressure takes hold in Elmspur" — a taxonomy'; settlementRumors.js:516 ' * identical event read "Thornwall is dying". It is deleted.'; settlementLifecycleFirstClass.js:224 'headline: `${name} is
  - note: Taste view: the phrases are bare lowercase noun phrases in the rumor register (the walker's own arm enforces that shape and that every phrase reads in all six wizardNews frames and four rumor frames),
- **AMEND** [S15, CONFIRMED] A naming convention enforced by a comment is not machinery, and now it is
  - evidence: walker:18-27 'three routes uncovered: • MODULE CONSTANTS — candidateType: VERDICT_NEWS_TYPE. Eleven live sites, and SEVEN live tokens (npc_verdict, npc_arrival, npc_death, npc_dispersal, npc_pardon, npc_rejection, npc_assignment) that no walker in this tree co
  - note: Conviction, the seven tokens, the eleven sites and the quote are CONFIRMED. The figure 'six mint routes' appears nowhere in the instrument: it names THREE previously-uncovered routes beyond the litera
- **AMEND** [S15, CONFIRMED] Budgeting a refreeze by counting arms is wrong three ways
  - evidence: Walker test( count at d1a6c773e = 20 (twenty plain test( calls, zero .each/.skip). 108a02ef4: files 2503->2504, credited 2133->2134, titles 22676->22696 (+20), suiteTitles 6101->6110 (+9), parked not in diff (unmoved). d1a6c773e: totalTests 30973->30994 (+21),
  - note: The walker carries 20 arms, not 19. With 20 arms the lighting figure (+20 titles) EQUALS the arm count on this consist, so the row's 'three figures for one consist' illustration collapses to two (ratc
- **AMEND** [S15, CONFIRMED] Holding was correct
  - evidence: update-886-run1-REFUSED-loaded.log: HEAD 108a02ef4, simulationRulesDialog, LOAD_POST 94.64. update-885-run1-REFUSED.log: UPDATE_HEAD=d4b91b26a (the §885 consist), 'tests/lint/writerReach.walker.test.js :: writer-with-no-reader ratchet', UPDATE_LOAD_AT_START=3.
  - note: Only ONE --update refusal happened on the §886 consist at load 94. The 'other' was §885's writerReach refusal on a different consist at load ~24, which §885 itself cured as a real 21,758 ms > 20,000 m
- **EVIDENCE-THIN** [S15, PLAUSIBLE] Both earned their keep
  - evidence: gate-886.log:5 'GATE_PREGATE=ALL 14 cheap stages PASSED in 85.6s at this exact tip' (a chair-authored header line). No pregate-886 log and no pre-flight output containing 'files 2503 -> 2504' or 'NOT refrozen' is retained (only brief-PREGATE.md:51 quoting the 
  - note: The claims are consistent with the instruments' shapes but the §886 outputs themselves were not kept. Settle: retain the pre-gate/pre-flight stdout per landing; for §886 nothing remains to re-read.
- **AMEND** [S15, CONFIRMED] Owed before the GOLDEN freeze
  - evidence: At 2d5112851 the six sites are at 552, 712, 759, 779, 819, 867. At d1a6c773e (this row's tip) they are at 627, 787, 834, 854, 894, 942 (car 1 added ~75 lines above them); same at f12360185. Six sites in all three trees.
  - note: Six siblings confirmed; the cited line numbers are the pre-consist base's and are stale at the tip the row records. §887 repeats the stale numbers. Cite by pattern or by the tip's lines. The anchor pi
- **RATIFY** [S15, PLAUSIBLE] Taste is the one thing no test holds, but the wordings mirror what the product already speaks
  - evidence: Car 1: 'twelve database labels become the words the town already used'; car 2: 'twenty-nine live kinds are given words'. Walker: test('every subject phrase is a bare lowercase noun phrase') and test('every subject phrase reads in all SIX wizardNews frames and 
  - note: View: the phrases read in the settlement's own register and the walker gives taste a mechanical floor. 'six summary frames' is not a phrase the walker uses (it says four rumor frames); minor wording c

## §887  —  10 call(s): RATIFY 9, AMEND 1
- **RATIFY** [S15, CONFIRMED] The twelfth landing
  - evidence: 7 cars 63f706b31, 8029536bb, 0fdbc53a0, 0d936b84f, 98366ffd5, 342cccd90, f12360185, all single-parent with the seat trailer. diff: 17 files changed, 1423 insertions(+), 100 deletions(-). refs/preserve/landing-887-2026-09-03 = f12360185. gate-887.log: GATE_STAR
- **RATIFY** [S15, CONFIRMED] Law 5, fail-closed, derived per pool on the RAW pool
  - evidence: Probe over a pool [minor-marked, catastrophic-marked, unmarked]: BASE eligible (no dimension answer) = all three incl. 'Catastrophic crime wave'; TIP unanswered = []; TIP severity=minor = ['A minor crime wave...', 'Neutral sentence'] (catastrophic excluded); T
  - note: Mechanism CONFIRMED by execution on the extracted pure leaf; placement is correct (deriving on the raw pool closes the fail-open path where audience/slot filters remove the last marked variant). The m
- **RATIFY** [S15, CONFIRMED] The field's vocabulary is closed at last
  - evidence: generate-dossier-state-prose.mjs:339 'block.sectionTarget = [...block.sectionTargetRaw.matchAll(/`([a-z][a-z0-9_-]*)`/g)]'; :540-541 'for (const t of b.sectionTarget) { if (!SECTION_TARGETS.includes(t)) strays.push(...)'; :574 emits the key only when non-empty
  - note: The parser now mirrors the ARMS extractor's backtick-token shape; an unknown token reds the projection.
- **RATIFY** [S15, CONFIRMED] Dark half a gate can count
  - evidence: Probe: DOSSIER_MOUNTS 0, UNMOUNTED_BLOCKS 68 unique. dossierMounts.js:95-102 'THE REGISTRY. Empty at birth, and that is the honest state rather than a shortfall'. :26-29 'A block's SENTENCE rung renders at exactly ONE position per settlement page-set'.
- **RATIFY** [S15, CONFIRMED] Classified, not exempted
  - evidence: contract test:129 'readdirSync(DESK_DIR).filter((n) => n.endsWith('.js'))'; :427 '// CLASSIFIED, NOT EXEMPTED. Every string map in the desk directory must be one of'; :431 'const NOT_A_FILL_TABLE = Object.freeze({'; :467 'if (isStringMap && !declaredTables.has
  - note: The refusal log independently shows both failures the row describes (the collision and the forgotten OSR register act).
- **RATIFY** [S15, CONFIRMED] Predict the derivable, leave the underivable unnamed
  - evidence: dossierMountRegistry.walker.test.js test( count = 16. 0d936b84f: files 2504->2505, credited 2134->2135, titles 22696->22716 (+20), suiteTitles 6110->6114 (+4). f12360185: totalTests 30994->31016 (+22), totalFiles 2452->2453. OSR baseline at 342cccd90: total 19
  - note: All figures exact. Beyond the row: the ratchet delta WAS derivable here as the sum of the three lane predictions (6+16+0=22), so 'tests refused in advance' was more cautious than necessary on this con
- **RATIFY** [S15, CONFIRMED] A law the chair keeps breaking is a hope
  - evidence: Order: 0fdbc53a0 (lane C2+C3) -> 0d936b84f '§887 register 1/2: the lighting census refrozen at the COMPOSED tip' -> 98366ffd5 '§887 cure 1/1' -> 342cccd90 register 2/3 -> f12360185 register 3/3. The lighting register was committed before the cure; the cure add
  - note: The §887 instance is CONFIRMED from the commit order; the §885 instance is outside this slice (PLAUSIBLE). The named mechanization (pre-flight refusing a register act with cures ahead) is recorded as 
- **RATIFY** [S15, CONFIRMED] Not the machine this time
  - evidence: gate-887.log:5 'GATE_PREGATE=ALL 14 cheap stages PASSED in 81.9s at this exact tip' (chair header; no pregate-887 log retained). update-887-run1-REFUSED.log: UPDATE_HEAD=0d936b84f, LOAD_AT_START=1.91, two named failures (dossierStateProseProjection.contract ::
  - note: The refusal diagnosis is CONFIRMED; the 81.9 s figure is EVIDENCE-THIN (header line only).
- **AMEND** [S15, CONFIRMED] Owed before the GOLDEN freeze
  - evidence: gate-887.log:9 'GATE_KNOWN_RED=one signature only - wizardNews createdAt clock-tick, 0.392 pct measured, pre-existing and foreign, owed before the GOLDEN freeze.' Sites at f12360185: 627, 787, 834, 854, 894, 942 (the row cites :552 :712 :759 :779 :819 :867, th
  - note: Same stale line-number defect as G7, repeated one landing later.
- **RATIFY** [S15, CONFIRMED] A taste judgment no test holds
  - evidence: dossierMounts.js:66-75 'The two depths a mount may draw at. The third rung of the legibility ladder (DETAIL) is not a mount choice: a detail is rows, not a draw' — SENTENCE 'The position that speaks. At most one per block per page-set'; GLANCE 'Every other pos
  - note: View: the two-rung enum is the right size — it names exactly the choice a mount makes and pushes the third depth to rows, which mirrors the program's glance -> sentence -> table ladder; the rule exten

## §887.1  —  3 call(s): RATIFY 2, AMEND 1
- **RATIFY** [S15, CONFIRMED] The build was unblocked the same day it was declared blocked
  - evidence: ODQ §882.13 (2026-09-02): '**ENCOUNTERS row 1 YES** — the train mints spatialLedgers.meetingMarkEvents ... and spatialLedgers.meetingLeanChannels'; '**5 YES** — the corruption web's creation seam takes the WILLED pin'; '**5b NO — THE THREE FENCES STAND.** A me
  - note: The phantom is real: ENC-1's message (09-03) still said 'seventeen rows ... untouched and unruled' a day after the rulings.
- **AMEND** [S15, CONFIRMED] It changes what is buildable right now
  - evidence: §882.13: '**2 YES** — respect joins BOND_KINDS'; '**3 YES** — rivalry joins GRUDGE_KINDS'; '**6 YES at lighting** — ...; ⚠ the POOL SENTENCES remain the pen's to amend at the voice sitting (owner)'; '**8 LEAVE TO THE WAVE**'; held: '**ENCOUNTERS 7** the tuning
  - note: The design's own gate for ENC-5 is rows 2+3, BOTH ruled YES at §882.13 — so by the design's letter ENC-5 was unblocked too, and the design says it is 'built dark behind the rows'. The chair's 'ENC-5 g
- **RATIFY** [S15, CONFIRMED] A stale blocker is obeyed in silence
  - evidence: §882.13 ruled on 2026-09-02; bbe56b957 (09-03 00:59) 'the seventeen rows of DESIGN_ENCOUNTERS §12 are untouched and unruled'; §885.7's stratum text 'Only ONE of seven cars was buildable'; §887.1 (09-03) corrects it.
  - note: Non-executable law; the instance that earned it is confirmed by dates.

## §887.2  —  4 call(s): RATIFY 4
- **RATIFY** [S15, CONFIRMED] The §882.14 survival law paid out five times
  - evidence: refs/preserve: enc2-enc6-2026-09-03 f052d1e77; emdash-2026-09-03 4da38b8d3; emdash-annex-2026-09-03 e46d4c3f1; horizondark-cars12-2026-09-03 43e063a70; determinism-wip-2026-09-03 55d77a8d2; enc1-registers-2026-09-03 f4cc5cb7d. f052d1e77's chain: ENC-6 f052d1e7
  - note: 'Nine cars' not recounted per seal (PLAUSIBLE). The 'enc2-enc6' seal holds ENC-2 and ENC-6 only — the name is a range label, not a claim that ENC-3/4/5 are inside.
- **RATIFY** [S15, CONFIRMED] Both were contention the chair created by reading load at launch
  - evidence: ratchet-enc.log: RATCHET_LOAD_AT_START=3.70 8.99 14.79 / 'tests/simulation/centuryLegSoak.test.js UNCLASSIFIED · ran 0ms against a 900000ms budget ... no timeout signal and no assertion signal ... msg: (the report carried no failure message)' / 'skipped tests 
  - note: Verbatim. Nothing banked, census at 10.
- **RATIFY** [S15, CONFIRMED] centuryLegSoak is the most expensive test, so it is the first casualty every time
  - evidence: Both refusals: 'ran 0ms against a 900000ms budget — no timeout signal and no assertion signal — ... (the report carried no failure message)'. ratchet-enc4.log at a streak-confirmed quiet box (load 3.13/3.08/1.99, workers=0): centuryLegSoak is ABSENT from the r
  - note: The quiet run is the decisive control: the soak's failure vanished with the contention, which proves it was starvation, while real reds surfaced that contention had been MASKING — the §888 story. The 
- **RATIFY** [S15, CONFIRMED] A predicate that can match its own command line is not a gate
  - evidence: ratchet-enc3.log (2 lines, then abandoned): '  probe: load=4.34 workers=1 streak=0 waited=0s' / '  probe: load=3.89 workers=1 streak=0 waited=60s'. run-ratchet-quiet.sh:11 now reads "V=$(ps -ax -o command | grep -c '[v]itest/dist/workers')". ratchet-enc4.log: 
  - note: The uncured script text was edited in place and is not retained; the stuck-at-workers=1/streak=0 log at load 3.89 is the receipt, and enc4 proves the cured predicate reaches zero.

## §888  —  9 call(s): RATIFY 5, REVERSE 1, AMEND 3
- **RATIFY** [S16, CONFIRMED] The landing act and its gate figures are as stated.
  - evidence: 8 cars each with one parent; ' 11 files changed, 1848 insertions(+), 24 deletions(-)'; 'bbba1be24 refs/preserve/landing-888-2026-09-03'; gate-888.log: GATE_START=2026-09-03T11:18:55Z GATE_END=11:35:51Z (=1,016 s) TRUE_EXIT=0 GATE_PORCELAIN_PRE/POST=[0]; :80 '[
  - note: '20 stages' not independently counted (the log shows 11 distinct bracket tags; npm run check's stage list is elsewhere) — immaterial.
- **RATIFY** [S16, CONFIRMED] The mechanism, the two-direction measurement and the pre-existence are real.
  - evidence: wizardNews.js normalizeEntry: 'createdAt: entry.createdAt || options.now || nowIso()'. b6822dcae body: '88 mismatches in 20,000 back-to-back repetitions on an idle box (0.44%) … 100% failure once a 3 ms gap is forced … 0% failure with one stamp threaded'. Diff
  - note: Mechanism, cure shape and pre-existence read from source; the 20,000-iteration rates are receipt-quoted, not re-run — settle with: node probe looping appendWizardNewsEntries({},[row],{now:null}) ×20,0
- **REVERSE** [S16, CONFIRMED] The defect was unknown until two lanes converged on it independently on 2026-09-03.
  - evidence: §884 (ODQ 32374): 'A FOREIGN DETERMINISM LEAK, DIAGNOSED AND DELIBERATELY NOT CURED HERE: wizardNews.js:552 reads createdAt: entry.createdAt || options.now || nowIso() … 784 mismatches in 200,000 iterations, 0.392% … It did NOT fire in the gate. ⛔ THE GOLDEN F
  - note: The mechanism, rate (0.392%), home and deferral were in the ledger four rows earlier and carried as STILL OWED through §886/§887; the REGISTRY (determinism) lane was BRIEFED to close it. Only the ENC-
- **AMEND** [S16, CONFIRMED] §888 closes the wall-clock race at its cause.
  - evidence: b6822dcae touches only tests/domain/fieldBattleRegion.test.js (+17/−2) — the exact §884-named home. efed4ba91 (§889 train) 'The known-red closes at its cause: `now: null` was a pin that was not one' touches fieldBattleRegion.test.js (58) and worldGenerationClo
  - note: §888's cure is at the ARM (a threaded stamp plus two anchors, test-side). The cause — `now: null` falling through `||` to the wall clock — closed in §889 at efed4ba91/3c2410be2. Wording should read 'c
- **RATIFY** [S16, PLAUSIBLE] §887.2 was incomplete: the census bills were unmentioned and the sentinel ordering explains why.
  - evidence: §887.2 contains 0 occurrences of 'census' or 'five'. receipt-enc1-census.md table rows 1-5: three 'CURE THE LEAF', two 'ENROL' — five bills at the tip, green at base. check-test-ratchet.mjs:23 'an anti-vacuity sentinel, a scope sentinel'; :419 'THE SCOPE-COLLA
  - note: That §887.2 omitted the five bills is CONFIRMED; that the sentinel short-circuits BEFORE the per-row census comparison is read from the runner's doc comments, not from its gate() control flow — settle
- **AMEND** [S16, CONFIRMED] §888 amends the signature §886 banked as 'a DIFFERENT test failed each time'.
  - evidence: §886 (32390): 'a DIFFERENT test failed each time, which is the signature of resource starvation rather than a defect'. §887.2 (32397) ALREADY reads: 'Here the same test fell twice, which by that letter meant a real defect, and the chair said so. It is not: cen
  - note: The amendment was first written at §887.2; §888 re-announces it as its own. Attribute it to §887.2 and let §888 merely restate.
- **RATIFY** [S16, CONFIRMED] The judgment to cure the leaf rather than enrol it rests on a measured cost and a proven behaviour identity.
  - evidence: Pre-cure leaf imports 'positionValue' from '../npc/characterDrift.js' (envoyChanceMeeting.js:60 @f4cc5cb7d). My walk: leaf closure 11 modules incl. itself = 'excluding leaf: 10 modules 211 KB'; leaf+door = 'excluding leaf: 113 modules 2082 KB 2.03 MB'. 5d34dfc
  - note: The lane's 10/211 KB reproduces exactly (closure excluding the leaf itself); the door route reproduces at 113/2.03 MB vs the lane's 111/~2.0 MB — same order, method-level difference. The 268,800 compa
- **AMEND** [S16, CONFIRMED] Every register figure is as stated.
  - evidence: tuning totals: f12360185 {tables:224,keys:2066,unregisteredNamed:535,bareDecimals:6985} → bbba1be24 {tables:225,keys:2092,535,6985} (+26). ratchet: totalTests 31016/totalFiles 2453 → 31048/2454. OSR frozenAtSha 98366ffd5 at BOTH shas (not refrozen). lighting b
  - note: The lighting FROM figures in the stratum and in ledger §888 (line 32399) read credited 2134 / suiteTitles 6110; the committed baseline at f12360185 and the register car's own message say 2135 / 6114. 
- **RATIFY** [S16, CONFIRMED] Both facts hold and the not-rebase reasoning is sound.
  - evidence: Seat trailer counts: 895b328a9 1, 36aafe57d 1, 394d758ee 0, a9984fb65 1, f4cc5cb7d 1, 5d34dfce5 1, b6822dcae 1, bbba1be24 1. bbba1be24:.tuning-inventory.json:10 '"measuredAtSha": "394d758ee0ae53cd8cc1193b382149a656c51370"'. At 30c1667bc the same field reads 'd
  - note: The provenance reason held at landing time; after §889's refreeze the citation moved, but the car is landed and sealed so a rewrite is moot. 394d758ee's body itself carries the Opus-seat text (16 tsc 

## §889  —  6 call(s): RATIFY 4, OUT-OF-SCOPE 2
- **RATIFY** [S16, CONFIRMED] The landing act and its figures are as stated.
  - evidence: 'cars=15 seat-trailers=15'; every car shows exactly one parent; ' 59 files changed, 4746 insertions(+), 1356 deletions(-)'; '30c1667bc refs/preserve/landing-889-2026-09-03'; gate-889.log GATE_START=12:34:45Z GATE_END=12:51:59Z (=1,034 s) TRUE_EXIT=0 porcelain 
- **RATIFY** [S16, CONFIRMED] Two independent instruments agree to the unit.
  - evidence: E2 voiceMechanics entry magnitude 'em' ceiling 720 → 382; 'total' ceiling 1108 → 770 (attribution 'RAISED 649 to 720 at the INSTRUMENTS consist landing'). d32bb8832: '§888: the 338 reader-facing em dashes leave the dossier prose corpus…'; body :7 'an espree wa
- **RATIFY** [S16, CONFIRMED] No fork chain aliases the new family and the label carries no wall clock.
  - evidence: PCRE count with the guard's FORK_LITERAL_RE = 118; plain `.fork(` lines = 133 (11 comment-leading). 'willed-leash-end' appears only at corruptionWeb.js:901 'rng.fork(`willed-leash-end::${now}::${id}`)'. Fork lines containing 'epoch' = 0. corruptionWeb.js:654 '
  - note: '118' is the guard's literal-label count, which is what the row says; the brief's 'expect 118' via plain grep would read 133 — future verifiers should use FORK_LITERAL_RE. The guard's own green at 30c
- **RATIFY** [S16, CONFIRMED] Every derivable figure predicted exact; the OSR and prose-numerics moves are as explained.
  - evidence: lighting 30c1667bc: files 2510, parked 370, credited 2140, titles 22823, suiteTitles 6139 (2140+370=2510). OSR: total 1993, identities 1409, inventory obj:388 at both shas; frozenAtSha 98366ffd5 → 019829e99 (refrozen, figures unchanged). prose-numerics entry p
- **OUT-OF-SCOPE** [S16, PLAUSIBLE] Self-reported process error and its cure.
  - evidence: SP holds run-gate-888.sh and run-gate-889.sh; run-gate-889.sh is a 30-line #!/bin/sh quiet-wait wrapper ('§889 bare gate. Waits for sustained quiet before starting.') with no in-script `sh -n` or `set -e`; the failed sed-patched version is not preserved.
  - note: A chair-process self-report with no product byte; the failed artefact and the 'launch is now conditional' launcher line exist only in the chair transcript. Settle by reading the chair session's launch
- **OUT-OF-SCOPE** [S16, PLAUSIBLE] Self-reported process error and its cure.
  - evidence: No artefact of the mis-merged file survives in SP; the ledger §889 row and HANDOFF_CURRENT.md:52 carry the law ('THE GUARD AND THE CONSEQUENCE MUST LIVE IN THE SAME PLACE … set -e at the head of any mul…').
  - note: Process row; settle in the chair transcript.

## §889.1  —  8 call(s): RATIFY 8
- **RATIFY** [S16, CONFIRMED] The stop is measured, not cautious.
  - evidence: kindPoolWalker.js: 'CHRONIC_FLOOR = 8', 'CADENCE_STEP = 2', 'FREQUENCY_FLOORS = … SIGNIFICANCE_CLASSES.map((cls) => [cls, CHRONIC_FLOOR - significanceRankOf(cls) * CADENCE_STEP])'; bandFamilies.js:75 SIGNIFICANCE_CLASSES = ['routine','notable','major'] ⇒ 8/6/4
  - note: The derived constant is named FREQUENCY_FLOORS at :68-70; the stratum's FLOOR_BY_SIGNIFICANCE is the transcribed alias the walker test matches — acceptable, but a future reader looking for that identi
- **RATIFY** [S16, PLAUSIBLE] J29 (conditional on a source-closure probe per §882.10) is discharged by measurement.
  - evidence: receipt-enc4.md:142 'CLOSURE_SIZE=237'; :151 '**First-paint delta = 0 B, CONFIRMED** (the script hard-throws on a non-existent target path…'. ODQ §882.10 (32359): '…the predicted closure delta is 0 at every car and J29 becomes conditional on a source-closure p
  - note: Receipt-read, not re-executed. Settle: re-run the closure script quoted in receipt-enc4 §'WHAT DID LAND' from src/main.jsx at 30c1667bc and confirm none of the five ENC-4 paths appears.
- **RATIFY** [S16, CONFIRMED] A live defect in landed code, confirmed by execution with a control.
  - evidence: heraldRouting.js:615-621 admits war_rulings_registry, war_coalition_registry, envoy_registry and 'r.sectionAuthority === "sovereignty_registry"'. wizardNews.js:705-707 allowlist: war_rulings_registry || war_coalition_registry || envoy_registry only; :797 load 
  - note: No captured probe receipt exists in SP (receipt-enc4.md has no 'sovereignty' text; msg-8891.txt is the ledger draft) — my probe is now the executed receipt. The brief's path 'src/domain/worldPulse/wiz
- **RATIFY** [S16, CONFIRMED] The chair's inherited brief claim was refuted by measurement.
  - evidence: commercialReasonsNews.js:74-79 'if (!pool || !slots || pool.length !== slots.length) { throw new Error(`commercialReasonsNews: ${kind} has no annex pool of matching arity`); }'. sovereigntyNews.js:71 'pool: … (SOVEREIGNTY_RECEIPTS[kind]),' with no throw. gramm
  - note: Spot-checks (COMMERCIAL, SOVEREIGNTY, GRAMMAR) confirm the shape; the full 11-registry census has no receipt on disk — the remaining eight are PLAUSIBLE by the same pattern. Settle: grep 'throw new' i
- **RATIFY** [S16, CONFIRMED] The two meanings genuinely collide and the Herald kind must move.
  - evidence: corruptionLeash.js:70 'export const WILLED_MEETING_CONSPIRACY = "chance_meeting";'; corruptionWeb.js:831 'conspiracy: willed ? WILLED_MEETING_CONSPIRACY : "foreign_web",'; test :167 'expect(WILLED_MEETING_CONSPIRACY).toBe("chance_meeting")'. src at 30c1667bc a
  - note: Premise holds (live constant + pinned test vs a design-only kind). Two omissions: the stratum does not mention the third live use (the `chance_meeting:` id prefix), and the owner's fill-in sheet the r
- **RATIFY** [S16, CONFIRMED] The spelling ruling and its delivery.
  - evidence: DESIGN_ENCOUNTERS.md:312 '- **The Herald line** (§8): `chance_meeting_approach_exposed`, public…'; :439 '| `chance_meeting_exposed` | major · public · events |'; :546 '| 6 | Two public Herald kinds, `chance_meeting` (notable) and `chance_meeting_exposed` (majo
  - note: The ENC-3 stage in the dock spells the ruled token, so the mid-flight delivery landed.
- **RATIFY** [S16, PLAUSIBLE] A design ruling on the seam shape.
  - evidence: receipt-enc4.md:212 '**A1 — the mint site is ENC-3's file, so ENC-4 must expose one adapter, not nine call sites.**'; :215 'The shape I had planned, and which I recommend the chair pin for both…'.
  - note: A ruling with no landed code yet (ENC-4 stopped); it adopts the lane's own recommendation. Nothing to refute on the tree.
- **RATIFY** [S16, CONFIRMED] Preserve-and-proceed was the right call.
  - evidence: receipt: 'HEAD was `43e063a70`; `git for-each-ref --contains` returns `refs/preserve/horizondark-cars12-2026-09-03` — every commit in the dock was already SEALED'; '1632035011 27256  HORIZON-DARK-CARLIST.md (dock == $ME copy) / 254230544 12200  receipt-horizon

## §889.2  —  1 call(s): RATIFY 1
- **RATIFY** [S16, CONFIRMED] A chair-process law; the card carries both §889.1 findings.
  - evidence: HANDOFF_CURRENT.md:96 '⛔⛔ **§889.1 — TWO THINGS A SUCCESSOR MUST NOT LOSE.** **(1) ENC-4 IS STOPPED BEFORE ITS FIRST BYTE … **(2) A LIVE DEFECT IN LANDED CODE:** … `sovereignty_registry` is MISSING'; :52 '⛔ **THE GUARD AND THE CONSEQUENCE MUST LIVE IN THE SAME
  - note: The verifiable claim (the card carries both findings) holds. Record-keeping gap: §889.2 exists as an FRQ section and a handoff law but has NO ledger row of that number — a successor grepping the ledge

## §889.3  —  8 call(s): RATIFY 5, AMEND 1, OUT-OF-SCOPE 1, REVERSE 1
- **RATIFY** [S16, CONFIRMED] Unreferenced work was sealed first.
  - evidence: 'f47433b32 refs/preserve/lighting-rows-wip-2026-09-03'; chain 'f47433b32 O-16: Founder recognition is lit…' → 'b6ca05958 O-12: the owner ruling that held the eight war sub-flags…' → '30c1667bc §889 register 5/5'; refs containing b6ca05958: lighting-rows-2026-0
  - note: The seal exists and covers both cars. That they were reachable from NO ref at the moment of death, and the 'six times in one day' tally, are transcript claims not reconstructible from refs — PLAUSIBLE
- **AMEND** [S16, CONFIRMED] All in-flight work was preserved without mutating any dock.
  - evidence: salvage-enc3/MANIFEST.txt: 11 ' M' tracked paths + 2 '??' (subsystemRowsEncounters.js, envoyChanceMeetingStage.js) = 13 lines; salvage-nownull: 2 ' M' (graph.js, regionalNowThreading.test.js) plus a MANIFEST2.txt listing 12+ ' M' paths; salvage-srcprose: 0 tra
  - note: '13 dirty TRACKED paths' is 11 tracked-modified + 2 untracked. The cmp verification left no artefact (transcript-only). salvage-nownull's MANIFEST2/files2/tracked2.patch record a SECOND salvage the ro
- **OUT-OF-SCOPE** [S16, PLAUSIBLE] Brief-level lessons from the mass death.
  - evidence: receipt-enc4.md contains no 'subagent'/'spawn'/'recon child' text; SP/briefs holds brief-LIGHTFOLD-resume.md, brief-T13PRELAND-resume.md, brief-TAILFLAND-resume.md (resume-brief pattern exists).
  - note: Process rows; the recon-child overrun has no receipt on disk. Settle in the ENC-4 lane transcript (Agent tool calls) and the resume briefs' opening lines.
- **RATIFY** [S16, CONFIRMED] The delegated ceiling raise is not needed; the dial moves no engine byte.
  - evidence: receipt rows 1-3: '`engine-C9-_paJc.js` | **675,764** | 676,000 (strict `<`) | **+236**' ×3, 'BUILD_EXIT=0 all three', 'content hash is identical in all three builds (`C9-_paJc`)'. livingContentLaw.js:79-86 '⛔ AND IT IS DELIBERATELY NOT RE-EXPORTED FROM HERE. 
  - note: Source reads confirm the mechanism; the three build sizes are receipt-quoted (builds not re-run — and per §890's hazard a build in a dock with materialised node_modules would read falsely, so re-runni
- **RATIFY** [S16, CONFIRMED] The now-null car is surgical, and the inherited figure was refused.
  - evidence: receipt-nownull.md:27 '⚠ The DETERMINISM-LEDGER said "32 further sites across src/store, src/components and src/lib"'; :29 'already cured by the landed lane → **20 outstanding**. Reported as measured; the ledger figure was…'; :47 'The guard's own comment recor
  - note: The compareCodepoint nullish-coercion and 'two prior-art writers' clauses were not checked — PLAUSIBLE; settle: git grep -n 'compareCodepoint' 30c1667bc -- src/domain/deterministicSort.js and the two 
- **RATIFY** [S16, PLAUSIBLE] The ENC-3 recon found a second gate the chair's brief missed.
  - evidence: receipt-enc3.md:52-55 'So there are TWO gates above the drop pass, not one: `chanceEncountersEnabled` (which the ledger header accounts for) and `envoyDiplomacyEnabled` (which it does not). A world that lit both, deposited, then darkened `envoyDiplomacyEnabled
  - note: The receipt states it and the flag topology at the base is consistent, but the drop pass and its caller chain live in ENC-3's UNCOMMITTED stage (laneENC-tree untracked envoyChanceMeetingStage.js + dir
- **REVERSE** [S16, CONFIRMED] The door is unowned and ENCOUNTERS may take it.
  - evidence: Emptiness CONFIRMED: subsystemRowsLives.js:72 'export const LIVES_SUBSYSTEM_ROWS = Object.freeze([]);'; characterDriftEnabled in simulationRules.js: no match. But subsystemRowsLives.js:11 '…chartered to TE-VIRT-1, not a landing's to make" (ODQ §868)'; characte
  - note: The antecedent (emptiness) is real; the inference (unowned) is wrong — the emptiness is a landed, test-enforced reservation for TE-VIRT-1. The chair itself withdrew the ruling at §890.1, but the §889.
- **RATIFY** [S16, CONFIRMED] The lane corrected the chair's figures twice.
  - evidence: receipt-src-prose.md:14 '| the guard's OWN char tokenizer (`voiceMechanics.test.js` `stringLiteralContents`) | **1,458** |'; :48 '**688 of 1,458 sit outside every guard.**'; :101 'The predecessor refused 28 rows because `faithKindPools.walker.test.js:168` asse
  - note: Receipt-read; the 1,458 count is by the guard's own tokenizer, which is the right instrument. Not re-run.

## §890.1  —  10 call(s): RATIFY 8, AMEND 2
- **RATIFY** [S17, CONFIRMED] subsystemRowsLives.js:11,:19 and characterDrift.js:89,:113 name TE-VIRT-1 as the door's owner
  - evidence: subsystemRowsLives.js:11 'chartered to TE-VIRT-1, not a landing\'s to make" (ODQ §868)'; :19 'names this lane in its own header — "⚠ TE-VIRT-1'; characterDrift.js:89 '⚠ TE-VIRT-1 OWES THE FLAG\'S HOME —'; :113 'THE DOOR SEAM — the virtual flag TE-VIRT-1 owes a
  - note: All four citations hold at the exact lines. (The lane's receipt cites :91; the line is :89 at both shas — a lane nit, not the chair's.)
- **RATIFY** [S17, CONFIRMED] §868 records 'TE-VIRT-1's structural call, not a landing's' and §870.4 keeps the drift/dispatcher doors inside the charter
  - evidence: 'declined to author a family leaf at a landing — TE-VIRT-1\'s structural call, not a landing\'s.' (x2 hits); 'WORKED PATTERN (its design risk just fell).'; §870.4: 'the upheaval mint was never blocked) — **which CORRECTS §865\'s blocked-claim and NARROWS §868\
  - note: Both quotations are verbatim in the ledger.
- **AMEND** [S17, CONFIRMED] (a) a landed test bans the key in raw simulationRules.js; (b) the manifest walker needs a literal .key===true read and the only read is computed; (c) a second literal spelling is forbidden by the ONE SPELLING walker
  - evidence: (a) characterDrift.test.js:852 test('⭐ AND NO KEY IS REGISTERED — the door car\'s bill is still the door car\'s'), :856 readFileSync(...simulationRules.js), :859 expect(manifest).not.toContain(CHARACTER_DRIFT_FLAG_KEY). (b) walker:227-228 '`REQUIRED_RULES.ever
  - note: (a) and (b) are test-enforced as stated. (c) is overstated in letter: the ONE SPELLING walker convicts the two RULED-OUT names and asserts the surviving spelling is minted at the seam; it does not lit
- **RATIFY** [S17, CONFIRMED] characterDrift.test.js's family-closure test reports one red, blinds two more; the lane's isolated replay found three
  - evidence: test:632 'a red at an early assertion BLINDS every later assertion'; :649 const files = jsFilesUnder(join(REPO_ROOT, 'src')); git ls-tree 30c1667bc src/**/*.js = 1,635 (+ the dock's two new src files = 1,637). laneENC-tree envoyChanceMeetingStage.js:72 import 
  - note: The 1,637 figure reconciles exactly (1,635 tracked .js under src + 2 new). probe-steps.mjs itself is not retained; the three reds are corroborated by the dock's files.
- **RATIFY** [S17, PLAUSIBLE] Both gates driven; ledgers drain to [] in arms A/B/C; never-lit identical; base early return is the first statement; envoyDiplomacyActive is a six-key conjunction
  - evidence: receipt: 'ARM A GATE B DARK … AFTER []' 'ARM B GATE A DARK … AFTER []' 'ARM C BOTH DARK AFTER []' 'ARM D NEVER-LIT … JSON equal = true' 'EXIT=0'; '⚠ ARM B\'s FIRST RUN WAS A FALSE GREEN and I caught it: envoyDiplomacyActive is a SIX-key conjunction'. ENVOY_REQ
  - note: Structure CONFIRMED (six-key conjunction, hoist above the return, base negative control). The executed arm figures are the receipt's; $ME/probe-darkpath.mjs was removed. Settling: re-run an equivalent
- **RATIFY** [S17, CONFIRMED] subsystemRowsSeat.js is the worked pattern; §870.4 says the upheaval mint was never blocked; the lane's dated record is right
  - evidence: subsystemRowsSeat.js header 'THE W-SEAT FAMILY\'S CERTIFICATION ROWS. A NINTH ROW LEAF, AND IT EXISTS FOR A MEASURED STRUCTURAL REASON', 'SEAT-1' x4; §870.4 'the upheaval mint was never blocked'; receipt 'NEW subsystemRowsEncounters.js (99 lines) — the ENCOUNT
  - note: The precedent exists in-tree and the receipt's record matches the ruling.
- **RATIFY** [S17, CONFIRMED] characterConsumers.js imports positionValue five times, does not re-export; resolveChanceMeeting:880 and axisRungs:409 depend on it
  - evidence: characterConsumers.js:84 'positionValue,' (import); uses :372 :373 :438 :545 :622; export lines mentioning positionValue: 0. envoyChanceMeeting.js:409 'if (typeof positionValue !== \'function\') return out;'; :817 '`positionValue` is the ONE thing this leaf ta
  - note: Every cited line holds at ca651d54b.
- **RATIFY** [S17, CONFIRMED] 8114a54e6, b1e5f9e3b, 698ad1600 are ancestors of ca651d54b; 038311ed2/a068e5899 are not, and are preserved twins
  - evidence: 8114a54e6 IS-ANCESTOR; b1e5f9e3b IS-ANCESTOR; 698ad1600 IS-ANCESTOR; 038311ed2 NOT (exit 1); a068e5899 NOT. refs/preserve/dock-laneVIRT-tree-2026-09-01 = 038311ed2ec0. patch-id car1 a068e5899 == 8114a54e6 (ff73b81ddbbc1a02…); car2 038311ed2 == b1e5f9e3b (0eb5e
  - note: Twins are patch-identical, not merely same-subject.
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: wc -l = 72; grep -c characterDriftEnabled = 3; :72 'export const LIVES_SUBSYSTEM_ROWS = Object.freeze([]);'; :2-3 'EMPTY ON PURPOSE, AND THE EMPTINESS IS THE DELIVERABLE.'
  - note: Exact.
- **AMEND** [S17, PLAUSIBLE] the chair may not take it; ENC-3 is blocked on TE-VIRT-1
  - evidence: Same row: 'ENC-3 is BLOCKED ON TE-VIRT-1, and that is a real dependency' and later 'dispatching "TE-VIRT-1" again would be dispatching a lane that already finished'. Ledger tail: 'ENC-3 THEREFORE CANNOT COMPLETE AS CHARTERED'. LANE-QUEUE.md:33 'THE DRIFT DOOR 
  - note: Substance holds (a shipped, test-enforced reservation is a new structural decision, and §868 makes it not a landing's). Two amendments: (1) strike 'BLOCKED ON TE-VIRT-1' — the row itself supersedes it

## §890.2  —  10 call(s): AMEND 1, RATIFY 8, EVIDENCE-THIN 1
- **AMEND** [S17, CONFIRMED] as stated
  - evidence: refs/preserve/nownull-2026-09-03 = 03da380abf4e. git log 30c1667bc..03da380ab = 2 commits: 03da380ab (the lane) + bf1464952 'The Herald desk stops being decided by a list that drifted' (the chair's car). 03da380ab^..03da380ab = 14 M paths, '14 files changed, 5
  - note: The lane's Car 1 + Car 2 are ONE commit of 14 paths. 'Two cars / 15 paths' is the range over §889, whose second car is the chair's own Herald car. All-M and no-new-test-file hold either way.
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: 55 non-comment call lines at 03da380ab; the only single-argument calls: graph.js:829 'return ensureRegionalGraph(graph || {}).channels.filter(' and :963 'const current = ensureRegionalGraph(graph || {});'. Commit body: 'Twenty un-threaded ensureRegionalGraph c
  - note: No un-threaded call remains outside graph.js and the two deferred in-module reads are exactly :829/:963 (CONFIRMED). The exact 57/54/3 split and the 'false positive that passes options through' are th
- **RATIFY** [S17, CONFIRMED] graph.js nodeFromSave, propagation.js x2, discoverDependencyCandidates.js three defaults + eight coercions
  - evidence: 03da380ab^: discoverDependencyCandidates.js 'now = null' x3 (:74 :164 :242), '.now || null' x8 (:336 :349 :366 :379 :403 :430 :465 :469); propagation.js:692 'const now = options.now ?? null;' :1125 'now = null,'; graph.js:353 'function nodeFromSave(save, now =
  - note: Eight coercions is right (the receipt says NINE once and eight once; the tree says eight).
- **RATIFY** [S17, CONFIRMED] A counts clock reads, B reads call arguments, C runs pinned paths
  - evidence: :29 'ARM A (source, the pure core) — computes the world-generation import closure'; :35 'ARM B (source, the callers)'; :41 'ARM C (runtime, the proof) — mocks the seam and RUNS world generation twice'; :490-492 'It is invisible to every other arm here. Arm A c
  - note: The structural argument holds on the arms' own definitions.
- **RATIFY** [S17, CONFIRMED] a stored row carrying a stamp never reaches the resolver; persisted campaigns byte-unchanged; PHASE6:3 directive in-tree
  - evidence: :190 'updatedAt: node.updatedAt || resolveStamp(now),'; :208 'updatedAt: edge.updatedAt || resolveStamp(now),'; :232 'createdAt: impact.createdAt || resolveStamp(now),'; :233 'updatedAt: impact.updatedAt || impact.createdAt || resolveStamp(now),'. PHASE6_DATA_
  - note: Holds. One nuance the row should carry: `||` also treats an EMPTY-STRING stamp as absent, so a stored '' stamp is re-minted (to null under now:null); 'byte-unchanged' is exact for truthy stamps.
- **RATIFY** [S17, PLAUSIBLE] as stated
  - evidence: 03da380ab^ :289 '@template {{ edges?: Array<Record<string, any>>, updatedAt?: string }} G'; tip :289-292 'The stamp is `string|null` because an ensureRegionalGraph output\'s own stamp is … Narrowing this constraint back to `string` does not make the stamp non-
  - note: The annotation and its widening are CONFIRMED; the 1121/1121 exit is the receipt's. Settling: `npm run typecheck:domain:strict` at laneINSTRLAND-tree@03da380ab (a gate script — not run under this brie
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: parent :420/:444 FALSY_NOW = /\bnow\s*:\s*(?:null|undefined)\b/; tip :445 DECEPTIVE_NOW = /\bnow\s*:\s*undefined\b/; :469 'LIVENESS: the deceptive-spelling rule convicts undefined, and SPARES the now-honoured null'; :434-435 'WHY THE `undefined` HALF IS KEPT, 
  - note: Exact.
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: EXECUTED: regionalNowThreading 'Tests 15 passed (15)' exit 0; worldGenerationClockSeam.walker 'Tests 12 passed (12)' exit 0 (=27/27). Lifecycle arms :503 'LIFECYCLE: a null-stamped graph survives persist → reload → regenerate → clone unchanged', :527 'LIFECYCL
  - note: 27/27 and the lifecycle arms are executed here. The exact byte figures and the replant are the receipt's (byteproof.mjs and ddc.GREEN.js not retained) — PLAUSIBLE for the numbers; Arm C's byte-identit
- **RATIFY** [S17, PLAUSIBLE] as stated
  - evidence: 'Base worktree at bf1464952 ($ME/instrland/base2.log, BASE2_EXIT=1, 5 failed / 159 passed) … DID NOT reproduce at base — 2: characterDrift, livingContentMaterialization … Re-ran BOTH in my own dock, with my changes, in isolation … EXIT 0, 56/56 passed.'
  - note: Receipt-only; base2.log not retained. Settling: `npx vitest run tests/domain/npc/characterDrift.test.js` at laneINSTRLAND-tree@03da380ab.
- **EVIDENCE-THIN** [S17, CONFIRMED] as stated
  - evidence: src hits at 03da380ab: 8, of which 2 code — demographicsKernel.js:428 inside demographicNewsEntries({…}) and contentSampleCategoryFixtures.js:299 in an applyEvent fixture; neither is a regional seam call. Walker :212-214 'Half of that still stands … That type 
  - note: The lane's split is right and the 'not needed' half is CONFIRMED (zero seam call sites thread null). The 'AUTHORISED' half rests on an unquoted chat delegation recorded nowhere but the row. Amend: quo

## §890.3  —  9 call(s): RATIFY 7, AMEND 2
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: ca651d54b: 119:    "pg": "^8.22.0",  fd3c6e25c: 119:    "pg": "^8.22.0",  headers at ca651d54b: 85 "dependencies": {  97 "devDependencies": {
  - note: Line 119 falls inside devDependencies on both branches. The retraction is correct.
- **RATIFY** [S17, PLAUSIBLE] as stated
  - evidence: msg-8903.txt:9 'probe was `node -e "…" 2>/dev/null || echo "not in package.json at all"`'; memory file items 1-3: '`echo "memory extended"` … (a Python SyntaxError)', '"copied" printed for 26 packages, one of which had silently failed', '⭐ The worst: `node -e 
  - note: The mechanism is the chair's own account; both the probe and the original message to the owner exist only in the chair's transcript. The retraction and the law are sound. Settling: the chair session's
- **AMEND** [S17, CONFIRMED] as stated
  - evidence: package.json '"pg"' present in laneENC, laneINSTRLAND, laneREGISTRY, laneKERNELMARK, lanePARSER (1 each). node_modules/pg: INSTALLED laneINSTRLAND (real dir, Aug 31) and laneKERNELMARK (real dir, Sep 3 10:22); MISSING laneENC, laneREGISTRY, lanePARSER, lanePRE
  - note: Two-of-five installed is consistent with my census. The mechanism is wrong in the row: docks link packages to the MAIN repo by design and MAIN's node_modules lacks pg — the O-17 lane said so ('AND fro
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: refs/preserve/lighting-rows-2026-09-03 = 8ae07b5fc; lineage b6ca05958 O-12 → f47433b32 O-16 → 8ae07b5fc O-17. :125 'export const FAITH_TUNING_SIGNATURE = Object.freeze({ signed: false, live: true });' :128-132 FAITH_SIGNATURE_STATES {DARK, DRAFT, SIGNED}; :146
  - note: Precision: SIGNED is unreachable from the shipped frozen record; the injectable parameter reaches it only through a literal `signed === true`, which is the owner's word — exactly the row's meaning.
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: git grep faithTuningArmed|faithTuningState|FAITH_TUNING_SIGNATURE 8ae07b5fc -- src/ → every hit inside faithTuningSurface.js. FAITH_FIELD_DOOR/faithFieldEnabled outside the surface: faithField.js:140 'export { FAITH_FIELD_TUNING, FAITH_FIELD_DOOR };' (a re-exp
  - note: Exact.
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: :136 'export function renormShares(deities, target = 100)' with docblock 'Largest-remainder renorm of ACTIVE deity shares to sum exactly `target` integer points (default 100 — the conserved-pantheon invariant)'; deityFlaws.js:22 'never past the authored ceilin
  - note: Ruling re-derived: every magnitude is a function of adherent share (a conserved 100) and piety; adding a deity divides the pool; nothing in the lit surface asserts a deity exists or acts. Doctrine not
- **RATIFY** [S17, CONFIRMED] as stated
  - evidence: test( count: 23 @30c1667bc → 28 @8ae07b5fc. test:179 test('the §763 wording appears TWICE — the surviving original AND the record of it'), :190 '.toBe(2)', :198 toContain('Seat: Opus 5, lane REGISTRY'). b6ca05958 body :37-38 'A first draft of this arm used a b
  - note: Counts and the TWICE arm executed/read here; the eight mutant reds are the lane's exits (PLAUSIBLE for those).
- **RATIFY** [S17, CONFIRMED] 22823 → 22836 (+13) → 22841; O-12 +2, O-16 +10, O-17 +5, Herald +1
  - evidence: titles: 22823 @30c1667bc; 22836 @c7531c717; 22841 @8d639dc54 and @ca651d54b (22919 @4233031ba). Added test( lines: bf1464952 +1 (Herald), b6ca05958 +2, f47433b32 +10 (+2 describe), 8ae07b5fc net +5 (23→28). Receipt: 'titles 22823 → 22840 = +17' and 'suiteTitle
  - note: Arithmetic exact (13 = 2+10+1; 17 = 2+10+5; 22823+18 = 22841). Wording nit: the lane's +17 was the walker's MEASURED titles delta, validated by per-file counting; per-file counting was the method for 
- **AMEND** [S17, PLAUSIBLE] as stated
  - evidence: DOOR 3 = tests/lint/sovereigntyLightingContract.walker.test.js '> DOOR 3 PARSER DOOR: a file this walker cannot parse parks WHOLE'. suite-tip.log:171 '× DOOR 3 PARSER DOOR … 39952ms', :9674-9675 'FAIL … DOOR 3 PARSER DOOR' 'Error: Test timed out in 20000ms.' r
  - note: Timeout-not-parse is consistent with the one retained log (a 20 s budget exceeded at 39.9 s). Amend: name the arm, and record that it is a RECURRING base red (reproduced at bf1464952 by the nownull la

## §890.4  —  10 call(s): AMEND 2, RATIFY 8
- **AMEND** [S18, CONFIRMED] Sealed refs/preserve/srcprose-2026-09-03 = 8f4d5c648, one commit, 200 paths, +1,084/−1,019
  - evidence: refs/preserve/srcprose-2026-09-03 → 8f4d5c648ce62fc51231110b9c4ace2127fbdd18 (ref file written 2026-09-03 13:15:12); '200 files changed, 1084 insertions(+), 1019 deletions(-)'; parent = 30c1667bc '§889 register 5/5' — NOT ca651d54b
  - note: Figures hold. The row never states the car's BASE: it is 30c1667bc (the §889 tip), one landing behind §890 and 25 cars behind the live train; its 200 paths overlap the §890+§891 trains on 2 files (src
- **RATIFY** [S18, CONFIRMED] 1,481 em dashes, 1,001 cured, 480 exempt (348/51/30/24/18/7/2), dispositions COLON 437 PERIOD 402 COMMA 84 PAREN 39 pairs, re-sweep in-scope zero, prose diff 989/989 symmetric
  - evidence: receipt:567-571 'units.mjs at the committed tip: 1481 → 480 em dashes, exactly 1001 removed … PROSE 0 … COLON 437 · PERIOD 402 · COMMA 84 · PAREN 39 pairs (78 marks) = 1001 … DEV 348 · SEP_PARSED 51 · DEVLOG 30 · GENERATED 24 · STRUCT 18 · GLYPH 7 · COMPARATOR
  - note: The stratum's 'colon/period split moved by 108 rows during review in both directions' is NOT in the receipt as searched (nearest: :246 '106 hand rulings'; COLON 455→437 net −18). That one figure is EV
- **RATIFY** [S18, CONFIRMED] 28/28 paired by text not line numbers, 28/28 again after the cure, twin battery identical base vs tip
  - evidence: receipt:124 'THE 28 BYTE-TWINS — PAIRED BY TEXT, 28/28, INDEPENDENTLY OF THE LEDGER'; :266 'verify-twins.mjs … 28/28 (27 exact + 1 apostrophe-only)' after the cure; :377-382 'the same 17 files both times: BASE 2 failed | 15 passed (17) / 4 failed | 374 passed 
  - note: Receipt's own arithmetic '9 + 4 + 3' = 16 while the vitest tally says 17 files; the tally is the receipt.
- **RATIFY** [S18, CONFIRMED] structuralValidator.js 39 bangs by tokenizer vs 0 by parser; 64 of 71 bangs over unscanned dirs phantom; tokenizer replaced with espree
  - evidence: guard diff: '+import { parse } from \'espree\'' … '`src/generators/structuralValidator.js` measured **39 exclamation points by the tokenizer and 0 by a parser** … **64 of 71 exclamation points were phantom**' … 'The char scanner is kept as a FALLBACK'; receipt
  - note: Refutation attempted by reading the diff for a widened ceiling or renamed arm: none — the docblock says 'No ceiling moved, no arm renamed, no arm added' and the diff shows none.
- **AMEND** [S18, CONFIRMED] voice-debt total arm green 770 → 290
  - evidence: guard docblock: 'DECLARED MEASUREMENT SHIFT, src/data + src/domain, at this lane's tip: em 290 → 295, bang 15 → 8'; receipt:323 '| E2 total | total | 770 (budget 670) | 770 FAILS | 290/295 → the arm now PASSES |'
  - note: The live instrument is now the parser and it reads 295, not 290; 290 is the retired tokenizer's figure. Write '770 → 295 (parser; 290 under the retired counter)'. The arm passes under both (budget 670
- **RATIFY** [S18, CONFIRMED] removing debt from 88 files pushes the E2 files magnitude 69 → 126; lane refused to widen
  - evidence: receipt:320 '| E2 per-file | files | 69 | 69 | 126 ⛔ BREACH +57 |'; :327-331 'REMOVING debt from 88 files makes 57 more files "drifted". The instrument punishes the cure … The cure is the landing's UPDATE_VOICE_BASELINE=1 refreeze — now legal … I did not run i
- **RATIFY** [S18, CONFIRMED] each of the four is reverted in the sealed commit; consumers live in tests/, .jsx, and regexes
  - evidence: customContentSchema.js: empty diff vs base, 37 em dashes retained; economicState.js:626-629 'Military services — standing army…' retained, consumer tests/generators/economicUpgradeChainAndStage5.test.js:104 'MILITARY_EXPORT = /^(military|mercenary) services —/
  - note: The classifier-class narrative (comparator 'Dangerous — Criminal Governance' :149-151, backtick boundary :155, quasi aside :173-178, splitter :224-233) is in the receipt; the specific '23 appended fra
- **RATIFY** [S18, CONFIRMED] fragment search was the wrong instrument (a digest golden is invisible to it); full suite found two; 21 base failures pass at tip so the timeouts were contention
  - evidence: receipt:413 'Earlier in this receipt I wrote "No golden was re-recorded, because none needed it"'; :425 'a golden that stores a DIGEST is invisible to a content search'; :488 '1642 assertions at base, 1642 at tip'; :500-504 'The ~20 "timeouts" … were CPU conte
- **RATIFY** [S18, CONFIRMED] espionageDormancyFence.test.js:332 says re-record ONLY inside a NAMED CHARTERED WINDOW, 'exactly ONE remains: the LIGHTING WAVE (§881.4)'; the mover is this car; 8 files and 11 assertions owed
  - evidence: fence: 'THE DRIVEN CORPUS MOVED. This is a STOP, not a re-record. The constant is re-recorded ONLY inside a NAMED CHARTERED WINDOW, and after the ENGINE-HYGIENE landing spent AGN's, T13 TRANS closed with zero movement (§883); exactly ONE remains: the LIGHTING 
  - note: File lives at tests/property/, not tests/lint/. The 8/11 count is the receipt's heading; its own table shows six rows (one of them '4 × edgeFunctions'), so the count is PLAUSIBLE, not re-derived.
- **RATIFY** [S18, CONFIRMED] the surviving window is owner-named (§881.4); naming one is the owner's act; the car is sealed and rides
  - evidence: fence names '§881.4' as the one remaining window; ledger §890.4 'CHAIR RULING: the car RIDES THE LIGHTING WAVE; the chair does not mint a second window … naming one is the owner's act'; LANE-QUEUE: '1. THE PROSE WINDOW — one word charters it sooner than the li
  - note: Refutation attempted: could the chair lawfully re-record under the delegation grant? The fence's own text makes the window a NAMED, owner-directed thing and the two spent windows were owner-named; the

## §890.5  —  6 call(s): AMEND 3, RATIFY 2, EVIDENCE-THIN 1
- **AMEND** [S18, CONFIRMED] first gate attempt ran 1,087 s and failed a real first-paint verdict 1,056,551 vs 1,048,000
  - evidence: gate-890.log: GATE_START=2026-09-03T18:06:51Z … GATE_END=2026-09-03T18:24:58Z (=1,087 s); '[typecheck-ratchet] OK … (173 error(s), ceiling 173)'; '[domain-strict] ✓ … (1121 errors, ceiling 1121)'; '✖ 28 problems (0 errors, 28 warnings)'; '[test-ratchet] OK — …
  - note: All figures hold for the FIRST run. The stratum should say so: the landing's gate is the second run, gate-890b.log 18:30:03Z→18:47:41Z = 1,058 s, which is the figure the §890 ledger row carries. As wr
- **RATIFY** [S18, PLAUSIBLE] nine bundle inputs recorded as ../../../Users/… paths; materialising two packages cured them
  - evidence: meta.json at 4233031ba: inputs 'node_modules/immer/dist/immer.mjs', 'node_modules/seedrandom/index.js', …/lib/{alea,tychei,xor128,xor4096,xorshift7,xorwow}.js, seedrandom.js (exactly nine node_modules inputs, all in-project paths); 4233031ba message: 'material
  - note: The nine inputs exist and are exactly the two packages named; the mechanism is coherent with the committed artefact. Settle: at a dock with symlinked immer, run node scripts/build-edge-shared.mjs to a
- **AMEND** [S18, CONFIRMED] the chair began materialising all 438 symlinks, stopped at 45, later restored all 45
  - evidence: dock now: 436 symlinks, 39 real dirs (.bin, .vite-temp + 37 packages); EVERY one of the 37 real packages is DOCK-ONLY (absent from the main repo's node_modules: pg chain mtime 09-03 10:22, listr2/log-update/… chain 11:14); immer → …/settlement-engine/node_modu
  - note: The restore is CONFIRMED complete: no real directory in the dock shadows a main-repo package. The counts 438 and 45 have no log; the dock carries 436 symlinks today (main repo has 437 top-level entrie
- **AMEND** [S18, CONFIRMED] a sibling dock with the same cars and symlinks built GREEN (vendorPdfLazy 31 passed / 11 skipped); restoring the 45 symlinks returned the landing dock to GREEN, commits untouched, porcelain 0
  - evidence: (b) gate-890b.log: 21 references to laneKERNELMARK-tree, GATE_HEAD=ca651d54b…, GATE_PORCELAIN_PRE=[0], '[test-ratchet] STRICT DIST OK — 52 discovered/reported file(s), 440 test(s), zero failed…', GATE_PORCELAIN_POST=[0], GATE_HEAD_POST=ca651d54b; no first-pain
  - note: Direction (b) is CONFIRMED from the gate log. Direction (a) is CONFIRMED by an independent same-sha symlinked build (1,046,996 B, 9,555 B under the materialised dock's 1,056,551) — cite that; the spec
- **RATIFY** [S18, PLAUSIBLE] the sequence keeps both constraints; the reproducibility arm re-verifies via its disk fallback; four suites green simultaneously after the restore
  - evidence: 4233031ba (register 6/6) was built by exactly this sequence: 'materialise ONLY immer and seedrandom … → build → commit the bundles WITH their inputs → RESTORE the symlinks'; committed inputs are clean 'node_modules/…' paths; immer/seedrandom are symlinks again
  - note: The sequence is proven by its second execution (the §891 register 6/6 artefact); the four figures are unlogged. Settle: at laneKERNELMARK-tree run the four files singly (edgeSharedBundleReproducibilit
- **EVIDENCE-THIN** [S18, PLAUSIBLE] an uncommitted regenerated bundle IS the dirty-build class the suite names
  - evidence: No log or receipt in SP carries the 4→6 run; only msg-890.txt restates the law. The suite's own name at 4233031ba: 'edge-shared bundles reproduce AT THE COMMITTED TREE (the dirty-build class)' (ratchet-891.log).
  - note: Self-reported chair error; consistent with the suite's title but unverifiable from receipts.

## §891  —  24 call(s): RATIFY 14, AMEND 5, REVERSE 3, OUT-OF-SCOPE 2
- **RATIFY** [S18, CONFIRMED] sealed at refs/preserve/train891-registers-2026-09-03 with 17 single-parent cars each trailered; porcelain 0
  - evidence: 17 commits ca651d54b..4233031ba (ec6b0a132 … 4233031ba); 17/17 carry 'Seat: Opus 5 — Fable-unvalidated'; ref train891-registers-2026-09-03 → 4233031ba (written 18:20:41); ratchet-891b.log at RATCHET_HEAD=4233031ba 'PORCELAIN=[0]'; dock today: ' M scripts/.writ
  - note: Porcelain 0 held at 18:18; the dock is now dirty by one file from someone's live writerReach --write (untouched by this walk).
- **AMEND** [S18, CONFIRMED] at handoff the seventeen-car train with every register act was unreferenced
  - evidence: refs/preserve/train891-composed-2026-09-03 → 3d3ad217b written 2026-09-03 16:27:53; train891-reg1-2026-09-03 → 250d4e464 written 16:33:39; train891-registers-2026-09-03 → 4233031ba written 18:20:41
  - note: Overstated. At handoff (~18:18) the eleven lane cars and register 1 were already reachable from two seals written two hours earlier; the exposure was the FIVE register commits 79d45d274…4233031ba. Sti
- **RATIFY** [S18, CONFIRMED] CAPACITY C1/C2/C3 · now:null · DESK CAR 1 + correction · CHARSET Car 1 · READERREVIEW Car 2 + three cures
  - evidence: ec6b0a132 CAPACITY C1 · 6bddd6183 C2 · d02c5acde C3 · 3a6f0d761 `now: null` · a59e66e5a DESK CAR 1 · a9e0121bc correction · 4ae140102 CHARSET Car 1 · ac427cc5c READERREVIEW Car 2 · 7b10224fd/c84437766/3d3ad217b cures 1-3 · then six §891 register commits
- **RATIFY** [S18, CONFIRMED] 2510/370/2140/22841/6142 → 2515/371/2144/22919/6152; four lanes' deltas sum +75, composed +78
  - evidence: diff: files 2510→2515, parked 370→371, credited 2140→2144, titles 22841→22919 (+78), suiteTitles 6142→6152, measuredAtSha 3d3ad217b; receipt-charset1 'titles +40 … files 2510 -> 2513 (+3) MEASURED'; receipt-capacity:343 'titles 22,841 → 22,868 (+27…)' :342 'ex
- **RATIFY** [S18, CONFIRMED] predicted before build; measured exact
  - evidence: committed :7789-7790 '"tables": 225, "keys": 2099'; diff '-"keys": 2094 +"keys": 2099', HERALD_TUNING keys 5→10 (+CROWDING_* five keys), '+src/domain/worldPulse/demographicsHerald.js' dependent; receipt-capacity:99 '| totals.keys | 2094 | 2099 (+5, exactly the
- **RATIFY** [S18, CONFIRMED] row count unchanged; multiset of (category, snippet) identical; only path/line moved
  - evidence: probe: 'prose-numerics rows before/after: 225 225 · multiset (category,snippet) identical: True · path count deltas: EconomicsTab.jsx (24, 22), EconomicsGlance.jsx (0, 2) · rows relocated (path changed): 2 · line-drifted rows with same (path,category,snippet):
  - note: Commit says '34 line addresses drifted'; my pairing counts 36. Immaterial to the claim (line-only drift), noted for accuracy.
- **RATIFY** [S18, CONFIRMED] a real plant with catching power rather than a false rationale
  - evidence: sweep: perl 's/"ranges": "D 20-7E A0-AC AE-132 /"ranges": "D 20-7E A0-AC /' + check_caught 'naming-charset/a range leaves the dossier surface…'; MUTATED_FILES += customContentCharset.generated.js; manifest: 'tests/data/namingDataCharset.test.js': {kind: mutati
  - note: Exactly 2 of 5 arms red, exactly one range (U+00AE–U+0132) struck from one surface. Minor: the commit quotes the first eight of 28 codepoints the message names.
- **RATIFY** [S18, CONFIRMED] the model rationale requires catching power 'EXECUTED IN THE TEST BODY'; the file has five arms and no plants; the sweep reverts with git checkout -- so an unlisted file destroys uncommitted work
  - evidence: namingDataCharset.test.js: five `it(` arms (walk not vacuous / dossier printable / book census EXACT / keys printable / debt is BOOK's), zero in-body plants; manifest sibling rationale wording 'the catching power here is already a plant (six of them, in temp t
  - note: The conviction EVENT itself (a second arm refusing) has no log; the machinery that would convict is in the diff.
- **RATIFY** [S18, CONFIRMED] findings, identities and files predicted unchanged and measured unchanged
  - evidence: probe: 'total before: 1993 after: 1993 · identities 1409 → 1409 · inventory <dict len 388> → 388 · frozenAtSha 019829e99… → ffe0dbb81…'; scanStats files 2149→2153, resolved 9425→9421
- **REVERSE** [S18, CONFIRMED] at the lane tip --write moved twelve manifest entries (five its own); at the composed tip exactly one path moved because the seven foreign ones are in the base
  - evidence: probe: 'manifest entries before/after: 2173 2178 added: 5 removed: 0 changed: 27' — CHANGED includes FounderTile.jsx, wizardNews.js, faithTuningSurface.js, simulationRules.js, useFounderTileEligible.js, useReaderAudience.js, flagRegistry.js (the lane's seven '
  - note: The twelve were MANIFEST entries; at the composed tip that figure is 32 (5 added + 27 changed) and it absorbs all seven the lane refused — nothing collapsed. The 'one' is provenanceDriftOf's UNSCANNED
- **RATIFY** [S18, CONFIRMED] the charset lane was right to refuse; the chair was right to absorb at the composed tip
  - evidence: receipt-charset1: 'A lane's absorb would have laundered all seven under my commit's frozenAtSha … THE FINDINGS DO NOT MOVE'; walker: 'observed-shape execution INPUT changed since the last re-freeze (N path(s): …). These are generated/data inputs, not detector 
  - note: Holds in substance: the landing's frozenAtSha is the composed tip, so absorbing all 32 source/input movements under it launders nothing. The stated MECHANISM (collapse to one) must be corrected per th
- **RATIFY** [S18, CONFIRMED] CAPACITY C1 changed simulationRules.js; four arms red; materialise two → build → commit → restore
  - evidence: ratchet-891.log (at 250d4e464) lists aiCharterBundle.freshness, aiOutputSchemaBundle.freshness and two edgeSharedBundleReproducibility arms among the ten reds; 4233031ba: aiCharterBundle sourceHash af88ebc92e069f83→1973da25af360b02, inputs all 'node_modules/…'
- **REVERSE** [S18, CONFIRMED] one failing register; frozen says dark, live says lit
  - evidence: test: 'expect(frozen[row.identity], …).toBe(formatted)' — vitest prints actual first; LANE-QUEUE: "expected 'web-display=R' to be 'web-display=N'" ⇒ frozen=R, live=N; committed baseline:8682 '"situationDesc on economicState": "dossier-pdf=R web-display=R web-t
  - note: Direction inverted (the vitest 'expected X to be Y' misread). The frozen register says web-display REACHES (R); the live scan at 4233031ba grades it N because DESK CAR 1 moved the read behind a prop t
- **OUT-OF-SCOPE** [S18, CONFIRMED] prose window · drift door · ENC-4 nine sentences · 190 B held · corpus deity-free; no push/deploy/migration/deletion
  - evidence: LANE-QUEUE 'THE OWNER'S DESK' items 1-5 match the ledger row verbatim; refs/heads/claude/composite-r4 → ca651d54b (the §890 tip) — the train is not on the branch; c2-HELD-outlook-surface.patch present
  - note: Owner-gated items; recorded, not ruled.
- **RATIFY** [S20, CONFIRMED] The harder, honest register act
  - evidence: Manifest delta is exactly one key: `invariants['tests/data/namingDataCharset.test.js']: None -> {'kind': 'mutation', 'label': 'naming-charset/a range leaves the dossier surface and a shipped name stops printing'}` (the 5,248-line diff is a re-serialisation). S
  - note: The entry's shape, the anchor's uniqueness, the struck range's coverage of the named codepoints, the presence of those codepoints in shipped names, and the green baseline are CONFIRMED; the exact '2 o
- **RATIFY** [S20, CONFIRMED] Composition identity
  - evidence: 17 commits listed; ec6b0a132's parent is ca651d54b; all nine seal/car pairs report SAME patch-id (herald, charset, desk×2, readerreview×4, nownull).
  - note: No car diverges from its seal.
- **AMEND** [S20, CONFIRMED] A law minted from the miss
  - evidence: Commit body: `charset +40, capacity +27, readerreview +8, desk +0 … Sum: +75. MEASURED at the composed tip: +78.` But the train carries FIVE lanes (the body's own note: 'Five lanes batched'), and the fifth — the now-null car 3a6f0d761 — adds plain titles the s
  - note: The residual is not shown to be a composition effect: one lane made no title measurement and adds titles. 'Measured, not summed' was the right practice, but the LAW as stated ('the sum of independentl
- **AMEND** [S20, CONFIRMED] Register act on an exact prediction
  - evidence: `tables 225→225`, `keys 2094→2099`, EXACT. Note: `HERALD_TUNING gains five leaves and RESPONSE_TUNING gains demographicsHerald.js as a dependent` — the register ALSO adds `src/domain/display/demographicReading.js` to RESPONSE_TUNING.dependents.
  - note: The two headline figures are exact; the note under-describes the act by one dependent (C2's leaf). Wording only.
- **RATIFY** [S20, CONFIRMED] Register act
  - evidence: 225 rows both ends; EconomicsGlance.jsx 0→2 mentions, EconomicsTab.jsx 24→22.
  - note: Matches the DESK correction's own measurement.
- **AMEND** [S20, CONFIRMED] The landing's vantage makes the absorb legitimate
  - evidence: frozenAtSha `019829e99…` → `ffe0dbb81…` — the baseline at the composed base was STILL frozen at §889's register 1/3, i.e. §890 never absorbed the seven. The write changed 81 manifest entries and added 14 (32 distinct paths: 5 new leaves; the seven foreign file
  - note: The act is still legitimate at the landing (findings unchanged; the seven files are the chair's own §890 cars, so a landing absorbing their provenance launders nothing foreign) — but the row's factual
- **OUT-OF-SCOPE** [S20, PLAUSIBLE] Register act
  - evidence: 7 files under supabase/functions/_shared (aiCharterBundle.js +59, aiOutputSchemaBundle.js +59, five .meta.json).
  - note: Not in this slice's re-derive list and not examined beyond the stat; the materialise→build→restore-symlinks law from memory applies. Settle: `git -C laneKERNELMARK-tree ls -la node_modules/immer node_
- **REVERSE** [S20, CONFIRMED] A register, not a defect
  - evidence: Reg 7/7 (15c6368a, refs/preserve/train891-reg7-2026-09-03) body: `THE DIRECTION THE HANDOFF GAVE WAS BACKWARDS … "expected 'web-display=R' to be 'web-display=N'" means the REGISTER said R and the TREE measured N.` Diff line 110: `-  "situationDesc on economicS
  - note: The §891 row inverted the drift's direction; the successor's reg-7 corrected it and absorbed rather than cured (docketed for the lighting wave: desk-extraction cars darken web-display grades). The row
- **RATIFY** [S20, CONFIRMED] Survival law payout
  - evidence: `3d3ad217b… train891-composed`, `250d4e464… train891-reg1`, `4233031ba… train891-registers`, `15c6368a6… train891-reg7` (all 2026-09-03).
  - note: Four seals cover the composed tip, the first register, the six-register tip and the seventh.
- **AMEND** [S20, CONFIRMED] Desk roster
  - evidence: Missing from the roster: (1) the state-prose corpus now renders on gallery/anonymous dossiers against the chair's own §885.2/§885.3 default — a paid/public-surface exposure the owner has not ruled on; (2) the dossier-mounts bank 68→64 is unbanked; (3) the H-1 
  - note: The five listed items hold; the roster is short by the four above, the first of which is owner-gated by the chair's own classification.

## A1  —  1 call(s): RATIFY 1
- **RATIFY** [S19, CONFIRMED] 49 ledger commits on review-fixes-2026-07-08 from §882.8 (43dc69853) to §891 (fd3c6e25c); each carries exactly one 'Seat: Opus 5 — Fable-unvalidated'.
  - evidence: 49/49 lines of the form 'fd3c6e25c seatcount=1 seat=[Seat: Opus 5 — Fable-unvalidated|]' … '43dc69853 seatcount=1 seat=[Seat: Opus 5 — Fable-unvalidated|]'; zero commits with 0 or 2 trailers.
  - note: The §882.8 commit itself (the seat-switch act) is already Opus-marked, consistent with the mark following the seat that wrote it.

## A2  —  1 call(s): RATIFY 1
- **RATIFY** [S19, CONFIRMED] 49/49 commits include the FRQ and its blob differs from the parent; every FRQ change is pure insertion.
  - evidence: e.g. 'fd3c6e25c … frq_in_commit=1 blob=451134c03 parent=d9e804813 DIFF'; '43dc69853 … blob=f2e704081 parent=ab87148d2 DIFF'; numstat per commit ranges +12/-0 (§882.9–§882.12) to +45/-0 (§885.7), every one '-0'. Whole span: git diff --numstat 43dc69853^ fd3c6e2
  - note: No commit carries an 'Enrols:' line (grep -c '^Enrols:' = 0 for all 49), so the §882.14 ENROLMENT GATE's escape hatch was never used in the span.

## A3  —  1 call(s): AMEND 1
- **AMEND** [S19, CONFIRMED] Every commit added ≥1 FRQ row, but three mappings are broken: (i) ledger acts §883.2/§883.3/§883.4 (7a5a6f585/0fd589f66/2ee73f4b7) added FRQ rows numbered §883.5/§883.6/§883.7 (bold lane rows INSTR-WRW/CURE-CAPSULE/INSTR
  - evidence: '7a5a6f585 +16/-0 rows_added=[§883.5]', '0fd589f66 +12/-0 rows_added=[§883.6]', '2ee73f4b7 +16/-0 rows_added=[§883.7]', then 'e4f840774 +44/-0 rows_added=[§883.5]', '9b7d6998b … [§883.6]', 'efcf98b89 … [§883.7]'. full.md: 193 '**§883.5 · lane INSTR-WRW', 209 '
  - note: Rename the three bold lane rows (e.g. §883.4b–d or §883.1e–g) so '§883.6' resolves to one row; add a one-line ledger anchor for §889.2 or fold it into §889.3; add a '## §890' landing row (or retitle §

## B1  —  1 call(s): AMEND 1
- **AMEND** [S19, CONFIRMED] Enrolled with calls: T13-BUILD/PRELAND/land, CURE-PORCELAIN, INSTR-WRW, CURE-CAPSULE, INSTR-SOAK, INSTR-TUNEREG, the six G0 lanes, GOLDEN, RETRO-AUDIT, INSTR-land, CURECAP-REBASE, FILLLAYER, DARKREADER, NEWSLAYER, PREGAT
  - evidence: Seal citations: 'd02c5acde preserve/capacity-2026-09-03 stratum=0 ledger=0', '9a95d6799 preserve/charset1-2026-09-03 stratum=0 ledger=0', 'eb0a5762b preserve/deskwiring-2026-09-03 stratum=0 ledger=0', '9885cfb97 preserve/readerreview2-2026-09-03 stratum=0 ledg
  - note: This is exactly the §882.14 shape ('an Opus lane … whose queue row covered only the chair's own calls and cited the receipt merely as a receipt') recurring in the span's final row. §891 must enrol the

## C1  —  1 call(s): RATIFY 1
- **RATIFY** [S19, CONFIRMED] All 43 worktrees in 'git worktree list' plus the seven lane-branch tips: every HEAD is contained by ≥1 ref. Zero unreachable.
  - evidence: '4233031ba containing_refs=1 first=[preserve/train891-registers-2026-09-03]', '9885cfb97 =1 [preserve/readerreview2-2026-09-03]', '8f4d5c648 =1 [preserve/srcprose-2026-09-03]', '9a95d6799 =1 [preserve/charset1-2026-09-03]', 'eb0a5762b =1 [preserve/deskwiring-2
  - note: Eleven docks hang from exactly ONE ref each; a single bad ref deletion is the remaining exposure.

## C2  —  1 call(s): AMEND 1
- **AMEND** [S19, CONFIRMED] 62be253f3 (CURE-CAPSULE rebased, §884.4) is reachable ONLY from refs/heads/preserve/curecapsule-rebased-2026-09-02 — a BRANCH under refs/heads/preserve/, not a refs/preserve/* seal; a duplicate refs/heads/preserve/cureca
  - evidence: 'c422ee824… refs/heads/preserve/curecapsule-2026-09-02 / 62be253f3… refs/heads/preserve/curecapsule-rebased-2026-09-02 / c422ee824… refs/preserve/curecapsule-2026-09-02'; --contains 62be253f3 → 'refs/heads/preserve/curecapsule-rebased-2026-09-02' only; '62be25
  - note: Whoever sealed it wrote 'git branch preserve/…' not 'git update-ref refs/preserve/…'. A chair act should mirror it into refs/preserve/ and record the seal at §884.4; I touched nothing.

## C3  —  1 call(s): AMEND 1
- **AMEND** [S19, CONFIRMED] Dirty at arrival and unchanged at exit: laneKERNELMARK-tree @4233031ba ' M scripts/.writer-reach-baseline.json' (tracked — the pending writerReach --write §891 names; §891's 'porcelain 0' is now stale); laneENC-tree @30c
  - evidence: 'laneKERNELMARK-tree HEAD=4233031ba porcelain_lines=1 / laneENC-tree HEAD=30c1667bc porcelain_lines=13 / lanePARSER-tree … 4 / laneREGISTRY-tree … 2 / laneG0CHARSET-tree … 9 / laneG0SOAK-tree … 2 / laneG0WRW-tree … 3 / lanePAIDFIX-tree @6fe6eaa58 porcelain=2'.
  - note: The three lane receipts (emdash, emdash-annex, determinism) exist ONLY as untracked dock files plus scratchpad salvage copies — a dock retire destroys the originals; they should be copied to $SP as re

## D1  —  1 call(s): AMEND 1
- **AMEND** [S19, CONFIRMED] None does, and structurally none can: the FRQ is append-only over the whole span (1232 insertions, 0 deletions), so no earlier row was ever edited. All five pairs verified as real supersessions: §883.6 'REFREEZE PLUS ONE
  - evidence: numstat '1232 0 docs/FABLE_RETROVALIDATION_QUEUE.md'; deleted-line count '0'. Earlier-row greps for §883.8/§884.6/§885.6/§888/§890.1 all empty. full.md:296 (§883.6) '(b) A DECLARED_GROWTH entry — moot after a refreeze'; :332 (§883.8) 'So the DECLARED_GROWTH ro
  - note: A reader walking top-to-bottom (as §5 instructs) meets five rulings as live before meeting their withdrawal. Add a one-line '⛔ SUPERSEDED at §N' marker under each earlier heading; the per-artifact sta

## D2  —  1 call(s): RATIFY 1
- **RATIFY** [S19, CONFIRMED] The correction lives inside the same row: §889.1 carries the section 'THE CHAIR'S OWN BRIEF WAS WRONG, AND THE RECON REFUTED IT' (full.md:991), and the card (01dcd57df, surviving at HEAD line 96) carries 'module-eval val
  - evidence: full.md:991 '### ⭐ THE CHAIR'S OWN BRIEF WAS WRONG, AND THE RECON REFUTED IT'; card diff: '⚠ AND THE CHAIR'S OWN BRIEF WAS REFUTED BY MEASUREMENT: module-eval validation of a catalog row is true of 1 of 11 registries, not all'; HEAD card :96 '(2) A LIVE DEFECT
  - note: Self-contained; no pointer owed. This also settles §889.2's own re-derive item ('verify the card now carries both §889.1 findings') — it does, at HEAD line 96.

## E1  —  1 call(s): REVERSE 1
- **REVERSE** [S19, CONFIRMED] Not executed. FRQ §3 at HEAD (lines 45–46) still reads the old clause: 'Lane (subagent) work inherits its dispatching chair's seat and is enrolled by that chair at collection.' No text 'follows the seat' / 'did the work'
  - evidence: FRQ:45–46 '- Lane (subagent) work inherits its dispatching chair's seat and is enrolled by that\n  chair at collection. A lane never writes this file.' grep → only ':2044:**§882.14.2 · THE SEVEN CLASS-C LANES…'. Ledger 32363: 'RATIFIED — practice is the law: t
  - note: The RULING (practice is the law; the auditor's reading ratified) holds and should be RATIFIED on its merits; the CLAIM that §3 was amended is false and is a chair error not self-reported. Execute the 

## F1  —  1 call(s): RATIFY 1
- **RATIFY** [S19, CONFIRMED] Re-derived exactly: 56 commits from §879 (c4b5dce53) to ab4ef2501^; 47 'Seat: Fable', 9 'Seat: Opus', 0 unmarked, 0 multi-trailer.
  - evidence: '§879 commit = c4b5dce53'; 'acts §879..§882.13 = 56'; 'fable=47 opus=9 unmarked=0 multi=0'.
  - note: The audit's mechanical half is exact; its judgment half (CLASS-C practice) is E1.

## F2  —  1 call(s): RATIFY 1
- **RATIFY** [S19, CONFIRMED] refs/preserve/golden-build-2026-09-02 = ba08939d7, t13-consist-2026-09-02 = 9f0df13a1, paidprep-rehearsal-2026-09-01 = f02fd7c4b (§882.14); lighting-rows-wip-2026-09-03 = f47433b32 and contains b6ca05958 (O-12) (§889.3);
  - evidence: 'ba08939d7 refs/preserve/golden-build-2026-09-02', '9f0df13a1 refs/preserve/t13-consist-2026-09-02', 'f02fd7c4b refs/preserve/paidprep-rehearsal-2026-09-01', 'f47433b32 refs/preserve/lighting-rows-wip-2026-09-03', 'b6ca05958 IS ancestor of f47433b32', 'cars=17
  - note: The '#NINE times in one day' / 'SIX times' tallies in §891/§889.3 were not recounted; PLAUSIBLE only — settle with git log -S'refs/preserve' over the ledger commits of 09-03.

## F3  —  1 call(s): RATIFY 1
- **RATIFY** [S19, CONFIRMED] §888: 8 cars f12360185..bbba1be24, 7 trailers, 394d758ee ('ENC-1 cure: the chance-meeting leaf's types tell the truth') has 0 — as recorded, not rewritten. §889: 15 cars / 15 trailers. §890: 8 cars / 8 trailers, 22 files
  - evidence: '§888 cars=8 trailers=7', '394d758ee ENC-1 cure…' → Seat count '0'; '§889 cars=15 trailers=15'; '§890 cars=8 trailers=8', '22 files changed, 855 insertions(+), 88 deletions(-)'.
  - note: The JUDGMENT-missing-trailer.md decision (keep 394d758ee untrailered because .tuning-inventory.json cites it as measuredAtSha) is enrolled at §888 'THE TRAILER GAP, RECORDED RATHER THAN REWRITTEN'.

## F4  —  1 call(s): RATIFY 1
- **RATIFY** [S19, CONFIRMED] Uncited (stratum=0, ledger=0) but ancestors of their cited tip: enc1-composed 36aafe57d and enc1-cured2 b6822dcae → bbba1be24; train889-composed/registers/registers2 → 30c1667bc; train890-bundles/composed/o17 → ca651d54b
  - evidence: '36aafe57d IS ancestor of bbba1be24', 'b6822dcae IS ancestor of bbba1be24', 'efed4ba91/3702af0a2/4f3eac16c IS ancestor of 30c1667bc', '69bd44f65/7733e064e/8d639dc54 IS ancestor of ca651d54b', '3d3ad217b/250d4e464 IS ancestor of 4233031ba', 'd02c5acde IS ancest
  - note: Benign for the ancestors (the tip's citation covers them). The four non-ancestor seals are the only refs holding those lanes' original tips and are cited nowhere — folded into B1.

## CAPACITY  —  12 call(s): AMEND 1, RATIFY 9, REVERSE 1, EVIDENCE-THIN 1
- **AMEND** [S20, CONFIRMED] Prediction exact and complete
  - evidence: @4233031ba: HERALD_TUNING keys 10, line 83, spanDigest 2f820c03deb05c72…, leaves +CROWDING_LINE_MIN_SOULS/CROWDING_FILLED_SEVERITY/CROWDING_THINNED_SEVERITY/CROWDING_FILLED_SCORE/CROWDING_THINNED_SCORE; totals.keys 2094→2099; tables 225→225. RESPONSE_TUNING de
  - note: The four named figures are exact, but the final-tip prediction (receipt:337-338) names ONE new dependent and the composed register carries TWO: C2's demographicReading.js also joined. The chair's reg-
- **RATIFY** [S20, CONFIRMED] Wrong file and wrong table in the design volume, corrected by measurement
  - evidence: Only hits: src/domain/spatial/migration.js:117,118,120,247,260; `:73 export const MIGRATION_TUNING = Object.freeze({` and `:120 CONGEST_DECAY: 0.85,`. No CONGEST_DECAY anywhere else under src. Coverage row at demographicsRates.js:457-458 cites `src/domain/spat
  - note: Refutation attempted (searched every src file for the key); the design citation is a phantom exactly as the lane said.
- **RATIFY** [S20, CONFIRMED] The both-ways arm supersedes the design's '16 rows'
  - evidence: Rows counted at lines 429-458: 23 `kind: 'tunable'` (incl. :438 `demographicsHerald.js#QUANTITY_BANDS … UNSUFFIXED, so the _TUNING glob cannot see it` and :457-458 the CONGEST_DECAY cross-family row); lines 468-475: 8 `kind: 'vocabulary'`. :420 comment exclude
  - note: 31 rows counted by hand at the train tip; the negative-control plant (receipt:79-84) is the lane's own executed evidence and is not re-run here.
- **RATIFY** [S20, CONFIRMED] Vetoable divergence from the design's letter, honest at zero census cost
  - evidence: `:176 // ⛔ \`population_crowding\` IS ROUTED BY THE \`population_\` FAMILY PREFIX, NOT FROM HERE,` and `:408 ['population_', 'trade'],` in PREFIX_RULES; :175 the sibling exact rows `population_growth: 'trade', population_emigration: 'trade', population_decline
  - note: The reason is recorded at the site as claimed; the kindPoolFloors reds (275>274 shrink-only) are the lane's executed evidence, consistent with the file's own comments the lane quotes.
- **RATIFY** [S20, CONFIRMED] A relocation of a bill on structural grounds
  - evidence: `:874 // \`demographicsEnabled\` is a VIRTUAL flag (no DEFAULT_SIMULATION_RULES entry; every` … `:888 demographicsEnabled: false,`. tripwires.mjs:212-218 `EVERY ROW BELOW IS NOT-EXECUTABLE ON A DARK CELL … The demographic term ships DARK`.
  - note: Default is false at the tip. 'Every shipped preset' is PLAUSIBLE — settle with `git show 4233031ba:src/domain/worldPulse/simulationRules.js | grep -n -B2 -A2 demographicsEnabled` over each preset lite
- **RATIFY** [S20, CONFIRMED] Owner-gated byte spend correctly stopped and priced
  - evidence: Patch: 192 lines; `diff --git a/src/components/new/tabs/ViabilityTab.jsx`, `a/tests/build/vendorPdfLazy.test.js`, `a/tests/components/viabilityTabAdjudication.test.jsx` (3 files, 150 '+' lines). 6bddd6183 name-status: `A src/domain/display/demographicReading.j
  - note: The STOP disposition and the held-patch shape are CONFIRMED; the 190 B figure itself is PLAUSIBLE (settle: apply the patch in a scratch worktree, `npm run build` both ways, compare vendorPdfLazy's ent
- **RATIFY** [S20, CONFIRMED] Boundary held
  - evidence: Exactly two paths, both `A`: src/domain/display/demographicReading.js, tests/domain/demographicReading.test.js.
  - note: Refutation attempt: no src/pdf path in the car.
- **RATIFY** [S20, CONFIRMED] Cured at cause
  - evidence: `:188 // settlement whose population is not a real count is not readable at all.` `:190 if (typeof population !== 'number' || !Number.isFinite(population) || population < 0) return null;` `:195 if (!(readings.bound > 0)) return null;` `:181 if (!demographicsAc
  - note: Guard present and total (type, finiteness, sign, bound).
- **REVERSE** [S20, CONFIRMED] The refusal rests on a measurement
  - evidence: At the lane's OWN BASE ca651d54b, observeBehavioralYear returns `:1016 motion: {` `:1017 populationTransitions,` `:1018 populationMoved,` … `powerMoved, },` computed at :938-958 (`if (Math.abs(afterPopulation - beforePopulation) / Math.max(1, beforePopulation)
  - note: The premise is false: the field IS written by the soak at the lane's base, under exactly the path the design named. No schema change is owed and the fourth row is buildable. Worse, the false measureme
- **RATIFY** [S20, CONFIRMED] Floors not goldens; no tuning act
  - evidence: `:45 const MOTION_FLOOR_01 = 0.0025;` `:47 const MOVING_SHARE_FLOOR = 0.05;` `:127 ).toBeGreaterThanOrEqual(MOVING_SHARE_FLOOR);` `:140 ).toBeGreaterThan(0.1);` `:171/181/188 toBeGreaterThanOrEqual(1)` over within60/within30. d02c5acde paths: scripts/soak/trip
  - note: The measured figures (0.95, 0.4098, year 14) are the lane's executed evidence; the bars and the no-src-byte claim are verified here.
- **EVIDENCE-THIN** [S20, CONFIRMED] Neither: the row never reached the lane
  - evidence: receipt-capacity.md: 0 hits for H-1. brief-KERNELMARK.md (the CAPACITY lane's brief): 0 hits for CAPACITY, H-1, bound(y, handover or 1.5. DESIGN_HORIZON.md (both copies): 0 hits for `bound(y`. brief-INSTR-SOAK.md:7 `the recommended re-shape (…) is CAPACITY's a
  - note: The lane cannot be faulted — it was never asked. The handover was DROPPED at the chair's brief-authoring step between the SOAK receipt and the CAPACITY brief, and the CAPACITY design volume never carr
- **RATIFY** [S20, CONFIRMED] Prediction of the landing's refreeze
  - evidence: Composed: files 2510→2515 (+5 = CAPACITY 2 [demographicReading.test.js, demographicsEnvelope.test.js new] + CHARSET 3), suiteTitles 6142→6152 (+10 = CAPACITY 4 + CHARSET 6), credited 2140→2144 (+4 = CAPACITY 2 + CHARSET 2), parked 370→371 (+1 CHARSET). grep of
  - note: Every non-title figure reconciles as a plain sum with the CHARSET lane's prediction; the per-lane title share cannot be isolated at the composed tip (see the reg-1/2 entry).

## CHARSET  —  8 call(s): RATIFY 8
- **RATIFY** [S20, CONFIRMED] The three existing generated artifacts stay byte-identical
  - evidence: `:157 // \`surfaces\` is a CHARSET input, not runtime vocabulary` … `:161 }).map(({ schema: _schema, surfaces: _surfaces, ...field }) => field);`
  - note: The strip is in the tree exactly as described.
- **RATIFY** [S20, CONFIRMED] Defect cured at cause
  - evidence: `:80 "control": "0-1F 7F-9F",`
  - note: The stored set is the whole control range; the per-field exemption is at customContentCharset.js:418-423.
- **RATIFY** [S20, CONFIRMED] Defect cured at cause
  - evidence: `:162 /** TAB, LF and CR, which a multiline field is allowed to carry. */` `:418 // TAB, LF and CR on a multiline field are LAYOUT, not glyphs.` `:423 if (cls.multiline && MULTILINE_CONTROLS.includes(cp)) return;`
  - note: Refutation attempt: the skip precedes the surface check at :447, so LF cannot reach `uncovered_codepoint` on a multiline field.
- **RATIFY** [S20, CONFIRMED] Refusal at the lane's vantage
  - evidence: At the lane's base AND at the composed base the baseline's `frozenAtSha` was still `019829e99ef4e4…` (§889 register 1/3) — §890 never refroze it. The composed write (2445bb3c5) CHANGED 81 manifest entries and ADDED 14 across executionTree/scanTree/sourceTree (
  - note: The lane's refusal was correct on its own terms and its measurement is reproduced: the seven foreign entries were STILL unabsorbed at the composed tip. See the §891 OSR entry for the chair's counter-c
- **RATIFY** [S20, CONFIRMED] Recorded, vetoable
  - evidence: `/* eslint-disable */` `// GENERATED by scripts/generate-custom-content-manifest.mjs. Do not edit by hand.`
  - note: Header present; the 28→29 warning delta is the lane's executed evidence.
- **RATIFY** [S20, CONFIRMED] Scope held
  - evidence: Only importers outside the leaf: `src/utils/generateCampaignPDF.js:34 import { sanitizeJsPdfText as s } from './jsPdfText.js';` and `src/utils/generateWorldBook.js:27` (the hoist). No src file imports customContentCharset.js. Two full-build figures (engine 675
  - note: The zero-byte claim follows structurally from the absent importer; the measured build figures are not re-run here.
- **RATIFY** [S20, CONFIRMED] Prediction of landing acts
  - evidence: Three new test files (tests/build/customContentCharsetLazy.test.js, tests/data/namingDataCharset.test.js, tests/domain/customContentCharset.test.js). `:166 describe.runIf(distExists)('the built bundle carries no charset bytes on first paint'` → parked 370→371 
  - note: Titles +40 is PLAUSIBLE (43 plain `it(` added by grep, 3 inside the parked suite).
- **RATIFY** [S20, CONFIRMED] Identity of seal and car
  - evidence: `9a95d67998… refs/preserve/charset1-2026-09-03`; `9a95d6799 == 4ae140102 SAME patch-id 2c47b302f048`.
  - note: Byte-identical rebase.

## DESK  —  10 call(s): RATIFY 8, AMEND 1, REVERSE 1
- **RATIFY** [S20, CONFIRMED] Rung choices, vetoable
  - evidence: DOSSIER_MOUNTS rows: `economics.prosperityHeader … blockId: 'DS-ECO-1', rung: 'sentence'`, `economics.economyTile … 'DS-ECO-8', rung: 'glance'`, `economics.foodTile … 'DS-ECO-2', rung: 'glance'`, `economics.seasonTile … 'DS-ECO-2', rung: 'glance'`, `economics.
  - note: The C3 collision (one block, two positions) is real on the table's own shape and the glance choice resolves it; deferral written at receipt:313-315.
- **RATIFY** [S20, CONFIRMED] Determinism preserved across all three lifecycle paths
  - evidence: `EconomicsTab.jsx:319 const deskProse = economyStateProse(s, { foodBalance: fbal, granaryOutlook: granary }, { seed: String(s?._seed ?? s?.id ?? '') });` `accountImport.js:~622 _seed: undefined,` inside the imported-settlement spread.
  - note: No clock read on the path; the import fallback is exactly as the lane traced.
- **RATIFY** [S20, PLAUSIBLE] Room made without raising a number
  - evidence: EconomicsTab.jsx ≈600 → ≈581; EconomicsGlance.jsx ≈50; dossierMounts.js ≈63. a59e66e5a: `A src/components/new/tabs/EconomicsGlance.jsx`; scripts/.size-baseline.json not in ca651d54b..4233031ba's register diff.
  - note: Direction and magnitude confirmed by approximation; the eslint-exact figure would settle with `npx eslint --no-eslintrc --rule '{"max-lines":["error",{"max":600,"skipBlankLines":true,"skipComments":tr
- **AMEND** [S20, CONFIRMED] Register movement handed to the landing
  - evidence: UNMOUNTED_BLOCKS at 4233031ba lists 64 ids (11 DEF + 11 economy/SUP + 23 POP/GEN/REL/HK + 7 POW + 3 STR/CND + 9 WAR/FTH). The baseline reads `{"UNMOUNTED_BLOCKS":{"blocks":68}}` at ca651d54b, at 4233031ba AND at 15c6368a6. `npx vitest run tests/lint/dossierMou
  - note: The lane's prediction is right and the register is NOT taken: §891's 'all six register acts taken' and reg-7's 'seventh and last' both omit the dossier-mounts bank the lane named. Not a red — but an u
- **RATIFY** [S20, CONFIRMED] Cure at the seam, not a baseline edit
  - evidence: economyStateProse.js `:254 The last key is \`foodSecurityRung\`, NOT \`foodSecurity\`` … `:330 foodSecurityRung: securityKey`; EconomicsTab.jsx `:320 drawnAtMount('economics.foodSecurity', deskProse.foodSecurityRung)`. OSR register act at the composed tip: `to
  - note: The resolver reasoning is corroborated by the composed OSR act carrying zero new findings.
- **RATIFY** [S20, CONFIRMED] A false-report-family defect self-caught before banking
  - evidence: Rows 225 at ca651d54b and 225 at 4233031ba; `EconomicsGlance.jsx` mentions 0→2, `EconomicsTab.jsx` 24→22. EconomicsGlance.jsx:99 keeps `sub:ecoScore?\`Output score: ${ecoScore}/100\`:undefined` inside the JSX array literal.
  - note: The chair's reg-3/6 'debt SHAPE byte-identical' is consistent with this measurement.
- **RATIFY** [S20, CONFIRMED] Coverage kept at zero title cost
  - evidence: Diff removes `- test('THE ROUTER READ: drawnAtMount hands a position the depth its ROW names', () => {` and its body and adds `+ // ── THE ROUTER READ, the other runtime accessor, folded into this test rather than given a title of its own`. Dock run: 16 passed
  - note: Fold present; the assertions survive inside the host test (dock run green).
- **RATIFY** [S20, CONFIRMED] Classification, not exemption
  - evidence: `:176 'src/components/new/tabs/EconomicsGlance.jsx':` `:177 'Child of a covered surface, on the SupplyChainsPanel.jsx standing directly above: … EconomicsTab still renders <EconomyFreshnessNote variant="tallies"> ABOVE it in the same return …'`
  - note: Written reason present at the classification site.
- **REVERSE** [S20, CONFIRMED] The chair 'operates under the conservative default'
  - evidence: OutputContainer.jsx `:446 const publicDossier = readOnly && !saveId;` `:703 case 'economics':  return <EconomicsTab settlement={s} narrativeNote={null} saveId={saveId} />;` (no publicDossier prop) while `:724 <WarTab … publicDossier={publicDossier} />`, `:725 
  - note: The default was declared twice in the ledger and never carried into the desk-wiring brief, the lane's design, or the landing check: as composed, the train lights the state-prose corpus on gallery and 
- **RATIFY** [S20, CONFIRMED] Identity
  - evidence: `eb0a5762b… refs/preserve/deskwiring-2026-09-03`; `f6fb66720 == a59e66e5a SAME patch-id 1e331b82eda0`; `eb0a5762b == a9e0121bc SAME patch-id 79e6f36afcd2`.
  - note: Byte-identical rebases.

## READERREVIEW  —  12 call(s): RATIFY 11, AMEND 1
- **RATIFY** [S20, CONFIRMED] Scope widening forced by the dependency
  - evidence: `A scripts/review/readerCorpus.mjs` (999 lines), `A scripts/review/reader-corpus.mjs`, `A scripts/review/readerStoreStub.mjs`, `A scripts/review/reader-backlog.mjs`, `M tests/scripts/readerCorpusManifest.test.js`; no change to scripts/lib/golden-corpus-key.mjs
  - note: Car 1's files are not in the car.
- **RATIFY** [S20, CONFIRMED] Flagged reshape, vetoable
  - evidence: readerCorpus.mjs `:68 import { foldDecades } from '../audit/soakInvariants.mjs';` `:1019 * The liveness fold, BY IMPORT of the soak's own \`foldDecades\`` `:1025 return foldDecades({`. soakInvariants.mjs `:157 @returns {{rows: Array<object>, partialTailYears: 
  - note: The named consumer accepts both shapes, as the lane said.
- **RATIFY** [S20, CONFIRMED] Fail-closed instrument shape
  - evidence: `:565 * … means a run with no tab renderer RECORDS the absence rather than silently` `:791 notRendered: true,` `:810 if (doc.notRendered) receipt.notRendered = true;`
  - note: Absence is recorded, not hidden.
- **RATIFY** [S20, CONFIRMED] Owner row opened, not decided
  - evidence: `:106 * \`errandSpineEnabled === true\` AND \`espionageEnabled === true\`. This overlay therefore` `:109 * adding \`errandSpineEnabled\` here would answer the owner's question by editing a literal.` `:116 export const PREVIEW_OVERLAY = Object.freeze({`
  - note: Correctly routed as OUT-OF-SCOPE for the lane; the row still needs a home on the owner's desk.
- **RATIFY** [S20, CONFIRMED] Reverted deviation
  - evidence: `:681 collectWorldBook(campaign, saves, { mode: 'dm', faithUnlocked: true })` `:690 collectWorldBook(campaign, saves, { mode: 'player', faithUnlocked: true })` `:694 collectRealmSummary(campaign, saves, { faithUnlocked: true })`
  - note: Both books carry the same entitlement; only `mode` varies.
- **RATIFY** [S20, CONFIRMED] Guard made testable
  - evidence: `:324 export function refuseAdvanceResult({ result, campaignId, year }) {` `:335 export function refuseNonFiniteWorld({ composite, campaignId, year }) {`; test `:295 it('a paused year and a non-finite world are both refused, and each refusal names the campaign
  - note: Exported and exercised by name.
- **AMEND** [S20, CONFIRMED] Prediction
  - evidence: All four RR cars: `M tests/scripts/readerCorpusManifest.test.js` only under tests/. 16 `it(` heads under one `describe` at 4233031ba (was 8). Composed credited 2140→2144 (+4), fully accounted for by CAPACITY's 2 and CHARSET's 2 new credited files.
  - note: 'credited +8' in the receipt is wrong: `credited` is a FILE count (credited 2144 + parked 371 = files 2515 per the reg-1 body); RR added no file, so its credited delta is 0. titles +8 stands.
- **RATIFY** [S20, CONFIRMED] Cure plus structural guard
  - evidence: `:413 // producer read \`worldStateAtYear\`, which is deliberately null except at years 10/20/30` `:417 chronicleAtYear: latestChronicleOf(result.worldState),` `:418 worldStateAtYear: WORLD_DUMP_YEARS.includes(year) ? result.worldState : null,` `:623 chronicle
  - note: The two captures are split as described. The '<32 B' floor constant was not located by my grep (searched 'floor|length <'); PLAUSIBLE — settle with `grep -n 'silently-empty\|32' scripts/review/readerC
- **RATIFY** [S20, CONFIRMED] Fail-closed both ways
  - evidence: `export function readerTuningBlock(root…) { try { const fingerprint = tuningRegisterFingerprint(root); if (!fingerprint?.declaredSha256) { return { state: 'unregistered', … }; } const version = Number(fingerprint.signatureVersion ?? 0); return { state: version
  - note: The block cannot say `signed` unless the register's signatureVersion is > 0, which only the owner's signing act moves.
- **RATIFY** [S20, CONFIRMED] Cured at cause
  - evidence: `:56 import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';` `:278 expectAbsentWithAnchor(` inside `:229 it('the whole document set renders twice with identical hashes, and the run id is not inside one'`.
  - note: The anchored form is in the tree; no new known failure was banked (the test-ratchet baseline is not in ca651d54b..4233031ba's register diff).
- **RATIFY** [S20, CONFIRMED] Instrument convictions cured; owner row opened
  - evidence: `:155 { campaignId: 'rr-control-w0', engineCampaignId: 'whole-world-soak', engineCampaignName: 'Whole-World Soak Realm', …}` `:267 // measured, not surmised. \`engineCampaignId\` therefore exists so the control can wear the` `:269 id: row.engineCampaignId ?? r
  - note: Both cures are in source. The hash measurements (2409ea4e… reproduced; 43/47 then 47/47) are the lane's executed evidence — PLAUSIBLE here; settle with `node scripts/audit/whole-world-soak.mjs --years
- **RATIFY** [S20, CONFIRMED] Identity
  - evidence: `9885cfb97… refs/preserve/readerreview2-2026-09-03`; SAME patch-ids: fff554758==ac427cc5c b27e59004783, cce6d2773==7b10224fd a2eb7dcc9921, 59ff5ef10==c84437766 3d6570869240, 9885cfb97==3d3ad217b 6c3341bd9bd6.
  - note: Byte-identical rebases.

## HERALD  —  2 call(s): RATIFY 2
- **RATIFY** [S20, CONFIRMED] Cure + habitat arm
  - evidence: Pre-cure @30c1667bc `:705 ...((entry.sectionAuthority === 'war_rulings_registry' || … 'war_coalition_registry' || … 'envoy_registry')`; post-cure @ca651d54b `:722-725 … || entry.sectionAuthority === 'sovereignty_registry')`. Car diff: 2 files (+68/−1): the all
  - note: Correct cure at cause with a non-vacuous arm; landed in the §890 train. The §890/§891 rows carry no judgment entry for it — enrol these three HERALD entries at §892.
- **RATIFY** [S20, CONFIRMED] The cure is proved by execution, three ways
  - evidence: Output: `a authority= sovereignty_registry section= adjudication` / `b authority= envoy_registry section= adjudication` / `c authority= DROPPED section= adjudication`; PROBE_EXIT=0; lanePREGATE-tree porcelain 0 before and after.
  - note: §889.1's DROPPED→survives is reproduced with both controls at the §890 tip's code.
