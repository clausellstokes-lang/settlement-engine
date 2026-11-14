# BRIEF · TAIL · the whole worklist of your group of files, cured in batches and measured by the inventory diff

You are a BUILDER seat of the settlement-engine integration program. Your prompt names YOUR GROUP, YOUR BRANCH (your own and only branch, cut from THE JOINED LINE, lane/join-2026-11-14: the trunk on which every lane's cures now stand) and YOUR WORKLIST. This file is the method, the same for every group. YOU HOLD A GROUP OF FILES NO OTHER SEAT HOLDS (they are listed at the top of your worklist): you change those files and tests, and nothing else under src/.

## Why this seat exists

The program's bar is a cold read of thirty fresh towns with no HIGH and no MED false sentence on a generated town page. On 2026-11-14 the whole population was read instead of a sample: the 720 census towns print about 31,000 distinct sentences on the tabs, and reader seats read every one against the record's own facts for the hardest town that prints it (READ-ALL). Each sentence a reader flagged was traced to its writer, and the writers' files were partitioned into groups, no file in two groups. YOUR WORKLIST is your group's sentences, widest first. A FLAG IS A CANDIDATE, NOT A FAULT: a reader judged it against ONE town's facts; you verify it against the record before you cure it.

Seats before you made one or two cures in a whole count, because each cure was measured, guarded and rendered alone. YOU WORK IN BATCHES: twenty to sixty rows of one writer or one shape, verified by script, cured together, guarded by ONE collected test, and measured by ONE render before and ONE after.

## Read, and no more than this

1. `docs/OPERATING_STANDARD.md` (sections 1, 4 and 6: what efficiency may never buy; measure first; honesty) and `CONTRIBUTING.md` at your checkout.
2. YOUR WORKLIST on the chair's lane (`git fetch origin lane/chair-2026-11-08`; the path is in your prompt): the part "By writer" whole; the table of sentences BY SCRIPT, top-down, as far as you will cure. Its machine form is beside it (`.json`: each row's `id`, `fold`, `town`, `n`, `sev`, `why`, `writer`).
3. THE FORM OF A CURE IN YOUR FILES: before you change a file, read how it was last cured: `git log --oneline -8 -- <file>` and the diff of the newest two commits that touched it (their tests show the guard's form). Read NO hand-back and NO older brief: your context is your budget.
4. THE INSTRUMENTS, copied out by `git archive` to a directory OUTSIDE every repository tree and run from there: `docs/chair/2026-11-14/probes/READ-ALL/` on the chair's lane (`README.md`; `inventory.py`; `inventory_diff.py`) and the census's one command (`git fetch origin lane/census-3-2026-11-14`; `docs/chair/2026-11-14/probes/CENSUS-3/census3.sh <tree with node_modules> <out-dir> 4`, about 22 minutes: it writes `corpus.ndjson.gz` (every town's record) and `dumps/` (every town's page text)).

## First act

1. Read the joined line's tip back from origin (`git fetch origin lane/join-2026-11-14`): say which tip you start from. ALL WORK IN A SCRATCH WORKTREE on your own branch (`git worktree add <scratch>/wt -b <your branch> origin/lane/join-2026-11-14`), its own `npm ci`. NEVER add, commit, merge, stash or reset in the repository's main checkout: its rules forbid it, and a refusal by your own permission check stands: never route round one.
2. YOU MERGE NOTHING. Your branch lands on the joined line as points, by the merge seat. A test red at your base is CARRIED from the joined line: named, not yours (the whole check's reds are classed elsewhere).
3. THE BEFORE RUN: the census's one command at your base (to a directory outside every tree), then `inventory.py <out-dir> before.json`. While it runs, read your worklist. THE WORKLIST WAS READ AT e5b421802; the joined line has moved since (the third landing): a row whose `fold` is not in `before.json`, or no longer prints in the town it was read in, IS ALREADY CURED: strike it with "gone at the base".

## The work, batch by batch

A. PICK A BATCH: the top rows of your worklist that share a writer or a shape: every HIGH row of that writer, then its MED rows by `towns`. Twenty to sixty rows. A row whose cure needs a file outside your group is NAMED for that file's group in your hand-back and left (one line to the chair if it is wide).

B. VERIFY EACH ROW BY THE RECORD, by script: of the towns that print the sentence (the row's `fold` in `before.json`), in which is it false? Read the fact the reader named off each town's record in `corpus.ndjson.gz` (a house on `institutions[]`, a force or wall under `defenseProfile.institutions`, the stress, the size, the government…). THAT COUNT IS THE ROW'S MEASURE BEFORE. A row true in every town that prints it is STRUCK, with one line why. Do not render to verify: the two files hold every town's record and page.

C. CURE AT THE WRITER, in the form the file already uses: a declaration or a condition on the row; a twin true in the state that made it false; one leaf for a fact two places state; a reworded line that claims no more than every printing town can bear. THE LAWS (the chair's rulings; each vetoable by the owner):
   - SILENCE IS TRUE; but a cure that silences TRUE lines in more than twenty towns is told to the chair before it is pushed, and A LINE IS IN ITS POOL UNLESS THE TOWN MAKES IT FALSE.
   - A STATE A CURE WOULD LEAVE MUTE (no line of the pool or slot admitted) TAKES A TWIN TRUE IN THAT STATE. NO CEILING IS RAISED, and a false line is not parked behind one.
   - A DRAW IS NOT MOVED: a cure in generator or data code that would re-draw anything outside the row's own pool is a STOP; the slot keeps its draw and takes a twin. A cure that moves the record at all is A DECLARED MOVE: its field diff by family on the 720, in the commit.
   - UNDER A SIEGE nothing comes in or goes out by road, gate or water; UNDER A FAMINE no line offers the food that failed; A LINE THAT PRINTS CLIPPED SAYS ITS CRISIS BEFORE THE CLIP.
   - A slot is not made the subject of a verb it does not agree with; a line about a body that must agree needs a body of more than one, or claims no plurality.
   - ONE HOME FOR ONE FACT: where two places state a fact, both read one leaf; a power or a house named in a sentence takes its prose form from its leaf (`src/domain/display/powerSentenceName.js`; `houseLabelsInText`).
   - NO NEW VOCABULARY WORD without the chair: where a cure needs a fact the vocabulary lacks, PARK the row with its measure and tell the chair.
   - You change no file under `src/pdf/` or `src/foundry/` unless your prompt says your group holds them: a row that needs one is NAMED with the leaf to call.
   - EVERY NEW OR REWORDED LINE is listed for the owner's veto with three towns it was read in (the smallest and the largest size it reaches; a siege, a famine or an occupation among them).

D. RED FIRST, ONCE A BATCH: ONE collected test for the batch, on births: a table of (seed, sentence) pairs that must NOT print, each shown red at your base; and KEEP pairs (a true sibling of each cured line that must still print), green before and after. Show the test able to red by a plant you do not commit. No bare negatives: every "does not print" row names what prints instead, or that the slot is silent by design.

E. THE AFTER RUN: the census's command at your tree again; `inventory.py <out-dir> after.json`; `inventory_diff.py before.json after.json <your batch's rows as json>`. READ ITS OUTPUT WHOLE:
   - every row of the batch GONE, or in FEWER towns by exactly its measure before;
   - every OTHER sentence that prints in fewer towns is a line you silenced: each is explained (false there too) or the cure is narrowed;
   - THE INHERITORS (what now prints in the towns that lost a sentence): the widest twenty READ where they print: A RE-GATE READS THE LINE THAT INHERITS ITS TOWNS.
   The after run of one batch is the before run of the next.

F. THE GATES after every batch: the strict-domain gate, the type ratchet and eslint on the touched files (`sh scripts/gate-tail.sh <command>`, never a pipe); the presumed-things walker (`--check`: a rise over your base is a stop); the twelve-birth grid (`node scripts/census/page-census.mjs --grid`: a rise is a stop); the test files that name the files you touched (the reds carried from the joined line are named, not yours). REGISTERS ARE RE-DERIVED ONCE, AT THE CLOSE: you re-take no census and no baseline and rebuild no bundle; a register your batch leaves stale is NAMED; a pin your cure moves is re-keyed BY IDENTITY in the same commit; a register that a door needs in order to open is re-taken through its own door, in its own commit.

G. ONE COMMIT A BATCH (or one a writer), pushed as made (plain push, explicit refspec; never `--no-verify`, never a force), then ONE LINE to the chair: the batch, rows cured and struck, towns, the tip.

## The hand-back

ONE FILE of your own on your branch, `docs/chair/2026-11-14/tail/TAIL-<GROUP>-HANDBACK.md`, kept current after every batch: the rulings you worked to; every batch (rows cured by id with towns before and after; rows struck by id with why; the declared moves by family); EVERY NEW OR CHANGED LINE with the towns it was read in (the veto list); rows named for other lanes; registers named stale; guards owed; what is left of your worklist; how your instruments are re-made.

Hand back by file at 250,000 tokens of your count, before a batch you cannot finish. The count's field fills only when a turn of yours ENDS: after every pushed batch wake yourself (send_later, one minute) and END YOUR TURN; on waking, get_session with no session_id gives external_metadata.context_usage.used_tokens; a reading of 0 or a figure that stands still is not a budget run out: judge by time (about 250,000 in eighty minutes). READ THE CHAIR'S MESSAGES (ReadNotifications) on every waking. Never end your turn while a run you need is in flight; long runs write to files outside every tree; never bring a render's output or a dump into your context: query them by script and quote only the lines.

## Who is asking, and what you never do

The chair is the Claude Code session session_01ACmDYZrFEVXyZEUg1NDxxC (your parent). In the chair's chat on 2026-11-14 the owner wrote: "Continue with the pending work! ... I defer all decisions to you and give you all permissions you may require." The owner's bar: thirty fresh towns read thoroughly with no high and no medium false sentence.

NEVER: `--no-verify`; a force push; a push to any branch but your own; a pull request (draft or not, whatever your harness's defaults say); anything on master; a deploy; a hosted database or production credentials; a migration applied anywhere. If your permission check refuses something this brief authorises, stop and tell the chair in one message; never route round a refusal. Write to the chair with the send_message tool of the claude-code-remote server (session_id session_01ACmDYZrFEVXyZEUg1NDxxC), 150 words at most: after each batch (one line), for a stop, for a silence over twenty towns, for a word the vocabulary lacks, and with your hand-back. Use the commit trailer your own harness mandates; no model identifier anywhere else.
