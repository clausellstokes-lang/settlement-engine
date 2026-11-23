# VEIL-V102 — hand-back: a switch sets only what a hand can see and undo on that record (the reader's V10-2)

Seat: VEIL-V102 (the seventh chair, session_019yED1SUxGVHyjQnoqoFvQ8), branch `lane/veil-v102-2026-11-20`, cut from
origin/lane/veil-vr17-2026-11-20 at **81dd06d7e** (read back from origin first: equal). Assignment:
`lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-V102.txt` (read at ea322fc2b). Every database an
in-process pglite (the chain 001..212 on disk); no hosted database, no production credential, no `supabase` command, no
deploy, no pull request. Written 2026-11-20T03:36Z (read from `date -u`).

**RULING VR34** (the seventh chair; vetoable by the owner): a switch sets only what a hand can see and undo on that record.
The chair's later words, both followed: ITEM 0 (02:29 UTC, the merge of VEIL-19's B, C, D and VS1's (b), (c)) and THE
CONDITION (02:41 UTC: an eye the screen newly offers starts at what the server serves today for an untouched share).

Commits: **97e51d7f6** (the cure, its tests, the born guard) · **4b33d1617** (merge of origin/lane/veil-19-2026-11-20 at
e62fabb2e, by the chair's word; no conflict) · **5febd66c9** (item 0's two re-keys; arm (F)) · this hand-back.

## 1. The first act, measured at 81dd06d7e (ONE table)

36 born towns (the reader's seeds and dials), Reveal DM off and on, served by pglite; `measure/first-act.probe.jsx`,
`out/first-act-new.json` (this tree's generator) and `out/first-act-master.json` (a git archive of origin/master
db832c892's generator: master's stored shape). The reader's figures reproduced EXACTLY on the new shape.

| Class | Show-all writes no screen offers (new / master) | The screen offered the eye at the base | What lies under it | Served by Show-all, not by any hand | Now |
|---|---|---|---|---|---|
| a house's `people` | 216 / 216 | master's shape only, where `npc.institution` is a STRING equal to the house's name; never in the new shape (an object) | new: 108 of 216 houses have people by the applier's identity (`npcHouseOf`), Reveal-DM reads only; master as born: 0 (npc.institution absent 561 / string 31, none naming a criminal house) | new: Reveal-DM gallery `npcs[].institution` = {key, kind, title, family, veiled} x108 | drawn by identity in both shapes where someone is the house's person; the switch writes it there only |
| a house's `services` | 52 / 50 | both shapes, where the house has rows | nothing (no rows) | none (inert) | not written |
| a power's `members` | 16 / 16 | NEITHER: the screen read `powerStructure.factions` only | new: nothing; master: the roster on the top-level `factions[]` (8 of 16, Reveal DM) | master: Reveal-DM gallery `factions[].members` x8 | drawn from every copy of the power; written where it governs data |
| a power's `goals` | 16 / 16 | neither | nothing on either list in either shape | none (inert) | not written |
| a power's `conflicts` | 16 / 16 | neither | nothing | none (inert) | not written |

**The surprise, told to the chair at 02:33 UTC:** the second served path in master's shape (the roster on the top-level
`factions[]`), and, wider than the switch, that on master's shape with Reveal DM the screen drew NO Members eye on ANY
power (98 power copies over 20 towns, criminal or not: `measure/lists.probe.jsx`, `out/lists-master.json`); the new shape
has no card or value on a later list only (`out/lists-new.json`). The reader's master output showed the members path on
four reads; this run shows it on the Reveal-DM gallery read only. The chair approved the cure at 02:41.

## 2. The mechanism, and why

- **The screen, by identity with the applier** (`src/domain/display/galleryVeil.js :: curateModelFor`, the only hunk in
  that file; its doc comment says so): each card's eyes read EVERY copy of the card the applier reaches (`cardsOf`, grouped
  by id, the kind's first list first), and a house's People eye reads the house each person belongs to as the applier does
  (`npcHouseOf`: the people car's `{ kind: 'house', key }`, else master's string), on every copy of every person. So an eye
  is drawn exactly where `applyVeil` would remove something under it, in both stored shapes.
- **The switch's list from the same model** (`src/domain/display/criminalVeilSwitch.js`): `offeredAddressesOf(model)` reads
  the model's groupings, master switches, whole-house eyes and depth eyes (what CurateMode draws; independent of the
  draft); a part is a family candidate (the old enumeration, unchanged) that the model draws. `criminalPartsOf`,
  `criminalSwitchStateOf`, `setCriminalVeil`, `flipCriminalVeil` take the model as a last argument; WITHOUT it the switch
  covers nothing (reads 'none', writes nothing): it never writes what it cannot show. A click also drops any family delta
  on an address the screen does not draw (an earlier Show-all's stale write), both directions.
- **CurateMode** (`src/components/gallery/CurateMode.jsx`) hands the switch the model its sections are drawn from.
- **Why this shape:** (a) the switch and the screen read ONE model, so they cannot drift; (b) the screen's fault was the
  stored shape (a string test on an object; one list of two), cured by the applier's own predicates, not a new rule;
  (c) both directions follow: Hide shuts only drawn eyes, Show opens only drawn eyes. Defaults (`defaultVeilFor`), the
  applier, the server (211, 212) and every stored field are untouched: the screen only LEARNS eyes.
- **VR34 (d), a stored veil from an earlier Show-all:** an address no hand can reach governs nothing on that record
  (arm (D): planted, the served bytes are unchanged), so it is not served. If data later appears under it in a live share,
  the screen then draws the eye with its stored state ("Shown, by you"): seen and undoable. The next click of the switch
  drops it. CAN ONE EXIST OUTSIDE THIS LANE: no. VS1 (c2db1bda2) is not an ancestor of origin/master
  (`git merge-base --is-ancestor` exit 1), so no deployed client ever wrote one; only a lane build's local database could
  hold one.

## 3. Red and green, with counts (every run to a file, read by its count lines)

| Run | At | Result |
|---|---|---|
| the three files (born guard, the switch's domain test, the component test) | the base's bytes (git archive of 81dd06d7e, the tests copied in) | **RED: 18 failed, 12 passed (30)**; born arms (A) 108 unreachable writes, (B) 38 gallery + 38 twin served differences (`out/red-at-81dd06d7e.txt`) |
| the same | the merged base (the merge with this seat's three source files at e62fabb2e's bytes) | **RED: 18 failed, 12 passed (30)**, the same arms (`out/red-at-e62fabb2e-merge.txt`) |
| the same | the tip | **GREEN: 30 passed (30)** (`out/green-tip.txt`) |
| ITEM 0: VS1 acceptance after the merge | 4b33d1617 | the 8 reds reproduced (vs-city-1, vs-metropolis-1, plain and dm, (b) "income 1" and (c)) (`out/item0-red-after-merge.txt`); re-keyed: 9 passed (9) (`out/item0-green.txt`) |
| the governing files (every test file naming criminalVeilSwitch, CurateMode or curateModelFor outside tests/security, + the mutation manifest's test) | the tip | 4 files, **82 passed (82)** (`out/gates2/governing.txt`) |
| `tests/security` whole | the tip | **158 files passed, 1 skipped; 2013 tests passed, 1 skipped** (`out/gates2/security.txt`) |
| `npm run typecheck:ratchet` / `typecheck:domain:strict` / `lint` | the tip | exit 0 (167, ceiling 167) / exit 0 (1113, ceiling 1113) / exit 0 (0 errors, 38 warnings, none in a file this seat touched) |
| 211 and its rollback, sha256 | 97e51d7f6 and the tip | `eface6d0…0be01` / `ce8474ff…49712f`, unchanged; `supabase/` at the tip equals e62fabb2e's (212 `fec111c2…acea3`, down `45da09eb…30a1c9`: VEIL-19's) |

**The born guard** (`tests/security/criminalSwitchHandReach.pglite.test.js`, a `pglite-executed` row entered in
`scripts/mutation-coverage-manifest.json`): six towns, one per tier (thorp to metropolis), both stored shapes (master's:
ties by `npc1Id`/`npc2Id`, a person's house as a string, the rosters on the top-level `factions[]`, read from master's own
generator, `out/shape-master.json`), Reveal DM off and on, read by `get_gallery_dossier` and `get_unlisted_dossier` as an
anonymous visitor, and the client twin. At the tip: (A) 1062 writes, all drawn; (B), (C) 96 served comparisons equal;
(D) 16 planted unreachable addresses named and unserved; (E) 10 people sent with their house's People eye open, 10 houses
hidden whole with the eye open sending nothing of their people; (F) below. Premise corrected in flight: every born town
carries the family's three groupings, so the thorp is a groupings-only case, not "none" (`measure/thorp.probe.jsx`).

**Item 0, the two re-keys.** MEASURED FIRST: the veil IS idempotent on a served copy where nothing more is withheld,
`applyVeil(V, R) = V` on 72 of 72 copies (`measure/idempotence.probe.jsx`, `out/item0-idempotence.json`). (c) differed
only on the SHOW copy: the test's own second veil withholds the criminal income row the click showed and re-derives the
shares from the stored percentages (the served copy has lost `weight`), e.g. vs-city-1 `26,10,…,3` from weight against
`24,11,…,4` from percentages. The test withholds more: not a fault of D. (b) re-keyed by identity: the served income row
is the projection's row without `weight`, and carries no `weight`. (c) re-keyed: the hide copy and the copy before the
click byte-equal after the second veil (as before); the show copy equal but for the income shares, compared apart: it
carries the projection's own shares.

## 4. What a visitor's bytes held, before and after

On a share where the owner pressed Show all: BEFORE, the Reveal-DM gallery read sent which people are a criminal house's
people (`npcs[].institution`, the house record) in the new shape, and a criminal power's roster (`factions[].members`,
whole person records) in master's, which no hand could see on the screen or shut again. AFTER: Show all writes those
addresses only where the screen draws the eye, so SERVED(Show all) = SERVED(every drawn criminal eye opened by hand) on
every case. With the People eye opened by hand and the house shown, each of its people carries exactly the house record
the projection carried (`{ kind, key, title, family, veiled }`), nothing more; with the house hidden whole, no person on
any list names it. **For a share nobody touched, nothing changes** (the chair's condition, arm (F)): marked with no delta
and unmarked, gallery and link, both shapes, Reveal DM off and on: 96 of 96 served documents byte-identical (sha256)
between the merged base and the tip, and each of 529 People and Members eyes (487 open by default) reads hidden exactly
where the untouched bytes carry nothing under it.

## 5. What the Curate screen shows now that it did not

A criminal house's **People** eye ("Its people on their cards"), where someone is its person, in the people car's shape
(it never appeared there before). On master's stored shape with Reveal DM, a **Members** eye on every power whose roster
sits on the top-level `factions[]` (criminal or not), and the **Powers' members** master switch. Not drawn any more by
the switch's hand: `services`, `goals`, `conflicts`, `members` where nothing lies under them.

## 6. The stored figures (not re-frozen; measured at the merged base and the tip, `out/figures/`)

- **The lighting census**: MOVED by this seat, files 3709 -> 3710 (+1: the born guard; the frozen figure is 3705, so
  the merged base was already +4, not this seat's). Titles: +14 in the born guard (the chain, 6 towns x 2 shapes, the arms),
  +4 in the domain test, +2 in the component test (PLAUSIBLE: counted from the files; the door was not run).
- **The writers' reach**: `check-writer-reach.mjs` exit 0 at both; its walker red at both with the same message: not moved.
- **The wiring census**: regenerated in both trees, byte-identical (`cmp` exit 0): not moved.
- **The tuning inventory**: 76 of 76 in the checkout; no top-level named numeric constant added in `src/`.
- Not on the list, measured: the observed-shape ratchet and the presumed-things walker red at both with IDENTICAL
  figures (2,215 reads / 1,553 identities against the frozen 2,214 / 1,552; 45 rows): not moved.
- The mutation manifest: +1 row, this seat's own.

## 7. Executed or plausible

EXECUTED (logs read by their count lines): every row of sections 1 and 3; the base-against-tip readings of section 6;
the hash equality of section 4; the ancestry of VS1. PLAUSIBLE: the lighting census's title figures (the door not run);
that no PRODUCTION row carries a stale Show-all (inferred from VS1 never reaching master; production not read). That a
stored stale delta stays unserved until data appears under it, then shows on the screen, follows from the identity
(executed for the planted case, not for a live share that changes over time).
