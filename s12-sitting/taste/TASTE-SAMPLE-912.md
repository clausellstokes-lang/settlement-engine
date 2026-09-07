Seat: Fable 5.1 — the chair's own authoring (session 5540cfd2, 2026-09-07 17:23 EDT); mechanically checked at laneB6 3b1c0eaa5; claim preservation is the Opus refuter's verdict, never this file's

# THE TASTE SAMPLE — one block, one pool, ALL its variants in their grammars, the same block under two seeds (SITTING-RULINGS-912.md §F; MOVE-GRAMMAR §6 as amended by chair C-11)

**What this is.** The demonstration the owner asked for on 09-06 00:10: not "a sentence rewritten well" but ONE claim shown in more than one STRUCTURE — so that the shape varies while the facts do not. Nothing here is applied; the corpus at 3b1c0eaa5 is unchanged (porcelain 0 before and after every check). Every BEFORE is the real variant text from the product leaves (`src/data/dossierStateProse/*.generated.js`), matched by exact string by the checker. Every AFTER keeps the same slots, the same claims, the same band, the same angle, the same index; nothing is added to the world. **A mechanical pass is not a claim-preservation verdict** (`check-pair.mjs:136`) — the Opus refuter's findings are appended at the end when it returns, and the chair rules on them; no model's judgment is a gate (fault 32).

## 1. The block, the pool, the seeds
- **Block** `DS-POW-5` (power.generated.js) — its slot set over all its pools: `{settlement} {seat} {institution} {route} {good}`.
- **Pool** `governing body name: a SLOT, never a baked noun` — three variants (ledger [0] · visitor [1] · street [2]); the claim the pool carries: the governing body's title is the `{seat}` slot, and the town uses it.
- **The admissible level-1 grammars for THIS block, by its fields:** V1 PRESENT (the state key alone); V5 INSTITUTION → PRESENT (licensed by `{seat}`); V4 OBJECT → PRESENT (licensed by an object the block holds — here the `{seat}`'s own hall, which variant [2] already names; the walker's arm D decides whether that licence stands). NOT admissible on this block, and therefore not written: V2 (no structural-consequence field), V3 (no `none-exists` field — none exists anywhere in the estate), V6 (no unresolved state field — only display labels exist), V8 (no not-held provenance on this block), V7 (R2 only). **This is the licensing filter shown once:** three of eight members are drawable, so three variants take three grammars and none is written empty.
- **The two seeds.** The chair generated one town under each of two seeds with the product code (read-only; `gen-probe.mjs`): `chair-taste-2026-09-07` → Breitturm (town, 2,921), `chair-taste-2026-09-07-B` → Langburg (town, 2,198). Both towns draw this pool; Breitturm draws index **0** (the V5 line), Langburg index **1** (the V1 line). The draw is the code's own — `eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length]` (`stateProseKernel.js:304`) — so the seed that picks a variant picks its grammar; no new mechanism, no new hash input, nothing an installed world draws moves (A7/A17; THE PROMISE).
- **Level 2 (the tab's mount order under two seeds) is UNSHOWN:** the level-2 draw is owner-gated under THE PROMISE until the fingerprint-inputs receipt exists, and — as the sitting measured — six of thirteen tabs hold one or two mounts today, so there is little to draw.

## 2. The three variants, three grammars (pairs file `pairs-pow5-2026-09-07.json`)
### ts-1 — `DS-POW-5 :: governing body name: a SLOT, never a baked noun` [ledger] index 0 — **V5 INSTITUTION → PRESENT**
BEFORE: What governs {settlement} calls itself the {seat}, and the name is precise about the town's size and pretensions in a way outsiders routinely mistake.
AFTER:  The {seat} is what governs {settlement}, a title precise about the town's size and its pretensions, and one outsiders routinely mistake.
CLAIMS (the typed set, identical before and after — C-pair): the governing body's title is {seat}; the title is precise about the town's size; the title is precise about the town's pretensions; outsiders routinely mistake it
RULE: V5 (the institution opens; licensed by {seat}); R-DA-03 the ' in a way ... mistake' tail becomes a coordinate clause on the same claim; canonical-at-zero: index 0 keeps its claims and its slot set; word order and a rationed phrase spent, no claim

### ts-2 — `DS-POW-5 :: governing body name: a SLOT, never a baked noun` [visitor] index 1 — **V1 PRESENT**
BEFORE: A stranger who addresses the {seat} at {settlement} by any other title is corrected, politely and immediately.
AFTER:  A stranger who gives the {seat} at {settlement} any other title is corrected at once, and politely.
CLAIMS (the typed set, identical before and after — C-pair): a stranger who uses another title is corrected; the correction is polite; the correction is immediate
RULE: V1 (the plain civic fact, one move); a light cut only (word order; 'addresses ... by' → 'gives'); the claim set unchanged; the pool's opener spread kept (A stranger / The {seat} / The hall)

### ts-3 — `DS-POW-5 :: governing body name: a SLOT, never a baked noun` [street] index 2 — **V4 OBJECT → PRESENT**
BEFORE: The town at {settlement} calls the hall by its proper title in public and something shorter everywhere else, and both usages are precise.
AFTER:  The hall at {settlement} goes by its proper title in public and something shorter everywhere else. Both usages are precise.
CLAIMS (the typed set, identical before and after — C-pair): the proper title is used in public; a shorter form is used everywhere else; both usages are precise
RULE: V4 (the object opens — the hall, which the BEFORE already names; the licence is the {seat}'s own building, a question for the refuter and the walker's arm D); the ', and both usages' tail becomes its own sentence (R-DA-03); the town remains the implicit user (the street standpoint) — the refuter tests whether dropping the explicit agent drops a claim

**C-sibling (the pool coheres in structural fact):** all three variants assert one governing body titled `{seat}` at `{settlement}`, whose title is in use and exact; they differ lawfully in STANDPOINT (the record · a stranger · the street) and now in GRAMMAR (V5 · V1 · V4). No variant asserts an office, a count, an exemption or a relation another denies. The pool's two-word openers after the cut: "the {}" · "a stranger" · "the hall" — three distinct (A11).

## 3. The absence shown once — the GAP class, in a second pool (pairs file `pairs-gap-2026-09-07.json`)
`DS-GEN-14 :: GROWN-UNRECORDED` (general.generated.js) — the typed key itself is the not-held provenance: the founding is unrecorded. Both seeds draw this pool (index 1 in both). R-DA-08's form: the gap is WRITTEN, in the record never in the world, flat, never the opener, REPLACING an existing sentence (never added — the `LONGER` arm is unwaivable).
### ts-4 — `DS-GEN-14 :: GROWN-UNRECORDED` [elder] index 0 — **V8 PRESENT → GAP (the declared gap, in the record, never the opener)**
BEFORE: Nobody wrote down the beginning of {settlement}; the town simply proved convenient, and convenience compounded.
AFTER:  {settlement} proved convenient, and convenience compounded. Nobody set down its beginning.
CLAIMS (the typed set, identical before and after — C-pair): the beginning is not recorded (the GAP — licensed by the typed key GROWN-UNRECORDED, a not-held provenance by construction); the town proved convenient; convenience compounded (growth by accretion)
RULE: R-DA-08: the absence sentence lands INSIDE the existing variant, REPLACING its opener position (never the opener; flat; the record's gap, not the world's); the semicolon staple becomes a period (A′-R2); 'simply' (a rationed word) spent; the COUNT word 'nobody' kept so the mechanical arm reads no count change; index 0 keeps its claims

### ts-5 — `DS-GEN-14 :: GROWN-UNRECORDED` [street] index 1 — **V8 PRESENT → GAP**
BEFORE: {settlement} was never founded so much as agreed to, one household at a time.
AFTER:  {settlement} was agreed to, one household at a time, and never founded.
CLAIMS (the typed set, identical before and after — C-pair): there was no founding act — 'never founded' names the SIBLING band (FOUNDED-YOUNG / FOUNDED-OLD), so the contrast is licensed and KEPT (R-DA-02 / R4); the town accreted household by household
RULE: R-DA-08 / V8: the GAP moves off the opener to the close ('and never founded' — the record's absence of a founding act, stated flat); the sibling-licensed contrast is KEPT (the chair's FIRST cut, 'No founding is on record', FAILED check-pair's R4 arm for cutting the sibling word 'founded' — the checker was right; kept as pairs-gap-2026-09-07.cut1-FAILED-R4.json); 'never' retained (a DURATION word neither added nor lost); word order spent, no claim

**The LACK class (V3) is NOT demonstrable:** no `none-exists` field exists anywhere in the estate at 3b1c0eaa5 (`grep -rl "none-exists|noneExists" src` returns nothing), so the sample says so rather than writing one. A schema act (dossier item 30a) precedes any LACK sentence.

## 4. The mechanical receipts (executed; verbatim)
```
$ node check-pair.mjs $SC/laneB6 pairs-pow5-2026-09-07.json
#ts-1 PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [ledger]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/1
#ts-2 PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [visitor]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/1
#ts-3 PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [street]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/2

corpus loaded: 2734 variants in 1020 pools; 3 pass mechanically, 0 WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), 0 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)

$ node check-pair.mjs $SC/laneB6 pairs-gap-2026-09-07.json   (after the re-cut of ts-5)
#ts-4 PASS(mechanical) DS-GEN-14 :: GROWN-UNRECORDED [elder]
    · A11 SPREAD (sentences, pool "GROWN-UNRECORDED" DS-GEN-14, angles elder/street): 1/1 → 2/1
#ts-5 PASS(mechanical) DS-GEN-14 :: GROWN-UNRECORDED [street]
    · A11 SPREAD (sentences, pool "GROWN-UNRECORDED" DS-GEN-14, angles elder/street): 1/1 → 1/1

corpus loaded: 2734 variants in 1020 pools; 2 pass mechanically, 0 WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), 0 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```
**Declared:** the chair's FIRST cut of ts-5 ("No founding is on record.") FAILED the R4 arm — it cut the word "founded", which names the sibling band FOUNDED-YOUNG / FOUNDED-OLD, so the contrast was LICENSED and had to be kept. The checker was right and the chair re-cut. The failed pair is kept beside the passing one (`pairs-gap-2026-09-07.cut1-FAILED-R4.json`). Word counts: ts-1 24 → 21 · ts-2 17 → 17 · ts-3 23 → 20 · ts-4 15 → 11 · ts-5 14 → 12 (none longer). WITHHELD 0; NOTES: the A11 spread lines above (sentence counts move 1/1/1 → 1/1/2 and 1/1 → 2/1 — a spread gained, not flattened).

## 5. What is OWED and declared, not claimed
- The B-GRAMMAR walker's receipt on this sample (the order histogram per pool; arm D's licence check of V4's "hall"; the negative controls) — the instrument lane's first product (SITTING §F.4; CLERK-LAWS §4 overruled for the sample, vetoably).
- The C-sibling EXTRACTOR (the structural-fact coherence is stated by the chair above and is the refuter's to test; no instrument computes it yet).
- The Herald / ladder / chronicle demonstrations of MOVE-GRAMMAR §6 items 4–5 (the chronicle is barred until its receipt set is complete — chair M-4; R6 and the DM page carry the D8 / audience holds).

## 6. The gate that remains
An Opus refuter reads this file and both pairs files and tries to refute claim preservation on U1–U12 (`taste-sample-refutation.md` §2), C-pair per pair, and C-sibling for each pool, against the leaves at laneB6 3b1c0eaa5 (read-only). Its findings are appended below by the chair, each with the chair's ruling; a WITHHELD item is a finding, never a pass. Only then does the chair tell the owner the reconciliation has FULLY PASSED.

Product 3b1c0eaa5 UNCHANGED. Porcelain 0 → 0.
