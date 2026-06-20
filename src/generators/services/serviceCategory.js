/**
 * services/serviceCategory.js
 * Service→category classification — split out of servicesGenerator.js.
 *
 * Holds the explicit service→category and institution→default-category lookup
 * tables, the criminal-institution vocabulary, and the heuristic
 * `categorizeService` classifier (the long keyword-ternary fallback used when a
 * service name is not in the explicit map). Pure functions and data; no RNG,
 * no determinism surface.
 */

// ── Institution-level default category fallback ──────────────────────────────
// When a service name is not in SERVICE_CATEGORY_MAP, this provides the
// institution's inherent domain as the category default.
const INSTITUTION_DEFAULT_CATEGORY = {
  'Contract killer': 'criminal',
  "Assassins' guild": 'criminal',
  "Thieves' guild chapter": 'criminal',
  "Thieves' guild (powerful)": 'criminal',
  'Multiple criminal factions': 'criminal',
  'Black market': 'criminal',
  'Black market bazaar': 'criminal',
  'Street gang': 'criminal',
  'Smuggling operation': 'criminal',
  'Smuggling network': 'criminal',
  'Smuggling waypoint': 'criminal',
  'Bandit affiliate': 'criminal',
  'Front businesses': 'criminal',
  'Kidnapping ring': 'criminal',
  'Human trafficking network': 'criminal',
  'Underground city': 'criminal',
  'Local fence': 'criminal',
  'Fence (word of mouth)': 'criminal',
  'Outlaw shelter': 'criminal',
  'Free company hall': 'employment',
  'Mercenary quarter': 'employment',
  'Hired blades': 'employment',
  'Gladiatorial school': 'employment',
  'Beast trainers': 'employment',
  'Citizen militia': 'employment',
  'Town watch': 'employment',
  'Professional city watch': 'employment',
  Garrison: 'employment',
  Barracks: 'employment',
  'Multiple garrisons': 'employment',
  "Warden's Lodge": 'employment',
  Workhouse: 'employment',
  "Hunter's lodge": 'employment',
  Wildfowler: 'employment',
  "Adventurers' charter hall": 'employment',
  'Hireling hall': 'employment',
  "Multiple adventurers' guilds": 'employment',
  'Dungeon delving supply district': 'employment',
  "Veteran's lodge": 'employment',
  "Caravaneer's post": 'employment',
  "Caravan masters' exchange": 'employment',
  "Carriers' guild": 'employment',
  "Carriers' hiring hall": 'employment',
  'Post relay station': 'employment',
  'Gambling den': 'entertainment',
  'Gambling halls': 'entertainment',
  'Gambling district': 'entertainment',
  'Fighting pits': 'entertainment',
  'Colosseum/arena': 'entertainment',
  Theaters: 'entertainment',
  'Multiple theaters': 'entertainment',
  'Opera house': 'entertainment',
  'Bardic college': 'entertainment',
  Brothel: 'entertainment',
  'Brothel (red light district)': 'entertainment',
  'Red light district': 'entertainment',
  'Traveling performers': 'entertainment',
  'Charlatan fortune tellers': 'entertainment',
  'Dream parlors (high magic)': 'entertainment',
  'Village musician': 'entertainment',
  Blacksmith: 'equipment',
  'Blacksmiths (3-10)': 'equipment',
  'Resident smith (part-time)': 'equipment',
  Carpenter: 'equipment',
  'Carpenter (part-time)': 'equipment',
  'Carpenters (5-15)': 'equipment',
  Thatcher: 'equipment',
  Cooper: 'equipment',
  'Bowyer & fletcher': 'equipment',
  'Bowyers & fletchers (guild)': 'equipment',
  Sawmill: 'equipment',
  Tannery: 'equipment',
  Tanners: 'equipment',
  'Tanner (established)': 'equipment',
  Fuller: 'equipment',
  Dyer: 'equipment',
  Potter: 'equipment',
  Brickmaker: 'equipment',
  Chandler: 'equipment',
  Glassblower: 'equipment',
  Glassmakers: 'equipment',
  Ropemaker: 'equipment',
  Woodcarver: 'equipment',
  Smelter: 'equipment',
  'Specialized metalworkers': 'equipment',
  'Luxury goods quarter': 'equipment',
  'Craft guilds (5-15)': 'equipment',
  'Craft guilds (30-80)': 'equipment',
  'Craft guilds (100-150+)': 'equipment',
  'Weavers/Textile workers': 'equipment',
  Cobbler: 'equipment',
  "Cobbler's guild": 'equipment',
  Tailor: 'equipment',
  "Tailor's guild": 'equipment',
  Jeweller: 'equipment',
  "Furrier's district": 'equipment',
  'Salt works': 'equipment',
  Beekeeper: 'equipment',
  'Dairy farmer': 'equipment',
  Maltster: 'equipment',
  'Mine (open cast)': 'equipment',
  'Stone quarry': 'equipment',
  'Charcoal burner': 'equipment',
  'Peat cutter': 'equipment',
  Shepherd: 'equipment',
  'Shepherd collective': 'equipment',
  Fishmonger: 'equipment',
  'Fish market': 'equipment',
  'Fishing community': 'equipment',
  "Fisher's landing": 'equipment',
  'Pack animal trader': 'transport',
  'Stable master': 'equipment',
  'Stable district': 'equipment',
  'Stable yard': 'equipment',
  'Golem workforce': 'equipment',
  'Undead labor': 'equipment',
  Shipyard: 'equipment',
  'River boatyard': 'equipment',
  Vintner: 'equipment',
  Brewer: 'food',
  Brewery: 'food',
  'Bakers (5-15)': 'food',
  'Butchers (3-8)': 'food',
  Alehouse: 'food',
  'Ale house': 'food',
  'Taverns (5-20)': 'food',
  'Inn (multiple)': 'lodging',
  "Travelers' inn": 'lodging',
  'Wayside inn': 'lodging',
  'Coaching inn': 'lodging',
  'Inns and taverns (district)': 'lodging',
  Waystation: 'lodging',
  'Housing (180-1000 structures)': 'lodging',
  'Housing (1000-5000 structures)': 'lodging',
  'Dwellings (4-16)': 'lodging',
  'Dwellings (17-80)': 'lodging',
  'Dwellings (80-180)': 'lodging',
  'Small hospital': 'healing',
  'Major hospital': 'healing',
  'Hospital network': 'healing',
  'Monastery or friary': 'healing',
  'Multiple monasteries': 'healing',
  'Major monasteries (5-10)': 'healing',
  Almshouse: 'healing',
  'Foundling home': 'healing',
  Midwife: 'healing',
  Apothecary: 'healing',
  'Apothecary (established)': 'healing',
  'Apothecary district': 'healing',
  'Healer (divine, 1st level)': 'healing',
  Graveyard: 'healing',
  'Public bathhouse': 'healing',
  'Parish church': 'healing',
  'Parish churches (2-5)': 'healing',
  'Parish churches (10-30)': 'healing',
  'Parish churches (50-100+)': 'healing',
  'Wayside shrine': 'healing',
  'Access to parish church': 'healing',
  'Cathedral (10,000+ only)': 'healing',
  'Great cathedral': 'healing',
  'Priest (resident)': 'healing',
  'Village scribe': 'information',
  'Town crier': 'information',
  'Printing house': 'information',
  "Cartographer's workshop": 'information',
  "Cartographer's guild": 'information',
  'Great library': 'information',
  "Sage's quarter": 'information',
  'Message network (high magic)': 'information',
  'Planar embassy': 'information',
  'Mayor and council': 'legal',
  'Town hall': 'legal',
  'City hall': 'legal',
  Courthouse: 'legal',
  'Multiple courthouses': 'legal',
  'Multiple court buildings': 'legal',
  'Palace/government complex': 'legal',
  'Royal seat': 'legal',
  "Lord's reeve": 'legal',
  "Lord's steward": 'legal',
  "Lord's appointee": 'legal',
  'Head-of-household consensus': 'legal',
  'Informal elder consensus': 'legal',
  'Village reeve': 'legal',
  'Guild governance': 'legal',
  'Guild consortium': 'legal',
  'Merchant oligarchy': 'legal',
  'City-state government': 'legal',
  'Democratic assembly': 'legal',
  'Noble governor': 'legal',
  'Small prison/stocks': 'legal',
  'Large prison': 'legal',
  'Massive prison': 'legal',
  'Assay office': 'legal',
  'Customs house': 'legal',
  'Auction house': 'legal',
  'Merchant warehouses': 'legal',
  'Warehouse district': 'legal',
  'Town granary': 'legal',
  'City granaries': 'legal',
  'State granary complex': 'legal',
  'Money changers': 'legal',
  'Banking houses': 'legal',
  'Banking district': 'legal',
  Pawnbroker: 'legal',
  'Annual fair': 'legal',
  'Major annual fairs': 'legal',
  Mint: 'legal',
  'Mint (official)': 'legal',
  'Merchant guilds (3-8)': 'legal',
  'Merchant guilds (15-40)': 'legal',
  'Merchant guilds (50-100+)': 'legal',
  'Market square': 'legal',
  'Multiple market squares': 'legal',
  'Weekly market': 'legal',
  'Daily markets': 'legal',
  'District markets (5-10)': 'legal',
  'Periodic market': 'legal',
  'International trade center': 'legal',
  "Harbour master's office": 'transport',
  'Docks/port facilities': 'transport',
  'Barge and river transport company': 'transport',
  'River ferry': 'transport',
  'Toll bridge': 'transport',
  "Wizard's tower": 'magic',
  "Mages' guild": 'magic',
  "Mages' district": 'magic',
  'Alchemist shop': 'magic',
  'Alchemist quarter': 'magic',
  "Enchanter's shop": 'magic',
  'Scroll scribe': 'magic',
  'Teleportation circle': 'magic',
  'Airship docking (high magic)': 'magic',
  'Traveling hedge wizard': 'magic',
  'Hedge wizard': 'magic',
  'Druid Circle': 'magic',
  'Elder Grove Council': 'magic',
  'Planar traders': 'magic',
  'Academy of magic': 'magic',
};
// ── Explicit service→category lookup (auto-generated from comprehensive audit) ──
const SERVICE_CATEGORY_MAP = {
  'Arcane services (illicit)': 'criminal',
  'Contraband transport': 'criminal',
  'Discreet meeting venues': 'criminal',
  'Fence (word of mouth)': 'criminal',
  'Hired muscle': 'criminal',
  'No law, bring coin': 'criminal',
  'Protection (informal)': 'criminal',
  'Legitimate facade': 'criminal',
  'Administrative orders': 'employment',
  'Apprenticeship and training': 'employment',
  'Apprenticeship programs': 'employment',
  'Armed escort': 'employment',
  'Armed patrol': 'employment',
  'Bodyguard hire': 'employment',
  'Caravan escort (armed)': 'employment',
  'Combat training': 'employment',
  'Contract board': 'employment',
  'Debt enforcement': 'employment',
  // Garrison wall/gate patrol — legitimate defence work like 'Armed patrol'/
  // 'Watch rotation'; must never sit behind the criminal crime-scaled gate.
  'Defence services': 'employment',
  'Dungeon clearance': 'employment',
  'Emergency muster': 'employment',
  'Garrison contract': 'employment',
  'Guard hire (caravan)': 'employment',
  'Gated entry': 'employment',
  'Hiring hall': 'employment',
  'Horse training': 'employment',
  'Hunting guide hire': 'employment',
  'Livestock management': 'employment',
  'Animal training': 'employment',
  'Member support': 'employment',
  'Mercenary hire': 'employment',
  'Metalworking training': 'employment',
  'Night watch': 'employment',
  'Night watch hire': 'employment',
  'Party matching': 'employment',
  'Patrol and watch': 'employment',
  'Siege specialists': 'employment',
  'Tax collection': 'employment',
  'Textile labour': 'employment',
  'Training services': 'employment',
  Trapping: 'employment',
  'Vagrancy enforcement': 'employment',
  'Watch rotation': 'employment',
  'Wilderness scouting': 'employment',
  Bookmaking: 'entertainment',
  'Bookmaking on all events': 'entertainment',
  Entertainment: 'entertainment',
  'Exhibition bouts': 'entertainment',
  'Fortune telling': 'entertainment',
  'Games of chance': 'entertainment',
  'Games of chance (all kinds)': 'entertainment',
  'Gladiatorial combat': 'entertainment',
  'High-stakes gambling': 'entertainment',
  'Magical entertainment': 'entertainment',
  'Music and song': 'entertainment',
  'Musical education': 'entertainment',
  Performances: 'entertainment',
  'Performances (events)': 'entertainment',
  'Public games': 'entertainment',
  'Seasonal rituals': 'entertainment',
  'Ale (barrel)': 'equipment',
  'Ale (jug)': 'equipment',
  'Armour repair': 'equipment',
  'Armour warding': 'equipment',
  'Automated labour': 'equipment',
  Beeswax: 'equipment',
  'Beeswax candles': 'equipment',
  'Boot repair': 'equipment',
  Butter: 'equipment',
  'Carved goods': 'equipment',
  Charcoal: 'equipment',
  Coal: 'equipment',
  'Cordage (specialty)': 'equipment',
  'Creature components': 'equipment',
  'Custom commission': 'equipment',
  'Custom commissions': 'equipment',
  'Donkey purchase': 'equipment',
  'Draft horse purchase': 'equipment',
  'Dressed stone': 'equipment',
  'Dyed cloth': 'equipment',
  'Equipment hire': 'equipment',
  'Equipment purchase': 'equipment',
  'Exotic creatures for sale': 'equipment',
  Farriery: 'equipment',
  'Fine metalwork': 'equipment',
  'Fired brick': 'equipment',
  'Firewood (seasoned)': 'equipment',
  'Fresh fish': 'equipment',
  'Fulled cloth': 'equipment',
  'Fur garments': 'equipment',
  'Furs and pelts': 'equipment',
  'Game meat': 'equipment',
  'Garment repair': 'equipment',
  'Gem purchase': 'equipment',
  'Glass vessels': 'equipment',
  Honey: 'equipment',
  'Horse purchase': 'equipment',
  Horseshoeing: 'equipment',
  'Iron ore': 'equipment',
  'Iron refining': 'equipment',
  'Lumber milling': 'equipment',
  'Malted barley': 'equipment',
  'Manufactured goods (bulk)': 'equipment',
  'Mule purchase': 'equipment',
  'Peat fuel': 'equipment',
  'Pottery and ceramics': 'equipment',
  'Processed textiles': 'equipment',
  'Quality furs': 'equipment',
  'Quality leather': 'equipment',
  'Quality weapons and armour': 'equipment',
  'Quarried stone': 'equipment',
  Rawhide: 'equipment',
  'Religious carvings': 'equipment',
  'Roof tiles': 'equipment',
  Rope: 'equipment',
  'Rope (standard)': 'equipment',
  'Saddlery leather': 'equipment',
  'Salt for preservation': 'equipment',
  'Salted fish': 'equipment',
  'Sea salt': 'equipment',
  'Ship chandlery': 'equipment',
  'Ship repair': 'equipment',
  'Shoes (standard)': 'equipment',
  'Smoke and flash powder': 'equipment',
  Soap: 'equipment',
  'Soft cheese': 'equipment',
  'Tallow candles': 'equipment',
  'Tanned leather': 'equipment',
  'Tool repair': 'equipment',
  'Trade goods for export': 'equipment',
  'Weapon creation': 'equipment',
  'Wild game sales': 'equipment',
  'Window glass': 'equipment',
  'Wool shearing': 'equipment',
  'Working clothes': 'equipment',
  'Grain milling': 'food',
  'Meals and drink': 'food',
  Alms: 'healing',
  'Basic wound care': 'healing',
  'Barber services': 'healing',
  Bathing: 'healing',
  'Birth assistance': 'healing',
  'Charitable giving': 'healing',
  'Child placement': 'healing',
  'Healing herbs': 'healing',
  'Herbal remedies': 'healing',
  'Medical care (basic)': 'healing',
  'Medical training': 'healing',
  'Medical treatment': 'healing',
  'Pilgrim shelter': 'healing',
  'Poor relief': 'healing',
  Quarantine: 'healing',
  'Religious services': 'healing',
  Sanctuary: 'healing',
  Surgery: 'healing',
  'Advanced education': 'information',
  'Copying services': 'information',
  'Document copying': 'information',
  'Druidic consultation': 'information',
  'Education (basic)': 'information',
  'Fish prices (market rate)': 'information',
  'Historical research': 'information',
  'Information exchange': 'information',
  'Investigation services': 'information',
  'Letter writing': 'information',
  'Long-distance messages': 'information',
  'Message delivery': 'information',
  'Message relay': 'information',
  'Monster bounties': 'information',
  'Monster exhibitions': 'information',
  'Monster threat assessment': 'information',
  'News and information': 'information',
  'Price discovery': 'information',
  'Public announcements': 'information',
  'Rare texts': 'information',
  'Reading aloud': 'information',
  'Record keeping': 'information',
  'Research access': 'information',
  'Research facilities': 'information',
  'Route intelligence': 'information',
  'Rumour and news': 'information',
  'Scholarly community': 'information',
  'Diplomatic access': 'information',
  'Anonymous deposit': 'legal',
  Appraisal: 'legal',
  'Assay (informal)': 'legal',
  'Auction services': 'legal',
  'Bonded storage': 'legal',
  'Civil disputes': 'legal',
  'Coin exchange': 'legal',
  'Contract negotiation': 'legal',
  'Criminal trials': 'legal',
  'Customs brokerage': 'legal',
  'Customs clearance': 'legal',
  'Deposit accounts': 'legal',
  'Estate sales': 'legal',
  'Gem appraisal': 'legal',
  'Goods purchase': 'legal',
  'Goods storage': 'legal',
  'Import/export permits': 'legal',
  'Institutional lending': 'legal',
  'International finance': 'legal',
  'International shipping': 'legal',
  'Investment banking': 'legal',
  'Jewellery appraisal': 'legal',
  'Letters of credit': 'legal',
  Loans: 'legal',
  'Loans (secured)': 'legal',
  'Maritime clearance': 'legal',
  'Metal purity testing': 'legal',
  'Money changing': 'legal',
  'Nature arbitration': 'legal',
  'Notary services': 'legal',
  'Prisoner holding': 'legal',
  'Quality control': 'legal',
  'Quality standards': 'legal',
  'Trade facilitation': 'legal',
  'Trade regulation': 'legal',
  'Warehousing (bonded)': 'legal',
  'Basic provisions': 'lodging',
  'Food and drink (all grades)': 'lodging',
  Lodging: 'lodging',
  'Lodging (all grades)': 'lodging',
  'Alchemical products': 'magic',
  'Alchemical reagents': 'magic',
  'Arcane research': 'magic',
  'Arcane scribing': 'magic',
  'Cantrips and minor magic': 'magic',
  'Curse removal (claimed)': 'magic',
  'Enchanting services': 'magic',
  'Extraplanar goods': 'magic',
  'Magical identification': 'magic',
  'Magical item market': 'magic',
  'Magical references': 'magic',
  'Magical training': 'magic',
  'Nature magic services': 'magic',
  'Planar services': 'magic',
  'Potions and elixirs': 'magic',
  'Spellcasting (1st-3rd level)': 'magic',
  'Spellcasting services (1st-6th)': 'magic',
  'Utility enchantments': 'magic',
  'Weapon enchantment': 'magic',
  'Wilderness guidance': 'magic',
  'Animal hire (daily)': 'transport',
  'Berth assignment': 'transport',
  'Cargo assembly': 'transport',
  'Cargo handling': 'transport',
  'Cargo shipping': 'transport',
  'Caravan assembly': 'transport',
  'Horse stabling': 'transport',
  'Mount hire (daily)': 'transport',
  'Overnight stabling': 'transport',
  'Pack animal hire': 'transport',
  'Passenger transport': 'transport',
  'Passenger vessel': 'transport',
  Pilotage: 'transport',
  'Post horse hire': 'transport',
  'River crossing': 'transport',
  Stabling: 'transport',
  'Stabling (long-term)': 'transport',
  'Vessel hire': 'transport',
  // Magical/large-scale transit is transport first and foremost. Without
  // these, the heuristic classifier filed them under magic (teleport/planar
  // keywords, airship-dock institution default) or legal ('cargo loading'),
  // so a metropolis with a Teleportation circle or airship dock still showed
  // "Transportation" under NOTABLE ABSENCES. No-magic worlds are unaffected:
  // these providers are filtered at the institution level (ARCANE_INST_KW).
  'Long-distance teleportation': 'transport',
  'Planar transit': 'transport',
  'Airship berths': 'transport',
  'Passenger boarding': 'transport',
  'Cargo loading': 'transport',
};

// Criminal-institution vocabulary — shared by the crime-scaled service gate
// and the synthetic informal-crime fallback so the two stay in sync.
export const _CRIMINAL_INST_KW = [
  'thieves',
  'black market',
  'smuggl',
  'street gang',
  'front business',
  'assassin',
  'gambling den',
  'underground',
  'red light',
  'criminal faction',
];
// The crime-scaled gate models ILLICIT supply tracking criminal presence.
// It only applies to services offered by criminal institutions: a legitimate
// provider's services (garrison patrols, a tavern back room) must not vanish
// because the settlement is lawful — the institution already exists.
export const _isCriminalProvider = (inst) => {
  if ((inst.category || '').toLowerCase() === 'criminal') return true;
  const n = (inst.name || '').toLowerCase();
  return _CRIMINAL_INST_KW.some((kw) => n.includes(kw));
};

/**
 * Heuristic service→category classifier. `A` is the service name, `S` the
 * institution name. The explicit SERVICE_CATEGORY_MAP wins; otherwise this
 * long keyword-ternary falls through to a category, finally landing on the
 * institution's INSTITUTION_DEFAULT_CATEGORY (or 'equipment'). Pure: same
 * inputs always yield the same category.
 */
export const categorizeService = (A, S) => {
  const y = A.toLowerCase(),
    v = S.toLowerCase();
  // Explicit lookup first — covers all 260 known services unambiguously
  const _mapped = SERVICE_CATEGORY_MAP[A];
  if (_mapped) return _mapped;
  return y === 'lodging' ||
    y.includes('lodging') ||
    y.includes('accommodation') ||
    y.includes('all grades') ||
    y.includes('rooms for') ||
    y.includes('common room') ||
    y.includes('private suite')
    ? 'lodging'
    : (v.includes('inn') || v.includes('tavern')) &&
        (y.includes('meals') || y.includes('drink') || y.includes('ale') || y.includes('food and'))
      ? 'food'
      : v.includes('inn') || v.includes('tavern') || v.includes('hospitality')
        ? y.includes('entertainment') ||
          y.includes('performance') ||
          y.includes('games') ||
          y.includes('companionship') ||
          y.includes('music')
          ? 'entertainment'
          : y.includes('hiring hall')
            ? 'employment'
            : 'lodging'
        : y.includes('grain mill') ||
            y.includes('milling') ||
            y.includes('flour') ||
            y.includes('bread') ||
            y.includes('meals') ||
            y.includes('food') ||
            y.includes('drink') ||
            y.includes(' ale') ||
            y === 'ale' ||
            y.includes('ale and') ||
            y.includes('dining')
          ? 'food'
          : y.includes('fence') ||
              y.includes('contraband') ||
              y.includes('stolen') ||
              y.includes('smuggl') ||
              y.includes('forgery') ||
              y.includes('black market') ||
              y.includes('protection racket') ||
              y.includes('safe house') ||
              y.includes('burglary') ||
              y.includes('contract killing') ||
              y.includes('intimidation') ||
              y.includes('money launder') ||
              y.includes('hidden market') ||
              y.includes('unregistered lodging') ||
              y.includes('discretion') ||
              y.includes('guild membership') ||
              y.includes('untaxed') ||
              y.includes('restricted goods') ||
              y.includes('arcane underground') ||
              y.includes('competitive pricing') ||
              y.includes('mercenary alignment') ||
              y.includes('unlicensed tables') ||
              y.includes('loans (at interest)') ||
              v.includes('thieves') ||
              v.includes('assassin') ||
              v.includes('black market') ||
              v.includes('smuggling') ||
              v.includes('criminal') ||
              v.includes('underground city') ||
              v.includes('front business')
            ? 'criminal'
            : (y.includes('weapon') && !y.includes('weapon enchant')) ||
                y.includes('armour') ||
                y.includes('armor') ||
                y.includes('horseshoe') ||
                y.includes('tool repair') ||
                y.includes('equipment') ||
                (y.includes('siege') && !y.includes('siege specialist')) ||
                y.includes('engraving') ||
                y.includes('inscription') ||
                y.includes('jewellery') ||
                y.includes('jewelry') ||
                y.includes('precious metal') ||
                y.includes('repair and') ||
                y.includes('commissions') ||
                y.includes('craftsmen') ||
                y.includes('bespoke') ||
                y.includes('quality goods') ||
                y.includes('master-quality') ||
                y.includes('processed textile') ||
                y.includes('dyed cloth') ||
                y.includes('woven cloth') ||
                y.includes('finished fabric')
              ? 'equipment'
              : y.includes('spell') ||
                  y.includes('magic') ||
                  y.includes('potion') ||
                  y.includes('enchant') ||
                  y.includes('scroll') ||
                  y.includes('alch') ||
                  y.includes('planar') ||
                  y.includes('arcane') ||
                  y.includes('weapon enchant') ||
                  y.includes('identification') ||
                  y.includes('teleport') ||
                  y.includes('dispel') ||
                  y.includes('remove curse') ||
                  y.includes('curse removal') ||
                  y.includes('ward') ||
                  y.includes('warding')
                ? 'magic'
                : y.includes('medical') ||
                    y.includes('healing') ||
                    y === 'cure' ||
                    y.startsWith('cure ') ||
                    y.includes(' cure') ||
                    y.includes('cured') ||
                    y.includes('curing') ||
                    y.includes('antitoxin') ||
                    y.includes('antidote') ||
                    (y.includes('tonic') && !y.includes('tectonic')) ||
                    y.includes('salve') ||
                    y.includes('surgery') ||
                    y.includes('quarantine') ||
                    y.includes('restoration') ||
                    y.includes('physician') ||
                    y.includes('sick') ||
                    y.includes('wounded') ||
                    y.includes('religious service') ||
                    y.includes('last rites') ||
                    y.includes('medical care') ||
                    y.includes('treatment') ||
                    y.includes('child placement') ||
                    y.includes('foundling') ||
                    y === 'sanctuary' ||
                    y.includes('last rites')
                  ? 'healing'
                  : y.includes('performance') ||
                      y.includes('entertainment') ||
                      y.includes('gladiatorial') ||
                      y.includes('games of chance') ||
                      y.includes('licensed tables') ||
                      y.includes('unlicensed tables') ||
                      y.includes('companionship') ||
                      y.includes('theatrical') ||
                      y.includes('music') ||
                      y.includes('bard') ||
                      y.includes('enter as combatant') ||
                      y.includes('private performance') ||
                      y.includes('public performance') ||
                      y.includes('high-stakes gambling') ||
                      y.includes('high stakes gambling') ||
                      y.includes('public games')
                    ? 'entertainment'
                    : [
                          'horse rental',
                          'cart rental',
                          'ship passage',
                          'passage (',
                          'teleportation to',
                          'coach',
                          'ferry',
                          'mounted',
                          'carriage',
                          'short passage',
                          'deep-water passage',
                          'convoy authorization',
                          'cargo shipping',
                          'naval escort',
                          'scheduled freight',
                          'freight run',
                          'freight haulage',
                          'freight contract',
                          'convoy assembly',
                          'convoy escort',
                          'armed escort contracting',
                          'route intelligence',
                          'route information',
                          'road intelligence',
                          'bonded freight',
                          'cargo staging',
                          'pack animal rental',
                          'carter hire',
                          'passenger river passage',
                          'river pilot',
                          'charter barge',
                          'towpath',
                          'upriver',
                          'downriver',
                          'river crossing',
                          'river craft',
                          'scheduled coach',
                          'coach departure',
                          'coach hire',
                          'private coach',
                          'passenger lodging',
                          'stabling',
                          'navigation consultation',
                          'coastal chart',
                          'sea route',
                          'commercial dispute resolution',
                        ].some((j) => y.includes(j)) ||
                        v.includes('carrier') ||
                        v.includes('caravan') ||
                        v.includes('barge') ||
                        v.includes('coaching') ||
                        v.includes('ferry') ||
                        v.includes('boatyard') ||
                        v.includes('transport')
                      ? 'transport'
                      : y.includes('cargo handling') ||
                          y.includes('cargo loading') ||
                          y.includes('bonded storage') ||
                          y.includes('staging and distribution') ||
                          y.includes('goods storage') ||
                          y.includes('warehouse') ||
                          y.includes('vault') ||
                          y.includes('secure storage') ||
                          y.includes('deposit') ||
                          y.includes('letters of credit') ||
                          y.includes('insurance') ||
                          y.includes('wealth management') ||
                          y.includes('trade financing') ||
                          y.includes('currency exchange') ||
                          y.includes('money changing')
                        ? 'legal'
                        : y.includes('planar') || y.includes('extraplanar') || y.includes('draconic')
                          ? 'magic'
                          : y.includes('monster component') ||
                              y.includes('monster intelligence') ||
                              y.includes('commission hunting') ||
                              y.includes('processing and preserv') ||
                              y.includes('guard animals') ||
                              y.includes('companion training') ||
                              y.includes('messenger beast') ||
                              y.includes('reagent sourcing') ||
                              y.includes('labour hire') ||
                              y.includes('golem') ||
                              y.includes('undead') ||
                              y.includes('night watch') ||
                              y.includes('corpse processing') ||
                              y.includes('precision fabrication') ||
                              y.includes('guard deployment') ||
                              y.includes('apprenticeship program') ||
                              y.includes('metalworking training') ||
                              y.includes('hiring hall') ||
                              (y.includes('hire') &&
                                (y.includes('guard') ||
                                  y.includes('muscle') ||
                                  y.includes('worker') ||
                                  y.includes('servant')))
                            ? 'employment'
                            : y.includes('healing (1st') ||
                                y.includes('utility magic') ||
                                y.includes('greater restoration') ||
                                y.includes('true resurrection') ||
                                y.includes('restoration')
                              ? 'healing'
                              : y.includes('contract board') ||
                                  y.includes('rumour board') ||
                                  y.includes('rumor board') ||
                                  y.includes('monster intelligence') ||
                                  y.includes('emergency muster') ||
                                  y.includes('bounty board') ||
                                  y.includes('delve contract')
                                ? 'employment'
                                : y.includes('legal') ||
                                    y.includes('civil dispute') ||
                                    y.includes('notary') ||
                                    y.includes('contract') ||
                                    y.includes('trial') ||
                                    y.includes('property') ||
                                    y.includes('wealth management') ||
                                    y.includes('trade financ') ||
                                    y.includes('insurance') ||
                                    y.includes('vaulting') ||
                                    y.includes('letters of credit') ||
                                    y.includes('currency exchange') ||
                                    y.includes('money changing') ||
                                    y.includes('loans') ||
                                    y.includes('deposit') ||
                                    y.includes('arbitration') ||
                                    y.includes('certification') ||
                                    y.includes('genealog') ||
                                    y.includes('degree') ||
                                    y.includes('credential')
                                  ? 'legal'
                                  : y.includes('quest') ||
                                      y.includes('bounty') ||
                                      y.includes('hired muscle') ||
                                      y.includes('company contract') ||
                                      y.includes('mercenary') ||
                                      y.includes('guard for hire') ||
                                      y.includes('hiring hall') ||
                                      y.includes('party match') ||
                                      y.includes('siege specialist') ||
                                      y.includes('employment') ||
                                      y.includes('specialist warrior') ||
                                      y.includes('training service') ||
                                      y.includes('party registration') ||
                                      y.includes('patrol and escort') ||
                                      y.includes('escort') ||
                                      y.includes('threat reporting') ||
                                      y.includes('training yard') ||
                                      y.includes('military intelligence') ||
                                      y.includes('guard deployment') ||
                                      y.includes('guard animal') ||
                                      y.includes('guard hire') ||
                                      y.includes('convoy escort') ||
                                      y.includes('naval escort') ||
                                      y.includes('commission hunting') ||
                                      y.includes('labour hire') ||
                                      y.includes('companion training') ||
                                      y.includes('messenger beast') ||
                                      y.includes('contract board') ||
                                      y.includes('emergency muster') ||
                                      y.includes('monster bounty') ||
                                      y.includes('monster contract') ||
                                      y.includes('hired swords') ||
                                      y.includes('party registration') ||
                                      y.includes('rumour board') ||
                                      y.includes('rumor board') ||
                                      y.includes('monster intelligence') ||
                                      y.includes('bounty board') ||
                                      y.includes('delve contract') ||
                                      y.includes('charter contract')
                                    ? 'employment'
                                    : y.includes('research') ||
                                        y.includes('information') ||
                                        y.includes('rumour') ||
                                        y.includes('gossip') ||
                                        y.includes('record') ||
                                        y.includes('news') ||
                                        y.includes('history') ||
                                        y.includes('lore') ||
                                        y.includes('consultation') ||
                                        y.includes('intelligence') ||
                                        y.includes('monster') ||
                                        y.includes('library') ||
                                        (y.includes('text') && !y.includes('textile')) ||
                                        y.includes('scribal') ||
                                        y.includes('copying') ||
                                        y.includes('translation') ||
                                        y.includes('authentication') ||
                                        y.includes('rare text') ||
                                        y.includes('poor relief') ||
                                        y.includes('charity') ||
                                        y.includes('education') ||
                                        y.includes('news and') ||
                                        y.includes('price') ||
                                        (y.includes('apprenticeship') &&
                                          !y.includes('apprenticeship and training'))
                                      ? 'information'
                                      : y.includes('apprenticeship and training')
                                        ? 'employment'
                                        : y.includes('sanctuary') || y.includes('pilgrim') || y.includes('alms')
                                          ? 'healing'
                                          : y.includes('patrol and watch') ||
                                              y.includes('vagrancy') ||
                                              y.includes('textile labour') ||
                                              y.includes('member support')
                                            ? 'employment'
                                            : y.includes('trade regulation') ||
                                                y.includes('quality control') ||
                                                y.includes('quality standard') ||
                                                y.includes('trade facilit') ||
                                                y.includes('guild certif') ||
                                                y.includes('prisoner hold') ||
                                                y.includes('auction service')
                                              ? 'legal'
                                              : y.includes('discreet meeting')
                                                ? 'criminal'
                                                : v.includes('bank') || v.includes('banking')
                                                  ? 'legal'
                                                  : v.includes('church') ||
                                                      v.includes('temple') ||
                                                      v.includes('parish') ||
                                                      v.includes('cathedral') ||
                                                      v.includes('monastery') ||
                                                      v.includes('healer')
                                                    ? 'healing'
                                                    : v.includes('court')
                                                      ? 'legal'
                                                      : v.includes('university') ||
                                                          v.includes('academy') ||
                                                          v.includes('library')
                                                        ? 'information'
                                                        : (v.includes('inn') ||
                                                              v.includes('tavern') ||
                                                              v.includes('hospitality')) &&
                                                            !y.includes('hiring hall')
                                                          ? 'lodging'
                                                          : y.includes('hiring hall')
                                                            ? 'employment'
                                                            : v.includes('smith') ||
                                                                v.includes('craft') ||
                                                                v.includes('guild')
                                                              ? 'equipment'
                                                              : y.includes('estate sale')
                                                                ? 'legal'
                                                                : y.includes('bookmaking') ||
                                                                    y.includes('public game')
                                                                  ? 'entertainment'
                                                                  : y.includes('investigation service') ||
                                                                      y.includes('message relay')
                                                                    ? 'information'
                                                                    : y.includes('textile labour') ||
                                                                        y.includes(
                                                                          'apprenticeship and training'
                                                                        ) ||
                                                                        y.includes('siege specialist')
                                                                      ? 'employment'
                                                                      : y.includes('processed textile') ||
                                                                          y.includes('trade goods for export')
                                                                        ? 'equipment'
                                                                        : y.includes('party match') ||
                                                                            y.includes('referral')
                                                                          ? 'employment'
                                                                          : y.includes('textile') ||
                                                                              y.includes('fabric') ||
                                                                              y.includes('cloth') ||
                                                                              y.includes('garment') ||
                                                                              y.includes('fur ') ||
                                                                              y.includes('hide') ||
                                                                              y.includes('leather') ||
                                                                              y.includes('tanning') ||
                                                                              y.includes('metalwork') ||
                                                                              y.includes('pottery') ||
                                                                              y.includes('ceramic') ||
                                                                              y.includes('glasswork') ||
                                                                              y.includes('woodwork') ||
                                                                              y.includes('carpentry') ||
                                                                              y.includes('furniture') ||
                                                                              y.includes('chandler') ||
                                                                              y.includes('candle') ||
                                                                              y.includes('ropemaking') ||
                                                                              y.includes('cooperage') ||
                                                                              y.includes('barrel') ||
                                                                              y.includes('processed') ||
                                                                              y.includes('manufactured') ||
                                                                              y.includes('crafted') ||
                                                                              y.includes('forged') ||
                                                                              y.includes('commissioned') ||
                                                                              y.includes('bespoke') ||
                                                                              y.includes('powder') ||
                                                                              y.includes('flash') ||
                                                                              y.includes('smoke')
                                                                            ? 'equipment'
                                                                            : y.includes(
                                                                                  'high-stakes gambling'
                                                                                ) ||
                                                                                y.includes('high stakes gambling')
                                                                              ? 'entertainment'
                                                                              : y.includes('weapon enchant') ||
                                                                                  y.includes('magical weapon')
                                                                                ? 'magic'
                                                                                : INSTITUTION_DEFAULT_CATEGORY[
                                                                                    S
                                                                                  ] || 'equipment';
};
