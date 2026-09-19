---
name: cycle2-lighting-road-recon
description: "2026-08-05 cycle-2 substrate recon @ 32cc17f7 (run wf_f4c426e7-c21): ⚠⚠ the SP doc's third leg spelling routePositionBand is WRONG (consumer reads routeBand) — building SP-B2 from the doc ships a dead supply reported as done; the WR-9 lighting-order row is a PHANTOM (receipt with no reader) — cycle 2 must BUILD the instrument; ES-1 gated on SP-D's errandMint.js"
metadata:
  type: project
  created: 2026-08-05
  originSessionId: c44e5d99-2ba5-49d5-a554-40b68534c8eb
  modified: 2026-08-05T05:43:09.699Z
---

# Cycle-2 recon (SP-B + SP-B2 + ES-4, the WR-10 lighting road) @ 32cc17f7

Full returns: run wf_f4c426e7-c21 journal. Highlights that BIND the charters:

**⚠️⚠️ CRITICAL — the doc-as-writer spelling drift (would kill the whole
road):** docs/DESIGN_FP_ARCH_SP.md spells the third appraisal leg
`routePositionBand` at BOTH :263 and :424; the ONLY consumer reads
`routeBand` (sovereigntyAppraisal.js `wordOf(row.routeBand, ...)` ~:299;
beliefLegsOf's own typedef at sovereigntyMarketStage.js ~:154 already says
routeBand). An SP-B2 built faithfully from the spec supplies a key nothing
reads → appraisal `known:false` forever → market stays dark while the wave
reports done — and a four-leg totality pin written from the doc would pass
GREEN on the dead supply. CURE (bake into the charter): the appraisal's
own typedef is the AUTHORITY — pin suppliedLegs ⊆ {tierBand, storesBand,
routeBand, trajectoryBand} read off sovereigntyAppraisal.js, plus one
executed key-rename mutant that reds; correct the doc at BOTH sites in the
landing diff, reported not silent.

**⚠️ HIGH — the lighting receipt has NO READER:** the "WR-9 certification
lighting-order row" the SP doc cites DOES NOT EXIST as an artifact
(matches the ES volume's F9 phantom). The fold makes the five DOC homes
agree on the three-member condition (SP-B + SP-B2 + ES-4), but the
INSTRUMENT — a real certification lighting-order row that can flip green —
must be BUILT in cycle 2 (land it with SP-B2/ES-4), else CR-WR10-H's
discharge is a claim no instrument can check.

**Order constraints (all CONFIRMED structural):** SP-A→SP-B clear · SP-B
STRICTLY precedes SP-B2 (conditionsBands zero hits — nothing to read) ·
SP-B carries THREE flags → CQ5-BOUND, so the B+B2 pair serializes against
every other flag wave in the worktree; SP-B2 alone is CQ5-free · SP-B2's
Files-touched list is INCOMPLETE +1 (frozen leg fixtures also at
tests/domain/sovereigntyWaveCloseIntegration.test.js ~:70-76/:217) ·
**ES-1 cannot start before SP-D mints errandMint.js (file does not exist —
"the single hardest gate on the whole ES spine")** · ES-4's seam is
ALREADY BUILT and waiting (sovereigntyMarketStage.js ~:311 beliefLegsFor =
beliefLegsOf, applied ~:412/:415).

**SP-B facts:** beliefAxes.js extension pattern CONFIRMED exact (six
exports; beliefAxesActive strict-true read is the one door);
`believedScarcityEnabled` has FOUR forward references landed by TR-1
(tradeConvergenceContract.js cert rows + walker pin expect that exact
name, owner SP-B, alias SP-2) — the flag NAME is bound ·
`outboundImpression` is PRE-REGISTERED in two walkers (couplingInclusion
INFO regex + spTermLiteral wave map) — SP-B may NOT rename it without
touching both · VIRTUAL_PENDING_RULE_KEYS is EMPTY — SP-B lands three real
cert rows or three pending entries SAME-COMMIT · zero field-family
collisions (scarcityBands/conditionsBands/devotionBand unminted;
first-spelling carve-out applies) · line-rot: infoModeOf now ~:755;
adjustedDecayBase anchor ~:670 — navigate by symbol.

**ES-4 lens:** H1 the phantom row is MIS-ATTRIBUTED not merely missing
(matches fold EDIT 11's correction) · H2 CR-ES-3 blast radius understated
BOTH directions (matches the fold's rider) · H3 a stale line address
ALREADY rotted in one anonymity amendment home — the fold landing must
re-anchor fresh, never trust the quoted ranges.

Related: [[fp-cycle1-serialized-landing-and-cq5-row-guard]] ·
[[espionage-confirmers-directive]] · [[wr10-sovereignty-market-state]] ·
[[writer-reader-payload-spelling-class]] (this recon found the class with
a DOCUMENT as the writer).

## SP-B LANDED + REJECT ARC (2026-08-05, run wf_3e47bee3-85b)

SP-B landed DARK @ 4c0f2f38 (16 files, +2009/-26; three CQ5 trios
co-committed and verifier-executed; reachability proven by SET EQUALITY
over 72 real generated settlements; six implementer mutants + seven
verifier mutants). Verifier REJECT on eight findings — repair in flight:
⚠⚠ THE FOLD ARM WAS UNPINNED END-TO-END (severance mutants M-A/M-A2
survive 192 tests — the integration pin now owed) · ⚠⚠ fence 3's fold
spy COULD NOT FAIL (dark zero asserted, lit >0 never — the
harness-default-empty vacuity class INSIDE a four-fence set) · the Bands
walker was SP-A-hard-coded (generalizing table-driven both-ways).

**⚠️⚠️ NEW GENERAL LESSON (SR-3, bit twice in one wave): DEFENSE-IN-DEPTH
BLINDS MUTANTS.** Where a conjunction is guarded at TWO doors (the
callee's own gate + the caller's gate), deleting either leaves every
behavior fence green — each door needs its OWN direct unit pin. The
four-fence pattern gains a corollary: enumerate the guard doors and pin
each individually.

**⚠️ SR-1 (pre-existing, OWNER/CHAIR wave owed): SIX first-paint
build-closure contracts are RED on a freshly-built dist at edea9b1f**
(the lazy engine chunk reached the entry static closure; custom-registry
/ culture corpus / content-identity tunables inside it). Invisible to
archive diffs (runIf(distExists) SKIPS without dist/). Needs its own
wave with VERIFY_DIST=1. NEVER let a lane self-attribute these.

**Memory correction:** the CW-0w-era "proseNumerics RED AT BASE" stop is
RESOLVED (green at edea9b1f; CR-FP-2's re-record cured it). SP-B's own
line-rot got an address-only re-record (413 rows, same set).

## THE SETTLING ROUND (same run) + A NEW HAZARD CLASS BANKED

Recheck KEPT all eight repairs (each independently re-executed) but
REJECTED the acceptance record: the lane's RETRACTION was the error —
the three SP-B flags ARE in the mechanismLitCoverage gap (29 pre-SP-B →
31; the original observation was right). Settling round lands the lit
coverage per the walker's own contract + three record cures.

**⚠️⚠️ NEW HAZARD CLASS (bank permanently): A RED RATCHET'S CONTENTS CAN
GROW INVISIBLY.** A ratchet/inventory test red on BOTH sides of a
wave-end diff fails with a byte-identical row, so the failing-row
identity diff reads EMPTY while the inventory inside it grew.
"Net attributed delta zero" can be true at row granularity and FALSE at
content granularity. THE PROTOCOL UPGRADE (now law for every wave-end):
for every ratchet red on both sides, diff its CONTENTS across the two
archives, not just the row set.

Two smaller cures in the same round: the sovereigntyMarketStage header's
no-consumer-reads claim was FALSE (all four leg names ARE read via
property access, arriving undefined; wordOf returns 'unknown' for
absent — SP-B2 supplies the CONSUMER'S spellings) · the
tradeConvergenceContract guard-the-guard would RED on a correct future
flag landing (exact-literal set; respelled non-empty + proper-subset
with a truthful message — the never-red-a-correct-build class AGAIN,
fourth address).

## ✅ CYCLE 2 CLOSED — THE ROAD IS TWO-THIRDS BUILT (run wf_3e47bee3-85b)

SP-B arc: 4c0f2f38 (wave) → 2a71dee3 (eight repairs, ALL KEPT) →
df81099e (settle: the three flags' lit coverage per the walker's own
contract + the record cures + THE PROTOCOL UPGRADE executed) → final
PASS. SP-B2 @ f4016560, verifier PASS: legs supplied in the CONSUMER's
spellings (rename-not-remap verified by value alignment on every
ladder); **THE LIGHTING INSTRUMENT IS REAL** —
evaluateSovereigntyLighting in src/domain/certification/
warConvergenceContract.js (3 evidence rows, states
SATISFIED/UNSATISFIED_TRACKED), measuring {SP-B:true, SP-B2:true,
ES-4:false} → UNSATISFIED_TRACKED missing=[ES-4]; simulated-ES-4 flip +
delete-row + marker-rename mutants all executed green/red correctly.
⚠ ES-4 CHARTER NOTE: the instrument's marker address is
ANY-SUBSTRING-IN-ANY-TEST-FILE (a bare comment flips it — executed);
ES-4 must land `ES-4-DISTANT-SOURCE-EVIDENCE` as a REAL pinned test
title AND tighten the address check in the same commit. STOP-1: the
routeBand doc premise was STALE at build time (already cured at
df81099e) — honest refusal to re-fix. STOP-2: a FOURTH shared file
(spAxisVocabulary ARGUED_FIELD_SPELLERS) cured in place. NEXT: the
first-paint dist wave (#44), then ES-0 (strict order; the CR-ES-3
cross-file retarget rides it), then ES-4 → the market lightable.

## FIRST-PAINT WAVE CLOSED (run wf_95d3f5c8-261, verify PASS) + CYCLE 3 OPEN

11a2d2d2: ONE LINE (resolveTerrain.js leaves ENGINE_SHARED_DOMAIN_EXCISIONS)
— the orphan was excised 00f791ab without a manualChunks pin, Rollup
co-located it into the LAZY engine chunk, and WR-7b's e51ec17e eager edge
(envoyErrand→negotiationPictures) re-parented the whole engine chunk into
first paint. Entry closure 15→8 chunks; raw 2.92MB→1.70MB; gzip
937KB→540KB; index.html under budget; smoke:boot PASS; six contracts
green; the re-plant reproduces the before-numbers TO THE BYTE. New
source-level guard fires WITHOUT dist (the gap that let it ride two days).
⚠ NEW CLASS: an EXCISED-BUT-UNPINNED module gets co-located by Rollup
into whatever chunk imports it — excision without a pin is a placement
lottery. FOLLOW-UPS QUEUED: #45 (the guard's lazy-pinned half — TEN of
sixteen excisions exploitable, proven), #46 (THREE edge-shared bundles
stale at HEAD — the artifact class), #47 (THE DEEP ITEM: 140 worldPulse
modules eager via worldState→envoyErrand — the 1.25MB entry chunk; the
closure budgets stay red until the war family leaves first paint).
CYCLE 3 DISPATCHED (run wf_fad9842f-67f): ES-0 (CR-ES-3 cross-file
retarget + espionageEnabled trio) → ES-4 (the confirmation leg + the
PINNED evidence marker + tightened instrument address) → the road done.

## ES-0 LANDED (PASS) · ES-4 STOPPED HONORABLY · THE ROAD MAP CORRECTED

ES-0 @ 55674790 (22 files, +2385), verifier PASS: lawWordFor minted in
lawWord.js (charter correction, vetoable — the doctrine-leaf home would
have cost a WAR→INFO coupling for a four-line ladder), the CR-ES-3
retarget executed with **a FOURTH consumer caught that the volume missed**
— warRulingsNews' BAND_WORD table lookup reaches rulerSecurityBand via a
receipt spread; producer-only retarget would have silently dropped the
{band} slot from WR-5 receipts (cured by moving the KEY with the word;
mutant-proven) · golden shift DECLARED and measured: NO committed golden
captures a seat band — blast radius ONE test file, 3 literals · band
EDGES pinned unmoved (0.67/0.33 to the digit) · reachability EXECUTED
with deity+occupation crossing (a deity-free corpus reaches NEITHER tail
— a battery on it would have "proved" lawless dead and invited edge
lowering; 1080 crossed readings open both tails).

ES-4 @ 8a4b0aef: **waveLanded FALSE — STOPPED at the dependency wall,
correctly.** The confirmation leg needs the ES spine (espionageProducts/
Missions/Gauntlet, the covert purpose, errandSpineEnabled) which exists
NOWHERE; the volume's own order is ES-0 (free) → ES-1 (SP-D-gated) → …
→ ES-4. The lane refused to plant the evidence marker (it would have
LIED to the instrument) and landed ONLY the instrument address
tightening (any-substring → title-anchored, four doors, mutant-proven).
Verifier REJECT narrow: door 3 FAILS OPEN on four skip-spellings
(describe.skipIf(true), computed ['skip'], …) — repair in flight
(fail-closed allowlist of running modifiers + the four as negative
controls). ⚠ ROAD MAP CORRECTED: the lighting road completes only
through **SP-D → ES-1 → ES-2/ES-3 → ES-4's leg** — SP-D is the
bottleneck for BOTH the errand spine and the lighting. Next cycle: SP-C
+ SP-D (+ GR-2, IN-0a per the §5 order).

## THE DOOR-3 ARC — SIX ROUNDS AND A WEAPON-CLASS LESSON (in flight)

The lighting instrument's evidence door has now been falsified FIVE
times by successive fresh verifiers, each inventing a forgery the prior
repair could not see (skip-spellings → line-broken heads → bracketed
computed members → comment-prefixed openers + alias bindings + midline
prefixes). Root diagnosis (the prover's, executed): every repair was AN
ENUMERATION WEARING A POLARITY'S CLOTHES — regex classifiers of raw
source with fail-open defaults lose to invention forever.
**⚠️⚠️ THE LESSON (bank permanently): A REGEX CLASSIFIER OF SOURCE IS AN
ENUMERATION. True fail-closed classification of code requires the
PARSER — AST shapes, closed running grammar, parse-failure parks,
alias bindings parked conservatively.** Round 6 (Parse + Endgame, run
wf_fad9842f-67f resumed) rewrites door 3 on espree/acorn; the endgame
adversary gets two textual + one SEMANTIC forgery. Commits so far:
8a4b0aef (tighten) → 35b7bec7 (four escapes) → 7503b00d (rejoin) →
1835d8b0 (token-anywhere enumeration). Prevalence ZERO at every round —
the tree's reading was never wrong; this hardens the gate your
signature trusts.

## THE DOOR-3 ARC — THE CAP ROUND (rounds 7-12 compressed)

Rounds 7-11: bind (semantic holes closed) → verdict (options bag +
zero-row tables found, closed) → latch → ground/rest (renamed-import
falsifier → binding resolution DELETED the shadow machinery, zero
estate delta) → anchor/still (the ORACLE discovered: `vitest list
--json` = the framework's own ground truth, all 23,676 credited titles
reconciled against it — the strongest evidence this file ever produced;
the SUITE-TITLE forgery found: suite titles counted as evidence over
all-skipped blocks, LIVE pattern in prerenderRoutes.test.js). ROUND 12
= THE PRE-ANNOUNCED CAP, arc ends regardless: (E1) evidence = TEST
titles ONLY (matches the instrument's original spec); (E2) THE ADDRESS
CAP — markers count only in a DECLARED evidence-file pattern the walker
owns (open-address evidence proven unwinnable across eleven adversarial
rounds; a designated address is auditable); (E3) the ORACLE documented
as the standing audit (+ a runIf-gated reconciliation test if cheap).
Residuals beyond the cap become RECORDED LIMITATIONS, never another
cut. Commits: 8a4b0aef→35b7bec7→7503b00d→1835d8b0→42e806ef→898dc506→
7cb237e7→5166a342→(cap pending). ⚠⚠ THE ARC'S FINAL LESSON (bank):
open-address textual evidence CANNOT be defended by static
classification alone — designate the address, document the oracle,
and let the framework's own runner be the ground truth.
