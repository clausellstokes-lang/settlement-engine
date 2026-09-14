# REFERENT SURVEY — THE POWER DESK (DS-POW-1 … DS-POW-7)

**The question (brief ADDENDUM 11, THE REFERENT LAW).** For every institution-class noun and
every role word this desk can render: which LAYER the engine gives it (BODY / HOLDER-ORGAN /
POWER / ROLE), which reads resolve to each layer, the engine's own overlaps, the typed slot
that names the power, and the always-safe class word. **A research packet. It decides nothing;
the chair does.**

**Dock:** `laneRW-DEFW` at `f2da5a3ee`, read-only. Nothing was modified, staged or committed.
The only executable runs were `scripts/prose-licence-card.mjs` (15 cards, §3) and three
`node -e` printing probes over the committed census, the generated leaf and two pure helpers.
No vitest, no build. **Every file:line below was re-derived in this tree**; where ADDENDUM 11's
own cite points elsewhere, the correction is stated in §9.

**Sister packet:** `rewrite/entailment/power.survey.md` (the ENTAILMENT question — what a word
MEANS). Its noun inventory is used here; its entailment rows are **not** repeated.

> ⚠ **THIS FILE SUPERSEDES a same-named packet written at 05:33** (preserved as
> `power.referent.survey.SUPERSEDED-0533.md`). Two of its desk figures are wrong against the
> leaf (DS-POW-1 has **41** variants, not 43; DS-POW-7 has **60**, not 58 — §1), and its §0
> block table is otherwise re-derived and agrees. Its findings F-16/F-17/F-18 are re-derived
> here as R-2, R-9 and R-6 with the cites corrected.

---

## §0 THE DESK, DERIVED AND NOT GUESSED

The brief forbids guessing the block prefix set. Two independent registers agree:

| Register | What it says | file:line |
|---|---|---|
| The wave gate's section table | `power: DOSSIER_STATE_PROSE_POWER` — **a leaf IS a section**, so the six leaves partition the corpus by construction | `scripts/prose-wave-gate.mjs:294` (`SECTION_LEAVES`), `:298` (the power row) |
| Why it is a leaf and not a prefix list | the first cut was hand-written, put two prefixes on the wrong desk and left DS-POP on none — 29 of 708 pools reachable from no section | `prose-wave-gate.mjs:279-290` |
| The projector's DESKS table | `{ file: 'power', constant: 'DOSSIER_STATE_PROSE_POWER', prefixes: ['DS-POW-'] }` | `scripts/generate-dossier-state-prose.mjs:109` |
| The partition, asserted rather than trusted | `sectionsCoverEveryPool()` | `prose-wave-gate.mjs:307-331` |

**The power desk is the `DS-POW-` prefix, and exactly that: seven blocks.**

---

## §1 THE DESK, MEASURED (printed from the leaf and the committed census, not transcribed)

| Block | Title (annex) | Pools | Variants | dm-only | RESOLVED | LICENSED | Annex |
|---|---|---|---|---|---|---|---|
| DS-POW-1 | Public legitimacy banner | 11 | 41 | 1 | 1 | 1 | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:1915` |
| DS-POW-2 | Stability + governing authority header | 9 | 31 | 0 | 8 | 2 | `:1998` |
| DS-POW-3 | The Ladder | 5 | 16 | 0 | 5 | 0 | `:2069` |
| DS-POW-4 | Rule and succession | 9 | 29 | 0 | 7 | 3 | `:2116` |
| DS-POW-5 | Ruling structure + the ruling-power lens | 12 | 40 | 3 | 1 | 1 | `:2186` |
| DS-POW-6 | Legitimacy / capture / safety ladder cells | 13 | 39 | 12 | 7 | 5 | `:2276` |
| DS-POW-7 | Blocs, coalitions, the divided court | 20 | 60 | 13 | 2 | 2 | `:2366` |
| **desk** | | **79** | **256** | **29** | **31** | **14** | |

Source-holder standing over the 79 census rows (`docs/content/wiring-census.json`):
**LICENSED 14 · SOURCE-UNRESOLVED 65 · INTERESTED 0 · `covert` flag true 0.**
Every LICENSED row resolves to a **state organ**: `court` 10 · `watch` 2 · `court + watch` 2.
**No row on this desk resolves to `muster`, `elders`, `office`, `market`, `treasury`, `parish`,
`toll-bar`, `census`, `road` or `tradition`.**

### ⛔ THE STRUCTURAL FACT THAT GOVERNS EVERY ROW BELOW

**No pool of this desk reads `settlement.institutions[]`, any defense bucket, any impairment,
any patron or any per-faction `captureState`.** Measured: a regex over the `reads` and
`fieldsRead` of all 79 rows for `institution|impair|patron|corrupt|forces|walls|garrison|
militia|watch|muster|charter|mercenary` returns **zero hits**. The desk's whole vocabulary of
reads is twenty-two expressions:

```
breakdown · breakdown.prosperity · breakdown.safety · factions · factions.length
first (via STABILITY_LADDER in powerStateProse.js) · label (via RISK_POOL_OF in powerStateProse.js)
ledger · ledger.present · legitimacy · legitimacy.breakdown · legitimacy.govMultiplier
legitimacy.governanceFractured · name · politics.blocs · power.criminalCaptureState
power.recentConflict · power.stability · reading.instability · reading.rungs
reading.rungs.length · reading.rungs.map
```

So **the power desk has no BODY read of its own at all.** Every body word its shipped prose
uses today — the hall (50 occurrences), the watch (5), the walls (4), the granary, the customs,
the market, the clearinghouse, the workshops, the council, the court, the gates, the tables — is
a **baked noun with no row behind it**. The BODY layer reaches this desk only by borrowing
another desk's read, which under draft law 1 is precisely the layer error the law exists to
name. **66 of 256 shipped variants carry at least one body word.**

---

## §2 THE FOUR LAYERS, AS THE ENGINE TYPES THEM (every cite re-derived at `f2da5a3ee`)

| Layer | The engine's typed home | file:line | What the layer answers |
|---|---|---|---|
| **BODY** (bucket) | `DEFENSE_BUCKET_KEYWORDS` — substring matches over the institution's native semantic name; six defence buckets plus `magicDef` | `src/domain/institutions/defenseInstitutionBuckets.js:83` (table), `:84` walls · `:88` garrison · `:92` militia · `:95` watch · `:98` mercenary · `:101` charter · `:105` magicDef; keys exported `:116` | does this thing exist here, and what class is it |
| **BODY** (roster) | 285 authored institution rows keyed by recorded name, each with its service menu | `src/data/institutionServices.js:8` onward | the recorded member |
| **BODY** (partition) | `partitionDefenseInstitutions` / `standingDefenseForces` — RUIN-BLIND by contract | `defenseInstitutionBuckets.js:134`, `:169` | the roster as built vs. as it stands |
| **HOLDER-ORGAN** | `HOLDER_KINDS`, twelve, closed: treasury · muster · census · parish · toll-bar · market · watch · court · elders · tradition · road · office | `src/domain/prose/holderTable.js:78` | which record keeps this fact |
| **HOLDER-ORGAN** (the state's four) | `STATE_ORGAN_KINDS = office · court · treasury · watch` — the only kinds a settlement-wide capture of the ruling structure reaches | `holderTable.js:115`, with its ground `:92-114` | which organs a captured ruling structure reaches |
| **HOLDER-ORGAN** (resolution) | field → kind (`HOLDER_SOURCES`, `:164`), kind → this town's institution (`holdersOf`, `:599`, through the kind's record-keeping SERVICE names `HOLDER_RECORDS`, `:271`) | | who in THIS town keeps it |
| **POWER** (settlement-wide) | `powerStructure.criminalCaptureState` on the five-rung `CAPTURE_LADDER` (`none · adversarial · equilibrium · corrupted · capture`) | ladder `src/domain/corruption.js:474`; written `src/generators/power/rulingStructure.js:797`; computed `src/generators/factionDynamics.js:220` | is the state itself bought |
| **POWER** (per faction) | `factions[].captureState`, seeded at birth onto the GOVERNING entry only when the settlement rung is equilibrium+ | `rulingStructure.js:764-767`; world-run `src/domain/worldPulse/factionCapture.js:106-121`; rollup `:136` | which house is bought |
| **POWER** (INTERESTED) | `capturedRulingStructure` + `standingOf(..., kind)`: the four state organs become interested parties in their own records | `holderTable.js:129`, `:642`, the organ gate `:678-700`; the standing word `:90` | is the record's keeper a party to it |
| **POWER** (per institution) | a `corruption`-typed impairment on a SECURITY body; `covert !== true` ⇒ a public scandal, else the hidden channel | `corruption.js:630` (`SECURITY_INSTITUTION_RE`), `:663` (`compromisedSecurityInstitutions`), `:677-680` (the covert/revealed split) | is this one body bought, and does the town know |
| **POWER** (patron) | a brokerage house's patron, `genesis` or `captured` | `src/domain/worldPulse/brokeragePatronage.js:60`, `:202`, `:228`, `:285-295` | whose interest does this house serve |
| **POWER** (the name) | the power is a FACTION NAME or the ruling structure; `governingName` is a generated `proper` string, never a baked noun | `rulingStructure.js:787`; the ruling-power classification `src/domain/spatial/cohesionWeave.js:133`, `:171`, `:196` | who the power is |
| **ROLE** | `officesOf(settlement)` — the NPC roster's `role` and `title` nouns **plus the governing seat's designation**; an OPEN column by law | `src/domain/institutions/institutionTable.js:377-400`, `:396-398` (the seat folded into the office set); openness `:210-216` | what offices exist here |
| **PERSON** — **never a referent** | `holderRole` is a hardcoded `null` on every row: no typed NPC→institution edge exists anywhere in the estate | `institutionTable.js:457` (the null), `:129-138` (`COLUMN_SOURCES.holderRole`, `read: false`), `:215` (`OPEN_BY_LAW`), restated `holderTable.js:32-36` | — |

---

## §3 THE LICENCE CARD AS PRINTED — WHAT IT SAYS ABOUT THE LAYER TODAY

Fifteen cards were run across all seven blocks (`node scripts/prose-licence-card.mjs <block>
'<pool>'`). Their grammar is uniform and **layer-blind**:

| Card line | What it prints | Layer content |
|---|---|---|
| `reads:` | the field expressions, each with its absence class | the field, not its layer |
| `may claim:` | *"that `<field>` holds, as a STANDING fact of the record"* — identically on `governanceFractured`, `stability`, `criminalCaptureState`, `govMultiplier`, `blocs`, `rungs.length` | **no referent layer at all** |
| `may NOT:` | *a count, a cause, a season, a future, a standpoint, a second fact* (+ `another civic object of the class <X>` where T-F12 bites) | no layer clause |
| `source:` | e.g. `court · standing LICENSED · a STATE ORGAN (interested where the town is captured)` | **the one layer signal the card already prints** |
| `audience:` | `player (no mark) · marks in this pool: dm-only` | the visibility signal, from the VARIANT MARKS |
| `covert:` | `no` on **all 79 rows of this desk** | reads the census flag, which never fires here (§7) |

Cards run (all RESOLVED, spread across every block): DS-POW-1 `governanceFractured true`;
DS-POW-2 `siege matched`, `recentConflict present`, `governing faction holds a DOMINANT share`;
DS-POW-3 `clear top rung, low instability`, `shallow ladder (few rungs recorded)`; DS-POW-4
`legitimacyHold: public backing hardens the hold`, `riskLabel: Critical. The seat could fall`;
DS-POW-5 `autocrat`; DS-POW-6 `capture reached a LEADER`, `capture pressure ADVANCING`,
`neutral baseline`, `operation role criminal revenue stream (unclassified)`; DS-POW-7 `an
opposition bloc forms COVERT under an autarchy`, `layer DORMANT (no ledger materialized)`.

**The card's `source:` line is already an ORGAN-UNDER-POWER marker in everything but name.** On
this desk it is the only printed thing that distinguishes a record's keeper from the record's
subject, and ADDENDUM 11 rule 2's `BODY / ORGAN-UNDER-POWER / ROLE` tag has no printed home yet.

---

## §4 THE NOUN INVENTORY — EVERY INSTITUTION-CLASS NOUN A FACE OF THIS DESK CAN RENDER

Reading: **L** = the layers the engine gives the word. **desk reads** = which of THIS desk's
reads resolve to that layer (the answer is very often *none*, and that is the finding).

### §4.1 The bodies

| Noun | Layers the engine gives it (engine row · file:line) | Desk reads that resolve to each layer | Engine's own overlaps | Typed slot for the power | Always-safe class word |
|---|---|---|---|---|---|
| **the watch** | **BODY**: watch bucket `defenseInstitutionBuckets.js:95-97` (`town watch` · `city watch` · `professional city watch`); roster `Professional city watch` `institutionServices.js:1206`, `Town watch` `:1322` · **HOLDER-ORGAN**: `watch` kind `holderTable.js:78`, a STATE ORGAN `:115`, records `Crime reporting / Crime response / Missing persons` `:318-323`, holders measured = *Professional city watch, Town watch* · **POWER**: matched by `SECURITY_INSTITUTION_RE` `corruption.js:630`, so it can carry a `corruption` impairment, covert or revealed `:677-680` | BODY: **none** (`forces.watch.present` is DS-DEF-5's, census row `DS-DEF-5 :: watch PRESENT`) · HOLDER: `power.criminalCaptureState` (DS-POW-6 `capture reached an AGENT…`, `…a LEADER`) and `breakdown*` + `criminalCaptureState` (DS-POW-6 `capture pressure ADVANCING`, `…RECOVERING`) — 4 rows, kind `watch` / `court + watch` · POWER: **none** | `professional city watch` sits in the **garrison** bucket (`:90`) AND the **watch** bucket (`:96`); it is ALSO the watch-kind record holder (`:319` services vs `institutionServices.js:1206`); and it is ALSO a SECURITY institution (`corruption.js:630`). One name, three registers | — (the desk names no power over the watch) | at the BODY layer **the guard** (garrison bucket `:88-90`, `professional guard`); the paid military as a class is **the muster** (`holderTable.js:78`, records `:280-288`) and the watch is **not in it** |
| **the hall** | **BODY**: `Town hall` `institutionServices.js:1623`, `City hall` `:1629` (both **office**-kind holders, `holderTable.js:357-362`), plus `Guild Hall` `:55`, `Adventurers' Charter Hall` `:320`, `Free company hall` `:930`, `Hireling hall` `:1002`, `Gambling halls` `:941` · **civic class** `hall` `wiringCensus.js:1314` · **ROLE/POWER by proxy**: the desk uses it as a synonym for the `{seat}` fill | **none at any layer.** 50 occurrences across the desk, zero reads | the word is the civic class `hall` (with `council`, `charter`, `seat`, `office`, `chamber`, `moot`) — so a T-F12 attach beside any of those six is refused | `{seat}` (§5) | **the ruling structure** (class word) or the `{seat}` slot; *the hall* is unlicensed as a body on this desk |
| **the walls** | **BODY**: walls bucket `defenseInstitutionBuckets.js:84-87`; roster *Town walls · City walls and gates · Citadel · Massive walls and fortifications · Palisade or earthworks · Gates (if walled)* · **HOLDER-ORGAN**: the `walls` token maps to the **muster** kind `holderTable.js:188` · **civic class** `wall` `wiringCensus.js:1302` | **none.** 4 occurrences (DS-POW-2 `siege` v1, v4; DS-POW-6 `neutral baseline` v1; DS-POW-7 `glue threat` v1) | the `walls` field is the muster's, not a walls-kind's; `Gates (if walled)` is in the **walls** bucket AND is a **toll-bar** holder (`holderTable.js:304-308` cite) | — | the `{defwork}` slot is the **defense desk's**; this desk has no licensed spelling |
| **the gates** | **BODY**: `Gates (if walled)` matches the walls bucket (`wall` substring, `:84`); civic class `wall` (`gate`, `wiringCensus.js:1302`) · **HOLDER-ORGAN**: toll-bar (`Toll collection`, `holderTable.js:304-308`) | **none.** DS-POW-2 `siege` v2 ("the gates"), DS-POW-6 `duty evasion` v2 ("the gate") | one row in two registers (defence perimeter + toll bar) | — | none licensed here |
| **the granary** | **BODY**: `City granaries` `institutionServices.js:838` · **civic class** `storehouse` `wiringCensus.js:1321`, deliberately split from `store` `:1304-1308` · **HOLDER**: withdrawn on its own evidence — *"its only writers are a prose phrase map and a binding counter"* `holderTable.js:157-159` | **none.** DS-POW-1 `breakdown dominated by FOOD, adverse` v1 (twice in one sentence) | the word named two civic objects (the stock and the building) and the class was re-cut at REWRITE 8a-8 | — | none licensed here |
| **the customs** | **BODY**: `Customs house` `institutionServices.js:530` · **HOLDER-ORGAN**: toll-bar (`Customs brokerage`, `holderTable.js:304-308`) | **none.** DS-POW-6 `duty evasion` v1, v3 — the pool's only read is `name` | — | — | none licensed here |
| **the market** | **BODY**: `Market` `:48`, `Market square` `:1064`, `Weekly market` `:524`, `Daily markets` `:879`, `Multiple market squares` `:1132`, `Black market` `:759`, `Slave market` `:517`, `Fish market` `:920`, `Whisper market` `:1671` · **HOLDER-ORGAN**: `market` kind `holderTable.js:311-316`, holder measured = *Market square* · **civic class** `market` `wiringCensus.js:1310` | the operation-role pools read `name` (the criminal operation's own name) — DS-POW-6 `parallel marketplace`, `stolen goods market`, `criminal revenue stream` carry `objectClass: market` in the census | the word names a lawful body, an illegal body and a holder kind at once; the desk's "second market" is the operation's own name, not the market kind | — | speak the operation by its role label (`criminalOpRole.js:38-57`), never as *the market* |
| **the court** | **BODY**: `Courthouse` `institutionServices.js:89`, `Multiple court buildings` `:1117` · **HOLDER-ORGAN**: `court` kind `holderTable.js:78`, a STATE ORGAN `:115`, records `Criminal trials / Civil disputes / Notary services / Criminal proceedings / Civil litigation / Appeals` `:325-330`, holders measured = *Courthouse, Multiple court buildings* · **POWER**: `SECURITY_INSTITUTION_RE` matches `court` `corruption.js:630` · **civic class** `law` `wiringCensus.js:1311` | HOLDER: **12 of the desk's 14 LICENSED rows** resolve to `court` (10) or `court + watch` (2) · BODY: **none** | ⛔ **the word means two different things on this desk**: the *court of law* (the holder) and the *court* as the political assembly (DS-POW-7's pool name `consolidation 0: a fully divided court`, census `objectClass: law`). The engine's only typed `court` is the law court | — | at the assembly sense: **the hall's own combination** / the `{seat}`; at the record sense the court is a CITATION, never a subject |
| **the council** | **BODY**: `Town council` `:32` (holds **elders** `Record of custom` AND **toll-bar** `Market charter and tolls`), `Mayor and council` `:1069`, `Elder Grove Council` `:497`, `Guild governance` `:985` · **POWER (a value)**: `council` is one of the six `RULING_POWERS` `cohesionWeave.js:133`, mapped from the archetypes `government · civic · labor` `:172` · **a NAME**: fourteen `governingName` values contain "Council" (`rulingStructure.js:161-176`, `:219-250`, `:259-290`) · **civic class** `hall` `wiringCensus.js:1314` | POWER: `readings.structuralLens.rulingPower === 'council'` selects DS-POW-5's `council` pool (`powerStateProse.js:709-713`) — **census-WIRING-UNRESOLVED** · BODY: none | one word = an institution row, a ruling-power value, and part of most `{seat}` fills. The annex's own fence: *"prose that hard-codes the council will be wrong on most settlements"* `RECEIPT_POOLS_DOSSIER_STATE.md:2199-2201` | `{seat}` | **the ruling structure**; the six ruling-power words are lens VALUES and are safe only as the pool they key |
| **the workshops** | **BODY**: `Craft Guild District` `:134`; civic class `craft` `wiringCensus.js:1316` | **none** — DS-POW-5's five `economicBase:` pools are **dark by declaration** (`powerStateProse.js:665-680`: the three source keys are convicted as keys no writer produces, so the base fails soft to `mixed` and the desk refuses to draw it) | — | — | none licensed here |
| **the tables** (gambling) | **BODY**: `Gambling halls` `institutionServices.js:941` | DS-POW-6 `unlicensed revenue` v3, on a `name` read | — | — | the role label `unlicensed revenue` |
| **the clearinghouse** | **no engine row anywhere** — not a roster name, not a bucket, not a civic class | DS-POW-6 `stolen goods market` v1 | — | — | none; the word is an invention |
| **the temple / `{institution}`** | **BODY**: the §0c institution slot, DS-POW-5's theocracy arm (`RECEIPT_POOLS…:2197`) · civic class `temple` `wiringCensus.js:1312` | **named by one variant of forty and never filled** — census `DS-POW-5 :: theocracy` `slotsWithoutProvider: ["institution"]`; the desk leaves it unfilled by declaration (`powerStateProse.js:696-701`), so anchored liveness drops that variant | the ONE variant of this desk that would name a recorded institution row is the one variant that never renders | — | the parish/faith vocabulary is the **warFaith desk's** |
| **the prison / the gaol** | **BODY**: `Small prison/stocks` `:1635`, `Large prison` `:1640` · civic class `law` `wiringCensus.js:1311` | **none** — not rendered by any shipped variant of this desk | the `law` class puts prison, gaol and court in one refusal set | — | — |
| **the guard** | **BODY**: garrison bucket `defenseInstitutionBuckets.js:88-90` (`professional guard`); `SECURITY_INSTITUTION_RE` matches `guard` `corruption.js:630`; civic class `force` `wiringCensus.js:1303` | **none** | the garrison bucket contains the *professional city watch*, so "the guard" and "the watch" overlap in the engine's own table | — | **the guard** is itself the safe BODY word for the garrison bucket — on the defense desk, not here |
| **the muster** | **HOLDER-ORGAN ONLY**: `muster` kind `holderTable.js:78`; its record is `Muster training` `:281`; **exactly ONE institution in the whole 285-row roster keeps it — the Citizen militia** (`institutionServices.js:835`), which the table itself calls *"the sharpest wiring debt this table found"* `holderTable.js:285-288`. The muster kind's FIELDS are walls · garrison · militia · mercenary · charter · force · economicGates … `:188-199` | **none.** The desk's single occurrence is the **verb** — DS-POW-4 `legitimacyHold: public opinion neither helps nor hurts` v1, *"what {faction} can muster for itself"* | ⚠ **a reverse alias trap**: the class word for the paid military is a common English verb, and this desk already uses the verb on a legitimacy read. A refuter reading for the class word will hit it | — | **the muster** (as a noun, on a muster-kind read — which this desk has none of) |
| **the rolls · the records · the accounts · the books · the returns · the manifests · the minutes** | **HOLDER-layer SURFACES** — the office's own formula. `HOLDER_RECORDS` names the service rows that make an institution a keeper (`holderTable.js:271-364`); `office` is *"the compiling record itself"* `:74-77`, and a citation on it is a FINDING, not a licence `:361-362` | DS-POW-1 (`rolls` ×3, `records`, `accounts` ×3, `returns`), DS-POW-2 (`rolls`), DS-POW-4 (`rolls` ×3, `records` ×3), DS-POW-5 (`books`), DS-POW-6 (`rolls`, `record`, `returns`, `books`, `manifests`, `minute`) | the shipped `ledger` token was **withdrawn** from the holder table on its own evidence — *"seven writers across the treasury, the peace terms, the pantheon and three lifecycles, so the token names no one holder"* `holderTable.js:159-161` | — | the surface is lawful (ADDENDUM 12 R-vi / W7); **the roll as an AGENT-SOURCE is not** |
| **the houses** (15) / **a house** (6) | **POWER**: a `faction` is a recorded NAME — `factions[]{faction, power, powerLabel, isGoverning}` (`rulingStructure.js:781`, `:787`), and in the world-run a `factionStates` entry with `archetype`, `captureState`, `leaderNpcId` (`settlementPolitics.js:246-258`) | `factions` / `factions.length` (DS-POW-2 DOMINANT / NARROW); `politics.blocs` (DS-POW-5 `autocrat`, DS-POW-7 presence) | *house* is also a BODY word elsewhere (`Banking House` `:96`, brokerage houses `brokeragePatronage.js:283-286`) | `{faction}` / `{counterpart}` (§5) | **the houses** is safe as the plural of the typed faction slot; it is NOT safe for a brokerage house or a bank |
| **the combination / the bloc / the majority** | **POWER**: the `Bloc` typedef — `{id, members[], glue{type,detail}, end, strain, sinceTick, covert?}` `settlementPolitics.js:63-67`; glue types `:423-455`; ends `ARCHETYPE_END` `:461`; ruling bloc `:549`; consolidation `:604` | `politics.blocs` — DS-POW-7 `layer DORMANT` and `an opposition bloc forms COVERT…` (the only two RESOLVED of twenty) | the glue `patronage` is **PEOPLE-HELD** and dies at succession (`:451`, `:792`, `:803`) — a ROLE-layer fact inside a POWER-layer row | `{faction}` + `{counterpart}` | **the combination** (the shipped word) is the safest: it names the typed bloc without claiming an institution |
| **the criminal interest / the operator** | **POWER**: `computeCriminalCaptureState` reads a criminal FACTION's power against the governing faction's and the safety ratio (`factionDynamics.js:220-273`); the operation's own role is a label (`criminalOpRole.js:38-57`) | `power.criminalCaptureState` (4 rows), `name` (7 operation-role rows) | ⚠ the ladder names **no faction and no person**: `capture` = *"a REAL underworld … DOMINATES a still-standing government"* `factionDynamics.js:237-243`; `corrupted` = *"the council is purchased"* `:257-259` | none typed — the criminal party is never named by a slot | **the criminal interest** (the shipped words) is the safest: it is a standing, not a body |

### §4.2 The role words

`officesOf` (`institutionTable.js:377-400`) is the engine's ROLE layer: the NPC roster's `role`
and `title` nouns, **plus the governing seat's designation** (`:396-398`). The column is OPEN by
law (`:210-216`). **No typed NPC→institution edge exists** (`:457`, `:129-138`), so a role word
may state a STANDING CONDITION and may never be given an act, an intention or a fate.

| Role word | Occurrences on the desk | Engine row · file:line | Layer verdict |
|---|---|---|---|
| **the clerks** | 3 — DS-POW-1 `Endorsed` v2, `Approved` v2, `Legitimacy Crisis` v2 | no typed row: a clerk is neither a roster institution nor a holder kind. `holderRole` is null `institutionTable.js:457` | **PERSON doing an act** (*record*, *name*, *chase*) on a read that is the legitimacy band |
| **the officials** | 1 — DS-POW-6 `duty evasion` v1, *"enough officials are agreeable"* | as above | **PERSON with a disposition**, on a `name` read |
| **a ruler / its rulers** | 7 — DS-POW-1 `Endorsed` v4; DS-POW-4 `previousGovernments` v4, `legitimacyHold: backing` v1 and v3; DS-POW-6 `present: false` v1, `neutral baseline` v1 | the generic of the `{seat}` fill; `officesOf` folds `governingName` into the office set `:396-398` | **ROLE**, licensed as a standing condition; *"a ruler … can do things a ruler without it cannot attempt"* is a maxim frame, not a town fact |
| **an operator** | 1 — DS-POW-1 `Endorsed` v4 | the criminal side has no typed person; the ladder is settlement-wide (`factionDynamics.js:220`) | **PERSON**, on a legitimacy-band read |
| **a leader** | 2 — DS-POW-7 `glue concession` v3, `receipt fractured` v3 | `leaderNpcId` / `leaderName` ARE typed (`settlementPolitics.js:252-253`) and **the desk reads neither** | ROLE word over an **unread** typed field |
| **the person who speaks for {faction}** | 1 — DS-POW-6 `capture reached a LEADER` v1 | the rung word comes from `capturePoolKey` (`powerStateProse.js:436-440`), which reads ONLY the settlement-wide ladder | **ROLE asserted from a POWER read that names no person** |
| **the incumbent / the challenger** | DS-POW-4 `Contested` v3, `Critical` v1 (`{counterpart}`) | `contenders.incumbent{name, gated, govMultiplier}` / `challengers[]{name, archetype, weight}` arrive as a caller READING (`powerStateProse.js:994`) | ROLE, and the slot carries a recorded NAME |
| **`{npc}`** | DS-POW-3, 6 of 16 variants | `ladderRungsOf` → `{npcId, name, standing}` `src/domain/townMap/ladderRead.js:95-107`; filled `powerStateProse.js:639` | ⚠ **the desk's ONE person-named slot** — a recorded NPC name in subject position (§9 Q-1) |
| **the reeve · the headman · the mayor · the priest** | inside `{seat}` fills, never as bare nouns | `'village reeve': 'Elected Reeve'` `rulingStructure.js:164`; `"Headman's Authority"` `:259`; `'Priestly Guidance'` `:260`; `'Town Mayor'` `:284` | ⚠ **a role word can arrive INSIDE the body slot.** `{seat}` is not guaranteed to render a body |
| **elder** | an ANGLE tag, not a text noun — DS-POW-2 `recentConflict` v1, DS-POW-3 `low instability` v2, DS-POW-4 `previousGovernments` v1 | ALSO a holder kind (`elders`, `holderTable.js:332-337`, holders = *Household elder, Village headman, Village elder, Town council*) and three roster rows (`:14`, `:20`, `:26`) | the same string is a stance name, a holder kind and an institution row |
| **the captain · the factor** | **zero occurrences** on this desk | ADDENDUM 11's specimen role words; `captain` matches no roster row and no holder kind | not part of this desk's vocabulary |
| **somebody · nobody · anybody · everybody · a stranger · people · a person** | very frequent (the `[visitor]` and `[street]` angles) | no typed row; the licence card's standing refusal is *"a totality over persons"* | layer-free; they become PERSON claims only when given an act |

---

## §5 THE TYPED SLOTS THAT NAME THE POWER

| Slot | What fills it | file:line | Shape | Layer it actually carries |
|---|---|---|---|---|
| `{settlement}` | `settlement.name` through `properFill` | `powerStateProse.js:858`, `:178-186` | `proper` | the town |
| `{seat}` | **`powerStructure.governingName`** | fill `:860`; produced `rulingStructure.js:787`; the same value is also `government` `:792` | `proper` (`SLOT_FILL_SHAPES` `:149-152`) | **whatever class the generated name happens to be** — a body (*Town Council*), an office (*Royal Authority*, *Feudal Stewardship*), or a role (*Town Mayor*, *Elected Reeve*, *Headman's Authority*, *Priestly Guidance*) |
| `{faction}` | **the same `governingName`** in DS-POW-2, -4, -6, -7 | `:876`, `:909`, `:953`, `:962` | `proper` | the governing power's name — **not** the captured house, and not a rival (see R-2, R-3) |
| `{counterpart}` | `readings.contenders.challengers[0].name` | `:994`, used `:909`, `:953` | `proper` | a rival faction's recorded name |
| `{npc}` | `reading.rungs[0].name` (DS-POW-3 only) | `:639`; produced `ladderRead.js:95-107` | `proper` | **a recorded person's name** |
| `{institution}` | nothing — no provider | census `DS-POW-5 :: theocracy` `slotsWithoutProvider`; declared `:696-701` | `proper` | would be a recorded institution row |
| `{route}`, `{good}` | nothing — no provider | census `DS-POW-5 :: economicBase: trade_hub` / `: craft`; declared `:696-701` | `proper` / `bare-common` | — |
| **the ruling structure, as a CLASS** | `RULING_POWERS` = `autocrat · council · theocracy · merchant_league · criminal · mixed`, mapped from the governing faction's archetype and **total, failing soft to `mixed`** | `cohesionWeave.js:133`, `:171-180` (`ARCHETYPE_TO_RULING`), `:194-197` | a lens value | the POWER's KIND, never its name |
| **the patron** | `patronId` / `patronName` / `patronArchetype`, `source: 'genesis' | 'captured'` | `brokeragePatronage.js:285-296`; sources `:60` | typed | **read by no pool of this desk** |

⛔ The desk owns **no literal fill table** and says so: `SLOT_FILL_TABLES = Object.freeze({})`
(`powerStateProse.js:162`), *"both its slots take a generated NAME, not a table-mapped enum"*
`:155-160`. So every referent this desk names arrives as a **generated proper string whose
class the engine does not tag**.

---

## §6 THE ENGINE'S OWN OVERLAPS (wiring facts for the register car, not writer choices)

| # | Word | Rows it occupies | file:line | Note |
|---|---|---|---|---|
| O-1 | **professional city watch** | the **garrison** bucket AND the **watch** bucket | `defenseInstitutionBuckets.js:90` and `:96` | the alias overlap ADDENDUM 11 names; measured over the roster, the garrison bucket holds *Garrison · Multiple garrisons · Professional city watch · Barracks* and the watch bucket holds *Professional city watch · Town watch* |
| O-2 | **watch** | a defence BUCKET (`:95`) **and** a HOLDER KIND (`holderTable.js:78`) that is a STATE ORGAN (`:115`) | | the table records the split in its own words: *"the muster roll counts men under arms, and the watch keeps its own count"* `holderTable.js:206-208` |
| O-3 | **court** | a HOLDER KIND (law court, `holderTable.js:325-330`) **and** the political assembly (DS-POW-7's pool name) **and** the civic class `law` (`wiringCensus.js:1311`) | | the engine types only the law court; the assembly sense has no row |
| O-4 | **council** | an institution row (`Town council` `:32`) **and** a `RULING_POWERS` value (`cohesionWeave.js:133`) **and** a component of most `{seat}` fills **and** the civic class `hall` (`wiringCensus.js:1314`) | | four registers, one word |
| O-5 | **Town council** | holds the **elders** record (`Record of custom`) **and** the **toll-bar** record (`Market charter and tolls`) | `institutionServices.js:32-38`; `holderTable.js:304-308`, `:332-337` | one institution, two holder kinds — `sourceOfForTown` dedupes on the **pair**, not the name `holderTable.js:751-760` |
| O-6 | **reeve** | an institution row (`Village reeve` `institutionServices.js:1346`) **and** a **treasury** holder (`Tax collection`) **and** a `governingName` value (`'village reeve' → 'Elected Reeve'` `rulingStructure.js:164`) **and** a role word | | ADDENDUM 11 offers "the reeve" as a specimen ROLE word; on this desk it is three other things first (§9 Q-4) |
| O-7 | **Town hall / City hall** | the **office** kind's holders (`Record filing` / `Public record access`) **and** `Town hall` is also a **treasury** holder (`Tax payment`) | `institutionServices.js:1623`, `:1629`; `holderTable.js:273-278`, `:357-362` | a citation on an office-sourced fact is a **finding**, `:361-362` |
| O-8 | **the state's four organs vs. the security bodies** | `STATE_ORGAN_KINDS = office · court · treasury · watch` (`holderTable.js:115`) vs. `SECURITY_INSTITUTION_RE = watch|garrison|constab|guard|magistrate|court|barracks` (`corruption.js:630`) | | measured over the 285-row roster, `SECURITY_INSTITUTION_RE` matches **8** rows — *Courthouse · Garrison · Multiple court buildings · Multiple garrisons · Professional city watch · Town watch · Barracks · Watchtower* — **and four of those are this desk's own record holders** |
| O-9 | **muster (noun) vs. muster (verb)** | the class word for the paid military `holderTable.js:78` vs. ordinary English | | DS-POW-4 already uses the verb on a legitimacy read |
| O-10 | **the civic-object classifier cuts across the holder table** | `watch` → `force`; `court` → `law`; `patron` → `temple`; `seat`/`office`/`council`/`charter` → `hall`; `market` → `market` | `wiringCensus.js:1302-1322` | measured on this desk: `DS-POW-7 :: end patron` files under **temple**; `DS-POW-7 :: consolidation 0: a fully divided court` files under **law**; `DS-POW-4 :: riskLabel: Critical. The seat could fall` files under **hall**; `DS-POW-5 :: merchant_league` and `: trade_hub` under **market**; `: craft` under **craft** |
| O-11 | **the muster kind has one holder in the entire roster** | `Citizen militia` | `holderTable.js:280-288`; `institutionServices.js:835` | *"A town with a Garrison and no militia has men under arms and no roll of them"* |
| O-12 | **`tradition` has no holder anywhere** | zero roster rows | `holderTable.js:338-347` | SOURCE-UNRESOLVED in every town the product can generate |

---

## §7 VISIBILITY — WHICH FACE MAY NAME EACH STANDING READ (part d)

| Standing read | Engine visibility flag | file:line | Licensed face, by the engine | What the desk actually does |
|---|---|---|---|---|
| `power.criminalCaptureState` = `corrupted` / `capture` (DS-POW-6 `capture reached an AGENT…`, `…a LEADER`) | **none.** The field carries no covert flag; it is a plain string on `powerStructure` | written `rulingStructure.js:797`; ladder `corruption.js:474` | the engine does not decide | **the ANNEX decides**: all 6 variants carry `marks: ["dm-only"]`, and the block's fence adds *"The seat rank an operator has reached is the sharpest covert fact in the cluster and never appears outside a `dm-only` tag"* `RECEIPT_POOLS…:2305-2307`; PDF `PRINT-DEFERRED` `:2297` |
| `power.criminalCaptureState` direction (DS-POW-6 `capture pressure ADVANCING` / `RECOVERING`) | none | as above | — | all 6 variants `dm-only`; the fence says *"Capture DIRECTION is state and is narratable; the damping and amplification coefficients are not"* `:2292-2293` |
| `factions[].captureState` (the per-faction rung) | none typed; seeded at birth onto the governing entry only at equilibrium+ | `rulingStructure.js:764-767`; `holderTable.js:129-145` | — | **read by no pool of this desk** |
| a `corruption` impairment on a SECURITY body | ⭐ **a real typed flag**: `covert !== true` ⇒ the institution goes in `revealed` (a public scandal); otherwise `covert` (the hidden channel) | `corruption.js:677-680`, with the reason in the comment `:670-674` | **revealed ⇒ both faces; covert ⇒ the DM line only** | **read by no pool of this desk — and, measured over the committed census, by no shipped pool of ANY desk.** The only prose consumer is the taste's unshipped DS-DEF-11 modifier pools `watch: bought (revealed)` / `(covert)` |
| a brokerage house's patron | ⭐ **a typed audience projection**: `projectPatronBindings(bindings, {audience})` — a player projection blanks `patronName` on a covert row unless the institution id is in `exposed` | `brokeragePatronage.js:319-329`, doctrine `:303-312` | legal ⇒ both faces; whisper-market ⇒ DM until exposed | **read by no pool of this desk.** DS-POW-7's `end patron` invents the relation from the bloc's `end` value (`ARCHETYPE_END` `settlementPolitics.js:461`), not from a patron binding; all 3 variants are `dm-only` |
| `blocs[].covert` (a conspiracy under an autarchy; `compromise` glue) | ⭐ **typed**: `classifyGlue` returns `{glue, peopleHeld, covert}` and `compromise` is covert outright `settlementPolitics.js:423-436`; a conspiracy forms covert under an autarchy `:959-962`; the covert→revealed discovery path `:823-830` | | covert ⇒ the DM line; a revealed leash is a public scandal both faces may name (`receipt exposed`) | **the desk reads `politics.blocs` and never `blocs.covert`.** `politicsPresencePoolKey` reads `b?.covert === true` in JS (`powerStateProse.js:809`) but the census's read recovery records only `politics.blocs`, so **`covert` is `false` on all 79 rows** while 13 of DS-POW-7's 60 variants are `dm-only` |
| `legitimacy.governanceFractured`, `legitimacy.govMultiplier`, `power.stability`, `power.recentConflict`, `politics.blocs`, `ledger.*`, `breakdown.*` | none | | both faces | 1 `dm-only` variant on the desk (DS-POW-1 `governanceFractured true` v3) |

⛔ **THE MEASURED GAP.** `COVERT_SOURCES` (`wiringCensus.js:1252-1259`) lists
`compromisedSecurityInstitutions · npc.corrupt · corruptNpc · impairment.covert ·
mobilization.covert · blocs.covert`, and `isCovertPath` (`:1265-1269`) also catches a bare
`covert` segment. **Estate-wide only four rows carry `covert: true`, all four on DS-WAR-1
(`mobilization: …`).** So on the power desk the visibility signal lives **entirely in the
annex's `dm-only` variant marks** (29 of 256) and not in any instrument the gate reads. Draft
law 4 ("visibility follows the power layer") currently has **no mechanical carrier on this
desk**.

---

## §8 FINDINGS — SHIPPED ROWS USING A WORD AT THE WRONG LAYER FOR ITS READ (part e)

Quotes are ≤12 words. **These are findings for the chair, not verdicts.**

### §8.1 A BODY WORD ON A DESK WITH NO BODY READ (the largest class: 66 of 256 variants)

| # | Row | Read the pool carries | Quote (≤12 words) | The layer charge |
|---|---|---|---|---|
| R-1a | DS-POW-1 `Endorsed` v4 `[counterforce]` | `(none — WIRING-UNRESOLVED)` | *"Crime finds little room … and the watch is not the reason"* | **the watch** on a legitimacy-band pool with **no read at all**. Exactly ADDENDUM 11 rule 5's named case ("a face never uses *the watch* for a pay-gate read") transposed: here it is a legitimacy read, and the watch bucket is the defence desk's (`DS-DEF-5 :: watch PRESENT`) |
| R-1b | DS-POW-2 `siege matched` v2 `[ledger]` | `power.stability` (court) | *"it governs rationing, the gates and the watch rota"* | three body words (gates, watch, plus *besieged*) on a stability-string read; the annex's own fence says *"A variant asserts ONLY the condition its own token names"* `RECEIPT_POOLS…:2009-2011` |
| R-1c | DS-POW-6 `neutral baseline` v1 `[ledger]` | `ledger`, `ledger.present`, `legitimacy.breakdown` (court) | *"not the harvest, not the watch, not the walls"* | a three-body negation on a read that is *the four contributions are all zero* |
| R-1d | DS-POW-6 `capture RECOVERING` v2 `[counterforce · dm-only]` | `breakdown*` + `criminalCaptureState` (court + watch) | *"Prosperity and a working watch did what no investigation did"* | the **watch as a body** on a **standing** read. Under draft law 1 the standing read names the organ under a power with the institution as OBJECT; here the watch is the AGENT of a recovery |
| R-1e | DS-POW-6 `stolen goods market` v2 `[counterforce]` | `name` | *"the somewhere is the part the watch has never reached"* | the watch as an agent on an operation-NAME read |
| R-1f | DS-POW-1 `breakdown … FOOD, adverse` v1 `[ledger]` | `(none — WIRING-UNRESOLVED)` | *"is being judged at the granary door, and the granary is not helping"* | the granary is a `storehouse`-class body with no read; the pool's subject is a signed contribution |
| R-1g | **the hall, 50 occurrences across 6 blocks** | various | *"The hall at {settlement} is settled"* (DS-POW-2 `stable` v1) | the desk's dominant body word. `hall` is a civic class (`wiringCensus.js:1314`) whose roster members (`Town hall`, `City hall`) are **office-kind holders**, not the ruling structure. Draft law 1 would read *the hall* as a BODY word on a POWER/ORGAN read every time |
| R-1h | DS-POW-6 `duty evasion` v1, v3 `[ledger]`, `[counterforce]` | `name` | *"Goods reach {settlement} around the customs rather than through them"* | the customs is a toll-bar body; the read is the operation's own name |
| R-1i | DS-POW-6 `stolen goods market` v1 `[ledger]` | `name` | *"moved back into lawful circulation through a clearinghouse"* | **a body word with no engine row of any kind** |
| R-1j | DS-POW-5 `council` v3 `[unfolding]` | `(none — WIRING-UNRESOLVED)` | *"A council falls to unrest rather than to a rival"* | the annex's own fence forbids hard-coding *the council* (`:2199-2202`); the pool is the ruling-power VALUE `council`, and the sentence spells the value as a body |

### §8.2 A PERSON DOING SOMETHING

| # | Row | Read | Quote (≤12 words) | The layer charge |
|---|---|---|---|---|
| R-4a | DS-POW-1 `Endorsed` v2 `[ledger]` | `(none)` | *"the clerks record almost nothing they have had to chase"* | a PERSON class acting. `holderRole` is null on every row (`institutionTable.js:457`) |
| R-4b | DS-POW-1 `Approved` v2 | `(none)` | *"the exceptions are few enough that the clerks can name them"* | as above |
| R-4c | DS-POW-1 `Legitimacy Crisis` v2 | `(none)` | *"the clerks who keep them have stopped chasing what is missing"* | as above; three clerk sentences in one block |
| R-4d | DS-POW-6 `duty evasion` v1 | `name` | *"enough officials are agreeable for it to be routine"* | a PERSON class with a disposition, on a label read |
| R-4e | DS-POW-6 `capture reached a LEADER` v1 `[dm-only]` | `power.criminalCaptureState` | *"The person who speaks for {faction} … is not free to speak"* | a ROLE asserted from a settlement-wide POWER rung that names no person (§8.4) |
| R-4f | DS-POW-1 `Endorsed` v4 | `(none)` | *"leaves an operator very few doors to lean on"* | a criminal PERSON on a legitimacy pool |
| R-4g | DS-POW-7 `receipt fractured` v3 `[unfolding]` | `(none)` | *"A leader who bound the combination … left the seat"* | the `leaderNpcId` IS typed (`settlementPolitics.js:252`) and this desk **reads it nowhere**; the sentence narrates an unread field |
| R-4h | DS-POW-4 `legitimacyHold: backing` v1, v3 `[street]`, `[counterforce]` | `legitimacy.govMultiplier` (court) | *"a ruler with the town behind them can do things"* | a ROLE generic stated as a **maxim** rather than as this town's standing; ADDENDUM 12 W5's maxim-frame class |

### §8.3 A FUSED AGENT (a relation no field computes)

| # | Row | Read | Quote (≤12 words) | The layer charge |
|---|---|---|---|---|
| R-5a | DS-POW-3 `high instability` v1 `[ledger]` | `reading.instability`, `reading.rungs*` | *"A house that keeps re-learning who it answers to gets less done"* | the churn→weakness link IS licensed by the annex fence (`:2078-2083`), but the sentence fuses the faction (POWER) with an internal ROLE order and speaks as one agent |
| R-5b | DS-POW-6 `capture reached an AGENT of a faction` v1 `[dm-only]` | `power.criminalCaptureState` | *"Somebody well down inside {faction} … is answering elsewhere"* | fuses a PERSON (*somebody*), a DEPTH (*well down inside*) and a RELATION (*answering elsewhere*) on a rung that carries none of the three |
| R-5c | DS-POW-7 `consolidation 0` v2 `[unfolding · dm-only]` | `(none — WIRING-UNRESOLVED)` | *"A small interest buys a great deal here"* | a POWER-layer purchase asserted on a consolidation scalar the desk does not read |
| R-5d | DS-POW-4 `riskLabel: Holding` v1 `[ledger]` | `label (via RISK_POOL_OF)` | *"{faction} outweighs everyone who wants the {seat}"* | **{faction} and {seat} render the SAME STRING** (R-2), so the sentence reads as one actor outweighing itself |

### §8.4 THE RANK CLAIM — a ROLE read off a settlement-wide POWER rung

`capturePoolKey` (`powerStateProse.js:436-440`) maps `criminalCaptureState === 'capture'` →
`capture reached a LEADER` and `'corrupted'` → `capture reached an AGENT of a faction`. But
`computeCriminalCaptureState` (`factionDynamics.js:220-273`) computes those rungs from a
**criminal faction's power against the governing faction's power and the safety ratio** — its
own comments read *"a REAL underworld … DOMINATES a still-standing government"* (`:237-243`) and
*"the council is purchased"* (`:245-246`). **It names no seat, no rank and no person.** The
`agent · deputy · leader` vocabulary the annex quotes (`RECEIPT_POOLS…:2293-2295`) is the
world-run `rank` parameter of `captureAdvanceChance` (`corruption.js:490-497`, *"1=agent..3=leader"*),
read from an NPC's `dotRank` on an internal seat (`factionCapture.js:93-99`) — a PERSON fact
this desk never receives. **Six shipped variants (all `dm-only`) rest on it.**

### §8.5 THE SAME WORD, TWO REFERENTS — AND ONE REFERENT, TWO SPELLINGS

- **R-2 — `{seat}` and `{faction}` fill from ONE string.** `const governing =
  properFill(text(power.governingName))` (`powerStateProse.js:860`) fills `{seat}` at `:875` and
  `{faction}` at `:876`, and BOTH at `:909` (DS-POW-7), `:953` (DS-POW-4) and `:962` (DS-POW-6).
  Draft law 3 inverted: one referent under two spellings, so a unit naming both reads as two
  actors. The desk has already paid this cost once knowingly — DS-POW-2 leaves `{seat}` unfilled
  and drops 10 of 31 variants rather than render *"The Merchant Council … is Merchant
  Council's"* (`:862-874`).
- **R-3 — DS-POW-6's `{faction}` is documented as the CAPTURED HOUSE and filled with the
  GOVERNING BODY.** The comment at `:957-958` says *"DS-POW-6 uses {seat} as the governing BODY …
  and {faction} for the captured house, so it takes BOTH fills — the two roles do not collide in
  this block"*, and the very next line (`:962`) fills both from `governing`. The desk derives no
  captured-faction name anywhere (`capturePoolKey` reads the settlement-wide rung only), so
  *"Somebody well down inside {faction}"* renders the **ruling structure's own name** on every
  town. A POWER-layer misattribution produced by the fill, not by the writer.
- **R-6 — `governanceFractured` asserts a SECOND, UNNAMED power.** DS-POW-1's `dm-only` variant
  (`RECEIPT_POOLS…:1990-1993`) says *"{settlement} has a governing body and it has a government"*.
  The producer sets `governanceFractured: score < 30` (`factionDynamics.js:133`) on the
  **identical predicate** as `isLegitimacyCrisis: score < 30` (`:132`), and the desk records the
  collapse verbatim: *"the two are COEXTENSIVE at the producer"* (`powerStateProse.js:53-55`).
  The annex's PROVENANCE fence asserts the opposite — *"`governanceFractured` is a SEPARATE
  assertion and is never inferred from a low band"* (`:1928-1930`). So four variants name a power
  with **no typed slot behind it** on a read that is the crisis band under another name.

---

## §9 INSTRUMENT AND WIRING ROWS, AND THE QUESTIONS THE CHAIR MUST ANSWER

### §9.1 Two instrument defects found and PROVEN by execution

**W-1 — DS-POW-1's licence card reports the WRONG BAG, and it is a layer-grade misdirection.**
The card for all eleven DS-POW-1 pools prints
`FILLED at this block's call sites: {faction} {npc} {settlement} · NAMED BUT NEVER FILLED: {seat}`.
The desk fills `{settlement}` and `{seat}` and neither `{faction}` nor `{npc}`
(`powerStateProse.js:875`). **Cause, executed:** `resolveBag` resolves a shorthand `slots:` by
`new RegExp('\\bconst\\s+slots\\s*=').exec(src)` — the **first** match in the file
(`tests/helpers/dossierComposedFill.js:141`). `powerStateProse.js` declares `const slots =`
twice, at **line 634** (inside `powerLadderRung`, the DS-POW-3 bag `{settlement, faction, npc}`)
and at **line 875** (DS-POW-1's own). Run in the dock:

```
resolveBag(src,"slots")           => ["settlement","faction","npc"]     ← powerLadderRung's, line 634
every `const slots =` line:       => [634, 875]
resolveBag(src,"stabilitySlots")  => ["settlement","faction"]           ← correct (unique name)
```

Under the referent law the card therefore tells a writer that DS-POW-1 may name a **faction**
(a POWER-layer typed slot) and an **NPC** (a person), and may not name the **`{seat}`** — the one
referent 38 of its 41 variants actually carry. It also plants a false wiring-debt row: the census
lists `{seat}` as `slotsWithoutProvider` on eleven pools (`wiringCensus.js:608`, reported
`:1176-1177`). The cure is a per-declaration resolve (nearest enclosing scope), not a rename.
**Only DS-POW-1 is affected on this desk**; DS-POW-3 collides on the same first match and is
correct by luck.

**W-2 — DS-POW-5's only RESOLVED row is resolved against the WRONG key function.** The census
gives `DS-POW-5 :: autocrat` `keyFunction: politicsPresencePoolKey`, `reads: ["politics.blocs"]`,
`source: court · LICENSED`. The real selector is `rulingPowerPoolKey`
(`powerStateProse.js:709-713`), which returns `lens.rulingPower` by CORPUS lookup and contains
**no literal**; the literal `'autocrat'` the census's rung-3 search found lives inside
`politicsPresencePoolKey` at `:810` (`text(rulingPower) === 'autocrat'`), which is DS-POW-7's
function. So the card licenses a face to speak *the court's bloc record* on a pool whose actual
read is the **ruling-power classification of the governing faction's archetype**
(`cohesionWeave.js:171-196`). A layer error created by the instrument.

### §9.2 Wiring rows for the register car

| # | Row | Evidence |
|---|---|---|
| W-3 | **The desk reads no institution row**, so every body word in its prose is unlicensed by construction (66 of 256 variants) | §1, §8.1 |
| W-4 | **The corruption impairment — the law's cleanest ORGAN-UNDER-POWER fact, and the only one with a real covert flag — is read by no shipped pool of any desk** | `corruption.js:663-691`; census probe over all 708 rows |
| W-5 | **`blocs.covert` is on the frozen COVERT-SOURCE list and no power row reads it**, although `politicsPresencePoolKey` reads `b?.covert` in JS | `wiringCensus.js:1252-1259`, `:1265-1269`; `powerStateProse.js:809`; census `covert=false` on 79/79 |
| W-6 | **The brokerage patron has a typed audience projection and no prose consumer**; DS-POW-7's `end patron` invents the relation from the bloc's `end` value | `brokeragePatronage.js:319-329`; `settlementPolitics.js:461` |
| W-7 | **The bloc ROLE layer is fully typed and entirely unread** — `leaderNpcId`, `leaderName`, warm/hostile tie types, `peopleHeld`, succession drift. **18 of DS-POW-7's 20 pools are WIRING-UNRESOLVED** | `settlementPolitics.js:252-253`, `:316-318`, `:423-455`, `:792-803`, `:927-928` |
| W-8 | **`{seat}` and `{faction}` are one string, and DS-POW-2 has no hall-name producer** | `powerStateProse.js:860`, `:866-876` |
| W-9 | **`governanceFractured` and the `Legitimacy Crisis` band are coextensive at the producer, and the annex's PROVENANCE fence asserts the opposite** | `factionDynamics.js:132-133`; `powerStateProse.js:51-60`; annex `:1928-1930` |
| W-10 | **The civic-object classifier cuts across the holder table**, with three measured mis-files on this desk (`end patron` → temple, `a fully divided court` → law, `the seat could fall` → hall) | `wiringCensus.js:1302-1322`; census `objectClass` on DS-POW-4/5/6/7 |
| W-11 | **DS-POW-5's five `economicBase:` pools are dark by declaration** and its `{institution}`, `{route}`, `{good}` slots have no provider — so the one variant of the desk that would name a recorded institution row never renders | `powerStateProse.js:665-701`; census `slotsWithoutProvider` |
| W-12 | **The AGENT/LEADER rank split reads no seat rank** | §8.4 |
| W-13 | **The muster kind has exactly one holder in the 285-row roster**, and `tradition` has none at all | `holderTable.js:280-288`, `:338-347` |

### §9.3 Questions the law must answer (raised, not decided)

| # | Question | Why it is open |
|---|---|---|
| Q-1 | **Is `{npc}` a ROLE read or a PERSON referent?** The draft law says PERSON is never a referent and an individual appears "only as a ROLE word"; DS-POW-3 puts a **recorded name** in subject position in 6 of 16 variants | `ladderRead.js:95-107`; filled `powerStateProse.js:639`. The engine types the NPC→rung edge inside a faction even though it types no NPC→institution edge, and the annex fence already bars a fate: *"a name leaving the top rung is a departure from the rung, never from life"* `:2084-2085` |
| Q-2 | **Which layer tag does a read with an UNNAMED power carry?** `governanceFractured` asserts a second government the engine never names | R-6; `holderTable.js:129-145` |
| Q-3 | **Does "a standing read" cover a standing whose holder is the POPULACE?** `govMultiplier` is a standing over the seat held by the town, not by a faction or the ruling structure | `factionDynamics.js:113-118`; DS-POW-4's three hold pools |
| Q-4 | **Does the law want a SAFE ROLE LIST per desk, the way it wants safe class words?** ADDENDUM 11 offers "the reeve" and "the captain" as specimens; on this desk *reeve* is an institution row, a treasury holder and a `governingName` value before it is a role, and *captain* appears nowhere | O-6; `rulingStructure.js:164` |
| Q-5 | **Where a read's implied power has no typed slot, does the law refuse the power clause, or admit an unnamed-power form?** The shipped rows take the second option (*"the real decisions are made elsewhere"*, *"answering elsewhere"*, *"a particular interest"*) and the engine names nobody | annex `:1990-1994`, `:2319-2328`; `holderTable.js:129-145` |
| Q-6 | **Is the `{seat}` fill a BODY word, an OFFICE word or a ROLE word?** `officesOf` folds `governingName` into the OFFICE set (`institutionTable.js:396-398`), and the generator can put *Town Mayor*, *Elected Reeve*, *Headman's Authority* or *Priestly Guidance* in it (`rulingStructure.js:164`, `:259-260`, `:284`). A law that fixes the layer by the READ still needs to know what class the SLOT renders |
| Q-7 | **Does draft law 4 have any mechanical carrier on this desk?** Visibility here is carried entirely by the annex's `dm-only` marks (29 of 256 variants), and the census `covert` flag is false on all 79 rows | §7 |

---

## §10 THE ONE-LINE SUMMARY FOR THE CHAIR

The power desk is the **cleanest test of the referent law and the hardest case for it**: it is
the only desk whose every read is a POWER-layer or ORGAN-layer standing (a capture rung, a
legitimacy coefficient, a bloc ledger, a stability string), it has **no body read whatsoever**,
and 66 of its 256 shipped variants speak in body words anyway — *the hall* fifty times, *the
watch* five, with no institution row behind either. Its two LICENSED holder kinds (`court`,
`watch`) are exactly the two institutions the corruption model can buy, which is where the law's
ORGAN-UNDER-POWER layer would first earn its keep — and neither the desk nor any shipped pool in
the estate reads that fact today.

---

*Packet written by the power-desk referent surveyor, seat Opus 5, from `laneRW-DEFW` at
`f2da5a3ee`. Nothing in the dock was modified, staged or committed. The only executable runs
were `scripts/prose-licence-card.mjs` (15 cards) and three printing `node -e` probes over the
committed census, the generated leaf, and `tests/helpers/dossierComposedFill.js`'s pure
`resolveBag` / `fillSites`. No vitest, no build.*
