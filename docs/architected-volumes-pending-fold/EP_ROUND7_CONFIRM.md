# EP_ROUND7_CONFIRM — THE CONFIRM ROUND REVISION 6 NEVER GOT

**DATE: 2026-08-07.**
**PREPARED UNDER OPUS 5, NOT FABLE 5.**
**⏳ OPUS-ERA — FABLE SURVEY OWED.**

> **EVERY JUDGEMENT IN THIS DOCUMENT IS VETOABLE.** Each carries a VETO
> SENTENCE stating the one thing a future session would need to believe in
> order to flip it. A veto costs one word today; discovering the same call
> baked into a landed wave costs the wave.

**WHAT THIS DOCUMENT IS.** `EP_CHAIR_RULINGS.md` §1.3 establishes a
structural gap that no individual revision block states:

> - Revision 3 "confirmed all nine revision-2 findings closed."
> - Revision 4 "confirmed all NINE revision-3 residuals genuinely closed."
> - Revision 5 "confirmed ALL SIX revision-4 rulings closed."
> - Revision 6 "confirmed ALL EIGHT revision-5 closures."
> - **Revision 6's own four rulings are confirmed closed by nobody.**

Ruling **E5** holds that gate: *"EP may not be dispatched as 'an attested
volume needing only queue insertion.' It needs the round-7 closure it never
got, or an explicit chair decision to build without one."* Queue insertion
IS the fold act, so E5 reaches the fold itself.

**This document performs the missing confirm round on revision 6's four
rulings — G1, G2, G3, G4 — and then RECOMMENDS a disposition for E5.**

**⛔ IT DOES NOT RULE E5.** §7 is a recommendation with the argument on
both sides and the crux named. **The chair rules.**

---

## §1 — THE METHOD, AND ITS LIMITS

For each of the four rulings: state it, find its consequence set, and check
that set **against the volume** and **against the live build tree**.

**The live tree read was `.claude/worktrees/minifold` @ `52791876`
(`claude/composite-r4`), READ-ONLY.** ⚠ This is not optional pedantry:
the ledger branch's `src/` is roughly two weeks stale and carries a
`pulseKernel.js` sizeBaseline of **1410**, while the build tree carries
**1580** — the figure every EP kernel premise is written against. **An
auditor who measures EP's premises on the ledger branch measures the wrong
file.**

**⛔ WHAT THIS ROUND COULD NOT DO.** No test, lint or gate command was run
— two build lanes hold the gate mutex. Every code finding below is from
**reading source**, and every claim requiring execution is labelled
PLAUSIBLE and listed in §8. **The single most load-bearing unexecuted
claim in the volume is named there and it is not a small one.**

**⚠ AND ONE HONEST LIMIT ON SCOPE.** This round verified that G1's
consequence set is **PRESENT and INTERNALLY COHERENT** at every site it
names, and it verified the code-measurable claims by reading the code. It
did **not** attempt to refute G1's *architecture* — whether stamping on the
composed world before every downstream subtree call is the right place, or
whether the A/B slice cut is the right cut. §7 weighs that limit explicitly
rather than hiding it.

---

## §2 — G1 (HIGH, ARCHITECTURAL) — **DEFECTIVE-AND-REPAIRABLE**

### 2.1 THE RULING

`tickStreamSeedOf(worldState, { absent })` was declared at four sites
across three revisions and **could not return an epoch-bearing seed under
either arm**: its signature carries no epoch, its body was spelled nowhere,
and the pending epoch has no `worldState` home during the tick. **RULED
(G1): the source is THE STAMPED LEDGER IN THE `worldState` THE SITE
RECEIVES.** The ledger gains a per-tick `latest: { tick, epoch }` beside
`byYear`; the accessor selects it ONLY when `latest.tick` equals the
world's own `tick`; the stale-tick arm falls back to the site's own
`absent` coercion character-for-character.

**AND THE CONSEQUENCE THAT MOVES A SLICE BOUNDARY** (J-EP-14, volume lines
3530–3554): **the writer, the leaf, seam edit 9, the +1 import line and the
`spatialUsage.js` manifest row ALL MOVE FROM SLICE B INTO SLICE A.**
Rationale: slice A ships under EITHER arm and now needs a stamp; slice B is
Q1-gated and cannot host slice A's dependency.

- **BEFORE** (revisions 3–5, lines 1314–1317): all five items sat entirely
  inside EP-3 **slice B**, the Arm-A-only, Q1-gated slice.
- **AFTER** (lines 1319–1326): slice A takes the leaf, the writer's
  `latest` half, `tickStreamSeedOf`, seam edit 9, the one import line and
  the one `EXEMPT_LEDGER_KEYS` row; slice B keeps the `byYear` half,
  `yearStreamSeedOf`, seam edits 7 and 8, and eight family-2 re-roots.

### 2.2 THE CONSEQUENCE SET — **PRESENT AND COHERENT AT EVERY SITE
CHECKED**

G1 is by far the largest of the four; its consequence set spans **~24
distinct sites**. Spot-checked and CONFIRMED present:

| Check | Result |
|---|---|
| §3b.1b exists as the accessor's full spec | **CONFIRMED** — a new ~190-line section, cross-referenced from lines 42, 162, 570, 1070, 1193, 1285, 1311, 1317 |
| Refutation count moved 12 → 13 | **CONFIRMED** — line 579: *"The exact, re-countable figure is now THIRTEEN labelled refutations, R1–R13"* |
| Ledger laws moved 4 → 5 | **CONFIRMED** — line 1375: *"FIVE laws, each load-bearing and each pinned — plus ONE DECLARED NON-INVARIANT"* |
| The ledger shape gained `latest` | **CONFIRMED** — lines 1263–1268, and the writer at 1351/1371 |
| The slice column is new in revision 6 | **CONFIRMED** — lines 1314–1326 state BEFORE and AFTER explicitly |
| §8.1 row 10 re-attributed to slice A | **CONFIRMED** — line 3704 |
| **§5's seam figure is UNMOVED at +10** | **CONFIRMED** — line 3294: *"the ⭐ **TEN** EP rows (§8.1) join under prefix EP; the matrix count amends ⭐ **+10**"*. G1 moved a row's *slice attribution*, never the row count. **This matters: §5 item 5 publishes VERBATIM into the parent volume.** |

**⭐ THE VOLUME IS UNUSUALLY GOOD AT MARKING ITS OWN MOVES.** Nearly every
consequence site carries an inline `(chair ruling G1)` or `(revision 6)`
attribution, and several state what the text said *before*. That is what
made this round cheap, and it is the opposite of the derive-don't-restate
hazard.

### 2.3 ⛔ THE DEFECT — THE DM-DOOR PIN IS VACUOUS AS SPELLED. **INDEPENDENTLY CONFIRMED.**

The pin, verbatim at volume lines 2950–2952, inside EP-3 slice A's pin set:

> ⭐ **the DM-DOOR pin (§3b.1b's J-EP-15): `mintRealmVerbProposal` on a
> NEVER-LIT world composes today's literal key, and on a lit world composes
> the key bearing that world's own `latest` epoch** — both directions, so
> the door's behaviour is recorded rather than found.

**The chair alleged this pin is vacuous. Re-measured against live source,
the allegation is CONFIRMED, and the chain is airtight:**

1. `buildRealmVerbOutcome` hardcodes `applyMode: 'proposal'` —
   `src/domain/worldPulse/realmVerbExecution.js:256`, in the returned
   literal, conditional on nothing.
2. The per-outcome loop's proposal arm `continue`s at
   `src/domain/worldPulse/applyWorldPulse.js:383`.
3. The realm-verb arm — the **only** caller of `applyRealmVerbOrder` — is
   at `applyWorldPulse.js:515`, **132 lines after that `continue`.**
4. `mintRealmVerbProposal` (line 1277) passes `outcomes: [built.outcome]`,
   whose `applyMode` is that hardcoded `'proposal'`. Line 383 fires
   unconditionally.
5. The `stateOnly` escape hatch (lines 360/365) would rewrite `applyMode`
   to `'auto'` and bypass the `continue` — **but it is dead here.**
   `isStateOnlyOutcome` tests `record?.recordMode === 'state_only'`, and
   `grep -n -a "recordMode" realmVerbExecution.js` returns **ZERO hits**.
   The minted outcome carries no `recordMode` at all.

**VERDICT: `mintRealmVerbProposal` composes NO realm-verb key in EITHER
flag state.** A pin driving it and asserting a composed key is green under
the correct implementation, green under a broken one, and **green under a
build that never wrote the accessor at all.** It is the estate's
worked-precedent shape: a pin that claims to prove a composed key while
driving a path that cannot produce one.

### 2.4 THE REPAIR — SOUND IN STRUCTURE, BUT IT NEEDS THREE GUARDRAILS OR IT GOES VACUOUS A SECOND TIME

The chair's named repair: *re-aim the DM-DOOR pin at
`applyWorldPulseProposal` (mint a proposal, then APPROVE it, and assert the
composed key at the approval), and add the mutant that a pin driving only
the mint stays green.*

**THE APPROVAL PATH DOES REACH THE ARM — CONFIRMED.**
`applyWorldPulseProposal` (line 1129) calls `resolveProposalToOutcome`
(line 1161), whose entire body is `decisionTier.js:132-134`:

```js
export function resolveProposalToOutcome(outcome) {
  return { ...(outcome || {}), applyMode: 'auto' };
}
```

`proposalPayload` survives (the row stored `clone(outcome)` at line 374),
so at line 515 the kind still matches. Nothing between 355 and 515
intercepts it. **The repair's premise holds.**

**⚠⚠ BUT THREE THINGS WOULD MAKE THE REPAIRED PIN VACUOUS AGAIN, AND THE
VOLUME MUST PIN AGAINST ALL THREE. This is new in this round; the chair's
repair as written does not name them:**

1. **⚠ ONLY 3 OF 14 REGISTERED VERBS COMPOSE A SEED AT ALL.** A whole-`src`
   grep returns exactly three realm-verb seed compositions, all inside
   `applyRealmVerbOrder`: `FORCE_CALAMITY` (line 676), `FORCE_FOUND_STEADING`
   (742), `FORCE_RESETTLE` (809). **Eleven verbs compose nothing.** A
   repaired pin driving `DECLARE_CASUS` or `TRANSFER_SOVEREIGNTY` is exactly
   as vacuous as the original — same defect, one layer over.
2. **⚠⚠ THE SEED IS A LOCAL `const` AND IS NEVER RETURNED.** The arm's
   contract is `{ worldState, newsEntries, refusal, substituteOutcome,
   settlementPatches }`. The seed string is consumed by `createPRNG` and
   discarded. **"Assert the composed key at the approval" is NOT readable
   off the return value.** The pin must mock the leaf — `createPRNG` is a
   **static** import at `realmVerbExecution.js:30`, so `vi.mock` does reach
   it, unlike the estate's recorded dynamic-import hazard — or assert a
   same-seed-derived artifact.
3. **⚠ EACH SEED LINE SITS BEHIND GATES THAT RETURN FIRST.**
   `FORCE_CALAMITY` refuses at 672 (`!calamityEnabled`) and 675 (no
   `settlementUpdates` entry) before reaching 676; the other two have the
   same shape. **The pin must light the flag AND supply saves**, or the arm
   refuses and composes nothing — a third road to a green vacuous pin.

**⭐ AND ONE ASYMMETRY NEITHER THE CHAIR NOR THE VOLUME FLAGS.**
`FORCE_RESETTLE`'s seed is `` `${rngSeed}:realm_verb` `` — **not
tick-keyed** — while the other two are `` `${rngSeed}:realm_verb:${nowTick}` ``.
These are two different entropy-root families, matching the volume's own
"25 roots in TWO families" framing. **A uniformly-applied epoch suffix
changes `FORCE_RESETTLE`'s stream shape differently from the other two**,
and `FORCE_RESETTLE` is precisely the verb J-EP-10 already escalates on
THE PROMISE grounds. This deserves a named row before EP-3 slice A builds.

### 2.5 THE ADJACENT UNCLOSED OBSERVATION — CONFIRMED, BUT NOT REACHABLE TODAY

`EP_CHAIR_RULINGS.md` records an unclosed observation: at the approval door
the tick is a `||` chain, so a live tick of 0 falls through to the mint-time
tick. **CONFIRMED verbatim** at `applyWorldPulse.js:1191`:

```js
    tick: campaign.worldState?.tick || proposal.tick || 0,
```

The idiom repeats at lines 1136, 1199, 1237 and at the mint door (1258).

**BUT THE DIVERGENT CASE IS NOT REACHABLE — REFUTED as a live defect.**
Tick 0 is a real state (`worldState.js:268`), but an approval at tick 0 can
only involve a proposal that also carries tick 0, so the fallthrough
resolves to the identical value. Organic proposals can never carry tick 0:
the kernel advances first (`pulseKernel.js:186`, `const tick = current.tick
+ 1;`). The divergent case needs a rewind to tick 0 that retains proposals,
and no such path exists — `createDefaultWorldState` resets `tick: 0` and
`proposals: []` together.

**⚠ HARMLESS TODAY, LATENT TRAP FOR EP SPECIFICALLY.** The chain is safe
only because tick 0 and proposal-tick 0 coincide. **Any EP change that
makes a zero-valued clock component meaningful — an epoch-relative tick, a
year-0 stream key — makes this `||` silently substitute the mint-time
value.** Worth an EP-owned pin regardless of the current verdict.

### 2.6 G1 VERDICT

**DEFECTIVE-AND-REPAIRABLE.** The ruling itself is **sound**, its
architecture is coherent, and its consequence set is present and correctly
attributed at every site checked. **The defect is inside the consequence
set, not in the ruling**: one pin in EP-3 slice A's pin set is vacuous as
spelled.

**THE REPAIR, FULLY NAMED:** re-aim the DM-door pin at
`applyWorldPulseProposal` and assert at the APPROVAL, **and** (a) drive one
of the three seed-composing verbs only, (b) observe the seed by mocking the
static `createPRNG` import rather than reading a return value that does not
carry it, (c) light the verb's flag and supply the `settlementUpdates`
entry so the arm does not refuse first, **and** (d) add the mutant that a
pin driving only the mint stays green, so the vacuity cannot return.
**Record `FORCE_RESETTLE`'s non-tick-keyed seed as its own row.**

> **VETO SENTENCE.** To flip this verdict to CONFIRMED you would need
> `mintRealmVerbProposal` to reach `applyRealmVerbOrder` — which the
> unconditional `continue` at `applyWorldPulse.js:383`, 132 lines upstream
> of the arm at 515, forecloses.

---

## §3 — G2 (MEDIUM) — **CONFIRMED**

**THE RULING.** The collapse-semantics premise is respelled accurately at
three homes (§1.5, §3b.1a, §8.4). What is true, MEASURED: the path composes
by SPREAD so `spatialLedgers` is CARRIED THROUGH, and the one
`spatialLedgers` write on the path is
`reconcileProvenanceAfterHistoryCollapse`'s PROVENANCE prune, which
preserves every sibling key. The ruling is unchanged; only the
falsifiable-in-one-grep phrasing is gone.

**ALL THREE LEGS MEASURED AGAINST LIVE SOURCE:**

**(a) The spread composition exists verbatim** —
`src/domain/worldPulse/advanceInterval.js:203–206`:

```js
  return reconcileProvenanceAfterHistoryCollapse(
    { ...worldState, pulseHistory: composed },
    removed,
  );
```

**(b) The prune preserves siblings** — `provenanceKernel.js:376–377`, both
write expressions `'provenance'`-scoped; `setSpatialLedger` spreads the
existing namespace; `dropSpatialLedger` collapses the namespace **only when
`rest` is empty**, i.e. only when there were no siblings.

**(c) It is the ONLY `spatialLedgers` write on the path** —
`grep -n -a "spatialLedgers" advanceInterval.js` returns **zero hits**, and
the file imports neither `setSpatialLedger` nor `dropSpatialLedger`. The
collapse body calls exactly three things, two of them pure reads.

The measured gate the volume quotes is verbatim at `provenanceKernel.js:318`.

**⭐ G2 IS STRENGTHENED FOR EP, NOT MERELY UPHELD.** Once
`spatialLedgers.advanceEpoch` exists, `rest` is never empty, so the
namespace survives the drop branch too.

**⚠ ONE PEDANTIC NUANCE, NOT A REFUTATION.** There are strictly **two**
write expressions (376 and 377), not one — but both target `'provenance'`
only, which is what G2's substance asserts. Recorded so a future reader
grepping for "one write" is not confused by finding two.

> **VETO SENTENCE.** To flip G2 you would need a second `spatialLedgers`
> writer on the collapse path — which the zero-hit grep on
> `advanceInterval.js` and its import list foreclose.

---

## §4 — G3 (LOW) — **CONFIRMED**

**THE RULING.** The four-mutant matrix is reconciled to ONE spec across its
two homes: §4's slice charter now states §3b.1a's rows — mutant (ii) reds
rows 2–9 **plus the returned-world arm** — because a wholesale replacement
at the `memoryState` seam is UPSTREAM of the return.

**BOTH HOMES READ, AND THEY AGREE:**

- **Home 1, §3b.1a (the authority), the matrix table:** mutant (ii) → Must
  RED `rows 2–9 + the returned-world arm`; Must stay GREEN `row 1`.
- **Home 2, §4 EP-3 slice B charter:** *"(ii) a wholesale-replacement plant
  at the `memoryState` seam reds **rows 2–9 PLUS the returned-world arm**
  and NOT row 1"* — and it is **self-labelled**: *"⚠⚠ RECONCILED TO
  §3b.1a's MATRIX IN REVISION 6 (chair ruling G3): this charter previously
  said mutant (ii) reds 'rows 2–8' and omitted the arm, which disagrees
  with the table it cites."*

**⭐ THE SECOND HOME NAMES ITS OWN PRIOR ERROR IN PLACE.** That is the
derive-don't-restate discipline working: the correction is not silent, so a
reader meeting the old "rows 2–8" figure in a stale quote elsewhere can
date it.

**⭐ AND THE MATRIX SURVIVES THE OBVIOUS OBJECTION.** Mutants (ii) and
(iii) share a red signature deliberately — the volume states this and
states why: they plant at different addresses in different files, and fifty
of the sixty-nine rebinds sit at or past that file boundary. **A suite
running only one of them has not proven it reaches across the boundary.**
This is the estate's "two guards over one job can only be pinned JOINTLY"
law applied correctly, in advance.

> **VETO SENTENCE.** To flip G3 you would need a third home for the mutant
> matrix that still reads "rows 2–8"; the two homes G3 names now agree
> verbatim.

---

## §5 — G4 (LOW) — **CONFIRMED**

**THE RULING.** The attribution ruling's stated ambiguity is corrected:
**SEVEN of the nine** family-2 rows sit in argument-identical groups, not
five — RS-3 and RS-9 share `{ absent: '', yearBase: 0 }` exactly as
RS-4/5/6/7/8 share `{ absent: '', yearBase: 1 }`.

**THE ARITHMETIC CHECKS: 5 + 2 = 7**, and the volume shows its work for
both groups, citing §3b.2's row-13 line for RS-3's `yearBase` 0, §3b.3's
coercion row 2 for RS-9's `absent: ''`, and §3b.2's row-20 line for RS-9's
`yearBase` 0. Only RS-2 (`{ absent: undefined, yearBase: 1 }`) and RS-16
(`{ absent: null, yearBase: 1 }`) are argument-separable at all.

**⭐⭐ THE RULING'S REAL VALUE IS THE HAZARD IT NAMES, AND IT IS THE
SHARPEST SENTENCE IN THE REVISION:**

> **THE UNDERSTATEMENT WAS ITSELF THE HAZARD:** an implementer reading
> "five are argument-identical" infers the other four ARE
> argument-separable and builds a hybrid spy that attributes RS-3 and RS-9
> by their options bag; the two then collide silently and row 20 — the
> succession-adjacent one — certifies epoch-bearing without ever having run.

**That is a correctly-diagnosed vacuity trap**, of exactly the class this
estate has banked ("an enumeration on the credit side fails open"; "a
nine-rows-observed assertion over an unattributable stream is the
self-referential pin class"). **And the ruled cure is unaffected by the
correction and covers all seven** — calling-module attribution separates
RS-3 (`generosityKernel.js`) from RS-9 (`npcLadderKernel.js`), and the
function frame separates the same-module pair. **The cure was already
total; only the stated denominator was wrong.**

G4's second half — the two citation slips (law 5, and RS-16 being a
VIEW-TIME site needing a separate drive) — is **CONFIRMED cured in place**
at lines 138–140 and 1540–1546.

> **VETO SENTENCE.** To flip G4 you would need RS-3 or RS-9 to carry a
> distinguishing argument; both are measured at `{ absent: '', yearBase: 0 }`
> with per-row citations.

---

## §6 — ⚠⚠ ONE ADJUDICATION THAT WENT THE OTHER WAY, RECORDED BECAUSE IT
NEARLY BECAME A FINDING

A verification lane in this round reported a **MAJOR FINDING**: that
`EXEMPT_LEDGER_KEYS` already exists in the live tree
(`src/lib/spatialUsage.js:240`), that the walker
`tests/lib/spatialLedgerCoverage.walker.test.js` asserts
`expect(classified).toEqual(written)` — exact set equality — and that
**"the volume assumes a clean slate on the name and is silent on the
registration duty"**, so EP writing `spatialLedgers.latest` would red the
walker on day one.

**THE FIRST TWO CLAIMS ARE TRUE. THE THIRD IS REFUTED BY THE VOLUME'S OWN
TEXT, AND THE INFERENCE RESTS ON A MISREAD OF THE LEDGER SHAPE.**

**(a) `latest` is NOT a `spatialLedgers` key.** The writer, spelled at
volume lines 1351 and 1371, is:

```js
  return setSpatialLedger(worldState, 'advanceEpoch', { latest: { tick, epoch: String(epochTerm) }, byYear });
```

The ledger key is **`advanceEpoch`**. `latest` is a **sub-key of that
ledger's VALUE**, alongside `byYear`. The walker's `writtenLedgerKeys()`
scans the key argument of `setSpatialLedger`, so it sees `advanceEpoch` and
never sees `latest`.

**(b) The volume is the opposite of silent — it is exhaustive.** §8.1 row
10 (line 3704) is one of the longest rows in the volume and it names: the
walker by its corrected path (`tests/lib/` **not** `tests/lint/`, chair
ruling F3), its `describe` block by symbol, its `writtenLedgerKeys()` scan
mechanics, the `expect(classified).toEqual(written)` **exact set equality
in BOTH directions**, the ruling that `advanceEpoch` joins **EXEMPT** not
TRACKED with its written reason, that an unclassified `advanceEpoch`
**"REDS slice A on day one"**, that the store-layer escape route is
**named and refused**, and the CQ5-class serialization law attached to the
shared file. The registration duty is discharged at eleven further sites
(lines 31, 1320, 1437, 1662–1672, 1705, 2217, 2248, 2903, 3075, 3241, 3536).

**(c) There is no name collision.** The volume states at line 1705 that the
cost is *"ONE `EXEMPT_LEDGER_KEYS` row with its written reason … ZERO — the
row already exists"* — i.e. it plans to add one ROW to the EXISTING const,
which is what the const is for.

**⭐ WHY THIS IS RECORDED RATHER THAN QUIETLY DROPPED.** It is a live
instance of the estate's own law that a verifier's finding must itself be
verified. Had it been inherited, this document would have reported a
fabricated blocker against the volume's most carefully-documented
consequence site — and the volume would have been asked to fix something it
had already fixed better than the finding described. **The claim was
checked against the volume before being repeated. That check is the only
reason it is not in §8 as a fold blocker.**

---

## §7 — RECOMMENDATION ON E5

**⛔ THIS IS A RECOMMENDATION. THE CHAIR RULES.**

### 7.1 THE RECOMMENDATION

**RECOMMEND: CLOSE E5 — accept this document as the round-7 closure — with
TWO NAMED RESIDUALS carried as wave-scoped conditions rather than as fold
blockers.**

1. **The DM-door repair of §2.4, in full including its three guardrails and
   the `FORCE_RESETTLE` row, lands before EP-3 slice A builds.** Not before
   the fold — before that wave.
2. **The draw-count parity claim is EXECUTED at EP-1's landing** (§8). It
   could not be executed in this round and it is the volume's highest-value
   unexecuted claim.

### 7.2 THE ARGUMENT FOR CLOSING

**The gap E5 names is now, as a matter of fact, closed.** E5's own text
defines the gap precisely: *"revision 6's four rulings — one of them HIGH
and architectural — have never been adversarially reviewed."* All four have
now been reviewed by a lane that did not write them: **G2, G3 and G4
CONFIRMED against the volume and, for G2, against live source; G1's ruling
confirmed sound and its ~24-site consequence set confirmed present and
coherent.**

**The check that most needed doing has been done against real code.** EP is
the pulseKernel volume, and the highest-risk failure mode for a volume like
this is a pin that certifies without observing. The round found exactly
that, re-confirmed it independently down to the `continue` at line 383, and
then **improved on the chair's own repair by three guardrails and one
entropy-family asymmetry** — none of which the chair's repair named. That
is what a confirm round is for, and it produced its yield.

**The residual defects are wave-scoped, not fold-scoped.** The DM-door pin
lives in EP-3 slice A's pin set. The fold act is queue insertion; nothing
in §2.4 changes a seam row, a flag row, a wave count, or the §5 arithmetic
that publishes verbatim into the parent. **§5's `+10` was specifically
checked and is unmoved.**

**A seventh full round has a real cost and a poor expected yield.** The
volume has survived six passes, each confirming the last. This round read
the four rulings that were unconfirmed and found one defect — already known
— plus refinements. **The marginal defect-per-hour of a further full round
over already-twice-confirmed material is low, and the program's scarcest
resource is landing time, with 33 waves held behind this fold.**

### 7.3 THE ARGUMENT AGAINST — BUILD WITHOUT A CLOSURE, RECORDING THE REASON

**This document is one lane, one pass, and it is not adversarial in the
estate's strong sense.** It verified that G1's consequence set is PRESENT;
it did not verify that each of the ~24 sites is CORRECT. **Presence is a
weaker property than correctness**, and the estate's own recorded law is
that a guard which cannot be reddened cannot be proven — most of what was
checked here was checked by reading, not by reddening.

**It did not attack G1's architecture at all.** Whether the stamp belongs
on the composed world before every downstream subtree call, and whether the
A/B cut is the right cut, were taken as given. A genuine adversarial round
would attack exactly those, and G1 is HIGH and architectural precisely
because they are the load-bearing choices.

**⚠⚠ AND THE STRONGEST POINT AGAINST: the volume's central safety claim is
UNEXECUTED.** The volume asserts (lines 874–877) that *"Draw counts are
identical in BOTH flag states: the seam moves the seed VALUE only, never a
control-flow branch, so the number and order of `rng.random()` /
`rng.fork()` calls is unchanged."* **In `pulseKernel.js`, PRNG call order
IS the stream identity.** That claim is the difference between a dark
program and a silent same-seed shift across every existing world — and it
has been verified only by reading. **This round could not execute it (the
gate is a machine mutex held by two build lanes), and no prior round
executed it either.** If E5 exists to catch anything, this is the thing it
exists to catch.

### 7.4 THE CRUX

**The two positions differ on one question: is E5's gap about the RULINGS
being unconfirmed, or about the VOLUME never having faced a full
adversarial round after its largest architectural change?**

E5's own wording is the former — "revision 6's four rulings … have never
been adversarially reviewed" — and on that reading **this document closes
it.** On the latter reading nothing short of a full round closes it, and
arguably no document could, because the claim most in need of adversarial
attention is not a document claim at all: **it is an executed draw-count
parity test that cannot be run until the gate frees.**

**That asymmetry is what tips the recommendation.** A seventh *document*
round cannot reach the draw-count claim; only a build lane at EP-1 can.
**Holding the fold for a round that structurally cannot examine the
volume's riskiest claim buys less than routing that claim to the one place
it can actually be executed** — which is condition 2 above. **Close E5;
carry the two residuals as wave conditions; and let the parity claim be
proven by the gate rather than by another reading of the same 4,005 lines.**

> **VETO SENTENCE.** To flip this recommendation you would need to hold
> that a HIGH architectural ruling requires a full adversarial round *of
> its architecture* — not merely of its rulings and consequence set —
> before any of its program may be queued. That is a defensible position,
> and it is exactly the position §7.3 states; if the chair holds it, E5
> should stay open and a round seven should be commissioned with
> G1's architecture as its declared target.

---

## §8 — WHAT REMAINS OWED, AND WHAT WAS NOT EXECUTED

| # | Owed | Label | Blocks |
|---|---|---|---|
| 1 | **⚠⚠ The draw-count parity claim** (volume lines 874–877) — identical `rng.random()` / `rng.fork()` count and order in both flag states | **PLAUSIBLE — read, never executed** | Should gate **EP-1's landing**, not the fold |
| 2 | **The DM-door pin repair** + the three guardrails of §2.4 + the `FORCE_RESETTLE` non-tick-keyed seed row | CONFIRMED defect, repair named | **EP-3 slice A** |
| 3 | **The `\|\|` tick chain** (§2.5) — harmless today, latent under any epoch-relative clock | CONFIRMED verbatim; divergence unreachable | Nothing; recommend an EP-owned pin |
| 4 | **`pulseKernel.js` at its 1580 ceiling** — slice A's declared **+1** import line requires the baseline entry raised to 1581 **in the same commit**; the ratchet is two-way | PLAUSIBLE (no eslint run; raw 2820, baseline literal 1580 CONFIRMED) | **EP-3 slice A** |
| 5 | **Re-measure every §5 figure at the publishing commit** — the volume's own law, and the ledger branch is the wrong tree (baseline 1410 vs 1580) | — | Each wave |
| 6 | **EP's four owner escalations** — A4/A5, A11, H5 signed; J-EP-10's FORCE_RESETTLE escalation declined at the chair | Owner-gated | **None blocks an EP wave** |
| 7 | **FABLE SURVEY** of this document | ⏳ | Nothing |

**⛔ NOT EXECUTED IN THIS ROUND, AND WHY:** no vitest, no `npm run check`,
no lint, no gate. Two build lanes hold the gate mutex, and the estate's
concurrency law makes the gate a machine mutex with one slot. **Every claim
above that would require execution is labelled PLAUSIBLE and appears in
this table.** Nothing in this document should be read as a test result.

**⭐ CONFIRMED CLEAN-SLATE CHECK.** `tickStreamSeedOf`, `yearStreamSeedOf`,
`epochSuffix`, `advanceEpochEnabled` and any `spatialLedgers.advanceEpoch`
write all return **zero hits** in the live build tree. **No EP symbol has
landed; the volume's clean-slate assumption holds.**


---

# ⚖ CHAIR RULING ON E5 — 2026-08-07. **E5 IS CLOSED.**

## ⏳ OPUS-ERA — FABLE SURVEY OWED. Ruled under Opus 5, not Fable 5. **VETOABLE.**

**RULED: this document IS the round-7 closure. EP may be dispatched at the fold.**

I adopt the recommendation, and I adopt it on the CRUX this round stated against itself
rather than on the case for it. That argument deserves quoting, because it is the strongest
objection available and it is the reason the ruling goes the way it does:

> *"The volume's central safety claim is UNEXECUTED … 'Draw counts are identical in BOTH flag
> states' … In `pulseKernel.js`, PRNG CALL ORDER IS THE STREAM IDENTITY. That claim is the
> difference between a dark program and a silent same-seed shift across every existing world,
> and it has been verified only by reading. If E5 exists to catch anything, this is the thing
> it exists to catch."*

**AND THAT IS EXACTLY WHY A SEVENTH DOCUMENT ROUND IS THE WRONG INSTRUMENT.** The riskiest
claim in this volume is not a document claim at all — it is an executed test. No amount of
reading reaches it. A seventh round would examine everything except the one thing that
matters most, and would hold 33 waves behind the fold while doing so. **The correct act is
not to hold the fold; it is to route the claim to the only place it can be executed and make
that routing BINDING.** That is what the conditions below do.

What E5's own text asked for has, as a matter of fact, been done: revision 6's four rulings
have now been reviewed by a lane that did not write them. Three CONFIRMED — G2 against live
source on all three legs. G1's ruling confirmed sound and its ~24-site consequence set
confirmed present and coherent, with §5's `+10` specifically checked and UNMOVED, which
matters because §5 publishes verbatim into the parent.

## THREE BINDING CONDITIONS

**C1 — THE DM-DOOR REPAIR LANDS BEFORE EP-3 SLICE A BUILDS**, in full, including all THREE
guardrails this round added beyond the original repair — drive one of the only THREE
seed-composing verbs (eleven of fourteen compose nothing, so a pin on the wrong verb is
exactly as vacuous as the one being replaced); OBSERVE the seed by mocking `createPRNG`,
because the seed is a local const the arm's contract never returns; and LIGHT the verb's flag
and supply its `settlementUpdates` entry, since each seed line sits behind gates that return
first. Plus the chair's original mutant: a pin driving only the mint must stay GREEN. Plus
record `FORCE_RESETTLE`'s non-tick-keyed seed as its own row — two entropy-root families, and
that verb is already escalated on THE PROMISE grounds. **Wave-scoped, not fold-scoped.**

**C2 — ⛔ THE DRAW-COUNT PARITY CLAIM IS EXECUTED BEFORE EP-1 *LANDS*, NOT AFTER.** I am
tightening the recommendation here. A failure is a **STOP-AND-REPORT, never a repair in
place**, because a moved draw count is a silent same-seed shift across every existing world —
precisely the class §3h forbids from landing late, and the one claim E5 was written to catch.
It may not be discharged by reading, by a reviewer's agreement, or by a green suite that does
not count draws.

**C3 — EP'S ROWS COMPOSE LAST IN THE FOLD, AND THE PARENT COUNT IS TAKEN PRE-FOLD.** The
VERIFY-AT-FOLD trigger RE-FIRES on any fold landing before EP's rows are composed — HB's,
WC's, or EP's own.

## ⚠⚠ AND A FALSE-STOP HAZARD THIS ROUND FOUND, WHICH WOULD HAVE FIRED C3 WRONGLY

The parent's §9 carries **47 PHYSICAL data rows** while its closing summary says **66 seams
pinned**. That is NOT a defect — it is the fold convention: rows 46 and 47 are COMPRESSED
RANGE rows (`46-58 THE ESPIONAGE BLOCK (13 rows)`, `59-66 THE WAYFARE BLOCK (8 rows)`), and
45 + 13 + 8 = 66. **A folded volume contributes ONE physical row and +N logical seams.**

⛔ **An operator who counts physical rows at the fold measures 47, disagrees with the 66 that
EP's VERIFY-AT-FOLD banner tests against, and fires a FALSE STOP** — halting the fold over a
convention rather than a defect. Recorded here because C3 is the condition that would have
triggered it.

## ⛔ THE FOLD IS NOT YET DISPATCHABLE — ONE BLOCKER REMAINS, AND IT IS NEW

**WC HAS NO §8.1 SEAM TABLE AND THEREFORE NO DERIVABLE SEAM COUNT.** MEASURED: zero markdown
pipe tables across 6,492 lines, no §8, no §9, no queue-insertion section — WC was never given
the fold apparatus that declares one. The parent's §9 arithmetic cannot be written without it.

⛔ **DO NOT MANUFACTURE A NUMBER, and do NOT grep-count "seam row" in WC** — that phrase
appears 12 times there meaning a test pin inside a wave, which is a different thing. Proxies
of 5 and 25 BRACKET the answer; neither IS it.

**CHAIR ACT OWED AND COMMISSIONED: transcribe WC SECTION 4's existing contracts into the
house four-column §8.1 shape, then apply the stated rule.** Mechanical, not architectural —
the contracts already exist.

## ⚠ ONE MORE, AFFECTING REPRODUCIBILITY RATHER THAN DISPATCH

`HABIT_countsweep.py` **ABORTS AS PACKAGED** — exit 1, `FileNotFoundError` — because the
snapshot prefixed both instruments with `HABIT_` while the script resolves its sibling by the
canonical name `VERIFY_oddsratio.py`, which it both hashes and executes. **This is a THIRD
instance of the rename-is-three-part class, and this one is the chair's own doing:** the
snapshot naming broke an instrument's sibling locator. The instrument's backstop behaved
correctly, printing a loud finding rather than dying silently. Cure is three-part as always.
