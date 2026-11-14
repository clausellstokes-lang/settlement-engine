/**
 * power/claimStanding.js — A POWER'S DESCRIPTION CLAIMS NO STANDING ITS FINAL LABEL DENIES (COHERENCE-POWERS-8; split
 * out of power/rulingStructure.js under F31's module-line ceiling, which a module meets by a split, never a raise).
 * Called by rulingStructure.js :: generatePowerStructure after applyLegitimacyMultipliers sets the labels. Pure of
 * draws; it mutates the roster it is handed, as the multipliers do.
 */

// ── A DESCRIPTION CLAIMS NO STANDING ITS LABEL DENIES (COHERENCE-POWERS-8: the lane's rows #111 #639, round three's #374
// #567 #597 and their class) ──────────────────────────────────────────────────────────────────────────────
// Each base power's description is chosen in rulingStructure.js from its RAW figure, before the shares are renormalised and the
// legitimacy multipliers move them; the page prints it beside the FINAL label. On the census's 720 at 91a3a9623, 462
// descriptions in 195 towns claimed a commanding standing ("Dominant commercial class", "Church institutions hold
// direct temporal power", "Wizard towers and mage guilds hold genuine political weight") beside a Minor or Suppressed
// label. Read against the label (set by applyLegitimacyMultipliers just before the call), a claim the label denies is refused
// and its own ladder's lower rung takes its place: the line that ladder already prints for a power of that weight,
// for this tier. No new words; no draw (the rungs are fixed lines).
const SMALL_TIERS = Object.freeze(['thorp', 'hamlet', 'village']);
/** @typedef {{ claim: string | RegExp, minor: (tier: string) => string, suppressed: (tier: string) => string }} ClaimRung */
/** @type {ReadonlyArray<ClaimRung>} */
const CLAIM_RUNGS = Object.freeze([
  // the port claim is matched by its opening and replaced to its sentence's end (its tail is a phrase the style law strikes,
  // so it is not spelled a second time here; the original stays in rulingStructure.js, under that file's own baseline)
  ...['International merchant houses controlling port licences and import flows;',
    'Dominant commercial class at a trade nexus; they set prices, control warehousing, and fund the council.',
    'Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.',
  ].map((claim) => ({ claim,
    minor: () => 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.',
    suppressed: () => 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.' })),
  // the two church claims are matched by pattern (the house's word is the rulingStructure.js line's own, declared there)
  ...[/^\w+ institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical\./,
    /^\w+ holds substantial temporal power; tithes fund civic works and the clergy's opinion on appointments carries decisive weight\./,
  ].map((claim) => ({ claim,
    minor: (/** @type {string} */ tier) => SMALL_TIERS.includes(tier)
      ? 'The local clergy serve a real pastoral role; their moral authority has limited political reach but is genuinely respected.'
      // read beside its standing sentence ("Its priests look after their flocks and have no say in the hall"), a Minor church
      // above a village is at the margins: "meaningful civic influence" would claim a say the next sentence denies
      : 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.',
    suppressed: () => 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.' })),
  ...['Arcane institutions hold substantial political leverage here. Contracts, security, and infrastructure all depend on magical services only they provide.',
    'Wizard towers and mage guilds hold genuine political weight; their services are structurally irreplaceable and they know it.',
  ].map((claim) => ({ claim,
    minor: () => 'Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.',
    suppressed: () => 'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.' })),
  ...['Underworld effectively controls vice, smuggling, and key officials; the nominal government tolerates this because it cannot currently change it.',
    'Criminal organisations have captured significant influence; corruption is systemic, not exceptional.',
  ].map((claim) => ({ claim,
    minor: () => 'Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries.',
    suppressed: (/** @type {string} */ tier) => SMALL_TIERS.includes(tier)
      ? 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.'
      : 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.' })),
  { claim: 'Hereditary landowners whose land rights and military obligations are structurally embedded in governance here; the council works alongside them, not over them.',
    minor: () => 'Hereditary landowners with genuine but not dominant feudal claims; they shape decisions at the margins more than they command them.',
    suppressed: () => 'Noble families with residual feudal claims; the formal obligations are real, but other powers set the practical agenda day to day.' },
  ...['Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the elected council cannot easily override.',
    'Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the seat cannot easily override.',
  ].map((claim) => ({ claim,
    minor: (/** @type {string} */ tier) => tier === 'town'
      ? 'Gentry families with local landholdings; active in civic politics but outpaced by merchant capital in raw financial leverage'
      : 'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.',
    suppressed: () => 'Minor landed families with limited political reach; present in civic life but rarely decisive.' })),
]);

/**
 * Each power whose description opens with a commanding claim its final label (Minor, Suppressed) denies takes its
 * ladder's rung for that label in place of the claim; the rest of the description (a coda another writer added) is
 * kept. Mutates the roster in place, as the multipliers do. Pure of draws.
 * @param {Array<Record<string, any>>} factions @param {string} tier
 */
export function settleClaimsToLabel(factions, tier) {
  for (const f of factions) {
    const label = f?.powerLabel;
    if (label !== 'Minor' && label !== 'Suppressed') continue;
    const desc = typeof f.desc === 'string' ? f.desc : '';
    // a claim spelled whole ends with its own full stop; one matched by its opening runs to its sentence's end; a pattern
    // spans what it matches
    const spanOf = (/** @type {string | RegExp} */ c) => typeof c !== 'string' ? (c.exec(desc)?.[0].length ?? -1)
      : !desc.startsWith(c) ? -1 : c.endsWith('.') ? c.length : desc.indexOf('.', c.length) + 1 || desc.length;
    const rung = CLAIM_RUNGS.find((r) => spanOf(r.claim) > 0);
    if (!rung) continue;
    const end = spanOf(rung.claim);
    f.desc = (label === 'Minor' ? rung.minor(tier) : rung.suppressed(tier)) + desc.slice(end);
  }
}

