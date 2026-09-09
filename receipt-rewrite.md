# RECEIPT — the REWRITE train

Seat: Opus 5 — Fable-unvalidated. Lane: REWRITE. Chair session 67af10e4.

---

## CAR 8a — THE KERNEL, THE INSTRUMENTS AND THE GATE

**STATUS: PARTIAL — in flight.** Chartered at SITTING §T.10 (2026-09-09); ARCH §12 row 8a; §N.2 SIGNED;
Part B §20–§23. Dock `$SC/laneREWRITE`, cut at the §917 product tip `29ec62425` (detached HEAD,
porcelain 0 at open, runners 0 at open — both executed, exit 0).

Every figure below comes from a command that ran in this dock with its exit code captured. A figure
without a command is not in this file. ZERO reader-facing bytes is the car's own fence: the manifest
classifier prints `[]` at every commit except where §N.2's RE-INDEXED row is the declared exception.

### Open state (executed at car open)

| fact | command | value |
|---|---|---|
| dock tip | `git log --oneline -1` | `29ec62425` |
| porcelain | `git status --porcelain \| wc -l` | 0 |
| runners | `V=vit; V2=est; pgrep -fl "$V$V2" \| grep -v gate-mutex \| wc -l` | 0 |
| node | `node -v` | v24.12.0 |

### The ten commits

| # | item | sha | status |
|---|---|---|---|
| 8a-1 | the index-stable draw (§N.2) | **`f4005cccd`** | **LANDED** |
| 8a-2 | passage shapes — the licensed fourth draw + the distribution report | — | pending |
| 8a-3 | the taste's instruments landed by name, without the annex rows | — | pending |
| 8a-4 | `armThread` + the kinship tiebreak | — | pending |
| 8a-5 | the wave's gate `scripts/prose-wave-gate.mjs` | — | pending |
| 8a-6 | the arm-Q cure + the field-synonym table | — | pending |
| 8a-7 | the face-count ratchet | — | pending |
| 8a-8 | T-F12's class list re-cut | — | pending |
| 8a-9 | the connectives lists to the floors (public-copy drafts) | — | pending |
| 8a-10 | the register car | — | pending |

---

<!-- CAR 8a body appended below as each commit lands -->
## 8a-1 — THE INDEX-STABLE DRAW (§N.2 SIGNED; ARCH §13 row 22; SHIFT REGISTER `draw-formula`)

### What landed

`drawVariant` in `src/domain/display/stateProse/stateProseKernel.js` moved from
`eligible[avalanche32(fnv1a32(seed::blockId::poolKey)) % eligible.length]` to the ARGMAX of
`avalanche32(fnv1a32(seed::blockId::poolKey::v<vid>))` over the eligible set, ties to the LOWER
vid. The seedless case still reads `eligible[0]` (law 4, unchanged and re-proven). The face draw
at `drawFace` keeps its `::w` key and its modulus, untouched.

**THE FALLBACK, AND WHY IT IS NOT TWO REGIMES.** A pool whose members carry no `vid` keeps the
shipped modulus. That is the causal register (R2) and nothing else: `vid` is the STATE schema's
by ruling (§13 row 14), and R2 carries none on any of its 468 variants. Keying such a pool on a
position inside the already-filtered `eligible` array would be exactly as unstable as the
modulus while looking stable. Two arms hold the line: the shipped state corpus is swept and must
never reach the fallback, and the causal register is swept and must agree with the pre-cure draw
seed for seed.

### ⛔ FINDING — `vid: 0` IS A REAL ID, AND A `> 0` GUARD WOULD HAVE SPLIT THE CORPUS SILENTLY

Written first as `Number.isInteger(vid) && vid > 0`. The kernel sweep convicted it: SEVEN shipped
pools lead with a `canonical` row numbered **0** and number 0..n-1, while the other 701 number
1..n. Under the `> 0` guard those seven read as ID-LESS and would have stayed on the modulus while
the other 701 moved — a silent split of one corpus into two draw regimes, invisible to every
instrument. Cured to `>= 0`; the seven are named in the test so the zero cannot be tidied away:

    DS-ECO-3 :: ADEQUATE · SHORTAGE × trade-dependent · SURPLUS × trade-dependent
    DS-ECO-6 :: TIER: minor shadow activity (≥3) · TIER: significant off-book activity (≥15)
    DS-ECO-7 :: CATALOG · TALLIES

These are exactly the seven `canonical` rows ARCH §16 item 5 names and 8a item 7 must record as
single-faced. Measured, not quoted: `vid` histogram over the six leaves is
`0:7  1:708  2:708  3:675  4:121  5:32  6:15`; pools whose vids are not contiguous from the
pool's first row: 0 of 708.

### EXECUTED ACCEPTANCE

Command: `npx vitest run tests/domain/stateProseKernel.test.js` — **37 passed, 0 failed**.

**(a) UNIFORMITY.** 547 three-variant pools x 10,000 fixed seeds = **5,470,000 reads**.

| grain | figure |
|---|---|
| pooled share by annex slot | **33.312 % · 33.375 % · 33.313 %** (§N.2 reference 33.30 / 33.35 / 33.35) |
| deepest pooled departure from one third | **0.0413 pp** |
| chi-square, df 2 | **4.201** (critical 5.991 @ .05 · 9.210 @ .01 · 13.816 @ .001) |
| deepest PER-POOL deviation, over 1,641 shares | **3.43 SE**, at economy :: DS-ECO-11 :: TERRAIN: Forest |

⛔ **REFUSAL, WITH THE MEASUREMENT — the brief's floor as literally worded is unachievable by any
uniform draw, and so is the obvious repair.** The brief asks for "on every three-variant pool over
10,000 seeds each vid within 2 SE of one third". 547 pools is 1,641 share measurements and the
largest of 1,641 standard-normal deviations is ~3.4 SE BY CONSTRUCTION; measured 3.43. A draw that
passed that floor would be suspiciously FLAT, which is a different defect. The obvious repair —
the same 2 SE floor at the POOLED grain — is also a coin flip: at n = 5,470,000 the 2 SE band is
0.081 pp wide and three shares sit in it, so a uniform draw lands outside about one time in seven.
It did, on the first run: 33.375 % against a band ending at 33.374. WHAT LANDED INSTEAD: the
textbook test the two were reaching for, a chi-square goodness-of-fit at the pooled grain held at
the 0.001 critical value, plus an absolute 0.15 pp tolerance, plus a per-pool 4.5 SE ceiling. A
draw biased toward low ids reads TENS of SE out, so the ceiling refuses the failure that matters.

**(b) APPEND-SAFETY.** 547 three-variant pools x 2,000 seeds = **1,094,000 reads**, both draws
measured in one loop so the contrast is derived and not quoted.

| draw | reads moved | of those, to the NEW wording | between two OLD wordings |
|---|---|---|---|
| **law 6 (argmax)** | 273,643 = **25.01 %** | 273,643 = **100.00 %** | **0** |
| shipped `% length` | 820,444 = **74.99 %** | 273,492 = 33.33 % | **546,952** |

The PROPERTY, not the percentage, is what the arm asserts: not one read moves between two old
wordings. (§N.2's own figures over the whole corpus were 24.17 % against 75.71 %; three-variant
pools are the exact-1/4 case.) The planted variant takes the NEXT annex row per pool (4 on the 540
numbered 1..3, 3 on the seven numbered 0..2), so the plant is a lawful append everywhere.

**(c) A4, repeat-call identity** — the same call twice is the same variant, and 400 seeds prove a
covert sibling in the pool cannot move a player read (the key names no position).
**Law 4 survives law 6** — all three spellings of "no seed" read index 0 and take NO hash, counted
on `Math.imul` with a live control.
**⛔ A FACT NEVER MOVES** — on all 708 state pools x 6 seeds (4,248 draws) the drawn variant is a
member of the same eligible set as before, proven as set membership.

### THE ONE-TIME RE-INDEX — THE OWNER'S VETO SURFACE (§N.2)

    node scripts/prose-manifest-cells.mjs --out <base>     # at 29ec62425      exit 0
    node scripts/prose-manifest-cells.mjs --out <tip>      # at the draw change exit 0
    node scripts/prose-manifest-diff.mjs <base> <tip>                          exit 0

    PROSE MANIFEST DIFF · 73284 cells on the tip side
      REPLACED       cells       0 · towns     0
      RE-INDEXED     cells   43685 · towns   525
      ADDITIVE       cells       0 · towns     0
      WORDING-ONLY   cells       0 · towns     0
      UNCHANGED      cells   29599 · towns   525
      ADDED          cells       0
      REMOVED        cells       0
      (of the UNCHANGED, cells whose audience-filtered INDEX moved with no reader-visible change: 0)

**RE-INDEXED 43,685 of 73,284 = 59.61 %**, over all 525 towns and all 40 blocks reached by DRIFT.
**REPLACED 0 is the car's fence, executed on every cell: not one changed POOL, so no fact moved.**
WORDING-ONLY 0 and ADDITIVE 0 say the same from the other side.

By audience: dm 21,994 of 36,660 = **59.99 %** · player 21,691 of 36,624 = **59.23 %**.

Per block class (share descending, all 40; blocks with zero re-indexed cells: **0 of 40**):

| block | share | block | share | block | share | block | share |
|---|---|---|---|---|---|---|---|
| DS-GEN-5 | 100.00 % | DS-DEF-2 | 61.88 % | DS-DEF-5 | 43.35 % | DS-ECO-2 | 5.71 % |
| DS-STR-1 | 100.00 % | DS-GEN-2 | 58.74 % | DS-ECO-11 | 41.99 % | DS-DEF-9 | 1.71 % |
| DS-DEF-1 | 99.91 % | DS-POW-5 | 50.76 % | DS-GEN-9 | 39.56 % | DS-FTH-2 | 1.71 % |
| DS-REL-2 | 99.71 % | DS-DEF-8 | 50.00 % | DS-SUP-3 | 35.94 % | DS-GEN-17 | 1.14 % |
| DS-ECO-8 | 99.43 % | DS-DEF-11 | 49.14 % | DS-POW-6 | 34.02 % | DS-POW-7 | 1.14 % |
| DS-POW-1 | 99.42 % | DS-ECO-6 | 49.03 % | DS-ECO-9 | 27.40 % | DS-GEN-7 | 0.68 % |
| DS-GEN-14 | 98.86 % | DS-POW-2 | 45.90 % | DS-GEN-6 | 17.43 % | DS-GEN-18 | 0.47 % |
| DS-ECO-1 | 97.33 % | DS-GEN-16 | 96.57 % | DS-ECO-10 | 12.76 % | | |
| DS-DEF-3 | 95.43 % | DS-ECO-12 | 94.57 % | DS-GEN-13 | 87.24 % | | |
| DS-GEN-12 | 84.19 % | DS-DEF-6 | 81.21 % | DS-CND-1 | 77.71 % | DS-POW-4 | 73.52 % |
| DS-GEN-3 | 64.78 % | DS-GEN-11 | 62.86 % | | | | |

The record is COMMITTED as a declared `reIndexed` block on the register's `draw-formula` row and
PRINTED by the contract test, which holds it to its own arithmetic and asserts the fence
(REPLACED / WORDING-ONLY / ADDITIVE / ADDED / REMOVED all 0). It is declared rather than pinned
because nothing recomputes it from the leaves: it takes a DRIFT run at two shas.

    npx vitest run tests/data/dossierStateProseProjection.contract.test.js   68 passed
    [re-index] REWRITE car 8a-1 over DRIFT — 525 configurations x 2 audiences, base 29ec62425
      cells 73284
      RE-INDEXED    43685  59.61 %   <- the one-time cost
      UNCHANGED     29599  40.39 %
      REPLACED          0  <- a FACT would have moved
      WORDING-ONLY      0   ADDITIVE 0   ADDED 0   REMOVED 0

### THE REGISTER ROW MOVED IN THE SAME COMMIT (the register's own idiom)

`draw-formula`'s `source` pin named the old expression verbatim, so it reds the instant the
mechanism moves — the register working exactly as designed. Row rewritten: `mechanism`, `shift`,
`door`, `idiom` and a three-substring `source` pin over the new argmax, the tie rule and the
fallback line, plus the `reIndexed` declared block. 22 insertions, 6 deletions.

### ⛔ THREE INSTRUMENTS THE DRAW CHANGE MOVED, EACH TRACED AND DECLARED

**1. The manifest recorder's `drawAgrees` footprint — a defect I introduced and cured.**
`tests/helpers/dossierManifest.js` re-derives the draw over the AUDIBLE pool to measure the
slot-anchoring filter's footprint, and `poolIndex()` handed it a stripped variant shape carrying
`idx` but not `vid`. The re-derivation therefore took the modulus FALLBACK while the page took the
argmax, and the figure read **47,227 of 73,284**. Cured by carrying `vid` through
`dossierCorpus.js` and `poolIndex()`; the figure is now **3,914**, against **5,966** at base. The
footprint genuinely SHRANK, for a reason the draw makes plain: dropping a slot-unanchored variant
moves an argmax only when that variant was the winner, where a modulus re-rolls on any change of
length at all.

**2. `tests/domain/composeStateProse.test.js` — A KNOWN BLIND SPOT CLOSED.** The arm
"⚠ THE CELL ARM CANNOT TELL `vid` FROM `index` AT THIS TIP" was written with the sentence "the day
a car makes a player face draw past a covert variant it reds here". This is that day. On
`DS-POW-1 :: governanceFractured true` (four variants, the third `dm-only`) the player's draw moved
to the fourth authored variant, which sits at audible index 2 and authored index 3. The pin moves
**0 -> 36**, the cells are named rather than counted, and the per-cell equality arm above it is
sensitive to the coordinate confusion for the first time. 47 passed.

**3. `tests/property/dossierProseManifest.test.js` — the audience-divergence pin 345 -> 309.**
Cause: exactly one draw. `DS-POW-1 :: governanceFractured true` moved off its covert variant onto
a player-visible one, so the two faces now agree there; the remaining 309 are
`DS-ECO-6 :: TIER: minor shadow activity (≥3)`, whose three covert variants leave the player one
eligible line, so its faces differ by construction and no draw rule can change that.

⚠ **FINDING RECORDED IN THE TEST, NOT ONLY HERE: 345, 309 and 36 ARE NOT THAT MANY INDEPENDENT
FACTS.** Every configuration of the DRIFT corpus carries the same `_seed` (`golden-master-v3`) and
the draw key is `seed::blockId::poolKey`, so one pool has ONE drawn variant across all 525 towns
and a per-pool count is a town count wearing a draw's clothes. The control's breadth fell from two
mixed pools to one without anything about the audience filter moving, and ANY future draw change
re-rolls it. Widening it needs the recorder's `--seeds` family rather than DRIFT — a car of its
own, flagged for the skeptic pass.

### THREE PRE-EXISTING PINS ON DRAWN TEXT, RE-SEEDED NOT DELETED

Each named a specific sentence and each is a liveness ANCHOR whose helper says in its own words
"choose an anchor that still travels this path — do not delete the anchor to get green".

| file | arm | act |
|---|---|---|
| `tests/domain/defenseStateProseDesk.test.js` | `{seat}` fills with the generated name | seed `seat-a` -> `seat-c`; only v1 of `capture capture` fills `{seat}` |
| `tests/domain/warFaithStateProseDesk.test.js` | the occupier SLOT-ROLE INVERSION | LOCAL seed `thornwall-b`, not the shared `DM` constant, so no other arm re-draws |
| `tests/domain/warFaithStateProseDesk.test.js` | the creed name reaches the slot | a second desk on seed `thornwall-b`; the original desk keeps its seed because its other assertions read POOL KEYS, which no seed can move |

91 · 28 · 28 passed. Desks otherwise untouched: economy 59, general 69, power 77, stressors 21,
causal 15, dmFieldProjection 14, dossierDepthTabs 25, faithPanelModel 11 — all passed.

### `tests/lint` WHOLE

    npx vitest run tests/lint      147 files passed / 2 failed  ·  2,490 tests passed / 2 (first run)

Both reds were mine and one is cured:

- `seedLoopTotality.walker.test.js` — my two new seed loops asserted INLINE, which is the exact
  lower-bound defect the walker refuses. Converted to `collectSeedFailures` +
  `expectNoSeedFailures`. The helper's exemption is FILE-WIDE, so the file's frozen row
  (ceiling 1, a pre-existing loop) then read 0 and the walker demanded the win be banked: the
  row is DELETED with its reason, shrink-only as the header requires. **9 passed.**
- `sovereigntyLightingContract.walker.test.js` — the lighting census `titles` 24,049 -> 24,050.
  DECLARED RED, carried to 8a-10: the refreeze ritual
  (`LIGHTING_CENSUS_REFREEZE=… LIGHTING_CENSUS_NOTE=… npx vitest run …`) REFUSES a dirty tree by
  design, so it is a register-car act and not a per-commit one. ARCH §12 lists `lighting` as a
  predicted door for this car.

### ⛔ A PRE-EXISTING RED INHERITED FROM §917, NOT THIS CAR'S — REPORTED, NOT CURED

`tests/copy/voiceMechanics.test.js` reds at the dock's base tip `29ec62425`:

    src/domain/display/labelBands.js: baseline em:0 bang:0 → current em:5 bang:0
    src/domain/display/stateProse/generalStateProse.js: baseline em:0 bang:0 → current em:3 bang:0

Established by execution, not inference: `git diff --stat 29ec62425` over both files is EMPTY
(neither is touched by this car), `tests/copy/.voice-mechanics-baseline.json` is unmodified, and
the baseline carries NO ENTRY for either file (55 entries, neither name present) so the comparison
runs against an implicit `{em:0, bang:0}`. The em dashes sit in FILE-HEADER COMMENTS, which
suggests the instrument's `stringLiteralContents` is admitting comment text — an instrument
question, not a voice question. Left for the chair: it is outside 8a's charter and the voice
baseline is a shrink-only surface belonging to whoever owns those files.

### Gates

| gate | command | result |
|---|---|---|
| typecheck | `npx tsc --noEmit -p tsconfig.full.json` | **173 errors, 0 in any file this car touched** (base 173; the one I added — `StateProseVariant` had no `vid` — cured by extending the typedef) |
| eslint | `npx eslint <the ten touched files>` | **exit 0, no output** |
| runners | before every vitest, own shell | **0** every time |

