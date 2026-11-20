# GOALS-4 · builder 11 · the cure unit: the three reds the goals landing left on the line

Written by GOALS-4 at 20:30 UTC on 2026-11-20. The rulings are the chair's, in messages of 20:13, 20:27 and 20:30 UTC.
This file is your whole assignment. Where it is silent, STOP and ask GOALS-4. Do not invent a rule.

## Where you work

- BASE: `7495d3170`, the tip of `lane/goals-4-2026-11-20`. Its code equals `f839ce8e9`: 021557d4d with the join merged at 8196e5712.
- Set up: `git worktree add /home/user/wt-b11 -b lane/goals-4-2026-11-20-b11 <the commit that adds this file>`, then `ln -s /home/user/settlement-engine/node_modules /home/user/wt-b11/node_modules`. Work only there.
- Builder 10 is working in `/home/user/wt-b10` at the same time. Never touch that tree.
- Every heavy run goes through the mutex: `sh scripts/gate-mutex.sh --run -- <command>`, read by `sh scripts/gate-tail.sh`, never through a pipe. Write logs to `/tmp/claude-0/-home-user-settlement-engine/a807bdac-f58c-5701-a27f-e9cb3f61f7b9/scratchpad/logs-b11/`.
- No test runs with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX set.
- Commit by explicit paths. The author is `Claude <noreply@anthropic.com>`. NEVER push.
- NOT YOUR FILES: anything under `supabase/`, `src/domain/veil/`, `tests/security/`, `src/domain/display/gallery*.js`, `publicSafe.js`, `src/domain/facts/drawDeclared.js`, `src/domain/facts/factVocabulary.js` (read only), `src/generators/power/factionStanding.js`, `src/domain/summary/`, `src/domain/crisis/`, `src/domain/tension/`, `src/domain/traditions/`, `src/domain/seat/`, `src/domain/rulingPower*.js`, and `src/data/people/goalFamilies.js` (builder 10's).
- No register is re-taken by you except where an item below names its door. `writerReach` and `presumptionClasses` are never touched. No ceiling is ever raised.

## The measured facts you start from (GOALS-4, at 7495d3170)

- The red is `tests/generators/narrativeQualityCorpus.test.js`, "ties of one archetype never share a line until the pool is exhausted, then cycle". It has ONE offender:
  - seed `tie-prose-draw-overflow`, archetype `mutual_leverage`, both fields, head 8 and whole 13;
  - in that cast the admitted head is {0,1,2,3,6}; indices 4, 5 and 7 need "ruling body", and the overflow call hands drawTies no government;
  - ties t0–t4 print 3, 6, 0, 1 and 2;
  - t5 repeats 0, although reserve indices 8–12 are admitted for its pair and unprinted.
- Why: the reserve rescue in `src/generators/power/relationshipArchetypes.js` (around line 314) refuses every reserve line on `whole[id].trust !== trust`. Index 0's desc line declares trust "none"; no reserve line declares a trust.
- The red "relationship archetype pools hold eight variants each (GS-1)": peer_rivalry, mentor_legacy, wary_alliance and old_debt hold 10 in both fields, and mutual_leverage holds 13. All heads are 8.
- The F31 red (`tests/generators/powerStructure.test.js`) is ONE packed line: `relationshipArchetypes.js:216` (`const quiet = …`).
- The red in `tests/data/colourMarks4h.test.js`: `peer_rivalry.desc#8` is a colour variant, and the ledger the test reads says it is not.
- `tests/property/editCorpusRatchet.test.js`:
  - A3's not-idle count goes 327 → 328. The one new row is town `city|germanic|desert|road|civilized|golden-master-v3`, edit E5, layer channel, taken leaf `prominentRelationship` alone. That leaf is in no declared consistency group; A3's mixedOutside stays empty.
  - A7 goes [695, 275, 2179] → [695, 278, 2179].

## The work, in this order (one commit each unless stated)

1. **RED FIRST: the pronoun test.** Add one test file, `tests/generators/tieLinePronouns.test.js`. It renders every tie line of the eighteen archetypes in `STRESS_ECONOMIC_EFFECTS` (`src/data/npcData.js`): head and reserve, both fields, every index up to `size`, for a pair of each sex (male/male, male/female, female/male, female/female).
   - It asserts no object pronoun stands before a finite verb: "him would", "her would", "them would", "him has", "her is", "him is", "her has", "him was", "her was", "him will", "her will", "him had", "her had" and the like. Write the closed list in the test.
   - It asserts no pronoun is followed by "themselves" where a name stood.
   - Run it at the base. It must red on the `mutual_leverage` reserve line "…for an introduction him/her would rather keep to themselves." Commit it red.
   - LIST EVERY LINE IT REDS, in your report. If it reds any line other than that one, do NOT reword the other: STOP that item, carry on with the rest, and leave those lines red in the report for the chair to rule each wording.
2. **THE CHAIR'S REWORDING (20:27).** In `src/data/npcData.js`, the `mutual_leverage` reserve line `${r.name} has asked ${s.name} for an introduction ${s.name} would rather keep to themselves.` becomes `${r.name} has asked ${s.name} for an introduction that has not yet been made.`, verbatim. Keep its object shape and its `colour` mark. The pronoun test goes green on it.
3. **THE DRAW CURE (the chair's 20:30 ruling, the law as corrected).**
   - The law: a replacement that DECLARES a trust stands in only for the same trust; a replacement that declares NONE may stand in for a repeated index of any trust. In the reserve rescue (around line 314), `whole[id].trust !== trust` refuses only where `whole[id].trust` is declared and differs.
   - Apply the same reading to rule (ii)'s `whole[id].trust !== trust` ONLY if the chair's words cover it: "a replacement that declares NONE may stand in for a repeated index of any trust" covers every replacement. State in your report what you did.
   - The test that reds today ("same-page repeats") is the red, and it stays AS WRITTEN; it must go green.
   - CONDITION (a): the tie's STORED trust, and every stored field except the two prose fields and the variant index, is byte-equal before and after. Read where the stored trust comes from: today `statedTrust` is read from `resolved.line`, the resolution's line, not the replacement. If the stored trust, or anything stored or printed, is read from the PRINTED index's declaration anywhere (for example `proseVariant` looked up against `whole[...]`.trust by a later reader, in or out of this file), STOP and report where. Prove it with the two-tree run of item 8.
   - CONDITION (b): a planted arm in the test file where the reserve rescue is already tested (`tests/generators/tieReserveHead.test.js`, or the file that tests the rescue; name it). A reserve line that declares a DIFFERENT trust is still refused. Show it reds when the clause is removed, then restore the clause.
4. **F31.** Unpack `relationshipArchetypes.js:216` into one statement per line. No ceiling is raised. If a line ceiling then stands in the way, the reserve's code moves to a leaf module; STOP and tell GOALS-4 first.
5. **THE POOL-SIZE PIN (the chair's ruling).** "all 18 archetypes, both fields, eight distinct variants" becomes the law's pin:
   - the HEAD is eight, frozen and distinct;
   - a reserve adds distinct lines beyond it;
   - every archetype's two fields are the same length.
   The claim stays; the figure follows the law. Write the cause in the test's comment.
6. **colourMarks4h.** Find the ledger that test reads and its door. Re-record `peer_rivalry.desc#8` through that door only, with the cause: GOALS-3's reserve line is a colour variant, and the ledger predates it. If it has no door and the ledger is hand-written data, STOP and tell GOALS-4.
7. **editCorpusRatchet A3 and A7.** Re-record each by the file's own door: the pinned figure with a dated cause comment in the file's style. Use the received value at YOUR tip, after item 3, which may move them again; measure, don't assume. Cause for A3: the one row named above, which item 3 may alter, so name the row(s) at your tip. Cause for A7: E5 at the same town, by the tie draw. If A3's mixedOutside is ever non-empty, STOP.
8. **THE MEASURE AND THE TWO-TREE PROOF** (base 7495d3170 against your tip):
   - (c) on 150 a size, the PLACES that print one tie template twice (names masked), by size and by archetype, before and after. Write the script under `docs/chair/2026-11-20/content/goals/measures/b11/` and its output beside it.
   - Run `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <base> <tip> <workdir> --words=none` (golden 525, census 720): report rows changed, strings, non-string differences, and every path that differs outside `relationships[]`'s `description`, `tension` and `proseVariant`. Any other path is a STOP for condition (a).
   - (d) The born towns that move, by count: golden rows and census rows. UNSIGNED: do not re-record the golden master or the generationForkCensus A1.
9. **GREEN** at your tip, each its own log:
   - tests/generators/narrativeQualityCorpus.test.js, tests/generators/powerStructure.test.js, tests/data/colourMarks4h.test.js, tests/property/editCorpusRatchet.test.js;
   - the tie tests (`ls tests/generators | grep -i tie`) and tests/generators/people;
   - `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint`.
   - Do not run tests/lint whole: GOALS-4 runs it at the merged tip.

## Report

Write ≤300 words as `docs/chair/2026-11-20/content/goals/briefs/GOALS-4-B11-REPORT.md` and commit it. Send the same to GOALS-4. Give:
- the commits;
- red and green with counts;
- every line the pronoun test reds;
- what item 3 did to rule (ii);
- condition (a)'s proof;
- (c)'s figures before and after;
- (d)'s counts;
- the A3 and A7 figures and their rows;
- any STOP.
