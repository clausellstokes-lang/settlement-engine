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
    // ⚠ THE PROMISE IS SCOPED TO WHAT THE CODE ACTUALLY DOES (2026-09-18). It read
    // "Your first dossier is yours to keep", which claims durable ownership, and
    // an anonymous account has no library to keep anything in (authSlice
    // TIER_GATE maxSaves 0). What is true is narrower and still worth saying: the
    // draft is persisted device-locally while nobody is signed in, so a refresh or
    // a later visit in the same browser finds it (store/persistProjection.js). The
    // sibling `note` below carries the sign-in step, so this line does not have to.
    ctaSubline: 'No account needed. Your first dossier stays in this browser.',
    note:       'Free anonymous generations are capped at town size. Sign in to push further.',
    // ── Two-voice rewrite ───────────────────────────────────────────────
    v2: {
      headline:     'Most generators roll on a table.',
      headlineAccent: 'This one simulates.',
      deck:         'First settlement or hundredth: the pieces explain each other.',
      ctaTemplate:  'Forge a {tier} →',
      // ⛔ THE ANON ALLOWANCE IS TWO BUCKETS, NOT THREE INTERCHANGEABLE RUNS.
      // lib/anonGenCounter.js splits it into DEFAULT_DAILY_FULL_CAP (1 full
      // generation) + DEFAULT_DAILY_REROLL_CAP (2 rerolls of it), and
      // DEFAULT_DAILY_CAP is only their SUM, kept for legacy call sites. The one
      // line that rendered it said '{remaining} of {cap} free today', so a
      // first-time visitor was told '3 of 3 free today' and then hit the wall
      // after one settlement. Three states, three sentences, each counting down
      // from the live counter; the at-cap copy (hero.anonCap.*) takes over when
      // both buckets are spent.
      //
      // ⛔ BOTH NOUNS INFLECT, AND NEITHER COUNT IS SPELLED IN THE STRING. The
      // first cut hardcoded the singular ('{full} free settlement today') and the
      // reroll count ('plus 1 reroll'), so raising DEFAULT_DAILY_FULL_CAP to 2
      // would have rendered "2 free settlement today" — a cap change silently
      // producing broken copy on the funnel's hottest line. The registry has no
      // plural helper (copy/index.js t() does {token} interpolation and nothing
      // else), so the two nouns are two forms each, chosen by the caller and
      // interpolated: the words stay in the registry where a translator can reach
      // them, and no number is written into a sentence.
      subline:          '{full} free {settlements} today, plus {rerolls} {rerollWord}',
      sublineNoRerolls: '{full} free {settlements} today',
      sublineRerolls:   'Rerolls left today: {rerolls}',
      settlementOne:    'settlement',
      settlementMany:   'settlements',
      rerollOne:        'reroll',
      rerollMany:       'rerolls',
    },
    // ── Anonymous cap framed as an unlock ───────────────────────────────
    // ⛔ THE UNLOCK NAMED SIZES THE READER ALREADY HAD, AND THEN TOO FEW. The first
    // cut said "reach thorp through metropolis" and sold back three sizes the reader
    // had spent; the correction said "city and metropolis" and was short a THORPE,
    // because the anonymous sizes are the three the headline names and a thorpe is not
    // among them (the owner, 2026-09-19). ⚠ THIS STRING IS NOT INTERPOLATED — nothing
    // supplies it vars — so the list is written out, and tests/copy/signInUnlocks.test.js
    // binds it to config/tierFacts.js signInUnlocksSizes(): the words cannot drift from
    // the derivation without redding.
    capUnlock: {
      headline:   'You’ve explored hamlet, village, town.',
      body:       'Sign in (free) to reach thorpe, city, and metropolis and save your drafts. Keep any dossier’s PDF for $2.99.',
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
      // ⛔ THE SIZES ARE INTERPOLATED, NEVER TYPED (the owner, 2026-09-19). This twin
      // said "city and metropolis" and so did the sentence that renders (HomeHero) —
      // both owed the reader a THORPE as well, since the anonymous sizes are the three
      // `spent` names. `{sizes}` comes from config/tierFacts.js signInUnlocksSizes(),
      // the ladder minus the anonymous set, so a ceiling that moves rewrites this line.
      unlockTpl: '{signin} to reach {sizes} and save your drafts. Keep any dossier’s PDF for $2.99.',
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
    // THE GAUGE — the commissioning desk's scale-rule size strip (Deep Craft
    // cluster 1). Figures come from data/constants POPULATION_RANGES at render;
    // no number is ever spelled here (the copy law).
    gauge: {
      label:    'Settlement size',
      souls:    'souls',
      capMemo:  'The lighter sizes open with a free account.',
    },
    // Clerk's-note rubric heads (Deep Craft cluster 1 — the apparatus voice).
    notes: {
      errorRubric: 'Generation failed',
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
    subtitle: 'Every stage leaves a record. Open one to see what it decided and why.',
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
    // THE SYSTEM IS CALLED THE NEIGHBOUR SYSTEM everywhere it is documented: the
    // Compendium tab (CompendiumPanel.jsx), its search category, and the Practical
    // Guide's reference row. Only these auth strings and the checklist said
    // "Neighbourhood System", which is a different phrase for the same feature on
    // the two surfaces a new account meets first.
    subtitle: 'Saves, larger settlements, and the Neighbour System.',
    signinSubtitle: 'Sign in to keep your work: saves, larger settlements, and the Neighbour System.',
    signupSubtitle: 'Create a free {tier} account to save your work, reach larger sizes, and link settlements in the Neighbour System.',
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
      emailMayExist:    'That email may already have an account. Try signing in, or reset your password.',
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

  // ── Refusals ──────────────────────────────────────────────────────────────
  // ⛔ NO GATE REFUSES SILENTLY (owner ruling, ODQ §934.24(c)). Every reason a gate
  // may refuse is registered in lib/refusalReasons.js and says its piece HERE, in one
  // block, rendered by components/primitives/RefusalNotice.jsx wherever the reader
  // clicked. Before this, four surfaces each hand-rolled the same anonymous-cap
  // pre-flight and three of them answered it by navigating with nothing said.
  //
  // EACH LINE NAMES THE REASON AND THE DOOR, and every tier fact in one is
  // INTERPOLATED (config/tierFacts.js) so it can never drift from the gate that is
  // actually enforcing it (store/authSlice.js TIER_GATE).
  //
  // ⚠ `bodyRef` RATHER THAN A SECOND COPY OF A SENTENCE. Two of these failures already
  // have their words in `errors.*`, written for exactly them and pinned by the
  // error-copy register. Those reasons point at the existing key instead of restating
  // it; the walker follows the pointer and proves it resolves.
  // ⛔ `{sizes}` IS SUPPLIED BY THE NOTICE, NOT BY THE GATE (the owner, 2026-09-19).
  // Two of these sentences typed the sizes a sign-in unlocks and so carried the same
  // stale list the hero did. primitives/RefusalNotice.jsx's `refusalCopy` injects
  // config/tierFacts.js signInUnlocksSizes() as a DEFAULT var for every reason, so a
  // refusal can name them without its raiser having to know the ladder — and a raiser
  // that passes its own `sizes` still wins, because the gate's facts beat a default.
  refusals: {
    dailyCap: {
      rubric: 'Free settlements',
      body:   'Today’s free settlements are spent. Sign in, free, to keep forging and to reach {sizes}.',
    },
    // ⛔ "THIS ACCOUNT" WAS SAID TO A VISITOR WITH NO ACCOUNT (REVIEW-P F13). The
    // 2026-09-20 anonymous walk forked the Black Crag sample and was told "A City is
    // past what THIS ACCOUNT forges" — a sentence that names a thing the reader does
    // not have, on the one surface whose next clause is an invitation to make one.
    // `{holder}` is the same class of fact as `{size}` and `{max}`: measured at the
    // gate, which is the only place the tier is known, and derived in ONE home
    // (config/tierFacts.js accountHolderPhrase) so the two phrasings cannot drift.
    tier: {
      rubric: 'A bigger settlement',
      body:   'A {size} is past what {holder} forges; it reaches up to a {max}. Sign in (free) to reach {sizes}.',
    },
    // ⛔ THE FLOOR IS NOT THE CEILING, AND THE CEILING'S SENTENCE WAS FALSE ON IT
    // (§934.34). `isTierAllowed` refuses a RANGE; for a thorpe at an anonymous visitor
    // the refusal came from the FLOOR and the copy raised was `tier`, which reads "A
    // Thorpe is past what this account forges; it reaches up to a Town". Its own reason,
    // its own sentence: what this size costs is an account, not an upgrade, and the
    // floor is named so the reader knows where the forge starts without one.
    tierTooSmall: {
      rubric: 'A smaller settlement',
      body:   'A {size} takes an account. Without one the forge starts at a {min}. Sign in (free) to reach {sizes}.',
    },
    // The SAME "this account" defect as `tier` above, reached by the other door: this
    // is the sentence an anonymous visitor meets when a 'random' roll lands over the
    // ceiling, so it is cured in the same edit rather than left as the next lane's find.
    resolvedTier: {
      rubric: 'A bigger settlement',
      body:   'That roll came out a {size}, past what {holder} forges, so it was not kept. Pick a size yourself, or sign in (free) to reach every one.',
    },
    generationFailed: {
      rubric:  'Generation failed',
      bodyRef: 'errors.forgeStart',
    },
    staleBuild: {
      rubric:  'Generation failed',
      bodyRef: 'errors.forgeUpdated',
    },
    // No door and no price: the admin panel is not sold, so this sentence must
    // not read as an upgrade prompt. It says whose page it is and stops.
    staffOnly: {
      rubric: 'Not this account',
      body:   'The developer admin panel is open to the team only. Nothing is missing from your account; this page simply is not part of it.',
    },
    // ⛔ THE PRE-GENERATION OPTIONS ARE AN ACCOUNT'S (the owner, §934.34: "only hamlet,
    // village, and town can be accessed without signing in and only with everything on
    // random"). Nothing is hidden — the options are drawn and disabled, and this is the
    // sentence beside them. `{sizes}` comes from the same derivation every other unlock
    // sentence reads, so the two halves of the offer cannot drift.
    preGenLocked: {
      rubric: 'Everything on random',
      body:   'Without an account a settlement forges with every dial rolled: you choose the size and the simulator does the rest. Sign in (free) to set the name, the ground, the culture and the priorities yourself, and to reach {sizes}.',
    },
    // ⛔ THE REALM LEAVES THE PHONE (the owner, ODQ §934.26). The first sentence is the
    // owner's own words. The second is the DOOR — the gate law's "every gate ends in an
    // action" — and it is deliberately written to be true whether or not a settlement is
    // open: the notice's control renders only when one is, and this sentence names where
    // the same relational facts live on a phone rather than promising a map.
    realmNeedsTablet: {
      rubric: 'The Realm',
      body:   'The realm map opens on a tablet or larger screen. Your world is saved and waiting, exactly here, when you next sit down at one.',
    },
    // ⛔ THE NARRATIVE LAYER READS A TOWN, IT NEVER INVENTS ONE (REVIEW-P F4). The
    // landing's "Narrate" navigated to /create with nothing said and nothing forged.
    // The sentence states the ORDER of the two acts rather than a price, because the
    // credits plate beside the button already carries the price and the reader's
    // problem here is that there is no dossier to read.
    narrateNeedsTown: {
      rubric: 'Nothing to narrate yet',
      body:   'The Narrative Layer reads a town that already exists; it never invents one. Forge a settlement first, and the voice is waiting on its dossier.',
    },
    // ⛔ THE DESTINATION WAS KEPT AND THE REASON DROPPED (REVIEW-P F10). `{page}` is the
    // guarded route's own label from lib/routes.js, so this sentence can never name a
    // page the router does not have. The door is the form directly below it, which is
    // why this reason offers no second control of its own.
    authRequired: {
      rubric: 'Sign in to continue',
      body:   '{page} belongs to an account. Sign in below and you land there.',
    },
    // ⛔ A DEAD LINK LOOKED LIKE IT WORKED (REVIEW-P F11). The address is quoted back
    // because it is the only fact the reader can act on: it tells them whether they
    // mistyped it or whether the link they followed has rotted.
    pageNotFound: {
      rubric: 'No such page',
      body:   'There is no page at {path}, so this is the Create page instead. The address may be mistyped, or the link that sent you here may have gone stale.',
    },
  },

  // ⛔ THE LOCKED-REALM GATE'S VALUE LINES — THE OWNER'S OWN WORDS, AND THIS IS THE ONE
  // PLACE THEY LIVE (ODQ §934.26). He replaced two bullets with one sentence, in his own
  // punctuation, and it ends on an exclamation point — which VOICE_AND_TONE §6 bans
  // everywhere. So the line is declared HERE, where `tests/copy/voiceMechanics.test.js`
  // holds a NAMED, COUNT-PINNED allowlist row for it citing this section and quoting the
  // sentence. Spelled as a component literal instead — which is where it landed first — the
  // same bang falls under the Tier-3 JSX ratchet, whose budget is ZERO and which has no
  // allowlist at all: one home, one declaration, one exception, readable beside the words.
  // `RealmLockedGate.jsx` reads this list and exports it for the palette's a11y pin.
  realmGate: {
    valueLines: [
      'Advance the realm month by month and watch the chronicle fill',
      'Access wars, religion, trade, the world!',
    ],
  },

  // ── Pricing ───────────────────────────────────────────────────────────────
  pricing: {
    eyebrow:      'Plans',
    pageTitle:    'Pricing',
    pageSubtitle: 'Generate a town in seconds. Then run the region for years.',
    // W-DOC reconcile: "only the Narrative Layer" was a stale claim once the
    // Surveyor workshop shipped — evolved to the schema-wall promise (every AI
    // feature reads and proposes; only the deterministic engine writes canon).
    antiAi:       'Settlements are simulated from constraints, not generated by AI. Every optional AI feature reads and proposes; only the deterministic engine writes canon.',
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
      // ⛔ A CHAIR IS GIVEN, NEVER SOLD (DESIGN_FOUNDERS_HALL §1/§5, ODQ §118).
      // priceLabel/priceSub are DELETED rather than emptied: the band stops
      // rendering a price at all, and a key that exists is a key something can
      // render again. "seats remaining" is sale vocabulary the Hall's covenant
      // voice forbids; the Hall counts chairs HELD, and so does this.
      founder: {
        name:        'Founder',
        // ⛔ THE CARD'S FOCAL SLOT STILL HAS TO SAY SOMETHING, AND WHAT IT SAYS IS
        // HOW A CHAIR IS COME BY — NOT WHAT ONE COSTS. Deleting priceLabel/priceSub
        // (above) left the two tier-card readers calling t() on absent keys, and t()
        // returns the KEY when it cannot resolve: the anon teaser on /create printed
        // `pricing.tiers.founder.priceLabel` and `pricing.tiers.founder.priceSub` as
        // literal text (ODQ §934.22 item 1). `standing` is the cure at the source and
        // is DELIBERATELY NOT SPELLED LIKE A PRICE — a key named price* is a key
        // something can render as one, which is exactly why the two above stay gone.
        // ⭐ THE OWNER'S APPROVED WORDS (ODQ §934.24(3), verbatim): "the Founder card
        // under the purchase lock says what it means — 'A founding place, held until
        // launch' — not a price that does not resolve." Lane 28's interim 'By invitation'
        // (the landing closer strip's Founder badge) said HOW a chair is come by; these
        // say that and WHEN, which is the half a reader under the lock actually needs.
        // The badge's own words are untouched — this is the card's focal slot, not the
        // badge — and neither quotes money, which the purchases-locked law requires.
        standing:    'A founding place, held until launch',
        // The sub-line beneath the slot. `standingSub` is deliberately NOT spelled
        // priceSub: a key named price* is a key something can render as one, which is
        // exactly why the Founder's two price keys stay deleted (above).
        standingSub: 'Opens with the launch',
        tagline:     'Thirty chairs in the credits, for as long as SettlementForge runs.',
        cta:         'Request a chair',
        chairsHeld:  '{held} of 30 chairs held.',
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
          tagline:  'The whole living simulation, for as long as SettlementForge runs. By invitation.',
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

  // ── THE ONE DOOR (C13) — the single Surveyor entry + the proposal register ─
  // `label` carries the manager's suggested wording over the owner's literal
  // "AI / ask me anything" — VETOABLE (recorded in the C13 report); a veto is a
  // one-string edit here. `proposed` is the owner's ruling line VERBATIM (the
  // draft-slip small-cap register; its em-dash is owner-specified copy).
  surveyorDoor: {
    label:        'Ask the Surveyor',
    heading:      'The Surveyor',
    close:        'Close the Surveyor',
    promptLabel:  'Ask the Surveyor about this page, or tell it what to make',
    placeholder:  'Ask about what you are looking at, or describe what you want made…',
    routeHint:    'Questions, session recaps, content, styles, builds.',
    route:        'Take it to the Surveyor',
    openAnalyst:  'Open the analyst',
    openInterview: 'Ask the world',
    openWorkshop: 'Open the workshop',
    proposed:     'PROPOSED: the engine writes canon',
    analystFrom:  'The analyst replies',
    youAsked:     'You asked',
  },

  // ── Durable canon-command recovery ───────────────────────────────────────
  // The transport may fail after durable authority commits. These messages
  // distinguish a recovered commit, a proved-absent retry, an unresolved
  // journal, and a terminal no-commit result without asking the user to infer
  // persistence from a network error.
  canonRecovery: {
    applied:          'Durable authority confirmed the original commit. Its saved projection and receipt are restored.',
    provedAbsent:     'Durable authority proved there was no earlier commit. The exact idempotent command was retried and confirmed.',
    terminalNoCommit: 'Durable authority confirmed that this command did not commit. Start a fresh review before trying the change again.',
    unresolved:       'The durable journal still has no final outcome. Nothing was retried.',
    unavailable:      'The durable journal could not be checked. Nothing was retried.',
    stale:            'The owner, save, or reviewed revision changed during recovery. Nothing was projected here.',
    unconfirmed:      'The durable recovery attempt did not produce a confirmed projection. Nothing is being reported as applied.',
    ambiguous:        'The network answer was ambiguous. Check durable authority before retrying this canon change.',
    receiptLabel:     'Durable receipt',
    eventFallback:    'canon event',
    checkOutcome:     'Check durable outcome',
  },

  // ── Tab intro lines (italic, prose-l, beneath each tab title) ────────────
  // Source: UI Redesign §18.9. These set the tone for each tab in one line.
  // The tab intro ledes — the poetic one-line captions under each dossier tab
  // title — were removed as a FAMILY per owner order (2026-07-22): no static
  // poetic lede renders on any dossier tab (order 4 removed 'overview' first; this
  // removes the rest). The namespace is kept (empty) so the copy namespace guard
  // still finds it, and TabIntro (components/new/Primitives.jsx) renders nothing
  // for an absent key, so every remaining <TabIntro> call heals to no element.
  tabs: {},

  // ── Onboarding Coach + Checklist (UI Redesign §18.6 / §18.7) ─────────────
  onboarding: {
    coach: {
      welcomeTitle: 'Welcome to SettlementForge.',
      welcomeBody:  'You’ve made a settlement. Now it’s yours to use. Three small steps and you’ll know your way around.',
      step1Title:   'Read the dossier.',
      step1Body:    'Every tab is a different angle on the same place. Start with Overview. Drift through Economics, Power, and Daily Life.',
      step2Title:   'Watch how it was simulated.',
      step2Body:    'The rail on the right shows the steps the engine took. Tap any to see what it decided.',
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
      itemNeighbour:   'Link a second settlement (Neighbour System)',
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
    // The post-generate what's-next coach (PostGenCoach — the C4 host).
    wizardNextSteps: 'A short, state-aware list of what to do with a fresh settlement.',
    // W-COMPOSER-2: the realm forcing surface + the docket (mechanism whispers).
    realmOrders: 'Anything the world can do, you can order. Orders stage as proposals; the walls hold even under force.',
    realmDocket: 'The realm’s staged future, in the order the tick will consume it. Every entry stays editable or cancelable until then.',
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
        body: 'None = magic is disabled. Low = rare and limited. Medium = a moderate, everyday presence. High = broad and pervasive. The level shapes institution distribution and NPC archetypes.',
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
          a: 'Your shelves stand empty, and that is only the first morning of your survey. Every realm here began exactly where yours does now.',
          b: 'You have an empty study and a whole country to chart; start with one settlement and let the rest of your library grow around it.',
        },
        first: {
          a: 'Your first settlement is on the shelf now. Keep it, and it will still be here when you return to build the next.',
          b: 'You have made your first mark; the settlements that follow will feel like neighbours to it, not strangers.',
        },
        onward: {
          a: 'Your library has grown past a single page. Try binding two of your settlements as neighbours, and watch their fortunes start to lean on one another.',
          b: 'You have kept enough now to see the pattern in your own hand; the realm rewards a keeper who lets places touch.',
        },
      },
      realm: {
        empty: {
          a: 'You are looking at an unmarked realm; set down your first holdings and the distances between them become something the simulation can read.',
          b: 'Your map waits for its first settlement. Once you place one, the roads, the borders, and the reach of each become yours to shape.',
        },
        first: {
          a: 'You have set your first stone on the realm; freeze its geography when you are ready, and the world will remember where everything stands.',
          b: 'Your realm has one fixed point now. The more you place, the more the country between them starts to matter.',
        },
        onward: {
          a: 'You have a realm worth advancing; let a season pass and see which of your settlements thrives and which one you will need to tend.',
          b: 'Your country has grown crowded enough to have its own weather. Let time run, and read what the year does to the places you made.',
        },
      },
      dossier: {
        empty: {
          a: 'You have not yet forged a place to read about; make one, and this page fills with a country of reasoning that is wholly yours.',
          b: 'Your dossier stays unwritten until you generate; the moment you do, everything on it will have been decided for reasons you can inspect.',
        },
        first: {
          a: 'You are reading the engine’s own reasoning here, not a tale told at you; every line was decided before you arrived.',
          b: 'You will find no invented facts in your dossier. Each figure was reasoned from the last, and you can trace any of them home.',
        },
        onward: {
          a: 'You have read enough dossiers to argue with one; when a figure surprises you, follow it back and see what the engine weighed.',
          b: 'Your eye has learned this page. Look now for what the place is quietly straining under, and you will see its next year coming.',
        },
      },
      simulation: {
        empty: {
          a: 'You hold a realm that has never yet been advanced; give it a season, and you will learn more of it than any single dossier can tell.',
          b: 'Your country is holding its breath, unadvanced; let time pass through it and watch which of your choices the world decides to keep.',
        },
        first: {
          a: 'You have let the world move for the first time. Nothing here waits politely for you; a place you neglect will change on its own.',
          b: 'Your realm has taken its first breath without you; return often, for the country keeps its own calendar whether you watch or not.',
        },
        onward: {
          a: 'You have watched a few seasons turn; trust the pressures the engine raises, for they read the year better than a hunch of yours will.',
          b: 'Your world has a memory now. What you let pass last season is quietly shaping the trouble you will meet in this one.',
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
    // ── Empty-state invitations, plain register (W-GUIDE-2 §8) ────────────
    // House voice for the non-persona empty seams (realm dashboard). Software
    // about software: no ✦, no "— S.", no second-person costume.
    invitations: {
      realm: 'A realm begins with a single holding. Place your first settlement, and the map starts reading the distances between them.',
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
    // The tier's stock painting stands in for a settlement that has no picture of its own
    // (§934.32): the alt says so, so a reader is never told the painting IS the place.
    stockImageAlt: 'A {tier} of the kind {name} is: the tier’s painting, not a picture of this settlement.',
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
    // The recovery beside that line: re-runs the reader's current query.
    retry:        'Try again',
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
  //
  // The body's archive sentence is the eventNarrativeSnapshots cap
  // disclosure (Wave R-1, atlas A20): applying an event stamps the
  // pre-event settlement narrative into the save's aiData archive, which
  // keeps only the last MAX_EVENT_NARRATIVE_SNAPSHOTS (10) entries — this
  // surface is the user-facing moment of that stamp. The archive has no
  // reader surface yet; Wave R-2 mounts the reader and carries this
  // disclosure to it. tests/copy/narrativeArchiveDisclosure.test.js pins
  // the sentence to the real cap constant.
  //
  // The archive sentence is CONDITIONAL on purpose (R-1 must-fix): the modal
  // fires for any narrated save (aiSettlement OR aiDailyLife), but both stamp
  // writers (settlementSlice applyEvent tail + canonEventCommandTransaction)
  // archive only the SETTLEMENT narrative on the save row. A daily-life-only
  // save shows this modal and archives nothing, so the claim keys on exactly
  // the writers' condition — "carries a settlement narrative" — and stays
  // true in every reachable state. Same pin file covers the state truths.
  staleNarrative: {
    heading:         'The narrative is now out of date.',
    body:            'Your change is applied. The prose on this save was written against the previous state, so it does not yet know what just happened. If this save carries a settlement narrative, the version that stood before each event is stamped into the save’s archive, which holds only the last 10.',
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
    aiUnavailable: 'Narrative refinement is unavailable for the moment. The world itself is untouched. Your settlement still generates and exports.',
    // Vision V-H (R-23): user-facing failure copy routed off component literals
    // into the register, so failures speak in one voice and the i18n door stays open.
    forgeStart:        'The forge stalled before your settlement took shape. Try once more.',
    // lib/staleDeploy.js: a tab left open across a deploy. forgeUpdated replaces
    // forgeStart when the failure was a chunk of the previous build (HomeHero is lazy,
    // so the register is loaded there; the EAGER notice keeps its own literals).
    forgeUpdated:      'SettlementForge was updated while this page was open. Reload the page to forge with the new version.',
    realmSlots:        'There aren’t enough free save slots for a realm this size. Clear a few, then try again.',
    realmBuild:        'The realm didn’t come together this time. Try once more.',
    mapExport:         'The map didn’t finish exporting. Try once more.',
    prefSave:          'That preference didn’t save. Try once more.',
    galleryCollection: 'This gallery collection could not be shown.',
    galleryDossier:    'This gallery dossier could not be shown.',
    galleryView:       'The gallery could not be shown.',
    // Fold seams (quintuple fold): literals migrated off components so the
    // error-copy ratchet (tests/lint/errorCopyBaseline.test.js) stays honest.
    chronicleFail:      'The chronicler set down the pen before this entry was ready. Try once more.',
    corpusDeclined:     'The draft was declined.',
    corpusEmpty:        'The draft produced no usable prose to stage.',
    corpusUnavailable:  'The Corpus Factory draft is unavailable right now.',
    // Vision V-N (V-26a): the Interview follow-on surfaces its transport failure through
    // the register (the setPendingError path), one voice with the analyst's sibling.
    interviewUnavailable: 'No interview can be taken down right now. Try again in a little while.',
    // SB5 (error-copy burn-down): gallery + draft-export literals migrated off
    // their components so the ratchet keeps shrinking toward zero.
    reportSendFail: 'Report could not be sent.',
    galleryLoadFail: 'The gallery could not be loaded.',
    signInToVote:   'Sign in to vote on public settlements.',
    voteSaveFail:   'Vote could not be saved.',
    pdfExportFail:  'PDF export failed: {detail}',
    // T3 (error-copy burn-down): the last raw component error literals routed
    // through the register so every failure speaks in one voice and the i18n
    // door stays open. Detail still goes to console; the user reads house voice.
    dossierSection:      'This section of the dossier could not be displayed.',
    exportFail:          '{kind} export failed: {detail}',
    libraryLoadFail:     'Your library could not be loaded. Check your connection and reload.',
    reactivateNeedsSlot: 'Choose an inactive settlement after freeing one of your three free slots.',
    reactivateSlotsFull: 'Your three free settlement slots are already active.',
    reactivateFail:      'That settlement could not be reactivated.',
    persistFail:         'That change could not be saved. The library was restored to its previous state.',
    shareCanonFirst:     '{action} before sharing this dossier publicly.',
    publishBlocked:      'Can’t publish yet: {count} consistency {issues} to resolve: {details}',
    mapPlaceFail:        'That placement could not be saved. Try once more.',
    mapLoadFail:         'The map could not be loaded. Try once more.',
    mapNotReady:         'The map is not ready yet. Give it a moment, then try again.',
    mapSaveFail:         'The map could not be saved. Try once more.',
    mapRegenFail:        'The map could not be regenerated. Try once more.',
    mapRender:           'The map could not be displayed.',
    importTooLarge:      'That file is too large to import safely.',
    importUnreadable:    'That file could not be read. Try downloading a fresh export.',
    importReconcileFail: 'This export could not be reconciled.',
    importUnsupported:   'That file is not a supported SettlementForge export.',
    importDecisionsOpen: 'Choose an action for every settlement before previewing.',
    importApplyFail:     'The reconciliation could not be applied.',
    importCommandFail:   'The reconciliation stopped before it returned a command receipt.',
    importRecoveryFail:  'This browser could not prepare the private recovery receipt.',
    deleteConfirmPhrase: 'Type {phrase} to confirm.',
    seatCodeSent:        'We emailed you a confirmation code.',
    seatSoldBack:        'Your seat has been sold back. Your payout will follow.',
    buybackStartFail:    'The buyback could not be started.',
    buybackFail:         'The buyback could not be completed.',
    pwEnterBoth:         'Enter your current and new password.',
    pwTooShort:          'Your new password must be at least 8 characters.',
    pwMismatch:          'The new passwords do not match.',
    cropPrepFail:        'Could not prepare the image for cropping.',
    cropExportFail:      'Could not export the cropped image. The source may not allow cross-origin use.',
    imageLoadFail:       'Could not load the image.',
    previewFail:         'Preview could not be generated.',
    realmAdvancingSaveLater: 'The realm is advancing. Give it a moment, then save your rules.',
    rulesSaveFail:       'Rules could not be saved.',
    realmContinueFail:   'The realm could not continue. Try again in a moment.',
    resumeFail:          'The realm could not resume. Try again in a moment.',
    proposalUpdateFail:  'That proposal could not be updated.',
    proposalReceiptMissing: 'The realm returned without an exact terminal receipt for that proposal.',
    canonRecoveryOpenFail: 'The recovery check could not be opened. No command was retried.',
    worldClockStartFail: 'The world clock could not be started. Try again in a moment.',
    namingFail:          'That name could not be saved. Try again in a moment.',
    // THE CIVILITY REFUSALS (DESIGN_PROFILE_IMAGE.md §9). Polite and
    // NON-ACCUSATORY by explicit design: no moralising, no lecture, and never an
    // echo of the matched word — checkCivility does not even return it, so no
    // surface can. Each carries a mistake path in the same breath, because false
    // positives are support tickets, not an appeals court. The guard rejects a
    // string, never a person, and the copy has to sound like that is true.
    civilityName:        'That name can’t be used here. Think this is wrong? Feedback & support.',
    civilityComment:     'That comment can’t be posted. Think this is wrong? Feedback & support.',
    civilityShareText:   'Some of that wording can’t be published. Think this is wrong? Feedback & support.',
    // THE PROFILE-IMAGE PIPELINE (DESIGN_PROFILE_IMAGE.md §3). Registered as a
    // burn-down correction: the identity section shipped its own failures as raw
    // literals and reddened the error-copy ratchet. The WORDING here is the
    // wording that shipped, character for character — this is a plumbing move
    // onto t(), deliberately NOT a copy revision, so nothing a user reads shifts.
    avatarReadFail:      'Could not read that image.',
    avatarUploadSignIn:  'You must be signed in to upload a profile image.',
    avatarSaveFail:      'Could not save your profile image.',
    avatarUploadFail:    'Upload failed.',
    avatarRemoveSignIn:  'You must be signed in to change your profile image.',
    avatarRemoveFail:    'Could not remove your profile image.',
    notesSaveFail:       'Those notes could not be saved. Your text is still here. Try again.',
    snapshotRestoreUnavailable: 'Snapshot restore is unavailable.',
    snapshotRestoreFail: 'Snapshot could not be restored.',
    snapshotRecordUnavailable: 'Taking a snapshot is unavailable.',
    snapshotRecordFail: 'That snapshot could not be recorded. Nothing changed.',
    timelineUndoBlocked: 'The latest mechanical timeline entry cannot be undone.',
    timelineUndoUnavailable: 'No undoable timeline event is available.',
    customContentSampleFail: 'The sample settlement could not be forged. Nothing was saved.',
    customContentWriterSaveUnavailable: 'The immutable content writer is unavailable. Nothing was saved.',
    customContentRevisionUnconfirmed: 'The revision was not durably confirmed, so nothing changed.',
    customContentRevisionSaveFail: 'The revision could not be saved. Nothing changed.',
    customContentRevisionSaveDetail: 'The revision could not be saved: {detail}',
    customContentWriterArchiveUnavailable: 'The immutable content writer is unavailable. Nothing was archived.',
    customContentArchiveUnconfirmed: 'The archive was not durably confirmed, so nothing changed.',
    customContentArchiveFail: 'The definition could not be archived. Nothing changed.',
    customContentArchiveDetail: 'The definition could not be archived: {detail}',
    customContentArchiveInvalid: 'The archived-definition service returned an invalid response.',
    customContentArchiveLoadFail: 'Archived definitions could not be loaded.',
    customContentRestoreUnconfirmed: 'The definition was not restored.',
    customContentRestoreRefreshFail: 'The restore is confirmed, but the archived list could not be refreshed.',
    customContentRestoreFail: 'The definition could not be restored.',
    customContentHistoryInvalid: 'The version-history service returned an invalid response.',
    customContentHistoryLoadFail: 'Version history could not be loaded.',
    customContentRevisionRestoreUnconfirmed: 'The forward revision was not confirmed.',
    customContentHistoryRefreshFail: 'The new revision is confirmed, but the refreshed history could not be loaded.',
    customContentRevisionRestoreFail: 'The forward revision could not be created.',
    // CHARSET (HORIZON): what the paid surfaces can actually DRAW. Every hint is
    // a copy key the wall names, never prose the wall composes, and every one
    // speaks the product noun for the surface rather than its class token. The
    // author is told what cannot be printed and where; nothing is ever stripped,
    // folded or rewritten without a click.
    customContentCharset: {
      uncovered_codepoint: '{surfaceName} cannot print {char} (character {position}).',
      control_character: 'Character {position} is a control code and cannot be saved in this field.',
      bidi_override: 'Character {position} reverses reading direction and cannot be saved in this field.',
      invisible_format: 'Character {position} is invisible and would vanish when printed. Remove it, or use a plain space.',
      malformed_encoding: 'This text carries an incomplete character and cannot be saved. Retype the affected word.',
      length: 'This field holds {actual} characters. The limit is {max}.',
      normalise: 'Normalise',
      asciiPreview: 'Use ASCII preview',
      surface: {
        'web-display': 'The page',
        'dossier-pdf': 'The dossier PDF',
        'campaign-pdf': 'The campaign book',
        'world-book': 'The World Book',
        foundry: 'The Foundry export',
        'json-export': 'The JSON export',
      },
    },
  },

  // ── Command palette (V-H R-20; SB5 routed its strings off inline literals) ──
  palette: {
    dialogLabel:  'Command palette',
    inputLabel:   'Jump to a page, a settlement, or a figure',
    placeholder:  'Jump to a page, a settlement, or a figure…',
    resultsLabel: 'Results',
    pageHint:     'Page',
    goTo:         'Go to {label}',
    emptyNoMatch: 'Nothing by that name in this realm. Try a page, a settlement, or a figure within one.',
    emptyPrompt:  'Type to search your pages, settlements, and the figures within them.',
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
    // THE NOUN FOLLOWS THE TIER (ODQ §934.22 item 3). This key had NO consumer and said
    // something different from the live button beside it, which is how a village came to be
    // asked to save a 'town'. One string now, filled from the settlement's own tier.
    signupButton:  'Save this {tierNoun}. Free account →',
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
    },
    tooltips: {
      draft:    'Editable, not yet part of your campaign world.',
      canon:    'Live campaign truth. Changes are logged as events.',
      narrated: 'Narrative refinement layer is present.',
      raw:      'Raw simulation output. No narrative layer.',
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
      // The sizes signing in ADDS (see hero.capUnlock). Written out because this
      // moment's card renders the string with no vars; bound to the derivation by
      // tests/copy/signInUnlocks.test.js so it cannot drift from it.
      body:     'Sign in (free) to reach thorpe, city, and metropolis and save your drafts. Keep any dossier’s PDF for $2.99.',
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
      // "Locks" left this line when the owner ordered the padlocks removed (2026-09-17).
      body:     'Drift and the chronicle: Cartographer hands you the worldbuilder controls.',
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
      headline: 'The Hall should know your name.',
      body:     'Five settlements, neighbours linked, dossiers exported. The Founders’ Hall keeps thirty chairs, given by invitation and never sold. Ask for one by letter.',
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
      lineNew:          'For DMs who already know they’ll build campaigns. A chair is asked for, not bought.',
      lineIntermediate: 'Thirty chairs in the Founders’ Hall, given by invitation and never sold.',
      lineWorldbuilder: 'For DMs running living regions. A place in the credits, for as long as SettlementForge runs.',
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
    howThisWasBuilt: 'How this was simulated',
    backToList:      'Back to settlements',
    // THE PHONE'S DOOR OUT OF THE REALM (ODQ §934.26). The realm map does not open on a
    // phone, but the relational web it draws is also a dossier tab that does, so the
    // refusal ends in this action rather than in an apology.
    relationshipsDoor: 'Open the relationship web',
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
    // Free account, dossier SAVED, no durable right yet. One purchase unlocks the
    // whole per-settlement EXPORT BUNDLE (owner ruling): the dossier PDF + every
    // map export for this settlement.
    buySaved: {
      cta:      'Unlock all exports for this settlement · {price}',
      subline:  'A one-time purchase unlocks every export for this settlement: the dossier PDF, the town-map images (SVG/PNG/JPEG/WebP), the single-map PDF, and the VTT token map. Yours to re-download for as long as it stays in your library.',
      // The unlock pitch is a POPUP now (owner order 2026-07-22): `checkout` is
      // the popup's confirm CTA, `dismiss` its plain close.
      checkout: 'Continue to checkout',
      dismiss:  'Not now',
      busy:     'Redirecting…',
      error:    'Checkout could not start. Please try again.',
    },
    // Free account, dossier NOT saved yet. Export rights attach to a save, so the
    // honest path is to save first.
    saveFirst: {
      cta:      'Save this settlement to unlock its exports',
      // `subline` (the static save-first export pitch) was removed per owner order
      // (2026-07-22, order-6 extension): no static export-pitch copy renders on the
      // dossier; the button label carries the meaning. `atCap` is a save-limit
      // warning, not an export pitch, so it stays.
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

  // ⚰ Workshop (P107 / CP-2) — REMOVED 2026-09-18. The block was kept "so no
  // surviving OUR consumer sees a missing key", but the Workshop feature is
  // fully retired: /workshop is a DEMOTED DESTINATION that redirects to Create
  // (lib/routes.js redirectForView), the ModeSelector wiring it named is gone,
  // and a census of src/ found no reader of any `workshop.*` key. Dead copy is
  // a maintenance tax and a translation cost, so the keys go with the feature.

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
      a: "Every account gets one free Narrative. It refines a saved settlement into prose, and it costs you nothing the first time. After that, AI actions spend credits. Each action shows its current price before you run it, and faster models cost less. Buy more from the Subscription panel.",
    },
    cancelAnytime: {
      q: 'Can I cancel my subscription?',
      a: 'Yes. Open the Manage Subscription link in your Stripe portal. Cancellation takes effect at the end of your current billing period; you keep access until then.',
    },
    refundWindow: {
      q: 'Do you offer refunds?',
      a: 'If you were charged twice, charged in error, or did not receive what you bought, contact Customer Support below with your Stripe receipt. Other refunds and cancellations follow the Terms and any rights required by applicable law.',
    },
    founderLifetime: {
      q: 'What is a Founder chair?',
      a: 'A place in the credits, and everything the paid Cartographer tier runs, for as long as SettlementForge runs. The Founders’ Hall holds thirty chairs. They are given by invitation and have never been for sale; you can ask for one by letter in the Hall.',
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

  // The settlement editor's field controls (EM-D0d). `limit` takes the estate's
  // own used-of-limit pair, {actual} and {max}, so one count reads one way.
  edit: {
    field: {
      emptyOption:     'Not set',
      noOptions:       'No choices available',
      rollAnother:     'Roll another',
      rollUnavailable: 'Rolling is unavailable here',
      limit:           '{actual} of {max} characters',
      // EM-D2's font-coverage note (U7). The control reports the characters the
      // printed dossier cannot draw; this is the sentence it will carry.
      uncovered:       'These characters will not print: {chars}',
    },
    dialog: {
      title:                   'Editor',
      open:                    'Edit this card',
      save:                    'Save',
      canonNotice:             'This settlement is canon, so its fields are read-only at this door.',
      refusalRubric:           'The edit did not apply',
      refusalCanonLocked:      'A canon settlement takes no plain edit, so {field} is unchanged.',
      refusalInvalidOp:        'This build does not accept that edit, so {field} is unchanged.',
      refusalNoSave:           'This settlement is not the open save, so {field} is unchanged.',
      refusalNotADraftField:   '{field} is not a field this door edits yet.',
      refusalRenameNotApplied: 'The new name was not taken, so {field} is unchanged.',
      refusalUndeclaredField:  '{field} is not declared for this card.',
      refusalUnknownTarget:    'The record this card names could not be found, so {field} is unchanged.',
      refusalUnknown:          'The edit did not apply, so {field} is unchanged.',

      // ── The CREATE errand (EM-F3) ──────────────────────────────────────────
      // The same door, generating the same declared fields, for a subject that does
      // not exist yet: one Confirm, and its own refusals. `createSubject` is the word
      // those refusals put where an edit's refusal names the field, because a create
      // refusal is about the whole form rather than one row of it.
      confirm:                 'Confirm',
      createSubject:           'the counterparty',
      refusalMintFailed:       'The counterparty could not be founded, so nothing was written.',
      refusalMintInvalidName:  'A counterparty needs a name, so nothing was written.',
      // ⛔ THE ONE LINE THE TWO CREATE ERRANDS SHARE, AND THEREFORE THE ONE WITHOUT A
      // SUBJECT (EM-D1c). A save with no seed can found nothing and can order nothing,
      // so the same sentence answers the counterparty's door and a roster newcomer's;
      // naming one of them here would make it false on the other.
      refusalMintNoSeed:       'This settlement has no seed open, so nothing could be founded.',
      refusalMintOffPool:      'One of the choices is not on its list, so {field} was not founded.',
      refusalMintSaveFailed:   'The library did not take {field}, so nothing was written.',

      // ── The roster CREATE errand (EM-D1c) ──────────────────────────────────
      // The plus on a roster root orders a newcomer as a DECREE, so its refusals are
      // the registry's own closed set and not the mint's. Each line says what was not
      // written rather than what the DM did wrong, and none of them names a subject:
      // the door shows them over a form that has not been staged at all.
      refusalAddInvalidOp:     'This build does not accept that new entry, so nothing was ordered.',
      refusalAddNoSave:        'This settlement is not the open save, so nothing was ordered.',
      refusalAddNotStaged:     'The order was not written, so the page of decrees is unchanged.',
      refusalAddStaleVocabulary: 'One of the choices is not on its list, so nothing was ordered.',
      refusalAddUnknownTarget: 'This card takes no new entry at this door, so nothing was ordered.',
    },

    // ── The edit-mode shell (EM-D1) ─────────────────────────────────────────
    // Design §3 (the mode indicator, the pencils, the pluses, Done), §14 item 3
    // (the derived card's provenance line) and §17/§18 (the seals by card, and
    // the herald's reason for a seal the world does not yet offer).
    //
    // ⛔ THE REASON LINES ARE KEYED BY THE WORLD CONDITION'S OWN ID, the ten
    // `WORLD_CONDITIONS` rows of src/domain/edit/worldConditions.js plus the
    // `always` row §18's table gives the chronicle. That leaf carries predicates
    // and no prose, so the sentence lives here and the id is the join: a
    // condition renamed there leaves its key unanswered rather than drifting.
    //
    // ⭐ A `reason` LINE IS A READING NOW, AND IT IS DRAWN ONLY WHERE ONE WAS
    // TAKEN (EM-E4d, U88; the verifier's NOTE-8 closed). The shell asks
    // `worldConditionsOf` for every row of that roster, so "No peace has been
    // offered" is an answer about this town rather than the design's entry for
    // that seal. A seal whose act the catalogue cannot express never reaches
    // these lines at all: it draws `sealUnbuilt`, because a finding nobody
    // measured is the lie this member exists to take off the page.
    shell: {
      title:          'Edit mode',
      indicator:      'This settlement is open for editing.',
      enter:          'Edit',
      enterNamed:     'Edit {name}',
      // ⛔ THE ONE HOME FOR THE WAIT LINE, AND THE ONE KEY THE EAGER SHELL MAY NOT
      // RESOLVE THROUGH `t()`. `src/App.jsx` owns the shell's Suspense boundary and is
      // EAGER: measured, one `import { t } from './copy/index.js'` there puts THIS FILE
      // into the first-paint closure (270 -> 272 modules), which reds the editor-train
      // arm of tests/build/vendorPdfLazy.test.js and moves three owner-signed budgets.
      // So the root spells the sentence as a literal, exactly as every other narrated
      // Suspense fallback in the estate does, and tests/components/editModeShell.test.jsx
      // pins the two BYTE-EQUAL — the sentence still has one home and a locale still
      // finds it here.
      opening:        'Opening the editor…',
      cardsHead:      'Cards',
      actsHead:       'Acts',
      derivedHead:    'Derived',
      pencil:         'Edit the {card} card',
      plus:           'Add to {card}',
      // ⭐ RE-WORDED BY EM-D1c, and the cause is that the old sentence became false: the
      // three roster roots the catalogue carries an add-op for DO write a new entry now,
      // through the page of decrees. The line survives for the roster that has no such
      // act, which is the only place the shell still shows it.
      plusReason:     'No act adds to this card yet, so its plus stays closed.',
      actsNote:       'Each act names the state it needs. An act opens when that state holds here and the act behind it is built.',
      // ⭐ THE TWO LINES THAT KEEP THE §18 ROSTER BELOW HONEST (EM-E4d, judgment 296). A seal
      // is closed for THREE different reasons and only one of them is a finding about this
      // town, so the other two say what they actually are: no act stands behind the control,
      // or the condition holds against more than one counterparty and the act names one.
      sealUnbuilt:    'No act is built behind this seal yet, so it stays closed.',
      sealAmbiguous:  'More than one counterparty stands here, so this act cannot name which.',
      provenance:     'Follows from {source}, so change {source}.',
      counterpartiesHead: 'Counterparties',
      done:           'Done',
      refusalRubric:  'The editor is closed',
      refusalGated:   'The settlement editor is not open on this account.',

      // The card names the register shows. `npc` is the person's card on both
      // sides: it wears the pencils of §14 and the mission seal of §17.
      card: {
        institution: 'Institution',
        npc:         'Person',
        faction:     'Faction',
        powerSeat:   'Power seat',
        worldFact:   'World facts',
        goods:       'Goods',
        services:    'Services',
        war:         'War',
        trade:       'Trade',
        rumour:      'Rumour',
        chronicle:   'Chronicle',
      },

      // §17's acts, in the herald's voice, by the card they start on.
      seal: {
        suePeace:       'Sue for peace',
        acceptPeace:    'Accept the peace',
        refusePeace:    'Refuse the peace',
        directForce:    'Direct the force',
        resupply:       'Resupply',
        letSiegeFall:   'Let the siege fall',
        letCoupFail:    'Let the coup fail',
        receiveEnvoy:   'Receive the envoy',
        turnEnvoyAway:  'Turn the envoy away',
        directTrade:    'Direct trade',
        embargo:        'Embargo',
        confirmRumour:  'Confirm it',
        castDoubt:      'Cast doubt',
        twistRumour:    'Twist it',
        scheduleEvent:  'Schedule an event',
        sendOnMission:  'Send on a mission',
      },

      // The fourth roster (EM-F3, design §2.8): the town's neighbour partners and the
      // DM's own off-stage counterparties. `offStage` and `real` are the two readings
      // of one fact, so a row marked off-stage is exactly a row the forge may take.
      counterparty: {
        add:      'Add a counterparty',
        // ⭐ THE ONE NEW LINE OF NOTE-11, and it is the register's OWN idiom rather than a
        // second voice: `plusReason` above says why a roster's plus is shut when no act can
        // order its newcomer, and this says why THIS plus is shut when there is no settlement
        // for the newcomer to belong to. Design §1: edit mode is a state of a SAVED
        // settlement's dossier, never an anonymous draft.
        addReason: 'This settlement is not saved yet, so the plus stays closed.',
        forge:    'Forge this counterparty',
        none:     'No counterparty is named here yet.',
        note:     'A counterparty off-stage is a name the table keeps, never a world the simulation carries.',
        offStage: 'Off-stage',
        real:     'On the map',
      },

      // §18's preconditions, each naming the act that would create it, or wait.
      // `pendingPeaceOffer` is the design's own worked sentence, verbatim.
      reason: {
        always:            'This act opens once the catalogue behind it is built.',
        beliefExists:      'No belief is recorded here. Let one spread, or wait.',
        envoyArrived:      'No envoy has arrived. Send for one, or wait.',
        forceInField:      'No force is in the field. Muster one, or wait.',
        npcPresent:        'No one is present to send. Recall someone, or wait.',
        openRoute:         'No route is open. Open one, or wait.',
        pendingPeaceOffer: 'No peace has been offered. Make them sue for it, or wait.',
        plotInMotion:      'No plot is in motion. Stir a coup, or wait.',
        siegeInProgress:   'No siege is under way. Lay one, or wait.',
        tradeWith:         'No trade runs with that partner. Open it, or wait.',
        warInProgress:     'No war is under way. Declare one, or wait.',
      },
    },
  },
});
