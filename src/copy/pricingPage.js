/**
 * copy/pricingPage.js — W-DOC: the five-band pricing page's NEW copy (brief §3),
 * lazily SEGMENTED off the eager en.js exactly like copy/landing.js: this
 * namespace + its local tp() resolver ride ONLY the lazy PricingPage chunk, so
 * first paint gains nothing. The legacy pricing.* namespace in en.js keeps
 * serving the tier cards / packs / A-B variant machinery it already serves.
 *
 * COPY LAW (brief §6 / ruling #6): ZERO hand-typed numbers. Every price, credit
 * cost, seat count, month figure, and ≈-dollar in these strings arrives by
 * {token} interpolation from config at render (pricing.js + entitlementLadder
 * + tierFacts). A number literal in this file is a bug.
 *
 * VOICE (brief §6): plain declarative sentences (the Foundry register); the
 * staccato-fragment style only as deliberate single moments; anti-gotcha
 * sentences state the promise mechanically, never as marketing reassurance.
 */

export const pricingPage = {
  // ── Band 1 — headline ─────────────────────────────────────────────────────
  // (The schema-wall AI line renders from en.js pricing.antiAi — evolved there,
  // one source; this module adds only the new bands' strings.)
  band1: {
    // The no-hidden-fees line (Stripe pattern), rendered under the header.
    noHiddenFees: 'The price on this page is the price at checkout. No setup fees, no seat math, no surprise renewals.',
  },

  // ── Band 2 — subscriptions ────────────────────────────────────────────────
  band2: {
    heading: 'Subscriptions',
    // Cartographer as SERVICE, not unlock (the Forge frame): the fee maps to a
    // running service in one sentence.
    serviceLine: 'Cartographer is a service, not a feature key: your realm keeps living (wars resolve, prices move, chronicles write) and every month of simulation is a month of our servers doing it.',
    surveyor: {
      name: 'Surveyor',
      badge: 'AI · early access',
      lead: 'The optional AI workshop, priced per task.',
      body: 'An analyst for your world, prose briefs, session interpretation, and construction from intent. Every task has a flat price below. No subscription required. It proposes; only the engine writes canon.',
      byok: 'Bring your own key: connect your own Anthropic or OpenAI key and pay your provider directly for inference. Tasks then run without touching your credit balance.',
      menuLink: 'See the task menu',
    },
    charter: {
      // The Founder band renders as a charter object, not a fourth card.
      name: 'The Founder Charter',
      lead: 'Everything Cartographer runs, forever. One payment, no clock.',
      arithmetic: '{price} is about {months} months of Cartographer. Everything after that is the charter working for you.',
      sustainability: '{seats} seats because lifetime revenue should fund the roadmap, not replace it.',
      capNote: 'When the {seats} seats are gone, the charter closes.',
      seatsRemaining: '{remaining} of {seats} seats remaining.',
      seatsFallback: 'Limited to {seats} seats.',
      credits: 'Includes {credits} credits.',
      cta: 'Claim a founder seat',
    },
  },

  // ── Band 3 — the one-time lane ────────────────────────────────────────────
  band3: {
    heading: 'One-time purchases, no subscription required',
    // The $2.99 bundle LEADS the lane (the mourned a-la-carte pattern).
    bundle: {
      name: 'The settlement bundle',
      lead: '{price} buys one settlement’s complete export bundle. Pay for the thing, own the thing.',
      body: 'The artifact is yours: it downloads, it prints, and it survives cancellation. No account required.',
      where: 'The buy lives on the settlement itself. Forge a town, and the bundle is one click on its dossier.',
      cta: 'Forge a settlement',
    },
    packs: {
      heading: 'Credit packs',
      note: 'Purchased credits never expire.',
    },
    taskMenu: {
      heading: 'The task menu',
      intro: 'Every AI task has a flat price. The engine may take one pass or ten underneath. The price is the price.',
      perTask: '{credits} credits · {approx}',
      // Task display names, keyed by the config's task keys (SURVEYOR_AI_COSTS
      // + the narrative schedule). Names only — costs interpolate from config.
      tasks: {
        analysis:            'Ask the analyst',
        brief:               'Compose a prose brief',
        interpret:           'Interpret a session',
        parley:              'Parley in character',
        customContent:       'Compile homebrew content',
        styleOverhaul:       'Design a bespoke map style',
        constructSettlement: 'Construct a settlement from intent',
        constructRealm:      'Construct a realm from intent',
        narrative:           'Narrate a settlement',
        dailyLife:           'Narrate daily life',
        progression:         'Narrate a progression',
        autonomy:            'Compose an autonomous run',
      },
      anchor: 'Credits are {perCredit} each in the starter pack; larger packs cost less per credit.',
      estimate: 'Dollar figures are estimates at the starter-pack rate. Task prices in credits are flat and do not vary.',
      // VERIFIED at the edges (creditFlow.ts runCreditedCall; generate-narrative
      // refundPolicy.ts): a failed task refunds automatically. Partial-success
      // nuance carried in the FAQ, not silently dropped.
      failurePolicy: 'You are never charged for a failed task. A run that produces nothing refunds its credits automatically.',
      workedHeading: 'What a month actually costs',
      worked: [
        { persona: 'A weekly-table DM', formula: 'interpret ×4 + brief ×2', tasks: [['interpret', 4], ['brief', 2]] },
        { persona: 'A worldbuilder between campaigns', formula: 'constructSettlement ×2 + analysis ×4', tasks: [['constructSettlement', 2], ['analysis', 4]] },
      ],
      workedLine: '{persona}: {detail} = {credits} credits {approx}.',
    },
  },

  // ── Band 4 — the comparison table ─────────────────────────────────────────
  band4: {
    heading: 'What each plan includes',
    engineNote: 'Every tier runs the same simulation. The engine itself is never tier-gated.',
    columns: { feature: 'Capability', free: 'Free', cartographer: 'Cartographer' },
    areas: {
      'world-generation': 'World generation',
      'simulation':       'Simulation',
      'maps-exports':     'Maps & exports',
      'ai':               'AI',
    },
    rows: {
      'every-size':       'Every settlement size',
      'saves':            'Library saves',
      'custom-content':   'Custom gods, guilds, and goods',
      'gallery-viewing':  'Gallery viewing',
      'same-engine':      'The full deterministic engine',
      'living-realm':     'The living Realm (advance time, neighbours)',
      'map-chains':       'Map chains',
      'map-view':         'The town map',
      'provenance-hover': 'Provenance on hover',
      'all-lenses':       'Map lenses',
      'panorama':         'The panorama view',
      'map-editing':      'Map editing',
      'dm-pins':          'DM pins',
      'change-view':      'Change-view history',
      'fog-table':        'The fog table layer',
      'interiors':        'Building interiors',
      'v2-redraw':        'The v2 map redraw',
      'export-bundle':    'The settlement export bundle',
      'surveyor-stages':  'The Surveyor AI stages',
    },
    included: 'Included',
    notIncluded: 'Not included',
  },

  // ── Band 5 — the objection-first FAQ ─────────────────────────────────────
  band5: {
    heading: 'The questions that matter',
    items: [
      {
        q: 'What happens to my worlds if I cancel?',
        // The honest data-longevity answer (migration 023's actual semantics):
        // over-cap saves get a retention window, not silent survival.
        a: 'Exports you bought are yours. Downloaded artifacts survive anything we do. Your Library keeps the free tier’s {freeSaves} saves active; settlements beyond that stay retrievable for {retentionMonths} months after downgrade (export them or re-subscribe), then they are removed. Canceling stops the living simulation service, never your ownership of what you exported.',
      },
      {
        q: 'Do credits expire?',
        a: 'Purchased pack credits never expire. Monthly Cartographer credits arrive with each cycle.',
      },
      {
        q: 'Is the founder price forever?',
        a: 'Yes. {seats} seats, one payment, everything Cartographer runs for as long as SettlementForge runs. The cap never reopens.',
      },
      {
        q: 'What if an AI task fails?',
        a: 'A run that produces nothing refunds its credits automatically. If the core generation succeeds but an optional polish step fails, you keep the result you paid for.',
      },
      {
        q: 'Do I need a card to try it?',
        a: 'No. Forging is free without an account, and a free account adds saves and every settlement size. A card enters the story only when you buy something.',
      },
    ],
  },
};

/**
 * tp — resolve a dotted key against the pricingPage namespace. Mirrors
 * copy/landing.js tl(): dotted path + {name} interpolation; arrays/objects
 * returned verbatim for components to map. Loud in DEV on a miss.
 */
export function tp(key, vars) {
  const parts = key.split('.');
  let cur = pricingPage;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') { cur = undefined; break; }
    cur = cur[p];
  }
  if (cur === undefined) {
    if (import.meta?.env?.DEV) console.warn(`[copy] missing pricingPage key: ${key}`);
    return key;
  }
  if (typeof cur === 'string' && vars) {
    return cur.replace(/\{(\w+)\}/g, (m, name) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m);
  }
  return cur;
}
