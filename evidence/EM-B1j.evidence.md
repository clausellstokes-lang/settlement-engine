# EM-B1j — evidence (Opus COMPILE lane, 2026-09-20, read tip `141a1d775`)

Tree: `$SP/read-tip-141a1d775`, detached, `git status --short` EMPTY at start and end.
Every harness takes its tree from `EM_B1J_TREE` with NO default (the chair's 2026-09-20 correction).
Probe scripts live in `$SP/lane-em-compile-EM-B1j-scratch/`.

## §1 · The tip and the preamble

```
$ git -C $SP/read-tip-141a1d775 rev-parse --short HEAD   →  141a1d775
$ git -C … status --short                                 →  (empty)
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195
```
Matches the amended preamble the brief cites. 84 lines; §P2 rows 10–12 present.

## §2 · PART 1 — `LIFECYCLE_CLOSE_FATES`, priced

```
$ git grep -n 'LIFECYCLE_CLOSE_FATES' -- src tests scripts docs
src/domain/worldPulse/institutionLifecycle.js:634:const LIFECYCLE_CLOSE_FATES = new Set(['shuttered', 'bankrupt', 'closed_for_want_of_custom']);
src/domain/worldPulse/institutionLifecycle.js:646:    else if (LIFECYCLE_CLOSE_FATES.has(entry?.fate)) closes += 1;
tests/lint/provenanceStampSingleWriter.walker.test.js:300:    expect(setOf('LIFECYCLE_CLOSE_FATES')).toEqual(['bankrupt','closed_for_want_of_custom','shuttered']);
```

**Consumers: exactly ONE** (`priorLifecycleCounts`, `:641`), plus one exact-equality PIN in
`tests/lint/provenanceStampSingleWriter.walker.test.js:300` — a walker row this packet would move,
and which is OUTSIDE any EM manifest today.

**The counter's subject is `institutionHistory[].fate`, NOT `worldPulseFate`.** Its live vocabulary,
read off every writer:

| Writer | fates written into `institutionHistory[].fate` |
|---|---|
| `institutionLifecycle.js` build/reopen/close/abolish/found | `built`, `reopened`, `founded`, `shuttered`\|`bankrupt`\|`closed_for_want_of_custom`, `abolished`\|`disbanded` |
| `entrepotKernel.js:79` | `built` |
| `tierOutcomeApply.js:391` (spreads `institutionFates`) | `reactivated`, `added`, **and all seven demotion fates** |

⇒ **17 distinct values = 12 shared with `worldPulseFate` + 5 its own** — the charter's figure,
re-derived here by execution rather than inherited.

**THE PRICE.** Widening 3 → the 15 closure fates adds 12 words, of which **NINE are live in
`institutionHistory`** (`abolished`, `disbanded`, and the seven demotion fates). Three are not
(`abandoned_with_the_settlement`, `destroyed_by_disaster` — neither writer appends history;
`ruined_by_decree` — unproducible until EM-B1a). A settlement that has taken a tier demotion or a
patron abolition would gain `closes`, and `closeChance` divides by `1 + 0.6 × priorCloses`
(`INSTITUTION_LIFECYCLE_TUNING.close.priorClosePenalty = 0.6`), so the probability falls and a
seeded roll flips. **This is a lived-behaviour change. CONFIRMED.**

### §2.1 · The witness, executed — and its honest limit

```
$ EM_B1J_TREE=… node probe-witness.mjs > witness-unpatched.json
$ node -e "…diff against tests/fixtures/preset-lighting-witness-golden.json…"
golden rows 8 measured rows 8 fields compared 112 field diffs 0
```
The instrument reproduces the committed golden exactly (the driver is the estate's own
`tests/simulation/presetLightingWitnessRun.js`).

```
$ PATCH_KIND=widen15 node --import '…register(patch-hook.mjs)…' probe-witness.mjs
PATCHED …/institutionLifecycle.js bytes 59384 -> 59606
WIDEN15 vs UNPATCHED: rows 8 fields 112 field diffs 0 rows moved 0
```

⛔ **THAT ZERO PROVES NOTHING, and the instrument says so.** Instrumenting the counter itself:

```
$ node --import '…register(census-hook.mjs)…' probe-witness-census.mjs
CENSUS-INSTRUMENTED …/institutionLifecycle.js bytes 59384 -> 59661
CALLS=0 ENTRIES_READ=0
DISTINCT_FATES=0
```

**The witness NEVER reaches `priorLifecycleCounts`** — its hand-built realm sits in the neutral dead
band, so `classifyEconomyDirection` returns null and `:724` `continue`s before the counter. The
witness is blind to this change by construction, and a lane that read its 0-diff as a clean bill
would have been wrong.

### §2.2 · What the corpora can and cannot see

```
$ grep -rl 'institutionHistory' tests/fixtures/     → 0 files
$ for w in <the twelve added words>; grep -rl "\"$w\"" tests/fixtures/  → 0 files each
$ git grep -n 'import' tests/property/generatorGoldenMaster.test.js
…generateSettlementPipeline…goldenMasterCorpus…   (NO worldPulse import)
```

- **Generator + prose goldens: CANNOT MOVE.** `generatorGoldenMaster.test.js` drives
  `generateSettlementPipeline`; it imports no world-pulse module. The pulse is not the generator.
- **Committed fixtures: CANNOT MOVE.** Zero fixtures carry `institutionHistory`; none of the twelve
  added words appears in `tests/fixtures/` at all.
- **The dormancy goldens are the ONLY corpus that could move.** They drive
  `simulateCampaignWorldPulse` over in-file fixtures. A dormancy golden moves iff its drive
  produces a tier demotion or a patron abolition AND then evaluates a declining-economy streak on
  the same settlement. ⛔ **PLAUSIBLE, not confirmed** — proving it needs `tests/property` under
  vitest, which is GATED. It is scheduled as the build lane's first batch.

## §3 · PART 2 — does a rise or standing fate age out?

```
$ git grep -n 'worldPulseFate' -- src   → 19 occurrences in 8 files
```
Two readers, both re-found by symbol:

1. `src/domain/worldPulse/causeLifecycle.js` `institutionDestroyed` — `if (inst.worldPulseFate) return true;`
   TRUTHINESS, never the value. **This is EM-B1i's declared subject.**
2. `src/domain/provenance/rosterProvenance.js` `institutionLastLifecycle` — reads
   `textOrNull(inst.worldPulseFate)` at `:258`.

⭐ **READER 2 IS STRUCTURALLY BLIND TO A RISE OR STANDING FATE.** `:229–252`:

```js
const standing = inst._worldPulseInactive !== true && !INACTIVE_STATUSES.includes(status);
if (standing) { …reopened? …refounded? return null; }      // ← the fate read is BELOW this
```

`upgraded_by_reconstruction` (no status change, no flag), `founded_by_flourishing`
(`status:'active'`) and `demoted_by_disaster` (no status, no flag) are all *standing*, so the
function returns before it ever reads `worldPulseFate`.

And its only consumer does not render it:
```
$ grep -n 'institutionProvenanceOf\|lastLifecycle' src/components/new/tabs/OverviewTab.jsx
27: import { institutionProvenanceOf } …
57:   const { created } = institutionProvenanceOf(inst);      ← `lastLifecycle` is never destructured
```
```
$ git grep -n 'worldPulseFate\|remnantReason' -- src/domain/region src/domain/prose src/domain/dossier
(no output)
```

⇒ **Wizard News reads it in 0 places; the dossier prose reads it in 0 places; the Overview badge
reads it in 0 places.** After EM-B1i lands, a stale rise/standing fate has **zero readers that
branch on it**. Ageing it out would change stored bytes (and therefore any world-state hash) while
changing no observable behaviour. **The measurement recommends NEVER CLEAR.**

## §4 · PART 3 — the readers of `'remnant'`

```
$ node remnant-census.mjs
FILES=18 OCCURRENCES=37 IN_COMMENT=10 IN_CODE=27
```
Denominator: 37 occurrences, 18 files. 10 are comments. Of the 27 in code, **1 is a different field
entirely** — `src/components/map/heraldRegister.js:250` `kind: 'remnant'`, a dead-settlement
register row, not an institution status.

**THE NINE WRITE SITES ACROSS THREE FILES** (the chair's correction, confirmed verbatim):
```
$ git grep -n "status: 'remnant'\|status: fate.status" -- src
institutionLifecycle.js:1016, :1058
magicRegimeLifecycle.js:354
tierOutcomeApply.js:142,144,145,146,147,148   ← the six-row fate table
tierOutcomeApply.js:160   status: fate.status  ← deactivateForDemotion reads that table
```
Nine literals, funnelled through **four writer functions**. `git grep '"remnant"'` → 0; no template
or computed spelling exists.

**SIXTEEN READER SITES IN FIFTEEN FILES.** Every one groups `'remnant'` with `'removed'` /
`'destroyed'` / `'ruined'` as *not live*. Two are a different subject and are struck from the
denominator: `lineageClaim.js:118` reads a **settlement's** status, and `prose/entryWalker.js:682`
filters the entry's **prose text**, not a record field.

```
$ node inactive-vocab.mjs
ROWS=15  DISTINCT_SPELLINGS=7
  [7x] destroyed|remnant|removed|ruined
  [2x] remnant|removed|ruined              (calamity.js:306, tierOutcomeApply.js:211)
  [2x] destroyed|remnant|removed           (foodStockpile.js:125, institutionLifecycle.js:1051)
  [1x] destroyed|remnant|ruined            (lineageClaim.js:118 — settlement subject)
  [1x] remnant|ruined                      (institutionLifecycle.js:1095)
  [1x] abolished|closed|defunct|destroyed|disbanded|remnant|removed|ruined  (causeLifecycle.js:134)
  [1x] abandoned|destroyed|impaired|remnant|removed|ruined|standing         (entryWalker.js:682 — prose subject)
```

**THE TYPEDEF.** `src/domain/entities/status.js:23` —
`{'active'|'impaired'|'removed'|'destroyed'|'vacant'} EntityStatus`, pinned at exactly five by
`tests/lint/statusUnionTotality.walker.test.js:313`. Its consumers:
```
$ git grep -n 'EntityStatus' -- src tests
```
**FIVE hits in src, and every one is a comment or a JSDoc annotation** (`status.js:171`'s
`@returns {EntityStatus}` is the only live annotation); plus the walker's pin. There is no runtime
consumer of the union at all.

⭐ **DECISIVE: `'ruined'` is outside that union too** — and it appears in 13 of the 15 reader rows,
stamped by EM-B1e's own landed `ruinInstitution`. So are `'defunct'`, `'closed'`, `'disbanded'`,
`'abolished'` (causeLifecycle). Admitting `'remnant'` alone would leave its own siblings outside and
would not touch the seven-way drift, which is the actual defect.

### §4.1 · Divergences checked before being claimed

- `foodStockpile.js:125` omits `'ruined'` — **NOT a defect**: `transportIsDown` also tests
  `_worldPulseInactive === true`, which `ruinInstitution` always sets.
- `institutionLifecycle.js:1051` omits `'ruined'` — **NOT a defect**: the same flag is the first
  disjunct.
- `calamity.js:306` `isStrikeTarget` omits `'destroyed'` and checks no flag — **honest-dead**:
  `git grep "status: 'destroyed'" -- src` returns two sites and both write a **settlement**
  (`mutateEntities.js:69` `destroySettlement`; `settlementSlice.js:768` an action-result
  descriptor). No writer sets an institution's status to `'destroyed'`.

## §5 · PART 4 — the one exported writer

`ruinInstitution` is at `src/domain/worldPulse/calamityKernel.js:242` — **in the kernel, not a
separate leaf**. That is the home this member joins.

```
$ node byte-identity.mjs        # EM-B1e's exact signature (inst, {reason, fate})
W1 CLOSE      BYTE-IDENTICAL: false  KEY-ORDER-IDENTICAL: false
W2 ABOLISH    BYTE-IDENTICAL: false  KEY-ORDER-IDENTICAL: false  EXTRA: ["_worldPulseEconomyClosed"]
W3 MAGIC      BYTE-IDENTICAL: true   KEY-ORDER-IDENTICAL: true
W4 DEMOTION   BYTE-IDENTICAL: false  KEY-ORDER-IDENTICAL: false  EXTRA: ["_worldPulseEconomyClosed"]
```
W1's order moves (`closedByWorldPulseOutcomeId` slides past `remnantReason`). W2's and W4's failure
is **semantic**: the writer stamps `_worldPulseEconomyClosed`, and
`institutionStatusModel.js:334` is `inst._worldPulseEconomyClosed === true && text(inst.status) === 'remnant'`
⇒ SHELL, which that file's own header at `:319-321` says a moral abolition must never be.

```
$ node byte-identity2.mjs       # the corrected signature
W1 CLOSE     BYTE-IDENTICAL+ORDER: true
W2 ABOLISH   BYTE-IDENTICAL+ORDER: true
W3 MAGIC     BYTE-IDENTICAL+ORDER: true
refusal absent fate      throws: true
refusal absent reason    throws: true
refusal absent closure   throws: true
refusal bogus closure    throws: true
```

### §5.1 · The replica census — FIFTEEN, not five

```
$ node replica-census2.mjs      # scoped to the enclosing object literal by brace matching
STAMPS (in class)    = 15 sites in 11 files
PROBES (out of class) = 3 sites in 3 files
ASSERTIONS (third class) = 6 sites in 4 files
TOTAL_SITES=24 across 16 files
```
⚠ A first classifier used a line WINDOW and over-counted (a sibling key on the next literal in an
array leaked in); it is superseded by the brace-scoped one above. The eleven stamp files:
`causeResolutionLifecycle`, `evaluateInstitutionLifecycle`, `foodStockpile`, `institutionFounding`,
`institutionLifecycle`, `institutionStatusLifecycle`, `institutionStatusModel`, `magicForms`,
`magicRegimeLifecycle`, `magicSubstitution`, `moralInstitutionFounding` (all under `tests/domain/`).

## §6 · Budgets and registers

```
$ node headroom.mjs             # eslint's own Linter, max-lines {skipBlankLines, skipComments}
institutionLifecycle.js   effective 798  ceiling 800  headroom 2
calamityKernel.js         effective 457  ceiling 800  headroom 343
tierOutcomeApply.js       effective 228  ceiling 800  headroom 572
magicRegimeLifecycle.js   effective 200  ceiling 800  headroom 600
```
`institutionLifecycle.js` at 798/800 confirms `PACKET_STANDARD.md`'s standing hot-file row exactly.

```
$ node worker-closure.mjs
generation.worker.js STATIC+DYNAMIC closure: 228 modules
  calamityKernel.js        IN CLOSURE: false
  institutionLifecycle.js  IN CLOSURE: false
  tierOutcomeApply.js      IN CLOSURE: false
  magicRegimeLifecycle.js  IN CLOSURE: false
  worldPulse modules anywhere in the closure: 0
```
⚠ Static source walk, not a dist read; the estate's own `entryClosure` arm is GATED and a
`skipIf(!requireDistRead)` arm that skipped proves nothing (§P2 row 11).

```
$ node -e "import vite.config.js → EAGER_FIRST_PAINT_MODULES"
size: 268                               ← the chair's step-15 figure, re-executed
  tierOutcomeApply.js   → MEMBER
  calamityKernel.js / institutionLifecycle.js / magicRegimeLifecycle.js → NOT members
$ for m in supabase/functions/_shared/*.meta.json → inputs 114/74/115/2/2, hits [] in all five
```

```
$ node -e "tests/lint/.lighting-census-baseline.json"
measuredAtSha 7c233db55…   files 2653 parked 383 credited 2270 titles 25052 suiteTitles 6680
```
Matches the frozen tuple `2653·383·2270·25052·6680`. This member edits no baseline and quotes no
absolute in its own text — its row is the DELTA.

## §7 · Dependencies, measured at the read tip

```
$ ls tests/lint/ruinShapeReplica.walker.test.js   → No such file  (FIX-T1 at its gate, not composed)
$ ls src/domain/worldPulse/worldPulseFates.js     → No such file  (EM-B1h not landed)
$ ls tests/domain/ruinInstitution.test.js         → present       (EM-B1e LANDED)
$ grep -n 'ruinShapeReplica' scripts/mutation-coverage-manifest.json → (no row; FIX-T1 brings it)
```
