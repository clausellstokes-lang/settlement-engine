# R4I-PAGE-3 — brief (R4-IDS's twin, third builder; VEIL-38, chain B). WINDOW: a context of 1,000,000 tokens; ITS BUDGET about 250,000 (stop there). WALL TIME: about 2.5 hours. READ WHOLE: this brief; `briefs/R4I-PAGE-2-BRIEF.md` (its rules, WHERE YOU RUN and LAWS bind you as written, with the names below); `out/v38/r4ip2/R4IP2-HANDBACK.md`, `G-CLASSES.md`, `A-link-anchor.patch`; `tests/security/personIdBijection.shared.mjs`. Every other file is read by grep, or as one test's body when you re-state it. NEVER 212, its rollback, the registry or `registry.json` (beyond a grep).

Written by VEIL-38 on 2026-11-23. The owner may veto it. It continues R4I-PAGE-2, which stopped at its budget with S1 done (05ec8213b, merged into the -wip). Its measures are O (the Tonight sheet's want line, a STOP before the chair) and S2 (red at the tip: not this unit's). Its G is partial.

## WHERE YOU RUN
- Worktree `/home/user/wt/r4ip3` on the LOCAL branch `lane/veil-38-2026-11-23-r4ipage3-wip`, cut at b088fcfc5. The seat makes it; `node_modules` is a link.
- Do NOT touch `/home/user/wip`: the seat's pool reads it. Do not touch `/home/user/wt/r4ip2`: R4I-PAGE-2's `tests/security` run may still be going there; its full log is `/tmp/gate-tail.7402.log` and its summary `out/v38/r4ip2/logs/g-security-run.txt` IN THAT WORKTREE.
- The box is busy: the pool uses four cores until about 01:30 UTC. Run pglite files with `--maxWorkers=1`, and heavy runs through the gate mutex.

## ITEMS, IN ORDER (each its own commit; `R4IP3-HANDBACK.md` in `out/v38/r4ip3/` current at every commit)

### G1 — RE-STATE THE 13 CLASS (i) PINS OF THE NON-SECURITY FILES (`G-CLASSES.md`'s table)
- The files: `tests/domain/display/publicSafe.test.js` (7), `tests/domain/display/criminalVeilSwitch.test.js` (VR34 (b); VS1 (a)-(e)), `tests/components/people6InstitutionFaceLinks.test.jsx` (2) and `tests/lib/partyLinkClient.test.js` (2).
- Each is re-stated MODULO THE READ'S PERSON-ID BIJECTION AND NOTHING ELSE. Use `unkeyPeople` / `canonPeople` / `bijectionTeeth` from `personIdBijection.shared.mjs` (a test in `tests/domain`, `tests/lib` or `tests/components` may import it by relative path), or find a card by a stable non-id field it already holds (its name) where the test means "this person".
- The guard keeps every other byte it held. Where two reads are compared whole (partyLinkClient), compare them modulo the bijection AND add tooth (v): the two reads share no person id.
- Run the FIVE TEETH per re-stated guard: (i) a reference that does not follow its card reds; (ii) a stored id served anywhere reds; (iii) a changed non-id byte reds; (iv) the re-key is a bijection within a read; (v) two reads differ.
- VS1 (c) compares two `applyVeil` copies byte for byte. Re-state it by the bijection, or give the two calls one `{ salt }` only if the test reads the curate switch's own comparison (the owner's page; say which).
- `gallery.test.js` S2 stays as it is (not this unit's; the chair is told).
- Re-run the 34 files of G once, to a log: 1 red (S2) is the target.

### G2 — `tests/security` WHOLE, CLASSIFIED
1. Wait for R4I-PAGE-2's run in `/home/user/wt/r4ip2` to end (its exit line in `logs/g-security-run.txt` there, or `/tmp/gate-tail.7402.log`; read by tail and grep only).
2. Take its failing titles. Classify EVERY one by G's four classes in `out/v38/r4ip3/G-SECURITY.md` (file, title, class, the line that pins, the cure).
3. The known families to read by cause: `criminalSwitchHandReach` (12, NOT green after S1), `galleryVeilHandRows` (14; one is (iii), E136 (e)'s stale pin, red at af708f2fd), `galleryServerVeil` (11), `galleryRosterChoices` (2), `galleryVeilCures` (2), `shareRenderTwice` (DOM ids `dossier-npc-npc-<re-keyed>`: (i); its Tonight sheet's want line: O, the chair's STOP, NOT cured).
4. Re-state every (i) as in G1. Name every (iv) as a STOP with its cause, and do not cure it.
5. `pgliteHookTimeoutRatchet` is a (iv) STOP before the chair. The seat relays the ruling; until then do not touch it.
6. Re-run each file that reded, until it is green but the (iii) row, the O row and the STOPs.

### A — THE CHAIR'S ARM'S LINK ANCHOR (ruling 40.1 (a)), RED FIRST
`git apply out/v38/r4ip2/A-link-anchor.patch` (written by R4I-PAGE-2 and NOT RUN), read it, then run `tests/security/galleryVeilIds.pglite.test.js` alone. The tooth must show:
- the present self form PASSES the planted wrong link read (one reference of the link's first read pointed at no card);
- the anchored form REDS it;
- the anchored form passes the clean reads.
Commit with the counts.

### ARMS — each its own run, to its own log
- Tell3, 4, 5, 8.
- `galleryVeilIds` (after A).
- `galleryServerVeil`, `galleryVeilHandRows`, `galleryRosterChoices`.
- The harnesses `shareRenderTwice`, `rosterChoiceInversion`, `criminalSwitchHandReach`.
- `criminalSwitchSalt`.
- The walkers (`tests/lint/rosterChoiceRegistry.walker`, `mutationCoverageManifest`, `rosterChoicePools.walker`, `crimeTypesReaders`, `recentConflictReaders`).
- `node scripts/veil/rosterChoiceRegistry.mjs --check`.

### ST — THE STORED ARM'S PERSON-ID PROBE (R4I-PAGE-2 brief item ST, not started)
As R4I-PAGE-2's brief says: write the probe plus its one-command `.sh` in `out/v38/r4ip3/`, and run it on the 92 + 48 stored as `saves.js` stores them (today-born at your tree; master-born at a scratch detached worktree of `origin/master` db832c892). If `dump.sh` needs a pool directory, use `/var/tmp/v18/t2/pool-v38` once the seat says it is made; else stop this item with the probe written.

### L — `tests/lint` WHOLE at your last commit
The count goes against af708f2fd's 48 of 3,304 (by name: `out/v36/seated/lint-whole-fails-af708f2fd.txt` on `origin/lane/veil-36-2026-11-22`). Every other red is yours to cure (anchors, manifest rows, citations), except `pgliteHookTimeoutRatchet` until the chair rules.

### B — THE BUILD
Run `npm run build`, then `VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js tests/build/generationWorkerLazy.test.js`, then typecheck (`node scripts/check-full-typecheck.mjs`, ceiling 167) and eslint on every touched file.

## LAWS
As R4I-PAGE-2's brief says. STOP EARLY with what is left at about 250,000 tokens, everything committed and the hand-back current.

YOUR LAST MESSAGE: at most 250 words. Give your last commit; G1's re-stated count and the 34 files' red count; G2's table by class; A's tooth figures; each arm's red and green; ST's figures; `tests/lint` whole's count; the build's figures; CONFIRMED vs PLAUSIBLE.

## ADDENDUM (VEIL-38, 01:05 UTC; the chair's ruling 40.3 of 01:01 UTC). It reads nothing more whole (the window: the first line).
- (4) `pgliteHookTimeoutRatchet` is RULED: a test-only cure inside R4-IDS.
  - At `tests/security/galleryVeilIds.pglite.test.js`, the regex R4I-PAGE wrote with `\(` inside the `beforeAll` (about line 205) gets `\x28` in place of `\(`.
  - Put ONE comment on the line above saying why: the ratchet's paren matcher reads `\(` as an open paren.
  - No figure of the ratchet moves.
  - Show `pgliteHookTimeoutRatchet` RED at b088fcfc5 and GREEN after, then run `tests/lint` whole.
  - Do it with item A, in the same file, as its own commit.
- S2 (`tests/lib/gallery.test.js` "a share marked with a veil renders through it") is CLASSED "red at af708f2fd, the chair's" by its title. The chair gives its cause to the tip's holder.
- `tests/security/shareRenderTwice.pglite.test.jsx` is NOT YOURS. A second builder, R4I-TONIGHT, owns it, together with `summary/tonightSheet.js`, `coherence/crisisFactFindings.js` and every test that pins a "Wants to" line. In G2, class `shareRenderTwice`'s reds and leave the file untouched. Do not re-run it as one of your arms.
