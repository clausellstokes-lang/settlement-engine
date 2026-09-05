# LANE: DESK-9 — a walker arm that makes the public-dossier gate a DUTY of every desk mount, not a habit
⟦Chair: Fable 5.1 · Lane: Opus 5 (`model: "opus"`) · machinery, chair-class · zero product behaviour change⟧

## THE FINDING (DESK.json DESK-9, CONFIRMED)
O2GATE (`450f7dbb7`, 3 files: `OutputContainer.jsx` 2 lines, `EconomicsTab.jsx` 14, `tests/ui/economicsTabFlow.test.js` 90)
cured a paid-surface leak: corpus sentences rendered on the ANONYMOUS gallery dossier until `publicDossier` was threaded
into one tab (`EconomicsTab.jsx:241` prop; `:330` `deskProse = publicDossier ? Object.freeze({ …nulls }) : …`). **No
instrument enforces it.** The leak was found by a chair reading; four desk lanes are landing new mounts on four more tabs
right now, each a fresh chance to repeat the omission.

## READ FIRST
`$SC/briefs/_PREAMBLE.md` → `$SC/briefs/_DESK-LAW.md` (trap 2) → `git show 450f7dbb7` WHOLE (the shape of the gate) →
`tests/lint/dossierMountRegistry.walker.test.js` WHOLE (its reachability arm resolves each mount id to exactly ONE string
literal under `src/components`; its `routerTabs` vocabulary is derived from `OutputContainer.jsx`'s `renderTab`) →
`src/domain/display/stateProse/dossierMounts.js` (the registry).

## YOUR DOCK
`$SC/laneDESK9` at **`940d161ca`** (the desk consist — the tabs the arm must cover are all there). Porcelain 0.

## THE ACT
1. **Derive the invariant from O2GATE, do not invent one:** for every mount row, the component that carries the mount's
   literal must (a) accept `publicDossier` (a prop or the container's threading — measure how the router passes it) and
   (b) null the desk prose under it before any draw. Write the invariant as one sentence in the arm's name.
2. **Add the arm to the EXISTING walker** (`dossierMountRegistry.walker.test.js`) — no new test file. Static, source-level:
   for each mount, locate its host file (the reachability arm already does), then assert the host threads `publicDossier`
   and gates its desk-prose read on it. Anchor every negative (the anchored-negative walker is a TWO-SIDED trap: cure
   only your new sites). Plain `it`, a loop inside.
3. **Prove both directions:** green at `940d161ca` for every landed mount (if a landed mount FAILS the arm, that is a
   FINDING — report it with the file:line; do not weaken the arm to pass); plant a decorative un-gated mount in a scratch
   copy of a tab and prove the arm RED; remove the plant.
4. ⚠ `OutputContainer.jsx` sits at 600/600 effective lines — if the invariant needs the container to thread the prop to a
   tab that lacks it, that is a desk lane's car, not yours; record it as OWED with the tab name.

## PROOF
The walker file; `npx vitest run tests/lint/` WHOLE (exit + failing-arm list); eslint. Quiet-window law + mutex. Plant-out
receipt. `$SC/receipt-desk-9.md` with a RETROVALIDATION ROW. No register acts (the lighting census moves by your new
titles — predict the delta; the chair re-takes it).

## ⛔ FENCES
No product code. No new test file. No `--amend`. Trailers `Seat: Opus 5 — Fable-unvalidated`, `Lane: DESK-9`.
