/**
 * copy/strings.js — Single source of microcopy for the campaign-state
 * UI surface.
 *
 * The audit's first recommendation was to teach the world-state mental
 * model (Run → Draft → Canon → Event → Timeline → Export) through
 * consistent vocabulary. Hard-coding "Generate Settlement" in every
 * call site fights that model. Routing through this file means a copy
 * tweak — "Build Draft" vs "Generate Draft" — is a single edit.
 *
 * Convention: keys are nested by surface, not by feature. e.g.
 *   COPY.generate.quickMode.cta  not  COPY.quickGenerate
 * because the same string may show up in multiple surfaces (button,
 * empty state, breadcrumb) and we want the surface to be the index.
 *
 * Avoid imperative verbs that fight the lifecycle:
 *   ❌ "Generate Settlement" → users think the artifact is done
 *   ✅ "Generate Draft"      → users learn that draft is the default
 */

export const COPY = {
  generate: {
    quickMode:    { title: 'Quick Generate',    cta: 'Generate Draft', subtitle: 'Minimal config — set the foundations and go' },
    advancedMode: { title: 'Advanced Generate', cta: 'Generate Draft', subtitle: 'Full configuration, step by step' },
    customMode:   { title: 'Custom Generate',   cta: 'Build Draft',    subtitle: 'Power-user dashboard with every parameter exposed' },
    regenerate:   { cta: 'Regenerate Draft',    confirm: 'Regenerate the world? All unsaved placements will be lost.' },
  },

  save: {
    primary:  'Save Draft',
    cloud:    'Save Draft to Cloud',
    saved:    'Draft saved',
    overwrite:'Save replaces the existing draft for this slot.',
  },

  detail: {
    canonizeCta:    'Canonize for Campaign',
    canonizeHint:   'Marks this town as part of your campaign world. Future changes become events on a timeline.',
    canonizeAfter:  'Canon. Changes from here become campaign events.',
    resetToDraft:   'Reset to Draft',
    resetWarning:   (n) => `Reset to draft and discard ${n} timeline entr${n === 1 ? 'y' : 'ies'}? This cannot be undone.`,
    backToList:     'Back to list',
  },

  events: {
    panelTitleDraft: 'Test a Change (Draft)',
    panelTitleCanon: 'Apply In-World Event',
    previewCta:      'Preview',
    applyDraftCta:   'Apply',
    applyCanonCta:   'Apply to Timeline',
    cancelCta:       'Cancel',
  },

  timeline: {
    title:        'Timeline',
    emptyState:   'Apply an in-world event to start the timeline.',
    undoTooltip:  'Undo this event — restores prior state',
  },

  ai: {
    inlineHook:   'Want table-ready prose?',
    // Cost is interpolated by the consuming component so the hint stays
    // honest when the pricing config flips schedules. See aiInlineHint().
    inlineHintFn: (cost) => `${cost} credit${cost === 1 ? '' : 's'} · streams section by section · partial failures keep your raw draft intact`,
    polishCta:    'Polish with AI',
    progressCta:  'Apply event and progress narrative',
  },

  export: {
    primaryCta:   'Export Dossier',
    sheetTitle:   'Export Dossier',
    variants: {
      draft_brief:     { label: 'Draft Brief',     desc: 'Quick prep doc — no timeline, no canon-only chapters.' },
      canon_dossier:   { label: 'Canon Dossier',   desc: 'Full campaign-ready document with current state and timeline.' },
      timeline_packet: { label: 'Timeline Packet', desc: 'Lean recap — cover, current state, and timeline. For reviewing what changed since last session.' },
    },
  },

  pricing: {
    // Tier names are intentionally generic ("upgrade") so the helper can
    // substitute the active tier display name (Cartographer / Premium)
    // at render time via getTierDisplayName. Hard-coding "Premium" here
    // would drift the moment the tierRenames flag flips.
    moments: {
      first_canonize: {
        headline: 'You just made a town part of your campaign.',
        body:     'Upgrade adds canon snapshots, timeline export variants, and AI prose polish. The free tier continues to work, just with the basics.',
      },
      first_ai_use: {
        headline: 'AI prose costs credits per generation.',
        body:     'Upgrade includes a monthly credit allowance plus discounted top-ups.',
      },
      first_canon_export: {
        headline: 'Canon dossiers are the deliverable DMs print.',
        body:     'Upgrade unlocks unlimited canon-mode exports and the timeline-packet variant.',
      },
      cloud_save: {
        headline: 'Save your campaign across devices.',
        body:     'Upgrade syncs your settlements, drafts, and canon timelines to your account.',
      },
    },
  },

  onboarding: {
    title:    'Get started',
    hide:     'Hide',
    showAgain:'Show getting-started guide',
  },

  state: {
    badges: {
      draft:         'Draft',
      canon:         'Canon',
      preplay:       'Preplay',
      event_pending: 'Pending',
      narrated:      'Narrated',
      raw:           'Raw',
      locked:        'Locked',
    },
    tooltips: {
      draft:    'Editable, not yet part of your campaign world.',
      canon:    'Live campaign truth. Changes are logged as events.',
      narrated: 'AI prose layer is present.',
      raw:      'Raw mechanical output — no AI prose.',
      locked:   'Locked. Preserved through regeneration.',
    },
  },
};

/**
 * Helper for places that call functions instead of strings (e.g. plural
 * forms). Returns the string unchanged for non-function values; calls
 * with the supplied args otherwise.
 */
export function copy(value, ...args) {
  return typeof value === 'function' ? value(...args) : value;
}
