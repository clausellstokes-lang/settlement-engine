# EM-R0a — EVIDENCE (Opus COMPILE lane, 2026-09-19, at `58fcfe614`)

Every fact in `EM-R0a.md` and `EM-R0a.manifest.json` is one of the rows below. **A fact without a
command is not verified.** Nothing was edited, staged or committed in any tree; no vitest, no
eslint, no npm script, no build. Plain `node` on scratch scripts only, one process at a time.

- `SP = /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
- `TREE = $SP/read-tip-58fcfe614` — the only tree read or imported from.
- scratch: `$SP/lane-em-compile-EM-R0a-scratch/` — scripts in `tools/`, raw outputs in `out-*.txt`.
- The recon prototype scripts were **copied** from `$SP/chair-kit-923472dc/tools/rederive-prototype-3/`
  into `tools/` and `instrument.mjs`'s `TREE` constant repointed from `read-tip-a41a0e109` to
  `read-tip-58fcfe614`; the kit's originals were not touched.

---

## E-1 · The tree, its HEAD, and a transient-dirt observation

```
$ git -C $SP/read-tip-58fcfe614 rev-parse --short HEAD
58fcfe614
$ git -C $SP/read-tip-58fcfe614 status --short
(no output)
$ date
Sat Sep 19 17:48:48 EDT 2026
```

```
$ git -C $TREE log --oneline -1
58fcfe614 PACKETS: EM-B1d placed and READY at 32f1ba048 (version 4, from an Opus pre-proof) — …
```

⚠ **A TRANSIENT-DIRT OBSERVATION, RECORDED BECAUSE IT WOULD BITE A BUILD LANE.** At 18:09 EDT a
cleanliness re-check printed **2**:

```
$ git -C $TREE status --porcelain | wc -l
       2
$ git -C $TREE rev-parse HEAD
58fcfe61458b784b0470b854caf916b7c2961edf
```

Three immediate re-checks found nothing, HEAD unchanged:

```
$ git -C $TREE status --porcelain
(no output)
$ git -C $TREE status --porcelain -uall | wc -l
       0
$ find $TREE -newermt '-40 minutes' -type f -not -path '*/node_modules/*' -not -path '*/.git/*'
(no output)
$ find $TREE/.git -maxdepth 1 -newermt '-40 minutes'
(no output)
```

⭐ **AND THE CAUSE IS NOW KNOWN, from a sibling recon lane's measurement relayed by the chair at
18:2x:** `tools/rederive-prototype-*/instrument.mjs` calls `process.chdir(TREE)` **at import**, so
any harness built on it that writes to a RELATIVE path writes **into the shared read worktree**.
The two transient lines were another lane's outputs landing in `$SP/read-tip-58fcfe614`.

**THIS LANE'S AUDIT AGAINST THAT HAZARD, executed 18:21 EDT:**

```
$ git -C $SP/read-tip-58fcfe614 status --short            # 0 lines
$ git -C $SP/read-tip-58fcfe614 status --porcelain -uall  # 0 lines
$ git -C $SP/read-tip-58fcfe614 rev-parse HEAD
58fcfe61458b784b0470b854caf916b7c2961edf
$ find $SP/read-tip-58fcfe614 -newermt '-90 minutes' \( -type f -o -type d \) \
       -not -path '*/node_modules/*' -not -path '*/.git/*'
(no output)
$ grep -ln "writeFileSync|createWriteStream|appendFileSync|mkdirSync|renameSync|unlinkSync" tools/r0a-*.mjs
(none of this lane's scripts writes a file from node)
$ grep -ln "writeFileSync|createWriteStream|appendFileSync" tools/*.mjs
tools/emit-tier1.mjs · tools/m2-which-steps-draw.mjs · tools/m4-m5.mjs · tools/m6-fields-and-recordpin.mjs
   — four KIT scripts copied into scratch and NEVER RUN by this lane
```

CONFIRMED: **no file of this lane's landed in the read tree, and nothing had to be moved.** Every
one of this lane's own scripts writes nothing from node; every output went through SHELL redirection
(`> ../out-*.txt`) resolved against the shell's own cwd, and all nineteen `out-*.txt` files are in
`$SP/lane-em-compile-EM-R0a-scratch/` with their run timestamps. The four copied kit scripts that do
write from node were never executed. HEAD never moved and no measurement is affected.

⚠ Named in the packet's out-of-scope observations anyway, because a sealed dispatch's `git-clean`
arm run from a shared read tree would fail intermittently, for a reason that leaves no trace once
the writing lane's next run overwrites or removes its file.

## E-2 · The EM preamble's SHA-256

```
$ cd $TREE && shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6  docs/implementation/preambles/EM-PREAMBLE.md
```

CONFIRMED: identical to the hash the dispatch brief states. The packet's header leaves the line as
the chair's stamp and quotes this measurement beside it.

## E-3 · The 41 top-level keys of a generated record (63-row structured sample)

```
$ cd tools && node --import ./hook3.mjs r0a-census.mjs      # full output: out-r0a-census.txt
=== R0a.1 — corpus ===
rows=63  generated=63  generateMs=1282  walkMs=184  msPerRow=20.3
tiers: thorp=7 hamlet=7 village=7 town=28 city=7 metropolis=7

=== R0a.2 — TOP-LEVEL KEYS (41) ===
key                           rows  shapes                    emptyArrayRows
_config                       63    object{n}
_seed                         63    string
activeConditions              63    array[n]                  9
aiOverlays                    63    array[n]                  63
arrivalScene                  63    string
availableServices             63    object{n}
coherenceNotes                63    array[n]                  63
config                        63    object{n}
conflicts                     63    array[n]                  35
culturalIdentity              63    object{n}
culturalNotes                 63    string
defenseProfile                63    object{n}
economicState                 63    object{n}
economicViability             63    object{n}
factions                      63    array[n]
generationCoherenceReceipt    63    object{n}
generatorVersion              63    string
history                       63    object{n}
id                            63    string
institutions                  63    array[n]
isolationSupport              63    object{n}
name                          63    string
neighborRelationship          63    null
npcs                          63    array[n]
population                    63    number
powerStructure                63    object{n}
pressureSentence              63    string
prominentRelationship         63    object{n}
relationships                 63    array[n]
resourceAnalysis              63    object{n}
schemaVersion                 63    number
settlementReason              63    array[n]
simulationTrace               63    array[n]
simulationVersion             63    number
spatialLayout                 63    object{n}
stress                        63    object{n}|null
stressors                     63    object{n}|null
structuralSuggestions         63    array[n]                  57
structuralViolations          63    array[n]                  56
tier                          63    string
userCanon                     63    object{n}
```

CONFIRMED: **41 keys, present in 63 of 63 rows each.** ⚠ `stress` and `stressors` are `object` OR
`null`; `neighborRelationship` is `null` in every row. The class assignment in the packet's Table 1
follows design §22.2 item 7 over exactly this key set.

## E-4 · The walker's stride cost, through the REAL generator entry

`generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })` — the call
`tests/property/generatorGoldenMaster.test.js:798` makes.

```
$ node --import ./hook3.mjs r0a-cost.mjs                    # full output: out-r0a-cost.txt
golden corpus rows = 525
sample63 rows = 63

=== walker strides, through generateSettlementPipeline ===
  every 21st of 525          rows=25    wall=597    ms  23.9 ms/row  distinctTopKeys=41
  the 63-row sample          rows=63    wall=1256   ms  19.9 ms/row  distinctTopKeys=41
  the full 525-row corpus    rows=525   wall=7820   ms  14.9 ms/row  distinctTopKeys=41

full/63 ratio = 6.2×
top-level keys: 63-row=41  525-row=41  equal=true
keys the 63-row sample MISSES: NONE
```

CONFIRMED: the 63-row stride costs **1,256 ms** and reaches every top-level key the full corpus
reaches. The full corpus costs **7,820 ms** and buys no additional key.

## E-5 · The collection denominator

From the same run (`out-r0a-census.txt`):

```
=== R0a.3 — ARRAY-OF-OBJECT COLLECTIONS (63 distinct collapsed paths) ===
…
=== R0a.4 — SUMMARY of the object collections ===
declared key HOLDS (present + unique in EVERY observed array): 50
declared key BREAKS: 1
   ⛔ resourceAnalysis.gaps (chain): 29/60
NO declared key, but a unique candidate exists: 11
NO declared key and NO unique candidate (ATOMIC by measurement): 1
   • simulationTrace[].downstreamEffects
```

CONFIRMED: **63 collapsed array-of-object paths; 51 carry a declared key in the recon prototype's
`KEY_REGISTRY`; 50 hold; 1 breaks; 12 have no declared key.**

⭐ **RECONCILIATION WITH THE RECON'S "41", ARITHMETIC AND EXACT.** `51 − 9 − 1 = 41`. The nine
subtracted are the declared collections that sit inside a HELD key and are therefore never reached
by the merge (`institutions`, `npcs`, `factions`, `factions[].members`, `powerStructure.factions`,
`powerStructure.factionRelationships`, `powerStructure.conflicts`, `conflicts`, `relationships`);
the one is `resourceAnalysis.gaps`, whose key breaks. The recon's figure is the merge-exercised
subset; the register's denominator is 63.

## E-6 · The RECEIPT exception — the digest scan

```
$ node --import ./hook3.mjs q1-keys.mjs                     # full output: out-q1-keys.txt
=== Q1.c — digest-looking leaves (name matches fingerprint|hash|checksum|receipt|signature, or a long hex value) ===
economicState.compound.inst.hasHospital                  tiers=6 e.g. false
economicState.safetyProfile.compound.inst.hasHospital    tiers=6 e.g. false
id                                                       tiers=6 e.g. s_f31e9b37e51d7959
powerStructure.economyInputFingerprint                   tiers=6 e.g. power-economy-v1:f2a5ac71
```

CONFIRMED: of four hits, `id` is CONSTANT, the two `hasHospital` booleans are name-matches not
digests, and **`powerStructure.economyInputFingerprint` is the only digest of other record fields** —
the register's single RECEIPT row.

## E-7 · The strict sibling detectors (what they did NOT find, and why that matters)

```
$ node --import ./hook3.mjs r0a-groups.mjs                  # full output: out-r0a-groups.txt
=== R0a-G.B — numeric field = a SIBLING array's length, on every observation ===
  economicState.foodSecurity  activeChainsCount === activeChains.length   obs=63  distinctValues=6

=== R0a-G.C — a NUMBER SPELLED IN PROSE = a sibling array's length, on every observation ===
  none
```

CONFIRMED: the sibling-only form finds ONE relation. `economicViability.metrics.dependencyCount`
does NOT appear here — because it is not a sibling of `dependencies` (the count lives one level down
in `metrics`). That absence is the measurement behind the packet's ruling that the
`viability-counts` group must be a MEMBER LIST. The prose arm finds nothing at total strictness
because of the one pre-existing generator defect (E-16), which is why E-9's near-total arm exists.

## E-8 · LABEL ⇒ FLAG relations, per-flag (the sound form)

```
$ node --import ./hook3.mjs r0a-groups2.mjs                 # full output: out-r0a-groups2.txt
=== A2 — PER-FLAG label⇒flag ===
  economicState  label=tier  obs=63  labels=6  flags=[isEntrepot]  nameMatched=[—]
      "city" TRUE beside: [isEntrepot×1]  "hamlet" TRUE beside: [none] NEVER: [isEntrepot]
      "metropolis" TRUE beside: [isEntrepot×1]  "thorp" NEVER: [isEntrepot]
      "town" TRUE beside: [isEntrepot×3]  "village" NEVER: [isEntrepot]
  economicState.foodSecurity  label=label  obs=63  labels=5
      flags=[isDeficit,isPressured,isSecure,isSurplus,hasFamine,hasSiege]
      nameMatched=[isDeficit,isPressured,isSecure]
      "Deficit — Active Famine"  TRUE: [isDeficit×3 hasFamine×3]  NEVER: [isPressured isSecure isSurplus hasSiege]
      "Deficit"                  TRUE: [isDeficit×2]              NEVER: [isPressured isSecure isSurplus hasFamine hasSiege]
      "Import-Dependent"         TRUE: [isDeficit×22 isPressured×1] NEVER: [isSecure isSurplus hasFamine hasSiege]
      "Pressured"                TRUE: [isPressured×18]           NEVER: [isDeficit isSecure isSurplus hasFamine hasSiege]
      "Secure"                   TRUE: [isSecure×17]              NEVER: [isDeficit isPressured isSurplus hasFamine hasSiege]
  powerStructure.publicLegitimacy  label=label  obs=63  labels=5
      nameMatched=[isEndorsed,isApproved,isTolerated,isContested,isLegitimacyCrisis]
      "Approved" TRUE: [isApproved×33] · "Contested" TRUE: [isContested×4]
      "Endorsed" TRUE: [isEndorsed×2 isApproved×2] · "Legitimacy Crisis" TRUE: [isLegitimacyCrisis×3]
      "Tolerated" TRUE: [isTolerated×21]
```

CONFIRMED, three findings:
1. **`economicState.foodSecurity`'s label⇒vector is NOT functional** (`Import-Dependent` carries two
   vectors, 22 and 1), so the whole-vector form is unsound and the PER-FLAG "never true beside this
   label" form is the one that convicts — exactly as the recon's instrument says. `Secure` is never
   beside `isDeficit`/`isPressured`; `Import-Dependent` is never beside `isSecure`. **That is the
   merge's own conviction, and it is why G1 is the whole object.**
2. **`powerStructure.publicLegitimacy`** carries the same shape — inside a HELD key, so it is
   recorded for EM-R0b and is not a group.
3. ⛔ **`economicState.tier ⇒ isEntrepot` is REJECTED BY ITS OWN CONTROL.** The strict detector
   reported it as functional over 63 records; it is a capacity correlation (five true observations,
   all at town or larger), not a band of the tier. Recorded as rejected rather than dropped.

## E-9 · The UNCLE arm — the relation that forces a member list

```
$ node --import ./hook3.mjs r0a-groups2.mjs                 # out-r0a-groups2.txt
=== B2 — the UNCLE arm: a numeric leaf equal to an array in its PARENT object ===
  economicViability.metrics.dependencyCount === <parent>.dependencies.length   obs=63 ok=63 distinctValues=10  (TOTAL)
  economicViability.metrics.warningCount    === <parent>.warnings.length       obs=63 ok=63 distinctValues=2   (TOTAL)
```

CONFIRMED: both relations hold on 63 of 63 records with 10 and 2 distinct values (non-vacuous), and
neither is expressible as a sibling relation. `economicState.foodSecurity.activeChainsCount ===
activeChains.length` (63/63, 6 distinct values) is the sibling counterpart inside G1 (E-7).

## E-10 · TABLE 2 and TABLE 3 — the 50 KEYED and 13 ATOMIC rows, with their evidence

```
$ node --import ./hook3.mjs r0a-emit.mjs                    # full output: out-r0a-emit.txt
=== TABLE 2 — KEYED collections (50) ===
path                                                key                     arrays  multi  entries maxLen  class
activeConditions                                    archetype               54      0      54      1      READING
availableServices.criminal                          name                    42      39     168     8      READING
availableServices.employment                        name                    53      44     303     12     READING
availableServices.entertainment                     name                    42      38     211     12     READING
availableServices.equipment                         name                    57      55     1128    35     READING
availableServices.food                              name                    63      54     244     9      READING
availableServices.healing                           name                    63      57     346     11     READING
availableServices.information                       name                    49      27     122     8      READING
availableServices.legal                             name                    63      48     703     24     READING
availableServices.lodging                           name                    63      49     196     6      READING
availableServices.magic                             name                    41      24     110     9      READING
availableServices.transport                         name                    44      40     139     6      READING
conflicts                                           parties+issue           28      6      34      2      HELD
defenseProfile.institutions.charter                 name                    17      0      17      1      READING
defenseProfile.institutions.garrison                name                    22      14     43      3      READING
defenseProfile.institutions.magicDef                name                    39      11     50      2      READING
defenseProfile.institutions.mercenary               name                    7       0      7       1      READING
defenseProfile.institutions.militia                 name                    1       0      1       1      READING
defenseProfile.institutions.walls                   name                    36      9      45      2      READING
defenseProfile.institutions.watch                   name                    42      0      42      1      READING
economicState.activeChains                          label                   59      57     945     29     READING
economicState.incomeSources                         source                  63      61     485     12     READING
economicState.institutionalServices                 label                   40      39     184     9      READING
economicState.safetyProfile.crimeTypes              type                    45      35     80      2      READING
economicState.tradeDependencies                     institution+resource    48      42     368     19     READING
economicViability.dependencies                      title                   54      45     234     9      READING
economicViability.plotHooks                         category                63      54     141     4      READING
economicViability.warnings                          title                   37      0      37      1      READING
factions                                            name                    63      39     149     5      HELD
factions[].members                                  id                      149     89     572     18     HELD
generationCoherenceReceipt.checks                   id                      63      63     1071    17     HISTORY
generationCoherenceReceipt.judgments                id                      63      63     441     7      HISTORY
generationCoherenceReceipt.repairs                  type+subject+action     20      10     32      3      HISTORY
history.currentTensions                             type                    63      38     103     3      READING
history.eventsTimeline                              name                    63      60     365     11     READING
history.historicalEvents                            name                    63      60     365     11     READING
history.legacyAnnotations                           eventName+yearsAgo      63      53     156     3      READING
institutions                                        name                    63      63     2428    59     HELD
npcs                                                id                      63      63     611     21     HELD
powerStructure.conflicts                            parties+issue           28      6      34      2      HELD
powerStructure.factionRelationships                 pair                    62      56     328     8      HELD
powerStructure.factions                             faction                 63      63     408     9      HELD
relationships                                       npc1Id+npc2Id+type      63      63     1265    50     HELD
resourceAnalysis.exploitation.fullyExploited        chainKey                36      13     52      3      READING
resourceAnalysis.exploitation.partiallyExploited    chainKey                31      8      41      3      READING
resourceAnalysis.exploitation.unexploited           chainKey                31      15     57      4      READING
resourceAnalysis.exports                            chain                   49      27     93      4      READING
resourceAnalysis.resourceChains                     chainKey                57      40     150     5      READING
resourceAnalysis.resourceConditions                 key                     63      62     341     8      READING
spatialLayout.quarters                              name                    58      54     230     8      READING

=== TABLE 3 — ATOMIC collections (13) ===
activeConditions[].causes                           arrays=54     entries=54     maxLen=1    READING  no declared key
config._isolationSupport.paths                      arrays=7      entries=18     maxLen=3    WORLD    no declared key
economicViability.issues                            arrays=9      entries=15     maxLen=3    READING  no declared key
economicViability.suggestions                       arrays=12     entries=18     maxLen=2    READING  no declared key
generationCoherenceReceipt.authoredTensions         arrays=4      entries=4      maxLen=1    HISTORY  no declared key
generationCoherenceReceipt.judgments[].evidence     arrays=441    entries=699    maxLen=6    HISTORY  no declared key
isolationSupport.paths                              arrays=7      entries=18     maxLen=3    READING  no declared key
resourceAnalysis.gaps                               arrays=60     entries=469    maxLen=15   READING  declared key "chain" BREAKS in 29/60 arrays
simulationTrace                                     arrays=63     entries=4810   maxLen=124  READING  no declared key
simulationTrace[].causes                            arrays=4810   entries=8719   maxLen=5    READING  no declared key
simulationTrace[].downstreamEffects                 arrays=3532   entries=5147   maxLen=3    READING  no declared key
structuralSuggestions                               arrays=6      entries=6      maxLen=1    READING  no declared key
structuralViolations                                arrays=7      entries=9      maxLen=2    READING  no declared key

KEYED + ATOMIC = 63
vacuous-uniqueness rows (maxLen === 1, so uniqueness proves nothing):
   activeConditions (arrays=54)
   defenseProfile.institutions.charter (arrays=17)
   defenseProfile.institutions.mercenary (arrays=7)
   defenseProfile.institutions.militia (arrays=1)
   defenseProfile.institutions.watch (arrays=42)
   economicViability.warnings (arrays=37)
   activeConditions[].causes (arrays=54)
   generationCoherenceReceipt.authoredTensions (arrays=4)
   structuralSuggestions (arrays=6)
```

CONFIRMED: the register's Table 2 and Table 3 are these rows verbatim. The nine vacuity rows are the
`KEY_UNPROVEN_AT_LENGTH_ONE` set arm A4 pins.

⚠ Note the recon's §2.3 list of keyless collections and this ATOMIC table agree exactly, with ONE
addition: `config._isolationSupport.paths`, which the recon did not list because `config` is WORLD
and never merged. The register declares it anyway so the walker's totality is over the whole record.

## E-11 · The 32-trial merge — the MIXED census and the invariant convictions, at this tip

```
$ node --import ./hook3.mjs q3-merge-edits.mjs edited        # full output: out-q3-edited.txt
======== Q5 — MIXED objects (a record leaf the re-derivation disagrees with, beside an R1 leaf) ========
distinct mixed object paths across the 32 trials: 63

======== Q5 — NEW invariant violations, attributed ========
   village     #5 change power share     merge=[] edit=["V-POWER-100: faction power shares sum to 89, not 100"]
   village     #7 terrain → desert       merge=["V-SUMMARY-HOOKS: summary says 3 plot hooks but plotHooks.length=2"] edit=[]
   town        #5 change power share     merge=[] edit=["V-POWER-100: faction power shares sum to 92, not 100"]
   city        #5 change power share     merge=[] edit=["V-POWER-100: faction power shares sum to 94, not 100"]
   city        #7 terrain → desert       merge=["FLAGVEC economicState.foodSecurity.label=\"Import-Dependent\"
                                                but isSecure=true, which no record with that label carries
                                                (2 observed vector(s))"] edit=[]
   metropolis  #5 change power share     merge=[] edit=["V-POWER-100: faction power shares sum to 94, not 100"]
```

CONFIRMED: **the 32 trials reproduce the recon's figures exactly at `58fcfe614`** — 63 distinct mixed
object paths, and the same six invariant rows with the same sums (89 / 92 / 94 / 94) and the same two
merge convictions. The recon measured these at `a41a0e109`; the build branch has moved and they have
not.

```
$ node --import ./hook3.mjs r0a-mixed.mjs edited            # full output: out-r0a-mixed.txt
======== EM-R0a — the MIXED census, COLLAPSED (9 distinct object SHAPES) ========
   simulationTrace[].causes                           rawPaths=31   trials=22
   simulationTrace                                    rawPaths=1    trials=11
   simulationTrace[].downstreamEffects                rawPaths=25   trials=11
   generationCoherenceReceipt                         rawPaths=1    trials=9
   availableServices                                  rawPaths=1    trials=5   [village#3 village#4 city#3 city#7 metropolis#3]
   economicState                                      rawPaths=1    trials=4   [village#5 village#8 city#3 metropolis#3]
   economicState.foodSecurity                         rawPaths=1    trials=3   [village#7 city#7 metropolis#7]
   economicViability                                  rawPaths=1    trials=1   [village#7]
   economicViability.metrics.foodBalance              rawPaths=1    trials=1   [village#7]
   ⭐ collapsed shapes OUTSIDE the trace and the receipt: 5 — availableServices · economicState ·
      economicState.foodSecurity · economicViability · economicViability.metrics.foodBalance
```

⭐ **THE SMALLEST MEASURED CORRECTION IN THIS PACKET.** Design §22.2 item 2 and the launch brief say
"nine object paths **outside** the trace and the receipt". Measured: the 63 raw paths collapse to
**nine object SHAPES IN ALL**, of which three are the trace and one is the receipt, leaving **FIVE**
outside them. The recon's own §6 printout names exactly those five; its prose sentence is a
mis-transcription of its own table. The operative ruling — seed the group register from the MIXED
census — is untouched.

## E-12 · The MIXED objects' ACTUAL leaves — what decides a group from a co-location

```
$ node --import ./hook3.mjs r0a-mixed.mjs edited            # out-r0a-mixed.txt
======== EM-R0a — MIXED objects OUTSIDE the trace/receipt, leaf by leaf ========
  village#7 terrain → desert     OBJ=economicState.foodSecurity
      settled(1): economicState.foodSecurity.surplusPct
      taken  (13): …label | …color | …bg | …foodRatio | …deficitPct | …dailyProduction
  city#7 terrain → desert        OBJ=economicState.foodSecurity
      settled(1): economicState.foodSecurity.isSecure
      taken  (14): …label | …color | …bg | …foodRatio | …deficitPct | …dailyProduction
  metropolis#7 terrain → desert  OBJ=economicState.foodSecurity
      settled(1): economicState.foodSecurity.isSecure
      taken  (14): …label | …color | …bg | …foodRatio | …deficitPct | …dailyProduction

  village#7 terrain → desert     OBJ=economicViability.metrics.foodBalance
      settled(2): …foodBalance.surplus | …foodBalance.importChannel
      taken  (6): …dailyProduction | …deficit | …deficitPercent | …agricultureModifier | …importCoverage | …rawDeficit

  village#7 terrain → desert     OBJ=economicViability
      settled(1): economicViability.plotHooks[~add ["Survival Crisis"]]
      taken  (8): dependencies[+["Food Import Requirement"]] | dependencies[+["Imports Bulk grain…"]]
                  | dependencies[-["Imports timber"]] | plotHooks[+["Trade Politics"]] | …

  village#5 change power share   OBJ=economicState
      settled(1): economicState.foodSecurity
      taken  (1): economicState.primaryImports[2]
  village#8 culture → norse      OBJ=economicState
      settled(1): economicState.foodSecurity
      taken  (1): economicState.primaryImports[2]
  city#3 add institution         OBJ=economicState
      settled(1): economicState.foodSecurity
      taken  (2): economicState.incomeSources[+["Banking Fees"]] | economicState.tradeDependencies[+["Banking houses","Precious metals"]]
  metropolis#3 add institution   OBJ=economicState
      settled(1): economicState.foodSecurity
      taken  (1): economicState.tradeDependencies[+["Daily markets","Trade access + grain"]]

  village#3 add institution      OBJ=availableServices
      settled(6): availableServices.equipment | …healing | …transport[~add ["Pack animal hire"]]
                  | …transport[~del ["Stabling"]] | …legal | …employment
      taken  (1): availableServices.transport[+["River crossing"]]
  city#3 add institution         OBJ=availableServices
      settled(11): …food | …equipment | …magic | …healing | …legal[~add ["General trade"]] | …legal[~del ["Appeals court"]]
      taken  (2): availableServices.legal[+["Commercial loans"]] | …legal[+["Deposit accounts"]]
  (village#4, city#7, metropolis#3 the same shape)
```

CONFIRMED, and this is the measurement the group register rests on:

- `economicState.foodSecurity` — a FLAG kept stale beside a LABEL taken fresh, on three tiers. **A
  GROUP**, whole.
- `economicViability.metrics.foodBalance` — `surplus` kept stale beside `deficit`/`deficitPercent`
  taken fresh. **A GROUP**, whole.
- `economicViability` — a plot hook both re-derivations produce, correctly kept out, beside
  dependency entries taken fresh; the `summary` then names a count the list no longer has. **A
  GROUP**, as the member list `{summary, dependencies, warnings, plotHooks, metrics.dependencyCount,
  metrics.warningCount}`.
- `economicState` — the settled child is ALWAYS the whole `economicState.foodSecurity` subtree,
  correctly kept, beside an unrelated import or income entry. **NOT A GROUP**: declaring it one
  would move the food card when a bank is added, which is the failure design §22.2 item 2 names by
  that exact example.
- `availableServices` — the mixing is across the ELEVEN independent service lists. **NOT A GROUP**:
  nothing relates them. The real invariant there is referential and belongs to EM-R0b/EM-R6.

## E-13 · The trap keys

```
$ node --import ./hook3.mjs r0a-groups.mjs                  # out-r0a-groups.txt
=== R0a-G.F — the three trap keys ===
  activeConditions: entries=54  distinct id=2  distinct archetype=2
     id sample      : condition.regional_criminal_pressure.nwpp7h | condition.famine.rcw7xs
     archetype      : regional_criminal_pressure | famine
     ids of the form condition.<archetype>.<minted suffix>: 54/54
     ids whose middle segment IS the archetype: 54/54
     ⚠ max activeConditions.length over the corpus = 1 — uniqueness is VACUOUS at length 1
  generationCoherenceReceipt.repairs: entries=32  id === "repair.<index+1>" in 32/32
     id sample: repair.1 | repair.1 | repair.1 | repair.1 | repair.1 | repair.2
```

CONFIRMED: `activeConditions[].id` carries a minted suffix in 54/54 and its middle segment is the
archetype in 54/54, so `archetype` is the stable key — **and the corpus can never test either
candidate's uniqueness, because the array is never longer than one entry**. `repairs[].id` is
POSITIONAL in 32/32, and the row is moot under HISTORY.

## E-14 · `relationships` and `conflicts` — per-field uniqueness

```
$ node --import ./hook3.mjs r0a-groups.mjs / r0a-groups2.mjs
  relationships: arrays=63; per-field uniqueness —
     description      unique in 63/63 arrays
     tension          unique in  7/63 arrays
     type             unique in  0/63 arrays
  conflicts: arrays=28/63  lengths=1,1,1,1,2,2,1,1,1,1,1,2,2,1,1,2,…
     parties    unique in 28/28 arrays (of the 6 with >1 entry: 6)
     issue      unique in 28/28 arrays (of the 6 with >1 entry: 6)
     stakes     unique in 28/28 (6)   desc  28/28 (6)   plotHooks 28/28 (6)
     intensity  unique in 25/28 arrays (of the 6 with >1 entry: 3)
```

CONFIRMED: `relationships` has **no structural single-field key** — only the prose `description`,
which is an accidental key, is unique across all 63 arrays. `conflicts`' apparent keys rest on **six
multi-entry arrays out of 63 records**. Both are declared UNMERGEABLE with their composites recorded.

## E-15 · The MIRROR, measured field by field

```
$ node --import ./hook3.mjs r0a-groups.mjs                  # out-r0a-groups.txt
=== R0a-G.E — THE MIRROR: factions[].members[] measured against npcs[] by id ===
  members=572  resolved to an NPC by id=572 (100.0%)
  field                       bothPresent  equalToTheNPC
   id / name / gender / role / title / category / personality / physical / goal / secret /
   plotHooks / influence / power / presentation / factionAffiliation     572   572  (100.0%)  ⇐ MIRROR
   corrupt                       474          474      (100.0%)  ⇐ MIRROR
   structuralPosition / activeConstraint / settlementCondition / structuralRank
                                 215          215      (100.0%)  ⇐ MIRROR
   secondaryAffiliation          118          118      (100.0%)  ⇐ MIRROR
   corruptionVector / corruptTies 46           46      (100.0%)  ⇐ MIRROR
   institution                    44           44      (100.0%)  ⇐ MIRROR
   factionGoal                     7            7      (100.0%)  ⇐ MIRROR
  fields only the MEMBER has: none
  fields only the NPC has:    none

$ node --import ./hook3.mjs r0a-groups2.mjs                 # out-r0a-groups2.txt
=== F3 ===
  pairs=572; fields present on the NPC but ABSENT from its member chip: NONE
```

CONFIRMED, and stronger than the recon's statement: the member chip is not a projection of selected
NPC fields — it is a **complete field-for-field copy**, on all 25 fields it carries, in 572 of 572
pairs, with no NPC field dropped in any pair. The mirror recompute EM-R0c owes is therefore exactly
"replace `members[]` by the merged `npcs[]` entries the member ids name, in the member list's order",
and no field list has to be maintained anywhere.

## E-16 · The viability summary's prose counts (FIX-G1), and `stress` ≡ `stressors`

```
$ node --import ./hook3.mjs r0a-summary.mjs                 # full output: out-r0a-summary.txt
summary "N operational dependencies": observed=51 agree=50
   ⛔ town|germanic|mountain|mountain_pass|civilized|golden-master-v3: says 6 vs 5
summary "N plot hooks available"   : observed=51 agree=51

  stress === stressors in 63/63 records; stress null in 9
```

CONFIRMED twice:
1. ⛔ **FIX-G1 reproduced independently at this tip** — one plain generated record, no edit, no
   merge, whose viability summary says six operational dependencies beside a list of five. 1 of 51.
   The charter already carries it as a parallel lane; named here, not investigated.
2. ⭐ **`stress` and `stressors` are byte-identical top-level keys in 63 of 63 records**, both `null`
   in the same 9. Not in the recon. Declared as a cross-key identity for EM-R0b.

## E-17 · The import graph — the placement proof

```
$ cd $TREE && ls -d src/domain/edit
ls: src/domain/edit: No such file or directory

$ git grep -n "domain/edit" -- src tests scripts vite.config.js
tests/lib/editTravel.test.js:15: * `src/domain/edit/**`. THE VEIL PRECEDES THE WRITER: `EM-B2a` (the layer's
tests/store/decreeRegistryPersistence.test.js:17: * `src/domain/edit/**` (which does not exist at this commit — importing it would

$ for f in src/domain/edit/recordRegister.js tests/lint/recordRegisterTotality.walker.test.js; do
    printf "%-62s %s\n" "$f" "$([ -e "$f" ] && echo PRESENT || echo ABSENT)"; done
src/domain/edit/recordRegister.js                              ABSENT
tests/lint/recordRegisterTotality.walker.test.js               ABSENT

$ grep -n "WORKER_BUNDLE_CEILING_BYTES" tests/build/generationWorkerLazy.test.js
159:export const WORKER_BUNDLE_CEILING_BYTES = 1401208;

$ grep -n "computeEngineSharedDomain\|ENGINE_SHARED_DOMAIN\|EAGER_FIRST_PAINT_MODULES" vite.config.js
31:function computeEngineSharedDomain() {
70:const ENGINE_SHARED_DOMAIN = computeEngineSharedDomain();
309:export const EAGER_FIRST_PAINT_MODULES = EAGER_MODULES;

$ git grep -n "export const SURFACE_ROOTS" -A 9 scripts/lib/writer-reach-scan.mjs
93:export const SURFACE_ROOTS = Object.freeze({
94-  web: Object.freeze(['src/main.jsx']),
95-  'dossier-pdf': Object.freeze(['src/pdf/SettlementPDF.jsx', 'src/utils/generateSettlementPDF.js',
96-                                'src/utils/pdfRender.worker.js']),
98-  'campaign-pdf': …  99-  'world-book': …  100-  foundry: …  101-  'json-export': …
```

CONFIRMED: **the directory does not exist; both CREATE targets are ABSENT; the only two references
to `src/domain/edit` in the whole tree are comments in two test files and there is no production
reference.** A module with no importer is emitted in no chunk, so the worker (`1401208`, zero
slack), the first-paint set (seeded by `computeEngineSharedDomain()` from what `src/generators`
imports), the lazy engine and data-lazy all take **0 B** — and the writer-reach scan's seven
`SURFACE_ROOTS` cannot reach it.

## E-18 · The register's effective-line count

```
$ node --import ./hook3.mjs r0a-emit.mjs                    # out-r0a-emit.txt
=== TABLE 4 — the module draft ===
total lines (code only, no JSDoc): 126   EFFECTIVE (non-blank, non-comment): 126
  RECORD_CLASSES rows       = 41 + 2 future (dmLayer, decrees)
  KEYED_COLLECTIONS rows    = 50
  ATOMIC_COLLECTIONS rows   = 13
  CONSISTENCY_GROUPS rows   = 7
  budget: 250 per leaf · 400 per packet  ⇒ headroom per leaf = 124
```

CONFIRMED: the emitted body measures **126 effective lines** (blank and comment lines excluded — the
eslint `max-lines` `{ skipBlankLines: true, skipComments: true }` reading). The packet bounds it at
**≤ 170** against the standard's 250-per-leaf cap. **No split into sibling leaves is needed**, and
the launch brief's contingency is not exercised.

## E-19 · The manifest census, and the change-path reservation

```
$ cd $TREE && python3 -c "…"   # reading docs/implementation/PACKET_MANIFEST.json
rows naming src/domain/edit or the register: []
total packets: 188
statuses: {'LANDED': 185, 'SUPERSEDED': 2, 'READY': 1}
EM ids: ['EM-B1d', 'EM-B3', 'EM-B3a', 'EM-B3b', 'EM-P0', 'EM-P3']

EM-B1d READY
    MODIFY src/domain/entities/npcs.js
    MODIFY src/domain/density/factionLifecycle.js
    MODIFY src/domain/entities/successors.js
    MODIFY src/domain/worldPulse/envoyCasting.js
    MODIFY src/domain/worldPulse/magicFormsPractitioner.js
    CREATE tests/lint/statusUnionTotality.walker.test.js
    REGISTER scripts/mutation-coverage-manifest.json
    MODIFY supabase/functions/_shared/aiCharterBundle.js
    MODIFY supabase/functions/_shared/aiCharterBundle.meta.json
    MODIFY supabase/functions/_shared/aiOutputSchemaBundle.js
    MODIFY supabase/functions/_shared/aiOutputSchemaBundle.meta.json

$ grep -n "reservesChangePaths" scripts/implementation-packets.mjs
676:    const reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(String(status));
694:      if (reservesChangePaths) {
$ sed -n '43p' scripts/implementation-packets.mjs
const TERMINAL_PACKET_STATUSES = new Set(['LANDED', 'SUPERSEDED']);
$ sed -n '694,703p' scripts/implementation-packets.mjs
      if (reservesChangePaths) {
        const priorOwner = changePathOwners.get(row.path);
        if (priorOwner && priorOwner !== changeOwnerKey) {
          addError(errors, `duplicate change path across packets: ${row.path} …`);
        } else changePathOwners.set(row.path, changeOwnerKey);
      }
```

CONFIRMED, and it is a promotion-blocking sequencing fact:
- **No packet of the 188 names any path of EM-R0a.**
- **A DRAFT reserves change paths** — `TERMINAL` is only LANDED and SUPERSEDED.
- **EM-B1d (READY) already names `scripts/mutation-coverage-manifest.json`.** EM-R0a's entry may not
  enter `PACKET_MANIFEST.json` at any status until EM-B1d is LANDED, or `validate:packets` errors
  `duplicate change path across packets`.

## E-20 · The sealed dispatch dry read, and the change-table arm

```
$ grep -n "parsePacketHeader\|Verified base" scripts/implementation-packets.mjs | head
294:export function parsePacketHeader(markdown) {
302:    /^\s*(?:-\s*)?\*\*Verified base:\*\*([^\n]*)$/gmi,
876:      const header = parsePacketHeader(readRepositoryFile(rootDir, packetPath));
951:  const packetHeader = parsePacketHeader(packetText);

$ grep -n "Exact change manifest\|parseChangeTable\|changeTable\|markdownChange" scripts/implementation-packets.mjs
(no output)
$ git grep -ln "Exact change manifest" -- tests scripts
(no output)
```

⚠ **CONFIRMED: the Markdown-vs-JSON change-table validator arm the dispatch message describes does
NOT exist at `58fcfe614`.** `scripts/implementation-packets.mjs` reads the packet Markdown only
through `parsePacketHeader` (status, version, verified base) and never parses §7's table. The
equality below was therefore computed by this lane's own re-implementation of the STATED contract.

```
$ node tools/r0a-table-equality.mjs "$TREE" EM-R0a.md EM-R0a.manifest.json ; echo exit=$?
PACKET_ACTIONS (read from the tree) = ["CREATE","DOC","MODIFY","REGISTER","TEST"]

§7 Markdown rows (3):
   CREATE    src/domain/edit/recordRegister.js
   CREATE    tests/lint/recordRegisterTotality.walker.test.js
   REGISTER  scripts/mutation-coverage-manifest.json

JSON changeManifest rows (3):
   CREATE    src/domain/edit/recordRegister.js
   CREATE    tests/lint/recordRegisterTotality.walker.test.js
   REGISTER  scripts/mutation-coverage-manifest.json

(action, path) SET EQUALITY, BOTH DIRECTIONS: EQUAL ✅
  |§7| = 3   |JSON| = 3   §7 minus JSON = 0   JSON minus §7 = 0
  acceptanceCases = 7 (cap 8)   requiredSymbols = 4   checks = 3
  status = DRAFT   verifiedBase = __BASE__   retiredSymbols = null
exit=0
```

CONFIRMED: one full repo-relative path per row; every action a member of the tree's own
`PACKET_ACTIONS` and identical on both sides; no row for a path the packet does not change; the
(action, path) sets equal in both directions.

The sealed dispatch's own checks, read dry against `scripts/implementation-session.mjs`, are in the
packet's §4 table. The two that bind: the REGISTER row puts `scripts/mutation-coverage-manifest.json`
into the SUBSTRATE (`:185-196`, CREATE rows excluded at `:186`), so the base must be the promotion
tip to short-circuit at `:184`; and `validate:packets` (`:271`) passes only once EM-B1d is terminal.

## E-21 · ⭐ The stride, justified by execution: 63 rows versus 525

```
$ R0A_CORPUS=full node --import ./hook3.mjs r0a-census.mjs   # full output: out-r0a-census-525.txt
rows=525  generated=525  generateMs=8032  walkMs=1456  msPerRow=15.3

$ diff <(63-row summary, counts stripped) <(525-row summary, counts stripped)
⭐ IDENTICAL: the 63-row sample's collection classification equals the 525-row corpus's

$ grep -E "^rows=|ARRAY-OF-OBJECT COLLECTIONS|declared key|NO declared key|distinct collapsed" both
--- 63 rows                                        --- 525 rows
=== R0a.3 — … (63 distinct collapsed paths) ===     === R0a.3 — … (63 distinct collapsed paths) ===
declared key HOLDS …: 50                            declared key HOLDS …: 50
declared key BREAKS: 1                              declared key BREAKS: 1
NO declared key, but a unique candidate: 11         NO declared key, but a unique candidate: 11
NO declared key and NO unique candidate: 1          NO declared key and NO unique candidate: 1
distinct collapsed NODE paths observed: 1170        distinct collapsed NODE paths observed: 1170
distinct collapsed LEAF paths observed: 884         distinct collapsed LEAF paths observed: 884
node paths observed ONLY as null: 6                 node paths observed ONLY as null: 6

$ grep -A4 "^resourceAnalysis.gaps " out-r0a-census-525.txt
resourceAnalysis.gaps   arrays=489  multi=465  entries=2982  maxLen=15  DECLARED=chain
                          UNIQUE-in-every-array=[⛔ NONE]
                          declared-key verdict: ⛔ BREAKS in 142/489 arrays
```

CONFIRMED: **the 63-row structured sample reproduces the 525-row corpus's classification exactly** —
same 41 keys, same 63 collection paths, same 50/1/11/1 split, same 1,170 node and 884 leaf paths,
same six null-only leaves — at 1,256 ms of generation against 7,820 ms. The stride is a measurement,
not a preference. `resourceAnalysis.gaps` breaks in 142 of 489 arrays at 525 rows (29 of 60 at 63);
the ruling is the same either way.

**The CANNOT-CATCH figures, measured at 525 rows** (`out-r0a-census-525.txt`):

```
arrays observed EMPTY in every row (entry shape never observed) — 12:
   aiOverlays · coherenceNotes · config.intendedStressTypes · config.nearbyResourceDefinitions
   · config.nearbyResourceDefinitionsDepleted · config.nearbyResourcesCustom
   · generationCoherenceReceipt.checks[].findings · generationCoherenceReceipt.judgments[].findings
   · resourceAnalysis.exploitation.warnings · resourceAnalysis.featureEffects
   · resourceAnalysis.imports.recommended · resourceAnalysis.priorityNotes

node paths observed ONLY as null — 6:
   neighborRelationship · economicState.incomeSources[].priorityNote
   · economicState.foodSecurity.magicTradeChannel · powerStructure.factions[].modifier
   · economicState.activeChains[].externalMillNote · powerStructure.factionRelationships[].dmNote

node paths seen in exactly ONE of the 63 rows — 18 (defenseProfile.institutions.militia's eleven,
   institutions[].exclusiveGroupCoexists, defenseProfile.institutions.magicDef[].nativeTier and
   .coherenceRepair, economicViability.warnings[].category/.impact/.suggestedFixes and its [])
```

## E-22 · The test-home precedents and the mutation-coverage obligation

```
$ grep -n -A 10 "ENFORCER_DIRS = " tests/lint/mutationCoverage.shared.mjs
36:export const ENFORCER_DIRS = [
37-  'tests/lint', 38- 'tests/design', 39- 'tests/docs', 40- 'tests/data',
41-  'tests/copy', 42- 'tests/security', 43- 'tests/edgeFunctions', 44- 'tests/generators',
45-];

$ ls tests/lint/*.js | wc -l
     172
$ grep -ln "generateSettlement\|runPipeline\|goldenCorpus" tests/lint/*.js
tests/lint/densityCreateBoundary.walker.test.js      tests/lint/distributionEnvelopePower.test.js
tests/lint/engineTelemetryWall.walker.test.js        tests/lint/exportTokenCoverage.test.js
tests/lint/institutionTable.walker.test.js           tests/lint/proseComposed.walker.test.js
tests/lint/proseMeasures.walker.test.js              tests/lint/proseWiringCensus.walker.test.js
tests/lint/resourceLabelSeam.census.test.js          tests/lint/refusalNoticeCoverage.walker.test.js
tests/lint/siteCoherenceRatchet.test.js              tests/lint/worldGenerationClockSeam.walker.test.js
tests/lint/writerReach.walker.test.js
   (13 of 172)
$ grep -n "goldenCorpus" tests/lint/proseWiringCensus.walker.test.js
60:import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

$ python3 -c "… scripts/mutation-coverage-manifest.json …"
total rows: 705
tests/lint/densityCreateBoundary.walker.test.js  -> {"kind": "rationale", "rationale": "TE-DENSITY-1's
  create-boundary walker (ODQ §822). A RATIONALE rather than a plant because the file's catching
  power is not a behaviour a mutant could perturb — it is an EXACT PARTITION over a live source
  scan, asserted in BOTH directions and floored against vacuity inside the same file: arm 1 refuses
  an empty denominator, arm 2 reds on any module that …"}
tests/generators/pipelinePinnedMode.test.js      -> {"kind": "rationale", "rationale": "EM-P0's
  acceptance battery … A1 hashes a 41-row stride sample of the golden master's own 525-row corpus …"}

$ for f in tests/lint/mutationCoverageManifest.test.js tests/lint/negativeAssertionAnchor.walker.test.js \
           tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js; do
    printf "%-62s %s\n" "$f" PRESENT; done   # all four PRESENT
```

CONFIRMED: `tests/lint` is an `ENFORCER_DIR`, so the walker owes its `invariants` row; 13 of the
estate's 172 `tests/lint/` files already generate settlements and one already imports
`goldenMasterCorpus`, so a corpus-generating walker there is precedent, not novelty; and
`densityCreateBoundary.walker.test.js`'s `rationale` is the exact form EM-R0a's row copies, for the
exact reason (an exact partition asserted both directions and floored against vacuity in the same
file). Every declared `checks` target exists.

## E-23 · The lighting census — already red at this tip

```
$ python3 -c "…"  # tests/lint/.lighting-census-baseline.json
measuredAtSha = baf8ccc1da4f7e327ad1d4d053ad814a830a90bf
measuredBy = EM-P0      date = 2026-09-19
note = EM-P0: one new test file (the pinned-mode battery)
files = 2646   parked = 383   credited = 2263   titles = 25005   suiteTitles = 6671

$ find tests -type f \( -name "*.test.js" -o -name "*.test.jsx" \) | wc -l
    2648

$ grep -n "parked + figures.credited !== figures.files" tests/lint/sovereigntyLightingContract.walker.test.js
733:  if (figures.parked + figures.credited !== figures.files) {
```

CONFIRMED: the frozen `files` figure is **2646** and the live tree holds **2648** test files, so the
walker is RED at this tip before EM-R0a exists (EM-B3a's and EM-P3's un-refrozen landings; EM-P3's
own header predicts the tuple `2648 · 383 · 2265 · 25015 · 6675`). **No absolute is quoted anywhere
in EM-R0a**; the packet states its own delta (`files +1 · parked +0 · credited +1 · titles +6 ·
suiteTitles +1`) and leaves the absolute to the chair's stamp, per the R11 rule and §P2.1.

## E-24 · The observed-shape prediction, and the precedent that supports it

```
$ sed -n '250,257p' scripts/check-observed-shape-readers.mjs
/** Every `.js`/`.jsx` under `src/` — the whole app, not just `src/domain` … */
export const isObservedShapeScanPath = (path) => (
  /\.(js|jsx)$/.test(path) && !path.endsWith('.generated.js')
);

$ sed -n '954,956p;967,971p' scripts/check-observed-shape-readers.mjs
export const WRITE_SHAPE_SPELLINGS = Object.freeze([
  'property', 'quoted', 'shorthand', 'token-in-string-literal',
]);
    // `'key'` / `"key"` / backtick — the quoted spelling a computed field list uses.
    { spelling: 'quoted', pattern: new RegExp(`['"\`]${k}['"\`]`) },

$ grep -n "'npcs'\|'factions'\|'institutions'\|'powerStructure'\|'economicState'" src/domain/display/publicSafe.js | head -4
54:  'conflicts', 'crossSettlementConflicts', 'dailyLife', 'defenseProfile', 'economicState',
55:  'economicViability', 'factions', 'generatorVersion', 'history', 'id',
56:  'institutions', 'interSettlementRelationships', 'name', 'neighborRelationship', 'neighbourNetwork',
57:  'npcs', 'population', 'populationHistory', 'powerStructure', 'pressureSentence',

$ git grep -c "publicSafe" -- scripts/check-observed-shape-readers.mjs
0
$ grep -c "publicSafe" tests/lint/observedShapeBank.literal.js
0
```

PLAUSIBLE, with a live precedent, and **the pre-proof executes it rather than inheriting it**:
`src/domain/display/publicSafe.js` already carries a frozen list of quoted top-level record keys
under `src/domain/`, sits inside the scanner's roots (every `.js` under `src/`), and carries neither
an exemption row nor a bank-literal mention — so a pure-string list of record keys under
`src/domain/` is measured NOT to convict the reader scan. ⚠ Named as a risk anyway because the
estate's own probe vocabulary includes a `quoted` spelling. The packet's §7 makes the scanner run a
MEASUREMENT OWED AT PRE-PROOF, with a STOP if either register moves.

## E-25 · ⭐ THE HEADER PARSES — executed against the tree's own parser, and the first form FAILED

The validator compares the packet Markdown's `Verified base` row with the manifest's `verifiedBase`
(`scripts/implementation-packets.mjs:889`), and a READY packet must additionally name a non-blank
verified BRANCH (`:891`). `parsePacketHeader` (`:294`) accepts only two spellings:

```
$ sed -n '302,310p' scripts/implementation-packets.mjs
  const baseRows = [...preamble.matchAll(/^\s*(?:-\s*)?\*\*Verified base:\*\*([^\n]*)$/gmi)];
  const baseValue = baseRows.length === 1 ? baseRows[0][1].trim() : '';
  const branchMatch = baseValue.match(/^`?([A-Za-z0-9][A-Za-z0-9._/-]*)`?\s+at\s+`?([0-9a-f]{40})`?$/i);
  const bareMatch = baseValue.match(/^`?([0-9a-f]{40})`?$/i);
  const verifiedBase = (branchMatch?.[2] ?? bareMatch?.[1] ?? '').toLowerCase() || null;
```

This lane's FIRST draft wrote the row as a bare `` `__BASE__` ``. Executed against the real parser:

```
$ node tools/r0a-header-parse.mjs "$TREE" EM-R0a.md          # out-r0a-header-parse.txt
AS WRITTEN (placeholder in place):
  {"heading":"EM / EM-R0a — THE CLASS REGISTER of a generated settlement record (the re-entry family, member 1)",
   "status":"DRAFT","verifiedBase":null,"verifiedBranch":null}
AFTER the chair substitutes __BASE__ -> a 40-hex sha:
  {"heading":"EM / EM-R0a — THE CLASS REGISTER …","status":"DRAFT",
   "verifiedBase":"0123456789abcdef0123456789abcdef01234567","verifiedBranch":"fixes-2026-09-18-consist"}
BARE-PLACEHOLDER CONTROL (the form this lane tried first and rejected):
  {"heading":"EM / EM-R0a — THE CLASS REGISTER …","status":"DRAFT","verifiedBase":null,"verifiedBranch":null}
```

⛔ CONFIRMED: a bare `` `__BASE__` `` parses to **`null`**, and `:889` would then error
`verifiedBase disagrees with packet Markdown: manifest=__BASE__ packet=null` on the promotion commit
itself. **CORRECTED**: the row is written `` `fixes-2026-09-18-consist` at `__BASE__` `` — the
branch spelling the landed EM packets use — so the chair's substitution of the single token
`__BASE__` (in this line and in the manifest's `verifiedBase`, one act) yields both a parsed
`verifiedBase` and the non-blank `verifiedBranch` that a READY packet requires. The heading also
parses and names the packet id, and the status row parses `DRAFT` standing alone on its line.

---

# VERSION 2 — the evidence added at `ad7ddf2c9` under design §22.3

⚠ **Nothing above is rewritten.** Version 1's rows E-1…E-25 were measured at `58fcfe614` and stand;
E-27 re-runs the whole version-1 census at the new tip and diffs it. New scripts live in
`tools2/` (the version-1 copies with `instrument.mjs`'s `TREE` repointed); raw outputs are
`out-v2-*.txt`.

## E-26 · The new tree, and the preamble's moved hash

```
$ git -C $SP/read-tip-ad7ddf2c9 rev-parse HEAD
ad7ddf2c9712a4f9e17a194e3ba2891bf23cc246
$ git -C $SP/read-tip-ad7ddf2c9 status --porcelain -uall | wc -l
       0
$ git -C $SP/read-tip-ad7ddf2c9 diff --stat 58fcfe614 ad7ddf2c9 -- src
 src/domain/worldPulse/calamityKernel.js | 47 ++++++++++++++++++++++++++++-----
 1 file changed, 41 insertions(+), 6 deletions(-)
$ cd $NT && shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1  docs/implementation/preambles/EM-PREAMBLE.md
$ git diff 58fcfe614 ad7ddf2c9 -- docs/implementation/preambles/EM-PREAMBLE.md
+12. **Every path a declared command WRITES is a change-manifest row, and the edge-shared generator
     writes ALL FIVE metas.** … The same law binds any other generator a member's `checks` run. …
```

CONFIRMED: `src/` differs in ONE file (EM-B1e's ruin writer); the tree is clean; **the preamble's
hash MOVED** from version 1's `1cf5442719…` to `b90a95b7af…` because §P2 gained row 12. Neither
row 10 nor row 12 binds this packet, and §7 says why.

## E-27 · ⭐ The whole version-1 census, re-run at the new tip and DIFFED

```
$ cd tools2 && node --import ./hook3.mjs r0a-census.mjs > out-v2-census.txt
$ diff out-r0a-census.txt out-v2-census.txt
2c2
< rows=63  generated=63  generateMs=1282  walkMs=184  msPerRow=20.3
---
> rows=63  generated=63  generateMs=1855  walkMs=266  msPerRow=29.4
566c566
< wall=2696 ms
---
> wall=3835 ms
$ node --import ./hook3.mjs r0a-emit.mjs > out-v2-emit.txt ; diff out-r0a-emit.txt out-v2-emit.txt
(no output before the V2 table block was added)
```

CONFIRMED: **the census at `ad7ddf2c9` is identical to the census at `58fcfe614` in every figure —
41 top-level keys, 63 collection paths, 50 holding keys, 1 broken, 13 keyless, 1,170 node paths,
884 leaf paths, the six null-only leaves — and differs only in wall-clock.** The `calamityKernel.js`
change moves no record key, no collection and no classification.

## E-28 · The manifest census and the lighting baseline, re-measured at the new tip

```
$ python3 -c "… docs/implementation/PACKET_MANIFEST.json …"
total: 189
statuses: {'LANDED': 186, 'SUPERSEDED': 2, 'READY': 1}
 NON-TERMINAL: EM-B1d READY
     MODIFY src/domain/entities/npcs.js … CREATE tests/lint/statusUnionTotality.walker.test.js
     TEST tests/generators/densityLaw.test.js · TEST tests/domain/espionageMission.test.js
     REGISTER scripts/mutation-coverage-manifest.json
     MODIFY supabase/functions/_shared/… (six bundle and meta rows)
$ find tests -type f \( -name "*.test.js" -o -name "*.test.jsx" \) | wc -l
    2649
$ python3 -c "… tests/lint/.lighting-census-baseline.json …"
{'measuredAtSha': 'baf8ccc1d…', 'measuredBy': 'EM-P0', 'files': 2646, 'parked': 383,
 'credited': 2263, 'titles': 25005, 'suiteTitles': 6671}
```

CONFIRMED: **EM-B1d is STILL READY and still reserves `scripts/mutation-coverage-manifest.json`**
(its own manifest has grown 11 → 16 rows under §P2 row 12; none of the new rows is a path of this
packet). The reservation of §4 stands. And the lighting walker is now red by **three** files
(2649 live against a frozen 2646) before EM-R0a exists.

## E-29 · ⭐⭐ THE RECEIPT, CLASSED BY THE INPUT EACH SUB-PATH READS

`tools2/r0a-receipt.mjs` rebuilds `buildGenerationCoherenceReceipt(record, ctx)` with each input
withheld and diffs the result, over all 63 rows.

```
$ node --import ./hook3.mjs r0a-receipt.mjs                    # out-v2-receipt.txt
=== V2-R.1 — the control ===
rows=63  rebuild with the real inputs EQUALS the record's receipt: 0/63
receipt.seed === record._seed: 63/63
rows whose ctx.generationRepairs is non-empty: 20/63  (counts: 0,1,2,3)

=== V2-R.2 — every receipt sub-path that MOVES when an input is withheld ===
B = generationRepairs emptied · C = generationContext withheld · D = seed emptied · E = context {}
path                                                          B     C     D     E
repairs.length                                                20    0     0     20
repairs[]                                                     32    0     0     32

=== V2-R.3 — the ten top-level receipt keys, classed by the INPUT each reads ===
  version            B=0 C=0 D=0 E=0  -> settlement only
  status             B=0 C=0 D=0 E=0  -> settlement only
  seed               B=0 C=0 D=0 E=0  -> settlement only
  worldLawVersion    B=0 C=0 D=0 E=0  -> settlement only
  cultureProfile     B=0 C=0 D=0 E=0  -> settlement only
  contentProfile     B=0 C=0 D=0 E=0  -> settlement only
  checks             B=0 C=0 D=0 E=0  -> settlement only
  judgments          B=0 C=0 D=0 E=0  -> settlement only
  repairs            B=52 C=0 D=0 E=52 -> HISTORY-INPUT (generationRepairs)
  authoredTensions   B=0 C=0 D=0 E=0  -> settlement only

=== V2-R.5 — the ids ===
  checks    (17): template_tokens narrative_quality world_law_magic content_boundaries resource_truth
                  structural food_verdict npc_identity isolation_support final_graph chronology
                  conservation user_intent narrative_realization dramatic_tension roster_repetition provenance
  judgments  (7): hard_structural_validity cross_system_semantic_agreement user_intent_fulfillment
                  narrative_realization dramatic_tension diversity_and_repetition confidence_and_provenance

=== V2-R.6 — the five V-EVIDENCE-* invariants: which receipt path does each read? ===
  V-EVIDENCE-ROSTER   -> judgments[id=hard_structural_validity].evidence[path=finalGraph].evidence = "14 NPCs / 37 relationships"
  V-EVIDENCE-EVENTS   -> judgments[id=narrative_realization].evidence[path=narrative].evidence = "9 historical events"
  V-EVIDENCE-STRESS   -> judgments[id=dramatic_tension].evidence[path=stress[0]].evidence = "Infiltrated"
  V-EVIDENCE-TENSION  -> judgments[id=dramatic_tension].evidence[path=history.currentTensions[0]].evidence = "infiltration_fear"
  V-EVIDENCE-CONFLICT -> judgments[id=dramatic_tension].evidence[path=conflicts[0]].evidence = "Conflict 1"
```

⭐ CONFIRMED: **`repairs` is the ONLY receipt sub-path that reads an input the record lacks.**
`generationCoherence.js:515` is `Object.freeze([...(context.generationRepairs || [])])` — a pure copy
of `generationRepairs`. Everything else is a settlement-function: `seed` because `:511`'s
`String(context.seed || settlement?._seed || '')` falls back to the record (and
`receipt.seed === record._seed` in **63/63**); `worldLawVersion` because `:512-514` falls back to a
world law built from `settlement.config` (`:354-364`); and `authoredTensions` because `:418-441`
reads `settlement.structuralViolations`, `presentationBranches(settlement)` and
`resolveGenerationContentProfile(settlement.config)` and nothing else.

⛔ **THE RULING'S EXAMPLE LIST IS REFUTED ON `authoredTensions`, WITH THE LINE.** §22.3 item 1 and the
dispatch name it HISTORY; by the ruling's own test it is a READING. Packet §11 Q1.

## E-30 · The control, diagnosed; and arm B re-run NON-VACUOUSLY

```
$ node --import ./hook3.mjs r0a-receipt2.mjs                   # out-v2-receipt2.txt
=== V2-R.7 — the control, diagnosed ===
   judgments[].evidence[].evidence                          rows=63
   judgments[].evidence[].detail                            rows=63
   e.g. thorp|germanic|plains|road|civilized|…: first differing path judgments[6].evidence[2].evidence (of 2)
   recorded: status=coherent checks=17 judgments=7 repairs=2 tensions=0
   rebuilt : status=coherent checks=17 judgments=7 repairs=2 tensions=0
   recorded findings per check: … all 17 at 0 …
   rebuilt  findings per check: … all 17 at 0 …

=== V2-R.8 — arm B re-run over the rows that CARRY repairs (anti-vacuity) ===
rows carrying at least one repair: 20 of 63  (tiers: village,city,metropolis,town)
  checks: 0 id(s) move when the repair log is emptied, over 20 rows that carry one
  judgments: 0 id(s) move when the repair log is emptied, over 20 rows that carry one

=== V2-R.9 — the provenance judgment, with and without the repair log ===
  repairs in ctx: 1
  identical? true
  check WITH identical to WITHOUT? true
```

⭐ CONFIRMED, two things.
**(a) The control's failure is EXACT and SMALL, and it is a finding.** A rebuild differs from the
recorded receipt in two leaf shapes in 63/63 — `judgments[].evidence[].evidence` and `.detail` — at
ONE entry, `judgments[id=confidence_and_provenance].evidence[path=simulationTrace]`. Status, all 17
checks (0 findings each) and all 7 judgment ids are identical. The mechanism: the receipt is built at
`assembleSettlement.js:283`, **before** the trace is propagated onto the settlement (`:292`'s own
comment), so the recorded evidence reads *"No step trace was persisted…"* and a rebuild reads
*"Deterministic generation trace is present. N trace entries"*. → **The receipt is MERGED, never
RECOMPUTED**, pinned in the packet's §5.5 and slotted to EM-R0c in §12.
**(b) Arm B is non-vacuous and the answer holds.** Over the **20 rows that carry a repair**, zero of
17 check ids and zero of 7 judgment ids move; the `provenance` check and the
`confidence_and_provenance` judgment are byte-identical with and without the log. The SOURCE says
why: `generationReceiptJudgments.js:654-660`'s repair loop pushes a finding only for a MALFORMED
repair (`if (repair?.type && repair?.action && repair?.reason) continue;`), and no generated repair
is malformed. That one seam is CANNOT-CATCH row 10.

## E-31 · The cross-entry sweep, first pass (and why its tolerance was wrong)

```
$ node --import ./hook3.mjs r0a-crossentry.mjs                 # out-v2-crossentry.txt
=== V2-X.1 — CROSS-ENTRY invariants over every object collection (63 paths) ===
  defenseProfile.institutions.magicDef  .baseChance   TOTAL≈1                              multiArrays=11
  defenseProfile.institutions.walls     .baseChance   TOTAL≈1 · MONOTONE                    multiArrays=9
  economicState.incomeSources           .percentage   TOTAL≈100 · MONOTONE · SHARE-NAMED    multiArrays=61
  economicState.incomeSources           .weight       SHARE-NAMED                           multiArrays=61
  factions                              .powerFactionPower  SHARE-NAMED                     multiArrays=39
  factions[].members                    .power        SHARE-NAMED                           multiArrays=89
  history.eventsTimeline                .year         MONOTONE                              multiArrays=60
  history.eventsTimeline                .yearsAgo     MONOTONE                              multiArrays=60
  history.historicalEvents              .yearsAgo     MONOTONE                              multiArrays=60
  npcs                                  .power        SHARE-NAMED                           multiArrays=33
  powerStructure.factionRelationships   .ratio        SHARE-NAMED                           multiArrays=14
  powerStructure.factions               .power        TOTAL≈100 · MONOTONE · SHARE-NAMED    multiArrays=63
  powerStructure.factions               .rawPower     SHARE-NAMED                           multiArrays=63
  simulationTrace                       .ts           PERMUTATION · MONOTONE                multiArrays=63
```

⚠ **This pass used `|sum − first| ≤ 1`, which is right for a percentage near 100 and meaningless for
a sum near 1.** It therefore RAISED the two `baseChance` rows. E-32 refutes them.

## E-32 · ⭐ The sweep re-run at a RELATIVE tolerance — two totals, two rejections

```
$ node --import ./hook3.mjs r0a-total.mjs                      # out-v2-total.txt
=== V2-X.4 — TOTAL, with a RELATIVE tolerance (0.5% of the total) ===
  economicState.incomeSources.percentage  TOTAL=100  multiArrays=61  distinctSums=1 [100.000000]  declaredKey=source
  powerStructure.factions.power           TOTAL=100  multiArrays=63  distinctSums=1 [100.000000]  declaredKey=faction

=== V2-X.5 — the two loose-pass candidates, examined entry by entry ===
  defenseProfile.institutions.magicDef: multiArrays=11
     baseChance = [0.4, 0.5]  sum=0.9   names=[Wizard's tower | Alchemist quarter]
     baseChance = [0.3, 0.5]  sum=0.8   names=[Mages' guild | Alchemist quarter]
     baseChance = [0.4, 0.45] sum=0.85  names=[Academy of magic | Mages' district]
     distinct sums over all 11: 0.9000, 0.8000, 0.8500, 0.6000
  defenseProfile.institutions.walls: multiArrays=9
     baseChance = [0.5, 0.5]  sum=1     names=[Town walls | Gates (if walled)]
     baseChance = [0.9, 0.4]  sum=1.3   names=[City walls and gates | Citadel]
     distinct sums over all 9: 1.0000, 1.3000
```

⭐ CONFIRMED: **exactly TWO collections carry a cross-entry total**, each with ONE distinct sum over
61 and 63 multi-entry arrays. ⛔ **The two `baseChance` candidates are REJECTED BY THEIR OWN
CONTROL** — four and two distinct sums; they are independent per-institution probabilities. Recorded
as rejected rather than dropped, and A7 carries them as its paired negative.

**Also swept and deliberately not made atomic:** `history.eventsTimeline` (`year`, `yearsAgo`) and
`history.historicalEvents` (`yearsAgo`) are MONOTONE in 60/60 multi-entry arrays — an ORDERING, which
§22.2 item 4 already merges three-way. Slotted to EM-R0c in §12.

## E-33 · The version-2 register's effective-line count

```
$ node --import ./hook3.mjs r0a-emit.mjs                       # out-v2-emit.txt
=== TABLE 4 (V2) — the module draft ===
total lines (code only, no JSDoc): 163   EFFECTIVE (non-blank, non-comment): 163
  RECORD_CLASSES rows       = 41 generated + 4 saved-only + 2 editor = 47
  CLASS_EXCEPTIONS rows     = 3
  KEYED_COLLECTIONS rows    = 48
  ATOMIC_COLLECTIONS rows   = 15
  CROSS_ENTRY_TOTALS rows   = 2
  CONSISTENCY_GROUPS rows   = 6
  budget: 250 per leaf · 400 per packet  ⇒ headroom per leaf = 87
```

CONFIRMED: **163 effective lines** against a `≤ 210` bound and the 250-per-leaf cap. **No split.**

## E-34 · ⭐⭐ THE SAVE ROUND TRIP — the register's totality over a SAVED record

`src/lib/saves.js` imports `./supabase.js` and cannot be imported under plain node, but only TWO of
its functions reshape the settlement BLOB, and both are reachable: `normalizeSettlement`
(`src/domain/normalizeSettlement.js`, loaded by `saves.js:78-88`, applied by `migrateSettlementShape`
`:264-267` at `:713` and `:332`) — imported directly; and `withNeighbourNetworkFromRelationship`
(`saves.js:233-256`, applied to `v2.settlement` at `:444 :505 :744 :777`) — not exported, so its
body is re-applied verbatim from the source and the citation is the proof. Everything else
`migrateSaveToV2` touches (`:190-218`) is the ENVELOPE (`seed`, `campaignState`), never the blob.

```
$ node --import ./hook3.mjs r0a-save.mjs                       # out-v2-save.txt
SCHEMA_VERSION exported by src/domain/settlement.schema.js = 1
=== V2-S.1 — the round trip over 63 generated records ===
J   (JSON round trip alone) identical to the record : 63/63
N   (normalizeSettlement alone) identical            : 63/63
JN  (JSON then normalize — the real read path)       : 63/63
records whose normalized form carries schemaVersion  : 63/63
top-level keys the READ PATH ADDS         : NONE
top-level keys the READ PATH DROPS        : NONE
object collections the READ PATH ADDS     : NONE
object collections the READ PATH DROPS    : NONE
leaf paths the READ PATH CHANGES          : NONE

=== V2-S.2 — the WRITE path's one settlement clause (saves.js:233-256) ===
generated neighborRelationship on this record: null
with the GENERATED (null) relationship, the clause is a no-op: true
with a neighbour NAMED, the clause adds top-level key(s): neighbourNetwork
saved top-level key count: generated=41 → saved=42
```

⭐ CONFIRMED: **the READ path is a no-op in 63/63** — it adds no key, drops no key, changes no leaf
and adds or drops no collection. **The WRITE path adds exactly one key, `neighbourNetwork`,** and
only when the record carries a NAMED `neighborRelationship`, which no corpus row does (null 525/525).

**The second instrument — the estate's OWN enumeration of a saved record's top-level keys:**

```
=== V2-X.3 — src/domain/display/publicSafe.js ===
  PUBLIC_TOPLEVEL_KEYS: 38 keys
     in the LIST but not in a generated record (6): crossSettlementConflicts dailyLife
        interSettlementRelationships neighbourNetwork populationHistory thesis
$ sed -n '39,42p' src/domain/display/publicSafe.js
// fields (thesis, dailyLife) that the shareNarrated base (ai_data.aiSettlement)
// serves AND renders (crossSettlementConflicts, interSettlementRelationships,
// neighbourNetwork, populationHistory).
```

⭐ The file's own comment splits the six: **`thesis` and `dailyLife` are `ai_data.aiSettlement`
fields** (corroborated at `src/generators/aiLayer.js:10`, `thesis: string`), **not settlement
top-level keys** — the register deliberately omits them. The other **FOUR are settlement keys**, and
each writer was found:

```
$ git grep -n "\.<key> = |<key>:" -- src | grep -v publicSafe|worldSnapshotPublic|test
neighbourNetwork             -> src/lib/saves.js:233-256 (measured above) + SettlementsPanel.jsx:468,482,501,520
interSettlementRelationships -> src/components/SettlementsPanel.jsx:468, 482, 501, 520
populationHistory            -> src/domain/worldPulse/calamityKernel.js:470
                                src/domain/worldPulse/demographicsKernel.js:356
                                (read by src/domain/highWater.js:228)
crossSettlementConflicts     -> ⛔ NO WRITER IN src/
$ git grep -n "crossSettlementConflicts" -- src | head -4
src/components/new/tabs/RelationshipsTab.jsx:59:  // `settlement.crossSettlementConflicts`. Nothing in `src/` writes that key — the generator
src/domain/display/stateProse/relationshipsDeskRead.js:156: * `settlement.crossSettlementConflicts`. Nothing in `src/` writes that key. So on every
```

⛔ CONFIRMED: **`crossSettlementConflicts` is allow-listed by the public veil and merged by two
readers, and nothing in `src/` writes it** — two independent source comments say so in as many
words. It is classed, listed in `NOT_YET_WRITTEN_KEYS`, and its FATE is proposed in the packet's §12.

---

## Scripts and raw outputs

| script (`tools/`) | what it measures | raw output |
|---|---|---|
| `r0a-census.mjs` | the class denominator, every collection's key presence and uniqueness, the atomic set, the empty-only and null-only sets, the node/leaf denominators. `R0A_CORPUS=full` switches to 525 rows | `out-r0a-census.txt` · `out-r0a-census-525.txt` |
| `r0a-emit.mjs` | Tables 1–3 verbatim, the vacuity rows, and the module draft's effective-line count | `out-r0a-emit.txt` |
| `r0a-mixed.mjs` | `q3-merge-edits.mjs` with the 30-row slice removed, plus the per-trial attribution, the collapsed tally and the leaf-by-leaf detail | `out-r0a-mixed.txt` |
| `r0a-groups.mjs` | the corpus-wide label⇒flag / count=length / prose-count hunt, the mirror, the traps | `out-r0a-groups.txt` |
| `r0a-groups2.mjs` | the per-flag, uncle and near-total arms the strict form filtered out; conflicts' uniqueness; the mirror's absent-field check | `out-r0a-groups2.txt` |
| `r0a-summary.mjs` | the viability summary's two prose counts; `stress` vs `stressors` | `out-r0a-summary.txt` |
| `r0a-cost.mjs` | the three strides' wall clock through the real generator entry | `out-r0a-cost.txt` |
| `r0a-table-equality.mjs` | the §7 / `changeManifest` equality, both directions | `out-r0a-table-equality.txt` |
| `tools2/r0a-receipt.mjs` · `r0a-receipt2.mjs` | the receipt classed by withheld input; the control diagnosed; arm B re-run over the 20 repair-carrying rows | `out-v2-receipt.txt` · `out-v2-receipt2.txt` |
| `tools2/r0a-crossentry.mjs` · `r0a-total.mjs` | the cross-entry sweep at two tolerances, and the estate's saved-key allow-list | `out-v2-crossentry.txt` · `out-v2-total.txt` |
| `tools2/r0a-save.mjs` | the save round trip through `normalizeSettlement` and the write-path neighbour clause | `out-v2-save.txt` |
| `r0a-header-parse.mjs` | the packet header through the tree's own `parsePacketHeader`, as written and after the chair's substitution, with the rejected bare-placeholder control | `out-r0a-header-parse.txt` |
| `q1-keys.mjs`, `q3-merge-edits.mjs` (kit copies, `TREE` repointed) | the digest scan; the 32 merge trials | `out-q1-keys.txt` · `out-q3-edited.txt` |
