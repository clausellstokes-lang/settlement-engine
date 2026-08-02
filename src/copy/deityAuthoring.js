/**
 * copy/deityAuthoring.js — the `deityAuthoring.*` copy namespace + its `td()`
 * lookup for the Phase 5 W-C4 deity-authoring cluster (the Compendium custom
 * deity form + effect preview + activation strip, and the settlement editor's
 * patron/cult assignment panel).
 *
 * WHY ITS OWN MODULE (not inside en.js) WITH A LOCAL LOOKUP: en.js rides the
 * EAGER first-paint entry chunk (App.jsx statically imports `t` from
 * copy/index.js). This cluster's strings are only ever needed behind the LAZY
 * Compendium chunk (CustomContent) and the LAZY dossier chunk (the settlement
 * editor's assignment panel), never at first paint — and the first-paint byte
 * budget is razor-thin. So this namespace is lazily SEGMENTED exactly like
 * copy/landing.js: both the copy AND its resolver ride the lazy chunks that
 * import them, so the hot app-wide t()/resolve() path in copy/index.js — and
 * the first-paint closure — are untouched. This is the "namespace-level lazy
 * segmentation of the copy registry" sanctioned pattern for deep surfaces.
 *
 * The axis explanations are the ONE prose source describing what each authoring
 * axis DOES in the engine. The effect PREVIEW derives its couplings from the
 * engine's own describeDeityEffects (numbers never re-typed); the stance/synergy
 * band prose lives here so it is never duplicated across the preview.
 */

export const deityAuthoring = {
  // ── The authoring form (Compendium · Custom Content · Deities) ──────────────
  form: {
    heading:      'Homebrew deity',
    intro:        'Author a god your campaign can worship. Once a DM assigns it, the axes and supported domain describe how local worship, institutions, and policy lean. Nothing is rolled; every effect is derived.',
    nameLabel:    'Name',
    namePlaceholder: 'e.g. Aurelion, the Dawnfather',
    // Moral axis (alignmentAxis) — good/evil/neutral.
    alignmentLabel: 'Moral axis',
    alignmentHint:  'Good against evil. Under a GOOD creed, institutions expose corruption and choose incorruptible successors; under an EVIL creed, corruption can take root even without organized crime. Neutral takes no side.',
    // Order axis (lawAxis) — lawful/chaotic/neutral.
    lawLabel:       'Order axis',
    lawHint:        'Law against chaos. A LAWFUL creed strengthens law and order and props a traditional ruler’s mandate; a CHAOTIC creed erodes order and makes corruption more tolerated. Neutral is inert here.',
    // Rank (rankAxis) — major/minor/cult.
    rankLabel:      'Rank',
    rankHint:       'The faith’s reach. A MAJOR orthodoxy anchors religious authority and can tighten a realm’s magic legality; MINOR worship lends modest authority; a CULT is a fringe following with little sway.',
    // Portfolio (free-text flavor, ZERO mechanics).
    portfolioLabel: 'Portfolio',
    portfolioHint:  'What the god is “of”, in your own words: its sacred domains, myths, the tone of its worship. Pure flavor: it rides the deity onto a settlement for display and NEVER changes the simulation.',
    portfolioPlaceholder: 'e.g. Sunrise oaths, honest courts, and the first seed of spring.',
    // Domain (short display sphere).
    domainLabel:    'Domain',
    domainHint:     'A one-word sphere shown beside the faith. War and conquest lower a devoted settlement’s bar for war, hunt lowers it slightly, and harvest raises it. This read stays dormant until assignment and disposition channels are enabled. Any other sphere remains presentation-only.',
    domainPlaceholder: 'e.g. sun',
    temperNote:     'Temperament (warlike / peacelike) is derived from the moral and order axes. You don’t set it.',
  },

  // ── The single-source effect preview ("This god will…") ───────────────────
  preview: {
    heading:      'What worship changes',
    empty:        'No registered living-world effect is selected. Set a moral or order axis, a rank, or a supported domain to describe how worship shapes the settlement.',
    dormant:      'Dormant until you assign this deity as a settlement’s patron and the realm advances. Only then can local worship and institutions touch the substrate; domain pressure also requires disposition channels.',
    stanceHeading: 'Toward other gods',
    synergyHeading: 'Under a ruler',
    stance: {
      goodConsolidated: 'Good-aligned faiths tend to consolidate with one another and direct hostility toward evil rivals.',
      evilTransactional: 'Evil-aligned faiths contest rivals of every stripe and cooperate only transactionally. Their pacts are betrayal-priced.',
      neutral:          'A neutral faith neither crusades nor schemes against its neighbors.',
    },
    synergy: {
      lawful:  'A lawful creed props a traditional ruler’s divine mandate. Legitimacy leans on the throne.',
      chaotic: 'A chaotic creed undercuts a traditional ruler’s mandate. Order answers to no crown.',
      neutral: 'A neutral creed neither props nor undercuts the ruling mandate.',
    },
  },

  // ── The settlement-editor assignment panel (patron + cults) ─────────────────
  assign: {
    patronHeading:  'Patron deity',
    cultHeading:    'Cults',
    noPatron:       'No patron (latent)',
    imposePlaceholder: 'Impose a cult…',
    noneToImpose:   'No more deities to impose',
    remove:         'Remove',
    // Wave R-2 (atlas Gap 2b): the clear-ALL-cults door. One string, vetoable.
    clearAll:       'Remove all cults',
    noneAuthored:   'No deities authored yet. Author one in the Compendium under Custom Content, then assign it here.',
    // Wave R-5b (item 13b): the restore-from-world lane. When the living world
    // converts a settlement away from its patron, that god survives only in the
    // campaign record, and the pickers above list authored deities only. These
    // two strings are the door back. One string each, vetoable.
    worldFaithsGroup: 'Faiths this settlement has known',
    worldFaithsHint: 'Gods this settlement already worships or once worshipped, kept in the campaign record. Choose one to hand it the patron seat back.',
    tooSmall:       'This settlement is too small to sustain a cult beneath its patron. Larger settlements hold more faiths.',
    cultHint:       'One faith per moral × order niche, except the patron’s own: impose a cult there to spark a contest for the seat. A full settlement displaces its weakest cult to make room.',
    // Non-premium (free / anon): the in-place upsell (never a dead control).
    upsellPatron:   'Assign a patron god to awaken the settlement’s religion layer.',
    upsellCta:      'Upgrade to premium',
    upsellTail:     'to author and assign deities.',
    // Lapsed premium: the owned embed stays, and the SHED direction stays open
    // (Wave R-5b, owner-ratified 2026-07-27 — the store seam's deityWriteGate has
    // always allowed a lapsed clear/remove; the panel used to hide the controls).
    // One string, vetoable. It must not promise assigning, which stays refused.
    lapsedNote:     'Your premium has lapsed. This settlement keeps its assigned faith, and you can still remove what it holds. Renew to assign again.',
  },

  // ── The pantheon-activation strip (OUR four milestones) ─────────────────────
  activation: {
    heading:        'Pantheon activation',
    live:           'Live',
    dormant:        'Dormant',
    latentLabel:    'Latent pantheon in every seed',
    latentDetail:   'Every settlement is generated with gods already latent in its seed, identical for every account. Tier never touches generation.',
    authoredDetail: 'Your homebrew pantheon exists in the catalog.',
    assignedLabel:  'Assigned to a settlement',
    assignedDetail: 'A deity must be a settlement’s patron before its worship can affect local state.',
    dynamicsLabel:  'Dynamics advancing',
    dynamicsDetail: 'Advance the realm so faiths contest converts and gain seats.',
    dormantFoot:    'Until a deity is assigned and the realm advances, the pantheon stays dormant, byte-identical to a deity-free world.',
    upsell:         'Author and assign your own gods with a premium campaign.',
    upsellCta:      'Upgrade to premium',
  },
};

/**
 * td — resolve a dotted key against the deityAuthoring namespace. Mirrors
 * copy/index's t() semantics (dotted path + optional {name} interpolation),
 * scoped to the `deityAuthoring` object so keys are relative: td('form.nameLabel'),
 * td('preview.stance.neutral'). Returns strings interpolated; returns nested
 * objects verbatim for callers that map over them. Loud in DEV on a miss, quiet
 * in PROD. @param {string} key @param {Record<string, unknown>} [vars]
 */
export function td(key, vars) {
  const parts = key.split('.');
  let cur = /** @type {unknown} */ (deityAuthoring);
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') { cur = undefined; break; }
    cur = /** @type {Record<string, unknown>} */ (cur)[p];
  }
  if (cur === undefined) {
    if (import.meta?.env?.DEV) console.warn(`[copy] missing deityAuthoring key: ${key}`);
    return key;
  }
  if (typeof cur === 'string' && vars) {
    return cur.replace(/\{(\w+)\}/g, (m, name) =>
      Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : m);
  }
  return cur;
}
