<!-- THE CHAIR'S DRAFT OF PULL REQUEST #75's DESCRIPTION. Every `<<…>>` is filled from a close seat's hand-back before
     this text is put on the pull request. Nothing below the first line of dashes is the record: the record is the
     handoff and the hand-backs it names. -->

## Status: <<DRAFT, NOT READY TO MERGE | READY FOR YOUR READ>>

You wrote, on 2026-11-18, in the chair's session: "yes: refresh the stored reference files and open the pull request." This is that pull request.

Nothing here merges, deploys or touches the database by itself. **The merge, the deploy and the seven database changes stay your hand.**

- [<< >>] the stored reference figures are refreshed, each by its own procedure (the close);
- [<< >>] `npm run check` is green on the branch's tip `<<tip>>`;
- [<< >>] every CI job on this pull request is green on that tip;
- [x] this description carries the veto list, the questions owed to you, what the close re-took, and the known faults.

## 1. What this is, in plain words

The app builds a town from a seed. Since the last deploy (pull request #73, 2026-11-06) the work on this branch has had one aim: **a town's page must not say a thing that is false for that town.**

Three kinds of work are in it.

1. **The supply rule (yours).** A house that works a material (a smith, a brewer, a fish market) needs that material: from ground nearby, or bought in. Where neither holds, the page says so: the house is marked short, or it is shown as a failed venture. The dice for this are cast once, when the town is created, and every view (your page, a shared page, the gallery, the PDF, the Foundry journal) reads the same stored result.
2. **Declared lines.** Each sentence the page can print now says what it needs to be true (a court, a wall, a harbour, food in store). It prints only in a town that has those things. Where the first sentence would be false, a twin that says what is true prints in its place.
3. **The page-truth rounds.** Thirty fresh towns were read cold, eight times over. Each false sentence found was traced to its cause and cured there, or it is listed in section 7 by name.

Size: <<6,670+N>> commits and <<4,338+N>> files since `master`.

Where the record is:

- Points 1 to 32: `docs/chair/2026-11-14/JOIN-17-HANDBACK.md`.
- Points 33 to 47 and 53, one row a point: `docs/chair/2026-11-17/sixth/LANDINGS-SIXTH.md`.
- The close: `docs/chair/2026-11-18/close/` (each seat's hand-back; `CLOSE-ACCOUNT.md` is the summary).
- The chair's own record: `docs/chair/2026-11-17/sixth/CHAIR-HANDOFF-SIXTH.md` on the branch `lane/chair-2026-11-08`.

Points 48 to 52 are **not** in this pull request. Section 8 says what they are.

## 2. What you do, in order

Nothing below happens by itself. Each step is yours; the chair can walk you through any of them in the chat.

1. **Read the veto list** (section 4) and the questions (section 5). Anything you veto is undone before the merge.
2. **The database first.** The branch carries seven database changes (section 3). The runbook asks for them before the new app: `docs/DEPLOY.md`, "Database migrations (Supabase) — manual".
   - Rehearse on a copy: `npm run ops:migrations:rehearse`, then `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md`.
   - Apply to production from a clean checkout of this branch's tip: `npx supabase@2.122.0 db push` (always with the version number; a bare `npx supabase` now fetches a version that rejects this project).
   - Then the stamp file `supabase/applied-head.json` goes from 203 to 210 **on this branch**, with what your terminal printed. Until it does, the host refuses to build the app ("prod is at migration 203 while the repo head is 210"). Tell the chair when the push is done and paste the output: the chair writes the stamp from it, as was done on 2026-09-20.
3. **Merge**: a merge commit, never a squash (the record cites commits by their hash; a squash would erase them).
4. **The app deploys through CI** once the six required checks are green on the merged commit. The host's daily allowance must be free at that moment (section 4.6).
5. **The edge functions**, by hand, from a clean checkout of the merged commit: `bash scripts/deploy.sh` (`docs/DEPLOY.md`, "Edge function — manual"). This branch changes `_shared`, `engine-generate`, `engine-version`, `generate-narrative`, `send-email` and `admin-actions`.
6. **The proof**: `npm run ops:post-deploy` (`docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`).

No session touches a hosted database or a production credential.

## 3. The seven database changes, one line each

All seven were reviewed before first use (the pre-deploy review of 2026-11-10). Six replace a function and touch no stored data. One (208) restates one column.

| File | What it does | Does it touch stored data when applied? |
|---|---|---|
| `204_engine_generation_report` | Adds one read-only report for the admin panel (what the engine service ran and cost). | No. |
| `205_drop_retired_faction_public_keys` | A shared town's public page stops carrying three fields the generator no longer writes. | No. |
| `206_public_card_veil_bit` | The public page shows a person's house only where that card is marked not hidden. | No. |
| `207_public_hall_capture_veil` | The public page stops carrying the "who has captured the hall" state (it is derived from hidden allegiances). | No. |
| `208_party_link_independent_idempotent_veiled` | The party link: pressing "Unlisted link" again returns the same link; the link hides what is hidden and never reveals more; it no longer depends on the gallery listing. | **Yes, one column.** It restates `visibility` on the saved towns from whether a link exists, then adds a check on it. No link is made, moved or removed. |
| `209_surveyor_premium_only` | Your tier law of 2026-11-09 ("Premium only."): the Surveyor (the AI layer) is held by staff, premium accounts, founders, and accounts staff granted it. | No rows. **But from the moment it is applied**, an account whose only claim is a Surveyor plan purchase (purchases are closed until launch) no longer has it. |
| `210_public_prose_text_projection` | The public page carries the composed text blocks. | No. A shared town shows them after its next save: one save per shared town is owed. |

## 4. The veto list

Each item is the chair's or a seat's call under your delegation. Each can be vetoed; say the number.

The full list, sentence by sentence with file and line, is `docs/chair/2026-11-18/close/VETO-LIST-33-53.md` (points 33 to 47 and 53). Its last part indexes the veto sections of points 1 to 32, hand-back by hand-back.

How counts are given: "the 900" are the program's test towns (720 + 150 + the thirty of each read); "the 525" are the reference towns whose exact output is stored.

### 4.1 New rules that change what a page prints

1. **The supply odds** (point 33). For each house the dice give: its ground still there, 45 in 60; its material bought in, 45 in 60; a failed venture, 3 in 60. These odds and the table of "other users of a material" (butcher, chandler, bowyer, river boatyard, thatcher, furrier, tailors, dyer, alehouse: never a failed venture) are yours to change.
2. **No town carries two words for one good on its imports** (point 33).
3. **The war's iron** is read from facts every view keeps, not from the DM's plot hooks (point 33).
4. **New conditions on old desk lines** (point 37): the gaol line needs a gaol; "the town lives off their passing" needs a town or larger; the two "eats well" lines need food secure or better; the granary and "deep stores" lines need three months of stores; "keeps the peace" and "order holds" need a law that has not collapsed; the brewer's tavern lines need a tavern.
5. **New need tables** (points 40, 42): the butchers need livestock; the established apothecary needs herbs (the import word that feeds it is "herbs and forage", not any "herbs"); the maltster needs a grain surplus; game stocks the butchers.
6. **Under a siege**: a house living off a proven ground is "Curtailed by the siege."; the dossier names no import as "arriving"; a house whose every chain is stored "Impaired" no longer counts as at work (points 33, 40, 45).
7. **The fish swap** (point 53): where a town's own fishing grounds are used up and its fish is bought in, the fish market's "Fresh fish retail" row becomes the catalogue's "Preserved fish". 30 of the 720 towns.
8. **Scenes** (points 45 to 47): the "long and steady" history line is refused under a live siege, famine, occupation, plague or war; where two twins are allowed, the last answers.
9. **The PDF and the Foundry journal read what the tabs read** (points 38, 44): the marks, the "Impaired" card word, the proven grounds, the used-up grounds.

### 4.2 New or changed sentences

| Point | The words | Where, and how often |
|---|---|---|
| 33 | Marks "Abandoned: a failed venture." and "Failing: a failed venture." (your own words) | The house's card and rows. 11 of the 720 towns. |
| 33 | "The {house} stands abandoned, a venture of an earlier time: no {material} lies near and none is brought in." / "The {house} is failing: no {material} lies near and none is brought in." | Resources tab, a town with a failed venture. |
| 33 | A peat cutter's mark reads "Short of peat." (was "Short of reeds.") | An idle peat cutter. |
| 33 | A proven ground prints in Nearby Resources with no word of plenty. | 171 of the 720. |
| 37 | Eight twins on the desks, among them "{settlement} has no court sitting and no gaol in use." and "{settlement} has no wall and no soldiers; its watch does not keep the peace in its own streets, and would be no answer to an army." | Each only where its first line would be false. The eight are quoted whole in the full list. |
| 39 | "The digging goes on here, but the metalworking stands idle, short of what it needs." | The income row "Iron & Metalwork". 2 of the 720. |
| 40, 42 | Marks "Short of grain." (maltster), "Short of livestock." (butchers), "Short of medicinal herbs." (apothecary) | The existing mark form, in new houses. |
| 45, 46 | "A laden cart or two comes down from the workings in a day, and no more." | The arrival scene of a thorp or hamlet with a working quarry or mine. |
| 45 | "The {X} is the one great event in its past, and what it faces now may be the second" / "No great event marks its past, and what it faces now may be the first" | The history line of a town under a live hard crisis. |
| 47 | "Magic is still a trade in {name}: the signs still offer it by the hour, but the work is slow and dear for want of what it takes." | Allowed in 9 towns; drawn in none of the 900. |

No other point adds a sentence. Points 38, 43, 44 and 53 add none: they move existing words to where they are true, or take a line away.

### 4.3 New vocabulary

Two new facts a sentence may ask for (point 45): `trade at work: ironwork in full` and `fish taken here`.

### 4.4 Earlier decisions overturned on this branch

The full list has eleven (its Part D). The ones a reader of pages would notice:

- The fish swap first built by one seat printed "Preserved fish" in 4 idle towns where it was false. It was reverted and rebuilt for bought fish only (point 53).
- "Ritual wood and herbs" no longer feeds an apothecary (point 42).
- A maltster in a calm town on a connected road stays unmarked (ruling BR20).
- A chain card that says "Impaired" beside a trade working on bought iron was ruled **not a fault**; see question 3.

### 4.5 Not wording, but yours to know

1. **A paragraph was added to `CLAUDE.md`** under your words "I give the word" and "Do both": a builder session seated by the chair may commit and push its own work on its own `lane/*` branch, by plain pushes with the hooks; never a force push, never `master`, never a pull request. Vetoable.
2. **Stored reference towns moved**, each move declared by its seat: <<the close's count: N of the 525>>.
3. **The ratchet arm A5** (a test of the edit corpus) ran within six seconds of its 600-second limit; it takes 3.6 times what it took on 2026-10-01. <<LEFT-KEYS K8: what was done>>.
4. **The earlier account's sessions** (the fifth chair and its seats) are unreachable from this account and should be paused or archived by your hand.
5. **Pull request #74** ("Git fixtures run behind one door") is another session's draft. This program did not touch it.

### 4.6 The chair's rulings at the close

1. **The worker bundle's size ceiling** (your deferral of 2026-11-18, 03:42 UTC: "I defer these to you"). The bundle that generates a town off the main page is <<2,525,028>> bytes against a ceiling of 2,356,121 (+<<168,907>>). The chair accepted the rise: the growth is the supply rule and the declared lines, the worker flag is still off (generation runs in the page), and shaving it is code clean-up, which you tabled. The other three ceilings rose under 25,000 bytes each: <<figures>>.
2. **The host's daily allowance** (the same deferral). The host refuses deployments ("more than 100" a day on the free plan) because every push to any branch asks for one. Two things were done: sessions now push rarely; and `vercel.json` now tells the host not to build `lane/*` branches (one line: `"git": { "deploymentEnabled": { "lane/*": false, "lane/**": false } }`; the host's documentation says this key takes branch patterns; `master` is not named and deploys as before). A branch cut before this change still asks until it takes the change in. **The plan upgrade stays yours** (it spends your money); it is the way to deploy sooner than the allowance frees. <<after the first push with the key: did the host skip it?>>
3. **A debt count was raised by name** (ruling CL14). One test counts sentences whose declarations a census cannot yet read. The rounds added <<N>> such lines; each is recorded as owed, with its cause, not forgiven. <<figures>>.
4. **A stored inventory of the town map's site reading was re-recorded** (ruling CL15): two rows moved by a correct change of the sand export. The map is not shown and map work is deferred to PLAT, so nothing follows from it here.
5. **The numbering of fourteen sentences stands as one builder changed it** (ruling CL19). Each pool of alternative sentences numbers its sentences, and the number decides which sentence a town gets, so that a saved town keeps its sentence between releases. The rule is that a new sentence takes the next free number. On 2026-11-16 one builder (BAR6-DEFDESK, `be3585040`) inserted seven new sentences in the middle of seven pools of the Defense desk, which pushed fourteen older sentences to new numbers. The guard that should refuse this was not switched on. **What it does:** after the deploy, a town saved on the live site may show a different sentence of the same pool in those seven places; none is false, because each sentence prints only where it is true. **Why it was left:** putting the old numbers back changes pages that the last read and two audits were made on, and re-opens every book keyed by number, late in the close. **This is now or never:** once deployed, the new numbers are the numbers. If you want the old numbers back, say so before you merge. After the deploy a builder switches the guard on.
6. **Two checkers were fixed, not the sentences they misread** (ruling CL17), and four house descriptions lost a stale "presumes nothing" mark (ruling CL18): <<DOORS-1A's hand-back>>.
7. **Known debt recorded only with proof** (rulings CL20 to CL22): <<DOORS-1B: the observed shapes by class; the 25 new presumption hits by proof; the two variety figures with their cause>>.

## 5. The questions owed to you

None of these blocks the merge. Each says what the pages do today.

1. **May one house's network be run by another house's boss?** Today both a one-way deal (106 networks in 56 of the 720 towns) and a two-way swap (20 networks in 11 towns) print. The chair kept the one-way deal and ruled the swap a fault; its cure lands after the deploy. Keep the one-way deal as design, or forbid it?
2. **Female forms of titles.** Today "Emir" and the other one-word office titles have one form. The chair allowed "Emira" only (not landed yet). Pair any others? Sheikh, Wali, Imam and Qaid have no female form.
3. **Should a chain card say it runs on bought iron?** In four test towns the card "Iron & Metalwork" prints "Impaired" with "From Iron deposits (depleted)" while the income line says "Metal is smelted or worked here." and the houses are fed by trade. Ruled not a fault; nothing built. A new word on the card ("runs on bought iron"), or leave it?
4. **A gate held at night, read as a day's round.** Once the watch's follow-up lands (after the deploy), three test towns would print a by-day line for a force that only holds a gate at night. Does that reading stand?
5. **Told, not asked:** the ratchet arm's slowness (4.5 item 3).

## 6. The close: what was refreshed

<<THE CLOSE'S ACCOUNT, from the seats' hand-backs: each stored figure, its old and new value, and the landed point that moved it. In short form here; whole in `docs/chair/2026-11-18/close/CLOSE-ACCOUNT.md`.>>

- **The golden master** (the exact output of the 525 reference towns), signed through its door under your yes: <<N of 525 rows moved; each surface's predicted and measured count>>.
- **The engine bundle** (the copy of the generator the server runs): rebuilt from the tree.
- **The size ceilings**: <<four figures, old and new>>.
- **The words' books** (the census of sentences, the ledgers, the norms): <<counts>>.
- **The registers of known debt**: <<each: old, new, why>>. A register only shrinks, except where section 4.6 names a rise.
- **Tests re-keyed** (a test that pinned an old place or count): <<count, by seat>>.
- **Law reds cured at their cause**, no town and no page moved (the 525 hashed whole, the thirty rendered, equal): <<S1, S2>>.
- **Left red on purpose**: <<none | list>>.

## 7. Known faults still on the pages, by name

Each is true at this branch's tip. None is new in this pull request unless it says so.

1. **The PDF prints "Little metal is worked here while the metal trade is short of what it needs."** where the tab prints "Metal is smelted or worked here." 95 of the 720 towns. Its cure is built and lands after the deploy.
2. **The PDF prints the head line "A row marked short is what its house makes when supplied." twice** where the only mark is a failed venture's. 9 of the 720. Cure built, lands after.
3. **Fish lines still false where the fish is bought in or the grounds are spent**: one income line (21 rows), the fishmonger's talk of "the boats, the catch" (6), the fish market's card text, the fisher's landing's "Fresh fish", one arrival scene. Each needs a new fact or a catalogue change.
4. **The fair and the luxury quarter** speak of luxuries where none is brought in: 5 towns; "silk, spice, and precious things": 7 (plausible, not proven).
5. **One test town (r2r-hamlet-27)**: "The dairy farmer is failing: no livestock lies near and none is brought in." beside a Shepherd, Common grazing land and a Stable yard. A fault of how the town is created.
6. **A desk line "A thing done wrong at {settlement} goes somewhere and takes time, …"** prints beside "Prison only / Detention without process." in 10 towns (measured on a seat's tree, not at this tip). Cure built, lands after.
7. **Three besieged towns** print "Forge smoke hangs over everything here, and the ring of the anvils never quite stops." with unmarked smiths beside an "Impaired" chain card. Accepted by ruling.
8. **The brewer's secret** still names taverns where none stands; two granary lines presume stores.
9. **The supply rule's leftovers**: 71 houses in 27 towns are short with no used-up ground named (they stand on no road); the card for a proven ground; the second ring of houses.
10. **The "trade at work" fact does not read "Stopped by the siege."** Nothing prints falsely from it in the 900.
11. *(Not a fault on a page: the town map is not shown, and map work is deferred to PLAT by the owner's word of 2026-11-18. For the record only: the site inventory's two rows moved, ruling CL15: `desert|mountain-flank|coal` 7 to 9, `desert|dunes|(biome)` 30 to 28, by a correct change of the sand export.)*

## 8. What is not in this pull request

Built or building, read by a second seat, and landing after the deploy (then a second, smaller close):

- **Points 48 to 52**: the people's follow-up (the swap, "Emira"), the watch and the powers (a by-day line, the occupation's rival bloc), both desks' follow-ups.
- **The income lines and the PDF's last gaps** (items 1 and 2 of section 7), and the marks' follow-up (the hook's kinds, the alchemist's need, "Salted fish" on three towns' imports).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01FbPLbcLDSJzZFzb5B7EjxR
