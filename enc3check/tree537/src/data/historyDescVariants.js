/**
 * historyDescVariants.js — CONTENT-GT-FINAL lane (Charge 1): extra description
 * variants for the HISTORICAL_EVENTS_DATA catalog (historyData.js), keyed by event
 * `type`. These are the NON-canonical variants ONLY; each template's own catalog
 * `description` stays the canonical index-0 entry. generateEventNarrative selects among
 * [canonicalDescription, ...variants] with a pure fnv hash of a stable per-event seed
 * (`${ctx._seed}::histEvent::${i}::${type}`) — ZERO rng draws (kernel/proseHash.pickVariant,
 * canonical-at-zero), so the settlement's forked step-stream is byte-identical and no
 * structural field moves. A falsy seed (or a type with no variants) keeps the canonical
 * description unchanged.
 *
 * Substitution-token parity is verified against generateEventNarrative.defaultTokens:
 * every {resource}/{route_type}/{location}/{building_type}/{duration}/{demands}/{method}/
 * {quarter} a variant uses is resolved there, and no variant uses a token twice (String
 * .replace substitutes only the first occurrence). The 58 variants (2 per type) are the
 * banked authored corpus, in the approved dry-literary register (a fact + its complication).
 */
export const HISTORY_DESC_VARIANTS = Object.freeze({
  "succession_crisis": [
    "The reigning ruler was failing in health, and rival claimants maneuvered quietly for the throne",
    "As the ailing ruler declined, several would-be heirs positioned themselves to inherit",
  ],
  "economic_disparity": [
    "A widening gulf between wealthy merchants and working poor breeds lasting resentment",
    "The merchant class prospers while common laborers fall behind, and the bitterness spreads",
  ],
  "religious_tension": [
    "Rival faiths and doctrines contended for followers and standing in the community",
    "Competing creeds vied for converts, each seeking to outweigh the others",
  ],
  "guild_conflict": [
    "Competing guilds struggled for control of the market and a voice in local politics",
    "Established and upstart guilds fought over trade and the influence that came with it",
  ],
  "external_threat": [
    "Word of a gathering threat split the settlement over whether to fight, treat, or flee",
    "An approaching danger set the community against itself over the right response",
  ],
  "resource_scarcity": [
    "A vital resource ran short, and hoarding and inflated prices followed",
    "Scarcity of a critical good drove some to hoard it and others to gouge on the price",
  ],
  "crime_wave": [
    "A wave of crime outpaced the guards, and citizens started taking justice into their own hands",
    "Lawlessness rose faster than the authorities could answer, and vigilante bands emerged",
  ],
  "magical_controversy": [
    "The question of how far magic should be permitted or controlled split the settlement",
    "Argument over the place of magic and its limits set neighbour against neighbour",
  ],
  "generational_divide": [
    "Established custom and new thinking pull the generations into open conflict",
    "The old defend tradition while the young press for change, and the two will not meet",
  ],
  "corruption_scandal": [
    "Proof of official graft has come to light, and the implicated are blocking any inquiry",
    "Corruption among officials has been exposed, but those in power are stifling the investigation",
  ],
  "outside_debt": [
    "A large debt to an outside power came due, and the creditor was moving to enforce it",
    "The settlement had borrowed heavily from a foreign power now ready to call the debt in",
  ],
  "occupation_legacy": [
    "An occupation had ended years before, yet those who collaborated and those who resisted still lived as neighbours, the reckoning never made",
    "When the occupiers left, they left behind a town of former collaborators and former resisters, none of it ever settled",
  ],
  "infiltration_fear": [
    "Talk of enemy agents in the settlement, some of it true, spread suspicion and turned neighbours to informing on one another",
    "Fear of hidden infiltrators \u2014 not always unfounded \u2014 bred denunciations and a climate of mistrust",
  ],
  "disputed_land": [
    "An old charter grants land to one party that another now holds, and neither claim is easily dismissed",
    "A forgotten charter and the present occupation contradict each other, each side with law on its side",
  ],
  "population_friction": [
    "Newcomers and long-settled residents settled into a slow, grinding antagonism that never quite boiled over",
    "A newly arrived community and the old population fell into steady friction, rarely violent and never resolved",
  ],
  "leadership_vacuum": [
    "The last capable leader was gone, and no successor had managed to take firm hold of power",
    "With the strong hand that once ruled removed, rival figures circled and none prevailed",
  ],
  "market_crash": [
    "A boom in {resource} and property that everyone had bet on gave way in a matter of days, wiping out fortunes and leaving a resentment between the classes that outlasted those who caused it",
    "The speculative fever in {resource} and land broke without warning, and the ruin it left behind soured relations between the classes for a generation",
  ],
  "trade_collapse": [
    "The {route_type} trade that had made the settlement what it was collapsed, and the prosperity it once brought bled away over a handful of lean years",
    "When the {route_type} trade the town depended on failed, the wealth that had flowed through it dried up faster than anyone was prepared for",
  ],
  "great_fire": [
    "A fire out of {location} spread through {building_type} across entire districts before anyone could bring it under control",
    "Beginning in {location}, the blaze took {building_type} street by street until whole quarters were gone",
  ],
  "plague_years": [
    "For {duration} seasons a sickness worked through the settlement, emptying households and straining every institution past what it was built to bear",
    "The pestilence lingered {duration} seasons, thinning the families it reached and pushing every institution to the edge of what it could bear",
  ],
  "great_flood": [
    "The water came up with almost no warning and remade {location}, drowning livelihoods and unsettling every question of who owned what",
    "A flood rose fast across {location}, carrying off livelihoods and leaving the ownership of half the ground in doubt",
  ],
  "heresy_trial": [
    "A charge of heresy laid against a well-known figure divided the faithful and pulled the secular powers in on either side of it",
    "When a prominent believer was accused of heresy, the congregation split and the temporal authorities took sides in the quarrel",
  ],
  "pilgrimage_surge": [
    "Word of a miracle brought pilgrims in numbers the settlement had never been meant to hold, and the coin and strangers that came with them left it permanently altered",
    "A reputed relic drew more pilgrims than the town could house, and the money and outsiders they carried in changed the place beyond return",
  ],
  "popular_uprising": [
    "The common people took up against those who ruled them over {demands}, and the reckoning it began has never been fully closed",
    "A revolt over {demands} set the commons against the ruling powers, and the account it opened is still not settled",
  ],
  "tyranny": [
    "One figure took power by {method} and held it unchecked for a season, and the memory still governs who the town will trust with authority",
    "Through {method}, a single ruler seized control and answered to no one for a time, and that experience still colours how power is granted here",
  ],
  "wild_magic": [
    "A surge of magic no one could contain marked {quarter} and everyone caught in it, and what it did has never entirely worn away",
    "Magic broke loose over {quarter} and the people who lived there, and the traces it left have lingered ever since",
  ],
  "legitimacy_crisis": [
    "The standing authority found its right to rule challenged in the open, with no agreement on who, if anyone, could claim a legitimate title",
    "Few would grant that the sitting authority had any real right to power, and none could say who did",
  ],
  "demographic_pressure": [
    "People arrived and left faster than the settlement could adjust to either, and the churn reshaped ordinary life",
    "The settlement gained and lost people quicker than its institutions could absorb the change, and daily life bent under the strain",
  ],
  "trade_dispute": [
    "A quarrel over the terms of trade with a neighbouring settlement grew until it reached every merchant and every purse in the market",
    "What began as a disagreement over trade with a partner town spread until no merchant or buyer in the market was untouched by it",
  ],
});
