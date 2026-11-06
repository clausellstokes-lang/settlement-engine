# BRIEF — RUNG-2 LANDING, PHASE D: THE STALE NOTES AND THE DENIAL SENTENCE (lane RUNG2-D, 2026-11-06)

Seat: Opus 5.5, builder. Chair: Fable 5.1, cloud session `01FE9mEvGxnFx6WTBkEC6ie9`, under the owner's full delegation. You send no messages; your report is the hand-back.

## 0. Where you work and the rules

- Worktree `/home/user/se-rung2`, branch `lane/rung2-landing-2026-11-06` at `04f0606c1` (phases A–C on it; read `docs/census/COMPOSE_2026-11-06.md` §7–§9 and `docs/SOAK_10000_RUNG2E_2026-11-06.md`). `node_modules` is a symlink; never `npm install`; never edit `package.json`/`package-lock.json`.
- 4 cores shared with two sibling seats: targeted vitest only; corpus loops at `--workers 2`; never `npm test`, never `npm run check`; never the 10,000 (the chair runs rung 2F on your tip).
- Never read a gate through a pipe (redirect to a file under `/tmp/claude-0/-home-user-settlement-engine/91098d1e-536b-53ea-a385-88e9fe415a85/scratchpad/` and read the exit code there). No dumps. Read WHOLE every source file you change. Write nothing into `/home/user/settlement-engine`.
- Commit by explicit paths, one cause per commit, receipts in the body, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9`
- Push as transport after each unit (`git push -u origin lane/rung2-landing-2026-11-06`); never another branch; never a pull request. Stop at about 300k tokens of your own context, committed and pushed.
- Read first: phase C's unit-2 measurement in `docs/census/COMPOSE_2026-11-06.md` §9 (the four seeds, the two mechanisms), `docs/census/CHAIR_RULINGS_2026-11-05.md` (R-AU "at the site", R-Q, R-T), and the self-check's home (`src/domain/facts/` — the presumption ledger and the birth self-check that writes `cert:false-presumption`; read whole).

## 1. The chair's rulings (each vetoable by the owner)

**R-D1 — BOTH cures, two causes, two commits.** Phase C measured that the six `cert:false-presumption` notes on rung 2E are STALE: (i) in `soak1k-1185`, `-1221`, `-2595` the first economy pass noted the 'no walls' twin, `economyReconcilePass.js` re-derived the economy after walls were added, the record prints the original line with walls true, and the replaced pass's note survived in the presumption ledger; (ii) in `soak1k-5589` the baseline conflict was resolved three times by `buildGovernanceLabels` and each time overwritten by the siege narrative, so neither twin prints and three notes survive.
- **Unit 1 (cause: "a replaced pass's notes leave the ledger").** When a pass re-derives a block, its notes REPLACE the earlier pass's notes for that block in the presumption ledger — the ledger holds one note set per block, keyed by the block the pass owns, never an accumulation across passes. Red-first on the three walls seeds through the self-check (red at the parent: 3 notes; green after: 0), and a planted test with a two-pass block. Births byte-identical (prove with a scratch hasher over the 525 and the 60: 0 move).
- **Unit 2 (cause: "a set is resolved only where it prints", R-AU).** `buildGovernanceLabels` resolves the baseline-conflict sibling set only at the site that prints it; a site the siege narrative overrides does not draw the set and writes no note. No new roll and no removed roll where the line DOES print (prove: the 1,000's governance labels byte-identical where the baseline line prints; count the births where a resolution is skipped). Red-first on `soak1k-5589` (3 notes → 0).
- Then the 1,000 (`--count 1000 --workers 2`): `cert:false-presumption` 0 and every other class unchanged (the table before → after); the four seeds green.

**R-D2 — the denial sentence reads the block's own operations (F9's law extended).** On `soak1k-1801` the Defense tab prints "No criminal infrastructure has been identified" directly under religious fraud and informant networks. A religious conversion's crime patterns ARE criminal operations the block lists, so the denial is false beside them — exactly the contradiction F9 cured for the survival-crime line (phase C's 3a: "the survival-crime line now also reads the block's listed operations"). Find the writer of the denial sentence (read whole), make it read the same listed operations (F9's lists) and print the denial only where the list is empty; red-first on `soak1k-1801` (red at the parent: the denial beside two listed operations); count on the 1,000 the denials printed beside a non-empty list before → after; births byte-identical if the writer is display, else count the goldens (re-record nothing). Add the case to the soak battery's `A-06` reader if its phrase list misses it (so the next rung reads it), red-first with the planted screen text.

## 2. The hand-back

- A section appended to `docs/census/COMPOSE_2026-11-06.md` ("RUNG-2 LANDING, PHASE D") with the three units' receipts, the counts, the goldens.
- Your final message: at most 300 words plus ONE table — outcome first; what the chair must rule; one CONFIRMED-vs-PLAUSIBLE sentence; the tip sha and whether it is pushed.
