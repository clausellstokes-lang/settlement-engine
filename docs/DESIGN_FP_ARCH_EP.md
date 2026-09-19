# DESIGN — THE ADVANCE EPOCH (EP: living futures, immutable pasts)

## LANDED 2026-08-07 as a member of the docs/DESIGN_FP_ARCH_* family — the
## per-program file for the EP owner-amendment program, sibling to
## docs/DESIGN_FP_ARCH_{SP,GR,IN,TR,WF,POP,INT,CW,ES,WY,HB,WC}.md and NORMATIVE
## where the compiled volume docs/DESIGN_FP_ARCHITECTURE.md compresses it.
## Promoted whole from the durability snapshot
## `docs/architected-volumes-pending-fold/EPOCH_living-futures_round7-snapshot.md`
## on the LEDGER branch (review-fixes-2026-07-08 @ 151afbf6), UNCHANGED IN SUBSTANCE: this header block,
## the §5 promotion note and the self-reference below are the ONLY
## transformations — no wave spec, no section number, no ruling text and no seam
## row moved. Renumbering would rot every live cross-reference to a prefixed
## wave; what renumbers at a fold is the PARENT's global sequence, never the
## incoming volume's own sections.
## ⛔⛔ **LANDING IS NOT SEALING, AND THIS VOLUME IS NOT SEALED.** It is a DRAFT
## AT ROUND SEVEN — line 3 below says `DRAFT for the validation chair`, there is
## no §9 and no attestation block, and REVISION 6's four rulings are confirmed by
## nobody. The fold gives it a canonical home, a queue position and a wave count;
## it does not close it. Open at landing: 5 chair questions (§7), 4 owner-gated
## parked rows (§7a, count pinned at four by chair ruling P4), 2 chair-owed
## dispositions (§7b), 1 recorded deferral. A reader who reads "landed" as
## "sealed" has been warned here first.
## ⛔ EP CAN NEVER SHARE A CYCLE — it is the only program that edits
## `pulseKernel.js`, where PRNG call order IS the stream identity.
## ✅ §5's VERIFY-AT-FOLD banner CAME DUE AND WAS DISCHARGED AT THIS FOLD: the
## post-fold parent §5/§9 rows were RE-COUNTED (not inherited) at eca65c8a and the
## fold's PLAUSIBLE 75/66 was CONFIRMED by execution, so no STOP fired. EP's rows
## compose LAST in every parent table, per binding condition C3 of the E5 ruling.
## HEAD at landing: eca65c8a (stamped by the landing lane).
##
## DRAFT for the validation chair, 2026-08-05. THE OWNER-AMENDMENT VOLUME for the
## advance-epoch directive (memory/advance-epoch-living-futures-directive.md — its
## verbatim-intent section is LAW here). Written to the docs/DESIGN_FP_ARCH_* house
## template (siblings _ES, _WY, _HB, _WC); IT HAS TAKEN the repo home
## docs/DESIGN_FP_ARCH_EP.md — this file — and its §5 queue insertion LANDED
## VERBATIM 2026-08-07 in
## docs/DESIGN_FP_ARCHITECTURE.md, whose §1 laws L1-L9, §3 flag law, §5 wave order,
## §9 seam matrix and §10 protocol BIND VERBATIM here; the war volume
## docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md §1/§10 is the canon behind both.
##
## COMPILE PROVENANCE. Compiled from FOUR substrate censuses (stream identity + kernel
## seam · advance/undo/persistence · regen-affordance denominator · test estate +
## promise homes), authored 2026-08-05 as SESSION-SCRATCHPAD COMPILE INPUTS — NOT repo
## files, they do not land with this volume, and every premise a wave consumes is
## RE-MEASURED at build. Every load-bearing premise below was re-measured against the
## live minifold worktree (branch claude/composite-r4) at HEAD
## 32cc17f75f643b6be18029437db62acb6574e968, tree clean.
## ⚠⚠ **HEAD MOVED DURING THE REVISION-6 ROUND AND EVERY LOAD-BEARING CODE PREMISE WAS
## RE-VERIFIED AT THE NEW ONE.** Revision 6 began at `32cc17f7` (tree carrying eight dirty/
## untracked lines) and, mid-round, the **ES + WY INTEGRATION FOLD LANDED** —
## `d789f9f5` → `51283abe` → **`7794cb4a`**, tree clean, queue item #34 DISCHARGED. Exactly ONE
## `src` file moved in that fold (`src/domain/worldPulse/informationStatecraft.js`, +12) and it
## is on none of this volume's paths. **RE-RUN AT `7794cb4a`, ALL REPRODUCING BY SYMBOL:**
## `nextWorldStateForPulse`'s `const tick = current.tick + 1;` and its calendar spread · seam
## edit 9's host line · `setSpatialLedger`'s body · the FIVE `applyWorldPulseOutcomes` call
## sites (six textual hits, one being the definition) · all EIGHT family-1 read sites · both
## chain hosts (`worldState: prior.worldState`, `args.worldState  memoryState (post-apply)`) ·
## `collapseIntervalHistory`'s `return reconcileProvenanceAfterHistoryCollapse({ ...worldState, pulseHistory: composed }, removed);`
## and `const removed = intervalRecords.slice(0, -1);` · the reconcile's three `provenance`
## accessor calls · `provenance`'s `EXEMPT_LEDGER_KEYS` row · the `memoryState` seam sitting
## upstream of `appendPulseHistoryWithProvenance` · and both pillar censuses (**68** `rngSeed`
## occurrences in `src`, **37** `createPRNG(` in `src/domain`). ⚠ **Line addresses moved and
## SYMBOLS did not — which is the whole reason this volume's navigation law says SYMBOL.**
## ⚠ **§5's fold-status prose is STALE BY EVENT rather than wrong — see the banner there.** **THIRTEEN premises were REFUTED
## across five passes** (R1–R13, all labelled and re-countable at §0.3) — two refuting
## the censuses themselves, three refuting REVISION 1 of this volume, **two refuting
## REVISION 2 of it (R9's read-site gap and R10's value-driven spreads)**, **two
## refuting REVISION 3 (R11's homeless Arm-A writer and pre-advance read, R12's implicit
## single year vocabulary)**, and ⭐ **one refuting EVERY REVISION FROM 2 ONWARD — R13, the
## family-1 accessor that was declared at four sites and given no epoch source at any of
## them (the LARGER half of the side-channel program, cured in §3b.1b)**. The J-WR-13
## STOP rule binds: an implementer finding a further overstatement STOPS before building
## on it. LIVE CODE OUTRANKS EVERY TABLE HERE; navigate by SYMBOL, never by any line
## number — every line number below is an EVIDENCE ANCHOR, not an address.
##
## ⭐ REVISION 2 (chair rulings R1..R9, 2026-08-05). The cohesion pass returned
## NEEDS-REVISION and the chair ruled nine amendments, all folded here and all
## RE-MEASURED at HEAD by the amending architect rather than accepted from the review:
## R1 the entropy-root denominator extends to EVERY seeded idiom (the `hash01` family,
## §0.3 R7) · R2 `previewCampaignWorldPulse` is a CONSUMER (§0.3 R8, §3c) · R3 row 14
## corrected to three compositions in two idioms (§0.3 R1) · R4 the dark contract becomes
## FLAG-DRIVEN (§2.3) · R5 per-site fallback fidelity is REQUIRED (§3b.3) · R6 §5
## re-derived against the LIVE queue and the real fold package · R7 EP-4 re-scoped, two
## slices extracted as owner-gated (§4) · R8 the affordance census widened to EIGHTEEN
## and the source scan rebuilt on the CR-FP-11 precedent (§3e) · R9 the totality pin
## carries an anchored negative for the synthetic record (§8.1 row 9).
##
## ⭐⭐ REVISION 3 — THE POLISH PASS (chair rulings P1..P9, 2026-08-05). The cohesion pass
## confirmed all nine revision-2 findings closed and returned NINE NARROW RESIDUALS; the
## chair ruled nine amendments, all folded here and ALL RE-MEASURED AT HEAD by the
## amending architect rather than accepted from the review — which found ONE FURTHER
## READ SITE the review did not (`traditionsKernel.js` → `seasonalSeverityFor`, §0.3 R9)
## and ONE FURTHER INTERNAL CONTRADICTION nobody had raised (§0.3 R10, the value-driven
## record and cursor spreads under a flag-driven stream contract).
## **P1** the census's READ-SITE half is completed and made first-class (§3b.2a, TWENTY-TWO
## read sites), the `pulseKernel.js` read JOINS the seam contract, and §3b.1 is restated
## as an EXACT ENUMERATED TOKEN-EDIT LIST — the "three token edits" slogan is retired ·
## **P2** §3b.1's fold target is MEASURED and quoted (§3b.1 step 3) · **P3** §3e's Wave
## column routes A4/A5/A11 to the PARKED owner rows, never EP-4 · **P4** ONE parked-row
## count, FOUR, at every site · **P5** H1's persisted-allowlist edit is CLASSIFIED, with
## a measured values-only-no-shape argument that keeps it in the wave (§4 slice 1) ·
## **P6** the §3e tally is RE-MEASURED (the ALREADY-COMPLIANT figure moved, 5 → 6) ·
## **P7** the walker's three closure figures are RE-RUN and corrected (38→37, 31→32,
## 8→5) · **P8** H7 goes BEHIND THE FLAG · **P9** the preview↔commit pin NAMES its
## projection and enumerates its exclusions (§3c).
##
## ⭐⭐ REVISION 4 — THE FINAL-TOUCH PASS (chair rulings T1..T6, 2026-08-05). The seal pass
## confirmed all NINE revision-3 residuals genuinely closed and returned FIVE NEW findings,
## one of them ARCHITECTURAL. All six rulings are folded here and ALL RE-MEASURED AT HEAD
## by the amending architect; the amendment found TWO FURTHER REFUTATIONS the seal did not
## (§0.3 R12, the year-vocabulary split, and the `spatialLedgers` coverage-manifest
## obligation §3b.1a states).
## **T1 (HIGH)** — ⭐⭐ **ARM A's `byYear` WRITER IS DESIGNED, NOT ASSUMED.** The seal proved
## the writer had NO CALL SITE anywhere in this volume and that edit 7's in-pulse read was
## aimed ONE STATE TOO EARLY (the PRE-advance world, which structurally cannot carry a key
## for the year the advance is entering). The stamp now has a MEASURED home, a MEASURED
## ordering proof, a first-wins law, its own enumerated seam edit and a manifest row
## (§3b.1a, §0.3 R11). **The pulseKernel edit inventory GROWS to NINE**, and every
## statement of the figure moves with it — the retired-slogan honesty rule applies: the
## count is what the count is · **T2** ALL THREE flag-driven materializations are unified on
## `epochTerm` with the invariant chain stated as a named chain and asserted on the exact
## path (§2.3b, §2.5 fences 1 and 5) · **T3** §3e's sweep-C `generateSeed()` figure is
## corrected and the whole volume is grepped for further survivals (ONE found, NONE left) ·
## **T4** `economyReconciliation.js`'s SECOND `rngSeed` name collision gets its own
## disposition row and becomes a walker negative control (§3b.2a) · **T5** the `hash01`
## consumer figure RE-COUNTS CALLS with a corrected command (13 mention-modules → **TEN
## calling modules**) · **T6** the walker's mandatory negative control is RE-ANCHORED on a
## LIVE module, because `personaSlicer.js` has ZERO importers in `src` — which is itself
## recorded as a chair-owed dead-module disposition (§7b row B1, report-never-delete).
## Anomaly **A-P3-3** is recorded as a STATED FACT in §3c and the preview pin now leans on
## it rather than around it.
##
## ⭐⭐ REVISION 5 — THE SETTLING ROUND (chair rulings F1..F8, 2026-08-05; the FINAL content
## round). The closing pass confirmed ALL SIX revision-4 rulings closed and every closure-record
## figure reproducing, and returned FIVE RESIDUALS plus THREE RULED ANOMALIES. All eight are
## folded here and ALL RE-MEASURED AT HEAD by the amending architect. **No architecture moved:
## the writer's home, its ordering, its laws, the `yearBase` ruling, the invariant chain and
## the manifest obligation all stand exactly as revision 4 measured them.** (⚠ Revision 6 does
## move two of them — the writer's SLICE and law 2's scope — under chair ruling G1; that is
## recorded in the revision-6 block above, not here.) What moved is the
## EVIDENCE: two claims that were carried by prose are now carried by executed pins, one fence
## assertion that would have RED A CORRECT BUILD is respelled, and three citation/count defects
## are cured.
## **F1 (MEDIUM)** — ⭐⭐ **THE STAMP-SURVIVAL RECEIPT NOW COVERS ALL NINE FAMILY-2 RE-ROOTS,
## EXECUTABLY.** Revision 4 pinned the stamp's survival across the FOURTEEN reassignments
## between seam edits 9 and 7 and then carried the OTHER EIGHT sites — which sit behind
## SIXTY-NINE rebinds across TWO files — on one asserted sentence in the ordering table's step
## 8. That is the exact treatment §3b.1a rejects for the short span, and it re-opens R11's
## silent-dead-arm shape at eight new addresses inside the section that cured it at one. §3b.1a
## now carries THE STAMP-SURVIVAL PIN: one parameterized suite, NINE enumerated rows, a
## per-row observed-call floor, and four mutants. **ZERO prose-carried sites remain** ·
## **F2 (MEDIUM)** — fence 5's M3 expectation is respelled to match fence 5's OWN step 1: a
## LIT advance that pauses has already committed its minors, so the ledger EXISTS with a stamp
## for every committed tick. The gloss "ABSENT ENTIRELY" would have RED a correct
## implementation on day one and invited a repair that blinds the estate's only detector for
## mutant (d) (§2.5) · **F3 (LOW)** — the coverage walker is cited at its REAL path and BY
## SYMBOL at all four sites; it lives at `tests/lib/`, not `tests/lint/` (§3b.1a, §4, §8.1) ·
## **F4 (LOW)** — row 1 has THREE read sites, not four; the fourth item is reclassified with a
## stated reason (§3b.2) · **F5 (LOW)** — J-EP-6's home rationale is restated on LAYERING
## grounds only; the gate-avoidance clause is struck as asymmetric with §3b.1a's own
## escape-hatch refusal · **F6 (anomaly A-R4-1, RULED)** — the ordering pin now asserts the
## stamp into the RETURNED world, closing the wholesale-replacement hole with a check rather
## than trust (§3b.1a) · **F7 (A-R4-2, RULED)** — EP-3 slice B declares the `spatialUsage.js`
## manifest row a CQ5-CLASS SHARED-FILE touch and SERIALIZES against flag waves (§4, §5) ·
## **F8 (A-R4-3, RULED)** — the `byYear`-vs-`pulseHistory` count divergence is a DECLARED
## NON-INVARIANT with its collapse-semantics reason, stated in §3b.1a beside the ledger's laws
## and pointed to from §1.5 and §8.4. ⚠ **The revision-5 record said "LAW 5" while §3b.1a stated
## FOUR laws plus a declared non-invariant; revision 6 cures the citation and the ledger now
## genuinely has FIVE laws, because `latest` earns one (chair ruling G1).**
## ⚠ **ONE FURTHER COUNT SLIP WAS FOUND BY THIS ROUND AND CURED** (§5 item 5 said "the NINE
## EP rows (§8.1)" beside its own "+10" — the same family F4 closes, in the one item that
## publishes verbatim into the parent volume).
##
## ⭐⭐ REVISION 6 — THE FASTENING ROUND (chair rulings G1..G4, 2026-08-05; the LAST content
## round). The ratify pass confirmed ALL EIGHT revision-5 closures and every pillar figure
## reproducing at HEAD, and returned ONE HIGH, ONE MEDIUM and TWO LOW. All four are folded here
## and ALL RE-MEASURED AT HEAD by the amending architect, which found TWO consequences the
## ratify pass did not: the writer's SLICE MOVES, and the family-1 accessor has a reach OUTSIDE
## the pulse that no re-root table named.
## **G1 (HIGH, ARCHITECTURAL — §0.3 R13)** — ⭐⭐ **THE FAMILY-1 ACCESSOR HAS A SOURCE, A
## SELECTION RULE AND A SPELLED BODY.** `tickStreamSeedOf(worldState, { absent })` was declared
## at FOUR sites across three revisions and could not return an epoch-bearing seed under either
## arm: its signature carries no epoch, its body was spelled nowhere, and the pending epoch has
## no `worldState` home during the tick (J-EP-12 struck `current` precisely because the value is
## ARGS-BORNE). **RULED (chair, G1): the source is THE STAMPED LEDGER IN THE `worldState` THE
## SITE RECEIVES.** Seam edit 9 stamps on the composed world BEFORE every downstream subtree
## call, so the ledger gains a per-tick `latest: { tick, epoch }` beside `byYear`, the accessor
## selects it ONLY when `latest.tick` equals the world's own `tick`, and the stale-tick arm is
## the dark contract's fourth structural lock — a dark tick never writes, so the next read finds
## a stale tick and falls back to the site's own `absent` coercion CHARACTER-FOR-CHARACTER.
## §3b.1b is the full spec: the body, the ordering proof, the eight family-1 reach measurements,
## the TWO NON-PULSE DOORS the pulse-side ordering walk cannot cover, the two amended ledger
## laws, and the executed two-epoch pin. ⚠⚠ **AND THE CONSEQUENCE THE RULING FORCES, STATED
## FIRST BECAUSE IT MOVES A SLICE BOUNDARY: THE WRITER, THE LEAF, SEAM EDIT 9, THE +1 IMPORT
## LINE AND THE `spatialUsage.js` MANIFEST ROW ALL MOVE FROM SLICE B INTO SLICE A** (J-EP-14).
## Slice A ships under EITHER arm and now needs a stamp; slice B is Q1-gated and cannot host
## slice A's dependency. The writer's `byYear` half stays in slice B, so **under Arm B `byYear`
## is never written at all** — no dead persisted state, which is the same test J-EP-12 applied
## to `current` ·
## **G2 (MEDIUM)** — the collapse-semantics PREMISE is respelled ACCURATELY at all three homes
## (§1.5, §3b.1a, §8.4). What is true, MEASURED: the path composes by SPREAD
## (`{ ...worldState, pulseHistory: composed }`) so `spatialLedgers` is CARRIED THROUGH, and the
## one `spatialLedgers` write on the path is `reconcileProvenanceAfterHistoryCollapse`'s
## PROVENANCE prune, which preserves every sibling key. The RULING is unchanged and independently
## re-confirmed; only the falsifiable-in-one-grep phrasing is gone ·
## **G3 (LOW)** — the four-mutant matrix is reconciled to ONE spec across its two homes: §4's
## slice charter now states §3b.1a's rows (mutant (ii) reds rows 2–9 **plus the returned-world
## arm**), because a wholesale replacement at the `memoryState` seam is UPSTREAM of the return ·
## **G4 (LOW)** — the attribution ruling's stated ambiguity is corrected: **SEVEN of the nine**
## family-2 rows sit in argument-identical groups, not five (RS-3 and RS-9 share
## `{ absent: '', yearBase: 0 }` exactly as RS-4/5/6/7/8 share `{ absent: '', yearBase: 1 }`).
## ⚠ **TWO FURTHER CITATION SLIPS FOUND BY THIS ROUND AND CURED:** the revision-5 record said the
## non-invariant is "stated as LAW 5 in §3b.1a" while §3b.1a states FOUR laws plus a declared
## non-invariant (now FIVE laws, because `latest` earns one), and the F1 instrument paragraph's
## "ONE lit year-crossing advance" did not say that row 9 (RS-16) is a VIEW-TIME site the suite
## must drive separately — both corrected in place.
##
## QUEUE POSITION: POST-FOLD. §5 is written against the LIVE `docs/SOL_QUEUE.md` and the
## fold package's own insertion text; every count there is marked MEASURED or
## VERIFY-AT-FOLD, never inherited (§5 preamble).

---

## §0 THE PREMISE

### 0.1 The directive, verbatim (binding)

> **Owner's words (intent, binding):** "the DM that loved a starting world so much
> that they go back to it to see a completely different yet plausible history. on our
> end, we can recreate the exact clicks and determinism to chase bugs, but for them...
> the user that backtracked because he didn't like the direction based on vibes. now
> he undos and advances time again to see a different plausible history still
> coherent."

> **The design (chair, accepted by owner in the same exchange):** every USER-initiated
> advance mints a fresh entropy nonce (generateSeed()-class, minted at the store-action
> layer, NEVER wall-clock inside the kernel) and RECORDS it in the history/action log
> entry. The pulse stream identity gains the nonce (the pulseKernel seed string
> `rngSeed::tick:N::interval` grows an epoch/nonce term — ⚠ a PULSE-KERNEL SEAM,
> zero-pulse-edit law applies, chair-signed seam required). Undo deletes the history
> entry; the next advance mints a NEW nonce → a genuinely different, fully coherent
> history. Replays feed the RECORDED nonces → byte-exact, so goldens, dormancy fences,
> four-fence proofs, and bug reproduction all survive as (worldState, seed,
> nonce)-pinned tests. Legacy saves: entries without a nonce replay as epoch-0 (current
> behavior) — back-compat exact.

> **What it preserves:** same seed = same STARTING world (seed-sharing culture intact);
> a LIVED history never rewrites (loading a save shows the same past — the trust
> floor); all internal determinism for debugging.
> **What it amends (OWNER-SIGNED constitutional shift):** THE PROMISE narrows from "a
> seed is a world's whole timeline" to "a seed is a starting world, forever; a lived
> history, once lived, forever." Two DMs sharing a seed share the starting world, not
> the same future. Save-scumming the FUTURE is now a feature, deliberately: the user is
> the world's author — re-drawing the un-lived future is brainstorming, not cheating;
> the immutable past carries the meaning.

> **THE GENERATOR SIDE (owner, same exchange: "and the same thing for the generator
> side"):** the identical law governs generation. Every user-facing
> generate/reroll/regenerate affordance — whole-world generate, settlement regen,
> history reroll, any per-surface reroll button — mints FRESH entropy per click
> (generateSeed()-class) and yields a different plausible output, with the user's edits
> preserved per the regen-edit preservation laws. The SEED stays the address door:
> typing/pasting a seed returns the exact starting world (how the DM comes back to the
> beloved one); clicking generate/reroll is the living door (always a new draw). Fresh
> generation ALREADY works this way (generateSeed is the one sanctioned non-determinism
> door); the directive makes it LAW across every regen affordance and forbids any
> user-facing regen that silently replays the same draw. Internal replay stays
> deterministic via recorded seeds.

⚠ **MARKETING GUARD (owner, standing):** "the same world can tell entirely different
histories" becomes TRUE only when this program SHIPS LIT — not claimable in copy before
then. §8.3 makes that a pinned gate, not a memo.

### 0.2 What is genuinely new — exactly four things

Everything else ships today, pure and gated; the measured verdict is that this is
overwhelmingly a THREADING problem with one seam and one instrument.

1. **The epoch term** — a new segment on ONE stream-identity string (§3b). ⚠ **THE
   "THREE TOKEN EDITS" SLOGAN WAS RETIRED IN REVISION 3 (chair ruling P1) AND THE
   REPLACEMENT FIGURE MOVED AGAIN IN REVISION 4 (chair ruling T1).** The honest figure is
   an ENUMERATED LIST of **SIX token-level edits on SIX existing lines** of
   `pulseKernel.js` in EP-1 (zero new lines), **plus THREE more in EP-3 — ⭐ SPLIT ACROSS
   THE SLICES IN REVISION 6 (chair ruling G1): THE STAMP ITSELF (edit 9) plus the ONE NEW
   IMPORT LINE in SLICE A, which ships under EITHER arm, and the two re-root edits (7, 8) in
   SLICE B under Arm A — all three at zero new lines, the import being the planned,
   chair-signed one-line ratchet-up (J-EP-11)**. **NINE enumerated
   token-level edits, +1 line, total.** The full list is §3b.1, and it is the seam
   contract; no summary sentence anywhere in this volume may state a smaller number.
   ⚠ **THE HONESTY RULE THIS FIGURE CARRIES:** the count has now moved twice, from three
   to eight to nine, each time because a required edit was found that a slogan had hidden.
   **The count is what the count is.** A future pass that finds a tenth STATES TEN; it
   does not preserve nine by declaring the new edit "not really a kernel edit."
2. **The mint → record → replay loop** (§3a/§3d) — the wall-clock `now` already does
   exactly this end to end; the epoch copies its shape verbatim.
3. **The side-channel disposition** (§3b.2) — **TWENTY-FIVE** stream compositions across
   SIXTEEN modules that read `worldState.rngSeed` DIRECTLY and never descend from the
   pulse root, in **THREE entropy idioms** (`createPRNG`, `hash01`, `fnv1a32`), reached
   through **TWENTY-TWO runtime READ SITES** (§3b.2a — the census's second half, added in
   revision 3; a composition is *what* is drawn, a read site is *where the value must be
   re-rooted*, and the two denominators are NOT the same number). This is the real body
   of the program, and it is NOT what the directive assumed (§0.3 R1/R7/R9).
4. **The affordance law made structural** (§3e) — a walker plus **FIVE** small repairs
   (H1 · A3 · H7 · A17's door · A18's door — recounted in revision 3 after H7 moved into
   the flagged slice, chair ruling P8), not a pipeline change. **FOUR further rows are
   OWNER-PARKED and build nowhere in this program** (§7a).

### 0.3 ⚠⚠ REFUTATIONS — nothing builds on the left column

**R1 — REFUTED, LOAD-BEARING: "the pulseKernel seed string is THE pulse stream
identity."** MEASURED: `simulateCampaignWorldPulse` composes exactly one root (the only
`createPRNG` call in the file) and every kernel sub-stream descends from it via
`rng.fork(label)` — but **TWENTY-FIVE further root compositions across SIXTEEN modules
build their draw key from `worldState.rngSeed` DIRECTLY and are never handed the root
`rng`.** SIXTEEN of them use `createPRNG`; EIGHT use `hash01`; ONE uses `fnv1a32`.
The `createPRNG` family (rows 1–16; the `hash01`/`fnv1a32` family is R7's table):

| # | Module (symbol home) | Composition | Family |
|---|---|---|---|
| 1 | `worldPulse/seasons.js` `seasonalSeverityFor` | `` `${rngSeed}::season:${year}:${settlementId}` `` | YEAR-KEYED |
| 2 | `worldPulse/roadsKernel.js` | `` `${rngSeed}::roads-hazard:${mid}:${now2}` `` | TICK-VARYING |
| 3 | `worldPulse/roadsKernel.js` | `` `${rngSeed}::roads:cadence:${npcKey}:${year}` `` | YEAR-KEYED |
| 4 | `worldPulse/roadsKernel.js` | `` `${rngSeed}::roads-genesis:${sid}:${now2}` `` | TICK-VARYING |
| 5 | `worldPulse/roadsKernel.js` | `` `${rngSeed}::roads:stay:${sid}:${npcKey}:${year}` `` | YEAR-KEYED |
| 6 | `worldPulse/traditionsKernel.js` | `` `${rngSeed}::tradition:${rec.id}:${year}` `` | YEAR-KEYED |
| 7 | `traditions/politics.js` `claimRoll` | `` `${rngSeed}::tradition:claim:${id}:${year}` `` | YEAR-KEYED |
| 8 | `traditions/relations.js` | `` `${rngSeed}::tradition:impose:${sid}:${year}` `` | YEAR-KEYED |
| 9 | `traditions/politics.js` → `reexpressed(rec, seedKey)` | `` `${rngSeed}::tradition:reexpress:${id}:${year}:${kind}` `` | YEAR-KEYED |
| 10 | `roads/thirdPartyRansom.js` | `` `${a.rngSeed}::roads-ransom3p:refuse:${ransomId}` `` | TICK-VARYING (minted id) |
| 11 | `roads/thirdPartyRansom.js` | `` `${a.rngSeed}::roads-ransom3p:outcome:${ransomId}` `` | TICK-VARYING (minted id) |
| 12 | `roads/seaRoads.js` | `` `${a.rngSeed}::roads-sea:storm:${m.id}:${a.now2}` `` | TICK-VARYING |
| 13 | `spatial/intelActs.js` `intelEligible` | `` `${String(rngSeed)}::intel-trade:${x}:${y}:${year}` `` | YEAR-KEYED |
| 14 | `worldPulse/realmVerbExecution.js` FORCE_CALAMITY | `` `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}` `` → `forkFn(k)` + `` `${seed}:exodus` `` | TICK-VARYING |
| 15 | `worldPulse/realmVerbExecution.js` FORCE_FOUND_STEADING | `` `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}` `` → `forkFn(k)` | TICK-VARYING |
| 16 | `worldPulse/realmVerbExecution.js` FORCE_RESETTLE | `` `${String(state.rngSeed ?? 'realm')}:realm_verb` `` → `forkFn(k)` — **NO TICK TERM** | ⚠ TICK-FREE (own disposition, §3b.2) |

CONSEQUENCE: an epoch added only at the pulse root ships a "fresh future" whose weather,
traditions, road cadence, NPC road rhythms, intel trades, NPC succession contests, city
demographic responses and sovereignty-market buyers are bit-for-bit the old future.
§3b.2 disposes ALL TWENTY-FIVE, each ruled in or out with a written rationale, under the
law: **a composition with no disposition row is a build STOP.**

**⚠ ROW 14 WAS ITSELF WRONG IN REVISION 1 (chair ruling R3) — RE-MEASURED HERE.** The
first draft filed `realmVerbExecution.js` as "TWO sites, one idiom, CLASS TICK." MEASURED
at HEAD (`grep -n 'const seed = ' src/domain/worldPulse/realmVerbExecution.js` → three
hits, at `FORCE_CALAMITY`, `FORCE_FOUND_STEADING`, `FORCE_RESETTLE`): **THREE
compositions in TWO idioms**, and the third carries NO tick term. Its own class
justification ("they key on an integer TICK plus an entity id") is therefore FALSIFIED
for that row, and it may not inherit it — rows 14/15 are tick-varying, row 16 is
tick-INVARIANT and takes the separate disposition §3b.2 spells. The module also composes
FOUR `createPRNG` calls from those three seeds (`forkFn` ×3 plus `` `${seed}:exodus` ``).

**R2 — REFUTED: both stream censuses reported THIRTEEN roots, and each MISSED A
DIFFERENT ONE.** Census 1 omitted `traditions/politics.js#reexpressed` (the seed is
composed on one line and handed as a STRING to a helper that calls
`createPRNG(seedKey)`); census 4 omitted `realmVerbExecution.js` (the seed is composed
on its own `const seed = …` line and consumed two lines later). **The true denominator
is FOURTEEN compositions across FIFTEEN sites.** This is the unanchored-extractor class:
a single-line-anchored census over a multi-line idiom under-reports and exits 0.
**⚠ R2 IS ITSELF SUPERSEDED BY R7: fourteen was still wrong, because the whole census —
both the original one and R2's correction of it — was scoped to `createPRNG`.** The true
denominator is TWENTY-FIVE (R1's table plus R7's). R2 stands as the record of the
first-order miss and of why a single-line anchor under-reports; the DENOMINATOR it states
does not.

**R3 — REFUTED IN DETAIL: the directive's shorthand is not the live string.** MEASURED
verbatim at `pulseKernel.js#simulateCampaignWorldPulse`:

```js
const rng = createPRNG(`${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}`);
```

Two divergences, both load-bearing for any byte-identity pin: the tick term is
`tick + 1` (the tick being ENTERED, not the world's tick at rest), and the interval term
is `tickInterval` = `usableTickInterval(interval)`, which silently composes an unknown
interval as `'one_month'`. A pin written from the shorthand is vacuous.

**R4 — REFUTED: `worldState.rngSeed` is the user-facing seed.** MEASURED:
`createDefaultWorldState` sets `` rngSeed: `world-pulse:${seedPart}` `` where
`seedPart = campaign.id || campaign.name || 'campaign'`. The pulse root is derived from
CAMPAIGN IDENTITY; the generation seed is a separate root
(`generateSettlementPipeline.js`). "Same seed = same starting world" is a GENERATOR-side
promise — the pulse's determinism story was never seed-addressed. Do not architect the
epoch as if one seed rooted both.

**R5 — CORRECTED: the memory claim "history reroll preservation — UNCOMMITTED" is
stale.** `src/domain/historyPreservation.js` is tracked and clean at HEAD
(`git log --oneline -- src/domain/historyPreservation.js` → `a88be4f1`). EP-5 carries the
memory correction.

**R6 — the determinism lint ban does NOT cover `src/store` or `src/components`.**
MEASURED: `eslint.config.js` scopes it to exactly six blocks —
`src/generators/**/*.js`, `src/pdf/**/*.{js,jsx}`, `src/domain/**/*.js`,
`src/workers/**/*.js`, `src/kernel/**/*.js`, `src/kernel/prng.js` — and
`tests/lint/determinismBanCoverage.test.js` pins those layers. Census 3 stated the block
was scoped to `src/generators` alone; that spelling is wrong, its CONCLUSION
(components is uncovered) is right. The store mint is lint-legal; the second entropy
door in `src/components/instant/InstantWorldEntry.jsx` is real and uncaught (§3e H4).

**⭐⭐ R7 — REFUTED, AND IT REFUTES REVISION 1 OF THIS VOLUME (chair ruling R1): THE
DENOMINATOR WAS WRONG BY AN ENTIRE ENTROPY FAMILY.** Revision 1 chartered a
`createPRNG` census and declared fourteen roots. MEASURED at HEAD: a **second seeded
substrate roots at `worldState.rngSeed` at EIGHT further draw sites across FIVE
modules**, none of them a `createPRNG` call. `src/domain/region/contestMath.js#hash01` is
an FNV-1a + fmix32 avalanche `[0,1)` draw, deterministic on its string argument, and
these eight key it off the world seed:

| # | Module (symbol home) | Draw key | Family | What the draw decides |
|---|---|---|---|---|
| 17 | `worldPulse/npcLadderContest.js#advanceAwareness` | `` `${seed}\|ladder-contest:aware:${contestId}:${side.nid}:${tick}` `` | TICK-VARYING | whether a rival DISCOVERS a contest |
| 18 | `worldPulse/npcLadderContest.js#advanceAwareness` | `` `${seed}\|ladder-contest:bluff:${contestId}:${rival.nid}:${weeks}` `` | TICK-VARYING (weeks) | the bluff skew on heard progress |
| 19 | `worldPulse/npcLadderContest.js#tieBreak` | `` `${seed}\|ladder-contest:resolve:${contest.id}` `` | TICK-VARYING (minted id) | ⚠ **CHOOSES THE WINNER of a succession contest** |
| 20 | `worldPulse/npcLadderContest.js` (support pass) | `` `${seed}\|ladder-support:${sid}:${nid}:${year}` `` | ⚠ YEAR-KEYED | whether an NPC converts to a support goal |
| 21 | `worldPulse/npcLadderChallenge.js#challengeDraw` | `` `${seed}\|${tick}\|ladder\|${fkey}\|${cNid}\|${dNid}` `` | TICK-VARYING | whether a challenge is ATTEMPTED |
| 22 | `worldPulse/demographicsPlans.js` | `` `demographics.plan.${realm}.${settlementId}.${episode}.site` `` | TICK-VARYING (`episode = `${stepTick}:${band}``) | WHERE a satellite steading is founded |
| 23 | `worldPulse/demographicsResponses.js#selectResponse` | `` `demographics.plan.${input.realmId}.${input.settlementId}.${input.episode}.${entry.response}` `` | TICK-VARYING (same episode) | ⚠ in-source: "the last bit here CHOOSES WHAT A CITY DOES for the rest of a campaign" |
| 24 | `worldPulse/sovereigntyMarketStage.js` (the keyed race) | `` `sovereignty.offer.${realmId}.${sellerId}.${buyerId}.${assetId}.${episode}` `` → `draw: weight * hash01(key)` | TICK-VARYING (`episode = `${tick}:${band}``) | WR-10's winning BUYER |

**And a THIRD idiom, one site, on a DISPLAY surface:** `src/components/map/CauseWalkPanel.jsx`
passes `seedId: worldState?.rngSeed ?? rootId` into
`src/domain/display/discourseKernel.js#realizeCauseWalk`, whose `pick(pool, seedId, key)`
is `` pool[fnv1a32(`${String(seedId ?? '')}::${key}`) % pool.length] `` — **row 25**, the
connective/prose variant chooser for a cause walk. Its disposition is the DISPLAY-SURFACE
RULE (§3b.2), not a class inherited from an engine row.

**THE THREE ROOT READS THAT FEED THIS FAMILY, and are the actual re-root sites:**
`npcLadderKernel.js` `const seed = String(asObject(worldState).rngSeed || '');` — handed
CROSS-MODULE into `resolveFactionChallenges` (`npcLadderChallenge.js`) and
`advanceContests` (`npcLadderContest.js`) as a bare `seed` string; `demographicsKernel.js`
`realmId: typeof asObject(worldState).rngSeed === 'string' ? String(…) : 'realm'` — handed
into `demographicsPlans.js`, which itself re-reads (`const realm = String(realmId ||
asObject(worldState).rngSeed || 'realm')`) and forwards to `demographicsResponses.js`;
`sovereigntyMarketStage.js` `const realmId = text(worldState.rngSeed) || 'realm';`.

CONSEQUENCE, stated plainly: **under revision 1's design, a re-advanced "fresh future"
would have resolved every NPC succession contest, every city demographic response and
every sovereignty-market buyer BIT-FOR-BIT IDENTICALLY.** This is R1 repeated one level
down in a different spelling, and it is exactly why §3b.2's walker is re-chartered as an
ENTROPY-ROOT census (anchored on reads of `worldState.rngSeed` however the receiving
variable is named, followed across module boundaries to EVERY consumer) rather than a
`createPRNG` census. **THE CENSUS IS CLOSED BY TWO CONSECUTIVE EMPTY SWEEPS**, executed:
sweep A enumerated all 68 textual `rngSeed` occurrences in `src` and dispositioned each;
sweep B enumerated all **37** `createPRNG` call sites in `src/domain` (⚠ revision 2 said
38 — RE-RUN AND CORRECTED, chair ruling P7), all 13 `hash01` consumer modules and all
**32** hash-helper definitions in `src` (⚠ revision 2 said 31 — corrected); sweep C
matched every
`(hash01|fnv1a32|fnv1a|hashUnit)` and `createPRNG` key template containing a
`seed`/`realm`/`realmId`/`rngSeed`/`seedId` interpolation and traced each to its root.
Sweeps B and C added ZERO sites beyond the twenty-five above.

**R8 — REFUTED: "§3c enumerates every user-facing fork point" (chair ruling R2).**
MEASURED: `advanceCampaignWorld.js#previewCampaignWorldPulse` is
`return runWithPinnedContent(args, false);` — the same body as `advanceCampaignWorld`
with `commit = false` — and it is LIVE and USER-FACING, reached from
`src/components/map/SimulationRulesDialog.jsx` (`useStore(s => s.previewCampaignWorldPulse)`)
through `campaignWorldPulseSlice.js#previewCampaignWorldPulse` →
`campaignWorldPulseDeferred.js#runPreviewCampaignWorldPulse`, which calls the domain
function directly with `{ campaign, saves, interval, now, customContent }` and **never
travels through `advanceInterval.js`'s `tickArgs`** — the exact place revision 1 threaded
the value. Left as written, a lit build previews the epoch-ABSENT stream while the real
advance runs an epoch-BEARING one, so the dialog silently stops predicting. §3c gives it
a row and a pin.

**⭐⭐ R9 — REFUTED, AND IT REFUTES REVISION 2 OF THIS VOLUME (chair ruling P1): THE
CENSUS CLOSED ITS COMPOSITION HALF AND LEFT ITS READ-SITE HALF OPEN.** Revision 2's
twenty-five compositions REPRODUCE EXACTLY under an independent sweep — the denominator
is right. But a composition is *what is drawn*; the thing an epoch program must EDIT is
the **READ SITE**, the place a world-shaped object's `rngSeed` is taken off state and
handed downstream. MEASURED at HEAD, **THREE runtime read sites feeding rows in the
disposition table appear nowhere in revision 2 as re-root sites**:

| Read site (symbol home) | Verbatim at HEAD | Feeds | Absent-seed behaviour |
|---|---|---|---|
| ⚠⚠ `worldPulse/pulseKernel.js` → `seasonalContextFor` argument | `rngSeed: startingWorldState.rngSeed,` | **ROW 1**, the IN-PULSE consumer — the severity the simulation actually runs on | **NO COERCION AT ALL** ⇒ the template interpolates the literal `"undefined"` |
| ⚠ `worldPulse/generosityKernel.js` → `intelEligible` | `const intelSeed = String(/** @type {{ rngSeed?: unknown }} */ (worldState)?.rngSeed ?? '');` | **ROW 13** — and it is the SOLE production caller | `''` — but via `?? ''`, so `0` ⇒ `'0'` (distinct from `\|\| ''`) |
| ⚠ `worldPulse/traditionsKernel.js` → `seasonalSeverityFor` | `const severity = seasonalSeverityFor(String(asObject(worldState).rngSeed \|\| ''), year, sid);` | **ROW 1 again**, a SECOND in-engine composer of the same key | `''` |

The third was found by revision 3's own sweep and by neither prior pass: revision 2's
§3b.3 coercion table counts `traditionsKernel.js ×2`, but its composition table gives
`traditionsKernel.js` exactly ONE row (row 6), so the second read was COUNTED AS A
COERCION AND NEVER ASSIGNED A COMPOSITION. `intelEligible`'s caller census is closed —
`grep -rn "intelEligible" src` returns exactly three lines (the import at
`generosityKernel.js`, the call, and the definition at `intelActs.js`) — so
`generosityKernel.js` is row 13's ONLY re-root site, and the string
`generosityKernel` appeared ZERO times in revision 2.

CONSEQUENCE, and it is a BUILD STOP under J-WR-13 rather than an editorial gap: the
`pulseKernel.js` read is inside the file whose seam contract said "three token edits,
zero other kernel edits", and re-rooting it costs a further edit that contract never
budgeted. §3b.1 is therefore restated in revision 3 as an EXACT ENUMERATED TOKEN-EDIT
LIST, §3b.2a adds the whole read-site census as a first-class table, §3b.3's coercion
table grows to NINE rows, EP-3's Collision list gains both modules, and J-EP-11 rules
the budget consequence.

**⭐ R10 — REFUTED, INTERNAL: REVISION 2'S TWO CONDITIONAL SPREADS ARE VALUE-DRIVEN WHILE
ITS STREAM CONTRACT IS FLAG-DRIVEN.** §2.3b (chair ruling R4) made the STREAM gate on
`simulationRules?.advanceEpochEnabled === true`, but §1.2's record spread and §1.3's
cursor spread were left keyed on the raw value:
`...(advanceEpoch ? { epoch: advanceEpoch } : {})`. On the exact path R4 was written to
close — an advance pauses LIT, the flag goes dark, `runResolveIntervalMajors` re-threads
`options.epoch || cursor.advanceEpoch || null`, and the resumed advance pauses again —
the stream is correctly legacy but **a flag-dark world SERIALIZES A NEW KEY on both the
pulse record and the re-parked cursor**, falsifying §1.2(c)'s "a dark or legacy world
serializes no new key" and §2.3b's proof step (4). CURE, in both places: key the spread on
the flag-gated `epochTerm`, never on `advanceEpoch`. Fence 1's value-present column and
fence 5 both gain a serialized-key-set assertion so the cure is proven rather than
asserted.

**⭐⭐ R11 — REFUTED, ARCHITECTURAL, AND THE ONE THE SEAL PASS CAUGHT (chair ruling T1,
revision 4): "Arm A's `byYear` map has a writer."** It did not. Revision 3 stated the
ledger's SHAPE (§1.2), its WRITER COUNT ("exactly ONE writer") and a BUDGET FILE
(`worldState.js ≤ 25 for the ledger writer`) — and named **no point in the advance at
which the stamp executes.** MEASURED at HEAD, both halves of that omission are worse than
a gap:

- **THE BUDGET FILE CANNOT HOST THE CALL.** `grep -rn "nextWorldStateForPulse" src`
  returns exactly TWO lines, BOTH in `pulseKernel.js` — the LOCAL, unexported definition
  `function nextWorldStateForPulse(worldState, campaign, interval)` (whose body is
  `calendar: advanceWorldCalendar(current.calendar, interval)`) and its one call inside
  `simulateCampaignWorldPulse`. **The advanced year is knowable only inside
  `pulseKernel.js`.** `ensureWorldState` (`worldState.js`) takes no epoch and no year and
  cannot stamp; §2.2's store snippet mints `advanceEpoch`/`epochTerm` and stamps nothing.
- **THE IN-PULSE READ WAS ONE STATE TOO EARLY.** MEASURED, the kernel binds
  `const startingWorldState = ensureWorldState(campaign?.worldState, campaign);` and then,
  two lines later, `let worldState = { ...nextWorldStateForPulse(startingWorldState, …) }`
  — the PRE-advance and POST-advance worlds. `const seasonClock = seasonsOn ?
  seasonForTick(worldState.calendar.elapsedWeeks) : null;` reads the **POST**-advance
  calendar, but revision 3's edit 7 spelled the accessor call
  `yearStreamSeedOf(startingWorldState, seasonClock.year, …)` — **the PRE-advance ledger
  for a POST-advance year.** On the tick that CROSSES a year boundary, which is the only
  tick at which a year is ever first entered, the pre-advance map cannot carry that year's
  key by construction, so the accessor returns the bare `rngSeed` and row 1's in-pulse
  severity is drawn EPOCH-FREE — while a later tick of the SAME LIVED YEAR would read the
  stamped key and draw differently, **repainting a lived year mid-year**, the exact
  trust-floor violation this directive exists to prevent.

**CURED IN §3b.1a**, which gives the stamp a measured home, a measured ordering proof
(after the calendar moves, before the earliest same-tick year read), a FIRST-WINS law, its
own enumerated seam edit (the ninth), and the `spatialLedgers` coverage-manifest row the
walker demands. Revision 3's `worldState.js ≤ 25` budget line is STRUCK.

**⭐ R12 — REFUTED, and nobody had raised it: "the year-keyed family shares one year
vocabulary."** It does not. MEASURED at HEAD, the nine family-2 compositions read year
numbers from **THREE derivations in TWO BASES**:

| Derivation | Symbol home | Value at `elapsedWeeks = 0..51` | Rows |
|---|---|---|---|
| `seasonForTick(weeks).year` = `Math.floor(weeks / 52) + 1` | `worldState.js#seasonForTick`, consumed as `clock.year` by `pulseKernel.js` (RS-2), `traditionsKernel.js` (RS-4/RS-6, which also hands it to `politics.js` and `relations.js`) and `roadsKernel.js` (RS-5) | **1** | 1, 3, 5, 6, 7, 8, 9 |
| `intelYearOf(weeks)` = `Math.floor(weeks / 52)` (`INTEL_TRADE_TUNING.WEEKS_PER_YEAR = 52`) | `spatial/intelActs.js#intelYearOf`, called by `generosityKernel.js` (RS-3) | **0** | 13 |
| `yearOf(weeks)` = `Math.floor(weeks / 52)` | `npcLadderContest.js#yearOf`, over `npcLadderKernel.js`'s `weeks` (itself `calendar.elapsedWeeks`) | **0** | 20 |

The three agree on WHICH LIVED YEAR they mean and disagree on its NAME by exactly one.
**A single `byYear` map read with the caller's own number would therefore serve rows
1/3/5/6/7/8/9 correctly and MISS on rows 13 and 20 in perfect silence** — returning the
bare root, exactly the dead-arm shape R11 describes, on two of the nine. **CURED by
J-EP-13:** the map is keyed on the CANONICAL 1-BASED calendar year, and the accessor takes
the caller's `yearBase` as a REQUIRED explicit argument in the same style §3b.3 already
requires for `absent` — no default, omitting it is a type error, and the census walker's
classification gate asserts every family-2 row declares one.

**⭐⭐ R13 — REFUTED, ARCHITECTURAL, AND IT IS R11's EXACT SHAPE ONE SLICE OVER (chair ruling
G1, revision 6): "EP-3 slice A's family-1 accessor can return an epoch-bearing seed."** It
could not, under EITHER arm. Revisions 2, 3, 4 and 5 all declared
`tickStreamSeedOf(worldState, { absent })` — at §3b.1a's leaf export table, at §3b.3's
accessor-pair rule, at §3b.3's THE RULE paragraph and at EP-3 slice A's charter — and gave it
no epoch anywhere:

- **THE SIGNATURE CARRIES NO EPOCH** at any of the four sites that state it, and unlike
  `yearStreamSeedOf` — whose body is spelled (`` `${rngSeed}${epochSuffix(byYear[String(year + (1 - yearBase))])}` ``)
  and whose source is a MEASURED ledger read — **`tickStreamSeedOf`'s body was spelled
  nowhere in the volume.**
- **IT COULD NOT READ THE LEDGER EITHER**, because §3b.1a stated in its own words that
  `yearStreamSeedOf` "is the SINGLE reader of the ledger … and nothing else reads `byYear`."
- **AND THE PENDING EPOCH HAS NO `worldState` HOME DURING THE TICK.** MEASURED at HEAD:
  `pulseRecord.epoch` is banked only at
  `const finalWorldState = appendPulseHistoryWithProvenance(memoryState, finalPulseRecord, applied);`
  — AFTER every stage — and `pausedAdvance.advanceEpoch` is written at the STORE layer
  (`buildPausedAdvanceCursor`) after the kernel returns. J-EP-12 STRUCK `current` on the
  explicit ground that the pending epoch is ARGS-BORNE.
- **NO THREADING ROUTE WAS DECLARED OR OPEN.** Every `advanceEpoch` mention in the volume
  reaches the kernel signature, the root composition, the record spread, the M2 cursor and the
  M3 stamp guard — and no stage. MEASURED, the family-1 hosts sit behind intermediate mounts
  (`roadsKernel.js` and `npcLadderKernel.js` through
  `assizeKernel.js#advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize`;
  `demographicsKernel.js`, `demographicsPlans.js` and `sovereigntyMarketStage.js` through
  `settlementLifecycleKernel.js#advanceSettlementLifecycle`; `realmVerbExecution.js` through
  `applyWorldPulse.js#applyWorldPulseOutcomes`) while §3b.1 freezes the kernel at an exact
  enumerated edit list and states "`applyWorldPulse.js` is untouched."

CONSEQUENCE, had it shipped as chartered: each of RS-5, RS-9, RS-10, RS-11, RS-12, RS-13,
RS-14 and RS-15 re-roots to an accessor that can only return its own `absent`-coerced
`rngSeed`, so **all FOURTEEN tick-varying compositions plus the tick-free row 16 compose
today's key** — and every instrument slice A specifies stays GREEN, because the dormancy suite
asserts today's strings, fence 1 runs dark, and the census walker's classification gate is
satisfied by the mere fact that a TICK-VARYING row calls `tickStreamSeedOf`. A DM who undid and
re-advanced would get a "fresh future" in which `npcLadderContest.js#tieBreak` resolves every
succession identically and `demographicsResponses.js#selectResponse` makes every city choose
identically — the precise consequence §0.3 R1/R7 exist to name, reintroduced by the wave
chartered to remove it. **CURED IN §3b.1b**, which gives the accessor a MEASURED source (the
per-tick `latest` stamp), a spelled body, an ordering proof, a selection rule, a reach census
including two doors outside the pulse, and an executed two-epoch pin. **AND THE LESSON IS
R11's, restated: a declared accessor with no named source is not a design, exactly as a
declared writer with no call site is not a design — the volume proved it once and then did the
same thing one slice over.**

**⚠ THE REFUTATION COUNT ITSELF.** Revision 2's header said "NINE premises were REFUTED"
over EIGHT labelled rows (R1–R8) — a count slip of the same family revision 3 corrected
elsewhere. **The exact, re-countable figure is now THIRTEEN labelled refutations, R1–R13**,
and every summary sentence in this volume now says THIRTEEN.

---

## §1 THE CANONICAL MODEL — one nonce, one recorded field, zero new top-level keys

### 1.1 The nonce

**Shape:** a `generateSeed()`-class string. MEASURED at `src/kernel/prng.js`:
`` return Date.now().toString(36) + seedSuffix(); ``, where `seedSuffix()` draws
`SEED_SUFFIX_LEN = 6` chars from `SEED_ALPHABET` via WebCrypto `getRandomValues` with
rejection above `SEED_BYTE_CEILING = 252`, falling back to `Math.random` only where no
crypto is exposed. A plain JS string: `structuredClone`-safe across the worker boundary,
JSON-round-trip safe, `cloneJson`-safe. **NEVER a Symbol, BigInt, object or Date** —
three of the FOURTEEN lifecycle paths in §8.4 would silently drop it.

**Mint site:** `src/store/campaignAdvanceSession.js#runAdvanceCampaignWorld`, beside the
existing `const now = options.now || new Date().toISOString();` — the exact structural
precedent: one value, minted ONCE per user advance at the store layer, threaded into the
kernel args, stamped into the record, parked on the pause cursor.

**Names in code:** `advanceEpoch` (the threaded argument and the cursor field), `epoch`
(the recorded field). Two spellings deliberately: the argument names what it does to a
stream, the field names which epoch an entry belongs to. Both pinned at §8.

### 1.2 Where it lives — the recorded field

**Home:** `campaign.worldState.pulseHistory[].epoch`, a TOP-LEVEL SCALAR materialized
conditionally, beside `createdAt`:

```js
// FOLDED ONTO pulseKernel.js's existing `createdAt: now,` line inside the `pulseRecord`
// object literal — one token-level edit on one existing line, ZERO new lines (§3b.1 #6):
createdAt: now, ...(epochTerm ? { epoch: epochTerm } : {}),
```

⚠ **THE SPREAD KEYS ON `epochTerm`, THE FLAG-GATED VALUE — NEVER ON `advanceEpoch`
(§0.3 R10).** Revision 2 spelled it `advanceEpoch`, which is value-driven and therefore
FALSIFIES claim (c) below on the one path §2.3b exists to close: an advance pauses LIT,
the flag goes dark, the resume re-threads `cursor.advanceEpoch`, and a flag-dark world
serializes a brand-new key on the record. `epochTerm` is `null` whenever the flag is
absent, by construction, so the dark record is byte-identical on every path. Fence 1's
value-present column and fence 5 both assert the SERIALIZED KEY SET, not just the stream
string, so this is proven rather than argued.

Four measured reasons this is the only correct home. **(a)** It is the one per-advance
durable row that exists — there is no separate action log (`chronicles[]` is AI/DM
prose, `wizardNews` is per-OUTCOME), and `pulseHistory` is written at exactly ONE seam,
`appendPulseHistoryWithProvenance(memoryState, finalPulseRecord, applied)` →
`worldState.js#appendPulseHistory`. **(b)** It survives the load normalizer with no
teach: `ensureWorldState` does
`pulseHistory: cloneArray(raw?.pulseHistory).slice(-MAX_HISTORY)` and `cloneArray` is
`value.map((item) => ({ ...item }))` — a shallow per-record spread, NOT an allowlist (a
NESTED object would be shared by reference; hence a scalar). **(c)** It is byte-neutral
dark: the conditional spread means a dark or legacy world serializes no new key, so
`normalizeForDormancy` sees an absent key as its default (§2.3). **(d)** It rides every
downstream spread free — MEASURED, the record is re-spread four times before it is
banked (`envoyPulseRecord` → `coalitionReturnRecord` → `coalitionPulseRecord` →
`finalPulseRecord`), each a `{ ...prev, … }`.

**⛔ NOT a top-level worldState key and NOT a `CONDITIONAL_LEDGER_KEYS` member in EP-1.**
MEASURED: that array's own header says its ORDER IS THE SERIALIZED KEY ORDER and the
dormancy oracle and byte-identity goldens pin serialized bytes — append only. EP-1 needs
no worldState key at all. EP-3 (Q1's Arm A) needs one and takes
`spatialLedgers.advanceEpoch` — the L4-sanctioned conditional sub-key with exactly one
writer, which is not a `CONDITIONAL_LEDGER_KEYS` member either.

### 1.3 The second home — the paused-advance cursor

`worldState.pausedAdvance.advanceEpoch`, conditionally materialized:

```js
// in buildPausedAdvanceCursor, beside `startedAt: now, now,`
...(epochTerm ? { advanceEpoch: epochTerm } : {}),
```

⚠ **SAME FLAG-KEYING, SAME REASON (§0.3 R10).** `buildPausedAdvanceCursor` runs at the
STORE layer, where the mint is already gated — but the RESUME path re-threads
`options.epoch || cursor.advanceEpoch || null`, so a LIT-paused advance resumed dark and
paused AGAIN would re-park a live epoch into a flag-dark world's persisted cursor. The
store layer therefore computes its own `epochTerm` beside the mint (§2.2's code) and
parks THAT.

MEASURED: `buildPausedAdvanceCursor` already parks `now` twice and
`runResolveIntervalMajors` already re-threads it —
`const now = options.now || cursor.now || new Date().toISOString();` — with the in-source
rationale "replay with the advance's ORIGINAL now (parked on the cursor), NOT a fresh
wall-clock." The epoch takes the identical treatment and the identical three-term
fallback. **This is the single highest-risk integration point:** the cursor is
PERSISTED, so a paused interval resumed after a reload without its epoch finishes as a
different world than the half already committed — a silent mid-interval divergence, not
a crash. §8.4 pins it.

### 1.4 Drop-when-absent; the THREE-state back-compat rule

Three states exist in the wild and only two are usually discussed: **(a)** a legacy
record with no `epoch` key; **(b)** a record written by the shipped code in a
flag-absent world, also with no key; **(c)** a nonce-bearing record. (a) and (b) MUST
compose the identical stream string or every existing save's next advance shifts.
Therefore the reader rule is **"absent ⇒ the term is not concatenated at all"** and
NEVER "absent ⇒ epoch 0": rendering an `::epoch:0` segment breaks (a). The directive's
"replay as epoch-0" is honoured by meaning epoch-ZERO-LENGTH; the code spells it as the
empty string, and §2.3 makes that structural rather than a convention.

### 1.5 The grain: ONE epoch per USER ADVANCE, never per tick

MEASURED, and architecture-deciding: `advanceInterval.js#collapseIntervalHistory` does
`const removed = intervalRecords.slice(0, -1);` — a multi-tick interval collapses to ONE
record. A `one_year` advance runs 52 kernel ticks and leaves one row, so a per-TICK
nonce would have 51 of 52 destroyed at commit and replay would be impossible. The
per-tick stream identity is DERIVED, not stored: the epoch is one segment appended to a
string that already carries `::tick:${tick + 1}`, so one recorded epoch reproduces all
52 ticks exactly. Collapse is lossless by construction and needs no edit.

⚠ **THE GRAIN RULING HAS A CONSEQUENCE THAT LOOKS LIKE A LEAK AND IS NOT — see §3b.1a's
DECLARED NON-INVARIANT (chair ruling F8, PREMISE RESPELLED BY G2 in revision 6).** MEASURED
at HEAD, `collapseIntervalHistory` returns
`reconcileProvenanceAfterHistoryCollapse({ ...worldState, pulseHistory: composed }, removed)`:
**it composes the world by SPREAD rather than by allowlist reconstruction, so `spatialLedgers`
— and with it `advanceEpoch`, every `byYear` row and the `latest` stamp — is CARRIED THROUGH
the collapse**, and the one `spatialLedgers` write on that path is the reconcile's PROVENANCE
prune, which touches only the `provenance` sub-key and preserves every sibling. ⚠ **Revision
5 said here that the function "returns `{ ...worldState, pulseHistory: composed }`" and reads
or writes `spatialLedgers` "nowhere" — both clauses were falsifiable in one grep and are
struck; the ruling they carried is unchanged.** Arm A's `byYear` stamp is written per TICK, so
a one-year advance crossing TWO calendar-year boundaries leaves TWO ledger rows behind ONE
pulse record. **Both years were lived, both were entered by the same advance, and both
therefore carry the same epoch.** The counts are DECLARED free to differ; a pin says so, and
§3b.1a carries the full statement with the exact symbols.

---

## §2 THE FLAG — `advanceEpochEnabled`

### 2.1 The name

**RECOMMENDED: `advanceEpochEnabled`** (chair question Q4). MEASURED: zero hits in
`src`/`tests` for `advanceEpochEnabled|epochEnabled|advanceEpoch|epochSuffix|
livingFutures`. It names the MECHANISM, reads correctly in the strict idiom, and sits
beside the estate's advance vocabulary. `livingFuturesEnabled` names the marketing claim
and is rejected for the reason `magicFunctionsAt` was: a flag named after the claim
invites a sweep to conflate the gate with the copy. ⚠ ONE LIVE NEIGHBOUR:
`advanceMultiTick` is a REAL default-ON flag (`src/lib/flagRegistry.js` —
`advanceMultiTick: true`, a promoted soak killswitch) which this program does not touch
but which already forks the pulse stream identity (§2.4).

### 2.2 L2 shape (FP §3, CR-WR10-C — verbatim discipline)

VIRTUAL: absent from `DEFAULT_SIMULATION_RULES` and every preset spread; strict
`=== true`, dark-never-permissive; at least one BY-NAME read. Joins
`ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js`) **in ALPHABETICAL position** —
the array is sorted and `advanceEpochEnabled` sorts FIRST, before `beliefAxesEnabled` —
plus its certification row plus its first real gate read, in ONE COMMIT (EP-1).
`tests/lint/engineGatedRuleKeys.walker.test.js` asserts the exact one-key delta.

⚠ **THE FROZEN-EIGHT TRAP.** MEASURED: `tests/domain/subsystemRowsVirtual.test.js`
hard-codes `const VIRTUAL_RULES = Object.freeze([AXES, CONQUEST, STATECRAFT, RUMORS,
OATH, SOVEREIGNTY, LIFECYCLE_VOICE, CASUS]);` and asserts three exact bijections plus
`expect(VIRTUAL_PENDING_RULE_KEYS).toEqual([])`. A ninth VIRTUAL-lane member forces an
edit to that file — the red that bit TR-1 ("one-line remedy REFUTED"). **J-EP-1: EP
mints its own lane `subsystemRowsEpoch.js`**, which FP §3 permits in terms ("the
totality walker asserts the PARTITION, not the address").

**THE GATE-READ SPELLING IS LOAD-BEARING.** MEASURED: the walker anchors on
`` /\b(?:rules|simulationRules)\s*\)?\s*\??\.\s*([A-Za-z_$][\w$]*)\s*===\s*true/g `` over
ALL of `src` (so a `src/store` read counts). The receiver must be literally named `rules`
or `simulationRules`:

```js
// src/store/campaignAdvanceSession.js — the FIRST by-name read
const simulationRules = campaign?.worldState?.simulationRules || null;
const epochLit = simulationRules?.advanceEpochEnabled === true;
const advanceEpoch = epochLit ? (options.epoch || generateSeed()) : null;
// The store's own `epochTerm`: the value that may be PARKED on the persisted cursor.
// On the RESUME path the mint does not run and the cursor supplies the value, so the
// flag must gate the PARK as well as the MINT (§0.3 R10) — otherwise a lit-paused
// advance resumed dark re-parks a live epoch into a flag-dark world.
const epochTerm = epochLit ? (advanceEpoch || options.epoch || cursor?.advanceEpoch || null) : null;
```

A read spelled `cfg.advanceEpochEnabled === true` is invisible to the census and makes
the manifest lie; fence 4 carries a positive control proving this spelling is seen.

**Degraded arms:** none. This flag has no upstream conjunction — it gates a string
segment, not a subject. The one ordering constraint is EP-3's: the side-channel
disposition may not light before EP-1, because a year-anchor map written against a root
that carries no epoch is a map of one value.

### 2.3 ⭐ THE DARK-STATE BYTE-IDENTITY CONTRACT

TR-1 earned byte identity by keeping draw COUNTS equal while a value moved. **The epoch
seam is a harder claim: it changes the stream IDENTITY STRING.** This program earns dark
identity BY CONSTRUCTION, not by parity argument.

**DARK (verbatim at HEAD; the exact string a dark world must still produce):**

```js
const rng = createPRNG(`${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}`);
```

**LIT (the one changed line):**

```js
const rng = createPRNG(`${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}${epochSuffix(advanceEpoch)}`);
```

**THE ONE NEW PURE FUNCTION**, minted in `src/kernel/prng.js` beside `fork`'s delimiter
docblock (J-EP-2 for why that home):

```js
/** The advance-epoch stream segment. THE ABSENT CASE RETURNS THE EMPTY STRING, never a
 *  rendered `epoch:0` — `x + '' === x`, so a flag-absent or legacy world composes the
 *  pre-wave seed CHARACTER-FOR-CHARACTER and every existing stream is untouched. This
 *  is a NEW SEGMENT in a root composition; it is NOT a change to `fork`'s derivation,
 *  which stays owner-gated under THE PROMISE.
 *  @param {string|null|undefined} advanceEpoch @returns {string} */
export function epochSuffix(advanceEpoch) {
  return advanceEpoch ? `::epoch:${String(advanceEpoch)}` : '';
}
```

### ⭐⭐ 2.3b THE CONTRACT IS FLAG-DRIVEN, NOT VALUE-DRIVEN (chair ruling R4)

Revision 1 gated only the MINT and let the KERNEL apply `epochSuffix` unconditionally on
whatever value arrived. That earns dark identity for the *value-null* cell only, and
MEASURED there is a live path to the *flag-dark / value-present* cell:
`worldState.pausedAdvance` **IS PERSISTED** (`CONDITIONAL_LEDGER_KEYS` in `worldState.js`
lists `pausedAdvance` verbatim, in the array whose own header says the order IS the
serialized key order), and §3c row 4 re-threads the resume as
`options.epoch || cursor.advanceEpoch || null` — modelled on `now`'s three-term fallback
(`campaignAdvanceSession.js#runResolveIntervalMajors`:
`const now = options.now || cursor.now || new Date().toISOString();`), which re-reads no
flag. Sequence: an advance pauses while LIT → the DM (or an `advanceMultiTick`-class
killswitch flip) turns the rule OFF → the resume composes an epoch-bearing seed in a
flag-dark world. **BELT AND BRACES, both required:**

1. **THE MINT IS GATED** so the value cannot come into existence dark (§2.2's code; the
   flag read is the store layer's, and it is the census-visible spelling).
2. **THE KERNEL READS THE FLAG BESIDE THE VALUE.** MEASURED: `simulationRules` is ALREADY
   in scope inside `simulateCampaignWorldPulse` and already read by-name for other gates
   (`simulationRules.warLayerEnabled` at the deployment read), so this costs no new
   threading and no new line:

```js
const epochTerm = simulationRules?.advanceEpochEnabled === true ? advanceEpoch : null;
const rng = createPRNG(`${startingWorldState.rngSeed}::tick:${startingWorldState.tick + 1}::${tickInterval}${epochSuffix(epochTerm)}`);
```

⚠ **THE LINE BUDGET, AND THE FOLD TARGET — MEASURED IN REVISION 3 (chair ruling P2).**
That is a SECOND statement, `pulseKernel.js` is banked at tolerance zero, and revision 2
named a fold target that IS OUT OF SCOPE: it said both statements fold onto "the EXISTING
guard line beside `assertNowPinnedInTest`", but MEASURED at HEAD that guard is

```js
if (now == null) { assertNowPinnedInTest('simulateCampaignWorldPulse'); now = wallClockNow(); }
```

and NEITHER `simulationRules` NOR `startingWorldState` exists yet at that point — both
are created sixty-odd lines later. **THE IN-SCOPE FOLD TARGET, quoted verbatim at HEAD,
is the line that CREATES the second receiver:**

```js
const simulationRules = normalizeSimulationRules(startingWorldState.simulationRules);
```

It is the first line in the function at which BOTH names are bound (`startingWorldState`
is bound by the immediately preceding `const startingWorldState = ensureWorldState(…)`,
and `simulationRules` is bound by this line's own initializer, which completes before any
`;`-joined statement after it runs). Both new statements — the `epochTerm` derivation and
§3a's `assertEpochPinnedInTest` guard — fold onto THAT line, `;`-joined, in the style the
`now` guard already uses. MEASURED: `eslint.config.js` carries no `max-statements-per-line`
and no `max-len` rule, so the fold is lint-legal; `sizeBaseline` counts effective lines,
so three statements on one existing line is +0. **VERIFY-AT-BUILD** — measure with the
enforcer AT the publishing commit and, if the effective count moves, **STOP and report for
a chair-signed one-line ratchet-up rather than restructuring the kernel or dropping the
gate.** The gate is not optional: dropping it returns the contract to value-driven.
**J-EP-9 records this as a deliberate second read.** The alternative the chair declined —
"a cursor epoch outlives a flag flip, deliberately" — is coherent but would have to be
RULED and PINNED, and it makes the directive's dark clause a convention rather than a
construction.

**THE GATE-POLARITY FENCE COVERS THE EXACT NAMED PATH** (§2.5 fence 5): compose an
advance LIT, pause it mid-interval, serialize and reload the world, flip
`advanceEpochEnabled` to absent, resume — and assert the resumed composition is the
LITERAL legacy string, byte-for-byte, with the cursor's `advanceEpoch` still present in
the persisted state. Its executed mutant removes the kernel's flag read and the fence
must RED.

**Why dark is byte-identical, as a proof:** (0) the flag gate above makes the epoch term
structurally unreachable dark, on every path including the persisted-cursor resume.
(1) `epochSuffix(null) === ''` and
`` `${x}${''}` === x `` — identity of empty-string concatenation, not a branch that
happens to agree; there is no template slot that could render an empty segment
(`…::one_week::` and `…::one_week` are different seeds, which is why the shape is
CONCATENATION and not a fourth template term). (2) **Draw counts are identical in BOTH
flag states**: the seam moves the seed VALUE only, never a control-flow branch, so the
number and order of `rng.random()` / `rng.fork()` calls is unchanged — a lit world draws
the same COUNT from a different stream. (3) `pulseKernel.js` gains ZERO new lines **in
EP-1** (§3b.1's six enumerated token edits), so the tolerance-zero ratchet does not move
in either direction there; ⭐ **EP-3 SLICE A budgets ONE new import line on that file as a
PLANNED, chair-signed ratchet-up (J-EP-11) — declared, never discovered** (revision 6 moved it
off slice B with the writer, chair ruling G1; slice B's own kernel edits are +0).** (4) No new key
is serialized dark, because **ALL THREE flag-driven materializations** key on the
flag-gated `epochTerm` (§1.2, §1.3, §3b.1a, §0.3 R10) and not on the raw value — the cell
revision 2 left open, widened in revision 4 by the third materialization R11 added.

### ⭐⭐ 2.3c THE INVARIANT CHAIN, NAMED (chair ruling T2, revision 4)

Revision 3 proved dark identity in prose spread across four sections and keyed two of the
three materializations on `epochTerm` — the third, EP-3 slice B's `byYear` stamp, did not
exist yet (§0.3 R11). **The contract is now ONE named chain, and every EP fence asserts a
link of it BY NAME rather than asserting "dark is identical" as a mood:**

> **THE EPOCH INVARIANT CHAIN (binding; cited by link number in every EP pin).**
>
> **(L1) DARK ⇒ `epochTerm` IS `null`.** Two independent gates make it so and both are
> required: the STORE mint is gated (`epochLit ? … : null`, §2.2) so no value is created
> dark, and the KERNEL re-reads the flag beside the value
> (`simulationRules?.advanceEpochEnabled === true ? advanceEpoch : null`, §3b.1 edit 4,
> J-EP-9) so no value that outlived a flag flip on the persisted cursor can be used.
>
> **(L2) `epochTerm === null` ⇒ EVERY FLAG-DRIVEN MATERIALIZATION VANISHES.** There are
> exactly THREE and the census is CLOSED — an implementer who adds a fourth without
> extending this list is in breach of the contract:
>
> | # | Site | Spelling | Absent ⇒ |
> |---|---|---|---|
> | **M1** | `pulseKernel.js` `pulseRecord` literal (§1.2) | `...(epochTerm ? { epoch: epochTerm } : {}),` | no `epoch` key on the record |
> | **M2** | `campaignAdvanceSession.js#buildPausedAdvanceCursor` (§1.3) | `...(epochTerm ? { advanceEpoch: epochTerm } : {}),` | no `advanceEpoch` key on the persisted cursor |
> | ⭐ **M3** | `pulseKernel.js` — THE STAMP (§3b.1a, ⭐ **EP-3 SLICE A** from revision 6: its `latest` half either arm, its `byYear` half in slice B) | `epochTerm ? stampAdvanceEpochYear(worldState, epochTerm) : worldState` — the guard is on the CALL, so `setSpatialLedger` never runs | no `advanceEpoch` sub-key, and on a world carrying no other ledger **no `spatialLedgers` namespace at all** |
>
> **(L3) THE MATERIALIZATIONS VANISHING ⇒ THE SERIALIZED KEY SET IS UNCHANGED** at all
> three homes — the pulse record, the paused cursor, and `spatialLedgers`. This is the
> link a stream-only fence cannot see, and it is what fence 1's value-present column and
> fence 5's serialization mutants exist to assert.
>
> **(L4) `epochSuffix(null) === ''` AND `` `${x}${''}` === x `` ⇒ THE STREAM IDENTITY
> STRING IS CHARACTER-FOR-CHARACTER TODAY'S**, per advance path (§2.4), including the
> paused-resume path.
>
> **(L5) L3 ∧ L4 ⇒ BYTE-IDENTICAL.** Reached by construction at every link, never by a
> parity argument.

⚠ **M3 IS THE LINK WITH THE SHARPEST FAILURE MODE, AND IT IS NOT THE STREAM.** A stamp
guarded on the raw `advanceEpoch` rather than on `epochTerm` leaves L4 perfectly intact —
the seed string stays dark-identical and every stream pin stays green — while
`setSpatialLedger` MINTS A `spatialLedgers` NAMESPACE ON A WORLD THAT HAD NONE. MEASURED:
`spatialLedgers` is a `CONDITIONAL_LEDGER_KEYS` member (`worldState.js`, in the array whose
own header says the order IS the serialized key order), and `setSpatialLedger` is
`{ ...worldState, spatialLedgers: { ...(ns || {}), [key]: value } }` — it CREATES the
namespace when absent. That is a new serialized top-level key on an aspatial save: a
dormancy-golden break arriving through the one door a stream fence does not watch.
**Fence 5's serialization mutant therefore re-keys ALL THREE materializations, one at a
time, and each must RED on its own** (§2.5) — three mutants, not one.

**THE PIN IS ON THE RENDERED STRING, NOT THE PIECES** (the analytic-pin mirror rule).
EP-0 lands `tests/kernel/advanceEpochStreamIdentity.test.js` asserting the composed seed
for a fixed `(rngSeed, tick, interval)` triple equals the LITERAL
`'world-pulse:c1::tick:6::one_month'` with the epoch absent and
`'world-pulse:c1::tick:6::one_month::epoch:abc123'` with it present — hard-coded
expectations, never a recomputation from the same tokens.

**⚠ THE `::` ALIASING TRAP.** MEASURED: `prng.js#fork` is
`` fork: (label) => createPRNG(`${seed}::${label}`) `` with the docblock rule that
`fork('a::b')` and `fork('a').fork('b')` are ONE stream, silently correlated, and that
"one label family, one spelling" binds every caller;
`tests/kernel/prngForkLabelDelimiter.test.js` freezes the delimiter-embedding families
(fidelityNoise, deityStanceLane, religiousContest). The word `epoch` has ZERO existing
fork-label uses; EP-0 extends that test with an `epoch`-family row. Note also that
`realmVerbExecution.js` uses a SINGLE-colon idiom — a third family, handled at EP-3.

### 2.4 ⚠ THE FENCE OBLIGATION `advanceMultiTick` IMPOSES

MEASURED: `simulateCampaignWorldInterval` builds every composed tick with the LITERAL
`interval: 'one_week'`, so a year advance composes `…::tick:1::one_week` …
`…::tick:52::one_week`, while the flag-OFF single-tick path passes the DM's interval and
composes `…::tick:N::one_month`. **`advanceMultiTick` therefore ALREADY forks the pulse
stream identity, and it is default-ON.** Any dark-state fence that does not FIX its
state compares two different streams and greenwashes. Every EP fence pins it; the
gate-polarity fence carries an anchored assertion that it did.

**⭐ THE FENCE SPEC FIXES ITS OWN STANCE (anomaly A8, chair-ruled).** EP's dark-state
byte-identity claim is defined **PER PATH**, never as one global sentence:

> **DARK-STATE BYTE IDENTITY (EP definition, binding on every EP fence).** For each
> advance path INDEPENDENTLY — (a) the single-tick path (`advanceMultiTick` absent or
> false; the DM's own interval term), (b) the multi-tick composed path
> (`advanceMultiTick: true`; the LITERAL `interval: 'one_week'` per composed tick), and
> (c) the paused-resume path (`runResolveIntervalMajors` re-deriving from the cursor) —
> a flag-dark world composes the SAME stream identity string that path composes TODAY,
> character for character. **The claim is never made ACROSS paths**, because
> `advanceMultiTick` already forks the interval term and always has.

Every EP fence therefore declares its path fixture explicitly and asserts the literal
string that path produces; a fence that leaves `advanceMultiTick` unpinned fails fence
4's anchored arm. EP absorbs, normalizes and hides nothing about that pre-existing fork
(J-EP-7).

### 2.5 The FIVE-fence dormancy set + the lit-mutant control (fence 5 added by R4)

Modelled on `tests/property/casusCommerciiDormancyFence.test.js` (the richest of the
four, landed d7ea69a4).

- **Fence 1 — OWN-FOOTPRINT, over FOUR configs and BOTH value states (widened by R4).**
  Drive `simulateCampaignWorldPulse` over an ADVERSARIAL fixture (one that really
  produces when lit) under `rules ∈ {undefined, {}, {advanceEpochEnabled:false}}` and
  assert the result `toEqual` its deep-cloned input projection — plus the epoch-specific
  arm: the COMPOSED SEED STRING itself, captured through a `createPRNG` spy, equals the
  literal legacy spelling. **⚠ THE CELL REVISION 1 MISSED: each of those three configs
  runs TWICE — once with no `advanceEpoch` argument, and once with a REAL epoch value
  passed** (the flag-dark/value-present cell the persisted cursor can reach). All six
  runs must produce the identical literal string. Without the second column this fence
  proves only what the value already made true, and the flag gate of §2.3b is untested.
  ⭐ **AND THE VALUE-PRESENT COLUMN ASSERTS THE SERIALIZED KEY SET, NOT ONLY THE STREAM —
  AT ALL THREE MATERIALIZATION HOMES (chair-ruled from §0.3 R10, WIDENED TO M3 BY T2):**
  `Object.keys(pulseRecord)` (M1), `Object.keys(worldState.pausedAdvance || {})` (M2) **and
  `Object.keys(worldState)` PLUS `Object.keys(worldState.spatialLedgers || {})` (M3)** must
  each be IDENTICAL to the value-absent column's — and the M3 arm runs over an **ASPATIAL
  fixture carrying NO other spatial ledger**, so `spatialLedgers` is absent in the
  value-absent column and its mere APPEARANCE fails, which a fixture that already carries
  a ledger could never detect. This is the arm that catches a materialization keyed on
  `advanceEpoch` instead of `epochTerm` — a defect that leaves the stream perfectly dark
  (chain link L4 intact) while writing a brand-new key into a flag-dark world's persisted
  state (L3 broken), which a stream-only fence cannot see. **The fence cites L3 by name.**
- **Fence 2 — DIFFERENTIAL, absent vs explicit false**, whole projection, no fixture so
  it cannot rot. Its blind spot is stated in-file (it stays green if the feature ran in
  BOTH configurations) — which is exactly what fence 1's literal-string arm catches.
- **Fence 3 — CALL-PATH.** A `vi.mock` STRICT PASS-THROUGH spy on `epochSuffix` at its
  `src/kernel/prng.js` home, counting real invocations. ⚠ THE SPY SITS OUTSIDE
  `pulseKernel.js`, AND THAT IS LOAD-BEARING — the recorded WR-10 lesson is that
  wrapping a function in its OWN module's namespace counts ZERO when the caller invokes
  it intra-module. Caller and callee are different modules here by construction, a
  second reason for J-EP-2's home choice.
- **Fence 4 — GATE-POLARITY CENSUS** over the real `src` tree: every production read is
  the strict `=== true` form, reusing `codeOnly` imported from
  `tests/lint/engineGatedRuleKeys.walker.test.js` (never a second blanker regex); a
  NON-VACUITY floor (`expect(reads).toBeGreaterThanOrEqual(2)` — the store mint and the
  kernel guard); a VIRTUALITY sub-test (absent from `DEFAULT_SIMULATION_RULES` and from
  every preset in the `SIMULATION_RULE_PRESETS` RECORD — a record, not an array); a
  manifest-membership assertion; and §2.4's `advanceMultiTick`-pinned arm.
- ⚠ **THE PURITY ARM INVERTS (J-EP-3).** Every existing fence 4 asserts its module
  family contains no `Math.random` / `Date.now` / `new Date`. This program's mint site
  EXISTS to call `generateSeed()`, built from both. The EP arm is a **CONFINEMENT proof,
  not an absence proof**: exactly ONE entropy call site in the family, in `src/store`
  (never `src/domain`, where eslint already forbids it — the fence is a second lock),
  the DOMAIN half provably pure, and the entropy reached through `generateSeed` and not
  a hand-rolled `Math.random` (which is how §3e H4's second door escaped this long).
  Anchored, with a planted positive control.
- **Fence 5 — THE GATE-POLARITY / FLAG-FLIP FENCE (NEW, chair ruling R4).** The exact
  path the cohesion pass named, driven end to end: compose an advance LIT so it PAUSES
  mid-interval (the cursor is written with its `advanceEpoch`); JSON round-trip the whole
  campaign through the real serialization; assert `pausedAdvance.advanceEpoch` survived
  (it must — the field is deliberately persisted); flip `advanceEpochEnabled` to ABSENT;
  resume via `runResolveIntervalMajors`; assert the composed stream identity is the
  LITERAL legacy string for the paused-resume path (§2.4's per-path definition, stance
  fixed); ⭐ **and assert THE WHOLE OF CHAIN LINK L3 ON THAT EXACT PATH (chair ruling T2):
  the resumed advance's `pulseRecord` carries NO `epoch` key (M1), its re-parked cursor —
  if it pauses again — carries NO `advanceEpoch` key (M2), and the resumed world's
  `spatialLedgers` is EXACTLY what it was before the resume (M3).**
  ⚠⚠ **THE M3 EXPECTATION IS RESPELLED IN REVISION 5 (chair ruling F2) — THE REVISION-4
  GLOSS WOULD HAVE RED A CORRECT BUILD ON DAY ONE.** Revision 4 wrote "EXACTLY what it was
  before the resume, **which on the fence's aspatial fixture means ABSENT ENTIRELY**." The
  first clause is correct and sufficient; the gloss is falsified by this fence's OWN step 1.
  MEASURED at HEAD, a pause happens AFTER a committed tick, not before one:
  `advanceInterval.js`'s pause boundary reads verbatim *"PAUSE BOUNDARY (autoresolve OFF):
  this tick committed its minors and surfaced majors. STOP at the tick boundary — after the
  minor-commit, before tick i+1's compute,"* the paused return spreads `...tickResult` (the
  POST-tick world; `preWorldState` is only the resume's re-derivation input), and the store
  says so in its own words — *"a paused interval committed its minors
  (applyWorldPulseResultToState wrote the minors-only pause-tick worldState)."* Since seam
  edit 9 stamps on EVERY committed lit tick, **a LIT advance that paused has necessarily
  already written `spatialLedgers.advanceEpoch.byYear` for every year its committed prefix
  entered.** ⛔ **A FENCE THAT REDS ON A CORRECT IMPLEMENTATION IS A DEFECT**, and the
  natural repair under build pressure — weakening the arm, or demoting it to §4's aspatial
  dormancy suite — would delete the estate's only detector for mutant (d), *"the one that
  stays invisible to every stream assertion in the estate."*
  > **THE CORRECT M3 SHAPE, BOTH DIRECTIONS (⭐ WIDENED TO `latest` IN REVISION 6, chair ruling
  > G1 — the ledger now carries TWO sub-keys and an arm that watches only one is half a fence).**
  > Capture `worldState.spatialLedgers` after the
  > lit pause and again after the dark resume, and assert: **(i)** the ledger EXISTS after
  > the lit pause, carries a `byYear` key for EXACTLY the years the committed prefix
  > entered, each valued at the lit advance's `epochTerm` — **none beyond** (the lit
  > anti-vacuity half: an arm that only checks "unchanged" passes on a stamp that never ran) —
  > ⭐ **AND carries `latest` equal to `{ tick: <the last committed tick of the lit prefix>, epoch: <that advance's epochTerm> }`**;
  > **(ii)** the dark resume adds NO new `byYear` key, mutates NO existing one, ⭐ **leaves
  > `latest` BIT-FOR-BIT AS CAPTURED — tick and epoch both**, and mints
  > no OTHER `spatialLedgers` sub-key — deep-equal to the captured value, by
  > `normalizeForDormancy`. **(i) proves the writer really ran lit; (ii) is chain link L3 on
  > the flag-flip path**, and the two together are what the "EXACTLY what it was" clause
  > always meant. ⭐⭐ **AND ONE FURTHER ASSERTION REVISION 6 ADDS, WHICH IS THE ONLY ESTATE
  > DETECTOR FOR §3b.1b's MUTANT (i): the dark resume's own family-1 draw keys are the LITERAL
  > legacy strings.** MEASURED, this is exactly the cell the CURRENT-TICK SELECTION RULE exists
  > for — the resumed world carries a LIT `latest` while the flag is DARK, and the rule saves
  > it only because the resumed tick number differs from the stamped one. An accessor built
  > without the tick check passes every other fence in the estate and fails only here.
  ⚠ **THREE FIXTURE CONSTRAINTS, NOT TWO** — revision 4 enumerated two and both remain
  load-bearing: **(1) ASPATIAL** (a fixture already carrying a spatial ledger cannot see a
  namespace being minted); **(2) THE ADVANCE MUST CROSS A YEAR BOUNDARY** — ⚠ **the REASON is
  narrowed in revision 6 (chair ruling G1) and the constraint is unchanged:** revision 5 said a
  same-year resume "never reaches the stamp," which is FALSE once `latest` exists (every lit
  tick writes it). What is true, and is what the constraint was always buying: **only a
  year-crossing advance can produce a `byYear` mutation for direction (ii) to catch, so a
  same-year fixture hides mutant (d)'s `byYear` half**; ⭐ **(3) THE LIT PREFIX IS EXPECTED TO
  HAVE STAMPED — the fence's own baseline is a NON-EMPTY ledger, not an absent one.**
  Constraint 3 is the one revision 4 left unstated, and it is the one the gloss contradicted.
  **FOUR executed mutants, each must
  RED on its own:** (a) delete the kernel's flag read (§2.3b step 2) — the stream mutant,
  breaking L1; (b) re-key M1 from `epochTerm` to `advanceEpoch`; (c) re-key M2 likewise;
  (d) re-key **M3's stamp guard** likewise — three separate serialization mutants breaking
  L3, of which (b) is the exact spelling revision 2 shipped and (d) is the one that stays
  invisible to every stream assertion in the estate. ⭐ Under the respelled arm, mutant (d)
  is caught by direction **(ii)**: the dark resume's stamp mints a `byYear` key for the year
  the resumed tick enters, which the deep-equal fails on. This is the one fence that
  distinguishes a flag-driven contract from a value-driven one, and it is the reason §2.3b
  spends a kernel token on the gate.
  ⚠ **THIS CORRECTION DOES NOT TOUCH FENCE 1's M3 ARM OR EP-3's M3 DORMANCY ARM, AND MUST
  NOT BE APPLIED TO THEM.** Both of those run **entirely dark** — fence 1's six cells are all
  flag-absent, and EP-3's arm advances "with the flag absent" — so on an aspatial fixture the
  stamp's `!epochTerm` early return really does leave NO `spatialLedgers` namespace at all,
  and ABSENT-ENTIRELY is the right expectation there. **Fence 5 is the only arm with a LIT
  PREFIX**, which is exactly why it is the only one the gloss was wrong about.
- **THE LIT-MUTANT CONTROL**, same file: the lit fixture really composes a different
  seed AND produces a different projection, the `epoch` field really appears, and
  neighbouring record fields are untouched. Without it fence 1 is a claim about a
  fixture that could never produce.

---

## §3 THE MECHANISMS

### 3a THE MINT SITE — the store-action layer, and nowhere else

**Home:** `campaignAdvanceSession.js#runAdvanceCampaignWorld`. **Placement:** AFTER the
four synchronous guards `campaignWorldPulseSlice.js#advanceCampaignWorld` holds
(in-flight, mutation-lock, parked-pause, FROZEN) and after `campaign` resolves, so a
refused or no-op advance burns no epoch — beside the existing `now` mint, with the same
`options` override door (code at §2.2).

**Why this layer, measured:** `eslint.config.js` bans `Math.random()` / `Date.now()` /
bare `new Date()` across `src/domain/**` ("Determinism: the domain kernel must be pure —
no Math.random(). Thread a seeded/derived value from the caller."), `src/workers/**`,
`src/generators/**` and `src/kernel/**` except `prng.js`, with
`tests/lint/determinismBanCoverage.test.js` pinning each layer. `src/store` is NOT
covered, and it already mints `now` at exactly this line. The directive's placement is
the only lint-legal one and it is already idiomatic.

**`options.epoch` is a test contract, not a convenience.** MEASURED:
`tests/store/advanceFullAutoResolve.test.js` drives TWO INDEPENDENT STORES with identical
args and asserts `expect(JSON.stringify(worldOf(on))).toBe(JSON.stringify(worldOf(off)))`
over worldState AND savedSettlements, in "NEGATIVE CONTROL: an explicit-option advance is
BYTE-IDENTICAL with the toggle ON or OFF"; its sibling repeats the compare after an undo.
Two stores ⇒ two epochs ⇒ two futures. **The cure never weakens either pin:** EP-2
teaches both to pass the SAME pinned epoch to both stores — the shape they already use
for `now: NOW`. Dark, both stay green untouched.

**Threading costs nothing, measured:** the epoch rides `multiTickArgs`, which
`advanceWorkerClient.js#runAdvanceInterval` spreads wholesale
(`const workerPayload = { ...(payload || {}) }; delete workerPayload.customContent;`) and
`advanceInterval.worker.js` re-spreads. A string crosses `structuredClone` untouched. The
R-18 paranoia re-run does `simulateCampaignWorldInterval(cloneJson(multiTickArgs))` and
diffs — an ARGS-BORNE epoch diffs clean; **an epoch read from any ambient or
module-scoped source would red paranoia mode on every advance.** That is why the value is
an argument and never a module singleton.

**THE STRUCTURAL GUARD.** MEASURED: `src/domain/clock.js#assertNowPinnedInTest` throws
when `process.env.NODE_ENV === 'test'` and is a no-op in production, called at exactly
two sites (`pulseKernel.js#simulateCampaignWorldPulse`,
`advanceInterval.js#simulateCampaignWorldInterval`), with the in-source rationale that
this "turns 'pin `now`' from a convention every future caller must remember into a
structural guard." EP-1 lands `assertEpochPinnedInTest(site)` in the same module and
calls it at the SAME TWO sites, gated on the flag:

```js
if (simulationRules?.advanceEpochEnabled === true && advanceEpoch == null) {
  assertEpochPinnedInTest('simulateCampaignWorldPulse');
}
```

Without it a future caller silently reintroduces unrecorded entropy and no test reds. It
is a no-op in production and dark by construction when the flag is absent.

### 3b THE ONE KERNEL SEAM — the TR-1-style seam contract

#### 3b.1 The seam, and exactly what it costs

`pulseKernel.js` is BANKED PERMANENTLY at 1580 effective lines under R-BLD-10,
`sizeBaseline` is TOLERANCE-ZERO IN BOTH DIRECTIONS, and FP §1 L1 says the file "receives
ZERO edits ever." **This program is the one chair-signed exception the directive itself
commissions.**

> ⭐⭐ **THE SEAM CONTRACT IS THE LIST BELOW, NOT A SLOGAN (chair ruling P1, revision 3).**
> Revision 2 said "three token-level edits on three existing lines … zero other kernel
> edits" and then, in three other sections, required edits the slogan did not carry
> (§2.3b's `epochTerm`, §3a's guard, §1.2's record spread) and left one out entirely
> (§0.3 R9's `seasonalContextFor` argument). **The contract is now an EXACT ENUMERATED
> LIST. An edit to `pulseKernel.js` that is not on this list is a build STOP, and a
> summary sentence stating a smaller number is a defect in this volume.**

**EP-1 — SIX token-level edits on SIX EXISTING lines. ZERO new lines.**

| # | Existing line (by SYMBOL) | The token-level edit | Why it cannot be avoided |
|---|---|---|---|
| 1 | the `../../kernel/prng.js` import | `{ createPRNG }` → `{ createPRNG, epochSuffix }` | J-EP-2: a new module costs a new import LINE, which reds a tolerance-zero ratchet by itself |
| 2 | the `../clock.js` import (already present, currently `{ wallClockNow, assertNowPinnedInTest }`) | gains `assertEpochPinnedInTest` | §3a puts the guard in `clock.js` beside its twin; **revision 2 never enumerated this edit**, and without it edit 4's guard does not resolve |
| 3 | `simulateCampaignWorldPulse`'s single-line destructured signature | gains `advanceEpoch = null` before the closing brace | the value must be ARGS-BORNE (§3a: an ambient read reds R-18 paranoia mode on every advance) |
| 4 | `const simulationRules = normalizeSimulationRules(startingWorldState.simulationRules);` — **the measured fold target, §2.3b / chair ruling P2** | `;`-joined: `const epochTerm = simulationRules?.advanceEpochEnabled === true ? advanceEpoch : null; if (simulationRules?.advanceEpochEnabled === true && advanceEpoch == null) assertEpochPinnedInTest('simulateCampaignWorldPulse');` | the FIRST line at which both `startingWorldState` and `simulationRules` are bound; the flag read is what makes the dark contract flag-driven (J-EP-9) |
| 5 | the ONE `createPRNG` composition | the existing template gains `${epochSuffix(epochTerm)}` | the seam itself |
| 6 | `createdAt: now,` inside the `pulseRecord` object literal | gains `...(epochTerm ? { epoch: epochTerm } : {}),` on the SAME line | §1.2's record home; **revision 2 drew this as its own line (+1) and keyed it on the raw value** — both corrected (§0.3 R10) |

**EP-3 — THREE further token-level edits at +0 lines, plus ONE new import line, ⭐ SPLIT
ACROSS THE TWO SLICES IN REVISION 6 (chair ruling G1): EDIT 9 AND THE IMPORT ARE SLICE A's,
EDITS 7 AND 8 ARE SLICE B's.** Revision 4 (chair ruling T1) grew this table from two edits and
no writer, and re-aimed edit 7 off the PRE-advance world (§0.3 R11); revision 6 re-attributes
it, because §3b.1b's family-1 accessor needs the stamp and slice A ships under EITHER arm
while slice B is Q1-gated. **The edit LIST is unchanged; only the slice column is new.**

| # | Existing line (by SYMBOL) | The token-level edit | Cost | Slice |
|---|---|---|---|---|
| ⭐ **9** | `let worldState = { ...nextWorldStateForPulse(startingWorldState, campaign, tickInterval), simulationRules };` — **THE CALENDAR-ADVANCE BOUNDARY**, the line at which the new year comes into existence AND at which `tick` becomes `current.tick + 1` | `;`-joined: `if (epochTerm) worldState = stampAdvanceEpochYear(worldState, epochTerm);` — **THE ONE WRITER'S ONE CALL SITE** (§3b.1a) | +0 lines | ⭐ **A** |
| 7 | `const seasonClock = seasonsOn ? seasonForTick(worldState.calendar.elapsedWeeks) : null;` — MEASURED loop-INVARIANT, computed once per tick ABOVE the `for (const item of snapshot.settlements)` loop | `;`-joined: `const seasonSeed = seasonClock ? yearStreamSeedOf(worldState, seasonClock.year, { absent: undefined, yearBase: 1 }) : undefined;` ⭐ **RE-AIMED IN REVISION 4 at `worldState` (POST-advance, POST-stamp), not `startingWorldState`** — §0.3 R11; and carrying its `yearBase` — §0.3 R12 | +0 lines | **B** |
| 8 | the `seasonalContextFor({ … })` argument object's `rngSeed: startingWorldState.rngSeed,` — **R9's missing read site, ROW 1's in-pulse consumer** | becomes `rngSeed: seasonSeed,` | +0 lines | **B** |
| — | **the leaf's import** | ONE new import line from the single-writer leaf, carrying `stampAdvanceEpochYear` (edit 9) in slice A and GAINING `yearStreamSeedOf` as a token edit in slice B | ⚠ **+1 LINE IN SLICE A — a PLANNED, chair-signed one-line ratchet-up (J-EP-11); slice B adds a SYMBOL to a line that already exists, at +0** ⭐ **(the split is revision 6's; the total is unchanged, and the one-leaf home is what keeps it at one line rather than two)** | ⭐ **A** (+1) / **B** (+0) |

**⚠ EDIT 9 IS LISTED FIRST BECAUSE IT MUST EXECUTE FIRST**, and the ordering is the whole
of its correctness. The table's numbering is the enumeration order the seam contract
freezes; the EXECUTION order inside the function is 9 → 7 → 8. §3b.1a proves it.

⚠ **WHY THE IMPORT CANNOT BE A TOKEN EDIT, and the arm the chair declined.** Folding the
leaf's symbols into edit 1's `prng.js` import would make it free — but the writer and both
accessors READ AND WRITE `worldState.spatialLedgers.advanceEpoch` (`latest` for family 1,
`byYear` for family 2), and putting worldState-shape
knowledge inside the PRNG primitive is the split-brain J-EP-2 exists to prevent, one
layer down. J-EP-6 puts the accessor leaf in a plain `src/domain/` leaf, which is the
correct layer and costs pulseKernel one import line. **J-EP-11 rules the trade and states
the veto cost.**

**Measure with the enforcer AT the publishing commit; never inherit the 1580 figure,
including from here.** If the effective count moves anywhere other than EP-3's declared
+1, **STOP and report** rather than restructuring the kernel or dropping a gate.

**⚠ THE SEAM MUST CITE R-BLD-10.** MEASURED: that ruling (FABLE_VALIDATION_QUEUE.md and
the `_r_bld_10_…` key in `scripts/.size-baseline.json`) refused a pulseKernel
decomposition because "the kernel's PRNG call order IS the stream identity; *a seed is a
world, forever* is constitutional, and the rewrites needed past the stage boundaries put
a same-seed shift at risk for a size number. That trade is refused." This program
deliberately changes that identity under a flag. **It is not a re-litigation** — that
refusal was for a SIZE NUMBER, this is an owner-signed constitutional amendment, and the
CALL ORDER is untouched (only the root VALUE moves). The seam comment says so, verbatim:

```js
// ⭐ THE ADVANCE-EPOCH SEAM (the ONE kernel edit this program makes; owner directive
// 2026-08-05, chair-signed). The epoch is a NEW SEGMENT on the root seed only — the
// stage order and the PRNG CALL ORDER are untouched, so the number and sequence of
// draws is identical in both flag states and R-BLD-10's refusal (which protected the
// call order for a SIZE number) is not re-litigated. Absent epoch ⇒ epochSuffix returns
// '' ⇒ this composes the pre-wave string character-for-character, so a dark or legacy
// world is byte-identical rather than merely similar.
```

**Zero kernel edits BEYOND THE NINE ENUMERATED ABOVE.** No stage added, no branch
introduced, no value read that was not already in scope (`simulationRules`,
`startingWorldState`, `worldState`, `seasonClock` and `now` are all pre-existing
bindings). `applyWorldPulse.js` is untouched. ⚠ The phrase "zero other kernel edits" is
retired as a standalone claim: it was TRUE of revision 2's three-edit list only because
that list was incomplete, and TRUE of revision 3's eight-edit list only because it was
missing the writer that makes Arm A mean anything.

#### ⭐⭐ 3b.1a THE `byYear` WRITER — ITS HOME, ITS ORDERING, ITS LAW (chair ruling T1, revision 4)

**THE DEFECT THIS SECTION CURES (§0.3 R11).** Revision 3 declared the ledger's shape, its
writer COUNT and a budget FILE, and never named a point in the advance at which the stamp
runs. Both consequences are fatal and neither is visible from the shape: the named budget
file **cannot host the call** (the advanced year is knowable only inside `pulseKernel.js`),
and the one in-pulse read was aimed at the **pre-advance** world, which on a year-crossing
tick structurally cannot carry the key it is looking for. Under revision 3 as written,
either no writer ever ran — nine dead re-roots, the banked "a guard gated on OPTIONAL
evidence CANNOT FIRE" class — or a writer added later by an implementer would have repainted
a lived year mid-year. **The stamp is therefore specified here in full, and its call site is
edit 9 of the seam contract.**

##### THE LEDGER SHAPE — `current` IS STRUCK (J-EP-12)

```js
// worldState.spatialLedgers.advanceEpoch — conditionally materialized, ONE writer.
{
  latest: { tick: <the tick this stamp was written at>, epoch: '<epoch>' }, // slice A — family 1
  byYear: { '<canonical 1-based year>': '<epoch>' },                        // slice B — family 2
}
```

⭐⭐ **`latest` IS NEW IN REVISION 6 (chair ruling G1, §0.3 R13, J-EP-14), AND IT IS NOT
`current` UNDER A NEW NAME — READ THE SELECTION RULE BEFORE CONCLUDING J-EP-12 WAS
OVERTURNED.** J-EP-12 struck `current` on three grounds, and revision 6 refutes exactly one
of them while STRENGTHENING the other two. (a) *"`current` has no reader"* — **REFUTED by
slice A's own charter:** `tickStreamSeedOf` is a reader, declared in revision 2 and given no
source until now (§0.3 R13). (b) *"it duplicates a value with two homes"* — **still true and
still fine:** `latest` is not the pending epoch, it is THE STAMP OF THE TICK THE WORLD IS AT,
and the tick number is what makes it a different fact from `pulseRecord.epoch`. (c) *"it is a
fourth flag-dark leak surface"* — ⭐ **CLOSED BY CONSTRUCTION, not by absence:** `latest` is
readable ONLY when `latest.tick === worldState.tick`, a dark tick never writes it, and the
composed tick of the NEXT advance is always `startingWorldState.tick + 1` (MEASURED:
`nextWorldStateForPulse` is `const tick = current.tick + 1; return { ...current, tick, calendar: … }`),
so a stamp written under a lit flag is UNREADABLE the moment the flag goes dark. That is the
property `current` could never have had, because `current` had no tick beside it. **Both keys
are drop-when-absent, both are written by the same ONE writer, and the sub-key is present at
all only under a lit flag.** §3b.1b is the accessor's full spec.

⚠ **REVISION 3 SPELLED IT `{ current, byYear }`. `current` IS REMOVED (J-EP-12).** MEASURED,
nothing reads it: the pending epoch is ARGS-BORNE by §3a's own law (an ambient or
module-scoped read reds R-18 paranoia mode on every advance), so a persisted `current` would
be a value with no consumer AND a **fourth flag-dark leak surface** — a live epoch sitting
in persisted state after a flag flip, which is precisely the cell §2.3b exists to close.
The ledger carries lived history and nothing else. Sub-century product scope bounds it at
≈100 rows of ≈14 bytes (§7a is where a longer-lived product would be re-costed).

##### THE HOME — ONE LEAF, ONE WRITER, ONE IMPORT

**`src/domain/advanceEpochLedger.js`** — a plain `src/domain/` leaf, J-EP-6's home, outside
both `worldPulse/` and `spatial/` **because it is SUBSTRATE rather than a layer subject and
its importers span THREE sibling directories (`worldPulse/`, `traditions/`, `townMap/`), so
its correct home is their parent** (⚠ the rationale is restated on those layering grounds in
revision 5, chair ruling F5 — revisions 3 and 4 justified the home partly by "CR-FP-11 arm B
does not red," which is the same registration-evasion move this section refuses two
subsections above; the census consequence is a HAZARD recorded at J-EP-6, never a reason).
It exports **exactly
three** symbols and is the SINGLE WRITER module (the L4 idiom, enforced by a shrink-only
source scan with an executed second-writer plant):

| Symbol | Role | Lands in |
|---|---|---|
| `stampAdvanceEpochYear(worldState, epochTerm)` | THE ONE WRITER. Stamps `latest` for THIS tick (always, lit) and applies FIRST-WINS to `byYear` (slice B's half). ⚠ **The name is kept deliberately** — it is the year stamp AND the tick stamp, one call, one write, and a rename would cost a second sweep for no fact | ⭐ **SLICE A** (its `latest` half + seam edit 9 + the leaf + the +1 import + the manifest row); slice B GROWS it with the `byYear` half |
| `tickStreamSeedOf(worldState, { absent })` | the family-1 accessor — reads `latest` under the CURRENT-TICK SELECTION RULE (§3b.1b) | ⭐ **SLICE A** |
| `yearStreamSeedOf(worldState, year, { absent, yearBase })` | the family-2 accessor (§3b.3's explicit-coercion rule + §0.3 R12's `yearBase`) — reads `byYear` | **SLICE B** (Arm A only) |

⭐⭐ **THE SLICE COLUMN IS NEW IN REVISION 6 AND IT MOVES A BOUNDARY (chair ruling G1,
J-EP-14).** Revisions 3–5 put the WRITER, the LEAF, seam edit 9, the declared +1 import line
and the `spatialUsage.js` manifest row entirely inside EP-3 **slice B** — the Arm-A-only,
Q1-gated slice. **That is unbuildable once §3b.1b gives the family-1 accessor its source:
slice A ships under EITHER arm (§3b.2's own ruling) and now depends on a stamp, and a slice
cannot depend on a gated one.** Therefore: **slice A lands the leaf, the writer's `latest`
half, `tickStreamSeedOf`, seam edit 9, the ONE import line and the ONE `EXEMPT_LEDGER_KEYS`
row; slice B lands the writer's `byYear` half, `yearStreamSeedOf`, seam edits 7 and 8, and
the eight family-2 read-site re-roots plus RS-9's second argument.** ⚠ **AND THE ARM-B
CONSEQUENCE IS THE TEST J-EP-12 APPLIED TO `current`, PASSED: under Arm B slice B never
builds, so `byYear` IS NEVER WRITTEN AT ALL** — there is no dead persisted sub-key under the
declined arm, and the ledger a lit Arm-B world carries is `{ latest }` alone. The CQ5-class
serialization law, the quiet-window requirement and CHECK-GIT-FIRST move with the row.

**Why one leaf for all three symbols, measured:** `pulseKernel.js` needs the writer (edit 9,
slice A) AND the year accessor (edit 7, slice B). Two leaves would cost **two** import lines
on a file banked at tolerance zero; one leaf costs **one**, which is the +1 J-EP-11 already
declared — and revision 6 makes that argument stronger, not weaker, because the +1 is now
BOUGHT ONCE IN SLICE A and slice B adds a SYMBOL to an import line that already exists. The
trade is recorded rather than assumed.

##### THE WRITER, SPELLED

**SLICE A's form (the `latest` half alone — this is what the leaf looks like when slice A
lands, and under Arm B it is what the leaf looks like FOREVER):**

```js
/** THE ONE WRITER of spatialLedgers.advanceEpoch. Called ONCE per tick, immediately after
 *  the calendar advances (pulseKernel.js seam edit 9), and NEVER anywhere else.
 *  `latest` records THIS TICK's stamp: { tick, epoch }. It is readable only by a consumer
 *  holding a world whose own `tick` matches — see tickStreamSeedOf's CURRENT-TICK
 *  SELECTION RULE — which is what makes a stamp written lit UNREADABLE once the flag is
 *  dark, without any flag read down here.
 *  @param {any} worldState @param {string|null} epochTerm */
export function stampAdvanceEpochYear(worldState, epochTerm) {
  if (!epochTerm) return worldState;                       // chain link L2 / M3 — dark ⇒ no ledger, no namespace
  const tick = num(worldState?.tick, 0);
  return setSpatialLedger(worldState, 'advanceEpoch', { latest: { tick, epoch: String(epochTerm) } });
}
```

**SLICE B GROWS THE SAME FUNCTION (Arm A only) — the `byYear` half, FIRST-WINS, written in
the SAME call so there is still exactly ONE writer and exactly ONE `setSpatialLedger`:**

```js
/** … as above, plus: FIRST-WINS on byYear — the epoch of the advance that FIRST ENTERED a
 *  year is the epoch that year keeps, forever, until an undo un-lives it. A mid-year tick
 *  leaves `byYear` BYTE-UNCHANGED and re-uses its object reference. */
export function stampAdvanceEpochYear(worldState, epochTerm) {
  if (!epochTerm) return worldState;                       // chain link L2 / M3 — dark ⇒ no ledger, no namespace
  const tick = num(worldState?.tick, 0);
  const year = String(seasonForTick(num(worldState?.calendar?.elapsedWeeks, 0)).year);
  const prior = /** @type {{ latest?: { tick: number, epoch: string }, byYear?: Record<string,string> }} */ (getSpatialLedger(worldState, 'advanceEpoch')) || null;
  const priorByYear = prior?.byYear || null;
  const byYear = (priorByYear && priorByYear[year] != null)
    ? priorByYear                                          // FIRST-WINS — a lived year is never repainted, and the SAME REFERENCE is re-used
    : { ...(priorByYear || {}), [year]: String(epochTerm) };
  return setSpatialLedger(worldState, 'advanceEpoch', { latest: { tick, epoch: String(epochTerm) }, byYear });
}
```

**FIVE laws, each load-bearing and each pinned — plus ONE DECLARED NON-INVARIANT (chair
ruling F8) which is stated here because this is where a reader of the ledger's shape will
look for it.** ⚠ **LAWS 2 AND 5 ARE THE ONES REVISION 6 CHANGED (chair ruling G1); laws 1, 3
and 4 stand exactly as revision 4 measured them:**

1. **FIRST-WINS, NEVER OVERWRITE — ON `byYear`.** This is the entire correctness of slice B.
   It is what makes the mid-year stability pin true (two ticks of the same lived year read the
   SAME severity, because the second tick leaves `byYear` untouched) and what makes the
   fresh-year pin true (a year first entered after an undo has no key, because the undo
   restored a world from before the stamp). ⚠ **It does NOT govern `latest`**, which is
   per-tick by construction — law 5.
2. ⚠ **SAME-REFERENCE ON NO-OP IS THE DARK LAW AND THE `byYear` LAW — REVISION 6 NARROWS IT,
   AND SAYS SO RATHER THAN LETTING A PIN DISCOVER IT.** Revision 4 wrote "a mid-year tick
   returns the identical object, so the overwhelming majority of ticks allocate nothing."
   **That is FALSE once `latest` exists**, and it is false in the honest direction: a LIT tick
   always writes `latest`, so a lit tick always allocates one world spread and one small
   object. What survives, and is what the law was protecting: **(a) DARK ⇒ the identical
   reference, always** (the `!epochTerm` guard is still first — that is the dormancy property
   every fence asserts); **(b) LIT ⇒ `byYear`'s own object reference is re-used unchanged on
   a mid-year tick**, so no key order can drift and no lived year is repainted. ⚠ **THE
   FIRST-WINS PIN MOVES WITH THIS LAW:** it asserts `byYear` is BYTE-UNCHANGED and holds the
   SAME OBJECT REFERENCE across a second same-year stamp — it may NOT assert the worldState
   reference is unchanged, because a correct lit implementation changes it every tick. A pin
   written the old way REDS A CORRECT BUILD, which is the F2 defect class and is why this is
   spelled out instead of left to the builder.
3. **DARK RETURNS FIRST.** The `!epochTerm` guard is the FIRST statement, so `setSpatialLedger`
   — which CREATES the `spatialLedgers` namespace when absent — is unreachable dark. Chain
   link M3.
4. **THE VALUES ARE JSON SCALARS.** `byYear` is a plain object with string keys and string
   values and `latest` is `{ tick: number, epoch: string }`: `structuredClone`-safe,
   JSON-round-trip safe, and `deepCloneConditionalLedger` handles both as `spatialLedgers`'s
   existing sub-ledgers are handled. **NEVER a Symbol, BigInt, object-valued epoch or Date**
   — §1.1's rule, one layer out.
5. ⭐ **`latest` IS PER-TICK AND SELF-INVALIDATING (new, chair ruling G1).** It is written on
   EVERY lit tick, carries the tick it was written at, and is READABLE only by a consumer
   holding a world whose own `tick` equals it. **No flag is read in the accessor and none is
   needed:** a dark tick writes nothing, and the next composed tick is always
   `startingWorldState.tick + 1` (MEASURED at `nextWorldStateForPulse`), so a stale stamp can
   never be selected. This is the law that makes the family-1 half dark-identical BY
   CONSTRUCTION rather than by a fourth flag read, and it is the reason `latest` is not the
   `current` J-EP-12 struck.

> ⭐⭐ **AND ONE DECLARED NON-INVARIANT — `byYear` ROW COUNT ≠ `pulseHistory` LENGTH (chair
> ruling F8, anomaly A-R4-3, revision 5). THIS IS DESIGN. IT IS NOT A LEAK, AND THE NEXT
> AUDITOR IS NOT LOOKING AT A BUG.** MEASURED at HEAD:
> `advanceInterval.js#collapseIntervalHistory` does `intervalRecords.slice(0, -1)` — a
> multi-tick interval collapses N pulse RECORDS down to ONE.
> ⚠⚠ **THE PREMISE IS RESPELLED IN REVISION 6 (chair ruling G2). REVISIONS 5's SPELLING WAS
> FALSIFIABLE IN ONE GREP AND THE RULING IT CARRIES IS NOT.** Revision 5 wrote that the
> function "returns `{ ...worldState, pulseHistory: composed }`" and that "`spatialLedgers` is
> neither read nor written anywhere on that path." **MEASURED AT HEAD, both clauses are wrong
> and the conclusion is right**, which is the worst combination a volume can ship: an auditor
> who greps `spatialLedgers` on the collapse path finds three accessor calls and concludes the
> declared non-invariant rests on a premise that does not reproduce. **WHAT IS ACTUALLY TRUE,
> quoted from HEAD:** the function's return statement is
> `return reconcileProvenanceAfterHistoryCollapse({ ...worldState, pulseHistory: composed }, removed);`
> — so **(1) THE PATH COMPOSES BY SPREAD, NOT BY ALLOWLIST RECONSTRUCTION**, which is the
> load-bearing fact: `spatialLedgers` (and therefore `advanceEpoch`, and therefore every
> `byYear` row and the `latest` stamp) is **CARRIED THROUGH untouched by the spread itself**;
> and **(2) `reconcileProvenanceAfterHistoryCollapse` DOES touch `spatialLedgers` — it reads
> `const ledger = (getSpatialLedger(worldState, 'provenance')) || null;` and writes either
> `setSpatialLedger(worldState, 'provenance', next)` or `dropSpatialLedger(worldState, 'provenance')`
> — but ONLY the `provenance` sub-key**, which is itself an `EXEMPT_LEDGER_KEYS` entry in
> `src/lib/spatialUsage.js`, the same manifest this section rules `advanceEpoch` into.
> **THE PRECISE CLAIM, and it is the one a grep confirms rather than refutes: the
> `advanceEpoch` sub-key is neither read nor written on that path; the only `spatialLedgers`
> write there is the PROVENANCE prune, and `setSpatialLedger` is
> `{ ...worldState, spatialLedgers: { ...(ns || {}), [key]: value } }` — it preserves every
> sibling sub-key and its insertion order, while `dropSpatialLedger` can only drop the whole
> namespace when `provenance` is the LAST sub-ledger, which is impossible on any world
> carrying `advanceEpoch`.** The function is also gated: `if (!provenanceLedgerActive(worldState) || removedPulseRecords.length === 0) return worldState;`.
> ⭐ **The DECLARED NON-INVARIANT below is therefore UNCHANGED and independently re-confirmed
> — it was the reason that needed fixing, not the ruling.** The stamp, by contrast, is written
> per TICK inside the kernel (seam edit 9) under FIRST-WINS. **Therefore a single `one_year`
> advance that crosses TWO calendar-year boundaries leaves TWO `byYear` rows behind ONE
> pulse record**, and both rows carry the SAME epoch string. That is correct on the
> directive's own terms: both years were genuinely LIVED, both were entered by the same user
> advance, and one advance is one epoch (§1.5's grain). **The ledger is a MAP OF LIVED YEARS,
> not a mirror of the history array**, and the two counts are not required to agree in either
> direction — a 52-tick advance inside ONE calendar year leaves ONE `byYear` row and one
> record; an eight-year catch-up leaves EIGHT rows and one record. ⚠ **A pin asserts the two
> counts are ALLOWED to differ** (executed over a two-boundary advance), precisely so no
> future auditor "repairs" the divergence by teaching `collapseIntervalHistory` to prune the
> ledger — which would DELETE the epoch of a lived year and break the trust floor, arriving
> as a tidy-up. §8.4's INTERVAL COLLAPSE row states the same fact from the lifecycle side and
> §1.5 points here from the grain ruling; **three homes, one statement, because this is the
> divergence most likely to be re-found and mis-diagnosed.**

##### ⭐ THE ORDERING PROOF — MEASURED AT HEAD, AND IT IS THE POINT

The stamp must land **after the calendar moves** and **before the earliest same-tick read of
the new year**. MEASURED inside `simulateCampaignWorldPulse`, in execution order:

| Order | Symbol at HEAD | What it establishes |
|---|---|---|
| 1 | `const startingWorldState = ensureWorldState(campaign?.worldState, campaign);` | the PRE-advance world — the one revision 3's edit 7 wrongly read |
| 2 | `const simulationRules = normalizeSimulationRules(startingWorldState.simulationRules);` | seam edit 4 folds here: `epochTerm` is bound |
| 3 | `const rng = createPRNG(…);` | seam edit 5 — the root, which takes the epoch as a SEGMENT and needs no ledger |
| 4 | `let worldState = { ...nextWorldStateForPulse(startingWorldState, campaign, tickInterval), simulationRules };` | ⭐ **THE CALENDAR MOVES HERE** — `nextWorldStateForPulse`'s body is `calendar: advanceWorldCalendar(current.calendar, interval)`. **SEAM EDIT 9 `;`-JOINS HERE.** The new year now exists and is stamped in the same statement sequence |
| 5 | `const seasonClock = seasonsOn ? seasonForTick(worldState.calendar.elapsedWeeks) : null;` | ⭐ **THE EARLIEST SAME-TICK YEAR READ.** Seam edit 7 folds here and reads the ledger stamped at step 4 |
| 6 | `seasonalContextFor({ rngSeed: …, clock: seasonClock, … })` inside the settlement loop | seam edit 8 — row 1's in-pulse consumer |
| 7 | `const applied = applyWorldPulseOutcomes({ …, worldState, … })` | `worldState` (stamped) becomes `applied.worldState` |
| 8 | `let memoryState = advanceObligationDecay(applied.worldState, worldState.tick);` | every LATER year-family stage — generosity (RS-3), traditions (RS-4/RS-6 and, by hand-down, RS-7/RS-8), roads (RS-5), the ladder (RS-9's second argument) — receives `memoryState`. ⚠ **THAT THEY THEREFORE READ THE SAME STAMP IS NOT ASSERTED HERE — IT IS PINNED** (the STAMP-SURVIVAL PIN below, chair ruling F1). Revision 4 asserted it in this cell, and the cell was carrying EIGHT of the NINE re-roots on one sentence |
| 9 | `const finalWorldState = appendPulseHistoryWithProvenance(memoryState, finalPulseRecord, applied);` → returned as `worldState` | the stamp rides out to the store, the save, the undo snapshot, the view-time surfaces (RS-16) and the next composed tick. ⚠ **ALSO PINNED, NOT ASSERTED** — the pin's RETURNED-WORLD ARM (chair ruling F6): a stage between step 8 and here that rebuilds the world wholesale is invisible to every in-pulse row |

**WHY THIS ORDERING IS THE COHERENT ONE, stated as the volume must state it.** A year's
epoch is the epoch of the advance that FIRST ENTERED that year. A year is entered by the
calendar advance and by nothing else. Therefore the only state that can carry the stamp is
the state the calendar advance produced, and the only moment it can be written is between
that advance and the first draw keyed on the new year. Writing it EARLIER is impossible —
the year does not exist yet. Writing it LATER means the tick that entered the year draws
epoch-free while every subsequent tick of that same lived year draws epoch-bearing, which
is not a smaller version of the feature but its exact inversion: **a lived year that changes
its weather between two ticks.** Reading the PRE-advance world (revision 3's spelling) is
that same defect wearing a different mask, and it fails silently — the accessor returns the
bare root and every test that only checks "the composition still works" stays green.

##### ⭐⭐ THE STAMP-SURVIVAL PIN — ALL NINE RE-ROOTS AND THE RETURNED WORLD (chair rulings F1 + F6, revision 5)

**THE DEFECT THIS CURES, stated plainly.** Revision 4 wrote "**The volume does not ARGUE
that the stamp survives them — it PINS it**" and then scoped that pin to seam edits 9 → 7
only, covering ONE of the nine family-2 re-roots. The other EIGHT were carried by ONE
ASSERTED SENTENCE in the ordering table's step 8. **That is the exact treatment this
subsection rejects for the short span, applied to a span five times longer** — and it
re-opens the banked class R11 named ("a guard gated on OPTIONAL evidence CANNOT FIRE") at
eight new addresses inside the section that cured it at one. **The rule is now uniform:
ZERO family-2 sites are carried by prose.**

**THE SPAN, MEASURED AT HEAD, WITH ITS COMMANDS** (each re-runnable; ⚠ **these figures are
VOLATILE BY DESIGN and are deliberately NOT frozen anywhere** — every wave that mounts a
stage moves them, which is precisely why the instrument is a PIN on the stamp and never a
baseline on the count):

| Span | MEASURED | Command |
|---|---|---|
| seam edit 9's host → seam edit 7's host (the span revision 4 pinned; covers RS-2 only) | **14** `worldState` rebinds | `awk '/let worldState = \{ \.\.\.nextWorldStateForPulse/,/const seasonClock = seasonsOn/' src/domain/worldPulse/pulseKernel.js \| grep -cE '^\s*worldState = '` |
| seam edit 7's host → `applyWorldPulseOutcomes`'s call | **19** further `worldState` rebinds | `awk '/const seasonClock = seasonsOn/,/const applied = applyWorldPulseOutcomes\(\{/' src/domain/worldPulse/pulseKernel.js \| grep -cE '^\s*worldState = '` |
| inside `applyWorldPulseOutcomes` — a SECOND FILE, `applyWorldPulse.js` (1291 lines), which binds `let state = worldState;` and returns `worldState: state` | **23** `state` rebinds | `grep -cE '^\s*state = ' src/domain/worldPulse/applyWorldPulse.js` |
| `let memoryState = advanceObligationDecay(applied.worldState, worldState.tick);` → the stages hosting RS-3/RS-4/RS-5/RS-6/RS-7/RS-8/RS-9 | **22** statement-initial writes **+ 5** destructuring rebinds | `grep -cE '^\s*(let )?memoryState = ' …` · `grep -cE '^\s*\(\{ worldState: memoryState' …` |

**THE ARITHMETIC, so it can be checked: revision 4 PINNED the FIRST span (14) and ASSERTED
the other three — 19 + 23 + 27 = SIXTY-NINE rebind sites across TWO files, separating RS-2's
read from the last family-2 stage, very nearly five times the span that carried a receipt.**
FIFTY of the sixty-nine sit AT OR PAST the `applyWorldPulse.js` boundary, and that file is the
apply-side mount every layer's stages hang from — a
GROWTH surface, not a fixed one. MEASURED, the receiving stages really do take the walked
value: `advanceGenerosity({ …, worldState: memoryState, … })` hosts RS-3, and
`advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize({ …, worldState: memoryState, … })`
is the chain hosting RS-4/RS-5/RS-6/RS-7/RS-8 and RS-9's support pass. Every one is a spread
by house convention TODAY; none of that is a contract.

> ⭐⭐ **THE STAMP-SURVIVAL PIN (binding on EP-3 slice B; ONE parameterized suite).** For a
> LIT advance over a fixture that CROSSES A YEAR BOUNDARY, assert for **EACH of the NINE
> family-2 re-root actions independently** — the EIGHT read sites RS-2, RS-3, RS-4, RS-5,
> RS-6, RS-7, RS-8, RS-16 **plus RS-9's second argument** — that the value the site composed
> its draw key from **carries the epoch stamped at seam edit 9 of that same tick**, and not
> the bare `rngSeed`.

**THE INSTRUMENT, so this is executable rather than aspirational.** `yearStreamSeedOf` is
the SINGLE reader of the ledger (§3b.1a's leaf exports it and nothing else reads `byYear`),
so the suite does not need nine bespoke probes: it places a **STRICT PASS-THROUGH `vi.mock`
spy on `yearStreamSeedOf` at its leaf home `src/domain/advanceEpochLedger.js`** — the fence-3
idiom, and the spy sits OUTSIDE every calling module by construction, which is the recorded
WR-10 lesson about intra-module wrapping — records `(callSite, year, yearBase, returnValue)`
for every invocation, and drives ONE lit year-crossing advance **PLUS ONE VIEW-TIME READ over
the world that advance RETURNED.** ⚠ **THE SECOND DRIVE IS NOT OPTIONAL AND REVISION 5 LEFT IT
IMPLICIT (recorded and cured in revision 6):** row 9 (RS-16) is a VIEW-TIME site — MEASURED,
`mapDress.js`'s `resolveMapDress` is reached from `src/domain/townScene/sceneLiving.js` and
NEVER from the pulse — so an advance alone observes ZERO calls for that row and the row's own
observed-call floor reds it. That red is the instrument working ("fix the FIXTURE, never the
assertion"), but the fixture requirement belongs in the spec rather than in a day-one failure,
so it is stated here. ⚠ **MOCK THE LEAF, NEVER A
BARREL:** the banked class is that `vi.mock` misses a value reached through a dynamic
`import()`; the leaf is imported statically by every caller, which is a second reason the
one-leaf home is the right one (J-EP-11). ⭐ **AND THE SUITE CARRIES A SECOND SPY, ON
`tickStreamSeedOf` AT THE SAME LEAF (revision 6):** row 8 asserts that BOTH of RS-9's values
reached their own consumer, and the tick-anchored half of that claim is unobservable through a
`yearStreamSeedOf` spy alone. The second spy is the same instrument slice A already lands
(§3b.1b's family-1 pin), re-used here rather than re-invented.

⚠⚠ **HOW THE NINE ROWS ARE TOLD APART — RULED HERE, BECAUSE THE ARGUMENTS CANNOT DO IT.**
The accessor signature is `yearStreamSeedOf(worldState, year, { absent, yearBase })`, and
MEASURED against §3b.2's re-root table **SEVEN of the nine rows sit in argument-identical
GROUPS — corrected from "five" in revision 6, chair ruling G4**: RS-4, RS-5, RS-6, RS-7 and
RS-8 all pass `{ absent: '', yearBase: 1 }`, **and RS-3 and RS-9 both pass
`{ absent: '', yearBase: 0 }`** (§3b.2's row-13 line gives RS-3 `yearBase` **0**; §3b.3's
coercion row 2 gives RS-9 `String(asObject(worldState).rngSeed || '')` ⇒ `absent: ''` and
§3b.2's row-20 line gives it `yearBase` **0**). Only RS-2 (`{ absent: undefined, yearBase: 1 }`)
and RS-16 (`{ absent: null, yearBase: 1 }`) are separable by arguments at all. So a spy that
attributes by arguments alone cannot separate RS-4 from RS-6 — two calls in the SAME module —
**nor RS-3 from RS-9**, and a "nine rows observed" assertion over an unattributable stream is
the self-referential pin class this program has banked. ⚠ **THE UNDERSTATEMENT WAS ITSELF THE
HAZARD:** an implementer reading "five are argument-identical" infers the other four ARE
argument-separable and builds a hybrid spy that attributes RS-3 and RS-9 by their options bag;
the two then collide silently and row 20 — the succession-adjacent one — certifies
epoch-bearing without ever having run. **The ruled cure is unaffected and covers all seven**,
because calling-module attribution separates RS-3 (`generosityKernel.js`) from RS-9
(`npcLadderKernel.js`) and the function frame separates the same-module pair. **RULED: the spy attributes each call by its CALLING
MODULE, read from the stack frame (`new Error().stack`) at invocation time — TEST-ONLY, ZERO
production change, zero new accessor argument.** Where one module hosts TWO rows
(`traditionsKernel.js` hosts RS-4 and RS-6; `roadsKernel.js`'s RS-5 is single), the two are
separated by the FUNCTION frame beneath the module frame, which is what `seasonalSeverityFor`'s
caller and the tradition-draw caller differ in. **THE FALLBACK, if a runtime proves stack
frames unreliable under the bundler:** the accessor takes an explicit `site` string in the
same options bag, in exactly the style §3b.3 already mandates for `absent` and J-EP-13 for
`yearBase` — coherent and self-documenting, but it is a PRODUCTION change at nine call sites
and one more required argument, so it is the fallback and not the default. ⛔ **What is NOT
acceptable is dropping to a coarser assertion** ("at least nine calls were observed, all
epoch-bearing"), which passes when one site is called nine times and eight are dead — the
exact vacuity the observed-call floor exists to prevent.

| # | Row | Where it is observed | What the row asserts |
|---|---|---|---|
| 1 | **RS-2** (`pulseKernel.js`, in-pulse) | seam edit 7, same tick, 14 rebinds after the stamp | the returned seed bears `::epoch:` and the epoch equals the tick's `epochTerm` |
| 2 | **RS-3** (`generosityKernel.js` → row 13) | `advanceGenerosity`, post-apply, on `memoryState` | same, with `yearBase: 0` (§0.3 R12) |
| 3 | **RS-4** (`traditionsKernel.js` → row 1) | the assize chain, post-apply | same, `yearBase: 1` |
| 4 | **RS-5** (`roadsKernel.js` → rows 3, 5) | the assize chain, post-apply | same, `yearBase: 1` |
| 5 | **RS-6** (`traditionsKernel.js` → row 6) | the assize chain, post-apply | same, `yearBase: 1` |
| 6 | **RS-7** (`traditions/politics.js` → rows 7, 9) | reached from traditions with the handed-down `clock.year` | same, `yearBase: 1` |
| 7 | **RS-8** (`traditions/relations.js` → row 8) | reached from traditions, same hand-down | same, `yearBase: 1` |
| 8 | **RS-9's SECOND ARGUMENT** (`npcLadderKernel.js` → row 20's support pass) | post-apply; ⚠ the tick-anchored slice-A re-root at the SAME read must ALSO still be observed, so this row asserts BOTH values reached their own consumer | same, `yearBase: 0` |
| 9 | **RS-16** (`mapDress.js`, VIEW TIME) | over the world the advance **RETURNED**, after a JSON round-trip | same, `yearBase: 1` — and the EXISTING `rngSeed &&` call-suppression guard is still in force |

**⭐ THE RETURNED-WORLD ARM (chair ruling F6, anomaly A-R4-1).** Rows 1–8 all observe the
stamp at a COMPOSITION SITE. That leaves one hole they cannot see: a stage AFTER the last
family-2 read that rebuilds the world wholesale drops the stamp from the world the kernel
RETURNS, and every in-pulse row stays green. **The pin therefore adds a tenth assertion
that is not a re-root site at all:** on the value `simulateCampaignWorldPulse` RETURNS as
`worldState`, assert `spatialLedgers.advanceEpoch.byYear[<the canonical 1-based year the
tick entered>]` equals that advance's `epochTerm` — and assert it AGAIN after the store
commit and a real JSON round-trip, because that is the world RS-16, the save, the undo
snapshot and the next composed tick all read. Row 9 above is the view-time consumer of this
same world and is the reason the arm is not merely tidiness.

**ANTI-VACUITY — THE FLOOR THAT MAKES THE NINE REAL.** Each of the nine rows asserts it
observed **AT LEAST ONE** accessor call in the fixture. **A row that observes ZERO calls
REDS**, with the message "the fixture does not reach this site — fix the FIXTURE, never the
assertion." ⚠ **A stage the fixture cannot reach is a STOP-and-report to the chair, never a
dropped row:** the banked N3 collector-totality lesson is that DROPPING an unreadable close
restores exactly the blindness the instrument was built to remove. This floor is the whole
difference between a pin over nine sites and a pin over one site with eight decorations.

**FOUR EXECUTED MUTANTS, each must RED ON ITS OWN, and the asymmetry between them is the
proof that the long span is covered:**

| Mutant | Plant | Must RED | Must stay GREEN |
|---|---|---|---|
| **(i)** | re-aim seam edit 7 at `startingWorldState` (revision 3's spelling, §0.3 R11) | row 1 (RS-2) | rows 2–9 |
| **(ii)** | a wholesale-replacement plant IN `pulseKernel.js` at the `memoryState` seam — hand `advanceObligationDecay`'s result a freshly-CONSTRUCTED world instead of a spread | rows 2–9 + the returned-world arm | row 1 (it reads BEFORE the apply) |
| **(iii)** | the same plant ONE FILE OUT, at the apply-side mount — `applyWorldPulseOutcomes` (`applyWorldPulse.js`) returns a constructed `worldState` rather than `state` | rows 2–9 + the returned-world arm | row 1 |
| **(iv)** ⭐ | drop the stamp from the returned world AFTER the last family-2 read | the RETURNED-WORLD ARM and row 9 (RS-16) ONLY | rows 1–8 |

⚠ **(ii) AND (iii) SHARE A RED SIGNATURE DELIBERATELY, AND BOTH ARE REQUIRED:** they plant at
DIFFERENT ADDRESSES in DIFFERENT FILES — one inside `pulseKernel.js`'s post-apply span, one
inside `applyWorldPulse.js`, the growth surface every layer's stages mount on. A suite that
runs only one of them has not proven it reaches across the file boundary, and FIFTY of the
sixty-nine rebinds sit at or past that boundary.

**Mutant (iv) is the one that earns F6 its own ruling:** it is invisible to all eight
in-pulse rows, so a pin that stopped at composition sites would have shipped that hole
green. Mutants (ii) and (iii) are the ones that earn F1 its own ruling: under revision 4's
spelling both were GREEN, because the only executed assertion sat 14 rebinds from the stamp
while the eight sites it was standing in for sat 69 further on.

##### ⭐ THE OBLIGATION REVISION 3 COULD NOT HAVE SEEN — THE COVERAGE MANIFEST

**MEASURED, and it is a hard gate, not a nicety.** ⚠⚠ **THE CITATION IS CORRECTED IN
REVISION 5 (chair ruling F3): THE WALKER LIVES AT `tests/lib/`, NOT `tests/lint/`.**
Revisions 3 and 4 cited it as `tests/lint/spatialLedgerCoverage.walker.test.js` at four
sites; MEASURED, `ls tests/lint | grep -i ledger` returns only
`envoyErrandLedgerSingleWriter.walker.test.js` and `satellitesLedgerWriters.walker.test.js`,
and `find tests -name '*spatialLedgerCoverage*'` returns exactly one path. **A slice-B
implementer greps the cited path, finds nothing, and has been handed a reason to believe the
obligation is stale — which is the precise failure a citation exists to prevent, in the
volume whose own law is NAVIGATE BY SYMBOL.** The obligation itself was fully correct and is
unchanged; only the address was wrong, and the cure is to cite the SYMBOLS, which is what
that law asked for in the first place.

> **THE GATE, BY SYMBOL (MEASURED at HEAD).** File `tests/lib/spatialLedgerCoverage.walker.test.js`,
> `describe('spatialUsage ledger-coverage walker (lib-infra-copy-1)')`. Its
> **`writtenLedgerKeys()`** walks `join(ROOT, 'src', 'domain')` recursively, excluding only
> the accessor DEFINITION `src/domain/spatial/distanceRead.js` (`ACCESSOR_DEF`), and resolves
> BOTH spellings of a write — **`WRITE_LITERAL_RE`** (a quoted key) and **`WRITE_CONST_RE`**
> (an UPPER_SNAKE `_LEDGER` / `_KEY` / `_LEDGER_KEY` identifier, resolved to its string value
> through **`ledgerKeyConstants()`**). Its test
> **`'every written spatialLedgers key is TRACKED or EXEMPT (and no phantom classifications)'`**
> asserts `expect(classified).toEqual(written)` where
> `classified = [...new Set([...TRACKED_LEDGER_KEYS, ...Object.keys(EXEMPT_LEDGER_KEYS)])].sort()`
> — **EXACT SET EQUALITY IN BOTH DIRECTIONS**, with the in-file comment naming both failure
> directions (an unclassified write, and a classification with no write). `EXEMPT_LEDGER_KEYS`
> is an `Object.freeze({ key: 'reason' })` map, so the volume's "ONE row with its written
> reason" is exactly the right shape.

The leaf lives under `src/domain`, so its write is in scope
and **`advanceEpoch` must be classified in the SAME COMMIT or ⭐ EP-3 SLICE A reds on day one**
(revision 6: the writer and therefore the obligation moved to slice A with chair ruling G1).

> **RULED: `advanceEpoch` joins `EXEMPT_LEDGER_KEYS`, not `TRACKED`.** The manifest's own
> criterion decides it: this is not an exercised mover at all. It is a STREAM-ADDRESS
> ANNOTATION in the `provenance` / `reframes` class — structural metadata over every layer
> rather than a thing the world did — and a key count would read "how many distinct years
> this campaign has lived under a lit flag," which is a reading of the calendar, not of
> adoption. Adoption is already legible from `advanceEpochEnabled` itself, exactly as
> `provenance`'s is from `provenanceLedgerEnabled`. The written reason lands verbatim with
> the row.

⚠ **THE ESCAPE HATCH IS NAMED AND REFUSED.** MEASURED, `spatialSubstrate` is a
`spatialLedgers` sub-key written OUTSIDE `src/domain` — derived in
`src/lib/spatialSubstrateDerive.js` and written at canonize from the store
(`campaignWorldPulseDeferred.js`) — and it is deliberately absent from both manifest lists.
`src/lib/spatialUsage.js` says so in its own words, verbatim at HEAD: *"DOOR 1's
`spatialSubstrate` sidecar is deliberately NOT listed here. The walker governs ONLY
spatialLedgers keys WRITTEN via setSpatialLedger inside src/domain (engine movers)."* **So a
stamp written in the store layer would evade the walker entirely. That is exactly why the
stamp is not written there**, and the evasion is recorded so no future pass discovers it as a
shortcut: the walker is a registration convention, and routing around a registration
convention to save a manifest row is the failure mode the convention exists to prevent.
⭐ **THIS REFUSAL IS ALSO WHY J-EP-6's RATIONALE WAS RESTATED IN REVISION 5 (chair ruling
F5):** a volume cannot refuse a gate-avoidance route here and offer one two sections later.

##### WHAT THE TWO SLICES THEREFORE COST, RE-COSTED AND RE-SPLIT (revision 6, chair ruling G1)

⚠ **THE TOTAL IS UNCHANGED; THE SPLIT MOVED.** Revisions 3–5 costed all of this against
slice B. Under §3b.1b the leaf, the writer, seam edit 9, the +1 import line and the manifest
row are slice A's — because slice A ships under EITHER arm and now depends on them.

| Item | SLICE A (either arm) | SLICE B (Arm A only) |
|---|---|---|
| `pulseKernel.js` | ⭐ **ONE token edit (9) at +0 lines, plus THE ONE import line — the declared J-EP-11 +1**, carrying `stampAdvanceEpochYear` + `tickStreamSeedOf` | TWO token edits (7, 8) at +0 lines; the existing import line GAINS `yearStreamSeedOf` — **+0, because slice A already bought the line** |
| `src/domain/advanceEpochLedger.js` (NEW) | ⭐ ≤ **140** effective — the writer's `latest` half + `tickStreamSeedOf` + explicit `absent` with no default | grows to ≤ **200** — the writer's `byYear` half + `yearStreamSeedOf` + `yearBase` with no default |
| `src/lib/spatialUsage.js` | ⭐ **ONE `EXEMPT_LEDGER_KEYS` row with its written reason** (284 raw lines, unbaselined, far under its 800 layer ceiling — MEASURED). ⚠ **The CQ5-class serialization law moves here with it** | ZERO — the row already exists |
| `src/domain/worldPulse/worldState.js` | ⭐ **ZERO EDITS.** Revision 3's `worldState.js ≤ 25 for the ledger writer` budget is STRUCK — the writer never lived there and could not have | ZERO |

#### ⭐⭐ 3b.1b THE FAMILY-1 ACCESSOR — ITS SOURCE, ITS SELECTION RULE, ITS REACH (chair ruling G1, revision 6)

**THE DEFECT THIS SECTION CURES (§0.3 R13).** `tickStreamSeedOf(worldState, { absent })` was
declared at four sites across four revisions with **no epoch argument, no ledger read, no
spelled body and no threading route**. It is R11's shape — a declared instrument with nowhere
to get its value — in the LARGER half of the side-channel program: FIFTEEN compositions the
volume rules TAKE THE EPOCH, including the two §3b.2 calls "the sharpest member of the whole
program" (`npcLadderContest.js#tieBreak`, which chooses succession winners, and
`demographicsResponses.js#selectResponse`, whose own in-source comment says the draw "CHOOSES
WHAT A CITY DOES for the rest of a campaign"). **RULED (chair, G1): the source is THE STAMPED
LEDGER IN THE `worldState` THE SITE RECEIVES.**

##### THE ACCESSOR, SPELLED

```js
/** THE FAMILY-1 ACCESSOR. Returns the site's own absent-coercion of the world seed, with
 *  THIS TICK's epoch appended when — and only when — the world carries a stamp written at
 *  the tick the world is actually at.
 *
 *  ⭐ THE CURRENT-TICK SELECTION RULE, and it is the whole of the dark contract down here:
 *  the ledger's `latest` is selected ONLY when `latest.tick === worldState.tick`. A dark tick
 *  never writes (stampAdvanceEpochYear returns first on `!epochTerm`), and the next composed
 *  tick is always startingWorldState.tick + 1 (nextWorldStateForPulse), so a stamp written
 *  under a lit flag can never be selected by a dark advance. NO FLAG IS READ HERE, and none
 *  is needed — the tick equality IS the gate.
 *
 *  @param {any} worldState  the world the CALLING STAGE received — see §3b.1b's reach census
 *  @param {{ absent: string|null|undefined }} opts  the site's OWN coercion, REQUIRED, no default
 *  @returns {string|null|undefined} */
export function tickStreamSeedOf(worldState, { absent }) {
  const raw = asObject(worldState).rngSeed;
  const base = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : absent;
  const led = /** @type {{ latest?: { tick?: number, epoch?: string } }} */ (getSpatialLedger(worldState, 'advanceEpoch')) || null;
  const latest = led?.latest || null;
  if (!latest || latest.tick !== num(asObject(worldState).tick, -1)) return base;   // stale or absent ⇒ VERBATIM
  return `${base}${epochSuffix(latest.epoch)}`;
}
```

⚠⚠ **THE `absent` ARM IS BYTE-VERBATIM AND THAT IS A HARD CONSTRAINT, NOT A STYLE NOTE.**
`base` must reproduce the calling site's coercion CHARACTER-FOR-CHARACTER — §3b.3's nine
coercion rows are the specification, and the family-1 rows are §3b.3's rows 1, 2, 5, 6, 7 and
8 (`''` for `str()` and `|| ''`; `'realm'` for the four realm-shaped ones). **The sketch above
shows the SHAPE; the build takes each site's own `absent` and each site's own truthiness
semantics from §3b.3, because `str(0)` is `'0'` while `String(0 || '')` is `''` and the
dormancy suite asserts the literal.** ⛔ **There is no default and no catch-all** — omitting
`absent` is a type error, exactly as §3b.3 rules for the year accessor and J-EP-13 rules for
`yearBase`.

⚠ **THE DELIMITER FAMILY IS NOT UNIFORM AND THE ALIASING CHECK BINDS HERE (§2.3c's `::`
trap).** MEASURED: family-1 sites compose in three delimiter idioms —
`` `${rngSeed}::roads-hazard:${mid}:${now2}` `` (double-colon), `` `${seed}|ladder-contest:resolve:${id}` ``
(pipe), and `realmVerbExecution.js`'s SINGLE-colon `` `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}` ``.
`epochSuffix` renders `::epoch:<e>`, so the realm-verb key becomes
`…::epoch:<e>:realm_verb:<tick>`. **EP-0's delimiter-alias pin must therefore carry a
family-1 row per idiom** and assert that no two of the twenty-five compositions can render
the same string under any epoch — the `fork('a::b')` vs `fork('a').fork('b')` correlation
class, one layer out.

##### ⭐ WHY THE ORDERING GUARANTEES PRESENCE — AND IT IS THE SAME WALK F1 ALREADY PROVED

The stamp lands at **step 4** of §3b.1a's MEASURED ordering table (seam edit 9, `;`-joined
onto `let worldState = { ...nextWorldStateForPulse(startingWorldState, campaign, tickInterval), simulationRules };`
— the line at which the calendar moves and `tick` becomes `current.tick + 1`). **Every
family-1 site sits at step 7 or later**, downstream of `const applied = applyWorldPulseOutcomes({ …, worldState, … })`
and `let memoryState = advanceObligationDecay(applied.worldState, worldState.tick);`. So the
family-1 half rides **the same SIXTY-NINE-rebind span across TWO files that F1 built the
STAMP-SURVIVAL PIN for**, and the same rule binds: ⛔ **ZERO family-1 sites are carried by
prose** — the reach below is a census, and the pin after it is executed.

##### ⭐⭐ THE REACH CENSUS — EVERY FAMILY-1 SITE, MEASURED TO ITS KERNEL SOURCE

**MEASURED at HEAD 32cc17f7, by reading each host's caller chain rather than by assuming the
house spread convention:**

| Read site | Host symbol | The chain that hands it a world | Receives the stamped world? |
|---|---|---|---|
| **RS-5** `roadsKernel.js` | `advanceLitRoads(args)` | `advanceRoads({ …, worldState: prior.worldState, … })` inside `advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoads` ← `assizeKernel.js#advanceNpcGrowthWithFabricAndConsequenceAndLadderAndTraditionsAndRoadsAndCommonsAndAssize({ …, worldState: memoryState, … })` at `pulseKernel.js` | ⭐ **YES** — post-apply, step 8 |
| **RS-9** `npcLadderKernel.js` | `advanceLitLadder({ snapshot, worldState, … })` | `advanceNpcLadder({ …, worldState: prior.worldState, … })` inside `advanceNpcGrowthWithFabricAndConsequenceAndLadder`, same assize chain | ⭐ **YES** — post-apply, step 8 |
| **RS-10** `demographicsKernel.js` | `advanceDemographics({ … })` | `settlementLifecycleKernel.js#advanceSettlementLifecycle` (whose own JSDoc reads `@param {Record<string, unknown>} args.worldState  memoryState (post-apply)`) ← `pulseKernel.js`'s `advanceSettlementLifecycle({ …, worldState: memoryState, … })` | ⭐ **YES** — post-apply, step 8 |
| **RS-11** `demographicsPlans.js` | `advanceDemographicPlans({ … })` | `demographicsKernel.js`'s `advanceDemographicPlans({ …, worldState: moved.worldState, … })` — downstream of RS-10 | ⭐ **YES** |
| **RS-12** `sovereigntyMarketStage.js` | `advanceSovereigntyMarket({ … })` | `advanceSettlementLifecycle`'s `advanceSovereigntyMarket({ …, worldState: hostWorldState, … })` — the SAME `memoryState`, mounted BEFORE demographics | ⭐ **YES** |
| **RS-13 / RS-14 / RS-15** `realmVerbExecution.js` ×3 | `applyRealmVerbOrder({ state, … })` | `applyWorldPulse.js`'s `applyRealmVerbOrder({ state, … })` inside `applyWorldPulseOutcomes`, whose `let state = worldState;` is the walked apply-side world ← `pulseKernel.js`'s `applyWorldPulseOutcomes({ …, worldState, … })` at step 7 | ⭐ **YES on the pulse path** — ⚠ **AND NOT ONLY ON THE PULSE PATH: see the two doors below** |

**Two supporting measurements, so the chain is not an assumption:** `advanceObligationDecay`
(the step-8 host) mutates the world only through `setSpatialLedger` / `dropSpatialLedger` on
the `obligations` key, both of which preserve every sibling sub-key; and
`advanceEnvoyDiplomacyPulse`, the one in-pulse mover that calls `applyWorldPulseOutcomes`
itself, is mounted with `worldState: memoryState` and therefore inherits the stamp too.

##### ⚠⚠ THE TWO DOORS OUTSIDE THE PULSE — NAMED, BECAUSE THE ORDERING WALK CANNOT COVER THEM

**MEASURED: `applyWorldPulseOutcomes` has FIVE call sites, and only ONE is the pulse.** The
others hand it a world the pulse did not compose, and two of them can reach
`applyRealmVerbOrder` and therefore rows 14/15/16:

| Door | Symbol | World it passes | Reaches a family-1 draw? |
|---|---|---|---|
| the pulse | `pulseKernel.js` `applyWorldPulseOutcomes({ …, worldState, … })` | the STAMPED world of this tick | YES — the census above |
| ⚠ **the DM order door** | `applyWorldPulse.js#mintRealmVerbProposal` (`worldState`, `tick = worldState.tick \|\| 0`, `advanceNewsTick: false`) | the COMMITTED world — whose `latest.tick`, if lit, EQUALS its own `tick` | ⭐ **YES** — it mints a realm-verb outcome by construction |
| ⚠ **the DM approval door** | `applyWorldPulse.js#applyWorldPulseProposal` (`worldState: campaign.worldState`) | the COMMITTED world | ⭐ **YES** when the approved proposal is a `realm_verb_order` |
| the party-impact door | `partyImpact.js#applyPartyImpact` (`worldState: built.worldState`) | the COMMITTED world | NO — its outcomes are party impacts, never `REALM_VERB_PAYLOAD_KIND` (recorded so the next auditor finds a ruling) |
| the envoy mover | `envoyPulse.js#advanceEnvoyDiplomacyPulse` (`worldState: tentativeState`) | descends from `memoryState` | in-pulse; covered above |

> ⭐⭐ **THE RULING (chair-signed under G1's "name it" clause; vetoable as J-EP-15).** The two
> DM doors are **IN SCOPE FOR THE SELECTION RULE AND THAT IS CORRECT, NOT AN ACCIDENT.** On a
> lit world, `latest.tick === worldState.tick` holds at both doors — because the last advance
> stamped at exactly the tick the committed world sits at — so a DM order resolves **in the
> epoch the world it acts on is living in.** That is coherent on the directive's own terms
> (the order happens inside a lived present, not outside time), it is STABLE for a given world
> (re-approving the same proposal on the same world draws identically — no wobble, no
> trust-floor breach), and after an undo + re-advance the world is living in a NEW epoch, so a
> re-issued order draws afresh — which is the directive's promise reaching one door further
> than the volume had noticed. ⛔ **AND THE DARK CASE IS CLOSED BY THE SAME RULE:** a world
> that never ran lit has no ledger, so both doors compose today's key
> character-for-character. ⚠ **THE ONE CONSEQUENCE THAT MUST BE STATED RATHER THAN DISCOVERED:
> a world that ran LIT and then has the flag removed keeps a selectable `latest` at its
> current tick, so its DM doors stay epoch-bearing until the next advance moves the tick.**
> That is the SAME property Arm A's `yearStreamSeedOf` already has by design (a lived year
> keeps its weather regardless of the flag, §3b.2's Arm-A block), and it is bounded here to a
> single tick rather than forever. **A pin asserts it in both directions**, so the property is
> recorded rather than found.
>
> ⚠ **WHAT IS NOT RULED HERE, and is a §7b chair-owed row rather than a silent decision
> (row B2):** whether a DM order *re-issued on the SAME world* should itself draw fresh — the
> generate/reroll half of the directive, applied to a DM verb rather than to an advance. EP
> does not change it in either flag state; today two identical orders on the same tick already
> draw identically, which predates this program.

##### ⭐ THE SLICE-A STAMP-SURVIVAL PIN — EIGHT ROWS, THE RETURNED WORLD, AND THE TWO-EPOCH ARM

> ⭐⭐ **THE FAMILY-1 PIN (binding on EP-3 slice A; ONE parameterized suite, the F1 idiom).**
> A **STRICT PASS-THROUGH `vi.mock` spy on `tickStreamSeedOf` at its leaf home
> `src/domain/advanceEpochLedger.js`** — outside every calling module by construction, the
> recorded WR-10 lesson — records `(callSite, returnValue)` for every invocation, attributed
> by CALLING MODULE from the stack frame exactly as §3b.1a rules for the year accessor. Drive
> ONE lit advance and assert, for **EACH of the EIGHT family-1 read sites independently**
> (RS-5, RS-9, RS-10, RS-11, RS-12, RS-13, RS-14, RS-15), that the value the site composed its
> draw key from **carries the epoch stamped at seam edit 9 of that same tick**, and not the
> bare `rngSeed`.

| # | Row | Where it is observed | What the row asserts |
|---|---|---|---|
| 1 | **RS-5** (`roadsKernel.js` → rows 2, 4, and handed on to 10, 11, 12) | the assize chain, post-apply | the returned seed bears `::epoch:` and the epoch equals this tick's `epochTerm` |
| 2 | **RS-9** (`npcLadderKernel.js` → rows 17, 18, 19, 21) | post-apply; ⚠ **the SPLIT READ — slice B's year-anchored second argument must ALSO still be observed at this site once slice B lands** | same |
| 3 | **RS-10** (`demographicsKernel.js` → row 22 upstream) | `advanceSettlementLifecycle`, post-apply | same |
| 4 | **RS-11** (`demographicsPlans.js` → rows 22, 23) | downstream of RS-10 | same, **and the `realmId` SHADOWING is preserved** (§3b.3 row 7) |
| 5 | **RS-12** (`sovereigntyMarketStage.js` → row 24) | `advanceSettlementLifecycle`, post-apply, BEFORE demographics | same |
| 6 | **RS-13** (`realmVerbExecution.js` FORCE_CALAMITY → row 14) | inside `applyWorldPulseOutcomes`, step 7 | same |
| 7 | **RS-14** (`realmVerbExecution.js` FORCE_FOUND_STEADING → row 15) | same | same |
| 8 | **RS-15** (`realmVerbExecution.js` FORCE_RESETTLE → row 16, TICK-FREE) | same | same — ⚠ **and J-EP-10 still binds: EP adds NO tick term here, only the epoch** |
| — | ⭐ **THE RETURNED-WORLD ARM** | on the value `simulateCampaignWorldPulse` RETURNS as `worldState`, and AGAIN after the store commit and a real JSON round-trip | `spatialLedgers.advanceEpoch.latest` equals `{ tick: <this tick>, epoch: <this advance's epochTerm> }` |

**ANTI-VACUITY — THE SAME FLOOR F1 RULED.** Each row asserts it observed **AT LEAST ONE**
accessor call. **A row that observes ZERO calls REDS**, with the message "the fixture does not
reach this site — fix the FIXTURE, never the assertion." ⚠ **A stage the fixture cannot reach
is a STOP-and-report to the chair, never a dropped row** (the banked N3 collector-totality
lesson). ⚠ **RS-13/14/15 need a REALM-VERB OUTCOME in the fixture's `outcomes` array** — they
are DM-order-driven and no organic advance reaches them; that is a fixture requirement stated
here rather than a day-one red.

> ⭐⭐ **THE TWO-EPOCH PIN — THE ONE CHAIR RULING G1 NAMES BY NAME, EXECUTED AND NOT PROSE.**
> From ONE fixed starting world, drive the SAME advance TWICE with two DIFFERENT `advanceEpoch`
> values and capture, per family-1 site, the composed draw key through the spy:
> **(a) LIT — every one of the eight rows composes a DIFFERENT key across the two epochs**, and
> at least the two named consequence sites produce a DIFFERENT OUTCOME
> (`npcLadderContest.js#tieBreak` resolves a different winner; `demographicsResponses.js#selectResponse`
> chooses differently) — the succession and demographic pins §4 already owes, rooted in the
> accessor rather than in hope; **(b) DARK — the same two runs compose BYTE-IDENTICAL keys at
> all eight rows, equal to the LITERAL strings HEAD produces**, under the four hostile seed
> inputs `undefined`, `null`, `''` and a non-string.

**FOUR EXECUTED MUTANTS, each must RED on its own — the same four §3b.1a declares, run over
slice A's OWN rows** (the set is declared once; each slice runs it over the rows it owns):

| Mutant | Plant | Must RED | Must stay GREEN |
|---|---|---|---|
| **(i)** ⭐ | drop the `latest.tick !== worldState.tick` check from the accessor (the naive read) | ⭐ **THE DARK ARM of the two-epoch pin, and fence 5's `latest` direction (ii)** — a previously-lit world's dark advance would compose an epoch-bearing key | the lit arm (it is still epoch-bearing, which is exactly why this mutant needs its own detector) |
| **(ii)** | a wholesale-replacement plant IN `pulseKernel.js` at the `memoryState` seam | rows 1–5 (the post-apply stages) **+ the returned-world arm** | rows 6–8 (they read at step 7, BEFORE the `memoryState` seam) |
| **(iii)** | the same plant ONE FILE OUT, at `applyWorldPulseOutcomes` (`applyWorldPulse.js`) | **ALL EIGHT rows + the returned-world arm** | — |
| **(iv)** | drop the stamp from the returned world AFTER the last family-1 read | the RETURNED-WORLD ARM ONLY | rows 1–8 |

⚠ **(ii) AND (iii) SHARE THE F1 ASYMMETRY DELIBERATELY AND BOTH ARE REQUIRED**, for the same
measured reason: FIFTY of the sixty-nine rebinds sit at or past the `applyWorldPulse.js`
boundary, and that file is the apply-side mount every layer's stages hang from — a GROWTH
surface, not a fixed one. ⭐ **Mutant (i) is slice A's own, and it is the one with no
family-2 twin:** it is invisible to every LIT assertion in the estate and is caught only by
the DARK arm, which is precisely why the dark arm is written as an assertion on the LITERAL
string rather than as a differential.

#### ⭐⭐ 3b.2a THE READ-SITE CENSUS — the census's second half (chair ruling P1, revision 3)

**A COMPOSITION IS WHAT IS DRAWN; A READ SITE IS WHERE THE VALUE MUST BE RE-ROOTED.**
Revision 2 dispositioned twenty-five compositions and named only SOME of the reads that
feed them, which is how §0.3 R9's three misses survived two adversarial passes. The two
denominators are different numbers and both are now frozen: **TWENTY-FIVE compositions ·
TWENTY-TWO runtime read sites.**

**DEFINITION (binding on the walker).** A READ SITE is a runtime expression in `src` that
takes `rngSeed` off a world-shaped object (`worldState` · `state` · `startingWorldState` ·
`campaign.worldState`), however the receiving variable is named. Comments, JSDoc, key-name
string literals in allowlists, and BARE-PARAMETER RECEIVERS (a callee that is HANDED the
value) are NOT read sites — the receivers are listed separately below because they are
where the COERCION lands, and §3b.3 needs both halves.

**MEASURED at HEAD: 68 textual `rngSeed` occurrences in `src` across 30 files; TWENTY-TWO
are runtime read sites.** Each gets a disposition; **a read site with no disposition row
is a build STOP**, the same law the compositions carry.

| # | Read site (symbol home) | Coercion at HEAD | Feeds | Disposition |
|---|---|---|---|---|
| **RS-1** | `pulseKernel.js` — the ONE `createPRNG` root | none (raw interpolation) | THE PULSE ROOT | **THE SEAM** (§3b.1 edit 5) |
| ⭐ **RS-2** | `pulseKernel.js` → `seasonalContextFor({ rngSeed: startingWorldState.rngSeed, … })` | **NONE — raw property read** ⇒ absent interpolates the literal `"undefined"` | **ROW 1, in-pulse** | **NEW IN REVISION 3 (R9).** Arm A: re-root via §3b.1 edits 7+8. Arm B: epoch-invariant, recorded |
| ⭐ **RS-3** | `generosityKernel.js` `const intelSeed = String((worldState)?.rngSeed ?? '')` → `intelEligible(intelSeed, …)` | `String(x ?? '')` ⇒ `''`; ⚠ `0` ⇒ `'0'` | **ROW 13** — SOLE production caller | **NEW IN REVISION 3 (R9).** Arm A: `yearStreamSeedOf(worldState, intelYear, { absent: '' })`. Arm B: unchanged |
| ⭐ **RS-4** | `traditionsKernel.js` → `seasonalSeverityFor(String(asObject(worldState).rngSeed \|\| ''), year, sid)` | `String(x \|\| '')` ⇒ `''` | **ROW 1, second in-engine composer** | **NEW IN REVISION 3 (found by this pass, not by the review).** Arm A: `yearStreamSeedOf(worldState, year, { absent: '' })`. Arm B: unchanged |
| RS-5 | `roadsKernel.js` `const rngSeed = str(asObject(worldState).rngSeed);` | `str` ⇒ `''` | rows 2,3,4,5 — and PASSED as `a.rngSeed` to rows 10,11,12 | family 1 / family 2 split at the composition, per §3b.2 |
| RS-6 | `traditionsKernel.js` (the tradition draw) | `String(x \|\| '')` ⇒ `''` | row 6 | YEAR-KEYED (family 2) |
| RS-7 | `traditions/politics.js` `const rngSeed = String(worldState.rngSeed \|\| '');` | `String(x \|\| '')` ⇒ `''` | rows 7 and 9 (via `claimRoll` and `reexpressed`) | YEAR-KEYED (family 2) |
| RS-8 | `traditions/relations.js` | `String(asObject(w).rngSeed \|\| '')` ⇒ `''` | row 8 | YEAR-KEYED (family 2) |
| RS-9 | `npcLadderKernel.js` `const seed = String(asObject(worldState).rngSeed \|\| '');` | ⇒ `''` | rows 17,18,19,21 (family 1) **and row 20 (family 2)** ⚠ ONE read, TWO families | ⚠ **THE SPLIT READ** — see the note below |
| RS-10 | `demographicsKernel.js` `realmId: typeof … === 'string' ? String(…) : 'realm'` | ⇒ `'realm'` | row 22 upstream | TICK-VARYING (family 1) |
| RS-11 | `demographicsPlans.js` `const realm = String(realmId \|\| asObject(worldState).rngSeed \|\| 'realm');` | ⇒ `'realm'`, `realmId` SHADOWING | rows 22, 23 | TICK-VARYING (family 1) |
| RS-12 | `sovereigntyMarketStage.js` `const realmId = text(worldState.rngSeed) \|\| 'realm';` | ⇒ `'realm'` | row 24 | TICK-VARYING (family 1) |
| RS-13 | `realmVerbExecution.js` FORCE_CALAMITY | `String(state.rngSeed ?? 'realm')` ⇒ `'realm'` | row 14 | TICK-VARYING (family 1) |
| RS-14 | `realmVerbExecution.js` FORCE_FOUND_STEADING | same ⇒ `'realm'` | row 15 | TICK-VARYING (family 1) |
| RS-15 | `realmVerbExecution.js` FORCE_RESETTLE | same ⇒ `'realm'` | row 16 | TICK-FREE — J-EP-10 |
| RS-16 | `townMap/mapDress.js` `const rngSeed = worldState && typeof worldState.rngSeed === 'string' ? worldState.rngSeed : null;` | ⚠ **`null`, AND THE CALL IS SUPPRESSED** — `(season && rngSeed && year != null && settlementId != null) ? seasonalSeverityFor(…) : null` | ROW 1, at VIEW time | **DISPLAY-SURFACE RULE** — never handed `advanceEpoch` |
| RS-17 | `components/map/CauseWalkPanel.jsx` `seedId: worldState?.rngSeed ?? rootId` | `?? rootId` | row 25 | **DISPLAY-SURFACE RULE** — never handed `advanceEpoch` |
| RS-18 | `worldState.js#createDefaultWorldState` `rngSeed: \`world-pulse:${seedPart}\`` | n/a — the WRITER | the root itself | **THE ONE WRITER.** EP adds no second writer; §0.3 R4's campaign-identity derivation is untouched |
| RS-19 | `worldState.js#ensureWorldState` `rngSeed: raw?.rngSeed \|\| base.rngSeed` | `\|\|` fallback to the fresh default | the load normalizer | **UNTOUCHED** — EP never migrates or rewrites the root |
| RS-20 | `lib/surveyorAutonomy.js` `const seed = String(startCampaign?.worldState?.rngSeed ?? '');` | ⇒ `''` | a RECEIPT field, **not a draw** | **NOT A DRAW.** §3c rules the surveyor loop MINTs (J-EP-5); the receipt "gains the epoch beside it" — an ADDITIVE receipt field, never a re-root |
| RS-21 | `lib/crashForensics.js` `if (ws && ws.rngSeed != null) candidate = ws.rngSeed;` | none | a forensics label | **NOT A DRAW.** Deliberately left alone; a crash report naming the STARTING world is correct, and an epoch there would leak a pending value into a log |
| RS-22 | `store/campaignContentBindingSession.js` `\|\| campaign?.worldState?.rngSeed` | third term of a four-term `String(…)` fallback chain | a content-binding PREVIEW fixture seed | **OUT-OF-DENOMINATOR, RULED.** It addresses a GENERATION preview, not a pulse draw; giving it an epoch would make a content-binding preview change under the DM every advance |

⚠ **RS-9 IS THE SHARPEST STRUCTURAL FACT IN THIS TABLE: ONE READ FEEDS BOTH FAMILIES.**
`npcLadderKernel.js` reads the seed ONCE and hands the same bare string cross-module to
`resolveFactionChallenges` (`npcLadderChallenge.js`, row 21) and `advanceContests`
(`npcLadderContest.js`, rows 17/18/19 **and row 20**). Rows 17/18/19/21 are TICK-VARYING
(EP-3 slice A) and row 20 is YEAR-KEYED (EP-3 slice B). **A single re-root at RS-9
therefore CANNOT satisfy both arms**: slice A must hand the contest module a
tick-anchored seed while row 20 wants a year-anchored one. **RULED: RS-9 re-roots to the
TICK-anchored accessor in slice A, and slice B passes the year-anchored value as a
SECOND, separately-named argument to the support pass only** — never by re-reading
`worldState` inside `npcLadderContest.js`, which would mint a twenty-third read site the
walker would then have to carry. Recorded because an implementer who re-roots RS-9 once
and calls slice B done ships row 20 epoch-blind and no pin catches it.

**THE BARE-PARAMETER RECEIVERS (five) — not read sites, but where the coercion lands.**
`seasons.js#seasonalSeverityFor(rngSeed, …)` (uncoerced) · `seasons.js#seasonalContextFor({ rngSeed, … })`
(uncoerced, forwards to the former) · `spatial/intelActs.js#intelEligible(rngSeed, …)`
(`String(rngSeed)` at the template) · `roads/seaRoads.js` and `roads/thirdPartyRansom.js`
(`a.rngSeed`, uncoerced) · `traditions/politics.js#claimRoll(rngSeed, …)` (uncoerced).
**Every one is EDIT-FREE under both arms** — they receive whatever the read site composed,
which is exactly why the read sites are the re-root sites and why a census anchored on the
CONSUMER under-reports.

⚠⚠ **THE NAME COLLISIONS — THERE ARE TWO, NOT ONE, AND THE WALKER'S MANDATORY NEGATIVE
CONTROL IS RE-ANCHORED IN REVISION 4 (chair rulings T4 + T6).** Revision 3 named ONE
(`personaSlicer.js`) and made it the control. MEASURED at HEAD, that was wrong twice: a
SECOND collision exists and was in no disposition bucket, and the named control is anchored
on a module with **no production consumer at all**.

| # | Site | The value | Live in `src`? | Disposition |
|---|---|---|---|---|
| **NC-1** ⭐ | `src/generators/power/economyReconciliation.js` — `rngSeed: stepRng.fork(POWER_STREAM).seed,` inside `createPowerGenerationIntent`'s snapshot literal, and its paired read `const previousRng = setActiveRng(createPRNG(intent.rngSeed));` | a GENERATOR STEP-RNG FORK SEED, never the world root — it descends from the settlement pipeline's step rng, not from `worldState` | ⭐ **YES — THREE production importers** (`src/generators/steps/generatePower.js`, `src/generators/steps/powerEconomyReconcilePass.js`, `src/generators/steps/assembleSettlement.js`) | **OUT-OF-DENOMINATOR**, and ⭐ **THE WALKER'S MANDATORY NEGATIVE CONTROL** (re-anchored here, T6) |
| **NC-2** | `src/domain/ai/personaSlicer.js` — `deps.season({ rngSeed: home?._seed, … })` | a SETTLEMENT `_seed`, not the world root | ⛔ **NO — ZERO importers in `src`** (MEASURED: `grep -rn "personaSlicer" src tests scripts`, excluding the file itself, returns THREE test importers — `personaSlicer.test.js`, `personaSlicerFactionRoster.test.js`, `factionNamePrecedence.test.js` — plus two lint-walker manifest rows and two comment mentions, and NO `src` importer) | **OUT-OF-DENOMINATOR**, retained as a SECONDARY control only; see §7b row B1 |

**WHY NC-1 IS THE RIGHT CONTROL AND NC-2 IS NOT (measured, and it is the pin-vacuity class
this program has banked five times).** A negative control's job is to distinguish a correct
detector from a broken one. NC-2 cannot: nothing in production reaches that expression, so
the assertion "personaSlicer's `rngSeed:` key is not classified as a world root" passes
forever regardless of detector quality — a control that is green by absence rather than by
discrimination. NC-1 discriminates on **three** measured axes at once:

1. **IT IS LIVE.** Three production importers, on the settlement-generation path every world
   runs.
2. **IT IS THE EXACT SYNTACTIC SHAPE OF RS-2**, which is the walker's ninth POSITIVE control
   — `rngSeed: <expr>` as a key in an object literal, with NO coercion. A detector tuned to
   match RS-2 and required NOT to match NC-1 is being asked to tell a WORLD-shaped receiver
   from a step-rng one, which is the actual discrimination the census depends on. NC-2's
   value (`home?._seed`) is a different token entirely and tests nothing the coercion
   patterns do not already test.
3. **IT ALSO EXERCISES THE CONSUMER ARM.** `createPRNG(intent.rngSeed)` is a genuine
   `createPRNG` composition off a `.rngSeed` property read — so the walker's
   "follow the value to its consumer" pass (§3b.2's clause 2) meets a real `createPRNG`
   consumer that must still classify OUT-OF-DENOMINATOR. NC-2 reaches no entropy consumer at
   all.

**Both controls run in both directions**, and **NC-1's is the one whose removal must RED**;
NC-2's is retained because deleting a green assertion is a silently weakened pin, and it is
labelled in-file as the WEAK control with its reason, so no later auditor mistakes it for
discrimination.

**CLOSURE — RE-RUN AND CORRECTED IN REVISION 4 (chair ruling T4).** Sweep D's own closure
sentence claimed it "dispositioned every one" of the 68 occurrences into
{read site · bare receiver · comment/JSDoc · allowlist key literal · writer ·
out-of-denominator}, and NC-1's two lines were in NONE of them — a totality claim with a
hole in it, which is the defect class this volume treats as a defect rather than a
tolerance. **The bucket set is unchanged and NC-1's two lines now sit in
OUT-OF-DENOMINATOR; the twenty-two read sites and the twenty-five compositions are
UNAFFECTED** (a generator step-rng fork is not a world root, so neither denominator moves).
Re-measured at HEAD: `grep -rn "rngSeed" src --include="*.js" --include="*.jsx" | wc -l` →
**68**, across **30** files — both reproduce. Sweep E (bracket-notation `['rngSeed']` /
`["rngSeed"]` and destructured `{ rngSeed }` access across `src`) returned ZERO further
reads and still does.

#### 3b.2 THE SIDE-CHANNEL DISPOSITION — all TWENTY-FIVE, ruled, in TWO FAMILIES

**A composition with no disposition row is a build STOP, not an omission — and the law
covers BOTH families and ALL THREE IDIOMS** (`createPRNG`, `hash01`, `fnv1a32`). This is
the chair's R1 ruling made structural: the denominator is every seeded-entropy draw whose
key roots at `worldState.rngSeed`, however the receiving variable is named and however
many module boundaries the value crosses.

##### FAMILY 1 — TICK-VARYING, NONCE-SAFE: **TAKE THE EPOCH** (14 compositions)

*(Arithmetic, so it can be checked: 25 total = 14 family 1 + 9 family 2 + 1 tick-free
(row 16) + 1 display (row 25).)*

Every one already varies with a term that MOVES within a timeline — an integer tick
(MEASURED: `now2 = Math.max(0, Math.floor(num(args.tick, 0)))`, the TICK not the wall
clock), a week counter, an `episode` that is literally `` `${tick}:${band}` ``, or an id
minted during the advance. They are forward-looking OUTCOME draws; a re-advanced future
must re-draw them, and an already-lived one must not, which the epoch delivers exactly.
They partially self-freshen through their own keys today — but "partially" is not a
contract, and three of them decide things a DM will notice immediately.

| Rows | Sites | Idiom | Re-root site (where the value is READ off `worldState`) |
|---|---|---|---|
| 2, 4 | `roadsKernel.js` roads-hazard, roads-genesis | `createPRNG` | `roadsKernel.js` `const rngSeed = str(asObject(worldState).rngSeed);` |
| 12 | `roads/seaRoads.js` roads-sea:storm | `createPRNG` | same (passed as `a.rngSeed`, **uncoerced at the callee**) |
| 10, 11 | `roads/thirdPartyRansom.js` refuse, outcome | `createPRNG` | same (passed as `a.rngSeed`, **uncoerced at the callee**) |
| 14, 15 | `realmVerbExecution.js` FORCE_CALAMITY, FORCE_FOUND_STEADING | `createPRNG` ×3 (`forkFn`, `:exodus`) | `String(state.rngSeed ?? 'realm')` ×2 |
| 17, 18, 19, 21 | `npcLadderContest.js` aware/bluff/resolve · `npcLadderChallenge.js` challengeDraw | **`hash01`** | `npcLadderKernel.js` `const seed = String(asObject(worldState).rngSeed \|\| '');` — ONE read, handed cross-module to BOTH consumers |
| 22, 23 | `demographicsPlans.js` site · `demographicsResponses.js` selectResponse | **`hash01`** | `demographicsKernel.js` `realmId: typeof … === 'string' ? String(…) : 'realm'` **and** `demographicsPlans.js` `const realm = String(realmId \|\| asObject(worldState).rngSeed \|\| 'realm');` — TWO reads, one shadowing the other |
| 24 | `sovereigntyMarketStage.js` the keyed race | **`hash01`** | `const realmId = text(worldState.rngSeed) \|\| 'realm';` |

##### ⭐⭐ FAMILY 1's RE-ROOT SPEC — BY READ SITE, WITH ITS MEASURED `absent` (chair ruling G1, revision 6)

**THIS TABLE DID NOT EXIST BEFORE REVISION 6, AND ITS ABSENCE IS §0.3 R13.** The family-2
table below has carried a per-site call spelling since revision 3; family 1 — the LARGER half,
fifteen compositions — had a "re-root site" column and no call. **Fifteen compositions live at
EIGHT read sites**, and the accessor is `tickStreamSeedOf(worldState, { absent })` reading the
per-tick `latest` stamp under §3b.1b's CURRENT-TICK SELECTION RULE:

| Compositions | Read site to re-root | The call, with its measured `absent` (§3b.3) | Slice |
|---|---|---|---|
| ROWS 2, 4 (+ 10, 11, 12 by hand-down) | **RS-5** `roadsKernel.js` `const rngSeed = str(asObject(worldState).rngSeed);` | `tickStreamSeedOf(worldState, { absent: '' })` reproducing `str()` — ⚠ `str(0)` is `'0'`, so the coercion is `v == null ? '' : String(v)` and NOT `\|\| ''`. ⚠ **The SAME read also feeds family-2 rows 3 and 5, so slice B adds a SECOND binding beside this one and never re-points it** | **A** |
| ROWS 17, 18, 19, 21 | **RS-9** `npcLadderKernel.js` `const seed = String(asObject(worldState).rngSeed \|\| '');` | `tickStreamSeedOf(worldState, { absent: '' })` — ⚠ **THE SPLIT READ.** Slice A takes the TICK anchor; **row 20 stays epoch-blind until slice B adds its year-anchored SECOND named argument** (§3b.2a's RS-9 ruling) | **A** |
| ROW 22 (upstream) | **RS-10** `demographicsKernel.js` `realmId: typeof … === 'string' ? String(…) : 'realm'` | `tickStreamSeedOf(worldState, { absent: 'realm' })` — ⚠ the guard is a TYPEOF-STRING test, so a numeric seed coerces to `'realm'` at HEAD and must keep doing so | **A** |
| ROWS 22, 23 | **RS-11** `demographicsPlans.js` `const realm = String(realmId \|\| asObject(worldState).rngSeed \|\| 'realm');` | `String(realmId \|\| tickStreamSeedOf(worldState, { absent: '' }) \|\| 'realm')` — ⚠ **`realmId` SHADOWS**, so the re-root must sit INSIDE the existing chain and never replace it; when the caller passed a `realmId` this site draws the caller's value unchanged and RS-10 is where the epoch entered | **A** |
| ROW 24 | **RS-12** `sovereigntyMarketStage.js` `const realmId = text(worldState.rngSeed) \|\| 'realm';` | `tickStreamSeedOf(worldState, { absent: 'realm' })` reproducing `text(v) \|\| 'realm'` (`text` = `typeof v === 'string' && v.length > 0 ? v : ''`) — ⚠ an EMPTY-STRING seed yields `'realm'`, not `''` | **A** |
| ROW 14 | **RS-13** `realmVerbExecution.js` FORCE_CALAMITY `String(state.rngSeed ?? 'realm')` | `tickStreamSeedOf(state, { absent: 'realm' })` — ⚠ `??`, so `0` composes `'0'` and `''` composes `''` | **A** |
| ROW 15 | **RS-14** `realmVerbExecution.js` FORCE_FOUND_STEADING | same | **A** |
| ROW 16 | **RS-15** `realmVerbExecution.js` FORCE_RESETTLE (TICK-FREE) | same — ⛔ **and J-EP-10 binds: EP adds the EPOCH and NEVER a tick term**, in either flag state | **A** |

⚠ **THE ARITHMETIC, so it can be checked: FIFTEEN compositions (fourteen tick-varying + the
tick-free row 16) live at EIGHT read sites**, because RS-5 feeds five of them (two directly,
three by hand-down to `seaRoads.js` / `thirdPartyRansom.js` as `a.rngSeed`) and RS-9 feeds
four. **The receivers need NO edit at all** — they take whatever the read site composed, which
is why this slice is smaller than its row count suggests and why a census anchored on the
CONSUMER under-reports (§3b.2a's binding definition).

⚠ **ROW 19 IS THE SHARPEST MEMBER OF THE WHOLE PROGRAM.**
`npcLadderContest.js#tieBreak` draws `` hash01(`${seed}|ladder-contest:resolve:${contest.id}`) ``
and that jitter CHOOSES THE WINNER of a succession contest. Row 23's own in-source comment
says the last bit there "CHOOSES WHAT A CITY DOES for the rest of a campaign." A living
future in which every succession and every city's response replays identically is not the
feature the owner ordered.

##### ⚠ ROW 16 — THE TICK-FREE COMPOSITION, ITS OWN MEASURED DISPOSITION (chair R3)

`realmVerbExecution.js` FORCE_RESETTLE composes
`` const seed = `${String(state.rngSeed ?? 'realm')}:realm_verb`; `` — **no tick term, no
entity term.** It does NOT inherit family 1's rationale, which its own spelling
falsifies. MEASURED consequence at HEAD, independent of this program: *every* FORCE_RESETTLE
in a campaign's entire life draws from ONE stream, so the second resettle in a world
re-reads the first's draws in the same order. **DISPOSITION: TAKE THE EPOCH, and record
the pre-existing tick-invariance as a SEPARATE observation, not as something EP repairs.**
Rationale: a re-advanced future must re-draw a resettle outcome (family 1's reason), and
the epoch supplies the only varying term this key has ever had. **⛔ EP DOES NOT ADD A
TICK TERM** — that would be a same-seed shift for every existing world that has ever
resettled, in both flag states, which is a THE PROMISE event this directive does not
authorize. Recorded as **J-EP-10**, with a queue row proposing the tick term as its own
owner-gated repair.

##### THE DISPLAY-SURFACE RULE (row 25, and the row-1 caller)

Two rngSeed-rooted draws are RE-DERIVED AT VIEW TIME over already-lived state, with no
access to advance arguments:

- **Row 25 — `discourseKernel.js#realizeCauseWalk`**, fed `seedId: worldState?.rngSeed ?? rootId`
  by `src/components/map/CauseWalkPanel.jsx`; `pick()` is
  `` pool[fnv1a32(`${String(seedId ?? '')}::${key}`) % pool.length] ``, choosing the
  connective wording of a cause walk.
- **Row 1's display caller — `src/domain/townMap/mapDress.js`** (RS-16), whose own header
  documents "SEVERITY — re-derived via `seasonalSeverityFor(worldState.rngSeed, year, settlementId)`".
  ⚠ **REVISION 3 CORRECTION (§0.3 R9): `mapDress.js` is row 1's THIRD caller, not its
  second.** MEASURED, `seasonalSeverityFor` has exactly THREE production callers —
  `seasons.js#seasonalContextFor` (fed by `pulseKernel.js`, RS-2, **the IN-PULSE consumer
  the simulation actually runs on**), `traditionsKernel.js` (RS-4, in-engine), and
  `mapDress.js` (RS-16, view time). Revision 2 named only the display one, which is how
  the in-pulse read went missing through two adversarial passes. **The display-surface
  rule binds RS-16 only; RS-2 and RS-4 are ENGINE re-roots and take the year anchor
  directly.**

> **THE DISPLAY-SURFACE RULE (binding).** A view-time re-derivation over LIVED state must
> read the epoch **THE LIVED STATE WAS DRAWN UNDER**, or read NONE at all. It may NEVER
> read the CURRENT pending epoch, because that repaints a lived past every time the DM
> re-advances — the precise violation of the trust floor this directive exists to
> protect. Under Arm A both take the year anchor (`yearStreamSeedOf(worldState, year)`),
> which is a function of persisted state and therefore stable for a lived year. Under Arm
> B both stay `rngSeed`-rooted and are epoch-invariant. **Neither is ever handed
> `advanceEpoch`.** A source pin asserts `advanceEpoch` appears nowhere under
> `src/components/` and nowhere in `src/domain/display/` or `src/domain/townMap/`,
> EXCEPT the sanctioned accessor import: `yearStreamSeedOf` from the
> advanceEpochLedger leaf, which RS-16's own re-root necessarily places in
> mapDress — the pin's spelling is import-of-the-leaf ALLOWED, direct ledger
> reads and local epoch composition FORBIDDEN. (Chair fix, round 7: the
> F2/G1-law-2 class — a pin must never red a correct build — cured at its
> third address.)

##### FAMILY 2 — YEAR-KEYED, NONCE-HOSTILE (9 compositions) — CHAIR QUESTION Q1

Rows 1, 3, 5, 6, 7, 8, 9, 13 (`createPRNG`) **plus row 20**
(`` hash01(`${seed}|ladder-support:${sid}:${nid}:${year}`) ``, the `hash01` family's one
year-keyed member, which revision 1 could not have placed because it did not know the
family existed). These are a DECLARED LAW, not an accident.
MEASURED verbatim: `seasons.js#seasonalSeverityFor` — "ONE uniform draw off a
tick-invariant fork of the WORLD seed, so every week of the same year reads the same
verdict and replay is exact"; `traditionsKernel.js` — "a TICK-INVARIANT fork of the WORLD
seed (the seasonalSeverityFor pattern)"; `roadsKernel.js` — "The tick-invariant
world-seed cadence draw (§1 law 9)"; `intelActs.js` — "the seasonalSeverityFor world-seed
pattern". They are RE-DERIVED FRESH every tick and never persisted, so a per-advance
epoch flips a lived year's weather mid-year. Worse: `seasonalSeverityFor` has a caller
OUTSIDE the pulse (`src/domain/townMap/mapDress.js`, which documents "SEVERITY —
re-derived via seasonalSeverityFor(worldState.rngSeed, year, settlementId)") — a DISPLAY
surface with no access to advance args, which would dress a different winter than the sim
ran.

##### ⭐ FAMILY 2's RE-ROOT SPEC — BY READ SITE, NOT BY COMPOSITION (chair ruling P1)

Revision 2 costed slice B as "NINE sites re-rooted" against its NINE compositions. **The
edit count is a READ-SITE count, and the two differ**: rows 3 and 5 share RS-5 with family
1, rows 7 and 9 share RS-7, and **row 1 has THREE distinct read sites — RS-2 in-pulse, RS-4
in traditions, RS-16 at view time — of which revision 2 named only the view-time one.**

⚠ **THE FIGURE WAS FOUR IN REVISION 4 AND IS CORRECTED TO THREE HERE (chair ruling F4,
revision 5), WITH THE FOURTH ITEM RECLASSIFIED RATHER THAN DELETED.** The fourth item that
sentence counted was "the pulse's own `seasonClock` fold" — and it is **NOT A READ SITE under
§3b.2a's own binding definition**, which says a read site "takes `rngSeed` off a world-shaped
object." MEASURED, `const seasonClock = seasonsOn ? seasonForTick(worldState.calendar.elapsedWeeks) : null;`
reads `calendar.elapsedWeeks`, never `rngSeed`. **It is seam edit 7 — RS-2's OWN re-root host
line**, not a fourth address, so counting it doubled RS-2. The three-row table below was right
and the sentence introducing it was wrong; MEASURED at HEAD, `seasonalSeverityFor` has
exactly THREE production callers (`seasons.js#seasonalContextFor` fed by `pulseKernel.js`,
`traditionsKernel.js`, `townMap/mapDress.js`), which is the independent confirmation. **The
frozen READ-SITE denominator of TWENTY-TWO is UNAFFECTED** — no site was added or removed,
only a miscount of one site's homes. This is the count-slip family P4, P7, T3 and T5 each
closed, surviving in the one sentence that introduced the table it contradicted; §7a's rule
binds here too — *a summary sentence disagreeing with the table is a defect in this volume,
not a judgement call.*

The corrected spec:

| Composition | Read site(s) to re-root | The Arm-A call, with its measured `absent` | `yearBase` (§0.3 R12) | Slice |
|---|---|---|---|---|
| **ROW 1** (`::season:${year}:${settlementId}`) | ⭐ **RS-2** (`pulseKernel.js`, the IN-PULSE consumer) | via §3b.1 edits 7+8: ⭐ `yearStreamSeedOf(worldState, seasonClock.year, { absent: undefined, yearBase: 1 })` — **`worldState`, NOT `startingWorldState`** (§0.3 R11: the pre-advance world cannot carry the year the advance is entering), and **`undefined`, not `''`**, because the site is UNCOERCED at HEAD and the dormancy proof must reproduce the literal `"undefined"` spelling | **1** — `seasonForTick(weeks).year` | B, **+1 line (J-EP-11)** |
| **ROW 1** | ⭐ **RS-4** (`traditionsKernel.js`) | `yearStreamSeedOf(worldState, year, { absent: '', yearBase: 1 })` | **1** — `clock.year` from `seasonForTick` | B |
| **ROW 1** | **RS-16** (`mapDress.js`, view time) | `yearStreamSeedOf(worldState, year, { absent: null, yearBase: 1 })` — and the EXISTING `rngSeed &&` guard must be preserved verbatim, so an absent seed still SUPPRESSES the call rather than composing one | **1** | B, DISPLAY-SURFACE RULE |
| ROW 3, ROW 5 | RS-5 (`roadsKernel.js`) | `yearStreamSeedOf(worldState, year, { absent: '', yearBase: 1 })` — ⚠ the SAME read also feeds family-1 rows 2/4 and is PASSED to 10/11/12, so slice B must add a second binding beside `rngSeed`, never re-point it | **1** — `num(clock.year, 1)` | B |
| ROW 6 | RS-6 (`traditionsKernel.js`) | `{ absent: '', yearBase: 1 }` | **1** | B |
| ROW 7, ROW 9 | RS-7 (`traditions/politics.js`) | `{ absent: '', yearBase: 1 }` — one read, two compositions; the `year` is handed down from `traditionsKernel`'s `clock.year` | **1** | B |
| ROW 8 | RS-8 (`traditions/relations.js`) | `{ absent: '', yearBase: 1 }` — same hand-down | **1** | B |
| **ROW 13** (`::intel-trade:${x}:${y}:${year}`) | ⭐ **RS-3** (`generosityKernel.js`) — the SOLE production caller of `intelEligible` | `yearStreamSeedOf(worldState, intelYear, { absent: '', yearBase: 0 })`, replacing `String((worldState)?.rngSeed ?? '')`. ⚠ The `absent` must reproduce `?? ''` semantics, NOT `\|\| ''`: a numeric `0` seed composes `'0'` today and must keep composing `'0'` | ⭐ **0** — `intelYearOf(weeks)` = `floor(weeks/52)`, NO `+1` | B |
| **ROW 20** (`\|ladder-support:${sid}:${nid}:${year}`) | **RS-9**, the SPLIT READ | passed as a SECOND named argument to the support pass only — see the RS-9 ruling in §3b.2a | ⭐ **0** — `npcLadderContest.js#yearOf(weeks)` = `floor(weeks/52)`, NO `+1` | B |

⚠⚠ **THE `yearBase` COLUMN IS NEW IN REVISION 4 AND IT IS NOT DECORATION (§0.3 R12,
J-EP-13).** MEASURED, rows 13 and 20 name the same lived year with a number ONE LOWER than
the other seven. A slice-B implementer who passes each caller's own `year` straight into a
map keyed on the calendar year re-roots seven rows correctly and leaves **rows 13 and 20
reading a key that is never present** — the accessor returns the bare root, the composition
still works, every dormancy pin stays green, and two of the nine year-keyed draws are
silently epoch-blind forever. **The argument is REQUIRED with no default** (omitting it is a
type error, exactly as `absent` is), and the census walker's classification gate asserts
every family-2 row declares one.

**So slice B's true edit surface is EIGHT read sites (RS-2, RS-3, RS-4, RS-5, RS-6, RS-7,
RS-8, RS-16) plus RS-9's second argument — not "nine sites".** The count moved because
the unit moved; the compositions are still nine.

> **ARM A (RECOMMENDED) — THE YEAR ANCHOR.** The year-keyed family reads the epoch of the
> advance that FIRST ENTERED that year. Home: `spatialLedgers.advanceEpoch =
> { byYear: { '<canonical 1-based year>': '<epoch>' } }` — the L4-sanctioned conditional
> sub-key, ONE writer, drop-when-absent, bounded by product scope (sub-century: ≤ ~100 rows
> of ~14 bytes). ⭐ **`current` IS STRUCK IN REVISION 4 (J-EP-12): it had no reader and would
> have been a fourth flag-dark leak surface.** Accessor
> `yearStreamSeedOf(worldState, year, { absent, yearBase })` returns the site's own `absent`
> coercion of `rngSeed` when the ledger is absent and
> `` `${rngSeed}${epochSuffix(byYear[String(year + (1 - yearBase))])}` `` when present. Undo
> restores the map with the world, so a lived year keeps its weather and every year the undo
> un-lived draws fresh — the trust floor and the living future, both. **⭐ And a year lived
> BEFORE the flag was ever lit has no key at all, so lighting the flag repaints NO already-lived
> year — a property worth stating, because it is what makes EP-3 slice B safe to light on a
> world with history.** Cost: one sub-key, ⭐ **ONE WRITER WITH ONE MEASURED CALL SITE INSIDE
> `pulseKernel.js` (§3b.1a — revision 3 declared this writer and gave it nowhere to run,
> §0.3 R11)**, one accessor, **EIGHT READ SITES re-rooted plus RS-9's second argument**
> (revision 3's corrected unit — the NINE compositions live at eight reads, and one of
> those reads is inside `pulseKernel.js`), **THREE kernel token edits plus a declared +1
> line (J-EP-11)**, ONE `EXEMPT_LEDGER_KEYS` row in `src/lib/spatialUsage.js`, and TWO
> display seams (`mapDress.js` must receive `worldState`, not a bare `rngSeed`, **and keep
> its existing call-suppression guard verbatim**; `CauseWalkPanel.jsx`'s `seedId` takes the
> display-surface rule).
> **ARM B — EPOCH-INVARIANT BY DESIGN.** Declared "the climate belongs to the starting
> world". Zero new state, zero display seam; cost is one visible coherence tell — a DM
> re-advancing a decade sees the same winters, the same festivals, the same NPC road
> rhythms.

**⭐ Q1 RE-COSTED AGAINST THE LARGER MEMBERSHIP (chair ruling R1).** The `hash01` family's
arrival SHARPENS the Arm A recommendation rather than weakening it, for a measured
reason: **ELEVEN compositions are new in revision 2 (rows 15 and 16 from R3's split, rows
17–24 from the `hash01` family, row 25 from the `fnv1a32` one), and TEN of the eleven are
TICK-VARYING or tick-free** — they land in family 1, which Arm B does not touch. Under
Arm B the year-keyed nine keep the old weather AND the fourteen tick-varying ones
re-draw — a coherent split. Under Arm A everything re-draws with the year anchor holding
lived years stable. The one new member that lands in family 2 is row 20 (ladder-support),
and the one that lands nowhere is row 25 (display). The tell Arm B accepts is therefore
narrower than revision 1 implied, but
Arm A remains the recommendation: a year anchor is the only construction under which the
DISPLAY-SURFACE RULE has a state-derived value to read at all, and without it `mapDress`
and `CauseWalkPanel` must be declared permanently epoch-blind by fiat.

Arm A is EP-3's charter. **EP-1 and EP-2 ship under EITHER arm** — Q1 does not block the
seam. **EP-3's family-1 half (fourteen tick-varying re-roots plus the tick-free row 16 —
fifteen compositions) ships under EITHER arm too**, which is new in revision 2: it was
previously entangled with Q1 and is not.

⚠⚠ **AND REVISION 6 STATES WHAT THAT CLAIM COSTS, BECAUSE IT WAS FREE ONLY WHILE THE FAMILY-1
ACCESSOR HAD NO SOURCE (chair ruling G1, §0.3 R13).** Slice A ships under either arm — but it
now needs a STAMP, and the stamp's writer, leaf, seam edit 9, +1 import line and
`EXEMPT_LEDGER_KEYS` row lived in slice B, the Q1-GATED one. **A slice that ships under either
arm cannot depend on a slice that ships under one.** Therefore those five items MOVE INTO
SLICE A (§3b.1a's leaf table, §3b.1's seam table, J-EP-14), and the writer's `byYear` half
stays in slice B. ⭐ **Under Arm B, slice B never builds, so `byYear` is never written and the
lit ledger is `{ latest }` alone** — no dead persisted sub-key under the declined arm, which is
exactly the test J-EP-12 applied to `current`. **The claim survives intact and is now
buildable; before revision 6 it was buildable only because slice A did nothing.**

##### THE OUT-OF-DENOMINATOR CLASS, ruled here and NOT epoch-bearing

Roots that are ENTITY-ADDRESSED rather than world-addressed — `politics.js`
`` `${settlementSeedOf(settlement)}::tradition:owner` `` and
`` `${rec.id}::tradition:drift` ``, `customFounding.js` `` `${id}::custom:window` ``,
`traditions/genesis.js` `` `${settlement._seed ?? settlement.id ?? …}::tradition:genesis` ``,
`crossSettlementConflicts.js` `` `xconflict:${idA}:${idB}:${relType}` ``,
`mutateEntities.js` `` `successor:${event.id}:${name}` ``, and the whole
`src/domain/display/` `fnv1a32` prose-picker family (`marketPrices`, `newsBody`,
`settlementRumors`, `newsVoice`, `guidanceNotes`, `stateProse/stateProseKernel`,
`grammarNews#grammarReceipt` — MEASURED, its `seed` argument is a `sourceEventId` at
every one of its six call sites) plus `townMap/massing.js#hashUnit` and
`townMap/glyphAssign.js`. **VERIFIED at HEAD: none of them reads `worldState.rngSeed`**
(the 68-occurrence token census names every file that does, and none of these appear).
They are epoch-invariant BY CONSTRUCTION. **That is CORRECT for identity facts** (who
succeeds whom given the same event id must not wobble) and is recorded so the next
auditor finds a ruling, not a fresh bug.

##### ⭐⭐ THE ENTROPY-ROOT CENSUS WALKER (EP-0's structural-prevention instrument)

**RE-CHARTERED IN REVISION 2 (chair ruling R1). It is NOT a `createPRNG` census.**
Revision 1 specified a walker that caught "the inline `createPRNG(...rngSeed...)` form AND
the two-line `const seed = …rngSeed…` form" — MEASURED, that detector is blind to all
THREE spellings the `hash01` family actually uses (`const realm =`, `const realmId =`,
and a bare `seed` string handed across a module boundary to a non-`createPRNG` consumer),
so the instrument revision 1 called "what makes R1 un-repeatable" did not close its own
class. `tests/lint/entropyRootCensus.walker.test.js` instead:

1. **ANCHORS ON THE READ, NOT THE CONSUMER.** The detector finds every site in `src` that
   reads `rngSeed` off a world-shaped object, **whatever the receiving variable is
   called.** ⚠ **THE POSITIVE-CONTROL SET IS WIDENED TO NINE SPELLINGS IN REVISION 3
   (chair ruling P1)** — revision 2 froze six spellings plus two bare receivers, and
   **NEITHER of R9's two review-found reads nor the third this pass found was among
   them**, so the instrument built to make R1 un-repeatable was blind to three reads
   feeding its own rows. The frozen set is now:
   `str(asObject(worldState).rngSeed)` · `String(asObject(worldState).rngSeed || '')` ·
   `String(worldState.rngSeed || '')` · `String(state.rngSeed ?? 'realm')` ·
   `text(worldState.rngSeed) || 'realm'` ·
   `String(realmId || asObject(worldState).rngSeed || 'realm')` ·
   `typeof asObject(worldState).rngSeed === 'string' ? String(…) : 'realm'` ·
   ⭐ **`String((worldState)?.rngSeed ?? '')`** (RS-3, the `??` spelling — distinct from
   `||` for `0` and `''`) · ⭐ **a RAW UNCOERCED PROPERTY READ IN AN ARGUMENT-OBJECT
   POSITION, `rngSeed: startingWorldState.rngSeed`** (RS-2 — the spelling with NO
   coercion at all, which every regex written around a coercion wrapper misses by
   construction) — plus the FIVE bare-parameter receivers of §3b.2a and
   `worldState.js`'s two writer/normalizer reads. **One executed positive control per
   spelling** — a detector that matches nothing exits 0.
   ⭐ **AND TWO NEGATIVE CONTROLS, THE MANDATORY ONE RE-ANCHORED IN REVISION 4 (chair
   ruling T6).** **MANDATORY:** `economyReconciliation.js`'s
   `rngSeed: stepRng.fork(POWER_STREAM).seed` — the SAME argument-object shape as positive
   control #9 (RS-2), on a LIVE module with three production importers, whose paired
   `createPRNG(intent.rngSeed)` also exercises the consumer arm — must NOT match.
   **SECONDARY (WEAK, labelled so in-file):** `personaSlicer.js`'s
   `{ rngSeed: home?._seed, … }` must NOT match either; ⚠ MEASURED, that module has ZERO
   importers in `src`, so its control passes by ABSENCE rather than by discrimination and
   may never be the only one (§3b.2a, §7b row B1). A detector that classifies an
   entity-addressed or step-rng-addressed seed as a world root would hand `mapDress`-class
   display surfaces an epoch, which the DISPLAY-SURFACE RULE forbids by name.
2. **FOLLOWS THE VALUE ACROSS MODULE BOUNDARIES TO EVERY CONSUMER**, of which there are
   three and the walker names all three: `createPRNG`, `hash01`, `fnv1a32`. A read whose
   value reaches a fourth consumer REDS with the message "a new entropy idiom joined the
   family — classify it, then extend this walker."
3. **CLASSIFIES EVERY COMPOSITION** into the closed set
   {TICK-VARYING, YEAR-KEYED, TICK-FREE, DISPLAY, OUT-OF-DENOMINATOR} — revision 1's
   four-class
   taxonomy of revision 1 had no home for a keyed-race draw or for row 16, and both now
   have one. A row that classifies TICK-VARYING but calls `yearStreamSeedOf` REDS, and
   vice versa.
4. **IS A SHRINK-ONLY INVENTORY WITH TWO BASELINES, NOT ONE (revision 3).** Baseline A:
   the **twenty-five** measured compositions across sixteen modules. Baseline B: the
   **twenty-two** measured READ SITES of §3b.2a, each with its coercion string and its
   disposition. A new composition OR a new read landing unclassified REDS; both baselines
   may only shrink. **Revision 2 carried only baseline A**, which is precisely why three
   reads could go missing while the composition count reproduced exactly — the instrument
   could not have caught its own gap.
5. **CARRIES THE CLOSURE RECORD** in-file so the next auditor can RE-RUN the closure
   rather than re-derive it. ⚠ **THE FIGURES ARE RE-RUN AT HEAD IN REVISION 3 (chair
   ruling P7) AND THREE OF THEM WERE WRONG.** A closure record that reds on re-run defeats
   its own purpose, so each figure below carries its exact executable command:

   | Figure | Revision 2 said | **MEASURED at HEAD 32cc17f7** | Command |
   |---|---|---|---|
   | `rngSeed` occurrences in `src` | 68 | **68 — REPRODUCES** | `grep -rn "rngSeed" src --include="*.js" --include="*.jsx" \| wc -l` |
   | `createPRNG(` sites in `src/domain` | 38 | ⚠ **37 — CORRECTED** | `grep -rn "createPRNG(" src/domain --include="*.js" \| wc -l` |
   | `hash01` consumer modules in `src` | 13 | ⚠ **TEN — CORRECTED IN REVISION 4 (T5): the old command counted MENTIONS, not CALLS** | `grep -rn "hash01(" src --include="*.js" --include="*.jsx" \| grep -v "function hash01(" \| cut -d: -f1 \| sort -u \| wc -l` |
   | hash-helper definitions in `src` | 31 | ⚠ **32 — CORRECTED** | `grep -rnE "function (fnv1a32\|hash01\|hashUnit\|hash32\|fnv1a)" src \| wc -l` |
   | `generateSeed()` call sites in `src` | "8" | ⚠ **8 TEXTUAL HITS, 5 REAL CALL SITES — CORRECTED**: `generateSettlementPipeline.js` ×3 (two further hits are PROSE COMMENTS), `settlementSlice.js` (via `eng.generateSeed()`), `instantWorldBody.js`; the eighth hit is the DEFINITION in `prng.js` | `grep -rn "generateSeed()" src --include="*.js" --include="*.jsx"` |
   | `createPRNG(` sites in `src` (whole tree) | not stated | **47** — recorded so the domain figure has a denominator | `grep -rn "createPRNG(" src --include="*.js" --include="*.jsx" \| wc -l` |
   | READ SITES (§3b.2a) | not stated | **22** | the §3b.2a table is the record |

   ⭐ **THE `hash01` FIGURE, SPELLED OUT (chair ruling T5, revision 4).** Revision 3 marked
   this figure "REPRODUCES" and it did — the recorded command returns 13 exactly as written.
   **The command and the LABEL disagreed**, which is the same defect one level subtler than
   the `generateSeed()` slip below: `grep -rl "hash01"` counts modules that MENTION the
   token, and a "consumer module" is one that CALLS it. Re-measured at HEAD, the three
   populations are:
   - **13 modules mention `hash01`.**
   - **12 contain the string `hash01(`** — but TWO of those are the DEFINITION sites
     (`src/domain/region/contestMath.js` `export function hash01(text)` and
     `src/domain/worldPulse/relationshipRuleHelpers.js` `function hash01(text)`), neither of
     which calls it.
   - ⭐ **TEN actually CALL it:** `region/contestOverThirdParty.js` ·
     `worldPulse/demographicsMigration.js` · `demographicsPlans.js` ·
     `demographicsResponses.js` · `grammarNews.js` · `npcLadderChallenge.js` ·
     `npcLadderContest.js` · `populationDynamics.js` · `relationshipRulesAdversarial.js` ·
     `sovereigntyMarketStage.js`.
   The thirteenth module is `src/domain/worldPulse/settlementStrategy.js`, which IMPORTS and
   RE-EXPORTS `hash01` ("imported for parity with the contest fork recipe") and never invokes
   it — so the old figure would also have gone SHRINK-ONLY-VACUOUS on a comment deletion.
   **The corrected command reproduces at TEN and is the one the walker freezes.**

   ⚠ **THE `generateSeed()` FIGURE IS THE INSTRUCTIVE ONE:** a bare hit count over a
   symbol that also appears in prose and in its own definition over-reports by 60%. The
   record states HITS and CALL SITES separately, and the walker asserts the CALL-SITE
   figure by excluding comment lines and the defining `export function` — with an executed
   control that plants a `generateSeed()` mention inside a comment and asserts the count
   does NOT move.

#### 3b.3 ⭐ PER-SITE FALLBACK FIDELITY IS REQUIRED (chair ruling R5)

Revision 1 budgeted "each re-rooted site is one line" and offered ONE accessor pair
(`tickStreamSeedOf` / `yearStreamSeedOf`) returning `worldState.rngSeed` verbatim.
**MEASURED, the re-root targets carry NINE DISTINCT ABSENT-SEED COERCIONS plus ONE
CALL-SUPPRESSION that is not a coercion at all — TEN behaviours in nine coercion rows**
(revision 2 tabled SEVEN plus a catch-all "whatever the caller passed" that named no
caller — the row chair ruling P1 required be resolved). A verbatim-returning accessor
SHIFTS THE STREAM at every site that coerces — **EIGHT of the ten**, every row below
except row 9 and the suppression, both of which read the raw value already — so the
dormancy claim "ledger absent ⇒ accessors return rngSeed ⇒ all compositions
byte-identical" is FALSE for eight of them:

| # | Coercion at HEAD | Read sites | Absent/non-string ⇒ |
|---|---|---|---|
| 1 | `str(v)` = `v == null ? '' : String(v)` | RS-5 `roadsKernel.js` (→ rows 2,3,4,5 and, uncoerced onward, 10,11,12) | `''` |
| 2 | `String(asObject(worldState).rngSeed \|\| '')` | RS-4 + RS-6 `traditionsKernel.js`, RS-8 `traditions/relations.js`, RS-9 `npcLadderKernel.js` | `''` (also for the EMPTY STRING and for `0`) |
| 3 | `String(worldState.rngSeed \|\| '')` | RS-7 `traditions/politics.js` | `''` |
| 4 | ⭐ **`String((worldState)?.rngSeed ?? '')`** | ⭐ **RS-3 `generosityKernel.js` → row 13** | `''` for null/undefined ONLY — ⚠ `0` ⇒ `'0'` and `''` ⇒ `''`, so it is NOT interchangeable with row 2 |
| 5 | `String(state.rngSeed ?? 'realm')` | RS-13/14/15 `realmVerbExecution.js` ×3 | `'realm'` (⚠ NOT `''`) |
| 6 | `text(v) \|\| 'realm'` where `text` = `typeof v === 'string' && v.length > 0 ? v : ''` | RS-12 `sovereigntyMarketStage.js` | `'realm'` |
| 7 | `String(realmId \|\| asObject(worldState).rngSeed \|\| 'realm')` | RS-11 `demographicsPlans.js` | `'realm'`, with `realmId` SHADOWING |
| 8 | `typeof … === 'string' ? String(…) : 'realm'` | RS-10 `demographicsKernel.js` | `'realm'` |
| 9 | ⭐ **NO COERCION — a raw property read in an argument-object position** | ⭐ **RS-2 `pulseKernel.js` → `seasonalContextFor` → row 1** | ⚠ **the literal string `"undefined"`** is interpolated into the draw key. The NINTH coercion row, and revision 2's table did not carry it |
| — | ⚠ **CALL SUPPRESSED (not a coercion at all)** | RS-16 `mapDress.js` — `typeof … === 'string' ? … : null`, then guarded `(season && rngSeed && …) ? seasonalSeverityFor(…) : null` | **NO DRAW HAPPENS.** The TENTH behaviour and the only non-coercion one: severity stays `null` and no key is composed. An accessor that returns a fallback string here would CREATE a draw where HEAD makes none — a stream that did not exist before, which no dormancy fence keyed on string equality can see |

⚠ **THE "WHATEVER THE CALLER PASSED" ROW IS RETIRED.** Revision 2's eighth row named four
callees (`seaRoads.js`, `thirdPartyRansom.js`, `intelActs.js`, `seasons.js`) and said only
"whatever the caller passed" — which §3b.3's own explicit-argument rule forbids, because
an accessor cannot take an explicit `absent` argument for a coercion nobody has written
down. **All four are now resolved to their callers:** `seaRoads.js` and
`thirdPartyRansom.js` receive RS-5's `str()` output (row 1 above); `intelActs.js` receives
RS-3's `?? ''` output (row 4); `seasons.js#seasonalSeverityFor` receives RS-2's UNCOERCED
read (row 9), RS-4's `|| ''` (row 2), or RS-16's suppressed call (the last row) depending
on which of its THREE callers is running.

**THE RULE.** The accessor takes each site's OWN absent-seed coercion as an EXPLICIT
argument — `tickStreamSeedOf(worldState, { absent })` (⭐ **whose SOURCE, SELECTION RULE and
BODY are §3b.1b's, new in revision 6 — before it, this signature had none, §0.3 R13**) /
`yearStreamSeedOf(worldState, year, { absent, yearBase })`
— or, if the chair prefers, PER-FAMILY accessors that each reproduce one coercion
exactly. **There is no default.** Omitting the argument is a type error, not a fallback:
this is §1.4's own law ("absent ⇒ the term is not concatenated at all, NEVER `epoch:0`")
applied one layer out, and it needs the same explicit spelling.

**THE DORMANCY PROOF IS PER-SITE, NEVER GLOBAL.** EP-3's dormancy pin is a table-driven
suite that, for EACH of the twenty-five compositions independently, composes the key with
the ledger ABSENT and asserts it equals the LITERAL string that site produces at HEAD —
including the four hostile inputs `undefined`, `null`, `''` and a non-string — so a
coercion drift reds on the row that drifted. A single "all compositions byte-identical"
argument is exactly the vacuity the receipt-vacuity rules forbid.

### 3c UNDO, BACKTRACK, AND THE LIVED-PAST LAW

**A pulseHistory entry, once written and committed, is NEVER rewritten.** The epoch it
carries is the address of the future lived from it. Backtrack does not edit the past; it
DISCARDS a suffix of it. Loading a save shows the same history it always showed, because
nothing in this program mutates a committed record. **Branching model:
LINEAR-WITH-DISCARD** (Q2, J-EP-8) — the discarded timeline is not retained, not
diffable, not restorable.

| # | Fork point | Store symbol | Epoch behaviour |
|---|---|---|---|
| 1 | **Undo the last advance** (primary) | `undoLastPulse` → `runUndoLastPulse` | **NOTHING IS OWED.** MEASURED: undo does not splice a record out of an array — it restores the whole pre-advance `worldState` via `restorePulseSnapshotOnDraft`, and that snapshot carries the pre-advance `pulseHistory`. The undone entry and its epoch vanish with the world; the next advance mints fresh. ⚠ `pulseUndoStack` is SESSION-ONLY (`PULSE_UNDO_CAP = 10` per campaign, absent from `partialize`) — the headline story is reload-fragile TODAY, independent of this program (Q2 note) |
| 2 | **Undo the last applied proposal** | `undoLastProposalApply` → `runUndoLastProposalApply` | **NOTHING IS OWED, and the epoch must not disturb it.** It rewinds an adjudication; the tick does not move. The only coupling is `runUndoLastPulse`'s ring-coherence prune (`entry.advanceDepth <= depth`); EP touches neither `advanceSeqByCampaign` nor `proposalUndoStack`. Pinned as a negative |
| 3 | **Abandon a PAUSED advance** (reload-safe) | `parkedIntervalUndoSnapshot` via `canUndoLastPulse` / `runUndoLastPulse` | **THE WHOLE advance's epoch is invalidated, never half of it.** Abandoning restores `preSnapshot.worldState`, which predates the epoch; the cursor and its `advanceEpoch` are cleared with it |
| 4 | **Resume a paused advance with different verdicts** | `resolveIntervalMajors` → `runResolveIntervalMajors` | **THE CONSTRAINT, NOT THE OPPORTUNITY: the SAME epoch is reused, never re-minted.** The resume RE-DERIVES the paused tick from the cursor's pre-tick inputs and must land byte-identically to the pause's committed minors — the invariant `RESIDUE_STRIP_SITES` / `assertNoResidueLeak` exist to protect. Threaded exactly like `now`: `options.epoch \|\| cursor.advanceEpoch \|\| null` |
| 5 | **Revert a settlement to a version snapshot** | `revertToSnapshotAction` (DB column `version_history`) | **OUT OF SCOPE, recorded so.** It restores ONE settlement's dossier, never `campaign.worldState`; it is the only durable per-entity walk-back in the product and cannot carry an advance epoch. A negative pin asserts it never gains one |

**THE CONSUMER TABLE — every non-committing or derived caller, each ruled.**

| Consumer | Symbol chain | Epoch ruling |
|---|---|---|
| ⭐ **The rules-dialog PREVIEW (USER-FACING; added by chair ruling R2)** | `SimulationRulesDialog.jsx` → `campaignWorldPulseSlice.js#previewCampaignWorldPulse` → `campaignWorldPulseDeferred.js#runPreviewCampaignWorldPulse` → `advanceCampaignWorld.js#previewCampaignWorldPulse` → `runWithPinnedContent(args, false)` → `simulateCampaignWorldPulse({ …pulseArgs, commit })` | **INHERIT, NEVER MINT — it must be threaded the SAME epoch the committed advance would use.** Predicting the actual future is its entire job |
| The forecast | `forecastRun.js` (forecast over drained clones) | **INHERIT, NEVER MINT** — a forecast that mints stops predicting the advance it forecasts; it receives the current pending epoch or `null` |
| The R-18 paranoia re-run | `simulateCampaignWorldInterval(cloneJson(multiTickArgs))` + diff | **FREE** (args-borne; an ambient epoch would red it on every advance) |
| Catch-up | `runCatchUpCampaignWorld` | **MINT** (J-EP-5) — advances a world not yet lived |
| Surveyor autonomy | `AutonomyPanel.jsx`'s loop → `lib/surveyorAutonomy.js#runAutonomousAdvance` | **MINT** (J-EP-5); its receipt already carries `String(startCampaign?.worldState?.rngSeed ?? '')` and gains the epoch beside it |

⚠ **THE PREVIEW IS A THREADING JOB, NOT A ONE-LINER — MEASURED.** It does NOT travel
through `advanceInterval.js`'s `tickArgs`, where revision 1 threaded the value: the
deferred body calls the domain function directly with
`{ campaign: previewCampaign, saves, interval, now, customContent }`. The epoch must be
added to THAT literal, sourced from the same place the committed advance sources it —
the campaign's pending epoch (`worldState.pausedAdvance?.advanceEpoch`) or `null`. The
preview also builds `previewCampaign = cloneJson(campaign)` and may overwrite
`worldState.simulationRules` from `options.simulationRules`, so **§2.3b's kernel flag
read sees the PREVIEWED rules, not the campaign's** — which is correct and is the
what-if the dialog exists for, and is pinned as such.

**⭐ THE PIN — ITS PROJECTION IS NAMED AND ITS EXCLUSIONS ENUMERATED (chair rulings R2 +
P9, executed, BOTH flag states).** Revision 2 said "over the compared projection" and
named no projection, which is the receipt-vacuity class this volume forbids elsewhere: the
two runs differ by construction, so an unnamed projection is either unexecutable or
silently over-broad. **MEASURED at HEAD, the difference is exactly one field.** The token
`commit` appears in `pulseKernel.js` at precisely TWO places — the destructured signature,
and `committed: commit` inside the `pulseRecord` object literal. There is no `if (commit)`,
no `commit ?`, no `commit &&`, no `!commit` anywhere in the file, and
`runWithPinnedContent` does nothing but forward it. **`commit` is therefore a RECORD LABEL,
not a control-flow fork**, and preview and advance produce the same world with one
differing byte-level field.

> ⭐⭐ **STATED AS A FACT, NOT AS A HOPE (anomaly A-P3-3, recorded by chair ruling T4's
> companion clause, revision 4).** **AT HEAD, `previewCampaignWorldPulse` AND A COMMITTED
> ADVANCE ARE BEHAVIOURALLY IDENTICAL — the SAME function, the SAME stages, the SAME draws,
> the SAME returned world — differing in exactly ONE RECORD LABEL.** RE-MEASURED at HEAD:
> `grep -nE "commit \?|if \(commit\)|commit &&|!commit" src/domain/worldPulse/pulseKernel.js`
> exits 1 with no output, and `grep -nw commit` over that file returns SIX lines of which
> only TWO are code — the destructured signature and `committed: commit,` inside the
> `pulseRecord` literal, adjacent to `createdAt: now,`. The other four are comments and
> JSDoc.
>
> **THE PIN DESIGN LEANS ON THIS RATHER THAN WORKING AROUND IT, and that is the whole point
> of recording it.** Because the two runs are the same computation, the honest pin is a
> WHOLE-PROJECTION EQUALITY with a TWO-ENTRY exclusion list — not a hand-picked field
> comparison, and not a "they should broadly agree" assertion. The two exclusions are not
> defensive allowances; they are the two SERIALIZATIONS of the one differing label
> (`pulseRecord.committed`, and the same record after it is banked onto
> `worldState.pulseHistory[last]`). **The tightness control below is what turns that from a
> claim into a receipt**, and the STOP-and-report clause is what keeps it true: a third
> differing field can only mean `commit` acquired a control-flow reader, which is a change
> to the preview contract and needs its own chair row. ⚠ **A future pass that finds an
> `if (commit)` in the kernel must treat this whole subsection as REFUTED and re-derive the
> projection, not widen the exclusion list.**

> **THE PROJECTION (binding, executable from this text).**
> `normalizeForDormancy(project(result))` — the `tests/helpers/dormancyOracle.js` idiom
> the whole same-seed byte-identity estate already compares through (absent === `{}` ===
> `[]`, empty containers dropped, object keys sorted) — where `project` is the returned
> world plus `pulseRecord`, with **exactly these exclusions, each named for a MEASURED
> reason:**
>
> | Excluded field | Why it necessarily differs |
> |---|---|
> | `pulseRecord.committed` | the literal `committed: commit` — `false` for the preview, `true` for the advance. THE ONLY measured difference |
> | `worldState.pulseHistory[last].committed` | the same record after `appendPulseHistoryWithProvenance` banks it onto the returned world |
>
> **NOTHING ELSE IS EXCLUDED.** `id` (`pulseIdFor(campaign?.id, worldState.tick)`),
> `tick`, `interval` and `createdAt: now` are all IDENTICAL when the two runs are handed
> the same pinned `now` — which the pin does, and asserts. **An exclusion list that grows
> at build time is a STOP-and-report, not a pin adjustment:** a third differing field
> means `commit` acquired a control-flow reader, which is a change to the preview
> contract and needs its own chair row.

Run it flag-dark (both must equal each other AND equal today's output) and flag-lit.
**ONE executed mutant + ONE tightness control:**

- **MUTANT:** drop the epoch from the preview's argument literal — the pin must RED. That
  mutant is precisely the bug chair ruling R2 exists to prevent.
- **TIGHTNESS CONTROL (an exclusion list is only honest if every entry is load-bearing):**
  run the SAME comparison with the exclusion list EMPTY and assert it fails, and that the
  failure's differing-path set is EXACTLY the two paths above — no more. A defensive
  exclusion that never fires is an exclusion hiding a difference nobody has looked at, and
  the control turns "these two are all we need" from a claim into a receipt.

**Downstream saves on backtrack.** MEASURED: `capturePulseSnapshot` clones `worldState`,
`regionalGraph`, `wizardNews`, every member save's `settlement` + `campaignState`, and
the active save's `settlement`/`systemState`/`eventLog`/`phase`. There is no
partial-restore path and this program adds none: a backtrack returns the whole world, its
members and its news atomically, and the fresh epoch re-draws forward from there.

**⚠ `pulseIdFor` STAYS EPOCH-BLIND (J-EP-4).** MEASURED:
`` pulseIdFor(campaignId, tick) → `world_pulse.${stablePart(campaignId)}.${tick}` `` —
two epochs of the same tick mint the same id. Harmless today (the discarded record is
gone with the restored world) but a real ambiguity for any tool indexing records across
epochs. The id is a within-timeline address; the cross-epoch key is the PAIR
`(id, epoch)`, pinned at §8.1.

### 3d REPLAY — the debugging door

```js
// the replay call — a recorded advance, re-run
await simulateCampaignWorldInterval({
  campaign, saves, interval, commit: true,
  now: record.createdAt,        // the recorded wall clock (already the law)
  advanceEpoch: record.epoch,   // the recorded entropy   (this program)
});
```

Both pinned inputs have a precedent: `tests/domain/advanceWorkerByteIdentity.test.js`
pins a fixed `NOW` and asserts the worker and in-thread runs agree; its own header — "The
determinism claim ('a seed IS a world, bit-for-bit') must survive the Web Worker thread
boundary" — is the ONE phrasing in the estate that stays exactly right under the amended
promise, and it is the model for the epoch's replay pin. EP-1 extends it with the epoch in
the same pinned-inputs set, proving a string epoch survives `structuredClone`.

**⚠ THE REPLAY HORIZON IS BOUNDED AT 80 ADVANCES — a declared deferral, not a discovery**
(Q3). MEASURED: `worldState.js` `const MAX_HISTORY = 80;`, applied in BOTH
`appendPulseHistory` (`[...current.pulseHistory, record].slice(-MAX_HISTORY)`) and
`ensureWorldState` (`cloneArray(raw?.pulseHistory).slice(-MAX_HISTORY)`). The 81st-oldest
advance's epoch is EVICTED — for exactly the long-lived worlds most worth debugging. The
declaration lands in this volume, in the ledger row, and as an in-file comment at
`appendPulseHistory`, so the next reader finds a ruling.

Replay is a DM/owner-private door; §8.2 proves the epoch reaches no public payload.

### 3e THE GENERATOR-SIDE LAW

**Denominator EIGHTEEN — RE-CENSUSED IN REVISION 2 (chair ruling R8), TALLY RE-MEASURED
IN REVISION 3 (chair ruling P6).** Revision 1 carried census 3's seventeen verbatim; a
wider sweep found an eighteenth door (A18 below).

**Tally, RE-COUNTED off the table row by row: 6 ALREADY-COMPLIANT · 4 NEEDS-FRESH-DRAW ·
1 NEEDS-EDIT-PRESERVATION · 7 NOT-APPLICABLE = 18.**

⚠ **WHICH FIGURE MOVED, AND WHY THE OLD ONE CLOSED ANYWAY.** Revision 2 wrote
"5 ALREADY-COMPLIANT … 1 NON-SANCTIONED-DOOR", which also sums to 18 — but
`NON-SANCTIONED-DOOR` is not a disposition, it is an ATTRIBUTE, and revision 2 was
carrying ONE of the two hand-rolled-door rows out of the compliant bucket to make the
arithmetic close. MEASURED: the table marks **A17 AND A18 BOTH** `ALREADY-COMPLIANT
(fresh)` and both "entropy door" — two rows identical in kind — while the tally put one in
each bucket. **The ALREADY-COMPLIANT figure is the one that moved, 5 → 6** (A1, A2, A9,
A12, A17, A18), and the `NON-SANCTIONED-DOOR` bucket is STRUCK as a disposition. The
attribute survives where it belongs: it is exactly the **`SEED_DOOR_DEBT` baseline of TWO**
(`InstantWorldEntry.jsx#freshSeed`, `ConstructionPanel.jsx#newSeed`), and the tally and
the debt baseline now agree by construction rather than by coincidence. Both doors
re-verified live at HEAD:
`freshSeed() { return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6); }`
and `` const newSeed = () => `surveyor-${Math.random().toString(36).slice(2, 10)}`; ``.

**THE CENSUS IS CLOSED BY TWO CONSECUTIVE EMPTY SWEEPS**, executed at HEAD: sweep A
matched `onClick` handlers named reroll/regenerate/randomize/shuffle/newDraft/surprise
across `src/components/`; sweep B matched user-visible LABEL text
(reroll · re-roll · regenerate · regen · surprise me · randomize · new draft · forge ·
generate) inside JSX text nodes; sweep C enumerated every `generateSeed()` call site in
`src` (⭐ **FIVE** — corrected in revision 4, chair ruling T3; the figure of "8" this
sentence carried is the TEXTUAL HIT count, which §3b.2's closure record refuted in revision
3 and which survived HERE, in the section an implementer reads to build the affordance
walker. The five real call sites are `generateSettlementPipeline.js` ×3,
`settlementSlice.js` via `eng.generateSeed()`, and `instantWorldBody.js`; the three excluded
hits are two prose comments in `generateSettlementPipeline.js` and the `export function
generateSeed()` definition in `prng.js`) and every `Math.random` site in `src/components` +
`src/store` (**21 — re-measured at HEAD, reproduces**). ⚠ **A WALKER BASELINE FROZEN AT 8
WOULD RED ON DAY ONE, OR — WRITTEN AS A SHRINK-ONLY FLOOR — WOULD BE SATISFIED BY EIGHT
TEXTUAL HITS AND GO VACUOUS THE MOMENT A SIXTH REAL CALL SITE LANDED BESIDE A DELETED
COMMENT.** The denominator EP-4 slice 3's walker freezes is FIVE, excluding comment lines
and the defining `export function`, with the planted-comment control §3b.2 already
specifies. Sweep A
added A18 and confirmed the `onReroll`/`onRegenerate` wiring already rowed as A9/A10/A12
(`OutputContainer.jsx#onRegenerate` → `HistoryTab`/`NPCsTab` via `LockControls`,
`SettlementMapPane.jsx#doReroll`, `WorldMapToolbar.jsx#handleRegenerate`); sweeps B and C
added NOTHING. One near-miss recorded so it is not re-found:
`StaleNarrativeModal.jsx#onRegenerate` → `requestNarrative(activeSaveId)` is an LLM call,
NOT-APPLICABLE with A13–A15.

| # | Affordance (file → symbol) | Entropy today | Disposition | Wave |
|---|---|---|---|---|
| A1 | `GenerateWizard.jsx#handleGenerate` → `settlementSlice#generateSettlement` (no override) | FRESH — `seedOverride \|\| eng.generateSeed()` | ALREADY-COMPLIANT | — |
| A2 | `HomeHero.jsx` hero CTA → same door | FRESH | ALREADY-COMPLIANT | — |
| A3 | `InstantWorldEntry.jsx#handleGenerate` → `runInstantWorld` | **SILENT REPLAY** — the seed lives in `useState(freshSeed)` minted once at mount and is always passed, so `options.seed \|\| generateSeed()` never mints | NEEDS-FRESH-DRAW | **EP-4** |
| A4 | `FoundingWorlds.jsx` fork → `forkSeedFor(sample, userId)` | **SILENT REPLAY** — MEASURED `` return `${sample.config.seed}-${suffix}` ``, a pure function of (sample, user) | NEEDS-FRESH-DRAW | ⛔ **NOT EP-4 — §7a ROW 1 (OWNER-PARKED)** |
| A5 | `SettlementsPanel.jsx#forkSample` → same | **SILENT REPLAY**, same function | NEEDS-FRESH-DRAW | ⛔ **NOT EP-4 — §7a ROW 1 (OWNER-PARKED)** |
| A6 | `LayeredConfigurationPanel.jsx#SeedField` → `generate(seed)` | DELIBERATE EXACT REPLAY | NOT-APPLICABLE — **THE ADDRESS DOOR the directive preserves** | — |
| A7 | `LandingArtifacts.jsx` "forge this exact town" → `generate(fixture.seed)` | DELIBERATE EXACT REPLAY | NOT-APPLICABLE | — |
| A8 | `ForgeExactDemo.jsx` → `generate(fixture.seed)` | DELIBERATE EXACT REPLAY | NOT-APPLICABLE (its COPY is EP-5's, §8.3) | — |
| A9 | NPC roster reroll → `regenNPCsPipeline` | FRESH + RECORDED (`_regenSeed` at the settlement ROOT) | ALREADY-COMPLIANT | — |
| A10 | History reroll → `regenHistoryPipeline` | FRESH + RECORDED | NEEDS-EDIT-PRESERVATION — authored ENTRIES inside `historicalEvents[]` / `currentTensions[]` still reroll away | **DEFERRED, RECORDED** (§7) |
| A11 | Town-map "Reroll layout" → `nextLayoutVariant` | **COUNTER, NOT ENTROPY** — MEASURED `` export function nextLayoutVariant(edits) { return readLayoutVariant(edits) + 1; } ``; `doReset` zeroes it, so reset-then-reroll replays variant 1 forever | NEEDS-FRESH-DRAW | ⛔ **NOT EP-4 — §7a ROW 2 (OWNER-PARKED)** |
| A12 | World map "Regenerate the world" → `bridge.resetMap()` | FRESH BUT UNRECORDED (no seed captured from the FMG iframe) | ALREADY-COMPLIANT (fresh) — owes the recorded clause | **EP-4 slice 2, BEHIND THE FLAG** (H7 — chair ruling P8) |
| A13 | AI narrative regenerate | NON-PRNG (LLM) | NOT-APPLICABLE | — |
| A14 | AI daily-life regenerate | NON-PRNG (LLM) | NOT-APPLICABLE | — |
| A15 | AI progression regenerate | NON-PRNG (LLM) | NOT-APPLICABLE | — |
| A16 | `WizardOutputToolbar.jsx` "New Draft" | NONE (a clear, not a generate) | NOT-APPLICABLE | — |
| A17 | `InstantWorldEntry.jsx` "Surprise me" | FRESH — **through a NON-SANCTIONED door**: `` freshSeed() { return Math.random().toString(36).slice(2,8) + Math.random().toString(36).slice(2,6); } `` | ALREADY-COMPLIANT (fresh) — **second entropy door, H4** | **EP-4** |
| **A18** | ⭐ **`src/components/surveyor/ConstructionPanel.jsx#compile` (NEW — chair ruling R8)** → `composeInstantWorld({ seed, basicConfig })` · `generateSettlementPipeline(config, null, { seed })` · `instantWorld?.(result.config, { seed })` | FRESH per compile — **through a THIRD non-sanctioned door**: MEASURED `` const newSeed = () => `surveyor-${Math.random().toString(36).slice(2, 10)}`; ``, called as `const s = newSeed(); setSeed(s);` inside `compile()` | ALREADY-COMPLIANT (fresh) — **third entropy door, H4** ⚠ on a CREDIT-METERED surface (`useSurveyorContext().creditBalance`) | **EP-4** |

**H1 (HIGH — a LIVE product break independent of this directive).** MEASURED:
`configSlice.js`'s `CONFIG_PATCH_EXTRA_KEYS` contains the literal token `seed`, so
`updateConfig` admits it and writes `state.config.seed`; A4/A5 both call
`updateConfig({…, seed, …})`; `generateSettlement` passes the whole config bag as the
FIRST argument to `generateSettlementPipeline`, whose guard is
`if (config && typeof config === 'object' && 'seed' in config)` → THROW ("the first
argument is the generation config, and it carries a `seed` key"). `state.config` IS
persisted (the `partialize` allowlist), so one sample-fork click makes EVERY subsequent
generation on that device throw until the config is cleared. The throw is CONFIRMED by an
executed node probe; the end-to-end browser symptom is PLAUSIBLE-HIGH. EP-4 repairs it
first, and Q5's ruling removes two of its three callers anyway.

**⭐⭐ H1's OWNER-GATED CLASSIFICATION — RULED, NOT LEFT ARGUABLE (chair ruling P5,
revision 3).** Revision 2 flagged the hazard ("removing an admitted key SHRINKS a
persisted allowlist rather than growing a shape") and never said which owner-gated class
it lands in, while §7a row 2 parks A11 explicitly as PERSISTED SHAPE for a structurally
comparable normalizer-key change. **The chair's default ruling is PARK-BESIDE-A11 unless a
values-only-no-shape argument survives the critic. It does, and here it is, measured at
HEAD in five parts:**

1. **`state.config.seed` HAS ZERO READERS IN THE PRODUCT.** MEASURED: `grep -rn
   "config\.seed\|config?\.seed" src` returns exactly TWO lines, both in
   `src/data/sampleSettlements.js#forkSeedFor`, and both read `sample.config?.seed` — the
   SAMPLE CARD's static config object, never the store's. **Nothing renders it, nothing
   generates from it, no selector derives from it.** Its only effect at HEAD is to make
   `generateSettlementPipeline` throw. Removing the admission therefore changes no
   displayed value and no generation input.
2. **`updateConfig` IS A PATCH, NOT A REBUILD, SO IT CANNOT DELETE.** MEASURED, the writer
   body is `for (const key of keys) { if (isAllowedConfigKey(key)) state.config[key] = partial[key]; }`.
   `isAllowedConfigKey` is consulted ONLY on WRITE. An already-poisoned device's persisted
   `config.seed` is never removed by this change — **the serialized KEY SET of
   `state.config` is UNCHANGED for every existing save**, and only a device that has never
   forked a sample sees one fewer key it was only ever going to receive as the product of
   the bug.
3. **THE PERSISTENCE PROJECTION IS UNTOUCHED.** `partialize` persists `config: state.config`
   WHOLESALE; the edit does not add, remove or reorder anything in `partialize`, and
   `mergePersistedState` deep-merges persisted config OVER `DEFAULT_CONFIG`, so a legacy
   poisoned config rehydrates byte-unchanged. No migration and no persist version bump are
   owed.
4. **THE CONTRAST WITH A11 IS STRUCTURAL, NOT RHETORICAL.** `layoutVariant` IS read
   (`readLayoutVariant`) and IS written by `normalizeMapEdits`, a NORMALIZER whose own
   docblock exists "for a stable stringify … byte-identity" — changing what it writes moves
   a byte-identity surface. `CONFIG_PATCH_EXTRA_KEYS` is a patch-ADMISSION predicate, not a
   serialization normalizer, and no byte-identity claim is anchored on it.
5. **THE REPAIR STANDS WITHOUT Q5.** MEASURED, `FoundingWorlds.jsx` does
   `updateConfig({ ...normalizeConfig(sample.config), seed, _forkedFromSample: sample.id }); await generate(seed);`
   — the seed reaches generation through `generate(seed)` (the `seedOverride` door), NOT
   through config. After the admission is removed, `updateConfig` drops the `seed` key with
   a dev-only report and returns `{ ok: true, ignoredKeys: ['seed'] }`, and the fork still
   works exactly as today. This discharges §7a row 1's own warning that "if it is DECLINED,
   H1's repair must still stand on its own" — **CONFIRMED, it does.**

> **RULING: H1 is VALUES-ONLY, NOT A PERSISTED-SHAPE CHANGE, and STAYS IN EP-4 slice 1
> unflagged.** It is a live product break, not a behaviour change: the only user-visible
> difference is that generation stops throwing. ⚠ **TWO honest residuals, recorded rather
> than argued away.** (a) An already-poisoned device keeps a dead `config.seed` in
> localStorage forever — harmless once the `fullConfig` strip lands, but it is persisted
> debt and is declared, not swept. (b) `tests/store/updateConfigPatchValidation.test.js`
> currently ASSERTS the admission at two places (`expect(isAllowedConfigKey('seed')).toBe(true)`
> and a fork-shape case asserting `store.getState().config.seed`), so it is amended in the
> SAME commit — and the amendment must REPLACE those assertions with their inverses plus a
> pin that the fork's OTHER keys still land, never merely delete them. A deleted assertion
> is a silently weakened pin.

**H4 — RE-DESIGNED IN REVISION 2 ON THE CR-FP-11 PRECEDENT (chair ruling R8).** The
repair is unchanged: route A17's `freshSeed` AND A18's `newSeed` through
`generateSeed()`. **The ENFORCEMENT arm is what changed.** Revision 1 proposed "a source
scan forbidding a hand-rolled `Math.random` seed anywhere in `src/components` /
`src/store`" — MEASURED, that arm is UNLANDABLE as specified: those two layers carry
**21** `Math.random` sites at HEAD and only **TWO** of them are seeds. A source scan
cannot separate "seed" from "id" semantically, so the arm as written reds on nineteen
legitimate sites on day one. The seventeen non-seed sites (two more are the seed doors
being repaired, two are non-entropy UI):

- **ID MINTS (13):** `store/mapSlice.js` ×4 (`sf_` burg, `lbl_`, `mrk_`, `fst_`) ·
  `store/customContentSliceRuntime.js` ×2 + `store/customContentSlice.js` (`lu_`/`bf_`
  local uids) · `store/corpusFactorySlice.js` (`cand_`) ·
  `store/settlementVersionHistoryActions.js` (`snap_`) ·
  `store/campaignSliceShared.js` (uuid v4 nibble) ·
  `store/customContentReviewedSupplyChainActions.js` ·
  `components/WorldMap.jsx` + `components/map/KeyboardPlacementControl.jsx` (`sf_` burg) ·
  `components/settlement/eventComposer/buildEvent.js` (`ev_`)
- **NON-ENTROPY UI (2):** `components/new/tabs/DailyLifeTab.jsx` (picks a loading
  message) · `components/generate/PipelineReveal.jsx` (reveal timing jitter)
- **A DOCUMENTED NEGATIVE (1):** `components/nav/ShaftWrap.jsx`, whose own comment reads
  that the jitter is the band's integer hash and "never `Math.random`" — the walker's
  free positive control that its detector reads comments correctly, i.e. does NOT match.

**THE LANDABLE ARM: an ARGUED_EXCLUSION map + a shrink-only debt baseline**, exactly the
shape `tests/lint/couplingInclusion.walker.test.js` uses for `ARGUED_UNLAYERED`
(MEASURED: a frozen object of `module → written reason`, asserted total, with every entry
required to carry a non-empty reason string). Concretely:

1. `ARGUED_EXCLUSION` — a frozen `site → reason` map with the seventeen entries above,
   each carrying a WRITTEN reason (an id mint is not a seed; a loading message is not a
   world). A site in the map that no longer exists REDS (the map may not rot).
2. `SEED_DOOR_DEBT` — a shrink-only baseline of hand-rolled seed doors, frozen at
   **TWO** (`InstantWorldEntry.jsx#freshSeed`, `ConstructionPanel.jsx#newSeed`). **Day
   one is GREEN with the debt COUNTED**; EP-4's repair drops it to zero and the baseline
   ratchets down with it. It may never grow.
3. A `Math.random` site in `src/components`/`src/store` that is in NEITHER the exclusion
   map NOR the debt baseline REDS, with the message naming both doors: "add an
   ARGUED_EXCLUSION reason if this is an id, or route it through `generateSeed()`."
4. Anti-vacuity: an executed positive control plants a new hand-rolled seed door in a
   FIXTURE source string and asserts it reds; a second plants an id mint and asserts it
   does not. Both run in both directions.

**H5 (persisted shape,
chair-gated)** — MEASURED, `regenHistoryPipeline`'s own docstring: "ROOT `_regenSeed`
HOLDS THE LAST SECTION REROLL, whichever section it was", so the second reroll overwrites
the first and an earlier reroll in a chain is unreplayable; widening it to a per-action
list is a persisted-shape change on a blob whose DM-share gallery strip is a top-level
KEY list (migration 121 + `publicSafe.js`) — exactly the owner-gated class this directive
signs.

**⭐ H7 — RIDES `advanceEpochEnabled` (chair ruling P8, revision 3).** MEASURED:
`src/components/WorldMap.jsx`'s "Regenerate the world" path calls
`await bridge.resetMap();` with NO argument, while `src/lib/mapBridge.js` declares
`resetMap: (seed) => call('settlementEngine:resetMap', { seed }, { timeout: 30000 })` — it
accepts one — and the cited precedent is real: `src/hooks/useInstantWorldMaterialize.js`
already calls `await bridge.resetMap(String(ms.seed));`. The repair hands the door a
recorded seed. **REVISION 2 PUT THIS IN SLICE 3 WITH NO FLAG AND NO ARGUMENT.** That is
not defensible under §4's own governing rule ("every user-visible behaviour change in
EP-4 rides `advanceEpochEnabled`"): unlike the H4 door swaps beside it, **H7 is NOT a
no-behaviour-change repair.** Today FMG picks its own seed inside the iframe; handing it
`String(seed)` makes it generate a DIFFERENT world than it would otherwise have produced
for the same click. The freshness is unchanged, the DISTRIBUTION is unchanged, and the
specific output is NOT — and a user-facing generate button's yield is exactly what this
directive says may not change unflagged. **H7 therefore moves to slice 2 and rides the
flag**; dark, `bridge.resetMap()` is called with no argument, byte-identical to today.
The recorded clause A12 owes lands with it. ⚠ The by-hand alternative — arguing the change
is provably byte-identical — is REFUTED, not merely declined: FMG's internal draw is
opaque to us, so no byte-identity argument can be executed from this side of the iframe
boundary. That is itself the reason the flag is the honest instrument here.

**THE STANDING WALKER.** `tests/lint/regenAffordances.walker.test.js` over
`scripts/regen-affordance-manifest.json` (the mutation-coverage-manifest precedent — an
instrument file, not product weight). Every user-facing generate/reroll affordance
carries a row typed `mints` | `address` | `non-prng` | `deferred-with-reason` |
`owner-gated`; a `mints` row measured passing a STORED seed REDS; a discovered affordance
with no row REDS.
**Anti-vacuity, against the four named classes:** a non-empty denominator floor
(`expect(rows.length).toBeGreaterThanOrEqual(18)` — a detector that matches nothing exits
0); a NEGATIVE CONTROL run over a FIXTURE source string carrying a planted silent-replay
affordance (must flag) and a planted compliant one (must not), executed both directions;
GUARD-THE-GUARD — the detector is proven against a KNOWN live member BEFORE its repair
lands (A4's `forkSeedFor` call shape captured at EP-0 and frozen as a fixture, so the
walker's reach survives the repair that removes the live instance); and `// anchored:` on
every absence assertion with non-empty state seeded first. The manifest is SHRINK-ONLY in
the debt direction: `deferred-with-reason` rows may only be removed, never added, without
a chair row.

---

## §4 THE WAVES — EP-0..EP-5, dependency-ordered, every one DARK

House discipline per wave (FP §10, binding): one wave = one commit (sliced waves one per
slice); focused gates per slice + full gate at wave end through `check:tail` /
`gate-tail.sh`; ledger row with req 13 (Alignment) + req 14 (Edit-verb); CHECK-GIT-FIRST
on every shared file; python3 byte-scan every authored file; pathspec commits; an executed
cp/cmp mutant + a `scripts/mutation-coverage-manifest.json` entry per load-bearing
conjunction; `// anchored:` on every new negative; the house four-fence set **plus EP's
fence 5** + lit-mutant per flagged wave; sizes re-measured with the enforcer at the
publishing commit.

**EP-0 — THE PURE SEGMENT + THE ROOT CENSUS** (no flag; dark by construction;
EARLY-ELIGIBLE — zero spine reads, zero engine behaviour).
*Charter:* `epochSuffix` minted in `src/kernel/prng.js` beside `fork`'s delimiter
docblock (J-EP-2), docblock verbatim at §2.3; the delimiter-alias pin extending
`tests/kernel/prngForkLabelDelimiter.test.js` with an `epoch`-family row;
`tests/kernel/advanceEpochStreamIdentity.test.js` pinning the RENDERED dark and lit
strings as hard-coded literals; **the ENTROPY-ROOT census walker** (§3b.2, re-chartered —
`tests/lint/entropyRootCensus.walker.test.js`) with its **NINE executed positive controls,
one per measured read spelling (up from eight — revision 3 added the `?? ''` spelling and
the RAW UNCOERCED ARGUMENT-POSITION read, neither of which revision 2's set could match),
plus the ONE mandatory negative control (`personaSlicer.js`'s entity-seeded `rngSeed:`
key must NOT match)**. *Budgets:* `prng.js` ≤ +12 effective (far under its layer ceiling —
VERIFY-AT-BUILD); walker ≤ **380** (up from 320: three consumer idioms, nine positive
controls, one negative control, TWO baselines, and the re-run closure record). *Pins:*
empty-string identity (`x + epochSuffix(null) === x`) over a table of real seeds; **the
walker's TWO shrink-only frozen baselines — twenty-five classified compositions across
sixteen modules AND twenty-two classified READ SITES with their coercion strings
(§3b.2a)**; a planted twenty-sixth composition REDS (executed mutant); **a second executed
mutant plants it in the `hash01` idiom specifically**, because a walker that only catches
`createPRNG` is the exact failure revision 1 shipped; **and a THIRD executed mutant plants
a twenty-THIRD READ SITE in the uncoerced argument-position spelling
(`rngSeed: someWorld.rngSeed` inside an argument object) and asserts it REDS — because
that is the exact spelling that hid `pulseKernel.js`'s row-1 read from two adversarial
passes (§0.3 R9), and a walker that cannot catch its own historical blind spot is
ceremony.** *Dormancy:* no flag, no caller — dark by
construction (the WR-10 dark-instrument precedent). *Req 13:* declared-empty (instrument).
*Req 14:* engine-only, recorded. *Ledger row* names R1/R2/R7 as the refutations this wave
institutionalises, and states that R7 refuted this wave's own first charter.

**EP-1 — THE KERNEL SEAM + THE FLAG** (flag `advanceEpochEnabled` + manifest +
certification lane, ONE commit; needs EP-0).
*Charter:* **the SIX enumerated token-level edits at `pulseKernel.js` (§3b.1's EP-1 table
— the exhaustive list, including the `../clock.js` import token and the record-literal
fold revision 2 omitted)**, with the verbatim seam comment and the R-BLD-10 citation;
`advanceEpoch`
threaded through `advanceInterval.js`'s per-tick `tickArgs` and
`advanceCampaignWorld.js`'s single-tick barrel; the store mint with the census-visible
gate spelling (§2.2); the conditional `epoch` field on `pulseRecord` (§1.2);
`assertEpochPinnedInTest` in `src/domain/clock.js` called at the same two entry points;
manifest join in alphabetical position + the NEW lane `subsystemRowsEpoch.js` + the first
by-name gate read, all in this commit.
*Budgets:* pulseKernel ZERO new lines across ALL SIX edits (STOP-and-report if the
enforcer disagrees — three statements now fold onto §3b.1's measured target line and one
spread folds onto `createdAt: now,`, so this is the likeliest budget to move and the
enforcer runs BEFORE the commit, not after); advanceInterval ≤ 6;
campaignAdvanceSession ≤ 25; clock.js ≤ 20; subsystemRowsEpoch ≤ 120.
*Pins:* the FIVE-fence set + lit-mutant per §2.5 — including fence 1's SIX-cell grid
(three rules configs × value-absent/value-present), the INVERTED purity arm (J-EP-3), the
per-path `advanceMultiTick` stance fixing (§2.4) and **fence 5, the flag-flip/persisted-
cursor fence with its kernel-flag-read mutant**; the replay pin extending
`advanceWorkerByteIdentity.test.js` with the epoch in its pinned inputs; the legacy-record
composition pin (a row with no `epoch` composes the literal legacy string); JSON
round-trip through REAL serialization; an executed mutant on `epochSuffix`'s truthiness
branch. *Dormancy:* flag dark ⇒ `epochSuffix` returns `''` ⇒ the pre-wave string ⇒ 32
property dormancy goldens, 27 golden fixtures, 8 `dormancyOracle` byte-identity suites,
87 direct-kernel tests and 11 soak fixtures untouched — VERIFY, do not assume.
*Req 13:* declared-empty (substrate). *Req 14:* engine-only, recorded. *Collision:*
`pulseKernel.js` is the pulse mouth — CHECK-GIT-FIRST mandatory, quiet window required.
⚠⚠ ⭐ **AND EP-1 IS ITSELF A CQ5 FLAG WAVE (stated here in revision 5 beside EP-3 slice B's
own shared-file ruling, chair ruling F7).** The one-commit law puts the
`ENGINE_GATED_VIRTUAL_RULE_KEYS` manifest join, the new `subsystemRowsEpoch.js` certification
lane and the first by-name gate read in a SINGLE commit — the same shared surfaces every
other flag wave must edit. **Two flag waves in ONE worktree deadlock on them**, so EP-1 is
SERIALIZED against every other flag wave: serialize, or one worktree each. Non-flag waves
parallelize fine.

**EP-2 — THE FORK SEMANTICS** (second slice of the flag; needs EP-1).
*Charter:* the cursor field at `buildPausedAdvanceCursor` + the three-term re-thread at
`runResolveIntervalMajors` (§1.3); **the PREVIEW thread (chair ruling R2) — the epoch
added to `campaignWorldPulseDeferred.js`'s `previewCampaignWorldPulse({…})` argument
literal, sourced from the campaign's pending epoch**; forecast INHERIT-NEVER-MINT; the
catch-up and surveyor MINT rulings (J-EP-5); `options.epoch` taught to the two cross-store
byte-equality tests (teaching, never weakening); the five-affordance undo table AND the
five-row consumer table (§3c) pinned row by row including both NEGATIVES.
*Budgets:* campaignAdvanceSession ≤ +30; forecastRun ≤ 8; campaignWorldPulseDeferred ≤ 4.
*Pins:* **preview↔commit agreement from identical state with the same pending epoch,
executed in BOTH flag states, with the drop-the-epoch-from-preview mutant RED**;
pause→reload→resume byte-equivalence WITH the cursor epoch, and its RED without
it as an executed mutant — the program's highest-risk claim; a legacy cursor with no
`advanceEpoch` resumes as epoch-absent; undo→re-advance draws a DIFFERENT world (lit) and
the SAME world (dark) — the lit-mutant of the whole program; `advanceSeqByCampaign` and
the proposal ring provably untouched. *Dormancy:* the cursor field is conditionally
materialized ⇒ dark cursors byte-identical. *Req 13:* declared-empty. *Req 14:* the DM's
undo verb is UNCHANGED in shape and CHANGED in meaning — recorded, and it is the sentence
§8.3's copy gate covers.

**EP-3 — THE SIDE-CHANNEL DISPOSITION** (rides the flag; needs EP-1; **TWO SLICES, and
only slice B is CHAIR-GATED ON Q1** — a revision-2 split: family 1 no longer waits on the
year-anchor decision).
*Charter, slice A (either arm) — ⭐⭐ **THE WRITER AND THE STAMP FIRST (§3b.1b, chair ruling G1,
revision 6 — revisions 2–5 chartered this slice around an accessor with NO EPOCH SOURCE, §0.3
R13), THEN THE FOURTEEN TICK-VARYING RE-ROOTS + THE TICK-FREE ONE (fifteen compositions at
EIGHT read sites):***
⭐ **THE LEAF `src/domain/advanceEpochLedger.js` (NEW — J-EP-6's home, a plain `src/domain/`
leaf, NOT under `worldPulse/` or `spatial/`) exporting `stampAdvanceEpochYear` in its
`latest`-only form + `tickStreamSeedOf`**, with `spatialLedgers.advanceEpoch = { latest: { tick, epoch } }`,
its ONE call site at **seam edit 9** (`;`-joined onto the calendar-advance line inside
`pulseKernel.js`, +0 lines) and **the ONE new import line — the declared J-EP-11 +1, bought
HERE rather than in slice B**; ⭐ **the `advanceEpoch` row in `src/lib/spatialUsage.js#EXEMPT_LEDGER_KEYS`
with its written reason, IN THE SAME COMMIT** (the walker is
`tests/lib/spatialLedgerCoverage.walker.test.js`; its `writtenLedgerKeys()` scan and its
`expect(classified).toEqual(written)` test assert exact set equality over every
`setSpatialLedger` write under `src/domain`, so without the row this slice reds on day one);
⚠⚠ ⭐ **THAT MANIFEST ROW IS A CQ5-CLASS SHARED-FILE TOUCH AND THE SERIALIZATION LAW MOVES TO
THIS SLICE WITH IT (chair ruling F7, re-attributed by G1):** slice A does not build
concurrently with ANY flag wave or any other ledger-minting wave in the same worktree —
**serialize, or one worktree each**; CHECK-GIT-FIRST on `src/lib/spatialUsage.js` and on
`pulseKernel.js` immediately before staging; and if a concurrent lane proves unavoidable, the
CONCURRENT-LANE PARTIAL-STAGE RECIPE binds in full and the gate is proven inside a
`git archive` of the INDEX, never by diff-hunk filtering.
**THEN the re-roots:** `tickStreamSeedOf(worldState, { absent })` **taking each site's own
absent-seed coercion as an explicit argument per §3b.3 and §3b.2's family-1 re-root table**;
rows 2/4/10/11/12/14/15/16 (`createPRNG`) and
17/18/19/21/22/23/24 (`hash01`) re-rooted at **RS-5 (`roadsKernel.js`), RS-9
(`npcLadderKernel.js`), RS-10 (`demographicsKernel.js`), RS-11 (`demographicsPlans.js`),
RS-12 (`sovereigntyMarketStage.js`) and RS-13/RS-14/RS-15 (`realmVerbExecution.js`)** — the
consumers receive a seed string and need no edit at all, which is why this
slice is smaller than its row count suggests. ⚠ **RS-9 IS THE SPLIT READ AND SLICE A MAY
NOT FINISH IT:** one read feeds family-1 rows 17/18/19/21 AND family-2 row 20, so slice A
re-roots it to the TICK anchor and **row 20 stays epoch-blind until slice B lands its
second, separately-named argument** (§3b.2a's RS-9 ruling). An implementer who re-roots
RS-9 once and calls the read closed ships row 20 blind, and no pin inside slice A catches
it — the census walker's classification gate is what reds it, which is why the walker is
EP-0's and not EP-3's. J-EP-10's tick-free note in-file at FORCE_RESETTLE.
*Budgets, slice A:* ⭐ `src/domain/advanceEpochLedger.js` (NEW) ≤ **140** effective — the
writer's `latest` half + `tickStreamSeedOf` + an explicit `absent` with no default;
`pulseKernel.js` ONE token edit at +0 plus the declared +1 import line (STOP-and-report if
the enforcer disagrees); `src/lib/spatialUsage.js` +1 EXEMPT row (284 raw lines, unbaselined);
each re-rooted site is one line; ⚠ `roadsKernel.js` is 838 and AT CEILING — one-line edits only.
*Pins, slice A:* ⭐⭐ **THE FAMILY-1 STAMP-SURVIVAL PIN (§3b.1b): one parameterized suite with a
STRICT PASS-THROUGH `vi.mock` spy on `tickStreamSeedOf` at its leaf home, EIGHT rows asserted
INDEPENDENTLY with a per-row OBSERVED-CALL FLOOR (a row observing zero calls REDS — fix the
FIXTURE, never the assertion), PLUS the RETURNED-WORLD ARM (`latest === { tick, epoch }` on the
world the kernel RETURNS, re-asserted after the store commit and a real JSON round-trip), with
FOUR executed mutants — (i) dropping the CURRENT-TICK check reds the DARK arm and fence 5's
`latest` direction (ii) while the lit arm stays green, (ii) a wholesale-replacement plant at
the `memoryState` seam reds rows 1–5 and the returned-world arm and NOT rows 6–8, (iii) the
same plant at `applyWorldPulseOutcomes` reds ALL EIGHT and the arm, (iv) dropping the stamp
from the returned world after the last read reds the ARM ONLY**; ⭐⭐ **THE TWO-EPOCH PIN (chair
ruling G1, executed, not prose): the same advance from the same starting world under TWO
different epochs composes EIGHT DIFFERENT family-1 keys LIT — including a different
`npcLadderContest.js#tieBreak` winner and a different `demographicsResponses.js#selectResponse`
choice — and BYTE-IDENTICAL keys DARK, equal to the LITERAL strings HEAD produces, under the
four hostile seed inputs**; the SINGLE-WRITER source scan over `src` with an executed
second-writer plant (a `setSpatialLedger(…, 'advanceEpoch', …)` anywhere but the leaf REDS);
⭐ **the DM-DOOR pin (§3b.1b's J-EP-15): `mintRealmVerbProposal` on a NEVER-LIT world composes
today's literal key, and on a lit world composes the key bearing that world's own `latest`
epoch** — both directions, so the door's behaviour is recorded rather than found.
*Dormancy, slice A:* the per-site suite of §3b.3 over the FIFTEEN family-1 compositions with
the ledger absent under four hostile seed inputs, ⭐ **plus the M3 arm the writer adds** — over
an ASPATIAL fixture, a multi-tick advance with the flag ABSENT leaves `Object.keys(worldState)`
carrying no `spatialLedgers` at all, because the stamp's `!epochTerm` early return means
`setSpatialLedger` (which CREATES the namespace) is never reached.
*Collision, slice A:* **`pulseKernel.js`** (⚠ THE BANKED PULSE MOUTH — the writer's ONE call
site plus the +1 import; quiet window mandatory), ⭐⭐ **`src/lib/spatialUsage.js`** (the CQ5-class
manifest row), `roadsKernel.js` (838, at ceiling), `npcLadderKernel.js` (⚠ THE SPLIT READ),
`demographicsKernel.js`, `demographicsPlans.js`, `sovereigntyMarketStage.js`,
`realmVerbExecution.js`.
*Charter, slice B (Arm A only):* ⭐⭐ **WHAT SLICE B NO LONGER CARRIES, STATED FIRST (chair
ruling G1, revision 6): THE LEAF, THE WRITER, SEAM EDIT 9, THE +1 IMPORT LINE AND THE
`spatialUsage.js` MANIFEST ROW ARE **SLICE A's** NOW** — §3b.1b gave the family-1 accessor its
source, slice A ships under EITHER arm, and a slice that ships under either arm cannot depend
on the Q1-gated one (J-EP-14). Slice B's own opening act is therefore to **GROW the existing
writer with its `byYear` half** — FIRST-WINS, `byYear`'s own object reference re-used
unchanged on a mid-year tick (law 2 as revision 6 narrows it), still ONE writer and still ONE
`setSpatialLedger`, in the leaf slice A minted and behind the import line slice A already
bought (so slice B's kernel import edit is +0). ⚠ **The CQ5-class serialization law, the
CHECK-GIT-FIRST list and the partial-stage recipe travel WITH the manifest row to slice A;
slice B keeps CHECK-GIT-FIRST on `pulseKernel.js` and the pulse-mouth quiet window** because
edits 7 and 8 are still inside the banked mouth. **THEN:**
`yearStreamSeedOf(worldState, year, { absent, yearBase })` — ⭐ **`yearBase` REQUIRED, no
default (J-EP-13, §0.3 R12: rows 13 and 20 name the same lived year one lower than the other
seven)**; the NINE YEAR-KEYED compositions (rows 1/3/5/6/7/8/9/13 + row 20) re-rooted
**at their EIGHT READ SITES — RS-2, RS-3, RS-4, RS-5, RS-6, RS-7, RS-8, RS-16 — plus RS-9's
second argument, per §3b.2's family-2 re-root spec (chair ruling P1)**, with ⭐ **RS-2 aimed
at the POST-advance `worldState`, never `startingWorldState`**; the TWO display seams
(`mapDress.js` receives `worldState`; `CauseWalkPanel.jsx`'s `seedId` takes the
display-surface rule) — **neither is ever handed `advanceEpoch`**; the OUT-OF-DENOMINATOR
class recorded as deliberately epoch-invariant with rationale rows (⭐ including NC-1,
`economyReconciliation.js`, new in revision 4).
⚠ **SLICE B TOUCHES `pulseKernel.js` AND `generosityKernel.js`, NEITHER OF WHICH REVISION 2's
COLLISION LIST NAMED** (⭐ **`src/lib/spatialUsage.js` was the third and is SLICE A's from
revision 6 on**). RS-2 is inside the banked pulse mouth (§3b.1 edits 7+8, both +0, on the
import line slice A bought); RS-3 is `generosityKernel.js`, a module this volume did not
mention at all before revision 3. Both carry CHECK-GIT-FIRST, and the kernel
carries the pulse-mouth quiet-window requirement.
*Budgets:* ⭐ `src/domain/advanceEpochLedger.js` GROWS from slice A's ≤ 140 to ≤ **200** —
the writer's `byYear` half plus `yearStreamSeedOf`, with every accessor argument
(`absent`, `yearBase`) explicit and defaultless; each re-rooted site is one line;
`src/lib/spatialUsage.js` **ZERO EDITS** (slice A landed the row); ⭐ `worldState.js`
**ZERO EDITS** — revision 3's "`worldState.js` ≤ 25 for the ledger writer" is **STRUCK**
(§3b.1a: that file could never have hosted the call).
*Pins:* the census walker's classification is the totality gate (a TICK-VARYING row
calling `yearStreamSeedOf` REDS, and vice versa; ⭐ **and a family-2 row with no declared
`yearBase` REDS — J-EP-13**); ⭐⭐ **THE STAMP-SURVIVAL PIN (T1's ordering pin, WIDENED TO
TOTALITY IN REVISION 5 — chair rulings F1 + F6; the full spec is §3b.1a): ONE parameterized
suite over a LIT, YEAR-CROSSING advance with a STRICT PASS-THROUGH `vi.mock` spy on
`yearStreamSeedOf` at its leaf home, asserting for EACH OF THE NINE family-2 re-root
actions INDEPENDENTLY — the eight read sites RS-2/RS-3/RS-4/RS-5/RS-6/RS-7/RS-8/RS-16 plus
RS-9's second argument — that the composed value carries the epoch stamped at seam edit 9 of
that same tick; PLUS the RETURNED-WORLD ARM (`byYear[<the entered year>] === epochTerm` on the
world the kernel RETURNS, re-asserted after the store commit and a real JSON round-trip); PLUS
a per-row OBSERVED-CALL FLOOR (a row that observes zero calls REDS — a fixture that cannot
reach a stage is a STOP-and-report, never a dropped row); ⚠ **the fixture must drive ONE lit
year-crossing advance AND ONE VIEW-TIME `resolveMapDress` read over the world that advance
RETURNED, because row 9 (RS-16) is reached from `townScene/sceneLiving.js` and never from the
pulse** (revision 6); **with FOUR executed mutants whose
required RED/GREEN asymmetry is the receipt — ⚠⚠ RECONCILED TO §3b.1a's MATRIX IN REVISION 6
(chair ruling G3): this charter previously said mutant (ii) reds "rows 2–8" and omitted the
arm, which disagrees with the table it cites** — (i) edit 7 re-aimed at `startingWorldState`
reds ONLY row 1, (ii) a wholesale-replacement plant at the `memoryState` seam reds **rows 2–9
PLUS the returned-world arm** and NOT row 1, (iii) the same plant at `applyWorldPulseOutcomes`
reds **rows 2–9 plus the returned-world arm** and NOT row 1, (iv) dropping the stamp from the
returned world after the last read reds the RETURNED-WORLD ARM and RS-16 ONLY. ⭐ **(ii) AND
(iii) SHARE THAT RED SIGNATURE DELIBERATELY AND BOTH ARE REQUIRED** — they plant at different
addresses in different files, and MEASURED the `memoryState` seam
(`let memoryState = advanceObligationDecay(applied.worldState, worldState.tick);`) is UPSTREAM
of `const finalWorldState = appendPulseHistoryWithProvenance(memoryState, finalPulseRecord, applied);`,
so a wholesale replacement there strips the stamp from the RETURNED world too and row 9 must
red with the arm. ⚠ Revision 4's version of this pin covered ONE of the
nine and carried the other eight on prose across SIXTY-NINE rebinds in TWO files;
mutants (ii)/(iii)/(iv) were all GREEN under it**;
⭐ **THE FIRST-WINS PIN (T1, ⚠ RESPELLED IN REVISION 6 — chair ruling G1, ledger law 2): a
second stamp attempt in the same lived year leaves `byYear` BYTE-UNCHANGED and re-using its
SAME OBJECT REFERENCE, with the mutant that drops the `byYear[year] != null` guard asserted to
RED — that mutant is what repaints a lived year. ⛔ It may NOT assert that the WORLDSTATE
reference is unchanged: a correct lit implementation rewrites `latest` on every tick, so the
revision-4 spelling would RED A CORRECT BUILD (the F2 defect class)**;
the succession pin (**two advances from the same undo point resolve `tieBreak`
DIFFERENTLY, lit** — the sharpest lit-mutant in the program); the demographic-response pin
(the same city chooses differently across a re-advance, lit); the mid-year stability pin
(two ticks of the same lived year across an advance boundary read the SAME severity, lit —
⭐ **which is now TRUE BY THE FIRST-WINS LAW rather than by hope, and the volume says which
law makes it true**); the fresh-year pin (a year first entered after an undo reads a
DIFFERENT severity); ⭐ **the already-lived-year pin (a world with history that lights the
flag repaints NO year it lived dark — every pre-flag year has no `byYear` key, so the
accessor returns the bare root exactly as today)**; ⭐ **the two-vocabulary pin (rows 13 and
20 read the SAME year's epoch as rows 1/3/5/6/7/8/9 for the same `elapsedWeeks`, with the
mutant that drops `yearBase` from either call asserted to RED)**; the display-parity pins
(`mapDress` dresses the winter the sim ran, and a cause walk re-read after a re-advance
reads the SAME prose — lit and dark); `byYear` round-trips every §8.4 path; **the source
pin that `advanceEpoch` appears nowhere under `src/components/`, `src/domain/display/` or
`src/domain/townMap/` except the sanctioned `yearStreamSeedOf` leaf import (RS-16's
re-root; direct ledger reads and local composition forbidden)**; ⭐ **the SINGLE-WRITER source scan over `src` (the L4 idiom) with an
executed second-writer plant — a `setSpatialLedger(…, 'advanceEpoch', …)` anywhere but the
leaf REDS.**
*Dormancy:* **PER-SITE, NEVER GLOBAL (§3b.3)** — a table-driven suite that, for each of
the twenty-five compositions independently, composes the key with the ledger absent under
four hostile seed inputs (`undefined`, `null`, `''`, non-string) and asserts the LITERAL
string that site produces at HEAD. ⚠ **The suite is driven off the NINE-row coercion
table, not off one accessor**, and it carries the two behaviours that are not coercions at
all: RS-2's absent case must reproduce the literal `"undefined"` in the composed key, and
RS-16's absent case must produce NO DRAW AT ALL (severity stays `null`) — an accessor that
returns a fallback string there would CREATE a draw HEAD does not make.
⭐ **AND ONE ARM THE `byYear` HALF ADDS (chain link M3, chair rulings T1 + T2; ⚠ the NAMESPACE
half of this arm is SLICE A's from revision 6, because slice A lands the writer):** over an
ASPATIAL fixture carrying no other spatial ledger, run a multi-tick advance that CROSSES A YEAR
BOUNDARY with the flag absent, and assert `Object.keys(worldState)` contains no
`spatialLedgers` at all — the stamp's `!epochTerm` early return means `setSpatialLedger`,
which CREATES the namespace when absent, is never reached. A stamp guarded on the raw value
instead of on `epochTerm` passes every stream assertion in this suite and fails only here.
*Collision (⭐ REVISED — two modules added by chair ruling P1, a THIRD by T1, ⭐ and the THIRD
MOVED TO SLICE A by G1 in revision 6):*
**`pulseKernel.js`** (⚠ THE BANKED PULSE MOUTH — RS-2 via §3b.1 edits 7+8 at +0, on the import
line slice A bought; quiet window mandatory),
**`generosityKernel.js`** (RS-3, row 13's sole re-root site),
`roadsKernel.js` (838, at ceiling — one-line edits only ⚠ **and slice A already edited this
file, so CHECK-GIT-FIRST here is not optional**), `traditionsKernel.js` (⚠ TWO
read sites, RS-4 and RS-6, feeding DIFFERENT rows), `seasons.js`, `mapDress.js`,
`npcLadderKernel.js` (⚠ THE SPLIT READ — see the RS-9 ruling), `CauseWalkPanel.jsx`.
⭐ **`src/lib/spatialUsage.js` is NO LONGER on this list** — its `EXEMPT_LEDGER_KEYS` row and
the whole CQ5-class serialization law moved to slice A with the writer (chair ruling G1); the
citation `tests/lib/spatialLedgerCoverage.walker.test.js`, NOT `tests/lint/` (chair ruling F3),
travels with it.

**EP-4 — THE GENERATOR-SIDE LAW** (⭐ **RE-SCOPED IN REVISION 2, chair ruling R7**;
INDEPENDENT LANE; three slices).

**⛔ TWO SLICES ARE EXTRACTED FROM THIS WAVE ENTIRELY AND PARKED AS OWNER-QUEUE ROWS**
(§7a rows 1 and 2). ⚠ **TWO SLICES EXTRACTED, FOUR ROWS PARKED** — §7a also carries H5
(chair-gated since revision 1) and J-EP-10's FORCE_RESETTLE finding, neither of which was
ever an EP-4 slice; the two figures are different things and both are correct. Revision 1
let EP-4 change user-visible behaviour with NO flag, "interleaving
anywhere after EP-0" — which contradicts §8.3's own marketing gate (the living-futures
claim is "UNLOCKED ONLY WHEN `advanceEpochEnabled` IS LIT IN A SHIPPED BUILD") and the
directive's dark-state discipline. **THE RULE NOW: every user-visible behaviour change in
EP-4 rides `advanceEpochEnabled`**, so the generator half of the claim becomes true at
exactly the moment the engine half does, and never before. The two extracted rows are the
ones that touch an owner-gated class:

- ⛔ **A4/A5 — PAID/FOUNDER SURFACE.** MEASURED: `forkSeedFor(sample, userId)` is
  `` return `${sample.config.seed}-${suffix}`; `` (a pure function of card × user),
  consumed by `src/components/generate/FoundingWorlds.jsx` (reads `s.auth.tier`; the
  fork is "tier-gated above town") and `src/components/SettlementsPanel.jsx#forkSample`
  (whose own comment says a tier-gated sample "opens the purchase modal"). Changing what
  a fork click yields is paid-surface behaviour. **Parked with a recommendation: LIVING
  DOOR** (Q5's reasoning stands — the sample's own seed remains typeable in the
  `SeedField`, which is the address).
- ⛔ **A11 — PERSISTED SHAPE.** MEASURED: `nextLayoutVariant(edits)` is
  `return readLayoutVariant(edits) + 1;`, and `normalizeMapEdits` writes
  `if (variant > 0) out.layoutVariant = variant;` — a persisted key in a normalizer whose
  own docblock exists "for a stable stringify … byte-identity." **Parked with a
  recommendation: mint a real seed rather than widening the counter**, since a counter
  that `doReset` zeroes replays variant 1 forever, and a seed field is the shape the rest
  of the estate already uses.

*Charter, slice 1 — **the H1 repair** (a LIVE product break, not a behaviour change, and
therefore NOT flag-gated — **CLASSIFIED AS VALUES-ONLY IN REVISION 3, chair ruling P5;
the five-part measured argument and its two recorded residuals are in §3e**):*
`state.config.seed` must never reach the pipeline's first argument — strip at
`generateSettlement`'s `fullConfig` build AND remove `seed` from
`CONFIG_PATCH_EXTRA_KEYS`, with `tests/store/updateConfigPatchValidation.test.js` amended
in the same commit since it currently ASSERTS the admission (its two assertions are
REPLACED WITH THEIR INVERSES plus a fork-shape pin, never deleted). ⚠ Removing an admitted
key SHRINKS an admission predicate, **not a persisted shape** — `updateConfig` is a patch
loop that cannot delete, `partialize` is untouched, and `state.config.seed` has ZERO
readers in `src`. Pin `state.config`'s serialized KEY SET before and after anyway and
prove no other key moved: the argument is the reason it is unflagged, the pin is the
receipt.
*Charter, slice 2 — the flag-gated user-visible repairs (⭐ H7 JOINS THIS SLICE, chair
ruling P8):* A3 (`InstantWorldEntry.jsx` — MEASURED `const [seed, setSeed] = useState(freshSeed);`
mints once at mount and is always passed, so `options.seed || generateSeed()` in
`src/store/instantWorldBody.js` never mints) **behind `advanceEpochEnabled`**, dark ⇒
today's behaviour exactly; **H7** (`bridge.resetMap()` handed a recorded seed, on the
`useInstantWorldMaterialize` precedent) **behind the same flag** — dark, the call stays
argument-free and byte-identical; lit, the world map's regenerate yields a recorded fresh
draw. A12's owed recorded clause lands with it.
*Charter, slice 3 — the doors and the instrument (H7 REMOVED):* H4's TWO repairs (A17's
`freshSeed` and A18's `newSeed` routed through `generateSeed()` — pure door swaps, no flag
owed, same freshness before and after, and the ONLY two rows in this wave that carry that
argument) + H4's `ARGUED_EXCLUSION` + `SEED_DOOR_DEBT` walker arm (§3e); the standing
affordance walker + manifest (§3e). **H5 stays chair-gated and does NOT build here**
(persisted shape on a blob whose DM-share gallery strip is a top-level KEY list).
*Budgets:* each repair ≤ 20 lines; affordance walker ≤ 250; the H4 scan arm ≤ 180
(exclusion map with seventeen written reasons + the debt baseline).
*Pins:* the H1 regression executed end-to-end through the real store (a fork click then a
wizard generate succeeds); **the H1 key-set pin — `state.config`'s serialized key set
before and after, plus an executed pin that a PRE-EXISTING `config.seed` SURVIVES the
change (proving `updateConfig` cannot delete, §3e argument 2)**; two consecutive
instant-world Generate clicks compose DIFFERENT realms LIT and the SAME realm DARK (the
flag's own lit-mutant); **H7's dark pin — `bridge.resetMap` called with ZERO arguments
when the flag is absent, asserted on the call spy, with the lit arm asserting one recorded
string argument**; the affordance manifest's non-empty floor at 18; the exclusion map's
totality and its two planted controls.
*⚠ Dark-state note:* with A11 and H5 extracted, **NO slice here changes a persisted shape
at all.** H1 is values-only and ruled so in writing (§3e, chair ruling P5); A3's and H7's
user-visible changes are both pinned dark-identical by the flag. This is a stronger claim
than revision 2's ("no persisted shape except H1's allowlist SHRINK") and it is the ruling
that earns it, not a softening.
*Req 14:* ENGAGED — every row IS a DM verb; the table is the edit-verb story.

**EP-5 — THE PROMISE AMENDMENT** (no code behaviour; lands LAST, at the terminal-phase
gate). *Charter:* the amended-in-place sentences at every home §8.5 enumerates — **now
FORTY-FIVE across four tiers, not forty-seven across five: the TIER-5 MEMORY PAIR IS
ALREADY DISCHARGED BY THE CHAIR** (§8.6) — tier 1 copy 7 · tier 2 docs/law 15 · tier 3
code headers 10 · tier 4 tests 13; the marketing guard released (§8.3). *Pins:* every doc-reading
pin asserts its target appears EXACTLY ONCE (the first-match retargeting hole); the sweep
runs on the LOOSE anchor `seed` ∧ (`world` | `town` | `realm`), never the punctuated
phrase — MEASURED, at least eight spellings exist, including one with NO COMMA
(`tests/domain/routeNetworkDormancy.test.js`, "a seed is a world forever") that a
punctuated grep MISSES. *⚠ EXPECTED RED, and it is the feature:*
`tests/copy/landingClaimsParity.test.js` binds `landing.brief.deterministic` verbatim
precisely so "rewording a bound claim … reds that gate so the binding is revisited." That
red IS the owner's review checkpoint.

---

## §5 QUEUE INSERTION — RE-DERIVED IN REVISION 2 AGAINST THE LIVE TREE (chair ruling R6)

> ✅ **PROMOTION NOTE — THIS SECTION LANDED IN THE PARENT ON 2026-08-07.** Every
> clause below was applied to `docs/DESIGN_FP_ARCHITECTURE.md` at the EP/HB/WC
> integration fold, with EP's rows composed LAST in every table (binding
> condition C3 of the E5 ruling). **THE VERIFY-AT-FOLD BELOW WAS DISCHARGED BY
> EXECUTION, NOT INHERITED:** the parent was re-counted at `%(head)s` before any
> row was placed and reads **52 flags · 75 waves · 66 logical seams (47 physical
> rows, two of them compressed ranges)** — the fold package's PLAUSIBLE 75/66
> CONFIRMED, so no STOP fired. Post-fold: **63 flags · 108 waves · 112 seams**,
> EP contributing flag row **63**, six waves, and logical seam rows **103-112**
> as ONE physical compressed range row. ⚠ **ITEM 3's ORDERING CLAUSE CARRIES A
> REPORTED ERRATUM** — see the note inside item 3; the text is struck in place,
> never rewritten.


**⚠ WHAT REVISION 1 GOT WRONG, stated first.** It asserted a post-fold state ("75 waves /
52 flags") as measured, placed rows against it, and named `docs/DESIGN_FP_ARCH_ES.md` and
`docs/DESIGN_FP_ARCH_WY.md` as compile inputs.
⚠⚠ ⭐ **STALE BY EVENT, NOT WRONG — THE FOLD LANDED MID-REVISION-6 AND THIS WHOLE SECTION IS
NOW A VERIFY-AT-FOLD THAT HAS COME DUE.** MEASURED at HEAD `7794cb4a`: the ES + WY fold
committed as `d789f9f5` / `51283abe` / `7794cb4a`, so **`docs/DESIGN_FP_ARCH_ES.md` (1811 lines
added) and `docs/DESIGN_FP_ARCH_WY.md` (1657) NOW EXIST as repo files**, `docs/SOL_QUEUE.md`
(+91) and `docs/DESIGN_FP_ARCHITECTURE.md` (+561) have moved, and queue item #34 is
DISCHARGED. **Every figure in this section that was marked VERIFY-AT-FOLD must now be
RE-DERIVED against the LIVE post-fold tree before EP's rows are placed — that is the
verification this section scheduled for itself, and its trigger has fired.** The paragraph
below is retained VERBATIM as the historical record of what revision 2 corrected and why; read
it as history, never as a present-tense measurement. **HISTORICAL (true at revision 2's
measurement HEAD): MEASURED, neither file had ever existed
at a `docs/` path on any branch** (`git log --oneline --all -- docs/DESIGN_FP_ARCH_ES.md
docs/DESIGN_FP_ARCH_WY.md` → EMPTY), and `grep -rn 'ES-4\|WY-2' docs/` returned nothing,
because **THE FOLD HAD NOT LANDED.** The ES and WY volumes exist as an authored, verified
FOLD PACKAGE in the session scratchpad
(`…/scratchpad/fold-pass/DESIGN_FP_ARCH_ES.md`, `…/DESIGN_FP_ARCH_WY.md`,
`…/QUEUE-AND-AMENDMENTS.md`), and the fold is queue item **#34, still PENDING**. This
section now cites only documents at their REAL paths and marks every count MEASURED or
VERIFY-AT-FOLD.

**THE MEASURED BASELINE (live tree, HEAD 32cc17f7):** `docs/DESIGN_FP_ARCHITECTURE.md`
§3's header reads "43 new virtual flags" and its table has **exactly 43 numbered rows**
(counted; row 43 is `cascadeGovernorEnabled | CW-1`); §5's header reads "60 waves"; the
volume's own closing line reads "45 seams". `docs/SOL_QUEUE.md` §1 LANE A runs items
1–18, with **no ES or WY lane in it** — the fold package's own anomaly A1 records that
SOL_QUEUE has never been amended for either program.

**THE FOLD'S OWN INSERTIONS (read from the fold package, which lands FIRST):** ES adds
flag row 44 (`espionageEnabled | ES-1`); WY adds rows 45–52
(`severityDurableRumorsEnabled` · `caravanBodiesEnabled` · `flowMigrationPhysicalEnabled` ·
`migrationCargoEnabled` · `moversCarryNewsEnabled` · `caravanSeizureEnabled` ·
`caravanFloorEnabled` · `armySupplyEnabled`). **Post-fold flag count = 52, and EP's row is
53 — that arithmetic is MEASURED-AT-BOTH-ENDS and survives.** The fold package also
amends waves 60 → 68 → 75 and seams 45 → 58 → 66, **but its own anomaly A6 labels those
deltas PLAUSIBLE, not measured** ("this pass did not COUNT the waves, seams, or flags in
the live volume … a wrong count in a header is exactly the kind of inherited phantom").
**EP therefore does NOT inherit them.**

> **VERIFY-AT-FOLD (binding on the implementer).** At the moment EP's rows are composed,
> RE-COUNT the post-fold §5 wave rows and §9 seam rows in the landed
> `docs/DESIGN_FP_ARCHITECTURE.md` and write the arithmetic from THAT count. EP adds
> **six waves** and ⭐ **TEN seam rows** (§8.1 — NINE in revision 3, plus row 10, the
> `spatialLedgers` coverage manifest, added by chair ruling T1); the resulting totals are whatever the
> re-count plus those two numbers gives. If the re-count disagrees with the fold's
> PLAUSIBLE 75/66, **the tree wins and the disagreement is a STOP-and-report**, not a
> silent re-base. EP's rows compose AFTER the fold's rows in every table.

1. **FP §3 THE FLAG FAMILY — row 53** (MEASURED: 43 live + 1 ES + 8 WY = 52; EP is next):
   `| 53 | advanceEpochEnabled | EP-1 | the advance-epoch stream segment: living futures
   on every user advance, recorded nonces for byte-exact replay |`. The existing-flags
   paragraph gains: "`advanceEpochEnabled` has no upstream conjunction — it gates a
   stream segment, not a subject; EP-3's side-channel disposition may not light before
   EP-1. `advanceMultiTick` is a REAL default-on flag this program does not touch, but it
   already forks the pulse stream identity, so every EP fence fixes its state explicitly.
   The flag is read TWICE by design — once at the store mint and once inside the kernel
   beside the value (EP §2.3b, J-EP-9) — so the dark-state contract is flag-driven rather
   than value-driven; the second read is deliberate and is not a duplicate to sweep away."
2. **FP §4 CANONICAL MODELS — the EP entry:** "EP: one conditional TOP-LEVEL SCALAR
   `epoch` on `worldState.pulseHistory[]` rows (drop-when-absent; ONE per USER ADVANCE,
   never per tick — `collapseIntervalHistory` destroys N-1 of N records) + one conditional
   `advanceEpoch` on the persisted `worldState.pausedAdvance` cursor (re-threaded on
   resume exactly as `now` is) + under EP-3/Arm A one conditional
   `spatialLedgers.advanceEpoch = {byYear}` with exactly ONE writer whose ONE call site is
   inside `pulseKernel.js` immediately after the calendar advances (EP §3b.1a; `current` was
   STRUCK in revision 4, J-EP-12) and whose key joins `spatialUsage.js#EXEMPT_LEDGER_KEYS` in
   the same commit. ZERO new
   top-level worldState keys; ZERO `CONDITIONAL_LEDGER_KEYS` members (that array's order
   IS the serialized key order — append only, and EP needs no entry); no normalizer teach
   is owed (`ensureWorldState`'s `cloneArray` is a shallow per-record spread, not an
   allowlist — VERIFY-AT-BUILD); absent ⇒ the stream segment is not concatenated at all,
   NEVER `epoch:0`. Lifecycle-paths clause: docs/DESIGN_FP_ARCH_EP.md §8.4 (FOURTEEN
   paths, the account-IMPORT drop declared)."
3. **FP §5 THE WAVES — insertions.** EP-0 joins the EARLY-ELIGIBLE set. **EP-1, EP-2 and
   EP-3 land AFTER THE LIGHTING ROAD** — immediately after the CR-WR10-H discharge, which
   the fold package defines verbatim as "**SP-B + SP-B2 + ES-4 landed**" (that sentence is
   PART 5 of the fold package and lands with the fold; the live war volume today still
   says "the belief-legs wave (queued)") — and BEFORE the WY engine lane's PHASE-3 entry
   at WY-2. ⚠ **BOTH ES-4 AND WY-2 ARE FOLD-PACKAGE WAVE NAMES; neither exists in `docs/`
   until item #34 lands, so this ordering clause may not be written before the fold.**
   ⛔⛔ **ERRATUM, REPORTED AT THE 2026-08-07 FOLD AND NOT SILENTLY REWRITTEN. THE
   STRUCK HALF IS ~~"and BEFORE the WY engine lane's PHASE-3 entry at WY-2"~~ AND IT
   IS UNSATISFIABLE AGAINST THE LANDED ORDER.** This clause was authored believing
   WY-2 followed ES-4. MEASURED in the landed parent at `eca65c8a`, §5's folded-wave
   openers run in document order `WY-1 · WY-2 · ES-0 · ES-1 · ES-2 · ES-3 · ES-4 ·
   ES-5 · ES-6 · ES-7 · WY-3 · WY-6 · WY-11 · WY-4 · WY-5` — **WY-2 sits BEFORE ES-0**,
   so "after ES-4" and "before WY-2" cannot both hold. The SURVIVING half is the one
   carrying the argument: EP-1..EP-3 land immediately after the CR-WR10-H discharge
   completes at ES-4, which is where the fold placed them. The struck half was a
   redundant restatement of the same position under a stale belief about WY-2's slot,
   so nothing the three-part argument (a)/(b)/(c) asks for is lost.
   EP-4 is an INDEPENDENT LANE and may interleave anywhere after EP-0, **but its slice 2
   may not LIGHT before EP-1** (chair ruling R7 — the generator half of the living-futures
   claim rides the same flag as the engine half). EP-5 lands LAST, at the terminal-phase
   gate, beside the marketing pass. **The wave count amends +6 from the re-counted
   post-fold figure (VERIFY-AT-FOLD; the fold's own PLAUSIBLE figure is 75, which would
   give 81).**
   **THE ARGUMENT, in three parts:** (a) EP-1 touches `pulseKernel.js`, the banked pulse
   mouth that every dormancy golden, every soak fixture and 87 direct tests drive
   through — it wants the quietest window the schedule offers, and the lighting-road
   convergence IS that pause; (b) landing a stream-identity change mid-spine multiplies
   the chance that a legitimate SP/GR/TR golden movement is misattributed to the epoch or
   vice versa, and the R-BLD-10 lineage makes that misattribution expensive; (c) EP-5
   unlocks the marketing claim the owner parked until the program SHIPS, so EP wants to be
   late enough for its lit soak to ride the terminal soak and early enough that the
   constitutional amendment is not the last thing anyone touches. **The counter-position
   (EP-1 early, beside EP-0) is coherent** if the chair wants the seam proven before six
   programs build on the kernel; the cost is a kernel edit competing with the spine lane
   for the same file's quiet windows.
4. **`docs/SOL_QUEUE.md` §1 LANE A** — MEASURED, that lane runs items 1–18 today and
   carries no ES or WY row; the fold package's PART 1 inserts those as sub-bullets on
   existing rows 13 and 18 rather than as new numbered items, **so EP takes the same
   shape: a new bullet after the A2 corpus block**, never a renumbering. Text: "**EP — THE
   ADVANCE EPOCH** (`docs/DESIGN_FP_ARCH_EP.md`; owner directive 2026-08-05, the
   living-futures amendment): EP-0 early-eligible; EP-1 → EP-2 → EP-3 after the CR-WR10-H
   lighting discharge; EP-4 an independent generator-side lane whose flag-gated slice
   waits on EP-1; EP-5 at the terminal gate with the copy pass. ⚠ EP-1 edits
   `pulseKernel.js` under a chair-signed seam citing R-BLD-10 — quiet window mandatory.
   ⚠ EP-3 slice B is chair-gated on Q1; slice A is not. ⚠⚠ **SERIALIZATION (CQ5 class): EP-1
   is a FLAG WAVE (manifest + certification lane + first gate read in ONE commit) and EP-3
   ⭐ SLICE A (revision 6, chair ruling G1 — it carries the writer now)
   touches the SHARED `src/lib/spatialUsage.js` ledger-coverage manifest — NEITHER may
   build concurrently with another flag wave or another ledger-minting wave in the same
   worktree. Serialize, or one worktree each; CHECK-GIT-FIRST before every stage on a shared
   file.**" **Also §0 STANDING PROTOCOL**
   gains one clause, because the queue's own "EVERYTHING BUILDS DARK" line is now
   load-bearing for a constitutional change: "EP's dark-state claim is defined PER
   ADVANCE PATH (EP §2.4) and is FLAG-driven, not value-driven (EP §2.3b)."
5. **FP §9 THE SEAM MATRIX:** the ⭐ **TEN** EP rows (§8.1) join under prefix EP; the matrix
   count amends ⭐ **+10 from the re-counted post-fold figure** (VERIFY-AT-FOLD; the fold's
   PLAUSIBLE figure is 66, which would give 76). ⚠ **THE FIGURE MOVED FROM +9 IN REVISION 4**
   (chair ruling T1, §8.1 row 10) — an implementer inheriting +9 writes a wrong total into the
   parent volume. ⚠⚠ **AND THIS ITEM SAID "NINE" BESIDE ITS OWN "+10" UNTIL REVISION 5 — a
   count slip of exactly the family chair ruling F4 closes, found by the settling round, in
   the ONE item that publishes VERBATIM into `docs/DESIGN_FP_ARCHITECTURE.md`.** §8.1's
   heading, §5's VERIFY-AT-FOLD clause and the closing count all read TEN and always did; only
   this sentence disagreed with the table it was pointing at, which is the defect shape, not
   a judgement call.
6. **FP §11:** the list stays capped at ten; §11 gains one pointer: "The EP
   owner-amendment volume (docs/DESIGN_FP_ARCH_EP.md) carries five EP-prefixed chair
   questions and FOUR owner-gated parked rows — its §7/§7a are the authoritative lists."
   ⚠ **THE FIGURE IS FOUR AND THIS TEXT LANDS VERBATIM** (chair ruling P4): revision 2
   said TWO here while §7a tabled four, and this sentence publishes into the parent
   volume, so the slip would have escaped EP entirely.
7. **NO PREFIX ADMISSION IS OWED.** `EP` does NOT join `CHARTERED_VOLUME_PREFIXES`.
   MEASURED: `tests/lint/couplingInclusion.walker.test.js` scopes its census to
   `` /^src\/domain\/(?:worldPulse|spatial)\// ``, so `src/store` and `src/kernel` are
   outside it; `pulseKernel.js` and `worldState.js` are both `ARGUED_UNLAYERED`
   ("infrastructure host"); `advanceInterval.js` and `advanceCampaignWorld.js` are in the
   frozen unlayered baseline. An epoch is SUBSTRATE, not a subject any of the seven layer
   families owns — giving it a family would "make every layer's reading of a band word a
   cross-layer coupling, which is hosting by another name" (the walker's own words about
   the SP substrate leaves). The tenth-prefix tripwire stays armed, and it should.
   ⚠ **THE ONE OBLIGATION:** if any EP wave mints a NEW `.js` file under
   `src/domain/worldPulse/` or `src/domain/spatial/` it REDS under CR-FP-11 arm B and the
   baseline MAY NEVER GROW, so such a file takes a NEW `ARGUED_UNLAYERED` entry with a
   written reason in the same commit — **never a baseline row.** ⭐ **EP-3's writer/accessor
   leaf does not land there for LAYERING reasons, not to avoid that gate (J-EP-6, restated in
   revision 5 under chair ruling F5): it is substrate, and its importers span three sibling
   directories, so its home is their parent.** The distinction matters because a leaf at
   `src/domain/` top level is a documented CENSUS BLIND SPOT — the walker's own CANNOT-CATCH
   list says "a layer leaf that lands in a third directory is unclaimed and uncounted until
   the scope widens" — and **J-EP-6 may not be cited as precedent for putting a genuine
   coupling leaf there.**
8. ✅ **THE PROMISE AMENDMENT — ALREADY DISCHARGED BY THE CHAIR; NO QUEUE OBLIGATION
   REMAINS.** Revision 1 made this the highest-priority non-code item, on the correct
   reasoning that a successor reading `memory/the-promise-ratified.md` and not the
   2026-08-05 directive would correctly BLOCK this entire program (anomaly A7). **The
   chair has since amended that file in place to record the owner's 2026-08-05 signature,
   and has corrected the MEMORY.md history-reroll line (R5) as well.** Both are therefore
   struck from EP-5's charter and from this list; §8.6 states the resolution so a reader
   of this volume alone does not re-open it. **The remaining promise work is EP-5's
   forty-five in-tree homes only** (§8.5), none of them a memory file.

---

## §6 JUDGMENT BLOCKS (every one vetoable; an implementer NEVER re-rules one silently)

**J-EP-1 — EP CERTIFIES IN ITS OWN LANE.** A new
`src/domain/certification/subsystemRowsEpoch.js` rather than joining
`VIRTUAL_SUBSYSTEM_ROWS`, because `tests/domain/subsystemRowsVirtual.test.js` hard-codes
the frozen EIGHT and asserts three exact bijections plus
`VIRTUAL_PENDING_RULE_KEYS.toEqual([])` — a ninth member forces an edit there (the red
that bit TR-1). Veto cost: editing that test in EP-1's commit, legal but coupling this
program to a file three other programs also want.

**J-EP-2 — `epochSuffix` LIVES IN `src/kernel/prng.js`.** Three measured reasons: (a)
`pulseKernel.js` already imports from `prng.js`, so the seam costs ZERO new import lines
on a file banked at tolerance-zero — a new module reds the ratchet by itself; (b) the
`'::'` delimiter vocabulary and its "one label family, one spelling" law live in that
file's `fork` docblock, and a second home for delimiter-composing code is the split-brain
that law exists to prevent; (c) the call-path fence requires the spy OUTSIDE the calling
module, which `prng.js` satisfies by construction. The function does NOT touch
`createPRNG` or `fork` — those derivations stay frozen and owner-gated. Veto cost: a
chair-signed one-line ratchet-up on `pulseKernel.js`.

**J-EP-3 — THE PURITY FENCE INVERTS.** EP's fence 4 asserts CONFINEMENT (exactly one
entropy site, in `src/store`, through `generateSeed`, domain half provably pure) rather
than ABSENCE. The house absence arm would either red on day one or be silently scoped past
the mint — and a fence scoped past the thing it fences is worse than no fence.

**J-EP-4 — `pulseIdFor` STAYS EPOCH-BLIND.** The id is a within-timeline address; making
it epoch-aware is persisted-shape churn on every existing save for zero in-product
payoff. The cross-epoch key for debugging tools is the PAIR `(id, epoch)`, pinned at §8.1.

**J-EP-5 — CATCH-UP AND SURVEYOR AUTONOMY MINT.** Both advance a world not yet lived, so
minting is correct and the lived-past law then freezes it. The opposite reading (only a
DM's click is a "user advance", so catch-up inherits the last recorded epoch) is
defensible and is recorded so a later reader finds a decision. Neither reading changes
flag-dark behaviour.

**J-EP-6 — EP-3's WRITER/ACCESSOR LEAF LANDS AT `src/domain/` TOP LEVEL, OUTSIDE
`worldPulse/` AND `spatial/`. ⭐ THE RATIONALE IS RESTATED IN REVISION 5 ON LAYERING GROUNDS
ONLY (chair ruling F5).** Revisions 3 and 4 justified the home partly by gate-avoidance —
"CR-FP-11 arm B reds a NEW unlayered module in either directory … `src/domain/` … sidesteps
the census entirely." **That clause is STRUCK.** It is measurably TRUE (`couplingInclusion.walker.test.js`
freezes `CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//`, and its own STANDING
CANNOT-CATCH LIST says verbatim that *"a layer leaf that lands in a third directory is
unclaimed and uncounted until the scope widens"*), and that is precisely the problem: **it is
the same move §3b.1a NAMES AND REFUSES one section earlier**, where routing a ledger write
through the store layer would have evaded the coverage manifest. A volume may not refuse a
registration-evasion route in §3b.1a and offer one in §6. **The home is RIGHT; the argument
was asymmetric.** THREE independent layering reasons, each measured, and none of them a gate:

1. **THE LEAF IS SUBSTRATE, NOT A LAYER SUBJECT.** §5 item 7 already rules this in the
   walker's own vocabulary: an epoch is "SUBSTRATE, not a subject any of the seven layer
   families owns," and giving it a family would "make every layer's reading of a band word a
   cross-layer coupling, which is hosting by another name." A module that would have to
   claim a layer it does not belong to — or take an exemption to excuse the claim — is
   telling you its home is wrong. **The exemption is the tell, not the remedy.**
2. **ITS CALLERS SPAN THREE DIRECTORIES, SO IT BELONGS ABOVE ALL THREE.** MEASURED, the nine
   family-2 re-roots plus the writer put importers in `src/domain/worldPulse/`
   (`pulseKernel.js`, `generosityKernel.js`, `traditionsKernel.js`, `roadsKernel.js`,
   `npcLadderKernel.js`), `src/domain/traditions/` (`politics.js`, `relations.js`) and
   `src/domain/townMap/` (`mapDress.js`). A leaf living inside `worldPulse/` and imported by
   `townMap/` and `traditions/` is a downward-pointing dependency by construction; the
   correct home for a leaf three sibling directories all read is their PARENT.
3. **`src/domain/` TOP LEVEL IS THE ESTABLISHED HOME FOR THIS EXACT CLASS.** MEASURED,
   `ls src/domain/*.js | wc -l` returns **91**, and the neighbours are the same kind of
   thing: `clock.js` (the wall-clock seam this program's `assertEpochPinnedInTest` joins),
   `clone.js`, `foodLedger.js`. The home is conventional on its own, independent of any
   census boundary.

⚠ **THE CENSUS CONSEQUENCE IS RECORDED AS A HAZARD, NOT AS A REASON, AND MAY NOT BE CITED AS
PRECEDENT.** A leaf at `src/domain/` top level IS outside CR-FP-11's scope, and that is a
BLIND SPOT the walker itself documents — a genuine coupling leaf placed there would be
unclaimed on both sides. **EP's leaf is safe there because it imports nothing across ports
and is read as substrate, not because the census cannot see it.** A future wave that cites
J-EP-6 to place a real coupling leaf outside the scope is misciting it, and re-opens exactly
the blindness CR-FP-11 arm B was built to close.

**THE REGISTRATION FALLBACK STANDS UNCHANGED.** If the correct home turns out to be inside
the censused tree, the file takes a NEW `ARGUED_UNLAYERED` entry with a written reason in the
same commit — the `Object.freeze({ module: reason })` idiom the walker already asserts total —
**never a baseline row**, because the unlayered baseline may only shrink.

**J-EP-7 — THE EPOCH DOES NOT COVER THE INTERVAL-CADENCE VARIANCE.** `advanceMultiTick`
already forks the interval term. That fork PREDATES this program, is default-on, and is a
soak killswitch the owner holds. EP does not absorb, normalize or hide it — it PINS it, so
no EP fence can compare two different streams and call the difference dormancy. Absorbing
it would be a same-seed shift for every existing world with the killswitch flipped, a THE
PROMISE event this directive does not authorize.

**J-EP-8 — LINEAR-WITH-DISCARD IS THE BRANCHING MODEL** (Q2). The discarded future is not
retained. A timeline TREE is a different product — recorded, not built.

**J-EP-9 — THE KERNEL READS THE FLAG BESIDE THE VALUE (chair ruling R4; revision 2).**
`simulateCampaignWorldPulse` gates the epoch term on
`simulationRules?.advanceEpochEnabled === true` rather than on the value's truthiness, so
the epoch is structurally unreachable in a flag-dark world **on every path, including the
persisted-cursor resume** — which is the one path where a value can outlive a flag flip
(`pausedAdvance` is a `CONDITIONAL_LEDGER_KEYS` member; the resume re-threads
`options.epoch || cursor.advanceEpoch || null` with no flag re-read). It costs a second
by-name read of a flag already read at the store layer, and a token on the kernel's
tightest budget. **Veto cost:** a value-driven contract plus an explicit ruling and pin
that "a cursor epoch outlives a flag flip, deliberately" — coherent, but it makes the
directive's dark clause a convention rather than a construction, and the chair declined
it. An implementer who finds the line budget immovable STOPS and reports; **dropping the
gate silently is the one refactor this volume forbids by name.**

**J-EP-10 — EP TAKES THE EPOCH AT FORCE_RESETTLE BUT DOES NOT ADD A TICK TERM (chair
ruling R3; revision 2).** MEASURED, `realmVerbExecution.js` FORCE_RESETTLE composes
`` `${String(state.rngSeed ?? 'realm')}:realm_verb` `` — no tick, no entity — so every
resettle a campaign ever performs draws from one stream in the same order. EP gives it the
epoch (family 1's reason: a re-advanced future must re-draw a resettle outcome) and gives
it the epoch ONLY. **Adding the missing tick term would be a same-seed shift for every
existing world that has ever resettled, in BOTH flag states** — a THE PROMISE event this
directive does not authorize — so the pre-existing tick-invariance is recorded as a
separate owner-queue row (§7a) and as an in-file note, never repaired in passing. Veto
cost: leaving the row epoch-blind, which reintroduces exactly the "the fresh future is the
old future" failure for one DM verb.

**⭐⭐ J-EP-11 — EP-3 SLICE B BUYS ONE LINE ON `pulseKernel.js`, DECLARED IN ADVANCE
(chair ruling P1; revision 3).** MEASURED (§0.3 R9): row 1's IN-PULSE read site is
`pulseKernel.js`'s `seasonalContextFor({ rngSeed: startingWorldState.rngSeed, … })` — the
severity the simulation actually runs on. Under Arm A it must be re-rooted, which needs
`yearStreamSeedOf` in scope, which needs **one new import line on a file banked at
tolerance zero in both directions.** Three arms were measured and two are refused:

- ⛔ **Fold the accessor into `prng.js`** so edit 1's existing import carries it for free.
  REFUSED: the accessor reads `worldState.spatialLedgers.advanceEpoch.byYear`, and putting
  worldState-shape knowledge inside the PRNG primitive is exactly the split-brain J-EP-2
  invokes one layer down. A free line is not worth a layering inversion in the file whose
  delimiter law the whole estate depends on.
- ⛔ **Declare row 1 epoch-blind IN-PULSE while re-rooting its display caller.** REFUSED as
  INCOHERENT, not merely costly: `mapDress.js` would dress a year-anchored winter while the
  simulation ran an `rngSeed`-rooted one — the precise display-parity failure the
  DISPLAY-SURFACE RULE exists to prevent, arrived at from the opposite direction.
- ✅ **RULED: the accessor leaf lands in a plain `src/domain/` leaf (J-EP-6's home), and
  ⭐ EP-3 SLICE A budgets ONE new import line on `pulseKernel.js` as a PLANNED, chair-signed
  ratchet-up of +1** (revision 6 moved the budget off slice B with the writer, chair ruling
  G1; slice B then adds `yearStreamSeedOf` to that same line at +0).** It is declared here, in §3b.1's table, in §0.2 item 1 and in EP-3's
  budget line, so the enforcer's disagreement at build is an EXPECTED +1 and anything else
  is a STOP. **A discovered ratchet move is an incident; a declared one is a budget.**

⭐ **THE +1 STILL BUYS MORE THAN REVISION 3 THOUGHT (chair ruling T1, revision 4).** The
same leaf now also hosts the `byYear` WRITER (§3b.1a), whose call site is seam edit 9 inside
the same file. **That does NOT make the ratchet +2:** the writer and the accessor are
exported from ONE module, so `pulseKernel.js` gains ONE import line carrying both symbols,
and edit 9 `;`-joins onto an existing line at +0. **The declared figure is unchanged at +1,
and it now covers three token edits instead of two** — which is the argument FOR the
one-leaf home rather than a separate writer module, and it is recorded so a future pass does
not "tidy" the writer into its own file and silently buy a second line.

**Veto cost:** Arm B for row 1 alone — the weather belongs to the starting world while the
rest of family 2 takes the year anchor. That is coherent (it is Arm B applied to one row)
but it splits the family's rationale across two arms and needs its own pin that the
in-pulse and display readings still AGREE. Recorded so a chair choosing it finds the cost
rather than re-deriving it.

**⭐⭐ J-EP-12 — `current` IS STRUCK FROM THE ARM-A LEDGER (chair ruling T1, revision 4).**
Revision 3 declared `spatialLedgers.advanceEpoch = { current, byYear }`. **The ledger is
`{ byYear }` only.** THREE measured reasons, and the third is the one that decides it.
(a) **`current` has no reader.** The pending epoch is ARGS-BORNE by §3a's own law — a
module-scoped or ambient read reds R-18 paranoia mode on every advance — so every consumer
that needs it already has it as an argument. (b) **It duplicates a value that already has
two homes**, the pulse record (M1) and the paused cursor (M2), each with its own lifecycle
clause in §8.4; a third would need a fourteenth-path walk of its own. (c) ⛔ **It is a
FOURTH FLAG-DARK LEAK SURFACE.** §2.3b exists because a value can outlive a flag flip on
persisted state; `current` would persist the pending epoch into `spatialLedgers`, so a
world that pauses lit, flips dark and reloads carries a live epoch in a flag-dark ledger —
the exact cell chain link L1 was written to close, re-opened at a new address for no
consumer. **Veto cost:** a debugging convenience (reading the last epoch off the world
without opening `pulseHistory`), purchasable at any time as a DERIVED read over
`pulseHistory[last].epoch`, which is where it already is.

**⭐⭐ J-EP-13 — `yearBase` IS A REQUIRED ACCESSOR ARGUMENT, BECAUSE THE ESTATE HAS THREE
YEAR DERIVATIONS IN TWO BASES (chair ruling T1's companion finding, §0.3 R12; revision 4).**
MEASURED: `seasonForTick(weeks).year` is `floor(weeks/52) + 1` and feeds rows
1/3/5/6/7/8/9; `intelYearOf(weeks)` (row 13) and `npcLadderContest.js#yearOf(weeks)`
(row 20) are both `floor(weeks/52)`, with **no `+1`**. All three name the same lived year;
two name it one lower. **The `byYear` map is keyed on the CANONICAL 1-BASED calendar year**
— the calendar's own vocabulary, the one `worldState.calendar.year` and `seasonForTick`
already agree on — **and `yearStreamSeedOf` takes the CALLER's `yearBase` as a REQUIRED
explicit argument**, normalizing with `year + (1 - yearBase)`. **There is no default**, in
exactly the style §3b.3 already mandates for `absent`: omitting it is a type error, never a
silent guess. **Why not normalize at each call site instead:** because that spreads the
+1 across eight files where the next reader cannot see it, and the estate's banked
first-match/count-slip history says an arithmetic constant repeated in eight places drifts.
**Why not re-key the map per family:** two maps means two writers, and the single-writer
law is what makes the lived-past guarantee auditable. **Veto cost:** a per-family accessor
pair (`yearStreamSeedOfCalendar` / `yearStreamSeedOfZeroBased`), which is coherent and
costs one more export plus one more classification row in the census walker; it is the
honest fallback if the chair dislikes a numeric argument that reads as a magic base.

**⭐⭐ J-EP-14 — THE WRITER, THE LEAF, SEAM EDIT 9, THE +1 IMPORT AND THE MANIFEST ROW MOVE
FROM SLICE B TO SLICE A (chair ruling G1, §0.3 R13; revision 6).** The chair ruled that
`tickStreamSeedOf`'s epoch source is the stamped ledger in the `worldState` the site receives.
**That ruling has a slice consequence and it is not optional:** slice A ships under EITHER arm
by §3b.2's own ruling, slice B is Q1-gated, and a slice that ships under either arm cannot
depend on one that ships under one. **RULED: slice A lands the leaf, the writer's `latest`
half, `tickStreamSeedOf`, seam edit 9, the ONE import line and the ONE `EXEMPT_LEDGER_KEYS`
row (with the CQ5-class serialization law attached); slice B GROWS the same writer with the
`byYear` half, adds `yearStreamSeedOf` to the import line slice A bought, and lands seam edits
7 and 8 plus its eight read-site re-roots.** ⭐ **Under Arm B, slice B never builds and `byYear`
is never written**, so the declined arm leaves no dead persisted sub-key — the same test
J-EP-12 applied to `current`, applied to the half that would otherwise be orphaned. **Why not
the alternatives:** (a) *thread the epoch to each family-1 stage* — MEASURED, the family-1
hosts sit behind `assizeKernel.js`, `settlementLifecycleKernel.js` and `applyWorldPulse.js`,
so this costs kernel and apply-side edits the seam contract forbids by name
("`applyWorldPulse.js` is untouched") and would have to be enumerated and budgeted as J-EP-11
budgeted its +1; (b) *give slice A its own second leaf and its own second import line* —
coherent, but it buys a SECOND line on a tolerance-zero file for a fact one leaf already
carries, and it splits the single-writer law across two modules; (c) *make slice A read
`byYear`* — REFUSED on correctness, not on cost: FIRST-WINS means a mid-year advance reads the
epoch of the advance that first entered the year, so **an undo-and-re-advance inside a lived
year would re-draw family 1 IDENTICALLY** — the feature dead for the commonest interaction
there is, in the family whose declared rationale is "a re-advanced future must re-draw them."
**Veto cost:** slice A and slice B merge into ONE chair-gated slice, which restores the
entanglement revision 2 removed and makes the whole side-channel disposition wait on Q1.

**⭐ J-EP-15 — THE TWO DM DOORS READ THE STAMP, AND THAT IS THE RULING RATHER THAN AN
OVERSIGHT (chair ruling G1's "name it" clause; revision 6).** MEASURED,
`applyWorldPulseOutcomes` has FIVE call sites and only one is the pulse; two of the others
(`mintRealmVerbProposal`, `applyWorldPulseProposal`) reach `applyRealmVerbOrder` and therefore
family-1 rows 14/15/16 with a world the pulse did not compose. **RULED: they read the same
`latest` under the same selection rule, which on a committed world holds because the last
advance stamped at exactly the tick that world sits at.** A DM order therefore resolves in the
epoch the world it acts on is living in — coherent, stable for a given world (re-approving the
same proposal draws identically), and fresh after an undo-and-re-advance because the world is
then living in a new epoch. ⚠ **THE ONE CONSEQUENCE THAT IS STATED RATHER THAN LEFT TO BE
FOUND:** a world that ran LIT and then loses the flag keeps a selectable `latest` until its
next advance moves the tick, so its DM doors stay epoch-bearing for that one tick. That is the
same property `yearStreamSeedOf` has by design under Arm A (a lived year keeps its weather
regardless of the flag) and it is BOUNDED here to one tick rather than to a campaign; a pin
asserts both directions. **Veto cost:** an explicit door-side opt-out — pass `{ absent }` with
a `null` ledger at the two doors, which is one extra argument at two call sites and makes DM
orders permanently epoch-blind, coherent but at odds with the directive's "every click" clause.
**⚠ NOT RULED HERE, and recorded as §7b row B2 rather than decided silently:** whether a DM
order re-issued on the SAME world should itself draw fresh.

---

## §7 OPEN CHAIR QUESTIONS (five, ranked by blocking power; each vetoable)

**Q1 — The year-keyed side-channel arm (blocks EP-3 SLICE B ONLY; EP-1, EP-2 and EP-3
slice A ship either way — narrowed in revision 2).** **NINE compositions at EIGHT READ
SITES across NINE modules** (rows 1/3/5/6/7/8/9/13 plus the `hash01` family's row 20,
which revision 1 could not count) draw TICK-INVARIANT, YEAR-keyed verdicts off the world
seed by declared law, re-derived fresh every tick and never persisted — and TWO have
DISPLAY callers
outside the pulse (`seasonalSeverityFor` → `mapDress.js`; and, though it is not itself
year-keyed, `realizeCauseWalk` → `CauseWalkPanel.jsx` takes the same display-surface
rule). Arm A gives them a year-stable anchor (`spatialLedgers.advanceEpoch.byYear`, one
writer, ≤ ~100 tiny rows) so a lived year keeps its weather and an un-lived year draws
fresh. Arm B declares them epoch-invariant, costing zero new state and no display seam.
**RECOMMENDATION: Arm A, and revision 2's larger census SHARPENS it** — the tell is
exactly what makes a re-drawn future feel mechanical, the anchor map is the smallest state
that buys full coherence, and it is the only construction under which the two display
surfaces have a state-derived value to read at all (under Arm B they must be declared
permanently epoch-blind by fiat). Arm B is the honest fallback if the chair wants zero
persisted growth in this program; the coherence cost is narrower than revision 1 implied,
because fourteen of the twenty-five compositions re-draw under either arm.

⚠ **THE PRICE OF ARM A ROSE IN REVISION 3, AND THE CHAIR SHOULD SEE IT BEFORE RULING
(chair ruling P1).** Revision 2 costed Arm A as "one sub-key, one accessor, nine sites, two
display seams" with **no kernel cost at all**. MEASURED, that was wrong: row 1's IN-PULSE
read site is inside `pulseKernel.js` (§0.3 R9, RS-2), so Arm A now costs **two further
token edits on the banked pulse mouth plus ONE DECLARED NEW LINE there (J-EP-11)** — the
only line this entire program adds to that file. Arm B costs zero kernel edits by
construction, because it re-roots nothing in family 2. **The recommendation is UNCHANGED —
Arm A — but the trade the chair is signing is now "one line on `pulseKernel.js`" and not
"no kernel cost", and J-EP-11 records both the refused alternatives and the veto path
(Arm B for row 1 alone).**

**Q2 — The branching model.** LINEAR-WITH-DISCARD vs KEEP-BOTH-TIMELINES.
**RECOMMENDATION: linear-with-discard** (J-EP-8). A tree needs a persisted branch
structure, a UI to navigate it, and a story about which branch a share code addresses — a
different product, and the directive's own framing ("undo deletes the history entry") is
linear. ⚠ Related live limitation, INDEPENDENT of this program: `pulseUndoStack` is
SESSION-ONLY (not in `partialize`), so the headline user story works only WITHIN a session
unless the advance was paused. Whether to persist the undo ring is an owner-gated
persistence-shape question — **flagged, not decided here.**

**Q3 — The replay horizon.** `MAX_HISTORY = 80` evicts old records and their epochs, so
byte-exact replay is bounded to the newest 80 advances — for exactly the long-lived worlds
most worth debugging. **RECOMMENDATION: accept and DECLARE the bound** (volume + ledger
row + an in-file comment at `appendPulseHistory`). A parallel uncapped epoch log is a new
persisted structure whose own size story must then be told, on a ring already carrying
2-4MB through every Supabase upsert and every undo snapshot.

**Q4 — The flag name.** `advanceEpochEnabled` (the seam) vs `livingFuturesEnabled` (the
product). **RECOMMENDATION: `advanceEpochEnabled`.** Zero collisions measured for either,
but a flag named after the marketing claim invites a sweep to conflate the gate with the
copy — and the copy is EP-5's, gated separately.

**Q5 — The sample-fork disposition (A4/A5).** `forkSeedFor(sample, userId)` is a pure
function of (card, user): the same user forking the same card gets the same town forever.
ADDRESS door or LIVING door? **RECOMMENDATION: LIVING DOOR — the fork button mints fresh;
the sample's own seed stays typeable in the SeedField, which is the address.** The
directive is explicit that "clicking generate/reroll is the living door (always a new
draw)", and the existing docstring's justification ("so two users forking the same sample
get mechanically-different towns") is about different USERS, never a second click. This
ruling also removes two of the three callers that poison `state.config.seed` (H1).

**Q5 IS PARTLY SUPERSEDED.** Its subject (A4/A5) is now an OWNER-GATED parked row (§7a
row 1) rather than an EP-4 slice, per chair ruling R7. The recommendation stands verbatim
and travels with the parked row; what changed is WHO signs it.

**A RECORDED DEFERRAL, not a question.** Row A10 (history reroll still rerolls authored
ENTRIES inside `historicalEvents[]` / `currentTensions[]` away — no id, no provenance
marker) is **deliberately deferred, documented, not a bug to re-find.** It predates this
directive, is already commented at the branch itself, and closing it needs per-entry
provenance ids — its own wave in the regen-preservation family, not here.

---

## §7a OWNER-GATED PARKED ROWS (extracted from EP-4 by chair ruling R7; each carries a
## recommendation, none builds inside this program)

**A wave may not absorb an owner-gated class by calling it a repair.** These **FOUR** rows
leave EP entirely and become owner-queue entries; EP-4 re-scopes to the remainder (§4).

⚠ **THE COUNT IS FOUR, EVERYWHERE (chair ruling P4).** Revision 2 stated it four different
ways for a four-row table — "three" in this intro, "three" in row 3, "three" in the closing
provenance, and "TWO" in §5 item 6's verbatim-landing pointer text, which would have
published the wrong figure into `docs/DESIGN_FP_ARCHITECTURE.md`. **The table below has
FOUR rows; every statement of the count in this volume now reads FOUR**, and a summary
sentence disagreeing with the table is a defect in this volume, not a judgement call.

| # | Row | Owner-gated class | Recommendation |
|---|---|---|---|
| 1 | **A4/A5 — the sample-fork seed.** `src/data/sampleSettlements.js#forkSeedFor` is `` `${sample.config.seed}-${suffix}` ``, a pure function of (card, user), so the same user forking the same card gets the same town forever. Consumers: `generate/FoundingWorlds.jsx` (reads `s.auth.tier`; the fork is tier-gated above town) and `SettlementsPanel.jsx#forkSample` (a tier-gated sample "opens the purchase modal") | **PAID / FOUNDER SURFACE BEHAVIOUR** | **LIVING DOOR** — the fork button mints fresh; the sample's own seed stays typeable in the `SeedField`, which is the address. The existing docstring's justification ("so two users forking the same sample get mechanically-different towns") is about different USERS, never a second click. ⚠ This ruling also removes two of the three callers that poison `state.config.seed` (H1), so if it is DECLINED, H1's repair must still stand on its own |
| 2 | **A11 — the town-map layout reroll.** MEASURED `export function nextLayoutVariant(edits) { return readLayoutVariant(edits) + 1; }`; `normalizeMapEdits` writes `if (variant > 0) out.layoutVariant = variant;`, and `doReset` zeroes it — so reset-then-reroll replays variant 1 forever | **PERSISTED SHAPE** (a key in a normalizer whose own docblock exists for "a stable stringify … byte-identity") | **MINT A SEED, DO NOT WIDEN THE COUNTER.** A counter that reset zeroes cannot be a living door; a seed field is the shape the rest of the estate already uses. Requires a `mapEdits` KEY-ORDER byte-identity proof and a migration story for existing `layoutVariant` values, which is why it is not a passing repair |
| 3 | **H5 — `_regenSeed` holds only the LAST reroll** (`regenHistoryPipeline`'s own docstring: "ROOT `_regenSeed` HOLDS THE LAST SECTION REROLL, whichever section it was"), so an earlier reroll in a chain is unreplayable | **PERSISTED SHAPE on a DM-share blob** (migration 121 + `publicSafe.js`; the gallery strip is a top-level KEY list) | Widen to a per-action list at the ROOT only, with the gallery key-list impact measured first. **Already chair-gated in revision 1; recorded here so all FOUR parked rows sit in one place** |
| 4 | **J-EP-10's separate finding — FORCE_RESETTLE's stream is TICK-INVARIANT** (`` `${rngSeed}:realm_verb` ``, no tick, no entity) | **SAME-SEED SHIFT / THE PROMISE** | Add the tick term as its OWN owner-signed change with a recorded golden shift. EP deliberately does not, in either flag state (J-EP-10) |

## §7b CHAIR-OWED DISPOSITIONS (revision 4 — NOT owner-gated, NOT extracted from any wave;
## reported here because EP measured them and nothing else in the estate has)

⚠ **THIS TABLE IS DELIBERATELY SEPARATE FROM §7a AND DOES NOT MOVE ITS COUNT.** §7a is
OWNER-GATED rows extracted from EP-4 and its figure is **FOUR** (chair ruling P4, unchanged
in revisions 4, 5 and 6). The rows below are neither owner-gated nor extracted from a wave —
they are findings EP made while measuring, which belong to the chair rather than to any EP
slice. **EP builds none of them and deletes nothing.** ⭐ **THIS TABLE'S OWN COUNT IS TWO from
revision 6 on** (B1 and B2), and every statement of it in this volume says TWO.

| # | Row | What EP measured | Recommendation |
|---|---|---|---|
| **B2** ⭐ | **SHOULD A DM ORDER RE-ISSUED ON THE SAME WORLD DRAW FRESH?** (new in revision 6, chair ruling G1's "name it" clause; J-EP-15 rules the epoch READ and deliberately does not rule this) | MEASURED at HEAD, independent of this program: `mintRealmVerbProposal` composes `` `${String(state.rngSeed ?? 'realm')}:realm_verb:${nowTick}` `` off the COMMITTED world, so **two identical DM orders issued on the same tick already draw identically today**, and undoing an order and re-issuing it replays the same outcome. Under J-EP-15 the epoch enters that key, so the draw changes across a re-ADVANCE — but not across a re-ISSUE on the same world. The directive's engine clause governs time advances and its generator clause governs generate/reroll affordances; **a DM verb that mints an outcome is neither, and §3e's eighteen-affordance census does not carry it** | **REPORT, DO NOT BUILD.** Two readings are live and the chair owns the choice: (a) a DM order is an ACTION IN THE WORLD, so replaying it identically is correct and the current behaviour stands; (b) it is a user-facing draw and the directive's "every click" clause reaches it, in which case it needs a mint of its own at the store layer and joins the §3e affordance manifest as a NINETEENTH row. ⚠ **EP changes it in neither flag state**, and the pre-existing same-tick collision is recorded here so the next auditor finds a ruling rather than a fresh bug |
| **B1** | ⭐ **`src/domain/ai/personaSlicer.js` HAS ZERO IMPORTERS IN `src` — a DEAD MODULE by production reach** | MEASURED at HEAD: `grep -rn "personaSlicer" src tests scripts` (excluding the file itself) returns **only TEST importers** — `tests/domain/personaSlicer.test.js`, `tests/domain/personaSlicerFactionRoster.test.js`, `tests/domain/factionNamePrecedence.test.js` — plus two `tests/lint/negativeAssertionAnchor.walker.test.js` manifest rows and two comment mentions in `tests/lint/factionNamePrecedenceScan.test.js`. **No `src` file imports it.** It is exercised, pinned and maintained by three test files and reached by no product path | ⛔ **REPORT, NEVER DELETE — and EP has no standing to touch it.** Two readings are live and the chair owns the choice: (a) it is AI-grounding infrastructure staged AHEAD of the surface that will consume it, in which case the right act is a one-line in-file note saying so, so the next auditor does not "clean it up"; (b) it is a genuinely orphaned module, in which case its removal is a separate decision with its own consumer census and its own test-estate consequences (three test files and two walker manifest rows move with it). ⚠ **What EP DOES do about it is bounded and already done:** the entropy-root census walker's MANDATORY negative control is RE-ANCHORED off it onto a LIVE module (§3b.2a NC-1), because a control anchored on unreachable code passes by absence rather than by discrimination — the pin-vacuity class this program has banked five times. personaSlicer's control is RETAINED as the labelled WEAK secondary, never deleted |

---

## §8 SEAMS PINNED BOTH SIDES

### 8.1 The TEN seam rows (row 9 added by chair ruling R9; ⭐ row 10 by chair ruling T1)

| # | Neighbour | The contract | The tripwire |
|---|---|---|---|
| 1 | `src/kernel/prng.js` (the delimiter law) | `epochSuffix` is a NEW SEGMENT in a ROOT composition, never a change to `fork`'s derivation; the `epoch` family may not alias any frozen embedded-delimiter family | `prngForkLabelDelimiter.test.js` gains an `epoch` row; a change to `fork` reds it |
| 2 | `pulseKernel.js` (R-BLD-10) | ⭐ **THE CONTRACT IS §3b.1's ENUMERATED TOKEN-EDIT LIST, not a number** (chair ruling P1; ⭐ **the list GREW in revision 4, chair ruling T1**): **SIX** edits in EP-1 at ZERO new lines, **THREE** more in EP-3 — ⭐ **the WRITER's ONE call site (edit 9) in SLICE A and the two re-roots (7, 8) in SLICE B, revision 6's split under chair ruling G1** — all three at zero new lines, at a DECLARED +1 for the leaf import, bought in SLICE A (J-EP-11); **NINE total**. Stage order and PRNG CALL ORDER untouched in every one; the seam comment cites R-BLD-10 | `sizeBaseline` tolerance-zero both directions **against the DECLARED figure per wave (EP-1: +0; ⭐ EP-3 slice A: +1; EP-3 slice B: +0)** + a source pin asserting the R-BLD-10 citation appears EXACTLY ONCE + **an edit-inventory pin: the wave's diff on this file touches ONLY the enumerated lines — ⭐ NINE of them, re-counted in revision 4 — and an unlisted edit is a STOP.** ⚠ **THE EDIT-INVENTORY PIN IS THE ONE THAT MOVED**, and it is the reason the count is stated rather than described: a pin frozen at EIGHT would have PASSED a slice-B diff that omitted the writer entirely, which is exactly the state revision 3 shipped |
| 3 | `advanceMultiTick` (a real default-on flag) | EP absorbs nothing; every EP fence FIXES its state (J-EP-7) | a fence that does not pin it fails the anchored arm of fence 4 |
| 4 | The dormancy estate (32 goldens · 27 fixtures · 8 oracle suites · 4 four-fence sets) | dark ⇒ no new serialized key, no changed string ⇒ zero re-records | any golden that moves is a STOP-and-report, never a re-record (FP §10.4) |
| 5 | `tests/store/advanceFullAutoResolve.test.js` (two cross-store byte-equality claims) | taught `options.epoch`, never weakened | the pins stay as strict as today; a relaxed assertion is a rejected diff |
| 6 | The OUT-OF-DENOMINATOR class (`tradition:owner`, `tradition:drift`, `tradition:genesis`, `custom:window`, `xconflict:`, `successor:`, the `src/domain/display/` `fnv1a32` prose pickers, `grammarReceipt`'s `sourceEventId`) | deliberately epoch-invariant — identity facts must not wobble; VERIFIED none reads `worldState.rngSeed` | the ENTROPY-ROOT census walker classifies them; a reclassification needs a chair row |
| 7 | Debugging tools / any consumer indexing pulse records | the cross-epoch key is the PAIR `(id, epoch)`; `pulseIdFor` stays epoch-blind (J-EP-4) | a consumer keying on `id` alone across an undo boundary is a documented ambiguity, pinned |
| 8 | The WY / ES folds (both landing before this volume — ⭐ **queue item #34 is DISCHARGED: the fold LANDED at `7794cb4a` mid-revision-6, so this row's neighbour is now the LIVE post-fold tree**) | EP touches no WY or ES surface; it changes the STREAM every one of their draws rides | EP-1's fences run against the post-fold tree; a WY/ES golden movement at EP-1 is a STOP |
| 9 | ⭐ **`warTermination.js`'s SYNTHETIC pulseHistory record** (chair ruling R9) | EP's "every lit record carries an epoch" totality pin must EXCLUDE it by MEASURED IDENTITY, never by count | see the anchored negative below; a future second synthetic constructor that the exclusion does not name REDS the pin, which is the intended alarm |
| **10** | ⭐⭐ **`src/lib/spatialUsage.js` — THE `spatialLedgers` COVERAGE MANIFEST** (chair ruling T1, revision 4; ⭐ **re-attributed to SLICE A in revision 6, chair ruling G1**) | ⭐ **EP-3 SLICE A** WRITES a `spatialLedgers` sub-key via `setSpatialLedger` from a module under `src/domain`, so `advanceEpoch` **must** be classified as TRACKED or EXEMPT in the SAME COMMIT. **RULED EXEMPT** — a stream-address ANNOTATION in the `provenance`/`reframes` class, not an exercised mover; adoption is legible from `advanceEpochEnabled` itself, and a key count would read the calendar rather than the layer. ⛔ **The store-layer escape (`spatialSubstrate`'s precedent, written outside `src/domain` and absent from both lists) is NAMED AND REFUSED** — routing around a registration convention to save a manifest row is the failure the convention exists to prevent. ⚠⚠ ⭐ **CQ5-CLASS SHARED-FILE TOUCH (chair ruling F7, revision 5): this manifest is edited by EVERY ledger-minting wave, so ⭐ **SLICE A** is SERIALIZED against flag waves and other ledger-minting waves — serialize or one worktree each, CHECK-GIT-FIRST before staging, and prove the gate inside a `git archive` of the INDEX if a concurrent lane is unavoidable** | ⚠ **PATH CORRECTED IN REVISION 5 (chair ruling F3): `tests/lib/spatialLedgerCoverage.walker.test.js`, NOT `tests/lint/` — cited BY SYMBOL because that is what this volume's own navigation law asks for.** `describe('spatialUsage ledger-coverage walker (lib-infra-copy-1)')`; `writtenLedgerKeys()` scans every `setSpatialLedger` write under `src/domain` (excluding only `ACCESSOR_DEF`, resolving `WRITE_LITERAL_RE` and `WRITE_CONST_RE`); the test `'every written spatialLedgers key is TRACKED or EXEMPT (and no phantom classifications)'` asserts `expect(classified).toEqual(written)` — EXACT SET EQUALITY, BOTH directions — so an unclassified `advanceEpoch` REDS ⭐ **slice A** on day one, and a stale row REDS if the ledger is ever renamed or removed |

**ROW 9, spelled out.** MEASURED: `src/domain/worldPulse/warTermination.js` builds
`orientedState` with
`` pulseHistory: [ ...(Array.isArray(state.pulseHistory) ? state.pulseHistory : []), { tick: syntheticPrior.tick, warTerminationReads: [syntheticPrior] } ] `` —
a transient read-shim fed to `readWarTerminations`, **never persisted**, so it is harmless
to the lived-past law. But it is a SECOND construction of a record-shaped object, and a
naive "every record in `pulseHistory` carries an `epoch` when lit" pin would red on it.
**THE ANCHORED NEGATIVE, by measured identity rather than by position:** a real
`pulseRecord` carries `id`, `tick`, `interval`, `committed`, `createdAt` (verified at the
`const pulseRecord = {` literal in `pulseKernel.js`); the synthetic one carries **exactly
two keys, `tick` and `warTerminationReads`, and NO `createdAt`**. The pin excludes rows
matching that identity, asserts the exclusion matched EXACTLY ONE row in the fixture that
exercises it (a zero-match exclusion is the vacuity to catch), and carries
`// anchored:` with a non-empty pulseHistory seeded first. The ONE-SEAM claim of §1.2(a)
is otherwise CONFIRMED and unchanged: `appendPulseHistory` (`worldState.js`) is the only
append, reached only via `provenanceKernel.js#appendPulseHistoryWithProvenance` from
`pulseKernel.js`, and `recordProposalProvenance` — the DM-decree twin — appends nothing.

### 8.2 The veil check — CONFIRMED, no new strip owed

MEASURED: `veilPublicPayload` (`src/domain/display/publicSafe.js`) is
`return veilDeep(payload);` — the civility veil at the boundary, NOT a field stripper. The
protection is upstream and ALLOWLIST-BY-CONSTRUCTION:
`worldSnapshotPublic.js#publicChronicle` reads `worldState.pulseHistory` but emits a NEWLY
BUILT object per tick — `{ tick, headlines, affectedSettlementIds,
affectedSettlementNames }` — never spreading the record; the module header reads "SECURITY
MODEL — ALLOWLIST, NEVER SPREAD." The two public consumers (`buildWorldExport` with its
`SNAPSHOT_SECTIONS`, and the gallery builders) go through it. **A top-level `epoch` on a
pulse record CANNOT reach a public payload without someone deliberately adding it to
`publicChronicle`'s constructed object.** The epoch is DM/owner-private by construction,
in the same posture class as the already DM-variant-only realm seed (`worldExport.js`:
"The seed is DM-variant provenance ONLY. It replays the procedural world, so a player
export never carries it"). EP-1 lands an anchored NEGATIVE pin over `publicChronicle`'s
output keys asserting the epoch never appears.

### 8.3 The marketing guard — a gate, not a memo

The claim "the same world can tell entirely different histories" (and the Reddit line
"don't like where the decade went? wind back and let it happen differently — it will, and
it will still make sense") is **UNLOCKED ONLY WHEN `advanceEpochEnabled` IS LIT IN A
SHIPPED BUILD** — not when EP-1 lands dark, not when EP-5 amends the docs. Two shipped
copy strings sit one careless sentence from becoming false and must be re-read at EP-5
without being rewritten into a promise the dark build cannot keep:
`src/components/howto/ForgeExactDemo.jsx` — "Same seed, same world. No re-roll behind your
back." — and `src/components/about/AboutManifesto.jsx` — "There is no wall-clock input and
no hidden re-roll, so a world cannot drift behind your back between sessions." **Both
remain TRUE under the amended promise:** a re-draw is the DM's own click, never behind
their back, and there is still no wall-clock input to any stream — MEASURED, no
`createPRNG` composition in `src` reads `now`; the `now2` in road seeds is an integer TICK.
The gate: `tests/copy/landingClaimsParity.test.js` binds `landing.brief.deterministic`
verbatim and REDS on a reword by design — that red is the owner's review checkpoint and
must not be routed around.

### 8.4 THE LIFECYCLE-PATHS CLAUSE for the `epoch` field (FOURTEEN paths, all measured)

*(Revision 1 said thirteen while tabling fourteen rows — a counting slip in the volume,
not a missing path. Corrected here and in the two places that cited it.)*

| Path | Writer / reader | Survives? |
|---|---|---|
| **create** | `worldState.js#createDefaultWorldState` (`pulseHistory: []`) | n/a — empty |
| **mint (per tick)** | `pulseKernel.js` `pulseRecord` → `finalPulseRecord` → `appendPulseHistoryWithProvenance` → `appendPulseHistory` | YES — top-level scalar, conditionally spread |
| **interval collapse (N→1)** | `advanceInterval.js#collapseIntervalHistory` (`intervalRecords.slice(0, -1)` DESTROYS N-1) | YES — because the grain is ONE PER ADVANCE (§1.5); a per-tick epoch would lose 51 of 52 |
| **commit to store** | `campaignPulseHelpers.js#applyWorldPulseResultToState` → `ensureWorldState` | YES — `cloneArray` is a shallow per-record spread, not an allowlist |
| **persist local** | `campaignSliceShared.js#cacheCampaignState` → `campaignService.cache` → `localStorage.setItem(…, JSON.stringify(campaigns))` | YES — whole-object JSON |
| **persist cloud** | `flushWorldPulsePersist` → `syncCampaignChanges` → `campaigns.js#rowForCampaign` / `mapDataForCampaign` → `saved_maps.upsert` into the `map_data` JSONB column; read back by `campaignFromRow` | YES — the whole campaign object is the payload; no column projection |
| **undo snapshot / restore** | `capturePulseSnapshot` (`cloneJson(campaign.worldState)`) → `runUndoLastPulse` → `restorePulseSnapshotOnDraft` | YES inside the snapshot, and correctly VANISHES on restore |
| **paused cursor (mid-advance)** | `buildPausedAdvanceCursor` → `worldState.pausedAdvance`; read by `runResolveIntervalMajors` | ⚠ **ONLY IF EXPLICITLY ADDED** — the ONE place a new field must be hand-threaded, exactly as `now` is (§1.3) |
| **worker transport** | `multiTickArgs` → `advanceWorkerClient.js#runAdvanceInterval` (spread) → `advanceInterval.worker.js` | YES automatically — a plain string crosses `structuredClone`; zero transport edits |
| **account export** | `accountData.js#buildAccountExport` (campaigns WHOLESALE) | YES |
| **account IMPORT** | `accountImportBody.js` Phase 9 → `campaignImportedCreation.js#createImportedCampaign` (`worldState: ensureWorldState(null, …)`) | ⛔ **NO — the ENTIRE worldState is dropped for a fresh default.** DECLARED, not silent: `importReconciliationAdmission.js` carries the typed row `['worldState','world_state_not_imported','World simulation state']`. This PREDATES the directive, and **EP-5 must say out loud that an imported campaign is a NEW starting world with NO lived history**, or the trust floor is false across the import boundary |
| **clone / duplicate** | none exists | n/a — MEASURED: no user-facing campaign duplicator; the only `importCampaign*` symbol is the attach-to-existing reconciliation command |
| **migrate** | `runWorldStateMigrations` / `WORLD_STATE_MIGRATIONS` (`WORLD_STATE_SCHEMA_VERSION = 2`) | n/a — **no migration and no version bump owed.** No per-record migration exists; absent-epoch records ARE the legacy shape and read as epoch-absent by §1.4. `campaigns` is not in the store's `partialize` allowlist, so no persist version bump either |
| **public payload / share / gallery** | `worldSnapshotPublic.js#publicChronicle` (constructs, never spreads); boundary `veilPublicPayload` | ⛔ NO — allowlist by construction. No new strip owed; an anchored negative pin locks it (§8.2) |

**The same clause binds EP-3's `spatialLedgers.advanceEpoch`** — ⭐ **under BOTH arms from
revision 6 on, because slice A lands the `latest` stamp under either arm (chair ruling G1)** —
with one addition: it is a conditionally-materialized sub-key with exactly ONE writer, enforced
by a shrink-only source-scan census with an executed second-writer plant (the L4 idiom), and
**both of its sub-keys round-trip every row above**: `latest: { tick, epoch }` (slice A, either
arm) and, under Arm A only, the `byYear` map (slice B) — including the IMPORT drop, which is
correct (a fresh starting world has no lived years, and no tick to match). ⭐ **`latest` needs
no lifecycle exception of its own precisely because it is SELF-INVALIDATING:** any path that
drops it (import), rewinds it (undo) or leaves it behind a moving tick (every subsequent
advance) simply makes it unselectable, which is the same outcome as absence — the property
§3b.1b's law 5 buys, stated here from the lifecycle side.

⭐ **THREE PATHS THE WRITER MAKES SHARPER, RE-WALKED IN REVISION 4 (chair ruling T1).**
The ledger is not a passive field; it is written mid-advance, so three rows above carry a
consequence the record and cursor homes do not:

- **MINT (per tick) → the stamp.** MEASURED: `spatialLedgers` is a `CONDITIONAL_LEDGER_KEYS`
  member and `ensureWorldState` re-materializes each conditional ledger through
  `deepCloneConditionalLedger` **only when present and non-empty**, so a dark world's absent
  `advanceEpoch` sub-key — and, on an aspatial world, the absent namespace itself — survives
  the ~11 ensures per tick as an ABSENCE. That is chain link M3 proved on the persistence
  path rather than only at the call site. ⭐ **AND THE LIT HALF OF THE SAME ROW IS PINNED IN
  REVISION 5 (chair ruling F6): the stamp must be PRESENT on the world the kernel RETURNS**,
  not merely on the world at the composition site — §3b.1a's STAMP-SURVIVAL PIN asserts
  `byYear[<the entered year>] === epochTerm` on the returned world and again after the store
  commit and a real JSON round-trip, with the mutant that drops it after the last in-pulse
  read asserted to RED. Without that arm a stage rebuilding the world wholesale between the
  last family-2 read and the return would leave every in-pulse assertion green while the save,
  the undo snapshot, `mapDress` and the next composed tick all read an unstamped world.
- **INTERVAL COLLAPSE (N→1) — and this is the row that differs in kind from the epoch
  field's. ⭐ IT IS A DECLARED NON-INVARIANT, NAMED AS ONE IN REVISION 5 (chair ruling F8,
  anomaly A-R4-3); the canonical statement is §3b.1a's, beside the ledger's FIVE laws, and
  §1.5 points there from the grain ruling.** `collapseIntervalHistory` destroys N−1 of N pulse
  RECORDS, which is why §1.5 puts the grain at one epoch per ADVANCE. ⭐⭐ **RE-MEASURED AT
  HEAD AND RESPELLED IN REVISION 6 (chair ruling G2 — revision 5's phrasing here was
  falsifiable in one grep):** the function returns
  `reconcileProvenanceAfterHistoryCollapse({ ...worldState, pulseHistory: composed }, removed)`,
  so **the world is composed by SPREAD and `spatialLedgers` is CARRIED THROUGH**; the reconcile
  (gated on `provenanceLedgerActive` and on a non-empty removed set) reads
  `getSpatialLedger(worldState, 'provenance')` and writes `setSpatialLedger(…, 'provenance', …)`
  or `dropSpatialLedger(…, 'provenance')` — **the PROVENANCE sub-key alone, with every sibling
  sub-key and its insertion order preserved by `setSpatialLedger`'s own spread**. The
  `advanceEpoch` sub-key is neither read nor written on that path, so a
  52-tick year advance that crosses TWO calendar-year boundaries leaves **TWO** `byYear`
  rows behind while leaving ONE pulse record — and that is CORRECT, not a leak: both years
  were genuinely lived, both were entered by the same advance, and both therefore carry the
  same epoch string. The ledger is a map of lived years, not a mirror of the history array,
  and a pin asserts the two counts are ALLOWED to differ so no future auditor "fixes" it.
  ⛔ **The "fix" this declaration exists to forbid is teaching `collapseIntervalHistory` to
  prune the ledger alongside the records: it would DELETE the epoch of a genuinely lived year
  and break the trust floor, arriving as a tidy-up rather than as a change.** Three homes
  carry this statement — §1.5, §3b.1a, and this row — because it is the divergence most likely
  to be re-found and mis-diagnosed by someone reading only one of them.
- **UNDO SNAPSHOT / RESTORE.** `capturePulseSnapshot` does `cloneJson(campaign.worldState)`
  and `restorePulseSnapshotOnDraft` puts the whole thing back, so the `byYear` rows an
  undone advance stamped vanish with the world. **This is the mechanism the fresh-year pin
  rests on**, and it is why FIRST-WINS is safe: the only way a year loses its epoch is by
  being un-lived. ⭐ **AND `latest` RESTORES WITH IT (revision 6, chair ruling G1), which is
  the whole living-future story in one line:** the restored world carries the PREVIOUS tick's
  `latest`, the re-advance composes `tick + 1`, the selection rule refuses the stale stamp, the
  writer stamps the NEWLY MINTED epoch, and every family-1 draw of the re-advanced tick keys
  off a value that has never existed before. **A DM who backtracks on vibes and re-advances
  gets a different future, and the ledger is where the difference enters the stream.**

### 8.5 THE PROMISE amendment — every home, with its exact new sentence

AMENDED-IN-PLACE at every home, never a new law file beside the old one (the split-brain
class). **FORTY-FIVE homes across FOUR tiers** (revision 1 said forty-seven across five;
the tier-5 memory pair is discharged — §8.6); the sweep runs on the LOOSE anchor.

**Tier 2 — docs/law (15).** `docs/VISION_IDEALIZED_FINAL_PRODUCT.md` COVENANT 1 becomes:
*"1. Same seed, same STARTING world, forever; and a lived history, once lived, forever —
canon is stable, shareable, reproducible, and the un-lived future is alive."* Every other
tier-2 home (CREATOR_KIT · SETTLEMENT_CAPABILITY_ATLAS ⚠ TWO occurrences that must move
together, the first-match document-pin class · DESIGN_REALM_MAGIC_TOGGLE MG-LAW-5 ·
DESIGN_FP_ARCH_CENSUS · RECEIPT_POOLS_LEGACY · fmg-fork · COMPREHENSIVE_REVIEW) takes a
POINTER to covenant 1 rather than a restatement — point, don't restate. THREE tier-2 homes
are UNAFFECTED and must NOT be over-amended, recorded so a sweep leaves them alone:
`CAPABILITY_REMEDIATION_PLAN.md`'s no-drift law, `DISPOSITION_WAVE_PROPOSAL.md` D-W4
(cross-machine reproducibility), and both `GOLDEN_SHIFT_LEDGER.md` entries (HISTORICAL
record — amend by APPENDING the 08-05 note, never by rewriting the reasoning).
⚠ `docs/FABLE_VALIDATION_QUEUE.md`'s R-BLD-10 row and `scripts/.size-baseline.json`'s
`_r_bld_10_…` rationale key each gain ONE sentence — and the size-baseline key is
MACHINE-READ by `tests/lint/sizeBaseline.test.js`, so it is a real diff: *"AMENDED
2026-08-05: the advance-epoch program (docs/DESIGN_FP_ARCH_EP.md §3b) changes the ROOT
SEED VALUE under a flag by owner order; the CALL ORDER this ruling protected is untouched
and the refusal above is not re-litigated."*

**Tier 1 — user-facing copy (7).** `src/components/map/AutoplacementConsent.jsx`'s
canonized body — "A seed is a world, and this one is written." — becomes *"A seed is a
starting world, and this realm's places are written."*
`src/components/WorldPage.jsx`'s share-code body gains a second sentence: *"The same seed
always builds the same starting world; the history each table lives from it is their
own."* `src/components/about/AboutWhatThisIs.jsx`'s subtitle becomes *"A world simulator
that is deterministic where it matters, and the architecture that makes its promises
structural."* `src/data/roadmapLedger.js`'s `same-seed` title becomes *"Same seed, same
starting world, forever"* — its SUMMARY is already true and stays, and MEASURED,
`tests/data/roadmapLedger.test.js` validates shape and does NOT pin the title, so the data
edit is free. `src/copy/landing.js`'s `brief.deterministic` and `map.provenance` are TRUE
unchanged (a TOWN is a starting world) and are edited only if the owner wants the fuller
claim, in which case `landingClaimsParity.test.js` reds by design (§8.3).
`src/components/instant/InstantWorldEntry.jsx`'s seed hint ("Same seed always rebuilds the
same realm") is already the best existing phrasing of the amended law and is left alone.

**Tier 3 — code headers (10) and tier 4 — tests (13).** Each takes a one-clause amendment
or a pointer; three are load-bearing enough to spell. `src/kernel/prng.js`'s `fork`
docblock gains *"— note the distinction the advance-epoch program depends on: THE
DERIVATION is frozen and owner-gated; the ROOT SEED STRING is extensible by a new segment
under a flag (EP §2.3)."* `src/domain/certification/subsystemRowsVirtual.js`'s
`oathHolderEnabled` invariant is UNAFFECTED (re-derivation from the SAME state, not a
re-draw) and is recorded so the sweep passes it by.
`tests/domain/advanceWorkerByteIdentity.test.js`'s "a seed IS a world, bit-for-bit" is
**the one phrasing in the estate that stays exactly right under the amendment** — the
internal, replay-grade claim — and it gets no edit at all.

### ✅ 8.6 THE BUILD-BLOCKER IS RESOLVED (anomaly A7, discharged by the chair)

Revision 1's most valuable finding was that this program had a **live blocker outside the
tree**: `memory/the-promise-ratified.md` recorded the 2026-07-20 ratification as PERMANENT
and instructed future sessions that any proposal to change it "must be refused with this
citation" — so a successor reading that file and not the 2026-08-05 directive would
CORRECTLY BLOCK the entire program, and would be right to.

**THAT FILE IS NOW ALREADY AMENDED**, by the chair, to record the owner's 2026-08-05
signature and the narrowing it authorizes; the MEMORY.md history-reroll line (R5's
correction) is likewise already corrected. **Consequences for this volume, all three
recorded so no one re-opens the question:**

1. **EP-5 carries NO memory obligation.** Its charter is the forty-five in-tree homes of
   §8.5 and nothing else.
2. **§5's queue-fold list carries no promise-amendment item** (item 8 is struck).
3. **The blocker is discharged, not deferred.** An implementer who encounters the 07-20
   ratification and is unsure should read the amended file — the amendment names the
   owner-signed narrowing and cites the directive by path, and it does not delete the
   07-20 record, which stands for everything it protected (no silent drift, no
   auto-tuning, versioned owner-signed tuning).

---

*Compiled read-only against HEAD 32cc17f75f643b6be18029437db62acb6574e968, branch
claude/composite-r4, tree clean; REVISIONS 2 THROUGH 5 amended read-only against the same
HEAD, tree clean before and after, zero repo files written, zero gates run, zero git
state-mutating commands. Inputs, each at its REAL path: the owner directive
(`memory/advance-epoch-living-futures-directive.md`) · `docs/DESIGN_FP_ARCHITECTURE.md`
§§1/3/5/9/10/11 · `docs/SOL_QUEUE.md` §§0/1 · `docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md`
§10 · the ES+WY fold package — ⭐ **PENDING when this volume was compiled, LANDED at `7794cb4a` mid-revision-6** — in the session scratchpad
(`fold-pass/{DESIGN_FP_ARCH_ES.md,DESIGN_FP_ARCH_WY.md,QUEUE-AND-AMENDMENTS.md}` — NOT
repo files; queue item #34) · four session censuses (scratchpad compile inputs, not repo
files).

**THE COUNTS, EVERY ONE RE-COUNTED AT REVISION 4 AND RE-CHECKED AGAINST ITS OWN TABLE AT
REVISION 5 (which found and cured ONE further slip — §5 item 5's "NINE EP rows" beside its
own "+10", in the item that publishes verbatim into the parent volume — and corrected row 1's
read-site figure from FOUR to THREE, chair ruling F4, with the fourth item reclassified rather
than deleted):**
**THIRTEEN refutations bound** (R1–R13 — two refuting the censuses, three refuting revision 1,
two refuting revision 2, **two refuting revision 3: R11's homeless Arm-A writer and
pre-advance read, R12's year-vocabulary split**, ⭐ **and one refuting every revision from 2
onward: R13, the family-1 accessor with no epoch source at any of its four declaration sites,
which is R11's shape in the LARGER half of the side-channel program**); **six waves ordered**
(EP-3 two slices, only one chair-gated — ⭐ **and the slice BOUNDARY moved in revision 6: the
writer, seam edit 9, the +1 import and the manifest row are SLICE A's, J-EP-14**); **one flag manifested**, read TWICE by design; **twenty-five stream
compositions across sixteen modules** dispositioned in three entropy idioms and two
families; **twenty-two READ SITES dispositioned** (§3b.2a) across **nine absent-seed
coercions plus one call-suppression — TEN behaviours** (§3b.3), ⭐ **with BOTH families now
carrying a per-site re-root table — family 1's EIGHT read sites are new in revision 6 (§3b.2,
§0.3 R13)** and ⭐ **TWO year
vocabularies in TWO bases** (§0.3 R12, J-EP-13); ⭐ **NINE enumerated token-level edits on
`pulseKernel.js`** — six in EP-1 at +0 lines, **three** in EP-3 at +0 lines (⭐ **edit 9 in
slice A, edits 7 and 8 in slice B — revision 6's split, chair ruling G1**) with a
declared +1 for the one leaf import, bought in slice A (§3b.1, §3b.1a, §3b.1b, J-EP-11); ⭐ **THREE flag-driven
materializations** on one named invariant chain (§2.3c, M1/M2/M3); **eighteen generator
affordances tallied** (6 · 4 · 1 · 7); ⭐ **TEN seams pinned** (row 10, the `spatialLedgers`
coverage manifest, added in revision 4); **fourteen lifecycle paths walked**, three of them
re-walked for the writer (§8.4); **FOUR owner-gated rows parked (§7a)** and ⭐ **TWO
chair-owed dispositions reported (§7b — B1 the dead module, ⭐ B2 the DM-order re-issue
question, new in revision 6)**; ⭐ **fifteen judgment blocks** (J-EP-1..15);
**five open chair questions**; **forty-five promise homes named** (the memory pair
discharged, §8.6).

Every count here is MEASURED at HEAD except the post-fold queue arithmetic, which is
explicitly VERIFY-AT-FOLD (§5) because the fold package labels its own figures PLAUSIBLE.
⚠ **Three closure-record figures inherited from revision 2 were RE-RUN and two were wrong
(§3b.2's closure table, chair ruling P7); revision 4 re-ran them AGAIN and corrected a
THIRD (the `hash01` consumer figure, whose command counted MENTIONS while its label said
CONSUMERS — 13 → TEN, chair ruling T5), and swept the whole volume for the one refuted
`generateSeed()` figure that had survived P7 in §3e (chair ruling T3 — ONE site found, NONE
left). A figure that does not reproduce on re-run is treated as a defect in this volume,
never as a tolerance.** ⚠ **AND THE SHARPEST LESSON OF THIS REVISION IS NOT A FIGURE:** the
seal pass proved that a SHAPE, a WRITER COUNT and a BUDGET FILE can all be stated correctly
while the writer has nowhere to run (§0.3 R11). **A declared writer with no named call site
is not a design; the call site is the design.**
⚠ **REVISION 5 ADDS TWO LESSONS OF THE SAME KIND, AND NEITHER IS A FIGURE EITHER.**
**(1) A PIN THAT COVERS ONE SITE AND ASSERTS EIGHT IS A PIN OVER ONE SITE.** Revision 4
wrote "the volume does not ARGUE that the stamp survives them — it PINS it" and then pinned
14 rebinds while asserting 69, so three of the four mutants that could break slice B were
green (§3b.1a, chair ruling F1). **The doctrine a volume states about evidence binds the
volume uniformly, or it is decoration.**
**(2) A FENCE THAT REDS ON A CORRECT IMPLEMENTATION IS A DEFECT, AND ITS MOST LIKELY REPAIR
IS A WEAKENED FENCE.** Fence 5's M3 gloss contradicted fence 5's own step 1; built as
written it would have failed on day one and invited someone under build pressure to soften
the only arm in the estate that can see mutant (d) (§2.5, chair ruling F2). **An expectation
must be derived from the path the fence actually drives, never from the neighbouring fence's
path.**
⚠ **REVISION 6 ADDS TWO MORE, AND THE FIRST IS THE ONE THIS VOLUME SHOULD HAVE LEARNED ONCE.**
**(1) THE LESSON R11 TAUGHT WAS NOT APPLIED TO THE NEIGHBOURING SLICE.** Revision 4 wrote "a
declared writer with no named call site is not a design; the call site is the design" — and
`tickStreamSeedOf` sat three subsections away, declared at four sites, with no epoch argument,
no ledger read and no spelled body, through four adversarial passes (§0.3 R13). **A defect
class is closed at the address where it was found and NOWHERE ELSE unless the volume goes
looking; the cure for R11 should have been a SWEEP of every declared instrument for its source,
not a section about one writer.** The generalized rule, stated so the next pass can apply it
mechanically: **for every symbol this volume declares, name (a) where its value comes from,
(b) the body that produces it, and (c) the executed pin that proves a real caller got a real
value — three columns, no exceptions, and a declaration missing any one of them is a build
STOP.**
**(2) A REASON STATED IN A FALSIFIABLE FORM UNDERMINES A CORRECT RULING.** F8's collapse
ruling was right and its premise reproduced as FALSE in one grep at all three of its homes, so
the next auditor's first act would have been to disbelieve the ruling (§1.5, §3b.1a, §8.4,
chair ruling G2). **When a ruling exists so a future reader finds a ruling instead of a bug,
the PREMISE carries the whole load — and the test for it is not "is this true?" but "does the
obvious command an auditor will run return what this sentence says?"** Where this volume
compresses, live code
governs; where any document disagrees with the tree, the tree wins and the disagreement is a
STOP-and-report. Nothing here lights a flag, runs a soak, ratifies a band, re-records a
golden, or pushes.*
