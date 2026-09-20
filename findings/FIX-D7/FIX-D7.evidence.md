# FIX-D7 — the eight items MEASURED at the lane base, before the first edit

Base: `$SP/lane-fix-d7` @ `5a3380e8d`, branch `fix-generator-hygiene-2026-09-20`, `status --short` EMPTY at start.
Goldens before the first edit: `7177cd6e…8f1e` / `921c51cf…db41` (both match the brief).

Instruments (TOOL-8's, re-pointed at THIS base, plain `node`, ungated):
`baseline.mjs` → `corpus.txt` (**rows 525 errs 0 ms 8349 MB 73.6**), `vocab.mjs` → `vocab.json`
(**instNames=231 svcNames=375 resKeys=51 facNames=31 secrets=321 incomeSrc=26 goods=98 npcRoles=112 histDesc=53 allShort=8287** —
reproduces TOOL-8 §0 exactly), then `measure.mjs`, `measure2.mjs`, `measure3.mjs`, `measure4.mjs`, `measure5.mjs`.

---

## N2 — `npcGenerator.js:613-617` — CURE (behaviour-preserving)
- `substitute()` reads exactly **108 strings** (26 roles × short/long) of `NPC_FACTION_GOALS`.
- `{commodity}` in those 108: **0**. In the whole of `src/data/npcData.js` source: **0**.
- `{faction}` in those 108: **0**. In the whole of `src/data/npcData.js` source: **0**.
- `/grain/`: **1** string — `Governor.short` = `"Secure enough grain reserves before winter to prevent unrest"`.
  `\bgrain\b` matches it; **grain-inside-a-longer-word: 0**. So `\b` is byte-identical over the population.
- The estate's LIVE generic token substituter is `replaceTokens` (`npcGenerator.js:742`, used at `:780-781`
  over `effect.secret`/`effect.stakes`) — a different table. The two hand-rolled replaces at `:615-616`
  are its dead duplicates.

## N3 — `services/serviceClassifier.js` header — CURE (comment + derived pin)
- Header claims `SERVICE_CATEGORY_MAP` *"covers all 260 known services unambiguously"*.
- MEASURED: **280 keys**; covers **124 of the 375** corpus service names; **251 fall through** to the keyword
  heuristic, which is therefore LOAD-BEARING. All three figures in the claim are wrong.
- The 303 dead arms stay (TOOL-8a's `precedence-shadowed` rows, not this lane's).

## N4 — `narrativeGenerator.js:500,516` — MOVED TO FIX-D6 (`professional guard`) · KEEP (`healer`)
- `hasInst('professional guard')`: **0 of 231** corpus AND **0 of 280 catalogue**.
- `hasInst('healer')`: **0 of 231** corpus BUT **1 of 280 catalogue** — `"Healer (divine, 1st level)"`.
  ⇒ catalogue-REACHABLE. Retiring it would change `healerRef` for any settlement carrying that entry
  (→ 'the clergy' when a church is present, → 'the local herbalist' at thorp/hamlet). **KEEP — `corpus-absent`.**
- The corpus's only professional force is `"Professional city watch"`, caught by the LATER `city watch` rung
  (`city watch` → 1 of 231). The `professional guard` rung sits ABOVE it.
- Retiring `professional guard` is output-neutral over the corpus, but honouring the real spelling
  (`Professional city watch` → 'the professional guard' instead of 'the watch') MOVES THE GOLDEN.
  Both readings sit on one site ⇒ the product question is the signed door's. **JUDGMENT recorded below.**

## N5 — `economy/foodBalance.js:221` — ⛔ PREMISE REFUTED; the contract HOLDS. CLOSED + PIN
- TOOL-8 §8 N5 says the de-slug `.replace(/_/g,' ')` "fired **0 times** in 525 rows". **REFUTED at this base.**
- `importChannel` values over 525 rows:
  `road trade 286 · port trade 73 · river trade 63 · null 50 · minor routes and sanctioned caravans 49 · crossroads trade 3 · `**`mountain pass trade 1`**
- The 2 `mountain_pass` rows are both `Schwarzwalde`; the **mountain**-terrain one carries
  `importChannel: "mountain pass trade"` (deficit 52%, importCoverage 464). The plains one is `null`
  (deficit 2% — nulled by the `importCoverageFinal > 0` gate the comment at `:211-214` describes).
- ⇒ The declared contract at `:216` is TRUE and EXERCISED. Nothing to retire. Pin it so it cannot rot.

## N7 — `historyGenerator.js:471` — KEEP, register `defensive` (NOT a fossil)
- `historyData.js` exports **1,220** strings; **1** contains `" vs "`
  (`HISTORICAL_EVENTS_DATA[8].description` = `"Old ways vs new ideas creates conflict between age groups"`).
- Strings pairing TWO substitutable labels across `" vs "`: **0**. Corpus history descriptions containing
  `" vs "`: **0 of 53**. Matching the doubled shape: **0 of 53**.
- BUT the shape is **REACHABLE BY CONSTRUCTION**: `historyGenerator.js:464` and `:465` both substitute to the
  SAME value — `.replace(/Legitimate heir/g, govFaction)` and `.replace(/Corrupt officials/g, govFaction)`.
  A template spelling `"Legitimate heir vs Corrupt officials"` renders `"<gov> vs <gov>"` and the guard fires.
- ⇒ a live `defensive` guard against a one-template-away collision, not a fossil. **Do not retire.**

## N8 — `power/economyReconciliation.js:62` — CLOSED, `corpus-absent`, layer is CORRECT
- Corpus faction names carrying `(dominant)`: **0 of 31** (all 31 are synthesised `"The …"` names).
- The PRODUCER EXISTS and is in the SAME generator layer: `power/rulingStructure.js:500`
  emits `'Merchant Guilds (dominant)'`, gated at `:498-499` on `prosperity === 'Wealthy' || 'Thriving'`.
- Corpus prosperity distribution: `Prosperous 194 · Comfortable 120 · Moderate 115 · Poor 60 · Struggling 36`.
  **Neither `Wealthy` nor `Thriving` ever occurs.** `Wealthy` is the TOP rung of the real ladder
  (`economy/prosperity.js:125`); `Thriving` is in NO producer ladder at all (noticed, below).
- ⇒ the normaliser is correctly placed and correctly spelled; it is dark only because the corpus never
  reaches the top prosperity rung. Retiring it would arm a real bug. **Do not retire.**

## N9 — `institutionProbability.js:82` — CURE (`armou?ry`) · the rest CLOSED
⛔ **The brief's site list for N9 is inherited from TOOL-8 §8 N9 and is WRONG**: of
`fortif · bandit · levy · harbor · feudal · planar trader`, only **`fortif` (×2, `:81`,`:250`)** and
**`bandit` (`:125`)** are in `institutionProbability.js`. Measured real sites:

| literal | real site(s) | corpus 231 | catalogue 280 | disposition |
|---|---|---:|---:|---|
| `armory` | `institutionProbability.js:82` | 0 | 0 | **CURE → `armou?ry`** (both spellings absent ⇒ byte-identical) |
| `armoury` | — (absent) | 0 | 0 | — |
| `fortif` | `institutionProbability.js:81`,`:250` | 0 | 1 `"Massive walls and fortifications"` | CLOSED `corpus-absent` |
| `bandit` | `institutionProbability.js:125` | 0 | 1 `"Bandit affiliate"` | CLOSED `corpus-absent` |
| `levy` | `structuralValidator.js:546` | 0 | 1 `"Household levy"` | CLOSED `corpus-absent` (other file) |
| `harbor` | `structuralValidator.js:757`, `upgradeOpportunities.js:39`, `foodBalance.js:72` | 0 | 0 | CLOSED here; see noticed |
| `harbour` | same | **1** `"harbour master's office"` | 1 | — |
| `feudal` | `factionDynamics.js:479`, `rulingStructure.js:141` (FACTION names, not inst) | 0 | 0 | CLOSED — wrong receiver in the brief |
| `planar trader` | `computeActiveChains.js:969`, `isolationGenerator.js:217` | 0 | 1 `"Planar traders"` | CLOSED `corpus-absent` (other files) |

- The estate's established spelling idiom is a regex carrying BOTH: `lib/entities.js:165`
  (`/barracks|fort|keep|citadel|rampart|armory|armoury/i`) and `worldPulse/militaryStrength.js:88`.

## N13 — `institutionalCatalog.js` `"Woodcutter's camp"` — ⛔ MOVED TO FIX-D6 (a measured DEFECT)
Not a rarity, not a zero weight, not a terrain gate. The full mechanism, executed:
- The corpus HAS **12 thorp+forest rows** (`thorp/forest 12`, one per culture; all `route=isolated`).
- `"Woodcutter's camp"` is the **ONLY forest-gated entry in the ENTIRE catalogue**, at
  `thorp/Economy`, `terrainRequired:['forest']`, `baseChance 0.55`.
- It IS selected — in every one of the 12 rows, at **100% final likelihood**:
  > `assembleInstitutions` / `result: "selected"` / `"Base chance 58% lifted by ×2.50 from nearby resources + terrain."`
- It is then **stripped** by the very next pass:
  > `isolationPass` / `result: "subsistence_stripped"` /
  > `"Settlement is in subsistence mode. \"Woodcutter's camp\" requires external supply chains that don't reach here."`
- The stripper is `isolationGenerator.js:169-178` `isTradeInst`, a **DEFAULT-DENY** classifier:
  `TRADE_TAGS` (15) and `TRADE_NAME_KEYWORDS` (21) both miss the camp, so it falls to the last line
  `return !tags.some(t => keepTags.includes(t))` with
  `keepTags = ['essential','water','housing','agriculture','food','religious','civic','infrastructure','criminal']`.
  The camp's tags are **`['economy','timber']`** — on NEITHER list ⇒ classified as a TRADE institution and spliced out.
- ⇒ felling timber, the most self-sufficient activity a forest thorp has, is deleted as "requiring external
  supply chains". Any honest cure (tagging the camp, or widening `keepTags`) ADDS an institution to up to 12
  corpus rows and moves everything downstream. **FIX-D6's signed door.**

---

## JUDGMENT calls (vetoable)
1. **N4 `professional guard` → FIX-D6 rather than retire.** Retirement IS output-neutral over the corpus
   (0 of 231, 0 of 280 catalogue) and the brief permits it. I decline it because the rung sits ABOVE the
   `city watch` rung that catches the corpus's only professional force, so deleting it silently settles a
   product question — does `Professional city watch` read as 'the professional guard' or 'the watch'? — by
   deletion, and the condition "the later rung already catches every row" holds only vacuously (no row can
   match). Alternative rejected: retire with a pin (one line, still available). Say "veto" to flip it.
2. **N2 retires BOTH dead token replaces, not only `{commodity}`.** `{faction}` measures identically
   (0 of 108, 0 in source) and sits on the adjacent line; curing one and leaving its twin is the N−1 sweep.
   The enclosing guard `if (commodity || topFaction)` is left EXACTLY as it stands: narrowing it to
   `if (commodity)` would return the shared `NPC_FACTION_GOALS` object instead of a spread copy, which would
   let a downstream mutation contaminate every later settlement. Say "veto" to flip it.
