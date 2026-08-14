# HB FAMILY PACKET PREAMBLE — the invariants signed once per volume

- **Status:** CANONICAL — SIGNED by the chair at `OWNER_DECISION_QUEUE.md` §36
  (CR-HB-PRE, 2026-08-14) and authored into the tree at the `hb-1` train's
  promotion commit `P1`, per `DESIGN_BUILD_EFFICIENCY.md` §4. Compiled by Lane
  TC6, landed by Lane TE6 under the chair's delegation.
- **First citing members:** `HB-0` and `HB-1`, the two members of the `hb-1`
  train, both of which carry this file's landed SHA-256 in their headers.
- **Volume:** HB — the habit-conditioning owner-amendment program.
- **Extraction source:** `docs/DESIGN_FP_ARCH_HB.md`, read at code-of-record
  `6784bf62`. Every law below is a quotation or a compression of that volume;
  this file invents nothing.
- **Compiled against base:** `claude/composite-r4` @ `6784bf62` (capsule
  `docs/implementation/BASE_STATE.json` stamped `152d3f19`, admissible — §P8).
- **Citation law:** a member packet cites this file BY SHA-256 in its header. An
  edit here re-stamps every citing packet, so drift between a family's members
  and their shared law is structural rather than merely discouraged.

---

## §P0 · THE VOLUME'S OWN STANDING WARNING, RESTATED FIRST

> ⚠⚠ **"LANDED" IN THE HB VOLUME'S HEADER NAMES THE *DOCUMENT*, NOT THE CODE.**

The HABIT volume is ARCHITECTED, NOT BUILT. Measured by Lane TC6 at `6784bf62`:
**zero files under `src/` carry `habit` in their name** (executed: `find src -iname "*habit*"`
→ 0). Module PRESENCE never promotes a wave; several modules the volume names are already
in `src/` because they are pre-existing MODIFY targets.

**THE J-WR-13 STOP BINDS EVERY HB WAVE.** The volume carries eighteen self-recorded
refutations (R1–R18) and states: *"an implementer finding a further overstatement STOPS
before building on it."* **Lane TC6 found five more at `6784bf62`** (§P1). The rule that
produced all of them is the volume's own:

> ⛔ **BEFORE ANY SITE ROW SAYS LEARN, THE WAVE BRIEF EXECUTES A FOUR-IDIOM SCAN OF THE
> NAMED SYMBOL'S OWN BODY AND QUOTES THE RESULT.** A site that answers ZERO on all four
> idioms is not a chooser, whatever the seam sentence says about it.

**LIVE CODE OUTRANKS EVERY TABLE IN THE VOLUME. Navigate by SYMBOL, never by line number** —
every line number in the volume is an evidence anchor, not an address. Executed
corroboration: the WC volume's C1 row cites `enumerateMoves` at `:634` and its re-export at
`:1360`; measured at `6784bf62` they are `:637` and `:1366`. **Addresses moved, symbols did
not.**

## §P1 · THE FIVE HB-ERA REFUTATIONS THIS PREAMBLE ADDS (R19–R23)

Nothing in any HB packet may build on the left column.

**R19 — "HB-0 makes HB the FIRST `src` RIDER of `bandedStock`." REFUTED AT `6784bf62`.**
The volume's R3 measured *"`grep -rn "from '.*bandedStock.js'" src/` returns ZERO hits.
`decayTowardNeutral` is consumed only by tests."* **MEASURED NOW: TWO src importers.**
`src/domain/worldPulse/secondOrderBelief.js:53` — `import { HALF_LIFE_BANDS, halfLifeWeeksOf }
from './bandedStock.js';` — and `src/domain/worldPulse/dispositionLedger.js:51` —
`import { decayTowardNeutral, bandCrossingReceipt } from './bandedStock.js';`.
**WHAT SURVIVES, AND IT IS THE PART THAT MATTERS:** J-HB-3's SUBSTANCE — ride
`decayTowardNeutral`, never author a sixteenth fork — is *strengthened*, because the family
now has proven src riders rather than none. **WHAT DIES IS ONLY THE PRIMACY FRAMING.** No HB
packet, module header, or ledger row may claim "first rider". ⚠ A wave that ships that
sentence ships a naked claim the doc gate can red and a reader can disprove in one grep.

**R20 — "HB-0 is the FIRST CONSUMER of `SEVERITY_LADDER`." CONFIRMED, AND IT CARRIES A
TRAP THE VOLUME NAMES BUT DOES NOT PRICE.** MEASURED: `SEVERITY_LADDER` has ZERO src
consumers — the only two non-declaring hits (`secrecyTradeFactor.js:86`,
`brokerageServices.js:495`) are JSDoc prose. **THE TRAP:**
`tests/lint/spBandFamilies.walker.test.js` asserts
`expect(filesSpelling(SEVERITY_LADDER)).toEqual([FAMILY_HOME])` where `filesSpelling` is
`new RegExp("['\"\`]" + rung + "['\"\`]")` over **RAW source** across a full walk of `src/`
(`.js|.jsx`), with `FAMILY_HOME = 'src/domain/worldPulse/bandFamilies.js'`.
⛔ **ANY HB `src` FILE THAT SPELLS `'glancing'`, `'telling'`, `'grave'` OR `'ruinous'` AS A
QUOTED LITERAL — INCLUDING INSIDE A COMMENT OR JSDoc — REDS THAT WALKER.** The scan has no
`codeOnly()` (the §33-ruling-3 defect class, here in its *narrower*-than-claim direction).
**THE BINDING CURE:** severity weights are indexed off the imported ladder via
`severityRankOf`, never keyed by a spelled rung. The volume's §3b `SEVERITY_W =
{ glancing: …, telling: …, grave: …, ruinous: … }` is a READING AID, not an authoring
instruction — unquoted object keys evade the regex but restate a vocabulary the registry
already answers, which J-HB-25 forbids independently.

**R21 — "`settlementStrategy`'s local `martialMoves` Set is a THIRD hand-maintained copy of
the move vocabulary; retire it to `STRATEGY_MOVES`." REFUTED — IT IS NOT A COPY, AND THE
RETIREMENT AS WRITTEN IS A BEHAVIOUR CHANGE.** MEASURED at `settlementStrategy.js:801`:

```js
const martialMoves = new Set(['defend', 'hold', 'deploy', 'sue_for_peace', 'credit', 'missionize', 'prestige', 'opportunity']);
```

**EIGHT members — a PROPER SUBSET of the eleven**, deliberately excluding `reroute`,
`embargo` and `legitimacy`, all three of which ARE emitted moves (MEASURED,
`scoringObjective.js:79-93`). Its one consumer is a semantic guard, not a totality check:

```js
if (D.martialInAggressiveness === true && martialMoves.has(move)
  && !(move === 'sue_for_peace' && termination)) {
  // Martial history already entered this move through computeAggressiveness.
  // Record that single consumption here; never multiply the bar by it again.
  addReason(move, 'martial', D.martial);
}
```

⛔ **RETIRING AN 8-MEMBER PREDICATE TO AN 11-MEMBER TOTALITY MAKES `martialMoves.has(move)`
TRUE FOR THREE MOVES THAT DELIBERATELY DO NOT CARRY A MARTIAL REASON**, adding a
`dispositionReasons` entry wherever `D.martial !== 1`. That is live behaviour on the
estate's most contended chooser, the same-seed goldens red, and the implementer reads the
red as an error somewhere else — **precisely the R7 failure mode this volume already
documents once.** **THE CORRECTED ACT (CR-HB1-R21):** the set becomes a NAMED DERIVED SUBSET
exported from the new leaf (`MARTIAL_HISTORY_MOVES`), pinned ⊂ `STRATEGY_MOVES` with its
three exclusions asserted BY NAME. Drift prevention is preserved; behaviour is not touched.

**R22 — "`CHARTERED_VOLUME_PREFIXES` is ELEVEN; `HB` is the TWELFTH and the first
`CPL-*.HB-*` row REDS until the prefix joins." REFUTED — `HB` IS ALREADY CHARTERED.**
MEASURED, `tests/domain/couplingRegistry.test.js:92`:

```js
const CHARTERED_VOLUME_PREFIXES = Object.freeze(['WR', 'TR', 'GR', 'WF', 'POP', 'IN', 'INT', 'SP', 'CW', 'ES', 'WY', 'HB']);
```

**TWELVE, with `HB` present.** The volume's R5 and chair question Q4's blocking premise are
both stale. Q4's *substance* (does HB earn a prefix / does it need an eighth
`LAYER_PATTERNS` family) survives; **its "one array member, one new leaf, same commit" cost
is ALREADY PAID.** Executed: `grep -rn "\.HB-" src/ tests/` → zero rows, so no HB coupling
row exists yet and the prefix is reserved-but-unused.

**R23 — THE REGISTRATION OBLIGATION THE VOLUME NEVER PRICES, AND IT BINDS EVERY HB WAVE
THAT MINTS A `src/domain/worldPulse/**` LEAF.** See §P4. The volume prices the *coupling
row* (Q4) and never prices the *inclusion ratchet*, which fires four waves earlier.

## §P2 · THE HAZARD DISPOSITIONS THAT ALWAYS APPLY

| # | Hazard | Standing disposition for every HB wave |
|---|---|---|
| H-A | **Severity-rung spelling** (R20) | No quoted rung literal in any HB `src` file, comments included. Index off `SEVERITY_LADDER` via `severityRankOf`. Focused proof: `tests/lint/spBandFamilies.walker.test.js`. |
| H-B | **Decay singularity** (§8.1 row 1) | No HB module may contain a second `Math.pow(0.5, …)`. MEASURED context: 18 `Math.pow(0.5` sites exist in `src/` today; HB adds none and rides `decayTowardNeutral`. |
| H-C | **Weeks, never ticks** (R10 / J-HB-17) | Every stamp is `worldState.calendar.elapsedWeeks`. A write that cannot resolve the clock writes NOTHING — never a `0`. Binds HB-2+; HB-0's curve takes `ageWeeks` as a parameter and reads no clock. |
| H-D | **`enumerateMoves` is the denominator** | Any claim about the strategy-move set is proved against the EMITTER, never against a hand list. |
| H-E | **Un-anchored negatives** (OQ §31 ruling 2) | See §P3 — mandatory, per file, before any member declares green. |
| H-F | **Derive, don't restate** (J-HB-25 / J-HB-27) | ⛔ A walker constant that restates something the registry already answers is a build STOP. The cure is the query. |
| H-G | **Two spellings of one fact** (R13 / the arity-uniqueness lesson) | A symbol carrying two dispositions, or two arities, is a RED. Where the volume itself carries two spellings, the packet resolves it explicitly and records the resolution — it never picks one silently. |
| H-H | **Naked-claim doc debt** | Since `32f4e520` the naked-claim debt is PER-CLAIM: a new claim in any `docs/**.md` mints a new key and can red a GREEN test the ratchet cannot absorb. Every HB packet sentence that states a figure carries its executed receipt inline, and no HB document spells a phrase in `tests/docs/enforcement-claims.test.js`'s `CLAIM_RE` without a resolvable `@enforced-by` tag within three lines. |
| H-I | **CHECK-GIT-FIRST** | Mandatory on every shared file. The war lane's files (`settlementStrategy`, `settlementPolitics`) are the estate's most contended; the wave serializes against any in-flight war wave. |

## §P3 · THE §31 ANCHOR PREFLIGHT — MANDATORY, PER NEW TEST FILE

OWNER_DECISION_QUEUE §31 ruling 2 is law: *"every new acceptance file runs the
negative-assertion anchor walker focusedly BEFORE its member proof is declared green."*
BOTH prior trains' first terminal gates red on this one class.

**MEASURED MECHANISM** (`tests/lint/negativeAssertionAnchor.walker.test.js`, executed read):

```js
const ceilingFor = (file) => FROZEN_UNANCHORED_NEGATIVES[file] ?? READMITTED_GENERATION_FACING[file] ?? 0;
```

⛔ **A NEW TEST FILE HAS CEILING ZERO IN EVERY TREE**, `tests/domain/` and `tests/lint/`
included. `SCAN_ROOTS = ['tests']`; the scanned matchers are
`not.toContain | not.toMatch | not.toHaveProperty`.

**TO COMPLY**, one of:
1. route through `tests/helpers/anchoredNegatives.js` (`expectPresentThenAbsent` /
   `expectAbsentWithAnchor`) **called by name on the same line** — an alias or wrapper is
   not recognised; or
2. carry `// anchored: <why this cannot go vacuous>` on the assertion line **or the line
   immediately above it**. ⚠ For a multi-line comment only the LAST line counts.

**THE PREFLIGHT COMMAND** (bare, in-shell, never piped):

```
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?
```

## §P4 · THE REGISTRATION TEMPLATE — MANDATORY AT FULL STRENGTH (OQ §35.3)

**The coupling-registration TEMPLATE GAP is at INSTANCE FIVE** and OQ §35.3 graduates it to
a structural cure. Until that machine check lands, **every HB packet that mints a row in a
registration file names, EXPLICITLY AND BY PATH: the ROW, the HEAD RE-EXPORT (or the reason
none exists), the EXACT-LIST/EXACT-COUNT PIN, and the REGISTRY TEST PATH.** A packet that
names fewer than four is defective on its face.

**THE HB-SPECIFIC INSTANCE, MEASURED AT `6784bf62` (R23).** Two instruments fire on any new
`.js` under `src/domain/worldPulse/**` or `src/domain/spatial/**`, both in
`tests/lint/couplingInclusion.walker.test.js`:

```js
const CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//;   // the walk RECURSES into subdirectories
const ARGUED_ROSTER_CEILING = 13;      // asserted with toBe(), EXACT — not <=
const UNLAYERED_BASELINE_CEILING = 179; // asserted with toBe(), EXACT
```

and the census arm:

> *"a NEW unlayered module REDS — it must get a family, an argument, or the baseline"* …
> *"If it GREW, that is the edit DESIGN_FP_ARCHITECTURE.md forbids outright: a new .js
> under src/domain/worldPulse or src/domain/spatial takes a LAYER_PATTERNS home or an
> ARGUED_UNLAYERED entry with a written reason in the same commit, **NEVER a baseline
> row**."*

⛔ **THE BASELINE DOOR IS CLOSED.** MEASURED: no HB filename matches any of the seven
`LAYER_PATTERNS` families. **Therefore every HB substrate leaf takes an `ARGUED_UNLAYERED`
entry and RAISES `ARGUED_ROSTER_CEILING` BY EXACT EQUALITY IN THE SAME COMMIT.** This is
already the chair's ruling at HB Q4's corollary (*"The habit SUBSTRATE leaves take
ARGUED_UNLAYERED rows on the exact argument already carrying four entries — `bandFamilies`,
`bandedStock`, `lawWord`, `magicWorksAt`"*); the preamble supplies the price the volume
omitted.

**THE FOUR NAMED PARTS, for this instance:**

| Part | Address |
|---|---|
| THE ROW | `ARGUED_UNLAYERED['<new leaf path>'] = { kind: 'substrate', reason: <over 20 chars>, reads: Object.freeze([]) }` in `tests/lint/couplingInclusion.walker.test.js` |
| THE HEAD RE-EXPORT | **NONE, and the absence is the argument.** A substrate leaf that took a re-export through a layered head would acquire that head's port and red `expect(LAYER_OF.has(module)).toBe(false)`. Recorded so the absence is a decision, not an omission. |
| THE EXACT-LIST PIN | `ARGUED_ROSTER_CEILING`, raised by exactly the number of rows added, in the same commit — `toBe()`, both directions |
| THE REGISTRY TEST PATH | `tests/lint/couplingInclusion.walker.test.js` |

**THE `reads` FIELD IS OUTBOUND-ONLY and is MEASURED, never asserted.** A substrate entry
declares its exact set of **LAYERED** imports; the walker recomputes it from
`layeredImportsOf` and reds on drift in both directions, and any non-empty `reads` also
owes a `readsReason`. An HB leaf that imports only `bandedStock` / `bandFamilies` /
`lawWord` / sibling HB leaves — **all argued-unlayered, none in `LAYER_OF`** — measures
`reads: []`; one that reaches a layered module declares it by name. **The executor
RE-MEASURES rather than copying this sentence.**

## §P5 · THE GATE-READING LAW

- **Never read a gate through a pipe.** `npm run check | tail` reports the PIPE's status and
  has greenwashed red gates twice. Use `npm run check:tail`, or
  `sh scripts/gate-tail.sh <command...>`.
- ⛔ **NEVER wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires
  and self-deadlocks; **exit 3 is the mutex giving up, NOT a red.** Run `check:tail` bare
  from a fresh shell with `; echo TRUE_EXIT=$?`.
- **Trust no exit status you did not capture.** Every focused battery ends
  `; echo TRUE_EXIT=$?`, in-shell, unpiped.
- **A ZERO-COUNT ABSENCE PHRASE SUBSTRING-MATCHES A NON-ZERO ONE.** A gate line reporting a
  count ending in zero contains the shorter zero-count spelling as a substring, so a naive
  `includes()` reads a large failure count as success. Any absence claim over gate output
  runs the exact anchored expression instead.
- **Per-file `tsc` is a vacuum.** Both TypeScript ratchets are named with their config AND
  their window (the two-typechecker receipt law).

## §P6 · MUTANT HYGIENE

- Every load-bearing conjunction gets an executed `cp`/`cmp` mutant plus a
  `scripts/mutation-coverage-manifest.json` entry. ⛔ **Never re-serialize that manifest** —
  append the row by hand; a re-serialization is a whole-file diff nobody can review.
  ⚠ MEASURED: a `kind: 'mutation'` entry claims a label that must also exist in
  `scripts/mutation-sweep.sh`, joined one-to-one in BOTH directions, so a planted sweep
  mutation is a TWO-FILE edit and a wave that has not declared the sweep script takes a
  `kind: 'rationale'` entry instead. `kind: 'uncovered'` is shrink-only and is never the
  answer for a new file.
- **A COUNT MUTANT ON A LITERAL GOES VACUOUS.** Mutate the DERIVATION, never the recorded
  number.
- **Restore digest-exact.** The post-mutant tree is `cmp`-identical to the pre-mutant tree,
  proved, not assumed.
- **Guard-the-guard is not optional in this family.** The volume mandates it at four named
  places (the registry partition audit, the `'fortify'` re-insertion plant, the Bands-line
  plant on a NONE-BY-DESIGN wave, the odds-ratio reachability assertion). **A complete
  partition that audits clean is the precondition for every absence claim below it.**
- **A redundant guard subsumes the first.** Where two guards could cover one behaviour,
  the mutant must convict the specific one under test.

## §P7 · STANDING STOP CONDITIONS

An HB executor STOPS and reports — never invents, never renegotiates — on any of:

1. **A further overstatement** in the volume (J-WR-13), including any of R19–R23 recurring
   in a wave brief.
2. **The deleted per-probability pin** (`p'_i/p_i` inside `(1∓s)`) appearing in any brief.
   It is FALSE and reds on the design's own intended state (R16). The invariant is on
   PAIRWISE ODDS RATIOS.
3. **A size budget exceeded.** A wave that needs more lines than it DECLARED stops; it does
   not renegotiate the baseline mid-flight.
4. **An OSR movement.** Any change to the observed-shape-reader finding count. The scan's
   `--write` THROWS on eleven governed paths and a detector change is a SCHEMA MINT with
   its own docket. ⚠ `package.json` and `package-lock.json` are governed paths — a
   dependency bump is a mint trigger.
5. **An unclassified fork** discovered in `src/domain` (the chooser-totality STOP law).
6. **A `**Bands:**` line owed by a wave declared NONE BY DESIGN**, or a tuning value
   authored outside `HABIT_TUNING`.
7. **A governed-path move** where the packet declared none.
8. **Porcelain surprise.** Foreign WIP in a manifest file: stop, report, preserve.

## §P8 · CAPSULE ADMISSIBILITY AND THE RE-EXECUTION LAW

`docs/implementation/BASE_STATE.json` is stamped `152d3f19`. **EXECUTED BY LANE TC6:**
`git merge-base --is-ancestor 152d3f19 HEAD` → true; `git diff --name-status 152d3f19 HEAD`
→ **one commit, five files, all under `docs/implementation/`** (`BASE_STATE.json`,
`INDEX.md`, `PACKET_MANIFEST.json`, `PACKET_STANDARD.md`, `packets/infrastructure/GAP-1.md`).
No measured path moved. **The capsule's `consumptionLaw` docs-only-descendant clause is
SATISFIED and its figures are citable AS EXECUTED at `6784bf62`.**

⛔ **THE CAPSULE COVERS THE UNTOUCHED BASE, NEVER THE WAVE'S OWN SURFACE.** Every row an HB
manifest touches is RE-EXECUTED.

⚠ **THE CAPSULE'S `hotFiles` BLOCK IS INCOMPLETE AT `6784bf62` AND THE GAP IS KNOWN.** It
carries three files and omits `convergence.js`, which OQ §32 ruling 3 added to the standing
hot-file list. The capsule HOT_FILES parse fix is queued as an infra micro-act at OQ §35.3.
Corroborating measurement: the same `Linter` harness returns **0** for
`src/components/OutputContainer.jsx` (a JSX parse failure, not a real zero), which is the
same defect. **Every HB packet measures its own hot files and cites neither capsule row.**

## §P9 · THE FAMILY'S MEASURED SUBSTRATE (executed at `6784bf62`; re-execute what you touch)

Effective lines by the ENFORCER (eslint `Linter`, `max-lines` with `skipBlankLines: true,
skipComments: true`) — **never `wc -l`, never inherited, including from this document**:

| File | Effective | Ceiling | Headroom |
|---|---|---|---|
| `src/domain/worldPulse/settlementStrategy.js` | **812** | 812 (`scripts/.size-baseline.json`, tolerance-ZERO both directions) | **0 — ABOVE FAILS, BELOW DEMANDS RATCHET-DOWN** |
| `src/domain/worldPulse/settlementPolitics.js` | 560 | 800 (domain layer) | 240 |
| `src/domain/worldPulse/scoringObjective.js` | 50 | 800 | 750 |
| `src/domain/worldPulse/convergence.js` | **798** | 800 | **2 — hot file, OQ §32 ruling 3** |
| `src/domain/worldPulse/mobilizationReactions.js` | 200 | 800 | 600 |
| `src/domain/worldPulse/bandFamilies.js` | 41 | 800 | 759 |
| `src/domain/worldPulse/bandedStock.js` | 100 | 800 | 700 |
| `src/domain/worldPulse/lawWord.js` | 9 | 800 | 791 |

`scripts/.size-baseline.json` holds **15 keys**; of the HB-relevant files only
`settlementStrategy.js` is baselined. New HB leaves are governed by the plain domain-layer
ceiling of 800 and take **no** baseline entry unless they exceed it — and one that does is a
STOP, not an entry.

**The frozen vocabularies HB consumes verbatim and never re-spells:**
`HALF_LIFE_BANDS` = `['a_season','a_year','a_few_years','a_decade','a_generation']` ·
`SEVERITY_LADDER` = the four-rung SP-6b outcome ladder, imported and never spelled ·
`LAW_WORDS` = `['balanced','lawful','lawless']` ·
`ENGAGEMENT_MOVES` = `['engage','hold','screen','withdraw']` (the shape template for
`STRATEGY_MOVES`; `convergence.js` is a **read-only reference** and no HB wave edits it) ·
`decayTowardNeutral(value, neutral, ageWeeks, band)` — **the signature demands WEEKS.**

## §P10 · BINDING DESIGN-LAW CITATIONS

- `docs/DESIGN_FP_ARCH_HB.md` — the volume. §1 model · §2 flags · §3a–3g mechanisms ·
  §4 waves · §6 judgments · §7 chair questions · §8 seams.
- `docs/DESIGN_FP_ARCHITECTURE.md` — §1 laws L1–L9, §3 flag law, §5 wave order, §9 seam
  matrix, §10 protocol **BIND VERBATIM**.
- `docs/DESIGN_WAR_RULINGS_ARCHITECTURE.md` §1/§10 — the canon behind both.
- `docs/DESIGN_FP_ARCH_WC.md` §4.1 — the HB↔WC collision contracts C1 (move vocabulary),
  C2 (believed doctrine), C3 (law-band modulation table). **C1 binds HB-1 directly.**
- `docs/OWNER_DECISION_QUEUE.md` §28 (build-efficiency law), §31 (the anchor preflight and
  the by-figure census-red rule), §34 (the HB Q1 narrowing), §35 (the pivot to `hb-1`),
  §36 (the eight signed CR-HB items).
- `docs/DESIGN_BUILD_EFFICIENCY.md` §2 (trains), §3 (capsule), §4 (this preamble's charter).
- **L1 — no wave edits `pulseKernel.js` or `applyWorldPulse.js`** (banked, zero headroom).
- **THE PROMISE** — a seed is a starting world forever; lived history is immutable; tuning
  is owner-SIGNED. Habit is LEARNING-AS-STATE: frozen owner-signed formulas gaining one
  persisted input, never weight-FUNCTION mutation.

## §P11 · WHAT EVERY HB PACKET STILL CARRIES ON ITS OWN

Per DESIGN_BUILD_EFFICIENCY §4, a citing packet carries **only**: scope and boundary; the
behaviour/identity contract; the exact manifest with budgets; acceptance cases (denominator
≤ 8); wave-specific mutants and hazards; and the line citing this preamble BY SHA-256.
**A preamble edit re-stamps every citing packet, so drift is structurally impossible.**
