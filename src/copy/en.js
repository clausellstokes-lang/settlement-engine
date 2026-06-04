/**
 * copy/en.js - English copy strings, organized by namespace.
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
 * Naming convention: namespace.scope.key. Keep keys short and stable -
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
    loading:     'Loading...',
    moreOptions: 'More options',
  },

  // ── Hero (homepage anonymous-first generator) ─────────────────────────────
  // Pre-P117 strings preserved for the legacy hero variant. The two-voice
  // rewrite lives under `hero.v2.*` and is selected when the
  // `homepage.heroV2` flag is on.
  hero: {
    eyebrow:    'A simulator for Dungeon Masters',
    title:      'Forge a settlement worth running a campaign in.',
    subtitle:   'Every street, every faction, every reason the place hasn’t collapsed yet - simulated in seconds, exported in a click.',
    antiAi:     'Simulated, not AI-generated. The town is derived from constraints - coherent because it has to be.',
    cta:        'Begin a settlement',
    ctaSubline: 'No account needed. Your first dossier is yours to keep.',
    note:       'Free anonymous generations are capped at town size. Sign in to push further.',
    // ── P117 two-voice rewrite ──────────────────────────────────────────
    v2: {
      headline:     'Most generators roll on a table.',
      headlineAccent: 'This one simulates.',
      deck:         'First settlement or hundredth - the pieces explain each other.',
      ctaTemplate:  'Forge a {tier} →',
      subline:      '{remaining} of {cap} free today · no account',
    },
    // ── P108 anon cap as unlock (X-5) ───────────────────────────────────
    capUnlock: {
      headline:   'You’ve explored hamlet, village, town.',
      body:       'Sign in (free) to unlock thorp through metropolis, save unlimited drafts, and export the PDF.',
      primaryCta: 'Create free account →',
      sideDoor:   'or just take this one - buy the dossier for $2.99 ↓',
    },
    // ── P115 return-visit ───────────────────────────────────────────────
    welcomeBack: {
      eyebrow:    'Welcome back',
      titleTpl:   'It’s been {days} days, {name}.',
      bodyTpl:    'How did your session in {settlementName} go?',
      openCta:    'Open {settlementName}',
      followUp:   'Forge a follow-up',
      streakTpl:  '{count} sessions in {weeks} weeks. Cartographer pays for itself in two -',
      streakLink: 'see what it unlocks →',
    },
  },

  // ── Generate wizard ───────────────────────────────────────────────────────
  generate: {
    title:    'New settlement',
    subtitle: 'Pick a size and a region. The rest is up to the simulator.',
    button:   'Generate',
    subline:  'Roughly 10-20 seconds. Watch the pipeline as it runs.',
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
    stepRunning: 'Running...',
    stepDone:    'Done',
    stepFailed:  'Failed',
  },

  // ── Auth modal ────────────────────────────────────────────────────────────
  auth: {
    title:    'Sign in to keep your work',
    subtitle: 'Saves, exports, larger settlements, and the Neighbourhood System.',
    signinSubtitle: 'Sign in to keep your work - saves, exports, larger settlements, and the Neighbourhood System.',
    signupSubtitle: 'Create a free {tier} account to save your work, push to larger sizes, and link settlements in the Neighbourhood System.',
    discord: {
      label:       'Continue with Discord',
      placeholder: 'Coming soon - we’re finishing the OAuth review.',
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
    localMode:  'Running in local mode - no backend configured',
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
    antiAi:       'Settlements are simulated from constraints - not generated by AI. Narrative refinement is the only step that uses language synthesis, and it grounds itself in the simulator output.',
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
      description: 'One-time payment. We’ll generate, export, and email you a full PDF - no account needed.',
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
      button:      'Generate narrative - {cost} credits',
      shortLabel:  'Narrative',
      description: 'A literary thesis of the settlement, refined across 13 passes.',
      running:     'Composing the thesis...',
    },
    dailyLife: {
      button:      'Generate daily life - {cost} credits',
      shortLabel:  'Daily life',
      description: 'Five parallel paragraphs from dawn to night, in the voice of the place.',
      running:     'Living the day...',
    },
    progression: {
      button:      'Generate progression - {cost} credits',
      shortLabel:  'Progression',
      description: 'A diff-aware evolution of the prior narrative against new state.',
      running:     'Tracking what changed...',
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
    dailyLife:     'A day in the life - dawn to dusk to dusk again.',
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
    purchaseCreditsLabel:  'Purchase Credits - Volume Discounts',
    purchaseErrorTitle:    'Purchase couldn’t start. Try again or refresh the page.',
  },

  // ── Gallery (public dossier listing) ────────────────────────────────────
  gallery: {
    pageTitle:    'Gallery',
    pageSubtitle: 'Settlements other DMs have shared. Browse for inspiration; click a tile to read the full dossier.',
    antiAi:       'Every dossier in the gallery was simulated, not AI-generated. The settlements are derived from the same constraint engine - coherent because the simulator made them so.',
    forgeYourOwn: 'Forge your own',
    untitled:     'Untitled settlement',
    emptyTitle:   'No public dossiers yet.',
    emptyBody:    'Be the first to publish one - every shared dossier becomes a permanent, crawlable page.',
    loadError:    'Couldn’t load the gallery. Try again in a moment.',
    backToList:   'Back to gallery',
  },

  // ── Narrative drift modal (gate for structural edits on narrated saves) ─
  narrativeDrift: {
    headingSeismic:    'This is a big change.',
    headingStructural: 'This change will drift the narrative.',
    body:              'The narrative layer on this save reasons about the facts you’re changing. A mechanical substitution won’t keep the prose honest - the thesis, faction blurbs, and institution descriptions were written against the old state.',
    pickOne:           'Pick one:',
    regenerateTitle:   'Apply & Regenerate Narrative',
    regenerateBody:    'Full re-run against the new state. Spends {cost} credits.',
    progressTitle:     'Apply & Progress Narrative ({cost} credits)',
    progressBody:      'Evolve the existing narrative. Preserves voice and named NPCs.',
    revertTitle:       'Apply & Revert to Raw',
    revertBody:        'Clear the narrative and show raw data. No credits. Chronicle history is preserved.',
    cancelLabel:       'Cancel - don’t apply this change',
    ariaCancel:        'Cancel',
  },

  // ── Purchase modal (credit packs + single dossier) ──────────────────────
  purchase: {
    title:             'Buy narrative credits',
    subtitle:          'Credits never expire and apply to every narrative refinement feature.',
    packsHeading:      'Narrative Credit Packs - Volume Discounts',
    bestLabel:         'Best value',
    valueLabel:        'Most popular',
    perCreditTemplate: '{price}/credit',
    failureMessage:    'Couldn’t start checkout. Try once more.',
  },

  // ── Errors (user-facing only - internal logs stay in console) ────────────
  errors: {
    saveFailed:   'Couldn’t save. Your work is still on screen - try once more.',
    loadFailed:   'Couldn’t load that dossier. Refresh and try again.',
    networkOff:   'You’re offline. Reconnect and we’ll retry.',
    generateFail: 'The simulator hit a snag. We’re looking at it - try again in a moment.',
    aiUnavailable: 'Narrative refinement is temporarily unavailable. The simulator is unaffected - your settlement still generates and exports.',
  },

  // ── Verb registry (P124 / C-1) ───────────────────────────────────────────
  // Single source of truth for action verbs. The critique flagged
  // Begin/Forge/Generate/Roll/Reroll/Regenerate competing on the same
  // surfaces. We commit to Forge (first generation), Reforge (regenerate),
  // Reroll (one section only), Narrate (AI prose), with explicit loading
  // verbs. Centralizing here means a future tone shift is one file edit.
  verbs: {
    forgeTpl:    'Forge a {tier}',
    forge:       'Forge',
    reforge:     'Reforge',
    rerollTpl:   'Reroll {section}',
    narrate:     'Narrate',
    forging:     'Forging...',
    narrating:   'Narrating...',
    rerolling:   'Rerolling...',
  },

  // ── Save / signup / cap surfaces (P101 / X-3) ────────────────────────────
  save: {
    button:        'Save',
    signupButton:  'Save this town - free account →',
    afterAuthHint: 'We’ll save your dossier as soon as you’re in.',
    successTpl:    'Saved as {settlementName} - view it in Settlements.',
    limitReached:  'You’ve hit the {limit}-save cap on the free tier.',
  },

  // ── Pricing-moment registry (P103 / X-2) ─────────────────────────────────
  // Augments the existing COPY.pricing.moments registry with the new
  // moments the critique calls for. usePricingMoment reads from here when
  // resolving copy by reason. Keep keys snake_case to match the existing
  // pricingMoments.js storage layout.
  moments: {
    first_save: {
      headline: 'Save it. Come back tomorrow.',
      body:     'Your dossier is yours to keep. Free tier holds 3 saves - plenty for a campaign’s first arc.',
    },
    anon_cap_hit: {
      headline: 'You’ve explored hamlet, village, town.',
      body:     'Sign in (free) to unlock thorp through metropolis, save unlimited drafts, and export the PDF.',
    },
    first_pdf_export: {
      headline: 'You just downloaded your first dossier.',
      body:     'Wanderer gives you 3 exports a month. Cartographer = unlimited, plus cloud sync - phone, laptop, table.',
    },
    third_save: {
      headline: 'You’re building a campaign.',
      body:     'Wanderer caps at 3 saves. Cartographer unlocks unlimited saves, the neighbour network, all six sizes, and full export.',
    },
    regen_burst: {
      headline: 'Power user ahead.',
      body:     'Locks, drift, chronicle - Cartographer surfaces the worldbuilder-tier controls. Try the upgrade.',
    },
    map_clicked: {
      headline: 'World Map unlocks with Cartographer.',
      body:     'Place settlements, draw routes, surface supply-chain stress - your campaigns become a place.',
    },
    weekly_user: {
      headline: 'Three sessions in two weeks.',
      body:     'You’re using SettlementForge weekly - Cartographer pays for itself in two.',
    },
    welcome_credit: {
      headline: 'Try the Narrative Layer once - on us.',
      body:     'One credit on every signup. The AI prose pass turns this town’s data into prose your players can hear.',
    },
  },

  // ── Audience-led pricing tile copy (P122 / X-10) ─────────────────────────
  // The three tiers each get an audience-shifted pitch line that
  // PricingPage surfaces above the existing feature list.
  pricingPitch: {
    wanderer: {
      lineNew:          'Three towns, fully prepped. Find out if this works for you.',
      lineIntermediate: 'Three towns. Free forever. See if a session a week earns the upgrade.',
      lineWorldbuilder: 'Try the engine. Three towns is enough to see if the moat is real.',
    },
    cartographer: {
      lineNew:          'When you’re ready for a campaign instead of an evening - unlimited saves, every size.',
      lineIntermediate: 'For DMs running a town a week. Unlimited saves, every size, full export.',
      lineWorldbuilder: 'The worldbuilder’s tier: neighbour network, locks, drift, full export.',
    },
    founder: {
      lineNew:          'For DMs who already know they’ll build campaigns. Pay once, ship every settlement.',
      lineIntermediate: 'Two years of Cartographer for $99. Lifetime access. 500 seats only.',
      lineWorldbuilder: 'For DMs building campaigns. Pay once, ship every settlement you’ll ever run.',
    },
  },

  // ── Pipeline reveal step labels (P100 / X-1) ─────────────────────────────
  // Marketing-facing translations of the actual pipeline step names.
  // Theatrical by design - the user sees engine work, not function names.
  pipelineSteps: {
    resolveConfig:          'resolving constraints...',
    resolveResources:       'sourcing resources...',
    resolveStress:          'reading the pressure...',
    resolveNeighbour:       'binding neighbours...',
    assembleInstitutions:   'sourcing institutions...',
    subsumptionPass:        'collapsing duplicates...',
    cascadePass:            'cascading tensions...',
    isolationPass:          'walking outliers...',
    generateEconomy:        'building the market...',
    generatePower:          'naming the powers...',
    neighbourFactions:      'mirroring the neighbours...',
    factionCorrelationPass: 'finding alliances...',
    generatePopulation:     'casting NPCs...',
    generateNarratives:     'knotting hooks...',
    assembleSettlement:     'assembling the dossier...',
  },

  // ── Dossier surfaces (P102 / D-1, D-3) ───────────────────────────────────
  dossier: {
    fiveTabGroups: {
      summary:  'Summary',
      people:   'People',
      systems:  'Systems',
      world:    'World',
      hooks:    'Hooks',
    },
    fiveTabHints: {
      summary:  'Read this at the table tonight',
      people:   'Who lives here, who runs it',
      systems:  'What the town can do for / against PCs',
      world:    'Where this town sits in the campaign',
      hooks:    'What I can run next session',
    },
    howThisWasBuilt: '⚙ How this was simulated',
    backToList:      'Back to settlements',
    editModeOn:      'Edit mode',
    editModeOff:     'View mode',
    pendingTpl:      '{count} unsaved {noun}',
    previewCascade:  'Preview cascade →',
    commit:          'Commit',
    revert:          'Revert',
    cascadeHeading:  'What changes if you apply these edits',
  },

  // ── Workshop (P107 / CP-2) ───────────────────────────────────────────────
  workshop: {
    navLabel:       'Workshop',
    locked:         'Workshop unlocks with Cartographer.',
    lockedBody:     'Drag and drop institutions, resources, and stressors. Cascade-preview before you commit. Bring your own custom content.',
    upgradeCta:     'Upgrade - $6/mo',
    samplePreview:  'See a sample →',
  },

  // ── Sample dossier proof card (P128 / H-2) ───────────────────────────────
  // Renders below HomeHero for anonymous visitors. Three callouts, each
  // aimed at a different reader. The teach beats are deliberate - every
  // line should let the reader recognize themselves and the moat in one
  // glance.
  sampleDossier: {
    header: {
      name:     'Hightower’s Reach',
      meta:     'TOWN · 2,847 POP · FRONTIER',
    },
    callouts: {
      newDm: {
        eyebrow: 'For the new DM',
        body:    'Captain Velda Marsh is corrupt because the wall-fund collapsed to pay for the salt-road garrison. Towns hang together when their problems explain each other.',
      },
      worldbuilder: {
        eyebrow: 'For the worldbuilder',
        body:    'Salt-road supply chain breaks at Whitestone Pass → preserved-meat exports halt in 11 days. Famine cascade primed. Pull any thread and the next one tightens.',
      },
      fridaysSession: {
        eyebrow: 'For Friday’s session',
        body:    '“The wall-fund ledger has gone missing. The Captain blames the merchants. The merchants blame the militia. Someone is hiding it in plain sight.”',
      },
    },
    footer: 'A real settlement from the simulator. Yours generates in eight seconds.',
  },

  // ── First-dossier teaching callouts (P130 / O-2) ─────────────────────────
  // Three permanent-dismiss callouts on a first-time user's first
  // generated dossier. Each points at what the engine already did and
  // teaches by example, not by tutorial.
  firstDossierCallouts: {
    tension: {
      eyebrow: 'Why this town hangs together',
      body:    'The captain is corrupt because the wall fund is short. Towns hang together when their problems explain each other.',
    },
    supply: {
      eyebrow: 'Why this is a session',
      body:    'If the salt road closes, this town runs out in 11 days. That’s a session - supply chains aren’t flavor, they’re fuel.',
    },
    hook: {
      eyebrow: 'Where hooks come from',
      body:    'This hook came from the tension above - not a random table. That’s the difference between a simulator and a roller.',
    },
    dismissLabel: 'Got it',
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

  // P138 / AC-4 - Inline FAQ on the Account page. Each entry is a
  // short Q + a 1-2 sentence A. Keep tone plain and free of marketing
  // hedge - these are the answers users would otherwise email support
  // for. Edit freely; the keys are stable.
  accountFaq: {
    creditGrant: {
      q: 'How does the welcome credit work?',
      a: "On signup, every account gets one free Narrative credit. It refines your first saved settlement into prose. Once spent, it doesn't come back - buy more from the Subscription panel.",
    },
    cancelAnytime: {
      q: 'Can I cancel my subscription?',
      a: 'Yes - open the Manage Subscription link in your Stripe portal. Cancellation takes effect at the end of your current billing period; you keep access until then.',
    },
    refundWindow: {
      q: 'Do you offer refunds?',
      a: 'Single-dossier purchases are refundable within 7 days if you have not exported or downloaded the PDF. Subscription refunds are handled case-by-case via Customer Support below.',
    },
    founderLifetime: {
      q: 'What is the Founder Lifetime plan?',
      a: 'A one-time payment that unlocks every current and future tier for the life of the product. Capped at the first 200 buyers; the counter is live above this FAQ.',
    },
    galleryPrivacy: {
      q: 'Is my settlement private when I save it?',
      a: 'Yes by default. Only you can see saved settlements. Sharing to the public Gallery is an explicit opt-in per settlement - the toggle lives in the dossier header.',
    },
    aiOrSim: {
      q: "Does SettlementForge use AI to write my settlement?",
      a: 'The structural layer - population, factions, supply chains, hooks - is a deterministic simulator, not an LLM. Optional Narrative Refinement spends a credit to turn the simulation into prose. You can keep the raw output and skip the LLM entirely.',
    },
  },
});
