# REHEARSAL 2 — THE LIT READ (brief; the chair, 2026-11-20)

You are a helper of the chair of the settlement-engine program. REHEARSAL 1 made a throwaway joined tree in
`/home/user/wt/rehearsal` (local branch `rehearsal/join-1`, never pushed) and wrote
`/tmp/claude-0/-home-user-settlement-engine/716f8968-c3c3-52a7-92aa-37ba085c7c08/scratchpad/rehearsal/REHEARSAL-1.md`.
Read that report WHOLE first (which lanes joined, which did not and why, what is known red). Then do this brief in its
order. Your product is `REHEARSAL-2.md` in the same scratch directory, plus the files it names.

WHY: the owner decided that two new rules (who rules and who contests; a ruler's fortune) ship SWITCHED ON. The chair
promised him, before he signs anything, ONE JOINT MEASURE with every rule lit on the joined tree, on a VISITOR'S pool,
and a dozen whole places read on the page. Three results send the chair back to him: (1) a trouble's sentence repeating
above about 15% of places of a size; (2) rulers in trouble with no cause in the record; (3) a sentence still repeated
inside one place. You measure those three and render the dozen places. You judge nothing: you report.

## Hard rules (each one binds)

1. YOU PUSH NOTHING, EVER. No `git push`, no pull request, no GitHub write.
2. You work ONLY in `/home/user/wt/rehearsal` (branch `rehearsal/join-1`) and in the scratch directory. You never
   write, check out, reset, stash or clean in `/home/user/settlement-engine`, `/home/user/wt/line`,
   `/home/user/wt/chair`. Reading them is fine.
3. Heavy gates (a typecheck, any vitest run over more than a few files, a build) run ONE AT A TIME through
   `sh scripts/gate-mutex.sh --run -- timeout <seconds> <command...> > <log> 2>&1; echo "exit=$?" >> <log>`:
   ALWAYS under a `timeout`, never through a pipe. Landings are waiting on the same mutex: hold it as briefly as you
   can and never for a run you could do as a plain `node` script. A plain `node` script that births settlements is NOT
   a gate: run it directly (two at a time at most; the box has four cores and other work is live).
4. Never `npm run check`. Never the whole suite in this rehearsal.
5. A refusal by your own permission check stands: report it, do not route round it.
6. You invent no figure and hand-edit no register to make a test pass.
7. No database, no `supabase` command, no network beyond `git fetch origin`.

## Part 1 — finish the join (two lanes rehearsal 1 left out)

`git fetch origin 'refs/heads/lane/*:refs/remotes/origin/lane/*'` first. Then, on `rehearsal/join-1`:

1a. THE FORTUNE LANE: `git merge --no-ff --no-commit origin/lane/fortune-3-2026-11-20`. RULED RESOLUTIONS:
   - `src/domain/density/densityCreateBoundary.js :: birthConfig`: THE UNION. Both lanes add a clamp of their own
     incoming marker and a mint of their own law. The joined function clamps `LIVING_CONTENT_LAW_CONFIG_KEY`,
     `SEAT_LAW_CONFIG_KEY` and `FORTUNE_LAW_CONFIG_KEY` and spreads `newSettlementDensityLaw()`,
     `newSettlementLivingContentLaw()`, `newSettlementSeatLaw()`, `newSettlementFortuneLaw()`; both imports stay.
   - `tests/lint/densityCreateBoundary.walker.test.js`: the union of both lanes' mint rows.
   - The seat lane already scripted this very merge for its own measure: read
     `docs/chair/2026-11-20/content/seat/u4/measure-lit.mjs` (its `resolve` step: "the six conflicts per the chair's
     joint reading (a)") and apply THE SAME resolutions for the files it names.
   - Registers, censuses, frozen lists (`.tuning-register.json`, `.tuning-inventory.json`,
     `.lighting-census-baseline.json`, `mutation-coverage-manifest.json`, `.writer-reach-baseline.json`): take the
     rehearsal branch's side for conflicted hunks; list each as "OWED: its own door at the real join".
   - ANY OTHER conflict: record the file, the symbol and both sides (at most 12 lines a side), `git merge --abort`, and
     say the fortune lane is NOT JOINED: then Parts 2 to 4 run with the who-rules rule only, and you say so in the
     report's first line.
1b. THE DEPTH LANE (hooks, the conflict sentence): `git merge --no-ff --no-commit origin/lane/depth-3-2026-11-20`.
   Tables where both sides only ADD entries (`factVocabulary.js`, `registeredWords.js`, `factLayers.js`,
   `tests/lint/presumptionClasses.shared.mjs`, pool data in `npcData.js`): keep both sides' additions. Registers: as
   above. Anything else: record, abort, NOT JOINED, go on.
   KNOWN, DO NOT CHASE: the depth lane and the trouble lane each carry a first-paint fault (about 2.1 MB) that their
   own seats are curing. It does not affect generation. Run NO build in this rehearsal.
1c. After the merges: `npm run typecheck:domain:strict` (through the mutex, `timeout 900`); then a SMOKE: a plain
   `node` script that births one settlement of each size through `birthConfig` and prints its name and tier. If
   either fails, record the error and the two lanes that meet there, repair ONLY an obvious merge slip (a duplicated
   import, a missing comma) and say what you repaired; anything deeper: stop and tell the chair.

## Part 2 — the flip, in this scratch tree only

Three one-line edits, committed LOCALLY with the message `REHEARSAL ONLY: the flip (never pushed)`:
- `src/domain/seat/seatLaw.js`: `NEW_SETTLEMENT_SEAT_LAW_VERSION = HOLDER_SEAT_LAW_VERSION`
- `src/domain/seat/seatCircumstances.js`: `SEAT_CONTEST_LIT = true` (the tuning table is NOT touched: every factor stays 1)
- `src/domain/fortune/fortuneLaw.js`: `NEW_SETTLEMENT_FORTUNE_LAW_VERSION = SIZE_RELATIVE_FORTUNE_LAW_VERSION`
  (only if the fortune lane joined)
PROOF: a birth through `birthConfig` carries `_seatLawVersion: 2` (and `_fortuneLawVersion: 2`); quote the two keys.

## Part 3 — the pool and the three measures

THE POOL: A VISITOR'S WORLD: births exactly as the seat lane's instrument births a visitor ("born as
`settlementGenerateAction.js` births a visitor who touches no setting, the size picked; `visitor-<size>-<i>`"): read
how `docs/chair/2026-11-20/content/seat/u4/measure-lit.mjs` builds its visitor pool and reuse that code path. 150 a
size, six sizes, 900 births, on the FLIPPED tree. Cache every record as JSON under `pool/` in the scratch directory
(you will read them many times; birth them once). Say how long it took.

MEASURE 1 — A TROUBLE'S SENTENCE. For every place with a live trouble (`history.currentTensions`): the sentence the
page prints for its first trouble (`src/domain/display/tensionCause.js :: tensionCauseSentenceOf(record, tension)` if
it is on the joined tree; say which function you used) and its stored description. By size: how many places print a
trouble; the commonest sentence and the share of ALL places of the size that print it; the five commonest; and "of
three places drawn at random, the chance at least two print one same trouble sentence" (exact over the 150).
THE LINE THE CHAIR WATCHES: any sentence above 15% of a size's places.

MEASURE 2 — RULERS IN TROUBLE WITH NO CAUSE. By size, calm and crisis-born apart (use the seat instrument's own
definition of "calm" and of the risk label: Holding, Stable, Contested, Critical): the count of places at each label.
Then, for EVERY calm place whose seat reads Contested or Critical (expect a few dozen of 900), one block in a file
`measure2-places.md`: the place's name and size; who holds the seat and in what form; the risk label; the challengers
the page names; the legitimacy score with its breakdown and its merits (if the fortune rule is lit); every live
trouble with its printed cause sentence; the stressors; and ONE line of yours: "the page gives this cause for the
contest: <the sentence>" or "THE PAGE GIVES NO CAUSE". The count of the second kind, by size, is the measure.

MEASURE 3 — A SENTENCE REPEATED INSIDE ONE PLACE. For each of the 900: every string the record stores that the page
prints as prose (every string leaf of 40 characters or more, split into sentences at `. ` `! ` `? `; skip the keys the
privacy scrub names as never printed if you can tell; say exactly what you included). Count sentences that occur
TWICE OR MORE inside the same place, the place's own name masked. By size: the share of places with at least one such
sentence; the twenty commonest repeated sentences with, for each, how many places repeat it and the two field paths
it stands at. Say which of them are the same fact stored twice by design (one field feeding two surfaces) if the paths
make that plain; do not guess.

## Part 4 — a dozen whole places, as the page prints them

Twelve of the pool's births: indices 0 and 1 of each size. One Markdown file a place under `places/`
(`<size>-<i>.md`), in PAGE ORDER, with a heading a tab or section, PROSE AND LABELS ONLY (no JSON).
HOW, in this order of preference: (a) the sameness door's renderer, if the joined tree holds it and it can render one
given record or birth to text (`scripts/sameness-census.mjs` and what it imports; a newer part is on
`origin/lane/same-2-door-2026-11-20`: read it, do not merge it); (b) the PDF's view model
(`src/pdf/lib/viewModel.js`), walked section by section into text; (c) a plain walk of the record: overview (name,
size, the arrival paragraph, why here), who rules (the seat line, the standing lines, legitimacy and merits, the
contest), the powers (each with its lines), the trouble (each with its cause, its sides and its hooks), daily life,
traditions, safety and trade, the history's recent line, and SIX of its people's cards whole (role, position,
constraint, goal, secret, ties). Say which way you used. Each file under 400 lines. THE CHAIR READS THESE TWELVE
FILES ITSELF: do not summarize them; do list, at the foot of `REHEARSAL-2.md`, anything in them that you saw printed
twice in one place, a bracket or placeholder left unfilled (`{power}`, `undefined`, `[object Object]`), or a sentence
that names a thing the place's own lists do not hold.

## The report (`REHEARSAL-2.md`)

1. First line: which rules were lit (who rules; fortune) and on how many joined lanes.
2. Part 1: each merge's outcome and every resolution; the smoke.
3. Part 2: the proof of the flip.
4. The three measures, each as one small table by size and the two or three sentences that matter, with the files
   that hold the rest.
5. The twelve places' paths, and your foot-list.
6. CONFIRMED (executed, with the log or file) and PLAUSIBLE (read, not run).
Your final message to the chair: at most 250 words: the three measures' headline figures by size, the count of
"no cause" places, and the report's path. If a merge slip, a crash at birth or a missing function stops you, say so
at once in one short message rather than working round it.
