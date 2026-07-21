# CYCLE 3 — COLD COMPREHENSIVE REVIEW: audit + triage (2026-07-21)

Method: the owner-ordered COLD review (protocol 05024fda) — reviewer agents got the CODE ONLY,
no prior audit docs / ledgers / memories, and re-derived findings from scratch. 12 lenses
(10 general + the owner-demanded FMG-fork + subsystem-census), 116 agents, each C/H finding
run through a 3-vote adversarial refutation panel. **45 CONFIRMED (survived refutation), 9
refuted.** Severity mix: **1 Critical · 21 High · 23 Medium.** Full per-finding detail +
3-vote panels: the workflow result (run wf_e9694cf6-021).

The review's headline vindication: it found real, verified defects two warm cycles + a
15,832-test enforcement layer missed. The pattern — defects cluster in **derived-display,
import/security seams, the FMG fork, and generator prose composition**; the core kernels came
through clean. It also confirmed a prediction: the composed-prose seams I flagged on the UI tour
(dangling articles, raw brace tokens, authoring prefixes leaking into output) are real (H2, H5–H7).

## TRIAGE (by disposition — every finding accounted for)

### ✅ FIXED THIS CYCLE (reversible, in-scope repair, verified)
- **C1** FMG-fork SVG-sanitizer XSS (`public/map/modules/ui/general.js`) — same-origin token
  exfiltration via `<iframe srcdoc>`/`<object>`/`foreignObject`/etc. FIXED @ d2471e36
  (sibling-denylist match + SVG-specific vectors; mapForkXssChain +5 cases, 50/50).
- **H19** `campaignSlice.js` unscrubbed map-import config (foreign-pantheon activation) —
  FIXED @ 305889b8 (scrubImportedConfig; dormancy pin added).

### ⛔ OWNER-QUEUE — DEPLOY/SQL/PAID-SURFACE (gated; exact fixes recorded, NOT auto-applied)
- **H21** migration 142 — public dossier NPC allowlist applies only under key `npcs`, so
  `factions[].members[]` leak DM-private `goal` to anon. FIX: extend the allowlist to
  members[] (or strip `goal` there). SQL migration = owner deploy.
- **H20 / M22** `stripe-webhook` — ANY refund treated as full reversal; a partial/goodwill
  refund claws back the whole founder_lifetime seat (H20) and poisons the $2.99 dossier
  entitlement (M22). Edge-fn money logic = owner deploy.
- **M23** `verify-checkout-session` — the only money endpoint with no rate limiter. Owner deploy.
- **M11** `SingleDossierSuccessPage` — Turnstile inert on the first verify (token mints async
  after the call). Paid-surface; owner posture.
- (Pairs with the **vercel.json** CSP Report-Only→Enforce item = T5 owner posture — the
  defense-in-depth layer behind C1.)

### ⛔ ONE-REGEN QUEUE (T4) — fixes that SHIFT generated output (golden re-record required)
- **H15 / H16** `deriveSystemState` dead vocabulary — threat branches on `'safe'`/`'civilized'`
  (generator emits `'heartland'`) and stressor `'occupation'` (emits `'occupied'`); the safest
  town scores worse than unknown, an occupied town reads as no-threat. FIX ready; shifts threat
  values → golden.
- **H4** `factionDynamics.safetyContrib` — missing `critical/controlled/restricted/quarantined`
  prefixes → crisis towns contribute 0 to legitimacy safety. Shifts legitimacy → golden.
- **H5 / H6 / H7 · M1 / M3 / M4** generator prose seams — unfilled `{brace}` tokens (H5), doubled
  articles (H6/M3), `The The`-prefix (H7), raw `PLOT HOOK:`/camelKey leakage (H2 is display so
  fixable; M1 camelKey is display). The generator-side ones shift golden prose → batch with the
  ONE REGEN em-dash sweep.

### 🔧 FIX-WAVE QUEUE (reversible, NO golden shift — a normal cycle-3 fix program)
- **FMG fork (high):** H9 `tip()` unescaped map names (escapeHtml exists — apply it); H10
  sf-bridge reports `pack.seed` which FMG never sets (read the global `seed`); **H11
  `versioning.cleanupData()` calls `localStorage.clear()` + nukes Cache Storage on the SHARED
  host origin — destroys the host Supabase session + caches** (scope the clear to map-only keys).
- **Perf (no output change):** H17 npcAgency O(S²) per tick; H18 roadsKernel O(S²) war/dominion
  scans; M17–M20 roadsKernel/stressorDynamics/worldSnapshot per-call rescans + a WeakMap cache
  miss (worldSnapshot mints a fresh object so `derivationCache` never hits). Index/memoize.
- **Display contracts (fixable, verify golden-neutral):** H1 DossierHeaderRow missing `heartland`
  threat arm (+ dead `embattled`); H3 defenseDisplay maps 6 of 15 stress types; H14
  dramaticIronyBrief reads the wrong rumor shape (whole irony feature dead); H2 EconomicsTab
  renders the `PLOT HOOK:` prefix raw; M2/M5/M14/M15/M16 contract/state gaps.
- **UI / a11y:** H12 EntityPicker mouse-only (keyboard/SR dead-end); H13 PurchaseModal clips on
  short viewports; M9 GalleryDescriptionEditor toolbar keyboard-inert; M10 PostGenCoach ×
  FeedbackWidget z-index collision; M12 TableView no focus trap; M13 Glossary focus-trap keyed
  on onClose identity.
- **Test-integrity (tests that lie):** H8 refundPolicy claims exhaustive over the FailureStage
  union but hardcodes 3 stages; M6/M7/M8 contract/privacy/drift tests vacuous (`if(!msg)continue`,
  empty-body fallback, metachar-stripped token list).
- **Determinism:** M21 `Editable.safeName` falls back to `Math.random()` for a falsy field name.

## FULL CONFIRMED LIST (45; C→H→M, file:line + lens)
See scratch extraction and the workflow result for the complete claim + failure-scenario +
3-vote panel per finding. The disposition above assigns every id.

## SEQUENCING (wave-program discipline)
Fix from THIS doc, not from the raw review. Waves fix by disposition class; each wave = one
gated commit; golden-shifting fixes wait for the owner's ONE REGEN; deploy/SQL/paid wait for the
owner. ⚠️ Every fix-wave gate runs the FULL lint/copy families (the cross-lane-catch class).
The 9 refuted findings are recorded in the workflow result — do NOT re-report them.
