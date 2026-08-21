# RETRO-E4 — EVIDENCE VERIFICATION MEMO (engine / soak / wave cluster)

**Scope:** ODQ §267, §268, §269, §270, §271, §273, §274 + the RS-4 interruption state.
**Role:** read-only evidence verifier. I did not rule, edit, run the gate, or mutate git.
**Method:** each judgment item in `docs/FABLE_RETROVALIDATION_QUEUE.md` is matched to the ODQ row,
then to the lane receipt, then — wherever the substrate allowed it — **re-executed independently**
from the raw artifacts rather than read off the receipt.

**Trees read:** `/Users/cstokes/Desktop/settlement-engine` (read-only; `git show`/`git log`/`git
grep` of committed objects only), old scratchpad `.../a244e7a3-.../scratchpad/`, map sandbox
`mf-proto/build-out`. Nothing in either was written. My own writes are confined to
`.../6298872d-.../scratchpad/retro-E4-*`.

**Headline for the chair, before the detail.** The mechanical substrate under this cluster is
**unusually strong** — I independently reproduced the key-by-key golden diff, the RS-3 receipt
census, the RS-4 cure figures, the PERF1 byte-identity proof, the config-A/config-B SVG shas, and
the W1b counterfactual attribution, and all of them land exactly. The discrepancies I found are
**four numbers and a set of missing logs**, not a rotten foundation. One of the four — §269's
control set — touches an argument the ODQ itself calls "what makes it credible."

---

# §267 — THE INTEGRATION SPIKE

Receipt: `.../scratchpad/laneMFINT1-receipt.md` (613 lines).
Raw: `MFINT1-readcensus-metropolis.json`, `MFINT1-perf.json`, `MFINT1-out/config{A,B}-*`.

## (a) Re-sequencing the performance pass ahead of W1, holding the substrate for it

**EVIDENCE.** The dependency claim rests on the profile and on the headroom.

`laneMFINT1-receipt.md:341-342` —
> `buildFabric` **cold** | **2,436 ms** | 2,133–2,679 ms | ⛔ **the headline**
> `buildFabric` **warm** | **2,301 ms** | 2,137–2,688 ms | ⭐ **warm ≈ cold ⇒ this is real compute**

Recomputed from `MFINT1-perf.json` (n=8), upper-median convention:
`tFabric` sorted `[2133, 2160.6, 2335.5, 2350.3, 2436.3, 2472.3, 2537.2, 2679.4]` → upper-median
**2436.3**, range **2133–2679.4**. `tFabricWarm` upper-median **2301.4**, range
**2136.6–2687.8**. **Every published figure reproduces to the decimal.**

`laneMFINT1-receipt.md:462, 467-471` —
> `fabric/fabricGeometry.js` | **25.9 %** | **`q6` 14.1 %**, `pointInPolygon` 7.2 %
> ⭐⭐ **`q6` is `export function q6(v) { return v.toFixed(TOPOLOGY_PLACES); }`.**

`laneMFINT1-receipt.md:482` — the headroom that makes it a *dependency* rather than a preference:
> `buildFabric.js` **796** — ⚠ **4 lines of headroom**

**STATUS: CONFIRMED.** The scheduling argument's two load-bearing facts (cost is concentrated,
not diffuse; and `buildFabric.js` has four lines left) are both executed measurements, and the
lane explicitly refused to invent the post-optimisation figure (`:505-508`). §269 then vindicated
the sequencing by delivering 1.62× corpus with 67 lines of headroom.

**DOUBTS.** The profiler share (14.1 %) was later shown by MF-PERF1 §1 to be a **call-frequency**
artifact, not a formatting cost — so the *named first item* of the charter was aimed at the wrong
half of its own evidence. The chair already ratified that correction at §269.3. Note also that
MF-INT1's own profile was **unmerged by call site**; PERF1 §1 re-read the same baseline profile
merged by function name and got `q6` **12.9 %**, not 14.1 %. The ODQ quotes 14.1 %; the corrected
reading of the same data is 12.9 %. Immaterial to the ruling, but the ledger carries the
superseded number.

## (b) The addressable-draw-list ruling — "the largest architecture decision since the version axis"

**EVIDENCE.** `laneMFINT1-receipt.md:67-75` —
> ⚠⚠ **THE COSTLIEST SEAM IS NOT DATA, IT IS THE RENDERER'S OUTPUT TYPE.** `renderFolio` emits an
> **opaque SVG string**. The app's on-screen map is a **React JSX SVG tree** whose every district
> and building is an element carrying `onPointerEnter` / `onPointerDown` … and **the PDF path
> consumes a DrawOp list, not an SVG string** (`TownMapPlate.jsx` maps ops to react-pdf
> primitives). **Dropping the folio in as a string destroys the entire interaction surface and
> cannot enter the export path at all.**

The feasibility half is measured, not asserted (`:443-446`):
> the folio SVG uses **only** `path`, `text`, `g`, `rect`, `circle`, `title`. **Zero** filters,
> masks, clip-paths, gradients, patterns or blend modes.

And the identity the projection needs already exists — I confirmed both identity fields are live
reads in the census: `MFINT1-readcensus-metropolis.json` carries `parcel.key` / `landmark.*`
consumers, and the fabric-side reads are `phase: "fabric-only"`.

**STATUS: CONFIRMED** as to the *problem* (the seam is real, measured, and blocking). The
*solution shape* ("one projection serves screen, PDF and raster") is **PLAUSIBLE** — the lane did
not build it, and §7 says so plainly (`:579-581`: "No React-pane integration … cannot be measured
before it is written").

**DOUBTS.** The op-budget consequence is stated as a certainty the instrument cannot yet see
(`:483`): `OP_CEILING = 2200` vs the folio's **8,999 primitives**, "*a gate that reds on the day
the export projection lands*". That is a prediction about an unwritten projection — if the
projection merges primitives the way `<path d>` already does (the same receipt notes "many
primitives merged into few `<path d>`", `:346`), the ~4× overshoot may not materialise as stated.
The chair's §267.5d ruling (raise the ceiling only after optimisation) is unaffected either way.

## (c) Whether the neighbour-bearing question is genuinely refusable under THE PROMISE

**EVIDENCE.** `laneMFINT1-receipt.md:211-217` —
> ⛔⛔ **AND THIS ONE IS NOT A RENAME.** … The real neighbour object carries `{name, tier,
> relationshipType, primaryExports, primaryImports, activeChains, …}` and **no bearing, no
> distance, no travel time** … **A bearing does not exist anywhere in the dossier, and minting
> one is a seed-permanent world fact under THE PROMISE.**

The lane confirmed the negative by construction, not by absence of evidence (`:207-210`):
"CONFIRMED by generating a settlement **with** an imported neighbour — `neighborRelationship` is
populated but carries **no `.links` array**."

Census corroboration (executed by me): `neighbors` `UNDEFINED` (1 hit, fabric-only);
`neighbourNetwork` `UNDEFINED` (8 hits); `neighbours` `UNDEFINED` (8); `neighborNetwork`
`UNDEFINED` (1). Four spellings, all dead.

**STATUS: CONFIRMED** that the fact does not exist. **The "refusable" framing is now weakened by
a later lane and the chair should know it before re-deriving.** MF-W1b built `waterBearing` under
exactly the objection §267 raised, and argued the distinction (`laneMFW1B-receipt.md:201-205`):
> **A MINTED BEARING WOULD BE A SEED-PERMANENT WORLD FACT UNDER THE PROMISE.** … **The water's
> bearing is lawful precisely because it is not minted: it is a reading of ground that already
> exists**, so it cannot contradict a later truth.

**DOUBTS — this is the sharpest live question in §267.** W1b's own distinction implies the
neighbour bearing is refusable **only if no derivable ground carries it**. The dossier does carry
neighbour identity and the map carries a frame; nobody has tested whether a *terrain-derived*
neighbour bearing (the direction of the road/route to that neighbour, which the fabric already
draws) exists as a reading rather than a mint. The retrovalidation entry's own wording — "or
merely needs a terrain-derived answer" — is the right question and **no lane has answered it**.

## (d) Raising `townMapOpBudget` only after optimisation

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:10216-10220` —
> `townMapOpBudget`'s 2,200 ceiling against the folio's 8,999 primitives is a MEASURED RAISE
> under §217 — but only AFTER the performance pass, so the number is honest rather than a
> monument to unoptimised code.

**STATUS: CONFIRMED as sound and as *not yet consequential*.** The performance pass (§269) moved
**zero pixels** and therefore moved **zero primitives** — `MFPERF1-battery.log` reads
`metropolis max 8278 / ceiling 9700` for the *sandbox* per-tier ratchet, identical to W0's. So the
2,200 app-side ceiling is still un-raised and still unmeasured against a post-optimisation folio.
The ruling defers a decision that nothing has yet forced.

**DOUBTS.** None on the reasoning. One on the accounting: the primitive count has since moved four
times (W0 → W1S → W1b → W2), so "the number is honest" will require a *fresh* measurement at
whichever tip actually lands, not §267's 8,999.

### §267 — mechanical checks I re-executed

| claim (ODQ §267.2) | receipt | my recomputation | verdict |
|---|---|---|---|
| 111 read paths | `:47-49` | `MFINT1-readcensus-metropolis.json` → **111 rows** | ✅ exact |
| 33 undefined | `:47-49` | kind histogram → **`UNDEFINED: 33`** | ✅ exact |
| 14 the fabric's | `:49` | rows with `phase: "fabric-only"` ∧ `UNDEFINED` → **14** | ✅ exact |
| `activeConditions` read 592× | `:176` | census row `{"path":"activeConditions","hits":592,"kind":"array[1]"}` | ✅ exact |
| `stressors` is an OBJECT | `:160-166` | `{"path":"stressors","hits":58,"kind":"object"}`, `stressors.type` `string` | ✅ exact |
| resource live field | `:186` | `resourceAnalysis.availableResources` `array[11]`; `resourceAnalysis.resources` `UNDEFINED` | ✅ exact |
| 3 of 4 settlements draw differently | `:228-233` | I re-shasummed `MFINT1-out/config{A,B}-*.svg`: town/city/metropolis **DIFFER**, metropolis2 **IDENTICAL at `980cc50c2087`** — the receipt's own sha | ✅ exact |
| tag counts 330/336, 405/438, 429/426 | `:230-232` | counted opening tags: **330/336, 405/438, 429/426, 436/436** | ✅ exact |
| `townLayoutV3.js` on no branch | `:284-286` | re-ran on `claude/composite-r4`, `review-fixes-2026-07-08`, `master` → **0, 0, 0** | ✅ exact |

**One number does not reproduce.** `laneMFINT1-receipt.md:57` says the fabric costs "**2.3–4.2
seconds** where the map the app ships today costs **5–21 ms**". The receipt's own measured legacy
column (`:356-361`) reads **8.1 / 4.2 / 2.9 / 5.3 / 5.6 / 10.3 ms** — range **2.9–10.3 ms**, not
5–21. The `21 ms` in that table is the *folio's* `renderFolio` for city, one column over. **ODQ
§267.4 propagated the wrong band into the ledger** ("against the shipping map's 5–21 ms"). Two to
three orders of magnitude is unaffected; the quoted range is wrong.

**A second, smaller one.** `:301` publishes `grep -rl townMapFixtures tests/ | wc -l → 66`. I ran
`git grep -l townMapFixtures ac243e1c -- tests/` → **60**. The receipt's grep ran inside the
*overlaid* worktree, so it counted the ~6 sandbox test files it had just copied in. The **app-side
blast radius at the tip is 60 files**, not 66. The finding (a hard collision that deletes
`GOLDEN_CONFIGS`, `V2_GOLDEN_CONFIGS`, `V2_EXTRA_CONFIGS`, `LANDFORM_FIXTURES`, `makeFabricMirror`
and changes `makeTownFixture`'s signature) stands unchanged.

---

# §268 — RS-3

Report: `.../scratchpad/laneRS3-report.md` (186 lines). Raw: `rs3-receipts/` (162 + `pids.json`),
`rs3-config.json`, `rs3-artifacts/rolling-report.json`.

## (a) Treating the replication as sufficient to close the diagnostic phase and dispatch the repair

**EVIDENCE.** `laneRS3-report.md:80-84` —
> **This is an independent replication of RS-1 F1**, and it is stronger evidence than the
> original: different tip, different census (81 flags vs 79), independently constructed array,
> different row id (content-derived `ca-bd7e00d6` vs positional `ca-015`) — same one-flag
> localization, same world, same start population 17,682, comparable severity (0.0385 now vs
> 0.045 then).

**I re-executed the localization claim directly against `rs3-config.json`:**

```
total flag keys: 79
DIFFERING between maximal-lawful and ca-bd7e00d6: [ 'npcAgencyEnabled' ]
maximal-lawful ON: 79   ca-bd7e00d6 ON: 78
```

**And the severity claim against the receipt:**

```
w0-soak    ca-bd7e00d6  start 17682  final 680    ratio 0.0385  finals [668,0,8,4]  failures ["realm population bounded"]
w0-soak-b  ca-bd7e00d6  start 20013  final 10733  ratio 0.5363  failures []
w0-soak-c  ca-bd7e00d6  start 21890  final 11091  ratio 0.5067  failures []
```

**STATUS: CONFIRMED, and the "sole differing factor" claim is exact** — 79 flag keys, one
difference, `npcAgencyEnabled`. This is genuinely a one-flag localization on an independently
constructed array, which is the strongest form the claim could take.

**DOUBTS.** The replication's *independence* is one degree weaker than stated: RS-1 and RS-3 share
the **same world seed** (`w0-soak`) and the **same start population** (17,682). What replicated is
tip, census, array-construction and row-id — not the world. The report says so honestly at
`:86-88`; the ODQ compresses it to "a DIFFERENT tip, a DIFFERENT census, an INDEPENDENTLY
CONSTRUCTED covering array and a different row id", which is accurate but reads more independent
than it is.

## (b) The §255 site framing (one world of three) and whether it should temper priority

**EVIDENCE.** `laneRS3-report.md:86-88` —
> **Site discipline (§255): this rests on 1 world of 3.** The same row is lawful elsewhere —
> `w0-soak-b` 20,013 → 10,733 (0.536), `w0-soak-c` 21,890 → 11,091 (0.507). `w0-soak` is the
> tail world for this configuration in both runs, which is itself the reproducible part.

**Recomputed above: 0.5363 and 0.5067. Both exact to the published three decimals.**

**STATUS: CONFIRMED.** The one-world-of-three framing is arithmetically exact and the chair's
ODQ §268.2 wording ("*a one-way ratchet that only bites a tail world is still a one-way ratchet*")
is the correct reading of it.

**DOUBTS.** None on the framing. One on the framing's *sufficiency as a priority signal*: the
grid measured **3 distinct worlds** and the diagnostic phase closed on a defect that fired in one.
The subsequent RS-4 evidence (below) resolves this favourably — the cured figures reproduce in all
three worlds — so nothing hangs on it now.

## (c) Holding RS-4 for the next exposure rather than re-running at the same tip

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:10276-10280` —
> **RS-4 WAITS FOR THE NEXT EXPOSURE** rather than firing at the same tip: the instrument
> questions RS-3 existed to answer are all answered, so another run at ac243e1c would re-buy
> known facts.

**STATUS: CONFIRMED as correct, and vindicated by outcome.** RS-4 did fire at the P4 exposure
(`4eafca31`) and its partial grid is already the strongest evidence in the cluster — see the RS-4
section. Re-running at `ac243e1c` would indeed have bought nothing.

### §268 — mechanical checks I re-executed

I wrote a census over all 162 `rs3-receipts/*.json` and got:

```
receipt files (excl pids.json): 162
{ corrupt: 0, epochLit: 147, epochDark: 15, litPass: 146, litFail: 1,
  darkPass: 15, darkFail: 0, nfKey: 162 }
worlds: [ 'w0-soak-b', 'w0-soak-c', 'w0-soak' ]
NOT-EXECUTABLE receipts: 3  [w0-soak-b, w0-soak-c, w0-soak _30_4_dark-control.json]
FAILING cells: [ 'w0-soak_30_4_ca-bd7e00d6.json' ]
median ratio: 0.5066   under 0.5: 48/162
```

**Every §268.1 figure reproduces exactly**: 147/162 epoch-lit; 146 pass / 1 fail lit and
15 pass / 0 fail dark; 162/162 carrying the `nonFiniteFigures` writer-side census; three dark
controls `NOT-EXECUTABLE` in all three worlds; 162/162 receipts, zero corrupt; the sole failure is
the F1 cell. Median 0.5066 ≈ the report's 0.507; 48/162 under 0.5 exact.

**F2's tail figures do NOT reproduce.** `laneRS3-report.md:95-96` publishes
`ca-bb50cbc0` **0.074**, `ca-41bab8a4` **0.222**, `ca-78455eb2` **0.216**. Computing
`sum(finalPopulations)/sum(startPopulations)` from the receipts gives **0.0657**, **0.1982**,
**0.2027**. The report's §5 explicitly says F1–F2 use *this* measure
(`:128-131`: "the soak's own `startPopulations`/`finalPopulations` ratio … quoted in §3/F1-F2").
F1 reproduces exactly; F2 does not. The machine report `rs3-artifacts/rolling-report.json` carries
only the single F1 finding and none of F2's numbers, so there is no second source to arbitrate.
**F2 is INFORMATIVE and drove no ruling** — but three of its four quoted figures are not derivable
from the artifacts the report names.

The lane's self-disclosed `recordRun` double-fold (`:139-149`) is corroborated by the preserved
pre-repair snapshot `rs3-ledger-before-repair.json` existing on disk beside `rs3-ledger-repair.mjs`.
**The rule it produced was adopted** — see the RS-4 section, where `rs4-evaluate.mjs:121` carries
the sentinel guard by name.

---

# §269 — THE PERFORMANCE PASS

Receipt: `.../scratchpad/laneMFPERF1-receipt.md` (634 lines).
Raw: `MFPERF1-ab-final.log`, `MFPERF1-shas-{before,after3}.json`, `MFPERF1-det.log`,
`MFPERF1-budget.log`, `MFPERF1-battery.log`.

## (a) Ratifying the refusal of the chartered integer-key target on a ≤0.03 % measurement

**EVIDENCE.** `laneMFPERF1-receipt.md:296-303` —
> | town | 1,004 ms | 0.0444 ms | 0.1079 ms | 5 | **0.755 ms = 0.075 %** |
> | metropolis | 858 ms | 0.0264 ms | 0.0631 ms | 5 | **0.442 ms = 0.051 %** |
> | year-100 | 1,540 ms | 0.0440 ms | 0.0953 ms | 10 | **1.144 ms = 0.074 %** |
> **`toFixed` is at most 41 % of that** … so a perfect integer rewrite buys **≤ 0.03 % of a build**.

I read the instrument (`MFPERF1-q6cost.mjs`) and re-did its arithmetic. Its formula is
`total = per × verifications + per × 2`. Town: `0.1079 × 7 = 0.7553` against build 1004 →
**0.0752 %**. Metropolis: `0.0631 × 7 = 0.4417` / 858 → **0.0515 %**. year-100:
`0.0953 × 12 = 1.1436` / 1540 → **0.0743 %`. **The published table is internally exact.**

The refusal's *cost* side is the stronger half (`:305-311`): it would change every `contentHash`
and `inputsHash`, and — the load-bearing point — **change the rounding rule at exact ties**
(`v.toFixed(6)` rounds half away from zero; `Math.round(v*1e6)` rounds the product half toward
+∞) inside "the decision that defines geometric IDENTITY".

**STATUS: CONFIRMED.** The refusal is measured, the arithmetic reproduces, and the tie-rule
argument alone would justify it at ten times the saving. The chair's ratified principle — "*a
chair's charter is a hypothesis; a lane that refutes it with numbers has done its job*" — is
well-founded here.

**DOUBTS — two, both small but both in the ledger.**
1. **"at most 41 %" is contradicted by the lane's own third row.** `ringsText ÷
   (ringsText+contentHash)` gives town **41.1 %**, metropolis **41.8 %**, year-100 **46.2 %**.
   The ≤0.03 % headline becomes **≤0.034 %** on year-100. Right to one significant figure; the
   stated bound is not a bound.
2. **⚠ The measurement that grounds a chartered-target refusal has NO captured output.**
   `MFPERF1-q6cost.mjs` exists; there is **no `MFPERF1-q6cost.log`**, and §14's artifact table
   lists it with no log companion while every other instrument in that table has one. The
   per-call timings exist only as prose in the receipt. The arithmetic over them is checkable
   (I checked it); the timings themselves are not.

## (b) Folding the §202 ladder fix into W1 to share one declared shift

**EVIDENCE.** `laneMFPERF1-receipt.md:327-347` —
> **MEASURED (`MFPERF1-acount.mjs`), the sealed set does not move across the ladder on ANY walled
> leaf:** `town sealed[15,15,15,15]` … `town shrunk 45 (= 15 × 3) dropped 15 landlockedAfter 0` …
> ⭐ **THE BODIES SEALED AT ROUND 0 ARE EXACTLY THE BODIES DROPPED AT THE END.**

The fold happened and its behaviour-neutral half was proved (`laneMFW1SUB-receipt.md:102`):
> **A · behaviour-neutral** | the `accessFreed` figure correction + its meta rows | ⭐⭐ **12
> identical / 20 moved — THE IDENTICAL SET, PLATE FOR PLATE** | **0**

**STATUS: CONFIRMED for the figure; the *ladder* was not fixed and the ODQ says so correctly.**
§270.4c ("its BEHAVIOUR stays diagnosed-not-fixed and PLAUSIBLE") matches
`laneMFW1SUB-receipt.md:227-235` verbatim, including its own PLAUSIBLE label. As of W2 it is
**still uncured** (`laneMFW2-receipt.md:433-434`, `:618-619`). The fold bought the *figure* inside
one declared shift; the *behaviour* has now been carried across three waves.

**DOUBTS.** `MFPERF1-acount.mjs` also has **no captured log**. The sealed-set arrays and the
`shrunk/dropped` triples exist only in receipt prose. They are corroborated indirectly by W1S's
independent re-derivation of the same defect from a different angle
(`laneMFW1SUB-receipt.md:209-213`), which is real corroboration but not the raw output.

## (c) Declining to charter a further performance lane on speculation

**EVIDENCE.** `laneMFPERF1-receipt.md:239-243` —
> MF-INT1 could say "70 % of the build is in three modules and the two hottest frames are a string
> hash and a missing index". **That is no longer true.** What remains is **one rasterization
> module at 30 % and a long diffuse tail** — no single output-neutral frame above 4 % outside
> `accessLaw`.

The remaining `accessLaw` lever was priced and rejected on evidence, not on effort
(`:369-377`): the alloc hoist is "**6 ms of a ~900 ms walled build (0.7 %)** for module-scope
mutable scratch"; `GRID_N` is "a **declared and argued** resolution — a semantics change".

**STATUS: CONFIRMED.** The profile shape genuinely changed and the "concentrated wins are spent"
claim is supported by the published before/after table (`:213-237`), where `wallCircuit.js` goes
22.7 % → **< 1 %** and no non-`accessLaw` frame exceeds 4 %.

**DOUBTS.** The 30.3 % `accessLaw` figure is a *share of a build that got 1.62× faster*, so the
absolute cost fell even as the share rose. The ODQ presents it as "the new profile top … and the
concentrated wins are spent", which is right; a successor reading only the share could mistake it
for a regression.

## (d) Whether 2.05× changes the §220 gate verdict

**EVIDENCE.** The lane refused to let its ratio be read as a §220 answer
(`laneMFPERF1-receipt.md:517-520`):
> ⛔ **NO BROWSER OR PDF RE-MEASUREMENT.** … **The §220 first-render figure should be re-derived
> by the integration path, not inferred from my ratio** — my A is MF-W0's sandbox tip, not INT1's
> overlaid app tree.

**STATUS: CONFIRMED.** The retrovalidation entry's own answer ("it does not on its own — the gap
to the shipping map is still large") is exactly what the receipt says. Arithmetic: 2,436 ms ÷ 2.05
≈ **1,190 ms** against a legacy path measured at **2.9–10.3 ms**. Still two orders of magnitude.

### §269 — mechanical checks I re-executed

| claim (ODQ §269.2) | my recomputation | verdict |
|---|---|---|
| 2.05× metropolis | `MFPERF1-ab-final.log`: `metropolis 1503 ms → 732 ms  2.05×` | ✅ exact |
| 1.62× corpus, 2.46× polycentric | same log: `CORPUS 17740 → 10966  1.62×`; `polycentric 1248 → 507  2.46×` | ✅ exact |
| all 32 plates byte-identical | key-by-key diff of `MFPERF1-shas-before.json` vs `-after3.json`: **32 entries in, 32 out, 0 added, 0 removed, 0 CHANGED** | ✅ exact |
| ten-process digest equal to W0's | `MFPERF1-det.log` = `98a29755…980bc1` ×10; `laneMFW0-receipt.md:482` publishes the same string | ✅ exact |
| §205A NOT APPLICABLE on metropolis + polycentric | `MFPERF1-budget.log`: both read `§205A water right-of-way 0.0 ms subject 0 NOT APPLICABLE dry leaf` | ✅ exact |
| ≤0.03 % integer-key measurement | arithmetic reproduces from the published per-call figures (above) | ✅ arithmetic exact, ⚠ raw timings unreceipted |

**⛔ THE CONTROL SET IS OFF BY ONE, AND THE OMITTED LEAF IS THE ONE THAT MOVED.**

`docs/OWNER_DECISION_QUEUE.md:10303-10306` elevates the control to the credibility argument:
> ⭐ **THE CONTROL IS WHAT MAKES IT CREDIBLE: the five unwalled leaves did not move (0.91–1.06×)
> — precisely what the diagnosis predicts and what a machine-load artefact would NOT look like.**

The five are thorp 0.91×, hamlet 1.06×, village 1.01×, mountain 1.01×, fjord 1.02×. But the corpus
carries **six** circuit-less leaves at PERF1, not five. `MFPERF1-budget.log` reads, for
**`year-018`**:

```
year-018  §161m.4 circuit permeability  0.0 ms  subject 0  NOT APPLICABLE  no circuit on this leaf
year-018  §232 district straddlers      0.0 ms  subject 0  NOT APPLICABLE  0 straddler(s) over 0
                                        samples — this leaf carries no working circuit
```

and `MFPERF1-ab-final.log` reads `year-018  1928 ms → 1398 ms  **1.38×**`.

Two independent later receipts confirm the corpus is 6-unwalled, not 5:
`laneMFW2-receipt.md:310-311` — "the 12 identical plates are **the six unwalled leaves × two
lenses**"; and `laneMFW2-receipt.md:349-352` — 16 leaves with "**FIVE OF TEN WALLED LEAVES**",
i.e. ten walled and six not. §274.1 says the same ("where six used to read 1 by construction").

**Consequence for the chair.** The 2.05× and the byte-identity are untouched — those I
reproduced exactly. What is weakened is the *strongest form* of the credibility argument: a
sixth circuit-less leaf gained **1.38×**, and neither the receipt nor the ODQ names it or explains
it. The most likely benign explanation is PERF1's *second* cure (the `streetSeeds` loop-invariant
in `accessLaw`, which every leaf with a §202 grid pays) — but that does not survive contact with
`fjord`, whose §202 subject is 1,488 against year-018's 1,576 and which gained only **1.02×**.
**Unexplained, and it sits directly under a ratification the ODQ calls load-bearing.**

Note also `laneMFPERF1-receipt.md:332-333` lists `fjord` and `year-018` inside a table headed
"the sealed set does not move across the ladder on ANY **walled** leaf" — both are unwalled. The
receipt uses "walled" in three incompatible senses (§3.1's control, §7.1's sealed table, §8's
completeness ladder), which is how the miscount survived.

---

# §270 / §273 — W1 PARTIAL AND W1 COMPLETE

Receipts: `laneMFW1SUB-receipt.md` (475 lines), `laneMFW1B-receipt.md` (675 lines).
Raw: `MFW1S-vocab.log`, `MFW1S-suite.log`, `MFW1B-{attrib,banks,battery,suite,det}.log`,
sandbox `mf-proto/build-out/tests/`.

## §270 (a) The never-run-machinery law — and its factual base

**EVIDENCE.** The law's premise is that the corpus is real, not fixtures
(`laneMFW1SUB-receipt.md:28-36`):
> `harness/exemplars.mjs` calls `generateSettlementPipeline` — these are real dossiers, not
> fixtures — and MEASURED at the base tip: `readResourceWords()` returned `[]` on **16 of 16
> leaves** … `stressors` is a bare OBJECT on **7 of the 10 distinct sites** … the active-condition
> bridge was keyed on a vocabulary that **does not exist**.

The vocabulary arm is the one with a captured log. `MFW1S-vocab.log`, verbatim:

```
CANONICAL ARCHETYPES (activeConditions.CONDITION_ARCHETYPE_TEMPLATES): 46
FABRIC BRIDGE (stateMarks.CONDITION_TO_STRESSOR): 9 keys
  ⛔ FICTIONAL  civil_unrest · famine_risk · food_shortage · migration_pressure
                monster_incursion · plague_outbreak · siege · war_footing
      REAL      regional_migration_pressure
  1 of 9 bridge keys are archetypes the engine produces; 8 are not.
REAL ARCHETYPES WITH NO BRIDGE ROW: [13 rows marked ⛔ UNBRIDGED, 1 marked bridged]
(the 14 above are conditionPromotion.js's own STRESSOR_ARCHETYPE_RULES targets)
```

**STATUS: CONFIRMED for the vocabulary arm — "1 of 9 bridge keys is real" and "13 of the 14
archetypes a generated settlement can actually carry had no row at all" are both in the log
verbatim, counted correctly (14 targets listed, 1 bridged, 13 UNBRIDGED).** The 46-archetype
denominator is the log's own first line.

The law itself is now **structurally enforced**, which is stronger than any log. The sandbox
carries `tests/lint/dossierContracts.walker.test.js` with ten pins, each carrying a non-vacuity
arm — e.g.:

```js
// tests/lint/dossierContracts.walker.test.js
it('EVERY engine condition-archetype has a bridge row OR a written ruling — none may be silent', () => {
  const missing = arch.filter((k) => !CONDITION_TO_STRESSOR[k] && !CONDITION_UNBRIDGED[k]);
  expect(missing, `unruled engine archetypes: ${missing.join(', ')}`).toEqual([]);
  // ⚠ NON-VACUITY: the vocabulary must be a real one. A walker over an empty set passes.
  expect(arch.length).toBeGreaterThan(40);
});
```

**DOUBTS — ⚠ the per-leaf census numbers have no captured output.** `MFW1B-dark.mjs` (the
never-run audit instrument) and `MFW1S-probe.mjs` produced **no `.log`**. So "0/16", "7 of 10
distinct sites", and §273.5's whole 12-mechanism table exist only as receipt prose. The *law* is
pinned; the *census* is not receipted. Given the pins are live and the suites are green with
`TRUE_EXIT=0`, I rate the substantive claim CONFIRMED and the specific per-leaf counts
**PLAUSIBLE**.

## §270 (b) Raising the hamlet op ceiling under §217 rather than pressing the remaining levers

**EVIDENCE.** `MFW1S-battery-D.log:95-101` —
```
  hamlet      max  1102 / ceiling  1100  ⛔ OVER  (headroom -2)
  metropolis  max  8490 / ceiling  9700  UNDER  (headroom 1210)
⛔ 5 of 96 renders OVER
```
96 − 5 = **91/96**, exactly as ODQ §270.4a states, and hamlet at **1102 against 1100**.

The efficiency-first condition was met before the raise (`laneMFW1SUB-receipt.md:261-267`): the
overrun was cut "from **−13 to −2** with two *derived* rations", and the three remaining levers
are named as a tuning-signature constant, an owner-gated ratchet, and W7's surface.

The raise itself was measured **at the fixed point**, per the module's own caveat
(`laneMFW1B-receipt.md:486-488`):
```
hamlet at the old 1,100 pin:  max 1,117  ⛔ OVER (−17), 6 of 96 renders over — all one leaf
hamlet at the new 1,200 pin:  max 1,126  ⭐ UNDER (headroom 74)   ← the fixed point, re-measured
```
`MFW1B-battery.log:96` independently reads `hamlet max 1126 / ceiling 1200 UNDER (headroom 74)`.

**STATUS: CONFIRMED.** Both §217 conditions (efficiency tried and measured first; the raise
measured, minimal and re-pinned at the fixed point) are executed and receipted. `MARK_BUDGET` was
correctly left alone as an owner carve-out by both lanes.

**DOUBTS.** None. This is the cleanest ruling in the cluster.

## §270 (c) Refusing to collect W1 as done and splitting a completion lane

**EVIDENCE.** `laneMFW1SUB-receipt.md:57-62` —
> ⛔⛔ **THE HONEST HEADLINE ON SCOPE: THIS WAVE IS NOT COMPLETE. Of six exit criteria, ONE is
> met, ONE is partial, and FOUR are not built** … **The suite is green at 178 tests, which is
> exactly PERF1's count: I added ZERO test titles, and the exit criteria are written in pins.**

`MFW1S-suite.log`: `Test Files 7 passed (7) / Tests 178 passed (178)`.
`MFPERF1-suite.log`: `Test Files 7 passed (7) / Tests 178 passed (178)`. **Identical — the
zero-titles claim is exact, and it is the reason the refusal was correct.**

**STATUS: CONFIRMED.** W1b then paid the debt: `MFW1B-suite.log` reads `Test Files 9 passed (9) /
Tests 220 passed (220)` — +42 titles, +2 files, matching §273.1.

**DOUBTS.** None. Refusing a wave whose exit criteria are written in pins, on a suite count
identical to its predecessor's, is the correct call and the arithmetic proves it.

## §270 (d) Whether the hash-vs-rank rationing law generalizes

**EVIDENCE.** `laneMFW1SUB-receipt.md:48-55` — the mountain leaf "had derived **204 hachures and
72 crag marks**" and the defect was `cells.sort((a,b) => a.pri - b.pri)` on a hash. The law fired
again, in different clothes, one wave later (`laneMFW1B-receipt.md:325-329`):
> ⭐⭐ **AND THE ROOT IS A COMMENT.** The fallback's own note reads *"No watercourse at all: the
> steepest ground the substrate offers"* and its body pushes **64 uniformly random frame points**.

**STATUS: CONFIRMED that it generalizes** — two instances in two waves, in two different modules
(`relief.js` ration, `seating.js` degenerate probe), the second found by looking for the first.
ODQ §273.4 makes exactly that connection ("§270.2's hash-versus-rank law wearing different
clothes").

**DOUBTS.** The visual half of the mountain claim is receipted only as prose. The before/after
plates exist (`MFW1S-acc-base-png/`, `MFW1S-acc-tip-png/`) but the verdicts are the lane's own.

## §273 (a) The normalized-units law and how wide the audit should be

**EVIDENCE.** `laneMFW1B-receipt.md:38-44` —
> `sub.slope` is normalized to each leaf's own steepest cell, so `parcels.js`'s `slope > 0.80`
> refuses ground at absolute grade **0.0094 on the thorp and 0.0699 on the mountain** — the same
> line of code, 7.5× apart, and on the flattest leaf in the corpus it refuses ground **gentler
> than the mountain's median (0.0161)**.

The arithmetic is checkable from the published divisors (`:104-106`):
`thorp localMax 0.01170 × 0.80 = 0.00936` ≈ **0.0094** ✅;
`mountain localMax 0.08737 × 0.80 = 0.06990` ≈ **0.0699** ✅;
ratio `0.08737 / 0.01170 = 7.47×` ≈ **7.5×** ✅. **All three figures reproduce.**

Six private spellings enumerated at `:93-98` (`parcels.js` ×3, `parcels.js` shanty, `commons.js`,
`fields.js`).

**STATUS: CONFIRMED.** The law is exact, the instance count is enumerated, and the cure is
delegated to one home (`groundRefusal.buildableAt`) rather than re-spelled.

**DOUBTS — ⚠ the audit is explicitly NOT complete, and the receipt says so louder than the ODQ
does.** `laneMFW1B-receipt.md:594-598`:
> ⚠⚠ **`sub.slope` IS STILL NORMALIZED PER LEAF AND `RELIEF_BANDS` IS STILL STATED IN IT.** The
> MASK is absolute; the MARKS are not. So a pancake still draws crag hatching at the same *share*
> of cells as a mountain, and **the law and the picture agree on water and do not yet agree on
> slope**.

ODQ §273.2 ends on "*Audit any surviving normalized threshold before trusting it*" — but the
largest surviving one is named in the receipt and deferred to W7. The chair should decide whether
that deferral is recorded loudly enough, because the picture and the law are currently in
different units on every leaf.

## §273 (b) Amending exit 6 rather than waiving it; zero through-river exemplars as a gap

**EVIDENCE.** `MFW1B-banks.log`, verbatim:

```
== THE WATER MODE CENSUS — is there a THROUGH leaf for the 70/30 arm at all? ==
{"dry":6,"bankside":10}

== BANK SHARES on every leaf with a CHANNEL ==
leaf         mode      bodies  sideA  sideB     split   cfB split
town         bankside    1009    751    258     74/26   82/18
highwater    bankside    1102    281    821     75/25   87/13
siege        bankside    1009    751    258     74/26   82/18
plague       bankside    1009    751    258     74/26   82/18
famine       bankside    1009    751    258     74/26   82/18
year-018     bankside    1046    779    267     74/26   81/19
year-100     bankside    1045    778    267     74/26   81/19
```

**STATUS: CONFIRMED, exactly.** "6 dry / 10 bankside / ZERO through" is the log's own line.
"On the bankside proxy withdrawing the damping makes the split STRONGER (74/26 → 82/18)" is the
town-family row verbatim. The refutation direction is unambiguous — the criterion's own
counterfactual said the asymmetry must **weaken** and it strengthens on all seven channel leaves.

W2 then minted the missing exemplar and the census moved to `6 / 10 / 1`
(`laneMFW2-receipt.md:463`), and the new leaf immediately became "the **only** subject in the
corpus for `detour-to-work` (2 runs)" (`:42-43`).

**DOUBTS.** The amendment leaves an arm ungraded rather than failed, which is correct — but note
the *mechanism* was refuted, not merely untested: on the evidence available the damping is not the
cause of the asymmetry. Re-testing on the single new through leaf will grade the criterion on
**n = 1**, which is the same replicated-corpus caveat §3.2 of W2 raises against itself.

## §273 (c) The point-vs-area class at four instances — sweep or case-by-case?

**EVIDENCE.** `laneMFW1B-receipt.md:173-177` —
> **THE CAUSE, MEASURED: `tillageScore` is asked at the FURLONG'S CENTROID, and a furlong is
> 40–110 view units across — FOUR TO ELEVEN substrate cells.** … ⭐ **The fourth instance of one
> class in this fabric** (§17.4's plot centre, §200's claim, the back-house, and now the land).

Measured cure (`:182-187`): `mountain 74 → 0`, `polycentric 48 → 0`, `hamlet 30 → 0`,
`corpus 232 → 0` strips on refused ground.

**The audit the chair ordered then fired twice more in the very next wave**
(`laneMFW2-receipt.md:401-406`):
> ⛔⛔ **THE PUBLISHED "AREA-TRUE" DRAWN CENSUS WAS MEASURED AT THE VERTICES.** `MFARCH2-drawn.mjs`
> — the module MF-W0's and MF-W1b's batteries import for their `§17 / §17.4 / §205A / §200
> 0 / 0 / 0 / 0, AREA-TRUE` line — asks §17.4 and §200 with `for (const p of b.poly)` against the
> claim's CENTRELINE.

**STATUS: CONFIRMED, and the answer to the chair's question is now empirically "sweep".** The
class reached six instances within one wave of the ordering, and the sixth was **in the instrument
that publishes the word "AREA-TRUE"**. Case-by-case demonstrably did not contain it.

**DOUBTS.** W2 re-measured the base through `deepestPenetration` and found it genuinely clean
(`:407-408`), so the blind instrument was latent, not live. But every "AREA-TRUE" line in W0's,
PERF1's and W1b's published batteries was produced by the blind module, and those figures are
quoted in the ledger.

## §273 (d) The absolute slope threshold chosen by shape

**EVIDENCE.** `laneMFW1B-receipt.md:113-119` —
> | grade | thorp | village | hamlet | metro | town family | city/migration | fjord | polycentric | mountain |
> | **0.030** | **0.0%** | **0.0%** | **0.0%** | **0.0%** | **0.0%** | **0.1%** | **0.0%** | **11.0%** | **27.7%** |
>
> ⭐ **`REFUSAL.crag = 0.030` IS THE GRADE AT WHICH THE FLAT FAMILIES REFUSE NOTHING AND THE
> RELIEF FAMILIES REFUSE A LOT.** ⚠ UNSOAKED; rides the tuning signature.

**STATUS: CONFIRMED as a shape argument, with one number conflated in the ledger.**
`docs/OWNER_DECISION_QUEUE.md:10559-10560` says "*at grade 0.030 the flat families refuse zero
cells, hills 11%, mountain **27.8%***". The candidate-cut table at grade 0.030 says **27.7 %** and
**11.0 %**. The **27.8 %** and **11.1 %** come from a *different* row —
`laneMFW1B-receipt.md:135`, the per-leaf refused-ground census, which includes the **wet** clause
as well as the crag one:
```
refused GROUND per leaf: mountain 2,565 cells (27.8%) · polycentric 1,025 (11.1%) · city 301 (3.3%) …
```
So the ODQ attributes a crag+wet total to the crag-only threshold table. The shape argument is
unaffected (0.0/0.0/…/11/28 either way). Also "the flat families refuse zero cells" is 0.0 % for
five families and **0.1 %** for city/migration.

**DOUBTS.** The threshold is explicitly **UNSOAKED** and rides the tuning signature — the receipt
flags it, the ODQ does not. That flag should survive the retrovalidation.

### §270/§273 — additional mechanical checks I re-executed

| claim | source | verdict |
|---|---|---|
| suite 178 → 220 (+42, +2 files) | `MFW1S-suite.log` 178; `MFW1B-suite.log` `9 passed (9) / 220 passed (220)` | ✅ exact |
| determinism 10/10 at W1b | `MFW1B-det.log`: `21305bea…b533a` ×10, one unique | ✅ exact |
| 0 drawn on refused over 21,982 bodies | `MFW1B-battery.log:92`: `TOTAL: 21982 over 16 leaves / 12105 … 0 violations` | ✅ exact |
| two planted violations | `tests/domain/townMapFabricRefusal.test.js:94` and `:115` — the second plants the **SUBSTRATE under a finished fabric** | ✅ both exist as live pins |
| `physicalViolations` 7 → 1 | `MFW1B-battery.log:69`: `physicalViolations 1 over 16 leaves · 1 over 10 distinct sites` | ✅ exact |
| 96/96, metropolis headroom 1,280 | `MFW1B-battery.log:94-101`: `metropolis max 8420 / 9700 (headroom 1280)`, `ALL 96 RENDERS UNDER` | ✅ exact |
| water mechanism moves exactly 10 water leaves × 2 lenses | `MFW1B-attrib.log` arm cfB: **12 identical / 20 MOVED**, and the 20 are town/city/highwater/fjord/siege/plague/famine/migration/year-018/year-100 × 2 — **no dry leaf** | ✅ exact |
| `zoneUnwashedBodies` +1,462 | `MFW1B-battery.log:66`: `3726 … 1698`; W1S published `2264 / 1453`; Δ = **+1,462** | ✅ exact |

---

# §271 — THE P4 REPAIR AND ITS 13-ROW RE-RECORD

Commits inspected on `claude/composite-r4`: `0f59d0ea`, `335d0176`, `2d1e09ce`, `4eafca31`.
Receipt: `.../scratchpad/laneTE36-receipt.md` (606 lines).

## (a) Authorizing a 13-row golden re-record on chair authority

**EVIDENCE — the blast radius is exactly the declared one.** `git diff-tree --stat 4eafca31`:

```
 scripts/lib/news-headline-contract.mjs             |  26 +-
 scripts/lib/prose-family-contract.mjs              |  33 +-
 tests/fixtures/demographics-lifecycle-golden.json  |   8 +-
 tests/lint/.news-headline-contract-baseline.json   |  44 +-
 tests/lint/.prose-family-contract-baseline.json    | 547 +++++++++++++++++---
 tests/lint/.prose-numerics-baseline.json           |   4 +-
 tests/lint/newsHeadlineContract.walker.test.js     |   6 +-
 tests/lint/observedShapeReaders.walker.test.js     |  31 +-
 tests/lint/proseFamilyContract.walker.test.js      |  49 +-
 .../sovereigntyLightingContract.walker.test.js     |  27 +-
 10 files changed, 650 insertions(+), 125 deletions(-)
```

Ten files = five walkers + their baselines/libraries + the one golden. **Nothing outside the
declared scope moved.** The 13 rows are 12 named gate arms plus the golden; the commit enumerates
them by arm id — "newsHeadlineContract **A3/A5/A6**" (3), observedShapeReaders (1),
"proseFamilyContract **A1/A2/A3/A5/A6**" (5), proseNumerics (2), sovereigntyLighting (1) = 12,
plus the golden = **13**. This matches ODQ §272.3's enumeration exactly.

**STATUS: CONFIRMED that the re-record touched exactly the 13 declared rows and nothing else.**

**DOUBTS.** None on scope. On *authority*: this was a chair call on a golden, and its validity
rests entirely on judgment (b) below.

## (a′) — THE KEY-BY-KEY DIFF (§271.3 condition a). **I RE-EXECUTED IT.**

The program's own law requires this proof and forbids accepting the capture's exit 0 in its place.
I extracted both sides with `git show` and ran a leaf-key diff myself:

```
LEAF KEYS before 64  after 64
ADDED 0 []
REMOVED 0 []
CHANGED 4
    p5b-a.hash : "5c0ee08a…" -> "0d72e975…"
    p5b-b.hash : "122f66a8…" -> "e9c6d5b0…"
    p5b-c.hash : "ed5b0a48…" -> "422dbaa0…"
    p5b-d.hash : "505e4344…" -> "cebbe5e5…"
```

**64 keys in, 64 out, zero added, zero removed, exactly four changed, all four `.hash`.** ODQ
§272.2's claim is **CONFIRMED by independent re-execution**, not by reading the receipt. Because
only four keys moved, every named projection is byte-identical **by construction** — I printed
them: `foundingTicks`, `planIds`, `finalPopulations`, `satelliteIds`, `receiptHistogram` all
unchanged across all four seeds.

**I extended the same proof to the two large baselines, which the ODQ asserts but nobody
re-derived.**

`.prose-family-contract-baseline.json` (+475/−72 lines — the scariest-looking hunk in the commit):
```
rows array len 63 -> 63
rows identity set identical? true      added: []   removed: []
rows with any changed value: 23 of 63
totals {"families":4,"identities":63,...}  ->  {"families":4,"identities":63,...}
```
**"63 identities in, 63 out, zero added, zero removed" — CONFIRMED independently.**

`.news-headline-contract-baseline.json`:
```
liveness rows 26 -> 26        row identity identical? true
totals BEFORE {"rules":26,"activeRules":17,"inertRules":9,...}
totals AFTER  {"rules":26,"activeRules":16,"inertRules":10,...}
addressTotality rows 106 -> 106
knownInert: 9 rows before, 10 after — the ONE addition is `\bmay fall\b`
```
**"26 rules UNCHANGED; exactly one crosses active→inert" — CONFIRMED**, and the new inert row's
reason names both the seam and the scope, exactly as §272.3 claims:
> `populationDynamics.js::populationCandidate is the live decline authoring seam, and WAVE P4
> (ODQ §219.3) gated it … THE CORPUS LIGHTS EVERY FLAG, so this row reads INERT here and NOWHERE
> ELSE: demographicsEnabled is false in every shipped preset, where the seam still authors the
> headline.`

The other nine inert rows are byte-identical.

## (b) The derived-to-preserve argument — "if that reasoning is wrong, the whole repair needs the owner's signature BEFORE landing"

**This is the single most consequential item in my slice, so I traced the derivation to source.**

**EVIDENCE — the derivation, quoted.** `4eafca31` commit body:
> DEATH_CRISIS_GAIN = 3.0 was fitted to reproduce the legacy decline lane's own measured -13.0%/yr
> at the bound, and the deficit gain and the granary ceiling preserve measured severity rather
> than choose it.

In source, `src/domain/worldPulse/demographicsRates.js` at `4eafca31` (from the `0f59d0ea` diff):
```js
  // THE GAIN IS NOT A NEW DIAL. At the bound, full crisis, the composite sheds at
  // -13.4%/yr against the legacy decline lane's measured -13.0%/yr expectation: the
  // severity the world was tuned around is preserved and only the floor is added.
  DEATH_CRISIS_GAIN: 3.0,
```

**And the crisis weights are a recomputable re-expression, not an authored table.** The comment
claims they are "the legacy decline lane's OWN monthly penalties … re-expressed as a 0..1 severity
against the largest of them". The legacy penalties, read out of `populationDynamics.js` at the
same commit (`:283-287`):
```js
  if (hasConditionSignal(item, FOOD_CRISIS_ARCHETYPES, ['food_security'])) monthlyRate -= 0.013;
  if (hasConditionSignal(item, DISEASE_CRISIS_ARCHETYPES, ['healing_capacity'])) monthlyRate -= 0.02;
  if (hasConditionSignal(item, WAR_CRISIS_ARCHETYPES, ['defense_readiness'])) monthlyRate -= 0.016;
  if (hasConditionSignal(item, BURDEN_ARCHETYPES)) monthlyRate -= 0.006;
```
Divide each by the largest (0.020): **0.65, 1.00, 0.80, 0.30**. The landed table
(`demographicsRates.js:275-280`):
```js
export const CRISIS_MORTALITY_WEIGHTS = Object.freeze({
  food: 0.65,  disease: 1,  war: 0.8,  burden: 0.3,
});
```
**Four for four. The weights are arithmetically derived from the legacy lane, not chosen.**

The starvation-deficit threshold is likewise derived from authored tables rather than authored
(`laneTE36-receipt.md:144-147`):
> `starvationDeficit01Of` is derived from the authored tables, never authored:
> `(BIRTH_BANDS[t] / NATURAL_DEATH_BANDS[t] − 1) / DEATH_DEFICIT_GAIN` — 25.6% at thorp, 13.9% at
> town, 8.7% at city, 4.8% at metropolis.

**STATUS: CONFIRMED for two of the three constants by direct re-derivation** (the crisis weights,
and the deficit threshold's *form*). **PLAUSIBLE for `DEATH_CRISIS_GAIN = 3.0` itself.** The −13.4
%/yr vs −13.0 %/yr fit is asserted in a source comment and in the receipt; **the fitting run that
produced 3.0 is not receipted anywhere I can find** — there is no log, no fixture, no pin naming
−13.4. It is a plausible fit against a figure I *can* verify exists (the legacy lane's four
penalties), but the fit itself is unexecuted evidence in my hands.

**DOUBTS — and this is the one the retrovalidation entry itself flags as decisive.** The
derived-to-preserve argument is strong where it is checkable and unreceipted at its single most
important point. If the chair wants to close it, the cheapest closure is a pin that asserts
`-13.4%/yr at the bound under full crisis` — the same shape as the anti-floor arms, which *were*
executed per tier. Note the mitigations that hold regardless: nothing a player can reach moves
(condition d, verified below), and the constants are already flagged for the owner's tuning
signature with a written obligation to redo the re-record at his values (`4eafca31` body).

## (c) The anti-floor proof's sufficiency

**EVIDENCE — five arms, `laneTE36-receipt.md:139-173`, all labelled executed.**
> **(a) Past a tier's own starvation deficit there is NO positive fixed point.** … at **half** the
> starvation deficit the crossing occupancy is > 0.1 …; at **1.2×** it is ≤ 0.002 …
> **(b) A granary that fails takes the floor down with the bound.** … the resting population falls
> by more than 10×.
> **(c) The terminal lane is still reachable, and reachable only for cause.** A hamlet whose
> granary feeds 46 against 120 people … fires at **tick 106**; the SAME fixture with a sound
> granary survives the same 700-tick horizon with `deathTick === null`.
> **(d) The floor is not a constant.** … bounds 90 / 120 / 160 → **75 / 94 / 119**.
> **(e) Nothing anywhere clamps a population.** … including `pressure01 = 1e9`.

The asymmetry argument (`:203-210`): lawful worlds move **+0.11 and +0.05**, the failing world
**+0.41 and +0.27** — "*A raised floor would have done the opposite*".

**STATUS: CONFIRMED, and the arms are the right shape.** Arm (c) carries a **positive control**
(the sound-granary twin), which is precisely what stops a death pin from passing for the boring
reason. Arm (d) is a three-way discrimination that a floor-raise could not produce. Arm (a) is
stated as a property of the tables, both sides of the boundary. The pins are registered in
`tests/domain/demographicsFloor.test.js` (+350/−… lines in `0f59d0ea`) and
`tests/domain/demographicsWorldsHand.test.js` (**NEW**, +118).

**Independent corroboration I found that the receipt could not have used:** RS-4's grid, run at
the cured tip, shows **zero cells below the 0.05 floor over 126 completed cells** and a lowest
ratio of **0.3091** — while still producing a *tail* (39 of 126 under 0.5). A world where nothing
can fail would not have a tail. **The anti-floor claim is now supported by a soak, not only by
unit arms.**

**DOUBTS — one figure in the base column does not reproduce.** §271.1's trust argument is that
"*the base arm reproduces RS-1's 793, RS-3's 680 AND the two lawful worlds' 0.536/0.507 exactly*".
I checked all six base cells that RS-3 also ran, against `rs3-receipts/`:

| cell | TE36 base column | RS-3 receipt | |
|---|---|---|---|
| `w0-soak` ca-bd7e00d6 | 17,682 → **680** | 680 | ✅ |
| `w0-soak-b` ca-bd7e00d6 | 20,013 → **10,733** | 10,733 | ✅ |
| `w0-soak-c` ca-bd7e00d6 | 21,890 → **11,091** | 11,091 | ✅ |
| `w0-soak-b` maximal-lawful | 20,013 → **11,005** | 11,005 | ✅ |
| `w0-soak-c` maximal-lawful | 21,890 → **11,081** | 11,081 | ✅ |
| `w0-soak` maximal-lawful | 17,682 → **5,387** (×0.30) | **3,537** (×0.20) | ⛔ |

Five of six reproduce **exactly**. The sixth is off by 1,850 people. RS-3's own report
independently states the receipt figure (`laneRS3-report.md:96`: "`w0-soak::maximal-lawful` itself
at **0.200**"), so TE36's 5,387/×0.30 is the outlier, not the receipts. **It does not touch the
two cured cells, the FAIL→PASS verdicts, or the +0.11/+0.05/+0.41 asymmetry** — all of those use
rows that reproduce exactly. But it sits inside the table whose stated purpose is to prove "*the
substrate is faithful, so the cured column is a real before/after*".

## (d) Holding the CAS until the terminal is green

**EVIDENCE.** `docs/OWNER_DECISION_QUEUE.md:10476-10479` —
> **NO CAS UNTIL GREEN.** The tip 2d1e09ce is NOT exposed while step 15 is red — standing law is
> never past an unexplained red, and **an authorized explanation is not the same as an executed
> one.**

The sequence is visible in the commit graph and timestamps: `2d1e09ce` at 09:47:43,
`4eafca31` at 10:21:49, and §272.1 records the CAS `ac243e1c → 4eafca31` afterwards. The RS-4 run
log's first line confirms the exposed tip:
```
[soak] 54 cells, 3 workers, tip 4eafca31a295b5288f8c5b0b551e248e386e7791
```

**STATUS: CONFIRMED.** The tip that was exposed and soaked is the post-re-record one, not
`2d1e09ce`.

**DOUBTS.** None. This is the correct discipline and it was followed.

### §271 — condition (d), "nothing shipped moves", re-verified

`laneTE36-receipt.md:219-228` enumerates by execution, not by reading:
```
quiet_local / realistic_regional / dramatic_campaign / static_campaign /
narrative_campaign / living_realm        demographicsEnabled = ABSENT
full_simulation                          demographicsEnabled = false
PRESETS LIGHTING IT: 0 []
DEFAULT_SIMULATION_RULES has key: false
```
**STATUS: CONFIRMED** (enumeration, not assertion — which is what §271.3d asked for).

One shorthand worth noting: the commit body says "finalPopulations (**Brimhold 8,601** and its
siblings)". The four seeds carry Brimhold **8,586 / 8,601 / 8,661 / 8,575** — 8,601 is seed
`p5b-b` only. Harmless shorthand; a successor diffing on 8,601 across seeds would be confused.

---

# §274 — W2, THE WALL

Receipt: `.../scratchpad/laneMFW2-receipt.md` (605 lines).
Images read: `MFW2-zoombase-png/metropolis-parchment.svg.png` (3000×3000),
`MFW2-zoombase-png/city-parchment.svg.png`, `MFW2-zoom-png/city-CROP2.png`,
`MFW2-zoom-png/crossing-CROP.png`.

## (a) Ratcheting rather than curing the self-crossing walls — and whether a defect five of ten walled leaves SHIP should wait a wave

**EVIDENCE — the census, verbatim** (`laneMFW2-receipt.md:347-352`):
```
                                  BASE (MF-W1b tip)              TIP (MF-W2)
self-crossing circuit segments    11 over 16 leaves              12 over 17 leaves
                                   9 over 10 distinct sites      10 over 11 distinct sites
leaves affected (base)            city · metropolis · polycentric · highwater · migration
                                  — FIVE OF TEN WALLED LEAVES
```

**EVIDENCE — the instrument.** I read `MFW2-simple.mjs`. It is a sound proper-segment-intersection
test over each `ring.polygon`, skipping adjacent pairs and the wrap pair, with a strict
`t,u ∈ (1e-9, 1−1e-9)` interior test and `den === 0` returning false. **It undercounts** (a
collinear self-overlap reads as non-crossing), so the census is conservative. Note the label:
it counts crossing **pairs**, which the receipt calls "segments".

**EVIDENCE — I READ THE IMAGES. The defect is not subtle.**

**`MFW2-zoombase-png/metropolis-parchment.svg.png`** (the base = W1b tip, 3,000 px, "Warmgrund,
METROPOLIS · 71325 SOULS"). Viewed whole and then at a 900×1200 forensic crop of the
east/south-east quarter. What is visible:

- **A clean X-crossing at the top of the crop**, north-east of the GOVERNMENT QUARTER: two heavy
  black curtain segments cross each other at a shallow angle, forming a narrow bowtie, with a
  vertex dot on each arm. This is a ring passing through itself.
- **A small closed black loop hanging off the circuit** on the west side — the wall leaves the
  main line, encloses a scrap of empty ground containing **no fabric at all**, and rejoins.
- **A long, thin black triangle lying over blank common ground** south-west of the government
  precinct: apex at a vertex dot on the left, a narrow tail running ~370 px east, enclosing
  nothing. The wall doubles back on itself around empty land.
- **Two near-parallel heavy chords running down the eastern side** that converge and cross,
  producing an elongated lens.
- Throughout: the heavy black lines run as **straight chords right across the block grid** and
  **throw straight spurs out into open country**, terminating in mid-field with no gate, no
  ditch, and no relationship to the streets they cut. The ditch's dashed line follows some but
  not all of them.

This corroborates `laneMFW2-receipt.md:33-34` word for word ("*the metropolis's circuits read as
heavy chords crossing the town and throwing straight spurs into the countryside*") and
`:337` ("*at my base the three circuits read as heavy black chords crossing the town*").

**`MFW2-zoom-png/crossing-CROP.png`** (the W2 **tip**, the new through-river leaf) is the
contrast case and it is a genuine PASS. Visible: a smooth, **non-self-crossing** curtain across
the north of the leaf; an unmistakable **NOTCH run** where the wall dives into a deep V to wrap
the quarter with the dashed ditch following it in and out; **two gatehouses** as solid black pier
pairs with the road passing between them; **tower dots at visibly irregular intervals**, clustered
near the north-east gatehouse and **absent along the long left descent**; and the **through
river** running from lower-left to right with fabric on **both** banks and a hatched bridge deck
carrying a street across it. Every visual claim in `laneMFW2-receipt.md:334-335` is confirmed by
eye.

**`MFW2-zoom-png/city-CROP2.png`** (the W2 tip, demoted circuit) supports the receipt's own
PARTIAL grade: the standing wall is a clean heavy line; the demoted circuit reads as a faintly
darker diagonal carriageway with a ribbon of small plots beside it, and I would not have found it
had the receipt not told me where to look — which is exactly `:336`'s wording ("*A reader who was
told what to look for can find it. A reader who was not, cannot.*").

**STATUS.** The defect is **CONFIRMED and severe by eye**. The "ratchet, not cure" disposition is
**CONFIRMED as executed** (`:369-370`: ratcheted, only shrinks, with a non-vacuity arm that must
be **deleted** when the trace is cured). Whether it *should* wait a wave is the chair's call and I
do not rule — but the visual evidence is materially worse than the census's neutral phrasing
suggests, and the chair should weigh the images, not the number.

**DOUBTS — three, ranked.**
1. **⛔ The ODQ ratifies the BASE count, not what W2 SHIPS.** §274.3 says "eleven self-crossing
   circuit segments over sixteen leaves — FIVE OF TEN WALLED LEAVES". The receipt's own proof
   floor (`:464`) reads `⛔ self-crossing circuit segments **12 over 17 leaves / 10 over 11**`.
   The shipping tip carries **twelve**, not eleven, and the affected-leaf count at the tip is not
   published at all. "It predates this wave" is true and the base figure is the right one for
   *attribution*; it is the wrong one for *exposure*.
2. **⚠ The census has no captured log.** `MFW2-simple.mjs` exists; there is no
   `MFW2-simple*.log`. `MFW2-runfacts.log` is **cited in §16's artifact table and does not exist**
   on disk. I could not re-run either — `node_modules` under `laneMFW2-tip` are pruned (the
   `sharp` directory is empty), so the sandbox is currently **not re-executable**.
3. **⚠ The chair's own eyes-on verdict for the W2 metropolis has no retained raster.** Only four
   PNGs survive: two BASE plates and two TIP crops (`city-CROP2`, `crossing-CROP`). §8's
   metropolis row — "*the wave's clearest visible win, by removal*", the strongest visual claim in
   the wave — cannot be re-read. The TIP SVG exists (`MFW2-zoom/metropolis-parchment.svg`); I
   attempted to rasterize it and could not, for the reason in (2).

## (b) Bundling the multiplicity-region cure with the faubourg-id decision as one owner call

**EVIDENCE.** `laneMFW2-receipt.md:381-397` —
```
BASE 3,726 / 1,698 (16 leaves / 10 sites)      TIP 3,721 / 1,696 (17 leaves / 11 sites)
the unwashed quarters, EVERY ONE:
  town family   org.district.market_quarter~1     251 bodies   ×6 replicas of ONE site
  city/migration org.district.shadows_district    110 bodies
  metropolis    shadows_district~1 · ~2            75 · 56
  polycentric   market_quarter · religious_quarter 213 · 45
  fjord         market_quarter~1 · religious_quarter~1  229 · 64
```
> ⭐⭐ **EVERY ONE IS A MULTIPLICITY INSTANCE**, and `umbrella.js` publishes **ONE region per
> DISTRICT ID** by the landed one-element-per-district-id contract … ⭐ **THE CORROBORATION IS THE
> NEW LEAF: `crossing` is the only riverside-town leaf with NO `~1` sibling and it reads
> MISSING=0, unwashedBodies=0.**

The base figure `3,726` I verified independently in `MFW1B-battery.log:66`
(`zoneUnwashedBodies 3726 over 16 leaves · 1698 over 10 distinct sites`), and the +1,462 delta
against W1S's 2,264 is exact.

**STATUS: CONFIRMED as a characterization.** The enumeration is total ("EVERY ONE"), the
mechanism is named at its home (`umbrella.js`'s one-region-per-district-id contract), and the
corroboration is a **natural experiment** — a new leaf with no sibling reading 0 — which is
genuinely strong evidence, not a fitted story. The bundling with §238.4b's faubourg ids follows
because both are the same public surface.

**DOUBTS.** The corroborating leaf is `n = 1` and it was minted by this same lane for a different
purpose. That is not a criticism of the inference — a single decisive natural experiment beats a
correlation — but the chair should note the sample size before treating "not a fabric defect" as
settled. Also `laneMFW1B-receipt.md:518-520` had already labelled its own attribution
**PLAUSIBLE, not CONFIRMED**, noting "*the metropolis is a DRY leaf and it moved too, so this is
not purely the water damping*"; W2's characterization supersedes that but does not explain the dry
leaf's movement.

## (c) The demotion-before-packer ordering as W3's first item

**EVIDENCE.** `laneMFW2-receipt.md:147-158` —
```
leaf         ringStreets  towerRounds (refused)  ditchGardens (refused)  widenings  stubs
city              1            0  (0 emitted)        5  (19 refused)          4        2
metropolis        2            1  (18 refused)       9  (41 refused)          4        1
highwater         1            2  (11 refused)       4  (19 refused)          2        3
migration         1            0  (0 emitted)        5  (19 refused)          4        2
```
> ⛔ **THE FOSSILS ARE BEING REFUSED BY THE FABRIC THAT GREW OVER THEM — 80% of the ditch gardens
> and 90% of the tower rounds** … **the demotion runs after the packer and can only take leftover
> ground.**

Arithmetic check on the ODQ's percentages: tower rounds emitted 0+1+2+0 = 3, refused 0+18+11+0 =
29, total 32 → refused **90.6 %** ✅. Ditch gardens emitted 5+9+4+5 = 23, refused 19+41+19+19 = 98,
total 121 → refused **81.0 %** ✅. **§274.5a's "90 % of tower rounds and 80 % of ditch gardens"
reproduces from the receipt's own table.** The city row's "0 of 18 tower rounds" in §0 is the
*metropolis* row's 18; the city emitted and refused zero. Minor cross-row slip in the receipt's
own §0 (`:54`) — the ODQ does not repeat it.

**STATUS: CONFIRMED.** The cause is measured (a composition order, not a tuning value), the lever
is named ("the ring street must enter the derivation BEFORE the packer, exactly as §200's band had
to move above the ground law at MF-B8"), and there is precedent for the move.

**DOUBTS.** The claim that the ordering move "*turns a PARTIAL exit 7 into a pass*" (`:571-572`)
is a prediction, not a measurement. No counterfactual was built. Label it PLAUSIBLE.

## (d) Accepting the flank-grammar partial as a fixture measurement rather than a generator defect

**EVIDENCE.** `laneMFW2-receipt.md:162-168` —
> **Full closed ring 3 of 11 walled distinct sites = 27% against ATLAS T-10's ≈55%.** ⚠ **THIS IS
> A MEASUREMENT OF THE FIXTURE'S WATER MODES, NOT OF THE GENERATOR'S GRAMMAR.** Of the corpus's
> walled sites, one is dry (metropolis), one dry (polycentric), one coastal, and the rest are one
> riverside town … **a corpus total over a replicated corpus is a multiplied sample wearing a
> population's clothes.**

This is corroborated by the site census I verified elsewhere: the corpus is **6 dry / 10
bankside / 1 through**, and the town family (`town`, `siege`, `plague`, `famine`, `year-018`,
`year-100`) is **six replicas of one site** — `MFW1B-banks.log` shows four of them with byte-equal
bank splits (`1009 / 751 / 258 / 74/26`), which is the replication made visible.

**STATUS: CONFIRMED.** The denominator argument is sound and independently visible in the bank
census. Reporting the off-band number rather than grading around it is the correct discipline and
it is consistent with the same lane's refusal to widen a density to make `open-backed-D` occur
(`:182-188`).

**DOUBTS.** The verdict is *unfalsifiable on this corpus by construction* — the lane's own framing
concedes there is no population to measure against. Accepting it means accepting that exit 3's
flank-grammar arm cannot be graded until the exemplar set diversifies. That is a real carried
debt, and it now sits alongside the through-river gap W2 just closed.

---

# RS-4 RESUME — EXACT STATE

**Nothing is running.** All 20 pids in `rs4-receipts/pids.json` are dead (`process.kill(pid, 0)`
throws for every one); `ps` shows no soak process. The tree is safe to resume.

## What completed

| world | rows planned | receipts on disk | status |
|---|---|---|---|
| `w0-soak` | 54 | **54** | ✅ COMPLETE (`SEGMENT_EXIT=0` at 12:02:58) |
| `w0-soak-b` | 54 | **54** | ✅ COMPLETE (`SEGMENT_EXIT=0` at 13:13:57) |
| `w0-soak-c` | 54 | **18** | ⛔ killed mid-segment (started 13:13:57, no exit line) |
| **total** | **162** | **126** | **36 remaining, all in `w0-soak-c`** |

Grid identity: `rs4-config.json` → profile `cert-30`, seeds `[w0-soak, w0-soak-b, w0-soak-c]`,
`years 30`, `settlements 4`, `rows 54` → **162 cells**. Tip under test, from every `[soak]` line
in `rs4-run.log`: **`4eafca31a295b5288f8c5b0b551e248e386e7791`** — the P4 exposure, as §272.5
requires.

## Receipt health — all 126 are sound

- **126/126 parse.** Zero corrupt, zero truncated.
- **126/126 pass `rs4-resume-gen.mjs`'s own shape check** (`kind === 'whole_world_soak'` **and**
  `Array.isArray(yearlyHashes)`). I verified this explicitly **because resume-gen DELETES any
  receipt that fails it** — running it will not destroy work.
- **Zero failing cells.** `failures: []` on all 126, including every cell in `w0-soak`, the tail
  world that carried both RS-1's and RS-3's collapse.
- **Two cells were in flight at the kill and left nothing behind**: `ca-c51a82f0`, `ca-7fc3c374`
  (both `w0-soak-c`; both hold a pid in `pids.json` and no receipt).

## What the completed 126 already say about the P4 cure

This is the substantive part, and it goes further than the ledger records.

```
BELOW THE 0.05 FLOOR: 0 cells of 126
lowest ratio overall:  w0-soak_30_4_ca-bd7e00d6   0.3091  (17,682 -> 5,466)
median ratio: 0.6520      under 0.5: 39 / 126
```

**The cell that failed at RS-3 now passes, at the exact figure TE36's capsule replay predicted:**

| cell | RS-3 (base tip) | TE36 cured-column prediction | **RS-4 soak (executed)** |
|---|---|---|---|
| `w0-soak` ca-bd7e00d6 | 680 (×0.0385) **FAIL** | 5,466 (×0.31) | **5,466 (×0.3091)** ✅ |
| `w0-soak-b` ca-bd7e00d6 | 10,733 (×0.536) | 12,988 (×0.65) | **12,988 (×0.6490)** ✅ |
| `w0-soak-c` ca-bd7e00d6 | 11,091 (×0.507) | 12,352 (×0.56) | **12,352 (×0.5643)** ✅ |

**All three worlds reproduce TE36's cured figures to the person.** Two independent instruments —
a capsule lighting on a hand-built substrate and a full 30-year soak cell under the driver — agree
exactly. That is the strongest single piece of evidence in this cluster.

Note also: the grid still has a tail (39 of 126 under 0.5; lowest 0.3091), so the cure did not
flatten the distribution into a floor — which is the anti-floor claim measured at grid scale
rather than in unit arms.

**Caveat for the chair.** `ca-015` — RS-1's firing row — **is not in RS-4's array**. RS-4's
covering array is independently constructed, so only `ca-bd7e00d6` carries over. The class-level
claim ("*a clean grid proves the class*") therefore rests on the 36 remaining `w0-soak-c` cells
plus the 126 already clean, not on a direct re-run of RS-1's cell.

## How to resume — do NOT hand-edit anything

**The two resume configs on disk are STALE and must not be used as they stand:**
- `rs4-config-resume-w0-soak-b.json` still lists **21 rows** — but `w0-soak-b` is now 54/54 done.
  Feeding it to the driver re-runs 21 completed cells.
- `rs4-config-resume-w0-soak-c.json` lists all **54 rows** — but 18 are done; only 36 remain.

**`rs4-resume-gen.mjs` fixes both by design.** Reading it: it validates every receipt, deletes
corrupt ones, then **unlinks `rs4-config-resume-<seed>.json` for every seed** before writing fresh
ones, and emits only segments with remaining work. So the correct first move is:

```
node <old scratchpad>/rs4-resume-gen.mjs
```

Expected output, given the state I measured:
```
{"totalCells":162,"complete":126,"corrupt":0,"segments":[{"seed":"w0-soak-c","remaining":36}]}
```
and on disk afterwards: **one** config, `rs4-config-resume-w0-soak-c.json`, carrying exactly the
36 missing rows (`ca-c51a82f0`, `ca-7fc3c374`, `ca-9e3bb702`, `ca-ae84b6e4`, `ca-6ef7cd34`,
`ca-1aff8b86`, `ca-a9a74ae4`, `ca-41d37480`, `ca-3e7d3886`, `ca-7cd0fc46`, `ca-8115f813`,
`ca-143c674a`, `ca-8851e35a`, `ca-c14c052a`, `ca-67fa1474`, `ca-6106ea0e`, `ca-3cb452c0`,
`ca-171e373e`, `ca-73c86dc0`, `ca-61e71304`, `ca-1925e7f4`, `ca-7df9c70c`, `ca-d4b94088`,
`ca-19414db0`, `ca-41bab8a4`, `ca-29bc09e8`, `ca-d77d9694`, `ca-14e34b08`, `ca-a99397f2`,
`ca-cafdbb7c`, `ca-6b461e1a`, `ca-37750d86`, `ca-16b33428`, `ca-d1c85130`, `ca-0f4b516a`,
`ca-023a59d6`).

**Only the `w0-soak-c` segment needs to run.** At the observed rate (`w0-soak-b`'s 21 cells took
12:46:35 → 13:13:57 ≈ 27 min at 3 workers; `w0-soak`'s 8 took ~17 min at 2), 36 cells is roughly
**45–90 minutes** depending on worker count. `rs4-run.log` is only 17 lines — the driver appends
per segment, so it will simply continue.

**⚠ THE EVALUATION IS THE STEP WITH A HAZARD, AND IT IS ALREADY GUARDED.** RS-3 §6 found
`recordRun` is not idempotent and double-credited its ledger. `rs4-evaluate.mjs:121` carries the
adopted guard:
> `reason: 'already credited in this lane — the sentinel rs4-ledger-credited.marker exists;
> recordRun is NOT idempotent (RS-3 finding), so the fold is refused rather than repeated'`

**The sentinel `rs4-ledger-credited.marker` does NOT currently exist**, so the fold has not
happened and one clean `rs4-evaluate.mjs` run after the grid completes will credit it correctly.
Do not delete the marker afterwards.

**⛔ The ledger's own resume figure is wrong and would mislead a successor.**
`docs/OWNER_DECISION_QUEUE.md:10693-10694` records the interruption as
"*RS-4's monitor mid-grid (**~110/163**, tail world passing, zero floor trips)*". The measured
state is **126 of 162**. The "163" appears to count `pids.json` as a receipt; the "110" understates
completed work by **16 cells**. No work is lost (resume-gen re-derives from disk), but a chair
planning from the ledger figure will mis-scope the remaining run. The *qualitative* half of that
note is correct and now verified: the tail world passes and there are zero floor trips.

---

# RANKED DISCREPANCIES — sharpest first

**1. ⛔ §269's control set is off by one, and the omitted leaf is the only circuit-less leaf that
moved.** The ODQ elevates "the five unwalled leaves did not move (0.91–1.06×)" to "*what makes it
credible*". The PERF1 corpus carries **six** circuit-less leaves — `MFPERF1-budget.log` records
`year-018` as "*no circuit on this leaf*" and "*carries no working circuit*" — and
`MFPERF1-ab-final.log` shows `year-018 1928 ms → 1398 ms **1.38×**`. Two later receipts confirm
six-unwalled (`laneMFW2-receipt.md:310-311`, `:349-352`). The 2.05× and the 32/32 byte-identity are
untouched and I reproduced both exactly; what is weakened is the strongest form of the credibility
argument. The benign explanation (the `streetSeeds` cure, which every §202 leaf pays) does not
survive `fjord` gaining only 1.02× on a comparable §202 subject. **Unexplained, and directly under
a ratification.**

**2. ⛔ §274 ratifies the BASE self-crossing count, not what W2 ships.** The ODQ says "eleven …
over sixteen leaves — five of ten walled leaves". The receipt's proof floor says the tip carries
**twelve over seventeen / ten over eleven** (`laneMFW2-receipt.md:464`), and the tip's
affected-leaf count is never published. The base figure is right for attribution and wrong for
exposure. **And the images make this worse, not better**: the base metropolis at 3,000 px shows a
clean X-crossing, a closed loop enclosing nothing, a long empty self-doubling triangle, and heavy
chords throwing spurs into open country. The chair should weigh the pictures, not the number, when
re-deriving whether this waits a wave.

**3. ⛔ `DEATH_CRISIS_GAIN = 3.0`'s fit is the one unreceipted link in §271's derived-to-preserve
chain.** I re-derived `CRISIS_MORTALITY_WEIGHTS` from `populationDynamics.js`'s own four monthly
penalties and got **0.65 / 1.00 / 0.80 / 0.30** — four for four against the landed table. The
starvation-deficit threshold is derived from authored tables by a published closed form. But the
−13.4 %/yr fit that sets 3.0 exists only as a source comment and receipt prose; **no log, no
fixture, no pin names it**. The retrovalidation entry itself says that if this reasoning is wrong
the repair needed the owner's signature *before* landing. Cheapest closure: one pin asserting the
−13.4 %/yr at the bound under full crisis, in the same shape as the anti-floor arms that *were*
executed per tier.

**4. ⚠ One base cell in §271's fidelity table does not reproduce.** TE36 publishes `w0-soak
maximal-lawful` base as **17,682 → 5,387 (×0.30)**; `rs3-receipts/w0-soak_30_4_maximal-lawful.json`
gives **3,537 (×0.20)**, and RS-3's own report independently states 0.200. **Five of the six base
cells reproduce exactly**, including all three the ODQ quotes and both cured cells — so the
FAIL→PASS verdicts and the +0.11/+0.05/+0.41 anti-floor asymmetry stand. But the outlier sits in
the table whose stated job is to prove the substrate faithful.

**5. ⚠ The ledger's RS-4 resume figure is wrong: "~110/163" vs the measured 126/162.** Zero work is
at risk (resume-gen re-derives from disk and I verified all 126 receipts survive its shape check),
but a chair scoping the remaining run from the ledger will be off by 16 cells. The two resume
configs on disk are also stale in both directions; running `rs4-resume-gen.mjs` first fixes them
by design.

**6. ⚠ A pattern of missing logs, concentrated on numbers that carried rulings.** Every instrument
below exists as a `.mjs` and produced **no captured output**, so the figures live only in receipt
prose: `MFPERF1-q6cost.mjs` (the ≤0.03 % that grounded a **chartered-target refusal**),
`MFPERF1-acount.mjs` (the §202 sealed-set arrays), `MFW1B-dark.mjs` (the entire 12-mechanism
never-run table of §273.5), `MFW1B-mask.mjs` (the grade-cut table behind §273's threshold),
`MFW1B-refusal.mjs` (the exit-2 census), `MFW2-simple.mjs` (the self-crossing census), and
`MFW2-runfacts.log` which is **cited in §16's artifact table and does not exist**. Mitigations:
the never-run law and the refusal census are enforced by live non-vacuous pins I read directly
(`tests/lint/dossierContracts.walker.test.js`, `tests/domain/townMapFabricRefusal.test.js:94,115`),
and the q6cost arithmetic is checkable from the published per-call figures. **But the sandbox is
currently not re-executable** — `node_modules` under the lane tips are pruned (`sharp` is an empty
directory), so none of these can be re-run today.

**7. ⚠ §268's F2 tail figures are not derivable from the artifacts the report names.**
`laneRS3-report.md:95-96` publishes 0.074 / 0.222 / 0.216 where the receipts give **0.0657 /
0.1982 / 0.2027**, despite §5 stating that F1–F2 use `startPopulations`/`finalPopulations`. F1
reproduces exactly; the machine report carries only F1. F2 is INFORMATIVE and drove no ruling.

**8. ⚠ §267 carries two propagated wrong numbers.** "*the shipping map's 5–21 ms*" (ODQ
`:10184`) — the lane's own legacy column measures **2.9–10.3 ms**; the 21 ms is the folio's
`renderFolio` one column over. And the "**66-FILE** blast radius" for `townMapFixtures.js` is
**60** on the branch (`git grep -l townMapFixtures ac243e1c -- tests/`); the receipt's grep ran
inside the overlaid worktree and counted its own copied-in sandbox test files. Both findings stand;
both numbers are wrong.

**9. ⚠ §273's slope-threshold percentages conflate two tables.** The ODQ's "*hills 11%, mountain
27.8%*" are the per-leaf **total refused ground** figures (crag **+ wet**, `laneMFW1B-receipt.md:135`);
the candidate-cut table at grade 0.030 (`:117`) reads **11.0 %** and **27.7 %**. Also "the flat
families refuse zero cells" is 0.0 % for five families and **0.1 %** for city/migration. The shape
argument is unaffected. Separately: the threshold is **UNSOAKED and rides the tuning signature** —
the receipt flags this (`:121`), the ODQ does not.

**10. ⚠ Two visual-verdict rasters that grounded chair-level judgments were not retained.** W2's
metropolis TIP at 3,000 px — §8's "*the wave's clearest visible win, by removal*" — has no PNG;
only the TIP SVG survives and it cannot be rasterized in the current sandbox. Likewise W1S's
19-plate first act and W1b's acceptance verdicts are prose over PNG directories whose verdicts are
the lane's own. The BASE metropolis and city rasters, and the two TIP crops, **do** survive and I
read all four.

---

## Standing note on what I did NOT verify

- I did not run the repo gate, the sandbox suite, or any test. Every suite figure I quote is read
  from a captured `.log` with its `TRUE_EXIT` or vitest summary line.
- RS-1's `rs1-receipts/` contains only `pids.json`, so **RS-1's 793 could not be re-derived**. It
  is the one base figure in §271.1's fidelity list I could not check.
- I did not attempt to re-run any sandbox instrument; the lane trees' `node_modules` are pruned.
- The `.prose-numerics` and `sovereigntyLighting` rows I verified by diff and by the commit's own
  per-row explanations, not by re-running their walkers.
