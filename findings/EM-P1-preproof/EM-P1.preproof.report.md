# EM-P1 — PRE-PROOF REPORT (Opus PRE-PROOF lane, 2026-09-19 ~18:5x EDT, session 7d3418f8)

## VERDICT: ⛔ **BLOCKED.** Not promotable as written. Three of five findings are cured in version 2; **two are premises only the chair may re-cut.**

**Deliverables** (all under `$SP/lane-preproof-EM-P1-scratch/`):
`EM-P1.md` (version 2, Status DRAFT) · `EM-P1.manifest.json` · `EM-P1.evidence.md` (sections
P1-E6 … P1-E16 appended; the compile's sections untouched) · `EM-P1.preproof.report.md` (this).
Scratch scripts in `work/`. **An evidence file DID exist** — at `chair-kit/findings/EM-P1.evidence.md`,
not in `packets-waiting/`; it was copied and appended to, not restarted.

**Read tree:** `$SP/read-tip-58fcfe614`, HEAD `58fcfe61458b784b0470b854caf916b7c2961edf`,
`git status --short` EMPTY at the start and again at the end. Nothing was written outside the
lane scratch dir.

---

## 1 · THE J-T1 WINDOW, AND WHAT A LATER LANDING COULD MOVE

```
$ git diff --stat d31af2ceebf643818201b2e2ab4a556765d2fc7c 58fcfe614 -- <all packet paths>
 scripts/mutation-coverage-manifest.json |  4 +++
 src/generators/pipeline.js              | 50 +++++++++++++++++++++++++++++++--
 2 files changed, 51 insertions(+), 3 deletions(-)
$ ls tests/domain/entityIdentity.test.js → No such file (CREATE target absent ✓)
$ git show fixes-2026-09-18-consist:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1   ← matches the brief exactly
```

All **17** version-1 `requiredSymbols` re-found by symbol at the tip (`grep -cF` ≥1 each, P1-E7).

**Facts a later landing could move.** Everything above the `src/` line is measured at `58fcfe614`
and the branch tip has since gained docs commits, packet placements and EM-B1e's
`calamityKernel.js`. The facts most exposed, in order: (a) the **lighting tuple** — EM-P0 re-froze
it today and EM-B1e's new test file will move it again, so the packet's predicted tuple is a delta
the chair stamps at promotion, never an absolute; (b) `scripts/mutation-coverage-manifest.json` —
EM-B1d v5 and EM-B3c v2 both insert rows, which is why the conditional REGISTER row is anchored on
KEY NAMES; (c) the OSR pre-edit ceiling `33/53/28`, which any landing that adds or removes an
`id`-on-entity read would move. The five blocking findings below rest on file CONTENT that no
pending landing touches.

---

## 2 · THE FIVE BLOCKING FINDINGS

### (1) CURED — the packet deletes two symbols it requires verbatim, which voids its own gate
`scripts/implementation-packets.mjs:801-804` asserts `requiredSymbols` against the live tree at
**every** status. Version 1 required `` npc.id = `npc_${idx + 1}`; `` and
`` id: `faction.${slug(name)}` `` — the two strings the packet exists to delete.

**CONFIRMED by execution** (`work/sim-postedit-validate.mjs`, 0.06 s):

| moment | `requiredSymbols` row | `retiredSymbols` row | neither list |
|---|---|---|---|
| READY, pre-edit (promotion) | green | green | green |
| **READY, post-edit (the build)** | **RED** `symbol is missing from …` | **RED** `already absent from … before READY` | **green** |
| LANDED (the flip) | RED | **green** | green |

And the red is fatal, not cosmetic: `runPacketPlan` (`implementation-gate.mjs:314-333`) runs
`validate-packets` as the plan's **prerequisite** and returns early; line 406 marks every other
step `BLOCKED`. `node scripts/implementation-packets.mjs validate` is this packet's own `checks[10]`.

**Cure in version 2:** both rows dropped from `requiredSymbols`; `retiredSymbols: []` carried (the
sibling convention — EM-B1f and EM-B3c both carry `[]`); the two flip rows written out for the
chair; surviving anchors substituted. No other packet names either pair, so no cross-packet
discharge is owed. ⚠ The same trap is live on `function migrateSaveToV2(entry)` — the packet must
say the function is not renamed.

### (2) ⛔ PREMISE REFUTED — the faction mint site is a different population of factions
`src/generators/density/densityAscension.js` is the **simulation-time seat-ascension planner**
(§810.6 R21). It materialises ONE house for a power that just took the ruling seat, so it holds no
collection and there is no `<n>` for `fac:<n>` to count. Its id is byte-shared by design with
`mutateEntities.js:407`'s `ADD_FACTION` co-mint, and `factionDensityKernel.js:114-115` records the
last divergence: *"one polity, two ids, no join, and nothing would have thrown."* Those ids are
written into event chains that **replay** — lived history.

**The real defect is worse than version 1 says: generated factions carry no id at all.**
`factionGrouping.js` pushes `{ name, members, dominantCategory }` then sorts by member count;
`git grep -n "id:" -- src/generators/power/` returns nothing. `factionRefs.js` states the estate's
own doctrine: faction handles are name-derived *"pending the governed ID-only migration."*
`densityAscension.js` also proves to be in the world-pulse graph, **not** the generation worker.

**Chair's choice, not taken here:** (a) re-point the MODIFY row to `factionGrouping.js` — the only
site where "mint in draw order, before any sort" is both meaningful and available — leaving
`densityAscension`/`ADD_FACTION` untouched; or (b) split the faction half into its own packet.

### (3) ⛔ PREMISE REFUTED — the signed cause is false; this is not a key addition
§6's record sentence: *"no value, count, name or draw moves — only the id keys are added."*
(a) `npc.id` **already exists** as `npc_1`; §6 mints `npc:1`, so every serialised NPC id and every
value derived from it moves. (b) The estate runs on **id-first fallbacks** that silently re-key the
instant an id exists — `npcAgency.npcId` is `` `${saveId}:${npc?.id || stablePart(name)}` `` and
`factionRefOf` is `refText(faction?.id) || factionDisplayNameOf(faction)` (9 call sites), while
`settlement.schema.js:493` records that the **persisted** `linkedFactionIds` stores exactly those
handles. A5 is re-cut in version 2 to declare both classes. **The cause sentence is the sentence
the owner signs, so this lane does not rewrite it** — the chair must, before any record is drafted.

### (4) CURED — the door's command is stale
`UPDATE_GOLDEN=1` alone is refused (`REFUSALS.NO_SIGNATURE`): *"setting a capture env var no longer
writes anything."* See §3 below for the live procedure, priced.

### (5) CURED — an unnamed live consumer of the 525-row fixture
`tests/generators/pipelinePinnedMode.test.js` (EM-P0, landed today) reads the committed manifest on
a ≥40-row stride and asserts `moved` is `[]`. It reds when the ids land and greens by itself after
the door; it is not a `recordGolden` surface and cannot be re-recorded. Version 1's §11 STOP would
have fired on it and stopped the build for the wrong reason. Version 2 makes it a declared
predicted red, a `requiredSymbols` anchor and a post-door re-run member.

---

## 3 · THE GOLDEN DOOR, PRICED EXACTLY

**Priced from the freeze register, not from a `recordGolden` grep.** `tests/fixtures/.golden-freeze-register.json`
holds **50 surfaces: 32 hash-family, 14 structural, 4 non-JSON** (`work/golden-census.mjs`).

| class | price |
|---|---|
| **CERTAIN MOVER: `generator-golden-master`** | **525 of 525 rows.** It hashes `sha256(JSON.stringify(settlement))` — the whole blob — so any id change moves every row. `predictedRows: 525`; the KEY SET does not change |
| **CANDIDATES: six NPC dormancy goldens** (`corruption-web`, `momentum`, `npc-credibility`, `npc-growth`, `npc-ladder`, `roads`) | 3 rows each. Each hashes `normalizeForDormancy(projection)` where the projection is **ledgers and counts, never a record** — but ledgers are keyed by `npcId(…)`, which reads `npc.id` first. `normalizeForDormancy` drops empty containers, so a truly dormant ledger contributes nothing. **MEASURED-THEN-STOP by the build lane; this lane may not run vitest** |
| **CANNOT MOVE BY SERIALISATION: all 14 structural surfaces** | **No structural fixture carries an NPC, institution or faction record** — probe returns `npcRecord 0, institutionRecord 0, factionGroupRecord 0, npcIdLiteral 0, factionIdLiteral 0` on every one, including `cartography-calibration-corpus` (504 rows), both town maps, routes/sea-lanes/teleport, `preset-lighting-witness` (15 rows) and `dossier-prose-manifest` (2 rows) |
| the other 25 hash-family surfaces | ledgers, maps and scenes; no entity record reached |

⭐ **`dossier-prose-manifest` should NOT move**, and for a stronger reason than "no records": it
carries no entity record at all, and the hash channel's `pickVariant` keys on **display names**
(design §21.5), which this packet does not touch. CONFIRMED structurally; **PLAUSIBLE** as a
whole-suite claim only because the prose suite was not executed.
⭐ **`preset-lighting-witness-golden.json` should NOT move** — 15 structural rows, no entity record.
⛔ Version 1's candidate #2 (`townCartographyCalibration`) is named at the wrong granularity: the
family's surfaces are `town-cartography-dormancy-golden` (54 rows) and
`cartography-calibration-corpus` (504 rows), and both hash a scene digest, not a settlement.

**The procedure, quoted from the tip.** `GOLDEN_SHIFT_SIGNED` must name a record file under
`docs/shift-records/`; the door reads and verifies its **content** — `ownerWords` verbatim,
`ownerDate` YYYY-MM-DD, `odqRow` beginning `§`, ONE `cause`, `seat`, and per surface
`{action, predictedRows, proofForm}` matching the register's. Then: surface enrolled, tree clean
apart from `[register, manifest, record]` (else `DIRTY_TREE`), a deliberate throw on success, a
plain re-run plus `tests/lint/goldenFreeze.walker.test.js` as **the** receipt, and a commit
carrying an `Owner-Signed: §NNN` trailer.

### ⭐ FIX-G1: TWO ACTS, NOT ONE — answered from the door's own law
> `// ONE cause. One cause per record is the law: a record that authorizes two unrelated movements makes both unattributable when the next drift arrives.`
> `' lists and no others — one cause per record is the law, not one record per sitting.'`

One record may name **many surfaces** but exactly **one cause**. EM-P1's id mint and FIX-G1's
viability-dependency-count fix are unrelated movements, so they are **two records and two
`Owner-Signed:` commits**. They may share a **sitting** ("not one record per sitting"), but they
must be **sequential and committed between**: the permitted-dirty list is
`[register, manifest, record]`, so an uncommitted first record reds the second run `DIRTY_TREE`.
Row counts do not change, so both pass the `predictedRows` gate at 525.

---

## 4 · DETERMINISM AND THE STREAMS

**The mint as specified consumes no draw, by construction** — it is a counter over what the chooser
already produced, not an `rng` call. That is a property of the *specification*, not a measurement
of code that does not exist yet, so it is **PLAUSIBLE until the build lane's A5 executes it**. What
this lane can confirm:

- `pipeline.js:const stepRng = rng.fork(name);` survives at the tip, so a mint inside a step still
  numbers that step's own stream. CONFIRMED.
- **Each mint has exactly one lawful position, and in two of three cases it is before a reorder.**
  `generateNPCs` mints, then `return disambiguateNPCDisplayNames(npcs)`. `generateFactions` pushes,
  then `.sort((a, b) => b.members.length - a.members.length)` — **the mint must precede that sort**
  or the ids number the sorted order, not the draw order. `assembleInstitutions` mints per admitted
  row in admission order.
- ⚠ **If the mint ever draws, the blast radius is far wider than ids**: `generatePopulation`'s
  derive half has a measured budget of 67 draws (62 + 2 + 3), pinned by EM-P0's A3, and a new draw
  moves every later draw in the step. The packet's forbidden-alternatives list already refuses it;
  EM-P0's A3 is the live guard that would convict it.
- ⚠ **EM-P0's pinned mode is a new no-draw path the packet does not mention.** `chooseOrPin(pins,
  'npcs'|'factions'|…)` returns the pinned record and does **not** run the chooser, so a mint placed
  inside `generateNPCs` / `generateFactions` **does not run in pinned mode**. A pin built from a
  record that lacks ids yields id-less entities. The migration covers saves; it does not cover a
  pin. **A question for the chair** (§7).

---

## 5 · THE LIFECYCLE TABLE — A VERDICT PER PATH

| path | verdict |
|---|---|
| **load (read)** | `migrateSaveToV2` at `:331` (Supabase list) and `:713` (local load). Mints on first read. CONFIRMED reach |
| **persist (write)** | the SAME function at `:443`, `:503`, `:743`, `:775`, `:850`. So the read-mint is **not** persisted until the next write — but the write path applies the identical rule to the same stored array order, so the round trip is closed. **The classic "minted at load, never persisted" shape is present in form and benign in effect** |
| ⚠ **the one ghost-write that is NOT ruled out** | §6 keys the migration on **stored array order**. If any path **reorders** the array between the read-mint and the write-mint, the write mints *different* ids for the same entities. A roster edit is exactly such a reorder. A6 pins idempotency on an unreordered save; **nothing pins the reordered case**, and §6's "recorded asymmetry" names the fresh-generation mismatch but not this one. **Owed: an A6 arm that reads, reorders, writes, and asserts the ids did not re-point** |
| **regenerate/rebuild** | same seed re-mints the same ids (the property EM-B2a rests on). PLAUSIBLE pending A2 |
| **undo/redo** | `snapshotForUndo` lives in `src/store/mapSlice.js` and snapshots **placements**, not settlement rosters. No NPC/institution/faction id path. CONFIRMED not affected |
| **clone/fork** | `intent: 'sampleFork'` is a GENERATION intent (`src/lib/generationIntent.js`), not a save copy — a fork re-generates and therefore re-mints from the seed. The recorded sample-fork `seed` production bug is in that lane, not this one. No second mint site |
| **export → import** | an imported entity's foreign id is LEFT ALONE and reported `FOREIGN` (§6). ⚠ A **third** id namespace exists and must not be rewritten: `publicSafe.js:193` records that created NPCs carry `npc.<slug>_<hash>`. §6's pattern rule covers it; the test must name it |
| **gallery / public veil** | **ids cross the veil and that is existing behaviour**: `publicSafe.js:123` lists `'id'` in the NPC allowlist and `:215` emits `id: npc.id`. They are stable across the public/private split. They leak nothing — a counter in draw order encodes no name, no secret and no ordering the roster does not already show. CONFIRMED |
| **world-pulse roster joins** | `npcAgency.npcId` = `` `${saveId}:${npc?.id || stablePart(name)}` `` — **already id-first for NPCs** (so the spelling change moves those keys) and **name-joined for factions and institutions today**, flipping to the id the moment one exists. This packet does not re-point any reader; EM-P1b does. The flip is automatic and is finding (3) |
| **AI overlays keyed by name** | `characterEdit.js`'s `AUTHORED_MARKER_KEY` sidecar family is id-keyed and is **EM-P1b's**, named in `requiredSymbols` so it cannot be re-found as new |

---

## 6 · PERSISTED SHAPE, REGISTERS, BUDGETS AND BUNDLES

**New keys on saved records:** `id` on every institution and every faction (both absent today);
NPCs already carry one and its **value** changes. **No schema bump** — `SCHEMA_VERSION` stays `1`
and the `MIGRATIONS` chain is not appended to, both asserted by A7. **`SAVED_SETTLEMENT_PATCH_KEYS`
is NOT widened** — CONFIRMED: `'settlement'` is already a patch key and the ids ride inside the blob.

**Rollback safety:** a save written by the new code, read by the old code, carries extra `id` keys
on institutions and factions that the old readers ignore (they use `id || name` fallbacks, which
simply take the id). The NPC id spelling changes, so old **id-keyed sidecars** written before the
change (locks, drift marks, authored markers) would not join to the new spelling. ⚠ **Within a
single save that is impossible** — the migration leaves present ids untouched — but a save that
round-trips through the new generator gets new-spelling NPCs beside old-spelling sidecars. **That
is EM-P1b's subject and a question for the chair** (§7).

### Register deltas
| register | delta |
|---|---|
| ⭐⭐ `scripts/.observed-shape-readers-baseline.json` | **SHRINKS — version 1 said it would not move.** `33` findings / `53` multiplicity / `28` files match `id on factions` or `id on institutions`; `id on npcs` is **zero** because NPCs already carry an id. The register's whole subject is a reader asking for a key **no writer produces**; this packet mints the writers. **A shrink is a plain `--write` re-freeze, NOT the migration-bundle mint door.** It is also the strongest independent corroboration that the cure is real: the estate's own ratchet already convicted 33 such readers |
| `tests/lint/.lighting-census-baseline.json` | `+1 file, +0 parked, +1 credited` **from EM-P0's live re-freeze `2646 / 383 / 2263 / 25005 / 6671`** → `2647 / 383 / 2264 / …`. ⚠ Version 1 predicted `2646/383/2263`, which **EM-P0 has already consumed**; note `titles` fell 25009 → 25005 |
| `scripts/mutation-coverage-manifest.json` | conditional; `tests/domain` is no `ENFORCER_DIR` and `entityIdentity` matches no `NAME_PATTERN` token, so measured the meta-test demands **no row**. Anchor on KEY NAMES — EM-P0's row is already in, EM-B1d v5 and EM-B3c v2 follow |
| `scripts/check-writer-reach.mjs` | version 1 called growth a STOP on the theory that a dark identity means nothing shows the id. **That reasoning is inverted:** 33 readers already read the id. Expected: none or a shrink; growth stays a STOP |
| the five edge-shared bundles | **do not move, and that is measured, not assumed**: this packet runs no generator that writes a `supabase/functions/_shared/*` path, so it owes none of the seven generated paths (brief step 11's EM-B1d trap does not apply) |
| `scripts/.size-baseline.json` | unmoved; the `npcGenerator.js` edit is net zero against 1345/1345 |

### Budget
`§7` table and the JSON `changeManifest` are **IDENTICAL as (action, path) sets — proved by
execution**, 11 rows each, every action in `PACKET_ACTIONS`, no glob, no duplicate, exit 0
(`work/table-json-equality.mjs`).

⛔ **ONE BUDGET ROW IS NOW OVER.** Registration-only files measure **6 against a limit of 3**
(the golden door alone writes three). Version 1 counted one. **This is a chair decision** and
version 2 lays out three options with their costs. The material point: **the only shapes that keep
the golden door a SINGLE signed act are an approved override or no split at all.** A STOP-AND-SPLIT
into `EM-P1-NPC` + `EM-P1-INST-FAC` **breaks the door into two signed acts**, because each half
moves all 525 rows for its own cause and one cause per record is the law.

### Bundles
`npcGenerator.js` and `assembleInstitutions.js` are **in the zero-slack generation worker**
(`generation.worker.js` → `generationRequest.js` → `generateSettlementPipeline.js`);
`WORKER_BUNDLE_CEILING_BYTES = 1401208`, asserted `toBeLessThanOrEqual`. **`densityAscension.js` is
NOT** — its only importer is `factionDensityKernel.js` (world-pulse). `src/lib/saves.js` is in no
worker (20 importers, all components/store). The npc edit is net zero; the institution mint's
+25 eff lands in the worker, so **the packet carries a worker re-mint**: a real `npm run build`
through the exclusive mutex, the kit's per-module attribution showing only this packet's modules
moved, growth inside a **stated bound of 240 B** (minified estimate ×2, **stated as an estimate —
this lane may not build**), then a re-mint in the `91d5f155b` form. Outside the bound is a STOP.

---

## 7 · QUESTIONS ONLY THE CHAIR OR THE OWNER CAN ANSWER

1. **The faction site (§0B(2)).** Re-point the MODIFY row to `factionGrouping.js`, or split the
   faction half out? Either way, does `densityAscension`/`ADD_FACTION` keep `faction.<slug>`?
   (This lane's measurement says it must, on the replay/lived-history ground.)
2. **The signed cause sentence (§0B(3)).** It is measurably false as written and the owner signs
   it. The chair must author the replacement before any record is drafted.
3. **The registration-only budget: override to 6, or restructure?** With the measured note that
   only an override or no-split keeps the door one signed act.
4. **Does the NPC id spelling have to change at all?** `npc_1` → `npc:1` is what makes this a value
   move rather than a key addition, and it is what re-keys every world-pulse ledger. If the
   discriminator can be carried some other way, findings (3) and much of §3's price shrink.
   **Owner-adjacent**, because it changes what the golden shift means.
5. **Pinned mode (§4).** A pin built from a record with no ids yields id-less entities, because
   `chooseOrPin` skips the chooser the mint would live in. Does EM-P1 own that, or EM-B2a?
6. **Old-spelling sidecars beside new-spelling NPCs (§6).** EM-P1b's, or a STOP for EM-P1?
7. **Owner-gated: persisted shape.** New `id` keys on saved institutions and factions, and a
   persisted **value** change on `linkedFactionIds`. §934.47 A is read as DECIDED YES for the ids;
   **it does not obviously cover the `linkedFactionIds` value flip**, which was not known at the
   time. Confirm or re-ask.

---

## 8 · NOTICED, NOT TOUCHED (owner's law today: nothing is deferred — slot or close each)

1. **`tests/generators/pipelinePinnedMode.test.js` will red for any future packet that moves the
   generator golden**, not just this one. It is a golden consumer that cannot be re-recorded.
   Worth a standing note beside the shift-record README.
2. **A third NPC id namespace**, `npc.<slug>_<hash>` for created NPCs (`publicSafe.js:193`), exists
   beside `npc_<n>` and the proposed `npc:<n>`. Nothing enumerates the namespaces in one place.
3. **`factionResponses.js` re-derives a faction id inline at four sites** (`:102, :219, :340, :474`)
   with `faction.id || \`faction.${name.toLowerCase().replace(/\s+/g, '_')}\`` — a **ninth
   hand-rolled slug** beside the one `densityAscension` was made to stop using. Same defect class,
   four live instances, outside this packet.
4. **`src/domain/factionRefs.js`'s header names the cure this packet is** — *"until a governed save
   migration can make the field ID-only"* — so `linkedFactionIds` has a documented follow-on that
   nothing currently owns.
5. The OSR's 33 findings span **28 files**; EM-P1b re-points three readers. The other 25 files
   simply stop being findings without anyone reading them. Worth one pass to confirm each is
   genuinely cured rather than merely silenced.
6. `densityAscension.js`'s `slug` comment says the swap was *"PROVEN byte-identical over 20,015
   executed inputs"* — a good precedent shape for however the faction id question is resolved.

---

# §9 · THE TWO MEASUREMENTS THE CHAIR ORDERED (2026-09-19 ~19:1x EDT)

Measured at `58fcfe614` after rulings R1–R4. R1 removes finding (3a) entirely: with `npc_<n>`
unchanged, the NPC half is a pure no-op on every serialised value, the six NPC dormancy goldens
lose their only mechanism for moving, and question 6 cannot arise. **EM-P1 is now, exactly as R1
says, a key addition or it is nothing** — `id` appears on institutions and factions, nowhere else.

## (i) THE THREE NAME-KEYED CHOICE SITES — WHICH ENTITY KIND KEYS EACH

Design §21.5 ruling 7 names them; all three re-found by symbol at the tip.

| # | site | the key, verbatim | entity kind | needs from EM-P1 |
|---|---|---|---|---|
| 1 | `src/generators/steps/assembleInstitutions.js:745` | `` pickVariant([inst.desc, ...variants], `${ctx._seed}:${inst.name}`) `` | **INSTITUTION** | **NOTHING — see below** |
| 2 | `src/data/npcData.js:1334` | `` pickVariant(variants, `${r?.name ?? ''}>${s?.name ?? ''}::${salt}`) `` | **NPC** (the directed relationship pair) | **NOTHING.** `npc.id` already exists and R1 freezes its spelling, so EM-P1b re-keys this site on `npc.id` **today**, with no dependency on EM-P1 at all |
| 3 | `src/domain/townMap/glyphAssign.js:125` | `` seedId = b.anchorKey || b.name || 'glyph-seedless'; createPRNG(`glyph:${seedId}`) `` | **INSTITUTION** (via its draw-model building) | **NOTHING — see below** |

### ⭐ THE FINDING THAT DECIDES THIS: INSTITUTIONS ALREADY HAVE A REGEN-STABLE ANCHOR

`src/domain/townMap/anchors.js` exists and its header states EM-P1's own problem and solves it:

```
$ sed -n '4,11p' src/domain/townMap/anchors.js
 * The town map places a building for every institution … must key on an identity that
 * SURVIVES ROSTER DRIFT: a settlement regenerated at the same seed, or edited in the
 * dossier, reshuffles the institutions array, so an array index is a false identity.
 * The stable anchors are the catalog/custom identity slugs the generator already mints.
 * Anchor precedence for an institution:  catalogId → localUid → name-slug.
$ (anchors.js:50) export function anchorForInstitution(inst) →
    `cat:${catalogId}` | `uid:${localUid}` | `name:${slugify(inst.name)}`
$ git grep -n "anchorForInstitution" -- src → 7 consumers
    interior/interiorFootprint.js · interior/interiorModel.js · townMap/institutionAssignment.js
    townMap/townLayoutV2.js · townMap/townMapModel.js (x3)
```

**Site 3 already prefers it.** `glyphKindFor` reads `b.anchorKey` FIRST and only falls to `b.name`
when the building carries no anchor; `townMapModel.js:305` sets
`anchorKey: anchorForInstitution(institution)`. CONFIRMED that the anchor wins when present;
**PLAUSIBLE** that it is always present (the one caller is `townScene/buildingProfiles.js:382`,
not re-derived here). Design §21.5.7's phrasing — *"`glyphAssign.js` mints `createPRNG('glyph:<name>')`"* —
is imprecise: it mints on the ANCHOR, with the name as a fallback.

**Site 1 is total on the anchor, by construction.** The two loops carry matching guards:

```
$ sed -n '728,732p;741,746p' src/generators/steps/assembleInstitutions.js
  for (const inst of institutions) {
    if (inst.isCustom || inst.source === 'custom') continue;      ← the catalogId stamp
    const catalogId = catalogIdForName(inst.name);
    if (catalogId) inst.catalogId = catalogId;
  }
  for (const inst of institutions) {
    if (inst.isCustom || inst.source === 'custom' || !inst.desc) continue;   ← site 1
    const variants = INSTITUTION_DESC_VARIANTS[`${tier}|${inst.category}|${inst.name}`];
    if (variants && variants.length) { inst.desc = pickVariant(…); }
```

`pickVariant` fires only when `INSTITUTION_DESC_VARIANTS` holds a row for that exact name — i.e.
only for a CATALOG name — and every catalog name resolves through `catalogIdForName`. So every
institution that reaches site 1 carries a `catalogId`, and `anchorForInstitution` returns
`cat:<catalogId>` for all of them. The `name:` fallback is unreachable at this site.

⚠ **`catalogId` is a slug of the CANONICAL CATALOG NAME, stamped once at generation and stored**
(`institutionalCatalog.js:2535-2545`). A DM rename of the instance does not move it — which is
exactly the rename-stability EM-P1b needs. It is a **fifth** identity namespace and belongs in
RECON-ID's table beside the four already named.

**⇒ None of the three sites needs anything EM-P1 mints.** Sites 1 and 3 key on
`anchorForInstitution`; site 2 keys on `npc.id`.

⛔ **This contradicts the charter's line 113** (*"re-keyed on the stable id"*, §934.47 add. 16).
**A chair decision, not taken here:** re-cut EM-P1b to key sites 1 and 3 on the EXISTING
`anchorForInstitution` rather than on an EM-P1 id. If the chair prefers one identity rather than
two, that is a legitimate reason to keep EM-P1 ahead — but it is a preference for uniformity, and
the measurement says the function already exists, is already consumed by seven modules, and is
already what site 3 reads.

## (ii) WHO NEEDS INSTITUTION OR FACTION IDS BEFORE THE FIRST DOOR?

Sequence measured packet by packet — kit drafts where they exist, charter rows otherwise.

| # | packet | how it ADDRESSES an institution / faction | needs an id? |
|---|---|---|---|
| 1 | **EM-P2** | rows are `{forkId, step, key, module, symbol, outputKey}` — addresses STEPS and KEYS | **no** |
| 2 | **EM-A1** | `types.js` = `FieldKind`, `FieldDeclaration`; `fieldDeclarations.js` joins on `(cardShape, outputKey)` — addresses CARD SHAPES, never an instance | **no** |
| 3 | **EM-A2a · EM-A2b** | typed value POOLS, keyed by FIELD | **no** |
| 4 | **EM-P1b** | the three convicted NPC readers + the three choice sites of (i) | **no** — sites 1/3 on `anchorForInstitution`, site 2 on `npc.id` |
| 5 | **EM-B3c** | a SQL-side security walker over the gallery scanner | **no** |
| 6 | **EM-B1f** | `isOffStage` gains a `jailed`/`exiled` arm — NPC status only | **no** |
| 7 | **EM-B1h** | one frozen `WORLD_PULSE_FATES` + a totality walker over its writers | **no** |
| 8 | **EM-B1a** | `validateOp` step 3: *"if `op.target` is not `{ kind, id }` with kind in the closed EntityRef set"* — a **SHAPE CHECK ONLY**; it never resolves an id against a settlement, and its own A1 fixture is the synthetic `{kind:'institution', id:'i1'}` | **no** |
| 9 | **EM-B1c** | the three renames **DELEGATE**: `factionRenameChanges(settlement, oldName, newName)` and `npcRenameChanges` — **BY NAME, by design** (design §12.3: names are join keys; a rename runs the existing cascade) | **no** — but it waits on EM-P1b per charter line 113 |
| 10 | **EM-B1b** | the seven off-stage appenders declare POLICY AS DATA; `consequenceFor(target)` is EM-F1's | **no** |
| 11 | **EM-B1g · EM-A3** | A3 is a LIVE census of derivation roots + the rename cascade's join list | **no** |
| 12 | **EM-B3d** | `importScrub` strips the two editor keys | **no** |
| 13 | **EM-C4a** | ⭐ the FIRST APPLY POINT — `editSlice.js`, the one generic adapter, plain-edit application on a draft, and **the first writer of `dmLayer`** | **only for the card EM-D0 opens** |
| 14 | **EM-D0** | ⭐⭐ **"ONE card (the NPC's) on a DRAFT settlement"** (charter row, verbatim) | **no — the first door is the NPC's card, and NPCs already carry `npc_<n>`** |

### ⇒ ANSWER: YES. Nothing on the path to the first door is starved.

The chain that would have needed institution or faction ids breaks in two independent places:
**EM-D0's first door is the NPC's card**, and **EM-B1a validates a target's shape without
resolving it**. The only packet that touches institutions at all before the door is EM-P1b, and
(i) shows its two institution sites are served by a function already in the tree.

⚠ **AND THE PATH IS ALREADY GATED ELSEWHERE.** Charter line 114: *"EM-B2a is BLOCKED … **EM-D0 and
train EM-T7 wait on it with EM-B2a**"* — the first door already waits on ARCH-REDERIVE. Moving
EM-P1 behind RECON-ID therefore does **not** add a gate to the critical path; it removes the
program's riskiest packet from a path that is blocked on something else.

## §9.3 · RECOMMENDATION

**⭐ EM-P1 WHOLE, AFTER RECON-ID AND AFTER EM-T7.** Institutions and factions together, one packet,
one golden shift, one signature.

| | **EM-P1 whole, after RECON-ID + EM-T7** | **EM-P1-institutions now (`inst_<n>`), factions later** |
|---|---|---|
| golden shifts | **1** — `generator-golden-master`, 525 rows, one key-addition cause covering both kinds | **2** — institutions now, factions after RECON-ID; each moves all 525 rows; **one cause per record is the law, so they cannot be merged** |
| owner signatures | **1** | **2**, the second arriving after the owner has already signed a narrowed scope today |
| packets touched twice | **0** | **≥1, and it is EM-P1b** — it would take `inst_<n>` now and be re-opened for factions later; plus the charter's line 113 amended twice |
| what the split BUYS | — | **measurably nothing before the first door.** Its two institution sites already have `anchorForInstitution`, and no other packet in the sequence resolves an institution id |
| risk carried | the riskiest packet leaves the critical path and lands behind a recon that has measured every namespace | a persisted-shape packet lands on the critical path on a premise (that something needs institution ids soon) that this measurement refutes |

**The narrowest EM-P1 that would serve a real need is empty**, because there is no such need before
the door. The chair asked to be told if one exists; measured, none does.

**Two conditions on the recommendation, both chair-owned:**
1. **EM-P1b must be re-cut** to key sites 1 and 3 on `anchorForInstitution` and site 2 on `npc.id`,
   amending charter line 113's *"re-keyed on the stable id"*. Without that amendment EM-P1b still
   names EM-P1 as a dependency and the move does not actually free the path.
2. **RECON-ID's table must include `anchorForInstitution` and `catalogId`** as the fifth namespace —
   they are the reason the institution half is not urgent, and a recon that omits them would
   re-derive the urgency it was commissioned to dissolve.

## §9.4 · NOTICED IN THIS PASS, NOT TOUCHED

7. ⛔ **EM-B1a's stated dependency is unmet.** EM-B1a:37 says it depends on EM-A1 for *"the `Op`
   and `EntityRef` typedefs"*, and it imports `{import('./types.js').EntityRef}` at :276. But
   **EM-A1's change-manifest row for `src/domain/edit/types.js` names only `FieldKind`,
   `FieldDeclaration`** (`≤ 60` lines, *"Author the AMENDED typedefs (§6.2) verbatim"*), and
   `EntityRef` appears nowhere in EM-A1. Same shape as the A2a/A2b train-order defect the chair
   caught at §934.47 addendum 21 — a packet modifying what its predecessor was never told to
   create. Either EM-A1 gains the two typedefs or EM-B1a declares a MODIFY on `types.js`.
8. `EM-B1.md` (the superseded parent) still sits in `packets-waiting/` beside its children
   `EM-B1a`…`EM-B1f` and still carries the same `src/domain/edit/types.js` reference; a stale
   packet reserves its change paths (charter line 117's just-in-time rule).
