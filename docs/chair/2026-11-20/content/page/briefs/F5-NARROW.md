# F5-NARROW: a person who cannot be bought keeps no bought secret (PAGE-8's brief; written 2026-11-20 19:20 UTC by `date -u`)

Read `briefs/BUILDER-RULES.md` first (it binds you; "PAGE-2" there means PAGE-8), then `PAGE-6-HANDBACK.md` §0a (THE CHAIR'S
RULING OF 18:26, VERBATIM: its five conditions are your acceptance) and §3, then `briefs/S9-POST.md` (the post-pass you extend),
then `measures/page-6/f5/A-narrow-diff.txt` and `A-narrow-cards.txt` (the probe's result you rebuild; its patch is lost).
Every heavy run (a forge of the 300, a gate) goes through `sh scripts/gate-mutex.sh --run -- …`, one at a time: the machine
is shared with two other seats.

**THE UNIT, AS RULED.** A card whose FINAL dominant temperament (`personality.dominant` as the record ends) is one of the
narrow four — `principled`, `honest`, `incorruptible`, `plain-dealing` — and whose secret is VENAL (F5's venal list: the one
PAGE-1's `f5.mjs` uses; origin `lane/page-1-2026-11-20-card`, `docs/chair/2026-11-20/content/page/measures/C/f5.mjs`, with its
`towns.mjs` beside it; copy both into your scratch, never into the repository) takes, draw-free, the next row of its own pool
that it is admitted to and that no card of the town holds (S9's walk: `factionLeaderSecret.js :: settleMisfitSecrets`, row
order, wrapping; S9's no-market carry applies as it does there). No row left: it keeps its draw, and is COUNTED. Nothing else
moves. No `rng()` added, removed or moved. `npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT` is not edited; no secret row is
reworded or removed (the goals seat keeps 119 by text).

**THE FIVE CONDITIONS (the chair's).**
1. THE PASS READS THE FINAL TEMPERAMENT. It runs after the last writer of `personality.dominant` (`castPowers.js :: rankPowers`'
   yield moved 7 cards under the probe). Find every writer after S9's call (say each by symbol). RED: on the 300, the
   temperament each card has AT THE PASS equals the one its record ends with: 0 differ. The call is ONE fragment appended to an
   existing line of `narrativeGenerator.js :: enrichNpcCoherence` (or S9's existing fragment given an option) so no cited line
   moves; the goals lane also edits that file and the chair resolves the join. If that order cannot be had this way, or a reader
   AFTER the new point reads the secret (a tie, a goal, a hook, `pressureSentence`, the mints' `CarriedSecrets`, the narrative
   override pass) so that moving the secret there leaves it stale, STOP and hand back exactly which (no code).
2. THE PASS NEVER HANDS A CARD A VENAL SECRET. The probe moved the garrison commander of `hxd-city-26` onto "Has been falsifying
   inspection records for a fee": its `admits` did not refuse F5's venal words. TRACE that card first and say why; the cure is in
   the pass's admits for the narrow four (not in the shared table). RED: no card the pass moved ends with a secret on F5's venal
   list; shown red on the probe's behaviour first.
3. The three principled postmasters reached through their title rows: accepted (they are narrow cards). If condition 2 now refuses
   their new rows too, say what they end with.
4. THE SURVIVORS (narrow cards left venal; the probe: 20 — prison warden 7, black marketeer 4, luxury merchant 2, one each priest,
   bowyer, lord, chandler, dean, customs collector, brickmaker): name each by office and town with the reason it has no admitted
   row. The black marketeer's reason is its trade: left.
5. MOVED FIELDS. Your own dump of the 300 (`measures/page-2/measure.mjs`'s seeds, every stored field as JSON, before = your base
   commit, after = your commit): the fields that moved, on which cards. Expected: `secret.what`/`secret.stakes` on narrow cards
   only. The probe also moved 5 `personality.dominant` and 1 `goal.long`: a pass that walks a SECRET after the last temperament
   writer should move neither — explain each that still moves, or cure it. Any OTHER card or field moved: STOP and report.

**MEASURE** with `f5.mjs` on the 300, base and after: F5 (all, of 5,452) and the narrow 139 → ?; and with S9's own measure
(misfits by calling) to show S9's result unchanged.

**TEST** (red first, computed never quoted): `tests/generators/narrowVenalSecret.test.js` (or a sibling name free of the
manifest's words): (a) condition 1; (b) condition 2; (c) a narrow card with an admitted row left holds a non-venal secret;
(d) a non-narrow card's secret is byte-identical to the base. Seeds chosen from the 300 by computation.

**FILES YOU OWN:** `src/generators/npc/factionLeaderSecret.js`, `src/generators/narrativeGenerator.js` (ONE appended fragment),
the new test file. Read-only: `npcData.js`, `castPowers.js`, everything else. A file you need that is not yours: STOP.

**YOUR TREE:** worktree `/home/user/wt-p8-f5`, branch `page8/f5`, cut for you at the lane commit. GATES (BUILDER-RULES 5):
your test; every test file importing `factionLeaderSecret`, `narrativeGenerator`, `castPowers`; `npx vitest run tests/lint`
WHOLE; the two typechecks; `npm run lint`. Expected reds not yours (at the lane base): generatorGoldenMaster,
espionageDormancyFence, nameHeldThroughAssembly, worldFactRederive A7, rosterFinalUnderHeldRoster A1 — name each with its
before/after figure if your change moves it again; `sovereigntyLightingContract.walker` (file count +1) and
`proseWiringCensus.walker` are PAGE-8's doors. Any other red: report by title.

**HAND BACK** (at most 400 words): branch and commit; condition 1's writers and the call's place; condition 2's trace; the
survivors table; the moved fields; f5 before/after; red/green count lines; each gate's line.
