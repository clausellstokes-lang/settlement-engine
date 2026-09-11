# SKEPTIC — §912 / lane L-MAT — LENS: THE IMPORT REMAP (car 5, `34115c7b7`; R-B) AND THE DECLARED GAP
Seat: Opus 5 — Fable-unvalidated (verifier). Dock read-only.

- Dock HEAD before = after = `7d96e2b72245fa465182d59dade31621f31ecf2c`; porcelain before = after = **0**.
- Everything below that carries a figure was executed by me in the dock (vitest, `npm run
  typecheck:ratchet`, or node probes under this directory that only IMPORT the dock's modules).
- Probes: `probe-remap.mjs`, `probe-prepare.mjs`, `probe-marker.mjs`, `probe-chain.mjs` (this dir).
  The lane's `lmat-probes/` holds only build helpers (`chunks.mjs`, `eager.mjs`, `quietbuild.sh`) —
  no roster probe was left behind, so mine are new.

---

## 1. THE TWO REMAPPERS SIDE BY SIDE

| dimension | provenance (`:107-224`) | roster (`:262-397`) | verdict |
|---|---|---|---|
| identity fields | definitionIds / revisionIds / revisionContentHashes / localUids | the same four | AGREE |
| miss policy | refuse the WHOLE record | refuse the WHOLE roster | AGREE |
| grain | per settlement (called in the Phase-4 loop) | per settlement, same loop, 20 lines below | AGREE |
| entirely-dropped | caller `delete`s the key | caller `delete`s the key (never `{}`, never `null` — the `roster:null` arm is unreachable behind `sourceRoster != null`) | AGREE |
| **input admission** | `admitSettlementContentProvenance(raw)` | none — `plainObject` + `Number.isInteger(schemaVersion)` | **DIVERGE** |
| **output re-verification** | re-admits the rebuilt candidate before returning | none | **DIVERGE** |
| **schemaVersion** | STAMPS the local constant | CARRIES the source's | **DIVERGE** |
| unknown row fields | survive `...definition` but must pass the re-admit | survive `...row` unconditionally | **DIVERGE** |
| bucket / key namespace | fixed by the receipt schema | any key the source blob names | **DIVERGE** |
| `customDefinitionVersion` | n/a | remapped when integer, dropped when unresolvable, **carried verbatim when a string** (the projection admits string versions, `customDefinitionIdentityProjection.js` `definitionVersion`) | narrow gap |

EXECUTED (`probe-remap.mjs`, P3): a source roster of
`{schemaVersion: 99, buckets: {'not-a-law-bucket': [ … sourceAccountEmail, payload … ]}}`
returns `ok:true` and is persisted with **schemaVersion 99, the invented bucket name, and both
foreign keys intact**. The refusal message this gate prints — "a living-content roster this build
cannot read" — is therefore not what the gate enforces: it admits every integer ≥ 1.

## 2. THE DEFECT THAT DEFEATS R-B'S OWN PURPOSE (resolve-or-drop collapses to drop)

`buildLivingContentRoster` → `rosterRow` admits a row on `localUid || customDefinitionId`, and
`projectCustomDefinitionIdentity` emits **every** `customDefinition*` key optionally. A definition
that lives only in the local library (never committed to the immutable ledger) therefore produces a
roster row with a `localUid` and NO `customDefinitionId` / `customDefinitionRevisionId`.

EXECUTED (`probe-remap.mjs`, P2 / P2b):

```
P2 built-from-raw roster: {"schemaVersion":1,"buckets":{"deities":[{...,"localUid":"lu_local_1","name":"Local One"}]}}
P2 remap of a real, fully-localUid-mapped roster: {"ok":false,"code":"settlement_living_content_roster_identity_incomplete"}
P2b mixed roster remap: {"ok":false,...identity_incomplete}
```

The localUid WAS in the identity map. Nothing was unresolvable — the row simply has no
account-scoped definition id to remap. The remapper reads "no identity" as "unresolved identity"
and drops the whole roster. So on a fully archive-backed move, any world whose scope included one
never-archived local definition loses its roster — the exact population R-B's ruling exists to
preserve ("a user moving their OWN estate between accounts keeps a true record").

Why the suite is green anyway: every fixture row in
`tests/lib/accountSettlementContentPortability.test.js` sets `customDefinitionId`, and the
"⭐ the REAL builder's output round-trips" arm feeds `identifyCustomContentPack(...)`, a test
helper that stamps `definitionId/revisionId/contentHash` on **every** definition. The arm that
claims to pin agreement with the real builder pins agreement with the *identified* variant only.

## 3. THE LIFECYCLE PATH NOBODY TRACED — UNDO / VERSION HISTORY

`admitRestoredLifecycle` (`accountImport.js:390-400`) restores `versionHistory` verbatim on any
array. Snapshots are whole settlements (`snapshotSettlement` = deep clone minus `versionHistory`),
so they carry `customContentRoster`. The car-5 block rewrites only
`preparedResult.entry.settlement.customContentRoster`.

EXECUTED (`probe-prepare.mjs`, A):
```
A settlement roster survives prepare: "src-secret-def"
A versionHistory length: 1 | snapshot roster id: "src-secret-def"
```
`revertToSnapshotAction` then writes `savedSettlements[idx].settlement = cloneJson(target.settlement)`
and `persistSaveUpdate(targetSaveId, { settlement: persistedSettlement, … })`. So one revert after a
correctly remapped import **re-persists the SOURCE-account roster**. The commit's headline claim —
"nothing downstream will quietly correct a foreign one" — is true; the untested inverse ("nothing
downstream quietly REINSTATES one") is false. `customContentProvenance` has the same shape of
exposure here, which is a pre-existing gap the lane also did not name.

## 4. THE DECLARED RECONCILIATION GAP — REPRODUCED, AND IT IS WIDER THAN "DECLARED"

EXECUTED (`probe-prepare.mjs`, B) with the reconciliation's own option shape
(`importedAt:null, sourceChecksum, sourceId`): the foreign roster survives `prepareSettlementEntry`
whole, source ids intact. `importReconciliationAdmission.js:570` puts that entry into
`normalizedInput`, and `importReconciliationExecution.js:53` hands `normalizedInput` to the
`import.settlement.create-and-attach` command as `params.entry`. **A foreign roster can reach
persistence TODAY through that path, with no archive and no remap.** The lane's declaration is
CONFIRMED as a real gap; what is REFUTED is the reason it was called safe (§6 below).

## 5. TESTS AND BUDGETS — EXECUTED

| run | result |
|---|---|
| `npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` | exit 0, **9 passed** |
| `npx vitest run tests/lib/accountSettlementContentPortability.test.js` | exit 0, **13 passed** |
| `npx vitest run tests/store/accountImportSlice.test.js` | exit 0, **24 passed** |
| `npx vitest run tests/lint/writerReach.walker.test.js` | exit 0, **56 passed** (35 s) |
| `npm run typecheck:ratchet` | exit 0, "no type regressions (173 error(s), ceiling 173)" |

The budgets hold EXACTLY: the walker reds on `count > ceiling` AND on `actual < ceiling`
("inventory honesty"), so green at rows 6 / 1 / 9 means the counts are 6 / 1 / 9.
⚠ But the budget proves less than the receipt implies: `BARE_NEGATIVE_RE` scans only
`not.toContain|toMatch|toHaveProperty`. Every new negative the car added is of the
`expect(...).toBe(false)` / `Object.hasOwn(...)` family, which is **out of scope by design** — so
"ZERO scanned negative sites" is true and says nothing about whether the new negatives are
anchored. Reading them: they are anchored in substance (paired positives / non-vacuity anchors).

## 6. CAR 5b — FIXED, NOT LAUNDERED (and what 173/173 means)

`git diff --stat 3b1c0eaa5..7d96e2b72` touches 12 files; **no baseline file is among them** —
`scripts/.full-typecheck-baseline.json` has zero commits in the range. That baseline holds
`total: 173` over **38 files**, and neither `src/lib/accountSettlementContentPortability.js` nor
`src/store/accountImportBody.js` has a row, so each has an allowance of ZERO and the comparison is
PER-FILE ("never `total <= baseline.total`"). 173/173 is the pre-existing repo-wide total, not a
raised ceiling. The 11 errors were cured by three JSDoc annotations and one `=== true` narrowing —
behaviour-neutral. **CONFIRMED.**

## 7. THE INERTNESS PREMISE IS REFUTED BY THE CONSIST ITSELF (the security half)

Both declared gaps (car 4's DM-full carry, car 5's reconciliation carry) are excused on one
premise, stated in `livingContentRosterPublicDrop.test.js` and in `livingContentRoster.js`'s new
header: *while the dial is dormant no world carries a roster, so nothing can reach it.* Two
independent refutations, both executed:

**(a) The importers are writers, and they are not dial-gated.** `accountImportBody.js:474` assigns
`customContentRoster` whenever the source carries one and the identities resolve; the reconciliation
path carries one with no gate at all (§4). The dial gates the GENERATOR only. The lane's own
`accountImportSlice` arm imports a settlement with `config._livingContentLawVersion: 2` and a
roster, on a dial-dark build, and asserts it lands.

**(b) A dark build can be made to MINT one, from user-supplied data.** Chain, executed in
`probe-chain.mjs` at the dock tip:
```
1 dial (shipped): 1   lit: 2
2 migrateConfig keeps marker: 2
3 isAllowedConfigKey("_livingContentLawVersion"): true
4 birthConfig marker on a DARK build: 2
5 materializesLivingContent(birthConfig): true
6 roster minted on a DARK build: {"schemaVersion":1,"buckets":{"deities":[ … ]}}
```
plus `probe-marker.mjs`: the marker survives `prepareSettlementEntry` on
`settlement.config` (and on `settlement._config`). The product hop I read rather than clicked is
`SettlementsPanel.jsx:103` — "Apply Saved Configuration & Regenerate" does
`updateConfig(migrateConfig(data.settlement._config || data.config))`. So: import an account file
carrying a lit config → load its configuration → the next birth mints a roster on a shipped
dial-dark build. Car 2 is what made this live: before the wiring the mint had no caller.

Consequences: the WRITER_DARK_REGISTER row's "no shipped world writes the key" is now a claim about
the generator only, and no clause in `writer-dark-register.mjs` checks for a SECOND writer (the
dial row's write proof is membership in a measured `dialGated` set derived from generated corpora),
so the instrument is green and blind. And a world minted this way, or imported this way, rides the
DM-full projection un-dropped — the very correlation exposure R-A cites, at a smaller audience.

## 8. WHAT I COULD NOT REFUTE (CONFIRMED for the lane)

- Per-settlement grain, miss policy, drop-with-warning wiring, and the `preparedResult.ok === true`
  nesting all mirror the provenance seam exactly (read at `accountImportBody.js:424-484`).
- The fingerprint re-derivation and the re-sort on the destination id are real, non-vacuous, and
  their tests carry anchors.
- No reader of the roster runs BEFORE the remap inside the account-import path; the pre-scrub
  `sourceSettlement` blob is used only by `restoreIntraEnvelopeWiring` (neighbour ids), which never
  touches the roster.
- `buildAccountExport` carries `savedSettlements` wholesale, so the export→import round trip the
  car guards is the real path, not a hypothetical one.
- Regen does not re-mint the roster (one writer: `generateSettlementPipeline.js:185`).
