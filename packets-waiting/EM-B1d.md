# Settlement editor / EM-B1d — `NpcStatus` gains `jailed`, its four enumerators are re-judged, and a walker refuses every foreign spelling but the declared unions'

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs:294-300`) anchors the status row at end-of-line and
  requires EXACTLY ONE such row in the preamble (J-TEWF1B-1).
  ⭐⭐ **THE BLOCK IS RULED (ODQ §934.47 addenda 6 AND 7) AND THE PACKET IS THE `NpcStatus` HALF.**
  The editor writes the tree's existing shapes. **`EntityStatus` is NOT widened** — the two
  vocabularies stay apart as `rosterProvenance.js:210` rules — and the institution-state contract
  moves into **EM-B1a** (§2a), its shared ruin writer into **EM-B1e**. `jailed` **joins
  `NpcStatus`** under option **J1**: a verdict handed down and the status it leaves are the same
  word *by design*, so the walker's second arm **declares the verdict union's exemption by name**.
  ⭐ **THE OVERRIDE NARROWS, IT DOES NOT LAPSE** (add. 7): five existing logic files at ≤3
  effective lines each, plus one walker.
- **Packet version:** 4
- **Verified base:** `fixes-2026-09-18-consist` at `__BASE__`
  ⚠ **`__BASE__` IS THE CHAIR'S STAMP AND IT MUST MOVE TO THE TIP.** The pre-proof lane measured
  that leaving it at `d31af2cee` makes the sealed dispatch **throw** — `scripts/mutation-coverage-manifest.json`
  is a `REGISTER` row, `REGISTER !== 'CREATE'`, so it sits in the substrate
  `assertAncestorAndSubstrate` diffs (`implementation-session.mjs:185-196`), and it moved by +4
  lines in the window. Setting the base to the tip makes `head === packet.verifiedBase` and the
  whole substrate arm returns early at `:184`.
  ⭐ **RE-MEASURED AT THE RULINGS (version 3): the consist has advanced to `816fc95e9`** (via
  `4da740b52`, the preamble's §P2 rows 10–11, and `816fc95e9`, EM-B3a READY). **The substrate is
  STILL UNMOVED across `a41a0e109..816fc95e9`** — `git diff --name-only` over all fifteen paths is
  empty — so the base may be stamped at **either** `a41a0e109` or the current tip. Stamp it at
  whatever HEAD reads **in the same command as the dispatch**, and re-run that one-line window
  first; the tree moves under this packet roughly hourly.
- **Last revalidated:** 2026-09-19, `__BASE__`
  > **THE CHAIR'S REVALIDATION SENTENCE, with the measured window facts:** *Re-measured at
  > `a41a0e109bdee8fe3a0df082bf35b36d2399301e` by the Opus pre-proof lane (session 7d3418f8,
  > 2026-09-19 ~15:1x EDT). `d31af2cee` is an ancestor (40 commits in the window); over every
  > change-manifest and `requiredSymbols` path exactly ONE file moved —
  > `scripts/mutation-coverage-manifest.json`, +4 insertions / 0 deletions at `429ceed54`, EM-P0's
  > landed row. All five production files are blob-identical base → tip, so every line number in §5
  > is unchanged. All seven `requiredSymbols` resolve verbatim. The CREATE target is absent and
  > untracked. Evidence §10–§20.*
- **Depends on:** `NONE`. ⭐ This packet lands **FIRST** in train **T3** (with EM-P2, EM-P3,
  EM-B3a and EM-B1e), before **EM-B1a**, whose `set-npc-status` row spells the post-this-packet
  seven (ODQ §934.47 add. 5, ruling 3). **EM-B3b and EM-P0 are LANDED; EM-P2 is STALE** — none is
  a dependency of this packet.
- **Collision group:** `scripts/mutation-coverage-manifest.json` — ⛔ **MEASURED: the live holder is
  `EM-P2` at status `STALE`, not EM-A1** (which is not placed in the tree at all; re-confirmed at
  the current tip `816fc95e9`, where EM-P2 at idx 187 is still the sole non-terminal reserver).
  `STALE` is **not** in `TERMINAL_PACKET_STATUSES` (`{LANDED, SUPERSEDED}`), so it reserves the path
  exactly as READY does. ⭐ **RULED: at EM-B1d's placement the chair withdraws the STALE EM-P2
  version 2 from the tree's manifest to the chair kit** (the just-in-time rule; EM-P2 version 3 is
  being re-compiled and will be placed fresh). **The path is then free and this packet needs no
  workaround — see §7.1.** Second shared path with the train:
  `tests/lint/.lighting-census-baseline.json` (the terminal's; deferred, never this packet's).
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured, and **re-measured at the tip by the pre-proof lane**. Executed:
  the `NpcStatus` typedef and its members; the enumerating-consumer scan; **no roster file is on the
  hot list and none carries a `scripts/.size-baseline.json` entry**; the five files' raw/effective
  lines (336/138, 193/61, 154/52, 222/92, 258/70); the emitted-chunk membership of all five (§3.2);
  the edge-shared input membership of `npcs.js` (§3.3). No test was run and no build was run by
  either lane.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
  > ⭐ **The hash the chair will stamp is `1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6`** —
  > independently verified by this lane: `git cat-file -p 4da740b52:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256`
  > reproduces it to the byte, and it is **unchanged at the current tip `816fc95e9`**.
  > ⓘ Both facts are recorded because the preamble moved twice: at `a41a0e109` (this lane's read
  > tip) it hashed `95e9a5f4aee51bb5aaa434883a708c5f2a4c71d2a49aa4ec99f9076a98c2afaa`; `4da740b52`
  > then added **§P2 rows 10 and 11** — the edge-shared INPUT-membership cost this packet's
  > pre-proof found unpriced, and the byte budgets priced at pre-proof. This packet already carries
  > both; §7 and §3.2 cite them.

---

## 0. WHAT VERSIONS 2, 3 AND 4 CHANGED, AND WHY

**Version 4 (R6′).** The chair withdrew option (b) on this lane's own measurement — token
membership over the whole union costs ~60 exemption rows that say only *"this is `ACTIVE_STAGES`,
not `NpcStatus`"*, a register nobody reads. R6′ replaces it: the trigger is the union's
**discriminating subset**, derived as the members belonging to no other declared vocabulary —
measured `{dead, exiled, retired}`, with `'active'`, `'removed'`, `'missing'` and `'jailed'`
excluded as homonyms and the resulting CANNOT-CATCH stated in the walker's header. The trigger
flags **8** files, **all genuine consumers**, so the exemption register is **empty and inline**
and the sibling data file version 3 had added is withdrawn (handwritten back to 7). ⭐ It also
found **three consumers the compile roster missed** — `warSeatBooks.js`, `npcLadderState.js`,
`npcLadderKernel.js` — which join the roster with reasoned omissions and no edit (R9).

**Version 3 (the first rulings).** R2's writer-reach step, R4's ratified inertness with its
commands, R7's landed preamble rows 10–11 and new hash, the chair's withdrawal of the STALE EM-P2
at placement, and the build lane's first-paint read.

**Version 2 (the reconciliation).**

Version 1 was compiled at `d31af2cee` and then partly revised in place when the chair ruled the
block: its header, §2a and §3 were rewritten to the five-file `NpcStatus` half, but **§2, §5, §6,
§7, §9, §10, §11 and §12 were left carrying the pre-ruling eight-file `EntityStatus` shape** —
`status.js`, `affordanceManifest.js`, `targetRosters.js`, `STATUS_RUINED`, `effectiveStatus` and an
eighth acceptance case that the accompanying `EM-B1d.manifest.json` did not have. Because
`scripts/implementation-packets.mjs` cross-checks only the heading id, the status, the verified base
and the index (`:875-899`) — **never the §7 table against the JSON `changeManifest`** — that
disagreement would have shipped silently and the implementer, reading §7 as the authority, would
have edited three files the manifest never reserved. Version 2 reconciles the whole document to
ODQ §934.47 addenda 6 and 7 and to the manifest, adds nothing the rulings did not order, and then
re-measures every figure against the tip. Four figures moved and are corrected: the
mutation-coverage row count (704 → **705**, so this packet's row is **705 → 706**), the lighting
census tuple (now a register file, `2646/383/2263/25005/6671`), the preamble's hash, and the true
holder of the mutation-coverage path (**EM-P2 at STALE**, not EM-A1 at DRAFT). One obligation was
**added on an executed measurement the compile lane got backwards**: the edge-shared bundle
regeneration (§3.3, §7). R1 and R5 are recorded as RULED rather than re-raised; R6 and R7 are new.

---

## 1. Reconciled authority

1. **ODQ §934.47 addendum 5** (ledger `8f2e7b699`): **ONE SPELLING: `jailed`** —
   `envoyCasting.js`'s `'imprisoned'` and `'killed'` are foreign spellings, replaced by the union's
   own members and made to **READ the union** rather than spell literals; the walker's second arm
   refuses any status literal outside the declared unions anywhere under `src/`. **This packet lands
   BEFORE EM-B1a**, in train T3.
2. **ODQ §934.47 addendum 6** (ledger `427aa5f00`): **`EntityStatus` is NOT widened**; the two
   vocabularies stay apart; `jailed` **JOINS `NpcStatus`** under **J1**; the walker **declares the
   verdict union's exemption by name**; **no surface renders either word until wave 4.**
3. **ODQ §934.47 addendum 7**: ⭐ **the override NARROWS rather than lapses — five existing logic
   files at ≤3 effective lines each plus one walker** (the JSDoc typedef reads as a comment under
   `skipComments`, so the count is four by that reading); **B1d's first arm pins `EntityStatus`
   unchanged at five**; the ruin writer is EM-B1e's.
4. **Design §15** (`docs/DESIGN_EDIT_MODE_AND_DECREES.md:217`): NPC status ∈
   **{active, exiled, jailed, dead, missing, retired, removed}** — the tree's six plus `jailed`,
   *"the owner's word"* (*"present" is `active`, "departed" is `retired`*).
   *"A jailed or exiled holder cannot keep a seat: the holder guard offers a successor (`fulfil`) or
   `proceed`; an exile may return by a later decree."* And `:313`: captivity is **NOT** a new
   `NpcStatus` value — a per-layer fact, *"distinct from `jailed`, which is the DM's own act
   (EM-B1d) and the court's verdict."*
   ⓘ §15 `:217` still reads *"added to the typedef by EM-B1a"*; addendum 5 moved it here and put
   this packet first. `:313` already spells EM-B1d. Doc drift, not a contradiction — noted, R8.
5. **THE PROMISE** — lived history is immutable; no golden moves on this packet.
6. **`EM-PREAMBLE.md`** §P2 (registration costs), §P3 (the census law), §P6 (mutant hygiene), §P7
   (gate-reading; ⭐ *"under a train both move to the terminal"*), §P8 — cited by hash, not restated.
7. **`PACKET_STANDARD.md`** — the budget, the override clause, the hot-file law, the STOP conditions.
8. Live code at the tip, which corrects **three** rows the compile lane wrote (§1.1).

### §1.1 · Resolved contradictions — three corrections, each measured

- ⛔ **`SummaryTab.jsx` is NOT an `EntityStatus` consumer** (compile evidence §3). Its `modStyle`
  map keys the faction MODIFIER vocabulary (`occupied/contested/vacant`, indexed by `f.modifiers`,
  written by `stressFactions.js:111`); `vacant` is a homonym across unrelated unions. **RULED** by
  addendum 6 (*"SummaryTab's badge map keys the faction MODIFIER union, a homonym"*). With the
  `EntityStatus` half withdrawn the file is moot here either way.
- ⛔ **The mutation-coverage path's holder is `EM-P2` at `STALE`, not `EM-A1` at `DRAFT`.** EM-A1
  is not in `PACKET_MANIFEST.json` at all. Version 1 asserted the wrong holder in three places.
  Measured — evidence §13.
- ⛔ **The edge-shared closure IS owed.** Version 1 resolved it on entry-hood; the obligation runs
  on INPUT membership, and `npcs.js` is an input of two committed bundles whose freshness hash is
  taken over raw source text. Proved by execution — evidence §16, priced at §3.3 and §7.

---

## 2a. THE RULING ON THE BLOCK, AND WHAT LEFT THIS PACKET

The compile lane blocked on a measurement: `ruined` is live in **22 non-test files** as the PULSE's
own institution-ruin vocabulary with a writer today, and `rosterProvenance.js:210` states the
separation as law — *"'removed'/'destroyed' is the composer's own `STATUS_REMOVED` vocabulary,
'remnant'/'ruined' is the pulse's."* `jailed` is live as the **VERDICT** vocabulary
(`npcVerdictTable.js:104`). The chair ruled (addenda 6 and 7):

| | ruling | effect here |
|---|---|---|
| `ruined` | **`EntityStatus` is NOT widened**; the two vocabularies stay apart. EM-B1a's `set-institution-state` offers the pool of five and, for `ruined`, writes the pulse's own shape through **EM-B1e's** shared `ruinInstitution` writer | ⛔ **the whole `EntityStatus` half LEAVES this packet** — `status.js`, `affordanceManifest.js` and `targetRosters.js` are not in the roster. **No union but `NpcStatus` changes, so no behaviour-shift measurement is owed** |
| `jailed` | **JOINS `NpcStatus`** — option **J1**: *a verdict handed down and the status it leaves are the same word by design* (the verdict IS the event, the status its consequence) | the walker's arm 2 **declares the verdict union's exemption BY NAME** and refuses every other foreign literal |

⇒ **This packet is the `NpcStatus` half alone: one typedef and four consumers.** The `EntityStatus`
half is not deferred to a later member — it is **withdrawn as unnecessary**, which is a smaller
outcome than the split the compile lane proposed and a better one. ⭐ `EntityStatus` is not merely
absent: **A1 pins it UNCHANGED at its five**, so a later lane cannot widen it here quietly
(addendum 7's own words).

---

## 2. Outcome

**Observable result:** `NpcStatus` carries seven members; every place in `src/` that enumerates it
enumerates all of it; `envoyCasting.js` speaks the union's own words instead of two foreign ones;
and a walker asserts both facts so the next consumer cannot under-enumerate or invent a spelling
without a red.

**Definition of done:** the typedef carries `jailed`; the four consumers enumerate the widened
union; `envoyCasting.js` reads a union rather than literals; the walker's two arms are green;
`EntityStatus` is pinned unchanged at five; the mutation-coverage row is appended surgically; the
two stale edge-shared bundles are regenerated and their freshness suites are green; **no golden
moves.**

In scope: (1) **one behaviour family** — one typed union widens and every enumerator follows;
(2) the one required integration — `envoyCasting.js` re-pointed off its foreign spellings;
(3) the prevention guard — `tests/lint/statusUnionTotality.walker.test.js`;
(4) the registration costs those three incur.

Explicit non-goals: the ops that WRITE these values (`set-npc-status` — **EM-B1a's**, which lands
after this packet); the pulse's shared ruin writer (**EM-B1e's**); any widening of `EntityStatus`
(withdrawn); the pool vocabularies (**EM-A2a's**, which parse this same typedef from source); the
`impairments[]` ledger of typed entries (design §15: it *"remains the EVENTS that explain the
state"*); any new derivation that *reacts* to `jailed` — this packet makes the vocabulary complete
and the enumerations honest, and changes no outcome; any golden, tuning, migration or paid-surface
behaviour; any surface that renders the word (wave 4, addendum 6). Record adjacent discoveries in
the receipt; do not investigate them.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — no new caller | ≤2 |
| New logic-bearing production leaves | `0` | ≤2 |
| New TEST leaves | `1` walker | n/a |
| **Existing logic-bearing production files modified** | **`5`** | ⭐ **≤5 — the NARROWED override (add. 7)** |
| **Maximum delta per modified file** | **`3` effective** | ⭐ **≤3 — the NARROWED override (add. 7)** |
| Additional registration-only files | `1` (`scripts/mutation-coverage-manifest.json`) | ≤3 |
| Handwritten files total | **`7`** (5 MODIFY + walker + the manifest row) | ≤12 |
| Effective lines in the new walker leaf | **~110** — roster 8 rows, exemption register 0 (§6) | ≤250 |
| Generated artifacts (regenerated, not handwritten) | `4` (two edge bundles + two sidecar metas) | n/a |
| New/changed effective production lines | **≤15 (5 × ≤3)** | ≤400 |
| Effective lines per new leaf | `n/a` — creates no production leaf | ≤250 |
| Delta in a shared/hot file | `0` — **no roster file is hot** (§3.1) | ≤15 |
| Acceptance cases | `7` | ≤8 |

**Overrides approved before dispatch:** ⭐ **ODQ §934.47 addendum 7, verbatim** — *"EM-B1d's
override NARROWS rather than lapses: five existing logic files at ≤3 effective lines each plus one
walker (the JSDoc typedef reads as a comment under `skipComments`, so the count is four by that
reading)."* The roster is the typedef file `src/domain/entities/npcs.js` **plus its four consumers**
(`factionLifecycle.js`, `successors.js`, `envoyCasting.js`, `magicFormsPractitioner.js`) — the exact
five the ruling names. Total delta ≤15 of 400; handwritten 7 of 12.

⛔ **THE NARROWED FIGURES ARE A CEILING, NOT A FLOOR TO RENEGOTIATE.** A sixth production file, a
delta above three effective lines in any row, or a second walker is a **STOP** (§11).

### §3.1 · Hot files — measured at the tip, and the one that is hot is NOT in the roster

**No file in the roster is on the standing hot list (`PACKET_STANDARD.md:468`) and none carries a
`scripts/.size-baseline.json` entry** — re-executed for all five at `a41a0e109` (evidence §12). No
headroom measurement is owed under hot-file rule 1. The five are 336, 193, 154, 222 and 258 raw
lines (138, 61, 52, 92 and 70 effective) — none near any ceiling.

⚠ Two hot files are named so a later reader does not mistake a homonym for a roster row:
`src/components/new/tabs/EconomicsTab.jsx` (600/600, **zero** headroom) enumerates supply-chain
status (`'impaired'`, `'vulnerable'`, `'broken'`), a different union; `src/domain/worldPulse/convergence.js`
(798/800, two lines) was in the withdrawn `ruined` roster. ⭐ **The ruling removed the only path by
which this packet could have touched a hot file.**

### §3.2 · ⭐ THE BUNDLE BUDGETS, PRICED (charter amendment 2026-09-19, ODQ §934.19 addendum 2)

Measured three ways, all at `a41a0e109` (evidence §15): the repo's own `manualChunks(id)` called
directly from `vite.config.js`'s default export; the config's exported `EAGER_FIRST_PAINT_MODULES`
queried for membership; and static closures walked with a helper whose `importsOf`/`resolveRel`
bodies are **copied verbatim** from `computeEagerModuleGraph` (`vite.config.js:258-275`).

| emitted chunk | ceiling | slack | which of the five land there | owed |
|---|---:|---:|---|---|
| **generation worker** `generation.worker-*.js` | `WORKER_BUNDLE_CEILING_BYTES = 1401128`, `<=`, re-minted exact | ⛔ **0 B** | **NONE** — a 219-module closure from `src/workers/generation.worker.js` contains none of the five | ⭐ **NOTHING** |
| **lazy `engine`** | `< 679_000` (last measured 678,131) | ~869 B | **NONE** — the rule is `id.includes('/src/generators/')` (`vite.config.js:862`); no file of the five is under it | **NOTHING** |
| **eager `engine-core` / first-paint static closure** | raw `<= 1_048_000`; gzip 337,000; brotli 283,000 (last ratification reading 1,047,205) | ~795 B | **THREE**: `factionLifecycle.js` (routed `engine-core` explicitly), `npcs.js` and `successors.js` (eager via `main.jsx → store/index → settlementSlice → mutateEntities` / `→ settlementSliceHelpers`) | **verification only** |
| **`advanceInterval.worker`** (the pulse/simulation worker) | ⭐ **no byte ceiling exists** — `grep -rn advanceInterval tests/build/` returns nothing; `tests/domain/advanceWorkerByteIdentity.test.js` is a structured-clone DETERMINISM pin, not a bundle ceiling | — | THREE: `npcs.js`, `factionLifecycle.js`, `envoyCasting.js` | **NOTHING** |
| **`townScene.worker`** | none | — | none (18-module closure) | — |
| **edge-shared committed bundles** | source-hash agreement, EXACT | 0 | **`npcs.js`** | ⛔ **OWED — §3.3** |

**The first-paint delta, priced.** `npcs.js`'s edit is a JSDoc typedef — a comment — and
`vite.config.js` sets no `minify` key, so Vite's default esbuild minify strips it: **0 emitted
bytes**. `factionLifecycle.js` gains the token `, 'jailed'` (+10 raw, **+9 minified**).
`successors.js` replaces three literal comparisons with one membership read (neutral or negative).
⇒ **estimated minified growth ≤ 9 B; the STATED BOUND IS THAT ESTIMATE ×2 = ≤ 18 B**, against
~795 B of margin. ⚠ **This is an estimate, not a measurement — this packet runs no build.**

⭐ **The one import edge the packet ADDS is closure-neutral, and that is proved by construction, not
argued:** `successors.js → factionLifecycle.js` joins two modules **both already in**
`EAGER_FIRST_PAINT_MODULES` (measured `true`/`true`), and that set is a transitive-closure fixpoint,
so the edge can add **zero** modules to first paint.

⭐ **No re-mint is owed and no build lane is scheduled here.** `EM-PREAMBLE.md` §P7 rules that under
a train the final gate and the boot smoke **move to the terminal**, and the first-paint arms are
`it.skipIf(!requireDistRead)` — they run only under `VERIFY_DIST=1` after a real build. **T3's
terminal verifies the budgets**; ≤18 B against ~795 B cannot red them. ⛔ Should the terminal's
build show growth beyond the stated 18 B bound attributable to this member's two modules, that is a
**STOP for the chair**, never a lane's ceiling edit (§P7: *"Never raise a baseline, budget, timeout
or ceiling to finish a packet"*).

### §3.3 · ⛔⛔ THE EDGE-SHARED DIRTY-BUILD OBLIGATION — measured, and it IS owed

`scripts/build-edge-shared.mjs:79-80` hashes **every input's RAW SOURCE TEXT**, comments included:
`sha256(inputPaths.map(p => p + ':' + readFileSync(p)).join('\n')).slice(0,16)`. The freshness arm
(`aiCharterBundle.freshness.test.js:91-97`) recomputes exactly that over the live tree and asserts
equality with the recorded `meta.sourceHash`. **Entry-hood is irrelevant; INPUT membership is the
test.** The tool's own metafiles name `src/domain/entities/npcs.js` as an input of two committed
bundles (114 and 115 inputs). Executed with row 1 applied in memory (evidence §16):

```
aiCharterBundle       237061fd5e0b3d71 -> f56a7d2120c34290    GOES STALE
aiOutputSchemaBundle  bac86bfd077b5b43 -> b44dd839381fd0c7    GOES STALE
aiGrounding / analyticsEvents / intentAtlas                   unmoved (npcs.js not an input)
```

⇒ **row 1 alone reds two PLAIN (not dist-gated) suites** unless the packet regenerates and
re-commits four artifacts with `npm run build:edge-shared`. They are GENERATED, so the handwritten
budget is untouched. ⚠ `EM-PREAMBLE.md` §P2 does not list this cost — **R7**.

---

## 4. Sealed dispatch and preflight

```sh
git rev-parse HEAD && npm run implementation:dispatch -- EM-B1d
```

Read check by check against `a41a0e109` (`scripts/implementation-session.mjs`, evidence §14):

| # | check | verdict |
|---|---|---|
| 1 | `dispatch branch mismatch` (`:353`) | the chair's act — the worktree must sit on the verified branch (HZ: one build lane holds it; the chair detaches) |
| 2 | `verified base is not an ancestor of HEAD` (`:182`) | **PASSES** — `merge-base --is-ancestor` exits 0 |
| 3 | `verified-base descendant changed declared substrate` (`:195`) | ⛔ **THROWS naming `scripts/mutation-coverage-manifest.json` IF THE BASE STAYS AT `d31af2cee`.** With the base at the tip, `:184` returns early and this arm never runs |
| 4 | `capsule omitted declared substrate` (`:199`) | passes; the capsule is built from the same list |
| 5 | `CREATE target must be absent and Git-clean` (`:210`) | **PASSES** — the walker is absent and untracked |
| 6 | `non-CREATE target must be Git-clean` (`:213`) | **PASSES** on a clean tree |

⚠ **THE WORKTREE IS SHARED.** Re-read `git rev-parse HEAD` in the same command as the dispatch.
⚠ **PLACEMENT IS JUST-IN-TIME** for the mutation-coverage path — **§7.1**.

---

## 5. Verified tree contract

Every row re-found BY SYMBOL at `a41a0e109` by the pre-proof lane; the five files are
blob-identical to the base, so every line number below is both the base's and the tip's. Commands
in `EM-B1d.evidence.md` §12.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **The union** | `src/domain/entities/npcs.js` | `NpcStatus` (typedef, `:30`) | `'active'\|'dead'\|'missing'\|'exiled'\|'retired'\|'removed'` — six; its own comment explains `removed` comes from the shared entity lifecycle | **+ `jailed`** → seven |
| **Roster absence** | `src/domain/density/factionLifecycle.js` | `ROSTER_ABSENT_STATUSES` (`:75`) | `Object.freeze(['dead','exiled','removed'])`, consumed at `:77` as `ABSENT` — **re-measured at the tip: its only consumer is still its own file** | **+ `jailed`** (design §15: a jailed holder cannot keep a seat) |
| **Successor eligibility** | `src/domain/entities/successors.js` | `inferSuccessors` (`:50`); the filter at `:63` | `n.status !== 'dead' && !== 'removed' && !== 'exiled'` — three literals | **+ `jailed`**, and prefer reading the union |
| ⛔ **The foreign spellings** | `src/domain/worldPulse/envoyCasting.js` | `rosterPersonAvailable` (`:95`) | `:98` — `['dead','killed','missing','exiled','imprisoned'].includes(status)`; **`killed` and `imprisoned` are NOT `NpcStatus` members** | ⛔ **`killed`→`dead`, `imprisoned`→`jailed`, and READ the union** (add. 5) |
| **Practitioner loss** | `src/domain/worldPulse/magicFormsPractitioner.js` | `LOST_NPC_STATUS` (`:79`) | `new Set(['dead','removed','exiled','missing','retired'])`, read at `:147` and `:172`; its header explains it extends successor ineligibility with `missing` and `retired` | **+ `jailed`** |
| ⭐ **Pinned UNCHANGED** | `src/domain/entities/status.js` | `EntityStatus` (typedef) | five members — **NOT this packet's to widen** (add. 6/7) | ⛔ **NO EDIT.** A1 asserts it still parses to exactly five |
| **The verdict union (exempt BY NAME)** | `src/domain/worldPulse/npcVerdictTable.js` | `HOLDING_VERDICT` (`:104`) | `= 'jailed'`; siblings at `:79`, `:437`, `:582`; also `npcLedgerFacets.js:123`, `warAuthorityVerdict.js:22` | T2 **declares these three files exempt with their reason** (add. 6) |
| ⭐ **ROSTER, FOUND BY R6′'s TRIGGER — NOT EDITED** | `src/domain/worldPulse/warSeatBooks.js` | the seat read at `:102` | `String(npc.status \|\| '').toLowerCase() === 'dead' \|\| isOffStage(npc)` returns `null`; its comment: *"their character must never continue making decisions"* | ⛔ **NO EDIT — roster row with the reasoned omission:** *pairs `=== 'dead'` with `isOffStage`, the ONE participation chokepoint (`src/domain/roads/state.js` §8 `:146-161`, built on `isInStasis`); status-based absence joins that chokepoint in* ***EM-B1f***, *not here.* ⚠ A **seat** read — see R9 |
| ⭐ **ROSTER, FOUND BY R6′'s TRIGGER — NOT EDITED** | `src/domain/worldPulse/npcLadderState.js` | the rung filter at `:206` | `if (excludeDead && String(n.status \|\| '').toLowerCase() === 'dead') return;`, paired with `isOffStage(n)` at `:201` | ⛔ **NO EDIT — roster row with the reasoned omission:** *pairs `=== 'dead'` with `isOffStage`, the ONE participation chokepoint (`src/domain/roads/state.js` §8 `:146-161`, built on `isInStasis`); status-based absence joins that chokepoint in* ***EM-B1f***, *not here.* The parameter is literally named `excludeDead` |
| ⭐ **ROSTER, FOUND BY R6′'s TRIGGER — NOT EDITED** | `src/domain/worldPulse/npcLadderKernel.js` | the eligibility walk at `:660` | `\|\| String(member.status \|\| '').toLowerCase() === 'dead' \|\| isOffStage(member)` | ⛔ **NO EDIT — roster row with the reasoned omission:** *pairs `=== 'dead'` with `isOffStage`, the ONE participation chokepoint (`src/domain/roads/state.js` §8 `:146-161`, built on `isInStasis`); status-based absence joins that chokepoint in* ***EM-B1f***, *not here.* |
| ⚠ **Two further live unions, measured** | `src/domain/npc/npcOps.js` `:116`; `src/domain/worldPulse/envoyErrandVocabulary.js` `:118` | `STASIS_REASONS`, `ENVOY_LOSS_CAUSES` | `['journey','imprisoned','missing','sequestered']` (mirrored `pendingEditIntents.js:80`, `settlementPendingEditWriters.js:29`) and `['killed','route_lost','dm_removed']` (read `envoyErrand.js:498/507/599`, `npcDmVerbs.js:537`) | ⛔ **NO EDIT** — design §15 `:313` rules captivity a per-layer fact distinct from `jailed`. **T2's matcher must not convict them — R6** |
| ⛔ **NOT a consumer** | `src/components/new/SummaryTab.jsx` | `modStyle` (`:53`) | Keys `occupied/contested/vacant`, indexed by `f.modifiers`; the writer is `stressFactions.js:111` | ⛔ **The faction MODIFIER union. Do NOT edit** (add. 6) |
| **Test precedent** | `tests/lint/chooserTotality.walker.test.js` | `SCAN_ROOTS` (`:64`); HB-1's A7/A8 | A register walker asserts its table SET-EQUAL to the live scan in BOTH directions with a full offender list | **Copy this shape** for both arms |
| **Enforcer-dir law** | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` (`:36`) | `tests/lint` is the FIRST entry; the meta-test asserts every file under those dirs owns an `invariants` entry | The row this packet appends |
| **Register shape** | `scripts/mutation-coverage-manifest.json` | `invariants` | ⛔ **705** rows at the tip (704 at the base; EM-P0's row landed at `429ceed54`). A `rationale` row is `{kind, rationale}` (inline, ≥40 chars) or `{kind, ref}` | The one row this packet appends, **705 → 706** |
| ⛔ **Edge-shared inputs** | `supabase/functions/_shared/aiCharterBundle.meta.json`, `aiOutputSchemaBundle.meta.json` | `inputs` | 114 and 115 inputs; **both list `src/domain/entities/npcs.js`**; freshness = `sha256` over every input's raw source text | ⛔ **Regenerate both bundles + metas (§3.3)** |

**Forbidden alternatives:** ⛔ no widening of `EntityStatus` or any third status vocabulary, and
**no renaming of an existing member** — this packet ADDS one word and changes nothing else; ⛔ no
edit to `SummaryTab.jsx`, `EconomicsTab.jsx`, `npcOps.js`, `pendingEditIntents.js`,
`settlementPendingEditWriters.js`, `envoyErrandVocabulary.js`, `envoyErrand.js`, `npcDmVerbs.js`, or
any supply-chain status site (all different unions); ⛔ no new derivation that *reacts* to `jailed`;
⛔ no change to the `impairments[]` ledger; ⛔ no whole-file re-serialisation of the
mutation-coverage manifest; ⛔ no hand-edit of `tests/lint/.lighting-census-baseline.json`; no files
outside the manifest.

---

## 6. Exact contracts

### The union, after this packet

```js
/** @typedef {'active'|'dead'|'exiled'|'jailed'|'missing'|'removed'|'retired'} NpcStatus */
```

⛔ **Exactly one member is added. No member is renamed, removed or re-glossed.** `jailed` gains a
gloss naming the seat rule in design §15's words. ⛔ **`EntityStatus` is untouched and A1 pins it at
five.**

### Per-file contract, with the exact delta

| # | file | exact edit | max delta |
|---|---|---|---:|
| 1 | `src/domain/entities/npcs.js` | `jailed` joins the `NpcStatus` union in the typedef; its gloss line names the seat rule. **A JSDoc comment — zero effective lines under `skipComments`** | **≤3** |
| 2 | `src/domain/density/factionLifecycle.js` | `ROSTER_ABSENT_STATUSES` gains `'jailed'` — one token inside the frozen array | **≤3** |
| 3 | `src/domain/entities/successors.js` | the `:63` filter admits `jailed` as ineligible. ⭐ **Preferred form:** import `ROSTER_ABSENT_STATUSES` and test membership, replacing three literals with one read — which is also what makes T2 pass without an exemption. **Measured closure-neutral (§3.2)** | **≤3** |
| 4 | `src/domain/worldPulse/envoyCasting.js` | ⛔ **`'killed'` → `'dead'`, `'imprisoned'` → `'jailed'`, and the list READS a union** (`ROSTER_ABSENT_STATUSES` plus `'missing'`, or the `NpcStatus` members it means) instead of spelling literals | **≤3** |
| 5 | `src/domain/worldPulse/magicFormsPractitioner.js` | `LOST_NPC_STATUS` gains `'jailed'` | **≤3** |

⛔ **A delta above three effective lines in ANY row is a STOP**, not a renegotiation of the override
the chair already narrowed.

### ⭐ T2's MATCHER — ONE SENTENCE, NO DISCRETIONARY WORD (ODQ ruling **R6′**)

**The class this walker exists for is THE ENUMERATION OF NON-ACTIVE MEMBERS.** A consumer that
tests only `=== 'active'` is **total by construction** — every member that ever joins the union is
"not active", so it handles `jailed` correctly without knowing the word. The consumer that breaks
when `jailed` joins is the one that **LISTS** the absent/away statuses, of which
`ROSTER_ABSENT_STATUSES = ['dead','exiled','removed']` is the archetype: a jailed NPC silently
counts as present because nobody added the word. The matcher therefore triggers on the union's
**discriminating subset**, not on the whole union.

> **T2 strips block and line comments from every file under `src/` excluding `**/*.test.*`, flags
> each file whose remaining source contains any of the quoted literals `'dead'`, `'exiled'` or
> `'retired'` — the TRIGGER SET, being the members of the live `NpcStatus` typedef that are members
> of no other declared vocabulary in the tree — and REDS unless every flagged file is either a row
> of the declared consumer roster, whose enumeration must contain every non-`active` member of the
> live typedef or carry a one-line reasoned omission naming the members it leaves out, or a row of
> the declared exemption register naming the foreign vocabulary it belongs to.**

**The trigger set is DERIVED, not authored.** It is the live typedef's members minus the measured
homonyms, so a future member that is unique to this union joins the trigger automatically, and one
that collides with another vocabulary is excluded with its collision named.

⛔ **THE HOMONYMS, AND THE CANNOT-CATCH THEY CREATE — MEASURED, AND STATED IN THE WALKER'S HEADER.**
Executed at `a41a0e109` (evidence §22), code only:

| member | src files | foreign declared vocabularies | verdict |
|---|---:|---|---|
| `'active'` | 74 | **11** — `ACTIVE_STAGES` ×4, `ACTIVE_STRESSOR_STAGES` ×2, `ACTIVE_UI_STAGES`, `ACTIVE_FLOW_STAGES`, `ACTIVE_SYNERGY_STAGES`, `STRESSOR_LIFECYCLE_STAGES`, `THREAT_STAGES` | ⛔ HOMONYM |
| `'removed'` | 30 | **8** — `INACTIVE_STATUS`, `RUIN_STATUS`, `INACTIVE_STATUSES`, `NONSTANDING_STATUS`, `DEAD_ENDPOINT_STATUS`, `TRANSPORT_DOWN_STATUSES`, `RUINED_STATUS`, `DEAD_EDGE_STATUSES` | ⛔ HOMONYM |
| `'missing'` | 5 | **3** — `STASIS_REASONS` (`npcOps.js`, `pendingEditIntents.js`, `settlementPendingEditWriters.js`) | ⛔ HOMONYM |
| `'jailed'` | 3 | **3** — `VERDICTS`, `VERDICT_CAUSES`, `AUTHORITY_VERDICTS` | ⛔ HOMONYM |
| `'dead'` | 8 | **0** | ⭐ **TRIGGER** |
| `'exiled'` | 4 | **0** | ⭐ **TRIGGER** |
| `'retired'` | 1 | **0** | ⭐ **TRIGGER** |

> ⛔ **THE WALKER'S DECLARED CANNOT-CATCH, in its header:** *a consumer that enumerates ONLY the
> homonym members (`active`, `removed`, `missing`, `jailed`) is invisible to this walker, because
> those four words belong to the stressor-lifecycle, institution-status, stasis-reason and verdict
> vocabularies as well as to `NpcStatus`, and triggering on them would cost ~60 declared exemptions
> that say only "this is `ACTIVE_STAGES`, not `NpcStatus`" — a register nobody reads.* **Measured at
> the tip: NO such site exists today.** The one homonym-only `.status` comparison found
> (`src/domain/crisisLifecycle.js`, `n.status === 'active'`) is a **stressor**, not an NPC
> (`const n = normalizeStressor(st)`), and is in any case a single positive test — total by
> construction. Should one ever exist it joins the roster **BY HAND** with that reason.

⭐ **THE EXEMPTION REGISTER IS EMPTY AT THE TIP AND IS THEREFORE INLINE.** The trigger flags **8**
files; **all eight are genuine `NpcStatus` consumers** and **none is a foreign vocabulary**, so
**zero** exemption rows result. An empty register does not earn a sibling data file, so it is
authored inline in the walker as an empty-by-default declaration that a future row can join — which
keeps the leaf's whole contract readable in one place. The roster is eight rows; the register is
zero. **Both are priced in §3 against the leaf's 250-effective cap.**

**Two deliberately different reads of `npcs.js`.** The TRIGGER strips comments, so it does not see
the `NpcStatus` typedef (a JSDoc block); `npcs.js` is flagged on its code instead — `:159`,
`{ ...npc, status: 'dead', removedByEventId: eventId }`, a live writer. The UNION PARSE (T1/A1)
reads the typedef comment on purpose. Both reads are stated so the walker is not self-contradictory.

**The three arms stay.** (1) **Exactness** — roster ∪ register asserted SET-EQUAL, both directions,
to the live flagged set: an unlisted flagged file reds AND a stale row reds. (2)
**Guard-the-guard** — an exempted file must still contain the vocabulary it names, and a roster file
must still contain a trigger token. (3) **The typedef is read LIVE**, so a new member reds every
roster file that does not list it.

### ⛔ The one behaviour change, stated so it can be refused

Rows 2–5 widen predicates that **gate** behaviour, so a world holding an NPC already stored as
`jailed` changes its reading the moment this lands. **Measured at the tip: no writer in `src/`
produces `'jailed'` as a STATUS** — every live site is the verdict union's (evidence §12, §19) —
so on every world that exists the widening is **inert by construction**.

Row 4 is different and is ⭐ **RATIFIED AS INERT BY THE CHAIR (ruling on R4)**: an NPC stored as
`'imprisoned'` or `'killed'` becomes AVAILABLE, and that **changes no behaviour, because no writer
assigns either spelling to `.status`.** The measurement is recorded here so the next reader does not
re-find it:

```sh
# executed at a41a0e109 — the two retired spellings, every live site under src/ (tests excluded)
$ git grep -n "imprisoned" -- 'src/**' | grep -v '\.test\.'
  npcOps.js:116 STASIS_REASONS · pendingEditIntents.js:80 · settlementPendingEditWriters.js:31
  NpcLifecycleControls.jsx:49 (a label) · envoyCasting.js:98 (THIS PACKET'S CURE SITE)
  espionageMissions.js:39 (a comment) · npcVerdictApply.js:334 (rendered prose)
$ git grep -n "'killed'" -- 'src/**' | grep -v '\.test\.'
  envoyErrandVocabulary.js:118 ENVOY_LOSS_CAUSES · envoyErrand.js:498,507,599 (a lossCause)
  npcDmVerbs.js:537 (a cause) · envoyCasting.js:98 (THIS PACKET'S CURE SITE)
# ⇒ NOT ONE SITE ASSIGNS EITHER SPELLING TO `.status`: every live use is a stasis REASON,
#   an errand LOSS CAUSE, a label, a comment or rendered prose. A6 asserts it; A7 proves the
#   matcher fires on a planted writer so the negative is not vacuous.
```

That is the correct reading of a value the vocabulary never held, and it is the reason the golden
posture below is a claim rather than a hope.

### Absence, ordering, determinism

**Absence:** an NPC with no `status` keeps its existing default (`npcs.js:133` — `input.status ||
'active'`); nothing here introduces a new absence rule. **Ordering:** the union's members are
authored in codepoint order so a diff of a future addition is one token; no runtime order changes.
**Determinism:** ⛔ this packet draws no random number, imports no PRNG, reads no clock and adds no
locale-sensitive comparison. ⭐ Three of its files ride `advanceInterval.worker`, whose
structured-clone determinism pin (`tests/domain/advanceWorkerByteIdentity.test.js`) is named in
`checks` for exactly that reason. **Rounding:** none; no figure is produced or rendered, so
prose-numerics is not engaged.

### Flag, dormancy, golden posture

**Flag:** `NONE`. **Dormancy:** the new member is unreachable until **EM-B1a**'s ops can write it,
so this packet lands with the vocabulary complete and no producer — deliberate, and the reason it
lands first. **Golden posture:** ⛔ **UNCHANGED.** `tests/property/generatorGoldenMaster.test.js`
and `tests/property/dossierProseManifest.test.js` must not move by one byte (`EM-PREAMBLE.md` §P3.1);
generation writes no new value, and no widened predicate can fire on data that does not exist.
**Motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Typedef member, frozen at load | the four enumerators | the value persists on NPC records **as it already does** — no new key | unchanged | unchanged | unchanged | ⭐ **NO MIGRATION OWED**: widening a union adds no key and rewrites no stored record; every existing save reads exactly as before | unchanged — no secret is added |

### Receipts, privacy, alignment, edit story

Receipts `NONE`; no DM-only field; no projection change.
**Alignment:** `DECLARED EMPTY: one vocabulary widens; nothing is ranked or judged.`
**Edit story:** `ENGINE-ONLY: the DM's verbs that write this value are EM-B1a's ops, which land
after this packet. This one makes the word exist and the enumerations honest.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/entities/npcs.js` | `NpcStatus` (`:30`) | **+3 eff** | Add `jailed` to the union with a gloss naming the seat rule. Nothing else. ⛔ **This edit alone stales two edge bundles — see the REGENERATE rows.** |
| `MODIFY` | `src/domain/density/factionLifecycle.js` | `ROSTER_ABSENT_STATUSES` (`:75`) | **+3 eff** | Add `'jailed'`. |
| `MODIFY` | `src/domain/entities/successors.js` | the eligibility filter (`:63`) | **+3 eff** | Admit `jailed`; prefer reading `ROSTER_ABSENT_STATUSES` over three literals. |
| `MODIFY` | `src/domain/worldPulse/envoyCasting.js` | `rosterPersonAvailable` (`:95`, list at `:98`) | **+3 eff** | ⛔ Replace `'killed'`→`'dead'` and `'imprisoned'`→`'jailed'`; make the list READ a union. |
| `MODIFY` | `src/domain/worldPulse/magicFormsPractitioner.js` | `LOST_NPC_STATUS` (`:79`) | **+3 eff** | Add `'jailed'`. |
| `CREATE` | `tests/lint/statusUnionTotality.walker.test.js` | arms **T1** and **T2** | **≤250 eff** | The two-armed walker of §8, carrying §6's **R6′** one-sentence matcher, the derived trigger set, the **8-row consumer roster** (five edited + three found, each with its reasoned omission), the **empty** exemption register, the measured CANNOT-CATCH header, and the three arms. ONE literal `describe`, four straight-line `it`, full offender lists. ⛔ `.each`, looped, conditional and nested registration are forbidden (`EM-PREAMBLE.md` §P3.4). **Budget: ~110 effective of ≤250 — roster 8 rows, register 0.** |
| `REGISTER` | `scripts/mutation-coverage-manifest.json` | one `invariants` row keyed the walker | `+1 row` | ⛔ **SURGICALLY, never re-serialised whole. 705 → 706** (704 at the old base). Insert the complete four-line block **immediately before the `"tests/lint/stepPresentationEngineFence.walker.test.js"` key and immediately after the close of `"tests/lint/dossierMountRegistry.walker.test.js"`** — those two keys are file-adjacent at the tip (`:70-73` and `:74`), so this yields a pure **+4 / −0** diff, the exact shape EM-P0's landed row produced. Kind `rationale` with an **inline** `rationale` ≥40 chars carrying the EXECUTED mutant account. ⓘ The object is NOT sorted and no test enforces order — anchor on the two key NAMES, not the line numbers. |
| `REGENERATE` | `supabase/functions/_shared/aiCharterBundle.js` + `aiCharterBundle.meta.json` | the whole artifact | `n/a` | ⛔ **`npm run build:edge-shared` AFTER row 1.** `sourceHash` moves `237061fd5e0b3d71` → `f56a7d2120c34290` (proved by execution, evidence §16). Never hand-edit. |
| `REGENERATE` | `supabase/functions/_shared/aiOutputSchemaBundle.js` + `aiOutputSchemaBundle.meta.json` | the whole artifact | `n/a` | ⛔ Same run, same reason. `bac86bfd077b5b43` → `b44dd839381fd0c7`. |
| `TEST` | `tests/lint/.lighting-census-baseline.json` | the tuple | `n/a` | ⛔ **DEFERRED TO THE TERMINAL — no edit, and it is NOT a generated artifact of this packet** (`EM-PREAMBLE.md` §P2.1). |

**Generated artifacts:** ⛔ **FOUR — the two edge-shared bundles and their two sidecar metas**
(§3.3), regenerated by `npm run build:edge-shared`, never by hand. ⛔ **Version 1 said `NONE`; that
was wrong and is corrected here on an executed measurement.**

### §7.1 · ⛔ THE PLACEMENT COLLISION — measured, reported, the CHAIR'S to decide

```
TERMINAL_PACKET_STATUSES = new Set(['LANDED','SUPERSEDED'])      implementation-packets.mjs:43
reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)      :676
```
`STALE` is **not** terminal. At `a41a0e109` the live holder of `scripts/mutation-coverage-manifest.json`
is **`EM-P2`, status `STALE`, idx 187** — the last packet in the register. **`EM-A1` is not placed
in the tree at all.** Every LANDED holder (EM-P0 among them) reserves nothing.

**If EM-B1d were placed today, `node scripts/implementation-packets.mjs validate` would print
exactly:**
```
duplicate change path across packets: scripts/mutation-coverage-manifest.json (EM-P2, EM-B1d)
```
(from `:697-700`; the earlier array index is named first, so appending EM-B1d after EM-P2 gives
this spelling and inserting it before gives the transposed one.)

⭐ **RULED — THE CHAIR'S ACT AT PLACEMENT:** *"at EM-B1d's placement I withdraw the STALE EM-P2
version 2 from the tree's manifest to the chair kit (the just-in-time rule; its version 3 is being
re-compiled and will be placed fresh)."* ⇒ the path is free the moment EM-B1d is placed, and
**this packet needs no workaround and contains none.** The implementer still verifies it: `node
scripts/implementation-packets.mjs validate` is in `checks` and the dispatch is refused while any
non-terminal packet reserves the path. Re-confirmed at the current tip `816fc95e9`: EM-P2 (idx 187,
STALE) is still the sole non-terminal reserver, and EM-A1 is still not placed.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — `+1 file`, INTERIOR RED** | `files` is the count of test files under `tests/`; one new walker file. Live tuple at the tip is `2646/383/2263/25005/6671` (`tests/lint/.lighting-census-baseline.json`, `measuredBy: EM-P0`). ⛔ **THIS PACKET QUOTES NO ABSOLUTE** — it declares only the DELTA it causes, derived from its own CREATE row: **`+1 files / +0 parked / +1 credited / +4 titles / +1 suiteTitles`** (one literal `describe`, four straight-line `it`). The absolute is the chair's stamp at promotion from the live baseline. Re-derived whole at the terminal, **by the chair, never inside this packet** (`EM-PREAMBLE.md` §P2.1). |
| P2.2 | mutation-coverage row | ⛔ **OWED — priced here** | `tests/lint` is the first ENFORCER DIR (`mutationCoverage.shared.mjs:36`). **705 → 706**, surgical, insertion point named in §7. ⚠ Placement just-in-time — §7.1. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key (`dmLayer`, `decrees`) is read. ⚠ The scanner covers every `.js` under `src/` and five of its files move — so `node scripts/check-observed-shape-readers.mjs` is in `checks` and **motion there is a STOP**, not a cure. |
| P2.4 | writer-reach | ⚠ **AT RISK — measure, do not assume** | This packet edits files **inside** the surface closure (`successors.js` is reachable from display roots and is **not** behind `SURFACE_CLOSURE_STOP`). A widened predicate could change a reader's reach. §8 step 1 captures the baseline and §10 runs the check; a **shrink** is the plain `--write`, **growth is a mint and a chair act**. **R2.** |
| P2.5 | decision-fork / mechanism-coverage | **NOT OWED** | No seeded chooser, no pool, no draw. |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |
| **P2.10** | **edge-shared bundle freshness** | ⛔ **OWED — §3.3** | ⭐ **NOW PREAMBLE LAW: `EM-PREAMBLE.md` §P2 row 10** (landed `4da740b52`), which cites this packet's own measurement: *"The test is INPUT MEMBERSHIP against the bundle metas' own `inputs` lists, never entry-hood: freshness hashes every input's raw source text, so a JSDoc-only edit to `src/domain/entities/npcs.js` stales `aiCharterBundle` and `aiOutputSchemaBundle`."* `npcs.js` is an input of both (114 and 115). Proved by execution — evidence §16. |
| **P2.11** | **byte budgets priced at pre-proof** | **PRICED — §3.2** | ⭐ **`EM-PREAMBLE.md` §P2 row 11** (landed `4da740b52`): every `src/` path is measured against the generation worker's closure (EXACT, zero slack), the lazy engine, `EAGER_FIRST_PAINT_MODULES` and the edge-shared metas. Done: the zero-slack worker and the lazy engine take **nothing**; three files are eager; the bound is ≤18 B against ~795 B. |

> ⛔ **THE CENSUS ROW IS DEFERRED (§417 shape)** — no edit is made and `EM-B1d.manifest.json`
> **omits** the path. Predicted interior red, re-derived at the tip:
> `the estate's file count moved — re-measure, do not re-word: expected 2647 to be 2646`.

---

## 8. Ordered coding sequence

0. Dispatch and seal; re-read `git rev-parse HEAD` in the same command.
1. **Capture the baselines, all four:** the five live census figures; `sha256` of
   `tests/fixtures/generator-golden-master.json`; the `invariants` row count (**705**); and
   `node scripts/check-writer-reach.mjs` output for the P2.4 comparison.
   ⓘ No pre-edit `max-lines` measurement is owed — no roster file is hot (§3.1).
2. Add `tests/lint/statusUnionTotality.walker.test.js` with T1–T2 and their guards, **failing**.
3. Widen the typedef (row 1). ⛔ **Then immediately `npm run build:edge-shared`** and confirm the
   two stale suites go green — doing it here, before the behaviour rows, keeps the regeneration
   attributable to exactly one source edit.
4. Extend the enumerators in the order rows 2–5 are listed, **`envoyCasting.js` last** — it is the
   only row that replaces rather than adds, and doing it last keeps the walker's second arm red
   until exactly that edit, which is its own proof.
5. Wire consumers: **NOT APPLICABLE** — no new caller. Record as skipped.
6. Plant the mutants (§P6), convict, restore digest-exact — **then** write the
   `mutation-coverage-manifest.json` row, whose `rationale` must carry the executed account.
7. Run focused verification (§10).
   ⭐ **THE WRITER-REACH STEP, AS RULED (R2):** run `node scripts/check-writer-reach.mjs` after the
   edits and **RECORD ITS VERDICT IN THE RECEIPT. THE LANE NEVER WRITES A BASELINE.** No movement
   is the expectation — a literal added to a status array adds no property read. **A SHRINK is
   banked by the CHAIR at the landing, through the instrument's own door; GROWTH is a STOP** (§11).
8. ⭐ **THE BUILD LANE READS THE CLOSURE, AS RULED:** take the first-paint static-closure figure
   from a **real** `npm run build` and **quote it in the receipt — no edit, no re-mint.** If the
   closure budget (`CLOSURE_BUDGET_BYTES = 1_048_000`, ~795 B of margin) **would** red, **STOP for
   the chair here rather than discovering it at the terminal** (§11).
9. Hand the train's terminal the census re-derivation and the dist-gated budget arms (§3.2); write
   the completion receipt. ⛔ **Never refreeze the census inside this packet** (§P2.1).

```text
The walker, both arms:
T1  DECLARED EQUALS DISCOVERED, both directions:
    parse NpcStatus's members from its typedef source (src/domain/entities/npcs.js);
    scan the declared enumerator roster (the four rows, by path+symbol);
    assert every enumerator's member set ⊆ the union, and that the union's
    seat-relevant members appear where the roster row declares they must;
    assert EntityStatus still parses to exactly its five, UNCHANGED;
    report a FULL offender list, never a first failure.
T2  NO FOREIGN SPELLING, tree-wide:
    scan src/** (tests excluded) for status literals under the matcher §9/R6 fixes;
    assert every one is an NpcStatus member, EXCEPT the verdict union's three
    declared files (npcVerdictTable.js, npcLedgerFacets.js, warAuthorityVerdict.js),
    exempt BY NAME with their reason; an UNDECLARED file claiming exemption reds;
    a literal outside the union and outside the roster REDS with its file:line.
```

---

## 9. Acceptance matrix

`tests/lint/statusUnionTotality.walker.test.js` (T-arms) and the focused suites of the files it
guards. One literal `describe`, four straight-line `it` in the walker.

| ID | Case | Required observation |
|---|---|---|
| **A1** | **Guard-the-guard; the union exact; `EntityStatus` pinned** | The walk is asserted non-empty first. `NpcStatus` parses to exactly **seven** (`active, dead, exiled, jailed, missing, removed, retired`) — an exact sorted list, never a length, **parsed from its typedef source file** so a typedef edit reds here — and all seven are asserted distinct. ⛔ `EntityStatus` is asserted **UNCHANGED at its five** (`active, destroyed, impaired, removed, vacant`), which makes addendum 7's ruling structural: a later lane cannot quietly widen it here. |
| **A2** | **T1 — declared equals discovered, both directions** | Every one of the four roster rows is found live at its declared path+symbol (a moved or deleted enumerator reds), and each one's member set is a subset of the union, reported as a full offender list. ⭐ A **fifth** enumerator planted in a scratch file is CONVICTED, which is what makes the walker a guard against the next consumer rather than a snapshot of this one. |
| **A3** | **T2 — the R6′ trigger, the roster's totality, and the empty register** | The trigger set is **DERIVED** from the live typedef (its members belonging to no other declared vocabulary) and asserted to be exactly `{dead, exiled, retired}` — a future member unique to the union joins automatically, and the arm **reds if the set comes out empty or single**. The flagged set is asserted **SET-EQUAL, BOTH DIRECTIONS, to roster ∪ register**: an unlisted flagged file reds by name AND a stale row reds. All **eight** flagged files are roster rows; the register is **empty**. Each roster row's enumeration must contain every non-`active` member of the live typedef **or carry its one-line reasoned omission** — so adding `jailed` to the typedef **REDS every roster file that does not list it**, which is the whole point. ⭐ **Guard-the-guard, three arms:** the matcher is proved to fire on a planted literal before any negative is asserted; an exempted file must still contain the vocabulary it names; a roster file must still contain a trigger token. Planting `'imprisoned'` back into `envoyCasting.js` **REDS with its file:line**, and so does a fresh `'killed'`. ⭐ **The CANNOT-CATCH is asserted, not assumed:** the walker pins that no homonym-only site is semantically an `NpcStatus` enumeration at the tip. |
| **A4** | **A consumer that under-enumerates is convicted** | Removing `'jailed'` from `ROSTER_ABSENT_STATUSES` reds T1 by name; removing it from `LOST_NPC_STATUS` reds T1 by name. This is the arm that makes the widening irreversible-by-accident. |
| **A5** | **THE SEAT LAW, executed (design §15)** | A **jailed** NPC is ineligible as a successor (`inferSuccessors`) and absent from the roster (`factionLifecycle.js`'s `ABSENT` set) — asserted through the real functions, not by re-reading the constant. Anchored by an `active` NPC in the same arm who **is** eligible, so the arm cannot pass on an empty roster. |
| **A6** | **`envoyCasting.js` reads the union and spells nothing** | `rosterPersonAvailable` refuses a `jailed` NPC and a `dead` one, admits an `active` one, and a source scan proves the function body contains **no status string literal** — it reads a union. ⭐ The behaviour for the two retired spellings is stated: an NPC stored as `'imprisoned'` or `'killed'` (no writer assigns either to `.status` — §6) is now **admitted**, the correct reading of a value the vocabulary never contained. |
| **A7** | **⛔ NOTHING MOVES: goldens, prose manifest, and the inertness claim** | `generatorGoldenMaster` and `dossierProseManifest` are bytewise unchanged (the fixture digest asserted before and at the tip). ⭐ The inertness is proved rather than argued: a scan shows **no writer in `src/` assigns `'jailed'` to a `.status`** — every live site is the verdict union's — so every widened predicate is unreachable on existing data, with the matcher proved live on a planted writer. **No union but `NpcStatus` changes, so no behaviour-shift measurement is owed** (add. 6). |

**7 of ≤8.** One slot is deliberately left unspent; the eighth case of version 1 tested
`effectiveStatus`'s `ruined` arm and left with the `EntityStatus` half.

⚠ **THE STRICT-TYPECHECK EXHAUSTIVENESS CASE IS DECLARED EMPTY, RE-MEASURED AT THE TIP.**
`git grep -n "switch" -- 'src/domain/entities/**'` returns one hit — `propagate.js:422`, over
`npc?.importance`, a different union. So widening `NpcStatus` can make no `switch` non-exhaustive,
and no case is spent on one. `npm run typecheck:domain:strict` is in `checks` regardless, so a
surface neither lane foresaw still convicts. **R3 stands.**

---

## 10. Verification commands

```sh
npx eslint src/domain/entities/npcs.js src/domain/density/factionLifecycle.js \
  src/domain/entities/successors.js src/domain/worldPulse/envoyCasting.js \
  src/domain/worldPulse/magicFormsPractitioner.js \
  tests/lint/statusUnionTotality.walker.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

npm run build:edge-shared        # AFTER row 1 — §3.3; regenerates four artifacts

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/statusUnionTotality.walker.test.js tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/edgeFunctions/aiCharterBundle.freshness.test.js \
  tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js \
  tests/edgeFunctions/edgeSharedBundleReproducibility.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/advanceWorkerByteIdentity.test.js

# The five modified files' own suites — the implementer resolves each path at preflight
# (`ls tests/domain | grep -iE 'successor|envoy|magicForms|factionLifecycle|npc'`);
# neither lane measured them and neither names one. An unmeasured path is not a verified fact.

node scripts/check-observed-shape-readers.mjs     # five src/ files move — motion is a STOP
node scripts/check-writer-reach.mjs               # P2.4: compare against step 1's baseline
node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B1d
npm run implementation:resume -- EM-B1d
```

Expected: every command exits `0`, **except** the named census interior red until the terminal.
⛔ Never read a gate through a shell pipe (§P7). A member never runs `npm run check`. The
dist-gated bundle-budget arms are T3's terminal act (§3.2).

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: the seal is missing or foreign; HEAD is not
the verified base or a descendant proved non-interfering; **a sixth production file appears
necessary**; **any file's delta exceeds three effective lines**; **a second walker appears
necessary** — all three are the NARROWED override's ceiling, not a floor to renegotiate; a golden or
the prose manifest moves **by one byte**; `check-writer-reach` shows **growth** (a mint is a chair
act, §P2.4); `check-observed-shape-readers` moves; an existing union member would have to be
**renamed or removed** (this packet only adds); `EntityStatus` would have to be widened (add. 6/7 —
that is EM-B1a's and EM-B1e's); a new derivation reacting to `jailed` appears necessary; the
`impairments[]` ledger would have to change; `SummaryTab.jsx`, `EconomicsTab.jsx`, `npcOps.js`,
`pendingEditIntents.js`, `settlementPendingEditWriters.js` or any envoy-loss-cause site appears to
need editing (different unions — §5); the mutation-coverage manifest would need re-serialising
whole, or is dirty from another lane; **the mutation-coverage path is still reserved by a
non-terminal packet at dispatch (§7.1)**; **`npm run build:edge-shared` changes any artifact other
than the four named in §7**; `tests/lint/.lighting-census-baseline.json` would have to be edited here.

⭐ **The four STOPs the rulings added:**
- ⛔ **`check-writer-reach` shows GROWTH** (R2). The lane RECORDS the verdict and **never writes a
  baseline**; no movement is the expectation; a **SHRINK** is banked by the CHAIR at the landing
  through the instrument's own door, and is **not** a lane act either.
- ⛔ **The build lane's real `npm run build` shows the first-paint closure would red**, or shows
  growth beyond §3.2's stated **18 B** bound attributable to this member's modules. **STOP here,
  for the chair — do not let the terminal discover it.** No edit, no re-mint, quote the figure.
- ⛔ **T2's trigger set comes out EMPTY or a single token** when derived from the live typedef, or
  **the exemption register would have to gain a row** (it is empty at the tip, and the eight flagged
  files are all genuine consumers). Either means the homonym measurement has moved and R6′ must be
  re-ruled — **not a lane's choice.**
- ⛔ **A flagged file would have to be EDITED to satisfy the roster** — that is a sixth production
  file against the narrowed override of five (§3). The three files R6′'s trigger found carry
  **reasoned omissions and no edit**; converting any of them into a fix is the chair's, not a
  lane's (R9).

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas, **each
of the five measured with eslint's `Linter` (`skipBlankLines`, `skipComments`) and each proved ≤3**
· acceptance A1–A7 executed · the mutants planted, convicted and restored digest-exact (§P6), **with
the account copied verbatim into the manifest row** · `invariants` count before and after
(705 → 706) and proof the file was not re-serialised, with the `+4 / −0` diff shape quoted · **the
two edge-shared `sourceHash` values before and after regeneration, and proof that exactly four
artifacts moved** · the writer-reach comparison against step 1's baseline · focused commands, exits
and counts · sealed per-step receipt and resume status · both typecheck configurations · gate stages
actually executed · base-versus-wave failure identity diff · dormancy/golden result (fixture digest
before and at the tip) · the no-writer inertness proof · census tuple before and at the tip with the
interior red quoted verbatim · generated artifacts **FOUR, named** · deviations `NONE | STOP` ·
out-of-scope observations without investigation · **judgment calls: `NONE`**.

### §12.1 · Recorded follow-ups (carried forward, not investigated here)

| follow-up | status |
|---|---|
| ⭐ **EM-B1f — the status-based arm at the ONE participation chokepoint** (`isOffStage`, `src/domain/roads/state.js` §8 `:146-161`): a `jailed` or `exiled` NPC is off-stage for **every** participation read, cured ONCE at the chokepoint rather than in the three consumers that pair `=== 'dead'` with it (`warSeatBooks.js:102`, `npcLadderState.js:206`, `npcLadderKernel.js:660`). It is a SIMULATION-PARTICIPATION change and owes its own measurement: does any generated or pulse-written NPC carry `exiled`/`retired`/`missing` today, and would the arm move a pulse golden or the fence? ⓘ The chokepoint's own law already points this way — *"TRAVELERS … are NEVER off-stage — travel is narrative, **captivity is mechanical**"*. | **CHARTERED BY THE CHAIR, 2026-09-19.** Ordered AFTER EM-B1d (it needs the union) and ⛔ **BLOCKS EM-B1a'S PROMOTION** — `set-npc-status` is what makes `jailed` producible, and a producible `jailed` without the chokepoint arm is a jailed mayor who still governs (design §15). |


---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | ✅ **RULED (add. 6).** `SummaryTab.jsx` is not an `EntityStatus` consumer, and *"no surface renders either word until wave 4."* Recorded as settled; not re-raised. |
| **R2** | ✅ **RULED.** The lane runs the writer-reach walker after the edit and **RECORDS its verdict; it never writes a baseline.** No movement is the expectation (a literal added to a status array adds no property read). A **SHRINK is banked by the CHAIR at the landing** through the instrument's own door; **GROWTH is a STOP.** Written as §8 step 7 and a §11 STOP. |
| **R3** | **DECLARED EMPTY on a re-measurement at the tip:** no `switch` branches over `NpcStatus` (the only one under `entities/**` is over `npc?.importance`). If the chair wants an exhaustiveness *guard* minted rather than a case spent, that is a different instrument and its own row. |
| **R4** | ✅ **RATIFIED AS INERT.** An NPC stored as `'imprisoned'` or `'killed'` becoming AVAILABLE changes no behaviour, because no writer assigns either spelling to `.status`. The proving commands and their full site lists are now recorded in §6 beside the ratification, so the next reader does not re-find them. |
| **R5** | ✅ **RULED (add. 7).** The override NARROWS — five existing logic files at ≤3 effective lines each plus one walker. §3 now records the ruling instead of the lapse. Not re-raised. |
| **R6′** | ✅ **RULED AND APPLIED — the trigger is the union's DISCRIMINATING SUBSET.** Measured per member (evidence §22): homonyms `'active'` (74 files / 11 foreign vocabularies), `'removed'` (30 / 8), `'missing'` (5 / 3), `'jailed'` (3 / 3); trigger **`{dead, exiled, retired}`** (8 / 4 / 1 files, **zero** foreign vocabularies each). The trigger flags **8 files**, **all genuine consumers**, so the exemption register is **EMPTY** and is authored **inline** — an empty register does not earn a sibling file, and the whole contract stays readable in one leaf (~110 effective of ≤250). The CANNOT-CATCH is measured and stated in the walker's header, and **no qualifying homonym-only site exists at the tip**. |
| **R7** | ✅ **ACCEPTED AND LANDED** at `4da740b52`: `EM-PREAMBLE.md` §P2 gained **row 10** (edge-shared INPUT membership) and **row 11** (byte budgets priced at pre-proof); the preamble now hashes `1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6` (verified by this lane, and unchanged at the current tip `816fc95e9`). §7's registration ledger now cites rows 10 and 11 by number; the family sweep this lane recommended is now every pre-proof's step. |
| **R9** | ✅ **RULED — the arm is a NEW PACKET, `EM-B1f`, and it belongs to none of the three this lane named.** The cure is not three consumer edits but **ONE arm at the participation chokepoint** (`isOffStage`, `src/domain/roads/state.js` §8 `:146-161`, built on `isInStasis` — a DM-shelved NPC or a roads hostage), because all three consumers pair `=== 'dead'` with it. Not EM-B1d's (vocabulary only; a sixth production file is its own §11 STOP), not EM-B1a's (headless ops, zero modified files), not EM-B1e's (the ruin writer). **Chartered AFTER EM-B1d and BEFORE EM-B1a may be promoted.** Recorded in §12.1; the three roster rows now name the idiom and the owner. |
| **R8** | ✅ **The chair corrects design `:217` on the ledger — nothing for this lane.** ⓘ Recorded because it moved under measurement: the design doc's line numbers shifted by two between this lane's two reads, so the packet now cites **§19 ruling 7** by section and item rather than by line (verified: `## 19. The survey of the simulation's forks …` is the nearest heading above item 7). |
| **R8** | ⓘ **Doc drift, no action forced.** `DESIGN_EDIT_MODE_AND_DECREES.md:217` still reads *"added to the typedef by EM-B1a"*; ODQ §934.47 addendum 5 moved it to EM-B1d and put this packet first, and `:313` already spells EM-B1d. |
