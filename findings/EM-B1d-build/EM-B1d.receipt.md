# EM-B1d — completion receipt (§12), filled BY EXECUTION

**Outcome: STOPPED, UNCOMMITTED, on three measured contradictions** (see `EM-B1d.STOP.md`).
The whole deliverable is built, staged and green apart from those three, each of which needs a
path the §7 change manifest does not declare. Nothing was improvised around them.

- **Lane:** Opus build lane, session 7d3418f8, 2026-09-19 (16:55–17:35 EDT).
- **Worktree / branch / HEAD:** `$SP/lane-em-b3b` · `fixes-2026-09-18-consist` · `58fcfe614`
  (unchanged start to finish; re-read in the dispatch command itself).
- **Seal:** `npm run implementation:dispatch -- EM-B1d` → **exit 0**,
  `sealDigest 43f1f69f87ca467176b9a88b2dabce1c12169e52077a36ed88d97b7dae1d41e6`,
  `capsuleDigest b170560a31ebc1b593c831ac7be2670f0eacc34d8b3931ba42e055fee6f38a1e`,
  verifiedBase `32f1ba048…`, verifiedBranch `fixes-2026-09-18-consist`. No refusal.
- **Preamble hash:** `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` reproduces
  `1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6` — equals the packet header. CONFIRMED.
- **Commit sha:** **NONE — no commit was made.** Final tree state: the eleven declared paths,
  all staged, nothing else modified, nothing untracked.

## 1 · Changed files and effective-line deltas (eslint `Linter`, `max-lines`, skipBlankLines + skipComments)

| file | before | after | delta | ≤3 |
|---|---:|---:|---:|---|
| `src/domain/entities/npcs.js` | 138 | 138 | **+0** | ✓ (JSDoc only) |
| `src/domain/density/factionLifecycle.js` | 61 | 61 | **+0** | ✓ (one token inside the frozen array) |
| `src/domain/entities/successors.js` | 52 | 53 | **+1** | ✓ |
| `src/domain/worldPulse/envoyCasting.js` | 92 | 94 | **+2** | ✓ (the import + the module-scope union read) |
| `src/domain/worldPulse/magicFormsPractitioner.js` | 70 | 70 | **+0** | ✓ |
| **total new/changed effective production lines** | | | **+3** of ≤15 | ✓ |
| `tests/lint/statusUnionTotality.walker.test.js` (CREATE) | — | **232** | of ≤250 | ✓ |

The five pre-edit figures reproduce the packet's §3.1 baseline (138/61/52/92/70) exactly. Five
production files modified of the narrowed override's five; handwritten 7 of ≤12; a sixth
production file was never needed. ⚠ The walker is **232 effective against the packet's ~110
estimate** (cap 250): the estimate did not price the derived-trigger scan, the five guard-the-guard
plants, or the A5/A6/A7 arms that call the real functions, all of which §9 requires and §7 confines
to this one leaf.

## 2 · Acceptance A1–A7, executed

`tests/lint/statusUnionTotality.walker.test.js` — ONE literal `describe`, FOUR straight-line
`test`, no `.each`, no loop/conditional/nested registration.

- **RED FIRST, quoted:** at the pre-edit tree the walker ran `Tests 4 failed (4)`, exit 1, for the
  right reasons — `NpcStatus moved … expected [… 3 more] to deeply equal [… 4 more]  -"jailed"`;
  `a file enumerates two or more non-active NpcStatus members and is not a declared enumerator row
  … +"src/domain/entities/successors.js" +"src/domain/worldPulse/envoyCasting.js"`; and
  `the active deputy is not eligible … expected ['npc.j','npc.a'] to deeply equal ['npc.a']`.
- **GREEN after the cures:** `Tests 4 passed (4)`, exit 0.
- **A1** union parses to exactly `active, dead, exiled, jailed, missing, removed, retired` (exact
  sorted list, not a length), all distinct; **`EntityStatus` asserted UNCHANGED at its five**
  (`active, destroyed, impaired, removed, vacant`); the walk is asserted non-empty first; the strip
  and the typedef parser are each proved in both directions.
- **A2/A4** all eight roster rows resolve live at path+symbol; **declared equals discovered, both
  directions**, over the enumerator shape; every literal row carries every non-`active` member or
  its named reasoned omission; dropping `jailed` from a synthetic enumerator is convicted by name.
- **A3** the trigger set is **DERIVED** (not authored) and measures exactly `{dead, exiled,
  retired}`; a floor arm reds on a set of one or none; every homonym must name ≥1 foreign
  vocabulary; **FLAGGED is SET-EQUAL both directions** to roster ∪ register; the register is empty
  and its checker is proved on a planted row; the three verdict files are asserted to still spell
  `'jailed'` and to still be unflagged; planting `'imprisoned'` or `'killed'` back into a cured row
  reds with `file:line`.
- **A5** a jailed NPC is ineligible in `inferSuccessors` and absent from `factionRosterOf`, through
  the real functions, anchored by an active deputy who IS eligible.
- **A6** `rosterPersonAvailable` admits an active person, refuses a jailed and a dead one, and its
  function body is proved to contain no status literal at all.
- **A7** goldens bytewise unchanged (below) and the inertness proved: **no writer in `src/` assigns
  `'jailed'` to a status**, with the writer matcher proved live on a planted writer first.

## 3 · Mutants (§P6) — five planted, five convicted, five restored digest-exact

Each proved to have moved the file's bytes before the run; each run under the gate mutex; each
restored by `cp` from a backup taken before the plant and verified by `cmp` + sha256 in the same
shell. **Never the checkout family.**

| # | plant | TRUE_EXIT | counts | titles reddened |
|---|---|---:|---|---|
| M1 | `ROSTER_ABSENT_STATUSES` loses `'jailed'` | 1 | 2 failed / 2 passed | A2/A4 **and** A5/A6/A7 |
| M2 | `LOST_NPC_STATUS` loses `'jailed'` | 1 | 1 failed / 3 passed | A2/A4 |
| M3 | `envoyCasting.js` regains `'imprisoned'` | 1 | 2 failed / 2 passed | A2/A4 **and** A5/A6/A7 |
| M4 | a FIFTH enumerator planted as a new `src/` file | 1 | 2 failed / 2 passed | A2/A4 **and** A3 |
| M5 | the typedef gains `'banished'` | 1 | 2 failed / 2 passed | A1 **and** A2/A4 |

Restoration digests: M1 `b5f086ea…01b85` · M2 `626d908e…0d48bc` · M3 `7bb21a24…b35bdc` ·
M5 `f20e54a9…787859`; M4's plant was an untracked file and is gone. Focused green after restore:
`Tests 4 passed (4)`, exit 0. The account above is copied verbatim into the manifest row.

## 4 · Registration

- **Mutation-coverage row:** 705 → **706**. Inserted **surgically**, anchored on the two sibling
  KEY NAMES: immediately after the close of `"tests/lint/dossierMountRegistry.walker.test.js"`
  (line 70) and immediately before `"tests/lint/stepPresentationEngineFence.walker.test.js"`
  (now line 78); the new key sits at line 74. `git diff --numstat` = **`4  0`** — a pure **+4 / −0**
  diff, the file was **not** re-serialised. `kind: rationale`, inline `rationale` of 2,088 chars
  carrying the executed mutant account.
- **Lighting census:** NOT refrozen, NOT edited — the train's terminal act, the chair's.

## 5 · Goldens and the instruments

- `tests/fixtures/generator-golden-master.json` `7177cd6e…7c8e8f1e` **before = after** ✓
- `tests/fixtures/dossier-prose-manifest-golden.json` `921c51cf…3bb4db41` **before = after** ✓
  `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` never set. **No golden moved.**
- **Writer-reach (P2.4, R2):** `node scripts/check-writer-reach.mjs` exit 0, before and after
  **byte-identical** — `WRWALKER HOLD — judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294
  (reviewable 495)` plus the same three pending-surface debt rows. **NO MOVEMENT** — neither growth
  (a STOP) nor a shrink (the chair's to bank). No baseline was written.
- **Observed-shape:** exit 0, before and after identical — `observed-shape readers: 1964 finding(s),
  exactly matching the frozen inventory.` No motion.
- `node scripts/implementation-packets.mjs validate` → exit 0, `valid: 188 packets (1 READY)` —
  the mutation-coverage path is free (the chair's EM-P2 withdrawal held).

## 6 · Typecheck, lint, gates (every count line)

| command | exit | counts |
|---|---:|---|
| `npx eslint` (the six touched files) | **0** | no output — zero problems |
| `npm run typecheck:ratchet` (`tsconfig.full.json`) | **0** | `OK — no type regressions (167 error(s), ceiling 167)` |
| `npm run typecheck:domain:strict` (`tsconfig.domain-strict.json`) | **0** | `✓ no strict-type regressions (1113 errors, ceiling 1113)` |
| lint battery: walker + mutationCoverageManifest + negativeAssertionAnchor | **0** | `Test Files 3 passed (3) · Tests 23 passed (23)` |
| property: generatorGoldenMaster + dossierProseManifest + npcs.property + 2 espionage dormancy | **0** | `Test Files 5 passed (5) · Tests 49 passed (49)` |
| domain: advanceWorkerByteIdentity + entities + successors + magicFormsPractitioner + espionageMission + roadsParticipation + envoyDiplomacy + assignNpcPreservesSheet + statusImpairmentSeverity + factionRefContract + warSeatBooks + npcLadderKernel | **1** | `Test Files 1 failed \| 11 passed (12) · Tests 1 failed \| 142 passed (143)` — **STOP-3** |
| generators: densityLaw + roleCategory | **1** | `Test Files 1 failed \| 1 passed (2) · Tests 1 failed \| 191 passed (192)` — **STOP-2** |
| copy: voiceMechanics | **0** | `Test Files 1 passed (1) · Tests 30 passed (30)` |
| edgeFunctions: 2 freshness + reproducibility | **1** | `Test Files 1 failed \| 2 passed (3) · Tests 1 failed \| 66 passed (67)` — **STOP-1** |
| blast-radius sweep: npcOps, npcStasisSnapshot, npcDmVerbs, npcVerdictApply, roadsState, envoyErrand, settlementLifecycleFirstClass | **0** | `Test Files 7 passed (7) · Tests 170 passed (170)` |
| roadsCharter · npcVerbs · warRemembranceReader | **0 · 0 · 0** | `15 passed` · `11 passed` · `21 passed` |
| `npm run check:packet -- EM-B1d` | **2** | refused: `sealed foreign work drifted for EM-B1d` (STOP-1) |
| `npm run implementation:resume -- EM-B1d` | **2** | same refusal, same cause |

Every vitest run went through `gate-mutex.sh --run` at the SHARED tier with `--maxWorkers=2`, one
test directory per run; every line above carries a printed count. `npm run check` was never run.

**Base-versus-wave failure identity diff:** three failures, all NEW, all caused by this packet, all
localized to two files outside the manifest plus the edge-shared window — enumerated in
`EM-B1d.STOP.md`. Nothing else in any battery moved.

## 7 · Edge-shared regeneration

`npm run build:edge-shared` run immediately after row 1, exit 0. `sourceHash`:

| bundle | before | after |
|---|---|---|
| `aiCharterBundle` | `237061fd5e0b3d71` | **`9f2efcbbfeacbc00`** |
| `aiOutputSchemaBundle` | `bac86bfd077b5b43` | **`d8552a2a4abcf75a`** |
| aiGrounding / analyticsEvents / intentAtlas | `9788abb8fdb7287e` / `0a6ba64ce0b8d5e2` / `9136e063f280d77f` | **unmoved** |

⚠ The packet predicted `f56a7d2120c34290` and `b44dd839381fd0c7`. Those are the pre-proof lane's
values for **its own** in-memory draft of row 1; freshness hashes every input's RAW SOURCE TEXT, so
any difference in the typedef's gloss bytes changes them. The staleness claim is confirmed; the
predicted literals are not reproducible and should not be treated as a pin.

Artifact sha256, before → after:

| artifact | before | after |
|---|---|---|
| `aiCharterBundle.js` | `ec8a5596…6e28ee` | `f7087c30…9e5bd1` |
| `aiCharterBundle.meta.json` | `7d04054e…182fb7` | `4d282cdf…e90ee7` |
| `aiOutputSchemaBundle.js` | `1496d5f8…231175` | `3e7074eb…1b43d6` |
| `aiOutputSchemaBundle.meta.json` | `ad151ee9…846072` | `9ab65461…c1fb4e` |

⛔ **SEVEN artifacts moved, not four** — see STOP-1.

## 8 · Byte budgets — a REAL build, and the delta is MEASURED, not estimated

`npm run build` through the EXCLUSIVE mutex: **exit 0**, `✓ built in 16.78s`, postbuild wrote 304
static route documents. A second build of the **base** tree (`git archive HEAD` into a throwaway
probe, deleted afterwards) supplies the comparison:

| figure | base | wave | delta | budget | verdict |
|---|---:|---:|---:|---|---|
| **first-paint static closure** | 1,039,235 | **1,039,230** | **−5 B (a SHRINK)** | `CLOSURE_BUDGET_BYTES = 1_048_000` | **8,770 B of margin** ✓ |
| **generation worker** | 1,401,208 | **1,401,208** | **±0** | `WORKER_BUNDLE_CEILING_BYTES = 1401208`, `<=`, zero slack | at the ceiling, unmoved ✓ |
| **lazy engine** | 677,935 | **677,935** | **±0** | `< 679_000` | 1,065 B of slack ✓ |

The generation worker is **byte-identical across both builds** (same emitted name
`generation.worker-ChvrnTyn.js`), which proves by construction that none of the five files entered
its closure. The engine chunk keeps its exact size; only its content hash moves, because it
references `engine-core`, whose hash moved. ⭐ The packet's stated ≤18 B bound is respected with
room to spare and in the safe direction — the `successors.js` union read gives back more than
`factionLifecycle.js`'s `, 'jailed'` costs. **No ceiling was re-minted and none would have reddened.**
⚠ The packet's "last ratification reading 1,047,205 (~795 B of margin)" is **stale by 8.0 kB** at
this tip; the live margin is 8,770 B.

`npm run verify:dist` run **BARE** with the long wait exported: **exit 0** —
`[test-ratchet] STRICT DIST OK — 59 discovered/reported file(s), 538 test(s), zero
failed/non-run/uncollected/missing/extra/duplicate rows.` **538**, matching the last green read.

## 9 · The lighting census (P2.1) — measured whole, never refrozen

Measured in a throwaway `git archive` probe of the **staged index tree** (`00e49de7e…`) OUTSIDE the
worktree, symlinked node_modules, the probe's own baseline copy walked forward one figure at a time
because the walker's five equalities are a sequential chain; the probe went GREEN at
`Tests 34 passed (34)` and was then **deleted**. The worktree's
`tests/lint/.lighting-census-baseline.json` was never touched.

| | files | parked | credited | titles | suiteTitles |
|---|---:|---:|---:|---:|---:|
| frozen baseline (EM-P0) | 2646 | 383 | 2263 | 25005 | 6671 |
| live at this tip (two un-refrozen landings) | 2648 | 383 | 2265 | 25015 | 6675 |
| **measured with this packet** | **2649** | **383** | **2266** | **25019** | **6676** |
| this packet's own delta | +1 | +0 | +1 | +4 | +1 |

**Exactly the declared delta, and exactly the chair's predicted whole tuple
`2649 · 383 · 2266 · 25019 · 6676`.** The interior red in the worktree, verbatim:
`the estate's file count moved — re-measure, do not re-word: expected 2649 to be 2646`
(`Test Files 1 failed (1) · Tests 1 failed | 33 passed (34)`). ⓘ The packet's §7 note predicted
`expected 2647 to be 2646`; the difference is exactly the two un-refrozen landings the chair named.

## 10 · Generated artifacts

**FOUR declared and produced** — `aiCharterBundle.js`, `aiCharterBundle.meta.json`,
`aiOutputSchemaBundle.js`, `aiOutputSchemaBundle.meta.json`. ⛔ **THREE MORE were produced by the
same command and are not declared** — `aiGroundingBundle.meta.json`, `analyticsEventsBundle.meta.json`,
`intentAtlasBundle.meta.json` (STOP-1). `dist/` is a build output and is ignored, not committed.

## 11 · Deviations, judgment calls, observations

**Deviations: STOP ×3** (`EM-B1d.STOP.md`). **Judgment calls: ONE, recorded for veto:**

⭐ **The walker's roster carries a `spelling` field, and the set-equality runs against its
literal-bearing rows.** §7 orders an 8-row roster (five edited + three found); §6's arms 1 and 2
demand the roster be SET-EQUAL to the flagged set and that every roster file still contain a trigger
token. Those cannot both hold, because the two cures §6 itself prefers (`successors.js` and
`envoyCasting.js` READ the union) remove every trigger literal from those files — measured: the
flagged set falls from 8 to 6. Rather than drop the two cured rows (losing the record that they are
cured) or weaken an arm, each row now DECLARES its spelling and the walker CHECKS it: a `literals`
row must be flagged, a `union-read` row must be unflagged, must import the union, and must spell no
retired foreign word. All eight rows stay, both directions still red, and a cured consumer that
regresses to hand-spelled literals now reds too — strictly stronger than the ruled sentence, which
is untouched. If the chair prefers the 6-row reading, it is a two-line edit.

**Noticed, not investigated, not touched:**
1. `factionLifecycle.js`'s own header rules that "an IRREVERSIBLE consequence may only be triggered
   by IRREVERSIBLE causes" — which is why `missing` and `retired` are PRESENT on the roster.
   `jailed` is **reversible** (a later decree frees the holder) yet the packet places it in
   `ROSTER_ABSENT_STATUSES`, so a house whose last figure is jailed will read as **dissolved**, a
   permanent outcome from a temporary cause. Implemented as ordered; the exception is now named in
   that file's header beside the rule it bends. Inert today (no writer), live the moment EM-B1a's
   `set-npc-status` lands — worth a chair line in EM-B1a or EM-B1f.
2. Reading `ROSTER_ABSENT_STATUSES` into `envoyCasting.js` adds `'removed'` to the dispatch refusal
   (it was not in the old list). Measured: **no writer in `src/` assigns `'removed'` to an NPC's
   `.status`** — the two `status: 'removed'` writers (`settlementLifecycleFirstClass.js:601`,
   `tierOutcomeApply.js:143`) both target institutions — so the addition is inert on existing data.
   It is the packet's own named spelling; recorded because §6 priced only the two retired spellings.
3. The packet's §3.2 quotes the worker ceiling as `1401128`; the live constant
   (`tests/build/generationWorkerLazy.test.js:159`) is **`1401208`**, as the chair's brief says. A
   transposition in the packet, not in the tree.
4. `EM-PREAMBLE.md` §P2 row 10 prices edge-shared INPUT membership but not the generator's
   re-stamping of every sibling meta — the gap STOP-1 rests on. A row 12 would close it for the
   whole EM family.
