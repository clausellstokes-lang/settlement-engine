# THE COHERENCE FOLD — THE REVIEW RECORD (moved out of `docs/DESIGN_FP_COHERENCE_FOLD.md` by the consolidation pass P8d, 2026-10-23)

The text of record is `1beabdc85` (`history/COHERENCE_FOLD-bracketed-1beabdc85.md`, byte-identical to the docs file at the start of the pass). Each Part below is that text's own lines, byte for byte, between its BEGIN and END comments; the consolidated fold keeps one pointer line where §8 and §9 stood, and restates the old header block's design facts in its new header, THE READER'S GUIDE and the Status and Evidence-class paragraphs.

- **Part 0** — the old header block (old lines 1–44): the title, the session header with the owner's word of 2026-10-16 and the thirteen reads, Status, Evidence class and Base for amendment.
- **Part 8** — old §8 WHAT WAS AMENDED WHERE (old lines 1384–1447).
- **Part 9** — old §9 THE ADVERSARIAL REVIEW (old lines 1448–1820), its sub-sections §9.1–§9.7 keeping their numbers.

---

## Part 0 — the old header block

<!-- BEGIN Part 0: old lines 1–44 of the text of record, verbatim -->
# THE FP COHERENCE FOLD — one read of the whole corpus, the laws it was missing, the conflicts between its volumes ruled, and every volume amended in place

## Chair session 2fc13d59 (Fable 5.1), 2026-10-16. The owner's word: "read them
## comprehensively, refine them, and then can you refine them as a whole to make
## them completely cohesive and coherent?" + "complete with adversarial review".
## Thirteen reader seats read every FP volume WHOLE (48,891 lines across thirty
## files: the spine, the couplings, thirteen program design/architecture pairs,
## the compiled fold, the four later volumes CN/LG/PG/MF, and the war-rulings,
## realm-directives and route-lifecycle references), each against the code of
## record `origin/master` @ `00b648c9d` and the build record (the FP progress
## board, FP-ORDER, the ledger by grep). Their findings — a status table, the
## laws verbatim, every cross-program claim graded, internal contradictions,
## stale premises, the clock and tier of every mechanism, a felt-value verdict
## per mechanism, the vocabulary, the in-place refinements, and the owner's
## questions — are the kit `settlement-engine-kits/fp-coherence-2fc13d59-2026-10-16/findings/`
## (SP-CW · GR · IN-ES · TR-EC · WF · POP · INT · WY · HB · WC-1 · WC-2 · EP ·
## FOLD-SMALL), ~5,000 lines of receipts. THIS VOLUME is the chair's fold of
## them: it rules what a chair may rule, routes what is the owner's, and
## applies every in-place correction to the volumes (§8) so that no law is
## re-narrated and no stale sentence stands unbracketed.

**Status: THE FOLD IS LAW WHERE IT RULES AND A ROUTING WHERE IT ROUTES.** Its
chair rulings are vetoable by one owner clause; its owner rows (§7) decide
nothing on silence. Nothing here schedules a build: the owner's standing
order (UI + prose release first; "everything else after"; the EC dispatch gate
"pushed and deployed") binds. The in-place amendments (§8) are dated brackets
beside the text they correct — never a rewrite of a law, a ruling or an owner
quotation.

**Evidence class.** Every substrate statement is a READ at `00b648c9d`
(CONFIRMED in the brief's sense); under the estate's convention nothing here
is executed evidence. Where a reader reasoned rather than read, the findings
file says PLAUSIBLE and this fold carries the word.

**Base for amendment.** The kit holds two copies of each volume: the ledger
branch's (`volumes/`) and master's (`volumes-master/`). Master's carry later
corrections (the spine's alignment erratum; the compiled fold's §12 Edit Mode
and §13 Seam family; small line refreshes in ES, IN, TR, GR, WC). THE BASE IS
MASTER where a master copy exists; the ledger branch receives the same
amended text (the two copies are one truth after this fold). CN, MF, PG and
EC exist only on the ledger branch and are amended there (LG is on master too, S4 m3).

---

<!-- END Part 0 -->

## Part 8 — §8 WHAT WAS AMENDED WHERE

<!-- BEGIN Part 8: old lines 1384–1447 of the text of record, verbatim -->
## §8 WHAT WAS AMENDED WHERE — every volume, in place, by eight lanes (2026-10-16, 16:5x–18:5x EDT; one session-limit death at ~17:06 and a resume at 18:28, hazard 93)

**Method.** Each lane copied the MASTER copy (the kit's `volumes-master/`; the ledger `volumes/` copy for CN/LG/PG/MF; the ledger file itself for EC) over the ledger `docs/` destination and then applied every refinement of its findings files, every §3 row naming its lines, the §5 register at first use, the status-header bracket, and a FIRST-VISIBLE · TIER · DEGRADED ARM line on every wave charter — by scripted exact-anchor insertion, each anchor asserted once in the base, with an executed INSERTIONS-ONLY proof (remove every inserted chunk → the base byte for byte). No law, ruling, owner quotation, sha or test name was altered. The lanes' worklogs, scripts and applied-maps are in the kit's `amend/`; the items the lanes raised for a ruling, and the chair's ruling on each, are in `amend/LANE-RAISED.md` (A1–A3, B1–B6, C1–C2, D1–D3, E1–E5, F-WY1–2, F-HB1–7, F-EP1–4, G1–G2, H1–H8) — those rulings are applied in the volumes as further brackets where they bear.

**The owner-row brackets.** After the owner's 18:4x word (§7), every `[OWNER ROW OD-FC-n — …]` head in every volume was rewritten by one scripted pass to `[RULED BY DELEGATION 2026-10-16 (OD-FC-n — …]` (92 in the first fourteen files, 60 more across the rest; residual zero).

**The proof of harmlessness.** Master carries tests that READ these volumes (`tests/lint/infoConvergenceContract.walker.test.js` parses INFORMATION; `tradeConvergenceContract` PIN-6 parses TRADE §3; `tests/docs/*` and the `tests/lint` walkers scan `docs/**`; `ledger-citations`, `enforcement-claims`, the tuning register). The amended set was copied into a detached master worktree at `00b648c9d` and the doc-scanning set run twice: dry run one (the first fourteen files): 40 files, 1,629 tests, green; dry run two (every file, `tests/docs` + `tests/lint` whole + the doc-reading domain and copy tests): **241 files, 4,522 tests, exit 0** (CONFIRMED; the log is the kit's `amend/docs-dryrun-2.log`). dry run three (after requirement 24's fourteen insertions): **238 files, 4,485 tests, exit 0** (`amend/docs-dryrun-3.log`). dry run four (after every skeptic cure, the final text): **238 files, 4,485 tests, exit 0** (`amend/docs-dryrun-4.log`); the scratch worktree was reset afterwards (S4 m6). None of the four is the authoritative gate; the gate runs when the volumes reach master in a docs commit.

| Volume | Lines after | Dated brackets | Delegated-ruling brackets | FIRST-VISIBLE lines | Lane |
|---|---|---|---|---|---|
| DESIGN_FP_SPINE | 1,173 | 15 (+ requirements 15–23 verbatim) | 7 | — (specs, not waves) | A |
| DESIGN_FP_COUPLINGS | 1,960 | 30 | 4 | 4 | A |
| DESIGN_FP_ARCH_SP | 958 | 29 | 6 | 6 | A |
| DESIGN_FP_ARCH_CW | 629 | 19 | 1 | 4 | A |
| DESIGN_FP_GRAMMAR | 1,611 | 41 | 4 | 8 | B |
| DESIGN_FP_ARCH_GR | 712 | 28 | 2 | 8 | B |
| DESIGN_FP_FAITH | 1,705 | 44 | 7 | 10 | B |
| DESIGN_FP_ARCH_WF | 857 | 27 | 4 | 10 | B |
| DESIGN_FP_INFORMATION | 1,535 | 62 | 3 | 12 | C |
| DESIGN_FP_ARCH_IN | 732 | 34 | 2 | 12 | C |
| DESIGN_FP_ARCH_ES | 2,126 | 29 | 6 | 10 | C |
| DESIGN_FP_TRADE | 1,472 | 36 | 7 | 10 | D |
| DESIGN_FP_ARCH_TR | 627 | 44 | 7 | 9 | D |
| DESIGN_FP_ARCH_EC | 2,995 | 88 | 12 | 19 | D |
| DESIGN_FP_POPULATIONS | 1,405 | 70 | 10 | 8 | E |
| DESIGN_FP_ARCH_POP | 616 | 48 | 4 | 8 | E |
| DESIGN_FP_INTERIOR | 1,765 | 77 | 5 | 9 | E |
| DESIGN_FP_ARCH_INT | 749 | 37 | 2 | 9 | E |
| DESIGN_FP_ARCH_WY | 1,736 | 43 | 10 | 12 | F |
| DESIGN_FP_ARCH_HB | 4,517 | 98 | 4 | 11 | F |
| DESIGN_FP_ARCH_EP | 4,127 | 28 | 11 | 6 | F |
| DESIGN_FP_ARCH_WC | 7,053 | 145 | 14 | 18 | G |
| DESIGN_FP_ARCHITECTURE | 3,323 | 69 | 1 | 5 (SEAM-0..3 + inventory) | H |
| DESIGN_FP_ARCH_CN | 504 | 17 | 2 | 6 | H |
| DESIGN_FP_ARCH_LG | 208 | 16 | 1 | 11 | H |
| DESIGN_FP_ARCH_PG | 431 | 12 | 1 | 5 | H |
| DESIGN_FP_ARCH_MF | 486 | 12 | 1 | 7 | H |
| **total (after the skeptic cures; the per-file rows above are the lanes' counts at 18:5x)** | **46,806** | **1,243** | **172** | **268** | |

**Deliberately NOT done, recorded here (the never-deferred law):** (a) the compiled fold's §5 charters are declared the INVENTORY but not cut (§3.2.21) — the cut rides the next re-compile; (b) HB's §9 count census is not moved to a sidecar (HB refinement 25) — a move deletes text, the next re-compile carries it; (c) TRADE §3 Seam One's stale "those terms DO NOT EXIST", its flag table and its dependency ruling are unbracketed because master's PIN-6 and the trade walker parse those passages exactly once (lane D) — the doc-parsing pins are the hazard §9 names; (d) the ledger copies of ODQ §934.84 (the LIT-2 promise, §3.2.20) are amended by this program's ODQ entry, not in place; (e) three findings refinements targeting `FP-ORDER.md` / `FP-QUEUE.md` (the FP kit) are recorded in §9's register, not written — the kit is the chair's, and this program lands on the ledger only.

**2026-10-17 (fp-final) — THE FP FINAL ARCHITECTURE PROGRAM's amendments** [ADDED 2026-10-17 (fp-final; L-FOLD)] (chair session a73343ed, Fable 5.1; kit `settlement-engine-kits/fp-final-a73343ed-2026-10-17/`; the owner's words of 2026-10-17, verbatim: "I defer all judgement and decisions to you and give you permissions needed now and those that will be emergent in the future" · "also mark and make appropriate adjustments in areas you see for refinement"). What was amended where:
- `DESIGN_FP_ARCH_PL.md` (THE POLITY, a DRAFT) — REWRITTEN IN PLACE by lane L-PL (Opus 5.5) under `briefs/RULINGS-PL-MN.md` §A and `briefs/RULINGS-AFTER-RESEARCH.md` §6: every SPL/SX id disposed in its §16 (46 cured; 2 STOPs, ruled in `briefs/RULINGS-AFTER-COMPILE.md`); §14 CONVERSION and §15 CONTROL compiled from research R4; `[CURED 2026-10-17 (fp-final) — …]` and `[REFINED …]` brackets mark every change. Log `cure/L-PL.md`.
- `DESIGN_FP_ARCH_MN.md` (THE MENACE, a DRAFT) — REWRITTEN IN PLACE by lane L-MN (Opus 5.5) under `briefs/RULINGS-PL-MN.md` §B: 51 of 51 ids disposed in its §14, 0 STOPs. Log `cure/L-MN.md`.
- `DESIGN_FP_ARCH_RN.md` (THE RENOWN) — NEW, compiled by lane L-RN from research R1–R3 under `briefs/RULINGS-AFTER-RESEARCH.md`; four STOPs, ruled. Log `cure/L-RN.md`.
- `DESIGN_FP_ARCH_CH.md` (THE CHAMPIONS) — NEW, compiled by lane L-CH from research R1 and R3; one STOP, ruled (A). Log `cure/L-CH.md`.
- `DESIGN_FP_ARCH_PT.md` (THE PARTY) — NEW, compiled by lane L-PT from research R2 and R3, after RN; two STOPs, accepted with slots. Log `cure/L-PT.md`.
- THIS FOLD — by lane L-FOLD, insertions only, every bracket dated and sourced: §1 requirements 16, 19, 21(a) and 24, and a requirement-12 pointer; §2 two restated rows (PL, MN) and three new (RN, CH, PT); §3.1 bracket rows on 3.1.1 and 3.1.10, rows 3.1.22–3.1.23 and the INBOX; §3.3 rows 3.3.12–3.3.13; §3.4 the PL and MN renames as bracket rows, three PL rows, nine CH rows, fourteen PT rows and the count; §5 six bracket rows and the program's token rows; §6 the intro bracket, C0.5, the C8/C9/C10 brackets, C11–C13, the slot-row bracket and THE ORDER NOTE; §7 the header bracket, the OD-FC-19/45/46 brackets and rows OD-FC-47..61; this block; the §9.6 placeholder.
- `DESIGN_FP_SPINE.md` §1 — requirement 12 (THE PUSH BUDGET), 21(a) (the carriers) and 24 (the widening; the registry count) brackets, insertions only.
- `DESIGN_FP_ARCH_CN.md` — the cn-5 bracket and its flag row's bracket (SX-10: Produces 1–2, `externalBesiegersEnabled` and the `disposition` bucket superseded by MN-0/MN-2).
- The research findings (`findings/R1..R4.md`), the chair's rulings (`briefs/RULINGS-PL-MN.md`, `briefs/RULINGS-AFTER-RESEARCH.md`, `briefs/RULINGS-AFTER-COMPILE.md`, `briefs/CHAIR-NOTES-FOR-THE-FOLD.md`), the lanes' cure logs and probes are in the kit. The lanes: P1 R1–R4 (Opus); P2 L-PL and L-MN (cures), L-RN, L-CH, L-PT (compiles); P3 the adversarial loop per volume and across the seams (running when this block was written); P4 L-FOLD (this) and the chair's ODQ §934.93, HANDOFF line and one ledger commit by explicit pathspec — NOTHING PUSHED (the owner's).
- The insertions-only proof for the three chair-owned files is `git diff --numstat` with zero deletions for each, recorded in `cure/L-FOLD.md`.
- THIS FOLD, ROUND 1 (lane D-FOLD-r1, Opus 5.5, 2026-10-18): insertions only, every bracket dated `2026-10-18 (fp-final r1)` and sourced — the thirty-three FOLD-routed findings of `skeptic/SEAMS-r1.md` and `skeptic/HOST-r1.md` disposed (§9.6's round-1 block); the spine's requirement-17 and requirement-24 brackets; CN's cn-5 pointer bracket; the anchored script, its insertions-only proof and the log in `cure/D-FOLD-r1-probe/` and `cure/D-FOLD-r1.md`.
- THIS FOLD, ROUND 2 (lane D-FOLD-r2, Opus 5.5, 2026-10-18): insertions only, every bracket dated `2026-10-18 (fp-final r2)` and sourced — the round-1 verifier's five FAILS re-cured and its two NEW findings and four minor notes disposed (`skeptic/FOLD-r1-verify.md`; §9.6's round-2 block); every item `briefs/RULINGS-ROUND2.md` routes to the fold (A.5, A.6, A.11, A.12, A.13; C Q2; D STOP-ST-1, STOP-ST-2, Q1, Q2 and Q4; the A.7 token row) and its §E standing items (one sites-considered row, one patrols-considered row, the H16 door, the plague-R7 slot, the owner's 10-18 doctrines — `briefs/CHAIR-NOTES-FOR-THE-FOLD.md` items 8, 10, 11, 12 and 15 are APPLIED here, so P4 does not repeat them); the spine's requirement 1, 4 and 24 brackets; CN untouched (it has no row in THE SITES' coverage table and THE PATROLS touch none of it); the anchored script, its insertions-only proof and the log in `cure/D-FOLD-r2-probe/` and `cure/D-FOLD-r2.md`.
- THIS FOLD, ROUND 2b (lane D-FOLD-r2b, Opus 5.5, 2026-10-18) [ADDED 2026-10-18 (fp-final r3; `skeptic/FOLD-r2-verify.md` minor note — §8 carried no round-2b line)]: insertions only, every bracket dated `2026-10-18 (fp-final r2b)` and sourced — the twenty-five FOLD-routed findings of `skeptic/SEAMS-r2.md` and `skeptic/HOST-r2.md` and thirteen routed items disposed (§9.6's round-2b block; log `cure/D-FOLD-r2b.md`); the fold +78 lines, the spine and CN unchanged.
- THIS FOLD, ROUND 3a (lane D-FOLD-r3, Opus 5.5, 2026-10-18): insertions only, every bracket dated `2026-10-18 (fp-final r3)` and sourced — the round-2b verifier's one FAIL re-cured and its two NEW MAJORs and minor notes disposed, the fold's halves of `briefs/RULINGS-ROUND3.md` A, §D.1 and §E applied, and the FOLD routes of the round-3a lanes written (§9.6's round-3 block; log `cure/D-FOLD-r3.md`, with the numstat proof); the spine takes the requirement-24 and SP-4 brackets (A.7, A.11); CN takes none.
- THIS FOLD, ROUND 4a (lane D-FOLD-r4, Opus 5.5, 2026-10-18): insertions only, every bracket dated `2026-10-18 (fp-final r4)` and sourced — the round-3b verifier's one FAIL (A.4's fold half) re-cured under A.8 and its eight minor notes disposed; SEAMS-r3's three fold routes; the FOLD B-row of `briefs/RULINGS-ROUND4.md` (A.3's register, A.12's six kinds, A.13's withdrawal, §F THE BANNER, `peace_unkept`, the ransom race's words and the clocked card, THE BODIES' kinds with their WHERE, CHAIR-NOTES item 17); THE BODIES' fold route; and the FOLD routes of the round-4a lanes that had landed (§9.6's round-4a block; log `cure/D-FOLD-r4.md`, with the numstat proof). The spine takes the requirement-24 and SP-4 brackets (A.12; the clocked card); CN takes two (the census-row homonym C17; the bandit-class host and THE BODIES).
- THIS FOLD, ROUND 5a (lane D-FOLD-r5, Opus 5.5, 2026-10-19): insertions only, every bracket dated `2026-10-19 (fp-final r5)` and sourced — the round-4b verifier's six FAILS (SEAMS-r3-5's fold half; `peace_unkept` in the REQUESTED family; three of THE BODIES' halves — OD-BD-34's visible reading, THE FIRST SOAK's bodies row, four tokens; OD-RN-48 RULED after the lane) and its two new MAJORs (the clocked card's close, B.6; the ransom race's partition, B.7) cured with its nine minor notes; SEAMS-r4's two fold routes (the junction key; the birth door by delegation); THE BODIES' first skeptic's fold halves (ONE ROAD LADDER on master's `hidden` grade, B.4; one term per gang; the raid ref's `bodyKind`); the FOLD rows of `briefs/RULINGS-ROUND5.md` §B (B.4 · B.6 · B.7 · B.22); the round-4a lanes' fold routes re-checked (§9.6's round-5a block; log `cure/D-FOLD-r5.md`, with the numstat proof). The spine takes the requirement-24 r5 bracket (B.6, B.7); CN takes one (the census rows C14–C16 as homonyms).
- THIS FOLD, P4 (lane L-FOLD2, Opus 5.5, 2026-10-19): insertions only, every bracket dated `2026-10-19 (fp-final P4; L-FOLD2; …)` and sourced — the remainder of `briefs/L-FOLD2.md` items 1–11 and its two addenda after the round lanes had placed most of them: §1 the reach counted first and the ransom race's close; §2 four rows (THE PASSAGE · THE SITES · THE PATROLS · THE GENERALS) and the ten slices' review status; §3.1 3.1.18 ↳ and INBOX ↳ P4; §3.3 3.3.13 · 3.3.15 · 3.3.16 ↳ (THE TABLE OF OWNED UNITS) and rows 3.3.17–3.3.18; §3.4 eleven kind rows (PS 4 · ST 5 · PR 2), seven ↳ rows, the recount (NINETY kind names in EIGHTY-FIVE live rows) and the WHERE ↳; §5 the three round-2 volumes' tokens and the round-5/6 tokens; §6 C4 · C8 · C17 ↳, C14 · C15 · C16, THE ORDER NOTE restated, THE INSTRUMENTS BEFORE C0, two map-prerequisite ↳ rows; §7 eight ↳ rows and OD-FC-76..85; this line and the block below; §9.6's program record. The spine's requirement-24 P4 mirror; CN unchanged; `docs/DESIGN_FP_GENERALS.md` ADDED (a copy of the kit's `refs/DESIGN_FP_GENERALS.md`, branch `fp/design-generals-2026-10-02`, under one dated header bracket). Log `cure/L-FOLD2.md`; the insertions-only proof is its numstat against `a399c5956`.
- **2026-10-18/19 (fp-final) — THE PROGRAM'S AMENDMENT RECORD, CONTINUED** [ADDED 2026-10-19 (fp-final P4; L-FOLD2; `briefs/L-FOLD2.md` item 10)] (chairs a73343ed and 0a2e8bd9, Fable 5.1; the kit `settlement-engine-kits/fp-final-a73343ed-2026-10-17/`; seats on Opus 5.5, the seams seats on Fable where the kit's BOARD says so): NINE PROGRAM VOLUMES — the five of 2026-10-17 (`DESIGN_FP_ARCH_PL.md` · `MN.md` · `RN.md` · `CH.md` · `PT.md`) and FOUR compiled on the owner's words of 2026-10-18 (`DESIGN_FP_ARCH_PS.md` THE PASSAGE, lane L-PS; `DESIGN_FP_ARCH_ST.md` THE SITES, L-ST; `DESIGN_FP_ARCH_PR.md` THE PATROLS, L-PR in round 2a; `DESIGN_FP_ARCH_BD.md` THE BODIES, L-BD beside round 3b) — with THIS FOLD the tenth review slice; `docs/DESIGN_FP_GENERALS.md` copied onto the ledger at P4 (a DESIGN volume of 2026-10-02, not reviewed in this program). THE ROUNDS: P3 ran six (1 · 2a/2b · 3a/3b · 4a/4b · 5a/5b · 6a) — skeptics, disposition lanes (`cure/D-<V>-r<n>.md`), refuting verifiers (`skeptic/<V>-r<n>-verify.md`), a seams skeptic each round, the map builder's host requirements read in rounds 1–2 (`skeptic/HOST-r1.md`, `HOST-r2.md`), THE BODIES' two skeptics (`skeptic/BD-r4.md`, `BD-r5.md`) — under the chair's rulings `briefs/RULINGS-ROUND1.md` … `RULINGS-ROUND6.md`; the independent assessment panel (`assessments/`, four lenses and a synthesis); §9.6 holds the counts. THE QUEUE: `briefs/NEXT-PROGRAM-INBOX.md` (opened 2026-10-19 ~03:3x by the chair; ten rows; the program's scope FROZEN from CHAIR-NOTES 18; nothing in it designed here) is the next program's queue, in the owner's order when he gives one. NOTHING PUSHED; the gate list (push · merge · deploy · migration · dispatch) is unchanged; the dispatch gate is the UI + prose release, pushed and deployed.
- **2026-10-20 (fp-final P5 · P6 · P7) — THE NEXT PROGRAM'S AMENDMENT RECORD** [ADDED 2026-10-20 (fp-final P7; L-FOLD3; `briefs/L-FOLD3.md`)] (chair 6eb7b5b6, Fable 5.1, the program of chairs a73343ed and 0a2e8bd9; the kit `settlement-engine-kits/fp-final-a73343ed-2026-10-17/`, its README's RESUME BLOCK 3; every owner word of 2026-10-20 verbatim on its BOARD and in `cure/OWNER-WORDS-2026-10-20.md`): P5 THE COMPLETENESS CRITIC with THE WIRING CENSUS (P5a–P5d; this fold's P5 lane D-FOLD-p5, +70/−0 and §9.6's P5 record; P5 CLOSED on substance); P6 THE NEXT PROGRAM — FOUR NEW VOLUMES compiled on the owner's 2026-10-20 words, DARK and NOT SCHEDULED: `DESIGN_FP_ARCH_OP.md` THE OPPORTUNITY · `DESIGN_FP_ARCH_MG.md` THE MOVEMENT GRAMMAR · `DESIGN_FP_ARCH_WS.md` THE WAY OF WAR · `DESIGN_FP_ARCH_FS.md` THE FISCAL SEAT; THE PATRON DEITY amended into `DESIGN_FP_ARCH_CH.md` in place (CH-11); three review rounds and the r4 consolidation on the four, CH-PD-r1 and its disposition, SEAMS-P6 on Fable; P6c the brackets lanes — A (WC · WY · ES · IN · GR · GENERALS · POP · W-SEAT · INT · LG · SP; EP none placed), A2 (PS · PR · MN · RN · BD · HB · ST · PT), B (CH · RN · OP), C (PS · MG · OP · BD · WC · WS · CH) and D (RN · PT · CH · OP · PS) — insertions-only in every landed volume (V-BRACKETS-p6c CONFIRMED for 23 files); P7 THIS FOLD, THE SPINE AND CN by lane L-FOLD3 (Opus 5.5), insertions-only, every bracket dated `2026-10-20 (fp-final P7; L-FOLD3; …)` and sourced: §1 (CHAIR-NOTES 20 beside the 10-18 doctrines; requirement 24 and the next program), §2 (four rows + CH ↳ THE PATRON DEITY), §3.1 (3.1.23 ↳ P7 the car's eighth claimant; 3.1.24 ↳ P7; the INBOX ↳ P7 block, the eleven unplaced texts carried verbatim), §3.3 (3.3.19–3.3.28), §3.4 (`rescue_attempt`, `tax_refusal`, three ↳ rows, the recount to NINETY-TWO kind names in EIGHTY-SEVEN live rows, the WHERE ↳ P7), §5 (THE REGISTER PASS: seventy rows copied by script from the four volumes' token registers, CH's P6 row, the lanes' rows, three ↳ rows), §6 (C4 ↳, C12 ↳ CH-11, C18–C21, THE ORDER NOTE ↳ P7), §7 (OD-FC-86..124), §9.7 below; `DESIGN_FP_SPINE.md` §1 (requirements 1, 10, 17 and 24); `DESIGN_FP_ARCH_CN.md` §1 (four ↳ rows, the new cross-program reads). The numstat proof is in `cure/L-FOLD3.md`; the ODQ §934.93 P5 addendum, §934.94 and the HANDOFF line are the chair's, from this lane's drafts in `cure/`.

---

<!-- END Part 8 -->

## Part 9 — §9 THE ADVERSARIAL REVIEW

<!-- BEGIN Part 9: old lines 1448–1820 of the text of record, verbatim -->
## §9 THE ADVERSARIAL REVIEW — five skeptic seats over the fold and every amended volume (2026-10-16, 19:0x–19:3x EDT); every finding disposed under the owner's "whatever is emergent" word (§7)

**Method.** Five Opus seats, each with `SKEPTIC-BRIEF.md` (the attack surfaces in order: a ruling against a landed law or owner word; a ruling that cannot be built at `00b648c9d`; a bracket that alters a law; a false bracket; a wrong §2 cell; internal contradiction; a mis-gated decision; a dropped reader finding; vacuity). Reports: the kit's `skeptic/S1.md` (fold §1–§3.1/§3.3 + SP/CW/GR/WF), `S2.md` (§3.2/§4/§5/§6 + IN/ES/TR/EC), `S3.md` (OD-FC-1..34 + POP/INT/WY/HB/EP), `S4.md` (OD-FC-35..40, the REINFORCE addendum + WC/ARCH/CN/LG/PG/MF), `S5.md` (requirement 24 and the engagement registry). **Totals: 12 BLOCKING · 55 MAJOR · 52 MINOR before S5.** Every amended volume passed every seat's insertion-only check; about 160 bracket addresses were re-read and all but seven held (the seven are cured below). The defects were in the RULINGS, not the amendments — which is what the review was for.

**Dispositions.** CURED = the fold and the volumes now carry the correction (where: §n or the volume's bracket). ACCEPTED-NOTE = true, recorded, no text change needed beyond the note. REJECTED = the finding is wrong, with the reason.

### 9.1 Slice 1 (S1-01..19)
| id | sev | disposition |
|---|---|---|
| S1-01 the pending ledger duplicates the landed majors docket (`decisionTier.js`, `advanceInterval.js:601`, J-D7) | BLOCKING | CURED — requirement 24(b)/(c) and §3.4 rule 5 re-ruled: SP-9 BUILDS ON the docket and the cursor; the registry generalises the majors; "months go by automatically" retires the default pause at majors for non-week units (a declared shift signed by the owner's word) |
| S1-02 the tithe is the church's, not the crown's tax form | BLOCKING | CURED — §3.1.5 re-ruled: one flow, two ends (WF-7's piety × presence is the source; `tithe_share` is the crown's cut); FAITH/ARCH_WF/COUPLINGS/SPINE re-bracketed |
| S1-03 eleven bracket bodies still say "until the owner rules" | MAJOR | CURED in part — the three quoted phrases carry a "NOW RULED" note corpus-wide; the §7 header says a body's old conditional reads as the §7 ruling; a full body rewrite rides the next re-compile |
| S1-04 lane-raised rulings B2/B3/B5/A2/H5/H7/H8 not in the fold | MAJOR | CURED — §2 GR cell, §6 C2/C5, OD-FC-38, this §9; §9 exists |
| S1-05 "one lit chain in the default" overstated | MAJOR | CURED — §2's sentence restated per preset from the executed census |
| S1-06 CW-1 FIRST-VISIBLE "seasonal" is wrong (the braid forms at composition) | MAJOR | CURED — ARCH_CW and COUPLINGS brackets corrected: IMMEDIATE |
| S1-07 §3.1.6 names a non-existent caller | MAJOR | CURED — the only caller is `traditionsKernel.js:860`; WC/WY faith exposure marked unbuilt |
| S1-08 requirement 17 treats the demo cap as the tier law | MAJOR | CURED — the simulator is premium (the owner); the cap is temporary with its launch switch |
| S1-09 §3.1.1's producer keyed on the need contradicts §3.2.12 | MAJOR | CURED — the need is a gate; the rung keys on the counterpart's believed rung |
| S1-10 LG-0 "waits on nothing" breaches the release gate | MAJOR | CURED — first unit of LG's slot after the release, lit at landing |
| S1-11 "1–23" | MINOR | CURED — 1–24 (fold, SPINE) |
| S1-12 "~19:0x" stamp | MINOR | CURED — 18:5x, the file's write stamp |
| S1-13 (g) vs (c) | MINOR | CURED — at a month-or-longer advance the receipt is the sign |
| S1-14 OD-FC-14 re-decides CR-FP-10 | MINOR | CURED — row closed, CR-FP-10 cited |
| S1-15 "nothing imports either" | MINOR | CURED |
| S1-16 the re-anchor's touched files | MINOR | CURED — listed |
| S1-17 GRAMMAR address :376-378 | MINOR | ACCEPTED-NOTE — the string is not in the amended GRAMMAR (the reader's figure; nothing to change) |
| S1-18 req 21(a) one layer vs WY/EP | MINOR | CURED — a declared multi-layer carrier is lawful |
| S1-19 COUPLINGS:1112 POP-5b | MINOR | CURED (S3 cure) |

### 9.2 Slice 2 (S2-01..16, seats A/B/C)
| id | sev | disposition |
|---|---|---|
| S2-01 the `held` partition cannot sit on an integer leaf; no `stock` kind; OD-EC-9 enumerated three sub-keys | BLOCKING | CURED — OD-FC-11 rebuilt: a sibling `heldStocks` map, a fifth TR-2 verb `hold`, a `good` field the normalizer keeps; recorded as AMENDING OD-EC-9 by one sub-key under the delegation; not buildable until EC-13's unit; outside the first soak |
| S2-02 "the code matches" SP-3 is false — the proposer reads the responder's truth (K3 breach) | BLOCKING | CURED — OD-FC-5 REVERSED: SP-3 stands; a repair car (`reciprocal` reads belief) heads C1's GR work; a signed lit shift |
| S2-03 / S4-B4 the envoy keys need all six + errandSpine; living_realm cannot | BLOCKING | CURED — OD-FC-39 rebuilt: one lighting unit at C1's head, six keys + errandSpine + espionage + the statecraft head, dramatic + full only, `npcConsequencesEnabled` slotted, FP-20/43 cited |
| S2-04 EC-8 is dark in the first soak, so "paid early, gained the smithy" cannot fire; M59 says "rewarded" | MAJOR | CURED — §3.2.11; EC's M59 bracket: the crown arm is the foil only in the soak |
| S2-05 `foldDemographicMotive` runs only with demographics lit | MAJOR | CURED — the need enters `ownPressure`; EC bracket |
| S2-06 EC:823 feeds the condition into the operand §3.2.12 forbids | MAJOR | CURED — EC-1's fork gated on EC-17; one rule at both sites |
| S2-07 K3 grants no self-read exception | MAJOR | CURED — E14 (addenda 4/5) is the authority; negotiation paths fenced out |
| S2-08 an EC bracket keeps the overture arm against R5 | MAJOR | CURED — struck by bracket |
| S2-09 ~20 waves and four parked units have no chain or slot | MAJOR | CURED — §6's slot row names every one |
| S2-10 chain numbers clash with FP-ORDER | MAJOR | CURED — C0..C8 registered in §5 |
| S2-11 U123 has no owner in C1 | MAJOR | CURED — named as the Edit Mode program's car |
| S2-12 registry verdict words rename landed tokens | MAJOR | CURED — the landed tokens (`signed · refused · expired`; `disavowed_by_succession`) |
| S2-13 EC carries no OD-FC-35/37 brackets; no army-endpoint producer | MAJOR | CURED — EC bracketed; the producer is WY-8a's F9 (OD-FC-35 rebuilt) |
| S2-14 EC-17 "none inside a month" against requirement 16 | MAJOR | CURED — the dear-crossing planting line |
| S2-15 the factor parlay has no engagement kind | MAJOR | CURED — `factor_parlay` registered |
| S2-16 `route_wardenship`/`provision` are landed reason kinds | MAJOR | CURED — §5 row: the term is the producer of the reason of the same name |
| A4–A9 (3.2.22 routing, 3.2.3's war-owned reader + lit shift, the "until ruled" residue, no ODQ entry) | MAJOR | CURED — notes on §3.2.22/§3.2.3; the residue note; the ODQ entry is §934.91 (landed with this fold) |
| B-F1..F4 four wrong INFO/ARCH_IN FIRST-VISIBLE lines | MAJOR | CURED — one correction bracket per file naming all four |
| C-F1 TRADE "those terms DO NOT EXIST" unbracketed on a false pin rationale | MAJOR | CURED — bracketed (the walker and PIN-6 do not parse the phrase, replayed) |
| minors ×28 (addresses, shas, `watched`/`rooted` collisions, the HIDE mapping, "seven chains", EC-11/TR-6, OD-FC-15 "every preset") | MINOR | CURED where a text exists (`watched` → "the marked block"; the HIDE mapping one; nine chains; EC-11/TR-6); the address list is ACCEPTED-NOTE (seat receipts in the kit's `scratchpad/s2` notes copied to `skeptic/`), cured at the next re-compile |

### 9.3 Slice 3 (B1–B2, M1–M15, m1–m6)
| id | sev | disposition |
|---|---|---|
| B1 the pending epoch's home is the pause signal | BLOCKING | CURED — OD-FC-31 rebuilt: homed in the EP ledger's `pending {forTick, epoch}`; all three J-EP-12 grounds answered; lifecycle paths named; EP bracket |
| B2 "defer past launch" against ODQ §764 | BLOCKING | CURED — THE AGES is pre-launch chain C8 |
| M1 FMG's default unit is miles | MAJOR | CURED — OD-FC-22 rebuilt: the exported `distanceScale` + `distanceUnit`; the constant is the fallback, unit km, on the FP-46 roster; ARCH re-bracketed |
| M2 ARCH:688 / FP-10 not amended | MAJOR | CURED (ARCH); FP-10 is the kit's — pointer recorded |
| M3 the levy damper has no rate band | MAJOR | CURED — the levy arm is instrumentation until a levy act exists; POPULATIONS bracket |
| M4 E1–E4 never reached the volumes; no §8/§9 | MAJOR | CURED — brackets in POPULATIONS/INTERIOR; §8/§9 written |
| M5 delegated tuning not on the FP-46 roster | MAJOR | CURED — OD-FC-28 roster extended |
| M6 same-seed list incomplete | MAJOR | CURED — 5, 13, 22, 33 added |
| M7 OD-FC-33 must rule both slices and the pause path | MAJOR | CURED |
| M8 `commodityStocks` has no record for a partition | MAJOR | CURED — the sibling map |
| M9 Q-HB-B and Q-HB-E dropped | MAJOR | CURED — OD-FC-42/43 |
| M10 "E2 DEFER" without a slot; the copy is owner-signed | MAJOR | CURED — E2 in EP-6; the copy stays owner-signed |
| M11 seven chains written ahead against FP-40 | MAJOR | CURED — §6 is the inventory; only the next chain is fixed |
| M12 lightings scoped to belief presets leave the default dark | MAJOR | CURED — OD-FC-3/16/26 scoped by TIER line to every world-alive preset |
| M13 POP's persisted shapes dropped | MAJOR | CURED — OD-FC-44 |
| M14 OD-FC-13's slots contradict §3.2.16 and ODQ §130.3 | MAJOR | CURED — POP-1's identity; POP's row, WY reads |
| M15 OD-FC-18 names no mount site; "now" | MAJOR | CURED — at world birth; C3's first unit after the release |
| m1 `believedDoctrineEnabled` unlanded yet kept | MINOR | CURED — §5's rule amended (three-volume cross-reference keeps a name) |
| m2 ARCH_HB:1127 vs :3349 | MINOR | CURED — qualified |
| m3 ARCH_POP:146 bracket states no ruling | MINOR | CURED |
| m4 OD-FC-25 parks INT-3b without a slot | MINOR | CURED — C4 |
| m5 a FIRST-VISIBLE failure has no consequence | MINOR | CURED — requirement 16: the wave does not light |
| m6 OD-FC-13 "confirm" the owner's own directive | MINOR | CURED — binds without re-asking |

### 9.4 Slice 4 (B1–B5, M1–M8, m1–m9)
| id | sev | disposition |
|---|---|---|
| B1 dropping cn-4's stressor pin breaches ODQ §128 | BLOCKING | CURED — §3.1.20 re-ruled: the stressor-scope pin is KEPT as an Edit Mode seal gating roll and backstop; seal 6 is its siege instance; CN re-bracketed |
| B2 the WC-1 executor has nothing to drive it and breaches L-WC-19 | BLOCKING | CURED — §3.2.18 re-ruled: WC-6's normalizer car → WC-4 + WC-1 alongside; the muster writes `blocks[]` only; WC bracket |
| B3 OD-FC-20's gate binds at the first writer; HB Q1 signed but CR-WC-9 parked | BLOCKING | CURED — OD-FC-20 REVERSED: SIGNED by delegation, binding at WC-1, the table signed at C2's dispatch; WC header re-bracketed |
| B4 (= S2-03) | BLOCKING | CURED above |
| B5 CUT-TO-SENTENCE narrows owner clauses | BLOCKING | CURED — every cut withdrawn (§3.1.15, §6); WC's brackets carry the withdrawal; charters kept whole, slot THE HOST |
| M1/M2 the REINFORCE binding mis-sited and the own-army flow mis-routed | MAJOR | CURED — the §5 addendum re-ruled: bind at WC-6, re-target the dial, real-only, directed dispatch, W-CONVERGENCE named; `reinforcement.js` outside the seam |
| M3 no army-endpoint consignment; WY-8a dropped | MAJOR | CURED — OD-FC-35 rebuilt on F9 |
| M4 OD-FC-37 silently amends §934.85 | MAJOR | CURED — recorded as amending it; the two drivers homed |
| M5 Q6 was ratified deferred by the 08-05 grant | MAJOR | CURED — OD-FC-40 converts the ratified deferral |
| M6 CN OQ-1 two readings | MAJOR | CURED — one reading in CN |
| M7 H5–H7 not applied / contradicted | MAJOR | CURED — ARCH and CN brackets; CR-FP-8 its own car |
| M8 WC-4's stores road without WC-3 | MAJOR | CURED — dark until F9 exists |
| m1 doubled bracket heads; WC:62 paren | MINOR | CURED — scripted |
| m2 ARCH line cites shifted by the amendments | MINOR | ACCEPTED-NOTE — every `ARCH:nnnn` cite in this fold is a MASTER-base line; readers navigate by symbol |
| m3 LG is on master | MINOR | CURED — §0 |
| m4 the skeptic brief's WC base label | MINOR | ACCEPTED-NOTE — lane G used master; the brief mislabelled the backup |
| m5 `spatialUsage.js:184` exists | MINOR | ACCEPTED-NOTE — lane G's remark corrected in LANE-RAISED |
| m6 the scratch checkout is dirty with the dry runs' docs | MINOR | CURED at the end of the program (reset after the final dry run) |
| m7 no ODQ entry yet | MINOR | CURED — §934.91 lands with this fold |
| m8 the `resupply` seal exists | MINOR | CURED — the addendum names it as distinct |
| m9 §3.1.7 overclaims; `columnOf` is not a whitelist | MINOR | CURED |

### 9.5 Slice 5 (requirement 24, the engagement registry: 4 BLOCKING · 11 MAJOR · 5 MINOR)
| id | sev | disposition |
|---|---|---|
| B1 the paused-advance cursor cannot host a hearing (it re-runs the parked tick and refuses advances and edits) | BLOCKING | CURED — (b) rebuilt: no cursor; the tick completes, the docket is read FIRST at the next advance |
| B2 the siege pin road cannot carry a per-engagement verdict (no engagement key; the fork's vocabulary; the pinnable-fork list in the frozen kernel; checked after the terminal arms) | BLOCKING | CURED — the HEARING SEAL is its own seal kind keyed by engagement id, read first in the resolver's own module; the kernel untouched; the stressor pin is a distinct object that stands |
| B3 forcing auto-resolve for longer advances re-decided directive 7 | BLOCKING | CURED — (c) rebuilt: the owner's word governs hearings only; the majors pause and its DM switch are untouched |
| B4 the "closed" registry missed about a dozen live acts; NPC-to-NPC had no actor | BLOCKING | CURED — twelve kinds added; (a) names NPC actors; the registry is seeded from the live-act census and closes only to UNREGISTERED resolution once lit |
| M `armies_meet` vocabulary unbuilt, climax undefined, no hold, kernel at ceiling | MAJOR | CURED — STANDING-at-contact on the forecast-overlap read, both armies hold, built as a leaf |
| M `spy_at_target` collides with `caught/uncaught` and re-rolls weekly | MAJOR | CURED — STANDING with the landed words |
| M one proposal, two hearings; `envoy_hearing` alive nowhere | MAJOR | CURED — merged into `pact_acceptance` |
| M tilt has nothing to bias where deciders draw no randomness | MAJOR | CURED — tilt is a declared bounded term on the score where there is no draw; each kind declares which |
| M two definitions of seal 6 beside §128 | MAJOR | CURED — the hearing seal and the stressor pin are distinct objects, both stand |
| M `mediation_offer` vs "mediation never forces" (R-25) | MAJOR | CURED — only the offer's acceptance is tilted or ruled |
| M `causedBy: dm_seal` misuses the parent-id field | MAJOR | CURED — the seal event's id is the parent |
| M regeneration and flag-off with pending hearings unruled | MAJOR | CURED — (c): dark resolves in-tick; regeneration re-derives the docket |
| M "one-week advance" undefined; catch-up ticks labelled `one_week` | MAJOR | CURED — the DM's chosen unit, never a tick label |
| M the new words absent from §5; "decree" collides with the Decree Registry | MAJOR | CURED — `hearing · tilt · verdict` registered; "decree" is not used |
| M "the four majors" (the code has eleven) | MAJOR | CURED |
| m SPINE still "~19:0x" | MINOR | CURED — SPINE's requirement-24 bracket points at the fold's text of record and carries 18:5x |
| m1–m4 (addresses, the month-boundary edge) | MINOR | ACCEPTED-NOTE — the month-boundary edge (a hearing docketed in the last tick of a month advance resolves on the default at that advance's end, since the advance is not a one-week unit) is recorded in (c) by implication and named here |

### 9.6 THE FP FINAL ARCHITECTURE PROGRAM'S ADVERSARIAL REVIEW (2026-10-17) — filled by the chair at the program's end
[PLACEHOLDER 2026-10-17 (fp-final; L-FOLD) — the P3 rounds (per-volume skeptics; the seams skeptic across PL · MN · RN · CH · PT and this fold; disposition lanes; refuting verifiers — the kit's `skeptic/` and `cure/`) and the P5 completeness critic are disposed here by the chair when the loop closes at 0 BLOCKING and 0 MAJOR, or at its three-round cap, logged.]

[ROUND 1 — THE FOLD'S OWN DISPOSITION RECORD (lane D-FOLD-r1, Opus 5.5, 2026-10-18; the log `cure/D-FOLD-r1.md`)] Thirty-three round-1 findings were routed to the FOLD: twelve of `skeptic/SEAMS-r1.md` (1 BLOCKING · 6 MAJOR · 5 MINOR) and twenty-one of `skeptic/HOST-r1.md` (2 BLOCKING · 14 MAJOR · 5 MINOR). All thirty-three are disposed: CURED 33 · REFUTED 0 · STOP 0 · NOTED 0. Six execute the chair's own round-1 re-rulings (`briefs/RULINGS-ROUND1.md` ADDENDUM: SEAMS-r1-1, -6, -19; HOST-r1-1, -2, -7). Four cures carry an owner-visible row beside them: OD-FC-62 and OD-FC-63 beside a ruling, OD-FC-65 and OD-FC-66 the owner's own. Every cure is a dated insertion; removing the inserted lines restores the three files byte for byte (the proof is in the log). The volumes' other halves of the cross-volume cures are their own lanes' (PT's round-1 disposition; round 2 for PL, MN, RN and CH), listed in the log.

| Finding | Sev | Disposition | Where (this fold unless named) |
|---|---|---|---|
| SEAMS-r1-1 | BLOCKING | CURED — the ADDENDUM's re-ruling: custody waits on ES-2b | §3.3.13 ↳; §3.4 `envoy_held` ↳, `ransom` ↳, `banished_found` ↳; §2's CH row ↳; OD-FC-48 ↳, OD-FC-60 ↳ |
| SEAMS-r1-5 | MAJOR | CURED (the fold's half) | §3.1.25; §3.4 `person_at_the_gate` ↳; §5 the town's gate ↳ |
| SEAMS-r1-6 | MAJOR | CURED — the ADDENDUM's ruling: `party_voiced` | §1 requirement 24 ↳; §3.4 `party_voiced` and the recount; OD-FC-47 ↳, OD-FC-49 ↳, OD-FC-50 ↳; the spine's requirement 24 |
| SEAMS-r1-11 | MAJOR | CURED | §3.3.12 ↳; §5 PT round-1 tokens |
| SEAMS-r1-15 | MAJOR | CURED | §6 C11 ↳, C13 ↳, THE ORDER NOTE ↳ |
| SEAMS-r1-16 | MAJOR | CURED — the loop stays callerless (a reading of CH-r1-3, vetoable); its slot W-H | §2's CH row ↳; §3.1 INBOX ↳ (W-H); OD-FC-48 ↳ |
| SEAMS-r1-17 | MAJOR | CURED — each stale row bracketed to its round-1 re-ruling | OD-FC-45 ↳ to OD-FC-49 ↳; §3.4 `polity_war` ↳, `relief_answer` ↳; §5 `PRECEDENCE_CLASSES` ↳, `narrowed_voice` ↳; capture as SEAMS-r1-1 |
| SEAMS-r1-19 | MINOR | CURED — the ADDENDUM's ruling: `indecisive` | §3.4 `champion_duel` ↳; §5 `indecisive` ↳ |
| SEAMS-r1-20 | MINOR | CURED (the fold's half) | §1 requirement 24 ↳ (2); §3.4 the anchor ↳; the spine's requirement 24 |
| SEAMS-r1-21 | MINOR | CURED | §3.1.24 |
| SEAMS-r1-22 | MINOR | CURED | §5 round-1 rows; §3.4 `banished_found` ↳, `backing_repudiated` ↳ |
| SEAMS-r1-23 | MINOR | CURED | §3.1.22 ↳; §2's CH row ↳ |
| HOST-r1-1 | BLOCKING | CURED — the ADDENDUM's ruling: the host exposes PL's walk | §3.1.26; §3.1 INBOX ↳ (the map program, a); OD-FC-45 ↳ |
| HOST-r1-2 | BLOCKING | CURED — the ADDENDUM's ruling: canonized ≠ premium; the born campaign's switches EXECUTED | §1 requirement 17 ↳; §2's one lit chain ↳; OD-FC-62; the spine's requirement 17 |
| HOST-r1-3 | MAJOR | CURED | §3.1.27; §3.1 INBOX ↳ (b); §6 THE MAP PREREQUISITES |
| HOST-r1-4 | MAJOR | CURED — the chair's part ruled; the deferral the owner's | OD-FC-22 ↳; OD-FC-66 |
| HOST-r1-5 | MAJOR | CURED | §5 THE MAP REGISTER |
| HOST-r1-6 | MAJOR | CURED | §3.4 THE WHERE OF EVERY KIND; §1 requirement 24 ↳ (3); OD-FC-50 ↳ |
| HOST-r1-7 | MAJOR | CURED — the ADDENDUM's ruling | OD-FC-63 |
| HOST-r1-8 | MAJOR | CURED | §3.1.9 ↳; OD-FC-64; §3.1 INBOX ↳ (PG) |
| HOST-r1-9 | MAJOR | CURED (the fold's half) | §3.1.28; §3.1 INBOX ↳ (g) |
| HOST-r1-12 | MAJOR | CURED | §6 THE MAP PREREQUISITES and the flag-serialization note |
| HOST-r1-13 | MAJOR | CURED | §3.1.27; §3.1 INBOX ↳ (c) |
| HOST-r1-14 | MAJOR | CURED | OD-FC-51 ↳; §3.1 INBOX ↳ (e) |
| HOST-r1-15 | MAJOR | CURED | §3.1.29; §5 THE MAP REGISTER (the four strength quantities); §3.1 INBOX ↳ (WC) |
| HOST-r1-16 | MAJOR | CURED | §2's PROSPERITY row and the TR, POP and CN·LG·PG·MF ↳; §5 THE MAP REGISTER `prosperity` |
| HOST-r1-17 | MAJOR | CURED | §3.1.26 (nothing political from the map; OD-PL-13 as cured) |
| HOST-r1-18 | MAJOR | CURED | §6 C0.5 ↳; §3.1 INBOX ↳ (d) |
| HOST-r1-21 | MINOR | CURED (the fold's half) | §3.1.28 |
| HOST-r1-23 | MINOR | CURED | OD-FC-2 ↳, OD-FC-13 ↳; §3.1 INBOX ↳ (f, WC) |
| HOST-r1-25 | MINOR | CURED | OD-FC-32 ↳; §3.1 INBOX ↳ (e) |
| HOST-r1-26 | MINOR | CURED | OD-FC-28 ↳ (a) |
| HOST-r1-27 | MINOR | CURED by an OWNER ROW (not ruled by delegation) | OD-FC-28 ↳ (b); OD-FC-65 |

[ROUND 2 — THE FOLD'S OWN DISPOSITION RECORD (lane D-FOLD-r2, Opus 5.5, 2026-10-18; the log `cure/D-FOLD-r2.md`)] The round-1 verifier (`skeptic/FOLD-r1-verify.md`) held 18 of the 23 BLOCKING or MAJOR cures and failed five; it raised two NEW MAJOR findings and four minor notes. All are disposed: the five FAILS RE-CURED under the chair's round-2 rulings (`briefs/RULINGS-ROUND2.md` A.5 · A.6 · A.11 · A.12 · A.13); FOLD-V1 CURED, with the rule that the owning volume's row is of record; FOLD-V2 CURED by an OWNER ROW (re-confirmation at the re-measured size); the four minors CURED. Round 2's routed and standing items are applied beside them (§8's round-2 line).

| Finding | Sev | Disposition | Where (this fold unless named) |
|---|---|---|---|
| SEAMS-r1-1 (FAIL) | BLOCKING | RE-CURED — A.11: no engine custody of a paragon until ES-2b; the landed hold's reach measured; the errand-row slot paired with ES-2b | §3.3.13's r2 row; OD-FC-48's r2 bracket; §3.1 INBOX ↳ r2 (the errand spine) |
| SEAMS-r1-6 (FAIL) | MAJOR | RE-CURED — A.5: the hearing first, the deed at `spoken`; the party default squared | §1's r2 bracket (1); §3.4 `party_voiced` ↳ r2; the spine's requirement 24 |
| SEAMS-r1-11 (FAIL) | MAJOR | RE-CURED — A.6: PT's five `backerRole` values | §3.3.12's r2 row; §5 PT round-1 tokens ↳ r2 |
| HOST-r1-4 (FAIL) | MAJOR | RE-CURED — A.12: the native-world arm re-marked the owner's, both branches written | OD-FC-22's r2 bracket; OD-FC-66 ↳ |
| HOST-r1-6 (FAIL) | MAJOR | RE-CURED — A.13: the anchor is not the place; PT's cells | §1's r2 bracket (2); §3.4 WHERE r2 rows and paragraph |
| FOLD-V1 | MAJOR | CURED — the party rows mirror PT §13 (the gate CLIMAX, the pledge words, `upheld`, `struck`, fifteen kinds); the owning volume's row is of record | §3.4 r2 rows, recount and paragraph; §2 PT ↳ r2; §5 r2 rows; the IN INBOX ↳ r2 |
| FOLD-V2 | MAJOR | CURED by an OWNER ROW — re-executed: +30 keys, twenty-three switches; the yes re-confirmed at that size | OD-FC-62 ↳; §2's one-lit-chain r2 bracket |
| minor: "RN's lenses" | MINOR | CURED | OD-FC-63 ↳ |
| minor: "nine private `prosperity01Of`" | MINOR | CURED — nine definitions, two exported | §2 PROSPERITY ↳ r2; §5 `prosperity` ↳ r2 |
| minor: `relief_answer` among PL's kinds | MINOR | CURED — the decision token, not a kind | §5 `relief_answer` ↳ r2 |
| minor: `polityHold` per seat | MINOR | CURED — the export carries `polityOf`'s fields; the hold is per observer | §3.1.26 ↳ r2 |

[ROUND 2b — THE FOLD'S OWN DISPOSITION RECORD (lane D-FOLD-r2b, Opus 5.5, 2026-10-18; the log `cure/D-FOLD-r2b.md`)] Twenty-five round-2 findings were routed to the FOLD — twelve of `skeptic/SEAMS-r2.md` (2 BLOCKING · 7 MAJOR · 3 MINOR) and thirteen of `skeptic/HOST-r2.md` (2 BLOCKING · 8 MAJOR · 3 MINOR) — with thirteen more items: the fold's rows in `briefs/RULINGS-ROUND2b.md` and its ADDENDUM, and the fold routes of `cure/D-MN-r2.md` §4 and `cure/D-PT-r2.md` §5. All thirty-eight are disposed: CURED 33 · REFUTED 0 · STOP 0 · NOTED 5. CHAIR-NOTES items 13 and 14 are APPLIED as corrected (the §3.1 INBOX ↳ r2b seasons row; §3.3.14), so P4 folds those rows and never the notes' first text.

| Finding | Sev | Disposition | Where (this fold unless named) |
|---|---|---|---|
| SEAMS-r2-1 | BLOCKING | CURED — the sea is in the books; W-NAVY, M8, D-6; FP mints no sea law | §3.3.14 |
| SEAMS-r2-2 | BLOCKING | CURED — a patrol stops an envoy only on THE PASSAGE's envoy arm; never `envoy_intercepted` / `envoy_held` | §5 `patrol` ↳ r2b (1); §3.4 WHERE `road` ↳ r2b |
| HOST-r2-1 | BLOCKING | CURED — winter slows, never cuts; one open piece (H11's band); army attrition by season a slot | §3.1 INBOX ↳ r2b (seasons; (k)); §6 prerequisites ↳ |
| HOST-r2-2 | BLOCKING | CURED (the fold's half) — the sea row cites PS2's sea arm | §3.3.14 (d); §6 prerequisites ↳ |
| SEAMS-r2-3 | MAJOR | CURED — the harvest and the plague's season are landed; item 13 narrowed | §3.1 INBOX ↳ r2b (seasons) |
| SEAMS-r2-4 | MAJOR | CURED — one entry; MN's wear through the stamp | §5 `patrol` ↳ r2b (1); WC INBOX ↳ r2b (3); OD-FC-2 ↳ r2b |
| SEAMS-r2-6 | MAJOR | CURED — `corps` an actor kind; RN's `u:<unitKey>` | §3.3.12 ↳ r2b; OD-FC-57 ↳; §5 regard keys ↳ |
| SEAMS-r2-8 | MAJOR | CURED — THE ONE STRETCH KEY | §3.4 WHERE `road` ↳ r2b |
| SEAMS-r2-9 | MAJOR | CURED — one body of men (ST and PR agree); the alternative recorded for the chair | §3.1.29 ↳ r2b |
| SEAMS-r2-10 | MAJOR | CURED — the riders an input line on `call_in_answer`; PL's request door and prefixes | §3.4 `call_in_answer` ↳ r2b |
| SEAMS-r2-12 | MAJOR | CURED — the band always on, the DM's band a ceiling; the coin W-COIN's; one spelling | §3.1 INBOX ↳ r2b (W-COIN); §5 the funding band |
| HOST-r2-4 | MAJOR | CURED — an ask, never a supersession | §3.1.26 ↳ r2b; §3.1 INBOX ↳ r2b (a) |
| HOST-r2-5 | MAJOR | CURED — the window, never H16 | §3.1 INBOX ↳ r2b (h); §5 `patrol` ↳ r2b (2); §6 prerequisites ↳ |
| HOST-r2-6 | MAJOR | CURED — one cadence meaning; presence sent | §5 `patrol` ↳ r2b (2) |
| HOST-r2-8 | MAJOR | CURED — the join key; re-emission asked; re-kinding keeps the id | §3.1 INBOX ↳ r2b (j) |
| HOST-r2-9 | MAJOR | CURED — site garrisons only; the seat's force band a slot | §3.1.29 ↳ r2b |
| HOST-r2-10 | MAJOR | CURED — H28 split, one writer each | §6 prerequisites ↳ C5 |
| HOST-r2-12 | MAJOR | CURED — milestones corrected; PR, the canon root and H11 added | §6 prerequisites ↳ (eight rows) |
| HOST-r2-13 | MAJOR | CURED — storms are the landed storm law; a port town's storm its own stressor | §3.3.14 (e) |
| SEAMS-r2-14 | MINOR | CURED — the road arms of `person_at_the_gate` and `party_gate` | §3.4 WHERE `road` ↳ r2b |
| SEAMS-r2-16 | MINOR | CURED — the BENCH officer's personality | §3.4 `person_banned` ↳ r2b |
| SEAMS-r2-19 | MINOR | CURED — goods at the worst gate | §5 `patrol` ↳ r2b (1) |
| HOST-r2-15 | MINOR | CURED — the owner's 05:57 word recorded; one confirmation asked; A.12 kept | OD-FC-66 ↳ r2b |
| HOST-r2-16 | MINOR | CURED — THE PASSAGE's widths and weights spectrum-relative | OD-FC-28 ↳ r2b |
| HOST-r2-21 | MINOR | CURED — the patrol clause struck from the ask | §3.1 INBOX ↳ r2b (f); OD-FC-2 ↳ r2b |
| R2b: J-ES-1 (PR Q3) | — | CURED (the fold's amendment of record; the in-volume bracket a P4 bracket lane's) | §3.1 INBOX ↳ r2b (ES) |
| R2b: the patrol rows superseded (PR Q5) | — | CURED | §5 `patrol` ↳ r2b (1); OD-FC-2 ↳ r2b; WC INBOX ↳ r2b (3) |
| R2b: C16 after C15 (PR Q7) | — | CURED | THE ORDER NOTE ↳ r2b (1) |
| R2b: `army_beaten` (PR Q6) | — | CURED (the fold's mirror) | §5 `menace_met` outcomes ↳ |
| R2b ADDENDUM: ST-r2-14 | — | CURED — `site` a WHERE and a subject | §3.3.12 ↳ r2b; OD-FC-57 ↳ |
| D-MN-r2: MN tokens | — | CURED — the three-feeder sentence; four names | §5 MN round-1 tokens ↳ |
| D-PT-r2: tokens and `revealed` | — | CURED | §5 PT round-2 tokens ↳ |
| D-PT-r2: RN-3 before PT-1 | — | CURED | §6 C13 ↳ r2b; THE ORDER NOTE ↳ r2b (2) |
| R2b: FOLD-V1 (`upheld`) | — | NOTED — already in place (round 2) | §3.4 backing rows ↳ r2; §5 `upheld` ↳ |
| R2b: FOLD-V2 (the owner row) | — | NOTED — already in place (round 2) | OD-FC-62 ↳ |
| R2b: OD-PT-28 | — | NOTED — PT's ruling, accepted by the chair; no fold text describes that undo | — |
| D-MN-r2: the patrol producer | — | NOTED — the same cure as SEAMS-r2-4 | as SEAMS-r2-4 |
| D-PT-r2: §3.4 party rows | — | NOTED — already in place (round 2) | §3.4 r2 party rows |

[ROUND 3a — THE FOLD'S OWN DISPOSITION RECORD (lane D-FOLD-r3, Opus 5.5, 2026-10-18; the log `cure/D-FOLD-r3.md`)] The round-2b verifier (`skeptic/FOLD-r2-verify.md`) held 18 of the 19 BLOCKING or MAJOR dispositions, failed one (HOST-r2-9) and raised two NEW MAJORs (FOLD-V3, FOLD-V4) and minor notes; `briefs/RULINGS-ROUND3.md` gave the fold its halves of A.1–A.15, §D.1 and §E; the round-3a lanes routed their fold halves. Insertions only.

| Finding | Sev | Disposition | Where (this fold unless named) |
|---|---|---|---|
| HOST-r2-9 (FAIL) | MAJOR | RE-CURED — the MAP REGISTER's force-band row narrowed to match §3.1.29 ↳ r2b; a site sends its readiness word | §5 force band ↳ r3; §3.1.29 ↳ r3 |
| FOLD-V3 | MAJOR | CURED — `party_made_known_site`, FREE; the old name withdrawn | §5 PT's site kind ↳ r3 |
| FOLD-V4 | MAJOR | CURED — RN-3's lighting gate struck; the three questions stay visible and gate nothing | OD-FC-63 ↳ r3 |
| minor: `u:` | MINOR | CURED — landed as the rate limiter's key; a homonym | §5 regard keys ↳ r3 |
| minor: `cut01`; `a␟b`; A.14 | MINOR | CURED — the digest's pair form; `cut01` 0.5 until the map supplies a fraction | §3.4 WHERE `road` ↳ r3; §3.1 INBOX ↳ r3 (l); §5 round-3 stretch row |
| minor: actor-kind lists; the menace rationale; A.7 | MINOR | CURED — five kinds; the test is acting on a card | §1 (r3); §3.3.12 ↳ r3; OD-FC-57 ↳ r3; the spine's requirement 24 and SP-4 |
| minor: `party_stopped` | MINOR | CURED — no kind (STOP-PR-2) | §3.4 recount ↳ r3 |
| minor: a rule on the map | MINOR | CURED — the cadence an ASK | §5 `patrol` ↳ r3 |
| minor: piracy in a dark module | MINOR | CURED — live by construction (navalLayer Stage 5); D-6 S3 the missions' arm; the harbour's watch is its navy | §3.3.14 ↳ r3 |
| minor: §8, OD-FC-56, OD-FC-19, OD-FC-46 | MINOR | CURED | §8 round-2b and round-3a lines; OD-FC-19 ↳ r3; OD-FC-56 ↳ r3; OD-FC-46 ↳ r3 |
| minor: ST's STOP-era wording | MINOR | NOTED — ST's half, applied by D-ST-r3 | ST §7.3, §7.4, OD-ST-27 |
| chair note: `briefs/L-FOLD2.md` items 4 and 5 | — | NOTED — corrected by the chair (RULINGS-ROUND3 B, FOLD) | — |
| MN-V6 (routed) | MAJOR | CURED — A.3: the shared composer and its builder | §3.1.30; §6 THE ORDER NOTE ↳ r3; OD-FC-46 ↳ r3 |
| RN carry: `party_voiced`'s trigger (routed) | MINOR | CURED — A.11 | §3.4 `party_voiced` ↳ r3; §1 (r3) |
| ST note 6 (routed) | MINOR | NOTED — the fold already registers `party_cleared_site` | §5 PT round-2 tokens ↳ |
| A.1 · A.10 · §E.1 | ruling | CURED — the keep's garrison is the site's; the YIELDS clause struck; the readiness word | §3.1.29 ↳ r3; §5 round-3 readiness row; §3.1 INBOX ↳ r3 (m) |
| A.2 | ruling | CURED — the freeze mode, fourth in PS's order | §3.4 `armies_meet` ↳ r3; WC INBOX ↳ r3 (5) |
| A.3 | ruling | CURED | §3.1.30; §6 ↳ r3; OD-FC-46 ↳ r3; OD-FC-56 ↳ r3 |
| A.4 | ruling | CURED — the landed pair state | §3.1.25 ↳ r3; §5 the town's gate ↳ r3 |
| A.5 · A.6 · §E.2 · §E.3 | ruling | CURED — the families; the two facts; `reliefAnswerOf` at first sight; the registrations | §5 `fealty_*` ↳ r3; OD-FC-45 ↳ r3; §3.4 `call_in_answer` ↳ r3 |
| A.8 · PL-V4 | ruling | CURED — the one ban grammar; `patrol:` · `corps:` | §3.4 `call_in_answer` ↳ r3; §5 PL round-3 row |
| A.9 | ruling | CURED — one name | §5 the funding band ↳ r3 |
| A.11 | ruling | CURED | as the RN carry |
| A.12 · A.13 · A.15 | ruling | NOTED — no fold text carries `believedWhereabouts`, a sea leg's end or `paragonLean` (0 hits each); §3.3.14 (d) already says open water asks nowhere | — |
| §D.1 | ruling | CURED — an OWNER ROW, the chair recommending yes | OD-FC-72 |
| MN-V5 and the D-MN-r3 routes | — | CURED — the third `menace_met` producer; two armies on `armies_meet` | §3.4 `menace_met` ↳ r3, `armies_meet` ↳ r3; WC INBOX ↳ r3 (6); §5 MN round-3 row |
| the D-PR-r3, D-PS-r3, D-PT-r3, D-ST-r3 and D-PL-r3 routes | — | CURED — tokens registered; P4's card notes recorded | §5 round-3 rows; §3.4 recount ↳ r3; the rows above |
| the D-CH-r3 and D-RN-r3 routes | — | CURED — the verdict deed's mint, cap and pace; `actRef`; CH's lean seams and leak cause; the `readiness` homonym; the roster rows | OD-FC-47 ↳ r3; OD-FC-28 ↳ r3; §5 CH and RN round-3 rows |

[ROUND 4a — THE FOLD'S OWN DISPOSITION RECORD (lane D-FOLD-r4, Opus 5.5, 2026-10-18; the log `cure/D-FOLD-r4.md`)] The round-3b verifier (`skeptic/FOLD-r3-verify.md`) held 44 of D-FOLD-r3's 45 dispositions and failed one (A.4's fold half), with no new finding at BLOCKING or MAJOR and eight minor notes. Round 4a re-cures the fail under the chair's A.8, disposes every minor, carries SEAMS-r3's three fold routes and the FOLD B-row of `briefs/RULINGS-ROUND4.md`, and writes THE BODIES' fold route and the landed round-4a lanes' fold routes.

| Finding | Sev | Disposition | Where (this fold unless named) |
|---|---|---|---|
| A.4, the fold's half (FAIL) | MAJOR | RE-CURED under A.8 — ONE BELIEF READ, now CH's own text (CH §11 step 3 re-read; the symbol re-read at master) | §3.1.25 ↳ r4; §5 the town's gate ↳ r4 |
| SEAMS-r3-1 (the fold's half) | BLOCKING | CURED — `cult` one meaning, never a holder kind, never villainy; the r2b band-or-cult clause withdrawn | §5 `cult` · `band` ↳ r4; §3.3.12 ↳ r4 |
| SEAMS-r3-5 (the fold's half) | MAJOR | CURED — the den's two closings on the requested family's flags | §5 `fealty_*` ↳ r4 (1) |
| SEAMS-r3-6 (the fold's half) | MAJOR | CURED — THE BANNER's ruling row; no new kind; `banner` registered | §3.3.15; §5 `banner` ↳ r4; OD-FC-75 |
| minor 1 (the composer's builder) | MINOR | CURED — the first of PS-3 · ST-1 · PR-1 · MN-1; P4's owned unit noted | §6 builder ↳ r4 |
| minor 2 (a stale "0 hits") | MINOR | NOTED — the r3 record row is history; `paragonLean` is carried at §5 CH round-3 and OD-FC-28 ↳ r3, and A.15's roster row there | this block |
| minor 3 (the readiness census) | MINOR | CURED — re-counted, both methods named | §5 `SITE_READINESS` ↳ r4 |
| minor 4 (the posture list) | MINOR | CURED — the closed set admits six; the door refuses a menace and the party | §3.3.12 ↳ r4; OD-FC-57 ↳ r4; the spine's SP-4 (r4) |
| minor 5 (a cult in the band slot) | MINOR | CURED — withdrawn; the body ref | §3.3.12 ↳ r4 |
| minor 6 (MN's REFINED 2 as settled) | MINOR | CURED — moot: A.13 strikes the third producer | §3.4 `menace_met` ↳ r4; WC INBOX ↳ r4 (6) |
| minor 7 (quotes and counts) | MINOR | NOTED — the picture field's typedef ("believed war readiness 0..1") and its constant comment are both master's; the r3 record's counts are 45/45, cured 39 · noted 6 | this block |
| minor 8 (A.5's families) | MINOR | NOTED — no text owed (the verifier's own reading) | — |
| chair notes (L-FOLD2 items 4 and 5; PL/PR readiness; PL P45) | — | NOTED — the chair corrected L-FOLD2 in round 3; PL and PR carry ST's words and the field force in round 4 (their lanes) | — |
| A.3 · A.12 · A.13 | ruling | CURED | §5 ↳ r4; §1 (r4); §3.3.12 ↳ r4; OD-FC-57 ↳ r4; §3.4 `menace_met` ↳ r4 |
| §F THE BANNER · §E (PL-r4-S1, STOP-PR-r4-1) | ruling | CURED — recorded as ruled | §3.3.15; §3.4 `call_in_answer` ↳ r4; OD-FC-45 ↳ r4; OD-FC-75 |
| `peace_unkept` (L-BD 23b) · the ransom words (34b) · the clocked card (25b) | ruling | CURED | §5 ↳ r4; §3.3.13 ↳ r4; §3.4 `ransom` ↳ r4; §1 (r4) (2) |
| THE BODIES' kinds with their WHERE | ruling | CURED — nine new rows, the widened rows, the recount, the WHERE | §3.4 ↳ r4; the recount ↳ r4; WHERE ↳ r4 |
| CHAIR-NOTES item 17 | ruling | CURED — the C8 bracket, OD-FC-73 and the map ask | §6 C8 ↳ r4; OD-FC-73; §3.1 INBOX ↳ r4 (o) |
| THE BODIES' fold route (`cure/L-BD.md` §4–§5) | — | CURED — §2 row, the map ask, the sixth kind, the kinds, the tokens, C17, the visible rows | §2; §3.1 INBOX ↳ r4; §3.3.12 ↳ r4; §3.4; §5; §6 C17; OD-FC-19 ↳ r4; OD-FC-74 |
| the D-*-r3 fold routes (36) | — | NOTED — carried in round 3 and held by the verifier; two re-bracketed (MN's third producer, A.13; the five kinds, A.12) | as round 3; §3.4 `menace_met` ↳ r4; §1 (r4) |
| the round-4a lanes' fold routes (CH · PL · PR · PS · RN · ST) | — | CURED — tokens, rows and notes as each asked | §3.4 ↳ r4; §5 ↳ r4; OD-FC-45 · 48 ↳ r4; OD-FC-75; §3.1 INBOX ↳ r4 |
| the D-MN-r4 and D-PT-r4 fold routes (landed after the first write) | — | CURED — `armies_meet` re-worded; FOUR feeders; the owned-leaf row; MN's and PT's tokens; `party_gate`'s body half | §3.4 `armies_meet` ↳ r4, `party_gate` ↳ r4; OD-FC-46 ↳ r4; §3.3.16; §5 MN · PT round-4 |

[ROUND 5a — THE FOLD'S OWN DISPOSITION RECORD (lane D-FOLD-r5, Opus 5.5, 2026-10-19; the log `cure/D-FOLD-r5.md`)] The round-4b verifier (`skeptic/FOLD-r4-verify.md`) held 125 of D-FOLD-r4's 127 dispositions and failed two (SEAMS-r3-5's fold half; the REQUESTED family), found four more fails outside them (three of THE BODIES' routed halves, D-BD-r4 having closed after the fold lane read it; OD-RN-48, ruled after the lane), two new MAJORs (FOLD-X1, FOLD-X2) and nine minor notes. Round 5a cures every one, carries SEAMS-r4's and BD-r4's fold routes and the fold rows of `briefs/RULINGS-ROUND5.md` §B, and re-checks the round-4a lanes' fold routes (held).

| Finding | Sev | Disposition | Where (this fold unless named) |
|---|---|---|---|
| SEAMS-r3-5, the fold's half (FAIL) | MAJOR | CURED — the den's closings in ST's words (repelled or never came; no row on a self-ending den; kept only when no hostile holder keeps the site) | §5 `fealty_*` ↳ r5 (1) |
| the D-PL-r4 route: `peace_unkept` in the REQUESTED family (FAIL) | MAJOR | CURED — a REQUESTED row under BD's `bodySpillEnabled` ∧ `polityEnabled`, never `polityObligationsEnabled` | §5 `fealty_*` ↳ r5 (2) |
| RU-BD-1 · RU-BD-2 · RU-BD-3 (FAILS, routed-unapplied) | — | CURED — OD-BD-34's visible reading; THE FIRST SOAK's bodies row; `spread_faith` · `dispersed` (three surfaces) · `ranged_away` · `by_office` | OD-FC-74 ↳ r5; §6 C17 ↳ r5; §5 THE BODIES' tokens ↳ r5 |
| §E OD-RN-48 (FAIL, ruled after the lane) | — | CURED — cited and stated once | §3.1.25 ↳ r5; §5 RN round-4 ↳ r5; OD-FC-47 ↳ r5 |
| FOLD-X1 = B.6 (the clocked card's close) | MAJOR | CURED — STANDING until its climax week; the climax at the clock's end; an early act closes it | §1 (r5) (1); the spine's requirement 24 (r5) |
| FOLD-X2 = BD-r4-4 = B.7 (the ransom words) | MAJOR | CURED — three words, three events; B.2's hostile flock | §3.3.13 ↳ r5; §3.4 `ransom` ↳ r5; §5 the ransom race's words ↳ r5 |
| minor notes m1–m9 | MINOR | CURED — the map contract and the junction; OD-FC-70; four feeders; the raid ref's `bodyKind`; the party list; F.4's bounds; PS's `banner` field; CN's C14–C16; one push | §5 ↳ r5; §3.4 WHERE ↳ r5; §3.1 INBOX ↳ r5; OD-FC-70 ↳ r5; §3.4 `raid` ↳ r5; the recount ↳ r5; §3.3.15 ↳ r5; §1 (r5) (2); CN |
| SEAMS-r4-16 · SEAMS-r4-17 | MINOR | CURED — `junction:<id>` a key under `road`, the HOST-ask; the birth door answered by delegation, visible | §3.4 WHERE ↳ r5; §5 ↳ r5; §3.1 INBOX ↳ r5; OD-FC-62 ↳ r5 |
| BD-r4-3 · BD-r4-12 · BD-r4-22 · BD-r4-24 (the fold's halves) = B.4 | B · M · m · m | CURED — ONE ROAD LADDER on master's `hidden` grade; one term per gang; the ref's `bodyKind`; the map's rung words | §5 THE ONE ROAD LADDER ↳ r5; §3.1.16 ↳ r5; §3.4 `raid` ↳ r5 |
| B.22 (the fold's mirror drift) | ruling | CURED — as the four rows above it name | — |
| the round-4a lanes' fold routes (BD · CH · MN · PL · PR · PS · PT · RN · ST) | — | NOTED — held by the verifier and re-grepped; their failed halves are the rows above | as round 4 |
| chair notes (L-FOLD2 item 4; the PS→PR banner seam; a read-only git call in round 4) | — | NOTED — routed to the chair; the seam is coherent under CHAIR-NOTES 18 (d); this lane ran no git | — |

[THE PROGRAM'S REVIEW RECORD — filled at P4 (lane L-FOLD2, Opus 5.5, 2026-10-19; `briefs/L-FOLD2.md` item 10), replacing nothing: the PLACEHOLDER line above stands as history] Every number below is quoted from the kit's `BOARD.md` (its round lines of 2026-10-18 00:28 → 2026-10-19 09:22 EDT) or from the skeptic and verify files' own count lines; UNKNOWN marks a number this lane did not find. Counts read B/M/m (BLOCKING · MAJOR · MINOR) for a skeptic, holds/fails/+new for a verifier, disposed/total for a lane.

| Round | What ran | Counts | STOPs and rulings |
|---|---|---|---|
| 1 (2026-10-17 late → 2026-10-18 06:35 EDT; 22/22 seats, 4.0M tokens) | five skeptics (PL · MN · RN · CH · PT), the seams skeptic, the map builder's host requirements read as a sixth source (R5-HOST → `skeptic/HOST-r1.md`); six disposition lanes; six verifiers; the compiles of THE PASSAGE and THE SITES | skeptics PL 4/15/11 · MN 3/13/9 · RN 2/15/14 · CH 2/22/9 · PT 3/19/15 · SEAMS-r1 1/17/7 · HOST-r1 2/16/9; dispositions PL 38/38 · MN 38/38 · RN 45/45 · CH 55/55 · PT 57/57 · FOLD 33/33; verifiers PL 21/4 · MN 19/5 · RN 23/5 · CH 35/5 · PT 35/5 · FOLD 18/5, +17 new (1 BLOCKING); L-PS 16 laws · 6 waves · 4 hearings · 28 rulings; L-ST 20 laws · 7 waves · 4 hearings · 32 rulings | RN 1 · CH 2 STOPs and the seams/host BLOCKINGs ruled (`briefs/RULINGS-ROUND1.md` + ADDENDUM); ST's 2 compile STOPs (the upkeep sink, the resource yield); `briefs/RULINGS-ROUND2.md` |
| 2a (→ 07:58; 12/12 seats, 5.47M) | the compile of THE PATROLS; first attacks on PS · ST · PR; SEAMS-r2; HOST-r2; six re-dispositions | L-PR 19 laws · 6 waves · 3 hearings · 41 rulings · 3 STOPs; PS 4/14/7 · ST 2/18/12 · PR 4/15/10; SEAMS-r2 2/11/8; HOST-r2 3/11/7; re-dispositions PL 13/13 · MN 9/9 · RN 37/37 · CH 24/24 · PT 25/25 · FOLD 11/11 | `briefs/RULINGS-ROUND2b.md` (four of the chair's own words corrected: an ally's tolerance rises in wartime; winter slows a pass, never cuts it; the territory's holder keeps the gate; H16 is the map's inbound door) |
| 2b (→ 2026-10-18 13:08; nine lanes, nine verifiers) | dispositions (PS · ST · PR first cures; routed ids to PL · MN · RN · CH · PT · FOLD) then verifiers | dispositions PS 46/46 · ST 44/44 · PR 55/55 · MN 7/7 · RN 14/14 · FOLD 38/38 · PL · CH · PT UNKNOWN; verifiers: 0 BLOCKING on every slice; failed cures 11 (PL 1 · MN 1 partial · RN 1 · CH 1 · PS 3 · ST 1 · PR 2 · FOLD 1); new MAJOR 20 (PL 2 · MN 2 · RN 2 · CH 2 · PT 1 · PS 3 · ST 3 · PR 3 · FOLD 2); ~45 minors | ST's 2 STOPs (a site is a WHERE and a subject; a conveyance moves the site's holder) ruled in the ROUND2b ADDENDUM; `briefs/RULINGS-ROUND3.md` (A.1–A.15, B, §D–§G); the kit's 3-round cap YIELDS to the owner's "nothing major or blocking" |
| 3a (→ 18:16; 9/9, 4.12M) | nine disposition lanes | PL 25 · PS 30 · ST 37 · PR 39 · CH 26 · RN 33 · MN 26 · PT 37 · FOLD 45 disposed; 0 STOP | RULINGS-ROUND3 §E (the readiness words; the liege's answer at first sight; the field force; the verifiers' ROUTED-UNAPPLIED law) |
| 3b (→ 21:22; 11/11, 4.98M) | nine verifiers; SEAMS-r3 (Fable); the compile of THE BODIES | verifiers PL 10/3/+1 · MN 26/1/+3 · RN 32/1/+1 · CH 31/3/+0 · PT 14/2/+1 · PS 27/3/+1 · ST 34/3/+4 · PR 38/1/+1 · FOLD 44/1/+0 (holds/fails/new MAJOR); SEAMS-r3 1/5/4; totals 1 BLOCKING (the cult word) · 13 new MAJOR · ~17 fails (13 ROUTED-UNAPPLIED); L-BD 22 laws · 8 waves · 10 hearings (3 new, 7 widened) · 4 flags · 30 rulings · 3 shapes | §F THE BANNER and §G (the bodies' compile) in RULINGS-ROUND3; `briefs/RULINGS-ROUND4.md` |
| THE PANEL (2026-10-18 19:04 → 21:46; 5/5, 1.8M) | an independent assessment: four lenses (the table · the world · the genre · the build) and a Fable synthesis (`assessments/`) | VERDICT, quoted: 'a referee's world simulation of unusual principle and unproven dynamics … an excellent constitution, disciplined volumes, a palimpsest for a text of record, and a soak that cannot yet run'; five decisions | disposed as CHAIR-NOTES 18 (a)–(f); the birth door (+30 keys) and the belief default preset RULED BY DELEGATION on the owner's "i leave to your recommendation" (21:52) |
| 4a (→ 22:56; 10/10, 5.63M) | ten disposition lanes (incl. THE BODIES' first) | ST 49 · PL 31 · PS 43 · PR 51 · RN 43 · CH 46 · PT 35 · MN 45 · BD 62 · FOLD 127 disposed; 0 refuted | three STOPs (PL-r4-S1 · STOP-PR-r4-1 · STOP-BD-r4-1, the hamlet end = OD-BD-35, the owner's) ruled in RULINGS-ROUND4 §E |
| 4b (→ 2026-10-19 03:26; 12/12, 5.49M) | ten verifiers; BD-r4, the bodies' first skeptic; SEAMS-r4 (Fable) | SEAMS-r4 1/6/10 · BD-r4 3/9/12; verifiers PL 33/4/+1 · ST 48/2/+3 · PS 41/4/+2 · PR 51/7/+2 · RN 48/1/+2 · CH 42/6/+2 · PT 37/2/+1 · MN 44/3/+1 · BD 58/23/+3 (20 routed-unapplied) · FOLD 125/6/+2; FOUR BLOCKINGs, all THE BODIES'; ~20 substance MAJORs | `briefs/RULINGS-ROUND5.md` §A–§B; THE EXIT TEST applied: substance → round 5 |
| 5a (→ 08:01; 10/10, ~7.3M) | ten disposition lanes | BD 113/113 (the four BLOCKINGs cured) · MN 33/33 · PL 34/34 · PR 39/39 · PS 31/31 · FOLD 43/43 · ST · CH · RN · PT UNKNOWN (each lane's own record); 0 STOP | OD-BD-52 accepted; ⭐ OD-BD-49 the owner's (RULINGS-ROUND5 §D) |
| 5b (→ 08:37; NARROWED to 5 seats under the weekly allowance, 2.6M) | verifiers for BD · ST · PL; BD-r5, the bodies' second skeptic; SEAMS-r5 (Opus) across all ten | SEAMS-r5 0/10/20 · BD-r5 2/8/14; verifiers BD 59/38/+1 (32 routed-unapplied) · ST 32/4/+1 · PL 34/2/+3; ZERO BLOCKING outside THE BODIES; both of BD's against the chair's own rulings | `briefs/RULINGS-ROUND6.md` A (the owner's word wins: the ransom; the way's identity; the byte-identical pin; the guild war's weight) and B |
| 6a (→ 09:22; NARROWED to 2 lanes, no verifiers, 1.16M) | D-BD-r6; D-RESIDUE-r6 over PL · ST · PS · PR · CH · RN · MN in sequence | D-BD-r6 96/96 (0 BLOCKING left); D-RESIDUE-r6 58/58 (PL 16 · ST 16 · PS 8 · PR 6 · CH 5 · RN 4 · MN 3) | 1 STOP ruled (PEACE AND WAR, RULINGS-ROUND6 §D); OD-BD-57 visible |

**WHAT REMAINS (2026-10-19, at P4):** (1) P5, ONE completeness critic over the owner's words on the BOARD and the ten volumes, running THE WIRING CENSUS (OD-FC-79; its counts UNKNOWN until it runs); its findings are disposed before the final ledger commit. (2) THE ROUND-6 ROUTES — the bodies' routes to PS · MN · RN · WY · INT and the residue lane's to BD — recorded for CONSOLIDATION into one bracket-free packet per wave at dispatch (CHAIR-NOTES 18 (f)), never a seventh round this week; the newest volume, THE BODIES, has had two skeptic rounds, and a successor program re-runs the full loop on it when the allowance allows (RULINGS-ROUND6 §C). (3) The owner's rows (ODQ §934.93's VISIBLE ROWS). NOTHING IS PUSHED; the dispatch gate is the release, pushed and deployed.

[P5 — THE FOLD'S OWN DISPOSITION RECORD (lane D-FOLD-p5, Opus 5.5, 2026-10-20; the log `cure/D-FOLD-p5.md`; insertions only — `git diff --numstat 8a3061070` on this file reads 70 added · 0 deleted at this record's writing)] THE COMPLETENESS CRITIC (`assessments/P5-COMPLETENESS-2026-10-20.md`: 0 BLOCKING · 14 MAJOR · 20 MINOR groups) routed twenty items to the fold, the spine and CN, ruled by the chair in `briefs/RULINGS-P5.md` ADDENDUM §A–§C; every one is disposed below. The spine and CN take NO edit: neither carries the text any item names (`envoy_hearing` 0 hits in both; SP-9's charter line is `DESIGN_FP_ARCH_SP.md`'s, routed).

| Finding | Sev | Disposition | Where (this fold unless named) |
|---|---|---|---|
| P5C-1 THE CHOOSER'S SHARED-SIGNAL CAR | MAJOR | CURED — WC owns `WC-car-0`, cut before EC-17, seven claimants registered (the ruling's "six" counted seven programs, REFINED) | §3.1.23 ↳ P5; §3.3.16 ↳ P5 (11); OD-FC-59 ↳ P5 |
| P5C-11 THE CORPS' WC HALF | MAJOR | CURED — WC INBOX (14) (the normalizer arm · the DM-authority source · the stepper's destination input · `removeFreeUnit`); CH's "(13)" cites mean (14) (routed) | §3.1 INBOX ↳ P5, WC (14) |
| P5C-2 ADVANCE BY N YEARS | MAJOR | CURED — `EP-N THE LONG ADVANCE` cited (EP's row of record, D-BRACKETS-p5) | §6 C8 ↳ P5 |
| P5C-3 `passage_of_arms` | MAJOR | CURED — NINE classes | §5 ↳ `PRECEDENCE_CLASSES` — NINE |
| P5C-5 THE SPONSORSHIP OFFER | MAJOR | CURED — ES's one covert decider gains `sponsor_body` by BD-9's car; the courier and alms carriers slotted | §3.1 INBOX ↳ P5, ES (1)–(2), IN (1) |
| P5W-1 (§A.1) THE CONVEYANCE OF A SITE | MAJOR | CURED (the fold's half) — both owner words verbatim, the ruling VISIBLE | OD-FC-85 ↳ P5 |
| P5W-2 (§A.2) ES-2b · WR-7d | MAJOR | CURED (the fold's half) — OPENED by delegation; the wave order stands | OD-FC-60 ↳ P5; §3.3.13 ↳ P5 |
| P5C-14 `envoy_hearing` | MINOR | CURED (the fold's half) — three kinds lit first; SP-9's charter line ROUTED (`DESIGN_FP_ARCH_SP.md`, no P5c owner) | §3.4 ruling (2) ↳ P5 |
| P5C-16 MN-7's echoes | MINOR | CURED — PL · POP (a) · HB (a) slots; EC's row STRUCK | §3.1 INBOX ↳ P5 |
| P5C-17 ST's sibling slots | MINOR | CURED — EC (3) · ES (4) · GR (5) · WF · IN (3) `siteId`; the map re-emit REFUTED as a new ask (carried at (j), r2b) | §3.1 INBOX ↳ P5 (incl. MAP (t)) |
| P5C-18 PS's seams | MINOR | CURED — WC (15) the column and corps calls; HB (c) on the landed `terms_offered` | §3.1 INBOX ↳ P5 |
| P5C-19 PR's carriers | MINOR | CURED — HB (b) · EC (4) · WY (3) · POP (b); the patrol seizer | §3.1 INBOX ↳ P5; §3.4 ↳ `caravan_seized` P5 |
| P5C-20 PL's carriers (fold half) | MINOR | CURED — W-COIN scutage · GR (6) commuted dues; `liegeAnswers` on the war siege's docket row (PL's route) | §3.1 INBOX ↳ P5; §3.4 ↳ `siege` P5 |
| P5C-21 CH's hosts and lean seams (fold half) | MINOR | CURED — FP MAP LAYERS (EP) · the lean composers (RN, TRUTH) · ES `paragon_employer` · the `participation` column | §3.3.16 ↳ P5 (12) (13); §3.1.24 ↳ P5; §3.1 INBOX ↳ P5 ES (5); §3.4 P5 |
| P5C-23 BD's sources (fold half) | MINOR | CURED — `by_survey` (ES (3)) · `by_broker` (IN (2)) slotted | §3.1 INBOX ↳ P5 |
| P5C-24 `war_concluded`'s door | MINOR | CURED — C4's door over W-MEM's ledger (the generals' bracket of record) | §6 C4 ↳ P5 |
| P5W-7 `hidden` | MINOR | CURED — the surface rule | §5 THE SURFACE WORD |
| P5R-n1 the dial separator | MINOR | CURED — the one exception named; supersedes the ODQ's 10-19 closing addition (b) (the chair's line) | §3.4 WHERE ↳ `road` P5 |
| C.25 the map row (rulings-trace route 8) | MINOR | REFUTED as unapplied — carried since P4 at (p) and (q); cited | §3.1 INBOX ↳ P5, MAP (t) |
| P5C-12 THE REGISTER PASS | MINOR | CURED — eleven rows from the volumes' own tables; `abandoned_by` struck; the three lifecycle rows' homes named; a NEW homonym found (`DISTANCE_BANDS`, landed in `envoyChanceMeeting.js`), registered and routed to ST | §5 P5 block; §5 ↳ `REGARD_CAUSES` P5 |
| (routed in) BD's route (d), P5C-15 | MINOR | CURED — OD-BD-34's read is the gang's own reckoning | OD-FC-74 ↳ P5 |

### 9.7 THE COMPLETENESS CRITIC AND THE NEXT PROGRAM'S REVIEW RECORD (2026-10-20) [ADDED 2026-10-20 (fp-final P7; L-FOLD3; `briefs/L-FOLD3.md` items 8, 13 (g), 15 (e))]

Every number below is QUOTED from the kit's BOARD (2026-10-20 lines), the skeptic and verify files' COUNTS lines and the headers of `briefs/RULINGS-P5.md` ADDENDUM and `briefs/RULINGS-P6.md`; a number no file states is UNKNOWN, never estimated. Times are CDT, as the BOARD records them.

| Phase | What ran | Counts | Rulings and STOPs |
|---|---|---|---|
| P5a (12:24 → 13:17; `wf_36e3e93b-86d`; 12/12 seats; 4.55M tokens) | WORDS (Fable) · RULINGS (Opus) · ten wiring-census seats WC-{BD, FOLD, PL, MN, RN, CH, PT, PS, ST, PR} (Opus) | WORDS 150 words · 142 carried · 4 partial · 1 contradicted · 3 queued (0 BLOCKING · 3 MAJOR · 4 MINOR); RULINGS 407 rulings · 387 carried · 0 partial · 0 missing · 10 superseded · 10 routed-unapplied (0 findings); THE WIRING CENSUS raw 1,390 rows · ok 1,234 · dead ends 14 · shells 69 · inappropriate 71 | `briefs/RULINGS-P5.md` ADDENDUM §A–§B |
| P5b (→ 13:44; `wf_138b6595-781`; one Fable seat; 372k) | THE SYNTHESIS (`assessments/P5-COMPLETENESS-2026-10-20.md`) | 0 BLOCKING · 14 MAJOR · 20 MINOR groups; the census ADJUDICATED 1,390 · ok 1,243 · dead ends 14 · shells 63 · inappropriate 70 (7 lane rows overturned) | ADDENDUM §C (C.1–C.26) |
| P5c (15:02 → 15:59; `wf_54affd92-789`; 7 lanes + V-ALL-p5; 3.60M) | dispositions D-BD · D-PT · D-CH · D-PL-MN-RN · D-PS-ST-PR · D-FOLD (this fold) · D-BRACKETS; the verifier V-ALL-p5 | D-BD 13/13 · D-PT 12/12 · D-CH 18/18 · D-PL-MN-RN 12 of 30 (the lane STOPPED after PL) · D-PS-ST-PR 54/54 · D-FOLD 20/20 (+70/−0) · D-BRACKETS 22/22; V-ALL-p5 15 holds · 3 fails · +1 new MAJOR (P5-V1) | ADDENDUM §D (D.1–D.8) |
| P5d (16:00 → 16:23; `wf_6afb1966-af5`; 3 lanes + V-ALL-p5b; 1.42M) | D-MN-RN-p5b · D-PS-ST-PR-p5b (+ `DESIGN_FP_ARCH_SP.md`, lent) · D-BD-p5b; the verifier's pass 2 | D-MN-RN-p5b 22/22 · D-PS-ST-PR-p5b 14/14 · D-BD-p5b 2 of 2; V-ALL-p5b (pass 2, `skeptic/P5-verify.md`) 18 holds · 1 fail (P5-V1's ES half, ES l.1585) · 0 stop · 0 new BLOCKING · 0 new MAJOR (five new minors, all routed) | P5 CLOSED ON SUBSTANCE; the ES bracket placed by P6c lane A (ES-1), holding under V-BRACKETS-p6c |
| P6a (13:17 → 14:11; `wf_31b52ec6-acf`; 4 compiles + 4 skeptics; 3.22M) | L-OP · L-MG · L-WS · L-FS (Opus xhigh); first attacks OP-r1 · MG-r1 · WS-r1 · FS-r1 | OP 2B/15M/11m · MG 8B/15M/10m · WS 4B/10M/6m · FS 3B/11M/11m — three compiles refuted on a landed law the brief did not know | `briefs/RULINGS-P6.md` §A–§C |
| P6b round 1 (→ 15:43; `wf_01e58cbf-90a`; 4 lanes + 4 verifiers; 3.02M) | D-OP-r1 · D-MG-r1 · D-WS-r1 · D-FS-r1; V-<V>-r1 | D-OP 32/32 · D-MG 39/39 · D-WS 29/29 · D-FS 29/29 (0 refuted); verifiers OP 16 holds · 2 fails (1 BLOCKING) · 1 STOP · +2 MAJOR · MG 24 · 1 · +2 · WS 14 · 3 · +2 · FS 12 · 3 · +2 | §D (D.1–D.13) |
| P6b round 2 (→ 16:18; `wf_9ac318be-7a1`; 2.70M) | D-<V>-r2; V-<V>-r2 | D-OP 14/14 · D-MG 13/13 · D-WS 12/12 · D-FS 13/13 (0 refuted · 0 STOP); verifiers OP 5 holds · 0 fails · +2 MAJOR · MG 2 · 1 (MG-V2) · +1 · WS 4 · 2 (WS-r1-1 BLOCKING still; WS-r1-13) · +1 · FS 9 · 0 · +2 | §E (E.1–E.10) |
| P6b round 3 (→ 16:48; `wf_532f0d21-5f6`; 2.59M) | D-<V>-r3; V-<V>-r3 | D-OP 16/16 · D-MG 9/9 · D-WS 14/14 · D-FS 19/19 (0 refuted · 0 STOP); verifiers OP 13 holds · 1 fail (a minor promoted, OP-V5) · MG 4 · 0 · +1 MAJOR (MG-V4) · WS 14 · 0 · +2 MAJOR (WS-V7 · WS-V8; WS-r1-1 HOLDS — the BLOCKING closed) · FS 10 · 1 (FS-V3) · +0 — ZERO BLOCKING on every slice | §G (G.1–G.8); NO round 4 (§E.10) |
| P6d — the r4 consolidation (→ 20:16 by `date`, resumed after the 5h trip; `wf_3f52e58b-726`) | D-FOUR-r4: ONE seat, OP → MG → WS → FS, no verifier | 6 of 6 — OP-V5 · MG-V4 · WS-V7 · WS-V8 · FS-V3 CURED, G.6 NOTED (routed to lane B); 0 refuted · 0 STOP | ZERO open fails on the four volumes |
| THE PATRON DEITY (16:00 → 16:37; `wf_efb5b1a6-b25`; 773k) | L-CH-PD (CH amended in place) + CH-PD-r1, its first skeptic (narrowed) | the amendment +104/−0, 22 lines bracketed in place, all 36 P5 brackets kept, 0 STOP; CH-PD-r1 0 BLOCKING · 12 MAJOR · 9 MINOR | §F (F.1–F.6; the token `swornDeity`) |
| its disposition and verifier (→ 20:14; `wf_6f84776f-7fd`, resumed) | D-CH-PD-r1 (Opus xhigh) + V-CH-PD-r1 (Opus high) | D-CH-PD-r1 30 items: 26 CURED · 0 REFUTED · 0 STOP · 4 NOTED (routed); V-CH-PD-r1 10 holds · 2 fails · 0 STOP · +2 new MAJOR (0 BLOCKING) | §H (H.1–H.4) |
| SEAMS-P6 (20:19 → 20:34; `wf_0333c9e3-4c7`; one Fable seat; 564k) | the seams skeptic across OP · MG · WS · FS, THE PATRON DEITY, the brackets lanes' text and the residue's cures — thirteen seams | 0 BLOCKING · 3 MAJOR · 5 MINOR (SUBSTANCE 2 · DRIFT 1 · minors 5); none re-raised | §I (I.1–I.5) |
| P6c LANES A + A2 (→ 20:06; `wf_a1c2c062-397`, resumed; 1.03M) | lane A, the landed war and road volumes; lane A2, the program's own volumes | A: 51 of 62 routes applied — 52 dated brackets on 60 new lines (WC 16 · WY 4 · ES 10 · IN 4 · GR 2 · GENERALS 3 · POP 6 · W-SEAT 2 · INT 1 · LG 2 · SP 2 · EP 0), ELEVEN could-not-place (their texts in §3.1 INBOX ↳ P7); A2: 51 routes — APPLIED 37 · NOTED 12 · COULD-NOT-PLACE 2 · STOP 0 | insertions-only CONFIRMED by each lane |
| LANE B (→ 20:37; `wf_78a722d1-7eb`) | CH whole · one RN bracket · OP's re-attribution | 26 of 27 routes (the commander arm correctly unplaced); CH +59 lines · OP +5 · RN +1, no deletions | §F.4, §H |
| V-BRACKETS-p6c (→ 20:44; `wf_78a722d1-7eb`) | the refuting verifier over lanes A · A2 · B | 140 routes judged (A 62 · A2 51 · B 27): 132 holds · 8 fails · 0 STOP · +1 new MAJOR (BRACKETS-V1, 0 BLOCKING); insertions-only CONFIRMED for all 23 files | §J (J.1–J.6) |
| LANE C — THE SEAMS' CONSOLIDATION (→ 20:47; `wf_a6871fc1-a39`; 293k) | PS → MG → OP → BD → WC → WS → CH, one Opus seat, no verifier | 10 of 10 (PS 1 · MG 2 · OP 3 · BD 1 · WC 1 · WS 1 · CH 1); 0 could-not-place · 0 STOP | checked by this pass and the final docs proof |
| LANE D — THE BRACKETS VERIFIER'S CONSOLIDATION (→ 20:54; `wf_f6ce8f38-768`; 219k) | RN → PT → CH → OP → PS, one Opus seat, no verifier | 6 of 6 brackets + one REFINED pointer; J.1 CONFIRMED present; 0 could-not-place · 0 STOP | checked by this pass and the final docs proof |
| P7 — THIS PASS (20:55 → 21:28 by `date`; lane L-FOLD3, Opus 5.5) | the fold · the spine · CN, insertions-only | every bracket dated `2026-10-20 (fp-final P7; L-FOLD3; …)`; the numstat lines (zero deletions for all three files) are recorded in `cure/L-FOLD3.md` §3 | the drafts `cure/ODQ-934.93-P5-ADDENDUM-DRAFT.md` · `cure/ODQ-934.94-DRAFT.md` · `cure/HANDOFF-LINE-DRAFT-2026-10-20.md` |

**THE EXIT TEST, APPLIED** (CHAIR-NOTES 18 (f); RULINGS-P6 §E.10, §G): round 3 returned ZERO BLOCKING on every slice of the next program; every residual fail after round 3 was CONSOLIDATED by one lane (D-FOUR-r4), the seams seat's by lane C and the brackets verifier's by lane D — never another parallel round; what remains is parallel-cure drift, consolidated into ONE bracket-free packet per wave at dispatch. **WHAT REMAINS (2026-10-20, at P7):** (1) the docs proof `bash tools/docs-proof.sh final-p6` over the working tree (the chair's; the interim run of 16:41 CDT was green — 290 files · 4,824 tests · exit 0, before P6c and P7); (2) the ODQ §934.93 P5 addendum, §934.94 and the HANDOFF line, from this lane's drafts; (3) the ledger commit by explicit pathspec with the `Seat:` trailer; (4) the kit resealed (`refs/preserve/fp-final-kit-a73343ed-2026-10-20`); NOTHING PUSHED — the gate list (push · merge · deploy · migration · dispatch) stays the owner's, re-confirmed in chat at its unit, and the dispatch gate is the release.
<!-- END Part 9 -->
