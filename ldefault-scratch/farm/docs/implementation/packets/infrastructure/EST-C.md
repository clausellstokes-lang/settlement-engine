# INFRA / EST-C — the icon-admission asymmetry, and a live feature that has never worked

**Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` at SHA-256
`c4e3f531ba585ef6d033ac3deb3b88ece5648c527c6ef7f46020ef0156de38ce`.

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `5c774940c1edfc20bd11ace2c40141088081807b`
- **Landed:** `c632cbf466f39298317de13603f4e0528d00d211` — the `est-1c` train's sole member and
  its last content commit. Chain: promotion `0adf27ff` → content `5ca2012c` → census half +
  the ruled conversion `c632cbf4` → the terminal. ⚠ **Two content commits, and the split is
  forced twice over**: the remove-only re-freeze may not be taken over a live tree, so the
  content committed first and the freeze was taken DETACHED at that committed sha with
  `TEST_RATCHET_SHA` carrying it; and the `CR-EST-CONTROLZERO` conversion is only TRUE once
  the baseline drops to 12, so it rides that same second commit rather than either neighbour.
  §0, §7.1 and §11 carry the executed landing evidence.
- **Train:** `est-1c`, the **sole member** of a one-member follow-up train. It was compiled as
  `est-1`'s member 3 of 3 and **STOPPED at that train's terminal** on a blocker that could not
  exist until EST-A's win was banked (§0 below). §60.3's shape is preserved exactly: the
  owner-gate-grazing member lands **alone and never as a prefix**.
- **Predecessor:** `est-1` landed EST-A and EST-B and closed at `5c774940`, this packet's base.
- **Authority:** `OWNER_DECISION_QUEUE.md` §56.1 (E-1) with its **cure site MOVED** by §60.1,
  which is the ruling that unblocks this member: *"⛔⛔ THE E-1 RECLASSIFICATION IS THE
  HEADLINE: a LIVE TOTAL OUTAGE, not fixture rot… **Q1 RULED: REPAIR, per the four measured
  grounds** — the admission side admits the writer's deliberate empty-icon output (proven:
  cured → ADMITTED; non-empty → chains byte-identical, no persisted hash moves). The
  persistence-admission grazing is noted on the veto surface per the standing law."*
- **Code of record:** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold`,
  branch `claude/composite-r4`.

---

## §0 · ⭐⭐ THE BLOCKER THAT STOPPED `est-1`, AND THE RULING THAT CLEARS IT

`tests/lint/testRatchet.test.js` holds `ORDINARY_TEST_CONTROL` — the false-positive half of the
walker-census classifier control — under an arm requiring every named file to carry a **LIVE
census row**. That list named **exactly the three files `est-1` repairs**. EST-A's burn evicted
one and stepped the floor `3 → 2` on the file's own written law. Measured set arithmetic then
settled the rest, over the 15 census rows remaining at this base against the two ledgers in that
same file:

```
census at this base                            15
LEDGERED (walker rows)                         12
NOT ledgered (ordinary debt)                    3   ← EXACTLY this packet's three targets
ORDINARY DEBT REMAINING AFTER THIS MEMBER:      0
ORDINARY-DEBT FILES REMAINING:                 []
```

⇒ **this member takes the estate's ordinary-debt population to ZERO**, and the control list
cannot be refilled: naming any survivor would certify a walker as ordinary, the exact
2026-08-07 error the block exists to prevent.

**⭐⭐ `CR-EST-CONTROLZERO` IS RULED — THE ZERO-ASSERTION CONVERSION (lock-the-win).** The
control does **not** remain as a tautology and is **not** refilled by mis-certifying a walker.
It **CONVERTS to the victory assertion**: the arm now asserts the ordinary-debt population **IS
EXACTLY ZERO**, its message names the eradication, and **any future ordinary failure reds the
gate on arrival instead of joining a census.** This is the lock-the-win door of the standing
census-ceiling family; it **strengthens** the guard rather than deleting it, and it aligns with
the FAILING-TEST-IS-DEBT doctrine. ⛔ All three partial shapes the stopping lane refused stay
refused (empty-list-with-a-zero-floor; cure-without-re-freeze; a self-written discharge).

⚠ **The conversion is this member's SEVENTH path**, priced here at compile rather than found at
its gate — the lesson `est-1` paid twice for: **burning a census row is never a one-path act.**

---

## §1 · ⛔⛔ THE HEADLINE — THIS IS NOT TEST DEBT, IT IS A TOTAL FEATURE OUTAGE

Ratchet entries 7, 8 and 16 are not instrument rot. They are three guards **correctly
reporting that a shipped feature does not work**, filed as `"class": "debt"` under an
attribution that is false in both halves.

**Confirming any auto-discovered supply chain is refused.** Every chain the discoverer
produces carries `needIcon: ''`; the admission boundary rejects the empty string; nothing in
between fills it.

⭐ **And the chartered cure would have hidden it.** Patching a non-empty `needIcon` into the
two test files turns all three guards green **and removes the last instrument pointing at the
outage** — the recorded *banked-failure-lies-twice* class arriving by a new road.

## §2 · The false attribution, quoted and refuted

The three baseline rows say the hash throws because it *"rejects **fixtures/records** whose
needIcon is absent or empty"* and that a *"burn-down lane must find **the writer that stopped
supplying needIcon**."*

| Claim | Measured at this base | Verdict |
|---|---|---|
| "fixtures" | both banked test files `import { inferSupplyChains }` and build the chain from its **real output** | ⛔ **FALSE** — it is the product's own output |
| "the writer stopped supplying needIcon" | `inferSupplyChains.js` supplies it — as `''`, **deliberately**, under a nine-line rationale, **pinned** by `copyCorruption.test.js` | ⛔ **FALSE** — the writer never stopped |
| "unbisectable" | the defect is not a commit; it is a **standing asymmetry between two sibling validators** | ⛔ **FALSE by category** — nothing to bisect |

## §3 · The actual defect — two sibling icon fields, one object, two rules

| Field | Admission rule | Accepts `''`? |
|---|---|---|
| `resourceIcon` | `reviewedSupplyChainPersistence.js:517-520` — `typeof === 'string' && [...v].length <= MAX_TEXT` | ✅ **YES** |
| `needIcon` | `reviewedSupplyChainPersistence.js:542` — `boundedText(…)`, whose `:168` arm is `value.length === 0` → throw | ⛔ **NO** |

Both are written by the same writer in the same object literal as the same empty string.
⭐ **And the writer's own comment records the belief that they are symmetric** — it asserts the
boundary *"demands `typeof resourceIcon === 'string'`"* (true for `resourceIcon`, **false**
for `needIcon`) and then says *"needIcon: see the resourceIcon note above"*. **A comment that
misdescribes a boundary is how this survived every prior sweep.** §60 Q5 corrects it in this
same commit.

## §4 · The live path, traced end to end

```
SupplyChainsManager.jsx:41   inferSupplyChains(customContent)        → every chain: needIcon: ''
SupplyChainsManager.jsx:74   confirmCustomSupplyChainReview(chain)   → spreads it through unchanged
SupplyChainsManager.jsx:75   saveReviewedSupplyChain(reviewed)
  customContentReviewedSupplyChainActions.js:282  applyReviewedSupplyChainCommand({…confirm})
  customContentReviewedSupplyChainActions.js:116  previewReviewedSupplyChainCommand({…})
    reviewedSupplyChainPersistence.js:723         admitReviewedSupplyChain(raw.chain)
      reviewedSupplyChainPersistence.js:542       boundedText(artifact.needIcon)  ⛔
```

**Nothing fills `needIcon` in between**, and the renderer guards `{needIcon && …}` — **empty
is a handled, deliberate render state**, which is the third independent confirmation that
`''` is the intended value.

## §5 · ⭐⭐ PREFLIGHT — EXECUTED against the REAL modules at this train's base

Driven over a `git archive` tree at `a6fd6395` with the **banked test's own fixture shape**,
verbatim — not a shape this lane invented:

```
discovered chains                                  1
chain.needIcon                                     ""
chain.resourceIcon                                 ""
chain.needLabel / needColor                        "Custom" / "#a0762a"

== 1. THE LIVE PATH AT HEAD ==
  REFUSED ok=false errors=["needIcon must be bounded non-empty text."]

== 2. THE SAME PATH WITH THE CURE APPLIED ==
  ADMITTED ok=true

== 3. BLAST RADIUS — the cure is a pure WIDENING ==
  a NON-empty needIcon, HEAD vs CURED:  HEAD ok=true · CURED ok=true · chains byte-identical=true
```

**Three things are settled by execution, not argument:**

1. The banked error string is **reproduced exactly** from the real writer's real output.
2. ⭐ **`needIcon` is the ONLY blocker.** The cure ADMITS — it does not advance to a second
   throw. `resourceIcon: ''`, `upstreamNote: ''`, `services: []` and the rest all pass today.
3. ⭐ **The cure cannot move a single persisted hash.** For an already-admitting value the
   HEAD and cured admissions produce **byte-identical chains**. Combined with the fact that no
   record carrying `needIcon: ''` can exist (admission always refused), **no content hash
   anywhere can change.** This is the behaviour-shift claim, proven rather than asserted.

## §6 · The cure

Two edits in `src/domain/content/reviewedSupplyChainPersistence.js`: `boundedText` gains one
explicit `emptyOk` option (JSDoc and the guard arm), and the one `needIcon` call site opts in
under a comment naming both sibling validators and the renderer.

### 6.1 Alternatives considered and rejected — with the measurement that rejects each

| Alternative | Rejected because |
|---|---|
| Patch the two test fixtures to a non-empty icon (**the chartered cure**) | Greens three guards over a live outage and destroys the only instrument pointing at it (§1) |
| Make `inferSupplyChains` emit a placeholder glyph | Changes generated content; **reds `copyCorruption.test.js`**, which pins the exact literal and allowlists the field; and contradicts the writer's own recorded rationale that empty is the honest value |
| Make `needIcon` nullable and emit `null` | Widest blast radius — moves `CHAIN_KEYS` semantics, the writer, and the renderer's truthiness guard, for no gain over `emptyOk` |
| Point `needIcon` at `resourceIcon`'s inline permissive check | ⚠ Would silently **drop the trim check** that `boundedText` applies. `emptyOk` keeps `needIcon` **stricter** than its sibling while admitting the one value at issue |
| Also **tighten** `resourceIcon` to `boundedText` for symmetry | ⛔ **A NARROWING.** A persisted record carrying `resourceIcon: ' x '` admits today and would stop admitting — a real migration risk on live data. **Out of scope, and deliberately not done.** Docketed as `CR-EST-ICONSYM` |

⚠ **ONE RESIDUAL IS RECORDED RATHER THAN SMOOTHED AWAY.** `boundedText`'s throw message is
shared across every field it guards and still reads *"must be bounded non-empty text"*. For
`needIcon` under `emptyOk` that message is now imprecise — a throw there means non-string,
untrimmed or over-length. The message is deliberately **not** changed, because it is one
shared string across a dozen fields and re-wording it for one caller would make it wrong for
the others. Recorded on the veto surface, not accepted silently.

## §7 · The change manifest (7 rows)

| # | Action | Path |
|---:|---|---|
| 1 | `MODIFY` | `src/domain/content/reviewedSupplyChainPersistence.js` — `boundedText` gains `emptyOk`; the `needIcon` site opts in |
| 2 | `MODIFY` | `src/domain/inferSupplyChains.js` — **comment only** (§60 Q5): correct the rationale that misdescribes the boundary |
| 3 | `MODIFY` | `tests/lib/accountContentPortability.test.js` — two banked rows un-bank; **+1** symmetry regression pin |
| 4 | `TEST` | `tests/store/customContentSlice.race.test.js` — the third banked row un-banks |
| 5 | `MODIFY` | `scripts/.test-ratchet-baseline.json` — **remove-only** re-freeze, 3 rows drop (15 → 12) |
| 6 | `MODIFY` | `tests/lint/testRatchet.test.js` — **the ruled `CR-EST-CONTROLZERO` conversion** (§0, §7.1) |
| 7 | `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` — the census re-recorded WHOLE |

### 7.1 The conversion, exactly

`ORDINARY_TEST_CONTROL` becomes empty **because its population is**, and the two tests that
sampled it convert in place — **the same two titles, so the lighting census does not move**:

1. **The eradication assertion.** The live ordinary-debt population — census rows in **neither**
   ledger — is asserted **EXACTLY EMPTY**, with a message naming the eradication and stating the
   arrival rule: *"any new ordinary red is triaged immediately, never banked."* Its second arm
   holds the roster empty, so refilling it is a visible act rather than a quiet one.
2. **Its anti-vacuity partner.** Zero-of-an-empty-set is not a win, so the second test proves the
   partition is REAL: the census is non-empty, **every** surviving row is ledgered, and both
   ledgers are non-empty. Without it the eradication arm would pass the day the baseline is
   deleted or the reader breaks.

⛔ **This is the lock-the-win door, not the "just census it" door.** The census sits at its
pinned ceiling and the admissible moves are lock-the-win / re-point / cure; this is the first.
The eradication is a **won position that may never be spent**: a later ordinary failure cannot
be banked against it, because the arm reds on arrival.

⛔ **No `CREATE` row** ⇒ the `validate:packets` LANDED-CREATE existence hazard cannot fire.
⭐ **§85.4 preflight: both registry-mint obligations have EMPTY subjects.** This member mints
no seeded chooser and no pool module — it widens one validator predicate, corrects one
comment, and adds one test. Stated affirmatively.

## §8 · The new regression pin — and why it is one `test`, not one file

Added to `tests/lib/accountContentPortability.test.js` (already CREDITED): the pin asserts
that a discovered chain carries `''` for **both** icons **and** that the admission succeeds.

⭐ **It pins the SYMMETRY, not the symptom.** Asserting only that the hash succeeds would pass
again the day someone re-tightens `needIcon` and loosens something else; asserting that both
icons are `''` **and** the chain admits is the assertion that fails if either side of the
asymmetry returns.

⚠ **Deliberately NOT a new test file.** A new file moves `files` and `credited` in the
lighting census and adds a census-integrity surface for a pin that belongs beside the guards
it protects. Adding it here costs **+1 title** and nothing else.

## §9 · ⛔ THE OWNER-GATE GRAZE — RULED, AND RECORDED ON THE VETO SURFACE

This member edits **what the persistence boundary admits**, which grazes the standing
owner-gated class *"schema/persistence shape"*. **Momentum is not authorization**, so it was
flagged at compile rather than assumed, and it is the reason this member is third.

**§60.1 RULED IT A REPAIR on four measured grounds**, and the grazing is noted on the veto
surface per the standing law. Every property that makes a shape change dangerous is measured
absent:

- **It narrows nothing.** Pure widening; every value that admits today still admits (§5.3).
- **No persisted record can move.** A record with `needIcon: ''` cannot exist — admission has
  always refused it. And for non-empty values the admitted chains are **byte-identical**.
- **The persisted shape is unchanged.** `CHAIN_KEYS` is untouched; the key stays required;
  only the value predicate widens.
- **No migration, no schema version, no golden.**
  `REVIEWED_SUPPLY_CHAIN_COMMAND_SCHEMA_VERSION` is not touched.

## §10 · §48 RE-SWEEP ON THIS CURE'S OWN PREMISES

| Premise | Re-swept how | Verdict |
|---|---|---|
| "the writer supplies `''`" | source read + **executed** — the real chain carries `needIcon: ""` | ✅ **HOLDS** |
| "nothing fills it in between" | `git grep needIcon` over `src/domain/content/`, `src/store/`, `src/components/`; `customSupplyChainReview.js` read in full | ✅ **HOLDS** |
| "needIcon is the only blocker" | **executed** — the cured admission returns `ok=true` | ✅ **HOLDS** (the premise a static reading would have got wrong) |
| "no hash can move" | **executed** — byte-identical chains for a non-empty icon | ✅ **HOLDS** |
| "fixing once clears all three rows" | shared root confirmed in both test files | ✅ **VERIFY-AT-BUILD by execution** |
| "the empty string is deliberate" | three independent sources: the writer's comment, the `copyCorruption` allowlist + literal pin, the renderer's truthiness guard | ✅ **HOLDS** |
| "no test pins the throw message" | `grep 'bounded non-empty text'` over `tests/` and `src/` | ✅ **HOLDS** — one hit, the throw site itself |
| "the subject files did not move since the compile" | `git diff fc8451c4 a6fd6395` over all five | ✅ **HOLDS** — byte-identical |

## §11 · Declared terminals (BY FIGURE), at the `est-1` terminal base `5c774940`

| Figure | at `5c774940` | at EST-C = **T** | Δ | Cause |
|---|---|---|---|---|
| Lighting census | `2431/364/2067/20148/5660` | **`2431/364/2067/20149/5660`** | titles **+1** | the symmetry pin in an already-CREDITED file. ⭐ The CONTROLZERO conversion moves NOTHING: `testRatchet.test.js` is CREDITED at **64 titles / 9 suites** and the conversion rewrites two tests in place without changing their count |
| Runtime tests | 28157 | **28158** | +1 | the same single case |
| Frozen known failures | 15 | **12** | **−3** | entries 7, 8, 16 repair; remove-only `--update`. ⭐ This completes the §60.4 trajectory `16 → 12` that `est-1` left at 15 |
| **Ordinary-debt population** | 3 | **0** | **−3** | ⭐⭐ the eradication — every surviving census row is a ledgered enforcement walker |
| `ORDINARY_TEST_CONTROL` | 2 names, floor 2 | **0 names, CONVERTED** | — | §7.1 — the ruled zero-assertion, never a lowered floor |
| `validate:packets` | 49 / 0 | 50 / 1 → **50 / 0** at flip | +1 | the one-member train's own promotion |
| `typecheck:ratchet` · `:domain:strict` | `173/173` · `1134/1134` | **VERIFY-AT-BUILD** | 0 expected | the only member touching `src/`; both ratchets sit at EXACT floors — any movement is a STOP |
| **OSR findings** | 1998 | ⚠ **VERIFY-AT-BUILD** | 0 expected | ⛔ this member edits a `typeof`/shape predicate in `src/domain/`. **A new finding is a STOP, never a `--write`** |
| Hot files · flags · kill list · `title=` · goldens | — | unchanged | 0 | none of the four hot files is named; zero flags minted; no component, no generation path |

⚠ **BEHAVIOUR SHIFT, DECLARED, NOT DISCOVERED.** Confirming a discovered supply chain stops
being refused and starts working. That is the deliverable. **No same-seed golden can move** —
the cure sits on an admission boundary reached only through the custom-content confirm
command, not on any generation path.

## §12 · ⛔ MANDATORY STOPS

1. **A new OSR finding** → STOP. Never `--write`; a detector change requires a schema mint.
2. **Either typecheck ratchet moves off `173/173` / `1134/1134`** → STOP.
3. **The cured admission still refuses** → STOP and report the *next* error verbatim.
4. **Any test outside the three banked rows changes status** → STOP. `--update` refuses to
   bank a regression by design and that refusal is correct.
5. **The re-freeze taken over the live shared tree** → STOP. Integrity-counted checkout of a
   **committed** sha with `TEST_RATCHET_SHA` set; prove DETACHED.
6. ⛔ **Any edit to `resourceIcon`'s check** → STOP. That is a narrowing (§6.1); it is
   `CR-EST-ICONSYM`.
7. **Any edit to `inferSupplyChains.js` beyond the comment** → STOP. The literal is pinned by
   `copyCorruption.test.js`.

## §13 · Acceptance cases

| id | case |
|---|---|
| A1 | `tests/lib/accountContentPortability.test.js` passes whole, **including the two formerly banked rows** |
| A2 | `tests/store/customContentSlice.race.test.js` passes whole, including the formerly banked delayed-response rewind guard |
| A3 | the new symmetry pin passes: both icons `''` **and** `admission.ok === true` |
| A4 | `tests/security/reviewedSupplyChainPersistence.pglite.test.js` still passes — the non-empty icon path is unaffected |
| A5 | `tests/lint/copyCorruption.test.js` still green — the pinned `needIcon: ''` literal is untouched |
| A6 | `npm run test:ratchet` prints `RATCHET DOWN` naming exactly entries 7, 8 and 16, and **exits 0** |
| A7 | after the detached `--update`: the baseline holds **12** entries, none naming `needIcon` |
| A8 | the CENSUS literal reads `2431/364/2067/20149/5660`, walker green in this same commit |

⚠ **A9 is the ruled conversion and rides the SAME commit as the re-freeze**, because the two
names go stale the instant the baseline drops to 12: `tests/lint/testRatchet.test.js` is green
with `ORDINARY_TEST_CONTROL` empty, the eradication arm asserting an empty ordinary population
against a **non-empty** census whose every row is ledgered, and its title count unmoved at 64.

## §14 · Checks

```
npx vitest run tests/lib/accountContentPortability.test.js
npx vitest run tests/store/customContentSlice.race.test.js
npx vitest run tests/security/reviewedSupplyChainPersistence.pglite.test.js
npx vitest run tests/lint/copyCorruption.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
```
