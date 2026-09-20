# EM-B1i — COMPILE EVIDENCE (Opus COMPILE lane, session a9df403c, 2026-09-20)

Every fact in `EM-B1i.md` and `EM-B1i.manifest.json` is proved below by the command that
produced it. **A fact without a command is not verified.** All commands run in the read-only
detached worktree `$SP/read-tip-32602dc60` at
`32602dc607b7423838249cf57d73baf08feb047d`, with

```
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad
T=$SP/read-tip-32602dc60
S=$SP/lane-em-compile-EM-B1i-scratch
```

⛔ The read tree was never edited. Its `git status --short` is quoted EMPTY at §1 (open),
§17 (mid-lane) and §21 (close).

---

## §1 · The tree, opened

```
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git -C $SP/read-tip-32602dc60 status --short
                       ← EMPTY
```

The prior (dead) lane measured at `e5bdfd031`. That commit is an ANCESTOR of this tip and
nothing in this packet's family moved between them:

```
$ git merge-base --is-ancestor e5bdfd031 HEAD && echo YES
YES
$ git log --oneline e5bdfd031..HEAD
32602dc60 CURE-D: the prose-wiring census re-taken and the holder table's three stale producer citations re-addressed …
145acdb75 CURE-C: EM-B1e's acceptance file is statically registered — credited, seven titles, no assertion changed
8955b67a8 CURE-B: the prose-numerics baseline re-addressed for train EM-T3's landings — 2 rows, addresses only …
2d72c8b7a CURE-A2: the move-vocabulary walker's twin mask takes the same horizontal-whitespace cure …
08cb42e31 CURE-A: the model walker blanks import lines by horizontal whitespace only …
$ git diff --stat e5bdfd031 HEAD -- src/domain/worldPulse/causeLifecycle.js \
    src/domain/worldPulse/calamityKernel.js src/domain/worldPulse/upswingKernel.js \
    tests/fixtures/preset-lighting-witness-golden.json tests/lint/vocabularyTotality.walker.test.js \
    tests/domain/causeResolutionLifecycle.test.js
                       ← EMPTY (no path moved)
```

⚠ **ONE prior-lane figure IS stale and was re-measured:** `tests/domain/ruinInstitution.test.js`
was PARKED at `e5bdfd031` and is **CREDITED** at this tip — `145acdb75` (CURE-C) is exactly that
cure. Everything the prior lane left in `out/` and `tools/` was treated as a hint and re-run.

## §2 · The preamble hash

```
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1  docs/implementation/preambles/EM-PREAMBLE.md
```

Matches the dispatch message's value, including §P2 row 12. Left unstamped by design.

---

## §3 · THE DEFECT, FOUND BY SYMBOL

```
$ grep -rn "institutionDestroyed" src tests scripts
src/domain/worldPulse/causeLifecycle.js:136:function institutionDestroyed(inst) {
src/domain/worldPulse/causeLifecycle.js:397:      const localSustainerGone = !!(sustainer && institutionDestroyed(sustainer));
tests/domain/ruinInstitution.test.js:151:// `institutionDestroyed` is module-private, so its verdict is read where it has a
```

⇒ **ONE definition, ONE call site, ZERO other mentions in `src/`.** The symbol is
**module-private** (no `export`), so the call site at `:397` is the packet's whole consumer
surface.

The reader, verbatim at `:136-141`:

```js
const NONSTANDING_STATUS = new Set(['removed', 'destroyed', 'remnant', 'ruined', 'defunct', 'closed', 'disbanded', 'abolished']);
/** @param {InstLike|null|undefined} inst */
function institutionDestroyed(inst) {
  if (!inst) return false;
  if (inst._worldPulseInactive === true || inst._worldPulseMorallyAbolished === true) return true;
  if (inst.worldPulseFate) return true;                       // ⛔ TRUTHINESS — the defect
  return NONSTANDING_STATUS.has(norm(inst.status));
}
```

```
$ grep -cF "function institutionDestroyed(inst) {" src/domain/worldPulse/causeLifecycle.js   → 1
$ grep -cF "  if (inst.worldPulseFate) return true;"  src/domain/worldPulse/causeLifecycle.js → 1
```

### §3.1 · What the ONE caller does on `true` — the whole price

`causeLifecycle.js:396-456`, **TERMINAL 2: PAYMASTER DEATH → RE-ADJUDICATE**:

```js
const sustainer = sustainingInstitution(settlement, npc);
const localSustainerGone = !!(sustainer && institutionDestroyed(sustainer));
…
if (!rec.readjudicated && (localSustainerGone || foreignEndpointGone)) {
```

On `true`, one of exactly two branches runs, both of which END the compromise's quiet lifecycle:

| branch | what happens to the DM's world |
|---|---|
| `reachForNewPatron` (a live alternative cause exists and the fork picks re-catch) | the record's `causeClass` is replaced, `stage: 're-adjudicated'`, `readjudicated: true`; a **notable** news entry *"X finds a new patron"* is emitted |
| otherwise — **the leash SEVERS** | a `reforms` row is pushed, the record is **DROPPED**; `projectCauseLifecycleOntoSettlement` then sets `corrupt: false, corruptionVector: null` on that NPC (`:566-570`) — the bearer reads as a clean incumbent forever after; a **notable** news entry *"X is cut loose"* is emitted |

Both branches are one-way: `readjudicated: true` and the dropped record are not re-entered.
`causeLifecycleNewsEntries` (`:608`) turns the `re-adjudicated` stage into a DM-visible news row
(`significance: 'notable'`, `score: 48`).

### §3.2 · The three fates whose kind is not `closure`, VERBATIM at this tip

```
$ grep -cF "worldPulseFate: 'demoted_by_disaster',"        src/domain/worldPulse/calamityKernel.js  → 1
$ grep -cF "worldPulseFate: 'upgraded_by_reconstruction' }" src/domain/worldPulse/upswingKernel.js  → 1
$ grep -cF "worldPulseFate: 'founded_by_flourishing' }"     src/domain/worldPulse/upswingKernel.js  → 1
$ for w in demoted_by_disaster upgraded_by_reconstruction founded_by_flourishing; do grep -rlF "$w" src/; done
src/domain/worldPulse/calamityKernel.js
src/domain/worldPulse/upswingKernel.js
src/domain/worldPulse/upswingKernel.js
```

`calamityKernel.js:294-311`, the demote branch, quoted for the record literal's siblings:

```js
      // The greater falls a rung: rename in place, keeping the slot standing. …
      list[idx] = {
        ...list[idx], name: plan.demotedTo,
        id: `institution.${stablePart(plan.demotedTo)}`,
        description: '',
        tags: [],
        worldPulseFate: 'demoted_by_disaster',
        demotedFrom: name,
      };
```

⇒ **no `status:` key, no `_worldPulseInactive`, no `_worldPulseMorallyAbolished`** — EM-B1h §6.1's
`standing` classification re-confirmed by reading the literal at this tip.

---

## §4 · THE DEFECT, REPRODUCED THROUGH THE REAL `advanceCauseLifecycle`

Harness: `$S/t/repro-leash.mjs` + `$S/t/patch-hooks.mjs` (the dead lane's, re-pointed at this
tip and re-run). `node:module registerHooks` serves rewritten SOURCE for three modules at load;
⛔ **the tree is never edited** — §21 re-quotes the empty status. Six fixtures, identical but for
the fate stamped on the paymaster.

```
$ cd $S/t && EM_B1I_MODE=probe node repro-leash.mjs $S/o/repro-today.json
standing  demoted_by_disaster                severed=true  stages=["re-adjudicated"] recordKept=false
rise      upgraded_by_reconstruction         severed=true  stages=["re-adjudicated"] recordKept=false
rise      founded_by_flourishing             severed=true  stages=["re-adjudicated"] recordKept=false
closure   destroyed_by_disaster (CONTROL)    severed=true  stages=["re-adjudicated"] recordKept=false
UNKNOWN   razed_by_the_gods (old save)       severed=true  stages=["re-adjudicated"] recordKept=false
none      no fate at all (NEGATIVE CONTROL)  severed=false stages=[] recordKept=true
mode=probe readerCalls=6 divergences=3
```

The DM's words today, straight out of the probe's `reasons` for the STANDING wizard's tower
(`$S/o/repro-today.json`):

> headline: **"Aldra Vane is cut loose"**
> reason: **`Sustaining institution "Wizard's Tower" destroyed; the compromise resolved (no live patron remained).`**

— for an institution whose own writer's comment says *"rename in place, keeping the slot standing"*
and whose record still reads `status: 'active'`, `_worldPulseInactive: false`.

```
$ cd $S/t && EM_B1I_MODE=cure node repro-leash.mjs $S/o/repro-cure.json
standing  demoted_by_disaster                severed=false stages=[] recordKept=true
rise      upgraded_by_reconstruction         severed=false stages=[] recordKept=true
rise      founded_by_flourishing             severed=false stages=[] recordKept=true
closure   destroyed_by_disaster (CONTROL)    severed=true  stages=["re-adjudicated"] recordKept=false
UNKNOWN   razed_by_the_gods (old save)       severed=true  stages=["re-adjudicated"] recordKept=false
none      no fate at all (NEGATIVE CONTROL)  severed=false stages=[] recordKept=true
mode=cure readerCalls=0 divergences=0
```

⇒ **EXACTLY THREE of six verdicts move, and they are exactly the three the charter names.**
The closure CONTROL still severs; the UNKNOWN word still severs (the conservative contract); the
no-fate NEGATIVE CONTROL never severs in either mode, so the driver is proved live.

---

## §5 · HOW OFTEN THE BUG FIRES — EXECUTED THROUGH THE PULSE

Harness `$S/t/soak-aimed.mjs` (the dead lane's `soak-realm.mjs` with a configurable leash
roster). Eight settlements in the shape of the estate's own `upswingRecoverySoak` realm (two
freshly struck, one rich, allied), driven through the REAL
`simulateCampaignWorldInterval` year by year, threading `settlementUpdates` forward. Every NPC
carries a criminal leash naming a LOCAL institution.

```
$ EM_B1I_MODE=probe node soak-aimed.mjs $S/o/soak-A.json --years 10 --leash "Market|Tannery|Wizard's tower|Academy" full_simulation
full_simulation      ticks=520 stamps=10 {"founded_by_flourishing":8,"upgraded_by_reconstruction":2} readerCalls=238 diverge=0 9541ms

$ EM_B1I_MODE=probe node soak-aimed.mjs $S/o/soak-B.json --years 10 --leash "Carpenter|Academy" full_simulation
full_simulation      ticks=520 stamps=6 {"founded_by_flourishing":6} readerCalls=120 diverge=0 10094ms

$ EM_B1I_MODE=probe node soak-aimed.mjs $S/o/soak-C.json --years 20 --leash "Market|Tannery|Carpenter|Academy" full_simulation living_realm
full_simulation      ticks=1040 stamps=8 {"founded_by_flourishing":8} readerCalls=374 diverge=0 87084ms
living_realm         ticks=1040 stamps=8 {"founded_by_flourishing":8} readerCalls=430 diverge=0 46257ms
mode=probe readerCalls=804 divergences=0 nonClosureStamps=16
```

| measure | soak-C (the widest run) |
|---|---|
| ticks driven | **2,080** (2 presets × 20 in-world years × 52) |
| non-`closure` fate stamps | **16** (`founded_by_flourishing` ×16) |
| `institutionDestroyed` calls | **804** |
| calls that DIVERGE under the cure | ⭐ **0** |

⭐ **WHY ZERO, MEASURED — the two events are separated by the mechanics themselves.**

```
readerYears  full_simulation: {"y1":353,"y2":21}     living_realm: {"y1":315,"y2":115}
stampYears   full_simulation: {"y3":5,"y4":3}        living_realm: {"y2":1,"y3":6,"y4":1}
endCorruptNpcs: 0   (both presets)
```

Every compromise resolves inside years 1–2; every rise fate lands in years 2–4. No live
compromise survived to meet a rise-fated institution. A compromise also leaves the reader
permanently once it reaches `exposed-public` (`:386` returns before the terminal) or
`readjudicated` (`:404`), so the window is narrow by construction.

⛔ **BUT THE MIS-READ IS PERMANENT, NOT MOMENTARY.** The end-state census of the same run:

```
endStateFates (soak-C, living_realm): {"founded_by_flourishing|status=active|inactive=false": 8}
endStateFates (soak-C, full_simulation): {"founded_by_flourishing|status=active|inactive=false": 8,
  "hollowed_out|status=remnant|inactive=true":3, "privatized|…":4, "survives_as_remnant|…":2,
  "reduced_to_watch_post|…":3, "downsized|…":2}
```

**Sixteen standing, active academies** end each 20-year world carrying a fate that
`institutionDestroyed` reads as *destroyed* — for the rest of that world's life. The first
compromise ever leashed to one of them severs instantly. The soak measures the coincidence RATE
(zero in 2,080 ticks); §4 measures the verdict itself (wrong, three ways).

---

## §6 · ⭐ THE GOLDENS — EXECUTED BEFORE AND AFTER AN IN-MEMORY PROTOTYPE

### §6.1 · The instrument reproduces its own committed golden (the control)

```
$ cd $S/t && node run-witness.mjs $S/o/witness-base.json
__birth_default__   ticks=52 status=complete world=8ecc0b3ebb87e1ea 234ms
quiet_local         ticks=52 status=complete world=a9c0cedfead3d969  90ms
realistic_regional  ticks=52 status=complete world=c0654348b941e715 185ms
dramatic_campaign   ticks=52 status=complete world=bd7fc01049d4a01c 245ms
static_campaign     ticks=52 status=complete world=895cfe4af077dcd1  33ms
narrative_campaign  ticks=52 status=complete world=885ed4306fe27d4d  57ms
living_realm        ticks=52 status=complete world=f5f44a265106539b 134ms
full_simulation     ticks=52 status=complete world=b03ba26cee3652f2 198ms

$ node -e '<field-by-field compare against tests/fixtures/preset-lighting-witness-golden.json>'
golden rows: 8  base rows: 8
TOTAL FIELD DIFFS golden-vs-base: 0
```

⇒ the harness drives `tests/simulation/presetLightingWitnessRun.js` — the estate's SINGLE WRITER
of that measurement — correctly, and the witness is green at this tip.

### §6.2 · The probe is byte-neutral, and the CURE moves nothing

```
$ EM_B1I_MODE=probe node run-witness-patched.mjs $S/o/witness-probe.json
… all 8 rows: calls=0 diverge=0 stamps=0 …
mode=probe readerCalls=0 divergences=0 nonClosureStamps=0

$ EM_B1I_MODE=cure  node run-witness-patched.mjs $S/o/witness-cure.json
… all 8 rows: world hashes identical to base …
mode=cure readerCalls=0 divergences=0 nonClosureStamps=0

$ node -e '<base vs probe vs cure, 13 hashed/derived fields × 8 rows>'
rows=8 fieldsPerRow=13 totalFields=104
PROBE field diffs vs BASE: 0
CURE  field diffs vs BASE: 0
CURE differing RECORDS (rows): 0
cure patched modules: [
 {"rel":"src/domain/worldPulse/upswingKernel.js","bytesBefore":56431,"bytesAfter":56603},
 {"rel":"src/domain/worldPulse/calamityKernel.js","bytesBefore":48045,"bytesAfter":48203},
 {"rel":"src/domain/worldPulse/causeLifecycle.js","bytesBefore":38111,"bytesAfter":39046}]
```

⭐ **THE PRESET WITNESS DOES NOT MOVE: 0 of 104 fields, 0 of 8 records.** The `patched` list is
the proof that the cure was really loaded (`causeLifecycle.js` 38,111 → 39,046 bytes in memory)
rather than the run silently falling through to the tree's own source.

⚠ **THE HONEST LIMIT, NAMED.** The witness realm carries no `corrupt: true` NPC, so
`institutionDestroyed` is never called in it (`calls=0`, all eight rows). The witness therefore
proves *the golden does not move*; it does not prove the cure is inert in a world that does reach
the reader. §5 and §6.3 carry that half.

### §6.3 · No golden CAN move from a fixture — the tree-wide sweep

```
$ grep -rlF "worldPulseFate" --include="*.json" tests/ src/ public/ | wc -l
0
$ for w in demoted_by_disaster upgraded_by_reconstruction founded_by_flourishing; do grep -rlF "$w" tests/; done
tests/domain/upswingKernel.test.js          ← founded_by_flourishing only
$ grep -n "founded_by_flourishing" tests/domain/upswingKernel.test.js
491:    expect((s.institutions || []).filter((i) => i.worldPulseFate === 'founded_by_flourishing')).toHaveLength(1);
```

⇒ **`worldPulseFate` appears in ZERO committed `.json` files** under `tests/`, `src/` and
`public/` — so no golden, dormancy golden or fixture-recorded manifest spells a fate at all, and
none can move. The single `tests/` mention of a non-`closure` word is an assertion about what
`upswingKernel` WRITES; this packet changes no writer, so it stays green.

### §6.4 · The three golden digests, and the LANDED arm that pins them

```
$ shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json tests/fixtures/preset-lighting-witness-golden.json
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  …/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  …/dossier-prose-manifest-golden.json
7f67ee8e6cda2b7e70a780090b16db20a4f8032a1746a51b2e044dd69bd98ae2  …/preset-lighting-witness-golden.json

$ grep -n "sha256Of('tests/fixtures" tests/domain/ruinInstitution.test.js
290:    expect(sha256Of('tests/fixtures/generator-golden-master.json')).toBe('7177cd6e…8e8f1e');
291:    expect(sha256Of('tests/fixtures/dossier-prose-manifest-golden.json')).toBe('921c51cf…4db41');
292:    expect(sha256Of('tests/fixtures/preset-lighting-witness-golden.json')).toBe('7f67ee8e…98ae2');
```

All three EQUAL. EM-B1e's LANDED **A4** already pins them bytewise, so a silent move is
impossible — and §6.2 proves the cure does not cause one.

⇒ ⭐ **NO GOLDEN MOVES. THE OWNER'S SIGNED DOOR (`tests/helpers/goldenRecordDoor.js`) IS NOT
OPENED BY THIS PACKET, AND NO `predictedRows` IS OWED.**

### §6.5 · EM-B1e's LANDED A6 arms, simulated against the cure

`tests/domain/ruinInstitution.test.js:318-328` drives the reader through `leashSevered()`:

```js
expect(leashSevered({ name: 'Smuggling ring', category: 'crime' }), 'a STANDING paymaster must not sever the leash, or this driver is vacuous').toBe(false);
expect(leashSevered(decreed)).toBe(true);       // ruined_by_decree      → kind `closure`
expect(leashSevered(disastered)).toBe(true);    // destroyed_by_disaster → kind `closure`
…
expect(leashSevered(noFate), 'the verdict changed when the fate key was removed, so the value is NOT inert').toBe(true);
```

Every one of the four is UNCHANGED by the cure: the two fated records are `closure`-kinded **and**
carry `_worldPulseInactive: true` and `status: 'ruined'` (decided at line 138 and line 140, both
untouched); the bare institution has no fate and no non-standing status; `noFate` is decided by
`_worldPulseInactive`. ⇒ **the landed A6 stays green.** A3's arm asserts this packet's own
executed re-run.

---

## §7 · THE CURE'S SHAPE — MEASURED, INCLUDING A DEFECT THE OBVIOUS SHAPE WOULD HAVE ADDED

### §7.1 · ⛔ THE PROTOTYPE HAZARD, EXECUTED

An `in`-operator membership test against `WORLD_PULSE_FATE_KIND` walks `Object.prototype`:

```
$ node -e '<a frozen two-key kind map; `word in KIND` vs `SET.has(word)`>'
abandoned              (word in KIND)=true  SET.has(word)=true  KIND[word]="closure"
demoted_by_disaster    (word in KIND)=true  SET.has(word)=true  KIND[word]="standing"
razed_by_the_gods      (word in KIND)=false SET.has(word)=false KIND[word]=undefined
constructor            (word in KIND)=true  SET.has(word)=false KIND[word]=undefined
toString               (word in KIND)=true  SET.has(word)=false KIND[word]=undefined
valueOf                (word in KIND)=true  SET.has(word)=false KIND[word]=undefined
__proto__              (word in KIND)=true  SET.has(word)=false KIND[word]={}
```

⇒ a save carrying `worldPulseFate: 'constructor'` (or `'toString'`, `'valueOf'`, `'__proto__'`)
would be judged a KNOWN member with no kind and would read **NOT destroyed** — inverting the
conservative contract for exactly the words an unknown-value contract exists to protect.
**The membership test must be the leaf's `isWorldPulseFate` (a `Set`), never `in`.** A2 pins it.

### §7.2 · The candidate shapes, priced with esbuild `--minify`

Fragments written to `$S/bytes/`; esbuild run from the tree's own `node_modules/.bin/esbuild`,
per-module, export names preserved ⇒ **a stated UPPER BOUND** (rollup scope-hoists and mangles
inside a chunk).

| shape | minified | delta vs today |
|---|---:|---:|
| today (the defect) | **184 B** | — |
| A · `CLOSURE_FATES` Set + `in` membership | 359 B | +175 B ⛔ carries §7.1's defect |
| A2 · `CLOSURE_FATES` Set + `isWorldPulseFate` | 387 B | +203 B |
| ⭐ **A3 (CHOSEN)** · a total kind→verdict map + `isWorldPulseFate` | **378 B** | ⭐ **+194 B** |
| B · a helper exported from EM-B1h's leaf | 241 B | +57 B in the reader, but ~+185 B in the leaf and it EDITS ANOTHER PACKET'S CREATE |

⭐ **WHY A3 AND NOT A2, ON A MEASUREMENT THAT IS NOT BYTES:** A2 hides a fourth kind. A kind the
leaf later declares that A2's `CLOSURE_FATES` filter does not name simply falls through to
"not destroyed" — a SILENT DEFAULT, which is precisely the defect class
`tests/lint/vocabularyTotality.walker.test.js` exists to convict. A3 spells the verdict for each
declared kind as a literal object whose keys the walker can read with its own `objectLiteralKeys`
helper, so a fourth kind REDS. A3 is also **9 B cheaper** than A2.

### §7.3 · The chosen text (contracted verbatim in §6 of the packet)

```js
import { WORLD_PULSE_FATE_KIND, isWorldPulseFate } from './worldPulseFates.js';
const DESTROYED_BY_FATE_KIND = Object.freeze({ closure: true, rise: false, standing: false });
function institutionDestroyed(inst) {
  if (!inst) return false;
  if (inst._worldPulseInactive === true || inst._worldPulseMorallyAbolished === true) return true;
  const fate = inst.worldPulseFate;
  if (fate && !isWorldPulseFate(fate)) return true;
  if (fate && DESTROYED_BY_FATE_KIND[WORLD_PULSE_FATE_KIND[fate]] === true) return true;
  return NONSTANDING_STATUS.has(norm(inst.status));
}
```

minified (`$S/bytes/shapeA3.min.js`, 378 B):

```
import{WORLD_PULSE_FATE_KIND as t,isWorldPulseFate as u}from"./worldPulseFates.js";const o=Object.freeze({closure:!0,rise:!1,standing:!1});function s(e){if(!e)return!1;if(e._worldPulseInactive===!0||e._worldPulseMorallyAbolished===!0)return!0;const r=e.worldPulseFate;return r&&!u(r)||r&&o[t[r]]===!0?!0:NONSTANDING_STATUS.has(norm(e.status))}export{s as institutionDestroyed};
```

---

## §8 · EFFECTIVE LINES — eslint's OWN `Linter`, with a reproducing control

`$S/t/efflines.mjs` imports eslint's `Linter` as a library and runs
`max-lines {max:1, skipBlankLines:true, skipComments:true}`, reading the actual count out of the
rule's own message.

```
$ node efflines.mjs src/domain/worldPulse/causeLifecycle.js src/domain/worldPulse/calamityKernel.js src/domain/worldPulse/roadsKernel.js src/domain/worldPulse/institutionLifecycle.js
src/domain/worldPulse/causeLifecycle.js        File has too many lines (376). Maximum allowed is 1.
src/domain/worldPulse/calamityKernel.js        File has too many lines (457). Maximum allowed is 1.
src/domain/worldPulse/roadsKernel.js           File has too many lines (838). Maximum allowed is 1.
src/domain/worldPulse/institutionLifecycle.js  File has too many lines (798). Maximum allowed is 1.

$ grep -n "roadsKernel" scripts/.size-baseline.json
14:  "src/domain/worldPulse/roadsKernel.js": 838,
```

⇒ **THE CONTROL PASSES** — the counter reproduces eslint's own arithmetic exactly (838 = 838).

```
$ grep -n "max-lines" eslint.config.js   (the src/domain rule)
  { files: ['src/domain/**/*.js'], rules: { 'max-lines': ['error', { max: 800, skipBlankLines: true, skipComments: true }] } }
$ grep -n "causeLifecycle" eslint.config.js scripts/.size-baseline.json
                       ← no hit: no per-file override, no baseline entry
```

⇒ **`causeLifecycle.js` is 376 of 800 · HEADROOM 424.** It is on no hot list:

```
$ grep -n -A12 "## Hot files" docs/implementation/PACKET_STANDARD.md
| src/components/new/tabs/EconomicsTab.jsx | 600 | 600 | 0 |
| src/components/OutputContainer.jsx | 599 | 600 | 1 |
| src/domain/worldPulse/convergence.js | 798 | 800 | 2 |
| src/domain/worldPulse/peaceTerms.js | 797 | 800 | 3 |
| src/domain/worldPulse/informationStatecraft.js | 780 | 800 | 20 |
```

`causeLifecycle.js` is absent. **The packet edits no hot file.**

---

## §9 · BUNDLE MEMBERSHIP — `causeLifecycle.js`, and why the new edge costs ZERO modules

`$S/t/closures.mjs` reads the repo's OWN `EAGER_FIRST_PAINT_MODULES` export from
`vite.config.js` (never a replica) and walks each worker entry with vite's static-edges-only rule.

```
$ node closures.mjs $S/o/closures2.json src/domain/worldPulse/causeLifecycle.js src/domain/worldPulse/calamityKernel.js src/domain/worldPulse/pulseKernel.js
src/domain/worldPulse/causeLifecycle.js   first paint: false  own closure 176
  advanceInterval.worker.js: YES (549) · customContentPreview: no (267) · generation.worker: no (220) · townScene: no (18) · townSceneExport: no (125)
src/domain/worldPulse/calamityKernel.js   first paint: false  own closure 327   advanceInterval.worker.js: YES
src/domain/worldPulse/pulseKernel.js      first paint: false  own closure 547   advanceInterval.worker.js: YES
eager set size = 268 (vite.config.js EAGER_FIRST_PAINT_MODULES — the repo's own derivation)
```

| budget | verdict |
|---|---|
| generation worker (`WORKER_BUNDLE_CEILING_BYTES = 1401208`, EXACT, zero slack) | ⭐ **NOT REACHABLE** — `causeLifecycle.js` is not in the 220-module closure |
| eager first paint (268 modules) | **NO** |
| lazy `engine` chunk (`tests/build/vendorPdfLazy.test.js`, `< 679_000`) | **NO** — the routing rule is `if (id.includes('/src/generators/')) return 'engine';` (`vite.config.js:862-863`); `src/domain/worldPulse/**` is not matched |
| `advanceInterval.worker` | **YES** — no byte ceiling today; TOOL-3 is minting one with a declared 4 KB per-train headroom |
| edge-shared bundle INPUTS | **NONE** (§10) |

⭐ **THE NEW IMPORT EDGE ADDS ZERO MODULES TO ANY CHUNK.** `causeLifecycle.js` has exactly one
static importer in `src/`, and it also imports `calamityKernel.js`, which EM-B1h makes the leaf's
importer:

```
$ git grep -ln "causeLifecycle\.js'" -- src
src/domain/worldPulse/pulseKernel.js
$ grep -n "calamityKernel\|causeLifecycle" src/domain/worldPulse/pulseKernel.js | head -2
70:import { advanceCalamity } from './calamityKernel.js';
116:import { advanceCauseLifecycle, projectCauseLifecycleOntoSettlement, causeLifecycleNewsEntries } from './causeLifecycle.js';
```

⇒ every closure that contains `causeLifecycle.js` already contains `worldPulseFates.js` after
EM-B1h lands. The packet's whole byte cost is its own **≤194 B**.

## §10 · EDGE-SHARED CLOSURE — NOT OWED, MEASURED

```
$ node -e '<read all five supabase/functions/_shared/*.meta.json inputs lists>'
metas: aiCharterBundle, aiGroundingBundle, aiOutputSchemaBundle, analyticsEventsBundle, intentAtlasBundle
total inputs across all metas: 307
hits for this packet's paths: NONE
```

⇒ no rebuild, **no generator in `checks`**, no `_shared` row, and none of §P2 row 12's SEVEN
generated paths.

---

## §11 · THE REGISTERS, SWEPT AGAINST THIS TIP

### §11.1 · mutation coverage — ⭐ NOT OWED (and therefore NO collision with EM-B1d)

```
$ sed -n '36,45p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = ['tests/lint','tests/design','tests/docs','tests/data','tests/copy','tests/security','tests/edgeFunctions','tests/generators'];
$ sed -n '46,50p' tests/lint/mutationCoverage.shared.mjs
export const NAME_PATTERN = /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i;
$ node --input-type=module -e '<import the shared module and test the CREATE target>'
institutionDestroyedByKind.test.js NAME_PATTERN: false
tests/domain/institutionDestroyedByKind.test.js in ENFORCER_DIRS: false
```

`enumerateInvariants` admits a file iff it is under an `ENFORCER_DIR` **or** its basename matches
`NAME_PATTERN` (`tests/lint/mutationCoverage.shared.mjs:65-72`). The CREATE target is neither.
⇒ ⭐ **`scripts/mutation-coverage-manifest.json` IS NOT A ROW OF THIS PACKET**, so EM-B1d's
READY reservation of that path does not gate this packet's dispatch.

### §11.2 · coupling inclusion — NOT OWED

```
$ grep -n "causeLifecycle" tests/lint/.coupling-unlayered-baseline.json
39:  "src/domain/worldPulse/causeLifecycle.js",
$ grep -n "causeLifecycle" tests/lint/.coupling-inclusion-baseline.json
                       ← no hit
```

The census is TOTAL over `src/domain/{worldPulse,spatial}` and reds on a **NEW** unlayered module;
this packet creates none. `causeLifecycle.js` is already a BASELINE row (a bare path string, with
no declared `reads` list to move). EM-B1h measured `scanCrossLayerPairs` to iterate LAYERED
modules and skip unlayered deps; both ends of the new edge are unlayered, so **no pair is minted,
neither baseline JSON moves, and `ARGUED_ROSTER_CEILING` does not move.**

### §11.3 · prose-numerics — NOT OWED, and NO line-addressed row sits in the edited file

```
$ grep -o '"src/domain/worldPulse/[^"]*"' tests/lint/.prose-numerics-baseline.json | sort -u
"src/domain/worldPulse/brokerageServices.js"
"src/domain/worldPulse/calamityKernel.js"
"src/domain/worldPulse/demographicsPlans.js"
"src/domain/worldPulse/magicBufferApply.js"
"src/domain/worldPulse/warCoalitionExpenditure.js"
"src/domain/worldPulse/warCostsNews.js"
```

`causeLifecycle.js` carries **zero** baseline rows, so the insertion cannot sit above one
(LANE-EM-PREPROOF step 13). The packet renders no figure.

### §11.4 · the wiring census's stamped bytes — NOT OWED

```
$ node -e 'const c=require("./docs/content/wiring-census.json"); console.log(Object.keys(c.stamp.files).length)'
stamp.files count: 7
hits for causeLifecycle|worldPulseFates: NONE match
```

⇒ `tests/lint/proseWiringCensus.walker.test.js`'s `stale-bytes` arm cannot red (step 15).

### §11.5 · citations by line (step 16) — ONE hit, and it is ALREADY stale

```
$ git grep -n "causeLifecycle\.js:[0-9]" -- src docs/content tests
tests/domain/causeConjunctionContent.test.js:29:// vocabulary (causeLifecycle.js:165).
$ grep -n "function bearerSituation" src/domain/worldPulse/causeLifecycle.js
176:function bearerSituation(npc, ctx) {
```

The comment cites `:165` for `bearerSituation`, which lives at **:176** — the address is **already
wrong by 11 lines at this tip**, before this packet moves anything. It is prose in a test
comment; no walker reads it (`proseWiringCensus` reads `cite:` fields out of
`src/domain/prose/holderTable.js`, `:1730`). ⇒ **not a row of this packet** (fixing an
already-stale address here would mix causes); slotted in §15 N5.

### §11.6 · observed-shape readers and writer-reach — both EXECUTED, both NOT OWED

```
$ git status --short          ← EMPTY
$ node scripts/check-observed-shape-readers.mjs
observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.
… exit=0
$ node scripts/check-writer-reach.mjs
WRWALKER HOLD — judged 6537 · LIT 572 · LIT-NAME 4671 · DARK 1294 (reviewable 495) · pending-surface debt: … (3 §12 WRW-2 owner rows)
$ git status --short          ← EMPTY
```

Both scripts write only behind `--write` (`check-observed-shape-readers.mjs:58`;
`check-writer-reach.mjs:21,76`), and the tree is quoted clean before and after. The packet adds
**no new save-time-key reader** (`worldPulseFate` is already read at this exact site today) and
**no new reader of a settlement field under `src/domain/edit/**`**. Both figures are the build
lane's baseline; **motion is a STOP**.

### §11.7 · the lighting census — the walker's OWN classifier, run at this tip

`$S/t/park-probe.mjs` serves the walker's source with one appended export line and stubs
`vitest`; it calls the walker's own `parkReasonsFor`/`classify` — never a replica.

```
$ node park-probe.mjs $S/o/park.json tests/domain/causeResolutionLifecycle.test.js tests/domain/ruinInstitution.test.js tests/lint/vocabularyTotality.walker.test.js tests/domain/corruptionWebPins.test.js tests/domain/institutionFounding.test.js
tests/domain/causeResolutionLifecycle.test.js   parkReasonsFor -> []  => CREDITED; titles=29 suiteTitles=9
tests/domain/ruinInstitution.test.js            parkReasonsFor -> []  => CREDITED; titles=7  suiteTitles=1
tests/lint/vocabularyTotality.walker.test.js    parkReasonsFor -> []  => CREDITED; titles=26 suiteTitles=6
tests/domain/corruptionWebPins.test.js          parkReasonsFor -> []  => CREDITED; titles=33 suiteTitles=11
tests/domain/institutionFounding.test.js        parkReasonsFor -> []  => CREDITED; titles=7  suiteTitles=1
TEST_FILES walked by the walker: 2650
```

⇒ the REGISTER row's host (`vocabularyTotality.walker.test.js`) is **CREDITED**, so the one `it`
it gains really counts. The CREATE target is a new file and its credit is this packet's to earn:
ONE literal `describe`, SEVEN straight-line `it`, and ⛔ **no variable, parameter or import may be
named `it`, `test` or `describe`** (the `OPENER_UNRESOLVED:it` cause that parked EM-B1e's file
until CURE-C, `145acdb75`).

⛔ **NO CENSUS ABSOLUTE IS QUOTED.** The DELTA is in §7 of the packet.

---

## §12 · `LIFECYCLE_CLOSE_FATES` — IS THE 3-OF-15 RESTRICTION DELIBERATE? (the chair's Q4)

⛔ Measured, NOT derived from the kind. Five findings.

**(1) It was born as a MIRROR of one deriver's three returns, in the same hunk.**

```
$ git log -S LIFECYCLE_CLOSE_FATES --oneline -- src tests scripts docs
63de6da75 DOC: the fifth fold … (the charter's amendments)
831ba5c0c The provenance lane folds: roster provenance becomes readable, and its single-writer walker stands
3e1763de8 Stressor dynamics: counterforces, synergies, variants, echoes, corruption duality
$ git log -1 --format='%h %ad %s' --date=short 3e1763de8
3e1763de8 2026-06-10 Stressor dynamics: counterforces, synergies, variants, echoes, corruption duality
$ git show 3e1763de8 -- src/domain/worldPulse/institutionLifecycle.js | grep -B8 -A20 LIFECYCLE_CLOSE_FATES
+const LIFECYCLE_BUILD_FATES = new Set(['built', 'reopened']);
+const LIFECYCLE_CLOSE_FATES = new Set(['shuttered', 'bankrupt', 'closed_for_want_of_custom']);
+
+// Damping counters come from institutionHistory rather than instance booleans:
+// booleans saturate after one close/reopen cycle … The history cap (24) means only
+// RECENT events damp — amnesty for ancient history is the right shape for an
+// equilibrium, not a ratchet.
+function priorLifecycleCounts(settlement) { … }
+
+function closureFateForInstitution(inst) {
+  … return 'shuttered'; … return 'bankrupt'; … return 'closed_for_want_of_custom';
+}
```

The set and `closureFateForInstitution` were introduced **in the same diff, eleven lines apart**,
and the set is **exactly that deriver's three returns**. The commit message never mentions the
restriction; the only comment above the counter explains history-vs-booleans and the 24-cap, and
says nothing about which fates count.

**(2) It is not a subset of `worldPulseFate` at all — it belongs to the OTHER vocabulary.**
`priorLifecycleCounts` reads `entry?.fate` from `settlement.institutionHistory`
(`institutionLifecycle.js:641-648`), and its sibling `LIFECYCLE_BUILD_FATES` holds `built` and
`reopened`, which are **not `worldPulseFate` members at all** (EM-B1h §13). So "3 of the 15
closure fates" compares two different vocabularies; EM-B1j owns the second one.

**(3) It is FROZEN by an EXACT both-ways pin in a lint walker.**

```
$ sed -n '293,301p' tests/lint/provenanceStampSingleWriter.walker.test.js
  test('THE FREEZE: the two fate vocabularies are exactly the frozen sets', () => {
    …
    expect(setOf('LIFECYCLE_BUILD_FATES')).toEqual(['built', 'reopened']);
    expect(setOf('LIFECYCLE_CLOSE_FATES')).toEqual(['bankrupt', 'closed_for_want_of_custom', 'shuttered']);
$ git log -1 --format='%h %ad' --date=short -S LIFECYCLE_CLOSE_FATES -- tests/lint/provenanceStampSingleWriter.walker.test.js
831ba5c0c 2026-07-27
```

**(4) The freeze's STATED reason is drift, not semantics.** The arm beside it reads:
*"while the engine reads only `fate`, a lane may add keys … Widening this read makes every such
addition a golden mover under THE PROMISE — take it to the T4 batch with an owner-signed shift,
never here."*

**(5) The freeze has an EXECUTED mutant on record** (`scripts/mutation-coverage-manifest.json`,
the provenance-stamp row): *"(4) dropping 'reopened' from `LIFECYCLE_BUILD_FATES` reds THE FREEZE
vocabulary assertion."*

⇒ ⭐ **MEASURED VERDICT: nowhere in the tree or its history is the 3-word restriction argued as a
deliberate semantic choice.** It is a mirror of one deriver, later frozen for a different reason
(seeded-advance drift). Widening it would (a) change lived behaviour — 3 counted words → 15 would
begin damping rebuild odds where nothing damps them today — and (b) **red an exact both-ways pin
in a landed lint walker**. ⛔ **This packet does not touch it.** It is R4 / Q4 in §15.

---

## §13 · `vocabularyTotality` — EM-B1h's N9, measured

```
$ sed -n '15,28p' tests/lint/vocabularyTotality.walker.test.js
 * THE RULE. For each producer→consumer vocabulary contract below, the consumer's
 * recognized set must equal the producer's emitted set EXACTLY, both ways:
 *   • no consumer entry without a producer that emits it (no dead arm), and
 *   • no producer value without a consumer entry (no silent miss).
 * TO COMPLY … bind the consumer to its producer set (import the producer's keys …)
$ grep -n "function objectLiteralKeys" tests/lint/vocabularyTotality.walker.test.js
88:export function objectLiteralKeys(src, name) {
$ grep -n "src/domain/worldPulse/.*|" tests/lint/vocabularyTotality.walker.test.js | head -5
242:  'src/domain/worldPulse/convergence.js|FRIENDLY_REL': Object.freeze({
247:  'src/domain/worldPulse/conquestDoctrineStage.js|COALITION_FRIENDLY_LABELS': Object.freeze({
256:  'src/domain/worldPulse/warCapacityReads.js|ALLY_SUPPORT_TYPES': Object.freeze({
262:  'src/domain/worldPulse/warHomeCosts.js|LEVY_SUPPORT_TYPES': Object.freeze({
```

⭐ **A ROW IS OWED, BUT NOT THE ONE EM-B1h PREDICTED.** A row over the eighteen FATE WORDS would
be vacuous: the consumer derives its reading from the producer's own map by import, so an equality
between them is self-referential (§P6's anti-vacuity rule). The **non-vacuous** contract is one
level up and it is exactly this walker's class: ⛔ **the consumer branches on KINDS, and a FOURTH
kind declared by EM-B1h's leaf would fall through to "not destroyed" — a silent default.** The row
therefore binds `DESTROYED_BY_FATE_KIND`'s keys to `WORLD_PULSE_FATE_KINDS`, both ways, using the
walker's own `objectLiteralKeys` helper over `src/domain/worldPulse/causeLifecycle.js` — the exact
shape of the four `src/domain/worldPulse/…|CONST` rows already at `:242-262`.

---

## §14 · EM-B1h's A6 ARM — THIS PACKET IS THE VIOLATION IT WAS BUILT TO CATCH

EM-B1h §9 A6 (kit `packets-waiting/EM-B1h.md`): *"⭐⭐ **AND THE GOLDEN-NEUTRALITY CLAIM IS
MACHINERY: a source scan proves NO file under `src/` imports `WORLD_PULSE_FATE_KIND`** — the kind
is data with no reader … **EM-B1i is named in the message a violation prints.**"* — and EM-B1h
§11's STOP list: *"⛔ **any `src/` file would have to READ `WORLD_PULSE_FATE_KIND`** — that is
EM-B1i's."*

⇒ **EM-B1i MUST carry the arm's NARROWING as a declared TEST row**, or its own build reds a
landed walker. The narrowing is a roster, not a deletion: the scan's result must be SET-EQUAL,
both ways, to `['src/domain/worldPulse/causeLifecycle.js']`, so a SECOND reader still reds. The
CREATE target's A6 asserts the same fact from the other side.

⚠ `isWorldPulseFate` is not scanned by that arm; only `WORLD_PULSE_FATE_KIND` is.

## §15 · CREATE target absent; the named paths all exist

```
$ ls tests/domain/institutionDestroyedByKind.test.js
ls: …: No such file or directory
$ git ls-files tests/domain/institutionDestroyedByKind.test.js | wc -l
0
```

Every path named in `checks` was existence-checked; all twenty print `OK` (the run is in
`EM-B1i.compile.report.md` §6).

## §16 · requiredSymbols — each proved present, each simulated against the packet's own edits

```
$ grep -cF "<symbol>" <path>
src/domain/worldPulse/causeLifecycle.js      "function institutionDestroyed(inst) {"                 → 1
src/domain/worldPulse/causeLifecycle.js      "const NONSTANDING_STATUS = new Set("                   → 1
src/domain/worldPulse/causeLifecycle.js      "export function advanceCauseLifecycle"                 → 1
src/domain/worldPulse/causeLifecycle.js      "function sustainingInstitution(settlement, npc) {"     → 1
src/domain/worldPulse/calamityKernel.js      "worldPulseFate: 'demoted_by_disaster',"                → 1
src/domain/worldPulse/upswingKernel.js       "worldPulseFate: 'upgraded_by_reconstruction' }"        → 1
src/domain/worldPulse/upswingKernel.js       "worldPulseFate: 'founded_by_flourishing' }"            → 1
src/domain/worldPulse/institutionLifecycle.js "const LIFECYCLE_CLOSE_FATES = new Set("               → 1
tests/domain/ruinInstitution.test.js         "function leashSevered(sustainer) {"                    → 1
src/domain/worldPulse/pulseKernel.js         "import { advanceCauseLifecycle, projectCauseLifecycleOntoSettlement, causeLifecycleNewsEntries } from './causeLifecycle.js';" → 1
```

**POST-EDIT SIMULATION (LANE-EM-PREPROOF step 10), row by row:** the packet re-spells **no**
symbol text. It (a) adds ONE import line at the top of `causeLifecycle.js`, (b) adds ONE `const`
immediately above `institutionDestroyed`, and (c) replaces lines INSIDE the function's body. The
signature line, `NONSTANDING_STATUS`'s declaration prefix, `advanceCauseLifecycle`'s and
`sustainingInstitution`'s declarations, the three write-site literals, `LIFECYCLE_CLOSE_FATES`'s
prefix, `leashSevered` and `pulseKernel.js`'s import clause are all untouched.
⇒ ⭐ **`retiredSymbols`: NONE.** No other LANDED packet's rows are disturbed.

⛔ **THE ROWS THIS PACKET CANNOT PROVE YET, AND THEREFORE DOES NOT CLAIM.**
`WORLD_PULSE_FATE_KIND`, `WORLD_PULSE_FATE_KINDS` and `isWorldPulseFate` live in EM-B1h's CREATE
target, which does not exist at this tip:

```
$ ls src/domain/worldPulse/worldPulseFates.js
ls: …: No such file or directory
```

The standard admits only symbols present at the verified base. The chair adds these three rows at
promotion — after EM-B1h has LANDED — with:

```sh
grep -cF "export const WORLD_PULSE_FATE_KIND"  src/domain/worldPulse/worldPulseFates.js   # expect 1
grep -cF "export const WORLD_PULSE_FATE_KINDS" src/domain/worldPulse/worldPulseFates.js   # expect 1
grep -cF "export function isWorldPulseFate"    src/domain/worldPulse/worldPulseFates.js   # expect 1
```

## §17 · Mid-lane tree control

```
$ git rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git status --short
                       ← EMPTY
$ date
Sun Sep 20 02:16:12 EDT 2026
```

## §18 · The charter row this packet answers

```
$ git -C /Users/cstokes/Desktop/settlement-engine show review-fixes-2026-07-08:docs/implementation/charters/EDIT-MODE-TRAIN.md | grep -n "EM-B1i"
292:## Amendments of 2026-09-19 19:10 EDT — EM-B1h's compile ruled; a live pulse defect found and slotted as EM-B1i (ODQ §934.47 addendum 28)
295:- **A LIVE DEFECT THE COMPILE FOUND …** FATE: **EM-B1i** (NEW; train EM-T6, right after EM-B1h, before EM-B1a): that reader tests the `closure` KIND EM-B1h declares; measured first over the pulse goldens and the preset witness — if a golden moves, it is a lived-behaviour change and goes through the OWNER's signed door with the before/after in plain words.
323:- **EM-B1h VERSION 2 ACCEPTED …** **EM-B1i's population is THREE, not two** … `LIFECYCLE_CLOSE_FATES` is 3 of the 15 closure fates … EM-B1i's compile measures whether that is deliberate and puts it to the chair.
```

## §19 · §7 ↔ JSON change manifest, proved SET-EQUAL

See `EM-B1i.compile.report.md` §5 for the executed comparison and the `PACKET_ACTIONS` print.

## §20 · What this lane did NOT run

No vitest, no eslint CLI, no tsc, no build, no `npm run *`, no gate. eslint's `Linter` was
imported as a LIBRARY; esbuild was run on scratch fragments only; `check-observed-shape-readers`
and `check-writer-reach` were run in their documented READER mode with the tree quoted clean on
both sides. Nothing was implemented, edited, staged or committed anywhere.

## §21 · The tree, closed

```
$ git -C $SP/read-tip-32602dc60 rev-parse HEAD
32602dc607b7423838249cf57d73baf08feb047d
$ git -C $SP/read-tip-32602dc60 status --short
                       ← EMPTY
```
