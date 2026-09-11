# SKEPTIC FOLD — lane MEASURE, LENS: THE BYTE RATCHETS, THE FENCES AND THE RECEIPT (car 2 + the consist)

Seat: Opus 5 — Fable-unvalidated (verifier). Dock: `skepMEASURE` @ `fcd98a3db`, base `8522a17b2`.
Porcelain BEFORE 0 · Porcelain AFTER 0. Every figure below came from a command I ran here.

## VERDICT SUMMARY — 20 claims tested: 15 CONFIRMED · 4 PARTLY · 1 UNTESTED · 0 REFUTED

The car-2 arithmetic is sound. **Every headline number the receipt asserts reproduced to the
byte on a re-measurement I ran**: the seven leaves, the 641,410 / 121,630 / 5.2735, the whole
apportionment table, the 4.3654x headroom, the sum landing on 2,800,000 with zero remainder,
the 622,222 gzip total inside the band, both data-lazy ceilings, the two plants' reds and
their restore hashes, OSR 1972, strict 1120/1120, typecheck 173/173, PN 225 exact=225, the
voice scan literal/em counts, 147 lint files, 10 manifest arms. Nothing in this lens is
refuted.

Four corrections, one of them structural.

---

## F1 (MEDIUM) — THE MEMBERSHIP ARM'S *PRESENCE* LIMB IS NOT `VERIFY_DIST`-GATED, AND IT WILL FALSE-RED ON THE AUTHORING WAVE

The brief and the receipt both describe the extension as landing "under `requireDistRead`".
Measured: of the eleven new arms, **two** are `it.skipIf(!requireDistRead)` (the two size
rows). The chunk-membership arm — `every prose leaf lands in a data-lazy chunk and in NO
first-paint chunk` — sits under `describe.runIf(distExists)` only, so it runs in the plain
pre-build test phase whenever a `dist/` is on disk.

That arm is not purely an absence check. It carries a PRESENCE limb:

    if (!carriers.length) { findings.push(`${rel}: reached NO emitted chunk...`); continue; }

The file's own STALE-DIST POLICY (`tests/build/vendorPdfLazy.test.js:51-68`) rules exactly
this case: PRESENCE assertions are `VERIFY_DIST`-gated *because* a stale dist makes them
false-red; only ABSENCE assertions may stay ungated, on the ground that a stale dist can
only under-report absence.

**The mechanism, executed.** The fingerprint is re-derived from the *source* every run, so a
source rewrite moves it while the stale chunk still carries the old text:

    TIP fingerprint  (161B): "The town has gained a large share of itself in a short "...
    AFTER-REWRITE fp (162B): "This town has gained a large share of itself in a short"...
    fingerprint changed: true
    does the OLD chunk contain the NEW fingerprint? false   => carriers = [] => RED

`npm run check` runs `test` before `build` (the file says so itself), so on the authoring
wave — the wave this instrument exists for — the plain test phase reds on every leaf whose
prose moved, with a message that names two wrong causes ("its desk lost its last importer /
the fingerprint no longer survives minification") and not the real one (stale dist). The
derivation's own liveness is what makes this certain: the more the wave rewrites, the more
leaves red.

CURE (no product bytes): split the arm. Keep the four stray/closure/eager-data/entry
comparisons ungated (they are true absence checks, and the policy wants them ungated); move
the `!carriers.length` "reached NO emitted chunk" limb — and the causal leaf's carrier read —
behind `requireDistRead`, where the post-build re-run measures a fresh dist.

## F2 (LOW) — "ELEVEN ARMS IN THREE NEW DESCRIBES" IS TWO, AND THE WRONG NUMBER IS NOW COMMITTED IN A FROZEN BASELINE

Measured at both ends of the consist:

    base 8522a17b2:  it( 30 + it.skipIf( 11 = 41 sites · describe( 5
    tip  fcd98a3db:  it( 39 + it.skipIf( 13 = 52 sites · describe( 7

The arm count is exactly right (41 -> 52, +11, as the receipt says). The describe count is
**+2, not +3** — the diff adds precisely two `describe(` lines. The receipt says "three
suites" (car 2 §1) and "three new describes" (§10), and that second wording was carried into
`tests/lint/.lighting-census-baseline.json`'s committed `note`, where a later reader will
take it as the record of what moved. The *numbers* in that baseline are all correct
(files 2552->2553, credited 2177->2178, titles 23816->23833 = the 17 arms, suiteTitles
6372->6376 = the 4 describes of `proseCorpusBytes.test.js`; `parked` 375 unmoved, which is
why `tests/build/`'s +11/+2 are correctly uncounted). Only the prose is wrong.

## F3 (LOW) — "BOTH BUNDLED PACKAGES ARE SYMLINKS" NAMES TWO OF AT LEAST FIVE; THE RELINK LAW'S *OUTCOME* IS CONFIRMED ANYWAY

The receipt prints `ls -la node_modules/immer node_modules/seedrandom` and concludes "Both
bundled packages are SYMLINKS, so the dock cannot bundle either twice". `vite.config.js:531-545`
also bundles **zustand** into `vendor-state`, and the closure carries `vendor-react`
(react, react-dom) and `vendor-icons`. The brief's law is "every `node_modules/<pkg>` must be
a SYMLINK"; two were shown.

The law's outcome is nonetheless confirmed, twice over. In a peer dock built the same way,
**453 of 456 top-level entries are symlinks** (the three real dirs are `node_modules` itself,
`.vite` and `.vite-temp`), and immer / seedrandom / zustand / react / react-dom all point at
the main tree. And a double-bundled package moves chunk bytes, yet the closure landed
byte-exactly on the §914 tip's figure. Re-added from the receipt's own printed rows:

    raw    5349+114865+126461+570296+10457+4228+193156+17310 = 1,042,122  (1,048,000 - 5,878)
    gzip   2605+33963+40464+180108+4264+1756+60438+7224      =   330,822  (337,000 - 6,178)
    brotli 2237+28103+34507+148886+3773+1575+52140+6534      =   277,755  (283,000 - 5,245)

All three margins are the receipt's. The measured correction it makes to ARCH §10
(1,042,086 / 5,914 is 36 B low) stands: the brief's number is the one that reproduces.

## F4 (LOW) — §5's BLOCK IS PRESENTED AS COMMAND OUTPUT BUT IS ABRIDGED

`$SC/measure/car2-dist.mjs`'s own log prints, per leaf, an `fp(NNNB) "..."` line above the
carriers line. The receipt's §5 block silently drops all seven. Every figure is faithful and
the seven fingerprint lengths reappear in §6 (184/189/161/136/168/160/231, which the log
confirms), so nothing is hidden — but the block is an assembly, not a transcript, and unlike
§2/§3/§8 it carries no `<...>` or `...` to say so.

Cosmetic sibling: §8's sha-pin table labels its middle column `tip 710ef8e08` (car 1b) rather
than car 2's tip. I re-took all three shas at `fcd98a3db` and they are identical to base, so
the pin holds either way.

---

## THE FENCES, EACH READ

`git diff --name-status 8522a17b2..fcd98a3db` = **23 files**, every one inside the allowed set.

**src moved in exactly two places, both the census island:** `src/domain/prose/wiringCensus.js`
(M) and `src/domain/prose/wiringBranch.js` (A). Neither has a product importer — the only
readers in the tree are `tests/lint/proseWiringCensus.walker.test.js`,
`tests/helpers/dossierComposedFill.js`, `scripts/wiring-census.mjs` and the sweep. The walker
itself fences this (`:473-479`: the census/branch spelling may appear in those files and
nowhere else), so ARCH §11's "no walker or census in the product import graph" holds.
**Car 2 alone moves zero src bytes** — its five staged paths are `scripts/.prose-byte-baseline.json`,
`scripts/mutation-coverage-manifest.json`, `scripts/mutation-sweep.sh`,
`tests/build/vendorPdfLazy.test.js`, `tests/lint/proseCorpusBytes.test.js`, 688 insertions,
0 deletions.

**NO composer, pool leaf, persisted shape or seed input moved.** `git diff --name-only` over
`src/data/**`, `src/domain/display/**`, `src/store/**`, `src/generators/**` returns empty.
`tests/fixtures/generator-golden-master.json` is untouched. The one golden-carrier motion is
car 1's `generatorGoldenMaster.test.js` one-spelling refactor: the corpus and `keyOf` moved
verbatim into `tests/helpers/goldenMasterCorpus.js`, `goldenCorpus` is still a function so
`corpus()` still calls, and the fixture bytes did not move. The register is UNFROZEN
(`frozenAt: null`) and the new `dossier-prose-manifest` row is enrolled all-null, which is
what that register's own arms require while unfrozen.

**The two size consumers are byte-identical to base**, sha-pinned at base / tip / worktree:

    scripts/.size-baseline.json       a3f07c4833ac9060 = = 
    tests/lint/sizeBaseline.test.js   715d64e386a54044 = = 
    eslint.config.js                  11c19f863006d7cf = = 
    vite.config.js                    3df402aeebbbff49 = = 
    package.json                      b7e943dc48082708 = = 

`git diff --stat` over them prints nothing. The three constitutional ceilings are literal-
identical at base and tip (`1_048_000` / `337_000` / `283_000`, lines 565/595/596), now
additionally pinned by the new arm at 1667-1669.

**Dry reads, all reproduced exactly:**

    OSR        observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.  exit 0
    strict     [domain-strict] no strict-type regressions (1120 errors, ceiling 1120).
    typecheck  [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    PN         baseline=225 live=225 parseErrors=0 · exact=225 rekeyed=0 relocated=0 FELL=0 NEW=0
    writer-reach  exit 0 (WRWALKER HOLD, the standing state; no new writer entered)
    eslint on the two car-2 files  exit 0
    voice-scan  proseCorpusBytes literals 161 em 6 bang 0 toFixed 0 · vendorPdfLazy 425/30/0/0

**Trailers.** All thirteen commits carry `Seat: Opus 5 — Fable-unvalidated`, `Lane: MEASURE`
and `Co-Authored-By: Claude Opus 5`. Every commit's staged paths match its car's declaration.

## THE ARITHMETIC, RECOMPUTED FROM THE LEAVES

    111827  21248  5.2629  defense       488168 / 108482   headroom 4.3654  share 17.4346%
     90212  18293  4.9315  economy       393810 /  87513   headroom 4.3654  share 14.0646%
    182518  31752  5.7482  general       796761 / 177058   headroom 4.3654  share 28.4557%
     81802  15328  5.3368  power         357097 /  79355   headroom 4.3654  share 12.7535%
     59298  12961  4.5751  stressors     258858 /  57524   headroom 4.3654  share  9.2449%
    115753  22048  5.2500  warFaith      505306 / 112290   headroom 4.3654  share 18.0466%
    210260  36700  5.7292  causal        210260 /  36700   (zero headroom, the ruling)
    SIX raw 641410 gzip 121630 ratio 5.2735  ·  node v24.12.0 zlib 1.3.1-470d3a2
    SUM ceilRaw 2800000 (delta 0)  SUM ceilGzip 622222  band 500000..650000: true

`DATA_LAZY_RAW_CEILING_BYTES 3_098_110` = 939,520 + (2,800,000 - 641,410) and
`DATA_LAZY_GZIP_CEILING_BYTES 771_897` = 271,305 + (622,222 - 121,630). Both re-derive.

A note rather than a finding: the 2.8 MB is §10's ceiling-on-a-ceiling (1,200 pieces, where
the budget is ~470), so the wave's realistic ~2.2 MB landing keeps roughly 600 KB of slack.
Judgment call 1 (six leaves, not seven) is the right reading of §10, whose base 638,800 is
"the six real leaves". When car 4 projects three new leaves into `dossierStateProse/`, the
EXACT-SET arm forces them into `stateLeafKeys` and the genesis-basis arm forces
`genesisBasisRawStateLeaves` up with them, which silently re-apportions every existing
ceiling downward by ~2.7 %. The instrument stays closed; the car should expect the move.

## THE PLANTS, RE-EXECUTED IN THIS DOCK

PLANT A (sweep #95, extracted verbatim by `sed -n '1335p'`):

    anchor occurrences 1 · pristine md5 bc8ee1ea0d9bd8f6ef63dba9da9d7ba6 (59298 B)
    planted 60408 (+1110) · leaf still parses, 1 export
    planted gzip 13025 vs committed 12961 = +64 against a 129 B band  => the GZIP ARM DOES NOT FIRE
    npx vitest run tests/lint/proseCorpusBytes.test.js  =>  1 failed | 16 passed (17)
      "stressors.generated.js: grew to 60408 raw bytes, over the committed 59298..."
    restored: md5 bc8ee1ea... · cmp IDENTICAL · porcelain 0 · clean run 17 passed (17)

The receipt's account of the gzip arm is exactly right and is the instrument's shape, not a
gap: a compressed ratchet cannot see repetitive corpus growth. RAW is the exact ruler.

PLANT B (eager static import into `src/store/settlementSlice.js`, **no build, no dist in this
dock at all**):

    pristine md5 5d861e48bd629a55e172b487c7629b6f (matches the receipt)
    npx vitest run tests/build/vendorPdfLazy.test.js  =>  2 failed | 25 passed | 26 skipped (53)
      x no prose LEAF is in the first-paint module graph
      x NO module in the first-paint graph imports a prose leaf
    restored: md5 5d861e48... · cmp IDENTICAL · porcelain 0

Both absence arms fire in the UNGATED half with no dist present — the claim holds, and it is
the half that stops the regression at source-edit time. (Clean baseline here: 27 passed | 26
skipped (53); the receipt's 40/13 is the same file with a dist on disk, and the 13-arm
difference is exactly the `distExists`-only cohort that F1 is about.)

## THE REBASE-FREE LANDING — WHAT THE §915 DOORS WILL MOVE

This consist lands on `8522a17b2` directly, with no rebase. `run-registers-915.sh` names the
same `BASE=8522a17b2`, so the two trains are siblings on one parent.

1. **`tests/lint/.lighting-census-baseline.json` — the one real collision.** Both trains
   rewrite it. §915's script says in terms that its lighting door is NOT run because "the
   census frozen at 62f201796 still matches"; MEASURE's car 2b refroze it at `55d7f696b`
   with files 2553 / credited 2178 / titles 23833 / suiteTitles 6376. Whichever lands second
   takes a textual conflict on this file. The *counts* survive either order — §915's car 12
   moved no test file, and MEASURE's two new test files are additive — so the cure is to keep
   MEASURE's tuple and re-stamp `measuredAtSha` / `note`, then re-run the plain walker.
2. **`tests/lint/.prose-numerics-baseline.json`** — the PN door runs `--write`. MEASURE
   contributes no drift (225 exact, 0 fell, 0 new), so it should not move for this consist.
3. **`scripts/.writer-reach-baseline.json`** — the writer-reach door runs `--write`
   (provenance). MEASURE's dry run exits 0 and no new writer entered.
4. **`tests/lint/.dossier-mounts-baseline.json`** — the mounts door; predicted no change and
   MEASURE moved no mount.
5. **OSR (`scripts/.observed-shape-readers-baseline.json`) will NOT move.** MEASURE adds a new
   src file (`wiringBranch.js`), which is the case that would normally admit a reader — but
   the scan reports 1972 exactly matching the frozen inventory and the inventory names neither
   census file. No new reader entered src.

## WHAT I DID NOT TEST

- **`check-test-ratchet.mjs` (UNTESTED).** It spawns the whole suite
  (`vitest run --exclude=tests/build/**`), which my fence forbids; I terminated it and
  re-verified runner count 0 and porcelain 0. `scripts/.test-ratchet-baseline.json` is not in
  the consist diff, so the ratchet is claimed unmoved but I have not executed it.
- **The whole `tests/lint` run (147 files / 2,386 assertions).** Fence: focused files only. I
  confirmed the file count statically (146 at base -> 147 at tip) and ran the two focused
  suites the claim turns on.
- **The "ten-module byte fence"** — I could not identify that instrument by name in the tree.
- **The one chartered `vite build`.** Not re-run (forbidden). The dist figures are re-derived
  from the receipt's own printed per-file rows, which sum correctly, and from
  `$SC/measure/car2-dist.log`.

Porcelain BEFORE 0 · Porcelain AFTER 0 · HEAD unmoved at `fcd98a3db`.
Seat: Opus 5 — Fable-unvalidated
