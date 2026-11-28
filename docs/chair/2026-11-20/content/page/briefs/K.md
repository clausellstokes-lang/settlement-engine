# K: the misspelt keyword of the power band, a PLAIN correction (brief written 2026-11-20 12:56 UTC by PAGE-3; read BUILDER-RULES.md first)

**THE RULING (the chair, 11:36 and 11:48; PAGE-2-HANDBACK.md ruling 7; the seventh chair's PAGE-3 prompt, PART K).**
`src/generators/npcGenerator.js :: powerBandOfRole` matches keywords written with '_' ('guild_master', 'council_member',
'wealthy_merchant') against pool roles written with ' ' ('Guild Master'), so those roles fall to 'low'. A PLAIN correction:
fold '_' and ' ' alike when matching (no dark law, no alignment to the old band, no new draw: `generateNPCPowerLevel` keeps
its ONE `_rng()` call). Expected at 9,012 cards: Guild Master (221 cards) and Thieves Guild Master (34) to HIGH, Council
Member (18) to MODERATE (273 cards, 151 towns, PAGE-2's count). THEN, AS ITS OWN COMMIT: the Wealthiest Merchant (100 cards)
by a new stem 'wealthiest merchant' in the MODERATE list (the band of 'wealthy_merchant'). Enumerate every pool role
(`src/generators/people/poolMap.js` and every role the 300 towns print) and report EVERY role whose band moves: if any role
other than these four moves, STOP and report.

**TWO PHASES. PHASE 1, THE TRIAL (now): build the correction only (K1's code, no guard yet), commit it on your branch, run
the trial below, hand back, and STOP. PHASE 2 (after PAGE-3 rules on the trial): the guard, the pins, K2, by message.**

**THE TRIAL: CONFINED IN FIVE CLASSES, each COUNTED, nothing outside.** Run the two-tree tool (copy it from
`git show origin/lane/names-3-2026-11-20:docs/chair/2026-11-20/content/tools/confinement/<file>` for README.md, trees.mjs,
confine.mjs, run.mjs, born.census.js, agree.mjs, render.census.jsx into a scratch folder of your own; read its README):
`node <scratch>/trees.mjs 6b82c8e4a <your K1 commit> <workdir> --words=none` (golden 525, census 720). PAGE-3 has the base
births cached in `/tmp/claude-0/-home-user-settlement-engine/eb53df61-56a2-5423-a785-c3ec091e80c0/scratchpad/cw`
(`born-6b82c8e4a…`): pass that as the workdir to reuse them. Then write ONE classifier script
(`<scratch>/kClasses.mjs <born-before> <born-after>`; start from
`docs/chair/2026-11-20/content/page/measures/page-2/kTiesTrial.mjs`) that sorts EVERY differing leaf of every document into:
1. a corrected card's own `influence`, `power`, `structuralPosition` (and nothing else of that card unless a class below names it);
2. a tie touching a corrected card (archetype, strength, its prose, its stored index) and a goal that reads such a tie;
3. another tie of the same town in PROSE ONLY (`description`, `tension`, `proseVariant`: the town's rotation counter,
   `relationshipArchetypes.js :: createTieProseDraw`), and `prominentRelationship`'s quoted strings where they quote a moved tie;
4. the crisis cast where a card's power breaks a tie (`crisisCast.js :: exploiterCandidates`, `collaboratorCandidates`,
   `smallNameBacked`), with its twin and receipt;
5. goals of cards dealt AFTER a moved goal, re-dealt by the goals deal's held set (`goals.js :: cellCandidates`; 12 on the 300).
Print, per corpus: documents, identical, then each class's leaves and towns, then OTHER (leaves, towns, the first ten paths
with before/after). OTHER must be 0. A leaf outside the five is a FINDING: hand it back at once, do not explain it away.
Also print, from the after births: cards by band before and after; the first card of each power reading 'low' before and
after; the towns where a crisis role changes hands (two examples, named).

**PHASE 2 (on PAGE-3's word only).** (a) A guard test `tests/generators/powerBandKeywords.test.js` (red first on the base
for the keyword arm): every band keyword matches at least one pool role, and every pool role's band is stated in ONE table in
the test (the census in data, computed from `powerBandOfRole`, never quoted). (b) `tests/generators/roleCategory.test.js`
mirrors the keyword arrays verbatim: update its mirror in the same commit and say so. (c) K2: the Wealthiest Merchant, its
own commit, its own trial (K1 → K2), its own counts. (d) Stored fingerprints you move (the generator golden master and its
kin: `grep -l goldenCorpus tests`): NAME each with before and after; re-record NONE (the owner signs them at the close).

**FILES YOU OWN.** `src/generators/npcGenerator.js` (`powerBandOfRole` ONLY: another unit, L4, edits its call site in
`generateSingleNPC`; touch nothing else there), `tests/generators/roleCategory.test.js` (the mirrored arrays only), the new
guard test, your scratch scripts (commit `kClasses.mjs` under `docs/chair/2026-11-20/content/page/measures/page-3/`).

**HAND BACK** (BUILDER-RULES 7) with: the roles whose band moved and their card counts; the trial's table; OTHER's count.
