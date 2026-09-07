# Town cartography / MF-T2R — the HIGH-WATER evidence read landed app-side, and the three channels proven whole: `deriveHighWater` re-expressed from the sealed tip over the LANDED tier table, channel 1 read under declared `peakTier` precedence, and the two writer rosters that keep the channels honest frozen by source scan

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `421c73456c5f1cb682605169f2b32ee69014a61a`
  ⚠⚠ **AS AUTHORED — the row above now names the LANDING SLOT (see the Landing note below); the
  BUILD base was `b10ed1a1` (CT-3).** The continuation that follows was written at that base:
  — the CT-3 landing, read with `git rev-parse` at the lane's opening and re-read at the
  resume (the branch did not move under the member). Every figure below was executed at THIS
  base by the implementing lane TE-T2R; nothing is inherited from the compile
  (`draft-PRODUCERS-PLAN.md`, pinned to `1a437bca`) except where a row says so and names the
  re-derivation. ⚠ The compile's census figure (`titles: 20719`) was STALE at this base and is
  re-derived in the census note.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Landing note (TE-PRODUCERS-LANDING, 2026-08-23, ODQ §457/§467 — THE PRODUCER TRAIN):** authored at BUILD
  base `b10ed1a1` as holding tip `f65b3ff3` (pinned `refs/preserve/holding-t2r`); landed as ONE stacked landing with its two
  siblings (MF-T2R → MF-T2Q → MF-T2N, each rebased in sequence onto the moving tip) at slot `421c7345` (the MAP STACK
  landing act, landings 32–35). Rebased implementation commits `e69793cf → d7c49b64 → 658d425c → cd858478` (authored `23e0bcd9 → a6001d47 → 387a3b34 → f65b3ff3`);
  this member is the FIRST of the three. Entered at **LANDED** directly — the §410 form, as the
  MAP STACK did: MF-T2H's READY reservation on the census walker stands until HK-A lands, so the §417 deferred row
  could only enter the manifest at a terminal status, and did, at this act. Census: slot `2505 / 365 / 2140 / 20781 / 5797`;
  this member's position `2506 / 365 / 2141 / 20788 / 5798`; the train's ONE live tuple `2508 / 365 / 2143 / 20801 / 5800` convicted at the
  train tip (33/33) with the negative controls *"the estate's file count moved — re-measure, do not re-word: expected 2508 to be 2505"* (control A, the summed delta +3) and *"… expected 2508 to be 2507"* (control B, MF-T2Q's position put back — MF-T2N's +1 alone, the proof that no sibling's delta was dropped by the merge). Every digest this packet cites
  (the delivered files, the preamble, the generator-golden fixture, the sealed port source) re-verified at the landed tree — none moved,
  so no RE-HASHED note is owed. The two worldPulse MODIFY hosts of MF-T2Q were UNMOVED at the slot (blob-identical at b10ed1a1 and 421c7345).
- **Landing follow-on (TE-PRODUCERS-LANDING, 2026-08-23, ODQ §469 — `fix(MF-T2R)`):** the landing's widened
  pre-gate sweep convicted `tests/lint/clampPrimitiveBaseline.test.js` naming THIS leaf — `highWater.js` defined a local
  `const clamp` (the estate has ONE clamp primitive, `src/kernel/math.js`), hidden inside an already-banked red: the
  received set read `…(76)` at the train tip against `…(75)` at the build base, and the +1 was this file. The build
  lane's "RED, identical — PRE-EXISTING (isolation: member moved aside)" was a title-level reading; the received-list
  diff is the instrument that convicts. CURED IN-TRAIN as ONE import (`import { clamp } from '../kernel/math.js'`)
  replacing the local definition; nothing else moved. BEHAVIOR-IDENTICAL, by the one call site: `clamp(1 - current / peak, 0, 1)`
  runs only under `peak > 0`; `current = Math.max(0, num(s.population, 0))` is finite by `num`'s `Number.isFinite`
  narrowing, and every reading's `peak` is finite (`floorOf` → `num(…, 0)`; the ring maximum is taken only over
  `Number.isFinite(p)` entries; channel 3's `current + lost` sums `Math.max(0, Math.floor(num(stamp.exodus, 0)))`
  rows), so the argument is always finite and the kernel clamp's non-finite arm (→ `lo`) is unreachable here — no
  same-seed shift, and the golden manifest `29c6cc8f…` is bytewise unchanged. RE-HASHED: the leaf's committed blob is now
  `2ff3948f…`; every `021808ba…` citation in the §10.2 / §6 prose below names the pre-§469 blob AS PROVED THEN and is
  left verbatim. Mutants m2 (channel-3 exodus addition dropped → A2 red) and m3 (understate flipped → A2 + A4 + A7 red)
  re-planted against the cured leaf and restored digest-exact; clean control 7/7. `clampPrimitiveBaseline` is back to
  the banked base reading (`…(75)`, the same thirteen pre-existing offenders, this file absent); both typecheck
  ratchets at their ceilings (173 / 1134).
- **Charter and rulings:** `draft-PRODUCERS-PLAN.md` §5 (this member), §§1–2 (the measured
  substrate and the three lawful shapes), §8 (execution law), §9 (STOP set), §10–§11
  (judgments, RAISED). Ruled at **ODQ §433** (C1–C6 signed, J1–J8 ratified; TE-T2R dispatched)
  and **re-ruled at ODQ §434** after this lane's S0 STOP: the channel-1 erasure finding
  confirmed, the reader built with `peakTier` precedence, A6 re-scoped to the frozen
  demoting-writer roster, the ring roster pinned at the MEASURED nine-plus-one, the window prose
  stating the MEASURED twelve, and two engine cures docketed to the owner (§9 below).
- **Depends on:** nothing non-terminal. The member reads the LANDED `popToTier` /
  `POPULATION_RANGES` / `TIER_ORDER` (`src/data/constants.js`), the LANDED `peakTier` stamp
  (`worldPulse/settlementLifecycleKernel.js`, PHASE A) and the LANDED ring and calamity writers
  it pins. MF-T2N and MF-T2Q are siblings on the same producer train with no symbol dependency
  either way (charter J8: R → Q → N is a weak landing preference, not an order of need).
- **Binds forward:** the tierGrammar PORT member (a later port tranche, not this train). ODQ
  §433 C5 is LAW for it: *the port member that lands `tierGrammar` imports
  `src/domain/highWater.js` and deletes its local `deriveHighWater` IN THE SAME COMMIT* — two
  truths of the high-water law never coexist on the branch. Also the content-train consumer
  car(s) that will speak these facts (ODQ §433 C3: producers land DARK; the dossier consumers
  docket to the content train, record-gated).
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the
  file at `b10ed1a1` by this lane (`git show b10ed1a1:… | shasum -a 256`) and again at the
  member tip, identical both times and identical to the value MF-T2Bf carries, so no re-stamp
  occurred in the window. Its §P1 refutations (R-MF-4 governs the port source), §P2 hazard
  dispositions, §P3 anchor preflight, §P5 census law, §P6 mutant hygiene, §P7 STOP set and §P8
  capsule law bind this packet and are not restated. **Stamp: GRANTED at ODQ §312.2b** — the
  stamped column applies (eight members per engine train; this train has three).
- **Collision group:** `producers` (the §433 train). At this base **every one of the 148
  registered packets is terminal** (147 LANDED, 1 SUPERSEDED), re-counted by execution against
  `PACKET_MANIFEST.json`. The two delivered paths and this packet's own path are held by NO
  packet. The shared census path `tests/lint/sovereigntyLightingContract.walker.test.js` is
  held by 67 packets, ALL LANDED, so it is FREE — and this packet does NOT reserve it (§417's
  T2J shape: the row rides this packet verbatim for the chair's landing act; see the census
  note).
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves
  the branch. This lane moved no ref. ⚠ The member's first commit (`23e0bcd9`) was a session
  checkpoint made with `--no-verify` (declared lawful at §439.4); the hook ran on the packet
  commit and on the §443 follow-on. The leaf moved ONCE after the checkpoint — the §443 C-a cure
  — and every §10.2 proof was re-executed against the cured blob `021808ba…`.

> **`censusAuthorization`:** this packet moves the test census by
> **`+1 files / +0 parked / +1 credited / +7 titles / +1 suiteTitles`** — exactly the charter's
> predicted `+1 / 0 / +1 / +7 / +1`. **Base tuple, RE-DERIVED at `b10ed1a1`:
> `2497 / 364 / 2133 / 20723 / 5785`** (the charter's `20723`-vs-`20719` staleness named, not
> absorbed). **After tuple, read from the walker's own failure message figure by figure and then
> CONFIRMED by a full green pass (33/33) with the row applied:
> `2498 / 364 / 2134 / 20730 / 5786`.** ONE new acceptance file, `tests/domain/highWater.test.js`,
> credited (one literal `describe`, seven straight-line `it`, no `.each`/`runIf`/nesting).
> Its authorizing decisions are **ODQ §306.4(a)** (the dossier-surface batch adopted as W8
> prerequisites), **§421(2)** (the producer train's dispatch), **§433** (this member's charter
> ruling) and **§434** (the channel-1 re-ruling whose rosters this file carries). The family's
> stamp is **GRANTED** at ODQ §312.2b.
> ⭐⭐ **STACKED LANDING (ODQ §457/§467) — convicted at the train tip, never carried.** Slot tuple
> (`claude/composite-r4` = `421c7345`, the MAP STACK): `2505 / 365 / 2140 / 20781 / 5797`; this member's position in the
> train re-derives to `2506 / 365 / 2141 / 20788 / 5798`; the train's ONE live tuple `2508 / 365 / 2143 / 20801 / 5800` was
> convicted at the train tip (33/33) with two negative controls — the slot's own tuple put back reds at `files`:
> *"the estate's file count moved — re-measure, do not re-word: expected 2508 to be 2505"* (the summed delta +3), and
> MF-T2Q's position tuple put back reds *"expected 2508 to be 2507"* (MF-T2N's delta alone). The DELTA `+1/+0/+1/+7/+1` crossed the
> rebase; the authored tuples above are the BUILD-base history.
>
> ⛔ **THE ROW IS DEFERRED TO THE LANDING ACT (ODQ §417, the T2J shape, J-TET2J-1).** The walker
> edit was made, proved green, and then REVERTED ON PURPOSE at the member commit: the row is
> inserted by the chair's landing act at the train terminal, so the census arm of
> `sovereigntyLightingContract.walker` REDS at this member's tip — **that is the ONE NAMED
> interior red (charter §6 / preamble §P7.12), not a defect.** A second member-caused red
> (the observed-shape reader walker) was raised at the resume, RULED at §443 and CURED in the
> follow-on — §10; no other red stands at this tip. The exact text to paste, replacing
> the `files: … suiteTitles: …` line inside the `CENSUS` object (at ~`:5240` at this base), is:
>
> ```
>     // ── RE-RECORDED 2026-08-22 BY TE-T2R (MF-T2R), CAUSE ATTRIBUTED ──────────
>     // `files` 2497 → 2498, `credited` 2133 → 2134, `titles` 20,723 → 20,730,
>     // `suiteTitles` 5,785 → 5,786. `parked` is UNCHANGED at 364.
>     // ONE new acceptance file, tests/domain/highWater.test.js, credited (one literal
>     // `describe`, straight-line `it`, no `.each`/`runIf`/nesting) carrying SEVEN arms —
>     //   ⭐ guard-the-guard: the two source scans are live before any roster assertion runs
>     //   ⭐ the lived interval with a calamity strike, and its counterfactual without it
>     //   ⭐ channel 1's declared precedence: the peakTier stamp leads, the disagreement is residual
>     //   ⭐ channel 2's TWELVE-entry window, and the peak older than it that it understates
>     //   ⭐ the frozen populationHistory writer roster (nine appends, one constructor, one uncapped)
>     //   ⭐ the frozen settlement-tier writer roster (three of five modules can lower a tier)
>     //   ⭐ the §434 gap TYPED rather than silent, inventing no peak from a demoted state
>     // `censusAuthorization`: ODQ §306.4(a) (the dossier-surface batch adopted as W8
>     // prerequisites), §421(2) (the producer train's dispatch), §433 (this member's charter
>     // ruling, C1-C6 signed), §434 (the channel-1 re-ruling this file's rosters carry).
>     // ⛔ ATTRIBUTED BY ISOLATION, NOT BY ARITHMETIC, at THIS base. The tuple was read from
>     //   the arm's own failure message at each step ("expected 2498 to be 2497"), never
>     //   computed; the member adds exactly one test file and no other lane's file moved.
>     files: 2498, parked: 364, credited: 2134, titles: 20730, suiteTitles: 5786,
> ```
>
> ⚠ The chair re-derives the BASE tuple at the terminal before pasting: it was 20,719 at the
> charter's compile base and 20,723 at `b10ed1a1`, and sibling members on the same train each
> move it by their own declared delta (sum-of-deltas at the terminal, §433.1's T2M note).

> ⛔ **PORT SOURCE PROVENANCE (preamble §P1 R-MF-4).** The sandbox is not a git repository. This
> lane read the sealed source from the preserve ref `refs/preserve/map-sandbox-w3f-sealed`
> (`ee0db96d`) and **re-hashed it before any edit**; it reproduces the SHA-256 the charter's
> R-MF-4 row cites, so the preserve ref IS the packet-cited port source.
>
> | source module | SHA-256 | cited by |
> |---|---|---|
> | `src/domain/townMap/fabric/tierGrammar.js` @ `refs/preserve/map-sandbox-w3f-sealed` | `f152d700ea93c0610529c0875ddb3e456b87e9f407bcad854157657f163f9ac6` | charter §1.1 / §5.1 (R-MF-4 row) — **MATCH, executed** |
>
> **Delivered files, hashed from their COMMITTED blobs at the member tip** (`git show HEAD:<path>
> | shasum -a 256`), and their effective lines under eslint `max-lines`
> `{ skipBlankLines, skipComments }` measured with eslint's own `Linter`:
>
> | file | action | SHA-256 (committed blob) | effective lines |
> |---|---|---|---:|
> | `src/domain/highWater.js` | CREATE | `2ff3948f00a8eff1fe1392766080254223aa4a400f4de085e2c89e10a5a5923a` (the §469 landing follow-on — the kernel-clamp import; `021808ba…` at the §443 follow-on; `718bcee4…` at `a6001d47`) | **104** of 250 (unchanged by §469: one import line replaced one `const` line; 107 before §443; charter predicted ~80–110) |
> | `tests/domain/highWater.test.js` | CREATE | `bfa9371fa5f3ef8825ebb0c62e32fb1c92dde8ca65475cd3aa3716fa90484c15` | 197 (test; not a production budget) |
>
> Neither path exists at `b10ed1a1` (`git ls-tree b10ed1a1 -- <path>` is empty for both and for
> this packet's own path), so the member collides with nothing it creates.
> **Existing logic modified: 0. Coupling census: 0.** `git show --stat` of the member commits
> is two CREATEs and zero modified files — ODQ §434 ruling 5 ("ZERO engine bytes move") executed.

---

## §0 · WHAT THIS MEMBER IS, AND WHAT IT REFUSES

One Shape-1 pure deriver at the `src/domain/` root (the `ageBands.js` precedent; charter §2,
J2 ratified at §433 C2) and one acceptance file carrying two structural rosters:

1. **`src/domain/highWater.js` — `deriveHighWater(settlement)` RE-EXPRESSED from the sealed
   tip, not copied.** The sandbox kept a LOCAL tier table so a render-time fabric chunk would not
   import a generation-side module; a domain-root leaf has no such constraint, and a second tier
   table would be a second truth. The leaf reads the LANDED `popToTier` / `POPULATION_RANGES` /
   `TIER_ORDER`. The channels and the understate-never-invent law port verbatim in substance;
   the window prose states what the engine MEASURABLY does (§2.3). Channel 3 is read through
   the existing dossier projection `display/calamityLedger.js` (ODQ §443; §2.4).
2. **Channel 1 read in TWO ARMS under DECLARED PRECEDENCE (ODQ §434):** the monotone
   `config.peakTier` / `_config.peakTier` stamp LEADS; the stored-`tier`-above-`popToTier`
   disagreement is the RESIDUAL. Both are read; neither invents. Where the stamp is absent the
   result carries the typed gap `NO_PEAK_TIER_STAMP` and `understated: true`.
3. **Two writer rosters frozen BY SOURCE SCAN inside the acceptance file** (charter J6/J7 — a
   domain-tree pin, not a new `tests/lint/**` walker, so no §P3b mutation-coverage row is
   minted): the `populationHistory` ring writers (NINE appends + ONE constructor, one UNCAPPED)
   and the settlement-tier writers (FIVE modules, EIGHTEEN sites, THREE adjudicated
   `DEMOTING`). A new writer of either kind reds on arrival and must be adjudicated into the
   table with a written reason.

**IT REFUSES** to cure the engine. No pulse path is edited; the three demoting tier writers and
the one uncapped ring writer are FROZEN AS THEY ARE and their cures are OWNER-DOCKETED (§9,
ODQ §434 ruling "two engine cures"). It does not make MF-CB1's population-cut benchmark arm
pass (charter §5 affirmative exclusion: the benchmark's leaves are generated and un-pulsed;
feeding a reader conjures no lived history). It mints no registry verb, flag, persisted field,
spatial ledger row, coupling-census row, barrel export or consumer wiring; it touches no
`src/generators/**` or `src/data/**` path; it writes nothing at generation (Shape 3 is
owner-docketed at charter O1). It does not port the FABRIC consumer (the tierGrammar port's
`deriveHighWater` call site stays with the port tranche under the C5 import-swap law).

## §1 · THE §434 FINDING — THE ENGINE'S DEMOTING WRITE DESTROYS THE EVIDENCE IT CREATES

The charter's §5.3 predicted that no pulse path lowers a stored `tier` ("the lifecycle kernel
promotes `thorp→hamlet` and never demotes") and reserved the opposite finding to the chair.
S0's whole-directory tier-writer sweep refuted the prediction. **THREE pulse paths lower a
stored `settlement.tier`:**

| writer | site | what it writes |
|---|---|---|
| `worldPulse/calamityKernel.js` | the strike seam (`popToTier(afterDeaths - exodus)`, written only when strictly LOWER) | a demotion-only re-derivation from the post-loss population |
| `worldPulse/tierOutcomeApply.js` | `tier: toTier` on an outcome whose `direction` may be `'demotion'` | the demotion direction of the tier-outcome apply |
| `worldPulse/settlementLifecycleFirstClass.js` | the resettle path (three sites: `tier`, `config.tier`, `_config.tier`) | `'thorp'` forced — "the glory is aspired to, not inherited" |

**Executed, not argued** (`probe-channel1.mjs` over the SEALED deriver, re-run at the resume —
`/tmp/t2r/probe-channel1-resume.log`, exit 0): a city of **5,100** struck on the default
catastrophic severity loses 608 to deaths and 840 to exodus and comes out **`town` at 4,492**.
Run through the sealed `deriveHighWater` with history stripped (the save-round-trip / regen
shape), the settlement **as the engine leaves it** reads `demoted: false, deficit: 0,
evidence: []`; the **same settlement with its stored tier preserved** reads `demoted: true,
deficit: 0.4386`. Same souls, same seed — **the demoting write erases channel 1's evidence at
the moment it creates it.** The LANDED leaf over the same pair (`probe-landed-leaf-resume.log`)
reads A as `demoted: false, gaps: ['NO_PEAK_TIER_STAMP'], understated: true` and B as
`demoted: true, deficit: 0.1018` — the deficit differs from the sealed reading because the
landed city floor is 5,001 where the sealed fabric's is 8,001 (§2.2, the declared band
divergence), and the `understated` flag is the member's typed answer to the gap.

`config.peakTier` (monotone, write-once-upward, `settlementLifecycleKernel.js` PHASE A) survives
decline — but it is gated on the settlement-lifecycle layer and is **`null` on the post-strike
settlement** (probe arm C). That is why ODQ §434 made the stamp the LEADING arm, kept the
disagreement as the residual, and left the gap DOCUMENTED as a typed understatement rather than
cured: the sealed law's own "understates rather than invents" covers it, and the reader never
guesses. ⛔ **THE READER MUST NEVER INFER A PEAK FROM A DEMOTED STATE** — acceptance arm 7 and
mutant m3 hold that line.

**Banked as build-era lesson 11 (ODQ §434):** an evidence reader's channel can be destroyed by
the same event that creates it — before porting ANY reader, sweep EVERY writer of the channel's
substrate and pin the destroyer roster.

## §2 · THE READER'S CONTRACT

### §2.1 Inputs, outputs, totality

`deriveHighWater(settlement: HighWaterInput | null | undefined): HighWater`. TOTAL: any input,
including `null` and malformed shapes, yields a typed result; every field is narrowed in-body
(`population` → finite non-negative number or 0; `tier` → a `TIER_ORDER` member or ignored;
`populationHistory` / `calamityHistory` → arrays or empty; `config.peakTier ?? _config.peakTier`
→ a `TIER_ORDER` member or null). No `Date`, no `Math.random`, no `Intl`, no I/O. The result:

| field | meaning |
|---|---|
| `population` | the historical maximum the reader can SEE — a FLOOR, never a guess |
| `tier` | `popToTier(population)` over the LANDED table |
| `window` | what the reader could actually look at, DECLARED; `BLIND:` clauses name what it could not |
| `demoted` | `deficit > DEMOTION_THRESHOLD` (0.08, ported verbatim from the sealed tip — the ruin ring's visibility floor, not a dial this member introduces) |
| `deficit` | `clamp(1 - current / peak, 0, 1)`; 0 when the peak is 0 |
| `evidence` | one line per contributing reading |
| `channels` | which of `HIGH_WATER_CHANNELS` reached the peak, in trust order (`PEAK_TIER_STAMP`, `TIER_DISAGREEMENT`, `POPULATION_RING`, `DATED_LOSSES`) |
| `gaps` | which of `HIGH_WATER_GAPS` apply (`NO_PEAK_TIER_STAMP`, `RING_WINDOW_SATURATED`) — closed vocabulary |
| `understated` | `gaps.length > 0` — the peak is a floor |
| `derivation` | `'HIGH_WATER_V1'` — FROZEN v1; changing any rule is a declared shift by construction |

⭐ **Every channel is read, then the readings are compared.** The peak is the highest reading
any channel justifies, and `channels`/`evidence` credit EVERY channel that independently reaches
it — not merely the one that raised it first — so the credited list reports the state of the
evidence rather than an accident of evaluation order. The credited walk is explicit (no
`.map().filter(Boolean)`) so the entries stay typed end to end; that shape is what cured the
any-cast red (§8 J-TET2R-3).

### §2.2 The declared divergence: the LANDED bands, not the sealed fabric's

The landed tier bands and the sealed fabric's DISAGREE above village — town 901–5000 vs
901–8000, city 5001–25000 vs 8001–40000, metropolis 25001–100000 vs 40001–200000. A tier floor
read here is the LANDED floor, because the app-side answer must be the one the rest of the app
already believes (charter §5.1: "a second tier table would be a second truth"). This is stated
in the leaf header as a DECLARED SEMANTIC, and §1's deficit figures show its consequence
(0.4386 sealed vs 0.1018 landed on the same counterfactual). The tierGrammar port inherits it
under C5.

### §2.3 The window prose states the MEASURED twelve (ODQ §434 ruling 4)

Every capped append site spells `[...prev.slice(-11), entry]`: ELEVEN are retained and one is
appended, so the ring SETTLES AT TWELVE. The sealed doc block said "the ring caps at 11";
executed, the steady state is 12 (`calamityKernel.js`'s extra outer `.slice(-12)` is a no-op
for exactly this reason). `RING_RETAINED_PREFIX = 11`, `RING_WINDOW_ENTRIES = 12`; the window
prose reads "the ring settles at 12 — 11 retained plus one appended", and
`RING_WINDOW_SATURATED` fires at `history.length >= 12`. Declared divergence from the sealed
prose; the charter's acceptance 4 ("ELEVEN-entry window") is amended by §434 to TWELVE.

### §2.4 Channel 3 reads the calamity LEDGER, not the strike record (ODQ §443)

`buildCalamityLedger(s)` projects each persisted stamp through `projectCalamityStamp`
(`exodus` → `Math.max(0, Math.floor(num(exodus, 0)))`, non-object stamps dropped) and returns
`{ entries, count, totalExodus, … }`; channel 3 reads `count` and `totalExodus`, so
`population = current + Σ exodus` and the `DATED_LOSSES` evidence line are BEHAVIOR-IDENTICAL to
the direct read on every engine stamp (`calamityKernel.js` writes integer `exodus`, e.g. 840 in
A2). The ONE declared narrowing: on a MALFORMED record a fractional `exodus` is floored and a
non-object entry is not counted — the ledger's honest count, never an invented soul. The window
prose names the channel as `the calamity ledger: N dated loss record(s)`. `HighWaterInput`
types the field by importing the ledger's own `CalStampLike`, so the projection is called
without a cast and both typecheckers hold their ceilings. The leaf inherits the ledger's
DISPLAY-LAZY law (header; §10.2).

## §3 · THE TWO ROSTERS, MEASURED AT THIS BASE (the §417 wrong-denominator lesson applied)

Both scans walk EVERY non-test `.js` under `src/domain/worldPulse` (413 files, 394 top-level,
nesting included) — whole-directory, never import-derived — so a writer in a module nothing
imports still counts. The guard-the-guard arm proves the walk descends (some path has more than
four segments) before any exact-set assertion runs, because 394 of 413 files are top-level and a
count threshold alone would never notice a walk that stopped recursing (mutant m4).

**ROSTER 1 — `populationHistory` ring writers** (charter §1.2 said FIVE; MEASURED: NINE appends
+ ONE constructor; ruled at §434 ruling 3):

| module | kind | cap |
|---|---|---|
| `calamityKernel.js` · `demographicsKernel.js` · `demographicsMigration.js` · `migrationKernel.js` · `populationDynamics.js` · `settlementLifecycleFirstClass.js` · `settlementLifecycleKernel.js` · `tierOutcomeApply.js` | append | capped (`.slice(-11)`) |
| `realmVerbExecution.js` | append | ⚠ **UNCAPPED** — `[...history, {…}]` with no `.slice`; a parent founding many steadings keeps a LONGER ring, which only ever helps this reader; FROZEN AS-IS, owner-docketed (§9 O-ii) |
| `lineageMemberBirth.js` | constructor | n/a |

**ROSTER 2 — settlement-tier writers** (A6 re-scoped at §434 ruling 2 from the refuted "no pulse
path demotes" pin to the FROZEN DEMOTING-WRITER ROSTER):

| module | sites | verdict |
|---|---:|---|
| `calamityKernel.js` | 1 | **DEMOTING** |
| `lineageMemberBirth.js` | 4 | CONSTRUCTOR (a chartered steading starts at village) |
| `settlementLifecycleFirstClass.js` | 3 | **DEMOTING** (resettle forces `thorp`) |
| `settlementLifecycleKernel.js` | 5 | PROMOTING (satellite birth at `thorp`; promotion/fold writes at `hamlet`) |
| `tierOutcomeApply.js` | 5 | **DEMOTING** (`tier: toTier` on a `direction: 'demotion'` outcome) |

`pantheon.js` is reached by the scan and ARGUED OUT with a written reason (a DEITY's standing
tier, not a settlement's size tier) in the `ARGUED_NON_SETTLEMENT` table — the
`ARGUED_UNLAYERED` idiom; a new module there must be argued or it counts. A FOURTH demoting
writer cannot arrive without reddening the exact-set line and being adjudicated with its reason.

## §4 · PREFLIGHT, EXECUTED AT `b10ed1a1` AND RE-EXECUTED AT THE MEMBER TIP

| # | row | result |
|---|---|---|
| 1 | `git rev-parse claude/composite-r4` at opening and at resume | `b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d` both times — unmoved across the whole member |
| 2 | port-source SHA-256 vs the R-MF-4 row | MATCH (`f152d700…`), re-hashed from the preserve ref before the port |
| 3 | preamble SHA-256 at base and at tip | `0706aad6…` both — no re-stamp in the window |
| 4 | the two delivered paths and this packet's path at base | ABSENT (`git ls-tree` empty) |
| 5 | §417 duplicate-path probe on the shared census path | 67 holders, ALL LANDED; zero non-terminal packets in the 148-row manifest — the path is FREE and is NOT reserved here |
| 6 | coupling census scope | `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse\|spatial)\//` (`tests/lint/couplingInclusion.walker.test.js`); the 179-entry unlayered baseline holds ZERO domain-root leaves; `src/domain/highWater.js` is out of scope — charter §1.7 confirmed, cost ZERO |
| 7 | generator golden, BEFORE and AFTER the member (`tests/property/generatorGoldenMaster.test.js`) | 1 file / 3 tests passed, exit 0 both times; `tests/fixtures/generator-golden-master.json` bytewise identical at `29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8` (67,779 bytes) — the Shape-1 dormancy claim EXECUTED (charter §9.1 fence) |
| 8 | anchors (§P3) | `tests/lint/negativeAssertionAnchor.walker.test.js` 9/9 green at the member; every negative carries `// anchored:` or routes through `expectAbsentWithAnchor` BY NAME. ⚠ The walker reds on a two-line `// anchored:` comment whose LAST line lacks the marker — found and cured before the proof |
| 9 | census tuple at base, re-derived | `2497 / 364 / 2133 / 20723 / 5785` (the charter's `20719` was stale) |
| 10 | census tuple with the member, read from the walker's own failure messages then confirmed green 33/33 | `2498 / 364 / 2134 / 20730 / 5786` — exactly `+1 / 0 / +1 / +7 / +1`; then REVERTED per §417 (the named interior red) |
| 11 | effective lines, eslint `Linter` `max-lines {skipBlankLines, skipComments}` | leaf **104** of 250 after §443 (107 before); no hot file opened; no `scripts/.size-baseline.json` row |
| 12 | `package.json` / `package-lock.json` motion | none — no §349.2 mint trigger; the lane's `npm ci` tree stays valid (`npm ls` exit 0) |
| 13 | the two typecheck configurations, by name, bare, at the member tip | `typecheck:ratchet` → `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` exit 0 · `typecheck:domain:strict` → `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` exit 0 |
| 14 | `tests/lint/domainAnyCastBaseline.test.js` (the monotone-down any-cast ledger) | RED at `23e0bcd9` (three `any`-holes in the leaf — MINE); CURED at `a6001d47` by typedef (`HighWaterInput`; `TIER_FLOOR` built by enumeration), never by widening; re-proved green |
| 15 | raw C0 control bytes in every authored file (`LC_ALL=C grep -c $'[\x01-\x08\x0b\x0c\x0e-\x1f]'`) | 0 in the leaf, the test, this packet, the manifest and the index — U+001F has entered lane prose three times this program, so it is scanned, not assumed |
| 16 | the enforcement-claims `CLAIM_RE` (`tests/docs/enforcement-claims.test.js`) over this packet | 0 hits |
| 17 | `tests/lint/observedShapeReaders.walker.test.js` with the member (after §443) | GREEN; `A1/A7` reads **387 / 1409 / 1995**, the base figures exactly — the leaf adds NO reader row (§10.2) |

## §5 · ACCEPTANCE — SEVEN ARMS, ONE LITERAL `describe`, STRAIGHT-LINE `it` (7/7 green, exit 0)

`npx vitest run tests/domain/highWater.test.js` — `describe('MF-T2R — the high-water evidence
read, and the channels proven whole')`:

| # | arm | what it proves |
|---|---|---|
| A1 | **guard-the-guard** | `PULSE_FILES > 300`, the walk DESCENDS (a path deeper than four segments exists), both scans non-empty, `HIGH_WATER_CHANNELS.length === 4`, `HIGH_WATER_GAPS.length === 2` — before any roster assertion can pass on nothing |
| A2 | **the lived interval, with and without the strike** (charter acceptance 1+2, the §306.2 input-trap law; channel 3 via the calamity ledger after §443 — 7/7 re-proved, walker at 387/1409/1995) | a real settlement through `forceCalamityStrike` (year 20, tick 1040, catastrophic): ONE dated stamp, `exodus > 0`, `result.population === current + exodus`, `demoted: true`, `DATED_LOSSES` credited, the evidence names the souls; the COUNTERFACTUAL without the strike reads `population === current`, `demoted: false`, `deficit: 0`, and `DATED_LOSSES` ABSENT (anchored by the positive arm above it); plus the determinism companion (`toEqual` on a second derivation) |
| A3 | **channel 1's declared precedence** (§434 ruling 1) | stamp present → `PEAK_TIER_STAMP` credited, `demoted: true`, `TIER_DISAGREEMENT` absent (anchored); stamp absent with a stored tier above its population → `TIER_DISAGREEMENT` credited, the evidence says "a recorded demotion", `PEAK_TIER_STAMP` absent (anchored); BOTH present → `channels` is exactly `['PEAK_TIER_STAMP']` and `population` is 5,001 (the LANDED city floor) |
| A4 | **channel 2's TWELVE-entry window** (§434 ruling 4) | `RING_WINDOW_ENTRIES === 12 === RING_RETAINED_PREFIX + 1`; a ring built by the engine's own idiom for thirty writes settles at 12; the window prose carries "the ring settles at 12" and "11 retained plus one appended" (positive control); `RING_WINDOW_SATURATED` present; the 9,000 peak that fell out thirty writes ago is UNDERSTATED — `population === 430`, `demoted: false` |
| A5 | **the frozen ring-writer roster** (§434 ruling 3) | live scan `toEqual` the frozen eleven rows; nine `append`, one `constructor`, exactly one `UNCAPPED` |
| A6 | **the frozen settlement-tier writer roster** (§434 ruling 2) | live scan minus the argued exclusion `toEqual` the frozen five `{module, sites}` rows; the `DEMOTING` set is exactly the three §434 writers; every argued exclusion carries a reason longer than 40 characters |
| A7 | **the §434 gap is TYPED, never silent** (§434 ruling 1, second half) | the engine's own demoting write executed then its records stripped: `tier === 'town'`, `popToTier === 'town'`; the reader reports `population === current`, `demoted: false`, `NO_PEAK_TIER_STAMP` in `gaps`, `understated: true`, the window names §434, `evidence: []`; then the stamp is added and `understated` flips to false with a HIGHER population — the anchor for the closed-vocabulary negative |

The charter's acceptance 6 ("no pulse tier-writer lowers a stored tier") is REFUTED by S0 and
REPLACED by A6 under §434 ruling 2 — a pin over a false invariant would have landed the wrong
truth with green tests. Cases omitted, not replaced: no persistence round-trip (nothing is
written), no privacy boundary (no rendered surface), no idempotent-write case (no writer).

## §6 · MUTANTS — m1–m4 ALL CONVICT, planted against the CURED leaf and restored digest-exact

Harness `/tmp/t2r/mutants.sh` (re-run mutexed as `mutants-443.sh`); every conviction re-run and
re-banked against the cured leaf `718bcee4…` and AGAIN against the §443 leaf `021808ba…` (test
`bfa9371f…`), so no conviction rests on a superseded shape:

| # | mutant | expected | executed |
|---|---|---|---|
| m1 | the ring-saturation branch deleted | A4 red | **RED** — `RING_WINDOW_SATURATED` absent |
| m2 | channel 3's exodus addition dropped | A2 red | **RED** — `population` reads `current`, not `current + exodus` |
| m3 | understate flipped to INVENT (a peak floor raised without evidence) | A7 red | **RED on A2, A4 AND A7** — the invention shows up everywhere the reader is supposed to stay at its floor |
| m4 | the scan walk stops recursing | A1 red | **RED** — the nesting assertion in the guard-the-guard arm |
| control | the cured leaf restored | green | **PASS**, 7/7, digest `718bcee4…` reproduced; after §443 digest `021808ba…` reproduced |

⚠ **Two earlier mutant candidates were INERT and were REPLACED — the record matters (§P6):**
a `>` → `>=` flip on the residual arm convicted nothing, because an equal-rank tier floor is
always ≤ the current population, so the mutation is semantically dead; and the non-recursive
walk convicted nothing until the guard gained the NESTING assertion — 394 of 413 worldPulse
files are top-level, so a count threshold alone never noticed. An equivalent mutant is banked as
a property, never left as luck (J-TET2J-8).

## §7 · EXACT CHANGE MANIFEST

| Action | File | Region | Delta | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/highWater.js` | new domain-root leaf | **104** effective of 250 | `deriveHighWater`, `HIGH_WATER_CHANNELS`, `HIGH_WATER_GAPS`, `RING_RETAINED_PREFIX`, `RING_WINDOW_ENTRIES`, `DEMOTION_THRESHOLD`; imports `../data/constants.js`, `../kernel/math.js` (`clamp`, §469) and `./display/calamityLedger.js` (§443) only; pure; DISPLAY-LAZY by inheritance |
| `CREATE` | `tests/domain/highWater.test.js` | new acceptance file | 197 (test) | one literal `describe`, seven straight-line `it`; the two source-scan rosters; anchored negatives through `expectAbsentWithAnchor` |
| `DOC` | `docs/implementation/packets/town-cartography/MF-T2R.md` | new | — | this packet |
| `DOC` | `docs/implementation/PACKET_MANIFEST.json` | one packet row appended by TEXT surgery (parsed to verify, never re-serialised) | — | registration |

`docs/implementation/INDEX.md` receives one table row as the coordination-ledger surface it is
(ODQ §331.4: packets do not list it; its edits reserve no change path). ⛔ The shared census
path is NOT a row here (§417 T2J shape; the row text rides the census note for the landing act).
Generated artifacts: `NONE`. No `tests/lint/**` file is minted, so §P3b's mutation-coverage row
does not attach. **Symbols the deliverable CREATES** (`export function deriveHighWater`,
`export const HIGH_WATER_CHANNELS`, `export const HIGH_WATER_GAPS`,
`export const RING_RETAINED_PREFIX`, `export const RING_WINDOW_ENTRIES`,
`export const DEMOTION_THRESHOLD`, `const FROZEN_RING_WRITERS`, `const FROZEN_TIER_WRITERS`,
`const ARGUED_NON_SETTLEMENT`, the one describe title) join `requiredSymbols` **at the flip to
LANDED, never at READY** (the MF-T2E/MF-T2F precedent; PACKET_STANDARD §"Change manifest").
At READY the rows name only what the deliverable PRESERVES: the landed tier table and
`popToTier`, the `peakTier` stamp write, the strike seam the acceptance drives, the ledger projection channel 3 reads through (§443),
the coupling-census scope, and the anchored helper. `retiredSymbols`: **EMPTY**.

## §8 · JUDGMENT CALLS, VETOABLE

- **J-TET2R-1 — S0 STOPPED on the demoting-writer finding rather than curing or pinning around
  it** (charter §5.3, §9.10). RATIFIED at ODQ §434 with the four completed S0 arms; the ruling's
  five points are the member's shape (§0).
- **J-TET2R-2 — the ring roster pinned at the MEASURED nine-plus-one, not the charter's five**,
  and the uncapped writer FROZEN AS-IS with a flag rather than normalised (§434 ruling 3): a
  roster pinned to a stale denominator is the §417 defect class; capping the writer moves
  same-seed pulse output and is the owner's call.
- **J-TET2R-3 — the any-cast red cured by TYPEDEF, never by a `DECLARED_OVERRUN` row or a cast.**
  `tests/lint/domainAnyCastBaseline.test.js` is a second ledger whose ceilings are monotone-down
  literals; widening would only move the red to the ceiling arm. The cure (`HighWaterInput`
  typedef; `TIER_FLOOR` built by enumerating the landed table; an explicit credited walk instead
  of `.map().filter(Boolean)`) is the shape the estate's own idiom asks for.
- **J-TET2R-4 — the window prose states TWELVE, a declared divergence from the sealed prose's
  "caps at 11"** (§434 ruling 4): the reader describes what the engine measurably does.
- **J-TET2R-5 — the census row DEFERRED to the landing act and the walker edit REVERTED at the
  member commit** (§417 J-TET2J-1, the standing cure): a lane may not assert a sibling's
  completion and may not edit the validator.
- **J-TET2R-6 — the checkpoint's `--no-verify` commit left standing and a FOLLOW-ON commit
  made with hooks**, rather than an amend: the checkpoint is pinned at
  `refs/preserve/holding-t2r` (= `a6001d47`) and a follow-on keeps that pin honest; the hook
  ran on the follow-on and every proof was re-executed at the tip. Say "veto" to flip it to a
  squash at landing.
- **J-TET2R-8 — the ledger route's one narrowing DECLARED, not hidden (§2.4):** floor on a
  fractional `exodus`, non-object stamps uncounted — identical on every engine stamp, honest on
  malformed input. Chosen over re-implementing the projection's arithmetic in the leaf, which
  would be the second reader the ruling exists to refuse.
- **J-TET2R-7 — SUPERSEDED by ODQ §443.** The packet was committed at BLOCKED at `387a3b34`
  because §10.1's STOP stood; the ruling cured it and the follow-on returns it to READY.
  PACKET_STANDARD rules that "READY except for" is DRAFT or BLOCKED; a READY flag on a member
  with an uncured member-caused red would invite the landing act. The DRAFT → READY walk was
  executed and validated green at both (receipt), then the status moved to BLOCKED with the
  named dependency: the chair's ruling on §10.2. Say "veto" to flip it back to READY in the
  same act as the ruling (three one-word cells: header, manifest row, index cell).

## §9 · RAISED — split OWNER / CHAIR

### Owner (docketed at ODQ §434 as §433-O2's first instances; priced, not built)

| # | item | the bill, stated |
|---|---|---|
| O-i | **Stamp `peakTier` on the DEMOTING paths** (`calamityKernel.js` strike seam, `tierOutcomeApply.js` demotion branch, `settlementLifecycleFirstClass.js` resettle) so a future demotion leaves channel-1 evidence where it stands today erased. | Same-seed PULSE motion: one typed field on every settlement that demotes. The T2Q-class bill — the pinned post-pulse artifacts enumerated and the motion attributed key-by-key (§421(2)); the RS-5 obligation attaches at exposure (§312.2c). S0's A/B counterfactual (§1) is the evidence. |
| O-ii | **Cap the ring append in `realmVerbExecution.js`** (today `[...history, {…}]` with no `.slice` — 30 writes, 30 entries; every sibling writer caps at 11 retained). | A real defect whose cure MOVES same-seed state (a parent's ring shrinks to 12). Same declared-shift protocol; until ruled, the writer is frozen as-is by A5 and only ever HELPS this reader. |

### Deferred, with the ruling that parks it

| # | item | where it rides |
|---|---|---|
| D-1 | **The estate cure for pulse-written keys under the observed-shape reader walker** — a `pulse-time-writer` mechanism row in `EXPLAINED_WRITER_EXEMPTIONS` for `calamityHistory on settlement` (writer `worldPulse/calamityKernel.js`), the governed re-freeze, and the walker's pinned literals re-read off it. | **The estate cure rides the trailing OSR mint (§384.2)** — ODQ §443 C-b. Not this member's; recorded here so the next reader of a pulse-only key finds the docket instead of the red. |

### Chair (recorded; nothing here blocks the landing)

1. **RAISED-1 — the port tranche's C5 carry row is live:** the tierGrammar port imports this
   leaf and deletes its local copy in the same commit, AND inherits the declared band divergence
   (§2.2) and the twelve-entry window prose (§2.3) — the port's dual-run comparator must carry
   both as declared divergences or it will read a correct port as a drifted one.
2. **RAISED-2 — the content-train consumer car** (ODQ §433 C3): the dossier pool(s) that speak
   `demoted` / `deficit` / `understated` are record-gated content cars; `understated: true`
   needs its own lawful sentence (the facts will not sit unspoken, but a floor must be spoken AS
   a floor).
3. **RAISED-3 — the benchmark arm stays red by design** (charter §5): MF-CB1's population-cut
   leaves are generated and un-pulsed; W4's retrospective-partition work (§306.4(c)) owns that
   cut, and a packet predicting a passing benchmark arm from this member has mis-predicted.

## §10 · THE GATES, AND THE ATTRIBUTION OF EVERY RED — ONE STOP RAISED, RULED AT §443, CURED

**Executed at the resume (2026-08-22 evening CDT), every exit captured in-shell, every vitest
invocation under `scripts/gate-mutex.sh --run` on the shared lock, logs under `/tmp/t2r`:**

| instrument | at `b10ed1a1` (baseproof) | with the member (`a6001d47`) | verdict |
|---|---|---|---|
| `npm run typecheck:ratchet` | — | `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).` exit 0 | GREEN at the exact ceiling |
| `npm run typecheck:domain:strict` | — | `[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).` exit 0 | GREEN at the exact ceiling |
| `npm run validate:packets` | — | `valid: 149 packets` at DRAFT, at READY, at BLOCKED and at READY again after §443, exit 0 each | GREEN |
| `tests/lint/domainAnyCastBaseline.test.js` | green | RED at `23e0bcd9` (MINE) → CURED by typedef at `a6001d47`, green | the FIRST member-caused red, cured |
| `tests/lint/sovereigntyLightingContract.walker.test.js` (census arm) | green | RED by construction | the ONE NAMED interior red (census note; §417 T2J shape) |
| `clampPrimitiveBaseline` · `warCostKindPools.walker` · `warRulingKindPools.walker` | RED | RED, identical | PRE-EXISTING at base (isolation: red with the member moved aside) |
| `observedShapeSentinel` · `exportTokenCoverage` · `proseFamilyContract.walker` · `readerShapeResolver` · `siteCoherenceRatchet` · `postureNameCollision.walker` · `tests/build/townScene3dLazy` · `tests/build/townSceneLocalMatrixAudit` | **PASS** (9 files, 221 passed, exit 0, `attrib-base.log`) | **PASS** (8 of the 9 files, `attrib-work.log`) | the §408 sweep's reds on these eight were LOAD STRAYS of a contended run (the §393 class — budget timeouts wearing real tests' names); they do not fail quiet in either tree. `dist/` was ABSENT in both trees; the two `tests/build` files pass without it |
| **`tests/lint/observedShapeReaders.walker.test.js`** | **PASS** | **RED — 2 arms at `a6001d47`; GREEN at the §443 follow-on** | **MINE — the second member-caused red; STOPPED, RULED (§443 C-a), CURED** (§10.1–§10.2) |
| `tests/docs` (20 files) + `tests/scripts/implementationPackets.test.js`, with the packet, manifest row and index row in place | `enforcement-claims` RED on SIX naked claims (`FABLE_VALIDATION_QUEUE.md` ×4, `GOLDEN_SHIFT_LEDGER.md`, `IN-0C.md`), `docs-claims-base.log` | the SAME six, and nothing else (`docs-sweep.log`: 1 failed / 155 passed) | PRE-EXISTING naked-claim debt, identical set at base; this packet, its index row and the leaf add no claim (`CLAIM_RE` probe 0 hits) |

### §10.1 THE STOP — raised at the resume, RULED at ODQ §443, and CURED under the ruling

At the resume, `observedShapeReaders.walker` was GREEN at the base and RED with the member:
`SHRINK-ONLY: no file exceeds its frozen ceiling, and no row has vanished` read
`{ violations: 1, stale: 0 }` against `{ violations: 0, stale: 0 }`, and `A1/A7` read
`files 388 / identities 1410 / reads 1997` against the pinned `387 / 1409 / 1995`. Reproduced
outside vitest with the walker's own composition (`osr-repro.mjs`, exit 0); the ONE violation,
verbatim:

```
src/domain/highWater.js: read(s) of a key no writer produces, outside the frozen inventory:
    NEW      calamityHistory on settlement — 2 read(s); this file has no frozen row for it (ceiling 0)
```

The site was the pre-ruling leaf's channel-3 guard (`Array.isArray(s.calamityHistory) …`,
then at `:229`). The reader-with-no-writer ratchet measures the OBSERVED corpus — generated
worlds — and on a generated world the strike record is never written: its writer is the
PULSE-time strike seam (`calamityKernel.js`, the same module §1 convicts), which the corpus does
not run far enough to see. That is the §306.2(a) finding itself, restated by an instrument: the
channel is empty on every generated leaf and fills only in a lived interval (charter §1.2). The
three existing readers of the key (`display/calamityLedger.js`, `worldPulse/calamityKernel.js`,
`worldPulse/upswingKernel.js`) are banked as ordinary per-file debt at ceiling 2; the baseline's
own law is *"never raise a number, never add a file, never add an identity"*, and the governed
`--write` refuses a NEW row by design. ⚠ The same module's `config.peakTier` read was NOT
flagged; the mechanism was not investigated (PLAUSIBLE: optional-chained reads through `config`
are outside the resolver's reach) and nothing here rests on it.

Separately and NOT this member's: `node scripts/check-observed-shape-readers.mjs` exits 1 at
the base AND with the member with the schema-10 envelope-staleness line (the CT-2/CT-3
MINT-class item) — a different instrument from the walker TEST.

Under charter §9.4 / preamble §P7.12 this second member-caused red was REPORTED, not repaired:
the lane held at `387a3b34` with the packet BLOCKED and the three cure shapes priced. **ODQ §443
ruled it** (below) and the lane executed the ruling as a follow-on.

### §10.2 ⭐ THE RULING (ODQ §443) — C-a for the member, C-b for the estate, C-c refused

| # | shape | ruling | state |
|---|---|---|---|
| C-a | **Route channel 3 through the existing banked reader** `src/domain/display/calamityLedger.js` (`buildCalamityLedger(settlement)`; rows carry `{year, tick, deaths, exodus, …}` via `projectCalamityStamp`) — the `townMap/changeView.js` precedent, same import spelling relative to `src/domain/`. | **RULED for the member.** The layering question is answered: `src/domain/display/**` is DOMAIN-side projection, not the UI layer, so a domain-root deriver importing it is lawful. Its DISPLAY-LAZY law (*"imported ONLY from lazy display/dossier surfaces, never from the first-paint entry closure"*, `@enforced-by tests/build/vendorPdfLazy.test.js`) **TRANSFERS to `highWater.js` by inheritance**: first-paint consumers of `deriveHighWater` are refused by the vendorPdfLazy byte budget. Its consumers are dormant derivers and lazy surfaces — the undercity UC-1/UC-4 readers of this leaf are consumed by the CT-4 prose and the D5 fabric, both lazy. | **EXECUTED** in this packet's follow-on commit: both reads of the persisted strike record replaced by the ledger projection; the inheritance written into the leaf header; §2.4 states the one declared narrowing |
| C-b | **Bank the identity under the explained-writer mechanism** — a `pulse-time-writer` row in `EXPLAINED_WRITER_EXEMPTIONS` (writer `worldPulse/calamityKernel.js`) and the governed re-freeze, which also re-reads the walker's pinned literals. | **RULED for the estate; DOCKETED to the trailing OSR mint (§384.2)** — not this member's. | **DEFERRED — the estate cure rides the trailing OSR mint** (recorded in the deferred rows, §9) |
| C-c | Delete channel 3. | **REFUSED** — acceptance A2 and the §306.2 law rest on it. | — |

**C-a, executed and re-proved at the cured leaf `021808ba…` (104 effective of 250, down from
107), every exit captured, every vitest invocation mutexed (`reprove-443.log`,
`osr-repro-443.log`, `mutants-443.log`, `typecheck-*-443.log`, `eslint-leaf-443.log`):**

| proof | result |
|---|---|
| `tests/lint/observedShapeReaders.walker.test.js` | **GREEN** (27 tests) — the `A1/A7` literals read **`files 387 / identities 1409 / reads 1995`** with the member, exactly the base figures (quoted from the walker's own composition: `violations: 0 stale: 0`, `findings mentioning highWater: 0`, `{"reads":1995,"identities":1409,"files":387}`) |
| acceptance `tests/domain/highWater.test.js` | **7/7 GREEN** |
| anchor walker · any-cast ledger · generator golden | **GREEN** in the same run (5 files / 59 tests / exit 0); `tests/fixtures/generator-golden-master.json` still `29c6cc8f…` bytewise |
| mutants m1–m4 re-planted against the NEW leaf | **ALL CONVICT on the same arms as before** — m1 → A4; **m2 (channel-3 exodus addition dropped) → A2, still**; m3 → A2 + A4 + A7; m4 → A1; each restored digest-exact to `021808ba…`; clean control 7/7 exit 0. No mutant went inert under the ledger route, so none was replaced |
| `typecheck:ratchet` / `typecheck:domain:strict` | `(173 error(s), ceiling 173)` / `(1134 errors, ceiling 1134)`, exit 0 each — the ledger input is typed by importing `CalStampLike` from the ledger, never by a cast |
| `npx eslint src/domain/highWater.js` | exit 0, no output |
| C0 control bytes / `CLAIM_RE` | 0 / 0 |

### §10.3 What the resume did NOT do

It did not run the full gate or `check:tail` (the landing terminal's act). It did not edit the
walker, its baseline, or the exemption bank (the ruling's own prohibition). The `tests/docs`
enforcement-claims red is the pre-existing six, identical at base, and was not touched.
