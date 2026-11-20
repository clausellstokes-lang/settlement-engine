# GOALS-1 · builder 4 · the 25 approved goal lines into the reserve, and the guard on a harsh tie

Written 2026-11-20 10:58 UTC by GOALS-1 (the integrator), on `lane/goals-1-2026-11-20` (GR1 for goals landed at 84a8606b9). You build; GOALS-1 reads your diff line by line and re-runs your red and green.

## Read first, and no more
`CLAUDE.md`; `src/generators/people/goals.js` WHOLE (pass two, `groupOf`, `cellCandidates`'s reserve build); `src/data/people/goalFamilies.js`: the header, `cell`, `GOAL_LINE_MIN_MEMBERS`, `TIE_TYPE_TO_GOAL_SUBKIND`, `GOAL_RESERVE_LINES`, and the cells named below; `tests/generators/people/goalsNoRepeatedWording.test.js`; `tests/data/goalFamilies.test.js`; `tests/generators/bar8People.test.js` (how a per-line map like `GOAL_LINE_MIN_MEMBERS` is read and tested). READ ONLY: `src/domain/facts/drawDeclared.js`, `factVocabulary.js`. Another builder is editing `src/generators/power/relationshipArchetypes.js` and `src/data/npcData.js` in this tree: do not touch them.

## 1. The lines: EXACTLY these, into `GOAL_RESERVE_LINES` (the chair approved them at 10:48 UTC; not one word changes)
Each through `cell([...])`; bare strings unless a declaration is given.
- `TIES.rival_enemy.long`: "Earn {other}'s respect, if never their friendship." · "Leave a name that will be remembered longer than {other}'s." · "Come through the rivalry with {other} no meaner than they went into it." · "Keep the rivalry with {other} a fair one, fought in the open, for as long as it lasts."
- `TIES.rival_enemy.short`: "Keep out of {other}'s way this season, and get on with their own work in peace." · "Learn one thing from {other} this season, without letting {other} see it."
- `INSTITUTION.solvency.long`: "Make {house} known to every supplier as a house that pays on the day." · "Let {house} grow only as fast as the money comes in, and no faster." · "Leave the books of {house} so plain that whoever comes next could take them up." · "Deal fairly with everyone {house} deals with, in good years and bad, and be trusted for it."
- `INSTITUTION.solvency.short`: "Put a little by at {house} every week this season, however small the sum." · { line: "Win better terms from one of those who supply {house}, before the season is out.", excludes: ['crisis: siege'] }
- `INSTITUTION.charter.long`: "Win rights for every house that does the same work as {house}, not for {house} alone."
- `RANK.enter.short`: "Learn how decisions are really made in {power}, and whose word settles them." · "Have their name put forward for the next place that opens in {power}." · "Keep every promise they make inside {power} this season, however small." · "Speak up for {power} once this season when it costs them something to do so."
- `RANK.enter.long`: "Be given a rank in {power} one day for years of faithful service, and ask for nothing sooner." · "Be trusted by every side inside {power}, so that a quarrel there is brought to them to settle." · "Change one thing about the way things are done in {power}, from the inside."
- `POWER.tense.long`: "Be the one person in {power} that {rival} will always agree to hear." · "Keep {power} out of every quarrel with {rival} that is not truly {power|its|their} own." · "Free {power} of any need for what only {rival} can give."
- `POWER.tense.short`: "Find one matter this season on which {power} and {rival} want the same thing." · "Give {rival} no fair cause for complaint against {power} this season."
Check `'crisis: siege'` is how the existing SUPPLY lines spell that exclusion; use their spelling exactly. The file's header counts (§6.6's totals) and the shape tests must learn the reserve: the reserve is NOT part of the cells' totals; add a shape test for the reserve (every reserve cell names an existing family/kind/vantage, uses only that family's slots, never repeats a line of its cell or of another reserve line).

## 2. The guard on a harsh tie (the chair's check of 10:48 UTC)
Two of the lines are gentle: "Earn {other}'s respect, if never their friendship." and "Keep the rivalry with {other} a fair one, fought in the open, for as long as it lasts." They must never be held where the holder's tie to {other} is an ENEMY's at `serious` or `mortal` or a RIVAL's at `bitter` (`ties.js :: RELATIONSHIP_STRENGTHS`). Build it as `GOAL_LINE_MIN_MEMBERS` is built: a per-line data map in `goalFamilies.js` (`GOAL_LINE_NOT_ON_TIES`: template → the `{ type: [strengths] }` it is refused on), read in `cellCandidates` from a new `extra.tie` (`{ type, strength }`) that the TIES branch of `familyCandidates` passes from the tie it already reads. A line so refused is marked `refused` (never dropped), so the list and every draw stay as they are; only reserve lines are in the map, and a reserve line is never drawn, so no draw moves anywhere. Pass two already skips a refused candidate.

## Tests (red first, then green; compute, never quote a pool's sentence)
Extend `tests/generators/people/goalsNoRepeatedWording.test.js` (or a sibling file):
- (f) with the real reserve: on the planted city of (a) and on a metropolis seed you search once and record, the template repeats fall (count before at 84a8606b9's state = no reserve, after = with it; read the "before" by running the test's own counter against a `git archive 84a8606b9` copy and record the number in the test's comment, never assert a quoted line) and (a)'s law holds.
- (g) the guard: a planted holder on an enemy tie at `mortal` whose rotation reaches the gentle lines passes over them; the same holder on a `mild` enemy tie may take them. Red before the guard.
- Keep green: `tests/generators/people`, `tests/data/goalFamilies.test.js`, `tests/generators/bar8People.test.js`, `tests/lint/proseDrawnAnchors.walker.test.js`, `tests/lint/namesInSentences.walker.test.js`.

## The count the chair asked for
Run `docs/chair/2026-11-20/content/goals/measures/goals-ties-depth.mjs` is NOT needed; instead add to your report: on the 300 towns (seeds `hxd-<size>-<i>`, i < 50, the sizes of `tests/components/pageCensusWalk.shared.mjs`), how many holders of the two gentle lines stand on an enemy tie at serious/mortal or a rival tie at bitter, (i) with the guard map emptied in a scratch copy, (ii) with the guard. Use a scratch script under the scratchpad, not the repo.

## Gates (to files, read by count lines, never through a pipe: `sh scripts/gate-tail.sh <cmd>`)
Red, then green, of the arms above; the files above; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite.

## Your files
`src/data/people/goalFamilies.js`, `src/generators/people/goals.js`, `tests/generators/people/goalsNoRepeatedWording.test.js` (or a new sibling), `tests/data/goalFamilies.test.js`. No rename. Do NOT commit or push; report back (files, differences from this brief, red and green with counts and log paths, the guard count (i) and (ii), anything undone).
