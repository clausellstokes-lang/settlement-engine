# BRIEF — WRITE-GOALS: the goal families written as data, under the owner's style law (2026-11-08)

**Seat:** WRITE-GOALS (the allegiance train's writing seat A). **Chair:** session `01FE9mEvGxnFx6WTBkEC6ie9` (Opus 5.5), under the owner's full delegation — never ask the owner anything; the chair rules. **Effort:** high. **Context:** 1M — plan to finish the whole manifest; do not stop short of it.

## 0. Read first (in this order)

1. `docs/OPERATING_STANDARD.md` and `CLAUDE.md` (the laws: measure first; never a gate through a pipe — `sh scripts/gate-tail.sh <cmd>`; registers only through their doors; one writer per line).
2. `docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md` — §0.7 (the goal baselines), §6 whole (the families, their slots, the weighting, the keyed intent, the law's pursuit, the writing size), §1.2–§1.5 (the allegiance, the vectors, the fronts, the handler kinds), §3.5–§3.6 (the pursuit and the family dials).
3. `docs/allegiance/ALLEGIANCE_RULINGS_2026-11-08.md` — J-15 and J-16 bind you (no goals by title; the families replace per-title goal pools).
4. THE OWNER'S STYLE LAW: `docs/chair/2026-11-07/WIRING-RULINGS-2026-11-07.md` §5–§8 (verbatim), `docs/chair/2026-11-07/STYLE-RULINGS-2026-11-07.md` §2 (the five laws: the census law, slotted over frame, the struck tics, vantages, order), `docs/chair/2026-11-07/WAVE-RULINGS-2026-11-07.md` item 16 and §3, `docs/chair/2026-11-07/BRIEF-WIRING-COMMON-2026-11-07.md`. The governing principle (the owner, 2026-11-08): **plausibility with confidence, not predictability.**
5. The voice reference: the people lane's pushed lines on `origin/lane/w4-people-2026-11-07` (W4 PEOPLE, already under the style law) and the tie lines on `origin/lane/w5-his-2026-11-07:src/data/npcData.js` (the W5 rewrite).

## 1. The branch

Cut `lane/write-goals-2026-11-08` from `origin/lane/integration-2026-11-07`, then merge `origin/lane/allegiance-design-2026-11-08` (the design, the rulings, this brief). Push form, three plain separate Bash calls: `git add -A`; `git commit -q -F <msgfile>`; `git push --no-verify -u origin lane/write-goals-2026-11-08`. **Push at most about once an hour and at the hand-back** — every branch push spends one of Vercel's 100 deployments a day, and the master merge's deploy must find the cap unspent.

## 2. The manifest (CREATE only; touch nothing else but the roster's two lines)

- `src/data/people/goalFamilies.js` — the lines, as DATA: plain template strings with `{slot}` tokens (no closures, no imports from generators), in a frozen table `GOAL_FAMILY_LINES[family][subKind][vantage] = [ … ]`, the families and cells of design §6.6 exactly (RANK 36 · POWER 48 · INSTITUTION 48 · SUPPLY 48 · TIES 60 · PERSONALITY 96 · ALLEGIANCE 128 = 464). A line that presumes a fact its family's support gate does not guarantee DECLARES it in place, in the estate's vocabulary: `{ line: '…', needs: ['…'] }` (CENSUS-4c R-C; see `src/data/npcData.js` above `STRESS_ECONOMIC_EFFECTS`). Also in this file: `GOAL_SLOTS` (each family's allowed slot set, from design §6.1) and `PERSONALITY_CLUSTER_OF` (every flaw and temperament in `npcData.js`'s trait lists → one of the twelve cluster keys you define per §6.6; the 17 corruptible flaws in their 4 vectors, the rest in 8 clusters).
- `tests/data/goalFamilies.test.js` — the shape law, executable: every cell holds exactly its §6.6 count; every `{slot}` in a line is in its family's `GOAL_SLOTS`; no duplicate line; no struck tic (STYLE-RULINGS §2 law 3, the list verbatim); `PERSONALITY_CLUSTER_OF` is total over the trait lists (imported, never hand-copied) and every cluster key has its cell; every declared `needs` is a known fact key. Anchored negatives: a planted bad slot and a planted tic each red the test (controls), per the estate's walker practice.
- `docs/allegiance/WRITE_GOALS_2026-11-08.md` — the record: the measurement of the fills (below), the cluster map's reasoning, every judgment call with the default you took, and the statement that every line is listed in the data file FOR THE OWNER'S VETO.
- The dated roster: `tests/lint/.source-citation-baseline.json` `dated` +1 with a `_rosterGrowth…` note, and the walker header's dated line, exactly as the chair's own commits do (`git log -3 -p origin/lane/allegiance-design-2026-11-08 -- tests/lint/`).

## 3. The work

1. **Measure first.** Generate a soak (the 1,000, or at least 200 towns across every tier — the estate's soak scripts; `docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md` §0 names the instruments the design seat used) and collect REAL fills for every slot: power names (with or without an article — the line must read with the real form), ranks, house names, titles, chain labels and statuses, imports, routes, tie kinds, flaws, conflict issues. Write against the real fills, never an imagined form. A slot the record does not hold at birth is struck (check `{season}` and `{issue}` especially; design §6.4's WARRANT line names a season — keep it only if the record holds one, else write the variants without it).
2. **Write** the 464 lines, the cells in §6.6's order. Every line: a plain statement of what the person wants, of the people and the consequence, in a player's words; slotted over frame; no ornament; no tic; SHORT = this season, concrete, a thing that can be done or fail; LONG = the life, a direction. Read each line filled with three real fills before taking it; strike any clause that states a fact the cell's support gate does not guarantee, or declare it.
3. **The ALLEGIANCE cells** are DM-only by construction (the goal never prints publicly; design §6.4). The agent's serve/escape lines name `{guild}` and `{handler}`; the front's face keeps `{front}`'s books clean or gets `{front}` out; the handler keeps `{agent}` in line by the tie kind (partnership · leverage · patron · cause); WARRANT names `{target}` and `{targetHouse}`; SUSPICION names `{target}` only (its target is veiled).
4. **Gates:** `npx eslint` on your two code files; your test green; the roster walker green on the dated count (its `tree` count reads 109 against 112 at the base — MERGE-CAR's three records, MERGE-CAR's line; do not touch it). Read every gate with `sh scripts/gate-tail.sh`.

## 4. What you must not do

No wiring: nothing imports your file (car 4 wires it; `src/generators/people/goals.js` is car 4's). No edit to `npcData.js`, `npcGenerator.js`, `narrativeGenerator.js`, `npcFacetContract.js`, `poolMap.js` or any golden fixture or register. No goals by title (J-16). No line for fanaticism's serve/escape (J-6: unreachable at birth) beyond what §6.6 counts.

## 5. Hand-back

Report: the branch tip; the line count by cell (must equal §6.6); the fill measurement's sources; the cluster map; the judgment calls with your defaults; the gates' exit codes; anything in the design that did not survive contact with the record (with the evidence). Commit trailers:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9
```
