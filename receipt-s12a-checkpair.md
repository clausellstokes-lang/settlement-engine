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

**⛔ CLOSED 2026-09-06 by chair ruling R2 — see §“R2 APPLIED” at the foot of this receipt.**
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

> ⛔ **SUPERSEDED by §“RE-RUN 3” below.** The sentence “nothing that failed now passes” held for v2 pre-R2 only;
> after R2, smoke `#11` moves FAIL → PASS(mechanical). Read the table in RE-RUN 3 for the current verdicts.

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

---

# R2 APPLIED — 2026-09-06 (lane S12A-R2)
⟦Chair: Fable 5.1 · Lane: Opus 5 (S12A-R2) · KIT-ONLY — no repo change, no dock change, no commit⟧

STATUS: **COMPLETE.** R1 ratified with nothing to build; R2 applied, and the three fixtures re-run with
every exit captured in-shell. **One verdict moves in the whole kit: smoke `#11` FAIL → PASS(mechanical),
and control `ctl-6` FAIL → PASS(mechanical) as the chair required.** Nothing else changed anywhere.

FENCES HELD (verified in-shell at both ends of the lane):
- dock `laneOSR18` HEAD `fd36f0298b1ead15f2a80eff83dafb92114a7ea4`, `git status --porcelain` = **0 lines**,
  on arrival and at the end — never edited, never entered for a write, no vitest, no npm.
- `check-pair.v1.mjs` re-verified untouched: `shasum 67921d6df92345ebf3fe06b924a38fc108058199`, byte-identical
  to the sha the predecessor recorded.
- The three fixtures are unmodified: `pairs-illustration-2026-09-05.json` mtime still Sep 5 21:40,
  `pairs-smoke.json` still Sep 5 19:10, `pairs-s12a-controls.json` still Sep 6 14:23. `PROBE_ALL.md` still Sep 6 08:26.
- Every write of this lane landed under `$SC/prose-research/check-pair.mjs` and `$SC/s12a-scratch/`. **No path
  under `/Users/cstokes/Desktop/settlement-engine` was written** (that tree's 5,612 dirty porcelain lines are
  the owner's and other lanes' pre-existing state, untouched by me and not a claim I make about its cleanliness).

FILE CHANGED (kit only): `prose-research/check-pair.mjs` — sha `80d20b3c5f4aab8a40a0cd56289665d498624cbb` → `7b247d6d0819135c2c12fbd0d8bff386c9ad0f96`.
Pre-change backup for the inverse edit: `s12a-scratch/check-pair.pre-r2.bak.mjs` (sha `80d20b3c…`).

## R1 · RATIFIED — NOTHING TO BUILD, AND NOTHING WAS NARROWED

The chair ratified the R4-BAND withholding policy **unnarrowed**: every cut contrast in a pool with sibling
bands is WITHHELD until the pair carries `"contrastWaived"`. No code path was touched — `bandSiblingsOf`,
the `CONTRAST` shape test and the waiver escape are exactly as the predecessor lane left them, and the
fixture run below is **byte-identical** to the pre-R2 run (`diff` EXIT=0, §"fixture" receipt). Recorded as
ratified: ill-1 and ill-2 both stay WITHHELD, and the 313-of-313 consequence stands as ratified policy.

## R2 · THE DIFF — ONE WORD, ONE CODE LINE

```diff
--- s12a-scratch/check-pair.pre-r2.bak.mjs
+++ prose-research/check-pair.mjs
@@ -59,7 +63,7 @@
   if (!h) r.push('NOT LOCATED in the dossier corpus (state+causal)');
-  if (h && h.marks.length) r.push('MARKS ' + JSON.stringify(h.marks) + (h.marks.includes('dm-only') ? ' — dm-only: the AFTER inherits the mark and the audience law' : ''));
+  if (h && h.marks.length) notes.push('MARKS ' + JSON.stringify(h.marks) + (h.marks.includes('dm-only') ? ' — dm-only: the AFTER inherits the mark and the audience law' : ''));
```

`r.push(` → `notes.push(`. **The dm-only sentence is kept verbatim** — the string
`' — dm-only: the AFTER inherits the mark and the audience law'` is unchanged, character for character; it now
prints on the NOTE line (`·`) instead of the FAIL line (`-`). Nothing else in the expression moved.

**Proof it is the scratch-verified fix and not a retype:** the edited file is byte-identical, in code, to
`s12a-scratch/check-pair.marks-as-note.mjs` (the copy §6 verified) —
`diff <(grep -v '^//' check-pair.mjs) <(grep -v '^//' check-pair.marks-as-note.mjs)` **EXIT=0**. Immediately
after the edit and before the header comment, the whole files matched: `cmp` **EXIT=0**, both sha `6a57d0290956b3c1578f2b096f27f884d1a76db5`.
`node --check` **EXIT=0**.

**One judgment call, vetoable (mine):** I also added a four-line `R2 (…)` provenance block to the file header,
because the file's own convention already carries a dated `v2 (lane S12A-CHECKPAIR, 2026-09-06)` block and a
reader of a file with two shipped versions needs to see why MARKS is a note. It is comment-only. Proven
inert: after adding it, all three fixtures were re-run and each output is byte-identical to the capture taken
before it (`IDENTICAL_TO_POST_R2_CAPTURE=YES` ×3, all `RUN_EXIT=0`). Revert it by deleting the four `//` lines
if the chair wants the file byte-equal to the scratch copy.

## R2 · THE CHAIR'S CITED FIGURES, RE-DERIVED BEFORE ACTING (not taken on trust)

`s12a-scratch/marks-census-r2.mjs`, over the same six leaves through the same loader, EXIT=0:

```
    variants total 2734 | state 2266 causal 468
    variants carrying ANY mark: 654 (23.9%)  — BEFORE R2 these could never mechanically pass
      of them, carrying 'dm-only': 89 (3.3% of the corpus)
      role-label-only (marked, no dm-only): 565
    mark vocabulary: dm-only 89 · home 41 · payer 21 · minor 20 · major 20 · anchored 19 · split 18 · receiving 14 · not anchored 13 · seat 12 · no deficit 11 · deficit 11 · origin 11 · catastrophic 10 · bound 9 · aggrieved 6 · claimant 6 · pressed 6 · marching 6 · principled 6 · knowing 6 · market 6 · proposer 6 · seated 6 · court 6 · adopting 6 · learning 6 · crowded 6 · bought 6 · negotiating 6 · successor 6 · contributor 6 · neutral 6 · embargoed 6 · host 6 · extracted 6 · called 6 · refuser 6 · refounded 6 · cornered 6 · gouged 6 · suppressor 6 · petitioned 6 · signatory 6 · occupied 5 · emptied 5 · discounted 5 · hungry 5 · growing 5 · reading 5 · patron 5 · rushed 5 · sweeping 5 · run 5 · opener 5 · turncoat 5 · razer 5 · creditor 5 · charged 5 · mark 5 · author 5 · disavower 5 · burier 5 · closer 4 · emptying 4 · misread 4 · party 4 · granting 4 · recognised 4 · strike 4 · victor 3 · funding 3 · interdictor 3 · severed 3 · cut 2 · owed 2 · reader 2 · broker-town 2 · granted 2 · recogniser 2 · mover 2 · counterparty 2 · occupier 1 · neighbour 1 · holder 1 · surplus 1 · unlensed 1 · secular 1 · sending 1 · watched 1 · spared 1 · answered 1 · abandoned 1 · razed 1 · defaulter 1 · held 1 · destination 1 · target 1 · misled 1
    AFTER R2: variants blocked from a mechanical PASS by the MARKS arm: 0 (the arm is a NOTE; it never enters the fail list)
```

The ruling's two load-bearing numbers are **CONFIRMED**: 654 of 2,734 (23.9%) marked, of which **89 dm-only**
and **565 role-label-only**. The chair's reading is the one the corpus supports — 86% of the blocked variants
carry no audience law at all, only a role label such as `home`, `payer` or `receiving`.

## RE-RUN 1 · THE FIXTURE — `pairs-illustration-2026-09-05.json` (unmodified), EXIT=0

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

**`diff` against the pre-R2 run: EXIT=0 — byte-identical.** No pair in the illustration fixture carries a
mark (all five are DS-DEF state variants), so R2 is provably inert here and R1's verdicts are untouched:
ill-1 and ill-2 WITHHELD(R4-BAND), ill-3 and ill-4 PASS with A11 notes, ill-5 FAIL on the flattened spread.

## RE-RUN 2 · THE CONTROLS — `pairs-s12a-controls.json`, EXIT=0

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
    #ctl-6 PASS(mechanical) CAUSAL :: * [visitor]
        · MARKS ["receiving"]
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
    
    corpus loaded: 2734 variants in 1020 pools; 6 pass mechanically, 1 WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), 1 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```

**ctl-6 is now `PASS(mechanical)` carrying `R4-BAND n/a`, exactly as the chair required** — the control finally
does the job it was built for: it proves the R4-BAND arm does NOT withhold where the pool has no sibling bands,
and it is no longer masked by an unrelated FAIL. The `MARKS ["receiving"]` line survives, demoted from `-` to `·`.

**Every other control keeps its verdict.** The complete `diff` of the control run, pre-R2 → post-R2, is two hunks
and nothing else:

```diff
-#ctl-6 FAIL CAUSAL :: * [visitor]
-    - MARKS ["receiving"]
+#ctl-6 PASS(mechanical) CAUSAL :: * [visitor]
+    · MARKS ["receiving"]
...
-corpus loaded: … 5 pass mechanically, 1 WITHHELD (R4-BAND …), 2 fail …
+corpus loaded: … 6 pass mechanically, 1 WITHHELD (R4-BAND …), 1 fail …
```

| control | expected after R2 | measured | moved? |
|---|---|---|---|
| ctl-1…ctl-5 (the refuter's five cures) | PASS | **PASS** ×5 | no |
| **ctl-6** (contrast cut, NO sibling bands) | **PASS + `R4-BAND n/a`** | **PASS(mechanical)**, `R4-BAND n/a: the located pool has NO sibling bands — a contrast may be cut here (A8)` | **YES — the R2 cure** |
| ctl-7 (a shared opener added) | FAIL on the opener arm only | **FAIL**, opener arm only | no |
| ctl-8 (alternative names a sibling band's TEXT) | WITHHELD + named | **WITHHELD**, `R4-BAND-TEXT … "readiness ADEQUATE" [visitor] shares walls` | no |

Tally: **6 pass · 1 withheld · 1 fail** — the set the predecessor predicted in §6 for the demoted-MARKS build.

## RE-RUN 3 · THE SMOKE SET — `pairs-smoke.json`, v1 vs v2, both EXIT=0

v1 (`check-pair.v1.mjs`, sha `67921d6d…`):

```
    #1 PASS(mechanical) DS-POP-1 :: QUANTITY: nobody [ledger]
    #4 FAIL DS-POP-1 :: QUANTITY: a dozen or so [visitor]
        - COUNT words LOST (band noun moved?): people
    #11 FAIL DS-WAR-2 :: sovereignty · strained [ledger]
        - MARKS ["dm-only"] — dm-only: the AFTER inherits the mark and the audience law
    #14 FAIL DS-FTH-4 :: ROOTED [street]
        - LONGER: 21 → 22 words
        - PRONOUN CLOSER ADDED (land on the civic noun)
    #17 FAIL DS-SUP-2 :: CAPTURED [ledger]
        - MARKS ["dm-only"] — dm-only: the AFTER inherits the mark and the audience law
        - THREE+ SENTENCES (3) — the register is one flowing sentence or two short ones
        - NOTE: "rather than" removed but the antithesis SHAPE survives (a column moved, not the failure mode)
        - EXISTENTIAL OPENER ADDED ("There is / It is")
    #23 FAIL DS-GEN-5 :: smoke (route isolated / mountain_pass) [counterforce]
        - DURATION/TIME words ADDED: every, year
        - ANTITHESIS SHAPE ADDED: 0 → 1
    #30 FAIL DS-POP-1 :: CANDIDATE KIND: emigration [unfolding]
        - R4: CUT a word that names a SIBLING pool key: decline  (siblings: QUANTITY: nobody | QUANTITY: a few souls | QUANTITY: a dozen or so | QUANTITY: dozens | QUANTITY: a hundred or so | QUANTITY: several hundred)
    
    corpus loaded: 2734 variants; 1 pass mechanically, 6 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```

v2 (`check-pair.mjs`, R2 applied, sha `7b247d6d…`):

```
    #1 WITHHELD(R4-BAND) DS-POP-1 :: QUANTITY: nobody [ledger]
        ! R4-BAND: a contrast was cut in a pool with sibling bands "QUANTITY: a few souls" | "QUANTITY: a dozen or so" | "QUANTITY: dozens" | "QUANTITY: a hundred or so" | "QUANTITY: several hundred" | "QUANTITY: many hundreds" | "QUANTITY: thousands"; the band half is the refuter's — mechanical PASS withheld
        · A11 SPREAD (sentences, pool "QUANTITY: nobody" DS-POP-1, angles ledger/street/visitor): 2/2/2 → 2/2/2
    #4 FAIL DS-POP-1 :: QUANTITY: a dozen or so [visitor]
        - COUNT words LOST (band noun moved?): people
        · A11 SPREAD (sentences, pool "QUANTITY: a dozen or so" DS-POP-1, angles street/ledger/visitor): 2/1/1 → 2/1/2
    #11 PASS(mechanical) DS-WAR-2 :: sovereignty · strained [ledger]
        · MARKS ["dm-only"] — dm-only: the AFTER inherits the mark and the audience law
        · A11 SPREAD (sentences, pool "sovereignty · strained" DS-WAR-2, angles ledger/unfolding/street): 1/1/1 → 2/1/1
    #14 FAIL DS-FTH-4 :: ROOTED [street]
        - LONGER: 21 → 22 words
        - PRONOUN CLOSER ADDED (land on the civic noun)
        · A11 SPREAD (sentences, pool "ROOTED" DS-FTH-4, angles elder/street/ledger): 1/1/1 → 1/2/1
    #17 FAIL DS-SUP-2 :: CAPTURED [ledger]
        - THREE+ SENTENCES (3) — the register is one flowing sentence or two short ones
        - NOTE: "rather than" removed but the antithesis SHAPE survives (a column moved, not the failure mode)
        - EXISTENTIAL OPENER ADDED ("There is / It is")
        ! R4-BAND: a contrast was cut in a pool with sibling bands "STABLE" | "STRAINED" | "SCARCE" | "BLOCKED" | "SUBSTITUTED" | "COLLAPSING"; the band half is the refuter's — mechanical PASS withheld
        · MARKS ["dm-only"] — dm-only: the AFTER inherits the mark and the audience law
        · A11 SPREAD (sentences, pool "CAPTURED" DS-SUP-2, angles ledger/street/visitor): 2/1/2 → 3/1/2
        · A11 PRE-EXISTING shared opener in this pool (a debt this pair neither causes nor cures): "the {}" (ledger + visitor)
    #23 FAIL DS-GEN-5 :: smoke (route isolated / mountain_pass) [counterforce]
        - DURATION/TIME words ADDED: every, year
        - ANTITHESIS SHAPE ADDED: 0 → 1
        · A11 SPREAD (sentences, pool "smoke (route isolated / mountain_pass)" DS-GEN-5, angles visitor/street/ledger/counterforce): 1/1/1/1 → 1/1/1/2
        · A11 PRE-EXISTING shared opener in this pool (a debt this pair neither causes nor cures): "{} is" (street + counterforce)
    #30 FAIL DS-POP-1 :: CANDIDATE KIND: emigration [unfolding]
        - R4: CUT a word that names a SIBLING pool key: decline  (siblings: QUANTITY: nobody | QUANTITY: a few souls | QUANTITY: a dozen or so | QUANTITY: dozens | QUANTITY: a hundred or so | QUANTITY: several hundred)
        ! R4-BAND: a contrast was cut in a pool with sibling bands "CANDIDATE KIND: growth" | "CANDIDATE KIND: decline"; the band half is the refuter's — mechanical PASS withheld
        !   R4-BAND-TEXT: the cut alternative names a word of a sibling band's own TEXT — "QUANTITY: thousands" [visitor] shares decline
        · A11 SPREAD (sentences, pool "CANDIDATE KIND: emigration" DS-POP-1, angles unfolding/street/ledger): 2/2/1 → 2/2/1
    
    corpus loaded: 2734 variants in 1020 pools; 1 pass mechanically, 1 WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), 5 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```

### Exactly which verdicts moved, and why

| pair | v1 | v2 pre-R2 | **v2 post-R2** | what moved it |
|---|---|---|---|---|
| #1 | PASS(mechanical) | WITHHELD(R4-BAND) | WITHHELD(R4-BAND) | **R1's arm, not R2** — its rewrite cut a contrast in a pool with `QUANTITY:` sibling bands |
| #4 | FAIL | FAIL | FAIL | unchanged (`COUNT words LOST: people`) |
| **#11** | FAIL | FAIL | **PASS(mechanical)** | **R2, and only R2** — `MARKS ["dm-only"]` was its *sole* finding; demoted to a NOTE, the pair has no defect left |
| #14 | FAIL | FAIL | FAIL | unchanged (LONGER 21→22, pronoun closer) |
| #17 | FAIL | FAIL | FAIL | **R2 removed one of its four findings** (`MARKS ["dm-only"]` → NOTE) but three FAILs remain — three-plus sentences, the surviving antithesis shape, the existential opener — so the verdict does not move |
| #23 | FAIL | FAIL | FAIL | unchanged (duration words added, antithesis shape 0→1) |
| #30 | FAIL | FAIL | FAIL | unchanged (R4 sibling-key cut `decline`) |

**v1 → v2 tally:** `1 pass, 6 fail` → `1 pass, 1 WITHHELD, 5 fail`. Note the surviving PASS is a *different*
pair: v1's only pass (#1) is now withheld by R1's arm, and #11 takes its place through R2.

⛔ **A CORRECTION TO §7 OF THIS RECEIPT.** The predecessor wrote *"Every v1 FAIL stays a FAIL with identical
findings; nothing that failed now passes."* That was true of v2 pre-R2 and is **false after R2**: #11 was a v1
FAIL and now passes, and #17 keeps its verdict with one fewer finding. §7 is superseded by this table.

**The consequence the chair has ratified, stated plainly so it is not discovered later:** a `dm-only` pair can
now reach `PASS(mechanical)` with nothing but a NOTE — smoke `#11` is the live proof. The predecessor's §6
proposed the finer rule (dm-only → WITHHOLD, role marks → NOTE); the chair ruled the flat one (all marks → NOTE)
and I implemented the ruling as written, not the suggestion. **89 variants** are in that class. If the audience
law is meant to be *enforced* rather than *inherited*, the finer rule is a second one-line change and the chair
should say so; if inheritance is the intent, this row is the record that it was seen and accepted.

---

## RETROVALIDATION ROW — REFRESHED (lane S12A-R2; supersedes the row above)

- **What was judged (mine, Opus 5, Fable-unvalidated):**
  1. That the chair's one-word fix is applied *as the scratch copy verified it* — proven by code byte-identity
     (`diff` of the comment-stripped files, EXIT=0), not by re-reading the line.
  2. That a four-line provenance comment belongs in the header — **comment-only, proven inert by three
     byte-identical re-runs**; the one act in this lane the chair did not ask for.
  3. That the receipt's §7 sentence is now false and must be marked superseded rather than silently left standing.
  4. That the fixture's byte-identical output is the right receipt for "R1 changed nothing", stronger than an assertion.
- **What the Fable chair must re-derive:**
  1. **The dm-only consequence (NEW, HIGH):** 89 variants carrying `dm-only` can now mechanically PASS on a NOTE.
     Ratify inheritance, or order the finer rule (dm-only → WITHHELD, role marks → NOTE) — one line, same site.
  2. Whether the header provenance block stays or is reverted to keep `check-pair.mjs` byte-equal to
     `s12a-scratch/check-pair.marks-as-note.mjs`.
  3. That `ctl-6`'s PASS is now load-bearing: it is the **only** control proving R4-BAND stays silent without
     sibling bands. If the fixture set is ever regenerated, ctl-6 must keep a marked, sibling-less BEFORE — and
     the corpus offers no unmarked one (all 468 causal variants are marked; DS-WAR-3 carries no contrast shape).
  4. **CARRIED FORWARD, still open from the row above:** the ill-1 ratification (item 1 there) and the 313/313
     policy (item 2 there) — R1 ratified the policy; ill-1's `contrastWaived` in the fixture is still unruled.
     Item 3 there (the MARKS channel) is **CLOSED by this section**. Item 4 (288 vs 294) remains DONE.
- **Receipts by path** (all new, this lane):
  `prose-research/check-pair.mjs` (post-R2, sha `7b247d6d0819135c2c12fbd0d8bff386c9ad0f96`) ·
  `s12a-scratch/check-pair.pre-r2.bak.mjs` (pre-R2, sha `80d20b3c…`, the inverse-edit source) ·
  `s12a-scratch/marks-census-r2.{mjs,out}` ·
  `s12a-scratch/r2base.<fixture>.{v1,v2pre}.out` (the three fixtures, both pre-R2 builds) ·
  `s12a-scratch/r2.<fixture>.v2post.out` (post-fix, pre-comment) ·
  `s12a-scratch/r2final.<fixture>.out` (final, byte-identical to the above) ·
  `s12a-scratch/receipt.pre-r2.bak.md`
- **Priority:** (1) the dm-only ruling — HIGH, it is a live behaviour change on 89 variants and the taste sample
  will lean on it; (2) the ill-1 ratification carried forward — HIGH, unchanged from the row above;
  (3) the header comment — LOW, cosmetic and trivially reversible.
