# FRAME-4 · brief N1 — `frame2NamesRule`'s pool widened by its own fair rule (the chair's ruling (a), 2026-11-20 10:21 UTC)

Written 2026-11-20T10:33Z (`date -u`) by FRAME-4 on `lane/frame-4-2026-11-20`, after B9's merge (`2a95ecc4e`). One builder, one commit, one cause. Read whole before you edit: `CLAUDE.md`; `tests/domain/frame2NamesRule.test.js`; `tests/domain/tension/troubleWeight.test.js` (only to see where the framed-town count is proven: NOT here).

## The fact (measured by the integrator; re-measure it yourself first)

The test's assertion `expect(read.troubleCast).toBeGreaterThan(300)` counts the SENTENCES `troubleCast.js` composes that the test reads (a side's words, a face's reason, a cast person's reason on the sheet) over its whole born pool (calm AND in crisis: `castTroubleFrame` casts in crisis towns too). It does NOT count framed towns. Measured: 307 at `167d532b5` (before B9); 272 with B9 (W2 needs both powers: fewer frames); 336 at PER 12 with B9.

## The ruling (the chair's; vetoable by the owner)

Widen the test's OWN pool by its fair rule: `PER` 10 → 12 (144 towns). THE FLOOR STAYS 300 (never lowered). The comment carries the figures (307 at `167d532b5`, 272 with B9, the figure you measure after) and says what the floor counts (trouble-cast sentences read, not framed towns). CONDITIONS:
1. Its OWN commit, on top of B9's merge.
2. The crisis kinds cycle differently at PER 12 (`k = tier·PER + i` picks `stressTypes`): write in the commit body which kinds the test reads before and after (every kind, with its count of towns), and confirm NO crisis kind read at PER 10 is unread at PER 12. If one drops out, STOP and report it (do not add seeds by hand).
3. Every figure the test pins from its pool (the four `read.*` floors and the comments' figures; the breach lists' zeros; the `it.fails` on (C)) is re-stated BY MEASUREMENT in the same commit, named with before and after. A floor is never lowered; if another read would fall below its floor, STOP and report.
4. No other test's pool moves; no source file changes.
5. NOT: no new assertion on framed towns in this file.

## Gates

Every run to a file under `/tmp/claude-0/-home-user-settlement-engine/57c37100-4349-5103-b1f0-d2e44b1c9e20/scratchpad/N1/`; never through a pipe (`sh scripts/gate-tail.sh <command…>`); no GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any environment. Red first: the file at the base reds on the troubleCast floor (272); green after. Run: the file itself; `npm run lint` (errors 0).

## Commit

One commit by explicit path (`tests/domain/frame2NamesRule.test.js`), hooks on, never `--no-verify`; no push, reset, stash or checkout of another branch. Message `test(FRAME-4 · N1): frame2NamesRule's pool widened by its fair rule (PER 10 -> 12), the floor kept at 300`; the body carries the red and green runs, the kinds before and after, and every figure re-stated; it ends with:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1PrB8toGrEJtqXxojf
```

Final message: at most 150 words: the sha; the red and green counts; the kinds before and after; every figure before and after.
