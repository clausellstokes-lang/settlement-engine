/**
 * lib/flags.js — Feature flag registry.
 *
 * Every cross-cutting product change ships behind a flag so we can
 * roll back without redeploying. The funnel + UI redesign is a big
 * change touching dozens of components — without flags, "ship it" and
 * "revert it" both become multi-hour migrations.
 *
 * Resolution order (highest precedence first):
 *
 *   1. URL parameter  ?flag.homepageAnonGen=false   (persisted to localStorage)
 *   2. localStorage   key `flag.<name>`             (set by QA / devs)
 *   3. Vite env var   VITE_FLAG_<NAME_UPPERCASE>    (CI / staging overrides)
 *   4. Hard-coded default in this file              (what ships in prod)
 *
 * Keep defaults aligned with what should be live in prod. Flags are a
 * killswitch, not a substitute for a config file. If a flag would be on
 * everywhere forever, delete the flag and inline the change.
 *
 * Usage:
 *   import { flag, useFlag } from '@/lib/flags';
 *
 *   if (flag('discordOauth')) { ... }              // in plain JS
 *   const showRail = useFlag('pipelineRail');      // in React components
 *
 * Adding a flag: add a new entry to FLAGS below with `default` +
 * `description`. The description is shown in the dev panel and read by
 * the team — keep it short and concrete.
 */

import { useSyncExternalStore } from 'react';

// ── Registry ──────────────────────────────────────────────────────────────
// Every flag is declared here. New flags get added to this map, not as
// loose strings sprinkled through the codebase.
//
// `default` is what runs in prod when no override is set.
// `description` is shown in the dev flag panel.
export const FLAGS = Object.freeze({
  // ── Funnel / monetization ────────────────────────────────────────────────
  homepageAnonGen: {
    default: true,
    description: 'Anonymous one-shot generator on the homepage (no signup required).',
  },
  singleDossier: {
    default: true,
    description: '$2.99 single-dossier microtransaction (one PDF, no account).',
  },
  founderTier: {
    default: true,
    description: 'Founder Lifetime tier ($99 one-time, 500-seat cap).',
  },
  aiRepriced: {
    default: true,
    description: 'AI costs use the new schedule (3/4/5) instead of the legacy (8/10/12).',
  },
  packsRepriced: {
    default: true,
    description: 'Credit packs use the new schedule (25/60/150) instead of legacy (5/15/40).',
  },
  tierRenames: {
    default: true,
    description: 'Tier names use Wanderer/Cartographer instead of Free/Premium.',
  },

  // ── Auth ─────────────────────────────────────────────────────────────────
  discordOauth: {
    default: false,
    description: 'Discord OAuth button (off until the OAuth review completes).',
  },
  googleOauth: {
    default: false,
    description: 'Google OAuth button (off until the Supabase provider is configured).',
  },

  // ── Surface area ─────────────────────────────────────────────────────────
  gallery: {
    default: true,
    description: 'Public dossier gallery route at /gallery (SEO surface).',
  },
  pipelineRail: {
    default: true,
    description: '"How this was simulated" rail beside the dossier output.',
  },
  onboardingCoach: {
    default: true,
    description: 'Onboarding coach overlay shown after first generation.',
  },
  checklist: {
    default: true,
    description: 'Onboarding checklist on the dashboard for new accounts.',
  },

  // ── Accessibility ────────────────────────────────────────────────────────
  wcagBodyContrast: {
    default: true,
    description: 'Use ink-600 for body copy (passes WCAG 4.5:1) instead of muted-500.',
  },

  // ── P100–P127 critique implementation ──────────────────────────────────
  // Each flag gates one critique-mandated change so it can be flipped
  // dark → staff → GA independently. Defaults reflect the desired
  // production state after the phase ships; flip to false to roll back.
  pipelineReveal: {
    default: true,
    description: 'P100 / X-1: narrate pipeline steps during generation (visible wow).',
  },
  saveAsSignup: {
    default: true,
    description: 'P101 / X-3: active "Save this town — free account" button (replaces tombstone).',
  },
  dossierFiveTabs: {
    default: false,
    description: 'P102 / D-1: consolidate 14 dossier tabs into 5 thematic groups. DARK SHIP UNTIL VERIFIED.',
  },
  pricingMomentsFull: {
    default: true,
    description: 'P103 / X-2: full 8-moment pricingMoments wiring (save, cap, export, regen, etc.).',
  },
  welcomeCredit: {
    default: true,
    description: 'P104 / X-4: 1 free Narrate credit granted on signup, surfaced on first save.',
  },
  summaryMagazine: {
    default: false,
    description: 'P105 / D-2: Summary tab as magazine spread (left pitch / right Tonight at Table).',
  },
  inlineEdit: {
    default: false,
    description: 'P106 / E-1: click-to-edit names + pills + paragraphs in the dossier. DARK SHIP.',
  },
  workshopNav: {
    default: false,
    description: 'P107 / CP-2: Workshop as top-level nav destination (currently nested in Compendium).',
  },
  librarySearch: {
    default: true,
    description: 'P108 / E-6: campaign-aware library — search, sort, filter, phase chips.',
  },
  versionHistory: {
    default: false,
    description: 'P109 / E-5: per-settlement version timeline + diff + revert. Cartographer-gated.',
  },
  mapRoutesMode: {
    default: true,
    description: 'P110 / M-4 + P132 / M-4 promote: Routes mode in WorldMap toolbar. When active, surfaces the RoutesToolbar (filter relationship types, supply-chain emphasis, network-stress alert) and promotes relationship/road/chain layers to primary content.',
  },
  mapDropPreview: {
    default: false,
    description: 'P111 / M-3: hover-tooltip during drag with terrain + trade-route context.',
  },
  mapAutosave: {
    default: false,
    description: 'P112 / M-5: auto-save map state when a campaign is active.',
  },
  anonCapUnlock: {
    default: true,
    description: 'P113 / X-5: anon cap reframed as unlock (not block) + $2.99 side-door.',
  },
  inlineUpgrade: {
    default: true,
    description: 'P114 / X-7: inline upgrade cards at locked features (not modal walls).',
  },
  welcomeBack: {
    default: false,
    description: 'P115 / X-9: welcome-back hero variant on return visits + post-session check-in.',
  },
  founderRecognition: {
    default: false,
    description: 'P116 / X-8: Founder Lifetime surfaces only to demonstrated worldbuilders.',
  },
  heroV2: {
    default: false,
    description: 'P117 / H-1: two-voice hero rewrite (anti-AI as H1 + italic deck translation).',
  },
  // firstDossierCallouts moved to the P128-P146 critique-completion block
  // below (default:true, full description). Kept the original key + same
  // semantics; just renumbered the phase tag in the description.
  onboardingDiet: {
    default: false,
    description: 'P118 / O-1: collapse the 4-system onboarding pile-up to Checklist + first-dossier callouts only. Suppresses OnboardingCoach + nudge toast when on.',
  },
  wizardChromeDiet: {
    default: false,
    description: 'P119 / W-1: collapse 7 wizard chrome rows into one combined header.',
  },
  narrativeLayerStrip: {
    default: false,
    description: 'P121 / D-4: lift narrative buttons into labeled strip below dossier title.',
  },
  audiencePricingCopy: {
    default: true,
    description: 'P122 / X-10: audience-led pricing tile copy via useCopy().audience().',
  },
  mobileSingleChrome: {
    default: false,
    description: 'P123 / A-2: drop mobile top header; auth chip joins bottom nav.',
  },
  compendiumInlineHelp: {
    default: false,
    description: 'P126 / CP-1: "?" affordance on every config control opens Compendium snippet.',
  },

  // ── P128–P146 critique completion ────────────────────────────────────
  sampleProofCard: {
    default: true,
    description: 'P128 / H-2: sample dossier proof card below HomeHero for anonymous visitors (three audience callouts).',
  },
  summaryMagazineV2: {
    default: false,
    description: 'P129 / D-2: Summary tab as two-column magazine spread. Replaces single-column layout.',
  },
  firstDossierCallouts: {
    default: true,
    description: 'P130 / O-2: three teaching callouts (tension / supply / hook) on a first-time user\'s first generated dossier.',
  },
  inlineDossierEdits: {
    default: true,
    description: 'P131 / E-1: click-to-edit on dossier surfaces (settlement name, NPC names, faction labels) — commits flow through the pendingEdits queue + cascade preview.',
  },
  simulationDrawer: {
    default: true,
    description: 'P135 / D-5: move the Simulation tab content into a right-side slide-out drawer triggered by a "How this was simulated" link below the dossier header. Removes the tab from the strip.',
  },
  mapAutoSaveChip: {
    default: true,
    description: 'P136 / M-5: render a "Saved 2 min ago" / "Unsaved changes" pill in the WorldMap top toolbar so users see save state without pressing Ctrl-S anxiously.',
  },
  mapQuickInspector: {
    default: true,
    description: 'P136 / M-6: hover-peek card for placed settlements showing name + pressure + top hook. Distinct from the click-to-open PlacementDetailCard; uses hoveredSettlementId.',
  },
  aiPromptCopy: {
    default: true,
    description: 'P137 / HT-4: "Copy as AI prompt" button on the dossier — serialises the grounded prompt envelope for paste into ChatGPT/Claude. Reserved for signed-in users.',
  },
  accountFaq: {
    default: true,
    description: 'P138 / AC-4: inline FAQ accordion on the Account page (six common Qs: credit grant, cancel, refunds, founder, gallery privacy, AI-vs-sim).',
  },
  tableView: {
    default: false,
    description: 'P142 / D-6: 380px phone-optimized session-running view of a settlement.',
  },
});

// ── Resolution ────────────────────────────────────────────────────────────

const STORAGE_PREFIX = 'flag.';
const URL_PARAM_PREFIX = 'flag.';

// Parse "true" / "false" / "1" / "0" strings; anything else is undefined.
function parseBool(s) {
  if (s == null) return undefined;
  const v = String(s).toLowerCase().trim();
  if (v === 'true' || v === '1' || v === 'on' || v === 'yes') return true;
  if (v === 'false' || v === '0' || v === 'off' || v === 'no') return false;
  return undefined;
}

// Read from URL (?flag.X=true) and persist to localStorage as a side
// effect so the override survives a page refresh.
function fromUrl(name) {
  if (typeof window === 'undefined') return undefined;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(URL_PARAM_PREFIX + name);
  const v = parseBool(raw);
  if (v !== undefined) {
    try { window.localStorage.setItem(STORAGE_PREFIX + name, String(v)); } catch { /* private mode */ }
  }
  return v;
}

function fromLocalStorage(name) {
  if (typeof window === 'undefined') return undefined;
  try {
    return parseBool(window.localStorage.getItem(STORAGE_PREFIX + name));
  } catch {
    return undefined;
  }
}

// Read from Vite env. Convention: VITE_FLAG_HOMEPAGE_ANON_GEN.
function fromEnv(name) {
  if (typeof import.meta === 'undefined' || !import.meta.env) return undefined;
  const key = 'VITE_FLAG_' + name.replace(/([A-Z])/g, '_$1').toUpperCase();
  return parseBool(import.meta.env[key]);
}

/**
 * Read a flag's current value. Cheap — call it inline in render code.
 */
export function flag(name) {
  const decl = FLAGS[name];
  if (!decl) {
    if (import.meta?.env?.DEV) {
       
      console.warn(`[flags] unknown flag: ${name}`);
    }
    return false;
  }
  return (
    fromUrl(name)            ??
    fromLocalStorage(name)   ??
    fromEnv(name)            ??
    decl.default
  );
}

// ── React hook ─────────────────────────────────────────────────────────────
// Subscribes to localStorage changes so the dev flag panel can flip
// flags without a page reload.

const listeners = new Set();
function notifyAll() { for (const fn of listeners) fn(); }

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Imperatively set a flag override (writes to localStorage). Used by
 * the dev flag panel; not generally needed in product code.
 */
export function setFlagOverride(name, value) {
  if (typeof window === 'undefined') return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(STORAGE_PREFIX + name);
    } else {
      window.localStorage.setItem(STORAGE_PREFIX + name, String(value));
    }
    notifyAll();
  } catch { /* private mode */ }
}

/**
 * React hook. Re-renders when the flag override changes.
 */
export function useFlag(name) {
  return useSyncExternalStore(
    subscribe,
    () => flag(name),
    () => FLAGS[name]?.default ?? false,
  );
}

/**
 * Read all current flag values at once. Useful for dev panels and
 * for sending the flag state with error reports.
 */
export function getAllFlags() {
  const out = {};
  for (const name of Object.keys(FLAGS)) out[name] = flag(name);
  return out;
}
