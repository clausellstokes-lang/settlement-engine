# Settlement editor / EM-P1 — STABLE IDENTITY: every NPC, institution and faction gets a permanent id minted from its step's own stream, existing saves get theirs on first read, and the goldens re-record once

- **Status:** DRAFT — ⛔⛔ **BLOCKED. NOT PROMOTABLE AS WRITTEN.** Five measured contradictions, §0B
- **Packet version:** 2 (pre-proof re-measurement, 2026-09-19 ~18:2x EDT, at the read tip `58fcfe614`)
- **Verified base:** `__BASE__`
- **Last revalidated:** `__BASE__` — **the chair's revalidation sentence, written out as executable checks:** *"Re-measured at `__BASE__` by the chair: `git diff --stat 58fcfe614 __BASE__ -- <every changeManifest path and every requiredSymbols path>` is quoted in the promotion commit; `ls tests/domain/entityIdentity.test.js` and `ls docs/shift-records/2026-09-19-em-p1-stable-identity.json` both report No such file (the two CREATE targets absent); `grep -cF` returns ≥1 for each of the 18 `requiredSymbols` rows; `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` equals the header's stamp; and `node scripts/implementation-packets.mjs validate` exits 0."* Wave 0 at `1d2da8c95`; **owner decision §934.47 A read as DECIDED YES at `799074c99`**
- **Depends on:** `EM-P0` — **LANDED** (no longer a forward dependency; its pins channel is in `pipeline.js` at the tip and its `pipelinePinnedMode.test.js` is a live consumer of this packet's golden — §0B(5)). `EM-B3b` LANDED. ⚠ `EM-P2` is STALE and is not a dependency. Structurally `NONE`; the ordering preference against `EM-P0` is discharged by P0 having landed first
- **Collision group:** ⚠ **PERSISTED SHAPE. RIDES ALONE IN ITS TRAIN** (charter Wave 0, train EM-T4). It reserves `src/generators/npcGenerator.js`, `src/lib/saves.js`, the institution minting file and whichever faction file the chair rules on (§0B(2)); plus the golden door's three written paths and two frozen baselines
- **Commit authority:** edits only; the chair commits. ⛔ **The golden door is the CHAIR'S act, executed once, on the measured mover list this packet hands over**
- **Baseline posture:** measured at `58fcfe614` — `src/generators/npcGenerator.js` **1345** effective against a **frozen `scripts/.size-baseline.json` entry of 1345 (ZERO headroom)**; `src/lib/saves.js` **619** (ceiling 800, no entry); `src/generators/steps/assembleInstitutions.js` **571**; `src/generators/density/densityAscension.js` **45**; all by eslint's own `Linter` under `max-lines` with `skipBlankLines` + `skipComments`. ⚠ **STALE ABSOLUTES REWRITTEN AS DELTAS (chair rule R11):** the golden estate is **50 registered surfaces** (32 hash-family, 14 structural, 4 non-JSON) in `tests/fixtures/.golden-freeze-register.json`, not "44 fixtures / 46 call sites"; the lighting tuple **`2645 / 383 / 2262 / 25009 / 6670` is DEAD — EM-P0 re-froze it today to `2646 / 383 / 2263 / 25005 / 6671`**, so this packet's delta is `+1 file, +0 parked, +1 credited` **from there** (`2647 / 383 / 2264 / …`), the two title figures stamped by the chair at promotion from the live baseline
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR — **verified at the branch tip as `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`**, `git show fixes-2026-09-18-consist:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256`; the read tree holds the previous text `1cf54427…faf6`)
- **Evidence:** `EM-P1.evidence.md` (pre-proof sections P1-E6 … P1-E16)

## §0A · WHAT VERSION 2 CHANGES, AND WHY

Version 1 was compiled at `d31af2cee` against a world that has since moved, and its own
machine-checkable claims were not simulated past the edit. This version changes nothing about the
packet's INTENT — permanent ids minted from each step's own stream — and everything about what the
tree says the intent costs. Five things were measured and none of them is a matter of taste: the
packet deletes two symbols it requires verbatim, which blocks its own gate; its faction mint site is
a different population of factions from the one with the defect; its signed golden cause is false
because the NPC id is an existing key whose VALUE changes rather than a key that is added; the
golden door no longer opens the way §6 and §10 say it does; and EM-P0 landed a live consumer of the
525-row fixture that the packet's own STOP condition would fire on. Against those, the packet gains
three registers it did not know it moved (the observed-shape shrink of 33 findings across 28 files
is the largest, and is independent corroboration that the cure is real), a corrected bundle picture,
and a door procedure with the FIX-G1 question answered from the door's own law. **Everything here is
measurement handed to the chair; nothing is adjudicated, and the two premise questions are left
open by name.**

---

## §0B · ⛔⛔ THE FIVE BLOCKING FINDINGS — SMALLEST MEASURED CONTRADICTION FIRST

Each is CONFIRMED by a quoted command in the evidence file. Items (1), (4) and (5) are mechanical
and version 2 carries the cure. Items (2) and (3) are PREMISES, and only the chair may re-cut them.

**(1) THE PACKET DELETES TWO SYMBOLS IT REQUIRES VERBATIM, AND THAT BLOCKS ITS OWN GATE.**
`scripts/implementation-packets.mjs:801-804` asserts every `requiredSymbols` row against the LIVE
tree at EVERY status. Version 1 requires `` npc.id = `npc_${idx + 1}`; `` and
`` id: `faction.${slug(name)}` `` — the two strings the packet exists to remove. Simulated by
execution (P1-E8): post-edit at READY the row reds `symbol is missing from …`; moving it to
`retiredSymbols` reds `symbol is already absent from … before READY`; only ABSENCE FROM BOTH LISTS
is green, and the row is lawful in `retiredSymbols` at the LANDED flip. This is not a soft red:
`runPacketPlan` makes `validate-packets` the plan's PREREQUISITE and BLOCKS every other step when
it fails, and `node scripts/implementation-packets.mjs validate` is this packet's own `checks[10]`.
**CURED IN VERSION 2:** both rows dropped, `retiredSymbols: []` carried, the two flip rows written
out for the chair, surviving anchors substituted. ⚠ The same trap is live on
`function migrateSaveToV2(entry)` — the "v3 arm" must not rename the function.

**(2) ⛔ PREMISE REFUTED — THE FACTION MINT SITE IS THE WRONG POPULATION OF FACTIONS.**
`src/generators/density/densityAscension.js` is the SIMULATION-time seat-ascension planner
(§810.6 R21): it materialises ONE house for a power that has just taken the ruling seat, so it
holds no collection and there is no `<n>` for `fac:<n>` to count. Its id is byte-shared by design
with `src/domain/events/mutateEntities.js:407`'s `ADD_FACTION` co-mint — *"The shape mirrors the
event layer's ADD_FACTION mint exactly"* — and `factionDensityKernel.js:114-115` records what
happened the last time the two spellings diverged: *"one polity, two ids, no join, and nothing
would have thrown."* Those ids are written into event chains that REPLAY, which is lived history.
**Measured, the defect is elsewhere and is worse than version 1 describes: generated factions
carry NO id at all.** `src/generators/power/factionGrouping.js` pushes
`{ name, members, dominantCategory }` and then sorts by member count; `git grep -n "id:" --
src/generators/power/` returns nothing. `src/domain/factionRefs.js` states the estate's own
doctrine: faction handles are *"an authored `faction.id` when present, otherwise the generated
seat's canonical `.faction` / legacy `.name` … pending the governed ID-only migration."*
**THE CHAIR'S CHOICE, NOT THIS LANE'S:** (a) re-point the MODIFY row to `factionGrouping.js` and
leave `densityAscension`/`ADD_FACTION` untouched, or (b) split the faction half into its own
packet. Either way `densityAscension.js` also proves to be in the world-pulse graph, not the
generation worker.

**(3) ⛔ PREMISE REFUTED — THE SIGNED CAUSE IS FALSE: THIS IS NOT A KEY ADDITION.**
§6's record sentence says *"no value, count, name or draw moves — only the id keys are added."*
Two independent measurements refute it. (a) `npc.id` ALREADY EXISTS as `npc_1`; §6 mints `npc:1`,
so every serialised NPC id string and every value derived from it moves. (b) The estate is built
on ID-FIRST FALLBACKS that silently re-key the instant an id exists:
`npcAgency.npcId` is `` `${saveId}:${npc?.id || stablePart(name)}` `` and `factionRefOf` is
`refText(faction?.id) || factionDisplayNameOf(faction)` with nine call sites — and
`settlement.schema.js:493` records that the PERSISTED `linkedFactionIds` stores exactly those
handles. So a persisted field's VALUES change from names to ids. A5 is re-cut in version 2 to
declare the two classes explicitly; **the signed cause sentence must be rewritten by the chair
before any record is drafted**, because it is the sentence the owner signs.

**(4) THE DOOR'S COMMAND IS STALE.** `UPDATE_GOLDEN=1` alone is now refused
(`REFUSALS.NO_SIGNATURE`): *"setting a capture env var no longer writes anything."* The live door
needs `GOLDEN_SHIFT_SIGNED=docs/shift-records/<file>.json`, a record whose CONTENT verifies
(`ownerWords` verbatim, `ownerDate` YYYY-MM-DD, `odqRow` beginning `§`, ONE cause, `seat`, and per
surface `{action, predictedRows, proofForm}`), the surface enrolled in the freeze register, a tree
clean apart from the register/manifest/record, a deliberate throw on success, a plain re-run plus
`tests/lint/goldenFreeze.walker.test.js` as the receipt, and an `Owner-Signed: §NNN` commit
trailer. ⭐ **FIX-G1, ANSWERED FROM THE DOOR'S OWN LAW:** *"one cause per record is the law, not
one record per sitting."* One record may name MANY surfaces but only ONE cause, so **EM-P1 and
FIX-G1 are TWO signed records and TWO `Owner-Signed:` commits**; they may share a sitting, but
they must be sequential and committed between, because the door's permitted-dirty list is
`[register, manifest, record]` and an uncommitted first record reds the second run `DIRTY_TREE`.

**(5) AN UNNAMED LIVE CONSUMER OF THE 525-ROW FIXTURE.**
`tests/generators/pipelinePinnedMode.test.js` — created by EM-P0 after this packet was compiled —
reads the committed manifest on a ≥40-row stride and asserts `moved` is `[]`. It REDS when the ids
land and greens by itself after the chair's door; it is NOT a `recordGolden` surface and cannot be
re-recorded. Version 1's §11 STOP ("a fixture OUTSIDE the eight named candidates moves") would fire
on it and stop the build for the wrong reason. **CURED IN VERSION 2:** it is a declared predicted
red, a `requiredSymbols` anchor, and a member of the post-door re-run arm.

## §0 · THE DEFECT, AND WHY THE ESTATE ALREADY KNOWS IT

| Card kind | Identity today | Receipt |
|---|---|---|
| NPC | `npc.id = \`npc_${idx + 1}\`` — **the array index** | `src/generators/npcGenerator.js:1631` |
| Institution | **the display name** (`institutions.find(i => i.name === instName)`); no general id mint | `steps/assembleInstitutions.js:426, :492, :701` |
| Faction | `id: \`faction.${slug(name)}\`` — **a slug of the name** | `density/densityAscension.js:142` |

Three modules recorded the consequence independently, in their own comments:
`locksPreservation.js:228` (*"a locked `npc_3` ... may name somebody else"*),
`characterDrift.js:17` (*"a keeper moved npc_6 -> npc_8 while `npc_6` came to name a"* different
person), `characterEdit.js:51-53` (*"Every id-keyed SIDECAR is"* exposed). Design §14 makes rosters
and names editable, which is precisely what moves an index and re-slugs a name — so without this
packet a DM's layer key comes to name a different entity and the editor applies edits to the wrong
one, every regeneration.

## §1 · Reconciled authority

1. **ODQ §934.47 A — DECIDED YES** (the owner, by deferral to the chair's recommendation), read on
   the charter at `799074c99`: the ids are minted, existing saves get theirs on first read, the
   convicted readers take the id, and the goldens re-record ONCE under a signed record.
2. **ODQ §934.47** — Wave 0; this car rides alone (persisted shape).
3. **THE PROMISE** — a seed is a starting world forever. An id minted **from the step's own
   stream, in the seed's order** is a fact OF the seed, not an annotation on it. ⚠ The one-time
   golden re-record is a DECLARED shift with a signed cause, not a silent one.
4. **`PACKET_STANDARD.md` "Ungated persistence"** — the v3 migration arm runs UNCONDITIONALLY;
   a flag may gate a feature, never this.
5. **`PACKET_STANDARD.md` "Golden and behavior-shift law"** — a coding agent never regenerates a
   golden unless the packet names the exact golden, the expected shift, the authorization and the
   command. §6 and §7 name all four; the chair executes.
6. Charter Wave 0 row **EM-P1**; `EM-PREAMBLE.md`; live git state at `d31af2cee`.

**Resolved contradictions**

- The charter's row lists the three convicted readers among this packet's MODIFY targets.
  **Measured, they are a fourth, fifth and sixth existing logic file** (§3), which the hard budget
  refuses. They move to `EM-P1b`, and the split is the smallest honest one: minting an id is one
  behaviour family; re-pointing the joins that read it is another.
- The charter's "the golden fixtures gain the id keys" reads as two fixtures. **Measured, the
  candidate set is eight suites** (§6), of which only the true movers re-record.

## §2 · Outcome

**Observable result:** every NPC, institution and faction in a freshly generated settlement carries
a permanent `id` drawn from its own step's stream in the seed's order; an older save gets the same
ids on its first read; and the same seed yields the same ids forever.

**Definition of done:** the three mints exist at §6's exact contract; the v3 migration arm runs on
every save read and write; the identity round-trip passes; the measured golden movers are named
with before/after SHA-256 and handed to the chair for one signed re-record.

**In scope**

1. the three id mints (one behaviour family: entity identity);
2. the unconditional v3 save migration (the required lifecycle seam);
3. the identity round-trip battery (the prevention guard).

**Explicit non-goals**

- ⛔ **the three convicted readers** — `locksPreservation.js`, `characterDrift.js`,
  `characterEdit.js`. They are `EM-P1b`'s, because they are files four, five and six;
- `dmLayer`, the pinned mode, the registry rows, any edit surface;
- renaming or re-keying any existing id-shaped string outside the three mints;
- any second identity scheme, and any content-hash id (an id must not move when a name moves —
  that is the whole defect);
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## §3 · Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | 1 (entity identity) | 1 |
| New persisted record families | 0 — three new KEYS on existing records, not a new family | ≤1 |
| Named state writers | 1 per card kind, each its own generator; **one writer per state** | ≤1 |
| Feature flags | **0 — forbidden by the ungated-persistence law** | ≤1 |
| User-facing surfaces | 0 | ≤1 |
| Direct consumers | 0 in this packet (EM-P1b re-points the readers) | ≤2 |
| New logic-bearing production leaves | 0 | ≤2 |
| Existing logic-bearing production files modified | **3** — `npcGenerator.js`, `assembleInstitutions.js` + `densityAscension.js` count as the institution/faction mint pair, `saves.js` | ≤3 |
| Additional registration-only files | ⚠ **6, MEASURED, against a limit of 3** — `scripts/mutation-coverage-manifest.json` (conditional), `tests/lint/.lighting-census-baseline.json`, `scripts/.observed-shape-readers-baseline.json`, `tests/fixtures/generator-golden-master.json`, `tests/fixtures/.golden-freeze-register.json`, `docs/shift-records/…json` | ≤3 |
| Handwritten files total | 5 handwritten + 6 registration/generated = 11 | ≤12 |
| New/changed effective production lines | ≤120 | ≤400 |
| Delta in a shared/hot file | **0 in `npcGenerator.js` (1345/1345, ZERO headroom)** | ≤15 |
| Acceptance cases | 8 | ≤8 |

Overrides approved before dispatch: `NONE` — ⛔ **AND ONE IS NOW OWED.** The registration-only row
measures **6 against a limit of 3**, because version 1 counted one registration file and version 2
measured six (brief step 11: every path a declared command WRITES is a change-manifest row, and the
golden door alone writes three). **This is a CHAIR DECISION and this lane does not take it.** The
three options, with the cost of each measured:

1. **An approved override of the registration-only limit to 6.** The cheapest, and defensible: five
   of the six are frozen baselines and door artefacts that no logic lives in, and the handwritten
   logic count stays at the standard's own ≤3 (`npcGenerator.js`, `assembleInstitutions.js`,
   `saves.js` — the faction file is the fourth only if §0B(2) is resolved in favour of a re-point).
2. **Split the golden door out** into a chair-only follow-on car. ⛔ **This lane advises against it
   as a MEASUREMENT, not a preference:** the fixture and the register are written ATOMICALLY by
   `recordGolden` in one act, so they cannot be separated, and splitting the door from the edit
   leaves the golden red between the two landings.
3. **STOP AND SPLIT** the packet into `EM-P1-NPC` (npc mint + v3 migration + the door) and
   `EM-P1-INST-FAC`. ⛔ **This breaks the golden door into TWO signed acts**, because each half
   moves all 525 rows for its own cause and one cause per record is the law — which is exactly the
   outcome the chair's instruction to keep the door a SINGLE signed act forbids.

⭐ **The only split that keeps the door one signed act is no split at all**: option 1 or 2.

⛔ **THIS PACKET SITS ON THE CEILING.** If the institution and faction mints cannot be expressed in
`assembleInstitutions.js` and `densityAscension.js` as one pair within the three-file count, the
packet STOPS AND SPLITS into **EM-P1-NPC** (the npc mint + the v3 migration) and
**EM-P1-INST-FAC** (the other two mints), each re-proving the goldens.

## §4 · Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-P1
```

Expected: capsule emitted; ancestry and substrate proven; all MODIFY targets clean; every §5 symbol
resolving. ⚠ This car reserves the persisted shape and rides alone — confirm no sibling holds any
MODIFY path, and that `EM-P0` has landed so the two golden proofs are read in order.

## §5 · Verified tree contract

⚠ **VERSION 2: TWO ROWS LEFT THIS TABLE AND FOUR JOINED IT.** The two that left are the DEFECT
strings the packet deletes; a symbol the deliverable removes may not be required verbatim (§0B(1)).
They become `retiredSymbols` rows **at the LANDED flip**, and are recorded here as retirements so
neither can be re-found as new:

| ⛔ Retired at the flip | File | Symbol | Verified fact |
|---|---|---|---|
| NPC mint (defect) | `src/generators/npcGenerator.js` | `npc.id = \`npc_${idx + 1}\`;` | the id is the ARRAY INDEX, assigned after the roster is drawn; replaced at **net zero effective lines** |
| Faction mint (defect) | `src/generators/density/densityAscension.js` | `id: \`faction.${slug(name)}\`` | a slug of the NAME — ⛔ **and see §0B(2): this is the simulation's seat-ascension house, not a generated faction.** If the chair re-points the MODIFY row, this retirement is withdrawn with it |

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| NPC writer | `src/generators/npcGenerator.js` | `export const generateNPCs = (` | draws the roster; 23 `rng(` sites. SURVIVES the edit | The sole npc id writer, and the anchor that replaces the retired defect row |
| ⛔ The true faction site | `src/generators/power/factionGrouping.js` | `export const generateFactions = (npcs, relationships) => {` | pushes `{name, members, dominantCategory}` with **NO id**, then `.sort(…)` — the only site where "mint in draw order, BEFORE any sort" is both meaningful and available | §0B(2): named whether or not the chair re-points the MODIFY row |
| ⛔ The persisted id-first faction handle | `src/domain/factionRefs.js` | `export function factionRefOf(faction) {` | `refText(faction?.id) \|\| factionDisplayNameOf(faction)`; 9 call sites; `settlement.schema.js:493` records that PERSISTED `linkedFactionIds` stores these handles | **NOT EDITED.** Named because minting an id flips every one of them from the name to the id — the §0B(3) value change |
| ⛔ The id-first NPC key | `src/domain/worldPulse/npcAgency.js` | `export function npcId(saveId, npc, index) {` | `` `${saveId}:${npc?.id \|\| stablePart(name)}` `` — the world-pulse's canonical NPC key takes `npc.id` FIRST | **NOT EDITED.** Named because it gives the dormancy-golden measurement a declared cause |
| ⛔ The unnamed golden consumer | `tests/generators/pipelinePinnedMode.test.js` | `expect(moved, 'golden rows moved — version 1 of this packet moved 41 of 41 here').toEqual([]);` | EM-P0's A1 reads the committed 525-row manifest on a ≥40-row stride | §0B(5): a PREDICTED RED, not a STOP; greens after the chair's door |
| Institution roster | `src/generators/steps/assembleInstitutions.js` | `provides: ['institutions', 'catalogForTier', 'generationRepairs']` | the roster's producing step | Host of the `inst:<n>` mint |
| Institution identity (defect) | `src/generators/steps/assembleInstitutions.js` | `institutions.find(i => i.name === instName)` | identity is the display NAME; the only `id:` in the file is `repair.N` | The mint runs once per admitted row, in roster order |
| The step fork | `src/generators/pipeline.js` | `const stepRng = rng.fork(name);` | every step draws from a stream forked by its NAME | **The mint draws from its own step's stream — the fact that makes an id a fact of the seed.** NOT EDITED |
| Migration seam | `src/lib/saves.js` | `function migrateSaveToV2(entry)` | its own comment: it *"runs on every read AND write path"*, which is why it recovers the seed for already-saved rows; applied at `:331, :443, :503, :684, :713, :743, :775, :850` | The v3 arm joins it, UNCONDITIONALLY |
| Save service | `src/lib/saves.js` | `export const saves` | the one service every read and write goes through | No second migration path |
| Blob chain | `src/domain/settlementMigrations.js` | `export function migrateSettlementToLatest` | pure, append-only, `to === from + 1`, idempotent, non-mutating | ⛔ **NOT appended to** — a `SCHEMA_VERSION` bump would move all 525 golden rows for a second, unrelated cause |
| Version stamp | `src/domain/settlement.schema.js` | `export const SCHEMA_VERSION` | `1`; stamped at `normalizeSettlement.js:167`, which the pipeline runs at `assembleSettlement.js:324` | **NOT bumped** |
| Golden authority | `tests/property/generatorGoldenMaster.test.js` | `function hashFor(config)` | hashes the whole serialised settlement over a 525-row fixture | Re-records ONCE, by the chair, if measured to move |
| The door | `tests/helpers/goldenRecordDoor.js` | `export function recordGolden` | `({ surface, path, produce, root })` — the estate's one re-record door, driven by `UPDATE_GOLDEN=1` | The chair's act; the command is named in §6 |
| ⛔ Convicted reader 1 | `src/domain/locksPreservation.js` | `npc_3` (in its own hazard comment at `:228`) | records that a surviving lock may name somebody else | **EM-P1b's.** Named here so it cannot be re-found as new |
| ⛔ Convicted reader 2 | `src/domain/npc/characterDrift.js` | `npc_6` (`:17`) | records the rebind | **EM-P1b's** |
| ⛔ Convicted reader 3 | `src/domain/npc/characterEdit.js` | `export const AUTHORED_MARKER_KEY` | the id-keyed sidecar family | **EM-P1b's** |
| Test precedent | `tests/domain/settlementMigrations.test.js` | `describe('Tier 1.4 — migrateSettlementToLatest behavior')` › `it('is idempotent on an already-current settlement')`, `it('does not mutate the input')` | flat literal registration; idempotency and purity arms | Copy this shape |

**Forbidden alternatives**

- no content-hash or name-derived id (that IS the defect); no second identity scheme; no id minted
  outside its own step's stream; no `Math.random`, clock or locale;
- no `SCHEMA_VERSION` bump and no `MIGRATIONS` chain entry;
- no flag, env read or conditional around the v3 arm;
- no edit to the three convicted readers, to `pipeline.js`, or to any EM-P0/EM-P2 path;
- no file outside the §7 manifest.

## §6 · Exact contracts

### Inputs and outputs

```js
/** The three id spellings. `n` is the 1-based position in the SEED'S OWN DRAW ORDER — the
 *  order the chooser produced the entity in, which is stable for a seed forever. It is NOT
 *  the final array index (a later sort must not renumber), and NOT derived from any name. */
//   npc:<n>     e.g. 'npc:1'      minted in generateNPCs, from that step's stream order
//   inst:<n>    e.g. 'inst:1'     minted in assembleInstitutions, in roster-admission order
//   fac:<n>     e.g. 'fac:1'      minted where the faction id is written today
```

**The mint rule, complete.** Each card kind's producing step assigns `id` once, in its own draw
order, before any sort or filter that could reorder the collection. An entity that already carries
a non-empty `id` matching its kind's pattern **keeps it** — that single rule is what makes the
migration and the generator agree, and what makes a re-run idempotent.

**The migration rule, complete.** `migrateSaveToV2`'s chain gains a v3 arm that, for every save it
passes, assigns any missing `id` to each NPC, institution and faction **in stored array order**,
and leaves every present id untouched. It runs on every read and every write path, with no flag
and no condition. ⛔ It does NOT bump `SCHEMA_VERSION` and does NOT append to `MIGRATIONS`:
the ids ride the save row's own migration, exactly as the seed recovery does.

⚠ **THE ONE HONEST ASYMMETRY, STATED RATHER THAN HIDDEN.** A pre-existing save's ids are minted in
STORED ARRAY ORDER, which equals the seed's draw order only if nothing has reordered the roster
since. For a save whose roster was reordered, the migration's ids are stable **from now on** but are
not the ids a fresh generation from the same seed would mint. That is the best any migration can
do without re-running generation, and it is recorded here so no later lane reads it as a bug.
A8 pins it.

**Absence rules** — absent `id`: minted (generation) or back-filled (migration). Empty string:
treated as absent. `null`: treated as absent; never written. An id not matching its kind's pattern:
**left alone** and reported by the round-trip test, never rewritten — silently renaming a foreign
id is how an import loses its joins.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| fresh generation | the producing step runs | — | every entity carries `<kind>:<n>` in draw order | — |
| a save with no ids | any read or write | — | ids assigned in stored array order | — |
| a save already migrated | any later read | ids present | unchanged (idempotent) | — |
| an entity with a foreign id | either path | pattern mismatch | LEFT ALONE | the round-trip test reports it |

### Determinism

- **Hash/fork key:** none — the id is a COUNTER in the step's own draw order. No hashing, so no
  collision question and no name dependency.
- **Stable enumeration:** the producing chooser's order, taken before any sort.
- **No-draw behaviour:** the mint consumes **no PRNG draw of its own**. It numbers what the stream
  already produced, so it cannot shift any other chooser. A5 asserts this.

### Flag and dormancy

- **Flag:** ⛔ `NONE`, and a flag here is FORBIDDEN (`PACKET_STANDARD.md` "Ungated persistence").
- **Golden posture:** ⚠ **A DECLARED ONE-TIME SHIFT, authorized by ODQ §934.47 A.**

  **VERSION 2 PRICES THE DOOR FROM THE FREEZE REGISTER, NOT FROM A `recordGolden` GREP.** The
  authoritative estate is `tests/fixtures/.golden-freeze-register.json`: **50 surfaces — 32
  hash-family, 14 structural, 4 non-JSON.** Censused by execution (P1-E13):

  | class | count | verdict |
  |---|---:|---|
  | **CERTAIN MOVER** — `generator-golden-master`, `sha256(JSON.stringify(settlement))`, the WHOLE blob | **525 rows** | **MOVES; `predictedRows` 525 — the key set does not change, only the hashes** |
  | **CANDIDATES** — the six NPC-touching dormancy goldens (`corruption-web`, `momentum`, `npc-credibility`, `npc-growth`, `npc-ladder`, `roads`) | 3 rows each | **MEASURED, THEN STOP.** Each hashes `normalizeForDormancy(projection)` where the projection is **ledgers and counts, never a record** — but the ledgers are keyed by `npcId(saveId, npc, index)`, which reads `npc.id` FIRST, so a non-empty dormant ledger moves its keys |
  | **STRUCTURAL — CANNOT MOVE BY SERIALISATION** — all 14, including `dossier-prose-manifest`, `preset-lighting-witness`, `cartography-calibration-corpus`, both town maps, routes/sea-lanes/teleport | 2–504 rows | **NO structural fixture carries an NPC, institution or faction record** (probe: `npcRecord 0, institutionRecord 0, factionGroupRecord 0`). ⭐ `dossier-prose-manifest` should NOT move; the hash channel's `pickVariant` keys on DISPLAY NAMES (design §21.5), which this packet does not touch |
  | the other 25 hash-family surfaces | 2–54 rows | ledgers, maps and scenes; no entity record reached |

  ⛔ **A CANDIDATE IS NOT A MOVER.** The implementer MEASURES which of the six candidates actually
  move, names each with its fixture path and before/after SHA-256, and **STOPS**.

  ⛔⛔ **THE DOOR'S COMMAND IN §6 VERSION 1 WAS STALE AND IS REPLACED (§0B(4)).** `UPDATE_GOLDEN=1`
  alone is REFUSED. The chair's act, in order:

  ```sh
  # 1. draft docs/shift-records/2026-09-19-em-p1-stable-identity.json with predictedRows
  #    filled in BEFORE anything runs; one cause; the ODQ §-row; the owner's words verbatim
  # 2. tree clean apart from the register, the manifest being written, and the record
  GOLDEN_SHIFT_SIGNED=docs/shift-records/2026-09-19-em-p1-stable-identity.json \
    UPDATE_GOLDEN=1 npx vitest run <the measured movers only>
  # 3. the run THROWS on success, by design. Re-run plainly, then:
  npx vitest run tests/lint/goldenFreeze.walker.test.js     # ← THIS green is the receipt
  # 4. commit manifest + register + record together with an `Owner-Signed: §NNN` trailer
  ```

  ⛔ **The implementer never runs that command.** A mover outside the priced set is a STOP — it
  means the ids reached a surface this packet did not predict.

  ⛔⛔ **THE SIGNED CAUSE MUST BE REWRITTEN BY THE CHAIR BEFORE THE RECORD IS DRAFTED.** Version 1's
  sentence — *"no value, count, name or draw moves — only the id keys are added"* — is **measurably
  false** (§0B(3)): `npc.id` is an existing key whose VALUE changes, and the id-first fallbacks flip
  persisted handles from names to ids. A true cause states both classes. It is the sentence the
  owner signs, so this lane does not write it.

  ⭐ **FIX-G1 RIDES A SECOND RECORD, NOT THIS ONE.** *"One cause per record is the law, not one
  record per sitting."* Same sitting, two records, two `Owner-Signed:` commits, sequential, with
  the first committed before the second runs or the door reds `DIRTY_TREE`.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| minted by the producing step in draw order | every join that reads an entity (EM-P1b re-points the three convicted ones) | rides the settlement blob; no new save-row key, so `SAVED_SETTLEMENT_PATCH_KEYS` is NOT widened | the v3 arm back-fills on first read, unconditionally | the same seed re-mints the same ids — which is the property EM-B2a's layer keys rest on | n/a | **this packet is the migrate step**; an imported entity with a foreign id keeps it | ids are not secrets; no denylist or projection changes, and nothing is redacted |

### Receipts, alignment, edit story

Closed kinds: the round-trip test's report vocabulary — `MINTED`, `KEPT`, `FOREIGN`.
DM-only fields: `NONE`. Alignment: `DECLARED EMPTY`. Edit story: `ENGINE-ONLY`.

## §7 · Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/generators/npcGenerator.js` | the `npcs.forEach((npc, idx) => { npc.id = … })` block | **+0 eff (NET ZERO)** | Replace the index mint with the stream-order mint, one line for one line. ⛔ **1345 effective against a frozen baseline of 1345 — ZERO headroom; any growth reds `max-lines`.** Measure with eslint's `Linter` before and after. |
| `MODIFY` | `src/generators/steps/assembleInstitutions.js` | the roster-admission path | +25 eff | Mint `inst:<n>` once per admitted row, in admission order, before any sort. Do not touch the `repair.N` id. 571 effective, ceiling 800. |
| `MODIFY` | `src/generators/density/densityAscension.js` | `id: \`faction.${slug(name)}\`` | +10 eff | Replace the name slug with `fac:<n>` in draw order. 45 effective, ceiling 800. |
| `MODIFY` | `src/lib/saves.js` | `migrateSaveToV2`'s chain | +35 eff | Add the v3 arm per §6: back-fill missing ids in stored array order, keep present ones, leave foreign ones alone. ⛔ Unconditional — no flag, no `if` on a feature. 619 effective, ceiling 800, no baseline entry. |
| `CREATE` | `tests/domain/entityIdentity.test.js` | A1–A8 | n/a | Copy `tests/domain/settlementMigrations.test.js`'s shape (idempotency, purity, nullish safety). Flat literal `it(...)` only (`EM-PREAMBLE.md` §P3.4). |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | the `invariants` row for `tests/domain/entityIdentity.test.js` | +4 eff | ⚠ **Only if the basename matches `NAME_PATTERN` or the file lands in an `ENFORCER_DIR`** — `tests/domain` is neither, and `entityIdentity` matches no token, so **measure `enumerateInvariants` and add the row only if it picks the file.** ⛔ **ANCHOR ON KEY NAMES, NEVER A LINE NUMBER:** this file already gained EM-P0's `tests/generators/pipelinePinnedMode.test.js` row in the J-T1 window, and EM-B1d v5 and EM-B3c v2 will both have inserted rows before this builds. |
| `REGISTER` | `tests/lint/.lighting-census-baseline.json` | the five figures | n/a | Re-freeze with `LIGHTING_CENSUS_REFREEZE='EM-P1'`, caused by the one new TEST file. |
| `REGISTER` | `scripts/.observed-shape-readers-baseline.json` | the `inventory` rows for 28 files | n/a | ⭐⭐ **THE SHRINK VERSION 1 SAID WOULD NOT HAPPEN.** Minting the writers clears every `id on factions` / `id on institutions` finding. A shrink is a plain `--write` re-freeze, **not** the migration-bundle mint door. |
| `REGISTER` | `tests/fixtures/generator-golden-master.json` | 525 rows | n/a | ⛔ **THE CHAIR'S ACT.** A change-manifest row because the door WRITES it. `predictedRows: 525`. |
| `REGISTER` | `tests/fixtures/.golden-freeze-register.json` | this packet's surface rows | n/a | ⛔ **THE CHAIR'S ACT.** `recordGolden` writes the fixture AND the register row atomically, so the register is a written path whenever any surface moves. |
| `CREATE` | `docs/shift-records/2026-09-19-em-p1-stable-identity.json` | the signed record | n/a | ⛔ **THE CHAIR'S ACT.** The door reads this file and verifies its CONTENT; `GOLDEN_SHIFT_SIGNED` names it. ONE cause. FIX-G1 gets its own record. |

**Generated artifacts:** all six are declared as manifest rows above, because every path a declared
command WRITES is a change-manifest row. ⚠ **The measured dormancy movers, if any, are added to the
manifest by the chair at promotion** once the build lane's measurement names them — each is a
further `REGISTER` row plus its `surfaces[]` entry in the one signed record.

**Predicted INTERIOR RED:** lighting **`2646 / 383 / 2263 / 25005 / 6671`** (EM-P0's live
re-freeze, 2026-09-19) → **`2647 / 383 / 2264 / <title figures stamped by the chair at promotion
from the live baseline>`** (`+1 file, +0 parked, +1 credited`), caused by the one new TEST file.
⚠ Version 1 predicted `2646 / 383 / 2263`, which **EM-P0 has already consumed.**

**Predicted OBSERVED-SHAPE DELTA (a SHRINK):** measured pre-edit ceiling **33 findings / 53
multiplicity / 28 files** matching `id on factions` or `id on institutions`; `id on npcs` is ZERO
because NPCs already carry an id. The post-edit figure is measured by the build lane and stamped
then; it may not EXCEED the pre-edit ceiling, and a GROWTH anywhere is a STOP.

**Registers that do NOT move:** `SAVED_SETTLEMENT_PATCH_KEYS` (ids ride inside `settlement`),
`SCHEMA_VERSION`, the `MIGRATIONS` chain, `scripts/.size-baseline.json` (net-zero edit; never
raised), the five edge-shared bundles — ⛔ **and that last is a MEASURED claim, not an assumption:
this packet runs no generator that writes a `supabase/functions/_shared/*` path, so it owes none of
the seven generated edge-shared paths (brief step 11's EM-B1d trap does not apply here).**
⚠ `scripts/check-writer-reach.mjs`: version 1 said growth here is a STOP. **That reasoning is
inverted by §0B(3)** — the ids reach the display through readers that ALREADY read `.id` (the 33
OSR findings are the proof), so the expected movement is none or a shrink; growth remains a STOP.

**BUNDLE MEMBERSHIP, MEASURED:** `npcGenerator.js` and `assembleInstitutions.js` are **IN the
zero-slack generation worker** (`generation.worker.js` → `generationRequest.js` →
`generateSettlementPipeline.js`), ceiling `WORKER_BUNDLE_CEILING_BYTES = 1401208` asserted
`toBeLessThanOrEqual`. `densityAscension.js` is **NOT** — its only importer is
`src/domain/worldPulse/factionDensityKernel.js`. `src/lib/saves.js` is in no worker (20 importers,
all components/store). **The build lane therefore owes a worker re-mint step:** a real
`npm run build` through the exclusive mutex; the kit's per-module attribution
(`tools/attrib.config.mjs`) showing ONLY this packet's own modules moved; growth inside a
**stated bound of 240 B** (an estimate of the minified growth ×2, stated as such — this lane may
not build); then a re-mint in the `91d5f155b` form, the constant set to the exact measurement with
a dated attribution comment. Anything outside the bound is a STOP for the chair.

No other file may be edited.

## §8 · Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch.
1. Capture the baseline: all EIGHT candidate fixtures' SHA-256; the lighting tuple; eslint `Linter`
   `max-lines` for all four MODIFY targets (expect **1345**, **571**, **45**, **619**).
2. Add the failing tests for A1–A8.
3. Implement the three mints (the pure data contract), npc first and at net zero.
4. Extend the lifecycle seam: `migrateSaveToV2`'s v3 arm, unconditional.
5. (no consumer to wire — EM-P1b re-points the readers.)
6. Add the lint registration if and only if `enumerateInvariants` demands it; regenerate the
   lighting baseline.
7. Run the focused verification of §10. **MEASURE which of the eight candidates moved, record each
   with before/after SHA-256, and STOP.**
8. Hand the chair the measured mover list for ONE signed re-record; then re-run the movers plainly
   for the green and write §12.

## §9 · Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behavior | a freshly generated settlement | every NPC, institution and faction carries `npc:<n>` / `inst:<n>` / `fac:<n>`; the set is complete, unique within its kind, and 1-based contiguous | `tests/domain/entityIdentity.test.js` |
| A2 | ⛔ Same seed, same ids | two generations at one seed | every entity's id is identical across the two runs — the property EM-B2a's layer keys rest on | same |
| A3 | ⛔ A RENAME DOES NOT MOVE AN ID | rename a faction and an institution, then re-read | both ids are unchanged. **This is the defect's direct negative control** (`faction.${slug(name)}` moved; `fac:<n>` does not) | same |
| A4 | ⛔ A ROSTER EDIT DOES NOT RE-POINT AN ID | remove the second NPC of five | the remaining four keep their original ids; none is renumbered, so no id comes to name a different person | same |
| A5 | ⛔ The mint takes no draw | the golden corpus before and after the mint, compared field by field except the new id keys | no value, count, name or ordering moves anywhere — the mint numbers what the stream already produced and consumes no PRNG | same |
| A6 | Migration: back-fill and idempotency | an older save with no ids, run through the real `saves` read path twice | ids appear on the first read in stored array order; the second read is byte-identical; the save is not mutated in place | same |
| A7 | Migration is UNCONDITIONAL | a source scan of the v3 arm's call site | it is reached on every save read and write path and sits inside NO conditional, flag read or env read; `SCHEMA_VERSION` is still `1` and `listMigrations()` still holds ONE entry | same |
| A8 | ⛔ Foreign ids and the stated asymmetry | an imported entity carrying a non-matching id, and a save whose roster was reordered before migration | the foreign id is LEFT ALONE and reported `FOREIGN`, never rewritten; and the reordered save's minted ids are stable across subsequent reads, with the test asserting in its own words that they need not match a fresh generation's (§6's recorded asymmetry) | same |

**8 of 8.**

## §10 · Verification commands

```sh
npx eslint src/generators/npcGenerator.js src/generators/steps/assembleInstitutions.js \
  src/generators/density/densityAscension.js src/lib/saves.js tests/domain/entityIdentity.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/entityIdentity.test.js tests/domain/settlementMigrations.test.js \
  tests/domain/userEdits.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/lifecycleRoundTrip.test.js

# THE CERTAIN MOVER + THE SIX CANDIDATES — measure which move; do NOT re-record
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/corruptionWebDormancyGolden.test.js \
  tests/property/momentumDormancyGolden.test.js tests/property/npcCredibilityDormancyGolden.test.js \
  tests/property/npcGrowthDormancyGolden.test.js tests/property/npcLadderDormancyGolden.test.js \
  tests/property/roadsDormancyGolden.test.js

# ⛔ THE UNNAMED CONSUMER (EM-P0, landed 2026-09-19) — a PREDICTED RED, NOT a STOP. It reads the
# committed 525-row manifest on a >=40-row stride and greens by itself once the chair's door ran.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/generators/pipelinePinnedMode.test.js tests/domain/townCartographyCalibration.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js tests/lint/sizeBaseline.test.js \
  tests/lint/mutationCoverageManifest.test.js tests/lint/goldenFreeze.walker.test.js

node scripts/check-observed-shape-readers.mjs  # EXPECTED: a SHRINK; pre-edit ceiling 33/53/28
node scripts/check-writer-reach.mjs            # growth is a STOP — see §7
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-P1
```

The golden commands are EXPECTED to red on the movers before the chair's door runs; that red
is the measurement, and the receipt names each mover with before/after SHA-256. Every other command
exits `0`. ⚠ This car rides ALONE: its own bare full gate and boot smoke ARE its terminal.

⛔⛔ **`npm run check:packet -- EM-P1` CANNOT PASS UNTIL §0B(1) IS CURED.** `validate-packets` is
the sealed plan's PREREQUISITE and every later step is BLOCKED when it reds, so a `requiredSymbols`
row the edit removed does not merely warn — it voids the whole gate. Version 2's manifest carries
the cure; **the chair must not re-add either retired row before the LANDED flip.**

## §11 · Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- `src/generators/npcGenerator.js` grows by one effective line (1345/1345, measured);
- a REGISTERED SURFACE outside `generator-golden-master` and the six named dormancy candidates
  moves — the ids reached an unpredicted surface. ⚠ **`tests/generators/pipelinePinnedMode.test.js`
  is NOT such a surface**: it is a declared PREDICTED RED (§0B(5)) that clears at the door;
- any structural surface moves at all — all 14 were measured to carry no entity record, so a move
  there means the ids reached a projection nobody predicted. ⭐ `dossier-prose-manifest` moving is
  the loudest case: it would mean the hash channel stopped keying on display names;
- `scripts/check-observed-shape-readers.mjs` reports GROWTH, or a shrink LARGER than the measured
  33 findings / 53 multiplicity / 28 files — either means the mint reached shapes it did not name;
- the generation worker's measured growth exceeds the stated 240 B bound;
- the implementer is about to rename `migrateSaveToV2`, or to add either retired symbol back to
  `requiredSymbols` before the LANDED flip (§0B(1));
- any value, count, name, ordering or draw moves (A5) — only id KEYS may be added;
- the mint would consume a PRNG draw, or derive an id from a name or a position;
- `SCHEMA_VERSION` or the `MIGRATIONS` chain would need to move;
- the v3 arm would sit inside any conditional, flag read or env read;
- a fourth existing logic file must move (the three convicted readers are `EM-P1b`'s);
- `scripts/check-writer-reach.mjs` reports growth — a dark new written identity means nothing shows
  the id, which is a real finding, not a registration chore;
- the implementer is about to run `UPDATE_GOLDEN=1` — **that is the chair's act, once.**

## §12 · Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- The owner decision quoted (§934.47 A, DECIDED YES):
- Final commit or working-tree state:
- Exact changed files and effective-line deltas (eslint `Linter`, before and after, all four MODIFY targets; `npcGenerator.js` expected 1345 → 1345):
- Acceptance cases A1–A8, executed and passed:
- Focused commands, exits, and counts:
- ⛔ **THE MEASURED GOLDEN MOVERS**, each with fixture path and before/after SHA-256, and the candidates that did NOT move:
- The chair's signed re-record: command, date, and the cause recorded:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- This car's own bare full gate and boot smoke, exits captured in-shell:
- Base-versus-wave failure identity diff:
- `SCHEMA_VERSION` and `listMigrations().length` before and after (expected: 1 and 1):
- `scripts/check-writer-reach.mjs` result:
- Lighting census tuple before and after:
- Generated artifacts:
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
