# LINES-2b — DAILY-1 · L2: the chair's ruling of 18:47 applied (ONLY changed and new lines)

Written 2026-11-20T18:54Z (`date -u`). `LINES-2.md` is not edited: everything not named here stands as written there. The data is
`pools.2.mjs`, updated in place. Probe: `probe.2.mjs` (edited for the ruling), recorded run `probe.2b.out.txt` (fresh births, M1's recipe,
150 a size, exit 0, 112 s). No commit, no push; nothing under `src/`, `tests/`, `scripts/` changed.

THE RE-PROBE (cells: top whole-text % / top SENTENCE % / EMPTY % / distinct, of 150; FALSE = my wordings, every test)

| slot | thorp | hamlet | village | town | city | metropolis | FALSE |
|---|---|---|---|---|---|---|---:|
| food_culture | 9/9/0/30 | 9/9/0/33 | 9/9/0/33 | 7/7/0/36 | 7/7/0/34 | 10/10/0/32 | 0 |
| commoner_resentments | 7/9/19/45 | 7/9/9/63 | 11/11/7/49 | 3/6/35/64 | 7/9/34/46 | 9/11/26/40 | 0 |
| commoner_resentments_dm (owner-only) | 3/3/93/3 | 3/3/93/3 | 1/1/98/2 | 3/3/92/4 | 8/8/83/7 | 5/5/83/7 | 0 |
| outsider_impressions | 1/11/0/146 | 1/9/0/147 | 1/**22**/0/146 | 2/15/0/147 | 2/13/0/142 | 2/15/0/136 | 0 |
| unspoken_topics | 5/5/13/57 | 5/5/20/57 | 4/4/3/61 | 7/7/11/58 | 6/6/1/61 | 8/8/1/52 | 0 |
| recent_changes | 5/5/1/109 | 3/7/0/123 | 5/5/1/110 | 6/6/0/109 | 5/6/2/109 | 3/5/1/112 | 0 |

THE THINNEST BRANCH (eligible minus the bar's need, reach · need · min eligible): thorp `commoner_resentments:legitimacy` 80·6·7;
hamlet the same 91·7·7; village **`outsider_impressions:power.level` 40·3·2, SHORT**; town, city, metropolis `power.level` 27·2·2,
25·2·2, 25·2·2. Every branch's reach is in `probe.2b.out.txt` section 2; one cell short, no place without an eligible wording.

## 1. recent_changes: the beat BY ITS EVENT'S NAME (new branch `beat`; was the beat's own text)
Said only where the beat (`historyBeats.js :: deriveRecentDisruption`) holds an event name (`references.eventName`, both of its
sources); an event of a crime or corruption kind is not said, read off `data/historyData.js :: EVENT_TYPE_NAMES` ("The Crime Wave",
"The Scandal"): 1/1/2/1/1/0%. The name takes its article in the sentence ("the Siege", "The Great Fire" at a sentence's head). Every
frame holds for both of the beat's sources: a major event within thirty years "still being felt" and a legacy annotation whose
changes "are still how the place works today" (or "left trouble"). No age, no "founding survey". Reach 62/80/79/78/65/73%; top sentence
of the slot 5/7/5/6/6/5%.

**beat** (8), needs: [] (the branch: an event name held, not a crime kind)
0. The place still lives with what {event} left behind.
1. People here still talk of {event}, and of what it changed.
2. What {event} left behind is still part of daily life here.
3. {Event} still shapes how people here go about things.
4. Talk here still comes back, sooner or later, to {event}.
5. Much of how the place works now goes back to {event}.
6. The mark {event} left on the place has not faded.
7. Ask how things came to be as they are here, and {event} soon comes up.

The probe's rule-7 word test is read with the name struck; inside a name it is counted apart as record text: "the Great Harvest
Compact" carries "Harvest" on 4/5/2/1/0/1 places (the event's own name, not a season; flagged, not counted false).

## 2. unspoken_topics: a crime wound FALLS THROUGH; `hidden.arcane_instability` CUT
Where `currentTensions[0]` is `crime_wave` or `corruption_scandal`, the slot says the first LATER tension the record holds whose type
has a pool and is not a crime kind; no new wording. Fell on 1/2/7/9/48/49%; EMPTY now 13/20/3/11/1/1% (was 14/22/10/19/49/49):
a crime wound with no sayable tension after it. A non-crime wound with no pool stays EMPTY. `hidden.arcane_instability` (2 wordings)
is CUT from the pools.

## 3. THE RATINGS ARE NO THREAT ANYWHERE
`unrest` and `economic_collapse` threats from `defenseProfile` (the defence's ORDER and SUPPLY ratings, "Civic stability at risk",
"Economic fragility") are taken by no slot as a threat: not the outsider's threat part, not recent_changes' acute part, not its
"a source held" test (so the calm pool now reaches thorps: 23/12/7/15/19/16%).
- recent_changes: CUT `threat.unrest.order.imminent` (12), `threat.unrest.order.realized` (8), `threat.economic_collapse.supply.imminent`
  (4), `.realized` (3): 27 wordings.
- outsider_impressions: CUT `threat.economic_collapse.supply` (4). The `threat.unrest.order` lines (12) FOLD INTO `services.defense`,
  appended after its three, each with its needs as written, said only when the defence lens is strained (reach 38/30/53/45/0/0%):
  `services.defense` 3. There is little here to keep order, and a visitor can see it. [] · 4. Keeping the peace here rests on goodwill
  more than on any force. [] · 5. Order here is kept lightly, and a stranger notices how little stands behind it. [] · 6. Order here
  depends on people keeping it among themselves. [] · 7. The means of keeping order here are slight, and a visitor sees it soon enough. []
  · 8. A visitor gets the sense that order here is kept by habit rather than by force. [] · 9. A visitor looks in vain for a watchman;
  there is none. [noGuard] · 10. A visitor sees no one whose task it is to keep order. [noGuard] · 11. Nobody here is paid to keep the
  peace, and it shows. [noGuard] · 12. The watch is small for the ground it has to cover. [watch; house: watch] · 13. Few of the watch
  are about, and a visitor wonders how they keep order with so few. [watch; house: watch] · 14. Those who keep order here are spread
  thin, and a visitor can tell. [guard; house: guard force]

## 4. outsider_impressions: the POWER part and the SECOND part
(a) THE TEST: `src/domain/facts/leaderLead.js :: leaderLeadOfRecord(r).leadOverSecond` (the margin home "a line that says level reads"),
held to the threshold the standing line holds before it says "No one clearly leads here; …": `generators/power/factionStanding.js`,
`topTwoGap <= 6` (rank 1, not governing). The top power CLEARLY LEADS where the margin is over 6 (or no second power stands): then the
`power` pool as written. Where it is 6 or less, the new branch (the leader leaf's top is the profiles' top on 900 of 900; a veiled top is
still not named and nothing is said):

**power.level** (2), needs: []
0. Ask who decides things here, and a visitor hears more than one name.
1. No single name comes up first when a visitor asks who holds sway here.

Reach 1/5/40/27/25/25%. WITH TWO LINES THE VILLAGE PRINTS EACH TO 22% and 18% (the bar's need there is 3; town/city/metropolis 15/13/15).
FOR THE CHAIR, PROPOSED, NOT IN THE POOLS (measured on the drafting cache with both added: the slot's top sentence 11/9/12/10/11/9%):
- Several powers carry weight here, and a visitor soon learns not to assume which one matters most. — needs: []
- A visitor finds more than one door to knock on before anything is decided here. — needs: []

(b) THE SECOND PART: at a place with no real threat (no open, non-rating threat above low that a pool says), ONE part chosen by
`pickVariantMixed([...strained VISIBLE lenses as services.<lens>, 'ordinary'], '<record.name>::dailyLife.outsider_impressions::second')`,
the lenses in `VISIBLE_CAPACITY_LENSES` order (food_production, defense, administrative, healing, magical), then its pool's keyed pick as
before; no "healing first". At a place WITH a real threat, the threat part, then (where three or more of the nine are strained, today's
trigger) one strained visible lens by the same keyed pick, without `ordinary`. `ordinary` now reaches 12/10/5/17/19/21%; its index 0
(today's, needs notSmall + sacred) and three more as written.

## 5. commoner_resentments; food and calm index-0 time words
- `legitimacy` 4 "There is open doubt here about whether {gov} {gov|has|have} any right to decide for everyone." — needs: [gov,
  **legitimacyGrave**] (`deriveCausalState().bands.public_legitimacy` critical or collapsed).
- CUT: food `strained` 0 "Loaves shrink each month; householders stretch what they can."; recent_changes `calm` 0 "The last few seasons
  have run their usual course. …". Each branch's first remaining wording is now its index 0.

## 6. commoner_resentments_dm (owner-only)
"Smugglers" needs smuggling in the record: **smuggling** = a live house named /smuggl/ (`facts/liveInstitutionNames.js ::
liveInstitutionNames`; the names `facts/criminalStructureKey.js` reads, "smuggling") or an income row /smuggl/
(`economicState.incomeSources[].source`, the list `facts/criminalIncome.js` reads). Owner-only, so allowed. 248 of 900 hold the house.

**crime55** (7)
0. Commoners resent the smugglers who pay no tax while honest carts queue. — needs: [smuggling, gate, route]; houses: gate, a smuggling house
1. Commoners resent the smugglers who slip goods past while honest traders pay their dues. — needs: [smuggling, market]; houses: market, a smuggling house
2. People grumble that smuggled goods undercut honest sellers at the market. — needs: [smuggling, market]; houses: market, a smuggling house
3. Honest carriers resent waiting their turn while smugglers come and go as they please. — needs: [smuggling, route]; houses: a smuggling house
4. People grumble that those who break the rules do better here than those who keep them. — needs: [] (new, the chair's)
5. Honest folk say that crime pays better here than work. — needs: [] (new, the chair's)
6. People resent how little is done about wrongdoing that everyone knows of. — needs: [] (new, the chair's)

(The former 4 "Commoners grumble that smugglers do well here…" and 5 "People resent that smugglers seem to prosper…" are replaced.)
`crime70` unchanged. Reach 7/7/2/7/17/17% (crime55), 0/0/0/1/0/0% (crime70); thinnest eligible 3 (need 2).

## 7. food_culture
- `surplus` 8: "Meat is common fare here, and there is no shortage of it." — needs: [livestock]
- `adequate` 11: "What the herds give fills out plain meals." — needs: [livestock]
- `critical` 0: "Rations are tight, and the poor eat watered stew." — needs: [] (replaces today's "…and the well-off hoard quietly")

## 8. recent_changes
- `condition.magical_instability` 0: "Magic here has started to misbehave, and nobody trusts it to work as it should." — needs: []

## HOUSES (changes to LINES-2's list)
recent_changes: the watch / guard-force lines of `threat.unrest.order.*` are gone. outsider_impressions: `services.defense` now names the
watch in #0, #12, #13 and a guard force in #14; `threat.unrest.order` is gone. commoner_resentments_dm: crime55 #0-#3 need a smuggling
house or a smuggling income row (owner-only). No public wording needs a hideable house or a crime fact.

CONFIRMED (executed, `probe.2b.out.txt`): the shares, empties, reaches, the one short cell and 0 false lines. PLAUSIBLE (read): that every
event name reads well in every frame, and that the leaderLead margin is the one the standing line means.
