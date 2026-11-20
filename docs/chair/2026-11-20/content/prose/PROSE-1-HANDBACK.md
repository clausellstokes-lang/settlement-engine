# PROSE-1 HAND-BACK (kept current at every push; last written 2026-11-20T17:13Z)

**Seat:** PROSE-1 of the seventh chair (chair: session_019yED1SUxGVHyjQnoqoFvQ8). Assignment: `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/PROSE-1.txt`. Branch `lane/prose-1-2026-11-20`, cut at `43ab0f5eb` (the working line `lane/join-2026-11-14`).

## WHERE THE LANE STANDS
1. THE MAP — DONE: `PROSE-MAP.md` (sent to the chair as "PROSE-MAP c7c661dfb"). Tools and tables under `map/` (`run-map.sh` re-makes `draws.hxd.jsonl`, which is local-only, 10.8 MB, listed in `.git/info/exclude`; `rank-excess-stored.mjs` ranks pools by excess over the 15% bar on stored draws).
2. THE LINES — TWO FILES WITH THE CHAIR: `lines/PROSE-LINES-1.md` (6a33026e8; 15 pools, 56 lines + spares; brief `briefs/LINES-1.md`) and `lines/PROSE-LINES-2.md` (63665b37a; 20 pools, 81 lines; brief `briefs/LINES-2.md`), each read whole by PROSE-1 with its repairs marked in place. Counts follow the chair's bar (17:00 UTC: a pool carries about reach/0.15 eligible lines a size; `map/rank-reach.mjs`, `map/RANK-REACH-ALL.md`: 120 of 238 stored pools over, 263 lines clear them all). The rest of the 120 pools would take LINES-3/4 of the same form, after the chair's read of 1 and 2. OPEN QUESTIONS AT THE CHAIR: DS-ECO-6's audience (lines 6-11 unmarked like #5, or dm-only); DS-FTH-2 held to one new line by `tests/lint/faithTeaserLicence.test.js`; LINES-2's 17.7 (dm-only?).
3. THE BUILD — NOT STARTED: the source document (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, rows APPENDED with the next number: the vid is the row number and the draw is an argmax over vids, so an appended line moves ~1/(n+1) of a pool's reads, all TO itself), then `npm run gen:dossier-prose`, the `prose-*` scripts and the pool lint green by their own rules, the two-tree tool for 0 non-string differences.

## RULINGS ASKED / RECEIVED
- RULED (chair, 17:00 UTC): the bar is over ALL places of a size; a pool carries about reach/0.15 eligible lines at each size; measured on 150 places a size, up to 20% passes. One-eligible pools first. DS-GEN-11: lines without {band}. No kernel change. A line eligible only by a hideable fact is dm-only or unwritten; a calm place stays calm.
- No kernel ruling: the pick is keyed (argmax), the three "unkeyed" candidates are small-sample noise.

## FINDINGS PASSED ON
- SAME-1's DS-DEF-5 100% rows are an attribution effect at its door (3 lines eligible, ~40% at the draw; sibling lines counted under another slot) — inferred.
- DS-GEN-11 criticalIssueCount rows 1-2 name `{band}` (RESERVED): unreachable for good.

## HONESTY LEDGER
- 2026-11-20 ~17:3xZ: c7c661dfb was committed while push 3 was in flight (docs only); the remote ended at the same tip. Reported to the chair.
