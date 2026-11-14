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
import { DEFENSE_BUCKET_KEYWORDS } from '../../domain/institutions/defenseInstitutionBuckets.js';

const SMALL_TIERS = Object.freeze(['thorp', 'hamlet', 'village']);
// POWERS-11 (REVIEW-POWERS-3 L2): a rung names no council, no merchant capital and no leading merchant its own roster
// makes false. The context it reads: the power itself, the roster as the multipliers left it, the seat's name.
/** @typedef {{ self: Record<string, any>, factions: Array<Record<string, any>>, governing: string, names: string[] }} RungContext */
/** @typedef {{ claim: string | RegExp, minor: (tier: string, ctx: RungContext) => string | null, suppressed: (tier: string, ctx: RungContext) => string | null }} ClaimRung */
const MERCHANT_POWER = /merchant|trade|commerc|consortium|mercantile/i;
const COUNCIL_SEAT = /council|assembly|senate|parliament|moot/i;
/** The roster's merchant powers other than this one. @param {RungContext} ctx */
const merchantsBeside = (ctx) => ctx.factions.filter((x) => x !== ctx.self && MERCHANT_POWER.test(String(x?.faction || '')));
// POWERS-12 (REVIEW-POWERS-3 M1): a watch stands, read by the defence bucket's own words (the fact the ladder's watch
// lines are declared against), never by /watch/ (a watchtower is no watch). @param {RungContext} ctx
const watchStands = (ctx) => ctx.names.some((n) => DEFENSE_BUCKET_KEYWORDS.watch.some((kw) => String(n).includes(kw)));
const CLERGY_AT_MARGINS = 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.';
const LESSER_LANDED = 'Minor landed families with limited political reach; present in civic life but rarely decisive.';
const LOCAL_MERCHANTS = 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.';
// the town's leading merchant power, where no merchant power governs, is not "not yet the dominant commercial voice"
const LEADING_LOCAL_MERCHANTS = 'Merchants with local reach; a consistent civic presence, though other powers set the course here.';
/** A merchant claim's rung. @param {string} _tier @param {RungContext} ctx */
const merchantRung = (_tier, ctx) => !MERCHANT_POWER.test(ctx.governing)
  && merchantsBeside(ctx).every((m) => Number(m.power || 0) <= Number(ctx.self.power || 0)) ? LEADING_LOCAL_MERCHANTS : LOCAL_MERCHANTS;
/** A noble claim's Minor rung: "merchant capital" only where a merchant power stands (ahead of a town's gentry). @param {string} tier @param {RungContext} ctx */
const nobleMinorRung = (tier, ctx) => tier === 'town'
  ? (merchantsBeside(ctx).some((m) => Number(m.power || 0) > Number(ctx.self.power || 0))
    ? 'Gentry families with local landholdings; active in civic politics but outpaced by merchant capital in raw financial leverage'
    : LESSER_LANDED)
  : (merchantsBeside(ctx).length
    ? 'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.'
    : LESSER_LANDED);
/** @type {ReadonlyArray<ClaimRung>} */
const CLAIM_RUNGS = Object.freeze([
  // the port claim is matched by its opening and replaced to its sentence's end (its tail is a phrase the style law strikes,
  // so it is not spelled a second time here; the original stays in rulingStructure.js, under that file's own baseline)
  ...['International merchant houses controlling port licences and import flows;',
    'Dominant commercial class at a trade nexus; they set prices, control warehousing, and fund the council.',
    'Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.',
  ].map((claim) => ({ claim, minor: merchantRung, suppressed: merchantRung })),
  // the two church claims are matched by pattern (the house's word is the rulingStructure.js line's own, declared there)
  ...[/^\w+ institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical\./,
    /^\w+ holds substantial temporal power; tithes fund civic works and the clergy's opinion on appointments carries decisive weight\./,
  ].map((claim) => ({ claim,
    minor: (/** @type {string} */ tier) => SMALL_TIERS.includes(tier)
      ? 'The local clergy serve a real pastoral role; their moral authority has limited political reach but is genuinely respected.'
      // read beside its standing sentence ("Its priests look after their flocks and have no say in the hall"), a Minor church
      // above a village is at the margins: "meaningful civic influence" would claim a say the next sentence denies
      : CLERGY_AT_MARGINS,
    suppressed: () => CLERGY_AT_MARGINS })),
  // POWERS-12 (REVIEW-POWERS-3 M1): the five commanding claims the table did not cover (122 towns of the census's 720).
  // The Major church (city and metropolis only, the hospital and the charity variant): the margins rung, as above.
  { claim: /^Major church institutions hold structural influence\. Land grants, [^.]*\./, minor: () => CLERGY_AT_MARGINS, suppressed: () => CLERGY_AT_MARGINS },
  // printed only where a merchant power governs: the merchants' rung
  { claim: 'The ruling class and the merchant class are the same people; commercial decisions are political decisions and civic access is purchased.',
    minor: merchantRung, suppressed: merchantRung },
  // the standing army (city and metropolis): the city watch's rungs, which name a watch, so only where one stands; with
  // none, no rung is true and the claim is left
  { claim: 'Standing army with genuine political weight; command appointments are patronage, and the council knows it.',
    minor: (_tier, ctx) => watchStands(ctx) ? 'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.' : null,
    suppressed: (_tier, ctx) => watchStands(ctx) ? 'City watch; law enforcement and external defence, stretched between multiple responsibilities.' : null },
  ...['Arcane institutions hold substantial political leverage here. Contracts, security, and infrastructure all depend on magical services only they provide.',
    'Wizard towers and mage guilds hold genuine political weight; their services are structurally irreplaceable and they know it.',
  ].map((claim) => ({ claim,
    minor: () => 'Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.',
    suppressed: () => 'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.' })),
  ...['Underworld effectively controls vice, smuggling, and key officials; the nominal government tolerates this because it cannot currently change it.',
    'Criminal organisations have captured significant influence; corruption is systemic, not exceptional.',
  ].map((claim) => ({ claim,
    minor: (/** @type {string} */ tier, /** @type {RungContext} */ ctx) => COUNCIL_SEAT.test(ctx.governing)
      ? 'Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries.'
      : SMALL_TIERS.includes(tier)
        ? 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.'
        : 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.',
    suppressed: (/** @type {string} */ tier) => SMALL_TIERS.includes(tier)
      ? 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.'
      : 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.' })),
  { claim: 'Hereditary landowners whose land rights and military obligations are structurally embedded in governance here; the council works alongside them, not over them.',
    minor: () => 'Hereditary landowners with genuine but not dominant feudal claims; they shape decisions at the margins more than they command them.',
    suppressed: () => 'Noble families with residual feudal claims; the formal obligations are real, but other powers set the practical agenda day to day.' },
  ...['Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the elected council cannot easily override.',
    'Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the seat cannot easily override.',
  ].map((claim) => ({ claim, minor: nobleMinorRung, suppressed: () => LESSER_LANDED })),
  // POWERS-12 (REVIEW-POWERS-3 M1): the great families (metropolis) and the militarised nobles take the ladder's lowest
  // rung at both labels. The noble Minor rung reads the roster at this call, and the density law's fold drops a merchant
  // power no house stands behind after it (r2s-occupied-metropolis-1: a Suppressed Merchant Guilds), which would leave
  // "competitive with merchant capital" naming a power the page does not show; the lowest rung reads nothing the fold moves.
  ...['Hereditary great families with land grants, court appointments, and dynastic marriage networks; structurally embedded in governance even when not formally in power.',
    "Militarised noble families whose landholdings double as fortified estates; they provide the settlement's heavy cavalry and expect political weight in return.",
  ].map((claim) => ({ claim, minor: () => LESSER_LANDED, suppressed: () => LESSER_LANDED })),
]);

/**
 * Each power whose description opens with a commanding claim its final label (Minor, Suppressed) denies takes its
 * ladder's rung for that label in place of the claim; the rest of the description (a coda another writer added) is
 * kept. A rung reads the roster and the seat (RungContext); one that has no line true of the town (null) leaves the
 * description as it is. Mutates the roster in place, as the multipliers do. Pure of draws.
 * @param {Array<Record<string, any>>} factions @param {string} tier @param {string[]} [instNames] the roster's house names, lower-cased
 */
export function settleClaimsToLabel(factions, tier, instNames = []) {
  const governing = String(factions.find((x) => x?.isGoverning)?.faction || '');
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
    /** @type {RungContext} */ const ctx = { self: f, factions, governing, names: instNames };
    const line = label === 'Minor' ? rung.minor(tier, ctx) : rung.suppressed(tier, ctx);
    if (line === null) continue;
    f.desc = line + desc.slice(end);
  }
}

