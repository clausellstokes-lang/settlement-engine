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
    // Verb unification. Forge (first generation) / Reforge (regenerate).
    // Was: "Generate Draft" / "Regenerate Draft" — Begin / Generate / Forge /
    // Roll were all competing on the same surfaces, so we settled on one verb
    // per action class.
    // "Draft" is still the artifact noun (draft → canon lifecycle is
    // preserved); only the action verb changed.
    // ModeSelector renders only Basic + Advanced. The "Custom Generate"
    // mode (the Workshop) was removed; its copy key was deleted so this
    // file can't drift back into advertising a surface that no longer
    // exists.
    quickMode:    { title: 'Basic Generate',    cta: 'Forge a Draft',  subtitle: 'Minimal config. Set the foundations and go.' },
    advancedMode: { title: 'Advanced Generate', cta: 'Forge a Draft',  subtitle: 'Full configuration, step by step' },
    regenerate:   { cta: 'Reforge Draft',       confirm: 'Reforge the settlement? All unsaved placements will be lost.' },
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
    // The next-action rail's gold rung for a canon settlement that has not yet
    // entered the Realm. Naming the destination ("the Realm") gives the step
    // strong information scent without inventing a new action.
    sendToRealmCta:  'Send it to the Realm',
    sendToRealmHint: 'Place this canon settlement in the Realm so the region advances around it.',
    openRealmCta:    'Open the Realm',
    openRealmHint:   'This settlement lives in the Realm. Open it to advance the region.',
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
    undoTooltip:  'Undo this event. Restores prior state.',
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
      draft_brief:     { label: 'Draft Brief',     desc: 'Quick prep doc. No timeline, no canon-only chapters.' },
      canon_dossier:   { label: 'Canon Dossier',   desc: 'Full campaign-ready document with current state and timeline.' },
      timeline_packet: { label: 'Timeline Packet', desc: 'Lean recap: cover, current state, and timeline. For reviewing what changed since last session.' },
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
        body:     'Upgrade adds canon snapshots, timeline export variants, and narrative refinement. The free tier continues to work, just with the basics.',
      },
      first_ai_use: {
        headline: 'Narrative refinement costs credits per pass.',
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
      // ── Conversion-arc moments ─────────────────────────────────────────
      first_save: {
        headline: 'Save it. Come back tomorrow.',
        body:     'Your dossier is yours to keep. Free tier holds 3 saves, plenty for a campaign’s first arc.',
      },
      anon_cap_hit: {
        headline: 'You’ve explored hamlet, village, town.',
        body:     'Sign in (free) to reach thorp through metropolis, save unlimited drafts, and export the PDF.',
      },
      first_pdf_export: {
        headline: 'You just downloaded your first dossier.',
        body:     'Wanderer exports any saved dossier to PDF, unlimited. Cartographer adds unlimited saves and cloud sync: phone, laptop, table.',
      },
      third_save: {
        headline: 'You’re building a campaign.',
        body:     'Wanderer caps at 3 saves. Cartographer unlocks unlimited saves, the neighbour network, all six sizes, and full export.',
      },
      regen_burst: {
        headline: 'You’re pushing the engine.',
        body:     'Locks, drift, chronicle: Cartographer hands you the worldbuilder controls.',
      },
      map_clicked: {
        headline: 'World Map unlocks with Cartographer.',
        body:     'Place settlements, draw routes, trace where the supply chains strain. Your campaign becomes a map.',
      },
      // ── The Realm hub locked-state teaser ──────────────────────────────
      // Fired from the Realm Dashboard when an anon/free user opens the
      // Realm. Names the actual premium product: the living simulation.
      map_realm_teaser: {
        headline: 'The Realm is where your world comes alive.',
        body:     'Advance time and watch wars ignite and end, faiths rise, and the chronicle write itself. Cartographer runs the living simulation across your whole campaign.',
      },
      // ── Simulation-intent moments ──────────────────────────────────────
      // Fired when a non-premium user reaches toward a specific simulation
      // system. Each NAMES that system (never size — size is free) and routes
      // to the canonical "What the Realm unlocks" surface.
      first_advance_attempt: {
        headline: 'Advance Time runs the region forward.',
        body:     'Push the world a month and the whole region responds. Wars, faiths, trade, population: each change derived, not rolled. Cartographer unlocks the living simulation.',
      },
      war_layer_curiosity: {
        headline: 'The war layer ends its own wars.',
        body:     'Sieges form, coalitions gather, settlements fall, and war-exhaustion drives the realm back to peace. Cartographer turns it on. It stays off by default until you do.',
      },
      pantheon_preview: {
        headline: 'The pantheon is alive.',
        body:     'Deities contest converts, win seats, and rise from cult to major across your region. Cartographer unlocks the living pantheon, opt-in and reversible.',
      },
      weekly_user: {
        headline: 'Three sessions in two weeks.',
        body:     'You’re using SettlementForge weekly. Cartographer pays for itself in two.',
      },
      welcome_credit: {
        headline: 'Try the Narrative Layer once, on us.',
        body:     'One credit on every signup. The Narrative Layer turns this town’s data into prose your players can hear.',
      },
      founder_eligible: {
        headline: 'You’ve earned this offer.',
        body:     'Five settlements, neighbours linked, dossiers exported. Founder Lifetime is $99: lifetime Cartographer access and a seat in the credits.',
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
      narrated: 'Narrative refinement layer is present.',
      raw:      'Raw simulation output. No narrative layer.',
      locked:   'Locked. Preserved through regeneration.',
    },
  },

  // The lifecycle spine: Draft, Saved, Canon, In the Realm, Shared.
  // Labels name each step; hints carry the next-step scent. Read by
  // primitives/LifecycleSpine. Voice stays plain and diegetic.
  lifecycle: {
    labels: {
      draft:     'Draft',
      saved:     'Saved',
      canon:     'Canon',
      simulated: 'In the Realm',
      shared:    'Shared',
    },
    hints: {
      draft:     'Forged and editable.',
      saved:     'Kept in your library.',
      canon:     'Part of your campaign world.',
      simulated: 'Living in the Realm.',
      shared:    'Published to the gallery.',
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
