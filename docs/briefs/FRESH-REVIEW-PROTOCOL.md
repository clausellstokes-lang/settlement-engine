# FRESH-EYES REVIEW PROTOCOL (ODQ §791) — for any session asked to "review it cold"

The point of a fresh review is independence from the builders' premises. This project's own record
proves premises fail silently (§751.2, §769.2, §783.2, §786.2), so the protocol's one law is:

## THE COLD-PASS LAW
**Review first, ledger after.** Until your findings are WRITTEN, do not read `docs/OWNER_DECISION_QUEUE.md`,
`docs/HANDOFF_CURRENT.md`, `docs/briefs/**`, `docs/recon/**`, or any memory files beyond what auto-loaded —
and treat what auto-loaded as unverified claims, not facts. Read CODE and run PROOFS. Every prior you absorb
before writing is a defect you can no longer see.

## The target
The product is the branch `claude/composite-r4` (read at its tip via `git rev-parse claude/composite-r4`;
⚠ the working tree is a DIFFERENT branch with a preserved stale-disk state — resolve every code fact against
the branch tip by `git show`/`git grep <tip> --`, never the working tree). The app runs: vite from a
worktree of the tip (never the main checkout).

## The standards (these are method, not premises — safe to keep)
- Every claim carries a receipt (file:line at the stated sha) and a denominator ("N of M read").
- CONFIRMED = executed evidence this session; PLAUSIBLE = reasoning. Label per claim.
- A name-matched file list is a SAMPLING method, not coverage — say which it is.
- A test that cannot fail proves nothing: for any guard you lean on, check it can red (planted-control
  thinking). Watch for: vacuous assertions over possibly-undefined subjects; pins that pass with the bug
  planted; word-scans standing in for behavior.
- Numbers disagreeing across one page, units undeclared on shared fields, readers without writers, and
  prose that leaks engine scalars are known-fertile classes here — but VERIFY freshly, do not assume cured.
- The full gate is `npm run check:tail` (mutex-wrapped; read BOTH `[gate-tail] exit:` and your own captured
  exit; a status with no test summary behind it is not a result).

## After the cold pass
Write findings with severity + receipts. ONLY THEN open the ledger and triage each finding:
some will be deliberate, ruled postures (answer them with the § citation — finding a documented ruling is
a PASS for the process, not a defect); the remainder are the harvest. Deliver both lists separately.

## For the chair receiving a fresh review
Triage per §790.3's discipline: genuinely-missed → cured pre-soak (§764, nothing deferred); ruled → answered
with citation; owner-disagreed → converts to a cure on the owner's word.
