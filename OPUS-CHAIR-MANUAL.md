# THE OPUS CHAIR MANUAL — running the REWRITE program from an Opus seat

Written 2026-09-11 by the Fable chair (session 4ed79a2b); amended 20:5x the same day (§919.2: the refuter seat is Opus at the owner's word) at the owner's word: "comprehensively write the procedures and the architecture and sequence, etc. so that opus can do all of this work for you with the current plans." Owner rulings the same afternoon: the marker and judge seats may be Opus; **refutation stays Fable**; one lane at a time; pause is the owner's word and so is resume.

This manual is the operating document for a chair running on Opus. It does not replace the laws (they live in the brief, the tables and the memory) — it tells you where they are, what runs in what order, how to run it, what you decide alone, and what you hand to a Fable sitting or to the owner. Read it whole once; afterwards the numbered procedures in section 6 are the pages you will return to.

Every path below uses `$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad` (the program's kit; it has survived every session, account switch and one reboot) and `$REPO` = `/Users/cstokes/Desktop/settlement-engine`.

---

## 0. What this program is, in plain words

The product generates a fantasy town and writes it up in prose. Every sentence of that write-up is drawn from a pool of hand-written variants, and each variant has four wordings ("faces"). The REWRITE is the program that rewrites every variant of every pool so that each sentence claims only what the game actually records about that town, and nothing more, while still reading well. The two hard parts are: knowing exactly what a sentence is allowed to claim (the licence card, the two law tables, the writer rules) and catching the sentences that quietly claim more (the Fable refuters — the automatic checker cannot see this).

The work is organised as blocks (a block = a group of pools that share one page of the write-up, e.g. DS-DEF-2 is "the defense desk's threat-by-threat page", 26 pools). A block is run through one workflow in its own dock (a private checkout of the product). When all the blocks of a desk are done they are assembled into a consist, checked by a skeptic pass, and landed on the product branch as one numbered train (§920 for the defense desk).

Where we are (09-11 15:3x): the validation block DS-DEF-11 is done and sealed; both law tables are ratified; DEF-2 (26 pools) is PAUSED by the owner mid-Mark with 18 of 26 skeletons written; the remaining eight defense blocks, the consist and the landing follow, then the other five desks.

---

## 1. The seats and the chair

| seat | who | what it does | may be changed? |
|---|---|---|---|
| The chair | you (Opus from here; Fable before) | launches lanes, reads results, records state, rules within the plan | the owner's choice |
| Marker | Opus (setting `markModel`; was Fable) | writes each pool's LICENSED SKELETON: which claims of the shipped sentence are licensed, which reads must be stated, the angle's stance, the referent layer of every noun | yes — `args.markModel` |
| Drafter · Refiner · Curer | Opus | write, sharpen, repair the faces | no (already Opus) |
| The gate (draft · refine · cure · apply) | Opus | applies packets to the dock, runs the mechanical checks and the tests, commits | no |
| **Refuter · Re-refuter** | **Opus** (`args.refuteModel`, default `opus` — owner 09-11 20:5x: "Just refute everything with opus"; the earlier "Refutation can stay fable" is superseded) | tries to break every face against the card, the tables and the bars; names the law and the cure | yes — `args.refuteModel` (`fable` only at the owner's word) |
| Judge · Judge-cure | Opus (setting `judgeModel`; was Fable) | applies the written keep/revert/cure-target rules over the refuters' verdicts; writes JUDGMENT.md | yes — `args.judgeModel` |
| A Fable sitting | Fable, convened by the chair | anything that makes NEW law or ratifies a table (section 7) | — |

The chair's standing authority is the owner's total delegation of 2026-09-09 ("all current, pending, and futurely emergent permissions … all judgement to you"), restated 09-11. It carries two duties: RECORD every decision where the owner can veto it (the resume note, the brief's addenda, memory), and KEEP OFF THE TABLE the classes in section 7.3 (the push, the walk, and the owner-gated classes).

---

## 2. The map — where everything is

**The kit (`$SC`):**
- `RESUME-NOTE.md` — the program's diary, newest entries near the top. EVERY milestone, pause, launch, death and ruling gets an entry the same turn. The successor reads the top first.
- `LANE-STATUS.md` — auto-written every 5 minutes by `autosave-handoff.sh` → `snapshot-lanes.sh` → `snapshot-agents.py`: the docks, the packets per block, and every workflow run's agents (done · retried · in flight, with the files each has written). Read it first after any death.
- `RESUME-MESSAGE.txt` — the one-paragraph message the owner pastes to a new session.
- `briefs/brief-REWRITE-car8b-defense.md` — THE BRIEF for car 8b: the charter and ADDENDA 1–13. The laws of this car are its addenda; ADDENDUM 12 (the ten writer rules W1–W10, the cure round) and ADDENDUM 13 (parts A and B: the two law tables ratified, the writer bars W11–W27, the wiring rows) bind every block.
- `rewrite/` — the workflow scripts and the block packets:
  - `rewrite-block-v2.workflow.js` — THE BLOCK WORKFLOW (section 3). `rewrite-block.workflow.js` and `rewrite-block-cure.workflow.js` are its ancestors, kept as history.
  - `mk-block-resume.py` — rebuilds a block's state from a dead run's journal (procedure 6.5).
  - `args-DEF<n>.json` — each block's pool list (from `block-args.mjs`); `args-DEF2.launch.json` — DEF-2's full launch args; `args-DEF2.resume.json` — DEF-2's rebuilt state (refresh it before use).
  - `tables-13.txt` — the ratified law text (ADDENDUM 13 A+B) passed as `args.tables` to every block. `rulings-DEF2.txt` — DEF-2's block rulings; write one per block.
  - `DS-DEF-<n>/<pool dir>/` — the packets: `skeleton.md` · `draft-round-N.md` · `refine.md` · `kept.md` · `refute-round-N.md` · `cure-round-N.md` · `cured-round-N.md`; per block: `JUDGMENT.md`, `JUDGMENT-cure.md`. `DS-DEF-<n>.attemptK/` are earlier refused attempts (history).
  - `entailment/ENTAILMENT-TABLE.draft.md` and `REFERENT-TABLE.draft.md` — the two law tables (ratified as corrected at ADDENDUM 13); the twelve survey/refute packets beside them.
  - `consist-defense.sh`, `block-args.mjs`, `wrapcheck.py` (syntax check for workflow scripts).
- `laneRW-DEF<n>/` — one dock per block (a git worktree of `$REPO`, detached at the wiring car's tip `f2da5a3ee`); `laneRW-DEF11` is DONE at `5cfc02000`; `laneRW-DEFW` is the wiring car's dock and the CONSIST LINEAGE (the consist is cut from it).
- `prose-research/` (the voice: `REGISTER-CARD.md`, `RULES-V2-PART-B.md`, `sweep/MOVE-GRAMMAR.md`, `sweep/CLERK-LAWS.md`), `arch-prose/ARCH-COMPOSED-PROSE-v2.md` (the architecture of record) and `arch-prose/TRAINS.md` (the trains after 8b).
- `_progress/<wf id>/` — mirrors of every workflow journal and a per-agent summary.
- The §919 landing kit: `predict-919.sh`, `proof-919.sh`, `run-registers-919.sh`, `run-ratchet-919.sh`, `after-ratchet-919.sh`, `texts-919.draft.md`, `fill-template-919.py`, `run-gate-919.sh`, `after-cas-919.sh`, `mk-landing-kit.py` — the §920 chain is derived from these (procedure 6.9).

**The repo (`$REPO`):** the main tree's HEAD is the LEDGER branch `review-fixes-2026-07-08` (its `src` is frozen; the main tree's porcelain of ~5,600 lines is the owner's foreign WIP — never touch, never stage). The PRODUCT branch is `claude/composite-r4` at `f73bdbf16` (§919). Landings move the product by CAS (`git update-ref` with the expected old value) and add a § row to the ledger. Sealed states are `refs/preserve/*` (e.g. `rw-def11-validated-2026-09-11` = 5cfc02000).

**Memory (`~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/`):** `MEMORY.md` is the index (≤ ~17 KB; fold, never trim; the START HERE row points at the current state); one file per fact. Save a durable fact (a hazard, an owner directive, a judgment) the turn it surfaces, with an index row.

**The workflow journals:** `~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/<session id>/subagents/workflows/<wf id>/journal.jsonl` — every finished agent's return value (`{"type":"result",…}`), and `agent-<id>.jsonl` transcripts. A run id resumes only inside its own session; the journal is what a new session rebuilds from.

---

## 3. The architecture of a block run (`rewrite-block-v2.workflow.js`)

One block, one dock, one run. Phases in order; every phase's outputs are FILES (the packets) and DOCK COMMITS, so a death anywhere is resumable.

1. **Mark** — one marker per pool (Opus by `markModel`). Reads the licence card (`node scripts/prose-licence-card.mjs <BLOCK> '<pool key>'` in the dock), the block's header lines, the two law tables' rows for its desk. Writes `skeleton.md`: for each shipped variant, every claim tagged LICENSED/UNLICENSED and its REFERENT LAYER (BODY · HOLDER · ORGAN-UNDER-POWER · POWER · ROLE · AGGREGATE · NONE · EXTERNAL BODY · TRADITION), the reads the rewrite must state, the angle's stance, the shipped turns worth keeping, what would make the rewrite a regression. Barrier: all pools or the run throws.
2. **Draft** — rounds (≤ `maxRounds`, default 6). Each round: one Opus writer per open pool writes `draft-round-N.md` (every variant rewritten in place under its number with its ONE angle tag and three `- [face]` sub-rows; the licensed claim set kept, unlicensed claims dropped, none added; under --- NOTES the licence behind each claim). Then ONE Opus gate applies all packets to the annex in the dock (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`), runs `node scripts/generate-dossier-state-prose.mjs --check`, the wave gate (`scripts/prose-wave-gate.mjs --arm draft --round N --pools … --out <dock>/.packets/draft`), the two per-commit tests (`tests/copy/voiceMechanics.test.js`, `tests/data/dossierStateProseProjection.contract.test.js`, one focused file at a time, never while another runner is up), and commits `REWRITE 8b <BLOCK> draft round N: x/y`. A pool is in band → done; a pool whose failing owned measure did not move → a dry round; two dry rounds → banked (a refusal by evidence). Barrier per round.
3. **Refine** — one Opus refiner per pool pushes every face toward the ceiling (never plainer, never a new claim); the refine gate keeps or reverts per pool against the draft's cells, writes `kept.md` per pool (the rows now standing), commits `… refine: k/n kept, r reverted`.
4. **Refute** — one refuter per pool (Opus by `refuteModel`, default opus; owner 09-11 20:5x) over `kept.md`: every face PASS · WITHHELD · FAIL with the law, a ≤12-word quote and the CURE it names; writes `refute-round-1.md`. Barrier: all pools.
5. **Judge** — the judge (Opus by `judgeModel`) applies rule 1 (a FAIL whose draft face is clean → revert to the draft face), rule 2 (WITHHELD → keep), rule 3 (a FAIL naming no law → WITHHELD), RULE 4 RE-CUT TO THE FACE (a FAIL whose draft face is also bad → a CURE TARGET, never a pool refusal), rule 5 (never trim). Writes `JUDGMENT.md` with `--- REVERTS` and `--- CURE-TARGETS`. The Opus apply gate applies the reverts and commits `… judged` (focused tests only).
6. **Cure rounds** (≤ `maxCureRounds`, default 2) — per open pool an Opus curer rewrites ONLY the targeted faces (`cure-round-N.md`, every other face byte-identical); the cure gate diffs, applies, measures, writes `cured-round-N.md`, commits `… cure round N: a/b pools`; the re-refuters (the same `refuteModel` seat) re-refute the cured faces and re-read the pool whole (`rerefute-round-N.md`); still-failing faces and new findings carry to the next round.
7. **Judge-cure** — a target PASS/WITHHELD after its last round is CURED; a target still FAIL is a FACE-LEVEL REFUSAL ROW (banked, listed for the register car, never trimmed). Writes `JUDGMENT-cure.md` with `--- REFUSALS`.
8. **The final apply gate** — the projector check, the wave gate, the two focused tests, then `tests/ui` WHOLE under the mutex (`sh scripts/gate-mutex.sh --run -- npx vitest run tests/ui`) when the runner count is 0; a liveness anchor on a drawn sentence of THIS block that reds is re-seeded through `tests/helpers/drawnProse.js` (never deleted); commits `… cured: …` if anything changed. The two per-commit reds that are DECLARED (not the block's): E2 `voiceMechanics` (the inherited pair `labelBands.js` em 5 · `generalStateProse.js` em 3) and the face-count pins of the projection contract (they move by the block's own new faces; the consist's register car re-records them).

**Built-in protections:** the CHECKPOINT LAW in every prompt (create the packet early, rewrite as you go, continue from an existing file if an earlier attempt was cut off); stop-clean guards after every barrier (a short barrier throws with the resume instruction instead of running the next phase on nulls); a resume path (`args.resume`, section 6.5) that skips every phase whose results are supplied; result matching by pool key, never by object identity.

**What the run returns:** `{draftCommit, refineCommit, appliedCommit, cureCommits, head, rounds, refutes (FAIL/WITHHELD/PASS per pool), judge, applied, cure, judgeCure, appliedCure, tokens}` — and the journal has every agent's full return.

---

## 4. The laws every seat runs under (where they are; never restate them from memory)

1. THE VOICE: `$SC/prose-research/REGISTER-CARD.md` (the voice on one page), `RULES-V2-PART-B.md` §1, §16–16.2, §18, §20–23 (the bands, the two phases, never-trim), `sweep/MOVE-GRAMMAR.md` §1–3, §4.4.1–4.4.3, `sweep/CLERK-LAWS.md` §2.4.1, §2.6.1, `arch-prose/ARCH-COMPOSED-PROSE-v2.md` §2.5 (the annex grammar) and §8.3 (the licence card). The script's VOICE constant names them; the seats read them whole.
2. THE OWNER'S LAWS (memory, `MEMORY.md` "Who the owner is / the laws"): four faces per variant, never trim; the exemplar not the practical; the most memorable sentence WITHOUT increasing the claim set (the plainer floor is not a regression); THE THREAD (an added sentence carries a noun forward); the secret shown as a secret (the DM pen line); THE ENTAILMENT LAW and THE REFERENT LAW (ratified as corrected at ADDENDUM 13); layman's terms in every message to the owner; time is not the constraint, quality is.
3. THE REWRITE RULES (the script's RULES constant = Part B §21–23 + the skeleton rule + the density floor + the inventory-line refusal + the four-faces-differ-in-construction rule + W1–W10 + R-i) — read them in the script once; they are the writers' contract.
4. THE TWO TABLES, ratified: ADDENDUM 13 part A (the entailment law corrected: items 3, 4, 5; writer bars W11–W19) and part B (the referent law corrected: nine layer tags, rules 3–5 amended; writer bars W20–W27). `rewrite/tables-13.txt` is their text as passed to every block. The tables themselves are the refuters' instrument: `rewrite/entailment/ENTAILMENT-TABLE.draft.md` (sections 2 per desk, 3 label traps, 4 alias traps) and `REFERENT-TABLE.draft.md` (2 per desk, 3 overlaps, 4 power slots and visibility, 5 wrong-layer findings).
5. THE BLOCK RULINGS: a short file per block (`rewrite/rulings-<BLOCK>.txt`) restating the rulings that generalise (R-i, R-ii, R-iii, R-iv, R-vi, R-viii′, W16) and naming this block's known shipped breaches (from the entailment table's desk section 7 and the referent table's section 5) and the label traps its reads walk. Copy `rulings-DEF2.txt`'s shape; change only the block-specific lists. A ruling that would be NEW LAW is not written here — it goes to a Fable sitting (section 7).
6. THE LAW OF LAUNCH: no block is drafted under one law and judged under another. The `tables` text and the block rulings are fixed at launch; if a law changes mid-block, the block finishes under its launch text and the change binds from the next block.

---

## 5. The sequence (the current plan, in order; one lane at a time)

1. **DEF-2 (paused)** — resume it (procedure 6.5). It is the THROUGHPUT TEST: its first-Refute FAIL rate against DS-DEF-11's 25 of 48 (52 %) decides the program. Under ~20 %: the laws converge; proceed. Above: STOP after reading the judgment and convene a Fable sitting on what the refuters found (a lever change, not another block).
2. **DEF-1** (8 pools; `args-DEF1.json`), then **DEF-5** (11), each: write the block rulings file → launch → read (procedure 6.3) → record.
3. **CAR 8b-W-2**, the defense wiring car (an Opus lane in `laneRW-DEFW`, chartered at ADDENDUM 13 parts A-D and B-D): the `{defmaterial}` derived fill with its value table; the `{defwork}` literal residuals; a `{watchname}` fill; the chain statuses as reads on WALLED-STRAINED and DS-DEF-5; the census token lists and the covert-token read; the licence card's `entails:` and referent columns; the read-grain bridge for DS-DEF-3/4; `seatKind` on `{seat}` or the class word on capture reads; the NAMED-BUT-NEVER-FILLED refinement bug; the four purses restated on the card; a kind with no holder cited by the class word. Brief it from those two sections; the shape is the 8b-W car (seven commits, a receipt with executed figures, no prose byte). Owner-gated inside it: the STRAINED key's firing on a wage-less roster (a proposal only), OW-20 (the engine's own strings), OW-22 (custom-content accessors).
4. **DEF-3 (7), DEF-4 (9), DEF-6 (8), DEF-8 (3), DEF-9 (3)** — docks cut at f2da5a3ee (`sh $SC/mkdock.sh laneRW-DEF<n> f2da5a3ee` if a dock is missing); DEF-7 and DEF-10 are UNMOUNTED (struck from the rewrite). After 8b-W-2 lands, blocks with lifted bars may use the new fills; earlier blocks' faces that used the bars are fine as they stand.
5. **The consist** — `sh $SC/rewrite/consist-defense.sh laneRW-DEF11 laneRW-DEF2 laneRW-DEF1 …` onto the `laneRW-DEFW` lineage (each block's base is its merge-base with the wiring dock); read its receipt; resolve conflicts only in the annex and the generated leaves, never in src by hand.
6. **The register car** (the chair's own commits on the consist dock): the wiring census re-take (`--write` by its ritual), the DRIFT manifest fixture re-record (`node scripts/prose-manifest-cells.mjs --record`), the face-count pins of the projection contract, writer-reach provenance, the lighting census re-freeze by its own ritual, and the banked FACE-LEVEL REFUSAL ROWS of every block restored or cured as the consist's cure car (DS-DEF-11 has three plus two non-target findings; each later block adds its own). Every figure from a command you ran.
7. **The skeptic pass** — a workflow of independent lenses over the consist (the 8a shape: kernel · instruments · fences; three read-only docks pinned at the tip; a FOLD with CONFIRMED · REFUTED · PARTLY · UNTESTED · NEW and the cures owed) → the chair rules the fold → the cures land as a car.
8. **§920, the landing** (procedure 6.9): the kit is derived from the §919 set.
9. **Then the other desks**, in the trains' order: general, economy, power, stressors, warFaith — each desk: its wiring car FIRST (the OW rows ADDENDUM 13 D assigns to it), then its blocks one at a time, its consist, register car, skeptic pass, landing. Then the trains after 8b (`arch-prose/TRAINS.md`): the FREEZE act → WAVE → TURNS → CUSTOM-PROSE → SURFACES ×2 → CAPACITY → STOP before the walk.
10. **Parked, gated:** the token-efficient MARK/REFUTE instructions (owner 09-11 15:1x; memory `owner-directive-2026-09-11-refine-mark-and-refute-for-an-opus-seat-only-after-fable-has-mastered-it`) — the markers are already Opus by the 15:2x ruling; the paired blind comparison on a few pools inside DEF-1 is the check.

---

## 6. Procedures

### 6.1 Before any launch (the checklist, every time)
- `cat $SC/LANE-STATUS.md`; the top entries of `$SC/RESUME-NOTE.md`; the memory START row.
- ONE LANE: no other workflow or lane is running (LANE-STATUS shows IN FLIGHT 0 everywhere; `/workflows` in the terminal).
- The dock: `git -C $SC/laneRW-<n> log --oneline -5` and `status --porcelain` → 0 lines. A dirty dock is a dead gate's stage: `git -C <dock> show HEAD:<path> > <dock>/<path>` for each listed file, NEVER `git checkout`, `reset --hard`, `stash`.
- The runner count, its own shell line: `V=vit; V2=est; pgrep -fl "$V$V2" | grep -v gate-mutex | wc -l` → 0. `uptime` load under ~6.
- The laws unchanged since the launch text was written (`rewrite/tables-13.txt`, the block rulings).
- Write the RESUME-NOTE entry for the launch BEFORE reading the result: run id, task id, args file, the phase expected next, the resume recipe.

### 6.2 Launch a block
1. `node $SC/rewrite/block-args.mjs $SC/laneRW-DEF11 DS-DEF-<n> laneRW-DEF<n> > $SC/rewrite/args-DEF<n>.json` if the args file is missing or stale (it emits the RESOLVED pools and `wiringDebt`).
2. Write `rewrite/rulings-DEF<n>.txt` (section 4.5).
3. Build the launch args: `python3 - <<EOF` … load `args-DEF<n>.json`, set `tables` = `open('rewrite/tables-13.txt').read()`, `rulings` = the file, `maxCureRounds` = 2, `markModel` = 'opus', `judgeModel` = 'opus' … dump to `args-DEF<n>.launch.json`; print it compact.
4. `Workflow({scriptPath: '$SC/rewrite/rewrite-block-v2.workflow.js', args: <the JSON>})`. Record the run id and task id in the note immediately.
5. Wait for the notification. Do not poll every minute; LANE-STATUS updates itself. When the owner sends a message, answer it and keep waiting.

### 6.3 Read a block's result (what to look at, in this order)
1. The return value's `refutes` list: FAIL/WITHHELD/PASS per pool. Compute the first-Refute FAIL rate = ΣFAIL / Σ(all faces). Compare with 52 % (DS-DEF-11) and with the last block. This number goes first in the note and in the message to the owner.
2. `rewrite/<BLOCK>/JUDGMENT.md`: the rulings per face, `--- REVERTS`, `--- CURE-TARGETS`; §7 "rows for the chair".
3. `JUDGMENT-cure.md`: `--- REFUSALS` (face-level refusal rows, banked for the consist's cure car) and the non-target findings carried.
4. The dock: `git log --oneline` (draft rounds · refine · judged · cure rounds · cured); the final gate's Tests lines from its transcript (`tests/ui` whole green; the two declared reds and nothing else). If a NEW red appears, it is the block's: do not land it; open a cure car.
5. Spot-read three pools yourself against the shipped rows (the annex at the dock's first commit: `git show f2da5a3ee:docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`): lawful, claim-equal, readable, faces different in construction. Your own read is recorded BEFORE you compare it with the refuters'.
6. Findings that are NEW LAW (a fault class no bar names; a rule the refuters disagree on; a correction to a table) → a Fable sitting (section 7). Findings that are wiring → the register car's rows. Findings that are a face → already banked.
7. Record: the note entry, the memory START row, a memory file if a durable hazard or law surfaced.

### 6.4 Pause, stop, and the owner's word
- The owner says "pause" → `TaskStop(<task id>)` at once, then record the exact state (the dock's porcelain; which agents had returned, from the journal; the resume recipe). Nothing resumes until the owner says so.
- The owner says "continue" / "resume" → procedure 6.5.
- A stopped run in THIS session resumes by `Workflow({scriptPath, resumeFromRunId: '<wf id>', args: <the same args>})` — finished agents replay from cache, dead ones re-run (and continue from their partial packets).

### 6.5 Resume a block in a NEW session (after an account switch or a machine death)
1. Procedure 6.1's checks (the dock's porcelain above all).
2. Rebuild the state: `python3 $SC/rewrite/mk-block-resume.py <the dead session's journal> $SC/rewrite/args-DEF<n>.launch.json $SC/laneRW-DEF<n> $SC/rewrite/args-DEF<n>.resume.json <wf id>`. It prints a summary (marks · draft gates · refine · refutes · judge · applied · cure gates · warnings) and writes the launch args plus a `resume` object: the finished markers by dir, the draft state per pool replayed from the gates' verdicts, the refine commit, the refutations already returned, the judge and apply results, the cure rounds' open targets. READ ITS WARNINGS (a committed round whose gate never returned is counted done with its verdicts unknown).
3. Launch: `Workflow({scriptPath: '$SC/rewrite/rewrite-block-v2.workflow.js', args: <the JSON minus the _resume_summary key>})`. The script logs "RESUMING in a new session from <wf id>: marked N · draft rounds done N …" as its first line; every supplied phase is skipped; the missing agents run.
4. For DEF-2 specifically (paused 09-11 15:20): the journal is `~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/4ed79a2b-6cd2-45cf-ab97-83cdad49c30b/subagents/workflows/wf_2e33aae5-027/journal.jsonl`; 18 markers are done; set `markModel: 'opus'` and `judgeModel: 'opus'` in the args (the 18 Fable skeletons stand; the eight missing run on Opus).

### 6.4a THE CHAIR IS OPUS FROM 2026-09-14 (the owner: "Continue the rest with opus")
- FOLD 57's "FABLE CHAIRS, OPUS IMPLEMENTS" is superseded for the remainder of the REWRITE. This manual is the chair's book; §7.1 is what you decide alone, §7.2 is what a FABLE SITTING decides (new law, a ratified table's correction, a block whose FAIL rate breaches the threshold) — convene one rather than legislate. The SEATS do not move with the chair: one Opus and one Fable writer under alternating lenses, a FABLE selector (the taste seat), an Opus refuter and curer (ruling 24).
- TWO CHAIR ACTS LEARNED IN BATCH 3, both now precedent: (i) when the cure gate refuses a WHOLE packet for one line, the chair applies the packet with that one line re-cut BY NAME rather than banking every target in it — but the cut must be MEASURED (run the instrument the gate ran; `provenanceCount` from `src/domain/prose/composedWalker.js` for a citation ceiling) and written into a `chair-cut-N.md` in the packet dir before an implementer touches the dock; (ii) a CURE CAN INTRODUCE A FAULT the draft did not have (batch 3: a garrison face presupposing a wall at town) — always read the re-refute's per-face verdicts, never just its FAIL count.

### 6.5a Resume a v3 block FROM THE PACKETS ON DISK (added 2026-09-13 06:3x, after wf_208f835e-a94)
- Under v3 (`rewrite-block-v3.workflow.js`, ADDENDUM 18) the files on disk are the state: `card.md` (Mark) and `candidates-<k>.md` (Draft, one per writer lens) in `$SC/rewrite/<BLOCK>/<pool dir>/`. A run that died after any of them exists is resumed WITHOUT re-running those seats: put in the launch args `resume: { fromRunId, markedDirs: [<pool dirs with a card.md>], candidateDirs: [<pool dirs with every candidates-*.md>] }` (`args-DEF2-v3.onepool.resume.json` is the pattern). Prefer this over `resumeFromRunId` when a prompt constant (VOICE, LENSES, the card instrument) changed after launch: the run-id cache keys on the prompt and would re-run every seat.
- The death this procedure comes from: both writers returned the packet dir ABSOLUTE; the script compared it to the short dir by `===` and the selector never launched ('SELECT returned nothing'). v3 now matches dirs by the last path segment (`sameDir`) at every join. If a guard says a phase 'returned nothing' and the journal shows NO `started` line for that phase, the join is the suspect, not the seat.

### 6.5b The seats under v3 (the owner's ruling 24, 2026-09-13 08:3x — 'the best combination from now on')
- Opus MARKS (`markModel`) · writer 1 OPUS under lens 1 and writer 2 FABLE under lens 2 (`WRITER_MODELS`, override with `args.writerModels`) · FABLE SELECTS (`selectModel`) · Opus REFUTES and CURES (`refuteModel`, `cureModel`; the 09-11 word). The selector's NOTES carry a 'SEATS:' tally per pool — read it after every pool and keep the running count in the note.
- Flip rules (the chair's, recorded): Fable wins the shared lens two to one across two consecutive pools → set both writers to fable; the weekly limit within a day → both writers opus, Fable keeps the selector only. Any other change to the seats is a Fable sitting's (7.2).

### 6.5c The face-count register is HAND-EDITED (learned 2026-09-13 12:3x)
- `docs/content/prose-shift-register.json` row `face-count-per-variant` has NO `--write` path: the contract test `tests/data/dossierStateProseProjection.contract.test.js` recomputes the three values (sum · largest · digest) and reds when they differ. When a landed pool lawfully moves them, edit the row by hand to the test's printed values, put the grow in the row's `shift` field, and DECLARE it in the commit body. A v3 gate that lands sourced faces without doing this leaves the dock red for every later car (it happened at `569e01793`; cured at `95760e212`).

### 6.6 When a workflow returns an error or an empty result
- Read `<transcript dir>/journal.jsonl` before diagnosing: the `result` lines are the truth; a `failed` line names the cause ("You've hit your session limit · resets …" = the window; a stream event shows as "[Request interrupted by user]" in the agent transcript with an immediate retry on the same key).
- A guard's throw ("… INCOMPLETE … resume by run id") is a clean stop: resume (6.4 or 6.5). A cascade (later phases failed on empty results) means an old script; check `grep -c "throw new Error" rewrite-block-v2.workflow.js` ≥ 13.
- A gate that committed and died: the dock log shows the commit; the note and `mk-block-resume.py` count the round done; the dock may be dirty (6.1).

### 6.7 The window cutoff and the account switch (the owner's standing condition)
- Keep the note current at every milestone; the memory START row; `RESUME-MESSAGE.txt`. The autosave does the rest.
- When the owner says a switch is coming: write the ⏸⏸ entry (the five steps of 6.5 with the exact journal path and run id), refresh `args-DEF<n>.resume.json` with the helper, refresh the memory START row, and say in one paragraph what dies and what survives.
- The same session auto-continues after a window reset (the harness waits; run ids still resume there). An account switch is a new session (6.5).

### 6.8 Recording — the discipline that makes all of this resumable
- RESUME-NOTE.md: an entry per act, inserted just above the "⏸ 09-10 01:2x — PAUSED" anchor (newest first in that region). Say what was done, the figures from commands you ran, the ids, what is next, and what a successor does if this session dies.
- The brief: a new ADDENDUM only for a ruling that binds the writers (from a Fable sitting) or a car's charter; number it next.
- Memory: a file for a durable fact (a hazard, an owner directive, a judgment call) + an index row the same turn; refresh the START HERE row at milestones; never let MEMORY.md pass ~17 KB (fold into an archive file with a pointer).
- Label conclusions CONFIRMED (you executed the proof) or PLAUSIBLE (reasoning only). Failures verbatim. No "should work now".

### 6.9 The §920 landing chain (after the defense consist and its skeptic pass)
Derive the kit from the §919 set in `$SC` (`predict-919.sh`, `proof-919.sh`, `run-registers-919.sh`, `run-ratchet-919.sh`, `after-ratchet-919.sh`, `texts-919.draft.md`, `fill-template-919.py`, `run-gate-919.sh`, `after-cas-919.sh`, `mk-landing-kit.py`): copy each to `-920`, re-point the dock to the consist dock (the wiring lineage) and the base to `f73bdbf16`. Then in order, each proved before the next: `sh predict-920.sh <dock> > predict-920.log` → `touch $SC/HOLD-VITEST` (no lane vitest during a proof) → `EXPECT_CARS=<n> sh proof-920.sh` (the whole suite, ~20 min, the quiet law: load < 6, zero other runners, else it fails vacuously) → classify the reds (known: the E2 pair; the golden master 525; the two chartered manifest arms) → fill the register predictions → `EXPECT_CARS=<n> sh run-registers-920.sh <dock>` → the register car → `nohup sh run-ratchet-920.sh > ratchet-920.run.log` → HELD grep → `sh after-ratchet-920.sh <files> 3` (totals + capsule cars; the kit re-stamped) → `texts-920.draft.md` filled → `python3 fill-template-920.py` → `EXPECT_CARS=<N> nohup sh run-gate-920.sh > gate-920.log` → `EXPECT_CARS=<N> sh after-cas-920.sh` (chair-verify; the CAS of `claude/composite-r4`; the seal `landing-rewrite-8b-defense-<date>`; the payload; collect → the §920 ledger commit) → `rm HOLD-VITEST` → the memory START row → `docs/HANDOFF_CURRENT.md` refreshed (the pickup block). Read `$SC/RESUME-NOTE.md`'s §919 entries (09-09 07:5x–11:3x) for the exact shape and the tokens the texts need.

---

## 7. What you decide, what goes to a Fable sitting, what is the owner's

### 7.1 The Opus chair decides alone (record vetoably in the note)
- The order of launches within the plan; when to resume after a death; a block's rulings file that RESTATES existing laws; the cure targets and the banked refusal rows (they are the judge's and the refuters'); which spot-read findings are wiring rows; script bugs and their fixes (record the hazard in memory); the seat settings `markModel` / `judgeModel` within the owner's 09-11 ruling (refutation stays Fable — not a setting).

### 7.2 A Fable sitting decides (convene it: a Workflow of Fable agents with the question and the evidence, or a Fable session; record its rulings as a brief ADDENDUM)
- Any NEW LAW or writer bar; any correction to a ratified table; the reading of a block whose FAIL rate exceeds the threshold (a lever change); a disagreement between the refuters and the chair's own read; any change to the marker, refuter or judge INSTRUCTIONS (the owner's 15:1x directive gates efficiency changes on mastery); the skeptic fold's rulings before a landing.

### 7.3 The owner decides (never do; record as a proposal)
- Any git PUSH; the WALK; a migration, a schema or persistence shape, a public-API surface; deleting data; security posture; paid-surface behaviour; a NEW capability versus a repair; a key change on a SHIPPED surface (the STRAINED key's wage-less firing); the referent law over the engine's own strings (OW-20); the custom-content accessor (OW-22); lifting the one-lane rule; anything the owner has explicitly parked.

---

## 8. The hazards that bit (memory has each under the name given)
- A workflow result loses identity through `parallel()`: match by key (`a-workflow-result-object-returned-through-parallel-loses-identity…`).
- A short barrier cascades unless every barrier throws (`a-workflow-whose-agents-die-on-the-limit-cascades…`).
- A mass interruption at one second is a stream event; the runtime retries by key from scratch; the checkpoint law bounds the loss (`a-mass-interruption-of-in-flight-subagents…`).
- The usage limit kills every agent at once; the same session auto-continues; an account switch is a new session (`seamless-resume-directive`).
- A dock is never checked out, reset or stashed; a dead gate's stage is restored by `git show HEAD:`.
- The runner count is its own shell line; a whole-suite proof under load fails vacuously (`ps -r`); one focused test file at a time in a block dock.
- A test pin on drawn prose follows the draw (`tests/helpers/drawnProse.js`), never a literal.
- `tests/lint` whole is blind to `tests/domain`, `tests/copy` and the typecheck ratchets; a lane's acceptance names every gate family.
- The mechanical gate reads zero where Fable refuters read half: the gate's "in band" is a breach detector, never a licence; the refuters are the instrument.
- The plainer floor is not a regression; an inventory line is not a rewrite; the four faces differ in construction.
- The E2 red and the face-count pins are the declared reds; a NEW red is the block's.

---

## 9. Glossary (plain words)
- **Pool** — the set of sentences for one recorded state of a town (e.g. "walled and under threat"). **Variant** — one of the pool's sentences, under a stable number and an angle tag. **Face** — one of a variant's four wordings; a seeded roll picks one at render. **Block** — the pools of one page (`DS-DEF-2`). **Desk** — a section of the write-up (defense, general, economy, power, stressors, warFaith).
- **The annex** — `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, the file the pools live in; **the leaves** — the generated `src/data/dossierStateProse/*.generated.js` the projector builds from it.
- **The licence card** — `scripts/prose-licence-card.mjs`: what a pool's read licenses a face to claim. **The census** — `docs/content/wiring-census.json`: every pool's reads and its wiring status (RESOLVED / WIRING-UNRESOLVED).
- **The wave gate** — `scripts/prose-wave-gate.mjs`: the mechanical measure of a set against the bands (owned = the writers' grain). **In band / dry / banked** — a set that passes its owned measures / a round that moved nothing / a set retired by two dry rounds.
- **Dock** — a git worktree where one block or car is built. **Lane** — one running agent or workflow. **The chair** — you.
- **Refuter** — the Fable agent that tries to break each face against the laws. **Judge** — the agent that applies the keep/revert/cure rules. **Cure round** — targeted repair of failed faces. **Refusal row** — a face that stays as it is, listed, never trimmed.
- **Consist** — the blocks' commits assembled on one dock. **Register car** — the chair's commits that re-record the instruments moved by the consist. **Skeptic pass** — independent adversarial reads before a landing. **Landing / §n** — the product branch moved by CAS and the ledger row that records it. **Ratchet** — a count that may only move the declared way; **HELD** — a ratchet the run refused to move.
- **CAS** — compare-and-swap: `git update-ref <ref> <new> <expected old>`; a landing never overwrites a moved ref.
- **The two tables** — the entailment table (what a recorded word may imply) and the referent table (which thing a word refers to at each read's layer).
