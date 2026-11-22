// @ts-check
/**
 * domain/display/galleryWithholdAlways.js — WHAT NO NON-OWNER READ SENDS, WHATEVER THE VEIL (VEIL-21, R2; the sixth
 * chair's VR16 rule 1, the seventh chair's VR28, VR33, VR37, each vetoable by the owner; SUB-BRIEF-VR7 point 5).
 *
 * The client twin of migration 212 :: _gallery_veil_withhold_always (and _gallery_veil_minus_at, _each_minus_at,
 * _gallery_veil_cast), rule for rule, each rule naming its row of the roster-choice registry
 * (src/domain/veil/rosterChoiceRegistry.js). 212 :: _gallery_veil runs it last on every body it returns, an unmarked
 * listing's projection among them; galleryVeil.js :: applyVeil runs it last and projectShareVeil on the unmarked path.
 * The page re-derives what it draws of these from the served document (src/domain/veil/pageRederive.js). The owner's own
 * reads never come here. Pure in kind: works in place on the veil's own copy.
 */
import { withholdCastByServed } from './gallerySecondHomes.js';

/** @typedef {Record<string, unknown>} Rec */

/** @param {unknown} v @returns {v is Rec} */
function isRec(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
/** @param {Rec} s @param {string} key @returns {Rec | null} */
function recAt(s, key) {
  const v = s[key];
  return isRec(v) ? v : null;
}

/** The record at `path` (each step an object), or null. @param {Rec} s @param {ReadonlyArray<string>} path @returns {Rec | null} */
function recPath(s, path) {
  /** @type {unknown} */ let v = s;
  for (const k of path) { if (!isRec(v)) return null; v = v[k]; }
  return isRec(v) ? v : null;
}
/** The object at `path` loses `keys` (in place). @param {Rec} s @param {ReadonlyArray<string>} path @param {ReadonlyArray<string>} keys */
function minusAt(s, path, keys) {
  const o = path.length ? recPath(s, path) : s;
  if (o) for (const k of keys) delete o[k];
}
/** Each object of the array at `path` loses `keys` (in place). @param {Rec} s @param {ReadonlyArray<string>} path @param {ReadonlyArray<string>} keys */
function eachMinusAt(s, path, keys) {
  const parent = path.length > 1 ? recPath(s, path.slice(0, -1)) : s;
  const list = parent ? parent[path[path.length - 1]] : null;
  if (Array.isArray(list)) for (const e of list) if (isRec(e)) for (const k of keys) delete e[k];
}
/**
 * VEIL-21 (R2-CURE; VR37 (a), the page re-derives from the served document): A SERVED MEMBERSHIP IS A PUBLIC ONE. Every
 * membership 212 sends on a Reveal-DM-off read passed the server's projection (211's twin of publicSafe.js ::
 * publicMembershipsOf: the entries stamped `veiled: false`), and 212 :: _gallery_veil_withhold_always then withholds the
 * stamp itself (registry: npcs.memberships.veiled). The page re-projects an unmarked body with toPublicSafe, whose
 * per-entry law keeps only stamped entries, so without the stamp it drew every card's memberships EMPTY where the server
 * sent them (tests/security/galleryServerVeil.pglite.test.js, measured at R2's 12a371c0b: the unmarked gallery page, the
 * import and the map member of 7 of its 8 towns). The page restamps what the server sent, on a COPY (the response is not
 * touched); the twin's unmarked path (projectShareVeil -> withholdAlways) removes the stamp again, so the page model equals
 * the served body. Called on the server's own `data` alone (gallery.js :: sanitizeDossier), never on a frozen copy a read
 * carried beside it; an entry that carries a stamp keeps it. It adds nothing the response does not already hold.
 * @template T @param {T} doc @returns {T}
 */
export function restampServedMemberships(doc) {
  if (!isRec(doc) || !Array.isArray(doc.npcs)) return doc;
  /** @param {unknown} m */
  const bare = (m) => isRec(m) && !('veiled' in m);
  let moved = false;
  const npcs = doc.npcs.map((n) => {
    if (!isRec(n) || !Array.isArray(n.memberships) || !n.memberships.some(bare)) return n;
    moved = true;
    return { ...n, memberships: n.memberships.map((m) => (bare(m) ? { .../** @type {Rec} */ (m), veiled: false } : m)) };
  });
  return /** @type {T} */ (moved ? { ...doc, npcs } : doc);
}

/** The power's band word before its cause (VR19 (a), ruling 5): the cause runs from the first '(', em dash or ';', with the spaces before it. */
const STABILITY_CAUSE = /[ ]*[(—;][\s\S]*$/;

/**
 * VEIL-21 (R2): every non-owner read's last pass, whatever the veil (in place, on the veil's own copy). Each rule names its
 * row of the roster-choice registry (src/domain/veil/rosterChoiceRegistry.js); 212 :: _gallery_veil_withhold_always holds
 * the same rules in the same order. A fixed-path pass: no text is scanned.
 * @param {Rec} s @returns {Rec}
 */
export function withholdAlways(s) {
  if (!isRec(s)) return s;
  // registry: conditions.severity (VR37: the number withheld; its band, severityBand, is sent as stored, tier 2)
  eachMinusAt(s, ['activeConditions'], ['severity']);
  // registry: defence.readiness.score (VR37: the label and its colours stay, tier 2)
  minusAt(s, ['defenseProfile', 'readiness'], ['score']);
  // registry: defence.scores.disaster
  // registry: defence.scores.economic
  // registry: defence.scores.internal
  // registry: defence.scores.magical
  // registry: defence.scores.military
  // registry: defence.scores.monster (VR33)
  minusAt(s, ['defenseProfile', 'scores'], ['disaster', 'economic', 'internal', 'magical', 'military', 'monster']);
  // registry: defence.economicGates (VR33: every gate, so the object goes whole)
  minusAt(s, ['defenseProfile'], ['economicGates']);
  // registry: compound.criminalEffective
  // registry: compound.criminalPreStress
  // registry: compound.economyOutput
  // registry: compound.magicInfluence
  // registry: compound.militaryEffective
  // registry: compound.religionInfluence
  minusAt(s, ['economicState', 'compound'], ['criminalEffective', 'criminalPreStress', 'economyOutput', 'magicInfluence', 'militaryEffective', 'religionInfluence']);
  // registry: safety.compound.criminalEffective
  // registry: safety.compound.criminalPreStress
  // registry: safety.compound.economyOutput
  // registry: safety.compound.magicInfluence
  // registry: safety.compound.militaryEffective
  // registry: safety.compound.religionInfluence
  minusAt(s, ['economicState', 'safetyProfile', 'compound'], ['criminalEffective', 'criminalPreStress', 'economyOutput', 'magicInfluence', 'militaryEffective', 'religionInfluence']);
  // registry: food.storageMonths
  // registry: food.storageNote
  minusAt(s, ['economicState', 'foodSecurity'], ['storageMonths', 'storageNote']);
  // registry: income.weight (item D withholds it in applyVeil and the unmarked read; here the map's unmarked member too)
  eachMinusAt(s, ['economicState', 'incomeSources'], ['weight']);
  // registry: economy.situationDesc
  minusAt(s, ['economicState'], ['situationDesc']);
  // registry: safety.blackMarketCapture
  // registry: safety.safetyRatio
  // registry: safety.crimeTypes (R3-TELL-8, ruling (b): the key on no shared read; the page re-derives it, pageRederive.js ::
  // rederiveCrimeTypes, where the served data proves its grouping open)
  minusAt(s, ['economicState', 'safetyProfile'], ['blackMarketCapture', 'safetyRatio', 'crimeTypes']);
  // registry: safety.flags.anyActive
  // registry: safety.flags.arcaneBlackMarket
  // registry: safety.flags.merchantArmy
  // registry: safety.flags.religiousFraud
  // registry: safety.flags.merchantCriminalBlur
  minusAt(s, ['economicState', 'safetyProfile', 'flags'], ['anyActive', 'arcaneBlackMarket', 'merchantArmy', 'religiousFraud', 'merchantCriminalBlur']);
  // registry: history.timeline.anchored
  // registry: history.timeline.year
  eachMinusAt(s, ['history', 'eventsTimeline'], ['anchored', 'year']);
  // registry: history.event.anchored
  eachMinusAt(s, ['history', 'historicalEvents'], ['anchored']);
  // registry: history.legacy
  // registry: history.siegeNarrative
  minusAt(s, ['history'], ['legacyAnnotations', 'siegeNarrative']);
  // registry: npcs.stressNote
  eachMinusAt(s, ['npcs'], ['stressNote']);
  // registry: npcs.memberships.veiled
  if (Array.isArray(s.npcs)) for (const n of s.npcs) if (isRec(n)) eachMinusAt(n, ['memberships'], ['veiled']);
  // registry: power.fingerprint
  minusAt(s, ['powerStructure'], ['economyInputFingerprint']);
  // registry: power.contestsNiche
  // registry: power.rawPower
  // registry: power.factions.legitimacyCrisis
  eachMinusAt(s, ['powerStructure', 'factions'], ['contestsNiche', 'rawPower', 'legitimacyCrisis']);
  // registry: power.relation.ratio (power.relation.direction is DRAWN, VR37: it goes with its relation, per entry)
  eachMinusAt(s, ['powerStructure', 'factionRelationships'], ['ratio']);
  // registry: legitimacy.breakdown
  minusAt(s, ['powerStructure', 'publicLegitimacy', 'breakdown'], ['prosperity', 'safety', 'defense']);
  // registry: legitimacy.crimMultiplier
  // registry: legitimacy.govMultiplier
  // registry: legitimacy.flags
  minusAt(s, ['powerStructure', 'publicLegitimacy'], ['crimMultiplier', 'govMultiplier', 'isApproved', 'isContested', 'isEndorsed', 'isTolerated', 'governanceFractured', 'isLegitimacyCrisis']);
  // registry: power.stability (VR19 (a), ruling 5): the band word before its cause stays; the cause goes; a value that is
  // not a string, or no word before its cause, goes
  const ps = recAt(s, 'powerStructure');
  if (ps && 'stability' in ps) {
    const word = typeof ps.stability === 'string' ? ps.stability.replace(STABILITY_CAUSE, '') : '';
    if (word !== '') ps.stability = word; else delete ps.stability;
  }
  // registry: prose.incomeWeight.alias
  // registry: prose.shadowEconomy.alias
  for (const k of ['economy:daily_life', 'economy:resources', 'economy:services']) minusAt(s, ['publicProse', 'blocks', k], ['incomeWeight', 'shadowEconomy']);
  // registry: prose.prosperity.glance
  minusAt(s, ['publicProse', 'blocks', 'economy:economics', 'prosperityHeader'], ['glance']);
  minusAt(s, ['publicProse', 'blocks', 'economy:economics', 'prosperityRung'], ['glance']);
  // registry: prose.conditionSeverity.glance
  minusAt(s, ['publicProse', 'blocks', 'stressors:overview', 'conditionSeverity'], ['glance']);
  // registry: spatial.quarters
  minusAt(s, ['spatialLayout'], ['quarters']);
  // registry: cast.absent
  // registry: cast.stakes
  // registry: cast.roles (castByServed: absent always; a stake or a role row per entry, by what is
  // served of the person, power or house it names)
  withholdCastByServed(s);
  return s;
}
