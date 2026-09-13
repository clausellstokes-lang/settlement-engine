# REFERENT SURVEY — THE GENERAL DESK (overview / relations / population / hooks)

Lane `laneRW-DEFW`, dock `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW`, detached at `f2da5a3ee`. READ-ONLY: nothing modified, staged or committed; no vitest, no npm, no build. The only node run was `scripts/prose-licence-card.mjs`, which prints and writes nothing.

This packet is EVIDENCE, not law. Every row is a candidate for the chair. Nothing here is ruled. Sibling: `general.survey.md` (the ENTAILMENT survey — what a word MEANS). This packet asks the other question: WHAT A WORD REFERS TO, and by what layer the read fixes it.

---

## 0. SCOPE — THE DESK'S BLOCK SET, AND WHAT ITS READS ACTUALLY RESOLVE

| item | value | file:line |
|---|---|---|
| desk key | `general` | `scripts/prose-wave-gate.mjs:294` (`SECTION_LEAVES`), the `general` row at `:297` |
| desk title | THE OVERVIEW / RELATIONS / POPULATION / HOOKS DESK | `scripts/generate-dossier-state-prose.mjs:114` |
| block prefixes | `DS-GEN-` · `DS-REL-` · `DS-POP-` · `DS-HK-` | `scripts/generate-dossier-state-prose.mjs:114` |
| desk leaf | `src/domain/display/stateProse/generalStateProse.js` (2048 lines) | — |
| blocks | 23 (`DS-GEN-1,2,3,5…18` · `DS-REL-1,2` · `DS-POP-1,2,3` · `DS-HK-1`); `DS-GEN-4` folded into `DS-STR-1` | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5366` |
| census rows | 193 of 708 · RESOLVED 119 · WIRING-UNRESOLVED 74 | `docs/content/wiring-census.json` |
| pools whose `covert` flag is true | **0** | `docs/content/wiring-census.json`; flag set at `src/domain/prose/wiringCensus.js:1681` from `isCovertPath` (`:1256-1268`) |

### 0.1 THE HOLDER KINDS THIS DESK ACTUALLY RESOLVES (the referent's own denominator)

Counted over the desk's 193 census rows, on `source.kind`:

| holder kind | rows | which pools | STATE ORGAN? (`holderTable.js:115`) |
|---|---|---|---|
| *(none — SOURCE-UNRESOLVED)* | 162 | every DS-GEN-1, -2, -5, -8, -14, -16, -17 row; all DS-POP-1/-2/-3; all DS-HK-1; the three score/label families of DS-GEN-3 | — |
| `treasury` | 7 | `DS-GEN-3 :: economicViability.viable` ×2 · `DS-GEN-11` ×5 | **YES** |
| `elders` | 5 | `DS-GEN-9 :: recency framing` ×5 | no |
| `road` | 5 | `DS-GEN-12` ×5 | no |
| `market + toll-bar` (two-source) | 4 | `DS-GEN-13` ×4 | no |
| `market` | 4 | `DS-GEN-18` ×4 | no |
| `toll-bar` | 3 | `DS-GEN-6 :: crossroads · isolated · road` | no |
| `office` | 3 | `DS-GEN-7 :: structuralViolations[] · structuralSuggestions[]` · `DS-REL-2 :: prominentRelationship present` | **YES** |

⭐ **THE HEADLINE FIGURE FOR THE REFERENT QUESTION.** **Not one pool on this desk resolves the `watch`, `muster`, `court`, `parish`, `census` or `tradition` holder kind.** Ten of 193 rows carry the STATE-ORGAN flag, and both of the kinds that carry it here (`treasury`, `office`) are money-and-record organs, never order organs.

⛔ **THE COUNT, RE-MEASURED AND CORRECTED (this packet's earlier figures were wrong; these are the defensible ones).** Method: the desk's annex ranges `4831-5177` (DS-POP-1/-2), `5178-5962` (DS-GEN-1…14, DS-REL-1/-2, DS-GEN-9/-10, DS-HK-1, DS-GEN-11…14) and `6039-6265` (DS-POP-3, DS-GEN-15…18) — the desk ends at `:6265`, `DS-FTH-4` begins at `:6266`; **the range `5963-6038` is a DEFENSE block (`{defwork}`) and is excluded.** Every line carrying a `` `[angle]` `` tag is a variant-bearing line (496 of them); the angle tags are stripped before counting so `DS-GEN-9`'s `[elder]` ANGLE NAME is not miscounted as the elders kind. **Measured: all 56 "elder" hits in the desk's range are the `[elder]` angle tag, and after stripping the tags the count over the variant bodies is ZERO.** So the desk resolves the `elders` holder kind on 5 pools at standing LICENSED (`DS-GEN-9 :: recency framing` ×5, `marker.yearsAgo`) — **the one order-adjacent record it may lawfully cite — and never once uses the word.** The exposure runs entirely the other way: the words it uses are the ones it cannot cite.

| word | occurrences over the 496 variant-bearing lines | the layer it belongs to | what any general-desk read resolves |
|---|---|---|---|
| **market** | 24 | BODY + `market` HOLDER | the ONE family the desk genuinely resolves (DS-GEN-13, DS-GEN-18) |
| **rolls / roll** | **18 + 8 = 26** | HOLDER-ORGAN (`census` — *Citizen registration · Noble registration*) | **nothing: no `census` row anywhere on the desk, and `HOLDER_SOURCES` carries no population, migration, births or deaths token at all** |
| **hall** | **15** | the `{seat}` typed slot — *never a baked noun* | no block below declares `{seat}` (§5.3) |
| **books / book** | **11 + 4 = 15** | HOLDER-ORGAN (`office` — standing always OFFICE, **no citation licensed**; or `treasury`) | licensed on the 7 treasury rows only |
| **watch** | **13** | BODY (bucket) **and** HOLDER-ORGAN (the order organ) | nothing (§5.2) |
| **walls** | 11 | BODY (the `walls` bucket) | nothing on this desk (DS-GEN-17's `readings.inst` resolves no holder) |
| **seat** | 7 | the `{seat}` typed slot | as above |
| **granary** | 6 | BODY | nothing (a disjunct inside `readings.inst`) |
| **gates · stalls · port** | 3 each | BODY | `stalls` only, via the market family |
| **muster** | 3 | HOLDER-ORGAN (`muster`) | nothing |
| **patron** | 3 | a `relationshipType` VALUE, a brokerage POWER, and a `temple` civic-class token (O-12) | the value only |
| **garrison · court · temple · exchange · harbour · client** | 2 each | BODY / HOLDER-ORGAN | nothing |
| **officers · levy** | 1 each | ROLE (person-class) / HOLDER-ORGAN (`treasury`) | nothing |

⭐⭐ **THE CORRECTION THIS MAKES TO THE PACKET'S OWN CONCLUSION.** The earlier draft named the watch (claimed 20) as "the desk's single largest exposure". **It is not.** Measured, the watch is 13 and **the RECORD WORDS — the rolls (26) and the books (15), 41 together — are more than three times it**, and the baked seat (hall 15 + seat 7 = 22) is nearly twice it. The desk's largest referent fault is not a force word on a band read; it is **a HOLDER-ORGAN record word on a read that resolves no holder** — and the `[ledger]` angle is where it lives, because the ledger angle's whole stance is *"enters and measures"* and the writers reached for the register that would be doing the measuring. §8 is the new section that lists them.

### 0.2 LICENCE CARDS RUN (11, across 8 blocks; the brief asked for five)

`node scripts/prose-licence-card.mjs <block> <pool>`. Selected for reads that touch an institution, an organ, a power or a role.

| block :: pool | reads (as printed) | source line as printed | referent-bearing content |
|---|---|---|---|
| `DS-GEN-17 :: GARRISONED` | `readings.inst` (measured) | `(none) · standing SOURCE-UNRESOLVED` | body read; **no holder, no citation** |
| `DS-GEN-3 :: scores.military: WEAK` | `axis` · `score` (measured), predicate `axis === military` | `(none) · SOURCE-UNRESOLVED` | an AGGREGATE over bodies; the card names no body |
| `DS-GEN-3 :: scores.internal: ADEQUATE` | `axis` · `score`, predicate `axis === internal` | `(none) · SOURCE-UNRESOLVED` | same |
| `DS-GEN-3 :: safetyProfile.safetyLabel: head word in {Secure, Controlled, Quarantined}` | `head (via SAFETY_POOL_OF …)` | `(none) · SOURCE-UNRESOLVED` | the field token `safetyProfile` maps to the **watch** kind (`holderTable.js:212`) but the pool's READ GRAIN is the key-function argument `head`, so the card resolves nothing |
| `DS-GEN-3 :: defenseProfile.readiness.label: Fortress` | `text(label) (via READINESS_POOL_OF …)` | `(none) · SOURCE-UNRESOLVED` | an aggregate of aggregates |
| `DS-GEN-7 :: power_economic: criminal faction in a transit hub` | the `type\|tab` key via `COHERENCE_POOL_OF` | `(none) · SOURCE-UNRESOLVED` | bag `{band: RESERVED, faction: proper, govFaction: proper, settlement: proper}` · **`{band}` and `{faction}` NAMED BUT NEVER FILLED** · `audience: player (no mark) · marks in this pool: dm-only` |
| `DS-GEN-7 :: power_economic: temple economy under a secular seat` | same | `(none) · SOURCE-UNRESOLVED` | `FILLED: {govFaction} {settlement}` · `may NOT: … another civic object of the class` `temple` |
| `DS-GEN-7 :: structuralViolations[]` | `readings.structuralViolations` (measured) | **`office · standing OFFICE · a STATE ORGAN (interested where the town is captured)`** | the ONLY referent-layer line the card prints today |
| `DS-GEN-11 :: viable: true: the arithmetic closes` | `readings.viable` (measured) | **`treasury · standing LICENSED · a STATE ORGAN (interested where the town is captured)`** + `a citation of this holder is licensed where the provenance budget allows` | |
| `DS-REL-1 :: patron` | `link` (measured) | `(none) · SOURCE-UNRESOLVED` | bag carries `{npc: proper}`; `FILLED: {counterpart} {npc} {settlement}` |
| `DS-REL-1 :: cross-settlement NPC contacts` | `link.npcConnections` **(not-produced)** | `(none) · SOURCE-UNRESOLVED` | the desk's one PERSON-naming pool |

**What the card gives the referent law today, and what it does not.** The card prints the source KIND, the STANDING (`LICENSED` / `OFFICE` / `SOURCE-UNRESOLVED`), and — since SEAM car 5c — one referent-layer sentence: `· a STATE ORGAN (interested where the town is captured)` (`scripts/lib/prose-licence-card.mjs:333`, flag minted at `src/domain/prose/holderTable.js:560`). That single string is the whole of the card's referent vocabulary. It has **no BODY column, no ROLE column, and no POWER column**; it cannot say that a read is a body read rather than a standing read, and it cannot say which noun layer a face is entitled to. ADDENDUM 11's rule 2 ("the licence card prints the layer per read once ratified") therefore needs a NEW column, not a re-reading of an existing one.

---

## 1. ADDENDUM 11's ENGINE CITES, RE-DERIVED AT `f2da5a3ee`

Every cite in the addendum verified by hand in this dock. Verdicts: **CONFIRMED** where the line says what the addendum says it says.

| addendum claim | addendum's cite | what is actually there | verdict |
|---|---|---|---|
| BODY = the defence buckets (walls · garrison · militia · watch · mercenary · charter) | `defenseInstitutionBuckets.js:83-104` | `DEFENSE_BUCKET_KEYWORDS` at `:83`; walls `:84`, garrison `:88`, militia `:92`, watch `:95`, mercenary `:98`, charter `:101` — **plus a seventh, `magicDef`, at `:105`**, which the addendum does not list | CONFIRMED, with the seventh bucket added |
| "professional city watch" sits in BOTH the garrison and the watch buckets | — | `'professional city watch'` at `defenseInstitutionBuckets.js:90` (garrison) and `:96` (watch) | **CONFIRMED** |
| `HOLDER_KINDS` are the twelve | `holderTable.js:78` | `holderTable.js:78-81` — treasury · muster · census · parish · toll-bar · market · watch · court · elders · tradition · road · office | CONFIRMED |
| the MUSTER kind covers walls · garrison · militia · mercenary · charter | `holderTable.js:188-192` | `HOLDER_SOURCES` rows `walls` `:188`, `garrison` `:189`, `militia` `:190`, `mercenary` `:191`, `charter` `:192`, plus `force` `:193`, `magicDependency` `:194`, `economicGates` `:195` — all `kind: 'muster'` | CONFIRMED |
| the WATCH kind is a STATE ORGAN keeping the order records | `holderTable.js:115`, `:210-212` | `STATE_ORGAN_KINDS = ['office','court','treasury','watch']` at `:115`; `blackMarketCapture` `:210`, `criminalCaptureState` `:211`, `safetyProfile` `:212`, all `kind: 'watch'`; the `watch` token itself at `:203-209` carries the note that it is mapped to the WATCH "rather than to the muster on the ruling's own grain" | CONFIRMED |
| POWER = the capture ladder + per-faction captureState | `holderTable.js:129-143`, `factionCapture.js:136` | `capturedRulingStructure` at `holderTable.js:129-143`; `settlementCaptureState` at `src/domain/worldPulse/factionCapture.js:136` | CONFIRMED |
| the four organs are INTERESTED by a settlement-wide capture | SITTING §R c-22 | `standingOf(…, kind)` at `holderTable.js:642`; the organ gate at `:677`; the ABSENT-BY-RULE refusal for a non-organ kind at `:683`; `interested` at `:707` | CONFIRMED |
| corruption impairment on a SECURITY body; `covert` = the DM channel | `corruption.js:630`, `:655-680` | `SECURITY_INSTITUTION_RE = /(watch\|garrison\|constab\|guard\|magistrate\|court\|barracks)/i` at `src/domain/corruption.js:630`; `compromisedSecurityInstitutions` at `:663`; the covert/revealed split at `:679-680`, the comment at `:670-672` naming covert "the hidden channel" | CONFIRMED (path is `src/domain/corruption.js`, **not** `src/domain/worldPulse/corruption.js`) |
| a brokerage house's PATRON, genesis · captured | `brokeragePatronage.js:60` | `BROKERAGE_PATRON_SOURCES = ['genesis','captured']` at `src/domain/worldPulse/brokeragePatronage.js:60`; `genesisPatronOf` `:202`, `capturedPatronOf` `:228`, the binding at `:272-295` | CONFIRMED |
| PERSON is never a referent: `COLUMN_SOURCES.holderRole` is a measured null | `holderTable.js:32-36` | the prose at `holderTable.js:32-36`; the roster row itself at `src/domain/institutions/institutionTable.js:129-138`, `read: false`, note *"none exists; `npcProfile.js:341-353` infers a link by name regex and this module does not call it"* | CONFIRMED |

### 1.1 THREE THINGS THE ADDENDUM DOES NOT YET SAY, MEASURED HERE

1. **THERE IS A THIRD BIRTH PURSE, NOT TWO.** ADDENDUM 12's amendment names the MILITARY purse (`milUpkeepMult`, floor 0.6, `src/generators/defenseGenerator.js:189`) and the ORDER purse (`internalUpkeepMult`, floor 0.65, `:251`). The generator carries a **MONSTER purse** as well — `monsterUpkeepMult = min(1, 0.7 + econOutput/50 × 0.3)` at `:223`, gating "patrol provisioning, bounty purses, charter-hall retainers" (`:214-222`), floor 0.7 — and a fourth, `econHealthMult` (floor 0.45) at `:289`. All four are published side by side on `economicGates` at `:467-471`. The one-gate-many-things pattern is therefore FOUR gates, and the general desk's DS-GEN-3 reads three of the five axes those gates produce.
2. **`inst.hasWatch` FEEDS THE MILITARY SCORE.** `defenseGenerator.js:163` adds `+7` to `military` for `hasWatch`, and `:178` puts the watch inside `hasAnyDefense`, which is what the MILITARY purse gates. The watch is therefore under BOTH purses at birth: `+7` military (military purse) and `+18` internal (`:235`, order purse). The addendum's "the watch's pay is under the order purse and the muster's under the military purse" is true of the WATCH KIND'S RECORD and false of the WATCH BODY'S SCORE CONTRIBUTION. A face on this desk that reads a military band must not therefore be told "the watch is not in this read"; it is in it, at a seventh of a garrison's weight.
3. **A ROLE WORD IN THIS ENGINE IS A BODY ROW, NOT A PERSON.** `Household elder` (`src/data/institutionServices.js:14`), `Village headman` (`:20`), `Village elder` (`:26`), `Lord's steward` (`:1035`), `Priest (resident)` (`:1194`), `Village reeve` (`:1346`) and `Warden's Lodge` (`:491`) are TOP-LEVEL INSTITUTION ROWS in the shipped services catalog. The generator reads them as institutions, not as people: `hasInst('reeve','steward','elder','household council','free elder')` adds to `communityIntBase` and `communityMilBase` at `defenseGenerator.js:151-152`. **On this desk the ROLE layer and the BODY layer are the same row**, which is the sharpest single answer this desk gives the owner's question.

---

## 2. THE DESK'S INSTITUTION-CLASS NOUN TABLE — LAYERS PER NOUN

For every institution-class noun a face of this desk can render. **B** = BODY (an institution row or bucket) · **H** = HOLDER-ORGAN (a `HOLDER_KINDS` row) · **P** = POWER (a typed standing over an organ) · **R** = ROLE (a role word in a standing state). Every cell carries its engine row.

### 2.1 THE ORDER AND FORCE FAMILY

| noun | B | H | P | R | engine rows (file:line) | always-safe class word |
|---|---|---|---|---|---|---|
| **the watch** | ✔ | ✔ | ✔ | — | B: `inst.hasWatch = hasAny(names,['town watch','city watch','professional city watch'])` `src/generators/priorityHelpers.js:48`; also a member of `hasMilitaryInst`'s substring list `:45`; bucket `watch` `defenseInstitutionBuckets.js:95-97`; scores `defenseGenerator.js:163` (military +7) and `:235` (internal +18). H: kind `watch`, services `Crime reporting · Crime response · Missing persons`, roster-backed by `Professional city watch, Town watch` — `holderTable.js:318-322`; its fields `blackMarketCapture` `:210`, `criminalCaptureState` `:211`, `safetyProfile` `:212`. P: a STATE ORGAN — `STATE_ORGAN_KINDS` `holderTable.js:115`; a corruption impairment on it — `SECURITY_INSTITUTION_RE` `src/domain/corruption.js:630`. Display spelling is TIER-SCALED: `src/generators/safetyProfile.js:30-35` | **the guard** for the body; **the watch** ONLY where the town's own roster row resolves and the read is the order record |
| **the guard** | ✔ | — | ✔ | — | B: `'professional guard'` in the garrison bucket `defenseInstitutionBuckets.js:89`; `'guard'` in `hasMilitaryInst` `priorityHelpers.js:45`; glyph class `barracks` = `/(barracks\|garrison\|guardhouse\|guard house)/i` `src/domain/townMap/glyphAssign.js:98`. P: `guard` is a member of `SECURITY_INSTITUTION_RE` `corruption.js:630` | **the guard** — a body word, never a holder |
| **the garrison** | ✔ | ✔ (muster) | ✔ | — | B: `hasGarrison` `priorityHelpers.js:46`; bucket `garrison` `defenseInstitutionBuckets.js:88-91`; scores `defenseGenerator.js:161` (+28 military), `:201` (+20 monster), `:234` (+15 internal). H: the `garrison` field token maps to `muster` `holderTable.js:189`. P: in `SECURITY_INSTITUTION_RE` `corruption.js:630` | **the garrison** (body) / **the muster** (the roll) |
| **the militia / the muster** | ✔ | ✔ | — | — | B: `hasMilitia` `priorityHelpers.js:47`; bucket `militia` `defenseInstitutionBuckets.js:92-94`; `defenseGenerator.js:162,203,236`. H: kind `muster`, service `Muster training`, **roster-backed by ONE institution in the whole shipped catalog — `Citizen militia` (`src/data/institutionServices.js:835`)** — `holderTable.js:280-287`, whose own note reads *"A town with a Garrison and no militia has men under arms and no roll of them"* | **the muster** for the paid military as a class; a named militia only where the roster row is the Citizen militia |
| **the mercenary company / free company** | ✔ | ✔ (muster) | — | — | B: `hasMercenary` `priorityHelpers.js:49`, `hasFreeCompany` `:50`; bucket `mercenary` `defenseInstitutionBuckets.js:98-100`; `defenseGenerator.js:164`. H: `holderTable.js:191` | **hired men** |
| **the charter hall** | ✔ | ✔ (muster) | — | — | B: `hasCharterHall` `priorityHelpers.js:51`; bucket `charter` `defenseInstitutionBuckets.js:101-104`; `defenseGenerator.js:165,200,237`. H: `holderTable.js:192` | **the charter hall** |
| **the walls / the gates** | ✔ | ✔ (muster) | — | — | B: `hasWalls` `priorityHelpers.js:52`, `hasGates` `:53`; bucket `walls` `defenseInstitutionBuckets.js:84-87`; `defenseGenerator.js:160,202`. H: `walls` → `muster` `holderTable.js:188`; separately `Gates (if walled)` is a **toll-bar** roster row `holderTable.js:308` | **the works** |
| **the court** | ✔ | ✔ | ✔ | — | B: `hasCourtSystem = hasAny(names,['courthouse','court buildings','democratic assembly','city hall','town hall'])` `priorityHelpers.js:55`; `defenseGenerator.js:232` (+20 internal); glyph class `archive-hall` swallows `courthouse` `glyphAssign.js:104`. H: kind `court`, roster-backed by `Courthouse, Multiple court buildings` `holderTable.js:325-329`; its fields are the SEAT's, not the law's — `govMultiplier` `:215`, `blocs` `:218`, `stability` `:219`, `termLines` `:221`. P: a STATE ORGAN `holderTable.js:115`; in `SECURITY_INSTITUTION_RE` `corruption.js:630` | **the seat** where the row is a hall; **the court** only where the row is a courthouse |
| **the prison / the gaol** | ✔ | — | — | — | B: `hasPrison = hasAny(names,['prison','stocks','large prison','massive prison'])` `priorityHelpers.js:54`; `defenseGenerator.js:233` (+15 internal). No holder kind names it | **a place of confinement** |
| **the magistrate / the constable / the barracks** | ✔ | — | ✔ | — | No `priorityHelpers` boolean; they exist ONLY as members of `SECURITY_INSTITUTION_RE` `corruption.js:630`. A face can reach them only through a corruption impairment, which this desk has no read for | — (unreachable on this desk) |

### 2.2 THE SEAT, THE RECORD AND THE PURSE

| noun | B | H | P | R | engine rows (file:line) | always-safe class word |
|---|---|---|---|---|---|---|
| **the hall / the council / the seat** | ✔ | ✔ (three kinds at once) | ✔ | — | B: `Town council` `src/data/institutionServices.js:32`, `Town hall` `:1623`, `City hall` `:1629`, `City administration` `:39`. H: **`Town council` is an `elders` row** (`holderTable.js:336`) AND a **`toll-bar`** row (`:308`); **`Town hall` is a `treasury` row** (`:277`) AND an **`office`** row (`:361`); **`City administration` is a `treasury` row** (`:277`) AND an `office` row (`:361`). P: `office`, `treasury` and `court` are all STATE ORGANS `holderTable.js:115`. The slot: `{seat}` — *"the governing body BY ITS OWN GENERATED NAME — tier-scaled (Headman's Authority, Town Council, Grand Merchant Oligarchy); **never a baked noun**"* `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:1816`, register row `:194` | **the seat**, filled from `{seat}` — **never "the hall" or "the council" as a baked noun** |
| **the elders** | ✔ | ✔ | — | ✔ | B/R (the same rows): `Household elder` `institutionServices.js:14`, `Village elder` `:26`, `Village headman` `:20`; read as institutions by `hasInst('reeve','steward','elder',…)` `defenseGenerator.js:151`. H: kind `elders`, sole service `Record of custom`, roster `Household elder, Village elder, Village headman, Town council` `holderTable.js:332-336` | **the elders** (the kind) / **the custom** (the record) |
| **the reeve · the headman · the steward** | ✔ | ✔ | — | ✔ | `Village reeve` `institutionServices.js:1346` → a **treasury** row `holderTable.js:277`; `Village headman` `:20` → **BOTH** an `elders` row (`:336`) and a `treasury` row (`:277`); `Lord's steward` `:1035`; `Lord's appointee` `:1030` → treasury `:277` | a role word here is a **BODY** word; there is no person behind it |
| **the treasury** | ✔ | ✔ | ✔ | — | H: kind `treasury`, services `Tax collection · Tax payment · Taxation and tolls · Tithe and dues`, roster `Village headman, City administration, Weekly market, City-state government, Lord's appointee, Village reeve, Town hall` `holderTable.js:273-277`; fields `incomeSources` `:166`, `viable` `:167`, `criticalIssueCount` `:168`, `economicViability` `:169`. P: STATE ORGAN `:115` | **the purse** / **the treasury** |
| **the office** | — | ✔ | ✔ | — | H: kind `office`, services `Public records · Public record access · Record filing`, roster `City administration, City hall, Town hall` `holderTable.js:357-361`, with its own note that a citation on a fact sourced here *"would be citing the speaker"* `:362-363`. P: STATE ORGAN `:115`. Standing is always `OFFICE`, never `LICENSED` — `sourceOfRow` `:563-570` (`standing: 'OFFICE'` at `:569`) | **the record** — and no citation |
| **the toll-bar** | ✔ | ✔ | — | — | H: kind `toll-bar`, services `Toll collection · Customs brokerage · Market charter and tolls`, roster `Gates (if walled), Major Port, Town council` `holderTable.js:304-308`; fields `tradeRouteAccess` `:183`, `blockaded` `:184`, `blockadeBypass` `:185` | **the toll** |
| **the census** | ✔ | ✔ | — | — | H: kind `census`, services `Citizen registration · Noble registration`, roster `Democratic assembly, Royal seat` `holderTable.js:290-294`. **NO general-desk pool reads it**, though DS-POP-1/-2/-3 are the population blocks | **the roll** |
| **the tradition** | — | ✔ | — | — | H: kind `tradition`, `services: []`, `rosterBacked: false`, note *"THE ONE KIND WITH NO INSTITUTION ANYWHERE IN THE SHIPPED ROSTER … SOURCE-UNRESOLVED in every town the product can generate"* `holderTable.js:339-346` | a face sourced here may cite nothing |
| **the road holder** | ✔ | ✔ | — | — | H: kind `road`, services `Road register · Way-bill registration`, roster `Listening post` (`institutionServices.js:1652`), `Waystation` (`:405`) — `holderTable.js:350-354`; fields `terrainType` `:233`, `monsterThreat` `:234` | **the way** |

### 2.3 THE CIVIC AND ECONOMIC FAMILY

| noun | B | H | P | R | engine rows (file:line) | always-safe class word |
|---|---|---|---|---|---|---|
| **the market / the stalls / the exchange** | ✔ | ✔ | — | — | B: the NAME class `/\b(market\|bazaar\|exchange\|shambles\|stalls)\b/i` — `generalStateProse.js:1109` (`MARKET_NAME`), lifted from `glyphAssign.js:100`; a DIFFERENT member list on `hasMarket` `priorityHelpers.js:56` (adds `fair`, `trade center`; drops `shambles`, `stalls`). H: kind `market`, services `Weekly market · Public auctions`, roster `Market square` (`institutionServices.js:1064`) — `holderTable.js:311-315`; **`Weekly market` is ALSO a `treasury` roster row** `:277` | **the exchange** / **the stalls** |
| **the church / the temple / the parish** | ✔ | ✔ | — | ✔ (`Priest (resident)`) | B: `hasChurch` over EIGHT house kinds `priorityHelpers.js:65`; narrower `hasCathedral` `:66`, `hasMonastery` `:67`; `defenseGenerator.js:149` (+8 internal, +3 military); glyph split `spire` `glyphAssign.js:91` vs `small-spire` `:92`. H: kind `parish`, services `Register of the dead · Central register · Records`, roster `Parish burial grounds, Cemetery network, Parish church` (`institutionServices.js:1161`) — `holderTable.js:297-301`; fields `piety` `:226`, `unaffiliated` `:227`. R: `Priest (resident)` is an INSTITUTION ROW `institutionServices.js:1194` | **a house of the faith** (body) / **the parish** (the record) |
| **the granary / the storehouse** | ✔ | — | — | — | B: `hasGranary` = the bare substring `'granar'` `priorityHelpers.js:63`; `defenseGenerator.js:271`-region storage read. Census civic classes split it: `store` (the STOCK) `wiringCensus.js:1309` vs `storehouse` (the BUILDING) `:1322` | say **the building** or **what is in it**, never both in one word |
| **the hospital / the healer** | ✔ | — | — | — | B: `hasHospital = hasAny(names,['hospital','monastery','healer','friary'])` `priorityHelpers.js:64` — a monastery sets this AND `hasChurch` `:65`; `defenseGenerator.js:204` (+5 monster). Civic class `care` `wiringCensus.js:1315` | **a house that takes in the sick** |
| **the port / the harbour / the navy** | ✔ | ✔ (toll-bar) | — | — | B: `hasPort` = `PORT_INFRA_RE = /\b(?:port\|docks?\|harbou?r\|shipyard\|navy)\b/` `priorityHelpers.js:32,61`; `hasNavy = hasAny(names,['navy','major port'])` `:62`. H: `Major Port` is a **toll-bar** roster row `holderTable.js:308`. Glyph `quay-shed` `glyphAssign.js:102` | **the water approach** |
| **the guild / the trade** | ✔ | — | — | — | B: `hasGuild` = the bare substring `'guild'` `priorityHelpers.js:57`; `hasMerchantGuild` `:58`, `hasMagesGuild` `:69`, `hasThievesGuild` `:73`, `hasCharterHall` `:51` (which also matches `hireling hall`). Civic class `craft` contains `guild` `wiringCensus.js:1316` | **the trade** / **the company** |
| **the magic house** (wizard · mage · alchemist · academy) | ✔ | — | — | ✔ ("a practitioner") | B: `hasMagicInst` `priorityHelpers.js:68`, `hasMagesGuild` `:69`, `hasWizardTower` `:70`, `hasAlchemist` `:71`; bucket `magicDef` `defenseInstitutionBuckets.js:105-108`; `defenseGenerator.js:167-173` | **a practitioner** (role) / **the house** (body) |
| **the criminal house** (thieves' guild · black market · smuggling · street gang) | ✔ | — | ✔ | — | B: `hasCriminalInst` `priorityHelpers.js:72`, `hasThievesGuild` `:73`, `hasBlackMarket` `:74`, `hasSmuggling` `:75`, `hasGangInfra` `:76`. P: the criminal faction's `power` and `category === 'criminal'` drive `computeCriminalCaptureState` `src/generators/factionDynamics.js:220-232` | **the underworld** — and only through a faction NAME where one is recorded |
| **`{institution}` (a workshop)** | ✔ | — | — | — | filled by `craftInstitutionFill` from `activeChains[].processingInstitutions[]` `generalStateProse.js:1259`; §0c declares it *"a named building or house on the settlement's roster"* `RECEIPT_POOLS_DOSSIER_STATE.md:172`, but the values measured are CATEGORY labels (`Merchant guilds (3-8)`, `Glassmakers`, `City walls and gates`) | **the workshop** / **the craft** |
| **`{steading}` · `{ruin}`** | ✔ | — | — | — | `steadingPoolKey` `generalStateProse.js:1442`; `ancientRuinPoolKey` `:1417`. Neither resolves a holder kind (census: all DS-GEN-8 rows `SOURCE-UNRESOLVED`) | the named place itself |

### 2.4 THE POWER FAMILY — every typed slot that names a power

| slot / field | what the engine records | the typed row (file:line) | this desk's blocks |
|---|---|---|---|
| `{faction}` / `{faction2}` | a NAMED political actor party to a record — `currentTensions[].factions[]`, `conflicts[].parties[0..1]` | declared `proper` `RECEIPT_POOLS_DOSSIER_STATE.md:171`, `{faction2}` `:198`; records `:5181`, `:5264` | DS-GEN-1, DS-GEN-2, DS-GEN-7, DS-REL-1, DS-HK-1 |
| `{govFaction}` | the governing faction NAMED ON THE COHERENCE NOTE | `RECEIPT_POOLS_DOSSIER_STATE.md:201`; producer `src/generators/narrativeGenerator.js:632` (`govFaction.faction` interpolated into the note string) | DS-GEN-7 only |
| `{governing}` | `powerStructure.governingName`, or the literal fallback `'the governing faction'` | `RECEIPT_POOLS_DOSSIER_STATE.md:202`; fill `src/domain/hookEscalation.js:511`; the field `src/generators/power/rulingStructure.js:787` | DS-HK-1 (`legitimacy_crisis`) |
| `{controller}` | ⚠ **NOT a power.** `chain.dependency.institution \|\| processingInstitutions[0] \|\| 'unattributed'` | declared *"the holder of a hook's controlling interest"* `RECEIPT_POOLS_DOSSIER_STATE.md:203`; fill `src/domain/hookEscalation.js:481,493`; **the value** `inferController` `src/domain/supplyChainState.js:482`, the literal at `:486`, the rule stated in the comment at `:476` | DS-HK-1 (`bread_riot`, `smuggling_rise`) |
| `powerStructure.government` / `.governingName` | the ruling structure's own name; `government` is the TYPE and equals `governingName` at birth | `rulingStructure.js:787` (`governingName`), `:792` (`government`) | read by no general-desk pool |
| `powerStructure.criminalCaptureState` | the settlement-wide capture ladder `none · adversarial · equilibrium · corrupted · capture` | computed `factionDynamics.js:220-232`, computed at `rulingStructure.js:755` and published on the returned object at `:797`, mapped to the **watch** holder kind `holderTable.js:211` | read by no general-desk pool |
| per-faction `captureState` | stamped onto the GOVERNING faction entry at birth where the ladder is `equilibrium` or worse | `rulingStructure.js:764-766`; read by `capturedRulingStructure` `holderTable.js:133-137` | read by no general-desk pool |
| corruption impairment (`impairments[].type === 'corruption'`, `covert` boolean) | a per-institution standing on a SECURITY body | `src/domain/corruption.js:630`, `:674-681` | read by no general-desk pool |
| brokerage PATRON (`genesis` / `captured`) | who an information house answers to | `brokeragePatronage.js:60,202,228,272-295` | read by no general-desk pool |

⭐ **THE `{controller}` FINDING.** The slot whose §0c-2 gloss makes it a POWER (*"the holder of a hook's controlling interest"*) is filled, in code, from a chain's **INSTITUTION** — a body name, and where none exists, the literal string `'unattributed'` (`supplyChainState.js:486`). A face writing `{controller}` as a power ("what {controller} has taken") is naming a body; a face writing it as a body ("the {controller}'s yard") may render `the unattributed's yard`. This is a wiring row for the register car, not a writer's choice.

### 2.5 THE PERSON — and the one place this desk names one

| slot / field | engine row | what the law's PERSON row says | what the desk actually does |
|---|---|---|---|
| `COLUMN_SOURCES.holderRole` | `institutionTable.js:129-138`, hardcoded `null`, `read: false` | no typed NPC→institution edge exists | agreed, and no desk pool asks for one |
| `{npc}` | declared `proper`, *"a cast person named on a member receipt; never minted, no fate resolved"* `RECEIPT_POOLS_DOSSIER_STATE.md:173`; filled by `localNpcFill` from `npcConnections[].primaryNPCName`, THIS TOWN'S END ONLY — `generalStateProse.js:1534-1541` | "PERSON — NEVER a referent" | **`DS-REL-1 :: cross-settlement NPC contacts` names a person by name, in a sentence whose whole subject is that person** (`RECEIPT_POOLS_DOSSIER_STATE.md:5560`: *"{npc} in {settlement} keeps a standing tie in {counterpart}"*). Its read `link.npcConnections` is **not-produced** per the card |

**Raised, not ruled.** The drafted law's "PERSON — NEVER a referent" and the corpus's `{npc}` slot are in direct tension on exactly one pool of this desk. The engine's own refusal is narrower than the law's: `institutionTable.js:134-136` refuses an NPC→INSTITUTION edge, and the licence card's standing refusal is *"a named character and that character's fate (product scope)"* — a refusal of FATE, not of NAMING. §7 item 4 puts the question to the chair.

---

## 3. THE READS OF THIS DESK, SORTED BY THE LAYER THEY RESOLVE

The census's `reads` column, grouped. "Grain" is the census's own `readsGrain`.

### 3.1 BODY READS (the read resolves an institution row or a bucket)

| read (census) | pools | what body it resolves | file:line |
|---|---|---|---|
| `readings.inst` | `DS-GEN-17 :: ADMINISTERED · GARRISONED · LETTERED · PROVISIONED · BARE` (5) | the whole boolean roster: court+prison / militaryInst\|navy\|watch / magicInst / granary\|hospital / else | key `generalStateProse.js:1178-1186`; booleans `priorityHelpers.js:45-76` |
| `readings` (institution list) | `DS-GEN-13 :: MARKET-OPEN · MARKET-NARROW · ENTREPOT · NO-MARKET` (4) | a market-class row, **ruin-filtered**: `liveInstitutions(state)` then `MARKET_NAME` | `generalStateProse.js:1138-1152`; filter `src/domain/institutions/institutionRoster.js:30` (`INACTIVE_STATUS`), `:53` (`liveInstitutions`) |
| `readings.activeChains` + `.exploitation` + `.isEntrepot` + `.primaryImports` | `DS-GEN-18 :: STALLED · HOME-FED · BOUGHT-IN · UNWORKED` (4) | a processing institution by category label | `generalStateProse.js:1259-1268`, `:1332` |
| `row` (a steading) · `ruin` | `DS-GEN-8` (4) | a satellite place and a fallen one | `generalStateProse.js:1417`, `:1442` |

### 3.2 AGGREGATE-OVER-BODIES READS (a SCORE or LABEL computed FROM bodies — **not** a body read)

| read | pools | which bodies feed it | file:line |
|---|---|---|---|
| `axis` + `score`, `axis === military` | `DS-GEN-3 :: scores.military` ×4 | walls +30 · garrison +28 · mercenary +14 · militia +10 · charter +10 · **watch +7** · arcane · divine · community base · terrain mult · the military purse | `defenseGenerator.js:159-191` |
| `axis === internal` | `DS-GEN-3 :: scores.internal` ×4 | court +20 · **watch +18** · prison +15 · garrison +15 · militia +8 · charter +5 · arcane · divine · community base · the order purse · minus crime | `defenseGenerator.js:231-254` |
| `axis === monster` | `DS-GEN-3 :: scores.monster` ×4 | charter +35 · garrison +20 · walls +20 · militia +12 · hospital +5 · traditions · the monster purse · `plagued −15` | `defenseGenerator.js:195-228` |
| `axis === economic` / `magical` | `DS-GEN-3` ×8 | storage months, `econHealthMult`; magic zeroed world-wide where magic is off | `defenseGenerator.js:257-307` |
| `text(label)` via `READINESS_POOL_OF` | `DS-GEN-3 :: readiness.label` ×6 | the AVERAGE of the five axes + tier bonus − threat penalty | `defenseGenerator.js:507-522` |
| `head` via `SAFETY_POOL_OF` | `DS-GEN-3 :: safetyLabel` ×3 | the safety producer's fifteen head words; field token `safetyProfile` maps to the **watch** kind, but the pool's grain is the key-function argument, so the census resolves nothing | `generalStateProse.js:240-249`, `:320`; field map `holderTable.js:212` |

⭐ **THE AGGREGATE RULE THIS DESK NEEDS.** Every one of those 29 pools reads a NUMBER OR A WORD COMPUTED OVER BODIES, never a body. The card's `may claim` for them is literally *"that `axis` (=== military) holds, as a STANDING fact of the record"* — a claim about a band, with no institution in it. A face naming a body on such a read asserts a roster composition the band does not carry: a `WEAK` military band is compatible with a garrison, and a `Fortress` readiness with no granary.

### 3.3 STANDING READS (capture · corruption · patronage · INTERESTED)

**The general desk has NONE.** Measured three ways:

| probe | result | file:line |
|---|---|---|
| census `covert` flag over the desk's 193 rows | **0** | flag set at `wiringCensus.js:1681`; the frozen covert list is `impairment.covert`, `mobilization.covert`, `blocs.covert` `:1256-1258` |
| any pool reading `criminalCaptureState`, `captureState`, `impairments`, `patron` | **none** — the census `reads` column carries no such path on any DS-GEN/REL/POP/HK row | `docs/content/wiring-census.json` |
| pools whose HOLDER is a state organ (so a captured ruling structure could make them INTERESTED) | **10** — 7 `treasury`, 3 `office` | §0.1 above; the rule at `holderTable.js:677-698` |

**What the ten STATE-ORGAN rows mean for visibility (brief part d).** For those ten pools, `sourceOfForTown` will return `standing: INTERESTED` instead of `LICENSED` on any town whose `powerStructure.criminalCaptureState` is not `none` or whose governing faction carries a `captureState` (`holderTable.js:723-781`, the organ gate at `:677`, the mark at `:707`, the INTERESTED verdict at `:770`). The ladder reads `none 495 · adversarial 194 · equilibrium 64 · corrupted 15` over the 768-town corpus (`holderTable.js:101-103`), so roughly a third of towns would flip those ten rows to INTERESTED. **No face of this desk states it, and no card prints it as a claim** — the card prints only the register-level warning `a STATE ORGAN (interested where the town is captured)`.

| standing | which face is licensed to name it, by the engine's own flag | file:line |
|---|---|---|
| a **covert** corruption impairment (`impairments[].covert === true`) | the DM face only — the engine's own comment: *"A covert mark … is the hidden channel: it must NOT read as a public scandal"* | `src/domain/corruption.js:670-672` (the comment), `:679-680` (the split) |
| a **revealed** corruption impairment (a `corruption` impairment not flagged covert) | both faces — the engine classes it as a public scandal and raises exposure visibility | `src/domain/corruption.js:654-658` (the doc block), `:679` |
| birth-time capture of the ruling structure (`criminalCaptureState`, faction `captureState`) | **no engine visibility flag exists.** `capturedRulingStructure` carries no audience field; the only audience machinery reaching this desk is the annex's own `· dm-only` angle marker | `holderTable.js:129-143`; audience rule `RECEIPT_POOLS_DOSSIER_STATE.md:455-462` |
| a brokerage PATRON | `projectPatronBindings({audience, exposed})` — the projector takes an audience argument, so the engine DOES type this one | `brokeragePatronage.js:319` |

⭐ **THE DESK'S DM FACE IS AN ANGLE MARKER, NOT AN ENGINE FLAG.** Nine variants of this desk carry `· dm-only` — `DS-POP-1` `:4931`, `:4932`, `:4933`; `DS-GEN-1` `:5212`; `DS-GEN-7` `:5448`, `:5449`, `:5454`, `:5457` — under §0e (`RECEIPT_POOLS_DOSSIER_STATE.md:455-462`), whose test is editorial (*"anything the town itself does not admit"*), not a field. The card reports it as `audience: player (no mark) · marks in this pool: dm-only`. So on this desk ADDENDUM 11's rule 4 ("visibility follows the power layer") has **no power layer to follow**: the DM/player split here is a writer's judgment about what a town would admit, with no `covert` field anywhere behind it.

### 3.4 ROLE READS

| read | pool | the role word the engine would license | file:line |
|---|---|---|---|
| `link.npcConnections` | `DS-REL-1 :: cross-settlement NPC contacts` | a NAMED person (`{npc}`), local end only — the one person-naming read on the desk; census status RESOLVED, card read `(not-produced)` | `generalStateProse.js:1502`, `:1534-1541` |
| `readings.inst` (indirectly) | `DS-GEN-17` | `Village reeve` · `Village elder` · `Household elder` · `Lord's steward` · `Priest (resident)` are institution ROWS the booleans match on; a role word here names a body | `institutionServices.js:14,20,26,1035,1194,1346`; `defenseGenerator.js:151` |
| `link` + `localRelationshipRole` | `DS-REL-1 :: patron` / `client` | the ROLE THIS TOWN HOLDS in an asymmetric tie, read from `localRelationshipRole`, **withheld rather than guessed where the role is absent** | `generalStateProse.js:1483-1494`; `overlord`/`vassal` are real values with NO pool `:1477-1481`; the canonical fold `src/domain/relationships/canonicalRelationship.js:54-57`, `:143`, `:304-307` |

---

## 4. THE ENGINE'S OWN OVERLAPS — ONE WORD, TWO OR MORE ROWS

Each row is a WIRING fact for the register car, not a writer's choice (ADDENDUM 11 rule 5).

| # | word | the rows it sits in | file:line |
|---|---|---|---|
| **O-1** | **professional city watch** | the **garrison** bucket AND the **watch** bucket | `defenseInstitutionBuckets.js:90` and `:96` |
| **O-2** | **watch** | (a) the `watch` BUCKET; (b) the `watch` HOLDER KIND, which is a STATE ORGAN; (c) a substring member of `hasMilitaryInst`; (d) `hasWatch`'s own three spellings; (e) `SECURITY_INSTITUTION_RE`; (f) the civic class `force`; (g) a tier-scaled DISPLAY spelling. **The muster kind does not contain the watch bucket** | (a) `defenseInstitutionBuckets.js:95`; (b) `holderTable.js:318`, `:115`; (c) `priorityHelpers.js:45`; (d) `:48`; (e) `corruption.js:630`; (f) `wiringCensus.js:1303`; (g) `safetyProfile.js:30-35`; the muster's roster `holderTable.js:284` |
| **O-3** | **Town council** | an **elders** roster row AND a **toll-bar** roster row | `holderTable.js:336` and `:308`; the institution `institutionServices.js:32` |
| **O-4** | **Village headman** | an **elders** roster row AND a **treasury** roster row | `holderTable.js:336` and `:277`; institution `institutionServices.js:20` |
| **O-5** | **Town hall / City hall / City administration** | a **treasury** roster row AND an **office** roster row; `Town hall` and `City hall` are ALSO members of `hasCourtSystem` | `holderTable.js:277` and `:361`; `priorityHelpers.js:55`; institutions `institutionServices.js:1623`, `:1629`, `:39` |
| **O-6** | **Weekly market** | the **market** kind's own service AND a **treasury** roster row | `holderTable.js:312`, `:315` and `:277` |
| **O-7** | **Major Port** | a **toll-bar** roster row; the same words set `hasNavy` and `hasPort` | `holderTable.js:308`; `priorityHelpers.js:61-62` |
| **O-8** | **Gates (if walled)** | a **toll-bar** roster row AND a `hasWalls` member | `holderTable.js:308`; `priorityHelpers.js:52` |
| **O-9** | **court** | the `court` HOLDER KIND (a state organ) · a `SECURITY_INSTITUTION_RE` member · the civic class `law` · a glyph `archive-hall` member — and `hasCourtSystem` matches three NON-court buildings | `holderTable.js:325`, `:115`; `corruption.js:630`; `wiringCensus.js:1311` (the civic class `law`); `glyphAssign.js:104`; `priorityHelpers.js:55` |
| **O-10** | **garrison** | the `garrison` BUCKET · the `muster` HOLDER KIND (via the field token) · a `SECURITY_INSTITUTION_RE` member · the civic class `force` · the glyph `barracks` | `defenseInstitutionBuckets.js:88`; `holderTable.js:189`; `corruption.js:630`; `wiringCensus.js:1303`; `glyphAssign.js:98` |
| **O-11** | **militia / muster** | the `militia` BUCKET; the `muster` HOLDER KIND, roster-backed by ONE institution only; the civic class `force` carries BOTH words | `defenseInstitutionBuckets.js:92`; `holderTable.js:280-287`; `wiringCensus.js:1303` |
| **O-12** | **patron** | a `relationshipType` value (DS-REL-1) · a brokerage POWER (`genesis`/`captured`) · a member of the census civic class **`temple`**, which is why `DS-REL-1 :: patron` classes as a temple pool and its card refuses *"another civic object of the class `temple`"* | `src/generators/neighbourGenerator.js` (`REL_DYNAMICS`); `brokeragePatronage.js:60`; `wiringCensus.js:1312` |
| **O-13** | **the seat / the hall** | the `{seat}` slot's generated name is tier-scaled and per-town; the civic class `hall` carries `hall · council · charter · seat · office · chamber · moot`, so the words collapse into one class for the instrument | `RECEIPT_POOLS_DOSSIER_STATE.md:194`, `:1816`; `wiringCensus.js:1314` |
| **O-14** | **elder** | an INSTITUTION row (three spellings), a HOLDER KIND name, and a generator role-string match in one | `institutionServices.js:14,20,26`; `holderTable.js:332`; `defenseGenerator.js:151` |

---

## 5. WHERE THE DESK'S PROSE USES A WORD AT THE WRONG LAYER FOR ITS READ

Findings for the chair. Quotes are ≤ 12 words. "Layer asked" = the layer the read resolves; "layer used" = the layer the noun belongs to. Nothing here is ruled.

### 5.1 A BODY NAMED ON AN AGGREGATE READ (the band does not carry the roster)

| # | block :: pool | quoted (≤12 words) | line | layer asked | layer used | the engine fact |
|---|---|---|---|---|---|---|
| F-1 | `DS-GEN-3 :: scores.military: STRONG` | *"The muster roll at {settlement} is long and current"* | `:5303` | AGGREGATE (score band) | HOLDER-ORGAN (the muster's own record) | the `muster` kind is roster-backed by **one** institution in the whole catalog, the Citizen militia; the note says a town with a garrison and no militia *"has men under arms and no roll of them"* — `holderTable.js:284-287` |
| F-2 | `DS-GEN-3 :: scores.military: WEAK` | *"The watch at {settlement} is a watch and not a garrison"* | `:5305` | AGGREGATE | BODY ×2 | a `WEAK` band is 20–39 (`defenseScoreBands.js:39`); a garrisoned town under the military purse floor reaches it (`defenseGenerator.js:161,189-191`), so the sentence asserts a roster the band cannot carry |
| F-3 | `DS-GEN-3 :: scores.military: WEAK` | *"counted in … what the hall issues"* | `:5305` | AGGREGATE | HOLDER-ORGAN, baked | "the hall" is the `{seat}` slot's business and §0c-2 forbids the baked noun (`RECEIPT_POOLS_DOSSIER_STATE.md:1816`); `DS-GEN-3`'s declared SLOTS are `{settlement}` alone (`:5297`) |
| F-4 | `DS-GEN-3 :: scores.military: CRITICAL` | *"{settlement} keeps no muster worth the name"* | `:5306` | AGGREGATE | HOLDER-ORGAN | negates a record the read does not reach; the community militia baseline is unpaid and EXEMPT from the purse (`defenseGenerator.js:186-191`), so a CRITICAL band does not entail no roll |
| F-5 | `DS-GEN-3 :: scores.internal: ADEQUATE` | *"The watch at {settlement} answers what is reported to it"* | `:5316` | AGGREGATE | BODY | the internal band sums court +20, watch +18, prison +15, garrison +15, militia +8, charter +5 and a community baseline (`defenseGenerator.js:231-237`); the band does not entail a watch |
| F-6 | `DS-GEN-3 :: scores.internal: WEAK` | *"more going on … than the watch troubles itself with"* | `:5317` | AGGREGATE | BODY | same; and `hasLawInfra` (`:244`) is satisfied by a court OR a prison OR a garrison with no watch at all |
| F-7 | `DS-GEN-3 :: readiness.label: Fortress` | *"Walls, garrison and stores at {settlement} are all of a piece"* | `:5349` | AGGREGATE OF AGGREGATES | BODY ×3 | readiness is the mean of five axes plus a tier bonus minus a threat penalty (`defenseGenerator.js:507-510`); it entails no wall, no garrison and no store |
| F-8 | `DS-GEN-3 :: readiness.label: Lightly Defended` | *"{settlement} has walls in the sense that there is a line"* | `:5352` | AGGREGATE | BODY | `Lightly Defended` is readiness 24–37 (`defenseGenerator.js:519`) and is reachable with `hasWalls` false |

### 5.2 A HOLDER'S RECORD NAMED WHERE NO HOLDER RESOLVES

| # | block :: pool | quoted | line | the holder it names | the card's source line |
|---|---|---|---|---|---|
| F-9 | `DS-GEN-1 :: crime_wave` | *"The watch's book at {settlement} is thick"* | `:5190` | the `watch` kind's `Crime reporting` record `holderTable.js:319` | `SOURCE-UNRESOLVED`; the block is WIRING-UNRESOLVED in the census |
| F-10 | `DS-GEN-1 :: crime_wave` | *"the watch takes the complaint"* | `:5189` | the watch BODY | same — the tension record carries no institution field at all (`RECEIPT_POOLS_DOSSIER_STATE.md:5181`) |
| F-11 | `DS-GEN-1 :: crime_wave` | *"Whatever holds {settlement}'s streets after dark, … not the watch"* | `:5192` | the watch BODY, negated | negating a body the read never resolved is the same fault in the mirror |
| F-12 | `DS-GEN-3 :: safetyLabel {Secure, Controlled, Quarantined}` | *"The watch's returns at {settlement} are short"* | `:5340` | the watch ORGAN's returns | the FIELD token `safetyProfile` does map to `watch` (`holderTable.js:212`), but the POOL's read grain is `head`, so the census resolves nothing and the card prints `SOURCE-UNRESOLVED`. **This is the one watch row on the desk a wiring fix could license** |
| F-13 | `DS-GEN-3 :: safetyLabel {Tense…}` | *"The watch at {settlement} is stretched across more than it can cover"* | `:5341` | the watch BODY + a capacity claim | same read grain; and a capacity claim is a second fact the card refuses |
| F-14 | `DS-GEN-3 :: safetyLabel {Dangerous, Desperate}` | *"the fraction is not chosen by the watch"* | `:5342` | the watch ORGAN + an unnamed chooser | asserts a relation between the watch and an unnamed power that no field computes (ADDENDUM 11 rule 3's fused-agent case, in the negative) |
| F-15 | `DS-POP-1 :: HERALD KIND: hungry_gap` | *"the burial rolls run longer than the harvest explains"* | `:4891` | the `parish` kind's `Register of the dead` `holderTable.js:298` | `SOURCE-UNRESOLVED`; the parish is resolved by no general-desk pool |
| F-16 | `DS-POP-1 :: QUANTITY: a hundred or so` | *"what the market can sell and what the levy can raise"* | `:4873` | the `market` and `treasury` kinds | `SOURCE-UNRESOLVED`; the migration read reaches neither |
| F-17 | `DS-POP-1 :: QUANTITY: nobody` | *"The departure rolls are empty"* | `:4853` | a departure register | no holder kind maps `migration` at all (`HOLDER_SOURCES` `holderTable.js:164-270` carries no such token) |
| F-18 | `DS-GEN-3 :: scores.internal: WEAK` | *"{settlement}'s complaint book has more entries opened than closed"* | `:5317` | the watch kind's `Crime reporting` record | `SOURCE-UNRESOLVED`; and a count, which the card refuses outright |

### 5.3 A BAKED SEAT — "the hall", "the seat", "the council" where `{seat}` is the typed slot

§0c-2 is explicit: *"prose that hard-codes **the council** is wrong on most settlements in the realm"* (`RECEIPT_POOLS_DOSSIER_STATE.md:1816`). None of the blocks below declares `{seat}`.

| # | block :: pool | quoted | line | declared SLOTS of that block |
|---|---|---|---|---|
| F-19 | `DS-GEN-1 :: infiltration_fear` | *"a habit of the gate, not a policy of the hall"* | `:5214` | `{settlement} {faction} {faction2}` (`:5182`) |
| F-20 | `DS-GEN-1 :: leadership_vacuum` | *"{settlement} has a hall and a seat in it"* | `:5219` | as above |
| F-21 | `DS-GEN-1 :: magical_controversy` | *"neither holds enough of the hall to end the argument"* | `:5226` | as above |
| F-22 | `DS-GEN-1 :: occupation_legacy` | *"{settlement} kept its own hall through the occupation"* | `:5231` | as above |
| F-23 | `DS-GEN-1 :: outside_debt` | *"what is argued in the hall now"* | `:5241` | as above |
| F-24 | `DS-GEN-1 :: succession_crisis` | *"who will hold the seat next"* · *"The seat is held firmly enough"* | `:5254`, `:5256` | as above |
| F-25 | `DS-GEN-7 :: powerful criminal faction…` | *"arrangements the hall would rather not itemise"* | `:5455` | `{settlement} {faction} {govFaction} {band}` (`:5442`) — **`{faction}` is NAMED BUT NEVER FILLED** per the card |
| F-26 | `DS-GEN-7 :: occupation against stated stability` | *"its own hall still governs"* | `:5469` | as above |
| F-27 | `DS-GEN-7 :: temple economy under a secular seat` | *"The seat in {settlement} decides"* · *"they meet in the market rather than in the hall"* | `:5473`, `:5474` | as above; `{govFaction}` IS the typed slot and IS filled in variants 1 and 4 |
| F-28 | `DS-GEN-8 :: steading row: provenance 'forced'` | *"{settlement}'s hall put it where it is"* | `:5528` | `{settlement} {steading} {ruin} {band} {timeband_*} {resource}` (`:5499`) — the steading record carries `provenance: 'forced'` and names **no decreeing body** |
| F-29 | `DS-REL-1 :: cross-settlement engagements` | *"both halls are working to keep those two facts apart"* | `:5567` | `{settlement} {counterpart} {npc} {faction} {band}` (`:5543`) — and it makes the NEIGHBOUR's hall an agent too |
| F-30 | `DS-HK-1 :: clock legitimacy_crisis` | *"Instructions from {settlement}'s hall are being complied with slowly"* | `:5781` | `{settlement} {controller} {governing} {faction} {faction2} {npc}` (`:5720`) — **`{governing}` is the typed slot for exactly this power and variants 1, 3 and 4 use it** |
| F-31 | `DS-GEN-10 :: print-native opener, power` | *"{settlement}'s hall, and the rooms that matter more"* | `:5712` | `{settlement}` (`:5685`) |

### 5.4 A PERSON, OR A FUSED AGENT, AS THE REFERENT

| # | block :: pool | quoted | line | the fault |
|---|---|---|---|---|
| F-32 | `DS-HK-1 :: clock faction_split` | *"the arrangement holds, and it holds on one person's word"* | `:5789` | the read is two factions' power delta and archetype difference (`hookEscalation.js:519-523`); an unnamed individual is made the load-bearing referent |
| F-33 | `DS-GEN-17 :: ADMINISTERED` | *"rules here have rooms, and the rooms have officers"* | `:6213` | the read is `hasCourtSystem && hasPrison` (`generalStateProse.js:1180`); "officers" is a person-class noun on a composition read, and `COLUMN_SOURCES.holderRole` is a measured null (`institutionTable.js:129-138`) |
| F-34 | `DS-GEN-14 :: FOUNDED-YOUNG` | *"the founders' argument has not yet been improved on"* | `:5950` | the read is `history.founding` presence + age band; `{founder}` is a lowercase PHRASE, not a name, and 26 of 26 producer values fail `proper` (`RECEIPT_POOLS_DOSSIER_STATE.md:207` (declared `phrase`), `:229` (`fillShapeViolation`'s measurement)); `DS-GEN-14` declares `{settlement} {timeband_age}` only (`:5943`) |
| F-35 | `DS-REL-1 :: client` | *"you will be given a name in {counterpart} more often"* | `:5553` | the read is `relationshipType`/`localRelationshipRole`; the pool carries no npc read (that is the separate `cross-settlement NPC contacts` pool) |
| F-36 | `DS-REL-1 :: cross-settlement engagements` | *"it belongs to a few people on each side"* | `:5566` | the read is `row.type === 'faction_engagement'`; persons are asserted where the record names factions |
| F-37 | `DS-GEN-1 :: magical_controversy` | *"both sides have begun naming individuals rather than practices"* | `:5227` | a tension record with no person field asserts that persons are being named |

### 5.5 A POWER WORD ON A READ WITH NO POWER

| # | block :: pool | quoted | line | the fault |
|---|---|---|---|---|
| F-38 | `DS-GEN-11 :: viable: false` | *"a careful eye goes looking for a patron"* | `:5819` | the read is `readings.viable`, holder `treasury`; PATRON is a typed brokerage power (`brokeragePatronage.js:60`) with no read here. (Variant 4 at `:5821` handles the same thought lawfully: it says the question is open and declines to name.) |
| F-39 | `DS-GEN-17 :: GARRISONED` | *"{settlement} pays for its own defense in wages, not only in stone"* | `:6218` | a PAY claim on a composition read. The antecedent is `hasMilitaryInst \|\| hasNavy \|\| hasWatch` (`generalStateProse.js:1181`), and `hasMilitaryInst`'s substring list contains **`walls`** and **`citadel`** (`priorityHelpers.js:45`) — so a town whose only military-class row is its wall resolves GARRISONED and the sentence says it pays wages. The block's own STATE-KEY gloss (`:6205`, *"a force the town PAYS for rather than merely a wall it built"*) and the leaf's own comment (`generalStateProse.js:1157`) carry the same false gloss |
| F-40 | `DS-GEN-7 :: criminal faction in a transit hub` | *"{faction} holds {band} of the power in {settlement}"* | `:5448` | the layer is right (a typed faction name on a power read) but the card reports **`{band}` and `{faction}` NAMED BUT NEVER FILLED** at this block's call sites — the slot the power travels through is not wired |
| F-41 | `DS-HK-1 :: clock smuggling_rise` | *"{settlement}'s trade is strained and its watch is not distracted"* | `:5777` | the clock's trigger read is `chain.status` on a trade chain (`hookEscalation.js:484-494`); the watch is not in that read at any layer |
| F-42 | `DS-HK-1 :: clock bread_riot` | *"{settlement}'s food chain is strained and its granary is not"* | `:5771` | same shape: `hasGranary` (`priorityHelpers.js:63`) is a separate boolean the clock trigger does not read |
| F-43 | `DS-GEN-17 :: PROVISIONED` | *"{settlement} keeps stores against the bad season and care for the bad year"* | `:6225` | the antecedent is `hasGranary \|\| hasHospital` — a DISJUNCTION (`generalStateProse.js:1183`) — and the sentence asserts both |

### 5.6 ENGINE STRINGS THAT BAKE A LAYER (not this desk's prose, but rendered on its page)

| # | string | line | the fault |
|---|---|---|---|
| F-44 | *"The council sends the watch to guard warehouses."* | `src/domain/hookEscalation.js:396` | a `bread_riot` stage template bakes BOTH a council (the seat, which is `{seat}`-typed and tier-scaled) and a watch (conditional on `hasWatch`), on every town the clock fires for |
| F-45 | *"Watch makes a high-profile raid; smugglers shift routes."* | `hookEscalation.js:407` | a `smuggling_rise` stage bakes the watch |
| F-46 | *"Tax collection slows; watch loses authority."* | `hookEscalation.js:419` | a `legitimacy_crisis` stage bakes the watch as an authority-holder |
| F-47 | *"A successor positions themselves."* | `hookEscalation.js:420` | a PERSON as the actor of an engine-rendered stage |
| F-48 | *"Public assembly forces a confrontation."* | `hookEscalation.js:421` | bakes an assembly (which is a `census` roster row, `holderTable.js:294`) |

`DS-HK-1`'s own rule R-DST-W4-h (`RECEIPT_POOLS_DOSSIER_STATE.md:5723`) forbids a framing variant from paraphrasing a stage — so these five are the ENGINE saying, beside the desk's lawful framing sentence, exactly what the desk is forbidden to say. A register-car row, not a writer's.

---

## 6. SUMMARY — THE DESK'S ANSWER TO THE OWNER'S QUESTION

1. **On this desk the layer is decided by the read almost everywhere, and the read almost everywhere is an AGGREGATE.** 29 of the desk's 119 RESOLVED pools read a SCORE, a BAND or a LABEL computed over bodies (`DS-GEN-3`'s 20 score rows + 6 readiness + 3 safety). ⚠ AMENDED: `DS-GEN-3` carries 42 rows in all, and **40 of them are band/label reads** — the 29 counted here plus 5 `prosperity` and 6 `foodSecurity` rows, which are aggregates over the ECONOMY rather than over bodies and so fall outside this section's frame but under the same "no noun is licensed" consequence. For those, no noun of any layer is licensed: the card's `may claim` names a band and nothing else.
2. **The BODY layer is reachable on exactly 13 pools** — `DS-GEN-17` (5), `DS-GEN-13` (4), `DS-GEN-18` (4) — and only `DS-GEN-13` applies the ruin filter (`generalStateProse.js:1139`), so "keeps a market" means a STANDING market there and "is GARRISONED" does not mean a standing anything.
3. **The HOLDER-ORGAN layer is reachable on 31 pools, across 7 of the 12 kinds, and NEVER on the order organs.** No general-desk read resolves the watch, the muster, the court, the parish, the census or the tradition.
4. **The POWER layer is reachable only through three typed name slots** — `{faction}`/`{faction2}`, `{govFaction}`, `{governing}` — plus `{controller}`, which is mis-typed (it is filled from a body, §2.4). **No general-desk pool reads a capture state, a corruption impairment or a patron.** Ten pools carry the STATE-ORGAN flag, which is a register warning about INTERESTED, not a claim a face may state.
5. **The ROLE layer and the BODY layer are the same rows here.** The elder, the reeve, the headman, the steward and the priest are institution rows in the shipped services catalog, matched by name. A face using one of those words is using a body word, not naming a person.
6. **PERSON is refused everywhere except one pool** — `DS-REL-1 :: cross-settlement NPC contacts`, whose `{npc}` slot names a real recorded person by name, local end only. The engine's refusal (`institutionTable.js:134-136`) is of an NPC→INSTITUTION EDGE, and the card's refusal is of a FATE; neither is a refusal to name.

---

## 7. RAISED FOR THE CHAIR (observations only; nothing decided here)

1. **The card has no referent column.** Its only referent line is `· a STATE ORGAN (interested where the town is captured)` (`scripts/lib/prose-licence-card.mjs:333`). ADDENDUM 11 rule 2 asks the card to print BODY / ORGAN-UNDER-POWER / ROLE per read; on this desk that column would be `AGGREGATE` on 29 pools, and the law as drafted has no name for that layer. **A fourth value may be needed: the read that resolves a band computed OVER bodies and names none.**
2. **`{controller}` is a power-named slot filled from a body** (§2.4). Either the gloss or the fill is wrong, and a face cannot be judged until the chair says which.
3. **The desk's DM face is an angle marker, not an engine flag** (§3.3). Nine variants carry `· dm-only` under an editorial test (`RECEIPT_POOLS_DOSSIER_STATE.md:455-462`), and the desk's census `covert` count is zero. Rule 4 ("visibility follows the power layer") therefore binds nothing on this desk as wired today.
4. **The `{npc}` tension** (§2.5). The drafted law says PERSON is never a referent; `DS-REL-1 :: cross-settlement NPC contacts` makes a named person the subject of its sentence, from a real record, with the far end deliberately withheld (`generalStateProse.js:1526-1531`). If the law stands as written, that pool's three variants are refused wholesale and a RESOLVED pool goes dark; if the law is narrowed to FATE (which is what the engine and the card actually refuse), the pool stands. This is the one place the referent law changes what ships.
5. **Two of the desk's own glosses are false about the code they describe, in the same direction** — `DS-GEN-17`'s "a force the town PAYS for" (annex `:6205`, leaf comment `generalStateProse.js:1157`) against `hasMilitaryInst`'s `walls`/`citadel` members (`priorityHelpers.js:45`). A writer told the gloss writes F-39; a writer told the code does not. **A gloss that contradicts its own key function is a licence the writer cannot see is void.**
6. ⛔ **CORRECTED BY §8 — the watch is NOT the desk's largest exposure.** Re-measured it is 13 occurrences, against 26 for the record words (*the rolls* / *the roll*) and 22 for the baked seat (*hall* + *seat*); §0.1 carries the corrected table and §8 the record-word rows. The watch row below still stands on its own terms, and exactly one of those rows (F-12, the safety-label family) sits on a read whose FIELD TOKEN already maps to the watch kind (`holderTable.js:212`). **A read-grain wiring fix on `SAFETY_POOL_OF` — keying the pool on `safetyProfile.safetyLabel` rather than on the key-function argument `head` — would license three of the twenty and leave seventeen unlicensed.** That is the cheapest single wiring row this survey found.
7. **The engine's own hook stages bake three layers on the same page the desk frames** (F-44…F-48). `DS-HK-1` is forbidden to paraphrase them; nothing forbids them from contradicting it.
8. **A third and fourth birth purse exist** (§1.1 row 1). The chair's ADDENDUM 12 amendment reasons over two; `monsterUpkeepMult` (floor 0.7, `defenseGenerator.js:223`) and `econHealthMult` (floor 0.45, `:289`) are the others, and all four are published together on `economicGates` (`:467-471`). The ONE-GATE-MANY-THINGS counterpart for this desk is therefore stated over four gates, not two.

---

## 8. THE RECORD WORDS — THE DESK'S LARGEST REFERENT EXPOSURE, MEASURED (new; supersedes §0.1's earlier claim that the watch was the largest)

A record word (*the rolls*, *the books*, *the roll*, *on the books*, *the returns*, *the complaint book*, *the departure rolls*, *the burial rolls*) is a **HOLDER-ORGAN** noun: it names the RECORD and, through it, the organ that keeps it. Under the drafted law's rule 1 a record word is licensable only on a read whose holder resolves, and under `sourceOfRow` a citation is licensed only at `standing: LICENSED` — an `OFFICE` standing refuses one outright (`src/domain/prose/holderTable.js:563-570`; the card prints *"NO citation is licensed: a face naming a record holder here is refused by arm A13"*, `scripts/lib/prose-licence-card.mjs:333-336`).

### 8.1 THE ENGINE HAS NO HOLDER FOR THE POPULATION AT ALL

| probe | result | file:line |
|---|---|---|
| is there a `population`, `populationHistory`, `migration`, `births` or `deaths` token anywhere in `HOLDER_SOURCES`? | **NO — zero matches over the whole table** | `src/domain/prose/holderTable.js:164-270` |
| the kind whose record IS the roll | `census` — services *Citizen registration · Noble registration*, `rosterBacked: true`, `dutyNamed: 2` | `holderTable.js:290-294` |
| which institutions back it | **exactly two**: `Democratic assembly` and `Royal seat` | cite at `holderTable.js:294`; rows at `src/data/institutionServices.js:891`, `:1231` |
| every `DS-POP-1` and `DS-POP-2` row | **WIRING-UNRESOLVED, `reads: []`**, `holderReason: "no mapping row resolves any field this pool reads"` | `docs/content/wiring-census.json` (24 rows) |
| the five `DS-POP-3` rows | **RESOLVED**, but `source.kind` is the empty string and `fields` maps `readings.populationTrend.band` / `.window` to `""` — the tokens exist and resolve no kind | `docs/content/wiring-census.json` |

⭐ So the population blocks say *the rolls* on reads that resolve **no holder**, while the one kind whose record is the roll is reachable by no pool of this desk and is roster-backed by two institutions a town below city tier does not have.

### 8.2 EVERY RECORD-WORD ROW OF THE DESK (35 rows; quotes ≤ 12 words)

| # | block | quoted | line | the record named | what the read resolves |
|---|---|---|---|---|---|
| F-49 | `DS-POP-1` | *"The departure rolls are empty"* | `:4853` | a departure register | no token; pool WIRING-UNRESOLVED, `reads: []` |
| F-50 | `DS-POP-1` | *"the burial rolls run longer than the harvest explains"* | `:4891` | `parish` — *Register of the dead* `holderTable.js:298` | same |
| F-51 | `DS-POP-1` | *"the rolls carry it"* | `:4893` | `census` | same |
| F-52 | `DS-POP-1` | *"The rolls run in the town's favour"* | `:4903` | `census` | same |
| F-53 | `DS-POP-1` | *"The rolls balance"* | `:4906` | `census` | same |
| F-54 | `DS-POP-1` | *"The rolls are short"* | `:4913` | `census` | same |
| F-55 | `DS-POP-1` | *"what the rolls say have come apart"* (`· dm-only`) | `:4931` | `census` | same |
| F-56 | `DS-POP-2` | *"it is not what the older rolls describe"* | `:4968` | `census`, historical | same |
| F-57 | `DS-GEN-1` | *"The watch's book at {settlement} is thick"* | `:5190` | `watch` — *Crime reporting* `holderTable.js:319` | `SOURCE-UNRESOLVED` |
| F-58 | `DS-GEN-1` | *"the rolls show the rest of the town living on the remainder"* | `:5198` | `treasury` | `SOURCE-UNRESOLVED` |
| F-59 | `DS-GEN-1` | *"{settlement}'s rolls still carry the shape the occupation put on them"* | `:5233` | `treasury` (taxed quarters, exempt trades) | `SOURCE-UNRESOLVED` |
| F-60 | `DS-GEN-3` | *"The muster roll at {settlement} is long and current"* | `:5303` | `muster` | AGGREGATE (`axis`+`score`) — = F-1 |
| F-61 | `DS-GEN-3` | *"{settlement}'s complaint book has more entries opened than closed"* | `:5317` | `watch` | AGGREGATE — = F-18 |
| F-62 | `DS-GEN-3` | *"the rolls are being kept for reasons other than trade"* | `:5362` | `census` / `parish` | `text(label)` via `FOOD_POOL_OF`; `SOURCE-UNRESOLVED` |
| F-63 | `DS-GEN-7` | *"the rolls are accurate and incomplete"* (`· dm-only`) | `:5457` | `treasury` | `SOURCE-UNRESOLVED` (a `note.type\|note.tab` key) |
| F-64 | `DS-GEN-7` | *"the trade income on its books"* | `:5460` | `treasury` | same |
| F-65 | `DS-GEN-7` | *"{settlement}'s books show a hard collapse"* | `:5479` | `treasury` | same |
| F-66 | `DS-GEN-8` | *"The rolls close on a departure and not on a disaster"* | `:5506` | `census` | `SOURCE-UNRESOLVED` |
| F-67 | `DS-GEN-8` | *"{settlement} is off the rolls"* | `:5512` | `census` | same |
| F-68 | `DS-GEN-8` | *"{ruin} … appears on no roll of {settlement}'s"* | `:5520` | `census` / `toll-bar`, negated | same |
| F-69 | `DS-REL-2` | *"{band} of the ties on {settlement}'s roll"* | `:5588` | a relationship register — **no holder kind maps one** | pool RESOLVED, `source.kind` empty, `SOURCE-UNRESOLVED`; the block's one resolved row is `office` at standing **OFFICE** (no citation licensed at all) |
| F-70 | `DS-REL-2` | *"Nothing on {settlement}'s relationship roll"* | `:5594` | same, negated | same |
| F-71 | `DS-GEN-9` | *"still on {settlement}'s books"* | `:5624` | `office` / `treasury` | the EVENTS pools are **WIRING-UNRESOLVED**, not the block's five `elders` recency pools |
| F-72 | `DS-GEN-9` | *"{settlement}'s rolls changed by {band} at {event}"* | `:5653` | `census` | same |
| F-73 | `DS-GEN-9` | *"{settlement}'s rolls carry names that were struck and restored"* | `:5660` | `census` — a NAME-level claim | same |
| F-74 | `DS-GEN-10` | *"{settlement}'s year, as the books have it"* | `:5709` | `treasury` | `SOURCE-UNRESOLVED` (a PDF slice key) |
| F-75 | `DS-GEN-12` | *"the books are written at the working end"* | `:5883` | `treasury` / `office` | holder **`road`**, standing LICENSED — a licensed holder, and the sentence cites a DIFFERENT one |
| F-76 | `DS-POP-3` | *"the roll and the approaches agree with one another"* | `:6048` | `census` | `readings.populationTrend.band` → kind `""` |
| F-77 | `DS-POP-3` | *"more people here than the older rolls describe"* | `:6049` | `census` | same |
| F-78 | `DS-POP-3` | *"the roll rises"* | `:6055` | `census` | same |
| F-79 | `DS-POP-3` | *"{settlement}'s roll holds where it is"* | `:6058` | `census` | same |
| F-80 | `DS-POP-3` | *"the roll falls beside them"* | `:6062` | `census` | same |
| F-81 | `DS-GEN-16` | *"{settlement}'s books record no disaster worth the word"* | `:6132` | `office` — negated | `SOURCE-UNRESOLVED` |
| F-82 | `DS-GEN-18` | *"the building stands, the skill remains, and the books wait"* | `:6248` | `treasury` / `office` | holder **`market`**, standing LICENSED — again a licensed holder and a different one cited |
| F-83 | `DS-GEN-3` | *"The watch's returns at {settlement} are short"* | `:5340` | `watch` | = F-12 |

**Two of the 35 are the interesting ones.** F-75 (`DS-GEN-12`) and F-82 (`DS-GEN-18`) sit on pools whose holder **does** resolve at `standing: LICENSED` — `road` and `market` — and both cite *the books*, which is the `office`/`treasury` record, not theirs. They are not "a record word with no record"; they are **a record word naming the WRONG organ on a read that licensed a different one**. That is rule 2's exact failure mode (noun layer right, noun REFERENT wrong) and the only instance of it this desk carries.

### 8.3 THE QUESTION §8 PUTS TO THE CHAIR (not decided here)

Is *the rolls* on a `populationTrend` read (a) an unlicensed HOLDER-ORGAN citation, refused by rule 1 exactly as *the watch's book* is, or (b) a licensed METONYM for the read itself — the population record as a figure of speech for the population, naming no keeper? The engine gives an argument for each:

- **for (a):** `sourceOfRow` refuses a citation at every standing but LICENSED (`holderTable.js:563-570`), and the card prints the refusal in words. Nothing distinguishes *"the rolls are short"* from *"the watch's book is thick"* at the card's grain — both name a record on a pool the card marks SOURCE-UNRESOLVED.
- **for (b):** the `census` kind's own `dutyNamed: 2` (`holderTable.js:293`) and two-institution roster mean that on most towns **there is no keeper to mis-attribute to**, so the word may be doing metonymic and not attributive work. Compare the entailment law's rule 1: a watch keeps watch is definitional; *a town has a population count* is arguably the same class of fact.

⚠ Whichever way the chair rules, **the ruling settles 26 of the desk's rows at once** and it is the single largest rewrite lever the referent law has on this desk. It cannot be left to the drafters: ruled (a), most of DS-POP-1/-2/-3 and four DS-GEN-9 rows lose their `[ledger]` sentence's central noun; ruled (b), the desk keeps them and *the watch's book* still falls, because the watch HAS a keeper (`hasWatch`, a bucket, a kind and a `SECURITY_INSTITUTION_RE` member) and the attribution is therefore live.

---

## 9. THE ENGINE'S OWN REFERENT LAW, ALREADY IN CODE — A PRECEDENT FOR ADDENDUM 11

The strongest support for the drafted law is that `holderTable.js` **already refuses an attribution on exactly rule 3's ground**, in a comment written before the law was drafted:

> ⚠ `Record keeping` IS DELIBERATELY IN NO LIST. It is carried by the Church/Temple, by the Lord's steward and by the Parish churches alike, so it names the parish and the office in one breath; a kind claiming it would claim a holder it cannot tell apart. — `src/domain/prose/holderTable.js:257-259`

That is ADDENDUM 11 rule 3 (SAME WORD, SAME REFERENT; a fused agent asserts a relation no field computes) stated by the engine about its own service vocabulary. **The chair may cite it as engine precedent rather than as a new invention** — which is the difference between a mapping and a rule the owner has to be asked for. It also settles the shape of the §8 question: the engine's instinct where one record word reaches two organs is to **refuse the kind, not to pick one**.

### 9.1 `dutyNamed` — WHICH KINDS THIS ENGINE CAN SAY ARE *FOR* SOMETHING

`dutyNamed` counts the duties the kind's own service vocabulary names (`holderTable.js:249`, the `DUTY_SERVICE_KINDS` note). A face saying what an organ IS FOR is making a duty claim, so a kind at `dutyNamed: 0` has no duty on the record to state.

| kind | `dutyNamed` | `rosterBacked` | file:line | consequence for a face |
|---|---|---|---|---|
| `treasury` | 4 | true | `holderTable.js:273-276` | may state what it is for |
| `parish` | 3 | true | `:297-300` | may |
| `toll-bar` | 3 | true | `:304-307` | may |
| `office` | 3 | true | `:357-360` | may — but **no citation** (`standing: OFFICE`) |
| `census` | 2 | true | `:290-293` | may — unreachable on this desk |
| `road` | 2 | true | `:350-353` | may; LICENSED on `DS-GEN-12` ×5 |
| `muster` | 1 | true | `:280-283` | one duty only (*Muster training*) |
| `elders` | 1 | true | `:332-335` | one (*Record of custom*); LICENSED on `DS-GEN-9` ×5 |
| **`watch`** | **0** | true | `:318-321` | ⭐ **no duty on the record.** A face saying what the watch is FOR states an unrecorded duty even where the body resolves |
| **`court`** | **0** | true | `:325-328` | ⭐ same |
| **`market`** | **0** | true | `:311-314` | ⭐ same; LICENSED on `DS-GEN-18` ×5, so this is live on this desk |
| `tradition` | 0 | **false** | `:339-342` | nothing anywhere |

⭐ **THE WATCH AT `dutyNamed: 0` IS A SECOND, INDEPENDENT REASON THE WATCH IS UNSAFE ON THIS DESK** — separate from the read-layer argument. Even on a town where `hasWatch` is true and the read is a body read, the table records **zero named duties** for the watch kind, so *"the watch answers what is reported to it"* (F-5) and *"the watch troubles itself with"* (F-6) state a duty the engine does not carry. The always-safe move is the BODY fact (presence) and never the purpose.

---

## 10. THE PACKET'S OWN CORRECTIONS, AND ONE LANE HAZARD

### 10.1 THIRTY-FOUR CITES RE-DERIVED AND CORRECTED IN THIS PASS

Every cite in §§0-7 was re-derived by `grep -n` (not by counting `sed` output, which is what produced the drift). Corrected: `prose-wave-gate.mjs:295`→`:294` (+ the `general` row at `:297`); `corruption.js:662`→`:663`; the `court` field tokens `216/220/221/223`→`215/218/219/221`; the `toll-bar` fields `185/186/187`→`183/184/185`; **the `road` fields `265/266`→`233/234`** (the worst of them); `piety`/`unaffiliated` `227/228`→`226/227`; the `{seat}` register row `:196`→`:194`; `rulingStructure.js` `786/791`→`787/792` and `criminalCaptureState` published at `:797` (not `:755`, which is where it is computed); `supplyChainState.js:487`→`:486`; `institutionRoster.js:38`→`:53`; `generalStateProse.js:1155`→`:1157`; `holderTable.js:682`→`:683`, `:705-706`→`:707`, `:695`→`:707`/`:770`, `:564-567`→`:563-570`; `defenseScoreBands.js:37-38`→`:39`; `wiringCensus.js:1314`→`:1311` for the `law` class; the five `hookEscalation.js` stage strings `395/406/417/418/419`→`396/407/419/420/421`; the clock triggers `487-497`→`484-494` and `521-524`→`519-523`; `RECEIPT_POOLS_DOSSIER_STATE.md:236-241`→`:207`+`:229`.

**Everything else verified EXACT**, including every one of the 30 shipped annex quotes of §5, all 21 `priorityHelpers.js` booleans, all 12 `holderTable.js` kind rows, all 17 `institutionServices.js` rows, all 6 `glyphAssign.js` classes, the 9 `defenseGenerator.js` purse and score lines, and every census figure (193 rows · 119 RESOLVED · 74 WIRING-UNRESOLVED · covert 0 · 23 blocks · the holder-kind distribution), re-measured from `docs/content/wiring-census.json` by an independent script.

### 10.2 ⚠ A LANE HAZARD WORTH THE INDEX

**`grep` returns NOTHING on `scripts/prose-wave-gate.mjs` — silently.** BSD `grep` classifies the file as binary (`file` reports *"a /usr/bin/env node script executable (binary data)"*) and, with `-n`, prints no match and no warning rather than the usual *"Binary file … matches"*. A lane that greps that file for `--section`, `SECTION_LEAVES` or a block prefix concludes the handling does not exist. **`grep -a` is required on it.** This packet's earlier draft took the empty result at face value and mis-cited the desk key to a line that does exist but says something else. The same class will bite any lane reading that gate.
