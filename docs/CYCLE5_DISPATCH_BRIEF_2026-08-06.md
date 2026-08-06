# CYCLE 5 — THE MEASURED DISPATCH BRIEF, and the doc repairs it owes

## ⏳ OPUS-ERA — FABLE SURVEY OWED
Measured at build HEAD `cbd348a5` (`claude/composite-r4`) by a read-only census
lane, chair-reviewed. Prepared under **Opus 5, not Fable 5**. Every judgment is
**VETOABLE**. ⚠ **No pin below is verified green or red** — the gate was a
machine mutex held by the cycle-4 lane throughout, so every "pin" here is a
DOCUMENT OBLIGATION, not an observed state.

⚠ **THIS FILE LIVES ON THE LEDGER BRANCH as a durability copy.** The doc repairs
in §3 must be applied on `claude/composite-r4` at a quiet landing slot, and this
file deleted once they land.

---

## §1 THE HEADLINE: CYCLE 5 IS NOT FLAG-CONSTRAINED

**CONFIRMED — the ranked slate below mints ZERO new `simulationRules` keys.**
Every candidate either rides a key already in `ENGINE_GATED_VIRTUAL_RULE_KEYS`
or carries no flag. The CQ5 flag-serialization constraint — the thing that has
shaped every cycle's scheduling — **does not bind cycle 5 at all**. All four
candidates may be uncommitted simultaneously; both lanes land freely; nothing
contends for `BACKLOG_RULE_KEYS`.

That is only visible because of the stale premise at §3/S1. One documentation
correction converts ES-1..ES-4 from four serialized flag waves into a
free-running consumer chain — and that chain terminates in the CR-WR10-H
lighting discharge, which §9 of the compiled volume calls the highest-leverage
motion in the whole build order.

**The only hard serializer left is `scripts/mutation-coverage-manifest.json`**
(1,972 lines), which every wave with a new mutant touches. ⚠ The recorded hazard
binds: `json.dumps` on it reformats the entire file — **splice the raw text**.

---

## §2 THE RANKED SLATE

### RANK 1 — ES-1 → ES-2 → ES-3 → ES-4 (one lane, four commits, serial within the lane)
The critical path to the CR-WR10-H lighting discharge. All four ride
`espionageEnabled` (already manifested at `simulationRules.js:213`), so the
chain costs nothing against the flag slot, and all four live in one file family,
so they serialize naturally in one lane with zero cross-lane contention.
Normative spec: `docs/DESIGN_FP_ARCH_ES.md` §4 — **navigate by SYMBOL; that
volume's own §1 forbids line-number navigation.**

⛔ **THREE VERIFY-AT-BUILD PREMISES, ALL LOAD-BEARING:**
1. ⚠⚠ **`envoyDiplomacy.js` IS AT 797/800 EFFECTIVE — THREE LINES OF HEADROOM**
   — and it hosts `buildEnvoyRoutePlan`, which is exactly where ES-1's kind fork
   lands. **The ES volume budgets `errandMint` (≤120), `espionageMissions.js`
   (≤250) and `envoyErrandRecords.js` (≤60) but gives `envoyDiplomacy.js` NO
   BUDGET LINE AT ALL.** Budget a lazy-leaf extraction into the wave or it reds
   the size ratchet, which is tolerance-zero.
2. **ES-1 CANNOT START UNTIL SP-D COMMITS** — `errandMint.js` does not exist
   until then, and `espionageGate.js:65` reads `rules.errandSpineEnabled !== true`
   in the deliberate negative spelling that flips when SP-D lands its CQ5 trio.
   ⚠ **Confirm what SP-D actually named the leaf; do not assume `errandMint.js`.**
3. `docs/DESIGN_FP_ARCH_WY.md` **already contains row E15** although
   `espionageGauntlet.js` does not exist. CR-ES-6 tells ES-2 to add it —
   **verify, do not re-add.**

✅ **TWO BLOCKERS ALREADY DISCHARGED (measured, good news):** CR-ES-2's anonymity
amendment is LANDED in all three homes (`informationStatecraft.js` BOUNDARY
header with the BY-THE-ENGINE qualifier present, `DESIGN_FP_INFORMATION.md`, and
the war volume), so ES-2's fold precondition is satisfied. CR-ES-3's vocabulary
retarget also landed at ES-0, so **ES-2's captor-leniency arm need not ship dark**.

**ES-4's lighting recipe, CONFIRMED by reading the walker itself:** the marker
`ES-4-DISTANT-SOURCE-EVIDENCE` must stand in an **`it`/`test` TITLE, never a
`describe` title**, inside `tests/domain/espionageDistantSourceEs4.test.js` — one
of exactly three entries in `EVIDENCE_FILE_ADDRESSES`. The `it` identifier must
be imported from `'vitest'` unrenamed and unshadowed; the call must be statically
registered straight-line (no return/throw/conditional/loop/bare await), take a
function-body second argument with no options bag, and its callback takes no
parameters. **A pin anywhere else carries the token and lights nothing.**

### RANK 2 — GR-3, the new term families + the J-FP-1 one-time discharge
A **one-time** discharge that gets more expensive every cycle it waits: every
later catalog-touching wave (TR-5, WF-6, POP-5b) must otherwise reason about a
live tripwire. Rides `pactFormationEnabled`; no new key. Massive headroom
(`peaceTermsCatalog.js` 80/800, `treatyEnforcement.js` 64/800), zero file-family
overlap with the ES lane.
⚠ **Read `DESIGN_FP_ARCH_GR.md` §6 seam 6 as well as its §5 block** — seam 6
names `couplingRegistry.js` as an edit target that the §5 paragraph omits, so a
§5-only reader misses it.
**Tripwire state measured:** `TERM_CATALOG` holds exactly 12 rows across 8
families, byte-matching `WR10_FAMILIES_AT_LANDING`, so `catalogGrewSinceWr10()`
returns `false` today — confirming GR-3 has not landed. `sovereigntyBundle.js` is
NOT edited; it widens mechanically because `TERM_FAMILIES` is derived.
⛔ **VERIFY-AT-BUILD: if cycle 4 closes with GR-2 unbuilt, GR-3 DOES NOT
DISPATCH** — swap in RANK 4.

### RANK 3 — IN-0b + IN-0d (paired, one lane, two commits)
Two no-new-key INFO slices with 500-600 lines of headroom each and **zero src
overlap with any other candidate**. IN-0d discharges seam 11
(`secrecyTradeFactorOf`), which the whole TRADE phase pre-pins against.
⚠ **VERIFY-AT-BUILD:** the HIDE `-0.7` rivals'-reads factor IN-0b is specified to
wire **does not exist under that spelling** — `informationStatecraft.js` has
`HIDE_STALENESS: 0.7` and `HIDE_WEAKNESS_W: 0.7`, neither an intercept-vagueness
factor. The doc labels this new work, so it is not a contradiction, but there is
**no constant to reuse**.
⛔ **IN-0c IS DELIBERATELY EXCLUDED** — see §3/S3. Running it in the same cycle as
GR-3 puts two waves into the `peaceTerms.js` family with 15 lines between them
and a tolerance-zero ratchet.

### RANK 4 — SP-E, the narration kit assembly (and the swap-in if GR-2 slips)
Zero engine edits, zero flags, zero `src/` collisions with anything — pure
test/certification estate. It removes a structural blocker: every later volume
currently copy-pastes the envoy kind-pool walker instead of importing a template.
It also clears WY-1's queue position.
**J-SP-8 binds:** the frequency-scaled floor lands **shrink-only** over the ~269
legacy tokens; **it may not red the estate at birth.**
✅ `heraldFeed.js:95` has NOT rotted — it still reads the exact ad-hoc
significance mix the doc describes.

---

## §3 THE STALE-PREMISE REGISTER — doc repairs owed on `claude/composite-r4`

### ⚠⚠ S1 — HIGH MISROUTING RISK. `espionageEnabled`'s owning wave is wrong in SIX places.
**MEASURED TRUTH:** `simulationRules.js:212-219` carries the inline provenance
*"Joined 2026-08-05 by FP wave **ES-0** … in the SAME commit as its first real
gate read … and its AUTHORED certification row — never a pending entry."*
`git log -L` attributes that line to `55674790`, whose own message reads *"THE
FLAG LANDS AT ES-0, not ES-1 — the chair rider that postdates the volume."*
`espionageGate.js:60-67` already implements the full three-door conjunction.

**THE STALE ADDRESSES:** `DESIGN_FP_ARCHITECTURE.md:487` (§3 flag table row 44
attributing the flag to ES-1) and `:1029-1030` (§5's ES-1 block claiming it mints
flag + manifest in one commit); `DESIGN_FP_ARCH_ES.md:1337-1338` and `:1345-1346`
(the ES-1 block still listing the manifest row, a declared-pending certification,
and the first by-name gate read).

**WHY IT IS DANGEROUS, not cosmetic:** an implementer following the compiled
volume — which `SOL_QUEUE.md` explicitly names as the ordering authority — would
try to re-mint a key already present with an authored row. `engineGatedRuleKeys`
asserts an **exact one-key delta** and would red. It also HIDES the scheduling
fact in §1. The correction already exists at `DESIGN_FP_ARCH_ES.md:320-325` and
`:1292-1294` — **but was only half-applied: the ES-1 block below it was never
updated.** A half-applied correction is more dangerous than none, because the
volume now contradicts itself and a reader may land on either half.
**REPAIR:** point, do not restate — per the derive-don't-restate law, each stale
site gets a pointer to the ONE spelling, and the ONE spelling is the manifest's
own provenance comment.

### ⚠ S2 — `envoyErrand.js` described as "at ceiling"; it is not. **RELEVANT TO CYCLE 4 RIGHT NOW.**
`DESIGN_FP_ARCHITECTURE.md:787-789` (the SP-D charter) says *"envoyErrand.js at
ceiling gains only the delegation call."* **Measured 695 effective / 800 — about
105 lines of headroom**, and it was already 695 at the doc's own cited
measurement commit. Root cause: the file was decomposed 2638→691 at `42299b07`
on 2026-08-03, *before* the volume compiled; the doc recorded the sibling
`peaceTerms.js` decomposition in its refutation register but never this one.
**CHAIR NOTE:** SP-D was dispatched carrying this stale premise. It is
BENIGN HERE — the premise over-constrains rather than under-constrains, and the
architecture it forced (mint head in a new `errandMint.js` leaf, the L8 lazy-leaf
recipe) is the right shape regardless. Recorded so it is not re-derived, and so
the next wave into this file knows it has room.

### ⚠ S3 — `peaceTerms.js` head budget described as "relaxed"; it has 15 lines.
`DESIGN_FP_ARCH_IN.md` R4 states the decomposition left it at **765 effective**
and that the head constraint "relaxes to the normal size budget." **Measured
785/800 — FIFTEEN lines.** GR-1's `caab995a` added 12 lines after the doc
compiled. ⚠ **CHAIR NOTE: GR-2 was dispatched in cycle 4 with a stated budget of
776/800 and +24 lines. That is wrong by nine lines against a tolerance-zero
ratchet.** GR-2's one permitted `peaceTerms.js` edit is the war door's
amendment-awareness guard, which should fit; if it does not, the ratchet reds
hard at commit and the cure is a leaf extraction, not a budget argument. Watch
for it at the cycle-4 close.

### ⚠ S4 — `envoyDiplomacy.js` carries no budget line at all. See §2 RANK 1 item 1.
A silent omission rather than a false statement, with the same effect: **3 lines
of headroom at the exact site ES-1 must edit.**

### ⚠ S5 — IN-2's "substrate blocker is GONE" is only CONDITIONALLY true.
J-FP-5 says SP-B lands before IN-2 so the scarcity/conditions baits' blocker is
gone. **Measured: `CHANNEL_BELIEF_AXES.trade` — the exact vocabulary IN's own S8
hard-block cites — is still `Object.freeze([])`, byte-identical.** SP-B did not
touch it; it built a *separate* subject-level substrate in `beliefAxes.js` /
`beliefAxisSubjects.js`. The blocker is gone **only if** IN-2's `axis` field is
authored against `subjectAxesActive` directly. Read through
`CHANNEL_BELIEF_AXES.trade` as S8 literally frames it and the block is unchanged.

### ⚠ S6 — IN-1's target module is ~70% already built, at a different address.
`DESIGN_FP_ARCH_IN.md:365` specifies a new pure module `secondOrderBelief.js`
(~250 lines). **Measured: `src/domain/worldPulse/outboundImpression.js` (175
lines) landed at `4c0f2f38` (SP-B) — one day AFTER the IN doc's compile head —
and its own header names "the one consumer this is built for (IN-1's `mirrorOf`,
behind `secondOrderBeliefEnabled`)."** Different filename, different export
(`outboundImpressionOf`), different return shape, and only 3 of 7 channels. It is
already wired into `couplingInclusion.walker.test.js` with its own suite.
**IN-1's real work is an extend-or-wrap decision the doc never anticipated;
building the new module fresh would create a SECOND reader and violate the
one-home discipline the same doc invokes elsewhere.**

### Cosmetic (record, do not prioritize)
**S7** — `DESIGN_FP_ARCH_IN.md` §1a S33 claims `ENGINE_GATED_VIRTUAL_RULE_KEYS`
has 5 keys; measured 13. **S8** — line-address rot in `DESIGN_FP_ARCH_GR.md` §2b
(`worstObserved` init cited `:634`, measured `:651`; its write `:676`→`:711`;
`findCrossPressuredMediator` `:783`→`:811`; `accrueMediationTrust` `:963`→`:991`).
Symbols all correct and the doc self-warns to navigate by symbol. ⭐ **Contrast
worth keeping: `sovereigntyBundleWr10.test.js:321/:388`, `heraldFeed.js:95` and
`peaceTermsGraph.js:103` all survived intact** — rot is not universal, so a
line address is neither trustworthy nor automatically wrong. **S9** —
`warConvergenceContract.js` cited as "820 lines measured"; measured 515 effective
/ 953 raw (SP-B2 added 133 raw after the SP doc's measurement: 953 − 133 = 820,
exactly the stale figure). **S10** — `heraldFeed.js` cited without its `src/`
prefix.

---

## §4 THE MEASUREMENT METHOD, AND ITS ONE UNRESOLVED GAP

Effective line counts were produced by a counter calibrated against five
baselined files, returning `pulseKernel 1580`, `applyWorldPulse 941`,
`settlementStrategy 812`, `warTermination 818`, `roadsKernel 838` — **exact
matches to all five committed baseline values**, so the method is calibrated
rather than assumed.

⚠ **ONE DISCREPANCY REMAINS UNRESOLVED:** `beliefMap.js` measures **778**, while
SP-B's own commit message says **774**. Four lines, unreconciled, and it cannot
be settled without running eslint inside the gate slot. Recorded rather than
smoothed over.

**Zero-headroom files, confirmed:** `pulseKernel.js` 1580/1580 (⛔ EP program
only — PRNG call order IS the stream identity), `applyWorldPulse.js` 941/941
(⛔ ES-2's charter forbids touching it), `generosityKernel.js` 800/800 (⛔ any new
logic must be a lazy leaf).
