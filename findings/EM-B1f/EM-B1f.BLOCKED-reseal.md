# EM-B1f — BLOCKED AT THE RE-SEAL. Tree deliberately left CLEAN. A chair act is owed.

Stamped `Sun Sep 20 09:08:48 EDT 2026`+. HEAD **`c127cdfb2`** (CURE-J commit 1). `git status --short` **EMPTY**.
⛔ **The patch is NOT applied, deliberately — see "why the order matters".**

## The refusal, verbatim

```
$ npm run implementation:dispatch -- EM-B1f
[implementation-session] implementation session already exists: EM-B1f
dispatch EXIT=1
```

## The deadlock, measured

| # | fact | evidence |
|---|---|---|
| 1 | The session dir from the **first** seal still exists and is keyed ONLY by packet id | `implementation-session.mjs:284` — `join(identity.gitDir, 'implementation-sessions', packetId)`; `:358` refuses if it exists |
| 2 | It is **immutable evidence** by design | `:79` `immutable session evidence already exists` |
| 3 | Its seal pins the **old** HEAD | `seal.json.payload.head = c3344683050d…` vs live `c127cdfb2…` |
| 4 | So the gate WILL refuse, before any step runs | `:425` `throw new Error('sealed HEAD or branch drifted for ' + session.id)` in `assertImplementationScope`, which `check:packet` and `implementation:resume` both call first |
| 5 | There is **no sanctioned re-seal door** | the CLI accepts exactly `dispatch <ID>` (`:630`); no rotate / archive / force / `--reseal` anywhere in `implementation-session.mjs` or `implementation-gate.mjs`; `PACKET_STANDARD.md` documents none |

⇒ `dispatch` refuses because the session exists; `check:packet` would refuse because that session is
stale. **Neither end is a lane's to open.** Rotating or removing `.git/worktrees/slot-2/implementation-sessions/EM-B1f`
is an act on immutable session evidence, and that guard exists precisely to stop a lane re-sealing
around a drift — so this lane did not touch it. ⭐ **The gate is honest: there is no false-green
risk here.** It refuses rather than verifying against a stale capsule.

## ⛔ WHY THE ORDER MATTERS — and why the patch is still unapplied

`assertTargetPreflight` (`:202-215`) throws **`non-CREATE target must be Git-clean: <path>`** for any
dirty change-manifest row, and **all thirteen of EM-B1f's rows are non-CREATE**.

⇒ **A fresh dispatch is only possible on a CLEAN tree.** Had this lane run the chair's step (2)
(`git apply --index`) before the seal succeeded, the six dirty targets would have made the re-seal
impossible until they were restored again. The tree is therefore held clean and ready.

## The routes — recommendation is the first

| route | act | verdict |
|---|---|---|
| ⭐ **1** | **Rotate the stale session aside, then this lane re-dispatches on the clean tree:** `mv "$(git -C <slot-2> rev-parse --git-dir)/implementation-sessions/EM-B1f" …/implementation-sessions/EM-B1f.sealed-at-c33446830` | ⭐ **RECOMMENDED.** A **MOVE, not a delete** — the `c33446830` seal survives intact and inspectable. Smallest act; restores the chair's own ordered sequence exactly. A chair act because it touches immutable session evidence. |
| 2 | Give the tool a sanctioned rotation: `dispatch --reseal`, archiving the prior session under its own sealed head | **THE STRUCTURAL CURE.** A branch moving under a paused lane is routine under pause-and-resume, so this will recur. **Slot: a TOOL lane** — the second instrument gap this packet has surfaced (the first was the `retiredSymbols` figure trap). |
| 3 | Land on the manually-executed checks with no valid seal | ⛔ **NOT TAKEN without an explicit chair ruling.** It would land a SEALED-dispatch packet whose only seal evidence describes a two-commits-stale tree. The chair's "commit when everything else is green" instruction assumed `check:packet` would RUN and red only on check 7; it will not run at all, which is materially different. |

## What is ready the instant route 1 lands

Patch `EM-B1f.packet.patch` (24,692 B, 6 `diff --git` headers, `git apply --check` **OK**) and the
six SHA-256s in `EM-B1f.six-shas.txt`. Batches 1–3 are all green at `6a3e8089f`
(`EM-B1f.receipt-batches-1-3.md`). **CURE-J touched only `tests/helpers/dossierManifest.js` and
`tests/property/dossierProseManifest.test.js`** — neither is one of this packet's thirteen — so at
the new tip only **sealed check 6** (the goldens batch) needs re-running; checks 0–5 and 7–10 were
measured at `6a3e8089f` against files CURE-J did not touch.

## ⭐ CURE-J commit 1 VERIFIED LANDING AS DESIGNED — measured on a CLEAN tree at `c127cdfb2`

With **none** of this lane's edits present, the named title still reds, which proves beyond doubt
it is not this packet's:

```
FAIL tests/property/dossierProseManifest.test.js > the composed-prose manifest — the DRIFT corpus,
     both audiences > ⭐ THE PROVENANCE REFUSES A FIXTURE ITS RECORDER DID NOT WRITE
AssertionError: a fixture whose recorder has moved since it was written is REFUSED
  (comment-insensitive since 2026-09-20): re-record with `node scripts/prose-manifest-cells.mjs --record`
-  "scripts/prose-rate-corpus.mjs":        "9d5d9f6ddfa7a6933fa2ec6a8e949066aacffad0d614caf22bb51e6efe39a399"
-  "tests/helpers/dossierManifest.js":     "7849068873a639340f3739e4f905977225c3c87703d3a569dfe5589debd4a9cb"
-  "tests/helpers/goldenMasterCorpus.js":  "a10b1170d43db59b1ea9c49ef5f5d35a57afa5462516575e8ea3f2906db8061d"
+  "scripts/prose-rate-corpus.mjs":        "0f0efb35cc4357cd01f0c7d4f7be48efdb6069546746d3575b6430b54dc62864"
+  "tests/helpers/dossierManifest.js":     "5ee87f0b0bf90aae4e1f9968a71f3dedafb4596642012774291d1348ba75b2bc"
+  "tests/helpers/goldenMasterCorpus.js":  "7f09210e8723c77f3a93020ea2be524e2129a0933da6e53ed5b9cc0ecf926d5d"
```

`Test Files 1 failed | 1 passed (2)` · `Tests 1 failed | 19 passed (20)`; `generatorGoldenMaster` GREEN;
both fixtures byte-identical (`7177cd6e…8f1e`, `921c51cf…db41`).

⭐ **A DIFFERENCE WORTH THE CHAIR'S EYE:** before CURE-J commit 1 **ONE** recorder hash mismatched
(`prose-rate-corpus.mjs` only); after it, **ALL THREE** do — consistent with the identity scheme
moving from whole-file to code-only for every recorder, i.e. commit 1 landed exactly as designed
and the owner-gated re-record is the single remaining act. ⛔ Nothing was re-recorded by this lane.
