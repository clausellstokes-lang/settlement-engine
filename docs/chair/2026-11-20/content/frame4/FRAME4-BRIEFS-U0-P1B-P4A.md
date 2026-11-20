# FRAME-4 · briefs U0, U1 (P1b), U2 (P4a) — the crisis page's audience argument and the two owner-only lines

Written 2026-11-20T10:28Z (`date -u`) by FRAME-4 on `lane/frame-4-2026-11-20`. Your prompt names ONE unit; build that unit and nothing else. The chair approved U0 as drafted and ruled P1b and P4a owner-only (2026-11-20, 09:05–09:06 UTC); each point vetoable by the owner.

## For every unit of FRAME-4 (read before your unit's section; it binds you)

Written by FRAME-4, the integrating seat of the session sheet's lane (`lane/frame-4-2026-11-20`). You are ONE builder for ONE unit: one cause, one commit, red first. You work in the worktree and on the branch your prompt names; you commit there by explicit paths with the hooks on (never `--no-verify`); you never push, never reset, stash, checkout another branch or clean; you never edit `package.json` or `package-lock.json`.

**Read whole before you edit:** `CLAUDE.md`; `docs/DESIGN_CRISIS_TAB.md`; `docs/chair/2026-11-20/content/frame2/B7-CF10-PROPOSAL-RESULTS.md` (the measure, its scripts and your unit's proposal: its section IS your design); `src/domain/crisis/crisisCast.js`, `crisisPage.js`, `crisisHooks.js`; `src/domain/tension/sideArchetypes.js` and `troubleCast.js` (the standing trouble's ladder, rungs and outsider rule, which you reuse rather than copy); every file you change.

**The owner's words (2026-11-20, verbatim):** "make sure there is variability of who is relevant to a crisis where appropriate. Like the lords appointee is not always the one, it could be some other foreigner. As just one example, same with the guild leader and the garrison commander. Maybe the creditor is the criminal faction is some parts?" · "A calm town should be as it currently is… Don't invent drama capitalize on what's already there… We are not creating the campaign."

**The chair's law (each point vetoable by the owner):**
1. Every face is a person or a power THE RECORD ALREADY HOLDS, with its reason; an outsider is never named, only reached through a person on the record.
2. No new draw. A choice follows the record's own facts and, where a rate applies, `castHash(seed, kind, '<role>:<rung>')` against ONE frozen table (`CRISIS_COUNTERPART_TUNING`, beside `CRISIS_CAST_TUNING`; the first unit that needs it creates it). No new top-level numeric constant outside it.
3. A new sentence is one fixed sentence in a closed set (`CAST_REASONS` or a sibling frozen table), never free prose; level words (CF9: no word of alarm; it says no more than the record holds).
4. The names rule: a power in a sentence through `src/domain/display/governanceAccount.js :: powerNameInProse`; a person's second mention in one sentence by the pronoun of that person's own `gender` where no second person of that gender is in play, else the role, else the surname, else the given name; a pronoun or a role is never the ONLY reference to a person in a stored string.
5. A calm town is byte-identical: no frame, no line, nothing new.
6. NOT YOUR FILES: anything under `supabase/`, `src/domain/veil/`, `tests/security/` (except `tests/security/frameShareVeil.test.jsx`, the lane's own, and only if your unit's section says so), `src/domain/display/gallery*.js`, `publicSafe.js`, `src/domain/rulingPower*.js`, the power generator unless your section names it.

**Measure first.** Your first act is the measurement that could refute your section (its "MEASURE FIRST" list). If it refutes the section, STOP: write what you found in your results file and end; do not build around it.

**The proofs in your results file:**
- (a) **byte-identity** where your section names it (stored record and composed pages), over the pools named, with the counts: towns compared, towns identical, towns that differ and why each differs.
- (b) **red first:** your new test run against the tree WITHOUT your source change, recorded red with its failing titles; then green.
- (c) **the fixtures:** grep `tests/` and `tests/fixtures/` for your kind's name, `stressType`, `stressTypes`, `golden`; name every pin your change moves by file and test title. Re-record NOTHING.
- (d) **for the security reader:** every new kind of holder or line a reader of a shared page could now meet, and the stored or composed string that names it; what you would test. You edit nothing of theirs.

**Gates**, every run to a file under `/tmp/claude-0/-home-user-settlement-engine/57c37100-4349-5103-b1f0-d2e44b1c9e20/scratchpad/<UNIT>/`, never read through a pipe (`sh scripts/gate-tail.sh <command…>` prints the tail and exits with the gate's own code); never the whole suite; no GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in any command's environment:
- your test(s), red then green;
- `tests/domain/crisis` whole; `tests/domain/tension` whole; `tests/security/frameShareVeil.test.jsx`;
- every other test file that imports a file you change (grep; list the files with pass/fail counts);
- `npm run typecheck:ratchet`, `npm run typecheck:domain:strict`, `npm run lint` (errors 0).
A red you did not cause: name it with its failing title and leave it.

**Commit:** one commit (your section may say two) by explicit paths, the results file `docs/chair/2026-11-20/content/frame4/<UNIT>-RESULTS.md` (U0: `U0-CRISIS-AUDIENCE-RESULTS.md`) included. Message `feat(FRAME-4 · <UNIT>): <what>`; the body carries the red and green counts and the byte-identity counts, and ends with:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019yED1PrB8toGrEJtqXxojf
```

**Your final message:** at most 250 words: the sha; what stands in the role or line before and after, by kind; the byte-identity counts; the pins that move; the security reader's list; anything the measure refuted.

## U0 = THE CRISIS PAGE'S EXPLICIT AUDIENCE ARGUMENT (the gate P1b and P4a draw behind; as B3 did for the session sheet)

**Why:** the chair ruled (2026-11-20) that P1b's and P4a's new lines are drawn FOR THE OWNER ONLY, behind an explicit audience argument, with a reader who is not the owner getting today's crisis page byte for byte. Measured by the integrator at `993865a02`: `src/domain/crisis/crisisPage.js :: composeCrisisPage(settlement)` takes NO audience; its production callers are `src/components/new/tabs/CrisisTab.jsx`, `src/pdf/sections/CrisisSections.jsx` and `src/foundry/journalPages.js`. This unit builds the argument and threads it; it adds NO new line and changes NO page for any reader.

**Read whole too:** `docs/chair/2026-11-20/content/frame2/B3-AUDIENCE-GATE.md` (the sheet's gate: your model) and the three callers; `src/domain/summary/tonightSheet.js` (`TONIGHT_AUDIENCES`); `src/components/OutputContainer.jsx` (only where the Crisis tab is mounted and how the file tells the owner's surfaces from `publicDossier`, `playerView`, `readOnly`, `saveId`); `src/components/PublicDossierView.jsx`; `src/components/PartyLinkView.jsx`; `tests/security/frameShareVeil.test.jsx`.

**What to build:**
1. `composeCrisisPage(settlement, options)` takes `{ audience }`, with the SAME closed set the sheet uses (import `TONIGHT_AUDIENCES`; do not mint a second set; if importing it would make a cycle or cross a layer the walkers forbid, say so and stop). Owner-only content is composed only for `'owner'`; any other value, a missing argument or a missing `audience` is a non-owner: FAIL CLOSED. Today there is no owner-only content, so every page is byte-identical for every audience: the argument is the seam P1b and P4a draw behind.
2. Every production caller passes its audience EXPLICITLY. The PDF and the Foundry journal: `'owner'` only if they are built only from the owner's own record (read who calls them; say so in your commit body). The Crisis tab: thread the audience from where it is mounted, as the Table View's is threaded for the sheet; the owner's own surfaces pass `'owner'`, the gallery page and the party link a non-owner value; with no prop the tab composes as a non-owner. If the Crisis tab's mount is in a file of the security lane, or reaching it means moving a gate, STOP and report.
3. Tests (red first, recorded): a source walker that every production call of `composeCrisisPage` passes an explicit `audience` (red on the base: three calls without one); in `tests/security/frameShareVeil.test.jsx` (the lane's own veil test; keep every existing assertion), the gallery page and the party link (Reveal DM off and on) render the Crisis tab with a non-owner audience, and the owner's own surface with `'owner'` (red on the base: no audience reaches the tab); and every composed page byte-identical for every audience on a pool of every crisis kind (B7's `gen.mjs`, a few seeds a kind) and the calm pool.

**Proofs, beyond the common list:** every composed crisis page byte-identical to the base for every reader; the existing importer tests of the three callers and of `crisisPage.js` green with counts. Unit name: `U0-CRISIS-AUDIENCE`.

## U1 = P1b (RENDER ONLY): the infiltration's outside hand, reached

**The design:** B7 §P1b. Where an infiltrated town's instigator is absent with the stored reason "an outside hand, unnamed" (`crisisCast.js`, the `outsideHand` reason), the absence AND its stored reason STAY. At render, the line that shows that absence adds who reaches the hand: the keeper of a house where strangers lodge (`LODGING_HOUSE`), by the standing trouble's own outsider rule in `troubleCast.js` (the same "free" test, the same strongest-first order, the house in the record's own wording), e.g. "an outside hand, unnamed; Chae Yang keeps the alehouse where its people come and go." Rate 1 (a fact filling an absence): no hash. Where no lodging keeper stands, the line is today's, byte for byte. The hand itself is never named, and the infiltrator power's face (the bloc's speaker) is NOT used.

**MEASURE FIRST (each a figure in your results file before any edit):**
1. Every place the absent instigator's line is composed or rendered: `crisisPage.js`'s `absent` rows and every reader of them (the Crisis tab, the PDF's crisis sections and `crisisPrint`, the Foundry journal, the session sheet, any other: grep). Build the line ONCE, in the composition every renderer reads; if that is not possible, say why before building.
2. Which audiences see a crisis page's absence rows today: the owner's own pages; the gallery page; the party link (Reveal DM off and on). Write it in your results file for the security reader; it does not stop you. THE CHAIR'S RULING (2026-11-20): the new words are drawn FOR THE OWNER ONLY, behind the crisis page's explicit audience argument (unit U0, landed before you): a reader who is not the owner gets today's crisis page byte for byte, whatever today's shared page shows.
3. The reach on B7's infiltrated pool (re-born with B7's `gen.mjs`): absences with the outside hand; of those, how many have a free lodging keeper (B7 measured 5 of 14). On the 525-row golden master (B7's `goldens.mjs`): the infiltrated rows with the absence, and how many would show the new words.
4. A DM-edited cast (`section.edited`): the absence rows are not shown; the new words must follow them exactly.

**Proofs, beyond the common list:** RED FIRST ON BOTH SIDES: the owner's page gains the words (red on the base); a non-owner's page (no options, `{}`, each non-owner audience; the gallery read and the party link, Reveal DM off and on) is byte-identical to the base (green on both; the shared pages' side in `tests/security/frameShareVeil.test.jsx`, the lane's own veil test, every existing assertion kept). The STORED record byte-identical on the infiltrated pool, on a natural calm pool and on the 525-row golden master (nothing stored may change: no file under `src/generators/` changes); the COMPOSED crisis page (every section, every field) byte-identical for every town of every other kind, every infiltrated town with no lodging keeper or no such absence, and every calm town; the new words only where (3) says they fall. Your test: red first on the tree without your change.

**Your files:** the composition of the absence rows (expected `src/domain/crisis/crisisPage.js`, and the closed set its words live in) and the renderers only if (1) shows they must change; your test under `tests/domain/crisis/`. Unit name for paths and the message: `P1B`.

## U2 = P4a (RENDER ONLY): the creditor named on the debt crisis's page

**The design:** B7 §P4a, built as follows (the integrator's reading of B7, vetoable by the chair: B7 names both "the ladder and rates" and a drafted line that composes its rungs together; the drafted line is built, because a single fact of the record needs no hash). A derived line on the `indebted` crisis's page, OUTSIDE the stored role vocabulary (no cast row, no stored string): the lender is never named; it is reached through the face of the power the debt crisis raised as its creditor (today "Creditor's Representative", its face "the creditor's agent", on the record in 24 of 24 of B7's indebted pool), e.g. "The town owes an outside lender, never named; Deepa Mishra, the creditor's agent, speaks for them." Where the record holds an Outstanding Debt tie that touches that face, the line adds it in one fixed clause (e.g. "…, and the innkeeper Aarav Deshpande owes the agent besides"). A tie on the seat-holder that does not touch the face is the seat's private debt, not the town's: not used. Rate 1: no hash. The criminal power is NOT made the creditor here: the stored power says the creditor is external, so a page saying otherwise contradicts its own record (B7 §P4b); that is the generation unit P4b, which comes after you. Read the creditor from the record (the power the debt crisis raised as its creditor, by whatever marker the record itself carries; say which), not by its display name, so that a later change of who holds the debt is read without a second edit here.

**MEASURE FIRST:**
1. Where the debt crisis's page is composed and every renderer of it (as U1's (1)); the line composed ONCE.
2. As U1's (2): what a shared page shows of the crisis section today, for the security reader; the new line is drawn for the owner only, behind U0's argument.
3. THE STORED FIELDS THAT PROVE THE CREDITOR AND ITS FACE (the integrator's reading, to be confirmed or corrected by your measure, and named in your results file): the creditor power is the `indebted` entry's stored stake row (`stress[].cast.stakes[]`, its `factionId`) whose power's `desc` in `powerStructure.factions` opens with an `indebted` `RAISED_BY_CRISIS` text (`'creditorAgent'` or `'holdsDebt'`); its face is the roster person (`npcs[]`) holding rank 1 in that power (`memberships`). A town whose record holds neither the power nor its face prints today's page, byte for byte. On B7's indebted pool (re-born): the creditor power by name and arm (Creditor's Representative; Crown Creditors), its face present or absent, an Outstanding Debt tie touching the face (B7: 10 of 24), and the towns where no face stands (the line is then absent and the page is today's, byte for byte).
4. A DM-edited cast: say whether the line follows the edit state, and why.

**Proofs, beyond the common list:** RED FIRST ON BOTH SIDES, as U1's (the shared pages' side in `tests/security/frameShareVeil.test.jsx`). The stored record byte-identical on the indebted pool, a natural calm pool and the 525-row golden master; every composed crisis page of every other kind, and every calm town, byte-identical; the new line only on indebted pages with a face. Your test: red first.

**Your files:** the composition of the crisis section (expected `src/domain/crisis/crisisPage.js` and its closed set), the renderers that must show the new field (list them from (1); the smallest set), your test under `tests/domain/crisis/`. Unit name: `P4A`.
