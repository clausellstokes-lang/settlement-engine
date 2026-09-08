# W-Session scope — Session Mode + Foundry VTT export

Phase 5 reunification tail wave (docs/PHASE5_REUNIFICATION.md:73: "W-Session — session
mode + Foundry export (premium-adjacent to Export PDF)"). Scoped 2026-07-11 against
review-fixes-2026-07-08 @ 75fa1202. Two independent deliverables, both display-only:
nothing touches generation, worldPulse mechanics, or any golden-pinned derivation.

## Substrate findings (what exists, what doesn't)

- **Greenfield**: no session/Foundry/VTT surface exists in this tree or the read-only
  reference tree (`/Users/cstokes/Desktop/settlement-generator/settlement-engine`) —
  every 'foundry' hit is the craft-building regex vocabulary; nothing to adopt.
- **`buildSummaryMarkdown.js` does not exist on this lineage** (master-only module,
  born on the settlementforge-export chain). Building Foundry content over it would
  entangle this wave with the unresolved master reconciliation. Instead:
- **`buildViewModel` (src/pdf/lib/viewModel.js:160) is the canonical content source**
  — pure, worker-proven, threads `{settlement, aiSettlement, narrativeMode, systemState,
  eventLog, phase, campaign}` and exposes per-section slices (summary/identity/overview/
  power/economics/defense/services/resources/viability/history/npcs/hooks/relationships)
  plus `liveWorld` via buildPdfLiveWorld. The PDF `.jsx` sections are presentation-only;
  the reusable string helpers are src/pdf/lib/headlines.js and src/pdf/lib/format.js.
- **The faith seam** is threefold and already pure: `faithChapterVisible({variant,
  phase, hasLiveWorld, faithUnlocked})` (src/pdf/variants.js:183) = variant-included
  AND live-world non-dormant AND `faithUnlocked` (computed at the call site as
  `auth?.tier === 'premium' || isElevated()`, SettlementDetail.jsx:348). On screen the
  same seam is FaithSection.jsx:269-280 (self-gating three-mode component).
- **Distraction-free precedent**: TableView.jsx (P142/D-6) — fully presentational
  lazy overlay mounted behind `flag('tableView')` + a store pref, no route. This is
  the mounting pattern for Session Mode; a top-level ROUTES entry would cost eager
  bytes + sitemap regeneration for no benefit.
- **First-paint budget is the binding constraint**: closure measured 1,440,058 of
  1,441,000 — **942 bytes of headroom**. en.js copy rides the first-paint data chunk;
  flags.js is eager. The documented Rollup-hoist trap (vendorPdfLazy.test.js:202-225)
  fires when a NEW lazy surface becomes a second importer of shared read-models.

## Decisions

### D1 — Foundry packaging: module zip with a static loader script
Foundry v12+ removed NeDB packs and LevelDB compendia cannot be built client-side, so
"module with packs" is off the table. The module zip contains:

```
settlementforge-<slug>/
  module.json            manifest: id, title, description, version "1.0.0",
                         compatibility { minimum: "11", verified: "13" },
                         esmodules: ["scripts/init.js"]
  scripts/init.js        STATIC loader, identical bytes in every export (no user
                         content interpolated — injection-proof by construction):
                         on ready + GM, idempotently offers to create a folder +
                         JournalEntry docs from data/journals.json
  data/journals.json     array of JournalEntry document data
  data/<slug>.json       the settlement journal as a single document — Foundry's
                         per-document "Import Data" manual fallback
  README.md              install + manual-import instructions
```

Journal mapping: **one multi-page JournalEntry per settlement**; pages are
`type:'text'` with `text.format = 2` (markdown — Foundry-native since v10, sidesteps
HTML sanitization; `<`/`>` escaped in interpolated values). Page set mirrors the PDF
chapter list and honors the **same `PDF_VARIANTS` chapter-inclusion map** via
`shouldInclude` — the ExportSheet variant the user picked applies to both formats.
NPCs are journal pages (one Quick Ref page + one page per notable NPC by the
NotableNPCs tiering rule); **actor stubs are out** (system-specific dnd5e schema,
brittle across systems — future work).

### D2 — Foundry faith gate: reuse `faithChapterVisible` itself
The Faith & War journal page is emitted only when
`faithChapterVisible({variant, phase, hasLiveWorld: !!vm.liveWorld, faithUnlocked})`
is true — the literal same predicate the PDF uses, not a mirror of it. Default-safe
(`faithUnlocked` defaults false). Additionally the free/anon guarantee is pinned
string-level in tests: a free export of a deity-carrying settlement produces module
bytes that contain **no deity name anywhere** (tests/foundry/foundryFaithGate.test.js,
mirroring tests/pdf/faithWarGate.test.js).

### D3 — Zip: hand-rolled store-only writer, no new dependency
No zip lib exists in package.json (10 runtime deps, tight discipline). A STORE-only
(uncompressed) zip writer with a CRC-32 table is ~90 lines, fully deterministic
(fixed DOS timestamp), and unit-testable byte-for-byte. Foundry modules are tens of
KB — compression is irrelevant. Lives in src/foundry/zip.js; deterministic output
means the manifest/zip tests can pin structure without golden churn.

### D4 — Mount point: a Format toggle inside ExportSheet
ExportSheet gains a "Format" section (PDF Dossier / Foundry VTT Module) parallel to
the existing Source (Raw/AI) toggle, driven by a new **optional** prop
`onExportFoundry` — absent, the sheet renders exactly as today (ExportDraftButton and
any other mount unchanged). `PDF_VARIANTS` is not polluted: it stays the shared
chapter-inclusion contract; the CTA label switches on format. SettlementDetail threads
`onExportFoundry` to both of its ExportSheet mounts; the handler reuses the exact
campaign-prop assembly of handlePdfExport (owning-campaign scan → plain cloneable
`{settlementId, worldState, regionalGraph, settlements, nameById}` + `faithUnlocked`)
and dynamic-imports `src/foundry/generateFoundryModule.js` on click (the
generateSettlementPDF lazy contract, pinned by a new source-contract test).
No worker: zip+JSON is milliseconds of main-thread work (the PDF worker exists for
@react-pdf's multi-second layout freeze).

Scope cuts (v1): no Foundry on the anonymous SingleDossierSuccessPage (changes what
the one-shot purchase includes — a product decision for the owner); no Foundry on
ExportDraftButton (drafts have no campaign/faith and low VTT value); no standalone
whole-campaign module (the campaign's Faith & War content already rides the
settlement journal when premium + live, exactly like the PDF; generateCampaignPDF is
the precedent for a later campaign-wide module).

### D5 — Session Mode: lazy overlay from SettlementDetail, TableView pattern
A full-viewport, distraction-free DM surface (`src/components/session/SessionMode.jsx`)
lazy-mounted from SettlementDetail behind `flag('sessionMode')` — no ROUTES entry, no
sitemap change, zero eager bytes beyond the flag entry. Desktop-width composition of
**existing pure read-models** (compose, never fork):

- Tonight at the Table — `tonightAtTheTable(settlement)` (domain/summary)
- Key NPCs — `settlement.npcs` sorted by power (NotableNPCs tiering), roles/goals/
  secrets visible (DM-facing surface, same disclosure as the dossier)
- Hooks — `collectPlotHooks(settlement)` grouped by severity/category
- Living world now — `settlementSignals(...)` (livingWorldSignals.js, pure) +
  SystemState four-dim bands + recent chronicle tail; owning campaign resolved by
  the WarFaithTab scan (`campaigns.find(c => settlementIds includes String(saveId)
  && c.worldState?.canonizedAt)`), worldState read only from campaign objects —
  **no DO-NOT-TOUCH file is imported or modified**
- Faith — **mount `FaithSection` as-is** (self-gating; constitutional compliance by
  composition, identical to the dossier)
- Quick nav rail + Esc/close; draft-phase degrades gracefully (no events, derived
  systemState, no campaign signals)

Store reads (phase/eventLog/systemState/campaign scan) happen inside the lazy
SessionMode chunk; SettlementDetail adds only a flag-gated button + lazy mount.

Sequencing note: PHASE5_CONTENT_ARCHITECTURE.md:125 sequenced session mode "after
the repaint". This wave was dispatched now on this floor; the surface is an overlay
composing shell-independent read-models + components from the current (partially
repainted, components/new) shell, so the coupling risk that note guarded against is
minimal. Accepted deviation, flagged for the manager.

### D6 — Budget survival plan (942 B headroom)
- New-surface **copy lives in lazy modules co-located with the surfaces**
  (src/foundry/foundryCopy.js, src/components/session/sessionCopy.js), NOT en.js —
  en.js rides the first-paint data chunk. This follows the ratchet-down program's own
  direction (deep-surface namespaces load with their surfaces).
- Two terse flags.js entries (`sessionMode`, `foundryExport`, both default true,
  one-line descriptions) — the only intentional eager bytes (~300 B).
- Analytics: one EVENTS entry (`FOUNDRY_EXPORT_COMPLETED`) in the frozen table
  (validated by the funnel-event-contract lint rule) — small eager cost, unavoidable
  (ad-hoc event names are rejected at runtime).
- Measure the closure after each mount; if the ratchet trips, the fix is a
  compensating lazy-split in our own additions, never a budget raise.

### D7 — Tests
- tests/foundry/zip.test.js — CRC-32 vectors + zip structure (EOCD/central directory
  parse) + byte-determinism across two builds.
- tests/foundry/foundryManifest.test.js — manifest shape (id slug rules,
  compatibility block, esmodules), file set, journal/page shape, variant chapter
  inclusion.
- tests/foundry/foundryFaithGate.test.js — the constitutional mirror of
  tests/pdf/faithWarGate.test.js: default-safe, free/anon string-level no-deity-name
  guarantee, premium+canon+live shows the page, draft/timeline_packet variants never.
- tests/components/sessionMode.test.jsx — jsdom + store shim (faithSection.test.jsx
  pattern): content renders; a free/anon render of a latent-deity settlement never
  names the deity.
- tests/build/foundryLazy.test.js — source contract: SettlementDetail reaches the
  Foundry generator only via dynamic import(); no eager module imports src/foundry/.

## Gates (per commit)
eslint clean · tsc -p tsconfig.full.json · npm run build · npm run verify:dist
(budget 1,441,000) · goldens byte-identical (`npx vitest run -t "golden"`) · focused
faith-gate + manifest tests. Goldens are generation/pulse/view-model pins — these
surfaces are read-only over them, so any golden diff means a bug here, full stop.
