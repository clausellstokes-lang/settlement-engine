/**
 * copy/en.js — English copy strings, organized by namespace.
 *
 * Every user-facing string in the app should live here, not as literals
 * scattered through components. Three reasons this matters more than it
 * looks:
 *
 *   1. Tone shifts. The UI Redesign PDF mandates a specific voice
 *      (parchment-formal, italic flourishes, no exclamation points).
 *      Changing tone later means editing this file, not 80 components.
 *
 *   2. A/B testing. Swap whole namespace objects to test variants
 *      without touching component code.
 *
 *   3. i18n later. Add `src/copy/es.js` with the same shape; flip the
 *      active locale in `copy/index.js`. No component changes.
 *
 * Naming convention: namespace.scope.key. Keep keys short and stable —
 * they're referenced by string, so renames are find-and-replace.
 *
 * Template interpolation: use `{varName}`. The `t()` helper substitutes
 * from the second argument. Missing vars are left as literal `{var}`
 * (so the bug is loud, not silent).
 *
 * Source: UI Redesign PDF §18 (page-by-page verbatim copy reference).
 */

export const en = Object.freeze({
  // ── Common ────────────────────────────────────────────────────────────────
  common: {
    save:        'Save',
    cancel:      'Cancel',
    close:       'Close',
    confirm:     'Confirm',
    delete:      'Delete',
    continue:    'Continue',
    back:        'Back',
    next:        'Next',
    yes:         'Yes',
    no:          'No',
    loading:     'Loading…',
    moreOptions: 'More options',
  },

  // ── Hero (homepage anonymous-first generator) ─────────────────────────────
  hero: {
    eyebrow:    'A simulator for Dungeon Masters',
    title:      'Forge a settlement worth running a campaign in.',
    subtitle:   'Every street, every faction, every reason the place hasn’t collapsed yet — simulated in seconds, exported in a click.',
    antiAi:     'Simulated, not AI-generated. The town is derived from constraints — coherent because it has to be.',
    cta:        'Begin a settlement',
    ctaSubline: 'No account needed. Your first dossier is yours to keep.',
    note:       'Free anonymous generations are capped at town size. Sign in to push further.',
  },

  // ── Generate wizard ───────────────────────────────────────────────────────
  generate: {
    title:    'New settlement',
    subtitle: 'Pick a size and a region. The rest is up to the simulator.',
    button:   'Generate',
    subline:  'Roughly 10–20 seconds. Watch the pipeline as it runs.',
    sizes: {
      hamlet:  'Hamlet',
      village: 'Village',
      town:    'Town',
      city:    'City',
      capital: 'Capital',
    },
    sizeHint: {
      hamlet:  'A handful of families. One inn, if you’re lucky.',
      village: 'A market square, a temple, a militia of farmers.',
      town:    'A real economy. Guilds. A jail.',
      city:    'Politics. Districts. Things that go wrong at scale.',
      capital: 'The seat of something larger than itself.',
    },
  },

  // ── Pipeline rail ("How this was simulated") ──────────────────────────────
  pipeline: {
    title:    'How this was simulated',
    subtitle: 'Fourteen procedural steps. Tap any one to see what it decided and why.',
    cogLabel:    'Procedural step',
    quillLabel:  'Narrative refinement',
    stepRunning: 'Running…',
    stepDone:    'Done',
    stepFailed:  'Failed',
  },

  // ── Auth modal ────────────────────────────────────────────────────────────
  auth: {
    title:    'Sign in to keep your work',
    subtitle: 'Saves, exports, larger settlements, and the Neighbourhood System.',
    signinSubtitle: 'Sign in to keep your work — saves, exports, larger settlements, and the Neighbourhood System.',
    signupSubtitle: 'Create a free {tier} account to save your work, push to larger sizes, and link settlements in the Neighbourhood System.',
    discord: {
      label:       'Continue with Discord',
      placeholder: 'Coming soon — we’re finishing the OAuth review.',
    },
    google:  { label: 'Continue with Google' },
    email: {
      label:       'Send a magic link',
      placeholder: 'you@example.com',
      sent:        'Check your inbox. The link signs you in.',
    },
    password: {
      label:    'Sign in with a password',
      forgot:   'Forgot password?',
      register: 'Create an account',
    },
    button: {
      working:     'Working...',
      sendLink:    'Send sign-in link',
      createAcct:  'Create account',
      signIn:      'Sign in',
      moreOpen:    'More sign-in options',
      moreClose:   'Hide more options',
      usePassword: 'Use a password instead',
      useMagic:    'Use a magic link instead (recommended)',
    },
    placeholder: {
      email:    'Email address',
      password: 'Password',
    },
    rememberMe: 'Remember me on this device',
    localMode:  'Running in local mode — no backend configured',
    error: {
      generic:    'Something went wrong. Try again.',
      invalid:    'That email or password didn’t work.',
      rateLimit:  'Too many attempts. Try again in a minute.',
      network:    'No network. Check your connection.',
    },
    legal: 'By continuing you agree to the Terms and Privacy Policy.',
  },

  // ── Pricing ───────────────────────────────────────────────────────────────
  pricing: {
    pageTitle:    'Pricing',
    pageSubtitle: 'Pay once for credits. Subscribe if you want more room.',
    antiAi:       'Settlements are simulated from constraints — not generated by AI. Narrative refinement is the only step that uses language synthesis, and it grounds itself in the simulator output.',
    tiers: {
      wanderer: {
        name:        'Wanderer',
        priceLabel:  'Free',
        priceSub:    'forever',
        tagline:     'For the curious DM trying things out.',
        cta:         'Start free',
        features: [
          '3 saved settlements',
          'Up to town size',
          'PDF export of any saved dossier',
          'Pay-per-use narrative refinement (credit packs)',
        ],
      },
      cartographer: {
        name:        'Cartographer',
        priceLabel:  '$6',
        priceSub:    'per month',
        tagline:     'For the DM running a real campaign.',
        cta:         'Subscribe',
        features: [
          'Unlimited saves',
          'Up to capital size',
          'Neighbourhood System (linked settlements)',
          'PDF + JSON export',
          'Map supply chains across settlements',
          'Pay-per-use narrative refinement (credit packs)',
        ],
      },
      founder: {
        name:        'Founder Lifetime',
        priceLabel:  '$99',
        priceSub:    'one-time',
        tagline:     'The first 500 supporters keep Cartographer forever.',
        cta:         'Claim a Founder seat',
        seatsRemaining: '{remaining} of 500 seats remaining.',
        features: [
          'Everything in Cartographer, forever',
          'Founder badge on your dossiers',
          'Direct line to the dev (Discord)',
          'Early access to new simulators',
        ],
      },
    },
    singleDossier: {
      title:       'Just want one dossier?',
      priceLabel:  '$2.99',
      description: 'One-time payment. We’ll generate, export, and email you a full PDF — no account needed.',
      cta:         'Buy a one-shot dossier',
    },
    creditPacks: {
      heading:  'Narrative Credit Packs',
      subhead:  'Buy in bulk for a deeper discount. Credits never expire.',
      pack:     '{credits} credits',
      perEach:  '{price}/ea',
      best:     'Best value',
      value:    'Most popular',
    },
    faqLink: 'See the full pricing FAQ',
  },

  // ── AI feature labels (with inline cost) ─────────────────────────────────
  // Cost is interpolated at call time so we never drift between UI + ledger.
  ai: {
    narrative: {
      button:      'Generate narrative — {cost} credits',
      shortLabel:  'Narrative',
      description: 'A literary thesis of the settlement, refined across 13 passes.',
      running:     'Composing the thesis…',
    },
    dailyLife: {
      button:      'Generate daily life — {cost} credits',
      shortLabel:  'Daily life',
      description: 'Five parallel paragraphs from dawn to night, in the voice of the place.',
      running:     'Living the day…',
    },
    progression: {
      button:      'Generate progression — {cost} credits',
      shortLabel:  'Progression',
      description: 'A diff-aware evolution of the prior narrative against new state.',
      running:     'Tracking what changed…',
    },
    insufficient: 'You need {cost} credits for this. You have {balance}.',
    buyMore:      'Buy more credits',
  },

  // ── Tab intro lines (italic, prose-l, beneath each tab title) ────────────
  // Source: UI Redesign §18.9. These set the tone for each tab in one line.
  tabs: {
    overview:      'Where you stand back and see the place whole.',
    summary:       'The settlement, distilled to a paragraph an NPC could speak.',
    economics:     'Who owes whom, who eats what, and why prices wobble in spring.',
    power:         'Who decides, who enforces, and who quietly objects.',
    defense:       'Walls, watchmen, and the things they’d rather not face.',
    history:       'The decisions that shaped the streets your players walk.',
    relationships: 'The threads tying NPCs into something larger than a cast list.',
    plotHooks:     'Things gone wrong, things going wrong, things about to.',
    dailyLife:     'A day in the life — dawn to dusk to dusk again.',
    services:      'Who sells what, who fixes what, and who you don’t ask.',
    resources:     'What the land gives, what the trade brings, what runs short.',
    viability:     'Whether this place survives a hard winter, and why.',
    npcs:          'The faces. The names. The reasons they stay.',
    dmCompass:     'A loose handful of arrows for where this could go.',
  },

  // ── Onboarding Coach + Checklist (UI Redesign §18.6 / §18.7) ─────────────
  onboarding: {
    coach: {
      welcomeTitle: 'Welcome to SettlementForge.',
      welcomeBody:  'You’ve made a settlement. Now it’s yours to use. Three small steps and you’ll know your way around.',
      step1Title:   'Read the dossier.',
      step1Body:    'Every tab is a different angle on the same place. Start with Overview. Drift through Economics, Power, and Daily Life.',
      step2Title:   'Watch how it was simulated.',
      step2Body:    'The rail on the right shows the fourteen steps the engine took. Tap any to see what it decided.',
      step3Title:   'Save it.',
      step3Body:    'Sign in and your work survives the tab close. Your first three saves are free.',
      dismiss:      'I’ve got it from here',
    },
    checklist: {
      title:           'Get the most from SettlementForge',
      subtitle:        'Five small things. Knock them out as you explore.',
      itemGenerate:    'Generate your first settlement',
      itemRead:        'Read three different tabs',
      itemRail:        'Tap a step in the simulation rail',
      itemSave:        'Save the dossier',
      itemNeighbour:   'Link a second settlement (Neighbourhood System)',
      completeBadge:   'Complete!',
    },
  },

  // ── Account page ─────────────────────────────────────────────────────────
  account: {
    setDisplayName:        'Set Display Name',
    subscriptionHeading:   'Subscription & Credits',
    profileHeading:        'Profile',
    cardCurrentTier:       'Current Tier',
    cardCredits:           'Narrative Credits',
    cardSaves:             'Saved Settlements',
    fullAccess:            'Full Access',
    purchaseCreditsLabel:  'Purchase Credits — Volume Discounts',
    purchaseErrorTitle:    'Purchase couldn’t start. Try again or refresh the page.',
  },

  // ── Gallery (public dossier listing) ────────────────────────────────────
  gallery: {
    pageTitle:    'Gallery',
    pageSubtitle: 'Settlements other DMs have shared. Browse for inspiration; click a tile to read the full dossier.',
    antiAi:       'Every dossier in the gallery was simulated, not AI-generated. The settlements are derived from the same constraint engine — coherent because the simulator made them so.',
    forgeYourOwn: 'Forge your own',
    untitled:     'Untitled settlement',
    emptyTitle:   'No public dossiers yet.',
    emptyBody:    'Be the first to publish one — every shared dossier becomes a permanent, crawlable page.',
    loadError:    'Couldn’t load the gallery. Try again in a moment.',
    backToList:   'Back to gallery',
  },

  // ── Narrative drift modal (gate for structural edits on narrated saves) ─
  narrativeDrift: {
    headingSeismic:    'This is a big change.',
    headingStructural: 'This change will drift the narrative.',
    body:              'The narrative layer on this save reasons about the facts you’re changing. A mechanical substitution won’t keep the prose honest — the thesis, faction blurbs, and institution descriptions were written against the old state.',
    pickOne:           'Pick one:',
    regenerateTitle:   'Apply & Regenerate Narrative',
    regenerateBody:    'Full re-run against the new state. Spends {cost} credits.',
    progressTitle:     'Apply & Progress Narrative ({cost} credits)',
    progressBody:      'Evolve the existing narrative. Preserves voice and named NPCs.',
    revertTitle:       'Apply & Revert to Raw',
    revertBody:        'Clear the narrative and show raw data. No credits. Chronicle history is preserved.',
    cancelLabel:       'Cancel — don’t apply this change',
    ariaCancel:        'Cancel',
  },

  // ── Purchase modal (credit packs + single dossier) ──────────────────────
  purchase: {
    title:             'Buy narrative credits',
    subtitle:          'Credits never expire and apply to every narrative refinement feature.',
    packsHeading:      'Narrative Credit Packs — Volume Discounts',
    bestLabel:         'Best value',
    valueLabel:        'Most popular',
    perCreditTemplate: '{price}/credit',
    failureMessage:    'Couldn’t start checkout. Try once more.',
  },

  // ── Errors (user-facing only — internal logs stay in console) ────────────
  errors: {
    saveFailed:   'Couldn’t save. Your work is still on screen — try once more.',
    loadFailed:   'Couldn’t load that dossier. Refresh and try again.',
    networkOff:   'You’re offline. Reconnect and we’ll retry.',
    generateFail: 'The simulator hit a snag. We’re looking at it — try again in a moment.',
    aiUnavailable: 'Narrative refinement is temporarily unavailable. The simulator is unaffected — your settlement still generates and exports.',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    tagline:  'A simulator for Dungeon Masters.',
    antiAi:   'Simulated, not AI-generated.',
    pricing:  'Pricing',
    gallery:  'Gallery',
    discord:  'Discord',
    privacy:  'Privacy',
    terms:    'Terms',
    contact:  'Contact',
    copyright: '© {year} SettlementForge',
  },
});
