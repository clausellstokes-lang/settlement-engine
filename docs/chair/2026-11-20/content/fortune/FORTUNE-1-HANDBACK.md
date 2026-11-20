# FORTUNE-1 hand-back (kept current; last written 2026-11-20 10:48:44 UTC by `date -u`)

For a successor (FORTUNE-2): this file and the briefs (`briefs/COMMON.md`, `U1.md` to `U4.md`) are all you need.
Lane branch `lane/fortune-1-2026-11-20`, cut from the working line at `0c9069489`. The chair is
session_019yED1SUxGVHyjQnoqoFvQ8 (send_message, Claude Code Remote MCP server); one message at each merge, at most
300 words, with your count.

## 1. The rulings in force (each vetoable by the owner; every figure DRAFT, signed by none)

1. The owner, 2026-11-20: "Do all of it predeploy." And: "A calm town should be as it currently is… Don't invent
   drama… We are not creating the campaign."
2. FS1 to FS7 as written in the seat's prompt (`git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/FORTUNE-1.txt`).
3. The chair, 10:33 UTC: BUILD THE RULE AS PROPOSED, items 1 to 8 of the proposal's section 3 (development figure 1;
   magic scale 0.6; depth by today's ratios 0.75/1.3 against the measured medians 3, 5, 8, 20, 42, 53; diversity bonus
   retired; the calm Poor floor after the label's steps, an isolated thorp or hamlet excepted; defence by the size's
   usual range, 4 points a band, within ±10, times the size's existing scale; the cuts unchanged). No new negative fact
   enters the sum (12.6).
4. The chair, 10:33 and 10:48: KEEP THE 75 CUT. The second column (Prosperous 15 -> 24) was measured and REJECTED:
   keep 15. The points live in the law's one tuning table so the owner can move them at the signature.
5. The chair, 10:33: 5.2 accepted as FS1 applied to a crisis. THE FORTUNE LAW IS NEVER LIT BEFORE THE SEAT'S LAW
   (the leaf's header says so; say it again in the final hand-back). The joint figures (the seat's contest odds, the
   session sheet's count, the prototype forced on) are the chair's measure at the close: keep the forced-on arm
   runnable in one command (`instruments/run.sh`).
6. The chair, 10:33: FS7 is EXHAUSTIVE for the four new combinations (U4's brief), plus the chair's finding of 10:48 on
   the Power tab's reason clause (U4 step 4).
7. The chair, 10:33 and 10:48: `src/generators/factionDynamics.js` is THIS lane's for U3 (only `computePublicLegitimacy`,
   its tables and helpers; never a relation line). Say "factionDynamics released at <commit>" when U3 is merged.
8. The chair, 10:33: the mint is built exactly as the seat's U1; the collision with the seat's U1 in
   `densityCreateBoundary.js` is the chair's; our rows stay on lines of their own.
9. The chair, 09:56: whoever lands second on a shared file re-takes every register keyed on it on the merged tree, by
   its own door (proposal section 14).

## 2. The units

| unit | state | branch | commit | brief |
|---|---|---|---|---|
| proposal + instruments | DONE, ruled | lane/fortune-1-2026-11-20 | fe797ede1, 496c50dbc, 9edcc112e | — |
| owner's page | DONE, relayed by the chair 10:48 | same | 9edcc112e | — |
| briefs | DONE | same | 3e5c879e6 (+ U4 step 4 after) | briefs/ |
| U1 law leaf, dark | BUILDING (builder seated 10:4x in worktree scratchpad/wt-u1) | lane/fortune-1-u1-2026-11-20 | — | U1.md |
| U2 fortune | to cut after U1's merge, beside U3 | lane/fortune-1-u2-2026-11-20 | — | U2.md |
| U3 standing + play-time guard | to cut after U1's merge, beside U2 | lane/fortune-1-u3-2026-11-20 | — | U3.md |
| U4 FS7 | after U2 and U3 | lane/fortune-1-u4-2026-11-20 | — | U4.md |
| re-measure forced on; confinement; final hand-back | after U4 | — | — | section 4 |

THE INTEGRATOR'S ROUTINE AT EACH MERGE: read the builder's diff line by line; re-run its red (check out the test alone
on the pre-unit tree, see it fail) and its green; merge (`git merge --no-ff`) into the lane; run at the merged tip the
unit's governing suites, `tests/lint` WHOLE (in a fresh clone first `git fetch --no-tags --depth=1 origin +refs/heads/review-fixes-2026-07-08:refs/heads/review-fixes-2026-07-08`),
the lighting census and the wiring census by their own doors (yours, never a builder's), `npm run validate:tuning-bands`,
`npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`; every run to a file through
`sh scripts/gate-tail.sh`; read the author; push the lane (plain, hooks on); message the chair.

KNOWN REDS ON THE LINE THAT ARE NOT OURS (do not repair): the stored fingerprints of generated towns, the server
bundles' freshness, five size ceilings.

## 3. The instruments (each one command; none changes a source file)

- The whole measure, prototype forced on vs today: `sh docs/chair/2026-11-20/content/fortune/instruments/run.sh <checkout> <scratch>`
  (2 min 17 s; outputs in `measures/`). Variants: `FORTUNE_FLAT`, `FORTUNE_DEPTH`, `FORTUNE_DEF`, `FORTUNE_FLOOR`,
  `FORTUNE_PROSPEROUS`, `FORTUNE_WEALTHY` before `node instruments/tree.mjs <checkout> <out> proto`.
- AFTER THE BUILD, the forced-on arm on the REAL law: `measure.mjs` must set `_fortuneLawVersion: 2` AFTER `birthConfig`
  (it spreads its extra JSON BEFORE today, and `birthConfig` clamps an incoming marker away). That one-line change is
  owed with the re-measure.
- The confinement while dark: `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs 0c9069489 <tip> <workdir> --words=none`
  (from `origin/lane/names-3-2026-11-20`), plus one sha256 over each side's born documents: EQUAL.

## 4. The tables (EXECUTED on the prototype; the built rule's re-measure replaces them)

Proposal sections 2, 4, 5, 6, 15; `measures/fs6-untouched.txt`, `measures/fs6-every-dial.txt`. Headline, calm towns:
Legitimacy Crisis pooled 3.8% -> 1.4% (untouched), 6.1% -> 1.0% (every dial), rising at no size; village Approved
1% -> 37%; city Poor or Moderate 0% -> 26%; Endorsed 22% -> 0% (untouched), 26% -> 12% (every dial).

## 5. Executed vs plausible

EXECUTED: every figure in the proposal, on copies of the checkout. PLAUSIBLE: the FS7 screen (a word-list floor;
U4 reads the sentences); that `reBand` needs no edit (read from every writer of the score; U3's guard proves it).
