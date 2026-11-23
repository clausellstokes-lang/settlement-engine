# R4-CURE BRIEF — R4 (dfa031f3e) to green: the salt's volatility, the twin's salt, the guards that pin byte-stable ids

Written by VEIL-22. You are a BUILDER working for VEIL-22. A security lane: a slip is a leak. MEASURE FIRST, RED FIRST.

## Where you are, THE LAWS, WHAT GREEN MEANS
EXACTLY as `briefs/R4-BRIEF.md` (which points to `briefs/R2-BRIEF.md`'s "Where you are", "THE LAWS", "THE RULINGS IN
FORCE", "WHAT GREEN MEANS" items 1 to 10), with: worktree `/home/user/wt/r4`, branch `v22-r4`, at R4's commit
**dfa031f3e** (NOT GREEN; its builder stopped at its mark). Your outputs under `docs/chair/2026-11-20/veil/out/v22/r4cure/`,
hand-back `R4-CURE-HANDBACK.md` there. Read whole first: `out/v21/r4/R4-HANDBACK.md` (R4's), R4's diff
(`git diff d136940c3 dfa031f3e`), this file. ONE commit on `v22-r4` on top of dfa031f3e; never push.
CHANGED FROM R2-BRIEF's laws: `tests/domain/display/criminalVeilSwitch.test.js` IS NOW THE LANE'S (V10-2 merged at
d136940c3): you MAY edit it under THE SEAT'S RULING below, and nowhere else. `src/domain/display/criminalVeilSwitch.js` and
`src/components/gallery/CurateMode.jsx` stay untouched. MEMORY: a worker of R4's run was killed for memory; run every
pglite batch with `--maxWorkers=1`, never more than four pglite files a run.

## THE SEAT'S RULING ON THE GUARDS (VEIL-22, vetoable by the chair; the consequence of VR10)
VR10 re-keys EVERY person id on EVERY non-owner read under one salt a read, so no non-owner read carries a person id
byte-stable across reads. A guard that pins a served person id byte-for-byte (against another read, the owner's record,
the 210 page or the twin) pins the behaviour VR10 overturned. Such an equality is re-stated MODULO THE READ'S PERSON-ID
BIJECTION and nothing else: each side's person ids (every value at a re-keyed path, by its kind: card ids, tie ends,
cast role ids, lever holders, the trace's targets, the served member keys) mapped to a canonical name by FIRST APPEARANCE
in a fixed walk of the payload; then the two sides compared byte-for-byte as before. Every other byte is compared exactly
as it was. EACH re-stated guard carries TEETH, executed: (i) a reference that does not follow its card (a tie end or a
role id moved to another person's key, or to a key no card holds) still reds; (ii) an ORIGINAL (stored) person id anywhere
in a served payload still reds (the re-key must have happened); (iii) a changed non-id byte still reds. Where a guard's
equality cannot be re-stated so (it fails modulo the bijection), that red is NOT the re-key's: STOP and report it.

## THE CURES, IN ORDER (each red first)
1. **THE SALT'S VOLATILITY.** `_gallery_veil` (restated in 212) draws `gen_random_uuid()` while declared IMMUTABLE. An
   immutable function with constant arguments may be folded once at planning and its plan cached, so a cached plan would
   serve ONE salt to every read (VR10 broken silently). RED: through pglite and the scratch cluster, a PREPARED statement
   calling `public._gallery_veil(<constant doc>, <constant overrides>, false)` (and the read functions as they are called)
   executed twice serves the same person keys on both executions (show it red, or show it cannot red and say why, with
   the plan). CURE: every function that draws the salt is declared VOLATILE (and every function whose body calls it is
   checked: a STABLE or IMMUTABLE SQL function that calls a volatile one is not inlined; say what each read function's
   declared volatility is, and change none of 211's read functions unless the measure shows a cached salt through them).
   GREEN: two executions of the same prepared statement, and two reads in one statement, serve different person keys.
   The cost rows (VR36) after it.
2. **THE TWIN'S SALT.** R4 draws the twin's salt once per page load (to keep `criminalVeilSwitch.test.js` green). VR10 is
   one salt a READ: the twin draws one salt per projection call (`projectShareVeil` / `applyVeil` / the unmarked path),
   consistent within that payload. Red first (two projections of one share in one module load serve the same keys today).
3. **THE GUARDS** red at dfa031f3e (`galleryServerVeil` 10 of 17, `publicSafe` 7 of 56, `galleryVeilSignalCopies` 4 of 5,
   `criminalVeilSwitch` 1 of 9, and any the full guard set shows): for EACH red, read the assertion and say its cause. A red
   that pins a byte-stable person id: re-stated under THE SEAT'S RULING with its three teeth. Any other red: STOP and report.
4. The rest of R2-BRIEF's "WHAT GREEN MEANS", owed by R4 and not run: the acceptance run (EXIT 0), render-twice (4 of 4,
   KNOWN_DRAWN empty, the session sheet walked), inversion, the v8245 cost rows and the largest born town's Reveal-DM read
   (bound: twice 211's Reveal-OFF read), the eight veil guard files and the twin's tests, the typechecks, eslint, `--check`,
   212's and its rollback's sha256 after.

Stop at about 250,000 tokens: commit what is green, hand-back current, report (at most 250 words: the commit, each cure's
red and green with files, each guard's cause and its re-statement with its teeth, the acceptance exit, the cost rows,
CONFIRMED vs PLAUSIBLE).
