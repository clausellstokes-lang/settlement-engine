# RECEIPT — lane S12A-CHECKPAIR (the two checker gaps + the crosscheck label)
⟦Chair: Fable 5.1 · Lane: Opus 5 (S12A-CHECKPAIR) · KIT-ONLY — no repo change, no dock change, no commit · 2026-09-06⟧

STATUS: **COMPLETE**, with ONE acceptance line REFUSED WITH MEASUREMENT (ill-1; §4 below) and ONE
control blocked by a PRE-EXISTING arm outside my brief (ctl-6; §6 below).

FENCES HELD (verified in-shell at the end of the lane):
- dock `laneOSR18` HEAD `fd36f0298`, `git status --porcelain` = 0 lines — never edited, no vitest, no npm.
- `check-pair.v1.mjs` written once and never touched again — `shasum 67921d6df92345ebf3fe06b924a38fc108058199`, identical to the pre-change `check-pair.mjs`.
- `pairs-illustration-2026-09-05.json` NOT modified (mtime still Sep 5 21:40); `PROBE_ALL.md` NOT modified (mtime still Sep 6 08:26).
- scratch confined to `$SC/s12a-scratch/`.

FILES CHANGED (kit only): `prose-research/check-pair.mjs` (59 → 132 lines) · `prose-research/probe-all/crosscheck.mjs` (line 10)
FILES ADDED (kit): `prose-research/check-pair.v1.mjs` · `prose-research/pairs-s12a-controls.json`

---

## 1 · THE PREMISE RE-DERIVED FIRST: the pool-key grammar (708 keys, 68 blocks)

`s12a-scratch/measure-grammar.mjs` over the six state leaves, EXIT=0:

```
KEY GRAMMAR over 708 pool keys in 68 blocks:
  colon form  "<AXIS>: <band>"      346
  axis-run    "<axis words> <BAND>" 209
  bare label  (no derivable axis)   153
  axis-run examples: readiness STRONG  ->  axis "readiness" | terrain FAVOURABLE to the defender  ->  axis "terrain" | strategic value HIGH -> axis "strategic value"
  bare examples: Very Safe | Safe | Moderate | Unsafe | Dangerous | COMPOUND override (a crisis stress has rewritten the label)

blocks with exactly ONE pool (no siblings at all): 1 -> DS-WAR-3
pool keys with >=1 sibling key in the block: 707/708
pool keys with >=1 SAME-AXIS sibling:        444/708
```

**How "sibling band" is derived** (`axisOf` in the new file, comment block at lines 44-56):
- colon key → axis = the text before the first `:` (`Invasion & War`, `QUANTITY`, `TERRAIN`);
- all-lowercase key → axis = the FIRST word (`band surplus`/`band adequate` → `band`; `capture none` → `capture`);
- mixed key → axis = the leading run of lowercase words (`terrain FAVOURABLE to the defender` → `terrain`; `strategic value HIGH` → `strategic value`);
- key opening on a capital → NO derivable axis (`Very Safe`, `SUBSISTENCE`, `WALLED-QUIET`) — and a bare-label
  block IS one band ladder, so every sibling counts as a band.
`bandSiblingsOf(h)` = the same-axis siblings when the grammar yields any (444/708 keys), otherwise A8's
letter — every sibling key of the same block. So "the located pool has sibling bands" ⟺ the block has ≥2 pools.

## 2 · A MEASURED CORRECTION TO THE BRIEF'S DIAGNOSIS

The brief says "the R4 arm greps sibling-key WORDS only" and frames the gap as keys-vs-bands. Measured:

```
BAND TOKENS of sibling keys already inside the v1 R4 sibWords set: 21080/25687   (82.1%)
  band-token word types the v1 arm CANNOT see (len<=3 or stoplisted): a all an and any arc are arm at be
  but by can dry dst f fed few for gap got has hub in is it its low net no nor not npc of off old on one
  or out own r ref run s set so t tax the to top two war way
```

In this corpus the band token IS a word of the key string, so v1's key-grep **already covers 82% of band
tokens**; the 4,607 it misses are almost all function words (the only substantive ones are `low`, `war`,
`old`, `dry`, `gap`, `hub`, `tax`, `run`). **The gap the refuter found is therefore not lexical, it is
semantic** — "found" (ill-2) shares no word with `terrain FAVOURABLE to the defender` or with any of that
band's three variant texts, and "widening" (ill-1) shares no word with `readiness STRONG/ADEQUATE/CRITICAL`.
I verified both by scanning every DS-DEF-1 variant. This is why the chair's *withholding* cure is the right
one and a lexical arm cannot replace it.

## 3 · WHAT THE TWO NEW ARMS DO

**R4-BAND (a third verdict class, WITHHELD — never a FAIL).** When the AFTER removes a contrast SHAPE
(`shape(before) > shape(after)`, or the v1 "rather than" NOTE condition) and the located pool has sibling
bands, the mechanical PASS is withheld and the sibling bands are named. `"contrastWaived": "<reason>"` on the
pair converts the withholding into a visible NOTE carrying the refuter's reason.
Second line, **R4-BAND-TEXT** — diagnostic only, never moves a verdict: the cut alternative's content words
are matched against the TEXT of every sibling pool's variants (A8's letter is "of the same block"), and up to
three matching sibling variants are named. Proven live twice: controls `ctl-8` and smoke `#30` (§7).

**A11 POOL SPREAD.** The pool's other variants are loaded at corpus-load time (`poolId`/`idx`; causal arrays
get a unique poolId per array so two `*` keys never merge). On every located pair the checker prints the
sentence-count spread `before → after` as a receipt line. FAIL when the counts were not all equal before and
are all equal after. Openers = the first two words with `{slot}` normalised to `{}`: FAIL when the AFTER
creates a collision the BEFORE did not have; any collision already standing in the pool is a NOTE naming the debt.

## 4 · THE FIXTURE, BEFORE AND AFTER (verbatim, exits captured in-shell)

BEFORE — `node check-pair.mjs $SC/laneOSR18 pairs-illustration-2026-09-05.json`, EXIT=0:
```
    #ill-1 PASS(mechanical) DS-DEF-1 :: readiness WEAK [unfolding]
    #ill-2 PASS(mechanical) DS-DEF-1 :: terrain EXPOSED [visitor]
    #ill-3 PASS(mechanical) DS-DEF-1 :: readiness ADEQUATE [street]
    #ill-4 PASS(mechanical) DS-DEF-2 :: Invasion & War: walls AND professional garrison [ledger]
    #ill-5 PASS(mechanical) DS-DEF-1 :: terrain EXPOSED [street]
    
    corpus loaded: 2734 variants; 5 pass mechanically, 0 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```

AFTER — same command, same fixture (unmodified), EXIT=0:
```
    #ill-1 WITHHELD(R4-BAND) DS-DEF-1 :: readiness WEAK [unfolding]
        ! R4-BAND: a contrast was cut in a pool with sibling bands "readiness STRONG" | "readiness ADEQUATE" | "readiness CRITICAL"; the band half is the refuter's — mechanical PASS withheld
        · A11 SPREAD (sentences, pool "readiness WEAK" DS-DEF-1, angles ledger/visitor/unfolding): 2/1/2 → 2/1/2
    #ill-2 WITHHELD(R4-BAND) DS-DEF-1 :: terrain EXPOSED [visitor]
        ! R4-BAND: a contrast was cut in a pool with sibling bands "terrain FAVOURABLE to the defender"; the band half is the refuter's — mechanical PASS withheld
        · A11 SPREAD (sentences, pool "terrain EXPOSED" DS-DEF-1, angles visitor/ledger/street): 2/2/1 → 2/2/1
    #ill-3 PASS(mechanical) DS-DEF-1 :: readiness ADEQUATE [street]
        · A11 SPREAD (sentences, pool "readiness ADEQUATE" DS-DEF-1, angles ledger/visitor/street/threshold): 2/1/1/2 → 2/1/2/2
        · A11 PRE-EXISTING shared opener in this pool (a debt this pair neither causes nor cures): "{} is" (ledger + threshold)
    #ill-4 PASS(mechanical) DS-DEF-2 :: Invasion & War: walls AND professional garrison [ledger]
        · A11 SPREAD (sentences, pool "Invasion & War: walls AND professional garrison" DS-DEF-2, angles ledger/visitor/street): 1/1/1 → 2/1/1
    #ill-5 FAIL DS-DEF-1 :: terrain EXPOSED [street]
        - A11 POOL SPREAD FLATTENED: 2/2/1 → 2/2/2 — every variant of the pool now has the same sentence count where they differed
        · A11 SPREAD (sentences, pool "terrain EXPOSED" DS-DEF-1, angles visitor/ledger/street): 2/2/1 → 2/2/2
    
    corpus loaded: 2734 variants in 1020 pools; 2 pass mechanically, 2 WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), 1 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```

| pair | before | after | the arm that fired |
|---|---|---|---|
| ill-1 | PASS | **WITHHELD(R4-BAND)** | R4-BAND — **the brief predicted PASS; see the refusal below** |
| ill-2 | PASS | **WITHHELD(R4-BAND)** | R4-BAND, naming `terrain FAVOURABLE to the defender` ✓ as specified |
| ill-3 | PASS | PASS | A11 spread NOTE `2/1/1/2 → 2/1/2/2` + A11 pre-existing opener NOTE `"{} is" (ledger + threshold)` ✓ exactly as specified, no FAIL |
| ill-4 | PASS | PASS | A11 spread NOTE `1/1/1 → 2/1/1` only ✓ |
| ill-5 | PASS | **FAIL** | A11 POOL SPREAD FLATTENED `2/2/1 → 2/2/2` ✓ as specified |

### ⛔ REFUSED WITH MEASUREMENT: the acceptance line "ill-1 keeps its previous verdict"

The chair's proposed mechanism and the chair's acceptance criteria are **inconsistent**, and the
mechanism is the load-bearing half, so I implemented the mechanism and am reporting the conflict.

- ill-1's BEFORE carries `rather than` (shape 1); its AFTER carries none (shape 0). The shape drop fires.
- ill-1's pool `readiness WEAK` HAS sibling bands: `readiness STRONG`, `readiness ADEQUATE`, `readiness CRITICAL`
  (same axis `readiness`). So the rule as written withholds ill-1 exactly as it withholds ill-2.
- **No lexical arm can separate them.** Measured over every DS-DEF-1 variant: `widening` appears in 0 sibling
  keys and 0 sibling variant texts; `found` appears in 0 sibling keys and 0 sibling variant texts. The refuter
  separated them by *meaning* ("found is precisely what favourable terrain gives"), which is the half the brief
  itself assigns to the refuter.

  The separation claim is CONFIRMED, not reasoned — executed over every DS-DEF-1 variant, EXIT=0:
```
"widening" (own pool "readiness WEAK") -> sibling KEYS matching: 0 [] ; sibling VARIANT TEXTS matching: 0 []
"found" (own pool "terrain EXPOSED") -> sibling KEYS matching: 0 [] ; sibling VARIANT TEXTS matching: 0 []
DS-WAR-3 variants: 5 carrying a contrast SHAPE: 0
```
- The withholding is **not a FAIL** and ill-1's PASS is recoverable through the escape the chair specified:
  with the refuter's own recorded reason as `contrastWaived`, ill-1 returns to PASS (proven as `ctl-1`, §5).
  I did NOT edit the fixture to add it; the chair should rule whether the fixture gains the waiver.

**The consequence the chair must weigh, measured:** of 2,266 state variants, **313 carry a contrast shape and
all 313 sit in a pool with sibling keys**. So under this rule *every* cut of a contrast in the state corpus is
withheld — i.e. B0.1's headline cure ("the rather than tic goes first") can never reach a mechanical PASS
without a written `contrastWaived` from the refuter. That is defensible (withheld ≠ failed, and it forces the
band judgment to be recorded) but it is a policy, not an accident, and it is the chair's to ratify.

## 5 · POSITIVE CONTROLS — `prose-research/pairs-s12a-controls.json`

Built by `s12a-scratch/build-controls.mjs` (EXIT=0). Every BEFORE is pulled **verbatim from the loaded corpus
or from the illustration fixture** — never retyped — and every cut-only AFTER is a string replace on that
BEFORE, so no transcription can drift. ctl-1…ctl-5 are the refuter's five proposed cures against the same
BEFOREs; ctl-6…ctl-8 are the synthetics.

`node check-pair.mjs $SC/laneOSR18 pairs-s12a-controls.json`, EXIT=0:
```
    #ctl-1 PASS(mechanical) DS-DEF-1 :: readiness WEAK [unfolding]
        · CONTRAST WAIVED by the refuter: refuter, ill-1: "widening" names neither readiness STRONG/ADEQUATE/CRITICAL nor terrain/strategic value — no sibling key or band names the rejected alternative (A8).  (sibling bands: readiness STRONG | readiness ADEQUATE | readiness CRITICAL)
        · A11 SPREAD (sentences, pool "readiness WEAK" DS-DEF-1, angles ledger/visitor/unfolding): 2/1/2 → 2/1/2
    #ctl-2 PASS(mechanical) DS-DEF-1 :: terrain EXPOSED [visitor]
        · A11 SPREAD (sentences, pool "terrain EXPOSED" DS-DEF-1, angles visitor/ledger/street): 2/2/1 → 2/2/1
    #ctl-3 PASS(mechanical) DS-DEF-1 :: readiness ADEQUATE [street]
        · A11 SPREAD (sentences, pool "readiness ADEQUATE" DS-DEF-1, angles ledger/visitor/street/threshold): 2/1/1/2 → 2/1/2/2
        · A11 PRE-EXISTING shared opener in this pool (a debt this pair neither causes nor cures): "{} is" (ledger + threshold)
    #ctl-4 PASS(mechanical) DS-DEF-2 :: Invasion & War: walls AND professional garrison [ledger]
        · A11 SPREAD (sentences, pool "Invasion & War: walls AND professional garrison" DS-DEF-2, angles ledger/visitor/street): 1/1/1 → 2/1/1
    #ctl-5 PASS(mechanical) DS-DEF-1 :: terrain EXPOSED [street]
        · A11 SPREAD (sentences, pool "terrain EXPOSED" DS-DEF-1, angles visitor/ledger/street): 2/2/1 → 2/2/1
    #ctl-6 FAIL CAUSAL :: * [visitor]
        - MARKS ["receiving"]
        · R4-BAND n/a: the located pool has NO sibling bands — a contrast may be cut here (A8)
        · A11 SPREAD (sentences, pool "*" CAUSAL, angles street/ledger/visitor/street/counterforce/counterforce): 1/1/1/1/1/1 → 1/1/1/1/1/1
        · A11 PRE-EXISTING shared opener in this pool (a debt this pair neither causes nor cures): "{} at" (street + counterforce)
    #ctl-7 FAIL DS-DEF-1 :: terrain EXPOSED [ledger]
        - A11 SHARED OPENER CREATED: the AFTER now opens "the town", matching street in the same pool (the BEFORE opened "the site")
        · A11 SPREAD (sentences, pool "terrain EXPOSED" DS-DEF-1, angles visitor/ledger/street): 2/2/1 → 2/2/1
    #ctl-8 WITHHELD(R4-BAND) DS-DEF-1 :: strategic value LOW [counterforce]
        ! R4-BAND: a contrast was cut in a pool with sibling bands "strategic value HIGH"; the band half is the refuter's — mechanical PASS withheld
        !   R4-BAND-TEXT: the cut alternative names a word of a sibling band's own TEXT — "readiness ADEQUATE" [visitor] shares walls
        · A11 SPREAD (sentences, pool "strategic value LOW" DS-DEF-1, angles counterforce/ledger/street): 1/2/1 → 1/2/1
    
    corpus loaded: 2734 variants in 1020 pools; 5 pass mechanically, 1 WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), 2 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```

| control | expected | measured | note |
|---|---|---|---|
| ctl-1 (ill-1 cure) | PASS | **PASS** | only with `contrastWaived`; without it the raw arm withholds (§6) |
| ctl-2 (ill-2 cure) | PASS | **PASS** | keeps `rather than`, so no contrast is cut — the arm correctly stays silent |
| ctl-3 (ill-3 cure) | PASS | **PASS** | spread `2/1/1/2 → 2/1/2/2`, pre-existing opener NOTE only |
| ctl-4 (ill-4 cure) | PASS | **PASS** | spread `1/1/1 → 2/1/1` (B0.4's rhythm cure, kept) |
| ctl-5 (ill-5 cure) | PASS | **PASS** | spread preserved at `2/2/1` — the pool's short form survives |
| ctl-6 (contrast cut, NO sibling bands) | PASS | **FAIL — on a pre-existing arm** | §6 |
| ctl-7 (a shared opener added) | FAIL | **FAIL**, and only on the opener arm | `the AFTER now opens "the town", matching street` |
| ctl-8 (alternative names a sibling band's TEXT) | WITHHELD + named | **WITHHELD**, `R4-BAND-TEXT … "readiness ADEQUATE" [visitor] shares walls` | proves the second line is not dead code |

## 6 · ctl-6: NEITHER THE ARM NOR THE CURE IS WRONG — A PRE-EXISTING ARM IS

ctl-6's job is to prove the arm does NOT withhold where no sibling band exists. **It proves exactly that** —
the run prints `R4-BAND n/a: the located pool has NO sibling bands — a contrast may be cut here (A8)` and no
withholding. It still reports FAIL, on v1's `MARKS` finding, which is unrelated to both gaps.

The control cannot be built any other way. Measured:
- The one state block with no siblings, **DS-WAR-3**, carries **no contrast shape in any of its 5 variants**.
- Of the 33 causal variants carrying `rather than`, **0 are unmarked** — because **all 468 causal variants carry marks**.

```
state variants 2266 marked 186 | causal variants 468 marked 468
mark vocabulary: dm-only 89 · home 41 · payer 21 · minor 20 · major 20 · anchored 19 · split 18 · receiving 14 · …
```

**⚠ FINDING FOR THE CHAIR (v1 behaviour, deliberately NOT changed — it moves verdicts outside my brief):**
`check-pair.mjs` pushes `MARKS […]` into the FAIL channel, so **654 of 2,734 variants (23.9%) — every causal
variant and 186 state variants — can never mechanically pass, whatever the rewrite says**. Only 89 of those
marks are `dm-only`; the rest (`home`, `payer`, `receiving`, `anchored`, …) are role labels, not audience laws.
By the same logic that justifies R4-BAND, a `dm-only` mark is a WITHHOLD and a role mark is a NOTE.
The change is one word. **Verified in a scratch copy that the kit file does NOT carry**
(`s12a-scratch/check-pair.marks-as-note.mjs`, `r.push('MARKS ` → `notes.push('MARKS `), EXIT=0:
```
#ctl-6 PASS(mechanical) CAUSAL :: * [visitor]
    · MARKS ["receiving"]
    · R4-BAND n/a: the located pool has NO sibling bands — a contrast may be cut here (A8)
…
corpus loaded: 2734 variants in 1020 pools; 6 pass mechanically, 1 WITHHELD (R4-BAND …), 1 fail
```
With MARKS demoted, ctl-6 PASSES and the control set reads 6 pass / 1 withheld / 1 fail (ctl-7, as designed).

## 7 · REGRESSION: the other kit fixture, v1 vs v2 (`pairs-smoke.json`, both EXIT=0)

Every v1 FAIL stays a FAIL with identical findings; nothing that failed now passes. One verdict moves:
`#1` PASS → WITHHELD (its rewrite cut a contrast in a pool with `QUANTITY:` sibling bands) — the arm working.
`#30` shows the two R4 arms together: the v1 key-grep catches `decline`, and R4-BAND-TEXT independently names
`"QUANTITY: thousands" [visitor] shares decline`. Full outputs at `s12a-scratch/smoke.v1.out` / `smoke.v2.out`.

## 8 · ITEM 2 — the crosscheck label

Both figures measured directly from the corpus the script reads (identical in both work copies,
`sweep/bible-work/corpus.json` and `sweep/refute-extractors-work/corpus.json`):

```
rows total: 34527  R1+R2 rows: 2729  occurrences: 294  variants containing: 288
```

So **294 is the OCCURRENCE count** (`m.pet['rather than']`, metrics.mjs:78 sums matches per text) and
**288 is the VARIANT count** (`shp.ratherThan`, metrics.mjs:81 counts texts) — confirming
`PROBE_ALL_CORRECTIONS_RECEIPT.md:171,189`. Note the variant count must NOT be recovered from
`m.shapesRate.ratherThan * m.variants`: the rate is rounded to 3 places (`r3`, metrics.mjs:116), and
`0.106 × 2729` rounds to **289**, not 288. The patch counts it from `ds` directly.

BEFORE (`node probe-all/crosscheck.mjs` from `sweep/bible-work`):
```
rather than: 294 (dossier 288, 10.5%) rate 0.106
```
AFTER (EXIT=0):
```
rather than: occurrences 294 (no published counterpart) · variants containing it 288 (dossier 288 — this is the figure §2c ruled correct) rate 0.106
```
`PROBE_ALL.md` untouched, as the brief requires.

---

## RETROVALIDATION ROW

- **What was judged (mine, Opus 5, Fable-unvalidated):**
  1. The derivation of "sibling band" from the measured key grammar (axis prefix; bare-label blocks are one ladder;
     same-axis set where the grammar gives one, else A8's block-wide letter).
  2. That the chair's R4-BAND rule and the chair's acceptance line for ill-1 cannot both hold, and that the RULE
     wins — ill-1 is withheld, and its PASS is restored only by a recorded `contrastWaived`.
  3. That R4-BAND-TEXT is a diagnostic that never moves a verdict, and that it scans ALL sibling pools (A8's letter)
     rather than the tight same-axis set.
  4. That v1's `MARKS`-as-FAIL is a real defect but NOT mine to change; left in place, demonstrated in scratch.
  5. That the opener normalises `{slot}` → `{}` rather than keeping the slot name.
- **What the Fable chair must re-derive:**
  1. **Ratify or amend the ill-1 outcome** — either the fixture gains the refuter's `contrastWaived` for ill-1
     (my recommendation; the reason is already written in `refute-illustration-2026-09-05.md`), or the rule is
     narrowed with a discriminator I could not find lexically. **This is the one owner-visible behaviour change.**
  2. **Ratify the policy consequence:** 313/313 contrast-bearing state variants sit in pools with siblings, so
     every `rather than` cut in the reconstruction wave will be WITHHELD until a waiver is written.
  3. **Rule on the MARKS channel** (§6): 654/2,734 variants (23.9%) are currently un-passable. One-word change,
     verified in scratch, NOT applied.
  4. Re-derive `288` vs `294` if any figure downstream cites the crosscheck line.
- **Receipts by path:**
  `prose-research/check-pair.mjs` (v2) · `prose-research/check-pair.v1.mjs` (untouched original, sha 67921d6d…) ·
  `prose-research/pairs-s12a-controls.json` · `prose-research/probe-all/crosscheck.mjs` ·
  `s12a-scratch/{measure-grammar.mjs,measure-grammar.txt,poolkey-grammar.{mjs,txt},dump-block.mjs,build-controls.mjs}` ·
  `s12a-scratch/{fixture.v1.out,fixture.v2.out,controls.v2.out,controls-marksnote.out,smoke.v1.out,smoke.v2.out,crosscheck.v1.mjs,crosscheck.after.out}` ·
  `s12a-scratch/{pairs-s12a-controls.nowaiver.json,check-pair.marks-as-note.mjs}`
- **Priority:** (1) the ill-1 ratification — HIGH, it decides whether the taste sample can be signed off as
  "5 pass mechanically"; (2) the MARKS ruling — HIGH, it silently blocks a quarter of the corpus from ever
  passing; (3) the 313/313 policy — MEDIUM, it shapes the whole reconstruction wave's workflow;
  (4) the crosscheck label — DONE, no further act owed.

