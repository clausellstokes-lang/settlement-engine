# BRAND-MINT — the brand derivatives' mint record re-minted on its own stack, 2026-11-10

Seat BRAND-MINT, a cure seat and a child of the chair session `session_01FbPLbejcfwX5nii12VM673`; this seat's
session `session_01FbPLbebsq8291ignDriipi`. Lane `lane/brand-mint-2026-11-10`, cut from
`lane/integration-2026-11-07` at **ef3142ff3**.

**The red.** `tests/build/brandDerivatives.test.js`: 41 tests, 3 failed. The failures are "ARM B — every input the
derivation reads is the input the record was minted over" and the two PLANT tests that stand on it. The sole drift:
`scripts/ai-media-provenance.json: minted 243224ac7b2e, tree d9dfbd030fac`. The register gained twelve rows at
c53d6175e (the Compendium landing's tile crops). The register is a declared input of
`scripts/derive-brand-marks.mjs`, and `tests/fixtures/brand-derivatives.mint.json` pins the whole file's digest.
The record's door, `--record`, refuses on linux/x64 because sharp's prebuilt libvips encodes different bytes there.

## The premise, proved first (Phase 0)

| question | measurement | result |
|---|---|---|
| does the red reproduce at the tip? | `sh scripts/gate-tail.sh npx vitest run tests/build/brandDerivatives.test.js` at ef3142ff3 | 41 tests, **3 failed**, exit 1 |
| which register did the record mint over? | sha256 of `scripts/ai-media-provenance.json` at each commit that touched it | **2b2882b61**: 243224ac7b2e…2543, the record's digest exactly; c53d6175e: d9dfbd030fac (the tip) |
| can the twelve rows reach an output? (execution, linux/x64 sharp 0.35.3 vips 8.18.3) | `--out` twice: once from a scratch tree that held the minted register (every other input identical), once from the tip | **10 of 10 outputs byte-identical**; the worktree stayed clean |
| which rows does the derivation open? (reading) | `derive-brand-marks.mjs`: the register is read at one site, `register.assets[rel]` inside `emit()`, keyed by the file being written; `buildXmpPacket(rel, row)` takes only that row | rows exist only for `public/brand/seal.png` and `public/brand/plaque.png`, and both are byte-equal JSON in the minted and tip registers. The register diff is 12 added rows (`public/backgrounds/compendium/*.webp`), 0 removed, 0 changed, plus its summary counts |

So the art did not move; the record is stale only because an input it pins was edited.

## The workflow (M1, M4)

`.github/workflows/brand-mint.yml`, commit 15abbf2a2. It runs on `workflow_dispatch` and on pushes to
`lane/brand-mint-**` only, with `permissions: contents: read`, no secrets and no write-back. Its steps:

1. checkout, then setup-node from `.nvmrc` with the npm cache, then `npm ci`;
2. print the host signature beside the record's `mintedOn`;
3. run `node scripts/derive-brand-marks.mjs --record`;
4. run `git status --porcelain` and `git diff --stat`, failing on any change but the record;
5. print the record's sha256 and its base64 between two marker lines;
6. upload the record as an artifact.

The same commit adds one header line to the script beside "Re-mint:", naming the workflow. The line went in
before the mint on purpose: the script is itself a pinned input, so the mint had to cover it. `ci.yml` is untouched.

## The runs

| run | event, label | outcome |
|---|---|---|
| [42760980917](https://github.com/clausellstokes-lang/settlement-engine/actions/runs/42760980917) | push, `macos-14` | **cancelled** about 1 s after creation: `runner_id` 0, runner group empty, no steps, MACOS 0 ms billed, log HTTP 404, check-run output (title, summary, text) empty |
| [42761658250](https://github.com/clausellstokes-lang/settlement-engine/actions/runs/42761658250) | workflow_dispatch (the chair's first further try), `macos-14` | **cancelled** the same way: job 129648516643, `runner_id` 0, `runner_group_name` "", 0 ms billed, about 1 s |
| [42761721217](https://github.com/clausellstokes-lang/settlement-engine/actions/runs/42761721217) | push of baf012e31 (`runs-on: macos-latest`, the chair's second try, that line alone) | **ran**: runner group "GitHub Actions", every step green; **the minting run** |
| [42761986221](https://github.com/clausellstokes-lang/settlement-engine/actions/runs/42761986221) | push of b8dc947cc (the record), `macos-latest` | **ran**, every step green; the re-mint changed nothing |

**Why the `macos-14` jobs were cancelled.** Asked of the job, run and check-run records via the GitHub tools,
nothing names a reason: no spending-limit text, no runner group, no approval. That is an empty answer, quoted as
empty. The same account ran `macos-latest` seconds later, so whatever refuses `macos-14` is specific to that
label. Its cause is not measured.

**The minting run's log, read rather than trusted (M2):**

```
host signature:   {"platform":"darwin","arch":"arm64","sharp":"0.35.3","vips":"8.18.3"}
record mintedOn:  {"platform":"darwin","arch":"arm64","sharp":"0.35.3","vips":"8.18.3"}
SIGNATURE MATCH
[derive-brand-marks] minted tests/fixtures/brand-derivatives.mint.json on darwin/arm64 (sharp 0.35.3, vips 8.18.3): 6 inputs, 10 outputs
 M tests/fixtures/brand-derivatives.mint.json
 tests/fixtures/brand-derivatives.mint.json | 4 ++--
300942ffffb52afb9e6eac62f11884bb9a43185c7c837da826a9dea5a6842d83  tests/fixtures/brand-derivatives.mint.json
```

The `--record` step exited 0. That door refuses on any shipped-byte mismatch, so on the minting stack all ten
committed files reproduce byte for byte. The record was decoded from the log's base64 and written byte for byte;
the local sha256 is 300942ff…2d83, equal to the log's. Commit b8dc947cc.

## The record's diff, entry by entry

| field | before | after |
|---|---|---|
| `_doc` | — | unchanged |
| `mintedOn` | darwin / arm64 / 0.35.3 / 8.18.3 | **unchanged** |
| `inputs["scripts/derive-brand-marks.mjs"]` | d2ecad3d7a66… | **ca4a29ee77a8…** = sha256 of the script at the lane tip (the M4 header line) |
| `inputs["scripts/inject-ai-provenance.mjs"]` | 0a903b70bec3… | unchanged |
| `inputs["scripts/ai-media-provenance.json"]` | 243224ac7b2e… | **d9dfbd030fac…** = sha256 of the register at the tip |
| `inputs["public/brand/arrow/arrow-strip.webp"]` | 427f9d98fb9a… | unchanged |
| `inputs["public/fonts/Lora-Bold.ttf"]` | 87946e964402… | unchanged |
| `inputs["public/fonts/Lora-Regular.ttf"]` | e23dd6917ca7… | unchanged |
| `outputs` (all ten, sha256 and bytes, in order) | — | **unchanged**, entry for entry |

Two input entries changed, not one. The brief expected one; the chair ruled the second (the script's own header
line) correct, since the edit landed before the mint so the mint covers it.

## Gates

| gate | result |
|---|---|
| `sh scripts/gate-tail.sh npx vitest run tests/build/brandDerivatives.test.js tests/build/aiMediaProvenance.test.js` | **70 of 70, exit 0**: brandDerivatives 41/41, aiMediaProvenance 29/29. ARM C reports it compared DIMENSIONS on linux/x64, by design; 4 of 10 derivatives were byte-identical here anyway |
| `sh scripts/gate-tail.sh npx vitest run tests/lint tests/scripts --maxWorkers=2` | exit 1: 11 failed / 3220 passed of 3231 (7 of 224 files). **Every red is red at the base ef3142ff3**, measured in a base worktree over the same seven files: 11 failed / 84 passed, file for file and count for count: domainAnyCastBaseline (1), ledgerCitationIntegrity (load error), newsHeadlineContract (2), observedShapeReaders (4), proseFamilyContract (3), proseRegisterLoaders (1), provenanceMap (load error). None is this lane's. The citation roster's walkers run after this record and its bump: sourceCitationIntegrity + recordRegisterTotality + styleLaw, 45/45, exit 0 |
| eslint on touched JS (`scripts/derive-brand-marks.mjs`) | 0 |
| `git diff --stat ef3142ff3 HEAD -- public src` | **empty** |

## CONFIRMED against PLAUSIBLE

- CONFIRMED (execution): the twelve new register rows cannot reach the ten brand outputs. Both derivations were
  byte-identical, 10 of 10.
- CONFIRMED (the minting run's log): the minting host's signature equals `mintedOn` exactly; `--record` exited 0;
  only the record changed.
- CONFIRMED (local): the committed record is byte-identical to the run's (sha256 300942ff…); `outputs` and
  `mintedOn` are unchanged; both changed input digests equal the files at the lane tip.
- CONFIRMED: `macos-14` jobs on this account were cancelled before any runner was assigned (two runs, 0 ms
  billed), and `macos-latest` ran.
- PLAUSIBLE, not measured: why `macos-14` is refused. GitHub's records name no reason.
- CONFIRMED (a second minting run): the push of b8dc947cc started
  [42761986221](https://github.com/clausellstokes-lang/settlement-engine/actions/runs/42761986221) (`macos-latest`).
  Its signature matched again, `--record` exited 0, and `git status --porcelain` printed **nothing**: the committed
  record is a fixed point of its own door, as the script's header promises (sha256 300942ff… again).

## What stays

- `.github/workflows/brand-mint.yml` stays as the house's tool for the next AI-media registration. After that
  registration, push a `lane/brand-mint-**` branch (or dispatch the workflow), read the log, and commit the record
  from it. Re-minting no longer needs anyone's laptop.
- The workflow's comment block still says `macos-14`; only `runs-on` moved (the chair's ruling: that line alone).
  The door, not the label, decides the stack.
- Not this seat's: the register's rows, the crops, the art, the derivation's logic, and any other red.
