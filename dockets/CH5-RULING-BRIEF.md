# CH-5 RULING BRIEF — separating the magic-dependence job from the trade vocabulary

- **Lane:** TE-CH-5-PREP (read-only). **Chair:** Fable 5. **Slot:** `79b78881ca86612ec312602c2e3dc6d06aa34df8`.
- **Instrument:** plain `node` over a `git archive 79b78881c -- src` snapshot in scratchpad. No worktree,
  no vitest, no `npm run check*`, no repo file touched.
- **TOTALITY CONTROL, and every number below is licensed by it:** the harness regenerates all **525**
  committed golden-master hashes at the slot with **0 mismatches**
  (`tests/fixtures/generator-golden-master.json`). It is the real engine, not a model of it.
  The live control that it can *detect* a change is Shape F's 187 moved rows.

---

## 1 · THE RECOMMENDATION, FIRST

**Yes, separate them — and the separation is exactly ONE MEMBER WIDE, and the vocabulary half of it
is free.**

> **RULE SHAPE F.** Remove `alchemy` — and only `alchemy` — from `ARCANE_INST_TAGS`, into a sibling
> trade list in the same zero-import leaf. Then delete the now-redundant `arcane` tag from the three
> `none`-licensed rows (`Alchemist shop`, `Alchemist quarter`, `Warden's Lodge`) so the authored tag
> and the declared licence **agree at the data level** instead of being ordered by a precedence rule.

Do **not** take the packet's own Shape 1 (route the arcane gate through the licence) as the ruling.
It is a defensible patch, but it does not answer the question CH-5 was convened to ask: it leaves
`ARCANE_INST_TAGS` doing two jobs permanently and adds a **sixth** precedence rule to a subsystem that
already has six competing authorities.

**Why F, in one sentence:** F removes the divergence; Shape 1 orders it.

**This is a REPAIR.** It is the chair's to rule. Reasoning in §6.

**It unblocks MF-CH2B.** Measured (probe5): with the three rows stripped of `arcane`, all six
`none`-licensed catalog names fail `magicForms`' ARCANE GATE, so under CH2B a magic-free world holds
`forms: []` and `tests/domain/magicForms.test.js`'s STOP arm goes green — *without* editing a worldPulse
file and *without* re-stating the ladder's own authored table.

---

## 2 · GROUND TRUTH, RE-DERIVED (and where it disagrees with the brief I was given)

`ARCANE_INST_TAGS = ['arcane', 'planar', 'alchemy', 'enchanting']`
— `/Users/cstokes/Desktop/settlement-engine/src/domain/arcaneInstitutionVocabulary.js:38`

Catalog: **311** `(tier, category, name)` triples over **276** distinct normalised names.

### 2.1 Every member, and who carries it

| member | distinct names | triples | the names |
|---|---:|---:|---|
| `arcane` | 20 | 22 | Traveling hedge wizard · Hedge wizard · Druid Circle · Wizard's tower · Elder Grove Council · Alchemist shop · Warden's Lodge · Teleportation circle · Mages' guild · Alchemist quarter · Enchanter's shop · Scroll scribe · Golem workforce · Undead labor · Dream parlors (high magic) · Airship docking (high magic) · Message network (high magic) · Academy of magic · Mages' district · Planar embassy |
| `planar` | 2 | 2 | Planar traders · Planar embassy |
| `alchemy` | 2 | 2 | Alchemist shop · Alchemist quarter |
| `enchanting` | 1 | 1 | Enchanter's shop |
| **any member** | **21** | **23** | — |

`magicLicense` is declared on **25** distinct names / **28** triples: `none` 6 · `low` 5 · `medium` 3 ·
`high` 11. No catalog row carries a literal `magic`/`magical` tag, and none sets `magical: true`.

### 2.2 Every reader of `ARCANE_INST_TAGS` at the slot

| # | reader | file:line | what it decides | licence-first today? |
|---|---|---|---|---|
| 1 | `tagsAreArcane` → the `ARCANE_BY_CATALOG_NAME` index, and the caller's own-tags path in `isArcaneInstitution` | `src/domain/arcaneInstitutionIdentity.js:49` | the authored arcane verdict for a name | index no; `isArcaneInstitution` **yes** (MF-CH2A) |
| 2 | `isArcaneInst` → `filterCatalogForMagic`, `filterServicesForMagic` | `src/domain/magicFilter.js:38` | the UI institutional grid + `store/selectors.js:87`, `components/InstitutionalGrid.jsx:406` | no |
| 3 | the faction-boost eligibility filter under `magicExists === false` | `src/generators/factionCorrelation.js:183` | whether a dominant faction may legalise a row | no |
| 4 | `carriesExplicitMagicMetadata` → the generation **WORLD LAW** (`allowsInstitution`, `allowsRole`, `allowsService`) | `src/generators/generationContext.js:101`, used at `:136 :241 :262 :276` | whether a candidate may exist in a magic-free world | no |
| 5 | the re-export | `src/domain/magicFilter.js:13` | spelling compatibility only | — |
| — | tests | `tests/domain/arcaneIdentity.test.js:40,232` · `tests/lint/arcaneClassifierCensus.walker.test.js:79` | — | — |

Downstream consumers of #1: `institutionCatalogArcaneTag` has **exactly one** `src/` caller —
`src/domain/customContent.js:139`. `isArcaneInstitution` has **exactly one** —
`src/generators/institutionProbability.js:302`.

### 2.3 ⚠ THREE PLACES WHERE MY MEASUREMENT DISAGREES WITH THE BRIEF I WAS GIVEN

**(a) `magicForms`' ARCANE GATE does not read `ARCANE_INST_TAGS` at all.**
`src/domain/worldPulse/magicForms.js:177` sets `ARCANE_GATE_TAG = TAG.ARCANE` — the single string
`'arcane'` — and `:324` asks `institutionHasTag(institution, ARCANE_GATE_TAG)`, i.e. declared tags
**or** the keyword backfill `/mage|wizard|arcane|spellcast|sorcer|conjur|enchant|magus/i`
(`src/lib/entities.js:172`). Measured: **20** catalog names pass the gate, **all 20 by the declared
`arcane` tag, 0 by backfill.** So the extra members of `ARCANE_INST_TAGS` are *not* what makes
`magicForms` red. The red is caused by three rows carrying the literal `arcane` tag while licensed
`none`.

**(b) The licence-vs-tag conflict is FOUR rows, not three.** The "three" is the count *within the
`none`-licensed subset*. Censused over all 276 names:

| row | tags | licence | tag says | licence says |
|---|---|---|---|---|
| `Alchemist shop` | `arcane`, `alchemy` | `none` | arcane | mundane |
| `Alchemist quarter` | `arcane`, `alchemy` | `none` | arcane | mundane |
| `Warden's Lodge` | `arcane`, `military` | `none` | arcane | mundane |
| `Healer (divine, 1st level)` | `divine`, `healing` | `low` | mundane | **arcane** |

The fourth moves the other way and is already resolved licence-first inside `isArcaneInstitution`.

**(c) Deleting the `arcane` tag leaves FIVE names still tag-arcane, not two.**
`Alchemist shop` → `[alchemy]`, `Alchemist quarter` → `[alchemy]`, `Enchanter's shop` →
`[enchanting]`, `Planar traders` → `[planar, trade]`, `Planar embassy` → `[planar, exotic]`.

### 2.4 The finding that decides the ruling: **`alchemy` is the only member that is not a magic claim**

Four independent estate authorities were asked, none of them by me:

| authority | `arcane` | `planar` | `enchanting` | `alchemy` |
|---|:--:|:--:|:--:|:--:|
| `textAssertsFunctionalMagic` — the world law's own prose detector (`src/domain/magicAssertionText.js`) | ✅ | ✅ | ✅ | **❌** |
| `INSTITUTION_KEYWORD_TAGS` arcane row (`src/lib/entities.js:172`) | ✅ | ❌ | ✅ (`enchant`) | **❌ (no `alchem` stem)** |
| the rows' own `magicLicense` | — | `high`, `high` | `high` | **`none`, `none`** |
| `entityTags.js`'s own sectioning | "Knowledge + magic" (`:68`) | A+ P1.6 block beside `METALWORK`/`LEATHER`/`TEXTILE`/`TIMBER`/`SHIPBUILDING` (`:110-117`) | same block | same block |

`planar` and `enchanting` name practices that cannot exist without magic, and both of their rows are
licensed `high`. `alchemy` names a chemical trade — which is exactly what R-INST-5 ruled and what
MF-CH2A's `magicLicense: 'none'` records. **The trade-vocabulary defect is one member wide.**

### 2.5 The wider picture the chair should see: **six authorities, not two**

A catalog row's magic-dependence is currently answerable by six different mechanisms:

1. `magicLicense` (25 names) — MF-CH2A, declared.
2. `ARCANE_INST_TAGS` membership (21 names).
3. `ARCANE_INST_KW` name keywords (24 names, 39 members).
4. the display bucket: `category ∈ {Magic, Exotic}` and `priorityCategory === 'magic'`.
5. `TAG.ARCANE` through `institutionHasTag` (20 names) — `magicForms` only.
6. `def.magical === true` (0 rows — dead over the catalog).

Measured pairwise disagreement: licence vs tag = **4**; licence vs keyword = **5**
(`Alchemist shop`, `Alchemist quarter`, `Warden's Lodge`, `Dragon resident`, `Great library`); tag vs
`TAG.ARCANE` gate = **1** (`Planar traders`). And **`ARCANE_INST_KW` is now fully redundant over the
catalog**: all 24 names it matches declare a licence, so it decides nothing a licence does not already
decide — while contradicting it on 5. That is the bigger defect, and §7 hands it to a future car.

---

## 3 · THE CANDIDATE SHAPES, MEASURED

Blast radius was measured two ways: **(i)** a verdict census of all six predicates over all 276 names,
and **(ii)** same-seed regeneration of the 525-row golden corpus *and* a 511-row grid × 5 magic cases
(`magicExists:false`, `priorityMagic` 0/20/50/80) = **2,555 settlements**, diffed by record hash, by
roster, and by JSON path template with array indices collapsed to `[*]`.

⚠ The default corpus alone would have been a **vacuous** instrument: every `ARCANE_INST_TAGS` reader
except `magicForms` fires only when magic is off, so the 525-row golden never exercises them. That is
why the 5-case sweep is the measurement of record.

### Shape 1 — route the arcane gate through the licence *(the packet's own recommendation; the estate's default reach)*

`classifyMagicForm` asks `institutionCatalogMagicLicence` first, tag only where none is declared.
One file: `src/domain/worldPulse/magicForms.js`.

- **Engine readers moved:** only `classifyMagicForm`. 5 catalog verdicts flip — out:
  `Alchemist shop`, `Alchemist quarter`, `Warden's Lodge`; in: `Healer (divine, 1st level)`,
  `Planar traders` (both classify to `null` today, so they are latent, not live).
- **Ladder effect:** 18 form-bearing catalog names → 15. Lost: `Alchemist shop` (practitioner),
  `Alchemist quarter` (guild), `Warden's Lodge` (circle). Gained: none.
- **Same-seed blast radius: ZERO shipped bytes.** `magicForms.js` has **no `src/` importer**. Closure:
  `magicForms` ← {`magicFormsPractitioner`, `magicRegimeLifecycle`} ← **{}**. `subsystemRowsWaves.js`
  names it only inside a `module:` *string*. The estate's own certification text says so:
  *"eventTypeCounts carries no magic_regime_ event type at all while the lane is unwired."*
  **118 of 525** corpus settlements would present a different form set to that unwired ladder —
  mostly `["practitioner"] → []`, i.e. the settlement's only magic presence vanishing. Real, and
  entirely deferred to the day someone wires K2.
- **Test bill:** reds 2 rows of `tests/domain/magicForms.test.js`'s hand-written ladder table
  (`:143 Alchemist shop → practitioner`, `:148 Alchemist quarter → guild`) — the table supplies tags
  inline, so a licence-first gate contradicts the ladder's own authored statement of itself.
  No golden re-record.
- **Verdict: rejected as the ruling.** It does not separate the vocabularies. It answers a
  **participation** question ("is this a realization of the world's magic?") with a **dependence**
  field ("does this need magic to exist?"). Those are different questions — an alchemist licensed
  `none` is not thereby *non-magical in a high-magic city*; it is *not magic-dependent*. Shape 1
  bakes that conflation into the one field every surface reads.

### Shape 2 — split `ARCANE_INST_TAGS` *(the packet's option 2, as written: `alchemy` and `enchanting` leave)*

- **Measured: 0 verdict changes on all six predicates over all 276 names.** Both `alchemy`-carrying
  rows and the one `enchanting` row also carry `arcane`, so nothing moves.
- Correct in the small, but it removes `enchanting`, which every other estate authority (§2.4) treats
  as a genuine magic claim, and it leaves `isArcaneInstitution({tags:['enchanting']})` reading mundane
  — which reds `tests/domain/arcaneIdentity.test.js:245` and is, I think, simply wrong.
- **Verdict: right instinct, one member too wide.** Shape F is this shape, trimmed.

### Shape 3 — the licence is authoritative *except* where the tag disagrees *(the packet's option 3)*

Reinstates the divergence as a rule. Refused by the packet and refused here for the same reason.
Additionally: it is the reading R-INST-5 explicitly rejected for the alchemist.

### Shape D — one authority: the licence, at **every** reader, with a completeness ratchet

Extend `declared ?? inferred` to `magicFilter`, the world law and `factionCorrelation`, plus a ratchet
requiring every arcane-family-tagged row to declare a licence.

- **Measured verdict changes:** `magicFilter` 6, world law 6, `factionCorrelation` 5, `magicForms` 5,
  `institutionCatalogArcaneTag` 1.
- **This is MF-CH2B's own change, plus Shape 1.** CH2B already prices its half at **1,025 of 2,520**
  rosters. Adopting D as CH-5 would be CH-5 swallowing CH2B.
- **Verdict: out of scope.** CH2B owns the five gates; CH-5 owns the vocabulary.

### Shape E — delete the magic-dependence job from the tag set entirely

- **Measured: 21 of 276** `institutionCatalogArcaneTag` verdicts flip to mundane. Every arcane
  institution in the catalog stops being *authored* arcane; the answer survives only in a field 25
  rows declare and 251 do not.
- **Verdict: rejected.** It replaces a mixed vocabulary with no vocabulary, and it strands every
  non-catalog entity (custom content, imported rosters), where there is no licence to fall back on.

### ⭐ Shape F — the recommendation

**F-i** — `ARCANE_INST_TAGS = ['arcane', 'planar', 'enchanting']`, plus
`TRADE_INST_TAGS = ['alchemy']` in the same zero-import leaf, with a header paragraph saying which
question each list answers.

**F-ii** — the three `none`-licensed rows drop the redundant `arcane` tag:
`Alchemist shop` → `['alchemy']`, `Alchemist quarter` → `['alchemy']`, `Warden's Lodge` → `['military']`.

| | golden 525: hashes / rosters | sweep 2,555: hashes / rosters | by magic case |
|---|---|---|---|
| **F-i alone** | **0 / 0** | **0 / 0** | 0 in all five |
| **F (F-i + F-ii)** | **187 / 0** | **409 / 0** | `magicExists:false` **0** · `pm0` **0** · `pm20` **0** · `pm50` 174 · `pm80` 235 |

**F-i is provably free.** **F's cost is a golden re-record of the mildest class**: zero rosters, zero
rng movement, zero array-length movement outside the tags arrays themselves, and — crucially — **zero
change in any magic-free or low-magic world**, which is precisely the region CH2B is about. The two
cars do not interfere.

**Path-template census of F at `priorityMagic: 80`** (525 settlements, deep-diffed field by field,
indices collapsed):

```
$.institutions[*].tags[*]                                  212 removed / 177 rows
$.institutions[*].tags.length                              212 lenmoves / 177 rows
$.defenseProfile.institutions.magicDef[*].tags[*]          163 removed / 163 rows
$.defenseProfile.institutions.magicDef[*].tags.length      163 lenmoves / 163 rows
$.simulationTrace[*].downstreamEffects[*]                  284 removed / 249 rows
$.simulationTrace[*].downstreamEffects.length              284 lenmoves / 249 rows
$.simulationTrace[*].downstreamEffects[*].target            10 changed / 10 rows
```

Seven templates. Four are the tag string leaving. The other three are one effect —
`{ target: 'magicCapacity', effect: 'reinforced' }` — leaving `assembleInstitutions`' trace, emitted by
`tagsToDownstream` (`src/generators/steps/assembleInstitutions.js:73-90`), which its own docstring
calls a *"light heuristic"* and which feeds nothing but the trace. **No capacity, economy, magic-profile
or roster number moves anywhere.** The alchemist simply stops being *reported* as reinforcing magic
capacity — which is the correct reading once the estate has ruled alchemy is chemistry.

**Test bill for F** (grep-derived; no test was executed by this lane):

| test | what moves | note |
|---|---|---|
| `tests/property/generatorGoldenMaster.test.js` | **187 of 525** re-record | needs a SHIFT RECORD row; the docstring's protocol applies |
| `tests/lint/magicLicenceCensus.walker.test.js` `:106-109`, `:256-258` | the divergence roster and the three `ARCANE` assertions | **this walker exists to force exactly this statement** — reddening it is the car working, not failing |
| `tests/domain/magicForms.test.js` | the STOP arm goes **green** under CH2B; the ladder table `:141-152` stays green (it supplies tags inline) | the point of the shape |
| `tests/domain/arcaneIdentity.test.js` `:228` | self-adjusting (the loop reads `ARCANE_INST_TAGS`) | `:245` `tags:['enchanting']` stays green because F keeps `enchanting` |
| `tests/lint/facetInferenceHonesty.walker.test.js` | not moved — it pins `Warden's Lodge` on a `/den/` **name** regex, not the tag | verified by reading |

---

## 4 · WHY F OVER SHAPE 1, STATED PLAINLY

1. **It answers the question.** CH-5 was convened to ask whether the magic-dependence job should be
   separated from the trade vocabulary. Shape 1 does not separate anything; it adds a precedence rule
   and leaves `alchemy` inside the magic-dependence list forever.
2. **It removes a divergence instead of ordering one.** After F, tag and licence agree on every row.
   After Shape 1 the estate permanently ships rows whose authored tag says `arcane` and whose gate says
   mundane, cured only where someone remembered to consult the licence. Five hand-typed arcane
   vocabularies already exist (§7). The sixth reader to reach for the tag re-opens the bug.
3. **It does not conflate dependence with participation.** Shape 1 rules, silently, that the magic-forms
   ladder is a dependence question. It is not, and nobody has decided that it is.
4. **It leaves the ladder's own authored table intact.** Shape 1 reds two rows of the table in which the
   ladder states what it *is*.
5. **The cost is smaller than it looks and lands where nothing is at stake.** 187 golden rows sounds
   larger than Shape 1's zero, but Shape 1's zero is an artifact of an **unwired subsystem** — its true
   semantic delta is 118 of 525 settlements, deferred to whoever wires K2 and invisible until then.
   F's 187 is a tags-array re-record with 0 rosters and 0 movement in any magic-free world.

**Honest cost of F that Shape 1 does not carry:** a declared golden shift, and a re-statement of the
`magicLicenceCensus` walker's divergence roster. Both are cheap and both are visible, which is the
point.

**Sequencing.** F-i is free and should land regardless of how the chair rules on F-ii — it costs
nothing, it is corroborated by four independent estate authorities, and it makes the "just fix the
tags" cure *available* for the first time. If the chair wants to unblock CH2B with the absolute
minimum, land F-i now and rule F-ii with CH2B's own declared shift.

---

## 5 · CONSTITUTIONAL CHECK

| law | F | Shape 1 |
|---|---|---|
| **THE PROMISE** — a seed is a starting world forever; lived history immutable | **Clean, with one thing said out loud.** Institution tags are *stamped at generation* and persisted; no store, migration or rehydration path re-reads `institutionalCatalog` (verified: zero `institutionalCatalog` importers under `src/store`, `src/application`, `src/kernel`). A saved world keeps its stored tags and is untouched. Only NEWLY generated worlds differ → a **declarable shift**, not a rewrite. ⚠ Consequence to state in the shift record: two worlds generated either side of F will disagree about the same institution. That is what the Promise *requires*, not a defect. | Clean — worldPulse only, and unwired. |
| **DEITY DOCTRINE** — faith is culture, never theological | **Not grazed by F.** But see §7.3: the doctrine is *already* grazed at the slot, by MF-CH2A. | ⚠ **Grazed, latently.** Shape 1 gates `Healer (divine, 1st level)` **onto** the arcane ladder by its `low` licence. It classifies to `null` today so nothing happens — but the moment a rung word catches a divine role, the ladder will assert that divine healing is arcane magic. Shape 1 makes a theological claim reachable that is currently unreachable. |
| **FINITE-SEMANTICS** — typed buckets, AI a clerk | Clean. F *increases* type honesty: two named lists answering two named questions. | Clean. |
| **Product scope** — setting-agnostic, world-only, never a named character | Clean. | ⚠ Adjacent: `magicFormsPractitioner.mintTiedPractitioner` mints a **named person** off the forms ladder. Unwired today (`ensureTiedPractitioner` has no `src/` caller), so not live — but Shape 1's 118-settlement form-set delta becomes 118 settlements gaining or losing a named NPC the day K2 is wired. |

---

## 6 · REPAIR OR NEW CAPABILITY

**REPAIR. The chair's to rule; not the owner's.**

- **F-i** reclassifies one member of an internal vocabulary with a **measured zero output delta** over
  2,555 same-seed settlements in all five magic cases. Nothing new is generated and nothing existing
  changes. It cannot be a new capability; it is a correction to a name.
- **F-ii** removes a tag string from three catalog rows so each row agrees with the `magicLicense` the
  estate **already declared and landed** in MF-CH2A. It creates no field, no rung, no surface, no
  behaviour. The engine can do nothing after F that it could not do before.
- None of the owner-gated classes is touched: no deploy or push, no migration, no schema or
  persistence-shape change (`tags` is an existing array on an existing row), no public-API surface, no
  data deletion, no security posture, no paid-surface behaviour.
- **The one thing that IS owner-facing and must be recorded, not decided quietly:** F-ii moves the
  generator golden (187 of 525) and therefore is a **declarable shift** under the estate's own shift-record
  law. It is the mildest class — 0 rosters, 0 rng, tags-array only — but it is a shift and it needs its
  row in `tests/property/generatorGoldenMaster.test.js`'s SHIFT RECORD and in
  `docs/GOLDEN_SHIFT_LEDGER.md`, stating the legitimate cause.

For contrast: Shape D (making the licence authoritative at all five gates) **is** CH2B, and CH2B's
1,025-of-2,520 roster shift is the thing already queued for the owner. CH-5 must not swallow it.

---

## 7 · NOT CH-5 — findings a future car should own, recorded so they are not re-found

1. **`POWER_DOMAIN_TAGS.arcane` is a hand-typed duplicate of `ARCANE_INST_TAGS`.**
   `src/domain/npcProfile.js:399` — `arcane: ['arcane', 'alchemy', 'planar', 'enchanting']`, the same
   four members, **not** derived from the zero-import leaf. It does a legitimately *different* job
   (power-domain affinity, where an alchemist genuinely *does* belong to the arcane power), so it should
   keep all four — but as an explicit union of the two lists, not a fifth typing of them. The leaf exists
   precisely to stop this drift, and this site slipped past it. **A split that does not touch this site
   ships a silent divergence.**

2. **A second, parallel tag vocabulary.** `src/data/geographyData.js:5-30` declares
   `ARCANE`/`ALCHEMY`/`ENCHANTING`/`PLANAR` (and ~25 more) alongside `src/data/entityTags.js`'s `TAG`.
   Two spellings of the estate's canonical tag vocabulary, either of which can drift from the other.

3. **⚠⚠ THE DEITY-DOCTRINE EXPOSURE, ALREADY SHIPPED AT THE SLOT — the largest thing I found.**
   `ARCANE_INST_KW` carries `'healer (divine'`, `'divine healer'`, `'druid circle'`, `'elder grove'`,
   and MF-CH2A landed `magicLicense: 'low'` on `Healer (divine, 1st level)` (tags `['divine','healing']`,
   `priorityCategory: 'religion'`, shelved under Magic). The combined effect is that **a magic-free world
   can hold no divine healer** — struck at the slot by the keyword list *and* by the licence. Under
   DEITY DOCTRINE ("faith is culture, NEVER theological") that is a theological ruling: it says the god's
   healing was functional magic, so without magic there is no healer. A magic-free world can obviously
   hold a temple healer who is a herbalist with a liturgy. **This is live now, not introduced by CH-5, and
   it deserves its own car.** Any shape that makes the licence the single authority freezes the claim into
   the one field every surface reads.

4. **`ARCANE_INST_KW` is now fully redundant over the catalog and wrong on 5 of 24.**
   Measured: the 39-member keyword list matches **24** distinct catalog names, **every one of which
   declares a licence**, and it contradicts the licence on **five** — `Alchemist shop`,
   `Alchemist quarter`, `Warden's Lodge`, `Dragon resident`, `Great library`. It therefore decides
   nothing about a catalog row that the licence does not already decide, while being wrong more often
   than the tag list is. Its only remaining job is **non-catalog** names. A car should retire it from
   catalog-row decisions and keep it as the free-text fallback it has become.

5. **The unanchored-substring residual is still open.** `magicFilter.isArcaneInst` runs `ARCANE_INST_KW`
   through bare `includes()` while `arcaneInstitutionIdentity` anchors at a word boundary (the
   'mage' in 'PILGRIMAGE' case). Recorded in `docs/DESIGN_REALM_MAGIC_TOGGLE.md:514-519` as
   "Chair to schedule"; still unscheduled.

6. **The whole magic-forms subsystem is unwired.** `magicForms.js`, `magicFormsPractitioner.js` and
   `magicRegimeLifecycle.js` have **no `src/` importer** — test-only. `ensureTiedPractitioner` (which
   mints a named NPC) has no caller at all. Whoever wires K2 must re-price every shape ruled here,
   because the 118-of-525 form-set delta and the NPC mint both go live at that moment.

7. **Dependence ≠ participation, and the ladder has no authored answer to the second question.**
   `magicLicense` answers *"does this need magic to exist?"*. The forms ladder asks *"is this a
   realization of the world's magic?"*. Nothing in the catalog answers the second. Sooner or later the
   ladder needs its own authored field (`magicForm:` on the row), not a borrowed one.

8. **`customContent.js:139` consults the catalog tag for a user-typed name *before* testing its own
   pattern.** `inferInstitutionCategory` calls `institutionCatalogArcaneTag(name)` in the arcane branch
   before `pattern.test(name)` ever runs, so a player who names their building exactly after a catalog
   row inherits that row's classification regardless of the surface's own vocabulary. Benign today; a
   trap the moment a catalog tag moves.

9. **CH2B's `allowsMagicClaim` allowlist must be the UNION, not `ARCANE_INST_TAGS` alone.** CH2B's
   J-TECH2-10 cure derives its closed-classification allowlist from `['magic','magical', ...ARCANE_INST_TAGS]`.
   Under F that list no longer contains `alchemy`. **No live hazard** —
   `textAssertsFunctionalMagic('alchemy')` is already `false`, measured — but the cure's *principle* is
   "a bucket name is not a sentence", which is true of every tag. It should read
   `[...ARCANE_INST_TAGS, ...TRADE_INST_TAGS]` so the next trade tag that happens to be a prose word is
   covered by construction rather than by luck.

---

## 8 · WHAT THE CHAIR IS BEING ASKED TO SIGN

1. **Rule F.** `alchemy` leaves `ARCANE_INST_TAGS` for a sibling `TRADE_INST_TAGS`; the three
   `none`-licensed rows drop their now-redundant `arcane` tag.
2. **Classify it a REPAIR** — chair-ruled, not owner-gated.
3. **Accept one declared shift:** 187 of 525 golden rows, 0 rosters, 0 movement in any magic-free or
   low-magic world, cause = the tag string leaving three catalog rows. SHIFT RECORD row required.
4. **Accept that `tests/lint/magicLicenceCensus.walker.test.js`'s divergence roster is re-stated** — that
   walker was built to make this statement mandatory, and re-stating it is the walker succeeding.
5. **On that ruling MF-CH2B leaves DRAFT**: with the three rows de-tagged, all six `none`-licensed names
   fail `magicForms`' ARCANE GATE, a magic-free world holds `forms: []`, and the STOP arm goes green with
   **no worldPulse file edited**.
6. **Note for the record** that Shape 1's zero blast radius is an artifact of an unwired subsystem, not
   of the change being small — and that it makes a deity-doctrine claim reachable that is currently
   unreachable.

---

### Appendix — reproduction

All measurements are re-runnable, read-only, gate-free:

```
git -C <repo> archive 79b78881c src | tar -x -C <dir>          # slot snapshot, no worktree
ln -s <repo>/node_modules <dir>/node_modules
echo '{"type":"module"}' > <dir>/package.json
node <dir>/probe6.mjs        # per-shape verdict census over 276 names
node <dir>/probe7.mjs        # magicForms ladder delta
node <dir>/dump.mjs out.json # 525-row golden corpus, hashes + rosters
node <dir>/magicsweep.mjs s.json   # 511-row grid x 5 magic cases = 2,555
```

Probes and corpora live under
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/695a70c5-80ee-4ebd-b806-a8c102244d16/scratchpad/`
(`ch5-slotsrc`, `ch5-shapeF`, `ch5-shapeFi`, `base-525.json`, `shapeF-525.json`, `shapeFi-525.json`,
`base-sweep.json`, `shapeF-sweep.json`, `shapeFi-sweep.json`).
