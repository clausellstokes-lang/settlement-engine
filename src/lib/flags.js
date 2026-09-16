/**
 * lib/flags.js — Feature flag registry (descriptions + composed FLAGS object).
 *
 * Every cross-cutting product change ships behind a flag so we can
 * roll back without redeploying. The funnel + UI redesign is a big
 * change touching dozens of components — without flags, "ship it" and
 * "revert it" both become multi-hour migrations.
 *
 * ── MODULE SPLIT (R-14 first-paint reclaim) ──────────────────────────────────
 * The RESOLUTION CORE — the name→default map and the URL/localStorage/env/default
 * lookup — lives in lib/flagRegistry.js, which is first-paint-safe (it carries no
 * prose). This module is the LAZY sidecar: it re-exports that API verbatim and
 * adds the description prose plus the composed `FLAGS` object the dev flag panel
 * reads. Crash forensics imports getAllFlags from flagRegistry.js directly, so the
 * ~4.5 KB of descriptions below never reach the eager crash-forensics closure (the
 * registryProse idiom — see tests/build/vendorPdfLazy.test.js). Every existing
 * consumer imports `flag` / `useFlag` / `getAllFlags` / `setFlagOverride` from THIS
 * module unchanged.
 *
 * Resolution order (highest precedence first):
 *   1. URL parameter  ?flag.heroV2=true             (persisted to localStorage)
 *   2. localStorage   key `flag.<name>`             (set by QA / devs)
 *   3. Vite env var   VITE_FLAG_<NAME_UPPERCASE>    (CI / staging overrides)
 *   4. Hard-coded default in flagRegistry.js         (what ships in prod)
 *
 * Usage:
 *   import { flag, useFlag } from '@/lib/flags';
 *
 *   if (flag('discordOauth')) { ... }              // in plain JS
 *   const showHero = useFlag('heroV2');            // in React components
 *
 * Adding a flag: add a `default` to FLAG_DEFAULTS in flagRegistry.js AND a
 * matching `description` to FLAG_DESCRIPTIONS below. The description is shown in
 * the dev panel and read by the team — keep it short and concrete. (The
 * every-flag-has-both invariant is pinned by tests/lib/flags.test.js.)
 */

import { FLAG_DEFAULTS } from './flagRegistry.js';

// Re-export the resolution API so this module stays the single import surface for
// every product consumer. flagRegistry.js is the first-paint-safe home; the
// re-export keeps ~20 import sites (and the tests) untouched.
export { flag, useFlag, setFlagOverride, getAllFlags } from './flagRegistry.js';

// ── Descriptions ────────────────────────────────────────────────────────────
// name → the dev-panel copy. Kept out of the first-paint closure (only the lazy
// dev flag panel reads it). Every FLAG_DEFAULTS key must have an entry here — the
// composed FLAGS object below and tests/lib/flags.test.js enforce it.
const FLAG_DESCRIPTIONS = Object.freeze({
  discordOauth: "Discord OAuth sign-in button. Safe flag-on: an unconfigured provider degrades to a calm message.",
  googleOauth: "Google OAuth sign-in button. Safe flag-on: an unconfigured provider degrades to a calm message.",
  copyGuard: "Site-wide copy/cut/context-menu deterrent (lib/copyGuard.js). Default OFF per owner ruling (reconciliation #5); machinery + [data-allow-copy] exemptions retained. This is the one flag to flip to enable.",
  perimeterCaptcha: "Wave-D PERIMETER: adaptive human-verification (Cloudflare Turnstile, managed/invisible mode) on the auth flows (sign-in/up/reset) and the purchase-initiation surfaces. Default OFF and INERT: with the flag off the widget is never imported (zero eager bytes) and no captchaToken is sent. Flip ON only AFTER the owner adds the Turnstile site+secret keys and enables Supabase Auth captcha protection — see docs/PERIMETER_RUNBOOK.md. The anonymous generation funnel is DELIBERATELY excluded (kept frictionless; rate limits + bot-wave telemetry cover it).",
  imFellDisplayFace: "V-27d: swap the DISPLAY face (hero + section titles only, not prose) to IM Fell English via the runtime --oc-display-face var. Default OFF and INERT: with the flag off neither lib/flags nor lib/imFellFace enters the first-paint closure (both load via dynamic import) and no @font-face is injected (zero eager bytes). Lighting it is the owner TASTE flip AND requires vendoring the IM Fell OFL woff2 into public/fonts/ — see src/lib/imFellFace.js. Until the woff2 is present the flag-on path degrades to the Crimson serif fallback.",
  dossierFiveTabs: "P102 / D-1: consolidate 14 dossier tabs into 5 thematic groups. PROMOTED default-on; flag retained as soak killswitch.",
  inlineEdit: "P106 / E-1: click-to-edit names + pills + paragraphs in the dossier. PROMOTED default-on; flag retained as soak killswitch.",
  settlementWorkbench: "Game-grade G-2 proof: contextual Entity Inspector and save-scoped Change Dock around the existing dossier. Default OFF until the machine-readable G-2b parity and lived-orientation contract is complete.",
  heraldCommandBrief: "Game-grade G-4 proof: decision-oriented Herald briefing over the canonical RealmItem adapters. Default OFF until source/content, history, security, accessibility, performance, and durable-receipt parity is complete.",
  realmItemShadowDiagnostics: "Game-grade G-3 internal shadow accounting: source coverage, exclusions, and collisions behind either Herald shell. Default OFF by design; this diagnostic is not a user-facing promotion candidate.",
  settlementScene3d: "Makes the lazy illustrated 3D settlement portrait selectable. Default ON for opt-in evaluation; the canonical 2D plan remains available for precision, accessibility, export, and constrained devices.",
  settlementScene3dDefault: "Promotion switch for opening settlements in the 3D portrait. Default OFF until docs/TOWN_SCENE_PROMOTION_CONTRACT.json has complete local and external evidence; user preference, reduced capability, and adaptive 2D fallback still take precedence after promotion.",
  workshopNav: "P107 / CP-2: Workshop as top-level nav destination. PROMOTED default-on; flag retained as soak killswitch.",
  canonicalViewModel: "M0.1 / doc §1: route food balance + export posture + viability through the canonical display model (deriveDossierViewModel). PROMOTED default-on; flag retained as soak killswitch.",
  pdfVisualChains: "Render PDF supply chains as the web visual node-flow (SupplyChainFlow) instead of flat PROC/OUT/DEP rows. PROMOTED default-on; flag retained as killswitch.",
  versionHistory: "P109 / E-5: per-settlement version timeline + diff + revert. Cartographer-gated. PROMOTED default-on after revert-mutation soak (P133).",
  mapDropPreview: "P111 / M-3: hover-tooltip during drag with terrain + trade-route context.",
  mapAutosave: "P112 / M-5: auto-save map state into the active campaign (rides the campaign cloud sync, so maps persist per account and across devices). PROMOTED default-on.",
  welcomeBack: "P115 / X-9: welcome-back hero variant on return visits + post-session check-in.",
  founderRecognition: "P116 / X-8: Founder Lifetime surfaces only to demonstrated worldbuilders.",
  heroV2: "P117 / H-1: two-voice hero rewrite (anti-AI as H1 + italic deck translation).",
  wizardChromeDiet: "P119 / W-1: collapse 7 wizard chrome rows into one combined header.",
  narrativeLayerStrip: "P121 / D-4: lift narrative buttons into labeled strip below dossier title.",
  mobileSingleChrome: "P123 / A-2: drop mobile top header; auth chip joins bottom nav.",
  compendiumInlineHelp: "P126 / CP-1: \"?\" affordance on every config control opens Compendium snippet. Promoted on.",
  summaryMagazineV2: "P129 / D-2: Summary tab as two-column magazine spread. Replaces single-column layout.",
  tableView: "P142 / D-6: 380px phone-optimized session-running view of a settlement.",
  landingV2: "DEPRECATED / inert — the scrollable landing no longer forks on this flag (HomeLanding rewrite). Kept as a registry entry only.",
  advanceMultiTick: "PROMOTED default-on; flag retained as soak killswitch. Advance runs N real one-week ticks per interval (month=4, season=13, year=52) with a progress bar + pause/resume + auto-resolve toggle. Set false to fall back to the byte-identical single-tick advance.",
  simAdvanceWorker: "Run the multi-tick world advance in a Web Worker (main thread stays interactive). Byte-identical output; set false to fall back to the in-thread advance.",
  advanceWorkerParanoia: "DEV-ONLY: re-run each Web Worker advance in-thread and diff the two worldStates, surfacing any determinism divergence. Default OFF; inert in production builds (import.meta.env.DEV gate) even if forced on. Doubles advance compute while on.",
  handbookVoice: "V-26b: house-voice rewrite of the Keeper's Handbook narrative prose (header + concept essay), staged dark. OFF (default) = the exact current copy. Flip ON to preview; the steps/Reference/FAQ stay plain in both. Owner taste flip.",
  warEconomySurfacing: "A read-only \"War & Resolve\" tab surfacing each settlement's Hope / Resolve / Faith relation / Supply / pro-war vs anti-war balance, and the same signals grounding the AI narrative + daily-life prose. Display-only; touches no simulation state.",
  sessionMode: "W-Session: distraction-free run-of-play overlay on a saved settlement.",
  foundryExport: "W-Session: Foundry VTT module export beside the PDF in ExportSheet.",
  pricingSimulationCopy: "Simulation-led premium pricing copy. ON (default) = \"generate a town, then run the region\" — names the simulation, never size. OFF = the old \"unlimited saves / full size\" copy.",
  loadingJourneyFilm: "C2L: the progress-scrubbed journey film as the loading backdrop (generation + realm). ON is the selected default; OFF retains the stills-only accessibility/fallback floor.",
  welcomeJourneyFilm: "C2: the scroll-scrubbed journey film behind the Welcome page. ON is the selected default; OFF retains the stills-only, zero-video-byte floor.",
});

// ── Composed registry ────────────────────────────────────────────────────────
// The human-facing map every dev-panel / doc-shape consumer reads: each flag as
// { default, description }. Rebuilt from the two single-source maps above so a
// missing description surfaces immediately (undefined ⇒ the flags.test.js
// "every flag has a default + description" pin fails).
export const FLAGS = Object.freeze(
  Object.fromEntries(
    Object.keys(FLAG_DEFAULTS).map((name) => [
      name,
      { default: FLAG_DEFAULTS[name], description: FLAG_DESCRIPTIONS[name] },
    ]),
  ),
);
