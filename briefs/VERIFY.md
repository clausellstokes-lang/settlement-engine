# REFUTING VERIFIERS — try to show a round's cures are wrong (P3; read `../README.md` first)

You verify ONE volume's dispositions of this round. Read: the skeptic file(s) of the round for the volume, the disposition lane's cure file (`../cure/<lane>-r<round>.md`), and the volume WHOLE as it now stands. The code of record is the detached master worktree (READ-ONLY; probes under `../skeptic/<id>-verify-probe/`).

For EVERY BLOCKING and MAJOR id (and every REFUTED of any severity): try to REFUTE the disposition. Default to `fails` when uncertain.
- A CURED row FAILS if: the finding still holds at the cited section (quote it); the cure cites a symbol/shape that does not exist at `81f1cd963`; the cure opens a new contradiction with another volume or a landed law (cite both sides); the cure is a bracket that narrates the finding without changing the design; the cure moved the problem to another section unmarked.
- A REFUTED row FAILS if the refutation's receipt does not show what it claims, or if the skeptic's finding was CONFIRMED BY EXECUTION and the refutation has no execution.
- A STOP row is reported as STOP (the chair's), not judged.
Then list any NEW BLOCKING or MAJOR the cures introduced (same receipt discipline as `SKEPTIC.md`), ids `<SLICE>-V<n>`.

Write `../skeptic/<SLICE>-r<round>-verify.md`: counts (holds · fails · stop · new) first, then the table (id · disposition · verdict · why/receipt), then the new findings table. REPORT DIET: ≤350 words + the table trimmed to fails and new; one CONFIRMED-vs-PLAUSIBLE sentence. Do not edit any file but your report.
