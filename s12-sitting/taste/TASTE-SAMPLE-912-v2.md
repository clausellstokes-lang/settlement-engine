Seat: Fable 5.1 — the chair's own authoring, SECOND CUT (session 5540cfd2, 2026-09-07 17:48 EDT); mechanically checked at laneB6 3b1c0eaa5; claim preservation is the Opus refuter's verdict, never this file's

# THE TASTE SAMPLE, v2 — one block, one pool, ALL its variants, in the grammars its composed fields license; the same block under two seeds (SITTING-RULINGS-912.md §F as corrected by the first cut's refutation)

**What changed from the first cut (WITHDRAWN — `TASTE-SAMPLE-912.md`, `refute-taste-912.md`).** The first cut claimed three grammars on `DS-POW-5` and a GAP demonstration on `DS-GEN-14`. The refuter showed: the object-first tag had no licence (the composer fills only two slots on this block); the GAP block was reached only because the probe passed an empty readings object; two rewrites moved a claim or a modality. This cut keeps what survived, withdraws what did not, and SAYS what the block cannot show. Nothing is applied; the corpus is unchanged (porcelain 0 before and after every check). A mechanical pass is not a claim-preservation verdict (`check-pair.mjs:136`); the refuter's findings and the chair's rulings on them are appended at the end.

## 1. The block, the pool, the fields — three numbers, not one
- **Block** `DS-POW-5` (power.generated.js). Its slot set has THREE readings, and the walker's arm D reads the third: the leaf's DECLARED `slots` field lists **8**; the union over its variants' text is **5** (`{settlement} {seat} {institution} {route} {good}`); the shipped composer's actual FILL for this block is **2** — `powerStateProse.js:895`: `slots: { settlement: town, seat: governing }`, with the comment beside it: `{institution}`, `{route}` and `{good}` are deliberately absent, one variant each of forty, no producer.
- **Pool** `governing body name: a SLOT, never a baked noun` — three variants (ledger [0] · visitor [1] · street [2]); the pool's claim: the governing body's name is the `{seat}` slot and the town uses it.
- **The admissible level-1 grammars for THIS block, by its COMPOSED fields:** **V1** PRESENT (the state key) and **V5** INSTITUTION → PRESENT (licensed by `{seat}`). Not drawable, and therefore not written: V4 (no object slot is composed — the first cut's "the hall" was licensed by nothing), V2 (no structural-consequence field), V3 (no `none-exists` field anywhere in the estate), V6 (no unresolved STATE field — only display labels), V8 (no not-held provenance on this block), V7 (R2 only). **So the pool of three shows TWO move orders — V5 once, V1 twice — and that is the honest count.** On today's composed fill sets an R1 STATE block licenses at most two orders; the third and the rest come from FIELDS the block does not yet hold (the §912 finding; the owner's §912.1 authoring wave).
- **The two seeds, re-derived through the SHIPPED readings path** (`gen-probe2.mjs`: the general desk through `generalDeskLines`, the power desk with `structuralLensOf(s)` + `coupContenders(s)` as `PowerTab.jsx:200` builds them — the first probe's empty readings object is gone): `chair-taste-2026-09-07` → **Breitturm** draws index **0** [ledger] (the V5 line); `chair-taste-2026-09-07-B` → **Langburg** draws index **1** [visitor] (the V1 line). Both towns' `foundedPoolKey(s.history)` = **FOUNDED-OLD / FOUNDED-OLD** — which is why the first cut's GAP block was never theirs. The draw is the code's own: `eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length]` (`stateProseKernel.js:304`; `:303` returns index 0 for a falsy seed — canonical-at-zero). So the seed that picks a variant picks its grammar; no new mechanism; nothing an installed world draws moves.
- **Level 2 is UNSHOWN:** the mount-order draw is owner-gated under THE PROMISE until the fingerprint-inputs receipt exists, and six of thirteen tabs hold one or two mounts today.

## 2. The three variants (pairs file `pairs-pow5-v2-2026-09-07.json`) — the TENSE printed beside every tag
### v2-1 — `DS-POW-5 :: governing body name: a SLOT, never a baked noun` [ledger] index 0 — **V5 INSTITUTION → PRESENT (tense: present throughout)**
BEFORE: What governs {settlement} calls itself the {seat}, and the name is precise about the town's size and pretensions in a way outsiders routinely mistake.
AFTER:  The {seat} is the name what governs {settlement} gives itself, precise about the town's size and pretensions in a way outsiders routinely mistake.
CLAIMS (the typed set, identical before and after — C-pair): the governing body gives ITSELF the name {seat} (the reflexive self-designation kept: 'calls itself' → 'gives itself'; the agent is still the body); the name is precise about the town's size; the name is precise about the town's pretensions; outsiders routinely mistake the MANNER of that precision ('in a way … mistake' kept verbatim)
RULE: V5 INSTITUTION → PRESENT: the sentence opens on the institution ({seat}) and ends on the present state; the chair's own cut, informed by the refuter's cure 1b but NOT adopting it (1b moved the naming agent from the body to the town — 'what {settlement} calls' — a different claim); here the body still names itself ('gives itself'), 'the name … precise' keeps body and name apart, the manner clause is verbatim; 24 → 23 words; A3 note: the proper fill {seat} now follows the article at the opening — a relocated, not created, breach, declared

### v2-2 — `DS-POW-5 :: governing body name: a SLOT, never a baked noun` [visitor] index 1 — **V1 PRESENT (tense: present) — KEPT AS WRITTEN**
BEFORE: A stranger who addresses the {seat} at {settlement} by any other title is corrected, politely and immediately.
AFTER:  A stranger who addresses the {seat} at {settlement} by any other title is corrected, politely and immediately.
CLAIMS (the typed set, identical before and after — C-pair): a stranger who addresses the {seat} by another title is corrected; the correction is polite; the correction is immediate
RULE: KEEP: the variant is already in the plain-fact grammar; the first cut ('gives … any other title') widened the act from address to conferral (the refuter's PARTLY) and bought nothing measurable — no cut earns its risk here; a KEEP is a lawful member of the sample (the 09-05 sample's own convention)

### v2-3 — `DS-POW-5 :: governing body name: a SLOT, never a baked noun` [street] index 2 — **V1 PRESENT (tense: present) — the V4 tag WITHDRAWN: no object slot is composed on this block**
BEFORE: The town at {settlement} calls the hall by its proper title in public and something shorter everywhere else, and both usages are precise.
AFTER:  The town at {settlement} uses the hall's proper title in public and something shorter everywhere else. Both usages are precise.
CLAIMS (the typed set, identical before and after — C-pair): the town uses the hall's proper title in public (the agent — the town — kept); the town uses a shorter form everywhere else; both usages are precise (a second fact, its own sentence — a QUALIFY move under R-DA-03)
RULE: the refuter's cure 3, adopted: the town stays the user (so the sibling [visitor] variant is not contradicted — a stranger's other title draws a correction; the town's own shorter form is the town's), the ', and both usages' tail becomes its own sentence, 23 → 20 words; the object-first label is withdrawn because the composer fills only {settlement, seat} for DS-POW-5 (powerStateProse.js:895 and the comment beside it) — V4 has no licence here

**C-sibling (the pool coheres in structural fact):** the three variants assert one governing body, named `{seat}`, whose name is in use and exact — [ledger] names it, [visitor] says a stranger using another name is corrected, [street] says the town uses the proper form in public and a shorter one elsewhere. They differ in STANDPOINT (the record · a stranger · the street) and, once, in GRAMMAR (V5 · V1 · V1). A tension the first refuter named is PRE-EXISTING and is NOT sharpened by this cut: the [street] shorter form is the TOWN's own (the agent restored), so it is not what draws a stranger's correction. Variant [2] carries no `{seat}` slot — it names the body by its hall; the refuter tests whether that is a sibling defect the corpus already holds. Openers after the cut: "the {}" · "a stranger" · "the town" — three distinct; article-openers 2 → 2 (the first cut's 2 → 3 undone); settlement-token openers 0 → 0.

## 3. The absence classes — declared, not demonstrated
- **LACK (V3): NOT-EXECUTABLE at this tip** — no `none-exists` field exists anywhere in `src` (0 hits). A schema act (dossier item 30a) precedes any LACK sentence.
- **GAP (V8): NOT-EXECUTABLE at this tip** — R-DA-08 licenses the written gap only by a typed not-held field with provenance, "never by the block merely lacking one"; the one pool that names an unrecorded founding, `DS-GEN-14 :: GROWN-UNRECORDED`, is keyed by `generalStateProse.js:623` on the mere falsiness of `history.founding`, and the generator writes a founding on 48 of 48 settlements, so the pool is unreached. The first cut's two GAP pairs are withdrawn as a demonstration (their one real gain — the absence moved off the opener — is recorded in `refute-taste-912.md`). Both absence classes wait on the schema acts and on the walker's arm I.

## 4. The mechanical receipt (executed; verbatim)
```
$ node check-pair.mjs $SC/laneB6 pairs-pow5-v2-2026-09-07.json
#v2-1 PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [ledger]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/1
#v2-2 PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [visitor]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/1
#v2-3 PASS(mechanical) DS-POW-5 :: governing body name: a SLOT, never a baked noun [street]
    · A11 SPREAD (sentences, pool "governing body name: a SLOT, never a baked noun" DS-POW-5, angles ledger/visitor/street): 1/1/1 → 1/1/2

corpus loaded: 2734 variants in 1020 pools; 3 pass mechanically, 0 WITHHELD (R4-BAND — the band half is the refuter's, not a FAIL), 0 fail (a mechanical pass is NOT a claim-preservation verdict — that is the refuter's job)
```
Word counts: v2-1 24 → 23 · v2-2 17 → 17 (KEPT) · v2-3 23 → 20 (none longer). WITHHELD 0. The A11 spread line: sentence counts 1/1/1 → 1/1/2 (a spread gained).

## 5. What is OWED and declared, not claimed
- The B-GRAMMAR walker's receipt on the sample (the order histogram; arm D's licence check against the COMPOSED fill set; the negative controls) — the instrument lane's first product.
- The C-sibling EXTRACTOR (stated by the chair above; the refuter's to test).
- **Five instrument gaps the first refutation exposed, for the walker lane:** (a) a settlement-token-opener count per pool, not only the two-word string; (b) a close-KIND arm per pool; (c) the CONTRAST regex extended to "never X so much as Y" and to a trailing coordinate negation; (d) a TENSE arm over the AFTER; (e) a licence arm that reads the composer's fill set, not the leaf's slot list.
- The Herald / ladder / chronicle demonstrations of MOVE-GRAMMAR §6 items 4–5 (the chronicle barred until its receipt set is complete; R6 and the DM page held).

## 6. The gate that remains
A second Opus refuter reads this file and the pairs file and tries to refute claim preservation on U1–U12, C-pair per pair (v2-1's "gives itself" against the BEFORE's "calls itself" in particular; v2-3's restored agent), C-sibling for the pool, the two tags and their tenses, the composed-fill claim (8 / 5 / 2), and the two-seed claim under the corrected probe. Its findings are appended below with the chair's ruling on each; a WITHHELD item is a finding, never a pass. Only then does the chair tell the owner whether the reconciliation has FULLY PASSED.

Product 3b1c0eaa5 UNCHANGED. Porcelain 0 → 0.
