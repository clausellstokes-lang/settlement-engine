# COHERENCE-VEIL — hand-back, part 23: the twenty-second seat (V10-2 merged; R3 and R4 by builders in parallel; R5 to R7; DOORS; E)

Seat: VEIL-22, branch `lane/veil-22-2026-11-20`. Assignment: `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/VEIL-22.txt` (it binds VEIL-21.txt whole, as amended by PART 22), read at 25947602c
(the seventh chair is session_019yED1SUxGVHyjQnoqoFvQ8). Every database is a scratch native PostgreSQL 16.15 cluster in
this container (`/var/tmp/v18pg`, locale C.UTF-8, trust auth, unix socket `/var/tmp/rv7` only, `listen_addresses = ''`,
`fsync = off`) or in-process pglite. No hosted database, no production credential, no `supabase` command, no deploy, no
pull request. Written 06:18 UTC (`date -u`).

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The rulings this seat works to
VEIL-21.txt's "RULINGS IN FORCE", VEIL-22.txt's "RULINGS SINCE", PART 22 sections 0a, 5 to 8. Since the hand-over:
- **VR42 (05:10 UTC):** a criminal-worded GOVERNING body is tier 2 (the town's public nature); for `power.entry` the
  governing power's row is never removed while the government's name stays; R3's born test holds it. `safety.economicDragDesc`
  is R3's row (by attribution); its prose copy `prose.shadowEconomy` R5's.
- **THE LANE IS YOURS at 463d0362c (05:52 UTC).** Owed from R2: the gate through the party link and master's stored shape
  (before R3 merges); the `safety.blackMarketCapture` page column ('re-derive' unmarked, 'not drawn' otherwise) CONFIRMED on
  one condition to prove (the page knows it from the served signal alone; under a given signal its absence is the same for
  every town); V10-2 at the first stage boundary; R6 prepared at b47b7bbdb, not merged.
- **06:10 UTC:** the reader's cold read of R2: R2 HOLDS (restamp 96 of 96 per shape; the black market's share absent on
  every marked read, equal to the owner's on unmarked; raw measures absent). **VR44 (HIGH, for the doors' merge):** the
  tile's stability is the BAND WORD alone on every non-owner read, marked or unmarked. "DOORS 3e1115c81" handed back
  PARTIAL (`lane/veil-doors-3-2026-11-20`): merge `--no-ff` after R3 and R4, every hunk read, the two inside
  `import_gallery_dossier` hardest; then ONE builder, ONE commit, red first: VR44, VR41's two narrowings (1,393 lived
  entries, 42 -> 0 withheld, a born arm), the reader's repros and the acceptance run at the merged tree; "DOORS-IN <commit>"
  with 212's sha256. VR43's one-row count goes into the deploy note.

## 1. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` (proved at the cut) |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` (proved at the cut) |
| 212 at the cut 463d0362c and after V10-2 (d136940c3) | `05b915ab119e2f9766a3cea47fdd9ec023fc2155f588f1b4127ea5b347118f10` |
| 212's rollback at the cut | `1454f8f3fa53943130a22d412152e0eddcf3e05684b3cf01f62e77c069e2a66e` |

## 2. The cut, the instruments, V10-2

THE INSTRUMENTS RE-MADE in this container (PART 21 section 6, PART 20 section 4): the cluster; `pg@8.13.1` in
`/var/tmp/v18/pgmod`; the readers' library (`git archive 72a3bb24f` REVIEW-VEIL-6/-7/-8, `origin/lane/review-veil-9-2026-11-19`
REVIEW-VEIL-9) in `/var/tmp/v18/lib`; the probes flat in `/var/tmp/v18/rv9`, three imports re-pointed; R1's runner and
tally in `/var/tmp/v18/`; master `/home/user/wt/master` (detached at db832c892, `node_modules` by `cp -al`). Dry run at
0d28ccf19 (before the hand-over, nothing written): registry `--check` exit 0, walker 11 of 11, render-twice 4 of 4,
inversion 4 of 4, acceptance EXIT 0.
THE CUT: `lane/veil-22-2026-11-20` at **463d0362c** (VEIL-21's final tip, read back from origin).
V10-2: `git merge --no-ff origin/lane/veil-v102-2026-11-20` (cabdfaa69), no conflict: **d136940c3**. Read line by line:
galleryVeil.js's hunk in `curateModelFor` only (VR34: every copy of a card; the house each person belongs to as the applier
reads it); criminalVeilSwitch.js narrows the switch to the addresses the Curate model draws; CurateMode.jsx hands the model
in; one manifest row. The commit hook's eslint left V10-2's files byte-equal to its tip.
AT d136940c3, executed (`out/v22/`): registry `--check` exit 0; walker 11 of 11; V10-2's three test files, VR17's walker and
the eight veil guard files: **176 of 177** (`v102-merged-guards-at-d136940c3.txt`, 1,397 s). THE ONE RED, ATTRIBUTED:
`criminalVeilSwitch.test.js` VS1 (b): **21 lines, every one "safety blackMarketCapture"** (28 lines on 12 births before
V10-2; the (c) lines are gone): V10-2's test asserts the family content of the unveiled projection reaches the visitor; R2
withholds `blackMarketCapture` on every read (as it does `weight`, which the test already serves as withheld). A test
pinning the behaviour before R2: aligned by the test-only builder (R6's re-cut), not by loosening.

## 3. The list, as it stands

| Item | State |
|---|---|
| V10-2 | MERGED d136940c3 (section 2) |
| R3 (roster choices) | BUILDER STARTED (`/home/user/wt/r3`, `v22-r3`, from d136940c3; VR42 and the economicDragDesc measure in its launch) |
| R4 (the people) | BUILDER STARTED (`/home/user/wt/r4`, `v22-r4`, from d136940c3; `cast.roles[].id` re-keyed before R2's step) |
| R2's owed gate: the link and master's shape | DONE at d136940c3 (section 4) |
| R6 | prepared at b47b7bbdb: re-cut by a test-only builder (KNOWN_TIER1 shrinks: R2 withholds `defence.scores.internal`; align or retire `rosterChoiceInversion`; VS1 (b) aligned; the blackMarketCapture condition measured) |
| R5, R7 | after R3, after R6 |
| DOORS 3e1115c81 | after R3 and R4, with its builder (section 0) |
| the stored figures, E | not started |

## 4. R2's owed gate, through the server (d136940c3; the committed export; the reader's differ, R1's runner, 2 shards)

| Read | Before R2 (R1's committed export, `out/v20/`) | At d136940c3 (`out/v22/gate/`) |
|---|---|---|
| New shape, gallery (VEIL-21, at 7591663b4) | UNREGISTERED 131 (137 at 0d28ccf19) | 42 (`out/v21/seat-r2/`) |
| New shape, party link (N=2) | 125 | **registered 13, diffuse 21, rng-only 13, UNREGISTERED 38** (`gate-link-new-at-d136940c3.txt`) |
| Master's shape, gallery (N=1, master's generator db832c892, chain 203+211+212) | 145 | **registered 13, diffuse 15, rng-only 10, UNREGISTERED 66** (`gate-gallery-master-at-d136940c3.txt`) |
| Master's shape, link (N=1) | 132 | **registered 13, diffuse 15, rng-only 10, UNREGISTERED 55** (`gate-link-master-at-d136940c3.txt`) |

The runner's own invocation: `gate-queue.sh` beside them. THE UNION of the three readings' unregistered paths: 96 paths,
each matched against EVERY registry row (built or not): R4's holders 52, R5's composed 22, R3's roster choices 12, second
homes 2, apply 2, and **SIX WITH NO ROW AT ALL**: `publicProse.blocks.economy:{daily_life,resources,services}.{incomeMix,
criminalLine}` (the three alias blocks of `economy:economics`, whose own `incomeMix`/`criminalLine` ARE registered): on 30 of
30 reads the served town LACKS the key its house-free counterfactual carries (`{"@":"economy:economics"}`, `null`), and
removing an ordinary house never moves it (C empty). Unregistered since R1 (present in the pre-R2 gate too). To the chair;
proposed host: R5 (the composed prose, beside `prose.incomeWeight.alias`).
The master-only unregistered paths are the people (`npcs[]`, `factions[].members[]`, `prominentRelationship`,
`pressureSentence`, the levers' holders: R4), `powerStructure.factionRelationships[].direction` (R3), the cast roles (R4),
`economicState.incomeSources[].desc` and `compound.inst.hasMercenary` (registered, unbuilt).
