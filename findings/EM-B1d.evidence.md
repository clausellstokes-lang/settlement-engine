# EM-B1d — compile evidence

Every fact `EM-B1d.md` and `EM-B1d.manifest.json` call verified is proved by a command below with
its real output. A fact with no command here is not verified.

**Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`. **Read only** in `$SP/consist`
and the ledger checkout; **wrote only** under `$SP/lane-em-b-scratch/`. No vitest, no eslint, no
writing script.

---

## §0 · The base

`d31af2cee` confirmed at 11:01:32 EDT **before any measurement**; the branch has moved repeatedly
since as the chair's rulings landed. `d31af2cee` **IS an ancestor** of every tip seen, and every
path this packet measures is **blob-identical** across the window (the full comparison is in
`EM-A2a.evidence.md` §0 and re-run for this packet's eight production paths below). Worktree clean
(`git status --short` → no output). Base held at `d31af2cee` under **J-T1**.

```
IDENTICAL  src/domain/entities/npcs.js              IDENTICAL  src/domain/entities/status.js
IDENTICAL  src/domain/density/factionLifecycle.js   IDENTICAL  src/domain/entities/successors.js
IDENTICAL  src/domain/worldPulse/envoyCasting.js    IDENTICAL  src/domain/worldPulse/magicFormsPractitioner.js
IDENTICAL  src/domain/events/affordanceManifest.js  IDENTICAL  src/domain/events/targetRosters.js
```

---

## §1 · ⛔⛔ THE BLOCK — the order's premise, refuted for both words

The override was granted *"because every edit is a mechanical enumeration widening."*

### B-1 · `ruined` is the PULSE's live vocabulary, in 22 files, with a writer

```
$ git grep -ln "'ruined'" -- 'src/**' | grep -v '\.test\.' | wc -l
22
$ git grep -ln "'ruined'" -- 'src/**' | grep -v '\.test\.'
src/domain/institutions/defenseInstitutionBuckets.js   src/domain/institutions/institutionRoster.js
src/domain/institutions/institutionTable.js            src/domain/prose/entryWalker.js
src/domain/provenance/rosterProvenance.js              src/domain/spatial/calamity.js
src/domain/spatial/navalLayer.js                       src/domain/townCartography/cartographyBuildings.js
src/domain/townScene/buildingProfiles.js               src/domain/townScene/cartographyContract.js
src/domain/townScene/manifestContract.js               src/domain/worldPulse/calamityKernel.js
src/domain/worldPulse/causeLifecycle.js                src/domain/worldPulse/convergence.js
src/domain/worldPulse/corruptionWeb.js                 src/domain/worldPulse/institutionLifecycle.js
src/domain/worldPulse/institutionStatusModel.js        src/domain/worldPulse/lineageClaim.js
src/domain/worldPulse/mercenaryMarket.js               src/domain/worldPulse/moralMartialLean.js
src/domain/worldPulse/tierOutcomeApply.js              src/generators/defenseGenerator.js
```

**The writer, and the separation stated as law:**

```
$ sed -n '38,44p' src/domain/institutions/defenseInstitutionBuckets.js
 * Every ruin path (calamityKernel, institutionLifecycle, tierOutcomeApply,
 * settlementLifecycleFirstClass, magicRegimeLifecycle) stamps its row IMMUTABLY —
 * `{ ...inst, status: 'ruined', _worldPulseInactive: true }` — replacing the object in
 * `settlement.institutions` rather than mutating it.

$ sed -n '30p' src/domain/institutions/institutionRoster.js
const INACTIVE_STATUS = new Set(['ruined', 'removed', 'destroyed', 'remnant']);
$ sed -n '247p' src/domain/institutions/institutionTable.js
const RUIN_STATUS = new Set(['ruined', 'removed', 'destroyed', 'remnant']);
$ sed -n '81p' src/domain/provenance/rosterProvenance.js
const INACTIVE_STATUSES = Object.freeze(['removed', 'destroyed', 'remnant', 'ruined']);
$ sed -n '210p' src/domain/provenance/rosterProvenance.js
 * 'removed'/'destroyed' is the composer's own STATUS_REMOVED vocabulary,
 * 'remnant'/'ruined' is the pulse's.
```

⇒ **three refutations, each load-bearing.** (a) A live writer exists, so the widening is **NOT
inert** — A7's inertness proof is withdrawn and a behaviour-shift measurement would be owed
instead. (b) The tree keeps two vocabularies apart **on purpose and says so**; adding `ruined` to
`EntityStatus` merges them halfway (`ruined` in both, `remnant` in neither) — the drift class
ruling (2) exists to kill. (c) The roster is **22+, not 8**.

**And one of the 22 is a hot file:**

```
$ grep -n "convergence.js" docs/implementation/PACKET_STANDARD.md
472:| `src/domain/worldPulse/convergence.js` | 798 | 800 | 2 |
```

⇒ **two effective lines of headroom** against a ceiling `max-lines` reds above, inside a roster the
override caps at nine files.

### B-2 · `jailed` is the VERDICT vocabulary

```
$ git grep -n "'jailed'" -- 'src/**' | grep -v '\.test\.'
src/domain/worldPulse/npcLedgerFacets.js:123:  'jailed',
src/domain/worldPulse/npcVerdictTable.js:79:  'jailed',
src/domain/worldPulse/npcVerdictTable.js:104:export const HOLDING_VERDICT = 'jailed';
src/domain/worldPulse/npcVerdictTable.js:437:  return prisonPresent === true ? 'jailed' : 'banished';
src/domain/worldPulse/npcVerdictTable.js:582:  const outcome = VERDICTS.includes(text(verdict)) ? text(verdict) : 'jailed';
src/domain/worldPulse/warAuthorityVerdict.js:22:  'jailed',
```

⇒ `jailed` is a member of a **third** union — a judicial VERDICT with `banished` as its sibling
and its own exported constant. Putting the token into `NpcStatus` makes one word mean *a verdict
handed down* in one union and *where a person is now* in another. ⚠ **It also means the walker's
ordered second arm cannot ship unamended**: T2 would refuse the verdict table's own literals,
which are correct in their own union.

**Five options are costed at the packet's §2a (U1/U2/U3 for `ruined`, J1/J2 for `jailed`). This
lane adjudicates none.**

---

## §2 · The roster, and the hot-file verdict

```
$ for f in <the eight>; do grep -c "| \`$f\`" docs/implementation/PACKET_STANDARD.md; size-baseline lookup; done
hot=0  src/domain/entities/npcs.js                      no-baseline
hot=0  src/domain/entities/status.js                    no-baseline
hot=0  src/domain/density/factionLifecycle.js           no-baseline
hot=0  src/domain/entities/successors.js                no-baseline
hot=0  src/domain/worldPulse/envoyCasting.js            no-baseline
hot=0  src/domain/worldPulse/magicFormsPractitioner.js  no-baseline
hot=0  src/domain/events/affordanceManifest.js          no-baseline
hot=0  src/domain/events/targetRosters.js               no-baseline
```

⇒ **no roster file is hot and none carries a `scripts/.size-baseline.json` entry**, so no headroom
measurement is owed under hot-file rule 1. ⚠ `EconomicsTab.jsx` **is** hot (600/600) and is **NOT**
in the roster — it enumerates supply-chain status, a third union. Stated as the chair required.

⚠ Near-miss named rather than assumed: `affordanceManifest.js` is **795 raw lines**; §8 step 1
requires an executed `max-lines` measurement before its +3 edit.

## §3 · The roster correction the lane made against itself

```
$ grep -n "modStyle\|modifiers" src/components/new/SummaryTab.jsx | head -3
53:  const modStyle={
82:          const mods=(f.modifiers||[]).concat(f.modifier?[f.modifier]:[]);
88:              const ms=modStyle[mod]||{...};
$ sed -n '111p' src/generators/power/stressFactions.js
(N.modifiers = [...(N.modifiers || []), 'vacant'])
```

⇒ `SummaryTab.jsx` keys the **faction MODIFIER** union, not `EntityStatus`; `vacant` is a homonym.
**It leaves the roster — eight files, not the nine this lane first proposed.** The chair's
requested SummaryTab acceptance case has no site; A8 takes the slot. **RAISED R1.**

## §4 · The exhaustiveness case, declared empty on a measurement

```
$ git grep -n "switch" -- 'src/domain/entities/**' 'src/domain/events/mutateEntities.js'
src/domain/entities/propagate.js:422:  switch (npc?.importance) {
```

⇒ the only `switch` in the family branches over `npc?.importance`, a third union. **No `switch`
branches over either union**, so widening them can make none non-exhaustive and no acceptance case
is spent on one. `typecheck:domain:strict` stays in `checks` regardless. **RAISED R3.**

## §5 · Registration figures

```
$ node -e '<census baseline>'      2645 383 2262 25009 6670
$ node -e '<mutation manifest>'    704 invariants rows
$ grep -n "ENFORCER_DIRS" -A 2 tests/lint/mutationCoverage.shared.mjs
36:export const ENFORCER_DIRS = [
37:  'tests/lint',
```

⇒ census `+1 files / +0 / +1 / +4 titles / +1 suiteTitles`; mutation-coverage **704 → 705**,
surgical, placement just-in-time (EM-A1 holds the path at DRAFT).

⚠ **Edge-shared closure NOT owed** — none of the eight modified files is an entry module named in
`scripts/build-edge-shared.mjs` and the edits add no import edge.
⚠ **Writer-reach is AT RISK, not exempt**: unlike EM-A2a/B1a this packet edits files *inside* the
surface closure (`affordanceManifest.js`, `targetRosters.js`, `successors.js` are not behind
`SURFACE_CLOSURE_STOP`). The baseline is captured at §8 step 1 and the check is in `checks`.
**RAISED R2.**

## §6 · `requiredSymbols` — every row proved present, verbatim

```
3  src/domain/entities/npcs.js                  :: NpcStatus
4  src/domain/entities/status.js                :: EntityStatus
1  src/domain/entities/status.js                :: export const STATUS_VACANT
1  src/domain/entities/status.js                :: export function effectiveStatus
1  src/domain/density/factionLifecycle.js       :: export const ROSTER_ABSENT_STATUSES
1  src/domain/worldPulse/envoyCasting.js        :: export function rosterPersonAvailable
1  src/domain/worldPulse/magicFormsPractitioner.js :: const LOST_NPC_STATUS
1  src/domain/entities/successors.js            :: export function inferSuccessors
1  src/domain/events/targetRosters.js           :: export function buildTargetOptions
1  tests/lint/mutationCoverage.shared.mjs       :: export const ENFORCER_DIRS
1  tests/lint/chooserTotality.walker.test.js    :: const SCAN_ROOTS

$ [ -e tests/lint/statusUnionTotality.walker.test.js ] && echo EXISTS || echo ABSENT
ABSENT
```

## §7 · What this lane did NOT do

Ran no vitest, eslint or writing script. Wrote nothing in the consist or the ledger. Named no
symbol it did not prove present. Did not stamp the preamble's hash. **Raised no budget** — the
override is the chair's and is recorded as a ceiling, not a licence. **Adjudicated nothing:** the
block's five options (U1/U2/U3, J1/J2) are the chair's, and R1–R4 are listed in the packet's §13.


---

## §8 · REVISION — the ruling on the block (ODQ §934.47 add. 6), and the two figures it leaves

**The ruling.** `EntityStatus` is NOT widened; the institution-state contract moves to EM-B1a,
which writes the tree's existing shapes by value. `jailed` joins `NpcStatus` under **J1** — *a
verdict handed down and the status it leaves are the same word by design* — so the walker's second
arm declares the verdict union's exemption **by name**. This packet is the `NpcStatus` half:

```
src/domain/entities/npcs.js                      the typedef, +jailed   (a JSDoc comment: 0 eff)
src/domain/density/factionLifecycle.js:75        ROSTER_ABSENT_STATUSES
src/domain/entities/successors.js:63             the eligibility filter
src/domain/worldPulse/envoyCasting.js:98         'killed'->'dead', 'imprisoned'->'jailed', read the union
src/domain/worldPulse/magicFormsPractitioner.js:79  LOST_NPC_STATUS
```

⇒ **five existing logic-bearing files against a default cap of three.** Total delta ≤15 of 400;
handwritten 7 of 12; only the FILE COUNT exceeds. **The lane does not raise a budget** — §3 records
the figure and RAISES that the override should narrow (≤5 files, ≤3 lines each, one walker)
rather than lapse. One reading makes it four: the typedef edit is a comment and moves zero
effective lines under `skipComments`.

**What left, and the hot file that left with it:**

```
$ grep -n "convergence.js\|affordanceManifest" docs/implementation/PACKET_STANDARD.md
472:| `src/domain/worldPulse/convergence.js` | 798 | 800 | 2 |
```

`convergence.js` (hot, two lines of headroom) was in the `ruined` roster of 22 and is **not** in
this one; `affordanceManifest.js` (795 raw lines) left with the `EntityStatus` half, so its owed
pre-edit `max-lines` measurement is withdrawn. **This packet now touches no file near any ceiling.**

**The verdict union's exemption, measured at its sites:**

```
$ git grep -n "'jailed'" -- 'src/**' | grep -v '\.test\.'
src/domain/worldPulse/npcLedgerFacets.js:123      src/domain/worldPulse/npcVerdictTable.js:79
src/domain/worldPulse/npcVerdictTable.js:104:export const HOLDING_VERDICT = 'jailed';
src/domain/worldPulse/npcVerdictTable.js:437      src/domain/worldPulse/npcVerdictTable.js:582
src/domain/worldPulse/warAuthorityVerdict.js:22
```

⇒ three files, exempt **by name with their reason recorded**; an undeclared file claiming exemption
reds (A3).

## §9 · The ruin path, measured for EM-B1a's contract

```
$ sed -n '250,252p' src/domain/worldPulse/calamityKernel.js
  const ruin = (/** @type {CalInstitution} */ inst, /** @type {string} */ reason) => ({
    ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true,
    worldPulseFate: 'destroyed_by_disaster', remnantReason: reason,
  });
$ grep -n "^export" src/domain/worldPulse/calamityKernel.js | awk -F: '$1<251' | tail -2
180:export function promotesTo(name)      196:export function strikeCapForTier(tier)
```

⇒ **not exported**, and **five keys, two calamity-specific**. Recorded in EM-B1a's contract and
**RAISED as R4 there** with three costed ways forward. This lane names no door it cannot measure.


---
---

# PRE-PROOF RE-MEASUREMENT AT `a41a0e109` (Opus PRE-PROOF lane, session 7d3418f8, 2026-09-19 ~15:1x EDT)

Sections §0–§9 above are the COMPILE lane's and are left untouched. Everything below is a new
measurement executed in `$SP/read-tip-a41a0e109` (detached at `a41a0e109`) by the pre-proof lane.
No gate was run, nothing was implemented, nothing outside `$SP/lane-preproof-EM-B1d-scratch/` was
written.

## §10 · The tip, and the J-T1 window

```
$ git -C $SP/read-tip-a41a0e109 rev-parse HEAD
a41a0e109bdee8fe3a0df082bf35b36d2399301e
$ git status --short
(no output — clean)
$ date
Sat Sep 19 15:10:51 EDT 2026

$ git merge-base --is-ancestor d31af2ceebf643818201b2e2ab4a556765d2fc7c a41a0e109; echo $?
0                                       # d31af2cee IS an ancestor
$ git rev-list --count d31af2cee..a41a0e109
40
```

**THE J-T1 WINDOW** — `diff --stat` over every change-manifest path AND every `requiredSymbols`
path (the exact substrate `assertAncestorAndSubstrate` will diff):

```
$ git diff --stat d31af2ceebf643818201b2e2ab4a556765d2fc7c a41a0e109 -- \
    src/domain/entities/npcs.js src/domain/density/factionLifecycle.js \
    src/domain/entities/successors.js src/domain/worldPulse/envoyCasting.js \
    src/domain/worldPulse/magicFormsPractitioner.js \
    tests/lint/statusUnionTotality.walker.test.js \
    scripts/mutation-coverage-manifest.json tests/lint/mutationCoverage.shared.mjs \
    tests/lint/chooserTotality.walker.test.js
 scripts/mutation-coverage-manifest.json | 4 ++++
 1 file changed, 4 insertions(+)
```

⇒ **exactly one substrate path moved, and it is EM-P0's landed row.** The chair's pre-check at
`023eda2ec` reproduces at `a41a0e109`. The mover:

```
$ git log --oneline d31af2cee..a41a0e109 -- scripts/mutation-coverage-manifest.json
429ceed54 EM-P0 (v2) — the pipeline seam: runPipeline hands `pins` to every step, …
```

The inserted block is a complete `"tests/generators/pipelinePinnedMode.test.js": { "kind":
"rationale", "rationale": "…" },` between `pipelineContract.test.js` and
`pipelineSeedSlotContract.test.js` — **+4 insertions, 0 deletions**, the surgical shape.

**The five production files are blob-identical base → tip** (absent from the stat above), so every
line number in §5 of the packet is unchanged.

```
$ ls tests/lint/statusUnionTotality.walker.test.js
No such file or directory
$ git ls-files --error-unmatch tests/lint/statusUnionTotality.walker.test.js
error: pathspec … did not match any file(s) known to git
```
⇒ **the CREATE target is ABSENT and untracked at `a41a0e109`.**

## §11 · `requiredSymbols`, re-proved VERBATIM at the tip

```
$ for each row: grep -cF "<symbol>" "<path>"
3      src/domain/entities/npcs.js                        :: NpcStatus
1      src/domain/density/factionLifecycle.js             :: export const ROSTER_ABSENT_STATUSES
1      src/domain/worldPulse/envoyCasting.js              :: export function rosterPersonAvailable
1      src/domain/worldPulse/magicFormsPractitioner.js    :: const LOST_NPC_STATUS
1      src/domain/entities/successors.js                  :: export function inferSuccessors
1      tests/lint/mutationCoverage.shared.mjs             :: export const ENFORCER_DIRS
1      tests/lint/chooserTotality.walker.test.js          :: const SCAN_ROOTS
```
⇒ **seven of seven resolve.** No row is owed and none is removed.

## §12 · Every verified fact re-found BY SYMBOL at `a41a0e109` (line numbers unchanged)

```
$ grep -n "@typedef.*NpcStatus" src/domain/entities/npcs.js
30:/** @typedef {'active'|'dead'|'missing'|'exiled'|'retired'|'removed'} NpcStatus

$ grep -n "ROSTER_ABSENT_STATUSES" src/domain/density/factionLifecycle.js
75:export const ROSTER_ABSENT_STATUSES = Object.freeze(['dead', 'exiled', 'removed']);
77:const ABSENT = new Set(ROSTER_ABSENT_STATUSES);
$ git grep -n "ROSTER_ABSENT_STATUSES" -- 'src/**' | grep -v '\.test\.'
src/domain/density/factionLifecycle.js:75  src/domain/density/factionLifecycle.js:77
⇒ STILL TRUE: its only consumer is its own file.

$ grep -n "status !==" src/domain/entities/successors.js
63:    .filter(n => n.status !== 'dead' && n.status !== 'removed' && n.status !== 'exiled')
$ grep -n "export function inferSuccessors" src/domain/entities/successors.js
50:export function inferSuccessors({ outgoing, settlement, limit = 3 }) {

$ grep -n "export function rosterPersonAvailable" -A 3 src/domain/worldPulse/envoyCasting.js
95:export function rosterPersonAvailable(npc) {
98:  if (['dead', 'killed', 'missing', 'exiled', 'imprisoned'].includes(status)) return false;

$ grep -n "LOST_NPC_STATUS" src/domain/worldPulse/magicFormsPractitioner.js
79:const LOST_NPC_STATUS = new Set(['dead', 'removed', 'exiled', 'missing', 'retired']);
147:    if (LOST_NPC_STATUS.has(text(npc.status))) continue;
172:    if (!LOST_NPC_STATUS.has(status)) continue;

$ grep -n "const SCAN_ROOTS" tests/lint/chooserTotality.walker.test.js        -> 64
$ grep -n "export const ENFORCER_DIRS" tests/lint/mutationCoverage.shared.mjs -> 36
```

**R3 re-proved** (no `switch` over the union):
```
$ git grep -n "switch" -- 'src/domain/entities/**' | grep -v '\.test\.'
src/domain/entities/propagate.js:422:  switch (npc?.importance) {
```

**Hot-file status re-proved** — none of the five is hot, none carries a size-baseline entry:
```
hot=0  src/domain/entities/npcs.js                      no-baseline    336 raw / 138 eff
hot=0  src/domain/density/factionLifecycle.js           no-baseline    193 raw /  61 eff
hot=0  src/domain/entities/successors.js                no-baseline    154 raw /  52 eff
hot=0  src/domain/worldPulse/envoyCasting.js            no-baseline    222 raw /  92 eff
hot=0  src/domain/worldPulse/magicFormsPractitioner.js  no-baseline    258 raw /  70 eff
```
(`hot=` is `grep -c "| \`<path>\`" docs/implementation/PACKET_STANDARD.md` against the standing
hot table at `:468`; the raw figures match the packet's §3.1 exactly.)

## §13 · ⛔ THE PLACEMENT COLLISION — measured, reported, NOT solved

```
$ sed -n '43p' scripts/implementation-packets.mjs
const TERMINAL_PACKET_STATUSES = new Set(['LANDED', 'SUPERSEDED']);
$ sed -n '676p;694,701p' scripts/implementation-packets.mjs
    const reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(String(status));
      if (reservesChangePaths) {
        const priorOwner = changePathOwners.get(row.path);
        if (priorOwner && priorOwner !== changeOwnerKey) {
          addError(errors,
            `duplicate change path across packets: ${row.path} (${priorOwner.replace(/^\d+:/, '')}, ${idLabel})`);
        } else changePathOwners.set(row.path, changeOwnerKey);
      }
$ sed -n '21,27p' scripts/implementation-packets.mjs
export const PACKET_STATUSES = Object.freeze([ 'BLOCKED','DRAFT','LANDED','READY','STALE','SUPERSEDED' ]);
```
⇒ `STALE` is **not** terminal, so a STALE packet RESERVES its change paths exactly as READY does.

The live register at `a41a0e109` (188 packets), every holder of the path:
```
  idx=  3 AO-2+3  LANDED  reserves=false      …  (24 further LANDED holders elided)
  idx=186 EM-P0   LANDED  reserves=false   REGISTER
  idx=187 EM-P2   STALE   reserves=TRUE    REGISTER   scripts/mutation-coverage-manifest.json
```
Every `EM-*` packet PLACED in the tree:
```
  idx=182 EM-B3a DRAFT · idx=183 EM-B3b LANDED · idx=184 EM-B3 SUPERSEDED
  idx=185 EM-P3  DRAFT · idx=186 EM-P0  LANDED · idx=187 EM-P2 STALE
```
⇒ ⛔ **`EM-A1` IS NOT PLACED IN THE TREE AT ALL.** The packet's §3/§4/§7 claim that "EM-A1 holds
this path at DRAFT" is false at `a41a0e109`; **the holder is `EM-P2` at `STALE`.**

**What `validate` would say if EM-B1d were placed today** (appended after EM-P2, so EM-P2 is the
prior owner by array index):
```
duplicate change path across packets: scripts/mutation-coverage-manifest.json (EM-P2, EM-B1d)
```
The chair decides (withdrawing the stale EM-P2 to the kit is the precedent). If EM-B1d were instead
inserted BEFORE EM-P2 in the array the same error prints with the names transposed.

⚠ The validator does **not** cross-check the packet Markdown's §7 table against the JSON
`changeManifest`. It checks only heading-id, status, `verifiedBase`, READY's verified branch, and
index agreement (`scripts/implementation-packets.mjs:875-899`).

## §14 · THE SEALED DISPATCH, READ CHECK BY CHECK against `a41a0e109`

`scripts/implementation-session.mjs`:

| # | check (line) | verdict at `a41a0e109` |
|---|---|---|
| 1 | `dispatch branch mismatch: expected <verifiedBranch>, found <branch>` (`:353`) | the chair's act — the worktree must sit on the verified branch (HZ: one build lane holds it; the chair detaches) |
| 2 | `verified base is not an ancestor of HEAD` (`:182`) | **PASSES** — `merge-base --is-ancestor` exits 0 |
| 3 | substrate unchanged since the base (`:184-196`) | ⛔ **THROWS IF THE BASE STAYS AT `d31af2cee`** — see below |
| 4 | `capsule omitted declared substrate` (`:199`) | passes; the capsule is built from the same list |
| 5 | `CREATE target must be absent and Git-clean` (`:210`) | **PASSES** — the walker is absent and untracked (§10) |
| 6 | `non-CREATE target must be Git-clean` (`:213`) | **PASSES** on a clean tree (`git status --short` empty) |

```
$ sed -n '184,196p' scripts/implementation-session.mjs
  if (head === packet.verifiedBase) return;
  const substrate = [...new Set([
    ...packet.changeManifest.filter((row) => row.action !== 'CREATE').map((row) => row.path),
    ...packet.requiredSymbols.map((row) => row.path), … ])].sort();
  … if (changed.length) {
    throw new Error(`verified-base descendant changed declared substrate: ${changed.join(', ')}`);
```
⇒ `REGISTER !== 'CREATE'`, so `scripts/mutation-coverage-manifest.json` **is** in the substrate, and
it changed in the window (§10). Dispatching at HEAD `a41a0e109` with the base still `d31af2cee`
throws:

> `verified-base descendant changed declared substrate: scripts/mutation-coverage-manifest.json`

**THE CURE IS THE CHAIR'S ONE ACT:** set the verified base to `a41a0e109` — then line 184 returns
early and checks 3–4 are skipped entirely. Every other check passes as measured.

## §15 · ⭐ THE BUNDLE BUDGETS, PRICED (charter amendment 2026-09-19, ODQ §934.19 addendum 2)

**How it was measured.** (a) The repo's own routing was asked directly: `vite.config.js`'s default
export was imported and its `build.rollupOptions.output.manualChunks(id)` called per file. (b) The
config's own exported derivation `EAGER_FIRST_PAINT_MODULES` was queried for membership. (c) Static
closures were walked with `closure.mjs` in this lane's scratch, whose `resolveRel` / `importsOf`
bodies are **copied verbatim** from `vite.config.js`'s `computeEagerModuleGraph` (`:258-275`) — the
same static-edges-only rule, so a dynamic `import()` stays a lazy boundary.

```
$ node -e '<import vite.config.js>; manualChunks(ROOT+f)'
   (undefined = rollup decides)  /src/domain/entities/npcs.js
   engine-core                   /src/domain/density/factionLifecycle.js
   (undefined = rollup decides)  /src/domain/entities/successors.js
   (undefined = rollup decides)  /src/domain/worldPulse/envoyCasting.js
   (undefined = rollup decides)  /src/domain/worldPulse/magicFormsPractitioner.js

$ node closure.mjs <tip> src/workers/generation.worker.js
closure size: 219 modules
  OUT  /src/domain/entities/npcs.js          OUT  /src/domain/density/factionLifecycle.js
  OUT  /src/domain/entities/successors.js    OUT  /src/domain/worldPulse/envoyCasting.js
  OUT  /src/domain/worldPulse/magicFormsPractitioner.js

$ node closure.mjs <tip> src/workers/advanceInterval.worker.js
closure size: 549 modules
  IN   npcs.js             <= advanceInterval.worker -> advanceInterval -> pulseKernel -> momentum -> npcs
  IN   factionLifecycle.js <= … pulseKernel -> factionDensityKernel -> factionLifecycle
  IN   envoyCasting.js     <= … pulseKernel -> envoyPulse -> envoyCasting
  OUT  successors.js       OUT  magicFormsPractitioner.js

$ node closure.mjs <tip> src/workers/townScene.worker.js        -> 18 modules, all five OUT

$ node -e '<import vite.config.js>; EAGER_FIRST_PAINT_MODULES.has(ROOT+f)'
   true   npcs.js      true  factionLifecycle.js   true  successors.js
   false  envoyCasting.js                          false magicFormsPractitioner.js
```

**The ceilings, read at the tip:**
```
$ grep -n "WORKER_BUNDLE_CEILING_BYTES =" tests/build/generationWorkerLazy.test.js
138:export const WORKER_BUNDLE_CEILING_BYTES = 1401128;
   …asserted `.toBeLessThanOrEqual(WORKER_BUNDLE_CEILING_BYTES)` at :458, and the header states
   "Re-minting at the exact measurement is what monotone-down means, so this arm is again at
    0 B slack by construction."
$ grep -n "expect(size).toBeLessThan(679_000)" tests/build/vendorPdfLazy.test.js   -> 787
   …last measured 678,131 at 023eda2ec  ⇒ 869 B margin. The chunk's rule is
   `if (id.includes('/src/generators/')) return 'engine';` (vite.config.js:862).
$ grep -n "CLOSURE_BUDGET_BYTES = " tests/build/vendorPdfLazy.test.js   -> 565: 1_048_000
   (gzip 337_000 at :595, brotli 283_000 at :596; last ratification reading 1,047,205 ⇒ 795 B)
$ grep -rn "advanceInterval" tests/build/                               -> (no output)
```

### THE TABLE

| emitted chunk | ceiling | slack | which of the five land there | owed |
|---|---:|---:|---|---|
| generation worker `generation.worker-*.js` | 1,401,128 B, `<=`, re-minted exact | **0 B** | **NONE** (219-module closure, all five OUT) | **NOTHING** |
| lazy `engine` | `< 679,000` | ~869 B | **NONE** — the rule is `/src/generators/`; no file of the five is under it | **NOTHING** |
| eager `engine-core` / first-paint static closure | raw `<= 1,048,000`; gzip 337,000; brotli 283,000 | ~795 B | **THREE**: `factionLifecycle.js` (routed `engine-core` explicitly), `npcs.js` and `successors.js` (eager via `main.jsx -> store/index -> settlementSlice -> mutateEntities` / `-> settlementSliceHelpers`) | **verification only — see below** |
| `advanceInterval.worker` (the pulse/simulation worker) | **NO BYTE CEILING EXISTS** (grep over `tests/build/` returns nothing; `tests/domain/advanceWorkerByteIdentity.test.js` is a structured-clone DETERMINISM pin, not a bundle ceiling) | — | THREE: `npcs.js`, `factionLifecycle.js`, `envoyCasting.js` | **NOTHING** |
| `townScene.worker` | none | — | none | — |
| edge-shared committed bundles | source-hash agreement, EXACT | 0 | **`npcs.js`** | ⛔ **OWED — §16** |

**The first-paint delta, priced.** `npcs.js`'s edit is a JSDoc typedef — a comment — and
`vite.config.js` sets no `minify` key, so Vite's default esbuild minify strips it: **0 emitted
bytes**. `factionLifecycle.js` gains the token `, 'jailed'` (+10 raw, +9 minified).
`successors.js` replaces three literal comparisons with one membership read (neutral or negative).
⇒ **estimated minified growth ≤ 9 B; the stated bound is ×2 = ≤ 18 B**, against ~795 B of margin.
**PLAUSIBLE, not CONFIRMED — this lane ran no build.**

**The one import edge the packet ADDS is closure-neutral, and that is CONFIRMED by construction:**
`successors.js -> factionLifecycle.js` joins two modules that are BOTH already in
`EAGER_FIRST_PAINT_MODULES` (measured `true`/`true` above), and that set is a transitive-closure
fixpoint — so the edge can add **zero** modules to first paint.

**Who runs the build.** `EM-PREAMBLE.md` §P7: *"The final full gate is a bare run with a true exit
plus a separate boot smoke; **under a train both move to the terminal**."* The first-paint arms are
`it.skipIf(!requireDistRead)` and run only under `VERIFY_DIST=1` after a real build. EM-B1d rides
train **T3**, so the dist-gated budget verification is **T3's terminal act**, not a step this
member schedules. No ceiling re-mint is owed: ≤18 B against ~795 B of margin cannot red it.

## §16 · ⛔⛔ THE EDGE-SHARED DIRTY-BUILD OBLIGATION — the compile lane's §5 is REFUTED BY EXECUTION

The compile evidence §5 wrote: *"Edge-shared closure NOT owed — none of the eight modified files is
an entry module named in `scripts/build-edge-shared.mjs`."* **Entry-hood is the wrong test.** The
bundle is the transitive closure of its entry, and its freshness is hashed over EVERY INPUT'S RAW
SOURCE TEXT.

```
$ sed -n '78,82p' scripts/build-edge-shared.mjs
  const inputPaths = Object.keys(result.metafile.inputs).sort();
  const inputContents = inputPaths.map(p => `${p}:${readFileSync(join(ROOT, p), 'utf8')}`).join('\n');
  const sourceHash = createHash('sha256').update(inputContents).digest('hex').slice(0, 16);

$ sed -n '91,97p' tests/edgeFunctions/aiCharterBundle.freshness.test.js
  it('the current source tree matches the recorded hash (regenerate via npm run build:edge-shared)', () => {
    const live = meta.inputs.map(p => `${p}:${readFileSync(join(ROOT, p), 'utf8')}`).join('\n');
    const liveHash = createHash('sha256').update(live).digest('hex').slice(0, 16);
    expect(liveHash, `Bundle is stale. …  Run: npm run build:edge-shared`).toBe(meta.sourceHash);
```
⇒ **raw source text, comments included. A JSDoc-only edit moves the hash.**

Which committed bundles list a packet file as an INPUT (the tool's own metafiles):
```
aiCharterBundle.meta.json        inputs= 114  sourceHash=237061fd5e0b3d71  HITS: src/domain/entities/npcs.js
aiGroundingBundle.meta.json      inputs=  74  sourceHash=9788abb8fdb7287e  HITS: (none)
aiOutputSchemaBundle.meta.json   inputs= 115  sourceHash=bac86bfd077b5b43  HITS: src/domain/entities/npcs.js
analyticsEventsBundle.meta.json  inputs=   2  sourceHash=0a6ba64ce0b8d5e2  HITS: (none)
intentAtlasBundle.meta.json      inputs=   2  sourceHash=9136e063f280d77f  HITS: (none)
```

**EXECUTED PROOF** (`freshness.cjs` re-runs the arm verbatim, once over the tree and once over an
IN-MEMORY tree carrying EM-B1d's row 1; nothing was written):
```
aiCharterBundle         recorded=237061fd5e0b3d71  live=237061fd5e0b3d71  FRESH_NOW=true
                        npcs.js is an input: true   after EM-B1d row 1 = f56a7d2120c34290  GOES_STALE=true
aiGroundingBundle       recorded=9788abb8fdb7287e  live=9788abb8fdb7287e  FRESH_NOW=true
                        npcs.js is an input: false  after EM-B1d row 1 = 9788abb8fdb7287e  GOES_STALE=false
aiOutputSchemaBundle    recorded=bac86bfd077b5b43  live=bac86bfd077b5b43  FRESH_NOW=true
                        npcs.js is an input: true   after EM-B1d row 1 = b44dd839381fd0c7  GOES_STALE=true
analyticsEventsBundle   recorded=0a6ba64ce0b8d5e2  live=0a6ba64ce0b8d5e2  FRESH_NOW=true
intentAtlasBundle       recorded=9136e063f280d77f  live=9136e063f280d77f  FRESH_NOW=true
```

⇒ ⛔ **EM-B1d's row 1 alone reds TWO plain (not dist-gated) suites** —
`tests/edgeFunctions/aiCharterBundle.freshness.test.js` and
`tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js` — unless the packet regenerates and
re-commits the four artifacts. `npm run build:edge-shared = node scripts/build-edge-shared.mjs`
(present in `package.json`). The packet's "Generated artifacts: `NONE`" is therefore wrong and is
corrected in this revision. These are GENERATED, not handwritten, so the handwritten budget (7 of
12) is unaffected.

⚠ `EM-PREAMBLE.md` §P2 does **not** list this registration cost. Every EM member that edits any
module inside those two 114/115-input closures owes it, and none of them knows.

## §17 · THE FIGURES THAT MOVED SINCE `d31af2cee` (the chair's R11 rule)

**The mutation-coverage row count** — the packet says 704 → 705:
```
$ node -e 'console.log(Object.keys(require("./scripts/mutation-coverage-manifest.json").invariants).length)'
705                                       # at a41a0e109
$ (same, over `git show d31af2cee:…`)  ->  704
```
⇒ **at the tip the row is `705 -> 706`.**

**Where the surgical row must now insert.** The `invariants` object is NOT sorted and no test
enforces an order:
```
$ node -e '<keys vs keys.sort()>'    sorted (default JS sort): false     sorted (localeCompare): false
$ grep -n -iE "sort|order|alphabet" tests/lint/mutationCoverageManifest.test.js
159:    const targetFiles = […].sort();   171:    const stale = […].sort();     (both unrelated)
```
But the alphabetical slot for the new key falls between two **file-adjacent** rows, so a pure
`+4 / -0` insertion is available — the exact shape EM-P0's landed row produced:
```
$ sed -n '70,75p' scripts/mutation-coverage-manifest.json
70:    "tests/lint/dossierMountRegistry.walker.test.js": {
71:      "kind": "mutation",
72:      "label": "dossier-mounts/a corpus block leaves the dark list with no mount"
73:    },
74:    "tests/lint/stepPresentationEngineFence.walker.test.js": {
```
⇒ **insert the complete four-line block between line 73 and line 74 at `a41a0e109`** (i.e.
immediately before the `"tests/lint/stepPresentationEngineFence.walker.test.js"` key), anchored by
those two key names rather than by the line numbers.

**The row's required shape** (`tests/lint/mutationCoverageManifest.test.js:113-124`):
```
116:      if (!['mutation', 'rationale', 'uncovered'].includes(entry.kind)) …
121:      if (entry.kind === 'rationale') {
122:        const text = entry.rationale ?? manifest.rationales?.[entry.ref];
123:        if (!text || text.length < 40) problems.push(`${key}: rationale missing/too thin …`);
```
⇒ `{"kind":"rationale","rationale":"<the executed mutant account, ≥40 chars>"}` — the inline form,
which is what EM-P0's landed sibling uses. (`{"kind":"rationale","ref":"<id in manifest.rationales>"}`
is the alternative form, used by the `sovereigntyLightingContract` sibling at `:205`.)
`tests/lint` is confirmed still the FIRST `ENFORCER_DIRS` entry (`mutationCoverage.shared.mjs:36-37`).

**⛔ THE LIGHTING CENSUS TUPLE MOVED.** It no longer lives inline in the walker — it was extracted
to a register:
```
$ grep -n "CENSUS_BASELINE_REL" tests/lint/sovereigntyLightingContract.walker.test.js
546:const CENSUS_BASELINE_REL = 'tests/lint/.lighting-census-baseline.json';
$ cat tests/lint/.lighting-census-baseline.json   (tail)
  "measuredAtSha": "baf8ccc1da4f7e327ad1d4d053ad814a830a90bf",
  "measuredBy": "EM-P0", "date": "2026-09-19",
  "note": "EM-P0: one new test file (the pinned-mode battery)",
  "files": 2646, "parked": 383, "credited": 2263, "titles": 25005, "suiteTitles": 6671
$ git log --oneline d31af2cee..a41a0e109 -- tests/lint/.lighting-census-baseline.json
429ceed54 EM-P0 (v2) — the pipeline seam …
ed9d99295 The lighting census re-derives whole at train EM-T1's terminal … (titles 25009 -> 24998)
```
⇒ the packet's absolute `2645 / 383 / 2262 / 25009 / 6670` is **STALE**. Live:
**`2646 / 383 / 2263 / 25005 / 6671`**. Under the R11 rule the packet now carries the DELTA only and
the predicted interior red becomes **`expected 2647 to be 2646`**. The walker file itself is
blob-identical base→tip (`git diff --stat` empty), so every census LAW the packet cites still holds.

**The preamble moved and is re-stamped:**
```
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
95e9a5f4aee51bb5aaa434883a708c5f2a4c71d2a49aa4ec99f9076a98c2afaa
$ git log --oneline d31af2cee..a41a0e109 -- docs/implementation/preambles/EM-PREAMBLE.md
d86aabae6 … the lighting refreeze [is] the terminal's act, never a packet's step …
c253b9b39 … §P2.1 states what the lighting census counts …            (+5 earlier)
```
§P2.1 now rules explicitly: *"the census is re-derived whole once, at the train's terminal — BY THE
CHAIR, NEVER INSIDE THE PACKET … a packet's §8 never schedules a refreeze and its §7 never lists
the baseline as a generated artifact."* ⇒ the packet's §417-shape deferral is **preamble-compliant**.

## §18 · THE RULINGS THIS PACKET IMPLEMENTS, READ FROM THE LEDGER

`git -C /Users/cstokes/Desktop/settlement-engine show review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md`,
rows `32780` (add. 5), `32781` (add. 6), `32782` (add. 7). The operative clauses:

- **add. 6:** *"`EntityStatus` is NOT widened and the two vocabularies stay apart. `jailed` JOINS
  `NpcStatus` (option J1) … and the union-totality walker declares the verdict union's exemption by
  name. EM-B1d shrinks to the NpcStatus half (the typedef + its four consumers, envoyCasting's
  foreign spellings replaced, the walker with the declared exemption) inside the default budget…
  No surface renders either word until wave 4 (SummaryTab's badge map keys the faction MODIFIER
  union, a homonym)."*
- **add. 7:** *"EM-B1d's override **NARROWS rather than lapses**: five existing logic files at ≤3
  effective lines each plus one walker (the JSDoc typedef reads as a comment under `skipComments`,
  so the count is four by that reading); the EntityStatus half is withdrawn as unnecessary and
  B1d's first arm pins EntityStatus unchanged at five."*

⇒ **R5 is RULED (the override narrows) and R1's consequence is RULED (no surface until wave 4).**
Both are recorded as settled in this revision rather than re-raised.

**Design §15**, from `docs/DESIGN_EDIT_MODE_AND_DECREES.md` on the ledger branch:
```
217:- **NPC status** ∈ { active, exiled, jailed, dead, missing, retired, removed } — the tree's
     `NpcStatus` typedef (`entities/npcs.js`, six values) plus `jailed`, the owner's word … "present"
     is `active`, "departed" is `retired`. … A jailed or exiled holder cannot keep a seat: the holder
     guard offers a successor (`fulfil`) or `proceed`; an exile may return by a later decree.
313: … Captivity (rows 24–26) is NOT a new `NpcStatus` value: it is a per-layer fact
     (`roadsRansomSettlements`, `roadsReturnedCaptives`, `envoyRansomStage`, `foreignGuestHold`), and
     the person's card reads the union — distinct from `jailed`, which is the DM's own act (EM-B1d)
     and the court's verdict.
```
ⓘ §15 line 217 still reads *"added to the typedef by EM-B1a"* — superseded by ODQ §934.47 add. 5
(B1d takes it, and lands BEFORE B1a); line 313 already spells EM-B1d. A doc-drift note for the
chair, not a contradiction of the packet.

## §19 · ⚠ T2's MATCHER: TWO MORE LIVE UNIONS COLLIDE WITH THE RETIRED SPELLINGS

The packet exempts only the VERDICT union. Measured at the tip, **both retired spellings are live
members of OTHER unions that T2 would convict under a token-membership matcher**:

```
$ git grep -n "STASIS_REASONS" -- 'src/**' | grep -v '\.test\.'
src/domain/npc/npcOps.js:116:export const STASIS_REASONS = Object.freeze(['journey', 'imprisoned', 'missing', 'sequestered']);
src/domain/npc/npcOps.js:129                 src/domain/pendingEditIntents.js:80  (a second copy)
src/domain/pendingEditIntents.js:664         src/store/settlementPendingEditWriters.js:29,124
src/components/new/NpcLifecycleControls.jsx:8,202   (+ STASIS_LABELS `imprisoned: 'Imprisoned'` at :49)

$ git grep -n "ENVOY_LOSS_CAUSES" -- 'src/**' | grep -v '\.test\.'
src/domain/worldPulse/envoyErrandVocabulary.js:118:export const ENVOY_LOSS_CAUSES = Object.freeze(['killed', 'route_lost', 'dm_removed']);
src/domain/worldPulse/envoyErrandVocabulary.js:430:export const LOSS_CAUSE_SET = new Set(ENVOY_LOSS_CAUSES);
src/domain/worldPulse/envoyErrand.js:92,498,507,599    src/domain/worldPulse/npcDmVerbs.js:537
```

Design §15 line 313 rules captivity *"a per-layer fact … distinct from `jailed`"*, so these are
deliberately separate layers, not drift. The packet's §8 pseudo-code says T2 scans for
*"status-position string literals"* — a phrase `PACKET_STANDARD.md` forbids leaving to discretion.
Note that the verdict union's own literals are NOT in status position either, yet the packet exempts
them — which shows the compile lane's matcher was **token membership**, and a token matcher convicts
all of the sites above. **RAISED R6: the chair rules the matcher, in one line.**

## §20 · What THIS lane did NOT do

Ran no vitest, no eslint, no npm script, no build. Wrote nothing outside
`$SP/lane-preproof-EM-B1d-scratch/`. Touched neither the consist, nor any lane dir, nor the ledger's
working files (the ledger was read only through `git show`). Stamped no verified base and promoted
no status. Adjudicated nothing: R2, R4, R6 and R7 are listed for the chair.


---

# §21 · THE CHAIR'S RULINGS APPLIED (version 3, same lane, 2026-09-19 ~15:4x EDT)

Sections §0–§20 stand. These are the measurements the rulings required, executed at `a41a0e109`
and re-checked against the consist's current tip.

## §21.1 · The two chair-supplied facts, independently verified

```
$ git cat-file -t 4da740b52                                      -> commit
$ git log --oneline -1 4da740b52
4da740b52 DOC: the EM preamble's §P2 gains two registration costs the pre-proofs found unpriced …
$ git merge-base --is-ancestor 4da740b52 a41a0e109 ; echo $?      -> 1   (landed AFTER this lane's read tip)
$ git cat-file -p 4da740b52:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256
1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6      ✅ matches the chair to the byte
$ git cat-file -p 816fc95e9:docs/implementation/preambles/EM-PREAMBLE.md | shasum -a 256
1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6      ✅ unchanged at the current tip
```
⇒ three hashes are now on the record and all three belong there: `95e9a5f4…` at `a41a0e109` (this
lane's read tip), `1cf54427…` at `4da740b52` (**the hash to stamp**), and the same at `816fc95e9`.

§P2's new rows, verbatim:
```
10. **An edit to any INPUT of an edge-shared bundle closure owes `npm run build:edge-shared` and the
    regenerated artifacts in the member's manifest.** The test is INPUT MEMBERSHIP against the bundle
    metas' own `inputs` lists, never entry-hood … (measured at EM-B1d…)
11. **The byte budgets are priced at pre-proof (ODQ §934.19 addendum 2 …)** … the generation worker's
    closure (`WORKER_BUNDLE_CEILING_BYTES` — EXACT, zero slack), the lazy engine …, the eager
    first-paint set (`EAGER_FIRST_PAINT_MODULES`) and the edge-shared metas.
```

**The `design §19 ruling 7` citation RESOLVES:**
```
$ awk 'NR<=315 && /^#{2,3} /{h=NR": "$0} END{print h}'  <the design doc>
286: ## 19. The survey of the simulation's forks — every option with a place and a condition …
    item 7 … "Captivity (rows 24–26) is NOT a new `NpcStatus` value: it is a per-layer fact …
    distinct from `jailed`, which is the DM's own act (EM-B1d) and the court's verdict."
```
⚠ **The design doc's line numbers MOVED UNDER MEASUREMENT between this lane's two reads** (the same
item was `:313`, now `:315`). The packet therefore cites **§19 ruling 7** by section and item, never
by line — navigate-by-symbol, applied to prose.

## §21.2 · ⛔ THE CONSIST HAS ADVANCED PAST THIS LANE'S READ TIP — substrate re-checked

```
$ git for-each-ref … | grep consist
fixes-2026-09-18-consist  816fc95e9
$ git log --oneline a41a0e109..816fc95e9
816fc95e9 PACKETS: EM-B3a READY at 4da740b52 (version 3, from an Opus pre-proof at the tip) …
4da740b52 DOC: the EM preamble's §P2 gains two registration costs …
$ git merge-base --is-ancestor a41a0e109 816fc95e9 ; echo $?   -> 0
$ git diff --name-only a41a0e109 816fc95e9 -- <all 15 substrate + CREATE paths>
(no output)
```
⇒ ⭐ **THE SUBSTRATE IS STILL UNMOVED.** `816fc95e9` touched only `INDEX.md`,
`PACKET_MANIFEST.json`, `EM-B3a.md` and the preamble. **The base may be stamped at `a41a0e109` OR
at the current tip** — but the tree is moving roughly hourly, so the base must be read and the
one-line window re-run **in the same command as the dispatch.**

**The collision, re-confirmed at `816fc95e9`:**
```
  idx=182 EM-B3a READY · idx=183 EM-B3b LANDED · idx=184 EM-B3 SUPERSEDED
  idx=185 EM-P3 DRAFT  · idx=186 EM-P0 LANDED  · idx=187 EM-P2 STALE
  non-terminal holders of scripts/mutation-coverage-manifest.json:  idx=187 EM-P2 STALE RESERVES
```
⇒ EM-P2 is still the sole non-terminal reserver and EM-A1 is still not placed. The chair's
withdrawal at placement frees the path.

## §21.3 · ⛔⛔ R6 PRICED — THE EXEMPTION REGISTER IS ~60 ROWS, NOT A HANDFUL

The ruling's premise was *"a false positive costs one declared row with its reason."* **Executed,
that premise holds only for the rare tokens; it fails for `'active'` and `'removed'`.**

**(A) Token membership read at its widest — any quoted token anywhere under `src/`:**
```
$ for tok in active dead exiled jailed missing removed retired killed imprisoned; do
    git grep -l "'$tok'" -- 'src/**' | grep -v '\.test\.' | wc -l ; done
  'active'  77 files      'removed'  33 files     'dead'  11 files     'missing'  7 files
  'exiled'   5 files      'killed'    4 files     'imprisoned' 4 files 'jailed'   3 files
  'retired'  2 files
$ git grep -lE "'(active|dead|exiled|jailed|missing|removed|retired|killed|imprisoned)'" -- 'src/**' \
    | grep -v '\.test\.' | sort -u | wc -l
110 distinct files   ⇒ minus the packet's five and the three verdict files = 102 EXEMPTION ROWS
  …including src/components/primitives/DialogClose.jsx, src/components/map/heraldFeed.js, …
```
⇒ **102 rows, exempting files like `DialogClose.jsx`. Not buildable, and not what the ruling's own
key shape can mean** — you cannot key a row by "file + union name" for a loose literal that belongs
to no named union.

**(B) The reading the ruling's key shape requires — a NAMED status vocabulary:** a `const`/`export
const` bound to an array or `Set` literal through any nesting of `Object.freeze(` / `new Set(`,
holding ≥1 of the nine tokens:
```
  rows: 27   (26 by the first probe + warAuthorityVerdict.js's AUTHORITY_VERDICTS, which the probe
              missed because of the `Object.freeze(new Set([` double wrapper — re-found by hand)
  THE PACKET'S OWN (not exemptions):
    factionLifecycle.js  ROSTER_ABSENT_STATUSES   dead+exiled+removed
    magicFormsPractitioner.js LOST_NPC_STATUS     dead+removed+exiled+missing+retired
  THE THREE RULED EXEMPTIONS:
    npcOps.js / pendingEditIntents.js / settlementPendingEditWriters.js  STASIS_REASONS  imprisoned+missing
    envoyErrandVocabulary.js  ENVOY_LOSS_CAUSES   killed
    npcVerdictTable.js VERDICTS · npcLedgerFacets.js VERDICT_CAUSES · warAuthorityVerdict.js AUTHORITY_VERDICTS   jailed
  THE HOMONYM NOISE — 17 rows that all say the same thing:
    institutionRoster.js INACTIVE_STATUS · institutionTable.js RUIN_STATUS · rosterProvenance.js
    INACTIVE_STATUSES · causeLifecycle.js NONSTANDING_STATUS · institutionStatusModel.js RUINED_STATUS
    · lineageClaim.js DEAD_EDGE_STATUSES · foodStockpile.js TRANSPORT_DOWN_STATUSES   (all 'removed')
    WorldPulseData.js ACTIVE_UI_STAGES · threatProfile.js THREAT_STAGES · chronicle.js ACTIVE_STAGES
    · flows.js ACTIVE_FLOW_STAGES · foodStockpile.js ACTIVE_STAGES · narrativeTempo.js ACTIVE_STAGES
    · pestilenceKernel.js + traditionsKernel.js ACTIVE_STRESSOR_STAGES · realmEvents.js ACTIVE_STAGES
    · stressorDynamics.js ACTIVE_SYNERGY_STAGES · stressorsCore.js STRESSOR_LIFECYCLE_STAGES  (all 'active')
```

**(C) The `.status`-comparison arm the "never miss" law requires.** ⚠ The first probe used `\s`,
which POSIX ERE does not support, and returned a **false 1**; redone with `[[:space:]]`:
```
$ git grep -nE "(===|!==|==|!=)[[:space:]]*'(active|dead|…|imprisoned)'" -- 'src/**' | grep -v '\.test\.'
  56 comparison sites across 37 distinct files
  …incl. eleven pulse modules doing `inst.status === 'removed'` (institutionLifecycle.js ×4,
  tierOutcomeApply.js, settlementLifecycleFirstClass.js, calamityKernel.js ×3, spatial/calamity.js,
  rosterProvenance.js) — INSTITUTION statuses, not NpcStatus.
```

**⇒ THE MEASURED ROOT CAUSE:** `'active'` and `'removed'` are members of `NpcStatus` **and** of the
institution/stressor vocabularies. A token matcher cannot tell them apart without knowing the
subject is an NPC. This is the same homonym class as `vacant` in `SummaryTab.jsx` (compile evidence
§3) and as the `ruined`/`remnant` split addendum 6 used to rule the `EntityStatus` half out.

**⇒ WHAT THE PACKET DOES WITH THAT, WITHOUT ADJUDICATING:** it implements the ruling as written —
token membership, declared register keyed by file + union name, shrink-only, set-equal both
directions, guard-the-guard — and **moves the ~60 rows into a sibling data file**
`tests/lint/.status-union-exemptions.json`, on the estate's own precedent: the lighting census tuple
was extracted from its walker for exactly this reason (`CENSUS_BASELINE_REL`; that register's `_doc`
records the conflict that forced it). Dot-prefixed `.json` ⇒ `enumerateInvariants` (which filters
`/\.test\.(js|jsx)$/`) cannot see it, so it owes **no** mutation-coverage row and moves **no** census
figure — the same property the lighting register relies on. **If the chair wants the rows inline,
the walker leaf is re-budgeted or the packet splits; that is recorded as a §11 STOP.**

## §21.4 · R4 — the ratified inertness, with its commands now in the packet

Recorded in §6 so the next reader does not re-find it: every live site of `'imprisoned'` and
`'killed'` under `src/` (tests excluded) is a stasis REASON, an errand LOSS CAUSE, a label, a
comment or rendered prose — **not one assigns either spelling to `.status`.**

## §21.5 · What this lane still did NOT do

Ran no vitest, no eslint, no npm script, no build. Wrote only under
`$SP/lane-preproof-EM-B1d-scratch/`. Read `4da740b52` / `816fc95e9` through `git cat-file` and
`git log` only — no checkout, no fetch, no branch touched. Promoted no status, stamped no base,
stamped no preamble hash. Chose no matcher the ruling did not choose; where the ruling's premise
was refuted by measurement, the measurement is reported and the packet records a STOP.


---

# §22 · R6′ — THE DISCRIMINATING-SUBSET MEASUREMENT (version 4, same lane, 2026-09-19 ~16:0x EDT)

Executed at `a41a0e109`. Method: enumerate every non-test file under `src/` carrying any quoted
`NpcStatus` member; for each member, count its files and find every OTHER declared named vocabulary
(`const NAME = [...]` through any nesting of `Object.freeze(` / `new Set(`) of which it is a member.
A member belonging to another vocabulary is a HOMONYM. Counts below are **code only** — block and
line comments stripped, the `vite.config.js:266-270` convention.

## §22.1 · The per-member homonym table

| member | src files | foreign declared vocabularies | verdict |
|---|---:|---|---|
| `'active'` | **74** | **11** — `ACTIVE_UI_STAGES` (WorldPulseData), `THREAT_STAGES` (threatProfile), `ACTIVE_STAGES` (chronicle, foodStockpile, narrativeTempo, realmEvents), `ACTIVE_FLOW_STAGES` (flows), `ACTIVE_STRESSOR_STAGES` (pestilenceKernel, traditionsKernel), `ACTIVE_SYNERGY_STAGES` (stressorDynamics), `STRESSOR_LIFECYCLE_STAGES` (stressorsCore) | ⛔ HOMONYM |
| `'removed'` | **30** | **8** — `INACTIVE_STATUS` (institutionRoster), `RUIN_STATUS` (institutionTable), `INACTIVE_STATUSES` (rosterProvenance), `NONSTANDING_STATUS` (causeLifecycle), `DEAD_ENDPOINT_STATUS` (corruptionWeb), `TRANSPORT_DOWN_STATUSES` (foodStockpile), `RUINED_STATUS` (institutionStatusModel), `DEAD_EDGE_STATUSES` (lineageClaim) | ⛔ HOMONYM |
| `'missing'` | **5** | **3** — `STASIS_REASONS` (npcOps, pendingEditIntents, settlementPendingEditWriters) | ⛔ HOMONYM |
| `'jailed'` | **3** | **3** — `VERDICTS` (npcVerdictTable), `VERDICT_CAUSES` (npcLedgerFacets), `AUTHORITY_VERDICTS` (warAuthorityVerdict) | ⛔ HOMONYM |
| `'dead'` | **8** | **0** | ⭐ **TRIGGER** |
| `'exiled'` | **4** | **0** | ⭐ **TRIGGER** |
| `'retired'` | **1** | **0** | ⭐ **TRIGGER** |

⇒ **TRIGGER SET = `{dead, exiled, retired}`** — three tokens; neither empty nor single.

## §22.2 · What the trigger flags — 8 files, and 3 of them are NEW

```
$ node r6prime2.cjs     (comments stripped)
flagged files: 8
  ROSTER(own)  src/domain/density/factionLifecycle.js          [exiled,dead]
  ROSTER(own)  src/domain/entities/npcs.js                     [dead]
  ROSTER(own)  src/domain/entities/successors.js               [exiled,dead]
  ROSTER(own)  src/domain/worldPulse/envoyCasting.js           [exiled,dead]
  ROSTER(own)  src/domain/worldPulse/magicFormsPractitioner.js [exiled,retired,dead]
  NEW          src/domain/worldPulse/npcLadderKernel.js        [dead]
  NEW          src/domain/worldPulse/npcLadderState.js         [dead]
  NEW          src/domain/worldPulse/warSeatBooks.js           [dead]
  of which the packet's own five: 5      NEW (need a disposition): 3
```

**THE NUMBERS THE CHAIR ASKED FOR:** trigger tokens **3** · files flagged **8** · of those, the five
known consumers **5** · **NEW consumers 3** · **EXEMPTION ROWS 0** (all eight are genuine
`NpcStatus` consumers; not one is a foreign vocabulary). Zero is far under the ~15 bar, so the
ruling is applied rather than returned.

**The three new consumers, each read in full:**
```
warSeatBooks.js:102   if (String(npc.status || '').toLowerCase() === 'dead' || isOffStage(npc)) return null;
   comment: "The roster keeps dead people as canon … their character must never continue making decisions."
npcLadderState.js:206 if (excludeDead && String(n.status || '').toLowerCase() === 'dead') return;
   with isOffStage(n) at :201 — "BELT (THE ROADS §8): stasis OR a roads hostage — defense-in-depth"
npcLadderKernel.js:660 || String(member.status || '').toLowerCase() === 'dead' || isOffStage(member)) continue;
```
⇒ all three pair `=== 'dead'` with `isOffStage(...)`: a coherent house idiom (*"dead, or off
stage"*), **not** an enumeration of absent statuses. They take **roster rows with reasoned
omissions and NO EDIT** — editing any of them would be a sixth production file against the narrowed
override of five (§11 STOP). ⚠ **`warSeatBooks.js` is a SEAT read and design §15 rules that a jailed
or exiled holder cannot keep a seat** — inert today (no writer produces `jailed` until EM-B1a), but
**RAISED AS R9** for the chair to place.

## §22.3 · R6′(4) — the CANNOT-CATCH, probed rather than assumed

Probe: every non-test `src/` file carrying a homonym but **no** trigger token, scanned for a
`.status` comparison whose subject reads as a person (`npc|member|person|holder|candidate|n`).

```
R6'(4) CANNOT-CATCH PROBE: homonym-only sites whose subject is an NPC
  src/domain/crisisLifecycle.js
     return n.status === 'active'
```
**One hit, and it is a false positive of the probe, not a site:**
```
$ sed -n '654,657p' src/domain/crisisLifecycle.js
  const raw = (worldStressors || []).find(st => {
    const n = normalizeStressor(st);
    return n.status === 'active'
```
`n` is a **STRESSOR**, not an NPC — the probe matched the bare variable name. And it is a single
positive test, which is **total by construction** under the chair's own insight.

⇒ **NO site exists at the tip that enumerates only homonym members and is semantically an
`NpcStatus` enumeration.** Nothing joins the roster by hand. The walker's header states the
cannot-catch anyway, and A3 pins it so the claim is re-checked on every run.

## §22.4 · Two deliberately different reads of `npcs.js`

```
$ grep -n "'dead'" src/domain/entities/npcs.js
30:/** @typedef {'active'|'dead'|'missing'|'exiled'|'retired'|'removed'} NpcStatus     <- a COMMENT
159:  const dead = ({ ...npc, status: 'dead', removedByEventId: eventId });            <- CODE
```
The TRIGGER strips comments, so it flags `npcs.js` on `:159` — a live writer of `status: 'dead'`.
The UNION PARSE (T1/A1) reads the `:30` JSDoc on purpose. Both reads are stated in the walker so it
is not self-contradictory. ⓘ `:159` also sharpens A7: there **is** a writer of `'dead'`, and there
is **none** of `'jailed'` — which is exactly why the widening is inert.

## §22.5 · What the ruling changed in the packet

Trigger derived, not authored (a future unique member joins automatically). Roster **8** rows;
register **0**, therefore **inline** — an empty register does not earn a sibling file, and the
sibling `CREATE` row added under the withdrawn option (b) is **removed**. Handwritten files back to
**7**; walker leaf **~110 effective of ≤250**. ⭐ **The lighting delta is UNCHANGED** —
`+1 files / +0 parked / +1 credited / +4 titles / +1 suiteTitles` — because the withdrawn register
was a dot-prefixed `.json` that `enumerateInvariants` (`/\.test\.(js|jsx)$/`) never counted, so
removing it moves no census figure.


---

# §23 · R9 RULED — EM-B1f, THE CHOKEPOINT ARM (version 4, same lane, 2026-09-19 ~16:1x EDT)

## §23.1 · The chair's citation, verified before it was written into the packet

```
$ grep -n "PARTICIPATION CHOKEPOINT" src/domain/roads/state.js
146:// ── §8 THE ONE PARTICIPATION CHOKEPOINT ────────────────────────────────────────
$ sed -n '147,161p' src/domain/roads/state.js
 * Is this NPC OFF-STAGE — excluded from every participation read? Built ON the existing
 * stasis predicate (npcOps.js:151): a DM-shelved NPC (isInStasis) OR a roads hostage
 * (whereabouts.state === 'hostage'). TRAVELERS (outbound/visiting/returning) are NEVER
 * off-stage — travel is narrative, captivity is mechanical (§1 law 5). … Pure, total.
export function isOffStage(npc) {
  if (isInStasis(…(npc))) return true;
  const w = … npc.whereabouts …;
  return !!(w && … w.state === 'hostage');
}
$ sed -n '34p' src/domain/roads/state.js
import { isInStasis } from '../npc/npcOps.js';
```
⇒ the citation resolves exactly as the chair read it. ⭐ **And the chokepoint's own stated law
argues for the arm:** *"travel is narrative, **captivity is mechanical**"* — a `jailed` NPC is
captivity, so it is mechanically off-stage. ⓘ Measured: `isOffStage` reads **only** `isInStasis` and
`whereabouts.state`; it **never reads `.status`**, which is precisely why a status-based arm is new
work and why one arm there reaches all three consumers at once.

## §23.2 · Why the manifest needs NO change — checked field by field

| field | check | verdict |
|---|---|---|
| `changeManifest` (11 rows) | does any row name `warSeatBooks.js`, `npcLadderState.js` or `npcLadderKernel.js`? | **NO** — the ruling is *no edit*, so no row is owed |
| `requiredSymbols` (9 rows) | must anything in those three be PRESERVED by this deliverable? | **NO** — the walker reads them by path through its roster, not by a preserved symbol |
| `acceptanceCases` (7 of ≤8) | does A3 already bind the roster generically? | **YES** — A3 asserts roster ∪ register set-equal to the live flagged set and each row total **or** carrying its reasoned omission; the three rows are data inside the walker, not new cases |
| `checks` (11) | does a documentation-only change owe a new suite? | **NO** |
| budget | files modified / handwritten / leaf lines | **unchanged** — 5 / 7 / ~110 of ≤250 |
| census | does anything move the lighting tuple? | **NO** — no file is created or deleted |

```
$ git diff --name-only d31af2cee 816fc95e9 -- src/domain/worldPulse/warSeatBooks.js \
    src/domain/worldPulse/npcLadderState.js src/domain/worldPulse/npcLadderKernel.js \
    src/domain/roads/state.js
(no output)
```
⇒ all four are **unmoved across the entire window**, base → current tip. None is substrate, so the
J-T1 window and the dispatch's substrate arm are untouched by this ruling.

## §23.3 · What changed in the packet

The three roster rows now carry the ruled omission — *"pairs `=== 'dead'` with `isOffStage`, the ONE
participation chokepoint (`src/domain/roads/state.js` §8 `:146-161`, built on `isInStasis`);
status-based absence joins that chokepoint in **EM-B1f**, not here"* — and **§12.1 · Recorded
follow-ups** carries EM-B1f as **chartered by the chair, 2026-09-19; ordered after EM-B1d and
⛔ blocking EM-B1a's promotion**, with the measurement it owes named (does any generated or
pulse-written NPC carry `exiled`/`retired`/`missing` today, and would the arm move a pulse golden or
the fence?). §13's R9 is marked RULED. **Nothing else changed.**
