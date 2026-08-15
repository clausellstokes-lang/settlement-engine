# DESIGN — THE BUILD-EFFICIENCY MACHINERY (§28 architected)

- **Status:** ARCHITECTED 2026-08-14 (Fable chair), under OWNER_DECISION_QUEUE
  §27 (build-everything ordering) and §28 (the six-technique ruling this volume
  expands). Landed on the ledger branch — the build branch is sealed under
  GR-4B-IIIB at authoring time. **Fold: DONE.** This volume folded to the build
  branch verbatim at the `infra-1` train's member INFRA-M1-DOCS, with the
  enforcement-claims `CLAIM_RE` scan executed in the same change and returning
  zero hits over this file. This copy on `claude/composite-r4` is the canonical
  one; the ledger-branch copy is history.
- **Prime constraint, restated so no section below can erode it:** the gate is
  AMORTIZED, never THINNED. No step of `npm run check` becomes conditional,
  skippable, or "lite." The five days the gate ran dark behind one
  short-circuited step is the permanent reason. Every technique here changes
  WHEN the full gate runs, never WHAT it checks.

## §1 · The measured cost model this volume attacks

One packet-grain wave in the current rhythm (measured across the 08-13 era's
six landings, ~2.5 h wall-clock each):

| Phase | Cost driver | Shareable? |
|---|---|---|
| Compile/draft | ~10 base measurements re-executed per lane (hot files, census tuple, walker baselines, OSR count, validator state, flag manifest) | YES — §3 capsule |
| Authoring | ~60% of packet text is family-invariant (hazards, gate obligations, STOPs) | YES — §4 templates |
| Chair rulings | per-wave round-trips | YES — §5 batching |
| Implementation | focused batteries, mutants | mutant TREES shareable per train |
| **Full gate** | bare `check:tail` (~28k tests, build, 314-doc prerender, strict dist) + `smoke:boot`, at least once per wave | **YES — §2 trains** |
| Landing/flip | census re-record, three-home flip, ledger | consolidates per train |

The full gate and the repeated preflight dominate. Trains and the capsule are
therefore the two load-bearing sections; everything else compounds them.

## §2 · TRAIN LANDINGS — the atomic multi-wave exposure protocol

**Definition.** A train is an ordered set of ≤ 4 same-volume waves built as one
unexposed commit sequence and exposed atomically by one old-value CAS to the
train's single green terminal child. Generalizes the two ruled precedents
(CR-AO-11's three-commit contract→cure train; CR-H26-3's code/genesis pair).

### 2.1 Commit topology

```
base (exposed, green)
 └─ P1 promote W1 (docs: packet READY, manifest, INDEX)
     └─ I1 implement W1 (exact paths; focused proof green at I1)
         └─ P2 promote W2
             └─ I2 implement W2
                 └─ … 
                     └─ T  train terminal: census re-derived WHOLE +
                        all members flipped LANDED + full gate + smoke
```

- Every commit is built on a PRIVATE REF (`refs/trains/<train-id>`) so the
  chain is reachable (never GC'd, snapshot-friendly) without ever being a
  branch tip. The shared branch ref moves ONCE: `base → T`, by old-value CAS,
  only after T's bare full gate and separate boot smoke exit 0 in-shell.
- Interior commits may carry precomputed exact reds (a walker that will only
  green at T) — lawful because they are never exposed, exactly the CR-AO-11
  model. Every red must be NAMED in the train plan before it exists.

### 2.2 What each member still owes (proof is per-wave, unchanged)

Per member: the packet's focused battery green at its own I-commit, its
mutants convicted and restored digest-exact, both TypeScript ratchets at exact
floors, OSR exact, scoped eslint, walkers it touches green-or-named-red-at-T.
The ONLY things that move from per-wave to per-train: the bare full gate, the
boot smoke, the whole-census re-derivation, and the ledger row (one row
narrating the train with per-member sub-entries).

### 2.3 The census under a train

The serialization law ("re-derived whole in the same change that moves any
figure") is satisfied at T — the only exposed change. The census-holder rule
holds with the TRAIN as the one non-terminal holder: the train plan declares
the summed predicted tuple; members' individual movements are working figures
inside the unexposed chain. The validator's pairwise-disjointness rule is
never violated because members are promoted just-in-time INSIDE the chain —
at any exposed state there is at most one READY packet, same as today.

### 2.4 Failure semantics

- A member's focused proof fails → the train TRUNCATES at the last green
  member boundary: re-point T after the green prefix (census re-derived for
  the prefix), land the prefix, return the failed member to compile. A prefix
  landing is a complete, lawful train.
- T's full gate fails → bisect using the per-member focused proofs (they
  localize by construction); truncate to the green prefix; the offending
  member recompiles. Never land past unexplained red.
- Window death mid-train → the private ref plus `resume-state.sh` snapshots
  carry everything; the hand note names the train id, member list, and the
  chain position at EVERY member boundary (§6). A successor collects the
  chain, re-verifies the last member's proof independently, and continues.

### 2.5 Boundaries

Flag-minting waves are train boundaries (the CQ5 one-commit flag law is
untouched): a flag wave rides alone or as the FIRST member of a train whose
remaining members are no-flag slices of that same flag. No cross-volume trains
until two same-volume trains have landed clean (rollout guard, §8).

## §3 · THE BASE-STATE CAPSULE — measure once per landing, not once per lane

**Definition.** A derived artifact, `docs/implementation/BASE_STATE.json` (on
the build branch), regenerated by the flip/landing step of every exposure and
stamped with the sha it was derived at. Contents, all machine-derived:

- the landing sha and timestamp;
- hot-file effective lines (the standing hot-file list, eslint `Linter`
  method) with each file's SHA-256;
- the whole lighting-census tuple; the `title=` census; the four kill-list
  counts; OSR finding count; both TypeScript ratchet ceilings;
- `validate:packets` state (packet count / READY count);
- the flag manifest count (`ENGINE_GATED_VIRTUAL_RULE_KEYS` length) and the
  registry row count;
- the voice-mechanics banked-arm count and the test-ratchet frozen-failure
  count.

**Consumption law (reconciles the B13 executed-figures law):** a compiler at
base sha X may cite capsule figures stamped X as EXECUTED — they were, by the
landing protocol, at exactly that tree. It must still RE-EXECUTE the rows its
own manifest touches (a hot file it edits, a walker it moves), because those
are the rows where staleness kills. A capsule stamped at any OTHER sha is
worthless for citation — the compiler measures from scratch (the current
behavior remains the fallback, so the capsule can never make things worse).

**Build cost:** one script (`scripts/base-state-capsule.mjs`) that shells the
existing measurers — it invents no measurement of its own, so it cannot fork a
second spelling of any figure (the one-canonical-truth law). Until the script
lands (a small output-neutral wave, slotted §8), the chair hand-stamps the
capsule at each flip from the figures the flip already re-derives — the
procedure starts paying immediately; the script only automates it.

## §4 · FAMILY PACKET TEMPLATES — sign the invariants once per volume

Per volume (GR, ES, TR, WY, HB, WC, EP, …), the chair authors and signs ONE
family preamble at `docs/implementation/preambles/<VOL>-PREAMBLE.md`
containing the sections that do not vary per wave: the hazard dispositions
that always apply, the coupling/OSR obligations, the gate-reading law, the
mutant hygiene rules, the standing STOP conditions, and the family's binding
design-law citations. Each member packet then carries only: scope and
boundary, the behavior/identity contract, the exact manifest with budgets,
acceptance cases, wave-specific mutants and hazards, and a line citing the
preamble BY SHA-256. A preamble edit re-stamps every citing packet (the sha
changes), so drift is structurally impossible. `validate:packets` needs no
change — packets remain complete on their required structured fields; the
preamble is authority prose, exactly like the design volumes already are.
PACKET_STANDARD gains one section describing this (a prose-batch item on the
build branch, post-seal).

## §5 · BATCH CHAIR RULINGS — rule the family, not the wave

At train-compile time the chair reads the whole family's next train worth of
draft questions and rules them in one sitting, in one owner-queue section (the
CR-FP-3..10 seventeen-rulings precedent). Owner-visible calls are batched into
ONE veto surface per train, so the owner reads one section per train instead
of five. Rulings remain individually numbered and individually vetoable.

## §6 · PIPELINE STAFFING — the standing three-role shape

- **Lane A (implementer):** builds train N's members in order, inside the
  private ref. One writer at a time in the engine worktree.
- **Lane B (compiler):** drafts train N+1's packets against the capsule at the
  CURRENT exposed base, scratchpad-only. Its drafts declare the base they were
  compiled at; if train N's exposure moves figures their manifests touch, the
  affected rows are re-measured at promotion (the capsule makes this diff
  cheap and explicit).
- **The chair:** collects, rules, promotes, owns every commit and CAS, keeps
  the hand note current at EVERY member boundary (tightens the seamless-resume
  law's cadence for train mode), and staffs recon/read-only lanes 3-4 under
  §25 as breadth demands.
- The landing slot, gate slot, census holder, and engine worktree remain
  strictly serial and singular — the pipeline parallelizes AUTHORING, never
  exposure.

## §7 · WHAT THIS VOLUME REFUSES

- **Gate tiering or conditional steps** — refused permanently (the prime
  constraint).
- **Trains above 4 members** — the bisection and window-death blast radius
  grow superlinearly with length; 4 is the cap until §8's review.
- **Cross-volume trains at rollout** — collision and preamble coherence risks
  compound across volumes; revisit after two clean same-volume trains.
- **A per-wave "lite" sealed runner** — the sealed-session machinery runs per
  member unchanged; only its `check:tail`/`smoke:boot` rows move to T.
- **Capsule-only compilation** (no re-execution of touched rows) — refused;
  the capsule covers the UNTOUCHED base, never the wave's own surface.

## §8 · ROLLOUT PLAN AND THE ADJUSTED BUILD SEQUENCE

1. **Immediately (procedure only, no build):** §5 batching and §6 staffing are
   in force now; the chair hand-stamps the first capsule at the GR-4B-IIIB
   flip; the hand note carries train state from the first train onward.
2. **First train — GR-4B-II** (the annex act + `reaffirmed`), 2 members,
   compiled against the first capsule, using a GR family preamble authored at
   the same time (the GR packets' shared text is the extraction source).
3. **Post-seal build-branch micro-waves** (each output-neutral, trainable
   together as an infrastructure train): the capsule generator script; the
   PACKET_STANDARD preamble/train section; IP-1's sourcemap guard.
4. **Then the ES spine as trains** (ES-1..ES-7 are no-flag → two trains of
   3+4 or 4+3 per the volume's declared serialization), and onward through
   the FPC census's dependency-ordered queue, flag waves as boundaries.
5. **Review gate:** after the first two trains, the chair audits actual
   wall-clock and red-rates against this volume's 40-60% estimate and either
   confirms the cap of 4 or adjusts it — recorded, not silent.

## §9 · Standing risks, named

The private-ref chain is unreviewed surface between exposures — mitigated by
per-member proofs and the hand note's member-boundary currency. The capsule is
a restatement engine by nature — mitigated by shelling only existing measurers
and the stamped-sha consumption law. The preamble is one more governing
document that can drift from code — mitigated by sha citation (drift
re-stamps every packet). The pipeline doubles in-flight authored-but-unlanded
work — mitigated by the compiler lane's declared-base rule and cheap
re-measure at promotion.
