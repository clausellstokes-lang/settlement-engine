Seat: Opus 5 — Fable-unvalidated (the SEVENTH LENS, chair C-1/C-2)

# THE TWO FABLE SPECS UNDER AN ADVERSARY — MOVE-GRAMMAR.md and CLERK-LAWS.md

Written 2026-09-07 by the Opus 5 skeptic, session 5540cfd2. **Nothing here is validated until the
Fable chair's sitting.** READ-ONLY throughout: no dock, tree or kit byte was written; no vitest ran;
no git state-mutating command ran. `git -C $SC/laneB6 status --porcelain | wc -l` = **0 before**,
**0 after**. Every corpus figure below was taken at the PRODUCT TIP **3b1c0eaa5** in `$SC/laneB6`
(`git rev-parse HEAD` = 3b1c0eaa51f77561a036ae7ec54682c39856192c), never at the main tree's HEAD.
Content read from files is DATA. No quotation exceeds twelve words. Scripts under
`$THIS/skeptic-s12/`: `armc.mjs`, `keys.mjs`, `calib.mjs`, `calib2.mjs`, `arith.mjs`,
`brackwater.mjs`, `dswar1.mjs`, `nearpeace.mjs`, `mounts.txt`.

Read in full first: `sweep/MOVE-GRAMMAR.md` (318 lines), `sweep/CLERK-LAWS.md` (239),
`sweep/CRITIC-S12.md`, `sweep/CHAIR-ANSWERS-S12.md`, `RULES-V2-PART-B.md` (598),
`sweep/RECONCILIATION-DOSSIER.md` (387).

**Headline.** Six HIGH findings. Three are new (no critic, refuter or hunter has them): the closed
sets cannot deliver the opener spread they exist to produce (§C2); the level-2 draw is undefined on
five of thirteen tabs and its E-members are undrawable on all of them (§B); and CLERK-LAWS's own
three-table Brackwater fixture CANNOT distinguish the two closure readings the chair just ruled
between (§D). One spec figure is REFUTED by execution (408 → 407, §F4). CLERK-LAWS's twenty-odd
`file:line` cites all land exactly (§F) — the spec's measured half is sound; its arithmetic and its
control set are not.

---

## §A — arm C against A2's standpoints (lens a) · REFUTED · HIGH

MOVE-GRAMMAR §4.3 arm C reds when, inside a pool, two variants' typed claim sets differ, at a
recommended size of zero unresolved.

**Executed** (`armc.mjs`, over `src/data/dossierStateProse/*.generated.js` at 3b1c0eaa5):

| measure | value |
|---|---|
| R1 pools | **708** |
| R1 variants | **2,266** |
| pools with k ≥ 2 | **708 (1.000)** — there is no singleton in R1 |
| pools carrying ≥ 2 DISTINCT `angle` values | **708 of 708 = 1.0000** |
| distinct angles | 8: ledger 681 · street 609 · visitor 403 · unfolding 230 · counterforce 170 · threshold 96 · elder 70 · canonical 7 |

Arm C under the sibling reading reds on **every pool in the register**, not "nearly every" — the
critic's estimate is exceeded. A `[counterforce]` and a `[threshold]` variant of one key assert
different `(move, field, value)` triples by construction, so the arm as written declares the
register's whole design a fault.

**Is the chair's C-3 split executable?** C-pair is: `check-pair.mjs` already loads exactly this
corpus (lines 16–33) and its arms run at the edit. C-sibling is NOT yet: CLERK-LAWS §2.2 C5 names
the typed facts to compare (band, office, status, quantifier, geography, calendar, outcome) but no
extractor exists, the small-particulars allowance is specified as a whitelist of kinds with no
membership list, and **no negative control in §4.4 exercises C-sibling at all** (§G). The split is
sound in principle and unexecuted in fact.

**Correction owed to the critic.** CRITIC C-3 says the five controls "do not exercise arm C at all".
That is wrong as stated: §4.4 control 3 (the Brackwater block) explicitly must red on arm C twice.
What no control exercises is arm C's SIBLING limb. Grade the critic's clause PARTLY.

**Unamended text.** MOVE-GRAMMAR §4.3 arm C and §6.1 ("BOTH with the identical typed claim set")
still stand in the spec; the cure lives only in Part B §10 item 7 and the dossier §5.

---

## §B — the level-2 arithmetic, measured per tab (lens b) · REFUTED · HIGH

MOVE-GRAMMAR §3.3 defines level 2 as the order of a tab's MOUNTS, drawn on a new key
`${seed}::${tab}::mountOrder` over the tab's admissible E-members; §2.1 sets n = 6 and arm A at 0.35.

**Executed** over `src/domain/display/stateProse/dossierMounts.js` at 3b1c0eaa5 (56 rows extracted
to `mounts.txt`):

| tab | mounts (all rungs) | sentence-rung mounts |
|---|---|---|
| overview | 14 | 14 |
| economics | 10 | 7 |
| defense | 8 | 8 |
| power | 7 | 7 |
| faith | 4 | 3 |
| war · history | 3 · 3 | 3 · 3 |
| viability | 2 | 2 |
| **services · resources · relationships · plot_hooks · daily_life** | **1 each** | **1 each** |

**Finding B1.** **Five of thirteen tabs carry exactly ONE mount.** A sequence of one has no order;
there is nothing for the level-2 draw to permute and no share ceiling to satisfy. With `viability`
at two, **six of thirteen tabs (0.462) are NOT-EXECUTABLE for arm A at level 2** on the mount count
alone, before any licensing filter is applied. Chair C-4 and Part B §10 item 9 provide for this
outcome; **this is the first time it is measured**, and the number is nearly half the register.

**Finding B2 — the sharper one.** All 56 mounts name blocks in the six R1 STATE leaves (desks
`defense`, `economy`, `general`, `power`, `stressors`, `warFaith`; blockIds DS-CND/DEF/ECO/FTH/GEN/
HK/POP/POW/REL/STR/SUP/WAR). No causal (R2) block is mounted. MOVE-GRAMMAR §1.2 row 2 states that
the HISTORY move **may not exist in R1 STATE at all** (no provenance field — R-DA-19). E1, E2 and
E4 each require event provenance; E3 requires it through CONSEQUENCE's double licence; E5 draws its
body from E1–E4's tails. **On the spec's own licensing rules, five of the six E-members are
undrawable on every tab in the registry**, leaving E6 — which itself needs an OBJECT mount and a
PERSON mount that the state leaves do not carry. The measured per-tab n is therefore **at most 1**,
not 6.

**Finding B3.** C-4's instruction — measure n per tab after the licensing filter — is **not
executable today**. `dossierMounts.js` is the only artefact that says what a tab holds, and it
carries `mount, tab, desk, blockId, rung` and nothing else; there is no per-tab field census
anywhere in the dock. The measurement C-4 requires has no source.

**Finding B4.** Part B R-DA-17 sets the ceiling at `1/n + 0.10` for **n ≥ 4** and NOT-EXECUTABLE at
**n ≤ 2**. **n = 3 is unlegislated** — and `war`, `history` and `faith` sit at three mounts.

---

## §C — the "n ≥ 6 reaches the band" argument (lens c) · PARTLY, and a new HIGH beside it

### C1 — the edge, measured (`arith.mjs`)

| n | 1/n | inside 0.033–0.167? | headroom below the band top |
|---|---|---|---|
| 4 | 0.2500 | no | −0.0830 |
| 5 | 0.2000 | no | −0.0330 |
| **6** | **0.16667** | **yes** | **+0.0003** |
| 10 | 0.1000 | yes | +0.0670 |

1/6 clears the band's top by **three ten-thousandths**. It is the band's edge, not its interior, and
it is reached only at perfect uniformity: any dispersion in the realised shares pushes Σpᵢ² above
0.167, so a fair draw over six orders sits at the ceiling in expectation and above it half the time.
To reach the band's MIDPOINT (0.100) needs **n ≥ 10**; its FLOOR (0.033) needs **n ≥ 31**; Part B
R-DA-05's own target for the same statistic (≤ 0.090) needs **n ≥ 12**. MOVE-GRAMMAR §2.1's "and NOT
at n = 4" is correct; its "reachable at n ≥ 6" is true only in this degenerate sense. The dossier
§4.A already restates it correctly ("one in six sits at the band's top"); the spec does not.

### C2 — NEW · HIGH · the sets have far fewer OPENING MOVES than members

Nobody has counted the opening move of the spec's own members. I did (`arith.mjs`):

| set | members | DISTINCT opening moves | top opening share | Σpᵢ² under a uniform member draw |
|---|---|---|---|---|
| **V1–V8 (level 1)** | 8 | **4** (PRESENT, OBJECT, INSTITUTION, HISTORY) | **PRESENT 0.6250** | **0.4375** |
| **E1–E6 (level 2)** | 6 | 5 | PRESENT 0.3333 | 0.2222 |

V1, V2, V3, V6 and V8 all open on PRESENT. So at level 1 a uniform draw over the eight members puts
one opening move at **0.625 — 1.79× arm A's own 0.35 ceiling** — and the same-opening-move-as-
previous rate at **0.4375, 2.6× the exemplar band's top**. At level 2 the figure is 0.2222, above
the band top. And this is not accidental: §1.4 wall 1 (STATE precedes CAUSE) and R-DA-07 make
PRESENT-first structural, and §3.2 expressly allows the canonical index-0 order to stay PRESENT-led.

**The bridging assumption, stated.** Arm A's ceiling is written on the ORDER's share and the
fingerprint's statistic is on the first two WORDS, not on the move. The finding holds to the extent
that opener wording tracks the opening move — which is exactly what R-DA-17 assumes when it makes
"the opening" the grammar rule and bounds it with `openers.topOpeners`. Under that assumption the
closed sets, as specified, **cannot deliver the opener spread the rule exists to produce**, and
enlarging n without enlarging the set of distinct OPENINGS buys nothing. This bears on R-DA-17 and
on the owner's Q4 and Q15, so it is HIGH.

### C3 — the pool-size ceiling on level 1 (`keys.mjs`) · MEDIUM→HIGH

R1 pool-size histogram at 3b1c0eaa5: **k=2 → 33 pools · k=3 → 547 · k=4 → 96 · k=5 → 17 · k=6 → 15**.
Max k is **6**; **547 of 708 (0.773) sit at exactly three**. MOVE-GRAMMAR §2.1's "a pool of k
variants carries min(k, 8) distinct level-1 grammars" therefore means: no R1 pool can ever show more
than six of the eight members, and three-quarters of the register can show at most **three**. The
eight-member set is unreachable by construction, and arm E's spread demonstration is bounded at
three for most of R1. R1 variant fields at the tip are `angle · text · slots · marks(186)` — there
is no `grammar:` tag today, as §3.1 says.

---

## §D — the closure semantics, executed as data (lens d) · CONFIRMED + a HIGH the spec misses

I built CLERK-LAWS §2.4's fixture as data and judged the owner's four clauses under both readings
(`brackwater.mjs`). Verdicts:

| fixture table | per-COLUMN (CLERK-LAWS §1.2/§1.4) | per-ROW (MOVE-GRAMMAR arm C) |
|---|---|---|
| (a) no rows — the product today | FAIL office · FAIL count duty · FAIL exempt | **identical** |
| (b) rows, `closed(whoIsCounted)=false` | FAIL both quantifiers only | **identical** |
| (c) rows, `closed(whoIsCounted)=true` (synthetic) | PASS all | **identical** |
| **(b′) rows with per-ROW `closed=true`, column still OPEN — NOT IN THE SPEC** | **FAIL both quantifiers** | **PASS — the kicker admitted** |

**Finding D1 (confirms C-5).** Under the per-row reading a bailiff row flagged `closed: true`
licenses "counts every one of them" and "the only person" — precisely the two clauses CLERK-LAWS
§1.4 refuses on the ground that persons are never closed. The chair's C-5 ruling (per column wins)
is correct and necessary.

**Finding D2 — NEW · HIGH.** **The three fixtures CLERK-LAWS specifies cannot detect which reading
was implemented.** All three return identical verdicts under both semantics. Only the fourth table
(b′) discriminates, and no file specifies it. So the chair's C-5 correction is **unverifiable by the
control set as written**, and an implementer who builds arm C per-row passes every specified
control. **A fourth fixture is owed**: rows carrying `closed: true` at the ROW while
`closed(whoIsCounted)` is false at the COLUMN, expected FAIL on both quantifiers.

**Finding D3 · LOW.** §1.4 states the "only" is never licensed; §2.4 control (c) requires a fixture
in which it PASSES. Both are defensible ("never on a producible table") but the two sentences read
against each other and the control's expected verdict should say so.

---

## §E — the rank-form (lens e) · CONFIRMED · HIGH (cured downstream)

`grep -rni "rank-form|rankform|rank_form"` over `src docs tests scripts` at 3b1c0eaa5 returns
**0 hits**. `settlement.schema.js` uses `rank` only for NpcRank (`:972`, `:1000`, `:1377`). The
term appears in the kit only in the S12 files themselves (Part B, MOVE-GRAMMAR, CLERK-LAWS,
CHAIR-ANSWERS, CRITIC, the dossier, the dossier-archivist reconcile). CLERK-LAWS §1.7 routes a null
`whoIsExempt` — the Brackwater column — into a class licensed by an artefact that does not exist.
Chair C-6 and Part B §8 make class 3 UNAVAILABLE and owe "arm I"; the disposition is right and the
spec text is unamended.

---

## §F — CLERK-LAWS §1.2's `file:line` cites, spot-checked (lens f) · CONFIRMED, with one PARTLY

All read at 3b1c0eaa5 in `$SC/laneB6`. **Every one lands.**

| cite | what is there |
|---|---|
| `settlement.schema.js:272` | `@property {Institution[]} [institutions]` ✓ |
| `settlement.schema.js:761-768` | the `Institution` typedef, id/name/category/tags/desc/status/impairments ✓ |
| `settlement.schema.js:429-431` | SimNpc `role` / `title` / `category` ✓ |
| `settlement.schema.js:357 · :459 · :633` | `population` ✓ · `linkedInstitutionIds` ✓ · `coinFlows.taxed` ✓ |
| `institutionRoster.js:18-19 · :30 · :38-42 · :53-56` | the impaired-is-live note ✓ · `INACTIVE_STATUS` = ruined/removed/destroyed/remnant ✓ · `isLiveInstitution` ✓ · `liveInstitutions` ✓ |
| `institutionClassify.js:20-23` | the catalogId/provenance-boundary passage ✓ |
| `institutionServices.js:23 · :41 · :45` | "Tithe and dues" ✓ · "Taxation and tolls" ✓ · "Public records" ✓ |
| `rulingPower.js:224-230` | `governingFactionOf` with `isGoverning` / `governingName` ✓ |
| `npcProfile.js:327-335 · :341-353` | `CATEGORY_INSTITUTION_HINTS` ✓ · `inferInstitutionLink` (name-regex, not a typed edge) ✓ |
| `factionRoles.js:42-59` | High Priestess … Archmagister with `linkToInst` ✓ |
| `demographicsHerald.js:72-80 · :124-131` | `QUANTITY_BANDS` (400 → "several hundred") ✓ · `quantityWords` ✓ |
| `institutionalCatalog.js:1054-1059` | Customs house, "Levies duties…" ✓ |
| `institutionFounding.js:24-28 · :44-46` | "ABSENCE IS THE TYPED VALUE" ✓ · the three KINDS ✓ |
| `rulingStructure.js:624` | the ecclesiastical-tithes prose string ✓ |
| `foodStockpile.js:81-83` | the granary reserve tithe ✓ (the name collision is real) |
| `institutionDescVariants.js:451` | the banalité mill ✓ |
| `stateProseKernel.js:296-304` | `drawVariant` = `hash(seed::blockId::poolKey) % eligible.length` ✓ |
| `newsVoice.js:97` | the crier levy line — **a shipped STRING, not a comment, LIVE at the product tip** ✓ |
| `RECEIPT_POOLS_DOSSIER_STATE.md:5231-5233` | the `occupation_legacy` rows and the exemption clause ✓ |
| `RECEIPT_POOLS_TRADE.md:924` | the route toll exemption ✓ |

Also CONFIRMED: **`bailiff` = 0 hits** over `src docs`; **`record_a` / `record_b` = 0 hits** over
`src` (so R-DA-09's licensing field genuinely does not exist — critic C-7 stands).
Also CONFIRMED: R-DA-20's SIZE "2,734 R1/R2 variants" — measured **2,266 R1 + 468 R2 = 2,734** exact.

### F-PARTLY — the `whoIsExempt` census is right in its conclusion and wrong in its method · MEDIUM

CLERK-LAWS §1.2 says the grep for `exempt` over `src` finds only code and CSS comments. Measured:
**239 hits over `src`, 58 of them outside comment lines**, including
- `demographicsLand.js:347` and `:351` — a **live typed field** `exempt: true|false` returned by
  `siteLegality` (a user-placed site's exemption from the separation law). Not a person's exemption
  from a count, so the column conclusion survives — but "only comments" is false.
- `factionDynamics.js:466` — a generator `narrative` string asserting church land **exemptions**,
  in the same shipped-prose class as `newsVoice.js:97`. **This is a third live §1.3 breach
  candidate and no file names it.** CLERK-LAWS §4 and Part B §9 list exactly two.
- `general.generated.js:855` — the projected leaf twin of the annex breach `:5233`; the spec cites
  the annex only, and the wave's cure has to move both.

---

## §F4 — MOVE-GRAMMAR §0's corrected figure is REFUTED by execution · MEDIUM→HIGH

§0 row 1 raises the uniform-pool count from 407 to **408**, citing PROBE_ALL §8. Measured at
3b1c0eaa5 (`calib.mjs`, `calib2.mjs`), under three independent sentence definitions:

| definition | uniform pools / 708 |
|---|---|
| split on `(?<=[.!?])\s+` | **407 (0.5749)** |
| count terminal `[.!?]` runs | **407** |
| split before a capital/slot after `[.!?]` | **407** |
| split including `;` | 245 |

**No definition I tried reproduces 408.** The companion figure reproduces exactly: **79 of 708
(0.1116)** pools carry two variants sharing their first two words, and the pool count is **708**
exact. PROBE_ALL §8's own row prints `408 | 407 | +1` — a two-run DISAGREEMENT, which the spec read
as a confirmation. This is load-bearing twice: §4.4 control 4 requires the walker to reproduce
"408/708 and 79/708 **exactly**" as its calibration, and Part B R-DA-05 carries
"0.576 (408/708, MOVE-GRAMMAR §0's corrected count) → ≤ 0.400". A correct walker fails that
calibration. **The segment definition must be pinned in writing and the figure re-taken before the
control can gate anything.**

---

## §G — the five negative controls (lens g) · PARTLY · HIGH

Mapping §4.4's controls onto arms A–H:

| arm | control? |
|---|---|
| A — the ceiling | 1, 2 (pass), 4, 5 ✓ |
| B1 — the run | 1, 2 (pass), 5 ✓ |
| **B2 — adjacency inside a unit** | **none** |
| B3 — the rota | 2 ✓ (the best control in the file) |
| C — the claim | 3 ✓ for the claim-vs-field and quantifier limbs; **none for the SIBLING limb** |
| **D — the licence** | **none** |
| E — the spread | 4 ✓ (but see §F4) |
| **F — the walls** | **none** |
| **G — the non-moves** | **none** |
| **H — not-executable** | **none** |

**Five of ten arms have no control at all**, and arm C's sibling limb — the one the chair has just
split off and the one the taste sample must print — has none either. Arm D is the licensing arm,
i.e. the direct instrument of ruling (5): a walker whose arm D silently never fires would pass every
control in §4.4. Control 5 is a POSITIVE control, so the file has four negative controls, not five.
Control 4 is currently unexecutable as specified (§F4).

**Owed:** a control per uncontrolled arm, at minimum a fixture pair for D (a variant tagged with a
member whose field is null) and for F (an ABSENCE opener; a BILL immediately after a DEED).

---

## §H — the cross-register absence set, §5.2.6 (lens h) · CONFIRMED (no consent) · MEDIUM, cured

`grep -c "cross-register"` over the six `reconcile-*.md` and the six `refute-*.md`: **zero in every
reconcile**; one hit in `refute-dm-page.md:80`, on a different subject (scoping D10's licensing
clause). No register consented; the spec says so itself (§7.8), and chair C-10, Part B §10 item 10
and the dossier §8 all demote it to a proposed instrument with no binding force. **Disposition
correct.** The residue is that MOVE-GRAMMAR §5.2 still presents it as clause 6 of "one law, six
dialects" alongside five clauses that ARE evidenced.

---

## §I — fault 32 in the acceptance path (lens i) · PARTLY · MEDIUM

**Measured:** `fault 32` / `§32` / `ai:32` appears **0 times in MOVE-GRAMMAR.md and 0 times in
CLERK-LAWS.md**. CRITIC C-11's charge — the fault that binds every acceptance gate is named in
neither spec — is CONFIRMED by count.

**Cured downstream, and well.** Part B §0.2, §9 (vii) and §13.6, and the dossier §5 and §6.4, carry
it. The several-draws requirement is discharged twice: the taste sample shows **all of a pool's
variants** plus the same block under two seeds (§10 item 11), and the BLIND DM PANEL shows several
draws per pool with the readers blind and no threshold gating. That is a genuine answer to §32's
one-sample objection, not a restatement.

**The residual nobody names.** CLERK-LAWS §2.3 rules a WITHHELD verdict "never counts as a pass",
and the act that clears it is a model's adjudication (the Opus refuter's finding, ruled on by the
**Fable chair** — itself an LLM). The acceptance path therefore still terminates in a model's
judgment for every WITHHELD item, and there are many: A6's semantics per item, A8's band half,
R-DA-11's figure classes, R-DA-12's gnomic closer, NL-11's generalisations, the 90 off-key R6
offices, the 16 `will` lines, the 64+12 interior lines, the kind-exclusivity question. The owner's
veto is the human terminus, but the owner sees the chair's summary, not the item list. **Owed:** one
sentence saying whether the chair's ruling on a WITHHELD item is itself a gate under §32, and how
many such items the owner is shown.

---

## §J — the refuted figures the specs carry (lens j) · CONFIRMED covered, with one structural residue

CRITIC C-1's five carriers, against the chair's 13:51 rulings and Part B:

| spec passage | the refutation | covered? |
|---|---|---|
| §2.2 "n = 4 in R3/R5, floor 0.25 → 0.30" | S3-CEILING: R5 can draw only G-C/G-D, n = 2 | ✓ Part B §10 item 2 — n = 2 for R5, **no share ceiling and it says so**; dossier §4.A item 1 |
| §2.3 "two-word opener ≤ 0.10 of any stage" | R6-OP-01: `and the` exceeds 0.10 in all six stages | ✓ item 3 — ≤ 0.07 lift-filtered or content-word, never a raw bigram |
| §2.5 the four DM orders + 0.40 | S3 / CONTRADICTIONS C3: four three-move orders, one terminal | ✓ item 5 — withdrawn, re-cut by shape, ≤ 0.30 |
| §2.4/§6.4 the quiet pool "as FOUR SHAPES" | CL-1: `chronicleReadModel.test.js:99` pins index 0, `:102` the span noun | ✓ item 4 + chair M-4 — option (ii); the sample barred for R11/R12 |
| §2.6 / §3 CC-6 as ruling (5)'s chrome form | CC-6: every grepped form is already zero and cannot fail | ✓ Part B CC-6 — grep extended to `typically` 5 / `generally` 1, baselines published, MODERATE |
| §2.1 "the realised sequence set is larger than six" | C-4 | ✓ item 1 — **struck** |
| §4.3 arm C per-ROW `closed` | C-5 | ✓ item 7 — per column |
| §6.1 "the identical typed claim set" | C-3 / C-11 | ✓ items 7 and 11 |

**Coverage is complete.** The residue is structural: **every one of these corrections lives in Part
B §10 and none is written into MOVE-GRAMMAR or CLERK-LAWS.** That is exactly the defect CRITIC C-9
charged against R-DA-20 — "the correction must be written into the rule, not left standing beside
it" — reproduced one level up, on the two files Part B §10 points at as the closed sets' home
("the closed sets live in `sweep/MOVE-GRAMMAR.md` §2 as amended in §5 below", §0.1). A reader who
opens MOVE-GRAMMAR to build the walker reads n = 4 for R5, 0.10 for the ladder, the realised-set
sentence, per-row `closed` and the identical-claim-set sample. **Owed at the sitting:** either amend
the two specs in place, or stamp each superseded passage with its Part B item number.

---

## §K — the recommended taste-sample block, verified at the leaf · CONFIRMED, one PARTLY · MEDIUM

The dossier §9 records that the laneB6 leaf for the recommended block was not opened. I opened it
(`dswar1.mjs`, `nearpeace.mjs`). `DS-WAR-1 :: "warExhaustion: near peace"` at 3b1c0eaa5:

- **4 variants** ✓ — `[0] ledger · [1] unfolding · [2] threshold · [3] street`. The dossier's
  "`[0/4]` ledger and `[2/4]` threshold" is **exact**.
- `[2]` carries a subjunctive; no variant carries `will`/`shall` ✓ (U7's class exercised).
- `marks` is **null on all four** — no `dm-only` ✓ (the dossier flagged this as to-be-confirmed).
- The block is in **no** `LIVE_STRING_BINDINGS` row — the only bound symbol is
  `ECONOMY_FRESHNESS_SENTENCES` (`generate-dossier-state-prose.mjs:89`) ✓.
- The four-rung ladder is present: rested (3) · near peace (4) · war-weary (4) · exhausted (3) ✓.

**PARTLY, two clauses.**
1. **The pool is already an A11 breach.** Variants `[1]` and `[3]` both open "The town" — this pool
   is one of the 79 repeated-opener pools I counted in §F4. `check-pair.mjs:118` reports a
   PRE-EXISTING shared opener as a NOTE only (chair G: instrumented, not a gate), so the sample
   would pass mechanically while shipping the fault it is meant to demonstrate the cure for. The
   plan should name it as a cure target in the sample.
2. **"4 distinct level-1 grammars from V1/V2/V4/V5/V6/V7/V8" is not supported by the block.** V7 is
   R2-only by MOVE-GRAMMAR §2.1's own table (this is R1). V4 needs a named-object field and V5 an
   institution row: the block's slots are `settlement · counterpart · band · timeband_since ·
   timeband_span · reason`, and no variant of the pool carries an object or institution noun. The
   visible admissible set is V1 plus at most V2/V6 — the sample plan asserts a satisfiable n the
   fields do not obviously license, which is C-4's error one level down. **Owed:** name the
   licensing field of each of the four grammars before the sample is cut, or choose a block whose
   slot set licenses four.

---

## §L — what I did NOT test

The R6/R5/R7/R11/R12 registers (no loader exists — I did not build one); the nine `best-*.md` source
counts and the `kept-*.json` grades (outside this lens); the fourteen exemplar fingerprints beyond
the band endpoints the specs quote; `check-pair.mjs` was read, never run; the annex `A-U`/`A-W`
raw-byte figures; the classifier's precision (no classifier exists). Every figure above comes from a
command I executed and whose output I saw.

**Porcelain at `$SC/laneB6`: 0 before, 0 after. Nothing was written outside `$THIS/skeptic-s12/`.**

Seat: Opus 5 — Fable-unvalidated. Nothing here is validated until the chair's sitting.
