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
import { INSTITUTION_FAMILIES, catalogIdForName, familyNamesByTier } from '../../data/institutionalCatalog.js';
import { TAG } from '../../data/entityTags.js';
import { magicPractitioners } from '../../domain/magicReliance.js';

const SMALL_TIERS = Object.freeze(['thorp', 'hamlet', 'village']);
// POWERS-11 (REVIEW-POWERS-3 L2): a rung names no council, no merchant capital and no leading merchant its own roster
// makes false. The context it reads: the power itself, the roster as the multipliers left it, the seat's name.
/** @typedef {{ self: Record<string, any>, roster: Array<Record<string, any>>, governing: string, names: string[] }} RungContext */
/** @typedef {{ claim: string | RegExp, minor: (tier: string, ctx: RungContext) => string | null, suppressed: (tier: string, ctx: RungContext) => string | null }} ClaimRung */
const MERCHANT_POWER = /merchant|trade|commerc|consortium|mercantile/i;
const COUNCIL_SEAT = /council|assembly|senate|parliament|moot/i;
/** Whether the governing power's name is a council's (one home for the seat's word: claimStanding and factionStanding read it). @param {unknown} governing */
export const seatIsCouncil = (governing) => COUNCIL_SEAT.test(String(governing ?? ''));
// TAIL-POWERS-B batch 2 (rows 06725, 18554, 10424 and their siblings: A COUNCIL NAMED WHERE NONE SITS): a claim that names
// "the council" is printed under a seat that is no council (a Royal Authority, a Ducal or Noble Governorship, a Feudal
// Stewardship, a Town Mayor: 46 cards of the census's 720 at 40238d3ab); there it names the seat as the estate's lines
// do, "the hall". And the trade nexus's merchants "control warehousing" only where a warehouse stands (1 of the 5 there
// held none). No draw; the label rungs above read the claims first.
/** @type {ReadonlyArray<readonly [string, string]>} */
const SEAT_WORDS = Object.freeze([
  ['and fund the council.', 'and fund the hall.'],
  ['and the council knows it.', 'and the hall knows it.'],
  ['the council works alongside them, not over them.', 'the hall works alongside them, not over them.'],
  ['expect council access in return.', 'expect access to the hall in return.'],
]);
/**
 * THE WAREHOUSE BY THE CATALOGUE'S OWN IDS (TAIL-POWERS-B-5; the chair's P33/P34, vetoable by the owner: no new atom, the
 * label written once): the catalog ids of every rung of the family the catalogue itself tags a warehouse (its "Warehouse
 * district", whose town rung is "Merchant warehouses"), read from institutionalCatalog.js; a house stands one where its
 * name's catalog id is among them (labelJoins.test.js: a presence check joins by catalog id, never by a label scan).
 */
const WAREHOUSE_IDS = new Set(INSTITUTION_FAMILIES
  .filter((fam) => {
    const tags = fam.shared?.tags;
    return Array.isArray(tags) && tags.includes(TAG.WAREHOUSE);
  })
  .flatMap((fam) => familyNamesByTier(fam).map(({ name }) => catalogIdForName(name))));
/** The roster's merchant powers other than this one. @param {RungContext} ctx */
const merchantsBeside = (ctx) => ctx.roster.filter((x) => x !== ctx.self && MERCHANT_POWER.test(String(x?.faction || '')));
// POWERS-12 (REVIEW-POWERS-3 M1): a watch stands, read by the defence bucket's own words (the fact the ladder's watch
// lines are declared against), never by /watch/ (a watchtower is no watch). @param {RungContext} ctx
const watchStands = (ctx) => ctx.names.some((n) => DEFENSE_BUCKET_KEYWORDS.watch.some((kw) => String(n).includes(kw)));
/** BAR5-POWERS (1c-weight): the military's very-high lines at Minor or Suppressed take the watch's line for the tier, where one stands. @param {string} tier @param {RungContext} ctx */
const militaryRung = (tier, ctx) => !watchStands(ctx) ? null : tier === 'town' ? 'Town watch; it enforces ordinances, manages disorder, and reports to the council.'
  : tier === 'city' || tier === 'metropolis' ? 'City watch; law enforcement and external defence, stretched between multiple responsibilities.' : null;
const CLERGY_AT_MARGINS = 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.';
/** TAIL-POWERS-B-4 (the chair's P31 (1), vetoable by the owner; batch 6a's form): "at the margins ... leverage is limited" is false
 * of a faith that stands level with or above the seat on the final roster, or at Significant or above; there it takes this twin. */
const CLERGY_WITH_WEIGHT = 'The faith holds no office in the hall, but its moral authority is real and its word carries political weight here.';
const LESSER_LANDED = 'Minor landed families with limited political reach; present in civic life but rarely decisive.';
const LOCAL_MERCHANTS = 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.';
// the town's leading merchant power, where no merchant power governs, is not "not yet the dominant commercial voice"
const LEADING_LOCAL_MERCHANTS = 'Merchants with local reach; a consistent civic presence, though other powers set the course here.';
// TAIL-POWERS batch 2 (the chair's ruling P1 of 2026-11-14: a power's standing in a sentence reads the power's own
// strength): a Suppressed merchant power is no "consistent civic presence"; a Minor or Suppressed arcane power holds no
// "real influence"; a Minor craft guild is no "persistent civic voice ... merchant houses must negotiate with", and a
// Suppressed one no "reliable secondary presence". Each takes the line true at its label.
const MERCHANTS_AT_MARGINS = 'Merchants with local reach; they trade here, but have little say in how the place is run.';
const ARCANE_ADVISORY = 'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.';
/** TAIL-POWERS-B-2 (the chair's READ-ALL-4 HIGH, vetoable by the owner): where an arcane power GOVERNS, "not formally empowered" is
 * false of magic; the practitioners outside the seat take this twin, true in that state. */
const ARCANE_ADVISORY_UNDER_ARCANE_SEAT = 'Magical practitioners outside the seat hold no office of their own; their influence is advisory and transactional.';
/** TAIL-CONTENT-CLOSE-1 (2026-11-15, the round's law of a cure): the two advisory lines name practitioners, so they print only where the
 * town holds one (magicReliance.js :: magicPractitioners, the magic reading's own reader, on the final record); where it holds none the
 * power's standing takes its twin, said without them. @type {ReadonlyArray<readonly [string, string]>} */
export const ARCANE_WITHOUT_PRACTITIONERS = Object.freeze([
  [ARCANE_ADVISORY, 'The arcane interest is consulted but not formally empowered. Its influence is advisory, transactional, and quietly resented.'],
  [ARCANE_ADVISORY_UNDER_ARCANE_SEAT, 'The arcane interest outside the seat holds no office of its own; its influence is advisory and transactional.'],
]);
// TAIL-POWERS-B-3 batch 7 (P1; row 29025, 8 Suppressed cards of 36 at 4ff449a7b): a Suppressed network "controls" no illicit
// trade; it takes this twin, which claims no control.
const CRIMINAL_IN_SHADOWS = 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.';
const CRIMINAL_KEEPS_OUT_OF_SIGHT = "Criminal network operating in shadows; it keeps out of the law's sight and takes what it can from illicit trade.";
// TAIL-POWERS-B-3 batch 7 (P1; row 29028, 8 of 18 at 4ff449a7b): "the nominal government ... cannot currently change it" is false
// where the seat's own label stands above the guild's; there the line says the seat is stronger. Read on the labels alone (the
// chair's P29: not keyed on the capture state).
const UNDERWORLD_CLAIM = 'Underworld effectively controls vice, smuggling, and key officials; the nominal government tolerates this because it cannot currently change it.';
const UNDERWORLD_UNDER_STRONGER_SEAT = 'Underworld effectively controls vice and key officials; the seat is stronger, but has not moved to break its hold.';
/** @type {Readonly<Record<string, number>>} */
const LABEL_RANK = Object.freeze({ Suppressed: 0, Minor: 1, Significant: 2, Strong: 3, Dominant: 4 });
const CRAFT_SECONDARY = 'The trades regulate their own production and apprenticeships; a reliable secondary presence in civic life.';
const CRAFT_AT_MARGINS = 'The trades regulate their own production and apprenticeships, but carry little weight beyond the workshops.';
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
/** The seat's respect lines and their twins under a legitimacy crisis (P4). @type {ReadonlyArray<readonly [string | RegExp, string]>} */
const SEAT_UNDER_CRISIS = Object.freeze([
  ['The oldest heads of the community decide things together; people follow them out of respect and custom, not law.',
    'The oldest heads of the community still decide things together, but fewer and fewer people accept their word.'],
  // the Elder Council's label line (rulingStructure.js), matched by pattern: its own wording is under that file's style baseline
  [/^Respected elders guide the community; authority is moral and traditional [^.]*\./,
    'Elders guide the community by custom, not by formal authority, but fewer and fewer people accept their word.'],
]);
/** @type {ReadonlyArray<ClaimRung>} */
const CLAIM_RUNGS = Object.freeze([
  // the port claim is matched by its opening and replaced to its sentence's end (its tail is a phrase the style law strikes,
  // so it is not spelled a second time here; the original stays in rulingStructure.js, under that file's own baseline)
  ...['International merchant houses controlling port licences and import flows;',
    'Dominant commercial class at a trade nexus; they set prices, control warehousing, and fund the council.',
    'Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.',
  ].map((claim) => ({ claim, minor: merchantRung, suppressed: () => MERCHANTS_AT_MARGINS })),
  // TAIL-POWERS batch 2 (P1): the merchants' own lower rungs, read at Suppressed (true at Minor, so left there)
  ...[LOCAL_MERCHANTS, LEADING_LOCAL_MERCHANTS, 'Established merchant community; fund civic works and expect council access in return.']
    .map((claim) => ({ claim, minor: () => null, suppressed: () => MERCHANTS_AT_MARGINS })),
  // TAIL-POWERS batch 2 (P1): the craft guilds' ladder (rulingStructure.js), read at the label; matched by pattern (the
  // house's word is the rulingStructure.js line's own, declared there), as the church claims are
  ...[/^Well-organised craft guilds with established trade monopolies; a persistent civic voice [^.]*\./,
    /^Craft masters controlling production standards and apprenticeships; present in every civic dispute [^.]*\./,
  ].map((claim) => ({ claim, minor: () => CRAFT_SECONDARY, suppressed: () => CRAFT_AT_MARGINS })),
  { claim: /^Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life\./, minor: () => null, suppressed: () => CRAFT_AT_MARGINS },
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
  // BAR5-POWERS (LAW 1c-weight, the chair's ruling PW1; the audit's C33631: 10 towns of the 720 printed it under Suppressed, 9 under Minor):
  // the church ladder's own line at a raw 11-17, which the multipliers and the roster's resize leave Minor or Suppressed; read
  // beside its standing sentence it claims a say the next sentence denies: the margins rung, as above
  { claim: 'Clergy and church institutions exercise meaningful civic influence through moral authority, land ownership, and popular trust.',
    minor: () => CLERGY_AT_MARGINS, suppressed: () => CLERGY_AT_MARGINS },
  // the military ladder's very-high lines below a city (a force "significant for this scale", officers of "disproportionate"
  // influence) read at Minor or Suppressed: the watch's own line for the tier where a watch stands; with none, no rung is true
  ...["Significant military force for this scale; the commander's opinion on civic matters carries institutional weight.",
    'Significant military presence; officers hold political influence disproportionate to formal civic rank.',
  ].map((claim) => ({ claim, minor: militaryRung, suppressed: militaryRung })),
  // printed only where a merchant power governs: the merchants' rung
  { claim: 'The ruling class and the merchant class are the same people; commercial decisions are political decisions and civic access is purchased.',
    minor: merchantRung, suppressed: () => MERCHANTS_AT_MARGINS },
  // the standing army (city and metropolis): the city watch's rungs, which name a watch, so only where one stands; with
  // none, no rung is true and the claim is left
  { claim: 'Standing army with genuine political weight; command appointments are patronage, and the council knows it.',
    minor: (_tier, ctx) => watchStands(ctx) ? 'City watch; it answers for keeping order and is growing more sure of its own authority.' : null,
    suppressed: (_tier, ctx) => watchStands(ctx) ? 'City watch; law enforcement and external defence, stretched between multiple responsibilities.' : null },
  ...['Arcane institutions hold substantial political leverage here. Contracts, security, and infrastructure all depend on magical services only they provide.',
    'Wizard towers and mage guilds hold genuine political weight; their services are structurally irreplaceable and they know it.',
    // TAIL-POWERS batch 2 (P1): "hold real influence" is the ladder's own line at a raw 11-16, which the multipliers leave
    // Minor or Suppressed (all 111 towns printing it at bcad1a358): no rung of the arcane ladder below it claims influence
    'Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.',
  ].map((claim) => ({ claim, minor: () => ARCANE_ADVISORY, suppressed: () => ARCANE_ADVISORY })),
  ...[UNDERWORLD_CLAIM,
    'Criminal organisations have captured significant influence; corruption is systemic, not exceptional.',
  ].map((claim) => ({ claim,
    minor: (/** @type {string} */ tier, /** @type {RungContext} */ ctx) => COUNCIL_SEAT.test(ctx.governing)
      ? 'Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries.'
      : SMALL_TIERS.includes(tier)
        ? 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.'
        : CRIMINAL_IN_SHADOWS,
    suppressed: (/** @type {string} */ tier) => SMALL_TIERS.includes(tier)
      ? 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.'
      : CRIMINAL_KEEPS_OUT_OF_SIGHT })),
  // TAIL-POWERS-B-3 batch 7 (row 29025): the ladder's own line, drawn or settled, read at Suppressed (true at Minor, so left there)
  { claim: CRIMINAL_IN_SHADOWS, minor: () => null, suppressed: () => CRIMINAL_KEEPS_OUT_OF_SIGHT },
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
 * THE CLERGY'S MARGINS ON THE FINAL ROSTER (TAIL-POWERS-B-4, P31 (1)): the margins line is written at the power step, and the
 * density law resizes the roster after it; read once on the final roster (beside keepOneDominant), a non-governing card that
 * stands at or above the seat's power, or holds a label of Significant or above, takes CLERGY_WITH_WEIGHT. Draw-free; mutates
 * the descriptions in place, as settleClaimsToLabel does.
 * @param {Array<Record<string, any>> | undefined} factions
 */
export function settleClergyToFinalRoster(factions) {
  if (!Array.isArray(factions)) return;
  const seat = factions.find((x) => x?.isGoverning);
  for (const f of factions) {
    if (!f || f.isGoverning || typeof f.desc !== 'string' || !f.desc.includes(CLERGY_AT_MARGINS)) continue;
    const weighty = (LABEL_RANK[String(f.powerLabel)] ?? 0) >= LABEL_RANK.Significant || (!!seat && Number(f.power || 0) >= Number(seat.power || 0));
    if (weighty) f.desc = f.desc.replace(CLERGY_AT_MARGINS, CLERGY_WITH_WEIGHT);
  }
}

/**
 * THE ARCANE ADVISORY LINES ON THE FINAL RECORD (TAIL-CONTENT-CLOSE-1, 2026-11-15): the lines are written at the power step,
 * before the town's people and houses are final; read once on the final record (beside settleClergyToFinalRoster), a town
 * where no one works magic (`magicPractitioners` empty) takes each line's twin (ARCANE_WITHOUT_PRACTITIONERS). Draw-free;
 * mutates the descriptions in place.
 * @param {Array<Record<string, any>> | undefined} factions
 * @param {import('../../domain/magicReliance.js').MagicRelianceSource | null | undefined} record the final settlement record
 */
export function settleArcaneToPractitioners(factions, record) {
  if (!Array.isArray(factions) || !record || magicPractitioners(record).length > 0) return;
  for (const f of factions) {
    if (!f || typeof f.desc !== 'string') continue;
    for (const [said, twin] of ARCANE_WITHOUT_PRACTITIONERS) f.desc = f.desc.replace(said, twin);
  }
}

/**
 * Each power whose description opens with a commanding claim its final label (Minor, Suppressed) denies takes its
 * ladder's rung for that label in place of the claim; the rest of the description (a coda another writer added) is
 * kept. A rung reads the roster and the seat (RungContext); one that has no line true of the town (null) leaves the
 * description as it is. Mutates the roster in place, as the multipliers do. Pure of draws.
 * THE SEAT UNDER A LEGITIMACY CRISIS (TAIL-POWERS batch 2; the chair's ruling P4 of 2026-11-14): the governing seat's line
 * that says the people follow it out of respect is not printed where the record's legitimacy is in crisis (few accept its
 * right to rule); it takes its twin, true in that state (SEAT_UNDER_CRISIS).
 * @param {Array<Record<string, any>>} factions @param {string} tier @param {string[]} [instNames] the roster's house names, lower-cased
 * @param {{ isLegitimacyCrisis?: boolean } | null} [legitimacy] the step's public legitimacy (computePublicLegitimacy)
 */
export function settleClaimsToLabel(factions, tier, instNames = [], legitimacy = null) {
  const governing = String(factions.find((x) => x?.isGoverning)?.faction || '');
  if (legitimacy?.isLegitimacyCrisis === true) {
    for (const f of factions) {
      if (!f?.isGoverning || typeof f.desc !== 'string') continue;
      for (const [line, twin] of SEAT_UNDER_CRISIS) {
        const span = typeof line === 'string' ? (f.desc.startsWith(line) ? line.length : -1) : (line.exec(f.desc)?.[0].length ?? -1);
        if (span > 0) { f.desc = twin + f.desc.slice(span); break; }
      }
    }
  }
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
    /** @type {RungContext} */ const ctx = { self: f, roster: factions, governing, names: instNames };
    const line = label === 'Minor' ? rung.minor(tier, ctx) : rung.suppressed(tier, ctx);
    if (line === null) continue;
    f.desc = line + desc.slice(end);
  }
  const seat = factions.find((x) => x?.isGoverning);
  const arcaneSeat = seat?.category === 'magic';
  const seatRank = LABEL_RANK[String(seat?.powerLabel)] ?? -1;
  const warehouse = instNames.map((n) => catalogIdForName(n)).some((id) => WAREHOUSE_IDS.has(id));
  for (const f of factions) {
    if (typeof f?.desc !== 'string') continue;
    if (!seatIsCouncil(governing)) for (const [said, twin] of SEAT_WORDS) f.desc = f.desc.replace(said, twin);
    if (!warehouse) f.desc = f.desc.replace('they set prices, control warehousing, and fund', 'they set prices and fund');
    if (arcaneSeat && !f.isGoverning) f.desc = f.desc.replace(ARCANE_ADVISORY, ARCANE_ADVISORY_UNDER_ARCANE_SEAT);
    if (!f.isGoverning && seatRank > (LABEL_RANK[String(f.powerLabel)] ?? 99) && f.desc.startsWith(UNDERWORLD_CLAIM)) {
      f.desc = UNDERWORLD_UNDER_STRONGER_SEAT + f.desc.slice(UNDERWORLD_CLAIM.length);
    }
  }
}

