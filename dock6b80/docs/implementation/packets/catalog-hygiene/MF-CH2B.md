# Catalog hygiene / MF-CH2B — THE MAGIC LICENCE, LIVE: all five shelf-reading gates stop deciding a catalog row by its display bucket, a magic-free world gets its alchemist and its library back, and the goods vocabulary leaves the institution gate

- **Status:** DRAFT
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `b2852ccc3cc4753499996da6582dd672e90499d0`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-2**, **`[OPUS-RUN · FABLE-VALIDATION OWED]`**
  (owner directive **ODQ §484**). Third car of the catalog-hygiene train and the second half of
  a **serial pair** — it is built ON TOP of `MF-CH2A` and cannot be landed before it.
- **Charter and rulings:** `draft-CATALOG-HYGIENE-PLAN.md` §2(b)–§2(f), as re-shaped at
  **ODQ §501.4 / §503 / §505**. Re-derived at this base; **five charter claims are corrected by
  execution** and they are listed in `MF-CH2A` §0.2 and §1 below.

---

## §0.0 · ⛔ STOP — THIS CAR IS BUILT AND HELD, NOT READY. ONE RULING DECIDES IT.

Everything below is built, measured and green on its own acceptance (nine arms, nine mutants),
and the pair's whole-suite sweep at this tip is **13 failed of 22,344 tests over 1,725 files**
(1,704 files passed, 8 skipped).

**THE THIRTEEN, CLASSIFIED BY EXECUTION AT THE CLEAN BASE — not by lookup.** Seven are the
banked set (ODQ §507.3 / §509.1, cited rather than re-derived per the chair's throttle §511.2);
one is this pair's own DEFERRED census row, which rides the packet to the landing act (§417);
**three more are PRE-EXISTING**, proved by running them in a detached worktree at the clean base
`b2852ccc3` where they fail identically —

| pre-existing red | why it is not this car's |
|---|---|
| `tests/docs/enforcement-claims.test.js` | six naked claims, every one in `docs/FABLE_VALIDATION_QUEUE.md`, `docs/GOLDEN_SHIFT_LEDGER.md` or `packets/foreign-policy/IN-0C.md` — files this lane never opened |
| `tests/domain/metronomeCooldownLint.test.js` | `razingExecution.js` stamps a condition with no cooldown; a worldPulse file, untouched here |
| `tests/lint/clampPrimitiveBaseline.test.js` | the baseline names 75 files and the tree has 62; the missing rows are cartography and conquest files |

**AND FOUR ARE THIS CAR'S OWN**, all green at that same clean base. Three are re-record or
coverage classes the chair can price; **the fourth cannot be cured inside this car's files at
all, and it is why the status above says DRAFT:**

| this car's red | what it is |
|---|---|
| `tests/generators/powerEconomyFreshness.test.js` | one pinned scenario's faction power moves — `Arcane Orders` 5 → 6, `Merchant City Council` 19 → 18. A pinned-scenario re-record, downstream of the roster |
| `tests/domain/intentAtlasSoakDistiller.test.js` | the committed soak distillate no longer reproduces byte for byte. A committed-artifact re-record, same cause |
| `tests/generators/effectReachability.coverage.test.js` | **a COVERAGE LOSS, and the one of the three that is not just a number.** 2 of 12 authored effects stop firing in the pinned corpus: `chain.magicSubstitution.substituted` and `repair.isolation_support`. The roster reshuffle stops exercising two authored strata; that wants a corpus widening or a stated reason, not a re-record |
| `tests/domain/magicForms.test.js` | **the STOP** — below |

⚠ Every one of these four is downstream of a single true fact: **a magic-free world now contains
institutions, and a number of surfaces in this estate were written when it did not.**

> `tests/domain/magicForms.test.js` — *a `none`-magic world holds NO magic form anywhere in the
> corpus* — now fails. A `magicLevel: 'none'` settlement holds `forms: ['practitioner']`.

**THE MECHANISM, traced.** `classifyMagicForm` (`src/domain/worldPulse/magicForms.js:319-331`)
opens with an **ARCANE GATE**: *"A row that does not read arcane is not on this ladder at any
rung."* That gate reads the authored **TAG**, and this car deliberately left the tag reader
alone (J-TECH2-3) so `customContent.js`'s user-authored-name surface would not move. So the
licence and the tag now disagree in production, and different consumers give different answers —
**which is the exact bug class this train exists to end.**

**THE CONFLICT IS EXACTLY THREE ROWS**, censused over all seven `none`-licensed rows:

| row | licence | tags | on the arcane ladder? |
|---|---|---|---|
| `Alchemist shop` | `none` | `arcane`, **`alchemy`** | yes |
| `Alchemist quarter` | `none` | `arcane`, **`alchemy`** | yes |
| `Warden's Lodge` | `none` | `arcane` | yes |
| the two `Adventurers' charter hall` rows | `none` | `military`, `adventuring` | no |
| `Dragon resident` | `none` | *(none)* | no |
| `Great library` | `none` | `education` | no |

**AND THE OBVIOUS DATA FIX DOES NOT WORK — measured, not assumed.** Deleting the `arcane` tag
from those three rows leaves `Alchemist shop` and `Alchemist quarter` still reading ARCANE,
because **`alchemy` is itself a member of `ARCANE_INST_TAGS`** (`['arcane', 'planar', 'alchemy',
'enchanting']`). That list is a **TRADE vocabulary being used as a MAGIC-DEPENDENCE
vocabulary** — and stating that is the deepest thing this lane found. `alchemy` describes what
the shop *does*; it cannot also decide whether the shop needs magic to exist, and the licence is
the field that was invented to answer the second question.

**THE THREE LAWFUL SHAPES, for the chair.**

1. **Route the arcane gate through the licence** — `classifyMagicForm` asks
   `institutionCatalogMagicLicence` first and the tag only where no licence is declared, exactly
   as the five gates do. One production file (`src/domain/worldPulse/magicForms.js`), in the
   worldPulse layer, and it changes what magic forms a settlement holds — content, so it is the
   chair's and not this lane's. **Recommended**, because it is the same sentence the car already
   makes, applied to the surface that still disagrees.
2. **Split `ARCANE_INST_TAGS` into a trade vocabulary and a magic-dependence vocabulary.** The
   honest root fix, and much larger: `alchemy` and `enchanting` leave the arcane list, which
   moves `isArcaneInstitution`, `magicFilter`, the world law and `customContent` together. A car
   of its own.
3. **Do not let the three arcane-tagged rows into a magic-free world** — i.e. the licence is
   authoritative except where the tag disagrees. **Refused as a recommendation**: it reinstates
   the divergence by rule instead of removing it, and it is the reading R-INST-5 explicitly
   rejected for the alchemist.

⛔ Until one of those is ruled, **this packet is not mintable and must not be landed.**
`MF-CH2A` is unaffected by any of it: it is complete, green, READY and independently landable —
its own arm A7 is written for the pre-CH2B world and the re-pointed version below only applies
once this car lands.

---

## §0 · ⛔ READ THIS FIRST — THE DECLARED SHIFT IS THE LARGEST IN THE CH TRAIN

**1,025 of 2,520 same-seed settlements change their institution roster.** That is not a
surprise met at a battery; it is the point of the car, priced before the first edit, and the
chair should rule on the number before this lands.

| magic case | settlements | rosters changed | of those, confined to licensed rows | with collateral |
|---|---:|---:|---:|---:|
| `magicExists:false` | 504 | **356** | 1 | 355 |
| `priorityMagic:0` | 504 | **356** | 1 | 355 |
| `priorityMagic:20` | 504 | **168** | **157** | 11 |
| `priorityMagic:50` (the default) | 504 | **3** | 0 | 3 |
| `priorityMagic:80` | 504 | **142** | 103 | 39 |
| **total** | **2,520** | **1,025** | 262 | 763 |

**Three things make that number readable.**

*First, the default world barely moves.* At `priorityMagic:50` — what an unconfigured
settlement gets — **3 of 504** rosters change. The shift is concentrated in exactly the worlds
where the bug lived: magic-free ones, and the low and high extremes of the dial.

*Second, the collateral has one mechanism and it is structural, not a defect.* At
`assembleInstitutions.js:268` the world law returns **before** the `rng.chance` draw at `:342`.
A row the world law newly ALLOWS therefore consumes a draw it used to skip, and every later
draw in that step shifts. Five rows returning to a magic-free world is what re-sequences 355 of
them. This is the same mechanism the chair already ruled on for `religiousCenter` at ODQ
§503.4; the rng-preserving cure available there is **not** available here, because there the
fix was to un-suppress ONE named group and here the whole point is that the world law's ANSWER
changes for a measured set of rows. Hard-coding which rows may draw from a side stream would be
the "probe, not a shippable design" the chair rejected, applied to a much larger set.

*Third, the alternative is priced.* **Design B** — keep the unanchored `ARCANE_INST_KW`
substring veto inside the world law, so only the keyword-free rows return — costs **545 of
2,520** instead of 1,025, executed and measured, not estimated. It is a one-hunk change and
`J-TECH2-5` records it as the reversal lever. This car does not take it, because it leaves the
world law deciding by an unanchored substring — the exact residual
`docs/DESIGN_REALM_MAGIC_TOGGLE.md:514-519` recorded as "Chair to schedule" — and leaves an
alchemist's shop banned from a world with no magic in it, which is R-INST-5's central finding
turned down.

---

## §1 · WHAT THIS CAR IS

Three production files. Nothing else in `src/` is touched.

| file | gate | before | after |
|---|---|---|---|
| `src/generators/institutionProbability.js` | **P1** the magic multiplier | `cat.includes('magic') \|\| inst.includes('wizard') \|\| … 8 substrings` | `declaredLicence !== null ? licensedForMagic : (the old test)` |
| ″ | **P2** `hiMagicInsts` | 11 keywords incl. `magical banking`, `enchanting quarter`, `magic item consignment` | **8** — G7's literal cure; the list stays a NAME list (§3) |
| ″ | **P3** the exotic scaler | `(cat.includes('magic') \|\| cat === 'exotic') && !NON_MAGIC_EXOTICS.some(…)` | `declaredLicence !== null ? licensedForMagic : (cat.includes('magic') \|\| cat === 'exotic')`; `NON_MAGIC_EXOTICS` deleted |
| `src/domain/arcaneInstitutionIdentity.js` | **P4** the direct world-fact gate | — | **NOT EDITED HERE.** MF-CH2A routed `isArcaneInstitution` through the licence, and `institutionProbability.js:302` reads it unchanged. That is the "one read" the charter asked for, and it means P4 costs this car zero lines |
| `src/generators/generationContext.js` | **P5** THE WORLD LAW | `carriesExplicitMagicMetadata(entity) \|\| ARCANE_INST_KW.some(kw => name.includes(kw))` | the declared licence first; the old two tests survive as the non-catalog fallback |
| `src/domain/magicFilter.js` | **UI** the institutional grid | `c === 'magic' \|\| c === 'exotic'` first | `def.magicLicense` first — read straight off the row `filterCatalogForMagic` already holds, so **no new import of the catalog** and no chunk edge |

⭐⭐ **AND A SIXTH SURFACE, FOUND BY EXECUTION AT THIS BUILD AND NOT BY THE CHARTER.**
`generationCoherence.js` walks EVERY string in a finished settlement — including its TAXONOMY
fields, `category`, `priorityCategory` and `tags[]` — and asks `worldLaw.allowsMagicClaim`
about each one. `textAssertsFunctionalMagic` is a PROSE detector, so it answers *yes* to the
bare strings `'Magic'`, `'arcane'` and `'magic'`. The consequence is the whole car's thesis
turned back on it: **the moment a magic-free world lawfully keeps a Magic-shelf row, the
settlement's own `world_law_magic` certification convicts it — for the NAME OF THE SHELF it is
filed on.** Measured before the cure, 2 of the 5 mundane-realm members failed:

```
Castelporta  town     institutions[31].category        "Magic"
                      institutions[31].tags[0]         "arcane"
                      institutions[31].priorityCategory "magic"
                      defenseProfile.institutions.magicDef[0].{category,tags[0],priorityCategory}
Lidopolis    village  institutions[20].category        "Magic"
                      defenseProfile.institutions.charter[0].category "Magic"
```

⚠ **Design B does not avoid this.** The `Adventurers' charter hall` is licensed `none` and
carries no arcane keyword, so it enters a magic-free village under B as well — and it enters
carrying `category: 'Magic'`. The collision is a property of letting ANY Magic-shelf row into a
magic-free world, not of how far the licence reaches.

**THE CURE, and it is inside a file this car already owns.** `allowsMagicClaim` no longer
convicts a candidate whose ENTIRE text is one token of the estate's closed classification
vocabulary (`['magic', 'magical', ...ARCANE_INST_TAGS]`, derived and never re-typed). A bucket
name is not a sentence; anything longer is prose and is read exactly as before. `allowsMagicClaim`
has **exactly one consumer** in `src/` — `generationCoherence.js:369` — so this narrows that
certification and nothing else, and the golden does not move by it at all (measured: 0 of 525,
because the golden grid contains no magic-free world). Arm **B7b** pins it with a four-sentence
positive control. It is recorded as a vetoable judgment because a certification is a surface the
owner reads: **J-TECH2-10**.

**Five shelf-reading gates, and `hiMagicInsts` is not one of them.** The charter numbers P1–P5
with `magicFilter` described separately as "the UI half". Re-derived here by source census, the
gates that actually read a BUCKET are P1, P3, P4, P5 and `magicFilter`'s `isArcaneInst` —
**five** — and `hiMagicInsts` reads NAMES. That renumbering is why the walker's grep arm can be
stated as an exact per-file roster (§4 arm B2).

**⚠ P5 reads the shelf at its LIVE call shape, which the charter's H21 understates.** Every
`allowsInstitution` call site spreads `category` onto the record it hands over, so
`carriesExplicitMagicMetadata` reads `entity.category === 'magic'`. The charter's "26 rows by
unanchored substring" is the keyword arm alone; measured with the real record shape the world
law strikes all **28**.

### §1.1 · Where the licence does NOT go, and why

`arcaneInstitutionVocabulary.js`'s header records that a single eager→lazy import edge closed a
chunk-level cycle and made `dist` un-bootable (lane BT, 2026-08-03; `@guarded-by
scripts/boot-smoke.mjs stage 1`). This car creates **no new module edge at all**:

* `institutionProbability.js` already imported `arcaneInstitutionIdentity.js`;
* `generationContext.js` adds an edge in the same direction that file already uses;
* `magicFilter.js` — the lazy one — imports only the LADDER, from `src/data/constants.js`, a
  **zero-import** data leaf. It never reaches for the catalog index, because
  `filterCatalogForMagic` is handed the row and can read `def.magicLicense` directly.

`filterServicesForMagic` keeps the keyword vocabulary, deliberately. It is handed service
names rather than catalog rows, so it has nothing to read a declaration off, and it has **zero
production callers in `src/`** (measured) — inventing a name lookup there would put 2,500 lines
of catalog into this module's chunk to change the behaviour of a function nothing calls. Its
docstring now says so, and says what the next caller should do instead.

---

## §2 · THE CURE, ROW BY ROW — what changes and where

Measured over the same 2,520-settlement grid, MF-CH2A → MF-CH2B, licensed rows only:

| row | licence | dead | pm0 | pm20 | pm50 | pm80 |
|---|---|---|---|---|---|---|
| `Alchemist quarter` | `none` | 0 → **92** | 0 → **92** | 0 → **96** | — | 72 → 36 |
| `Great library` | `none` | 0 → **84** | 0 → **84** | 19 → **72** | — | 84 → 72 |
| `Warden's Lodge` | `none` | 0 → **66** | 0 → **66** | 0 → 3 | 2 → 5 | 39 → 12 |
| `Alchemist shop` | `none` | 0 → **9** | 0 → **9** | 0 → **72** | — | — |
| `Adventurers' charter hall` | `none` | 23 → **32** | 23 → **32** | — | — | — |
| `Undead labor` | `high` | — | — | — | — | 23 → 83 |
| `Message network (high magic)` | `high` | — | — | — | — | 52 → 84 |
| `Dream parlors (high magic)` | `high` | — | — | — | — | 60 → 72 |
| `Golem workforce` | `high` | — | — | — | — | 133 → 144 |
| `Dragon resident` | `none` | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 | 0 → 0 |

Read plainly: **a world with no magic in it gets back its alchemists, its great library, its
warden's lodges and its charter halls** — and `Dragon resident` moves nowhere at all, which is
G6's refutation confirmed a second way (there was no divergence to cure, so curing the shelf
does not move it).

⚠ `Dragon resident` is 0 at every magic case on THIS grid, including `priorityMagic:80`, so
this grid supplies no positive control for that row. The panel's control stands (11 instances
at pm50 on its own 5-seed grid, ODQ §503.1); this lane's single-seed grid simply never draws
it. Stated rather than papered over.

---

## §3 · G7 — the literal cure, and the arm that is NOT in this car

`hiMagicInsts` loses exactly three members, each measured against all 311 catalog names before
removal: `magical banking` **0 matches**, `enchanting quarter` **0**, `magic item consignment`
**0**. The third is a member of `magicFilter`'s `ARCANE_GOODS` — a GOODS vocabulary living
inside an INSTITUTION gate — and `filterGoodsForMagic` keeps it, which arm B6 pins on both
sides. No row's hard-zero verdict changes.

**The rest of the list stays a NAME list, deliberately.** The charter's §2(b) proposed
replacing it with `licenceAtLeast(name, 'high')`. The CH skeptic panel flagged that arm and the
lane brief ordered it split out, and re-measured here that judgment holds: the licence form
would hard-zero the enchanter, the academy and the mages' district below `priorityMagic` 66,
which is a decision about **what a low-magic city contains** rather than about how the engine
identifies magic. `J-TECH2-4` carries it to the chair with its own measurement.

---

## §4 · ACCEPTANCE — EIGHT ARMS

`tests/lint/magicShelfGateCensus.walker.test.js`, a **CREATE** row.

| arm | what it holds |
|---|---|
| **B1** | **SHELF-INDEPENDENCE, executed.** All 311 rows answer identically on their own shelf and on a neutral one, across all four observable gates (P4, P5, the UI, and a normalised `getBaseChance` vector across five magic dials that cancels every shelf-CONSTANT factor). Carries its own non-vacuity floor: a synthetic licence-free, tag-free, keyword-free row IS shelf-decided, and all four probes report it |
| **B2** | **THE GREP ARM.** Every surviving shelf comparison in the four gate files carries the exact marker `@non-catalog-fallback MF-CH2`; the per-file counts are pinned (`institutionProbability` 2 · `arcaneInstitutionIdentity` 1 · `generationContext` 2 · `magicFilter` 1). The scanner distinguishes a BUCKET comparison from a TAG comparison — `tag === 'magic'` is an authored tag read R-BLD-5 rules legitimate — and a positive control proves it sees an unmarked bucket read and does not see the tag read |
| **B3** | **G3 by execution.** `Alchemist shop` and `Alchemist quarter` are reachable at `priorityMagic:20` where they were zero, and their chance no longer moves with the dial at any tier. Non-vacuity: `Enchanter's shop` still rides it |
| **B4** | **G4 — one read, two surfaces.** Row by row over all 311, `filterCatalogForMagic` and `worldLaw.allowsInstitution` still agree in a dead-magic world, and the five survivors are named as the content-profile denials they are. Both surfaces moved by 9 rows and the disagreement count did not move |
| **B5** | **G5.** `Great library`'s chance is invariant across the whole dial, it is no longer arcane, and it survives a dead-magic world on both surfaces |
| **B6** | **G7.** The `hiMagicInsts` list is pinned at its eight members; each of the three removed keywords is re-proved to match no catalog row; `filterGoodsForMagic` still strips `Magic item consignment` |
| **B7** | **The non-catalog fallback is LIVE at every gate** — a custom `Magic`-shelf entity, a keyword-named entity on a silent shelf, and a plainly mundane invented row, each answered exactly as before |
| **B7b** | **THE SIXTH SURFACE.** Eight bare classification tokens are no longer read as magic claims in a magic-free world, and four SENTENCES still are, in the same world — so the change is a narrowing to bucket names rather than a hole in the certification. A magical world is unaffected in both directions |
| **B8** | **`NON_MAGIC_EXOTICS` is gone** (from the code, not from the prose that explains why), `Dragon resident` is dial-invariant, and its inert companion `Underground city` is re-proved to sit on the metropolis **Criminal** shelf, where the test it was exempted from never fired |

---

## §4.1 · EIGHT MUTANTS, AND THE ONE THAT DID NOT COMPILE

| mutant | the edit | arms it reds |
|---|---|---|
| N1 | *(first attempt — the patch left an unbalanced parenthesis, so vitest collected **0 tests** and the run is NOT a drive. Recorded rather than quietly replaced)* | — |
| N1b | P1 sent back to deciding by the shelf, `node --check` clean first | B1, B3 |
| N2 | P3 sent back to deciding by the shelf | B1, B3, B5, B8 |
| N3 | the world law stops reading the licence | B1, B4, B5 |
| N4 | the UI grid stops reading the licence | B1, B4, B5 |
| N5 | an UNMARKED shelf comparison planted in a gate file | B2 |
| N6 | the `@non-catalog-fallback` marker stripped from an existing one | B2 |
| N7 | the goods-vocabulary keyword put back into `hiMagicInsts` | B6 |
| N8 | `NON_MAGIC_EXOTICS` resurrected | B8 |

Every drive restored `cmp`-exact with a clean control green immediately before the first and
immediately after the last.

---

## §5 · WHAT THE CAR REDDENED, AND WHY EACH RED IS THIS CAR'S TO PAY

Three ratchets outside the acceptance went red at this member and every one was **attributed by
execution** — each was GREEN at the MF-CH2A tip, which is the receipt that MF-CH2A moves no
roster and that these are the gate car's own bill.

1. **`tests/lint/magicLicenceCensus.walker.test.js` arm A7 — the arm this car is DESIGNED to
   flip.** At MF-CH2A it read *the world law still strikes all 28*, and its convicting mutant
   M11 was literally this car's edit. It is **re-pointed rather than deleted**: the world law
   now admits exactly the **seven** rows an author licensed `none` — the two charter halls,
   `Alchemist shop`, `Warden's Lodge`, `Alchemist quarter`, `Dragon resident`, `Great library`
   — and still strikes the other **21**. The arm asserts that list twice: once literally, and
   once DERIVED from the catalog's own `magicLicense === 'none'` rows, so the pin and the data
   cannot drift apart silently.
2. **`tests/lint/negativeAssertionAnchor.walker.test.js`** — this car's own new walker carried a
   bare `not.toContain`, which the estate's habitat-removal ratchet refuses (frozen ceiling 0).
   Cured at the source with `expectAbsentWithAnchor(keywords, dead, 'teleportation', …)` from
   `tests/helpers/anchoredNegatives.js`, so the absence of the goods keyword is anchored on a
   keyword that must still be present. ⚠ ODQ §507.4 recorded that this walker "does NOT red for
   a `tests/lint` file"; that was true of MF-CH1's file and is **not** a property of the tree —
   it reds for any file that writes an unanchored negative, wherever it lives.
3. **`tests/lint/observedShapeReaders.walker.test.js` corpus meta — 1300/8607/14586 →
   1302/8656/14644.** The corpus GREW, and the +2 is exactly this car's two record keys becoming
   OBSERVABLE: `observed-shape-corpus.mjs` lights every `*Enabled` flag it can find, but no
   licensed institution ever reached a roster in that world, so the `magicLicense` key MF-CH2A
   declared was invisible to it. This car puts the seven `none`-licensed rows where they belong
   and the key arrives with them. **Every figure moves UP**, the opposite direction from the
   2026-08-17 re-record above it, and that is also the safe direction for a
   reader-with-no-writer ratchet: more observed shapes can only resolve reads that were
   previously unresolvable, never manufacture a blind spot. **The findings inventory did not
   move** — `check-observed-shape-readers.mjs` returns the same 159 bytes and the same SHA-256
   `c5b67844abe51226…` at this tip as at the clean base, `cmp` exit 0, and
   `.observed-shape-readers-baseline.json` is untouched.

And one ratchet that reds by CONSTRUCTION and is paid at the source:
**`tests/lib/instantWorld/mundaneRealmAcceptance.test.js`'s RECORDED-CENSUS pin.** Its own
docstring says what to do when it reds — confirm the shift was intended and carry the figures
into BOTH places — so this car does: `institutions 134 → 139, factions 22 → 24, services
193 → 195` in the test header and in `docs/DESIGN_REALM_MAGIC_TOGGLE.md`'s MG-4 landed block.
The magical twin does not move on any axis, **the arcane census over the mundane realm is still
EMPTY**, and every envelope ratio stays inside `PENDING_BANDS` with three of five improving —
so no owner-signed tolerance is asked to move.

While in that document, the **"Chair to schedule" residual at `:514-519` is corrected rather
than claimed.** The charter (ODQ §501.4) says CH-2 discharges it. It does not: this car routes
CATALOG rows past the unanchored `ARCANE_INST_KW` scan, but the other 283 rows still fall
through to it and `filterServicesForMagic` is still on it outright. The residual's SURFACE has
shrunk to the unlicensed remainder; its ANCHORING has not changed, and it stays open with that
narrowing written in.

---

## §6 · THE CENSUSES, THE BUNDLES AND THE GATES

*Every exit captured with **no pipe**; every battery mutexed with workers capped
(`--pool=threads --maxWorkers=2` — see MF-CH2A §7's J-TECH2-9 for why the chair's flag string
could not be used verbatim).*

- **The census row, WALKED at this tip (§417).** From the base tuple `2516/366/2150/20863/5808`
  the combined pair delta is **`+2/+0/+2/+17/+2`** → `2518/366/2152/20880/5810`, each moved
  figure read off the arm's own failure message in assertion order, green at step 5, with
  `parked` PASSING UNMOVED at 366 on the iteration between `files` and `credited`. The split is
  MF-CH2A `+1/+0/+1/+9/+1` and MF-CH2B `+1/+0/+1/+8/+1`, and 9 + 8 = 17 closes. The file is then
  reverted `cmp`-exact and the row rides this packet to the landing act.
- **The golden, re-recorded a second time and deliberately.**
  `0a2309f573fc1f4c…` → `600cdf1859c00e7e2525240deb643c162642185f104b3423c68e85f3bffbfcfe`;
  **92 of 525 keys move, 0 added, 0 removed.** ⭐ Measured on the fixtures themselves rather than
  reasoned: base → this tip moves **297**, exactly as base → MF-CH2A did, so **this car moves no
  golden row the declaration had not already moved** — its 92 are a strict subset of that 297.
  A SHIFT RECORD row is added above MF-CH2A's, and it says plainly which of the two is the
  roster shift.
- **Edge bundles: NONE owed.** None of this car's three production files appears in any of the
  five `supabase/functions/_shared/*.meta.json` input rosters (`grep -l`, all five metas, all
  three files, plus the new walker). MF-CH2A pays that bill for the pair.
- **Both typecheckers, verbatim, with this car applied.**
  `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` TRUE_EXIT 0
  `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` TRUE_EXIT 0
- **eslint** over the five authored/edited source and test files: **empty output, exit 0**;
  `--fix-dry-run` likewise.
- **C0** over all eleven files this car authors or edits: **0 control bytes, 0 tabs**.
- **CLAIM_RE** over every added `docs/**` line and every added `src/**` line: **0**.

---

## §7 · JUDGMENTS AND DEFERRALS

The pair's nine judgments and five deferrals are recorded once, in **MF-CH2A §7**, because they
were taken for the car as a whole. The three that decide THIS packet are J-TECH2-4 (the P2 arm
is split out and carried to the chair), J-TECH2-5 (Design A ships, Design B priced at 545 of
2,520) and J-TECH2-8 (`filterServicesForMagic` stays on the keyword vocabulary).
