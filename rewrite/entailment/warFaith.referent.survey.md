# REFERENT SURVEY — THE `warFaith` DESK (DS-WAR-1…5 · DS-FTH-1…4)

**Question:** ADDENDUM 11, THE REFERENT LAW — for every institution-class noun this desk can
render, which LAYER the engine gives it (BODY / HOLDER-ORGAN / POWER / ROLE), which reads
resolve to each layer, the engine's own overlaps, the typed slot that names the power, and the
always-safe class word. **This is a research packet. It decides nothing; the chair does.**

**Dock:** `laneRW-DEFW` at `f2da5a3ee` (READ-ONLY; nothing modified, staged or committed; no
vitest, no npm, no build — only `scripts/prose-licence-card.mjs`, which its own docblock
`scripts/prose-licence-card.mjs:9-11` says writes nothing). Every `file:line` below was
re-derived in this tree, not copied from the addendum.

**Sister packet:** `rewrite/entailment/warFaith.survey.md` (the ENTAILMENT question — what a
word MEANS). Its noun inventory is used here; its entailment rows are **not** repeated.

---

## §0 THE DESK, DERIVED FROM THE GATE AND NOT GUESSED

The brief forbids a hand-written prefix list, and the gate forbids it in its own words: the
first cut of the section table "put two prefixes on the wrong desk and DS-POP was on none, so
29 of the 708 pools were reachable from no section at all" (`scripts/prose-wave-gate.mjs:278-292`).
The cure is that **a leaf IS a section** — `SECTION_LEAVES` (`scripts/prose-wave-gate.mjs:294-301`)
maps `warFaith` → `DOSSIER_STATE_PROSE_WAR_FAITH` (`:300`), and `sectionsCoverEveryPool`
(`:304`) asserts the partition rather than trusting it. The desk is therefore enumerated off
the leaf `src/data/dossierStateProse/warFaith.generated.js`.

| Block | Pools | Variants | `dm-only` variants | RESOLVED | WIRING-UNRESOLVED | Annex header | Desk routing |
|---|---|---|---|---|---|---|---|
| `DS-WAR-1` the standing | 21 | 66 | 5 | 11 | 10 | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:3363` | routed, `src/domain/display/stateProse/warFaithStateProse.js:843-848` |
| `DS-WAR-2` the treaties | 28 | 83 | 3 | 4 | 24 | `:3502` | routed, `warFaithStateProse.js:851-856` |
| `DS-WAR-3` dormant note | 1 | 5 | 0 | 1 | 0 | `:3668` | routed, `warFaithStateProse.js:859-861` |
| `DS-WAR-4` PDF aggression slice | 5 | 15 | 0 | 0 | 5 | `:3694` | **DARK**, `warFaithStateProse.js:72-82` |
| `DS-WAR-5` war-adjacent ladder | 31 | 93 | 3 | 0 | 31 | `:3741` | **DARK**, `warFaithStateProse.js:83-93` |
| `DS-FTH-1` faith panel | 21 | 63 | 0 | 8 | 13 | `:4501` | routed, `warFaithStateProse.js:864-878` |
| `DS-FTH-2` faith teaser | 2 | 8 | 0 | 1 | 1 | `:4634` | routed, `warFaithStateProse.js:881` |
| `DS-FTH-3` religion state | 25 | 75 | 3 | 2 | 23 | `:4670` | routed, `warFaithStateProse.js:884-896` |
| `DS-FTH-4` why the temple holds | 4 | 10 | 0 | 0 | 4 | `:6266` | **DARK**, `warFaithStateProse.js:95-104` |
| **desk** | **138** | **418** | **14** | **27** | **111** | | |

(pools/variants/`dm-only` counted off the leaf itself; RESOLVED / UNRESOLVED off
`docs/content/wiring-census.json` rows whose `block` matches `^DS-(WAR|FTH)-`.)

### §0.1 ⛔ THE SOURCE-HOLDER STANDING OVER THE 138 ROWS — the fact that governs every row below

Measured off `docs/content/wiring-census.json` (`row.source.kind` / `.standing`):

| `source.kind` | rows | which | `stateOrgan` flag |
|---|---|---|---|
| `muster` | 7 | DS-WAR-1 `statusLabel: On campaign` · `Occupied` · `At war` · `mobilization: climbing…distant` · `climbing, close to ready` · `occupierHoldings.stretchedThin` · `.strengthened` | **no** (the muster is not a state organ, `src/domain/prose/holderTable.js:115`) |
| `court` | 4 | DS-WAR-2 `fraying set on a term with time still to run` · `document-level: …runs out within the year` · `…the LOSER side` · `…the VICTOR side` | **yes** — the census emits `stateOrgan: true` on these four (`holderTable.js:560`) |
| `parish` | 2 | DS-FTH-1 `SINK: unaffiliated present, arc falling` · `arc rising` | **no** |
| *(none)* SOURCE-UNRESOLVED | 125 | everything else, including all 27 DS-WAR-5, all 5 DS-WAR-4, all 4 DS-FTH-4 | — |

⛔ **THREE CONSEQUENCES THE CHAIR SHOULD READ TOGETHER.**

1. **No pool of this desk reads `settlement.institutions[]`.** The desk's reads are `war.*`,
   `term`, `doc`, `faith.*`, `hasPatron`, `anyTreaty`, `warBeat`, `covert` — and not one
   institution field (`warFaithStateProse.js:778-898`, every key function at `:197-673`). So the
   desk has **no BODY read of its own at all.** Every body word its prose uses today (the walls,
   the gate, the garrison, the soldiers, the hall, the market, the granary, the shrine, the
   benches, the building) is a **baked noun with no row behind it.**
2. **The only holder this desk's war reads resolve to is the MUSTER, and the muster's whole
   roster is one institution.** `HOLDER_RECORDS` gives the `muster` kind exactly one
   record-keeping service, `Muster training`, and one roster row, the `Citizen militia`
   (`holderTable.js:279-288`), whose own note reads *"ONE institution in the whole shipped
   roster keeps a muster: the Citizen militia. A town with a Garrison and no militia has men
   under arms and no roll of them."* And that service is optional: `"Muster training": { on:
   false, p: 0.5 }` (`src/data/institutionServices.js:836-837`). `Garrison`'s own service row
   (`institutionServices.js:185-190`) keeps **no record at all**.
3. **The state-organ hook on this desk is the COURT, and it is on the treaty block only.**
   `STATE_ORGAN_KINDS = office · court · treasury · watch` (`holderTable.js:115`); of those the
   desk reaches only `court`, through `termLines` / `fraying` / `yearsRemaining`
   (`holderTable.js:221-223`). The WATCH kind — the order organ that keeps
   `criminalCaptureState`, `blackMarketCapture`, `safetyProfile` (`holderTable.js:210-212`) —
   **is read by no pool of this desk.**

---

## §1 THE FOUR LAYERS, AS THE ENGINE TYPES THEM (every cite re-derived at `f2da5a3ee`)

| Layer | The engine's typed home | file:line | What the layer answers |
|---|---|---|---|
| **BODY** (defense buckets) | `DEFENSE_BUCKET_KEYWORDS` — walls · garrison · militia · watch · mercenary · charter · magicDef, substring matches over `nativeSemanticName` | `src/domain/institutions/defenseInstitutionBuckets.js:83-109`; keys `:116`; partition `:134-145`; projection `standingDefenseForces` → `forces.<bucket>.present/count/names` `:169-182` | does this thing stand here, and what is it |
| **BODY** (generator flags) | `hasGarrison` `:46` · `hasMilitia` `:47` · `hasWatch` `:48` · `hasMercenary` `:49` · `hasCharterHall` `:51` · `hasWalls` `:52` · `hasChurch` `:65` · `hasCathedral` `:66` · `hasMonastery` `:67` · `hasCourtSystem` `:55` · `hasMilitaryInst` `:45` | `src/generators/priorityHelpers.js:45-67` | the boolean a generator reads |
| **BODY** (roster, religious) | the six per-tier `Religious:` blocks | `src/data/institutionalCatalog.js:41` (thorp) `:291` (hamlet) `:762` (village) `:1259` (town) `:1795` (city) `:2363` (metropolis) | the recorded member |
| **BODY** (roster, force) | `Garrison` `institutionServices.js:185` · `Barracks` `:1555` · `Citizen militia` `:835` · `Town watch` `:1322` · `Professional city watch` `:1206` · `Hireling hall` `:1002` · `Gates (if walled)` `:1550` | as cited | the recorded member and its services |
| **HOLDER-ORGAN** | `HOLDER_KINDS` — treasury · muster · census · parish · toll-bar · market · watch · court · elders · tradition · road · office (twelve, closed) | `src/domain/prose/holderTable.js:78-81` | which record keeps this fact |
| **HOLDER-ORGAN** (the state's four) | `STATE_ORGAN_KINDS = office · court · treasury · watch` | `holderTable.js:115` (ground `:92-114`) | which organs a captured ruling structure reaches |
| **HOLDER-ORGAN** (kind → roster) | `HOLDER_RECORDS`: `muster` `:279-288` · `parish` `:296-302` · `court` `:324-330` · `watch` `:317-323` · `office` `:356-364` · `elders` `:331-337` · `tradition` `:338-348` (**no institution anywhere**) | as cited | the organ's own books |
| **HOLDER-ORGAN** (field → kind) | `HOLDER_SOURCES`, one row per producing token, each cited | `holderTable.js:164-240`; the muster block `:188-199`; the watch block `:202-212`; the court block `:215-223`; the parish block `:226-227` | which kind a read belongs to |
| **POWER** (settlement-wide) | `powerStructure.criminalCaptureState` on the five-rung ladder `none · adversarial · equilibrium · corrupted · capture` | ladder `src/domain/corruption.js:474`; produced `src/generators/power/rulingStructure.js:755`, returned `:797`; mapped to the WATCH holder `holderTable.js:211` | who has taken the state |
| **POWER** (per-faction) | `factions[].captureState`; the settlement rollup takes the worst rung | `holderTable.js:129-143` (`capturedRulingStructure`); `src/domain/worldPulse/factionCapture.js:136-144` (`settlementCaptureState`) | which house has been bought |
| **POWER** (per-institution impairment) | a `corruption`-typed impairment on a SECURITY body, `covert` or revealed | `src/domain/corruption.js:630` (`SECURITY_INSTITUTION_RE = /(watch\|garrison\|constab\|guard\|magistrate\|court\|barracks)/i`), `:663-692`, the covert/revealed split `:677-680` | which body is bought, and whether the town knows |
| **POWER** (patron, brokerage) | `BROKERAGE_PATRON_SOURCES = genesis · captured` | `src/domain/worldPulse/brokeragePatronage.js:60`; `capturedPatronOf` `:228`; assembled `:283-295` | who owns this house |
| **POWER** (the name) | `governingName` = the governing faction's own `faction` string | `rulingStructure.js:787` (`(factions.find(f => f.isGoverning) || {}).faction || null`) | the typed slot that names the power |
| **ROLE** (vocabulary) | `ROLE_CATEGORY_KEYWORDS` — 8 categories incl. `military` (captain · commander · constable · warden · marshal · quartermaster · garrison · sergeant · watch chief · city watch · guard) and `religious` (priest · cleric · bishop · abbot · monk · friar · inquisitor · prelate · healer · chaplain · deacon · archivist · priestess) | `src/generators/roleCategory.js:32-68` | the words an office may be called |
| **ROLE** (typed, faction-side) | `FACTION_ROLES` — `temple: High Priestess` with `linkToInst: /temple\|cathedral\|shrine\|monastery/`; `watch: Watch Captain` with `linkToInst: /watch\|garrison\|barracks\|militia/` | `src/generators/factionRoles.js:44-61` | who heads this house |
| **PERSON** | **never a referent** — `holderRole` is a hardcoded `null` on every row, and the basis says so in words | `src/domain/institutions/institutionTable.js:215` (`OPEN_BY_LAW.holderRole = 'no typed NPC→institution edge exists; the value is null on every row'`), `:457` (`holderRole: null`), `:503-509` (`basis: absent: …; a name-regex inference exists at npcProfile.js:341-353 and is not called here`); the regex itself `src/domain/npcProfile.js:341-353` (`inferInstitutionLink`); the register's own statement `holderTable.js:31-36` | — |

⭐ **THE MOVE GRAMMAR ALREADY CARRIES THE LAW'S SHAPE, and it carries the faith half too.**
`MOVES.PERSON` asserts *"an office-holder as office, at most one recorded act"* and licences
*"a role: an office roll, `role`, `holderRole`"* (`src/domain/prose/moveGrammar.js:41`);
`MOVES.INSTITUTION` asserts *"who holds, who counts, who is counted, what it does"* and licences
*"a row of the institution table"* (`:43`); `MOVES.TRADITION` asserts *"a custom, a rite, a feast
the world holds"* and licences *"a custom/rite/creed field"* (`:47`). The REFERENT LAW's three
clauses are those three moves restated — and on this desk `holderRole` being null everywhere is
why the PERSON licence is empty, while TRADITION is the move nearly all the faith prose actually
sits on.

---

## §2 WHAT THIS DESK CAN PUT ON A PAGE — the five fills, and the LAYER of each

`SLOT_FILL_SHAPES` freezes five slots (`warFaithStateProse.js:139-145`); the leaf's variants name
fourteen, and the nine omissions are declared as the finding (`:130-136`).

| Slot | Shape | Filled from | file:line | **Layer of the fill** |
|---|---|---|---|---|
| `{settlement}` | proper | `settlement.name` through `properFill` | `warFaithStateProse.js:781`, `:790`; `properFill` `:168-175` | the TOWN — not an institution, not a power |
| `{counterpart}` | proper | `war.occupation.occupierName` first, else the tab's resolved `war.counterpart` | `warFaithStateProse.js:795`, `counterpartName` `:930-933`; the occupier name `src/domain/display/occupationStatus.js:96` (`occupierName: nameFor(rec.occupierId)`) | **POWER, spelled as a foreign TOWN's name.** The engine's own map overlay spells the same power as a ruling structure — `occupier: powerStructure.governingName \|\| …government \|\| 'occupation authority'` (`src/domain/display/warStatus.js:331-335`). Two spellings of one referent. |
| `{creed}` | proper | `ranks.find(isPatron).name` | `warFaithStateProse.js:796`; the rank shape `src/domain/worldPulse/religionState.js:620` | a CULTURE object (a rite/observance). Not an institution row, not a holder, not a power. |
| `{rival_creed}` | proper | `ranks.find(!isPatron).name` — the first non-patron in share order | `warFaithStateProse.js:797`, `:785-787` | same |
| `{term}` | proper | `leadingTerm(leadingDocument(war)?.termLines)?.label` | `warFaithStateProse.js:798`; `leadingTerm` `:379-389`; the label table `src/domain/worldPulse/peaceTermsCatalog.js:398-430` | an OBLIGATION on the court's document — an instrument, not a body |
| `{institution}` | proper (named by `DS-FTH-3`, `DS-FTH-4`) | **nothing** — declared unfillable | `warFaithStateProse.js:131-132` (*"`{institution}` has no temple-NAME producer (`inst.hasChurch` is a boolean)"*); the boolean `src/generators/priorityHelpers.js:65` | ⛔ the desk's ONLY institution-NAME slot, and it never fills — so **no face of this desk can name a BODY by its recorded name.** |

⛔ **The one slot that would carry the BODY layer is the one slot that cannot be filled.** That
is the structural fact behind almost every finding in §6.

---

## §3 THE LICENCE CARDS, AS PRINTED (ten run; the grammar that bears on the referent)

`node scripts/prose-licence-card.mjs <block> '<pool>'`, read-only. Ten cards across six blocks,
chosen so that every source kind on the desk (muster, court, parish, none) and every layer the
desk touches (body-ish, organ, power-adjacent, role-adjacent) is represented.

| # | Block :: pool | `source:` line printed | `audience:` | Layer note |
|---|---|---|---|---|
| 1 | `DS-WAR-1 :: statusLabel: On campaign` | `muster · standing LICENSED` | player | the ONE body-ish holder the desk licenses |
| 2 | `DS-WAR-1 :: occupierHoldings.stretchedThin` | `muster · standing LICENSED` | player | muster, on a read that is about ANOTHER power's position |
| 3 | `DS-WAR-1 :: mobilization: climbing the ramp, still distant` | `muster · standing LICENSED` | **DM only** (see §5.2) | |
| 4 | `DS-WAR-1 :: mobilization: fully ready` | `(none) · SOURCE-UNRESOLVED` | **DM only** (see §5.2) | |
| 5 | `DS-WAR-2 :: fraying set on a term with time still to run` | `court · standing LICENSED · a STATE ORGAN (interested where the town is captured)` | player | the desk's only POWER hook |
| 6 | `DS-WAR-2 :: document-level: the town is the VICTOR side` | `court · standing LICENSED · a STATE ORGAN (interested where the town is captured)` | player | same |
| 7 | `DS-FTH-1 :: SINK: unaffiliated present, arc falling` | `parish · standing LICENSED` | player | the faith HOLDER, and the desk's only one |
| 8 | `DS-FTH-1 :: MANDATE: contested, or patron security below the floor` | `(none) · SOURCE-UNRESOLVED` | player | `may NOT: … another civic object of the class temple` |
| 9 | `DS-FTH-1 :: STANDINGS: a plural field, no majority` | `(none) · SOURCE-UNRESOLVED` | player | |
| 10 | `DS-FTH-3 :: NICHE: every niche uncontested` | `(none) · SOURCE-UNRESOLVED` | player | bag names `{institution}: proper` and it is never filled |

**Three grammars the cards print that bear directly on the referent question.**

- **The card names a LAYER only through the SOURCE line, and only for a LICENSED row.** The four
  `court` rows print `· a STATE ORGAN (interested where the town is captured)`; the seven
  `muster` rows print no such clause; the 125 unresolved rows print *"NO citation is licensed: a
  face naming a record holder here is refused by arm A13"*. So today the card can distinguish
  ORGAN-UNDER-POWER from BODY **only where a holder resolved** — 13 of 138 rows. A
  `REFERENT LAYER` line on the card would be an ADDITION, exactly as ADDENDUM 10's `entails:`
  line is.
- **`may claim` is the FIELD'S truth and never the noun's standing.** Every card reads *"that
  `<leaf>` holds, as a STANDING fact of the record"*. Nothing on the card says which layer the
  sentence's NOUN may sit on.
- **The refused columns already forbid the PERSON layer, constitutionally.** Every card ends
  `REFUSED COLUMNS, always: a totality over persons; an exemption from a duty …; a named
  character and that character's fate (product scope); a theological claim about a deity (the
  deity doctrine)`. On this desk the first and the last are both load-bearing: *the congregation*
  / *the townspeople* / *everyone attends* are person-totalities, and every `{creed}` noun sits
  under the deity doctrine (`warFaithStateProse.js:56-66`).

---

## §4 THE NOUN TABLE — every institution-class noun and role word a face of this desk can render

Columns: **noun** · **name class, with the engine row** · **LAYERS the engine gives it** ·
**the READS of this desk that resolve to each layer** · **engine's own overlap** · **the typed
slot that names the power** · **always-safe class word**.

### §4.1 WAR — the force nouns

| Noun | Name class · engine row (file:line) | LAYERS | Reads of this desk that resolve to a layer | Engine own overlap | Typed power slot | Always-safe word |
|---|---|---|---|---|---|---|
| **the army / the field force** | no institution row; `besiegingTargets[]` / `deployments` | POWER-adjacent only (whose army) — **no BODY row** | `war.status.besiegingTargets.length` → `statusLabel: On campaign` (holder **muster**, `holderTable.js:197`) | `army` is not in `CIVIC_OBJECT_CLASSES.force` (`src/domain/prose/wiringCensus.js:1303`), so the projector does not see it as a force word at all | — (the town's own) | **the muster** |
| **the soldiers / the men** | no row; a rendering of the same reads | none typed; a person-plural | `war.occupation` (`occupation.pays *`), `war.occupierPosition` | person-plural collides with the card's refused column *a totality over persons* | `{counterpart}` when they are the occupier's | **the muster** (ours) / **{counterpart}'s garrison** (theirs) |
| **the muster** | ⛔ **TWO LAYERS ON ONE WORD.** (a) HOLDER kind `muster` (`holderTable.js:79`), roster = `Citizen militia` alone (`:279-288`); (b) a posture rung read `warPosture[cid].state` (`src/domain/display/mobilizationStatus.js:27-35`) | HOLDER-ORGAN **and** a state word | `war.postureState` + `war.mobilization.ticksToDeploy` → the four `mobilization:` pools; `besiegedBy`/`besiegingTargets` map to kind `muster` (`holderTable.js:196-198`) | the word is simultaneously the holder KIND name, the militia BODY's word, and the ramp's state word; `CIVIC_OBJECT_CLASSES.force` flattens `muster` with `garrison · militia · watch · guard · soldier · patrol · armed` (`wiringCensus.js:1303`) | — | **the muster** (this is the class word ADDENDUM 11 names) |
| **the banner** | the engine's own word for the `relational` clause: `'the compelled banner'` (`src/domain/display/treatyDocument.js:58`) | BODY word for an obligation read | `term.family === relational` → `relational · <state>` pools (holder **court** where `termLines` is read) | the annex spells the same row *"the muster"* (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:3543`) — two spellings, one row | `{counterpart}` (whose call it answers) | **the banner** on a `relational` term; **the muster** elsewhere |
| **the garrison** | ⛔ **THREE ROWS.** (a) the OCCUPIER's soldiers — `settlementOccupation` (`src/domain/display/occupationStatus.js:83-104`); (b) the TOWN's own body — bucket `garrison` (`defenseInstitutionBuckets.js:88-91`) / `inst.hasGarrison` (`priorityHelpers.js:46`) / roster row `Garrison` (`institutionServices.js:185`); (c) a `territorial` treaty clause (`peaceTermsCatalog.js:173`, voice `treatyDocument.js:67-71`) | BODY (a and b) · an instrument's object (c) | this desk reads only (a): `war.occupation`, `war.occupierPosition` | `garrison` is ALSO a `SECURITY_INSTITUTION_RE` member (`corruption.js:630`) and a `military` ROLE keyword (`roleCategory.js:37-40`) and a `FACTION_ROLES.watch` `linkToInst` alternative (`factionRoles.js:48`) — four layers, one word | `{counterpart}` | **{counterpart}'s garrison** — never a bare "the garrison" |
| **the walls / the gate** | bucket `walls` = wall · citadel · palisade · earthwork · inner citadel · massive walls (`defenseInstitutionBuckets.js:84-87`); `hasWalls` `:52`, `hasGates` `:53`; roster `Gates (if walled)` (`institutionServices.js:1550`) | BODY | ⛔ **none.** No warFaith read touches a wall field; `walls` maps to the muster kind for the DEFENSE desk (`holderTable.js:188`) | `CIVIC_OBJECT_CLASSES.wall` (`wiringCensus.js:1302`); `Gates (if walled)` is also the TOLL-BAR holder's roster row (`holderTable.js:308`) | — | ⛔ no safe word on this desk: a wall sentence here is another desk's read |
| **the militia** | bucket `militia` (`defenseInstitutionBuckets.js:92-94`); `hasMilitia` (`priorityHelpers.js:47`); roster `Citizen militia` (`institutionServices.js:835-838`) | BODY **and** the sole HOLDER-ORGAN roster row of the `muster` kind (`holderTable.js:284`) | none directly; it is what a licensed `muster` citation RESOLVES to | the one word that is both a body and the organ that keeps the body's roll | — | **the muster** (class) / **the citizen militia** (only if the roster row is resolved) |
| **a mercenary company / hireling hall / free company** | bucket `mercenary` (`defenseInstitutionBuckets.js:98-100`); `hasMercenary` (`priorityHelpers.js:49`); roster `Hireling hall` (`institutionServices.js:1002`) | BODY | none | ⛔ `hireling hall` sets BOTH `hasMercenary` (`:49`) and `hasCharterHall` (`:51`) | — | **the hired companies** |
| **the charter hall** | bucket `charter` (`defenseInstitutionBuckets.js:101-104`); `hasCharterHall` (`priorityHelpers.js:51`); catalog `Adventurers' charter hall` (`src/data/institutionalCatalog.js:325`, `:837`, `:1443`) | BODY | none | `charter` is also a `CIVIC_OBJECT_CLASSES.hall` word (`wiringCensus.js:1315`) and a treaty-instrument word | — | **the charter hall** |
| **the watch** | ⛔ **THE ADDENDUM'S CASE, RE-DERIVED.** (a) bucket `watch` = town watch · city watch · professional city watch (`defenseInstitutionBuckets.js:95-97`); (b) HOLDER kind `watch`, a STATE ORGAN (`holderTable.js:79`, `:115`), roster `Professional city watch` / `Town watch` (`:322`), tokens `watch · blackMarketCapture · criminalCaptureState · safetyProfile` (`:202-212`) | BODY **and** HOLDER-ORGAN (state organ) | ⛔ **none on this desk** — no warFaith row resolves to the `watch` kind | ⛔ `professional city watch` sits in BOTH the `garrison` bucket (`:90`) and the `watch` bucket (`:96`); `watch` is also in `SECURITY_INSTITUTION_RE` (`corruption.js:630`), in `CIVIC_OBJECT_CLASSES.force` (`wiringCensus.js:1303`), in `ROLE_CATEGORY_KEYWORDS.military` as `watch chief` / `city watch` (`roleCategory.js:38-39`), and is a `FACTION_ROLES` key (`factionRoles.js:47`) | — | ⛔ **no safe use on this desk**: the watch names the watch bucket or the order organ, and this desk reads neither |
| **the guard** | bucket keyword `professional guard` (`defenseInstitutionBuckets.js:89`); `hasGarrison` keyword (`priorityHelpers.js:46`) | BODY (garrison bucket) | none | also `SECURITY_INSTITUTION_RE` (`corruption.js:630`), `ROLE_CATEGORY_KEYWORDS.military` (`roleCategory.js:39`), `CIVIC_OBJECT_CLASSES.force` (`wiringCensus.js:1303`) | — | **the guard** (as ADDENDUM 11 rules: a body word of the garrison bucket) |
| **the barracks** | bucket keyword `barracks` (`defenseInstitutionBuckets.js:89`); roster `Barracks` (`institutionServices.js:1555`) | BODY | none | `SECURITY_INSTITUTION_RE` (`corruption.js:630`) | — | **the barracks** |

### §4.2 WAR — the organ, instrument and power nouns

| Noun | Name class · engine row (file:line) | LAYERS | Reads of this desk that resolve to a layer | Engine own overlap | Typed power slot | Always-safe word |
|---|---|---|---|---|---|---|
| **the hall** | HOLDER kind `office`, roster `City administration` / `City hall` / `Town hall` (`holderTable.js:356-361`; rows `institutionServices.js:39`, `:1623`, `:1629`); a STATE ORGAN (`:115`) | HOLDER-ORGAN | ⛔ **none.** No warFaith row resolves to `office`; the desk reads no `structuralViolations` / `structuralSuggestions` / `prominentRelationship` (`holderTable.js:237-239`) | `CIVIC_OBJECT_CLASSES.hall` flattens `hall · council · charter · seat · office · chamber · moot` (`wiringCensus.js:1315`); `Town hall` is ALSO the TREASURY holder's roster (`holderTable.js:277`) and `hasCourtSystem`'s keyword (`priorityHelpers.js:55`) | the ruling structure: `governingName` (`rulingStructure.js:787`) | ⛔ none on this desk — the hall is the power desk's organ |
| **the court** | HOLDER kind `court`, a STATE ORGAN (`holderTable.js:79`, `:115`); services `Criminal trials · Civil disputes · Notary services · Criminal proceedings · Civil litigation · Appeals` (`:326`); roster `Courthouse` (`institutionServices.js:89`), `Multiple court buildings` (`:1117`) | HOLDER-ORGAN (state organ) | ⭐ **the four DS-WAR-2 rows** via `termLines` (`holderTable.js:221`), `fraying` (`:222`), `yearsRemaining` (`:223`) — the card prints `a STATE ORGAN (interested where the town is captured)` | `court` sits in `CIVIC_OBJECT_CLASSES.law` (`wiringCensus.js:1312`), NOT in `hall`; `court` is also a `SECURITY_INSTITUTION_RE` member (`corruption.js:630`); `hasCourtSystem` matches `city hall` / `town hall` too (`priorityHelpers.js:55`) | `powerStructure.criminalCaptureState` (`rulingStructure.js:797`) reaching the organ by rule (`holderTable.js:677-698`) | **the court** — for a treaty read, and as the record's keeper, not as an agent |
| **the seat** | ⛔ **FOUR ROWS.** (a) the FAITH seat, `state.patronRef` (`religionState.js:620`); (b) the `political` treaty family's installed seat (`peaceTermsCatalog.js:174`, voice `treatyDocument.js:72-76`); (c) the governing seat, the power desk's `{seat}` = `governingName` (`rulingStructure.js:787`); (d) `CIVIC_OBJECT_CLASSES.hall` keyword `seat` (`wiringCensus.js:1315`) | POWER (b, c) · a faith standing (a) | `term.family === political` → the `political · *` pools; `faith.ranks[].isPatron` → the STANDINGS / LEGITIMACY / FALL pools | (a) and (b) are authored on the SAME desk and both say *"the seat"* — see §6 finding F-4 | (b) `{counterpart}`; (c) `governingName` | **the installed seat** (treaty) / **the patron's place** (faith) |
| **the occupier / the occupation authority** | `settlementOccupation().occupierName = nameFor(rec.occupierId)` (`occupationStatus.js:96`); the map overlay's `occupier = powerStructure.governingName \|\| …government \|\| 'occupation authority'` (`warStatus.js:333-335`) | POWER | `war.occupation` → `occupation.pays *`, `statusLabel: Occupied`; `war.occupierPosition` → `occupierHoldings.*` | ⛔ the two readers spell one referent two ways — a TOWN name here, a RULING-STRUCTURE name there; and `'occupation authority'` is a literal fallback that renders as a name (`warStatus.js:334`) | `{counterpart}` | **{counterpart}** (the named power), or **the occupier** |
| **the ruling structure / the government** | `powerStructure.government` / `governingName`, read through `mandateGovWeight`'s regex — theocracy · monarch/feudal/autocra/imperial/empire/despot/magocra/kingdom/throne/royal/king/queen/emperor · else 0 (`religionState.js:686-691`) | POWER | ⭐ `faith.mandate.phrase` → the three `MANDATE:` pools; the reader is GOVERNMENT-SCOPED and returns `null` for a merchant council or republic (`religionState.js:789`; declared `warFaithStateProse.js:580-583`) | the class word and the faction NAME are the same string (`rulingStructure.js:787`) | **`governingName`** | **the ruling structure** |
| **the faction / the house** | `powerStructure.factions[]{faction, isGoverning, captureState}` (`holderTable.js:64-66`, `:129-143`) | POWER | ⛔ none on this desk | `{faction}` is the power desk's slot; this desk has no faction slot (`warFaithStateProse.js:139-145`) | `factions[].faction` | ⛔ none — a faction word on this desk is another desk's read |
| **the treasury** | HOLDER kind `treasury`, a STATE ORGAN (`holderTable.js:79`, `:115`); services `Tax collection · Tax payment · Taxation and tolls · Tithe and dues` (`:274`) | HOLDER-ORGAN | ⛔ none | ⛔ used in FAITH prose as *"the faith's treasury"* (annex `:4797`) — a state-organ kind word attached to a creed | — | ⛔ none on this desk |
| **the market** | HOLDER kind `market` (`holderTable.js:79`); roster `Market square` (`:315`, row `institutionServices.js:1064`) | HOLDER-ORGAN | ⛔ none | `CIVIC_OBJECT_CLASSES.market` (`wiringCensus.js:1311`) | — | ⛔ none on this desk |
| **the granary / the stores / the wagons** | ⛔ the `granary` token was **drafted and withdrawn** from the holder table on its own evidence (`holderTable.js:157-161`: *"its only writers are a prose phrase map and a binding counter, neither of which keeps a store's record"*); the word's class is `CIVIC_OBJECT_CLASSES.storehouse` (`wiringCensus.js:1323`), the stock's is `store` (`:1310`) | BODY (stock/building), no holder | none of this desk's reads; the DS-WAR-2 `economic` prose reaches for it (annex `:3528`, `:3534`) | one word, two civic classes — split at REWRITE car 8a-8 (`wiringCensus.js:1304-1309`) | — | ⛔ none on this desk |
| **the rolls / the books / the ledger / the records** | the ANGLE `[ledger]` is *"the clerk's view — what the books, rolls and counts show"* (annex `:122`); `ledger` was ALSO drafted and withdrawn as a holder token (`holderTable.js:157-161`: *"seven writers … so the token names no one holder"*) | a STANDPOINT, not an organ | every pool carries an angle (`warFaithStateProse.js:139`→ the leaf's `angle` field) | ⛔ the angle palette's own names (`ledger`, `elder`) are HOLDER-kind vocabulary (`holderTable.js:79-80`); the shipped prose slides from the standpoint into the organ (§6 F-7) | — | **the record** / **the books** as a standpoint only — never as a holder |
| **the elders** | HOLDER kind `elders` (`holderTable.js:79`), service `Record of custom` (`:333`), roster `Household elder` / `Village elder` / `Village headman` / `Town council` (`:336`; rows `institutionServices.js:14`, `:26`, `:20`, `:32`) | HOLDER-ORGAN · also a ROLE keyword (`roleCategory.js:34`) | ⛔ none | ⛔ `[elder]` is one of the seven ANGLES of the palette (annex `:122`) and `elders` is a holder kind and `elder` is a `government` role keyword — three layers, one word | — | ⛔ none on this desk |
| **the parish** | HOLDER kind `parish` (`holderTable.js:79`), services `Register of the dead · Central register · Records` (`:298`), roster `Parish burial grounds` / `Cemetery network` / `Parish church` (`:301`; rows `institutionServices.js:1411`, `:1423`, `:1161`) | HOLDER-ORGAN | ⭐ `faith.piety.trend` + `faith.unaffiliated` → the two `SINK:` pools (`holderTable.js:226-227`) | `parish` is also a `CIVIC_OBJECT_CLASSES.temple` word (`wiringCensus.js:1313`); `Parish church`'s `Records` service is `on:false, p:0.5` (`institutionServices.js:1165`) and `Parish churches (2-5)` offers `Record keeping`, which is NOT one of the three parish service names (`:1170`) — so a town-tier town holds the parish record only through its burial grounds | — | **the parish** — for a piety/sink read only |
| **the toll-bar · the census · the road · the tradition** | HOLDER kinds (`holderTable.js:79-80`); `tradition` has **no institution anywhere in the shipped roster** (`:338-348`) | HOLDER-ORGAN | ⛔ none | `road` also names `CIVIC_OBJECT_CLASSES.road` (`wiringCensus.js:1314`) — and the pilgrim pools speak of *"the pilgrim road"* (annex `:4818`) with no road read | — | ⛔ none on this desk |
| **the treaty / the instrument / the document** | `TreatyDocument` read-model (`src/domain/display/treatyDocument.js:35-91`); sides `TREATY_DOCUMENT_SIDES = receiver · giver` (`src/domain/worldPulse/treatyOrientation.js:166`), lookup `:200-207` | an INSTRUMENT held by the court organ | `doc`, `doc.termLines` → the three `document-level:` pools | ⛔ `victorId`/`loserId` are `receiverId`/`giverId` *"on a WR-10 sale exactly as on a war settlement"* (`treatyOrientation.js:171-176`), a defect the desk declares (`warFaithStateProse.js:420-426`) | — | **the instrument** / **the document** |
| **the term / the clause** | 26 catalog types (`peaceTermsCatalog.js:159-322`), labelled `:398-430`, grouped into 13 families `:328`; the corpus authored 7 + a floor (`warFaithStateProse.js:323-326`) | an OBLIGATION on the instrument | `term`, `term.family`, `term.complianceState` → the 24 `<family> · <state>` pools | a family word must not carry a type-specific mechanism | — | **the clause** / **the term** |

### §4.3 FAITH — the creed, the fabric, and the organ

| Noun | Name class · engine row (file:line) | LAYERS | Reads of this desk that resolve to a layer | Engine own overlap | Typed power slot | Always-safe word |
|---|---|---|---|---|---|---|
| **the creed / the faith / the rite** (`{creed}`) | the deity snapshot's `name`, projected onto the settlement with exactly seven fields `{deityRef, name, niche, share, standing, legitimacy, isPatron}` (`religionState.js:620`) | ⛔ **NONE of the four.** It is a CULTURE object — `MOVES.TRADITION`'s licence (`moveGrammar.js:47`) — never a body, a holder, a power or a role | `faith.ranks`, `faith.patron.rankAxis`, `faith.piety.*`, `faith.contested` → DS-FTH-1/3 | `patron` and `faith` are both `CIVIC_OBJECT_CLASSES.temple` words (`wiringCensus.js:1313`), so the class word for the observance and the class word for the building are ONE class to the projector | — | **the creed** / **the observance** / **the rite** |
| **the patron** | ⛔ **THREE ROWS.** (a) the seated creed, `state.patronRef` (`religionState.js:620`, `:640`); (b) a brokerage house's PATRON, `genesis · captured` (`brokeragePatronage.js:60`, `:228`); (c) `rankAxis` as a pantheon word (`warFaithStateProse.js:476`) | (a) a faith standing · (b) **POWER** · (c) a realm count | (a) `faith.patron.rankAxis`, `faith.ranks[].isPatron`, `hasPatron`; (b) and (c) not read here | one word naming a faith seat and an ownership-of-a-house power on the same estate; the holder table reads the brokerage patron as the `controlled` arm of a STANDING (`holderTable.js:665-666`) | (b) `BROKERAGE_PATRON_SOURCES` | **the patron creed** (faith) — never bare "the patron" beside a power sentence |
| **the temple / church / shrine / cathedral / monastery** (`{institution}`) | the six per-tier `Religious:` rosters — thorp/hamlet `Wayside shrine` (`institutionalCatalog.js:42`, `:292`; services `institutionServices.js:1483`), village `Parish church` (`:763`) · `Priest (resident)` (`:778`) · `Graveyard` (`:785`), town `Parish churches (2-5)` (`:1260`) · `Monastery or friary` (`:1267`), city `Cathedral (10,000+ only)` (`:1796`) · `Parish churches (10-30)` (`:1828`), metropolis `Parish churches (50-100+)` (`:2364`) · `Great cathedral` (`:2371`) | BODY — and the parish rows are also the HOLDER-ORGAN | ⛔ **none.** The desk reads no institution field; `{institution}` never fills (`warFaithStateProse.js:131-132`) | `hasChurch` is a substring match over names — `['church','cathedral','temple','monastery','friary','shrine','priest','abbey']` (`priorityHelpers.js:65`) — so it is TRUE for a resident priest or a wayside shrine with no church building | — | ⛔ none on this desk: a temple BODY sentence here has no read behind it |
| **the parish church** | roster row (`institutionServices.js:1161-1166`) | BODY **and** HOLDER-ORGAN (`parish`, via the optional `Records` service `:1165`) | reached only as the RESOLUTION of a `parish` citation on the two `SINK:` pools | its `Records` service is `on:false, p:0.5`: the body is common, the ORGAN is a coin-flip | — | **the parish** (organ) / ⛔ no body word |
| **the graveyard / burial ground / cemetery network** | `Graveyard` (`institutionalCatalog.js:785`); `Parish burial grounds` (`institutionServices.js:1411-1416`, `Register of the dead` `on:true p:0.8`); `Cemetery network` (`:1423-1428`, `Central register` `on:true p:0.9`) | BODY **and** the `parish` HOLDER-ORGAN's most reliable roster row | as above | the only faith rows that reliably keep a record are the burial rows, not the churches | — | **the parish register** |
| **the clergy** | ⛔ **no institution row and no field.** `religious` is a ROLE-keyword category — priest · cleric · bishop · abbot · monk · friar · inquisitor · prelate · healer · chaplain · deacon · archivist · priestess (`roleCategory.js:42-45`); `clergy` is a `CIVIC_OBJECT_CLASSES.temple` word (`wiringCensus.js:1313`) | ROLE (vocabulary only) | ⛔ none | the word is a class word for persons and a civic-object class word at once | — | ⛔ none: a clergy sentence asserts a body of persons the engine does not count |
| **the congregation / the faithful / the households** | no row; a person-plural | ⛔ none — the card's refused column *a totality over persons* | `faith.ranks[].share` bands it (`src/components/settlement/faithPanelModel.js:60`) | `whoIsCounted` is OPEN BY LAW: *"the population is a NUMBER and no roll of persons exists anywhere in the engine"* (`institutionTable.js:211-212`) | — | **the following** / **the share of the town** (a band, never a body) |
| **the house / the benches / the building / the roof / the stonework** | the temple's FABRIC; no field | BODY (of `{institution}`, which never fills) | ⛔ none | — | — | ⛔ none |
| **the faith's treasury / the coffer / the tithe** | ⛔ `templeWealth` **has no writer anywhere** — `warFaithStateProse.js:96-99`; the annex measures it at `:6269` | — | ⛔ none (DS-FTH-3's three `TEMPLE WEALTH:` pools and DS-FTH-4's `ENDOWED` are unroutable) | `treasury` is a HOLDER kind name (`holderTable.js:79`) borrowed for a creed | — | ⛔ none |
| **the councils (of a faith)** | ⛔ no row, no field anywhere | — | none | `council` is a `CIVIC_OBJECT_CLASSES.hall` word (`wiringCensus.js:1315`) and a `government` ROLE keyword (`roleCategory.js:34`) — both POWER-side | — | ⛔ none |
| **cults[] / the lesser rites** | `faithPanelModel.js:192` — `config.cultDeitySnapshots`, i.e. every NON-PATRON embedded deity whatever its rank | a faith standing | `faith.cults.length > 0` → `CULTS: cults[] present beneath the patron` (`warFaithStateProse.js:865-868`) | `cult` also names a local `standing` (`religionState.js:150-155`) and a pantheon tier (`src/domain/worldPulse/pantheon.js:79-80`) | — | **the lesser rites** |
| **the ruler** | the MANDATE phrases' own word (`religionState.js:790-792`), licensed ONLY where `mandateGovWeight > 0` (`:686-691`, `:789`) | POWER, through the government class | `faith.mandate.phrase` → the three `MANDATE:` pools | the ruler is the ruling STRUCTURE, not a person; the phrase is authored copy the block *"surrounds, never rewrites"* (annex `:4517-4518`) | `governingName` (`rulingStructure.js:787`) | **the ruling structure** — "the ruler" only inside the authored mandate phrase |
| **the pilgrim road / the inns** | ⛔ no pilgrim-season record exists (sister survey §4.2); `road` is a HOLDER kind (`holderTable.js:80`) with roster `Listening post` / `Waystation` (`:354`) | — | none (`PILGRIM SEASON:` pools unroutable, and `{season}` never fills — `warFaithStateProse.js:131-132`) | — | — | ⛔ none |

### §4.4 THE ROLE WORDS — every one a face of this desk can reach

⛔ **The whole column is empty by measurement, not by taste.** `holderRole` is `null` on every
institution-table row and the basis says `absent` (`institutionTable.js:457`, `:503-509`); the
inference that would fill it exists and is deliberately not called (`npcProfile.js:341-353`).
`MOVES.PERSON` licences *"a role: an office roll, `role`, `holderRole`"* (`moveGrammar.js:41`) —
so on this desk the move has nothing to stand on.

| Role word | Where the engine holds it | Layer the engine gives it | Can a warFaith read reach it? | Always-safe form |
|---|---|---|---|---|
| **the captain** | `FACTION_ROLES.watch = { role: 'Watch Captain', linkToInst: /watch\|garrison\|barracks\|militia/ }` (`factionRoles.js:47-49`); `captain` in `ROLE_CATEGORY_KEYWORDS.military` (`roleCategory.js:37`) | ROLE, faction-side; the institution edge is a GENERATION regex, not a queryable edge | ⛔ no | ⛔ none |
| **the priest / the high priestess** | `FACTION_ROLES.temple = { role: 'High Priestess', linkToInst: /temple\|cathedral\|shrine\|monastery/ }` (`factionRoles.js:44-46`); `priest`/`priestess` in `ROLE_CATEGORY_KEYWORDS.religious` (`roleCategory.js:43-44`); ⛔ ALSO an institution ROW name, `Priest (resident)` (`institutionalCatalog.js:778`, services `institutionServices.js:1194`) | ROLE **and** BODY (the row is an institution whose NAME is a role word) | ⛔ no — and note `Priest (resident)` keeps NONE of the parish record services (`institutionServices.js:1194-1199`) | ⛔ none |
| **the reeve** | `reeve` in `ROLE_CATEGORY_KEYWORDS.government` (`roleCategory.js:34`); ⛔ ALSO an institution row, `Village reeve` (`institutionServices.js:1346`), and one of the TREASURY holder's roster rows (`holderTable.js:277`) | ROLE **and** BODY **and** the treasury organ's roster | ⛔ no | ⛔ none |
| **the elder** | `elder` in `ROLE_CATEGORY_KEYWORDS.government` (`roleCategory.js:34`); HOLDER kind `elders` (`holderTable.js:79`); ⛔ ALSO the `[elder]` ANGLE (annex `:125`) | ROLE **and** HOLDER-ORGAN **and** an angle tag | the ANGLE, yes (20 variants carry `[elder]`); the role/organ, no | **the `[elder]` angle** only — never "the elders" as a body |
| **the factor** | `factor` in `ROLE_CATEGORY_KEYWORDS.economy` (`roleCategory.js:52`) | ROLE | ⛔ no | ⛔ none |
| **the magistrate** | `magistrate` in `ROLE_CATEGORY_KEYWORDS.government` (`roleCategory.js:34`); ⛔ ALSO a `SECURITY_INSTITUTION_RE` member (`corruption.js:630`) and a `CIVIC_OBJECT_CLASSES.law` word (`wiringCensus.js:1312`) | ROLE **and** a corruptible SECURITY body | ⛔ no | ⛔ none |
| **the mayor / the lord mayor** | `mayor` in `ROLE_CATEGORY_KEYWORDS.government` (`roleCategory.js:34`); `FACTION_ROLES.noble = { role: 'Lord Mayor', linkToInst: /council\|court\|government\|\b(?:town\|city)\s?halls?\b/ }` (`factionRoles.js:56-58`); roster `Mayor and council` | ROLE | ⛔ no | ⛔ none |
| **the guildmaster** | `FACTION_ROLES.merchant` (`factionRoles.js:51`); `guild master`/`guildmaster` in `ROLE_CATEGORY_KEYWORDS.economy` (`roleCategory.js:52`) | ROLE | ⛔ no | ⛔ none |
| **the clerk(s)** | `office` HOLDER kind's standpoint word; the `[ledger]` angle is *"the clerk's view"* (annex `:122`) | a STANDPOINT word, not a role row | as an ANGLE only | **the books** / **the record** |
| **the sexton** | appears ONLY inside a service description — `"Register of the dead": …"The sexton records who lies where"` (`institutionServices.js:1413`) | a description string, no row | ⛔ no | ⛔ none |
| **the shepherd / the observers / the watchers / the bearers** | no row, no field | — | ⛔ no | ⛔ none |

---

## §5 THE READS OF THIS DESK, SORTED BY THE LAYER THEY RESOLVE TO

### §5.1 The layer of every RESOLVED pool (27 of 138)

| Layer of the read | Pools | Source kind (`wiring-census.json` `source.kind`) | What the noun may be |
|---|---|---|---|
| **BODY-adjacent (a force's state, held by the muster)** | `statusLabel: On campaign` · `Occupied` · `At war` (`warFaithStateProse.js:197-207`); `mobilization: climbing…distant` · `climbing, close to ready` (`:251-262`) | `muster` LICENSED | the muster, the banner, {counterpart}'s garrison |
| **BODY-adjacent, but about ANOTHER power's position** | `occupierHoldings.stretchedThin` · `.strengthened` (`warFaithStateProse.js:314-318`) | `muster` LICENSED | {counterpart} as the subject; the garrison as {counterpart}'s |
| **ORGAN-UNDER-POWER (a state organ's instrument)** | `fraying set on a term with time still to run` (`:398-402`); `document-level: …runs out within the year` · `…LOSER side` · `…VICTOR side` (`:436-448`) | `court` LICENSED, `stateOrgan: true` | the court, the instrument, the clause — the institution as OBJECT |
| **ORGAN (a record keeper, no power)** | `SINK: unaffiliated present, arc falling` · `arc rising` (`:537-543`) | `parish` LICENSED | the parish; the share of the town |
| **NO LAYER — a standing with no holder** | `mobilization: fully ready` · `COVERT` · `occupation.pays true` · `false` · `STANDINGS: ×3` · `MANDATE: ×3` · `PRIVATE DOSSIER` · `NICHE: ×2` · `DS-WAR-3 *` | SOURCE-UNRESOLVED | ⛔ no record holder may be named (arm A13) |

### §5.2 ⛔ A MEASURED DEFECT IN THE VISIBILITY FLAG — the card marks three PLAYER pools DM-only

`row.covert` is set by `row.reads.some(isCovertPath)` (`src/domain/prose/wiringCensus.js:1681`),
and `isCovertPath` returns true for any chain with a `covert` segment or any `COVERT_SOURCES`
substring (`:1252-1269`). `mobilizationPoolKey` reads `covert` on EVERY branch
(`warFaithStateProse.js:251-262`) but returns `'mobilization: COVERT'` only when it is TRUE
(`:254`) — so the three non-covert branches carry the token in their reads without being covert
states.

| Pool | Census `covert` | Annex `dm-only` marks | Card's `audience:` | Truth |
|---|---|---|---|---|
| `mobilization: COVERT` | true | 3 of 3 (annex `:3445-3448`) | DM only | ✔ correct |
| `mobilization: climbing the ramp, still distant` | true | **0 of 3** (annex `:3430-3433`) | **DM only** | ✘ a player pool marked DM |
| `mobilization: climbing, close to ready` | true | **0 of 3** (annex `:3435-3438`) | **DM only** | ✘ |
| `mobilization: fully ready` | true | **0 of 3** (annex `:3440-3443`) | **DM only** | ✘ |

The card even prints the contradiction in one line: `covert: YES — every variant carries
'dm-only' (T-F5); unmarked variants: 3`. **A writer reading the card would seat a DM pen line on
three player faces.** Wiring finding for the register car, not a writer's choice (ADDENDUM 11
clause 5).

### §5.3 (d) EVERY READ THAT TOUCHES A STANDING OVER AN ORGAN, AND WHICH FACE MAY NAME IT

| Standing | Does a warFaith read touch it? | Engine visibility flag (file:line) | Which face is licensed |
|---|---|---|---|
| **Settlement-wide capture** (`criminalCaptureState`) | **Indirectly and only as provenance**: the four DS-WAR-2 `court` rows carry `stateOrgan: true` (`holderTable.js:560`), so a captured ruling structure makes the court an INTERESTED party in its own treaty record (`:677-698`, `:707-708`, `:770`). No pool STATES the capture. | the token itself is the WATCH holder's (`holderTable.js:211`); the capture ladder is `corruption.js:474`; the annex rules the capture surface **PRINT-DEFERRED at `corrupted` and above** and `dm-only` on the ladder cells (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:3943`, `:3948`) | **Neither face of this desk may name it.** The player face may state the court's instrument; naming the capture is DS-DEF-4 / DS-POW-6's read, at their audience gate. |
| **Per-faction capture** (`factions[].captureState`) | no | `factionCapture.js:136-144`; the `captured` arm is measured ABSENT on every headless town (`holderTable.js:661-662`) | — |
| **Per-institution corruption impairment** | no — no warFaith read touches `institutions[].impairments` | `corruption.js:663-692`; **covert ⇒ the DM's hidden channel, revealed ⇒ a public scandal** (`:669-673`, `:677-680`) | — (a warFaith face naming a bought watch would be borrowing DS-DEF-11's read) |
| **Brokerage patronage** | no | `brokeragePatronage.js:60`, `:228`; absent on every headless town (`holderTable.js:665-666`) | — |
| **INTERESTED as a standing** | never in the register (the register knows no town, so `holder` is `null` and `standing` can never read INTERESTED — `holderTable.js:551-559`); only `sourceOfForTown` can raise it (`:760-770`) | — | a provenance line, not a sentence |
| **Covert MOBILIZATION posture** | ⭐ **yes** — the desk's one live covert read | `covert: prev.covert && nextIdx >= RAMP_INDEX.war_preparation` (`src/domain/worldPulse/mobilization.js:366`, `:391`), written `false` on every peace/demobilizing arm (`:315`, `:343`, `:349`, `:375`), normalized `:147` | **the DM pen line only** — all 3 variants `dm-only` (annex `:3446-3448`); DS-WAR-5's `posture COVERT` is the sibling read and the fence says **one per page, never both** (annex `:3445`, `:3806`) |
| **Covert CONGREGATION** (`deities[ref].covert`) | named by DS-FTH-3's STATE-KEY (annex `:4676`) and keyed by a pool (`:4809`) | ⛔ **the field has no writer anywhere in `religionState.js`** (sister survey §7 finding 1) | the 3 variants are `dm-only`, and the pool is undrawable |
| **Foreign funding** (`sovereignty · strained`) | yes — 3 `dm-only` variants (annex `:3623-3625`) | no engine flag: the mark is authored on the variant, not derived from a field | the DM pen line |

---

## §6 THE ENGINE'S OWN OVERLAPS, GATHERED (ADDENDUM 11 clause 5 — wiring facts, not writer choices)

| # | Word | The engine rows it is in | file:line | Wiring note for the register car |
|---|---|---|---|---|
| O-1 | **professional city watch** | the `garrison` bucket AND the `watch` bucket | `defenseInstitutionBuckets.js:90` and `:96` | the addendum's case, re-derived verbatim: one roster name, two buckets. Also sets both `hasGarrison` and `hasWatch` (`priorityHelpers.js:46,48`). |
| O-2 | **the watch** | a defense BODY bucket AND the `watch` HOLDER kind (a state organ) AND a `SECURITY_INSTITUTION_RE` member AND a `force` civic class AND a `military` role keyword AND a `FACTION_ROLES` key | `defenseInstitutionBuckets.js:95`; `holderTable.js:79,115,202-212`; `corruption.js:630`; `wiringCensus.js:1303`; `roleCategory.js:38-39`; `factionRoles.js:47` | **six** rows on one word. The `muster` kind does NOT contain the watch bucket (`holderTable.js:188-199`), which is the whole ground for ADDENDUM 11 clause 5. |
| O-3 | **hireling hall** | `hasMercenary` AND `hasCharterHall` | `priorityHelpers.js:49` and `:51` | one row, two force flags |
| O-4 | **the seat** | the faith seat · the `political` treaty term · the governing seat · a `hall` civic-class word | `religionState.js:620`; `peaceTermsCatalog.js:174`; `rulingStructure.js:787`; `wiringCensus.js:1315` | **both of the first two are authored on THIS desk** and both spell it *"the seat"* (annex `:3588` vs `:4589`) |
| O-5 | **the patron** | the seated creed · a brokerage house's owner · a pantheon rank word · a `temple` civic-class word | `religionState.js:620`; `brokeragePatronage.js:60`; `warFaithStateProse.js:476`; `wiringCensus.js:1313` | the faith word and the POWER word are the same word |
| O-6 | **the muster** | a HOLDER kind · the militia BODY's word · the posture ramp's state word · a `force` civic-class word | `holderTable.js:79,279-288`; `mobilizationStatus.js:27-35`; `wiringCensus.js:1303` | the class word ADDENDUM 11 chooses is itself three rows — safe because all three are the same referent's layers, unlike the watch |
| O-7 | **elder / elders / `[elder]`** | a `government` ROLE keyword · a HOLDER kind · an ANGLE of the palette | `roleCategory.js:34`; `holderTable.js:79`; annex `:125` | the angle tag and the organ share a name on every page of this desk |
| O-8 | **ledger / clerk / rolls** | the `[ledger]` ANGLE (*"the clerk's view — what the books, rolls and counts show"*) · the withdrawn `ledger` holder token · the `office` organ's roster | annex `:122`; `holderTable.js:157-161`, `:356-364` | the standpoint's own vocabulary is holder vocabulary, which is how §7 F-7 happens |
| O-9 | **the garrison** | the occupier's soldiers · the town's own body · a treaty clause's garrison · a SECURITY body · a `military` role keyword · a `force` civic-class word | `occupationStatus.js:83-104`; `defenseInstitutionBuckets.js:88`; `peaceTermsCatalog.js:173`; `corruption.js:630`; `roleCategory.js:38`; `wiringCensus.js:1303` | a bare "the garrison" is unresolvable in six directions |
| O-10 | **the court** | a HOLDER kind (state organ) · a SECURITY body (corruptible) · a `law` civic-class word · a `noble` `linkToInst` alternative | `holderTable.js:79,115,324-330`; `corruption.js:630`; `wiringCensus.js:1312`; `factionRoles.js:57` | the desk's ONLY licensed state organ is also a body the corruption model can impair |
| O-11 | **the treasury** | a HOLDER kind (state organ) — and the faith prose's word for a creed's wealth | `holderTable.js:79,115,272-278`; annex `:4797` | a state organ's kind name borrowed for an unbuilt faith field |
| O-12 | **`Priest (resident)` / `Village reeve`** | institution ROWS whose NAMES are ROLE words | `institutionalCatalog.js:778`; `institutionServices.js:1346`, `:1194`; `roleCategory.js:34,43` | the BODY layer and the ROLE layer share a string in the shipped roster |
| O-13 | **`CIVIC_OBJECT_CLASSES.force`** | flattens `garrison · militia · muster · watch · guard · soldier · patrol · armed` into ONE class | `wiringCensus.js:1303` | the projector cannot tell the muster kind from the watch bucket; any two of those words on one page read as a restatement |
| O-14 | **`CIVIC_OBJECT_CLASSES.temple`** | flattens `temple · shrine · church · parish · clergy · faith · patron` into ONE class | `wiringCensus.js:1313` | why four DS-FTH cards print `may NOT: … another civic object of the class temple`: a `{creed}` sentence and an `{institution}` sentence cannot sit together |
| O-15 | **the occupier** | a foreign TOWN name (`nameFor(occupierId)`) vs a RULING-STRUCTURE name (`governingName`) vs the literal `'occupation authority'` | `occupationStatus.js:96`; `warStatus.js:333-335` | two readers, one referent, two spellings — and a fallback string that renders as a name |

---

## §7 (e) THE SHIPPED ROWS THAT USE A WORD AT THE WRONG LAYER FOR THEIR READ — findings for the chair

Quotations are at most twelve words, per the brief. "Read" names the field the pool is keyed on;
"Layer error" names the mismatch under the drafted law's clause 1.

### F-1 · BODY words on a POWER/standing read (the commonest class on this desk)

| # | Row (annex file:line) | Read it is keyed on | Quote (≤12 words) | Layer error |
|---|---|---|---|---|
| 1 | `DS-WAR-1 :: statusLabel: Occupied` v1 (`:3399`) | `war.occupation` truthy (`warFaithStateProse.js:203`) | *"The hall still sits, the market still opens"* | two HOLDER-ORGAN bodies asserted present on a read that touches no institution |
| 2 | `DS-WAR-3 :: *` v3 (`:3688`) | `!warBeat && !anyTreaty && faithHidden` (`warFaithStateProse.js:469-471`) | *"neither soldiers nor temples worth remarking on"* | two BODY absences asserted from three non-institution booleans; a town with a Garrison row and a Parish church draws this |
| 3 | `DS-FTH-2 :: PRIVATE DOSSIER` v1 (`:4654`) | `hasPatron === false` (`warFaithStateProse.js:611-613`) | *"the shrines answer to no named god"* | a BODY plural asserted from one boolean; `Wayside shrine` is a real row the read never consults |
| 4 | `DS-FTH-2 :: PRIVATE DOSSIER` v3 (`:4656`) | same | *"shrines at crossroads and doorframes, none of them a creed's"* | as above, plus a geography claim |
| 5 | `DS-FTH-3 :: STANDING: cult` v2 (`:4706`) | `deities[].standing` share band (`religionState.js:150-155`) | *"Its shrine is real, its calendar is observed"* | a BODY existence claim from a SHARE band |
| 6 | `DS-FTH-3 :: STANDING: established` v2 (`:4709`) | same | *"a real congregation, a real house"* | a BODY claim plus a person-totality, from a share band |
| 7 | `DS-FTH-3 :: NICHE: slots open` v1 (`:4728`) | `SLOTS_BY_TIER` capacity (`cultImpositionApply.js:42`) — **and the pool is not routed** (`warFaithStateProse.js:655-658`) | *"Shrines stand unclaimed, and an arriving creed would find space"* | a BODY claim from a tier integer |
| 8 | `DS-FTH-3 :: FALL: imposed` v1 (`:4772`) | `patronFalls[].cause` token (`patronFall.js:76`) | *"The creed followed the garrison, and the calendar changed"* | a BODY (the garrison) named on a token that carries no institution; the classifier's *garrison flip* arm is not a projected field |
| 9 | `DS-FTH-3 :: FALL: suppressed` v1 (`:4779`) | same | *"Its shrines are closed, its days unmarked"* | BODY claims from a cause token |
| 10 | `DS-WAR-2 :: economic · honored` v1 (`:3528`) | `term.family`/`complianceState` (holder **court**) | *"the clerks who load them have stopped remarking"* | a ROLE-plural agent, and an `office`-organ word, on a court-held clause read |

### F-2 · A PERSON or a person-plural as the agent (the layer the engine refuses outright)

| # | Row (annex file:line) | Quote (≤12 words) | Layer error |
|---|---|---|---|
| 11 | `DS-WAR-1 :: warExhaustion: war-weary` v4 (`:3423`) | *"nobody in the hall can say in advance which demand"* | a person-plural inside a HOLDER-ORGAN, on a 0..1 scar read |
| 12 | `DS-WAR-1 :: warExhaustion: rested` v3 (`:3411`) | *"the not-spending is a choice somebody made"* | an unnamed PERSON as decider |
| 13 | `DS-WAR-2 :: sovereignty · strained` v3 (`:3625`) | *"Somebody at {settlement} is being funded from outside"* | a PERSON as the object of a patronage-shaped claim; `dm-only`, but the referent is still a person |
| 14 | `DS-WAR-2 :: informational · honored` v2 (`:3604`) | *"There are people at the hall who are not the town's"* | a person-plural inside the office organ |
| 15 | `DS-WAR-5 :: treaty burden` (`:3884`) | *"a decision nobody in the hall has been willing"* | as F-11 |
| 16 | `DS-FTH-3 :: COVERT CONGREGATION` v3 (`:4813`) | *"Its shepherd holds an ordinary clerical post under another creed's"* | a ROLE as an agent with a placement claim, on a field with **no writer** |
| 17 | `DS-FTH-1 :: PATRON: rankAxis: major` v3 (`:4530`) | *"Its clergy speak with the confidence of people who"* | a ROLE-plural as speaker, on a realm SEAT-COUNT read |
| 18 | `DS-FTH-3 :: PANTHEON RANK: Major` v1 (`:4790`) | *"its clergy speak to rulers rather than about them"* | a ROLE-plural AND a POWER-plural, on a seat count |

### F-3 · An ORGAN word invented for a referent that has no organ

| # | Row (annex file:line) | Quote (≤12 words) | Layer error |
|---|---|---|---|
| 19 | `DS-FTH-3 :: PANTHEON RANK: Major` v2 (`:4791`) | *"What its councils say about the lawfulness of magic"* | a creed given a governing organ; `council` is `hall`-class POWER vocabulary (`wiringCensus.js:1315`) and no faith-council field exists |
| 20 | `DS-FTH-3 :: TEMPLE WEALTH: rich` v3 (`:4797`) | *"The faith's treasury is full. It is among the richest"* | the TREASURY holder-kind name attached to a creed, on `templeWealth` — **a field with no writer** (`warFaithStateProse.js:96-99`) |
| 21 | `DS-FTH-1 :: MANDATE: a dominant church` v3 (`:4620`) | *"the ruler's writ carries a weight the office alone"* | `the office` is a HOLDER kind (`holderTable.js:79`) used as a bare power word beside `the ruler` |
| 22 | `DS-FTH-4 :: ROOTED` (`:6286`) | *"in the rolls, in the feast days, in who"* | *the rolls* is muster/census/parish record vocabulary, on a `tenure` field **not projected** (`religionState.js:620`) |

### F-4 · SAME WORD, TWO REFERENTS on one desk (clause 3's failure mode, already shipped)

| # | The word | Row A (annex) | Row B (annex) | The collision |
|---|---|---|---|---|
| 23 | **the seat** | `DS-WAR-2 :: political · honored` — *"The installed seat at {settlement} still sits"* (`:3588`) | `DS-FTH-3 :: LEGITIMACY: contested` — *"It holds the seat on numbers alone"* (`:4757`) | a POWER installed by a treaty, and a FAITH standing — one word, two layers, both authored here |
| 24 | **the garrison** | `DS-WAR-1 :: occupation.pays false` — *"the garrison here is an expense the occupier"* (`:3451`) | `DS-FTH-3 :: FALL: imposed` — *"The creed followed the garrison"* (`:4772`) | the occupier's body, and a body with no read at all |
| 25 | **the muster** | `DS-WAR-2 :: relational · honored` — *"{settlement} answers {counterpart}'s muster as the terms require"* (`:3543`) | `DS-WAR-2 :: security · honored` — *"no muster gathers where the terms forbid one"* (`:3558`) | ANOTHER town's call vs THIS town's own arms — opposite directions of obligation, one word, adjacent pools |
| 26 | **the court** | `DS-WAR-2 :: informational · honored` — *"The court at {settlement} stays open to {counterpart}'s"* (`:3603`) | the same block's `court` HOLDER kind, which is the SOURCE of the document rows (`holderTable.js:221-223`) | the organ as the record's KEEPER and the organ as a room with a door, on one page |

### F-5 · A FUSED AGENT — a relation no field computes (clause 3)

| # | Row (annex file:line) | Quote (≤12 words) | The asserted relation, and what is missing |
|---|---|---|---|
| 27 | `DS-WAR-1 :: occupierHoldings.strengthened` v1 (`:3466`) | *"the garrison at {settlement} is stronger for the occupier's other"* | joins a LOCAL body's strength to a REMOTE holdings reading; `occupierHoldings` returns `{holds[], stretchedThin, strengthened}` only (`occupationStatus.js:119-148`, the two flags `:145`,`:147`) — and the desk's own docblock says the slot roles are INVERTED against the reader that shares the pool's name (`warFaithStateProse.js:282-301`) |
| 28 | `DS-FTH-1 :: MANDATE: a dominant church` v2 (`:4619`) | *"what the ruling power asks, the patron's clergy have already"* | a fused POWER + ROLE agent asserting a sequencing relation; `divineMandateStatus` returns `{propping, phrase}` and nothing about asking (`religionState.js:786-794`) |
| 29 | `DS-WAR-1 :: statusLabel: On campaign` v2 (`:3394`) | *"the shortness is felt at the harvest and the gate"* | joins a deployment record to a harvest and a gate; the deployment carries `{targetId, sinceTick, role}` only |

### F-6 · THE VISIBILITY MISMATCH (clause 4)

| # | Finding | Evidence |
|---|---|---|
| 30 | Three PLAYER pools are printed `audience: DM only` by the licence card, because `row.covert` is derived from the READ TOKEN and not the branch | `wiringCensus.js:1681` + `:1252-1269` vs `warFaithStateProse.js:251-262` and the annex's unmarked variants at `:3430-3443`; the card's own self-contradicting line: `covert: YES … unmarked variants: 3` |
| 31 | The one covert read the desk genuinely has is fenced against its sibling and the fence is an authored note, not a gate | annex `:3445` (`DS-WAR-1`) and `:3806` (`DS-WAR-5`): *"One per page, never both"* — DS-WAR-5 is dark, so the fence is currently vacuous |

### F-7 · THE ANGLE SLIDING INTO THE ORGAN

| # | Finding | Evidence |
|---|---|---|
| 32 | The `[ledger]` angle is a STANDPOINT — *"the clerk's view — what the books, rolls and counts show"* (annex `:122`) — and shipped `[ledger]` variants promote it into an organ with agents: *"the clerks who load them"* (`:3528`), *"the observers are seeing less than they are owed"* (`:3608`) | annex `:122`, `:3528`, `:3608` |
| 33 | `[elder]` is an angle (annex `:125`) and `elders` is a holder kind (`holderTable.js:79`) and `elder` is a government role keyword (`roleCategory.js:34`) — the desk carries 20 `[elder]` variants and no elders read | as cited |

---

## §8 WHAT THE DESK'S EVIDENCE SUGGESTS ABOUT THE DRAFTED LAW (not a decision; the chair's)

1. **On this desk clause 1 bites hardest in the direction the addendum did not emphasise.** The
   addendum's worked case is a BODY word used on a STANDING read ("the bought watch" on a pay
   read). This desk's dominant failure is the opposite and simpler: **a body word used on a read
   that has no body layer at all.** Twenty-two of the thirty-three findings above are body or
   organ nouns on reads that touch no institution field, because the desk reads none (§0.1).
2. **Clause 2's marker tag would be cheap to enforce here and expensive to get right.** The card
   already prints the layer for the 13 LICENSED rows (through the `source:` line and the
   `a STATE ORGAN` clause) and prints nothing for the other 125. A `REFERENT LAYER` line would
   have to answer for the unresolved rows too, and the honest answer for them is **"no layer —
   no noun of any layer is licensed"**, which is stronger than the card says today.
3. **Clause 3's "same word, same referent" is already violated in shipped prose within one
   block** (F-23 the seat, F-25 the muster, F-26 the court). Those are not composition accidents;
   they are two pools of DS-WAR-2 authored from the same vocabulary for different rows.
4. **Clause 4 currently cannot be executed from the card on this desk**, because the card's
   audience line is wrong on three of four mobilization pools (F-30). The fix is a wiring cure
   (branch-aware covert), which is exactly the shape clause 5 assigns to the register car.
5. **Clause 5's alias overlap is bigger than the one example.** Fifteen overlaps are on the
   record (§6), and two of them — `force` and `temple` in `CIVIC_OBJECT_CLASSES`
   (`wiringCensus.js:1303`, `:1313`) — mean the projector itself cannot tell the layers apart, so
   a refusal it makes and a refusal the law would make are not the same refusal.
6. **The faith half needs a fifth word in the law, or an explicit exclusion.** `{creed}` is none
   of BODY / HOLDER-ORGAN / POWER / ROLE: it is `MOVES.TRADITION`'s object — *"a custom, a rite,
   a feast the world holds"* (`moveGrammar.js:47`). Most of DS-FTH-1/2/3's prose is a TRADITION
   read, and every finding in F-1 rows 3–9 is a tradition read reaching for a body word it has no
   slot to name (`{institution}` never fills — `warFaithStateProse.js:131-132`).
