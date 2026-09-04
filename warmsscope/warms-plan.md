# W-ARMS — ORDERED CONSISTS, BLOCKER VERDICTS, PREDICTED FIGURES
Lane WARMSSCOPE · 2026-09-04 · Seat Opus 5 · measurement-and-design only.
Base: `f537ce47e` (porcelain 0). Register acts belong to the chair at a landing.

## 1 · BLOCKER VERDICTS — CLAUSE TEXT READ, NOT THE SUMMARY

### 1.1 RECORDED BLOCKERS

| id | recorded blocker (verbatim from `RECONCILED.json`) | verdict | evidence |
|---|---|---|---|
| **H1** | Car 0 — MEASURE · `blocked_by: "The freeze."` | ⛔ **REFUTED** | Car 0 is *"a read-only rider … Zero product bytes"* and **not one of its five probes reads a freeze register.** Probe (2) is explicitly *"`EAGER_FIRST_PAINT_MODULES` at tip (import from `vite.config.js`, **no build**)"* — and `vite.config.js:309` exports it at `f537ce47e` (`export const EAGER_FIRST_PAINT_MODULES = EAGER_MODULES;`), already consumed by `tests/build/vendorPdfLazy.test.js`. Probes (1)(3)(4)(5) are an OSR run on a scratch copy, a grep, an esbuild stub and a line-pin check. `git ls-tree -r HEAD \| grep -iE "golden.*freeze\|\.golden-"` finds **no landed freeze register** — and all five probes are runnable now regardless. **Car 0 can run TONIGHT.** |
| **H2** | Car 1 · `blocked_by: "H1."` | ✅ **CONFIRMED, but narrowly** | Car 1 consumes Car 0 probes **(4)** (the esbuild stub of `arms.js`) and **(5)** (whether `wizardNewsAuthoring` pins a line in `pools.js`). It does NOT need probes (1)(2)(3) — those are Car 2's and Car 3's. So the dependency is real but is on two of five probes, not on the whole rider. |
| **H3** | Car 2 · `blocked_by: "H2."` | ✅ **CONFIRMED** | Car 2's `<Arms/>` wrapper and the header seam consume `arms.js`'s exports (`armsNodes`, `armsSvg`); `armsKinship.js` supplies only scalars into them. Genuine build order. |
| **H4** | Commit the volume · `blocked_by: "Nothing. Fix this before anything else in stage H."` | ✅ **CONFIRMED, and re-measured CHEAPER than recorded** | The volume carries **ZERO** `enforcement-claims.test.js` `CLAIM_RE` hits — re-measured tonight against all eight alternates of `CLAIM_RE` (`tests/docs/enforcement-claims.test.js:40`), rc=1. That matters because the enforcement-claims arm is a **banked known-failure at ceiling 6 with ZERO headroom** — a claim phrase in a new docs file would have breached it. It does not. No docs test freezes a docs/*.md count. |
| **H5** | Re-measure figures · `blocked_by: "The boarding base existing (i.e. the freeze)."` | ⛔ **REFUTED as stated** | A re-measure needs **A** base, not **THE** freeze. This lane re-measured 20 figures at `f537ce47e` with no freeze in existence, found nine decayed and one materially wrong. The *residual* obligation (anything a build settles) is real; the recorded framing is not. |
| **H6** | The skeptic pass · `blocked_by: "Unknown — determine this before dispatching H2."` | ✅ **RESOLVED: NOT RUN. CONFIRMED.** | Four-way negative: (a) §879.11's bill names it — *"a short Fable design note **+ skeptic pass**"*; (b) §880.5 records only *"W-ARMS-DESIGN COMPLETE"* and no skeptic; (c) a scan of every W-ARMS/W_ARMS/ARMS-DESIGN line in `docs/OWNER_DECISION_QUEUE.md` pairs "skeptic" with W-ARMS on **no** row other than §879.11's own charter text; (d) the design lane's own scratchpad holds `PLANS-SKEPTIC-REPORT.md` and `PLANS-SKEPTIC-2-REPORT.md` with **zero** case-insensitive "arms" hits each, and `L3-arms.log`/`L3-final-arms.log` are **LIGHTING** lane logs from `laneL2-tree` (a name collision — "arms" is a test arm, not heraldry). ⚠ The volume's §8 five-lens refutation is **self-administered by the design lane** and does not discharge an independent pass. |

**Recorded blockers surviving re-measurement: 3 of 6** (H2, H3, H4). **Two REFUTED** (H1, H5).
**One resolved from UNKNOWN to a confirmed open obligation** (H6).

### 1.2 UNRECORDED BLOCKERS THAT ARE REAL — five, found tonight

- **UB-1 · HIGH · the census being full is a NO-RED-MAY-LAND rule, and the design predates it.**
  `scripts/.test-ratchet-baseline.json` `_doc`: *"A failing test ABSENT from `entries` is a REGRESSION
  and reds the gate"*; `check-test-ratchet.mjs:50`: *"A NEW REGRESSION IS NEVER BASELINED. `--update`
  can only REMOVE entries"*. 10 entries, 0 removable headroom. ⇒ **Every W-ARMS car lands green or
  does not land.** The design (2026-09-01) carries no such clause. ⚠ **CORRECTION TO THE BRIEF'S
  FRAMING:** `totalTests`/`totalFiles` in that baseline are **scope-COLLAPSE floors**
  (`:1118`, `:1138`, at `SCOPE_FLOOR_RATIO`), not exact ceilings — so **a new test file does NOT
  breach the known-failure census.** No W-ARMS item needs census headroom.
- **UB-2 · MEDIUM · Car 2's new test file lands inside a two-sided trap.**
  `negativeAssertionAnchor.walker.test.js:64` — `const SCAN_ROOTS = ['tests'];`. The standing hazard
  records it reds *both* when a file gains an un-anchored negative *and* when you cure one too many,
  and that a hand-paired two-direction proof does not count. The design prescribes the right cure
  ("anchor every negative on the comment block's last line") but carries no two-sided warning.
- **UB-3 · MEDIUM · `armsKinship.js` takes THREE simultaneous zero ceilings, not one.**
  (a) `scripts/.full-typecheck-baseline.json` `_doc`: *"A file absent from `files` has an allowance of
  ZERO"*; (b) `domainStrictBaseline.test.js:41-43`: *"the ZERO-CEILING LAW FOR NEW WORK — a domain
  file absent from the baseline gets an allowance of 0 (`base[file] ?? 0`)"*; (c)
  `domainAnyCastBaseline` on the same law. The design names (c) and the "type from the start" habit;
  it does not name that all three fire at once on one new file. `arms.js` (src/design) and
  `HouseArmsBlock.jsx` (src/pdf) each take (a) alone — both roots are listed in the baseline.
- **UB-4 · LOW-MED · W-ARMS is NAMED in a recurring-by-construction register defect.**
  `docs/FABLE_RETROVALIDATION_QUEUE.md:2280`: *"Any register whose SUBJECT tree is `src/**` and whose
  freeze was taken on a dock one landing back carries this defect BY CONSTRUCTION … **Every remaining
  landing of this arc moves `src/`** — HORIZON-DARK, ENCOUNTERS, LIGHTING, GOLDEN, **W-ARMS** — so this
  will recur at every one of them unless the walker is made base-relative or the refreeze becomes a
  standing landing act."* Recorded as a law; **not** recorded as a W-ARMS blocker. It bites D1.
- **UB-5 · MEDIUM · a decayed premise a builder would act on.** The design's §3.1/§6/§8.2 all rest on
  *"The T13 first-paint closure sits at **1,047,205 B** against a RAW ceiling of 1,047,000 — **205 B
  OVER**, the owner's open re-ask"*. **REFUTED:** §883 records the T13 composed tip as *"268 bytes
  under the ceiling nobody raised"* and `HANDOFF_CURRENT.md:39`/`:235` record *"288 B under the
  UNRAISED 1,047,000"*. The tree is **UNDER**, not over. A builder reading the design would price a
  live ceiling breach that does not exist. **The conclusion the design draws (W-ARMS must add 0 B) is
  unchanged and still right; its stated ground is stale.**

## 2 · HARD-LIMIT COLLISION TABLE

Re-measured at `f537ce47e`. **All seven zero-headroom measures CONFIRMED EXACTLY as the brief states**
— they are the `magnitude.ceiling` values of the known-failure census's four voice rows plus the two
typecheck baseline totals:

| measure | ceiling | source, read tonight |
|---|---|---|
| JSX arm `em` | **34/34** | census entry 1, `magnitude[0].ceiling = 34` |
| JSX arm `bang` | **0/0** | census entry 1, `magnitude[1].ceiling = 0` |
| JSX arm `files` | **15/15** | census entry 1, `magnitude[2].ceiling = 15` — *"src/**/*.jsx component files whose count differs from their frozen per-file baseline"* |
| Tier-2 `em` | **382/382** | census entry 3, `magnitude[0].ceiling = 382` |
| Tier-2 `files` | **69/69** | census entry 3, `magnitude[2].ceiling = 69` |
| Tier-2 `bang` | **9/9** | census entry 3, `magnitude[1].ceiling = 9` |
| Tier-2 `total` | **770/770** | census entry 4, `magnitude[0].ceiling = 770` (*"against the hardcoded budget of 670"*) |
| domain-strict typecheck | **1121/1121** | `scripts/.domain-strict-baseline.json` `total = 1121`, 75 files |
| full typecheck | **173/173** | `scripts/.full-typecheck-baseline.json` `total = 173`, 38 files, `resolvedCount 1400` |

Scope facts that decide every collision: `voiceMechanics.test.js:165-166` walks **`src/data` + `src/domain`
only** for Tier-2 and **`src/**/*.jsx`** for the JSX arm; **comments are excluded** (proved by the test's own
positive control at `:363-374`: *"comments and template expressions excluded"*).

| item | Tier-2 voice | JSX voice | typecheck | census headroom |
|---|---|---|---|---|
| **A1 Car 0** | — | — | — | none needed (0 bytes) |
| **A2 Car 1** | ✅ **CLEAR BY PLACEMENT** — `arms.js`, `pools.js`, `emblemPaths.js` are all `src/design/organic/ornament/`, **outside** the `src/data`+`src/domain` walk. `.svg` and `.mjs` also outside. | — (no `.jsx`) | ⚠ `arms.js` is a NEW file under the listed root `src/design/` ⇒ **zero allowance** in full-typecheck | none needed |
| **A3 Car 2** | ⛔ **COLLIDES BY EXPOSURE** — `armsKinship.js` is `src/domain/display/`, inside the walk. **One em dash in any string literal breaches `em 382/382` AND `total 770/770`.** Docblocks are safe. | ⛔ **COLLIDES BY EXPOSURE** — `Ornament.jsx` + `DossierHeaderRow.jsx`. One em dash breaches `34/34`; one bang breaches `0/0`. | ⛔ **THREE zero ceilings on one file** (UB-3) | none needed — the ONE new test file bills lighting + anchors, not the census |
| **A4 Car 3** | — | ⛔ **COLLIDES** — `Cover.jsx` edit + `HouseArmsBlock.jsx` NEW. A new `.jsx` whose count differs from its implied frozen zero also burns the **`files 15/15`** slot. | ⚠ new file under listed root `src/pdf/` ⇒ **zero allowance** | none needed |
| **A5 Car 4** | — | — | — | out of this landing |
| **B1 commit the volume** | ✅ **CLEAR** — `docs/` is outside both walks | ✅ | ✅ | ✅ zero CLAIM_RE hits (re-measured) |
| **B2 skeptic** / **B3 re-measure** | — | — | — | 0 bytes |
| **D1–D4 register acts** | — | — | — | D1 hits UB-4 |

⭐ **THE SHARPEST SINGLE CONSEQUENCE, AND IT IS INVISIBLE IN THE DESIGN.** `blazonText(arms)` — the one
prose-shaped export in the whole design, producing *"Azure, a tower Or on a plate, a chief Argent;
quarterly with Gules, a sheaf Argent"* — is placed in **`arms.js` (`src/design/`)**, which is OUTSIDE the
Tier-2 walk. **Had it been placed in `armsKinship.js` (`src/domain/display/`), as the "one file"
alternative (iii) in §3.1 would have done, its punctuation would sit inside a ratchet at 382/382 and
770/770 with zero headroom.** The two-file split is load-bearing for a reason the design never states.

⛔ **REFUSED, because the em-dash question cannot be settled from the design text:** whether Car 1's ~24
`arms-*.svg` samples or Car 2's/Car 3's authored code introduce an em dash **anywhere** is a property of
code nobody has written. The correct control is a **pre-commit `grep -n '—'` over every touched
`src/data`, `src/domain` and `src/**/*.jsx` file, and every new `.jsx`**, run by each car as its own arm.
Recommend adding that to each car's STOP list.

## 3 · THE ORDERED CONSISTS

### CONSIST W-ARMS-0 — "THE ZERO-BYTE HALF", LANDABLE NOW, OFF THE CRITICAL PATH

Ground: all three cars are zero product bytes, **none depends on the GOLDEN freeze** (H1 and H5 REFUTED
above), and B2 is an **unmet term of the charter's own two-part bill** — building A2–A4 before it would
be building past a named obligation. This consist can run in parallel with the LIGHTING/DESK/GOLDEN work
and costs the critical path nothing.

| car | act | registers moved | predicted figures |
|---|---|---|---|
| **W0-1** | **Commit `DESIGN_W_ARMS.md`** to the ledger line's `docs/` (item B1) | **NONE** | `enforcement-claims` unchanged at its banked ceiling **6** — DERIVED: zero CLAIM_RE hits, measured. Lighting census **unmoved** (subject is `tests/`, not `docs/`). Both typecheck baselines **unmoved** (roots are `src/**`). Both voice arms **unmoved**. **This car moves no register at all** — the cheapest act in the block and the one every other item depends on. |
| **W0-2** | **The independent skeptic pass** (item B2) — a reader seat that has NOT read the design, five lenses against §8's five, plus the two the design could not self-administer: (i) is the two-file split still right after UB-3's three-way zero ceiling? (ii) does §8.3's name-threading obligation actually close, or does it re-open `SettlementPDF`'s optional-props contract? | none (0 bytes) | ⛔ **REFUSED** — a skeptic's finding count is not derivable in advance. |
| **W0-3** | **Car 0's five probes** (items A1 + B3) — run at `f537ce47e` now, **re-run at the boarding base** | none (0 bytes; OSR run read-only, `--write` NOT run) | OSR predicted **UNCHANGED at 1,993 findings / 1,409 identities / 388 files** (measured base tonight: `scripts/.observed-shape-readers-baseline.json` `total 1993`, `identities 1409`, `inventory` 388 keys, `schema 15`, `frozen 2026-09-03` at `ffe0dbb81`). **Label: PLAUSIBLE** — this is exactly what the probe exists to settle. `EAGER_FIRST_PAINT_MODULES` size: ⛔ **REFUSED** (not read; the probe reads it). esbuild stub bytes: ⛔ **REFUSED** (the stub does not exist). |

⚠ **A findable OSR fact for W0-3, re-measured tonight so the probe does not re-find it:**
`parentRef on settlement` **IS banked, in exactly four files** — `src/domain/settlementParentRef.js` (2),
`src/domain/worldPulse/lineageClaim.js` (1), `src/store/campaignPulseHelpers.js` (1),
`src/store/campaignWorldPulseDeferred.js` (1). The design's "four baseline rows" claim is **CONFIRMED in
substance** (its line numbers `:911,:1295,:2172,:2179` are decayed). `obligeeId`, `obligorId`,
`complianceState`, `treaties`, `liveEdgeId`, `foundedTick` return **zero inventory files**; `topExport`
returns **2** and `terrain` returns **5** — so the design's "kind bias must not read them directly" is
CONFIRMED. ⚠ The design infers *"NOT banked ⇒ PLAUSIBLY clean"*; that inference is only sound if a
zero-row identity means the **scanner never classifies it**, not merely that nobody reads it. **The
probe must distinguish those two cases** — it is the one place the design's reasoning could invert.

### CONSIST W-ARMS-1 — "THE BUILD", ITS OWN GATE, AFTER THE GOLDEN FREEZE

Slot ground, quoted (§880.5): *"so W-ARMS lands **AFTER L9 and before the walk**, on its own gate after
T13 and after the freeze; the arc's W-ARMS slot moves accordingly."* ⚠ **This is a chair CLEANLINESS
ruling, not a technical dependency** — the design's stated ground is *"landing after L9 keeps the GOLDEN
freeze's corpus untouched by a display-only landing."* Recorded so a successor does not read it as a
hard bind.

| car | act | registers moved | predicted figures |
|---|---|---|---|
| **W1-1** | **Car 1 — the leaf + pins** (A2). ⭐ The design permits Cars 1 and 2 to collapse into one landing car **iff Car 0's OSR probe is clean** — recommend keeping them separate anyway, because Car 2 carries the build and the UI-shift record and Car 1 does not. | ornament golden family (**by ADDITION only**) | `docs/samples/organic-craft/ornament/` **16 → 16 + N**, N = Car 1's authored sample count (design estimates 24). ⛔ **REFUSED to name the total** — 16 is measured, N is not yet authored. Existing `EMBLEMS` samples: **byte-identical, 0 changed** — DERIVED from Car 1's own STOP ("any existing sample byte moves ⇒ STOP"). |
| **W1-2** | **Car 2 — the adapter + the web seam** (A3) + **D2** the DECLARED UI shift record + **D4** the one full build | lighting census (**D1**), anchors, typecheck ×2, both voice arms, OSR (read-only) | Lighting `files` **2515 → 2516** — DERIVED: the census subject is per-file over `tests/` and W-ARMS adds exactly one test file. `parked` **371 → 371** — DERIVED: no parking act. `credited` **2144 → ?**: ⛔ **REFUSED** — I did not read the credit rule, so I cannot say whether the new file earns credit. `titles` / `suiteTitles` (**22922 / 6153**): ⛔ **REFUSED** — a function of describes/its nobody has authored. Typecheck **173/173** and **1121/1121 UNCHANGED** — a REQUIREMENT (zero allowance on the new file), not a forecast. All seven voice measures **UNCHANGED** — a REQUIREMENT. Eager chunk hashes / first-paint closure: ⛔ **REFUSED** — needs a build this lane may not run, and the design's own figure is stale (UB-5). |
| **W1-3** | **Car 3 — the PDF seam** (A4) — **land LAST so the paid surface is vetoable alone**, and **D3** the §713.2 comparator + fence at the tip | JSX voice arm, full typecheck, `goldenViewModel` (asserted unmoved) | `goldenViewModel.test.js.snap` **17 lines, byte-identical** — 17 measured tonight; the byte-identity is DERIVED from §4.2's three-way construction proof (`SHARED_FIELDS` rows only; `src/pdf/lib/viewModel.js` carries **0** emblem/counterseal/parentRef/hegemony mentions, re-measured; the primitive adds no `<Text>` leaf). §713.2 **525/525 + fence 21/21**: ⛔ **REFUSED** — I could not locate or re-derive either count at `f537ce47e`; both figures are quoted from §879.11 and the design, and are **chair-owned at the landing**. |

### HELD, NOT SCHEDULED

- **A5 Car 4 (CC0 roster)** — owner-gated taste (§9.8), explicitly *"not in this landing"*. Substrate
  re-measured and stable: 104 files / 279,799 B.
- **C2 the eleven §9 taste rows** — owner's desk. Only **§9.1** (seed root) and **§9.3** (colour
  tinctures) would MOVE a landed golden family if answered against the chair's recommendation; the
  other nine are cost-free either way. Worth stating when the rows go up.
- **C1 the one-word veto** — standing and open. A veto drops A1–A5; **W0-1 (committing the volume)
  survives a veto as a record of what was designed and why.** That is a further reason to run W-ARMS-0
  regardless of the veto's outcome.

## 4 · THE RECOMMENDED ORDER, IN ONE LINE

**W0-1 (commit the volume) → W0-2 (the skeptic pass) → W0-3 (Car 0's probes) — all three NOW, in
parallel with the rest of the arc, at zero critical-path cost — then, after the GOLDEN freeze:
W1-1 → W1-2 → W1-3 on one gate, with Car 3 last so the paid surface stays separately vetoable.**

Why W0-1 first and not W0-3: the volume is the charter for all five cars and exists in exactly one
scratchpad directory. Everything else in this block is recoverable; that file is not.
