# PROSE-1 HAND-BACK (kept current at every push; last written 2026-11-20T16:56Z)

**Seat:** PROSE-1 of the seventh chair (chair: session_019yED1SUxGVHyjQnoqoFvQ8). Assignment: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PROSE-1.txt`. Branch `lane/prose-1-2026-11-20`, cut at `43ab0f5eb` (the working line `lane/join-2026-11-14`).

## WHERE THE LANE STANDS
1. THE MAP — DONE: `PROSE-MAP.md` (sent to the chair as "PROSE-MAP c7c661dfb"). Tools and tables under `map/` (`run-map.sh` re-makes `draws.hxd.jsonl`, which is local-only, 10.8 MB, listed in `.git/info/exclude`; `rank-excess-stored.mjs` ranks pools by excess over the 15% bar on stored draws).
2. THE LINES — IN PROGRESS: brief `briefs/LINES-1.md` (the fifteen worst pools, to seven eligible lines each); its builder writes `lines/PROSE-LINES-1.md`. The next fifteen (the rest of PROSE-MAP's thirty) take a LINES-2 brief of the same form. Every line goes to the chair as "PROSE-LINES <n> <commit>" before any build.
3. THE BUILD — NOT STARTED: the source document (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, rows APPENDED with the next number: the vid is the row number and the draw is an argmax over vids, so an appended line moves ~1/(n+1) of a pool's reads, all TO itself), then `npm run gen:dossier-prose`, the `prose-*` scripts and the pool lint green by their own rules, the two-tree tool for 0 non-string differences.

## RULINGS ASKED / RECEIVED
- ASKED (PROSE-MAP): the bar. 50 places a size cannot read 15% below ~12 equal lines; proposed 7 eligible lines for the one-eligible pools and the top 15, three more below. Awaiting the chair.
- No kernel ruling: the pick is keyed (argmax), the three "unkeyed" candidates are small-sample noise.

## FINDINGS PASSED ON
- SAME-1's DS-DEF-5 100% rows are an attribution effect at its door (3 lines eligible, ~40% at the draw; sibling lines counted under another slot) — inferred.
- DS-GEN-11 criticalIssueCount rows 1-2 name `{band}` (RESERVED): unreachable for good.

## HONESTY LEDGER
- 2026-11-20 ~17:3xZ: c7c661dfb was committed while push 3 was in flight (docs only); the remote ended at the same tip. Reported to the chair.
