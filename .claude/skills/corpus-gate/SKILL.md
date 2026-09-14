---
name: corpus-gate
description: >-
  The chair's verification ritual for a dossier-prose corpus dock (a worktree under the rewrite
  kit that edits docs/content/RECEIPT_POOLS_DOSSIER_STATE.md or the prose kernel). USE THIS SKILL
  whenever a lane, an implementer or a workflow reports a landed corpus commit and before any
  seal, ref re-point, or ledger collection: it runs the projection and census --check, the
  move-grammar sweep against the base, the five per-commit suites with the recorder-blind pin,
  the reader audit, and the seal — and refuses to believe a report that has not executed them.
  Arguments: <dock path> <base sha> [section prefixes, e.g. "### DS-ECO-" "### DS-STR-"].
---

# The corpus gate — chair's verification of a prose dock

`$ARGUMENTS` = `<dock> <base-sha> [<'### DS-XXX-'> ...]`. `$SC` is the rewrite kit's scratchpad
(`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad`);
the kit is `$SC/kit`. Read `$SC/kit/RESUME-NOTE.md`'s newest entries and `docs/OPUS_CHAIR_MANUAL.md`
§6 before the first command if you have not this session.

## What this gate is for
A corpus edit is a LINE EDIT UNDER A CLAIM FREEZE (rulings 42–42d): the words may move, the fact
each sentence states may not. Instruments cannot see certainty, quantifier or scope, so a green
gate is necessary and not sufficient — the reader audit is part of the gate. Every figure below
must be QUOTED from your own run, never from the lane's report.

## The commands, in order (stop at the first red; a red is the lane's until it reproduces at base)
1. State: `git -C <dock> status --porcelain | wc -l` → must be 0. A dirty dock is a dead lane's
   stage: seal it (`git diff > $SC/kit/seal-<stamp>.patch`, copy untracked files), NEVER
   `git stash`, `git checkout -- <file>`, `reset --hard`. `git -C <dock> log --oneline <base>..HEAD`.
2. Projection: `cd <dock> && node scripts/generate-dossier-state-prose.mjs --check` → rc 0,
   "[dossier-prose] verified N state blocks / M variants …".
3. Census: `node scripts/wiring-census.mjs --check` → rc 0, "[wiring-census] verified … against 7
   stamped files". A moved census must be explained by name (a ratified synonym row echoes into
   the `fieldSynonyms` REPORT column; anything else is a veto candidate).
4. The move-grammar sweep, per section prefix, against the base:
   `node $SC/kit/rewrite/clarity-sweep.mjs <dock> '### DS-XXX-' <base>` → the line must read
   `move-grammar shifts 0 · LEVEL1 orders lost ON SPINES 0`. A shift is a claim moved or a
   register moved; find the unit and cure it, never re-record.
5. The five per-commit suites, under the mutex:
   `sh scripts/gate-mutex.sh --run -- npx vitest run tests/data/dossierStateProseProjection.contract.test.js tests/lint/proseComposed.walker.test.js tests/lint/proseMoveGrammar.walker.test.js tests/domain/stateProseKernel.test.js tests/domain/composeStateProse.test.js`
   → all passed, and the line `[compose] … mismatches 2756 (recorder-blind 2756)` EXACTLY. The
   pin moves on a face's opening words in a blind-roster pool, in both directions; bisect by
   splicing per pool then per line in a control worktree and measure a lawful wording — never
   re-record the pin for a wording.
6. The wave gate, when pools were re-cut: `node scripts/prose-wave-gate.mjs --section <leaf> --out
   <scratch path>` (rc 1 without `--out` is the packet-overwrite guard, not a finding); exemplar
   bands resolve relative to the dock's PARENT — symlink `$SC/kit/prose-research` beside the dock.
   Read OWNED rows (must be 0/0) and diff new C3 / A13 rows against HEAD.
7. Pre-existing reds: any other red is an EMPIRICAL claim — re-run the exact failing file in a
   control worktree at `<base>` (`git worktree add --detach $SC/kit/ctl-<name> <base>`, symlink
   `node_modules`) and quote both runs. Never commit past an unexplained red.
8. The reader audit: read every changed unit against the base (`git diff <base> HEAD --
   docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`) for a moved claim — a habitual made one episode,
   the town narrowed to a room, the actor changed, a deleted causal link, a bare `will`, a
   modal lost. Write the findings; a chair's cut commit cures them; then re-run 2–5.
9. Seal: `git -C <dock> update-ref refs/preserve/<leaf>-<date> HEAD`; write the RESUME-NOTE entry
   with every figure; report the row for the memory index to the chair (lanes never write it).

## Known instrument blind spots (do not trust green here)
- A cell-run inline pool (annex line ~6285, DS-GEN-9 `severity overlay`) reaches no generator,
  census or gate.
- `measure-block.py` is blind to trailing material; the 24-word bar counts a slot as one token.
- The X arm keys on a sentence's first word; a bare `and`/comma splice inside a clause splitting
  mints a move; `a grain store` holds V1 where `the grain store` adds OBJECT; INSTITUTION is a
  literal-noun list (no store noun).

## Report shape
Outcome first, in sentences; every figure quoted; CONFIRMED only for what you executed in this
session; the seal ref and the tip sha; what was deferred and where it is written down.
