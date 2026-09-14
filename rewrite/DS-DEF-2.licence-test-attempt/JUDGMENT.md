# JUDGMENT — REWRITE 8b · block `DS-DEF-2`

Seat: the JUDGE (Opus), holding the Fable chair's delegated ruling under SITTING §T.4 and §T.5 and brief ADDENDUM 12 (rule 4 re-cut to the FACE).

Packet root: `%s`
Dock: `%s`
Annex ruled on: `src/data/dossierStateProse/defense.generated.js` **as it stands at the refine commit `402d592dfc1d82d0dee8e7d3354398ab775b2721`** — the rows the refuters judged, which are the 26 `kept.md` files in this packet (verified byte-for-byte against `git show 402d592df:<annex>`).

Fences kept: read-only in the dock; no vitest; no build; nothing committed; the annex untouched. This file RULES; it does not execute.

Face numbering throughout: the numbered tagged line is face 0; the three `[face]` sub-rows are faces 1, 2 and 3.

---

## 0. STATE OF THE DOCK — the brief's precondition does NOT hold. READ BEFORE APPLYING ANYTHING.

The brief requires `HEAD` to be the refine commit `402d592dfc1d82d0dee8e7d3354398ab775b2721`. It is not. Measured in the dock at the time of this judgment:

```
$ git rev-parse HEAD
471ce894a83658b0e0fe480819a9f1dcd22605e3
$ git status --porcelain | wc -l
0
$ git log --oneline -3
471ce894a REWRITE 8b DS-DEF-2: 50/78 variants kept as refined · 31 faces reverted · 99 cure target(s) — the Fable judge rulings applied
402d592df REWRITE 8b DS-DEF-2 refine: 23/26 kept, 3 reverted
fa973a884 REWRITE 8b DS-DEF-2 draft round 2: 24/26
```

So a judgment for this block **has already been written and applied** in this dock, and the cure round has already run after it (`<pool dir>/cure-round-1.md`, written 23:14, after the apply commit at 23:04). This seat is therefore a **re-run of the judge step over the same refuter verdicts** — the shape memory records as the workflow runtime retrying a step by key from scratch after a stream event.

Three consequences, all of them for the chair and for whatever runs next:

1. **The dock's working tree is NOT the text this judgment rules on.** The annex at `HEAD` already carries the earlier run's 31 reverts and the cure round's rewrites. Every ruling below is made against the refine-commit rows (`kept.md`), because those are the rows the refuters actually read.
2. **The APPLY gate must not be run against this HEAD.** Restoring draft faces over an already-reverted-and-cured annex would silently discard the cure round's work and could mix two judgments (a face this judgment keeps but the earlier one reverted would stay reverted, because an apply pass only ever reverts). The apply step's own precondition — *HEAD must be the refine commit* — is the guard; it must be honoured, not worked around. If the chair wants this judgment executed, it is executed from `402d592df` in a fresh dock, or not at all.
3. **The earlier run's file has been preserved, not overwritten:** `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/rewrite/DS-DEF-2/JUDGMENT.prior-run-2026-09-11T2252.md`. Nothing in this packet was destroyed to write this file.

For the record, this seat reached the same counts as the earlier run independently — 31 faces reverted, 99 cure targets, no pool refused — over the same 166 / 129 / 17 verdict split. The two runs are not byte-identical in their reasoning and the chair should compare them at the four constructions in §1 if the comparison matters to the REFUTER COMPARISON car.

---

## 1. The rules applied, and the chair's construction of them

The four dispositions are the brief's: (1) a FAIL that names a law and quotes the face REVERTS to its draft face where that draft face is CLEAN; (2) a WITHHELD is KEPT and listed; (3) a FAIL naming no law is treated as a WITHHELD — **no such verdict arose: every one of the 129 FAILs names at least one law**; (4) a FAIL whose draft face shares the fault is a CURE TARGET, never a pool refusal; (5) never trim — no face and no variant is removed, and none was.

Four constructions were needed to apply rule 1 consistently across 26 pools. They are recorded here so the chair can veto any of them; each names the faces it decided.

**J-1 — a co-referring common noun satisfies R-i.** Two refuters WITHHELD a second sentence whose only link back was a definite common noun co-referring with the slot named in the first sentence, and each put the question to the chair (`plagued, perimeter AND organized force` v1 f0; `plagued, no perimeter and no force` v1 f1). The block's own refuters answer it in practice: faces PASS elsewhere on exactly that link and say so in terms ("the second sentence carries 'town' forward as 'that town'"; "the demonstrative has a real antecedent, unlike the sibling pool's failed 'That muster'"). I rule that a definite or demonstrative common noun co-referring with a noun or slot standing in the face's own first sentence CARRIES THE NOUN FORWARD for R-i; a fresh referent with no antecedent (the failed "That muster") does not. Both WITHHELDs stand as KEPT. The same ruling lets `economic survival CRITICAL` v1 f2 revert.

**J-2 — "CLEAN" is read against the pool as this judgment leaves it.** A revert stands only where the draft face (a) is not byte-identical to the failed face, (b) does not carry the quoted breaching clause or the same breaching construction in substance, and (c) is not itself reached by a ground named in that verdict's law line — **including where the ground is only reached once the revert is in place**. A revert that installs a near-verbatim twin of a face this judgment KEEPS cures nothing and breaks the four-faces wall, which is the rewrite's own reason for existing. The threshold I applied to limb (c), so that it cannot be stretched: the revert is refused only where the draft face would share a clause or sentence of five or more words, near-verbatim, with a sibling face of the SAME variant that stays in the pool, or would reproduce that sibling's whole frame. Seven faces turn on it and are marked `J-2(c)` in §3: `plagued, perimeter AND organized force` v1 f2 and v1 f3; `walls with NO force` v3 f3; `no legal infrastructure` v1 f2; `economic survival ADEQUATE` v3 f3; `economic survival WEAK` v2 f3; `economic survival CRITICAL` v1 f1; `no reserves, hospital present` v1 f2; `no reserves, no medical provision` v2 f1. A chair who rejects J-2(c) turns those faces from cure targets into reverts, and should expect the four-faces finding to return at the re-refutation.

**J-3 — a draft face carrying a breach the same refuter FAILED elsewhere in the same pool is not clean.** Reverting must not install a wording the pool's own verdicts convict. Eleven faces turn on it and are marked `J-3` in §3, among them `no reserves, no medical provision` v1 f3, v2 f0 and v2 f3 (the draft faces carry "Nowhere at {settlement} takes the sick in" and "The community", both failed elsewhere in that pool) and `granary, NO medical provision` v3 f2 (the draft carries the possessive-on-the-stock shape failed at v2 f3). The programme's own memory states the reason in one line: a revert to the draft cures nothing when the draft shares the fault.

**J-4 — one WITHHELD is converted by a chair's block ruling (rule 4, last clause).** `frontier, credible deterrence` v1 f1 ("an active frontier") was WITHHELD because the marker had left it an OPEN ROW and "a refuter cannot settle a chair's open row." The chair's block ruling on the label traps settles it: frontier is the DEFAULT of an unmeasured town, so the tier carries no activity; the word's only supports are product-chrome surfaces, which the skeleton's §0.2 rules are not a licence. It is a cure target, and the bare tier word is ruled licensed.

**No pool is refused.** Under the rule-4 re-cut a pool is refused only where it is malformed — a missing or extra variant, a changed or doubled bracketed tag, a variant number that does not match. All 26 pools were checked mechanically against their `kept.md`: 26 × 3 variants, each with one bracketed angle tag and four faces. 78 variants, 312 faces, none trimmed.

---

## 2. The figures

**The refuters' verdicts** (Opus refuter seat, one per pool, over the rows standing at the refine commit), 312 faces:

| | faces | share |
|---|---|---|
| PASS | 166 | 53.21 % |
| FAIL | 129 | 41.35 % |
| WITHHELD | 17 | 5.45 % |

**This judgment's dispositions**, 312 faces:

| | faces |
|---|---|
| KEEP (166 PASS + 16 WITHHELD) | 182 |
| REVERT to the draft face | 31 |
| CURE TARGET (99 FAILs + 1 converted WITHHELD) | 99 |
| REFUSED / TRIMMED | 0 |

At the variant grain: **78 variants, 8 of them left exactly as the refinement wrote them**; 70 carry at least one reverted face or cure target (27 carry a revert, 58 carry a cure target), and no variant loses a face. No pool escapes untouched — every one of the 26 carries at least one FAIL.

**The gate's final figures for the block** (the wave gate's own packet at the refine tip, `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEF2/.packets/A.json`, arm A, taken 2026-09-12T01:14:56Z — the packet the refine commit was gated on):

- Owned verdicts, POOL grain (26 owned pools): **PASS 5 · WITHHELD 21 · FAIL 0.**
- Owned verdicts, FACE grain (the walk over 312 owned units): **PASS 235 · WITHHELD 77 · FAIL 0.**
- Owned shape: **78 variants · 312 units · banked 0.**

**The classifier's cell classes for the block** (`scripts/prose-manifest-diff.mjs`, 73,284 cells on the tip side), printed as the gate printed them:

```
PROSE MANIFEST DIFF · 73284 cells on the tip side
  REPLACED       cells       0 · towns     0
  RE-INDEXED     cells       0 · towns     0
  ADDITIVE       cells       0 · towns     0
  WORDING-ONLY   cells    3064 · towns   525
  UNCHANGED      cells   70220 · towns   525
  ADDED          cells       0
  REMOVED        cells       0
  (of the UNCHANGED, cells whose audience-filtered INDEX moved with no reader-visible change: 0)
```

Every changed cell is **WORDING-ONLY**; **none is REPLACED**, none RE-INDEXED, none ADDITIVE, nothing added and nothing removed. The rewrite moved words and moved no reader to a different cell.

**The measurement worth putting in front of the chair:** the mechanical gate read **FAIL 0** at both grains on exactly the rows the refuters then failed **129 of 312 times**. The blind spot the SITTING measured at §T is confirmed again here, on a second block and at the same order of magnitude.

**Tokens:** draft 0, refine 0, refute 0 (as the workflow carried them into this seat; the re-run carries no live spend figures for the earlier phases).

**Round counters** (as the workflow carried them into this seat):

- `ds-def-2--beasts-monsters-plagued-perimeter-and-organized-` — rounds 1 in-band
- `ds-def-2--beasts-monsters-plagued-perimeter-but-no-force-t` — rounds 1 in-band
- `ds-def-2--beasts-monsters-plagued-no-perimeter-and-no-forc` — rounds 2 in-band
- `ds-def-2--beasts-monsters-frontier-credible-deterrence` — rounds 2 in-band
- `ds-def-2--beasts-monsters-frontier-force-without-a-perimet` — rounds 1 in-band
- `ds-def-2--beasts-monsters-settled-defenses-beyond-the-need` — rounds 1 in-band
- `ds-def-2--beasts-monsters-settled-nothing-organized` — rounds 2 BANKED
- `ds-def-2--invasion-war-walls-and-professional-garrison` — rounds 2 in-band
- `ds-def-2--invasion-war-walls-with-citizen-militia` — rounds 2 in-band
- `ds-def-2--invasion-war-walls-with-no-force` — rounds 2 in-band
- `ds-def-2--invasion-war-force-with-no-walls` — rounds 1 in-band
- `ds-def-2--invasion-war-militia-only` — rounds 1 in-band
- `ds-def-2--invasion-war-neither-walls-nor-force` — rounds 1 in-band
- `ds-def-2--internal-security-full-legal-chain-court-and-pri` — rounds 1 in-band
- `ds-def-2--internal-security-court-without-detention` — rounds 2 BANKED
- `ds-def-2--internal-security-detention-without-process` — rounds 1 in-band
- `ds-def-2--internal-security-no-legal-infrastructure` — rounds 1 in-band
- `ds-def-2--economic-survival-strong` — rounds 2 in-band
- `ds-def-2--economic-survival-adequate` — rounds 1 in-band
- `ds-def-2--economic-survival-weak` — rounds 1 in-band
- `ds-def-2--economic-survival-critical` — rounds 1 in-band
- `ds-def-2--disasters-famine-granary-and-hospital` — rounds 2 in-band
- `ds-def-2--disasters-famine-granary-and-parish-care-only` — rounds 1 in-band
- `ds-def-2--disasters-famine-granary-no-medical-provision` — rounds 1 in-band
- `ds-def-2--disasters-famine-no-reserves-hospital-present` — rounds 2 in-band
- `ds-def-2--disasters-famine-no-reserves-no-medical-provisio` — rounds 1 in-band

---

## 3. The rulings, pool by pool

Each table is the complete set of twelve faces for the pool. `law` and `quote` are the refuter's own; `ground` is this seat's reason where the disposition is not a plain PASS.

### 1. `ds-def-2--beasts-monsters-plagued-perimeter-and-organized-`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[unfolding]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 7 · WITHHELD 2 · PASS 3. Disposition: 1 reverted · 6 cure target(s) · 5 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | WITHHELD | THE THREAD (owner 2026-09-08) / R-i, the thread at k = 0 | Entered to the town's name are a wall and a muster. | **KEEP** |
| 1 | 1 | FAIL | W5 (the naming-form article; a frame that needs the generic article to carry a band is a maxim frame), with the skeleton rule | In a country where creatures are abroad | **CURE** |
| 1 | 2 | FAIL | W1 (possessor binding); secondarily the skeleton rule 1(5), a dropped [ledger] | the town's wall and its muster both stand | **CURE** |
| 1 | 3 | FAIL | A5 / the four-faces rule and Part B 21.1 sibling distance | A wall and a muster are entered as standing | **CURE** |
| 2 | 0 | FAIL | the card's may NOT (a count); C7 (a same-page contradiction with a sibling pool) | Defense at {settlement} is a wall and a muster | **CURE** |
| 2 | 1 | PASS | — | The town has a wall at {settlement} and a muster of its own | **KEEP** |
| 2 | 2 | FAIL | the four-faces rule with W4 (the construction contract); a regression against the draft | Creatures are abroad in the country around {settlement} | **REVERT** |
| 2 | 3 | FAIL | the card's may NOT (a count); C7; A6 | what the town has is a wall and a force | **CURE** |
| 3 | 0 | PASS | — | What {settlement} has built is in place and the muster with it | **KEEP** |
| 3 | 1 | FAIL | C7 (a same-page contradiction with a sibling pool); the card's may NOT (a count - a totality over the record's open matters) | what lies open is the pressure from the country's creatures | **CURE** |
| 3 | 2 | PASS | — | At {settlement} the muster stands and the wall as well | **KEEP** |
| 3 | 3 | WITHHELD | the register card ("a qualification is a sentence, never a tail") read against an interpolated relative | the pressure out of the country, where the creatures are | **KEEP** |

- **v1 f0 — KEEP.** KEPT under J-1: the second sentence's "the town's" co-refers with {settlement}, which stands in the face's own first sentence, and a co-referring definite common noun CARRIES THE NOUN FORWARD for R-i. The refuter put the question to the chair and the chair answers it here, once, for the block.
- **v1 f1 — CURE.** RULE 4: the refuter records in terms that "the draft had the same words as a flat TAIL (R-DA-03)" - the draft face carries the same generic-article country frame ("in a country where the creatures are"), so the breaching clause stands in the draft and a revert would install an R-DA-03 tail besides.
  - cure: Definite the frame and drop the second slot: "In the country around {settlement}, where creatures are abroad, the works and the muster are carried standing." One slot, R1 stated of this country, no claim added.
- **v1 f2 — CURE.** J-2(c): the draft face is clean of W1, but reverting installs a face whose whole second clause is VERBATIM the KEPT face 0's second sentence ("entered to the town's name are a wall and a muster") - the refinement rotated the variant's wordings, so a one-for-one revert makes two faces of one variant one sentence. A5 is the wall; the revert cannot stand.
  - cure: Drop the possessive: "the town's wall and the muster both stand"; the curer may restore an entry surface, and must keep the face off face 0's "entered to the town's name" formula, which the KEPT face 0 now owns.
- **v1 f3 — CURE.** J-2(c): the draft face is clean of the named ground, but its body half ("the town's wall and the town's muster both stand") is a one-word variant of the REFINED face 2's body half, which stays in the pool as a cure target; the revert would trade one sibling paraphrase for another inside the same variant.
  - cure: Restore a distinct wall and force spelling: "The works and the town's force are entered as standing at {settlement}, and creature country lies around the town." Both spellings are ratified always-safe class words (W15); no claim added.
- **v2 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Break the equation and keep the frame (21.4): "Defense at {settlement} includes a wall and a muster, and creatures press the country outside." A presence verb is allowed in place of "includes"; never a counting or extent word.
- **v2 f2 — REVERT.** RULE 1: the refuter records that the refinement moved this face onto face 3's construction and that the draft's bodies-first shape was the variant's fourth distinct construction; the draft face carries neither the shared subject nor the shared opener, and is clean of the named ground.
  - refined: “Creatures are abroad in the country around {settlement}, and the town's own wall and muster stand.”
  - draft (restored): “A wall and a muster stand at {settlement}, and the country around the town carries creatures.”
- **v2 f3 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Drop the cleft: "and the town has a wall and a force."
- **v3 f1 — CURE.** RULE 4: the draft face carries the same exhaustive cleft in substance ("what stands open is the pressure from the country's creatures"); the breaching construction stands in the draft, one verb apart.
  - cure: Drop the cleft and state the OPEN move directly: "and the pressure from the country's creatures lies open."
- **v3 f3 — KEEP.** KEPT: the named bars are the which-clause and the tail, and an interpolated where-clause is neither; no block ruling of the chair's converts it. Recorded for the re-refutation with the refuter's conditional cure.

### 2. `ds-def-2--beasts-monsters-plagued-perimeter-but-no-force-t`

Variants: 1 `[ledger]` · 2 `[visitor]` · 3 `[unfolding]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 3 · WITHHELD 0 · PASS 9. Disposition: 2 reverted · 1 cure target(s) · 9 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | has its works and no force to hold them | **KEEP** |
| 1 | 1 | PASS | — | Neither garrison nor militia is entered at {settlement} | **KEEP** |
| 1 | 2 | FAIL | W20 (a noun at the site its read reaches) · W1/W23 (the possessor) | the works standing in it have nothing of the muster | **REVERT** |
| 1 | 3 | PASS | — | What the town has built at {settlement} stands with no force | **KEEP** |
| 2 | 0 | FAIL | the REGISTER CARD; R-DA-05 with MOVE-GRAMMAR 0's reading-order caveat; fault 17, the loop | A stranger at {settlement} finds the works standing and no | **CURE** |
| 2 | 1 | PASS | — | A stranger there meets what the town has built | **KEEP** |
| 2 | 2 | FAIL | A5 / the four-faces rule; 21.2 (a refinement that adds a failing state does not keep) | To a stranger at {settlement}, the works stand with neither | **REVERT** |
| 2 | 3 | PASS | — | What a stranger finds at {settlement}, in a country plagued | **KEEP** |
| 3 | 0 | PASS | — | The works at {settlement} stand in a country plagued with beasts | **KEEP** |
| 3 | 1 | PASS | — | The holding of them stands open. | **KEEP** |
| 3 | 2 | PASS | — | the works stand in it unheld | **KEEP** |
| 3 | 3 | PASS | — | the holding of them wants a garrison or a militia | **KEEP** |

- **v1 f2 — REVERT.** RULE 1: the draft face declares the ground "about" and not "outside" the town, so the refuter's own test for the locative (its stated reason for passing v3 f1 and v3 f2) is met, and it seats no possession verb on the works ("with no force of the muster's kind at them"). Clean of both named grounds.
  - refined: “Creatures plague the country outside {settlement}, and the works standing in it have nothing of the muster.”
  - draft (restored): “Plagued country lies about {settlement}, and the works of the town stand in it with no force of the muster's kind at them.”
- **v2 f0 — CURE.** RULE 4: the draft face carries the breaching opener verbatim ("A stranger at {settlement} finds the works standing and no ..."); the same-page twin the refuter names is reached by the draft exactly as by the refinement.
  - cure: Front the country frame, which keeps all four shipped floor turns and breaks both the shared opener and the shared predicate skeleton: "In a country where beasts are abroad, a stranger at {settlement} finds the works standing and no garrison or militia at them."
- **v2 f2 — REVERT.** RULE 1: the refuter records that the refinement caused the collapse - the draft face closed on "nothing of the muster", a different landing from face 0's, and sits the country medially, so the draft is clean of the named A5 ground and 21.2's own limb points to it. NOTE for the re-refutation: the draft keeps the "To a stranger at {settlement}" frame the same-page sibling row also carries; that residue is a row-set matter the refuter says may be cured in either pool.
  - refined: “To a stranger at {settlement}, the works stand with neither garrison nor militia at them, in a country where creatures press.”
  - draft (restored): “To a stranger at {settlement}, the works stand in a country where creatures press, and at them stands nothing of the muster.”

### 3. `ds-def-2--beasts-monsters-plagued-no-perimeter-and-no-forc`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 4 · WITHHELD 2 · PASS 6. Disposition: 3 reverted · 1 cure target(s) · 8 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | FAIL | THE DENSITY FLOOR (Part B 21.4, read against the SHIPPED sentence) with skeleton 1.5 and 1.7 | the place stands inside it without works or muster | **REVERT** |
| 1 | 1 | WITHHELD | R-i (ADDENDUM 12) and THE THREAD | Creatures range the country around {settlement}. The place has | **KEEP** |
| 1 | 2 | PASS | — | the place is entered as wanting works and muster | **KEEP** |
| 1 | 3 | WITHHELD | R-DA-18 (the antique air lives in the NOUN, never in the SYNTAX) | nothing of works or muster stands in the place | **KEEP** |
| 2 | 0 | PASS | — | In a country plagued with monsters, {settlement} stands open and unmustered | **KEEP** |
| 2 | 1 | PASS | — | Out in monster country {settlement} keeps neither works nor muster | **KEEP** |
| 2 | 2 | FAIL | the register card ("a second fact takes its own sentence; a qualification is a sentence, never a tail") with R-DA-03, and skeleton 2.4/2.7 | A country of monsters surrounds {settlement}, a place with no | **CURE** |
| 2 | 3 | FAIL | A11 sibling distance with R-DA-10 and the four-faces-differ-in-CONSTRUCTION rule; 21.4 read against the DRAFT | Beasts are thick in the country around {settlement}, and the | **REVERT** |
| 3 | 0 | PASS | — | A stranger comes to {settlement} through a country plagued with monsters | **KEEP** |
| 3 | 1 | PASS | — | What a stranger sees at {settlement} is a country of monsters | **KEEP** |
| 3 | 2 | PASS | — | and around it lies an embattled country of beasts | **KEEP** |
| 3 | 3 | FAIL | A5 / the four-faces rule, with 21.4 read against the DRAFT | the next is a place with no muster and no works | **REVERT** |

- **v1 f0 — REVERT.** RULE 1: the draft face carries the producer's own token for C3 ("neither a wall nor a force stands in the place"), which is the whole of the named ground - the refuter's finding is that the word vanished from every face of the variant. Clean.
  - refined: “An embattled country of monsters lies around {settlement}, and the place stands inside it without works or muster.”
  - draft (restored): “An embattled country of monsters lies around {settlement}, and neither a wall nor a force stands in the place.”
- **v1 f1 — KEEP.** KEPT under J-1: "The place" co-refers with {settlement}, which stands in the face's own first sentence; a co-referring definite common noun carries the noun forward for R-i.
- **v1 f3 — KEEP.** KEPT: unproven on the refuter's own reading, and no block ruling of the chair's converts it; it also buys the variant its only object close.
- **v2 f2 — CURE.** RULE 4: the draft face carries the same appositive tail ("a place with no wall and no muster") hung on the object of the C1 clause, so the breaching construction stands in the draft.
  - cure: Give the second read a finite predicate: "A country of monsters surrounds {settlement}, and the place holds no works and no muster." To recover the angle as well, front the country as an adjunct and seat the place as the subject.
- **v2 f3 — REVERT.** RULE 1: the refuter records that the refinement CREATED the collision on both sides in one round and names the draft's construction as the cure ("At {settlement} the country is thick with monsters, and the place itself stands with ..."); the draft face is off variant 1's template and clean of the named ground.
  - refined: “Beasts are thick in the country around {settlement}, and the place itself stands with no works and no force.”
  - draft (restored): “At {settlement} the country is thick with monsters, and the place itself stands with neither a wall nor a force.”
- **v3 f3 — REVERT.** RULE 1: the refuter names the draft face as the cure in terms ("the draft's 'and the next is a place open and unmustered' is the smallest reversion and adds no claim"); the draft lands a different shape from face 1's and is clean of the named ground.
  - refined: “The first thing a stranger meets at {settlement} is monster country, and the next is a place with no muster and no works.”
  - draft (restored): “The first thing a stranger meets at {settlement} is monster country, and the next is a place open and unmustered.”

### 4. `ds-def-2--beasts-monsters-frontier-credible-deterrence`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[counterforce]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 3 · WITHHELD 1 · PASS 8. Disposition: 1 reverted · 3 cure target(s) · 8 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | Around {settlement} lies frontier country, and the town's works stand in it | **KEEP** |
| 1 | 1 | WITHHELD | W14 (a label at its ENGINE meaning) read with the skeleton 0.2; A6 as the consequence | The works at {settlement} sit on an active frontier | **CURE** |
| 1 | 2 | PASS | — | At the town of {settlement} the works are carried as standing | **KEEP** |
| 1 | 3 | PASS | — | A force is entered at {settlement} | **KEEP** |
| 2 | 0 | PASS | — | Frontier country lies outside the town | **KEEP** |
| 2 | 1 | PASS | — | What the town has built is up | **KEEP** |
| 2 | 2 | FAIL | W5 (the naming-form article: a maxim frame) and R-DA-12 (the generalisation test) | In frontier country the town has a force | **CURE** |
| 2 | 3 | PASS | — | The muster stands with the works | **KEEP** |
| 3 | 0 | FAIL | the card's may NOT: a cause; the skeleton's fence 3; ADDENDUM 8 ruling 2 | Against frontier country the town of {settlement} has its works standing | **CURE** |
| 3 | 1 | PASS | — | At {settlement} the works are not without a force | **KEEP** |
| 3 | 2 | PASS | — | Outside {settlement} the country is frontier country | **KEEP** |
| 3 | 3 | FAIL | W1 (the binding rule); W23; Part B 21.2 | and with it what the town has built | **REVERT** |

- **v1 f1 — CURE.** RULE 4, LAST CLAUSE - THE CHAIR CONVERTS THE WITHHELD. The refuter withheld because the marker had left the word an OPEN ROW and "a refuter cannot settle a chair's open row". The chair's block ruling on the label traps settles it: frontier is the DEFAULT of an unmeasured town, so the tier carries no activity of any kind; "active" states a measured activity no field holds, its only supports are product-chrome surfaces which the skeleton 0.2 rules are not a licence, and the face is then not claim-equal to its three siblings, which all say "frontier country".
  - cure: Take the bare tier word, which the chair rules licensed: "The works at {settlement} stand in frontier country." The declared construction, the limb order, the slot set and the inverted second sentence are untouched; heed the refuter's secondary note and do not seat THE WORKS as the subject of a sitting-on-a-frontier predicate, which leans the word toward the border reading L-2 refuses.
- **v2 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Anchor the country to this town's own outside, adding no claim: "In the frontier country outside, the town has a force, and that force stands behind the works." The limb order, the resumptive "that force", the close on "the works" and the empty slot set are all kept.
- **v3 f0 — CURE.** RULE 4: the draft face carries the same orientation word on the same relation ("The works at {settlement} stand against frontier country"), so the breaching claim stands in the draft.
  - cure: State the pressure as position rather than opposition, one word: "In frontier country the town of {settlement} has its works standing, and behind them a force." The fronted pressure, the elliptical second conjunct, the slot, the limb order and the close on "a force" all stand.
- **v3 f3 — REVERT.** RULE 1: the refuter records that the draft face carried no pronoun at all ("In the frontier country around {settlement} the town's force stands with what the town has built") and that the refinement introduced the unreachable "it" for a limb-order figure; 21.2's own test points at the draft. Clean.
  - refined: “The town's force stands in the frontier country about {settlement}, and with it what the town has built.”
  - draft (restored): “In the frontier country around {settlement} the town's force stands with what the town has built.”

### 5. `ds-def-2--beasts-monsters-frontier-force-without-a-perimet`

Variants: 1 `[ledger]` · 2 `[visitor]` · 3 `[street]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 2 · WITHHELD 2 · PASS 8. Disposition: 0 reverted · 2 cure target(s) · 10 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | At {settlement} the muster stands in an unwalled town | **KEEP** |
| 1 | 1 | FAIL | W5 (the naming-form article); secondarily the card's may NOT: a cause | The town at {settlement} is set down unwalled, and in frontier country | **CURE** |
| 1 | 2 | PASS | — | Armed people are carried standing at {settlement} in a country entered | **KEEP** |
| 1 | 3 | WITHHELD | the skeleton rule (the angle's own stance); skeleton (5)/(7) a dropped angle | The town in that country holds a force under arms | **KEEP** |
| 2 | 0 | PASS | — | A stranger passes no wall coming into {settlement}, and finds armed people | **KEEP** |
| 2 | 1 | PASS | — | A newcomer to {settlement} comes in out of frontier country | **KEEP** |
| 2 | 2 | PASS | — | Out of frontier country a stranger comes into {settlement} past no wall | **KEEP** |
| 2 | 3 | PASS | — | Inside {settlement} a stranger comes upon armed people, and about the town | **KEEP** |
| 3 | 0 | WITHHELD | R-DA-05 (the pool is the unit of spread; the within-pool sd floor) beside the skeleton (6); 21.2 | In frontier country the town stands unwalled, and keeps armed people. | **KEEP** |
| 3 | 1 | FAIL | the card's may NOT: a standpoint; A11 / C7; W23 | the town's force stands where no wall does | **CURE** |
| 3 | 2 | PASS | — | People under arms stand here in frontier country, and the town | **KEEP** |
| 3 | 3 | PASS | — | Here the town goes without works and holds armed people. | **KEEP** |

- **v1 f1 — CURE.** RULE 4: the draft face carries the breaching naming form verbatim ("The town at {settlement} is unwalled"), which is the verdict's primary ground.
  - cure: "The town of {settlement} is set down unwalled in frontier country, and keeps people under arms." - "of" for "at", and the country adjunct out of the force clause's front position; landing noun and claim set untouched.
- **v1 f3 — KEEP.** KEPT: the skeleton says the ledger MAY use the office's formula, so the ground cannot be closed against the marker's own wording, and no block ruling of the chair's converts it. The refuter's conditional cure is recorded, with its warning that the formula must never sit on the absence.
- **v3 f0 — KEEP.** KEPT: the drafter DECLARED the sd shortfall as one soft-rule exceedance inside the budget with its reason, every hard wall of the card is clear, and a pool-level spread figure is not a breach of this face. The refuter's short-line cure is recorded for the chair.
- **v3 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: The drafter's own recorded fallback, claim set unchanged and the licensed contrast kept: "the town's force stands and no wall does".

### 6. `ds-def-2--beasts-monsters-settled-defenses-beyond-the-need`

Variants: 1 `[counterforce]` · 2 `[ledger]` · 3 `[visitor]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 3 · WITHHELD 1 · PASS 8. Disposition: 0 reverted · 3 cure target(s) · 9 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | There is very little of beast or monster in the country | **KEEP** |
| 1 | 1 | PASS | — | a quiet one in the way of beasts | **KEEP** |
| 1 | 2 | PASS | — | the country around the town is little troubled by creatures | **KEEP** |
| 1 | 3 | PASS | — | Monsters come to little in the country around {settlement} | **KEEP** |
| 2 | 0 | FAIL | the card's may-NOT (a second fact) + entailment item 4 (settled is the LOW beast-and-raider tier, never a peace) + C7 + W2 | and the country around the town as quiet | **CURE** |
| 2 | 1 | PASS | — | The works at {settlement} are carried as standing | **KEEP** |
| 2 | 2 | WITHHELD | the card's may-NOT (a claim the read does not hold) + entailment item 1 / D-6 | what the town has built there is set down as standing | **KEEP** |
| 2 | 3 | FAIL | A5 / the four-faces rule + entailment item 4 + C7 | Provision against beasts is entered at {settlement} | **CURE** |
| 3 | 0 | FAIL | W14 (the label bar) + W15 (the alias bar) + entailment D-6 and A-7 + entailment item 1 | A stranger notices the perimeter at {settlement} first | **CURE** |
| 3 | 1 | PASS | — | What a stranger sees at {settlement} is the works standing | **KEEP** |
| 3 | 2 | PASS | — | To a stranger the country around {settlement} is quiet | **KEEP** |
| 3 | 3 | PASS | — | Monsters are little seen in the country around the town | **KEEP** |

- **v2 f0 — CURE.** RULE 4: byte-identical to its draft face - the refuter says in terms that this face "escaped by being kept verbatim" the cure applied three times elsewhere.
  - cure: Name the referent on the elided predicate and nothing else: "and the country around the town as quiet of them" ("them" binds to "beasts"). Do NOT cure with "of beast or monster": that pairing is already spent twice and a third use breaches R-DA-10's pet-word ceiling.
- **v2 f2 — KEEP.** KEPT: the breach is available but not established - the natural binding for a reader is {settlement} itself - and unclarity alone is not a finding. The refuter's one-word cure (delete "there") is recorded for the chair.
- **v2 f3 — CURE.** RULE 4: the draft face carries the same opening clause verbatim AND the same unreferented band close ("is set down as a quiet one"), so both limbs of the named ground stand in the draft.
  - cure: Reverse the read order and re-land the face, naming the referent in the same stroke: "Beasts come to little in the country around {settlement}, and provision against them is entered at the town." The nominal compression is kept; the order, the subject and the landing all move.
- **v3 f0 — CURE.** RULE 4: the draft face carries "the perimeter" in the identical opening clause. The chair's own block ruling convicts the word independently: 'perimeter' is FALSE of a Citadel (inner) and of Gates (a point), and the safe generic is 'the works' or the {defwork} name.
  - cure: One word, "the perimeter" to "the works": "A stranger notices the works at {settlement} first, and then how quiet the country around the town is of beasts." The density floor is kept whole and no claim moves.

### 7. `ds-def-2--beasts-monsters-settled-nothing-organized`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 8 · WITHHELD 0 · PASS 4. Disposition: 2 reverted · 6 cure target(s) · 4 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | {settlement} keeps no works and no muster against the country | **KEEP** |
| 1 | 1 | PASS | — | The beasts about {settlement} are few | **KEEP** |
| 1 | 2 | FAIL | A1/A11 sibling distance (R-DA-05) + A6 claim-equality + W14 | the country beyond is entered as quiet | **CURE** |
| 1 | 3 | FAIL | A6 claim-equality across the faces + W14 / W2's C7 ground | Little comes out of the country about {settlement}. | **CURE** |
| 2 | 0 | FAIL | W1 as the pool itself applies it + A6 + W14 | and what is outside it is quiet | **CURE** |
| 2 | 1 | FAIL | W4 the construction contract + A5 / R-DA-05 | the town facing that country keeps neither works nor muster | **CURE** |
| 2 | 2 | PASS | — | Beasts are few out in the country. | **KEEP** |
| 2 | 3 | FAIL | A6 across the faces + W14 / W2's C7 ground | What comes out of the country is little. | **CURE** |
| 3 | 0 | PASS | — | A stranger walks out of {settlement} past no works and no muster | **KEEP** |
| 3 | 1 | FAIL | W5 the naming-form article (a maxim frame) + the skeleton rule (READ 1 unstated of the right referent) + A6 | Out of a country low in beasts a stranger comes on {settlement} | **CURE** |
| 3 | 2 | FAIL | A6 + W14 / W2's C7 ground + R-DA-11 the figure policy | beyond the town the country shows little | **REVERT** |
| 3 | 3 | FAIL | W4 / W8 / W27 (the visitor's stance is this variant's contract) + a regression against the draft (21.2) | The town in that country has no works and keeps no muster. | **REVERT** |

- **v1 f2 — CURE.** RULE 4: the draft face carries the same office formula on the same unbounded band ("the country about it is entered as quiet") and no beast, creature or monster word anywhere, so the W14/A6 limb stands in the draft verbatim.
  - cure: Keep the formula on the first clause and bound the tier to the row's own class in a form no sibling uses: "The town of {settlement} is entered with no works and no muster, and the beasts of the country beyond are entered as few."
- **v1 f3 — CURE.** RULE 4: the draft face carries the identical first sentence, which is the breaching clause.
  - cure: Bound the first sentence to the class without borrowing the sibling's wording: "Few beasts come out of the country about {settlement}." The second sentence stands.
- **v2 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Drop the pronoun and bound the band, keeping the privative and the shipped noun: "The town stands without works or muster, and what is outside is quiet of beasts."
- **v2 f1 — CURE.** RULE 4: the draft face runs the same construction it is failed for - the tier measured first, then both absences under one correlative - and carries the unbounded "quiet" besides ("The country outside is quiet, and the town facing it has neither works nor muster").
  - cure: Change the device so v1 f1 keeps the pool's only correlative: "The country outside carries few beasts, and the town facing that country has no works and keeps no muster."
- **v2 f3 — CURE.** RULE 4: the draft face carries the identical first sentence.
  - cure: Bound the cleft with the skeleton's own class spelling: "What the country sends out in beasts is little. The town holds no works and no muster against that country."
- **v3 f1 — CURE.** RULE 4: the draft face rides the band on an indefinite article in the same way ("out of a quiet country") and leaves the tier unstated of this town's country, so the named ground stands in the draft.
  - cure: Make the country definite and bind it to the town, keeping the fronted frame: "Out of the country about {settlement}, low in beasts, a stranger comes on the town and finds no works and no muster in it."
- **v3 f2 — REVERT.** RULE 1: the draft face states the band bounded to the class ("beyond the town the country carries few beasts") and carries no presentational verb on the region, so it is clean of all three named grounds. The refuter's own cure for face 3 depends on "shows" being freed here, which this revert does.
  - refined: “No works and no muster meet a stranger at {settlement}, and beyond the town the country shows little.”
  - draft (restored): “Neither works nor muster meets a stranger at {settlement}, and beyond the town the country carries few beasts.”
- **v3 f3 — REVERT.** RULE 1: the refuter records that the refinement replaced the draft's perceptual "shows" with "has" expressly to free the verb for face 2, trading the variant's stance for a verb ration; the draft face keeps the eye and is off the have-verb template the finding names. Clean, and the face-2 revert frees "shows".
  - refined: “Few creatures meet a stranger in the country about {settlement}. The town in that country has no works and keeps no muster.”
  - draft (restored): “Few creatures meet a stranger in the country about {settlement}. The town in that country shows no works, and keeps no muster.”

### 8. `ds-def-2--invasion-war-walls-and-professional-garrison`

Variants: 1 `[ledger]` · 2 `[visitor]` · 3 `[street]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 2 · WITHHELD 1 · PASS 9. Disposition: 2 reverted · 0 cure target(s) · 10 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | The works at {settlement} stand entered, and so do the soldiers. | **KEEP** |
| 1 | 1 | PASS | — | Soldiers are carried standing at {settlement} | **KEEP** |
| 1 | 2 | PASS | — | Two things are entered together at {settlement} | **KEEP** |
| 1 | 3 | PASS | — | Both the works and the town's force are set down at {settlement} | **KEEP** |
| 2 | 0 | PASS | — | A stranger at {settlement} sees the works and the soldiers together. | **KEEP** |
| 2 | 1 | PASS | — | What meets a stranger at {settlement} is the works, and the soldiers. | **KEEP** |
| 2 | 2 | FAIL | OV-34 (referent table) with ADDENDUM 13 A.5 as re-cut; W15 the alias bar; alias A-4 | At {settlement} a stranger sees both the muster and the works. | **REVERT** |
| 2 | 3 | WITHHELD | skeleton VARIANT 2 (4) and (7) - the conjunction carrier; 21.4 read against the draft | The stranger finds the town's force. | **KEEP** |
| 3 | 0 | PASS | — | The town has the works, and the muster besides. | **KEEP** |
| 3 | 1 | FAIL | W20 (the layer bar) with entailment item 1 and ADDENDUM 13 A.5 (manning NOT ENTAILED); R-DA-22 | The works are up, and the soldiers are standing. | **REVERT** |
| 3 | 2 | PASS | — | The town keeps its works. In the town stand the soldiers. | **KEEP** |
| 3 | 3 | PASS | — | What the town holds is the works, and the town's force. | **KEEP** |

- **v2 f2 — REVERT.** RULE 1: the refuter records that the draft face seated the possessor ("the town's force") and that the refinement unseated the class word while shortening the line; the draft face carries no unseated "muster" and is clean of the named ground.
  - refined: “At {settlement} a stranger sees both the muster and the works.”
  - draft (restored): “At {settlement} a stranger sees both the town's force and the works the town has built.”
- **v2 f3 — KEEP.** KEPT: unproven - the visitor's single arrival and the repeated eye do place both reads in one seeing, and the skeleton's own stance line reads the eye as the unifier. Recorded as the thinnest conjunction of the twelve, with the refuter's conditional cure.
- **v3 f1 — REVERT.** RULE 1: the refuter names the draft's own half as the lawful one ("The draft's lawful half here was 'Soldiers are in the town'") and its cure restores exactly that placement; the draft face predicates no posture of persons and is clean.
  - refined: “The works are up, and the soldiers are standing.”
  - draft (restored): “Soldiers are in the town, and the works stand with them.”

### 9. `ds-def-2--invasion-war-walls-with-citizen-militia`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[unfolding]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 7 · WITHHELD 1 · PASS 4. Disposition: 1 reverted · 6 cure target(s) · 5 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | Walls at {settlement} with townspeople behind them, a part-time force | **KEEP** |
| 1 | 1 | FAIL | 21.4 THE DENSITY LAW (the refinement regression), with MOVE-GRAMMAR 1.4.1 THE THREAD and the register card | has walls, and the militia is part-time, drawn from the townspeople | **REVERT** |
| 1 | 2 | WITHHELD | ADDENDUM 13 A item 1 with entailment D-1 / D-3 against D-6's ratified generic | and so are the walls the town has built | **KEEP** |
| 1 | 3 | FAIL | the licence card's REFUSED COLUMNS (a totality over persons; an exemption from a duty), ADDENDUM 13 A item 1 with D-8, and W2 | the force entered with them is the townspeople, part-time | **CURE** |
| 2 | 0 | FAIL | the card's REFUSED COLUMNS (a totality over persons), ADDENDUM 13 A item 1 with D-8, and W2 - aggravated by the intensifier | The force behind the walls is the townspeople themselves | **CURE** |
| 2 | 1 | FAIL | the card's REFUSED COLUMNS (a totality over persons), ADDENDUM 13 A item 1 with D-8, and W2 | what turns out behind them is the townspeople, part-time | **CURE** |
| 2 | 2 | FAIL | the card's REFUSED COLUMNS (a totality over persons), ADDENDUM 13 A item 1 with D-8, and W2 | The townspeople turn out part-time behind the town's walls. | **CURE** |
| 2 | 3 | PASS | — | The townspeople in it turn out and go back to their own work. | **KEEP** |
| 3 | 0 | FAIL | the card's REFUSED COLUMNS (a totality over persons), ADDENDUM 13 A item 1 with D-8, and W2 | the town's force with them is the townspeople, raised part-time | **CURE** |
| 3 | 1 | PASS | — | and behind them is a force of the townspeople. It is part-time | **KEEP** |
| 3 | 2 | FAIL | the card's REFUSED COLUMNS (a totality over persons), ADDENDUM 13 A item 1 with D-8, and W2 | the townspeople behind them are the town's force, raised part-time | **CURE** |
| 3 | 3 | PASS | — | That force is a militia of the townspeople, part-time. | **KEEP** |

- **v1 f1 — REVERT.** RULE 1: the draft face carries the relational carrier the refinement struck ("the muster behind them is part-time") and leaves no unbound definite on the spine, so it is clean of both named grounds; the refuter offers the draft's "behind them" as one of its two cures. The lawful gain the refinement made ("the militia" for "the muster") is not a claim and is not protected against rule 1.
  - refined: “The town of {settlement} has walls, and the militia is part-time, drawn from the townspeople.”
  - draft (restored): “The town of {settlement} has walls, and the muster behind them is part-time, drawn from the townspeople.”
- **v1 f2 — KEEP.** KEPT: the entailment table contradicts itself on whether the building of a wall is entailed (D-6 ratifies the free relative; D-1/D-3 list "who built it" as NOT ENTAILED), and no block ruling of the chair's settles it. Recorded for the chair with the refuter's one-phrase cure.
- **v1 f3 — CURE.** RULE 4: the draft face carries the same definite-plural equative ("the force behind them is the townspeople, part-time"), so the totality stands in the draft.
  - cure: Break the co-extension without adding a claim: drop the article - "and the force entered with them is townspeople, part-time" (the shipped clause's own bare-plural form).
- **v2 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: "The force behind the walls is drawn from the townspeople, a part-time muster that turns out off its own work" - the partitive is D-8's own relation, costs no claim, and keeps "turn out", the pool's one shipped compression.
- **v2 f1 — CURE.** RULE 4: the draft face carries the breaching clause verbatim ("what turns out behind them is the townspeople, part-time").
  - cure: Drop the article - "and what turns out behind them is townspeople, part-time"; the free relative, "behind them" and the landing all stand.
- **v2 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Drop the article - "Townspeople turn out part-time behind the town's walls." Nine words, no comma, both reads, the possessor still seated on the town.
- **v3 f0 — CURE.** RULE 4: the draft face carries the same definite equative ("the force behind them is the townspeople, part-time and off their own work").
  - cure: Drop the article - "and the town's force with them is townspeople, raised part-time off their own work"; nothing else moves.
- **v3 f2 — CURE.** RULE 4: the draft face carries the same definite-class equative ("the townspeople behind them are the town's force, part-time").
  - cure: Put the force on the subject and the bare plural in the predicate - "and the force behind them is townspeople, raised part-time"; this also widens the distance from face 0.

### 10. `ds-def-2--invasion-war-walls-with-no-force`

Variants: 1 `[ledger]` · 2 `[visitor]` · 3 `[street]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 4 · WITHHELD 1 · PASS 7. Disposition: 1 reverted · 3 cure target(s) · 8 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | The works at {settlement} are entered as standing | **KEEP** |
| 1 | 1 | FAIL | W4 the construction contract; skeleton 1.5 (the angle's stance); the skeleton rule | No force stands at {settlement}, and what stands is the works. | **CURE** |
| 1 | 2 | WITHHELD | A5 / the four-faces rule (the faces differ in construction) | Set down at {settlement} are the works standing | **KEEP** |
| 1 | 3 | PASS | — | At {settlement} the town carries no force of its own | **KEEP** |
| 2 | 0 | PASS | — | A stranger at {settlement} sees the works standing and no force at them. | **KEEP** |
| 2 | 1 | PASS | — | To a stranger at {settlement} the works stand | **KEEP** |
| 2 | 2 | PASS | — | A stranger finds no force at {settlement}, and the works standing. | **KEEP** |
| 2 | 3 | FAIL | W27 the angle-tag bar (a stranger may see, never act); skeleton 2.5 and 2.7 | A stranger comes to the town of {settlement} and sees | **CURE** |
| 3 | 0 | PASS | — | The town has the works and neither a garrison nor a militia to hold them. | **KEEP** |
| 3 | 1 | PASS | — | What the town has built stands, and the town keeps no garrison | **KEEP** |
| 3 | 2 | FAIL | the density law 21.4 read against the DRAFT and the SHIPPED; skeleton 4.5 (the inventory line); skeleton 3.7 | The town's works stand. | **REVERT** |
| 3 | 3 | FAIL | A5 / the four-faces rule (a face that differs from its sibling in vocabulary only) | The works stand, and the town has no garrison and no militia. | **CURE** |

- **v1 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Restore the office's surface inside the same cleft, one word, leaving the turn, the length and the claim set untouched: "No force stands at {settlement}, and what stands entered is the works."
- **v1 f2 — KEEP.** KEPT: two of the three named discriminators match face 0, but the face is held up by syntax the discriminator list does not name (a locative inversion with a gapped verbless conjunct against a canonical passive), so the breach is not proven. Recorded as the pool's closest sibling pair with the refuter's conditional cure.
- **v2 f3 — CURE.** RULE 4: the draft face carries the same motion predicate on the stance noun ("A stranger comes to {settlement} and sees the works"), so the breaching clause stands in the draft.
  - cure: Place the eye rather than move it, keeping the naming form, the thread, the two-sentence construction and the claim set: "A stranger at the town of {settlement} sees the works. No garrison and no militia stand in the town."
- **v3 f2 — REVERT.** RULE 1: the refuter records that the draft closed this face on a turn ("and what it has is the works") and that the refinement replaced it with a flat four-word declarative for a tic ration that is a law for removing a cleft, not for spending a sentence on plainness; the draft face is clean of the density and inventory grounds and keeps the variant's one reversed read order.
  - refined: “The town is without a garrison and without a militia. The town's works stand.”
  - draft (restored): “The town is without a garrison and without a militia, and what it has is the works.”
- **v3 f3 — CURE.** J-2(c): the draft face is not clean once installed - its first sentence ("The town has the works.") repeats the KEPT face 0's first five words, and its second sentence ("The town keeps no garrison and no militia.") is verbatim the KEPT face 1's second clause, so the revert installs the very A5 fault the verdict names, twice over.
  - cure: Put the face on a construction no sibling holds and restore the skeleton's compression at the same short length, adding no claim: "The works stand, and not the force to hold them."

### 11. `ds-def-2--invasion-war-force-with-no-walls`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 3 · WITHHELD 0 · PASS 9. Disposition: 0 reverted · 3 cure target(s) · 9 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | {settlement} carries a standing force and no perimeter. | **KEEP** |
| 1 | 1 | PASS | — | are entered at {settlement}, and the town keeps no works | **KEEP** |
| 1 | 2 | PASS | — | A force is carried standing at {settlement} | **KEEP** |
| 1 | 3 | FAIL | A11 sibling distance / the same-page C7; the register card; 21.4 | The muster stands at {settlement}, a town with no wall. | **CURE** |
| 2 | 0 | PASS | — | The town's defense is people rather than works. | **KEEP** |
| 2 | 1 | PASS | — | This place is defended by its own force and by no wall. | **KEEP** |
| 2 | 2 | PASS | — | What the town has under arms is people, and nothing built stands | **KEEP** |
| 2 | 3 | FAIL | Part B 21.4 the density law; and A11 / the same-page C7 | make up the defense here, and the place has no perimeter | **CURE** |
| 3 | 0 | PASS | — | A stranger sees a force under arms at {settlement} and no line. | **KEEP** |
| 3 | 1 | PASS | — | What a newcomer notices at {settlement} is a standing force | **KEEP** |
| 3 | 2 | FAIL | A11 / the same-page C7; the skeleton's word allocation | A traveller comes upon people under arms at {settlement}. | **CURE** |
| 3 | 3 | PASS | — | The force a stranger meets at {settlement} stands in a place | **KEEP** |

- **v1 f3 — CURE.** RULE 4: the draft face is CLOSER to the same-page twin than the refined one - it carries "an unwalled town", the twin's own words - so the breaching collision stands in the draft and is worse there.
  - cure: Take the face off the twin's ledger subject-and-verb while keeping the appositive and the ratified class word: "A muster is entered at {settlement}, a town with no wall." Re-spread v1's four force verbs if "entered" then doubles with face 1.
- **v2 f3 — CURE.** RULE 4: the draft face restores the compression but carries "this unwalled town" - the twin's own word, which the refiner was right to drop - and keeps the twin's three-word opener, so the same-page limb of the named law stands in the draft.
  - cure: Restore the single-verb attributive so both reads ride one verb again and move the opener off the twin's street row: "A force under arms makes up the defense of this town, no wall standing about it." Keep the variant slotless.
- **v3 f2 — CURE.** RULE 4: the draft face carries the same three load-bearing choices (the verb "comes upon", the force noun "people under arms", and the wall word in "The town shows no wall"), so the collision stands in the draft.
  - cure: Keep the two-sentence form and the thread and drop the two items the twin holds beside the verb: "A traveller comes upon the town's force at {settlement}. The town shows no perimeter." Re-spread v3's four absence surfaces so none doubles inside the variant.

### 12. `ds-def-2--invasion-war-militia-only`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 9 · WITHHELD 0 · PASS 3. Disposition: 0 reverted · 9 cure target(s) · 3 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | FAIL | R-DA-03 (the qualification gets its own sentence, never a tail, never a third); the register card | on its own ground, in place of a professional garrison, with nothing | **CURE** |
| 1 | 1 | FAIL | R-DA-02 (a civic LACK is the first half only, stated flat, no completing contrast), with R-DA-03 | answers a raid on its own ground with no wall around the town | **CURE** |
| 1 | 2 | FAIL | W6 (no doubled beat: a clause that restates the read it follows is the summarising beat) | Those citizens stand with nothing built around the town. | **CURE** |
| 1 | 3 | FAIL | the licence card's may NOT (another civic object of the class force; a future); W25; R-DA-02 | answers a raid on their own ground, not a professional garrison | **CURE** |
| 2 | 0 | FAIL | W1 (a pronoun after a clause binds to that clause's nearest object); the ambiguity that opens a claim after the spine | It comes off their own work, and nothing is built around | **CURE** |
| 2 | 1 | FAIL | A5 / the four-faces rule (the faces differ in construction, never in vocabulary alone) | Townspeople make the muster at {settlement}, part-time and in place of | **CURE** |
| 2 | 2 | FAIL | A5 / the four-faces rule; R-DA-05 (the pool is the unit of spread) | and nothing is built around the town for them to hold | **CURE** |
| 2 | 3 | FAIL | R-DA-03 (never a tail, never a third); R-DA-18 (the antique air lives in the noun, never in the syntax) | part-time and not a professional garrison, off their own work and with | **CURE** |
| 3 | 0 | PASS | — | finds the town's own people at their work and no wall | **KEEP** |
| 3 | 1 | PASS | — | are what a stranger sees at {settlement}, and no wall stands | **KEEP** |
| 3 | 2 | FAIL | THE THREAD (MOVE-GRAMMAR 1.4.1; R-i); A5 | That muster is part-time and not a professional garrison. | **CURE** |
| 3 | 3 | PASS | — | are at their own work behind no wall | **KEEP** |

- **v1 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Cut R1 into its own sentence carrying a noun forward: "A citizen militia at {settlement} answers a raid on its own ground, in place of a professional garrison. Around the town nothing is built for that muster to stand behind."
- **v1 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Give R1 its own flat sentence and leave the raid clause unqualified: "...and it answers a raid on its own ground. No wall stands around the town."
- **v1 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Drop the restating clause and carry the noun forward inside the lack itself: "Around the town nothing is built for that muster to stand behind."
- **v1 f3 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Seat the contrast on the muster and re-cut the construction: "Citizens of {settlement}, not a professional garrison, make the muster that answers a raid on their own ground."
- **v2 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Seat the people as the subject of the consequence: "They come to it off their own work, and nothing is built around the town for them to hold."
- **v2 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Re-cut on a construction face 0 does not use, fronting the two entailments: "Part-time and off their own work, the townspeople of {settlement} make the muster instead of a professional garrison. The town has built nothing for them to hold."
- **v2 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Vary R1's surface on this face only: "...and the town has built nothing for that muster to hold."
- **v2 f3 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Break the sentence in two: "Townspeople are what turns out at {settlement}, part-time and not a professional garrison. They come to it off their own work, with nothing built around the town for them to hold."
- **v3 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Supply the antecedent and change the construction with it: "They muster part-time, instead of a professional garrison."

### 13. `ds-def-2--invasion-war-neither-walls-nor-force`

Variants: 1 `[ledger]` · 2 `[counterforce]` · 3 `[street]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 3 · WITHHELD 0 · PASS 9. Disposition: 1 reverted · 2 cure target(s) · 9 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | FAIL | the card's may NOT (a second fact, a future); the block's fence (presence is standing, no recorded history) | {settlement} is entered with no wall and no force. | **CURE** |
| 1 | 1 | PASS | — | For war, the town of {settlement} has no force and no works. | **KEEP** |
| 1 | 2 | PASS | — | Neither garrison nor militia is kept at {settlement}, and no wall stands. | **KEEP** |
| 1 | 3 | PASS | — | The town of {settlement} stands unwalled. | **KEEP** |
| 2 | 0 | PASS | — | Against an army, {settlement} has neither wall nor force. | **KEEP** |
| 2 | 1 | PASS | — | What {settlement} has for war is no wall and no muster. | **KEEP** |
| 2 | 2 | PASS | — | At {settlement} the town keeps no force and stands with no wall. | **KEEP** |
| 2 | 3 | PASS | — | No muster is kept at {settlement} against a force in order. | **KEEP** |
| 3 | 0 | PASS | — | The place has no wall about it and keeps no force. | **KEEP** |
| 3 | 1 | PASS | — | Unwalled, the town keeps no force against an army. | **KEEP** |
| 3 | 2 | FAIL | R-DA-19 and the block's fence (no recorded history) + ENTAILMENT alias trap A-4 | the town is without a muster or a wall. | **CURE** |
| 3 | 3 | FAIL | ENTAILMENT D-6 / alias trap A-7 (continuity NOT ENTAILED of the wall class) + THE SKELETON RULE + 21.4 read against the DRAFT | no wall rings the town. | **REVERT** |

- **v1 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Swap the verb for an office formula that cannot read as entry by force, keeping the nine-word shape and both limbs on one negated surface: "{settlement} is set down with no wall and no force."
- **v3 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Drop the article and let the two class words run bare, keeping the preposition-carried negation and the close on the wall: "Against war, the town is without muster or wall."
- **v3 f3 — REVERT.** RULE 1: the refuter records that the draft carried the presence verb ("no wall stands about the place") and that the refinement traded it for an enclosure verb to win a concrete image; the draft face states R1 at its full width and is clean of D-6/A-7. NOTE for the re-refutation: the refuter's PASS note on face 0 warns a curer not to import the "about" locative a second time inside this variant; the revert does import it, and the refuter's own cure ("and no wall stands.") is the draft minus three words if the chair prefers it.
  - refined: “This town keeps no force, and no wall rings the town.”
  - draft (restored): “This town keeps no force, and no wall stands about the place.”

### 14. `ds-def-2--internal-security-full-legal-chain-court-and-pri`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 6 · WITHHELD 0 · PASS 6. Disposition: 1 reverted · 5 cure target(s) · 6 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | The town's law at {settlement} stands entered, and so does | **KEEP** |
| 1 | 1 | FAIL | the owner's four-faces rule (A5); W4 the construction contract | In the town of {settlement} the law is entered | **REVERT** |
| 1 | 2 | FAIL | the card's may NOT: a second fact, reached through the spatial reading of the entering verb on a place noun | A place where a person can be held is entered at | **CURE** |
| 1 | 3 | PASS | — | People can be held at {settlement}; the town's law stands entered | **KEEP** |
| 2 | 0 | FAIL | ADDENDUM 13 part A item 6 on D-15 (a CONDITIONAL used without its condition resolved); W14; the card's may NOT: a second fact | A thing done wrong at {settlement} goes to the town's law | **CURE** |
| 2 | 1 | FAIL | as face 0 (D-15 CONDITIONAL unresolved, ADDENDUM 13 A.6; W14) | a wrong done there goes to the town's law | **CURE** |
| 2 | 2 | FAIL | W14 the label bar; D-15 CONDITIONAL unresolved (ADDENDUM 13 A.6) | the town has its law to hand for a wrong done there | **CURE** |
| 2 | 3 | FAIL | W14; D-15 CONDITIONAL unresolved; R-DA-04; W15 / the referent table's ratified surface | the town has law to hand for what is done wrong there | **CURE** |
| 3 | 0 | PASS | — | finds the town's law standing, and finds a place where | **KEEP** |
| 3 | 1 | PASS | — | What a stranger finds standing at {settlement} is a place where | **KEEP** |
| 3 | 2 | PASS | — | To a stranger at {settlement} the town's law stands, and a | **KEEP** |
| 3 | 3 | PASS | — | On arrival at {settlement} a stranger finds a place of confinement | **KEEP** |

- **v1 f1 — REVERT.** RULE 1: the refuter records that the draft declared this face's subject as THE TOWN and that the refinement moved it onto its sibling's subject, which W4 calls the regression; the draft face also seats the possessor ("its law"), so the secondary bare-"the law" ground is clear too.
  - refined: “In the town of {settlement} the law is entered, and people can be held there.”
  - draft (restored): “At {settlement} the town has its law entered, and a place where people can be held.”
- **v1 f2 — CURE.** RULE 4: the draft face carries the identical breaching clause ("A place where a person can be held is entered at {settlement}").
  - cure: Take the entering verb off the place-noun and use the office's other formula: "A place where a person can be held is carried standing at {settlement}. The law that town keeps is entered." No record noun is introduced.
- **v2 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Keep the shipped frame, the variant's declared construction and density floor, but make its predicate a licensed read: "Where a wrong is done at {settlement}, the town's law stands, and the town keeps a place of confinement."
- **v2 f1 — CURE.** RULE 4: the draft face carries the same movement predicate ("what is done wrong there goes to the town's law").
  - cure: Same cure, order and subject kept: "The town of {settlement} can hold a person, and where a wrong is done the town's law stands."
- **v2 f2 — CURE.** J-3 and the same named ground: the draft face carries "A wrong done at {settlement} goes to the town's law" - the very movement predicate this refuter fails at faces 0 and 1 of this pool - so a revert installs a wording the pool's own verdicts convict.
  - cure: Drop the purpose phrase only: "At {settlement} the town has its own law to hand. A person can be held in that town." Construction, subject, read order, sentence count and thread all survive untouched.
- **v2 f3 — CURE.** RULE 4: the draft face carries the third named ground verbatim - the article-less "The town has law to hand at {settlement}", which makes the court read a mass noun where the ratified surface is the possessed function word.
  - cure: Drop the phrase, restore the possessor, and close on the read's own noun: "A person can be held at {settlement}, and the town keeps its own law to hand."

### 15. `ds-def-2--internal-security-court-without-detention`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[unfolding]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 4 · WITHHELD 0 · PASS 8. Disposition: 1 reverted · 3 cure target(s) · 8 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | Formal law stands entered at {settlement}, and the town holds no gaol. | **KEEP** |
| 1 | 1 | PASS | — | The town of {settlement} is entered with formal law | **KEEP** |
| 1 | 2 | FAIL | W4 (the construction contract) with skeleton 1.7 A LOST ANGLE | The town carries nothing to hold under that law. | **CURE** |
| 1 | 3 | FAIL | skeleton 1.7 A LOST ANGLE / W4; secondarily the card's REFUSED COLUMNS (a totality) | What {settlement} keeps is formal law, and no prison. | **CURE** |
| 2 | 0 | PASS | — | The town's law is formal; the town keeps no gaol. | **KEEP** |
| 2 | 1 | FAIL | A5 / the four-faces rule (a sibling paraphrase past a synonym swap) | Here the law is formal, and the town is without a place | **REVERT** |
| 2 | 2 | PASS | — | This town's law is formal. Beneath that law the town has nowhere to hold. | **KEEP** |
| 2 | 3 | PASS | — | Law here is formal, and under it stands no gaol. | **KEEP** |
| 3 | 0 | PASS | — | Law is formal at {settlement}, and its holding half stands open. | **KEEP** |
| 3 | 1 | FAIL | the card's may NOT (a second fact) with ENTAILMENT D-15 (sentencing and enforcement NOT ENTAILED) and W14 | detention stands unmet. | **CURE** |
| 3 | 2 | PASS | — | Law stands formal at {settlement}. | **KEEP** |
| 3 | 3 | PASS | — | The law {settlement} keeps is formal, and a place of confinement is wanting. | **KEEP** |

- **v1 f2 — CURE.** RULE 4: the draft face carries the same office-less clause in substance ("Beside that law the town carries nothing to hold under"), so the dropped-angle ground stands in the draft.
  - cure: Put the office's own formula on the second sentence, claims unmoved: "At {settlement} the law is formal in its standing. On that standing no gaol is carried."
- **v1 f3 — CURE.** RULE 4: the draft face carries the same exhaustive pseudo-cleft and the same street verb with no ledger surface ("What {settlement} keeps is formal law, and it keeps no gaol").
  - cure: Restore the office's formula inside the cleft, claims and landing noun unmoved: "What {settlement} carries standing is formal law, and no prison."
- **v2 f1 — REVERT.** RULE 1: the draft face is off face 0's two-subject clause pattern - its second limb is an existential with a different landing ("there is nowhere in the town to hold under that law") - so two of the three named axes move and it is clean of the A5 ground. NOTE for the re-refutation: after the revert "nowhere ... to hold" stands in two of the variant's four faces (this one and face 2); the curer of any later round should spread it.
  - refined: “Here the law is formal, and the town is without a place of confinement.”
  - draft (restored): “Here the law is formal, and there is nowhere in the town to hold under that law.”
- **v3 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Seat the subject on the thing, rhythm and OPEN realisation unmoved: "Under formal law at {settlement}, a place of detention stands unmet."

### 16. `ds-def-2--internal-security-detention-without-process`

Variants: 1 `[ledger]` · 2 `[visitor]` · 3 `[street]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 3 · WITHHELD 1 · PASS 8. Disposition: 0 reverted · 3 cure target(s) · 9 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | A person can be held at {settlement} and brought before no court. | **KEEP** |
| 1 | 1 | FAIL | the card's may NOT (a fact the record does not hold); ADDENDUM 13 A item 1 with D-16 NOT ENTAILED (anyone currently held); skeleton 4.3; W6 | no court sits to try a person held | **CURE** |
| 1 | 2 | PASS | — | Cells at {settlement} are carried as standing, and the town keeps no court. | **KEEP** |
| 1 | 3 | FAIL | the card's may NOT; D-16 NOT ENTAILED (anyone currently held); W6 | no court names the ground for keeping that person | **CURE** |
| 2 | 0 | PASS | — | A stranger at {settlement} finds cells to hold a person | **KEEP** |
| 2 | 1 | FAIL | A5 / the four-faces rule; A11 (no two faces of one variant open alike); W4 | A traveller at {settlement} sees cells, and sees no court. | **CURE** |
| 2 | 2 | PASS | — | ...finds this is not a town with a court. | **KEEP** |
| 2 | 3 | WITHHELD | the card's may NOT: a second fact; W8 (a read carried as a thing's STANDING STATE) | the cells are plain | **KEEP** |
| 3 | 0 | PASS | — | The town can put a person away at {settlement}... | **KEEP** |
| 3 | 1 | PASS | — | The cells at {settlement} can keep a person... | **KEEP** |
| 3 | 2 | PASS | — | ...and nothing goes before a court. | **KEEP** |
| 3 | 3 | PASS | — | People can be locked up at {settlement}, and no court has a say. | **KEEP** |

- **v1 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Cut the participle and keep the clause court-bound: "..., and no court sits to hear a charge." The charge is the absent court's own function-object and asserts nothing of this town; no claim added.
- **v1 f3 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Stop the face at the licensed re-cut: "A gaol at {settlement} can take a person in, and no court names the ground." Five words out, no claim lost.
- **v2 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Rebuild on a construction no sibling uses, adding no claim - the cleft, the family's own shape: "What a traveller comes upon at {settlement} is the gaol, and no court." It opens unlike face 0, widens the presence vocabulary and gives the pool the clipped line the register card asks to exist.
- **v2 f3 — KEEP.** KEPT: suspected and not proven - the visitor angle's whole licence is what is seen on arrival, and "plain" may fairly be read as the flattest surface of the seeing rather than a new fact about the cells. The refuter's conditional cure is recorded for the chair.

### 17. `ds-def-2--internal-security-no-legal-infrastructure`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 5 · WITHHELD 1 · PASS 6. Disposition: 3 reverted · 2 cure target(s) · 7 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | Neither a court to try a charge nor | **KEEP** |
| 1 | 1 | FAIL | skeleton 0.7 (c) TOTALITY over the read; the card's may NOT: a second fact; CLERK-LAWS C2 | What stands at {settlement} against a wrong done inside the town | **CURE** |
| 1 | 2 | FAIL | W3 (the band marker) and W5 read against CLERK-LAWS C2; skeleton 0.4 | The town of {settlement} is entered with no gaol | **CURE** |
| 1 | 3 | PASS | — | are what {settlement} does without | **KEEP** |
| 2 | 0 | PASS | — | A wrong done here comes before no court | **KEEP** |
| 2 | 1 | PASS | — | Here the town keeps no court against a quarrel | **KEEP** |
| 2 | 2 | FAIL | A5 / the four-faces rule and W4's construction contract | For a wrong done here this town keeps no court | **REVERT** |
| 2 | 3 | WITHHELD | the [street] stance grain read against the cross-variant echo of v1's row construction; A11's echo bound | Neither the court a charge would come before nor the cell | **KEEP** |
| 3 | 0 | PASS | — | A stranger who comes to {settlement} with a complaint finds | **KEEP** |
| 3 | 1 | PASS | — | The court a stranger would look for at {settlement} | **KEEP** |
| 3 | 2 | FAIL | the ambiguity that opens an unlicensed reading after the spine (R-DA-18); the card's may NOT: a standpoint | no cell stands for the one a charge names | **REVERT** |
| 3 | 3 | FAIL | R-DA-11 (no intent or feeling for a collective thing) and W23, reached through the ambiguity of the noun; the card's may NOT: a standpoint | the town's want of a court | **REVERT** |

- **v1 f1 — CURE.** RULE 4: the draft face carries the identical exhaustive cleft frame verbatim ("What stands at {settlement} against a wrong done inside the town is neither a cell ... nor a court ...").
  - cure: Drop the exhaustive frame and keep the matter as an adjunct: "Against a wrong done inside the town {settlement} keeps no court to try it, and no cell."
- **v1 f2 — CURE.** J-2(c): the draft face is clean of the band word but is not clean once installed - it is "Neither a court for a charge nor a cell for the one it names is entered as standing at {settlement}", which is the KEPT face 0's whole frame with the two relation spellings swapped (the refinement rotated the variant's wordings), so the revert installs an A5 twin of the numbered line.
  - cure: Drop the band word, keep the formula, the slot and the read order, and stay off face 0's correlative frame: "The place, {settlement}, is entered with no gaol to hold under an offence and no court to try the offence."
- **v2 f2 — REVERT.** RULE 1: the draft face is a wholly different construction - an absence-subject clause with a gapped second conjunct ("No cell here holds the one a charge names, and no court the charge") - and is clean of the named A5 ground against face 1. The cross-variant echo with variant 3's face 2 is the very thing this refuter declines to convict (its own WITHHELD at v2 f3 records that no ratified law names cross-variant construction echo).
  - refined: “For a wrong done here this town keeps no court to try it, and no place of confinement.”
  - draft (restored): “No cell here holds the one a charge names, and no court the charge.”
- **v2 f3 — KEEP.** KEPT: neither ground is proven - unclarity alone is not a finding, and the within-variant four-faces rule does not reach across variants. Recorded for the chair with the refuter's conditional cure.
- **v3 f2 — REVERT.** RULE 1: the draft face carries no "stands for" idiom ("no cell holds the one a charge names and no court hears the charge") and is clean of the named ground; with face 3 also reverting, the variant is left with one wh-cleft and not two.
  - refined: “To a stranger at {settlement} no cell stands for the one a charge names, and no court for the charge.”
  - draft (restored): “What a stranger notices first at {settlement} is that no cell holds the one a charge names and no court hears the charge.”
- **v3 f3 — REVERT.** RULE 1: the draft face carries no "want" noun and seats no desire on the town ("A stranger's complaint at {settlement} finds no court, and the one it names no cell"), so it is clean of the named ground. NOTE for the re-refutation: the draft seats the finding on the complaint rather than on the stranger's eye; if a later refuter reads that as an inanimate agent under the same R-DA-11, the face becomes a cure target rather than a second revert.
  - refined: “What a stranger sees at {settlement} is the town's want of a court and of a place of confinement.”
  - draft (restored): “A stranger's complaint at {settlement} finds no court, and the one it names no cell.”

### 18. `ds-def-2--economic-survival-strong`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[counterforce]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 4 · WITHHELD 1 · PASS 7. Disposition: 3 reverted · 1 cure target(s) · 8 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | FAIL | REGISTER CARD costume wall; R-DA-18; W22 by ambiguity (a person as agent); a regression against the draft | Entered at {settlement}, holding through a crisis is strong. | **REVERT** |
| 1 | 1 | PASS | — | What {settlement} would bear in a crisis is entered as well covered. | **KEEP** |
| 1 | 2 | FAIL | R-DA-07 (THE PRESENT STANDS; a standing capacity, never an event), with the card's may-NOT 'a season' and skeleton 8 (W18) | a pressure the town meets well | **CURE** |
| 1 | 3 | PASS | — | That {settlement} can absorb a crisis well is carried as standing. | **KEEP** |
| 2 | 0 | PASS | — | The town could go through a crisis well. | **KEEP** |
| 2 | 1 | FAIL | R-DA-07 (no perfect aspect on a standing fact; C3 STATE never FATE) with D-22; a regression against the draft | a pressure the town has well covered | **REVERT** |
| 2 | 2 | PASS | — | Strong is how the town carries a crisis. | **KEEP** |
| 2 | 3 | PASS | — | Where a crisis would have to be borne, the town is strong. | **KEEP** |
| 3 | 0 | PASS | — | What stands at {settlement} against a crisis is the town's carrying. | **KEEP** |
| 3 | 1 | WITHHELD | D-22 (the band word entails exactly the ladder's reading) - under test, unproven | The town is well covered for that pressure. | **KEEP** |
| 3 | 2 | PASS | — | The town of {settlement} can hold through a crisis. | **KEEP** |
| 3 | 3 | FAIL | W4 THE CONSTRUCTION CONTRACT read at the grain the four-faces rule states it, with A5 | What stands under that pressure is the town's carrying. | **REVERT** |

- **v1 f0 — REVERT.** RULE 1: the refuter names the draft line as the cure in terms and records that the refiner banked exactly this fallback and that nothing else in the pool moves with it; the draft's fronted "Through a crisis," binds the gerund verbally and opens on no participle, so it is clean of the named ground.
  - refined: “Entered at {settlement}, holding through a crisis is strong.”
  - draft (restored): “Through a crisis, holding is entered strong at {settlement}.”
- **v1 f2 — CURE.** RULE 4: the refuter records that the fault is "inherited in kind from the draft's 'carries'" and worsened in degree by the substitution - the draft face carries the same bare-present predication of the pressure, so the breaching construction stands in the draft.
  - cure: "Economic survival at {settlement} is set down as a pressure the town can meet well." One word added - the capability modal the card licenses - which keeps the round's verb-spread gain and adds no claim.
- **v2 f1 — REVERT.** RULE 1: the refuter names the draft line as the cure in terms ("Revert to 'A crisis is a pressure the town is well covered for.'") and records that the draft carried the ladder's own predication with no aspect at all; the alternative that would also kill the stranded preposition is refused because the parent's slot set is empty, so the revert IS the cure.
  - refined: “A crisis is a pressure the town has well covered.”
  - draft (restored): “A crisis is a pressure the town is well covered for.”
- **v3 f1 — KEEP.** KEPT: the ladder predicates "well covered" of the pressure and this face predicates it of the town, but the scope is explicit ("for that pressure"), no totality arises and no claim is added, so nothing is proven. The refuter's conditional cure is recorded for the chair.
- **v3 f3 — REVERT.** RULE 1: the refuter names the draft's second sentence as the cure in terms ("Revert the second sentence to 'The town's carrying is what stands under that pressure.'"); the draft face is the inverted construction that keeps this face distinct from its parent, and is clean of the named ground.
  - refined: “Well covered at {settlement} is the pressure of a crisis. What stands under that pressure is the town's carrying.”
  - draft (restored): “Well covered at {settlement} is the pressure of a crisis. The town's carrying is what stands under that pressure.”

### 19. `ds-def-2--economic-survival-adequate`

Variants: 1 `[ledger]` · 2 `[unfolding]` · 3 `[threshold]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 5 · WITHHELD 0 · PASS 7. Disposition: 0 reverted · 5 cure target(s) · 7 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | The capacity {settlement} holds against a crisis measures adequate. | **KEEP** |
| 1 | 1 | PASS | — | Against a crisis {settlement} is covered. The cover is thin at its edge. | **KEEP** |
| 1 | 2 | FAIL | W14 THE LABEL BAR (ADDENDUM 13 A B); the skeleton's label wall; the card's may-NOT 'a future'; A6 | Economic survival at {settlement} stands adequate. | **CURE** |
| 1 | 3 | PASS | — | Adequate is the word entered for {settlement} against a crisis. | **KEEP** |
| 2 | 0 | PASS | — | The town's capacity to meet a crisis is real | **KEEP** |
| 2 | 1 | FAIL | R-DA-11 THE FIGURE POLICY (nothing inanimate acts with intent); move 10's declarative form | the little margin is what that standing leaves open | **CURE** |
| 2 | 2 | FAIL | the card's may-NOT 'a future'; skeleton 8 (NO FORECAST, NO OUTCOME PAST THE EDGE); W14's label wall; R-DA-12 and W5; A6 | This town holds through an emergency on a little margin | **CURE** |
| 2 | 3 | PASS | — | What covers the town against a crisis holds | **KEEP** |
| 3 | 0 | PASS | — | Cover against a crisis is adequate at {settlement} | **KEEP** |
| 3 | 1 | PASS | — | A crisis would be met at {settlement}, and met on a little margin. | **KEEP** |
| 3 | 2 | FAIL | W1 POSSESSOR BINDING (ADDENDUM 12); the card's may-NOT, the edge LOCATED | in a crisis its edge would be close | **CURE** |
| 3 | 3 | FAIL | the card's may-NOT 'a future'; skeleton 8 (the refused list names 'would not hold'); W14's label wall; A6; 21.2 | the cover would hold by a narrow margin | **CURE** |

- **v1 f2 — CURE.** J-3: the draft face reads "Through a crisis the town of {settlement} holds" - the outcome-without-a-modal shape this same refuter FAILS at variant 2 face 2 of this same pool - so the revert installs a wording the pool's own verdicts convict.
  - cure: Take the refiner's own recorded fallback, which cures the label and the sibling closeness at once: "What {settlement} can meet in a crisis stands adequate. That standing sits on a narrow margin."
- **v2 f1 — CURE.** RULE 4: the draft face carries the same agentive abstraction ("what that standing leaves open is a little margin"), so the breaching construction stands in the draft.
  - cure: Recast the OPEN agentless, keeping the fronted adjunct and the information order R-iv wants: "Set against a crisis the town's standing is adequate, and the little margin is the part left standing open."
- **v2 f2 — CURE.** RULE 4: the draft face states the same outcome in the same bare present without a capability frame ("Here a crisis is met on a little margin"), so the habitual/outcome ground named in the law line stands in the draft.
  - cure: Restore the copular cover frame and keep everything else, including the face's own OPEN idiom: "This town is covered against an emergency on a little margin, and that margin stands open."
- **v3 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Move the adjunct off the front of the second clause so the possessive sits against its antecedent's clause, with no word added and no claim touched: "The covering at {settlement} stands, and its edge would be close in a crisis."
- **v3 f3 — CURE.** J-2(c): the draft face is clean of the outcome idiom but is not clean once installed - its close ("and the margin of the cover would be little") is the KEPT face 0's close with two words changed ("and the margin under it would be little"), so the revert trades a forecast for a sibling paraphrase inside the same variant.
  - cure: Keep the close on the object and the reach subjunctive, and drop the outcome verb for the standing one the pool already spends: "The town of {settlement} is covered against a crisis, and the cover would stand on a narrow margin."

### 20. `ds-def-2--economic-survival-weak`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[unfolding]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 6 · WITHHELD 0 · PASS 6. Disposition: 1 reverted · 5 cure target(s) · 6 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | Against a crisis the town of {settlement} is entered thinly covered | **KEEP** |
| 1 | 1 | FAIL | W15 the alias bar; W20 the layer bar; D-22; referent rule 3 with C7; A6 | The holding the town of {settlement} keeps against a crisis | **CURE** |
| 1 | 2 | FAIL | W23 the fused-agent bar, or W6 the doubled beat (one is broken on either reading); D-22 | The thin cover entered for {settlement} limits what the town can do | **CURE** |
| 1 | 3 | PASS | — | and that cover is entered weak | **KEEP** |
| 2 | 0 | PASS | — | what the town of {settlement} would have to meet a crisis with | **KEEP** |
| 2 | 1 | PASS | — | What cover the town of {settlement} has against a crisis is thin | **KEEP** |
| 2 | 2 | PASS | — | The capacity {settlement} has to hold through a crisis runs thin | **KEEP** |
| 2 | 3 | FAIL | W4 the construction contract; R-DA-05 the pool is the unit of spread; 21.2 | Under a real crisis the cover the town of {settlement} has | **CURE** |
| 3 | 0 | FAIL | W6 the doubled beat; R-DA-03 (the qualification gets its own sentence, never a tail); the register card | and a real one would strain that cover as things stand | **CURE** |
| 3 | 1 | FAIL | R-DA-03 (the tail); R-iv (the [unfolding] realises OPEN after the PRESENCE); MOVE-GRAMMAR row 10 | would strain that capacity as it stands | **CURE** |
| 3 | 2 | FAIL | R-DA-03 (the tail); R-iv; A5 and R-DA-05 (a cross-variant paraphrase past a synonym swap); the dropped angle | A real one would strain that cover where it stands | **REVERT** |
| 3 | 3 | PASS | — | and that cover now stands thin | **KEEP** |

- **v1 f1 — CURE.** RULE 4: the draft face keeps a holding-possession frame ("what the town holds against a crisis ... would strain what the town holds") one word off W15's own stores-row spelling, so the named alias ground applies to it on its face.
  - cure: Put the arm's own noun in the same seat and keep the two-sentence construction: "The cover the town of {settlement} keeps against a crisis is entered thin. A real crisis would strain that cover."
- **v1 f2 — CURE.** RULE 4: the draft face carries the identical clause, differing only in the joint that follows it.
  - cure: Predicate the band of the arm instead of letting it act on the arm, keeping the shipped noun phrase: "What the town of {settlement} can do in an emergency is entered as thin cover; a real crisis would strain that cover."
- **v2 f3 — CURE.** J-2(c): the draft face is clean of the construction ground but is not clean once installed - its second sentence ("A real one would strain that cover.") is VERBATIM the KEPT face 1's second sentence, which is the spread the same law line names (R-DA-05).
  - cure: Give the face a construction no sibling variant holds, in the street's plain idiom and without the fronted conditional: "The town of {settlement} would meet a crisis on weak cover, and a real one would strain that cover."
- **v3 f0 — CURE.** RULE 4 and J-3: the draft face carries the same shape - a standing tail hung on the subjunctive edge ("would strain it where it stands") - and "where it stands" is the very tail this refuter fails at face 2 of this variant.
  - cure: Strike the tail: "The cover {settlement} keeps against a crisis stands thin, and a real one would strain that cover." No claim added, none dropped, landing noun unchanged.
- **v3 f1 — CURE.** RULE 4: the draft face carries the identical tail ("would strain that capacity as it stands").
  - cure: Carry the standing onto the presence and strike the tail: "What the town of {settlement} could do about a crisis now stands thin, and a real one would strain that capacity." The shipped clause is kept verbatim.
- **v3 f2 — REVERT.** RULE 1: the draft face carries no tail and seats the standing on the presence ("what the town keeps now stands thin"), which is what R-iv asks; and it is not variant 1 face 0's frame, so the A5 limb does not reach it either. Clean of every named ground.
  - refined: “The town of {settlement} is thinly covered against a crisis. A real one would strain that cover where it stands.”
  - draft (restored): “A real crisis would strain what {settlement} keeps against one, and what the town keeps now stands thin.”

### 21. `ds-def-2--economic-survival-critical`

Variants: 1 `[ledger]` · 2 `[unfolding]` · 3 `[street]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 6 · WITHHELD 0 · PASS 6. Disposition: 3 reverted · 3 cure target(s) · 6 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | Economic survival is entered critical at {settlement}. | **KEEP** |
| 1 | 1 | FAIL | R-DA-03 (2nd-sentence summary) + 16 item 6's machine signature; R-DA-22 | Under that pressure the town stands effectively uncovered. | **CURE** |
| 1 | 2 | FAIL | R-i (the thread at k = 0) / MOVE-GRAMMAR 1.4.1 | The cover the town would have through a crisis | **REVERT** |
| 1 | 3 | FAIL | A5 / the four-faces rule (ADDENDUM 7 rule 4; W4) | Through that pressure the town's capacity could not hold. | **REVERT** |
| 2 | 0 | PASS | — | The capacity the town has against a crisis reads critical | **KEEP** |
| 2 | 1 | FAIL | W6 (no doubled beat); R-iv (the [unfolding] realises OPEN, never the ledger's measure) | reads critical, and the town now stands uncovered | **REVERT** |
| 2 | 2 | FAIL | MOVE-GRAMMAR row 10 (an OPEN QUESTION is a civic matter left standing open and NAMED) | and the matter is open now | **CURE** |
| 2 | 3 | FAIL | A5 / the four-faces rule (ADDENDUM 7 rule 4; W4) | The town's cover through a crisis stands at critical | **CURE** |
| 3 | 0 | PASS | — | Whatever the town of {settlement} has against a crisis | **KEEP** |
| 3 | 1 | PASS | — | The town of {settlement} could not hold through a crisis. | **KEEP** |
| 3 | 2 | PASS | — | A crisis would be more than the town of {settlement} could hold. | **KEEP** |
| 3 | 3 | PASS | — | Set against a crisis, the town of {settlement} has effectively no cover. | **KEEP** |

- **v1 f1 — CURE.** J-2(c): the draft face is clean of the summary ground but is not clean once installed - its first sentence ("Economic survival at {settlement} is entered critical.") is the KEPT face 0's own first sentence with the slot moved, so the revert installs a near-verbatim twin of the numbered line inside one variant.
  - cure: Let sentence two carry the part of the read sentence one lacks, as face 0 does, and name the town once: "The capacity is entered critical at {settlement}. So entered, the town stands effectively uncovered against a crisis."
- **v1 f2 — REVERT.** RULE 1: the draft face's second sentence opens on "The town", which co-refers with the slot standing in its own first sentence and so carries the noun forward under J-1; the fronted-band inversion of its first sentence is already the status quo, so the revert installs no new twin. Clean of the named ground.
  - refined: “Critical is the standing entered at {settlement} on economic survival. The cover the town would have through a crisis is effectively none.”
  - draft (restored): “Critical is the standing entered at {settlement} for economic survival. The town cannot hold through a crisis.”
- **v1 f3 — REVERT.** RULE 1: the draft face runs the two sentences in the reverse order (the edge first, the band last) on a fronted participial with a different subject and landing, so it is not face 1's frame and is clean of the named ground; the office's formula recurring across the variant is expressly licensed by the register card.
  - refined: “The cover {settlement} has against a crisis is entered critical. Through that pressure the town's capacity could not hold.”
  - draft (restored): “Measured against a crisis, the cover the town of {settlement} keeps would not hold. The town's economic survival is entered critical.”
- **v2 f1 — REVERT.** RULE 1: the draft face carries no band word at all and realises the OPEN on a NAMED matter ("For a crisis the town has no cover, and that want goes on standing"), so it is clean of both named grounds.
  - refined: “Against a crisis the town's cover reads critical, and the town now stands uncovered.”
  - draft (restored): “For a crisis the town has no cover, and that want goes on standing.”
- **v2 f2 — CURE.** J-3: the draft face at this index is the refinement's own rotation source - it reads "the town's cover reads critical, and the town now stands uncovered", which is exactly the W6 doubled beat this same refuter FAILS at variant 2 face 1, so the revert installs a wording the pool's own verdicts convict.
  - cure: Name it, in this face's own vocabulary: "...would not hold, and the want of cover is open now." One word class changes; no claim is added, and the face keeps its distinction as the pool's one wording with no band word.
- **v2 f3 — CURE.** J-3 and the same named ground: the draft face ("What the town could set against a crisis reads critical, and stands unmet") runs face 0's own band verb in face 0's order and closes on an UNNAMED matter, which this refuter fails at face 2 on move-grammar row 10; the revert cures neither limb.
  - cure: Change the construction, not the band surface: put the open matter first or make the pressure the subject, and land on a different noun - e.g. "What the crisis would find at the town's cover is entered critical, and that want stands open" (or any shape whose subject and landing differ from face 0's).

### 22. `ds-def-2--disasters-famine-granary-and-hospital`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[counterforce]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 4 · WITHHELD 1 · PASS 7. Disposition: 2 reverted · 2 cure target(s) · 8 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | The granary at {settlement} is entered as standing | **KEEP** |
| 1 | 1 | PASS | — | Those tending the sick are set down at {settlement} as standing | **KEEP** |
| 1 | 2 | FAIL | A5 / the four-faces rule and 21.4's regression arm against the draft | Those tending the sick are entered with it, against sickness. | **REVERT** |
| 1 | 3 | PASS | — | Entered as standing at {settlement} are those tending the sick | **KEEP** |
| 2 | 0 | PASS | — | The town has a place for grain against hunger | **KEEP** |
| 2 | 1 | PASS | — | Grain has its place in the town against hunger | **KEEP** |
| 2 | 2 | PASS | — | What the town has against hunger is a place for grain | **KEEP** |
| 2 | 3 | FAIL | the licence card's may NOT (a second fact) with D-12 and D-13's own scopes | the town has these against hunger and sickness. | **CURE** |
| 3 | 0 | WITHHELD | W17/W18 and the card's may NOT (no stress record is on this card; a famine is never an event here) | Against hunger at {settlement} stands a granary where grain | **KEEP** |
| 3 | 1 | FAIL | R-DA-03 (the qualification is a sentence, never a tail) with the skeleton's read law; 21.4 against the draft | and the granary where grain is stored against hunger. | **REVERT** |
| 3 | 2 | PASS | — | What stands against hunger at {settlement} is a granary | **KEEP** |
| 3 | 3 | FAIL | W17/W18 and the card's may NOT (a live pressure at this town is held by no field), with W20/W23 and R-DA-11 | Hunger at {settlement} has a place for grain standing against it | **CURE** |

- **v1 f2 — REVERT.** RULE 1: the refuter names the draft's clause as the cure in terms ("Restore the draft's clause: 'Those tending the sick are entered with the granary, against sickness.'") and records the noun echo as licensed for the thread; the draft face is clean of the named ground on the refuter's own reading.
  - refined: “A granary stands at {settlement} and grain is stored in it against hunger. Those tending the sick are entered with it, against sickness.”
  - draft (restored): “A granary stands at {settlement} and grain is stored in it against hunger. Those tending the sick are entered with the granary, against sickness.”
- **v2 f3 — CURE.** RULE 4: the draft face carries the same cross-pairing ("the town has these against hunger and against sickness").
  - cure: Distribute the pressures inside the fronted pair and let the resumptive close: "A place for grain against hunger and those tending the sick against sickness, the town has these."
- **v3 f0 — KEEP.** KEPT: unproven - the dominant parse is two fronted sentence adjuncts, and the constituent reading that would locate a live pressure in the town is available but not established. Recorded because this is the line a falsy seed draws, with the refuter's conditional cure.
- **v3 f1 — REVERT.** RULE 1: the refuter records that the draft carried no such strand ("and against hunger the granary where grain is stored") and that the refinement moved the pressure clause-final and broke the clause doing it; the draft face states the read with its own predicate and is clean.
  - refined: “Those who tend the sick stand against sickness at {settlement}, and the granary where grain is stored against hunger.”
  - draft (restored): “Those who tend the sick stand at {settlement} against sickness, and against hunger the granary where grain is stored.”
- **v3 f3 — CURE.** RULE 4: the draft face carries the same located-pressure subject verbatim ("Hunger at {settlement} has a granary standing against it").
  - cure: Strike the locative from the pressure and restore the draft's second "has": "Hunger has a place for grain standing against it at {settlement}, and sickness has those tending the sick." The pressure-as-subject construction, the read order, the landing and the claim set are all kept.

### 23. `ds-def-2--disasters-famine-granary-and-parish-care-only`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 8 · WITHHELD 0 · PASS 4. Disposition: 0 reverted · 8 cure target(s) · 4 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | FAIL | R-DA-02 (the civic LACK is stated FLAT) + MOVE-GRAMMAR row 11 (ABSENCE: flat and alone) | no infirmary stands at all | **CURE** |
| 1 | 1 | PASS | — | reserves against hunger | **KEEP** |
| 1 | 2 | FAIL | the licence card's may-NOT (a claim the read does not hold) + W14 THE LABEL BAR with D-12 + CLERK-LAWS C4 | What the town holds back is grain | **CURE** |
| 1 | 3 | FAIL | R-DA-11 THE FIGURE POLICY (nothing inanimate acts with intent) + W1 | a house of the faith keeps its ground in the town | **CURE** |
| 2 | 0 | PASS | — | The parish stands at {settlement} and the town has no infirmary. | **KEEP** |
| 2 | 1 | FAIL | R-DA-02 (the LACK flat and alone) + MOVE-GRAMMAR row 11 + THE SKELETON RULE (the inventory line refused) | has a house of the faith and no ward for the sick | **CURE** |
| 2 | 2 | FAIL | R-DA-02 (the LACK is the first half only, with no completing clause) + R-DA-11 + W1 | The town's house of the faith stands on its own ground | **CURE** |
| 2 | 3 | PASS | — | and no infirmary is | **KEEP** |
| 3 | 0 | PASS | — | A stranger finds a house of the faith at {settlement} | **KEEP** |
| 3 | 1 | FAIL | THE FOUR-FACES RULE (A5: the faces differ in CONSTRUCTION - the subject, the order of the reads, the landing noun) | A stranger comes to {settlement} and sees a house of the faith | **CURE** |
| 3 | 2 | FAIL | MOVE-GRAMMAR row 1 (a PRESENT move may not carry a fact the field does not hold) + the card's may-NOT (a second fact; a standpoint) | a house of the faith stands in plain sight | **CURE** |
| 3 | 3 | FAIL | CLERK-LAWS C5/C3 (a same-entry contradiction) + C4 + R-DA-03 + MOVE-GRAMMAR row 11 | The parish is what a stranger finds standing at {settlement} | **CURE** |

- **v1 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Strike the two words: "...; no infirmary stands." No claim moves; the semicolon joint and the ledger's side-by-side construction are untouched.
- **v1 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Unfront the cleft to a plain town-subject clause: "The town holds back grain against a failed harvest, and a house of the faith stands at {settlement}; no ward for the sick is kept in the town."
- **v1 f3 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: "and a house of the faith stands in the town". The close ("The town has no hospital.") is lawful and stays.
- **v2 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Give the lack its own clause and drop the have-list: "A house of the faith stands in the town, and no ward for the sick is kept there. At {settlement} the town's grain is in store against a failed harvest."
- **v2 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: "The town's parish stands." - plain standing, the crossing kept, the compensation and the idiom gone, and the pool gains its short line.
- **v3 f1 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Move the subject and the landing - open on a participial and re-land sentence 2 on the civic noun: "Coming to {settlement}, a stranger sees the parish standing and no ward for the sick in the town. The town's grain, held against hunger, is in the granary."
- **v3 f2 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Strike the three words: "...a house of the faith stands, and no hospital stands in the town" - and let the curer take the house/house echo with the same stroke.
- **v3 f3 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Unfront the cleft and give the lack a finite clause: "At {settlement} a stranger finds the parish standing, and no hospital stands in the town. The granary holds the town's grain against a failed harvest."

### 24. `ds-def-2--disasters-famine-granary-no-medical-provision`

Variants: 1 `[ledger]` · 2 `[unfolding]` · 3 `[street]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 8 · WITHHELD 1 · PASS 3. Disposition: 1 reverted · 7 cure target(s) · 4 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | A granary is entered at {settlement} | **KEEP** |
| 1 | 1 | FAIL | A5 / the four-faces rule (face 0's clause frame with two words exchanged) | A store of grain is set down at {settlement}, and the town | **CURE** |
| 1 | 2 | FAIL | MOVE-GRAMMAR row 1 - PRESENT may NOT carry a spatial fact the field does not hold (R-DST-B) | Beside the store no house for the sick or parish stands. | **CURE** |
| 1 | 3 | PASS | — | Carried as standing at {settlement} is a granary | **KEEP** |
| 2 | 0 | WITHHELD | R-DST-B / MOVE-GRAMMAR row 2 (HISTORY may NOT exist in R1 STATE at all) with the block's PROVENANCE fence, against the marker's skeleton 3 | the town stays without a parish or a house for the sick | **KEEP** |
| 2 | 1 | FAIL | A5 / the four-faces rule (a sibling paraphrase past a synonym swap); 21.1 the ceiling | The store goes on holding grain, and the town goes on | **CURE** |
| 2 | 2 | FAIL | the restatement-of-the-fact-inside-one-sentence ground; W6 (no doubled beat) | Stored grain stays stored | **CURE** |
| 2 | 3 | FAIL | W1 POSSESSOR BINDING - seat the town as the possessor or DROP the possessive | Here the store keeps its grain | **CURE** |
| 3 | 0 | FAIL | the restatement-of-the-fact-inside-one-sentence ground; W6 (no doubled beat) | The granary at {settlement} is where the grain is | **CURE** |
| 3 | 1 | PASS | — | Grain lies in the store at {settlement}, and no house for | **KEEP** |
| 3 | 2 | FAIL | MOVE-GRAMMAR row 1 - PRESENT may NOT carry a spatial fact the field does not hold | neither a parish nor a house for the sick on the same ground | **CURE** |
| 3 | 3 | FAIL | the card's may-claim line (the row selected, and nothing more) and its may-NOT (a count); W14 (hasGranary a TIER PROXY); D-12 NOT ENTAILED (how full); A6 | What sits in the store at {settlement} is grain | **REVERT** |

- **v1 f1 — CURE.** RULE 4: the draft face carries face 0's own second clause almost whole ("and the town has neither a parish nor a sick-house"), so the named A5 ground stands in the draft - and it carries the coined "sick-house" the programme dropped besides.
  - cure: Give the second clause a subject that is not "the town" again: "A store of grain is set down at {settlement}, and no house for the sick or parish is entered." Claim set unchanged.
- **v1 f2 — CURE.** RULE 4: the draft face carries the same spatial assertion ("stands beside the granary"), so the breaching claim stands in the draft.
  - cure: Strike the spatial locative and keep the record's own scope while still carrying the store forward: "The store aside, the town has no house for the sick and no parish."
- **v2 f0 — KEEP.** KEPT, and flagged as this pool's open question for the chair: the continuatives presuppose a prior state, which the block's own fence forbids on a standing configuration read, while the skeleton licenses the [unfolding] as continuation in the present. Neither side is provable from the card, and if the fence binds, all four faces of variant 2 fall and the stance is unsatisfiable - a sitting row under 21.2, never a trim.
- **v2 f1 — CURE.** RULE 4: the draft face carries the identical breaching clause ("The store goes on holding grain, and the town goes on").
  - cure: Strike the second "goes on" and give the LACK its own construction with a subject that is not "the town": "The store goes on holding grain, and neither a house for the sick nor a parish stands." (The refuter's "is entered" would borrow the ledger's formula onto an [unfolding] row; keep the surface off the office.)
- **v2 f2 — CURE.** RULE 4: the draft face carries "Stored grain stays stored" verbatim.
  - cure: Make the predicate say something the subject does not, keeping the continuative without the loop: "Grain in store stays there, and no house for the sick or parish stands in the town."
- **v2 f3 — CURE.** RULE 4: the refinement inverted the draft's "the grain keeps its store" into "the store keeps its grain"; the draft takes neither of W1's two prescribed cures either, so the named ground stands after a revert.
  - cure: Take W1's own cure and drop the possessive: "Here the store keeps grain, and a parish and a house for the sick stay absent." Or seat the town: "Here the town's grain stays in store, and ...".
- **v3 f0 — CURE.** RULE 4: the draft face carries the identical first clause.
  - cure: Let the predicate do work the noun does not already do, keeping the street's vantage: "The grain at {settlement} is in the granary, and a parish and a house for the sick are not in the town."
- **v3 f2 — CURE.** J-3: the draft face reads "The grain has its store at {settlement}" - the possessive-on-the-stock shape this same refuter convicts at variant 2 face 3, where it records that neither of W1's prescribed cures is taken in either direction - so the revert installs a breach the pool's own verdicts name.
  - cure: Keep the absolute with-phrase, this face's one distinguishing construction, and restore the record's scope: "Grain is in the granary at {settlement}, with neither a parish nor a house for the sick in the town."
- **v3 f3 — REVERT.** RULE 1: the draft face carries no cleft ("Grain has a store at {settlement}, and no infirmary or parish stands in this town"), so it asserts nothing about the store's contents and is clean of every named ground; its opener also keeps the refuter's own first-two-words test against "Grain lies".
  - refined: “What sits in the store at {settlement} is grain, and a parish and a house for the sick are absent from the town's ground.”
  - draft (restored): “Grain has a store at {settlement}, and no infirmary or parish stands in this town.”

### 25. `ds-def-2--disasters-famine-no-reserves-hospital-present`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[unfolding]`. Draft packet: `draft-round-2.md`. Verdicts: FAIL 5 · WITHHELD 1 · PASS 6. Disposition: 2 reverted · 3 cure target(s) · 7 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | Those tending the sick are entered at {settlement}, and against hunger no granary. | **KEEP** |
| 1 | 1 | WITHHELD | R-vi / W7 with W24 (unproven, not cleared) | The town carries no granary against hunger. | **KEEP** |
| 1 | 2 | FAIL | R-vi / W7 (the office's formula as an AGENT-SOURCE), with W24 and the card's SOURCE-UNRESOLVED | and against hunger sets down no granary | **CURE** |
| 1 | 3 | PASS | — | What is entered at {settlement} are those tending the sick | **KEEP** |
| 2 | 0 | FAIL | R-i (the chair's ruling binding this block), with MOVE-GRAMMAR 1.4.1 | It keeps no granary against hunger. | **REVERT** |
| 2 | 1 | PASS | — | against hunger the town is without a granary | **KEEP** |
| 2 | 2 | FAIL | R-DA-08 and the register card's absence clause (in the record, never in the world; FLAT), with the pool's no-grade fence | and against hunger no granary at all | **REVERT** |
| 2 | 3 | PASS | — | In the town are those tending the sick | **KEEP** |
| 3 | 0 | FAIL | R-iv (the [unfolding] realises OPEN after the presence, never the ledger's measure), with R-DA-05 | Those tending the sick stand at {settlement} | **CURE** |
| 3 | 1 | PASS | — | Here at {settlement} stand those tending the sick. | **KEEP** |
| 3 | 2 | PASS | — | and what does not is a granary against hunger | **KEEP** |
| 3 | 3 | FAIL | R-iv, with R-DA-05 | The town of {settlement} has those tending the sick standing | **CURE** |

- **v1 f1 — KEEP.** KEPT: "carries" has two readings - plain possession (lawful) and the office's formula given an agent - and the chair rules that R-vi's bar names the ROLL as agent-source ("the roll shows, the roll sets down"), not the town as possessor; a possession verb on the town is the block's own landed surface, so the ground is not reached.
- **v1 f2 — CURE.** J-2(c): the draft face is agentless and clean of the named ground, but it opens on the KEPT face 1's own nine words ("Set down at {settlement} are those tending the sick"), so the revert installs a within-variant twin where none stands now.
  - cure: Recast the second limb agentless, keeping the face's own opening: "The town of {settlement} has those tending the sick entered, and against hunger no granary is set down."
- **v2 f0 — REVERT.** RULE 1: the draft face carries the NOUN forward ("Against hunger the town keeps no granary") where the refined face carries a pronoun, which is the whole of the named ground; the refiner recorded the departure as a judgment call, and R-i settles it against the refinement.
  - refined: “The town has those tending the sick. It keeps no granary against hunger.”
  - draft (restored): “The town has those tending the sick. Against hunger the town keeps no granary.”
- **v2 f2 — REVERT.** RULE 1: the draft face carries the bare gap with no intensifier ("and against hunger no granary"), which is exactly the flat absence the named law requires. Clean.
  - refined: “What the town has are those tending the sick, and against hunger no granary at all.”
  - draft (restored): “What the town has are those tending the sick, and against hunger no granary.”
- **v3 f0 — CURE.** RULE 4: byte-identical to its draft face.
  - cure: Re-cut onto a construction variant 1 does not take and let the LACK close the face as the matter still standing in the present (the skeleton's paired frame at item 6); keep the contract verb, add no claim.
- **v3 f3 — CURE.** RULE 4: the draft face carries the same opening seven words and the same frame, and still has nothing standing open, so both named grounds stand in the draft.
  - cure: Re-cut the frame off variant 1's naming-form construction and carry the present standing on the absence half, so the pair reads as still standing rather than as an entry made; add no claim.

### 26. `ds-def-2--disasters-famine-no-reserves-no-medical-provisio`

Variants: 1 `[ledger]` · 2 `[street]` · 3 `[visitor]`. Draft packet: `draft-round-1.md`. Verdicts: FAIL 7 · WITHHELD 0 · PASS 5. Disposition: 0 reverted · 7 cure target(s) · 5 kept.

| v | f | verdict | law | quote | ruling |
|---|---|---|---|---|---|
| 1 | 0 | PASS | — | {settlement} keeps no granary to hold grain back | **KEEP** |
| 1 | 1 | FAIL | W4 / skeleton 5.1 item 5 (the dropped angle), with skeleton 5.1 item 1 (the inventory shape) on the tail | No house that takes in the sick stands at {settlement}, nor any storehouse | **CURE** |
| 1 | 2 | FAIL | W4 (the declared grammar is V3 and the face executes V4) with skeleton 6.2 | The granary that would store grain is not built at {settlement} | **CURE** |
| 1 | 3 | FAIL | skeleton 5.1 item 1 (the inventory line) and the four-faces rule / A5 | No infirmary is carried standing at {settlement}, and no granary. | **CURE** |
| 2 | 0 | FAIL | skeleton 5.1 item 1 (the inventory line), with 21.4 and the four-faces rule | No granary stands in the place, and no infirmary. | **CURE** |
| 2 | 1 | FAIL | W14 (the label bar) and W15 (the alias bar), with the referent law's rule 3 and C7 | The community stands with neither a house that takes in the sick | **CURE** |
| 2 | 2 | PASS | — | A granary is not among the buildings of the place, nor a house for the sick. | **KEEP** |
| 2 | 3 | FAIL | the licence card's may claim (the row, not the world) and W14 (the hasChurch label trap), with the REFUSED COLUMN 'a totality over persons' | and without anywhere for the sick | **CURE** |
| 3 | 0 | PASS | — | A stranger looking for the granary at {settlement} finds no such building | **KEEP** |
| 3 | 1 | PASS | — | passes no infirmary, and sees no storehouse for grain | **KEEP** |
| 3 | 2 | PASS | — | The infirmary a stranger looks for at {settlement} is not built | **KEEP** |
| 3 | 3 | FAIL | A5 / the four-faces rule (the faces differ in the SUBJECT, the ORDER of the reads and the LANDING NOUN), with 21.4 | A stranger arrives at {settlement} and comes upon no granary | **CURE** |

- **v1 f1 — CURE.** RULE 4: the draft face keeps the same bare elliptical tail with no predicate ("nor an infirmary"), so the inventory-shape limb of the named law stands in the draft - and it puts the office's formula on an ABSENCE ("is not entered"), which converts a world LACK into a record GAP.
  - cure: Front a present ground and give the storehouse its own office-formula predicate (R-vi / W7), which restores the angle and removes the ellipsis in one change; the formula must sit on a PRESENT surface and never convert the lack into a record gap.
- **v1 f2 — CURE.** RULE 4: the draft face carries no office surface either ("No house stands at {settlement} to treat the sick, and the granary that would hold grain back is not built"), so the dropped-angle limb stands after a revert.
  - cure: Keep the subjunctive relative as the granary's function but seat the clause on the office's formula rather than on the object, which returns the face to V3 and to its angle without touching a claim.
- **v1 f3 — CURE.** J-3: the draft face opens "Nowhere at {settlement} takes the sick in" - the universal-negative sweep over places that this same refuter FAILS at variant 2 face 3 on the card's may-claim line and W14 - so the revert installs a convicted breach.
  - cure: Keep "carried standing" and give the storehouse constituent its own predicate, with the licensed sibling contrast between the two absences, which separates them and moves the landing noun.
- **v2 f0 — CURE.** J-3: the draft face reads "stands at the community", and "The community" is the engine's small-tier label for the town's armed body, which this same refuter FAILS at variant 2 face 1 on W14/W15.
  - cure: Leave face 2's building-layer turn where it is and re-cut this face on a different construction: a present ground first (where a storehouse would stand and does not) with the care class taking its own predicate, so the subject, the order and the landing all move.
- **v2 f1 — CURE.** J-2(c): the draft face is clean of the label but is not clean once installed - "The place is without a house for the sick and without a granary" is face 3's own frame with the two reads reversed, and face 3 stands in the pool as a cure target whose own cure keeps that frame; the revert would install the sibling paraphrase the four-faces rule bars. The refuter itself anticipates the clash and instructs the cure round to re-cut face 3's opener.
  - cure: Replace "The community" with "The place", the skeleton's own safe subject, and re-cut face 3's opener in the same round so the two faces do not share it. No claim moves.
- **v2 f3 — CURE.** J-3: the draft face carries "The community", which this same refuter FAILS at variant 2 face 1 on W14/W15.
  - cure: Put the care-class noun back in the clause: "and without a house for the sick", the cure round choosing the spelling that keeps this face's distance from face 2 and re-cutting its opener against face 1's cure.
- **v3 f3 — CURE.** J-3: the draft face carries "anywhere for the sick", the universal-negative sweep this same refuter FAILS at variant 2 face 3 - and it keeps face 0's own subject besides, so the A5 ground is not cured by the revert either.
  - cure: Reverse the reads and land on the storehouse, giving the care constituent its own perception predicate, so the order and the landing both move off face 0's while the subject stays the stranger.

---

## 4. Notes carried forward (not rulings)

These are recorded so the cure round and the re-refutation do not have to re-find them. None of them changes a disposition above.

- `plagued, perimeter but NO force to hold it` v2 f2 — the revert keeps the "To a stranger at {settlement}" frame that the same-page `Invasion & War: walls with NO force` [visitor] row also carries verbatim. The refuter says the cure may be taken in either pool; it is a ROW-SET matter, not a face matter, and no wording in this pool can cure it alone.
- `neither walls nor force` v3 f3 — the revert restores "no wall stands about the place", and the refuter's PASS note on face 0 warns a curer not to import the "about" locative into this variant a second time. If the chair prefers, the refuter's own cure ("This town keeps no force, and no wall stands.") is the draft minus three words and removes the locative.
- `court without detention` v2 f1 — after the revert, "nowhere … to hold" stands in two of the variant's four faces (this one and face 2). Lawful, but the thinnest spread in that variant.
- `no legal infrastructure` v3 f3 — the restored draft seats the finding on "a stranger's complaint" rather than on the stranger's eye. If a later refuter reads an abstract noun that "finds" as an inanimate agent under R-DA-11 (the same law named in the verdict), the face becomes a cure target rather than a second revert.
- `granary, NO medical provision` v2 f0 — the WITHHELD here is the pool's, and the block's, sharpest open question: whether a continuative ("stays", "goes on", "keeps") carries a past implicature the block's PROVENANCE fence forbids on a standing configuration read. If the chair rules the fence binds at the word grain, all four faces of that [unfolding] variant fall and the stance is unsatisfiable on this read — a sitting row under Part B §21.2, banked with its faces, never trimmed.
- `no reserves, no medical provision` v2 f1 and v2 f3 must be cured in the same pass: face 1's cure seats "The place" as its subject and face 3 already opens on "The place is without …", so one of the two openers must move or the cure installs the sibling paraphrase it was meant to avoid.
- `walls with citizen militia` — six of the pool's twelve faces are cure targets on one ground (the definite plural "the townspeople" made co-extensive with the force). The cure is the same one word in five of them (drop the article); the curer should take them together and check the pool's spread afterwards, since the article is currently carrying some of the sibling distance.
- `militia only` — all twelve faces are byte-identical to their draft faces (the refinement changed nothing in this pool), so nine cure targets stand with no revert available anywhere in it. It is the pool most in need of the cure round.

---

The two machine sections follow. They are the apply gate's input and carry nothing but their rows — **and, per §0, they must not be applied to the dock at its current HEAD.**

--- REVERTS
ds-def-2--beasts-monsters-plagued-perimeter-and-organized- | variant 2 | face 2
ds-def-2--beasts-monsters-plagued-perimeter-but-no-force-t | variant 1 | face 2
ds-def-2--beasts-monsters-plagued-perimeter-but-no-force-t | variant 2 | face 2
ds-def-2--beasts-monsters-plagued-no-perimeter-and-no-forc | variant 1 | face 0
ds-def-2--beasts-monsters-plagued-no-perimeter-and-no-forc | variant 2 | face 3
ds-def-2--beasts-monsters-plagued-no-perimeter-and-no-forc | variant 3 | face 3
ds-def-2--beasts-monsters-frontier-credible-deterrence | variant 3 | face 3
ds-def-2--beasts-monsters-settled-nothing-organized | variant 3 | face 2
ds-def-2--beasts-monsters-settled-nothing-organized | variant 3 | face 3
ds-def-2--invasion-war-walls-and-professional-garrison | variant 2 | face 2
ds-def-2--invasion-war-walls-and-professional-garrison | variant 3 | face 1
ds-def-2--invasion-war-walls-with-citizen-militia | variant 1 | face 1
ds-def-2--invasion-war-walls-with-no-force | variant 3 | face 2
ds-def-2--invasion-war-neither-walls-nor-force | variant 3 | face 3
ds-def-2--internal-security-full-legal-chain-court-and-pri | variant 1 | face 1
ds-def-2--internal-security-court-without-detention | variant 2 | face 1
ds-def-2--internal-security-no-legal-infrastructure | variant 2 | face 2
ds-def-2--internal-security-no-legal-infrastructure | variant 3 | face 2
ds-def-2--internal-security-no-legal-infrastructure | variant 3 | face 3
ds-def-2--economic-survival-strong | variant 1 | face 0
ds-def-2--economic-survival-strong | variant 2 | face 1
ds-def-2--economic-survival-strong | variant 3 | face 3
ds-def-2--economic-survival-weak | variant 3 | face 2
ds-def-2--economic-survival-critical | variant 1 | face 2
ds-def-2--economic-survival-critical | variant 1 | face 3
ds-def-2--economic-survival-critical | variant 2 | face 1
ds-def-2--disasters-famine-granary-and-hospital | variant 1 | face 2
ds-def-2--disasters-famine-granary-and-hospital | variant 3 | face 1
ds-def-2--disasters-famine-granary-no-medical-provision | variant 3 | face 3
ds-def-2--disasters-famine-no-reserves-hospital-present | variant 2 | face 0
ds-def-2--disasters-famine-no-reserves-hospital-present | variant 2 | face 2

--- CURE-TARGETS
ds-def-2--beasts-monsters-plagued-perimeter-and-organized- | variant 1 | face 1 | R1 - the measured plagued tier - rides a generic-article frame, so the face states the tier as a CLASS of country rather than as this country's standing; the generic reading is a maxim, which the register card refuses, and the refinement promoted the draft's tail to the governing frame. Quoted: "In a country where creatures are abroad" | Definite the frame and drop the second slot: "In the country around {settlement}, where creatures are abroad, the works and the muster are carried standing." One slot, R1 stated of this country, no claim added.
ds-def-2--beasts-monsters-plagued-perimeter-and-organized- | variant 1 | face 2 | "its" follows the object "the town's wall" and binds to it - the wall's muster - which is the binding W1 bars; the face also carries no ledger surface and is near-verbatim with the STREET row's face 2, so [ledger] is not realised. Quoted: "the town's wall and its muster both stand" | Drop the possessive: "the town's wall and the muster both stand"; the curer may restore an entry surface, and must keep the face off face 0's "entered to the town's name" formula, which the KEPT face 0 now owns.
ds-def-2--beasts-monsters-plagued-perimeter-and-organized- | variant 1 | face 3 | The body half is face 0's clause turned over - the same noun pair under the same office formula - so the two faces share their whole lexis on the half that carries R2 and R3; the refinement's rotation left both faces on "a wall and a muster". Quoted: "A wall and a muster are entered as standing" | Restore a distinct wall and force spelling: "The works and the town's force are entered as standing at {settlement}, and creature country lies around the town." Both spellings are ratified always-safe class words (W15); no claim added.
ds-def-2--beasts-monsters-plagued-perimeter-and-organized- | variant 2 | face 0 | The equative closes the enumeration - the town's defense IS these two and nothing else - while the reads are presence only and the key never consults the mercenary bucket or the charter hall; an enumeration closed at two is a count in words. Quoted: "Defense at {settlement} is a wall and a muster" | Break the equation and keep the frame (21.4): "Defense at {settlement} includes a wall and a muster, and creatures press the country outside." A presence verb is allowed in place of "includes"; never a counting or extent word.
ds-def-2--beasts-monsters-plagued-perimeter-and-organized- | variant 2 | face 3 | The pseudo-cleft is exhaustive by construction - these two are the whole of what the town has - while the reads are presence only, so the face carries a totality its siblings do not and the four faces are not claim-equal. Quoted: "what the town has is a wall and a force" | Drop the cleft: "and the town has a wall and a force."
ds-def-2--beasts-monsters-plagued-perimeter-and-organized- | variant 3 | face 1 | The cleft declares this the record's ONE open matter, which a spine cannot know; the register card's "leave one matter standing open" is a licence for the record, not an exclusive claim a single pool may make over it. Quoted: "what lies open is the pressure from the country's creatures" | Drop the cleft and state the OPEN move directly: "and the pressure from the country's creatures lies open."
ds-def-2--beasts-monsters-plagued-perimeter-but-no-force-t | variant 2 | face 0 | A near-verbatim twin of a SAME-PAGE sibling row: the Invasion & War "walls with NO force" [visitor] line reads "A stranger at {settlement} sees the works standing and no force at them" - seven identical opening words and one identical predicate skeleton - and that row fires on 100 % of the towns where this pool renders. Quoted: "A stranger at {settlement} finds the works standing and no" | Front the country frame, which keeps all four shipped floor turns and breaks both the shared opener and the shared predicate skeleton: "In a country where beasts are abroad, a stranger at {settlement} finds the works standing and no garrison or militia at them."
ds-def-2--beasts-monsters-plagued-no-perimeter-and-no-forc | variant 2 | face 2 | C2 and C3 ride as an APPOSITIVE TAIL on the object of the C1 clause instead of taking a predicate of their own, and the face seats the COUNTRY as subject and leaves the place a bare appositive object, so the [street] stance is gone. Quoted: "A country of monsters surrounds {settlement}, a place with no" | Give the second read a finite predicate: "A country of monsters surrounds {settlement}, and the place holds no works and no muster." To recover the angle as well, front the country as an adjunct and seat the place as the subject.
ds-def-2--beasts-monsters-frontier-credible-deterrence | variant 1 | face 1 | "active" is not the engine's frontier: the tier is the middle exposure band and the default of an unmeasured town, so the word states an activity no field holds (W14), and the face is not claim-equal to its three siblings (A6). Quoted: "The works at {settlement} sit on an active frontier" | Take the bare tier word, which the chair rules licensed: "The works at {settlement} stand in frontier country." The declared construction, the limb order, the slot set and the inverted second sentence are untouched; heed the refuter's secondary note and do not seat THE WORKS as the subject of a sitting-on-a-frontier predicate, which leans the word toward the border reading L-2 refuses.
ds-def-2--beasts-monsters-frontier-credible-deterrence | variant 2 | face 2 | The fronted bare-noun tier with no article, joined to a generic-looking definite subject and a habitual "has", reads as a life-general claim about frontier towns rather than a standing fact of THIS town - the maxim frame W5 names and R-DA-12 tests for; W2 requires the tier stated over this town's country. Quoted: "In frontier country the town has a force" | Anchor the country to this town's own outside, adding no claim: "In the frontier country outside, the town has a force, and that force stands behind the works." The limb order, the resumptive "that force", the close on "the works" and the empty slot set are all kept.
ds-def-2--beasts-monsters-frontier-credible-deterrence | variant 3 | face 0 | "Against" asserts WHY the works stand - an orientation of the works toward the tier that no field on this card computes; the card prints "relation: (a spine takes no relation)" and refuses a cause outright, and the key's own tail "credible deterrence" is expressly not a licence. Quoted: "Against frontier country the town of {settlement} has its works standing" | State the pressure as position rather than opposition, one word: "In frontier country the town of {settlement} has its works standing, and behind them a force." The fronted pressure, the elliptical second conjunct, the slot, the limb order and the close on "a force" all stand.
ds-def-2--beasts-monsters-frontier-force-without-a-perimet | variant 1 | face 1 | W5 names "the town of {settlement}" as the naming form; "the town at {settlement}" makes the recorded name a PLACE and the town a second thing sitting at it, a referent the record does not hold. Second, the country adjunct is fronted inside the force clause, the skeleton's own recorded ear hazard (a fronted country read as a conditional licence). Quoted: "The town at {settlement} is set down unwalled, and in frontier country" | "The town of {settlement} is set down unwalled in frontier country, and keeps people under arms." - "of" for "at", and the country adjunct out of the force clause's front position; landing noun and claim set untouched.
ds-def-2--beasts-monsters-frontier-force-without-a-perimet | variant 3 | face 1 | The walls bucket is empty over the WHOLE town, so "where no wall does" picks out no place: the locative is vacuous on its co-location reading, which drives the reader to the substitutive one - the force standing in the wall's stead, a posture the card refuses and the same-page sibling row's "defense is people rather than works" by another door. Quoted: "the town's force stands where no wall does" | The drafter's own recorded fallback, claim set unchanged and the licensed contrast kept: "the town's force stands and no wall does".
ds-def-2--beasts-monsters-settled-defenses-beyond-the-need | variant 2 | face 0 | The second clause elides "is entered", not "against beasts", so the predicate that reaches the country is an unrestricted "quiet" - the peace-reading the tier does not license, on a page that carries the war row and three more pressures beside it. Quoted: "and the country around the town as quiet" | Name the referent on the elided predicate and nothing else: "and the country around the town as quiet of them" ("them" binds to "beasts"). Do NOT cure with "of beast or monster": that pairing is already spent twice and a third use breaches R-DA-10's pet-word ceiling.
ds-def-2--beasts-monsters-settled-defenses-beyond-the-need | variant 2 | face 3 | Against face 0 this is one clause in nominal dress, not a second construction - the same read order, the same verb "is entered", the same lexis and the same landing - and "is a quiet one" names no referent, so the unrestricted-quiet fault bites harder here than at face 0. Quoted: "Provision against beasts is entered at {settlement}" | Reverse the read order and re-land the face, naming the referent in the same stroke: "Beasts come to little in the country around {settlement}, and provision against them is entered at the town." The nominal compression is kept; the order, the subject and the landing all move.
ds-def-2--beasts-monsters-settled-defenses-beyond-the-need | variant 3 | face 0 | "perimeter" is the branch argument's NAME rendered as English geometry; the walls bucket admits a Citadel and a lone "Gates (if walled)" row, of neither of which a perimeter is true, so the face asserts a continuity the record does not hold. Quoted: "A stranger notices the perimeter at {settlement} first" | One word, "the perimeter" to "the works": "A stranger notices the works at {settlement} first, and then how quiet the country around the town is of beasts." The density floor is kept whole and no claim moves.
ds-def-2--beasts-monsters-settled-nothing-organized | variant 1 | face 2 | The row reproduces the SIBLING pool's ledger construction almost whole (same office formula, same joint, same band word, same second-clause shape), and no class word stands anywhere in it, so on a rendered row that carries no label "entered as quiet" states the country is quiet full stop - wider than the card's may-claim and not the claim faces 0 and 1 make. Quoted: "the country beyond is entered as quiet" | Keep the formula on the first clause and bound the tier to the row's own class in a form no sibling uses: "The town of {settlement} is entered with no works and no muster, and the beasts of the country beyond are entered as few."
ds-def-2--beasts-monsters-settled-nothing-organized | variant 1 | face 3 | The tier is stated as a totality over everything the country sends out, with no class word in either sentence and no label on the rendered row, so the sentence asserts more than the beast tier and may contradict the block's own neighbouring pressures. Quoted: "Little comes out of the country about {settlement}." | Bound the first sentence to the class without borrowing the sibling's wording: "Few beasts come out of the country about {settlement}." The second sentence stands.
ds-def-2--beasts-monsters-settled-nothing-organized | variant 2 | face 0 | The pool's one surviving bare "it" stands after two objects (the refinement struck exactly this shape from two other faces and left it here), and no class word stands anywhere in the row, so "quiet" is unbounded. Quoted: "and what is outside it is quiet" | Drop the pronoun and bound the band, keeping the privative and the shipped noun: "The town stands without works or muster, and what is outside is quiet of beasts."
ds-def-2--beasts-monsters-settled-nothing-organized | variant 2 | face 1 | This is variant 1 face 1's construction in different words: the same clause order, the same correlative device, the same joint, so the pool carries one construction under two stances and the street's declared plain speech is indistinguishable from the ledger's. Quoted: "the town facing that country keeps neither works nor muster" | Change the device so v1 f1 keeps the pool's only correlative: "The country outside carries few beasts, and the town facing that country has no works and keeps no muster."
ds-def-2--beasts-monsters-settled-nothing-organized | variant 2 | face 3 | The cleft states the tier as a totality over everything the country sends out, with no class word in either sentence, so the reader cannot recover the beast tier and the face is not claim-equal to its siblings. Quoted: "What comes out of the country is little." | Bound the cleft with the skeleton's own class spelling: "What the country sends out in beasts is little. The town holds no works and no muster against that country."
ds-def-2--beasts-monsters-settled-nothing-organized | variant 3 | face 1 | The tier band rides an INDEFINITE article, so the row states that some country the stranger came out of is low in beasts and never states the tier of the country about {settlement} - READ 1 is not stated of the right referent, and the shape is the maxim frame W5 names. Quoted: "Out of a country low in beasts a stranger comes on {settlement}" | Make the country definite and bind it to the town, keeping the fronted frame: "Out of the country about {settlement}, low in beasts, a stranger comes on the town and finds no works and no muster in it."
ds-def-2--invasion-war-walls-with-citizen-militia | variant 1 | face 3 | A definite plural "the townspeople" in an equative with "the force" asserts that the force and the town's people are ONE SET; the recorded rows restrict the militia to a subset (able-bodied / fit residents) and whoIsExempt is null everywhere, so D-8 licenses "townspeople" as what the force is made of, never as who all of them are. Quoted: "the force entered with them is the townspeople, part-time" | Break the co-extension without adding a claim: drop the article - "and the force entered with them is townspeople, part-time" (the shipped clause's own bare-plural form).
ds-def-2--invasion-war-walls-with-citizen-militia | variant 2 | face 0 | "themselves" forecloses the partitive reading and makes the identification exclusive - the force IS the town's people, all of them - which the recorded rows and the null whoIsExempt both refuse; and it sits on the numbered line a falsy seed draws. Quoted: "The force behind the walls is the townspeople themselves" | "The force behind the walls is drawn from the townspeople, a part-time muster that turns out off its own work" - the partitive is D-8's own relation, costs no claim, and keeps "turn out", the pool's one shipped compression.
ds-def-2--invasion-war-walls-with-citizen-militia | variant 2 | face 1 | A specificational pseudo-cleft identifies the set that turns out AS the townspeople, so the class and the force are co-extensive over a bounded set. Quoted: "what turns out behind them is the townspeople, part-time" | Drop the article - "and what turns out behind them is townspeople, part-time"; the free relative, "behind them" and the landing all stand.
ds-def-2--invasion-war-walls-with-citizen-militia | variant 2 | face 2 | The definite class stands as the AGENT of the force's own act - every townsperson turns out - where the engine's own surface at this key is a restricted bare plural ("Fit residents train and turn out"). Quoted: "The townspeople turn out part-time behind the town's walls." | Drop the article - "Townspeople turn out part-time behind the town's walls." Nine words, no comma, both reads, the possessor still seated on the town.
ds-def-2--invasion-war-walls-with-citizen-militia | variant 3 | face 0 | Finding A in an equative: the force is identified with the whole class. The shipped line's possessive frame, its two-step order and the compression "raised part-time off their own work" are all sound; the co-extension is the single fault. Quoted: "the town's force with them is the townspeople, raised part-time" | Drop the article - "and the town's force with them is townspeople, raised part-time off their own work"; nothing else moves.
ds-def-2--invasion-war-walls-with-citizen-militia | variant 3 | face 2 | The definite class stands as the SUBJECT of the equative - the town's people ARE the town's force; secondarily, with face 0 the face runs the same frame in reverse, which is close to the edge of the construction distance. Quoted: "the townspeople behind them are the town's force, raised part-time" | Put the force on the subject and the bare plural in the predicate - "and the force behind them is townspeople, raised part-time"; this also widens the distance from face 0.
ds-def-2--invasion-war-walls-with-no-force | variant 1 | face 1 | The variant's declared contract is THE OFFICE'S ENTRY and this is the only face of the four carrying no office surface at all, so one draw in four of the [ledger] variant renders no ledger and the face is register-indistinguishable from the [street] variant's own faces. Quoted: "No force stands at {settlement}, and what stands is the works." | Restore the office's surface inside the same cleft, one word, leaving the turn, the length and the claim set untouched: "No force stands at {settlement}, and what stands entered is the works."
ds-def-2--invasion-war-walls-with-no-force | variant 2 | face 3 | "comes to" is a motion predicate on the stance noun: the stranger travels, and the face's first finite verb is an ACT, not a perception, which skeleton 2.7 names as this variant's regression. Quoted: "A stranger comes to the town of {settlement} and sees" | Place the eye rather than move it, keeping the naming form, the thread, the two-sentence construction and the claim set: "A stranger at the town of {settlement} sees the works. No garrison and no militia stand in the town."
ds-def-2--invasion-war-walls-with-no-force | variant 3 | face 3 | This is face 1's construction with the vocabulary swapped: the same works-NP subject, the same read order, the same coordination, the same second-clause subject and verb class, and the same landing noun - the sibling paraphrase past a synonym swap, with no turn of its own. Quoted: "The works stand, and the town has no garrison and no militia." | Put the face on a construction no sibling holds and restore the skeleton's compression at the same short length, adding no claim: "The works stand, and not the force to hold them."
ds-def-2--invasion-war-force-with-no-walls | variant 1 | face 3 | The landed same-page twin "frontier, force without a perimeter" opens its [ledger] numbered row "At {settlement} the muster stands in an unwalled town": the same subject, verb, slot and two reads, and that twin renders beside this pool on every frontier town, so the reader meets one sentence twice. Quoted: "The muster stands at {settlement}, a town with no wall." | Take the face off the twin's ledger subject-and-verb while keeping the appositive and the ratified class word: "A muster is entered at {settlement}, a town with no wall." Re-spread v1's four force verbs if "entered" then doubles with face 1.
ds-def-2--invasion-war-force-with-no-walls | variant 2 | face 3 | Two faults in one line: the refinement split the draft's single-verb compression into two coordinate clauses with no law behind the extra flattening, and the face repeats the same-page twin's three-word opener and its deictic "here" in the same angle. Quoted: "make up the defense here, and the place has no perimeter" | Restore the single-verb attributive so both reads ride one verb again and move the opener off the twin's street row: "A force under arms makes up the defense of this town, no wall standing about it." Keep the variant slotless.
ds-def-2--invasion-war-force-with-no-walls | variant 3 | face 2 | The landed twin's [visitor] variant holds all three of this face's load-bearing choices ("comes upon armed people", "in a town with no wall"), and "no wall" is the collocation the skeleton's own allocation ceded to the twin while this pool was given "sees" and "no line". Quoted: "A traveller comes upon people under arms at {settlement}." | Keep the two-sentence form and the thread and drop the two items the twin holds beside the verb: "A traveller comes upon the town's force at {settlement}. The town shows no perimeter." Re-spread v3's four absence surfaces so none doubles inside the variant.
ds-def-2--invasion-war-militia-only | variant 1 | face 0 | Three adjuncts hang off one verb and R1 arrives as the third of them; "for it to stand behind" then seats "it" one word after "the town", so the capability clause can bind to the town rather than the muster. The variant also realises the [ledger] stance in none of its four faces. Quoted: "on its own ground, in place of a professional garrison, with nothing" | Cut R1 into its own sentence carrying a noun forward: "A citizen militia at {settlement} answers a raid on its own ground, in place of a professional garrison. Around the town nothing is built for that muster to stand behind."
ds-def-2--invasion-war-militia-only | variant 1 | face 1 | R1 rides as a circumstantial on the capability clause, so the lack reads as the completing half of a contrast; beside "answers a raid" the idiom "on its own ground" also pulls toward the advantage sense the skeleton licenses only as a place. Quoted: "answers a raid on its own ground with no wall around the town" | Give R1 its own flat sentence and leave the raid clause unqualified: "...and it answers a raid on its own ground. No wall stands around the town."
ds-def-2--invasion-war-militia-only | variant 1 | face 2 | The second sentence's subject clause restates the presence the first sentence already stated; the beat exists only to carry R1, which is the summarising beat W6 refuses. Quoted: "Those citizens stand with nothing built around the town." | Drop the restating clause and carry the noun forward inside the lack itself: "Around the town nothing is built for that muster to stand behind."
ds-def-2--invasion-war-militia-only | variant 1 | face 3 | The contrast is seated on "answers a raid", so the plain reading is that the muster answers a raid and not a professional garrison - the engagement claim the rewrite exists to drop, restored by attachment; the face is also face 0's construction with two synonyms swapped. Quoted: "answers a raid on their own ground, not a professional garrison" | Seat the contrast on the muster and re-cut the construction: "Citizens of {settlement}, not a professional garrison, make the muster that answers a raid on their own ground."
ds-def-2--invasion-war-militia-only | variant 2 | face 0 | "It" has "a professional garrison" as its nearest antecedent and the town as its next, so the licensed entailment (raising them takes them off other work) is hung on the wrong referent. Quoted: "It comes off their own work, and nothing is built around" | Seat the people as the subject of the consequence: "They come to it off their own work, and nothing is built around the town for them to hold."
ds-def-2--invasion-war-militia-only | variant 2 | face 1 | Face 0's construction exactly - a person-plural subject plus "make the muster at {settlement}, part-time and [contrast]", then a work clause and an R1 tail, in the same read order and landing on the same noun; only two synonyms move. Quoted: "Townspeople make the muster at {settlement}, part-time and in place of" | Re-cut on a construction face 0 does not use, fronting the two entailments: "Part-time and off their own work, the townspeople of {settlement} make the muster instead of a professional garrison. The town has built nothing for them to hold."
ds-def-2--invasion-war-militia-only | variant 2 | face 2 | The face closes on face 0's clause word for word, so two of the variant's four faces land on the same ten words - below a synonym swap, not above it. Quoted: "and nothing is built around the town for them to hold" | Vary R1's surface on this face only: "...and the town has built nothing for that muster to hold."
ds-def-2--invasion-war-militia-only | variant 2 | face 3 | One sentence carries four stacked adjuncts, after a cleft whose copula does not agree with its plural complement; the shape is costume in the syntax with the pool's heaviest tail pile behind it. Quoted: "part-time and not a professional garrison, off their own work and with" | Break the sentence in two: "Townspeople are what turns out at {settlement}, part-time and not a professional garrison. They come to it off their own work, with nothing built around the town for them to hold."
ds-def-2--invasion-war-militia-only | variant 3 | face 2 | The demonstrative points at no antecedent - the first sentence names the town's own people, their work and the absent wall, and never a muster - so the second sentence hands nothing back; the clause is also face 1's second sentence with its subject swapped. Quoted: "That muster is part-time and not a professional garrison." | Supply the antecedent and change the construction with it: "They muster part-time, instead of a professional garrison."
ds-def-2--invasion-war-neither-walls-nor-force | variant 1 | face 0 | On the INVASION & WAR row the passive "is entered" is the row's own event verb: a town that is entered is a town an army got into, so the capacity verdict and the history the rewrite exists to drop return as an implicature on the canonical line a falsy seed draws. Quoted: "{settlement} is entered with no wall and no force." | Swap the verb for an office formula that cannot read as entry by force, keeping the nine-word shape and both limbs on one negated surface: "{settlement} is set down with no wall and no force."
ds-def-2--invasion-war-neither-walls-nor-force | variant 3 | face 2 | The pool's only INDEFINITE "a muster" makes the noun countable and admits the EVENT reading - the town has not held a muster - an act on a read that records no act, no history and no muster holder at all; the marker barred attempt 2's "musters no soldiers" for exactly this and the article reopens it. Quoted: "the town is without a muster or a wall." | Drop the article and let the two class words run bare, keeping the preposition-carried negation and the close on the wall: "Against war, the town is without muster or wall."
ds-def-2--internal-security-full-legal-chain-court-and-pri | variant 1 | face 2 | The ledger's entering formula is put on a PLACE noun, where "is entered" carries its spatial sense first: read cold, a place of confinement is walked into at {settlement} - an act, and a second fact no field holds; the face cannot be rescued by its siblings, since the composer never renders them together. Quoted: "A place where a person can be held is entered at" | Take the entering verb off the place-noun and use the office's other formula: "A place where a person can be held is carried standing at {settlement}. The law that town keeps is entered." No record noun is introduced.
ds-def-2--internal-security-full-legal-chain-court-and-pri | variant 2 | face 0 | "goes to the town's law" is the process claim, not the standing: D-15's one ENTAILS entry is conditional on a Courthouse row or an instantiated arbitration service, and this pool resolves neither; W14 states the trap in one line - a civil arbitration is recorded, a criminal trial is not - and beside a place of confinement "a thing done wrong" reads criminal. Quoted: "A thing done wrong at {settlement} goes to the town's law" | Keep the shipped frame, the variant's declared construction and density floor, but make its predicate a licensed read: "Where a wrong is done at {settlement}, the town's law stands, and the town keeps a place of confinement."
ds-def-2--internal-security-full-legal-chain-court-and-pri | variant 2 | face 1 | The second clause repeats face 0's movement predicate in a shorter dress, so the same conditional is used with the same condition unresolved; the first clause is clean. Quoted: "a wrong done there goes to the town's law" | Same cure, order and subject kept: "The town of {settlement} can hold a person, and where a wrong is done the town's law stands."
ds-def-2--internal-security-full-legal-chain-court-and-pri | variant 2 | face 2 | The purpose phrase asserts that the town's law is applicable to WRONGS, the criminal sense of a flag the engine sets from a meeting hall; strip the phrase and the clause is exactly the licensed standing. Quoted: "the town has its law to hand for a wrong done there" | Drop the purpose phrase only: "At {settlement} the town has its own law to hand. A person can be held in that town." Construction, subject, read order, sentence count and thread all survive untouched.
ds-def-2--internal-security-full-legal-chain-court-and-pri | variant 2 | face 3 | Three things at once: the purpose phrase is the D-15 breach in a third dress; the face CLOSES on the offence, which is no civic noun the card's fields name, so the spine hands a following modifier a noun the block cannot license; and "has law to hand" drops the possessor. Quoted: "the town has law to hand for what is done wrong there" | Drop the phrase, restore the possessor, and close on the read's own noun: "A person can be held at {settlement}, and the town keeps its own law to hand."
ds-def-2--internal-security-court-without-detention | variant 1 | face 2 | The sentence carrying the pool's DISCRIMINATING read has no office surface at all: it is the street sibling's own clause with the adverbial moved and two words swapped, so two variants of one pool say the discriminating read in one shape. Quoted: "The town carries nothing to hold under that law." | Put the office's own formula on the second sentence, claims unmoved: "At {settlement} the law is formal in its standing. On that standing no gaol is carried."
ds-def-2--internal-security-court-without-detention | variant 1 | face 3 | The face carries NO ledger surface - no "entered", no "stands", no "carried standing" - and "keeps" is the street variant's own verb, so under the [ledger] tag the row reads as plain possession; standing alone, the exhaustive cleft also reads as a claim about everything the town keeps. Quoted: "What {settlement} keeps is formal law, and no prison." | Restore the office's formula inside the cleft, claims and landing noun unmoved: "What {settlement} carries standing is formal law, and no prison."
ds-def-2--internal-security-court-without-detention | variant 3 | face 1 | The subject is the ACT, not the thing, so standing alone the face reads as a judicial outcome that is not delivered - sentencing and enforcement, the two items D-15 refuses off hasCourtSystem; its sibling face 0 avoids this exactly by seating the OPEN on a limb rather than on an act. Quoted: "detention stands unmet." | Seat the subject on the thing, rhythm and OPEN realisation unmoved: "Under formal law at {settlement}, a place of detention stands unmet."
ds-def-2--internal-security-detention-without-process | variant 1 | face 1 | The face leaves the modal frame in its second clause: "a person held" is a reduced relative with no modal over it and asserts that a person IS held - an occupancy the hasPrison flag never records - and it is the same read twice in one sentence (hold to held). Quoted: "no court sits to try a person held" | Cut the participle and keep the clause court-bound: "..., and no court sits to hear a charge." The charge is the absent court's own function-object and asserts nothing of this town; no claim added.
ds-def-2--internal-security-detention-without-process | variant 1 | face 3 | "no court names the ground" is the skeleton's own licensed re-cut and is lawful where it stops; the tail "for keeping that person" runs past it - the gerund carries no modal, so it states that a person is being kept, and it restates the confinement the face's own first clause made. Quoted: "no court names the ground for keeping that person" | Stop the face at the licensed re-cut: "A gaol at {settlement} can take a person in, and no court names the ground." Five words out, no claim lost.
ds-def-2--internal-security-detention-without-process | variant 2 | face 1 | Face 0 with two synonyms swapped: the same opener frame, the same perception-verb class, the same two objects in the same order, the same landing on the court's absence; the brief's three axes fail on all three. Quoted: "A traveller at {settlement} sees cells, and sees no court." | Rebuild on a construction no sibling uses, adding no claim - the cleft, the family's own shape: "What a traveller comes upon at {settlement} is the gaol, and no court." It opens unlike face 0, widens the presence vocabulary and gives the pool the clipped line the register card asks to exist.
ds-def-2--internal-security-no-legal-infrastructure | variant 1 | face 1 | The specificational pseudo-cleft is EXHAUSTIVE: it equates everything that stands at {settlement} against an internal wrong with the two absences, so the face asserts that NOTHING stands against a wrong done here - and on every tier this pool fires on, the governing row carries a recorded mediation service the card never reads. Quoted: "What stands at {settlement} against a wrong done inside the town" | Drop the exhaustive frame and keep the matter as an adjunct: "Against a wrong done inside the town {settlement} keeps no court to try it, and no cell."
ds-def-2--internal-security-no-legal-infrastructure | variant 1 | face 2 | The appositive naming form PREDICATES the band: it says {settlement} is a town, while this pool fires on every thorp, hamlet and village and on NO town or city, so the page's own head record reads a tier below town on every firing. Quoted: "The town of {settlement} is entered with no gaol" | Drop the band word, keep the formula, the slot and the read order, and stay off face 0's correlative frame: "The place, {settlement}, is entered with no gaol to hold under an offence and no court to try the offence."
ds-def-2--economic-survival-strong | variant 1 | face 2 | "meets" is an eventive verb in the bare present, so the clause reads habitually - whenever such pressure comes, the town meets it - a recurrence over events the record does not hold; the card reads a standing capacity and nothing about crises arriving. Quoted: "a pressure the town meets well" | "Economic survival at {settlement} is set down as a pressure the town can meet well." One word added - the capability modal the card licenses - which keeps the round's verb-spread gain and adds no claim.
ds-def-2--economic-survival-adequate | variant 1 | face 2 | The row's LABEL is transplanted verbatim into prose, where the reader has no badge frame and supplies the dictionary sense - "economic" as coin and "survival" as an OUTCOME the town achieved - while the engine reads a food-storage-driven resilience axis, banded; the face therefore carries a claim its three siblings do not. Quoted: "Economic survival at {settlement} stands adequate." | Take the refiner's own recorded fallback, which cures the label and the sibling closeness at once: "What {settlement} can meet in a crisis stands adequate. That standing sits on a narrow margin."
ds-def-2--economic-survival-adequate | variant 2 | face 1 | An abstraction is made the AGENT of a transitive act - "that standing" LEAVES the margin open - the identical shape the refiner itself struck from variant 1 as "the closest thing in the draft to R-DA-11's intent for an inanimate thing"; all three siblings show the lawful agentless surface. Quoted: "the little margin is what that standing leaves open" | Recast the OPEN agentless, keeping the fronted adjunct and the information order R-iv wants: "Set against a crisis the town's standing is adequate, and the little margin is the part left standing open."
ds-def-2--economic-survival-adequate | variant 2 | face 2 | The capability frame is gone and an OUTCOME in the present indicative stands in its place; read without a modal the clause is additionally habitual - whenever an emergency comes, this town holds - which is the maxim frame R-DA-12 and W5 refuse, and the marker licensed "hold through" only inside the CAPACITY noun phrase. Quoted: "This town holds through an emergency on a little margin" | Restore the copular cover frame and keep everything else, including the face's own OPEN idiom: "This town is covered against an emergency on a little margin, and that margin stands open."
ds-def-2--economic-survival-adequate | variant 3 | face 2 | The possessive follows the noun "a crisis" immediately and binds to it under W1, so the available reading is THE CRISIS'S edge being close - not a claim the card holds, and one that places an edge the card refuses to locate; the intended binding is two nouns back across a clause boundary. Quoted: "in a crisis its edge would be close" | Move the adjunct off the front of the second clause so the possessive sits against its antecedent's clause, with no word added and no claim touched: "The covering at {settlement} stands, and its edge would be close in a crisis."
ds-def-2--economic-survival-adequate | variant 3 | face 3 | "hold by a narrow margin" is the near-miss idiom: it forecasts how a crisis would END - the cover succeeding, barely - where the card holds that the margin IS little as a standing fact and holds nothing about the crossing; the refused list bars "would not hold" and the positive mirror asserts the same outcome from the other side. Quoted: "the cover would hold by a narrow margin" | Keep the close on the object and the reach subjunctive, and drop the outcome verb for the standing one the pool already spends: "The town of {settlement} is covered against a crisis, and the cover would stand on a narrow margin."
ds-def-2--economic-survival-weak | variant 1 | face 1 | Seated under "keeps", "the holding" is not the arm's noun but a HELD QUANTITY, on a read whose primary producer is food-storage months and beside a Disasters row that enters a granary on the same page; the face also bands a possession its three siblings never name. Quoted: "The holding the town of {settlement} keeps against a crisis" | Put the arm's own noun in the same seat and keep the two-sentence construction: "The cover the town of {settlement} keeps against a crisis is entered thin. A real crisis would strain that cover."
ds-def-2--economic-survival-weak | variant 1 | face 2 | The card names ONE read, so "thin cover" and "what the town can do in an emergency" are the band-on-the-arm and the arm, one referent: on that reading the clause says the thin capacity limits the capacity (W6); on the other it asserts a resource-to-capacity relation no field computes (W23). Quoted: "The thin cover entered for {settlement} limits what the town can do" | Predicate the band of the arm instead of letting it act on the arm, keeping the shipped noun phrase: "What the town of {settlement} can do in an emergency is entered as thin cover; a real crisis would strain that cover."
ds-def-2--economic-survival-weak | variant 2 | face 3 | The refinement rebuilt this face as a fronted conditional with the band landing last, which is the construction the [unfolding] variant's own fourth face holds, so the pool now spends the edge-fronted shape three times of twelve where the draft spent it once. Quoted: "Under a real crisis the cover the town of {settlement} has" | Give the face a construction no sibling variant holds, in the street's plain idiom and without the fronted conditional: "The town of {settlement} would meet a crisis on weak cover, and a real one would strain that cover."
ds-def-2--economic-survival-weak | variant 3 | face 0 | The presence already carries the unfolding's standing in its own verb ("stands thin"), so "as things stand" restates the read it follows and adds no claim, and it is hung on the SUBJUNCTIVE edge, where it qualifies the hypothetical rather than the standing condition. Quoted: "and a real one would strain that cover as things stand" | Strike the tail: "The cover {settlement} keeps against a crisis stands thin, and a real one would strain that cover." No claim added, none dropped, landing noun unchanged.
ds-def-2--economic-survival-weak | variant 3 | face 1 | The presence here is a bare copula, so the whole of the variant's declared PRESENT-to-OPEN rests on an adverbial hung off the edge clause; an adverbial that names no standing-open matter does not realise the OPEN move, and the tail's "it" sits one noun downstream of "that capacity". Quoted: "would strain that capacity as it stands" | Carry the standing onto the presence and strike the tail: "What the town of {settlement} could do about a crisis now stands thin, and a real one would strain that capacity." The shipped clause is kept verbatim.
ds-def-2--economic-survival-critical | variant 1 | face 1 | Sentence one already carries all three parts of the one read, so sentence two states nothing the card licenses that sentence one has not - the summarising second sentence - and the town is named twice inside one clause, generically and by the proper slot. Quoted: "Under that pressure the town stands effectively uncovered." | Let sentence two carry the part of the read sentence one lacks, as face 0 does, and name the town once: "The capacity is entered critical at {settlement}. So entered, the town stands effectively uncovered against a crisis."
ds-def-2--economic-survival-critical | variant 2 | face 2 | The open matter is not named: "the matter" names nothing - the exact fault the refinement itself recorded against the draft's numbered row and then left standing here - so the OPEN move has no subject the record holds. Quoted: "and the matter is open now" | Name it, in this face's own vocabulary: "...would not hold, and the want of cover is open now." One word class changes; no claim is added, and the face keeps its distinction as the pool's one wording with no band word.
ds-def-2--economic-survival-critical | variant 2 | face 3 | Face 0's construction with synonyms swapped - both open on the arm NP with the town inside it, both predicate the band in a copular band verb, both close on the want predicated open - so subject kind, read order and landing are all shared; "it" in "the want it leaves" is also unbound between the cover and the standing. Quoted: "The town's cover through a crisis stands at critical" | Change the construction, not the band surface: put the open matter first or make the pressure the subject, and land on a different noun - e.g. "What the crisis would find at the town's cover is entered critical, and that want stands open" (or any shape whose subject and landing differ from face 0's).
ds-def-2--disasters-famine-granary-and-hospital | variant 2 | face 3 | The two pressures are predicated on "these", the resumed pair, so the sentence reads each body against each pressure - the granary against sickness and the carers against hunger - and no field joins either body to the other's pressure; the refinement struck this shape at two other faces and left it standing here. Quoted: "the town has these against hunger and sickness." | Distribute the pressures inside the fronted pair and let the resumptive close: "A place for grain against hunger and those tending the sick against sickness, the town has these."
ds-def-2--disasters-famine-granary-and-hospital | variant 3 | face 3 | "Hunger at {settlement}" is the subject NP itself, so the face asserts hunger at this town - a stress the card does not read at all and an event the entailment law refuses; the double-gapped second conjunct then leaves that half with no predicate to carry "standing against it". Quoted: "Hunger at {settlement} has a place for grain standing against it" | Strike the locative from the pressure and restore the draft's second "has": "Hunger has a place for grain standing against it at {settlement}, and sickness has those tending the sick." The pressure-as-subject construction, the read order, the landing and the claim set are all kept.
ds-def-2--disasters-famine-granary-and-parish-care-only | variant 1 | face 0 | The LACK carries an intensifier: "at all" adds no licensed fact and buys an effect with the pool's one absent read, and the emphatic form reads as a want of care rather than the want of one roster row, on a page where the engine's own Clergy care badge prints. Quoted: "no infirmary stands at all" | Strike the two words: "...; no infirmary stands." No claim moves; the semicolon joint and the ledger's side-by-side construction are untouched.
ds-def-2--disasters-famine-granary-and-parish-care-only | variant 1 | face 2 | The specificational cleft is exhaustive: it states that grain is the WHOLE of what the town holds back, where D-12 entails only that grain is stored and hasGranary is indifferent to the stock; the always-safe spelling is safe as an object and acquires the exclusivity only when made the cleft's variable. Quoted: "What the town holds back is grain" | Unfront the cleft to a plain town-subject clause: "The town holds back grain against a failed harvest, and a house of the faith stands at {settlement}; no ward for the sick is kept in the town."
ds-def-2--disasters-famine-granary-and-parish-care-only | variant 1 | face 3 | "keeps its ground" is the idiom of holding out under pressure: on a disaster-and-famine page it predicates endurance of a building the card holds only as a standing row, and "its" binds vacuously to the house itself; the face also repeats face 0's subject, clause order and read order with two verbs swapped. Quoted: "a house of the faith keeps its ground in the town" | "and a house of the faith stands in the town". The close ("The town has no hospital.") is lawful and stays.
ds-def-2--disasters-famine-granary-and-parish-care-only | variant 2 | face 1 | The present body and the absent body are coordinated as two objects of one possession predicate, so R3 is not stated flat but listed; and the face carries no [street] stance at all - it is the closest line in the pool to the inventory line the gate refuses. Quoted: "has a house of the faith and no ward for the sick" | Give the lack its own clause and drop the have-list: "A house of the faith stands in the town, and no ward for the sick is kept there. At {settlement} the town's grain is in store against a failed harvest."
ds-def-2--disasters-famine-granary-and-parish-care-only | variant 2 | face 2 | This is the pool's one licensed crossing and its predicate is an idiom of self-sufficiency: placed immediately after the absent care house it reads as the compensating completion the LACK limb bars - the inference the whole pool is built to refuse - and "its own" binds to the house and says nothing. Quoted: "The town's house of the faith stands on its own ground" | "The town's parish stands." - plain standing, the crossing kept, the compensation and the idiom gone, and the pool gains its short line.
ds-def-2--disasters-famine-granary-and-parish-care-only | variant 3 | face 1 | Against face 0 the face holds the same subject, the same order of reads and the same abstract landing; what moves is the perception verb, one added motion clause and the voice of the second sentence, and the two faces also share their first two words. Quoted: "A stranger comes to {settlement} and sees a house of the faith" | Move the subject and the landing - open on a participial and re-land sentence 2 on the civic noun: "Coming to {settlement}, a stranger sees the parish standing and no ward for the sick in the town. The town's grain, held against hunger, is in the granary."
ds-def-2--disasters-famine-granary-and-parish-care-only | variant 3 | face 2 | "in plain sight" predicates prominence OF THE BUILDING: the visitor stance licenses that a stranger sees what stands, not a fact about how the thing is seen, and no field holds salience or position - the same shape of over-claim as the dropped "a modest infirmary", one grade lower. Quoted: "a house of the faith stands in plain sight" | Strike the three words: "...a house of the faith stands, and no hospital stands in the town" - and let the curer take the house/house echo with the same stroke.
ds-def-2--disasters-famine-granary-and-parish-care-only | variant 3 | face 3 | The inverted pseudo-cleft is exhaustive - what the stranger finds standing IS the parish and nothing else - while the face's own second sentence has the granary standing, so the face contradicts itself inside one entry; and R3 rides as a with-absolute tail rather than as a flat clause. Quoted: "The parish is what a stranger finds standing at {settlement}" | Unfront the cleft and give the lack a finite clause: "At {settlement} a stranger finds the parish standing, and no hospital stands in the town. The granary holds the town's grain against a failed harvest."
ds-def-2--disasters-famine-granary-no-medical-provision | variant 1 | face 1 | Face 0's clause frame with two words exchanged: the same read order, the same second clause, and a subject that differs only as "granary" differs from "store of grain", which is A-10's building/stock pair rather than a different construction. Quoted: "A store of grain is set down at {settlement}, and the town" | Give the second clause a subject that is not "the town" again: "A store of grain is set down at {settlement}, and no house for the sick or parish is entered." Claim set unchanged.
ds-def-2--disasters-famine-granary-no-medical-provision | variant 1 | face 2 | "Beside the store" asserts a spatial arrangement the branch does not hold - it reads three booleans and places no row relative to any other - and the locative NARROWS the licensed absence to the store's neighbourhood, which is strictly weaker than the read and drifts toward the granary-and-parish cell. Quoted: "Beside the store no house for the sick or parish stands." | Strike the spatial locative and keep the record's own scope while still carrying the store forward: "The store aside, the town has no house for the sick and no parish."
ds-def-2--disasters-famine-granary-no-medical-provision | variant 2 | face 1 | Face 0's sentence with one continuative swapped for another and the two absent rows reordered; the doubled verb across the two clauses - the one distinctive rhythm either face has - is reproduced exactly, and the clumsier wording is a regression against the ceiling on top of the paraphrase. Quoted: "The store goes on holding grain, and the town goes on" | Strike the second "goes on" and give the LACK its own construction with a subject that is not "the town": "The store goes on holding grain, and neither a house for the sick nor a parish stands." (The refuter's "is entered" would borrow the ledger's formula onto an [unfolding] row; keep the surface off the office.)
ds-def-2--disasters-famine-granary-no-medical-provision | variant 2 | face 2 | "Stored grain" already asserts the whole of R1 (D-12's "grain is stored"); "stays stored" asserts it a second time in the same clause, so the first half is a loop and not a compression - and 21.4 protects compression that rewards the reader, never a word repeated back onto itself. Quoted: "Stored grain stays stored" | Make the predicate say something the subject does not, keeping the continuative without the loop: "Grain in store stays there, and no house for the sick or parish stands in the town."
ds-def-2--disasters-famine-granary-no-medical-provision | variant 2 | face 3 | The bar's fault IS a possessive bound to an object, and neither prescribed cure was taken; D-12 also makes the granary communal at town, so the grain is the town's and not the storehouse's, and "keeps its grain" leans on the retention reading D-12 lists as NOT ENTAILED. Quoted: "Here the store keeps its grain" | Take W1's own cure and drop the possessive: "Here the store keeps grain, and a parish and a house for the sick stay absent." Or seat the town: "Here the town's grain stays in store, and ...".
ds-def-2--disasters-famine-granary-no-medical-provision | variant 3 | face 0 | A granary IS the place grain is held - the noun's own meaning and D-12's entailment in its own words - so the predicate defines the subject and the clause states R1 twice with nothing else in it, on the numbered row a falsy seed is nearest. Quoted: "The granary at {settlement} is where the grain is" | Let the predicate do work the noun does not already do, keeping the street's vantage: "The grain at {settlement} is in the granary, and a parish and a house for the sick are not in the town."
ds-def-2--disasters-famine-granary-no-medical-provision | variant 3 | face 2 | The with-phrase makes the granary's OWN ground the scope of the absence: the branch holds no site for any row, and as written the face leaves both bodies free to stand elsewhere in the town, which is strictly weaker than the read and drifts toward the granary-and-parish cell. Quoted: "neither a parish nor a house for the sick on the same ground" | Keep the absolute with-phrase, this face's one distinguishing construction, and restore the record's scope: "Grain is in the granary at {settlement}, with neither a parish nor a house for the sick in the town."
ds-def-2--disasters-famine-no-reserves-hospital-present | variant 1 | face 2 | The elided subject of "sets down" is "The town of {settlement}", so the town is made the ENACTOR of the record's act - the shape R-vi names verbatim as unlicensed - and unlike "carries", "sets down" has no possession reading, so the face asserts a record-keeper on a pool whose card prints no holder. Quoted: "and against hunger sets down no granary" | Recast the second limb agentless, keeping the face's own opening: "The town of {settlement} has those tending the sick entered, and against hunger no granary is set down."
ds-def-2--disasters-famine-no-reserves-hospital-present | variant 3 | face 0 | This is variant 1's numbered line with "are entered" replaced by "stand" - the same subject, the same slot, the same joint, the same gapped tail - and nothing in it stands open, so the angle is carried on the tag alone, which the skeleton names as this variant's regression in terms. Quoted: "Those tending the sick stand at {settlement}" | Re-cut onto a construction variant 1 does not take and let the LACK close the face as the matter still standing in the present (the skeleton's paired frame at item 6); keep the contract verb, add no claim.
ds-def-2--disasters-famine-no-reserves-hospital-present | variant 3 | face 3 | The face repeats variant 1 face 2's opening seven words and its whole frame with the contract verb swapped, so in the reading sequence the [unfolding] and the [ledger] are interchangeable sentences, and two of this variant's four faces are the ledger's faces in a different verb. Quoted: "The town of {settlement} has those tending the sick standing" | Re-cut the frame off variant 1's naming-form construction and carry the present standing on the absence half, so the pair reads as still standing rather than as an entry made; add no claim.
ds-def-2--disasters-famine-no-reserves-no-medical-provisio | variant 1 | face 1 | Nothing in the face is the compiling office - no formula, no measure, no record standing - and it is interchangeable with the [street] variant's own face 1, with which it shares the care noun, the verb and the read order; the second constituent is a bare elliptical noun phrase with no predicate, so the pair reads as a list. Quoted: "No house that takes in the sick stands at {settlement}, nor any storehouse" | Front a present ground and give the storehouse its own office-formula predicate (R-vi / W7), which restores the angle and removes the ellipsis in one change; the formula must sit on a PRESENT surface and never convert the lack into a record gap.
ds-def-2--disasters-famine-no-reserves-no-medical-provisio | variant 1 | face 2 | Object-first is level-1 member V4, which the skeleton rules NOT licensed here because V4 wants a named-object field while the granary is a class word read off a flag; and the face carries nothing of the office, so with face 1 it leaves the [ledger] variant one ledger face in four. Quoted: "The granary that would store grain is not built at {settlement}" | Keep the subjunctive relative as the granary's function but seat the clause on the office's formula rather than on the object, which returns the face to V3 and to its angle without touching a claim.
ds-def-2--disasters-famine-no-reserves-no-medical-provisio | variant 1 | face 3 | Ten words whose last three are a bare negated noun with no predicate, stating the key fact and nothing else; against face 1 it moves none of the three named axes and is the plainer of the two. Quoted: "No infirmary is carried standing at {settlement}, and no granary." | Keep "carried standing" and give the storehouse constituent its own predicate, with the licensed sibling contrast between the two absences, which separates them and moves the landing noun.
ds-def-2--disasters-famine-no-reserves-no-medical-provisio | variant 2 | face 0 | Nine words, two negated nouns under one predicate with an elliptical tail, no street stance beyond the bare locative and none of the skeleton's density; it is its own face 2 made plainer, dropping that face's building-layer turn with no law behind the change, on the line a falsy seed draws. Quoted: "No granary stands in the place, and no infirmary." | Leave face 2's building-layer turn where it is and re-cut this face on a different construction: a present ground first (where a storehouse would stand and does not) with the care class taking its own predicate, so the subject, the order and the landing all move.
ds-def-2--disasters-famine-no-reserves-no-medical-provisio | variant 2 | face 1 | "The community" is the engine's own small-tier NAME for the town's armed body (deriveDefenseGroupLabel returns the literal string for thorp, hamlet and village - exactly the tiers this pool fires at), so on every cell this face reaches, the same two words may name a different row on the same defense page: an engine label read at its dictionary sense, and one word carrying two referents on one page. Quoted: "The community stands with neither a house that takes in the sick" | Replace "The community" with "The place", the skeleton's own safe subject, and re-cut face 3's opener in the same round so the two faces do not share it. No claim moves.
ds-def-2--disasters-famine-no-reserves-no-medical-provisio | variant 2 | face 3 | "anywhere" scopes the negation over every place in the settlement rather than over the care-class row the read reaches: the branch returns before the church argument is consulted, and a parish stands on a large share of this pool's own hamlet cells, so the face denies a record the read never looked at. Quoted: "and without anywhere for the sick" | Put the care-class noun back in the clause: "and without a house for the sick", the cure round choosing the spelling that keeps this face's distance from face 2 and re-cutting its opener against face 1's cure.
ds-def-2--disasters-famine-no-reserves-no-medical-provisio | variant 3 | face 3 | Against face 0 the face moves none of the three axes - same subject, same read order, same landing - and it is the plainer of the pair exactly where it matters, dropping face 0's building-layer cure ("finds no such building") for the bare noun. Quoted: "A stranger arrives at {settlement} and comes upon no granary" | Reverse the reads and land on the storehouse, giving the care constituent its own perception predicate, so the order and the landing both move off face 0's while the subject stays the stranger.
