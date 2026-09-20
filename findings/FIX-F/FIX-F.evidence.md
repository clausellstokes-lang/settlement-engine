# FIX-F — the measurement, written BEFORE the first edit

Lane `FIX-F` · worktree `$SP/lane-fix-f` · branch `fix-followups-2026-09-19` · base `76be138a1`
(`git branch --show-current` → `fix-followups-2026-09-19`; `git log -1 --format=%h` → `76be138a1`;
`git status --short` → empty). Measured 2026-09-19 18:1x EDT (`date` → `Sat Sep 19 18:12:16 EDT 2026`).

Goldens at base, before any edit:

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

---

## FIX-F1 — LIVE, and LARGER THAN THE LEDGER RECORDED

### The verdict

**LIVE.** ODQ §934.22 addendum 2 described the defect as "correct on screen, latent desk↔screen
disagreement". **The "correct on screen" half is REFUTED by measurement**: eight of the
disagreements reach the reader on generated worlds, because three positions render the desk's
line RAW with no `weaveBlock` backstop under them. The addendum's count of unmigrated callers is
also two short.

### 1. The unmigrated call sites — ELEVEN, not nine

`git grep -n "economyDeskRead(\|generalDeskLines("` over `src/components/new/tabs/`, every bag read
in full. A bag WITHOUT `tierNoun`:

| # | site | reader |
|---|---|---|
| 1 | `src/components/new/tabs/DailyLifeTab.jsx:76` | `economyDeskRead` |
| 2 | `src/components/new/tabs/EconomicsTab.jsx:296` | `generalDeskLines` |
| 3 | `src/components/new/tabs/EconomicsTab.jsx:357` | `economyDeskRead` |
| 4 | `src/components/new/tabs/HistoryTab.jsx:47` | `generalDeskLines` |
| 5 | `src/components/new/tabs/RelationshipsTab.jsx:83` | `generalDeskLines` |
| 6 | `src/components/new/tabs/ResourcesTab.jsx:34` | `economyDeskRead` |
| 7 | `src/components/new/tabs/ServicesTab.jsx:148` | `economyDeskRead` |
| 8 | `src/components/new/tabs/SteadingsSection.jsx:52` | `generalDeskLines` |
| 9 | `src/components/new/tabs/PlotHooksTab.jsx:73` | `generalDeskLines` |
| **10** | **`src/components/new/tabs/ViabilityTab.jsx:56`** | `generalDeskLines` |
| **11** | **`src/components/new/tabs/OverviewTab.jsx:182`** | `generalDeskLines` |

Rows 10 and 11 are the ledger's blind spot. §934.22 addendum 2 lists Viability and Overview among
the tabs lane 37 CURED — and it cured their OWN desks (`ViabilityTab.jsx:71`'s
`defenseMagicDependencyProse` bag, `OverviewTab.jsx:223`/`:364`'s two stressor reads, both of which
carry `tierNoun` today). Neither tab's `generalDeskLines` bag was moved. So the backstop is reached
by eleven callers, not nine, and deleting it after curing only the named eight would have regressed
two tabs.

### 2. The defect's live size — 112 disagreements over 12 generated worlds

`node $SP/lane-fix-f-scratch/measure-f1b.mjs` — six tiers x two cultures through
`generateSettlementPipeline`, each desk read twice (bag without `tierNoun`, bag with it), every
position compared SCREEN-TO-SCREEN (a woven position passes through `weaveBlock` either way, so the
cured screen is the weave of the spoken lines, never the desk's bare return):

```
desk<->bag disagreements, LATENT (backstop repairs on screen): 104
desk<->bag disagreements, READER-VISIBLE on screen           :   8
per-field disagreement counts: {
 "siteLines": 12, "originLines": 8, "connectionLines": 5, "identityLines": 9,
 "foundedLine": 6, "recordLine": 4, "verdictLines": 12, "shadowEconomy": 2,
 "tradeProfile": 6, "terrainIdentity": 10, "economicStrengths": 3, "incomeMix": 9,
 "prosperityRung": 5, "catalogStanding": 3, "situationLine": 4, "craftReasonLine": 1,
 "strategicValue": 6, "prosperityHeader": 5, "exploitation": 2
}
positions DARK on every generated world (not measured): populationLine, healthLines,
framingLines, networkLines, engagementLines, remnantLine, ruinLine, steadingLines,
tradeFlow, impairedService
```

⚠ A first cut of this script compared the woven screen against the desk's BARE return and reported
12 visible leaks. Four of those (`siteLines`) were an artifact of that comparison, not leaks. The
corrected screen-to-screen figure is 8. Quoted here so the number is not re-found as a discrepancy.

### 3. The eight reader-visible leaks, verbatim

All eight are at positions the tab renders RAW — `EconomicsGlance.jsx:134` (`prosperityHeader`),
`EconomicsTab.jsx:740` (`shadowEconomy`), `EconomicsTab.jsx:599` (`craftReasonLine`) — where no
`ProseBlock`/`weaveBlock` sits under the line to repair it. Five examples:

```
[village/germanic] prosperityHeader (RAW)
  SCREEN PRINTS: Flachbrücke manages. The mix of field and market covers what the town needs …
  SHOULD PRINT : Flachbrücke manages. The mix of field and market covers what the village needs …

[city/germanic] prosperityHeader (RAW)
  SCREEN PRINTS: … the spread of trades keeps more hands busy than the town strictly needs …
  SHOULD PRINT : … the spread of trades keeps more hands busy than the city strictly needs …

[city/germanic] shadowEconomy (RAW)
  SCREEN PRINTS: A little of Goldholz's trade goes unrecorded, … too small to change what the town is.
  SHOULD PRINT : A little of Goldholz's trade goes unrecorded, … too small to change what the city is.

[city/iberian] prosperityHeader (RAW)
  SCREEN PRINTS: Nobody here talks about the price of bread. The town is well off …
  SHOULD PRINT : Nobody here talks about the price of bread. The city is well off …

[metropolis/iberian] prosperityHeader (RAW)
  SCREEN PRINTS: Qinggrund manages. The spread of trades covers what the town needs …
  SHOULD PRINT : Qinggrund manages. The spread of trades covers what the metropolis needs …
```

This is ODQ §934.22 item 3's own defect ("a village called 'town' in its own prose") still shipping
on the Economics tab of every non-town settlement.

### 4. Why the parity instrument did not catch it — a modelling gap, cured by construction

`tests/pdf/statePrintParity.test.jsx` models the SCREEN for these three positions with
`screenParagraph(...)` / `screenWeave(...)` (`:262`, `:266`, `:269`), both of which apply
`weaveBlock` with `tierNounFor(settlement.tier)`. The real tabs apply no weave there. So the parity
suite has been comparing print against a screen that repairs itself, while the actual screen does
not — which is exactly why a green parity suite coexists with a city reading "the town".

⭐ The cure removes the gap without a test edit: once the bag carries `tierNoun`, the desk's return
is already spoken, and `weaveBlock` on a single already-spoken line returns it by identity
(`weaveBlock.js:257`, `kept.length <= 1`). The model and the page then agree by construction.

### 5. What the change costs — registers, measured before the edit

- **Neither golden can move.** The recorder (`tests/fixtures/composedReadingSequence.js:197`,
  `:205`) and the manifest (`tests/property/dossierProseManifest.test.js`) call the desk READERS
  directly with their own bags; they never read a tab file. The readers still FORWARD and never
  derive (`economyDeskRead.js:121`, `generalDeskRead.js:261`), so a caller that does not ask gets
  the corpus's own words — which is the 4,214-cell trap lane 37 withdrew, and it stays shut.
- **`tests/lint/.prose-numerics-baseline.json` re-addresses by exactly +1 on 23 rows.** The
  baseline freezes debt by `path + line + category + snippet` and the arm is
  `expect(LIVE.hits).toEqual(baseline)` (`tests/lint/proseNumerics.test.js:778-784`) — an exact
  deep-equality including the line number. Two of the eleven files carry rows: `EconomicsTab.jsx`
  (22 rows, lowest at line 206) and `DailyLifeTab.jsx` (1 row, line 268). Each file gains exactly
  ONE effective line (its `tierNounFor` import); every call-site edit extends an EXISTING line, so
  the shift is uniformly +1. No row is added, removed or re-categorised, and
  `REVIEWED_TOTAL_CEILING = 218` with every category ceiling is untouched. This is the same act the
  register's own header records repeatedly ("88 pure line moves … re-addressed rather than banked").
- **⛔ `EconomicsTab.jsx` IS AT ITS `max-lines` CEILING.** Measured exactly as eslint computes it
  (`{skipBlankLines: true, skipComments: true}`, espree comment ranges — `measure-maxlines.mjs`):

  ```
  EconomicsTab       effective  599  ceiling 600  headroom 1
  OverviewTab        effective  482  ceiling 600  headroom 118
  (the other nine all have 275+ headroom)
  ```

  `src/components/**/*.jsx` is capped at 600 (`eslint.config.js:665-668`) and no file here has a
  `scripts/.size-baseline.json` override. One import line takes EconomicsTab.jsx to **600 of 600 —
  lawful, passing, and with ZERO headroom left for the next car.** The ceiling is shrink-only and is
  NOT raised. Flagged for the chair as the sharpest consequence of this commit.

### 6. The backstop's fate — reported, not acted on (the chair's ruling)

After this commit **no caller reaches `speakTierNoun` through `weaveBlock`'s backstop**: all eleven
desk bags carry the noun, and the remaining `weaveBlock` callers (`ProseBlock.jsx:63`,
`printProse.js`, the test helpers) pass a `tierNoun` whose lines the desk already spoke, so the call
is an identity scan. What still PINS it:

- `src/domain/display/stateProse/weaveBlock.js:85-90` — the docblock's own removal condition:
  *"Remove it only when every desk bag carries `tierNoun`, and red the tab-flow suites deliberately."*
  That condition is now met.
- `tests/domain/display/stateProse/weaveBlock.test.js` asserts the stand-down and the pronoun branch
  over lines the caller supplies un-spoken; those arms pass `tierNoun` directly to `weaveBlock` and
  would need re-cutting, not deleting.
- `tests/ui/economicsTabFlow.test.js:589-600` (`onPage`) and `tests/pdf/statePrintParity.test.jsx`
  (`screenParagraph`/`screenWeave`) both call `speakTierNoun`/`weaveBlock` themselves to model the
  page; removing the backstop does not disturb them.

**Recommendation (the chair's to take or veto): KEEP it.** It costs one identity scan, and it is the
only thing standing between a future twelfth caller that forgets the bag and a silent regression to
the corpus's generic noun. Deleting it converts a forgotten bag from "correct anyway" into a
reader-visible defect. Not deleted by this lane either way.

---

## FIX-F2 — STOPPED. The premise holds; every landing is either forbidden or out of scope.

### The verdict

**STOPPED, uncommitted, for the chair's ruling.** The token is genuinely missing. Adding it finds
**zero real leaks**. But the detector carries a RECORDED RULING that adding it is above a lane, and
the only cure the estate has ever sanctioned for the four hits it does produce reaches a
contract-pinned corpus document this launch did not scope.

### 1. The premise — CONFIRMED

`tests/helpers/proseNumericsWalk.js:28-35`, verbatim:

```js
const FLOAT_TOKENS = new Set([
  'score', 'chance', 'roll', 'rate', 'ratio', 'fraction', 'percent', 'percentage',
  'pct', 'probability', 'confidence', 'severity', 'pressure', 'margin',
  'multiplier', 'mult', 'strength', 'salience', 'tension', 'resentment', 'trust',
  'memory', 'exhaustion', 'readiness', 'resistance', 'burden', 'support',
  'capacity', 'progress', 'share', 'relief', 'stock', 'cliff', 'depth', 'standing',
  'power', 'budget', 'decay', 'exposure', 'quality', 'bias', 'flow', 'accum',
]);
```

`weight` is ABSENT. The SAME FILE's other instrument — the static two-decimal vocabulary inside
`hasTwoDecimalToken` (`:515`) — DOES name it: `…|resistance|strength|ratio|multiplier|piety|weight|salience|…`.
The file's two instruments disagree about exactly one token, as claimed.

### 2. The matcher's semantics — CONFIRMED

Not a RegExp and not a substring. `identifierTokens` (`:518-525`) splits an identifier on
camelCase and non-alphanumerics, lower-cases each token, and the test is
`FLOAT_TOKENS.has(tokens.at(-1))` (`:571`) — the **LAST token only**, whole-token,
case-insensitive. So `weight` and `coupWeight` would fire; `weights`, `weightBand`, `weightedPull`
and `weight_factor` would not. `HUMAN_WORD_SUFFIX_RE` (`:27`,
`/(?:band|label|name|id|kind|type|status|word|text|line|sentence|display|url|email|structure|note)$/i`)
pre-empts before the lookup. The surface scanned is `src/**/*.{js,jsx}` read from disk and parsed
with espree — 2,245 files — not the corpus document and not a prose manifest.

### 3. The hit count — 4 added, 0 real leaks (reproduced independently)

`node $SP/lane-fix-f-scratch/measure-f2.mjs` runs the SHIPPED walker twice over `src/`, the second
arm with `'weight'` injected into `FLOAT_TOKENS` in memory. The unmodified arm reproducing the
committed row count is the fidelity control:

```
files scanned                     : 2245
committed baseline rows           : 218
scan AS COMMITTED                 : 218   (fidelity control)
scan WITH 'weight' in FLOAT_TOKENS: 222
ADDED: 4   REMOVED: 0
  + src/domain/worldPulse/warReceiptPools.js:129 [floatInterpolation] `The muster carries ${x.weight} weight in council than it did a generation ago.`
  + src/domain/worldPulse/warReceiptPools.js:136 [floatInterpolation] `The quays carry ${x.weight} weight in council than they did before.`
  + src/domain/worldPulse/warReceiptPools.js:143 [floatInterpolation] `The treaty table carries ${x.weight} weight in council than it did before.`
  + src/domain/worldPulse/warReceiptPools.js:151 [floatInterpolation] `The roads beyond the walls carry ${x.weight} weight in council than they once did.`
```

Classification of all four: **(b) LEGITIMATE ENGLISH, 4. (a) REAL LEAK, 0.** `x.weight` is bound
from a frozen closed vocabulary — `CHANNEL_SURFACE[channel][up|down].weight` in
`src/domain/worldPulse/dispositionNews.js:85-106` — whose only two values are the English
comparatives `'more'` and `'less'`. The reader meets "The muster carries more weight in council than
it did a generation ago." No numeral is ever interpolated. The >5 stopping rule does not fire; the
count is zero.

### 4. Why it cannot land here — three closed doors

**(i) The detector has already ruled, in writing.** `tests/lint/proseNumerics.test.js:465-468`:

> *"`proseNumericsWalk.js`'s FLOAT_TOKENS names `power`, `score` and `standing` but NOT `weight`,
> while the walker's own `namesAScalar` regex two hundred lines below DOES name it — the file's two
> instruments disagree about one token. **Adding it is not a lane's call**: four `${x.weight}`
> interpolations in `worldPulse/warReceiptPools.js` would red on arrival, and **a ceiling may never
> be raised to absorb them**. The class is held meanwhile by a behaviour arm
> (tests/components/statBandsOverDigits.test.jsx), which convicts a planted weight."*

**(ii) There is no allow-list row to write.** The launch instruction ("a legitimate use gets the
detector's own reasoned allow-list row") presumes a mechanism this detector does not have.
`grep -n "ALLOW\|allowlist\|EXEMPT\|WAIVE"` over `tests/lint/proseNumerics.test.js` and
`tests/helpers/proseNumericsWalk.js` returns nothing. What exists is a whole-file path exemption
(`GENERATED_SOURCES`, one entry), and the baseline — which the test itself forbids using this way:
*"a banked row is DEBT, never a sanctioned idiom to copy into a new surface"* (`:138-139`). Banking
four non-debt rows would be laundering, and it would breach `REVIEWED_TOTAL_CEILING = 218` anyway.

**(iii) The sanctioned cure reaches a contract-pinned corpus document.** The estate has ruled this
exact shape twice — HER-7 (`proseNumerics.test.js:319-323`) and TAIL-F (`:151-166`): a binding named
for a scalar that HOLDS A WORD is RENAMED (`strength` → `strengthWord`), sanctioned by
`HUMAN_WORD_SUFFIX_RE`'s `word$` arm, emitting byte-identical prose with no bank and no ceiling
raise. Applied here the rename is `weight` → `weightWord` across the slot's producer
(`dispositionNews.js`, 8 sites), its pools (`warReceiptPools.js`, 4), its registry
(`eventProse.js:301/303/305/307` `requiredSlots`), three test fixtures — **and
`docs/content/RECEIPT_POOLS_LEGACY.md:201/204/420/439/458/478`**, whose four
`` `requiredSlots: ['weight']` `` annotations are PARSED under contract by
`tests/helpers/receiptAnnex.js` (`:70` `LEGACY_ANNEX`, `:78` `REQUIRED_SLOTS_RE`, `:153` throws when
a live row declares none), which in turn feeds eight kind-pool walkers
(`commercialKindPools`, `faithKindPools`, `envoyKindPools`, `sovereigntyKindPools`,
`informationKindPools`, `chanceMeetingKindPools`, `grammarLifecycleKindPools`) and
`tests/domain/treatySuccessionDossier.test.js`.

That is a corpus act under the corpus ritual, not a detector edit. It is outside this launch's scope
and the chair has not ruled it.

### 5. What the chair is being asked

One of:

- **(A) Sequence the rename as its own car** — `weight` → `weightWord`, prose byte-identical, under
  the corpus-document ritual, with the token added to `FLOAT_TOKENS` in the same car so it never
  reds on arrival. This is the estate's twice-ruled cure and it closes the gap permanently.
- **(B) Leave the gap and record it as deliberate** — the class is already held by the behaviour arm
  `tests/components/statBandsOverDigits.test.jsx`, which convicts a planted weight, and the
  `hasTwoDecimalToken` instrument already names the token. Cost: an engine `weight` reaching prose
  WITHOUT a two-decimal literal beside it is invisible to the census.
- **(C) Overrule (i)** and tell the lane to land the token plus the rename inside this lane's scope.

**Recommendation: (A).** It is the only option that both closes the gap and respects
"a ceiling may never be raised". Nothing is committed for FIX-F2.

---

## FIX-F3 — CURED-ALREADY at `475021901cd063b3dce1bf91ffa509510a59b32d`

### The verdict

**CURED-ALREADY.** The deferral was discharged on this very branch by a later car, and the pair was
cured together exactly as the launch required. Nothing to do.

### 1. The chain

```
$ git log --oneline --grep="typograph" -i   /   --grep="uppercase" -i
c83907c54  The dossier's labels descend a three-rung ladder: the section keeps its capitals, …
7b0a7605e  The paid document descends the same label ladder as the screen: one word, one spelling, on both surfaces
475021901  The ladder reaches both surfaces: the screen twins descend, and a band word can no longer hide in a style or a sentence
$ git merge-base --is-ancestor 475021901 HEAD  →  YES — reachable
```

`7b0a7605e` is the car that recorded the deferral, and its message names the two sites verbatim:

> *"Services:161 and SupplyChainFlow:208 are KEPT ON PURPOSE: their screen twins (ServicesTab:274,
> SupplyChainsPanel:239) still shout, so descending the print alone would open a divergence."*

⚠ The launch file has the direction inverted: the DEFERRED sites are the PRINT ones
(`src/pdf/sections/…`); the twins that still shouted were the SCREEN ones.

### 2. All four sites at HEAD — none shouts

```
$ git grep -n "textTransform\|toUpperCase\|upper(" -- src/pdf/sections/Services.jsx \
    src/pdf/sections/SupplyChainFlow.jsx src/components/new/tabs/ServicesTab.jsx \
    src/components/new/SupplyChainsPanel.jsx
src/components/new/tabs/ServicesTab.jsx:259:  … textTransform:'uppercase',letterSpacing:'0.06em' … >Category Status</div>
src/pdf/sections/SupplyChainFlow.jsx:212:            redundant `textTransform:'uppercase'` on top of it — belt and braces around a
```

The first is the tab's ONE section eyebrow (`Category Status`) — rung 1 of the ladder, which keeps
its capitals by design and must not descend. The second is inside a COMMENT. The four label sites
themselves, at HEAD:

```
src/pdf/sections/Services.jsx:163        {tokenCase(stripZwnj(SERVICE_CAT_LABEL[cat.key] || humanize(cat.key)))}
src/pdf/sections/SupplyChainFlow.jsx:215 <Text style={{ ...type.label_plain, … }}>{tokenCase(safe(needLabel || needKey))}</Text>
src/components/new/tabs/ServicesTab.jsx:348   <span style={{fontSize:FS.sm,fontWeight:800,…}}>{tokenCase(meta.label)}</span>
src/components/new/SupplyChainsPanel.jsx:262  {tokenCase(needLabel || needKey)}
```

Both pairs descend together through `tokenCase`, with the PDF side also dropping `type.label`'s
transform for `type.label_plain` (which drops the transform AND its tracking in one place).

### 3. ⚠ A correction the chair should carry — the idiom is NOT small capitals

The launch's framing ("small capitals and rubrics as lane 15's typography car established") does not
match what the car did, and cannot be met on the print surface at all:

- The established idiom is a **three-rung ladder**: rung 1 (section eyebrow) keeps tracked capitals;
  rungs 2 and 3 (field name, status value) descend to **sentence case** via `tokenCase`/`statusCase`
  (`src/domain/display/labelCase.js`) rendered in `type.label_plain` (`src/pdf/theme.js`).
- **The PDF layer cannot express small capitals.** It is `@react-pdf/renderer`;
  `@react-pdf/stylesheet` knows `textTransform` and does **not** know `fontVariant`
  (`grep -ro "fontVariant" node_modules/@react-pdf/stylesheet/lib/` → nothing), and
  `src/pdf/theme.js` registers only Lora and Nunito, both re-cut to strip `liga`, with no small-caps
  face. Real small caps exist only on screen, in CSS (`src/index.css:560`, `.sf-smallcap`).
  Choosing small capitals for a twinned label would therefore MANUFACTURE the screen/print
  divergence the ladder exists to close.

So the owner's tome law is being served here by sentence case, not by small caps — and any future
rubric proposal for a twinned label needs a registered small-caps face first.

### 4. Still open on this branch (not this lane's, reported for a slot)

- `src/components/new/SummaryTab.jsx` — 15 uppercase sites deferred by car 1 (behind the
  `summaryMagazineV2` flag's off-fallback).
- `'FOOD SECURITY'` is deliberately absent from `LADDER_WORDS` in
  `tests/pdf/labelLadderParity.test.jsx` — car 3 recorded that resolving it needs a structural
  handle on the group header, so the lawful rung-1 eyebrow in `src/pdf/sections/EconomicsTrade.jsx`
  is not convicted alongside the rung-2 group header on the same page.

---

## ADDENDUM, written AFTER the FIX-F1 edits — the red-first proof, and a foreign red found on the way

### A. The cure's red-first proof — ARM 4, the tier-noun guard

The launch's proof clause wanted the screen sentence to equal the desk's sentence on each tab for a
metropolis and a village. Two halves compose to that, and this lane lands the half that is provable
without the gate and permanent: **a structural guard at the call site**, appended to
`tests/lint/dossierMountRegistry.walker.test.js` (the walker that already owns "exactly one caller
per desk"). Its reader is a pure source function, so it can be driven over the BASE BLOBS with plain
node — `node $SP/lane-fix-f-scratch/prove-arm4.mjs`, the reader body copied verbatim from the arm:

```
=== AGAINST THE BASE TREE (76be138a1) — the arm must be RED ===
call sites judged : 13
convictions       : 11
  ✗ DailyLifeTab.jsx · EconomicsTab.jsx ×2 · HistoryTab.jsx · OverviewTab.jsx · PlotHooksTab.jsx
  ✗ RelationshipsTab.jsx · ResourcesTab.jsx · ServicesTab.jsx · SteadingsSection.jsx · ViabilityTab.jsx

=== AGAINST THE WORKING TREE (this lane's cure) — the arm must be GREEN ===
call sites judged : 13
convictions       : 0

=== THE PLANTS ===
  src/components/plant/Good.jsx      judged 1  convictions 0
  src/components/plant/Bare.jsx      judged 1  convictions 1
  src/components/plant/Prose.jsx     judged 1  convictions 1
  src/components/plant/SpreadGood.jsx judged 1  convictions 0
  src/components/plant/SpreadBare.jsx judged 1  convictions 1
```

Eleven convictions against the base, exactly the eleven sites of §1 — so the arm sees the defect it
guards. Zero after the cure. The five plants prove it is not vacuous: a bare bag is convicted, a
carried noun is not, a `tierNoun` named only in a COMMENT buys nothing (`codeOnly` blanks it), and
the printed dossier's one-hop `...paid` idiom passes while the same idiom with the slot missing is
still convicted.

⭐ **The guard corrected me twice while I wrote it, and both corrections are in its docblock.** Its
first cut keyed the importer test on `new/economyDeskRead.js`, which the tabs never spell
(`'../economyDeskRead.js'`) — it would have judged the PDF alone and gone quietly green. Its second
cut demanded the literal key inside the call span and convicted `printProse.js`, which binds
`const paid = { …, tierNoun: tierNounFor(…) }` once and spreads it into BOTH desk reads so the two
cannot drift — better practice than the arm demanded, so the arm learned one hop.

### B. ⛔ A PRE-EXISTING RED AT THE BASE, IN A FILE THIS LANE NEVER TOUCHES

While re-addressing the prose-numerics baseline the scanner reported **24** moved rows, not the 23
this lane causes. The 24th is `src/domain/display/worldSnapshotPublic.js`, delta **+13**, and the
file is clean in this worktree. Established against the base blob, not the working copy
(`node $SP/lane-fix-f-scratch/base-drift-check.mjs`):

```
committed baseline rows for this file : [615]
scan of the BASE BLOB (76be138a1)     : [628]
scan of HEAD's blob                   : [628]
scan of the WORKING COPY              : [628]
file touched by this lane?            : (no — clean)
```

Attributed: `git log -- src/domain/display/worldSnapshotPublic.js` → the last car is **`668d87512`
("EM-B3a: the editor's two save-blob keys are veiled…", train EM-T3 wave 1)**, which added exactly
13 lines (`1 file changed, 13 insertions(+)`) and touched the baseline zero times; the last baseline
re-address, `1262e0054`, precedes it (`git merge-base --is-ancestor 1262e0054 668d87512` → YES).

⇒ **`tests/lint/proseNumerics.test.js`'s exact-identity arm is ALREADY RED on the integration branch
tip, for EM-B3a's reason, not this lane's.** Its message is `expect(LIVE.hits).toEqual(baseline)`.

**This lane did NOT absorb it.** `readdress-baseline.mjs` writes only rows whose `path` is one of
the two files FIX-F1 edits and prints the foreign row it refuses:

```
FOREIGN rows left untouched  : 1 [{"i":144,"path":"src/domain/display/worldSnapshotPublic.js","from":615,"to":628}]
rows whose LINE moved        : 24  (per file: DailyLifeTab 1, EconomicsTab 22, worldSnapshotPublic 1)
distinct deltas (mine)       : 1
```

JUDGMENT: re-addressed this lane's 23 rows and left EM-B3a's row alone, because re-addressing
another train's row from a parallel lane launders its miss and risks a composition conflict with the
slot, which holds that train. Say "take the 24th too" and it is a one-value edit with the identical
proof. Either way the arm stays red until that row is re-addressed by someone.

Diff proof for the 23 that ARE this lane's — the register's own demanded check, every changed diff
line grepped for anything that is not a `"line"` value:

```
$ git diff -U0 -- tests/lint/.prose-numerics-baseline.json | grep -E "^[+-]" | grep -v "^[+-][+-][+-]" | grep -v '"line":'
(no output)
$ git diff --stat -- tests/lint/.prose-numerics-baseline.json
 tests/lint/.prose-numerics-baseline.json | 46 ++++++++++++++++----------------
 1 file changed, 23 insertions(+), 23 deletions(-)
rows before/after: 218 218 · DailyLifeTab.jsx rows 1 deltas 1 · EconomicsTab.jsx rows 22 deltas 1
```

### C. Goldens after the last edit — unmoved

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

### D. The proof half this lane did NOT write, with its recipe

A DOM-level PAIR arm — render the tab at a village and a metropolis and assert the rendered text
carries the desk's spoken sentence and NOT the corpus's generic one. It is not written here because
the two hand fixtures the suites already carry cannot red it: `economicsTabFlow`'s `GROUND`
(`tier: 'village'`) moves only on WOVEN positions (`terrainIdentity`, `exploitation`), which the
backstop repairs on screen before the cure, and `generalDeskTabFlow`'s `SPEAKING` is a `town`, where
the substitution is identity by construction. A red-first DOM arm therefore needs a GENERATED
fixture, and writing one blind would cost the shared gate several round-trips.

The recipe, measured and ready to slot:
`generateSettlementPipeline({ settType: 'village', culture: 'germanic', tradeRouteAccess: 'road' }, null, { seed: 'fixf-village-germanic' })`
draws `economics.prosperityHeader` as *"Flachbrücke manages. The mix of field and market covers what
the town needs…"* without the bag and *"…what the village needs…"* with it — the RAW-rendered
position, on the tab the leak actually shipped on. The metropolis arm is the same call with
`settType: 'metropolis'`, seed `fixf-metropolis-germanic`.

---

# FIX-F2b — THE SLOT RENAME'S BLAST RADIUS (the chair's ruling of 2026-09-19; measured, ungated)

**Headline: the rename is prose-neutral and NO golden or manifest cell key can see it. NOT a STOP.**
Sixteen source occurrences across three files, 64 bytes; forty sentences rendered both ways with
zero byte differences; no cell key anywhere includes a slot name. The contract surface is the corpus
document and eight kind-pool walkers, exactly as the stop said.

## 1. Every site that spells the slot — 16, in three files

```
$ git grep -n "weight" -- src/domain/worldPulse/{dispositionNews,warReceiptPools,eventProse}.js
dispositionNews.js:88,89,93,94,98,99,103,104   the CHANNEL_SURFACE table's key   (8, value 'more'/'less')
warReceiptPools.js:129,136,143,151             the template read `${x.weight}`   (4)
eventProse.js:301,303,305,307                  `requiredSlots` entry `['weight']` (4)
```

Counted mechanically: `surface keys 8 · template reads 4 · requiredSlots 4 = 16 occurrences,
64 bytes added` (`weight` → `weightWord`, 4 chars each). Nothing else in `src/` spells this slot;
the other files matching `weight` carry `fontWeight` and unrelated engine fields.

**Outside `src/`:** three test fixtures spelling the slot in a bag
(`tests/lint/phrasedKindPools.walker.test.js:60/140/157`, `tests/domain/eventProse.test.js:44`,
`tests/domain/phraseRepetition.test.js:26`) and the corpus document
`docs/content/RECEIPT_POOLS_LEGACY.md:201/204/420/439/458/478` — four of those six being the
`` `requiredSlots: ['weight']` `` annotations parsed under contract by `tests/helpers/receiptAnnex.js`
(`:70` `LEGACY_ANNEX`, `:78` `REQUIRED_SLOTS_RE`, `:153` throws when a live row declares none),
which feeds `commercialKindPools`, `faithKindPools`, `envoyKindPools`, `sovereigntyKindPools`,
`informationKindPools`, `chanceMeetingKindPools`, `grammarLifecycleKindPools` and
`tests/domain/treatySuccessionDossier.test.js`.

## 2. Does ANY rendered string change? — NO, executed

`node $SP/lane-fix-f-scratch/measure-f2b-rename.mjs` renames the two modules IN MEMORY, loads both
variants, and renders every member of the four disposition pools under both slot bags and both
directions:

```
sentences rendered both ways : 40
BYTE DIFFERENCES             : 0

the four slot-bearing sentences, rendered under the RENAMED module:
  The muster carries more weight in council than it did a generation ago.
  The quays carry more weight in council than they did before.
  The treaty table carries more weight in council than it did before.
  The roads beyond the walls carry more weight in council than they once did.
```

A slot's NAME is internal; only its VALUE (`'more'` / `'less'`) is emitted, and the value does not
move. CONFIRMED.

## 3. Can a golden or a manifest CELL KEY see a slot name? — NO. (The chair's STOP question.)

- **Generator golden.** `tests/helpers/goldenMasterCorpus.js:60` —
  `keyOf = (c) => [c.settType, c.culture, c.terrainOverride, c.tradeRouteAccess, c.monsterThreat, c._seed].join('|')`.
  Six config fields. **No slot name.**
- **Dossier prose manifest.** A cell's piece is `{ role: 'spine', key: rung.poolKey, vid, index, face }`
  (`tests/helpers/dossierManifest.js:245`) — the key is the POOL key, **not a slot name**. That
  manifest is also built only from `src/data/dossierStateProse/*.generated.js` leaves
  (`dossierCorpus.loadStateLeaves`), and its helper imports name no `worldPulse` module, so these
  pools are not in its population at all.
- **Direct probe of both goldens:** `grep -c '"weight"'` → `0` and `0`; `grep -rl "weight in council" tests/fixtures/`
  → nothing; `grep -rl '"weight"' tests/fixtures/` → nothing. No fixture in the estate serialises
  this slot name or its sentences.

⇒ **Not a STOP.** Zero rows counted, because zero rows can move.

## 4. The byte effect on a budgeted chunk

64 source bytes, in property names, which a minifier does not mangle — so ~64 bytes in the bundle
too. Against the ceilings that could see it:

- `tests/build/engineChunkLazy.test.js:67` — `expect(size).toBeLessThan(1_400_000)`, a
  "heavy dep snuck in" tripwire with headroom by design. 64 bytes is noise against it.
- `tests/build/generationWorkerLazy.test.js` — `WORKER_BUNDLE_CEILING_BYTES = 1401208`, the
  monotone-down mint. Its own text mentions `worldPulse` **zero** times; these pools are tick-time,
  not generation. PLAUSIBLE that they are outside that closure (a build settles it, and the F2b car
  runs one); CONFIRMED only that the test names no worldPulse module.
- `tests/build/campaignRuntimeLazy.test.js` carries TIME budgets, not byte ceilings.

No ceiling is raised by this car, and none needs to be.

## 5. What the F2b car therefore contains

1. `weight` → `weightWord` at all 16 src sites, plus the 3 test fixtures and the 6 corpus-document
   rows (the annex's `requiredSlots` annotations and the `{weight}` slot markers) — under the corpus
   ritual, since `receiptAnnex.js` parses that document under contract.
2. `'weight'` joins `FLOAT_TOKENS` in `tests/helpers/proseNumericsWalk.js` — **with zero arriving
   hits**, so `REVIEWED_TOTAL_CEILING = 218` and every category ceiling stay exactly where they are
   and no row is banked. (Re-measured after the rename by re-running `measure-f2.mjs`.)
3. `tests/lint/proseNumerics.test.js:464`'s stale citation corrected: there is no function
   `namesAScalar`; the regex it means is the unnamed one inside `hasTwoDecimalToken` at
   `proseNumericsWalk.js:515`. The note's surrounding paragraph — which says adding the token is not
   a lane's call and that a ceiling may never be raised — is then DISCHARGED rather than deleted,
   because the rename is what lets the token land with no ceiling movement.

The car's gate: `tests/lint` whole, the eight kind-pool walkers, `tests/domain/eventProse.test.js`,
`tests/domain/phraseRepetition.test.js`, `tests/helpers/receiptAnnex.test.js`, and one build.
