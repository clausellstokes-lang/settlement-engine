# RECEIPT — LANE L-MAT — **PARTIAL** (in flight)
Seat: Opus 5 — Fable-unvalidated · Lane: L-MAT · Chair: Fable 5.1 (session 8de5f153)
Dock: $SC/laneLMAT · cut at 3b1c0eaa51f77561a036ae7ec54682c39856192c

## PREDECESSOR
Session b43943b4 arrived 2026-09-07 10:24:17 EDT, took the arrival check, wrote the header
of this file, and died with its session before writing a product byte. Its header block is
KEPT verbatim in the arrival section below (marked "predecessor"); its "CARS (none yet)" is
superseded. Successor session 8de5f153 arrived 2026-09-07 10:56:39 EDT (`date`).

## STATUS: PARTIAL — cars 1-5 landed; car 6 in flight.

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

Dock tip after car 5: `34115c7b7`. Porcelain 0.

## BUILD LISTINGS (the two the brief asks for; three builds taken, plus one control)
All builds `sh scripts/gate-mutex.sh --run -- npm run build`, exit 0, ~22 s each.

**Build A — BASE** `3b1c0eaa5`, 11:58:11→10:58:33 EDT. 1,377 emitted files.
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
