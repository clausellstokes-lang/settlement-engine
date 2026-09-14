# CRITIQUE — MIGRATION · ROLLOUT · TESTABILITY (Opus critic, adversary seat)

**Target:** `ARCH-COMPOSED-PROSE.md` v1. **Trees read (read-only):** `$SC/laneB6` = **3b1c0eaa5** (executed `git log --oneline -1`), `$SC/skepINSTR` = **74a1aa0e8** (executed). Nothing written outside `$SC/arch-prose/`. No vitest, no build, no install; two read-only node scripts (`_mig-corpus.mjs`, `_mig-lines.mjs`) written here and executed.

**What I executed (outputs quoted in the findings):**
`node arch-prose/_mig-corpus.mjs` (a faithful replication of `generatorGoldenMaster.test.js`'s `corpus()` with the shipped constant arrays) → `rows 525 distinct seeds 4 {"golden-master-v3":516,"gm-seed-a":3,"gm-seed-b":3,"gm-seed-c":3}` ·
`node -e` over `scripts/.size-baseline.json` → `total keys 19 / file rows 8` ·
`node arch-prose/_mig-lines.mjs` (eslint's own `Linter`, the enforcer's rule: `max-lines` skipBlankLines+skipComments, via `createRequire` on laneB6) → the instruments 41/132/468/463/158/66/75/113 effective; the desks `generalStateProse 699`, `defenseStateProse 454`, `economyStateProse 334`, `powerStateProse 275`, `warFaithStateProse 251`, `stressorsStateProse 155`, `stateProseKernel 108`, `legibilityRung 16` ·
`node -e` over `package.json` (the `check` chain) ·
`grep`/`sed` reads of `tests/lint/sizeBaseline.test.js`, `eslint.config.js:79-100`, `tests/build/vendorPdfLazy.test.js:35-90, 545-605`, `tests/property/generatorGoldenMaster.test.js:767-935`, `tests/helpers/goldenRecordDoor.js:1-120`, `tests/lint/goldenFreeze.walker.test.js`, `vite.config.js:850-880`, `src/domain/display/stateProse/stateProseKernel.js:240-306`, `legibilityRung.js`, `tests/data/dossierStateProseProjection.contract.test.js`, `tests/lint/couplingInclusion.walker.test.js`, `tests/lint/dossierMountRegistry.walker.test.js`, `arch-prose/_c-occ200.mjs`, `arch-prose/draw-reroll.mjs`.

Verdicts: **BREAKS** = the car as written cannot land or cannot prove what it claims · **STRAINS** = it lands but a stated proof, cost or gate is wrong · **HOLDS** = checked and true.

---

## F1 · BREAKS — the manifest's corpus carries FOUR distinct seeds, and three of the four instruments hung on it are blind to the design's own cure

**The claim (v1 §3.6):** "the golden's own 525-row corpus builder × the six composers … **The same run yields the reading sequences arms B1–B3 need, the occurrence census's denominator, and the duplicate-unit baseline (§7.3) — one run, four instruments.**" Appendix A rules the manifest's N to be "the golden's 525 grid × 2 audiences" over A's "200 purpose-built", and §13 row 14 puts that to the owner.

**Measured.** `node arch-prose/_mig-corpus.mjs` → `rows 525 distinct seeds 4 {"golden-master-v3":516,"gm-seed-a":3,"gm-seed-b":3,"gm-seed-c":3}`. The corpus is a **tier × culture × terrain config grid at ONE seed** (`generatorGoldenMaster.test.js:802-806`, `const seed = 'golden-master-v3'`), plus three extra seeds on nine rows (`:833-840`).

**Why that breaks the instruments.** Every draw in this design is `hash(seed :: blockId :: poolKey)` (`stateProseKernel.js:301-305`, CONFIRMED) and the face is `hash(seed :: blockId :: poolKey :: w) % 4` (v1 §2.6). Seed and pool identity are the ONLY inputs. Therefore, on 516 of 525 rows:
- two towns in the same state cell draw the **same variant index and the same face**, always;
- the wording sets buy **exactly zero** cross-town variety inside the sample;
- the salience tie-break (key 5, a seeded permutation) is **constant** across 516 towns, so "two towns with the same facts foreground differently" (§0, §4.3) is unobservable;
- car 8's acceptance "**the duplicate-unit rate before/after**" and §7's REPEAT CENSUS "against the CHANCE FLOOR" would measure a corpus in which the chance floor does not apply, and would print ≈ no improvement from the very change (the four faces) the owner is being asked to sign.

The occurrence census (`rateBp`, a state-frequency measure) is the only one of the four that survives a fixed seed. The drift manifest itself also survives — byte-identity across a refactor is seed-agnostic.

**The irony in the ruling.** C's discarded probe **did** vary the seed: `_c-occ200.mjs:20` generates with `seed: \`occ-${i}\`` over 200 towns. v1 §3.4 dismisses it as "varied tier only" — true of its CONFIG axis, silent on its SEED axis — and the ruling therefore trades a 200-seed corpus for a 4-seed one to gain config breadth, without noticing that the seed is the axis every variety instrument reads.

**Severity: HIGH.** It is the owner's own claim ("nothing will ever be stale") that this sample cannot see.

**Fix.** Two corpora, named separately in car 1 and in §13 row 14:
1. **DRIFT** — the golden's 525 config rows at their four seeds, keyed by `keyOf(config)`, × 2 audiences: the byte-identity manifest for cars 3, 4, 10 (this is what it is good at).
2. **VARIETY** — a seed-varied corpus (C's idiom: ≥ 200 distinct seeds spread over the same config grid, or 525 rows re-seeded `prose-${i}`), which is the ONLY input for the reading sequences (B1–B3), the repeat census, the duplicate-unit rate and the spread arms.
Print which figure came from which corpus on every receipt; state in §13 row 14 that the drift N and the variety N are different numbers.

---

## F2 · BREAKS — a sha *per seed* cannot produce the per-cell classification that cars 8 and 10 and §8.6 require of it

**The claim (v1 §3.6 and §12 car 1):** "**a sha per seed** over `(mount, block, pool, index, face, angle, pieces[], text)` in `DOSSIER_MOUNTS` order".
**What is then asked of that fixture:** §8.6 Shift 1 — "The manifest prints, **per changed cell**, the spine's `(pool, index)` before and after"; car 1 acceptance — "the two audiences differ **ONLY on the 12 mixed pools' cells, the count pinned**"; car 8 — "the manifest diff: semantic `(pool, index)` preserved on 100 % of cells, face moved on ≈ 75 %, the walls/stores cells ADDITIVE"; car 10 — "the manifest **names every REPLACED cell**"; §11 — "the manifest's player face recorded and diffed".

**Why it breaks.** A digest over a concatenation destroys cell identity: from one sha per row you can learn *that* a row moved and nothing else. None of the five italicised obligations is computable from the specified fixture. The precedent v1 copies confirms the shape it is copying: `generatorGoldenMaster.test.js:868-871` writes `out[keyOf(c)] = hashFor(c)` — one hash per row, 67,779 B — and its comparator can only print `drift.push(k)`, a list of row keys (`:891-897`). That is adequate for "the generator did not move"; it is not adequate for "which sentence changed and was the change additive".

Secondary: "per **seed**" is also the wrong key. With four distinct seeds (F1) a seed-keyed fixture holds four rows and 516 towns collide. The golden's own key is the full config tuple + seed (`keyOf`, `:850`).

**Severity: HIGH.** Cars 8 and 10 are the two owner-signed cars; their signature is taken on evidence the instrument cannot produce.

**Fix.** Make the fixture **per cell**: key `${keyOf(config)}::${audience}::${mount}` → `{ pool, index, face, angle, textSha }`, plus a per-row roll-up sha for a fast drift arm. Price it: ~525 × 2 × (mounts that speak) records; at ~30 speaking mounts that is ≈ 31,500 rows ≈ 2–4 MB, against the 67,779 B generator fixture — state the number in car 1 and check it against any fixture-size expectations before the car opens. Add a car-1 arm that *reconstructs* an ADDITIVE/REPLACED classification from a planted edit, so the classifier is convicted before cars 8/10 rely on it.

---

## F3 · BREAKS — car 2's "byte row" in `scripts/.size-baseline.json` reds two live arms and feeds a byte count to eslint as a max-lines ceiling

**The claim (v1 §10 and §12 car 2):** "Car 2 lands: **a byte row for each prose leaf** and a gzipped row for the `data-lazy` chunk"; files: "`scripts/.size-baseline.json` (**a byte row, new kind**)".

**Evidence.** That file has exactly one semantic and two consumers that both enforce it:
- `eslint.config.js:92-96` — `Object.entries(SIZE_BASELINE).filter(([file]) => !file.startsWith('_')).map(([file, max]) => ({ files: [file], rules: { 'max-lines': ['error', { max, … }] } }))`. A row `"src/data/dossierStateProse/economy.generated.js": 641410` becomes a **max-lines ceiling of 641,410**, i.e. a silently disabled rule.
- `tests/lint/sizeBaseline.test.js` — arm 1 asserts `expect(baselineKeys).toEqual(overCeiling)` where `overCeiling` ranges only over files with a layer ceiling, and `ceilingFor()` (`:64-74`) returns `null` for `src/data/**` (its patterns are `src/components/**`, `src/[^/]+`, `src/generators/**`, `src/domain/**`, `src/(store|pdf|lib|hooks|utils)/**`). Arm 2 asserts `expect(measured.has(rel)).toBe(true)` — "is in the size baseline but is not a covered source file". A prose-leaf row fails **both**, and the gzipped `data-lazy` row (not a source file at all) fails both again.

**Severity: HIGH** — car 2 is the car that must land *before any composer byte*, and as written it cannot go green.

**Fix.** A separate artefact with its own test: `scripts/.prose-byte-baseline.json` + `tests/build/proseCorpusBytes.test.js` (byte reads gated on `VERIFY_DIST` — see F4), leaving `.size-baseline.json` a pure max-lines instrument. Say so in the car's files column, and add "the two consumers of `.size-baseline.json` are untouched" to its acceptance.

---

## F4 · BREAKS — "no first-paint byte ratchet exists at the product tip" is false; three budgets exist, they are owner-signed, and car 2 mints a second ruler

**The claim (v1 §10):** "`scripts/.size-baseline.json` holds 19 per-file max-LINES rows and no prose leaf (CONFIRMED); `sizeBaseline.test.js` is a lines ratchet (CONFIRMED); `bundle-analyze.mjs` asserts nothing; **no first-paint byte ratchet exists at the product tip**." Car 2 therefore builds `tests/lint/firstPaintBytes.test.js` **(new)**.

**Evidence — three budgets, live, at this tip.** `tests/build/vendorPdfLazy.test.js:565` `const CLOSURE_BUDGET_BYTES = 1_048_000;` (this is exactly the brief's 1,048,000 — the number v1 cites as "a receipt from the L-MAT tip" is this gate's own constant); `:600` `const CLOSURE_GZIP_BUDGET_BYTES = 337_000;`; `:601` `const CLOSURE_BROTLI_BUDGET_BYTES = 283_000;`. The file records the raise discipline in terms — "Monotone-down unchanged; **raises stay owner-signed**" (`:598`) — and the 2026-09-01 owner word for the last raise (`:562-564`). `npm run check` ends `… && npm run build && npm run verify:dist`, so the budgets are enforced in the gate.

**Three consequences.**
1. A `tests/lint/firstPaintBytes.test.js` with "the ceiling … (§13 row 16)" is a **second ruler for one budget** — the estate's own false-green class (one number, two homes, one of them stale). §13 row 16 asks the owner to sign a ceiling he already signed.
2. v1 never mentions the **gzip and Brotli** ceilings, though §10 estimates "≈ 0.6 MB over the wire". Those two have 4,936 B and 4,431 B of margin (`:588-590`) and are the ones a compressed corpus actually threatens if any leaf ever leaves `data-lazy`.
3. Placing a **byte** assertion in `tests/lint/` breaks the house STALE-DIST POLICY, which is written out at `vendorPdfLazy.test.js:50-68`: "PRESENCE / SIZE / BUDGET assertions … are gated on VERIFY_DIST — they run ONLY in the post-build `npm run verify:dist` re-run … never in the pre-build phase", because `npm run check` runs `test` before `build`. A lint-phase byte read measures the previous build — the documented false-green that let "+293 B ride under a vacuous ratchet". v1's own §10 figure is drawn from exactly such a stale dist ("a build artefact consistent with the tip, **not rebuilt**").

**Severity: HIGH.**

**Fix.** Delete `tests/lint/firstPaintBytes.test.js` from car 2. Extend `tests/build/vendorPdfLazy.test.js` with (a) the prose-leaf byte rows and (b) a `data-lazy` gzip row, both under `requireDistRead` (`VERIFY_DIST === '1'`), and add the chunk-membership assertion there beside the existing eager-closure derivation. Restate §13 row 16 as "raising any of the THREE existing ceilings (raw 1,048,000 / gzip 337,000 / Brotli 283,000) stays owner-signed; this design plans to raise none".

---

## F5 · STRAINS — car 1's `UPDATE_MANIFEST=1` door is not the door this repo has, and it trips a closed roster the car does not name

**The claim (v1 §3.6 / car 1):** "an `UPDATE_MANIFEST=1` door **through** `goldenRecordDoor.js`".

**Evidence.** `goldenRecordDoor.js` does not take an `UPDATE_*` variable: its env is `SIGNATURE_ENV = 'GOLDEN_SHIFT_SIGNED'`, which "must name a signed shift-record FILE. **Its presence is not armament**" (`:44-45`); `recordGolden` refuses with typed codes (`NO_SIGNATURE`, `SURFACE_NOT_REGISTERED`, `DIRTY_TREE`, `PREDICTION_MISS`, …, `:62-74`) and "**a successful write THROWS, by design**" (`:29-31`); the actions are `re-record: owner`, `retire: owner`, `enroll: chair` (`:50-53`). Separately, `tests/lint/goldenFreeze.walker.test.js:99` scans the tree with `GOLDEN_ENV_PATTERN = /^UPDATE_[A-Z_]+$/` and requires every carrier to be "either register-enrolled or on an affirmative, written exclusion roster" (`:27`), with arm 4 a floor sentinel ("the roster may grow, never silently collapse", `:671-674`). A new `UPDATE_MANIFEST` spelling is a new carrier: the walker reds until the **enroll** act lands with it.

**Severity: MEDIUM** (it lands, but car 1's acceptance list is missing two required artefacts and one predicted red).

**Fix.** Car 1's builds/files gain: the `enroll` (chair) shift record, the row it writes into `tests/fixtures/.golden-freeze-register.json`, and the surface name (`dossier-prose-manifest`). Car 1's acceptance gains "`goldenFreeze.walker` green with the new carrier enrolled, not excluded". Car 8's acceptance gains "a **`re-record` (owner)** signed record naming Shift 1, with its prediction, so `PREDICTION_MISS` can fire" — that is the machinery that makes the owner's signature enforceable rather than ceremonial.

---

## F6 · STRAINS — `pieces[]` is inside the base-side sha, but `pieces` only exists from car 3; car 3's sole acceptance is zero drift

**The claim.** §3.6 and car 1 record the tuple `(mount, block, pool, index, face, angle, pieces[], text)` **before** the composer exists; car 3 "builds … `provenance.pieces`" and its acceptance is "manifest drift `[]`; zero corpus bytes".

**Why it strains.** At car 1 there is no `pieces` and no `face`: `legibilityRung` builds `provenance` as `{blockId, poolKey, angle}` (`legibilityRung.js:29`, and the walker's own fixture at `dossierMountRegistry.walker.test.js:642` shows exactly those three keys). The recorder must therefore synthesise both fields at base. If it writes `pieces: []` and car 3 emits `[{role:'spine', key, index, face}]`, **every cell moves** and car 3 fails on its only acceptance for a reason that has nothing to do with the prose. If it synthesises the spine piece, then the synthesis is an untested assumption about a module that does not exist yet.

**Severity: MEDIUM.**

**Fix.** Name the base-side normalisation explicitly in car 1 ("`face: 0`; `pieces: [{role:'spine', key: poolKey, index, face: 0}]` synthesised from the drawn row"), and add a car-3 arm that asserts the composer's `pieces` for an empty candidate list is *identical* to that synthesis — an equality the car proves rather than assumes. Alternatively drop `pieces` from the sha and pin it in a second, additive column that starts at car 3.

---

## F7 · STRAINS — the desks have a hard 800-effective-line ceiling; `generalStateProse.js` sits at 699, and the design puts a candidate function per modifier pool inside them

**The claim.** §4.1: "the desk … simply **calls its modifier pools' candidate functions**"; car 3 edits "the six `*StateProse.js`"; car 9 builds "**candidate functions per desk**" for every MISSING/THIN row; §6.6 sizes the wave at ≈ 770 new pieces.

**Measured** (eslint's own Linter, the enforcer's rule): `generalStateProse.js` **699**, `defenseStateProse.js` **454**, `economyStateProse.js` **334**, `powerStateProse.js` **275**, `warFaithStateProse.js` **251**, `stressorsStateProse.js` **155**. The domain ceiling is **800** (`eslint.config.js:712`; mirrored at `sizeBaseline.test.js:70`), and the escape hatch is closed by policy: `.size-baseline.json`'s header — "Never RAISE a number and **never ADD a file without a decomposition-is-infeasible reason**" — and arm 1 would demand the new row the moment the file crosses.

So the general desk has **101 effective lines** of headroom for its share of ~770 candidate functions plus their `change` flags. On any plausible split it is the first file to red, mid-wave, with the wave's text already written.

**Severity: MEDIUM** (certain to bite; cheap to prevent, expensive to discover at car 9).

**Fix.** Car 3 lands a `*StateProseCandidates.js` leaf per desk (pure key functions, no reads of the corpus), with the `couplingInclusion` LAYER_PATTERNS family or argued row in the same commit (see F10), so the desks keep their one law and the wave has somewhere to grow. Add "effective lines per desk, printed, and the headroom to 800" to the acceptance of cars 3, 9 and 10.

---

## F8 · STRAINS — the "cost ≤ 30 s" acceptance is contradicted by the repo's own precedent for a strictly smaller workload

**The claim.** Car 1 acceptance: "**cost ≤ 30 s (ESTIMATE)**"; §10: "the manifest (525 towns × 2 audiences, ≈ 30 s ESTIMATE) runs as a property test".

**Evidence.** The root `testTimeout` is 20,000 ms (`vite.config.js`, test block). `generatorGoldenMaster.test.js` needs an explicit `120_000` override on *both* its heavy blocks and says why: "**525 full-pipeline generations overrun the root 20s testTimeout** on slow/parallel runners — a wall-clock false positive, not drift" (`:862-869`, `:888-897`). The manifest does that same generation **plus** six composers over ~56 mounts **twice** (two audiences). An acceptance criterion of ≤ 30 s therefore fails the car for wall-clock reasons on the repo's own runners, and a 20 s default would red it outright.

**Severity: MEDIUM** (a car that cannot pass its own acceptance is a car that gets waived, which is how an acceptance stops meaning anything).

**Fix.** Car 1 carries an explicit `120_000` (or higher) per-test override in the same idiom, and the cost becomes a **printed figure** (`N`, seconds, runner) rather than a pass/fail threshold. Consider sharing generated settlements with the golden suite via a helper so the gate pays for 525 generations once, not twice; both suites already run under `scripts/gate-mutex.sh`.

---

## F9 · STRAINS — nothing in the sequence is resumable, and "never a partial" forbids the only natural checkpoint

**The claim.** §12 preamble: "a car that cannot meet its acceptance **lands as a measured refusal, never a partial**"; car 8 is "the REWRITE + FACES wave (**register by register as Opus workflows**)" over all 708 pools with "**Shift 1 signed**" once; car 9 is "block by block from the list".

**Why it strains.** The owner's standing directive is that the five-hour window will cut work off frequently and the program must be prepared for it; the doc has no resume row, no checkpoint artefact, no "where does a successor pick this up" line, and no statement of whether a register is a landable unit. Car 8 as one indivisible car is a wave of 708 pools × 4 faces that must land whole; if it may land per register, then the tree spends weeks in a state where some pools have four faces and others one — lawful under the per-pool FACE-COUNT PIN, but the manifest diff, the variant ratchet and the single Shift-1 signature are all specified as one act. Which it is decides whether the car is resumable at all, and the doc does not say.

**Severity: MEDIUM.**

**Fix.** Split car 8 into sub-cars 8a…8n, one per register, each with: its own manifest diff, its own face-pin rows, its own walked receipt, and an amendment to ONE Shift-1 record (the door supports a surface list; the owner signs the shift once and initials each register's amendment). Give every car a RESUME row naming the dock, the tip sha, the last landed unit and the one command that recomputes state — the same discipline the census (§3.4, sha-stamped) already uses for data.

---

## F10 · STRAINS — no car names the tests it will turn red, and car 5's landing of eight new `src/domain/` modules skips a live baseline act

**The claim.** The §12 table carries "proof" and "acceptance" columns and no **predicted reds** column; car 5 lands `src/domain/prose/{entryWalker,grammarWalker,moveGrammar,composedWalker}.js` with acceptance "anti-vacuity on every arm".

**Evidence.** New modules under `src/domain/` are governed by `tests/lint/couplingInclusion.walker.test.js`: a shrink-only baseline at `tests/lint/.coupling-inclusion-baseline.json` (`:108`) where "A NEW cross-layer pair absent from the baseline REDS unless a registry [row] …" and "the baseline may never GROW" (`:21-26`), whose house answer for a new module is a `LAYER_PATTERNS` family (`:115`) or an argued row **in the same commit**. The instruments are eight files, not four (`skepINSTR/src/domain/prose/`: `entryGround, entryLexicons, entryWalker, grammarWalker, moveGrammar, plantLedger, presenceMeasure, proseFingerprint`), so the landing is twice the surface v1 names.
Good news, measured, so the car is cheap where it matters: all eight are **well under** the 800 ceiling (468, 463, 158, 132, 113, 75, 66, 41), so the landing reds no size arm.

**Severity: MEDIUM.**

**Fix.** Add a **PREDICTED REDS** column to §12 — for each car, the suites that go red and why each red is expected (car 1: `goldenFreeze.walker`; car 2: `sizeBaseline` if the row lands in the wrong file, else none; car 4: `dossierStateProseProjection.contract` arms by name; car 5: `couplingInclusion` + the walker-test roster). Correct car 5's file list to the eight modules and name the layer act.

---

## F11 · STRAINS — "19 per-file max-LINES rows" is 8, and it is labelled CONFIRMED

**The claim (§10):** "`scripts/.size-baseline.json` holds **19 per-file max-LINES rows** and no prose leaf (**CONFIRMED**)".
**Measured:** `total keys 19 / file rows 8` — eleven of the nineteen keys are `_`-prefixed ruling prose that both consumers skip (`eslint.config.js:93`, `sizeBaseline.test.js:87`). The eight rows are `src/App.jsx`, `src/domain/explanation.js`, `applyWorldPulse.js`, `pulseKernel.js`, `roadsKernel.js`, `warTermination.js`, `npcGenerator.js`, `settlementSlice.js`.
The second half of the claim ("no prose leaf") is true and, better, is *structurally* true: `ceilingFor()` returns `null` for `src/data/**`, so no prose leaf can ever appear there — which is the fact §10 should be citing, because it is what makes a 3.5× corpus safe from the lines ratchet.
**Severity: LOW** (no decision turns on it) — but it is a receipt error inside the ratchet section, and the program's own law is that a ledger figure is the skeptic's, never the receipt's.
**Fix.** "8 per-file rows; `src/data/**` carries no layer ceiling at all, so the corpus's growth is outside this instrument by construction."

---

## F12 · STRAINS — four car acceptances are not executed arms

**The claim.** The brief requires each car to carry "the proof (**an executed arm**)". Car 6's acceptance is "the taste and its figures **exist** for the sitting"; car 7's is "every strain S1–S20 has a **written**, numbered, vetoable disposition"; cars 8 and 9 carry "**no round past the second** on any wording set"; car 13's proof is "**468 sentences reach a reader**" with no arm named.
**Why it strains.** Two of these are process facts (cars 6, 7) and are fine if labelled so; "no round past the second" is a claim about an authoring workflow's history that no instrument in this design can see, yet it sits in the acceptance column beside executable arms — which is how an unexecutable row gets counted green. Car 13's is a real property with no instrument.
**Severity: LOW-MEDIUM.**
**Fix.** Split the column into EXECUTED and PROCESS. Make "no round past the second" executable by having each writer workflow emit a round count into its receipt and an arm assert `max(rounds) ≤ 2` over the wave's receipts. Give car 13 an arm: every causal `familyId` is reachable from a shipped caller (the mirror of the "zero callers" finding that put it on the list).

---

## F13 · HOLDS — three load-bearing migration claims I checked and they are true

- **The three new leaves ride the lazy chunk.** `vite.config.js`: `if (id.includes('/src/data/')) return isEagerData(id) ? 'data' : 'data-lazy';` — derived from the eager module graph, not curated, exactly as §10 says. A leaf imported only by desks imported only by lazy tabs cannot land in `data`.
- **A corpus at 2.3 MB reds no lines ratchet.** `ceilingFor()` gives `src/data/**` no ceiling; the leaves are invisible to eslint's `max-lines` and to `sizeBaseline.test.js`.
- **The projector's `--check` really is in the gate.** `dossierStateProseProjection.contract.test.js:186` spawns `scripts/generate-dossier-state-prose.mjs --check` inside the ordinary test run, so car 4's "`--check` green" is an executed arm and the sha-interlock (§3.4) has a live host.
- **Car 3 is genuinely dormant by construction** (the brief's "can it land dormant" question): `drawVariant` (`stateProseKernel.js:301-305`) and a `drawFace` that returns 0 without hashing at modulus 1 leave the drawn index untouched, and empty candidate lists leave the text untouched. No flag is needed for *behaviour*.

## F14 · STRAINS — but the seam still flips at 31 call sites in one commit, with no staging and no rollback but revert

**Measured:** `grep -rn "readStateProse(" src/domain/display/stateProse/*StateProse.js | wc -l` → **31**, over six desks (`generalStateProse` 11, `defenseStateProse` 9, `powerStateProse` 7, `stressorsStateProse` 2, `economyStateProse` 1, `warFaithStateProse` 1). Car 3 converts all of them, edits `stateProseKernel.js`, `legibilityRung.js`, `dossierMounts.js` and two components, and proves the lot with one manifest run. A drift on one desk is diagnosed against a diff spanning six.
**Severity: MEDIUM.**
**Fix.** Stage car 3 as 3a…3f, one desk per landing, each ending on its own zero-drift manifest run; the kernel's `drawFace` + `composeStateProse` land first (unused, provably unreachable), the desks follow. Same total work, six clean bisect points instead of one, and each landing is a five-minute unit — which is also what makes the sequence survive a window cutoff (F9).

---

## What I did NOT test (named, so nobody reads a silence as a pass)

- I ran **no vitest and no build** (fenced). Every "reds"/"goes green" above is read off the arms' own source and their stated invariants, not from an execution of the suite: they are **CONFIRMED as source facts, PLAUSIBLE as run outcomes**.
- I did not re-derive v1's corpus figures (708 / 2,266 / 12 mixed pools / 45.21 % vs 100.00 %) — outside this lens; the truth and data critics own them.
- I did not measure the manifest's true cell count (it needs a composer run over 525 settlements), so F2's ≈ 31,500-record / 2–4 MB estimate is an ESTIMATE, flagged as one.
- I did not verify that `data-lazy` is a single chunk at a *fresh* build; v1's own figure comes from a stale `dist` and the repo's stale-dist policy says so in terms.
