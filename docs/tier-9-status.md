# Tier 9 — Status & Queue

Tier 9 is "operational hygiene that compounds quietly over years."
Several items are explicitly blocked on earlier-tier prerequisites
per the roadmap. This document tracks what's done, what's queued,
and what the actual unblocker is for each pending item.

## Status snapshot

| Item | Title                                                  | Status        | Closer / blocker |
|------|--------------------------------------------------------|---------------|------------------|
| 9.1  | Modular content packs                                  | 🅿️ Queued     | Needs 1.5 (stable IDs/tags) + 4.15 (genre profile inputs) wired through entity loader |
| 9.2  | Replace inline styles with style system                | 🅿️ Queued     | Defer until Tiers 0–7 healthy — this is the spec's explicit guidance |
| 9.3  | Vendored Azgaar map artifact maintainability           | 🅿️ Queued     | Needs 3.6 (map bridge contract test) to stay green, plus a Worker boundary refactor |
| 9.4  | Lint warning cleanup (528 → near-zero)                 | ✅ Closed (P47) | — |
| 9.5  | Per-step PRNG forking determinism preservation         | ✅ Closed      | Preserved through P63 (legacy quarantine); ongoing vigilance |
| 9.6  | Engine chunk size budget                               | 🅿️ Queued     | Blocked by 1.7 (retire legacy generator paths). Once the legacy generator is dead, the engine chunk drops naturally |
| 9.7  | vendor-pdf lazy verification                           | ✅ Done (P86)  | Build-time test in `tests/build/vendorPdfLazy.test.js` |
| 9.8  | Generator file size discipline (split by subsystem)    | 🅿️ Queued     | Blocked by Tier 1 (canonical schema) + Tier 2 (trace layer) — split by causal subsystem, not by syntax |
| 9.9  | Refund logic ledger consistency audit                  | ✅ Done (P87)  | Audit in `docs/refund-ledger-audit.md` + RPC contract test |

## Queued items in detail

### 9.1 — Modular content packs

**What it is.** Pack architecture: Desert Settlements, Coastal Trade,
Gothic Horror, High Magic Cities, Frontier Survival, Underdark,
War-Torn Borderlands. Each pack contributes resources, institutions,
factions, threats, NPC roles, hooks, event types, district types,
supply chains, narrative style hints.

**Why queued.** The pack system needs to register content into the
generator's catalogs at boot. That requires:
- Tier 1.5 (stable IDs + tags on every mechanical entity) so packs
  can refer to base entities by id rather than by name.
- Tier 4.15 (genre controls as simulation inputs) so packs can carry
  genre modifiers without each pack inventing its own format.

**Unblocker.** Land 1.5 + 4.15. Then write a `src/data/packs/` loader
that reads pack manifests + merges them into the catalog at boot.
The first pack ships behind a flag for safe iteration.

### 9.2 — Replace inline styles with consistent style system

**What it is.** ~80 components use `style={{ ... }}` objects inline.
Migrate to CSS Modules + design-token CSS variables, or to a
styled-system library, so a single token change ripples through every
surface.

**Why queued.** This is the spec's biggest single deferred line. From
the roadmap: "Big lift; defer until tier 0–7 are healthy." Tier 7 is
now healthy. The lift is real (every component touched), but it
becomes tractable once the design-system primitives (P64–P68) are
fully consumed by the legacy tabs — at that point fewer files have
inline styles.

**Unblocker.** Finish the UI redesign rollout (Tier 7.15 Wave 2+ —
BandPill / CanonBadge / RegenerationModeSelector consumers). Then
sweep the remaining inline-style components in waves of ~10 files.

### 9.3 — Public/map vendored Azgaar artifact

**What it is.** The `public/map` directory is a vendored Azgaar Fantasy
Map Generator build. It runs in an iframe; we communicate with it
via the bridge contract (Tier 3.6). Updates to the upstream Azgaar
project require a manual artifact swap.

**Why queued.** Lifting the map into our build pipeline means either:
- Forking Azgaar (high maintenance), or
- Moving map functionality to a Worker boundary (significant refactor).

Neither is justified until upstream Azgaar lands an update we
actually want. The bridge contract test (Tier 3.6) catches any
breaking change to the iframe protocol, so the vendored artifact is
safe as-is.

**Unblocker.** Next Azgaar upstream update we want. Until then,
maintain the bridge contract.

### 9.6 — Engine chunk size budget

**What it is.** The `engine` chunk is ~600 kB minified (~187 kB
gzipped). Loaded on first generation. Could likely be smaller.

**Why queued.** Blocked by Tier 1.7 (quarantine legacy generator). The
legacy `generateSettlement.js` and its parallel hydration paths still
live in the engine chunk; until they're retired, optimisation work
on the engine chunk would have to be replicated when the legacy code
goes.

**Unblocker.** Finish 1.7 (legacy generator fully off). Then:
1. Re-measure engine chunk size — many duplicate utilities may
   collapse naturally.
2. Identify the next-largest contributors via vite's bundle
   visualizer (`ANALYZE=1 npm run build`).
3. Decide whether further splitting is worth the cognitive cost.

### 9.8 — Generator file size discipline

**What it is.** The largest source files:
- `namingData.js` (4,000 LOC)
- `economicGenerator.js` (2,500 LOC)
- `powerGenerator.js` (2,400 LOC)
- `institutionalCatalog.js` (2,400 LOC)
- `servicesGenerator.js` (2,300 LOC)

**Why queued.** The roadmap is explicit: "After Tier 1 (schema) and
Tier 2 (trace layer), split by *causal subsystem*, not by syntax."
Splitting by file would be cosmetic; splitting by subsystem (e.g.
`power/legitimacy.js`, `power/factions.js`, `power/succession.js`)
requires the trace layer to give us a way to reason about which
function belongs to which subsystem.

**Unblocker.** Finish Tier 1 + Tier 2. Then:
1. Use the trace layer to map every generator function to one
   causal subsystem (legitimacy, food security, public order, etc.).
2. Refactor by moving functions into subsystem folders.
3. Keep cold-loaded data tables (namingData.js) monolithic — they
   don't need splitting, just lazy loading.

## What's actively shipping

The two Tier 9 items delivered this cycle:

- **9.7 — vendor-pdf lazy verification**
  Build-time test (`tests/build/vendorPdfLazy.test.js`) asserts
  the chunk is isolated, large, and never preloaded.
  Source-level test asserts every PDF consumer uses dynamic import.

- **9.9 — refund ledger consistency audit**
  Audit doc (`docs/refund-ledger-audit.md`) enumerates every
  credit-touching path with current implementation + migration
  status. Contract test (`tests/security/refundLedger.contract.test.js`)
  pins the three ledger-consistent RPCs (`spend_credits`,
  `refund_credits`, `admin_grant_credits`) so a future schema
  refactor can't silently break them.

The migration of the direct-write call sites (stripe-webhook,
admin-actions, generate-narrative spend) onto the RPCs is queued as
follow-up commits per the audit — one per path, with its own tests
and rollback boundary.
