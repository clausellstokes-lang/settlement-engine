/**
 * data/rareSecrets.js — THE VERY RARE SECRETS (SECRETS-1, 2026-11-17; the owner's eleven messages of that morning, the
 * chair's ruling RS1 and its widenings, `docs/chair/2026-11-14/briefs/BRIEF-SECRETS-1.md`). DATA ONLY: the rows in their
 * five families, each with its conditions, and ONE table of odds. Every word of every row is the brief's (the owner's own
 * examples marked `owner: true`, the rest the chair's to the owner's benchmark); the deal is
 * `src/generators/people/rareSecrets.js :: dealRareSecrets`, and the law that holds it is
 * `tests/generators/rareSecretsLaw.test.js`. Each row and each odd is on the owner's veto list.
 *
 * A ROW: `{ key, what, stakes }` in the card's own shape (`secret.what`, `secret.stakes`; no closing full stop), and
 *   owner      the row is from the owner's own example
 *   magic      MAGIC ONLY: dealt only where the generation's world law holds that magic functions
 *              (`generationContext.js :: resolveGenerationWorldLaw(...).magicFunctions()`)
 *   needs / excludes  what the PLACE must hold or must not, in the fact vocabulary's own atoms
 *              (`domain/facts/factVocabulary.js`), enforced by the declared door (`filterDeclared`)
 *   holder     what the PERSON must be, read from the card (the closed keys of `HOLDER_KEYS` below)
 *   names      a person ON the page the row names by name: 'superior' fills `{superior}`; 'other' and 'younger' fill
 *              `{target}` (another named adult of the roster, picked by the seed; 'younger' a generation younger)
 * Adding a row is one entry and its conditions (the brief: "a row is data").
 */

/** The five families, in the order the deal takes them (a person carries at most one: the first family stands). */
export const RARE_SECRET_FAMILIES = Object.freeze(['deeds', 'natures', 'ties', 'masters', 'outsiders']);

/**
 * THE ODDS (the chair's form, told to the owner; the owner turns each). `perPerson`: the chance that one eligible named
 * person carries one of the family (never more than one of a family in a place). `perPlace`: the chance that the place
 * holds one of the family (one person in it). `tiers`: the sizes the family may stand in (all, when absent).
 */
export const RARE_SECRET_ODDS = Object.freeze({
  deeds: Object.freeze({ perPerson: 1 / 200 }),
  natures: Object.freeze({ perPerson: 1 / 200 }),
  ties: Object.freeze({ perPerson: 1 / 200 }),
  masters: Object.freeze({ perPlace: 1 / 40, tiers: Object.freeze(['thorp', 'hamlet', 'village']) }),
  outsiders: Object.freeze({ perPlace: 1 / 60 }),
});

/**
 * THE HOLDER'S KEYS (closed; the guard refuses a row with any other):
 *   age        'ofYears' (never the youngest band, `NPC_AGE_DATA.young`), 'old' (the eldest band), 'notOld' (never it)
 *   not        offices the person must NOT hold: 'head' (first of the governing power), 'elder' (an elder's office:
 *              Elder, Headman, the eldest), 'hereditary' (a title of blood, or a noble of the page), 'knownFromBirth'
 *              (kin on the page, an elder's office or a title of blood)
 *   office     offices the person MUST hold ('head')
 *   keepsHouse the person is the face of a house of their own (`institution.kind === 'house'`)
 *   roles      the person's role holds one of these words (whole words, lower case); with `category`, either answers
 *   category   the person's card category is one of these
 *   notRoles   the person's role holds none of these words; `notCategory` their category is none of these; `notHouses`
 *              their house's name holds none of these words
 *   deniedBy   the engine's own trait words (temperament, flaw, modifier, disposition) the row never stands beside
 */
export const HOLDER_KEYS = Object.freeze(['age', 'not', 'office', 'keepsHouse', 'roles', 'category', 'notRoles', 'notCategory', 'notHouses', 'deniedBy']);

const f = Object.freeze;
/** The words of deceit the engine's temperaments of truth refuse (npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT's honest four). */
const TRUTHFUL = f(['honest', 'plain-dealing', 'candid', 'forthright']);
/** The roles and houses that work a fire (forge, kiln, oven, furnace). */
const FIRE_ROLES = f(['smith', 'metalworker', 'smelt', 'baker', 'potter', 'glassmaker', 'brickmaker', 'collier', 'mint']);
const FIRE_HOUSES = f(['blacksmith', 'blacksmiths', 'smelter', 'bakers', 'bakery', 'potter', 'pottery', 'glassblower', 'glassworks', 'brickmaker', 'charcoal', 'kiln', 'kilns', 'forge', 'foundry', 'mint']);
/** The trades of touch, of taste, of letters, of blood. */
const TOUCH_ROLES = f(['healer', 'midwife', 'bath-keeper', 'barber', 'madam', 'keeper of the house', 'keeper of the houses']);
const TASTE_ROLES = f(['cook', 'baker', 'brewer', 'brewster', 'alewife', 'vintner', 'apothecary', 'innkeeper', 'tavern keeper', 'coaching-inn keeper']);
const LETTER_ROLES = f(['scribe', 'clerk', 'teacher', 'chronicler', 'librarian', 'sage', 'cartographer', 'printer', 'college master', 'dean', 'chancellor', 'postmaster', "post's master", 'message-master']);
const BLOOD_ROLES = f(['healer', 'barber', 'butcher', 'midwife', 'hunt', 'hunter', 'militia', 'watch', 'garrison', 'castellan', 'captain', 'marshal', 'lanista', 'arena', 'killer', "hospital's master"]);
const DECEIT_ROLES = f(['fortune teller', 'front man', 'nominal owner', 'whisper broker', 'fixer', 'fence', 'smuggler']);

/** THE DEEDS (dark things done or meant). */
export const RARE_DEEDS = f([
  f({ key: 'killer', owner: true, what: 'Has killed more than once, and no one has connected the deaths', stakes: 'The deaths are still counted as separate misfortunes; one person laying them side by side would end that', needs: f(['tier: ≥ town']), holder: f({ deniedBy: f(['merciful', 'compassionate']) }) }),
  f({ key: 'superior', owner: true, what: 'Means to kill {superior}, and has worked out how', stakes: 'If {superior} learns of it first, only one of them walks away', names: 'superior', holder: f({ deniedBy: f(['loyal']) }) }),
  f({ key: 'spouse', what: 'Has been giving their own spouse a little poison each week, and is patient about it', stakes: 'Any healer who looks closely will know the signs', needs: f(['tier: ≥ village']), holder: f({ deniedBy: f(['merciful', 'compassionate', 'warm-hearted']) }) }),
  f({ key: 'floor', what: 'Has a body buried under their own floor', stakes: "The missing one's kin have never stopped asking", needs: f(['tier: ≥ hamlet']) }),
  f({ key: 'hired', what: 'Has taken coin to kill {target}, and has not yet decided to refuse', stakes: 'Whoever paid expects it done, and {target} suspects nothing', needs: f(['tier: ≥ town']), names: 'other', holder: f({ deniedBy: f(['incorruptible']) }) }),
  f({ key: 'felon', owner: true, what: 'Is wanted for a crime in another town, and came here to be forgotten', stakes: 'A traveller from there would know the face', holder: f({ not: f(['head', 'hereditary', 'elder']) }) }),
  f({ key: 'demon', owner: true, magic: true, what: 'Made a bargain with a demon, and the price has not yet been named', stakes: 'It will be named at the worst hour', holder: f({ deniedBy: f(['pious']) }) }),
  f({ key: 'drowned', what: 'Let a rival drown and has told it as a failed rescue ever since', stakes: 'One other person was on the bank that day', holder: f({ deniedBy: TRUTHFUL }) }),
  f({ key: 'sellsSecrets', what: 'Sells what is said here in private to someone outside, a letter at a time', stakes: 'The letters are kept, and not by them', needs: f(['tier: ≥ village']), excludes: f(['route: isolated']), holder: f({ deniedBy: f(['loyal', 'incorruptible']) }) }),
  f({ key: 'arson', what: 'Set the fire that everyone here calls an accident', stakes: 'One person saw them walk away from it' }),
  f({ key: 'deserter', what: 'Deserted an army with its pay chest, and has spent almost none of it', stakes: 'The army hangs deserters, and thieves twice', holder: f({ deniedBy: f(['loyal', 'incorruptible']) }) }),
  f({ key: 'falseHeir', what: 'Holds what they hold on a forged will, and the true heir is alive', stakes: 'The forger is still being paid, and has begun to ask for more', holder: f({ keepsHouse: true, deniedBy: TRUTHFUL }) }),
  f({ key: 'robbedDead', what: 'Robbed a dying traveller on the road and left them there', stakes: 'The traveller did not die', excludes: f(['route: isolated']), holder: f({ deniedBy: f(['merciful', 'compassionate', 'honest']) }) }),
  f({ key: 'oathBreaker', what: 'Swore to protect someone and stood aside when it mattered', stakes: 'The one they failed has kin who keep count', holder: f({ deniedBy: f(['loyal', 'steadfast', 'protective']) }) }),
  f({ key: 'blackmailer', what: 'Is bleeding {target} for coin over a thing done long ago', stakes: '{target} has begun to wonder whether another way would be cheaper', needs: f(['tier: ≥ town']), names: 'other', holder: f({ deniedBy: f(['principled', 'generous']) }) }),
  f({ key: 'graveRobber', what: 'Digs up the newly buried for what was buried with them', stakes: 'The last grave had more kin than they thought', needs: f(['tier: ≥ village']), holder: f({ deniedBy: f(['pious']) }) }),
  f({ key: 'counterfeit', what: 'Clips and re-casts coin in a back room, a little at a time', stakes: 'A money-changer has started weighing every coin that comes from here', needs: f(['tier: ≥ town']), holder: f({ deniedBy: f(['honest', 'incorruptible', 'plain-dealing']) }) }),
  f({ key: 'cursed', magic: true, what: 'Called a curse down on a neighbour, and it worked', stakes: 'Curses of that kind are paid for twice', needs: f(['tier: ≥ hamlet']), holder: f({ deniedBy: f(['merciful', 'compassionate']) }) }),
  f({ key: 'falseWitness', what: 'Sent an innocent to the gallows with a lie, and watched', stakes: 'The one who truly did it knows who lied', needs: f(['tier: ≥ town']), holder: f({ deniedBy: f([...TRUTHFUL, 'fair-minded']) }) }),
  f({ key: 'leftForDead', what: 'Left a partner for dead in the wilds and came home with both shares', stakes: 'The partner has been seen alive', holder: f({ deniedBy: f(['loyal']) }) }),
  f({ key: 'raisedDead', magic: true, what: 'Raised something from a grave, once, and could not put it back', stakes: 'It has been seen at the edge of the fields', needs: f(['tier: ≥ hamlet']) }),
]);

/** THE NATURES (a hidden way a person is made; none names another person). */
export const RARE_NATURES = f([
  f({ key: 'cold', owner: true, what: 'Feels nothing for other people and has learned to act as though they do', stakes: 'Everyone close to them has seen the act slip once, and no two of them have compared what they saw', needs: f(['tier: ≥ village']) }),
  f({ key: 'counting', owner: true, what: 'Cannot leave a thing uneven: counts, straightens and checks again, and hides how much of the day it takes', stakes: 'Those who have noticed think it harmless; it costs them more each year', holder: f({ deniedBy: f(['lazy', 'reckless']) }) }),
  f({ key: 'givesUp', owner: true, what: 'Is only at ease when giving something up for someone else, and goes looking for the chance', stakes: 'Anyone who sees it can have whatever they ask for', holder: f({ deniedBy: f(['greedy', 'self-serving', 'corrupt']) }) }),
  f({ key: 'noPain', owner: true, what: 'Feels no pain, heat or cold, and has never told anyone', stakes: 'A wound they do not notice will one day be the one that matters' }),
  f({ key: 'remembers', what: 'Forgets nothing: every face, every word, every slight, whether they want it or not', stakes: 'People who have forgotten what they said in front of them should not have' }),
  f({ key: 'noFaces', what: 'Cannot tell one face from another, and knows people by voice and walk', stakes: 'Anyone who learned it could stand in front of them as someone else', holder: f({ deniedBy: f(['perceptive']) }) }),
  f({ key: 'noSleep', what: 'Has not slept a whole night in years, and does not let it show', stakes: 'It is beginning to show' }),
  f({ key: 'noTouch', what: 'Cannot bear to be touched, and has built a life that hides it', stakes: 'One crowded room, one friendly hand, and it would be plain to everyone', holder: f({ notRoles: TOUCH_ROLES }) }),
  f({ key: 'xenophobe', owner: true, what: 'Distrusts anyone not born here, and hides it behind good manners', stakes: 'It decides more of their dealings than anyone has noticed' }),
  f({ key: 'fireFear', owner: true, what: 'Survived a fire and cannot stand near an open flame', stakes: 'The day they must cross one, everyone will see', holder: f({ notRoles: FIRE_ROLES, notHouses: FIRE_HOUSES }) }),
  f({ key: 'gambler', owner: true, what: 'Is far better at dice and cards than anyone here knows', stakes: 'The people they have been quietly winning from are starting to count' }),
  f({ key: 'growsYounger', owner: true, magic: true, what: 'Was born old and grows younger each year, and no one here has known them long enough to notice', stakes: 'In a few more years the questions will start', holder: f({ not: f(['elder', 'hereditary', 'knownFromBirth']) }) }),
  f({ key: 'cannotLie', what: 'Cannot tell a lie, not even a kind one, and has built a life in which no one asks the wrong question', stakes: 'The wrong question is coming', holder: f({ deniedBy: f(['deceitful', 'mendacious', 'corrupt', 'hypocritical', 'manipulative']), notRoles: DECEIT_ROLES, notCategory: f(['criminal']) }) }),
  f({ key: 'sleepwalks', what: 'Walks in their sleep, and has woken in places they do not remember reaching', stakes: 'Something went missing on one of those nights' }),
  f({ key: 'noFear', what: 'Has never once felt fear, and has learned to imitate it so as not to alarm people', stakes: 'The day they do not flinch, someone will remember it', holder: f({ deniedBy: f(['cowardly', 'paranoid']) }) }),
  f({ key: 'voices', what: 'Hears a voice that no one else hears, and has learned not to answer it in company', stakes: 'The day they answer it aloud, people will decide what they are' }),
  f({ key: 'hoards', what: 'Cannot throw anything away, and the back rooms are full to the rafters', stakes: 'One spark, or one curious visitor' }),
  f({ key: 'luck', magic: true, what: 'Has never lost a wager, a coin toss or a drawn lot, and is frightened of what that means', stakes: 'Others have started to bet on them' }),
  f({ key: 'noTaste', what: 'Cannot taste or smell anything, and has hidden it for years', stakes: 'The day something spoils, they will be the last to know', holder: f({ notRoles: TASTE_ROLES }) }),
  f({ key: 'afraidDark', what: 'Cannot bear the dark, and burns a light all night at a cost they can ill afford', stakes: 'The night the oil runs out, someone will hear' }),
  f({ key: 'twoPeople', what: "Is two people by turns, and neither remembers the other's days", stakes: "One of them has made promises the other will have to keep" }),
  f({ key: 'cannotRead', what: 'Cannot read a word, and hides it behind a good memory and a trusted helper', stakes: 'The helper has started to ask for more', holder: f({ notRoles: LETTER_ROLES, deniedBy: f(['scholarly']) }) }),
  f({ key: 'bloodFaint', what: 'Faints at the sight of blood, and has arranged never to be seen near it', stakes: 'The day someone is hurt in front of them, it will be known', holder: f({ notRoles: BLOOD_ROLES, notCategory: f(['military']) }) }),
  f({ key: 'foresees', magic: true, what: 'Dreams of things before they happen, and has stopped telling anyone', stakes: 'The last dream was about this place' }),
  f({ key: 'beastSpeech', magic: true, what: 'Understands what animals say, and wishes they did not', stakes: 'The dogs here know something' }),
  f({ key: 'ageless', magic: true, what: 'Has not aged a day in forty years, and moves on before people count', stakes: 'They have stayed here too long already', holder: f({ not: f(['elder', 'hereditary', 'knownFromBirth']) }) }),
  f({ key: 'takes', what: 'Takes small things without meaning to, and returns most of them', stakes: 'One thing they took cannot be returned', holder: f({ deniedBy: f(['honest', 'incorruptible']) }) }),
  f({ key: 'laughs', what: 'Laughs when they are afraid, and has paid for it more than once', stakes: 'The next time will be the wrong time', holder: f({ deniedBy: f(['unflappable']) }) }),
]);

/** THE TIES AND THE BLOOD (who the person is to others, or what runs in them). */
export const RARE_TIES = f([
  f({ key: 'brothersWife', owner: true, what: "Is in love with their brother's wife, and has never said so", stakes: 'A word of it would break the family' }),
  f({ key: 'bastard', owner: true, what: 'Is the unacknowledged child of a former lord of this place, and can prove it', stakes: 'The ruling house would rather the proof did not exist', needs: f(['ruler: lord']), holder: f({ not: f(['head', 'hereditary']) }) }),
  f({ key: 'harem', owner: true, what: 'Belongs to a harem kept out of sight, and has been told to find it one more', stakes: 'The one they have chosen has not been asked yet', needs: f(['tier: ≥ town']) }),
  f({ key: 'ghost', owner: true, magic: true, what: 'Their closest friend is a ghost, and they talk every night', stakes: 'Those who overhear think they talk to themselves; one of them has started to listen' }),
  f({ key: 'godBlood', owner: true, magic: true, what: 'Is descended from a god, and has started to dream of what it wants', stakes: 'Believers would either crown them or bury them' }),
  f({ key: 'dragonBlood', owner: true, magic: true, what: "Carries a dragon's blood, and it has begun to show", stakes: 'There are people who pay well for word of such blood' }),
  f({ key: 'lastHeir', what: 'Is the last living heir of a house everyone believes ended, and has told no one', stakes: 'The ones who ended it would finish the work', holder: f({ not: f(['hereditary']) }) }),
  f({ key: 'twoMarriages', what: 'Is married in two places, and each household believes it is the only one', stakes: 'The two places trade with each other', excludes: f(['route: isolated']) }),
  f({ key: 'foundling', what: "Is raising as their own a child left on the step, and the child's true kin have started to ask", stakes: 'The kin are not people who ask twice' }),
  f({ key: 'changeling', magic: true, what: 'Is not the child their parents bore, and has known it since they could speak', stakes: 'The ones who made the exchange keep accounts' }),
  f({ key: 'twin', what: 'Has a twin no one here knows of, who has already been mistaken for them once', stakes: 'The twin is not a careful person' }),
  f({ key: 'parentOf', what: 'Is the true parent of {target}, and {target} does not know', stakes: 'One other person knows, and has been patient so far', names: 'younger' }),
  f({ key: 'lovesNamed', what: 'Is in love with {target}, and would sooner die than have it known', stakes: '{target} has started to notice', names: 'other' }),
  f({ key: 'swornOrder', what: 'Is sworn to an order that has no name here, and is still waiting for its word', stakes: 'The word, when it comes, will not be a small thing' }),
  f({ key: 'highBirth', what: 'Is of far higher birth than they let on, and left it behind on purpose', stakes: 'The family has not stopped looking', holder: f({ not: f(['hereditary']) }) }),
  f({ key: 'exile', what: 'Was cast out by their own people for a thing they will not name', stakes: 'Anyone from there would be bound to act on sight' }),
  f({ key: 'widowOf', what: 'Is the widow or widower of someone this place put to death, and has never said so', stakes: 'They have not forgiven it', needs: f(['tier: ≥ town']), holder: f({ deniedBy: f(['merciful']) }) }),
  f({ key: 'fey', magic: true, what: 'Owes a year of service to something in the woods, and the year has not yet been called in', stakes: 'It will be called in without warning' }),
  f({ key: 'moonChanged', magic: true, what: 'Is not themselves when the moon is full, and locks the door from the inside', stakes: 'The lock is getting old' }),
  f({ key: 'feyReplaced', owner: true, magic: true, what: 'Is not the person everyone remembers: a fey thing ate that one and has worn the face ever since', stakes: 'It has the memories, but not all of them, and someone has begun to test it' }),
  f({ key: 'firstWord', owner: true, what: 'Will fall in love, at once and completely, with the first newcomer who speaks to them', stakes: 'They will not hide it well, and it will not pass' }),
]);

/** THE HIDDEN MASTERS (only in a thorp, a hamlet or a village; the counterpart of the person's OWN trade, never a youth). */
export const RARE_MASTERS = f([
  f({ key: 'masterSmith', owner: true, what: 'Is a master armourer in hiding, and shoes horses here so that no one asks', stakes: 'Anyone who has seen their old work would know the hand at once', holder: f({ age: 'ofYears', roles: f(['smith', 'farrier']) }) }),
  f({ key: 'masterHealer', what: 'Was physician to a great house, and treats sprains and fevers here so that no one asks', stakes: 'They left after a death that was never explained, and someone is still looking', holder: f({ age: 'ofYears', roles: f(['healer', 'midwife', 'barber']) }) }),
  f({ key: 'masterCook', what: "Once cooked for a great lord's table, and hides how good they are", stakes: 'One feast would give them away', holder: f({ age: 'ofYears', roles: f(['cook', 'baker', 'innkeeper', 'tavern keeper', 'coaching-inn keeper', 'waystation keeper']) }) }),
  f({ key: 'masterBuilder', what: 'Built siege works for an army, and mends carts and roofs here so that no one asks', stakes: 'The army that lost to those works has not forgotten the builder', holder: f({ age: 'ofYears', roles: f(['carpenter', 'mason', 'wheelwright', 'builder', 'thatcher']) }) }),
  f({ key: 'masterBlade', what: "Was captain of a great lord's guard, and came here so that no one would ask them to fight again", stakes: 'The day the place is threatened, everyone will see what they are', holder: f({ age: 'ofYears', roles: f(['hunter', 'hunt', 'guard', 'watch captain', 'watcher', 'militia captain', 'militia']) }) }),
  f({ key: 'masterTutor', what: 'Was tutor to a noble heir, and keeps tallies here so that no one asks', stakes: 'The heir, grown, would know them at a glance', holder: f({ age: 'ofYears', roles: f(['scribe', 'clerk', 'teacher']) }) }),
  f({ key: 'masterTailor', what: 'Once dressed a great court, and mends workaday cloth here so that no one asks', stakes: 'A single fine seam would start the questions', holder: f({ age: 'ofYears', roles: f(['tailor', 'weaver', 'dyer']) }) }),
  f({ key: 'masterTrader', what: 'Once ran a trading house in a great city, and walked away from it', stakes: 'The partners they left behind are still owed an answer', holder: f({ age: 'ofYears', roles: f(['trader', 'pedlar', 'shopkeeper', 'pawnbroker', 'chandler', 'outfitter', 'merchant']) }) }),
  f({ key: 'masterSoldier', what: 'Once led soldiers in a war people still talk about, and works the land here so that no one asks', stakes: 'Some who followed them, and some who fought them, are still alive', holder: f({ age: 'ofYears', roles: f(['farmer', 'dairy farmer', 'herder', 'shepherd', 'labourer']) }) }),
  f({ key: 'masterWizard', magic: true, what: 'Was a court wizard, and has not cast a spell since the day they left', stakes: 'The first spell would be felt by people who are listening for it', holder: f({ age: 'ofYears' }) }),
  f({ key: 'masterCaptain', what: 'Was master of a great ship, and works a small boat here so that no one asks', stakes: 'Sailors remember a captain who lost a ship', holder: f({ age: 'ofYears', roles: f(['fisher', 'boatman', 'ferryman', 'ferry keeper', 'boat-master', 'boat-headman', 'barge master']) }) }),
  f({ key: 'masterRider', what: "Trained a great lord's warhorses, and minds plough horses here so that no one asks", stakes: 'Any horse-dealer passing through would know the name', holder: f({ age: 'ofYears', roles: f(['groom', 'ostler', 'drover', 'stablehand', 'stable master', 'horse-coper']) }) }),
  f({ key: 'masterPriest', what: 'Stood high in a great temple, and keeps a small shrine here so that no one asks', stakes: 'The temple does not forgive those who leave', holder: f({ age: 'ofYears', roles: f(['priest', 'shrine keeper']) }) }),
  f({ key: 'masterSinger', what: 'Once sang for courts, and sings for suppers here so that no one asks', stakes: 'There is a song about why they stopped, and someone here knows it', holder: f({ age: 'ofYears', roles: f(['minstrel', 'storyteller', 'musician']) }) }),
  f({ key: 'masterCraft', what: 'Is a master of their craft far beyond this place, and sells plain work here so that no one asks', stakes: 'One fine piece, sold by mistake, would bring buyers and questions', holder: f({ age: 'ofYears', roles: f(['potter', 'carver', 'woodcarver', 'cooper', 'cobbler', 'tanner', 'brickmaker', 'ropemaker', 'glassmaker', 'jeweller', 'bowyer', 'sawyer']) }) }),
  f({ key: 'masterRuler', what: 'Once governed a city, and settles fence disputes here so that no one asks', stakes: 'The city did not let them go willingly', holder: f({ age: 'ofYears', office: f(['head']), roles: f(['elder', 'reeve', 'headman', 'eldest', 'eldest householder', 'household elder']) }) }),
  f({ key: 'masterThief', what: "Was the best lock-breaker of a great city's guild, and lifts nothing here so that no one asks", stakes: 'The guild believes they are dead, and would correct the error', holder: f({ age: 'ofYears', category: f(['criminal']) }) }),
  f({ key: 'masterPoisoner', what: "Was a great house's poisoner, and sells simples here so that no one asks", stakes: 'Three deaths at that house were never explained', holder: f({ age: 'ofYears', roles: f(['herbalist', 'apothecary']) }) }),
]);

/** THE OUTSIDERS (people who do not belong to this time or this world); any size of place. */
export const RARE_OUTSIDERS = f([
  f({ key: 'fourthWall', owner: true, what: "Knows they are a figure in someone's game, speaks of the one who runs it and the ones who play, and is not troubled at all", stakes: 'Now and then they are right about what happens next' }),
  f({ key: 'fromThePast', owner: true, magic: true, what: 'Belongs to an age three centuries gone, and is still learning what has changed', stakes: 'They know where something was buried, and it is still there' }),
  f({ key: 'fromTheFuture', owner: true, magic: true, what: 'Comes from years that have not happened yet, and is careful what they say about them', stakes: 'They know how something here ends' }),
  f({ key: 'regressor', owner: true, magic: true, what: 'Has lived these years once already, died at the end of them, and woke at the beginning to try again', stakes: 'They know who betrays whom, and are no longer sure it will go the same way' }),
  f({ key: 'otherWorld', owner: true, magic: true, what: 'Was pulled here from a world of machines and starlight, and still reaches for tools that do not exist', stakes: 'They talk in their sleep, and someone has been writing it down' }),
  f({ key: 'realWorld', owner: true, magic: true, what: 'Was someone else in a world where this one is a game, and woke here in a body that was not theirs', stakes: 'They remember the rules, and have started to use them' }),
  f({ key: 'loop', magic: true, what: 'Has lived this same year many times over, and is tired', stakes: 'This time they mean to do something different' }),
  f({ key: 'dreamer', what: 'Believes all of this is their own dream, and is waiting to wake', stakes: 'They take risks no waking person would' }),
  f({ key: 'returns', magic: true, what: 'Has died four times, and each time woken in their own bed the next morning', stakes: 'They no longer take the care they should' }),
  f({ key: 'statSight', magic: true, what: "Sees numbers over people's heads, and has learned what most of them mean", stakes: 'One number here is much higher than it should be' }),
  f({ key: 'riddler', owner: true, magic: true, what: 'Knows the answer to any question, and can give it only as a riddle', stakes: 'Every riddle so far has been true, and people have started bringing questions' }),
  f({ key: 'sameDay', owner: true, magic: true, what: 'Is living one day over and over, and will know a newcomer at first meeting as though they had met many times', stakes: 'By their second meeting the days have started moving again, and it is over' }),
]);

/** Every family's rows, by family. */
export const RARE_SECRET_ROWS = f({ deeds: RARE_DEEDS, natures: RARE_NATURES, ties: RARE_TIES, masters: RARE_MASTERS, outsiders: RARE_OUTSIDERS });
