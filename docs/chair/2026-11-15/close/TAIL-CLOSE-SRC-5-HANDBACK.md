# TAIL-CLOSE-SRC-5 — hand-back

Branch `lane/tail-close-src-2026-11-15`, from TAIL-CLOSE-SRC-4's tip `973b20dc2` (origin's tip at my start; the main
checkout's local branch is stale at `5d99786c5` and was not touched). A `git worktree` in my scratchpad, its own `npm ci`.
The one red: `tests/lint/ruinFilterRoster.walker.test.js` naming `src/domain/display/defenseDisplay.js`. Under the chair's
ruling SR5. Two commits, no row added to the walker, no import added only to satisfy it.

| Commit | What | Behaviour |
|---|---|---|
| `ac8d4209` | SR5 (a): `ringWithoutSeat`'s house lookup moved verbatim to `facts/criminalStructureKey.js :: ringHousesOf` | none (a verbatim move) |
| `9cade66c` | SR5 (b): the defence buckets' reads drop an entry whose house stands ruined (`isLiveInstitution` / `liveInstitutions`) | only where a ruin stands; no census town moves |

## What each read was, and what was done

**(a) `ringWithoutSeat`'s lookup of a house by name: a crime fact, so I moved it.** It asks whether a thieves' guild,
a "Front businesses" or an "Underground city" house is on the roster. Those are the same rungs of the name ladder that make
`criminalStructureKeyOf` say ORGANIZED, and `ringWithoutSeat` only runs on that key. So it is the key's own question. I
moved it verbatim beside the key, into `ringHousesOf`, where it reads the roster the key reads. The ruling offered two
ways, and I took the move rather than routing the lookup through `liveInstitutions` in the display, for one reason. If the
key read every house and the note read only standing ones, then for a town with a ruined "Front businesses" house and no
criminal seat, the key would still say organized while the note found no house. The false line "One criminal ring decides
what crime is allowed here" that TAIL-DEFECON-D cured would print again. Whether a ruined criminal house should key the
structure at all is already named for the owner on the leaf's exempt row. Answering it in the note alone would answer it
in two different ways. The leaf's exempt row now names `ringHousesOf`, still as a name-lookup, so the walker's reason
categories are unchanged.

**(b) The defence buckets (`arcaneDefenseOf`, `deriveArmedForces`): they decide what stands.** They are not a display
row. Their entries are `{ name, desc, source }` and carry no state of their own. `defenseProfile.institutions` is the
generation-time snapshot. A ruin replaces its roster row, so the ruin's stamp never reaches the bucket. What reads them:
- the Defense tab counts `arcaneDefenseOf` ("N arcane") and uses it to decide whether any force stands at all
  (`hasAnyForce`);
- the PDF's defence chapter and the Foundry journal list `deriveArmedForces` as the town's armed forces.

A count, a presence and a list of what the town fields all decide what stands. So both reads now go through the roster's
predicate, and no exempt row was used. An entry is dropped when:
- the entry itself is not live; or
- the current roster holds its name only on rows that are not live.

An entry whose name the roster does not hold at all (a later rename) is kept: only a ruin moves the reading, and the
snapshot is not re-derived. When nothing falls, the same array is returned.

The file is compliant on its own reads again (the roster import is used by the bucket reads). The walker's count stays
at 111. The walker's two comments that went stale are corrected in place: the "Its other reads … stay a display" note
and the leaf's exempt reason. The walker's verdict logic is untouched.

## The measure

- **Births** (CENSUS-3's `births.mjs` over its 720 seeds through RECORD-MEASURE-1's `births-only.sh`, both `git archive`d;
  each commit `git archive`d): decompressed corpus sha256/16 `48ac518fa4ff27fd` at the base, at `ac8d4209` and at
  `9cade66c`. This is SRC-4's figure at `4956e1731`. **Byte-identical.**
- **The Defense tab's twelve one-argument readers** (every function export of `defenseDisplay.js` called with the record
  alone, over the 720 base records, JSON-hashed): `2618f6adfd078aa0` at all three. This is my own hashing of the same
  twelve readers; SRC-4's `4f7ba7261d8ecc12` came from a script not on the branch. Per town: 0 of 720 differ.
  **Byte-identical.**
- **The ruin probe** (scratch only): for each of the 720 towns, every roster row held in a bucket was replaced the way a
  ruin replaces it. Then I counted the towns whose `deriveArmedForces` still lists a ruined house. Of the 480 towns that
  hold a bucket house, the count was 480 at the base and at `ac8d4209`, and **0 at `9cade66c`.**
- **No declared move.** No census town moves because none carries a ruin at birth. The cure acts only on a pulsed or
  edited save that holds a ruined defence house, which the probe stands in for. Nothing goes on the owner's veto list from
  this seat, beyond SR5 itself being vetoable.
- **Walkers alone, at `9cade66c`:** `ruinFilterRoster.walker` 12 of 12 (red at base: 1 failed); `factLayers.walker` 15 of
  15; `defenceFactReaders.walker` 22 of 22. **Architecture alone:** `layerBoundaries` 8 of 8 and `engineCoreLazyEdge` 3
  of 3. The new edges are display → institutions/institutionRoster.js (an edge this file held before SR1) and display →
  the crime leaf it already imported. No cycle, no lazy pull.
- **The 52 test files that name `defenseDisplay`:** 565 tests each side. At the base 1 file was red (the walker); at
  `9cade66c` 0 were red. Mine is cured and none was added.
- **eslint** on the three touched source/test files: 0. **Type checks**, message-normalised, base against `9cade66c`:
  `tsconfig.full.json` 167 -> 167 and `tsconfig.domain-strict.json` 1898 -> 1898, 0 introduced on both.

## A gap reported, not chased (outside this red's scope)

`src/components/new/tabs/DefenseTab.jsx` reads the snapshot buckets itself (`inst.garrison`/`militia`/`watch`/
`mercenary`/`charter`, about lines 294–298): its force count, its cards and `hasAnyForce` all come from there. Only its
arcane group goes through `arcaneDefenseOf`. So on the screen, a ruined garrison or wall still shows; the PDF and the
journal no longer show one. The component sits outside the walker's `src/domain` root. The cure would be for the tab to
read `deriveArmedForces`, and that is the chair's to dispatch. `display/institutionProfile.js` keeps its exempt display row
on the same snapshot, and I did not look at it.
