---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-14
  type: hazard + train-topology law
  lane: TE10 (hb-2b executor)
  commits: "measured at e5ecc83d, claude/composite-r4"
  modified: 2026-08-14T22:58:28.431Z
  originSessionId: a244e7a3-27d9-4152-b847-cf42cf4b08a7
---

# ⚠⚠ THE PACKET VALIDATOR RESERVES CHANGE PATHS AT **EVERY NON-TERMINAL STATUS** — two live packets may never name one path

## The fact

`scripts/implementation-packets.mjs` refuses a `changeManifest` path claimed by more
than one **non-terminal** packet:

```js
const TERMINAL_PACKET_STATUSES = new Set(['LANDED', 'SUPERSEDED']);          // :43
const reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(String(status));   // :498
if (reservesChangePaths) {
  const priorOwner = changePathOwners.get(row.path);
  if (priorOwner && priorOwner !== changeOwnerKey) {
    addError(errors, `duplicate change path across packets: ${row.path} (…)`);
  } else changePathOwners.set(row.path, changeOwnerKey);                     // :516-524
}
```

⛔ **ONLY `LANDED` AND `SUPERSEDED` RELEASE A PATH.** `READY`, `DRAFT`, `BLOCKED` and
`STALE` all reserve identically — so **demoting the second member to `DRAFT` is NOT an
escape**, which is the first thing an executor reaches for.

## Why it matters

A **§28 train whose two members lawfully share one path cannot promote both at once.**
`validate:packets` is a §P7 **stop instrument**; it exits **1** with the duplicate row
from the promotion commit all the way to the terminal, where both members finally flip
`LANDED`. Every interior commit therefore carries an **undeclared red** on a stop
instrument — the exact condition OQ §43 item 4's tripwire forbids.

⚠ **It is structurally undischargeable mid-train.** Unlike the `path does not exist` /
`symbol is missing from` rows a promotion normally declares — which clear at the
implementation commit that creates the files — this row clears **only** on a status flip.
No amount of building discharges it.

⭐ **AND THE `44 packets (2 READY)` LINE IS AN `ok`-PATH OUTPUT.** `runImplementationPacketsCli`
prints it only when `result.ok` (`:811-817`); on any error it writes rows to stderr and
returns 1. **A packet §9 table that predicts `N / 2 READY` at an interior commit is
predicting VALIDITY, not just a count.**

## How to apply

- **At compile:** if two members of one train share ANY `changeManifest` path, the train
  needs a **SPLIT PROMOTION** — promote M1 only, land it, then a second docs-only commit
  flips M1 `LANDED` **and** promotes M2, then land M2, then the terminal. Five commits,
  not four. The TE7 census law is unaffected: the last `tests/`-moving member still
  re-derives the tuple whole, and the terminal stays docs-only.
- **The mid-train `LANDED` flip is safe only if that member has ZERO `CREATE` rows** —
  `CREATE` existence is asserted **only** at `LANDED` (`:534`). A member with CREATE rows
  must have actually written them before it may flip.
- ⭐ **Related, measured the same day:** a **`CREATE` row is NOT existence-checked before
  `LANDED`** ("a CREATE row is a promise"). A promotion commit's declared red rows come from
  **`requiredSymbols`** (`:574-581`, checked at every status), never from the CREATE manifest.
  Do not predict the category off CREATE paths.

## Provenance

Measured by Lane TE10 at `e5ecc83d` while executing the `hb-2b` train; **refuted the
compile's §7.1 R2 claim that "the validator has no READY cap and no disjointness rule"**
and STOPPED the train pre-P1. No prior train had ever stood two non-terminal packets on
one path (`hb-1`'s promotion `436f138e` carried `HB-0` alone; `HB-1` joined the manifest
only after `HB-0` was `LANDED`), which is why the rule had never bitten.

Executed probes left at `scratchpad/laneTE10-probe{2,3}.mjs`; full receipt at
`scratchpad/laneTE10-receipt.md`.

---

## Related findings from the same lane (TE10, `hb-2b`, 2026-08-14)

Recorded here rather than in new files because MEMORY.md sits at its ~17KB read limit and a
fold is owed before another hook can be added.

### ⚠⚠ A RESERVED PATH DRAGS ITS EXACT-LIST PIN AND ITS GENERATED ARTEFACTS

`hb-2b`'s manifest reserved twelve paths and the landing moved **twenty**. The eight were not
scope creep — each was a mechanical consequence of a path already reserved:

- **The exact-list pin.** Reserving `src/domain/certification/subsystemRowsVirtual.js` also
  requires `tests/domain/subsystemRowsVirtual.test.js`, whose `VIRTUAL_RULES` is an ORDERED
  equality against the rows and whose `LANE_LEAVES` is iterated over it. Same shape as R32.
- **Generated bundles.** `src/domain/worldPulse/simulationRules.js` is an INPUT to the
  edge-shared bundles (measured: the only one of 110 inputs differing from base), so a CQ5 flag
  key staled two of them. `npm run build:edge-shared` is the cure the freshness test names, and
  ⛔ **all seven artefacts must move together** — `CR-EB-2 (b)` requires one build window, and
  reverting the three timestamp-only siblings REDS the no-stale-siblings arm.

⭐ **COMPILE-TIME CHECKLIST THIS YIELDS:** for each reserved path ask *"what exact-list pin
names it, and what generated artefact takes it as an input?"* Both were mechanically
discoverable before writing a line — by grep, and by reading `*.meta.json`.

### ⚠⚠ A DECLARED CHANNEL PLUS `soakEvidence: 'unobserved'` IS CEILINGED AT FIVE

A certification row that declares `stateKeys` and still calls the soak blind to them *"converts
a real SILENT into an instrument gap"*. The population is capped at 5 and the instrument says in
its own failure message: **"give the new row a channel the receipt can read, or accept SILENT —
do not raise this ceiling."** The cure is `soakEvidence: 'indirect'` when the channel is real
and readable the day a receipt exists (the landed espionage-row precedent). ⛔ Not a ceiling raise.

### ⚠⚠ `edgeSharedBundleReproducibility` READS THE GIT **INDEX**

It compares the bundle hash against index content, so **a lane that commits by plumbing and
never writes `.git/index` cannot pass it in its own dirty worktree** — the index still describes
the base. This is an ARTIFACT, not a defect: disproved by running the suite in a clean detached
worktree at the landing commit (38 files / 948 passed / exit 0). ⇒ **Such a lane must run the
terminal gate in a clean detached worktree at the landing commit**, which is also the more
honest instrument: the gate should measure the landing, not the workbench.

### ⚠ RAW NUL BYTES CAN ENTER AUTHORED SOURCE INVISIBLY

A NUL separator was written as a RAW byte into a template literal — invisible in the editor, in
the diff, and in every focused test. `tests/lint/controlBytes.test.js` caught it.
⭐ Keep the separator (a NUL cannot occur inside a class or action token, so the tiebreak key is
unambiguous); write it as the ESCAPE SPELLING `backslash-u0000`, which is what that pin's own
message prescribes. ⚠ A shell command containing the raw byte is REJECTED by the harness — fix
it with a script that builds the byte via `String.fromCharCode(0)`.

### ⭐ THE ESTATE'S `enforcement-claims` PIN IS BANKED, SO IT CANNOT PROTECT A NEW DOC

`tests/docs/enforcement-claims.test.js` is RED at HEAD on six pre-existing offenders and is
BANKED in `scripts/.test-ratchet-baseline.json` as `class: "debt"`. Because a banked failure is
keyed on TEST IDENTITY, it ABSORBS every later instance — **a new naked claim in a newly authored
doc reds nothing**. ⇒ Run the exact `CLAIM_RE` by hand over every authored document before
staging; that scan, not the test, is the receipt. ⚠ Both compiled `hb-2b` packets QUOTED the
forbidden phrase verbatim while warning about it, minting the very key they warned of.
