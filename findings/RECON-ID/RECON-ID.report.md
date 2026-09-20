# RECON-ID — what IS an entity's identity in this estate, and what would "stable identity" have to change?

Opus RECON lane, 2026-09-19 ~18:5x–20:0x EDT, session 7d3418f8.
**Read tree** `$SP/read-tip-ad7ddf2c9`, HEAD `ad7ddf2c9`, `git status --short` EMPTY at the start **and** at the end.
Nothing was written outside `$SP/lane-recon-id-scratch/`. No vitest, no eslint, no npm script, no build; plain `node`, one process at a time.
Artefacts: `census-63.json`, `census-525.json` (the full-corpus identity census, 11.3 s), `census.mjs`, `repro.mjs`, `repro2.mjs`, `repro3.mjs`, `repro4.mjs`, `repro5.mjs`, `price.mjs`, `price525.mjs`, `diag1/2.mjs`, `probe1.mjs`, `steporder.mjs`, `instrument.mjs`, `lib.mjs`.
⚠ The cached `$SP/lane-recon-g-scratch/g-525.json` was READ and **not used**: its records carry food/viability fields only (`resilienceScore`, `deficitPct`, …), no identity fact. This lane ran its own bounded corpus passes instead (63-row sample for shape, three full 525-row passes for corpus counts).

---

## OUTCOME FIRST — per entity kind

| entity kind | already stable? | the smallest change that makes it total |
|---|---|---|
| **NPC** | **YES, for everything the editor does.** 5171/5171 carry an id; the id is stored on the record and follows it through save→load, reorder and the public veil. Three spellings coexist (below) but none collides and none is absent. | **Nothing.** The one real weakness — `npc_<n>` is POSITIONAL, so after a roster change `npc_3` names somebody else — only bites on REGENERATION, which the editor's design (§22.1 ruling 1) does not do to a held roster. |
| **INSTITUTION — identity** | **PARTLY.** No institution carries an `id` (0 of 17361) and none carries a `localUid` (0 of 17361), but `anchorForInstitution` gives every one a unique anchor (0 rows with a duplicate anchor). **88.0 % resolve to `cat:<catalogId>` and are rename-stable; 12.0 % fall to `name:<slug>` and are not.** | **Re-run the existing `catalogId` stamp after the last roster mutation.** `catalogIdForName()` already returns a non-null id for **all 66** distinct unstamped names — this is a step-ORDER defect, not a missing catalog row, and it needs no new identity at all. |
| **INSTITUTION — references to it** | **NO, and this is the live gap.** An institution's name is stored at **42 distinct paths**; 98.0 % of institutions are named by at least one other stored handle (mean 2.57 strict handles each, max 10). **There is no institution rename or removal writer anywhere in `src` or `tests`.** | **Build the cascade the design already reserves as EM-R6** (§22.1 ruling 7, §22.3 ruling 10). Denominator measured below: 33 strict paths + 9 polysemous paths to adjudicate. |
| **FACTION — identity** | **NO.** 0 of 3378 generated power-faction records carry an `id`; they carry `.faction` only (not even `.name`). The grouping list (1323 records) carries no id either. | **Measurably: nothing is needed before the first door** — and minting one is **not** inert (see Q3). |
| **FACTION — references to it** | **YES — already total.** All **11** stored paths that hold an exact faction name are on `FACTION_RENAME_SURFACES`, and a rename on real pipeline data leaves **0 of 15** handles stale. | **Nothing.** Candidate Q3(c) is already done for factions. |
| **SETTLEMENT** | **PARTLY.** `settlement.id` = `s_<fnv1a×2>` of the **seed** (`normalizeSettlement.js:78`) — 516 of 525 corpus rows share one id because they share one seed string. Fine as a generation stamp, useless as a save identity. | Nothing for the editor; the save row's own id is the save identity. Noted, not touched (item 9). |
| **RELATIONSHIP** | **YES, and it is unused.** All 10877 edges carry `npc1Id` + `npc2Id`; all 21754 resolve to a live NPC id; **0 dangle** — yet `NPC_RENAME_SURFACES` joins the same edges by `npc1Name`/`npc2Name`. | Nothing is broken. The id join is spare capacity the rename lane could use to drop its "two people sharing a name cannot be told apart" caveat. |
| **CONFLICT** | **NO** — `conflicts[]` carries `parties, issue, stakes, intensity, desc, plotHooks`; no id, and `parties[]` holds no exact faction name (0 matches corpus-wide). | Nothing is addressable, so nothing is dangling. Out of the editor's path. |
| **ACTIVE CONDITION** | **YES** — every one carries an `id` (516/516 rows). | Nothing. |
| **DECREE / DM LAYER** | **N/A** — `aiOverlays` is `{}` at generation and `dmLayer` has no writer yet (EM-C4a is its first). | Nothing yet; EM-C4a mints it. |

**The one-sentence answer for the chair:** the estate's identity problem is **not** missing ids — it is **one missing cascade (institutions) and one mis-ordered stamp (`catalogId`)**. Both are repairs of existing machinery, neither needs a new identity, and neither is EM-P1.

---

## Q1 — THE NAMESPACE TABLE

Fifteen identities. "Persisted" = written into the saved settlement blob.

| # | key / spelling | minted at | on which event | persisted | (a) same-seed regen | (b) rename | (c) roster reorder | (d) save→load | (e) fork/clone | (f) export→import | (g) public veil |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `npc_<n>` (4884/5171) | `generators/npcGenerator.js:1631` `npc.id = \`npc_${idx+1}\`` | generation | yes | **identical** ✓ | unaffected ✓ | follows the record ✓ | ✓ | **REBINDS** ⛔ | left alone | crosses (`publicSafe` allowlists `'id'`) |
| 2 | `npc.<slug>_<shortHash>` | `domain/entities/npcs.js:127` `createNpc` | DM creation / `ADD_NPC` | yes | n/a | not re-minted ✓ | ✓ | ✓ | n/a | reported FOREIGN | crosses |
| 3 | `npc.<facSlug>_<roleSlug>_<i>` (**287/5171**) | `generators/factionRoles.js:247` | **generation** (faction structural NPCs) | yes | identical ✓ | **name-derived at mint** (from the FACTION name), stored after ⚠ | ✓ | ✓ | re-minted from the faction name | crosses |
| 4 | `catalogId` (15278/17361) | `generators/steps/assembleInstitutions.js:730` via `catalogIdForName` | generation, **step 6 only** | yes | identical ✓ | **stable** — it slugs the CANONICAL CATALOG name, not the instance name ✓ | ✓ | ✓ | ✓ | re-derivable | **crosses** (observed in `toPublicSafe` output) |
| 5 | `localUid` | custom-content pipeline (`contentPacks.js`, `CustomContent.jsx`, …) | import of custom content | yes | — | stable ✓ | ✓ | ✓ | ✓ | ✓ | — |
| 6 | `anchorForInstitution` → `cat:` \| `uid:` \| `name:` | `domain/townMap/anchors.js:50` | **derived, never stored** | no (derived) | identical ✓ | `cat:`/`uid:` **stable**; `name:` **MOVES** ⛔ | ✓ | ✓ | ✓ | ✓ | n/a |
| 7 | `anchorForDistrict` → `district.<snake>` | `anchors.js`, from `districtProfile` | derived | no | ✓ | moves with the quarter name | ✓ | ✓ | ✓ | ✓ | n/a |
| 8 | `institution.<slug>` | `domain/events/mutateEntities.js:238` `ADD_INSTITUTION` | simulation-time creation | yes | n/a | not cascaded (identity) | ✓ | ✓ | n/a | left alone | — |
| 9 | `faction.<slug>` | `mutateEntities.js:407` `ADD_FACTION` · `generators/density/densityAscension.js:142` · `worldPulse/factionDensityKernel.js:122` | simulation-time creation / seat ascension | yes — **written into REPLAYED event chains** | n/a | **deliberately not cascaded** (`NON_CASCADED_SURFACES`: `powerStructure.factions[].id`, "the durable identity undo keys on") | ✓ | ✓ | n/a | left alone | — |
| 10 | `seatKey(seat)` = `factionDisplayNameOf(seat)` | `domain/density/seatKey.js:18` | derived join key | no | ✓ | **IS the name — moves** | ✓ | ✓ | ✓ | ✓ | n/a |
| 11 | `factionRefOf(f)` = `refText(f.id) \|\| displayName` | `domain/factionRefs.js` | the value written into `linkedFactionIds` | **the VALUE is persisted** | ✓ | name branch moves; the cascade rewrites it ✓ | ✓ | ✓ | ✓ | ✓ | — |
| 12 | `settlement.id` = `s_<fnv1a><fnv1a>` | `domain/normalizeSettlement.js:78` `idFromSeed` | generation | yes | identical ✓ | stable (seed-derived) ✓ | ✓ | ✓ | same seed ⇒ **same id** ⚠ | ✓ | crosses |
| 13 | `activeConditions[].id` | condition producer | generation | yes (516/516) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| 14 | `relationships[].npc1Id` / `npc2Id` | relationship producer | generation | yes (10877×2, **0 dangling**) | ✓ | unaffected ✓ | ✓ | ✓ | rebinds with #1 | ✓ | — |
| 15 | `npcAgency.npcId` = `${saveId}:${npc.id \|\| stablePart(name)}` | `worldPulse/npcAgency.js:195` | pulse ledgers | yes (pulse state) | ✓ | id branch stable ✓ | ✓ | ✓ | rebinds with #1 | ✓ | — |

**Is there already a stable identity per kind, and is it TOTAL?**

- **NPC — yes, total.** `census-525.json`: `idPresent 5171 / 5171`, `dupIdRows 0`, `idAbsentRows 0`.
- **INSTITUTION — yes (the anchor), but NOT total.** `anchorClass: {cat: 15278, name: 2083}`, `anchorDupRows: 0`. By tier (rows / `cat:` / `name:`):

  | tier | rows | institutions | `cat:` | `name:` | `name:` share |
  |---|---|---|---|---|---|
  | thorp | 84 | 565 | 565 | **0** | 0.0 % |
  | hamlet | 84 | 1028 | 944 | 84 | 8.2 % |
  | village | 84 | 2384 | 1966 | 418 | 17.5 % |
  | town | 105 | 5283 | 4507 | 776 | 14.7 % |
  | city | 84 | 3659 | 3195 | 464 | 12.7 % |
  | metropolis | 84 | 4442 | 4101 | 341 | 7.7 % |
  | **all** | **525** | **17361** | **15278** | **2083** | **12.0 %** |

- **FACTION — no.** `psFac.idPresent 0 / 3378`; keys are `{faction, power, desc, category, rawPower, powerLabel, modifier×525, isGoverning×525, legitimacyCrisis×36, crisisNote×36}` — **there is no `.name` key at all**, so `FACTION_RENAME_SURFACES`' `powerStructure.factions[].name` row never fires on generated data (`rewriteOwn` requires `key in target`). Not a bug; dead on generated input.

### ⭐ THE `name:` ANCHOR IS AN ORDERING DEFECT, NOT A MISSING CATALOG ROW

```
$ node diag2.mjs
=== distinct NO-catalogId institution names: 66 ===
by source: {"cascade":58,"coherence_repair":8}
catalogIdForName re-lookup non-null count: 66
samples: [{"name":"Shepherd","source":"cascade","lookup":"shepherd"},
          {"name":"Common grazing land","source":"coherence_repair","lookup":"common_grazing_land"}, …]
```

`census-525.json` `instKeys`: `cascadeAdded 1800` + `coherenceRepair 283` = **2083** — exactly the `name:` population.

```
$ node steporder.mjs
  6 assembleInstitutions      ← the catalogId stamp lives HERE (assembleInstitutions.js:728-732)
  8 cascadePass               ← +1800 institutions, unstamped
 15 coherenceRepairPass       ← +283 institutions, unstamped
 18 structuralValidationPass
$ node repro3.mjs   (step-growth probe, city row)
   assembleInstitutions: inst=38    cascadePass: inst=43   (38->43 after the stamp)
```

The file's own comment at `assembleInstitutions.js:749-752` already names the correct boundary: *"it must run AFTER the last roster mutation (subsumption / cascade / isolation / factionCorrelation)"*. The stamp does not obey it.

**Price of the cure** (`price525.mjs`, full corpus): stamps **2083** institutions; moves **417 of 525** golden rows (thorp 0/84, hamlet 60/84, village 84/84, town 105/105, city 84/84, metropolis 84/84). Pure name→id lookup, zero rng — the same "consumes no draw" property the original stamp was landed under.

---

## Q2 — THE HANDLE CENSUS (every place a reference is STORED, not computed)

Method: generate, then walk the whole settlement blob and record every collapsed path whose string value **exactly equals** an entity's name. Prose that merely *mentions* a name is out of scope by construction (it is handled by `substituteWholeWord`); this is the exact-join denominator.

### Factions — 11 stored paths, **all 11 on the cascade**

| stored path | occurrences (525 rows) | stores | on a cascade list? |
|---|---|---|---|
| `npcs[].factionAffiliation` | 5171 | display name | ✓ `NPC_FACTION_FIELDS` |
| `powerStructure.factionRelationships[].pair[]` | 5100 | display name | ✓ |
| `factions[].members[].factionAffiliation` | 4884 | display name | ✓ (second NPC home) |
| `powerStructure.factions[].faction` | 3378 | display name | ✓ |
| `factions[].powerFactionName` | 1323 | display name | ✓ |
| `powerStructure.government` | 525 | display name | ✓ |
| `powerStructure.governingName` | 525 | display name | ✓ |
| `factions[].members[].secondaryAffiliation` | 329 | display name | ✓ |
| `npcs[].secondaryAffiliation` | 329 | display name | ✓ |
| `history.currentTensions[].factions[]` | 290 | display name (prose list) | ✓ |
| `npcs[].linkedFactionIds[]` | 287 | **`factionRefOf` output** = the name today | ✓ (`list: true`) |

**Reproduction — faction rename on real pipeline data, after a JSON save→load round trip:**

```
$ node repro.mjs
### ROW city|germanic|plains|road|civilized|golden-master-v3  npcs 14 institutions 43 powerFactions 9
=== A. FACTION RENAME (the existing cascade) ===  changed= true touched= 9
--- faction: "City Council"
    exact-name handles BEFORE: 15; STALE AFTER: 0
```

**⇒ The faction rename cascade is TOTAL on generated data.** The only faction handles not on a cascade are the four declared in `NPC_HANDLE_KEYS_NOT_CASCADED` (`factionId`, `factionLink`, `organizationId`, `faction`) — each with a written reason, and **none has a writer in `src`**, so none is live.

### NPCs — 6 stored paths, 4 cascaded + 2 declared non-cascaded

| stored path | occurrences | disposition |
|---|---|---|
| `relationships[].npc1Name` / `npc2Name` | 10877 each | ✓ `NPC_RENAME_SURFACES` |
| `npcs[].name` | 5171 | ✓ |
| `factions[].members[].name` | 4884 | ✓ |
| `prominentRelationship.npc1` / `npc2` | 525 each | **declared** in `NPC_NON_CASCADED_SURFACES` (owner-gated prose policy) |

```
$ node repro.mjs   === B. NPC RENAME ===  changed= true touched= 4
--- npc: "Vilbirg Mayer"   exact-name handles BEFORE: 6; STALE AFTER: 0
$ node repro3.mjs  === C. the declared non-cascaded surface ===
   renamed "Sabine Gärtner"; prominentRelationship.npc1 is now "Sabine Gärtner"  (stale=true)
   prominentRelationship.full still contains the old name: true
   [declared in NPC_NON_CASCADED_SURFACES — owner-gated prose policy, not an oversight]
```

**⇒ The NPC rename cascade is TOTAL on the key surfaces**, with the two prose surfaces stale **by written decision**.

### ⛔ Institutions — 42 stored paths, **ZERO cascades exist**

```
$ git -C <tree> grep -rn "renameInstitution|applyInstitutionRename|institutionRenameChanges|INSTITUTION_RENAME" -- src tests
(end)            ← no output: there is no institution rename writer anywhere
```

**33 STRICT paths** (the key name itself declares an institution reference) + **9 POLYSEMOUS paths** (sometimes an institution, usually not — over the 63-row sample these hold a roster institution name 492 times against 7840 non-matching, so they need per-path adjudication, not blanket inclusion):

*Strict (525-row occurrence counts):* `availableServices.{equipment 7101, legal 5001, healing 2694, employment 2221, entertainment 1883, food 1456, lodging 1318, magic 907, information 886, transport 879, criminal 861}[].institution` · `economicState.activeChains[].processingInstitutions[] 7982` · `economicState.tradeDependencies[].institution 2444` · `economicState.activeChains[].dependency.institution 1161` · `resourceAnalysis.gaps[].institution 2059` · `resourceAnalysis.resourceChains[].processingInstitutions[] 327` · `resourceAnalysis.exploitation.{fullyExploited 171, partiallyExploited 156}[].processingInstitutions[]` · `defenseProfile.institutions.{garrison 451, magicDef 370, walls 354, watch 273, charter 171, mercenary 59, militia 12}[].name` · `npcs[].institution 297` · `factions[].members[].institution 297` · `npcs[].corruptTies.{thievesGuild 354, criminalInstitution 354}` · `factions[].members[].corruptTies.{thievesGuild 354, criminalInstitution 354}` · `npcs[].linkedInstitutionIds[] 25`.

*Polysemous (adjudicate individually):* `availableServices.legal[].name 105` · `spatialLayout.quarters[].landmarks[] 1664` · `npcs[].secondaryAffiliation 354` · `factions[].members[].secondaryAffiliation 354` · `economicState.activeChains[].label 168` · `economicState.activeChains[].resource 60` · `resourceAnalysis.resourceConditions[].label 108` · `simulationTrace[].downstreamEffects[].target 708` (a RECEIPT — presumptively non-cascaded, same ruling as `simulationTrace[].causes[].reason`) · `generationCoherenceReceipt.repairs[].subject 283` (likewise a receipt).

### ⛔ THE LIVE DEFECT, IN ITS SMALLEST REPRODUCTION

```
$ node repro.mjs
=== C. INSTITUTION RENAME (there is NO cascade in src) ===
    chosen: "Mages' guild"  (anchor cat:mages_guild, source generated)
--- institution: "Mages' guild"
    exact-name handles BEFORE: 10; STALE AFTER: 9
         2  availableServices.magic[].institution                    [⛔ NOT ON ANY LIST]
         1  defenseProfile.institutions.magicDef[].name              [⛔ NOT ON ANY LIST]
         1  factions[].members[].institution                         [⛔ NOT ON ANY LIST]
         1  npcs[].institution                                       [⛔ NOT ON ANY LIST]
         1  spatialLayout.quarters[].landmarks[]                     [⛔ NOT ON ANY LIST]
         1  economicState.activeChains[].dependency.institution      [⛔ NOT ON ANY LIST]
         1  economicState.activeChains[].processingInstitutions[]    [⛔ NOT ON ANY LIST]
         1  economicState.tradeDependencies[].institution            [⛔ NOT ON ANY LIST]
```

**What a DM would see.** They rename the Mages' guild to "The Verdant Circle" and the roster shows the new name. Then: the **Services** tab still lists two magic services provided by "Mages' guild"; the **Defense** card still credits magical defense to "Mages' guild"; **two characters' postings** still read "Mages' guild" (and the roster copy and the faction-member-chip copy can disagree, because they are separate objects after a reload — the exact alias split `NPC_HOMES` was written to close); the **quarter's landmark list** still names it; and the **Economics** tab shows a supply chain whose processor and trade dependency name a house that is no longer on the roster. Nothing throws. Nothing is logged.

**Scale (63-row sample, strict paths only):** `renN 2428` institutions, `renTot 6244` strict handles, **mean 2.57 stale per institution renamed, max 10 ("Wizard's tower", city)**; **98.0 %** of institutions carry at least one other stored handle.

**Second, sharper consequence — the anchor moves for the 12 %:**

```
$ node repro3.mjs  === B. anchorForInstitution under a RENAME ===
   catalogId-bearing:  "City granaries" (source required)  cat:city_granaries -> cat:city_granaries   MOVED=false
   name:-anchored:     "Public bathhouse" (source cascade)  name:public-bathhouse -> name:zzqq-renamed-hall  MOVED=true
```

`mapEdits` pins match `anchorKey` (`townMapModel.js:587`), and `anchorKey` is consumed by 20 modules (`interiorFootprint`, `cartographyBuildings/Parcels/Multiplicity`, `glyphAssign`, `institutionAssignment`, `townLayoutV2`, `fogSessions`, `massing`, `buildingProfiles`, …). **Renaming a cascade- or repair-added institution therefore also orphans its map pin, its interior delta and its fog session** — and `glyphAssign.js:125` re-seeds its PRNG off the new anchor, so the building's glyph changes too.

### WHAT A REMOVAL DOES (design §22.3 ruling 10: "a removal owes the same cascade a rename does")

```
$ node repro4.mjs  === REMOVAL of one institution ===
   removed "Mages' guild" (9 stored handles elsewhere)
   dangling institution joins: 51 -> 60  (NEW: 9)
```

**Pre-existing dangling strict institution joins, per settlement (63-row sample)** — the delta baseline any "no new dangling reference" gate must subtract:

| tier | rows | min | median | max |
|---|---|---|---|---|
| thorp | 7 | 2 | 11 | 11 |
| hamlet | 7 | 3 | 11 | 15 |
| village | 7 | 2 | 8 | 15 |
| town | 28 | 3 | **17** | 25 |
| city | 7 | 13 | **23** | 32 |
| metropolis | 7 | 12 | 18 | 24 |

This **corroborates** the ARCH-REDERIVE recon's "14 (town) to 30 (city) dangling name-joins before any edit" (design §22 item 5) on an independently-built path set. The dangles concentrate in five paths: `resourceAnalysis.resourceChains[].processingInstitutions[] 330`, `economicState.activeChains[].processingInstitutions[] 316`, `resourceAnalysis.exploitation.fullyExploited 107` / `partiallyExploited 94`, `availableServices.criminal[].institution 59` — chain and exploitation rows naming processors that are not on the roster at all.

---

## Q3 — WHAT "MINT A FACTION ID" WOULD MOVE

### ⛔ FIRST, A CORRECTION TO THE PRE-PROOF'S CANDIDATE SITE

The pre-proof (§2) offers the chair *"re-point the MODIFY row to `factionGrouping.js` — the only site where 'mint in draw order, before any sort' is both meaningful and available"*. **`factionGrouping.js` builds the wrong collection.**

```
$ git grep -n "push(|\.sort(" -- src/generators/power/factionGrouping.js
  67:  factions.push({ name: chosenName, members, dominantCategory });
  71:  return factions.sort((a, b) => b.members.length - a.members.length);
```

That is `settlement.factions[]` — the **NPC-grouping** list, keys `{name, members, dominantCategory, powerFactionName, powerFactionPower, powerFactionCat}`. The roster that `factionRefOf`, `linkedFactionIds`, `factionAffiliation`, `governingName`, `seatKey` and the whole rename cascade address is **`powerStructure.factions[]`**, built in `generators/power/rulingStructure.js` (eight `factions.push` sites) plus `stressFactions.js`, and sorted at `rulingStructure.js:74` (`isGoverning`, then `power` desc). A mint placed in `factionGrouping.js` would put ids on a list nothing joins on.

### THE THREE CANDIDATES, MEASURED

`price.mjs` / `repro2.mjs`, 63-row sample, in memory, nothing written:

| | **(a) `faction.<slug(name)>`** | **(b) `fac_<n>` in draw order** | **(c) NO mint — names stay the identity** |
|---|---|---|---|
| golden rows that move | **63/63** ⇒ 525/525 | **63/63** ⇒ 525/525 | **0/63** |
| persisted handle VALUES that flip | `factionRefOf` flips **9/9** per settlement ⇒ every `npcs[].linkedFactionIds[]` entry (**287 over the corpus**) flips from a name to an id | same, 9/9 | none |
| do OLD name handles still resolve? | **yes** — `resolveFactionRef` tries ids, then `.faction`/`.name`; a mixed save resolves both | yes | n/a |
| …and after a rename? | old name handle **stops resolving**; the id handle survives | same | the cascade rewrites the name handle, so it survives |
| what a rename then does | id stays (it is on `NON_CASCADED_SURFACES`); name handles still need the cascade | same | unchanged — already total |
| joins actually converted to id | **1 of 11** (`linkedFactionIds`). `seatKey` is `factionDisplayNameOf` **by design** and never reads `.id`, so `factionAffiliation`, `secondaryAffiliation` (both homes) and `powerFactionName` stay name-joined | same | — |
| **⛔ dark id-only readers it lights up** | **at least 3** (below) | **at least 3** | none |

```
$ node price.mjs
    63/63 rows move   Q3(a) faction id = faction.<slug>
    63/63 rows move   Q3(b) faction id = fac_<n>
     0/63 rows move   Q3(c) faction: no mint
    63/63 rows move   EM-P1 as written: id on inst+fac
$ node repro2.mjs
  (a) faction.<slug>: factionRefOf flips 9/9 handle VALUES
     old NAME handles still resolve: true ; new ID handles resolve: true
     after a rename, the OLD name handle "City Council" resolves: false ; the ID handle resolves: true
```

### ⭐⭐ THE FINDING THAT SHOULD DECIDE THIS: A FACTION MINT IS NOT A KEY ADDITION

The observed-shape register's 33 findings / 53 multiplicity / **28 files** are re-found exactly at the tip. Classified by reading each site, **almost all are `id || name` fallbacks** that would silently re-key — but **three are id-ONLY, and two carry headers stating that being dark on generated data is CORRECT**:

```
$ sed -n '243,255p' src/domain/rulingPower.js
 * ⛔ THE `faction.id` SLOT IN THE LINEAGE TUPLE STAYS ID-ONLY — DO NOT "FIX" IT
 * WITH A NAME-DERIVED KEY. It resolves null on 100% of generated data (0 of
 * 2,175 measured rows carry `id`) … this tuple is the one place in the estate
 * where that is forbidden: this epoch is the succession discriminator, so a
 * name-derived component would make every faction RENAME read as a legitimate
 * authority transfer … Dead-on-generated-data is CORRECT here, not a defect.

$ sed -n '366,375p' src/domain/worldPulse/warSeatBooks.js
 * ⛔ `factionId` HERE IS DELIBERATELY NOT THE ADDRESS ID … This one is
 * `.id`-only, so it is null on 100% of generated data (0 of 2,175 measured
 * powerStructure rows carry `id`) — that is the correct reading of the header's
 * rule that a faction rename must never look like a succession.
```

- `rulingPower.authorityTransferEpochFor` (`:274`) folds `faction.id` into the **succession discriminator** string. Mint an id and every settlement with an `ascendant` modifier gets a different epoch signature.
- `warSeatBooks.authoritySignatureFor` (`:387`) folds it into the **authority signature** that war-decision continuity is compared on. Mint an id and every signature changes.
- `warPeaceDecision.js:120` compares `String(transition.governingFactionId) === String(asObject(governing).id)` — an id-only comparison that cannot match today.

**⇒ Minting a faction id is a world-pulse BEHAVIOUR CHANGE, not a key addition** — in exactly the two modules whose authors wrote down that the absence is load-bearing. Both headers do allow it (*"the `id` slot only sharpens it for authored records that genuinely carry a rename-decoupled id"*), and a **stored** `faction.<slug>` id is rename-decoupled after mint, since the cascade leaves `powerStructure.factions[].id` alone. But it is a decision with a downstream, not a no-op — and the pre-proof's already-refuted "no value, count, name or draw moves" sentence is refuted a second way here.

**Candidate (c) is measurably complete for factions today** — see Q2: 11 of 11 stored paths cascaded, 0 stale after a rename on real data.

### PINNED-MODE / MIGRATION GEOMETRY (also Q5)

`chooseOrPin` is `generatePopulation.js:41`:

```js
function chooseOrPin(pins, key, draw) {
  if (pins && Object.prototype.hasOwnProperty.call(pins, key)) return pins[key];
  return draw();
}
```

consulted for `'npcs'`, `'relationships'`, `'factions'`, `'conflicts'` (`:128, :168, :172, :175`). A mint placed inside the chooser's `draw` therefore **does not run under a pin** — the pre-proof's finding stands, and it is confirmed at this tip.

---

## Q4 — DOES AN INSTITUTION NEED A NEW ID AT ALL?

**No.** What an `id` would give that `anchorForInstitution` does not: **nothing that any consumer asks for.**

- The anchor is already **unique per settlement** — `anchorDupRows: 0` over all 525 rows, 17361 institutions.
- It is already **regen-stable** — `node repro2.mjs` §1: `anch: identical=true` across two same-seed generations.
- It is already **rename-stable for 88.0 %** and the remaining 12.0 % is a step-order defect with a measured, draw-free cure (Q1).
- It is already **consumed by seven modules** through `anchorForInstitution` and by twenty through `anchorKey`.
- `catalogId` already **crosses the public veil** (observed in `toPublicSafe` output), so an id would add nothing there either.

**What it would take to make the anchor TOTAL:** re-run the existing loop (`assembleInstitutions.js:728-732`) after the last roster mutation — the boundary the file's own comment at `:749-752` already names. `catalogIdForName` resolves **66 of 66** unstamped names. **`localUid` is stamped nowhere on generated data (0 of 17361)** — it is a custom-content identity written by `contentPacks.js` / `CustomContent.jsx` / `contentSamplePreview.js`, not by the generator, so it is not the lever here.
Cost: **2083 institutions gain a `catalogId`; 417 of 525 golden rows move**; zero draws.
Risk to name: this is a **persisted key addition on institutions** — smaller than EM-P1's, but the same class, and therefore the same owner gate.

**The 28 OSR files — real consumer or dead code?** All 28 are real consumers; none is dead code. The classification that matters is different:

| class | files | behaviour if an id appears |
|---|---|---|
| **`id \|\| name` fallback** (works today via the name branch) | ~25, e.g. `SuccessorPrompt.jsx:61`, `contradictions.js:152`, `counterfactual.js:306`, `districtProfile.js:401`, `explanation.js:327/1178`, `factionRefs.js`, `factionRoles.js:245`, `institutionStatusModel.js:288`, `brokerageStamps.js:296`, `factionCompetition.js:107/159`, `beliefMap.js:893`, `tableLedger.js:310`, `batch.js:395-397`, `regenerationMode.js:200` | **silently re-keys** — ledgers, stamps and address ids flip from name-derived to id-derived. This is the same shape as `npcAgency.npcId` and is the real cost of any mint |
| **id-ONLY, dark by design** | `rulingPower.js:274`, `warSeatBooks.js:387`, `warPeaceDecision.js:120` | **lights up** — a declared behaviour shift (above) |
| **alias registrar** | `dossier/entityLinks.js:359-366` — already registers `faction.id` as an `aliasIds` entry beside the name-derived base id | gains an alias; harmless |

**⇒ The register's 33 findings are not "readers starved of a writer" — they are readers that already work by name and would change behaviour if a writer appeared.** That inverts the pre-proof's §6 reading of the register as "the strongest independent corroboration that the cure is real": measured, it is the strongest independent statement of the mint's **blast radius**.

---

## Q5 — PINNED MODE AND THE MIGRATION

**The three boundaries a single mint function would have to satisfy:**

| boundary | where the mint must be called | why |
|---|---|---|
| **generator** | inside the producing step, **before the step's sort**. NPCs: `npcGenerator.js:1631`, then `disambiguateNPCDisplayNames` (`:1636`). Power factions: before `rulingStructure.js:74`'s `factions.sort(...)`. Institutions: after the **last** roster mutation (step 18), not step 6 — `cascadePass` (8) and `coherenceRepairPass` (15) add 2083 records after the current stamp | a mint after a sort numbers the sorted order, not the draw order; a mint before the last adder misses the adder's rows (which is precisely today's `catalogId` defect, executed) |
| **pin boundary** | **outside** `chooseOrPin`'s `draw` — i.e. on the returned collection, not inside the chooser | `chooseOrPin` returns `pins[key]` without running `draw`, so a mint inside the chooser never runs in pinned mode and a pin built from an id-less record yields id-less entities |
| **migration** | `saves.js:190 migrateSaveToV2` — which today mints nothing on entities (it lifts `seed` and materialises `campaignState`); it runs on **every read and every write path** (`:331, :443, :503, :684, :713, :743, :775, :850`) | read-mint and write-mint must apply the identical rule to the identical input, or a save's ids change on a round trip |

### ⛔ THE REORDER GHOST-WRITE, IN ITS SMALLEST REPRODUCTION

```
$ node repro2.mjs
=== 3. ROSTER REORDER (array reversed in place) ===
    npc ids follow the RECORD (stored on it): true
    inst anchors follow the RECORD: true
    ⚠ but a MIGRATION that mints on stored array order would mint: ["npc_1","npc_2","npc_3"]
      for ["Diemoda Gruber","Franziska Köhler","Jutta Schwarz"]
      i.e. the same person would be re-keyed "npc_8" -> "npc_1"
```

Stored ids follow their record through a reorder — that half is safe. The ghost-write is entirely in the **array-order-keyed migration**: read a save, reorder the roster (a roster edit is exactly such a reorder), write it back, and the write-mint assigns *different* ids to the same people. `npc_8` becomes `npc_1`, and every id-keyed sidecar — locks (`locksPreservation.js:228`), drift marks (`characterDrift.js:17`), authored markers (`characterEdit.js:51-53`), pulse ledgers keyed `${saveId}:${npc.id}` (`npcAgency.js:195`) — now names a different person. **The cure is to key the migration on the record's own identity, never on its array index; the reordered case needs its own pinned arm.**

### AND THE SAME WEAKNESS ALREADY EXISTS WITHOUT ANY MIGRATION

```
$ node repro3.mjs  === A. positional npc_<n> across a roster change (same seed) ===
   {"settType":"town"}:      npcs 14->9;  ids shared 9;  ⛔ id names a DIFFERENT person: 9
   {"culture":"nordic"}:     npcs 14->14; ids shared 14; ⛔ id names a DIFFERENT person: 14
   {"tradeRouteAccess":"port"}: npcs 14->14; ids shared 14; ⛔ id names a DIFFERENT person: 0
```

This reproduces, on real pipeline data, the hazard the estate has already written down in five headers (`regenIdentityFold.js:7`, `regenerationPreservation.js:16`, `characterDrift.js:17`, `locksPreservation.js:228`, `npcLedger.js:7`, `infiltrationDepth.js:534`). It is **not** a reason to change the spelling: the editor's design holds the roster (§22.1 ruling 1), so it never regenerates under the editor. It **is** the reason the migration must not re-derive ids from position.

---

## Q6 — WHAT THE EDITOR ACTUALLY NEEDS

Design §22–§22.3 (`docs/DESIGN_EDIT_MODE_AND_DECREES.md`, ledger branch), need by need:

| the design's need | the identity that already serves it | gap? |
|---|---|---|
| merge key for `npcs` — **by `id`** (§22.2) | **`npc.id`** — present on 5171/5171, stored on the record, survives reorder and save→load | **none** |
| merge key for `institutions` — **by `name`** | `institutions[].name` (+ `anchorForInstitution`, unique in 525/525 rows) | **none for the merge**; the gap is the *cascade*, not the key |
| merge key for `factions` — **by `name`** | `powerStructure.factions[].faction` via `seatKey`, which is the display name **by design** | **none** |
| "a newcomer NPC is enriched on a stream keyed by its **stable id**" (§22.3 ruling 9, which names EM-P1) | **`npc_<n>` already is that id.** `regenerationPreservation.js:105-117` already mints "the lowest `npc_N` not already used by the roster" — a collision-free minter for exactly this case. The stream key needs determinism at birth and no collision; both hold | **none — EM-P1 is not required by ruling 9** |
| "renames must not re-roll prose" (§22.1 ruling 7: renames go through the cascade, never re-derivation) | the faction and NPC cascades, measured total (Q2) | **none for factions and NPCs; TOTAL for institutions** |
| "**INSTITUTIONS GET A CASCADE** … a declared institution rename-surface list, measured from the reference graph, is **its own packet**" (§22.1 ruling 7) — the packet is **EM-R6** | **nothing today** | ⛔ **the one real gap.** Denominator supplied here: 33 strict paths + 9 polysemous, mean 2.57 stale handles per rename, max 10 |
| "a removal sweeps the rename-surface list" (§22.3 ruling 10) | the same absent list | ⛔ **same gap, same packet.** Measured: removing one institution created **9 new dangling joins** |
| `EM-B1a validateOp`: `op.target` is `{kind, id}` — a **shape check**, never resolved against a settlement | synthetic ids satisfy it | **none** |
| EM-D0's first door is **the NPC's card** | `npc_<n>` | **none** |

### ⇒ THE SMALLEST "STABLE IDENTITY" THAT SERVES EVERY NEED

**It contains no new identity at all.** It is two repairs of machinery that already exists:

1. **EM-R6 — the institution rename/removal surface list and its cascade.** Modelled byte-for-byte on `factionRename.js`: a frozen `INSTITUTION_RENAME_SURFACES`, a frozen `NON_CASCADED` ledger for the 9 polysemous paths and the two receipts (`simulationTrace[].downstreamEffects[].target`, `generationCoherenceReceipt.repairs[].subject` — the same ruling `simulationTrace[].causes[].reason` already carries), and the module's own denominator pin: walk the whole blob for strings equal to a roster institution name and require every path found to appear in one of the two lists. **That pin is `census.mjs` in this lane's scratch, already written and already executed over 525 rows.** No persisted-shape change, no golden movement, no owner gate.
2. **The `catalogId` re-stamp after the last roster mutation** — makes `anchorForInstitution` total (2083 institutions gain an anchor that survives a rename; the map pin, interior delta, fog session and glyph seed stop moving). **This one does carry a persisted key addition and a 417-of-525 golden shift**, so it is owner-gated and it is the only part that is.

**EM-P1 is not on this list, and nothing on the path to the first door needs it** — which confirms the pre-proof's §9(ii) independently, and adds the reason it should not be hurried: a faction mint is a measured behaviour change in the authority/war layer, not a key addition.

---

## THE OWNER'S QUESTION, IN PLAIN WORDS

**One question, and it is not about faction ids.**

> **Today, 12 % of the buildings in every settlement (2,083 of 17,361 across the test corpus — every workshop the cascade adds and every house the coherence pass repairs in) have no permanent tag. The other 88 % have one. The fix is to run the tagging step we already have a second time, after the last building is added. It costs nothing at generation time and changes no number, no name and no dice roll — but it writes one new field onto those 2,083 buildings, which means every saved settlement's fingerprint changes and the golden record has to be re-signed for 417 of its 525 rows. Do we tag them?**

**What a DM with an existing save sees under each answer:**

- **YES (tag them).** Nothing visible changes today — no name, no number, no map. What changes is what happens when Edit Mode ships: renaming *any* building keeps its place on the map, its interior, its fog state and its glyph. The save's stored bytes change the next time it is written, and the golden record carries one more signed shift.
- **NO (leave them).** Nothing changes today either. When Edit Mode ships, renaming one of those 2,083 buildings **silently moves the building on the town map**, discards any nudge the DM had given it, and re-rolls its glyph — while the other 88 % behave correctly. The inconsistency would be invisible until a DM hit it, and it would look like a map bug rather than a naming one.

**Not a question for the owner, for the record:** EM-R6 (the institution rename/removal cascade) is a pure repair — it adds no key, moves no golden, and closes a defect that is live the moment any institution rename op is promoted. It needs a slot, not a signature.

---

## NOTICED, NOT TOUCHED (the owner's law: nothing is deferred — each item slot-ready)

1. **⛔ `factionGrouping.js` is the wrong mint site** for any faction id — it builds `settlement.factions[]` (the NPC-grouping list), not `powerStructure.factions[]` (the roster everything joins on, built in `rulingStructure.js` + `stressFactions.js`). The pre-proof's §2 chair-choice (a) rests on this. **Slot: a one-line amendment to the EM-P1 pre-proof's §2 before the chair rules on it.**
2. **⛔ A faction id is a behaviour change, not a key addition.** `rulingPower.js:274` and `warSeatBooks.js:387` are id-only and documented as correctly dark; `warPeaceDecision.js:120` is an id-only comparison. All three light up on the first mint. **Slot: a declared one-time world-pulse shift in whatever packet mints, or a written decision to keep them dark by excluding generated ids.**
3. **The `catalogId` stamp runs at step 6 and 2083 institutions are added at steps 8 and 15.** The file's own comment (`assembleInstitutions.js:749-752`) already names the right boundary. **Slot: its own small packet, or a row in EM-R6 — but it is owner-gated (persisted key + 417/525 golden rows) while the rest of EM-R6 is not, so it should be separable.**
4. **⛔ EM-R6 has a denominator now and no packet.** 33 strict paths + 9 polysemous, mean 2.57 handles per institution, max 10, 98.0 % of institutions referenced. Design §22.1 ruling 7 and §22.3 ruling 10 both name it; nothing owns it. **Slot: EM-R6, before any institution rename or removal op is promoted (EM-C4a is the first apply point).**
5. **A SIXTH NPC namespace exists and nothing enumerates the five.** `generators/factionRoles.js:247` mints `npc.<factionSlug>_<roleSlug>_<i>` **during generation** for 287 of 5171 NPCs — beside `npc_<n>` (npcGenerator), `npc.<slug>_<hash>` (createNpc), and the institution/faction/settlement namespaces. The pre-proof's noticed-item 2 says created NPCs carry the second spelling; it does not know about this third generated one. **Slot: one enumerating comment block, naturally in EM-R6's or EM-P1's module header.**
6. **`factionRoles.js:258` stores an institution NAME in `linkedInstitutionIds`** (`linkedInst.id || linkedInst.name`; generated institutions have no id, so it is always the name — 25 occurrences corpus-wide) and its own comment at `:228-231` acknowledges the name is "rename-sensitive". It is on no cascade. **Slot: a row in EM-R6's surface list.**
7. **`relationships[].npc1Id`/`npc2Id` are a complete, zero-dangle id join that the NPC rename lane does not use** (10877 edges, 21754 endpoints, 0 dangling). `applyNpcRenameToSettlement`'s header records that it cannot tell two same-named characters apart because "`relationships[].npc1Name` is a name, not an id". It is also an id. **Slot: a small hardening of `NPC_RENAME_SURFACES` — optional, behaviour-preserving, and it removes a documented caveat.**
8. **`powerStructure.factions[].name` never exists on generated data** (0 of 3378), so `FACTION_RENAME_SURFACES`' `${ROSTER}.name` row is unreachable through the generator. Correct as written (it heals divergent legacy records) but worth one word in the header so a future sweep does not read it as a miss. **Slot: a comment, any faction-lane packet.**
9. **`settlement.id` is a hash of the SEED, so two settlements generated from the same seed string share it** — 516 of 525 corpus rows carry `s_f31e9b37e51d7959`. Harmless today (the save row owns the real identity) but it crosses the public veil. **Slot: one line in whatever document enumerates the namespaces; not a defect to fix.**
10. **`conflicts[]` carries no id and its `parties[]` hold no exact faction name** (0 matches over 525 rows) — so a conflict is not addressable and a faction rename cannot reach it. If the editor ever offers a conflict card, this is where the identity work would be. **Slot: a note on EM-C4a's card list.**
11. **The five dangle-concentrating paths are a data question, not an identity question**: `resourceAnalysis.resourceChains[].processingInstitutions[]` (330), `economicState.activeChains[].processingInstitutions[]` (316), the two `exploitation` arms (107 + 94) and `availableServices.criminal[].institution` (59) name processors that are on no roster **before any edit**. EM-R6's "no new dangling reference" gate must be a DELTA against this baseline or it reds on arrival. **Slot: EM-R6's gate definition.**
12. **The 9 polysemous paths need a per-path ruling, not a blanket one** (they hold a roster institution name 492 times against 7840 non-matching over the 63-row sample). Two of them — `simulationTrace[].downstreamEffects[].target` and `generationCoherenceReceipt.repairs[].subject` — are RECEIPTS and take the ruling `simulationTrace[].causes[].reason` already has. **Slot: EM-R6's `NON_CASCADED` ledger.**
13. **`institutionStatusModel.js:288`, `brokerageStamps.js:296`, `factionCompetition.js:159` and ~22 siblings are `id || name` ledger keys** that would silently re-key on the first institution or faction mint — the same shape as `npcAgency.npcId`, which the pre-proof already flagged for NPCs. Nothing enumerates them as a class. **Slot: whichever packet mints; it is the mint's true blast radius, and the OSR register is its ready-made census.**
