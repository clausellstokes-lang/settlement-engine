# EM / EM-A1 — ROOT FIELD DECLARATIONS for the first card types (train `em-w1`, wave 1)

**Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)

- **Status:** DRAFT
  ⚠ The status value stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:297`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 3
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Last revalidated:** 2026-09-19, `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- **Depends on:** `EM-P2` (generation's choosers registered — the declaration census reads that registry) · `EM-P3` (the world-fact option sets' one home — the fifth card's pools name it) · `EM-A2` (the walker's pool arm reads `POOLS`). All three are DRAFT dependencies, not blocks.
- **Collision group:** `EM-A3` — EM-A3 MODIFIES `src/domain/edit/fieldDeclarations.js` (its `readersProof` rows). The two serialize; EM-A1 lands first.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** measured. Measured at this base: the three card records' live key sets over three tiers by executed pipeline generation; **the writer of every field the chair's amendment names, by symbol, with its formal parameters and its world-fact reads**; the rename cascade's four declared surface lists by live import; the lighting census's five frozen figures and its `TEST_FILES` scope; the mutation-coverage manifest's population; the absence of every CREATE target. Every figure carries its command in `EM-A1.evidence.md`.

---

## 1. Reconciled authority

1. ⭐⭐ **ODQ §934.45 — design §14's FINAL shape (`b43dfb771`, read at 11:32 EDT), which SUPERSEDES the §934.44 wording this packet was first recompiled against.** *"**Root means CHOSEN, not computed.** What makes a fact a root is that the generator CHOSE it from a candidate set, **however that set was gated by other facts**. … The estate registers every seeded chooser in its decision-fork classification registry, so the root set is that registry's rows — a measurement, never a judgment."* Five kinds of fact; five cards (world facts, NPC, institution, faction, power seat); one engine, `rederive(record, config′, layer)`, with every chosen fact pinned. **This is a material re-ruling and it lands on this packet twice** — see §1a.
2. **CHAIR AMENDMENT, 2026-09-19, ODQ §934.44 — "edit at the source, never at the derivation."** Design §14's first shape and the amended ARCH (`FieldDeclaration` gains `provenance: 'root'` and `writer`; §8 instrument 1 gains the root arm; §9's card list drops the system states and gains the power seat) and the amended charter row for EM-A1. Its ROOT test — *"whose writer reads no other world fact"* — is the one §934.45 replaced.
3. `docs/OWNER_DECISION_QUEUE.md` §934.42 (build the editor now), §934.43 (the phantom consequence rule — not this packet's).
4. THE PROMISE · the deity doctrine · the product scope — via `EM-PREAMBLE.md` §P1.
5. `docs/DESIGN_EDIT_MODE_AND_DECREES.md` **§12, §14 FINAL and §15 GOVERN**; `docs/ARCH_EDIT_MODE_AND_DECREES.md` §1, §2, §8, §9 as amended at `7aa769830`.
6. `docs/implementation/PACKET_STANDARD.md`, `EM-PREAMBLE.md` §P1–§P9.
7. Live code and executed evidence at `d31af2cee` — `EM-A1.evidence.md`, with J-T1 blob identity over the moved window (E-40).

Resolved contradictions:

- Design §2.1's per-field `effect: 'correction' | 'event'` → **WITHDRAWN** by §2.6's canon rule; a field declares only its kind.
- Design §2.1's two kinds (`pool | free`) → **SUPERSEDED** by §12.3: three kinds.
- ARCH §9's system-state cards (security, food security, order) → **STRUCK** by §14; this packet declares none.
- ⛔⛔ **THE BULLET BELOW IS SUPERSEDED BY §1a AND IS KEPT ONLY AS THE RECORD OF THE FIRST AMENDMENT'S ARITHMETIC.** §934.45's "root means CHOSEN" reverses six of its nine drops; the live disposition is §1a.1 and §1a.5. It is not deleted because the writer measurements it cites are executed facts the `writer` column still needs.
- ~~**ARC§9's card catalogue versus the tree — resolved by the amendment's own procedure**~~ *(first amendment only)* (*"if any of these is in fact derived in the tree, the packet says so, drops the field, and records it in §1 as a resolved contradiction"*). Of the **ten** fields the amendment names, **nine are dropped** and **one survives**. The measured table is §5.1; the one-line disposition of each:
  - `npc.name` — **KEPT, ROOT.** Its writer reads a dial and a dial only. (E-22)
  - `npc.role` — **DROPPED, DERIVED.** Its writer reads `institutions` and the faction roster. This is the exact case the amendment anticipated. (E-23)
  - `npc.disposition` — **DROPPED, NO SUCH FIELD.** Absent from the record at every tier, so it has no writer to measure. (E-7)
  - `institution.name` — **DROPPED, DERIVED.** Its writer is gated by `worldLaw.allowsInstitution` and the tier catalogue. (E-24)
  - `institution.class` — **DROPPED, NO SUCH FIELD.** (E-7)
  - `institution.standing` — **DROPPED, NO SUCH FIELD.** (E-7)
  - `faction.name` — **DROPPED, DERIVED.** The canonical spelling is `faction`; its writer reads `economicState`, `institutions`, `neighbourRelationship` and the stress flags. (E-25)
  - `faction.archetype` — **DROPPED, NO SUCH FIELD.** The record carries `category`, and `category` is itself inferred **from the faction's display name** by `inferFactionCategory`. (E-7, E-26)
  - `faction.stance` — **DROPPED, NO SUCH FIELD.** (E-7)
  - `faction.power` (the share) — **DROPPED, DERIVED — and this contradicts a chair default, so it is flagged rather than absorbed.** §14 rules the power share *"stays a ROOT under the totality guard … Vetoable."* Measured, its writer reads `economicState.prosperity`, so it fails §14's own ROOT test. Only the chair can reconcile the default with the measurement. (E-25)
  - `power seat.holder` — **DROPPED, DERIVED, and DOUBLE-WRITTEN.** `powerStructure.governingName` is a projection of the roster at `rulingStructure.js:787` and is overwritten at `economyReconciliation.js:277`. (E-27)

## 1a. ⭐⭐ THE TWO CHAIR AMENDMENTS, MEASURED — what they cure, and the four things that survive them

**Compiled against the SECOND amendment** (design §14 FINAL and §15, the ARCH's `FieldDeclaration` and §9 card list, the charter's EM-A1 row, on the consist at `7aa769830`). The base stays `d31af2cee` per the chair's item (6); **J-T1 blob identity is EXECUTED, not asserted**: all **27** paths this packet measures are byte-identical from `d31af2cee` to `7aa769830` (E-40). The chair re-pins at promotion and stamps the preamble hash there.

The amendment's six items, each answered with its measurement:

| # | the chair's instruction | measured answer |
|---:|---|---|
| 1 | Replace the predicate: a field is declarable iff its writer is a **registered decision-fork** whose output the record holds; keep `writer` as the chooser's symbol | ⛔ **BLOCKED — the registry cannot see a single editor chooser.** §1a.2 below |
| 2 | A FIFTH CARD FIRST: world facts, `provenance: 'world-fact'`, kind `pool`, pools that ARE the wizard's option sets, found by symbol, never a second copy | ⛔ **BLOCKED — the option sets are already doubled and the fuller home is a forbidden import.** §1a.3 |
| 3 | Two new root fields, `npc.status` and `institution.state`; measure whether the tree carries either; say CREATE or declare-existing | ✅ **MEASURED, and one of the two carries a vocabulary conflict.** §1a.4 |
| 4 | The system-state cards are STRUCK | ✅ Carried. This packet declares none. |
| 5 | EM-A3 keeps its half; the root check is A1's walker | ✅ Carried. This is now the CHAIR'S RULING, so the judgment this lane had recorded vetoably in §12 is withdrawn as a judgment and kept as a citation. |
| 6 | Keep the base with J-T1 blob-identity measurements over the moved window | ✅ **EXECUTED** — 27 of 27 paths SAME (E-40) |

### 1a.1 · What the amendments CURE

"Root means CHOSEN, not computed — however that set was gated by other facts" is exactly the reading §11 BLOCK-0.2 asked for, and it is ruled. **Six of this packet's nine earlier drops are REVERSED**: `npc.role`, `institution.name`, `faction.faction`, `faction.power` and `power seat.holder` are all chosen from candidate sets — gated by `institutions`, by `economicState`, by the tier catalogue, but chosen. **§6.3's `WORLD_FACT_PARAMS`/`WORLD_FACT_READS` predicate is SUPERSEDED and must not be built.** §5.1's writer measurements stand as executed facts — they are precisely the `writer`-by-symbol column both amendments require — but their root/derived interpretation is withdrawn.

### 1a.2 · ⛔ ITEM 1 — THE REGISTRY THE NEW PREDICATE NAMES HOLDS ZERO ROWS FOR THE EDITOR

Found exactly as the chair directed, from `PACKET_STANDARD.md:297` (*"A seeded chooser or pool mint carries two obligations. (a) Its decision-fork classification row, classified by the registry's own taxonomy"*) and `scripts/soak/flagConstraints.mjs:26` (*"decision-fork classification row in the habit fork registry"*). The registry is **`src/domain/worldPulse/habitForkRegistry.js#HABIT_FORK_REGISTRY`**. Measured (E-39):

- **42 rows across 32 distinct modules. Every module is under `src/domain/`. ZERO rows under `src/generators/`.**
- Its own charter line: *"every weighted decision fork in **`src/domain`** is classified here."*
- Its walker `tests/lint/chooserTotality.walker.test.js` scans `SCAN_ROOTS = ['src/domain/worldPulse','src/domain/spatial','src/domain/traditions','src/domain/region']` with `DOMAIN_FILES = walk(ROOT/'src/domain')`.

**Every chooser this packet must declare lives in `src/generators/`** — `pickFirst` (npcGenerator `:240`), the role selection (`getUpgradeOpportunities`), the institution assembly, `buildGovernanceLabels`. So *"the declaration census reads that registry"* yields, at this base, **an empty root set**, and *"the walker refuses a field with no chooser behind it"* would refuse **every field on every card**.

This is not an argument against the rule — the rule is right, and "a measurement, never a judgment" is the correct posture. It is a statement that **the registry's SCOPE must be widened to `src/generators/` before any EM-A1 can be READY**, and that widening is a chooser-totality act with its own STOP law (*"a fork that lands unclassified REDS the tree, and a wave that finds an unclassified fork STOPS"*), an estate-wide classification pass over the generator's forks, and a walker-scope change. **It is a packet of its own, and it is the chair's to charter.** EM-A1 cannot mint it: the standard assigns a decision-fork row to *"the minting wave"*, and EM-A1 mints no chooser — it declares ones that already exist.

### 1a.3 · ⛔ ITEM 2 — THE WIZARD'S OPTION SETS ARE ALREADY DOUBLED, AND THE FULLER HOME IS A FORBIDDEN IMPORT

The chair's instruction is *"pools that ARE the wizard's own option sets (find them by symbol; never a second copy)"*. Found by symbol (E-41):

| world fact | option set, by symbol | home | reachable from `src/domain/edit/**`? |
|---|---|---|---|
| terrain | `TERRAIN_OPTIONS` (7 values) | `src/components/gallery/galleryUtils.js:8` | ⛔ **NO** |
| culture | `CULTURE_OPTIONS` (11 values) | `src/components/gallery/galleryUtils.js:12` | ⛔ **NO** |
| culture | `CULTURE_PROFILE_KEYS` | `src/data/cultureProfiles.js:525` | ✅ yes |
| terrain | `TERRAINS` (7 values) | `tests/helpers/goldenMasterCorpus.js` | ⛔ a test helper |

Two measured obstacles, and they compound:

1. **`src/domain/edit/**` may import nothing from `src/components`** — ARCH §1's closing rule and `EM-PREAMBLE.md` §P4, both binding. The only home carrying BOTH terrain and culture as named option sets is under `src/components/`.
2. **Culture already has two spellings** (`CULTURE_OPTIONS`, 11 values, and `CULTURE_PROFILE_KEYS`) and terrain has three counting the golden corpus's. *"Never a second copy"* cannot be satisfied by choosing one — a pool binding to either culture symbol leaves the other live, which is the two-spellings defect the estate's own `factionRename.test.js` header records as the R-5 class.

**The ruling this needs:** either a domain-side canonical home for the wizard's option sets is minted first (a packet of its own, and the `check-writer-reach` / prose-manifest cost of moving a vocabulary is not this lane's to price), or the world-fact card's pools bind to per-fact symbols the chair names one by one with the second spellings' fate stated. Resources, goods, services and stressors were not pursued once terrain and culture blocked; naming their symbols is cheap once the home question is settled.

### 1a.4 · ✅ ITEM 3 — THE TWO NEW ROOT FIELDS, MEASURED

**`npc.status` — the record CARRIES it, PARTIALLY, and its vocabulary CONFLICTS with design §15.**

Measured over three tiers (E-42): `npcs[].status` is present on **1 of 7** NPCs (town), **3 of 15** (city), **0 of 5** (village), and the only observed value is `'active'`. Its declared vocabulary is at `src/domain/entities/npcs.js:30`:

```js
/** @typedef {'active'|'dead'|'missing'|'exiled'|'retired'|'removed'} NpcStatus
```

| design §15 | in the tree's `NpcStatus`? |
|---|---|
| `present` | ⛔ NO — the tree spells it `'active'` |
| `exiled` | ✅ yes |
| `jailed` | ⛔ NO |
| `dead` | ✅ yes |
| `departed` | ⛔ NO — the tree's `'removed'` carries *"NPC departed"* in its own comment |
| `missing` | ✅ yes |
| — | the tree also has `'retired'` and `'removed'`, which §15 does not |

**Three of six members agree.** Under FINITE-SEMANTICS (typed buckets, never a second spelling), declaring §15's six over a record whose writer emits the tree's six is a second vocabulary for one lifecycle — a STOP, not a merge. **Disposition: the packet declares the EXISTING field with the EXISTING `NpcStatus` vocabulary as its pool, or the chair re-spells §15.** Its writer is not a generator chooser at all but the entity/ops layer — `src/domain/entities/npcs.js:250` and `src/domain/events/mutateEntities.js:230,241,410` — which is a second reason item 1's registry cannot classify it.

**`institution.state` — the record carries NO such field, so the packet CREATES it.**

Measured (E-42): `institutions[].state` is absent on every generated record (0 of 38 village / 51 town / 48 city), and so is `institutions[].status` at generation — though `status` IS written later by the same ops layer (`mutateEntities.js:289`, `{ ...inst, status: 'active' }`) and IS in the writer-reach register. The nearest live expressions of §15's vocabulary:

- `impaired` → **not a scalar**: `institutions[].impairments` is an ARRAY of typed entries written by the pulse (`corruptionImpair.js:142` reads `i?.type === 'corruption'`; `blockadeTransport.js:46,62`). A scalar `state: 'impaired'` would be a second, lossier spelling of a set that already carries types and lifecycles.
- `ruined` → `settlement.history.ancientRuin` (`PlacementsLayer.jsx:110`) is a **settlement-level history record**, not an institution state.
- `destroyed`, `abandoned`, `under-construction` → **no home measured anywhere.**

**Disposition, per the chair's own instruction:** the field does not exist, so it is declared with its writer named as **EM-B1a's op**, and its readers are named as wave 3/4 work, not A1's — the economy desk's `impairedInstitution` option (`src/components/new/economyDeskRead.js:88-89,109`) and the ServicesTab impairment sets it draws from are the first readers that would consume a scalar state. ⚠ **But a new key on a persisted record is a persisted-shape act**, which `EM-PREAMBLE.md` §P2.3 routes through the observed-shape exemptions door as a CHAIR act, and the relation between a new scalar `state` and the live `impairments[]` array is a model question. Both are named, neither is taken.

### 1a.5 · The four things that survive BOTH amendments

1. ⛔ **FIVE named fields DO NOT EXIST on the record at any tier** — `institution.class`, `institution.standing`, `npc.disposition`, `faction.archetype`, `faction.stance` (E-7, executed over three tiers). A field nothing ever chose has no chooser row under any predicate. These stay dropped.
2. ⛔ **The decision-fork registry holds zero rows for `src/generators/`** (§1a.2).
3. ⛔ **The wizard's option sets are doubled and their fuller home is a forbidden import** (§1a.3).
4. ⛔ **Two of the three "card components" are not nameable symbols, and `InstitutionCard` is declared twice under one name** (§11 BLOCK-3) — unchanged by either amendment.

## 1c. ⭐⭐ THE CHAIR'S RULINGS CARRIED (§934.47 addendum) — the packet is DRAFT on two wave-0 dependencies

**Status moves BLOCKED → DRAFT.** Both former blocks became chartered wave-0 packets:

| was | is now |
|---|---|
| the registry holds no generator choosers | **EM-P2**, wave 0, lane P3. `Depends on: EM-P2`. |
| the option sets are doubled with no domain home | **EM-P3**, wave 0, compiled by this lane. `Depends on: EM-P3`. |

### 1c.1 · The root arm's contract on EM-P2 — THE ROW SHAPE THIS PACKET NEEDS

The chair asked this packet to name the shape. EM-A1's census reads one row per declared field and needs exactly **two fields plus a join key**:

```js
/** @typedef {{
 *   forkId: string,   // the step fork's name — the argument to rng.fork(name), stable across seeds
 *   module: string,   // the generator module, repo-relative, e.g. 'src/generators/npcGenerator'
 *   symbol: string,   // the chooser's own symbol, e.g. 'pickFirst' — the declaration's `writer`
 *   outputKey: string // the RECORD key the choice lands on, e.g. 'name'
 * }} GenerationForkRow */
```

**The join is `(cardShape, outputKey) → row`**, and the declaration's `writer` is `` `${module}#${symbol}` ``. Three properties this packet depends on, stated so EM-P2 can honour or refuse them:

1. **`outputKey` is REQUIRED, not optional.** The existing `HABIT_FORK_REGISTRY` row shape (`arity, actionVocabulary, closeSource, closeOwed, domain, forkId, module, symbol, discovery, disposition, reason, circumstanceClasses` — E-39) carries **no output key**, and without one a fork cannot be joined to a field. This is the one shape change EM-A1 asks for.
2. **`symbol` must resolve against SOURCE, not exports.** `pickFirst` is module-local (`npcGenerator.js:240`, no `export` — E-31). A registry that can only name exports cannot name the one chooser this packet most needs.
3. **A fork may carry several `outputKey`s** (one chooser writing `name` and `gender`), so the join is one-to-many and the census must not assume uniqueness.

⚠ **Until EM-P2 lands, the root arm is authored but DARK**: it asserts its own denominator is non-empty and skips nothing silently. A dark arm that passes over an empty registry is the vacuous green `EM-PREAMBLE.md` §P6 forbids, so the arm reds on an empty registry rather than passing.

### 1c.2 · ⭐ THE REAL ROOT-CANDIDATE FIELDS, ENUMERATED FROM THE RECORD (chair item 4)

Measured over **60 settlements** (5 seeds × 6 tiers × 2 cultures): 2,193 institutions, 551 NPCs, 360 power factions, 165 grouping factions, with per-field occupancy (E-43). Only fields that EXIST on the record, or that a named wave-1 packet creates, are declared.

**institution** — `settlement.institutions[]`

| ARCH name | real field | occupancy | disposition |
|---|---|---:|---|
| `name` | `name` | **100%** | DECLARE (`free-cascade` — but see §11 BLOCK-1: no institution cascade exists) |
| `class` | **`category`** | **100%** | DECLARE, **MAPPED** — `class` → `category`, recorded in §1 |
| `standing` | — | — | ⛔ **DROP.** No counterpart at any occupancy. |
| (new, §15) | `state` | **0%** | **CREATE** — scalar root, writer `EM-B1a#set-institution-state`, vocabulary `{active, impaired, ruined, destroyed, abandoned}` |

**npc** — `settlement.npcs[]`

| ARCH name | real field | occupancy | disposition |
|---|---|---:|---|
| `name` | `name` | **100%** | DECLARE (`free-cascade`; `NPC_RENAME_SURFACES[0]`) |
| `role` | `role` | **100%** | DECLARE (`pool`) |
| `disposition` | — | — | ⛔ **DROP.** The nearest are `personality` (an OBJECT: dominant/flaw/modifier/tell/speech, 90%) and `presentation` (90%) — neither is a scalar disposition, and declaring an object as a pooled field is a model change. |
| (new, §15) | `status` | **10%** (53 of 551) | **DECLARE THE EXISTING FIELD**, vocabulary `{active, exiled, jailed, dead, missing, retired, removed}` per the chair's respelling; writer `src/domain/entities/npcs.js#createNpc` / `src/domain/events/mutateEntities.js`, which `set-npc-status` will call |

⚠ **`status` rides at exactly 10% with `importance`, `linkedFactionIds`, `linkedInstitutionIds`, `generatedAs`, `legitimacyContribution` and `stabilityContribution` — all 53 of 551.** That is one family: the structural-seat NPCs. A declaration that assumes `status` on every NPC is wrong nine times in ten, so the card must show it empty (design §2.1: *"Empty fields are declared and shown empty"*).

**faction** — `settlement.powerStructure.factions[]`

| ARCH name | real field | occupancy | disposition |
|---|---|---:|---|
| `name` | **`faction`** | **100%** | DECLARE, **MAPPED** — the canonical spelling is `faction`; `.name` is the legacy alias `FACTION_RENAME_SURFACES` writes only where a record already carries it, and it is **absent on every generated record** |
| `archetype` | **`category`** | **100%** | DECLARE, **MAPPED**. ⛔ **The chair's parenthetical "(e.g. a faction's `type` for 'archetype')" is REFUTED: there is no `type` on any faction record** — not on `powerStructure.factions[]` (12 distinct keys over 360 records) nor on `factions[]` (7 keys over 165). ⚠ `category` is itself derived from the NAME by `inferFactionCategory` (`factionCategories.js:149`), so editing the name moves it — a coupling EM-B2's pinned re-derivation must carry. |
| `stance` | — | — | ⛔ **DROP.** No counterpart at any occupancy. |
| `power` | `power` | **100%** | DECLARE (root under the totality guard, §14's default) |

**power seat** — `settlement.powerStructure`

| ARCH name | real field | occupancy | disposition |
|---|---|---:|---|
| `holder` | `governingName` + `factions[].isGoverning` | `isGoverning` **17%** (60 of 360) | ⚠ **DECLARE WITH A NAMED HAZARD.** `governingName` has **TWO writers** — `rulingStructure.js:787` and `economyReconciliation.js:277` — against `EM-PREAMBLE.md` §P4's one-writer law. The seat is a projection of `isGoverning`, so a `set-power-holder` op must move the flag and let the name follow, never write the name. Recorded, not resolved. |

**Total declared: 10 fields across 4 cards** (2 institution + 1 created, 2 npc + 1 existing-status, 3 faction, 1 power seat), plus the world-fact card's 7 from EM-P3. **Five ARCH names are dropped for having no counterpart** — `institution.standing`, `npc.disposition`, `faction.stance`, and (already) the struck system-state cards.

### 1c.3 · The wave-1 walker's INTEGRITY arm (chair item 5)

The pencil half waits for wave 4's nameable card components (§11 BLOCK-3 is therefore **deferred, not blocking**). At wave 1 the walker asserts the declaration set's own integrity, in four arms with no discretion:

```text
ARM I-1  EXISTENCE. Every declared field either (a) appears on its card's record in a
         corpus this test generates — at least one tier, asserted non-empty — or
         (b) names a CREATING packet id in a `createdBy` field, and that id is one of
         a frozen list of wave-1 packet ids spelled in the walker. Anything else REDS.
ARM I-2  POOLS. Every `kind: 'pool'` row names a pool id present in POOLS (EM-A2).
ARM I-3  WRITERS. Every `writer` parses as `path#symbol`, the path exists, and the
         symbol is declared in that file EXACTLY ONCE (zero or two REDS — the
         `InstitutionCard` double declaration is the live precedent, E-11).
ARM I-4  ROOTS (dark until EM-P2). Every declared field joins a GenerationForkRow on
         (cardShape, outputKey), OR carries `createdBy`. The arm REDS on an empty
         registry rather than passing vacuously.
```

⭐ **I-1 is the arm that would have caught this packet's own first draft**, which declared five fields that do not exist. It is the cheapest guard in the wave and it is why it is listed first.

---

## 1b. (superseded — retained for the record) WHAT §934.45 FIRST CHANGED

§934.45 landed while this packet was being written. Read against the measurements already executed, it does two opposite things, and both are recorded rather than quietly absorbed.

**IT CURES the larger half.** *"Root means CHOSEN, not computed … however that set was gated by other facts."* That is exactly the reading §11 BLOCK-0.2 asked the chair to rule on, and it is now ruled. Six of the nine drops above are therefore **REVERSED**: `npc.role`, `institution.name`, `faction.faction`, `faction.power` and `power seat.holder` are all CHOSEN from candidate sets — gated by `institutions`, by `economicState`, by the tier catalogue, but chosen — so under §934.45 they are ROOTS. **§6.3's predicate is SUPERSEDED with them**: `WORLD_FACT_PARAMS` / `WORLD_FACT_READS` over the writer's source measures "reads no other world fact", which is no longer the test. It must not be built.

**IT DOES NOT CURE the smaller half, and the smaller half is now the whole block.** Two findings survive the re-ruling untouched, because neither is about the root test:

1. ⛔ **FIVE of the named fields DO NOT EXIST on the record at any tier** — `institution.class`, `institution.standing`, `npc.disposition`, `faction.archetype`, `faction.stance` (E-7, executed over village/town/city). A field that no generator writes has no chooser, so it has no row in any registry and no candidate set to pool from. "Root means chosen" cannot admit a fact nothing ever chose. These five stay dropped under every reading, and §934.45 names all five as roots.
2. ⛔ **THE REGISTRY §934.45 NAMES AS THE ROOT SET CANNOT SEE A SINGLE ONE OF THESE CHOOSERS.** Measured (E-39): the decision-fork classification registry is `src/domain/worldPulse/habitForkRegistry.js#HABIT_FORK_REGISTRY` — **42 rows across 32 modules, every one under `src/domain/`, ZERO under `src/generators/`** — and its walker `tests/lint/chooserTotality.walker.test.js` scans `SCAN_ROOTS = ['src/domain/worldPulse','src/domain/spatial','src/domain/traditions','src/domain/region']` with `DOMAIN_FILES = walk(ROOT/'src/domain')`. Its own charter line is *"every weighted decision fork in `src/domain`"*. **Every chooser this packet must declare lives in `src/generators/`** — `pickFirst` (npcGenerator), the role selection (`getUpgradeOpportunities`), the institution assembly, `buildGovernanceLabels`. So *"the root set is that registry's rows — a measurement, never a judgment"* is, at this base, a root set of **zero rows for the editor**.

**The consequence, stated plainly.** §934.45 replaced a predicate this lane measured as too narrow with one whose named source is empty for this subject. The packet is still BLOCKED, but the question is now a different and much smaller one — §11 BLOCK-0, rewritten below.

⚠ **Nothing in §5.1 is withdrawn.** Its writer measurements stand as executed facts and are exactly what a `writer`-by-symbol column needs; only their INTERPRETATION as root-versus-derived is superseded. The table is kept because §934.45 still requires *"the field's `writer` by symbol"*, and it is the only executed source for those symbols.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** `src/domain/edit/fieldDeclarations.js` declares every editable ROOT field of the first card types with `kind`, `group`, `provenance: 'root'` and the field's `writer` by symbol; `declarationsFor(cardType)` returns them; `tests/lint/editDeclarations.walker.test.js` refuses a pencil without a declaration, refuses a `pool` field naming no pool, and **refuses any declaration whose named writer reads another world fact.**

**Definition of done:** the two pure leaves exist, the declaration battery is green, and the walker is green with its root arm convicting a planted derived field.

In scope:

1. **One primary behaviour:** the root-only declaration table and its reader.
2. **One required integration:** NONE — wave 1 is HEADLESS.
3. **One prevention guard:** `tests/lint/editDeclarations.walker.test.js`, including the root arm (§6.3).

Explicit non-goals:

- the pool catalogue (`EM-A2`), the flavor census's proofs (`EM-A3`), ops, the layer, the registry;
- the DERIVED cards' provenance rendering (§14's *"follows from X — change X"*) — that is a surface, and wave 1 is headless;
- any component, store surface, feature flag, persisted key, golden, tuning, migration or UI;
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `0` |
| Named state writers | `0` |
| Feature flags | `0` |
| User-facing surfaces | `0` |
| Direct consumers | `0` |
| New logic-bearing production leaves | `2` (`fieldDeclarations.js`, `types.js`) |
| Existing logic-bearing production files modified | `0` |
| Additional registration-only files | `1` (`scripts/mutation-coverage-manifest.json`) |
| Handwritten files total | `5` |
| New/changed effective production lines | `≤ 260` |
| Effective lines per new leaf | `≤ 210` (`fieldDeclarations.js`) · `≤ 60` (`types.js`, JSDoc only) |
| Delta in a shared/hot file | `n/a` — **NO hot file is named.** None of the five standing rows appears in §7. |
| Acceptance cases | `8` |

Overrides approved before dispatch: `NONE`. **The budget FITS**; the packet is blocked on §11, never on size.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-A1
```

Expected: all four CREATE targets ABSENT, the one REGISTER target clean, every `requiredSymbols` row resolving verbatim. Any mismatch makes this packet STALE. ⛔ Dispatch is refused at BLOCKED status.

## 5. Verified tree contract

### 5.1 ⭐ THE ROOT/DERIVED TABLE — every field the amendment names, its writer MEASURED

The §14 predicate: a field is ROOT iff its writer reads **no world fact** — only the seed, the dials (`culture`, `tier`, `terrainOverride`, `tradeRouteAccess`, `monsterThreat`, the config) and its own seeded stream.

| card | field | exists at base? | writer (path#symbol) | what the writer reads | §14 verdict | evidence |
|---|---|---|---|---|---|---|
| npc | `name` | **YES** | `src/generators/npcGenerator.js#pickFirst` (`:240`), called at `:106` as `pickFirst(culture, gender, true, tier)` | `culture` (dial), `tier` (dial), `gender` (its own roll), a literal | ⭐ **ROOT** | E-22 |
| npc | `role` | YES | `src/generators/npcGenerator.js#generateNPCs` (`:1440`) | `settlement.institutions` (destructured `:1447`), `getUpgradeOpportunities(institutions, tier, weights)` (`:1471`), `powerFactionCats`, `institutions.some(isCommerceGuild)`, `config.stressTypes` | **DERIVED** | E-23 |
| npc | `disposition` | **NO** | — | — | **no field** | E-7 |
| institution | `name` | YES | `src/generators/steps/assembleInstitutions.js` (the assembly step) | `worldLaw.allowsInstitution({…})`, the tier catalogue `catalogForTier`, `fullCatalogAllTiers`, the toggles, the probability machinery | **DERIVED** | E-24 |
| institution | `class` | **NO** | — | — | **no field** | E-7 |
| institution | `standing` | **NO** | — | — | **no field** | E-7 |
| faction | `faction` (the name; `name` is absent on a generated record) | YES | `src/generators/power/rulingStructure.js#generatePowerStructure` (`:79`) via `src/generators/power/governanceNarrative.js#buildGovernanceLabels` (`:694`) | `economicState`, `institutions`, `neighbourRelationship`, `stressFlags`, `stressTypes`, `priorities`, `projection` | **DERIVED** | E-25 |
| faction | `archetype` | **NO** (`category` is the record's field) | `src/generators/power/factionCategories.js#inferFactionCategory` (`:149`) | **the faction's display NAME** | **no field**; and its nearest real field is a derivation OF a declarable field | E-7, E-26 |
| faction | `stance` | **NO** | — | — | **no field** | E-7 |
| faction | `power` (share) | YES | `generatePowerStructure` (`:79`) | `economicState.prosperity` (`:498-499`), plus the caps and priority bonuses | **DERIVED** ⚠ contradicts §14's vetoable default | E-25 |
| power seat | holder (`powerStructure.governingName`) | YES | `rulingStructure.js:787` `(factions.find(f => f.isGoverning) \|\| {}).faction` **and** `economyReconciliation.js:277` `powerStructure.governingName = projected.governingName` | the faction roster — **a projection, and TWO writers** | **DERIVED** | E-27 |

**Ten named, nine dropped, one kept.** ⚠ And the one that is kept carries a spelling hazard: `pickFirst` is **module-local** (`const pickFirst = (…) =>` at `:240`, no `export`), so a `writer` string is resolved by path-and-symbol against source, never by import — §6.2 settles that.

### 5.2 The rest of the verified contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Join-key authority | `src/domain/factionRename.js` | `NPC_RENAME_SURFACES` | 5 declared key surfaces, the first being `npcs[].name` (E-5) | `npc.name` is `free-cascade`, never `free` |
| Join-key authority | `src/domain/factionRename.js` | `FACTION_RENAME_SURFACES` | 32 declared surfaces (E-5) | The faction cascade; no institution name is in it |
| Join-key ruling ledger | `src/domain/factionRename.js` | `NON_CASCADED_SURFACES` (16) · `NPC_NON_CASCADED_SURFACES` (13) | The written exclusions (E-5) | Never widen from a packet |
| ⛔ Absent cascade | *(whole tree)* | — | No institution rename cascade: `git grep -l -i 'institutionRename\|renameInstitution'` → 0 files (E-8) | Moot once `institution.name` drops as DERIVED — but recorded, because `npcs[].institution` joins on it (E-9) |
| Card component (institution) | `src/components/primitives/InstitutionCard.jsx` | `export default function InstitutionCard` | Named export; a second, unexported `InstitutionCard` exists at `src/pdf/sections/Institutions.jsx:163` (E-10, E-11) | The pencil arm's binding subject |
| Card component (npc) | `src/components/new/tabs/NPCsTab.jsx` | `export function NPCsTab` | The NPC tab (E-10) | — |
| ⛔ Per-NPC card unit | `src/components/new/npcComponents.jsx` | `NPCInlineCard` (`:186`) | **Module-local, no export** (E-12) | §11 BLOCK-3 |
| Card component (faction) | `src/components/new/tabs/power/PowerStrata.jsx` | `export function TheFactions` | The per-faction card is an **anonymous `roster.map` block** inside it (E-13) | §11 BLOCK-3 |
| ⛔ Power-seat card | *(none measured)* | — | §14 adds "power seat" to the card list; the seat's field is DERIVED (§5.1), so no component was pursued | §11 BLOCK-0 |
| Census instrument | `tests/lint/sovereigntyLightingContract.walker.test.js` | `TEST_FILES` · `CENSUS` | Counts **TEST files** (`:515-518`), asserted `:7460`; register at `files 2645 · parked 383 · credited 2262 · titles 25009 · suiteTitles 6670` (E-14) | §7 / §11 BLOCK-5 |
| Registration instrument | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` | `tests/lint` first of eight; manifest carries 704 `invariants`, 171 under `tests/lint/` (E-15) | §7 row 5 |
| Test precedent (domain) | `tests/domain/factionRename.test.js` | `describe('faction rename — the INDEPENDENT denominator')` › `test('every stored path that carries a faction name is declared, or ruled out in writing')` | An independent denominator that never reads the module's own declarations (E-16) | Copy this proof shape |
| Test precedent (walker) | `tests/lint/habitBandsReconciliation.walker.test.js` | `describe('HB — the Bands line reconciles against the tuning seam, both directions')` › `test('GUARD-THE-GUARD: a Bands line planted on a no-bands wave REDS')` | Literal titles, both-directions reconciliation, one planted-mutation arm (E-16) | Copy this walker shape |
| Golden posture | `tests/property/generatorGoldenMaster.test.js` · `tests/property/dossierProseManifest.test.js` | — | Neither appears in §7 | UNCHANGED; motion is a STOP |

Forbidden alternatives:

- no second declaration table, registry, classifier, time source, PRNG stream or writer;
- no new top-level `worldState` key; no persisted key at this wave;
- no direct edits to `src/components/**`, `src/store/**`, `src/generators/**`, `src/domain/factionRename.js`, either golden, or `tests/lint/.lighting-census-baseline.json` by hand;
- ⛔ **no declaration of a DERIVED field** — the root arm refuses it, and widening the arm to admit one is a STOP;
- no files outside the manifest.

## 6. Exact contracts

### 6.1 Inputs and outputs — SETTLED

```js
/**
 * @param {string} cardType
 * @returns {readonly FieldDeclaration[]}  frozen, authored order; the SAME shared frozen
 *   EMPTY array for an unknown or undeclared cardType — never null, never a throw.
 */
export function declarationsFor(cardType) {}

/** @param {string} cardType @returns {boolean} `declarationsFor(cardType).length > 0` */
export function isEditableCard(cardType) {}

/** @type {Readonly<Record<string, readonly FieldDeclaration[]>>} deep-frozen */
export const FIELD_DECLARATIONS = Object.freeze({ /* … */ });
```

### 6.2 State schema — SETTLED, at the amended typedef

```js
/** @typedef {'pool'|'free'|'free-cascade'} FieldKind */
/** @typedef {{ card: string, field: string, kind: FieldKind, pool?: string, label: string,
 *   group: string, maxLength?: number, readersProof?: string,
 *   provenance: 'root', writer: string }} FieldDeclaration */
```

**`provenance` is the literal string `'root'` on every row.** It is not an enum with a second member: §14 admits no other value, and the walker refuses a derived field outright, so a declaration for one cannot exist. A row spelling anything else is a walker red.

**`writer` is `'<repo-relative path>#<symbol>'`** — e.g. `'src/generators/npcGenerator.js#pickFirst'`. Three rules, each settled because the measurement forced them:

1. The symbol is resolved **against that file's source**, never against its exports. `pickFirst` is module-local (E-22); a contract that required an export would exclude the one root field the tree has.
2. The path must exist and the symbol must be declared in it exactly once. Zero or two declarations is a walker red — the `InstitutionCard` collision (E-11) is the live precedent for why "exactly once" and not "at least once".
3. The symbol named is the **narrowest** function that assigns the field's value, not the step that calls it. `pickFirst`, not `generateNPCs`. This is the whole content of §14: the step reads the world; the narrow writer does not.

Absence rules:

- `pool`: present iff `kind === 'pool'`; on any other kind, a walker red.
- `maxLength`: present iff `kind` is `'free'` or `'free-cascade'`; absent on `'pool'`.
- `readersProof`: present iff `kind === 'free'` (EM-A3 mints the value). Absent on `'pool'` and on `'free-cascade'`, whose proof is the cascade.
- `provenance`, `writer`, `card`, `field`, `kind`, `label`, `group`: **required on every row**, all non-empty.
- an empty `FIELD_DECLARATIONS[cardType]`: **forbidden** — an undeclarable card type is absent from the table, never present-and-empty.
- `null` anywhere in a row: **forbidden**.

### 6.3 ⭐ The walker's three arms — the ROOT arm specified with no discretion

The chair's amendment asks exactly how the root arm measures its predicate, and names three candidate sources. **Measured, only the third can answer it, and the packet says so rather than citing all three:**

| candidate source | can it answer "does this writer read another world fact"? | measured reason |
|---|---|---|
| `scripts/.writer-reach-baseline.json` | **NO** | its `stopSet` is `["src/generators/","src/store/","src/workers/","src/lib/instantWorld/"]` — every closure HALTS at `src/generators/`, which is where every declared writer lives. The scanner's own header: *"the same read planted at a `src/generators/` path lights nothing."* It also persists no per-file reader map. (E-2 of `EM-A3.evidence.md` · F-2, F-3) |
| `scripts/.observed-shape-readers-baseline.json` | **NO** | it is the READER-WITH-NO-WRITER inventory; a declared field is written by definition, so it is out of that population. (F-5, F-6) |
| **the generator step's own reads** | **YES** | the writer's source is readable, and the predicate below is decidable over it. |

**ARM 3 — THE ROOT ARM. The exact predicate, over the `writer`'s own source:**

```text
For each declaration row:
  1. Split `writer` at '#'. Assert the path exists and the symbol is declared in it
     EXACTLY ONCE (a function declaration or a const arrow). Zero or two → RED.
  2. Take that symbol's own body, from its declaration to the close of its function
     scope, by a source-position scan anchored on the declaration — never a line number.
  3. RED if the symbol's FORMAL PARAMETER LIST contains any identifier in
     WORLD_FACT_PARAMS, or if its BODY references any identifier in WORLD_FACT_READS.
  4. Otherwise the row is ROOT and `provenance: 'root'` is honest.
```

Both vocabularies are **closed and spelled in the walker**, derived from the generator signatures this packet measured:

```js
// The receivers a generator step takes when it reads the already-derived world.
const WORLD_FACT_PARAMS = Object.freeze([
  'settlement', 'institutions', 'factions', 'powerStructure', 'economicState',
  'neighbourRelationship', 'projection', 'priorities', 'stressFlags', 'instFlags',
  'instNames', 'npcs', 'weights',
]);
// The same set, plus the property paths a body reaches them through.
const WORLD_FACT_READS = Object.freeze([...WORLD_FACT_PARAMS, 'worldLaw', 'generationContext']);
```

⛔ **The seed and the dials are NOT in either list, and that is the whole test:** `culture`, `tier`, `gender`, `config`, `terrainOverride`, `tradeRouteAccess`, `monsterThreat`, `seed` and a literal are all permitted. A widening of either vocabulary is a STOP, not an edit — the lists are what make "root" mean something.

**Executed sanity of the predicate at this base, both directions (E-22, E-23):**

- `src/generators/npcGenerator.js#pickFirst` — parameters `(culture = 'germanic', gender = 'male', withSurname = true, tier = 'town')`. **No member of either list. PASSES → ROOT.**
- `src/generators/npcGenerator.js#generateNPCs` — destructures `const { tier, institutions } = settlement;` and calls `getUpgradeOpportunities(institutions, tier, weights)`. **`settlement`, `institutions`, `weights`. FAILS → DERIVED.**

**The planted proof the amendment requires (case A5b).** The arm's own fixture plants the declaration
`{ card: 'npc', field: 'role', kind: 'pool', pool: 'npc.role', provenance: 'root', writer: 'src/generators/npcGenerator.js#generateNPCs', … }`
and asserts the arm REDS with a message naming both the field and the offending identifier. ⭐ **It is planted as a REAL derived field, not a synthetic one** — `npc.role` is the exact field §1 dropped, so the arm's catching power is proved against the tree rather than against an invention. A synthetic writer would prove only that the walker can read a string.

**ARM 1 — the pencil arm.** *"Every card rendering a pencil has a declaration."* At wave 1 no pencil exists (`src/components/edit/**` is absent — E-2), so the arm is a **TOTALITY OVER THE EMPTY SET WITH A PROVEN NON-EMPTY DENOMINATOR**: it scans `src/components/**` for the pencil marker EM-D1 will mint, asserts the found set is exactly empty, and asserts in the same test that the scan walked a non-empty corpus. It becomes load-bearing the day EM-D1 mints the first pencil, with no edit here. The zero is asserted, never assumed.

**ARM 2 — the pool arm.** *"Every `pool` field names a pool in `POOLS`."* ⛔ `POOLS` does not exist at this base — §11 BLOCK-4.

### 6.4 Ordering, determinism, flag, lifecycle, receipts — SETTLED

- Stable enumeration: authored order, returned verbatim; `declarationsFor` sorts nothing. One row per `(card, field)`; a duplicate is a walker red.
- Pipeline/tick position: **NONE.** Pure data.
- Hash/fork key `NONE`; no rounding; **no PRNG is reachable** (`EM-PREAMBLE.md` §P5 HZ-PRNG — `rollFrom` is EM-A2's); no ambient time, locale or environment read.
- Flag: `NONE`. Golden posture: **UNCHANGED**, proved by the zero-importer scan (§8 step 1).
- Lifecycle: module load, frozen; read by `declarationsFor`; **never persisted**; every other column `n/a`.
- Receipts: `NONE`. DM-only fields: `NONE`. Public projection: `n/a` — nothing persists, so nothing travels.
- Alignment: `DECLARED EMPTY: a declaration table takes no alignment position.`
- Edit story: `ENGINE-ONLY: this wave is the source the editor is generated FROM; it exposes no DM verb.`

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/types.js` | `FieldKind`, `FieldDeclaration` JSDoc typedefs | `≤ 60` | Author the AMENDED typedefs (§6.2) verbatim, including `provenance` and `writer`. Export nothing executable; import nothing. |
| `CREATE` | `src/domain/edit/fieldDeclarations.js` | `FIELD_DECLARATIONS`, `declarationsFor`, `isEditableCard` | `≤ 210` | Author the deep-frozen ROOT-only table the chair rules in §11 BLOCK-0, plus the two readers at §6.1's exact signatures. Import only `./types.js`. |
| `TEST` | `tests/domain/editDeclarations.test.js` | cases A1–A4, A7 | `n/a` | Literal `test` titles only — no `.each`, no loop-generated registration, no nested `describe` (`EM-PREAMBLE.md` §P3.4). |
| `TEST` | `tests/lint/editDeclarations.walker.test.js` | cases A5, A5b, A6 | `n/a` | The three arms of §6.3. Literal titles only; every negative assertion carries `// anchored:` on the line immediately above (`EM-PREAMBLE.md` §P6). |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | `invariants['tests/lint/editDeclarations.walker.test.js']` | `≤ 12` | ONE row, surgically beside its `tests/lint/` siblings. ⛔ Never re-serialise the manifest whole. |

Generated artifacts: `NONE`. **Neither new leaf is inside an edge-shared bundle closure** — `scripts/build-edge-shared.mjs`'s entry modules are exactly `src/domain/aiCharter.js`, `src/domain/aiGrounding.js`, `src/domain/aiOutputSchema.js`, `src/domain/intentAtlas.js` and `src/lib/analyticsEvents.js`, and the file names `src/domain/edit` zero times (E-28).

No other file may be edited.

**Predicted register moves, priced here rather than discovered at the terminal:**

| Register | Moves? | Predicted delta | Door |
|---|---|---|---|
| Lighting census | **YES — INTERIOR RED at this member's commit** | `files 2645 → 2647` · `credited 2262 → 2264` · `parked 383` UNCHANGED · `titles +T` · `suiteTitles +2` | Re-derived WHOLE at the train terminal (`EM-PREAMBLE.md` §P3.2) |
| | | ⛔ **The cause is the TWO NEW TEST FILES, not the two new `src/domain/**` leaves** — `EM-PREAMBLE.md` §P2.1's stated cause is refuted; §11 BLOCK-5. | |
| Mutation-coverage manifest | **YES** | `invariants` 704 → 705; `tests/lint/` rows 171 → 172 | §7 row 5, this member's commit |
| Writer-reach register | **NO** | zero — the §P2.4 statement, with its measurement: this wave adds **no reader of any settlement field**. `fieldDeclarations.js` holds field names and writer names as STRINGS in a frozen table and dereferences no record; the register grades four read-site kinds (property access, string element access, destructuring, `'k' in x` — `writer-reach-scan.mjs:356-440`) and a string literal is none of them. The walker READS generator source as TEXT from `tests/lint/`, which no closure walks. **Neither `--write` nor a mint is owed.** (E-17) |
| Observed-shape register | **NO** | zero | No save-time key is read; EM-B3 owns that door. |
| Prose-numerics · size-baseline · edge-shared | **NO** | zero | Nothing rendered, baselined, or inside a closure. |

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch.
1. **Capture the dormancy evidence FIRST:** a source scan asserting the two new leaves have ZERO importers anywhere in `src/`, landed as a registered case inside `tests/domain/editDeclarations.test.js` (`PACKET_STANDARD.md` step 1; the HB-0 precedent).
2. Add the failing tests for A1–A7 (eight cases: A1–A5, A5b, A6, A7).
3. Implement `src/domain/edit/types.js`.
4. Implement `src/domain/edit/fieldDeclarations.js`.
5. Wire consumers: **NONE** — headless by construction.
6. Add the walker (all three arms, §6.3) and the one manifest row.
7. Run focused verification (§10).
8. Write the completion receipt. ⛔ The bare full gate and the boot smoke belong to the TRAIN TERMINAL.

Bounded algorithm (`declarationsFor`):

```text
1. If cardType is not a non-empty string, return the shared frozen EMPTY array.
2. Look up FIELD_DECLARATIONS[cardType] with Object.hasOwn — never a prototype walk.
3. If absent, return the SAME shared frozen EMPTY array (identity-stable across calls).
4. Otherwise return the frozen authored array by reference; never a copy, never a sort.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behaviour | each declared cardType | authored rows, authored order, frozen; `isEditableCard` true | `tests/domain/editDeclarations.test.js` |
| A2 | Absent/unknown | `undefined`, `''`, `'nope'`, `42`, `'constructor'`, `'toString'` | the SAME frozen empty array by identity every time; `isEditableCard` false; no throw | `tests/domain/editDeclarations.test.js` |
| A3 | Counterforce — the record is the denominator | settlements generated at village, town and city | every declared `field` is a live key on that card's record at at least one tier; the message names the field and the card | `tests/domain/editDeclarations.test.js` |
| A4 | Boundary — the kind and provenance law | the whole table | `pool` iff kind pool; `maxLength` iff free-ish; `readersProof` iff free; `provenance === 'root'` on every row; `writer` non-empty and `path#symbol`-shaped; `group` non-empty; no duplicate `(card, field)` | `tests/domain/editDeclarations.test.js` |
| A5 | The pencil and pool arms | the source tree | arm 1's found set is exactly empty over a proven non-empty corpus; arm 2 per §11 BLOCK-4 | `tests/lint/editDeclarations.walker.test.js` |
| A5b | ⭐ THE ROOT ARM + GUARD-THE-GUARD | the live table, plus a planted `npc.role` row whose `writer` is `generateNPCs` | every live row's writer passes §6.3's predicate; **the planted row REDS**, naming the field and the offending identifier (`settlement`/`institutions`) | `tests/lint/editDeclarations.walker.test.js` |
| A6 | The predicate's vocabulary cannot rot | `WORLD_FACT_PARAMS` / `WORLD_FACT_READS` | both are non-empty and frozen; each member is matched by at least one real generator signature in the tree, so a dead token cannot pad the list | `tests/lint/editDeclarations.walker.test.js` |
| A7 | Idempotency / purity | repeated calls | `declarationsFor(t) === declarationsFor(t)` by identity; the table is deep-frozen (a write throws in strict mode) | `tests/domain/editDeclarations.test.js` |

Rows for persisted duplication, lifecycle round trip, writer-to-reader integration and privacy are **omitted, not replaced**: this wave persists nothing, has no writer and no reader, and carries no private field.

## 10. Verification commands

```sh
npx eslint src/domain/edit/types.js src/domain/edit/fieldDeclarations.js \
  tests/domain/editDeclarations.test.js tests/lint/editDeclarations.walker.test.js
npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json — src/domain/edit/** must be clean

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/editDeclarations.test.js --maxWorkers=2
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/editDeclarations.walker.test.js \
  tests/lint/mutationCoverageManifest.test.js tests/lint/negativeAssertionAnchor.walker.test.js --maxWorkers=2

# The named interior red, run so its figure is RECORDED rather than discovered
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js --maxWorkers=2

node scripts/implementation-packets.mjs validate
```

Expected: every command exits `0` **except** `sovereigntyLightingContract.walker.test.js`, the ONE named interior red at §7's figures. ⛔ A gate-mutex line that prints no test count DID NOT RUN. Report actual counts; copy no historical count.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if: the dispatch seal is missing or belongs to another worktree state; either golden moves; a declared field is not a live key on its record; **a declared writer fails §6.3's predicate**; `WORLD_FACT_PARAMS` or `WORLD_FACT_READS` would need widening; a component imports either new leaf; or a second declaration home appears necessary.

---

### ⛔ THE BLOCKS

**BLOCK-0 (REWRITTEN at the second amendment) — the new predicate's named source is EMPTY for this subject, and two of the five cards cannot be sourced.**

The chair's item 1 replaces the root predicate with *"its writer is a registered decision-fork … the declaration census reads that registry, and the walker refuses a field with no chooser behind it."* Measured (§1a.2, E-39): the registry is `src/domain/worldPulse/habitForkRegistry.js#HABIT_FORK_REGISTRY` — **42 rows, 32 modules, all under `src/domain/`, ZERO under `src/generators/`** — and its walker scans four `src/domain/*` roots. Every chooser this packet declares is in `src/generators/`. **The census would admit nothing and the walker would refuse everything.**

Three things must be ruled before EM-A1 can be READY, and none is a lane's:

1. **Widen the chooser registry to `src/generators/`** — an estate-wide classification pass under the chooser-totality STOP law, plus a walker-scope change. A packet of its own, chartered before EM-A1. ⚠ EM-A1 cannot mint those rows: the standard assigns a decision-fork row to *"the minting wave"*, and EM-A1 mints no chooser.
2. **Give the world-fact card's pools a domain-reachable canonical home** (§1a.3): the fuller option sets live in `src/components/gallery/galleryUtils.js`, which `src/domain/edit/**` may not import, and culture already has two spellings.
3. **Reconcile design §15's `npc.status` vocabulary with the tree's `NpcStatus`** (§1a.4) — three of six members agree, and FINITE-SEMANTICS forbids the second spelling.

⭐ **What is NOT blocking any more, and should be read as progress:** the §934.44 "reads no other world fact" predicate that would have emptied the catalogue to one field is superseded; `npc.role`, `institution.name`, `faction.faction`, `faction.power` and `power seat.holder` are all chosen facts and belong on their cards. The five never-existing fields are dropped per the amendment's own procedure and recorded in §1. **The blocks that remain are about SOURCES the declaration must read, not about which facts are editable.**

**BLOCK-3 — two of the three "card components" are not nameable symbols, and the fourth card has none.** (Unchanged; now narrower because the arm-1 binding is the only thing that needs them.) `NPCInlineCard` is module-local (`npcComponents.jsx:186`, no export); the per-faction card is an anonymous `roster.map` block inside `TheFactions`; §14's new "power seat" card was not pursued because its field is derived. And `InstitutionCard` is declared twice in the tree under one name (E-11), so a name-only binding is ambiguous. Whether arm 1 binds by a minted marker attribute, by file, or by an export EM-D1 adds is the chair's ruling.

**BLOCK-4 — the walker's pool arm reads `POOLS`, which EM-A2 creates, and the charter declares no dependency.** At the base the only `export const POOLS` in `src/` is `src/domain/worldPulse/peopleLedger.js:59`, an unrelated vocabulary (E-2). Either EM-A1 ships arm 2 dark and EM-A2 lights it (making EM-A2 edit EM-A1's walker — an undeclared collision), or the order inverts, or arm 2 moves to EM-A2. `Depends on:` records EM-A2 provisionally so the contradiction is visible. ⚠ **If BLOCK-0 resolves to the one-field table, this block dissolves on its own**: `npc.name` is `free-cascade`, so the table holds no `pool` row and arm 2 has an empty subject — which arm 2 must then assert as an explicit zero over a proven denominator, exactly as arm 1 does.

**BLOCK-5 (reported, not blocking) — `EM-PREAMBLE.md` §P2.1 prices the lighting census on the wrong cause.** §P2.1 says a new `src/domain/**` or `src/components/**` file moves it. Measured: the figure is `TEST_FILES.length` where `TEST_FILES = walk(join(ROOT, 'tests')).filter(p => /\.test\.(js|jsx)$/.test(p))` (`:515-518`), asserted at `:7460`. **A `src/` file moves nothing; a `tests/**/*.test.js` file moves it by one.** The register's own note confirms the population. §7's delta is stated on the correct cause. The preamble sentence should be corrected before a later member mis-prices its move.

**BLOCK-6 — the one surviving field is `free-cascade`, so EM-A3's property-read arm has an EMPTY subject.** `npc.name` is `NPC_RENAME_SURFACES[0]` (E-5) and therefore a join key, which §12.3 makes `free-cascade`. A one-field table holds **zero `free` rows**, so EM-A3's *"every `free` field has zero derivation readers"* is vacuously true — and EM-A3's own anti-vacuity fence (its case A4) forbids a vacuous pass. Recorded in both packets so the dependency is visible from either.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the next wave.

## 12. Completion receipt

- Base SHA: `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
- Dispatch bundle and seal identity: **NOT DISPATCHED** — status BLOCKED.
- Final commit or working-tree state: **no edit made.** This lane wrote only under `$SP/lane-em-a-scratch/`.
- Exact changed files and effective-line deltas: `NONE`.
- Acceptance cases: `0 of 8 executed`.
- Focused commands, exits, and counts: **no vitest, eslint, `npm run check` or writing script was run.** Every measurement command and its output is in `EM-A1.evidence.md`.
- Sealed per-step receipt and exact-state resume status: `n/a`.
- Both typecheck configurations: `n/a`.
- Wave-end gate stages actually executed: `NONE`.
- Base-versus-wave failure identity diff: `n/a`.
- Dormancy/golden result: `n/a`. Golden posture DECLARED UNCHANGED for the eventual build.
- Generated artifacts: `NONE`
- Deviations: **STOP** — §11 BLOCK-0 (the catalogue empties to one field), BLOCK-3, BLOCK-4; BLOCK-5 and BLOCK-6 reported.
- Out-of-scope observations, without investigation:
  1. `powerStructure.governingName` has **TWO writers** — `rulingStructure.js:787` and `economyReconciliation.js:277`. `EM-PREAMBLE.md` §P4 requires exactly one writer per state for EM's own state; this is an existing estate surface and is named, not investigated.
  2. `powerStructure.factions[].category` is inferred from the faction's display NAME (`inferFactionCategory`, `factionCategories.js:149`), and `factionRoles.js:179` infers a faction's archetype by name pattern. Two name-valued derivations inside `src/generators/` — the directory the writer-reach closures stop at.
  3. `src/data/sampleDossier.json`, the three `save-museum` fixtures and `legacy-saves/april-2026-v1.json` are **not shape oracles** (hand-authored or empty of institutions/npcs/powerStructure — E-21). Every shape figure here comes from an executed pipeline generation.
  4. The branch moved twice under this lane; the window and its byte-identity argument are in `EM-A1.evidence.md` E-0 and E-29.
- Judgment calls: **NONE.** The one call this lane had recorded vetoably — which file owns the §14 ROOT arm — was RULED by the chair's second amendment item 5 (*"the root check is A1's walker"*), so it is withdrawn as a judgment and kept as a citation in §1a and in `EM-A3.md` §12. Every other open question in §11 is handed up with its measurement, not decided.
