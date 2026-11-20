/**
 * hookThemes.js — THE CLOSED HOOK-THEME VOCABULARY (wave HK-1,
 * docs/DESIGN_HOOK_NONREDUNDANCY.md §3).
 *
 * THE DEFECT THIS SERVES: the draw registry (hookVariety.js) stopped a settlement
 * emitting the SAME authored string twice, and the aggregator's exact-text +
 * echo-family layers stopped the same prose reading twice across tabs. Neither
 * sees the remaining case: two DIFFERENT authored strings telling the SAME BEAT
 * ("a hidden debt", worn by two different actors). Naming the beat is what makes
 * that case machine-visible, and a beat can only be named from a CLOSED
 * vocabulary (the finite-semantics law: typed buckets only, never free text and
 * never a model's opinion).
 *
 * WHAT THIS MODULE IS: a lookup, nothing else. `themeOfText(prose)` answers with
 * one member of HOOK_THEMES for prose that IS an authored template, and
 * `UNTYPED` for everything else. It never scores, never rewrites, never guesses.
 *
 * HK-LAW-3 — FREE PROSE IS NEVER THEME-JUDGED. The lookup is EXACT (modulo the
 * case/whitespace/edge-punctuation folding every hook key in this estate uses):
 * no prefix matching, no substring matching, no similarity. A DM's edited hook,
 * an AI-bucketed custom hook, and a legacy free string all answer `untyped`, and
 * the retention layer is required to leave `untyped` hooks alone. Machine taste
 * is not authorized over human prose, so the classifier must be incapable of
 * mistaking human prose for an authored template.
 *
 * WHY THIS FILE LIVES IN src/domain AND NOT src/generators (moved 2026-08-07).
 * It was authored under src/generators, but three of its five consumers are domain
 * modules (dossier/plotHooks.js, dossier/hookRetention.js, hookEscalation.js), and
 * those edges REDDENED tests/build/domainGeneratorsBoundary.js: the domain is the pure
 * kernel every other layer trusts, so it must not reach UP into generators. The cure
 * for that ratchet is inversion, never a widened baseline — and inversion is free here
 * because this module is a zero-import leaf that imports nothing from either layer. It
 * therefore moved DOWN to the layer that must not reach up; the two generator-side
 * consumers (npcGenerator.js, hookVariety.js) now reach DOWN into domain, which is the
 * already-established permitted direction. Nothing about the module's content changed.
 *
 * WHY THE TEMPLATES ARE SPELLED OUT HERE rather than derived by importing the
 * pools: this module is a ZERO-IMPORT LEAF. Its dossier-side consumers
 * (src/domain/dossier/**) would, by reaching into src/data/npcData.js, pull the
 * whole NPC data table across a chunk boundary they do not otherwise cross.
 * (HK-3 added a generator-side consumer too — hookVariety.js takes UNTYPED for
 * its draw registry — and the leaf property is what keeps that import free:
 * importing this module drags nothing behind it, in either direction.) The
 * duplication is not unguarded —
 * tests/lint/hookThemeTotality.walker.test.js asserts EXACT set equality in both
 * directions against the live pools, so an added, edited, or deleted template
 * reds the gate on the same commit that moves it. (Recorded per §3's
 * "implementer's pick per pool".)
 *
 * RELATIONSHIP TENSIONS ARE KEYED DIFFERENTLY (and deliberately). Relationship
 * tension prose is produced by CLOSURES that interpolate the two NPC names
 * (src/data/npcData.js STRESS_ECONOMIC_EFFECTS[*].tension via `pairProse`), so
 * the rendered string is never a fixed template and an exact-text key could
 * never match it. Those pools are therefore tagged at the ARCHETYPE KEY — the
 * stable id the generator already stamps onto every relationship as
 * `archetypeKey` — which is still an exact lookup on a closed key space, and is
 * the §3 arm for "inline where a pool already holds objects". The three tension
 * variants of one archetype are the SAME beat retold (that is what makes them
 * variants), so one theme per archetype is the correct grain.
 */

/**
 * THE CLOSED SET. Closure is the law; membership is owner-tunable (J-HK-3 —
 * the owner signs or amends this list at HK-1 review). Adding a member is a
 * vocabulary amendment; adding a FREE-TEXT theme is a design defect.
 * @type {readonly string[]}
 */
export const HOOK_THEMES = Object.freeze([
  'hidden_debt',
  'forbidden_love',
  'secret_identity',
  'divided_loyalty',
  'smuggling',
  'blackmail',
  'rivalry',
  'betrayal',
  'corruption',
  'succession',
  'faith_crisis',
  'vanished_person',
  'forbidden_knowledge',
  'old_wound',
  'looming_threat',
  'scarcity_pressure',
  'crime_ring',
  'outsider_suspicion',
  'ambition',
  'grief',
]);

/** The answer for prose that is not an authored template. NEVER a theme: the
 *  retention layer must treat it as "hands off" rather than as a bucket. */
export const UNTYPED = 'untyped';

/** @type {ReadonlySet<string>} */
const THEME_SET = new Set(HOOK_THEMES);

/**
 * Is this string a member of the closed vocabulary? (The walker's closure check
 * and the retention layer's defensive read both go through here, so "is a
 * theme" has exactly one spelling.)
 * @param {unknown} theme
 * @returns {boolean}
 */
export function isHookTheme(theme) {
  return typeof theme === 'string' && THEME_SET.has(theme);
}

/**
 * The lookup key for a hook string: lowercased, whitespace-collapsed, edge
 * quotes/whitespace/terminal punctuation stripped. Deliberately the SAME folding
 * `normHookText` applies in src/domain/dossier/plotHooks.js, so a hook that the
 * exact-text dedup layer considers one string is also one key here. It is a
 * FOLD, not a fuzzy match: two different sentences never collapse together.
 * @param {unknown} text
 * @returns {string}
 */
export function hookThemeKey(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/^["'\s]+|["'\s.!?]+$/g, '')
    .trim();
}

/**
 * The authored NPC loyalty/secret pool (src/data/npcData.js NPC_FACTION_LOYALTY),
 * template → theme. This pool is the measured defect: an ~11-string category is
 * drawn once or twice by EVERY NPC in a settlement, so it is where "different
 * actors, same beat" is manufactured.
 *
 * Order mirrors the pool's own category order and index order — kept that way
 * so a reviewer can read the two files side by side. The walker enforces the
 * agreement; this comment only explains it.
 * @type {ReadonlyArray<readonly [string, string]>}
 */
const AUTHORED_HOOK_THEMES = Object.freeze(/** @type {ReadonlyArray<readonly [string, string]>} */ ([
  // ── government (24) ──
  ["A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why.", 'forbidden_knowledge'],
  ["They've been quietly buying up property in a district that hasn't been announced as a development site. Yet.", 'corruption'],
  ["One of their staff has started asking questions about records from seven years ago. They've been reassigned twice already.", 'old_wound'],
  ['A merchant they spoke against has started praising them in public, and will not say why.', 'blackmail'],
  ["Their most trusted advisor hasn't been seen in four days. The official story changes each time it's told.", 'vanished_person'],
  ["They know who committed a crime the guard is currently investigating. They're not telling the guard.", 'divided_loyalty'],
  ["Someone has been leaving anonymous notes in their office pointing to a colleague's corruption. The notes are accurate.", 'corruption'],
  ["They've been meeting privately with someone from outside the settlement whose identity they won't disclose.", 'outsider_suspicion'],
  ['A routine appointment they made three weeks ago has been rescheduled four times. Each time they initiated the change.', 'hidden_debt'],
  ['Someone who publicly supports them is being paid by someone who opposes them. They know this.', 'betrayal'],
  ['They received a deposition in a civil case that, if acted on, would be correct, and would ruin someone they need.', 'divided_loyalty'],
  ["A clerk in their office has been copying letters at night, and the copies have turned up in a rival's hands.", 'betrayal'],
  ['They signed an order last month on bad information, and the family it ruined has learned whose seal is on it.', 'old_wound'],
  ['A petition they set aside has gathered names from half their street, and the people who signed it want an answer this week.', 'rivalry'],
  ['Someone is collecting fees in their name, and the people paying think the receipts are honest.', 'corruption'],
  ['Their deputy has started answering questions meant for them, and people have begun going to the deputy first.', 'ambition'],
  ["An old ruling of theirs is being used to take a widow's house, and they cannot undo it without admitting the mistake.", 'old_wound'],
  ['They promised the same post to two people, and both have already told their families.', 'rivalry'],
  ['A ledger they swore was complete is missing the pages for one season, and an auditor is coming to read it.', 'corruption'],
  ['Their sister has been taking gifts from people who need their signature, and they found out from the person who paid most.', 'corruption'],
  ['They were seen leaving a house they had no business in, on the night its owner disappeared.', 'vanished_person'],
  ['A rule they wrote to stop one abuse has opened the door to another, and the people using it are their friends.', 'corruption'],
  ['Someone has forged their seal well enough to fool their own staff, and three orders went out under it before anyone noticed.', 'betrayal'],
  ['They owe their post to a patron who has started asking for repayment in favours they cannot grant openly.', 'hidden_debt'],
  ['They have quietly favoured one household in small matters for years, out of an old kindness, and others have started to notice.', 'corruption'],
  ['They made a decision early in their post that they still think was wrong, and nobody else seems to remember it.', 'old_wound'],
  ['They have been asked to decide a small matter in which the one in the right is someone they cannot stand.', 'divided_loyalty'],
  ['They owe their place partly to the word of someone now out of favour, and have never said so.', 'hidden_debt'],
  ['They and a colleague remember the same old agreement differently, and both have begun to say so in front of others.', 'rivalry'],
  ['They have been drafting, in private, the changes they would make if they had a free hand.', 'ambition'],
  ['They know of a promise their predecessor made that was never written down, and are deciding whether to keep it.', 'forbidden_knowledge'],
  ['A colleague they taught has started taking credit for their work, politely and in front of the right people.', 'betrayal'],
  // ── military (24) ──
  ['Three guards have gone missing in the same district on night patrol. The report filed says they deserted.', 'vanished_person'],
  ['Weapons from the armoury have been disappearing in small quantities for months. The inventory matches, somehow.', 'smuggling'],
  ["They received orders from above that contradict what they know to be right. They haven't acted on either yet.", 'divided_loyalty'],
  ['A prisoner in their custody knows something valuable. So does someone with reason to ensure they never speak.', 'looming_threat'],
  ["They've noticed the same group of faces at multiple locations where incidents occurred. No one else has.", 'outsider_suspicion'],
  ["Someone is paying their soldiers more than their salary. The soldiers aren't saying who.", 'corruption'],
  ['A spy they turned is now being turned back, and feeding information in both directions.', 'betrayal'],
  ["The ambush that killed two of their best people wasn't random. Someone knew the patrol route.", 'betrayal'],
  ['A recruit they turned away has since joined a different outfit. The different outfit is now paying them to monitor this one.', 'rivalry'],
  ['They are carrying out orders they believe are wrong. They have not yet decided at what point they stop carrying them out.', 'divided_loyalty'],
  ["A weapons cache they were responsible for is smaller than it should be. They haven't reported it yet.", 'smuggling'],
  ['Two of the people under their command have been settling a private quarrel with drawn steel, and the rest are picking sides.', 'rivalry'],
  ['An old comrade has turned up asking for a favour that could cost them their post if anyone learns of it.', 'divided_loyalty'],
  ['They signed for supplies that never arrived, and the merchant who sold them is already spending the money.', 'corruption'],
  ['Someone under their command has been selling duty rosters to people who want to know when the roads are empty.', 'betrayal'],
  ['A report they wrote years ago blamed the wrong person for a death, and the right one has just come back.', 'old_wound'],
  ['Their second has been meeting with the people they answer to, and orders have started arriving without passing through them.', 'ambition'],
  ['A deserter they let go quietly has been caught elsewhere and is telling everyone who let them walk.', 'divided_loyalty'],
  ['They have been ordered to clear a family off land the family has worked for generations, and the order is lawful.', 'divided_loyalty'],
  ['The pay chest came up short again this month, and the only other key belongs to someone they trust.', 'betrayal'],
  ['A local family has been feeding the people under their command for free, and now expects a favour in return.', 'hidden_debt'],
  ['One of their best people has asked to be released, and will not say what they are afraid of.', 'looming_threat'],
  ['Tracks they were told to ignore lead from the edge of the fields to a camp nobody has reported.', 'looming_threat'],
  ['They lost a wager to someone who now wants payment as a closed eye on one particular night.', 'hidden_debt'],
  // ── religious (18) ──
  ['A parishioner confessed something to them three months ago. The information is dangerous. They cannot act on it.', 'forbidden_knowledge'],
  ['The holy relic in their keeping is not what everyone believes it is. Only they know this.', 'faith_crisis'],
  ["Someone has been leaving offerings at the shrine that shouldn't be possible. The site has been sealed.", 'looming_threat'],
  ["A novice has the gift. They know what that means for the novice. They're not sure what to do.", 'secret_identity'],
  ['They received a directive from the hierarchy that contradicts their own theology. Compliance is expected.', 'faith_crisis'],
  ["A healing they performed was successful in a way they cannot explain. It's happened twice now.", 'faith_crisis'],
  ['Their predecessor left a sealed letter to be opened at their death; it never was, and it is still where it was left.', 'old_wound'],
  ['A member of their congregation is systematically working against the faith. From inside it.', 'betrayal'],
  ['They have been asked to perform a ceremony they have theological objections to. The person asking has leverage.', 'blackmail'],
  ["A donation was made to the institution under conditions the donor didn't disclose publicly. The conditions are becoming relevant.", 'hidden_debt'],
  ['They know which of the current leadership will be the next to fall from grace. They are waiting.', 'succession'],
  ['A family has asked them to bury someone the faith forbids burying, and has offered a gift too large to refuse quietly.', 'faith_crisis'],
  ['The offerings have doubled this season, and they cannot find out who is giving or why.', 'hidden_debt'],
  ['A preacher from outside has been drawing their congregation away, and saying things about them that are partly true.', 'rivalry'],
  ["They married a couple in secret at one family's request, and the other family has just found out.", 'forbidden_love'],
  ['A child in their care claims to hear the god speak, and the child has been right three times.', 'faith_crisis'],
  ['They have stopped believing, have told no one, and still lead the prayers every week.', 'faith_crisis'],
  ['Someone has been reading the private letters kept in their care, and two of those letters were confessions.', 'blackmail'],
  // ── economy (24) ──
  ["A shipment they weren't expecting arrived and is now in their warehouse. They don't know who sent it or what to do.", 'smuggling'],
  ["A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap.", 'rivalry'],
  ['One of their most reliable suppliers has gone dark. The goods are still arriving. Someone else is sending them.', 'smuggling'],
  ['They have evidence of price-fixing across the whole market. Publishing it helps their competition as much as their customers.', 'corruption'],
  ["A young trader has been undercutting them in ways that shouldn't be possible on their claimed capital.", 'crime_ring'],
  ["Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.", 'hidden_debt'],
  ['A valuable cargo was reported lost at sea. The manifest has reappeared in a market two settlements away.', 'smuggling'],
  ["Their master craftsman is talking to a rival. They haven't confronted them. They're not sure what they'd do.", 'betrayal'],
  ["A contract they signed in difficult times has a clause they didn't fully read. Someone has read it.", 'hidden_debt'],
  ["They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.", 'ambition'],
  ['A supplier is providing goods of uncertain provenance. The price is too good to ask questions. People have started asking questions.', 'smuggling'],
  ['A buyer has paid them in advance for a whole season of goods, far above the price, and will not say what the goods are for.', 'smuggling'],
  ['Their bookkeeper has been taking a little from every sale for years, and the books balance only because the bookkeeper wrote them.', 'betrayal'],
  ["A partner died owing them money, and the partner's heir says the debt was paid in a letter nobody can find.", 'hidden_debt'],
  ['They sold a batch they knew was bad, and the customer it sickened is now asking who supplied it.', 'corruption'],
  ['A rival has hired away their two best hands in one week, on wages the rival cannot afford for long.', 'rivalry'],
  ['They have promised the same order to two buyers, and both are due to collect on the same morning.', 'scarcity_pressure'],
  ['A lender has bought the note on their shop and wants it settled by the end of the month.', 'hidden_debt'],
  ['Their scales were tested and found heavy in their favour, and they swear someone changed them overnight.', 'corruption'],
  ['A family they put out of business has opened again under a new name, two doors down.', 'rivalry'],
  ['Someone has been selling cheaper and worse goods under their mark, and customers are blaming them.', 'rivalry'],
  ['They have quietly stopped paying a supplier who cannot afford to take them to law.', 'hidden_debt'],
  ['A crate came to them by mistake, and the people who meant to receive it have started asking around for it.', 'smuggling'],
  ['Their apprentice has been offered a partnership by a rival, on condition that the apprentice brings the recipes.', 'betrayal'],
  ['They have been giving one regular customer credit long past what is sensible, because of an old kindness.', 'hidden_debt'],
  ['They still owe the person who set them up in trade for their first stock, and that person has never once asked.', 'hidden_debt'],
  ['They took an advance on work they have not yet started, and the buyer has begun stopping by to look.', 'hidden_debt'],
  ['They bought their best tools on credit from a rival, and the rival has been very patient.', 'hidden_debt'],
  ['A rival keeps sending them the customers the rival cannot serve, and they cannot work out whether it is kindness.', 'rivalry'],
  ['They and a rival quietly agreed not to undercut each other, and they suspect the rival has stopped keeping to it.', 'rivalry'],
  ['Someone newly set up in the same trade asked them for advice, and they gave it, and are beginning to regret it.', 'rivalry'],
  ['A hand they trust has been taking work on the side from their own customers.', 'betrayal'],
  ['They passed a trade secret to a friend years ago, and the friend now sells it as their own.', 'betrayal'],
  ['They have been pricing up a second premises and have told no one, not even the people who work for them.', 'ambition'],
  ['They want to be asked to supply someone important, and have been placing their best work where that person will see it.', 'ambition'],
  ['The only supplier of something they cannot work without has been slow lately, and they have no second source.', 'scarcity_pressure'],
  ['They are running low on something they always keep, and have started turning away small orders without saying why.', 'scarcity_pressure'],
  ['They give a standing gift to someone whose good word keeps their trade steady, and have stopped thinking of it as a gift.', 'corruption'],
  ['They were paid twice for the same piece of work by mistake, and have not yet found a good moment to say so.', 'hidden_debt'],
  ['Their oldest customer has started buying from a rival as well, and still comes to them for the difficult jobs.', 'rivalry'],
  ['A supplier they have dealt with for years has been giving a rival better prices, and they heard it from the rival.', 'betrayal'],
  ['Someone has just offered to come and work for them cheaply, and they must answer before that person takes an offer elsewhere.', 'ambition'],
  ['They have more orders than they can fill, and have begun deciding whom to disappoint.', 'scarcity_pressure'],
  ['They owe a fellow worker in the same trade for materials borrowed in a hurry, and the price of those materials has since gone up.', 'hidden_debt'],
  // ── criminal (18) ──
  ["One of their people is talking to the guard. They don't know which one yet. They're watching.", 'betrayal'],
  ['A valuable item came through their network recently. Three different parties have asked about it quietly.', 'smuggling'],
  ["Someone in the government takes their money and someone else's, and they do not know which side will be sold first.", 'corruption'],
  ['A job went wrong in a way that suggests information was leaked. They have three suspects.', 'betrayal'],
  ["They're protecting someone from something worse. The someone doesn't know and wouldn't thank them.", 'divided_loyalty'],
  ['The same new face has turned up at three of their jobs, and they have put someone on to follow the newcomer.', 'outsider_suspicion'],
  ['The guard captain has a file. They know because someone who works for the guard captain also works for them.', 'corruption'],
  ['Someone tried to rob them, and did it like a professional: no noise, the lock picked, nothing touched but the strongbox.', 'looming_threat'], // TAIL-TIES (T3): the pool's reworded line
  ['Two of their people have started running jobs of their own, and are telling newer hands that the old boss is finished.', 'ambition'],
  ['A debt they called in was paid by someone they have never met, and that person now wants to meet.', 'hidden_debt'],
  ['A load of theirs was taken on the road by people who knew the day, the route and the password.', 'betrayal'],
  ['Someone has been using their name to frighten shopkeepers, and the shopkeepers have begun paying the wrong people.', 'crime_ring'],
  ['A child they pay to carry messages has stopped coming, and the last message never arrived.', 'vanished_person'],
  ['An honest official they have never managed to buy has started asking about one of their fronts by name.', 'looming_threat'],
  ['They are holding goods for someone who has stopped answering, and the goods are beginning to draw attention.', 'smuggling'],
  ['A rival crew has offered peace, and the offer arrived on the same day one of their people went missing.', 'rivalry'],
  ['Someone in their own crew has been skimming, and the sum matches exactly what a rival is now spending.', 'betrayal'],
  ['A family they once ruined has a son who has just come of age, and he has started asking where they sleep.', 'old_wound'],
  ['They owe a favour to someone who has since gone respectable, and have no idea what a respectable person will ask for.', 'hidden_debt'],
  ['They are fond of someone who would cut them off entirely if they knew how they make their living.', 'divided_loyalty'],
  ['They keep one thing that passed through their hands that they will not sell at any price, and will not say why.', 'old_wound'],
  ['They have been putting money into something honest, and wonder whether the people they know will let them leave.', 'ambition'],
  ['Someone in the same line of work keeps being called better at it, and they have started to take it personally.', 'rivalry'],
  ['They once gave someone up to save themselves, and that person has never found out and still trusts them.', 'betrayal'],
  ['An old associate has started being friendly with people they avoid, and has stopped mentioning it.', 'betrayal'],
  ['A face they cannot place keeps turning up where they spend their evenings, and they have started taking the long way home.', 'outsider_suspicion'],
  // ── magic (8) ──
  ["An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking.", 'forbidden_knowledge'],
  ['A student asked them a question three weeks ago that they still cannot answer, and the student has not asked again.', 'forbidden_knowledge'],
  ['Something in the settlement is absorbing ambient magical energy. The readings are increasing.', 'looming_threat'],
  ["They've been approached by someone who knows things about their research that were never made public.", 'blackmail'],
  ['An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago.', 'vanished_person'],
  ['The ward on their vaults was not broken but bypassed, which only someone who knew how it was made could do.', 'betrayal'],
  ['They have two competing theories about what is happening to magic in this region. Both are alarming.', 'looming_threat'],
  ['Someone has been making inquiries about their past research. Not the published work, the unpublished work.', 'outsider_suspicion'],
  // ── other (40) ──
  ['They overheard two people they know settle a bribe, and do not know whom to tell.', 'forbidden_knowledge'],
  ["A regular customer has stopped coming. The reason they've been given doesn't make sense.", 'vanished_person'],
  ["Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious.", 'vanished_person'],
  ['Three different people have asked them the same unusual question. None of them knew each other.', 'outsider_suspicion'],
  ["They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone.", 'forbidden_knowledge'],
  ['A traveller passed through asking which nights their door is left unbarred, and was gone by morning.', 'outsider_suspicion'],
  ['Something they were told had been burned has turned up for sale.', 'old_wound'],
  ['They have seen the same unmarked cart pass their door three nights running, and have not wondered why.', 'forbidden_knowledge'],
  ['Their oldest friend has started paying for drinks with new silver and will not say where it came from.', 'betrayal'],
  ["They've been offered money to not ask questions about something they hadn't even started asking about.", 'corruption'],
  ['A document they were asked to witness contained a clause they noticed at the time and said nothing about.', 'hidden_debt'],
  ["Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it.", 'old_wound'],
  ['A neighbour has accused them of moving a fence, and the neighbour has witnesses who were not there.', 'rivalry'],
  ["They lent their savings to a friend who has since left, and the friend's family says there was no loan.", 'hidden_debt'],
  ['Their landlord has doubled the rent and will lower it only if they report on the family next door.', 'blackmail'],
  ['A letter addressed to them was opened before it arrived, and the sender says it carried money.', 'betrayal'],
  ['Their son has been seen at night with people who do not work, and comes home with coin.', 'crime_ring'],
  ['A customer paid them with a ring that someone else has reported stolen.', 'smuggling'],
  ['They saw an accident that was no accident, and the person responsible knows they saw it.', 'looming_threat'],
  ["An inheritance they did not expect has arrived from a relative they never met, along with that relative's debts.", 'hidden_debt'],
  ['Their spouse has been making payments to someone every month for years, and will not say who.', 'blackmail'],
  ['Two neighbours have each asked them to stand witness in the same dispute, on opposite sides.', 'divided_loyalty'],
  ['They told a lie to protect a friend, and the friend is now repeating it to people who matter.', 'betrayal'],
  ['A child they took in as a favour has family who want the child back, and want paying for the years.', 'old_wound'],
  ["Their best customer owes them a year's takings and has started avoiding their street.", 'hidden_debt'],
  ['Someone has been asking the neighbours what time they leave in the morning and when they come home.', 'looming_threat'],
  ['A tool they lent out came back broken, and the borrower insists it was broken when it left.', 'rivalry'],
  ['They have been invited to the wedding of someone who once ruined their family, and refusing would be noticed.', 'old_wound'],
  ['A purse they found and kept has a rightful owner, and that owner has started asking around.', 'hidden_debt'],
  ['Their partner in a small venture has disappeared with the takings and left the debts in their name.', 'betrayal'],
  ['A family they look after has stopped answering the door, and the shutters have stayed closed for a week.', 'vanished_person'],
  ['They agreed to hold a parcel for a traveller, and two different people have since come to collect it.', 'smuggling'],
  ['An old letter of theirs, written in anger years ago, has been shown to the person it was about.', 'old_wound'],
  ['Their apprentice has been talking to a rival, and came back with an offer to buy them out.', 'ambition'],
  ['Someone keeps paying off their small debts around the place before they can, and has left no name.', 'secret_identity'],
  ['A cousin has arrived to stay without warning, and spends every day watching one particular house.', 'outsider_suspicion'],
  ['They found a name scratched into their door overnight, and it belongs to someone who died last winter.', 'looming_threat'],
  ['Their savings were hidden in a place only one other person knew, and the savings are gone.', 'betrayal'],
  ["A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week.", 'rivalry'],
  ['Someone close to them has been ill in a way nobody can name, and recovers whenever one particular visitor stays away.', 'looming_threat'],
  ['They still owe a neighbour for a favour done years ago, and the neighbour has just mentioned it for the first time.', 'hidden_debt'],
  ['They borrowed a good coat for an occasion and never gave it back, and its owner has taken to wearing a worse one.', 'hidden_debt'],
  ['They promised to pay back a small sum when things were easier, and things are easier now.', 'hidden_debt'],
  ['They took a loan from a neighbour on the promise of a hand at busy times, and keep finding reasons to be busy themselves.', 'hidden_debt'],
  ["They owe an old friend a day's work they keep putting off, and the friend has stopped asking, which is worse.", 'hidden_debt'],
  ['They have not spoken to someone who lives a short walk away for years, and neither of them remembers exactly why.', 'old_wound'],
  ['They keep a thing that belonged to someone they once wronged, and can bring themselves neither to return it nor to throw it away.', 'old_wound'],
  ['Someone they once made a fool of in front of others has come back to live nearby, and is perfectly polite.', 'old_wound'],
  ['They were blamed long ago for a mistake that was not theirs, and the one who made it is still well thought of.', 'old_wound'],
  ["They and a neighbour have been trying to outdo each other's generosity, and it has stopped being friendly.", 'rivalry'],
  ['Someone keeps telling the same story they tell, a little better, to the same listeners.', 'rivalry'],
  ['They lost a small wager years ago, and the winner still brings it up whenever others are listening.', 'rivalry'],
  ['Two old friends have fallen out, and each has asked them, separately, to stop seeing the other.', 'divided_loyalty'],
  ['They know who is really behind a small embarrassment someone else is being teased for, and they like both people.', 'divided_loyalty'],
  ['They have been asked to keep a confidence that someone they love has a right to hear.', 'divided_loyalty'],
  ['They have been quietly saving toward something they have never told anyone they want.', 'ambition'],
  ['They have been offered a better place somewhere else, and have told no one they are thinking of going.', 'ambition'],
  ['They want a say in something they have always been left out of, and have begun turning up wherever it is talked over.', 'ambition'],
  ['They can read an old hand that nobody else nearby can, and have been asked to read something they wish they had not.', 'forbidden_knowledge'],
  ['They remember how a certain old agreement was really made, and are the last who do.', 'forbidden_knowledge'],
  ['They know why a certain door nearby is always kept shut, and change the subject whenever it comes up.', 'forbidden_knowledge'],
  ['A stranger has taken lodging nearby and is far too interested in their old stories.', 'outsider_suspicion'],
  ['They came here from elsewhere long ago, and some of their neighbours still lower their voices when they pass.', 'outsider_suspicion'],
  ['They have taken a liking to a visitor nobody else trusts, and their neighbours have noticed.', 'outsider_suspicion'],
  ['They go by a different name than the one they were born with, and someone has just called them by the old one.', 'secret_identity'],
  ['They are better schooled than they let on, and have twice caught themselves correcting someone.', 'secret_identity'],
  ['They repeated something told them in confidence, and it has come back round to the person who told them.', 'betrayal'],
  ['A friend they vouched for has let them down in a small way, and others remember whose word it was.', 'betrayal'],
  ['They have stopped hearing from a friend who moved away, and seem to be the only one who has noticed.', 'vanished_person'],
  ['They were asked to put in a good word for someone, said yes, and have not yet put the word in.', 'hidden_debt'],
  ['A neighbour who has fed them more often than they can count has just invited them again, and asked them to bring something this time.', 'hidden_debt'],
  ['The friend who was chosen over them for something years ago has just come to ask them a favour, as though nothing had ever stood between them.', 'old_wound'],
  ['A friend they once confided in has started making jokes that come a little too close to what they confided.', 'betrayal'],
  ['A neighbour they have long tried to outdo has been asked to do the very thing they hoped to be asked, and has come to them for advice.', 'rivalry'],
  ['They know the real reason two well-liked families stopped speaking, and are the only one outside both who does.', 'forbidden_knowledge'],
  ['A newcomer keeps asking them the way to places the newcomer has plainly been to already.', 'outsider_suspicion'],
  ["A relative has asked them to take the relative's side in a family matter, and they think the relative is in the wrong.", 'divided_loyalty'],
  ['Someone whose good opinion they want has offered to teach them a skill they have always wanted, and wants an answer by the end of the week.', 'ambition'],
  ['They have family elsewhere whom nobody here knows about, and a letter from them has just arrived where others could see it.', 'secret_identity'],
  ["They promised an old friend to keep an eye on the friend's child, and have not looked in for a long while.", 'hidden_debt'],
  ['Someone they once loved lives a few doors away with someone else, and they have not walked past that door in years.', 'old_wound'],
  ['They have learned that a friend spoke against them when they were not in the room, and the friend has no idea they know.', 'betrayal'],
  ["They and a cousin have been quietly competing for an elderly relative's favour, and the relative has started to enjoy it.", 'rivalry'],
  ['They know what an old saying around here first referred to, and it is not as harmless as people think.', 'forbidden_knowledge'],
  ['Someone new to the place has asked them for an introduction to someone, and they can think of no good reason either to refuse or to agree.', 'outsider_suspicion'],
  ['They have been asked to recommend a friend to someone they respect, and do not think the friend is up to it.', 'divided_loyalty'],
  ['They have been asked to stand up and speak at a gathering next week, and have been rehearsing to anyone who will listen.', 'ambition'],
  ['A visitor has just noticed a mark on their hand that only one kind of work leaves, and asked where they learned it.', 'secret_identity'],
  ['A friend who once paid their share of a gift has just asked them to go halves on another, and they have not yet settled the first.', 'hidden_debt'],
  ['They have just learned that the person who once laughed them out of a room will be at the same supper tomorrow.', 'old_wound'],
  ['They have been offered a small post of responsibility and want it badly, and are pretending to be undecided.', 'ambition'],
  ['Someone who arrived after them is already better liked by the very people they most wanted to impress.', 'rivalry'],
  ['They read a letter not meant for them, by accident, and now know something about a friend that the friend has not told them.', 'forbidden_knowledge'],
  ['Someone who settled here lately has started copying their hours, their habits and the way they speak, and seems not to know they have noticed.', 'outsider_suspicion'],
  ['Two people they owe a kindness to want the same small thing from them, and only one of them can have it.', 'divided_loyalty'],
  ["Someone they used to see in the same place every morning has not been there for some time, and nobody else seems to know the person's name.", 'vanished_person'],
  ['The branch over their roof has cracked, and the neighbour who owns the tree has said, again, that it will hold.', 'looming_threat'],
  ['A friend who once gave them a present they could not match has just announced a celebration, and everyone is expected to bring a gift.', 'hidden_debt'],
  ['They left home angry many years ago and never went back, and a letter has come asking whether they will.', 'old_wound'],
  ['They speak a language nobody here knows they speak, and have just overheard two visitors talking in it.', 'secret_identity'],
  // ── small_settlement (18) ──
  ['Everyone in the settlement is behaving slightly differently toward a visitor from outside. Not unfriendly, careful.', 'outsider_suspicion'],
  ['There is a building no one talks about, goes into, or mentions. It is clearly maintained. No one will say by whom.', 'forbidden_knowledge'],
  ['The oldest resident refuses to speak about a specific year. Others confirm the year exists. No one remembers what happened.', 'old_wound'],
  ['Something is left at the crossroads each new moon. No one admits to leaving it. It is always gone by morning.', 'faith_crisis'],
  ['Two families who should be feuding are recently, unexpectedly civil. Neither will explain why.', 'rivalry'],
  ['A child has been asking questions about a person no one has heard of, insisting this person lived here recently.', 'vanished_person'],
  ['The well gives good water. The spring above it dried up three years ago. No one mentions this.', 'looming_threat'],
  ["They buried someone last season that they refer to only as 'the traveller'. They will not say more.", 'grief'],
  ['The family that has always mended the common track says it is theirs to close, and has closed it.', 'rivalry'],
  ["A cow belonging to one family was found dead in another family's field, and the two families no longer speak.", 'rivalry'],
  ['Someone has been moving the boundary stones at night, a little each time, always in the same direction.', 'rivalry'],
  ['A young couple from two families who do not speak have been seen together, and both families have noticed.', 'forbidden_love'],
  ['The person who settled every quarrel here has died, and two neighbours both expect to take their place.', 'succession'],
  ['A pedlar who comes every spring did not come this year, and the goods everyone ordered were paid for in advance.', 'vanished_person'],
  ['Someone has been taking eggs and bread from doorsteps, a little at a time, and nobody has caught them.', 'scarcity_pressure'],
  ['An outsider has offered to buy the best field for twice what it is worth, and the owner is tempted.', 'outsider_suspicion'],
  ['The oldest family has started keeping its children indoors after dark, and will not say what they saw.', 'looming_threat'],
  ['A letter came for a neighbour who has been dead for years, and the seal on it is one nobody here knows.', 'forbidden_knowledge'],
]));

/**
 * Relationship archetype key → theme (src/data/npcData.js
 * STRESS_ECONOMIC_EFFECTS). Keyed by `archetypeKey`, which
 * generators/npcGenerator.js stamps onto every generated relationship.
 * @type {Readonly<Record<string, string>>}
 */
export const THEME_OF_REL_ARCHETYPE = Object.freeze({
  econ_crim_blur: 'corruption',
  econ_crim_exploitation: 'crime_ring',
  mil_crim_corruption: 'corruption',
  mil_crim_suppression: 'rivalry',
  econ_mil_contract: 'smuggling',
  rel_mil_crusader: 'faith_crisis',
  rel_crim_fraud: 'corruption',
  mag_crim_market: 'forbidden_knowledge',
  gov_econ_dependence: 'hidden_debt',
  gov_mil_friction: 'rivalry',
  peer_rivalry: 'ambition',
  mentor_legacy: 'succession',
  mutual_leverage: 'blackmail',
  wary_alliance: 'betrayal',
  genuine_respect: 'divided_loyalty',
  old_debt: 'hidden_debt',
  family_complication: 'succession',
  bitter_history: 'old_wound',
});

/** Built once at module init: folded key → theme. @type {Map<string, string>} */
const THEME_BY_KEY = new Map(AUTHORED_HOOK_THEMES.map(([template, theme]) => [hookThemeKey(template), theme]));

/**
 * The templates this module claims to tag, verbatim. Exported for the totality
 * walker ONLY — it is the walker's side of the exact-set-equality check against
 * the live pools. Not for runtime use.
 * @returns {string[]}
 */
export function taggedTemplates() {
  return AUTHORED_HOOK_THEMES.map(([template]) => template);
}

/**
 * THE CLASSIFIER. One member of HOOK_THEMES for an authored template; `untyped`
 * for everything else — free prose, DM edits, AI-bucketed custom content, and
 * any authored string this module has not been taught.
 *
 * "Not taught" answering `untyped` rather than throwing is deliberate: an
 * untagged hook is merely EXEMPT from theme retention (it keeps its place in the
 * projection), so the failure mode of a missed tag is lost coverage, never a
 * dropped hook. The walker is what stops a missed tag surviving a commit.
 *
 * @param {unknown} text hook prose
 * @returns {string} a HOOK_THEMES member, or UNTYPED
 */
export function themeOfText(text) {
  return THEME_BY_KEY.get(hookThemeKey(text)) || UNTYPED;
}

/**
 * The relationship arm: theme for a generated relationship's archetype key.
 * @param {unknown} archetypeKey the `archetypeKey` stamped on the relationship
 * @returns {string} a HOOK_THEMES member, or UNTYPED
 */
export function themeOfRelArchetype(archetypeKey) {
  return (typeof archetypeKey === 'string' && THEME_OF_REL_ARCHETYPE[archetypeKey]) || UNTYPED;
}
