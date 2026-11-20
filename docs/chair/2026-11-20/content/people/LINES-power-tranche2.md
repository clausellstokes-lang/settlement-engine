# LINES — the powers' sentences by the SENTENCE, and the second tranche (PEOPLE-2, measuring and authoring seat M6, 2026-11-20)

Brief: `briefs/P2-M6-power-tranche2-AUTHOR.md` (it binds `briefs/MEASURE-COMMON.md`). Base `686d62e9d` (branch `lane/people-2-m6-2026-11-20`; `git diff 43ab0f5eb 686d62e9d -- src tests scripts package.json` is empty, so `src/` is the working line's). Nothing under `src/`, `tests/`, `scripts/`, `supabase/`, nor `package.json` / `package-lock.json` was changed.

**Sample:** 150 places a size, the six sizes, seeds `hxd-<size>-0..149`, born exactly as the chair's instrument births them (`census.mjs` on `origin/lane/chair-2026-11-08`: `generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} })` after `loadGenerationLawPayloads()`), the place's own names masked to `#`, digits to `0`.

**Unit:** the SENTENCE as printed. A power's description is cut into its **opening** (the ladder's line, with anything a later writer joined to it) and its **codas** (the standing sentences `factionStanding.js :: annotateFactionStanding` appends, matched by their own words: `measures/m6-common.mjs :: CODAS`, 37 patterns; 0 of 3,484 descriptions leave text after a coda unmatched). Each part is split into its sentences and counted apart. A relation narrative is counted whole. **Share** = places of a size printing the sentence / ALL 150 places of that size.

**Pick:** `pickVariantMixed` (`src/kernel/proseHash.js` at `bd42d63c7`, reimplemented in `m6-common.mjs`; checked against that commit's own function on 20,000 keys × pools of 1–15: 0 misses) over `[today's line, ...eligible new wordings]`. The keys are M4's: `<record _seed>::powerStructure.factions.desc::<power>` for an opening, `…::<coda id>` for a coda, `<record _seed>::powerStructure.factionRelationships.narrative::<pair, sorted, ||>` for a relation.

**Stages:**
- **TODAY**: as born.
- **RULED**: the first tranche as the chair ruled it at 17:21 (`measures/m6-pools.mjs`: M4's pools with the verdict's items 1 and 2 applied, 33 wordings amended; the village priest's index 0 refused where the `priest` atom is false; openings, codas and relations together).
- **T2**: RULED plus the second tranche (`measures/m6-tranche2.mjs`, 78 wordings).

**Scripts:**
- `measures/m6-births.mjs` (+ `.out.txt`);
- `measures/m6-measure.mjs` (+ `.out.txt`: A, B, C, D and the SUMMARY);
- `measures/m6-houses.mjs` (+ `.out.txt`: E);
- the data: `m6-common.mjs`, `m6-pools.mjs`, `m6-tranche2.mjs`.

**The answer first** (the top sentence, places / 150):

| size | openings: today · ruled · T2 | codas: today · ruled · T2 | relations: today · ruled · T2 |
|---|---|---|---|
| thorp | 38% · 9% · 9% | – | 2% · 2% · 2% |
| hamlet | 35% · 11% · 11% | 5% · 5% · 5% | 4% · 3% · 3% |
| village | 71% · 13% · 13% | 25% · 7% · 7% | 60% · 11% · 11% |
| town | 82% · 17% · 17% | 51% · 17% · 17% | 63% · 17% · 17% |
| city | 81% · **29%** · 15% | 73% · **23%** · 13% | 70% · 11% · 11% |
| metropolis | 97% · **21%** · 17% | 96% · **27%** · 17% | 91% · 15% · 15% |

As ruled, three cells sit above the 20% sampling allowance. They are city openings (`LOCAL_MERCHANTS`), city codas (`bodiesMinds`) and metropolis codas (`arcaneInShadow`), with metropolis openings at 21%. With the second tranche, every size is at or under 17%.

**What the chair must rule** (§F):
1. The ruled `closingGap` wordings 1 and 2 are false in every place the coda prints.
2. `atTable` prints on the governing seat in 23 places.
3. Some lines claim "more" or "ahead" where the two powers stand level: `arcaneInShadow` and `noblesAhead` (today's lines and ruled wordings).

## A. The measure by the sentence (150 places a size)

The top sentence at each size, for each part. Count lines: `m6-measure.out.txt`, `A …` lines.

| size | part | TODAY | RULED (items 1, 2; pickVariantMixed; priest index 0 refused) |
|---|---|---|---|
| thorp | openings | 57/150 38%: "The oldest heads of the community decide things together; people follow them out of respect and custom, not law." | 14/150 9%: "Respected elders guide the community; authority is moral and traditional rather than formal." (unpooled) |
| thorp | codas | none print | none print |
| thorp | relations | 3/150 2%: "The # carries out what the # decides." (GM.occ) | 3/150 2% (the same; not pooled) |
| hamlet | openings | 53/150 35%: the elders' line | 17/150 11%: "A lord's steward administers the settlement; …" (unpooled) |
| hamlet | codas | 7/150 5%: "Behind the # by too much to challenge openly, …" | 7/150 5% (the same; not pooled) |
| hamlet | relations | 6/150 4%: "The # carries out what the # decides." | 5/150 3% (the same) |
| village | openings | 107/150 71%: "The village priest is the most educated person for miles; …" | 20/150 13%: "People here look to the church for guidance on worldly matters as well as faith; …" |
| village | codas | 38/150 25%: "A single shift in patronage, scandal, or armed muscle could swap their positions." (narrowGap's 2nd sentence) | 11/150 7%: "Their support is worth buying, and both the # and the # know it." |
| village | relations | 90/150 60%: "People take their marriages, inheritances and hard times to the #, …" (GR.tense) | 16/150 11%: "When times are hard, people here go to the # for help, …" |
| town | openings | 123/150 82%: "Church institutions are well-embedded in civic life; …" | 26/150 17%: "Anyone seeking an office or a change in the law here soon learns to ask the church first; …" |
| town | codas | 77/150 51%: "They and the religious authorities both keep people in line." | 26/150 17%: "Third in weight, close enough to the # and the # that their support is worth having." (worthBuying 1 as ruled) |
| town | relations | 95/150 63%: "The # holds the seat and collects the taxes; …" (GR.dep) | 25/150 17%: "The # makes the law, and the # tell people it is right to keep it. Each props up the other." |
| city | openings | 121/150 81%: "Clergy are present but operate at the margins of civic life; …" | **43/150 29%**: "Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice." (`LOCAL_MERCHANTS`, unpooled) |
| city | codas | 109/150 73%: "They and the religious authorities both keep people in line." | **34/150 23%**: the same sentence (bodiesMinds index 0's first sentence) |
| city | relations | 105/150 70%: "The money of the # pays for the charity of the #, …" (MR.dep) | 16/150 11%: "In a place this large the faith's charity costs more than the faith has, … Each needs the other." |
| metropolis | openings | 145/150 97%: "Magical practitioners are consulted but not formally empowered." | **32/150 21%**: "Noble families with hereditary land rights and traditional privileges; …" (unpooled) |
| metropolis | codas | 144/150 96%: "The arcane orders are present but operate in the clergy's shadow." | **40/150 27%**: the same sentence (arcaneInShadow index 0) |
| metropolis | relations | 136/150 91%: MR.dep, as at city | 22/150 15%: "In a place this size the Guard has many streets to keep, …" (GM.sub+soldiers 6) |

**The village priest's line.** It opens a description in 107 of 150 villages, and the `priest` atom is false in all 107. As ruled, index 0 is refused there, so the line never prints as born in the projection.

**Over 15% as ruled, besides the tops above:**
- **town:**
  - the church openings 4 and 2 (17%, 16%).
- **city:**
  - the nobles' "Landed families increasingly outpaced …" (21%) and "Noble families with hereditary land rights …" (16%);
  - "Wealthy merchants hold exclusive power; …" (15%);
  - the bodiesMinds and atTable sentences (17–23%).
- **metropolis:**
  - the Grand Merchant Oligarchy's seat line (19%);
  - arcane openings 4 and 7 and minor landed 2 (16–17%);
  - the Ducal seat line and "Market merchants who profit …" (15%);
  - the six heavy codas' sentences (19–27%);
  - noblesAhead's two sentences (24%);
  - closingGap 1 (17%);
  - outvoted 1 (17%).

Every such line is listed in the `over 15% RULED` count lines.

## B. The coda count: codas printing in more than half of a size's places today

`m6-measure.out.txt`, `B …` lines. "Places" is places holding the coda on any power. "Top" is the commonest sentence that coda prints, places / 150.

| size | coda (branch) | places today | top sentence today | as ruled | with T2 |
|---|---|---|---|---|---|
| town | inShadow | 95/150 63% | 33% | 10% | 10% |
| town | bodiesMinds | 77/150 51% | 51% | 12% | 5% |
| town | worthBuying | 77/150 51% | 46% | 17% | 17% |
| city | bodiesMinds | 109/150 73% | 73% | **23%** | 10% |
| city | atTable | 109/150 73% | 73% | 19% | 9% |
| city | inShadow | 86/150 57% | 36% | 11% | 11% |
| metropolis | arcaneInShadow | 144/150 96% | 96% | **27%** | 11% |
| metropolis | bodiesMinds | 138/150 92% | 92% | **25%** | 11% |
| metropolis | atTable | 138/150 92% | 92% | **23%** | 9% |
| metropolis | clergyAhead | 125/150 83% | 83% | **22%** | 10% |
| metropolis | inShadow | 93/150 62% | 41% | 12% | 12% |
| metropolis | outpaced | 86/150 57% | 53% | **21%** | 10% |
| metropolis | outvoted | 86/150 57% | 55% | 17% | 17% |

**Thirteen size-and-coda cells print in more than half a size's places today.** Village and below have none. As ruled, six stay above 20% (bold).

**The sameness the wording masks.** At the metropolis:
- 96% of places print the arcane-under-the-clergy coda;
- 92% print the guard-and-clergy coda;
- 92% print a third power at the table;
- 83% print the clergy ahead of the arcane orders.

The pools spread the words, but the same four facts stand in nearly every metropolis. That is the roster's sameness (the who-rules and fortune laws: which powers stand and in what order). No wording cures it.

## C. The heaviest six (the highest share as ruled, max over sizes)

`m6-measure.out.txt`, `C …` lines. All six are in `src/generators/power/factionStanding.js :: annotateFactionStanding` (re-settled to the final roster by `power/rosterText.js :: settleStandingToRoster`).

| # | coda | as ruled, max | its branch condition | today's text |
|---|---|---|---|---|
| 1 | `arcaneInShadow` | 27% metropolis | on the faith's card (`Religious Authorities`), where an `Arcane Orders` power stands at or below the faith's power (`religiousArcaneNote`). Level in 26 of the sample's 204 cards | "The arcane orders are present but operate in the clergy's shadow. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved." |
| 2 | `bodiesMinds` | 25% metropolis | on a guard's or military power's card, where the faith stands within 10 of it (`guardReligiousNote`). `{force.body}` is `defenseFacts.js :: forceWordsOf`: garrison 267, watch 53, militia 4, hired company 4 | "They and the religious authorities both keep people in line. The {garrison} deals with bodies and the clergy with minds, and each wishes the other would keep quieter." |
| 3 | `noblesAhead` | 24% metropolis | on the nobles' card (Manor Household, Landed Gentry, Noble Families, Noble Houses …), where the first `Merchant` power stands at or below them (`nobleMerchantNote`, its last arm). Level in 12 of 61 | "Still ahead of merchant interests in real influence, for now. They know the gap is narrowing and are arranging marriages accordingly." |
| 4 | `atTable` | 23% metropolis | the third power (rank 2): within 5 of the powers above and below it (and not three or more level), or more than 10 below the second. On the governing seat in 23 of 328 cards | "They are always at the table, but cannot set their own terms." |
| 5 | `clergyAhead` | 22% metropolis | on the arcane card, where the faith stands above it (`arcaneReligiousNote`) | "The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly." |
| 6 | `outpaced` | 21% metropolis | on the merchants' card, where the craft guild stands 8 or more below them, or is Minor or Suppressed (`craftGuildNote`, its last arm). Level in 3 of 226 | "The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not." |

**`noblesAhead` is both one of the heaviest six and the nobles-ahead coda the brief names.** Its one pool of eight answers both.

The next three as ruled (worthBuying 17% town, closingGap 17% metropolis, outvoted 17% metropolis) are inside the 20% allowance. I did not author for them. closingGap's ruled wordings are false (§F.1).

## D. The second tranche (authored to the chair's eye)

**The rules every wording below keeps:**
- **Index 0 is today's exact line, eligible everywhere.** A coda pool is appended after the first tranche's wordings as ruled, and is numbered after them.
- **The verdict's item 1:** no feeling and no scheme the branch does not compute. A coda ends at the fact.
- **Where a branch admits a tie,** no wording claims "more" or "ahead". It says "no more than", "not overtaken", "at least as much".
- **No wording names a power,** except the force word `$1` the coda already prints. No wording adds a trouble, a custom, a count, a season or a good.
- **The atoms are vocabulary atoms only,** and only those M4's pools already declare: `church`, `market`, `guild`, `exports`, `imports`, `docks`, `walls`, `court sits`, `institution: monastery`, `population: large`, `prosperity: ≥ comfortable`. Two drafted wordings needed `temple`, which M4 never declared; I replaced them.
- **No wording needs a hideable house or a crime fact** (§E). None of the six is a crime coda.
- **The measure's guards, run over all 78:**
  - no season or machinery word, at most 45 words: 0 misses;
  - the feeling and scheme word list (resent, likes it, envy, fear, scheme, plot, wish, cannot accept, on purpose, by choice, deliberately, for now, quietly, …): 0 hits.
  - Over the first tranche as ruled, the same list flags one wording: clergyAhead 2, "… pursue their own business quietly." (§F.4).
- **The proposed data file stays M4's:** `src/data/powerLineVariants.js` (`DESC_POOLS`, `CODA_POOLS`).

### D.1 The six heaviest codas

**`arcaneInShadow`** (9 new; 0 today's line; 1–3 the first tranche as ruled). On the faith's card, so "they" is the clergy. The arcane power stands at or below the faith; level on 26 cards, so no wording says "less".

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 4 | The arcane orders are here too, but carry no more weight than the clergy. | — | — | the official; the coda's computed fact: the arcane power at or below the faith |
| 5 | The arcane orders do not outweigh the clergy here. | — | — | the local; the coda's computed fact |
| 6 | The arcane orders have their place here, but it is not above the clergy's. | — | — | the newcomer; the coda's computed fact |
| 7 | The church carries at least as much weight here as the arcane orders do. | `church` | — | the local; a church stands (faithReading hasChurch); the computed fact |
| 8 | The arcane orders are heard here, but no more than the clergy are. | — | — | the local; the coda's computed fact |
| 9 | In a place this large there is room for both the clergy and the arcane orders, and the arcane orders do not stand above the clergy. | `population: large` | — | the newcomer; a large place; the computed fact |
| 10 | The clergy hold their standing here; the arcane orders, though present, do not stand above them. | — | — | the official; the coda's computed fact |
| 11 | With a church and a monastery here, the faith stands no lower than the arcane orders. | `church`, `institution: monastery` | — | the traveller; a church and a monastery or friary stand; the computed fact |
| 12 | The arcane orders are part of the place, but not ahead of the clergy, and which magic the faith allows is an open question. | — | — | the official; the computed fact, and today's own open question (the chair kept it in wording 1), with no "deliberately" |

**`bodiesMinds`** (9 new; 0 today's line; 1–3 the first tranche as ruled). On the force's card. `$1` is the force word the coda already prints. Each wording ends at the fact: who keeps order, and how.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 4 | The $1 keeps the peace in the streets, and the clergy keep it in people's consciences. | — | — | the local; the coda's own fact: who keeps order, and how |
| 5 | Order here is kept two ways: by the $1 with force, and by the clergy with teaching. | — | — | the official; the coda's own fact |
| 6 | The $1 and the clergy stand close in weight here, and both keep people in line: the one by arrest, the other from the pulpit. | — | — | the official; the computed fact (within 10 of each other) and the coda's own |
| 7 | The $1 answers for people's conduct in the streets, and the clergy for their conduct before the faith. | — | — | the watch; the coda's own fact |
| 8 | Inside the walls the $1 keeps order by force, and the clergy keep it by conscience. | `walls` | — | the watch; the place has walls (defence.js) |
| 9 | The $1 brings lawbreakers to the court, and the clergy speak to people's consciences; both keep people in line. | `court sits` | — | the official; a court sits (courtHoldersOf) |
| 10 | In a place this large it takes both: the $1 to keep order by force, and the clergy to keep it by teaching. | `population: large` | — | the local; a large place |
| 11 | People here are kept in line by the $1 in the streets and by the clergy at the church. | `church` | — | the local; a church stands |
| 12 | The $1 keeps order at the market and in the streets, and the clergy keep it in people's consciences. | `market` | — | the trade; the place keeps a market |

**`noblesAhead`** (8 new; 0 today's line; no first-tranche wordings). On the nobles' card. The merchants stand at or below them; level on 12 of 61 cards, so no wording says "ahead" alone. Today's "for now" and "arranging marriages" are not computed, and no wording carries them.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 1 | For all the merchants' money, the noble families have not been overtaken here. | — | — | the local; the coda's computed fact: the merchants at or below the nobles |
| 2 | The merchants have not overtaken the noble families in influence here. | — | — | the official; the computed fact |
| 3 | Land and title count here for no less than trade: the noble families stand level with the merchants or ahead of them. | — | — | the official; the computed fact, said whole |
| 4 | The noble families are at least the merchants' equal in influence here. | — | — | the newcomer; the computed fact |
| 5 | The merchants trade at the market, but the noble families have no less say than they do. | `market` | — | the trade; the place keeps a market |
| 6 | The merchants handle what the place sends out, but the noble families have no less say than they do. | `exports` | — | the trade; the place has an export list; the goods unnamed |
| 7 | The noble families hold land and title here, and in influence the merchants have not passed them. | — | — | the local; the computed fact |
| 8 | Well off as the place is, the merchants have not overtaken the noble families in influence. | `prosperity: ≥ comfortable` | — | the trade; Comfortable or better (prosperityRank.js) |

**`atTable`** (8 new; 0 today's line; 1–4 the first tranche as ruled). The third power. Each wording keeps today's own claim (always heard; the terms are others'). The seat case is §F.2.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 5 | They have a voice in every decision, but not the deciding one. | — | — | the official; the coda's own claim |
| 6 | They take part in every bargain struck here, on terms that others set. | — | — | the trade; the coda's own claim |
| 7 | They are always in the room when the place's business is settled, but the terms are others'. | — | — | the local; the coda's own claim |
| 8 | They are consulted on everything that matters, and settle none of it on their own terms. | — | — | the official; the coda's own claim |
| 9 | Third in weight here, they are always heard, but the terms are set by others. | — | — | the newcomer; the coda's own claim; rank 2 is the third place |
| 10 | At the market and in public business alike they are always heard, but others set the terms. | `market` | — | the trade; the place keeps a market |
| 11 | In a place this large they are one of the voices always heard, but not one that sets the terms. | `population: large` | — | the newcomer; a large place |
| 12 | Every bargain here includes them, and none is struck on their terms alone. | — | — | the local; the coda's own claim |

**`clergyAhead`** (8 new; 0 today's line; 1–3 the first tranche as ruled). On the arcane card. The faith stands strictly above it in every sample card, so "more" is true. "work around them and never challenge them openly" is not computed and is not carried.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 4 | The clergy have more say in public affairs than the arcane orders do. | — | — | the official; the coda's computed fact: the faith above the arcane power |
| 5 | In public matters the clergy come first here, and the arcane orders second. | — | — | the local; the computed fact, of the two |
| 6 | The arcane orders stand behind the clergy in public affairs. | — | — | the official; the computed fact |
| 7 | Ask whose word counts for more in public affairs, the clergy's or the arcane orders', and here it is the clergy's. | — | — | the traveller; the computed fact |
| 8 | The church has more say in public affairs here than the arcane orders. | `church` | — | the local; a church stands |
| 9 | In a place this large the arcane orders have their place, but the clergy have more say in public affairs. | `population: large` | — | the newcomer; a large place |
| 10 | In public affairs here, the clergy's word carries further than the arcane orders'. | — | — | the official; the computed fact |
| 11 | The clergy outweigh the arcane orders in public affairs here. | — | — | the official; the computed fact |

**`outpaced`** (8 new; 0 today's line; 1–3 the first tranche as ruled). On the merchants' card. Each wording keeps today's own claims ("outpaced", the merchants set the prices). "craft masters object" and "win more often than not" are not carried. Wording 6 ("the larger one") is today's "outpaced" said plainly; it is false on the 3 level cards, as today's line is.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 4 | The craft guilds are here, but outpaced: the merchants set the prices. | — | — | the official; the coda's own claim |
| 5 | Prices here are the merchants' to set; the craft guilds are present, but behind. | — | — | the trade; the coda's own claim |
| 6 | The craft guilds have a say, but the merchants have the larger one, and the prices are theirs to set. | — | — | the local; the coda's own claim |
| 7 | What the workshops make, the merchants price; the craft guilds are present but outpaced. | — | — | the trade; the coda's own claim |
| 8 | The market's prices are the merchants' to set; the craft guilds are present, but outpaced. | `market` | — | the trade; the place keeps a market |
| 9 | The guilds of the trades are present, but outpaced; the merchants set the prices. | `guild` | — | the official; a guild stands (guild.js) |
| 10 | What the place sends out is priced by the merchants; the craft guilds are present but outpaced. | `exports` | — | the trade; the place has an export list; the goods unnamed |
| 11 | In a place this large the merchants set the prices, and the craft guilds, though present, are outpaced. | `population: large` | — | the newcomer; a large place |

### D.2 The five more lines

**`LOCAL_MERCHANTS`**: "Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice." (7 new)
- **Home:** `src/generators/power/claimStanding.js :: LOCAL_MERCHANTS`, the constant.
- **Printed by** `merchantRung`: a merchant claim its Minor label denies (`CLAIM_RUNGS`), where the seat is a merchant power or another merchant power stands at or above this one. Otherwise it takes `LEADING_LOCAL_MERCHANTS`.
- **What the wordings carry:** "others lead the trade" is that condition. Today's "yet" (a trajectory) is not carried.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 1 | Merchants whose trade is mostly local; a steady presence in civic life, though not the leading commercial voice. | — | — | the official; the line's own claim (local reach; not the leading merchant power: merchantRung's condition) |
| 2 | Local traders with a steady civic presence; the larger commercial voice here belongs to others. | — | — | the local; the line's own claim; merchantRung prints it only where a merchant seat or a stronger merchant power stands |
| 3 | A merchant interest of local reach, regularly heard in civic affairs, but not the one that leads the trade. | — | — | the official; the line's own claim |
| 4 | Merchants who trade mainly at the place's own market; present in civic life, but not the strongest merchant voice. | `market` | — | the trade; the place keeps a market (market.js): their local reach named by it |
| 5 | In a place this large these are merchants of local reach: a steady civic presence, but not the dominant commercial voice. | `population: large` | — | the newcomer; a large place (populationBand.js) |
| 6 | Merchants of local reach in what the place sends out and brings in; present in civic life, while others lead the trade. | `exports`, `imports` | — | the trade; the place has an export and an import list (canonExports, canonImports); the goods unnamed |
| 7 | Traders with local reach and a steady place in civic life; the leading merchant voice here is another's. | — | — | the newcomer; the line's own claim |

**The nobles' first ladder line**: "Landed families increasingly outpaced by merchant capital; they compete for council seats, marriage alliances, and royal appointments to maintain relevance." (7 new)
- **Home:** `src/generators/power/rulingStructure.js :: generatePowerStructure`, `nobleDesc`, the `merchantAligned` arm.
- **Condition:** the seat is a Merchant oligarchy, Democratic assembly, Guild Council or Merchant Guild Council; economy not very high; the nobles not governing with a noble house.
- **What the wordings carry:** the line's own claim, outpaced by merchant capital. "increasingly", "compete for … marriage alliances, and royal appointments to maintain relevance" are schemes the branch does not compute, and none is carried.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 1 | Landed families outpaced by merchant capital; they keep their land and titles, but money carries more weight here. | — | — | the official; the line's own claim (outpaced by merchant capital), its schemes struck |
| 2 | Old landed families in a place where merchant capital counts for more than land. | — | — | the newcomer; the line's own claim |
| 3 | The landed families keep their estates and their names, but merchant capital has outpaced them. | — | — | the local; the line's own claim |
| 4 | The landed families' wealth is in land, and here merchant capital has outpaced it. | — | — | the trade; the line's own claim |
| 5 | Landed families outpaced by merchant capital; the market, not the estate, is where the money is. | `market` | — | the trade; the place keeps a market |
| 6 | Landed families outpaced by the merchants who handle what the place sends out. | `exports` | — | the trade; the place has an export list; the goods unnamed |
| 7 | In a place this large, the old landed families are outpaced by merchant capital, though they keep their titles. | `population: large` | — | the newcomer; a large place |

**The nobles' second ladder line**: "Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital." (7 new)
- **Home:** `rulingStructure.js :: generatePowerStructure`, `nobleDesc` at a city, noble power 11–20 (no merchant-aligned or royal seat, military not very high).
- **And:** `claimStanding.js :: nobleMinorRung`, a noble claim at Minor above a town, where a merchant power stands beside.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 1 | Noble families holding hereditary land rights and old privileges; they take part in civic politics and hold their own against merchant capital. | — | — | the official; the line's own claim |
| 2 | Families of hereditary land and traditional privilege, active in the place's politics and a match for merchant capital. | — | — | the local; the line's own claim |
| 3 | The noble families hold their land by inheritance and keep their traditional privileges; in civic politics they compete on even terms with merchant money. | — | — | the official; the line's own claim (competitive with merchant capital) |
| 4 | Hereditary landholders with traditional privileges; active in civic politics, and competitive there with the merchants' money. | — | — | the newcomer; the line's own claim |
| 5 | In a place this large, the noble families' hereditary land and privileges give them a voice in civic politics alongside merchant capital. | `population: large` | — | the newcomer; a large place |
| 6 | Noble families with hereditary rights to land and old privileges; active in politics here, and competitive with the merchants of the market. | `market` | — | the trade; the place keeps a market |
| 7 | Old noble families, hereditary landholders with traditional privileges; active in civic politics, and a counterweight to merchant capital. | — | — | the official; the line's own claim |

**The Grand Merchant Oligarchy's seat line**: "The richest merchant houses of the metropolis sit as its senate, so the houses that control the trade also make the law." (7 new)
- **Home:** `rulingStructure.js :: generatePowerStructure`, `govDescByLabel['Grand Merchant Oligarchy']`.
- **One office:** the senate makes the law. Where a court sits, the judging is said to be the court's.
- **"Houses" here** are merchant families, not the roster's houses.

| # | wording | needs | excludes | vantage; why of this power, here |
|---|---|---|---|---|
| 1 | The metropolis is governed by a senate of its richest merchant houses; those who control its trade also make its law. | — | — | the official; the seat's own claim |
| 2 | Here the law is made by the same merchant houses that control the trade, sitting together as the senate. | — | — | the local; the seat's own claim |
| 3 | A senate of the richest merchant houses governs the metropolis, so trade and law are in the same hands. | — | — | the newcomer; the seat's own claim |
| 4 | The merchant houses that run the market also sit as the senate and make the metropolis's law. | `market` | — | the trade; the place keeps a market |
| 5 | The houses that handle what the metropolis sends out also sit as its senate and make its law. | `exports` | — | the trade; the place has an export list; the goods unnamed |
| 6 | The senate of the richest merchant houses makes the law here, and the court judges by it. | `court sits` | — | the official; a court sits (courtHoldersOf): the judging is the court's, the law the senate's (one office each) |
| 7 | The merchant houses whose cargoes cross the docks also sit as the senate, and make the law. | `docks` | — | the traveller; docks stand (institutions.js docks): the houses' trade read from them |

The nobles-ahead coda is `noblesAhead` in D.1.

### D.3 Where each new pool brings its sentence (as ruled → with T2; places / 150)

| pool | where it prints | as ruled | with T2 |
|---|---|---|---|
| arcaneInShadow | city 60, metropolis 144 places | 12%, 27% | 5%, 11% |
| bodiesMinds | town 77, city 109, metropolis 138 | 12%, 23%, 25% | 5%, 10%, 11% |
| noblesAhead | town 7, city 18, metropolis 36 | 5%, 12%, 24% | 2%, 3%, 4% |
| atTable | town 68, city 109, metropolis 138 | 14%, 19%, 23% | 6%, 9%, 9% |
| clergyAhead | city 56, metropolis 125 | 13%, 22% | 5%, 10% |
| outpaced | town 57, city 43, metropolis 86 | 11%, 11%, 21% | 6%, 6%, 10% |
| `LOCAL_MERCHANTS` | city 43 (town 2) | 29% | 8% |
| landed outpaced | city 32 (metropolis 5) | 21% | 5% |
| noble competitive | city 24, metropolis 32 | 16%, 21% | 5%, 6% |
| GMO seat | metropolis 29 | 19% | 4% |

### D.4 The projected top share with the second tranche added (by the sentence; `SUMMARY T2`)

| size | openings | codas | relations |
|---|---|---|---|
| thorp | 14/150 9%: "Respected elders guide the community; …" (unpooled) | – | 3/150 2% |
| hamlet | 17/150 11%: the steward's line (unpooled) | 7/150 5% | 5/150 3% |
| village | 20/150 13% | 11/150 7% | 16/150 11% |
| town | 26/150 17%: church opening 4 | 26/150 17%: worthBuying 1 as ruled | 25/150 17%: GR.dep 3 |
| city | 23/150 15%: "Wealthy merchants hold exclusive power; …" (unpooled) | 19/150 13%: outvoted 2 | 16/150 11% |
| metropolis | 25/150 17%: arcane opening 4 | 26/150 17%: closingGap 1 as ruled | 22/150 15%: GM.sub+soldiers 6 |

**Still over 15% with T2.** All are at or under 17%, inside the 20% sampling allowance:
- **town:** the church openings 4 and 2, worthBuying 1, GR.dep 3;
- **city:** "Wealthy merchants hold exclusive power; …";
- **metropolis:**
  - arcane openings 4 and 7, minor landed 2, the clergy-margins 8;
  - the Ducal seat line, "Market merchants who profit …";
  - closingGap 1, outvoted 1 and 3;
  - "Ahead of the religious authorities in current influence, …" (arcaneAheadOfClergy, unpooled).

The rows are the `over 15% T2` count lines.

## E. The house list (item 5)

**How I checked it** (`measures/m6-houses.mjs`, `.out.txt`):
1. **The list.** For every pool, first tranche as ruled and second, the script lists the atoms its wordings need or exclude. It marks the HOUSE atoms: those whose home reads the place's houses.
2. **The removal test.** On the same 150 places a size, re-born, each house atom is read twice through `factsOf`: on the born record, and on the same record with every house `src/domain/people/cardVeil.js :: isHideableHouse` marks taken off `institutions`. An atom that held only with the hideable houses on the roster NEEDED one.
3. **The sample holds hideable houses.** 16 / 22 / 10 / 100 / 517 / 891 of them, thorp to metropolis, in 150 of 150 metropolises: Black market, Front businesses, Smuggling network, Whisper market, Thieves' guild chapter, Underground network, Contract killer, Rookery. So a zero is not the zero of an empty sample.
4. **Result: 0 places for every house atom.**
   - church 600 places; market 505; guild 491; watch 455; paid watch 450; court sits 420; legal house 380; soldiers 338; garrison 328; institution: bank 263; institution: monastery 255; hospital 240; docks 157; militia 97; walls 499.
   - Each is 0 places holding only with a hideable house.
5. **The positive control.** Taking ALL houses off the roster turns off church, market, court sits, walls, watch and docks in every city of 30. So the test reads the roster.
   - guild and legal house mostly stay on, because they also read the roster of powers and of people. `guild.js` refuses a criminal guild by name (`CRIMINAL_GUILD_RE`).
6. **No crime atom** (crime, criminal, rings, thieves, smuggling, black market) is needed or excluded by any wording of either tranche: the measure's guard, 0. The thieves' codas are not pooled.

**The houses each pool needs** (other atoms after the dot; the ones `isHideableHouse` could never mark: people, figures, lists):

| tranche · pool | houses it needs or excludes | other atoms |
|---|---|---|
| T1 relation MR.dep | church, hospital, market, institution: monastery | exports, imports, prosperity, population: large |
| T1 relation GE.sub | court sits, docks, institution: bank | exports, prosperity |
| T1 relation GM.sub+soldiers | soldiers, garrison, walls, court sits | population: large |
| T1 relation GM.sub | walls | — |
| T1 relation GM.sym | walls, court sits, garrison, militia, paid watch (excluded) | population: large |
| T1 relation GM.tense | — | ruler: elder |
| T1 relation GR.dep | church | priest (a person), population: small |
| T1 relation GR.tense | church | priest, ruling body, population: small, prosperity |
| T1 relation GE.dep | court sits, market | exports, prosperity |
| T1 relation MR.tense | church, market | — |
| T1 relation MC.vote | market | exports, ruling body, prosperity |
| T1 relation MC.vote-against | market, guild | exports, ruling body |
| T1 relation NG.sub+merchant | market | population: large |
| T1 relation NG.sub | — | — |
| T1 relation NG.dep | court sits | population: large |
| T1 opening elders' line | court sits, legal house (both excluded) | population: small, exports |
| T1 openings: elders' crisis twin, household council, headman, hamlet elders, reeve | — | population: small (four of them) |
| T1 opening village priest | church | priest (index 0's need), population: small, prosperity |
| T1 opening arcane advisory | — | ruling body, population: large, prosperity |
| T1 opening clergy at the margins | church, institution: monastery, court sits | ruling body, population: large |
| T1 opening trades at the margins | guild, market | — |
| T1 opening craft guilds secondary | market | — |
| T1 opening church well-embedded | church | ruling body, population: middling |
| T1 opening town watch | watch, walls, court sits, paid watch, market | ruling body, population: middling |
| T1 opening city watch (growing) | watch, walls, court sits, garrison | population: large |
| T1 opening city watch (stretched) | watch, walls, garrison, court sits | population: large |
| T1 opening second armed company | — | population: large |
| T1 opening mayor | market, court sits | — |
| T1 opening elected council | guild | — |
| T1 opening guilds govern | market | — |
| T1 opening full council | court sits, walls, market | — |
| T1 opening grand council | — | — |
| T1 opening grand consortium | guild | — |
| T1 opening minor landed families | — | population: large |
| T1 openings established merchants (council, hall) | market | exports |
| T1 opening consortium of guild masters | — | — |
| T1 coda atTable | — | ruling body |
| T1 codas bodiesMinds, worthBuying, inShadow, narrowGap, closingGap | — | — |
| T1 codas arcaneInShadow, clergyAhead | church | — |
| T1 codas outvoted, outpaced | market | — |
| **T2 opening `LOCAL_MERCHANTS`** | market | population: large, exports, imports |
| **T2 opening landed outpaced** | market | exports, population: large |
| **T2 opening noble competitive** | market | population: large |
| **T2 opening GMO seat** | market, court sits, docks | exports |
| **T2 coda arcaneInShadow** | church, institution: monastery | population: large |
| **T2 coda bodiesMinds** | walls, court sits, church, market | population: large |
| **T2 coda noblesAhead** | market | exports, prosperity: ≥ comfortable |
| **T2 coda atTable** | market | population: large |
| **T2 coda clergyAhead** | church | population: large |
| **T2 coda outpaced** | market, guild | exports, population: large |

## F. What the chair must rule

1. **`closingGap` as ruled is false where it prints.**
   - The coda is written on the nobles' card when the first merchant power stands ABOVE them, by 1–12 (`nobleMerchantNote`'s middle arm). In the sample that is all 103 places that print it: merchants above, 103 of 103.
   - Ruled wording 2, "The merchants are closing on the noble families, who still stand ahead.", says the reverse in all 103.
   - Ruled wording 1, "Merchant money is catching up with the noble families, and the gap between them narrows.", says the merchants are behind ("catching up"), and adds a trend ("narrows") the branch does not compute.
   - Today's index 0 ("closing the gap") has the same fault.
   - **Proposed:** strike 1 and 2; or reword them to the computed fact, e.g. "The merchants now stand a little ahead of the noble families." Not authored here: the chair's own words.
2. **`atTable` on the governing seat.** In 23 of 328 cards, the third-ranked power is the seat itself. There today's line, and every wording, says the seat "cannot set its own terms". The fix is the writer's (exclude `isGoverning`, as rank 1 does), not a wording.
3. **Ties.**
   - `arcaneInShadow` prints with the arcane orders LEVEL with the faith on 26 of 204 cards. There, ruled wordings 2 ("The clergy stand above …") and 3 ("The church outweighs …") are false.
   - `noblesAhead` prints LEVEL on 12 of 61 cards. There, today's "Still ahead …" is false.
   - My wordings are written true at a tie. The ruled ones are the chair's.
4. **clergyAhead 2 (ruled, kept):** "The arcane orders defer to the clergy in public and pursue their own business quietly." "quietly" may be the kind of scheme item 1 strikes. Flagged, not changed.
5. **The sameness the codas carry** (§B): in 83–96% of metropolises, the same four standings stand. That is a roster fact, not a wording one: the who-rules and fortune lanes.
6. **Approximations** (M4's 1–4, and):
   - the codas are cut by their own words;
   - a stress event's sentence joined to an opening is counted with the opening;
   - 150 a size: about 2% is noise, so 17% sits inside the 20% allowance, not under 15%.
