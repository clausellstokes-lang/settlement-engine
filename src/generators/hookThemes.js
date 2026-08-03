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
 * WHY THE TEMPLATES ARE SPELLED OUT HERE rather than derived by importing the
 * pools: this module is a ZERO-IMPORT LEAF. Every consumer of the vocabulary is
 * a dossier/display-side reader (src/domain/dossier/**), and reaching from there
 * into src/data/npcData.js would pull the whole NPC data table across a chunk
 * boundary it does not otherwise cross. The duplication is not unguarded —
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
  // ── government (11) ──
  ["A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why.", 'forbidden_knowledge'],
  ["They've been quietly buying up property in a district that hasn't been announced as a development site. Yet.", 'corruption'],
  ["One of their staff has started asking questions about records from seven years ago. They've been reassigned twice already.", 'old_wound'],
  ['A merchant they publicly opposed is now publicly supporting them. No explanation offered.', 'blackmail'],
  ["Their most trusted advisor hasn't been seen in four days. The official story changes each time it's told.", 'vanished_person'],
  ["They know who committed a crime the guard is currently investigating. They're not telling the guard.", 'divided_loyalty'],
  ["Someone has been leaving anonymous notes in their office pointing to a colleague's corruption. The notes are accurate.", 'corruption'],
  ["They've been meeting privately with someone from outside the settlement whose identity they won't disclose.", 'outsider_suspicion'],
  ['A routine appointment they made three weeks ago has been rescheduled four times. Each time they initiated the change.', 'hidden_debt'],
  ['Someone who publicly supports them is being paid by someone who opposes them. They know this.', 'betrayal'],
  ['They received a deposition in a civil case that, if acted on, would be correct, and would ruin someone they need.', 'divided_loyalty'],
  // ── military (11) ──
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
  // ── religious (11) ──
  ['A parishioner confessed something to them three months ago. The information is dangerous. They cannot act on it.', 'forbidden_knowledge'],
  ['The holy relic in their keeping is not what everyone believes it is. Only they know this.', 'faith_crisis'],
  ["Someone has been leaving offerings at the shrine that shouldn't be possible. The site has been sealed.", 'looming_threat'],
  ["A novice has the gift. They know what that means for the novice. They're not sure what to do.", 'secret_identity'],
  ['They received a directive from the hierarchy that contradicts their own theology. Compliance is expected.', 'faith_crisis'],
  ["A healing they performed was successful in a way they cannot explain. It's happened twice now.", 'faith_crisis'],
  ["The previous holder of their position left a letter, sealed, to be opened after their death. It wasn't.", 'old_wound'],
  ['A member of their congregation is systematically working against the faith. From inside it.', 'betrayal'],
  ['They have been asked to perform a ceremony they have theological objections to. The person asking has leverage.', 'blackmail'],
  ["A donation was made to the institution under conditions the donor didn't disclose publicly. The conditions are becoming relevant.", 'hidden_debt'],
  ['They know which of the current leadership will be the next to fall from grace. They are waiting.', 'succession'],
  // ── economy (11) ──
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
  // ── criminal (8) ──
  ["One of their people is talking to the guard. They don't know which one yet. They're watching.", 'betrayal'],
  ['A valuable item came through their network recently. Three different parties have asked about it quietly.', 'smuggling'],
  ["Someone in the legitimate government is playing both sides. That's useful, until it isn't.", 'corruption'],
  ['A job went wrong in a way that suggests information was leaked. They have three suspects.', 'betrayal'],
  ["They're protecting someone from something worse. The someone doesn't know and wouldn't thank them.", 'divided_loyalty'],
  ['A new face has appeared in three separate incidents involving their operations. Coincidence or surveillance?', 'outsider_suspicion'],
  ['The guard captain has a file. They know because someone who works for the guard captain also works for them.', 'corruption'],
  ["Someone tried to rob one of their fronts. The attempt was professional. That's more worrying than amateur.", 'looming_threat'],
  // ── magic (8) ──
  ["An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking.", 'forbidden_knowledge'],
  ["A student asked a question three weeks ago that they haven't been able to answer. That's new.", 'forbidden_knowledge'],
  ['Something in the settlement is absorbing ambient magical energy. The readings are increasing.', 'looming_threat'],
  ["They've been approached by someone who knows things about their research that were never made public.", 'blackmail'],
  ['An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago.', 'vanished_person'],
  ['The magical ward they placed on the vaults was bypassed. Not broken. Bypassed. That requires inside knowledge.', 'betrayal'],
  ['They have two competing theories about what is happening to magic in this region. Both are alarming.', 'looming_threat'],
  ['Someone has been making inquiries about their past research. Not the published work, the unpublished work.', 'outsider_suspicion'],
  // ── other (12) ──
  ["They overheard something they shouldn't have and don't know what to do with the information.", 'forbidden_knowledge'],
  ["A regular customer has stopped coming. The reason they've been given doesn't make sense.", 'vanished_person'],
  ["Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious.", 'vanished_person'],
  ['Three different people have asked them the same unusual question. None of them knew each other.', 'outsider_suspicion'],
  ["They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone.", 'forbidden_knowledge'],
  ['A stranger passed through, asked specific questions, and left before they could follow up.', 'outsider_suspicion'],
  ['Something they were told was destroyed is apparently not destroyed.', 'old_wound'],
  ["They know something small that connects to something much larger. They haven't realised the connection. Yet.", 'forbidden_knowledge'],
  ["Someone they trust completely has started behaving in ways that don't add up.", 'betrayal'],
  ["They've been offered money to not ask questions about something they hadn't even started asking about.", 'corruption'],
  ['A document they were asked to witness contained a clause they noticed at the time and said nothing about.', 'hidden_debt'],
  ["Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it.", 'old_wound'],
  // ── small_settlement (8) ──
  ['Everyone in the settlement is behaving slightly differently toward a visitor from outside. Not unfriendly, careful.', 'outsider_suspicion'],
  ['There is a building no one talks about, goes into, or mentions. It is clearly maintained. No one will say by whom.', 'forbidden_knowledge'],
  ['The oldest resident refuses to speak about a specific year. Others confirm the year exists. No one remembers what happened.', 'old_wound'],
  ['Something is left at the crossroads each new moon. No one admits to leaving it. It is always gone by morning.', 'faith_crisis'],
  ['Two families who should be feuding are recently, unexpectedly civil. Neither will explain why.', 'rivalry'],
  ['A child has been asking questions about a person no one has heard of, insisting this person lived here recently.', 'vanished_person'],
  ['The well gives good water. The spring above it dried up three years ago. No one mentions this.', 'looming_threat'],
  ["They buried someone last season that they refer to only as 'the traveller'. They will not say more.", 'grief'],
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
