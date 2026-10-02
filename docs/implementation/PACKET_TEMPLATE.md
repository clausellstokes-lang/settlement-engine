# `<SUBSYSTEM> / <WAVE>` — implementation contract

> Copy this file. Remove instructions that do not apply; do not leave bracketed
> choices in a READY packet.

- **Status:** `DRAFT | READY | BLOCKED | LANDED | STALE | SUPERSEDED`
  — the VALUE ALONE. Every stamp, caveat, condition and date goes on the
  continuation lines beneath this row: the parser anchors the status at
  end-of-line and takes it only when exactly one row matches, so an appended
  clause parses as nothing and the packet refuses against its own manifest.
  The same rule binds **Verified base**.
- **Packet version:** `<integer>` — bumped by EVERY change to this body,
  including a repair, a re-point or one word. Prose that says "version N
  changed X" names the TRUE prior number, or the sentence is reworded. The
  coordinator's placement stamp is not the body and bumps nothing.
- **Verified base:** `<branch>` at `<full SHA>` — under a parallel train this is
  THIS packet's OWN lane branch at the train base's SHA, stamped at placement.
- **Preamble:** `<path>` at SHA-256 `<measured at your read tip>` — MEASURED,
  never copied from a brief or a sibling packet.
- **Last revalidated:** `<date and SHA>`

  — the THIRD stamp. The coordinator's placement writes `Status`, `Verified base`
  and this row; a re-placement RE-STAMPS this row too, so a re-placed body does not
  keep the previous version's date. Nothing reads it, which is exactly why it drifts.
- **Depends on:** `<exact landed SHAs or NONE>`
- **Collision group:** `<shared files/waves that must serialize or NONE>`
- **Commit authority:** `<edits only; manager commits | agent may commit exact manifest>`
- **Baseline posture:** `<measured green or exact inherited rows; never assumed>`

## 1. Reconciled authority

1. `<newest owner ruling>`
2. `<canonical contract or constitution>`
3. `<durable design sections used for intent>`
4. `<current code and receipt evidence>`

Resolved contradictions:

- `<old statement>` -> `<current ruling and evidence>`

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** `<one sentence>`

**Definition of done:** `<finite outcome>`

In scope:

1. `<one primary behavior>`
2. `<one required integration>`
3. `<one prevention guard, if applicable>`

Explicit non-goals:

- `<adjacent wave>`
- `<tuning, soak, golden, migration, UI, or cleanup exclusion>`
- Record adjacent discoveries in the receipt; do not investigate or repair
  them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families | `0 or 1` |
| Named state writers | `0 or 1` |
| Feature flags | `0 or 1` |
| User-facing surfaces | `0 or 1` |
| Direct consumers | `<=2` |
| New logic-bearing production leaves | `<=2` |
| Existing logic-bearing production files modified | `<=3` |
| Additional registration-only files | `<=3` |
| Handwritten files total | `<=12` |
| New/changed effective production lines | `<=400` |
| Effective lines per new leaf | `<=250` |
| Delta in a shared/hot file | `<=15` |
| Acceptance cases | `<=8` |

Overrides approved before dispatch: `NONE | <exact limit and reason>`.

Exceeding any limit is a STOP and split, not an invitation to renegotiate.

## 4. Sealed dispatch and preflight

Run from the packet's worktree before any edit:

```sh
npm run implementation:dispatch -- <ID>
```

Expected:

- exact packet Markdown and structured capsule are emitted;
- verified-base ancestry and unchanged declared substrate are proven before the
  seal pins exact HEAD;
- non-CREATE targets are clean, CREATE targets absent, and required symbols resolve;
- Git-visible foreign dirt is fingerprinted without target overlap, and the seal
  lives outside project files in Git administrative storage.

Any mismatch makes this packet STALE. Stop before coding.

Edit only exact-manifest paths. Sealed `check:packet` writes atomic per-step
receipts and heartbeats without treating liveness as success. `implementation:resume`
reuses evidence only on exact HEAD, authority, foreign-work, and target fingerprints;
target edits stale evidence, while other drift is a STOP. This lifecycle never
creates/deletes worktrees, stages, commits, merges, restores, cleans, infers affected
tests, or automates semantic line-budget rulings.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| State authority | `<path>` | `<symbol>` | `<fact>` | Reuse; no parallel state |
| Sole writer | `<path>` | `<symbol>` | `<fact>` | Only mutation path |
| Reader | `<path>` | `<symbol>` | `<fact>` | Required projection |
| Normalizer/absence | `<path>` | `<symbol>` | `<fact>` | Extend or preserve |
| Lifecycle | `<path>` | `<symbol>` | `<fact>` | Required round trip |
| Receipt/audience | `<path>` | `<symbol>` | `<fact>` | Reuse vocabulary and veil |
| Test precedent | `<path>` | `<test/symbol>` | `<fact>` | Copy this proof shape |

Forbidden alternatives:

- no second graph, ledger, classifier, time source, PRNG stream, or writer;
- no new top-level `worldState` key unless explicitly specified below;
- no direct edits to `<forbidden files/symbols>`;
- no files outside the manifest.

## 6. Exact contracts

### Inputs and outputs

```js
// Exact signature and return shape. Include failure/absence result.
```

### State schema

```js
// Exact persisted or transient shape, bounds, and optionality.
```

Absence rules:

- absent: `<meaning>`
- empty: `<meaning or forbidden>`
- `null`: `<meaning or forbidden>`
- invalid legacy input: `<fallback or rejection>`

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| `<state>` | `<input>` | `<guard>` | `<state>` | `<kind>` |

### Ordering and precedence

- Pipeline/tick position: `<exact host and before/after relations>`
- Same-tick visibility: `<exact rule>`
- Merge/replace/deduplicate: `<exact rule>`
- Tie-break: `<stable rule>`

### Determinism

- Hash/fork key: `<exact spelling or NONE>`
- Stable enumeration: `<exact sort/order>`
- Rounding/clamping: `<exact operation>`
- No-draw behavior: `<exact behavior>`

### Flag and dormancy

- Flag: `<exact key or NONE>`
- Gate: `<exact strict read>`
- Absent: `<behavior>`
- False: `<behavior>`
- True: `<behavior>`
- Golden posture: `<unchanged | exact authorized shift>`

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| `<rule>` | `<rule>` | `<rule>` | `<rule>` | `<rule>` | `<rule>` | `<rule>` | `<rule>` |

### Receipts and privacy

- Closed kinds: `<finite list>`
- Address chain: `<required ids>`
- Numeric-to-word bands: `<home>`
- DM-only fields: `<finite list or NONE>`
- Player/public projection: `<exact omission/redaction rule>`

### Alignment and edit story

- Alignment: `ENGAGED: <mechanism>` or
  `DECLARED EMPTY: <reason>`
- Edit story: `<existing DM verb/proposal path>` or
  `ENGINE-ONLY: <reason>`

### User-facing copy

Every string this packet adds, SPELLED — exact key, exact words, the estate's
own interpolation idiom and parameter names. `NONE` if it adds none. A build
lane never invents user-facing words.

⛔ No em dash and no exclamation point in a `src/` string literal: `tests/copy/voiceMechanics.test.js`
counts both per file and holds a file this packet CREATEs at ZERO, so a literal spelled here with an
em dash contradicts this packet's own §10. Spell the replacement (`': '` for `' — '`) here — a build
lane may not choose one — and run the walker's own counter over the planned text at compile.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `<path>` | `<exports>` | `<eff lines>` | `<instruction>` |
| `MODIFY` | `<path>` | `<symbol>` | `<+eff>` | `<instruction>` |
| `REGISTER` | `<path>` | `<registry row>` | `<+eff>` | `<instruction>` |
| `TEST` | `<path>` | `<cases>` | `n/a` | `<instruction>` |

`TEST` is for a test file that EXISTS at the verified base. A NEW test file is
`CREATE` — a non-`CREATE` row on an absent path refuses at validation, and §4
already counts that file among the absent CREATE targets. ⚠ The discriminator is
existence at YOUR base, not newness: a path a NAMED SIBLING creates before this
packet dispatches is still `TEST`, and this row names that sibling.

A row that shifts lines in a file holding a LINE-ADDRESSED register row carries
that re-address as its OWN row here, with the before -> after line numbers; path,
category and snippet stay byte-identical. Grep every line-addressed register for
every path this packet modifies, and say `none found` with the command when that
is the truth.

A row under an ENFORCER directory carries its mutation-coverage row with its own
`rowKey`; read the enforcer set at your own tip rather than recalling it.

A `CREATE` of a `.js` leaf under `src/domain` or `src/generators` carries, as its own rows, every
instrument disposition its planted text moves — measured by running each instrument's OWN logic in
plain `node`, never reasoned about: the entropy-root census's `createPRNG(` SITE COUNT as well as its
read-site arms when the leaf mints a stream; the ruin-filter roster's disposition (ROUTED or EXEMPT,
with the reason in that table's own shape) when the leaf's CODE reads `.institutions`; the goods
roster row when it imports a goods identity half-table. Each row states its figure AS A DELTA, and the
figure the arm will red with is the ARM'S OWN MESSAGE, never a number adopted by hand.

A row that REGISTERS an application command carries `tests/application/commands/commandRegistry.test.js`
as a `TEST` row — the reviewed-capability pin reds by construction — with the review sentence written in
§6. A row that edits a store dispatches by LITERAL names: the dead-operation ratchet cannot see a
computed `get()[name]` dispatch and convicts the file.

Generated artifacts: `NONE | <exact command and expected file set>`. A global
aggregate another member also moves — a whole-tree census, a producer count — is
NOT a generated artifact of this packet: state the predicted DELTA here and leave
the regeneration to the terminal.

Every register figure stated anywhere in this packet is a DELTA, never an
absolute; executed history keeps its figure and carries an as-of mark naming the
SHA it was measured at.

This table and the JSON `changeManifest` are SET-EQUAL on paths and on actions.
Compile CAPSULE-FIRST and generate the table from it; a path in one and not the
other is either an edit the seal never declared or an instruction nobody wrote.

A `_pending` block — the symbols an unlanded sibling will provide — lives at the
sibling key `_pendingRequiredSymbols`, never as an element of `requiredSymbols`:
every element needs a non-blank `path` and `symbol`, so the array form refuses
twice.

No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal the packet; stop on any preflight mismatch.
1. Capture `<named baseline/golden/dormancy evidence>`.
2. Add failing tests for acceptance cases `<ids>`.
3. Implement `<pure leaf/data contract>`.
4. Extend `<sole writer/lifecycle seam>`.
5. Wire `<consumer 1>` and then `<consumer 2>`.
6. Add `<registrations/prevention guard>`.
7. Run focused verification.
8. Run the wave-end gate and write the completion receipt.

Bounded algorithm:

```text
1. <exact step>
2. <exact branch and precedence>
3. <exact failure/fallback>
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behavior | `<fixture>` | `<observation>` | `<file>` |
| A2 | Dormant/absent | `<fixture>` | `<observation>` | `<file>` |
| A3 | Counterforce | `<fixture>` | `<observation>` | `<file>` |
| A4 | Boundary/sparse | `<fixture>` | `<observation>` | `<file>` |
| A5 | Idempotency | `<fixture>` | `<observation>` | `<file>` |
| A6 | Lifecycle | `<fixture>` | `<observation>` | `<file>` |
| A7 | Real integration | `<fixture>` | `<observation>` | `<file>` |
| A8 | Privacy/regression | `<fixture>` | `<observation>` | `<file>` |

This table is the entire edge-case budget. Omit inapplicable rows; do not add a
cross-product during implementation.

Every case names the FILE that holds it and the §7 row that authorizes that
file's edit. A case with no authorized file is homeless and this packet is
BLOCKED. The row's declared arm count, the cases homed there and §10/§12's title
delta state the SAME number; red-first plants are not `it`s and are not counted.

## 10. Verification commands

```sh
# Focused static checks
npx eslint <exact production and test files>
npm run typecheck:ratchet
npm run typecheck:domain:strict

# Focused tests: acquire the one test slot in the same command
sh scripts/gate-mutex.sh --run -- npx vitest run <exact test files>

# Named golden/dormancy proof, when applicable
sh scripts/gate-mutex.sh --run -- npx vitest run <exact oracle files>

# PRE-SEAL, before any of the above: the count prover that ships beside this
# packet. It reads the Markdown and the capsule and runs no test runner.
node <ID>.count-prover.mjs <ID>.md <ID>.manifest.json

# The browser suite, when this packet touches src/components/**, a route, a
# data-testid or an accessible name. Name the spec FILES, never the directory;
# find them with: git grep -n -F '<the name>' -- e2e
# Run only after: lsof -nP -iTCP:5173 -iTCP:5174 -sTCP:LISTEN prints nothing,
# and in a script of its own: the browser suite is an exclusive gate.
npx playwright test --project=chromium <exact e2e spec files>

# PRE-REPORT, no gate slot: the TypeScript compiler API over THIS packet's own
# src/ paths, against tsconfig.full.json's floor. eslint alone is not enough.
node <scratch>/typecheck-paths.mjs <exact src/ paths>

# The instruments a new src/domain or src/generators leaf meets, each run with
# its OWN logic in plain node at compile and through the gate at the build:
#   tests/lint/entropyRootCensus.walker.test.js   (site count AND read sites)
#   tests/lint/ruinFilterRoster.walker.test.js    (a raw .institutions read)
#   tests/build/vendorPdfLazy.test.js             (the goods ST-2 roster)
#   tests/copy/voiceMechanics.test.js             (every literal this packet spells)

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- <ID>
npm run implementation:resume -- <ID>

# Wave-end presentation-safe invocation of the authoritative npm run check; never pipe
npm run check:tail
```

Expected: every command exits `0`, except exact inherited rows listed in the
packet's baseline posture. Report actual counts; do not copy historical counts.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- the dispatch seal is missing, invalid, or belongs to another worktree state;
- a governing e2e spec, walker or ratchet reds and the packet would weaken,
  widen or skip it to pass;
- a sealed acceptance case has no file and no §7 row authorizing that file's
  edit, or the row's arm count, the matrix's homes and the title delta disagree;

- a governing instrument reds with a figure this packet did not predict (the
  arm's own message decides; a figure adopted by hand is the failure);
- a red-first's log prints no test count, or `Tests no tests` — the file did not
  load, so nothing was proved and no red may be claimed;
- resume reports authority, HEAD, foreign-work, or receipt-integrity drift;
- `<packet-specific dependency or collision>`;
- `<packet-specific forbidden shift>`;
- `<packet-specific owner or schema boundary>`.

Do not edit the packet, broaden the manifest, repair unrelated gate failures,
or continue into the next wave.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas:
- Acceptance cases:
- Focused commands, exits, and counts:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result:
- Bundle/first-paint result:
- Generated artifacts: `NONE | <list>`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
