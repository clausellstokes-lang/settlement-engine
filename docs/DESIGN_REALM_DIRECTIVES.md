# DESIGN — THE SEVEN REALM DIRECTIVES

## Owner order 2026-07-31 ("please do it all then to your best judgement"), design reviewed same day.
### Authority: owner-delegated build; design judgments below are BINDING for every wave and
### recorded vetoably here. Engine-touching waves ship DARK behind virtual flags with dormancy
### goldens per the constitution (playbook §0.2). One wave = one commit + full gate + ledger row.

> **Progress**
> - 2026-07-31: Program opened. Waves A+B launched (tier-inertia certification;
>   neutral-connected default; full auto-resolve). C–G queued in order.

## The seven directives (owner, verbatim intent)
1. AUTOPLACEMENT — one button places all settlements on the realm map balancing sim dynamism
   and a connected visual web, matching terrain/resources; mismatches trigger an OPTIONAL
   "bare minimum adjustments" popup.
2. NEUTRAL-CONNECTED DEFAULT — campaign members start as neutral but connected neighbors
   unless explicitly told otherwise.
3. USER ROUTES — create a route between two chosen settlements; the path reacts to map
   geography.
4. SATELLITE TOPOGRAPHY — satellite births place within reason of the parent and derive
   starting resources from the map's topography and cues.
5. HERALD TABS — an active-settlements organizer and a settlement graveyard (stasis /
   destroyed) for retrospective review.
6. TIER INERTIA CONFIRMATION — higher-tier + successful settlements must be proportionally
   harder to drift unless matched by acute pressure/stressors.
7. FULL AUTO-RESOLVE — optionally auto-resolve everything including majors; when OFF,
   pending decisions leave the Herald and appear in a popup replacing the advance-time
   popup after Advance is pressed.

## Binding design judgments (the manager's rulings under delegation — vetoable here)
- **J-D1 (autoplacement consent):** placement-first — the placer finds best-fit terrain for
  every settlement before proposing ANY change. The popup itemizes exactly what it will do,
  in three strictly separated classes: (a) move a settlement (safe, default), (b) paint map
  terrain (FMG-canvas mutation — only with itemized consent, never bundled), (c) re-terrain
  a settlement (NEVER offered silently: it changes generation inputs and therefore the world
  under the same-seed law; offered only as an explicit labeled regen). Placement scoring is
  a pure seeded derivation over the spatial rasters; same realm + seed ⇒ same layout. The
  dynamism objective deliberately avoids sparse degenerate layouts (the small-N stasis
  evidence, 2026-07-31 soak).
- **J-D2 (neutral-connected):** the default edge = diplomatic KNOWN + minimal route
  awareness. NOT a free trade route, no resource flow. Versioned default applying to NEW
  worlds only; existing seeds keep frozen semantics (THE PROMISE).
- **J-D3 (user routes):** CREATE_ROUTE is the second command-spine vertical, the mirror
  sibling of CUT_TRADE_ROUTE — same family, same journal/receipt discipline, one
  transaction. User picks endpoints; the engine paths via the spatial travel-cost raster.
  User-created routes carry a provenance mark every lifecycle path (regen, reroll, import)
  must respect — pinned with a JSON-round-trip regen-survival test.
- **J-D4 (satellite topography):** satellites sample spatial rasters READ-ONLY at a seeded
  draw inside the orbit annulus; they never join the frozen spatial digest. Resource
  derivation uses the sampled topography through the existing resource-strike vocabulary.
- **J-D5 (Herald tabs):** in-world framing — "Gazetteer" (living roster) and "Ruins &
  Remembrance" (graveyard). Graveyard v1 shows remnant grades + Destroyed-rubric library
  rows + their chronicle receipts. USER-PARKABLE STASIS IS DEFERRED (recorded, not built):
  it is a new canonical lifecycle state requiring full persist/regen/undo/import design —
  deliberately deferred, not a bug to re-find.
- **J-D6 (tier inertia):** confirmation = a powered distribution-envelope property (drift
  probability as a function of tier × prosperity × pressure acuteness) + an invariant row
  destined for the subsystem-certification registry (tierDriftEnabled). If the property
  fails, the fix is a TUNING BAND, not code, and routes to the tuning pass.
- **J-D7 (auto-resolve + decision surface):** full-auto = productized wide-world mode
  (majorChangesRequireProposal false path), proven by the 30y soaks. Auto-adjudicated
  majors carry engine-adjudicated provenance so retrospective review always shows who
  ruled. When auto-resolve is OFF: ONE gathered adjudication screen replaces the
  advance-time popup (never a sequential modal chain). Dismissal parks unresolved items in
  a durable HELD DOCKET that re-surfaces on the next advance and shows a one-line Herald
  pointer; nothing is ever silently dropped (the coup-guarantee law extends to the UI).

## Waves (execution order = the reviewed sequencing)
- **W-A (item 6):** tier-inertia envelope + pins. Done-when: envelope registered, powered,
  green or a documented tuning-band finding. NO engine edits.
- **W-B (items 2 + 7-auto):** neutral-connected default (dark flag `neutralNeighborsDefault`
  or the established naming) + full auto-resolve mode with provenance marks. Done-when:
  dormancy goldens byte-identical, defaults versioned, pins + negative controls, gate green.
- **W-C (item 5):** Gazetteer + Ruins & Remembrance Herald tabs (lazy, a11y, legibility
  law), stasis deferral recorded in-code.
- **W-D (item 3):** CREATE_ROUTE command vertical + provenance-marked routes + spatial
  pathing + regen-survival pins.
- **W-E (item 4):** satellite topographic resources.
- **W-F (item 7-popup):** the gathered adjudication screen + held docket + Herald pointer.
- **W-G (item 1):** autoplacement (scoring derivation + button + consent popup per J-D1).

## Interleaving with the standing pipeline
The 300y research soak, its cure-proof rerun (100y×4s), the subsystem-certification build,
and the tuning pass proceed as already sequenced; realm-directive waves fill the compute
gaps and never run gates concurrently with another wave's gate.
