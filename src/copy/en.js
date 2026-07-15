/**
 * copy/en.js — English copy strings, organized by namespace.
 *
 * Every user-facing string in the app should live here, not as literals
 * scattered through components. Three reasons this matters more than it
 * looks:
 *
 *   1. Tone shifts. The house voice is a calm campaign archivist: plain,
 *      literate, concrete civic nouns, one idea per sentence. No em-dashes in
 *      visitor-facing copy (they read as an AI tell); no exclamation points.
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
 *
 * This is the SINGLE copy registry. The retired copy/strings.js `COPY` map
 * was folded in here (its surfaces — generate/save/detail/events/timeline/ai/
 * export/pricing-moments/state/lifecycle — all resolve through `t()`/`tx()`),
 * so there is exactly one source per fact (F45). See the Wave 4b sub-wave plan
 * for the strings.js → en.js key-mapping table.
 *
 * FIRST-PAINT NOTE: this module (via copy/index.js) is imported ONLY by lazy
 * surfaces. The eager app shell reads its one namespace (`footer`) through
 * copy/footer.js. Never add an eager static import of this file — the whole
 * registry would re-enter the first-paint entry closure.
 */

import { footer } from './footer.js';

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
  // Original strings preserved for the legacy hero variant. The two-voice
  // rewrite lives under `hero.v2.*` and is selected when the
  // `homepage.heroV2` flag is on.
  hero: {
    eyebrow:    'A simulator for Dungeon Masters',
    title:      'Forge a settlement worth running a campaign in.',
    subtitle:   'Every street, every faction, every reason the place hasn’t collapsed yet. Simulated in seconds, exported in a click.',
    antiAi:     'Simulated, not AI-generated. The town is derived from constraints, coherent because it has to be.',
    cta:        'Begin a settlement',
    ctaSubline: 'No account needed. Your first dossier is yours to keep.',
    note:       'Free anonymous generations are capped at town size. Sign in to push further.',
    // ── Two-voice rewrite ───────────────────────────────────────────────
    v2: {
      headline:     'Most generators roll on a table.',
      headlineAccent: 'This one simulates.',
      deck:         'First settlement or hundredth: the pieces explain each other.',
      ctaTemplate:  'Forge a {tier} →',
      subline:      '{remaining} of {cap} free today · no account',
    },
    // ── Anonymous cap framed as an unlock ───────────────────────────────
    capUnlock: {
      headline:   'You’ve explored hamlet, village, town.',
      body:       'Sign in (free) to reach thorp through metropolis and save your drafts. Keep any dossier’s PDF for $2.99.',
      primaryCta: 'Create free account →',
      sideDoor:   'or keep this one: buy the dossier for $2.99 ↓',
    },
    // ── At-cap unlock copy rendered by HomeHero ─────────────────────────
    // `spent` is the quiet recap; `unlockTpl` is the louder next-step value.
    // The lead phrase is bolded in JSX, so it lives in its own key and the
    // template carries a {signin} placeholder where that bold span renders.
    anonCap: {
      signin:    'Sign in (free)',
      spent:     'You’ve explored hamlet, village, town.',
      unlockTpl: '{signin} to reach thorp through metropolis and save your drafts. Keep any dossier’s PDF for $2.99.',
    },
    // ── Return-visit ────────────────────────────────────────────────────
    welcomeBack: {
      eyebrow:    'Welcome back',
      titleTpl:   'It’s been {days} days, {name}.',
      bodyTpl:    'How did your session in {settlementName} go?',
      openCta:    'Open {settlementName}',
      followUp:   'Forge a follow-up',
      streakTpl:  '{count} sessions in {weeks} weeks. Cartographer pays for itself in two.',
      streakLink: 'see what it unlocks →',
    },
  },

  // ── Generate wizard ───────────────────────────────────────────────────────
  generate: {
    title:    'New settlement',
    subtitle: 'Pick a size and a region. The rest is up to the simulator.',
    button:   'Generate',
    subline:  'Roughly 10 to 20 seconds. Watch the pipeline as it runs.',
    // Pre-generate config-screen header (canonical PageHeader idiom).
    introEyebrow:  'Forge a settlement',
    introTitle:    'Create a settlement',
    // Mode-specific guidance, chunked to one idea per sentence (voice rule 6).
    introSubtitleBasic:    'Pick a character and set the foundations, then generate. The simulator fills in everything else. To shape institutions, services, and trade yourself, switch to Advanced.',
    introSubtitleAdvanced: 'Pick a character and the foundations. Open Fine-tune and the deep constraints to control institutions, services, and trade. Generate when ready.',
    sizes: {
      thorp:   'Thorpe',
      hamlet:  'Hamlet',
      village: 'Village',
      town:    'Town',
      city:    'City',
      metropolis: 'Metropolis',
    },
    sizeHint: {
      thorp:   'A few households at a crossroads. Barely a dot on the map.',
      hamlet:  'A handful of families. One inn, if you’re lucky.',
      village: 'A market square, a temple, a militia of farmers.',
      town:    'A real economy. Guilds. A jail.',
      city:    'Politics. Districts. Things that go wrong at scale.',
      metropolis: 'The seat of something larger than itself.',
    },
    // Mode selector (migrated from copy/strings.js `generate.*`). One verb per
    // action class: Forge (first generation) / Reforge (regenerate). "Draft" is
    // the artifact noun (draft → canon lifecycle is preserved).
    quickMode:    { title: 'Basic Generate',    cta: 'Forge a Draft',  subtitle: 'Minimal config. Set the foundations and go.' },
    advancedMode: { title: 'Advanced Generate', cta: 'Forge a Draft',  subtitle: 'Full configuration, step by step' },
    regenerate:   { cta: 'Reforge Draft',       confirm: 'Reforge the settlement? All unsaved placements will be lost.' },
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
    modalTitle: 'Welcome back',
    title:    'Sign in to keep your work',
    subtitle: 'Saves, larger settlements, and the Neighbourhood System.',
    signinSubtitle: 'Sign in to keep your work: saves, larger settlements, and the Neighbourhood System.',
    signupSubtitle: 'Create a free {tier} account to save your work, reach larger sizes, and link settlements in the Neighbourhood System.',
    resetPageSubtitle: 'We will email you a secure link to set a new password.',
    discord: {
      label:       'Continue with Discord',
      placeholder: 'Coming soon. We’re finishing the OAuth review.',
    },
    google:  { label: 'Continue with Google' },
    oauth: {
      // Divider shown above the Google/Discord buttons, which sit BELOW the
      // email/password form as alternatives to the primary password path.
      divider:  'or continue with',
      // Safe, non-leaky fallback when an OAuth sign-in fails for an unknown
      // reason. The account-linking conflict message is generated in
      // lib/auth.js (describeOAuthError) so it can stay close to the error.
      failed:   'Sign-in failed. Please try again.',
    },
    email: {
      label:       'Send a magic link',
      placeholder: 'you@example.com',
      sent:        'Check your inbox. The link signs you in.',
    },
    password: {
      label:    'Sign in with a password',
      show:     'Show password',
      hide:     'Hide password',
      forgot:   'Forgot password?',
      register: 'Create an account',
    },
    button: {
      working:        'Working...',
      emailLink:      'Email me a sign-in link',
      createAcct:     'Create account',
      signIn:         'Sign in',
      resend:         'Resend link',
      differentEmail: 'Use a different email',
      backToSignIn:   'Back to sign in',
    },
    // Password-reset request: the prose intro and the post-send confirmation.
    // Formal register, no contractions (auth/security copy).
    reset: {
      prose: 'Enter your email address and we will send a link to reset your password.',
      sent:  'Check your email for a password reset link.',
    },
    // Forgot-password challenge flow (the multi-step reset mode). Step 1 looks
    // the email up; step 2 asks ONE of the account's two security questions at
    // random; a correct answer mails the reset link. The user chose to reveal
    // whether an account exists, so `noAccount` is an honest miss. Formal
    // register, no contractions (auth/security copy).
    recovery: {
      lookupProse:   'Enter your email address. If it has an account with a security question set, we will ask you that question to confirm it is you.',
      lookupCta:     'Continue',
      noAccount:     'We could not find an account for that email address. Check the spelling, or create a new account.',
      noQuestion:    'This account does not have a security question set, so it cannot be recovered this way. Try an email sign-in link instead.',
      questionProse: 'Answer your security question to confirm this account is yours.',
      answerLabel:   'Your answer',
      verifyCta:     'Verify answer',
      sent:          'That matched. Check your email for a link to set a new password.',
      wrongAnswer:   'That answer did not match. Check it and try again.',
      tooMany:       'Too many attempts. Wait a few minutes, then try again.',
      unavailable:   'Account recovery is unavailable right now. Please try again shortly.',
      startOver:     'Start over with a different email',
    },
    // Set-new-password page (the recovery-link landing). When a recovery session
    // is active the form below completes the reset; otherwise the page falls back
    // to the request form. Formal register, no contractions (auth/security copy).
    setNew: {
      title:        'Set a new password',
      prose:        'Choose a new password for your account. You are signed in through your recovery link.',
      requestProse: 'This page completes a password reset. Open it from the link in your reset email, or request a new link below.',
      newLabel:     'New password',
      confirmLabel: 'Confirm new password',
      submit:       'Set new password',
      success:      'Your password is set. Taking you to your settlements…',
      failed:       'We could not set your password. The recovery link may have expired. Request a fresh one.',
      requestLink:  'Send a reset link',
    },
    // Magic-link "check your inbox" close. {email} is interpolated; the link
    // window is a scannable spec, so a digit is acceptable there.
    magic: {
      sent: 'Check {email} for a sign-in link. The link works for 1 hour.',
    },
    // Post sign-up email verification close. {email} is interpolated.
    // `sent` is AuthPanel's inline close; the rest power the /verify-email
    // link-landing page, a thin status surface over auth state (loading /
    // confirmed / expired). Supabase confirms via the emailed link, so there
    // is no code field here.
    verify: {
      sent:       'We sent a confirmation link to {email}. Check your inbox and click the link to activate your account.',
      title:      'Verify your email',
      confirming: 'Confirming your email…',
      confirmed:  'Your email is confirmed. Taking you to your settlements…',
      expired:    'This confirmation link is invalid or has expired. Try signing in. If your account is not active yet, request a fresh link.',
      continue:   'Continue',
      goSignIn:   'Go to Sign In',
      // The post-signup "check your inbox" screen now waits for the confirmation
      // link and signs the original window in automatically. These lines explain
      // that wait, calmly, with no countdown drama.
      polling:    'Keep this window open. The moment you confirm your email, here or on any device, we will sign you in automatically.',
      pollingTimedOut: 'We are still waiting on your confirmation. Once you have clicked the link, you can sign in directly.',
    },
    // Security questions, captured at sign-up (email/password accounts only).
    // The answers are hashed on the server and never reach the client; these
    // strings are the form labels and validation messages. Formal register, no
    // contractions (auth/security copy).
    security: {
      heading:     'Security questions',
      prose:       'Pick two questions and answer them. We will ask one of them at random if you ever need to recover your account.',
      question1:   'First question',
      question2:   'Second question',
      answer1:      'Answer to the first question',
      answer2:      'Answer to the second question',
      choosePrompt: 'Choose a question',
      error: {
        bothRequired: 'Choose both questions and answer each one.',
        distinct:     'Choose two different questions.',
      },
      // Non-fatal: the account exists, but the answers did not save on the first
      // try. We point the user at the account-page section that now exists for
      // setting them later (see security.account below).
      saveDeferred: 'Your account is ready. You can set your security questions later in the Account recovery questions section of your account page.',
      // Account-page section: a signed-in user sets or replaces their two
      // recovery questions here. Formal register, no contractions.
      account: {
        heading:     'Account recovery questions',
        prose:       'Set two questions and answers. If you ever forget your password, we will ask one of them at random to confirm the account is yours.',
        statusSet:    'Your recovery questions are set.',
        statusNotSet: 'You have not set any recovery questions yet.',
        currentLabel: 'Current questions',
        edit:        'Set recovery questions',
        replace:     'Replace recovery questions',
        cancel:      'Cancel',
        save:        'Save recovery questions',
        saving:      'Saving',
        saved:       'Your recovery questions are saved.',
        saveError:   'We could not save your recovery questions. Please try again.',
        // Gentle, non-blocking nudge shown on the account page when no questions
        // are set. Points to this same section.
        nudge:       'Set up account recovery questions so you can reset your password if you ever forget it.',
      },
    },
    // Minimal email-confirmation landing page. The confirmation link lands here,
    // NOT in the original signup window — that window polls and signs itself in.
    // This page just confirms the click and invites the user to close the tab.
    confirm: {
      title:       'Email confirmed',
      confirming:  'Confirming…',
      confirmed:   'Your email is confirmed. You can close this tab. Your original window is signing you in.',
      // Browsers block scripts from closing tabs the user opened, so the close
      // button is best-effort and we say so plainly.
      closeTab:    'Close this tab',
      closeNote:   'If this tab does not close, you can close it yourself.',
      failed:      'We could not confirm this link. It may have expired. Return to sign in and request a fresh one.',
      goSignIn:    'Go to sign in',
    },
    placeholder: {
      email:           'Email address',
      password:        'Password',
      confirmPassword: 'Confirm password',
    },
    rememberMe: 'Remember me on this device',
    localMode:  'Running in local mode. No backend configured.',
    error: {
      generic:    'Something went wrong. Try again.',
      invalid:    'That email or password did not work.',
      rateLimit:  'Too many attempts. Try again in a minute.',
      network:    'No network. Check your connection.',
      // Bare fallbacks for the auth handlers. Each states what went wrong and
      // what to do, with no blame. Formal register, no contractions (auth copy).
      // The catch sites keep `e.message || t(...)` so an upstream lib message
      // still wins; only these literals moved off the handler.
      passwordTooShort: 'Your password must be at least six characters.',
      passwordMismatch: 'Those passwords do not match.',
      passwordRequired: 'Enter a new password to continue.',
      emailRequired:    'Enter your email address to continue.',
      signInFailed:     'We could not sign you in. Please try again.',
      signUpFailed:     'We could not create your account. Please try again.',
      resetFailed:      'We could not send the password reset link. Please try again.',
      magicLinkFailed:  'We could not send the sign-in link. Please try again.',
      oauthFailed:      'We could not complete the sign-in. Please try again.',
    },
    legal: 'By continuing you agree to the Terms and Privacy Policy.',
  },

  // ── Pricing ───────────────────────────────────────────────────────────────
  pricing: {
    eyebrow:      'Plans',
    pageTitle:    'Pricing',
    pageSubtitle: 'Generate a town in seconds. Then run the region for years.',
    antiAi:       'Settlements are simulated from constraints, not generated by AI. Only the optional Narrative Layer uses language synthesis, and it grounds itself in the simulator output.',
    tiers: {
      heading:     'Subscription tiers',
      wanderer: {
        name:        'Wanderer',
        priceLabel:  'Free',
        priceSub:    'forever',
        tagline:     'For the curious DM trying things out.',
        cta:         'Start free',
        // Size is FREE: a free account generates ANY size up to metropolis
        // (anon visitors cap at town — signing up is what unlocks full size).
        features: [
          'Generate any size, from hamlet to metropolis',
          '3 saved settlements',
          'Share your settlements to the community Gallery',
          'Keep any dossier’s PDF for $2.99, yours to re-download',
          'Pay-per-use narrative refinement (credit packs)',
        ],
      },
      cartographer: {
        name:        'Cartographer',
        priceLabel:  '$5.99',
        priceSub:    'per month',
        tagline:     'For the DM running a campaign.',
        cta:         'Subscribe',
        // NOTE: size is FREE (free accounts reach metropolis), so "capital size"
        // is no longer a premium bullet. The premium product is the living
        // SIMULATION; storage/saves stays as a secondary bullet.
        features: [
          'Advance time and run the region for years',
          'Campaigns: link settlements into one living world',
          'The self-ending war layer + the living pantheon',
          'Custom content + import settlements from the Gallery',
          'Unlimited saves + cloud sync',
          'Unlimited PDF and JSON export of every settlement',
          '30 narrative credits every month, then pay-per-use packs',
        ],
      },
      founder: {
        name:        'Founder Lifetime',
        priceLabel:  '$99',
        priceSub:    'one-time',
        tagline:     'The first 30 supporters keep Cartographer forever.',
        cta:         'Claim a Founder seat',
        seatsRemaining: '{remaining} of 30 seats remaining.',
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
      description: 'One-time payment. We’ll generate, export, and email you a full PDF. No account needed.',
      cta:         'Buy a one-shot dossier',
    },
    creditPacks: {
      heading:  'Narrative Credit Packs',
      subhead:  'A credit refines one settlement\'s data into narrated prose. Buy in bulk for a deeper discount. Purchased credits never expire.',
      pack:     '{credits} credits',
      perEach:  '{price}/ea',
      best:     'Best value',
      value:    'Most popular',
    },
    faqLink: 'See the full pricing FAQ',

    // ── Simulation-led pricing variant (A/B) ───────────────────────────────
    // Selected when the `pricingSimulationCopy` flag is ON. Leads with the
    // actual premium product — the living simulation — and DELIBERATELY names
    // NO size/metropolis/capital as a premium feature (size is free). The
    // storage/saves line stays present but as a SECONDARY bullet. The
    // Wanderer variant explicitly states full-size generation is free.
    variant: {
      pageSubtitle: 'Generate a town in seconds. Then run the region for years.',
      tiers: {
        wanderer: {
          tagline:  'Generate any size from hamlet to metropolis, free. See if a campaign takes root.',
          features: [
            'Generate any size, from hamlet to metropolis, free',
            '3 saved settlements',
            'Share your settlements to the community Gallery',
            'Keep any dossier’s PDF for $2.99, yours to re-download',
            'Pay-per-use narrative refinement (credit packs)',
          ],
        },
        cartographer: {
          tagline:  'Generate a town in seconds, then run the region for years.',
          features: [
            'Advance time and the region runs for years',
            'The self-ending war layer: sieges, coalitions, conquest',
            'The living pantheon: deities contest converts and rise',
            'Campaigns + a chronicle that writes itself',
            'Custom content + import settlements from the Gallery',
            'Unlimited saves + cloud sync',   // secondary bullet — storage stays
            'Unlimited PDF and JSON export of every settlement',
            '30 narrative credits every month, then pay-per-use packs',
          ],
        },
        founder: {
          tagline:  'The whole living simulation, forever. Pay once.',
          features: [
            'Everything in Cartographer, forever',
            'Founder badge on your dossiers',
            'Direct line to the dev (Discord)',
            'Early access to new simulators',
          ],
        },
      },
    },
  },

  // ── The "What the Realm unlocks" value ladder ────────────────────────────
  // Three rungs (anon TRIES / free SAVES + full-size generation / premium
  // SIMULATES), lens-labeled. Size is FREE — it lives on the FREE rung, never
  // pitched as premium. Rendered on the About landing + the canonical
  // premium-value surface (PricingPage). Lens labels tailor the headline to
  // the reader (new DM → "a great town in seconds"; worldbuilder → "a living
  // region you can run").
  valueLadder: {
    heading:  'Three rungs, one engine',
    subhead:  'It generates a town in seconds, then it runs the region for years.',
    lens: {
      new:          'A great town in seconds, then a region that grows with you.',
      intermediate: 'A town a week, then a campaign that runs itself.',
      worldbuilder: 'A living region you can run for years.',
    },
    rungs: {
      tries: {
        eyebrow: 'Try it',
        tier:    'No account',
        body:    'Generate a coherent town up to town size, no signup. See the moat before you commit.',
        cta:     'Forge a settlement',
      },
      saves: {
        eyebrow: 'Save it',
        tier:    'Free account',
        // Full-size generation belongs to the FREE rung — size is not premium.
        body:    'A free account generates any size, from hamlet to metropolis, and saves your work. Keep any dossier’s PDF for $2.99.',
        cta:     'Create a free account',
      },
      simulates: {
        eyebrow: 'Run it',
        tier:    'Cartographer',
        body:    'Advance time and the region runs for years: wars ignite and end, faiths rise, trade routes flip, and a chronicle writes itself. Off by default, opt-in, reversible.',
        cta:     'See what the Realm unlocks',
      },
    },
  },

  // ── AI feature labels (with inline cost) ─────────────────────────────────
  // Cost is interpolated at call time so we never drift between UI + ledger.
  ai: {
    narrative: {
      button:      'Generate narrative ({cost} credits)',
      shortLabel:  'Narrative',
      description: 'A literary thesis of the settlement, refined across 13 passes.',
      running:     'Composing the thesis…',
    },
    dailyLife: {
      button:      'Generate daily life ({cost} credits)',
      shortLabel:  'Daily life',
      description: 'Five parallel paragraphs from dawn to night, in the voice of the place.',
      running:     'Living the day…',
    },
    progression: {
      button:      'Generate progression ({cost} credits)',
      shortLabel:  'Progression',
      description: 'A diff-aware evolution of the prior narrative against new state.',
      running:     'Tracking what changed…',
    },
    insufficient: 'You need {cost} credits for this. You have {balance}.',
    buyMore:      'Buy more credits',
    // Inline "Polish with AI" hook + CTA shown on the dossier (migrated here
    // from the retired copy/strings.js so there is one copy registry).
    inlineHook:   'Want table-ready prose?',
    polishCta:    'Polish with AI',
    // Cost is interpolated at call time. Follows the house convention (see
    // ai.narrative.button / ai.insufficient) of always pluralizing "credits" —
    // the narrative cost is 3 (fast 2), so the singular case never renders.
    inlineHint:   '{cost} credits · streams section by section · partial failures keep your raw draft intact',
    // Regenerate / progress verbs (migrated from copy/strings.js `ai.*`).
    regenerateCta:  'Regenerate narrative',
    regenerateHint: '{cost} credits · replaces the current prose with a fresh pass',
    progressCta:    'Apply event and progress narrative',
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
    dailyLife:     'A day in the life: dawn to dusk to dusk again.',
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
    firstRun: {
      stepCounter:  'Step {current} of {total}',
      step0Title:   "Let's build your first settlement",
      step0Body:    'Pick a size below (Thorp is small, Metropolis is huge), then click Generate. You can always regenerate or tweak the sliders.',
      step1Title:   'Ready to forge your world',
      step1Body:    'Hit the Generate button below. Every click rolls a fresh settlement shaped by your choices. Economy, factions, NPCs, crises.',
      step2Title:   'Here it is. Explore the tabs',
      step2Body:    'Each tab reveals a different layer: Summary hooks, Daily Life, Economics, Power, NPCs, History, and more. Click around.',
      step3Title:   "You're all set",
      step3Body:    'Save this to your library, keep its PDF for $2.99, or start a new settlement. The top tabs hold the Compendium, the World Map, and deeper guides.',
      finish:       'Finish tour',
      dismiss:      'Dismiss onboarding',
    },
    checklist: {
      title:           'Get the most from SettlementForge',
      subtitle:        'Five small things. Knock them out as you explore.',
      itemGenerate:    'Generate your first settlement',
      itemRead:        'Read three different tabs',
      itemRail:        'Tap a step in the simulation rail',
      itemSave:        'Save the dossier',
      itemNeighbour:   'Link a second settlement (Neighbourhood System)',
      completeBadge:   'Complete',
    },
  },

  // ── Guidance layer (W-GUIDE-1) — the plain register ──────────────────────
  // The house voice for the guidance whispers registered in
  // src/domain/display/guidanceRegistry.js. Software about software: no persona,
  // no second person costume. W-GUIDE-2 adds the Surveyor's-notes register
  // (guidanceNotes) alongside these; the registry SHAPE is ready for it.
  guidance: {
    // The first-dossier teaching band (FirstDossierCallouts — re-registered).
    dossierFirstCallouts: 'Three quick reads on what the engine already decided here.',
    // The retired PostGenCoach's three steps, preserved (§5).
    postGenCoach: {
      read:      'Every tab is a different angle on the same place. Start with Overview.',
      simulated: 'The rail shows the steps the engine took. Open any to see what it decided.',
      save:      'Sign in and your work survives the tab close. Your first three saves are free.',
    },
    // The post-generate what's-next guide (WizardNextSteps).
    wizardNextSteps: 'A short, state-aware list of what to do with a fresh settlement.',
    // The return-visit resume (WelcomeBackCard).
    welcomeBack: 'Pick up your last settlement, or forge a follow-up.',
    // The absorbed HelpPopover compendium hints (§5) — title + body per config
    // topic, moved out of the component's inline COMPENDIUM_HINTS. The anchor
    // (glossaryRef) lives in the registry so the lifeline link cannot drift.
    compendium: {
      tradeRoute: {
        title: 'Trade Route',
        body: 'How goods, news, and trouble move through the settlement. Crossroads = high diversity. River = food security. Isolated = thin services, high secrets.',
      },
      terrain: {
        title: 'Terrain',
        body: 'Constrains what the settlement can produce, defend, and rely on. Coastal towns import grain; mountain holds export stone. Frontier terrains bias toward militarized institutions.',
      },
      culture: {
        title: 'Culture',
        body: 'Names, naming patterns, institution flavor, faction archetypes. Drives the prose of the place more than the math. A "germanic" town and a "south-asian" town with identical configs read very differently.',
      },
      monsterThreat: {
        title: 'Monster Threat',
        body: 'Heartland = monsters are rumor. Frontier = active patrols. Plagued = the militia is the most important institution and people lock their doors at dusk.',
      },
      magicLevel: {
        title: 'Magic Level',
        body: 'Mundane = no magical economy. Common = magic shops in cities; everyday charms in villages. High = magic is the economy. Affects institution distribution + NPC archetypes.',
      },
      tier: {
        title: 'Settlement Tier',
        body: 'Thorp through Metropolis. Each tier sets the institution count, NPC count, district count, and what kinds of stressors are likely. Bigger ≠ better; a thorp can carry one perfect hook better than a metropolis.',
      },
    },
    // ── The Surveyor's-notes register (W-GUIDE-2, §4) ─────────────────────
    // The in-world persona voice: scripted marginalia the map's keeper reads
    // at rest-points. Second person REQUIRED (the register guard); UI-verbs
    // (click/tap/button/menu) BANNED — those belong to the plain register.
    // Selected by guidanceNotes.js (FNV-1a over a stable id); rendered by
    // SurveyorNote.jsx (the ✦ eyebrow + serif prose + "— S." signature).
    // Keys are addressed by guidanceNotes.NOTE_LINES; the walker binds both
    // directions so prose and keys cannot drift.
    notes: {
      library: {
        empty: {
          a: 'Your shelves stand empty, and that is only the first morning of your survey — every realm here began exactly where yours does now.',
          b: 'You have an empty study and a whole country to chart; start with one settlement and let the rest of your library grow around it.',
        },
        first: {
          a: 'Your first settlement is on the shelf now — keep it, and it will still be here when you return to build the next.',
          b: 'You have made your first mark; the settlements that follow will feel like neighbours to it, not strangers.',
        },
        onward: {
          a: 'Your library has grown past a single page — try binding two of your settlements as neighbours, and watch their fortunes start to lean on one another.',
          b: 'You have kept enough now to see the pattern in your own hand; the realm rewards a keeper who lets places touch.',
        },
      },
      realm: {
        empty: {
          a: 'You are looking at an unmarked realm; set down your first holdings and the distances between them become something the simulation can read.',
          b: 'Your map waits for its first settlement — once you place one, the roads, the borders, and the reach of each become yours to shape.',
        },
        first: {
          a: 'You have set your first stone on the realm; freeze its geography when you are ready, and the world will remember where everything stands.',
          b: 'Your realm has one fixed point now — the more you place, the more the country between them starts to matter.',
        },
        onward: {
          a: 'You have a realm worth advancing; let a season pass and see which of your settlements thrives and which one you will need to tend.',
          b: 'Your country has grown crowded enough to have its own weather — let time run, and read what the year does to the places you made.',
        },
      },
      dossier: {
        empty: {
          a: 'You have not yet forged a place to read about; make one, and this page fills with a country of reasoning that is wholly yours.',
          b: 'Your dossier stays unwritten until you generate; the moment you do, everything on it will have been decided for reasons you can inspect.',
        },
        first: {
          a: 'You are reading the engine’s own reasoning here, not a tale told at you; every line was decided before you arrived.',
          b: 'You will find no invented facts in your dossier — each figure was reasoned from the last, and you can trace any of them home.',
        },
        onward: {
          a: 'You have read enough dossiers to argue with one; when a figure surprises you, follow it back and see what the engine weighed.',
          b: 'Your eye has learned this page — look now for what the place is quietly straining under, and you will see its next year coming.',
        },
      },
      simulation: {
        empty: {
          a: 'You hold a realm that has never yet been advanced; give it a season, and you will learn more of it than any single dossier can tell.',
          b: 'Your country is holding its breath, unadvanced; let time pass through it and watch which of your choices the world decides to keep.',
        },
        first: {
          a: 'You have let the world move for the first time — nothing here waits politely for you; a place you neglect will change on its own.',
          b: 'Your realm has taken its first breath without you; return often, for the country keeps its own calendar whether you watch or not.',
        },
        onward: {
          a: 'You have watched a few seasons turn; trust the pressures the engine raises, for they read the year better than a hunch of yours will.',
          b: 'Your world has a memory now — what you let pass last season is quietly shaping the trouble you will meet in this one.',
        },
      },
      floor: {
        library: {
          a: 'You are the keeper of this library, and it grows only as fast as your own hand fills it.',
          b: 'Your shelves hold exactly the country you have chosen to make, and no more.',
        },
        realm: {
          a: 'You hold the whole realm in your keeping; every place upon it stands where you set it.',
          b: 'Your map is only as settled as you have made it, and it waits on your next mark.',
        },
        dossier: {
          a: 'You can trust what your dossier tells you, because none of it was invented to please you.',
          b: 'Your reading of a place goes only as deep as the questions you bring to it.',
        },
        simulation: {
          a: 'You set the world in motion, and thereafter it keeps its own counsel between your visits.',
          b: 'Your country lives on its own clock now, and it will not pause its year to wait for you.',
        },
      },
    },
  },

  // ── Account page ─────────────────────────────────────────────────────────
  account: {
    setDisplayName:        'Set display name',
    subscriptionHeading:   'Subscription & Credits',
    profileHeading:        'Profile',
    cardCurrentTier:       'Current Tier',
    cardCredits:           'Narrative Credits',
    cardSaves:             'Saved Settlements',
    fullAccess:            'Full Access',
    purchaseCreditsLabel:  'Purchase Credits (Volume Discounts)',
    purchaseErrorTitle:    'Purchase could not start. Try again or refresh the page.',
    // Referral card (107). The founder variant swaps the reward: a free month
    // is worthless against a lifetime seat, so founders earn credits instead.
    referralLabel:         'Refer a Friend',
    referralBody:          'Share your account ID. When someone subscribes for the first time and names it, you both get a month on us.',
    referralBodyFounder:   'Share your account ID. When someone subscribes for the first time and names it, you get 10 credits.',
    referralCopy:          'Copy account ID',
    referralCopied:        'Copied',
    referralNoId:          'Your account ID is assigned shortly after sign-up. Check back in a moment.',
    // Redeem block (107). Unknown / expired / exhausted codes all read the
    // same line on purpose, mirroring the validator's anti-enumeration.
    redeemLabel:           'Redeem a Code',
    redeemHint:            'Enter a code and we will check it before you pick a purchase.',
    redeemPlaceholder:     'SFC-XXXXXXXXXXXX',
    redeemApply:           'Apply',
    redeemChecking:        'Checking...',
    redeemValid:           'Code accepted. It will be applied at checkout.',
    redeemAlreadyUsed:     'That code has already been redeemed on this account.',
    redeemInvalid:         'That code is not live.',
    redeemCheckFailed:     'The code could not be checked. Try once more.',
    redeemUnavailable:     'Codes cannot be checked in this environment.',
    redeemChoosePurchase:  'Choose a purchase',
  },

  // ── Gallery (public dossier listing) ────────────────────────────────────
  gallery: {
    eyebrow:      'From the community',
    pageTitle:    'Gallery',
    pageSubtitle: 'Settlements other DMs have shared. Browse for inspiration; click a tile to read the full dossier.',
    antiAi:       'Every dossier in the gallery was simulated, not AI-generated. The settlements are derived from the same constraint engine, coherent because the simulator made them so.',
    forgeYourOwn: 'Forge your own',
    untitled:     'Untitled settlement',
    emptyTitle:   'No public dossiers yet.',
    emptyBody:    'Be the first to publish one. Every shared dossier becomes a permanent page anyone can find.',
    emptyFilteredBody: 'No settlements match your filters.',
    clearFilters: 'Clear filters',
    loadError:    'The gallery could not be loaded. Try again in a moment.',
    backToList:   'Back to gallery',
  },

  // ── Narrative drift modal — RETIRED. Its consumer (NarrativeDriftModal,
  //    the pre-apply gate for the Roster & Tune editor) was deleted in
  //    86fffff; the keys stay only because tests/copy/copy.test.js pins
  //    them. Drop this block together with that test's narrativeDrift
  //    cases. The post-apply replacement lives under `staleNarrative`. ─────
  narrativeDrift: {
    headingSeismic:    'This is a big change.',
    headingStructural: 'This change will drift the narrative.',
    body:              'The narrative layer on this save reasons about the facts you’re changing. A mechanical substitution won’t keep the prose honest. The thesis, faction blurbs, and institution descriptions were written against the old state.',
    pickOne:           'Pick one:',
    regenerateTitle:   'Apply & Regenerate Narrative',
    regenerateBody:    'Full re-run against the new state. Spends {cost} credits.',
    progressTitle:     'Apply & Progress Narrative ({cost} credits)',
    progressBody:      'Evolve the existing narrative. Preserves voice and named NPCs.',
    revertTitle:       'Apply & Revert to Raw',
    revertBody:        'Clear the narrative and show raw data. No credits. Chronicle history is preserved.',
    cancelLabel:       'Cancel without applying',
    ariaCancel:        'Cancel',
  },

  // ── Stale narrative modal (post-apply: the prose no longer matches) ─────
  // Fires AFTER an event or batch has committed on a narrated save. The
  // change is already applied and stays applied — there is no cancel, only
  // "re-run the narrative now" or "carry on with the raw simulation".
  staleNarrative: {
    heading:         'The narrative is now out of date.',
    body:            'Your change is applied. The prose on this save was written against the previous state, so it does not yet know what just happened.',
    regenerateTitle: 'Regenerate narrative',
    regenerateBody:  'Re-run the narrative against the new state. Spends {cost} credits.',
    continueTitle:   'Continue with raw simulation',
    continueBody:    'No credits spent. The dossier shows the raw simulation until you regenerate later.',
    ariaClose:       'Close',
  },

  // ── Purchase modal (credit packs + single dossier) ──────────────────────
  purchase: {
    title:             'Buy more credits',
    subtitle:          'Purchased credits never expire and apply to every narrative refinement feature (monthly Cartographer credits reset each cycle).',
    packsHeading:      'Narrative Credit Packs (Volume Discounts)',
    bestLabel:         'Best value',
    valueLabel:        'Most popular',
    perCreditTemplate: '{price}/credit',
    failureMessage:    'Checkout could not start. Try once more.',
    // Redeem-code disclosure (107). The code is advisory input; create-checkout
    // re-validates and reserves it, and a code that does not fit comes back as
    // a non-fatal notice while the purchase proceeds at the regular price.
    haveCode:          'Have a code?',
    codeLabel:         'Redeem code',
    codePlaceholder:   'SFC-XXXXXXXXXXXX',
    codeAttached:      'This code rides along at checkout. If it does not fit the purchase, checkout continues at the regular price.',
    // Referral intent field (107). A rejection is a note, never a blocker.
    referredByLabel:       'Referred by someone? Their account ID',
    referredByPlaceholder: 'SF-XXXXXXX',
    referredByRecord:      'Record referral',
    referredByRecording:   'Recording...',
    referralRecorded:      'Referral recorded. The reward follows your first payment.',
    referralSelf:          'That is your own account ID, so the referral was not recorded.',
    referralUnknown:       'That account ID was not recognized, so the referral was not recorded.',
    referralAlready:       'A referral is already recorded on this account.',
    referralCap:           'That account has reached its referral limit, so the referral was not recorded.',
    referralInactive:      'Referrals need an active account, so this one was not recorded.',
    referralFailed:        'The referral could not be recorded. Checkout is unaffected.',
  },

  // ── Errors (user-facing only — internal logs stay in console) ────────────
  errors: {
    saveFailed:   'Couldn’t save. Your work is still on screen. Try once more.',
    loadFailed:   'Couldn’t load that dossier. Refresh and try again.',
    networkOff:   'You’re offline. Reconnect and we’ll retry.',
    generateFail: 'The simulator hit a snag. We’re looking at it. Try again in a moment.',
    aiUnavailable: 'Narrative refinement is temporarily unavailable. The simulator is unaffected. Your settlement still generates and exports.',
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
    forging:     'Forging…',
    narrating:   'Narrating…',
    rerolling:   'Rerolling…',
  },

  // ── Save / signup / cap surfaces (P101 / X-3) ────────────────────────────
  save: {
    button:        'Save',
    primary:       'Save Draft',
    signupButton:  'Save this town (free account) →',
    afterAuthHint: 'We’ll save your dossier as soon as you’re in.',
    successTpl:    'Saved as {settlementName}. Find it in Settlements.',
    limitReached:  'You’ve hit the {limit}-save cap on the free tier.',
    // Migrated from copy/strings.js `save.*`.
    cloud:     'Save Draft to Cloud',
    saved:     'Draft saved',
    overwrite: 'Save replaces the existing draft for this slot.',
  },

  // ── Detail-view actions (migrated from copy/strings.js `detail.*`) ────────
  detail: {
    canonizeCta:  'Canonize for Campaign',
    canonizeHint: 'Marks this town as part of your campaign world. Future changes become events on a timeline.',
    canonizeAfter:  'Canon. Changes from here become campaign events.',
    resetToDraft:   'Reset to Draft',
    // Plural handled by the caller: pass {count} and {noun} ('entry'/'entries').
    resetWarning:   'Reset to draft and discard {count} timeline {noun}? This cannot be undone.',
    backToList:     'Back to list',
    // The next-action rail's gold rung for a canon settlement that has not yet
    // entered the Realm. Naming the destination ("the Realm") gives the step
    // strong information scent without inventing a new action.
    sendToRealmCta:  'Send it to the Realm',
    sendToRealmHint: 'Place this canon settlement in the Realm so the region advances around it.',
    openRealmCta:    'Open the Realm',
    openRealmHint:   'This settlement lives in the Realm. Open it to advance the region.',
  },

  // ── Export sheet (migrated from copy/strings.js `export.*`) ───────────────
  export: {
    primaryCta: 'Export Dossier',
    sheetTitle: 'Export Dossier',
    variants: {
      draft_brief:     { label: 'Draft Brief',     desc: 'Quick prep doc. No timeline, no canon-only chapters.' },
      canon_dossier:   { label: 'Canon Dossier',   desc: 'Full campaign-ready document with current state and timeline.' },
      timeline_packet: { label: 'Timeline Packet', desc: 'Lean recap: cover, current state, and timeline. For reviewing what changed since last session.' },
    },
    // Share-card export: a single PNG you can drop straight into Discord or a
    // forum post. Not premium-gated.
    imageCta:       'Export Image',
    imageBusy:      'Building image...',
    imageTitle:     'Download a share card (PNG) with this settlement’s name, tier, and headline stats.',
    imageError:     'Could not build the share image. Try again.',
  },

  // ── World-state badges + tooltips (migrated from copy/strings.js) ─────────
  // Keyed by state kind; StateBadge looks them up dynamically via tx().
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

  // ── Event composer (migrated from copy/strings.js `events.*`) ─────────────
  events: {
    panelTitleDraft: 'Test a Change (Draft)',
    panelTitleCanon: 'Apply In-World Event',
    previewCta:      'Preview',
    applyDraftCta:   'Apply',
    applyCanonCta:   'Apply to Timeline',
    cancelCta:       'Cancel',
  },

  // ── Timeline panel (migrated from copy/strings.js `timeline.*`) ───────────
  timeline: {
    title:        'Timeline',
    emptyState:   'Apply an in-world event to start the timeline.',
    undoTooltip:  'Undo this event. Restores prior state.',
  },

  // ── The lifecycle spine (migrated from copy/strings.js `lifecycle.*`) ─────
  // Draft, Saved, Canon, In the Realm, Shared. Labels name each step; hints
  // carry the next-step scent. Read by primitives/LifecycleSpine. Voice stays
  // plain and diegetic.
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

  // ── Two-canon vocabulary consolidation (PRODUCT_COHERENCE.md gaps 1 + 3) ──
  // The word "Canon" was overloaded across three axes: the settlement lifecycle
  // transition (settlementSlice canonize()), the campaign world-clock transition
  // (canonizeCampaignWorld), and per-entity provenance (domain/canonStatus.js).
  // Two different acts shared one bare label, so the most important transition in
  // the product happened invisibly. This block gives each act its own
  // UNAMBIGUOUS label; "Canon" stays reserved for the settlement lifecycle phase
  // in user copy. Surface adoption sub-waves (4h + the accept/reject surfaces)
  // consume these keys.
  canon: {
    // Settlement lifecycle transition — marks ONE settlement as campaign canon.
    markCanon:      'Mark Canon',
    markCanonHint:  'Marks this settlement as part of your campaign world. Changes from here are logged as events on a timeline.',
    markedCanon:    'Marked Canon. Changes from here become campaign events.',
    // Campaign world-clock transition — a DIFFERENT act. Starting the clock
    // advances the region around every canon settlement.
    startWorldClock:     'Start the World Clock',
    startWorldClockHint: 'Starts the campaign world clock so the region advances around your canon settlements.',
    // Per-entity provenance (domain/canonStatus.js) relabeled OFF the word
    // "Canon" so an entity badge never collides with the lifecycle phase.
    provenance: {
      locked:   'Locked',
      pinned:   'Pinned',
      optional: 'Optional',
    },
  },

  // ── Pricing-moment registry (P103 / X-2) ─────────────────────────────────
  // The single moment registry: lib/pricingMoments.js resolves copy by reason
  // through tx('moments.<reason>'). Keep keys snake_case to match the
  // pricingMoments.js storage layout. This is the CONSOLIDATED set: the base
  // value moments plus the conversion-arc and simulation-intent moments that
  // used to live only in the retired copy/strings.js pricing.moments block.
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
    first_save: {
      headline: 'Save it. Come back tomorrow.',
      body:     'Your dossier is yours to keep. Free tier holds 3 saves, plenty for a campaign’s first arc.',
    },
    anon_cap_hit: {
      headline: 'You’ve explored hamlet, village, town.',
      body:     'Sign in (free) to reach thorp through metropolis and save your drafts. Keep any dossier’s PDF for $2.99.',
    },
    first_pdf_export: {
      headline: 'You just downloaded your first dossier.',
      body:     'Save this settlement and keep its PDF for $2.99, yours to re-download. Cartographer exports every settlement, unlimited, with cloud sync.',
    },
    third_save: {
      headline: 'You’re building a campaign.',
      body:     'Wanderer caps at 3 saves. Cartographer unlocks unlimited saves, cloud sync, the neighbour network, and full export.',
    },
    regen_burst: {
      headline: 'You’re pushing the engine.',
      body:     'Locks, drift, chronicle: Cartographer hands you the worldbuilder controls.',
    },
    map_clicked: {
      headline: 'World Map unlocks with Cartographer.',
      body:     'Place settlements, draw routes, trace where the supply chains strain. Your campaign becomes a map.',
    },
    // ── The Realm hub locked-state teaser ────────────────────────────────
    // Fired from the Realm Dashboard when an anon/free user opens the Realm.
    map_realm_teaser: {
      headline: 'The Realm is where your world comes alive.',
      body:     'Advance time and watch wars ignite and end, faiths rise, and the chronicle write itself. Cartographer runs the living simulation across your whole campaign.',
    },
    // ── Simulation-intent moments ────────────────────────────────────────
    // Fired when a non-premium user reaches toward a specific simulation system.
    // Each NAMES that system (never size — size is free).
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
      body:     'Your first Narrative is on us. It turns this town’s data into prose your players can hear.',
    },
    founder_eligible: {
      headline: 'You’ve earned this offer.',
      body:     'Five settlements, neighbours linked, dossiers exported. Founder Lifetime is $99: lifetime Cartographer access and a seat in the credits.',
    },
  },

  // ── Audience-led pricing tile copy (P122 / X-10) ─────────────────────────
  // The three tiers each get an audience-shifted pitch line that
  // PricingPage surfaces above the existing feature list.
  // NOTE: size is FREE (free accounts reach metropolis), so NO pitch line here
  // sells size/metropolis/capital as premium. Premium is the simulation.
  pricingPitch: {
    wanderer: {
      lineNew:          'Generate any size, free. Find out if it works for you.',
      lineIntermediate: 'Any size, free forever. See if a session a week calls for more.',
      lineWorldbuilder: 'Try the engine, full size. Three saves is enough to see if the coherence holds.',
    },
    cartographer: {
      lineNew:          'When you’re ready for a campaign instead of an evening: advance time and watch the region run.',
      lineIntermediate: 'For DMs running a town a week. Advance time, link a campaign, let the chronicle write itself.',
      lineWorldbuilder: 'The worldbuilder’s tier: the war layer, the pantheon, campaigns, and the chronicle.',
    },
    founder: {
      lineNew:          'For DMs who already know they’ll build campaigns. Pay once, run every region.',
      lineIntermediate: 'Two years of Cartographer for $99. Lifetime access. 30 seats only.',
      lineWorldbuilder: 'For DMs running living regions. Pay once, run every campaign you’ll ever build.',
    },
  },

  // ── Pipeline reveal step labels (P100 / X-1) ─────────────────────────────
  // Marketing-facing translations of the actual pipeline step names.
  // Theatrical by design — the user sees engine work, not function names.
  pipelineSteps: {
    resolveConfig:          'resolving constraints…',
    resolveResources:       'sourcing resources…',
    resolveStress:          'reading the pressure…',
    resolveNeighbour:       'binding neighbours…',
    assembleInstitutions:   'sourcing institutions…',
    subsumptionPass:        'collapsing duplicates…',
    cascadePass:            'cascading tensions…',
    isolationPass:          'walking outliers…',
    generateEconomy:        'building the market…',
    generatePower:          'naming the powers…',
    neighbourFactions:      'mirroring the neighbours…',
    factionCorrelationPass: 'finding alliances…',
    generatePopulation:     'casting NPCs…',
    generateNarratives:     'knotting hooks…',
    assembleSettlement:     'assembling the dossier…',
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
    // Muted hint beneath the Generate Narrative button when a per-model token
    // estimate is available. Calm archivist voice: a plain size read, not a
    // sales pitch. {n} is already rounded to the nearest thousand by the caller;
    // {model} is the display label for the reader's chosen narration model.
    tokenEstimate: 'Runs about {n}k tokens on {model}.',
  },

  // ── PDF export ladder (migration 108) ──────────────────────────────────────
  // The Buy CTA on a saved dossier, its unsaved-first state, and the anonymous
  // pre-checkout ladder popup. Calm archivist voice: state the offer plainly,
  // present the one-time download AS one-time (the retro auto-upgrade is a
  // grace we never promise up front, since it depends on browser storage).
  dossierExport: {
    // Free account, dossier SAVED, no durable right yet.
    buySaved: {
      cta:      'Keep the PDF for this settlement · {price}',
      subline:  'A one-time purchase. The download stays yours for as long as this settlement is in your library.',
      busy:     'Redirecting…',
      error:    'Checkout could not start. Please try again.',
    },
    // Free account, dossier NOT saved yet. Durable rights attach to a save, so
    // the honest path is to save first.
    saveFirst: {
      cta:      'Save this settlement to buy its PDF',
      subline:  'Durable download rights attach to a saved settlement. Save it first, then the {price} purchase is yours to re-download.',
      atCap:    'Your free account is at its save limit. Free a slot, or move to Cartographer for unlimited exports.',
      error:    'Could not save this settlement. Please try again.',
    },
    // Anonymous pre-checkout ladder popup.
    ladder: {
      title:    'How would you like your dossier?',
      intro:    'Three ways to take this settlement with you.',
      account: {
        label:       'Create a free account',
        description: 'Save this settlement, then buy its PDF once and keep re-downloading it. No card to start.',
      },
      cartographer: {
        label:       'Consider Cartographer',
        description: 'Unlimited PDFs of every settlement you save, plus the living simulation. {price}/mo.',
      },
      oneTime: {
        label:       'Continue with the one-time download',
        description: 'Pay {price} once and download this dossier now. No account needed.',
      },
      cancel:   'Never mind',
    },
    // Silent same-device retro auto-upgrade confirmation toast.
    claimed:  'This settlement’s PDF is yours. You bought it before you signed up.',
  },

  // ── Workshop (P107 / CP-2) ───────────────────────────────────────────────
  // OUR-side surface copy retained (the /workshop route + ModeSelector wiring
  // still resolve these). Their tree deleted its Workshop block; we keep ours
  // so no surviving OUR consumer sees a missing key. Surface waves drop this
  // together with the Workshop feature if it is fully retired.
  workshop: {
    navLabel:       'Workshop',
    locked:         'Workshop unlocks with Cartographer.',
    lockedBody:     'Drag and drop institutions, resources, and stressors. Cascade-preview before you commit. Bring your own custom content.',
    upgradeCta:     'Upgrade for $6/mo',
    samplePreview:  'See a sample →',
  },

  // ── Sample dossier proof card (P128 / H-2) ───────────────────────────────
  // Renders below HomeHero for anonymous visitors. Three callouts, each
  // aimed at a different reader. The teach beats are deliberate — every
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
        body:    'The salt road breaks at Whitestone Pass and preserved-meat exports halt in 11 days. The famine cascade is primed. Pull any thread and the next one tightens.',
      },
      fridaysSession: {
        eyebrow: 'For Friday’s session',
        body:    '“The wall-fund ledger has gone missing. The Captain blames the merchants. The merchants blame the militia. Someone is hiding it in plain sight.”',
      },
    },
    footer: 'A whole settlement from the simulator. Yours generates in eight seconds.',
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
      body:    'If the salt road closes, this town runs out in 11 days. That’s a session. Supply chains aren’t flavor, they’re fuel.',
    },
    hook: {
      eyebrow: 'Where hooks come from',
      body:    'This hook came from the tension above, not a random table. That’s the difference between a simulator and a roller.',
    },
    dismissLabel: 'Got it',
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  // Lives in copy/footer.js (EAGERLY segmented with its own t() — the app
  // shell's footer is the one first-paint copy consumer, and importing it from
  // here would drag this whole registry into the eager entry chunk). Spread
  // back in so the full `en` tree stays complete for tests + the copy linter.
  footer,

  // ── AuthModal premium blurb (simulation-led) ──────────────────────────────
  // Rewritten to lead with the SIMULATION, not storage. Size is free — a free
  // account unlocks FULL-SIZE generation, so it sits on the free line, never
  // the premium one.
  authBlurb: {
    freeLabel:    'Free account',
    freeBody:     'Generate any size, from hamlet to metropolis, and save your work. Keep any dossier’s PDF for $2.99.',
    premiumLabel: 'Cartographer',
    premiumBody:  'Advance time and run the region for years: the self-ending war, the living pantheon, campaigns, and a chronicle that writes itself.',
  },

  // NOTE: the Welcome-page copy namespace `landing.*` moved to its own module
  // (src/copy/landing.js) as part of the scrollable-landing rebuild. It is
  // lazily SEGMENTED — the copy AND its tl() lookup ride the lazy HomeLanding
  // chunk — so its ~4 kB of verbatim marketing copy never rides the eager
  // first-paint entry chunk (first-paint byte budget). The old flag-gated V2
  // band keys (proofHeading/livingHeading/closingLine/…) were removed with the
  // band rewrite; nothing else referenced them.

  // ── About "The Living World" tab + landing thesis ─────────────────────────
  // The About page is reframed as LANDING + HOW-TO around one thesis. The
  // Living World tab names each premium system as a claim + a one-line
  // "how it stays coherent" + the opt-in / off-by-default / reversible
  // qualifier. Size is FREE and is never sold here as premium.
  aboutLiving: {
    headerEyebrow: 'How the simulator works',
    headerTitle:   'About SettlementForge',
    thesis:      'It generates a town in seconds, then it runs the region for years.',
    thesisSub:   'The static dossier is the start. Advance time and the whole region becomes a living, self-consistent simulation: wars that end themselves, faiths that rise, a chronicle that writes itself.',
    premiumChip: 'Cartographer',
    qualifier:   'Off by default · opt-in · reversible',
    intro:       'These are the systems the simulation runs once you advance time. Each one is premium, opt-in, and off until you turn it on. A peacetime, non-campaign save renders exactly as it does today.',
    systems: {
      advanceTime: {
        title:     'Advance Time',
        claim:     'Push the world forward a month at a time and the whole region responds at once.',
        coherence: 'Every change is derived from the same causal substrate the dossier already shows. Nothing moves at random, and each shift carries its own record of what changed and why.',
      },
      war: {
        title:     'The self-ending war',
        claim:     'Sieges form, coalitions gather, settlements fall, yet wars burn themselves out.',
        coherence: 'War drains the economy, which feeds war-exhaustion, which drives the realm back to peace. The homeostasis is the engine, not a script.',
      },
      pantheon: {
        title:     'The living pantheon',
        claim:     'Deities contest converts, win seats, and rise from cult to major across the region.',
        coherence: 'Faith couples back into the world: alignment shifts corruption, temperament shifts aggression, rank shifts magic legality. These are the same constants the dossier reads.',
      },
      chronicle: {
        title:     'The chronicle',
        claim:     'Every advance writes itself into a scrubbable history of what happened and to whom.',
        coherence: 'The chronicle is derived from the pulse record, not authored separately. It can only say what the simulation actually did.',
      },
    },
  },

  // ── Anon "Watch a region wake up" replay ──────────────────────────────────
  // A READ-ONLY, deterministic, pre-baked sequence over a small canned fixture,
  // rendered through the EXISTING projections (no live engine, no rng). The
  // anon teaser that lets a no-account user SEE the premium product.
  replay: {
    eyebrow:  'A region waking up',
    title:    'Watch a region wake up',
    subtitle: 'One campaign, advanced four months. No account, the same read-outs the simulation produces.',
    stepLabel: 'Month {step} of {total}',
    prev:     'Back',
    next:     'Advance a month',
    restart:  'Restart',
    footer:   'This is the living world. Cartographer runs it across your whole campaign.',
    cta:      'See what the Realm unlocks',
    empty:    'At peace.',
  },

  // P138 / AC-4 — Inline FAQ on the Account page. Each entry is a
  // short Q + a 1-2 sentence A. Keep tone plain and free of marketing
  // hedge — these are the answers users would otherwise email support
  // for. Edit freely; the keys are stable.
  accountFaq: {
    creditGrant: {
      q: 'How does the free first Narrative work?',
      a: "Every account gets one free Narrative. It refines a saved settlement into prose, and it costs you nothing the first time. After that, AI actions spend credits: a Narrative is 3, Daily Life is 4, and a Progression pass is 5. Buy more from the Subscription panel.",
    },
    cancelAnytime: {
      q: 'Can I cancel my subscription?',
      a: 'Yes. Open the Manage Subscription link in your Stripe portal. Cancellation takes effect at the end of your current billing period; you keep access until then.',
    },
    refundWindow: {
      q: 'Do you offer refunds?',
      a: 'Single-dossier purchases are refundable within 7 days if you have not exported or downloaded the PDF. Subscription refunds are handled case-by-case via Customer Support below.',
    },
    founderLifetime: {
      q: 'What is the Founder Lifetime plan?',
      a: 'A one-time payment that unlocks every current and future tier for the life of the product. Capped at the first 30 buyers; the counter is live above this FAQ.',
    },
    galleryPrivacy: {
      q: 'Is my settlement private when I save it?',
      a: 'Yes by default. Only you can see saved settlements. Sharing to the public Gallery is an explicit opt-in per settlement. The toggle lives in the dossier header.',
    },
    aiOrSim: {
      q: "Does SettlementForge use AI to write my settlement?",
      a: 'The structural layer (population, factions, supply chains, hooks) is a deterministic simulator, not an LLM. Optional Narrative Refinement spends a credit to turn the simulation into prose. You can keep the raw output and skip the LLM entirely.',
    },
  },
});
