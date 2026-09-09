# RECEIPT — lane LIGHT-PLAN (Opus 5, under Fable 5.1 chair)
## ⚠ STATUS: **COMPLETE** (opened as PARTIAL and updated after every proof). Everything below was actually
## executed and quoted; nothing is projected.

- Tree: `$SC/laneANCH2`, detached.
- HEAD **CONFIRMED**: `git -C $SC/laneANCH2 rev-parse HEAD` → `272dbd2da416343a6eac14bc50ac09abb69d53b8` (matches brief).
- Porcelain on arrival **CONFIRMED**: `git -C $SC/laneANCH2 status --porcelain | wc -l` → `0`.
- Fences honoured: no vitest, no `npm run`, no build, no writes to any git tree, no ref writes, no npm install.

## PROOF LOG (append-only)

### R1 · Sealed refs verified (CONFIRMED)
`git rev-parse --verify` in the main repo:
```
refs/preserve/session-kit-893-2026-09-04   3c491c6fd2e92cb2c2513e8c367719470d8e9b26
refs/preserve/session-kit-893b-2026-09-04  0348947392fcc253b0cc07871b4a6a4497fd8a8d
refs/preserve/srcprose-2026-09-03          8f4d5c648ce62fc51231110b9c4ace2127fbdd18
```
`git cat-file -e` OK for `pending/LIGHTING.json` (36248 B), `lightingscope/{wave-plan,doors,receipt-lightingscope}.md`.
Ledger tip `29e7bf1e5` (§895). `LIGHTING.json` `items.length` = **31** (CONFIRMED, `node` over the blob).

### R2 · Charter rows re-read on the ledger branch (CONFIRMED, verbatim)
`git show review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`, line 32362 (§882.13), inside "THE NINETEEN RULED":
- `**LIGHTING O-5 BUILD** the Remembrance reader** — ruled a COMPLETION of the owner's own §881.4 lighting rather than new capability`
- `**LIGHTING O-11 SIGN** the three persistence paths (publicSafe allowlist, accountImport id-resolution, provenance receiptHash).`
- `**LIGHTING O-14** premium-only canonize STAYS AS DESIGNED for launch — the status quo, not a paid-surface change`
"⛔ THE FIVE HELD" = ENCOUNTERS 7 · LIGHTING O-12 · O-17 · O-16 · O-10(b). **O-5/O-11/O-14 are NOT in it.** ⇒ D-4/D-5/D-6 CONFIRMED PHANTOM.
§889.3 (32405): *"O-10(b): NO RAISE REACHED, RESIDUAL MEASURED AT ZERO … 675,764 B against a 676,000 ceiling, margin +236, with an IDENTICAL content hash in all three"* ⇒ D-7 CONFIRMED.
§893 (32425): *"⛔ **STILL GATED, exactly two:** every `git push`/deploy, and **the owner's WALK**"*, with **persisted shapes** under "✅ TAKEN". CONFIRMED.
§881.4 (32333): *"oh light everything up before the exhaustive review."* CONFIRMED.

### R3 · Registers at `272dbd2da` (CONFIRMED, read from the tree)
| register | value at `272dbd2da` | SCOPE-MEASURE at `90702c3e9` |
|---|---|---|
| lighting census (frozen) | **2521 / 371 / 2150 / 23184 / 6214**, `measuredAtSha ff9b7a53c` | 2521/371/2150/**23178**/**6213** |
| lighting census (LIVE probe) | **2521 / 371 / 2150 / 23184 / 6214** — **equal to frozen ⇒ GREEN, no refreeze owed at boarding** | — |
| test ratchet | `totalTests` **31489**, `totalFiles` **2468**, `measuredAtSha 0a73708f3` | 31483 / 2468 |
| known-failure census `entries` | **6** of `CEILING = 17` (`testRatchet.test.js:182`, asserted `:268`) | 6 |
| …its 6 rows | 4× `tests/copy/voiceMechanics.test.js` · 1× `tests/docs/enforcement-claims.test.js` · 1× `tests/lint/clampPrimitiveBaseline.test.js` | same |
| OSR | `schema` **16**, `total` 1993, `identities` 1409, `minRows` **40**, `frozenAtSha c08df7d59` | same |
| `SCOPE_FLOOR_RATIO` | **0.9** (`scripts/check-test-ratchet.mjs:97`), used at `:1118`/`:1138` as `Math.floor(frozen * 0.9)` | same |

⭐ The live lighting-census probe was run **against a read-only symlink farm** at `$SC/lightingwave/scratch/probe-root`, NOT
against `$SC/laneANCH2`, because `chair-tools/lighting-probe.mjs` writes `tests/lint/.lighting-probe.<pid>.mjs` into the tree
it measures. The walker resolves `ROOT` from `import.meta.url` (`sovereigntyLightingContract.walker.test.js:503`), so a farm
of symlinks reproduces it exactly. **`git -C $SC/laneANCH2 status --porcelain` = 0 before, during and after.**

### R4 · The door denominator re-derived at `272dbd2da` (CONFIRMED)
`node $SC/lightingwave/scratch/measure-presets.mjs $SC/laneANCH2` (the sealed instrument, exit 0):
union 56 · LIT-in-default **11** · DARK-in-default **45** (34 lit-in-some + 11 dark-everywhere) · `ENGINE_GATED` **30**.
Separately: `BACKLOG_RULE_KEYS` **17** at ceiling 17 · `EXEMPT_RULE_KEYS` **4** · `FLAG_DEFAULTS` **38 / 27 true / 11 false**, same 11 names.
⇒ rules doors 56+30+17 = **103**, dark **92**; +38 flags (11 dark) +3 mechanism doors +8 unminted = **152 doors, 38 lit, 114 dark.**
**SCOPE-MEASURE §1.3's 152/114 reproduces EXACTLY at the lane tip.**

### R5 · ⛔ THE 13TH DECAY — the prose-car rebase has QUADRUPLED (CONFIRMED)
```
merge-base(8f4d5c648, 272dbd2da) = 30c1667bc   (unchanged — the prose car never moved)
prose span  30c1667bc..8f4d5c648 = 200 files, 1084 insertions(+), 1019 deletions(-)
mainline    30c1667bc..272dbd2da = 231 files, 26267 insertions(+), 6345 deletions(-)
OVERLAPPING PATHS = 8      (LIGHTINGSCOPE measured 2 at c2f80ffc9)
```
| path | prose side | mainline side |
|---|---|---|
| `docs/content/RECEIPT_POOLS_LEGACY.md` | +1/-1 | **+81/-35** |
| `src/domain/display/defenseDisplay.js` | +4/-4 | +4/-16 |
| `src/domain/display/dossierViewModel.js` | +5/-5 | +15/-7 |
| `src/domain/display/settlementRumors.js` | +1/-1 | **+33/-16** |
| `src/domain/region/propagation.js` | +1/-1 | +7/-2 |
| `src/domain/rulingPowerCoup.js` | +2/-2 | **+47/-0** |
| `src/domain/worldPulse/npcLadderKernel.js` | +6/-6 | +6/-5 |
| `src/domain/worldPulse/warReceiptPools.js` | +5/-5 | **+13/-0** |
⇒ S-6 was right to call "2 of 200" EXPIRED. The replacement figure is **8 of 200**, all eight prose-side edits still
one- to six-line sentence cures. Cost is still SMALL in absolute terms but it is **growing monotonically with every landing**.

### R6 · ⭐ The OSR "25 newly-discoverable keys" — PLAUSIBLE → **CONFIRMED** by independent measurement
Ran the verbatim body of `discoverSimulationFlags` (`scripts/lib/observed-shape-corpus.mjs:87`) over the 1,012 `src/domain/**/*.js`
files at `272dbd2da`: **80 flags discovered.** Cross-referenced against the declared sets:
```
ENGINE_GATED_VIRTUAL_RULE_KEYS = 30   →  21 NOT discovered by the corpus
BACKLOG_RULE_KEYS              = 17   →   4 NOT discovered by the corpus
                                          -----------------------------
                                          25   = the docket's "21 class F + 4 class G"
```
⇒ the docket's population figure for `LGT-P15-EP1`, which SCOPE-MEASURE and LIGHTINGSCOPE both carried as **INHERITED ⟦A5·B9⟧,
not re-derived**, is now re-derived at the freshest tip and it is **exactly right**.
⚠ **A parse trap caught in passing:** the `ENGINE_GATED_VIRTUAL_RULE_KEYS` block contains the bare string `'religion'` inside a
COMMENT (`isSubsystemActive(snapshot, 'religion')`), so a naive string-literal parse of the block returns **31**, not 30. This is
the same shape as the recorded hazard *"a flag name in a comment is minted into the denominator"* — it bit this lane's own probe.

### R7 · ⛔⛔ THE 14TH DECAY — the GOLDEN freeze machinery has LANDED (CONFIRMED, four tips)
Every survivor (`LIGHTING.json` `LGT-REG-DECL`, `wave-plan.md` Consist 5) records `goldenRecordDoor.js` and
`.golden-freeze-register.json` as **ABSENT**. Measured with `git cat-file -e` / `git ls-tree`:
```
ca651d54b : ledger yes · door NO  · register NO  · docs/shift-records 0 files
c2f80ffc9 : ledger yes · door NO  · register NO  · docs/shift-records 0 files
90702c3e9 : ledger yes · door YES · register YES · docs/shift-records 2 files
272dbd2da : ledger yes · door YES · register YES · docs/shift-records 2 files
```
The register's `_doc` says: *"⛔ THIS REGISTER IS UNFROZEN. `frozenAt` is null … every `sha256`, `rows`, `seedSet`,
`distinctFloor`, `frozenConstants` and `ownerRow` is null and MUST stay null until the freeze act writes it through the door."*
`tests/lint/goldenFreeze.walker.test.js:39–47`: *"THE REGISTER IS UNFROZEN TODAY, AND THIS WALKER IS GREEN AGAINST IT ON
PURPOSE … Everything structural … is LIVE TODAY and does real work on every gate run."*
⇒ **the recorded FACT is false; the recorded CONCLUSION survives** (the door is unusable pre-freeze, so
`docs/GOLDEN_SHIFT_LEDGER.md` remains the wave's form) — **and a NEW obligation appears**: `:418` *"every golden-adjacent
env spelling in tests is enrolled or written-excluded … Silence is not a disposition."* **`LGT-P14-WITNESS` owes it.**

### R8 · The OSR: the wave owes a migration, and only HALF of `LGT-P15-EP1` crosses the detector (CONFIRMED)
- `BASELINE_SCHEMA = 16` (`scripts/lib/observed-shape-baseline.mjs:268`) == baseline `schema` 16 ⇒ no migration pending.
- ⚠ `RETIRED_PRESET_LIGHT_BASELINE_SCHEMA = 14` (`:259`) is **NOT** this wave's migration — its own docblock says it
  *"moves no row at all"*. A lane grepping for a preset-lighting schema will find it and draw the wrong conclusion.
- `scripts/lib/observed-shape-corpus.mjs` **IS** in `scannerToolFiles()` (`check-observed-shape-readers.mjs:190–204`)
  ⇒ `isDetectorSourcePath` true for it; `src/domain/worldPulse/simulationRules.js` is a subject-tree INPUT ⇒ false.
  ⇒ **the 25-key re-key does NOT cross the detector; the EP-1 `advanceEpochEnabled` release DOES.**
- The corpus **hard-overrides** `simulationRules.advanceEpochEnabled = false` at `observed-shape-corpus.mjs:772`, AFTER
  building from the discovered flags ⇒ **lighting that key in a preset moves the corpus not one row.** The two acts are
  independent, and the docket's item name bundles them.
- ⚠ Docket citation drift: `observed-shape-corpus.mjs:775` → the file is now `scripts/lib/observed-shape-corpus.mjs` and
  the EP-1 block is at **`:752`**.

### R9 · Items I re-classed against the record
- **`LGT-C4-UI`: docket says `landed: PARTIAL`; I re-class it NO.** All three of the car's flags are dark at
  `src/lib/flagRegistry.js` — `mobileSingleChrome:false` `:78`, `handbookVoice:false` `:86`, `warEconomySurfacing:false`
  `:87`. The PARTIAL refers to `founderRecognition:true` `:74` (O-16), **which is not one of this car's three.**
- **`LGT-P3-CAPSIG`'s blocker amended**: recorded as "HORIZON-DARK (TUNEREG first)" = B5. TUNEREG gates nothing; the real
  gate is **B6**, the three CAPACITY evidence items. CONFIRMED `demographicsRates.js:375 = {signed:false, lit:null}`.
- **`LGT-P12-PRELOAD` largely MOOT** — §889.3 measured the dial's residual at ZERO across three real builds.

### R10 · D-12 partially re-derived
The landed pin survives at `tests/domain/economyStateProseDesk.test.js:359–360`:
`expect(refused.length).toBe(COMPLEXITY_VALUES.length); expect(COMPLEXITY_VALUES.length).toBe(11);`
(recorded as `:358` — one line of drift). I did **not** re-run the 24-seed both-arms drive; it needs the desk.
**The re-class stands as PLAUSIBLE. It gates none of the 31 either way.**

---

## FENCES — HONOURED, AND ONE JUDGMENT I TOOK ABOUT THEM
- No vitest, no `npm run <anything>`, no build, no `npm install`, no ref write, no subagent, one process at a time.
- **No write to any git working tree.** `git -C $SC/laneANCH2 status --porcelain` = **0** at open, after every probe,
  and at close; `HEAD` = `272dbd2da…` unchanged.
- ⚠ **JUDGMENT (vetoable):** the brief encouraged `node $SC/chair-tools/lighting-probe.mjs $SC/laneANCH2`. **That tool
  writes `tests/lint/.lighting-probe.<pid>.mjs` INTO the tree it measures** and only removes it in a `finally` — a
  SIGKILL leaves an untracked file in a tree that is about to be gated. I judged the hard fence to outrank the
  convenience and built a **read-only symlink farm** at `$SC/lightingwave/scratch/probe-root` instead (the walker
  resolves `ROOT` from `import.meta.url`, and `walk()` uses `statSync`, which follows symlinks). Identical measurement,
  zero bytes written to any tree. **The farm is left in place as the reproduction instrument.**

## REPRODUCTION — every instrument this lane used
| what | command |
|---|---|
| lighting census, live | `node $SC/chair-tools/lighting-probe.mjs $SC/lightingwave/scratch/probe-root` |
| door denominator | `node $SC/lightingwave/scratch/measure-presets.mjs $SC/laneANCH2` |
| OSR discoverability (the 25) | `node $SC/lightingwave/scratch/flags.mjs $SC/laneANCH2` |
| BACKLOG / EXEMPT key sets | `node $SC/lightingwave/scratch/keys2.mjs $SC/laneANCH2` |
| the `religion` parse trap | `node $SC/lightingwave/scratch/gated.mjs $SC/laneANCH2` |
| prose rebase | `git merge-base 8f4d5c648 272dbd2da` then `comm -12` of the two `--name-only` lists |

---

## ⭐ RETROVALIDATION ROW
**Seat: Opus 5 — Fable-unvalidated. Lane: LIGHT-PLAN.** Act: read-only reconstruction and re-derivation. **No repository
state changed anywhere; no register act taken; no owner-gated class re-opened.**

| # | what I JUDGED | what the Fable chair must RE-DERIVE | receipts, by absolute path | priority |
|---|---|---|---|---|
| 1 | **The prose car's rebase is 8 of 200 paths, not 2** — and it is the only cost in the arc measurably GROWING | re-run `git merge-base 8f4d5c648 <boarding base>` and the `comm -12` overlap at the base you actually board from; the figure moves every landing | `/Users/cstokes/Desktop/settlement-engine` git reads · `$SC/lightingwave/scratch/{prose-paths,main-paths,overlap}.txt` | **HIGH** — it is the plan's ordering ground |
| 2 | **The GOLDEN freeze machinery has LANDED and `LGT-P14-WITNESS` owes a register row or written exclusion** | `git cat-file -e 272dbd2da:tests/helpers/goldenRecordDoor.js`; read `goldenFreeze.walker.test.js:418` and `:228` | `$SC/laneANCH2/tests/lint/goldenFreeze.walker.test.js` · `…/tests/fixtures/.golden-freeze-register.json` · `…/docs/shift-records/README.md` | **HIGH** — a landing bill no survivor names |
| 3 | **`LGT-P15-EP1` bundles two acts; the wave owes the 25-key re-key and NOT the EP-1 release; only the release crosses the detector** | read `scripts/lib/observed-shape-corpus.mjs:750–772` and `check-observed-shape-readers.mjs:190–204, 2476–2480`; re-run the flags probe | `$SC/lightingwave/scratch/flags.mjs` · `$SC/laneANCH2/scripts/lib/observed-shape-corpus.mjs:752` | **HIGH** — it is a re-cut of a chartered item; **a chair ruling, which I did not take** |
| 4 | **The docket's "25 newly-discoverable keys" (21 F + 4 G) is CORRECT** — upgraded INHERITED → CONFIRMED | `node $SC/lightingwave/scratch/flags.mjs $SC/laneANCH2`; expect 80 discovered, 21 F missing, 4 G missing | same | **MEDIUM-HIGH** — it sizes the OSR migration |
| 5 | **PROSE goes FIRST, but the recorded argument for it is dead** — the ground is now (a) growing rebase, (b) a shrink-only voice baseline that already refuses, (c) 113 engine-side paths that would contaminate L-PROBE's control | re-read `wave-plan.md` PART 2's ordering call, then D-1/D-3; confirm the census is 6/17 and that the 4 `voiceMechanics` rows are still banked | `$SC/lightingwave/scratch/prose-paths.txt` · `$SC/laneANCH2/scripts/.test-ratchet-baseline.json` | **HIGH** — same conclusion, different reasons; a planner must not inherit the dead argument |
| 6 | **`LGT-C4-UI` is NO, not PARTIAL** | read `src/lib/flagRegistry.js:74,78,86,87` | `$SC/laneANCH2/src/lib/flagRegistry.js` | MEDIUM |
| 7 | **`LGT-P3-CAPSIG`'s blocker is HORIZON-DARK B6, not B5/TUNEREG** | read `demographicsRates.js:375` and `RECONCILED.json` B6 | `$SC/laneANCH2/src/domain/worldPulse/demographicsRates.js:375` | MEDIUM |
| 8 | **A new test file owes FOUR censuses, not three** (lighting census · ratchet totals · known-failure file list · the golden-freeze register) | read `SCOPE_FLOOR_RATIO` at `check-test-ratchet.mjs:97` and the four arms named in PLAN §2.1 | `$SC/laneANCH2/scripts/check-test-ratchet.mjs` · `…/tests/lint/goldenFreeze.walker.test.js` | **HIGH** |
| 9 | **The reconstructed §8 is RECONSTRUCTED** — [Q] rows quote the tree, [I] rows are my inference | spot-check any three [I] rows against their instrument's source | `$SC/lightingwave/PLAN.md` §8 | MEDIUM |
| 10 | **CS-9: reported, NOT ruled** — on the face of §893's amendment it has decayed from owner-gated to chair-class, but applying that amendment to a specific row is a chair act | read ODQ line 32425's "⛔ STILL GATED, exactly two" and decide the one sentence | `docs/OWNER_DECISION_QUEUE.md` (ledger branch) line 32425 | **HIGH** — one sentence unblocks a whole car |

**Deliberately deferred — documented, not a bug to re-find:** D-8/D-9/D-10/D-11 are W-ARMS rows and are **not among the
lighting 31**; I declined to inherit them rather than re-deriving out of scope. D-12's 24-seed drive was not re-executed
(needs the desk); it gates nothing. No closure/engine-byte figure was quoted anywhere, because every one in the record
needs a build and is at least six landings stale.

## ⚠ STATUS: **COMPLETE.**
