# BAR7-AUDIT-I · HAND-BACK · LAWS 6e, 7, 9 and 10 WIDENED, 5x, the LOW families and one design point

Seat I of BRIEF-BAR7-AUDIT (`lane/chair-2026-11-08 :: docs/chair/2026-11-14/briefs/BRIEF-BAR7-AUDIT.md`). The tree is the joined line at **cfc2b680a** (the tip I was given; I merged nothing). Branch `lane/bar7-audit-i-2026-11-17`. I worked in a scratch worktree with its own `npm ci`, and every render went outside every tree. **I cured nothing.** No line under `src/` changed. I added no prose line, no annex row, no stored figure and no test file, and I edited no file another seat or an earlier auditor wrote. The two shared readers (`pageB.mjs`, `law9.mjs :: stateWords`, `law6.mjs :: SOV_FACT`) are imported unchanged.

## THE FILES OF THIS SEAT

| file | what |
|---|---|
| `tests/helpers/pageLaws/law9w.mjs` | 9g (plenty, margin and level words), 9h (the empty-list lines), 9i (crime's turf war against the safety word), 9a.order |
| `tests/helpers/pageLaws/law7x.mjs` | 7x: the town's own seat ruling freely under an occupation |
| `tests/helpers/pageLaws/law10i.mjs` | 10i: one pair, two ties in opposite senses |
| `tests/helpers/pageLaws/law6eCrown.mjs` | 6e again: a crown, a king, a realm or a royal thing |
| `tests/helpers/pageLaws/law5x.mjs` | 5x: a slash roster label inside a sentence |
| `tests/helpers/pageLaws/lowFamiliesI.mjs` | the LOW families (`low.*`, counted apart) and the design point (`design.outside`) |
| `docs/chair/2026-11-17/bar7/AUDIT/runI.mjs` | THE RUNNER: `node docs/chair/2026-11-17/bar7/AUDIT/runI.mjs <render-dir> <out.json> [second-check.json ...]` |
| `docs/chair/2026-11-17/bar7/AUDIT/controlsI.json` | the controls: the sixth read's positives, negatives and WEAK rows, and the wide read's rows in this seat's families |
| `docs/chair/2026-11-17/bar7/AUDIT/staticI.mjs` | THE STATIC HALF: `node docs/chair/2026-11-17/bar7/AUDIT/staticI.mjs <out.json>` (desk lines by declared band, crown words, slash labels) |
| `docs/chair/2026-11-17/bar7/AUDIT/tablesI.mjs` | the sub-buckets: `node docs/chair/2026-11-17/bar7/AUDIT/tablesI.mjs <out.json> [label]` |
| `docs/chair/2026-11-17/bar7/AUDIT/out-I/` | the outputs: `I.<30|150|720>.{json,counts.txt,controls.json,tables.txt}`, `I.static.{json,txt}` |

THE RUNS (each one I saw end, exit 0, every one through `sh scripts/gate-tail.sh`):
- The renders were PAGE-COPY's `HOLDERS=<P>/holders.tipA.json sh <P>/census3.sh <wt> <out> <workers> --seeds <file> --count-only`. The 30 (`bar0-<shape>-rand-42..44`, 2 workers) gave 30 dumps. The 150 (`rand-27..41`) gave 150 dumps. The 720 (PAGE-COPY `seeds.txt`, 4 workers) gave 720 dumps; its births and render took 1686 s and ended "census2: counted (--count-only)".
- The counts came from `node docs/chair/2026-11-17/bar7/AUDIT/runI.mjs r<N> out<N>.json review-bar-6/SECOND-CHECK.final51.json review-wide-6/SECOND-CHECK.final221.json`, once per population.
- The net, each run alone: `npm run typecheck:domain:strict` exit 0; `npx eslint` on the nine new files exit 0; `npx vitest run tests/architecture` exit 0 (21 files, 347 tests passed).

## 1 · THE RULES AS COUNTED

THE CONTROLS:
- Over the thirty, all 13 of the seat's STANDS rows are found and all 16 EXPLAINED rows are clean. The 2 WEAK rows (C36932, C11472) are not found, as they should not be.
- Over the 150, the wide read's rows in these families also hold. C211337 and C217617 (STANDS) are found. C61967, C58141, C48148, C48270, C48442 and C24588 (EXPLAINED) are clean.
- C93420 is the same line as C20830, ruled the other way by the wide read. It is reported as BOTH (see 9h).

Counted instances are listed as towns / instances / distinct lines. `apart` instances are WEAK, ruled both ways, or not a contradiction a strict checker would accept; they are reported and never counted. "Cause" splits the counted instances into crisis towns and calm towns.

| rule | the 30 | the 150 | the 720 | cause in the 720 (crisis/calm) | apart, in the 720 | precision (read against the page and the record by the second check's rules) |
|---|---|---|---|---|---|---|
| 9g.subsistence | 1/1/1 | 0 | 3/3/1 | 1/2 | – | 4 of 4 read stand (C18905's rule: "plainly past subsistence" beside "Subsistence economy") |
| 9g.stores | 1/1/1 | 3/3/1 | 8/8/1 | 3/5 | stores-near 1 (2.5 months) | 12 of 12 read stand (household stores of 1.5 to 2 months beside "more than the season needs") |
| 9g.food | 1/1/1 | 0 | 0 | – | food-soft 3 | 1 of 1 (C41011) |
| 9g.margin | 1/2/2 | 0 | 1/2/2 | 2/0 | margin-war 18 · margin-mild 6 | 4 of 4 stand, beside "signed a requisition order … that it cannot afford … It is also running thin" |
| 9g.source | 1/1/1 | 0 | 8/8/4 | 3/5 | – | 9 of 9 stand ("first of all from its fishing / herds / hunting" against "Its own fields give it grain, and beyond that …") |
| 9h.no-exports | 1/1/1 | 1/1/1 | 1/1/1 | 1/0 | – | C20830 stands; the 150's instance is C93420, which the wide read EXPLAINED. Read below. |
| 9h.no-exports-record | 0 | 3/3/1 | 3/3/1 | 3/0 | transit-only 3 | 5 of 6 stand: 2 of them are the wide read's STANDS C211337 and C217617; the 6th ("Cargo barges" under a religious conversion) is unsure |
| 9h.entrepot | 1/1/1 | 0 | 0 | – | – | 1 of 1 (C32912) |
| 9i.crews | 2/2/1 | 0 | 5/5/1 | 3/2 | crews-safe 6 (the bare word "Safe") | 7 of 7 read stand |
| 9a.order | 1/1/1 | 7/7/1 | 0 | – | – | 8 of 8 ("The garrison keeps order …" beside "Law & order · Collapsed" and "few patrols can be spared") |
| 7x.occupied-seat | 1/1/1 | 2/2/2 | 3/3/3 | 3/0 | – | 4 of 6 stand; 2 are WEAK ("decides things the way a business does": a style, not a free hand) |
| 10i.pair | 1/1/1 | 4/4/4 | 27/29/29 | 0/29 | pair-respect 7 · pair-family 8 | 34 of 34 by C19351's rule (an ally's or an enemy's tie and a rival's, both rows printed, the tab counting the pair as both). I read 22 of them. |
| 6e.no-higher | 1/1/1 | 2/2/1 | 8/8/1 | 0/8 | founding 2 | C16768 stands as MED. The other 10 are the town crier's "Proclaim laws, royal decrees …", which the sixth read rated LOW (C35481): a real fault at LOW weight. |
| 6e.crown | 0 | 1/1/1 | 7/7/1 | 0/7 | war-apart 24 · realm-world 258 | all 8 are the town crier's line: LOW by the sixth read |
| 5x.slash | 1/1/1 | 3/3/2 | 38/38/2 | 0/38 | slash-list 8 | 42 of 42 stand (C25601's rule); one label, two desk lines |
| **all counted** | **15 in 12 towns** | **26 in 25 towns** | **115 in 102 towns, 45 distinct** | | 1372 | |

THE LOW FAMILIES AND THE DESIGN POINT (all counted apart, by design):

| family | the 30 | the 150 | the 720 | sub-buckets in the 720 |
|---|---|---|---|---|
| low.generation: "a generation old" of an event 40 to 60 years back | 9 | 19 | 100 in 100 towns | 40–49 years: 46 · 50–54: 29 · 55–60: 25 |
| low.agree: "Weak defences is the reason" / "Weak defences keeps …" | 3 | 13 | 42 in 42 towns | "is the reason" 19 · "keeps … from more than tolerating" 19 · others 4 |
| low.doubled: a trade list printing one good twice | 31 | 106 | 751 | exact: 18 (Needed 17, Exports 1) · within-phrase: 2 ("Incense and ritual oil" inside "Incense, ritual oil, and vestment materials") · within-word: 731 (e.g. "honey" beside "Honey and beeswax"). Within-word is noise, not a fault. |
| low.hook-party: a party that no power, tension or crisis holds | 1 | 7 | 19 | "the old families" 12 · "the reformers" 7 |
| design.outside: "bought from outside" / "one importer … all the grain" | 13 in 6 towns | 36 in 22 | 116 in 86 | siege, food brought in by a teleportation circle: 3 towns · no siege, grain imported: 77 · no siege, food imported but no grain: 6 (only the "decide what to import" line) · siege with nothing brought in: **0 in every population** |

## 2 · FOR EACH RULE: WHY THE LAW DID NOT SEE IT, THE ONE FACT, THE SURFACES THAT DO NOT READ IT, WHAT IS HELD

**9g.subsistence + 9g.stores (C18905).** LAW 9's `9b.subsistence` reads the economy's label against Prosperity, not a prose line against the label.
- The line is DS-ECO-8, pool COMFORTABLE, v3 (`src/data/dossierStateProse/economy.generated.js`, annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`). The pool is keyed on the prosperity rung, and the line declares only `food: ≥ secure`.
- That declaration admits a town whose economy label is "Subsistence economy" (`economicState.economicComplexity`), and one with 1.5 to 2 months of household stores and no granary.
- THE ONE FACT: the line must declare `stores: ≥ 3` (an atom the desk already uses: DS-ECO-1 C2 `stores: >= 6`). Its first sentence must not say "past subsistence" in a pool the complexity rung does not key; a twin, "The town is comfortable …", needs no new atom.
- Static: in the desks, 1 subsistence line and 5 stores lines; 2 of the stores lines admit stores under three months (the other is DS-DEF-2 "Disasters & Famine: granary AND parish", with no marks).
- HELD: SEAM-DESKS item 2 names "DS-ECO-8 v3" (declare on the guard's pay). If that is this pool's v3, it touches this line but declares nothing against Subsistence or stores. Count after their join.

**9g.food (C41011).** DS-DEF-12 "CAPACITY: ample" v1 and v3 declare `food: ≥ pressured` (`defense.generated.js`). That band ADMITS the Pressured town with a 7% gap: the band is one rung too low.
- THE ONE FACT: `food: ≥ secure` on both lines, or, as SEAM-DESKS item 3 does for "CAPACITY: enough", `food: ≥ pressured · food surplus`.
- Static: 8 food-plenty lines in the desks, and all 8 admit a denying state (the table is in `I.static.txt`). The strong ones are DS-DEF-12 v1/v3, DS-ECO-2 "FOOD: surplus" v1 (`crisis: any`: admits a siege), DS-ECO-3 v2 "Plenty passes here", and DS-ECO-8 "full stores" v1 and v4. The soft ones are DS-GEN-3 "eats well".

**9g.margin (C15153; negatives C12371, C27960).** LAW 9's `9b.purse` reads "closes every year ahead" only against "chronically underfunded)" and a yearly borrowing; it never reads the war's overview.
- THE ONE FACT: DS-ECO-8 COMFORTABLE v1 declares `no crisis: indebted` only, and it prints beside the war overview's "signed a requisition order last week that it cannot afford … It is also running thin" (`src/generators/narrativeText.js`, the wartime pressure row). The line must also declare against the war (`no crisis: wartime`), or the overview's "cannot afford / running thin" must be dropped where the record's purse holds a margin. Not both: one owner.
- THE NEGATIVES STAND because "The war takes most of the money" alone does not deny a margin: C12371 has "money laid by before this trouble began", and the wide read EXPLAINED C58141 and C61967 on the war-time prosperity word. So 18 margin-war instances and 6 mild ones ("With a little left over each year") are apart.
- CAN ITS WORDS SAY "MONEY"? Yes. "{settlement}'s purse closes every year ahead. The margin is not large but it is dependable, and there is money laid by behind it." Two of the thirty's readers read the current wording as a food line (C12371, C27960).
- Static: 6 money-margin lines; 5 admit a war, a debt or a siege.

**9g.source (C41850).** No law read two orders of food source.
- THE ONE FACT: DS-ECO-9 "FOOD SOURCES: one source" v1 fills `{good}` from the food record's `foodSources` (here `['fish']` only). `src/domain/foodways.js` (`oneFarmed`) prints "Its own fields give it grain, and beyond that its food is fish" from the roster's fields.
- The food record's source list leaves out the fields the page's own foodways line puts first. The cure is one reading: the desk line takes its good from what `foodways.js` names first, or the pool is not drawn where `foodways` prints `oneFarmed`. 9 of 9 instances are this pair.

**9h.no-exports (C20830; the wide read's C93420).** WHAT DIFFERS from C93420 is the tab's legend.
- At the wide read, a checker read "No significant exports." as the present, beside "had several trades selling outward before the siege", and explained it.
- Since BAR6 the tab prints "The descriptions here are of ordinary times. While the siege lasts, a row it touches is marked." So an UNMARKED row reads as ordinary times, which the next line denies. The same two lines now read as X and not-X; the rule counts them only under the legend.
- THE ONE FACT: `src/components/new/tabs/EconomicsTab.jsx` (around line 481) prints the bare "No significant exports." when the filtered export column (`tradeListDisplay.js :: tradeListsAsPrinted`) is empty. The imports column already drops its empty line under a stop (`tradeStoppedHere(s) ? null : importsEmptyLineShown(fb)`, line 516). The exports line wants the same reading, or the crisis's mark ("No exports reach a buyer while the siege lasts.").

**9h.no-exports-record (the wide read's C211337, C217617).** The record exports raw wool, fish or furs, and the printed column drops them under a famine or another crisis, printing "No significant exports." with no mark. Transit alone is not an export on this page (apart). This is the same fact as 9h.no-exports.
- HELD: SEAM-ECON item 1 holds `tradeListsAsPrinted` for a food export under a scarce harvest, not the empty line.

**9h.entrepot (C32912).** DS-ECO-10 "POSTURE: entrepot" declares `no crisis: under_siege` only. The posture comes from the record's `isEntrepot`, while the page's Imports row prints "No recorded imports." and no transit good.
- THE ONE FACT: the posture line reads the printed import list, as BAR6-ECON made the "raw material moves" line read the printed export list (`economyStateProse.js`, around line 1364).

**9i.crews (C23038, C39691).** The crime seat's cure (`criminalStructureKey.js :: rivalRingsHere`, W2-C-LEAVES-11) removed the line where ONE organisation rules (36 towns). These two print for two other reasons:
- (a) bar0-town-occupied-rand-43 holds NO rival rings. Its key is semi-organised from a lone "Gambling den" (the name ladder's `hasSemiOrg`), and the pool's line invents the rival crews. In the 720, 4 of 5 are this kind.
- (b) bar0-metropolis-calm-rand-42 holds "Multiple criminal factions", so the rings are true, but its Safety word is Very Safe, beside "walk anywhere at any hour, and there is little crime".
- THE ONE FACT: DS-DEF-4 "structure semi-organized" v3 declares `tier: ≥ village` only. It must declare the rings it asserts (a `rival rings` reading of `corruption.js :: rivalRingsOf`, which exists; making it an atom is new vocabulary and the owner's to veto). It must also not print under an occupation's curfew or a Very Safe word. Static: this is the one turf-war line in the desks.

**9a.order (C5430).** LAW 9's `9a.collapsed` list (`CALM_LAW`) did not hold the siege clause.
- THE ONE FACT: `src/generators/safetyProfile.js`, the siege branch (about lines 147–151), writes "The garrison keeps order, and more harshly as the food runs down" whenever a garrison stands. It does not read the law band the Foundations row prints as Collapsed.
- The cure: the clause reads the band and, under Collapsed, says the garrison holds the walls and order in the streets has gone. (It already has a twin, `SIEGE_NO_FORCE_ORDER`, in `safetyLineTruth.js`, for when no force stands.)
- HELD: SEAM-DESKS holds `safetyProfile.js` (its item 5), not this clause.

**7x.occupied-seat (C40850).** LAW 7 reads ordinary days under a crisis by its threat words and self-aware words, not the seat's freedom.
- THE ONE FACT: 12 lines of the power desk show the town's own seat ruling freely, and none declares against an occupation. They are DS-POW-1 "Approved" v1 and v4, DS-POW-2 "stable matched" v3 and v4 and "unclassified" v5, DS-POW-3 v3, DS-POW-5 "autocrat" v2 and v4 (`no crisis: succession` only), DS-POW-5 theocracy v1 and merchant_league v1, DS-POW-5 secularBrutalism, and DS-POW-7 "a RULING bloc".
- Each must declare `no crisis: occupied` (or `no crisis: threat`), or take an occupation twin. The page's own Power tab already prints "<seat> carries out what Occupation Authority decides" in every instance I read. The general and economy desks hold none of these lines.

**10i.pair (C19351).** No law read a pair's two ties.
- `src/generators/people/ties.js :: drawTies` draws one outgoing tie a card, so A→B and B→A are two draws. `inTemperOf` gives a pair's second tie the first's temper. But `src/data/npcData.js :: TIE_TEMPER` names only `mentor_student`, `respect` and `enemy`. A rival first tie has NO temper, and an ally second tie keeps its kind (only its strength can move).
- THE ONE FACT: TIE_TEMPER gives `rival` "cold" and `ally` "warm", and `inTemperOf` gives a warm-kind second tie beside a cold first one a cold kind, as it already does the other way. The late ties of `steps/assembleSettlement.js` (`people-ties-late`) draw on their own and do not see the seam's pair counts; I could not tell from the record which ties are late.
- Kin who are rivals (8) and respect between rivals (7) can both be true: apart.
- HELD: SEAM-DESKS holds `npcData.js` (its item 1, the paid watch), not TIE_TEMPER.

**6e.no-higher and 6e.crown (C16768; the LOW "royal decrees").** Two reasons LAW 6's `law6e` misses these:
- Its word list (`SOV`) holds no "royal", "king" or "realm", and it spares every crown under a war.
- The atom reads too wide. In C16768's town, `sovereign.js :: SOVEREIGN_WORDS` finds a sovereign in the power "Noble Families", the role "the castellan", the role "the exchange's steward" and a noble founder, while the government card prints "No higher lord, no external charter … an independent polity".
- THE ONE FACT, in two writers:
  - (a) `src/generators/npcGenerator.js` (line 401): the goal "Satisfy the crown requisition order …" names a crown for the war's requisition. The overview already says "signed a requisition order"; "the army's requisition order" needs no atom.
  - (b) `src/data/institutionServices.js` (line 1355): the Town crier's "Proclaim laws, royal decrees, and official notices" prints in every town that keeps a crier. It is 15 of the 720's 15 counted. Either declare `sovereign` or say "laws, decrees and official notices".
- `sovereign.js` is FROZEN (SEAM-CULTURE's own words). Reading the government card's "no higher lord" before the atom's lesser sources is the chair's to rule, and the owner's to veto (it changes what an atom reads).
- Static: 104 source lines in 25 town-page source files (`src/data`, `src/generators`, `src/domain/display`) name a crown, a king or a royal thing. 15 carry `sovereign` within their row and 89 do not (a near-text test: read it as an upper bound).
- NOT TO BE CURED: "the rest of the realm" (the Rumors tab's heading, 258 towns, the world map's word for the world, flagged by no reader), and the war's crowns in towns whose own facts give none (24 in 11 towns: by SV1 a war supplies the realm's; the wide read EXPLAINED C48148, C48270 and C48442).
- HELD: SEAM-CULTURE item 1 declares `sovereign` on the lord/crown lines of `historyData.js` and its own files. Neither of these two writers is in that list.

**5x.slash (C25601).** "Military/Guard" took a prose form (`data/people/powerSentenceName.js`, read by `narrativeText.js :: say`). HOUSES have none.
- THE ONE FACT: the economy desk's `{institution}` slot is filled by `properFill` with the roster label as stored (`src/domain/display/stateProse/economyStateProse.js`, around line 1235, DS-ECO-12 "A CATEGORY PRESENT BUT ITS CHAIN IMPAIRED": "… can offer less …" and "… is open but short of supplies …").
- 12 slash labels are authored: "Weavers/Textile workers", "Palace/government complex", "Small prison/stocks", "Colosseum/arena" (`institutionalCatalog.js`); "Docks/port facilities" (`cascadePass.js`); "Sage/library", "Spa/healing house", "Hot Springs / Healing Waters" (`resourceData.js`); "Livestock / game", "Wool / flax" (`economicData.js`); "Desert/Arid" (`geographyData.js`); "Monster Hunters / Adventurers" (`stressFactions.js`).
- 135 desk lines take a house or power slot. Only "Weavers/Textile workers" printed in a sentence in all three populations (42 instances, 2 lines). I did not trace why the other eleven labels never reach those two lines.
- The cure: a house prose form beside `powerSentenceName` (e.g. "the weavers"), read by `properFill` for `{institution}`. 8 instances where the label is one item of a list are apart.

**THE LOW FAMILIES, EACH WITH ITS ONE FACT:**
- "a generation old" is `src/domain/display/heraldCausalGrammar.js :: TIME_BANDS`: `a_generation` runs to `maxWeeks: 52 * 60`, so 40 to 60 years is "a generation". `generalStateProse.js :: yearBand` already re-bands a decade past fifteen years; the same function can band "two generations" past 40 years (100 lines of the 720 move).
- "Weak defences is/keeps" is `src/domain/display/governanceAccount.js` (lines 155–168). `one` counts the causes, not the grammatical number of the cause's label. The fix is a plural flag on the label (or the label "A weak defence"): 42 of the 720.
- The doubled list: 18 exact doubles (17 on the "Needed, and not brought in" line: `criticalImportsShown.js` and `crisisDependence.js` give "timber" and "mountain timber" twice). Only the exact and within-phrase cases are worth a cure.
- The hook's party: `src/data/historyData.js` ("the reformers are being used", 7 of the 720) and `src/domain/display/guardLineUnderTheLaw.js` / `safetyProfile.js` ("the old families …", 12), where no power, conflict or tension holds such a party.

**THE DESIGN POINT (the negatives C0350, C0351, C7307, C7309, C33342, C45848).** Every line is TRUE by its town's record. In every population, no siege town with nothing brought in prints them (`foodBalance.js` takes the "No food can be bought in from outside now" branch there, line 527). They read false because they never say how the food comes.
- THE WORDS I PROPOSE, in `src/generators/economy/foodBalance.js`, which already holds `importChannelLabel`:
  - under a siege: "what food the {importChannelLabel} still brings in costs more every week" and "decide what it can still afford to bring in by the {channel}";
  - the trade hook (line 774): "One importer now holds all the grain that comes in from outside and has quadrupled its price …".
- THE COUNT: 3 siege towns of the 720 (2 of the 30) take the channel's words; 77 towns of the 720 (grain imported, no siege) take the importer's.
- The 6 towns of the 720 that import food but no grain print only "decide what it can still afford to import", which is true there. The "all the grain" hook printed in no town that imports no grain.

## 3 · A WORKLIST FOR BUILDERS (disjoint file lists; each runs `node docs/chair/2026-11-17/bar7/AUDIT/runI.mjs <150-render> out.json` and the same over the 720)

**I-DESKS · the annex's economy, defence and power lines.** This is the only seat that edits the annex, because the three desks are one source file.
- FILES: `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`; the regenerated `src/data/dossierStateProse/economy.generated.js`, `defense.generated.js` and `power.generated.js`; `src/domain/display/stateProse/economyStateProse.js` (the `{institution}` fill and the entrepôt posture's import reading).
- RULES and the counts to bring down, in the 720 / the 150 / the 30:
  - 9g.subsistence 3/0/1 → 0
  - 9g.stores 8/3/1 → 0
  - 9g.food 0/0/1 → 0
  - 9g.margin 2/0/2 → 0, with margin-war left apart
  - 9g.source 8/0/1 → 0
  - 9h.entrepot 0/0/1 → 0
  - 9i.crews 5/0/2 → 0, with crews-safe left apart
  - 7x 3/2/1 → 0
  - 5x 38/3/1 → 0 (a house prose form; where it lives is this seat's call, with a planted case)
- The static half (`staticI.mjs`) must read 0 "admits" on 9g.subsistence, 9g.food (the strong lines), 9i.crews and 7x.
- WATCH: SEAM-DESKS holds these three generated files now; this seat comes after its join.

**I-ORDER · the siege's order clause.** FILES: `src/generators/safetyProfile.js` (the siege branch only); `src/generators/safetyLineTruth.js` (a twin beside `SIEGE_NO_FORCE_ORDER`). RULE: 9a.order, 0/7/1 → 0. WATCH: SEAM-DESKS holds `safetyProfile.js`; this comes after its join.

**I-TIES · one pair, one sense.** FILES: `src/data/npcData.js` (`TIE_TEMPER` only); `src/generators/people/ties.js` (`inTemperOf`). RULE: 10i.pair, 29/4/1 → 0, with pair-family and pair-respect left apart. A cure changes what a pair's second tie prints but no draw; the goldens that print ties are re-signed at the merge point.

**I-EXPORTS · the empty export line.** FILES: `src/components/new/tabs/EconomicsTab.jsx` (the exports' empty line, around line 481). RULES: 9h.no-exports 1/1/1 and 9h.no-exports-record 3/3/0 → 0. NOT `tradeListDisplay.js`: SEAM-ECON holds it.

**I-CROWN · two writers' crowns.** FILES: `src/generators/npcGenerator.js` (the requisition goal, line 401); `src/data/institutionServices.js` (the Town crier, line 1355). RULES: 6e.no-higher 8/2/1 and 6e.crown 7/1/0 → 0. NOT `sovereign.js` (frozen); the atom's width (a noble house, a steward or a castellan read as a sovereign over a city-state) is for the chair.

**I-LOW · LOW only, if the chair wants it.**
- FILES: `src/domain/display/governanceAccount.js` (number agreement, low.agree 42 → 0); `src/domain/display/stateProse/generalStateProse.js` (`yearBand`: "two generations" past 40 years, low.generation 100 → 0); `src/generators/economy/foodBalance.js` (the design point's words; design.outside keeps its count, but each line names its channel).
- WATCH: these three files are disjoint from the seats above, and from the seam's lists as far as its brief names them.

WHAT SHOULD NOT BE DONE, with the count that says why:
- Do not strike "closes every year ahead" wholesale: it is true in C12371 and C27960 and in 18 margin-war instances of the 720. Only 2 of the 720 stand.
- Do not touch "the rest of the realm" (258 towns, never flagged) or the war's crowns (24 in 11 towns, EXPLAINED at the wide read).
- Do not cure the 731 "within-word" doubles: "honey" beside "Honey and beeswax" is not a fault.
- Do not make kin or respect impossible between rivals (15 apart).
- Do not cure sentence by sentence: the 115 counted in the 720 are 45 distinct lines (29 of them the ties, one a pair), and they come from 8 writers: DS-ECO-8, DS-ECO-9, DS-ECO-12, DS-DEF-4, DS-POW-5, `EconomicsTab.jsx`, `ties.js`/`npcData.js`, and `institutionServices.js`.

## 4 · STATE

Everything is pushed to `lane/bar7-audit-i-2026-11-17`. No run is in flight. Every count above is from a run I saw end.

WHAT I COULD NOT SETTLE, with what I measured:
- Whether SEAM-DESKS's "DS-ECO-8 v3" is the COMFORTABLE pool's v3, the plainly-past-subsistence line. Its brief does not name the pool.
- Which of a pair's ties are late ties: the record does not say.
- The one "Cargo barges" 9h.no-exports-record instance (r2r-village-5, under a religious conversion). It is counted, and I could not confirm it.
- The town crier's "royal decrees" (all 15 counted 6e instances of the 720) is counted as a fault, but the sixth read weighed it LOW, not MED.
- The MED part of 6e is the requisition goal's: 1 in the 30 (C16768, where the government card denies a higher lord) and 0 counted in the 150 and the 720. In the 720, the war's crowns of towns with no sovereign of their own ("crown supply", "a crown officer", "the crown": 24) are apart by SV1.
