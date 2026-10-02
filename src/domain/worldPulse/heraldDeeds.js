/**
 * domain/worldPulse/heraldDeeds.js — THE HERALD'S DEED FORMS: what the world says happened.
 *
 * ⛔ THE HERALD SPEAKS IN DEEDS (the owner, 2026-10-02: "Updates like these need to reflect
 * actions not to potential. Like a definitive actions. Such as X is targeting Y. A has captured
 * B."). Every Herald line names an actor, a concrete verb and what it acts on, the way a strategy
 * game's campaign log does, and it is written in one of exactly two aspects:
 *   UNDER WAY — a pending proposal awaiting the DM's ruling ("X is moving against Y"). It is
 *               definite about the move without claiming its outcome, so it stays true if the
 *               ruling goes the other way.
 *   DONE      — the applied twin ("X suppresses Y"); the feed reads `appliedHeadline` first
 *               (worldPulseFeedCuration.js).
 * Never "may", "can advance through", or the simulation's own nouns (pressure, condition, goal,
 * score): those stay in `reasons`, the receipt printed under the line.
 *
 * ONE AUTHORED FORM PER DEED, by design: Bannerlord, Civilization and Total War each give an event
 * type one fixed sentence, and that fixedness is what makes a log read as a record. Phrasing
 * variety belongs to the eventProse.js pools and their SP-6 floor, not here.
 *
 * Pure data leaf: no imports, so it rides whichever chunk its importers ride.
 * @enforced-by tests/domain/heraldDeeds.test.js
 */

/**
 * The organic condition a settlement slides into (candidateEvents.js): the headline under way,
 * the headline done, and the in-world fact the summary states in both states.
 * @type {Readonly<Record<string, { underway: (n: string) => string, done: (n: string) => string, fact: (n: string) => string }>>}
 */
export const CONDITION_DEEDS = Object.freeze({
  food:       { underway: (n) => `Hunger is closing on ${n}`,          done: (n) => `Famine grips ${n}`,
                fact: (n) => `${n}'s granaries are running low, and bread has gone dear.` },
  disease:    { underway: (n) => `Sickness is spreading through ${n}`, done: (n) => `Plague breaks out in ${n}`,
                fact: (n) => `Fever is moving from house to house in ${n}.` },
  conflict:   { underway: (n) => `${n} is arming for war`,             done: (n) => `${n} goes onto a war footing`,
                fact: (n) => `${n} is mustering its levies and doubling its watch.` },
  trade:      { underway: (n) => `${n}'s trade is faltering`,          done: (n) => `${n}'s trade routes break down`,
                fact: (n) => `Caravans are passing ${n} by, and its market stalls stand half empty.` },
  legitimacy: { underway: (n) => `${n}'s rulers are under challenge`,  done: (n) => `${n}'s rulers face an open challenge`,
                fact: (n) => `${n}'s people are openly questioning who should rule them.` },
  crime:      { underway: (n) => `Crime is gaining ground in ${n}`,    done: (n) => `Crime takes hold of ${n}`,
                fact: (n) => `Thieves and racketeers are working ${n}'s streets in the open.` },
});

/**
 * An NPC's move AGAINST a named rival (npcAgency.js). Membership ALSO gates the rival consequence
 * there, so seek_promotion (which carries a rivalTarget only for rivalry tracking) neither names a
 * subject nor sets one back.
 * @type {Readonly<Record<string, { underway: (name: string) => string, done: (name: string) => string }>>}
 */
export const TARGETED_NPC_DEEDS = Object.freeze({
  expose:          { underway: (name) => `is moving to expose ${name}`,         done: (name) => `exposes ${name}` },
  suppress:        { underway: (name) => `is moving against ${name}`,          done: (name) => `suppresses ${name}` },
  sabotage:        { underway: (name) => `is working against ${name} in secret`, done: (name) => `sabotages ${name}` },
  undermine_rival: { underway: (name) => `is undermining ${name}`,             done: (name) => `undermines ${name}` },
});

/**
 * The same two forms for a move that names no one. Each carries its own object, so no headline
 * ends on a bare verb ("X protects").
 * @type {Readonly<Record<string, { underway: string, done: string }>>}
 */
export const UNTARGETED_NPC_DEEDS = Object.freeze({
  protect:         { underway: 'is rallying to shield their people',       done: 'shields their people' },
  exploit:         { underway: 'is turning the moment to their advantage', done: 'turns the moment to their advantage' },
  reform:          { underway: 'is pushing for reform',                    done: 'pushes through reforms' },
  suppress:        { underway: 'is cracking down on dissent',              done: 'cracks down on dissent' },
  bargain:         { underway: 'is striking a bargain',                    done: 'strikes a bargain' },
  defect:          { underway: 'is breaking with their faction',           done: 'breaks with their faction' },
  expose:          { underway: 'is digging up secrets',                    done: 'drags a secret into the open' },
  hoard:           { underway: 'is hoarding stores',                       done: 'hoards stores' },
  mobilize:        { underway: 'is rallying supporters',                   done: 'rallies supporters' },
  sabotage:        { underway: 'is working sabotage in secret',            done: 'commits sabotage' },
  seek_promotion:  { underway: 'is angling for promotion',                 done: 'presses for promotion' },
  undermine_rival: { underway: 'is undermining a rival',                   done: 'undermines a rival' },
});

/**
 * What the person is out to win, as the world would say it (the goal KEY is the planner's).
 * Covers every goal the planner can hold (npcFacetContract.js NPC_GOAL_CATALOG), so no
 * summary falls back to the key with its underscores spaced ("is out to survive tribute").
 * @type {Readonly<Record<string, string>>}
 */
export const NPC_AIMS = Object.freeze({
  secure_office:         'secure an office',
  protect_followers:     'protect their followers',
  expand_influence:      'widen their influence',
  settle_rivalry:        'settle an old rivalry',
  restore_order:         'restore order',
  profit_from_change:    'profit from the change',
  control_institution:   'take control of an institution',
  win_public_legitimacy: "win the public's trust",
  bind_external_patron:  'bind an outside patron to their cause',
  survive_crisis:        'come through the crisis',
  survive_tribute:       'bear the weight of the tribute',
  secure_tribute:        'secure the tribute owed',
  organize_autonomy:     'win their people a say of their own',
  break_vassalage:       "throw off the overlord's yoke",
  exploit_desperation:   "profit from other people's desperation",
  join_guild:            'win a place in a guild',
  expand_trade_house:    'grow their trading house',
  secure_new_garrison:   'win a new garrison for the town',
  professionalize_guard: 'make a proper fighting force of the guard',
  formalize_new_charter: 'set a new charter down in writing',
  punish_rivals:         'make their rivals pay',
  mobilize_defenses:     'ready the walls and the watch',
  consolidate_power:     'tighten their grip on power',
});

/**
 * Two settlements' standing turning to a new label (relationshipRuleHelpers.js): "A and B are
 * turning rivals" under way, "A and B turn rivals" done. Keyed on the TO label of the primary
 * vocabulary (relationshipCompatibility.js PRIMARY_RELATIONSHIP_TYPES).
 * @type {Readonly<Record<string, { underway: string, done: string }>>}
 */
export const RELATIONSHIP_TURNS = Object.freeze({
  neutral:          { underway: 'are drifting apart',                          done: 'drift apart' },
  trade_partner:    { underway: 'are becoming trade partners',                 done: 'become trade partners' },
  allied:           { underway: 'are becoming allies',                         done: 'become allies' },
  patron:           { underway: 'are binding themselves as patron and client', done: 'bind themselves as patron and client' },
  client:           { underway: 'are binding themselves as patron and client', done: 'bind themselves as patron and client' },
  vassal:           { underway: 'are settling into overlord and vassal',       done: 'settle into overlord and vassal' },
  rival:            { underway: 'are turning rivals',                          done: 'turn rivals' },
  cold_war:         { underway: 'are sliding into a cold war',                 done: 'slide into a cold war' },
  hostile:          { underway: 'are turning to open hostility',               done: 'turn to open hostility' },
  criminal_network: { underway: 'are knitting a criminal network between them', done: 'knit a criminal network between them' },
});

/**
 * Relations that move without changing label, by the candidate's own direction
 * (relationshipRuleHelpers.js candidateDirection): "Relations between A and B are souring".
 * @type {Readonly<Record<string, { underway: string, done: string }>>}
 */
export const RELATIONS_MOVE = Object.freeze({
  escalation:    { underway: 'are souring',  done: 'sour' },
  de_escalation: { underway: 'are warming',  done: 'warm' },
  neutral:       { underway: 'are changing', done: 'change' },
});
