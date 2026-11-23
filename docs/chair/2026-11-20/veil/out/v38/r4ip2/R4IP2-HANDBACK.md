# R4I-PAGE-2 HANDBACK (VEIL-38, chain B). STOPPED EARLY at the token budget, with what is left below.

Branch `lane/veil-38-2026-11-23-r4ipage2-wip` (local, never pushed), cut at fd7163ba6. Brief: `briefs/R4I-PAGE-2-BRIEF.md` (d8201ca8f).
Commits: 05ec8213b (S1), then O + S2 + G-partial (docs only).

## S1 — THE SWITCH'S ONE SALT: DONE (05ec8213b)
- `galleryVeil.js :: applyVeil(publicSettlement, veil, opts)`: optional `{ salt }`; absent, `readSalt()` as before.
- `criminalVeilSwitch.js :: presentCriminalGroupings`: ONE `readSalt()`, passed to both of its `applyVeil` calls. No other caller.
- `tests/security/criminalSwitchSalt.test.js` (+ `.shared.mjs`; manifest row `self-proving-meta`): the walker (+ its plant),
  212's text, the arm. RED FIRST with S1 unapplied (logs/s1-red.txt): 3 failed | 3 passed of 6; the arm 4 of 24 reads differ
  (Redwick, Quietford; DM off and on). GREEN: 6 of 6 (logs/s1-green.txt, re-run at the committed file).
- POOL ARM: `switch-offer.probe.jsx` + `switch-offer.sh <tree> <outdir> [pooldir]`. On the 140 (92 + 48): 280 reads, 0 differ
  from the reference, 840 groupings present (offer-140.txt). Its own red-first was NOT run (it would have reverted src under the
  running security gate); the in-tree arm's red stands for it.
- JUDGMENT (vetoable): the brief's literal "no `_gallery_veil*` has a salt parameter" is false of 212 as built: its six named
  salt carriers (`_gallery_veil_rekey_id`, `_rekey_ref`, `_rekey_at`, `_rekey_each`, `_rekey`, `_rekey_served`) take `salt`.
  The test shows instead: `_gallery_veil` and the three reads take none; `_gallery_veil` draws it
  (`salt text := gen_random_uuid()::text`); every salt-taker is one of the six, revoked from public, anon, authenticated, granted to none.
- The brief's expected greens: curateModeCriminalSwitch "no criminal part" (2) GREEN. criminalVeilSwitch births (c) NOT green:
  class (i) (G-CLASSES.md). criminalSwitchHandReach (12) NOT green: 12 of 14 red in the security run AFTER S1; unclassified.

## O — THE TONIGHT SHEET STOP: MEASURED (ORDER-STOP.md; no cure)
Cause `tonightSheet.js :: castWantOf`: `castHash(served person id, crisis, role)` picks the want line; not a sort. Served documents
equal on two reads modulo the bijection, order included: twin 140/140, server 140/140, twin = server 140/140. Printed views that
move (whole page rendered, ids normalised): ONLY the Tonight sheet, twin 39/140, server 44/140. Probe `order.sh`.

## S2 — gallery.test.js "a share marked with a veil renders through it": A STOP, NOTHING CHANGED
RED at af708f2fd (scratch worktree /home/user/wt/r4ip2-tip, never committed to; logs/s2-af708f2fd.txt) and at HEAD (logs/s2-head.txt),
the same assertion: line 620 `availableServices.criminal` has 0 rows, wanted 1 (the row `Contraband goods`, institution
'Black market', no such house; no person in the fixture). Not R4-IDS. The removing rule is not named (not traced).

## G — PARTIAL (G-CLASSES.md)
- The 34 non-security files AFTER S1 (logs/g-other34.txt): 14 red of 867 (16 before). Classes: (i) 13, (ii) 2 green, (iv) 1 (S2).
- tests/security WHOLE: RUNNING at the hand-back (`logs/g-security-run.txt`; full log /tmp/gate-tail.7402.log; started 00:28 UTC,
  mutex, --maxWorkers=2). 42 failing titles so far in g-security.txt. ONE classified: pgliteHookTimeoutRatchet (iv) STOP, caused by
  R4I-PAGE's regex `\(` at galleryVeilIds.pglite.test.js:205 (green at af708f2fd, red at fd7163ba6).
- NO RE-STATEMENT DONE. The 13 (i) and every security red are left.

## A — PARTIAL
- The chair's arm's LINK anchor (the ruling of 00:23): written, NOT RUN, so NOT COMMITTED as code: `A-link-anchor.patch` (anchors the
  link's ref to `refsOf(r.twins[0].doc)` and adds THE LINK ANCHOR TOOTH: a planted link first read, one reference to no card; it
  counts the self form passing it, the anchored form redding it, and the anchored form passing the clean reads). NOTE from reading:
  the present form's SECOND link read is judged against the planted first read, so it reds that plant there; the tooth counts that
  as `selfSecondReds`. Apply with `git apply`, then run the file alone.
- Not run: Tell3/4/5/8, galleryVeilIds, the harnesses, the walkers, `--check`.

## LEFT (not done): G's re-statements and security classes; A; ST (the stored arm's person-id probe); L (tests/lint whole); B
(build, typecheck, first paint). eslint on the S1 files: 0.

## Commands
- Security whole: `env -u GIT_DIR ... sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh npx vitest run tests/security --maxWorkers=2`
- O: `sh docs/chair/2026-11-20/veil/out/v38/r4ip2/order.sh <tree> <outdir> v28tpl [pooldir]`
- S1 pool arm: `sh docs/chair/2026-11-20/veil/out/v38/r4ip2/switch-offer.sh <tree> <outdir> [pooldir]`
- Lint: `sh scripts/gate-tail.sh npx vitest run tests/lint`
