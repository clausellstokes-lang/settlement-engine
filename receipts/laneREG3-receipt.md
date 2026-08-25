# lane TE-REG-3 — THE SHAPE CODE (register arc wave three) — RECEIPT

BASE: `8890e3f3e6b8e9e5e83a9da7191c26f768b9ec09` (refs/preserve/map-sandbox-reg2-walls)
WORKTREE: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREG3-tree` (detached)
CHARTER: docs/DESIGN_REGISTER_PROGRAM.md §0, §2 L-REG-8, §5 REG-3 row, A1–A6 in full.
DRESS TARGETS: hf208-spec-roof-ticks (the plan-view roof law) · hf323-spec-church-ladder
(rank carried by plan complexity; roofed white vs unroofed hatched) · hf378 density ladder.

---

## RESUME POINT 0 (t+~40) — CONTEXT ABSORBED, NOTHING WRITTEN

Worktree created at the sealed tip; `node_modules/seedrandom` copied (the established cure).
Baseline render executed: `node harness/exemplars.mjs reg3work/base-out` → **29 files**, 14.7 s.

READ IN FULL: the charter (body + A1–A6); DETAIL-REGISTER.md (all 11 classes + the projection
doctrine + the top-12); INSTRUMENTS.md (all ten instruments, the four caught defects, the two
i6 repairs, the blind-silhouette protocol §9.1–9.4); the REG-2 receipt (method template, the
§217 table, the raises the chair now owns); `institutionShapes.js` (1 file, 333 lines — the
whole shape derivation); `institutions.js` ARCHETYPES (23 rows, rungs/variants/clustered/power);
renderFolio §§10, 11, 11a, 11b, 11c, 12, 13 (the fabric, the two-tier stroke, the ridge tick
ration, the landmark archetype draw); i8's committed TRACE table (31 op classes).

### THE SHIPPED SHAPE CODE, AS IT IS TODAY (measured by reading)

- **Landmarks** carry `archetypeSolids()` — 16 branches over 23 archetypes, each a fixed
  composition of 1–7 `rectAt` parts with `v`-switched arrangements (worship has 4, hall 2,
  market/port count-by-rung). Every non-`monumental` institution collapses to `ordinary`
  (a single 1.15 × 0.95 block) except the seven physical absolutes in `KEEP`.
- **Ordinary buildings have NO type at all.** §11 draws `p.polygon` filled by
  `MATERIAL_TONE[p.material]` stepped by `roofStep(p.tone, p.wealth)` minus
  `CHARACTER_TINT[p.character]`. There is no per-building form decision anywhere.
- **Roofs**: §12 draws ONE ridge tick — a single centred segment along the widest axis — on a
  rationed top-share of parcels by area. No hip, no plane tint, no chimney, no cross-gable.
  hf208's roof law is 1 of its 10 clauses implemented.
- **Landmark interior detail**: `ridge` (one line), `bays` (n cross ticks), `yard`, `wheel`,
  `well`, `pit`. No forecourt void, no rank-scaled prominence beyond a fill mix.

NEXT: measure what typing data the fabric actually carries (probe, not reading); read the
§494 CompoundMember contract shape; view hf208 + hf323; read the R-INST structural imperatives.

---

## RESUME POINT 1 (t+~85) — THE FABRIC'S TYPING DATA MEASURED; THE SALIENCE DEFECT DIAGNOSED

### (a) WHAT TYPING DATA THE FABRIC CARRIES — `harness/laneREG3/probeTyping.mjs`, all 18 leaves

**The answer is that every ordinary building is ALREADY TYPED and the shape code never asked.**

| population | field | coverage | domain (counts over the whole corpus) |
|---|---|---|---|
| parcel (16,834) | `character` | **100 %** | merchant 9,149 · residential 4,290 · civic 1,332 · criminal 1,016 · craft 818 · religious 189 · other 21 · arcane 19 |
| parcel | `wealth` | 100 % | wealthy 10,450 · comfortable 2,123 · poor 2,119 · modest 1,280 · opulent 862 |
| parcel | `material` | 100 % | slate 7,474 · tile 5,058 · shingle 2,736 · thatch 1,566 |
| parcel | `gable` / `wing` / `matrix` | 100 % | true on 2,022 / 4,484 / 4,290 |
| parcel | `rung` | **2.7 %** | hovel 235 · cottage 217 — ⚠ too sparse to key a family on |
| parcel | `derelict` | 100 % | true on 397 |
| habitation (614) | `kind` | 100 % | **farmstead 491 · cottage 92 · shelter 18 · grange 13** |
| faubourg bldg (138) | `kind` | 100 % | **house 114 · inn 24** |
| landmark (1,196) | `archetype` | 100 % | craft 346 · market 194 · hospitality 114 · noxious 104 · extraction 84 · worship 69 · garrison 52 · hall 51 · … |
| landmark | `rung` | 100 % | 0 ×251 · 1 ×573 · 2 ×347 · 3 ×25 |
| landmark | `monumental` / `prominent` | 100 % | 201 / 135 of 1,196 |
| organism (87) | `category` | 100 % | merchant 46 · religious 20 · civic 12 · arcane 3 · criminal 3 · craft 2 · other 1 |

⭐ **NOTHING NEEDS GUESS-TYPING.** `character` is consumed today by exactly one thing — a tint
step (`CHARACTER_TINT`) — and by no shape decision anywhere. The farmstead and the inn are
already named populations. The wave's typing arm is therefore a CONSUMPTION, not an invention.

### (b) THE §217 PRE-MEASURE, BEFORE A LINE OF ORNAMENT (base = sealed tip, unarmed)

| leaf | tier | prims | ceiling (signed) | headroom |
|---|---|---|---|---|
| thorp | thorp | 904 | 1,000 | **96** |
| hamlet | hamlet | 1,126 | 1,200 | **74** ⛔ tightest in the corpus |
| village | village | 1,226 | 1,800 | 574 |
| mountain | village | 1,529 | 1,800 | 271 |
| town | town | 4,386 | 5,400 | 1,014 |
| town-2 | town | 4,526 | 5,400 | 874 |
| fjord | town | 4,584 | 5,400 | 816 |
| city | city | 5,799 | 6,800 | 1,001 |
| metropolis | metropolis | 7,985 | 9,700 | 1,715 |

⛔ **AND REG-2's ARMED SPEND IS NOT IN THAT TABLE.** REG-2 measured town 5,363 / city 6,779
against the same signed ceilings, leaving **37 and 21 ops** for every later wave. Any REG-3
ornament that is not paid for by a subtraction is unaffordable at town and city the moment the
rampart arms beside it. **THE SUBTRACTION IS NAMED IN ADVANCE: §12's roof-ridge tick is
SUPERSEDED, not supplemented** — the hf208 roof plan is the same accent done properly, so the
wave spends §12's ration rather than adding to it.

### (c) ⭐⭐ THE SALIENCE DEFECT, DIAGNOSED — and it is not a tone problem

REG-I0 instrument 4 run as-is over all 18 leaves (`harness/laneREG3/salienceRun.mjs`, which
SHELLS the instrument and never re-implements it), headless Chrome at 2200 px:

```
BEATS-DECOY: 10 of 18 leaves · BAND-PASS: 0 of 18
BASE-town  REAL 0.5738  vs  DECOY 1.0349      ← reproduces §592 exactly
```

`harness/laneREG3/probeAnchors.mjs` names the cause. i4 reads **the top-4 landmark masses by
drawn area**, and:

| leaf | top-4 masses by area | biggest MONUMENTAL |
|---|---|---|
| town | money_changers 164.4 · parish_church 162.1 · prison_stocks 148.6 · small-hospital 144.1 — **1 of 4 monumental** | 148.6 |
| village | alehouse 110.5 · cooper 88.4 · mill 81.1 · maltster 73.4 — **0 of 4 monumental** | weekly_market **50.6** |
| metropolis | mercenary_quarter (rung 2) **499.9** · mint (rung 3) 287.7 · **great_cathedral (rung 3) 219.2** · great_library 214.4 | 499.9 |

**TOP-4 SLOTS HELD BY A MONUMENTAL: 9 of 16.** Two structural facts fall out:

1. ⛔ **RANK DOES NOT REACH THE DRAWN BODY.** `archetypeSolids` reads `lm.rung` for exactly one
   archetype (`port`'s pier count). A rung-3 great cathedral therefore draws 219 units while a
   rung-2 barracks draws 500. hf323's law — *complexity of PLAN carries rank* — is unimplemented,
   and §161n's "more piers, not bigger ones" reaches one branch of sixteen.
2. ⛔ **A NON-MONUMENTAL INSTITUTION IS DRAWN IN FABRIC TONE** (`shade(roofTone, jitter)`), so
   the masses the eye is offered at village tier are a cooper and a maltster wearing the fabric's
   own value. The decoy — the same outline slid onto ordinary fabric, picking up street ground —
   is legitimately louder.

⭐ **THE CORPUS'S OWN CURE IS A PROJECTION, NOT A DIAL.** hf323 draws a monument as a WALL-PLAN:
thick poché, **white interior when roofed, cross-hatched when unroofed**, against the roof-plan
fabric around it (hf266 states the same contrast in tint). Today the monument is drawn DARKER
than the fabric (`mix(roofTone, P.ink, 0.34–0.52)`), which is a value step in the direction that
makes it merge with the ink. Flipping to hf323's roofed-white poché is traceable, is the
plate's own rule, and is exactly the quantity i4 measures.

NEXT: the family grammar as data; the roof law; the wiring; the pre-measure re-run.

---

# ⭐ TE-REG-3 · THE SHAPE CODE — LANDED

**BASE** `8890e3f3e6b8e9e5e83a9da7191c26f768b9ec09` (refs/preserve/map-sandbox-reg2-walls)
**TIP** `93fa8a2ca7c347c35aea94776dfeb7dc70bf0190` — detached, on the lane worktree.
Two checkpoint commits: `3a20fc03c` · `93fa8a2ca`.

⭐ **RE-PROVED AT THE COMMITTED TIP, NOT AT THE WORKING TREE** (the pre-commit-hook hazard: a
hook that re-stages makes `git diff HEAD` blind). Working tree clean against HEAD; dormancy
29/29 byte-identical to the sealed base; determinism 29/29; and the armed corpus every figure
above was measured on is byte-identical to the one the tip produces.

## §1 · WHAT LANDED

Every drawable body now carries a **TYPE** derived from a field the fabric already published, and
each map-visible class carries a **SHAPE FAMILY** in A3.1's form — ANATOMY + INVARIANTS + SLOTS,
the slots rolled by the building's own seed with the world's thumb on the scale. Landmark forms
gained rank-scaled composition and forecourt voids per hf323; every building gained the hf208
plan-view roof. **Nothing is a template**: the enumerated slot table is committed as data
(`FAMILIES` in `shapeCode.js`) and every value is either read off a plate at its use, derived
from a fact the fabric or an R-INST tranche already carried, or marked UNSOAKED for the tuning
signature.

## §2 · THE EXITS, EACH WITH ITS EXECUTED FIGURE

### (1) THE ENUMERATED SLOT TABLES — **COMMITTED AS DATA**
`src/domain/townMap/fabric/shapeCode.js` `FAMILIES` — 12 families, each with `anatomy`,
`invariants` (the pinned few), `source` (its R-INST tranche and its corpus plate) and `slots`,
every slot carrying `values` (the enumerated band), `bands` (when each is legal) and `bias` (the
WORLD RULE that shifts it, stated as a rule and not as a number in prose). Sourcing, per family:

| family | anatomy from | invariants pinned |
|---|---|---|
| church | R-INST-3 §5(f) `BASILICAN` rungs CELL_2→AISLED_1→AISLED_2→WOOL→METROPOLITAN + family E's churchyard · hf323 | oriented axial nave · a precinct void |
| hall | R-INST-1 §4(d) `STACKED_HALL_OVER_ARCADE` (the ONE load-bearing civic form at town+, external stair REQUIRED) · hf266 column-dot arcades | broad hall 1.6–2.4 : 1 · an arcade along one long side |
| inn | R-INST-4 §1.2 CONFIRMED *"a COURTYARD WITH A WIDE STREET PASSAGE"*; parti ladder §3(f) spareChamber→lPlan→oneGallery→galleryRing→doubleCourt; Star Inn measured 60×70 ft, range 60×22 ft, 4 bays, ONE the entry · hf341 | a street range broken by a gate passage (a VOID, not a mark) · an enclosed yard behind |
| warehouse | R-INST-2 §18 pakhuis 5–8 m × 30 m · hf122 | a long deep range 3.0–5.0 : 1 · the narrow end addresses the water |
| farmstead | R-INST-3 §8(f) `GLEBE_FARMSTEAD` · hf206 fold-yard | house and barn at right angles · a yard in the crook of the L |
| craft | R-INST-2 §4 Pantin 1962–3 (shops 6–12 ft; Tackley's) · hf120 | a narrow street front with a deep body running back |

The remaining six (quay · works · market · mark · cottage · rowHouse) carry their tables too, so
the totality table has no blank row.

### (2) ⭐⭐ LANDMARK SALIENCE — **THE §592 BASELINE IS REVERSED**
REG-I0 instrument 4 run AS-IS (`harness/laneREG3/salienceRun.mjs` shells it; nothing is
re-implemented), headless Chrome at 2200 px, all 18 leaves:

| | BEATS MATCHED DECOYS | BAND-PASS (each ≥ 1.0, group ≥ 1.5) |
|---|---|---|
| **BASE** (sealed tip) | 10 of 18 · **walled 5 of 12** | **0 of 18 · walled 0 of 12** |
| **ARMED** | **18 of 18** · ⭐ **walled 12 of 12** | 12 of 18 · **walled 10 of 12** |

`BASE-town REAL 0.5738 vs DECOY 1.0349` → `ARMED 1.8538 vs 1.1521`. The exit's own population is
the WALLED leaves (the row's words), and the six unwalled are reported beside them, never folded
in: fjord 1.47/0.89 · hamlet 0.98/0.45 · mountain 1.70/0.40 · thorp 1.01/0.55 · village 1.94/0.47 ·
year-018 1.88/1.26 — all six beat their decoys too. **The two walled leaves still under the BAND are `town-2`
(1.3844 vs 0.7771) and `metropolis` (1.2444 vs 0.8877) — both BEAT their decoys comfortably and
both sit between the each-mass floor of 1.0 and the group floor of 1.5. Cause measured: thin
uncompounded naves whose own antialiased border lifts their mean at this register. Reported
rather than tuned.**

### (3) THE GALLERY SPREAD — **6 of 7 scored families PASS, over 12 seeds**
`harness/laneREG3/gallery.mjs --n=12`, seeds `reg3-gallery-0..11` across village/town/city/
metropolis × plains/riverside/coastal (a declared ladder, named before measuring):

| family | instances | distinct tuples | modal share | verdict |
|---|---|---|---|---|
| church | 75 | **36** | 0.120 | PASS |
| hall | 114 | **36** | 0.123 | PASS |
| inn | 54 | **27** | 0.093 | PASS |
| farmstead | 296 | **47** | 0.047 | PASS |
| market | 143 | 4 | 0.483 | PASS |
| craft | 133 | 4 | 0.549 | PASS |
| works | 67 | 2 | **0.612** | ⛔ FAIL (band 0.60) — `pits` is `2 + min(2, rung)` and the corpus's works are overwhelmingly rung 1 |
| quay | 4 | 3 | — | THIN (not scored) |
| mark | 71 | 1 | — | SLOTLESS (not scored — one corpus glyph by design) |
| rowHouse (landmark side) | 30 | 1 | — | OFF-TABLE (its real population is the parcels, below) |

**rowHouse roof forms over 13,165 drawn bodies: gable 41.4 % · crossGable 25.9 % · leanTo 13.5 % ·
hip 11.8 % · catSlide 7.4 % — 5 of 5 enumerated forms, modal share 0.414 → PASS.**

### (4) THE BLIND SILHOUETTE — **FIXTURE SHEET PREPARED; THE CHAIR RUNS THE READ**
`harness/laneREG3/silhouette.mjs`, chair-set parameters pinned in the file BEFORE rendering
(ODQ §622.2): **N = 24 · 6 classes × 4 · target ≥ 75 %**. Prepared: **28 fixtures — 24 real +
4 DECOYS** (§9.1(5)'s validity gate). All five §9.1 requirements discharged: the masses chosen by
a stated rule (*the four largest of the class by drawn area across the seed ladder, at most one
per seed*), a fixed frame per body, **every cue stripped and the strip SELF-VERIFIED** (zero
`<text>`, zero `data-anchor`, `<g>`/`</g>` balanced), the order randomised by the recorded seed
`reg3-silhouette-order-1`, and the ANSWER KEY written to a **separate directory the sheet does not
name** (`reg3work/silhouette-key/ANSWER-KEY.json`).
Sheet: `reg3work/silhouettes/SHEET.md` + `S01..S28.png`.

### (5) THE FULL REG-I0 SET vs BASELINES — **CENSUSES 0, NO VERDICT REGRESSES**
- **i10 · THE TWO CENSUSES, run ARMED** (via the new `REG_FABRIC_OPTS` arm, §5 below):
  Census A straddle **0 of 79** district regions · Census B outside-circuit **0 of 15,392**
  members (up from the base's 15,326 — the wave adds 66 members and 905 drawn bodies, so the zero
  is over a LARGER population) · §240.1 hull vertices outside own ring **0**.
- **i5 · ROLE CONTRAST**, base vs armed on 7 leaves: **VERDICT REGRESSIONS = 0.** The wall stays
  the loudest role pair everywhere; `wall:all` town 7.75→7.69 · city 7.29→7.17 · metropolis
  5.77→**6.71** · highwater 5.37→**6.24**.
- **i3 · CHUNKING**: **8 of 18** leaves inside their tier-conditioned band in BOTH arms — unchanged.
- **i8 · NO-DRIFT TRACE**: **UNTRACED MISSES = 3, staleRows = 0 — the ratchet working.** Two are
  this wave's (`12r`, `13p`); the third is REG-2's `15r`, still uncommitted. **THE ROWS THE CHAIR
  SHOULD COMMIT are in §7.**
- **Not re-run, and stated rather than implied**: i1 squint, i2 route-trace, i6 frontage, i7 FTG
  colour. i2/i6 read the street void and the frontage geometry, neither of which this wave
  touches; i1/i7 read wash and hue, and the wave adds no new role or colour. ⚠ i1's SQUINT plates
  ARE retained in `out/` for the judging round even though the instrument was not re-run.

### (6) DORMANCY — **CONFIRMED, byte-identical, 29 of 29**
`node harness/exemplars.mjs <dir>` with the flag OFF against the sealed base: **29 files / 29
files** identical, verified by `diff -rq` AND by sha:

| artifact | base | armed-off | |
|---|---|---|---|
| `town-town-parchment.svg` | `511f0c017d762128…` | `511f0c017d762128…` | SAME |
| `city-city-parchment.svg` | `3449ace03d809add…` | `3449ace03d809add…` | SAME |
| `village-village-parchment.svg` | `8c027538172907d7…` | `8c027538172907d7…` | SAME |
| `metropolis-metropolis-parchment.svg` | `1ab8da8db714cb82…` | `1ab8da8db714cb82…` | SAME |
| `manifest.json` | `695435d6d66f95df…` | `695435d6d66f95df…` | SAME |

⚠ The file COUNT is quoted deliberately (REG-2's own caveat): an exit status with no artifact
count is not a verdict.

### (7) DETERMINISM — **CONFIRMED, byte-identical double-run, 29 of 29**

### (8) THE CONVICTING MUTATIONS — three, one per mechanism, each reds its own arm
Run over FULL COPIES of the tree (`harness/laneREG3/mutants.sh`); the lane tree is never mutated.

| # | mutation | arm it must red | result |
|---|---|---|---|
| **M1** | the INN's pinned invariant stripped — the gate passage filled in | the silhouette fixture's ANSWER KEY | **REDS** — the key moved on **4 of 28** fixtures |
| **M2** | the CHURCH family forced to a single roll (every slot pinned to its first value) | the GALLERY SPREAD | **REDS** — church distinct tuples **36 → 2**, modal share **0.120 → 0.960**; SPREAD PASS 6/7 → **1/7** |
| **M3** | the landmarks UNTYPED (`typeBody` returns nothing for every institution) | LANDMARK SALIENCE | **REDS** — walled BAND-PASS **10/12 → 0/12** |

⭐ **M3 EXPOSED THAT THE TWO SALIENCE ARMS HAVE DIFFERENT SENSITIVITY, AND IT IS WORTH THE
CHAIR'S NOTE.** Untyping reds the BAND arm outright (10 → 0) but leaves BEATS-DECOY at 11 of 12,
because the roof pass ALSO moves the fabric population the decoys are measured against. **The
band arm is the one that measures the typing; the beat arm has a second contributor.** A later
wave reading only the beat arm would conclude the typing was doing nothing.

### (9) ⛔⛔ THE §217 TABLE — MEASURED BEFORE THE ORNAMENT, AND EVERY WALLED TIER EXCEEDS

**THE PRE-MEASURE, recorded before a line of drawing code was written** (receipt §1(b)): the
sealed corpus stands at 904–7,985 primitives against signed ceilings of 1,000–9,700, and REG-2's
armed rampart already takes town to 5,363 of 5,400 and city to 6,779 of 6,800 — **37 and 21 ops
of headroom for every later wave.** The subtraction was named in advance and taken: **§12's
roof-ridge tick is SUPERSEDED, not supplemented.**

**FINAL, per leaf, four arms measured** (`harness/laneREG3/probeOps.mjs`):

| tier | signed ceiling | BASE max | SHAPES max | BOTH max | over | ⚠ **DOM NODES** base→shapes | render ms (BOTH) |
|---|---|---|---|---|---|---|---|
| thorp | 1,000 | 904 | 965 | 965 | **−35 held** | 64→69 | 2.6 |
| hamlet | 1,200 | 1,126 | 1,334 | 1,334 | **+134** | 87→93 | 3.1 |
| village | 1,800 | 1,529 | 1,902 | 1,902 | **+102** | 104→133 | 4.0 |
| town | 5,400 | 4,584 | 8,270 | **9,234** | **+3,834** | 286→430 | ≤ 21.9 |
| city | 6,800 | 5,803 | 9,067 | **9,944** | **+3,144** | 370→408 | ≤ 24.0 |
| metropolis | 9,700 | 7,985 | 12,983 | **14,188** | **+4,488** | 346→396 | 29.4 |

**⛔ THE RAISES ARE REPORTED AND NOT TAKEN — `OP_CEILING_BY_TIER` IS UNTOUCHED** (§217/§9 make a
ratchet raise a signed act; §604 says the chair signs it; REG-2's J-REG2-9 is the precedent).
The figures, each the next hundred above the measured maximum: **hamlet 1,400 · village 2,000 ·
town 9,300 · city 10,000 · metropolis 14,200 · thorp holds at 1,000.**

⭐⭐ **AND THE EVIDENCE THE CHAIR SHOULD WEIGH IS THAT THE RATCHET COUNTS A UNIT THIS WAVE'S MARKS
ARE NEARLY FREE IN.** The primitive count rises 72 % at town while the **DOM NODE count rises
from 286 to 430 and at city from 370 to 408** — because every new mark batches into an existing
path — the SVG grows 386 → 520 kB, and the render stays at **16–29 ms**, the same band REG-2
measured (16–25 ms) and three orders of magnitude inside the §603/A4 20–30 s first-paint
envelope. ⚠ Small tiers are inside or barely over: thorp holds, hamlet is +134 and village +102.

⚠ **THE FIXED POINT IS REAL AND IS FLAGGED** (REG-2's own caveat, inherited): two mid-pass
rations price against `CEIL`, so the figures must be RE-MEASURED after any raise before pinning.

### (10) THE JUDGING ARTIFACTS — retained in `<worktree>/out/`
| file | what it is |
|---|---|
| `PAGE-town-SHAPES.png` / `PAGE-town-BASE.png` | the walled town page, armed and sealed, 2000 px |
| `PAGE-city-SHAPES.png` / `PAGE-city-BASE.png` | the coastal city, both arms |
| `SQUINT-town-200-AFTER.png` / `-BEFORE.png` | the 200 px squint, both arms |
| `CROP-{town,city}-CHURCH-{AFTER,BEFORE}.png` | **a church with its yard** — nave, tower, transept, aisle, porch, bay ladder, precinct |
| `CROP-{town,city}-INN-{AFTER,BEFORE}.png` | **an inn court** — the street range broken by its gate passage |
| `CROP-{town,city}-WATERFRONT-{AFTER,BEFORE}.png` | **a waterfront** — the quay's pier comb / the pakhuis ranges |
| `CROP-{town,city}-FARMSTEAD-{AFTER,BEFORE}.png` | **a farmstead** — the house/barn L and its fold-yard |
| `CROPS-{town,city}-picks.json` | the crop boxes AND the chosen bodies' SLOT ROLLS, so a reader can check the drawing against the decision |

Crop boxes are chosen by a STATED RULE (`harness/laneREG3/pickCrops.mjs`), recorded in the file
before looking: the church with the largest precinct, the inn with the largest yard, the largest
waterfront body, the farmstead with the longest barn.

## §3 · ⛔⛔ THE DEFECT THIS WAVE FOUND IN A PASS IT WAS NOT LOOKING AT

**THE MAP'S PLACE-NAMES HAD NO FLOOR, AND THE ONE PASS THE RATION LAW SAYS MUST NEVER GIVE WAY
WAS THE ONLY ONE RESERVING NOTHING FOR ITSELF.** §12's law is that *an ACCENT gives way and a
BUILDING, a STREET — and a NAME — never does*, and every earlier pass honours it by subtracting
`estimateLetteringOps` from its own budget. The §173 splice then took `Math.max(0, CEIL -
prims.n)` **with no reserve of its own**, so the instant any pass carried a leaf past its ceiling
the expression clamped to zero.

**MEASURED, which is how it was found:** armed, `town` fell from **67 `<text>` elements to 7**,
`city` 83 → 7, `metropolis` 84 → 7 — every ward label, every marginal note and every event
caption gone — while `village`, which stays under its ceiling, was untouched at 50 → 50.

⚠ **THE DEFECT IS LATENT AT THE SEALED TIP**: REG-2's +594 stopped just short of it, and it would
have fired on the first wave that did not. The cure is the law written down —
`budget: Math.max(estimateLetteringOps(…), CEIL - prims.n)` — so a pass that overruns shows as an
overrun in the primitive count, which is what a ratchet is for, instead of paying for itself with
the map's own names. **Dormancy is unaffected** (the floor can only ever raise a budget a leaf
under its ceiling already had, and the 29/29 byte-identical proof was re-run after the cure).

⚠ **ONE CONSEQUENCE IS DECLARED AND NOT CURED**: the in-world LEGEND (§18) still gives way to
zero rows on the armed town/city/metropolis leaves. That is the priority working as written —
*names before conventions* — and L-REG-11 already charters the legend to shrink as the drawings
self-explain; it self-cures the moment a raise is signed. Recorded rather than smuggled.

## §4 · JUDGMENT CALLS — all vetoable, with the §580/§612 trace

| # | call | trace |
|---|---|---|
| **J-REG3-1** | The typing arm is a **CONSUMPTION, not an invention**: `parcel.character` (100 % of 16,834), `landmark.archetype`, `habitation.kind`, `faubourg.kind`. `parcel.rung` is refused as a family key at **2.7 % coverage**. | §0's INVARIANT clause ("the truths hold underneath") and the charter's "never guess-type". A field present on one building in thirty-seven cannot type a population, and `TYPE_EVIDENCE` records every coverage so the claim is auditable rather than asserted. |
| **J-REG3-2** | The monument's VALUE follows **hf266** (a dark body against tan town fabric), not hf323's white roofed floor — while the GEOMETRY stays hf323's. | J-REG2-4 by name: *"a reference's zoom is part of what it says."* hf323 draws a cathedral plan thirty units across; ours is seven. MEASURED: at hf323's relative poché thickness the outline covers ~44 % of the body and the pale interior never reaches the reader — i4 read the "cured" anchors at massMean 132–142 against a fabric mean of 115, **worse than the sealed base**. hf323's white floor is DEFERRED to REG-10's zoom ladder, where a building-zoom register is exactly what gets built. |
| **J-REG3-3** | `prominent` buys **no extra tint step**; every monument body takes one value. | This wave's own headline finding applied to its own ink: hf323's law is that *complexity of PLAN carries rank*. MEASURED, the two-step version split the corpus — prominent bodies Δ 1.57 (pass) and non-prominent 0.42–0.57 (fail) on the SAME leaf — so a tint step, not the geometry, was deciding which anchors a reader found. |
| **J-REG3-4** | The shape family fires for **EVERY institution**, not only the monumental ones. | `monumental` is a BUDGET flag (`i < scale.monumentalBudget`): at town only **11 of 91** carry it and the town's own parish church is not among them, so the church family never fired on the leaf its silhouette read is about. hf323's ladder starts BELOW any budget — a field chapel is drawn as a church. The RUNG governs the composition, so the §5 silhouette budget is respected where it actually speaks (visual weight). |
| **J-REG3-5** | The composed SOLIDS spend the institution's true rung; only the **VOIDS** require reserved ground. | `groundLaw.js`'s own sweep keys institutions `!inst|…` so they sort FIRST — *"the ordinary fabric gives way to the monumental"* — so a composed body is not shredded. A VOID never enters the sweep at all, so an unreserved precinct lies over fabric nothing told it was coming, which the first town crop showed directly. ⚠ My first cure clamped uncompounded institutions to rung 0 and the GALLERY refuted it: **75 churches took ONE slot tuple between them.** |
| **J-REG3-6** | The roof gate asks whether the marks can be **told apart at the leaf's own line weight** (breadth ≥ 6 × `INK.detail`), and the honest answer is that almost nothing is refused. | REG-2's J-REG2-8: *a drawing that changes with the budget left over from the rest of the page is not a drawing.* Two earlier spellings were worse: the LONG axis (which on a burgage plot is its DEPTH — it refused 0 of 942 at town-2) and a bare "1.15 frontages" (a budget in a derivation's coat). The measured consequence — 970 of 1,016 bodies clear the floor — is reported to §217 rather than folded into the threshold. |
| **J-REG3-7** | `roofPlan` draws on the **longest EDGE**, not `widestAxis`. | `widestAxis` is the polygon's DIAMETER — a rectangle's DIAGONAL — so a full-length ridge runs corner to corner, which hf208 draws on no panel. ⚠ **THE DEFECT IS OLDER THAN THIS WAVE**: §12's shipped tick has used it since it landed and its hard ration is the only reason nobody saw it. The legacy §12 path is left byte-for-byte (it is the unarmed drawing and changing it would void the dormancy proof); the correction is reported as a separate finding, §6.3. |
| **J-REG3-8** | Marks resolve through their solid's **INDEX**, never through a polygon they carry. | `institutionShapes.js`'s own named class one surface further out: a mark carrying its own copy of a body is geometry the ground law never touched, and a clipped nave went on drawing a bay ladder across the fabric. |
| **J-REG3-9** | The precinct voids are drawn in **their own `<g id="precincts">`**, before the landmarks. | A group id is a classification. With the voids inside `<g id="landmarks">` instrument 4 read a 275-unit pale churchyard as one of `town-2`'s four ANCHORS. Drawing them BEFORE is equally load-bearing — painted after, a precinct erases its own church (bitten, cured). |
| **J-REG3-10** | `harness/exemplars.mjs` gains `REG_FABRIC_OPTS`, an env arm the CALLER of a preserved instrument can set. | The REG-I0 instruments call `buildOne(spec)` with no options (i10 line 233), so every census they run measures the DORMANT state — not a false figure, but not a build wave's question either. The `reg-instruments` workspace is read-only to this lane, so the arm goes in the driver the instrument imports. ⚠ INERT when unset and when the caller passes its own options; every existing invocation, including the dormancy proof, is unchanged. |
| **J-REG3-11** | The §173 splice's letter floor (§3) is CURED here rather than reported. | It is not a wave decision but the ration law's own words made true, and the alternative was to ship a wave that silently deletes a map's place-names. The legend's give-way IS reported, because that one is the priority working. |
| **J-REG3-12** | `OP_CEILING_BY_TIER` untouched; five raises reported. | §217, §9 and §604 — REG-2's J-REG2-9 verbatim. Measuring is this lane's job; moving the pin is not. |

## §5 · FILE MANIFEST — every touched file, one line of why

| file | + | why |
|---|---|---|
| `src/domain/townMap/fabric/shapeCode.js` | **NEW** ~940 | the type vocabulary with its measured evidence, the 12 family slot tables as data, the biased roll, the compositions, hf208's roof plan and its gate. Pure; no draws. |
| `src/domain/townMap/fabric/institutionShapes.js` | 14 | armed-only: `attachSolids` takes a shape handle and records `shapeFamily`/`shapeSlots`/`shapeMembers`; the legacy composition is untouched and unreachable when armed. |
| `src/domain/townMap/fabric/buildFabric.js` | ~55 | **SINGLE WRITER, minimal**: one shape handle at stage 4b, one farmstead loop before the second ground-law pass, one `shapeCode` derivation at stage 8b, one conditional key at the end of the publication literal. |
| `harness/renderFolio.mjs` | ~150 | §12r the roof plan (superseding §12 when armed) · §13p the precinct group · §13's hf266 monument projection, body-scaled poché, mark resolution and the four new mark kinds (graves, arcade, passage, farmstead ridge) · **the §173 letter floor**. |
| `harness/exemplars.mjs` | 22 | `--shapes`, mirroring `--fuse`/`--rampart` so each wave's dormancy is provable alone; and `REG_FABRIC_OPTS` (J-REG3-10). |
| `harness/laneREG3/*.mjs`, `mutants.sh` | ~640 | nine sandbox instruments: the typing census, the anchor probe, the roof bill, the §217/time/node table, the salience runner, the gallery, the silhouette preparer, the crop picker, the mutation suite. |

⛔ **NO SHIPPED-SRC BYTES** beyond the fabric sandbox this arc already writes in; no refs, no
pushes, no memory writes; `reg0` / `reg-instruments` / `reg-detail` were read only.

## §6 · DEFERRED, WITH REASONS (documented, not bugs to re-find)

1. **THE FIVE §217 RAISES** (hamlet 1,400 · village 2,000 · town 9,300 · city 10,000 ·
   metropolis 14,200). Measured, reported, not taken. **Chair's.** ⚠ Re-measure after any raise
   before pinning — two mid-pass rations spend against the ceiling.
2. **⛔ THE `widestAxis` RIDGE DEFECT IN THE LEGACY §12 PATH.** The unarmed drawing has drawn its
   roof-ridge tick along every building's DIAGONAL since the tick landed. It is cured in §12r and
   NOT back-applied, because §12 is the unarmed drawing and touching it voids the dormancy proof.
   A one-line change with a corpus-wide declared shift. **Chair's.**
3. **THE IN-WORLD LEGEND GIVES WAY TO ZERO ROWS** on armed town/city/metropolis (§3). Declared;
   self-cures with a raise.
4. **hf323's WHITE ROOFED FLOOR** is deferred to REG-10's zoom ladder (J-REG3-2), where a
   building-zoom register is built. The geometry is already there; only the value waits.
5. **`works` FAILS THE GALLERY BAND at 0.612** against 0.60. Cause measured: `pits` is
   `2 + min(2, rung)` and the corpus's works are overwhelmingly rung 1. A third slot for the
   family (hf340's leat/pond chain, hf264's washing slabs) is the cure and belongs with REG-5's
   drawn world, where the water furniture is built.
6. **THE `craft.kiln` SLOT IS DARK**, recorded in the table with its reason: the works trades
   route to the `works` family, so no live input can turn it on. Kept enumerated because DW's
   craft rosters will supply one, and a slot deleted for being dark is a slot the next wave
   re-invents.
7. **A TOTALITY WALKER FOR THE NEW VOCABULARIES IS OWED AT THE PORT.** `BODY_TYPES`,
   `ROOF_FORMS`, `MEMBER_ROLES` and `FAMILIES` have no walker. Nothing reds today; the obligation
   is real and is recorded rather than left for a later lane to re-find. (REG-2 owes the same for
   `BAND_REGIMES`/`WEAR_GRADES`/`RAMPART_RUNGS` — one walker can cover both.)
8. **THE TASTE GATE IS NOT THIS LANE'S TO CLOSE.** The artifacts are rendered and retained; the
   owner's verdict on the CT-0 crops stands outstanding. **The SILHOUETTE READ is the CHAIR'S to
   run** (ODQ §622.2) — this lane prepared the sheet and holds the key apart.
9. **`i1`/`i2`/`i6`/`i7` NOT RE-RUN**, with the reason at §2(5). i6's frontage figures in
   particular would move (the wave adds 905 drawn bodies) and a later wave that needs them should
   re-baseline rather than read REG-1's.

## §7 · ⭐ THE i8 TRACE ROWS THE CHAIR SHOULD COMMIT

```js
'12r': { name: 'THE PLAN-VIEW ROOF LAW — ridge/hip/cat-slide/cross-gable/lean-to, the SE plane, chimneys',
         trace: ['corpus'],
         why: 'hf208-spec-roof-ticks is the REQUIRED-DETAIL ANCHOR and states the law on its face, '
            + 'including its own "without the hand" (flat silhouettes) vs "with the hand" verdict row; '
            + 'hf34 proves it scales to metropolis; hf378 that roofs never drop out down the density '
            + 'ladder; hf379/hf90/hf3 supply the chimney square. Watabou and FTG both draw buildings as '
            + 'inked footprints with interior marks, so the STRUCTURE (a filled body with a detail line '
            + 'that makes it read as a roof) is the leads\' own reading grammar and the corpus wins only '
            + 'the DRESS — §0\'s precedence clause. ⚠ NO DORMER: the DETAIL REGISTER records that no '
            + 'plan-view dormer convention exists on any viewed anchor, so none is invented.' },
'13p': { name: 'THE PRECINCT VOIDS — hf323\'s bounded open ground round a monument',
         trace: ['corpus'],
         why: 'hf323-spec-church-ladder draws every rung above the wayside shrine standing inside a '
            + 'bounded precinct, and hf266-zoom-cathedral-close draws the close wall with tan town '
            + 'fabric beyond it. FTG and Watabou give civic buildings a distinct larger form but no '
            + 'forecourt void, so the void is the corpus\'s own addition to their grammar — which is '
            + 'exactly what §571.4\'s third cure asks for (importance from compound footprint + '
            + 'forecourt void, not tone).' },
```

## §8 · TIMELINE CARRY (L-REG-26 / A6.1) — DEFERRED-PENDING-REG-F0

Recorded here for REG-F0's backfill, per §622.2. **This wave mints no element with an appearance
date of its own**: every member it emits is a PART of a body that already existed, so its
appearance epoch and within-epoch order are its HOST'S, and REG-F0's instrumentation of the base
producers will supply both without this wave re-opening anything.

| element class | host whose epoch/order it inherits | note |
|---|---|---|
| family members (`main`/`wing`/`yard`/`court`/`outbuilding`) | the institution's own seating record | ⚠ the SLOTS are age-biased (chapels accrete with foundation age), so a chapel's own appearance is LATER than its nave's — REG-F0 should treat `chapels` as an ACCRETION ORDER, not a co-appearance |
| the precinct void | the institution | one void per compounded institution |
| roof marks (§12r) | the parcel / fused mass / habitation | timeless dress ON a dated body — a candidate for A6.1's *timeless dress exempt by name* list |
| the farmstead L | the habitation dwelling record | house and barn co-appear; the outbuildings are prosperity-biased and may be later |

⚠ The `beatEvents[]` and TRANSIENT-ELEMENT channels are untouched: this wave draws no pre-state.

## §9 · EXACT RE-RUN

```
T=.../scratchpad/laneREG3-tree                 # detached at the tip below
S=.../scratchpad/reg3work

node $T/harness/exemplars.mjs $S/off-out                 # dormant — must equal the sealed base
node $T/harness/exemplars.mjs $S/on-out   --shapes
node $T/harness/exemplars.mjs $S/on-out2  --shapes       # determinism double-run
for D in base-out off-out on-out on-out2; do ls $S/$D | wc -l; done   # 29 each — the COUNT is the verdict
diff -rq $S/base-out $S/off-out ; diff -rq $S/on-out $S/on-out2

cd $T
node harness/laneREG3/probeTyping.mjs                    # the typing census, 18 leaves
node harness/laneREG3/probeAnchors.mjs --shapes          # the top-4 masses, typed
node harness/laneREG3/probeRoofBill.mjs                  # where the roof law's ops go
node harness/laneREG3/probeOps.mjs                       # the §217 table + nodes + ms, four arms
node harness/laneREG3/gallery.mjs --n=12
node harness/laneREG3/silhouette.mjs --out=$S/silhouettes --n=12
node harness/laneREG3/pickCrops.mjs --leaf=town
zsh  harness/laneREG3/mutants.sh <mutdir>                # M1–M3

node harness/laneREG3/salienceRun.mjs --dir=$S/on-out --png=$S/png-on     # i4, run AS-IS
cd .../reg-instruments
REG_FABRIC_OPTS='{"shapeCode":true}' node i10-censuses.mjs --wt=$T --leaves=ALL
node i8-nodrift-trace.mjs --wt=$T                        # 3 UNTRACED MISSES — rows in §7
node i3-chunking.mjs --wt=$T --leaves=ALL
node i5-role-contrast.mjs --base=<svg> --png=<png>        # ⚠ EXACT filenames: `town-*` globs town-2 first
```

⚠⚠ **THE GLOB THAT BIT THIS LANE TWICE**: `ls town-*-parchment.svg | head -1` matches
`town-2-town-parchment.svg` FIRST. Once it made a "town" salience reading that disagreed with the
recorded baseline by +0.75; once it paired town-2's SVG with town's raster and produced the
"every ratio ≈ 1.01" signature INSTRUMENTS.md records as *an instrument pointed at nothing*.
**Resolve leaf files by EXACT `<key>-<tier>-parchment.svg`, never by glob.**

---

## RESUME POINT — FINAL (the lane is complete)

TIP `93fa8a2ca7c347c35aea94776dfeb7dc70bf0190` on
`.../scratchpad/laneREG3-tree` (detached). Nothing is in flight. A successor picking this up
needs: §2 for the exit figures, §6 for the nine deferrals, §7 for the two i8 trace rows the chair
should commit, and §9 for the exact re-run. The five §217 raises and the legacy `widestAxis`
ridge defect are the two items awaiting a chair decision.
