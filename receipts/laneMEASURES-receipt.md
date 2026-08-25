# laneMEASURES receipt — ODQ §657.2 measure car (CAR-MEASURES, Opus)

MEASURE-ONLY. Repo untouched. All writes: `$SP/measures`, `$SP/review654/out-armed`, this receipt.
SP = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad`
Seal: `9de729021` ("REG-BRIDGE: the river gains a shape, and the decks stop floating"), tree `$SP/laneBRIDGE-tree`
(`git status --porcelain` → only `?? node_modules/`, i.e. the lane's OWN node_modules — the stale-symlink hazard does not apply).

---

## CHECKPOINT 1 — D1 flag verification + the 10-arm render + the diff

### 1.1 Flag names verified against the driver's own arg parsing (NOT against the brief)

`$SP/laneBRIDGE-tree/harness/exemplars.mjs`, `main()` lines 209–244. All ten requested flags exist verbatim:

| flag | line | fabricOption set |
|---|---|---|
| `--fuse` | 210 | `frontageFusion` |
| `--rampart` | 211 | `rampart` |
| `--shapes` | 215 | `shapeCode` |
| `--market` | 222 | `marketRegister` |
| `--footprint` | 223 | `minFootprint` |
| `--quay` | 227 | `waterfrontExemption` |
| `--vquay` | 230 | `quayRegister` |
| `--river` | 240 | `riverProfile` |
| `--deck` | 241 | `deckLaw` |
| `--ford` | 242 | `fordRegister` |

Documented dependency (line 228–230): `--vquay` DEPENDS on `--quay` — "an undrawn quay is never furnished, so the dress leg cannot paper over the geometry." Both are armed here, so the dependency is satisfied.

### 1.2 The render — EXECUTED

```
cd $SP/laneBRIDGE-tree && node harness/exemplars.mjs $SP/review654/out-armed \
  --fuse --rampart --shapes --market --footprint --river --deck --ford --quay --vquay
EXIT=0
18 SVG + manifest.json -> .../review654/out-armed
```

**COUNT (verdict):** `ls out-armed | wc -l` = **29** — 28 `.svg` + `manifest.json`. Expected 29. ✅
The driver's own tail line says "18 SVG" because it counts CORPUS KEYS (18); the town and city keys each ship 5 extra
lenses (line 254–258), so 18 + 10 = 28 SVG files. Both numbers are right; they count different things.

### 1.3 THE DIFF vs `$SP/review654/out` — 16 CHANGED, 13 IDENTICAL

File-name sets identical (29 = 29, `diff <(ls A) <(ls B)` empty). Per-file `cmp`:

**CHANGED (16):**
| file | base bytes | armed bytes | Δ |
|---|---|---|---|
| crossing-town-parchment.svg | 556133 | 558141 | +2008 |
| famine-town-parchment.svg | 540009 | 542360 | +2351 |
| fjord-town-parchment.svg | 535453 | 536688 | +1235 |
| highwater-town-parchment.svg | 553084 | 555458 | +2374 |
| plague-town-parchment.svg | 539865 | 542216 | +2351 |
| siege-town-parchment.svg | 535316 | 537667 | +2351 |
| town-2-town-parchment.svg | 533317 | 535068 | +1751 |
| town-town-accessible.svg | 481214 | 483600 | +2386 |
| town-town-darkFantasy.svg | 539555 | 541906 | +2351 |
| town-town-illustrated.svg | 539616 | 541967 | +2351 |
| town-town-parchment.svg | 539560 | 541911 | +2351 |
| town-town-vtt.svg | 537064 | 539441 | +2377 |
| town-town-watercolor.svg | 539661 | 542012 | +2351 |
| year-018-town-parchment.svg | 502244 | 504595 | +2351 |
| year-100-town-parchment.svg | 538816 | 541167 | +2351 |
| manifest.json | 41803 | 41803 | 0 (same width, different values) |

**IDENTICAL (13):** city-city-{accessible,darkFantasy,illustrated,parchment,vtt,watercolor}.svg,
hamlet-hamlet-parchment.svg, metropolis-metropolis-parchment.svg, migration-city-parchment.svg,
mountain-village-parchment.svg, polycentric-town-parchment.svg, thorp-thorp-parchment.svg,
village-village-parchment.svg.

10 corpus KEYS moved (town, town-2, highwater, fjord, siege, plague, famine, year-018, year-100, crossing);
10 parchment + 5 extra town lenses + manifest = 16 files. Arithmetic closes.

### 1.4 What the base exhibit actually was — I1 INDEPENDENTLY CONFIRMED

`review654/truth-integrity.md:97` had already found that an 8-arm render (no `--quay --vquay`) is byte-identical
to `review654/out`. My run reproduces the complement of that claim from the other side: arming exactly those two
extra flags moves exactly 16 files. **I1 CONFIRMED — the shared review exhibit was one wave short of stacked, and
the 16 files it was short on are enumerated above.**

### 1.5 THE MANIFEST DELTA — what the two quay arms actually moved

Field-level diff of `manifest.json` (only changed fields shown):

| key | field deltas |
|---|---|
| town | groundLawDropped 242→**238**; elementCount 444→**451**; primitiveCount 7110→**7136** |
| town-2 | groundLawDemoted 74→**72**; demotedBy {hovel 39,cottage 35}→{**38**,**34**}; dropped 224→**222**; els 420→**425**; prim 7144→**7164** |
| highwater | dropped 291→**287**; els 449→**456**; prim 7616→**7641** |
| fjord | demotedBy {hovel 39,cottage 47}→{**38**,**48**}; els 369→**371**; prim 6766→**6781** |
| siege | dropped 243→**239**; els 444→**451**; prim 7098→**7124** |
| plague | dropped 242→**238**; els 445→**452**; prim 7117→**7143** |
| famine | dropped 242→**238**; els 445→**452**; prim 7116→**7142** |
| year-018 | dropped 173→**169**; els 415→**422**; prim 6444→**6470** |
| year-100 | dropped 173→**169**; els 438→**445**; prim 7248→**7274** |
| crossing | groundLawDemoted 80→**83**; demotedBy {40,40}→{**41**,**42**}; dropped 230→**227**; els 442→**447**; prim 7124→**7147** |

The quay arms' whole measurable effect on the corpus: **~4 fewer ground-law drops and ~+7 elements per river town.**
No key gains a parcel, an organism, a landmark, a block or a wall. `builtAreaPct` moves NOWHERE.

### 1.6 ⛔ THE FINDING THE DIFF HANDS US: the quay arms are DORMANT ON BOTH CITY-TIER WATER LEAVES

`waterMode` per leaf (armed manifest) — 12 of 18 leaves are wet:

| leaf | tier | waterMode | seaShare | quay arms moved it? |
|---|---|---|---|---|
| town, highwater, siege, plague, famine, year-018, year-100 | town | bankside | 0 | ✅ yes |
| crossing | town | through | 0 | ✅ yes |
| town-2 | town | bankside | 0 | ✅ yes |
| fjord | town | bankside | **0.27** | ✅ yes |
| **city** | **city** | **bankside** | **0.27** | ⛔ **NO — byte-identical** |
| **migration** | **city** | **bankside** | **0.27** | ⛔ **NO — byte-identical** |
| thorp, hamlet, village, metropolis, polycentric, mountain | — | dry | 0 | n/a (dry, correctly untouched) |

**The two arms built to cure the port fire on 10 of 12 wet leaves and on NEITHER city-tier one.** This is the
decomposition half of review row I5 reproduced at file granularity: the coastal city's waterfront is bit-for-bit
the same with the quay register armed as without it. Not "improved a little" — *zero delta*.

---

## CHECKPOINT 2 — D1 continued: WHAT THE TWO QUAY ARMS ACTUALLY DRAW

### 2.1 I1 proved FIRST-HAND, not inherited

`review654/truth-integrity.md:97` asserted the base exhibit is byte-identical to an 8-arm render.
Inherited claims decay, so I re-took it myself:

```
node harness/exemplars.mjs $SP/measures/out-8arm --fuse --rampart --shapes --market --footprint --river --deck --ford
RENDER_EXIT=0
8-ARM vs review654/out --> IDENTICAL=29  DIFFER=0  (of 29 files)
```

**CONFIRMED (mine).** `review654/out` is the 8-arm render. The 16-file delta in §1.3 is exactly and only
`--quay` + `--vquay`.

### 2.2 The element-level diff — the arms add TWO things and nothing else

`$SP/measures/svgdiff.mjs` (element multiset diff, each element attributed to its `<g id>` chain):

| leaf | BASE els | ARMED els | ADDED | REMOVED | added in `landmarks` | added in `quayFurniture` |
|---|---|---|---|---|---|---|
| town | 511 | 518 | 8 | 1 | 5 | 3 |
| town-2 | 483 | 488 | 8 | 3 | 5 | 3 |
| fjord | 425 | 427 | 4 | 2 | 2 | 2 |
| highwater | 486 | 493 | 7 | 0 | 4 | 3 |
| crossing | 511 | 516 | 5 | 0 | 2 | 3 |
| siege / plague / famine / year-018 / year-100 | 511–512 | 518–519 | 8 | 1 | 5 | 3 |

**Every added element is in one of two groups. There is no third effect anywhere in the corpus.**

### 2.3 `--vquay` (quayRegister) — the whole dress leg is a SPECK

`quayFurniture` is present on exactly the 10 changed leaves and ABSENT from all 8 others.
Content: **2–3 `<path>` elements, no rect / line / circle / polygon**, 1.2–1.6 KB. Absolute bbox:

| leaf | paths | bbox x | bbox y | W×H (units) | area | % of frame | px at 1400 |
|---|---|---|---|---|---|---|---|
| crossing | 3 | 467–476 | 575–589 | 8.6×14.7 | 126.5 | 0.0127 % | 12×21 |
| famine / plague / siege / town / year-018 / year-100 | 3 | 273–286 | 702–713 | 12.7×10.5 | 134.0 | 0.0134 % | 18×15 |
| fjord | 2 | 428–434 | 210–215 | 5.5×5.4 | **29.5** | **0.0029 %** | **8×8** |
| highwater | 3 | 578–588 | 526–540 | 10.1×14.9 | 150.1 | 0.0150 % | 14×21 |
| town-2 | 3 | 505–520 | 426–433 | 15.0×7.0 | 105.3 | 0.0105 % | 21×10 |

At 14× magnification the fjord's furniture resolves as **a clump of ~9 overlapping rings of radius
0.3–0.74 units** sitting on the sand strip, INLAND of the waterline, beside an existing shed. It is
not a quay line, not a pier row, not a bollard ROW — the rings overlap each other into a blob.
The whole V-QUAY dress on the corpus occupies **4 distinct sites** (the Mahabagh family shares one).

### 2.4 `--quay` (waterfrontExemption) — moored bodies, and they are the story

`data-anchor="name:…"` census, base → armed:

| leaf | anchor | base | armed | Δ |
|---|---|---|---|---|
| town / siege / plague / famine / year-018 / year-100 | fishmonger | 1 | 5 | **+4** |
| highwater | fishmonger | **0** | **4** | **+4** |
| crossing | fishmonger | 1 | 3 | +2 |
| town-2 | fish-market | 3 | 5 | +2 |
| fjord | (none) | 11 | 11 | 0 |
| **city / migration** | — | **0** | **0** | **0** |

Each added body is a long thin parallelogram, `fill="#6c5945"`, `stroke="#2B2118"`, `stroke-width="1.56"`
— **landmark ink weight**, the heaviest class on the plate. e.g. town body 1:
`M297.08 698.31L275.54 683.53L277.58 680.55L299.56 695.63Z` — 24.0 × 17.8 units.

### 2.5 ⛔ THE GLYPH COLLISION — four bars across water is the map's OWN symbol for a barred water gate

Rendered, the four moored fishmonger bodies on town (and on highwater) are **four heavy parallel dark
bars lying across the drawn river**, evenly spaced, spanning bank to bank.

The leaf's own legend, same document:

```
<path d="M688 889v9M706 889v9M694 890v7M700 890v7" fill="none" stroke="#241B12" stroke-width="3.01"/>
<text x="718" y="896">WATER GATE, BARRED</text>
```

**The legend's "WATER GATE, BARRED" glyph IS four parallel bars.** On the town leaf the real water gate
(river × wall, ~leaf 207,721) and the fishmonger's moorings (~leaf 273,713) are ~55 units apart and
carry the same visual form. I read the moorings as a barred water gate / a stack of bridges BEFORE I
found the legend definition — the collision is not theoretical.

Crops: `$SP/review654/crops/M-{fjord,town,highwater,crossing}-quay-{ARMED,BASE}.png`
Full leaves: `$SP/measures/ql-armed/*.quicklook.png`

---

## CHECKPOINT 3 — D1 VERDICT · the waterfront/river re-judgment (fresh eyes, gestalt first)

**Question asked: does the armed city/fjord waterfront read differently with quay+vquay on?**

### city (Kitaqiao) — NO. Not "a little better". *Byte-identical.*

`city-city-parchment.svg` and `migration-city-parchment.svg` are bit-for-bit the same at 8 arms and at
10. Review row I5's "zero delta on the coastal city" is CONFIRMED at file granularity, and the ROOT
CAUSE is now measured:

| leaf | `data-anchor` total | `name:` anchors | maritime categories |
|---|---|---|---|
| city | 110 | **0** | **NONE of 24** |
| migration | 110 | **0** | **NONE of 24** |
| town | 167 | 10 (`name:fishmonger`) | fishmonger |

The city's complete 24-category anchor roster is: apothecary_district · auction_house · banking_houses ·
caravan_masters_exchange · city_granaries · craft_guilds_30_80 · daily_markets ·
dungeon_delving_supply_district · inns_and_taverns_district · large_prison · listening_post ·
luxury_goods_quarter · major_annual_fairs · major_hospital · mercenary_quarter · merchant_guilds_15_40 ·
mint_official · multiple_adventurers_guilds · parish_churches_10_30 · printing_house ·
professional_city_watch · specialized_metalworkers · theaters · thieves_guild_chapter.

**Not one waterside trade.** No harbour, no fishery, no shipwright, no salt, no ferry, no customs.
The declared port city with `seaShare 0.27` has no maritime institution to place, so an exemption that
admits waterside bodies and a register that furnishes them both have **nothing to act on**. This is an
ATLAS/ROSTER gap, not a renderer gap — and no amount of work on the quay arms will touch it.

**VERDICT — northstar port row STANDS, unchanged and now explained.** "THE PORT DOES NOT EXIST VISUALLY"
is correct at 10 arms exactly as at 8. Grade unchanged: **WEAK-PASS, one thing = the missing harbour.**

### fjord (Beiyuan) — NO, materially. The premise still does not read.

The armed leaf gains **2 elements** (+1235 bytes, the smallest delta in the corpus) and no new anchor.
Its `quayFurniture` is the 8×8-px ring clump described in §2.3, sitting on the strand, inland of the
waterline, adjacent to a pre-existing shed. The NE shoreline is still a bare scalloped edge with no
quay line, no pier row, no waterfront street; the fabric still stops well short of the water behind a
broad empty strand; the relief-1.00 terrain dress is still the scratch/claw-tick pen noise.

**VERDICT — review row I5 and the northstar fjord row STAND.** "The sea plays no role in the town's
form" is still the honest gestalt read at 10 arms. Grade unchanged: **WEAK.**

### ⛔ THE RE-JUDGMENT THE REVIEW DID NOT HAVE: the river towns got WORSE, not better

This is the finding the 8-arm exhibit hid, and it inverts the expected direction of the wave.

At 8 arms the town river bend is clean: water, a sand bank on the inside of the bend, buildings set
back. At 10 arms **four heavy dark bars lie across the river**, parallel, overlapping, spanning both
banks — landmark-weight ink, the same visual form as the legend's BARRED WATER GATE, in the same
context (across water). Highwater is worse still: four evenly-spaced bars reading as railway sleepers
or a weir, two of which overshoot the far bank onto dry sand.

This collides head-on with two things already on the review's own books:
- **B1** (road wash crosses the water beside the deck) — same leaves, same reach of river.
- the deck law's "one deck, perpendicular, at the narrows" — a reader now counts *five* bar-like
  structures across one bend and only one of them is the bridge.

**VERDICT: the ARMED river waterfront reads WORSE than the 8-arm exhibit the review graded.**
town: **PASS → WEAK-PASS** (the bend was the leaf's best passage; it now carries an unexplained
four-bar structure). highwater: **WEAK-PASS → WEAK** (its "premise survives best at squint" property
is damaged — the bars are exactly what the squint keeps).
siege / plague / famine / year-018 / year-100 / town-2 / crossing: same defect, same direction.

⚠ **This means every eyes verdict in review654 on a RIVER leaf graded a state that is not merely
"one wave short" but one wave short *in the flattering direction*.** I1 understated its own finding.

---

## CHECKPOINT 4 — D2 · WAREHOUSE BLIND ROUND 3 (review row I16) — READY, AND RE-CUT AT THE SEAL

### 4.1 The extractor IS cheaply reproducible at the seal — so I re-rendered rather than settled

`$SP/reg3work/silhouetteWarehouse.mjs` is bound to the OLD tree (`const TREE = ${SP}/laneREG3-tree`,
HEAD `93fa8a2ca`, the REG-3 seal) and builds every leaf with **`{ shapeCode: true }` alone** — hardcoded
at both build sites, no arm plumbing at all. So the shipped W01–W06 were cut with **8 of the seal's 10
arms absent, including BOTH quay arms** — i.e. cut in exactly the state the class is meant to be cured out of.

At the seal, `harness/laneREG3/leaf.mjs` is a re-export shim onto `harness/instruments/leaf.mjs`, whose
`buildOne` is `exemplars.mjs`'s own and passes `fabricOptions` straight to `buildFabric`. **Three edits**
retarget it: `TREE` → `laneBRIDGE-tree`, `{shapeCode:true}` → the 10-arm option set, and the out dir.

Scripts: `$SP/measures/reg3armed/silhouetteWarehouseARMED.mjs` · `$SP/measures/reg3unarmed/silhouetteWarehouseUNARMED.mjs`

### 4.2 The extractor's own C2 controls, re-run at the seal ARMED — LIVE

```
── C2 CONTROLS (bodyInkInCrop, against a real emitted crop of sil-1)
   centred  {"ok":true,"drawn":3,"frame":14,"ownArea":134.2}
   faraway  {"ok":false,"drawn":3,"frame":0}
   wiped    {"ok":false,"drawn":0,"frame":0}
   nudged   {"ok":false,"drawn":0,"frame":4}
   tiny007  {"ok":false,"drawn":0,"frame":4}
   ok × 6 (all six assertions)
C2_CONTROLS LIVE          EXIT=0
```
⭐ Note `ownArea` **134.2** armed against the **90.6** the extractor's own header records unarmed — the
same body, measurably larger with the arms on.

### 4.3 ⭐ THE SAME-SEAL A/B — the two quay arms rescue ONE wiped body in four

Both runs at seal `9de729021`, same ladder, same rule, differing ONLY in the fabric option set:

| | inked candidates | distinct seeds | refused by ink floor | WHICH were wiped to area 0 |
|---|---|---|---|---|
| **UNARMED** (`{shapeCode:true}`) | 8 | 6 | **4** | sil-0 · sil-4 · **sil-8** · sil-20 |
| **ARMED** (10 arms) | 9 | 7 | **3** | sil-0 · sil-4 · sil-20 |

Both rounds: `real 4 of 4 · decoys 2 of 2`, `refused after emission (C2/C3): 0`, `REGI1_WAREHOUSE FILLED`, EXIT=0.

**CONFIRMED: `--quay`+`--vquay` rescue exactly ONE of the four ground-law-wiped quay bodies (sil-8).
sil-0, sil-4 and sil-20 are still wiped to `area 0 · solids 0` with the waterfront exemption armed.**
V-QUAY is a 25 % cure of the wipe, not a cure. §5 below measures why.

### 4.4 READINESS — both fixture sets verified independently of the key

Verified by parsing each fixture SVG myself (filled-path area inside the crop's own viewBox) — I did
NOT open any answer key. `$SP/reg3work/silhouette-key/` was never read; neither were the two new keys.

| set | path | fixtures | all area>0 | PNGs | sheet |
|---|---|---|---|---|---|
| ⭐ **ARMED (recommended primary)** | `$SP/measures/reg3armed/silhouettes-warehouse-ARMED` | W01–W06 | ✅ 62,536 – 691,218 u² | ✅ 70–169 KB | ✅ 864 B |
| **UNARMED control (same seal)** | `$SP/measures/reg3unarmed/silhouettes-warehouse-UNARMED` | W01–W06 | ✅ 62,380 – 693,770 u² | ✅ 50–152 KB | ✅ 864 B |
| pre-existing (older seal, unarmed) | `$SP/reg3work/silhouettes-warehouse` | W01–W06 | ✅ 62,380 – 457,509 u² | ✅ 51–164 KB | ✅ 864 B |

Answer keys (NOT read by me, NOT named in any sheet):
`$SP/measures/reg3armed/silhouette-key/ANSWER-KEY-WAREHOUSE.json` ·
`$SP/measures/reg3unarmed/silhouette-key/ANSWER-KEY-WAREHOUSE.json`

**I did not answer the sheet and did not look at a fixture PNG.** Round prepared; chair dispatches the
fresh-context reader. ⚠ The ARMED and UNARMED sets share 4 of 6 crops but differ in 2 — a reader given
both would not be reading independently. **Recommend: dispatch the ARMED set to one fresh reader.**

---

## CHECKPOINT 5 — D3 · THE BRIDGEHEAD RE-MEASURE (review row I17) — `bridgehead` FIRES

### 5.1 The premise confirmed, then refuted by measurement

`laneBRIDGE-receipt.md` is 853 lines with exactly ONE `bridgehead` hit (line 296, a quotation of the
L-REG-31 law). The chartered rider did drop. CONFIRMED.

**BEFORE — `receipts/laneREG4-receipt.md:149-151`, verbatim:**
> `- **Faubourg origins: gate 42 · road 87 · bridgehead 0**, over 129 buildings on 8 leaves, with`
> `  **gate resolution 100 % (every building resolved to a real gate object, 0 fallbacks)**.`
> `  ⚠ ` + "`bridgehead`" + ` is likewise unfired on this corpus — same treatment.`

and lines 305–308: *"⚠ `bridgehead` FIRES NOWHERE ON THIS CORPUS"*.
⚠ REG-4 left **no re-runnable instrument** — line 143 records only
`buildOne(spec, {marketRegister:true, minFootprint:true})`; its own §9 re-run block omits an origin census.
⚠ REG-4's own §(5) per-leaf table sums to **138 / gate 45 / road 93**, not the 129 / 42 / 87 it states — an
internal inconsistency, though both readings agree on `bridgehead 0`.

**AFTER — at the seal.** New instrument: `$SP/measures/bridgehead/originCensus.mjs` (+ `control.mjs`).

| arm set | faubourg buildings | gate | **bridgehead** | road | extramural regions (bridgehead) | decks |
|---|---|---|---|---|---|---|
| REG-4's own `--market --footprint` | 135 | 37 | **4** | 94 | 0 | 19 |
| full 10-arm seal set | 121 | 39 | **2** | 80 | **1** (crossing) | 18 |

### 5.2 THE ANSWER: **YES — `bridgehead` fires at the seal.**

- Full 10-arm: **2 faubourg buildings** (both `highwater`) + **1 extramural district region** (`crossing`).
- REG-4's own flags: **4 buildings** (town/siege/plague/famine, one each) — but **1 distinct site** counted 4×.

**⛔ THE SHARPER FINDING: REG-4's zero had ALREADY decayed before REG-BRIDGE existed.** At the seal's code
with REG-4's *own* flags it reads **4**, not 0 — intervening landed waves resurrected the branch.
REG-BRIDGE's `--river`/`--deck` then *moved* which leaves fire (town-site → highwater + crossing); they did
not create firing from nothing. Arm attribution CONFIRMED differentially: `--market` alone reproduces
`--market --footprint` byte for byte, and `--market --river --deck` reproduces the full set byte for byte —
`minFootprint`, `fuse`, `rampart`, `shapes`, `ford`, `quay`, `vquay` are all **inert** here.

**⛔ SECOND DECAYED ABSENCE:** REG-4 exit-inventory item 3 (line 623, *"EVERY EXTRAMURAL REGION TYPES AS
`road`"*) is also refuted — `crossing`'s government-quarter faubourg region types `bridgehead` at the full set.

### 5.3 Controls — the instrument is LIVE (4 differential controls, both arm sets, all PASS)

```
R  REPRODUCTION : 18 of 18 leaves replay the PUBLISHED counts exactly     → PASS
C1 DECKS REMOVED: bridgehead survived on 0 of 18 leaves (must be 0)       → PASS
C2 PLANT ON DECK: 7 of 7 plants typed bridgehead, count +1 each           → PASS
C3 PLANT FAR    : 7 of 7 far plants did NOT type bridgehead               → PASS
```
C1 is the convicting one: with `bridges: []` held otherwise constant, `highwater` goes
`gate 3 · bridgehead 2 · road 6` → `gate 3 · bridgehead 0 · road 8`. The nonzero counts die with their
own cause. C2 also discharges the synthetic control REG-4 itself declared owed at its lines 617–622.

Predicate: `faubourgOrigin.js:176` — `if (deck && dDeck <= knot && dDeck < dGate)`. Publication:
`buildFabric.js:1228` (stage 8c, armed-only). Artifacts: `$SP/measures/bridgehead/origins-*.json`, `run-*.log`, `control-*.log`.

---

## CHECKPOINT 6 — D4 · TE-WSEAM (review row I19, ODQ §641.2) — MEASURED AND CLASSIFIED

### 6.1 The instrument

`$SP/measures/wseam/wseamCensus.mjs`. The DRAWN truth is taken from the ARTIFACT, not from a predicate
that claims to predict it: the emitted `fill="#8d999d"` path in each armed SVG, point-in-polygon (even-odd,
so islands read dry). The SUBSTRATE truth is `substrate.wetAt(sub,x,y) > REFUSAL.standingWater (0.64)` —
the exact expression `groundRefusal.refusalAt` uses. 400² grid, cell 2.50 u. Output `$SP/measures/wseam/wseam.json`.

### 6.2 THE MEASUREMENT — 9 river leaves at the seal, armed

```
    leaf          drawnArea  drawn%  AGREE(both)  ⛔DRAWN∧¬SUB  ⚠SUB∧¬DRAWN   agree%  meanWet  min     max
    town           23862.5  2.386          100       23762.5       2706.3     0.42   0.0902       0       1
    town-2         21506.3  2.151       4856.3         16650      28762.5    22.58   0.4092  0.1367       1
    highwater        25725  2.572         68.8       25656.3       2737.5     0.27   0.0865       0       1
    siege          23862.5  2.386          100       23762.5       2706.3     0.42   0.0902       0       1
    plague         23862.5  2.386          100       23762.5       2706.3     0.42   0.0902       0       1
    famine         23862.5  2.386          100       23762.5       2706.3     0.42   0.0902       0       1
    year-018       23862.5  2.386          100       23762.5       2706.3     0.42   0.0902       0       1
    year-100       23862.5  2.386          100       23762.5       2706.3     0.42   0.0902       0       1
    crossing       23862.5  2.386          100       23762.5       2706.3     0.42   0.0902       0       1

    CORPUS  drawn 214269 u²  ·  AGREE 5625 u²  ·  ⛔ DRAWN∧¬SUB 208644 u²  ·  ⚠ SUB∧¬DRAWN 50444 u²
    CORPUS AGREEMENT INSIDE THE DRAWN RIVER: 2.63 %
```

**⛔ 97.4 % of the area a reader sees as river is scored BUILDABLE DRY GROUND by the ground law.**

- WORST LEAF: **highwater**, 0.27 % agreement, 25,656 u² of drawn river reading dry, meanWet 0.0865.
- BEST LEAF: **town-2** (fjord-reconciled, genuinely wetter substrate), still only 22.58 %.
- The seven Mahabagh-family leaves are identical at 0.42 % / meanWet 0.0902.
- MIRROR CLASS: **50,444 u² corpus-wide** the law refuses as standing water with NO water drawn on it —
  an invisible refusal. town-2 alone carries 28,762 u² (2.9 % of its frame).
- `max` inside the drawn river is 1.0 on every leaf: the substrate's wet spine IS in there. The drawn
  river is a ~24 u-wide ribbon; `sub.wet`'s >0.64 band is a far thinner trace along the same spine.
  **They share a centre line and nothing else.**

### 6.3 Controls — WSEAM_CONTROLS **LIVE** (all three PASS)

| control | result |
|---|---|
| C1 polygon translated +400,+400 must collapse agreement | agreement → 0 on 8 of 9 leaves, 0.97 % on town-2 · **PASS** |
| C2 `wet` field must show real spread (a constant field is a dead read) | spread 0.8689–1.0000 on every leaf · **PASS** |
| C3 extracted polygon must BE the river (centroid → `fabric.water.line`) | 3.39–10.13 u on every leaf · **PASS** |

### 6.4 ⛔⛔ THE CONSEQUENCE, MEASURED TWICE

**(a) Every moored body that renders across the river is BUILDABLE to the ground law.**

```
town      (5 named waterside bodies drawn)          highwater (4 named waterside bodies drawn)
 #  centroid      sub.wet  >0.64  in DRAWN river     #  centroid      sub.wet  >0.64  in DRAWN river
 1  287.4,689.5   0.0887     no   YES                1  599.3,517.2   0.5284     no   YES
 2  281.6,696.8   0.0887     no   YES                2  591.2,522.1   0.5370     no   YES
 3  275.8,704.1   0.0257     no   YES                3  580.8,525.1   0.5479     no   YES
 4  269.9,711.4   0.0281     no   YES                4  574.0,532.8   0.1144     no   YES
 5  299.0,714.4   0.1092     no   no
 → refusalAt() = null (BUILDABLE) at ALL NINE centroids.
```
This independently re-takes the figure `groundLaw.js:439–442` already records ("pier-centroid wetness
0.070–0.153 against a 0.64 limit"): mine is **0.0257–0.1092** on town. Same order, wider low end.
CONFIRMED at the seal, not inherited.

**(b) The `standing-water` clause refuses NOTHING, so the exemption saves NOTHING.**

```
DRAWN BODIES corpus-wide: 30027
  refused WITHOUT exemption : 2   byClause {"crag":2}
  refused WITH    exemption : 2   byClause {"crag":2}
  ⭐ SAVED BY THE WATERFRONT EXEMPTION: 0
```

**`WATERFRONT_EXEMPT_CLAUSES = ['standing-water']` exempts a clause that refuses 0 of 30,027 drawn
bodies anywhere in the corpus.** Measured against the drawn body set, REG-QUAY's exemption is a no-op.

⚠ PRECISION, because the two facts must not be blurred: arming `--quay` DOES change output
(`groundLawDropped` −4 per river town; the moored bodies appear). So `waterfrontExemption` takes effect
at an EARLIER stage — composition / the water-claim clip — **not** at the final `bodyRefusal` pass. The
clause named in `WATERFRONT_EXEMPT_CLAUSES` is dormant; the arm's real work happens elsewhere and under
a different name. That gap between the constant's name and the arm's effect is itself a truth defect.

### 6.5 CONSUMERS OF `sub.wet` — the blast radius (full census in `$SP/measures/wetconsumers/`)

**32 reader sites** (26 shipped `src/`, 3 harness, 3 tests) · **9 writer sites, exactly ONE writing a value**
(`substrate.js:608`, in `buildSubstrate` — single-writer CONFIRMED). 0 destructuring/optional-chaining/computed readers.
11 of 45 raw `.wet` matches filtered as false positives (5 comments, 2 `contract.wet`, 4 `fd.wet`), itemised in the census.

| class | shipped sites | what breaks if the surface moves |
|---|---|---|
| **A · SITING / REFUSAL** | 8 | `groundRefusal.refusalAt`/`buildableMask`, `commons.reserveCommons`, `organisms.growOrganism`, `fields.tillageScore`, `suitability.suitabilityField` ×2, `substrate.siteResources` |
| **B · ROUTING** | 6 | `routes.walkCorridor`, `streets.deriveApproaches`/`walkSpur`/`walkLane`, `suitability.connectingRoads`, `walls.traceWalls` |
| **C · DRESS / DRAWING** | 2 (+2 harness) | `relief.buildRelief` (the marsh reed tuft), `terraform.findGround` (the drainage-ditch grid) |
| **D · METRICS / CENSUS** | 10 | `wetAt`, `wetShare`, `reliefField`, `resourceCoherence` (`dampShare`, `meanWet`, the shoal disc) |
| **E · TESTS** | 3 | `tests/lint/substrateCoherence.walker.test.js` incl. its zeroed-`wet` counterfactual |

One-hop fan-out: `buildableAt` 8 sites/5 files · `refusalAt` 6/4 · `buildableMask` 11/6 · `resourceCoherence` 16 · `tillageScore` 8.

⭐ **THE PRECEDENT THAT SETTLES THE CLASSIFICATION:** `RELIEF_BANDS.marsh` **IS** `REFUSAL.standingWater`
by import (`relief.js:79`), and a test PINS the identity (`tests/domain/townMapFabricRefusal.test.js:78`) —
the marsh tick the lens draws and the ground the law refuses are ONE NUMBER by construction.
**The river has no such weld.** The estate already knows how to do this; it was done for marsh and not for water.

⚠ `waterWorks.js:903` defines a LOCAL `wetAt(rel,x,y)` reading the drawn watercourse that **shadows the
substrate export of the identical name**. `waterWorks.js` imports nothing from `substrate.js` — all 31 of
its `wet` lines are drawn-watercourse, zero touch `sub.wet`. Two functions, one name, opposite truths.

### 6.6 ⭐ CLASSIFICATION: **MACHINERY** — not ACCEPTED

Three grounds, each sufficient:
1. **The estate has already ruled on this exact shape.** `groundRefusal.js:214`, shipped: *"an internal
   contradiction is MACHINERY repair."* This is an internal contradiction between two shipped laws.
2. **It has visible, graded consequences.** §2.5/§3: four landmark-weight bars across the river, colliding
   with the leaf's own BARRED-WATER-GATE legend glyph, on 9 of 18 leaves.
3. **A cure precedent exists and is pinned** (§6.5, the marsh weld). ACCEPTED would mean accepting that
   97.4 % of drawn river is buildable — which is not a tolerance, it is the absence of a law.

⚠ Explicitly NOT "PARTIAL": the hazard-conversion law names PARTIAL as the status that hides. REG-QUAY
looks like a partial cure and measures as a no-op at the refusal pass (§6.4b) and a 25 % cure at the
wipe (§4.3). Recording it as "partially cured" is exactly the failure mode. It is OPEN.

### 6.7 CURE OPTIONS, RANKED — the chair rules

| # | cure | value | cost / gate | verdict |
|---|---|---|---|---|
| **1** | **THE CHANNEL CLAUSE.** Give the ground law a third truth: a `drawn-channel` predicate built from the SAME `rel`/`widthProfile` the renderer strokes; `refusalAt`/`bodyRefusal` consult it. `WATERFRONT_EXEMPT_CLAUSES` then names a clause that FIRES — a quay is exempt from `drawn-channel`, a fishmonger's shed is not. | Cures the cause; makes the existing exemption load-bearing instead of decorative. | ⛔ OWNER-GATED (shipped ground law + a NEW refusal clause). ⚠ a new hazard-registry class costs a **7th path or gate STEP 2 reds**. Declared behaviour shift on 9 leaves. | **RECOMMENDED** |
| **2** | **WELD BY CONSTRUCTION** (the marsh precedent). Derive the drawn channel width from a `sub.wet` isoline instead of a nominal width, so the two agree by construction as marsh/standingWater already do. | Deepest and most principled; matches an existing pinned precedent; removes the seam rather than guarding it. | ⛔ OWNER-GATED. Changes the DRAWN SHAPE of every river on every leaf — a one-time declared visual shift plus every same-seed golden re-recorded. | Strongest if the owner wants the seam gone, not policed |
| **3** | **SCOPE THE EXEMPTION HONESTLY.** No behaviour change: record at `WATERFRONT_EXEMPT_CLAUSES` that the clause it names refuses 0 of 30,027 drawn bodies at the seal and that the arm's real effect is upstream at the claim clip. | Repairs a comment that currently reads as though the exemption is load-bearing. Not a cure. | Non-gated, minutes. | **DO NOW regardless of 1 vs 2** |
| **4** | **THE AGREEMENT RATCHET** (structural prevention). An only-shrinks test pinning corpus agreement inside the drawn river (2.63 %) and `DRAWN∧¬SUB` (208,644 u²), so the figure cannot silently worsen and, once a cure lands, cannot regress. | Makes every later cure measurable; catches the next consumer that widens the seam. | Non-gated. ⚠ a NEW TEST FILE reds THREE censuses at landing. | **DO NOW — land before 1 or 2** |
| **5** | RENDER-SIDE ONLY: stop drawing moored bodies at landmark ink weight / give them a distinct glyph. | Fixes the §2.5 glyph collision. | Non-gated. | **REJECTED as the WSEAM cure** — leaves both truths diverging, so the next consumer hits the same seam. Route the glyph collision as a separate LEGIBILITY item. |

**Recommended sequence: 4 → 3 now (neither gated), then the chair rules 1 vs 2.**

### 6.8 OPEN QUESTION handed to the chair (deliberately deferred — documented, not a bug to re-find)

**What actually wipes sil-0 / sil-4 / sil-20 to `area 0 · solids 0`?** §6.4b proves it is NOT the
`standing-water` clause at the `bodyRefusal` pass, and §4.3 proves the waterfront exemption does not save
them. The extractor's own header (`silhouetteWarehouse.mjs:9–34`) attributes it to the water-CLAIM clip
(93 of 162 piers) — INHERITED, measured at the REG-3 seal, and NOT re-taken by me at `9de729021`.
Cheap next measurement: instrument the clip stage and re-run the 24-seed ladder. Until then the wipe's
cause at the seal is **PLAUSIBLE, not CONFIRMED**.

---

## ARTIFACT INDEX

| what | path |
|---|---|
| armed 10-arm corpus (29 files) | `$SP/review654/out-armed` |
| 8-arm control corpus (proves the base) | `$SP/measures/out-8arm` |
| SVG element-diff tool | `$SP/measures/svgdiff.mjs` |
| armed full-leaf quicklooks | `$SP/measures/ql-armed/*.quicklook.png` |
| quay crops, ARMED vs BASE | `$SP/review654/crops/M-*-quay-*.png` |
| ⭐ round-3 ARMED fixtures (primary) | `$SP/measures/reg3armed/silhouettes-warehouse-ARMED` |
| round-3 UNARMED same-seal control | `$SP/measures/reg3unarmed/silhouettes-warehouse-UNARMED` |
| retargeted extractors + logs | `$SP/measures/reg3armed/`, `$SP/measures/reg3unarmed/` |
| bridgehead census + controls | `$SP/measures/bridgehead/` |
| WSEAM census + JSON | `$SP/measures/wseam/` |
| sub.wet consumer census | `$SP/measures/wetconsumers/` |

**Repo untouched.** `$SP/laneBRIDGE-tree` git status at close: only `?? node_modules/`.
