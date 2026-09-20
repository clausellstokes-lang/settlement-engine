/**
 * domain/display/humanizeEngineTokens.js — THE PRESENTATION-BOUNDARY HUMANIZER
 * (fix wave 3: engine tokens must not reach reader prose).
 *
 * The reader-facing composers (chronicler's letter, world book, advance report)
 * historically passed engine values straight into prose: bare `tick <n>` counters,
 * camelCase simulationRules flag keys, snake_case schema tokens. This module is
 * the ONE chokepoint that turns those into the house voice, so every composer
 * spells them the same way and the no-engine-token walker
 * (tests/copy/proseLeak.test.js) can burn the remaining call sites down.
 *
 * PURE LEAF — no imports, no store, no clock, no rng. Display sidecar idiom:
 * the 4-line season derivation is a LOCAL COPY of worldPulse's seasonForTick
 * (the chronicleReadModel precedent — display never imports the engine chunk;
 * the unit test pins agreement with seasonForTick so the copies cannot drift).
 * Lazy by construction: imported only by lazy composer chunks, never the eager
 * first-paint closure.
 */

// The durable calendar (mirrors seasonForTick — pinned in the unit test).
const WEEKS_PER_YEAR = 52;
const WEEKS_PER_SEASON = 13;
const SEASONS = Object.freeze(['spring', 'summer', 'autumn', 'winter']);
/** @type {Readonly<Record<string, string>>} */
// ⚠ `thorp` READS AS "Thorpe" (ODQ §934.63 F14): one word on every reader-facing
// surface. Pinned equal to config/tierFacts.js SIZE_LABEL by
// tests/copy/tierWord.census.test.js.
const SETTLEMENT_SIZE_LABELS = Object.freeze({
  thorp: 'Thorpe',
  hamlet: 'Hamlet',
  village: 'Village',
  town: 'Town',
  city: 'City',
  capital: 'Metropolis',
  metropolis: 'Metropolis',
});

/**
 * A tick (elapsed weeks) as a calendar phrase the reader can live inside:
 * `the spring of year 1`. Total on garbage (non-finite ⇒ week 0).
 * @param {number} tick
 * @returns {string}
 */
export function tickCalendarLabel(tick) {
  const w = Math.max(0, Math.floor(Number(tick) || 0));
  const weekOfYear = w % WEEKS_PER_YEAR;
  const season = SEASONS[Math.floor(weekOfYear / WEEKS_PER_SEASON)] || 'spring';
  return `the ${season} of year ${Math.floor(w / WEEKS_PER_YEAR) + 1}`;
}

/**
 * A calendar label precise enough to distinguish adjacent Chronicle entries:
 * `week 8 of spring, year 1`.
 *
 * The Chronicle is weekly, so the season-only label above is intentionally too
 * coarse for its scrubber. This detail form delegates the durable season/year
 * wording to `tickCalendarLabel`; it adds only the week within that season.
 *
 * @param {number} tick
 * @returns {string}
 */
export function tickCalendarDetailLabel(tick) {
  const w = Math.max(0, Math.floor(Number(tick) || 0));
  const seasonAndYear = tickCalendarLabel(w)
    .replace(/^the /, '')
    .replace(' of year ', ', year ');
  return `week ${(w % WEEKS_PER_SEASON) + 1} of ${seasonAndYear}`;
}

/**
 * A SPAN of ticks as a duration phrase in the reader's own unit: `one week`,
 * `6 weeks`. One tick is one week, so the number itself is already the reader's
 * unit — what leaks is the word `tick`, not the count.
 *
 * ⛔ THIS IS NOT `tickCalendarLabel`, AND THE TWO ARE NOT INTERCHANGEABLE.
 * A calendar label answers WHEN (`the spring of year 1`); a duration answers HOW
 * LONG. Routing a duration through the calendar translator produces
 * "Roughly the spring of year 1 ticks from marching." — which is why the
 * duration sites needed an export of their own rather than the one that existed.
 *
 * Exact rather than hedged: every site that renders a duration today is an
 * actionable readout (how many advances until an army marches, until a queued
 * impact matures), so an approximating phrase would cost the reader the number
 * the surface exists to give. Sites that want a hedge already carry their own
 * ("Roughly …"). Total on garbage (non-finite ⇒ 0 ⇒ `less than a week`).
 *
 * @param {number} ticks
 * @returns {string}
 */
export function tickDurationLabel(ticks) {
  const n = Math.max(0, Math.floor(Number(ticks) || 0));
  if (n === 0) return 'less than a week';
  if (n === 1) return 'one week';
  return `${n} weeks`;
}

/**
 * A schema token (snake_case, kebab-case, or camelCase) as plain lowercase
 * words: `succession_coup` → `succession coup`, `goalProgress` → `goal progress`.
 * Total on garbage (non-string ⇒ '').
 * @param {unknown} token
 * @returns {string}
 */
export function humanizeToken(token) {
  return String(token ?? '')
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A durable NPC `tier|relationship|condition_a,condition_b` signature as prose.
 * @param {unknown} signature
 * @returns {string}
 */
export function humanizeContextSignature(signature) {
  const [tier = '', relationship = '', conditions = ''] = String(signature ?? '').split('|');
  const parts = [tier, relationship, ...conditions.split(',')].map(humanizeToken).filter(Boolean);
  return parts.length ? parts.join(', ') : 'unknown circumstances';
}

/**
 * A stored settlement-size token as the product's reader-facing size name.
 *
 * The canonical six sizes have authored labels; the legacy `capital` token
 * resolves to the same final rung as `metropolis`. Unknown future or imported
 * tokens remain legible through the general token humanizer rather than leaking
 * underscores or silently disappearing.
 *
 * @param {unknown} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function settlementSizeLabel(value, fallback = '') {
  const key = String(value ?? '').trim().toLowerCase();
  if (!key) return fallback;
  if (SETTLEMENT_SIZE_LABELS[key]) return SETTLEMENT_SIZE_LABELS[key];
  const words = humanizeToken(value);
  return words ? `${words.charAt(0).toUpperCase()}${words.slice(1)}` : fallback;
}

/**
 * A simulationRules flag key as a reader-facing layer name: `warLayerEnabled` →
 * `the war layer`, `faithSpreadEnabled` → `the faith spread`. Mechanical (strip
 * the `Enabled` suffix, space the camel humps, definite article) so every new
 * flag humanizes without a hand-kept table.
 * @param {string} key
 * @returns {string}
 */
export function humanizeFlagKey(key) {
  const words = humanizeToken(String(key ?? '').replace(/Enabled$/, ''));
  return words ? `the ${words}` : '';
}

/**
 * ⭐⭐ THE AUTHORED DISPLAY LEXICON — TYPED BUCKETS, CLOSED AND ENUMERABLE (DA.L4).
 *
 * DATA, never a branch: each bucket is one engine vocabulary whose raw token
 * reaches a reader, mapped to the word the product actually wants said. A bucket
 * exists ONLY where the producer's vocabulary is closed and was ENUMERATED — not
 * where it merely looked closed.
 *
 * ⛔ TWO VOCABULARIES WERE ASKED FOR AND REFUSED A BUCKET, and the refusals are
 * the reason this table is small enough to trust:
 *   · news `kind` — measured at ~200 distinct tokens across 415 emit sites in
 *     `domain/worldPulse/`. An authored table over that is a hand-kept list that
 *     rots on the next emitter, so those sites take the general `humanizeToken`
 *     chokepoint instead. A table nobody can keep complete is worse than none.
 *   · supply-chain `chainId` — DERIVED (`snakeCase(chain.chainId || chain.label)`
 *     over node uids), so it has no enumerable domain at all.
 *
 * ⭐ A THIRD VOCABULARY WAS ADMITTED IN 2026-09 (LT39 car 3), AND IT IS WORTH
 * SAYING WHY IT IS NOT THE `news kind` CASE ABOVE WEARING A DIFFERENT HAT.
 * `incidentType` — the type token on a relationship's durable incident/archive
 * rows — reaches a reader for the first time through the relationship chronicle
 * (display/relationshipChronicle.js), and the only humanizer that existed for it
 * was relationshipMemory's `titleForType`, which swaps underscores for spaces and
 * therefore hands a reader `coalition betrayal` and `label proposal applied` as if
 * they were English. The news-kind refusal's actual objection was not SIZE, it was
 * ROT: "a hand-kept list that rots on the next emitter". So this bucket is not
 * hand-kept. Its key set is bound EXACT-SET-BOTH-WAYS to the producers by
 * tests/lint/vocabularyTotality.walker.test.js, which rescans src/domain on every
 * gate run: a writer that mints a new incident literal REDS until it has a row
 * here, and a row whose producer left REDS until it is deleted. That is the
 * difference between a table nobody can keep complete and one nobody can leave
 * incomplete.
 *
 * ⚠ AND THE HALF THAT IS NOT CLOSED IS SAID OUT LOUD, not papered over.
 * Three producer shapes are OPEN BY CONSTRUCTION and can never have rows:
 * `stressor_resolved:<stressor type>` and `canon_<event type>` compose their token
 * from another vocabulary at write time, and `relationshipMemory` falls back to the
 * outcome's `candidateType`, which is the ~200-token drama-candidate vocabulary the
 * news-kind refusal already measured. Those take INCIDENT_FAMILIES and the honest
 * unknown-token fallback below, and the walker asserts each family's producer is
 * still where it is declared to be. A reader never meets a raw token either way.
 *
 * The two that DID enumerate:
 *   · `tradeRouteAccess` — exactly five values, read off the generator's own
 *     `TERRAIN_ROUTE_POOLS` and its coastal pools (`generators/steps/resolveConfig.js`).
 *     ⭐ `isolated` is the one that earns its label outright: the reader cannot
 *     be expected to know that the word is about TRADE ACCESS rather than the
 *     settlement's mood.
 *   · `supplyChainStatus` — the five legacy values `settlement.schema.js` records
 *     the generator as producing, which is the shape `economicState.activeChains`
 *     still carries. `entrepot` is a term of art; the rest stay near their token
 *     because a reader who sees "Impaired" has been told the truth.
 *
 * ⚠ NO LABEL HERE INVENTS A FACT THE ENGINE DOES NOT HOLD. `vulnerable` is left
 * near its token deliberately: `inferSupplyChains.js` sets it for a chain that is
 * DISCOVERED-BUT-UNCONFIRMED, so a confident word like "Fragile" would tell the
 * reader something the value does not mean.
 */
/** @type {Readonly<Record<string, Readonly<Record<string, string>>>>} */
const DISPLAY_LEXICON = Object.freeze({
  tradeRouteAccess: Object.freeze({
    crossroads: 'Trade crossroads',
    road: 'Road route',
    river: 'River route',
    port: 'Port',
    isolated: 'No trade route',
  }),
  supplyChainStatus: Object.freeze({
    operational: 'Operational',
    running: 'Running',
    entrepot: 'Transhipment hub',
    vulnerable: 'Vulnerable',
    impaired: 'Impaired',
  }),
  /**
   * ⭐ THE INCIDENT VOCABULARY (LT39 car 3). One clause per type, in the past
   * tense, because every one of these is read in a DATED list: "week 3 of spring,
   * year 2 — A raid crossed the border." No engine noun, no schema word, no
   * number a reader would have to translate.
   *
   * GROUPED BY PRODUCER so the walker's exact-set arms and a human reader are
   * looking at the same thing. Every key is proved to be live by a rescan of
   * src/domain on each gate run; nothing here is a guess about what the engine
   * might emit one day.
   */
  incidentType: Object.freeze({
    // — the relationship rule families (relationshipRulesCore / -Adversarial) —
    alliance_overture: 'An alliance was sounded out',
    appeal_for_protection: 'Protection was asked for',
    arms_race: 'Each side armed against the other',
    border_incident: 'Blood was spilled at the border',
    cold_war_support: 'Quiet help went to a rival’s enemy',
    conflict_obligation: 'An ally was pressed to take a side',
    debt_spiral: 'Debts ran past what could be repaid',
    espionage: 'Spies were set on the other side',
    forced_alignment: 'A side was chosen under pressure',
    forced_tribute: 'Tribute was taken by force',
    negotiation: 'They sat down to talk',
    overlord_weakness_memory: 'The overlord was seen to falter',
    patron_intervention: 'The patron stepped in',
    protection_racket: 'Protection was sold under threat',
    proxy_conflict: 'They fought each other through others',
    raid: 'A raid crossed the border',
    rebellion_quashed: 'A revolt was put down',
    route_disruption: 'A trade road was cut',
    sabotage: 'Something was wrecked in the dark',
    smuggling_expansion: 'The smuggling trade widened',
    smuggling_pressure: 'Smugglers pressed on the border',
    stable_vassalage: 'The vassalage held quietly',
    supply_sanctions: 'Supplies were cut off as a punishment',
    trade_coercion: 'Trade was used as a threat',
    trade_embargo: 'An embargo closed the trade',
    tribute_extraction: 'Tribute was taken',
    vassal_cold_war_support: 'A vassal quietly backed the other side',
    vassal_extraction: 'The overlord took more from its vassal',
    vassal_protection: 'The overlord shielded its vassal',
    // — war, coalitions and the peace table —
    coalition_betrayal: 'A coalition partner turned on the rest',
    coalition_joined: 'The war coalition was joined',
    coalition_joined_war_edge: 'A neighbour was drawn into the war',
    coalition_refused: 'A call to the coalition was refused',
    coalition_reimbursement_forgiven: 'A war debt was forgiven',
    coalition_reimbursement_paid: 'A war reimbursement was paid',
    coalition_reimbursement_partial: 'A war reimbursement was only part paid',
    coalition_reimbursement_unpaid: 'A war reimbursement went unpaid',
    coalition_separate_peace: 'A partner made its own peace',
    coalition_separate_peace_recorded: 'A partner made its own peace',
    coalition_settlement_paid: 'A coalition debt was settled',
    coalition_settlement_unpaid: 'A coalition debt went unpaid',
    coalition_settlement_transfer_paid: 'What was owed was handed over as agreed',
    coalition_settlement_transfer_partial: 'Only part of what was owed was handed over',
    coalition_settlement_transfer_unpaid: 'What was owed was never handed over',
    coalition_forgiveness_forgiven: 'A war debt was written off',
    compelled_alliance: 'An alliance was imposed by treaty',
    mediation: 'A third party brokered between them',
    peace_refused: 'An offer of peace was refused',
    razing_witnessed: 'A town was put to the torch, and they saw it',
    tribute_strain: 'The tribute told on the side paying it',
    // — the chronicle's own alliance-call rows (relationshipChronicle.js) —
    alliance_call_joined: 'The summons was answered',
    alliance_call_refused: 'The summons was refused',
    // — statecraft, intrigue and the covert families —
    approach_exposed: 'A quiet approach was found out',
    deception_betrayal: 'A lie was exposed, and it had been believed',
    foreign_corruption_exposed: 'Foreign hands in the court were exposed',
    sovereignty_sale: 'A claim of rule was sold',
    spy_exposed: 'A spy was caught',
    // — the settlement-strategy levers (settlementStrategy.js) —
    credit_extended: 'Credit was extended',
    embargo: 'An embargo was declared',
    legitimacy_consolidation: 'They shored up each other’s standing',
    missionary_outreach: 'Missionaries were sent',
    opportunity_marking: 'A weakness was marked for later',
    prestige_display: 'Strength was paraded',
    trade_reroute: 'The trade was routed around them',
    // — the memory weave (MEMORY_WEAVE_INCIDENT_TYPES) —
    elite_amity: 'Their leading families drew closer',
    elite_feud: 'Their leading families fell out',
    rite_imposed: 'A rite was imposed on them',
    route_seized: 'A trade route was seized',
    // — relief and credit between neighbours (RELIEF_INCIDENT_KINDS) —
    credit_defaulted: 'A grain debt fell into default',
    credit_repaid: 'A grain debt was repaid',
    refuge_granted: 'Refuge was opened to the displaced',
    relief_given: 'Grain was sent in the lean season',
    relief_received: 'Relief arrived when the granaries ran low',
    relief_refused: 'The ask for relief was turned away',
    trade_warmth: 'A trade was struck, and it warmed them',
    // — the standing itself changing (the two archive-row types) —
    hierarchy_resolution: 'Who answered to whom was settled',
    label_proposal_applied: 'The standing between them changed',
    // — a party at the table (partyImpact.js) —
    party_broker_relationship: 'The party brokered between them',
    party_inflame_relationship: 'The party inflamed things between them',
  }),
});

/**
 * ⛔ WHO MAY BE TOLD. The engine records NO visibility field on an incident, and
 * among the writers are corruptionWeb, espionageGauntlet and informationStatecraft
 * — so a surface that rendered every row would put DM truth on a share or gallery
 * path. Adding a per-incident visibility marker is a persistence-shape change and
 * therefore owner-gated; this table is the display-side answer that needs no
 * engine byte.
 *
 * THREE VALUES, AND THE THIRD IS THE POINT. `public` is a fact the world can see
 * and may be shown to anyone. `covert` is DM knowledge. Anything with NO row is
 * `unclassified`, and a non-DM reader is shown ONLY `public` — so an incident type
 * nobody has classified is hidden rather than leaked. That is what fail-closed
 * means on a seam the data does not mark.
 *
 * Keyed identically to DISPLAY_LEXICON.incidentType, both ways, by the walker.
 * @type {Readonly<Record<string, 'public'|'covert'>>}
 */
const INCIDENT_DISCLOSURE = Object.freeze({
  alliance_call_joined: 'public',
  alliance_call_refused: 'public',
  alliance_overture: 'public',
  appeal_for_protection: 'public',
  approach_exposed: 'covert',
  arms_race: 'public',
  border_incident: 'public',
  coalition_betrayal: 'public',
  coalition_forgiveness_forgiven: 'public',
  coalition_joined: 'public',
  coalition_joined_war_edge: 'public',
  coalition_refused: 'public',
  coalition_reimbursement_forgiven: 'public',
  coalition_reimbursement_paid: 'public',
  coalition_reimbursement_partial: 'public',
  coalition_reimbursement_unpaid: 'public',
  coalition_separate_peace: 'public',
  coalition_separate_peace_recorded: 'public',
  coalition_settlement_paid: 'public',
  coalition_settlement_transfer_paid: 'public',
  coalition_settlement_transfer_partial: 'public',
  coalition_settlement_transfer_unpaid: 'public',
  coalition_settlement_unpaid: 'public',
  // The support is QUIET by its own name: the point of cold-war backing is that
  // the backed party's enemy does not know who is paying for it.
  cold_war_support: 'covert',
  compelled_alliance: 'public',
  conflict_obligation: 'public',
  credit_defaulted: 'public',
  credit_extended: 'public',
  credit_repaid: 'public',
  debt_spiral: 'public',
  deception_betrayal: 'covert',
  elite_amity: 'public',
  elite_feud: 'public',
  embargo: 'public',
  espionage: 'covert',
  forced_alignment: 'public',
  forced_tribute: 'public',
  foreign_corruption_exposed: 'covert',
  hierarchy_resolution: 'public',
  label_proposal_applied: 'public',
  legitimacy_consolidation: 'public',
  mediation: 'public',
  missionary_outreach: 'public',
  negotiation: 'public',
  // A weakness someone has privately marked for later is the marker's secret.
  opportunity_marking: 'covert',
  overlord_weakness_memory: 'public',
  party_broker_relationship: 'public',
  party_inflame_relationship: 'public',
  patron_intervention: 'public',
  peace_refused: 'public',
  prestige_display: 'public',
  protection_racket: 'covert',
  proxy_conflict: 'covert',
  raid: 'public',
  razing_witnessed: 'public',
  rebellion_quashed: 'public',
  refuge_granted: 'public',
  relief_given: 'public',
  relief_received: 'public',
  relief_refused: 'public',
  rite_imposed: 'public',
  route_disruption: 'public',
  route_seized: 'public',
  sabotage: 'covert',
  smuggling_expansion: 'covert',
  smuggling_pressure: 'covert',
  sovereignty_sale: 'public',
  // The exposure is public; that a spy was THERE is the secret it reveals, and
  // the pair it names is exactly the pair that would rather it stayed quiet.
  spy_exposed: 'covert',
  stable_vassalage: 'public',
  supply_sanctions: 'public',
  trade_coercion: 'public',
  trade_embargo: 'public',
  trade_reroute: 'public',
  trade_warmth: 'public',
  tribute_extraction: 'public',
  tribute_strain: 'public',
  vassal_cold_war_support: 'covert',
  vassal_extraction: 'public',
  vassal_protection: 'public',
});

/**
 * THE OPEN PRODUCER SHAPES — the ones that compose their token at write time from
 * another vocabulary and therefore CANNOT have a row. Each declares the file that
 * writes it (the walker asserts the producer is still there, the curated
 * safety-token precedent) and a phrase template that folds the composed tail back
 * into English.
 *
 * `test` is deliberately anchored: a family must match a PREFIX, never a
 * substring, or a future literal containing `canon_` in the middle would silently
 * inherit a family's words.
 * @type {ReadonlyArray<Readonly<{ id: string, prefix: string, producer: string, disclosure: 'public'|'covert', phrase: (tail: string) => string }>>}
 */
const INCIDENT_FAMILIES = Object.freeze([
  Object.freeze({
    id: 'stressor-resolved',
    prefix: 'stressor_resolved:',
    producer: 'src/domain/worldPulse/stressorDynamics.js',
    disclosure: /** @type {'public'} */ ('public'),
    phrase: (/** @type {string} */ tail) => `The pressure they shared ended: ${tail}`,
  }),
  Object.freeze({
    id: 'canon-event',
    prefix: 'canon_',
    producer: 'src/domain/worldPulse/canonRelationshipImpact.js',
    disclosure: /** @type {'public'} */ ('public'),
    phrase: (/** @type {string} */ tail) => `Something you wrote into the world touched them: ${tail}`,
  }),
]);

/** The families, exported so a walker can ENUMERATE them rather than restate them. */
export { INCIDENT_DISCLOSURE, INCIDENT_FAMILIES };

/** The lexicon, exported so a walker can ENUMERATE it rather than restate it. */
export { DISPLAY_LEXICON };

/**
 * A typed engine token as its authored reader label.
 *
 * Unknown or future tokens stay legible through the general humanizer rather
 * than leaking underscores or silently disappearing — the same fallthrough
 * `settlementSizeLabel` uses, and the reason a bucket may be incomplete without
 * becoming a hole.
 *
 * @param {string} bucket
 * @param {unknown} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function displayLabel(bucket, value, fallback = '') {
  const key = String(value ?? '').trim().toLowerCase();
  if (!key) return fallback;
  const authored = DISPLAY_LEXICON[bucket]?.[key];
  if (authored) return authored;
  const words = humanizeToken(value);
  return words ? `${words.charAt(0).toUpperCase()}${words.slice(1)}` : fallback;
}

/** The family whose PREFIX an incident type carries, or null. @param {string} key */
function incidentFamilyOf(key) {
  return INCIDENT_FAMILIES.find((f) => key.startsWith(f.prefix)) || null;
}

/**
 * ONE INCIDENT TYPE AS A CLAUSE A READER CAN LIVE INSIDE.
 *
 * Three answers in strict order: the authored row, the open family's template,
 * and — for a token neither knows — AN HONEST SENTENCE that says the record kept
 * only a shorthand, rather than a bare `coalition_betrayal` or a de-underscored
 * `label proposal applied` pretending to be English. The fallback is deliberately
 * NOT silence: an event the record holds is a fact, and dropping it would be a
 * worse lie than admitting the words are thin.
 *
 * Total on garbage (empty ⇒ the fallback sentence's own empty form).
 * @param {unknown} type
 * @returns {string}
 */
export function incidentPhrase(type) {
  const key = String(type ?? '').trim();
  if (!key) return 'Something happened that the record does not name';
  const authored = DISPLAY_LEXICON.incidentType[key.toLowerCase()];
  if (authored) return authored;
  const family = incidentFamilyOf(key.toLowerCase());
  if (family) {
    const tail = humanizeToken(key.slice(family.prefix.length));
    if (tail) return family.phrase(tail);
  }
  return `Something the record types only as “${humanizeToken(key)}”`;
}

/**
 * WHO MAY BE TOLD about one incident type — `public`, `covert`, or `unclassified`
 * for a token no table knows.
 *
 * ⛔ FAIL-CLOSED IS THE CALLER'S JOB AND THIS IS THE FUNCTION THAT MAKES IT
 * POSSIBLE: it never guesses `public`. A surface shows a row to a non-DM reader
 * only on an explicit `public`, so an unclassified type is hidden by default
 * rather than leaked by default.
 * @param {unknown} type
 * @returns {'public'|'covert'|'unclassified'}
 */
export function incidentDisclosure(type) {
  const key = String(type ?? '').trim().toLowerCase();
  if (!key) return 'unclassified';
  const declared = INCIDENT_DISCLOSURE[key];
  if (declared) return declared;
  const family = incidentFamilyOf(key);
  return family ? family.disclosure : 'unclassified';
}

/**
 * Humanize a slot that carries EITHER an engine token OR authored prose.
 *
 * ⛔ THE CHRONICLE'S TITLE IS EXACTLY THAT SLOT and it is why this exists rather
 * than the plain humanizer: `chronicleFeed.js` fills it from
 * `raw.title || raw.label || raw.name || raw.type || raw.kind || …`, so the same
 * span renders an authored headline one row and a `succession_coup` token the
 * next. Routing the whole slot through `humanizeToken` would lowercase every
 * real headline; leaving it raw lets camelCase tokens through, which is the leak.
 *
 * So the token test is STRUCTURAL: anything containing whitespace is prose and is
 * returned untouched, and a lone word with no separator and no camel hump is
 * already a word. Only a separator-or-hump token is humanized.
 *
 * @param {unknown} value
 * @param {string} [fallback]
 * @returns {string}
 */
export function humanizeIfToken(value, fallback = '') {
  const raw = String(value ?? '').trim();
  if (!raw) return fallback;
  if (/\s/.test(raw)) return raw;
  if (!/[_-]/.test(raw) && !/[a-z0-9][A-Z]/.test(raw)) return raw;
  return humanizeToken(raw);
}
