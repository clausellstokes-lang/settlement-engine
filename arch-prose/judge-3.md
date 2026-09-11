# JUDGE 3 of 3 — THE COMPOSED-PROSE ARCHITECTURE RUN
**Seat: Opus 5 — Fable-unvalidated · 2026-09-07 · weighting: criteria (4) TESTABILITY and (5) AUTHORING ECONOMICS count DOUBLE**

Read whole: `ARCH-BRIEF.md`, the six reader maps, and all three designs (`design-A-data.md` 571 ln, `design-B-render.md` 455 ln, `design-C-authoring.md` 511 ln). Read-only on every tree; nothing written outside `$SC/arch-prose/`. Every figure below is either a command I ran in this session and saw the output of (marked **[X]**), or is cited to the file that carries it. Nothing over twelve words is quoted from any exemplar.

**Commands I executed for this judgment** (in `$SC/laneB6`, product tip confirmed `3b1c0eaa5` by `git log --oneline -1`):
- `node arch-prose/draw-reroll.mjs` → `FLATTENED … 45.21%` · `TWO-LEVEL … 100.00%` · `face-0 share 25.05%` over 141,600 (seed, pool) reads. **[X]** The measurement all three designs turn on is reproducible.
- a module-level census over `src/data/dossierStateProse/*.generated.js` → `{pools: 708, vars: 2266, poolsMixingDmOnlyAndPublic: 12, whollyDmOnly: 21, canonicalVariants: 7}`. **[X]**
- `head` over `arch-prose/_c-occ200.out.json` (design C's own 200-town occurrence output) — the file exists and carries the per-cell counts C cites. **[X]**
- term-coverage greps across the three documents for the brief's named laws and for the instrument-landing question. **[X]**

---

## THE SCORE TABLE

Raw score 0–10 per criterion. Criteria 4 and 5 are doubled. Maximum = (6 × 10) + (2 × 20) = **100**.

| # | criterion | A (data) | B (render) | C (authoring) |
|---|---|---|---|---|
| 1 | coherence with every law in the brief | 9 | 8 | **10** |
| 2 | boundedness — the arithmetic really stays linear in authoring | **9** | 8 | **9** |
| 3 | migration safety — zero text change first, byte-identical | 9 | 7 | **10** |
| 4 | **testability — every property has an arm that can fail** (×2) | 7 → **14** | 8 → **16** | 10 → **20** |
| 5 | **authoring economics under the exemplar law** (×2) | 8 → **16** | 7 → **14** | 9 → **18** |
| 6 | THE PROMISE and determinism | 9 | 9 | **10** |
| 7 | completeness across the fourteen sections | **10** | 9 | 9 |
| 8 | the owner's want — specificity that grows, nothing stale | 9 | 9 | **10** |
| | **TOTAL / 100** | **85** | **80** | **96** |

**WINNER: DESIGN C — the authoring/gates-led architecture.** It wins on both double-weighted criteria and it wins them on executed measurement rather than on framing.

---

## REASONING, CRITERION BY CRITERION

### (1) Coherence with every law — A 9 · B 8 · C 10

All three adopt the two-level roll over the brief's stated flat default, and all three are right to: the brief itself asks the design to state whether two-level is preferred and why (`ARCH-BRIEF.md:27`), and the measurement answers it — the flatten changes the *semantic variant* (angle, claim set) on 54.79 % of reads, so the migration criterion "wording-only on the golden sample" (`:30`) is unprovable under it. This is compliance, not deviation, in every case.

C separates itself on three law catches the others miss:

- **The angle law.** Every one of the 2,266 variants carries one of eight angles; a standpoint-neutral modifier fragment carries none. C alone notices this and proposes `plain` as a ninth palette member scoped to `role: modifier` rows only, and puts it to the owner as a §0b amendment (row 15). A and B author fragments without ever saying what angle they carry — a projector-level hole, since the leaf shape has no angle-less variant today.
- **The ABSENCE class.** C refuses `MOVE: ABSENCE` modifiers *outright* (R-DA-08's "replacing a sentence, never added", plus V3's LACK class being undemonstrable — no `none-exists` field exists anywhere). A and B only forbid absence-beside-absence and absence-opening, which is the weaker half of wall 3.
- **The four-outcome channel law.** C assigns FAIL / WITHHELD / NOT-EXECUTABLE / REPORT per property in §8.6. My grep: `NOT-EXECUTABLE` appears 5× in C, 2× in A, **0× in B**. The §908 law — a row keyed on a field no receipt ships declares itself not-executable instead of answering `[]` — is a live estate law and B never names it.

C's appendix discharges all twenty strains S1–S20 of `read-specs §9` individually, which is the only systematic proof of law coverage in the three.

A is close behind and follows the brief's law list most literally in its §11 refusals. Its one coherence wobble is that `attach.length ≤ 3` sits against the brief's own words for a modifier — "authored once, attachable to any spine of the block" (`ARCH-BRIEF.md:13`). It buys boundedness by narrowing the brief.

B loses a point for the same silences plus the missing NOT-EXECUTABLE channel. All three omit the deity doctrine (W7 — a TRADITION modifier never carries theology); only C mentions deity at all, once.

### (2) Boundedness — A 9 · B 8 · C 9

Three different structural bars, and A's and C's are the strongest:

- **C** refuses at the projector: a modifier's `**READS:**` may name exactly ONE path, and the census prints pieces-per-field so a second modifier on one field is visible to the chair (§11 row 1). The list is the only door. This is the hardest single bar of the three.
- **A** adds the device neither other design has: **`k ≤ 3 − |meta(spine).reads|`** — a multi-fact conjunction spine lowers its own modifier budget, so `invasionRowPoolKey`'s three-fact spines take *no* modifier at all. With 111 conjunction-keyed pool keys in the corpus (`read-kernel.md:453`) this is the rule that stops the already-paid-for explosion from being re-paid through modifiers. A also caps `attach ≤ 3` and echoes ≤ 1 per tab, both as projector errors.
- **B** makes it a gate FAIL: a `ROLE`-less new pool reading ≥ 2 facts fails unless it is a TURN with `EXPLAINS`. Strong in kind, but B's occurrence floor (2 %) and departure threshold (5 %) are ESTIMATE with no executed distribution behind them, and its echo budget is enforced by a manifest walker rather than structurally.

The counterfactual arithmetic is where C is most defensible: **5 spines × 2⁴ modifier states = 80 pools × 3 = 240 variants** for the walls block hand-cut, against 24 semantic pieces composed. B's counterfactual (1,620) inflates by multiplying value-counts rather than modifier states; A's (57) understates by counting only the cells the block distinguishes. C's is the number a chair could defend.

### (3) Migration safety — A 9 · B 7 · C 10

All three land the same three correct structural decisions — sibling metadata map (not a pool object), nested `wordings` (not flat siblings), `drawFace` with modulus 1 as a provable identity — and all three build the composed-prose manifest because the generator golden master (525 rows) provably cannot see a dossier sentence.

C wins on two counts:

1. **It reuses the golden master's own 525-row corpus builder** (`generatorGoldenMaster.test.js:802-847`) rather than minting a fresh N = 200 seed set. One corpus builder, one instrument, a grid already gated for tier × culture × terrain × route × threat coverage. A and B each mint a new N = 200 set and then have to defend the set.
2. **The two-audience control.** C alone records the manifest at `audience: dm` AND `audience: player`, and alone spots why it must: the player's eligible list is shorter on any pool holding a `dm-only` variant, so the modulus — and therefore the drawn index of a *public* variant — can move between audiences. **I measured this: 12 of 708 pools mix `dm-only` with public variants [X].** A one-audience manifest is blind to that whole class, so A's and B's "byte-identical" claims are a half-claim. C also pins the count of such cells so a difference anywhere else reads as a leak.

B loses two points for a genuinely muddy migration car: C4 folds the DS-DEF-11 key-function re-cut into the car whose entire acceptance is byte-identity, gated on "ONLY IF the manifest proves the re-cut moves zero rows". A key-function re-cut necessarily moves rows on walled + strained + measured-family towns, so the condition can never be met and the clause is dead weight inside the one car that must stay clean. A (O-10, Phase 2) and C (car 6, under Shift 2) both keep the re-cut in a separately-signed later car, which is correct.

### (4) TESTABILITY — A 7 (→14) · B 8 (→16) · C 10 (→20) · DOUBLE

This is the criterion I weight heaviest and it is where the three separate most sharply.

**A has a real hole, and I confirmed it by reading its own files column.** Every claim-and-composition arm A builds is written to `skepINSTR/src/domain/prose/{entryWalker,grammarWalker}.js` (car C4) and to `skepINSTR/src/domain/prose/wiringCensus.js` (car C0). **A never lands the instruments into the product tree.** There is no `src/domain/prose/` at the product tip at all (`read-instruments-seed.md:15-25`, executed by that reader). A's projector and contract-test arms do land, so its *shape* gate is real; but A1 restatement, A2 connective typing, A3 wall 5, C1–C6 over composed units — the arms the whole model depends on — never reach product CI in A's sequence. A's §11 risk 5 acknowledges the instruments' blind spots but not their absence from the tree. A gate that never runs in CI is a receipt, not a gate.

**B lands them** (car C5, flagged as owner row 6) and its §8 gate table is clean: property / existing arm / status / new arm, with arms A1–A12 enumerated and the Brackwater discipline (each arm convicts a planted control, passes a clean one) required. Good work.

**C is the only design that treats testability as the architecture's spine**, and it earns the 10 on five specifics:

1. **The landing is its own car, sequenced BEFORE any authoring car** (car 3 of 10), and C says plainly what the gate is worth until then: until the instruments land, the wave's gate is a lane tool run by hand and its verdicts are receipts, not green. That sentence is the difference between an honest instrument program and a false-green one — the class this estate has already burned.
2. **Every property carries a CHANNEL** (FAIL / WITHHELD / REPORT), and C sequences the channel honestly: A5 sibling-distance is **REPORT until the floor is measured, then FAIL**; arms B1/B2/B3 are **REPORT until the `grammar:` tags ship, then FAIL**. You cannot gate on a floor you have not measured, and C is the only design that says so.
3. **The two-audience manifest control** (§3 above) — confirmed load-bearing on 12 pools **[X]**.
4. **A per-pool face-count PIN** — a face count that moves outside a declared shift reds. A has "the ratchet re-pinned"; B has "A10 a face ratchet"; C's is per pool, which is the grain at which a fifth wording would re-roll a world.
5. **The most concrete anti-vacuity extension**: a planted composition that manufactures a C2 duty + exemption pair from two innocent pieces. That is exactly the emergent-claim class composition creates and no single-piece walker can see.

C also carries the sharpest instrument-blind-spot inventory of the three (the classifier at 0.75–0.83; arms B need sequences no generator produces; the bag resolver's first-declaration bug; the receipt's miscounted sensory lexicon at 166 distinct nouns, not 177; arm A NOT-EXECUTABLE at n ≤ 2 on 33 blocks; `check-pair.mjs` living in a scratchpad and copied by hand into two trees), each with a named guard.

### (5) AUTHORING ECONOMICS under the exemplar law — A 8 (→16) · B 7 (→14) · C 9 (→18) · DOUBLE

C's declared angle, and it delivers artefacts the other two do not have at all:

- **The LICENCE CARD (§8.5)** — a per-list-row writer's brief derived from the census, carrying `reads / predicate / bag (with shapes and conditionals) / relation + the engine edge that licenses it / move / grammar / may claim / may NOT / audience`. It prints the **refused columns** (a totality over persons; an exemption from a duty) so a fluent writer never reaches for "every household". This converts the annex's prose licence — 68 STATE-KEY, 48 RECEIPT, 23 PROVENANCE, 22 ENTAILMENT lines that the projector drops today — into something a writer is handed. Nothing in A or B is close.
- **The tier → list mapping (§8.4)** is mechanical: seven row kinds, each with the piece ROLE and what the writer is told, and `NO-LIST-ROW: <reason>` for everything that fits no rule. A and B both say "the tiers are the queue" and stop there.
- **The three-"twenty" reconciliation** printed side by side (declared 20 / bag-instrument 22 / bag-corrected 19) "so the wave never again sizes itself on the wrong twenty" — a direct guard on the wave's own sizing.
- **The nine bound rows that keep one face** (7 `canonical` + 2 live-string-bound rows in `economy.generated.js`), because re-voicing a byte-copy of an engine string forks the string. **I confirmed the 7 canonical variants by my own census [X].** Neither A nor B catches this; both would have sent a writer to re-voice a row that must not move.
- **The occurrence floor is set against a distribution C executed itself at N = 200** (56 cells; 9 below ten towns; 4 on every town; output in `_c-occ200.out.json`, which I inspected **[X]**). A and B set their floors against the N = 25 probe or mark them ESTIMATE. Under criterion 5's "under the exemplar law" — measured, never invented — that is the difference.
- **The honest floor correction**: "specificity rises everywhere" means everywhere a second typed fact exists, and nowhere else (33 of 68 blocks license one level-1 member). A says the same in its §6.4 "The floor, honestly"; B only implies it through S10.

**C's one omission, and it costs it the 10:** C never names the **exemplar-not-the-practical** ruling (shoot for the ideal in the first or second attempt; never pursue perfection), which is on the brief's own law list and is precisely the law that caps authoring cost per family. **B names it and binds it to the wave** ("each family is shot for the ideal in the first or second attempt and not chased after"), with "no round past the second on any family" as a car acceptance. My grep: 1 hit in B, **0 in A, 0 in C**. Without it, both A's ≈ 6,800-wording and C's ≈ 4,000-wording estimates have no stopping rule per family.

A takes 8 for the crispest statement of the economic claim itself — "authoring cost per new secondary fact: ONE modifier pool with ≤ 3 attachments" — and for honest debt sizing. B takes 7: its §8 is one page, and its licensing-at-authoring is a paragraph pointing at the estate ground.

### (6) THE PROMISE and determinism — A 9 · B 9 · C 10

All three are sound: two-level roll on a `::w` **suffix** of the parent key (so the parent hash is a different string and never moves), canonical-at-zero preserved at every level, salience a pure function of state and seed, no draw-time refusal anywhere (a filter that removed a candidate would change `eligible.length` and move every later index).

B's five-key table (piece / key material / modulus / "new seed input?") is the clearest single presentation, and B alone names the `NORM_TABLE` as itself a seed input from the day it ships.

C edges ahead on the SALIENCE bound, which the brief states in two halves: a town reads the same on every visit, **and** two towns with the same facts foreground differently. A scores numerically (3/2/1 weights) and then admits its own limit honestly — identical facts with unequal bands foreground identically on every seed, and only ties are seed-broken. B admits ties are common in a 15-value score space and asks for the tie rate to be printed. **C's two-BAND scheme (NOTABLE vs ORDINARY, with a seeded permutation *within* a band) delivers both halves by construction**: a rare or tense or changed fact always outranks an ordinary one, and two towns holding the same two ordinary facts genuinely foreground them differently. C also records the seedless page (`galleryImportSettlement.js:67` nulls `_seed`, so `''` selects index 0 everywhere) as a manifest control; A and B do not mention it.

### (7) Completeness — A 10 · B 9 · C 9

A follows the brief's fourteen sections in the brief's own numbering, with depth in every one; its §1 and §7 are fuller than either rival's. B adds a §0 lead and keeps all fourteen. C reorders (§8, §12, §13 lead, then the rest) and covers all fourteen plus the S1–S20 appendix, with two limbs stated as declared refusals with reasons — which the brief explicitly permits ("n/a is a refusal with a reason"). C's §1 and §7 are the thinnest of the three, and its connective treatment is split across §2.4 and §4.6. B loses one for slightly thinner §5 and §7.

### (8) The owner's want — A 9 · B 9 · C 10

B's §0 is the best *communication* of the want in the three documents: a real town, real field values, the audience gate firing, and the closing move — when the covert watch is exposed the modifier's key changes from covert to revealed, so the sentence changed because the world did. That is the owner's want made concrete better than anywhere else.

But the criterion is *nothing stale*, and C operationalises it hardest. C's REPEAT CENSUS computes a **chance floor from the piece counts** (a 3 × 4 spine alone = 1/12 per pair of towns in the cell; with one modifier and a joint = 1/432) and rules that a mount ABOVE the floor is a finding — an authoring row, never a draw change — while a mount AT the floor is the owner's sentence made exact. A's duplicate-unit rate is a good trendline (baseline printed at M0, after every car) but has no floor to compare against; B's repeat rate likewise.

C is also the only design that says out loud what this wave does **not** buy: it buys wording variety and **no angle variety** (C's own 200-town run: visitor 1033 / street 1028 / ledger 946 against unfolding 34 — the corpus's authoring imbalance showing through a uniform draw). Telling the owner what his signature does not purchase is part of serving the want.

---

## THE BEST IDEAS THE WINNER LACKS — to be grafted into C

### From DESIGN A

1. **The fact budget `k ≤ 3 − |spine.reads|`.** A multi-fact conjunction spine lowers its own modifier budget, so a three-fact spine (`invasionRowPoolKey(walls, garrison, militia)`) takes no modifier at all. With 111 conjunction-keyed pool keys already in the corpus, this is the rule that stops the hand-paid explosion being re-paid through modifiers. C has no per-unit fact budget at all — graft it into C's §4.4 bound.
2. **`attach.length ≤ 3` as a projector error, plus the per-tab echo bound** (≤ 1 modifier mention per fact per tab, and none on the tab where that fact is a spine). C's same-block confinement leaves a fact attachable to every spine in its block with no numeric cap, and C's echo rule is per page-set by first-mount order rather than per tab. A's version is enforceable at projection.
3. **The RESERVOIR: an explicit `ATTACH: DS-XXX-N:<key>` act for the 15 unmounted blocks (448 authored, licensed variants).** It leaves the reservoir pool's own draw key untouched (moving nothing — the CT-1a/2/3 pattern), licenses it by the ATTACH site's bag, and keeps `UNMOUNTED_BLOCKS` shrink-only. C sends all fifteen to `NO-LIST-ROW: wiring first` and recovers none of that authored prose.
4. **The census-staleness interlock**: the projector refuses to run when the census's stamped sha of the six composers is stale, so the census must be regenerated before the corpus is. C checks the census in as JSON and `--check`-gates it, but A's sha interlock is the tighter ordering guarantee.
5. **The position budget for multi-rung mounts (A §4.9)**: at a mount drawing more than two rungs, at most TWO rungs carry modifiers. C's capacity rule is per composed unit and says nothing about `overview.systemsHealth`'s eleven rungs or `faith.patronSeat`'s eight — eleven two-sentence units at one position is a wall the composed model can walk into.
6. **A's worked refusal** — `MOD: the approach is narrow` refused on the overview tab because `tradeRouteAccess` is already a spine at `overview.origin`. A design that shows its own rule biting on a real block is more trustworthy than one that only shows the rule passing. C should carry at least one refused row in its worked blocks.
7. **The duplicate-unit rate baselined at M0 and printed after every car** — pair it with C's chance floor and the owner gets both an absolute comparison and a trendline.

### From DESIGN B

8. **The exemplar-not-the-practical ruling bound into the wave**: each family shot for the ideal in the first or second attempt, with "no round past the second on any family" as a car acceptance. This is on the brief's law list, it is the stopping rule that caps authoring cost per family, and **C omits it entirely**. Highest-value graft of the eight.
9. **The relation-flips-with-polarity finding.** A deficit is a *tension* against a high prosperity rung and an *addition* against a low one. B's answer: `relation` stays fixed per POOL so the walker can check it, and where it flips it is two pools, with the desk keying the one whose polarity matches the spine. **C's `RELATION_TABLE[(fieldA, fieldB)]` is keyed on the field pair and structurally cannot express this** — a real hole in C's relation model that B found.
10. **The five-key determinism table** (piece / key material / modulus / "new seed input?" / notes) as a single artefact for the owner and for arm A4. C's determinism is correct but distributed across §2.3, §4.3 and §4.7.
11. **The `NORM_TABLE` / frozen-rate named as a seed input in its own owner row.** C freezes `rateBp` at the freeze but never tells the owner that the frozen rate is itself something he is signing, and that a re-measurement re-orders modifiers on installed worlds.
12. **Wall 10 extended to the composed unit**: a modifier whose face opens with `{settlement}` is not seated after a spine that opens with it, enforced by tag at the freeze. The settlement-token opener is a measured estate figure (0.240) and neither A nor C guards it across the join.
13. **B's §0 — the walked render on a real town with real field values**, adopted as C's own lead. C's document is the most rigorous and the least vivid; B's §0 is the artefact that would make the owner see the model working before he reads a bound.

---

## ONE FINDING THAT BELONGS TO NO DESIGN

All three quote the brief's first-paint figure (RAW 1,042,122 of 1,048,000; margin 5,878 B) from the L-MAT tip, and all three correctly decline to re-measure it under the fences — but all three also then plan a corpus that grows from 641,410 B to ≈ 2.2 MB raw. The ratchet that would catch a first-paint regression **does not exist at the product tip** (`sizeBaseline.test.js` is a per-file max-LINES ratchet; `bundle-analyze.mjs` asserts nothing). A (car C1b), B (car C10) and C (car 8) each build it, but all three build it late. Whichever design is ratified, the byte ratchet should move earlier in the sequence — it is the only instrument standing between a 2.2 MB corpus and a 5,878-byte margin, and the margin is carried on a receipt from a tip none of the three could read.
