# Town cartography / MF-MP1 — the property-line layer: the parcel ring was computed, validated and dropped on the floor, and a hovered building now shows the ground it stands on

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `567030f1d379947b9580a91613b6f09294f51ec0`
  ⚠ Read with `git rev-parse` at this lane's opening, never extended from a quoted prefix
  (§381's fabricated-SHA law) and never taken from the dispatch text. It matched the slot
  card's stamp exactly, which is this lane's first recorded act.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
  ⛔ RE-STAMPED BY THE TE-STACK-3 LANDING (2026-08-24). The two sentences above describe the
  BUILD lane and they were true then: the member built on `5055990a38a281b5a5f63648c74e65c0837de7ef` and the
  slot card matched at that moment. They no longer describe the base on the line above. The
  slot moved TWICE under this member — to `7009f115` (MF-CH2A + MF-UC5) and then to
  `567030f1` (MF-WEB8 + MF-CG1b) — so a REBASE WAS OWED, was performed onto car 1 of a
  two-car stack, and the verified base is re-stamped here and in `PACKET_MANIFEST.json`.
  The §410 flip is executed in this act across all four places (this header, the verified
  base, the manifest row and the index cell), and the §417 census row this member deferred
  is PAID in the same act, walked at the stacked tree as a SUM OF DELTAS with car 1 (§420).
- **Depends on:** nothing. TC-3b's parcel ring, TC-5a's painter and TC-5b-ii's mount are all
  LANDED at this base; this member consumes them and builds no new geometry.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file
  at THIS base by this lane, identical to the value MF-CG1 carries, so no re-stamp occurred in
  the window.
- **Charter:** ODQ **§494** (the owner's directive, verbatim, and the chair's measured "no"),
  **§495** (the correction and this car's spec, §495.4 a–e), **§498.3** (the two-tier estate
  halo this layer will later carry), **§502.2** (the correction to §495.4(a): the painter's op
  count is an IDENTITY that a new op MOVES), **§519** (estate ownership is POWER-scoped) and
  **§514.1b** (the owner's paywall ruling: viewing and interacting are FREE at every level).
- **Collision group:** none. At this base **169 of 170 registered packets are LANDED and the
  remaining one is SUPERSEDED**, so no packet reserves any path this member names: the seven
  landed paths this member touches are reserved by TC-5A, TC-5B-I and TC-5B-II, all terminal,
  and `SettlementMapPane.jsx` is reserved by no packet at all.

---

## §1 · WHAT THIS MEMBER IS, AND WHAT IT DELIBERATELY IS NOT

The owner asked for one thing, in their own words (§494.1):

> "if a building had a yard or was a court, when a mouse hovers over a building it should
> highlight around that building on the map in like a yellow halo or border that shows the
> property line, including a court or yard or whatever configuration within that property line
> it is."

The chair's first answer was that the engine could not show it. §495 corrected that answer, and
the correction is this member's whole premise: **the property line already exists as validated
data.** `CartographyParcelRow` has carried `polygon: PlanPoint[]` since TC-3b
(`cartographyParcels.js:68-74`); `cartographyPaint.js` read that row for `{id, wardId}` and
dropped the ring. So this is **a PUBLISH, not a build**. No geometry is computed here, no
clipping, no jitter, no retry — the containment the halo depends on is a THEOREM of the carving
(`cartographyParcels.js:11-20`), not a check this member performs.

**It is not** a compound model. A typed COURT, a typed YARD and a detached outbuilding are
DW-1/DW-2's `CompoundMember`; §3 states the seam that makes their arrival a change of INPUT.
It is not a frontage fix — §3 states that limit too, prominently, because the shape this member
draws is honest about the engine and dishonest about the world. It is not a lighting decision:
the cartography rule stays virtual and dark, which is why the plan view is byte-identical for
every existing world (§4).

---

## §2 · WHAT THE MEMBER DOES, IN FIVE PIECES (§495.4 a–e)

**(a) The painter publishes the ring.** `buildCartographyDrawList` emits one `parcel` op per
parcel row, between the wards and the streets — over the ward it was carved from, under
everything built on it. A parcel op carries `{ op, id, wardId, polygon }` and **no `role` and no
`tonePermille`**: it is a BOUNDARY, and the street op's precedent is that a mark with one ink
names that ink once at the binding rather than carrying a scalar per op.

⚠ **That shape is load-bearing twice over, and §7's C2 arms say so.** The parcel layer is still
the only path from a building to its ward. `cartographyPaint.js` throws when a building's parcel
names a ward the block does not carry, and that arm is reachable ONLY because the parcel loop
resolves no wards. Giving a parcel op a paint role would have moved the throw one layer earlier,
with a different message, and left a landed referential arm as dead code no fixture could drive.

**(b) The same ring reaches the 2D plan.** `MapTabShell` already holds the compiled block; it
threads it down to `SettlementMapPane` as one optional prop. There is no second compile and no
new hook. The plan and the surveyor's sheet read ONE block.

**(c) Hover and pin draw the property line.** `SettlementMapPropertyLine` is keyed off the pane's
existing `pinned ?? hovered` machine — `active`, restricted to a BUILDING so a hovered district
still highlights the district — and draws a **yellow border PLUS a low-opacity fill**. Border as
well as tint, so the affordance survives colour-blind and high-contrast modes (§494.3). Touch
posture is unchanged because the leaf handles **no event at all**: `pointerEvents: 'none'`
throughout, which is also what stops the halo stealing the very hover that summoned it.

**(d) The open ground is tinted, and nothing is stored.** The yard is the parcel ring with each
member footprint punched out under `fill-rule="evenodd"`. Because `footprint ⊂ parcel` is a
theorem, the renderer's even-odd rule performs the subtraction EXACTLY — so the derivation is a
path string, not polygon algebra, and no boolean-difference routine exists anywhere in the
change. That is DW law 4 (derive-don't-store) satisfied by construction, and it is also why this
member adds no clipping to a family whose ONE LAW keeps clipping out.

**(e) Acceptance is the owner's, verbatim.** Hovering ANY member of a property highlights the
WHOLE property line ONCE, with no double-draw where members touch — pinned by object identity in
the domain matrix and by identical path data in the UI matrix. A building whose parcel is absent
from the block highlights itself alone and never invents a boundary. And the halo is present for
an anonymous viewer: the leaf reads no entitlement, and §7's H4 arm pins that structurally.

---

## §3 · ⚠ THE HONEST LIMITS — WRITTEN IN, NOT PAPERED OVER (§495.5)

**(1) THE SHAPE IS A FAN WEDGE, NOT A BURGAGE PLOT.** A parcel is a centroid triangle fan carved
inside a convex ward, each ward edge split into three integer segments. Real plots are
narrow-fronted and deep — DWR1A and R-INST-2 measured shops at 6–10 ft of frontage, and the
parallel-hall parti needs 30–50 ft. **MP-1 draws the engine's TRUE property line. Making that
line the RIGHT SHAPE is DW's frontage work, and nobody should read the wedge as the final
answer.** The halo is honest about what the engine believes; the engine is not yet honest about
what a town looks like, and this member does not pretend otherwise.

**(2) `PARCELS_PER_WARD` IS A TIER BAND.** Only selected candidates enter the block, so some
buildings have no parcel row at all. That is ORDINARY, not a defect, and the overlay degrades to
the pane's pre-existing behaviour — the building highlights itself alone. §7's H3 and P3 arms
drive exactly that path.

**(3) COURT VERSUS YARD NEEDS THE MODEL.** An enclosed court is a TYPED member, not a
subtraction, and detached outbuildings do not exist yet: both are DW-1/DW-2 (§494.3 item 1).
This member derives open ground by subtraction ALONE and its own source says so at the top of
`cartographyProperty.js`.

**THE DW-6 SEAM, STATED EXPLICITLY — what will be SWAPPED, and what will not move.** When the
typed members land, `cartographyProperty.js` changes its INPUT and nothing else:

| today | after DW-6 | does the overlay change? |
|---|---|---|
| `membersOf` = the block's building rows sharing a `parcelId` | the compound's typed `CompoundMember` rows | **no** — `PropertyLine.memberIds` / `memberFootprints` keep their shapes |
| `openGroundOf` = ring minus member footprints | the typed open-ground member (court vs yard distinguished) | **no** — the `{ ring, holes }` return shape is unchanged |
| one tier of halo | two tiers: the property strongly, the POWER's other holdings faintly (§498.3/§519) | **additive** — a second `PropertyLine` set, drawn at a lower opacity by the same leaf |

`Estate.ownerRef` resolves to a POWER — the governing seat or a contender — never a household and
never a named individual (§519.5). This member mints no owner field and reads none; it is named
here only so DW-6's addition is an addition and not a redesign.

---

## §4 · ⚠ WHAT THE OWNER WILL AND WILL NOT SEE TODAY, MEASURED

`townCartographyEnabled` is a VIRTUAL simulation rule with **no `DEFAULT_SIMULATION_RULES`
entry** (`simulationRules.js:765,783`; `townCartographyBlock.js:8-15`). Every existing world is
dark by construction, so `useTownCartographyBlock` answers `unavailable`, the pane receives
`cartography = null`, and **the plan view is byte-identical to before**.

This is stated plainly rather than buried because the owner called this the first thing in the
program a user will see. **The layer is built; the lighting is not this member's to flip** —
that is the cartography program's own gate and an owner call. When it lights, the halo is there
with no further work. Until it does, the honest description of this member is "the property line
is now drawable, everywhere it is drawn," and the only surface where it is visible today is a
lit `Map ▸ Cartography` sheet.

---

## §5 · EXACT CHANGE MANIFEST

| action | path | why |
|---|---|---|
| `MODIFY` | `src/domain/townCartography/cartographyPaint.js` | emit the `parcel` op; the length identity gains one term, DECLARED in the file's own header beside the prose it replaces |
| `CREATE` | `src/domain/townCartography/cartographyProperty.js` | the JOIN — anchor key → property, membership by shared `parcelId`, open ground as ring + holes |
| `MODIFY` | `src/components/townMap/subtabs/cartographyColours.js` | the property line's one ink, named once (the `STREET_TONE_PERMILLE` precedent) |
| `MODIFY` | `src/components/townMap/subtabs/MapCartographySubTab.jsx` | render the new op as an unfilled hairline; the element count still equals the identity |
| `CREATE` | `src/components/townMap/SettlementMapPropertyLine.jsx` | the halo leaf — border + tint, evenodd yard, no pointer, no gate |
| `MODIFY` | `src/components/townMap/SettlementMapPane.jsx` | mount it (one line) and accept the block (one prop on an existing line) |
| `MODIFY` | `src/components/townMap/MapTabShell.jsx` | thread the block it already holds down to the pane |
| `TEST` | `tests/domain/townCartographyPaint.test.js` | the moved identity and the four op kinds |
| `TEST` | `tests/lib/townCartographyBlock.test.js` | the producer↔consumer identity, moved with it |
| `TEST` | `tests/ui/mapCartographySubTab.test.jsx` | the rendered element count and order, moved with it |
| `TEST` | `tests/domain/townCartographyProperty.test.js` | MP-1's own domain matrix, P1–P5 |
| `TEST` | `tests/ui/settlementMapPropertyLine.test.jsx` | MP-1's own UI matrix, H1–H4 |
| `DOC` | `docs/implementation/packets/town-cartography/MF-MP1.md` | this packet |

⚠ **`SettlementMapPane.jsx` IS AT 597 OF 600 EFFECTIVE LINES AFTER THIS MEMBER** (594 before).
That is why the halo is a leaf and not a block, and it is a hazard for the next lane that
touches the file: three lines of headroom, and the file's own header already names four other
leaves extracted for the same reason.

---

## §6 · THE DECLARED SHIFT — the op-count identity (§502.2)

§495.4(a) called this "an INSERTION, not surgery". §502.2 corrected that: the painter's op count
is an **IDENTITY**, and a new op MOVES it. The identity was

```
ops.length === wards.length + streets.arterials.length + streets.lanes.length + buildings.length
```

and is now

```
ops.length === wards.length + parcels.length + streets.arterials.length
             + streets.lanes.length + buildings.length
```

**Every pin that stated the old figure was found before the edit and moved with it in the same
change.** The complete list, which is the price §502.2 asked for:

| # | pin | how it moved |
|---|---|---|
| 1 | `expectedLength()` helper, `townCartographyPaint.test.js` | `+ block.parcels.length` |
| 2 | C1 order rank map `{ward:0, street:1, building:2}` | `{ward:0, parcel:1, street:2, building:3}` — an unknown op kind would have reddened it |
| 3 | C1 `known` id set | parcel ids added; the op list is a bijection onto the drawn records |
| 4 | C2 `toHaveLength(2)`, the missing-`condition` arm | `3`, and the prose that said "Two ops, not three: a parcel is DRAWN never" is rewritten |
| 5 | C2 `toHaveLength(2)`, the dangling-ward arm | `3`, plus a new note recording why the parcel op carries no role |
| 6 | C6 `OP_KEYS` | a `parcel` entry: `['id','op','polygon','wardId']` |
| 7 | C6 `expect([...seen].sort())` | `['building','parcel','street','ward']` |
| 8 | C6 by-reference `checked` count | `wards + parcels + buildings`, with a parcel arm asserting the ring is the block's own object |
| 9 | `townCartographyBlock.test.js` C3 producer↔consumer identity | the new term, plus an anti-vacuity pin that the real block genuinely carries parcels |
| 10 | `townCartographyBlock.test.js` C3 order | `ward < parcel < street < building` |
| 11 | `mapCartographySubTab.test.jsx` element-count identity | the new term |
| 12 | `mapCartographySubTab.test.jsx` hand-stated tag order | one more `polygon`, third |
| 13 | `mapCartographySubTab.test.jsx` BLOCK fixture | its parcel row had **no `polygon`** — the contract required one since TC-3b and the painter now reads it |
| 14 | C8 "every emitted tone is an integer in 0..1000" | it skipped `street` alone; `parcel` joins it in a named `TONELESS` set. FOUND BY EXECUTION, not by reading — it was the one pin the pre-edit sweep of this file missed, and it reddened on the first battery |

Pin 14 is the honest part of this table: thirteen were found by grep before the edit and one was
found by the test suite afterwards. Pin 13 is worth naming on its own: the fixture omitted a contract-required key and nothing
noticed, because the painter dropped that key. A real compiled block never could.

---

## §7 · ACCEPTANCE CASES

| id | case | file |
|---|---|---|
| A1 | The moved identity holds exactly over the 20-row lit corpus, ward ops precede parcel ops precede street ops precede building ops, ids ascend within each run, and all FOUR op shapes are exercised with closed key sets | `townCartographyPaint.test.js` |
| A2 | A parcel op's ring is the block's OWN array by reference; the two landed referential throws still fire on their own fixtures with their own distinguishing messages | `townCartographyPaint.test.js` |
| A3 | The real compiled block satisfies the moved identity, with the new term proved non-zero | `townCartographyBlock.test.js` |
| A4 | The sheet emits one element per op, in the leaf's order, with the property line third and unfilled | `mapCartographySubTab.test.jsx` |
| A5 | P1 — `semanticId === prefix + anchorKey` over a real compiled manifest, and every cartography `institutionRef` IS a manifest `semanticId`, so the join is total and the one spelled prefix cannot drift | `townCartographyProperty.test.js` |
| A6 | P2/P4 — a property is exactly the rows sharing its `parcelId`; every member resolves to the SAME object by identity; open ground is ring + the members' own footprints verbatim, with no polygon algebra | `townCartographyProperty.test.js` |
| A7 | P3/P5 — an absent parcel, a malformed ring, a dark block and a non-record all answer empty rather than throwing, each anchored by a lawful sibling in the same fixture | `townCartographyProperty.test.js` |
| A8 | H1–H4 — border AND tint, the ring stroked exactly once, the yard punched evenodd, both members of a compound drawing identical paths, nothing drawn when nothing is known, `pointerEvents: 'none'`, and NO entitlement read in either the leaf or its mount | `settlementMapPropertyLine.test.jsx` |

---

## §8 · CHECKS

```
npx vitest run --pool=threads --maxWorkers=2 tests/domain/townCartographyPaint.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/domain/townCartographyProperty.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/lib/townCartographyBlock.test.js
npx vitest run --pool=threads --maxWorkers=2 tests/ui/mapCartographySubTab.test.jsx
npx vitest run --pool=threads --maxWorkers=2 tests/ui/settlementMapPropertyLine.test.jsx
node scripts/implementation-packets.mjs validate
```

Every battery runs under `scripts/gate-mutex.sh --run` on the shared lock, never wrapping
`npm run check*` (which self-deadlocks).

---

## §8b · EXECUTED RECEIPTS AT THIS MEMBER'S TIP

Every vitest battery ran under `scripts/gate-mutex.sh --run` on the shared lock; `npm run check*`
was never wrapped (it self-deadlocks). Figures are quoted from the runs' own lines.

**The five acceptance files, together:** `Test Files 5 passed (5)` · `Tests 105 passed (105)` ·
`TRUE_EXIT=0`.

**The two reds this member found by EXECUTION, both cured, both recorded rather than smoothed:**

1. The first battery reddened C8's tone arm — it skipped `street` alone, and a parcel op carries
   no tone either. That is pin 14 in §6, and it is the one the pre-edit grep missed.
2. The second battery reddened the halo's own entitlement scan **against the leaf's own header**,
   which NAMES the gate it refuses. A source scan that reads documentation cannot tell a rule
   from its violation. Cured by stripping comments first, exactly as
   `townCartographyPaint.test.js`'s purity scan does — the header stays free to state the law.

**S0, part 1 (OSR):** `159 B`, sha256
`c5b67844abe51226f4c6862ae485dc5d9fa1e51148c70b4bd021e661f1ae0854` at this tip — byte-identical
to the same capture at the base and equal to the slot card's own figure. The `cmp` is proven LIVE
by a one-byte probe (probe `cmp` exits non-zero; the restore `cmp` exits 0). **Zero OSR rows
minted**, which matters because `cartographyProperty.js` reads six keys off an `unknown` block.

**The ratchets:** `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173)` ·
`[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134)` ·
`[implementation-packets] valid: 171 packets (1 READY)`.

**THE MUTATION SWEEP — TEN MUTANTS, TEN CONVICTIONS, ZERO SURVIVORS, AND A CONTROL.** Each
mutant drove the ONE ARM it should convict (`-t <title>`), not the whole file, and each printed
line carries its own collected count so no exit code stands without one. Every restore was
verified digest-exact (sha256 before == after), and `git status` diffs clean against the
pre-sweep baseline afterwards, so the sweep left nothing behind.

| mutant | the arm it convicted |
|---|---|
| the painter emits no parcel op | the moved identity |
| the painter emits parcels LAST, over the buildings | the back-to-front order |
| the painter COPIES the ring | the by-reference arm |
| the join is keyed on the raw ref, prefix never crossed | P1's real-anchor arm |
| open ground forgets its holes | P4's ring-plus-holes arm |
| a malformed ring is indexed instead of dropped | P3's drop arm |
| the halo is a tint alone | H1's border arm |
| the halo becomes hit-testable | H4's pointer arm |
| the sheet paints the property line FILLED | the unfilled-hairline arm |
| the shell stops threading the block to the plan | the shell-thread arm |

⚠ **THE CLEAN-GREEN CONTROL IS THE POINT.** An all-red sweep with no control is a broken runner
wearing a sweep's clothes. Immediately after the tenth restore, the same five files ran
unmutated: `Test Files 5 passed (5)` · `Tests 105 passed (105)` · `CONTROL_EXIT= 0`.

**The size baseline, measured with eslint's own `Linter` and the test's own rule (effective
lines, blanks and comments skipped):** `cartographyPaint.js` 155/800 ·
`MapCartographySubTab.jsx` 130/600 · `MapTabShell.jsx` 121/600 ·
`cartographyColours.js` 73/800 · **`SettlementMapPane.jsx`
597/600** (594 at the base) · `SettlementMapPropertyLine.jsx` 29/600 ·
`cartographyProperty.js` 61/800. Every authored file also scans **zero** C0 control
characters. ⚠ `ceilingFor()` returns **null** — no ceiling at all — for
every path outside `src/`, and inside `src/` for anything not under
`components|generators|domain|store|pdf|lib|hooks|utils` or the src root; `src/data/**` and
`src/design/**` are uncovered. No file this member touches is in `scripts/.size-baseline.json`.

**The §489.3 grep arm, proved live before it was trusted:** `git grep --untracked` was run
against this member's own NEW, still-untracked files and returned all of them, so the sweep below
is a measurement rather than a blind pass. `buildCartographyDrawList` has exactly ONE production
reader (`MapCartographySubTab.jsx`) and three test readers, all four named in §5. **No golden and
no digest anywhere in `tests/` covers the op list** — the only three files that mention it are
those three.

**A new-leaf hazard, found and cleared:** `tests/domain/townCartographyDeterminism.test.js` builds
its `SOURCES` with `readdirSync` over `src/domain/townCartography`, so `cartographyProperty.js`
joins its package-wide scans the moment it exists — no ambient entropy or clock, no module-scope
mutable state, no transcendental float, no store/React/flag import. It passes all four (it has
zero imports and declares nothing with `let` or `var` at module scope).

**A measurement the charter did not carry, and it is good news.** §495.4(b) asked for the ring to
be threaded to the 2D pane without saying whether the two surfaces agree. Measured here by
executing a real compile: a cartography WARD polygon and the SM-1 town-map DISTRICT polygon for
the same settlement are **byte-identical** (`[[428,494],[572,494],[607,308],[393,308]]`), both
spaces are 0..1000 (`TOWN_SCENE_PLAN_EXTENT` = 1000, `townMapModel.js`'s `VIEW` = 1000), and
`ward.districtId` equals the SM-1 district's `id`. **So no transform exists anywhere in this
member, and none is needed.**

---

## §9a · JUDGMENTS — each one vetoable, each with its reversal

Delegated under the standing grant; every call below is inside the car's scope and none of them
touches an owner-gated class. Say "veto" against any line and it flips.

**J-MP1-1 · A parcel op carries NO `role` and NO `tonePermille`.**
*Rejected:* inheriting the owning ward's role and tone, which was the first shape drafted.
*Why:* it would have forced the painter to resolve a parcel's ward inside the PARCEL loop, moving
`cartographyPaint.js`'s "parcel names a ward outside this block" throw one layer earlier and
leaving the building-level arm dead code no fixture could drive. The boundary shape keeps both
landed arms alive and matches the street op's precedent of naming one ink once at the binding.
*Reversal:* add the two keys in the parcel push and delete `PARCEL_LINE_ROLE` /
`PARCEL_LINE_TONE_PERMILLE`; C6's `OP_KEYS` and the two C2 arms move with it.
*Blast radius:* none outside the op shape — the block is untouched; the four op-shape pins were
grepped and moved together.

**J-MP1-2 · The yard is an even-odd path, not a computed polygon difference.**
*Rejected:* a boolean-difference routine returning a real ring-with-holes polygon.
*Why:* the cartography family's ONE LAW keeps clipping out, `footprint ⊂ parcel` is a theorem, and
the renderer's even-odd rule performs the subtraction exactly and for free. A clipper would also
be genuinely new capability rather than repair.
*Reversal:* `openGroundOf` already returns `{ ring, holes }`; a clipper would replace only the
component's path composition.
*Blast radius:* none — no geometry is computed anywhere in this member.

**J-MP1-3 · The halo takes the pane's own accent (`pal ? pal.anchor : GOLD`), not a fixed
yellow.** *Rejected:* hard-coding the gold token so the halo is yellow under every lens.
*Why:* the owner asked for "a yellow halo", and the DEFAULT parchment lens gives exactly that;
but the pane's standing doctrine is that a chosen lens repaints every mark on it (WYSIWYG with
the exports). A mark that ignored the lens would be the only one on the map that did.
*Reversal:* pass the gold token literally at the mount instead of `C.anchorFill`.
*Blast radius:* only the halo's stroke and tint; no other mark changes.

**J-MP1-4 · `cartographyProperty.js` is TOTAL and never throws, unlike the painter.**
*Rejected:* the painter's loud `premise` refusal, for consistency within the family.
*Why:* the painter's block IS the picture, and an empty picture would be a lie; the halo's block
is an overlay source whose ordinary state is absent, and a throw would take the whole town map
down over a decoration. The same malformed block still throws loudly on the sheet that draws it,
so nothing is swallowed by both readers.
*Reversal:* import `premise` and refuse instead of narrowing; P3 and P5's four arms invert.
*Blast radius:* the plan view only.

**J-MP1-5 · The semantic-id prefix is spelled ONCE in the domain leaf, with a live agreement
pin, rather than exported from `buildingProfiles.js`.**
*Rejected:* adding an exported constant at the minting site and importing it.
*Why:* `buildingProfiles.js` is a hot manifest file inside the bounded compiler chunk, and the
join must not create an edge from the component layer into it. A single spelling plus P1's
executed agreement pin against a real compiled manifest gives the same protection without the
edge. *Reversal:* export the constant there and import it here; delete the local one.
*Blast radius:* none today — P1 fails loudly the moment the two disagree.

---

## §9b · DELIBERATE DEFERRALS — documented, not bugs to re-find

1. **Lighting `townCartographyEnabled`** — the cartography program's gate and an owner call
   (§4). Not this member's.
2. **The 3D scene's gold selection halo** (`threeSceneRuntime.js:450-463`) stays a disc at the
   building's centre. §494.3 item 3 allows it in this car "or a sibling"; it is a sibling,
   because the 3D scene consumes a different projection and re-pointing it is not a publish of
   the same ring.
3. **The two-tier estate halo** (§498.3/§519) — needs `Estate.ownerRef`, which does not exist.
   §3's table states the seam so it lands as an addition.
4. **Typed court versus yard, and detached outbuildings** — DW-1/DW-2 (§3 limit 3).
5. **The wedge shape** — DW's frontage work (§3 limit 1).
6. **A parcel LABEL or an address on the sheet** — the property line is drawn, not named. A name
   would need the address chain and is the news-address law's territory, not a geometry publish.
7. **`SettlementMapPane.jsx` headroom** — three effective lines. Recorded in §5 as a hazard for
   the next lane rather than cured here, because curing it means decomposing a file this member
   did not otherwise touch.

---

## §10 · THE CENSUS ROW — WALKED BY EXECUTION, DEFERRED TO THE LANDING ACT (§417)

`tests/lint/sovereigntyLightingContract.walker.test.js` is **not edited by this member.** The
figures below were obtained by WALKING the frozen block one assertion at a time and reading each
next figure out of the arm's own failure message, then reverting the file digest-exact.

| figure | slot `5055990a` | this tip | delta |
|---|---|---|---|
| files | 2517 | **2519** | **+2** |
| parked | 366 | **366** | **+0** |
| credited | 2151 | **2153** | **+2** |
| titles | 20882 | **20914** | **+32** |
| suiteTitles | 5814 | **5823** | **+9** |

**The walk, verbatim from the arm:** `expected 2519 to be 2517` → `expected 2153 to be 2151` →
`expected 20914 to be 20882` → `expected 5823 to be 5814` → `Tests 1 passed | 32 skipped (33)`.
Each step moved exactly ONE figure, so every number is convicted by its own assertion rather
than by arithmetic over the others.

⭐ **BOTH NEW FILES ARE CREDITED, NOT PARKED**, and that is measured rather than hoped:
`credited` moved by exactly +2 while `parked` did NOT move. The +32 title delta also reconciles
against the source exactly — 16 `it(` in the new domain matrix, 13 `test(` in the new UI matrix,
and 3 arms added to the cartography sub-tab's file — so no title was swallowed by a parked file.
Both new suites are registered STRAIGHT-LINE for that reason; a `test(` inside a loop would have
parked the whole file and taken its siblings' titles with it.

**The row is DEFERRED to the landing act** (§417): re-walk it at whatever tree this member
actually lands on, because a rebase moves the absolutes even when the DELTA is identical.

---

## §11 · THE OTHER FIVE REDS ARE BANKED, BY BASELINE LOOKUP

The targeted-trees battery (`tests/lint tests/build tests/ui tests/lib` + seven townCartography
domain files + the dormancy golden) reported **`Test Files 4 failed | 515 passed | 7 skipped
(526)` · `Tests 6 failed | 4903 passed | 114 skipped (5023)`**.

One of the six is the census arm above — expected, and this member's. The other five were
classified by **looking each one up in `scripts/.test-ratchet-baseline.json` by exact title**,
which is the estate's banked-failure registry, rather than by re-deriving a banked set:

| failing test | banked? |
|---|---|
| `clampPrimitiveBaseline.test.js` · baseline exactly matches the files that still define a local clamp/clamp01 | **yes** |
| `warCostKindPools.walker.test.js` · `war_trajectory_winning` retains the five receipt-annex families verbatim | **yes** |
| `warCostKindPools.walker.test.js` · `war_trajectory_losing` … | **yes** |
| `warCostKindPools.walker.test.js` · `trajectory_misread` … | **yes** |
| `warRulingKindPools.walker.test.js` · `succession_demand_inherited` … | **yes** |

The registry holds 11 entries; the other six live in trees this battery did not run
(`tests/copy`, `tests/docs`, `tests/domain/metronomeCooldownLint`). **Zero unbanked reds outside
the census arm.**

**TREES NOT RUN, and why:** `tests/domain` in full, `tests/property` in full, `tests/components`,
`tests/store`, `tests/security`, `tests/ops`, `tests/docs`, `tests/copy`, `tests/edgeFunctions`
and `tests/architecture`. This member's production surface is four files, none of them on a
generation path, and the seven townCartography domain suites plus the dormancy golden — the only
domain readers of anything it touches — WERE run and are green. The full sweep and the terminal
belong to the landing act; the shared gate mutex was continuously contended by sibling lanes
running whole-tree sweeps throughout this lane, and a battery this member could not run is
declared here rather than implied.
