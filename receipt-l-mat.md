# RECEIPT — LANE L-MAT — **COMPLETE (5 of 6 cars landed; CAR 6 REFUSED with the measurement)**
Seat: Opus 5 — Fable-unvalidated · Lane: L-MAT · Chair: Fable 5.1 (session 8de5f153)
Dock: $SC/laneLMAT · cut at 3b1c0eaa51f77561a036ae7ec54682c39856192c

## PREDECESSOR
Session b43943b4 arrived 2026-09-07 10:24:17 EDT, took the arrival check, wrote the header
of this file, and died with its session before writing a product byte. Its header block is
KEPT verbatim in the arrival section below (marked "predecessor"); its "CARS (none yet)" is
superseded. Successor session 8de5f153 arrived 2026-09-07 10:56:39 EDT (`date`).

## STATUS: DONE. Cars 1-5 landed (+ a 5b typecheck fix). **CAR 6 REFUSED** — R-C's mechanism is refuted by the estate's own F2c tripwire; see REFUSAL 4. Dock tip `7d96e2b72`, porcelain 0.

## ARRIVAL CHECK (successor, 2026-09-07 10:56:51 EDT, from `date`) — PASS
- HEAD `3b1c0eaa51f77561a036ae7ec54682c39856192c` == `git -C <main tree> rev-parse claude/composite-r4`
  (`3b1c0eaa51f77561a036ae7ec54682c39856192c`). CONFIRMED.
- `git status --porcelain | wc -l` = 0. CONFIRMED.
- `ls -A node_modules | wc -l` = 454 (brief said "≈453"; predecessor measured 453 at 10:24).
  CONFIRMED within the brief's tolerance; the one-file drift is not investigated.
- `$SC/HOLD-VITEST` ABSENT at 10:56:51 EDT and re-checked before every vitest since. CONFIRMED.
- Predecessor's own arrival block (verbatim): HEAD match, porcelain 0, 453 symlinked packages,
  HOLD-VITEST absent at 10:24:17 EDT.

## CARS
| # | sha | subject |
|---|-----|---------|
| 1 | `442c7f988` | the create boundary leaves first paint; the PIN is REFUTED by the build |
| 2 | `fe8eb3f56` | the living-content law is WIRED, dark; THE PROMISE re-proven by execution |
| 3 | `9a9a7856e` | the walker's second hole closed; the plant proves it in both directions |
| 4 | `525ffa99b` | O-11 path 1 — the public drop PINNED; the DM-full half measured and refused |
| 5 | `34115c7b7` | O-11 path 2 — resolve-or-drop on account import |
| 5b | `7d96e2b72` | the typecheck ratchet made green — car 5 shipped 11 type errors |
| 6 | — | **REFUSED**, reverted to `34115c7b7` with zero residue (porcelain 0) |

Dock tip: `7d96e2b72`. Porcelain 0.

## BUILD LISTINGS (the two the brief asks for; three builds taken, plus one control)
All builds `sh scripts/gate-mutex.sh --run -- npm run build`, exit 0, ~22 s each.

**Build A — BASE** `3b1c0eaa5`, 10:58:11→10:58:33 EDT. 1,377 emitted files. *(the start time read
`11:58:11` until §913/C18 — a typo, not a measurement; `$SC/lmat/build-base.meta` line 1 reads
`Mon Sep  7 10:58:11 EDT 2026`. Corrected HERE, in the table, because the X13 row that first caught
it sits ~500 lines below and a reader of this table never reached it.)*
**Build B — CAR 1** (source edits, no pin), 11:02:57→11:03:22 EDT. 1,377 emitted files.
**Build C — DETERMINISM CONTROL**, same tree as B, 11:04:45→11:05:08 EDT.

- C vs B: **0 files re-hashed, 1,377 identical.** The build is deterministic, so the A-vs-B
  diff below is a real difference and not toolchain noise. (This control was not in the brief;
  it was taken because the A-vs-B diff had a shape — 658 re-hashes at zero byte delta — that
  is indistinguishable from a nondeterministic build until the control is run.)
- **A vs B: 0 chunks ADDED, 0 chunks REMOVED, 0 files changed SIZE.** 658 files re-hashed
  (347 JS chunks + 311 prerendered HTML documents), every one byte-length-identical.
- `dist/assets/densityCreateBoundary-CLYaPKyo.js` — 101 B, md5 `581a4f0bf295115ab1177f5be4fb1f65`
  — is present and IDENTICAL in A and B.
- First-paint closure at B (8 files, walked from `dist/index.html`'s entry script):
  raw **1,042,086** / 1,048,000 (margin 5,914) · gzip **330,797** / 337,000 (6,203) ·
  Brotli **277,749** / 283,000 (5,251). Since every dist file is byte-identical between A and
  B, these are the BASE figures too: **car 1 costs zero first-paint bytes.**

## BRIEF FIGURES RE-DERIVED (a brief figure is a hypothesis)
| brief figure | measured at the dock | verdict |
|---|---|---|
| `settlementSliceHelpers.js:44` is the sole eager edge / re-export | line 44 exactly; only `birthConfig` consumer is `settlementGenerateAction.js:47` | CONFIRMED |
| `composeInstantWorld.js:56` imports the boundary directly (lazy) | line 56 exactly; not in the eager set | CONFIRMED |
| main.jsx closure 239 → 238; boundary leaves the eager set | 239 → 238; `EAGER_FIRST_PAINT_MODULES` 264 → 263; boundary true → false | CONFIRMED |
| `densityLaw.js` stays eager (density cost unchanged) | still eager; still an ESD member | CONFIRMED |
| ceilings `vendorPdfLazy.test.js` :565 / :595 / :596 = 1_048_000 / 337_000 / 283_000 | exactly those three lines and values | CONFIRMED |
| walker `MINT_HOMES` row for the helpers file at `:48-52` | rows at :48-52, helpers at :51 | CONFIRMED |
| `densityCreateBoundary.js` header "237 modules" (:226, brief said :231) | the closure is **239** at this tip; the header is STALE. Line is :226, not :231 | CONFIRMED stale / brief's line cite off by 5 |
| header "the lane awaits `loadEngine()`" (:246-248) | FALSE: `loadEngine` lives in `settlementSlice.js:42` and the lane never calls it; the lane calls `runGeneration` (`:40`) and dynamically imports `workers/generationRequest.js` (`:61`) | CONFIRMED false |
| ESD has 68 members, seeded from `src/generators` only | 68 exactly | CONFIRMED |
| `livingContentLaw.js` is NOT an ESD member (so the header's excision instruction is inert) | not a member; `livingContentLawVersion.js` and `livingContentSeam.js` ARE | CONFIRMED |
| `livingContentLaw.js:94-95` dial = default; `:154-162` mint returns `{}` | exactly | CONFIRMED |
| `livingContentRoster.js:33-34` nothing in `src/` reads the key; `:189-194` sort by new id | exactly | CONFIRMED |
| `settlementSlice.js` size-ratcheted (tolerance 0) — the reason the helpers file exists | `scripts/.size-baseline.json` carries `src/store/settlementSlice.js` = 824. Neither `settlementSliceHelpers.js` nor `settlementGenerateAction.js` carries a row | CONFIRMED — and the ratchet is NOT touched by this car |

## REFUSALS (a refusal is a result)
1. **CAR 1's `manualChunks` PIN — REFUSED, with the measurement.** The brief predicted that
   de-eagering leaves `densityCreateBoundary.js` an orphan that Rollup co-locates into the big
   lazy `engine` chunk (the FP-G11/FP-G17 class). Two builds refute it: the module ALREADY has
   its own 101-byte emitted chunk at the base commit, and that chunk is byte- and
   content-hash-identical after the car. There is no orphan to pin, and a pin would be a
   routing rule written against a hypothesis the build refutes. The brief's own largest
   unpriced risk ("does de-eagering re-parent the big lazy `engine` chunk into
   `composeInstantWorld`'s chunk?") is answered NO by the same diff: 0 chunks added, 0 removed,
   0 size changes.

## JUDGMENT CALLS — RETROVALIDATION ROW
| id | call | who | ground |
|----|------|-----|--------|
| R-A | O-11 path 1 = public projection DROPS the roster, PINNED; no migration, no allowlist entry | **CHAIR RULING** | pending car 4 |
| R-B | O-11 path 2 = RESOLVE-OR-DROP on account import, per-settlement grain | **CHAIR RULING** | pending car 5 |
| R-C | O-11 path 3 = one OPTIONAL core key, omitted when dormant | **CHAIR RULING** | pending car 6 |
| R-D | `_livingContentLawVersion` may reach the public projection; RECORDED not changed | **CHAIR RULING** | pending car 4 |
| R-E | the mint is spread inside `birthConfig`, main-thread, mirroring the density precedent | **CHAIR RULING** | pending car 2 |
| L1 | REFUSE the car-1 `manualChunks` pin | LANE | two builds: the chunk already exists and is identical (above) |
| L2 | DELETE the walker's `MINT_HOMES` helpers row rather than keep it as an allowlist entry | LANE | the leaf names the mint nowhere now; a kept row is a standing excuse for a mint returning to an eager store leaf. Walker green at 14/14 after the deletion |
| L3 | take a build-determinism CONTROL the brief did not ask for | LANE | the A-vs-B diff shape (658 re-hashes, zero byte delta) is indistinguishable from a nondeterministic build without it |

## DEFERRED (documented, not a bug to re-find)
- (none yet)

---

## CAR 2 — THE WIRING (sha `fe8eb3f56`, 11:19 EDT)
**Build D — CAR 2**, 11:12:51→11:13:14 EDT, exit 0, 1,377 files, at `442c7f988`.

- **BASE → CAR 2: exactly ONE file changed size** — `dist/assets/densityCreateBoundary-*.js`
  **101 B → 130 B (+29)**, a LAZY chunk. 0 chunks added, 0 removed, no other size change.
  685 files re-hashed (the entry-chunk filename cascade; see car 1).
- First-paint closure at car 2: raw **1,042,086** / 1,048,000 — **identical to base**;
  gzip 330,810 / 337,000; Brotli 277,714 / 283,000. **Zero first-paint bytes; 29 lazy ones.**
- `EAGER_FIRST_PAINT_MODULES` membership: `livingContentLaw.js` false, `livingContentLawVersion.js`
  false, `livingContentRoster.js` false, `livingContentSeam.js` false, `densityCreateBoundary.js`
  false. main.jsx closure 238. `ENGINE_SHARED_DOMAIN` 68 members, unchanged.
- Guards green with NO build: `engineChunkLazy` orphan-excision arm (13 passed + 2 skipped),
  `livingContentSeamLazy` (6 passed, including `:134` `expect(eager.has(LAW)).toBe(false)`).

### THE PROMISE — RE-PROVEN BY EXECUTION
New file `tests/domain/livingContentLawWiring.test.js`, **10 arms, all green**. Each dark arm is
paired with a LIT one so it cannot be green because nothing happened.
- CREATE dark: `birthConfig` writes not one byte. **SAME-SEED CONTROL**: the real pipeline run
  twice on one seed, through the boundary and around it, deep-equal. No golden re-recorded.
- CREATE lit (**the STOP fired deliberately**): the law module mocked to a lit dial, the boundary
  re-imported — `birthConfig` really carries the marker. This is what stops every dark arm being
  vacuous.
- READ: the version comes from the config, never the dial — asserted again UNDER the lit mock.
- ⛔ **THE STOP, in the product**: a MARKERLESS settlement on screen + a LIT wizard config, driven
  through the real store's `regenSection('npcs')`. The regenerated world keeps no marker and grows
  no roster; the arm carries its own control proving the wizard config really was lit.
- UNDO/CLONE: the clone seam carries a lit world's law and mints none on a dark one.
- PERSIST: `geographyLockedConfig` overlays geography keys only.

### ⚠ A BRIEF LAW CORRECTED BY MEASUREMENT (recorded, not changed)
The brief's LAWS say "`updateConfig` drops unknown keys". **FALSE for this key.**
`isAllowedConfigKey` (`src/store/configSlice.js`) admits the WHOLE underscore family by prefix
(`key.startsWith('_')`), so `_livingContentLawVersion` is admitted exactly like `_seed`. The
promise does not rest on it: the store config is the wizard form, is never hydrated from a saved
settlement, and the path that decides an EXISTING world's law reads `settlement.config` first.
A lit form config governs the NEXT BIRTH, which is what a birth config is for. Pinned in the new
test as a RECORDED correction.

## CAR 3 — THE WALKER HOLE (sha `9a9a7856e`, 11:26 EDT)
- Measured reacher set = **5 files exactly**, and `src/store/settlementGenerateAction.js` is NOT
  among them. CONFIRMED as the brief predicted.
- **NEGATIVE CONTROL, EXECUTED IN BOTH DIRECTIONS** (md5-verified `cp` backups, never `git checkout`):
  | run | scan | result |
  |---|---|---|
  | plant `const _PLANT_L_MAT = newSettlementMapEdits;` in the lane | WIDENED | **RED** — 1 failed \| 13 passed, "src/store/settlementGenerateAction.js names newSettlementMapEdits" |
  | the SAME plant | pre-widening `[...reachers, MINT_HOME]` | **GREEN** — 14 passed. The hole was real and silent. |
  | restored | widened | GREEN — 14 passed |
  Restored digests: lane `1d0e38ff5a669f52744caf73fa5958fd`, walker `a8b662af7440514981d93a8f1818b394`
  — both exactly the pre-plant backups. Porcelain after restore named only the walker.

## MORE BRIEF FIGURES RE-DERIVED
| brief figure | measured | verdict |
|---|---|---|
| walker ⭐ arm at `:429`, `scanned` at `:452` | arm at :455, `scanned` at :478 (post-car-1 numbering); the expression is exactly `[...reachers, MINT_HOME]` | CONFIRMED (line cites shifted) |
| the reacher set is five files and excludes the generate action | exactly five, listed in the car-3 commit | CONFIRMED |
| `engineChunkLazy.test.js:238` orphan-excision arm | at :238 exactly | CONFIRMED |
| `livingContentSeamLazy.test.js:134` `eager.has(LAW)` false | at :134 exactly | CONFIRMED |
| `livingContentMaterialization.test.js:106-109` LIT_CONFIG shape | at :106-109 exactly | CONFIRMED |
| the `:470` WIRED arm requires the mint NAMED in `MINT_HOME` | at :470; the static import satisfies it (the specifier string is stripped, the identifier survives) | CONFIRMED |
| `GENERATION_LAWS` wiring row at `:279` | at :279 pre-edit | CONFIRMED |
| `densityCreateBoundary.js:249-251` carries the ESD instruction | at :249-251 exactly | CONFIRMED, and DROPPED as measured inert |

## MORE JUDGMENT CALLS
| id | call | who | ground |
|----|------|-----|--------|
| R-E | the mint spread inside `birthConfig`, main-thread | **CHAIR RULING** | **RETROVALIDATED**: implemented as ruled; the refused alternative (a per-caller LAZY mint in the two BIRTH callers) is recorded in the birthConfig docblock with its reason. Costs 0 first-paint bytes, 29 lazy |
| L4 | widen the walker's `MINT_SYMBOLS` in the SAME car that flips the row to WIRED | LANE | flipping to WIRED removes the law from the ⭐ arm's denominator; without the widening the wiring car would have RETIRED the only guard on where that mint may be named |
| L5 | land the two stale-header corrections in car 2, not car 3 | LANE | both sentences live inside the UNWIRED-reason block car 2 must rewrite; correcting them in car 3 would mean correcting prose car 2 had deleted |
| L6 | write the PROMISE proof as a NEW test file rather than extending `livingContentMaterialization.test.js` | LANE | that file proves what the law DOES; this one proves who may ask. Its every lit world is hand-lit, so it says nothing about a create boundary |
| L7 | arm the living-content seam at the top of the new test file | LANE | the pipeline THROWS on a v2 world with no registered builder; arming it means a dark arm that accidentally went lit surfaces as a wrong world, not as a throw that could be mistaken for the law being off |

## DEFERRED (documented, not a bug to re-find)
- **The sample-fork path is a marker carrier the day the dial lights.**
  `src/components/generate/FoundingWorlds.jsx` copies a sample's config into the wizard config via
  `updateConfig({ ...normalizeConfig(sample.config), … })`, and the underscore family is admitted
  (above). `SAMPLE_SETTLEMENTS` is a static in-repo fixture set, so no user world reaches it and it
  is INERT while the dial is dark. On the lighting day, whoever regenerates the samples decides
  whether a forked sample is born under the sample's law or the forker's. Not a bug today.

---

## CAR 4 — O-11 PATH 1 (sha `525ffa99b`, 11:29 EDT) — R-A / R-D
New file `tests/security/livingContentRosterPublicDrop.test.js`, **6 arms green**.

| measurement (executed against the real projection, lit world) | result |
|---|---|
| `customContentRoster` on `PUBLIC_TOPLEVEL_KEYS` | **false** — pinned with `expectAbsentWithAnchor(..., 'config', ...)` |
| `customContentProvenance` on `PUBLIC_TOPLEVEL_KEYS` | **false** — same anchored form |
| DEFAULT projection: roster / provenance present | **false / false** — R-A's OUTCOME CONFIRMED |
| **FULL (`{full:true}`, the DM share): roster / provenance present** | **TRUE / TRUE** — R-A's MECHANISM CORRECTED |
| `config._livingContentLawVersion` in the DEFAULT projection | **2** (present) — R-D CONFIRMED |
| tokens of `PRIVATE_KEY_RE` matching any roster key | **none** — R-A(v) CONFIRMED |
| `gallerySanitizeAllowlist.contract.test.js:124` generates `customContent: {}` | CONFIRMED — its round-trip proves nothing about this key |
| `customDefinitionIdentityProjection.js:16` = the five account-scoped identifiers | CONFIRMED |

**REFUSAL 2 — the DM-full drop is REFUSED to this lane, with the measurement.** The
ledger's O-11 tracing line ("publicSafe allowlist drops the roster from DM-shares") is
FALSE for full mode: `toPublicSafe(s, {full:true})` does not run the root allowlist at all.
Curing it needs a `_gallery_dm_full_json` SQL twin and this lane lands no migration — the
same V1 boundary `townMapEditsPublicDrop.test.js` records for `mapEdits`. What makes it
inert is now a LIVE ASSERTION inside the DM-full arm (the dial is dormant, so no shipped
world carries a roster): **lighting the dial REDS this file by design**, with a message
naming the decision.

No migration; `PUBLIC_TOPLEVEL_KEYS` untouched; the SQL twin untouched;
`supabase/applied-head.json` untouched.

## CAR 5 — O-11 PATH 2 (sha `34115c7b7`, 11:36 EDT) — R-B
`remapAccountSettlementLivingContentRoster` + its wiring + 9 unit arms + 3 round-trip arms.

**THE OPEN QUESTION R-B ordered traced FIRST — ANSWERED, and it strengthens the ruling.**
A regen does **NOT** re-mint the roster. Only `generateSettlementPipeline` builds one (the
estate names `customContentRoster` in exactly one writer, `:185`); neither
`regenNPCsPipeline` nor `regenHistoryPipeline` touches it. The roster an import writes is
the roster the world keeps — nothing downstream corrects a foreign one.

**AND THE KEY REALLY REACHES THE REMAP — EXECUTED.** A probe through
`prepareSettlementEntry` shows `customContentRoster` (source ids unchanged),
`customContentProvenance`, and `config._livingContentLawVersion` all surviving that call.
The new branch is live code, not an unreachable one.

| brief figure | measured | verdict |
|---|---|---|
| the provenance remapper's four lookups at `:107-128`, core at `:182` | exactly | CONFIRMED |
| `accountImportBody.js` provenance block `:424-445`, drop-law `:439-443` | exactly — but the file is `src/store/accountImportBody.js`, not `src/lib/` | CONFIRMED (path corrected) |
| the Phase-4/Phase-8 ordering: empty map at `:186`, replaced at `:631` | CONFIRMED **and wider**: also replaced at `:349` (Phase 3, the v3 ARCHIVE path). So the archive path RESOLVES and every other path degrades | CONFIRMED + widened |
| `customDefinitionIdentityProjection.js:93-99` falls the fingerprint back to the hash | exactly | CONFIRMED — the trap is real and cured |
| `livingContentRoster.js:189-194` sorts on the id the remap rewrites | exactly | CONFIRMED — the buckets are re-sorted |
| `scripts/lib/writer-dark-register.mjs:81` roster row stays as it is | CONFIRMED — dial at 1, no shipped world writes the key |
| `writerReach.walker.test.js:1164-1167` MAT retro-control stays as it is | CONFIRMED — **56 passed**, including `live.verdicts.has(...) === false`; this car's new read did NOT flip it |
| the observed-shape-readers baseline | **44 passed, baseline byte-untouched** |
| the negative-assertion per-file budgets (accountImportSlice 9) | CONFIRMED unchanged — the new arms add ZERO scanned negative sites |

**REFUSAL 3 — the reconciliation boundary is DECLARED, not cured.** MEASURED: the
reconciliation slice calls the same `prepareSettlementEntry` and has no content identity
map, so it would carry a foreign roster. NOT cured here because `customContentProvenance`
has the identical pre-existing gap on that same boundary — curing one leaves two records
that are governed alike everywhere else disagreeing about one path — and because with the
dial dormant nothing can reach it. Written into `livingContentRoster.js`'s own header, where
the next reader of the key will find it.

## MORE JUDGMENT CALLS
| id | call | who | ground |
|----|------|-----|--------|
| R-A | O-11 path 1 = the public projection DROPS the roster, PINNED, no migration | **CHAIR RULING** | **RETROVALIDATED on its outcome; its DM-share mechanism CORRECTED by execution** (car 4 table) |
| R-D | `_livingContentLawVersion` may reach the public projection; RECORDED not changed | **CHAIR RULING** | **RETROVALIDATED** — measured present in the default projection; pinned with the `schemaVersion`/`generatorVersion` siblings |
| R-B | O-11 path 2 = RESOLVE-OR-DROP at per-settlement grain | **CHAIR RULING** | **RETROVALIDATED**, and its ⚠ regen question answered in the direction that strengthens it |
| L8 | assert the DORMANT DIAL inside the DM-full arm so lighting reds there | LANE | the gap is real and un-fixable in this lane; an assertion that fails on the lighting commit makes the decision unavoidable, the estate's own "pins the gap so crossing it reds" idiom |
| L9 | carry the roster `schemaVersion` rather than import the builder's constant | LANE | the import drags the roster module + the content-manifest closure into the import-path chunk for one integer; the agreement is pinned in the test where the import is free (the walker's own stated idiom) |
| L10 | drop an INDEPENDENT source fingerprint instead of carrying it | LANE | it has no entry in the identity map; the roster is read by nothing, so an honest absence costs nothing and a stale source identifier costs exactness |
| L11 | the round-trip arms live in a SIBLING describe, not inside the `export→import round-trip` suite | LANE | the module-scope helpers are shared either way; a named describe says what the three arms are for |
| L12 | the second round-trip arm exercises "no archive-backed identity map" rather than a literal legacy PACK envelope | LANE | `buildAccountExport` REFUSES to export `customContent` without an archive (`AccountExportPreflightError`), so a literal legacy-pack envelope cannot be built through the public exporter. The map state under test is identical — the empty archiveBacked:false default at Phase 4 — and the arm says so |

---

## ⛔ CAR 6 — O-11 PATH 3 — **REFUSED**, WITH THE MEASUREMENT (R-C)

CAR 6 was BUILT IN FULL, MEASURED, and then REVERTED. What follows is what the
implementation measured, because a refusal is only worth what its evidence is.

**What was built** (all four pieces R-C names): the optional `livingContent` core
key on `settlementContentProvenance.js` (required-plus-optional admission, never
exact-wider; `schemaVersion` untouched at 1); the identical widening in the
portability remap's core; the pipeline reordered so the roster is built BEFORE the
receipt with the marker passed through the existing context bag (zero new edges on
the receipt module — it derives the digest from what it is handed, using the
`fingerprintContent` it already imports); and the import path reordered so the
receipt's marker is re-derived over the **destination** roster (a coupling R-C does
not mention, and which car 5's own remap creates: a digest of SOURCE ids is stale
the instant the roster is remapped).

**WHAT REFUTES IT — the estate's own F2c tripwire, on all 26 blind cases:**

```
every blind case materializes and discovers under the lit law
AssertionError: presentation→mechanical promotion:
  stressors.name: flipping a PRESENTATION field moved something outside the inert
  roster. That is a presentation→mechanical promotion, which is OWNER-GATED and
  must not arrive as a side effect of materialization.
  Escaped: $.customContentProvenance.livingContent.rosterHash,
           $.customContentProvenance.receiptHash
```
…and the same line for all 26 cases across `stressors`, `deities`, `traditions`,
`factions`.

**WHY.** R-C specifies the digest as "the IDENTITY-ONLY projection (definitionId /
revisionId / **contentHash** triples per row, sorted) — what is immutable — never
the authored presentation prose (an epithet edit must not move a tamper-evident
receipt)." MEASURED: `customDefinitionContentHash` is a hash **of the authored
content**, presentation included. So the projection R-C specifies does not have the
property R-C requires of it: every presentation edit moves the content hash, moves
`rosterHash`, and moves `receiptHash` — promoting presentation into a persisted,
hash-validated surface, which is the exact owner-gated boundary the whole
living-content design exists to hold.

**THE NARROWER REPAIR WAS ALSO MEASURED, AND IT IS A DIFFERENT DESIGN.** Dropping
`customDefinitionContentHash` and digesting `definitionId + revisionId` only CLEARS
the tripwire (measured: 2 failures instead of 3, and both remainders are the
re-cuts R-C chartered). But it buys that by going blind to exactly what the fixture
demonstrates happening — a definition whose CONTENT changed while its revisionId did
not. A tamper-evident digest that cannot see a content change is a hash that does not
do its job. Choosing it is a ruling about what this receipt must detect, on a
persisted hash-validated artifact, at the F2c boundary. **That is chair/owner work,
not a lane repair**, and the brief's own instruction is to refuse rather than guess
past a contradiction.

**NOTHING IS OWED TODAY.** The dial is at 1, so no shipped world is lit and no
receipt can carry the key either way. Cars 1–5 are not gated on R-C and stand alone.

**THE REVERT IS CLEAN.** The four touched files were restored from the car-5 tip by
explicit `git show 34115c7b7:<path> > <path>` (never `git checkout`), porcelain
returned to 0, and the affected suites were re-run green afterwards:
livingContentMaterialization 11, settlementContentProvenance 4,
accountSettlementContentPortability 13, accountImportSlice 24,
livingContentLawWiring 10, livingContentRosterPublicDrop 6,
densityCreateBoundary.walker 14.

**WHAT A SUCCESSOR CAR INHERITS** (so none of this is re-derived):
1. `canonicalContentJson` SORTS keys and emits an absent key as nothing, so
   omitted-when-dormant really does reproduce the dormant digest byte for byte.
   R-C's central byte claim is sound; only the digest's INPUT is wrong.
2. `hasExactKeys` → required-plus-optional is right and necessary: widening
   `RECEIPT_KEYS` itself would make the admission REJECT every six-key receipt on
   disk, and the import path answers a failed admit by DELETING the receipt.
3. The receipt module needs NO new import: pass the roster through the context bag
   and digest it with the `fingerprintContent` it already has.
4. `buildSettlementContentProvenance` returns `null` when a world has no
   environment, no bindingHash and no materialized definitions — so a lit world
   with only a roster gets NO receipt at all, and the marker cannot ride one.
   R-C does not address this.
5. The import ordering coupling above (destination-roster re-derivation).
6. Two more instruments must be re-cut with it: the lit arm of
   `livingContentMaterialization.test.js` ("the lit law perturbed the world beyond
   adding its own key" — a lit world would then differ by TWO things) and the
   `the provenance receipt is untouched by the roster` pin R-C already names.

## FINAL BUILD — BASE → COMPOSED TIP (`7d96e2b72`)
**Build E**, 11:47:12→11:47:33 EDT, exit 0, 1,377 files.

- 0 chunks ADDED, 0 REMOVED. **Exactly TWO files changed size:**
  `accountImportBody.js` **22,782 → 25,209 (+2,427)** — the roster remapper, which
  Rollup co-locates into that LAZY import-path chunk — and
  `densityCreateBoundary.js` **101 → 130 (+29)**, the second mint.
- **First-paint closure raw 1,042,086 / 1,048,000 — IDENTICAL to the base build**
  (margin 5,914). gzip 330,813 / 337,000 (6,187). Brotli 277,727 / 283,000 (5,273).
- **The whole consist costs ZERO first-paint bytes and 2,456 lazy ones.**
- 685 files re-hashed (the entry-chunk filename cascade priced in car 1).

## GATES AT THE COMPOSED TIP
| gate | result |
|---|---|
| `npm run typecheck:ratchet` | **OK — no type regressions (173 errors, ceiling 173)** — after car 5b; it was RED before, and the gate is what found it |
| `vendorPdfLazy` (VERIFY_DIST=1) | 42 passed |
| `engineChunkLazy` (VERIFY_DIST=1) | 15 passed |
| `livingContentSeamLazy` | 6 passed |
| `generationWorkerLazy` (VERIFY_DIST=1) | 10 passed |
| `customContentCharsetLazy` (VERIFY_DIST=1) | 9 passed |
| `densityCreateBoundary.walker` | 14 passed |
| `writerReach.walker` | 56 passed |
| `observedShapeReaders.walker` | 44 passed |
| `negativeAssertionAnchor.walker` | 9 passed |
| `layerBoundaries` | 3 passed |
| eslint on every touched file | clean |

## THE LAWS, HELD
- STATE, NEVER FATE. The dial stays at 1 (`NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION
  === DEFAULT_LIVING_CONTENT_LAW_VERSION`, asserted in two new test files).
- No tuning value moved · no golden re-recorded (the same-seed proof is a live
  CONTROL, not a fixture) · no register `--write` · no signature · no
  `supabase/applied-head.json` byte · **no migration file** · `ARCHITECTURE.md`
  untouched · nothing pushed · no `git stash` · every commit staged with explicit
  paths · trailers `Seat: Opus 5 — Fable-unvalidated` + `Lane: L-MAT` on all six.
- The lighting census is the chair's at the landing; this lane adds three new test
  files with literal `it(...)` titles and no `it.each` (the each-family park debt is
  untouched).

## DEFERRED — THE FULL LIST (documented, not bugs to re-find)
1. **The DM-full projection does not drop the roster** (car 4). Needs a
   `_gallery_dm_full_json` SQL twin; inert while the dial is dark; **lighting the
   dial reds `livingContentRosterPublicDrop.test.js` by design.**
2. **The reconciliation boundary does not remap the roster** (car 5), and
   `customContentProvenance` has the identical pre-existing gap there. Written into
   `livingContentRoster.js`'s own header. The pair belongs to one car.
3. **O-11 path 3 is unbuilt** (car 6) — the six inherited findings above.
4. **The sample-fork path is a marker carrier the day the dial lights**
   (`FoundingWorlds.jsx` + the underscore-family admission).
5. **`updateConfig` does NOT drop `_livingContentLawVersion`** — the underscore
   family is admitted by prefix. Recorded and pinned in
   `livingContentLawWiring.test.js`; the promise does not rest on it.

---

# L-MAT-FIX (cars 7–9) — **PARTIAL (in flight)**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: L-MAT-FIX · chair Fable 5.1 session 8de5f153 ·
brief `$SC/briefs/brief-L-MAT-FIX.md`, drafted from `$SC/skeptic-912/FOLD.md` (six-lens pass
`wf_a4deb4b0-511`)⟧

## ARRIVAL CHECK (2026-09-07 12:17:29 EDT, from `date`) — PASS
| item | required | measured |
|---|---|---|
| dock HEAD | `7d96e2b72245fa465182d59dade31621f31ecf2c` | `7d96e2b72245fa465182d59dade31621f31ecf2c` ✔ |
| `git status --porcelain \| wc -l` | 0 | 0 ✔ |
| `ls node_modules \| wc -l` | ≈453–454 | 452 (non-hidden; `ls -A` = 454) ✔ |
| `$SC/HOLD-VITEST` | absent | absent ✔ |

## ARRIVAL CHECK #2 — THE RE-DISPATCHED LANE (2026-09-07 18:45:02 EDT, from `date`) — PASS
The lane above died with its session mid-car-7, leaving 13 files uncommitted. This is the
successor's own arrival, taken before touching anything.

| item | required | measured |
|---|---|---|
| dock HEAD | `7d96e2b72245fa465182d59dade31621f31ecf2c` | `7d96e2b72245fa465182d59dade31621f31ecf2c` ✔ |
| `git status --porcelain` | the predecessor's 13 lines | 13 (7 src + 6 test), exactly the chair's list ✔ |
| `ls -A node_modules \| wc -l` | ≈453–454 | **455** — ⚠ +1 against the brief's window; no install was run by this lane, and the walkers that read the tree are green, so it is recorded, not acted on |
| `$SC/HOLD-VITEST` | absent | absent ✔ |
| `pgrep -fl vitest \| grep -v gate-mutex \| wc -l` | 0 | 0 ✔ |

## STATUS: **COMPLETE** — cars 7 (`f46ba7846`), 8 (`2fd5a380e`) and 9 (`19642a9fc`) all landed. Dock tip `19642a9fc`, porcelain 0.

---

## CAR 7 — BEHAVIOUR (sha `f46ba7846`, 2026-09-07 ~19:1x EDT) — DEF-1…DEF-5
The predecessor's uncommitted work was read file by file against the brief, re-proved, and
**one item re-cut** (DEF-3, below) before it was committed as this lane's car. Nothing was
discarded; nothing unaccounted-for was found.

| DEF | measured BEFORE | measured AFTER |
|---|---|---|
| 1 | the gallery ingest copied `customContentRoster`, `customContentProvenance` and `_livingContentLawVersion` from a foreign account's dossier into the importer's library, on BOTH gallery paths | `scrubGalleryImportLivingContent` in `importScrub.js` drops all three on both paths; reference-identical when there is nothing to strip |
| 2 | a LIT marker hydrated by the Library's Load reached `birthConfig` unclamped and minted a roster **on a shipped dark build** (the fold's `probe-chain.mjs`) | the marker is destructured off before the mint spreads; the born world carries no marker and no roster, through the real pipeline. Dial LIT still births v2 — armed in both directions |
| 3 | a foreign roster + provenance receipt reached `normalizedInput` and therefore persistence, unwarned | both dropped before the entry freezes, one `unsupported` issue each, `settlement_content_record_unmappable` |
| 4 | after a correctly remapped import, one `revertToSnapshotAction` re-persisted the SOURCE roster (`"src-secret-def"`) | every `versionHistory[i].settlement` takes the same remap-or-drop; the revert restores the destination record, or nothing |
| 5 | a fully localUid-mapped roster returned `..._identity_incomplete` and the WHOLE roster dropped | a local-only row is carried; an unresolvable localUid still refuses the whole roster; an empty-string `customDefinitionId` is not an identity claim |

**CONFIRMED (executed):** every row above has an arm; all fifteen focused files were run one
at a time with the exit captured in-shell before any pipe.

### ⚠ REFUSAL 5 — DEF-1's marker drop is GALLERY-SCOPED, not `scrubImportedConfig`'s
The brief asks for `_livingContentLawVersion` in `scrubImportedConfig`'s destructured drop
list. **Refused with the measurement:** that destructure is shared by all three import paths
(`importScrub.test.js`'s store-4 block pins it), and on the ACCOUNT path the marker is a saved
world's own immutable birth law. Dropping it there reclassifies a v2 world as v1 while the
account remap keeps its roster — the two halves would then disagree about the same world. The
strip is a gallery-scoped sibling instead, and the refusal is itself pinned by an arm
(`⛔ THE ACCOUNT PATH KEEPS THE MARKER`) asserting `prepareSettlementEntry` still returns the
marker at 2. Predecessor's call; re-derived and adopted by this lane.

### ⚠ THE DEF-3 RE-CUT — a chair-permitted DROP replaces the predecessor's REMAP, on two measurements
The predecessor implemented DEF-3 by importing the two account-importer remappers into
`importReconciliationAdmission.js`. That reds **two shrink-only instruments**, both measured:

1. **`writerReach.walker` — 55 passed / 1 FAILED.** Control taken the hard way: with the seven
   src files restored to HEAD by `git show HEAD:<path>` the same walker is **56 passed**, and the
   car-7 bytes restored by md5-verified `cp` reproduce the red. A closure probe over
   `surfaceClosures` located it exactly — the remapper import added three modules to
   `web-transitive` (`accountSettlementContentPortability.js`, `settlementContentProvenance.js`,
   `livingContentLawVersion.js`), and `settlementContentProvenance.js` reads `.source` on stress
   items, so `source on stress` moved `web-transitive=N → R` against a frozen baseline
   (`scripts/.writer-reach-baseline.json`) this lane may not write.
2. **`observedShapeReaders.walker` — 42 passed / 2 FAILED**, identities 1397→1399, reads
   1972→1974. `src/lib/importReconciliationAdmission.js` holds a frozen row for
   `importedFrom on settlement`, so the resolver binds `settlement`-shaped receivers in this
   file; `settlement.customContentRoster != null` scored as a reader-with-no-writer, and that
   baseline is shrink-only **by construction** (`--write` refuses to add an identity).

**The ruling.** R-F says the two records are "remapped-or-dropped" there, and the fold's own
DEF-3 smallest cure names dropping both as an option. At this boundary the two are
**behaviourally identical today** — a reconciliation source is an export FILE with no archive,
no receipt and no pack, so the only constructible identity map is the empty
`archiveBacked:false` default and every non-null record refuses anyway. The drop is therefore
the same outcome without dragging two modules into the web closure for no behavioural
difference, and it states the same rule the gallery strip states one file away. The
`Object.hasOwn` condition (rather than a value read) is the second half of the same decision.
Both are argued at the site, not just here. **After the re-cut: `writerReach.walker` 56 passed,
`observedShapeReaders.walker` 44 passed, closure diff vs HEAD = `livingContentLawVersion.js`
alone (a constants leaf that reads no field).**

⚠ This is a LANE JUDGMENT inside a chair ruling's stated latitude, not a refusal of R-F: both
records are still cured, together, on that path. It is vetoable — if the chair wants the shared
remappers on this boundary regardless, the price is a `writer-reach --write` re-freeze of one
string and an OSR row that the OSR baseline cannot lawfully take at all.

### THE PROMISE — the paths car 7 touches, each with the arm that proves it
| path | arm |
|---|---|
| create | `⛔ CREATE (THE CLAMP)` + `⛔ THE CLAMP DOES NOT DEFEAT THE MINT` (`livingContentLawWiring`) |
| read / regenerate | the dark arms and the same-seed control, unchanged and re-run green |
| persist | `DEF-3 — reconciliation drops what it cannot re-address` (`normalizedInput`) |
| undo | `a v3 ARCHIVE envelope remaps the SNAPSHOT roster too` + the no-archive twin (`accountImportSlice`) |
| import (gallery) | `⛔ DEF-1: a foreign scope record never lands in the importer's library` |
| import (account) | `⛔ THE ACCOUNT PATH KEEPS THE MARKER` + the DEF-5 quartet |
| public / DM share | unchanged in car 7; `livingContentRosterPublicDrop` 6 passed as a regression control |

### DEFERRED from car 7 (documented, not bugs to re-find)
- **`node_modules` reads 455**, one above the brief's window. Not acted on: no install was run
  by this lane and every tree-reading walker is green.
- **The OSR/writer-reach instruments are blind to import boundaries by construction** — their
  corpus is GENERATED worlds, which carry neither exactness record while the dial is dormant.
  Any future cure that READS these keys in a file whose receivers resolve will meet the same
  wall. Recorded at the site in `importReconciliationAdmission.js`.

---

## CAR 8 — INSTRUMENTS (sha `2fd5a380e`) — DEF-6 · DEF-7 · DEF-8 · DEF-9 · R-G · U1

| item | measured BEFORE | measured AFTER |
|---|---|---|
| DEF-6 | a loop asserting every `Object.keys(PIPELINE_REACHERS)` key is in `scanned` — a set built two statements above by spreading those keys. TRUE FOR EVERY TREE | deleted, with the tautology named in place; the `toContain('settlementGenerateAction.js')` assertion beneath it is kept and can die. The stray message now names the DIAL when the dial matched |
| DEF-7 | `expect(rosterKeys.length).toBeGreaterThan(6)` over an 11-name hand literal | the key set is derived from the roster the file generates; the count is read off the real row and anchored on `CUSTOM_DEFINITION_IDENTITY_KEYS` |
| DEF-8 | THE STOP arm returned identical results with the LIT store config and the dark one — `regenNPCsPipeline` never returns `config`, so all three post-conditions were untouchable | a positive control asserts the regen really rewrote `npcs` first; the read-order claim is re-pointed at the walker's source-text arm, which can fail |
| DEF-9 | arms 2/3 used bare `KEY in pub`, invisible to `negativeAssertionAnchor.walker` | both go through `expectAbsentWithAnchor` with `config` as the anchor. **No per-file budget moved** — the helper form is not a bare negative (walker 9 passed, budgets EXACT) |
| R-G | `toPublicSafe(s,{full:true})` carried BOTH records through a DM share | both deleted beside `dmNotes` / `_seed` / `_regenSeed` / `_config` / `latentPantheon` |

### R-G — THE SHARE MODEL WAS READ BEFORE EDITING, AS THE RULING REQUIRES
R-G's refusal condition is "if the full path is meant to carry the roster to the DM's OWN
other device". It is not. `ShareToGallery.jsx` states the opt-in in the owner's own words:
`gallery_share_dm` makes "Secrets, plot hooks, NPC goals and relationships, your DM notes,
and the DM Compass … **publicly visible to anyone who opens this gallery page**". It is a
PUBLICATION switch. No reader of a full share is entitled to the author's unadopted
homebrew library, and no surface reads either key off a shared dossier — so the client half
lands and nothing is lost to any reader. **Not refused.**

⚠ **OWNER-GATED, STILL OWED:** the SQL twin. `_gallery_dm_full_json` (supabase migrations
120/129) re-issues both keys server-side, so a DM-shared dossier read back from the server
still carries them. That sentence is now in the DM-full arm's failure message, the file
header, and this row. No migration file was written.

### U1 — THE PLANT THE FOLD COULD NOT TAKE (L4's cover, MEASURED not reasoned)
Planted `newSettlementLivingContentLaw` in `src/workers/customContentPreview.worker.js`,
a declared **PREVIEW** reacher, so both arms are in scope. Restored by `cp`, never `git checkout`.

| state | md5 of the planted file | `densityCreateBoundary.walker` |
|---|---|---|
| clean | `ad11078ef07775df072388722646f0f9` | **14 passed** |
| planted | `25475df5a41a40a99aeb835ad534a3c5` | **12 passed / 2 FAILED** — `every BIRTH mints the law, and nothing else does` · `the mint is not named outside its homes and its declared BIRTH callers` |
| restored | `ad11078ef07775df072388722646f0f9` | **14 passed** |

CONFIRMED: the `:251`/`:280` arms really do cover the mint L4 added, in both directions.

---

## CAR 9 — TEXT (sha `19642a9fc`) — DEF-10 · DEF-11 · DEF-12 · DEF-13 · R-I · R-J · X8

| item | the false sentence | what it says now |
|---|---|---|
| DEF-10 | "every emitted dist file stayed byte-identical", at the docblock AND inside the executable `GENERATION_LAWS.livingContent` `why` string a walker reads | "no emitted dist file changed SIZE", with the real figures (658 of 1,377 changed BYTES; 0 changed size) and the reason (the entry chunk's hash moves and every file naming it is re-hashed) |
| DEF-11 | "Nothing anywhere hydrates it from a saved settlement", re-shipped at THREE sites | all three name the Library's Load hop and the CLAMP as the reason it is harmless: `densityCreateBoundary.js`, `settlementGenerateAction.js`, `livingContentLawWiring.test.js` |
| DEF-12 | "nothing in `src/` READS the key", citing a header car 5 had already amended | "exactly ONE reader, the account-import remap", with the correction named |
| DEF-13 / R-J | the DM-full arm's premise blamed the DIAL and its message promised a leak | re-anchored on the SQL twin AND on the outage (car 8's arm carries it; car 9 adds the header) |

### R-J — THE OUTAGE, RE-DERIVED BY THIS LANE AND RECORDED IN FOUR PLACES
Not taken on report. My own grep: `loadLivingContentRoster` occurs in `src/` **exactly twice** —
its definition (`livingContentSeam.js:92`) and one comment (`:64`). No caller. The throw is at
`:111`. So **lighting the dial does not produce leaky worlds, it produces NO worlds**:
`[livingContentSeam] v2 world, roster payload not loaded`, out of `generateSettlementPipeline`.
Homes: `livingContentRoster.js`'s header (first paragraph, ⛔⛔), the wiring test's docblock,
the seam-arming comment whose "the same path production takes" was a false friend (now
"WOULD take"), and the DM-full arm's failure message.
**This is the TRUE ground of every inertness claim in the estate — the dial is not**, because
the gate is `materializesLivingContent(settlement.config)`, the WORLD's config, which an
import file can satisfy with no dial moving. RECORDED, NOT CURED (wiring the loader is the
lighting car's first task, and it is a capability change, not a repair).

### X8 — the walker limitation, recorded and NOT widened
`writerReach.walker` probes `read(row.writer)` for the register row's single declared writer,
so its 56-green says nothing about the second assignment site car 5 created at
`accountImportBody.js` — now a third, from §912's version-history loop. Written into the
roster header. The walker is deliberately not widened in this lane.

### R-I — CAR 6 / R-C STAYS REFUSED AND UNBUILT. NO BYTES.
Recorded as ruled. The four options, not the two the lane weighed:
1. **wide** (`contentHash` in the triple) — refuted by the F2c tripwire on all 26 blind cases;
2. **narrow** (`definitionId` + `revisionId`) — clears the tripwire, and the lane's reason for
   rejecting it is **REFUTED**: the product's `makeContentRevision` is CONTENT-ADDRESSED
   (`revision:${definitionId}:${number}:${contentHash.slice(0,16)}`), so the narrow digest is
   not blind in the product — **the blindness belonged to the fixture**, which hand-wrote
   `revision:<bucket>:<localUid>:1`;
3. **`{ lawVersion }` alone**, no `rosterHash` — presentation-invariant, keeps R-C's byte claim,
   defers the hash-contract question rather than deciding it wrongly. **The chair's recommendation.**
4. re-cut the F2c escape filter — the receipt is not one of the six `LIVING_CONTENT_ADOPTION_SURFACES`.

⛔ **AND THE FACT THAT OUTRANKS ALL FOUR:** `buildSettlementContentProvenance` returns `null`
for a world with only a roster, so **no receipt exists to carry the marker** on the very worlds
R-C targets. Shipping any key onto the persisted, hash-validated receipt is a persistence-shape
change and stays **OWNER-GATED** whichever digest is chosen — and the owner should be told,
before approving a key sold as tamper-evidence, that neither candidate is tamper-evident over a
persisted roster row (the row's hash is a copied string, never recomputed).

### X12 / X13 — receipt corrections carried from the fold
- **X12:** the `MINT_HOMES` helpers-row deletion landed in **car 1** (`442c7f988`), not car 3.
- **X13:** "Build A — BASE … 11:58:11" is a typo; `build-base.meta` reads **10:58:11**.

---

## THE CONSIST PROOF AT THE COMPOSED TIP `19642a9fc`

| gate | result |
|---|---|
| `npm run typecheck:ratchet` | **exit 0 — 173 errors / ceiling 173.** No source shipped a type error; the baseline was not touched |
| eslint, all 18 touched files | **exit 0, clean** |
| livingContentLawWiring | 12 passed |
| livingContentRosterPublicDrop | 6 passed |
| densityCreateBoundary.walker | 14 passed |
| accountSettlementContentPortability | 17 passed |
| accountImportSlice | 26 passed |
| accountImport | 31 passed |
| importScrub | 13 passed |
| campaignSlice.galleryImport | 6 passed |
| importReconciliation | 18 passed |
| negativeAssertionAnchor.walker | 9 passed — **budgets EXACT** |
| writerReach.walker | 56 passed |
| observedShapeReaders.walker | 44 passed (and `check-observed-shape-readers` = 1972, exactly the frozen inventory) |
| livingContentSeamLazy | 6 passed |
| layerBoundaries | 3 passed |
| engineChunkLazy (VERIFY_DIST=1) | 15 passed |
| generationWorkerLazy (VERIFY_DIST=1) | 10 passed |
| customContentCharsetLazy (VERIFY_DIST=1) | 9 passed |
| vendorPdfLazy (VERIFY_DIST=1) | 42 passed |
| whole-suite run | **NOT RUN**, as the brief requires — the chair's proof and gate do that |

### ⚠⚠ THE BUILD — AND A BEHAVIOUR SHIFT THIS LANE WILL NOT LET RIDE SILENTLY
Car 7 added static import edges, so the build was judged needed. **TWO builds** were taken (a
control at base content restored by `git show 7d96e2b72:<path>`, then the tip restored by
md5-verified `cp`; porcelain 0 and HEAD `19642a9fc` re-verified after).

| figure | BASE (`7d96e2b72` content) | TIP (`19642a9fc`) | delta |
|---|---|---|---|
| first-paint closure RAW | **1,042,086** / 1,048,000 | **1,042,122** / 1,048,000 | **+36 B** (margin 5,914 → 5,878) |
| gzip | 330,813 / 337,000 | 330,822 / 337,000 | +9 B |
| Brotli | 277,727 / 283,000 | 277,755 / 283,000 | +28 B |
| entry chunk | 570,269 | 570,296 | +27 B |
| `engine-core` | 126,452 | 126,461 | +9 B |
| the other six closure chunks | — | — | **byte-identical** |
| emitted files | 1,377 | 1,377 | 0 |

⭐ **THE CONSIST NO LONGER COSTS ZERO FIRST-PAINT BYTES. It costs 36, and that is stated
rather than rounded away.** The base control reproduces the receipt's recorded 1,042,086
EXACTLY, so the delta is this lane's and nothing else's.

**WHAT THE 36 BYTES ARE — measured, not inferred.** A character-level diff of `engine-core`
base vs tip puts the ONLY divergence inside its `export{…}` alias list, at char 125,402: one
additional exported symbol, shifting the alias sequence. It is cross-chunk plumbing for the
`livingContentLawVersion.js` leaf, which car 7 gave a second importer in a different chunk
(`importScrub.js` alongside `densityCreateBoundary.js`); the entry chunk's +27 is the matching
import-map entry. **NO living-content CODE entered first paint:** `customContentRoster`,
`customContentProvenance` and `_livingContentLawVersion` appear **zero times** in all eight
first-paint chunks, and every carrier is a LAZY chunk (`engine-*`, the two workers,
`importScrub-*`, `publicSafe-*`, `accountImportBody-*`, `StructuredCampaignReconciliation-*`).
Build determinism re-controlled in passing: the two tip builds produced identical chunk hashes.

## THE LAWS, HELD (cars 7–9)
- **STATE, NEVER FATE.** Dial still at 1. No tuning value · no golden re-recorded · **no
  register `--write`** (and the DEF-3 re-cut exists precisely so none was needed) · no
  signature · no `supabase/applied-head.json` byte · **no migration file** · `ARCHITECTURE.md`
  untouched · nothing pushed · no `git stash` · every commit staged with EXPLICIT paths ·
  trailers `Seat: Opus 5 — Fable-unvalidated` + `Lane: L-MAT-FIX` on all three.
- **THE PROMISE re-proven by execution** on create · create/clamp · read · regenerate ·
  undo · persist · clone · import (account, gallery ×2, reconciliation) · DM share ·
  public share — each with the arm named in the car-7 and car-8 tables above.
- Two out-of-tree measurements (the HEAD control, the L4 plant) restored by `cp` with md5
  verification on both sides; `git checkout` was never used on a tracked file.

## DEFERRED — cars 7–9 (documented, not bugs to re-find)
1. **R-J: `loadLivingContentRoster` has no caller.** Lighting the dial takes generation DOWN.
   Recorded in four places; wiring it is the lighting car's first task. **Not cured here.**
2. **The DM-full SQL twin** (`_gallery_dm_full_json`, migrations 120/129) — OWNER-GATED.
   Client half landed; server half still re-issues both keys.
3. **R-I / car 6** — refused and unbuilt; four options and the outranking fact above.
4. **X8's walker hole** — `writerReach.walker` reads one declared writer per row and cannot
   see the second and third assignment sites. Recorded, not widened.
5. **The three named walker holes from the fold** remain, largest `settlementSlice.js:45`
   (a live dynamic-import pipeline reacher the create-boundary scan cannot see).
6. **The OSR and writer-reach instruments are blind to import boundaries by construction** —
   their corpus is GENERATED worlds, which carry neither exactness record while the dial is
   dormant. Any future cure that READS these keys on a resolving receiver meets the same wall.
7. **`node_modules` reads 455**, one above the brief's 453–454 window. No install was run by
   this lane; every tree-reading walker is green.
8. **+36 first-paint bytes** (above) — accepted, measured, inside budget by 5,878 B.


---

## CAR 10 — THE SKEPTIC'S CURES

⟦Seat: Opus 5 — Fable-unvalidated (implementer) · Lane L-MAT-FIX · chair Fable 5.1 (session
5540cfd2) · brief: `$SC/skeptic-913/FOLD.md`, all twenty cures ACCEPTED by the chair as the fold
states them⟧

### ARRIVAL CHECK (2026-09-07 19:50:19 EDT, from `date`) — PASS
| gate | reading |
|---|---|
| dock HEAD | `19642a9fce0817213040af0a0815ac5ced09fbbb` — the briefed tip |
| `git status --porcelain \| wc -l` | **0** |
| `ls -A node_modules \| wc -l` | **455** (the three hidden entries are `.bin`, `.vite`, `.vite-temp` — C16) |
| `$SC/HOLD-VITEST` | **absent** |
| `pgrep -fl vitest \| grep -v gate-mutex \| wc -l` | **0** |

### THE SPLIT THIS CAR SHIPS
**Bytes:** C1–C8 (§2.A of the fold) — the smallest cure each, verified against the tip by SYMBOL
before editing, never by the fold's line number. **Receipt only:** C9–C20, written below as
numbered X-corrections that supersede the earlier sentences without deleting them.

### ⭐ C1 — THE MEASUREMENT TAKEN *BEFORE* THE EDIT (the arm must be green AND failable)
The unconditional form can only land if all five identity keys really are on the generated rows;
otherwise the cure would red the file and the refusal, not the edit, would be the result. Probe run
read-only against the dock (`$SC5/car10/c1-failability.mjs`, dock cwd, no dock byte moved), the
test's own `litSettlement()` reproduced:

```
IDENTITY KEYS (5): customDefinitionId, customDefinitionRevisionId,
                   customDefinitionContentHash, customDefinitionVersion,
                   customDefinitionFingerprint
rows = 4 | rosterKeys = 33 | every key present on a row AND in rosterKeys
UNCONDITIONAL ASSERTION AT THE TIP = GREEN
```
And the negative control — the regression the fold says the guarded form silently permits, run
once per key (drop that identifier from every row, recompute `rosterKeys`):

```
DROP customDefinitionId          | OLD guarded arm fires = false (SILENTLY GREEN) | NEW = RED
DROP customDefinitionRevisionId  | OLD guarded arm fires = false (SILENTLY GREEN) | NEW = RED
DROP customDefinitionContentHash | OLD guarded arm fires = false (SILENTLY GREEN) | NEW = RED
DROP customDefinitionVersion     | OLD guarded arm fires = false (SILENTLY GREEN) | NEW = RED
DROP customDefinitionFingerprint | OLD guarded arm fires = false (SILENTLY GREEN) | NEW = RED
```
**5 of 5.** The old arm went green on every one of the five regressions it claimed to guard; the
new one reds on every one. The fold's HIGH is confirmed by execution, not by reading.

### THE EIGHT SHIPPED CURES — cited by SYMBOL, each verified against the tip before editing
Every fold line number was re-derived at `19642a9fc` before the edit; all eight resolved, and the
citations below are by symbol because a line number in a fold is a hypothesis.

| # | site (by symbol) | what changed |
|---|---|---|
| **C1** | `livingContentRosterPublicDrop.test.js`, the arm "the deeper denylist would strip NOTHING here" — the block commented "Non-vacuity for the census itself" | the guarded `if`/`for` over `CUSTOM_DEFINITION_IDENTITY_KEYS` DELETED; one unconditional `expect(rosterKeys).toEqual(expect.arrayContaining(CUSTOM_DEFINITION_IDENTITY_KEYS))` in its place, with the tautology named and the 5-of-5 measurement recorded beside it |
| **C2** | `densityCreateBoundary.js`, `PIPELINE_REACHERS['src/store/settlementGenerateAction.js'].why` | the false hydration clause replaced by the Library Load hop (`updateConfig(migrateConfig(data.settlement?._config \|\| data.config))`, `_`-prefix admission) + the CLAMP in `birthConfig`. One string; no logic byte moved |
| **C3** | `densityLaw.js`, the "⭐ THE FLIP IS NOW ONE LINE" header paragraph | the claim that had been presented as overturned-on-executed-evidence is now itself corrected: the hop hydrates `_`-prefixed keys, and the CLAMP — not an absence — is why the birth is unambiguous |
| **C4** | `livingContentLaw.js`, the "⛔⛔ THE BLOCKER THAT HELD THIS UNWIRED WAS BYTES" paragraph | car 9's own substitution: no emitted dist file changed SIZE (658 of 1,377 changed BYTES). The third and last home of that wording |
| **C5** | `livingContentMaterialization.test.js` — the REGISTRY-half comment and the "⛔ THE SEAM MUST BE ARMED" comment | "takes" → "WOULD take" at both, plus the one-sentence tense ground car 9 wrote in the sibling file |
| **C6** | `publicSafe.js` (the "⚠ THE SERVER TWIN IS NOT LANDED" comment) and `livingContentRosterPublicDrop.test.js` (header, DM-full arm comment, DM-full failure message) | `120/129` → **`121/129`** at all four. The file now agrees with its own two other citations; grep for `120/129` under `src/`+`tests/` returns **0** |
| **C7** | `livingContentRosterPublicDrop.test.js` header, the "⭐ WHY THE DROP IS THE RULING" paragraph | the line-number citation replaced by the marker — the "⚠ AMENDED (lane L-MAT, O-11 path 2)" paragraph of `livingContentRoster.js` — with the decay recorded so the next hand does not re-commit it |
| **C8** | `livingContentRoster.js` (the "⛔⛔ READ THIS FIRST" paragraph), `livingContentLawWiring.test.js` (the "⛔⛔ AND THE FACT THAT OUTRANKS" docblock), `livingContentRosterPublicDrop.test.js` (the "⛔⛔ AND THE ONE FACT A LIGHTING ENGINEER MEETS" header) | the self-falsifying occurrence count deleted at all three; the load-bearing fact — **nothing in `src/` calls it** — kept and sharpened |

**Eight files, 67 insertions / 24 deletions.** Five `src/` (four comment-only, one — `publicSafe.js` —
a single citation digit); three `tests/` (one assertion changed, the rest comment). **No logic byte
moved anywhere except C1's four lines → one.**

### THE PROOFS — every one executed from the dock, one file at a time, exit captured in-shell
| gate | result | exit |
|---|---|---|
| `tests/security/livingContentRosterPublicDrop.test.js` | **6 passed** | **0** |
| `tests/domain/livingContentLawWiring.test.js` | **12 passed** | **0** |
| `tests/domain/livingContentMaterialization.test.js` | **11 passed** | **0** |
| `tests/lint/negativeAssertionAnchor.walker.test.js` | **9 passed — budgets EXACT** (the walker enforces per-file equality, so green IS the budget claim; C1 replaced a bare loop and moved no row) | **0** |
| `tests/lint/densityCreateBoundary.walker.test.js` | **14 passed** | **0** |
| `tests/lint/writerReach.walker.test.js` | **56 passed** | **0** |
| `tests/lint/observedShapeReaders.walker.test.js` | **44 passed** | **0** |
| `tests/domain/display/publicSafe.test.js` (touched src, run though not briefed) | **26 passed** | **0** |
| `npm run typecheck:ratchet` | `OK — no type regressions (173 error(s), ceiling 173)`; baseline md5 `0342f68be…` **identical before and after** | **0** |
| eslint, all 8 touched files | clean, no output | **0** |
| whole-suite / build | **NOT RUN** — the chair's, as the brief requires | — |

**No forbidden byte moved.** Diff paths matching lockfiles/baselines/goldens/migrations/applied-head/
ARCHITECTURE = **0**. The five frozen baselines read `0342f68be…` · `8c9ea0c40…` · `c4b5aec83…` ·
`917027c85…` · `7695cf1d8…`, each identical to the proof lens's recorded value. Untracked files: **0**
(no foreign WIP in the dock). Dial still 1; no `--write`, no migration, no golden, no push.

### X-CORRECTIONS X14–X25 (the fold's C9–C20) — THESE SUPERSEDE THE SENTENCES THEY NAME
The predecessor's text above is left standing, as X12/X13 were. Where a sentence above and a row
here disagree, **the row here is the fact** — each rests on a lens measurement recorded in
`$SC/skeptic-913/`, not on a re-reading of the receipt.

- **X14 (C9) — DEF-3, "every non-null record refuses anyway, byte for byte the same outcome" is
  FALSE.** The shipped DROP is **STRICTER** than the remap it replaced, and the constructible
  counterexample is named: a settlement-content provenance receipt with **ZERO**
  `materializedDefinitions` returns `{ok:true}` and is carried back unchanged by the remap
  (`admitSettlementContentProvenance` caps the array at 2 000 and sets **no minimum**, so a
  hand-written import file can hold one); the drop deletes it and reports an issue. The RULING is
  not weakened by this — it is strengthened. Only the sentence was wrong.
- **X15 (C10) — the remapper import added TWO modules to `web-transitive`, not three** (897 → 899
  against HEAD): `accountSettlementContentPortability.js` + `settlementContentProvenance.js`. The
  third, `livingContentLawVersion.js`, is **DEF-1's own edge** and is present at the shipped tip;
  "three" was the car's total against HEAD, not the remapper's. The neighbouring sentence — closure
  diff vs HEAD = `livingContentLawVersion.js` alone, 898 = 897 + 1 — stands.
- **X16 (C11) — the DEF-1 BEFORE row needs "on a DM-shared dossier".** The default public
  projection is a 40-key **ALLOWLIST** (`_gallery_sanitize_public_json`) naming neither record, so a
  plain public dossier never carried them; the leak reached the ingest only through the DM-full
  opt-in. The severity is unchanged — it is the same SQL twin already booked as owed — but the
  sentence as written over-reached.
- **X17 (C12) — "inside the executable `why` string A WALKER READS" over-states the instrument.**
  The walker LENGTH-CHECKS `why`: its only `.why` assertions are `length > 40|60`. **No instrument
  in the estate reads the CONTENT of any `why` string** — and that is precisely why C2's false
  sentence survived a whole consist in a sibling `why` without reddening anything. **Recorded as an
  INSTRUMENT GAP, not a passing nuance:** shipped `why` prose is source DATA that no gate verifies.
- **X18 (C13) — R-I option 2's "REFUTED" label is STRUCK; the lane's original ground is RESTORED.**
  The content-addressed id in `makeContentRevision` is a `revisionId ||` **FALLBACK**
  (`customContentVersioning.js`), and the product's **only** caller
  (`customContentLocalLedger.js`) passes `revisionId: makeCustomContentUuid()` — `crypto.randomUUID()`.
  Every revision id the product mints is a random UUID, so **the narrow digest IS blind in the
  product**, on the product's only minting path. The fixture was faithful, not lying. HIGH: this is
  an input to an owner-gated persisted-shape decision.
- **X19 (C14) — "the fact that OUTRANKS all four" is qualified to the DEGENERATE CASE, and
  "outranks" is dropped.** `buildSettlementContentProvenance` returns null only when environment
  AND `bindingHash` AND `definitions.length` are ALL empty; a **reviewed environment** — the
  precondition for a roster existing at all — makes it non-null. The estate's own lit fixture is the
  counterexample: `livingContentRosterPublicDrop.test.js` asserts BOTH the roster key and the
  provenance key truthy on one `litSettlement()`. It is one true observation about a degenerate
  world, not a fact that outranks the four options.
- **X20 (C15) — DEF-3's `Object.hasOwn` framing hid one BEHAVIOUR DIFFERENCE.** It is not purely
  instrument-avoidance: a settlement carrying `customContentRoster: null` (key present, value null)
  is now **deleted AND reported** `settlement_content_record_unmappable`, where a `!= null` read
  would have left it silent. Harmless — a null carries no source id — but a difference, and it
  belonged in the row.
- **X21 (C16) — `node_modules` 455 has a named cause and it is not a package.** `ls -A` 455 / `ls`
  452; the three hidden entries are `.bin`, `.vite`, `.vite-temp`, and the BASE dock's entry listing
  is **byte-identical by `diff`**. The 454 → 455 step is a hidden vite cache directory appearing.
  **No package entered the dock.** The old framing ("recorded, not acted on") left a reader
  suspecting a dependency had moved.
- **X22 (C17) — "WHAT THE 36 BYTES ARE — measured, not inferred" is DOWNGRADED, and so is the
  determinism control.** What is measured is the **LOCATION**: char 125,402 of `engine-core` falls
  inside its `export{…}` alias list (which begins at 124,583). The **CAUSATION is UNTESTED** — at
  the tip that leaf's constant lives in the lazy `engine-*` chunk, `engine-core` carries neither the
  literal nor `customContentRoster`, and `importScrub-*` imports nothing from `engine-core`. The
  claim that the two tip builds produced identical chunk hashes is likewise **UNTESTED** (a build is
  outside every lens's fences, and outside this car's). **Declare the shift; do not declare the cause.**
- **X23 (C18) — the `11:58:11` typo is now fixed IN PLACE** in the BUILD LISTINGS table above, not
  only in the X13 row ~500 lines below it. A correction a reader never reaches is not a correction.
- **X24 (C19) — see the DEFERRED row below: F1–F4 were the CURE'S INCOMPLETENESS, not deferrals.**
- **X25 (C20) — U1's PLANTED md5 `25475df5a41a40a99aeb835ad534a3c5` is CLAIMED, NOT VERIFIED.** It
  is a hash of a file that never existed in git; reproducing it needs a write into the dock, which
  every lens's fences and this car's forbid. The CLEAN digest `ad11078ef07775df072388722646f0f9`
  IS verified (dock, `git show` and worktree all agree), and the 12/2 arm cover is confirmed by
  derivation — but a successor must not read that one cell as a receipt.
- **X26 — THE CONSIST TABLE'S GREEN IS EIGHT-OF-NINETEEN RE-VERIFIED, NOT NINETEEN.** Of the 19
  gates in "THE CONSIST PROOF AT THE COMPOSED TIP", **11 were not re-run by any lens** (the text
  lens was fenced out by 4 live vitest processes, correctly). Eight were re-run and all matched.
  Car 10 re-ran five of the nineteen again at its own tip, all matching. The chair's whole-suite
  proof is what closes the remaining rows.

### ⚠ AN INSTRUMENT FINDING THIS CAR OWES THE NEXT LANE (met while holding the vitest fence)
`pgrep -f vitest` **MATCHES THE CALLER'S OWN COMMAND LINE.** When the gate check and the
`npx vitest run …` invocation live in ONE shell command, the shell and each forked subshell carry
that literal in `argv` and are counted as runners. This car read **9, 8, 12 and 4** "runners" at
moments when `ps -Ao pid,ppid,command` showed **ZERO** real vitest processes, and a 90-second settle
loop never converged because the loop itself was what it was counting. It costs a lane only false
REFUSALS (never a false green), but it burned four launches here.
**The cure, used for every run above:** put the invocation in a small script and call it, so the
caller's `argv` carries no literal — `sh run1.sh <file>`, gate checked inside. Read **8 of 8** true
zeroes afterwards. ⇒ **The fold's own recorded "38 processes six seconds after its own run finished"
is very likely this artifact rather than 38 live workers.** Recorded so the next lane does not
re-derive it at the same cost.

### OBSERVED, NOT CURED (outside the twenty — no bytes taken, per "a cure never widens scope")
1. **The shipped comment "The count is READ OFF THE REAL ROW"** (`livingContentRosterPublicDrop.test.js`,
   beside the C1 arm) over-sells the same way the fold's row 20 says the receipt sentence did: it is a
   `toBeGreaterThan` **THRESHOLD** against a derived number, not a read-off count. The fold rated it
   PARTLY and wrote no cure for it; this car did not widen scope to take one.
2. **"The key has exactly ONE reader in `src/`"** (same header) is true of one consuming FILE and not
   site-by-site — there are **three** read sites in `accountImportBody.js`, two of them added by cars
   7 and 9. The cited paragraph in `livingContentRoster.js` carries the qualifier ("Nothing reads the
   key for its CONTENT") that this header drops. Fold row 40, PARTLY, no cure written; recorded here
   so the next hand finds it rather than re-discovering it.

### DEFERRED — car 10 (documented, not bugs to re-find)
9. **F1–F4 WERE NOT DEFERRALS — THEY WERE THE CURE'S INCOMPLETENESS, and this car closed them.**
   Cars 9's DEF-10/DEF-11/DEF-13 each cured only the sites their fold enumerated; a tip-wide grep
   found the false hydration sentence still live in an executable `why` string **in the very file
   car 9 edited** (F1) and in a paragraph presenting it as earned on executed evidence (F2), the
   false byte-identical sentence at a third site (F3), and the "false friend" tense in a second
   seam-arming file (F4). None was in any DEFERRED list, header or row — a successor grepping the
   false sentence would have found it in shipped source and believed it. **Found by the §913 skeptic
   pass, cured here as C2–C5.** The lesson is the deferral: **a text cure applied site-by-site from
   an enumerated list is not a cure until the tip is grepped for the sentence itself.** Survivor
   greps for all four phrases now return only corrective quotations that name the wording as false.

## FOR THE OWNER
Three rows, in the fold's corrected form. The first two must not go forward as the receipt above
words them.
1. **The DM-full SQL twin — a real gap, client half only.** `_gallery_dm_full_json` still re-issues
   `customContentRoster` and `customContentProvenance` on every DM-shared dossier read back from the
   server; the client-side drop landed. Writing the migration is owner-gated. **The citation handed
   to whoever writes it was WRONG and is now fixed: the function body to amend is migration
   121/129, not 120** — 120 only calls it. Confirmed independently by two lenses and the fold.
2. **R-I — do not put this row in front of the owner until BOTH corrections are in it.** (a) The
   receipt tells the owner the narrow digest is not blind in the product; **it is** — the only
   minting path passes a random UUID (X18). (b) The "outranking fact" holds **only in the degenerate
   case**, and the estate's own lit fixture is a counterexample (X19). Any key added to the
   persisted, hash-validated receipt is a persistence-shape change and stays owner-gated.
3. **+36 first-paint bytes — a declared behaviour shift.** Real, priced, inside budget by 5,878 B,
   and the lane correctly refused to round it away. **Declare the shift; do NOT declare the cause** —
   the causal explanation and the determinism control are UNTESTED (X22).

### CAR 10 LANDED — `a75faa3a74b47431d1ad6939b0baeee95a9eeb8a` (2026-09-07 20:04 EDT)
| gate | reading |
|---|---|
| parent | `19642a9fce0817213040af0a0815ac5ced09fbbb` — the briefed tip, unmoved under it |
| dock tip | **`a75faa3a7`** — ten cars over the product tip `3b1c0eaa5` |
| `git status --porcelain \| wc -l` | **0** (before staging, after staging, after commit) |
| staged paths | the **8**, listed explicitly; `git add -A/-u/.` never used |
| trailers | `Seat: Opus 5 — Fable-unvalidated` · `Lane: L-MAT-FIX` · `Co-Authored-By: Claude Opus 5` |
| the five frozen baselines, after the commit | `0342f68be…` · `8c9ea0c40…` · `c4b5aec83…` · `917027c85…` · `7695cf1d8…` — all unmoved |
| untracked files | **0** at every boundary — no foreign WIP existed in this dock and none was created |

**REFUSALS: none.** All eight shipped cures resolved against the tip and landed as the fold's
smallest form; no cure contradicted a measurement. Two things were deliberately NOT done and are
recorded rather than silently skipped: the two "OBSERVED, NOT CURED" rows above (outside the twenty
— a cure never widens scope), and the whole-suite run and the build (the chair's, per the brief).
