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
