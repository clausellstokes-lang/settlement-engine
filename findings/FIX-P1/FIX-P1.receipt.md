# FIX-P1 — RECEIPT

**Commit `e0b03b63a`** on `fix-fork-salt-2026-09-20`, cut from **63e40fe57**.
8 files, +582/−25. `git show --stat HEAD` names exactly those 8; `git status --short`
empty after; the pre-commit hook rewrote nothing (`git diff HEAD --stat` empty).
Measurement taken before the first edit: `FIX-P1.evidence.md`.

## OUTCOME

Two anonymous visitors no longer fork the same world. The fork suffix is now WHO IS
FORKING: a per-visitor salt minted once and held (`src/lib/anonForkSalt.js`,
`sf.anon.fork-salt`), or the account id **whole**. The copy on /create and
/settlements is true as written and was not edited.

## THE CHARTER ADDITIONS (ODQ §934.47 addendum 59)

| # | Addition | Status |
|---|---|---|
| 2 | the `forkSeedFor` truncation (noticed 8) | ✅ **COVERED** — `.slice(0, 8)` is gone; `forkIdentity` returns the id whole. Red-first: `expected 'cnocby-033a-aaaaaaaa' not to be 'cnocby-033a-aaaaaaaa'` |
| 1 | a REPEAT FORK BY ONE IDENTITY is byte-identical (`s_c428e8848a3fd616` twice) | ⛔ **REFUSED — OWNER-GATED.** Not built. See below |

### ⛔ ADDITION 1 IS `docs/DESIGN_FP_ARCH_EP.md` §7a ROW 1 — the smallest measured contradiction

> **§7a row 1**, verbatim: "**A4/A5 — the sample-fork seed.** `src/data/sampleSettlements.js#forkSeedFor`
> is `` `${sample.config.seed}-${suffix}` ``, a pure function of (card, user), **so the same user
> forking the same card gets the same town forever**." · Owner-gated class: **PAID / FOUNDER SURFACE
> BEHAVIOUR** · Recommendation: "**LIVING DOOR** — the fork button mints fresh … The existing
> docstring's justification … is about different USERS, **never a second click**."

FIX-P2 re-measured a fact §7a row 1 already records as MEASURED and PARKED. Three
independent reasons this lane does not build it:

1. **It is owner-gated.** §7a's own preamble: *"A wave may not absorb an owner-gated
   class by calling it a repair."* My brief's STOP list names "anything owner-gated";
   the recommendation "LIVING DOOR" is a recommendation **awaiting the owner**, not a ruling.
2. **My own launch ruling ordered the opposite**, in terms: *"a visitor's own re-forks of
   a sample stay deterministic while two visitors differ."*
3. **THE PROMISE points the same way** — a seed is a STARTING world forever. A visitor who
   reloads and re-forks has not asked for a different place.

**Cost of the refusal: nothing.** `forkIdentity(userId)` is the single seam a per-click
nonce would enter through. If the owner rules LIVING DOOR, that is a change to one
function and its walker; nothing in this commit has to be undone.

**→ OWNER'S DECISION POINT (not deferred work):** *should a second fork of the same card
by the same identity draw a fresh world?* Answer (a) = today's behaviour stands, §7a row 1
CLOSED-as-declined; answer (b) = LIVING DOOR, which becomes a one-function slot on
`forkIdentity`. The decision also disposes of A11 and §7a's other rows by analogy.

## THE DESIGN CHANGE THE MEASUREMENT FORCED (judgment call, vetoable)

The ruling said put the salt inside `forkSeedFor`. **It cannot go there.** `src/data/**`
is pure data by a rule with TWO enforcers — `eslint.config.js` `no-restricted-imports`
banning `**/lib/**` for that directory, and `tests/domain/dataPurity.test.js` — expressly
so IO and ambient entropy cannot enter the tables. A salt is both.

So: `forkSeedFor` stays pure and only loses the truncation; `forkIdentity` lives in
`src/lib/anonForkSalt.js`; both doors call it. Because the rule now lives in two doors —
the exact shape that bit the sample-fork INTENT (ODQ §934.24(b)) — it earned a **source
walker**: every `forkSeedFor` call site in `src/` must resolve through `forkIdentity`,
read by balancing parentheses, with a guard-the-guard arm. `tests/domain/dataPurity.test.js`
is green, confirming the design respects the rule rather than dodging it.

## RECEIPTS (every line through the mutex, SHARED tier, `--maxWorkers=2`)

**RED FIRST** — planted pre-cure tree (truncation restored, both doors bare,
`forkIdentity` returning the old constant):

| Directory | Count line |
|---|---|
| `tests/data/sampleSettlements.test.js` | `Tests  3 failed \| 19 passed (22)` |
| `tests/lib/anonForkSalt.test.js` | `Tests  4 failed \| 10 passed (14)` |
| `tests/components/foundingWorlds.test.jsx` | `Tests  1 failed \| 1 passed (2)` |

Named reds: `uses the account id WHOLE…` · `carries the full id even when it is a whole
UUID` · `every CALL of forkSeedFor passes an identity resolved by forkIdentity`
(`expected [ …(2) ]` — **both** doors) · `TWO VISITORS forking one sample get different
seeds` · `two accounts sharing eight id characters no longer collide` ·
`expected 'mossgate-004-anon' not to be 'mossgate-004-anon'`.

**GREEN, cured:**

| Run | Count line |
|---|---|
| `tests/data/sampleSettlements.test.js` | `Tests  22 passed (22)` |
| `tests/lib` **WHOLE** (a file was CREATED there) | `Test Files 174 passed (174)` · `Tests 1791 passed (1791)` |
| `tests/components/foundingWorlds.test.jsx` | `Tests   2 passed (2)` |
| `tests/store/generateStrayConfigSeed.test.js` | `Tests   6 passed (6)` |
| `tests/domain/dataPurity.test.js` + `contentSamplePreview.test.js` | `Tests  15 passed (15)` |
| `tests/lint/` negativeAssertionAnchor + mutationCoverageManifest + sizeBaseline | `Tests  22 passed (22)` |
| `tests/copy/voiceMechanics.test.js` | `Tests  30 passed (30)` |
| `npx eslint` (all 8 touched files) | exit 0, no output |

**GOLDENS** — byte-identical before the first edit and after the last:
`7177cd6e…` / `921c51cf…`.

## LIGHTING CENSUS — MEASURED, NEVER REFROZEN

| Tree | files · parked · credited · titles · suiteTitles |
|---|---|
| Register shipped in base 63e40fe57 | 2650 · 383 · 2267 · 25028 · 6677 (measured out of tree at 32602dc60) |
| **BASE 63e40fe57, MEASURED** | **2651 · 383 · 2268 · 25034 · 6678** — walker ran GREEN at this tuple |
| **THIS COMMIT, MEASURED** | **2652 · 383 · 2269 · 25055 · 6682** |
| **MY DELTA** | **+1 · +0 · +1 · +21 · +4** |

⚠ **The census was ALREADY RED at my base, before my first edit** — the shipped register
was one file / one credited / six titles / one suite title behind its own tree. My delta
is stated against the **measured** base so the next refreeze can attribute the two
movements separately. Both rows close arithmetically (383+2268=2651; 383+2269=2652).
The register file is **untouched** in this commit.

## TWO REDS THE BATCHES CAUGHT IN MY OWN TESTS (both fixed before the commit)

1. The purity arm matched the bare word `localStorage` **in the docstring that explains
   why the salt is not read there** — a guard a file trips by describing itself
   accurately, which teaches the next author to delete the explanation. Now scanned over
   comment-stripped CODE, with the prose asserted still present.
2. `negativeAssertionAnchor` caught two un-anchored `not.toMatch` at lines 355/356. Given
   a real liveness anchor (`code` must still carry `forkSeedFor`) plus one-line
   `// anchored:` markers.

## REGISTERS THAT MOVE WHEN THIS IS COMPOSED (deltas, for the chair)

- **Lighting census**: `+1 · +0 · +1 · +21 · +4` (above).
- **mutation-coverage manifest**: **no movement.** `tests/data/sampleSettlements.test.js`
  already carries `{"kind":"uncovered"}`; `tests/lib/anonForkSalt.test.js` is not
  enumerated (`tests/lib` is not an enforcer dir, basename matches no NAME_PATTERN word).
  `uncoveredBaseline` stays **186**. Verified green.
- **sizeBaseline**: **no movement.** Effective lines `SettlementsPanel.jsx` 577→578
  (ceiling 600), `FoundingWorlds.jsx` 83→84, `main.jsx` and `sampleSettlements.js`
  unchanged, new `anonForkSalt.js` 34. Verified green.
- **voice-mechanics baselines**: no movement. Verified green.
- **New device-local storage key** `sf.anon.fork-salt` — non-schema, no registry, sibling
  of `sf.anon.gens` / `sf_view_token`. Not a save-record key, not the DB.

## NOTICED AND NOT TOUCHED — each specific enough to slot

1. **⛔ OWNER'S DECISION POINT — §7a row 1 / the repeat fork.** Above. One function
   (`forkIdentity`) + its walker if ruled LIVING DOOR.
2. **REVIEW-P noticed 2 is a MEASUREMENT ARTIFACT, and should be struck from the
   findings.** `B_newDraft: null` in `walk3.mjs:97-108` is written only when the button
   is **not visible** (`if (await nd.isVisible()…)`), so it never measured the strip. The
   toolbar carrying New Draft mounts on `settlement && showOutput && !pipelineRevealActive`
   (`GenerateWizard.jsx:529`), and the driver looked at ~3.3 s (`waitForFunction(settlement)`
   + `waitForTimeout(2500)`) while REVIEW-P's own F5 measured the dossier readable at
   **7700 ms**. The return path is sound by reading: `handleNewSettlement` →
   `requestExit('new')` → `doExit('new')` (`:251-258`) clears the settlement and nulls
   `wizardMode`, and `:337`'s branch re-renders `<FoundingWorlds>` at `:369`.
   **Slot:** re-walk with a wait on the dossier, not on the store; or CLOSE as measured.
   Not cured here — a full `GenerateWizard` jsdom harness is not a small cure.
3. **The census register in 63e40fe57 is stale against its own tree** (item above). Not
   mine to refreeze. **Slot:** the train's terminal refreeze must account for TWO
   movements, the pre-existing +1/+1/+6/+1 and my +1/+0/+1/+21/+4.
4. **`tests/data/sampleSettlements.test.js` is manifest `{"kind":"uncovered"}`** while now
   carrying the fork-identity law and its walker — a real invariant in a file the mutation
   register counts as a known gap. **Slot:** plant a sweep mutation for the walker arm and
   lower `uncoveredBaseline` 186 → 185.
5. **`forkSeedFor`'s `'anon'` fallback still exists** as the value a door that forgot
   `forkIdentity` would produce. Kept total on purpose (a null seed would fail a fork
   silently at the generate call) and guarded by the walker rather than by the type.
   **Slot:** if the estate ever adopts a fail-closed seed contract, this is a call site.
6. **REVIEW-P F2's realm-collision arm is untouched and still live** — `regionalGraph.js:302`,
   `resourceSites.js:142`, `mapDress.js:101,167` key on `settlement.id`. This cure makes
   anonymous collisions vanish, but two saves grown from ONE seed in one campaign still
   share a node key. **Slot:** FIX-P2 or its own lane; needs an account to walk.
7. **A published fork seed is not a leak** (checked while ruling on the whole id):
   `gallery.js:119-130` `stripImportConfidential` deletes `seed`/`_seed`/`_config`/
   `config._seed` under the contract "never the generation seed", pinned by
   `tests/security/gallerySeedLeak.pglite.test.js`. **CLOSED with reason** — no action.
8. **A signed-in fork seed is now ~48 characters** (`cnocby-033a-<uuid>`) where it was 20.
   No length constant governs it (only `SEED_MAX = 200` in `errorReporter.js`, a defensive
   truncation for error payloads). §7a row 1 calls the sample's own seed "the address …
   typeable in the `SeedField`"; a fork's seed is longer now. **Slot:** if the address
   must stay typeable, hash the identity to a short digest instead — I did NOT do this
   because the ruling said "the FULL user id" in terms, and a hash is a different
   derivation the chair should choose deliberately.

---

# FIX-P1b — RECEIPT

**Commit `92e959285`** on `fix-fork-salt-2026-09-20` (on top of `e0b03b63a`).
5 files, +227/−20. `git show --stat HEAD` names exactly those 5; `git status --short`
empty; no hook rewrite; goldens byte-identical (`7177cd6e…` / `921c51cf…`); the
lighting register is untouched.

## OUTCOME

A signed-in fork's suffix is a **48-bit digest of the whole account id**:
`cnocby-033a-7c9e6679-7425-40de-944b-e07fc1f90ae7` (48 ch) →
`cnocby-033a-0905f09332e2` (24 ch). Anonymous is untouched (the per-visitor salt).
Determinism per (card, user) unchanged.

**The hash is the estate's own**: `kernel/proseHash.js#fnv1a32`, the declared
short-hash idiom, also chosen because it is SYNCHRONOUS — both doors resolve the
identity inline and `crypto.subtle.digest` is a Promise.

## ⛔ THE RULED ONE-CONSTANT FLIP WOULD HAVE BEEN COSMETIC

Flipping `ACCOUNT_DIGEST_HEX` 8 → 12 alone yields `00000905f093`: twelve characters
carrying **thirty-two bits**, because `fnv1a32` maxes at `ffffffff`. The collision
rate would have been unchanged at ~77,000 accounts while the suffix looked wider —
the "PARTIAL is the status that hides" class exactly.

The obvious repair also fails: `fnv1a32(id + domain)` is length extension. MEASURED
— `acct-d36f` and `acct-bb799` both hash to 3192671852 **and** both still hash to
2748183937 with the domain appended; over 400,000 UUIDv4 ids the appended variant
collided **22 times at eight characters and 22 at twelve**.

**PREPENDING** the domain decorrelates the rounds. Same pair diverges; over 400,000
UUIDv4 ids: **27 collisions at 8 hex** (birthday expectation ~18.6) and **0 at 12**.

Pinned by a walker that proves its own premise (`carries real entropy past the
eighth character, not filler` executes `fnv1a32` on the pair rather than trusting a
comment) plus `spends every character of the suffix`, which reds on `0000` filler.

## ⛔ A RAW NUL MADE GIT TREAT THE MODULE AS BINARY

The separator was first written as a literal escape and landed as a raw NUL byte;
`git diff --numstat` reported `-  -` for `src/lib/anonForkSalt.js`, so every future
review would have read "binary file differs". Now built with
`String.fromCharCode(0)`; numstat reads `95  6`. **Caught by reading the staged
diff, not by any gate** — no instrument in the estate looks for this.

## RECEIPTS

RED FIRST (plant = the FIX-P1 state, `forkIdentity` returning the id whole):
`tests/lib/anonForkSalt.test.js` — `Tests  6 failed | 14 passed (20)`; named reds
include `expected 'acct-d36' to be 'acct-bb7'`, `expected 'account-1' to have a
length of 12 but got 9`, `expected … to have a length of 24 but got 48`, and
`expected 49 to be less than or equal to 25`.

GREEN, cured:

| Run | Count line |
|---|---|
| `tests/lib` **WHOLE** | `Test Files 174 passed (174)` · `Tests 1797 passed (1797)` |
| `tests/data/sampleSettlements.test.js` | `Tests  22 passed (22)` |
| `tests/components/foundingWorlds.test.jsx` | `Tests   2 passed (2)` |
| `tests/store/generateStrayConfigSeed.test.js` | `Tests   6 passed (6)` |
| `tests/domain/dataPurity.test.js` + `contentSamplePreview.test.js` | `Tests  15 passed (15)` |
| `tests/lint/` anchor + manifest + sizeBaseline | `Tests  22 passed (22)` |
| `tests/copy/voiceMechanics.test.js` | `Tests  30 passed (30)` |
| `npx eslint` (5 files, bare) | exit 0, no output |

## LIGHTING CENSUS — run ONCE, never refrozen

The walker asserts five figures in order and **stopped at the first miss**, so this
run **evaluated one figure**:

- **MEASURED, this tree: `files = 2652`** (register in my base tree: 2650).
- MEASURED earlier this lane, base 63e40fe57: `2651·383·2268·25034·6678` (proved
  green at that tuple).
- **My file delta: +1**, all of it FIX-P1's new test file. FIX-P1b adds no file.

DERIVED, not evaluated by this run (counted from source, labelled as derived):
FIX-P1b adds 6 live titles and 1 suite title (`anonForkSalt.test.js` 3→4 describes,
14→20 its); `sampleSettlements.test.js` counts unchanged, two titles reworded.
Cumulative against the measured base: **files +1 · parked +0 · credited +1 ·
titles +27 · suiteTitles +5**.

⚠ My base predates **two refreezes** (register at c33446830 reads
`2656·383·2273·25074·6684`), so the next refreeze attributes THREE movements: the
drift already red at my base, the two refreezes, and mine.

## NOTICED AND NOT TOUCHED — added by FIX-P1b

9. **No instrument catches a raw NUL / binary-classified source file.** Mine was
   caught by eye. A one-line walker over `src/**` + `tests/**` asserting
   `git diff --numstat` never reports `-` for a tracked text file, or simply that no
   source file contains a NUL byte, would close the class. **Slot:** TOOL-lane, next
   instrument pass.
10. **`SeedField` has no `maxLength`.** The address pin is anchored on the module's
    declared width because the field declares nothing. **Slot:** a product-surface
    decision — give the field a real limit (then the pin should read it), or record
    that the address length is governed by the derivation alone.
11. **`ANON_SALT_HEX` and `ACCOUNT_DIGEST_HEX` are both 12 but reached differently**
    — the salt is 12 hex of a random UUID (48 bits of true randomness), the account
    is 12 hex of a 64-bit two-round digest. Equal width, equal collision space,
    different provenance. Recorded so nobody later "simplifies" them into one
    constant with one derivation. **CLOSED with reason** — no action wanted.
