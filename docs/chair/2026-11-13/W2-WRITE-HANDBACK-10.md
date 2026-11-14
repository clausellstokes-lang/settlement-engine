# W2-WRITE — the hand-back of the tenth seat (the bar's HIGH rows, the designed HIGH rows)

**Lane:** `lane/w2-write-2026-11-13`. Brief: `docs/chair/2026-11-14/briefs/BRIEF-W2-WRITE-10.md` on the chair's lane
(the chair session_01ACmDYZrFEVXyZEUg1NDxxC). The lane's tip read back from origin at the start: `6fdff4abd`, as the
brief names it (no difference). Scratch worktree on local branch `w2w10`; pushed by
`git push origin w2w10:refs/heads/lane/w2-write-2026-11-13`, each push non-empty (`git rev-list` tested), the main
clone's refs and local config compared before and after (push.sh: same every time). No commit at or below
`6fdff4abd` rewritten. HANDED BACK BY FILE at the count's mark (get_session: 325,070 at the last waking; this file
written after one more item).

**Measured at the start:** the owner-page render (`render.sh`) at `6fdff4abd` over `seeds-w5a.txt` and the bar's ten
`bar0-` seeds (772 towns, 4 workers, every shard exit 0). The bar's towns reproduce in the app's shape (Agiospolis,
Naranjotzin, Saltosinum, Torriplenum read by name: render.w5.jsx's seed pattern takes `bar0-<size>-<crises>-rand-<i>`
and its config equals render.bar0.jsx's for `rand`). Every count below is over those 772 towns.

## Items (each its own commit, pushed as made)
| row | pool · vids | before -> after | cure | commit | guard |
|---|---|---|---|---|---|
| BAR-0 HIGH #75 | DS-ECO-1 C4 v4 v5 v7 | 107 siege towns print a pre-siege poverty claim nothing reads -> 0 | reworded (a siege caps every rung at Struggling: prosperity.js; no atom reads the rung before it) | 7bbedbfa0 | none (a rewording) |
| BAR-0 HIGH #217 | DS-DEF-3 Moderate v3 | 19 thorps and hamlets -> 0 | `colour` -> `tier: ≥ village` (the size ruling) | fdae163f3 | w5-hamlet-calm-2, w5-thorp-calm-9 |
| BAR-0 HIGH #246 | DS-ECO-12 INCOME WEIGHT religious houses v1 v2 | 25 towns (all thorps/hamlets, wayside shrine + access to a parish church, no faith income) -> 0 | + `tier: ≥ village`. `church` TRIED FIRST and REFUSED by the fact-layers walker (layer 3, a new POOLS row) and the kernel's byte pins: not routed round; the size atom cuts the same 25 | 3ae4b5ab1 | w5-hamlet-indebted-101 v1, w5-hamlet-calm-10 v2 |
| BAR-0 HIGH #116 | DS-ECO-11 unexploited v1 (both pools) | "pay for the digging" 50 towns (36 timber) and "out of the ground" 12 (wool, glass) -> 0 | the corpus's part: reworded ("pay for the work", "nothing in the town works it"). THE ROW'S OWN FALSENESS IS FOR THE JOIN (below): 48 towns | f099d2ad9 | none |
| HANDBACK-9 HIGH (DS-DEF-2) | walls AND professional garrison v1-v3 | 18 occupied towns -> 0 | + `no crisis: occupied` | 1dfa83d89 | w5-city-occupied-1 v1, -101 v2, -102 v3 |
| HANDBACK-9 HIGH #645 | DS-DEF-2 Beasts plagued, perimeter AND force v2 | 11 eligible / 4 drawn under a siege or an occupation -> 0 | + `no crisis: under_siege · no crisis: occupied` | 63c05d9dc | rww-city-under_siege-1, w5-city-occupied-3 |
| HANDBACK-6/9 HIGH (DS-DEF-5) | NO organized force v1-v3 | 16 occupied towns -> 0 | + `no crisis: occupied` | 7f8640a48 | w5-hamlet-occupied-1 v1, w5-thorp-occupied-102 v2, w5-hamlet-occupied-104 v3 |

After every cure: doors.sh, iterate.sh (no pin moved by any item), bytes.mjs, `presumed-things-door.mjs --check`
(fresh 24 -> 23 at #75; a stale row out by `--shrink` at #217; fresh 23 at the hand-back), the page census
`--grid` (exit 0 every time), strict 0 / ratchet 0 / eslint 0, and `npm run lint` (exit 0) before every push (the
lane hook's three gates: husky's path is unset in the shared config, so they were run by hand).
**Reds at the fast set beyond base-reds.txt, every item:** only `tests/domain/powerStateProseDesk.test.js` DS-POW-6
"5a RE-RULED" and "ALIVENESS: all thirteen pools fire" — MEASURED RED AT 6fdff4abd with no change of this seat's (the
files restored to the tip in the scratch worktree and the test run alone): the lane's red, not classed further.

## New or changed lines (the owner's veto list, with the towns read)
- DS-ECO-1 C4 v4 CHANGED: "With the siege closing every way in, {settlement} has lost what passing trade used to leave behind, and the town feels the loss." (rww-thorp-under_siege-1 Belovich, w5-city-under_siege-1 Tihono, rww-metropolis-under_siege-1 Naranjotepec)
- DS-ECO-1 C4 v5 CHANGED: "The siege has stopped {settlement}'s trade moving at all, and the money that trade brought in has stopped with it." (w5-thorp-under_siege-1 Ribatkala, bar0-city-under_siege+famine-rand-1 Agiospolis, w5-metropolis-under_siege-101 Capovetum)
- DS-ECO-1 C4 v7 CHANGED: "Since the siege began, no passing traffic brings money into {settlement}, and nothing has taken its place." (w5-thorp-under_siege-5 Mingzhen, bar0-hamlet-under_siege-rand-1 Torriplenum, w5-metropolis-under_siege+famine-101)
- DS-ECO-11 unexploited medium/low v1 CHANGED: "{settlement} leaves its {resource} unworked. It would fetch barely enough to pay for the work." (w5-thorp-famine-106, w5-hamlet-famine-5, w5-city-under_siege-103, w5-metropolis-calm-102, bar0-city-wartime-rand-1: the last three false BY THE BUCKET, the join's row)
- DS-ECO-11 unexploited high v1 CHANGED: "There is {resource} in {settlement}'s country worth real money and nothing in the town works it." (w5-thorp-under_siege+famine-102 Tyrset, w5-hamlet-wartime-3 Easleigh, w5-village-famine-3 Caerthorpe, w5-city-calm-3 Huaxian)
- Declarations only (text unchanged): DS-DEF-3 Moderate v3; DS-ECO-12 religious houses v1 v2; DS-DEF-2 walls AND garrison v1-v3; DS-DEF-2 plagued perimeter AND force v2; DS-DEF-5 NO organized force v1-v3 (towns read: each commit's body).

## FOR THE JOIN
- **#116's own falseness** (48 of 772 towns: "leaves its timber unworked" beside a 'Sawmill (commercial)', often carpenters too; Naranjotzin exports milled lumber): `src/data/institutionalCatalog.js`, the 'Sawmill (commercial)' entry, `tags: ['trade']`: add the timber chain's processing tag. `src/generators/resourceGenerator.js :: institutionSupportsChain` is tag-first; its exact-name fallback matches the village row's plain 'Sawmill' only. The page's "Needs: Sawmill" under Resources is the same fault.
- **DS-ECO-12 religious houses at the join:** lane/w2-fix-data-2026-11-13 (merged at the join, 8f222ff87) holds this pool too: its v1/v2 are `[· sacredHouse]` (the base was `colour`), its v3-v5 differ from this lane's. This lane's v1/v2 now read `sacredHouse · tier: ≥ village`: take this lane's v1/v2 at the merge; v3-v5 are the merge seat's to resolve (both lanes reworded them).
- `src/domain/facts/institutions.js` (the `temple` pattern counts 'Wayside shrine' and 'Access to parish church'): the reason `sacredHouse` holds in a hamlet with no house of its own. Not this lane's file.

## What is left (line by line, in the brief's order)
- Step 2, NOT REACHED: #1509 DS-DEF-2 Beasts settled, defenses beyond the need v1-v3 (reword true beside any bar; no atom reads the monster score); #1206 DS-DEF-9 `magicDependency` true v1-v4 ("runs on arcane work" where every magic role reads absent; MEDIUM #297 is v4 of the same pool, #259 is `false` v2); DS-DEF-11 WALLED-STRAINED v2 under an occupation (its `{defwork}` slot printing a catalogue label).
- Step 3's message: sent with this hand-back (the tip; each HIGH row's count before and after, above).
- Step 4, NOT REACHED: (a) the two UI reds (generalDeskTabFlow DS-GEN-18 STALLED at seed forge_town; economicsTabFlow exportPosture "town"/"village"), as HANDBACK-9 measured them; (b) the presumed-things fresh hits, now 23 (the openTrade line was cured by #75's rewording): 7 declaration literals FOR THE DECLARATION PASS, 16 corpus lines to read and declare or cure.
- Step 5, NOT REACHED: the 15 MEDIUM rows of BAR-0-ROWS-corpus.json; no count script run.
- Read, not changed, named: DS-DEF-3 `Dangerous` v3 ("warns visitors about particular streets": plural streets) drawn in none of the 772 towns; DS-DEF-2 plagued perimeter AND force v1 under an occupation ("the city keeps ... people to hold it", drawn at w5-city-occupied-3 after #645); DS-ECO-12 v1 "a large part of the town's business" beside tithes of 5-8% in a metropolis (the compound's reading); DS-ECO-1 C4 v1/v6 "the town stays poor" under a famine (the famine caps the rung too; read as the present rung, kept).

## How the instruments are re-made
`git archive origin/lane/w2-write-2026-11-13 docs/chair/2026-11-13/probes/W2-WRITE-5 | tar -x -C <dir>`; a worktree at the
tip, `npm ci`, then `git config --local --unset core.hookspath` in the main clone. The render's seeds: `seeds-w5a.txt` plus
`seeds.bar0.txt` from lane/review-bar-0-2026-11-14's probes/REVIEW-BAR-0. This seat's helpers (re-make from these
descriptions): `dr.py <dumps> '<block::pool>' [vids]` (per vid, towns eligible and drawn on the owner's page, from the
.draws.json); `adm.mjs <lane> <records> <dumps> '<block::pool>' '{"<vid>":"<atoms>"}'` (for the towns drawing each vid,
how many a declaration with the extra atoms refuses: factsOf over the record and the kernel's variantFactDeclaration +
declarationAdmits, the guard test's own rule); `relig.py` / `expl.py` (the #246 and #116 counts over the records);
`after.sh` (iterate.sh, bytes.mjs, presumed things --check, the grid, gates.sh in one).

## The rulings this seat worked to
BRIEF-W2-WRITE-10 whole. No message from the chair arrived during this seat (ReadNotifications after every commit:
only this seat's own count checks).
