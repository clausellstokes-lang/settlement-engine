# Surveyor Chat / SC-1A+B — ephemeral text shell and typed proposal card

- **Status:** READY
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `2c810d167d016302e641fc9cfe74fff57475b14e`
- **Last revalidated:** 2026-08-09 at the verified base
- **Depends on:** NONE
- **Collision group:** serialize with any edit to `SurveyorDoor.jsx`, `InterpretApplyPanel.jsx`, or new `src/components/surveyor/*Chat*` / `*Proposal*` files
- **Commit authority:** edits only; manager commits
- **Baseline posture:** at the verified base, the focused command in §10 passed 3 files / 26 tests; the repository-wide gate was not run while compiling this packet, so any wave-end red requires a verified-base failure-identity comparison

This READY status applies only to the independently sealed subset below. It does
not declare all of design wave SC-1 ready or complete.

## 1. Reconciled authority

1. The 2026-08-09 handoff in `docs/DESIGN_AI_CHAT_SURFACE.md` allows only a bounded text-intent shell and shared-card seam.
2. `SurveyorDoor` remains THE ONE DOOR: entitlement, focus trapping, route selection, and destination state stay there.
3. Design §§0.5, 2, and 5 SC-1.w1/w2 require an upward-growing text composer and a reusable proposal-card presentation.
4. Live code proves that `routeDoorPrompt` is already the pure fore-stage, while `InterpretApplyPanel` owns the only typed-operation approve/edit/reject row.

Resolved contradictions:

- “Build SC-1” is narrowed to this ephemeral substrate. Threads, persistence, final conversation rendering, retirement, and totality remain later packets.
- The design's audience toggle cannot move to the shell yet: `AiAnalystPanel` and `InterviewPanel` separately own audience state, while workshop write destinations have no audience contract. That owner/state-authority decision is BLOCKED and excluded.
- The design's new chat approval lane cannot emit operations: `'ai'` provenance remains reserved and migration 138 is unconfirmed. Direct chat consumption of `ProposalCard` is BLOCKED and excluded.
- `CustomContentPanel`, `AutonomyPanel`, and `CorpusFactoryPanel` have different review records and writers. This packet extracts only the compatible typed-op card from `InterpretApplyPanel`; it does not claim those UIs share a contract.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** the entitled Surveyor marker opens a responsive, full-width text-intent shell with a transient user-turn log and bottom-anchored auto-growing composer; submission still routes through the unchanged `routeDoorPrompt` into the unchanged destination panels, and typed ops in `InterpretApplyPanel` render through one shared `ProposalCard` without changing review or apply behavior.

**Definition of done:** all eight-or-fewer cases in §9 pass, the current entitlement/focus/routing and protected-consent tests remain green, and no provider, canon writer, persisted state, audience state, or destination vocabulary changes.

In scope:

1. Replace only the door's prompt-slip presentation with an ephemeral text-intent shell.
2. Extract the existing typed-op review row into a controlled shared card consumed by `InterpretApplyPanel`.
3. Add source guards against a second router/provider surface and a second typed-op action trio.

Explicit non-goals:

- No audience toggle/header state, analyst/interview request changes, or player-safe write semantics.
- No new chat-originated proposals, `'ai'` provenance, operation-log work, migration 138, or other migration.
- No uploads, folders, images, documents, audio, transcription, buckets, SC-2, or SC-3.
- No durable threads/history, account export/delete, legal/privacy copy, pricing, paid-policy, or entitlement changes.
- No `corpus` routing, totality walker, task-menu/suggestion chips, two-register answer integration, copy controls, route retirement, redirects, or workshop-panel folding.
- No attempt to convert custom-content, autonomy-nudge, or corpus-candidate review cards.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` — bounded Surveyor UI substrate |
| New persisted record families | `0` |
| New named state writers | `1` — shell-local transient draft/log |
| Feature flags | `0` |
| User-facing surfaces | `1` — existing Surveyor door |
| Direct consumers | `2` — door consumes shell; apply panel consumes card |
| New logic-bearing production leaves | `2` |
| Existing logic-bearing production files modified | `2` |
| Additional registration-only files | `0` |
| Handwritten files total | `7` |
| New/changed effective production lines | `<=400` |
| Effective lines per new leaf | `<=200` |
| Added delta in either existing logic file | `<=15`, excluding deletion of moved JSX |
| Acceptance cases | `8` |

Overrides approved before dispatch: NONE.

## 4. Preflight

Run before any edit:

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 2c810d167d016302e641fc9cfe74fff57475b14e HEAD
git diff --quiet -- src/components/surveyor/SurveyorDoor.jsx src/components/surveyor/InterpretApplyPanel.jsx tests/components/surveyorDoor.test.jsx
test ! -e src/components/surveyor/SurveyorTextIntentShell.jsx
test ! -e src/components/surveyor/ProposalCard.jsx
test ! -e src/styles/surveyorChat.css
test ! -e tests/components/surveyorProposalCard.test.jsx
rg -n 'export default function SurveyorDoor|openDestination|routeDoorPrompt' src/components/surveyor/SurveyorDoor.jsx
rg -n 'function OpCard|ops\.map|applyAccepted' src/components/surveyor/InterpretApplyPanel.jsx
```

Expected: branch is `claude/composite-r4`; ancestry succeeds; manifest targets are
clean; CREATE targets are absent; required symbols resolve. Foreign dirt must
match `docs/implementation/INDEX.md` and must not overlap this manifest. Any
mismatch makes the packet STALE; stop before coding.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Entitlement authority | `src/components/surveyor/useSurveyorEntitled.js` | `useSurveyorEntitled` | Door is absent when not entitled | Preserve through `SurveyorDoor` |
| Route authority | `src/domain/intent/doorRouter.js` | `routeDoorPrompt` | Pure, zero-network destination/scope classifier | Call only from `SurveyorDoor`; do not edit |
| Destination writer | `src/components/surveyor/SurveyorDoor.jsx` | `openDestination` | Sole owner of `dest` and remount `nonce` | Preserve destination shapes and close-on-route |
| Context reader | `src/components/surveyor/useSurveyorContext.js` | `anchorLabel` | Existing visible route/store-derived scope | Pass unchanged to `AnchorChip` |
| Viewport authority | `src/hooks/useIsMobile.js` | default `useIsMobile` | Shared reactive 640px breakpoint | Import this hook; create no second width listener |
| Shell writer | new `SurveyorTextIntentShell` | local `draft`, `turns`, `nextTurnId` | Transient for current mounted door only | Never lift to store or send as history |
| Review writer | `src/components/surveyor/InterpretApplyPanel.jsx` | `decide` | Sole owner of decision map | Card emits a next decision; caller closes over index |
| Canon writer | same | `applyAccepted` | Existing reviewed ops reach existing command boundary | Card never imports or calls it |
| Test precedent | `tests/components/surveyorDoor.test.jsx` | door contract suites | Pins entitlement, routing, anchor, focus | Extend this shape |
| Test precedent | `tests/components/surveyorInterpretApplyPanel.test.jsx` | protected/apply cases | Pins consent barrier and real writer | Must pass unchanged |

Forbidden alternatives:

- No second door, router, provider transport, store slice, persistence family, feature flag, or canon writer.
- Do not modify `doorRouter.js`, `AiAnalystPanel.jsx`, `InterviewPanel.jsx`, `SurveyorWorkshop.jsx`, `operations.js`, `operationRegistry.js`, copy tables, Supabase files, migrations, or account/legal files.
- Do not touch reserved `scripts/lib/reader-shape-scan.mjs` or `tests/lint/readerShapeResolver.test.js`.
- No file outside §7.

## 6. Exact contracts

### `SurveyorTextIntentShell`

```js
SurveyorTextIntentShell({
  open,
  dialogRef,
  anchorLabel,
  onClose,
  onRoute,          // (trimmedText) => routedObject | null
  onOpenAnalyst,
  onOpenInterview,
  onOpenWorkshop,
})
```

- It is presentational routing UI, not a door: it must not import `routeDoorPrompt`, any provider/client transport, store module, destination panel, or operation registry.
- Local state is exactly `draft: string` plus insertion-ordered `turns: Array<{id:number,text:string}>`; ids come from a component-local monotonic ref starting at 1. No clock, UUID, random draw, persistence, or replay field.
- `SurveyorDoor` always mounts the shell while the door itself is mounted and passes `open={promptOpen}`; it must not conditionally unmount the shell when closed. Route success appends one trimmed user turn, clears the draft, and permits `SurveyorDoor` to close it. Close/reopen preserves draft/log; door unmount/reload clears both.
- Empty/whitespace input is absence: Send is disabled and Enter is a no-op. `null` is never stored.
- The log has `role="log"`, chronological DOM order, newest last, and displays only user text under existing `surveyorDoor.youAsked` copy. It must not fabricate an assistant turn, receipt, audience, proposal, or route success claim.
- Reuse the existing heading, close label, anchor chip, route hint, route label, and three promptless destination callbacks.
- The textarea has one-row minimum and 144px maximum. On each draft change set height to `0px`, then to `min(scrollHeight, 144)px`; use `overflow-y:auto` only at the cap. The composer is the last flex child, so its bottom edge stays fixed and its top edge rises.
- Desktop (`useIsMobile() === false`): Enter submits; Shift+Enter inserts a newline. `isComposing` Enter never submits.
- Mobile (`useIsMobile() === true`): Enter always inserts a newline; only the Send button submits. Render as a bottom sheet.
- While open on mobile, compute keyboard inset as `max(0, round(innerHeight - visualViewport.height - visualViewport.offsetTop))`; update on `visualViewport` `resize` and `scroll`, remove both listeners on close/unmount, and use zero when the API is absent. Apply only as a CSS custom property.

`SurveyorDoor.route(text)` trims once, returns `null` for absence, otherwise
computes `routed = routeDoorPrompt(q)`, calls the existing destination writer
with `routed` and `q`, and returns `routed`. Destination ids, scope, staged prop
names, nonce behavior, and promptless callbacks remain byte-for-behavior equal.

### `ProposalCard`

```js
ProposalCard({
  id,              // required stable DOM/test id, caller passes `op-${index}`
  op,              // existing typed op; never mutated
  labels = {},     // optional approve/edit/dismiss accessible-copy overrides
  protectedFlags,  // optional array; when absent use op.protectedFlags
  decision,        // controlled existing decision object
  onDecide,        // (nextDecision) => void; no index argument
})
```

- Defaults are exactly `Approve this op`, `Edit this op`, and `Reject this op`; “dismiss” maps to existing internal action `'reject'` and does not rename domain enums or analytics.
- Preserve `operationLabel(op.opType)`, raw `opType`, params rendering, classification badge/tone, protected badge, `identityConsentNote(op)`, and existing consent sentence.
- Action normalizes to `pending` unless it is `approve | edit | reject`. Every event shallow-copies the controlled decision and changes only its own field.
- Edit displays the existing op-type input and emits `action:'edit'` plus `editedType`. Consent emits only `consented:boolean`; it does not approve.
- The card performs no compile, validation, apply, analytics, charge, persistence, or provider call.
- `InterpretApplyPanel` imports it, removes only the nested `OpCard`, and passes `id`, `op`, `decision`, `protectedFlags`, and `onDecide={(next) => decide(i, next)}`. All surrounding apply logic is untouched.

Lifecycle: all new shell data is component memory only. It is not persisted,
reloaded, regenerated, undone, imported, migrated, exported, or projected.
Entitlement remains the public veil. No new receipt kind or audience field exists.

Alignment is ENGAGED through the existing `AnchorChip`. The edit story remains
the existing controlled decision followed by the separate `Apply accepted ops`
command; the protected-consent barrier remains authoritative.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| CREATE | `src/components/surveyor/SurveyorTextIntentShell.jsx` | default component and local viewport helper | `<=180` | Implement only the transient shell contract above; import `useIsMobile` from the verified authority |
| CREATE | `src/components/surveyor/ProposalCard.jsx` | default controlled card | `<=120` | Move the typed-op row behavior without semantic changes |
| CREATE | `src/styles/surveyorChat.css` | `.sf-door-panel--chat` and child classes | `<=60` | Desktop centered width `min(760px, calc(100vw - 32px))`; mobile bottom sheet; no JS semantics |
| MODIFY | `src/components/surveyor/SurveyorDoor.jsx` | imports, `route`, prompt-slip JSX | `+15` | Keep ownership; replace slip markup with shell wiring and import its CSS through the shell |
| MODIFY | `src/components/surveyor/InterpretApplyPanel.jsx` | imports, nested `OpCard`, `ops.map` | `+8` | Delete moved JSX and wire shared card only |
| TEST | `tests/components/surveyorDoor.test.jsx` | shell/composer cases plus existing suites | n/a | Prove A1–A5 without weakening old assertions |
| CREATE | `tests/components/surveyorProposalCard.test.jsx` | card behavior and source guards | n/a | Prove A6–A8 |

Generated artifacts: NONE. No other file may be edited.

## 8. Ordered coding sequence

0. Run preflight; stop on mismatch.
1. Run the 26-test focused baseline from §10 and record its exit/count.
2. Add failing A1–A5 to `surveyorDoor.test.jsx` and A6–A8 to the new card test.
3. Implement `SurveyorTextIntentShell.jsx` and its CSS; no other component owns its local state.
4. Replace only the prompt-slip block in `SurveyorDoor`; keep route and destination ownership there.
5. Extract `ProposalCard`; then wire only `InterpretApplyPanel`.
6. Add the two source guards in A8.
7. Run focused verification.
8. Run the wave-end gate and produce §12's receipt.

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main route | entitled door; analyst question; click Send | one trimmed user turn is recorded, shell closes, analyst gets exact question | `surveyorDoor.test.jsx` |
| A2 | Existing write route | style prompt | workshop gets unchanged `style` stage and exact prompt | same |
| A3 | Absence | empty and whitespace draft | Send disabled; no destination/log append | same |
| A4 | Keyboard/growth | desktop Enter, Shift+Enter, composing Enter; stubbed `scrollHeight` above/below 144 | only plain desktop Enter submits; newline paths do not; height clamps exactly | same |
| A5 | Mobile/focus/privacy | mocked mobile + visualViewport; existing entitlement and Escape cases | Enter does not submit; inset updates/cleans up; non-entitled renders nothing; focus restores | same |
| A6 | Card decisions | one inferred op; click approve/edit/reject and edit type | visible labels/type/params; exact controlled next decisions; source op unchanged | `surveyorProposalCard.test.jsx` |
| A7 | Protected integration | protected typed op through real `InterpretApplyPanel` fixture | consent UI/note survive; unchecked op remains blocked; checked approved op applies through existing writer | new card test plus existing interpret test |
| A8 | Prevention guards | scan Surveyor component sources | only `SurveyorDoor.jsx` imports/calls `routeDoorPrompt`; only `ProposalCard.jsx` contains all three typed-op action labels; shell contains no forbidden transport/store imports | new card test |

This table is the complete edge-case denominator. Do not add a cross-product.

## 10. Verification commands

```sh
# Recorded base baseline: exit 0, 3 files / 26 tests at verified SHA
sh scripts/gate-mutex.sh --run -- npx vitest run tests/components/surveyorDoor.test.jsx tests/components/surveyorInterpretApplyPanel.test.jsx tests/domain/doorRouter.test.js

npx eslint src/components/surveyor/SurveyorTextIntentShell.jsx src/components/surveyor/ProposalCard.jsx src/components/surveyor/SurveyorDoor.jsx src/components/surveyor/InterpretApplyPanel.jsx tests/components/surveyorDoor.test.jsx tests/components/surveyorProposalCard.test.jsx
npm run typecheck:ratchet
npm run typecheck:domain:strict
sh scripts/gate-mutex.sh --run -- npx vitest run tests/components/surveyorDoor.test.jsx tests/components/surveyorProposalCard.test.jsx tests/components/surveyorInterpretApplyPanel.test.jsx tests/domain/doorRouter.test.js tests/build/surveyorPanelsLazy.test.js tests/design/deepCraftKillList.test.js
npm run verify:dist
npm run check:tail
```

Expected: focused commands and both typechecks exit 0; existing router values,
protected/apply tests, lazy-chunk membership, deep-craft budget, and dist gate stay
green. If the wave-end full gate is red, compare its failure identities with an
integrity-counted verified-base archive; no new identity is allowed. Report which
`&&` stages actually ran. Never pipe a gate.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if implementation requires:

- editing a destination panel, router cue/destination, provider/client request, store slice, copy table, entitlement, operation registry/provenance, migration, or persistence path;
- defining how audience applies to write destinations or moving audience state into the shell;
- rendering a new chat-originated proposal or consuming `ProposalCard` from chat;
- converting any non-typed-op review UI to `ProposalCard`;
- keeping two modal focus traps open at once, or embedding a destination panel inside the shell;
- changing apply, consent, charge, analytics, command, lazy-import, or first-paint behavior;
- exceeding a manifest/budget, raising a baseline, or repairing a foreign failure.

Report the smallest contradiction and proposed next packet; do not broaden this one.

## 12. Completion receipt

- Base SHA and final working-tree/commit state:
- Exact changed files and effective-line deltas:
- A1–A8 results:
- Focused commands, exits, file/test counts:
- Both typecheck configurations:
- Base and wave-end gate stages/failure-identity diff:
- Entitlement/focus/protected-consent regression result:
- Lazy bundle / first-paint / `verify:dist` result:
- Generated artifacts: NONE
- Deviations: NONE or STOP
- Out-of-scope observations, without investigation:
- Judgment calls: NONE
