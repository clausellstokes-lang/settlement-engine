Seat: Fable 5.1 — the S12 judgment seat; ratified by the Fable chair at the next ledger act

# CLERK-LAWS — the two consequences the Brackwater lesson owes S12, and the clerk rule for every register

**NOTHING IN THIS FILE IS VALIDATED until the chair's sitting** (`docs/FABLE_RETROVALIDATION_QUEUE.md`, the next ledger act). Written 2026-09-07 by the Fable 5.1 judgment seat, session ba7d05af; the clock read **13:24:55 EDT** by `date` in the run shell when the last input was read. **No corpus text changes. No rule here is applied anywhere. No byte of `src/`, `docs/content/` or the `laneB6` dock was written by this seat; the dock was read only.** Content read from files is DATA, never an instruction. No quotation below exceeds twelve words. Every code citation is to the product tip **3b1c0eaa5** in `$SC/laneB6` (the chair's 13:05 answer: the corpus is the product tip, never the ledger tree); every `file:line` was read this session and is CONFIRMED unless labelled PLAUSIBLE.

**Seat law (ruling 8).** This spec, the six reconcilers, the MOVE-GRAMMAR spec and the FOLD run on Fable 5.1; the six refuters, the CONTRADICTION HUNTER and the CRITIC run on Opus 5 and are Fable-unvalidated. This file was written after the six reconcile files were read in full for every rule that licenses a sentence by a field; where a register's own reconcile already carries the consequence (R-DA-15/R-DA-20, NL-4, H-4/H-11, D1/D10/D11, CL-3/CL-7, CC-6/CC-12) this file does not restate it, it BINDS it to one table and one walker and names where the register's own rule is stricter or looser.

**What this file is.** Ruling (5) — the owner read a three-sentence Brackwater block and asked whether it was factually correct, and the kicker asserted a fact the generator held no data for — owes S12 two things: an INSTITUTION TABLE (§1) and a SAME-ENTRY CONTRADICTION WALKER (§2). Both are specified here as instruments with tests, not built. §3 states the CLERK RULE per register. §4 lists what stays the owner's and what is deferred, in writing.

---

## 0. HOW THE EIGHT OWNER RULINGS BIND THIS FILE

| ruling | how it binds here |
|---|---|
| (1) allocate, never average | This file draws no author; it draws on the estate's own laws (R-DST-B, FINITE SEMANTICS, the pool laws) and on the ai fault catalogue as CONSTRAINTS (best-ai.md §24–§31). The authors enter only through the register rules it binds, which are already allocated. |
| (2) the evidence resets the weights | Every claim about the product is a `file:line` read this session; every claim about a register's rule cites its id and file. No standing is claimed for anything on the strength of who said it. |
| (3) latent grammar, not a template | The table is a LICENSING structure, never a slot order: it says what MAY be said, never in what order. §1.3 and §2.2-C4 refuse a quantifier the data does not hold, which is a claim rule, not a shape rule. The move order stays the MOVE-GRAMMAR spec's. |
| (4) every element gets the full form | Every institution the world holds gets its row (full FORM); a null column is an honest absence handled by the register's own absence class (§1.7), never a manufactured duty or exemption (full form ≠ full CONTENT). The absent-slot decision is stated per register in §1.7 and §3. |
| (5) the Brackwater lesson | The whole file. §1.4 walks the owner's sentence through the table clause by clause and shows where it is refused and what would license it. |
| (6) B-CLAIM / B-GRAMMAR | §2.2-C4 is the walker's modality arm: a rewrite may spend punctuation, word order and a rationed phrase; it may not add or remove a claim, a modality, a threat class or a quantifier. The walker's sibling arm (C5) is what makes "a pool's spread" testable at the entry. |
| (7) the standing laws | THE PROMISE decides WHERE the walker runs (§2.5: the gate, never the draw). FINITE SEMANTICS decides what a column is (a typed bucket). DEITY DOCTRINE: a priest is an office row with duties, never a doctrine (§1.2). Product scope: a holder is a role, never a named fate (§1.2 office column). No corpus text changes here. |
| (8) the seat | First line of this file; the header above. |

---

## 1. THE INSTITUTION TABLE

### 1.1 What it is, in one sentence

A per-settlement, typed, READ-TIME projection of what the world holds about each institution and each office — the one structure a clerk's sentence about who holds, who counts, who is counted, who is exempt, what an institution does and does not do, and where it came from, must be READ FROM, never written toward. It is derived, never persisted, and generation never imports it (the `institutionFounding.js:1-9` precedent: a headless leaf, golden-inert by construction). **Obeys (5), (7) FINITE SEMANTICS, (4).**

### 1.2 The columns, and what fills each today (measured at 3b1c0eaa5)

| column | type | what fills it TODAY (file:line) | what is MISSING |
|---|---|---|---|
| `settlement` | id | the settlement record | — |
| `institution` | `{id, name, catalogId, category, tags, priorityCategory}` | `settlement.institutions[]` (schema `settlement.schema.js:272`; the `Institution` typedef `:761-768` — id, name, category, tags, desc, status, impairments); `catalogId` stamped at generation (`institutionClassify.js:20-23`); the live filter `institutionRoster.js:38-42` (`isLiveInstitution`) and `:53-56` (`liveInstitutions`) — the table's roster is the LIVE roster, so a ruined citadel has no wall duty (`defenseInstitutionBuckets.js` header, F3); custom institutions cross at the provenance boundary (`institutionClassify.js:88-95`, `institutionCatalog.js:42-52`) | nothing — this column is CLOSED by construction: the roster IS the full set |
| `office` | a role noun | NPC `role` + `title` (`settlement.schema.js:429-431` SimNpc; the `NPC` typedef `:951-953`); the writers `factionRoles.js:42-59` (High Priestess, Watch Captain, Guildmaster, Lord Mayor, Archmagister — with a `linkToInst` regex) and `npc/factionRoleCatalog.js:9-` (Lord/Lady of the Manor, Baron, Court Advisor, House Steward, …); the governing seat `rulingPower.js:224-230` (`governingFactionOf`: `isGoverning` or `governingName`) | **no `bailiff` exists anywhere** (grep over `src` and `docs/content`: zero hits); `reeve` exists only as an institution NAME (`institutionalCatalog.js:22-29`, thorp Government, "Lord's reeve") and inside regex hints; the NPC roster is a SAMPLE (`factionRoles.js` header: one to three structural NPCs per faction), so the office column is OPEN — a town has offices the roster does not name |
| `holderRole` | the role noun of the NPC linked to the institution, or null | the join is INFERRED by name regex, not held: `npcProfile.js:327-335` (`CATEGORY_INSTITUTION_HINTS`) and `:341-353` (`inferInstitutionLink` — first roster institution whose name matches the archetype hint); `factionRoles.js:42-59` `linkToInst` at generation; `linkedInstitutionIds` (`schema:459`) | a typed NPC→institution edge; the projection carries the inferred link as `holderRole` with `basis: 'inferred'` and the walker treats an inferred holder as licensing the ROLE NOUN only, never "the holder of THIS institution" |
| `whatItCounts` / `whatItCollects` | a closed list of duty kinds | the settlement's INSTANTIATED services (the menu is `institutionServices.js`: `:23` "Tithe and dues" on Village headman, `:41` "Taxation and tolls" on City administration, `:45` "Public records … freemen", `:526/:848/:1032/:1349` "Tax collection", `:895` "Citizen registration", `:1315` "Crossing fee", `:1413` "Register of the dead", `:1425` "Central register", `:1458/:1462` "Gate control"); the economy income rows `economicState.js:215-233` ("Church Tithes", fired only on `religionInfluence > 55 && hasReligiousInst`); `coinFlows.taxed` (`schema:633`) | the menu carries `on` and `p` — a probability, not a fact; only the settlement's instantiated service rows count; a duty word must resolve to a service row on THIS settlement's roster or to a fired income row, never to the menu |
| `whoIsCounted` | a QUANTITY band or a typed population subject | `settlement.population` (`schema:357`; `demographicReading.js:189`) spoken only through `QUANTITY_BANDS` (`demographicsHerald.js:72-80`, `quantityWords :124-131`: a few souls … thousands); DS-POP-1 (annex :597, :625) | **no roll of persons exists** — the population is a NUMBER, never an enumeration; the column is OPEN by construction and can never carry `closed: true`; there is no per-office head count ("the bailiff counts every one") anywhere |
| `whoIsExempt` | `{office \| trade \| route, from: dutyKind, provenance}` or null | **NOTHING.** `grep -rni exempt src` finds only code and CSS comments (`index.css:336`, `App.jsx:715`, `theme.js:61`, …). The one typed exemption FAMILY the world holds is a treaty TERM between settlements (`RECEIPT_POOLS_TRADE.md:924` "Toll exemption on the {route}: honored", the peace-terms family `peaceTermsCatalog.js`) — a route's exemption from a toll, never a person's exemption from a count. `factionCompetition.js:90` `tithe_rights` and `:97` `trade_immunity` are LAW PREFERENCES an archetype WANTS, not exemptions granted | the column is NULL on every settlement today; a writer is a schema/persistence addition — **owner-gated** (§4) |
| `whatItDoes` | duty phrases from a closed source | the catalog `desc` (e.g. `institutionalCatalog.js:1054-1059` Customs house "Levies duties…"); the seeded variants `institutionDescVariants.js:1-15` (canonical-at-zero, fnv over seed+name), e.g. `:866-868`; the identity side-car `institutionVocabulary.js:1-40` (display, byte-inert), e.g. `:204`; the defence projection `defenseInstitutionBuckets.js` (`standingDefenseForces` answers present/count/names from the LIVE roster); the backing faction `institutionProfile.js:182-192` (category alignment, coarse) and the finite basis phrases `powerSupport.js:58-75` | the desc is PROSE about the KIND, not typed duty; the walker reads it as the licence for a duty NOUN the desc itself names and for nothing else (§1.3) |
| `whatItDoesNotDo` | status and impairment | `status` in {ruined, removed, destroyed, remnant} + `_worldPulseInactive` (`institutionRoster.js:30-41`); `impaired` is LIVE and functions corruptly (`:18-19`); impairments typed `corruption` (`corruption.js:677`); a service row with `on: false` is not offered | a ruined institution's duties are absent, not negated: the sentence "the watch no longer patrols" needs the ruin status (a typed prior state), never a tier overlay (R-DA-19) |
| `provenance` | `FOUNDED{year,tick}` \| `FOUNDED_UNDATED` \| `PRE_SEED`; history entries | `institutionFounding.js:44-46, 141-148` (three kinds; "ABSENCE IS THE TYPED VALUE" `:24-28`); `institutionHistory[]` entries `{name, category, fate, tier, outcomeId, reason}` + calendar stamp (`institutionLifecycle.js:908-913, 968-975`; ENGINE INPUT, last 24 kept `:901-912`); `factionSource` (sparse, ~1 per settlement, `powerSupport.js:12-17`) | `PRE_SEED` licenses "has stood since the founding" and NO year; `FOUNDED_UNDATED` licenses "founded, rebuilt or re-founded by the pulse" and NO year; the `reason` string on a history entry is engine prose and licenses the FATE word only |
| `closed` | per COLUMN, not per settlement | derivable today: `institution` closed (the roster is the set); `office`, `holderRole`, `whoIsCounted` OPEN (a sample; a number); `whatItCounts` closed to the instantiated rows; `whoIsExempt` closed-empty (null everywhere) | the npc-ladder's OQ4 asked for a per-settlement flag; this seat rules it PER COLUMN, because the Brackwater "only" quantifies over PERSONS, and persons are open on every settlement forever (§1.4) |
| `sustainerKind` / `sustainerName` | NL-4's addition | the R6 receipt's `localSustainerGone` and the institution named by the re-adjudication terminal (`reconcile-npc-ladder.md` §0, NL-4) | carried whole from NL-4; not re-measured here |

**Two "tithes" — a name collision the table must not conflate (CONFIRMED).** `foodStockpile.js:81-83, 298, 362-364, 416` `tithed` is a GRANARY mechanism (a reserve tithe under a mild deficit), surfaced as the flag `'tithe'` at `EngineSections.jsx:80`; `institutionServices.js:23` "Tithe and dues" and `economicState.js:219-227` "Church Tithes" are a CLERICAL or seigneurial levy. A sentence about "the tithe" resolves to exactly one of them by the column it was drawn from, and the walker names which. `rulingStructure.js:600-640` is a THIRD source — a prose ladder keyed on `religiousPower` thresholds that SAYS "tithes, land, and courts are all ecclesiastical" at `:624` with no tithe field behind it: that string is engine prose about the faction, and it licenses the faction's standing WORD, never a tithe duty on any institution.

### 1.3 THE RULE: no sentence names a count, an exemption or a duty absent from the table

Stated for the clerk, predicate by predicate. A sentence in any dossier register may carry an institution or office predicate only when the named column returns a non-null value for THIS settlement, and the sentence is generated FROM the value, never fitted to it afterwards (R-DA-15). **Obeys (5) verbatim, (7) FINITE SEMANTICS, (4).**

| the predicate the sentence wants | the column it must read | licensed form | refused form |
|---|---|---|---|
| X holds the office / X is the Y | `office` + `holderRole` (basis) | the role noun; "the watch captain" where a Watch Captain is on the roster with `linkToInst` matching a live watch | a holder for an institution with no linked NPC; a NAMED holder's fate (product scope) |
| X counts / collects / levies / registers Z | `whatItCounts` (instantiated service or fired income row) | "the hall keeps the rolls of freemen" where `Public records` is an instantiated service of a live City administration | any count duty on an institution whose service rows do not carry it; any count duty on an OFFICE (offices carry no service rows today — only institutions do) |
| Z is counted / Z are on the roll | `whoIsCounted` (a band) | the population band word ("several hundred souls at {settlement}") | a per-office head count; "every household is counted for the levy" (`newsVoice.js:97`, a crier line — a totality over an open column, LIVE BREACH) |
| X is exempt / X is not counted / the gate takes nothing from X | `whoIsExempt` non-null | a treaty toll exemption on a route where the term row exists | every other exemption sentence in the estate today, because the column is null everywhere — including `RECEIPT_POOLS_DOSSIER_STATE.md:5233` "(the same quarters taxed hardest, the same trades exempt)", written under an `occupation_legacy` header (`:5231`) whose own scope says nothing beyond an occupation happened is entailed (LIVE BREACH, the Brackwater fault already shipped) |
| X does Y | `whatItDoes` (a duty noun the desc/identity/service names) | "the customs house takes duties on the river trade" from `:1054-1059` | a duty the desc does not name; a summary paragraph of the institution (fault 9; R-DA-15's gazetteer form) |
| X no longer / cannot / does not do Y | `whatItDoesNotDo` (status, impairment, `on:false`) or the LACK move | "the citadel is rubble" from `status: 'ruined'`; "there is no watch" from the roster's absence of one (R-DA-02's LACK, licensed by the world holding the lack — `contradictions.js:162-180` computes exactly this) | "no longer serves" from a tier overlay (U12 #34); a negation with no status behind it |
| X was founded / rebuilt / has stood since | `provenance` | "stood since the founding" from `PRE_SEED`; "rebuilt" from a history entry with `fate` | a year from `FOUNDED_UNDATED`; any history on a state-only field (R-DST-B, A6) |
| every / all / only / none / the one | `closed` on the QUANTIFIED column | "every institution" (closed); "the only mill" ONLY when the roster holds exactly one and the catalog row carries the kind-exclusivity (`institutionDescVariants.js:451` the banalité mill is a KIND fact and stays for the refuter to grade) | "the only person", "every household", "everyone" — persons are OPEN on every settlement; H-4's closed-world clause governs |

**Two guards carried from the registers.** (a) An office enters as a duty performed or a transaction (NL-4 guard b; R-DA-15's "by its procedure"), never as a summary. (b) A relation between two institutions or an institution and a faction is named only where a join field holds it — `factionSource`, `linkToInst`, `institutionLink`, the backing-faction category rule — and two names on one roll are two names (best-ai.md §26; D10).

### 1.4 The Brackwater sentence, walked through the table

The owner's block (read to the owner in chat at 02:27; not a corpus line — no file in the scratchpad or the dock carries it, CONFIRMED by grep):

> sentence 1 — a count of souls at Brackwater and a bailiff who counts every one of them at the tithe · sentence 2 — the catch goes upriver salted · sentence 3 — the priest is the only person the bailiff does not count.

| clause | column consulted | result on the product as it stands | what WOULD license it |
|---|---|---|---|
| "three hundred souls" | `whoIsCounted` | the population is held and banded; "three hundred" is a digit-class count outside `QUANTITY_BANDS` (A4/U11) — REFUSED as a figure; "several hundred souls" is the licensed word | nothing more: the band word |
| "the bailiff" | `office` | no bailiff office exists on any settlement (zero hits) — REFUSED as an office noun | an NPC with `role: 'Bailiff'` (a role-catalog addition — engine-side, golden-bound, owner-gated at the fixture) linked to a live institution |
| "counts every one of them" | `whatItCounts` × `closed(whoIsCounted)` | no count duty on any office; and "every one" quantifies over persons, an OPEN column — REFUSED twice | a count-duty service row on the bailiff's institution licenses "keeps the roll"; the totality is NEVER licensed, because persons are never closed |
| "at the tithe" | `whatItCollects` | licensed only where "Tithe and dues" (`institutionServices.js:23`) is instantiated on a live Village headman, or a "Church Tithes" income row fired — and it must be the clerical tithe, not the granary flag (§1.2) | that row |
| "the catch goes upriver salted" | not this table — a goods/route fact | `resources[].flow` (`schema` ResourceEntry, produced/imported/scarce/blocked) and the trade route license a flow WORD; "salted" is a processing claim needing a supply-chain row (`supplyChainState`); "upriver" a route fact | the flow field and a chain row; otherwise REFUSED as a spatial and capacity fact on a state field (U12's #14/#37 class) |
| "the priest" | `office` | High Priestess exists as a structural role (`factionRoles.js:42`) with `linkToInst` to a temple; "priest" as a role is not on the catalogue — PLAUSIBLE that a priest-class role resolves through the religious archetype; the walker resolves the noun to the linked role or REFUSES | a linked religious role on the roster |
| "is the only person the bailiff does not count" | `whoIsExempt` × `closed(whoIsCounted)` | `whoIsExempt` is null everywhere — REFUSED; and even with an exemption row, "the only person" is a totality over the open persons column — REFUSED again | an exemption row `{office: priest, from: tithe-count}` licenses "the priest is not counted at the tithe" — a flat row fact. The "only" is never licensed: H-4's closed-world clause, NL-4's guard (a), and this seat's per-column ruling agree |

So the kicker is refused today on three independent grounds (no office, no count duty, no exemption row) and would remain refused on one ground (the quantifier) after every row the owner might add. **The licensed kicker is the row fact without the "only".** That is the whole lesson in one line: a row licenses a noun and a predicate; only a closed column licenses a quantifier.

### 1.5 The table's home, decided vetoably

The table is a pure derived projection — proposed home `src/domain/institutions/institutionTable.js`, a headless leaf beside `institutionRoster.js` that imports the roster accessor (so the ruin-filter walker `tests/lint/ruinFilterRoster.walker.test.js` reaches it), `institutionFoundingOf`, `governingFactionOf`, `quantityWords`, and reads the settlement's instantiated services. It is display-side and byte-inert to every golden (`PROSE_INVENTORY.md` §7.5 / A16), so BUILDING it is a lane car under the delegation grant. **What is owner-gated:** persisting any row (a schema/persistence shape); adding an `exempt` writer or a `bailiff` role (engine-side, golden-bound); showing the table on the DM page (D10 — a product surface, owner-signed). Judgment-ledger §3 classes, all named. **Obeys (7) THE PROMISE (nothing persisted, nothing re-labelled), (3) a licence not a template.**

### 1.6 What the table is NOT

Not a closed vocabulary of offices (NL-4 guard c: a per-settlement projection — an office the settlement lacks is an absence, and the line does not name it). Not a template that fills a slot per row (ruling 3; R-DA-15's gazetteer form: the function DEVELOPS in the entry, and the bare roll is rare). Not a runtime gate (§2.5). Not a substitute for the STATE-KEY: a dossier block's `**STATE-KEY.**` line (annex `:794`, `:838`, `:896`, …) licenses the block's STATE words; the table licenses the block's INSTITUTION words; a sentence may need both.

### 1.7 The absent slot, per register — the ruling (4) decision this file must state

A null column is "the record holds nothing here", never "there is no such thing". So the exemption slot is never written as "no one is exempt" (a world claim the world does not hold — best-ai.md §24 in reverse) and never as the hedged non-statement (§29). What is written instead follows each register's own absence ruling, which this file adopts unchanged and binds to the table:

| register | ruling on a null table column | source |
|---|---|---|
| dossier-archivist | three classes: a civic LACK the world holds is WRITTEN flat (R-DA-02; "there is no watch" from the roster); a typed not-held absence with provenance is WRITTEN as a fact of the record (R-DA-08; `PRE_SEED` / `FOUNDED_UNDATED` are exactly such fields); a slot the place's rank-form does not carry is OMITTED unannounced. A null `whoIsExempt` is the THIRD class: omitted. | `reconcile-dossier-archivist.md` §4 |
| npc-ladder | an office or sustainer the world has no fact for is an absence and the line does not name it; the neutral noun ("the paymaster") covers the two terminal paths | NL-4 |
| herald-pools | OMIT at the push tiers (R3/R4/R5); WRITE only in R4b, pull-only, naming a gap in the RECORD and never a state of the world | H-11, §6 |
| chronicle-line | a section, term or family the ledger does not hold is OMITTED, never stubbed; a limit of the record is written only when its flag is true | §7 classes 2–3 |
| dm-page | OMITTED — no "no entry"; the REASON for a public absence only where the engine holds one as a field | §5 |
| chrome / docent | chrome writes the account's EMPTY STATE from a typed count; the docent writes "none" only from a typed empty in the registry, else omits the slot | §6 |

**Obeys (4) verbatim** — full form is the row; full content is what the columns hold; the absent-slot decision is stated, per register, above.

---

## 2. THE SAME-ENTRY CONTRADICTION WALKER

### 2.1 What it reads

The walker takes ONE ENTRY at a time — a rendered unit with its typed context — and reads three things:

1. **The entry's sentences,** as the corpus holds them: for R1/R2 a variant with `{blockId, poolKey, angle, marks, slots}` (the leaves `src/data/dossierStateProse/*.generated.js` and `dossierCausalProse.generated.js`, loaded the way `check-pair.mjs:12-33` loads them; the annex `docs/content/*.md` by RAW-BYTE scan, because the numbered-line join truncates 13 rows and under-reads wiring 8 against 129 — PROBE_ALL_REFUTATION R-5); for R6 a ladder line with its key `{role, situation, causeClass, stage}` and its receipt `{priorCause, localSustainerGone, ageBand}` and the bearer's `gender` (a loader owed — npc-ladder OQ2); for R7 an institution row with its desc, variants and services; for the Herald a receipt with its typed fields and its crier line (`newsVoice.js`); for the chronicle a span or letter with its flags.
2. **The entry's own typed facts** — the ground the sentence must resolve to: the block's STATE-KEY (annex `**STATE-KEY.**` lines) and the demoted dimensions `STATE_MARK_DIMENSIONS` (`stateProseKernel.js:165-200`: severity, deficit, anchor — law 5, `:40-49`: a pool partitioned by a dimension the caller has not answered is UNREADABLE, and a wrong sentence is worse than none); the INSTITUTION TABLE (§1); the provenance fence (state field vs event-provenance field — A6/R-DST-B); `QUANTITY_BANDS` and the six-band time vocabulary (`check-pair.mjs:37-39`); the audience mark (`dm-only`, kernel law 2); `CAUSE_CLASSES` (`causeVocabulary.js:46-62`, fourteen, "NOTHING outside this list is ever attributed").
3. **The pool's sibling variants** — the other variants of the same pool cell (same key ⇒ same state ⇒ they must agree in structural fact) and the sibling POOLS of the same block (different bands of one axis — `check-pair.mjs:47-59` `axisOf`/`bandSiblingsOf`), which is where a contrast's rejected alternative may lawfully live (A8).

### 2.2 The contradiction classes (typed; each with its detection and a corpus example)

| class | what contradicts what | detection (mechanisable now / refuter) | example on the estate |
|---|---|---|---|
| **C1 · a count vs a count** | two count words for one quantity inside an entry or across a pool cell; a count NOUN moved (souls → households moves the band); a count word outside `QUANTITY_BANDS` and the authored magnitude words | mechanisable: the `COUNT` set (`check-pair.mjs:39, 72-73`) extended with multiplier words (NL-4 arm c) and the digit class; per-cell comparison of band words | U11 #4 (souls → households); #32 "the two or three places"; NL-4's three price multiples |
| **C2 · a duty vs an exemption** | an entry asserts an office counts/collects Z and, in the same entry or cell, that some Z is not counted, with `whoIsExempt` null; or an exemption asserted anywhere with the column null; or a count duty on an office/institution whose `whatItCounts` is empty | mechanisable: the office-noun lexicon (the role catalogue + the institution roster names) × the duty-verb lemma set {count, collect, levy, register, tithe, tax, toll} × the exemption lemma set {exempt, spared, not counted, takes nothing} → table lookup; FAIL on a null column | `RECEIPT_POOLS_DOSSIER_STATE.md:5233` (an exemption on a null column); `newsVoice.js:97` (a count duty on "every household") |
| **C3 · a state vs its provenance** | a historical, causal, actor, capacity or spatial clause on a state-only field (R-DST-B); a mark-dimension word on a variant the state does not mark; an absence sentence with no typed absence field (R-DA-08); a pronoun against `gender` (NL-4 a); a sustainer named against the terminal path (NL-4 b); a year on `FOUNDED_UNDATED` | LEXICAL half mechanisable: past-tense verbs, actor verbs, capacity words ("can house"), spatial words ("arranged around") on a variant whose block carries no event-provenance field → FAIL; the mark check → FAIL; the gender and sustainer arms by fixture composition → FAIL. SEMANTIC half (is this clause historical?) → WITHHELD for the refuter (A6 is not mechanisable) | U12 #14, #19, #37, #34, #32 (`:2247`, a war doctrine under `economicBase: extraction`); the 234 gendered R6 lines against a 50/50 field; the 156 "syndicate destroyed" lines on a two-path terminal |
| **C4 · a modality spent (B-CLAIM)** | between a BEFORE and an AFTER, or between an entry and its cell: a future indicative added, a subjunctive removed, a threat class changed, a quantifier added (every/all/only/none/the one), a totality asserted over an OPEN column, a claim added or dropped | mechanisable: `check-pair.mjs:123-124` (will/shall, would) inherited; a quantifier lexicon × `closed(column)` → FAIL; a threat-class word set per the Herald's kind vocabulary → FAIL on change; the antithesis-shape arm (`:82-87`) inherited | the Brackwater "only"; the illustration refuter's three REFUTED pairs (the pattern B-CLAIM names) |
| **C5 · sibling vs sibling** | two variants of one pool cell disagree in a STRUCTURAL fact (geography, population band, calendar, outcome, the institution named, the office); with the SMALL-PARTICULARS ALLOWANCE — a name form, a date's shape, a wording may differ and neither is corrected (R-DA-09, D11, CL-3; Wolfe 41 is the device the checker must not erase) | mechanisable for the typed facts (band words, office nouns, status words, quantifiers) per cell → FAIL; the allowance is a WHITELIST of particular kinds, not a tolerance number | the R12 quiet-week pool (four lines, one claim) is the HOLD case: same claim, four shapes, no contradiction |
| **C6 · a relation gestured at** | two institutions, an institution and a faction, or an office and an institution rendered as related ("backed by", "answers to", "in the pay of") where no join field holds it | mechanisable: relation lemmas × the join set {`factionSource`, `linkToInst`, `institutionLink`, backing-category, `controlsInstitutionIds`} → FAIL | best-ai.md §26 (fault 26 — the Brackwater sentence's own fault per NL-4); the R6 off-key office lines (90, an upper bound owed adjudication) |

**Obeys (5) the second owed consequence verbatim; (6) C4 is B-CLAIM made executable; (7) THE PROMISE (a same-seed world's sentences stop contradicting its own state — NL-4); FINITE SEMANTICS (every resolution is a typed lookup, never a regex over free prose — the regex is the DETECTOR of a candidate noun, the TABLE is the judge).**

### 2.3 What it reds on, and the two channels

Following the chair's 13:22 ruling (a note channel or a withheld verdict is not a gate), every class above carries a limb that FAILS:

- **FAIL** — an assertion that resolves to NO field or to a NULL column (C2, C3-lexical, C6), a quantifier over an open column (C4), a typed fact contradicted inside the cell (C1, C5), a modality added or removed against the BEFORE (C4). The report per entry: `{entry id, clause, class, column consulted, value, sibling id}`; the run reds on any FAIL. SIZE at the freeze: **zero unresolved** over 2,734 R1/R2 variants and 4,626 A-U rows (R-DA-20's figure), and over R6's 1,662 lines and R5's 373 lines once their loaders exist.
- **WITHHELD** — the semantic half of C3 (is this clause history?), the band half of A8 (the R4-BAND pattern, `check-pair.mjs:88-107`), the kind-exclusivity of a catalog desc (`institutionDescVariants.js:451`). Withheld is REPORTED with the field consulted and goes to the Opus refuter per item; it never counts as a pass.
- **NOTE** — a pre-existing debt the entry neither causes nor cures (the A11 PRE-EXISTING pattern at `check-pair.mjs:118`) and the audience mark (`:66`).

A rewrite may not ADD a FAIL; the corpus at the freeze may hold no FAIL. Those are two different gates (§2.6).

### 2.4 The negative control, and the anti-vacuity guard

**Negative control (the Brackwater fixture).** The owner's three sentences are composed as a fixture entry against three fixture tables, and the walker must return exactly:

| fixture table | expected verdict |
|---|---|
| (a) no rows (the product today) | FAIL on "the bailiff" (C2/no office), on "counts every one" (C2 no duty + C4 quantifier), on "three hundred" (C1), on "is the only person … does not count" (C2 null exempt + C4 quantifier); WITHHELD on "goes upriver salted" (C3 semantic) |
| (b) rows for a bailiff office, a count duty, an exemption `{priest, from: tithe-count}`, `closed(whoIsCounted)=false` | FAIL on the two quantifiers ONLY; every noun and predicate resolves |
| (c) as (b) with `closed(whoIsCounted)=true` — a SYNTHETIC fixture the product can never produce | PASS — which proves the arm keys on the flag and not on the noun, and is the reason the flag is per column |

**Positive control.** A corpus sentence that resolves fully must PASS — the DS-POP-1 banded count; a `PRE_SEED` "has stood since the founding"; a LACK from the roster ("there is no watch"). And the NL-4 fixture: one ladder line rendered for a bearer of each `gender` — FAIL on one, PASS on the other.

**Anti-vacuity guard (the assertion-that-cannot-fail family).** The walker's own test asserts that, run over the SHIPPED corpus at 3b1c0eaa5, it fails on the known breaches — `RECEIPT_POOLS_DOSSIER_STATE.md:5233` (C2), `:2247` (C3-lexical), `newsVoice.js:97` (C4 totality), the gendered R6 lines (C3 arm a) — or the instrument is not reading and the run is red for THAT reason. An instrument that passes a corpus it has never once failed is the hazard the estate has already recorded (`contractTestAntiVacuity.walker.test.js` is the house pattern).

### 2.5 Where it runs — the gate, never the draw

The walker runs in the RECONSTRUCTION LANE'S GATE: as a `tests/lint/*.walker.test.js` (the house convention — `kindPoolFloors`, `ruinFilterRoster`, `goldenFreeze` all live there) over the leaves, the annex by raw bytes, and the R6/R5/R7 sources once their loaders exist; and in the projection's `--check` mode (`scripts/generate-dossier-state-prose.mjs:31, 40`) so a doc row that fails cannot be projected. It NEVER runs at runtime: `stateProseKernel.drawVariant` (`:296-304`) is `hash(seed::blockId::poolKey) % eligible.length`, and a draw-time refusal would change `eligible` and move every later index — a SEED INPUT under §7.1 and A7, owner-gated under THE PROMISE (the chair's 13:22 rule names exactly this). A refused variant is therefore rewritten IN PLACE at the freeze — never removed, never reordered — and the pool's length and key never move (A7/A17).

Relation to the two runtime checkers the estate already has: `domain/validation/consistency.js` (a display trust gate for publish/export, food/export spine, `classification: 'invalid'`, `severity: block|warn`) and `domain/contradictions.js` (narrative tensions — `:75-82`, six types; `:162-180` computes the enforcement LACK the table reuses). The same-entry walker is neither: it is a corpus/build-time instrument over TEXT against FIELDS. It may share their record shape `{id, type, classification, description, references}` so a report renders in the same UI; it must not be wired into either path without an owner decision (a runtime seam is a product surface).

### 2.6 Relation to `check-pair.mjs`

`check-pair.mjs` is the PAIR instrument: BEFORE against AFTER for one rewrite, with the pool's other variants as inputs (v2, S12A-CHECKPAIR). The walker is the ENTRY instrument: one entry against its fields and siblings, no BEFORE needed. The division:

| arm | check-pair v2 today | the walker |
|---|---|---|
| SLOTS differ (`:67-68`), DIGIT/PERCENT/EM DASH/EXCLAMATION (`:69`), LONGER (`:70`) | pair | — (surface rules; the walker does not re-implement them) |
| DURATION added (`:37, 71`); COUNT added/lost (`:39, 72-73`) | pair | C1 at the entry: the count word must ALSO resolve to a band the field holds |
| R4 sibling KEY (`:74-76`); R4-BAND withheld (`:88-107`) | pair | C5 inherits the sibling machinery; the band half stays WITHHELD |
| THREE+ SENTENCES (`:78`), RATIONED WORD (`:80-81`), ANTITHESIS SHAPE (`:82-87`) | pair | C4 inherits the shape arm for the modality count only |
| A11 spread + shared opener (`:108-121`) | pair | — (the MOVE-GRAMMAR walker's; not this file's) |
| FUTURE INDICATIVE / SUBJUNCTIVE REMOVED (`:123-124`) | pair | C4 at the entry: a bare future on ANY variant fails (STATE never FATE), not only one added by a rewrite |
| EXISTENTIAL / PRONOUN CLOSER (`:125-129`) | pair | — |
| **a claim against a FIELD** | **absent** (R-DA-20's measured gap: v2 tests no claim against a field) | C2, C3, C6 — the walker's reason to exist |
| office / exemption / quantifier | absent | C2, C4 |
| gender × pronoun; sustainer × path | absent; no R6 loader (`:16-33` reads the dossier leaves and the causal table only) | C3 arms a and b; the loader is a prerequisite car (npc OQ2) |

Proposed composition, vetoable: the walker is a module (`walker-entry.mjs` in the scratchpad first, then the `tests/lint` walker) exporting `walkEntry(entry, ground) → {fails, withheld, notes}`; `check-pair.mjs` v3 imports it and adds one line per pair — `walkEntry(AFTER) − walkEntry(BEFORE)`: a rewrite may not add a FAIL, and a pre-existing FAIL is reported as debt (NOTE) so the pair instrument stays a pair instrument. What stays the refuter's, unchanged: A6's semantics per item, A8's band half, claim-preservation as a whole (`check-pair.mjs:136`: a mechanical pass is not a claim-preservation verdict).

**Obeys (6) B-CLAIM (the arms are exactly the four things a rewrite may not spend); (3) the walker judges claims, never order — order is the MOVE-GRAMMAR walker's, and the two must not be one instrument or a claim rule will be mistaken for a shape rule; (7) A7/A17/THE PROMISE decide the gate's placement.**

---

## 3. THE CLERK RULE, STATED FOR EVERY REGISTER

The rule is one sentence and it does not vary by register: **a sentence is licensed by a typed field or it is not written; an effect is never bought with a fact; the kicker is allowed only when its fact is on the table.** What varies is what "a field" IS in that register, what the kicker is, and what the register already rules. Each row names the register's own rule so the fold can bind rather than restate. **Every row obeys (5) directly and (7) FINITE SEMANTICS; the absent-slot column carries (4).**

| register | what "a field" is here | the kicker, and its licence | the absent slot | the register's own rule this binds |
|---|---|---|---|---|
| **dossier-archivist** (R1, R2, R7, R8, A-U/A-W) | the block's STATE-KEY and marks; the INSTITUTION TABLE (§1); an event-provenance field for any history, cause, actor, capacity or spatial clause (R-DST-B); a typed absence field for a declared gap; `QUANTITY_BANDS` and the six time bands | the closing standing fact (R-DA-04 lands on the civic noun the block's own field names); a gnomic closer only where the family states it and never created (A9, R-DA-12); the CONSEQUENCE move only with (event-provenance × household) (R-DA-19). The Brackwater kicker was a consequence sentence with no field. | three classes: LACK written, not-held-with-provenance written, rank-less slot omitted (§1.7) | R-DA-15 (the table), R-DA-20 (the walker), R-DA-08, R-DA-09, R-DA-14, R-DA-19 |
| **npc-ladder** (R6) | the key `{role, situation, causeClass, lifecycleStage}` and the receipt `{priorCause, localSustainerGone, ageBand}`; `gender`; the table for any office outside the bearer's | the standing-fact close, varied in kind, never the verdict (NL-7); the cost lands on the office and travels (NL-12); no price, no multiple, no superlative or only-construction (NL-4) | an office or sustainer the world has no fact for is not named; the neutral noun covers the two terminal paths | NL-4 (the Brackwater rule for R6, four walker arms), NL-5, NL-6, NL-11 |
| **herald-pools** (R3, R4, R4b, R5) | the receipt's typed fields (kind, bucket, party, bill); the table for any office, exemption, count, actor or relation; the closed-world clause for any totality | the moving line is rationed and most entries carry none; a Herald line closes on a standing fact of varied kind — no moral, no summary, no hook (H-9); a second sentence is a second FACT or nothing (H-2) | OMIT at R3/R4/R5; WRITE at R4b only, pull-only, a gap in the record never in the world (H-11) | H-4 (the licensing spine; the closed-world clause), H-2, H-3, H-6, H-9, H-11 |
| **chronicle-line** (R11, R12) | a span, count, flag, section or term field for the frame; the persisted headline bytes for the body (borrowed, never re-authored); a RECORDED provenance edge for any cause; a typed rating field for any rating word | the quiet small close; the elegy as a standing fact at most once a year (CL-10); no verdict, maxim or absolute the field does not hold (CL-7 — "Honest posture" is the Brackwater form) | a lived empty span is WRITTEN in one sentence; a limit is written only when its flag is true; a family the ledger does not hold is OMITTED, never stubbed; the generic floor never reaches a reader | CL-3 (no composed cause; the small-particulars allowance), CL-7, CL-8, CL-12 |
| **dm-page** | the event-provenance field for a cause; the truth field for a rumour's version; the engine's own null for a gap; the INSTITUTION TABLE shown as a table (D10) | the dry verdict, the irony, the aside — routed here and rationed to one per page, in juxtaposition, never a joke told (D5); the answer to a plant is the literal sentence, never an interpretation (D8) | OMITTED — no "no entry"; the reason for a public absence only where the engine holds one | D1 (the why only from a typed field), D10 (the table's home), D11 (persistence as a new fact; small particulars), D13 |
| **chrome and the docent** (R9, R16, R10) | a capability the code holds (the canon-write path, a measured timing, a registry field); the operation registry's typed fields for the docent (undo, options, surface) | none in chrome — a product sentence persuades by what the product does (CC-6); the docent's entry closes on the thing (CC-13) | chrome WRITES the empty state from a typed count; the docent writes "none" only from a typed empty and omits an undefined slot | CC-6 (the Brackwater lesson in its chrome form), CC-12 (the registry-field test is the docent's walker) |

**The register-invariant corollaries.**

1. **A comparison is a measurement in words, never a figure** (R-DA-11, W 30 via H-4): a multiple, a ratio or a "more than" is licensed only by two fields it compares.
2. **A relation is named or absent** (§2.2-C6): never "connected to", "in the pay of", "backed by" without a join.
3. **A quantifier is licensed by a closed column, never by a row** (§1.3, H-4): a row licenses a noun and a predicate; "every", "only", "all", "none" need `closed: true` on the column they range over, and persons are never closed.
4. **The historical or civic fact is never asked of a model** (best-ai.md §31; R-DA-20): the AI layer is a clerk over the table and the fields, never a writer of them (`aiGrounding.js`, `aiOverlayVerifier.js` are the estate's existing fence and are not re-specified here).
5. **The kicker's ration is the register's own** (H-9, R-DA-12, D5, CL-10): being licensed by a field is necessary and not sufficient — a licensed fact placed as the moving line still counts against the register's moving-line rate.

---

## 4. WHAT STAYS THE OWNER'S, AND WHAT IS DEFERRED IN WRITING

**Owner-gated (judgment-ledger §3 classes, named):**
- persisting any row of the table (schema/persistence shape); an `exempt` writer; a `bailiff` or any new office in the role catalogue (engine-side, golden-bound — the fixture);
- showing the table on the DM page (D10) — a product surface, owner-signed;
- any runtime seam for the walker (publish/export gate) — a product surface;
- the R6 `gender` read and the SUSTAINER slot (shape changes — NL-4, npc C8/OQ9);
- the honest-absence rate and shape per register (Q5) and the LACK move's rate (Q19);
- the crier line at `newsVoice.js:97` and the annex line at `RECEIPT_POOLS_DOSSIER_STATE.md:5233` are LIVE BREACHES of §1.3 in shipped copy — a cure is a text shift on a public surface, owner-signed at the walk; recorded here, not applied.

**Deferred, recorded (not bugs to re-find):**
- the R6, R5 and R7 LOADERS for the walker (npc OQ2 names the first; the other two are the same shape) — prerequisite cars before the SIZE "zero unresolved" is measurable on those registers;
- per-line adjudication of the 90 off-key R6 office lines (an upper bound), the 16 `will` lines and the 64+12 interior lines (npc OQ1) — the refuter's, before any byte moves;
- the kind-exclusivity question (`institutionDescVariants.js:451`, the banalité mill) — WITHHELD to the refuter; the walker must not decide it;
- whether "priest" resolves through the religious archetype's structural role (§1.4, PLAUSIBLE) — a fixture answers it in one run;
- the `resources[].flow` × supply-chain licence for a processing or route clause ("goes upriver salted") — the trade family's, not this table's; named so the fold does not lose it.

**Deliberately NOT done here:** no walker built, no table built, no fixture written, no corpus byte moved, no dock file edited. The taste sample the owner walks must show the walker's report beside each pair (A14), and the walker must exist before that sample is cut — sequencing that the fold owns.

---

## 5. PROVENANCE

Read in full this session: `sweep/reconcile-{dossier-archivist,npc-ladder,herald-pools,chronicle-line,dm-page,chrome-and-compendium}.md` (every rule that licenses a sentence by a field, and each register's absence ruling); `PROSE_INVENTORY.md` §3 and §7; `RULES-V2-DRAFT.md` Part A, A′, B0, B (B-CLAIM, B-GRAMMAR); `sweep/best-ai.md` provenance, §24–§31 and the closing notes; `sweep/CHAIR-ANSWERS-S12.md` (the 13:05 and 13:22 additions); `taste-sample-refutation.md` U11/U12; `check-pair.mjs` (every arm, by line). In the dock `laneB6` at 3b1c0eaa5, read only: `src/domain/institutions/{institutionRoster,institutionCatalog,defenseInstitutionBuckets}.js`, `src/domain/{institutionClassify,institutionFounding,rulingPower,contradictions,npcProfile}.js`, `src/domain/dossier/powerSupport.js`, `src/domain/settlement.schema.js` (the SimNpc, SimFaction, SimInstitution, Institution, NPC, NpcProfile typedefs), `src/domain/display/stateProse/stateProseKernel.js`, `src/domain/display/{institutionVocabulary,institutionProfile,newsVoice}.js`, `src/domain/worldPulse/{demographicsHerald,foodStockpile,causeVocabulary,factionCompetition,institutionLifecycle}.js`, `src/domain/validation/consistency.js`, `src/data/{institutionalCatalog,institutionServices,institutionDescVariants}.js`, `src/generators/{factionRoles,npcStructure}.js`, `src/generators/npc/factionRoleCatalog.js`, `src/generators/power/rulingStructure.js`, `src/generators/economy/economicState.js`, `src/components/dossier/EngineSections.jsx`, `scripts/generate-dossier-state-prose.mjs`, `tests/lint/` (the roster), `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (the STATE-KEY lines, `:5225-5240`, `:2247` by the dossier reconcile), `docs/content/RECEIPT_POOLS_TRADE.md:924`. Executed: `grep -rni "bailiff|tithe|exempt|priest|officials"` over `src/domain src/data src/generators docs/content` (bailiff 0; exempt 0 in data; the hits cited above); the `priorityCategory` and `tags` vocabulary counts over the catalog. Not read: `peaceTermsCatalog.js` beyond the grep line `:237`; `aiGrounding.js` / `aiOverlayVerifier.js` (named as the existing AI fence, not re-specified); the Opus drafts and refuters of the six registers beyond what the reconcile files judged.

**No rule here is applied. No corpus text changed. Nothing is validated until the Fable chair's retrovalidation sitting.**

Seat: Fable 5.1 — the S12 judgment seat; ratified by the Fable chair at the next ledger act.

---

## 5. SUPERSEDED OR AMENDED PASSAGES — stamped by the chair's sitting (2026-09-07 17:16 EDT; §0–§4 byte-unchanged,      239 lines)
| passage | amendment |
|---|---|
| §1.2 "`exempt` appears only in comments" | 239 hits over `src`, 58 outside comment lines, a live typed `exempt: true|false` at `demographicsLand.js:347/:351`; the column conclusion (no exemption FAMILY) stands (SITTING B.4.8) |
| §1.3 the two LIVE BREACHES | FOUR: `newsVoice.js:97` · `RECEIPT_POOLS_DOSSIER_STATE.md:5233` + its leaf twin `general.generated.js:855` · `factionDynamics.js:466` (SITTING A6) |
| §2.4 the three Brackwater fixtures | a FOURTH is owed — rows `closed: true` at the ROW while the COLUMN is false — the only table that discriminates per-column from per-row (SITTING B.4.7) |
| §3 as "adopted whole" by Part B §9 | adopted with two amendments: the chronicle's floor is a LIVE fallback until the ratchet lands; the ladder's neutral-noun interim is a declared B-CLAIM breach the owner signs or refuses (SITTING B.4.3) |
| §4 "the walker must exist before the taste sample is cut" | the sample proceeds on the existing instruments (check-pair.mjs + the refuter + printed claim sets); the walker's receipt on the sample is OWED and is the instrument lane's first product (SITTING §F.4, vetoable) |

### §2.4.1 — THE GUARD ROSTER, AMENDED (chair, 2026-09-07 23:2x; SITTING §L.2 item 63)
The anti-vacuity guard anchors on SIX shipped breaches, present-then-absent: the four the lane shipped (`newsVoice.js:97` C4 totality; `RECEIPT_POOLS_DOSSIER_STATE.md:5233` C2; `factionDynamics.js:466`; the fourth as shipped) plus `RECEIPT_POOLS_DOSSIER_STATE.md:2247` (C3-lexical) and the shipped gendered R6 lines (C3 arm a). A wave car that cures an anchor names its replacement anchor in the same car and lowers the `failing > 4` floor deliberately (the successor procedure lives in the walker's docblock; INSTR car 9, cure 17).

### §1.2 — NOTE (chair, 2026-09-07; SITTING §L.2 items 61–62)
`whatItCounts` sources the settlement's INSTANTIATED services, which the code resolves as `availableServices` (no field is named here; no ratification was owed). A column is `closed: true` only when every source this table names for it is read by the code; `whatItCounts`, `whatItDoes`, `whatItDoesNotDo` are `closed: false` until then; `holderRole`'s basis is `'absent'` while its value is a hardcoded null.

### §2.6.1 — THE C-PAIR CLAIM KEY CARRIES ITS SITE (chair, 2026-09-08; SITTING §M.2 item 52)
"A rewrite may not ADD a FAIL" is enforceable only when a finding is keyed on its SITE (the text or offset) as well as its class, arm and column; a class-only key reads a second fault of an inherited class as `added 0`. The pair instrument's `claimKey` carries the site, and `notExecutable` is the union of BEFORE and AFTER. (INSTR car 10, cure 9.)

### §1.2 — NOTE 2 (chair, 2026-09-08; SITTING §M.2 item 55)
The C2 office arm's keyword half licenses by VOCABULARY (`ROLE_CATEGORY_KEYWORDS`: `sheriff`, `constable`, `sergeant` are held by no instantiated role list). A wave car authoring such an office cites an instantiated role or WITHHOLDS; the walker's docblock declares the looseness beside its fourth-source note.
