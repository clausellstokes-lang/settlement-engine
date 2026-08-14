# INFRA FAMILY PACKET PREAMBLE — the invariants signed once per volume

- **Status:** CANONICAL — signed and landed at the `infra-1` train's member
  `INFRA-M1-DOCS`, per `DESIGN_BUILD_EFFICIENCY.md` §4. Compiled by Lane TC3,
  authored into the tree by Lane TE3 under the chair's §30 ruling.
- **First citing members:** `INFRA-M2-CAPSULE` and `INFRA-M3-IP1`, which carry
  this file's landed SHA-256 in their headers.
- **Volume:** INFRA — the build-machinery family: gate tooling, the packet
  machinery, the base-state capsule, build-artifact contracts.
- **Extraction source:** the five landed non-FP packets `GTR-1.md`, `H26.md`,
  `IA-1.md`, `MX-1.md` and the SCW-0 landing, deduplicated, plus the three
  hazard classes §P5 names that no existing preamble carries.
- **Compiled at:** `claude/composite-r4` @ `60083174`, 2026-08-14.
- **Citation law:** a member packet cites this file BY SHA-256 in its header. An
  edit here re-stamps every citing packet, so drift is structurally impossible.
  `validate:packets` needs no change — packets stay complete on their required
  structured fields, and this file is authority prose exactly as the design
  volumes already are.

⛔ **This preamble carries NO per-wave figure.** Every census tuple,
effective-line count, SHA-256 seal, corpus count, and denominator lives in the
member packet and is re-executed there. A figure that appears here would be a
restatement engine with no stamped base — the exact failure mode
`DESIGN_BUILD_EFFICIENCY.md` §9 names for the capsule.

⚠ **Why INFRA does not cite `GR-PREAMBLE.md`.** Six of that file's nine sections
are grammar, voice, or registry specific: §P2 prices a Herald **desk** at five
registration files and no INFRA member registers a kind; §P4's coupling census
classifies `src/domain/worldPulse/**` and `src/domain/spatial/**` and an INFRA
member may write nothing under `src/` at all; seven of §P5's fifteen hazards are
voice or mount classes. Decisively, GR-PREAMBLE §P3 names `+1/+0/+1/+8/+1` as a
family invariant, and §P3 below records why an INFRA member may lawfully move
the exact negation of it. A member cannot cite a preamble whose census law it
must break. §P6 and §P7 are lifted from GR-PREAMBLE because they are estate law
that happens to have been written down in the GR volume first.

---

## §P1 · Binding design-law citations

These are the authorities every INFRA member reconciles against, in
`PACKET_STANDARD.md` authority order. A member packet names only its own
*additional* sources.

| Authority | What it binds for INFRA |
|---|---|
| `PACKET_STANDARD.md` | the standard itself: statuses, dispatch lifecycle, scope budget, hot-file law, edge-case budget, STOP conditions, completion receipt |
| `DESIGN_BUILD_EFFICIENCY.md` | the train protocol (§2), the base-state capsule and its consumption law (§3), family preambles (§4), the rollout sequence (§8), the standing risks (§9) |
| `DESIGN_IP_PROTECTION.md` | the IP program's four waves; §2's four laws; §5's refusals; §6's receipt obligations |
| `CONTRIBUTING.md`, `ARCHITECTURE.md` | system invariants and operating law |
| `OWNER_DECISION_QUEUE.md` §27, §28, §30 | the build-everything ordering, the six-technique efficiency ruling, and the `infra-1` train's signed shape |

⛔ **Explicitly NOT binding on an INFRA member:** `DESIGN_FP_GRAMMAR.md`, the
news address law, `docs/content/RECEIPT_POOLS_GRAMMAR.md`, and the SP-6
content-depth floor. No INFRA member touches prose, news, or the corpus. A
member packet that finds itself needing one of them has mis-scoped and returns
to the chair.

---

## §P2 · The governed-input cost — the measurement that decides an INFRA packet's shape

**The binding constraint on an INFRA wave is not the source leaf. It is whether
the wave touches a governed observed-shape input.**

⛔⛔ **`package.json` and `package-lock.json` are two of the eleven paths
`scannerToolFiles()` returns** in `scripts/check-observed-shape-readers.mjs`.
`fileManifestOf` hashes each governed file's **content**, so ANY byte change to
either — including adding one npm script row — moves `detectorTree.digest`. The
ordinary gate path then compares the baseline's `scannerProvenance.detectorDigest`
against the live digest and, on mismatch, prints that the observed-shape
detector or unscanned execution input changed since the governed instrument was
minted and that an ordinary gate or write cannot migrate the instrument, and
returns 1.

⇒ **Neither a gate run nor `--write` can cure it. Only a schema mint can.** Its
one precedent in this repository is `3dbb19c9` — a re-promotion after a prior
infrastructure wave modified `package.json` — and that re-promotion cost a
nine-file packet: four scripts, four governed tests, and a multi-megabyte
baseline.

⛔⛔ **An INFRA member that needs a `package.json` row STOPS and returns to the
chair.** A schema mint is its own wave and no member may absorb one. The correct
disposition is a dated deferral batched to the next mint, where the digest is
re-derived anyway and the row costs nothing extra.

⭐ **A NEW `scripts/*.mjs` file is not a governed input.** `scannerToolFiles()`
is a fixed list, and `sourceFiles()` / `subjectFiles()` walk the `src` tree only.
A member adding a script moves no digest — but it states that as a measured
negative control rather than assuming it.

---

## §P3 · The census law under INFRA

⛔ **INFRA HAS NO STANDING CENSUS TUPLE, AND STATING ONE WOULD BE A DEFECT.**
GR-PREAMBLE §P3 names `+1/+0/+1/+8/+1` as its family invariant because a GR
voice wave always adds exactly one credited acceptance file. INFRA members have
no such shape: one lands `+0` across all five figures, another lands a credited
file, another lands a **parked** one. A member packet derives its own tuple from
the rules below and states it as an exact prediction that its own measurement
must meet.

The whole lighting census —
`tests/lint/sovereigntyLightingContract.walker.test.js`, the tuple
`files / parked / credited / test titles / suite titles` — is an
**exact-equality** pin on every one of its five figures. The rules that decide an
INFRA member's row:

1. **A `docs/` or `scripts/` file is `+0` on all five.** The walker's corpus is a
   walk of the `tests` tree filtered to `*.test.js` / `*.test.jsx`, so no other
   path can enter it. This is why a docs-only INFRA member is a lawful train
   truncation boundary.
2. **A new `tests/` file is `+1 file`, and then either credited or parked.** It
   is **credited** — contributing its literal `it` and `describe` titles — only
   if every title is spelled as a string literal in a straight-line registration.
   ⛔ `.each`, looped or conditional registration, nested describes, `skip` and
   `todo` each **park the file WHOLE**: the walker refuses a file if *any* suite
   it opens fails door 3, and a parked file contributes **zero** titles because
   both title figures reduce over the credited set only.
3. **`describe.runIf(...)` parks the file** under `SUITE_NOT_RUNNING`. For a
   `tests/build/**` guard this is the correct outcome and not a defect: deleting
   the `runIf` to buy credit would red the suite on any checkout without a built
   artifact. Correctness wins and the motion is declared rather than fought.
4. **`tests/build/**` adds `+0` to the runtime denominator** — the source phase
   excludes that tree by an exported constant and **fails closed** if a row leaks
   into its report — and `+1` to the `verify:dist` discovered corpus.
5. **The runtime denominator is a FLOOR, not an exact pin**: the ratchet compares
   against a stale baseline total times an exported scope-floor ratio. New tests
   move it and red nothing. The capsule records it; no gate pins it exactly.

⛔ **The census-holder rule.** At most one in-flight wave holds the census. Under
a train (`DESIGN_BUILD_EFFICIENCY.md` §2.3) the **train** is the single
non-terminal holder: members' individual movements are working figures inside
the unexposed chain, and the whole re-derivation happens once, in the chain, so
that the single exposed change carries both the motion and its re-record.

⚠⚠ **THE INTERIOR RED THIS LAW FORCES, NAMED ONCE HERE SO NO MEMBER RE-DISCOVERS
IT.** Because the census arm asserts exact equality against a recorded constant,
a member that adds a test file **reds the census walker at its own I-commit and
stays red until the re-record**. That red is lawful under §2.1 — interior
commits are never exposed — but it is not optional and it is not a defect of the
member. A train plan that declares zero interior reds while scheduling a
census-moving member has mis-declared, and the honest cure is to name the red
with its exact predicted figures, never to truncate the train over it.

---

## §P4 · The enumeration law — where a test file may live

`enumerateInvariants()` in `tests/lint/mutationCoverage.shared.mjs` picks every
`*.test.js` / `*.test.jsx` under the seven **enforcer directories**
(`tests/lint`, `tests/design`, `tests/docs`, `tests/data`, `tests/copy`,
`tests/security`, `tests/edgeFunctions`) **plus** any file whose basename matches
`NAME_PATTERN` — the invariant-nomenclature regex naming census, scan, baseline,
ratchet, walker, killlist, parity, coverage, governance, freshness, integrity,
exhaustiveness, roundtrip, golden, contract and pin.

⛔ **A picked file with no `scripts/mutation-coverage-manifest.json` row reds the
TOTALITY test.** A member therefore states, **before writing the file**, both its
placement and its name, and which side of that line the file lands on. The
shared manifest is a file this estate's standing law says never to re-serialize,
so a member that can avoid owing a row should.

⭐ The name is as load-bearing as the directory. `…Contract`, `…Scan`, `…Pin`,
`…Governance` and `…Parity` each opt a file in from outside the enforcer dirs.

⭐ Sitting outside the mutation manifest is not an evasion for a `tests/build/**`
guard: strict dist answers to a **stronger** authority. It has no baseline and no
debt concept — every discovered on-disk build contract must appear exactly once
and pass whole — and the manifest's job of catching a guard nobody proved reds is
done there by the member's own mandatory planted mutant.

---

## §P5 · Standing hazard dispositions

Every class below already has a hazard-registry row. **An INFRA member packet
owes no new hazard row**; it owes a disposition line for each class its manifest
can reach, plus its own wave-specific hazards.

- **HZ-OSRDETECTORDIGEST** — §P2. A governed-input edit is a schema-mint trigger
  and a STOP.
- **HZ-MUTATIONENUMERATION** — §P4. State placement and name before writing.
- **HZ-DISTSTALEGREEN** — ⚠⚠ **the polarity trap, and it inverts the house
  idiom.** The estate's rule is that ABSENCE assertions over the built artifact
  stay ungated, because a stale artifact can only UNDER-report absence. That
  reasoning holds for absences about newly added eager edges, which a stale build
  simply lacks. It does **not** hold for an absence that a *configuration flip*
  would create: flip the config, do not rebuild, and the stale artifact still
  lacks the forbidden output, so the guard reports green over precisely the
  change it exists to catch. Such a read is gated like a SIZE read, and it owes
  an **unconditional** anti-vacuity case so the gated half can never count green
  having measured nothing.
- **HZ-NEWFILECEILING** — both TypeScript ratchets stay zero-error for every new
  path. Repair at source; ⛔ never add a baseline entry.
- **HZ-SIZECEILING** — the three standing hot files are measured **at the
  member's own base with eslint's own `Linter` under `max-lines`
  `{ skipBlankLines: true, skipComments: true }`** — never `wc -l`, never an
  inherited figure, never a delegated one. A manifest naming a hot file shapes
  its edit to net zero effective lines or STOPs. ⭐ `scripts/**` carries no
  `max-lines` ceiling; a per-leaf budget there is the packet's own discipline.
- **HZ-GATEMUTEX** — every Vitest process uses the canonical mutex for its entire
  lifetime. An observational preflight followed by a separate command is not
  ownership. ⛔⛔ Never wrap `npm run check*` in `gate-mutex.sh --run` —
  `test:ratchet` re-acquires and self-deadlocks (exit 3 is the mutex giving up,
  not a red).
- **HZ-SINGLEWRITER** — one coding writer and one coordinator. No shared-target
  edits from another lane.
- **HZ-DISTBOOT** — a new static import edge requires a **separate**
  `smoke:boot`. The bare full gate does not subsume it.
- **HZ-PIPEEXIT** — §P7.
- **HZ-MUTANTNOOP / HZ-TESTVACUITY** — §P6.

Run **both** the hazard-registry and pre-mortem validators. Premortem warnings
are dispositions to verify, never waivers. A new working warning whose cure lies
outside the manifest is a STOP and a chair return.

---

## §P6 · Mutant hygiene

Test trust on an INFRA wave is proved with **disposable source mutants in an
isolated immutable candidate**, never with a standing mutation-manifest row: the
INFRA acceptance filenames sit outside the enforced mutation-test nomenclature
and directories (§P4), so no sweep row is owed. The member packet fixes the
mutant count; this preamble fixes the procedure.

For every mutant, in this order:

1. prove the **source bytes actually changed** (a no-op plant is a STOP);
2. require a **nonzero test exit** and the **named acceptance title** red — a red
   under a different title is an ambiguous mutant and a STOP;
3. restore the **exact pre-mutant SHA-256**;
4. rerun focused green.

⛔ Do not run the estate-wide shared-tree sweep: this checkout carries other
lanes' uncommitted and untracked work, and a sweep plant's `git checkout --`
revert is exactly the parallel-session hazard the dirty-tree guard refuses.

**Anti-vacuity rules that have each bitten this estate:**

- ⛔ A **redundant second guard subsumes the first** — a mutant that passes means
  the assertion had a second, unnoticed enforcer, not that the code is safe. Such
  a mutant is **recorded as a declared no-conviction control**, never hidden.
- ⛔ A **count mutant on a literal goes vacuous**.
- ⛔ A **fixture that mirrors the deriver can never see a dead arm**.
- ⛔ A **rendered-surface negative** passes when the surface never rendered.
- ⛔ A **self-referential pin** (list compared against itself) proves nothing. A
  test may not build its expected side from the code under test.
- ⛔ A multi-line `// anchored:` marker counts only if its **last** line carries
  the marker, and the anchor must be the line **immediately above**.

---

## §P7 · Gate-reading law

- ⛔⛔ **Never read a gate through a shell pipe.** Reading the gate through `tail`
  reports the PIPE's exit status, not the gate's, and has greenwashed a red gate
  twice. Use `npm run check:tail`, or `sh scripts/gate-tail.sh <command...>` for
  any other gate command; both print the tail and exit with the gate's own code.
- ⛔ **Trust no exit status you did not capture in-shell.** Redirect to a file and
  read `TRUE_EXIT=$?`.
- `npm run check` is a long `&&` chain. A red step blacks out every later step;
  the receipt must say **which steps actually ran**.
- Report **both** TypeScript configurations by name and window:
  `typecheck:ratchet` (`tsconfig.full.json`) and `typecheck:domain:strict`
  (`tsconfig.domain-strict.json`). A ratchet being green is evidence only about
  that ratchet. A per-file `tsc` is a vacuum.
- ⛔ A **failing enforcement walker is never banked as ordinary test debt** — a
  failing test is debt, a failing walker is a **disabled guard**.
- If a full gate is red, compare failure **identities** against a committed-base
  run or an integrity-counted archive. Do not repair unrelated rows. Never land
  past unexplained red.
- ⛔ **Never raise a baseline, budget, timeout, or ceiling to finish a packet.**
- The final full gate is a **bare** `check:tail` with a true exit, plus a
  **separate** `smoke:boot`. Under a train, both move to the terminal commit and
  are run once there.

---

## §P8 · Standing STOP conditions

In addition to `PACKET_STANDARD.md` §"Mandatory STOP conditions", an INFRA member
stops — **without expanding or repairing** — when:

1. packet status is not READY, or HEAD is not the verified base or an
   ancestry-proven descendant;
2. authority bytes, a target SHA-256, a required symbol, a CREATE-target absence,
   or a foreign-dirt fingerprint differs from the packet;
3. a target file is dirty, changed concurrently, or outside the manifest;
4. live code refutes the packet's premise — **the code wins and the packet
   stops**;
5. any edit to a **governed observed-shape input** appears necessary, or the OSR
   scan implicates a schema mint, or a new observed-shape finding appears —
   ⛔ report; do not mint, do not baseline. A new path carries a per-identity
   ceiling of zero;
6. a `scripts/mutation-coverage-manifest.json` row becomes owed (§P4);
7. a read of the built artifact could report green on a stale build (§P5
   HZ-DISTSTALEGREEN) and the member has no unconditional anti-vacuity case;
8. any edit to the `check` chain, to CI, or to a measurer the member merely reads
   appears necessary, or any gate step would become conditional. ⛔ The gate is
   AMORTIZED, never THINNED;
9. any hot file's measured effective count would move, or any size baseline,
   ratchet, budget, timeout, or ceiling would need raising;
10. any census, corpus count, or denominator differs from the exact figure the
    packet predicts in a direction the packet did not name;
11. the manifest would need one more handwritten file or a ninth acceptance
    title, or an **inherited** override;
12. a new persisted key, artifact schema, state family, writer, flag, tuning key,
    migration, or dependency would be needed. ⛔ A persisted-artifact schema
    change is owner-gated;
13. a committed **golden moves** — that is a premise refutation, never a
    re-record;
14. ungoverned Vitest concurrency, a recursive sealed runner, a failed or
    ambiguous mutant, an incomplete restore, or a nonzero validator, gate or
    smoke occurs;
15. any minification, obfuscation, bundling, soak, tuning, deploy, push,
    migration, marketplace, paid-policy, or legal work would begin. **None of
    these is ever implied by an implementation packet**, and
    `DESIGN_IP_PROTECTION.md` §5 refuses the first three by name.

The STOP report contains the smallest measured contradiction, the evidence, and a
proposed packet split. **It contains no speculative repair.**

---

## §P9 · What every INFRA member packet still carries itself

The preamble deliberately does **not** cover, and a member packet must supply:

- its scope, boundary, and explicit non-goals;
- the behavior/identity contract and every exact contract
  (`PACKET_STANDARD.md` §"Exact contracts a packet must settle");
- its own hard scope budget table, with any override ruled and grounded;
- the exact change manifest with per-file effective-line budgets;
- its **executed** preflight receipts — seals, hot-file measurements, censuses,
  validator states, and corpus counts, all measured at its own base;
- its closed acceptance matrix (at most eight cases);
- its wave-specific mutants and wave-specific hazards;
- its predicted census tuple, derived from §P3's rules rather than inherited;
- its sealed-check child list and completion-receipt contents;
- the SHA-256 of **this file** as it stood at promotion.
