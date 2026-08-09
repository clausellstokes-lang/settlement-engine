# `<SUBSYSTEM> / <WAVE>` — implementation contract

> Copy this file. Remove instructions that do not apply; do not leave bracketed
> choices in a READY packet.

- **Status:** `DRAFT | READY | BLOCKED | LANDED | STALE | SUPERSEDED`
- **Packet version:** `<integer>`
- **Verified base:** `<branch>` at `<full SHA>`
- **Last revalidated:** `<date and SHA>`
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

## 4. Preflight

Run from the packet's worktree before any edit:

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor <verified-base> HEAD
git diff --name-only
rg -n '<required-symbol-1>|<required-symbol-2>' <exact-files>
```

Expected:

- branch and ancestry match this packet;
- every target file is clean;
- foreign dirty files match the index's reserved list and do not overlap;
- every required symbol resolves exactly where the verified tree table says.

Any mismatch makes this packet STALE. Stop before coding.

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

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `<path>` | `<exports>` | `<eff lines>` | `<instruction>` |
| `MODIFY` | `<path>` | `<symbol>` | `<+eff>` | `<instruction>` |
| `REGISTER` | `<path>` | `<registry row>` | `<+eff>` | `<instruction>` |
| `TEST` | `<path>` | `<cases>` | `n/a` | `<instruction>` |

Generated artifacts: `NONE | <exact command and expected file set>`.

No other file may be edited.

## 8. Ordered coding sequence

0. Run preflight; stop on any mismatch.
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

# Wave-end gate; never pipe
npm run check:tail
```

Expected: every command exits `0`, except exact inherited rows listed in the
packet's baseline posture. Report actual counts; do not copy historical counts.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- `<packet-specific dependency or collision>`;
- `<packet-specific forbidden shift>`;
- `<packet-specific owner or schema boundary>`.

Do not edit the packet, broaden the manifest, repair unrelated gate failures,
or continue into the next wave.

## 12. Completion receipt

- Base SHA:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas:
- Acceptance cases:
- Focused commands, exits, and counts:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result:
- Bundle/first-paint result:
- Generated artifacts: `NONE | <list>`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
