# RECEIPT — VIS-906 (PARTIAL — lane in flight, updated after every proof)
Seat: Opus 5 — Fable-unvalidated · Lane: VIS-906 · Chair: Fable 5.1 · 2026-09-06
Dock: `$SC/laneANCHOR905`

## STATUS: PARTIAL (arrival verified; no car committed yet)

## P0 — arrival (CONFIRMED)
- `git rev-parse HEAD` = `0eb02811156fd5f181ca9e0f27443b6b4e1c1639` — matches the brief's `0eb028111`.
- `git log --oneline -3`: `0eb028111` (§905 follow-on car, ANCHOR-905's, NOT mine) over `6582958ce` (§904 capsule car = product tip) over `56ac834ad`.
- `git status --porcelain | wc -l` = **0**.
- `git rev-list --count 6582958ce..HEAD` = **1** (the anchor car).
- `node_modules` = 456 entries, symlinked; never materialised.
- `$SC/HOLD-VITEST` absent at arrival.

---

## P1 — CAR 1 measurement (CONFIRMED, all by `sed -n '<N>p'` at `0eb028111`)
The brief's premises re-derived: `wc -l src/App.jsx` = **947** ✅; mobile header `{isMobile && (` at **:533**, closing `)}` at **:560** ✅; bottom nav `{isMobile && (` at **:733**, closing `)}` at **:776** ✅; `MOBILE_NAV_PRIORITY` at **:88** ✅; `.slice(0, 5)` at **:482** ✅; mobile `AccountMenu` compact at **:550-558** with `onAccount={() => setView('account')}` at **:556** ✅. Every brief figure held.

Measured citation table (old → new), each re-verified after the edit:

| Doc row | Stale citation | Measured truth |
|---|---|---|
| `*File:*` | `App.jsx:358-424, 661-726` | `:533-560` (header), `:733-776` (bottom nav) |
| Cohesion | `App.jsx:318` | `:88` (`MOBILE_NAV_PRIORITY`) + `:482` (`.slice(0, 5)`) |
| Touch targets | `App.jsx:681`; `AccountMenu.jsx:90,117` | `:757` (`minHeight: 44`), `:758` (padding `SP.sm + 2`); `AccountMenu.jsx:97, 153` |
| Accessibility | `App.jsx:684-687`, `App.jsx:713` | `:759` fill, `:761` border, `:763` colour, `:764` weight, `:749` `aria-current`; `:713` green is DELETED |
| Distinctness | `App.jsx:700-723` | slot DELETED; bar children are `:742-774`; account control is `:550-558` |
| Consistency | `App.jsx:703` | slot DELETED; one import `:37`, mobile `:550-558`, desktop `:651-658` |

### The three findings that were FALSE, not merely stale
1. **"About correctly demotes to the account menu"** — FALSE. The dropdown carries Account / Messages / Manage subscription & credits and nothing else (`AccountMenu.jsx:185-201`; `grep -c about src/components/AccountMenu.jsx` = 0). About's real mobile door is the footer's `LegalRibbonRow` (`LegalRibbonRow.jsx:107`, mounted `App.jsx:728`), which the source itself documents at `App.jsx:85-86`. Verdict **good** survives — there is a door, and the landing route's footer suppression (`App.jsx:722`) is covered by `LandingBelowFold.jsx:326` mounting the same row.
2. **The green `#4A7A3A` account chip** — `grep -c 4A7A3A src/App.jsx` = **0**. The chip's tones are now `SHAFT_SAGE` / `SHAFT_STEEL` (`AccountMenu.jsx:136-138`), pinned at exactly `4.63` (`tests/design/contrast.test.js:495-496`), above AA (`:485-486`), with the old GREEN/GREEN_DEEP steps kept as negative controls (`:533-537`).
3. **Consistency "weak"** — CONTRADICTED by measurement, so **re-graded weak → good** as the brief authorises. One `AccountMenu` import (`App.jsx:37`); mobile `:550-558` and desktop `:651-658` render the SAME component with byte-identical `onSignIn`/`onAccount`/`onMessages`/`onManageSubscription` handlers (`:556` vs `:656`); the only delta is the `compact` prop (`:551`) — size/padding/`maxWidth`/44px floor, NOT the interaction model. Both open the same dropdown. The old "weak" rested wholly on the deleted single-chrome jump.

### CAR 1 proof
- `git diff --stat` = **exactly one file**, `docs/UIUX_AUDIT_AND_PLAN.md | 16 ++++---- (8 insertions, 8 deletions)`. Zero `src/`, zero `tests/`.
- **Docs-only ⇒ no vitest owed and no typecheck owed.** No file added/renamed/deleted ⇒ CAR 1 alone owes no `tests/lint/` directory run.
- Commit **`79b35fdcb62a0fd6ba6043bad5e1ef70f80da1d8`**; trailers verified via `git log -1 --format='%(trailers)'` = `Seat: Opus 5 — Fable-unvalidated` / `Lane: VIS-906`. Porcelain 0. Cars over `6582958ce` = **2**.

### ⚠ TWO LANE JUDGMENTS — VETOABLE (docs-only; revert is a one-line edit each)
- **J1 — I corrected the SECOND Overhaul bullet (the green account-chip re-check), which the brief did not name.** It instructs a future lane to re-check a colour with zero occurrences in the build. Same defect class, same subsection, fully measured (finding 2 above). Marked `[done — superseded by measurement 2026-09-06]` rather than deleted. Veto = restore the `**[low]**` bullet.
- **J2 — I corrected the two `AccountMenu.jsx:90,117` citations**, which are not `App.jsx:N` and so fell outside the brief's letter. They were stale in a cell I was already rewriting; leaving a known-false citation inside an edited line would have been dishonest. Measured: `:97` and `:153`.
- **Verdict cells left alone per the brief:** the Accessibility row's evidence would now support better than **adequate**, but the brief scoped re-grades to the Consistency row. Flagged inline in the cell for the chair.

### ⚠ OUT-OF-SCOPE DEFECT OBSERVED, NOT TOUCHED (chair row)
The NEXT subsection, "AccountMenu (chip + dropdown)" (`docs/UIUX_AUDIT_AND_PLAN.md`, the `*Purpose:*`/`*Layout today:*` lines and the two `**good**` rows), describes a **three-row dropdown ending in a divided, danger-toned Sign out** and cites `AccountMenu.jsx:145-163` / `:156-164`. Measured at `0eb028111`: the dropdown is `AccountMenu.jsx:185-201` and its three rows are **Account / Messages / Manage subscription & credits** — there is **no Sign out row and no divider** in the component. Two `**good**` verdicts there rest on code that is not in the build. Out of my brief's scope (I touched nothing); recommend a follow-on docs car.
