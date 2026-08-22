# lane TE-WF1C — WF-1C full packet lifecycle receipt

> **THE TIP FOR THE CHAIR'S CAS:**
> ## `cdfe5a96716250af71f4e91305beb8716987e4f3`
> Detached HEAD in
> `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6298872d-53af-4c8a-99e5-139bfc5bfc1f/scratchpad/wf1c-tree`,
> **six** commits on top of `claude/composite-r4 @ 2cdb87fa`. Working tree CLEAN. **The worktree is
> LEFT IN PLACE for chair verification.** A second worktree, `…/scratchpad/wf1c-baseproof`, holds the
> pristine base `2cdb87fa` for identity comparison and is also left in place; its `node_modules` is a
> symlink into this lane's own tree.
>
> ⭐ **THE TERMINAL IS GREEN AT ALL SEVENTEEN STEPS PLUS `smoke:boot`** (§9), and the base ref was
> `2cdb87fa` at both the start and the end of the run, recorded by the gate script itself.

## OUTCOME, FIRST

**WF-1c is built, landed and terminalized on a fully green gate.** The realm's chronicle now says
something when the last altar in the world goes out, and it says it once. Everything the packet
asked for is built and proven:

- ⭐⭐ **SEVENTEEN OF SEVENTEEN GATE STEPS GREEN, PLUS `smoke:boot`** — including
  `test:ratchet` at `no test regressions (11 known failure(s) of 28658 tests, ceiling 11)`, both
  typecheckers exactly at their floors, and the built bundle booting at 524/524 chunks.

- ⭐ **The seven acceptance cases pass**, and one of them carries a control that exists because
  **running the fixture refuted the pin reading alone would have written** (§6.1).
- ⭐ **Dark is byte-identical, measured against a PRE-WIRING golden** on a deity-BEARING full-pulse
  fixture: `absent` and `false` both hash `abf823a87b36bcc1` at 1,449 bytes before AND after the
  landing. Only the literal lit drive moves, to `759003f621df7e69` at 3,115 bytes. The persisted
  pantheon is `048e14540e0b135d` in all three arms, before and after — the rows are transient.
- ⭐ **`pulseKernel.js` is NET ZERO and it is proved on both sides of the edit**: 1581 before, 1581
  after, against a frozen literal of 1581, with the diff exactly one insertion and one deletion on
  one line and `eslint` clean against the generated per-file override.
- ⭐ **Five mutants convict and the §14 STOP is checked and does not fire** — (a) reds A4 alone and
  (b) reds A1 alone, so neither guard is vacuous. Every restore is proved by digest.
- ⭐ **Zero landed pins were edited to stay green.** `patronFall.test.js`, `realmEvents.test.js` and
  the three `ratchetPantheonTiers` `changes.length` pins pass UNEDITED, which is the executed proof
  that the widening is additive rather than the claim that it is.
- **The census arithmetic closes exactly**: `+0/+0/+0/+7/+0`.
- ⛔ **RAISED-B was ruled by MEASUREMENT and the measurement refuses the cure** (§6.2). It is written
  out for the chair as a micro-item rather than taken.

## 1 · WHAT LANDED, COMMIT BY COMMIT

| sha | what |
|---|---|
| `8b88c14a` | The packet lands at **DRAFT** at `docs/implementation/packets/fp/WF-1C.md`, with its `PACKET_MANIFEST.json` row spliced as a scoped text APPEND and its `INDEX.md` row inserted after WF-1B |
| `1791fb93` | **DRAFT → READY** after re-executing the whole §11 preflight at this tip |
| `adb5faf3` | **The implementation** — M1 through M8 |
| `253f2028` | **READY → LANDED**, `lastSeatLosses` joins `requiredSymbols`, and §16 (the landing record) is written into the packet itself |
| `a5e6bdfe` | **The any-cast cure the FULL GATE found** — the derivation's two JSDoc parameters typed instead of `any`; see §6.3 |
| **`cdfe5a96`** | **Two §16 figures re-stated at measured truth.** The cure moved `pantheon.js` by two effective lines, so the packet's prose aggregate disagreed with its own table (44 against a table summing to 46) and §16.3 still quoted the pre-cure battery run. A landed packet whose arithmetic contradicts itself is a false record, so both were corrected and the terminal re-run rather than the discrepancy shipped. **This is the tip.** |

Diffstat against the base: **11 files, 1,674 insertions, 23 deletions** — five production files,
three test/census files, and three packet-system files. No `package.json` / `package-lock.json`
motion. Final production digests at the tip:

| md5 | file |
|---|---|
| `f46c80004b368657375f63a423fc2335` | `src/domain/worldPulse/pantheon.js` |
| `6b5805aa22dbfb994c3e8b09d82a5dc9` | `src/domain/worldPulse/realmEvents.js` |
| `40ab29f52fbbd045145ab7b95a558f92` | `src/domain/worldPulse/pulseKernel.js` |
| `247b06d95553c720d6193590605c27c5` | `src/domain/display/settlementRumors.js` |
| `471441b4e1a66fc8652306584c7044a1` | `src/domain/display/chroniclersLetter.js` |
| `cae1e863e3fed93421bb3093a04a284d` | `src/domain/realm/heraldRouting.js` — **UNTOUCHED**, digested because mutant (d) plants into it |

## 2 · PREFLIGHT (§11), EVERY FIGURE THIS LANE'S OWN

| § | check | result |
|---|---|---|
| 0 | `git rev-parse HEAD` | `2cdb87fac566b3d6803a0dce9d59df13f07c1c9e` — **CONFIRMED**, and the ref was re-read at every phase |
| — | `WF-PREAMBLE.md` SHA-256 | `ca02c8a165ddbc18ab3f254bebce8cca5dd945e71e074b526227164e9b0cabfd`, 757 lines / 56,878 bytes — **matches the packet's binding citation exactly.** The §315 re-stamp holds and the family is consistent |
| 1 | `negativeAssertionAnchor` preflight | **9 passed**, TRUE_EXIT=**0** at the base; re-run green after the battery landed |
| 2 | `BASE_STATE.json` admissibility | ⛔ **NOT CITABLE, measured independently.** Stamped at `b8946403`, which IS an ancestor, but the window is **239 paths of which 195 sit outside `docs/`**. WF-1A's and WF-1B's verdicts reproduce; nothing was inherited |
| 3 | packet status | DRAFT as written; promoted in-lane |
| 4 | target files clean | `git status --porcelain` empty in a fresh worktree; no foreign dirt anywhere |
| 5 | §15 symbols resolve | **23 of 23**, each checked as the exact substring the manifest uses |
| 6 | `validate:packets` at the tip | `valid: 131 packets (0 READY)`, TRUE_EXIT=**0**; collision check re-run: **131 rows, 130 LANDED + 1 SUPERSEDED, ZERO non-terminal**, so no live packet reserved any path |
| 7 | eslint `Linter`, `max-lines {skipBlankLines, skipComments}` | ⛔ `pulseKernel.js` **1581 / frozen 1581 — ZERO HEADROOM**; `realmEvents.js` **283**, `pantheon.js` **160**, `settlementRumors.js` **508**, `chroniclersLetter.js` **220**; for the record and untouched, `warTermination.js` **818/818** and `peaceTerms.js` **797**. Every figure matches the packet exactly |
| 8 | the live censuses, re-read | lighting tuple `2485/364/2121/20611/5768` at `:4870`; `kindPoolFloors` REGISTRIES **10**, small-family `['INFORMATION']`, `REGISTERED_KIND_COUNT` **112**, `ROUTED_TOKENS` **378**, `LEGACY_UNVOICED_TOKENS` **274**, divergence **8**; wizard-news debt **19** entries with **zero** for `realmEvents.js`; `.prose-numerics-baseline.json` **413** rows, **zero** matches; ratchet baseline `measuredAtSha 4deb4f02`, **11** banked entries, `totalTests` 28274, `totalFiles` 2387 |
| 9 | own-footprint golden | captured BEFORE wiring on a deity-BEARING full-pulse fixture — §4 |
| 10 | A1/A3/A4 fixtures RUN and PRINTED | §3 — and one of them **refuted a pin** |

## 3 · THE FIXTURES, RUN AND PRINTED BEFORE ANY PIN WAS WRITTEN

Executed at the base, in this lane's own worktree, before the first edit
(`laneTEWF1C-probe-base.log`):

```
TIER_HOLD_TICKS = 2      MAX_TIER_CHANGES_PER_TICK = 2
qualifyingTier(1,'cult') = cult    ladderSpeaks=false
qualifyingTier(0,'cult') = cult    ladderSpeaks=false
qualifyingTier(0,'minor') = cult   ladderSpeaks=true
qualifyingTier(0,'major') = cult   ladderSpeaks=true

--- A1/A3: a one-seat cult loses its last seat ---
tick0 changes = []      pantheon = {"deity:The Pale Warden":{…,"seats":1,"tier":"cult"}}
tick1 changes = []   ⇐ A3 COUNTERFACTUAL      tick1 arcs = []
tick2 changes = []      pantheon = {…,"deity:The Pale Warden":{…,"seats":0,"tier":"cult","tierHeld":0}}
  PREDICATE deity:The Pale Warden: prevSeats=1 seats=0 tier=cult lostLastSeat=true ladderSpeaks=false

--- A4: a MAJOR creed collapsing 4 → 0 ---
tick 1: changes=[]                                         sun={seats:0,tier:"major",tierHeld:1}
  PREDICATE deity:Sun: prevSeats=4 seats=0 tier=major lostLastSeat=true ladderSpeaks=true ⇒ SILENT
tick 2: changes=[{"deityId":"deity:Sun","from":"major","to":"cult"}]   sun={seats:0,tier:"cult"}
```

⭐ **THE WAVE'S PREMISE IS EXECUTED, NOT ARGUED.** A one-seat deity is already at the cult floor, so
losing that seat produces `changes: []` and the arcs say nothing at all. **A3's counterfactual is
this transcript.**

⛔⛔ **THE DOUBLE OBITUARY IS REAL AND IT REPRODUCES.** The seat loss lands on tick 1 and the Twilight
on tick 2. A `prevSeats > 0 && seats === 0` predicate alone would put a realm extinction on tick 1
and a realm twilight about the same creed on tick 2. The ladder-silent guard is what makes A4's
silence an invariant rather than a timing accident.

**The VIRTUAL flag survives normalization** (the failure that would have shipped the whole feature
dark with every fence green): `normalizeSimulationRules({faithUnseatingEnabled:true})` returns
`true`, the key is absent from `DEFAULT_SIMULATION_RULES`, and the virtual register holds 24 members
with the flag at index 9.

## 4 · THE DARK FENCE, MEASURED AGAINST A PRE-WIRING GOLDEN

⚠⚠ **THE FIRST FIXTURE THIS LANE BUILT WAS VACUOUS, AND RUNNING IT IS THE ONLY REASON THAT IS
KNOWN.** A quiet two-settlement world drives a pulse that emits **no news at all** — `newsBytes=2`,
`impactKinds=[]`, `selected=0` — so "absent is byte-identical to false" held over an empty list and
proved nothing. The landed fixture matures an **Ascendancy in every arm**, so each hash below is
taken over a real feed and the lit arm's motion is an ADDITION to a feed already carrying a pantheon
beat.

| arm | BEFORE wiring | AFTER wiring | verdict |
|---|---|---|---|
| absent | `abf823a87b36bcc1` / 1,449 B | `abf823a87b36bcc1` / 1,449 B | **IDENTICAL** |
| false | `abf823a87b36bcc1` / 1,449 B | `abf823a87b36bcc1` / 1,449 B | **IDENTICAL** |
| **LIT** | `abf823a87b36bcc1` / 1,449 B | **`759003f621df7e69` / 3,115 B** | **MOVED — two beats present** |
| persisted pantheon (all three) | `048e14540e0b135d` | `048e14540e0b135d` | **IDENTICAL** — nothing persists |

The lit feed's `impactKinds` read
`["pantheon_ascendancy","pantheon_extinction","pantheon_extinction","faction_service_bolster"]`, and
its headlines `["The Ascendancy of Vael","The Last Altar of Forge","The Last Altar of The Pale
Warden"]` — codepoint-ordered by deity id, as the existing `ordered` sort already guarantees.

**DECLARED SHIFT: NOT INCURRED.** Executed: **no preset declares `faithUnseatingEnabled`** and **no
same-seed golden corpus carries a `pantheon_twilight` row**, so no committed golden can reach either
the lit path or the salience extraction. The only motion is inside the flag, on a lane-built fixture.

## 5 · EFFECTIVE LINES, MEASURED ON BOTH SIDES

Measured with eslint's own `Linter` under `max-lines {skipBlankLines:true, skipComments:true}` —
never `wc -l`, never inherited, and read from the LIVE working file rather than a blob.

| file | before | after | delta | ceiling |
|---|---:|---:|---:|---|
| ⛔ `pulseKernel.js` | **1581** | **1581** | **0** | frozen **1581**, exact in both directions |
| `realmEvents.js` | 283 | 309 | +26 | 800 layer |
| `pantheon.js` | 160 | **179** | +19 | 800 layer (two of the 19 are the §6.3 cure) |
| `settlementRumors.js` | 508 | 509 | +1 | 800 layer |
| `chroniclersLetter.js` | 220 | 220 | +0 | 800 layer |
| `warTermination.js` | 818 | 818 | +0 | frozen 818 — untouched, re-measured for the record |
| `peaceTerms.js` | 797 | 797 | +0 | 800 hot list — untouched |

⛔ **M5's NET ZERO IS PROVED THREE WAYS**: the two `Linter` readings agree at 1581; `git diff
--numstat` on the file is `1  1` with the hunk header `@@ -1604 +1604 @@`; and `npx eslint
src/domain/worldPulse/pulseKernel.js` returns TRUE_EXIT=**0** against the per-file `max-lines`
override `eslint.config.js` generates from the frozen literal.

⚠ **ONE MEASURED DEVIATION FROM THE PACKET'S OWN ESTIMATE, AND IT IS RECORDED RATHER THAN
ABSORBED.** M2's instruction row estimates `≤22` effective lines; it measures **+26**. The arithmetic
is forced: the wizard-news authoring wall requires the FULL sibling field set, and that field set
alone is **22 lines**, leaving the arm's guard line, its branch line and the two extracted salience
constants as the remaining four. **The governed budgets both hold** — the aggregate production delta
is **46** against §8's `≤49` and `PACKET_STANDARD`'s `400` — and the compile receipt had already
labelled the per-row figures predictions rather than measurements. Written into packet §16.9.

## 6 · THE TWO THINGS THE COMPILE COULD NOT HAVE KNOWN

### 6.1 ⛔⛔ A PIN WAS REFUTED BY RUNNING IT, AND IT WOULD HAVE PASSED WHILE ASSERTING NOTHING

**The name a beat prints depends on WHICH snapshot the arcs are handed**, and the truncation the
whole of RAISED-B is about is invisible under the wrong one. Executed both ways at the wired tip:

```
ref                            PROD (creed absent)                  stale (creed still present)
deity:The Pale Warden          "The Last Altar of The Pale Warden"   "The Last Altar of The Pale Warden"
custom:sun_of_the_deep_forge   "The Last Altar of Forge"       ⛔    "The Last Altar of Sun of the Deep Forge"
custom:lu_vael                 "The Last Altar of Vael"              "The Last Altar of Vael"
```

The kernel passes **this tick's** pre-tick snapshot (`pantheonSeatSnapshot`), in which an extinct
creed already holds no seat — so production always takes the fallback. A truncation pin written
against the PRIOR tick's snapshot resolves the name by scan, prints it whole, and asserts nothing at
all about the defect it exists to freeze. **A1 pins the production shape and carries the stale one
as its own control**, so the arm cannot silently go vacuous later.

### 6.2 ⛔ RAISED-B, MEASURED — AND THE CHAIR'S OWN REFUSE-ARM IS THE ONE THAT FIRES

The chair (ODQ §316) ruled: cure in-member **only if** the cure's output changes are dormant-only;
refuse if any LIVE surface shares the function. Executed:

| measured | result |
|---|---|
| callers of `deityNameForRef` in `src` | **exactly ONE** — `realmEvents.js:273`, inside `synthesizePantheonArcs` |
| production callers of `synthesizePantheonArcs` | **exactly ONE** — `pulseKernel.js:1870` |
| is that call flag-gated? | ⛔ **NO** — religion ACTIVITY only; the ascendancy and twilight arms are live today |
| is the truncating branch reachable live? | ⛔ **YES, and this lane executed it** — the §3 major-collapse transcript lands a Twilight on tick 2 for a creed holding zero seats, carried by no settlement, with **no WF-1c code present** |
| would the cure move a committed golden? | **No** — no preset declares the flag and no golden corpus carries a `pantheon_twilight` row. **It does not rescue the cure**: the change would still alter what a live campaign prints |

⇒ **A LIVE, UNFLAGGED SURFACE SHARES THE HELPER, SO THE CURE IS REFUSED IN-MEMBER.** The behaviour
is pinned on a separately labelled arm carrying a defect annotation, and the micro-item is written
out for the chair at §8 below and in packet §13 RAISED-B.

### 6.3 ⛔⛔ THE ANY-CAST RATCHET — FOUND ONLY BY THE FULL GATE, AND CURED BY TYPING

The first terminal reported three `domainAnyCastBaseline` arms outside the frozen census:

```
src/domain/worldPulse/pantheon.js: 26 any-holes (allowance 24)
```

Exactly **+2** — one per JSDoc parameter on `lastSeatLosses`, written `Record<string, any>` because
that is the spelling every neighbouring function in the file already uses. The ratchet's own message
forecloses the easy exits in terms: widening the ledger is not the cure and neither is a
declared-overrun row, because both ledger ceilings are monotone-down literals and a new row only
moves the red to the ceiling arm.

**CURED BY TYPING.** The ledger's entry shape is named once as a module-local `@typedef` and both
parameters take `Record<string, PantheonLedgerEntry>`; the loop binds the entry and guards it so the
tier read narrows to `string` without a cast. The typedef and the annotations are comments and cost
**zero** effective lines; the binding and guard cost **two**, taking `pantheon.js` 177 → **179**.

⛔ **EVERYTHING WAS RE-PROVED AFTER THE CURE, NOT ASSUMED** — the recorded precedent is that an
any-cast cure can itself be wrong in a way only the STRICT typechecker sees:

| re-proof | result |
|---|---|
| `domainAnyCastBaseline` | **13 passed**, TRUE_EXIT=0 |
| `typecheck:ratchet` / `typecheck:domain:strict` | **173/173** and **1134/1134** — back at their exact floors |
| the own-footprint golden, all arms | **byte-identical to the PRE-WIRING capture** — `abf823a87b36bcc1` / 1,449 B dark, `759003f621df7e69` / 3,115 B lit, pantheon `048e14540e0b135d` in every arm |
| the focused battery | **7 files, 447 tests**, TRUE_EXIT=0 |
| all five mutants | **IDENTICAL conviction sets**; the §14 STOP still does not fire |
| `pulseKernel.js` | re-measured at **1581** — untouched, net zero holds |
| `eslint src/domain/worldPulse/pantheon.js` | TRUE_EXIT=0 |

⚠ **THE CLASS LESSON, offered for the family law:** `pantheon.js` is on no zero-headroom list and the
compile priced no any-cast obligation — because the file's own established idiom is the spelling
that reds it. **An any-cast allowance is a SECOND ledger with its own monotone-down ceiling, and
only the full gate reads it.** A WF member adding a JSDoc-typed helper to any `src/domain/**` file
should price it beside the size baseline.

## 7 · THE MUTANTS

Each planted by `cp`, `node --check`ed in its host, convicted, and restored with the restore **proved
by digest** — never by eye, and ⛔ never with the `git checkout` family. `git status` is empty after
the battery, which is git's own confirmation of the restores.

| mutant | §14 predicted | ACTUALLY convicted | verdict |
|---|---|---|---|
| **(a)** delete the ladder-silent guard | A4 alone | **A4 alone** (1 failed / 35 passed) | PASS, exactly as predicted |
| **(b)** drop the had-a-seat half | A1's second arm alone | **A1 alone** (1 failed / 35 passed) | PASS |
| **(c)** force the gate true | A2 alone | **A2 alone** (1 failed / 35 passed) | PASS |
| **(d)** ⭐ the TIDY mutant | A5 + `kindPoolFloors` arms | **A5 + THREE named `kindPoolFloors` arms** (4 failed / 44 passed) | PASS — the prediction under-enumerated which arms reach the arithmetic; it did not find entanglement |
| **(e)** remove the phrase row | the `unphrased` arm | **`unphrased` + A5** (2 failed / 38 passed) | PASS — A5 pins the phrase row as part of the registration totality |

⛔ **THE §14 STOP IS CHECKED AND DOES NOT FIRE.** *"If (a) and (b) convict the same arms, one of the
two guards is vacuous — a STOP and a re-shape, not a pass."* **(a) = {A4}** and **(b) = {A1}** are
disjoint. Each guard suppresses a beat the other cannot, proven by execution rather than by reasoning
about the code. Mutant (d) is the one that matters most for the family: it plants the move a
reasonable implementer would make unprompted, and it reds the shrink-only arithmetic directly —
which is what makes §4's refusal structural rather than a note in prose.

## 7b · THE LANDING JUDGMENT CALLS (all vetoable)

- **J-TEWF1C-1 — M2 measures +26 effective lines against its instruction row's `≤22`, and the row
  was followed rather than the estimate.** The wizard-news authoring wall makes the FULL sibling
  field set a STOP condition, and that field set alone is 22 lines. Trimming to the estimate would
  have meant dropping fields the walker requires. The governed budgets both hold (aggregate 46
  against `≤49` and `400`), and the compile receipt had already labelled the per-row figures
  predictions. *Say "veto" to re-price M2; the only lever is the field set, which the walker owns.*
- **J-TEWF1C-2 — `pulseKernel.js:1598`'s JSDoc on the local was left NARROWER than the values it
  now receives, deliberately.** The annotation reads `Array<{deityId, from, to}>` and the array can
  now carry the optional flag. Widening it is a comment-only edit that costs zero effective lines —
  but M5's instruction row says in terms *"Modify exactly one line… add no line, delete no line,
  move no line"*, and deviating from a chair-ruled instruction row for a cosmetic annotation is the
  worse trade. ⭐ **It is proved safe rather than assumed**: both typecheckers sit at their exact
  floors (173/173 and 1134/1134) with the widening in place, because the assignment source is a
  variable rather than a fresh object literal. The authoritative contract — `synthesizePantheonArcs`'
  own `@param` — WAS widened, and §15 plus §16 record the shape. *Say "veto" to widen the kernel's
  local annotation too; it is a one-line comment edit at net zero whenever the chair wants it.*
- **J-TEWF1C-3 — the acceptance battery imports the ten kind registries and the authoring census
  helper into `tests/domain/pantheon.test.js`.** A5 and A7 are the anti-tidy and authoring-join
  pins, and both need the live denominators; quoting the figures from prose instead would make them
  assertions about this packet rather than about the tree. Cross-importing `tests/lint/**` from
  `tests/domain/**` has landed precedent (`strategicPosture.test.js`, `brokerageIntercept.test.js`).
  *Say "veto" to split A5/A7 into a `tests/lint/**` walker; that reds two censuses and owes a
  mutation-coverage row, which is why the packet refused it at J-TCWF1C-5.*

## 8 · RAISED FOR THE CHAIR

1. ⛔⛔ **RAISED-A STANDS AND THIS LANE RE-MEASURED IT: `pulseKernel.js` IS A THIRD ZERO-HEADROOM-CLASS
   FILE AND NO FAMILY DOCUMENT SAYS SO.** 1581 against a frozen 1581, pinned exact in both directions
   and re-enforced by a generated per-file `max-lines` override. Preamble §P7.8 names only
   `peaceTerms.js` and `warTermination.js`. **WF-1d and every later WF wave that reaches the kernel
   needs this recorded**, and amending a chair-signed preamble is a chair act. WF-1c was safe because
   its M5 is net-zero by construction; the next member may not be.
2. ⚠⚠ **RAISED-B IS A CHAIR MICRO-ITEM, WITH ITS MEASUREMENT AND ITS ONE-LINE CURE.** §6.2 above. The
   cheap cure is one line in `deityNameForRef` — un-slugify the whole tail after the first colon
   rather than keeping only the last token. It changes what the two LANDED arms print and therefore
   owes a declared-shift proof; the expensive alternative (a display name persisted on the pantheon
   entry) is a schema addition and owner-gated. ⭐ **If the chair takes it, exactly ONE labelled arm
   in `pantheon.test.js` re-records** — the arm is already annotated for that.
3. ⭐ **RAISED-C IS DISCHARGED AS THE CHAIR RULED IT: the copy ships as compiled and is marked
   OWNER-REVIEWABLE.** Packet §16.2 quotes every authored string verbatim so the owner reviews bytes.
   The doctrine check is line by line and the realm/settlement boundary is pinned: A1 asserts the
   beat's `settlementIds` is `[]`, so it names no town and cannot be confused with WF-8's
   settlement-voiced obituary.
4. ⚠ **THE ANCHOR MARKER IS READ ON A COMMENT'S LAST LINE, AND IT BITES THE NATURAL WRITING ORDER.**
   Three negatives in this battery carried `// anchored: …` as the FIRST line of a multi-line
   comment; the walker read the last line, saw no marker, and reported three un-anchored assertions
   against a ceiling of zero. Worth a line in the family law: put the marker on the line immediately
   above the assertion, as that comment's LAST line — and a negative reached through a continuation
   (`expect(x)\n  .not.toContain(y)`) needs its value hoisted to a local first, or the marker lands
   above the wrong line.
5. ⚠ **`realmEvents.js` CARRIES FIVE AUTHORING SITES, NOT THREE.** Two pre-existing sites in the
   compound-signature synthesizer sit inside the census denominator with empty `routeTokens`. A7 pins
   all five and asserts the three pantheon tokens by name, so a later member that touches the
   compound sites sees them rather than discovering them at a terminal.
6. ⚠ **A CONTENTION FLAKE WAS OBSERVED AND DISPATCHED, NOT ABSORBED** — §9.2. It is a TIMEOUT in the
   lighting walker's parser-door test, not an assertion failure, and it appeared only while a sibling
   lane's gate held the machine at load 80–250.

## 9 · THE GATE — ⭐⭐ **SEVENTEEN OF SEVENTEEN GREEN, PLUS `smoke:boot`**

Run **BARE** in the lane's own worktree, **never** through `gate-mutex` from outside, each step
separately with its own in-shell `TRUE_EXIT` captured into its own self-named log — so a red step
does **not** black out the steps after it, which the real `&&` chain would.

### 9.1 The final terminal, at tip `cdfe5a96`

Started `21:09:12Z`, finished `21:24:05Z`, at a machine load of **2.41** — a quiet run start to finish. ⭐ **`branch_ref_at_start` and `branch_ref_at_end` are
both `2cdb87fa`** — the base did not move under the run, recorded by the script itself rather than
remembered.

| # | step | TRUE_EXIT | note |
|---:|---|---:|---|
| 1 | `validate:hazard-registry` | **0** | |
| 2 | `validate:premortem` | **0** | |
| 3 | `validate:packets` | **0** | `valid: 132 packets (0 READY)` |
| 4 | `validate:data` | **0** | |
| 5 | `validate:custom-content-manifest` | **0** | |
| 6 | `validate:migration-head` | **0** | |
| 7 | `validate:edge` | **0** | 80 files, 43 test suites env-scope clean — §104.4 confirmed by the gate rather than by reading the metas |
| 8 | `validate:map` | **0** | |
| 9 | `validate:tuning-bands` | **0** | the member authors no number; no band moves |
| 10 | `validate:foundry-module` | **0** | |
| 11 | `validate:mcp-server` | **0** | |
| 12 | `typecheck:ratchet` | **0** | `tsconfig.full.json` — **173 errors, ceiling 173**, exactly at floor |
| 13 | `typecheck:domain:strict` | **0** | `tsconfig.domain-strict.json` — **1134 errors, ceiling 1134**, exactly at floor |
| 14 | `lint` | **0** | 29 problems, **0 errors**, 29 warnings — identical to the base's shape |
| 15 | **`test:ratchet`** | **0** | ⭐ **`OK — no test regressions (11 known failure(s) of 28658 tests, ceiling 11)`** |
| 16 | `build` | **0** | built in 19.92s; 314 static route documents prerendered |
| 17 | `verify:dist` | **0** | `STRICT DIST OK — 51 file(s), 409 test(s), zero failed/non-run/uncollected/missing/extra/duplicate` |
| — | **`smoke:boot`** (outside the chain) | **0** | `524/524 chunks initialised`, shell mounted with 31,706 B of markup, **PASS — the built bundle boots** |

⭐ **THE BASE'S ONE DETERMINISTIC RED IS BANKED AND STAYS BANKED.**
`tests/docs/enforcement-claims.test.js`'s *"every completeness claim carries an @enforced-by tag"*
arm reds at the pristine base — measured there before the first edit, **1 failed / 20 passed**,
TRUE_EXIT=1, on six naked claims in files this packet does not touch — and it is **entry 5 of the 11
banked census rows**, so `test:ratchet` is green with it. ⛔ The unbanked companion arm — the one
that reds a GREEN test when a SEVENTH claim lands — **passes**, which is the executed proof that
this packet contributed no new claim. The live `CLAIM_RE` over `WF-1C.md` and over the INDEX row
returns **zero** matches.

### 9.2 THE EARLIER TERMINALS, AND WHY THERE WERE THREE

Each re-run was forced by a real change to the tree, and each is logged separately
(`…-RUN1`, `…-RUN2`, and the unsuffixed final set):

| run | tip | result | why another was needed |
|---|---|---|---|
| 1 | `253f2028` | **16 of 17 + `smoke:boot`**; the one red was **MINE** | `test:ratchet` reported three `domainAnyCastBaseline` arms outside the frozen census, naming `pantheon.js: 26 any-holes (allowance 24)`. ⛔ **The finding the focused battery structurally cannot produce, and the whole argument for running the gate rather than sampling it.** Cured at §6.3 |
| 2 | `a5e6bdfe` | **17 of 17 + `smoke:boot`** | Green, but writing the cure into the packet's §16 revealed that the cure's two extra effective lines had left §16.9's prose aggregate disagreeing with its own table |
| **3** | **`cdfe5a96`** | ⭐ **17 of 17 + `smoke:boot`, at load 2.41** | **The terminal of record.** No asterisk: it gates the exact bytes the chair will CAS |

⭐ **Every run put `build`, `verify:dist` and `smoke:boot` through independently.** In run 1 the real
`&&` chain would have left all three dark behind the step-15 red; running each step separately is
what makes that reportable, and all three passed even then.

⚠ **The third run was a deliberate choice over the cheaper alternative.** Only two gate steps read
`docs/**.md`, so a targeted re-run of those would have been defensible — but it would have shipped a
receipt whose green rested on reasoning about which steps a markdown edit can reach rather than on
evidence. The machine was quiet by then and the full run cost fifteen minutes.

### 9.3 ⚠ ONE CONTENTION FLAKE, DISPATCHED ON FOUR LEGS — MACHINE, NOT MEMBER

Mid-build, `sovereigntyLightingContract.walker.test.js`'s `DOOR 3 PARSER DOOR` **timed out** at
20,000 ms while two sibling lanes held an 8-core machine at load 80–250. It is not this member's:

1. **It is a TIMEOUT, not an assertion failure**, in a test whose own duration measured 7.5 s to
   33 s depending on load against a fixed 20 s limit.
2. **It passes in isolation in this lane's tree** — 14.37 s, TRUE_EXIT=**0**.
3. **It passes in the FULL file in this lane's tree, twice consecutively** — 9.64 s and 9.66 s,
   33/33, TRUE_EXIT=**0** both times — and again in both full terminals.
4. **It passes in the full file at the PRISTINE BASE** (`…/scratchpad/wf1c-baseproof`,
   `git rev-parse HEAD` = `2cdb87fa`, carrying nothing of this lane's) — 33/33, TRUE_EXIT=**0**.
   The test is a synthetic parser door over a source this member does not supply.

⚠ **AND THE GATE MUTEX EARNED ITS KEEP RATHER THAN GETTING IN THE WAY.** `test:ratchet` acquired the
atomic lock **after 39 polls** on the first run and **8** on the second, having waited out the
sibling lane's ratchet — so both of this lane's suite runs executed on a quiet machine even though
the terminal started at load 95–203. It was never wrapped in `gate-mutex.sh --run` from outside;
`test:ratchet` and `verify:dist` acquire it themselves.

## 10 · WHAT THE CHAIR SHOULD DO

1. ⭐ **CAS `claude/composite-r4` to `cdfe5a96716250af71f4e91305beb8716987e4f3`.** The tree is clean,
   the packet is LANDED and validating at 132 packets / 0 READY, and the terminal is **green at
   every one of its seventeen steps plus `smoke:boot`**, with the base ref unmoved across the run.
2. **Rule on RAISED-A** (§8.1) — recording `pulseKernel.js` as a third zero-headroom-class file in
   the family law. It is a chair edit to a chair-signed preamble and WF-1d needs it.
3. **Rule on RAISED-B** (§8.2) — the `deityNameForRef` truncation, now carried with its executed
   blast radius. Taking it re-records exactly one already-annotated arm.
4. **Put the §16.2 copy in front of the owner at the walk**, per ODQ §316. The strings are quoted
   verbatim in the packet so the review is of bytes rather than of a description.
5. Optionally fold §8.4 (the anchor-marker placement rule) and §8.5 into the family law, and note
   §16.11's class lesson: **an any-cast allowance is a second ledger with its own ceiling, and only
   the full gate reads it.**

**Both worktrees are left in place for verification and neither was removed:**
`…/scratchpad/wf1c-tree` (the lane's, at the tip) and `…/scratchpad/wf1c-baseproof` (pristine
`2cdb87fa`, whose `node_modules` is a symlink into the lane's own tree).
