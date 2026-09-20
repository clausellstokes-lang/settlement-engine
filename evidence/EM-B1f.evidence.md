# EM-B1f — evidence (the Opus COMPILE lane's receipts)

Every fact the packet asserts is proved here by a quoted command and its output. A fact
without a command is not verified. Tree read: `$SP/read-tip-58fcfe614`, detached.

```sh
$ git -C $SP/read-tip-58fcfe614 rev-parse HEAD
58fcfe61458b784b0470b854caf916b7c2961edf
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6  docs/implementation/preambles/EM-PREAMBLE.md
```
⇒ the preamble hash equals the chair's stamp in `LANE-EM-COMPILE-2.md`. CONFIRMED.

---

## §1 · The chokepoint as it stands (`src/domain/roads/state.js`)

```sh
$ wc -l src/domain/roads/state.js
     595 src/domain/roads/state.js
$ grep -n "isOffStage" src/domain/roads/state.js
15: * isOffStage (§8, built ON the existing isInStasis); the DORMANCY GATE roadsActive (the
157:export function isOffStage(npc) {
$ sed -n '147,163p' src/domain/roads/state.js
```
```js
// ── §8 THE ONE PARTICIPATION CHOKEPOINT ────────────────────────────────────────
/**
 * Is this NPC OFF-STAGE — excluded from every participation read? Built ON the existing
 * stasis predicate (npcOps.js:151): a DM-shelved NPC (isInStasis) OR a roads hostage
 * (whereabouts.state === 'hostage'). TRAVELERS (outbound/visiting/returning) are NEVER
 * off-stage — travel is narrative, captivity is mechanical (§1 law 5). Presence-driven:
 * the whereabouts key only exists when the mover wrote it, so a dark world reduces this to
 * isInStasis exactly ⇒ byte-identical. Pure, total.
 * @param {unknown} npc
 * @returns {boolean}
 */
export function isOffStage(npc) {
  if (isInStasis(/** @type {Parameters<typeof isInStasis>[0]} */ (npc))) return true;
  const w = npc && typeof npc === 'object' ? /** @type {Record<string, unknown>} */ (npc).whereabouts : null;
  return !!(w && typeof w === 'object' && /** @type {Record<string, unknown>} */ (w).state === 'hostage');
}
```
⇒ **it never reads `.status`.** The charter's premise CONFIRMED at the tip.

```sh
$ grep -n "isInStasis" src/domain/npc/npcOps.js | sed -n '1,4p'
116:export const STASIS_REASONS = Object.freeze(['journey', 'imprisoned', 'missing', 'sequestered']);
151:export function isInStasis(npc) {
$ sed -n '149,153p' src/domain/npc/npcOps.js
/** True when an NPC is on the stasis shelf (the participation-exclusion predicate the
 *  buildWorldSnapshot chokepoint filters on). @param {OpNpc} npc */
export function isInStasis(npc) {
  return !!(npc && typeof npc === 'object' && npc.stasis);
}
```

---

## §2 · MEASUREMENT 2 — the FULL `isOffStage` consumer census

```sh
$ git grep -n "isOffStage" HEAD -- 'src' 'tests' 'scripts' 'supabase' 'e2e' 'api'
src/domain/roads/state.js:15 (header) · :157 (the definition)
src/domain/worldPulse/envoyCasting.js:51 (import) · :96
src/domain/worldPulse/npcLadderKernel.js:82 (import) · :661
src/domain/worldPulse/npcLadderState.js:18 (import) · :201
src/domain/worldPulse/pulseKernel.js:2633 (a COMMENT, no call)
src/domain/worldPulse/roadsKernel.js:36 (import) · :474 · :928
src/domain/worldPulse/warSeatBooks.js:33 (import) · :102
src/domain/worldPulse/worldSnapshot.js:8 (import) · :114/:117 (comments) · :127 · :129
tests/domain/roadsParticipation.test.js:71,124 (comments)
tests/domain/roadsState.test.js:8,30,32,33,36,39,40,41,44,45,46
tests/lint/postureNameCollision.walker.test.js:165 (a STRING FIXTURE, not a call)
```

**SEVEN live call sites across SIX modules.** What each does with an off-stage NPC:

| # | module | symbol | site | effect |
|---|---|---|---|---|
| 1 | `worldSnapshot.js` | `buildWorldSnapshot` participation view | `:127`, `:129` | FILTERED OUT of `snapshot.byId.get(sid).settlement.npcs` — the settlement every pulse kernel reads. The RAW `save.settlement.npcs` is untouched. |
| 2 | `npcLadderState.js` | `eligibleMembersOf` | `:201` | skipped — never ladder-eligible (the BELT, defense-in-depth) |
| 3 | `npcLadderKernel.js` | prior-governing bridge | `:661` | skipped — never revived onto a stale rung |
| 4 | `warSeatBooks.js` | `rosterNpcById` (module-private) | `:102` | returns `null` — the SEAT read yields no holder |
| 5 | `envoyCasting.js` | `rosterPersonAvailable` | `:96` | `false` — refused to the diplomatic AND the covert draw |
| 6 | `roadsKernel.js` | mission advance | `:474` | the mission is CANCELLED (quiet, no roll) |
| 7 | `roadsKernel.js` | traveller candidate scan | `:928` | never selected to travel |

Exact texts of the three sites the charter names as pairing `=== 'dead'` with the predicate:

```sh
$ sed -n '102p' src/domain/worldPulse/warSeatBooks.js
    if (String(npc.status || '').toLowerCase() === 'dead' || isOffStage(npc)) return null;
$ sed -n '201p;205p' src/domain/worldPulse/npcLadderState.js
    if (isOffStage(n)) return; // BELT (THE ROADS §8): stasis OR a roads hostage — defense-in-depth
    if (excludeDead && String(n.status || '').toLowerCase() === 'dead') return;
$ sed -n '659,661p' src/domain/worldPulse/npcLadderKernel.js
          if (!nid || !member || eligibleNids.has(nid)
            || String(member.status || '').toLowerCase() === 'dead'
            || isOffStage(member)) continue;
```
⇒ all three already lowercase-normalise `.status`, so the arm's idiom matches theirs. **They need
no edit: widening `isOffStage` reaches them.** CONFIRMED.

### ⭐ IS ANY CONSUMER A DISPLAY SURFACE? — NO. Measured.

```sh
$ git grep -n "buildWorldSnapshot" HEAD -- 'src'
src/domain/autonomy/signalRegistry.js:33,247 · src/domain/worldPulse/applyWorldPulse.js:49,1215
src/domain/worldPulse/partyImpact.js:29,430 · src/domain/worldPulse/pulseKernel.js:11,348,435,823,…
src/store/aiSlice.js:116,122   (+ JSDoc/comment mentions in deriveRegionalState, neutralNeighbourEdges, warReasons, npcOps, roadsKernel, simulationRules)
$ grep -n "^import" src/domain/display/worldSnapshotPublic.js | head -20
36:import { sanitizePublicValue } from './publicSafe.js';
37:import { deityNameFromSnapshots } from './deityNames.js';
```
- `isOffStage` has **zero** importers under `src/components/**`, `src/domain/display/**` or
  `src/store/**` (the census above is the whole list).
- `worldSnapshotPublic.js` (the gallery/public veil) does **not** import `buildWorldSnapshot`.
- The dossier reads the SAVE, whose roster the chokepoint never touches — pinned by the estate's
  own live test: `tests/domain/roadsParticipation.test.js` — *"the raw save roster is UNTOUCHED —
  off-stage NPCs persist (no-death; nothing dropped)"*.

⇒ **No caller would wrongly hide a jailed person from a display surface.** A jailed NPC still
appears in the dossier as jailed; absence from participation is not absence from the record.
The ONE non-pulse consumer is `src/store/aiSlice.js:116-122`, which builds the AI context from the
participation view — a jailed NPC becomes invisible to the AI exactly as a hostage already is,
which is the chokepoint's existing semantics, not a new rule. **NAMED, not a defect.**

---

## §3 · MEASUREMENT 1 — every WRITER of an NPC's `.status`, and the producibility of `exiled`

```sh
$ git grep -nE "\.status\s*=[^=]" HEAD -- 'src' 'supabase'
(no output)
$ git grep -nE "status:\s*'(active|dead|missing|exiled|retired|removed|jailed)'" HEAD -- 'src' 'supabase' 'scripts'
(no output)
$ git grep -nE "\.\.\.(npc|n|member|person|holder|figure)[^}]*status" HEAD -- 'src'
src/domain/entities/npcs.js:159:  const dead = /** @type {NpcStructural} */ ({ ...npc, status: 'dead', removedByEventId: eventId });
```
Plus a full scan of every `status:` / `.status =` / `status,` line in every `src/` file that
mentions npc/roster (`scan-status-writers.mjs`, 238 candidate lines, triaged by hand):

**THE COMPLETE WRITER SET — six, by module and symbol:**

| # | module | symbol | value it can write |
|---|---|---|---|
| 1 | `src/domain/entities/npcs.js:133` | `createNpc` | `input.status || 'active'` — a PASS-THROUGH of whatever a caller supplies |
| 2 | `src/domain/entities/npcs.js:159` | `killNpc` | `'dead'` (literal) |
| 3 | `src/domain/entities/npcs.js:250` | `assignNpcToRole` | `'active'` (literal) |
| 4 | `src/generators/factionRoles.js:251` | the structural-seat synthesis | `'active'` (literal) |
| 5 | `src/domain/worldPulse/magicFormsPractitioner.js:211` | `mintTiedPractitioner` | `'active'` (literal) |
| 6 | `src/store/settlementSliceHelpers.js:220,223` | `stripImpairmentsForEvent` (UNDO) | `'active'` (literal; shared with institutions/factions) |

**Every caller of `createNpc` — none supplies a non-`active` status:**
```sh
$ git grep -n "createNpc(" HEAD -- 'src' 'supabase' 'scripts'
src/domain/entities/npcs.js:121 (the definition) · :248 (status: 'active')
src/domain/events/mutateEntities.js:456 (ADD_FACTION founder — no status key)
src/domain/events/mutateEntities.js:499 (addNpc, the ADD_NPC applier — ENUMERATES its fields; NO status)
src/domain/events/mutateEntities.js:582 (assignNpcMutation fallback — { name } only)
src/domain/worldPulse/factionDensityKernel.js:481 (foundingMemberForEmergence — no status key)
src/domain/worldPulse/magicFormsPractitioner.js:211 (status: 'active')
```
`addNpc` (`:499-513`) lists `name, role, importance, linkedInstitutionIds, linkedFactionIds,
influence, legitimacyContribution, flaw, temperament, goal, constraint, secret, _idSeed` and
**does not forward `event.payload.status`** — so the event layer cannot mint one either.

**No preset, data file, golden or AI schema carries one:**
```sh
$ git grep -nE "status['\"]?\s*:\s*['\"](exiled|jailed|missing|retired|removed|dead)" HEAD -- 'src/data' 'tests' 'e2e' 'public'
(no output)
$ git grep -nE "status.{0,60}(enum|active.*dead|dead.*active)" HEAD -- supabase/functions/_shared/aiOutputSchemaBundle.js src/lib/ai.js src/domain/ai
(no output)
```

⚠ **THE PRECISE STATEMENT, because a literal grep under-reads it.** Four TEST files DO construct
in-test NPCs bearing `exiled`, through helper default-arguments rather than a `status:` literal —
which is why the grep above is silent on them, and why they are named here rather than left for a
build lane to hit:

```sh
$ grep -n "const figure\|const factor" tests/generators/densityLaw.test.js
951:const figure = (name, affiliation, status = 'active') => ({ name, factionAffiliation: affiliation, status });
1402:  const factor = (house, status = 'active') => ({ id: `npc.${house}`, …, status });
   used with 'exiled' at :992 and :1436
$ for f in densityLaw npcs.property magicFormsPractitioner successors; do …grep -c chokepoint symbols…; done
tests/generators/densityLaw.test.js            chokepoint consumer import: 3
tests/property/npcs.property.test.js           chokepoint consumer import: 0
tests/domain/magicFormsPractitioner.test.js    chokepoint consumer import: 0
tests/domain/successors.test.js                chokepoint consumer import: 0
```
⇒ **NONE of the four routes an `exiled`-bearing NPC through a chokepoint consumer**, so the arm
moves no existing test:
- `densityLaw.test.js`'s two `exiled` fixtures (`:992`, `:1436`) go through `readFactionLifecycle`
  and `advanceFactionDensity`, which read **`isOnRoster`** (`factionLifecycle.js`), not
  `isOffStage`. Its one chokepoint call — `eligibleMembersOf` at `:520` — builds NPCs with
  **`{ id, name, role, importance, factionAffiliation }` and no `status` key at all** (`:513-518`),
  so the arm cannot reach it. (The other two matches are a header comment and the import line.)
- the other three import no chokepoint consumer.

ⓘ **A free observation for the chair, not a finding of this packet.**
`tests/property/npcs.property.test.js:40` asserts `createNpc`'s output status is one of
`['active','dead','missing','exiled','retired']` — a list missing `removed` and, after EM-B1d,
`jailed`. It cannot red: its `npcInput` arbitrary (`:20-26`) never generates a `status`, so the
assertion only ever sees `'active'`. The arm is unaffected either way.

⇒ ⭐ **`exiled` IS IN `NpcStatus` BUT IS PRODUCED BY NOBODY.** Every `'exiled'` site in `src/` is a
READ (`ROSTER_ABSENT_STATUSES`, `inferSuccessors`'s filter, `rosterPersonAvailable`'s list,
`LOST_NPC_STATUS`) or prose/comment. **The new arm changes NO existing world's behaviour**, and
there is no smallest reproduction to give because the value cannot be reached. `jailed` is not in
the union at all until EM-B1d. CONFIRMED.

---

## §4 · MEASUREMENT 3 — the arm against the goldens, BY EXECUTION

`corpus-status-census.mjs` imports the golden master's own corpus helper and its own pipeline
entry (`tests/helpers/goldenMasterCorpus.js`, `src/generators/generateSettlementPipeline.js` —
the two modules `tests/property/generatorGoldenMaster.test.js:784-785` imports) and generates
**every one of the 525 rows**, counting each NPC's `.status`:

```sh
$ node $W/corpus-status-census.mjs 1
corpus rows total: 525 | stride: 1 | settlements generated: 525
NPCs seen: 5171 | records with NO status key: 4884
status histogram: {
  "<ABSENT>": 4884,
  "active": 287
}
NPCs the EM-B1f arm would newly make off-stage (jailed+exiled): 0
```
(stride 75 first as a control — 7 settlements, 63 NPCs, same two buckets.)

⇒ ⭐ **ZERO of 5,171 generated NPCs carry `jailed` or `exiled`. The arm is INERT on the generator
golden corpus BY MEASUREMENT**, so `tests/property/generatorGoldenMaster.test.js` and
`tests/property/dossierProseManifest.test.js` cannot move. The pulse goldens, the espionage fence
and the preset witnesses inherit the same conclusion from §3: the value is unwritable, so no
recorded world contains it.

⚠ **A second, independent fact the histogram gives free:** 4,884 of 5,171 NPCs carry **no `status`
key at all**. The arm must therefore be ABSENCE-SAFE — `undefined` status ⇒ on-stage — which §6's
contract satisfies and A2 asserts.

---

## §5 · MEASUREMENT 5 — the seat read, and the bug reproduced

```sh
$ grep -n "rosterNpcById" src/domain/worldPulse/warSeatBooks.js
92:function rosterNpcById(/** @type {string} */ sid, …)   ← ⛔ NOT EXPORTED
197: · 214: · 485: · 633: · 756:
$ grep -n "^export " src/domain/worldPulse/warSeatBooks.js
379:export function authoritySignatureFor(…)
540:export const SEAT_BOOK_KINDS · 551:export const PRIVATE_BOOK_KINDS
588:export function seatBooksPartition(…)
618:export function readWarSeatBooks({
```
⇒ `rosterNpcById` is **module-private**; the A1 arm must reach it through the exported
`readWarSeatBooks` (`:618`), which calls it at `:633` for the ruler. Its `!rulerId || !ruler`
branch (`:667-691`) returns `securityBand: 'unseated'`, `seatWeight01: 0` and omits `rulerId`.

**THE BUG, REPRODUCED AT THE PRE-EDIT TREE** (`seat-probe.mjs`; fixtures copied verbatim from
`tests/domain/warSeatBooks.test.js`'s `ruler`/`item`/`snap`/`world` helpers):

```sh
$ node $W/seat-probe.mjs
ACTIVE (control)                         | isOffStage: false | securityBand: holding    | seatWeight01: 0.3744 | rulerId: a:ruler
status: dead (the landed precedent)      | isOffStage: false | securityBand: unseated   | seatWeight01: 0 | rulerId: (absent)
stasis imprisoned (isOffStage today)     | isOffStage: true  | securityBand: unseated   | seatWeight01: 0 | rulerId: (absent)
whereabouts hostage (isOffStage today)   | isOffStage: true  | securityBand: unseated   | seatWeight01: 0 | rulerId: (absent)
status: 'jailed'  ⇦ EM-B1f's arm         | isOffStage: false | securityBand: holding    | seatWeight01: 0.3744 | rulerId: a:ruler
status: 'exiled'  ⇦ EM-B1f's arm         | isOffStage: false | securityBand: holding    | seatWeight01: 0.3744 | rulerId: a:ruler
```

⇒ ⭐ **design §15's "a jailed mayor who still governs", executed.** A jailed or exiled ruler keeps
the seat (`holding`, `seatWeight01: 0.3744`, `rulerId: a:ruler`) while a `dead`, shelved or hostage
one is `unseated`. After the arm, the two new rows read exactly like the three above them —
**through `isOffStage`, not a second status check.** This is the packet's A1, with its own negative
control already executed.

---

## §6 · MEASUREMENT 4 — `missing` / `retired` / `removed`: what they mean and who reads them

```sh
$ sed -n '55,77p' src/domain/density/factionLifecycle.js
```
> ⭐ CHOSEN BY IRREVERSIBILITY, AND THE CHOICE IS THE POINT. R18 names three roads — "death, exile,
> departure". […]
>   `dead`, `removed`  — irreversible. ABSENT.
>   `exiled`           — named by R18 in its own words. ABSENT.
>   `missing`          — REVERSIBLE; a missing factor may walk back through the gate. Dissolution
>                        is permanent, so a temporary absence must not trigger it […] PRESENT.
>   `retired`          — a retired elder has not left the house. PRESENT.
>   `active`           — PRESENT.
> The rule: an IRREVERSIBLE consequence may only be triggered by IRREVERSIBLE causes. **Vetoable.**
```sh
$ git grep -nE "'(missing|retired|removed)'" HEAD -- src/domain/entities/successors.js src/domain/density/factionLifecycle.js src/domain/worldPulse/magicFormsPractitioner.js src/domain/worldPulse/envoyCasting.js
factionLifecycle.js:75: ROSTER_ABSENT_STATUSES = Object.freeze(['dead', 'exiled', 'removed'])
successors.js:63:       .filter(n => n.status !== 'dead' && n.status !== 'removed' && n.status !== 'exiled')
envoyCasting.js:98:     if (['dead', 'killed', 'missing', 'exiled', 'imprisoned'].includes(status)) return false;
magicFormsPractitioner.js:79: const LOST_NPC_STATUS = new Set(['dead','removed','exiled','missing','retired'])
```

**The estate already holds TWO readings of the same three words, and they disagree on purpose:**

| token | meaning where WRITTEN | roster membership (`factionLifecycle`) | successor eligibility (`successors`) | availability (`envoyCasting`) | practitioner loss (`magicForms`) |
|---|---|---|---|---|---|
| `missing` | reversible absence — "may walk back through the gate" | **PRESENT** | eligible | **refused** | **LOST** |
| `retired` | "departed"; "a retired elder has not left the house" | **PRESENT** | eligible | admitted | **LOST** |
| `removed` | irreversible erasure | **ABSENT** | ineligible | admitted | **LOST** |

⇒ **NOT DECIDED HERE.** Put to the chair as Q1 with this table beside it. The chartered arm is
`jailed` and `exiled` only, and that is what the packet contracts.

---

## §7 · ⭐ THE EM-B1d WALKER INTERACTION — measured, and it IS triggered

EM-B1d's T2 matcher (`EM-B1d.md` §6, ruling R6′) strips comments from every file under `src/`
(excluding `**/*.test.*`) and flags each whose remaining source contains any of the quoted
literals `'dead'`, `'exiled'` or `'retired'` — the derived TRIGGER SET — then asserts the flagged
set **SET-EQUAL, BOTH DIRECTIONS**, to `roster ∪ register`: *"an unlisted flagged file reds AND a
stale row reds."*

```sh
$ grep -nE "'(dead|exiled|retired)'" src/domain/roads/state.js
(no output — not one quoted trigger literal anywhere in the file, comments included)
```
⇒ `src/domain/roads/state.js` is **NOT** one of EM-B1d's eight flagged files today, and EM-B1d's
roster therefore cannot name it.

⇒ ⛔ **EM-B1f's arm INTRODUCES `'exiled'` into that file's comment-stripped source, so the file
becomes FLAGGED the moment the arm lands — and an unlisted flagged file REDS `statusUnionTotality.
walker.test.js` arm (1).** This is discovered here, at compile, not at the build.

**What the walker will demand, and how §6 satisfies it by contract:**
1. a NINTH roster row naming `src/domain/roads/state.js` + `isOffStage` — the packet's own
   change-manifest `MODIFY` row on the walker file;
2. that row's enumeration must contain every non-`active` member of the live typedef **or carry a
   one-line reasoned omission naming the members it leaves out** — the arm enumerates `jailed` and
   `exiled` only, so the packet contracts the exact omission sentence for `dead`, `missing`,
   `removed`, `retired`;
3. arm (2) *guard-the-guard*, "a roster file must still contain a trigger token" — satisfied:
   `state.js` will contain `'exiled'`.

⚠ **No placement avoids it.** Moving the two literals to a new constant only moves the trigger (and
the roster row) to whichever file holds them; the chokepoint itself must compare against `'exiled'`
somewhere. Keeping them in `state.js` is the chartered manifest and costs one roster row.

---

## §8 · MEASUREMENT 6 — the BUNDLE BUDGETS, priced

`closure-membership.mjs` copies `vite.config.js`'s own `importsOf` / `resolveRel` static-edge
resolver **verbatim** (`vite.config.js:258-275`), so it walks the same graph the build's own guards
do; dynamic `import()` stays a lazy boundary.

```sh
$ node $W/closure-membership.mjs
### GENERATION WORKER (src/workers/generation.worker.js)
  modules in closure: 220
  src/domain/roads/state.js IN CLOSURE: NO
### EAGER FIRST PAINT (main.jsx + kernel/** + generators/lookups.js)
  modules in closure: 251
  src/domain/roads/state.js IN CLOSURE: NO
### ADVANCE INTERVAL WORKER (src/workers/advanceInterval.worker.js)
  modules in closure: 549
  src/domain/roads/state.js IN CLOSURE: YES
  shortest recorded path:
      src/workers/advanceInterval.worker.js
      -> src/domain/worldPulse/advanceInterval.js
      -> src/domain/worldPulse/pulseKernel.js
      -> src/domain/worldPulse/worldSnapshot.js
      -> src/domain/roads/state.js
### TOWN SCENE EXPORT WORKER (src/workers/townSceneExport.worker.js)
  modules in closure: 125
  src/domain/roads/state.js IN CLOSURE: NO
```
And the AUTHORITATIVE eager set, read from the build's own derivation rather than a replica:
```sh
$ node -e "import('vite.config.js') …"
EAGER_FIRST_PAINT_MODULES size: 268
roads/state.js EAGER: false
worldPulse modules in the EAGER graph: 14
worldSnapshot.js eager: false · roadsKernel.js eager: false · warSeatBooks.js eager: false
entities/npcs.js eager: true
```
⇒ `state.js` is not eager and its two importers are not eager, so it rides the **lazy `engine`
chunk** — exactly what its own header claims (`state.js:20-25`, "a LAZY domain leaf — imported only
from the lazy engine chunk (roadsKernel at the pulse seam) and the master gate (worldSnapshot)").

**The ceilings, read from their own homes:**
```sh
$ grep -n "WORKER_BUNDLE_CEILING_BYTES" tests/build/generationWorkerLazy.test.js
159:export const WORKER_BUNDLE_CEILING_BYTES = 1401208;
$ grep -n "679_000" tests/build/vendorPdfLazy.test.js
787:    expect(size).toBeLessThan(679_000);
   (:775-787 — last MEASURED engine size 678,131 at the EM-T2 cure tip 023eda2ec; the raise note
    keeps a ~700 B cross-environment margin)
$ git grep -rn "advanceInterval.worker" HEAD -- tests/build
(no output — ⛔ NO BYTE CEILING EXISTS FOR THIS WORKER TODAY)
```

**THE ARM'S BYTES, MEASURED (not estimated).** Both candidate forms were written over the real file
and minified with the repo's own esbuild:
```sh
$ node $W/…bytes measurement…
anchor found VERBATIM: true
base   raw  32364 B | minified   7727 B
formA  raw  32517 B | minified   7825 B      ⇒ +98 B
formB  raw  32552 B | minified   7875 B      ⇒ +148 B
```
- **FORM A** (two `===` on a lowercased status, reusing one object guard) — **+98 B**. CONTRACTED.
- **FORM B** (an exported `OFF_STAGE_STATUSES = Object.freeze([...])` + `includes`) — +148 B. Named
  as the rejected alternative with its price (chair Q4).

⚠ esbuild's minifier is not Rollup's renderer, so **+98 B is CONFIRMED as a minified-source delta
and PLAUSIBLE as the rendered-chunk delta.** The packet therefore states a BOUND of **≤200 B**
(the measured figure ×2, per the pre-proof brief's convention) and hands the build lane the kit's
per-module attribution to prove only this module moved.

**The edge-shared INPUT test — membership, never entry-hood:**
```sh
$ node -e "…aiCharterBundle.meta.json…"      inputs: 114 | roads/state.js present: TRUE | sourceHash 237061fd5e0b3d71
$ node -e "…aiOutputSchemaBundle.meta.json…" inputs: 115 | roads/state.js present: TRUE | sourceHash bac86bfd077b5b43
```
⇒ ⛔ **P2.10 IS OWED.** `npm run build:edge-shared`, four regenerated artifacts, never hand-edited.
(The two `sourceHash` values above are the tip's; EM-B1d moves them first, so EM-B1f's own pair is
stamped by its pre-proof at its real base — the packet quotes no stale absolute.)

---

## §9 · MEASUREMENT 7 — registration obligations, each against the enforcer's own rule

```sh
$ sed -n '36,46p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = [
  'tests/lint', 'tests/design', 'tests/docs', 'tests/data',
  'tests/copy', 'tests/security', 'tests/edgeFunctions', 'tests/generators',
];
$ cat tests/lint/.lighting-census-baseline.json   (the live tuple)
"measuredBy": "EM-P0", "files": 2646, "parked": 383, "credited": 2263, "titles": 25005, "suiteTitles": 6671
$ ls tests/domain/warSeatBooks.test.js tests/domain/roadsState.test.js tests/domain/roadsParticipation.test.js
(all three exist ⇒ the packet CREATES NO TEST FILE)
```
| # | obligation | verdict | measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — a TITLES-ONLY delta** | No new test file and no new `describe`. The packet's DELTA, derived from its own TEST rows: **`+0 files / +0 parked / +0 credited / +4 titles / +0 suiteTitles`** (exactly four new straight-line `it`). ⛔ NO ABSOLUTE IS QUOTED; the chair stamps it from the live baseline at promotion. |
| P2.2 | mutation-coverage row | **NOT OWED** | The packet CREATEs nothing under an `ENFORCER_DIRS` tree. It MODIFIES `tests/lint/statusUnionTotality.walker.test.js`, whose `invariants` row EM-B1d already inserts (705 → 706). ⚠ the pre-proof re-confirms that row landed. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key (`dmLayer`, `decrees`) is read. ⚠ `check-observed-shape-readers.mjs` covers every `.js` under `src/` and one of its files moves ⇒ it is in `checks` and **motion there is a STOP, not a cure.** |
| P2.4 | writer-reach | ⚠ **MEASURE, DO NOT ASSUME** | `state.js` is deep in the lazy worldPulse graph and not eager (§8), so a movement is unlikely — but the arm widens a predicate that gates seven readers. `check-writer-reach.mjs` is in `checks`; a shrink is the plain `--write`, **growth is a mint and a CHAIR act**. |
| P2.5 | decision-fork / mechanism | **NOT OWED** | No seeded chooser, pool or draw. |
| P2.7 | prose-numerics | **NOT OWED** | No figure is rendered. |
| P2.10 | edge-shared freshness | ⛔ **OWED — §8** | `roads/state.js` is an INPUT of both bundles (measured). |
| P2.11 | byte budgets | **PRICED — §8** | Worker: 0 B (not a member). First paint: 0 B (not a member). Lazy engine: +98 B measured, bound ≤200 B. `advanceInterval.worker`: a member with **no ceiling today**. |

---

## §10 · Budget, hot files, and the placement

```sh
$ node -e "…eslint Linter, max-lines skipBlankLines+skipComments…"
src/domain/roads/state.js                  effective lines: 288
tests/domain/roadsState.test.js            effective lines: 173
tests/domain/warSeatBooks.test.js          effective lines: 270
$ grep -n "max-lines" eslint.config.js    → src/domain/**/*.js: max 800 (:710-712)
$ grep -n "roads" eslint.config.js        → (no per-file override)
$ node -e "…scripts/.size-baseline.json…" → only src/domain/worldPulse/roadsKernel.js => 838
```
⇒ `state.js` is **288 / 800 — 512 lines of headroom, NOT a hot file**, and it carries no
`.size-baseline.json` entry. It appears on none of `PACKET_STANDARD.md`'s five standing hot rows.

**Placement / collision:**
```sh
$ node -e "…PACKET_MANIFEST.json, TERMINAL = {LANDED, SUPERSEDED}…"
EM-B1f already in the manifest?  NO — free to place        (188 packets)
src/domain/roads/state.js              reserved by: NOBODY
tests/domain/{roadsState,warSeatBooks,roadsParticipation}.test.js  reserved by: NOBODY
⛔ RESERVES  EM-B1d  READY  CREATE  tests/lint/statusUnionTotality.walker.test.js
⛔ RESERVES  EM-B1d  READY  MODIFY  supabase/functions/_shared/aiCharterBundle.js
⛔ RESERVES  EM-B1d  READY  MODIFY  supabase/functions/_shared/aiOutputSchemaBundle.js
--- requiredSymbols rows naming isOffStage / isInStasis / rosterNpcById ---
(none — no landed or pending packet names any of the three)
```
⇒ EM-B1d is **non-terminal (READY)** and reserves three of EM-B1f's paths. Placing EM-B1f before
EM-B1d flips to LANDED makes `node scripts/implementation-packets.mjs validate` print
`duplicate change path across packets` for each. **EM-B1d is EM-T3's closing member and EM-B1f is
EM-T6's first**, so the paths free themselves in the chartered order — but the chair's placement
act must follow the flip (Q6).

---

## §11 · Required symbols, PROVEN VERBATIM, and the POST-EDIT simulation (pre-proof step 10)

```sh
$ grep -cF 'export function isOffStage'       src/domain/roads/state.js            → 1
$ grep -cF 'export function isInStasis'       src/domain/npc/npcOps.js             → 1
$ grep -cF 'function rosterNpcById'           src/domain/worldPulse/warSeatBooks.js → 1
$ grep -cF 'export function readWarSeatBooks' src/domain/worldPulse/warSeatBooks.js → 1
$ grep -cF 'export function buildWorldSnapshot' src/domain/worldPulse/worldSnapshot.js → 1
```
| # | path | symbol | post-edit verdict |
|---|---|---|---|
| 1 | `src/domain/roads/state.js` | `export function isOffStage` | ⭐ **HOLDS.** The packet edits the BODY; §6 pins the declaration line byte-for-byte. Not a `retiredSymbols` row. |
| 2 | `src/domain/npc/npcOps.js` | `export function isInStasis` | **HOLDS** — untouched; the arm is built beside it, never over it. |
| 3 | `src/domain/worldPulse/warSeatBooks.js` | `function rosterNpcById` | **HOLDS** — untouched. It is where the widening must ARRIVE, not a thing the packet edits (one chokepoint is the point). |
| 4 | `src/domain/worldPulse/warSeatBooks.js` | `export function readWarSeatBooks` | **HOLDS** — untouched. Added because A1 CALLS it (the standard's rule) and it is the only exported route to the private seat read. |
| 5 | `src/domain/worldPulse/worldSnapshot.js` | `export function buildWorldSnapshot` | **HOLDS** — untouched. Added because A4 CALLS it. |
| — | `tests/lint/statusUnionTotality.walker.test.js` | the consumer roster | ⏳ **PENDING EM-B1d.** Does not exist at 58fcfe614, so it is NOT a requiredSymbols row in this DRAFT. The pre-proof adds it once the base is at-or-after EM-B1d's landing, with `grep -cF` as the proof. |

**`retiredSymbols`: NONE.** The packet moves, renames and deletes no symbol.
**Other packets' rows to discharge: NONE** (the manifest scan above returns no row for any of the
three chartered pairs).
