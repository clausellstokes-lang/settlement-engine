# EM-B1d — STOP, uncommitted. Three measured contradictions, each needing a path §7 does not declare.

The deliverable is COMPLETE, staged and green except for these three. Every one is a file the
change manifest does not name, so curing any of them is a chair act, not a lane act
(`PACKET_STANDARD.md`: *"A target outside the manifest is out of scope even when the full gate finds
an adjacent defect"*). Nothing was improvised around them.

Tree at the stop: HEAD `58fcfe614`, branch `fixes-2026-09-18-consist`, the **eleven declared paths
staged**, nothing else modified, nothing untracked. Goldens unmoved. Seal intact.

---

## STOP-1 · `npm run build:edge-shared` produces SEVEN artifacts, not the four §7 declares

**The smallest measured contradiction.** The generator re-stamps `generatedAt` in **all five**
`*.meta.json` on every run. Three of them are not declared by §7:

```
supabase/functions/_shared/aiGroundingBundle.meta.json      sourceHash 9788abb8fdb7287e  UNMOVED
supabase/functions/_shared/analyticsEventsBundle.meta.json  sourceHash 0a6ba64ce0b8d5e2  UNMOVED
supabase/functions/_shared/intentAtlasBundle.meta.json      sourceHash 9136e063f280d77f  UNMOVED
   diff -U1  →  -  "generatedAt": "2026-09-19T14:03:19.300Z"
                +  "generatedAt": "2026-09-19T21:10:13.315Z"      (the ONLY changed byte range)
```

§11 fires literally: *"`npm run build:edge-shared` changes any artifact other than the four named
in §7"*.

**Withdrawing the three is not available**, and that is measured rather than argued. The estate pins
the single build window:

```
tests/edgeFunctions/edgeSharedBundleReproducibility.test.js
  > edge-shared bundles were built from ONE tree in ONE run (CR-EB-2 (b))
  > all bundles share a single build window — no stale siblings left behind
AssertionError: generatedAt spread is 25614.1s across the bundles — some were not rebuilt
  with the rest. Re-run: npm run build:edge-shared: expected 25614114 to be <= 600000
```

So committing four leaves that arm RED at the committed tree; committing seven exceeds the manifest.

**Two independent confirmations that the manifest, not the tree, is what is wrong:**

1. **Precedent — every prior regeneration landing carried seven `_shared` paths.** `ddcfb1f59`'s
   own subject describes this exact shape: *"the aiCharter and aiOutputSchema bundles rebuilt at the
   composed tip … three siblings byte-identical, **five metas re-stamped in one build window**"*.
   Same for `ee8ac6c3c`, `58b466afc`, `167887d38`.
2. **The packet's own sealed chain refuses it.** `checks` includes `npm run build:edge-shared`, so
   running the packet's own verbs dirties the three undeclared files and the gate convicts:
   - `npm run check:packet -- EM-B1d` → **exit 2**, `[implementation-gate] sealed foreign work drifted for EM-B1d`
   - `npm run implementation:resume -- EM-B1d` → **exit 2**, identical refusal
   EM-B1d cannot pass its own seal while those three paths are undeclared, whatever the lane does.

**Cure (chair, ~1 minute).** Add three **GENERATED** rows to §7 and to `EM-B1d.manifest.json`:
`aiGroundingBundle.meta.json`, `analyticsEventsBundle.meta.json`, `intentAtlasBundle.meta.json`
("re-stamped in one build window; `sourceHash` unmoved"). Handwritten budget untouched (7 of ≤12).
The lane then runs one `npm run build:edge-shared`, stages fourteen paths and commits.
⭐ Worth a preamble row 12 as well: §P2 row 10 prices INPUT membership but not the generator's
re-stamping of every sibling, which is what bit here.

---

## STOP-2 · Row 2 necessarily reds a committed exact pin in a file §7 does not declare

```
tests/generators/densityLaw.test.js:1005
  D2b — §810.4 R18/R20 > the absent-status line is EXACT in both directions (irreversible causes only)
  expect(ROSTER_ABSENT_STATUSES).toEqual(['dead', 'exiled', 'removed'])
AssertionError: expected ['dead','exiled','jailed','removed'] to deeply equal ['dead','exiled','removed']
  Test Files 1 failed | 1 passed (2) · Tests 1 failed | 191 passed (192)
```

This pin is doing exactly its job: `factionLifecycle.js`'s header promises *"move a status across
this line and the pins below will say exactly what moved with it."* The packet ordered the move and
did not price the pin.

**Cure:** one token — `['dead', 'exiled', 'jailed', 'removed']` — in that `toEqual`. The sibling
loop in the same test (`for (const st of ['active','retired','missing'])`, the PRESENT side) stays
correct as written. The chair adds `tests/generators/densityLaw.test.js` to §7 as a TEST row,
handwritten total 8 of ≤12.

---

## STOP-3 · Row 4 necessarily reds a committed fixture in a file §7 does not declare

```
tests/domain/espionageMission.test.js:566  (fixture at :559)
  ES-1 casting > THE DISPATCH-REFUSAL SEAM is ONE predicate, and it refuses BOTH laws together
  const busy = [ { ...ROSTER[2], status: 'imprisoned' }, … ];
  expect(castableRoster(world, 'ashford', settlement)).toEqual([])
AssertionError: expected [ { … 'Tam the Carter', status: 'imprisoned' } ] to deeply equal []
  Test Files 1 failed | 11 passed (12) · Tests 1 failed | 142 passed (143)
```

R4 ratified this change as inert on the measurement *"no writer in `src/` assigns either spelling to
`.status`"* — true, and re-confirmed by this lane. But the ratification measured **`src/` only**: a
committed TEST fixture does assign it, and asserts the refusal. The behaviour change is inert in
production data and NOT inert against the suite.

**Cure:** one token — `status: 'jailed'` in that fixture — which preserves the test's intent exactly
(the seam refuses a captive person, now under the union's own word). The chair adds
`tests/domain/espionageMission.test.js` to §7 as a TEST row, handwritten total 9 of ≤12.

---

## Blast radius — CLOSED, and this is the complete list

Swept every test that names `ROSTER_ABSENT_STATUSES`, `LOST_NPC_STATUS`, `rosterPersonAvailable`,
`inferSuccessors`, `NpcStatus`, `imprisoned` or `'killed'` — 16 files — and executed all of them.
**Exactly the two files above fail.** Green: `factionRefContract`, `roadsParticipation`,
`successors`, `roleCategory`, `npcOps`, `npcStasisSnapshot`, `npcDmVerbs`, `npcVerdictApply`,
`roadsState`, `envoyErrand`, `settlementLifecycleFirstClass`, `roadsCharter`, `npcVerbs`,
`warRemembranceReader`. Goldens, writer-reach and observed-shape all unmoved.

## Resume, after the chair rules

1. Add the named rows to §7 + `EM-B1d.manifest.json` (and re-stamp the packet if it re-promotes).
2. In the worktree: `npm run build:edge-shared` (re-stamps five metas in one window); apply the two
   one-token test cures; `git add --` the fourteen paths.
3. Re-run: the edgeFunctions battery, `tests/generators/densityLaw.test.js`,
   `tests/domain/espionageMission.test.js`, then `check:packet` + `resume`, then commit.
   Everything else in `EM-B1d.receipt.md` is already executed and green and does not need re-running
   unless the tip moves.
