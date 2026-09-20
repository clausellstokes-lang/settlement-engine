# FIX-D4 — the orphan `"Thieves' Guild"` affiliation, measured

**Lane:** Opus RECON (measure-first, read-only). **Tip:** `32602dc607b7423838249cf57d73baf08feb047d`
(`$SP/read-tip-32602dc60`, detached; `git status --short` EMPTY at start and at end — both printed).
**Nothing was cured, no gate was run, nothing outside `$SP/lane-fix-d4-scratch/` was written.**

## ⭐ THE HEADLINE, IN ONE PARAGRAPH

The 318 orphan `"Thieves' Guild"` affiliations are real and reproduce exactly. But **the field they
live in is DARK on every reader surface** — no component, no PDF slice, no prose desk and no search
box reads `secondaryAffiliation`. What a DM actually sees is a **different** string the same defect
produced: the NPC's **secret sentence**, *"On the payroll of the thieves' guild as a silent
informant"*, printed on the NPC card and in the PDF, in **159 towns that have no thieves' guild**.
The repair for exactly that already exists in the generator — `npcGenerator.js:1354-1368` — and it is
**100 % dark across all 525 golden rows**, because its regex `/thieves guild/gi` cannot match
`thieves' guild` (the apostrophe). Its eligible population is **159 NPCs**: byte-for-byte the orphan
population. **The bug is not the fallback. The bug is a guard that was written, shipped, and never
once fired.** Curing the invisible field moves 159 golden rows and fixes nothing a DM can see;
curing the dark regex fixes the visible falsehood.

---

## 1. THE MEASUREMENT — all 525 golden rows

### 1.1 The harness, and why its numbers ARE golden numbers

`$SP/lane-fix-d4-scratch/run.mjs` drives the corpus in the golden master's **own call shape**, copied
from `tests/property/generatorGoldenMaster.test.js:797-798`:

```js
const { _seed, ...cfg } = config;
const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
```

**⭐ THE CONTROL (CONFIRMED).** Every sha this harness computes is checked against the committed
`tests/fixtures/generator-golden-master.json`:

```
$ CURE_MODE=base node run.mjs
MODE=base rows=525 seconds=8.8
GOLDEN-MANIFEST CONTROL: matches=525 mismatches=0 keyNotInManifest=0 manifestKeys=525
```

525 of 525 hashes are byte-identical to the committed manifest. **A cure arm's hash diff therefore
IS golden movement, not a harness artefact.**

> ⚠ The corpus helper is `tests/helpers/goldenMasterCorpus.js` (`goldenCorpus()`, `keyOf()`). The
> FIX-D1 lane's cache (`lane-fix-d1-scratch/corpus-525.json`) was generated at a **different tip**
> (`read-tip-e5bdfd031`; its `instrument.mjs:19` pins that TREE) and was **not** reused.
> `git diff --stat e5bdfd031 32602dc60 -- src tests/helpers` = `src/domain/prose/holderTable.js | 6 +++---`
> only, so FIX-D1's figures do carry — but every figure below was re-measured at 32602dc60.

### 1.2 The population, and the reconciliation of 318 vs 976

```
$ CURE_MODE=base node run.mjs
npcHome LIT=488  memberHome LIT=488  total=976
npcHome LIT-ORPHAN=159  memberHome LIT-ORPHAN=159  total=318
rows with any LIT=327  rows with LIT-ORPHAN=159
'criminal network' npcHome=72 memberHome=72
ANY secondaryAffiliation npcHome=914 memberHome=914
resolution of every secondaryAffiliation value (both homes): {"ORPHAN":462,"EXACT":1366}
```

**The two figures count different populations, and both are right:**

| figure | what it counts | value |
|---|---|---|
| **976** (EM-R6 §FACTION PIN, FIX-D1) | **every** `"Thieves' Guild"` handle, both homes — 488 `npcs[]` + 488 `factions[].members[]` | 976 on **327** rows |
| — of which **658** | the handle where a live `"Thieves' Guild"` faction **exists** (329 per home). Written by the `crimeFaction.faction` arm. **Correct data.** Matches EM-R6's own `658 faction-only` disjointness arm | 658 on 168 rows |
| **318** (FIX-D1 item 3, this lane) | the handle where **no** such faction and **no** thieves' house exists (159 per home) — the `"Thieves' Guild"` **literal** arm | **318 on 159 rows** |

`658 + 318 = 976` ✓ · `329 + 159 = 488` ✓ · `168 + 159 = 327` ✓.
**EM-R6's figure of 88 does not reproduce at this tip** (FIX-D1 already flagged this; re-confirmed here).

**Every orphan row carries EXACTLY ONE orphan NPC** — `orphan NPCs per row: [1]`, 159 rows.

### 1.3 The whole field, so the orphan is seen in proportion

1,828 `secondaryAffiliation` values exist across the corpus (914 per home, over 5,171 NPCs and
4,884 member records). **Nine distinct strings**:

```
   976  "Thieves' Guild"          ← npcGenerator free vocabulary (658 true, 318 ORPHAN)
   280  "Thieves' guild chapter"  ← corruptionPass, the roster's own spelling
   174  "Street gang"             ← corruptionPass
   144  "criminal network"        ← npcGenerator free vocabulary — names nothing, BY DESIGN
   120  "Smuggling network"       ← corruptionPass
    56  "Black market"            ← corruptionPass
    48  "Front businesses"        ← corruptionPass
    26  "Smuggling operation"     ← corruptionPass
     4  "Rookery"                 ← corruptionPass
```

`ORPHAN: 462` = **318** (`"Thieves' Guild"`) + **144** (`'criminal network'`). The other 1,366
resolve EXACT against a live faction or roster house. **`corruptionPass.js:74` never produces an
orphan** — it is gated on `climate.hasCriminalInst` (`corruptionPass.js:55`) and writes the roster's
own name. **Every orphan in the corpus is `npcGenerator.js`'s.**

> ⛔ **A resolver bug I made and fixed, recorded so the figure is trustable.** My first pass reported
> `ORPHAN: 0`, because the loose-match set contained **empty strings** (`s.factions[]` keys its display
> name `.name`, not `.faction`, so `f?.faction || ''` yielded `''`) and `l.includes('')` is always
> true. Every value matched a blank name. Fixed by `.filter(Boolean)` on both name lists
> (`run.mjs`); the corrected run is the one quoted above. **The two faction homes spell the display
> name differently — `powerStructure.factions[].faction` vs `s.factions[].name` — which is itself a
> trap for any future census (noticed item N-6).**

### 1.4 The orphan rows, split by what the town actually holds

```
ORPHAN ROWS=159  of which the town DOES hold a criminal house=99  holds none at all=60
criminal houses available on orphan rows: {"Smuggling operation":97,"Front businesses":97,"Street gang":84,"Gambling den":15}
orphan rows by tier: {"village":60,"town":99}
```

**The split is exactly along the tier line:** all **99 towns** hold real criminal houses (a street
gang, a smuggling operation, front businesses) — they simply hold no *thieves' guild* and no
criminal-category **faction**. All **60 villages** hold no criminal infrastructure whatsoever.
This is what decides cure (b)'s reach (§4.2).

> ⚠ **A definition the chair must rule on.** The brief says "no faction of that name and no thieves'
> house". Under the *stricter* reading — "no criminal institution **at all**" — the true orphan count
> is **60 rows / 120 handles**, and the other 99 rows / 198 handles are "the town has an underworld,
> just not this one". **Question Q1.**

---

## 2. WHAT A DM SEES

### 2.1 `secondaryAffiliation` is DARK on every reader surface — CONFIRMED

```
$ git grep -n "secondaryAffiliation" -- src
src/domain/display/publicSafe.js:124        ← allowlist constant
src/domain/display/publicSafe.js:223        ← the public projection literal
src/domain/factionRename.js:180             ← the rename cascade
src/domain/settlement.schema.js:469         ← a typedef
src/domain/worldPulse/causeLifecycle.js:70,149,151   ← resolves a corruption leash
src/domain/worldPulse/npcVerdictApply.js:105         ← clears it on a verdict
src/generators/npcGenerator.js:1334         ← WRITER 1
src/generators/steps/corruptionPass.js:74   ← WRITER 2
```

```
$ git grep -n "secondaryAffiliation" -- src/components src/pages src/ui src/domain/prose src/domain/pdf
(no output)
```

**Nine files. Not one renders it.** Every reader surface prints the *primary* handle instead:

| surface | file:line | what it prints | reads the secondary? |
|---|---|---|---|
| NPC card, sub-line | `src/components/new/npcComponents.jsx:333` | `` {npc.factionAffiliation ? ` · ${npc.factionAffiliation}` : ''} `` | **NO** |
| NPC search box | `src/components/new/npcComponents.jsx:84` | matches `name` · `role` · `factionAffiliation` only | **NO** |
| NPCs tab grouping | `src/components/new/tabs/NPCsTab.jsx:69` | `n.factionAffiliation \|\| 'Unaffiliated'` | **NO** |
| PDF NPC sheet + quick ref | `src/pdf/lib/viewModel.js:727` | `factionLabel: labelOfFactionRef(n?.factionAffiliation \|\| n?.faction \|\| n?.category)` | **NO** |
| Workbench connections index | `src/components/dossier/SettlementWorkbench.jsx:109` | candidate list is `factionAffiliation, faction, institutionName, …` | **NO** |
| Prose desks (all six) | — | zero hits under `src/domain/prose` | **NO** |

**Answers to the brief's question (2):** the orphan affiliation is **not visible**, **not clickable**,
**not searchable**, and **nothing is printed beside it** — because nothing is printed at all.

**Two non-render exposures it does have:**

1. **The public gallery payload.** `publicSafe.js:223` projects it into the anon JSON, and it is in
   the SQL `npc_allowed` array of migrations 033/099/123/128/130/142/189. **It ships over the wire
   to every anonymous reader of a shared dossier, un-rendered.** A reader of the network payload
   sees `"secondaryAffiliation": "Thieves' Guild"` for a town with no thieves' guild. Data-only.
2. **The simulation.** `causeLifecycle.js:151` resolves a corruption leash through it with a
   tolerant name match. For an orphan the match finds nothing and returns `null` — the safe path,
   measured by construction (orphan towns hold no thieves' house). No false sustainer is minted.

### 2.2 ⭐ WHAT THE DM ACTUALLY SEES — the secret sentence

The same defect writes a string that **is** printed. From the four rows FIX-D1 named
(`probe.mjs`, reading the dumped settlements):

```
═══ row 168 — Schwarzwalde (village) ═══
  powerStructure.factions: ["Elected Reeve","Merchant Guilds","Religious Authorities","Craft Guilds","Unknown Faction (hidden)","Military/Guard"]
  institutions (31): [… no criminal house of any kind …]
  npcs with "Thieves' Guild": 1 / 6
    → Cordula Müller | role="Caravan Master" | factionAffiliation="Merchant Guilds"
      secret.what   = "On the payroll of the thieves' guild as a silent informant"
      secret.stakes = "Exposure would cost them their post and likely their safety"
  LOOSE candidates for "Thieves' Guild": []
  safetyProfile.criminalInstitutions: []

═══ row 252 — Schwarzwalde (town) ═══
    → Ilse Vogel | role="High Priest" | factionAffiliation="Religious Authorities"
      secret.what   = "On the payroll of the thieves' guild as a silent informant"
  safetyProfile.criminalInstitutions: ["Street Gang","Smuggling Operation","Front Businesses"]
```

**The exact copy a DM reads, and where:**

| surface | file:line | the copy |
|---|---|---|
| **NPC card, expanded** | `src/components/new/npcComponents.jsx:466` renders `secretText` = `npc.secret.what` | **"On the payroll of the thieves' guild as a silent informant"** |
| **PDF, chapter 09 Notable NPCs** | `src/pdf/lib/viewModel.js:688-691` builds `` `${n.secret.what}: ${n.secret.stakes}` ``; `src/pdf/sections/NotableNPCs.jsx:222` prints it | **"On the payroll of the thieves' guild as a silent informant: Exposure would cost them their post and likely their safety"** |
| public gallery | — | **not shown**: `toPublicSafe` strips `secret` |

```
$ CURE_MODE=base node run.mjs
SANITISER: eligible NPCs=159 actually scrubbed=0 secrets still naming "thieves' guild"=327
```

**327 NPC secrets across the corpus name the thieves' guild; on 159 of them the town has none.**
So the village reeve's Caravan Master is on the payroll of an organisation that does not exist,
and her card and the printed dossier both say so. **This is the reader-visible falsehood. The
affiliation field is its silent shadow.**

---

## 3. WHY THE FALLBACK FIRES — the generator branch, quoted

### 3.1 The branch (`src/generators/npcGenerator.js:1305-1339`, inside `mergeNPCLists`)

```js
    // Detect criminal affiliation from secret text
    if (npc.secret && typeof npc.secret === 'object') {
      const secretText = ((npc.secret.what || '') + ' ' + (npc.secret.stakes || '')).toLowerCase();
      const isCriminalSecret =
        secretText.includes('brib') || … || secretText.includes('thieves') || …;
      const notAlreadyCrime = assignedFaction && assignedFaction !== crimeFaction;
      const roleIsNotCrime = !roleLower.includes('fence') && … ;
      if (isCriminalSecret && notAlreadyCrime && roleIsNotCrime) {
        enriched.secondaryAffiliation = crimeFaction
          ? crimeFaction.faction
          : secretText.includes('thieves')
            ? "Thieves' Guild"          // ← npcGenerator.js:1337, the orphan
            : 'criminal network';
      }
    }
```

with, 600 lines earlier (`:937-947`):

```js
  const hasInst = kw => instNames.some(n => n.includes(kw));
  const crimeFaction = factions.find(
    f => f.category === 'criminal'
      || f.faction?.toLowerCase().includes('thieve') || … 'criminal' … 'smuggl' … 'underworld',
  );
```

### 3.2 The answer: **a mis-ordered derivation, plus a guard that is dark**

It is **not** a default and **not** a stale catalogue reference. It is **structure derived backwards
out of prose**, and the repair for it never fires. Four links:

1. **A static pool literal names a specific institution.** `src/data/npcData.js:798`:
   ```js
   { secret: "On the payroll of the thieves' guild as a silent informant",
     stakes: 'Exposure would cost them their post and likely their safety' },
   ```
   It is the only entry in `NPC_CRIMINAL_SECRETS.criminal` that names a named house; its siblings
   say "a fencing operation", "a protection scheme", "a front for moving contraband".

2. **That pool is reachable in a town with no underworld.** `src/generators/npc/factionLeaderSecret.js:63`
   weights the criminal bucket `(hasCriminal ? 1.4 : 0.8) * (1 + pri.criminal / 100)` — **0.8, not
   0** when the town has no criminal institution — and `:100-107` then picks from it **uniformly**,
   with no filter against the roster.

3. **The affiliation is then reverse-engineered from that prose.** `npcGenerator.js:1336-1337` reads
   the sentence back (`secretText.includes('thieves')`) and mints a **faction handle** for a faction
   `rulingStructure.js:671` only creates when `criminalPower > 5`. Prose was written first and
   structure inferred from it; the correct order is the reverse.

4. **⛔ THE REPAIR EXISTS AND IS 100 % DARK.** Twenty lines below, `npcGenerator.js:1354-1368`:
   ```js
    // Sanitise criminal guild references if no criminal infrastructure
    if (npc.secret && typeof npc.secret === 'object') {
      const secretText = (npc.secret.what || '') + ' ' + (npc.secret.stakes || '');
      const mentionsCriminalGuild =
        secretText.toLowerCase().includes('thieves') ||
        (secretText.toLowerCase().includes('guild') && secretText.toLowerCase().includes('criminal'));
      if (mentionsCriminalGuild && !hasInst('thieves') && !hasInst('criminal') && !crimeFaction) {
        enriched.secret = {
          what: (npc.secret.what || '')
            .replace(/thieves guild/gi, 'a powerful outside interest')
            .replace(/criminal guild/gi, 'a powerful outside interest'),
          stakes: npc.secret.stakes,
        };
      }
    }
   ```
   Its guard selects **exactly the orphan population** — `eligible NPCs=159`. Its replacement then
   does nothing:
   ```
   $ node -e "…"
   secret text   : "On the payroll of the thieves' guild as a silent informant"
   regex         : /thieves guild/gi
   does it match?: false
   replace result: "On the payroll of the thieves' guild as a silent informant"
   ```
   **`/thieves guild/gi` cannot match `thieves' guild`.** Measured over the corpus:
   `scrubbed secrets ('a powerful outside interest') = 0` — **zero of 525 rows, ever.**

   ⭐ **This is the finding.** Someone identified this exact bug, wrote the guard with the right
   predicate, and shipped a regex that has never matched a single string the generator produces.
   Its eligible set (159) and the orphan set (159) are the same set.

   ⚠ Its guard is also **too narrow in the other direction**: `!hasInst('thieves') && !hasInst('criminal')`
   misses `Street gang`, `Smuggling operation`, `Front businesses`, `Gambling den` — so on the 99
   town rows it would consider the town criminal-free when it is not. Fixing only the apostrophe
   would scrub 60 villages and leave 99 towns naming a guild they lack. **Noticed item N-1.**

---

## 4. THE PRICE OF EACH CURE — executed in memory, tree never edited

**The override technique** (`$SP/lane-fix-d4-scratch/loader.mjs`): a Node `module.register()` `load`
hook intercepts `src/generators/npcGenerator.js` and returns patched source. The read tree is never
written; `git status --short` is empty at start and end. Each arm re-runs all 525 rows and
re-compares against the committed golden manifest.

### 4.0 ⭐ THE TOTALITY PROOF — the only byte that moves

Each row also records a sha of `npcs` and of `factions` with **every `secondaryAffiliation` key
stripped**. If those are unchanged, nothing else in the settlement moved:

```
$ node -e "…rows-{base,cureA,cureB}.json…"
cureA: golden sha moved on 159 rows | npcs-minus-secondaryAffiliation moved on 0 rows | factions-minus-secondaryAffiliation moved on 0 rows
cureB: golden sha moved on 159 rows | npcs-minus-secondaryAffiliation moved on 0 rows | factions-minus-secondaryAffiliation moved on 0 rows
```

```
$ node analyze.mjs
═══ cureA ═══
  golden rows moved: 159 / 525
  moved set === orphan-row set? true  (orphanRows=159)
  TOP-LEVEL KEYS that moved, and on how many rows: {"factions":159,"npcs":159}
  rows moved OUTSIDE the orphan set: 0
═══ cureB ═══   (identical)

── row 168 base → cureA: 2 leaf paths differ ──
   shapes: {"npcs[].secondaryAffiliation":1,"factions[].members[].secondaryAffiliation":1}
     npcs[2].secondaryAffiliation            base → "Thieves' Guild"   cureA → "criminal network"
     factions[0].members[1].secondaryAffiliation  base → "Thieves' Guild"   cureA → "criminal network"
── row 252 base → cureB: 2 leaf paths differ ──
     npcs[3].secondaryAffiliation            base → "Thieves' Guild"   cureB → "Street gang"
     factions[0].members[6].secondaryAffiliation  base → "Thieves' Guild"   cureB → "Street gang"
```

**Exactly two leaves per row, 318 leaves, on exactly the 159 orphan rows, zero strays. No id, no
ordering, no derived figure, no prose byte moves.**

### 4.0b ⭐ THE PROSE MANIFEST DOES NOT MOVE — measured, not reasoned

`prose.mjs` runs `tests/helpers/dossierManifest.js` `driftRun` over **all 159 moved configs at both
audiences** (318 prose rows) under each override, against `tests/fixtures/dossier-prose-manifest-golden.json`:

```
=== prose base (all 159 moved rows) ===   ← the control
MODE=base prose rows=318 towns=159 seconds=4
vs COMMITTED prose manifest: match=318 MOVED=0 notInManifest=0
=== prose cureA (all 159 moved rows) ===
vs COMMITTED prose manifest: match=318 MOVED=0 notInManifest=0
=== prose cureB (all 159 moved rows) ===
vs COMMITTED prose manifest: match=318 MOVED=0 notInManifest=0
```

The base arm reproduces the committed prose manifest exactly (the control can see), and **neither
cure moves one of the 1,050 prose rows.** No prose desk reads the field.

### 4.1 CURE (a) — the guard: refuse the literal when nothing of that name exists

```js
        enriched.secondaryAffiliation = crimeFaction
          ? crimeFaction.faction
          : (secretText.includes('thieves') && (hasInst('thieves') || hasInst('criminal')))
            ? "Thieves' Guild"
            : 'criminal network';
```

```
MODE=cureA rows=525
npcHome LIT=329  memberHome LIT=329  total=658      (was 488/488/976)
npcHome LIT-ORPHAN=0  memberHome LIT-ORPHAN=0  total=0
'criminal network' npcHome=231 memberHome=231      (was 72/72)
resolution: {"ORPHAN":462,"EXACT":1366}            ← UNCHANGED
GOLDEN-MANIFEST CONTROL: matches=366 mismatches=159
```

| | |
|---|---|
| **keys that move** | `npcs[].secondaryAffiliation`, `factions[].members[].secondaryAffiliation` — **318 leaves, 2 per row** |
| **generator-golden rows re-recorded** | **159 of 525** |
| **prose-manifest rows re-recorded** | **0 of 1,050** (measured, §4.0b) |
| **owner's signed door** | ⛔ **REQUIRED** |
| **what it buys** | every orphan handle stops naming a nonexistent organisation |
| **what it does NOT buy** | ⚠ `ORPHAN` stays **462**: `'criminal network'` names nothing either. The cure trades a *specific falsehood* for a *generic descriptor* — honest, but still not a reference. **And it does not touch the visible secret sentence at all.** |

### 4.2 CURE (b) — resolve to a house the town actually has

Resolves through `safetyProfile.js:589-609`'s own `CRIMINAL_INST_LABELS` vocabulary, so the
affiliation names the same house the Defense tab prints:

```js
  const __fixd4LocalCrimeHouse = (nativeSemanticNames(institutions) || []).find(
    n => __FIXD4_CRIME_KEYS.includes(String(n).toLowerCase()),
  ) || null;
  …
        enriched.secondaryAffiliation = crimeFaction ? crimeFaction.faction
          : (secretText.includes('thieves') && __fixd4LocalCrimeHouse) ? __fixd4LocalCrimeHouse
            : 'criminal network';
```

```
MODE=cureB rows=525
npcHome LIT=329  memberHome LIT=329  total=658
npcHome LIT-ORPHAN=0  memberHome LIT-ORPHAN=0  total=0
'criminal network' npcHome=132 memberHome=132      (72 base + 60 villages)
resolution: {"ORPHAN":264,"EXACT":1564}            ← ⭐ 198 values become REAL REFERENCES
GOLDEN-MANIFEST CONTROL: matches=366 mismatches=159
```

| | |
|---|---|
| **keys that move** | the same two, **318 leaves, 2 per row** |
| **generator-golden rows re-recorded** | **159 of 525** — *the identical 159 rows as cure (a)* |
| **prose-manifest rows re-recorded** | **0 of 1,050** (measured) |
| **owner's signed door** | ⛔ **REQUIRED** |
| **reach** | **99 of 159 rows** (all towns) gain a real house — `Street gang`, `Smuggling operation`, `Front businesses`, `Gambling den`. **60 of 159** (all villages) have nothing to resolve to and fall to `'criminal network'` |
| **what it buys over (a)** | `ORPHAN` **462 → 264**, `EXACT` **1366 → 1564**: **198 handles stop dangling and start naming a house on the roster.** Same golden cost as (a). Strictly more repair for the identical price |

### 4.3 CURE (c) — leave the data, cure the display

| | |
|---|---|
| **keys that move** | **none** |
| **generator-golden rows re-recorded** | **0** |
| **prose-manifest rows re-recorded** | **0** |
| **owner's signed door** | not required |
| ⛔ **THE PROBLEM** | **There is no display to cure.** §2.1: no component, PDF slice, prose desk or search box reads `secondaryAffiliation`. A reader-side rule ("an affiliation naming no faction prints nothing / prints *unaffiliated*") would be **dead code on arrival** — a guard with no call site, on a field with no reader |
| **the one thing it could reach** | the public gallery payload (`publicSafe.js:223`), where the value ships un-rendered. Suppressing it there is a **public-surface shape change** with a **SQL twin** (`npc_allowed` in migrations 033→189) and is owner-gated for a different reason |

**CONFIRMED-by-construction:** cure (c) changes no generator byte, so 0 golden rows and 0 prose rows
move. That is real, and it is also the whole problem — it changes nothing a DM experiences.

### 4.4 ⭐ CURE (d) — NOT ON THE BRIEF'S LIST, AND IT IS THE ONE THAT MATTERS

Repair `npcGenerator.js:1354-1368` so the guard that already exists actually fires: widen the regex
past the apostrophe (`/thieves['’]? guild/gi`) **and** widen its criminal-infrastructure predicate
past `hasInst('thieves') || hasInst('criminal')` to `safetyProfile`'s vocabulary (§3.2 ⚠).

- **It is the only cure that changes what a DM reads** — the 159 visible secret sentences.
- **It moves goldens too** (`npcs[].secret.what` on up to 159 rows) and needs the same signed door.
- **I did not price it.** Pricing it means choosing the replacement copy, which is a **prose/voice
  decision the chair owns** (and "a powerful outside interest" is an em-dash-era string that may not
  survive the voice law). **Question Q2** — and it wants its own slot, not a line in FIX-D4.

### 4.5 The signed door, for the record

`tests/helpers/goldenRecordDoor.js` gates every golden capture: `SIGNATURE_ENV = 'GOLDEN_SHIFT_SIGNED'`
must name a **file** whose record carries non-blank `ownerWords`, `ownerDate` (`YYYY-MM-DD`),
`odqRow`, `cause`, `seat`; `re-record` is typed **`'owner'`** (`:50`). `GOLDEN_SHIFT_SIGNED=1`
authorises nothing (`:127-128`). **Cures (a), (b) and (d) each need the owner's signature on a
159-row shift record. Cure (c) needs none.**

---

## 5. THE LIFECYCLE TABLE — does a saved world re-derive it?

| path | re-derives? | evidence | consequence |
|---|---|---|---|
| **generate** | **YES** — written here | `npcGenerator.js:1334-1338` (writer 1); `corruptionPass.js:74` (writer 2, gated on `hasCriminalInst`, never orphans) | a generator cure takes effect immediately |
| **read / render** | **NO — no reader** | §2.1: nine files touch the key, none renders it | **a read-time cure has no site to live at** |
| **save → reload** | **NO** — stored verbatim | the settlement JSON persists whole | ⛔ **every already-saved world keeps its orphan for ever.** A generator cure is **not retroactive**; only a migration would reach them, and none is in scope |
| **regenerate** | **SPLIT** | `regenerationPreservation.js:196,243-284`: a preserved/locked NPC **takes over** a fresh slot and keeps its stored fields; unpreserved slots come from a fresh pipeline roll | fresh slots get the cure; **preserved characters keep the orphan** |
| **fork / import** | **NO** | copies stored values; no re-derivation | the orphan travels with the world |
| **faction rename** | **N/A, and correctly so** | `factionRename.js:168-181` cascades `secondaryAffiliation` at **both** `NPC_HOMES` | renaming a real `Thieves' Guild` moves its 658 live handles; the 318 orphans name nothing, so nothing cascades — **correct**, and a case-folding "cure" here would be a live bug (FIX-D1 C-e) |
| **world-pulse tick** | **cleared, never re-derived** | `npcVerdictApply.js:105` sets it to `''` on a verdict | a jailed/banished NPC loses it |
| **simulation read** | resolves to `null` | `causeLifecycle.js:146-158` tolerant match; orphan towns hold no thieves' house | no false sustainer is minted |
| **public gallery** | **exported** | `publicSafe.js:223` + `npc_allowed` in migrations 033/099/123/128/130/142/189 | the orphan string ships in the anon JSON, un-rendered |

**The conclusion the brief asked for:** there is **no read-time cure that survives reload/fork/import/regenerate**,
because **there is no read site**. The only lifecycle-complete repair is at the writer — and it is
not retroactive to saved worlds.

---

## 6. RECOMMENDATION

**Take cure (b), and slot cure (d) ahead of it as the one that changes what a DM reads.**

**Why (b) over (a):** identical price — the same 159 golden rows, the same two keys, the same 318
leaves, zero prose rows, one signed door — and strictly more repair: **198 handles become real
references** (`ORPHAN 462 → 264`) instead of being traded for a second generic string. Under the
positioning law (*"every fact agrees"*), (b) makes the record agree with the roster on 99 rows;
(a) only stops it from disagreeing.

**Why (d) is the real fix, and why (b) still earns its place:** the affiliation is invisible, so
(a) and (b) alone are **data hygiene that no player will ever perceive** — they cure the record the
simulation, the rename cascade and the gallery export all read, which is worth doing, but they leave
the village reeve's Caravan Master on the payroll of a guild that does not exist, on her card and in
the printed dossier. **(d) is where the DM-visible falsehood lives.** Both move goldens; if the
owner is signing a 159-row shift, **sign it once for (b) and (d) together** rather than twice.

**Do not take (c).** It would add a reader-side rule to a field with no reader — a guard with no
call site, which is exactly the shape of the dark sanitiser this lane just found.

⛔ **Not mine to decide:** (a), (b) and (d) all re-record the generator golden, which is owner-gated
(`goldenRecordDoor.js:50`, `re-record: 'owner'`). I have priced them; I have not chosen for the owner.

---

## 7. QUESTIONS ONLY THE CHAIR CAN ANSWER

1. **Which orphan definition governs?** 159 rows / 318 handles ("no faction of that name and no
   *thieves'* house") or 60 rows / 120 handles ("no criminal institution at all")? The other 99
   rows hold a street gang and a smuggling operation — an underworld, just not this one. The cure's
   shape and its golden cost are the same either way; the *ruling* differs.
2. **Is cure (d) in FIX-D4's scope, or its own slot?** It is where the DM-visible falsehood lives,
   it moves `npcs[].secret.what` on up to 159 rows, and it needs a replacement string — a voice
   decision (`"a powerful outside interest"` is em-dash-era copy; ODQ voice law). **Per the owner's
   no-deferred-work law this needs a slot, a decision point, or a closure THIS sitting.**
3. **One signed door or two?** (b) and (d) both re-record the same 159 rows. Bundling them into one
   owner signature is cheaper and truer to the shift record; splitting them keeps attribution clean.
4. **Is `'criminal network'` (144 handles, names nothing) intended colour or a second orphan?**
   My resolver counts it ORPHAN. If it is deliberate free vocabulary, say so in the ruling so the
   next census does not re-find it.
5. **Does the public gallery export of `secondaryAffiliation` (`publicSafe.js:223` + seven
   migrations' `npc_allowed`) want its own look?** It ships the orphan string to anonymous readers
   un-rendered. Narrowing the allowlist is a public-surface + SQL-twin change — owner-gated, and
   §934.55 says migrations are the owner's.
6. **Is the `"Thieves' Guild"` faction name itself the deeper problem?** `rulingStructure.js:671`
   mints a hard-coded English faction name in every culture. Row 300 is *Hongcheng* (a Chinese-culture
   town) whose NPC is on the payroll of the *thieves' guild*. The product is **SETTING-AGNOSTIC** by
   scope law. This is bigger than FIX-D4 and I did not measure it. **Noticed item N-5.**

---

## 8. ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

**N-1 — The dark sanitiser's SECOND defect: its criminal-infrastructure predicate is too narrow.**
`npcGenerator.js:1360` tests `!hasInst('thieves') && !hasInst('criminal')`, which misses `Street gang`,
`Smuggling operation`, `Front businesses`, `Gambling den` — the vocabulary `safetyProfile.js:589-609`
uses. Measured: **99 of the 159 orphan rows hold one of those.** Fixing only the apostrophe would
scrub 60 villages and leave 99 towns naming a guild they lack. **Slot: fold into cure (d); the two
defects must be fixed in one act or the fix is half-dark.**

**N-2 — `factionLeaderSecret.js:63` keeps the criminal secret pool reachable at weight 0.8 when the
town has no criminal institution.** `(hasCriminal ? 1.4 : 0.8)`. That is the upstream tap: a
criminal-free village still draws criminal secrets. Zeroing it is a **generation act** (golden-moving,
and it would change far more than 159 rows). **Slot: its own recon — "should a criminal-free town
draw criminal secrets at all?" — with a ruling before any code.**

**N-3 — `src/data/npcData.js:798` is the only entry in `NPC_CRIMINAL_SECRETS.criminal` that names a
specific institution.** Its seven siblings say "a fencing operation", "a protection scheme", "a front
for moving contraband" — institution-free by construction. **Slot: a one-line pool edit (rewrite 798
to match its siblings' grammar) would remove the root with a much smaller golden blast radius than
cure (d). Worth pricing before (d) is chosen.** I did not price it — it moves `secret.what` and is a
voice decision (Q2).

**N-4 — `rulingStructure.js:671` mints `"Thieves' Guild"` as a hard-coded English literal in every
culture.** Row 300 (`city|chinese|…`, *Hongcheng*) carries it. Against the SETTING-AGNOSTIC scope law.
**Slot: a naming/localisation recon, owner-gated (it is a public-facing vocabulary change and golden-moving).**

**N-5 — The two faction homes spell the display name differently.** `powerStructure.factions[].faction`
vs `s.factions[].name`. This cost me a false `ORPHAN: 0` (§1.3) and will cost the next census the same.
**Slot: a one-line comment in `settlement.schema.js` naming both spellings, or a ratchet pinning that
each home keeps its key.**

**N-6 — EM-R6 §6's `"Thieves' Guild"` sentence still names a catalogue institution that does not
exist, and still carries the figure 88.** Re-measured here at 32602dc60: **976 / 327 rows**, matching
FIX-D1 and refuting 88. FIX-D1 already raised this (its item 1). **Slot: the amendment to EM-R6 §6
before the chair rules R6′. Re-flagged because it is still open.**

**N-7 — `drawDisagrees=1426` over 159 towns × 2 audiences in the prose drift run**, identical in all
three arms and reproducing the committed manifest. Pre-existing and recorded, **not** caused by
anything here. **Slot: a coverage note, or confirmation that the recorded manifest deliberately
carries it.** Flagged because a future lane running `driftRun` will see it and re-find it.

**N-8 — `corruptionPass.js:74` writes `secondaryAffiliation` only when it is empty** (`if (!npc.secondaryAffiliation)`).
So `npcGenerator`'s orphan literal **wins** over the roster's real house name whenever both would
apply — writer order decides which name a corrupt NPC carries. It never produced an orphan in this
corpus (it is gated on `hasCriminalInst`), but the precedence is undeclared. **Slot: a one-line
comment declaring the intended writer precedence, or a ruling that the roster name should win.**

---

## 9. ARTEFACTS

All under `$SP/lane-fix-d4-scratch/` (absolute: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-fix-d4-scratch/`):

| file | what |
|---|---|
| `loader.mjs` | the override technique — the `module.register()` `load` hook; both cure patches, anchored to verbatim source (it **throws** if an anchor drifts) |
| `run.mjs` | the 525-row measurement + the golden-manifest control + the totality proof |
| `prose.mjs` | the composed-prose `driftRun` arm over the 159 moved rows, both audiences |
| `analyze.mjs` | moved-row/key/leaf-path diff |
| `probe.mjs` | the four named orphan rows, read from the dumps |
| `rows-{base,cureA,cureB}.json` | per-row records (sha, key hashes, tallies) |
| `dump-{base,cureA,cureB}-{168,252}.json`, `dump-base-{300,504}.json` | full settlements for path diffing |

**Reproduce:** `CURE_MODE={base,cureA,cureB} node run.mjs` (~9 s each, single process);
`SAMPLE=159 CURE_MODE=… node prose.mjs` (~4 s each); `node analyze.mjs`; `node probe.mjs`.

**Every figure in this report is CONFIRMED** (command + quoted output). The only PLAUSIBLE statements
are labelled as such in §4.3 (cure (c) moving zero rows is CONFIRMED-by-construction, since it changes
no generator byte) and §4.4 (cure (d)'s golden cost is stated as "up to 159 rows" — **unmeasured**,
because its replacement copy is undecided).
