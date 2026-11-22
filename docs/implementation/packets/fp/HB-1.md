# HB / HB-1 — THE ACTION VOCABULARIES, THE BRANCHER REGISTER, AND THE FORK REGISTRY
### (re-chartered after the §38 refutation; train `hb-1p`, single member M1)

**Preamble:** `docs/implementation/preambles/HB-PREAMBLE.md` at SHA-256
`2cf2407d93cef46ce647a88e235e2a9a84f68c310f9f4ccd7b01d14c9f9eb215` (**already signed and landed**).

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `f6749fad642e191b8214797102b6404373bd02ee`
  (`git status --porcelain` → 0 lines, executed at compile and re-verified at open).
- **Landed:** `1013d58baefeadc10a5da38b350a7fa86e2a1c63`, the single member of the `hb-1p` train.
  Chain: promotion `dfd7b0ae` → this implementation commit → the terminal. §12 carries the
  executed landing evidence.
- **Capsule:** `docs/implementation/BASE_STATE.json` @ `e205fb52`, citable — the window to this base
  is **one docs path** (`git diff --name-only e205fb52 f6749fad`), no measured path moved.
- **Ruled:** `OQ` **§38.3** (this re-charter, carrying TE6's three finds), **§38.4** (the
  delete-clause law), and §36's four still-binding signatures — **CR-HB1-R21** (the corrected
  `martialMoves` act: a NAMED DERIVED SUBSET, never a retirement), **CR-HB1-R24** (net-zero at 812),
  **CR-HB1-W** (one walker file carries the three J-HB-23 assertions), **CR-HB1-C1** (HABIT mints the
  shared move vocabulary; the two-export leaf; this wave's at-most-one-exporter scan discharges
  WC-0's structural half). New asks: **CR-HB1′-R7 / REG / F2 / HB0FIX / DORM** (train plan §12).
- **Builds at:** the train's I1 commit. ⛔ **There is no truncation boundary inside this member.**
- **Collision group:** ⚠ **the war lane** — `settlementStrategy.js` + `settlementPolitics.js`.
  **CHECK-GIT-FIRST IS MANDATORY immediately before I1.**
- **Census holder:** this packet takes the estate lighting-census reservation. I1 is the last commit
  that moves a `tests/` byte, which is what leaves T docs-only and lets the capsule generate in ONE
  terminal commit.
- **Flag:** **NONE.** **Persisted shape:** **NONE.** **Coupling row (`CPL-`):** **NONE.**
- **Commit authority:** the `hb-1p` train's private ref only.

---

## 1. Scope and boundary

> **Boundary sentence.** HB-1′ mints the estate's single closed strategy-move vocabulary, the frozen
> **brancher REGISTER** that replaces the refuted deletion, and the habit fork registry, and lands
> the two totality walkers that make all three frozen. **It also discharges HB-0's orphan window by
> re-aiming one existing dormancy case in the same commit that creates the import.** **It does NOT**
> mint a flag, read `worldState`, add a habit load anywhere, change any move's score, move a
> persisted shape, **delete or change one line of executable code in `settlementPolitics.js`**, or
> edit `convergence.js` / `scoringObjective.js` / `mobilizationReactions.js`.

**No row says LEARN in this wave.** Every fork row the volume disposes toward learning lands DEFER
with a written `closeOwed`. The volume's PERMANENT rulings are preserved as they stand: a row it
rules STAY-DETERMINISTIC lands STAY, because recording a permanent ruling as a deferral would be a
false record rather than caution (**J-TE6-2**, ratified at §38.5).

## 2. ⛔⛔ THE BEHAVIOUR/IDENTITY CONTRACT — AND THE CLAUSE THIS PACKET REFUSES

**IDENTITY: byte-identical same-seed goldens, and the proof is now a STRUCTURAL one rather than an
argument.** `settlementPolitics.js`'s executable text does not change. There is nothing to argue.

### 2.1 THE REFUSAL, WITH ITS EXECUTED EVIDENCE

⛔⛔ **THE VOLUME'S CORRECTED R7 RULING — *"delete the `move === 'fortify' ||` DISJUNCT ALONE"* — IS
REFUTED, AND THIS PACKET REFUSES IT.** The volume already retracted the compile's *first* ruling
("delete the whole arm") on measurement. **Its replacement dies the same way, and to the instrument
the volume itself nominated as the check.**

**THE MEASUREMENT, executed at this base against the REAL module (no fixture mirror, no tree edit):**

```
DARK_GOLDEN.moves as measured LIVE at f6749fad:
  deploy         1.052
  sue_for_peace  0.99
  fortify        1.02        ← the golden row at espionageAbsenceDormancy.test.js:305
  defend         1.02
FALL-THROUGH TOKENS (no arm matches) — the value a deleted disjunct would give:
  zzz_not_a_move 1
GOLDEN ROW :305 expects fortify = 1.02   MEASURED = 1.02
DISJUNCT-DELETED value would be           = 1
ARM IS LOAD-BEARING FOR fortify: true
```

**THE PREMISE THAT DIED, named exactly.** R7's corrected proof reads *"for every move
`enumerateMoves` emits, the disjunction's truth value is unchanged by removing a disjunct that no
emitted move satisfies."* **Half one is TRUE** — `'fortify'` is not an emitted move. **Half two is
FALSE**, because *the deciding site's inputs are not limited to emitted moves*:
`tests/property/espionageAbsenceDormancy.test.js:51` declares
`const LOAD_BEARING_MOVES = ['deploy', 'sue_for_peace', 'fortify', 'defend']` and calls
`blocDecisionFactor` with each token **directly**. Two RATIFIED same-seed goldens record the result:

- `:305` `moves: [['deploy', 1.052], ['sue_for_peace', 0.99], ['fortify', 1.02], ['defend', 1.02]]`
- `:325` `moves: [['deploy', 1.0436], ['sue_for_peace', 0.9916], ['fortify', 1.0168], ['defend', 1.0168]]`

⛔ **RE-RECORDING EITHER IS FORBIDDEN OUTRIGHT** by that file's own header (*"a later lane that finds
it red has found a SECOND shift … NEVER a re-record"*) and by `PACKET_STANDARD.md`. **The only
lawful act is to keep the arm.**

### 2.1a ⭐ THE CONSUMER CENSUS THAT MAKES THE REGISTER'S FOREIGN SET PROVABLY COMPLETE

**EXECUTED, tree-wide, over `src` and `tests`** — every caller of `blocDecisionFactor`:

| Caller | Tokens it passes | Non-emitted? |
|---|---|---|
| `src/domain/worldPulse/settlementStrategy.js:1223` — the ONE production caller, `factorFor: (move) => blocDecisionFactor(…)` | only what `enumerateMoves` emits | no |
| `tests/domain/settlementPoliticsPins.test.js` (×4 call sites) | `'deploy'` only | no |
| ⭐⭐ `tests/property/espionageAbsenceDormancy.test.js:131` — `LOAD_BEARING_MOVES.map(move => blocDecisionFactor(…))` | `deploy`, `sue_for_peace`, **`fortify`**, `defend` | ⛔ **YES** |

**There is EXACTLY ONE consumer in the estate that passes a non-emitted token, and it is the
ratified golden.** That is why the register's declared foreign set is **one token in one module**,
and why the exactness of the set equality is affordable: the denominator is measured, not guessed.

### 2.2 THE CONTRACT, IN ONE TABLE

| Claim | How it is proved | Status |
|---|---|---|
| The two ratified goldens are **byte-identical** | `settlementPolitics.js`'s executable text is **unchanged**; the only edit is a JSDoc block. Measured: **560 → 560** effective under the ENFORCER, and every non-comment line byte-identical | ⭐ **STRUCTURAL** |
| `settlementStrategy.js` output is unchanged | `MARTIAL_HISTORY_MOVES` reproduces the pre-wave 8-member set **exactly**, asserted by name (A4) | pinned |
| Every other same-seed world is unchanged | the two new leaves have **zero `src` importers** except each other's family; the registry is read only by walkers | pinned (A6) |

## 3. ⚠⚠ THE CHARTER CORRECTIONS THIS PACKET CARRIES

### 3.1 R7 — THE DELETE CLAUSE IS STRUCK, AND THE REGISTER REPLACES IT (CR-HB1′-R7)

**THE CURE IS THE REGISTER, NOT THE DISJOINTNESS — and §38.3 already named it.** The compile
reasoned that minting the eleven makes cross-vocabulary collision *"impossible because the two
vocabularies no longer share a member."* **MEASURED, and FALSE in general:** ten `src` modules
compare a move literal today and **six spell a word belonging to a DIFFERENT closed vocabulary** —
an engagement posture, a ladder posture (×2), a generosity act (×2), a competition axis.

**Deleting the token was the wrong lever twice over:** it does not close the class (six other
sharers remain), and it kills a live consumer. **The register closes the class *and* protects the
consumer, in one instrument.**

### 3.2 R21 — the corrected `martialMoves` act (signed at §36, **and now also §38.4-compliant**)

The local 8-member Set becomes a **NAMED DERIVED SUBSET** exported from the new leaf, its three
exclusions pinned BY NAME:

```js
export const NON_MARTIAL_HISTORY_MOVES = Object.freeze(['embargo', 'legitimacy', 'reroute']);
export const MARTIAL_HISTORY_MOVES = Object.freeze(
  STRATEGY_MOVES.filter((move) => !NON_MARTIAL_HISTORY_MOVES.includes(move)),
);
```

⭐ **§38.4's DELETE-CLAUSE LAW, DISCHARGED BY EXECUTED CENSUS.** The one retirement this packet
carries is the local `martialMoves` declaration. **MEASURED across `src`, `tests`, `scripts` and
`docs`:** exactly **two** code references exist, **both inside `settlementStrategy.js`** — the
declaration at `:801` and its single consumer at `:804`. **Zero consumers anywhere else.** The
remaining hits are prose in the volume and the preamble. **The target is dead outside its own
module, proved rather than assumed, and its membership is reproduced exactly by A4.**

### 3.3 R24 — HB-1′ BUYS NO HEADROOM (signed at §36)

**MEASURED BOTH WAYS at this base**, with the ENFORCER (eslint `Linter`, `max-lines`
`skipBlankLines`+`skipComments`), never `wc -l`:

```
  812  src/domain/worldPulse/settlementStrategy.js                 (baseline row: 812)
  812  src/domain/worldPulse/settlementStrategy.js  WITH THE SWAP   DELTA = 0
  560  src/domain/worldPulse/settlementPolitics.js                  (ceiling 800)
  560  src/domain/worldPulse/settlementPolitics.js  + JSDoc block    DELTA = 0
       raw lines 1066 -> 1073 (+7 COMMENT lines); EXECUTABLE TEXT IDENTICAL: true
```

⚠ **THE SHAPE THAT KEEPS IT AT ZERO IS AN INSTRUCTION, NOT AN IMPLEMENTER'S CHOICE.** One import
line replaces one declaration line and the consumer becomes an `includes` test over the exported
**ARRAY**. Re-wrapping the import in `new Set(...)` at the call site keeps a declaration line AND
adds an import line — a measured **+1** on a tolerance-ZERO ratchet, which is a hard STOP.

⚠⚠ **HB-5 INHERITS NO BOUGHT HEADROOM.** Stated here rather than discovered there.

### 3.4 CR-HB1-W — one walker file (signed at §36)

`tests/lint/chooserTotality.walker.test.js` carries all three J-HB-23 assertions. §4's charter is
the DISPATCH charter and outranks §3c's prose.

## 4. ⚠⚠ CROSS-VOLUME COLLISION C1 (signed at §36 as CR-HB1-C1) — RE-MEASURED, NOT INHERITED

`DESIGN_FP_ARCH_WC.md` §4.1.1: *"exactly ONE module exports the closed move vocabulary, whichever
volume BUILDS ITS STRATEGY WAVE FIRST mints it as a dependency-free leaf … the second volume AMENDS
the same leaf and does not mint."* **Re-measured at `f6749fad`:** WC-0 has not landed
(`lawBandModulation.js`, `contributionMoves.js`, `contributionDispatch.js`,
`strategyMoveVocabulary.js` all ABSENT), no single-exporter fence exists in `tests/lint/`, and
`strategyMoves.js` has **zero `src` importers** today. **HB builds first, so HABIT MINTS.**

Three obligations, all carried: **(1)** the leaf is **DEPENDENCY-FREE** — zero imports, pinned
(A5); **(2)** it exports **`STRATEGY_MOVES`** (the emitted totality, pinned against the emitter) AND
**`ALL_MOVE_TOKENS`** (the union every fence keys on), asserted equal **today**, so a later volume's
dispatched-but-unemitted moves join the union without redding the emitter pin; **(3)** this wave
ships **WC-0's at-most-one-exporter scan** itself. ⚠ The inbound half remains owed by WC's fold.

## 5. The exact manifest, with budgets

| # | Action | Path | Budget (effective lines, ENFORCER) |
|---|---|---|---|
| 1 | CREATE | `src/domain/worldPulse/strategyMoves.js` | **≤ 120** (measured shape: 22; ceiling 800) |
| 2 | CREATE | `src/domain/worldPulse/habitForkRegistry.js` | **≤ 600** (measured shape: **239**; STOP at 800) |
| 3 | MODIFY | `src/domain/worldPulse/settlementStrategy.js` | **NET ZERO**, 812 → 812 (R24) |
| 4 | MODIFY | `src/domain/worldPulse/settlementPolitics.js` | **NET ZERO**, 560 → 560 — ⛔ **COMMENT-ONLY** |
| 5 | CREATE | `tests/domain/strategyMoves.test.js` | 8 `test` + 1 `describe` |
| 6 | CREATE | `tests/domain/habitForkRegistry.test.js` | 7 `test` + 1 `describe` |
| 7 | CREATE | `tests/lint/chooserTotality.walker.test.js` | 8 `test` + 1 `describe` |
| 8 | CREATE | `tests/lint/strategyMoveVocabulary.walker.test.js` | 8 `test` + 1 `describe` |
| 9 | **TEST** | `tests/domain/habitCurve.test.js` | ⭐ the dormancy case re-aimed **IN PLACE**; **±0 titles** |
| 10 | REGISTER | `tests/lint/couplingInclusion.walker.test.js` | +2 rows, ceiling **15 → 17** |
| 11 | REGISTER | `tests/lint/sovereigntyLightingContract.walker.test.js` | the WHOLE census re-derived here |
| 12 | REGISTER | `scripts/mutation-coverage-manifest.json` | +2 entries, `kind: 'rationale'` |

⛔ **NO OTHER PATH.** In particular: **no** `scripts/.size-baseline.json` (R24), **no**
`scoringObjective.js` (C1 obligation 1 — its lever keys are pinned ⊆ `STRATEGY_MOVES` **from the
test side**), **no** `convergence.js` (**hot**), **no** `mobilizationReactions.js`, **no**
`scripts/mutation-sweep.sh` (a `kind: 'mutation'` entry is a two-file edit this wave has not
declared; `kind: 'uncovered'` is shrink-only and was never available), **no** flag manifest, **no**
coupling registry, **no** `pulseKernel.js` / `applyWorldPulse.js` (L1), and ⛔ **no foreign
dormancy-fence test file** (§7.3).

### 5.1 THE REGISTRATION TEMPLATE AT FULL STRENGTH (OQ §35.3)

| Part | Address |
|---|---|
| **THE ROWS** | `ARGUED_UNLAYERED['src/domain/worldPulse/strategyMoves.js']` and `ARGUED_UNLAYERED['src/domain/worldPulse/habitForkRegistry.js']`, each `{ kind: 'substrate', reason: <over 20 chars>, reads: Object.freeze([]) }` |
| **THE HEAD RE-EXPORT** | **NONE, and the absence is the argument.** ⚠ For `strategyMoves.js` it is **doubly load-bearing**: C1 requires a dependency-free leaf, and a head re-export is how a dependency arrives by the back door |
| **THE EXACT-LIST PIN** | `ARGUED_ROSTER_CEILING`, **15 → 17**, in the SAME commit — `toBe()`, exact both directions |
| **THE REGISTRY TEST PATH** | `tests/lint/couplingInclusion.walker.test.js` |
| **THE LIVE VALUE, RE-READ** | ⛔ **MEASURED AT THIS BASE:** `const ARGUED_ROSTER_CEILING = 15;` at line **509**, **15** live rows, HB-0's two rows present at `:455` and `:463`. **A blind 13 → 15 patch reds the exact-equality arm** |

**`reads: []` IS THE MEASURED ANSWER FOR BOTH LEAVES**, re-measured rather than copied:
`strategyMoves.js` has zero imports (C1); `habitForkRegistry.js` imports only `habitVocabulary.js`,
which HB-0 made `ARGUED_UNLAYERED` and therefore absent from the layer map. ⚠ **This differs from
HB-0's `habitVocabulary.js` row, which carries a NON-empty `reads` and a `readsReason`** — the rows
are not interchangeable.

### 5.2 ⭐⭐ THE REGISTER — THE §38.3 CURE, DEFINED

The volume asks for *"a walker that reds any module branching on a strategy-move token outside the
frozen export."* **Read literally, that predicate reds the tree on day one** — and this time the
measurement says so with a figure the refuted draft did not have:

```
=== MOVE-KEYED LITERALS INSIDE EACH `strategy`-KIND OWNER, LIVE at f6749fad ===
  settlementStrategy.js   literals (11): credit … sue_for_peace     FOREIGN (0): none
  settlementPolitics.js   literals  (4): defend, deploy, fortify, sue_for_peace
                                                                     FOREIGN (1): fortify
  momentum.js             literals  (0): —                           FOREIGN (0): none
  warIntent.js            literals  (1): deploy                      FOREIGN (0): none
⇒ the REFUTED membership-only arm REDS ON DAY ONE with the disjunct alive (1 stray).
```

**THE DEFINED PREDICATE — THREE ARMS, and the third is new:**

1. **THE BRANCHER REGISTER.** A frozen `MOVE_TOKEN_BRANCHERS` names every module comparing a member
   of `ALL_MOVE_TOKENS` as a literal, each row carrying its `kind` (`strategy` |
   `foreign-vocabulary`) and a written reason naming the foreign vocabulary where that applies.
   **Exact set equality against the live scan, BOTH directions** — measured denominator **TEN**.
2. **THE OWNER ARM, RE-SHAPED: membership OR REGISTERED-FOREIGN.** Inside a `strategy`-kind module,
   every move-keyed literal must be a **MEMBER** of `ALL_MOVE_TOKENS` **or** appear in that row's
   declared `foreignTokens`. ⭐⭐ **AND THE DECLARED FOREIGN SET IS ASSERTED EQUAL TO THE MEASURED
   FOREIGN SET, EXACT IN BOTH DIRECTIONS.** That second direction is the whole cure:

   ```js
   'src/domain/worldPulse/settlementPolitics.js': Object.freeze({
     kind: 'strategy',
     reason: 'the ruling-bloc decision load takes the move key as an argument and loads it toward the governing coalition\'s end',
     foreignTokens: Object.freeze({
       fortify: Object.freeze({
         vocabulary: 'MOBILIZATION (src/domain/worldPulse/mobilizationReactions.js)',
         evidence: 'tests/property/espionageAbsenceDormancy.test.js',
         evidenceSymbol: 'LOAD_BEARING_MOVES',
         reason: 'a LIVE ratified consumer passes this NON-EMITTED token straight in; two same-seed goldens record its value (1.02 dark / 1.0168 lit) and re-recording either is forbidden. ⛔ THE DISJUNCT IS NOT DEAD — its deletion was refuted at OQ §38.',
       }),
     }),
   }),
   ```

   - **Add an undeclared foreign token** (`move === 'raid'`) ⇒ the *unregistered* half reds.
   - ⭐⭐ **DELETE `move === 'fortify' ||`** ⇒ the *declared-but-absent* half reds. **This is the arm
     that would have caught the refutation before it was ever committed**, and no arm in the refuted
     design could see it, because a membership scan is structurally blind to a word the vocabulary
     does not contain.
3. **THE EVIDENCE ARM.** Every `foreignTokens` entry's `evidence` path must **exist** and its named
   `evidenceSymbol` must **spell the token**. Verified at this base:
   `LOAD_BEARING_MOVES = ['deploy', 'sue_for_peace', 'fortify', 'defend']`, and the file records
   `['fortify', 1.02]` and `['fortify', 1.0168]`. **A lane that removes the token from
   `LOAD_BEARING_MOVES` must come here first**, which turns tribal knowledge into a machine-checked
   edge.

⚠ **THE `settlementPolitics.js` JSDoc IS CORRECTED IN THE SAME EDIT**, and this is the ONLY edit
that file receives. The parameter line still calls `'fortify'` *"the strategy move key"*, which is
false and is how R7 happened twice. It is respelled to name the token as the registered foreign
member, cite the register, and carry the ⛔ that its disjunct's deletion is refuted. **Measured:
+7 comment lines, 0 effective lines, executable text byte-identical.**

⚠ **A DECLARED VACUITY, recorded rather than hidden:** `momentum.js` is a registered `strategy`
brancher with **ZERO** arm-2 subjects — it compares tokens through a differently-named identifier.
Its owner-arm contribution is vacuous today and the walker says so in-source, so a future reader
cannot mistake an empty arm for a proved one.

⚠ **THE MOVE-KEYED DETECTOR'S SHAPE IS LOAD-BEARING AND WAS FOUND BY EXECUTION** (TE6's third
regex): `[A-Za-z_$][\w$]*[Mm]ove[\w$]*` requires a character BEFORE the word and therefore misses
the bare identifier `move` — the exact spelling the owner site uses; the arm measured **ZERO**
subjects and would have passed forever. The alternation
`\b(?:move[\w$]*|[A-Za-z_$][\w$]*Move[\w$]*)` is kept, and the capitalised half stays separate so
`remove` cannot masquerade as a move-named binding.

### 5.3 ⭐⭐ THE FORK-REGISTRY IMPORTER-SCAN CLASS — SITED, NOT RE-POINTED (§38.3, CR-HB1′-F2)

**THE CLASS:** a registry storing module paths as quoted text joins the result of any raw-source
scan keyed on `/<name>\.js['"]/`, so it reads as an **importer** of every module it merely **names**.

**MEASURED — a census over every regex literal in all 2,060 test files, run against both sitings:**

| Siting | Matching regexes | The one that matters |
|---|---|---|
| **A** — `module: 'src/…/espionageDoctrineStage.js'` | **28** | ⛔ `tests/domain/espionageDoctrineStage.test.js:498` walks `src` and asserts `importers` **`toEqual(['…/espionageRider.js'])`**. The registry joins that list. **RED.** |
| **B** — extensionless ids | **26** | ✅ **the doctrine-stage pin is gone.** Twenty survivors are `staticSpecs()` over `dist/assets` chunk code; five apply their regex to an AI **prompt string**; the last is `habitCurve.test.js:226` matching the registry's **own real import** — a TRUE importer, and §6's subject |

**THE DISPOSITION — "site it", with the reason:**

- **`habitForkRegistry.js` takes EXTENSIONLESS module ids.** It must live in `src` (the volume
  charters it there and later HB waves read its dispositions), so the class is removed at the
  *registry's* end rather than at 26 foreign scans' ends. One normalization point in the walker
  appends `.js`; an **existence check** proves every id resolves; an **invariant arm** asserts no
  row's id ends in `.js`. ⭐ **Measured cost: 239 → 239 effective lines across all 32 rows — ZERO.**
- **`MOVE_TOKEN_BRANCHERS` lives in `tests/lint/strategyMoveVocabulary.walker.test.js`, not in
  `src`.** It is a frozen claim about source shape with no runtime consumer, which is where the
  estate already keeps such things (`ARGUED_UNLAYERED` in its walker; the prose-numerics baseline in
  `scripts/`). **`tests/` is outside every `src`-rooted scan by construction.**
- ⛔ **NO FOREIGN SCAN IS RE-POINTED IN THIS MANIFEST.** The estate has already solved this class
  **twice, in the honest direction**: `espionageGauntletDormancyFence.test.js:362` anchors on an
  **import shape** with the reason written in-source (*"AN IMPORT, NOT A MENTION … the coupling
  registry names it in a `read:` address; both are RECORDS OF the coupling rather than uses of
  it"*), and `secondOrderBeliefDormancyFence.test.js:195` does the same. **The doctrine-stage scan
  is the outlier.** Re-pointing it here would put a foreign wave's test file in this manifest, mint
  a foreign-file mutant obligation and expose that wave's anchor and census surfaces to a wave that
  has nothing to do with it. **DEFERRED to the queued `codeOnly()` micro-act family, where §38.3
  already files the class — documented, not a bug to re-find.**

### 5.4 THE FOURTH DOMAIN DIRECTORY (§38.3, TE6 FINDING 1)

`SCAN_ROOTS` names **FOUR** — `src/domain/worldPulse`, `src/domain/spatial`,
`src/domain/traditions`, **`src/domain/region`** — and the widening is **declared here rather than
discovered at build**, which is the difference between this charter and the refuted one.

**MEASURED at this base:** a whole-`src/domain` sweep under the two scannable idiom signatures
(excluding the modules that DECLARE them) finds live idioms in exactly **`worldPulse` (14 files)**
and **`region` (1 file)** — `src/domain/region/contestOverThirdParty.js`, a softmax over logits with
a keyed tiebreak, which is the very site the owner-named TRADE-partnerships row already depends on.
It is classified **HBF-32**. ⚠ The **ROOT-SET SELF-ASSERTION** stays: a totality walker whose roots
miss a directory does not report a gap, it reports SUCCESS.

⚠ **M-9's TARGET WAS RE-AIMED ON MEASUREMENT** and stays re-aimed: the traditions directory holds
**no** scannable idiom signature (its faith fork is a Bernoulli gate, found by the checklist), so
removing it from the roots could not red anything. The mutant removes **`src/domain/region`**.

## 6. ⭐⭐ THE ORPHAN-WINDOW DISCHARGE (HB-0.md §15, CR-HB1′-DORM)

**HB-0.md §15 wrote the discharge condition as a condition rather than a hope:** *"The window closes
at the HB-1 re-charter's FIRST CONSUMER — the wave that imports `habitVocabulary.js`."* **This wave
is that consumer**, and §15's ⛔ clause binds it:

> `tests/domain/habitCurve.test.js`'s dormancy case asserts *"neither new leaf has an importer
> anywhere in `src`"* — a WHOLE-TREE ABSOLUTE. **The first consumer must re-aim that case in its own
> commit.** A wave that adds the import without re-aiming it reds a test green since the HB-0 landing.

**MEASURED at this base, so the re-aim is built on figures rather than on the receipt's word:**
importers of the two leaves = **[]**; importers of `habitForkRegistry.js` = **[]**; importers of
`strategyMoves.js` = **[]**; `SRC_FILES` = **2118**.

**THE RE-AIM — from a whole-tree absolute to the claim the wave actually needs: THE DARK CLOSURE.**

```js
/** The HB family's reverse-import closure inside src. Exact BOTH directions. */
const HABIT_DARK_CLOSURE = Object.freeze([
  'src/domain/worldPulse/habit/habitCurve.js',
  'src/domain/worldPulse/habit/habitVocabulary.js',
  'src/domain/worldPulse/habitForkRegistry.js',
]);
```

Three arms inside the **one existing case** (⭐ **no new title**):

- **(a) THE CLOSURE IS EXACT.** Compute the reverse-import closure of the two HB-0 leaves over
  `SRC_FILES` and assert it **set-equals** `HABIT_DARK_CLOSURE`, both directions. A new consumer must
  declare itself here; a vanished one must be banked.
- **(b) THE CLOSURE IS CLOSED — this is the dormancy claim.** **No module outside the closure imports
  any member of it.** That is what "the wave changes no output" now means: not that the leaves have
  no importer, but that **the whole family is unreachable from the engine**.
- **(c) GUARD THE GUARD.** The same detector finds the family's real inbound edge
  (`habitForkRegistry.js → habit/habitVocabulary.js`) and the leaves' own sibling import
  (`habitCurve.js → ../bandedStock.js`), so an emptied scan cannot pass as an absence.

⛔ **THE RE-AIM AND THE IMPORT LAND IN THE SAME COMMIT (I1).** Splitting them reds a green test.

## 7. Acceptance cases (denominator 8 — the validator's cap, and the standard's edge-case budget)

| # | Case |
|---|---|
| **A1** | ⭐ **THE EMITTER IS THE DENOMINATOR.** `STRATEGY_MOVES` equals the set `enumerateMoves` actually emits, measured across every exported scoring objective on generated candidates — **never a hand list**. Both directions. |
| **A2** | **THE BRANCHER REGISTER IS EXACT BOTH DIRECTIONS** against the live scan (measured denominator **TEN**): an unregistered brancher reds, a stale row reds, every row carries a recognised `kind` and a written reason. Plus `scoringObjective.js`'s lever keys ⊆ `STRATEGY_MOVES`, asserted **from the TEST side** (C1 obligation 1). |
| **A3** | ⭐⭐ **THE OWNER ARM AND ITS EVIDENCE — THE §38.3 REGISTER CURE.** Inside a `strategy`-kind module every move-keyed literal is a **MEMBER or a DECLARED FOREIGN TOKEN**, and **the declared foreign set equals the measured foreign set EXACTLY, BOTH DIRECTIONS**. Every `foreignTokens` entry carries a non-empty `vocabulary` + `reason`, and its `evidence` path exists and its `evidenceSymbol` spells the token. ⛔ **A deletion of the registered disjunct REDS here** — the arm the refuted design lacked. |
| **A4** | **THE CORRECTED `martialMoves` ACT (R21) + §38.4's CENSUS.** `MARTIAL_HISTORY_MOVES` ⊂ `STRATEGY_MOVES`, length **8**, the three exclusions asserted BY NAME, and the derived eight asserted to reproduce the pre-wave membership **EXACTLY**. The retirement's consumer census (2 references, both in-module) is recorded in §3.2. |
| **A5** | **C1's LEAF CONTRACT:** `strategyMoves.js` has **zero imports** (source scan); `ALL_MOVE_TOKENS` **equals** `STRATEGY_MOVES` today; and the **AT-MOST-ONE-EXPORTER** scan holds tree-wide (WC-0's structural half, landed by the volume that got there first). |
| **A6** | ⭐⭐ **THE DARK CLOSURE (HB-0.md §15's discharge).** `HABIT_DARK_CLOSURE` set-equals the measured reverse-import closure both directions; **no module outside it imports any member of it**; and the detector is proved live on the family's real inbound edge. **Re-aimed in place — zero new titles.** |
| **A7** | ⭐ **THE REGISTRY'S THREE J-HB-23 ASSERTIONS + THE F2 INVARIANT.** **(a) FOURTEEN** named-domain rows, each with a disposition and a **non-empty** reason; **(b)** the label set asserted **SET-EQUAL both directions** to the closed explicit eight — ⛔ **a distinct-string count is the vacuous form and is REFUSED**; **(c)** the owner's SEVEN spoken domains mapped TOTAL onto those eight, *"goals, and goal orientation"* → **BOTH** labels; **(d)** ⭐ **every row's `module` id is EXTENSIONLESS and resolves to a real file** (the §38.3 siting cure, asserted as an invariant so a future row cannot reintroduce the class). |
| **A8** | **THE PARTITION AND ITS UNIQUENESS ARMS:** `classified` equals `discovered` both directions over the idiom signatures across **FOUR** roots incl. **`src/domain/region`**; the **ROOT-SET** self-assertion (no undeclared domain directory holds a live signature); `symbolsWithTwoDispositions` empty (R13); `symbolsWithTwoArities` empty; **every DEFER row's `closeOwed` non-empty**; DEFER shrink-only; plus the registry's own guard-the-guard. |

## 8. Wave-specific mutants — TEN, each convicting, each restored digest-exact (`cmp`)

| # | Mutant | Must RED |
|---|---|---|
| **M-1** | ⭐⭐ **DELETE `move === 'fortify' \|\|`** from `settlementPolitics.js` — *the exact refuted edit* | **A3's declared-but-absent half.** ⛔ **THE HEADLINE MUTANT: this is the arm that catches the §38 refutation before it can be committed.** |
| **M-2** | **Delete the whole `else if` arm** (the compile's original false ruling) | A3 + the live-arm control, proving the arm fires through `defend` |
| **M-3** | **Plant an UNREGISTERED foreign token** (`move === 'raid'`) in `settlementPolitics.js` | A3's unregistered half |
| **M-4** | **Widen `MARTIAL_HISTORY_MOVES` to `STRATEGY_MOVES`** | A4 — R21's whole argument, executed |
| **M-5** | **Plant a second exporter of the move list** in another module | A5's at-most-one-exporter scan (C1's fence) |
| **M-6** | **Drop one named-domain row** from the registry table | A7(a)'s **FOURTEEN** count. ⚠ mutate the TABLE, never the recorded count — a count mutant on a literal goes vacuous |
| **M-7** | **Misspell one domain label** in one row | A7(b)'s **SET EQUALITY**. ⭐ a distinct-string count leaves the size at eight and would NOT catch it |
| **M-8** | ⭐ **Restore a `.js` suffix** on one registry `module:` id | A7(d) — the §38.3 siting invariant + the existence check |
| **M-9** | **Remove `src/domain/region`** from `SCAN_ROOTS` | A8's ROOT-SET self-assertion **and** the partition together |
| **M-10** | ⭐ **Delete `'fortify'` from `LOAD_BEARING_MOVES`** in `espionageAbsenceDormancy.test.js` | A3's **EVIDENCE arm** — the second half of the golden's protection. ⚠ a foreign-file plant: restore digest-exact and re-verify `git status --porcelain` = 0 |

⚠ Every mutant is planted, run, and restored with `cmp` proving byte-identity; porcelain re-checked
after M-10.

## 9. The checks (bare, in-shell, unpiped, each `; echo TRUE_EXIT=$?`)

```
npx vitest run tests/domain/strategyMoves.test.js tests/domain/habitForkRegistry.test.js
npx vitest run tests/lint/chooserTotality.walker.test.js tests/lint/strategyMoveVocabulary.walker.test.js
npx vitest run tests/property/espionageAbsenceDormancy.test.js        ⭐⭐ THE GOLDEN FENCE
npx vitest run tests/domain/habitCurve.test.js tests/domain/habitVocabulary.test.js
npx vitest run tests/domain/settlementPoliticsPins.test.js tests/domain/settlementStrategy.test.js
npx vitest run tests/property/settlementPoliticsDormancyGolden.test.js tests/domain/warMachineObeysPolitics.test.js
npx vitest run tests/domain/espionageDoctrineStage.test.js            ⭐ the F2 siting's own control
npx vitest run tests/lint/sizeBaseline.test.js tests/lint/couplingInclusion.walker.test.js
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
npx vitest run tests/lint/mutationCoverageManifest.test.js tests/lint/spBandFamilies.walker.test.js
node scripts/check-observed-shape-readers.mjs
node scripts/implementation-packets.mjs validate
npm run typecheck:ratchet
npm run typecheck:domain:strict
```

⛔ **NEVER wrap any of these in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks; exit 3 is the mutex giving up, not a red. The bare full gate and `smoke:boot` belong
to **T**, run bare from a fresh shell.

**§31.2 ANCHOR PREFLIGHT — MANDATORY, BEFORE GREEN IS DECLARED.** All four new test files are NEW ⇒
`ceilingFor` = **0**. ⚠ The two walker files are the high-risk ones: absence claims over
`offenders`/`strays`/`unregistered` collections naturally reach for a bare negative matcher.
⚠ A multi-line `// anchored:` counts only if its **LAST** line carries the marker, and the marker
must sit on the line **IMMEDIATELY above** the assertion.

**Baselines executed by this lane at `f6749fad`**, so the preflight has a control:
`negativeAssertionAnchor.walker` + `habitCurve` → **exit 0, 17 passed**;
`espionageAbsenceDormancy` → **exit 0, 9 passed**; `validate:packets` → **exit 0, 41 packets / 0 READY**.

## 10. Declared census movement (J-TE3-1 — BY FIGURE)

`2421/366/2055/20046/5646` (this base) → **`2425/366/2059/20077/5650`**
(**+4 files / +0 parked / +4 credited / +31 titles / +4 suite titles**). ⭐ **THE WHOLE TUPLE IS
RE-DERIVED AT THIS COMMIT**, which leaves the terminal docs-only and lets the capsule generate in
ONE commit. `runtimeTests` **28062 → 28093**.

**Parked stays at 366:** every title is a literal in a straight-line registration — ⛔ **no
`test.each()`, no `describe.runIf()`.** ⚠ That census is SEQUENCED and stops measuring at its first
red figure; if it reds on `files`, prove the remaining four by an isolated probe (replace the
recorded tuple with the declared one, re-run, restore, `cmp` 0).

## 11. Risks and open items

1. ⚠⚠ **THE WAR LANE.** CHECK-GIT-FIRST on `settlementStrategy.js` + `settlementPolitics.js`
   immediately before I1.
2. ⚠⚠ **THE NAKED-CLAIM DEBT IS PER-CLAIM AND REDS A GREEN TEST.** Run the exact `CLAIM_RE` from
   `tests/docs/enforcement-claims.test.js` over this packet and the INDEX edit **before P1** and
   again on the terminal docs. ⚠ "reds the gate" is safe wording; the literal zero-count phrases the
   regex names are not — and its zero-count alternative is an unanchored substring, so a
   *thirty*-count sentence matches it too. ⭐ **This packet's own draft tripped that check once, at
   this very risk note, and was respelled — executed, `CLAIM_RE` matches now 0 in both documents.**
3. **`habitForkRegistry.js` size** — measured **239** effective against ≤ 600, STOP at 800. The
   split contingency costs a **THIRD** `ARGUED_UNLAYERED` row (ceiling **18**, not 17) and the
   census must then be **re-derived, not patched**.
4. **The size ratchet is tolerance-ZERO in both directions.** +1 on `settlementStrategy.js` is a
   hard STOP; −1 must be banked in the same commit.
5. ⚠ **`momentum.js`'s owner-arm contribution is VACUOUS today** (0 subjects, measured) and the
   walker says so in-source.
6. **Not taken, recorded (deferrals):** (a) `espionageDoctrineStage.test.js`'s bare importer regex —
   the `codeOnly()` micro-act family owns it (§5.3); (b) the volume text still instructs the R7
   delete in **six** places (`DESIGN_FP_ARCH_HB.md` :96, :374-390, :678, :882, :2973, :3036) — a
   volume annotation is a `docs/**.md` write and therefore a naked-claim gate risk, queued as its
   own micro-act (CR-HB1′-VOL); (c) `ruinFilterRoster.walker.test.js`'s `codeOnly()` defect
   (OQ §33 ruling 3) is the same family and is **NOT** repaired here.
7. **The WC inbound half remains owed** — until it exists the arbitration is a recommendation with a
   fence, by WC's own words; after this train the fence exists.

## 12. Executed landing evidence (member proof at `1013d58b`)

Every figure below was executed in the build worktree at the member commit, bare and in-shell.

| Row | Executed |
|---|---|
| the four new test files | **31 tests, exit 0** — `strategyMoves` 8 + `habitForkRegistry` 7 + `chooserTotality.walker` 8 + `strategyMoveVocabulary.walker` 8, exactly the §9 title budget |
| ⭐⭐ the two ratified goldens | **9 passed, exit 0**, and the file is byte-identical at every commit boundary: blob `6112fddc14732ee77dadff871678b3ed892d0029`, `:305` sha256 `7b69419e…0bd1dc60`, `:325` sha256 `4d45c2b6…6fa250a5c8` |
| `settlementPolitics.js` | **560 → 560** effective under the ENFORCER; raw 1066 → 1073 (+7 comment lines); the whole diff is eight ` *` lines and every non-comment line is byte-identical |
| `settlementStrategy.js` | **812 → 812** effective, NET ZERO (R24) |
| the two new leaves | `strategyMoves.js` **22** (budget 120) · `habitForkRegistry.js` **239** (budget 600, STOP at 800), **239 → 239** with extensionless ids — the F2 cure costs nothing |
| the register's denominator | **10** live branchers, **4** of kind `strategy`, exactly **1** declared foreign token in **1** module; the evidence address spells it |
| the registry | **32** rows · **20** classified = **20** discovered, both directions · **14** named-domain rows over **8** labels · **29** DEFER · **0** LEARN |
| the dark closure | closure grown to a fixpoint = the three declared members, both directions; **0** modules outside it import any member |
| `couplingInclusion.walker` | `ARGUED_ROSTER_CEILING` **15 → 17** in the same commit as the two rows; `UNLAYERED_BASELINE_CEILING` unmoved at 179 |
| the lighting census | re-derived WHOLE at the member: `2421/366/2055/20046/5646` → **`2425/366/2059/20077/5650`**; `366 + 2059 = 2425` |
| `espionageDoctrineStage.test.js` | **17 passed, exit 0** — the F2 siting cure's own control: the registry does NOT join that pin's importer list |
| the anchor preflight (§31.2) | **exit 0** over all four new files, run BEFORE green was declared |
| `validate:packets` | **exit 0, 42 packets / 1 READY** at the member — every one of P1's thirteen declared rows discharged |
| observed-shape readers | **1998**, exactly matching the frozen inventory |
| both typecheck ratchets | `typecheck:ratchet` **173/173** · `typecheck:domain:strict` **1134/1134**, both at their exact floors |
| scoped `eslint` | **exit 0** over all ten touched source and test paths |
| **the ten wave mutants** | **10 CAUGHT / 10 restored digest-exact** (`cmp` + sha256). M-7 is the sharpest: **+1 byte**, one red, and the distinct-string label COUNT stays at eight — which is why that arm is a SET EQUALITY and not a count |

⚠ **ONE PREDICTION WAS CORRECTED ON EXECUTION, and it is recorded rather than smoothed away.**
The train plan §7 declared P1's validator red as **13 rows split 10 + 3**; the executed split is
**12 + 1**, because the two new walker files are `CREATE` rows whose paths are absent at P1 rather
than present. The same thirteen rows, the same three named symbols beyond the ten, the same
binding figure — exit 1, 13 rows, all cured at I1.

