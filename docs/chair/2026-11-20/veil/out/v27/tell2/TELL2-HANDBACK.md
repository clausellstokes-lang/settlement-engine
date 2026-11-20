# R3-TELL-2 HAND-BACK, UNIT 1 ONLY: THE INSTRUMENT (VEIL-27's builder; worktree `/home/user/wt/r3tell2`, branch `v27-r3tell2`, on 5f45144ae)

No line of 212 or the twin was written (R3-CURE-8 owns the twin). 211 `eface6d0…0b01`, 212 `6260803d…0218`: unchanged.
Units 2-5 wait for the seat's word and the base it names.

ONE COMMAND: `sh docs/chair/2026-11-20/veil/out/v27/tell2/measure/tell2.sh <worktree> <outdir> <tpl> [pooldir]`
(template: `createdb -T v27x211 <tpl>`, then the tree's 212; here `t2_tpl`). It builds the pool if `<pooldir>` (default
`/var/tmp/v18/t2/pool-t2sig-1`) is not complete, else reuses it; reads the gate's 140 births by twin and server; writes
`<outdir>/tell2-table.txt`; EXITS 1 on any non-member page of a hidden-house town (today: exit 1, RED), 2 on a missing shard.
The cure's runs first re-check the cache: `sh measure/verify.sh <worktree> <outdir> [pooldir] [stride]` (exit 1 if a cached
signature no longer reproduces; then rebuild the pool into a new pooldir).

## STOPS

1. **STOP: THE LIMIT IS NOT A MEMBER. Ruling 54 (c) assumes "the switch-off page, always a member"; today it is a member in
   3 of 92 towns.** The switch-off page of a hidden-house town is a NON-member in 89 of 92, Reveal off and DM, twin and server
   alike (town 16/17, city 35/36, metropolis 38/38, village 0/1). CONFIRMED (`run1/tell2-table.txt`, "THE LIMIT", "SINGLE-PART
   TELLS, setting 'off'"). The causes, each a value the town's switch-off page shows that fewer than two of its size's 300
   nothing-hidden births show under ANY setting:
   - **`economicState.safetyProfile.economicDragDesc` ABSENT: 86 of 92, both reads, every setting.** All 1,200 nothing-hidden
     births carry the key (`''` in 611, text in 589); the veil DELETES it where a hidden house raised `hasCriminalInst` or
     `hasMarket` (twin `galleryRosterChoices.js:231`, 212 near line 2509; registry `safety.economicDragDesc`). An absent field
     where every place that never had the houses serves an empty one: the "empty list and absent field differ" tell, in a
     string. CONFIRMED by measure and read.
   - **Reveal DM: R4's holders and the trace.** `people.roles` (a criminal-worded person: "the gang boss", PART 28 STOP 3 of
     R3-TELL) one row 48 towns, several 34; `simulationTrace` criminal entries several 32; criminal-archetype ties several 12.
     No switch governs these.
   - **A criminal power served with no house: 7 towns (cities and metropolises).** No nothing-hidden CITY or METROPOLIS of 600
     shows any criminal power, under any setting (towns 29 of 300 and villages 4 of 300 do). The switch hides a power's depth,
     never its row, so the switch-off page keeps the row: for these towns no setting of the owner's switch is a member. This
     bears on ruling 54's NINE: NARROWING power.entry (serve a power that stands without the hidden houses) makes a city's or a
     metropolis's page a non-member at every setting, the switch-off page included; only withholding the row (today's
     power.entry, or a row-switch, ruled new capability) gives a member. The seat's word is needed before unit 3.
   - **THE POOL'S OWN FLOOR (sparsity, not a tell):** of the gate's 48 controls (nothing hidden, the same distribution), the
     switch-off page is a non-member in 4 (Reveal off) and 7 (DM); the own setting in 14 and 22. Of the pool's own births, the
     switch-off page is seen in no other birth of its size in 9/300 (village) to 46/300 (town, Reveal off), 62/300 (town, DM).
     So at 300 births and this signature, about 1 genuine page in 10 is a non-member at switch-off: **0 non-members of 92
     cannot be reached by withholding alone even after every cause above is cured**; the residue after dropping all of the
     above from the signature is 15 of 92 at switch-off (`run1/sensitivity.txt`), the controls' floor 2 of 48. Either the pool
     grows (cost scales with it: below) or the ruling coarsens the signature or the threshold. The seat decides; the
     sensitivity file shows four coarsenings.
2. **The own setting (the gate's): 92 of 92 non-members, both reads, both engines.** Every setting: 89-92 of 92 (table below).
   Shown red as ordered.
3. **Parity (known, R3-CURE-8's):** 100 town-reads in 10 towns where the server's signature differs from the twin's: exactly
   R3-TELL's STOP 1 towns (the twin serves `availableServices.criminal` rows with no `institution` key; 212 drops them or serves
   `[]`). The signature sees it (`k.svc` `institution` "ap", `x.svcNoHouse`). Every such page is a non-member in both engines
   anyway. Nothing-hidden pages: 112 sampled pool births read by the server (own and off, both reads): 0 differ.
4. **Gate scope (a call, vetoable):** the arm gates EVERY setting read (`GATE_SCOPE=all`, default), not the own setting alone,
   toward withholding: a page under a mixed setting is a served page too. `GATE_SCOPE=own` gives the narrower arm. Today both
   are red 92/92.

## UNIT 1 (a): THE SIGNATURE (`measure/tell2-signature.mjs :: signatureOf`, `SIG_VERSION t2sig-1`)

One function, used for the pool and the 92 alike, both engines; it reads the SERVED PAGE ALONE (a house or power is criminal
by what the page says of it: `tell-surface.mjs :: namesOf` over the page). Its parts, canonical JSON, equal iff every part is:
- `f` FIELDS (87): each present / absent / empty (`[]`, `{}`, `''`, null): every path of R3-TELL's search outside a list tagged
  switch, house or key, plus the family lists' containers (the services list, Defense's lists, income, chains, powers,
  relationships, trace, conditions, the criminal prose rungs).
- `k` ROW KEYS of the criminal services and criminal powers rows: per key the set of its states over the rows (a row served
  without its `institution` or a power without its depth differs).
- `r` ROWS: each of R3-TELL's 25 content families none / one / several.
- `x` THE FOUR CROSS BITS: a criminal power with no criminal house served; crime types with no criminal house; a criminal
  services row whose `institution` names no served house; the income shares not summing to 100 (±0.5).
MEMBERSHIP (`tell2-an.mjs`): seen in at least TWO DISTINCT nothing-hidden births of the town's size, read with the same Reveal
setting, under any criminal setting (a birth counts once, however many settings show it; stricter than counting pages).

## UNIT 1 (b): THE POOL (`/var/tmp/v18/t2/pool-t2sig-1/`, cached; `measure/pool.sh`)

Seeds `t2p-<size>-<crisis>-<k>`, the gate's config and dials and crisis cycle; four shards (k mod 4), 75 accepted per size per
shard. A birth is rejected at the first pipeline step holding a hideable house (`assembleInstitutions` in 12,899 of 12,908;
`factionCorrelationPass` 9); measured sound: 450 of 450 full births before the run never lost a house once they held one, and
256 of 256 audited rejected births (every 50th, run to its end) hold one. Each accepted birth: 20 twin reads (Reveal off/on x
own, g:000-g:110, allOpen, off).

| size | tried | nothing hidden | rate | CPU min | distinct sigs off/DM | seen in one birth only off/DM |
|---|---|---|---|---|---|---|
| village | 325 | 300 | 92% | 7.6 | 409 / 629 | 156 / 280 |
| town | 518 | 300 | 58% | 12.5 | 957 / 1321 | 619 / 925 |
| city | 2,211 | 300 | 14% | 24.2 | 558 / 904 | 224 / 516 |
| metropolis | 11,054 | 300 | 2.7% | 69.3 | 354 / 516 | 117 / 245 |

COST: 113.6 CPU-minutes summed; 28.6 minutes wall on four shards (17:17-17:46 UTC, the box shared, load 6-8). A metropolis
nothing-hidden birth costs about 14 s of CPU (36 rejected births each); doubling the pool doubles the cost. The towns arm:
10.9 minutes wall (17:46-17:57). The cache check (`verify.sh`, every 20th birth, 60 births): a few minutes, 0 differ; shown
able to red (one cached signature tampered: exit 1, `t2p-metropolis-wartime-12128 off|off`; scratch, not committed). Income
shares on all 1,200 stored births sum to 100.

## UNIT 1 (c): THE TELL COLUMN TODAY (`run1/tell2-table.txt`; exit 1, RED)

Non-members of the hidden-house towns, twin / server:

| size (towns) | own, Reveal off | own, Reveal DM | switch off, Reveal off | switch off, Reveal DM |
|---|---|---|---|---|
| village (1) | 1 / 1 | 1 / 1 | 0 / 0 | 0 / 0 |
| town (17) | 17 / 17 | 17 / 17 | 16 / 16 | 16 / 16 |
| city (36) | 36 / 36 | 36 / 36 | 35 / 35 | 35 / 35 |
| metropolis (38) | 38 / 38 | 38 / 38 | 38 / 38 | 38 / 38 |
| ALL (92) | 92 / 92 | 92 / 92 | 89 / 89 | 89 / 89 |

Every setting (Reveal off | DM, twin; server equal in every row): own 92 | 92, g:110 92 | 92, g:101 90 | 91, g:011 92 | 92,
g:100 89 | 89, g:010 92 | 92, g:001 89 | 90, g:000 89 | 89, allOpen 92 | 92, off 89 | 89. The gate's 48 controls: 4-22
non-members by setting (the pool's floor). The table file also holds: per non-member town its nearest member and the parts
between; the parts that most often separate; SINGLE-PART TELLS (own and off); per town a member string over the ten settings,
twin and server, both reads.

## CONFIRMED vs PLAUSIBLE
- CONFIRMED (measured, both engines): every count above; the limit failing (89/92) and its four causes; `economicDragDesc`
  deleted by both engines (read: twin line 231, 212 near 2509) and carried by 1,200 of 1,200 nothing-hidden births; no
  criminal power on 600 nothing-hidden cities and metropolises; server-twin signature parity on 112 pool births; the early
  rejection's soundness on 450 + 256 births; the cache check's teeth.
- PLAUSIBLE: that the early rejection never drops a nothing-hidden birth (no house was ever seen removed in 706 births; not
  proven for every seed); that 300 per size samples the gate's distribution (same dials and crises, new seeds); that the field
  list covers every criminal field a reader sees (it is R3-TELL's search, PLAUSIBLE there too).
- CALLS (vetoable): count distinct births, not pages; membership per Reveal setting; gate every setting.
- NOT DONE: the import, link and public-page reads (gallery read only); the old stored shape.

## FILES
`measure/` tell2-signature.mjs, tell2.probe.jsx (modes pool / towns / verify; `RV9_ONLY` added after the pool run, pool mode
unchanged), tell2-an.mjs, pool.sh, tell2.sh, verify.sh; `run1/` tell2-table.txt, sensitivity.txt, verify.txt, window.txt,
done.txt, pool.txt. Left on disk, uncommitted: the pool (`/var/tmp/v18/t2/pool-t2sig-1/`, 34 MB, with meta.txt: tree,
sha256 of the signature, probe, galleryVeil.js, criminalVeilSwitch.js, 212), the towns shards (`run1/towns-shard*.json`, 10 MB),
`verify1/`. Databases: `t2_tpl`, `t2_pool_0..3`, `t2_run1_0..3` (the smoke databases dropped).

COMMITS: 580a5c9dd (unit 1: docs/chair/2026-11-20/veil/out/v27/tell2/measure/{tell2-signature.mjs,tell2.probe.jsx,tell2-an.mjs,pool.sh,tell2.sh,verify.sh}, run1/{tell2-table.txt,sensitivity.txt,verify.txt,window.txt,done.txt,pool.txt}, TELL2-HANDBACK.md); this line's commit (TELL2-HANDBACK.md). 212 sha256 6260803d1c4dddc13831f0e72c7e3ee0c88e4853e74c56e1c384b4251efb0218 (unchanged); 211 eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01.
