# PLACE-2 MEASURE brief — the page census's P3source rise (0 banked → 3)

Written by PLACE-2, `date -u` at writing: 2026-11-20T20:18Z. A measurement only: you change NOTHING under `src/`, `tests/` or `scripts/`, and commit only your report.

## The question (the chair, 20:17 UTC: answer in one message)
At PLACE-1's merge (`lane/place-1-2026-11-20` at 25f29b33a; the safetyDesc unit merged as 95a9887e1) `node scripts/census/page-census.mjs` reported "Page census RED: P3source rose 0 to 3" on three places under siege: `r2s-under_siege-hamlet-2`, `-thorp-1`, `-thorp-2`. PLACE-1 says it is not the lane's (the three born documents are byte-identical before and after its unit; the tool notes 74 at the base). Answer three things, each with its receipt:
1. **What P3source reads**: its row in `scripts/census/page-census.register.json` ("reliance on magic stated with neither a practitioner nor a named source", reader CROSS, base 74, banked 0); find the code that counts it (grep the page-law helpers `tests/helpers/pageLaws/` and `scripts/census/`), read that function WHOLE, and quote, for each of the three places, the printed text it flags and what it found missing.
2. **Is it red on the working line's own tip?** Run the page census on `origin/lane/join-2026-11-14` (8196e5712 at 20:17) in its own worktree (`git worktree add <scratch>/line 8196e5712`; symlink `node_modules` from `/home/user/settlement-engine`, the manifests are identical) and on 25f29b33a; report P3source's count at both, and at a331a4a19 (the safetyDesc unit's base) if the two differ.
3. **Whose is it?** If the line is red too: the commit that raised it (bisect P3source between the banked commit and the line's tip, the tool's own count as the test) and the lane that owns that commit (its subject and branch). If only 25f29b33a is red: what on `lane/place-1-2026-11-20` that is not on the line moves it.

## Rules
Heavy runs through `sh scripts/gate-mutex.sh --run -- <command>`; every run's output to a file, read by its count lines; never a pipe for a verdict. Never the whole suite. No GIT_* variable in the environment of a test run. Remove your worktrees when done.

## Output
`docs/chair/2026-11-20/content/place/P3source-MEASURE.md`, committed alone on your branch (`place-2/p3source-measure`, cut from 25f29b33a), never pushed. Final message, at most 150 words: the commit; the three answers in one line each; CONFIRMED vs PLAUSIBLE.
