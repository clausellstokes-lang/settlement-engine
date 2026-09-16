# Corpus coverage / AO-0 — five authoritative prose seams become observable

- **Status:** LANDED
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `7f231662fea6c80aa66fd62de30083f9a816f255`
- **Last revalidated:** 2026-08-13 at schema-8 genesis
  `e71beb84355666fe5508f61c0f9acdc516a97b79`
- **Landed:** 2026-08-13 — code half
  `3df85a3aa33b60be5983ebede63375d8d0fae8f5`, schema-8 genesis
  `e71beb84355666fe5508f61c0f9acdc516a97b79`; do not redispatch.
- **Depends on:** H26 code half `d081feee29288af58ec3eaf6cf513c0904c15b65`,
  schema-7 genesis `98729f7978613a6365af09aca44e01e9cf4c6b37`, terminal flip
  `7f231662fea6c80aa66fd62de30083f9a816f255`, and CR-AO-1..10 in the ledger.
- **Collision group:** `observed-shape-schema-mint`; no other lane may touch an
  observed-shape governed input until the pair lands.
- **Commit authority:** coding edits exactly ten handwritten paths and does not commit
  or generate the baseline. The coordinator alone proves and lands the ten-path code
  half followed by the one-path generated schema-8 genesis.
- **Census receipt:** the whole five-tuple was re-derived unchanged at
  `2409/365/2044/19960/5635`. AO-0 is terminal and the reservation is free.
- **Baseline posture:** schema 7 is green at 1,998 reads / 1,412 identities / 387 files,
  including 44 explained-writer reads in 31 tagged rows. The default corpus is 1,321
  shapes / 8,637 origins / 14,650 transitions. The lighting census is
  `2409/365/2044/19960/5635`.

## 1. Measured boundary

The post-H26 compile proof at detached commit `a4e206501b343e6f9ce93ad55e403fd0d18bb1ee`
(direct parent the verified base) established the only lawful shape of this mint:

- the default OSR corpus, topology, metadata, inventory, and detector controls remain
  byte-identical;
- a second, opt-in scalar consumer observes one shipped seam from each of five prose
  families without entering `foldCorpus`, the default scan artifact, or the baseline;
- the real projection contains 26,076 scalar rows and reproduces canon 1; Wizard News
  final 240 / accumulated 1,567 / 272 unique; pulse history 12; regional log 109 / 109
  unique; and AI Chronicle 1;
- the twelve compatibility shapes carrying `source` are `causes`, `changes`, `charter`,
  `evidence`, `garrison`, `incomeSources`, `institutions`, `magicDef`, `mercenary`,
  `site`, `walls`, and `watch`;
- schema 7 to 8 is inventory-same-only: 1,412 same rows and zero new, increased,
  decreased, or gone rows, preserving 1,998 / 1,412 / 387;
- the exact code-half red set is one assertion: the persisted governed baseline says
  schema 7 while code says schema 8. All other 182 tests in the six focused files pass.

The rejected prototype put canon and Chronicle roots into `foldCorpus`; it removed 179
governed identities and made existing detector controls vacuous. Those objects are
evidence only and are forbidden landing inputs.

## 2. Scalar projection contract

Add:

```js
scalarObservationsOf(roots, { fields, maxDepth = 64 })
```

Each row is exactly:

```js
{
  root: string,
  rootOrdinal: number,
  path: Array<
    { kind: 'field', value: string }
    | { kind: 'index', value: number }
  >,
  value: null | boolean | number | string,
}
```

Rules:

1. Root order is caller order; `rootOrdinal` is the zero-based global caller position.
2. Object fields use code-unit order; array indexes ascend and retain their original
   positions. Equal roots, paths, and values remain duplicated.
3. Paths are root-relative typed segments. A selected container emits every eligible
   primitive descendant without flattening its address.
4. Selected `undefined`, non-finite number, bigint, function, symbol, or non-plain record
   fails. Unselected malformed optional leaves are isolated. Cycles and depth overflow
   always fail because either would truncate traversal.
5. Volatile keys are excluded at every selected depth: `appliedAt`, `createdAt`,
   `editedAt`, `id`, `time`, `timestamp`, and `updatedAt`. Arrays are not compacted.
6. `fields` is validated before producer imports or execution; it is an array of unique,
   nonblank strings. An empty array is the topology-only no-op.
7. `foldCorpus` is unchanged.

`buildObservedCorpus({ intervals, quiet, scalarFields = [] })` omits both
`scalarObservations` and `scalarMeta` when the list is empty. With fields supplied, it
adds exactly those two properties. Removing them from the opt-in result must produce an
object deeply equal to a separately executed default result.

The closed selected-field vocabulary is:

```text
cause channelType headline impactKind kind mode narrativeSummary reason reasons scope
summary summaryText tags thesis triggeredBy type
```

## 3. Five authoritative seams

1. **Timeline:** after all pulses, call `prepareAuthoritativeCanonEvent` once on the
   first canonical save with deterministic `CUT_TRADE_ROUTE`, fixed `now`, and empty
   input log. Require `ok === true` and one `nextEventLog` row. This root is scalar-only.
2. **Wizard News:** observe accumulated `pulseResult.wizardNews.entries` across all 12
   pulse roots and the final ring. Require 1,567 accumulated rows, 272 unique IDs, final
   index 239 present, and the established 53-home denominator.
3. **Pulse history:** observe the final shipped `worldState.pulseHistory`, length 12.
4. **Regional log:** consume the already-produced
   `pulseResult.regionalGraph.eventLog`; never call another propagation producer.
   Require 109 rows and 109 unique IDs.
5. **Chronicle:** call pure `createChronicleEntry` then `appendChronicleEntry` once with
   deterministic prose inputs. Observe the returned `aiData.chronicle[]`-shaped array;
   its random ID and wall clock are excluded. This root is scalar-only.

`scalarMeta` carries exactly the live anti-vacuity counts. Flat flavor-event records and
`campaign.chronicles[]` remain deferred because their shipped road needs AI prose,
wall-clock, persistence, analytics, and store state.

## 4. Schema-8 contract

Set `BASELINE_SCHEMA = 8`, retain a literal retired schema-7 constant, preserve
`validateSchema7Baseline`, and add `validateSchema8Baseline`. Schema 8 keeps the exact
numeric inventory and sparse authenticated `rowTags` grammar of schema 7.

The migration table gains only strict `8: 7`. The schema-8 detector transition changes
exactly:

1. `scripts/check-observed-shape-readers.mjs`
2. `scripts/lib/observed-shape-baseline.mjs`
3. `scripts/lib/observed-shape-corpus.mjs`
4. `scripts/migrate-observed-shape-readers.mjs`

The governed detector universe remains eleven paths. The other seven entries are
byte-identical; types, modes, scan/source trees, scan config, and the unscanned-input
digest remain unchanged. Subject and scanner bind the immutable code-half SHA. Every
inventory row plus one scanner-transition decision is accepted and noted.

Target 8 has a stronger production invariant than generic reviewed migration: canonical
target inventory must equal the schema-7 predecessor byte-for-byte, every reconciliation
row is `same`, and new/increased/decreased/gone are all zero. Review cannot waive this.
Mutants for all four motion classes must fail before issue or review construction.

## 5. SCW-1b and item (a)

Update all five hand-edit instructions in `check-observed-shape-readers.mjs`:

1. `ratchetMessage`;
2. deleted/moved stale row;
3. GONE stale identity;
4. decreased stale identity;
5. generated baseline `_doc`.

Every instruction directs a clean committed tree through governed `--write`, says rows,
totals, identities, and tags are re-derived together, and forbids hand-editing generated
JSON. Replace the stale header comment that describes lowering/deleting a row by hand.
Replace item (a)'s old four-shape claim with the measured twelve-shape list in §1.

## 6. Exact change manifest

### Code half — exactly ten handwritten paths

| Action | Path |
|---|---|
| MODIFY | `scripts/check-observed-shape-readers.mjs` |
| MODIFY | `scripts/lib/observed-shape-baseline.mjs` |
| MODIFY | `scripts/lib/observed-shape-corpus.mjs` |
| MODIFY | `scripts/migrate-observed-shape-readers.mjs` |
| TEST | `tests/lint/observedShapeCorpus.graph.test.js` |
| TEST | `tests/lint/observedShapeBaseline.test.js` |
| TEST | `tests/lint/observedShapeMigration.test.js` |
| TEST | `tests/lint/observedShapeReaders.walker.test.js` |
| TEST | `tests/lint/observedShapeSentinel.test.js` |
| TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` |

### Genesis — exactly one generated path

| Action | Path |
|---|---|
| MODIFY | `scripts/.observed-shape-readers-baseline.json` |

No `src/**`, package, lockfile, dependency, golden, flag, tuning, timeout, floor,
ceiling, second baseline, or new test/title/file may move.

## 7. Atomic 10+1 lifecycle

This packet expressly authorizes one coordinator-owned two-commit landing because the
generated baseline must bind the immutable code-half SHA. This is packet-local plumbing,
not a reusable exception.

1. Dispatch and seal AO-0 at the clean promotion HEAD; capture validator, plain OSR,
   focused baseline, topology, census, and target cleanliness.
2. Apply only the ten handwritten paths and build a private-index code commit parented
   directly to the sealed HEAD without moving the branch ref.
3. In a fresh detached worktree, prove the sole deliberate red is schema 7 versus 8;
   every other focused assertion is green.
4. Generate fresh scan, report, review, and bundle at that exact SHA. Accept and note
   all 1,412 same rows plus the scanner transition. Any inventory motion stops.
5. Run the reviewed `--write --migrate-schema=8`; prove only the baseline JSON changed;
   create the one-path genesis commit parented to the code half. Never squash.
6. From a fresh detached genesis, run all focused suites, exact-path ESLint, both
   typecheck ratchets, plain OSR, and bare `npm run check:tail`; every exit is zero.
7. Copy the exact pair bytes into the shared worktree and use one old-value CAS from the
   sealed promotion HEAD to genesis. A ref move discards the pair and restarts.
8. Neutralize only the eleven stale shared-index paths after proving the cached set.

## 8. Acceptance matrix

| ID | Required observation |
|---|---|
| A1 | caller-root order, global ordinals, code-unit fields, original indexes, typed paths, duplicates, deterministic replay |
| A2 | selected malformed values, cycles, depth, volatile descendants, and invalid options fail as specified; empty option isolates the default |
| A3 | five seams reproduce canon 1, News 240/1,567/272/53, history 12, regional 109 unique, Chronicle 1, and 26,076 rows |
| A4 | all five SCW messages plus stale comment use governed-write language; item (a) records the exact twelve shapes |
| A5 | schemas 4–7 remain executable and retired; schema 8 is live with numeric inventory and exact sparse tags |
| A6 | strict 7→8 is 1,412 same and zero motion, exact four changed detector inputs, seven unchanged, unchanged scan/source/unscanned controls, and one reviewed transition |
| A7 | exact ten-path code half has only the schema pin red; 1,413 decisions are accepted/noted; one-path genesis clears it |
| A8 | census, six suites, lint, both typechecks, plain OSR, and the bare 17-step gate pass before one CAS with no unrelated motion |

## 9. Verification

```sh
npm run validate:packets
npx eslint \
  scripts/check-observed-shape-readers.mjs \
  scripts/lib/observed-shape-baseline.mjs \
  scripts/lib/observed-shape-corpus.mjs \
  scripts/migrate-observed-shape-readers.mjs \
  tests/lint/observedShapeCorpus.graph.test.js \
  tests/lint/observedShapeBaseline.test.js \
  tests/lint/observedShapeMigration.test.js \
  tests/lint/observedShapeReaders.walker.test.js \
  tests/lint/observedShapeSentinel.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/observedShapeCorpus.graph.test.js \
  tests/lint/observedShapeBaseline.test.js \
  tests/lint/observedShapeMigration.test.js \
  tests/lint/observedShapeReaders.walker.test.js \
  tests/lint/observedShapeSentinel.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js
npm run check:observed-shape-readers
npm run check:tail
```

## 10. Mandatory STOPs

Stop for the smallest contradiction if any seam count differs; another producer or
`src/**` edit is needed; scalar data enters `foldCorpus`, default artifact, baseline, or
ordinary meta; default topology differs from 1,321 / 8,637 / 14,650; volatile ID/time
data leaks; selected malformed, cycle, or depth refusal weakens; the detector transition
is not exact four-of-eleven; scan/source/config/unscanned inputs move; schema reconciliation
has any non-same row; code-half failures exceed the sole schema pin; a baseline byte is
hand-authored; more than ten handwritten or one generated path moves; a title/file/census,
ceiling, budget, timeout, floor, golden, dependency, flag, or tuning value moves; the ref
moves; CAS fails; or the genesis gate is nonzero. No speculative repair or partial mint.

## 11. Executed landing receipt — 2026-08-13

- Promotion and seal: sealed HEAD
  `91f6827713fd0d31be6b933c03c1b58ef8184f1e`; seal integrity
  `4091c19c3b05d52d045a9539f32ffba15f4ef812fda2cbe04911fb55bb600a60`.
- Code half: `3df85a3aa33b60be5983ebede63375d8d0fae8f5`, exactly the ten
  handwritten paths in §6, `+877/-112`. Per-path additions/deletions in §6 order:
  `25/18`, `34/16`, `227/12`, `116/38`, `85/1`, `36/5`, `230/8`, `102/5`,
  `18/9`, `4/0`.
- Genesis: `e71beb84355666fe5508f61c0f9acdc516a97b79`, exactly the generated
  baseline JSON, `+45/-44`, parented directly to the code half. One old-value CAS moved
  the branch from the sealed promotion to this genesis; all eleven shared-index paths
  were then neutralized exactly.
- Default corpus and scalar proof: default topology stayed
  `1321/8637/14650`; the opt-in consumer observed 26,076 scalar rows. Seam receipts were
  canon `1`; Wizard News `240/1567/272/53`; pulse history `12`; regional log
  `109/109`; Chronicle `1`. The twelve source-bearing shapes remained `causes`,
  `changes`, `charter`, `evidence`, `garrison`, `incomeSources`, `institutions`,
  `magicDef`, `mercenary`, `site`, `walls`, and `watch`.
- Schema-8 migration: `1998/1412/387`; all 31 explained-writer tags still bank
  44 reads. Reconciliation was exactly 1,412 same and zero new, increased, decreased,
  or gone; all 1,413 decisions were accepted and noted. Artifact/report/review/bundle
  digests were respectively
  `51de033c575251b034b47e00f2457020c8079b6bec608e9f91953d41fadb40cb`,
  `53da69540b68d3985dd0ab8982472958526832520bf4ff4091c4bea099221629`,
  `78f475448981d455e066fbc017a1942029375e97235e554a9885d243baa3fada`, and
  `fc5acbb55c80d393e3c1e32dc182bde89c5286b50d082dc34085493dc4eae9bf`.
  Scanner-transition digest:
  `2407c3b278e39df2e49a3c42cf4dfd19232bee80867350f25845e83cc162c268`.
- Verification: the code half passed 182/183 with only the compiled schema pin red;
  the genesis passed all six focused files, 183/183. Exact-path ESLint passed; typecheck
  ratchets remained `173/173` and `1134/1134`; plain OSR matched 1,998 exactly; the
  whole lighting census remained `2409/365/2044/19960/5635`. Bare
  `npm run check:tail` exited 0, including the 27,956-test / 2,359-file source phase,
  fresh build, and strict 50-file / 403-test dist phase with zero non-runs.
- Acceptance: A1–A8 passed. New test titles/files: zero. Deviations: **NONE**.
  Judgment calls: **NONE**.
