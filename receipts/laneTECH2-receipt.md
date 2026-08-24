# ⛔⛔ URGENT TO THE CHAIR AND EVERY SIBLING LANE — THE THROTTLE FLAG IS INVALID

**`--poolOptions.threads.maxThreads=2` and `--minWorkers` DO NOT EXIST in vitest 4.1.8.**
Both raise `CACError: Unknown option` and exit **1 with ZERO tests collected**, before any
test file is read. A lane that adds the flag string from ODQ §511.1 will see a non-zero exit
on every battery and may read it as a RED in its own member. This is the §507.5 false-signal
family with the sign flipped.

    WRONG:  npx vitest run --pool=threads --poolOptions.threads.maxThreads=2 --poolOptions.threads.minThreads=1 <files>
            -> CACError: Unknown option `--poolOptions`   exit 1, 0 tests collected
    WORKS:  npx vitest run --pool=threads --maxWorkers=2 <files>
            -> Test Files 1 passed (1) / Tests 8 passed (8), exit 0   (verified this lane)

`--maxWorkers` is the only worker-count flag vitest 4.1.8's own `--help` lists. TE-CH-2 lost
two chain relaunches to this before catching it.

# Lane TE-CH-2 receipt (MF-CH2 THE MAGIC LICENCE)

STARTED 2026-08-24T00:08:45Z

## RESUME POINT (charter read complete)
- Base `claude/composite-r4` = b2852ccc3cc4753499996da6582dd672e90499d0 (MF-CH1 LANDED, the 47th).
- Read: charter §0 + §2 whole, skeptic report whole, ODQ §501/§503/§505/§507.
- Rulings absorbed: 5 gate paths; G6 refuted, G5 half; G4 the real divergence; 28 rows; lowercase tokens.
- Next: worktree + npm ci + S0 table.

## RESUME POINT (S0 complete + gate census)
- Worktree `$SP/laneTECH2-tree` detached at b2852ccc3; npm ci EXIT 0; node_modules 468; node v24.12.0; vitest 4.1.8; disk 15,545,312 KB.
- OSR part1: TRUE_EXIT 1, 159 B, sha c5b67844abe51226...; chair baseproof identical, cmp EXIT 0, its porcelain 0.
- OSR part2 walker literals: { reads: 1995, identities: 1409, files: 387, bankedReads: 60, taggedRows: 40 } @ observedShapeReaders.walker.test.js:737
- golden sha 29c6cc8fd0573a37a8e4042b8f98db92fbe49ea36e24f61355c806f79bc9e0a8
- census tuple @ sovereigntyLightingContract.walker.test.js:6109 = files 2516, parked 366, credited 2150, titles 20863, suiteTitles 5808
- ruinFilterRoster @ :376 = 92
- size baseline: no row for any CH-2 file; src/data no max-lines; src/generators+src/domain 800 effective; all files far under.
- edge bundles: institutionalCatalog.js AND constants.js each in aiCharter/aiGrounding/aiOutputSchema -> build:edge-shared owed in CH-2a.
  institutionProbability/generationContext/magicFilter/arcaneInstitutionIdentity: in ZERO rosters.
- manifest 169, LANDED 168 + SUPERSEDED 1, NON-TERMINAL 0 -> no reservations against me.
- GATE CENSUS: 311 rows; rows touched by ANY magic gate = 28 (== the Magic/Exotic shelves exactly); off-shelf rows treated as magic = 0.
- Shelf-reading gate sites = FIVE: P1, P3, P4(isArcaneInstitution bucket), P5(carriesExplicitMagicMetadata), magicFilter isArcaneInst. P2 hiMagicInsts is a NAME list, not a shelf gate.
- SEAM DECIDED: CH-2a {constants.js, institutionalCatalog.js, arcaneInstitutionIdentity.js} | CH-2b {institutionProbability.js, generationContext.js, magicFilter.js}. Path-disjoint (validator can hold both non-terminal).

## RESUME POINT (base measurement + design settled) 2026-08-24T00:40Z
- Base corpus over the GOLDEN MASTER GRID (6 tiers x 12 cultures x 7 terrains = 504) x 5 magic cases = 2,520 settlements, 41 s. Saved $SP/CH2-BASE.json.
- CORRECTION TO H21/V18 (mine, by execution): P5 is a SHELF gate at its LIVE call shape. Every allowsInstitution
  call site spreads `category` (the shelf) onto the record (assembleInstitutions:268/410/484, cascadeGenerator:180),
  and carriesExplicitMagicMetadata reads `entity.category` -> 'magic'. The 26 figure is the KEYWORD arm alone.
- G4 REFUTED AT ROW LEVEL at my grid: with magicEnabled=false and maritime supported, UI(filterCatalogForMagic)
  and worldLaw.allowsInstitution AGREE on all 28 Magic/Exotic rows; the only 5 disagreements are content-profile
  denials (Slave market x2, Slave market district, Kidnapping ring, Human trafficking network). The 23 charter halls
  generated at magicExists:false are the town ADVENTURING row (L1394), which the UI also offers.
- filterServicesForMagic has ZERO production callers -> magicFilter needs no catalog import; filterCatalogForMagic
  reads def.magicLicense off the row it already holds. Ladder lives in src/data/constants.js (zero-import leaf,
  the definition site of getMagicLevel's four tokens).
- P4 needs NO edit in CH-2b: routing the licence through isArcaneInstitution (a CH-2a file) is the one read.

## RESUME POINT 2026-08-24T01:25Z — CH-2a proved, CH-2b built in a probe tree
- CH-2a code done: constants.js ladder, 28 catalog fields, arcaneInstitutionIdentity licence index + isArcaneInstitution routing.
- CH-2a walker tests/lint/magicLicenceCensus.walker.test.js 9/9 TRUE_EXIT 0 (unpiped).
- 9 mutants driven (M1..M9), each convicting; clean controls green both ends; 3 files cmp-restored. A2 vacuity found and fixed (was list==list); M1r/M10/M11 queued.
- CH-2a shift: rosters 0 of 2,520; record hashes 657 of 2,520; golden keys 297 of 525; deep path-template diff = TWO templates, both pure ADDITIONS of magicLicense (573 on $.institutions[*], 350 on $.defenseProfile.institutions.magicDef[*]); zero changed/removed/length/key-order.
- typecheck:ratchet 173/173 EXIT 0; typecheck:domain:strict 1134/1134 EXIT 0; eslint + --fix-dry-run 0 lines, EXIT 0.
- build:edge-shared EXIT 0; 3 sourceHash moved, 2 generatedAt-only; five metas commit as a set.
- validate:packets at base: valid: 169 packets (0 READY), EXIT 0.
- CH-2b built in $SP/laneTECH2-probe: institutionProbability P1/P2(G7)/P3, generationContext P5, magicFilter UI. Walker magicShelfGateCensus 8/8 EXIT 0.
- CH-2b shift vs CH-2a: 1,025 of 2,520 rosters. dead 356, pm0 356, pm20 168, pm50 3, pm80 142. Attribution: pm20 157/168 confined to licensed rows; dead 355/356 carry collateral (a freed row now takes an rng draw it used to skip at assembleInstitutions:268).
- Design B (P5 keeps the unanchored keyword veto) priced: 545 of 2,520.
- ⚠ CHAIR FLAG CORRECTION: `--poolOptions.threads.maxThreads=2` and `--minWorkers` DO NOT EXIST in vitest 4.1.8 (CACError, hard exit 1 over ZERO collected tests). The working cap is `--pool=threads --maxWorkers=2`. Two chain relaunches lost to it.

## RESUME POINT 2026-08-24T02:05Z — MF-CH2A COMMITTED AND HOLDING
⛔ TIP `90a12cd1b` — 4 commits over b2852ccc3, porcelain 0. ITS ONLY REF IS THIS WORKTREE'S DETACHED HEAD.
  b10c4d783 the magic licence declared (3 src + 8 edge artifacts)
  d215c1ee8 the declaration walker (+ mutation-coverage rationale)
  163ac428b the declared golden re-record (297/525; 29c6cc8f -> 0a2309f5)
  90a12cd1b the packet, READY (manifest 170 packets / 1 READY, INDEX row)
Proofs at that tip: walker 9/9 exit 0; 11 mutants driven, all restored cmp-exact, clean controls both ends;
census walked +1/+0/+1/+9/+1 -> 2517/366/2151/20872/5809 (parked PASSED UNMOVED at 366) then REVERTED cmp-exact
(the row rides the packet, §417); tests/property 101 files / 643 tests exit 0; the 8-file census battery
108/108 exit 0 (ruinFilterRoster 92 unmoved, observedShapeReaders green, arcaneClassifierCensus green);
typecheck 173/173 and 1134/1134; eslint + --fix-dry-run empty, exit 0; validate:packets 170 (1 READY) exit 0;
C0 0 on all nine authored files; CLAIM_RE 0 over every added docs/src/test line, regex proved live.
CH-2b now applied on top (7 files) + its mutation-coverage rationale; chain3 running:
mutants -> golden#2 -> census walk -> censuses -> ONE sweep (11 trees UNION 88 consumer files outside them).

## RESUME POINT 2026-08-24T02:40Z — CH-2b built; THE SIXTH SURFACE found by execution
⭐ THE FINDING OF THE LANE. `generationCoherence.js` walks EVERY string in a finished settlement,
including its TAXONOMY fields (`category`, `priorityCategory`, `tags[]`), and asks
`worldLaw.allowsMagicClaim` about each. `textAssertsFunctionalMagic` is a PROSE detector, so the
bare strings 'Magic', 'arcane' and 'magic' read as CLAIMS. The moment a magic-free world lawfully
keeps a Magic-shelf row, the settlement's own `world_law_magic` certification convicts it — for the
name of the shelf it is filed on. Measured: 2 of 5 mundane members FAILED (Castelporta town on
institutions[31].category/tags[0]/priorityCategory + defenseProfile.magicDef[0]; Lidopolis village on
institutions[20].category + defenseProfile.charter[0].category).
⚠ Design B does NOT avoid it — the charter hall (licence none, no arcane keyword) enters under B too
and carries `category: 'Magic'`.
CURE TAKEN, inside a file this car already owns: `allowsMagicClaim` no longer convicts a candidate
whose ENTIRE text is one token of the estate's closed classification vocabulary
(`['magic','magical', ...ARCANE_INST_TAGS]`). A bucket name is not a sentence. `allowsMagicClaim` has
exactly ONE consumer in src/ (generationCoherence.js:369), so this narrows that certification only.
Measured after: all `world_law_magic` rows GREEN; realm census unchanged 139/24/195; GOLDEN UNMOVED
(0 of 525) because the golden grid has no magic-free world. Arm B7b pins it with a four-sentence
positive control.
Also re-recorded by CH-2b: observedShapeReaders corpus meta 1300/8607/14586 -> 1302/8656/14644 and
scalarMeta wizardNews 1567/272 -> 1577/274; mundaneRealmAcceptance RECORDED-CENSUS 134/22/193 ->
139/24/195 plus the MG-4 block in DESIGN_REALM_MAGIC_TOGGLE.md; A7 in CH-2a's walker re-pointed to
the seven licence-none rows.
OSR gate re-proved at this tree: 159 B, c5b67844abe51226..., cmp exit 0 to base, baseline file untouched.
Golden: CH2A fixture -> tree 92 of 525; BASE -> tree 297 of 525 (a strict subset).

## FINAL STATE 2026-08-24T03:05:48Z
TIP = 2ccb20d598c93a263f9bd48a9c86a92264d1a81e   (8 commits over b2852ccc3; porcelain 0)
  MF-CH2A tip (READY, landable alone) = 90a12cd1b0dc47b1b3fbf24bfd47ef27b9c39e30 -- see git log
  MF-CH2B tip (DRAFT, HELD)           = 2ccb20d598c93a263f9bd48a9c86a92264d1a81e
⛔ THE ONLY REF FOR BOTH IS THIS WORKTREE'S DETACHED HEAD -- PIN BEFORE ANY CLEANUP.
