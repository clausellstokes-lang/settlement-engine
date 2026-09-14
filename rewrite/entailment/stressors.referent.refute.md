# REFERENT REFUTE — THE STRESSOR + CONDITION DESK (`stressors`: DS-STR-1 · DS-STR-2 · DS-CND-1)

Refuter: Fable 5.1. Dock: laneRW-DEFW at f2da5a3ee (`git log --oneline -1` re-run; `git status --porcelain` empty; read-only; the only things executed were `node scripts/prose-licence-card.mjs` three times and a `node -e` that prints census rows and leaf counts). Surveyor packet: `stressors.referent.survey.md` (392 lines, read whole). Every `file:line` below was re-derived in the dock at this sha; where the surveyor's line differs from mine, mine is the one I read.
Status: CHECKPOINT 3 — COMPLETE; inferred line numbers re-verified by grep (hooks `:689-721`, roles `:1018-1049`, holder cites) and corrected in place. Sections: §A the verdict table on every survey claim · §B the overlaps the surveyor missed · §C the missed nouns · §D the lines the chair should read first.

Verdict vocabulary: HOLDS (true for every member and consistent with the engine) · CONDITIONAL (true only for named members or only where a named field resolves; the condition is stated) · REFUTED (false for some member or contradicted by the engine; the code is quoted). Under uncertainty I defaulted to CONDITIONAL or REFUTED.

---

## §A VERDICTS, SURVEY SECTION BY SURVEY SECTION

### A.0 — §0 the desk derived

| # | survey claim | verdict | evidence (dock, f2da5a3ee) | condition |
|---|---|---|---|---|
| 0.1 | prefixes `DS-STR-`/`DS-CND-`, DESKS row `:113`, the leaf is the section (`prose-wave-gate.mjs:294-301`) | HOLDS | `scripts/generate-dossier-state-prose.mjs:108` opens `DESKS`, `:113` is the stressors row; `scripts/prose-wave-gate.mjs:294` opens `SECTION_LEAVES`, `:299` `stressors:` | — |
| 0.2 | "the desk's implementation `stressorsStateProse.js` — leaf map `prose-licence-card.mjs:60-61`" | CONDITIONAL | `scripts/prose-licence-card.mjs:60-61` maps `DS-STR`/`DS-CND` to `src/domain/display/stateProse/stressorsStateProseCandidates.js`, not to `stressorsStateProse.js`. The desk module is real (`stressorsStateProse.js:98-117` holds `CRISIS_POOL_OF`), but the cited line names the CANDIDATES file | true if read as "the desk's candidates leaf"; the cite does not support the module name |
| 0.3 | census totals: 17/32/18 pools, 15+2 / 22+10 / 12+6 | HOLDS | printed from `docs/content/wiring-census.json`: 67 rows; statuses as stated | — |
| 0.4 | variants 99 · 96 · 51 = 246 | REFUTED (per-block) | the leaf `src/data/dossierStateProse/stressors.generated.js` counts DS-STR-1 **96** (15×6 + 3 + 3), DS-STR-2 96, DS-CND-1 **54** (18×3); the census rows agree (`variants` 6/3/3). The total 246 holds by coincidence of two errors | — |
| 0.5 | 0 holders · 67/67 `SOURCE-UNRESOLVED` · kinds empty · covert 0 · narrowed 0 · attach 0 · objectClasses on 4 rows (market ×2, temple, hall) | HOLDS | printed row by row; `holders.summary.rows` = LICENSED 114 · OFFICE 3 · SOURCE-UNRESOLVED 591; `unresolvedGrounds.no-mapping` 444 | — |
| 0.6 | "this desk has no ORGAN-UNDER-POWER read wired anywhere, and no licensed institution referent of any kind" | HOLDS at the census grain | as 0.5 | the CARDS license nothing; the RECORDS still carry institution words in string fields (A.2.2, A.2.3) and the counterforce `{reason}` fill would print institution-class words once wired (B-9) |

### A.1 — §1 the four layers

| # | survey claim | verdict | evidence | condition |
|---|---|---|---|---|
| 1.1 | BODY buckets; the addendum omits `magicDef` (`defenseInstitutionBuckets.js:105-108`); `professional city watch` in garrison `:90` AND watch `:96` | HOLDS | `DEFENSE_BUCKET_KEYWORDS` `:83-109`: walls `:84`, garrison `:88` (member `'professional city watch'` `:90`), militia `:92`, watch `:95` (`'professional city watch'` `:96`), mercenary `:98`, charter `:101`, magicDef `:105`; `DEFENSE_BUCKET_KEYS` `:116` | — |
| 1.2 | roster flags `priorityHelpers.js:45-57`; `hasWatch` "town tier and up only (`:48`)" | CONDITIONAL | `:48` is `hasWatch: hasAny(names, ['town watch','city watch','professional city watch'])` — a NAME list; `hasAny` is a SUBSTRING test (`:25-26`, `n.includes(k)`). No tier is at that line. The tier fact is the catalog's seating: `src/data/institutionalCatalog.js:1348` `'Town watch'` under `town:` (`:923`), `:1918` `'Professional city watch'` under `city:` (`:1588`) | true by catalog seating; a custom-content roster can seat a "Town watch" at any tier, and then `hasWatch` fires there |
| 1.3 | `CIVIC_OBJECT_CLASSES` eleven classes, `objectClassesOf` reads the key only | HOLDS | `src/domain/prose/wiringCensus.js:1301-1323`; `objectClassesOf` `:1358-1365` splits the POOL KEY | — |
| 1.4 | `HOLDER_KINDS` `:78-81`; `STATE_ORGAN_KINDS` `:115`; muster tokens `:188-199`; `watch` its own row `:202-209` with `blackMarketCapture` `:210`, `criminalCaptureState` `:211`, `safetyProfile` `:212`; watch record services `:317-323` | HOLDS | `src/domain/prose/holderTable.js` at exactly those lines (muster block `:189-200`, watch `:203-212`) | — |
| 1.5 | "the addendum's `holderTable.js:129-143` is CORRECTED: the function opens at `:127`" | REFUTED | `:127` is ` * @returns {{criminal…}}` (JSDoc); `:129` is `export function capturedRulingStructure(settlement) {` and `:143` is its closing brace. The ADDENDUM's cite was exact; the surveyor's "correction" moved it onto a comment line | — |
| 1.6 | the ladder `factionCapture.js:137` (the addendum's `:136` corrected) | HOLDS | `src/domain/worldPulse/factionCapture.js:136` opens `settlementCaptureState`, `:137` `const LADDER = ['none','adversarial','equilibrium','corrupted','capture']`; again `:212` | — |
| 1.7 | `INTERESTED` `:90`; `standingOf` `:642-710`; organ gate; `interested` `:705-707` | HOLDS | `standingOf` opens `:642`, closes `:710`; `const organ = STATE_ORGAN_KINDS.includes(...)` `:678`; `interested:` `:706-707` | note for the chair: the per-faction path marks `captured` ONLY on `corrupted`/`capture` (`:661`), while the birth path marks `capturedAtBirth` on ANY non-`none` rung including `adversarial` (`:129-143`, `captured: (criminal !== null && criminal !== 'none')`). Two thresholds for one ladder |
| 1.8 | `SECURITY_INSTITUTION_RE` `corruption.js:630`; `compromisedSecurityInstitutions` `:663-691`; split `:677-680`; stooge `:684-689` | HOLDS | as cited; the regex is a SUBSTRING test on `inst.name` (`:665-666`) | the substring reach adds a member the survey does not list — B-1 (Watchtower) |
| 1.9 | `BROKERAGE_PATRON_SOURCES` `:60` | HOLDS | `src/domain/worldPulse/brokeragePatronage.js:60` | — |
| 1.10 | `nameOf` `rulingPower.js:131-133`; `governingFactionOf` `:224-229`; `governingName` `:88` | HOLDS | as cited (`governingFactionOf` closes `:230`) | — |
| 1.11 | `FACTION_ARCHETYPES` `:34-48`, `CATEGORY_MAP` `:53-61`, `NAME_RULES` `:67-88` | HOLDS | `src/domain/factionArchetypes.js` as cited: OCCUPATION `:68` (`garrison\s+rule`), RELIGIOUS `:70`, MILITARY `:79`, CRAFT `:80`, MERCHANT `:81`, NOBLE `:84`, OUTSIDER `:86`, GOVERNMENT `:87` | — |
| 1.12 | `holderRole` a measured null `institutionTable.js:129`, `:215`, `:457`, `:503-508`; `holderTable.js:31-36` | HOLDS | as cited | — |
| 1.13 | `FACTION_ROLES` "the ONLY typed role vocabulary" — eight titles, `factionRoles.js:40-60` | CONDITIONAL | the eight titles are at `:40-60`. But the engine carries a SECOND role vocabulary the survey never reads: `src/generators/npcGenerator.js:1002-1060` `ROLE_FACTION_MAP` — an ordered list of role WORDS matched against `npc.role` (`'reeve'` `:1006`, `'official'` `:1015`, `'captain'` `:1017`, `'garrison'` `:1023`, `'healer'` `:1035`, `'factor'` `:1054`, `'overseer'` `:1055`, …), plus an importance list `:64-72` (`'captain'`, `'commander'`, `'crime lord'`). `NAME_RULES` MILITARY also carries `captain|sheriff|warden|ranger|sentinel` (`factionArchetypes.js:79`) | "only typed role vocabulary" is true if "typed" means a frozen title list; false if it means "the words the engine emits or matches as roles" |
| 1.14 | `officesOf` free text `:377-396` | HOLDS | `src/domain/institutions/institutionTable.js:377-397` | — |

### A.2 — §2 the three records name no institution, holder, power or person

| # | survey claim | verdict | evidence | condition |
|---|---|---|---|---|
| 2.1 | `settlement.stress[]` nine fields, no institution/holder/power/person | HOLDS | `src/generators/stressGenerator.js:46-58` `buildStressEntry` returns exactly type · label · icon · colour · summaryRoll · summary · crisisHook · viabilityNote · historyColour | `summary` is a rendered sentence (`renderStressSummary`), so the record CARRIES prose the engine wrote — a string, not a ref |
| 2.2 | `worldState.stressors[]` — institution ref "none"; power "only inside `originContext`" | REFUTED in part | `src/domain/worldPulse/stressorsCore.js:349-350` keeps `counterforce: stressor.counterforce ‖ null`, and the counterforce profile's `sourceBreakdown[]` entries carry `kind: 'institution'` with keys `food` `:188`, `admin` `:205`, `finance` `:213`, `security` `:231`, `defense` `:256`, `religious` `:275` (`src/domain/worldPulse/stressorDynamics.js`); `sourceLabel` renders them as `` `${key} institutions` `` (`:389`). So the stressor record names INSTITUTION CLASSES (the world's own `INSTITUTION_CLASSES` `:47-55`), just not rows. Also `originContext.hooks[]` (`:738`) carries the engine's own sentences naming the garrison, the council hall, the courthouse door, officers, collectors, overseers (`VARIANT_HOOKS` `:657-729`) | the desk's CENSUS reads none of these; the RECORD holds them |
| 2.3 | `settlement.activeConditions[]` — institution none (`affectedSystems` are causal tokens); person none | CONDITIONAL | `src/domain/activeConditions.js:657-670` normalizes `label` and `description` from the template; templates speak of bodies and persons in those strings: `army_deployed` "standing army … home garrison" `:342`; `occupation_burden` "Garrisoning and administering" `:445`; `dominant_npc_removed` "A dominant leader is gone; succession is unresolved" `:306-308`; `triggeredAt.sourceEventTargetId` `:632` may carry that NPC-shaped event's target id | holds for TYPED refs; the record's `description` string is an institution/person-word carrier, and `dominant_npc_removed` is a person-shaped archetype the survey never names |
| 2.4 | "on this desk EVERY institution-class noun … is rendered on a read whose record holds no institution, no holder, no power and no person" | CONDITIONAL | true for the READS the census records (A.0.5); false for the RECORDS (2.2, 2.3): the coup's `contenders[].name` (`stressorDynamics.js:891-893`) is a typed power name on the very record the six ORIGIN pools read | — |

### A.3 — §3 the licence cards

| # | survey claim | verdict | evidence | condition |
|---|---|---|---|---|
| 3.1 | eleven cards print `source: (none) · standing SOURCE-UNRESOLVED`, `covert: no`, `audience: player (no mark)`, the REFUSED COLUMNS line | HOLDS | re-run three: `DS-STR-1 "INSURGENCY"`, `DS-STR-2 "ORIGIN: barracks_coup"`, `DS-CND-1 "PROVENANCE: …"` — identical grammar; the PROVENANCE card prints `NAMED BUT NEVER FILLED: {reason}` and `predicate: (none recovered…)` | — |
| 3.2 | cards 6, 7, 8 print a civic-object refusal and it is key-only | HOLDS | `objectClassesOf` `wiringCensus.js:1358-1365` splits the key; census `objectClasses` on exactly the four rows | — |
| 3.3 | "pool 4 `ORIGIN: temple_putsch`'s card refuses 'another civic object of the class temple'" is what would catch "pulpit" (used at F4) | CONDITIONAL | the `temple` class tokens are `temple · shrine · church · parish · clergy · faith · patron` (`:1312`); "pulpit", "altars", "sanctuary", "observances" are NOT tokens, so the instrument would not see them; only a refuter reads them | the LAYER finding stands; the "card already refuses" phrasing overstates the instrument |

### A.4 — §4.1 body words

| # | noun / claim | verdict | evidence | condition |
|---|---|---|---|---|
| 4.1 | walls/wall: bucket `:84-87`, flag `:53`, class `:1302`, muster token `:189`, no desk read | HOLDS | as cited; census `reads` on 67 rows carry no wall field | — |
| 4.2 | gates: "same wall class; separate roster row `hasGates`; via walls → muster" | CONDITIONAL | `priorityHelpers.js:54` and `wiringCensus.js:1302` ('gate') hold. MISSED: the roster row **"Gates (if walled)"** backs the **toll-bar** HOLDER kind (`holderTable.js:308` cite: `Gates (if walled), Major Port, Town council`), so a gate is a walls-body AND a toll-bar record keeper (B-5) | — |
| 4.3 | garrison: bucket `:88-91`, flag `:46`, class `force`, world `defense`+`security`, muster `:190`, corruptible, `garrison\s+rule` → OCCUPATION `:68` | HOLDS | as cited. Add: the garrison sits under BOTH upkeep purses — `hasAnyDefense` (`defenseGenerator.js:177-178`) AND `hasLawInfra` (`:244`, `inst.hasGarrison ‖ inst.hasWatch`) (B-4) | — |
| 4.4 | soldiers/officers: `force` class `soldier`; "officers" no engine row | HOLDS | `wiringCensus.js:1303`; no `officer` in `FACTION_ROLES`, `ROLE_FACTION_MAP` (`npcGenerator.js:1002-1060`), `NAME_RULES` | "sergeant", "commander", "marshal" ARE role words the engine matches (`npcGenerator.js:1018-1025`); "officer" is not |
| 4.5 | watch: the body/organ split; `hasWatch` town+; "Watch Captain is the one typed role bound to it"; never for a pay read | CONDITIONAL | split HOLDS (A.1.4). Tier: A.1.2. Role binding: `factionRoles.js:45` `linkToInst: /watch\|garrison\|barracks\|militia/` binds the Watch Captain to FOUR bodies, not the watch alone. Pay read: `defenseGenerator.js:177-178` `hasAnyDefense = … ‖ inst.hasWatch …` — the WATCH IS ONE OF THE SIX FLAGS THAT ARM THE MILITARY (muster) UPKEEP GATE, and `:244` puts it under the order purse too. So "the muster kind does not contain the watch bucket" is true of `holderTable.js` and FALSE of the generator's purse (B-4) | law item 5's bar is a holder-table fact; the generator gates the watch under both purses |
| 4.6 | army: no institution row; `NAME_RULES` MILITARY `army` | CONDITIONAL | `factionArchetypes.js:79` holds. The condition record's own words say "The settlement's standing army is committed abroad, thinning the home garrison" (`activeConditions.js:342`, `army_deployed`) | the engine speaks of a "standing army" as a condition description; no roster row |
| 4.7 | granary: `storehouse` class; a holder row drafted and withdrawn `:157-162` | HOLDS | `wiringCensus.js:1322`; `holderTable.js:157-161`; `stressGenerator.js:109` `hasGranary` is a probability input | note `wiringCensus.js:1319-1321`: a LONE `granary` key still reads as `store` (the deliberate asymmetry) |
| 4.8 | stores: class `store` | HOLDS | `:1309` | — |
| 4.9 | market: class, flag `:57`, kind `market` `:310-316`, MERCHANT `:56`/`:81`, key-level objectClasses twice | HOLDS | as cited | — |
| 4.10 | warehouse: "class `storehouse`" and no body row | CONDITIONAL | class `:1322` holds. MISSED: a roster flag `hasWarehouse` (`priorityHelpers.js:60`, `['warehouse']`) and catalog rows **"Merchant warehouses"**, **"Warehouse district"** (`src/data/institutionServices.js` keys) | the word has a BODY row |
| 4.11 | hall/council/chamber/seat/office: one class `:1314`; `office` a kind and organ; `seat` the power's object; key-level once | HOLDS | as cited. Add B-6: **"Town council"** backs BOTH the toll-bar (`holderTable.js:308`) and elders (`:336`) kinds; **"Village headman"** backs treasury (`:277`) and elders (`:336`); and `hasCourtSystem` (`priorityHelpers.js:56`) is `['courthouse','court buildings','democratic assembly','city hall','town hall']` — the COURT body flag contains hall rows | — |
| 4.12 | courthouse: class `law`, kind `court` organ, security regex, `CATEGORY_MAP.law → MILITARY` | HOLDS | as cited; plus B-6 (`hasCourtSystem` includes halls) | — |
| 4.13 | treasury: kind, organ, four fields `:166-169` | HOLDS | as cited | — |
| 4.14 | altars … congregations: class `temple` incl. `patron`; `parish` a kind not an organ; RELIGIOUS `:57`/`:70`; High Priestess | HOLDS | as cited | — |
| 4.15 | roads/road: class `:1313`, kind `road` fields `:234-235`, services `:349-355` | HOLDS | as cited. Missed uses: "routes" 4452 and "arteries" 4451 (`route` is a road-class token `:1313`) — §C | — |
| 4.16 | workshops: class `craft` | HOLDS | `:1316`; a roster row "Cartographer's workshop" exists (`institutionServices.js`) — no contradiction | — |
| 4.17 | schools: "no engine class and no roster row" | REFUTED (roster half) | no CIVIC class: true. Roster: `src/data/institutionServices.js` keys **"Gladiatorial school"**, **"Academy"**, **"Great library"**; `institutionalCatalog.js:1527` seats `'Gladiatorial school'` under `town:` | — |
| 4.18 | taverns: "no engine class" (as above, no roster row) | REFUTED (roster half) | `institutionServices.js` keys **"Inn/Tavern"**, **"Inn/Tavern District"**, **"Inns and taverns (district)"**, **"Taverns (5-20)"**, **"Coaching inn"**, **"Travelers' inn"**; `institutionalCatalog.js:981` `'Taverns (5-20)'` under `town:`, `:1002` `'Coaching inn'` | no civic CLASS, but several BODY rows |
| 4.19 | camps: no engine class; migration record is DS-POP-1's | HOLDS | no `camp` in any class list or catalog key I found | — |
| 4.20 | houses: NOBLE `\bhouse\s+[a-z]` `:84`; brokerage PATRON a different object | HOLDS | as cited | — |
| 4.21 | institutions (the generic) | HOLDS | — | — |
| 4.22 | healers: `care` class `healer`; "a role word with no engine row" | REFUTED | `wiringCensus.js:1315` holds. But **"Healer (divine, 1st level)"** is a catalog row (`institutionalCatalog.js:845`, under `village:` `:451`), `'healer'` is a role word in `ROLE_FACTION_MAP` (`npcGenerator.js:1035`), and the stress-driven NPC roster seats `'Healer'` for `famine` `:1523`, `plague_onset` `:1529`, `mass_migration` `:1533` — the DISEASE OUTBREAK face's "healers" is the engine's own stress-role word | — |
| 4.23 | barracks · militia · mercenary · charter · citadel · palisade · prison · gaol: 0 uses | HOLDS | `grep` of the annex slice 4049-4500: none rendered ("muster" 0 as well) | — |

### A.4.2 — §4.2 holder-organ words and §4.2b record words

| # | claim | verdict | evidence | condition |
|---|---|---|---|---|
| 4.24 | the twelve kinds' services and cites `:272-364` | HOLDS | `HOLDER_RECORDS` rows at `:272-278` treasury … `:356-364` office, services as quoted | — |
| 4.25 | `muster` — "ONE institution keeps a muster" and the desk never renders the word | HOLDS | `:279-288`; annex grep "muster" = 0 | — |
| 4.26 | `elders` — "as an ANGLE TAG only … seven variants: 4239 · 4269 · 4371 · 4382 · 4463 · 4468 · 4496" | REFUTED (count and lines) | `[elder]` faces in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` at **4249, 4256, 4271, 4371, 4380, 4461, 4467, 4496** — **eight**, and five of the surveyor's seven line numbers are off by 2–13 lines; 4249 (`LIFECYCLE: residual` #1) is missing from the survey entirely. The bar at 4066 holds | — |
| 4.27 | `watch` rendered twice (4145 verb, 4155 body) | HOLDS | annex 4145 "keeps more watch", 4155 "The watch's patrols" | — |
| 4.28 | `office` rendered five times as actor/location; `court` once; `treasury` twice; `road` twice; `market` six | HOLDS | annex lines as cited (4087 · 4112 · 4136 · 4153 · 4360; 4366; 4374 · 4486; 4143 · 4280; 4073 · 4081 · 4084 · 4127 · 4300 · 4365) | — |
| 4.29 | `rolls` → census, `DUTY_SERVICE_KINDS` names `rolls?` `institutionTable.js:106` | HOLDS | `:106` regex includes `rolls?`, `musters?`, `levy\|levies`, `tolls?`, `tax(?:es)?` | — |
| 4.30 | `ledgers` — a `ledger` row drafted and withdrawn | HOLDS | `holderTable.js:159-161` | — |
| 4.31 | `quarantine` — a Defense-tab posture `defenseDisplay.js:25-42` | HOLDS | `MILITARY_POSTURE.plague_onset: 'QUARANTINE ACTIVE'` `:33` | — |
| 4.32 | `tax · levy` → treasury and toll-bar | HOLDS | services `:274`, `:305` | — |

### A.4.3 — §4.3 power words

| # | claim | verdict | evidence | condition |
|---|---|---|---|---|
| 4.33 | "authority" → "`publicLegitimacy`, `stability` → kind court (`holderTable.js:215-223`)" | REFUTED (half) | `grep publicLegitimacy src/domain/prose/holderTable.js` → no match. The court block `:215-224` maps `govMultiplier · governanceFractured · breakdown · blocs · stability · recentConflict · termLines · fraying · yearsRemaining`; `stability` `:219` holds; `publicLegitimacy` is NOT a holder token (it is a `PowerStructure` typedef property, `rulingPower.js:90`) | — |
| 4.34 | government / governingName unread | HOLDS | census reads carry no `powerStructure` field | — |
| 4.35 | "ruler" — `incumbent.name` typed on the coup record `:894` | HOLDS | `stressorDynamics.js:894` `incumbent: { ...contest.incumbent }`; `rulingPowerCoup.js:118-123`. Note: the engine's OWN hook says "Officers loyal to the **seat**" (`stressorDynamics.js:690`); the shipped face changed it to "the ruler" | — |
| 4.36 | "occupier" — `occupierName` "typed, by name, and unread by this desk"; §7/§10.3 "the name one field away" for DS-STR-1 `UNDER OCCUPATION` | REFUTED for DS-STR-1; CONDITIONAL for DS-CND-1 | `occupierName = nameFor(rec.occupierId)` (`occupationStatus.js:96`) reads `worldState.occupations[settlementId]` (`:87-91`), a ledger written ONLY by the world run (`src/domain/worldPulse/pulseKernel.js:1150`; `grep occupations src/generators` → no writer). DS-STR-1's `occupied` is a BIRTH token (`stressGenerator.js:46-58`): at birth there is no occupations record, so the name is not "one field away" — it does not exist. The occupier is a SETTLEMENT id, not a faction | DS-CND-1's occupation family is a world-run condition, where the ledger can exist |
| 4.37 | "creditor" — no typed field on the desk's records | HOLDS for the desk | the world run types a creditor (`generosityKernel.js:920` `creditorId = String(rec.to)`) on the obligations ledger, and `factionRelationshipUpdate.js:542` carries "Creditors to a strapped treasury" | true of the DESK's records; a creditor id exists elsewhere |
| 4.38 | sponsor `:747, :783, :884`; faction `nameOf`; religious authority via `COUP_VARIANT_BY_ARCHETYPE` `:914`; houses ↔ archetype `merchant` `:913` | HOLDS | as cited (`COUP_VARIANT_BY_ARCHETYPE` `:911-919`) | — |

### A.4.4 — §4.4 role words

| # | claim | verdict | evidence | condition |
|---|---|---|---|---|
| 4.39 | clerks — no engine row at any layer | HOLDS | not in `FACTION_ROLES`, `ROLE_FACTION_MAP`, `NAME_RULES`, any class list; the only hit is a narrative string `npcProfile.js:158` ("A clerk or under-official scrambles…") | — |
| 4.40 | overseers — none | REFUTED | `npcGenerator.js:1055` `['overseer', econFaction]` — an NPC role word the engine matches | the engine EMITS/MATCHES the role word; it still binds no institution (`holderRole` null) |
| 4.41 | collector / collectors — none | HOLDS | no hit in the role maps; `DUTY_SERVICE_KINDS` names `tolls?`/`tax`, not a collector | — |
| 4.42 | officials — none | REFUTED | `npcGenerator.js:1015` `['official', govFaction]` | as 4.40 |
| 4.43 | officers — none | HOLDS | (A.4.4) | — |
| 4.44 | administrators — none | HOLDS (role); note the BODY | no role hit; but **"City administration"** is a roster row (`institutionalCatalog.js:1900`, city tier) backing treasury and office kinds (`holderTable.js:277`, `:362`) — §C "administration" | — |
| 4.45 | healers — a civic object, not a role | REFUTED | A.4.22 | — |
| 4.46 | scouts — none; the hook string `:679` | HOLDS | `stressorDynamics.js:679` | — |
| 4.47 | handler / asset — the engine's own reason string `:763` | HOLDS | `:763` "The handler is gone, the asset remains." | — |
| 4.48 | mages / casters / hedge wizards — buildings only, no caster row | REFUTED | `npcGenerator.js:1040-1049` `ROLE_FACTION_MAP` matches `'wizard'`, `'mage'`, `'archmage'`, `'sorcerer'`, `'hedge wizard'` as NPC role words; the world `arcane` class `:53` and `magicDef` bucket `:105-108` are bodies as the survey says, but "hedge wizard" is verbatim an engine role token | — |
| 4.49 | "captain · reeve · elder · priest · factor — 'factor' appears nowhere in any engine vocabulary" | REFUTED (factor) | `npcGenerator.js:1054` `['factor', econFaction]`; `reeve` `:1006`, `captain` `:1017`, `priest` `:1027`, `elder` `:1004` are all there too | the desk renders none of the five — that half holds |

### A.5 — §5 the reads and their layers

| # | claim | verdict | evidence | condition |
|---|---|---|---|---|
| 5.1 | token read = a CONDITION OF THE TOWN, nine display fields | HOLDS | `stressorsStateProse.js:98-117`; `stressGenerator.js:46-58` | — |
| 5.2 | ORIGIN: "6 of 17 (`palace_coup`, `barracks_coup`, `merchant_cabal`, `temple_putsch`, `arcane_ascendancy`, `council_schism`) are a FACTION ARCHETYPE read" | CONDITIONAL | `stressorDynamics.js:877`: `variant = (leading && COUP_VARIANT_BY_ARCHETYPE[leading.archetype]) ‖ 'palace_coup'` — **`palace_coup` is ALSO the DEFAULT** when there is no leading challenger or the archetype is outside the map (`craft`, `labor`, `outsider`, `occupation`, `other`; `criminal` is filtered at `rulingPowerCoup.js:104`). Five are pure archetype reads; `palace_coup` is archetype-or-fallback | a face on `palace_coup` may not say "a noble house" without `contenders[0].archetype === 'noble'` |
| 5.3 | "3 (`servile_uprising`, `tax_revolt`, `popular_revolt`) are a CAUSAL SCORE read (`:832-850`)" | REFUTED in part | only `servile_uprising` reads causal scores (`labor_capacity < 35 && public_legitimacy < 40`, `:829-836`); `tax_revolt` reads CO-LOCATED STRESSORS (`activeHere('indebtedness') ‖ activeHere('market_shock')`, `:842`); `popular_revolt` is the FALLBACK (`:848-852`) | — |
| 5.4 | "1 (`internal_conspiracy`) and 1 (`unattributed`) are the fail-closed branches" | CONDITIONAL | both are fallbacks (`:766-773`, `:789-796`); so are `popular_revolt` (`:848`) and `palace_coup` (`:877`) — four fallbacks, not two | — |
| 5.5 | the coup half is "an ORGAN-UNDER-POWER-shaped read, and the power has a typed name the desk does not use" | CONDITIONAL | `contenders[].name` `:891-893` holds. The snapshot is stamped "NARRATIVE only. The verdict recomputes contenders from live state" (`:886-889`) — the recorded name is the BIRTH field, and the challenger may change before the knives move | naming the power from `contenders[0].name` is licensed as a birth-time fact only |
| 5.6 | `condition.archetype`: "One of the 46, `corruption_exposed`, IS an organ-under-power fact — and it is not one of the three written" | REFUTED | the 46 (`activeConditions.js:59-483`) include `rebellion` `:99` ("against an overlord or coercive patron"), `faction_challenge` `:107`, `government_overthrown` `:115` ("The ruling power has just changed hands"), `coup_suppressed` `:123`, `dominant_npc_removed` `:306` ("A dominant leader is gone"), `army_deployed` `:340`, `occupation_resistance` `:433`, `occupation_burden` `:443` — power-, person- and body-layer archetypes beside `corruption_exposed` `:290` | the "three written" half holds (`reconstruction`, `boom`, `flourishing`) |
| 5.7 | "sixty carry a read whose layer is a CONDITION, BAND, STAGE or WINDOW of a record, with no institution, organ, power or role in it at all" | CONDITIONAL | true of the READ; the FAMILY pools (dark) and the archetype pools sit on a record whose `description` carries the engine's own body and person words (A.2.3) | — |
| 5.8 | COUNTERFORCE/SYNERGY "nothing is read", dark by declaration `:388-397`; FAMILY dark `:338-352` | HOLDS | as cited; census `reads: []` on all 15 | — |

### A.6 — §6 overlaps O-1 … O-12

| # | claim | verdict | evidence | condition |
|---|---|---|---|---|
| 6.1 | O-1 watch — seven rows; "at thorp/hamlet/village the word names nothing at all" | CONDITIONAL | seven rows hold. The tier sentence is REFUTED as a totality: `src/generators/safetyProfile.js:30-35` prints `'local watch'` below town (`tier === 'town' ? 'town watch' : tierAtLeast(tier,'city') ? 'city watch' : 'local watch'`) whenever `inst.hasWatch` resolves (`:269`, `:322`) — the engine has a THIRD watch name in no bucket; and B-1 adds an eighth row (Watchtower) | the phrase names nothing only where `hasWatch` is false |
| 6.2 | O-2 garrison | HOLDS + B-4 | — | — |
| 6.3 | O-3 court | HOLDS + B-6 | — | — |
| 6.4 | O-4 market | HOLDS | — | — |
| 6.5 | O-5 hall/council/seat/office/charter/chamber/moot; the card refuses "chamber" and "office" | HOLDS | `wiringCensus.js:1314` lists `chamber` and `office`; the `council_schism` card prints `objectClasses: ['hall']` | plus B-6 |
| 6.6 | O-6 patron | HOLDS | `:1312`, `brokeragePatronage.js:60`, `factionArchetypes.js:86` | — |
| 6.7 | O-7 guard | HOLDS | `defenseInstitutionBuckets.js:90`, `corruption.js:630`, `factionArchetypes.js:79`, `wiringCensus.js:1303` | — |
| 6.8 | O-8 elder — "seven times" | REFUTED (count) | eight faces (A.4.26) | — |
| 6.9 | O-9 granary vs store; a fishery earns the credit | HOLDS | `:1304-1308`, `:1322`; `stressorDynamics.js:48` `/(granary\|mill\|farm\|orchard\|fishery\|silo)/i` | — |
| 6.10 | O-10 house | HOLDS | — | — |
| 6.11 | O-11 four spellings of one force class | HOLDS | add `stressGenerator.js:107` `hasWalls = wall\|citadel\|palisade` — the WALL class also has three spellings (B-8) | — |
| 6.12 | O-12 `objectClassesOf` sees the key only | HOLDS | `:1358-1365` | — |

### A.7 — §7 slots and safe words

| # | claim | verdict | evidence | condition |
|---|---|---|---|---|
| 7.1 | `{counterpart}` proper, `dossier-slot-shapes.mjs:27`; named by `declared_war` only; `SLOT_FILL_TABLES` empty `:82` | HOLDS | `SHAPE_PROPER` `:27`; leaf line 1511 is the only `{counterpart}` text; `stressorsStateProse.js:82` | — |
| 7.2 | `attackerSettlementId` `:781`; sponsor `:747/:783/:884`; former sponsor `:759`; `attackerLabel` the DM pen `stressors.js:610-627` | HOLDS | as cited; every branch stamps `attackerLabel: null` | — |
| 7.3 | `contenders[].name…` `:891-893`; `incumbent.name` `:894` | HOLDS | as cited; see 5.5 for the "narrative only" bound | — |
| 7.4 | `occupierName` `:83/:91/:96` NOT READ; "DS-STR-1 UNDER OCCUPATION … render 'the occupier' with the typed name one field away" | REFUTED for DS-STR-1 | A.4.36 | — |
| 7.5 | `criminalCaptureState` written `rulingStructure.js:797`; `factionStates[].captureState` `:136-145` | HOLDS | `src/generators/power/rulingStructure.js:797`; `holderTable.js:661-663` | — |
| 7.6 | safe word BODY/paid-military = "the muster" | CONDITIONAL | class word of the holder table (`:188-200`); but "the muster" as a RECORD exists in one roster institution only (`:279-288` Citizen militia) — safe as a class word, unsafe as "the muster roll" | — |
| 7.7 | safe word "the guard" (garrison bucket) | HOLDS | `:90` | — |
| 7.8 | safe word "the watch — only for an order read; never for a pay read" | CONDITIONAL | by the holder table yes; by the generator the watch arms BOTH purses (B-4). A pay read on the watch is an ENGINE fact (`defenseGenerator.js:246-253`: "watch wages, court and gaol funding"), so the bar is a chair's choice, not an engine impossibility | — |
| 7.9 | safe word "the office" | HOLDS | `:356-364` | — |
| 7.10 | POWER class words "the ruling structure · the seat · another power · the occupier · the factions" | HOLDS | none asserts a name; "the occupier" is safe as a class word even where `occupierName` is null | — |
| 7.11 | ROLE: none safe | CONDITIONAL | the engine emits role words (A.1.13); none binds an institution. "None safe" is the right default for THIS desk (no read reaches a role); it is not an engine-wide null | — |

### A.8 — §8 visibility

| # | claim | verdict | evidence | condition |
|---|---|---|---|---|
| 8.1 | covert impairment → DM pen; `COVERT_SOURCES` `wiringCensus.js:1252-1259`; `isCovertPath` `:1263-1269` | HOLDS | as cited | the covert set is ALSO filled by an unexposed corrupt NPC with no impairment at all (`corruption.js:683-689`, `npc.corrupt`), so "covert = `impairment.covert === true`" is one of two routes |
| 8.2 | `corruption_exposed` a public scandal, both faces; the FAMILY pool that lists it is dark | HOLDS | `activeConditions.js:290-296`; `institutionStatusModel` lives at `src/domain/worldPulse/institutionStatusModel.js:118-120` (causes), `:166` (cure), `:178` (label) — the survey's path `src/domain/institutionStatusModel.js` is wrong by a directory | the cited file path is wrong; the lines are right |
| 8.3 | birth capture DM-only; brokerage patron n/a; attacker identity as an absence; all 67 reads `covert: false` | HOLDS | census; `stressorDynamics.js:787-796` | — |
| 8.4 | F32 the `[ledger · dm-only]` face 4123 on a `covert: false` row | HOLDS | annex 4123; census row `INFILTRATED` `covert=false` | — |

### A.9 — §9 findings F1–F32, P1–P5

| # | claim | verdict | evidence | condition |
|---|---|---|---|---|
| F1 | garrison body word on an archetype read | HOLDS as a layer finding; CONDITIONAL as an "invented" one | the sentence is the engine's own hook: `stressorDynamics.js:689` "The garrison drilled at midnight without orders…", attached to the record as `originContext.hooks[]` (`:738`). The layer mismatch stands; the WORDS are a record field a wiring car could license | — |
| F2 | "inside the walls by right" — walls unread | HOLDS | — | — |
| F3 | "the houses that finance" | HOLDS | — | — |
| F4 | "pulpit" on an archetype read | HOLDS (layer); the card-refusal clause CONDITIONAL (A.3.3) | — | — |
| F5 | "Wards around the council hall have failed" | HOLDS | engine hook `:701` says the same; no per-institution field at birth | note `ward` is a `care`-class token (`wiringCensus.js:1315`) — B-3 |
| F6 | rump session / chamber | HOLDS | hook `:705`; `chamber` in `:1314` | — |
| F7 | "The garrison is quartered inside the walls" — occupier's typed name "one field away" | HOLDS (layer) / REFUTED (the name) | A.4.36 | — |
| F8 | "the treasury and the thin garrison, not in the walls" — per-institution split on a dark pool | HOLDS | ADDENDUM 12 amendment; `institutionStatusModel.js:118-120` | — |
| F9 | "Garrisons, administrators and suppression" — body + role plural on a dark pool | HOLDS (layer) | the words are the producer's own comment and description (`activeConditions.js:441-445`); `description` is a record field | — |
| F10 | "The watch's patrols" — (a) no institution on the record; (b) village tier; (c) patrols not a watch service | (a) HOLDS · (b) CONDITIONAL · (c) HOLDS but incomplete | (b) A.1.2, A.6.1. (c) `patrol` IS a `force`-class civic token (`wiringCensus.js:1303`) — so "the watch's patrols" is a FORCE-class object by the census's own vocabulary (B-2) | — |
| F11 | "keeps more watch than it can afford" — a pay read on the watch, muster kind does not contain the watch | HOLDS (unlicensed pay read); the purse mapping CONDITIONAL | the watch's wages are the ORDER purse (`defenseGenerator.js:246-253`) AND the watch arms the MILITARY purse (`:177-178`) — B-4 | — |
| F12 | "The levies of a drowning treasury" — a PERSON-shaped predicate on the treasury organ; "a cause the card refuses" | CONDITIONAL | the sentence is VERBATIM the engine's recorded `reason` field: `stressorDynamics.js:844` `reason: 'The levies of a drowning treasury finally broke the commons.'` stamped on `originContext`. The layer point stands (an organ as agent); the "cause the card refuses outright" is the RECORD's own string, one wiring row from licensed | — |
| F13 | the hall as a deciding agent on three token reads; thorp has no hall | HOLDS | `holderTable.js:336` elders cite `Household elder, Village elder, Village headman, Town council` | — |
| F14–F17 | granary/market/altars/office on token or archetype reads | HOLDS | — | — |
| F18 | "now a person with dangerous knowledge" — an explicit PERSON | HOLDS | annex 4310; and see §C for 4114 "the person responsible", a second one the survey missed | — |
| F19 | clerks ×3 | HOLDS | A.4.39 | — |
| F20 | overseers ×2 | CONDITIONAL | the role WORD is an engine role token (`npcGenerator.js:1055`); the AGENCY ("keep order") is the finding, not the word | — |
| F21 | collectors | HOLDS | the hook `:717` says "The collectors now travel in pairs…" — engine's own words on the record | — |
| F22 | officers / "ruler" for a faction-typed incumbent | HOLDS | hook `:690` says "loyal to the seat"; the face's "ruler" is the writer's | — |
| F23 | healers — "a civic object, not a role; the face makes it a role" | REFUTED | A.4.22: `'healer'` is an engine role word and a catalog row | — |
| F24 | scouts | HOLDS | `:679` | — |
| F25 | mages/casters/hedge wizards | CONDITIONAL | "hedge wizard" is an engine role token (`npcGenerator.js:1049`); the MOVEMENT claims are the finding | — |
| F26 | two officials, fused agent | HOLDS | hook `:706` ("Two officials now claim the same seal, the same office, and the same tax."); the "town pays whichever collector" clause is the writer's | — |
| F27 | soldiers as a collective person with intention | HOLDS | — | — |
| F28 | watch as activity vs body across two pools on one page | HOLDS | both rows `sites: overview.crisisBanners` | — |
| F29 | factions arithmetic unread | HOLDS | `rulingPowerCoup.js:88-104` | — |
| F30 | three-party relation on a dark pool | HOLDS | census `reads: []` | — |
| F31 | two record classes, anaphora across blocks | HOLDS | `stressorsStateProse.js:98-117` vs `stressorsCore.js:325-360` | — |
| F32 | dm-only mark | HOLDS | A.8.4 | — |
| P1–P5 | positive exemplars | HOLDS | annex 4087, 4092, 4325, 4066; `stressorsStateProse.js:421-424` | — |

---

## §B THE OVERLAPS THE SURVEYOR MISSED (each an engine fact; none a writer's choice)

| # | word | the engine rows it sits in at once | file:line | why it matters to the law |
|---|---|---|---|---|
| B-1 | **watch → Watchtower** | `SECURITY_INSTITUTION_RE` `/(watch\|…)/i` is a substring test on the name, so the roster row **"Watchtower"** (`src/data/institutionServices.js:1561`) is a corruptible "security institution"; `hasMilitaryInst` (`priorityHelpers.js:45`, `'watch'`) and the world `defense` class (`stressorDynamics.js:50`, `tower`, `watch`) also count it; `hasWatch` (`:48`) and the watch bucket (`:95-97`) do NOT | the security regex and the watch bucket do not coincide: an eighth row for O-1. CONDITIONAL on a settlement carrying the row (it is in the services roster; I did not find it seated in `institutionalCatalog.js`) |
| B-2 | **patrol** | `force` civic class token (`wiringCensus.js:1303`) | "the watch's patrols" (4155) is a force-class OBJECT by the census's own list, so a key naming it would be refused beside another force object; the survey read "patrols" only against the watch kind's services |
| B-3 | **ward(s)** | `care` civic class token (`wiringCensus.js:1315`) vs the arcane sense in two ORIGIN faces (4354, 4379) and the engine's own hooks (`stressorDynamics.js:701`, `:721`) | one spelling, a hospital ward and a magic ward; a key or a restatement guard reading tokens would cross them |
| B-4 | **watch AND garrison under BOTH upkeep purses** | `defenseGenerator.js:177-178` `hasAnyDefense = hasWalls ‖ hasGarrison ‖ hasMilitia ‖ hasWatch ‖ hasMercenary ‖ hasCharterHall` arms the MILITARY gate (`:184-191`, "garrison wages, wall maintenance"); `:244` `hasLawInfra = hasCourtSystem ‖ hasPrison ‖ hasGarrison ‖ hasWatch` arms the ORDER gate (`:246-253`, "watch wages, court and gaol funding") | the ADDENDUM's "the muster kind does not contain the watch bucket" is a HOLDER-TABLE fact (`holderTable.js:203-209`); at the GATE the watch is one of the six flags of the muster purse and the garrison is one of the four flags of the order purse. "One purse per class" holds per GATE, not per BODY — the watch and the garrison are each read by two purses. A pay read on the watch is therefore an engine fact the law may bar by choice, not by absence |
| B-5 | **gate(s)** | walls body (`priorityHelpers.js:54`; `wiringCensus.js:1302` `gate`) AND the **toll-bar** HOLDER kind's roster backing ("Gates (if walled)", `holderTable.js:308`) | a gate is a body and a record-keeper; the survey rows it as walls → muster only |
| B-6 | **council / headman / market as double holders; court flag holds halls** | "Town council" backs toll-bar (`holderTable.js:308`) AND elders (`:336`); "Village headman" backs treasury (`:277`) AND elders (`:336`); "Weekly market" backs treasury (`:277`) AND market (`:315`); `hasCourtSystem` (`priorityHelpers.js:56`) = `courthouse · court buildings · democratic assembly · city hall · town hall` | one roster row keeps two kinds' records, and the COURT body flag is true on a town with only a Town hall — "the court" as a body word can be licensed by a hall row |
| B-7 | **`corruption_exposed`, two records** | a per-institution impairment CAUSE (`src/domain/worldPulse/institutionStatusModel.js:119`, label `:178`, cure `:166`) AND a settlement-level condition ARCHETYPE (`activeConditions.js:290-296`) | the same token is an organ-under-power fact at two grains (one institution vs the town); a face on the archetype may not name WHICH institution |
| B-8 | **wall, three spellings** | `priorityHelpers.js:53` (`walls · citadel · gates (if walled) · inner citadel · massive walls · palisade · earthwork`), the bucket (`defenseInstitutionBuckets.js:84-87`, substring `wall`), `stressGenerator.js:107` (`wall · citadel · palisade`) | O-11's four force spellings have a wall sibling; `hasGates` (`:54`) is true on `town walls`/`city walls`/`palisade` without any gate row |
| B-9 | **`{reason}` on COUNTERFORCE prints institution-CLASS words** | `sourceLabel` (`stressorDynamics.js:386-391`): `'healing:redundancy' → 'healer redundancy'`, `'ally:military_protection' → 'allied military protection'`, and `kind === 'institution'` → `` `${key} institutions` `` for keys `food · admin · finance · security · defense · religious` (`:188-335`) | once the dark COUNTERFORCE pool is wired, the desk WILL render "security institutions" / "defense institutions" — the world's `INSTITUTION_CLASSES` vocabulary (`:47-55`), which is neither a bucket nor a holder kind (its `security` omits `barracks`; the corruption regex includes it). A third "watch/guard" vocabulary reaches the page through a bare-common slot |
| B-10 | **`local watch`** | `safetyProfile.js:30-35` prints `town watch` / `city watch` / **`local watch`** as the law-enforcement label whenever `hasWatch` (`:269`, `:322`) | a watch NAME the engine itself prints that is in no bucket and no holder row; the ADDENDUM 13 O-3 `{watchname}` fill would inherit it |
| B-11 | **occupier, two records** | DS-STR-1 `occupied` is a birth token (`stressGenerator.js:46-58`, `CRISIS_POOL_OF.occupied`); the occupier's identity lives only on the world-run ledger `worldState.occupations` (`pulseKernel.js:1150`; read `occupationStatus.js:87-96`) | "the occupier" is a class word at birth and a settlement NAME after a world run; the survey treats them as one |
| B-12 | **`palace_coup` is the coup's default** | `stressorDynamics.js:877` | A.5.2: the variant is an archetype read for `noble` and a fallback otherwise, so "a courtly one / the people who already stand nearest" (4335-4337) can print on a `labor` or `outsider` challenger |
| B-13 | **role words in faction NAME rules** | `NAME_RULES` MILITARY `captain\|sheriff\|warden\|ranger\|sentinel` (`factionArchetypes.js:79`); GOVERNMENT `reeve\|steward\|elder` (`:87`) | a role word inside a faction's NAME makes a POWER-layer archetype; the Watch Captain title (`factionRoles.js:45`) links to four bodies by regex |
| B-14 | **`garrison` as an NPC role word** | `npcGenerator.js:1023` `['garrison', milFaction]` | the body word is also matched as a person's role text — the exact PERSON/BODY collision the law forbids, inside the engine's own inference |

---

## §C MISSED NOUNS (institution-class nouns and role words in the annex 4049-4500 the survey did not row)

| noun (annex line) | layer the engine holds | evidence |
|---|---|---|
| **administration** (4088 "the administration is not its own"; 4184 "The administration is improvising") | BODY row ("City administration", `institutionalCatalog.js:1900`, city tier) that backs the **treasury** and **office** kinds (`holderTable.js:277`, `:362`) — the compiling organ by another name | the survey rows "office(s)" and never "administration", which is the roster's own spelling of the office kind |
| **routes** (4452) · **arteries** (4451) | road class (`wiringCensus.js:1313` `route`); road holder kind services "Way-bill registration" (`:351`) | rowed only at 4143/4280 |
| **workroom** (4356 "it needs a workroom, and it has several") | arcane BODY word — the world `arcane` class is buildings (`stressorDynamics.js:53`), `magicDef` bucket `:105-108`; a catalog row "Academy of magic" | not rowed |
| **conspiracy / conspirators / the plot** (4306, 4314, 4316, 4335, 4345) | POWER layer — the coup's challenger faction, typed as `originContext.contenders[]` (`stressorDynamics.js:891-893`); the engine's own hooks use "the conspirators" (`:670`) | not rowed as a power word; it is the only agent noun of the coup pools and it is the faction |
| **resistance / armed movement** (4151, 4284, 4329-4331) | a scalar on the occupations ledger (`occupationStatus.js:94` `rec.resistance`, `resistancePhrase`) and the `occupation_resistance` archetype (`activeConditions.js:433`); NO institution row | a body-shaped agent with no body; the survey rows "collaborators/patriots" but not the movement itself |
| **neighbour** (4321 "a named and openly hostile neighbour"; 4314 "no recent feud") | POWER layer — a SETTLEMENT (`hostileNeighborsOf`, `stressorDynamics.js:743`, `:777`), the `{counterpart}` shape | the survey rows "sponsor" and "creditor" and not the neighbour, which is the one the record types by id (`attackerSettlementId` `:781`) |
| **heir** (4137 "no undisputed heir") | ROLE word; no engine row; the nearest record is `dominant_npc_removed` "succession is unresolved" (`activeConditions.js:306-308`) | a succession role the survey's role sweep missed |
| **the person responsible** (4114 RECENTLY BETRAYED #4 "reaches past the person responsible") · **somebody it had reason to trust** (4114) · **Somebody in {settlement} answers elsewhere** (4122) | PERSON referents — the second explicit "person" on the desk beside F18's 4310, and two person-shaped indefinites | F18 lists 4310 only |
| **list(s)** (4075 "issued against a list"; 4131 "keeping two lists (the sick and the exposed)"; 4366 "a list of grievances") · **tally** (4375) · **bill** (4376) | RECORD words of the office/treasury/watch organs (the watch keeps "Missing persons", `holderTable.js:319`; the office "Record filing" `:358`) | §4.2b rows rolls/books/accounts/ledgers/seal/writ and misses these |
| **the men** (4178 "the men, the carts") · **hands** (4079, 4091 "passes a hand that is not the town's") | muster persons / a person-shaped metonym for the occupier | the totality-over-persons column |
| **the street / the crowd** (4336, 4335, 4356, 4364) | a collective-person agent for `popular_revolt` (the engine's own reason: "The streets rose on their own", `:850`) | not rowed |
| **badge** (4154 "neither part wears a badge") | a body marker for the watch/order organ | minor |
| **the works** (4105 "coin that would have gone to the works") | a body-ish word (public works) with no row | minor |
| **sergeant / commander / marshal / constable / warden** | ROLE words the engine matches (`npcGenerator.js:1018-1025`) that the desk does NOT render — recorded so the chair's closed role list (survey §10.10) starts from the engine's list, not the desk's | — |

---

## §D THE LINES THE CHAIR SHOULD READ FIRST

1. **The surveyor's one "correction" of the addendum is itself wrong** (A.1.5): `capturedRulingStructure` opens at `holderTable.js:129` and closes at `:143`; the addendum's `:129-143` was exact.
2. **The watch is under BOTH purses at the gate** (B-4): `defenseGenerator.js:177-178` arms the military upkeep multiplier on `inst.hasWatch`, and `:244` arms the order multiplier on `inst.hasGarrison`. Law item 5's "the muster kind does not contain the watch bucket" is true of the holder table and not of the generator. The chair may keep the bar; it should be recorded as a ruling, not an engine impossibility.
3. **The occupier's name does not exist at birth** (A.4.36, B-11): `worldState.occupations` is written only by `pulseKernel.js:1150`. The survey's §10.3 wiring row ("`occupierName` exists and is unread") is a world-run row; for DS-STR-1 there is nothing to wire.
4. **Three role-word "none" rows are false** (A.4.40, 4.42, 4.45, 4.49): `overseer`, `official`, `healer`, `factor`, `hedge wizard`, `reeve`, `captain`, `priest`, `elder` are all role tokens in `npcGenerator.js:1002-1060`, and "Healer (divine, 1st level)" is a village-tier catalog row. None binds an institution (`holderRole` null stands), so the LAW's role clause is unaffected — but the survey's "the desk's role vocabulary is entirely its own invention" is not true.
5. **The coup-pool sentences are the record's own words** (F1, F5, F6, F12, F21, F22, F26): `VARIANT_HOOKS` (`stressorDynamics.js:657-729`) rides on the record as `originContext.hooks[]` (`:738`), and `reason` (`:844`) is a stamped field. The layer findings stand; the "invented" framing does not, and a wiring row (`hooks`/`reason` as reads) would license most of the convicted words verbatim.
6. **`palace_coup` is a fallback** (B-12), **`tax_revolt` reads stressors not scores** (A.5.3), and **the 46 archetypes carry six more power/person/body-layer rows than `corruption_exposed`** (A.5.6).
7. **Counts**: variants 96/96/54 (A.0.4); `[elder]` faces eight (A.4.26).
8. **Institution-class words will reach this desk through `{reason}`** (B-9) the moment COUNTERFORCE is wired — "security institutions", "healer redundancy", "allied military protection" — in a vocabulary that is neither the buckets nor the holder kinds.
