---
name: ""
metadata: 
  node_type: memory
  type: project
  date: 2026-07-22
  branch: claude/power-strata
  base: claude/composite-r4 @ 53d72f57
  tags: 
    - power-tab
    - dossier
    - strata
    - factions
    - relationships
    - display-only
    - vision-e
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T06:58:04.812Z
---

# Power tab three-strata rework — SHIPPED (branch claude/power-strata, awaiting fold)

## Why
Owner order (verbatim, 2026-07-22): "factions and powers need to be organized
better because it looks weighted equally when in fact there are powers, there
are factions, and there are the relationships between several. so it needs a
rework." The flat "Power Distribution" list gave powers, factions, and their
ties equal visual weight. Reworked into three semantically distinct strata.

## What was built (display-only, golden-neutral — no generation change)
- **Read-model** `src/domain/dossier/powerStrata.js` (NEW, pure, strict-clean):
  - `derivePowerStrata(settlement)` → `{ powers, roster }`. THE POWERS = the one
    `isGoverning` faction (role `ruler`, via `governingFactionOf`) ∪
    `coupContenders.challengers` (role `contender`), de-duped by display name.
    THE FACTIONS = every `powerStructure.factions` entry, flagged `isPower` by
    name membership in THE POWERS.
  - `groupRelationships(rels)` + `RELATIONSHIP_KIND_ORDER` → THE WEB, grouping
    `powerStructure.factionRelationships` by typed `type` kind (frictional kinds
    first). Reduced edge = `{pair, type, direction, narrative}`.
  - Reuses ONLY canonical helpers: governingFactionOf / coupContenders /
    factionArchetype / nameOf. No hand-rolled faction keys.
- **Components** `src/components/new/tabs/power/PowerStrata.jsx` (NEW): `ThePowers`
  (dominant flush cards, each keeping the shipped powerSupport.js support-web
  disclosure), `TheFactions` (light flush roster + distribution bar), `TheWeb`
  (grouped typed relationships), and a composed `PowerStrata`.
- **PowerTab.jsx** rewritten: the flat section replaced by `<PowerStrata>`;
  legitimacy banner, stability header, Ladder, Tensions, Conflicts KEPT.
  Shrank 420→280 raw lines.

## Load-bearing facts / hazards for a successor
- **Census (real pipeline, CONFIRMED):** exactly one `isGoverning` faction +
  `coupContenders.challengers` (top ≤3 non-criminal). Criminal factions are
  structurally roster-only (coupContenders filters them — crime contests via the
  capture ladder, not the coup field). THE POWERS is typically 4 cards.
- **Relationship vocabulary (typed, FINITE):** `type` ∈ {symbiotic, dependent,
  subordinate, tense, competitive, corrupted}; `direction` ∈ {stable,
  escalating, declining}; plus a generator `narrative` (rendered as flavor only —
  the group/kind LABEL is the typed kind, never composed prose).
- **PER-SETTLEMENT, not realm-scoped.** `factionRelationships` is computed per
  settlement in `generators/power/rulingStructure.js` (→ factionDynamics
  `computeFactionRelationships`) and stored on `powerStructure`. THE WEB renders
  this honestly per-settlement. `worldPulse/factionPairLedger.js` is the realm/
  campaign-scoped ledger — NOT used here.
- **De-duplication mechanism:** support-web disclosure lives ONLY on power cards;
  description + sub-group disclosure + the InstitutionLink name live ONLY on
  roster rows; a power's roster row carries a compact keyboard-operable "holds
  power ↑" Button that scrolls to its card anchor `power-card-${factionId}`.
  This also prevents a duplicate `getByRole('button',{name})` collision — power
  card name is an EntityLink ("Go to X"), roster name is the InstitutionLink ("X").
- **EngineSections.jsx is DEAD/unmounted** (PowerSuccessionSection etc. are not
  rendered anywhere — verified by grep). The brief's "ruler/contender EntityLinks
  wired in EngineSections" meant reuse its coupContenders+EntityLink PATTERN, not
  the component. Flagged as a discrepancy in the ship report.
- **eslint gotchas that bit (new files are NOT grandfathered like old PowerTab):**
  `visual-budget/no-forked-color-const` flags ANY `const X='#hex'` (module OR
  function scope; ternaries/expressions escape it) → used a `powerAccent(role)`
  helper + imported `BORDER` token for the seam. `visual-budget/no-raw-color`
  flags a bare `prop:'#hex'` in a style object (ternary/variable escapes) →
  swatch member-access or variables. `jsx-hygiene/no-raw-button` forbids new raw
  `<button>` → used the `Button` primitive (variant ghost) for the holds-power
  marker.
- **domain-strict:** `powerLabel` is NOT on the shared `RulingFaction` typedef —
  declared a local `StrataFaction = RulingFaction & {powerLabel?:string}` and
  cast the faction reads through it (avoided editing the shared type).
- Flush idiom: cards born flush — one framing `border:1px solid BORDER`, a single
  1px seam between cards (`borderBottom` except last), no radius, no gaps;
  breathing lives between strata (the Section headers). Pinned.

## Tests (all CONFIRMED green)
- `tests/components/powerStrata.test.jsx` (NEW, 7): census from real pipeline,
  criminal-never-a-power, roster completeness/isPower, web grouping + order,
  render determinism x2, holds-power marker→anchor, flush structure.
- `tests/components/powerTabSupport.test.jsx` (UPDATED, cited the order): support
  web now asserted on THE POWERS card (aria-label `${name} power details`).
- Untouched-and-green: powerTabLadder, dossierEntityLink (PILOT focus round-trip
  still lands the roster row), institutionLinkTabs, tabs.smoke.

## Deferred / not done
- No live-app browser screenshot (worktree-preview-serves-main-tree hazard);
  rendering proven by the real-pipeline render tests instead.
- Did NOT re-mount the dead EngineSections — out of scope; noted for the owner.
