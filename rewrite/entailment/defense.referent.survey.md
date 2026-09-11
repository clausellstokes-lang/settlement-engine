# REFERENT SURVEY — THE DEFENSE DESK (DS-DEF-1 … DS-DEF-11)

Research packet for the chair's question of 2026-09-10 00:0x (brief ADDENDUM 11, THE REFERENT LAW).
**No ruling is made here.** Dock: `.../scratchpad/laneRW-DEFW` at `f2da5a3ee`, READ-ONLY — nothing staged, no suite run, no register written. Every `file:line` below was re-derived in that tree by grep/sed at this tip, not copied from the addendum.

The sister ENTAILMENT packet for this desk (`defense.survey.md`) owns what a noun MEANS. This packet owns what a noun REFERS TO. Its rows do not repeat the entailment table; where the two touch, the entailment row is cited rather than restated.

---

## §0 SCOPE — THE DESK, DERIVED RATHER THAN GUESSED

**The brief says to read `scripts/prose-wave-gate.mjs`'s `--section <desk>` handling for the block-prefix set. That handling does not exist at this tip.** `grep -niE "section|desk|prefix" scripts/prose-wave-gate.mjs` returns nothing; the file's header (`scripts/prose-wave-gate.mjs:1-40`) names the subject as "a DESK SECTION's spine pools" but takes no such flag. The desk boundary is therefore derived from the two registers that do carry it, and both agree:

| Register | Line | What it says |
|---|---|---|
| the projector's `DESKS` table | `scripts/generate-dossier-state-prose.mjs:111` | `{ file: 'defense', constant: 'DOSSIER_STATE_PROSE_DEFENSE', prefixes: ['DS-DEF-'], title: 'THE DEFENSE DESK' }` |
| the licence card's `DESK_LEAF_OF` | `scripts/prose-licence-card.mjs:57` | `'DS-DEF': 'src/domain/display/stateProse/defenseStateProseCandidates.js'` |

So the desk is exactly the `DS-DEF-*` blocks: **eleven blocks · 126 census rows · 383 variants · 80 RESOLVED / 46 WIRING-UNRESOLVED** (counted from `docs/content/wiring-census.json` in the dock).

| Block | Annex line | Subject | Rows (RESOLVED/total) |
|---|---|---|---|
| DS-DEF-1 | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2500` | Defensive posture header | 8 / 8 |
| DS-DEF-2 | `:2568` | Threat assessment, five readiness rows | 26 / 26 |
| DS-DEF-3 | `:2727` | Public order banner | 7 / 7 |
| DS-DEF-4 | `:2790` | Criminal structure + capture consequence | 9 / 9 |
| DS-DEF-5 | `:2862` | Armed forces & fortifications | 11 / 11 |
| DS-DEF-6 | `:2939` | Supporting capabilities | 8 / 21 |
| DS-DEF-7 | `:3069` | Live defense readiness + war front | 0 / 11 (UNMOUNTED) |
| DS-DEF-8 | `:3149` | Active military status | 3 / 4 |
| DS-DEF-9 | `:3191` | Viability › magic dependency | 3 / 3 |
| DS-DEF-10 | `:3228` | Five arms, badges, fifteen postures | 0 / 21 (UNMOUNTED) |
| DS-DEF-11 | `:5963` | Why the wall, and why not | 5 / 5 |

**⚠ The brief's own block table and the census disagree on pool counts for five blocks.** The brief (car 8b) sizes the consist at **121 pools**; the census carries **126 rows**. Variant counts agree everywhere (383). The differences: DS-DEF-1 brief 9 / census 8 · DS-DEF-4 brief 7 / census 9 · DS-DEF-6 brief 20 / census 21 · DS-DEF-7 brief 10 / census 11 · DS-DEF-10 brief 19 / census 21. Raised, not resolved — it does not move any referent row below, but a per-pool instrument (the licence card's `entails:` / layer lines, once ratified) will be built against one of the two numbers.

### §0.1 A SIXTH AND SEVENTH DS-DEF-11 POOL EXIST IN A ROSTER AND NOT IN THE CORPUS

`scripts/prose-licence-card.mjs:37-44` (`TASTE_POOLS`) names four DS-DEF-11 pools the annex does not contain:

| Roster row | Line | In the annex at `f2da5a3ee`? |
|---|---|---|
| `DS-DEF-11 :: country: pressed (walled)` | `prose-licence-card.mjs:38` | **no** |
| `DS-DEF-11 :: country: pressed (unwalled)` | `:39` | **no** |
| `DS-DEF-11 :: watch: bought (revealed)` | `:40` | **no** |
| `DS-DEF-11 :: watch: bought (covert)` | `:41` | **no** |

Executed: `node scripts/prose-licence-card.mjs --list DS-DEF-11` prints five spines (`WALLED-THREATENED · WALLED-QUIET · WALLED-STRAINED · UNWALLED-SMALL · UNWALLED-LARGE`), and `node scripts/prose-licence-card.mjs DS-DEF-11 'watch: bought (covert)'` throws `no pool 'watch: bought (covert)' in DS-DEF-11` at `prose-licence-card.mjs:114`.

**Why this belongs in a REFERENT packet.** `watch: bought (revealed)` / `watch: bought (covert)` are the desk's ONLY pools whose read is a standing over an organ *at the institution grain* (a corruption impairment on a security body), and they are the only pools that split on the visibility flag. They land with car 8b-11 (the brief's block table: "the taste's home; its four pools' typed lines and candidate functions land here with their rows"). **They will be written under whatever the chair ratifies here — the law reaches them before they exist, not after.**

### §0.2 LICENCE CARDS EXECUTED (8, across 6 blocks; the brief asked for five)

`node scripts/prose-licence-card.mjs <block> '<pool>'`, run in the dock. The `source:` and `audience:` lines are the card's whole referent vocabulary today:

| Block :: pool | `source:` as printed | `covert:` | `audience:` |
|---|---|---|---|
| DS-DEF-5 :: `watch PRESENT` | `muster + watch · standing LICENSED · two-source row · a STATE ORGAN (interested where the town is captured)` | no | player (no mark) |
| DS-DEF-5 :: `garrison PRESENT` | `muster · standing LICENSED` | no | player (no mark) |
| DS-DEF-4 :: `capture corrupted` | `(none) · standing SOURCE-UNRESOLVED` | no | `player (no mark) · marks in this pool: dm-only` |
| DS-DEF-11 :: `WALLED-STRAINED` | `muster · standing LICENSED` | no | player (no mark) |
| DS-DEF-3 :: `Dangerous` | `(none) · standing SOURCE-UNRESOLVED` | no | player (no mark) |
| DS-DEF-2 :: `Invasion & War: walls AND professional garrison` | `muster · standing LICENSED` | no | player (no mark) |
| DS-DEF-6 :: `Naval Defense: Under blockade` | `toll-bar · standing LICENSED` | no | player (no mark) |
| DS-DEF-8 :: `override active, viability threatened` | `treasury · standing LICENSED · a STATE ORGAN (interested where the town is captured)` | no | player (no mark) |

**What the card grammar already carries, and what it does not.** The card prints a HOLDER KIND and the phrase `a STATE ORGAN (interested where the town is captured)` — built at `scripts/lib/prose-licence-card.mjs:406`, `:410`. That is the entire referent apparatus a writer sees. It does **not** print a layer per read; it does not say whether the sentence's noun should be a body word or an organ word; and on the desk's five purest POWER reads (DS-DEF-4's capture ladder) it prints `(none) · SOURCE-UNRESOLVED` and `NO citation is licensed`. The gap ADDENDUM 11 names is exactly this: **the card types the SOURCE of the fact and never the REFERENT of the sentence.**

---

## §1 ADDENDUM 11's ENGINE CITES, RE-DERIVED AT `f2da5a3ee`

| Addendum's claim | Cite as given | Re-derived | Verdict |
|---|---|---|---|
| defence buckets: walls · garrison · militia · watch · mercenary · charter | `defenseInstitutionBuckets.js:83-104` | `DEFENSE_BUCKET_KEYWORDS` at `:83`; walls `:84`, garrison `:88`, militia `:92`, watch `:95`, mercenary `:98`, charter `:101`, **`magicDef` `:105`**; table closes `:109`; `DEFENSE_BUCKET_KEYS` `:116` | **CORRECTED — the table is SEVEN buckets, not six.** `magicDef` (`:105-108`) is a defence bucket the addendum's list omits, and DS-DEF-5 reads it (`arcane defense PRESENT/ABSENT`). Range is `:83-109`. |
| "professional city watch" sits in BOTH garrison and watch | `:83-104` | `garrison` keywords include `'professional city watch'` (`:90`); `watch` keywords include `'professional city watch'` (`:97`); match is substring over `nativeSemanticName(...).toLowerCase()` (`:138`) | **VERIFIED** |
| `HOLDER_KINDS` (twelve) | `holderTable.js:78` | `export const HOLDER_KINDS = Object.freeze([...])` at `:78-81` | **VERIFIED** |
| the paid military the upkeep gate measures is the MUSTER kind (walls · garrison · militia · mercenary · charter) | `holderTable.js:188-192` | `walls:188`, `garrison:189`, `militia:190`, `mercenary:191`, `charter:192` — all `kind: 'muster'` | **VERIFIED**, and the kind holds **seven more** tokens: `force:193`, `magicDependency:194`, `economicGates:195`, `besiegedBy:196`, `besiegingTargets:197`, `ticksToDeploy:198`, `stretchedThin:199` (12 in total; census `holders` block confirms `fields: 12`) |
| the WATCH kind is a STATE ORGAN (office · court · treasury · watch) | `holderTable.js:115` | `export const STATE_ORGAN_KINDS = Object.freeze(['office', 'court', 'treasury', 'watch'])` at `:115` | **VERIFIED** |
| the watch keeps the order records (`criminalCaptureState`, `blackMarketCapture`, `safetyProfile`) | `holderTable.js:210-212` | `watch` token `:202-209` (with the ruling's own note), `blackMarketCapture:210`, `criminalCaptureState:211`, `safetyProfile:212` | **VERIFIED** — and the `watch` TOKEN row at `:202-209` carries the ruling verbatim: *"the muster roll counts men under arms, and the watch keeps its own count."* |
| the settlement-wide capture ladder | `rulingStructure.js:797` | `criminalCaptureState,` returned in the ruling-structure object at `:797` | **VERIFIED** |
| per-faction `captureState` | `holderTable.js:129-143`, `factionCapture.js:136` | `capturedRulingStructure` at `holderTable.js:129-143`; `settlementCaptureState` at `factionCapture.js:136`, its `LADDER = ['none','adversarial','equilibrium','corrupted','capture']` at `:137` (a second copy at `:212`) | **VERIFIED** (the ladder literal is `:137`, not `:136`) |
| corruption impairment on a SECURITY body | `corruption.js:630`, `:655-680` | `SECURITY_INSTITUTION_RE = /(watch\|garrison\|constab\|guard\|magistrate\|court\|barracks)/i` at `:630`; `compromisedSecurityInstitutions` filters on it `:665-666`; `impairments[].type === 'corruption'` `:677`; `covert !== true ⇒ revealed`, else `covert` `:679-680` | **VERIFIED** |
| a brokerage house PATRON (genesis · captured) | `brokeragePatronage.js:60` | `BROKERAGE_PATRON_SOURCES = Object.freeze(['genesis','captured'])` at `src/domain/worldPulse/brokeragePatronage.js:60` | **VERIFIED as engine fact — but NOT a defense-desk read.** No DS-DEF census row reads a brokerage field; the patron layer reaches this desk through no pool. Recorded so the chair does not legislate a layer this desk cannot render. |
| PERSON is never a referent: `COLUMN_SOURCES.holderRole` is a measured null | `holderTable.js:32-36` | `holderTable.js:33` is **prose about** the column, not the column. The column itself is `institutionTable.js:129-138` (`read: false`, note: *"none exists; `npcProfile.js:341-353` infers a link by name regex and this module does not call it"*), `OPEN_BY_LAW.holderRole` `:215`, the hardcoded `holderRole: null` `:457`, and the column basis `absent: …` `:503-508` | **CORRECTED CITE, CLAIM STANDS.** And the engine states the ROLE rule in its own words at `institutionTable.js:455-456`: *"an inferred holder licenses the ROLE NOUN only — never 'the holder of THIS one'."* |

---

## §2 THE FOUR LAYERS AS THE ENGINE TYPES THEM FOR THIS DESK

| Layer | The engine's typed object | Defining row (file:line) | How many DS-DEF pools resolve it |
|---|---|---|---|
| **BODY** | an institution row in `settlement.institutions[]`, partitioned into seven defence buckets | `defenseInstitutionBuckets.js:83-109` (keywords), `:134-146` (`partitionDefenseInstitutions`), `:169-182` (`standingDefenseForces` → `{present,count,names}` per bucket) | 9 direct (DS-DEF-5) + 13 aggregate-over-buckets (DS-DEF-2 beasts + invasion) + 5 compound (DS-DEF-11) |
| **HOLDER-ORGAN** | one of twelve record-keeper kinds; four of them are the state's own organs | `holderTable.js:78-81` (`HOLDER_KINDS`), `:115` (`STATE_ORGAN_KINDS`), `:164-243` (`HOLDER_SOURCES`, the field→kind map) | 35 pools carry a kind: muster 26 · toll-bar 3 · muster+watch 2 · treasury 2 · muster+road 2. **91 of 126 carry none.** |
| **POWER** | a typed standing OVER an organ: the settlement capture ladder, a per-faction `captureState`, a corruption impairment, a patron | `rulingStructure.js:797`; `holderTable.js:129-143`; `factionCapture.js:136-146`; `corruption.js:630`, `:661-691`; `brokeragePatronage.js:60` | **5** (DS-DEF-4's capture ladder) — plus the two unlanded taste pools of §0.1 |
| **ROLE** | a role NOUN only, with no typed edge to an institution | `institutionTable.js:129-138`, `:215`, `:455-457`, `:503-508` | **0.** No DS-DEF pool reads a role. |

**The arithmetic that matters for the law:** the desk is overwhelmingly a BODY desk (27 of its 35 holder-bearing pools are `muster`, and `muster` is where `walls · garrison · militia · mercenary · charter` live), it holds exactly **two** organ-bearing rows where the organ is the WATCH, exactly **five** power reads, and **zero** role reads. A law that is expensive at the ROLE layer costs this desk nothing; a law that is expensive at the BODY/ORGAN boundary costs it a great deal.

---

## §3 EVERY INSTITUTION-CLASS NOUN AND ROLE WORD OF THE DESK

For each noun: the LAYERS the engine gives it (with the engine row), the READS that resolve to each layer, the engine's own OVERLAPS, the TYPED SLOT naming the power where one exists, and the always-safe class word for the layer.

### 3.1 THE WALL / FORTIFICATION FAMILY — a BODY word and nothing else

| Noun | Layers | Engine row (file:line) | Reads that resolve it | Overlap | Power slot | Always-safe class word |
|---|---|---|---|---|---|---|
| `wall` / `walls` | BODY only | bucket `walls` `defenseInstitutionBuckets.js:84-87`; flag `hasWalls` `priorityHelpers.js:52` | `forces.walls.present` (DS-DEF-5 ×2, DS-DEF-11 ×5); `walls` arg of `invasionRowSituation` (DS-DEF-2 ×6); `perimeter` arg of `beastsRowSituation` (DS-DEF-2 ×7) | bucket key is **singular** `'wall'` (`:85`), flag key is **plural** `'walls'` (`priorityHelpers.js:52`) — two tables, two keys, same intent | none | **the wall** / **the perimeter** / **the line** (body) |
| `citadel` | BODY only | `:85` (`'citadel'`, `'inner citadel'`) | as above | — | none | the wall class |
| `palisade` | BODY only | `:86` | as above | — | none | the wall class |
| `earthwork` | BODY only | `:86` | as above | — | none | the wall class |
| `massive walls` | BODY only | `:87` | as above | matches `'wall'` too — one row, two keywords | none | the wall class |
| `gate` / `gates` | BODY only, **by accident** | catalogue row *Gates (if walled)*; caught by bucket `'wall'` inside "walled" and by flag `'gates (if walled)'` `priorityHelpers.js:52` | no pool reads a gate directly | a gate is in the WALLS bucket because the string "walled" contains "wall" | none | the gate (body) |
| `{defwork}` (the slot) | BODY only — the town's OWN wall by recorded name | shape `bare-common`; fill `defworkFill` `defenseStateProse.js:1027-1035`; gate list `DEFWORK_WORDS` `:1003`; set into the bag at `:1084` | DS-DEF-11 ×3 name it | refuses any name outside the four wall words and returns `undefined`, dropping the variant (`:1029-1033`) | none | — (it IS the derived fill) |

**Note for the chair:** the wall family has NO organ, NO power and NO role layer anywhere in the engine. A wall sentence can only ever be a body sentence, which makes DS-DEF-11 the desk's cleanest layer and DS-DEF-11's one watch word (§8 F-1) the more conspicuous.

### 3.2 THE FORCE FAMILY — BODY words under the MUSTER organ

| Noun | Layers | Engine row (file:line) | Reads that resolve it | Overlap | Power slot | Always-safe class word |
|---|---|---|---|---|---|---|
| `garrison` | BODY (bucket) + HOLDER-ORGAN (`muster`) | bucket `:88-91`; flag `hasGarrison` `priorityHelpers.js:46`; holder `holderTable.js:189` (`kind:'muster'`, cited to `:88`) | `forces.garrison.present` (DS-DEF-5); `garrison` arg (DS-DEF-2 invasion ×6); `garrison \|\| militia` as `force` (DS-DEF-2 beasts ×7, `defenseStateProse.js:655`) | **`'professional city watch'` is a GARRISON keyword (`:90`) and a WATCH keyword (`:97`)**; also in `corruption.js:630`'s SECURITY set | none | **the garrison** · **the guard** (body) |
| `barracks` | BODY (garrison bucket) | `:89` | via `forces.garrison.present` | also in `corruption.js:630` SECURITY set | none | the garrison |
| `professional guard` | BODY (garrison bucket) | `:89` — **matches no shipped catalogue row** (`:76-80`) | none | the word `guard` IS in `hasMilitaryInst` `priorityHelpers.js:45` and in `corruption.js:630` | none | the guard |
| `militia` / `citizen militia` | BODY (bucket) + HOLDER-ORGAN (`muster`) | bucket `:92-94`; flag `hasMilitia` `priorityHelpers.js:47`; holder `holderTable.js:190` | `forces.militia.present` (DS-DEF-5); `militia` arg (DS-DEF-2 invasion) | `'militia'` matches `'citizen militia'` — one row reached twice | none | **the militia** · **the muster** (class word for the paid military) |
| `mercenary company` / `mercenary quarter` / `hired muscle` | BODY (bucket) + HOLDER-ORGAN (`muster`) | bucket `:98-100`; flag `hasMercenary` `priorityHelpers.js:49`; holder `holderTable.js:191` | `forces.mercenary.present` (DS-DEF-5) | **the FLAG catches four rows the BUCKET does not** (`hireling hall`, `free company hall`, `veteran's lodge` at `priorityHelpers.js:49`), so a town can be `hasMercenary` with an EMPTY mercenary bucket | none | the contracted force |
| `adventurers' charter hall` | BODY (bucket) + HOLDER-ORGAN (`muster`) | bucket `:101-104`; flag `hasCharterHall` `priorityHelpers.js:51`; holder `holderTable.js:192` | `forces.charter.present` (DS-DEF-5 ×2) | `hireling hall` is in BOTH `hasMercenary` and `hasCharterHall` (`:49`, `:51`) | none | the charter hall |
| `magicDef` bodies (wizard · mages' guild · academy · alchemist · golem workforce) | BODY (**seventh** bucket) | `:105-108`; flag `hasMagicInst` `priorityHelpers.js:68` | DS-DEF-5 `arcane defense PRESENT/ABSENT` reads `magicWorks` (census), **not** the bucket | the bucket exists and the desk's arcane pools do not read it — a wiring row | none | arcane provision |
| `force` (the token) | HOLDER-ORGAN (`muster`) | `holderTable.js:193`, cited to `threatDefensePolicy.js:13` | the `force` argument of `beastsRowSituation`, which is `garrison \|\| militia` at `defenseStateProse.js:655` | **the `force` term EXCLUDES the watch bucket** | none | the muster |

**The single most load-bearing line in this section:** `defenseStateProse.js:655` —
`beasts: rung(beastsRowPoolKey(settlement?.config?.monsterThreat, walls, garrison || militia))`.
The desk's "force" is `garrison || militia`. Not the watch, not the mercenary, not the charter. Anything a DS-DEF-2 beasts face says about "the force" refers to the garrison bucket or the militia bucket and to nothing else.

### 3.3 `WATCH` — THE ONE WORD THIS ENGINE SPLITS IN TWO

This is the desk's whole referent problem in one row, so it is given its own table.

| The word's layer | Engine object | Row (file:line) | What resolves it on THIS desk | Always-safe word |
|---|---|---|---|---|
| **BODY** — the watch bucket | `watch: ['town watch','city watch','professional city watch']` | `defenseInstitutionBuckets.js:95-97` | `forces.watch.present` — **DS-DEF-5 `watch PRESENT` and `NO organized force at all`, and nothing else on the desk** | the watch (as a bucket name) · the town watch |
| **BODY** — the inst flag | `hasWatch: ['town watch','city watch','professional city watch']` | `priorityHelpers.js:48` | consumed by `safetyProfile.js` (see §3.7), never by a DS-DEF pool | — |
| **HOLDER-ORGAN** — the WATCH kind | one of twelve record-keeper kinds, and one of the four STATE ORGANS | `holderTable.js:78-81`, `:115`; the `watch` token row `:202-209` | the two-source rows DS-DEF-5 `watch PRESENT` / `NO organized force at all` (card prints `muster + watch · a STATE ORGAN`) | the order organ · the watch (as record-keeper) |
| **HOLDER-ORGAN's records** | `blackMarketCapture`, `criminalCaptureState`, `safetyProfile` | `holderTable.js:210`, `:211`, `:212` | DS-DEF-3 (safety label) and DS-DEF-4 (capture) read the DERIVED values — **and the census resolves neither back to the kind** (§9 W-1) | — |
| **SECURITY body for corruption** | `SECURITY_INSTITUTION_RE` matches `watch` | `corruption.js:630` | no landed DS-DEF pool; the unlanded `watch: bought (revealed)/(covert)` pools of §0.1 | — |
| **The name the engine itself uses** | `watchLabel`, TIER-DERIVED | `safetyProfile.js:30-34`: `town` ⇒ `'town watch'`, `city+` ⇒ `'city watch'`, else `'local watch'` | the engine's own safety prose | **the engine already computes the town's correct watch word** |

**Three facts the chair should have side by side:**
1. The class word for the paid military the upkeep gate measures is **the muster** (`holderTable.js:188-192`) and the watch bucket is **not in it**.
2. `professional city watch` is simultaneously a GARRISON member (`:90`) and a WATCH member (`:97`), so a town holding that one institution is `forces.garrison.present === true` AND `forces.watch.present === true` from a single row.
3. The engine's own prose never bakes "the watch": it derives the word by flag precedence and by tier (§3.7).

### 3.4 THE STATE ORGANS BESIDES THE WATCH — court, treasury, office

| Noun | Layers | Engine row (file:line) | Reads on this desk | Overlap | Always-safe word |
|---|---|---|---|---|---|
| `court` / `courthouse` | BODY (flag) + HOLDER-ORGAN (`court`, a STATE ORGAN) | flag `hasCourtSystem` `priorityHelpers.js:55`; kind `holderTable.js:78-81`, `:115`; court tokens `:216-224` | DS-DEF-2 `Internal Security` ×4 (`READS: court ; prison`, **SOURCE-UNRESOLVED**); DS-DEF-6 `Legal Infrastructure` ×4 (WIRING-UNRESOLVED) | `hasCourtSystem` catches **`town hall` and `city hall`, both `required:true`** (`priorityHelpers.js:55`) — so nearly every town+ is `hasCourtSystem` through its HALL, not through a courthouse; and `court` is in `corruption.js:630`'s SECURITY set | the court (body) · the court (organ) |
| `prison` / `gaol` / `stocks` | BODY (flag) only — **no holder kind** | flag `hasPrison` `priorityHelpers.js:54` | DS-DEF-2 `Internal Security` ×4; DS-DEF-6 ×4 | none | the gaol (body) |
| `treasury` | HOLDER-ORGAN (`treasury`, a STATE ORGAN) — **no defence body** | kind `holderTable.js:78-81`, `:115`; tokens `:167-170` | DS-DEF-8 `viability threatened` / `intact` (card: `treasury · a STATE ORGAN`) | none | the purse · the treasury |
| `office` | HOLDER-ORGAN (`office`, the record itself, a STATE ORGAN) | `holderTable.js:84` (`OFFICE_KIND`), `:115`, tokens `:237-239` | none on this desk | a citation on `office` is a FINDING, not a licence (`holderTable.js:84`) | the office |

### 3.5 THE CIVIC AND SUPPORT BODIES — body words with no organ and no power

| Noun | Layer | Engine row (file:line) | Reads on this desk | Overlap | Always-safe word |
|---|---|---|---|---|---|
| `granary` / `the stores` | BODY (flag) only | `hasGranary` `priorityHelpers.js:63` (keyword `'granar'`) | DS-DEF-2 `Disasters` ×5; DS-DEF-6 `Logistics` ×5 | a `granary` holder row was **drafted and withdrawn** on its own evidence (`holderTable.js:157-158`) | the granary · the store |
| `hospital` / `infirmary` | BODY (flag) only | `hasHospital` `priorityHelpers.js:64` | DS-DEF-2 `Disasters` ×5; DS-DEF-6 `Medical` ×3 | the flag catches **`monastery`, `healer`, `friary`** (`:64`), so "hospital present" can be a friary | the infirmary · somewhere for the sick |
| `church` / `parish` / `clergy` | BODY (flag) + HOLDER-ORGAN (`parish`) | `hasChurch` `priorityHelpers.js:65`; kind `holderTable.js:78-81`; parish tokens `:227-228` (`piety`, `unaffiliated`) | DS-DEF-2 `Disasters` ×5 (the `church` arg); DS-DEF-6 `Clergy care` | `monastery`/`friary` are in **both** `hasHospital` and `hasChurch` (`:64`, `:65`); a `church` holder row was drafted and **withdrawn** (`holderTable.js:157-158`) | the parish (organ) · the clergy (body) |
| `port` / `docks` / `harbour` | BODY (flag) + HOLDER-ORGAN (`toll-bar`) | `hasPort` `priorityHelpers.js:32`, `:61`; toll-bar tokens `holderTable.js:183-185` | DS-DEF-6 `Naval Defense` ×3 (card: `toll-bar · LICENSED`), `Logistics` ×5 | the `PORT_INFRA_RE` also matches `navy` (`priorityHelpers.js:32`) | the harbour · the toll bar (organ) |
| `navy` / `fleet` | BODY (flag) — **zero shipped members** | `hasNavy` `priorityHelpers.js:62` (`'navy'`, `'major port'`) | DS-DEF-6 `Naval Defense` reads `navy` (census `READS: blockaded ; navy ; port`) | `hasMilitaryInst` also lists `'navy'` (`:45`) | the ships |
| `road` | HOLDER-ORGAN (`road`) — a body word for nothing | kind `holderTable.js:78-81`; tokens `terrainType:233`, `monsterThreat:234` | DS-DEF-11 `WALLED-THREATENED` / `QUIET` (card: `muster + road`) | the `road` organ holds the COUNTRY facts, not a road institution | the road (organ) · the country |

### 3.6 THE POWER LAYER — every noun and every typed slot

| Noun / slot | Layer | Engine row (file:line) | Reads on this desk | Typed? | Always-safe word |
|---|---|---|---|---|---|
| `{seat}` (the slot) | **POWER, typed** — the ruling structure by its recorded designation | shape `proper`; filled `seat: properFill(text(power.government))` at `defenseStateProse.js:962` | named by DS-DEF-4's five capture pools | **YES — this is the desk's one typed power slot** | `{seat}` itself |
| the ruling structure | POWER (class) | `rulingStructure.js:797` returns `criminalCaptureState` on the structure object | DS-DEF-4 capture ×5 | class word only | **the ruling structure** · **the seat** |
| `criminalCaptureState` (the ladder) | POWER — a standing over the state's organs | `rulingStructure.js:797`; mapped to the WATCH kind `holderTable.js:211`; `capturedRulingStructure` `:129-143` | DS-DEF-4 capture ×5 — census read is `text(captureState)` | typed value, five rungs | the capture rung |
| per-faction `captureState` | POWER | `holderTable.js:134-140`; `factionCapture.js:136-146` | **none on this desk** | typed | — |
| `{faction}` (the slot) | **POWER, typed — and DEAD** | declared on DS-DEF-3, DS-DEF-4, DS-DEF-5 SLOTS lines; bag shape `proper` on every card printed | **named by ZERO variants; filled by ZERO call sites.** `grep -n "faction:\|factionFill\|governingName" src/domain/display/stateProse/defenseStateProse.js` returns nothing | typed but unwired | — |
| `{npc}` (the slot) | PERSON — declared, forbidden by the block's own fence | declared `RECEIPT_POOLS_DOSSIER_STATE.md:2800`; fence *"Never name the compromised person as a target; the leash is the state, not a fate"* `:2809-2810` | named by ZERO variants; no fill exists | — | — (never a referent) |
| "the criminal interest" / "the operators" / "the syndicate" | POWER, **UNTYPED** — an authored noun | no engine row. `deriveCriminalStructure` (`defenseDisplay.js:183-195`) yields a STRUCTURE KEY, not a named power | DS-DEF-4 structure ×4 and capture ×5 use these words | **no** | the criminal interest (class) |
| a corruption impairment | POWER over a SECURITY body | `corruption.js:630`, `:661-691` | **none landed**; the §0.1 taste pools | typed (`covert` boolean) | — |
| a brokerage PATRON | POWER over a house | `brokeragePatronage.js:60` | **none on this desk** | typed | — |

### 3.7 THE ENGINE'S OWN DERIVED BODY WORD — the instrument the corpus does not use

`src/generators/safetyProfile.js` builds the same sentence family DS-DEF-3 narrates, and it **never bakes an institution noun**. It derives one, by flag precedence, at six sites:

| Site | Line | Precedence as written | Fallback when nothing resolves |
|---|---|---|---|
| `Very Safe` | `:263-272` | garrison(+watch) → garrison → `watchLabel` → militia → … | `'law enforcement'` `:272` |
| `Safe` | `:281` | `hasGarrison ? 'The garrison' : hasWatch ? 'The watch' : hasMilitia ? 'The militia' : …` | `'Local enforcement'` `:281` |
| `Moderate` | `:288-289` | `'The garrison patrols'` → `'The watch covers'` → `'Militia volunteers patrol'` → … | `'Locals watch over'` `:289` |
| `Unsafe` | `:295-300` | garrison → watch → militia → mercenary → … | `'There is no meaningful guard presence.'` `:300` |
| `Dangerous` | `:305-310` | garrison → watch → militia → … | `'There is effectively no law enforcement.'` `:310` |
| `guardEffectivenessDesc` | `:320-325` | garrison(+watch) → garrison → `watchLabel` → `'citizen militia'` → `'mercenary company'` → `"adventurers' charter hall"` | `'local guard'` `:325` |

and the watch's own NAME is tier-derived: `watchLabel` at `:30-34` — `'town watch'` / `'city watch'` / `'local watch'`.

**This is the engine's own answer to the referent question, already shipped.** On a safety read the body word is a function of which body exists; the garrison outranks the watch; and where no body resolves the engine says *"law enforcement"* / *"local guard"* — a FUNCTION word, never an institution name. The corpus's DS-DEF-3 does the opposite (§8 F-2).

### 3.8 ROLE WORDS — the full sweep

Every role-shaped word in the desk's 383 shipped variants, found by `grep -noEi "\b(captain|reeve|elder|elders|priest|clergy|factor|sheriff|marshal|constable|magistrate|warden|officer|commander|sergeant|mayor|lord|steward|headman|bailiff|guildmaster|practitioner|practitioners|healer|wizard|mage)\b"` over the annex ranges `:2500-3300` and `:5963-6010`:

| Word | Occurrences | Where | Layer as used | Engine row behind it |
|---|---|---|---|---|
| `clergy` / `Clergy` | 3 | DS-DEF-2 `granary AND parish care only` v1; DS-DEF-6 `Medical Readiness: Clergy care` (pool NAME ×2) | a BODY word for the parish, plural and unindividuated | `hasChurch` `priorityHelpers.js:65`; parish kind `holderTable.js:78-81` |
| `practitioner(s)` | 7 | DS-DEF-9 ×6, DS-DEF-6 `Magical Capability` v2 (as "people it calls on") | a ROLE word in a standing state, never an individual | `magicDependency` `holderTable.js:194`; `magicDef` bucket `:105-108` |
| `elder` | 1 | DS-DEF-11 `WALLED-QUIET` v2 — **the `[elder]` ANGLE TAG, not a noun in prose** | not a referent at all | angle palette, §0b |
| `captain` · `reeve` · `sheriff` · `marshal` · `constable` · `magistrate` · `warden` · `officer` · `commander` · `sergeant` · `mayor` · `lord` · `steward` · `headman` · `bailiff` · `factor` · `guildmaster` | **0** | — | — | — |

**Measured result: the desk names no office-holder and no titled role anywhere in 383 variants.** `practitioner` is the only role noun that carries a read (`magicDependency`), and it is always plural and always in a standing condition — which is the form ADDENDUM 11 item 1 licenses. The desk's PERSON problem is therefore **not** a role-word problem; it is an INDEFINITE-PERSON problem (`somebody`, `whoever`, `nobody whose job that is`), which §8 lists.

### 3.9 AGGREGATE LABELS THAT ARE NOT BODIES — the class that causes the trouble

A band, a score band or a status label is computed FROM bodies and refers to NONE of them. The desk has more of these than it has body reads.

| Label vocabulary | Members | Definition (file:line) | Pools | Layer |
|---|---|---|---|---|
| per-arm badge | `STRONG ≥65 · ADEQUATE ≥40 · WEAK ≥20 · CRITICAL <20` | `defenseScoreBands.js:38-39` | DS-DEF-1 ×4, DS-DEF-2 `Economic Survival` ×4, DS-DEF-10 ×4 | **aggregate — no referent body** |
| overall readiness | `Fortress … Undefended` (six) | `defenseGenerator.js:515-521` | DS-DEF-10 ×2 | aggregate |
| safety label | `Very Safe … Dangerous` (five) + compound overrides | `safetyProfile.js:253-305`, overrides `:227-249` | DS-DEF-3 ×7 | aggregate — **the engine's own prose for it derives a body word (§3.7)** |
| criminal structure | `organized · semi-organized · diffuse · null` | `defenseDisplay.js:183-195` | DS-DEF-4 ×4 | aggregate over NAMES — `null` means *not recognized*, never *no crime* (annex fence `RECEIPT_POOLS_DOSSIER_STATE.md:2804-2805`) |
| capture rung | `none · adversarial · equilibrium · corrupted · capture` | `rulingStructure.js:797`; ladder `factionCapture.js:137` | DS-DEF-4 ×5 | **POWER, not aggregate** |
| military posture | fifteen | `defenseDisplay.js:25-41` | DS-DEF-10 ×15 (dark) | aggregate over stress types |
| live readiness band | `surplus … collapsed` | `causalState.js:423-427`, `:444-449` | DS-DEF-7 ×5 (dark) | aggregate |
| supporting-capability status | `Well-funded`/`Adequate`/… | `defenseDisplay.js:219`, `:225`, `:231`, `:237`, `:243`, `:259` | DS-DEF-6 ×21 | aggregate |

---

## §4 THE DESK'S READS, SORTED BY THE LAYER THEY RESOLVE

### 4.1 BODY READS — the read resolves an institution row or a bucket

| Pool | Read (census) | Bucket(s) reached | Holder kind |
|---|---|---|---|
| DS-DEF-5 `walls PRESENT` / `ABSENT` | `forces.walls.present` | walls | muster |
| DS-DEF-5 `garrison PRESENT` | `forces.garrison.present` | garrison | muster |
| DS-DEF-5 `militia PRESENT (no garrison)` | `forces.garrison.present ; forces.militia.present` | garrison, militia | muster |
| DS-DEF-5 `watch PRESENT` | `forces.garrison.present ; forces.militia.present ; forces.watch.present` | garrison, militia, **watch** | **muster + watch (two-source)** |
| DS-DEF-5 `NO organized force at all` | same four | garrison, militia, watch | **muster + watch (two-source)** |
| DS-DEF-5 `mercenary … PRESENT` | `forces.mercenary.present` | mercenary | muster |
| DS-DEF-5 `charter hall PRESENT` / `ABSENT …` | `forces.charter.present` | charter | muster |
| DS-DEF-11 ×5 | `forces.walls.present` (+ threat / gate / tier) | walls | muster (+road ×2) |

### 4.2 AGGREGATE-OVER-BODIES READS — a situation KEY computed from two or three buckets

| Pool family | Key function (file:line) | Arguments as passed at the call site | Buckets actually consulted |
|---|---|---|---|
| DS-DEF-2 `Beasts & Monsters` ×7 | `beastsRowSituation` `defenseStateProse.js:429-440`; key `beastsRowPoolKey` `:447-451` | `(monsterThreat, walls, garrison \|\| militia)` — **`defenseStateProse.js:655`** | walls · garrison · militia. **NOT watch, NOT mercenary, NOT charter.** |
| DS-DEF-2 `Invasion & War` ×6 | `invasionRowSituation` `:476-484`; key `:489-491` | `(walls, garrison, militia)` — `:656` | walls · garrison · militia. **Garrison outranks militia** (`:481-483`). |
| DS-DEF-2 `Internal Security` ×4 | `internalRowPoolKey` | `(civicFlag(compound.hasCourtSystem), civicFlag(compound.hasPrison))` `:657-659` | court flag · prison flag — **and `hasCourtSystem` is satisfied by a town hall** (`priorityHelpers.js:55`) |
| DS-DEF-2 `Disasters & Famine` ×5 | `disasterRowPoolKey` | `(hasGranary, hasHospital, hasChurch)` `:661-663` | granary · hospital(+monastery/healer/friary) · church |
| DS-DEF-6 `Logistics & Supply` ×5 | `SUPPLY_LOGISTICS_ROW_POOL` | `supplyLogisticsSituation(granary, port, access)` | granary · port · tradeAccess |
| DS-DEF-6 `Naval Defense` ×3 | `navalDefensePoolKey` | `blockaded ; navy ; port` | **`hasNavy` matches zero shipped rows** (`priorityHelpers.js:62`) |

**Why this class matters to the law:** an aggregate read licenses a claim about the KEY, not about any body inside it. DS-DEF-2's `plagued, perimeter without force` says *force is false* — it does not say WHICH body is absent, and it never consulted the watch at all.

### 4.3 STANDING READS — a power over an organ

| Pool | Read | The standing | Face licensed (see §7) |
|---|---|---|---|
| DS-DEF-4 `capture none` | `text(captureState)` | rung 0 of the ladder | player |
| DS-DEF-4 `capture adversarial` | `text(captureState)` | rung 1 | player |
| DS-DEF-4 `capture equilibrium` | `text(captureState)` | rung 2 | player |
| DS-DEF-4 `capture corrupted` | `text(captureState)` | rung 3 | **DM** — every variant `dm-only` (`RECEIPT_POOLS_DOSSIER_STATE.md:2850-2853`) |
| DS-DEF-4 `capture capture` | `text(captureState)` | rung 4 | **DM** — every variant `dm-only` (`:2855-2858`) |
| *(unlanded)* `watch: bought (revealed)` | a corruption impairment, `covert !== true` | public scandal | player + DM |
| *(unlanded)* `watch: bought (covert)` | a corruption impairment, `covert === true` | the hidden channel | **DM only** |

`INTERESTED` is defined at `holderTable.js:90`; the four organs it reaches at `:115`; the ground for the four at `:93-114`.

### 4.4 ROLE READS

**None.** Measured: no DS-DEF census row reads a role, an office or an NPC field; `COLUMN_SOURCES.holderRole` is `read: false` with `basis: 'absent'` (`institutionTable.js:129-138`, `:503-508`).

---

## §5 THE ENGINE'S OWN OVERLAPS (law item 5: a wiring fact, never a writer's choice)

| # | The overlap | Rows (file:line) | Consequence for a face |
|---|---|---|---|
| O-1 | **`professional city watch` is in the GARRISON bucket and the WATCH bucket** | `defenseInstitutionBuckets.js:90` and `:97` | one institution makes both `forces.garrison.present` and `forces.watch.present` true; "the garrison" and "the watch" can be the same building |
| O-2 | **The WATCH bucket is not in the MUSTER kind** | muster tokens `holderTable.js:188-192`; the `watch` token is its own kind `:202-209` | a pay/upkeep read (`muster`) does not reach the watch bucket — the case ADDENDUM 11 item 5 names |
| O-3 | **`hasWalls` is plural, the bucket key is singular** | `priorityHelpers.js:52` (`'walls'`) vs `defenseInstitutionBuckets.js:85` (`'wall'`) | two tables classify the same rows by different keys; the annex's own restated hazard (`RECEIPT_POOLS_DOSSIER_STATE.md:3241-3245`) |
| O-4 | **`hasMercenary` catches four rows the mercenary BUCKET does not** | `priorityHelpers.js:49` adds `hireling hall`, `free company hall`, `veteran's lodge` | a town can be `hasMercenary` with an empty bucket; DS-DEF-5 reads the bucket, DS-DEF-2/6 read the flag |
| O-5 | **`hireling hall` is in BOTH `hasMercenary` and `hasCharterHall`** | `priorityHelpers.js:49`, `:51` | one row, two capabilities |
| O-6 | **`hasCourtSystem` is satisfied by `town hall` / `city hall`, both `required:true`** | `priorityHelpers.js:55` | "the court" on an Internal Security read may be a town hall |
| O-7 | **`hasHospital` catches `monastery`, `healer`, `friary`; `hasChurch` catches the same two** | `priorityHelpers.js:64`, `:65` | "hospital present" and "clergy care" can be one friary |
| O-8 | **`hasNavy` matches zero shipped catalogue rows** | `priorityHelpers.js:62` | DS-DEF-6's `Naval Defense: Naval force` pool is unreachable in the shipped roster |
| O-9 | **`hasMilitaryInst` excludes Palisade, Palisade-or-earthworks and Gates-if-walled** | `priorityHelpers.js:45` (no `palisade` / `earthwork`) | a palisaded thorp is `hasWalls` and not `hasMilitaryInst`, so `guardEffectivenessDesc` is never built for it (`safetyProfile.js:319`) |
| O-10 | **`corruption.js`'s SECURITY set is a THIRD vocabulary** — `watch\|garrison\|constab\|guard\|magistrate\|court\|barracks` | `corruption.js:630` | it matches on the **raw** `inst.name` (`:666`), reaches `court` (a state organ) and `constab` (in no other table), and misses walls/militia/mercenary/charter entirely |
| O-11 | **The criminal-structure classifier reads raw `i.name`, not `nativeSemanticName`** | `defenseDisplay.js:183-195` vs `defenseInstitutionBuckets.js:138` | the two classifications of one roster use different name accessors |
| O-12 | **Four bucket keywords match no shipped row** — `inner citadel`, `massive walls` (as a distinct row), `professional guard`, `hired muscle`, `adventurers' guild hall` | `defenseInstitutionBuckets.js:85`, `:87`, `:89`, `:100`, `:102`; the module says so itself `:76-80` | a writer reading the bucket list sees bodies the world never builds |

---

## §6 THE TYPED SLOTS THAT NAME THE POWER

| Slot | Shape | Declared on | Named by variants | Filled by a call site | Census `slotsFilled` | Verdict |
|---|---|---|---|---|---|---|
| `{seat}` | proper | DS-DEF-4 (`RECEIPT_POOLS_DOSSIER_STATE.md:2800`) | **5 pools** (capture ×5) | **YES** — `seat: properFill(text(power.government))` at `defenseStateProse.js:962` | `['settlement']` only | **the desk's one working power slot — but the card says it is never filled** (§9 W-2) |
| `{faction}` | proper | DS-DEF-3 `:2737`, DS-DEF-4 `:2800`, DS-DEF-5 `:2870` | **0** | **NO** — no `faction` fill anywhere on the leaf | — | declared, unused, unwired |
| `{npc}` | proper | DS-DEF-4 `:2800` | **0** | **NO** | — | declared; the block's own fence forbids it (`:2809-2810`) |
| `{counterpart}` | proper | DS-DEF-1 `:2508`, 5 `:2870`, 6 `:2950`, 7, 8, 10 | 3 rows name it | **NO** at this tip | — | the besieger/occupier name; lives in `warStatus.js:283-298`, `occupationStatus.js:74-76` |
| `{institution}` | proper | DS-DEF-6 `:2950`, DS-DEF-9 `:3197` | **1 row** (DS-DEF-6 `Clergy care` v2, `:3018`) | **NO** | — | a body-naming slot with no provider |
| `{defwork}` | bare-common | DS-DEF-11 `:5967` | 3 pools | **YES** — `defwork: defworkFill(forces)` at `defenseStateProse.js:1084` | `['settlement']` only | the desk's one working BODY slot (§9 W-2) |

**The class word where no slot exists.** For the ruling power the engine offers `{seat}` and nothing else; the always-safe class word is **the ruling structure** / **the seat**. For the criminal power there is NO typed slot on this desk at all — `deriveCriminalStructure` yields a structure key, never a name — so the always-safe word is the class word **the criminal interest**, and any proper-looking noun ("the syndicate", "the operators", "its syndicate") is authored, not recorded.

---

## §7 VISIBILITY — WHICH FACE MAY NAME EACH STANDING READ

The engine carries **three separate visibility mechanisms**, and only one of them is derived. All three are measured below.

| # | Mechanism | Where it is typed (file:line) | What it says | State on the defense desk |
|---|---|---|---|---|
| V-1 | **`COVERT_SOURCES`** — a READ-PATH list | `wiringCensus.js:1253-1260`; `isCovertPath` `:1265-1269`; applied `row.covert = row.reads.some(isCovertPath)` `:1681` | a pool whose read is `compromisedSecurityInstitutions`, `npc.corrupt`, `corruptNpc`, `impairment.covert`, `mobilization.covert`, `blocs.covert`, or any chain with a `covert` segment, is covert by derivation | **ZERO of 126 DS-DEF rows.** Every card prints `covert: no`. The desk has no covert-by-path pool at this tip. |
| V-2 | **the `dm-only` VARIANT MARK** — authored in the angle tag | annex grammar `scripts/lib/dossier-annex-grammar.mjs:372-375`; card `scripts/lib/prose-licence-card.mjs:377`, `:406`, `:410`; kernel filter `entryWalker.js:1021-1022`; unit truncation `composedWalker.js:173` | one `dm-only` piece truncates the WHOLE composed unit on the player page | **7 variants of 383.** DS-DEF-4 `capture corrupted` ×3 (`:2851-2853`) and `capture capture` ×3 (`:2856-2858`), plus DS-DEF-6 `Naval Defense: Under blockade` v4 (`:3065`). |
| V-3 | **arm A13's INTERESTED rule** — the only DERIVED gate | `composedWalker.js:1076-1080` | *"the holder of this record is a power with an interest in it, so the citing face is the DM's and carries the dm-only mark"* — a **FAIL** when `held.standing !== 'LICENSED'` and the piece lacks `dm-only` | fires only when `provenanceCount(piece.text) > 0` (`composedWalker.js:1060`), i.e. **only when the face CITES the holder** |

### 7.1 The face licensed for each standing read of this desk

| Read | Standing | Gate that decides | Player face | DM face |
|---|---|---|---|---|
| DS-DEF-4 `capture none` / `adversarial` / `equilibrium` | POWER, rungs 0-2 | authored (no mark) | **licensed** | licensed |
| DS-DEF-4 `capture corrupted` / `capture` | POWER, rungs 3-4 | **authored `dm-only`** (`:2850`, `:2855`), backed by the block fence *"Capture at `corrupted` and above is covert content — the town does not know, and the page that says so is the DM's"* (`:2805-2809`) | **refused** (unit truncated, `composedWalker.js:173`) | **licensed** |
| DS-DEF-5 `watch PRESENT` — the fact | BODY presence, `muster + watch`, `LICENSED` | none | licensed | licensed |
| DS-DEF-5 `watch PRESENT` — **a CITATION of the holder** | the watch is a STATE ORGAN, INTERESTED where the town is captured (`holderTable.js:115`, card line) | **V-3** | **licensed only while the town is not captured**; where it is, a citing player face is a FAIL | licensed with `dm-only` |
| DS-DEF-8 `viability threatened` / `intact` — a CITATION | `treasury`, a STATE ORGAN | **V-3** | same conditional | licensed with `dm-only` |
| DS-DEF-6 `Under blockade` v4 | `toll-bar`, `LICENSED`, **not** a state organ, `covert: no` | **authored `dm-only`** — for the magical bypass channel, not for a holder | refused | licensed |
| *(unlanded)* `watch: bought (revealed)` | corruption impairment, `covert !== true` ⇒ `revealed` (`corruption.js:679`) | V-1 would fire if the read names `compromisedSecurityInstitutions` | **a public scandal — both faces** | licensed |
| *(unlanded)* `watch: bought (covert)` | `covert === true` ⇒ `covert` (`corruption.js:680`) | V-1 | **refused** | **the DM pen line** |

### 7.2 The three findings the chair should see together

1. **Visibility on this desk is AUTHORED, not derived.** Six of the seven `dm-only` marks sit on DS-DEF-4, whose census standing is `SOURCE-UNRESOLVED` — so V-3 could never have produced them, and V-1 reads zero. The seventh (`Under blockade` v4) is marked for content reasons on a `LICENSED`, non-organ, non-covert row. **Nothing in the engine today would have caught the absence of any of these marks.**
2. **V-3 gates the CITATION, not the CLAIM.** An INTERESTED holder does not silence the fact; it silences *naming the record's keeper* on the player page. A player face may say the watch is present in a captured town; it may not say *"the watch's own rolls say so"*.
3. **The two unlanded pools of §0.1 are the first pools on this desk where V-1 would actually fire**, because they are the first to read the corruption path. The law ratified here decides how they are written.

---

## §8 FINDINGS — SHIPPED ANNEX ROWS USING A WORD AT THE WRONG LAYER FOR ITS READ

Every row below is a quotation of ≤12 words from the shipped annex at `f2da5a3ee`, with the read it sits on and the engine row that decides the layer. **These are findings for the chair, not rulings.**

### 8.1 THE WATCH ON A READ THAT DOES NOT REACH THE WATCH BUCKET

| # | Annex line | Quote (≤12 words) | The read | Why the layer is wrong |
|---|---|---|---|---|
| **F-1** | `:5982` DS-DEF-11 `WALLED-STRAINED` v1 | "stands better than the watch that should man it" | `economicGates.military < 1` — the **pay gate**; card source `muster · LICENSED` | The MUSTER kind is `walls · garrison · militia · mercenary · charter` (`holderTable.js:188-192`); **the watch bucket is not in it** (`:202-209`). This is the exact case ADDENDUM 11 item 5 names. Its sibling v2 (`:5983`) says "the muster behind it is thinning" — **the same pool contains the right word and the wrong one.** |
| **F-2** | `:2752`, `:2755`, `:2766`, `:2769`, `:2771`, `:2774`, `:2780`, `:2781` DS-DEF-3 (8 rows) | "The watch at {settlement} has been overwhelmed" (`:2774`) | `publicOrderSituation(safetyLabel)` — an **aggregate label**; card source `(none) · SOURCE-UNRESOLVED` | The pool reads no bucket. **`forces.watch.present` is read by DS-DEF-5 and by no other pool on the desk.** A `Dangerous` town with no watch-bucket institution renders a watch that does not exist. The engine's own prose for this exact label derives the word by flag precedence and falls back to *"law enforcement"* / *"Local enforcement"* / *"no meaningful guard presence"* (`safetyProfile.js:272`, `:281`, `:300`) — §3.7. The same block's better rows say **"Enforcement at {settlement}…"** (`:2754`, `:2759`, `:2764`), which names the function and not a body. |
| **F-3** | `:2603` DS-DEF-2 `plagued, perimeter but NO force` v3 | "doing less each season as the watch thins" | `beastsRowSituation(family, perimeter, force)` where `force = garrison \|\| militia` at **`defenseStateProse.js:655`** | Doubly wrong: the read's force term **excludes the watch bucket**, and the selected branch asserts force is **false** — so the sentence narrates the thinning of a body the branch says is absent, using a word the read never consulted. |
| **F-4** | `:2662` DS-DEF-2 `Internal Security: full legal chain` v2 | "rely on that rather than on the watch's temper" | `court ; prison` (`defenseStateProse.js:657-659`) | A court/prison flag read; no force bucket is consulted. "The watch" here is a body imported from another block's reads. |
| **F-5** | `:2818` DS-DEF-4 `structure organized` v4 | "it is not the watch's doing" (and "than the watch could") | `key` → `CRIMINAL_STRUCTURE_POOL`; card `(none) · SOURCE-UNRESOLVED` | A classification over institution NAMES (`defenseDisplay.js:183-195`). The pool reads no defence bucket at all, so the presence of a watch is asserted from nothing. |

### 8.2 A PERSON AS THE REFERENT OR THE AGENT

`COLUMN_SOURCES.holderRole` is null on every row (`institutionTable.js:457`, basis `absent` `:503-508`); the engine licenses **the role noun only** (`:455-456`).

| # | Annex line | Quote (≤12 words) | The read | Note |
|---|---|---|---|---|
| **F-6** | `:2851` DS-DEF-4 `capture corrupted` v1 `[ledger · dm-only]` | "Somebody at the {seat} of {settlement} is carrying a leash" | `text(captureState) === corrupted` | An **unnamed person is the subject** of a POWER read. The block's own fence says *"Never name the compromised person as a target; the leash is the state, not a fate"* (`:2809-2810`) — the row honours the letter (no name) and not the layer (a person acts). |
| **F-7** | `:2895` DS-DEF-5 `garrison PRESENT` v3 | "counted at the gate by somebody whose job that is" | `forces.garrison.present` | A person is the **agent** on a bare presence read; and "the gate" imports the walls bucket, which this pool does not read. |
| **F-8** | `:3002` DS-DEF-6 `Legal Infrastructure: Prison only` v1 | "depends on who is holding the keys" | `hasPrison` (WIRING-UNRESOLVED) | A person as the determinant of an institutional fact. |
| **F-9** | `:3004` DS-DEF-6 `Prison only` v3 | "drifts with whoever is doing the holding" | same | same |
| **F-10** | `:3009` DS-DEF-6 `Legal Infrastructure: None` v3 | "as far as somebody willing to enforce it is standing" | absence of court+prison | same |
| **F-11** | `:2984` DS-DEF-6 `Magical Capability: Arcane support` v3 | "is somebody's charge rather than nobody's" | `hasMagicInst` (WIRING-UNRESOLVED) | same |
| **F-12** | `:2775` DS-DEF-3 `Dangerous` v2 | "does not run through somebody's permission" | the safety label | a person as the holder of a permission the engine does not model |
| **F-13** | `:2760` DS-DEF-3 `Safe` v3 | "the comfort has somebody maintaining it" | the safety label | same |
| **F-14** | `:2766` DS-DEF-3 `Moderate` v4 `[threshold]` | "A thinner watch or a bolder operator would show up" | the safety label | a person ("a bolder operator") as a counterfactual agent, beside F-2's watch |
| **F-15** | `:2692` DS-DEF-2 `Economic Survival: WEAK` v2 | "The people who would have to hold {settlement} … are already owed" | `scoreBand(economicScore)` | an aggregate band read narrated through unindividuated persons with a debt relation no field computes |

### 8.3 A FUSED AGENT — a relation no field computes

| # | Annex line | Quote (≤12 words) | The read | Note |
|---|---|---|---|---|
| **F-16** | `:2900` DS-DEF-5 `militia PRESENT (no garrison)` v3 | "the town has decided that arming itself when needed costs less" | `forces.militia.present` + `forces.garrison.present` | A **decision** attributed to the town. No field records a defence choice; the card's `may NOT` already forbids "a cause". |
| **F-17** | `:2924` DS-DEF-5 `charter hall ABSENT …` v2 | "what stands between the town and one is the cost" | `forces.charter.present === false` | a cause fused to a collective agent |
| **F-18** | `:2915` DS-DEF-5 `mercenary … PRESENT` v3 | "an end … the town has not yet had to think about" | `forces.mercenary.present` | the town as a thinking agent, plus a future |
| **F-19** | `:2857` DS-DEF-4 `capture capture` v2 `[dm-only]` | "the town is being administered by its syndicate" | rung 4 | **"its syndicate"** asserts a possession relation between the town and an untyped power; no faction slot is filled anywhere on this desk (§6) |
| **F-20** | `:2842` DS-DEF-4 `capture adversarial` v2 | "The hall … moves against the operators and the operators move back" | rung 1 | two untyped agents in a reciprocal relation the ladder does not record; see also F-22 |
| **F-21** | `:2668` DS-DEF-2 `Internal Security: court without detention` v3 | "the town's courts are spending down a reputation" | `court ; prison` | a body as an economic agent spending an unmodelled quantity |

### 8.4 THE POWER NAMED BY A BAKED NOUN INSTEAD OF ITS TYPED SLOT

`{seat}` is the desk's only typed power slot and it is filled (`defenseStateProse.js:962`).

| # | Annex line | Quote (≤12 words) | The read | Note |
|---|---|---|---|---|
| **F-22** | `:2836`, `:2837`, `:2838`, `:2842`, `:2843`, `:2852`, `:2856`, `:2858` DS-DEF-4 (8 rows) | "the hall's decisions are the hall's" (`:2836`) | the capture ladder ×5 | **"the hall" is a baked common noun for the power that `{seat}` types.** The same pools use `{seat}` correctly in their first clause and then fall to "the hall" for every later mention — `capture none` v1 (`:2836`) does both in one sentence. |
| **F-23** | `:3213` DS-DEF-9 `magicDependency true` v3 | "a falling-out with the hall" | `settlement.defenseProfile.magicDependency`; card `muster · LICENSED` | **DS-DEF-9's SLOTS line declares no `{seat}`** (`:3197`: `{settlement}` `{good}` `{band}` `{institution}`) and the pool reads no power field. The ruling structure is named here with neither a slot nor a read. |

### 8.5 A BODY ASSERTED FROM AN AGGREGATE THAT DOES NOT CARRY IT

| # | Annex line | Quote (≤12 words) | The read | Note |
|---|---|---|---|---|
| **F-24** | `:2538` DS-DEF-1 `readiness WEAK` v2 | "how much of the perimeter has nobody on it" | `scoreBand(readinessScore)` — a five-arm summary; card `(none) · SOURCE-UNRESOLVED` | the block's own fence says the readiness word "asserts nothing about any one of them" (`:2510-2511`); the row asserts a perimeter AND its manning |
| **F-25** | `:2681` DS-DEF-2 `Economic Survival: STRONG` v1 | "the garrison can be kept paid while they last" | `scoreBand(economicScore)` | a named body on an economic band read that consults no bucket |

### 8.6 ROWS THE SURVEY CHECKED AND FOUND AT THE RIGHT LAYER (recorded so the chair can see the contrast)

| Annex line | Quote | Why it is right |
|---|---|---|
| `:5983` DS-DEF-11 `WALLED-STRAINED` v2 | "the muster behind it is thinning" | **the muster** is the class word for exactly the kind this pool's holder resolves |
| `:2759` DS-DEF-3 `Safe` v2 | "Enforcement at {settlement} is clearly the stronger side" | names the FUNCTION, not a body — the same move the engine makes at `safetyProfile.js:281` |
| `:2836` DS-DEF-4 `capture none` v1, first clause | "Nothing criminal has reached the {seat} at {settlement}" | the power named through its typed slot, the organ as the OBJECT |
| `:2977` DS-DEF-6 `Economic Backing: Critical` v1 | "{settlement} cannot sustain armed forces at all" | a muster-grain pay read with a muster-grain body word |
| `:2905` DS-DEF-5 `watch PRESENT` v3 | "is looked at rather than stopped, and the looking is systematic" | agentless passive — no person is made the agent of a presence read |

---

## §9 WIRING ROWS AND OPEN QUESTIONS (raised, not decided)

| # | The row | Evidence (file:line) | Why the chair needs it before ratifying |
|---|---|---|---|
| **W-1** | **The two reads that belong to the WATCH-as-order-organ both land SOURCE-UNRESOLVED, because the census reads a derived local token, not the holder-table field token.** | `holderTable.js:211` maps **`criminalCaptureState`** → watch, but DS-DEF-4's census read is `text(captureState)`. `holderTable.js:212` maps **`safetyProfile`** → watch, but DS-DEF-3's census read is `publicOrderSituation(safetyLabel)`. Both pools print `source: (none) · SOURCE-UNRESOLVED` on the card. | The card cannot print the ORGAN layer for exactly the five pools where the organ layer is the whole subject. A referent law whose instrument is the card is unenforceable on DS-DEF-3 and DS-DEF-4 until this is bridged. `fieldSynonyms` already carries `eco.safetyProfile.blackMarketCapture → [roll, rolls, watch]`, so the bridge mechanism exists. |
| **W-2** | **The census reports `{seat}` and `{defwork}` as NAMED BUT NEVER FILLED, while both entry points do fill them.** | `slotsFilled: ['settlement']` on all five DS-DEF-4 rows and all five DS-DEF-11 rows; but `seat: properFill(text(power.government))` at `defenseStateProse.js:962` and `defwork: defworkFill(forces)` at `:1084`. The per-site refinement is keyed on the key FUNCTION at `wiringCensus.js:604-608`. | A writer reading the card is told the one typed slot that may name the power is never filled — which is a standing invitation to bake "the hall" (F-22). Either the refinement under-reports or the fill does not reach the pool; both are register-car work. |
| **W-3** | **`{faction}` is declared on three defense blocks, named by zero variants, filled by no call site.** | declared on DS-DEF-3/4/5 SLOTS lines; `grep -n "faction:\|factionFill\|governingName" defenseStateProse.js` returns nothing | If the law says the power is named "only through the typed slot the engine records", this desk has exactly one such slot (`{seat}`) and it reaches only DS-DEF-4. Everything else must use a class word. |
| **W-4** | **The `magicDef` bucket exists and DS-DEF-5's arcane pools do not read it.** | bucket `defenseInstitutionBuckets.js:105-108`; DS-DEF-5 `arcane defense` census read is `magicWorks`, `source: (none)` | the desk's seventh body bucket is unwired to the one pool family about it |
| **W-5** | **No DS-DEF read touches the corruption path, so V-1 (`COVERT_SOURCES`) reads zero across the desk.** | `wiringCensus.js:1253-1260`, `:1681`; measured `covert: true` rows = 0 of 126 | the desk's visibility is entirely authored (§7.2). The first derived-covert pools arrive with the §0.1 taste rows. |
| **W-6** | **Three name-accessor vocabularies classify one roster.** | `nativeSemanticName` (`defenseInstitutionBuckets.js:138`), `nativeSemanticNames` lowercased (`priorityHelpers.js:41-43`), raw `i.name` (`defenseDisplay.js:185`), plus `String(inst?.name)` in corruption (`corruption.js:666`) | which bodies a face may name depends on which accessor its read used; a referent law stated over "the institution row" is under-specified until the chair knows there are four readers of that row |
| **W-7** | **DS-DEF-1's own fence routes `guardEffectivenessDesc` to DS-DEF-3; the code routes it to DS-DEF-1.** | fence: *"`guardEffectivenessDesc` is engine prose about the watch and belongs in the public-order shape (`DS-DEF-3`)"* (`RECEIPT_POOLS_DOSSIER_STATE.md:2515-2516`); code: `DM_FIELD_FRAMED_BY_BLOCK['DS-DEF-1'] === 'economicState.safetyProfile.guardEffectivenessDesc'` (`defenseStateProse.js:799`, `:825`) | the annex sends the desk's only engine-authored watch prose to the block that has no read for it, and DS-DEF-3 then bakes "the watch" with no field at all (F-2). This is the mechanism behind the desk's largest finding. |
| **W-8** | **An engine string beside the desk's own prose bakes a body word the corpus is being asked not to bake.** | `safetyProfile.js:277`, `:284`, `:291`, `:302`, `:313`, `:337-345` render `${lawRef}` into `safetyDesc` / `guardEffectivenessDesc`, printed next to the DS-DEF-1 and DS-DEF-3 cells | the engine derives its word correctly (§3.7), but it still SHIPS a sentence naming a body; a law binding only the corpus leaves the two surfaces speaking at different grains on the same page |

---

## §10 WHAT THE DESK'S EVIDENCE SAYS ABOUT THE LAW AS DRAFTED (observations, no ruling)

1. **Item 1 (the layer of the read fixes the referent) is the right cut for this desk, and the desk supplies its own proof:** DS-DEF-11 `WALLED-STRAINED` holds both spellings in one pool — v1's "the watch" (F-1) and v2's "the muster" — on identical reads.
2. **Item 5 (the alias overlap is a wiring fact) understates the problem by a factor.** The addendum names one overlap; the desk carries twelve (§5), including three separate name accessors and a `hasCourtSystem` that fires on a town hall.
3. **The law's PERSON prohibition will do most of its work on INDEFINITE persons, not roles.** The desk names zero offices in 383 variants (§3.8) and ten indefinite persons (§8.2).
4. **A ROLE clause in the law costs this desk nothing today** — it has no role read — but `practitioner(s)` in DS-DEF-9 is already written in the standing-condition form the law licenses, so a ratified rule would confirm seven shipped rows rather than move them.
5. **Item 4 (visibility follows the power layer) describes a mechanism the desk does not yet have.** Today six of seven `dm-only` marks sit on a pool whose standing is `SOURCE-UNRESOLVED`, so the derived gate (V-3) never fired and could not have. The law is forward-looking here, and W-1 is what would make it enforceable.
6. **The two unlanded pools of §0.1 are the first real test of every clause.** They carry a corruption impairment on a security body, they split on `covert`, and they are named "watch" — the one word this engine splits in two.

---

*Prepared by the Opus surveyor, defense desk. Dock read-only at `f2da5a3ee`; no file in the dock was modified, staged or committed; no vitest, npm or build was run. Every cite above was re-derived in the dock at this tip.*
