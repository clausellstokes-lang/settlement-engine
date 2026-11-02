# Generation coherence and experience audit (2026-11-02)

> Saved to the repository on 2026-11-02 at the owner's word ("Save these files both the review and the audits to the repository"). Code citations are to branch `claude/ux-consolidation-2026-10-30` at `c0ef42c13` (PR #68). The probes, corpora and per-settlement files named below lived in the session's scratchpad and are not preserved; the figures they produced are recorded here.

This audit covers branch `claude/ux-consolidation-2026-10-30` at c0ef42c13 (PR #68), which is the code that will merge. It was written on 2026-11-02.

You asked to stop the audit or cut verification sharply, so I cut it back. Each measurement below was run once. The 18 hand readings ("reader findings") were not checked by anyone else and are marked **unverified** throughout. I ran nothing new to write this report.

I also could not save it as `audit-gen/REPORT.md`: the harness does not let subagents write report files. This text is the only copy.

## The verdict

1. As generated, no settlement in this audit reads as one real place. The foundations are sound, but each tab writes its own answer to the questions a DM gets asked first: who rules, how much food there is, whether there is a garrison, and what people worship. The DM meets two to five answers to each and has to choose one before play.
2. The best writing is genuinely good. No two arrival scenes were alike across 120 settlements, and in all 18 hand-read settlements the NPC secrets tie into the settlement's crisis. Every reader said they could run their settlement once they had reconciled it, and the readers who estimated put that at 20 minutes to an hour.
3. The largest gains would come from consistency, not new content. That means one answer per question, wording that matches the settlement's size and land, names for the people at the centre of each crisis, and showing what the generator already knows but leaves off the page.

## How this was done

- **Measured:** three generator runs covering 120, 120 and 389 settlements. Together they covered all six sizes and every terrain, culture, magic level and crisis type, plus the app's default settings. The checks ran on the text the app actually shows the DM, and the counts are exact.
- **Judged:** 18 settlements, three per size, read end to end the way a DM would read one before running it tonight. Every contradiction, implausibility, repetition, gap and strength was logged. These are judgments and are unverified.

## 1. What makes the settlements coherent

### Measured

- **The settlements build reliably.** 389 generations had 0 failures and 6,613 tab renders had 0 errors. No "undefined", "NaN" or unfilled template appeared anywhere. The same seed gave the same settlement 12 times out of 12.
- **Every link points at something real.** Across 120 settlements, none of these checks failed even once:
  - exactly one governing faction;
  - every NPC belongs to a faction that exists;
  - every relationship names a real NPC;
  - every service is offered by an institution that exists;
  - every conflict, and every faction named in history, is a real faction;
  - every defence entry names a real institution;
  - every supply chain's workshops exist.
- **The DM's choices are honoured.**
  - Every forced crisis appears and is named on the Overview (126 of 126).
  - Content limits held: there was no slavery, trafficking or torture in 330 heroic or grounded settlements unless the DM asked for it.
  - High magic always comes with a magic institution (27 of 27).
  - A famine never reads as food-secure (11 of 11).
  - Isolated places never book port income (19 of 19).
- **Arrival scenes are written from the settlement's own facts.** All 120 were distinct, and 116 of 120 "pressure" sentences were distinct.
- **Some repetition is by design.** Reference text repeats on purpose (a mill is described the same way everywhere), and that helps the DM find things. It is not counted against the generator here.

### Judged (readers, unverified)

- **NPC secrets lock into the crisis in 18 of 18.** Megapetra is an example: the priest falsified the case count, the elder is hiding the source, the quarantine officer is secretly sick, and the healer vanished after saying the disease is "not natural".
- **16 of 18 arrival scenes can be read aloud as they stand.**
- **12 of 18 relationship lines carry a clock**, for example "Quetzal Ul arrested a councillor's son without Nakul Hau's warrant. Nakul Hau has demanded his release by tomorrow."
- **The food arithmetic adds up when checked in 10.**
- **History leaves usable traces in 8**, such as sealed denunciation records or an unbuilt contested plot.
- **Crime patterns fit the crisis in 8**, such as informers under occupation or profiteering during a plague.
- **The Services tab works as a "can we buy X here, and from whom" index in 7.**
- **Small places' institutions are often the right size:** an outside mill, a household elder, a walk to the next village's church.

**Where the problem sits (my judgment, drawn from the measurements):** the structure underneath is sound. The incoherence is one layer up, in the sentences. Each tab draws its sentences from its own fixed pool and never checks what the settlement actually has.

## 2. What breaks coherence, ranked by how often a DM would hit it

Each item gives the measured evidence first, then how many of the 18 hand-read settlements showed it (unverified). "Not measured" means only the readers found it.

**1. Food says several things at once.**

*Measured:*
- In 119 of 120 settlements the place grows less than it eats. At every size the median is about half of what it needs (51-61%), so villages don't feed towns.
- 52 of 120 are 20% or more short even after imports. 51 of those had no famine chosen, and 15 of them read "Stable".
- The hook "The settlement is starving. Villagers are turning to banditry..." fires on any shortfall at all. It appeared in 70 of 120 settlements, 48 of which had no crisis chosen. That includes a 16-person thorp that is 6% short and an 86,000-person metropolis holding 15 months of grain.
- 13 of 20 thorps and 13 of 20 hamlets pair "surplus" wording with a shortfall.

*Readers:* 18 of 18 found food or stores stated more than one way. A typical case: the Defense tab says "No food reserves", a hook says "16 days of reserves", and the data holds 1.9 months that is never shown.

**2. The Faith tab denies the settlement's own church.**

*Not measured.*

*Readers:* 18 of 18. The tab says "No single creed holds sway, and the shrines answer to no named god." Elsewhere the same settlements have tithes, a High Priest, heresy trials or a cathedral. For example, Serraagam has an Archbishop and a government said to fear heresy.

**3. The table sheets start play in the wrong place.**

*Not measured.*

*Readers:* 18 of 18 found a problem on the Quick Guide or Tonight at the Table.
- 10 open play on a "they" with no name, for example "Where play begins: They have been slowly acquiring a controlling interest in a competitor".
- About 8 lead with a weaker hook than the active crisis. A besieged town's "urgent" item is money; a plague hamlet opens on a grain-guild price rise.

**4. Magic is described two ways.**

*Measured:*
- Every settlement with magic switched off (23 of 23) still grades "Magical Capability" on the Overview, usually as "Critical".
- 4 of 19 metropolises with magic off or set to zero have a resident dragon.
- Alchemist shops or quarters appear in 33 settlements with magic switched off.

*Readers:* 18 of 18 found at least one magic contradiction, and 10 rated it major. In one case the Magic tab says "Economic role: integral" six lines above "Nothing structural ... depends on arcane work". In another, "No arcane practitioners on the rolls" sits beside a named Hedge Witch.

**5. Goods and resources contradict each other.**

*Measured:*
- In 65 of 120, a mine, quarry, salt works, smelter or sawmill stands with none of its raw material, while the Services tab still sells its goods.
- All 120 print "X exists but lacks access to Y" lines, 833 in total. Many of them contradict the Institutions tab: a dairy farmer "lacks livestock" next to the common grazing.
- 29 of 60 dry inland places count a fish market as a fishery.
- 24 of 43 list gladiatorial combat with no arena.
- 15 of 53 say "Hospital present" with no hospital, including all 9 villages checked.

*Readers:* 17 of 18. In one town salt is both the "most-traded good" and "Salt (local salt beds exhausted)". In one thorp the "leading export is grain surplus" while the thorp is short of food.

**6. Crime is organised, petty and absent all at once.**

*Not measured.*

*Readers:* 16 of 18. Penbridge says "No criminal infrastructure has been identified" next to "A guard captain is on the payroll of the criminal network".

**7. Garrisons, walls and guards appear where none exist.**

*Measured:*
- 50 of 64 settlements with no garrison, barracks or citadel still describe a garrison's pay or morale.
- In 18 of 40, the same Defense tab first says "No walls or garrison."
- 10 of 42 settlements without walls describe walls.

*Readers:* 15 of 18 found defence facts that contradict each other: the garrison, the walls, whether the guard is well paid or bought, or a navy.

**8. "Who rules?" has no single answer.**

*Measured:*
- Across all 389 settlements, every thorp (64 of 64) and 48 of 63 hamlets say "No named seat-holder", even though the governing faction's Elder is on the NPC list.
- 12 of 63 hamlets give the seat to an unnamed "Lord Mayor" from another faction.
- 52 of 120 carry the same fixed note, "The faction that appears to govern is not the faction that governs", without ever saying who does. That includes 15 of 20 thorps.

*Readers:* 14 of 18 found who rules stated two to five incompatible ways. Palaiodion, for example, has a Mayor, a Governor, an unnamed Lord Mayor, a royal appointee and a voting council. The other 4 had muddled power labels, such as four factions all marked "Holds power".

**9. The same sentences appear everywhere.**

*Measured:*
- When a DM opens a second settlement, 16% of its story sentences are ones they have already read word for word. Between two settlements of the same size that rises to 20%, and one pair reached 53%. For plot hooks it is 19%, and one pair reached 96%.
- The same two faction-conflict hooks appear in 99 of 120 settlements. In 45 of them, one of the hooks repeats within a single settlement.
- 1,030 NPCs share 13 "how they behave" lines. On average one line covers 47% of a settlement's NPCs, and in the worst case 9 of 17 had the same line.
- The Economics tab prints "Dependent on trade routes. Siege, road closure, or blockade would impair operations." up to 16 times in one settlement (median 9 per city).

*Readers:* 11 of 18 found two or more NPCs sharing a paragraph or secret word for word. In Maloburg, each of the two best secrets belongs to two different people.

**10. The people at the centre of the crisis have no names.**

*Measured:*
- 195 of 389 settlements include NPCs named only by their role, with no name, want or secret: "The Lord Mayor" 83 times, "The Guildmaster" 55, "The Kingpin" 30.
- 65 of 389 show placeholder faction names such as "Claimant Bloc A", "Rival Faction B" or "Unknown Faction (hidden)".

*Readers:* in 14 of the 15 settlements with an active crisis, the occupier, creditor, besieger, enemy, revolt leader, dead leader or scarce resource has no name. In 10 of the 13 frontier or "Plagued" settlements, no creature is ever named. One reader also pointed out that "Plagued" is a monster setting but reads as an epidemic.

**11. Culture and terrain are only skin deep.**

*Measured:*
- The one-line identity statement gives the culture's default landscape regardless of terrain in 15 of 41 checked. Every landlocked Greek settlement (24 of 24) is "built around the agora and the harbour".
- 80 of 208 settlements with no sea or river use harbour, fish or ship words.

*Readers:* 13 of 18 found the culture only in names and titles, sitting on generic medieval-European institutions: tithes, reeves, ale-wives, Sunday services, and beef for sale in a temple-and-tank city.

**12. The page vouches for itself.**

*Measured:* the generator's built-in self-check reports all 389 settlements as coherent.

*Readers:* 13 of 18 Outlook tabs say a version of "Nothing in Penbridge's record contradicts anything else in it." Four more admit "a handful of things about this town that cannot all be true".

**13. The generator knows things it doesn't show.**

*Not measured directly; the readers checked the data.*

*Readers:*
- 12 of 18 found NPC looks, voices, tells, ages and secret stakes in the data but not on the NPC cards. One reader notes that the PDF shows them and the screen does not.
- 10 found a stored-food figure that was computed (1.3 to 15 months) but never shown.
- 6 found district and tavern names in the data that appear on no tab.
- 4 found the lasting consequences of tensions (night curfews, separate collaborator quarters) dropped.

**14. Small places are written as towns.**

*Measured:*
- 59 of 60 thorps, hamlets and villages call themselves "the town" in their own prose.
- 39 of 40 thorps and hamlets carry a guild or a thieves' guild as a power.
- Merchant Guilds hold power in 81% of thorps and 97% of hamlets, usually staffed by "The Guildmaster".

*Readers:* all 9 small settlements had town-sized furnishings: shops, quarters, clerks, a throne, a "Lord Mayor". Four cities and metropolises were also called a "town".

**15. People sit in the wrong factions, and relationships ignore who they are.**

*Measured:* 22 of 120 file a figure under a faction of a different kind while their own kind's faction exists, for example a High Priest under the Arcane Orders. This happens in 12 of 20 metropolises.

*Readers:*
- 11 of 18 found relationship lines that ignore role or rank, such as two soldiers competing for "clients" or a rat catcher controlling council votes.
- About 12 found NPCs filed under the wrong faction.

## 3. What it is like to read one as a DM

*Judged, from the 18 readings (unverified).*

The first screen works. The arrival scene reads aloud as it stands, for example "The dogs of Altaikotan are gone. It takes a while to notice and longer to stop noticing" or "At Birchowk's gate the queue divides in two: residents with papers, and everyone else." The NPC secrets and the "what's happening this week" relationship lines give every settlement the bones of a session.

Things go wrong on the second tab. A DM preparing to run a place checks the facts against each other, and here the facts come from separate writers who never compare notes. The Overview says the council converted early, while the Power tab says it refuses to declare. The Defense tab says there are no food stores, a hook says 16 days, and the data holds 1.9 months that is never shown.

After the third contradiction, the DM can't trust a single line without checking it against two other tabs. That is the opposite of reducing their load.

None of the 18 readers said their settlement read as one place as generated. All 18 said they could run it after settling the contradictions themselves. They listed what they would have to decide first: who really rules, whether the granary is full, what the faith is called, and who the occupier is. Their estimates ranged from about 20 minutes (for a village) to about an hour (for a town and two cities).

The length works against them too. The 17 tabs run from a median of about 2,900 words for a thorp to about 9,700 for a metropolis (measured), and much of that adds nothing:
- **The same fact said twice.** The Defense tab gives most facts as a label and then again as a sentence.
- **Repeated boilerplate.** One sentence appears 16 times in one Economics tab.
- **Figures with no meaning at the table**, such as "Output: 28/100" or "patrol provisioning at 87%".

The Rumors, War and Faith tabs are deliberate launch teasers, which is your call. However, the Daily Life placeholder names "the market, the tavern, the watch" in places that have none of them. And the one line of content on the Faith tab contradicts the settlement.

Measured against your standards:
- **DM authorship.** The DM spends their authorship on arbitration, choosing between the generator's versions of the same fact, instead of on making the place their own.
- **Findability.** The problem is the reverse of clutter. Much of what a DM needs to voice a person or run a siege is in the generated data and not on the page.

## 4. What is already being fixed

**The historical scale (on another branch).** This is not news. For the record, here is this code against your bands, using medians across the three runs:

| Size | This code (median people) | Your band |
|---|---|---|
| Thorp | 34-42 | 5-30 |
| Hamlet | 223-338 | 20-100 |
| Village | 616-696 | 75-400 |
| Town | 3,100-3,700 | 300-2,500 |
| City | 14,300-20,100 | 2,000-15,000 |
| Metropolis | 53,000-70,000 | 15,000+ |

My judgment is that the scale work will fix the headcounts. On its own it will not fix the town wording, guild powers or garrison talk in small places (items 7 and 14 above). Those are triggered by the size label and the fixed sentence pools, so they will stand out more once a thorp has 12 people.

**The backing catalogue against the power figures (awaiting your ruling).** This is evidence for that ruling, not a recommendation.
- In 64 of 120 settlements, the power implied by which institutions back which faction differs from the displayed power figures by more than 30 points.
- In villages and towns the two rankings are essentially unrelated. The median rank agreement is 0.01 and 0.04, where 1 means identical and 0 means unrelated.
- In small places, the institutions give the ruling faction 87-100% of the backing, while the figures give it 27-62%.
- Only 1 of 120 loses more than a fifth of its institution weight.
- On screen, the mismatch shows up as a power labelled "Dominant" with one house behind it. One example is a 12-person thorp whose Merchant Guilds sit at 38%, backed only by a shepherd collective.

**The one-editor merge.** It is in the code that was audited. This audit did not exercise editing; DM edits, custom content, AI narration, the player view and the PDF were all out of scope. So it says nothing for or against the merge. Its relevance is that until generation agrees with itself, every contradiction above is something the DM has to settle by hand in that editor.

## 5. The five changes that would most improve coherence and the experience

None of these adds a setting or a screen. The DM would simply stop running into contradictions, which is the silent load reduction your standard asks for.

**1. One answer per basic question, with every tab reading it.**
- The questions are: who rules (by name), how much food is stored and how short the place is, whether there is a garrison and walls, how crime is organised, what the faith is, and how much magic there is.
- Settle each one once and make every sentence that touches it read that answer. The engine already computes some of them, such as the months of stored grain.
- Have the built-in self-check test those same answers.
- Drop the Outlook's "nothing contradicts" line unless it is true.

*Evidence:*
- Food: 18 of 18 readers, 119 of 120 short, and the "starving" hook in 70 of 120.
- Faith: 18 of 18.
- Who rules: 14 of 18, and no seat-holder in 64 of 64 thorps.
- Garrison: 50 of 64.
- Crime: 16 of 18.
- Magic: 18 of 18.
- The self-check passes 389 of 389.

**2. Make fixed sentences check the place before they speak.**
- No garrison pay without a garrison.
- No "town" for a thorp.
- No harbour or fish without water.
- No guild power without a market or guild house.
- With magic off: no dragon, no potions, and no "Magical Capability" row.
- No slave market, hospital or arena that isn't on the Institutions tab.
- No "starving" hook unless the shortfall is real and the stores are low.

*Evidence:*
- 59 of 60 small places are called towns, and 39 of 40 thorps and hamlets have guild powers.
- 80 of 208 landlocked places use sea words.
- Garrisons 50 of 64, hospitals 15 of 53, arenas 24 of 43, slave markets 5 of 6, and magic-off grading 23 of 23.
- This becomes more urgent once the historical scale lands.

**3. Name the crisis and every person in it, as an editable default.**
- Name the occupier, creditor, besieger, enemy, revolt leader, dead leader, scarce resource and monster.
- Name the role-only NPCs ("The Lord Mayor") and the placeholder factions ("Claimant Bloc A").
- In small places, make the governing Elder the seat-holder.
- A name to change is less work than a blank to fill, and the DM keeps full authorship.

*Evidence:*
- 14 of 15 crises have an unnamed centre.
- 10 of 13 frontier or "Plagued" settlements have no creature.
- 195 of 389 have role-only NPCs and 65 of 389 have placeholder factions.
- 64 of 64 thorps have no seat-holder, and 12 of 63 hamlets seat a "Lord Mayor" from the wrong faction.

**4. Show what is already generated.**
- On each NPC card: look, voice, tell, age and secret stakes. The PDF already shows some of this.
- The months of stored food.
- The lasting consequences of tensions, such as curfews and separate quarters.
- District and tavern names.
- The culture's food and building style.

This is your findability standard: nothing is cut, and existing material becomes findable.

*Evidence:* 12 of 18 readers on NPC details, 10 on stored food, 6 on place names, and 4 on tension consequences.

**5. Make people distinct, and point the table sheets at the crisis.**
- Widen the NPC behaviour, want and secret pools, or tie them to role, so no two people share a paragraph. Where two people share a secret on purpose, say they are in it together.
- Print each repeated boilerplate sentence once instead of 16 times. Only exact duplicates go; no facts are cut.
- Open the Quick Guide and Tonight at the Table on the active crisis, with the person named.

*Evidence:*
- 13 behaviour lines cover 1,030 NPCs, and the most common line covers 47% of a roster.
- 11 of 18 readers found shared NPC paragraphs.
- The same conflict hooks appear in 99 of 120.
- A second settlement repeats 16% of the story and 19% of the hooks a DM has already read.
- 10 of 18 sheets start on a "they", and about 8 open with a weaker hook than the active crisis.

## Where the evidence is

Everything is under `/tmp/claude-0/-home-user-settlement-engine/d604ec1d-23eb-56ff-8b13-2ed165c944bf/scratchpad/audit-gen/`:
- **The 18 hand-read settlements.** `s/<id>.txt` holds the rendered text and `s/<id>.json` the data. The one-line rows are in `summary.txt` and the per-settlement records in `index.json`.
- **The repetition run:** `tables.md`, `summary.json` and `corpus.jsonl`.
- **The coherence checks:** `coherence/results.json` and `coherence/report.txt`.
- **The edge-case run:** `corpus-edges/analysis.txt`, `corpus-edges/scan.txt`, `corpus-edges/scan2.txt` and `corpus-edges/records.jsonl`.

One caveat: the edge-case run wrote three scratch probe scripts into the shared folder, so it may have overwritten another run's probes with the same names. Each run's result files have their own names and are unaffected.
