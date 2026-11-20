# FRAME-4 — hand-back (the second half of the session sheet's lane)

Last written 2026-11-20T11:01:25Z (`date -u`) by FRAME-4 on `lane/frame-4-2026-11-20`, cut by fast-forward from FRAME-3's final tip `167d532b5` at the chair's word "THE LANE IS YOURS at 167d532b5" (10:13 UTC). A successor needs this file and the briefs it names. Read with `FRAME-3-HANDBACK.md` (its rulings list stays in force; additions below).

## THE COUNT THE OWNER READS FIRST

**AS BUILT at `2a95ecc4e` (B9 merged), UNDER TODAY'S STANDING: 58 of 330 calm towns take the frame; 272 keep today's sheet byte for byte.**

| | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| framed | 0 | 8 | 15 | 5 | 12 | 18 | **58** |
| today's sheet | 55 | 47 | 40 | 50 | 43 | 37 | **272** |

The same 58 towns, town by town, as FRAME-3's recount (`frame3/FRAME3-CF11-RECOUNT.md`): executed, `comm` empty. Opening trouble by type: crime_wave 12, succession_crisis 10, trade_dispute 10, outside_debt 6, trade_collapse 5, resource_scarcity 5, tyranny 3, legitimacy_crisis 3, corruption_scandal 2, popular_uprising 2; no type over a third; cast/weight disagreements 0.

**"Under today's standing":** the lane FORTUNE-1 (seated 09:49 UTC) will judge a ruler's standing against the place's size as a DARK birth rule; W1 reads legitimacy below 45, so this count moves when that rule is lit. It is re-taken then (how: below, "Instruments").

## RULINGS ADDED SINCE FRAME-3's LIST (each vetoable by the owner)

18. **U0, the crisis page's explicit audience argument** (chair, 09:06 UTC): `composeCrisisPage(s, { audience })` over `TONIGHT_AUDIENCES` (no second set), fail closed, every caller explicit; nothing new drawn.
19. **P1b and P4a are drawn for the owner only**, behind U0, red on both sides (chair, 09:05 UTC). P4a is B7's drafted line at rate 1 (no hash; the ladder waits for P4b); the creditor is the `indebted` entry's `cast.stakes[].factionId` whose power's `desc` opens with an indebted `RAISED_BY_CRISIS` text; its face that power's rank-1 roster member; a record with neither prints today's page.
20. **`frame2NamesRule`'s floor** (chair, 10:21 UTC): it counts trouble-cast sentences, not framed towns; the pool is widened by its fair rule (PER 10 → 12), the floor stays 300, in its own commit after B9's merge; no new framed-town assertion there.
21. **Every count given the owner says "under today's standing"** (chair, 09:50 UTC, FORTUNE-1).
22. **C1, STORED** (chair, 10:58 UTC): the cast stops storing how it was dealt (`crisisCast.js :: take` appends `; ${CAST_REASONS.nextInLine}`: "next in line, the first choice already holding a role that contradicts this one"); the stored reason is the fact alone. A census of every cast-reason string a surface can print, with a guard, red first by a plant. CONDITION: if anything reads the dealing today (a test, "How this was simulated", B11's `castReasonSentence` keeps the tail), say what; else it goes. AND THE SURFACES STRIP IT AT RENDER (the crisis page, the hook, the sheet): a town born before C1 keeps its stored string, so a test on a stored old row. Golden rows moved: named, unsigned. ORDER: after B11 (done), before P1.
23. **C2, RENDER** (chair, 10:58 UTC): the crisis page's Stakes row (CrisisTab.jsx; the PDF's CrisisSections.jsx via crisisPrint's `stakeLines`) prints the power in prose with its article (`powerNameInProse`) and its verb through `powerVerb` (`src/data/people/powerSentenceName.js`, on the working line 0c9069489, NOT yet on this lane). ORDER: after the line merge and after U0 (same files).
24. **THE WORKING LINE IS MERGED INTO THE LANE NOW** (chair, 10:58 UTC): `git merge --no-ff 0c9069489` (origin/lane/join-2026-11-14), hooks on; `tests/lint` whole; the two censuses by their doors; ruling 12's re-pins. If the merge is refused by a permission check, the chair pushes a base branch holding it.
25. **The owner's examples' findings (3)** (a power's article in the crisis hook) are cured in the lane by FRAME-2's B5 (8594e509d), not on the line. **Capture as a strain: NOT built**; CF11 stands; the question is the owner's (6 calm towns of 330 with a hall in criminal hands and a crime wave; 5 keep today's sheet).

## EACH UNIT: STATE, BRANCH, COMMIT (lane tip on origin: `9c2be7882` + this hand-back's commit)

| unit | state | commit | receipts |
|---|---|---|---|
| cut | DONE, pushed | `167d532b5` (ff) | — |
| briefs | committed, pushed | `8805dda25` (U0, P1b, P4a), `2a112e863` (N1), `2838fb1a5` (P1, P2, P3a/b, P4b with rulings 10, 11) | `frame4/` |
| **B9 + B9b** | MERGED, pushed | `2a95ecc4e` | 45 files 344 passed, 1 expected fail, 1 red = the names floor (cured by N1); `tests/lint` whole 2 failed/3271: lighting (cured `f20336c12`), `tuningRegister` (ruling 14's two rows) |
| registers at B9 | DONE | `f20336c12` | lighting titles 31246 → 31248, suites 8650 → 8651, files 3711 (34/34); wiring current |
| phone floor census | DONE | `4cee64757` | +1 floored on /create 621→622, /settlements 864→865, /gallery 666→667: `TonightSheet.jsx`'s side-words eyebrow through `chromeFontSize` (`censusOfSource`: chrome 2 → 3); 9/9 |
| proseNumerics row | DONE by FRAME-3 | `36c640d36` | 404 → 406 |
| **N1** the names pool | MERGED | `90bfb1c79` (27927734d) | PER 10 → 12; troubleCast 272 → 336 (floor 300 kept), tonightSheet 91 → 112, crisisHooks 226 → 273, crisisCast 836 → 987; all 15 kinds read; re-run by me 13 passed, 1 expected fail |
| **B6** the re-seat | MERGED | `be9032b02` (7732b2c8b) | green at start (soak1k-11 has no trouble of weight); one no-frame identity assertion added; with N1 at the tip 15 passed, 1 expected fail |
| **B11** person never "it" | MERGED | `9c2be7882` (31922415e) | diff read; confinement by the builder 48/48 calm, 270/270 untouched crisis; integrator's scratch merge: 25 files importing crisisCast + tests/domain/crisis 287 passed, 1 expected fail; lighting green and wiring current at the merge (no refreeze). Stored figures named, unsigned: golden 5/525, institutionBudgetPromise 6/60, pinned-mode A-arms on one row |
| `tests/lint` whole at `be9032b02` | RUNNING at hand-over (scratch worktree `wt-merge`, log `tip2/lint.log`) | — | expected: `tuningRegister`'s two rows only. OWED: `tests/lint` whole at `9c2be7882` (B11's merge) |
| **U0** the crisis page's audience | BUILDER OUT (branch `frame4-u0`, worktree `wt-u0`, from `be9032b02`) | — | report lands in this session; the successor reads `frame4/U0-CRISIS-AUDIENCE-RESULTS.md` on that branch and its diff line by line |
| **the line merge 0c9069489** | NOT DONE; MEASURED by a scratch merge at `9c2be7882` | — | 21 commits, 16 files; ONE conflict, `tests/lint/.lighting-census-baseline.json` (re-take by its door). It moves generators (`npcGenerator.js`, `narrativeGenerator.js`, `cultureOfficeTitles.js`): ruling 12's re-pins (the calm digests of `troubleWeight.test.js`, the veil test's `DIGESTS` by `FRAME_VEIL_PRINT`) are expected to move |
| C1, C2, P1b, P4a, P1, P2, P3a, P3b, P4b, the measures, the six sheets, build + dist | NOT STARTED | — | order: the line merge → C1 → (U0 merged) → P1b → P4a → C2 → P1 → P2 → P3a → P3b → P4b → measures → sheets → build + `verify:dist` |

## INSTRUMENTS (one command each; outputs under the scratchpad `count/`, `names/`, `regs/`)

- The calm pool: B2's `pool.mjs` (`frame2/B2-WEIGHT-RESULTS.md`, "The scripts"): `node pool.mjs 55 pool.json <src/>` → tried 484, calm 330.
- The count: `node cf11weight.mjs pool.json <src/>` (same file). The framed list: `count/framedList.mjs pool.json <src/>`. TO BE ADDED: one argument forcing FORTUNE-1's rule on, once its switch exists.
- The names floor: `names/floor.mjs <src/> [PER]` (bornPool copied from the test; prints framed calm towns and troubleCast reads by source).

## EXECUTED OR PLAUSIBLE

Executed by me: the count (58, town by town), the names-floor figures (272, 336), the phone census cause, every gate named "integrator's" or "re-run by me", the line's scratch merge. Builders' figures I re-ran: N1's green, B6 and N1 at the tip. PLAUSIBLE (the builders' own, not re-executed by me): B11's confinement table and its stored-figure list; B6's 46/46; N1's per-kind counts.
