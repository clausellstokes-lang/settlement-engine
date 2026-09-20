# EM-B1e — evidence

⚠ **THIS FILE IS STARTED BY THE PRE-PROOF LANE.** The compile lane (2026-09-19, base `d31af2cee`)
produced `EM-B1e.md` and `EM-B1e.manifest.json` but **no evidence file** — none exists in
`chair-kit-923472dc/packets-waiting/` nor in `chair-kit-923472dc/evidence/`. Sections §1–§20 below
are therefore the FIRST receipts this packet carries, all executed at the pre-proof tip. Nothing is
rewritten, because there was nothing to rewrite; a later lane APPENDS numbered sections and never
edits these.

**Tree read:** `$SP/read-tip-58fcfe614`, detached at `58fcfe61458b784b0470b854caf916b7c2961edf`.
**Lane:** Opus PRE-PROOF, session 7d3418f8, 2026-09-19 ~17:3x EDT.
**Rule:** a fact without a command is not verified. Every row below is CONFIRMED (quoted command +
output) unless it says PLAUSIBLE.

---

## §1 · The tip, the preamble hash, and the ancestry

```
$ git -C $SP/read-tip-58fcfe614 rev-parse HEAD
58fcfe61458b784b0470b854caf916b7c2961edf

$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6  …/EM-PREAMBLE.md

$ git merge-base --is-ancestor d31af2ceebf643818201b2e2ab4a556765d2fc7c HEAD && echo IS ANCESTOR
IS ANCESTOR

$ date
Sat Sep 19 17:31:21 EDT 2026
```

⇒ The preamble hash **matches the chair's stated value exactly**. The compile-time base
`d31af2cee` is an ancestor of the tip.

---

## §2 · THE J-T1 WINDOW — empty, and HEAD re-read in the same command

```
$ git -C … rev-parse HEAD; git -C … diff --stat d31af2cee 58fcfe614 -- \
    src/domain/worldPulse/calamityKernel.js tests/domain/ruinInstitution.test.js \
    src/domain/provenance/rosterProvenance.js src/domain/worldPulse/causeLifecycle.js \
    src/domain/entities/status.js tests/lint/sovereigntyLightingContract.walker.test.js
58fcfe61458b784b0470b854caf916b7c2961edf
(exit 0)   ← NO OUTPUT: not one declared path moved in the window
```

Per-path blob identity, the stronger form of the same claim:

```
$ for p in <the four substrate paths>; do compare rev-parse <base>:$p vs <tip>:$p; done
IDENTICAL src/domain/worldPulse/calamityKernel.js    73c5203175eb7260afc3e693242b354c3f901383
IDENTICAL src/domain/provenance/rosterProvenance.js  ad44785eadd3d70bd30e5ee602e42b0d7b3bd144
IDENTICAL src/domain/worldPulse/causeLifecycle.js    d4405a8ccefdbba8a2d9e5ca5f2564268fd8e6c1
IDENTICAL src/domain/entities/status.js              190fae93c4123c7cb56066dd37c4fc6c220e66e4
```

⇒ **Every line number the compile lane recorded is still exact at the tip**, because the blobs are
byte-identical. This is the strongest possible J-T1 result.

**CREATE target absent and untracked:**

```
$ ls tests/domain/ruinInstitution.test.js
ls: …/tests/domain/ruinInstitution.test.js: No such file or directory
$ git ls-files --error-unmatch tests/domain/ruinInstitution.test.js
error: pathspec 'tests/domain/ruinInstitution.test.js' did not match any file(s) known to git
```

---

## §3 · Every verified fact re-found BY SYMBOL at the tip

```
$ grep -n "const ruin" src/domain/worldPulse/calamityKernel.js
250:  const ruin = (/** @type {CalInstitution} */ inst, /** @type {string} */ reason) => ({

$ grep -n "ruin(" src/domain/worldPulse/calamityKernel.js
282:        if (gi >= 0) { list[gi] = ruin(list[gi], 'Razed as the district collapsed to a single survivor after the disaster.'); removedNames.push(gone); }
286:      list[idx] = ruin(list[idx], 'Destroyed outright by the disaster.');

$ grep -n "status: 'ruined'" src/domain/worldPulse/calamityKernel.js
251:    ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true,

$ wc -l src/domain/worldPulse/calamityKernel.js
     831
```

The five added keys and their order, read whole at `:250-253`:

```js
250	  const ruin = (/** @type {CalInstitution} */ inst, /** @type {string} */ reason) => ({
251	    ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true,
252	    worldPulseFate: 'destroyed_by_disaster', remnantReason: reason,
253	  });
```

⇒ **CONFIRMED: five added keys, in the order the packet states.**

The demotion branch at `:274` — named so it is not swept in as a third site:

```
274	        worldPulseFate: 'demoted_by_disaster',
```
read in context `:269-276`: `{ ...list[idx], name, id, description:'', tags:[], worldPulseFate:'demoted_by_disaster', demotedFrom }`
— **no `status:'ruined'`, no `_worldPulseInactive`.** ⇒ CONFIRMED not a ruin site.

⭐ **A TRAP FOUND AND RECORDED — a fourth `ruin` token that is NOT the arrow:**

```
$ grep -n "\bruin\b" src/domain/worldPulse/calamityKernel.js
250:  const ruin = (…) => ({            ← the arrow
282:        … = ruin(list[gi], 'Razed as the district collapsed…')
286:      … = ruin(list[idx], 'Destroyed outright by the disaster.')
816:      ruin: `${k === 1 ? 'an institution lies' : `${k} institutions lie`} in ruin`,
```

`:816` is an **object KEY in a prose template**, in a different function, unrelated to the writer.
A careless rename sweep (`s/ruin/ruinInstitution/`) would corrupt it. Recorded in the packet's §5
as a named DO-NOT-TOUCH.

**The four `requiredSymbols` rows, each proved present verbatim:**

```
$ grep -c "export function strikeCapForTier" src/domain/worldPulse/calamityKernel.js   → 1   (:196)
$ grep -c "const INACTIVE_STATUSES"          src/domain/provenance/rosterProvenance.js → 1   (:81)
$ grep -c "worldPulseFate"                   src/domain/worldPulse/causeLifecycle.js   → 2   (:69, :139)
$ grep -c "EntityStatus"                     src/domain/entities/status.js             → 4   (:23, :77, :79, :171)
```

```
81:const INACTIVE_STATUSES = Object.freeze(['removed', 'destroyed', 'remnant', 'ruined']);
69:/** @typedef {{ status?: string, worldPulseFate?: unknown, … }} InstLike */
139:  if (inst.worldPulseFate) return true;
23:/** @typedef {'active'|'impaired'|'removed'|'destroyed'|'vacant'} EntityStatus
258:  const fate = textOrNull(inst.worldPulseFate);
259:  const pulseReason = textOrNull(inst.remnantReason) || textOrNull(inst.removedReason);
```

⇒ Every §5 fact holds at the tip, at the same line numbers. The ruling's conditional (`worldPulseFate`
has no closed vocabulary) is re-confirmed: the typedef at `causeLifecycle.js:69` declares it
`unknown`, and the only readers are a free-text read (`rosterProvenance.js:258`) and a truthiness
test (`causeLifecycle.js:139`).

---

## §4 · ⭐ A FIFTH REQUIRED SYMBOL IS OWED — a LANDED packet pins this very file

Scanned the live registered manifest (188 entries) for any row touching this packet's paths:

```
$ node -e "<read docs/implementation/PACKET_MANIFEST.json; report rows on my paths>"
manifest entries: 188
--- ANY entry with a requiredSymbols row on my MODIFY path ---
    MF-T2R LANDED :: "export function forceCalamityStrike"
--- ANY entry whose changeManifest touches my paths ---
    (none)
--- is EM-B1e placed in the tree manifest? ---
    []
--- statuses present ---
    ["LANDED","SUPERSEDED","READY"]
```

```
$ grep -c "export function forceCalamityStrike" src/domain/worldPulse/calamityKernel.js → 1
492:export function forceCalamityStrike({ settlement, item, id, year, tick, forkFn, … }) {
```

⇒ **MF-T2R (LANDED) pins `export function forceCalamityStrike` at the exact file this packet
MODIFIES.** By the standard's rule — *a symbol the deliverable must find unchanged is a required
symbol* — the row is **ADDED** to this packet's `requiredSymbols`, so the landed pin is discharged
from this packet's own manifest rather than only from MF-T2R's. **No row is removed.**

**Collision group ⇒ NONE, measured:** no other manifest entry, at any status, names either of this
packet's two paths in a `changeManifest`. EM-B1e itself is **not yet placed** in the tree manifest
(`[]`), so the chair places it fresh at promotion.

The file's full export surface (8 exports today; the packet makes it 9):

```
$ grep -n "^export " src/domain/worldPulse/calamityKernel.js
180:export function promotesTo    196:export function strikeCapForTier    492:export function forceCalamityStrike
523:export function forceCalamityEntry    567:export function advanceCalamity    740:export function buildExodusOutcome
775:export function applyExodusToUpdates   831:export { CALAMITY_TUNING }
```

---

## §5 · ⭐ THE MUTATION-COVERAGE QUESTION, ANSWERED BY EXECUTION (not by citation)

The chair asked whether `tests/domain/` is an ENFORCER directory. Executed against the estate's own
enumeration rule, with a positive control:

```
$ node -e "<import tests/lint/mutationCoverage.shared.mjs; test the CREATE path>"
ENFORCER_DIRS: ["tests/lint","tests/design","tests/docs","tests/data","tests/copy",
                "tests/security","tests/edgeFunctions","tests/generators"]
NAME_PATTERN: /(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|
                freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i
in an enforcer dir?                                     false
basename matches NAME_PATTERN?                          false
--- control: a file that SHOULD match ---
sovereigntyLightingContract.walker.test.js ->           true
--- live enumeration ---
live invariant count: 705
any tests/domain rows? 44
```

⇒ **`tests/domain` is NOT one of the eight enforcer dirs**, and `ruinInstitution.test.js` carries
none of the sixteen nomenclature tokens (checked by execution, not by eye — the shared module's own
docblock warns that the substring match over-includes, e.g. "…SpinKeyframe…" matching "pin"). The
positive control fires, so the test is not vacuous.

⇒ ⭐ **NO mutation-coverage row is owed, and `scripts/mutation-coverage-manifest.json` is NOT in
this packet's change manifest.** The 705 figure independently corroborates EM-B1d's "705 → 706".

**The contention the chair asked about does not exist for this packet.** The live non-terminal
reserver of that path is **EM-B1d (READY) alone** — EM-P2 and EM-P1 are in the chair kit, not placed
in the tree (`statuses present: ["LANDED","SUPERSEDED","READY"]`; no STALE row survives). Since
EM-B1e owes no row at all, **it contends with nobody and its ability to FLOAT is unaffected.**

---

## §6 · ⭐ THE EM-B1d COUPLING — measured, and it CANNOT bite

EM-B1d's union-totality walker (`tests/lint/statusUnionTotality.walker.test.js`, a CREATE in the
slot right now) is specified in its §6:

> *"T2 strips block and line comments from every file under `src/` excluding `**/*.test.*`, flags
> each file whose remaining source contains any of the quoted literals `'dead'`, `'exiled'` or
> `'retired'` — the TRIGGER SET …"*

Two independent reasons it cannot reach this packet:

```
$ grep -n "'dead'\|'exiled'\|'retired'" src/domain/worldPulse/calamityKernel.js
(exit 1 — NO MATCH)
```

1. **The MODIFY target carries no trigger token**, so `calamityKernel.js` is not among the walker's
   eight flagged files and this packet adds no token (its literals are `'ruined'`,
   `'destroyed_by_disaster'`, `'ruined_by_decree'` — none is in the trigger set).
2. **The CREATE target is out of the scan root entirely** — the walker scans `src/`;
   `tests/domain/ruinInstitution.test.js` is under `tests/`.

⇒ **EM-B1d's walker demands NOTHING of this packet.** File disjointness independently confirmed:
EM-B1d's seven declared paths (`entities/npcs.js`, `density/factionLifecycle.js`,
`entities/successors.js`, `worldPulse/envoyCasting.js`, `worldPulse/magicFormsPractitioner.js`,
`scripts/mutation-coverage-manifest.json`, `tests/lint/statusUnionTotality.walker.test.js`) share
not one path with this packet's two.

### §6.1 · Where `ruined` went — the charter row is STALE, the packets are right

The charter's EM-T3 row still reads *"the vocabulary widening: `jailed` **and `ruined`** into the
two typedefs"*. EM-B1d version 4 narrowed to `jailed`. The disposition is in EM-B1d's own §2a:

```
$ git -C /Users/cstokes/Desktop/settlement-engine show review-fixes-2026-07-08:docs/implementation/charters/EDIT-MODE-TRAIN.md | grep -n "ruined"
28:| EM-T3 | … EM-B1d (the vocabulary widening: `jailed` and `ruined` into the two typedefs …) |
```

EM-B1d header (`:9-10`) and §2a (`:151`), read in the tree:

> *"the institution-state contract moves into **EM-B1a** (§2a), its shared ruin writer into
> **EM-B1e**."*
> *"`ruined` | **`EntityStatus` is NOT widened**; the two vocabularies stay apart. EM-B1a's
> `set-institution-state` offers the pool of five and, for `ruined`, writes the pulse's own shape
> through **EM-B1e's** shared `ruinInstitution` writer | ⛔ the whole `EntityStatus` half LEAVES
> this packet"*

⇒ ⭐ **EM-B1e owes NO typedef member for `ruined`, and none is owed anywhere.** Under ODQ §934.47
addendum 6 the two vocabularies stay apart: `EntityStatus` keeps its five (verified at
`src/domain/entities/status.js:23` — `'active'|'impaired'|'removed'|'destroyed'|'vacant'`), and
`ruined` already exists at the tip as the **pulse's own literal**, enumerated in
`rosterProvenance.js:81` `INACTIVE_STATUSES = ['removed','destroyed','remnant','ruined']`. The
`ruined` half of the old charter row became **EM-B1a's** `set-institution-state` op, which CALLS
this packet's writer. Nothing is owed here. **The charter's EM-T3 row is stale prose — flagged to
the chair, not adjudicated (R5).**

---

## §7 · ⭐ THE PACKET FLOATS — the charter amendment, quoted

```
$ … show review-fixes-2026-07-08:docs/implementation/charters/EDIT-MODE-TRAIN.md | grep -n "EM-B1e"
189:## Amendments of 2026-09-19 17:26 EDT — … EM-B1e FLOATS (ODQ §934.47 addendum 21)
197:| **floating** | **EM-B1e** (the pulse's one ruin writer): its header says `Depends on: NONE`,
     its two paths touch no other member's — it is pre-proofed NOW and built whenever the slot would
     otherwise wait for a READY packet, joining whichever train is open |
30:|  **EM-T5** | EM-A1 · EM-A2b · EM-B1e (the shared ruin writer) · EM-P1b | …
152:| **EM-T5** | EM-A1 … · EM-B1e · EM-P1b … · **EM-B3c** | …
```

⇒ The amendment of **17:26 EDT** is the newest word and **supersedes** the two older EM-T5 rows
(`:30`, `:152`) that still list EM-B1e as a T5 member, and the draft's own *"Rides in train T3
beside EM-B1d"*. The header is rewritten to FLOATING. **Consequence, which the brief anticipated:
every register prediction in this packet is a DELTA**, because the train it joins is not yet known
and the lighting tuple will be refrozen by some other train's terminal before this packet builds.

---

## §8 · The lighting census — the draft's absolute is STALE; only the DELTA survives

```
$ cat tests/lint/.lighting-census-baseline.json
  "measuredAtSha": "baf8ccc1da4f7e327ad1d4d053ad814a830a90bf",
  "measuredBy": "EM-P0",  "date": "2026-09-19",
  "files": 2646,  "parked": 383,  "credited": 2263,  "titles": 25005,  "suiteTitles": 6671
```

The draft's Baseline posture quotes `2645 / 383 / 2262 / 25009 / 6670` — **it matches neither the
frozen tuple nor anything else at this tip**, and it is an ABSOLUTE in a FLOATING packet. Removed
under the chair's R11 rule.

**The DELTA this packet causes, derived from its own CREATE row** (one new test file; ONE literal
`describe`; SEVEN straight-line `it`):

| files | parked | credited | titles | suiteTitles |
|---:|---:|---:|---:|---:|
| **+1** | **+0** | **+1** | **+7** | **+1** |

Cross-checked against EM-B1d's independently-derived delta for the same shape — one new file, one
`describe`, **four** `it` → `+1 / +0 / +1 / +4 / +1`. The arithmetic is identical with 7 in place of
4. ⇒ the mapping (titles = `it` count, suiteTitles = `describe` count) is corroborated.
**The absolute is the chair's stamp at promotion from the live baseline; this packet quotes none.**

---

## §9 · ⭐ R3 CLOSED BY MEASUREMENT — no edge-shared closure contains this file

The draft left R3 open (*"this lane did NOT measure whether `calamityKernel.js` sits inside a bundle
closure named in `scripts/build-edge-shared.mjs`"*) and made it a §11 STOP. Measured directly from
the five committed metas' own `inputs` arrays — the authoritative record the script itself writes:

```
$ grep -n "entry:" scripts/build-edge-shared.mjs
34: aiGrounding → src/domain/aiGrounding.js      35: analyticsEvents → src/lib/analyticsEvents.js
36: aiCharter   → src/domain/aiCharter.js        37: intentAtlas     → src/domain/intentAtlas.js
38: aiOutputSchema → src/domain/aiOutputSchema.js

$ for m in supabase/functions/_shared/*.meta.json; do <count inputs matching calamityKernel>; done
  aiCharterBundle.meta.json       -> calamityKernel hits / total inputs: 0 114
  aiGroundingBundle.meta.json     -> 0 74
  aiOutputSchemaBundle.meta.json  -> 0 115
  analyticsEventsBundle.meta.json -> 0 2
  intentAtlasBundle.meta.json     -> 0 2
```

⇒ **`calamityKernel.js` is in NONE of the five edge-shared closures (0 of 405 total inputs).**
No `npm run build:edge-shared` regeneration is owed, no generated artifact moves, and **R3's STOP
condition is deleted** rather than carried to the build lane.

---

## §10 · ⭐ THE BUNDLE BUDGETS — measured, with the method stated

**Method.** No build was run (forbidden to this lane). Two static measurements instead:
(a) an ESM import-graph walk from each worker entry, distinguishing **static** edges (same chunk)
from **dynamic** `import()` edges (a new chunk / lazy boundary); (b) for first paint, the repo's OWN
derivation `computeEagerModuleGraph()` (`vite.config.js:248-274`), whose resolver and regexes I
copied **verbatim** rather than approximating, seeded at `src/main.jsx`, static edges only.

```
=== GENERATION WORKER (WORKER_BUNDLE_CEILING_BYTES = 1401208, EXACT / monotone-down / ZERO SLACK)
    entry=src/workers/generation.worker.js  edges=STATIC ONLY      modules=220  calamityKernel REACHABLE: false
    entry=src/workers/generation.worker.js  edges=STATIC+DYNAMIC   modules=228  calamityKernel REACHABLE: false

=== ADVANCE-INTERVAL WORKER (no ceiling today)
    entry=src/workers/advanceInterval.worker.js  edges=STATIC ONLY     modules=545  REACHABLE: true
    chain: src/workers/advanceInterval.worker.js
         -> src/domain/worldPulse/advanceInterval.js
         -> src/domain/worldPulse/pulseKernel.js
         -> src/domain/worldPulse/calamityKernel.js
```

```
EAGER FIRST-PAINT GRAPH (repo's own derivation, seed src/main.jsx, STATIC edges only)
  modules in eager closure : 243
  calamityKernel.js EAGER? : false
  pulseKernel.js    EAGER? : false      advanceInterval.js EAGER? : false
  rosterProvenance.js EAGER? : false    causeLifecycle.js  EAGER? : false
  entities/status.js  EAGER? : true     ← a requiredSymbols path, but READ-ONLY (not modified)
```

**The lazy engine chunk (`< 679_000`, ~870 B margin)** — settled by reading the chunk RULE rather
than guessing, `vite.config.js:862` and `:878`:

```
862	          if (id.includes('/src/generators/'))
863	            return 'engine';
878	          if (id.includes('/src/data/narrativeData.js'))
879	            return 'engine';
```
and the budget's subject, `tests/build/vendorPdfLazy.test.js:748-787`:
```
748	    const engine = files.find(f => /^engine-[A-Za-z0-9_-]+\.js$/.test(f) && !/^engine-core-/.test(f));
750	    const size = statSync(join(assetsDir, engine)).size;
786	    expect(size).toBeGreaterThan(300_000);
787	    expect(size).toBeLessThan(679_000);
```
⇒ the `engine` chunk admits `/src/generators/` and one data file. `calamityKernel.js` is
`src/domain/worldPulse/` ⇒ **not in it.**

### THE VERDICT TABLE

| budget | instrument | slack today | **is this packet in it?** | how measured |
|---|---|---|---|---|
| Generation worker `WORKER_BUNDLE_CEILING_BYTES = 1401208` | `tests/build/generationWorkerLazy.test.js:159,468` | **ZERO (exact, monotone-down)** | ⛔ **NO** | import-graph walk, static AND static+dynamic (220/228 modules) |
| Lazy engine `< 679_000` | `tests/build/vendorPdfLazy.test.js:787` | ~870 B | ⛔ **NO** | the chunk RULE is `/src/generators/` (`vite.config.js:862`) |
| First-paint eager closure | `EAGER_FIRST_PAINT_MODULES` + its arms | — | ⛔ **NO** | the repo's own `computeEagerModuleGraph`, 243 modules |
| `advanceInterval.worker` bundle | ⚠ **none today** | n/a | ⭐ **YES** (static, 3 hops) | import-graph walk, 545 modules |

⇒ ⭐ **THE PACKET LANDS IN NO BUDGETED CHUNK.** Under the brief's step 5 that means **no budget TEST
rows are added, and no `npm run build` / attribution step is written into the build lane.** The one
bundle it does land in is uncapped.

### §10.1 · The bytes, priced anyway — for TOOL-3's sequencing

Measured with the repo's own esbuild (`node_modules/esbuild`), minifying a faithful before/after of
exactly the edited region (the private arrow + its two call sites → the exported writer + the two
re-pointed sites), ESM, `minify: true`:

```
PRE  (private arrow, 2 sites)      : 496 B minified
POST (exported writer + validation): 766 B minified
DELTA: +270 B minified (un-gzipped), the packet's own modules only
  of which the A3 required-argument guard costs: +85 B
  the refactor alone (no guard): +185 B
```

The +185 B is structural and unavoidable: an **exported** name cannot be mangled (the private `ruin`
minifies to one character), and each call site gains an options-object wrapper plus the explicit
`fate: 'destroyed_by_disaster'` literal. The +85 B is the two `throw`s A3 requires.

⚠ PLAUSIBLE, stated as such: this is a minified-source delta for the edited region, not a measured
chunk delta from a real build; a real Rollup chunk figure could differ by tree-shaking and shared
string interning. It is an upper-bound-shaped estimate and the chair should treat it as ±.

⭐ **SEQUENCING CONSEQUENCE (the chair's question 5):** TOOL-3 will mint the `advanceInterval.worker`
ceiling. The ceiling law is MONOTONE-DOWN, so a mint taken BEFORE this packet lands makes this
packet's +270 B a **ceiling re-mint — a chair act** with attribution. A mint taken AFTER simply
measures the post-B1e figure and costs nothing. ⇒ **RECOMMEND: land EM-B1e BEFORE TOOL-3.** If that
is impossible, the chair prices a +270 B re-mint. Recorded as R6; not adjudicated here.

---

## §11 · ⭐ A LIVE WALKER THE DRAFT NEVER NAMED — `ruinFilterRoster`, and it makes §11's escape hatch a TRAP

`tests/lint/ruinFilterRoster.walker.test.js` source-scans `src/domain` for roster readers. Its own
header: enrolled files must be EITHER compliant (import the accessor **or** carry a
`_worldPulseInactive` guard) OR listed in `RUIN_AGNOSTIC_EXEMPT`. Its two regexes, read at the tip:

```js
const READER_RE = /\.institutions\b/;                          // asked of codeOnly(src)
const COMPLIANT_RE = /institutionRoster|_worldPulseInactive/;  // asked of RAW bytes
```

Executed against the MODIFY target, using the estate's own `codeOnly` from
`tests/helpers/codeOnlySource.js`:

```
=== ruinFilterRoster.walker verdict on calamityKernel.js ===
ENROLLED as a roster reader (codeOnly)?  true
COMPLIANT (raw bytes)?                   true
compliance token(s) present:             ["_worldPulseInactive"]
   _worldPulseInactive at :251  ...inst, status: 'ruined', _worldPulseInactive: true, …
```

⇒ ⭐⭐ **`calamityKernel.js` IS enrolled, and its ONLY compliance evidence is the single token
`_worldPulseInactive` at `:251` — the exact line this packet moves.** It does not import
`institutionRoster`.

**On the packet's MAIN path this is inert**: the function is lifted to module scope *within the same
file*, so the token stays in `calamityKernel.js` and compliance is preserved.

⛔ **But the draft's §11 escape hatch — *"the function moves to its own leaf"* — would REMOVE the
file's last compliance token and RED THIS WALKER**, turning an enrolled reader into an
unclassified violation. The draft never names this walker, so a build lane taking that STOP path in
good faith would break a guard it had never read.

⇒ Written into the packet as (a) a new verified-tree row, (b) a registration-ledger row, (c) a
rewritten §11 STOP: **if the function must leave the file, the packet returns to the chair** —
because the new leaf would also have to be enrolled or exempted, which is a register act, not a
lane's call. §12 measures the headroom that makes this branch unreachable in practice.

---

## §12 · ⭐ A7's ORACLE IS REFUTED AS WRITTEN — and the exact matcher that makes it true

A7 claims *"a source scan proves `status: 'ruined'` is written in exactly one place in `src/`"*.
The draft names no matcher. Executed three ways over 2,246 non-test `src/**` files:

```
RAW-byte scan hits  : 4
 ["src/domain/institutions/defenseInstitutionBuckets.js",   ← :41, inside a JSDoc block
  "src/domain/worldPulse/calamityKernel.js",                ← :251, THE WRITER
  "src/domain/worldPulse/institutionStatusModel.js",        ← :29 and :303, both comments
  "src/generators/defenseGenerator.js"]                     ← :38, inside a JSDoc block
CODE-ONLY scan hits : 0   []
```

⇒ **A raw scan finds FOUR** (three are prose describing the shape — exactly the class the estate's
`codeOnly` exists for). ⇒ **`codeOnly`, the estate's shared strip, finds ZERO**, because its own
docblock says it *"blanks comments AND string/template CONTENTS"* — so `'ruined'` becomes `'      '`
and the matcher can never fire. **`codeOnly` is the WRONG tool for A7** and a build lane reaching
for the obvious shared helper would write a vacuously-green arm.

The matcher that makes A7 true is a **comment-only** strip that KEEPS string contents:

```
files scanned under src/ : 2246
COMMENT-ONLY strip, /status:\s*'ruined'/ hits : 1
 ["src/domain/worldPulse/calamityKernel.js"]
matcher fires on a PLANTED writer?   true        ← guard-the-guard, positive control
matcher IGNORES a commented writer?  true        ← negative control
```

⇒ **A7's claim is TRUE, but only with the specified matcher.** The packet's §6 now carries the
matcher as an exact contract (the standard forbids discretion), both controls are written into the
arm, and §12's completion receipt must quote the hit list.

---

## §13 · A1's ORACLE IS CAPTURABLE — the recipe, since the writer is unreachable

`ruin` is private, and so is its enclosing function:

```
$ awk '…' src/domain/worldPulse/calamityKernel.js
enclosing fn: 222: function applyStrikeToRoster(institutions, targets) {   ← NOT exported
```

So A1's pre-edit oracle **cannot** be captured by importing the writer. It must be driven through an
exported entry. The tree already has a deterministic recipe, in the suite that reaches ruined rows
today:

```
$ grep -n "…" tests/domain/calamity.kernel.integration.test.js
 4: * The strike is driven through advanceCalamity with a controlled rng (a real hazard …
20:import { advanceCalamity, forceCalamityStrike, forceCalamityEntry } from '…/calamityKernel.js';
110:  return advanceCalamity({ …                        ← runStrike(): the driver
125:const struckOf = (res) => res.settlementUpdates.find((u) => u.saveId === 'thornwood').settlement;
146:    expect(instByName(struckOf(cascaded), 'Wine hall').status).toBe('ruined');
170:    expect(instByName(s, 'Blacksmith').status).toBe('ruined');   ← the DESTROY arm (:286)
173:    expect(instByName(s, 'Tavern').status).toBe('ruined');
```

⇒ `advanceCalamity` (exported, `:567`) with a controlled rng reaches **both** ruin sites — `:282`'s
collapse arm (`:146`) and `:286`'s destroy arm (`:170`, `:173`). Named in §8 step 1 and §9/A1 as the
oracle recipe, so the build lane does not have to invent one.

---

## §14 · The goldens that actually cover this path — and one that does NOT

**⛔ `tests/domain/advanceWorkerByteIdentity.test.js` does NOT cover this packet's claim.** Read
whole. It compares `sync` against `structuredClone(sync)` and against a Worker double running **the
same code**:

```
116	    expect(viaBoundary.worldState).toEqual(sync.worldState);
117	    expect(JSON.stringify(viaBoundary.worldState)).toBe(JSON.stringify(sync.worldState));
```

Both sides move together under any refactor, so it is a **relative** transport pin, not an absolute
oracle. It would stay green even if the ruin shape changed. Named in the packet so nobody counts it
as protection.

**⭐ THE PRESET WITNESS EXISTS AND IS THE RIGHT INSTRUMENT.** The draft invoked "the preset witness"
in §6, A4, §11 and §12 without ever naming a path (*"this lane did NOT measure them and names
none"*). Found:

```
tests/simulation/presetLightingWitness.test.js
tests/simulation/presetLightingWitnessRun.js
tests/fixtures/preset-lighting-witness-golden.json
tests/fixtures/.golden-freeze-register.json   ← enrolled as `preset-lighting-witness`
```

Its header, quoted:

> *"⚠ THIS IS A BYTE GOLDEN OVER THE WHOLE PULSE. It moves when the pulse moves, not only when a
> preset moves … the row diff names which fields moved. A move with no stated cause is the finding."*
> *"Each row records the rules a birth actually resolves and the hashes of one year (52 interior
> one-week ticks) of world pulse over a fixed two-settlement realm."*
> *"⛔ HOW A ROW LAWFULLY MOVES: BY HAND, with a stated legitimate cause recorded under the estate's
> golden-shift discipline (docs/GOLDEN_SHIFT_LEDGER.md) … THIS SURFACE HAS NO CAPTURE ARM AND NO ENV
> SPELLING, AND THAT IS DELIBERATE."*

⇒ It hashes 52 ticks of world pulse, so it **does** cover the calamity path, and it **has no capture
arm** — a move cannot be quietly re-recorded. That is exactly the instrument A4 needs, and the
packet's key-order premise (*"the preset witness hashes serialized pulse records"*) is
**CONFIRMED, not merely asserted.** Its shape: one `describe`, seven `it`, including
`'PLANT: the row comparator is live — a doctored digest does not compare equal'`.

The calamity path's own suites, resolved so §10 names no unmeasured path:

```
$ grep -rln "calamityKernel" tests/
tests/domain/calamity.kernel.integration.test.js   tests/domain/calamity.test.js
tests/domain/ruinFilter.probe.test.js              tests/domain/institutionStatusModel.test.js
tests/domain/highWater.test.js                     tests/domain/magicBufferIntegration.test.js
tests/domain/politicsEventsReligionG1c.test.js     tests/domain/subsystemRowsPlace.test.js
tests/domain/undercityConnectivity.test.js         tests/domain/undercityMonotoneComponents.test.js
tests/domain/undercitySewerDerivation.test.js      tests/ui/uiA11yWave5.test.jsx
```

⚠ **`tests/domain/ruinFilter.probe.test.js:27` holds a hand-written SECOND copy of the ruin stamp**,
which its own comment calls *"the exact calamityKernel.ruin stamp"*:

```js
27	const ruin = (inst) => ({ ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true });
```

It is in `tests/`, so A7's `src/`-scoped scan is unaffected and this is **not** a second production
writer. But it is a replica that will drift from the real writer. Raised as R7 (docket, not this
packet's — re-pointing it is a test-side change outside this behaviour family).

---

## §15 · Test precedent and the anchor walker — both verified

```
$ grep -n "describe(" tests/domain/institutionFounding.test.js | head -1
113:describe('MF-T2Q — the institution founding year', () => {
$ grep -c "it(" tests/domain/institutionFounding.test.js → 7
```
⇒ The named precedent is real and is exactly the shape the packet copies: **one literal `describe`,
seven straight-line `it`.**

```
$ grep -n "SCAN_ROOTS" tests/lint/negativeAssertionAnchor.walker.test.js
83:const SCAN_ROOTS = ['tests'];
87:const GENERATION_FACING_ROOTS = ['tests/generators','tests/joins','tests/simulation','tests/property'];
```
⇒ The CREATE target **is** in the anchor walker's scope (`tests/`), so A3's negatives must carry
`// anchored:` on the line immediately above. The walker is already in `checks`. Confirmed.

---

## §16 · ⭐ max-lines headroom — MEASURED NOW, so the §11 STOP is answered before dispatch

The draft deferred this to the build lane's step 1 and made it a STOP. Measured here instead.
The rule and the absence of an override:

```
$ <extract every max-lines rule from eslint.config.js>
  files: 'src/components/**/*.jsx' => max 600
  files: 'src/generators/**/*.js'  => max 800
  files: 'src/domain/**/*.js'      => max 800        ← THE APPLICABLE RULE (:710-712)
712	      'max-lines': ['error', { max: 800, skipBlankLines: true, skipComments: true }],

$ <look up calamityKernel in scripts/.size-baseline.json>
  entries matching calamityKernel: []   ← NO per-file override, so the layer ceiling binds
```

The count, computed with the estate's own `codeOnly` to identify all-comment lines:

```
src/domain/worldPulse/calamityKernel.js
  raw lines                     : 832
  EFFECTIVE (eslint max-lines)  : 453
  layer ceiling (src/domain/**) : 800   (no .size-baseline override)
  HEADROOM                      : 347 effective lines
  packet needs <=20             : PASSES — no STOP
CONTROL roadsKernel.js effective=838 vs its frozen baseline 838 (must be <= 838 and > 800)
```

⭐ **The control is the receipt for the method**: `roadsKernel.js` computes to **exactly 838**, the
number frozen in `scripts/.size-baseline.json` by eslint's own arithmetic. The counter reproduces
eslint's `{skipBlankLines, skipComments}` semantics exactly.

⇒ **347 effective lines of headroom against a ≤20-line packet.** The §3.1/§11 STOP is answered **NO**
by measurement, the "no new leaf is required" conclusion is CONFIRMED rather than inferred from
`wc -l`, and — by §11 — the walker trap on the leaf-extraction branch stays unreachable.
⚠ PLAUSIBLE only in that eslint itself was not executed (forbidden to this lane); the count and its
control are CONFIRMED.

---

## §17 · The sealed dispatch, read check by check

`scripts/implementation-session.mjs`, the preflight:

```
176	  const ancestry = spawnSync('git', ['merge-base','--is-ancestor', packet.verifiedBase, head] …
182	    throw new Error(`verified base is not an ancestor of HEAD: …`)
184	  if (head === packet.verifiedBase) return;
185	  const substrate = [...new Set([ …non-CREATE changeManifest paths…, …requiredSymbols paths… ])]
192	    '--literal-pathspecs','diff','--name-only','-z', `${packet.verifiedBase}..${head}`, '--', ...substrate
195	    throw new Error(`verified-base descendant changed declared substrate: …`)
199	      throw new Error(`capsule omitted declared substrate: …`)
208	    if (row.action === 'CREATE') {
210	        throw new Error(`CREATE target must be absent and Git-clean: …`)
213	      throw new Error(`non-CREATE target must be Git-clean: …`)
352	  if (snapshot.branch !== capsule.verifiedBranch) throw new Error(`dispatch branch mismatch: …`)
```

| # | check | verdict at this tip |
|---|---|---|
| 1 | `verifiedBase` is an ancestor of HEAD (`:176-182`) | **PASSES** — §1 |
| 2 | no declared substrate moved in `base..HEAD` (`:185-195`) | **PASSES** — §2's window is EMPTY. ⭐ Passes at `d31af2cee` *and* trivially at the tip (`:184` early-returns when base == HEAD) |
| 3 | capsule carries every substrate path (`:198-199`) | **PASSES** — the 5 substrate paths are the 1 MODIFY + 4 (now 5, §4) requiredSymbols paths, all declared |
| 4 | CREATE target absent and Git-clean (`:208-210`) | **PASSES** — §2: absent on disk and unknown to git |
| 5 | non-CREATE target Git-clean (`:213`) | **PASSES in a clean worktree** — the build lane's precondition, not a packet fact |
| 6 | branch matches `capsule.verifiedBranch` (`:352`) | ⚠ **THE BUILD LANE'S ACT** — the dispatch demands the worktree be ON the verified branch; the chair's standing arrangement is one build lane holding the integration branch while the chair's worktree stays detached |

⇒ **The packet would dispatch cleanly once the chair sets the base**, and — unusually — it would
dispatch at the OLD base too, because nothing it declares has moved in 40+ commits.

---

## §18 · Post-edit `requiredSymbols` simulation (the brief's step 10)

`requiredSymbols` is asserted VERBATIM at every status, **including after this packet's own edits**.
Row by row, against the packet's §7 coding instruction:

| # | path | symbol | does the packet touch this text? | post-edit verdict |
|---|---|---|---|---|
| 1 | `worldPulse/calamityKernel.js` | `export function strikeCapForTier` | **no** — `:196`, a different function; the edit is confined to `:250-253` and `:282`/`:286` | ✅ **PRESENT** |
| 2 | `worldPulse/calamityKernel.js` | `export function forceCalamityStrike` **(ADDED, §4)** | **no** — `:492` | ✅ **PRESENT** |
| 3 | `provenance/rosterProvenance.js` | `const INACTIVE_STATUSES` | file not in the change manifest | ✅ **PRESENT** |
| 4 | `worldPulse/causeLifecycle.js` | `worldPulseFate` | file not in the change manifest | ✅ **PRESENT** |
| 5 | `entities/status.js` | `EntityStatus` | file not in the change manifest; ⛔ the ruling forbids widening it | ✅ **PRESENT** |

**`retiredSymbols`: NONE OWED.** The packet deletes the module-private `const ruin`, but:
- `ruin` is **not** a `requiredSymbols` row of this packet (the compile lane correctly excluded it —
  a private arrow inside a function body cannot be a manifest symbol);
- §4's manifest-wide scan found **no other packet, at any status, holding a row on either of this
  packet's paths** except MF-T2R's `forceCalamityStrike`, which this edit preserves and which row 2
  now discharges explicitly.

⇒ **No retirement, nothing to discharge, and every row survives the packet's own build.** This is
the check that runs only against the pre-edit tree, so nothing else would have caught it.

---

## §19 · Budget re-measure

| Limit | Packet | Standard | basis |
|---|---:|---:|---|
| Behavior families | 1 | 1 | one writer |
| New logic-bearing leaves | **0** | ≤2 | §16: 347 lines of headroom ⇒ no new leaf |
| Existing logic files modified | **1** | ≤3 | `calamityKernel.js` |
| Handwritten files total | **2** | ≤12 | 1 MODIFY + 1 CREATE (no manifest row — §5) |
| New/changed effective production lines | **≈10, cap ≤20** | ≤400 | exported fn (~8 eff) + 2 validation lines − the 4-line arrow removed; both call sites modified in place |
| Delta in a shared/hot file | **0** | ≤15 | not hot, no `.size-baseline` entry (§16) |
| Acceptance cases | **7** | ≤8 | A1–A7 unchanged in count |

⇒ **Within budget on every row. No split is owed.** Nothing in this pre-proof grew the plan: the
work added was *measurement*, which removed two obligations (R3's edge-shared regeneration; the
build lane's max-lines discovery) and added one guard row (§11's walker STOP) at zero line cost.

---

## §20 · What this pre-proof CHANGED, old → new

| # | fact in the DRAFT | at the tip | proving command |
|---|---|---|---|
| 1 | *"Rides in train T3 beside EM-B1d"* | **FLOATS** (charter amendment 17:26 EDT, ODQ §934.47 add. 21) | §7 |
| 2 | Census absolute `2645/383/2262/25009/6670` | **removed**; frozen tuple is `2646/383/2263/25005/6671`; only the DELTA `+1/+0/+1/+7/+1` survives | §8 |
| 3 | R3: edge-shared closure *"RESOLVE AT PREFLIGHT"*, a §11 STOP | ⭐ **CLOSED — NOT OWED**, 0 of 405 inputs | §9 |
| 4 | Bundle budgets: **unpriced** (the draft predates the law) | ⭐ **lands in NO budgeted chunk**; +270 B into the uncapped `advanceInterval.worker` | §10 |
| 5 | max-lines: *"measure before the first edit"*, a §11 STOP | ⭐ **MEASURED: 453/800, headroom 347** ⇒ STOP unreachable | §16 |
| 6 | P2.2 mutation-coverage *"NOT OWED"* (cited from source lines) | **NOT OWED — EXECUTED**, with a positive control | §5 |
| 7 | `ruinFilterRoster` walker | ⭐ **never named; enrolled, and its only compliance token is the moved line** | §11 |
| 8 | A7: *"a source scan"* (no matcher) | ⭐ **refuted as written** (raw→4, codeOnly→0); exact comment-only matcher gives **1** | §12 |
| 9 | *"the preset witness"* (no path) | **named**: `tests/simulation/presetLightingWitness.test.js` + its golden; premise CONFIRMED | §14 |
| 10 | §10's calamity suites *"the implementer resolves each path at preflight"* | **resolved and named** | §14 |
| 11 | `requiredSymbols` = 4 rows | **5** — MF-T2R's landed `forceCalamityStrike` pin added | §4 |
| 12 | A1's oracle: no recipe | **recipe named** (`advanceCalamity` + the integration suite's driver) | §13 |
| 13 | `advanceWorkerByteIdentity` assumed protective | ⛔ **it is a relative pin and protects nothing here** | §14 |

**Nothing in the draft was found FALSE about the tree itself.** Every §5 verified fact survived
re-measurement unchanged, at the same line numbers. The changes above are (a) two premises that were
*unmeasured* and are now measured, (b) one arm (A7) whose matcher was unspecified and whose obvious
implementation would have been vacuous, (c) one walker the draft never knew about, and (d) the
train/register facts that moved under the packet while it waited.

---

# APPENDED 2026-09-19 ~17:5x EDT — brief steps 11 and 12 (added mid-lane after EM-B1d's build STOP)

## §21 · STEP 11 — the edge-shared rebuild is **NOT OWED**, proved TWO independent ways

**The law is real, and I verified its shape before asking whether it applies.** The generator:

```
$ node -e "<package.json scripts matching edge-shared>"
   build:edge-shared => node scripts/build-edge-shared.mjs

$ grep -n "writeFileSync|generatedAt|OUT_DIR" scripts/build-edge-shared.mjs
31	const OUT_DIR = join(ROOT, 'supabase', 'functions', '_shared');
59	  const OUT_FILE  = join(OUT_DIR, out);
60	  const META_FILE = join(OUT_DIR, meta);
82	  writeFileSync(META_FILE, JSON.stringify({
83	    generatedAt: new Date().toISOString(),      ← EVERY entry, EVERY run
102	  writeFileSync(OUT_FILE, finalSrc);
```

⇒ one run writes a freshly-stamped meta for **all five** entries plus each moved bundle. **Method: I
read the generator (not ran it — npm scripts are forbidden to this lane), and corroborated with
precedent landings:**

```
$ git log --stat --oneline -- supabase/functions/_shared | head -40
ddcfb1f59 Register (edge bundles): … their inputs moved …; three siblings byte-identical,
          five metas re-stamped in one build window
 aiCharterBundle.js | aiCharterBundle.meta.json | aiGroundingBundle.meta.json
 aiOutputSchemaBundle.js | aiOutputSchemaBundle.meta.json
 analyticsEventsBundle.meta.json | intentAtlasBundle.meta.json
 7 files changed
ee8ac6c3c … 7 files changed        58b466afc … 7 files changed
```

⇒ **The seven-path shape is CONFIRMED from precedent** (2 bundles + their 2 metas + 3 siblings'
re-stamped metas). Exactly the trap that STOPPED EM-B1d.

**Does it apply to EM-B1e? NO — and the metas alone are not good enough evidence, because they are
generated artifacts that could be stale. So: two methods.**

*Method A — the metas' own `inputs` lists (§9):* 0 hits across all five, 405 inputs total.

*Method B — an independent graph walk from each of the five ENTRIES, ignoring the metas entirely,
following BOTH static and dynamic edges (which is what esbuild bundles):*

```
aiGrounding      walked=  76  meta.inputs=  74  MY MODIFY PATH IN IT: false   (read-only paths: 0)
analyticsEvents  walked=   2  meta.inputs=   2  MY MODIFY PATH IN IT: false   (read-only paths: 0)
aiCharter        walked= 125  meta.inputs= 114  MY MODIFY PATH IN IT: false   (read-only paths: 1)
intentAtlas      walked=   2  meta.inputs=   2  MY MODIFY PATH IN IT: false   (read-only paths: 0)
aiOutputSchema   walked= 126  meta.inputs= 115  MY MODIFY PATH IN IT: false   (read-only paths: 1)
```

The walk returns **more** modules than the metas record (76 vs 74, 125 vs 114, 126 vs 115) because it
does not tree-shake. That makes it a strict **superset**, so a `false` here is *stronger* than a
`false` from the metas: `calamityKernel.js` is unreachable even by an over-inclusive walk.

⇒ ⭐⭐ **THE EDGE-SHARED REBUILD IS NOT OWED. This packet's change manifest declares no
`supabase/functions/_shared/**` path, and its `checks` run no generator that writes one.** The
`node scripts/check-observed-shape-readers.mjs` and `check-writer-reach.mjs` entries in `checks` are
**readers**, not writers (verified: the packet declares the writer-reach comparison as a *recorded
verdict*, never a `--write`), so no other declared command writes an undeclared path either.

⇒ ⭐ **DISJOINTNESS WITH EM-B1d v5 SURVIVES ITS RE-CUT.** The coordinator's conditional — *"if
EM-B1e owes the edge-shared rebuild, the seven `_shared` paths are SHARED"* — **resolves in the
negative.** Checked against every path EM-B1d v5 will add:

| EM-B1d v5's added paths | EM-B1e declares it? |
|---|---|
| the three sibling metas + `aiCharter`/`aiOutputSchema` bundles & metas (7 `_shared` paths) | ⛔ **no** — not owed (above) |
| `tests/generators/densityLaw.test.js` | ⛔ no |
| `tests/domain/espionageMission.test.js` | ⛔ no |
| a new exported vocabulary in `src/domain/entities/npcs.js` **or `src/domain/entities/status.js`** or a new `src/domain/entities/` leaf | ⚠ **see below** |

⚠ **ONE WATCH ITEM, and it is a `requiredSymbols` collision rather than a file collision.**
`src/domain/entities/status.js` is **row 5 of this packet's `requiredSymbols`** (symbol
`EntityStatus`). If EM-B1d v5 homes its new vocabulary **in that file**, EM-B1d MODIFIES a file this
packet only READS. That is not a change-manifest collision, but it is a **substrate** path for this
packet's sealed dispatch (`implementation-session.mjs:185-195` unions `requiredSymbols` paths into
the substrate) — so **any EM-B1d landing that touches `status.js` invalidates EM-B1e's verified base
and forces the chair to re-stamp it.** Since EM-B1e's base is `__BASE__` and stamped at promotion
anyway, the cure is simply **ORDER: EM-B1d lands first, EM-B1e is placed after**, exactly as the
coordinator states. Recorded as **R8**. ⓘ Note the symbol `EntityStatus` itself is safe under either
outcome — ODQ §934.47 addendum 6 forbids widening it, and EM-B1d's own A1 asserts it UNCHANGED at
its five.

---

## §22 · STEP 12 — the `tests/` sweep: **no declared TEST path is owed**

Swept for every symbol this packet changes and every literal it adds or retires — by the LITERAL,
not by a field name, exactly as the step requires (helper default arguments hide fixtures from a
`status:` grep).

| what | swept for | result |
|---|---|---|
| literal **ADDED** | `ruined_by_decree` | ⇒ **ABSENT from `src/` and `tests/` entirely.** A genuinely new value; no fixture, no pin, no allowlist to cure |
| symbol **ADDED** | `ruinInstitution` | ⇒ **absent from `src/` and `tests/`.** Its only occurrence anywhere is EM-B1d's packet *prose* (`EM-B1d.md:151`) naming this packet's future writer. **No collision** |
| literal whose **call-site spelling changes** | `destroyed_by_disaster` | ⇒ **exactly ONE occurrence in the whole repo** — `calamityKernel.js:252`, the arrow itself. **No test fixtures it, no test pins it.** Re-pointing the call sites to pass it explicitly moves no test |
| symbol **RETIRED** | the private `const ruin` | ⇒ module-private inside a non-exported function (`applyStrikeToRoster`, §13) — **importable by nothing**, so no test can pin it |
| **exact pin** on a constant this packet touches (the `densityLaw` class) | `INACTIVE_STATUSES` | ⇒ **no test references it in either direction.** Only `src/` hits (`rosterProvenance.js:81` + two *homonym* sets in `stressors.js:569` / `stressorGates.js:47` holding `resolved/dormant/residual`). Nothing to cure |
| an **export-surface** pin on the MODIFY target | `import * as` / `Object.keys(...calamityKernel)` | ⇒ **none.** Adding a 9th export breaks no pin |

⇒ ⭐ **NO TEST PATH JOINS THE CHANGE MANIFEST.** The CREATE stays the only test row.

⚠ **A DRIFT CLASS FOUND, NOT A BLOCKER.** `grep -rn "status: 'ruined'" tests/` returns **28
fixture sites across ~18 files** (`defenseStateProseDesk` ×3, `magicSubstitution` ×2, `treasury` ×2,
`generalStateProseDesk` ×3, `institutionStatusModel`, `brokerage*` ×3, `undercitySewerDerivation` ×2,
`npcVerdictTable` ×2, `calamity`, `magicForms`, `customSupplyChainActivation`,
`institutionStatusLifecycle`, and `ruinFilter.probe.test.js:27`). Every one **hand-builds** the
shape; none imports the writer. So **none of them moves when the writer is re-homed** — which is why
no TEST row is owed — but they are 28 replicas of a shape that is about to acquire a single
canonical writer, and `magicForms.test.js:307` already spells all three flag keys. This is the
strongest argument yet for **R7** (docket routing fixtures through the writer; it is a test-side
change in a different behaviour family, not this packet's). It also independently justifies A7's
scan being **`src/`-scoped**: test fixtures legitimately hand-build.

---

## §23 · STEP 12's second half — ⭐ THE CONSEQUENCE OF THE SET I ROUTE THROUGH

*"A set's name is a claim about its meaning; its consumers are the meaning."* The value
`ruined_by_decree` enters `worldPulseFate`, whose consumers are `rosterProvenance.js:258` (free text)
and `causeLifecycle.js:139` (truthiness). Read the truthiness one's **consequence**, not just its
shape — `causeLifecycle.js:131-141`:

```js
131	// A criminal institution is "destroyed" (its arrangement can no longer be
132	// sustained) when the world pulse has retired it: an explicit fate stamp, moral
133	// abolition, inactive flag, or a non-standing status.
135	const NONSTANDING_STATUS = new Set(['removed','destroyed','remnant','ruined','defunct','closed','disbanded','abolished']);
137	function institutionDestroyed(inst) {
138	  if (!inst) return false;
139	  if (inst._worldPulseInactive === true || inst._worldPulseMorallyAbolished === true) return true;
140	  if (inst.worldPulseFate) return true;                 ← the truthiness read
141	  return NONSTANDING_STATUS.has(norm(inst.status));
```

**The consequence is real: a truthy `worldPulseFate` marks a criminal institution DESTROYED — its
arrangement can no longer be sustained, and an NPC leashed to it loses that leash.**

⭐ **But for THIS packet it is inert BY CONSTRUCTION, and that is provable rather than hoped.**
`ruinInstitution` always writes all five keys together, so any record carrying `ruined_by_decree`
*also* carries `_worldPulseInactive: true` **and** `status: 'ruined'`. `institutionDestroyed`
therefore returns `true` at the **first** check (line 139's `_worldPulseInactive`), and again at line
141 (`'ruined'` ∈ `NONSTANDING_STATUS`), **before and after** the fate read is ever the deciding
branch. ⇒ **Three independently-sufficient signals; the new fate value never decides anything.**

This is a materially stronger claim than the draft's A6 (*"the readers branch on no value"*), so
**A6 is rewritten to assert the SUFFICIENCY ORDERING**: a decree-ruined record is destroyed by
`_worldPulseInactive` alone, proved by driving `institutionDestroyed` with the fate key *deleted* and
getting the same verdict. That converts "adding a value is free" from an argument into an executed
assertion — and it is the precise arm EM-B1d's packet lacked.

⛔ **AND THE GENUINE DESIGN CONSEQUENCE, RAISED NOT ADJUDICATED (R9).** The criminal-cause lifecycle
treats a ruined institution as **permanently destroyed**. A DISASTER is irreversible by THE PROMISE,
so that is correct today. A **DM DECREE is a different thing** — edit mode's decrees are authored
acts, and if a decree-ruin is ever undoable, undo must also restore the criminal leashes this
severs. That is **EM-B1a's** problem (it owns the op and its undo), not this writer's, but it is
exactly the class the coordinator named — *a reversible act joined to an irreversible consequence* —
and it must not be discovered at EM-B1a's build. **Raised for the chair to docket onto EM-B1a.**
