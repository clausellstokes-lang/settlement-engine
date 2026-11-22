<!-- THE CHAIR'S TEXT OF PULL REQUEST #75's DESCRIPTION (rewritten 2026-11-19 for points 1 to 73). The record is the handoff
     and the hand-backs it names; this text is a summary of them for the owner. -->

## Status: NOT READY: the share veil (database changes 211 and 212) is being joined, by your word of 2026-11-19 ("Yes get 211 and 212 in there"), and CI is being fitted (the test ratchet outgrew its 135-minute limit: it is being split into six parts that run at the same time). The deploy waits for both.

You wrote, on 2026-11-18, in the chair's session: "yes: refresh the stored reference files and open the pull request." This is that pull request. Later that day you said everything but the next thirty-town read lands before the deploy (05:13 UTC), and "Yes to both" (about 19:07 UTC) for the last close's refresh and signing. All of it is now on this branch. On 2026-11-19 you added: "Yes get 211 and 212 in there": the share veil's two database changes join this pull request before the deploy (section 3).

Nothing here merges, deploys or touches the database by itself. **The merge, the deploy and the database changes stay your hand.**

- [x] the stored reference figures are refreshed, each by its own procedure (two closes; section 6);
- [x] the whole check is green on the branch's tip `8f3b8bf4b` (three machines, every test's time read; its four reds classed and cured at point 73; section 6);
- [ ] the share veil joined: 211 (frozen) and 212 finished, and 212 CLEARED by a fresh security reader (section 3);
- [ ] CI fitted: the test ratchet split into six parts with the same verdict (its last four runs took 113 to 134 minutes, two of them stopped at the 135-minute limit), and the two browser jobs' limits set by the workflow's own rule (a slow browser install stopped the end-to-end job at 8f3b8bf4b);
- [ ] after the join: the moved figures re-taken, the whole check, every CI job green on the final tip;
- [x] this description carries the veto list, the questions owed to you, what the closes re-took, and the known faults.

## 1. What this is, in plain words

The app builds a town from a seed. Since the last deploy (pull request #73, 2026-11-06) the work on this branch has had one aim: **a town's page must not say a thing that is false for that town.**

Four kinds of work are in it.

1. **The supply rule (yours).** A house that works a material (a smith, a brewer, a fish market) needs that material: from ground nearby, or bought in. Where neither holds, the page says so: the house is marked short, or it is shown as a failed venture. The dice for this are cast once, when the town is created, and every view (your page, a shared page, the gallery, the PDF, the Foundry journal) reads the same stored result.
2. **Declared lines.** Each sentence the page can print says what it needs to be true (a court, a wall, a harbour, food in store, a good bought in). It prints only in a town that has those things. Where the first sentence would be false, a twin that says what is true prints in its place.
3. **The page-truth rounds.** Thirty fresh towns were read cold, seven times over (the eighth read is after the deploy, by your word). Each false sentence found was traced to its cause and cured there, or it is listed in section 7 by name.
4. **The faults round and the last small round** (points 60 to 70): the leftovers of the seventh read cured at their causes, the checking tools repaired, and new lines written where a small place had fewer than three true lines to choose from.

Size: 7,113 commits and 4,412 files since `master` (at `8f3b8bf4b`).

Where the record is (all on this branch):

- Points 1 to 32: `docs/chair/2026-11-14/JOIN-17-HANDBACK.md`.
- Points 33 to 73, one row a point: `docs/chair/2026-11-17/sixth/LANDINGS-SIXTH.md`.
- The veto lists, sentence by sentence: `docs/chair/2026-11-18/close/VETO-LIST-33-53.md` and `docs/chair/2026-11-18/lastclose/VETO-LIST-48-70.md`.
- The two closes, figure by figure: `docs/chair/2026-11-18/lastclose/CLOSES-ACCOUNT.md`; each seat's hand-back beside it.
- The chair's own record: `docs/chair/2026-11-17/sixth/CHAIR-HANDOFF-SIXTH.md` on the branch `lane/chair-2026-11-08`.

## 2. What you do, in order

Nothing below happens by itself. Each step is yours; the chair can walk you through any of them in the chat.

1. **Read the veto list** (section 4) and the questions (section 5). Anything you veto is undone before the merge.
2. **The database first.** The branch carries the database changes of section 3 (nine, once the share veil is in). The runbook asks for them before the new app: `docs/DEPLOY.md`, "Database migrations (Supabase) — manual".
   - Rehearse on a copy: `npm run ops:migrations:rehearse`, then `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md`.
   - Apply to production from a clean checkout of this branch's tip: `npx supabase@2.122.0 db push` (always with the version number; a bare `npx supabase` now fetches a version that rejects this project).
   - Then the stamp file `supabase/applied-head.json` goes from 203 to the branch's last change (212 once the share veil is in) **on this branch**, with what your terminal printed. Until it does, the host refuses to build the app ("prod is at migration 203 while the repo head is …"). Tell the chair when the push is done and paste the output: the chair writes the stamp from it, as was done on 2026-09-20.
3. **Merge**: a merge commit, never a squash (the record cites commits by their hash; a squash would erase them).
4. **The app deploys through CI** once the six required checks are green on the merged commit. The host's daily allowance must be free at that moment (section 4.6, item 2).
5. **The edge functions**, by hand, from a clean checkout of the merged commit: `bash scripts/deploy.sh` (`docs/DEPLOY.md`, "Edge function — manual"). This branch changes `_shared`, `engine-generate`, `engine-version`, `generate-narrative`, `send-email` and `admin-actions`.
6. **The proof**: `npm run ops:post-deploy` (`docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`).

No session touches a hosted database or a production credential.

## 3. The database changes, one line each

Seven are on the branch now (204 to 210), all reviewed before first use (the pre-deploy review of 2026-11-10); six replace a function and touch no stored data, one (208) restates one column. Two more join by your word of 2026-11-19 (211, 212: the share veil), at the end of the table; when they are in, `db push` applies all nine in order and the stamp goes from 203 to 212.

| File | What it does | Does it touch stored data when applied? |
|---|---|---|
| `204_engine_generation_report` | Adds one read-only report for the admin panel (what the engine service ran and cost). | No. |
| `205_drop_retired_faction_public_keys` | A shared town's public page stops carrying three fields the generator no longer writes. | No. |
| `206_public_card_veil_bit` | The public page shows a person's house only where that card is marked not hidden. | No. |
| `207_public_hall_capture_veil` | The public page stops carrying the "who has captured the hall" state (it is derived from hidden allegiances). | No. |
| `208_party_link_independent_idempotent_veiled` | The party link: pressing "Unlisted link" again returns the same link; the link hides what is hidden and never reveals more; it no longer depends on the gallery listing. | **Yes, one column.** It restates `visibility` on the saved towns from whether a link exists, then adds a check on it. No link is made, moved or removed. |
| `209_surveyor_premium_only` | Your tier law of 2026-11-09 ("Premium only."): the Surveyor (the AI layer) is held by staff, premium accounts, founders, and accounts staff granted it. | No rows. **But from the moment it is applied**, an account whose only claim is a Surveyor plan purchase (purchases are closed until launch) no longer has it. |
| `210_public_prose_text_projection` | The public page carries the composed text blocks. | No. A shared town shows them after its next save: one save per shared town is owed. |
| `211_server_side_share_veil` (JOINING) | The share veil, first part: the server withholds every trace of a house the DM hid (its name, its income row, sentences and lists that name it) from every non-owner read: the gallery, the party link, an import, the public page, the map. Frozen and security-reviewed on 2026-11-13; its apply pack is kept. | No stored data; it replaces the read functions. |
| `212_share_veil_later_cures` (JOINING, NOT YET CLEARED) | The share veil, second part: the cures for leaks the security reviewers found after 211 was frozen (names in other scripts or cases, derived lists, history notes, covert ties), within a cost limit (no read more than twice 211's time, none failing where 211 serves). **Not applied until a fresh security reader clears its final text.** | No stored data; it replaces the read functions. |

## 4. The veto list

Each item is the chair's or a seat's call under your delegation. Each can be vetoed; say the number or the name.

The full lists, sentence by sentence with file and line, are on this branch: `docs/chair/2026-11-18/close/VETO-LIST-33-53.md` (points 33 to 47 and 53) and `docs/chair/2026-11-18/lastclose/VETO-LIST-48-70.md` (points 48 to 70: 47 new or changed sentences, 23 older lines under new conditions, 9 lines taken away, 9 new facts a sentence may ask for, 45 rulings by name, 19 low notes). Points 1 to 32 are indexed in the first list's last part.

How counts are given: "the 900" are the program's test towns (720 + 150 + the thirty of each read); "the 525" are the reference towns whose exact output is stored.

### 4.1 New rules that change what a page prints

Points 33 to 53:

1. **The supply odds** (point 33). For each house the dice give: its ground still there, 45 in 60; its material bought in, 45 in 60; a failed venture, 3 in 60. These odds and the table of "other users of a material" (butcher, chandler, bowyer, river boatyard, thatcher, furrier, tailors, dyer, alehouse: never a failed venture) are yours to change.
2. **No town carries two words for one good on its imports** (point 33).
3. **The war's iron** is read from facts every view keeps, not from the DM's plot hooks (point 33).
4. **New conditions on old desk lines** (point 37): the gaol line needs a gaol; "the town lives off their passing" needs a town or larger; the two "eats well" lines need food secure or better; the granary and "deep stores" lines need three months of stores; "keeps the peace" and "order holds" need a law that has not collapsed; the brewer's tavern lines need a tavern.
5. **New need tables** (points 40, 42): the butchers need livestock; the established apothecary needs herbs; the maltster needs a grain surplus; game stocks the butchers.
6. **Under a siege**: a house living off a proven ground is "Curtailed by the siege."; no import is named as "arriving"; a house whose every chain is stored "Impaired" no longer counts as at work (points 33, 40, 45).
7. **The fish swap** (point 53): where a town's own fishing grounds are used up and its fish is bought in, the fish market's "Fresh fish retail" row becomes the catalogue's "Preserved fish". 30 of the 720 towns.
8. **Scenes** (points 45 to 47): the "long and steady" history line is refused under a live siege, famine, occupation, plague or war.
9. **The PDF and the Foundry journal read what the tabs read** (points 38, 44).

Points 48 to 70 (the most visible; the full list has 62):

10. **The watch** (points 48, 57, 66): its service line reads the Legal row's own court; the by-day lines read the hours the force keeps (a gate is a post, a levy at need walks no round, ruling FR9); the threat assessment reads the court and the prison through the Legal row.
11. **The people** (points 50, 58, 62): the swap of two houses' handlers is cured (the one-way deal stays, ruling BR13); the crisis rows that presume a command go to a holder who has one; a person's hook is true of the house and the seats they hold.
12. **The desks** (points 51, 52, 59, 64): lines that presumed imports, an uprising, a court or stores are each declared, with twins; the record-of-crimes lines need a court or a gaol that keeps one; "nothing new goes up" is refused where a building house works.
13. **The need list** (point 61): it keeps a need where a live house is short of it.
14. **The fair, the luxury quarter and the fish cards** (point 65): they read the need list and the bought fish; a crisis the dice rolled is read by the house descriptions on the final record.
15. **The supply rule's leftovers** (points 63, 68): the second ring of houses, the failed venture's pick read once, wool and hides read their grounds, the common proves its pasture.
16. **Small places** (point 70): every town has at least three true lines in each of the Defense desk's four safety pools; the SUPPLY goals ("want") name only goods the page's own need list prints.
17. **The numbering of the sentence pools is now guarded** (point 64, ruling FR7): a pool's numbers never move; a correction in place needs a row naming its ruling.

### 4.2 New or changed sentences

Points 33 to 53 (unchanged from the first close):

| Point | The words | Where, and how often |
|---|---|---|
| 33 | Marks "Abandoned: a failed venture." and "Failing: a failed venture." (your own words) | The house's card and rows. 11 of the 720 towns. |
| 33 | "The {house} stands abandoned, a venture of an earlier time: no {material} lies near and none is brought in." / "The {house} is failing: no {material} lies near and none is brought in." | Resources tab, a town with a failed venture. |
| 37 | Eight twins on the desks, among them "{settlement} has no court sitting and no gaol in use." | Each only where its first line would be false. |
| 39 | "The digging goes on here, but the metalworking stands idle, short of what it needs." | The income row "Iron & Metalwork". 2 of the 720. |
| 40, 42 | Marks "Short of grain.", "Short of livestock.", "Short of medicinal herbs." | The existing mark form, in new houses. |
| 45, 46 | "A laden cart or two comes down from the workings in a day, and no more." | A thorp or hamlet with a working quarry or mine. |
| 45 | "The {X} is the one great event in its past, and what it faces now may be the second" / "No great event marks its past, …" | A town under a live hard crisis. |
| 47 | "Magic is still a trade in {name}: the signs still offer it by the hour, but the work is slow and dear for want of what it takes." | Allowed in 9 towns; drawn in none of the 900. |

Points 48 to 70 (47 sentences; a few here, every one in the full list with its file, line and towns):

| Point | The words | Where |
|---|---|---|
| 58 | The title "Emira" (only; Sheikh, Wali, Imam and Qaid keep one form, ruling BR14) | Female holders of one-word office titles. |
| 61 | "{settlement} feeds itself and has nothing to spare. Some of what its work needs does not reach it, and there is no line for anything else." (DS-ECO-8 POOR v6) | Economics, a poor town with an unmet need. |
| 64 | "{settlement} has no court and no gaol. Custom and neighbours answer what they can, and the rest goes unanswered." (DS-DEF-3 Unsafe v4) | Defense, an unsafe town with neither. |
| 65 | The fair's three twins, the luxury quarter's two, the fish card's three | The house's card, the Institutions tab and the PDF, where the first line would be false. |
| 66 | The holding cells' twin "Short-term detention until a fine is paid." | The 11 "Prison only" towns. |
| 70 | Ten lines at the ends of DS-DEF-3's four small-place safety pools (Moderate v9, v10; Safe v6, v7, v8; Very Safe v6, v7; Unsafe v5, v6, v7), among them "At {settlement} old wrongs are remembered for years, and some are still being argued over." and "Neighbours at {settlement} have begun to suspect one another, and few will lend a tool or a coin now." | Defense, a small place that keeps order by its own people. |
| 70 | Four SUPPLY "want" goals (two short, two long), naming only goods the page's need list prints | A person's card where a need is unmet. 61 cards over the 900. |

### 4.3 New vocabulary

Facts a sentence may ask for: `trade at work: ironwork in full` and `fish taken here` (point 45); `trade at work: building` (point 59, with the brickmaker named in it: vetoable); `critical import brought in` (point 59); `need not brought in` (point 61); `court or gaol` (point 64); `fish bought in` (point 65); `force walks by day` (point 57); and the `want` cell of the SUPPLY goals (point 70).

### 4.4 Earlier decisions overturned on this branch

The full lists have them (eleven in the first, eighteen in the second). The ones a reader of pages would notice:

- The fish swap first built by one seat printed "Preserved fish" in 4 idle towns where it was false. It was reverted and rebuilt for bought fish only (point 53).
- "Ritual wood and herbs" no longer feeds an apothecary (point 42).
- The common grazing land now proves its pasture (point 68, replacing an earlier ruling).
- Three lines whose first wordings a second reader vetoed were rewritten in place before landing (Unsafe v4, Moderate v9, Unsafe v6; rulings FR18, LR6).

### 4.5 Not wording, but yours to know

1. **A paragraph was added to `CLAUDE.md`** under your words "I give the word" and "Do both": a builder session seated by the chair may commit and push its own work on its own `lane/*` branch, by plain pushes with the hooks; never a force push, never `master`, never a pull request. Vetoable.
2. **Stored reference towns moved**, each move declared by its seat and traced at the closes: at the last close 222 of the 525 (section 6).
3. **The ratchet arm A5** (a test of the edit corpus) runs near its limit (561 s against 600 s at the last close).
4. **The earlier account's sessions** (the fifth chair and its seats) are unreachable from this account and should be paused or archived by your hand.
5. **Pull request #74** ("Git fixtures run behind one door") is another session's draft. This program did not touch it.

### 4.6 The chair's rulings at the closes

1. **The worker bundle's size** (your deferral of 2026-11-18, 03:42 UTC: "I defer these to you"). The bundle that generates a town off the main page grew at the first close (2,356,121 → 2,525,028 bytes, ruling CL12) and again at the last close (→ 2,579,708, +54,680, most of it point 66). The worker flag is still off (generation runs in the page). Each rise is tallied by the landing that caused it; shaving it is code clean-up, which you tabled. The engine chunk rose 5,754 bytes and the first paint 11,927 (raw) at the last close.
2. **The host's daily allowance** (the same deferral). `vercel.json` tells the host not to build `lane/*` branches (measured: no deployment was asked for on the line's pushes). **The plan upgrade stays yours.**
3. **Debt counts raised by name, never forgiven** (rulings CL14 and LC2): one test counts sentences whose declarations a census cannot yet read; each new one is recorded as owed with its cause (six at the last close, named).
4. **The numbering of fourteen sentences stands as one builder changed it** (ruling CL19). A town saved on the live site may show a different sentence of the same pool in seven places of the Defense desk after the deploy; none is false. Since point 64 a guard refuses any further renumbering. If you want the old numbers back, say so before you merge: once deployed, the new numbers are the numbers.
5. **Three registers of pools gained rows by name** (ruling LC1): pool dominance (where one sentence of a pool prints most of the time) records the last rounds' new pools; the one lopsided pool (two lines, one printing 99 % of the time because the other is true in few towns) is on the after-deploy list for variety.
6. **The failed-venture floor** was re-recorded at its measured count (10 → 9 failed ventures over the 720, ruling FR17); the odds (3 in 60) are unchanged.
7. **A stored inventory of the town map's site reading was re-recorded** (ruling CL15). The map is not shown and map work is deferred to PLAT, so nothing follows from it here.
8. **Named as debt, no gate added:** the CENSUS-4 declaration ledger has 1,721 rows gone stale as the pools grew (positional rows); re-taking it is not one procedure's run. It is recorded, and no new check is added for it.

## 5. The questions owed to you

None of these blocks the merge. Each says what the pages do today.

1. **Should a chain card say it runs on bought iron?** In four test towns the card "Iron & Metalwork" prints "Impaired" with "From Iron deposits (depleted)" while the income line says metal is worked here and the houses are fed by trade. Ruled not a fault; nothing built. A new word on the card, or leave it?
2. **The war bar's word.** The PDF's war bar prints "Adequate" in 6 of the 720 towns that have no wall, garrison, militia, watch or company. The cure needs the military score held where it is written. Build it after the deploy, or leave it?
3. **The butchers of two towns** (r2r-city-43, bar0-town-calm-rand-46) are at work on "livestock for meat and draft" beside imports of "Raw hides and animal products". One-good rule, the need list, or as it is?
4. **A saved town's text after a ruin**: a stored holding-cells row keeps its words after the town's court is ruined (a saved record's text; changing it is yours).
5. **Told, not asked:** the answered ones. The one-way handler deal stays as design and the swap is cured (BR13); "Emira" is the only paired female title (BR14); a gate held at night is a post, not a round (FR9).

## 6. The closes: what was refreshed

Two closes ran. The first (2026-11-18 morning) covered points 33 to 53; the last (2026-11-18/19 night) covered points 54 to 70 and landed as points 71 to 73. Each stored figure was re-taken through its own procedure and laid to the landed points that moved it; a register of debt only shrank, except where section 4.6 names a ruling. Figure by figure: `docs/chair/2026-11-18/lastclose/CLOSES-ACCOUNT.md`.

- **The golden master** (the exact output of the 525 reference towns), signed through its door under your "Yes to both" (the signing announced in the chat at 01:04 UTC): **222 of 525 rows moved**, every one traced to a landed point, none unexplained, no person or name in or out. The espionage fence: 116 of 360. The dossier text manifest: 832 of 1,050. The year-long news feed (the herald desk) did not move.
- **The engine bundle** (the copy of the generator the server runs): rebuilt from the tree three times, bytes equal (435 → 442 inputs, each laid to its point).
- **The size ceilings**: section 4.6, item 1.
- **The words' books** (the census of sentences, the ledgers, the norms): 3,054 sentence variants; the wiring census, the shift register and the corpus pins re-taken by their own procedures.
- **The registers of known debt**: the over-claims base shrank 45 → 18; the presumption classes' ceiling shrank 1,789 → 1,785; the presumed-things register 4,629 → 4,635 by six lines proved true by construction (court or gaol, "no gaol", the fish market's "market"); the under-claims took one owed row of six named lines (LC2).
- **Tests re-keyed** where a test pinned an old place or count: by identity, never loosened (one stale anchor at the last close, `tailHouses1Gaps`).
- **A fault of form cured**: one test of point 64 set a suite budget in a form the codebase's rules forbid; the budget moved onto each test, nothing else.
- **The whole check** (three machines, 42,247 tests at c02735d57): four reds, each classed before it was touched and cured by its class (point 73): one stored count not yet re-taken (the sentence-variant pin, 3033 → 3054) and three test samples that the landed work had truly changed (a dairy now supplied, a forest now proven, two commons that now prove their pasture), each moved by identity to a town where the same claim still bites; no claim loosened. The validators, both type gates, lint and both debt doors are green. **Every test's time was read**: five tests on the default 20-second limit ran 10 to 14 seconds under load; each now carries a limit of its own with its measured time (point 73), so CI's runners do not time out as they did after the first close.
- **Left red on purpose**: none.

## 7. Known faults still on the pages, by name

Each is true at this branch's tip. The first close's list had ten. Eight are cured on this branch (the PDF's two lines at point 55; the fair and the luxury quarter at 65; r2r-hamlet-27's dairy at 63; the desk line beside "Prison only" at 59; the brewer's secret and the granary lines at 59; the supply rule's leftovers at 63 and 68; the siege's "trade at work" at 66); the fish lines are cured at points 53, 62 and 65 down to the two small remainders of item 2 below; the forge smoke (item 1) stays by ruling. What remains:

1. **Three besieged towns** print "Forge smoke hangs over everything here, and the ring of the anvils never quite stops." with unmarked smiths beside an "Impaired" chain card. Accepted by ruling.
2. **Fish, two small remainders**: the town and city fish cards' hedged lines beside "Preserved fish" (40 of 640 bought-in markets); the fishmonger's line "Talks about the boats, the weather and what came in this morning." in 1 town of the 720 where no catch is landed.
3. **Eight towns whose stored grazing land is spent** beside a common still read "Short of livestock." (the record's own depletion wins).
4. **Title lines are drawn before the imports are written**, so a line the final record makes true can be passed over (no false line prints; a true one is missed).
5. **The entrepôt card** names "Hunter's lodge » Furs and pelts" as a source beside the lodge's own "Short of game.".
6. **Words that read stiffly**: two "want" goals say a need list's label verbatim ("livestock for meat and draft"); "the work at the citizen militia" where the house is a militia; the same "keeps no court and no gaol" twice on one tab in one town (Skálgarde).
7. **Found by the chair's own walk and play of the built app (2026-11-19)**: a "the" dropped where the ruling body's name replaces "the council" ("Merchant Council has been debating market levies…", "and Arcane Council is avoiding the question"); the watch's service card says it "holds the gates" in towns with no walls; one person's goal speaks of paying back a debt their relationship card says is owed to them; "Magical Capability: Critical" shows in red in towns with no magic.
8. *(Not a fault on a page: the town map is not shown, and map work is deferred to PLAT by your word of 2026-11-18.)*

## 8. What is not in this pull request

- (Until the share veil is joined: 211 and 212, section 3. They are being brought in now, by your word.)

- **The eighth thirty-town read**: after the deploy, by your word (2026-11-18, 05:13 UTC).
- **The after-deploy list**: the faults of section 7, the lopsided pool's variety (4.6, item 5), the six owed lines (4.6, item 3), the CENSUS-4 ledger (4.6, item 8), and three code comments in the observed-shape tools that still say "eleven new" where the register (correctly) holds 10 new and 1 grown: they change only with that register's next governed step.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01FbPLbcLDSJzZFzb5B7EjxR
