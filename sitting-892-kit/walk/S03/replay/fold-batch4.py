"""BATCH 4 — the WORKER Car 0 receipt (the probe build) folded into §9, §11.3 and §11.4.
Receipt: $SP/laneG0WORKER-receipt.md. Chair rulings: ODQ §882.6. Marks G0-47 … G0-58.
"""
import foldlib

R = '(WORKER Car 0 receipt, `$SP/laneG0WORKER-receipt.md`)'
f = foldlib.Folder()

# ── ⟦G0-47⟧ §9.2 — the byte bill: engine +8, kernel −218, closure −6,366 ──
f.rep(
    'the `engine` chunk moves by **0 B** (nothing new under `src/generators/`, no new `src/domain` leaf, no generator edited); `engine-core` **0 B** (no new generator→domain edge); `kernel` **0 B** (`generateSeed` already exported; a static import from a lazy chunk adds a binding to the LAZY chunk); `pipeline-metadata` **0 B**; the first-paint closure by a PLAUSIBLE **−4 to −7 KB net** (extraction) **+ ~60 B**',
    '''⟦G0-47⟧ **MEASURED BY THE PROBE BUILD AT C′ ''' + R + ''' §9.5(b), and two of the four predictions are FALSE:** the `engine` chunk moves by ~~0 B~~ **+8 B** (675,764 → 675,772; hash moved — **STOP S0.4 FIRED and is ACCOUNTED 8 of 8 bytes**: the export statement grows from 111 B / 13 names to 119 B / 14 names, the new local being `carryLockedRosterThroughGenerate`, which topology T2 makes a STATIC named import from the core; import clauses move 0 B and no generator byte changed — chunk LINKAGE, not generator code. **RULED (§882.6, vetoable): the +8 B is ACCEPTED as the shape\'s own cost; the `engine` margin falls 236 → 228 B under the unbreached 676,000, and no ceiling is raised**); `engine-core` **0 B** CONFIRMED (125,265, hash moved); `kernel` ~~0 B~~ **−218 B** (10,683 → 10,465, in the estate\'s favour: −8 B of export table, 21 → 20 names, and −210 B as exactly one Rollup NAMESPACE-OBJECT wrapper disappears — `kernel/prng.js`\'s, because `loadEngine()` no longer does `import(\'../kernel/prng.js\')`; `Symbol.toStringTag` occurrences fall 2 → 1); `pipeline-metadata` **0 B** CONFIRMED (5,706 B, and the ONLY governed chunk that keeps its content hash); the first-paint closure by a PLAUSIBLE −4 to −7 KB net → **MEASURED −6,366 B RAW (1,046,662 → 1,040,296), −2,140 gzip, −1,624 Brotli**, decomposing as entry −6,148 and kernel −218, the other six closure files 0 raw bytes — mid-band, and the SIGN the whole design turned on is NEGATIVE. The eager cost the volume priced at **+ ~60 B**''',
)

# ── ⟦G0-48⟧ §9.2 — the re-hash cascade is far wider than predicted ──
f.rep(
    '⚠ The chunk-hash cascade: `engine`, `engine-core`, `kernel`, `data`, `pipeline-metadata` keep bytes AND imported-chunk hashes, so their content hashes should not move',
    '⚠ The chunk-hash cascade: ⟦G0-48⟧ **MEASURED FALSE for four of five — only `pipeline-metadata-s6FRwvfr.js` keeps BOTH its bytes and its hash**; `engine-core` (125,265), `engine-core-lazy` (23,846), `data` (114,825) and `data-lazy` (505,724) keep every byte but RE-HASH as a pure cascade from `kernel`. And the cascade is far wider than "the entry chunk and the chunks importing it": **370 of 484 shared stems re-hash, 114 are untouched, 5 chunks are NEW and 0 are gone** ' + R + '. ⇒ **Car 1\'s landing receipt QUOTES the re-hash count; it must not forbid the cascade.** The volume\'s claim, for the record — `engine`, `engine-core`, `kernel`, `data`, `pipeline-metadata` keep bytes AND imported-chunk hashes, so their content hashes should not move',
)

# ── ⟦G0-49⟧ §9.2 — the mapDeps delta is three filenames, not one ──
f.rep(
    "**+1 filename in the entry chunk's `__vite__mapDeps` manifest (~40 B, the Wave-B lesson at `journeyProgress.js:9-16`) — PLAUSIBLE, measured in Car 0**",
    "**+1 filename in the entry chunk's `__vite__mapDeps` manifest (~40 B, the Wave-B lesson at `journeyProgress.js:9-16`) — PLAUSIBLE, measured in Car 0** → ⟦G0-49⟧ **MEASURED +3 entries / +125 B (258 → 261 entries, 9,329 → 9,454 B), zero removed** — `settlementGenerateAction.js`, `anonGenCounter.js` and `densityCreateBoundary.js`, the last two being EVICTIONS the Car 1 bill does not name: each becomes its own chunk (`anonGenCounter-*` 1,149 B, `densityCreateBoundary-*` 101 B) and each lazy importer pays ~40 B for the import statement it gained (`GenerateWizard` +39, `composeInstantWorld` +48, `instantWorldBody` +44, six lazy component chunks +39…+46). That price is the eviction working as designed and it is paid OFF first paint — it is the price of the −6,148 B " + R + "**",
)

# ── ⟦G0-50⟧ §9.2 — the worker bundle: one chunk, and the size measured ──
f.rep(
    'the worker bundle is PLAUSIBLY ≈ 1.0–1.6 MB raw / ≈ 300–450 KB gz',
    'the worker bundle is ⟦G0-50⟧ **MEASURED 1,404,723 B raw / 452,384 gz (441.8 KiB) / 355,591 Brotli — raw inside the predicted band, gzip AT its top edge on a decimal reading — and it is exactly ONE CHUNK, not two** ' + R + ': a BFS from `generation.worker-DgUJp-Vh.js` over static, bare and dynamic edges reaches 1 file, and `grep -o \'import(\' | wc -l` returns **0**. `livingContentSeam.js:94` does carry its load-bearing `await import(\'./livingContentRoster.js\')` and the seam IS in the worker\'s graph — but **Vite compiles a worker entry with dynamic imports INLINED**, so the payload is statically folded in; the corroborating precedent sits in the same build (`customContentPreview.worker-B5feWPbA.js`, same pipeline through the same seam at the same tip, likewise one chunk with zero `import(`). ⇒ **S0.5 and the R13/pdfRender counter-law worry are UNREACHABLE BY CONSTRUCTION while `vite.config.js:412-414` sets `worker.format` only**, and Car 1\'s chunk-count pin is written as **1** with that reason stated in the test. (Volume: PLAUSIBLY ≈ 1.0–1.6 MB raw / ≈ 300–450 KB gz)',
)

# ── ⟦G0-51⟧ §9.2 — the clone census instrument: 529 rows, not 527 ──
f.rep(
    "`scripts/audit/generation-clone-census.mjs` (Car 0; §1.12) — for each of the 525 rows (§1.2 `manifestRows`) + one reroll fixture with a locked NPC (from `regenPreservation.test.js`'s locks shape) + one instant-world bundle per `realmSize`",
    "`scripts/audit/generation-clone-census.mjs` (Car 0; §1.12) — for each of the 525 rows (§1.2 `manifestRows`) + one reroll fixture with a locked NPC (from `regenPreservation.test.js`'s locks shape) + one instant-world bundle per `realmSize` — ⟦G0-51⟧ **529 ROWS, not the summary line's 527: `REALM_SIZES` has THREE keys** (`small`/`medium`/`large`, `worldPlan.js:54-76`), so the arithmetic is 525 + 1 + 3; the three instant worlds composed **5 / 9 / 14** members, exactly `REALM_SIZES[…].tiers.length`, and the reroll fixture locked `npc_5` with `preservation.preserved.length === 1` — the carry actually ran " + R + " §9.5(a). ⚠ A SECOND instrument fact the design must not inherit: **check (2) `jsonLossless` is BLIND to a Map/Set** — both sides serialise to `{}` — so WK-9's `cloneJson` save-path concern is discharged by the deep walk's `mapsSets` count and NEVER by the JSON check. ⚠ A THIRD, found by the probe's own PLANT and cured mid-lane: the instrument returned EARLY on the `structuredClone` throw, so it exited 1 printing `functions=0` and naming nothing — `DataCloneError` carries no path. The cure (classify FIRST, unconditionally) is Car 1's to inherit: **assert the classification, not only the throw**",
)

# ── ⟦G0-52⟧ §9.5 Car 0 — DISCHARGED, with the summary line as executed ──
f.rep(
    '- **Car 0 — MEASURE FIRST** (instruments + one probe build; ZERO product bytes):',
    '''- ⟦G0-52⟧ **Car 0 IS DISCHARGED at C′ `9a0584f0f`, 2026-09-02 04:58–05:30 ET ''' + R + ''' — acts (a)(b)(c)(d)(e) all run, EXACTLY TWO builds (both `TRUE_EXIT=0`, 18.33 s base / 18.44 s probe, board clear before each), the throwaway wiring REVERTED, dock porcelain 0, zero commits.** The census summary line, VERBATIM:

```
rows=529 cloneable=529 jsonLossless=529 keyCensusEqual=529 functions=0 classes=0 mapsSets=0 undefinedInArrays=0 mutatesConfigInPlace=false
symbols=0 bigints=0 dates=0 regexps=0 nonFiniteNumbers=0 frozen=41919
TRUE_EXIT=0
```

Both plants fired and were deleted: a planted `settlement.__probe = () => 1` exits 1 naming `result.settlement.__probe: function` (the walk root is the whole result packet, so the path is prefixed — a superset naming, not a miss); a planted `new Map()` is COUNTED (`mapsSets=2`, `TRUE_EXIT=0` — a Map is reported, never fatal). **(c) P4: `mutatesConfigInPlace` is FALSE over all 525 rows** — the pipeline does not mutate the caller\'s `fullConfig` (`resolveConfigWithUserContentTunables` builds a NEW object) — **but `JSON(fullConfigAfter) === JSON(settlement.config)` is ALSO false**, so §9.5 Car 1\'s instruction is load-bearing rather than defensive: **analytics MUST read `resolvedConfig` off the result**; a main-thread reader using `fullConfig` today is reading the UNRESOLVED config, and that is true at C′ already — not introduced by the worker. **(e) `grep -rn lastCtx tests/` → 0 hits, PREDICTED 0** (its only sightings anywhere are the slice\'s own write/clear at `:513`/`:662` and three docblocks — `settlementSlice.js:173`, `:398`, `generateSettlementPipeline.js:58`), so Car 1\'s `state.lastCtx = null` on both paths breaks no test — ⚠ and the §880.7 class applies: `:173`\'s comment and `:58`\'s prose DESCRIBE a capture that will no longer happen, which a raw-text detector could convict. **S0.1, S0.2, S0.3 and S0.5 do not fire; S0.4 fired and is accounted (⟦G0-47⟧).**

- **Car 0 — MEASURE FIRST** (instruments + one probe build; ZERO product bytes) — the act, as chartered:''',
)

# ── ⟦G0-53⟧ §9.5 Car 0 — the summary-line template corrected ──
f.rep(
    'the census summary line (`rows=527 cloneable=527 jsonLossless=527 keyCensusEqual=527 functions=0 classes=0 mapsSets=<n> undefinedInArrays=<n> mutatesConfigInPlace=<bool>`)',
    'the census summary line (⟦G0-53⟧ **`rows=529 …` — the template\'s 527 assumed ONE instant world where `REALM_SIZES` has three; MEASURED `rows=529 cloneable=529 jsonLossless=529 keyCensusEqual=529 functions=0 classes=0 mapsSets=0 undefinedInArrays=0 mutatesConfigInPlace=false`, and Car 1 quotes 529** ' + R + ')',
)

# ── ⟦G0-54⟧ §9.5 Car 0 — the chunk-count expectation ──
f.rep(
    "the worker bundle's raw+gzip size and its chunk COUNT (1 + the dormant living-content chunk); the count of re-hashed chunks; revert the throwaway wiring;",
    "the worker bundle's raw+gzip size and its chunk COUNT (⟦G0-54⟧ **MEASURED 1 — Vite inlines a worker entry's dynamic imports, so the dormant living-content payload is folded in rather than split out**; volume: 1 + the dormant living-content chunk); the count of re-hashed chunks (⟦G0-54⟧ **370 of 484 shared stems; 5 new chunks — `settlementGenerateAction-*` 9,147 B, `generationRequest-*` 1,394 B, `generation.worker-*` 1,404,723 B, and the two EVICTIONS `anonGenCounter-*` 1,149 B and `densityCreateBoundary-*` 101 B; 0 gone; total `dist/assets` 17,664,042 → 19,074,722 B**; ⭐ `generationClient` and `generationProtocol` get NO chunk of their own — Rollup co-locates both into `settlementGenerateAction-*`, exactly as §9.2 predicts, so **a build test asserting three new chunk FILES for them would fail**); revert the throwaway wiring;",
)

# ── ⟦G0-55⟧ §9.5 Car 0 — S0.3 and S0.4/S0.5 dispositions ──
f.rep(
    '(S0.4) `engine` chunk size OR hash moves → STOP and find the edge; (S0.5) the worker bundle has more than the two expected chunks',
    '(S0.4) `engine` chunk size OR hash moves → STOP and find the edge — ⟦G0-55⟧ **FIRED; the edge was found and accounted 8 of 8 bytes (⟦G0-47⟧), benign, and RULED ACCEPTED (§882.6)**; (S0.5) the worker bundle has more than the two expected chunks — ⟦G0-55⟧ **CANNOT FIRE under this config (measured 1 chunk, ⟦G0-50⟧)**',
)
f.rep(
    '(S0.3) the probe closure delta is POSITIVE by more than (the closure margin at the landing base − 100 B) → the EXTRACTION shape is dropped',
    '(S0.3) ⟦G0-55⟧ **DOES NOT FIRE — MEASURED DELTA −6,366 B against a threshold of > +238 B (the margin at C′ is 338 B against the UNRAISED 1,047,000) or > +1,238 B (against the §880.8 BANKED 1,048,000); the lane priced against the UNRAISED ceiling as the conservative reading and recorded both, and the sign passes either way. ⇒ CAR 1 TAKES THE FULL EXTRACTION SHAPE, not the MINIMAL fallback**, and it needs NONE of the banked headroom: the probe leaves the closure **6,704 B under the unraised ceiling** (was 338 B — a 19.8× margin improvement), so `vendorPdfLazy`\'s `CLOSURE_BUDGET_BYTES` STAYS at 1,047,000, Car 1 owes no raise, and the §880.8 raise stays banked and unspent ' + R + '. Whether to BANK the −6,366 B by LOWERING the budget is an owner row, not a lane\'s (§19). The rule, unchanged for the record: the probe closure delta is POSITIVE by more than (the closure margin at the landing base − 100 B) → the EXTRACTION shape is dropped',
)

# ── ⟦G0-56⟧ §9.5 Car 1 — proof (9) restated; the bill corrected ──
f.rep(
    '(9) the hashed-listing diff base→tip: `engine-*`, `engine-core-*`, `kernel-*`, `data-*`, `pipeline-metadata-*` filenames UNCHANGED; re-hashed count quoted;',
    "(9) ⟦G0-56⟧ **RESTATED — as written this proof CANNOT PASS ON A CORRECT TREE** ' + R + ': the hashed-listing diff base→tip asserts **BYTES unchanged for `engine-core`, `data` and `pipeline-metadata`; `engine` +8 B; `kernel` −218 B; `pipeline-metadata-*` the one filename genuinely UNCHANGED**, and QUOTES the re-hash cascade count (370 of 484 at Car 0) rather than forbidding it;",
)
f.rep(
    "Bill: bytes engine 0 / engine-core 0 / kernel 0 / closure = Car 0's measured delta (+~60 B)",
    "Bill: ⟦G0-56⟧ bytes **engine +8 (margin 236 → 228; ⚠ every later `engine`-ceiling arm now has 228 B, not 236)** / engine-core 0 / **kernel −218** / closure = Car 0's measured delta **−6,366 B (margin 338 → 6,704)**; the volume's \"engine 0 / kernel 0 / closure +~60 B\" is corrected at cause and Car 1 must not inherit it",
)

# ── ⟦G0-57⟧ §9.1 / §9.7 R5+R6 — the timing table settles the keep-alive judgment ──
f.rep(
    '> **JUDGMENT (WORKER): one worker per request (the advance idiom) over a keep-alive singleton',
    '''⟦G0-57⟧ **THE JUDGMENT IS PRICED AND HOLDS ON MEASUREMENT** ''' + R + ''' §9.5(d). The BUILT probe worker bundle (1,404,723 B) driven in Node `worker_threads` through the estate\'s isolate shim, town config, 5 runs, every run emitting 22 step events and 11 NPCs: **construct→ready 40.3 ms · construct→first-step 41.5 ms · construct→result 136.5 ms · ready→result 96.1 ms** (medians). Against E35\'s ~500 ms bound the first-step figure is **12× inside** it, and the whole cost of constructing a fresh isolate and parsing the entire 1.4 MB bundle (~40 ms) is under HALF the 96 ms generation it wraps — ⇒ **one worker per request HOLDS and the pooled/keep-alive factory follow-up is NOT OWED**. ⚠ Method stated plainly: this is not a browser; it includes thread spawn and V8 parse and EXCLUDES the network fetch, which is reported separately — on the wire the first generate additionally fetches **452,384 B gzipped** of worker bundle (the WK-6 owner posture, not a latency the isolate model changes).

> **JUDGMENT (WORKER): one worker per request (the advance idiom) over a keep-alive singleton''',
)
f.rep(
    '| R5 | worker start-up latency on first generate',
    '| R5 | ⟦G0-57⟧ **MEASURED, and the desktop half is settled: construct→result 136.5 ms against the reveal\'s owner-signed 3–10 s pacing — the dwell dominates by 22×–73×, so removing the freeze is a correctness win, not a perceived-speed one, and nothing in WORKER justifies touching `a52a88b1`.** The wire term stands unmeasured on a real link: 452,384 B gzipped. Original row: worker start-up latency on first generate',
)
f.rep(
    '| R6 | per-request worker construction cost on EVERY generate',
    '| R6 | ⟦G0-57⟧ **PRICED AND CLOSED: the warm median construct→first-step is 41.5 ms, an order of magnitude under the ~500 ms revisit threshold, so the one-shot judgment is not revisited.** Original row: per-request worker construction cost on EVERY generate',
)
f.rep(
    "| R13 | the COUPLED tip's dormant living-content chunk inside the worker bundle",
    "| R13 | ⟦G0-50⟧ **RETIRED AS A CHUNK RISK: there is no second chunk — Vite inlines a worker entry's dynamic imports, measured 1 chunk with 0 `import(` calls, with `customContentPreview.worker` as the same-tip precedent. What survives is a BYTE fact, not a fetch fact: the seam's payload is statically folded into the 1,404,723 B bundle, so the living-content lighting car pays it in the bundle ceiling rather than in a mid-generation fetch.** Original row: the COUPLED tip's dormant living-content chunk inside the worker bundle",
)

# ── ⟦G0-58⟧ §9.2 / §9.5 — E45 proven stronger; E37 left ARMED; the golden test's real home ──
f.rep(
    "Car 0's probe build greps the entry chunk for a why-string fragment (`mints a brand-new town`), and if the rows SHIP they move to a test-side fixture the walker imports (zero product bytes) BEFORE Car 1 is cut",
    "Car 0's probe build greps the entry chunk for a why-string fragment (`mints a brand-new town` — ⟦G0-58⟧ **verified as the REAL string at `densityCreateBoundary.js:39`, not assumed**), and if the rows SHIP they move to a test-side fixture the walker imports (zero product bytes) BEFORE Car 1 is cut → ⟦G0-58⟧ **THEY DO NOT SHIP: `PIPELINE_REACHERS` is absent from the entry chunk, from ALL EIGHT files of the eager closure, and from EVERY `dist/assets/*.js` chunk in the whole build** — tree-shaken out of the entire build, not merely the entry, so the EXECUTOR/`reachesVia` rows cost 0 product bytes on every chunk and the fixture contingency does NOT fire " + R + ". ⚠ The ≥ 40-char why string is still a `src/domain` string literal under `voiceMechanics` Tier 2 at zero headroom (⟦A17 E1⟧), so the em-dash and `!` bans still bind",
)
f.rep(
    "(S3.1) `regenNPCsPipeline`'s `parts` or `foldRegeneratedRoster`'s inputs prove non-cloneable in Car 0's census extension → drop `regen-npcs`, keep `regen-history`, say so",
    "(S3.1) ⟦G0-58⟧ **STAYS ARMED AND UNPRICED — the census EXTENSION was not run.** Car 0's act list is (a)–(e) and the extension is not in it, so its census covers the settlement-op result and the carry's `_preservation` report (both clean, 529/529) and NOT the regen ops' intermediate `parts`; E37 is the one WORKER-tagged §14 row Car 0 leaves open, and Car 3 either runs the extension first or is dropped " + R + ". The rule, unchanged: `regenNPCsPipeline`'s `parts` or `foldRegeneratedRoster`'s inputs prove non-cloneable in Car 0's census extension → drop `regen-npcs`, keep `regen-history`, say so",
)
f.rep(
    '(an EXACT pin: 1 at the build tip, 2 at the coupled tip with the living-content seam; re-recorded in the same commit that grows it',
    '(⟦G0-50⟧ **an EXACT pin of 1 at BOTH tips — the coupled tip\'s living-content seam does NOT add a second chunk, because Vite inlines dynamic imports in a worker entry; the test states that as the reason the pin is 1**; volume: 1 at the build tip, 2 at the coupled tip with the living-content seam; re-recorded in the same commit that grows it',
)

# ── §9.6 Car 0's slot row — discharged, with the base listing E38 needs ──
f.rep(
    '| Car 0 | **immediately after COUPLED seals**',
    '| Car 0 | ⟦G0-52⟧ **RUN AND DISCHARGED at C′ `9a0584f0f` (two landings past the COUPLED seal), 05:14–05:28 ET; base listing `$SP/worker-car0-listing-base.txt` (488 files, `CLOSURE_RAW 1,046,662`) and probe listing `…-probe.txt` (493) preserved — ⚠ so it CANNOT settle E38, whose base is the COUPLED tip, but it supplies the base listing E38\'s owner needs.** Chartered slot: **immediately after COUPLED seals**',
)

# ── §11.3's governed-chunk row — corrected at the bill ──
f.rep(
    '| `engine-core` / `kernel` / `data` / `pipeline-metadata` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 (no new generator→domain edge; `generateSeed` already exported) | 0; content hashes should not move — the hashed-listing diff counts re-hashes |',
    '| `engine-core` / `kernel` / `data` / `pipeline-metadata` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | ⟦G0-47⟧⟦G0-48⟧ **engine-core 0 · kernel −218 · data 0 · pipeline-metadata 0, MEASURED** (and the `engine` cell above is **+8**, not 0) | 0 bytes on three of four, −218 on `kernel`; ⟦G0-48⟧ **content hashes DO move — 370 of 484 shared stems re-hash and only `pipeline-metadata` keeps its hash; the diff QUOTES the cascade, it does not forbid it** |',
)

f.checkpoint(58, 84)
f.save('batch4 WORKER')
foldlib.fold_json(folded=[f'G0-{n}' for n in range(47, 59)])
