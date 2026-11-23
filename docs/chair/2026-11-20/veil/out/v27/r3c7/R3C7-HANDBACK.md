# R3-CURE-7 — hand-back (VEIL-27's builder; ruling 53, conditions 1 and 2)

Worktree `/home/user/wt/r3c7`, branch `v27-r3c7`, base 72913fc86. Not pushed; no pull request. Written 2026-11-20, ~16:20 UTC.

## STOPS

**None.** The tooth is GREEN at the tip, so the brief's red-first STOP did not fire and the fold is not forced ahead of
R3-TELL by this arm. One thing the seat should read before taking that verdict, because it is a judgment call:

- **The first run was red (6 of 6 faults), and the instrument caused it, not the engines** (`tooth-first.txt`,
  `tooth-first.full.txt`). Every fault was on the **campaign map's member** read, with Reveal DM on. In each one the
  server served the person with no `memberships` key, and the twin served `memberships`. Cause: 211 ::
  `get_gallery_map` calls `_gallery_veil(pub.j, s.gallery_member_overrides, false)`, so the map member is **always
  read with Reveal DM OFF**, whatever the share says. My first arm compared it with the Reveal-ON twin. The same map
  reads with Reveal DM off matched the twin in that run. The arm now compares the map read with the Reveal-off twin
  (`twinOf(false)`). I did not drop the map from the comparison. The brief names "gallery, link/import as the file
  reads, the twin"; the map is kept as an extra read. Reading this as an instrument fault is my call. The evidence is
  that every fault was a Reveal-on map read and every Reveal-off map read matched. A seat that reads it otherwise
  should treat `tooth-first.txt` as the red.

## Unit 1: THE TOOTH (condition 1)

The plants: `HAND_IDS` (seed `hand-ids`, "Tollhaven") gets three more people.

| person | id | goal | memberships |
|---|---|---|---|
| Tam Verity | `true` | aimed at and naming the guild | `{power: guild, role: member}`, `{power: 'Fishers', role: member}` (shown) |
| Fay Falsen | `false` | aimed at and naming the guild | `{power: guild, role: lookout}`, `{power: 'Fishers', role: member}` (shown) |
| Em Blank | `""` | aimed at and naming the guild | `{power: guild, role: runner}`, `{power: 'Fishers', role: member, id: guild}` |

**Why Em's second membership is there.** With only the brief's minimum plants (a naming goal and a guild membership),
the arm could not red under the brief's own scratch. A boolean id read as '' falls to the no-id rule, which is
containment against every pre-sweep person. That rule takes the same goal and membership remnants that the id-as-text
rule takes, because the sweep only deletes keys, so each remnant is held by its own pre-sweep copy. Em's Fishers
membership is recorded under the guild's id. The sweep drops it whole. In `pub` it names the guild and holds
`{power: 'Fishers', role: member}`. So a containment judgment takes the boolean people's shown Fishers membership,
while an id-as-text judgment keeps it. That gives the scratch something to red on.

**The arm.** `R3-CURE-7 (ruling 53, condition 1: THE TOOTH)`, over the four `hand-ids` reads: `open` and `openM`, each
with Reveal DM off and on. Every served doc is checked: gallery, link, import, map member, and the twin.
- (a) **No husk:** none of the three keeps a goal, and memberships equal the kept set: the Fishers membership for
  Tam and Fay, nothing for Em.
- (b) **Each server read's copy of each person equals the twin's,** by name and with keys in canonical order. Presence
  is compared too (an absent person counts as `[]`). The map read is compared with the Reveal-off twin.

Results:
- **Tooth-first at the tip (first instrument): RED 1 of 24 tests (6 faults), all at the map.** See STOPS.
  `tooth-first.txt`.
- **Tooth at the tip, corrected instrument: GREEN.** It ran inside the whole born file (`born-green.txt`, 25 of 25). It
  judged 18 people-reads and compared 42 person-reads with the twin (`born-green-measures.txt` line 24). The engines
  were unchanged: `src/` and `supabase/` are identical to 72913fc86.
- **Able to red, shown by a scratch change that was never committed** (`tooth-scratch-red.txt`, which has the diff and
  the run). `idKeyOf` was made to read a boolean as '' (as `idText` does). Result: **RED, 1 failed (12 faults).**
  - 8 are the twin-vs-server comparison: Tam and Fay, on gallery and import, `open` and `openM`, Reveal DM on. The
    server keeps the Fishers membership and the twin does not.
  - 4 are (a)'s kept membership, on the twin.
  - Afterwards the twin was restored from a backup. Its sha256 `b2dfbdc1…1b0f` equals the tip's, and `git status`
    shows it clean.

## Unit 2: THE WALKER (condition 2)

It is in the same test file, in its own top-level `describe` that needs no database (it runs in under a second without
the pglite boot). There is no new file, so no mutation-manifest question arises.
- **What it finds:** every occurrence in 212 of the shape `coalesce(case when jsonb_typeof(<x> -> 'id') <body> end, '')`.
  The body is lazy and open, so a drifted site is still found and compared rather than missed.
- **How it normalizes:** whitespace is collapsed and `<x>` is replaced.
- **What it asserts:** exactly **6** sites and one text, `coalesce(case when jsonb_typeof(<x> -> 'id') in ('string',
  'number', 'boolean') then <x> ->> 'id' end, '')`.
- **Its message** names ruling 53 and says that the fold owed in R4-CURE-2 retires it.

The six sites at the tip are on line 2406 (`n`, `pq`, `n`) and line 2415 (`n`, `pq`, `n`).

- **Green:** 6 sites, 1 text (`born-green-measures.txt` line 105).
- **Scratch red** (`walker-scratch-red.txt`): 212 was drifted at one site (`pq`, line 2406: `'boolean'` dropped).
  Result: **RED, 1 failed**. It still found 6 sites but 2 texts, and the drifted text is named. 212 was then restored
  from a backup, and its sha256 `6260803d…0218` was re-read.

## Unit 3: GREEN

| run | result | file |
|---|---|---|
| R3's born test, whole (`galleryRosterChoices.pglite.test.js`) | **25 of 25** (23 before plus the tooth and the walker) | `born-green.txt`, `born-green.full.txt`, `born-green-measures.txt` |
| `galleryServerVeil.pglite.test.js` | **18 of 18** | `green-galleryServerVeil.txt` |
| `galleryVeilHandRows.pglite.test.js` | **25 of 25** (with the line above, 43 of 43, as at R3-CURE-6) | `green-galleryVeilHandRows.txt` |
| eslint on the touched file | **exit 0** | `eslint.txt` |
| hashes | 211 `eface6d0…0b01`, rollback `ce8474ff…712f`; **212 `6260803d1c4dddc13831f0e72c7e3ee0c88e4853e74c56e1c384b4251efb0218`, UNCHANGED**; 212 rollback `8cbd7d1c…d5b0` | `hashes.txt` |

The existing R3-CURE-5 arm still judges 12 people-reads with the widened `HAND_IDS`; Ott is still `npcs[2]`. The husk
class and the twin-at-R3-paths arms are green with the new people.

Every run was a single file with `--maxWorkers=1`, through `scripts/gate-tail.sh`, with the GIT_* variables unset.

## CONFIRMED vs PLAUSIBLE

- **CONFIRMED (executed):** the tooth is green at the tip and reds under the boolean-as-'' scratch, on the
  twin-vs-server comparison. The walker counts 6 sites and 1 text, and reds under a one-site drift. 212, 211 and the
  twin are byte-unchanged. The born file, server-veil and hand-rows runs are green.
- **CONFIRMED:** the first run's red was the Reveal-on twin compared with the map, which 211 always reads with
  Reveal off (the third argument `false` at 211 `get_gallery_map`; and in that run every Reveal-off map read matched).
- **PLAUSIBLE, not executed:** the tooth would also red under a scratch on 212's side, for example one `n ->> 'id'`
  site reading a boolean as ''. That was not run; the brief asked only for the twin-side scratch.

## Commits

d166aa955 (`tests/security/galleryRosterChoices.pglite.test.js`); the docs commit after it
(`docs/chair/2026-11-20/veil/out/v27/r3c7/*`, this file included). 212 sha256 `6260803d1c4dddc13831f0e72c7e3ee0c88e4853e74c56e1c384b4251efb0218`.
