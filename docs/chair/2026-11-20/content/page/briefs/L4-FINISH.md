# L4-FINISH: office secrets, split out and finished (PAGE-6's brief, written 2026-11-20 14:15 UTC by `date -u`)

Read `briefs/BUILDER-RULES.md` (its rules bind you; "PAGE-2" there means PAGE-6), then `briefs/S-v2.md` § L4 (the unit as
designed), then the WIP commit f2957d5be's message (origin `lane/page-2-2026-11-20-s-wip`, base b302805bc). The rows are
WRITTEN and read by the chair (`lines/L4-LINES-current-snapshot.md`, the seven in `lines/L4-SEVEN-TO-CHAIR.md`); you author none.
THE CHAIR'S READ OF 14:37 ADDS A FOURTH ROW TO EACH TITLE, appended after the three: the nine mercy rows of
`lines/L4-MERCY-TO-CHAIR.md` (eight as written, with their stakes; the dean's reworded by the chair to: "Allowed a burial in
consecrated ground that the rule forbids, because the family begged for it." with its stakes as written). Shared row sets (the
magistrate pair, the watch pair) share their fourth row as they share the three. So: 23 rows of batch 1 + the seven reworked +
these nine.

**THE UNIT, AS RULED.** The secret is drawn exactly as today; the held set receives the drawn text as today. THEN, draw-free, a
card whose title has office rows takes one (`pickVariant` keyed by the card's drawn name and title, walking in row order past a
row any card of the town already holds; the taken text joins the held set; where the rows run out, the drawn secret stays). No
two cards of one town show the same office secret. Other cards move ONLY by two town-level couplings, A COUNTED CLASS, named,
never cured and never hidden by a new draw: `people/castPowers.js :: CarriedSecrets` (the mints) and
`narrativeGenerator.js :: buildPoliticalNarrative`'s shared override pass.

**S9 IS ON YOUR BASE.** The lane commit you are cut from holds S9's post-pass (pool-generic, with an `admits(row, card)`; its
hand-back says how a pool is registered). REGISTER THE OFFICE ROWS INTO IT, so a principled holder whose office row is venal takes
the next admitted office row (the mercy row) by S9's walk; MEASURE AND REPORT the count of principled office-holders who gain an
office secret by the mercy rows (and those left with none).

**YOUR TREE.** A worktree on a new branch `page6/l4` cut from THE LANE COMMIT in your dispatch message. f2957d5be holds L4 AND
the old S9 (refused by the chair: its walk inside the draw moved 40 other cards through the held set). Carry ONLY L4:
`git diff b302805bc f2957d5be -- <path>` applied to the lane commit for `src/data/people/officeSecrets.js`,
`tests/generators/officeSecrets.test.js`, `docs/chair/2026-11-20/content/page/S1-LINES.md`, and by hand ONLY the L4 hunks of
`src/generators/npc/factionLeaderSecret.js` (`settleOfficeSecret` and what it needs) and `src/generators/npcGenerator.js` (its
call site). NOT `npcData.js`'s `CRIMINAL_SECRET_HOLDER_TAGS`, not `admitsSecretRow` or any walk inside
`generateFactionLeaderSecret`, not `secretHolderTags.test.js`, not `S2-TAGS.md`. Any other file in that diff (the WIP's base
is older than the lane) is NOT yours: never carry it. Say exactly which hunks you took.

**WHAT IS LEFT, IN ORDER.**
1. RED AND GREEN on the lane commit: your test red on the unchanged code (quote the count line), green after.
2. MEASURE on the 300 (`docs/chair/2026-11-20/content/page/measures/page-2/measure.mjs`'s seeds; your own dump/diff, every stored
   field as JSON): office cards moved and in which fields; OTHER cards moved, each traced to ONE of the two couplings by name;
   towns with a repeated office secret (must be 0). A move outside these classes: STOP and report.
3. THE THREE TESTS ANCHORED ON SECRETS L4 CURED (yours to re-key, each its own hunk): `informantNoThievesGuild` (the priest),
   `rosterUnderworldNoName` A3 (the dean), `mintedFaceUnderworld` (a mint lord). For each: SHOW IT RED for the old reason first
   (the anchor's secret changed: quote the assertion), then RE-KEY BY CAUSE: find the seed/card where the fault the test guards
   still stands at the new code, and prove the re-keyed test red with the guarded fault planted, green restored. Never weaken.
4. THE THREE STORED FINGERPRINTS (`generatorGoldenMaster`, `espionageDormancyFence`, `worldFactRederive` A7): DO NOT re-record.
   Name each with its before and after (the figure or hash the assertion prints) in your hand-back; they stay red, signed by none.
5. THE GATES (BUILDER-RULES 5): your test; every test file importing `factionLeaderSecret`, `npcGenerator` or `officeSecrets`;
   `npx vitest run tests/lint` WHOLE; the two typechecks; `npm run lint`. Expected reds you do NOT cure: the three fingerprints;
   `sovereigntyLightingContract.walker` (file count +1); `proseWiringCensus.walker` if it moves; a mutation manifest row for a
   new test in an enforcer directory IS yours (one row, a sibling's form). Any other red: report by title, do not repair.
6. COMMIT by explicit paths, one commit, receipts in the message. Never push.

**HAND BACK** (at most 400 words): branch and commit; the hunks taken; red and green; the measure (office / other by coupling /
repeats); the three re-keyed tests (old red, new key, planted red); the three fingerprints before and after; each gate's line.
