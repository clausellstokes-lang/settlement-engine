/**
 * generators/safetyLineTruth.js — UPKEEP-8 (2026-11-13): what the safety profile's lines read to say only what the
 * record holds. The round-three cut's #375 #459 #713 #1201 #1080 #1173 #1377, the increment's #ww-516 and #ww-275,
 * and the measuring seat's census in `safetyProfile.js` (CENSUS-2: a court named where no courthouse stands; a size
 * word in a small place). The sizes, the gang houses, the hunger, and the guard line's two readings after the
 * defence profile (the pay by the Economic Survival band, the force by the military band; a patrol whose supply is
 * cut off). Pure: no draw, no clock, no write.
 */
import { scoreBand } from '../domain/display/defenseScoreBands.js';
import { partitionDefenseInstitutions } from '../domain/institutions/defenseInstitutionBuckets.js';
import { lineText } from '../domain/facts/drawDeclared.js';
import { CRIMINAL_GOVERNANCE_TYPE, criminalSeatGoverns, gangHousesOf } from '../domain/crimeSignal.js';
import { criminalStructureKeyOf, covertCrimeHeld } from '../domain/facts/criminalStructureKey.js';
import { watchIsUnpaidRota } from '../domain/facts/guardPay.js';
import { liveInstitutions } from '../domain/institutions/institutionRoster.js';
/** BAR4-SAFETY (F3): the crime key's own reading of the record's criminal income, for the survival line (`safetyProfile.js`). */
export { covertCrimeHeld };

/** The census's small places (a district, a military command); TINY: streets too. */
/** BAR2-LABELS LB5 (the chair's ruling of 2026-11-15, vetoable by the owner): the siege's order clause where no force stands
 * (`safetyProfile.js` prints it in place of "Those holding the place keep order, and more harshly as the food runs down"). */
export const SIEGE_NO_FORCE_ORDER = 'No one is set to keep order here, and it frays as the food runs down';
export const SMALL_PLACES = Object.freeze(['thorp', 'hamlet', 'village']);
export const TINY_PLACES = Object.freeze(['thorp', 'hamlet']);

/** How many gang houses the roster holds: the crime home's reader (`crimeSignal.js :: gangHousesOf`), under its old name. */
export const GANG_HOUSES_OF = gangHousesOf;

/** The survival-crime line beside a network where the record holds no hunger (#1173): the same theft, not called hunger. */
export const THEFT_NETWORK_DESC =
  'Theft of food, livestock, and stored goods by people with too little. Enforcement struggles to distinguish survival crime from organised theft.';

/**
 * Does the record hold hunger: a famine or a siege on the food record, or its band at famine or deficit.
 * @param {any} economicState @returns {boolean}
 */
export function hungerIn(economicState) {
  const food = economicState?.foodSecurity;
  return food?.hasFamine === true || food?.hasSiege === true || ['famine', 'deficit'].includes(String(food?.foodRecord?.band ?? ''));
}

/** The merchant army's line beside a standing watch or garrison (#1080): its companies serve their own, never back the garrison. */
export const MERCHANT_ARMY_BESIDE = /^(?:The merchant guilds|Wealthy interests) keep their own (?:mercenary companies|private security) beside the /;

/** "Exists on paper. Chronically underpaid" (#713, #1201): the pay read from the Economic Survival band, the force from the military band. */
const PAPER_RE = /^The (.+?) exists? on paper\. Chronically underpaid and poorly equipped(: these are volunteers with day jobs, not soldiers)?\. Susceptible to bribery; enforcers who can be bought by whoever has coin\./;

/**
 * @param {string} text @param {unknown} prosperity the purse word (Prosperous, Moderate, Poor) @param {{ forceScore?: unknown }} read the military score
 * @returns {string}
 */
export function paperTruth(text, prosperity, read) {
  const m = PAPER_RE.exec(text);
  if (!m || typeof read.forceScore !== 'number') return text;
  const held = ['STRONG', 'ADEQUATE'].includes(scoreBand(read.forceScore));
  const paid = ['Prosperous', 'Wealthy', 'Comfortable', 'Moderate'].includes(String(prosperity));
  if (!held && !paid) return text;
  const many = manyForce(m[1]);
  const lead = held && paid ? `Some of the ${m[1]} take bribes from whoever has coin.`
    : held ? `The ${m[1]} ${many ? 'are' : 'is'} chronically underpaid and poorly equipped${m[2] || ''}. Susceptible to bribery; enforcers who can be bought by whoever has coin.`
      : `The ${m[1]} ${many ? 'exist' : 'exists'} on paper${m[2] || ''}. Susceptible to bribery; enforcers who can be bought by whoever has coin.`;
  return lead + text.slice(m[0].length);
}

/**
 * THE DEFENDERS' PAY HAS ONE HOME (BAR2-LABELS-2 LB4, the chair's ruling of 2026-11-15, vetoable by the owner): the
 * defence generator's funded gate of the forces over the town's keep, `defenseProfile.economicGates.military` (0 to 1;
 * 1 = fully funded; `defenseGenerator.js :: generateDefenseProfile`). The guard line's two pay claims read it, at the
 * page's own cut (DS-DEF-11 "fall short on the watch's wages" below 1): "well paid, well equipped" only at 1, "irregular
 * pay" only below it. Each takes its twin in the other state (the slot keeps its draw); a gate the record does not
 * hold (no force) changes nothing. Measured on the 720 at f8042b61a: "irregular pay" false in 17 of 19, "well paid" in
 * 1 of 42. @param {string} text @param {unknown} gate the record's military gate @returns {string}
 */
export function payTruth(text, gate) {
  if (typeof gate !== 'number' || !Number.isFinite(gate)) return text;
  // BAR4-SAFETY (F1, the fresh sample's "Chronically underpaid" beside a gate of 1): the paper line's pay claim, read by the
  // same gate: funded in full, the force is paid; its kit and its bribes stand.
  const p = gate >= 1 ? /^The (.+?) (exists?|is|are) (on paper\. )?[Cc]hronically underpaid and poorly equipped/.exec(text) : null;
  // (volunteers with day jobs take no wage claim at all: their kit is what the line still says)
  const volunteers = p ? text.slice(p[0].length).startsWith(': these are volunteers') : false;
  if (p) return `The ${p[1]} ${p[2]} ${p[3] ? `on paper. ${volunteers ? 'Poorly equipped' : 'Paid, but poorly equipped'}` : volunteers ? 'poorly equipped' : 'paid, but poorly equipped'}${text.slice(p[0].length)}`;
  const m = /^The (.+?) (?:is|are) (?:well paid, well equipped and patrols? properly\. They come when called, and though some take bribes, it is not the custom\.|well paid and well equipped, but |disciplined but resource-constrained: motivated with inadequate equipment and irregular pay\. Effective in a fight; vulnerable to sustained corruption\.)/.exec(text);
  if (!m) return text;
  const law = m[1];
  const many = manyForce(law);
  const be = many ? 'are' : 'is';
  const rest = text.slice(m[0].length);
  if (m[0].endsWith('irregular pay. Effective in a fight; vulnerable to sustained corruption.')) {
    return gate >= 1 ? `${PAID_IN_FULL(law, many)}${rest}` : text;
  }
  if (gate >= 1) return text;
  if (m[0].endsWith(', but ')) {
    // the crisis twin's paid head (`patrolTwin(…, true)`): its unpaid twin in the same crisis
    const crisis = /** @type {const} */ (['siege', 'occupied', 'famine']).find((c) => text.startsWith(String(patrolTwin(law, c, true))));
    const paid = crisis && String(patrolTwin(law, crisis, true));
    return crisis && paid ? String(patrolTwin(law, crisis)) + text.slice(paid.length) : text;
  }
  return `The ${law} ${be} disciplined but resource-constrained: motivated with inadequate equipment and irregular pay. Effective in a fight; vulnerable to sustained corruption.${rest}`;
}

/**
 * BAR4-SAFETY (kind F1, REVIEW-BAR-4 C44796; vetoable by the owner): HOW THE GUARD IS PAID HAS ONE HOME
 * (`facts/guardPay.js :: guardPayOf`), and where no garrison stands and the only watch is the village's own rota (the
 * catalogue's Village watch: "Nobody is paid, and the households hold the rota"), no guard line gives the watch a wage:
 * each pay claim the guard line can make (irregular pay, well paid, paid in full, chronically underpaid) prints its rota
 * twin, the rest of the line its own. The slot keeps its draw. @param {string} text the guard line after `payTruth`
 * @param {ReadonlyArray<{ name?: unknown } | null | undefined>} institutions the roster @returns {string}
 */
export function rotaTruth(text, institutions) {
  if (!watchIsUnpaidRota(liveInstitutions({ institutions: /** @type {any} */ (institutions) }))) return text;
  const hit = ROTA_TWINS.find(([re]) => re.test(text));
  return hit ? text.replace(hit[0], hit[1]) : text;
}
/**
 * The rota's twins, read BEFORE the gate (`keptGuardLine`): each pay claim the guard line's branches can draw, its rota
 * twin. The paid crisis head ("well paid and well equipped, but …", `patrolTwin(…, true)`) takes the unpaid crisis twin.
 * @type {ReadonlyArray<readonly [RegExp, string]>}
 */
const ROTA_TWINS = Object.freeze([
  [/^(The .+? (?:is|are)) disciplined but resource-constrained: motivated with inadequate equipment and irregular pay\./, '$1 disciplined but unpaid: neighbours who keep the rota, with little equipment.'],
  [/^(The .+? (?:is|are)) well paid, well equipped and (walk|patrol)(s?) properly\./, '$1 unpaid, but walk$3 the rounds properly.'],
  [/^(The .+?) (?:is|are) well paid and well equipped, but (?=(?:is|are) held|walks? only)/, '$1 '],
  [/^(The .+?) is well paid and well equipped, but hunger/, '$1 still walks the rounds, but hunger'],
  [/^(The .+?) are well paid and well equipped, but hunger/, '$1 still walk the rounds, but hunger'],
  [/^(The .+? exists?) on paper\. Chronically underpaid/, '$1 on paper. Unpaid'],
  [/^(The .+? (?:is|are)) chronically underpaid/, '$1 unpaid'],
].map(([re, to]) => Object.freeze(/** @type {readonly [RegExp, string]} */ ([/** @type {RegExp} */ (re), String(to)]))));

/** LB4's twin of "irregular pay" where the gate is 1 (fully funded): the same force, its pay and kit as the record holds them. */
export const PAID_IN_FULL = (/** @type {string} */ law, /** @type {boolean} */ many) =>
  `The ${law} ${many ? 'are' : 'is'} disciplined, paid in full and properly equipped. Effective in a fight; vulnerable to sustained corruption.`;

/**
 * A patrol on its usual rounds (#459) where the watch's supply is cut off (the economy's own trade dependency,
 * severity critical: "Supply route severed. Operating at minimal capacity or shut down.").
 * @param {string} text @param {{ tradeDependencies?: unknown }} read @param {(law: string) => ReadonlyArray<string>} frames
 *   the guard line's patrol frames (`safetyProfile.js :: STANDARD_PATROL`) @returns {string}
 */
export function patrolTruth(text, read, frames) {
  const deps = /** @type {Array<{ severity?: unknown, institution?: unknown, impact?: unknown } | null>} */ (Array.isArray(read.tradeDependencies) ? read.tradeDependencies : []);
  // TAIL-DISPLAY-CIVIC-3 V3: only a supply a crisis SEVERED ("Supply route severed. Operating at minimal capacity or shut
  // down.", economicState.js); a town with no trade route runs on its stockpiles ("No trade access: running on existing
  // stockpiles only.") and its watch walks its rounds (r2r-town-9: Very Safe, no crisis)
  const cut = deps.some((t) => t?.severity === 'critical' && /^Supply route severed/.test(String(t?.impact ?? '')) && partitionDefenseInstitutions([{ name: String(t?.institution ?? '') }]).watch.length > 0);
  if (!cut) return text;
  const m = /^(?:The (.+?) (?:maintains? standard|walks? the usual|patrols? on a regular|(?:is|are) well paid, well equipped and patrols?)|You will see the (.+?) on the rounds)/.exec(text);
  const law = m && (m[1] || m[2]);
  if (!law) return text;
  const many = manyForce(law);
  const lead = [...frames(law), `The ${law} ${many ? 'are' : 'is'} well paid, well equipped and ${many ? 'patrol' : 'patrols'} properly. They come when called, and though some take bribes, it is not the custom.`].find((f) => text.startsWith(f));
  return lead ? `The ${law} ${many ? 'keep what rounds they can' : 'keeps what rounds it can'} while the supplies ${many ? 'they need are' : 'it needs are'} cut off.${text.slice(lead.length)}` : text;
}

/**
 * THE PATROL A CRISIS LEAVES (TAIL-DISPLAY-CIVIC-3 V3, the chair's ruling of 2026-11-15): the ordinary patrol lines
 * ("maintain standard patrol coverage", "walk the usual rounds", "patrol on a regular round", "on the rounds most hours";
 * `safetyProfile.js :: STANDARD_PATROL`) and the well-paid line ("are well paid, well equipped and patrol properly. They
 * come when called") presume no siege, an occupier who lets the watch walk, and an order hunger has not eroded. The
 * Power tab's stability says each state in the same order (`power/governanceNarrative.js :: applyStressStability`:
 * "Critical (under siege)", "Suppressed (under occupation …)", "Desperate — hunger is eroding order"); in it the slot
 * keeps its draw and prints its twin, true in that state. None outside the three.
 * @param {(type: string) => boolean} hasStress @returns {'siege' | 'occupied' | 'famine' | null}
 */
export function patrolCrisisOf(hasStress) {
  return hasStress('under_siege') ? 'siege' : hasStress('occupied') ? 'occupied' : hasStress('famine') ? 'famine' : null;
}

/**
 * @param {string} lawRef the force's noun @param {'siege' | 'occupied' | 'famine' | null} crisis
 * @param {boolean} [paid] the well-paid line's twin (its pay and kit stand) @returns {string | null}
 */
export function patrolTwin(lawRef, crisis, paid = false) {
  if (!crisis) return null;
  const many = manyForce(lawRef);
  const head = paid ? `The ${lawRef} ${many ? 'are' : 'is'} well paid and well equipped, but ` : `The ${lawRef} `;
  if (crisis === 'siege') return `${head}${many ? 'are' : 'is'} held for the defence, and few patrols can be spared from it.`;
  if (crisis === 'occupied') return lineText({ text: `${head}${many ? 'walk' : 'walks'} only the rounds the occupiers allow.`, needs: ['crisis: occupation'] });
  return paid ? `${head}hunger is eroding the order ${many ? 'they keep' : 'it keeps'}.`
    : `${head}still ${many ? 'walk' : 'walks'} the rounds, but hunger is eroding the order ${many ? 'they keep' : 'it keeps'}.`;
}

/**
 * TAIL-DEFECON (the READ-ALL worklist's #20612 #20616): a force noun that names two bodies ("garrison and city watch")
 * takes a plural verb. The guard assessment's own noun (`safetyProfile.js`, `lawRef`): plural where it joins two.
 * @param {string} lawRef @returns {boolean}
 */
export function manyForce(lawRef) {
  return / and /.test(String(lawRef));
}

// ─── TAIL-DEFECON (2026-11-14): the READ-ALL worklist's safety rows, the safety profile's twins held here ───
/** #B14103: the small-place no-watch line under an occupation (the occupiers keep order; no one of the place is paid to). */
export const NO_WATCH_OCCUPIED = lineText({ text: 'No one of the place is paid to keep order; the occupiers keep their own. A quarrel goes to the heads of the oldest families, and most are settled before they come to blows.', needs: ['crisis: occupation'] });
/** #16495: a religious house of the roster (a church "within reach" is not one: `Access to parish church`). */
export const RELIGIOUS_HOUSE = /church|cathedral|temple|monaster|friary|shrine|abbey|chapel/i;
/** #15308: the criminal-governance line's claim, and its twin where no criminal seat governs. */
const VACUUM = ' has filled the power vacuum left by absent or failed civil authority. It provides a form of order and extracts a price for it.';
const VACUUM_TWIN = " keeps its own order where the civil authority's reach fails, and extracts a price for it.";
/** #14654: the background-crime line's lead, and its twin beside a criminal power. */
const NO_DOMINANT = 'Petty theft, minor fraud, and opportunistic violence are persistent. No single dominant organisation: just the steady pressure of too many people with too little, and too few consequences for taking.';
const NO_DOMINANT_TWIN = 'Petty theft, minor fraud, and opportunistic violence are persistent, driven by too many people with too little, and too few consequences for taking.';

/**
 * The crime lines that read the FINAL power roster (`safetyProfile.js :: settleCrimeLinesToSignal`, at assembly):
 * "filled the power vacuum" only where a criminal seat governs (#15308); "no single dominant organisation" only where
 * no criminal power stands (#14654). Draw-free; an entry that changes is copied.
 * @template {{ type?: unknown, desc?: unknown }} C
 * @param {C[]} entries @param {unknown} seats the roster's seats @param {boolean} powers a criminal power stands
 * @returns {C[]}
 */
export function settleRosterCrimeLines(entries, seats, powers) {
  const governs = criminalSeatGoverns(seats); // the crime home's reader (TAIL-CLOSE-SRC-3)
  return entries.map((entry) => {
    const desc = typeof entry?.desc === 'string' ? entry.desc : '';
    if (entry?.type === CRIMINAL_GOVERNANCE_TYPE && !governs && desc.endsWith(VACUUM)) return { ...entry, desc: desc.slice(0, -VACUUM.length) + VACUUM_TWIN };
    if (entry?.type === 'Background crime' && powers && desc.startsWith(NO_DOMINANT)) return { ...entry, desc: NO_DOMINANT_TWIN + desc.slice(NO_DOMINANT.length) };
    return entry;
  });
}

/** The deserter lines (TAIL-DEFECON's small-place line and the full one; `safetyProfile.js`, wartime). */
export const DESERTERS_FED_TINY = 'Deserters passing through need food and discretion, and some here give both. Officially classified as harbouring criminals.';
export const DESERTERS_FED = 'Deserters passing through require food, forged papers, and discretion. A small industry has emerged to provide all three. Officially classified as harbouring criminals.';
/** @type {Readonly<Record<string, string>>} */
const DESERTERS_UNFED = Object.freeze({
  [DESERTERS_FED_TINY]: 'Deserters passing through need shelter and discretion, and some here give both. Officially classified as harbouring criminals.',
  [DESERTERS_FED]: 'Deserters passing through require shelter, forged papers, and discretion. A small industry has emerged to provide all three. Officially classified as harbouring criminals.',
});

/**
 * UNDER HUNGER NO LINE OFFERS FOOD (TAIL-DISPLAY-CIVIC-3 V3, the chair's law): where the record holds hunger
 * (`hungerIn`, read at assembly by `safetyProfile.js :: settleCrimeLinesToSignal`), the deserters are given shelter, not
 * food (a famine thorp with a tenth of a month in store, r2s-wartime-thorp-2). Draw-free; an entry that changes is copied.
 * @template {{ type?: unknown, desc?: unknown }} C @param {C[]} entries @returns {C[]}
 */
export function settleDesertersUnfed(entries) {
  return entries.map((entry) => {
    const twin = entry?.type === 'deserter networks' ? DESERTERS_UNFED[String(entry.desc)] : undefined;
    return twin ? { ...entry, desc: twin } : entry;
  });
}

/**
 * TAIL-DISPLAY-CIVIC-4 (V7, the chair's ruling of 2026-11-15): "Everyone comes and goes by the gates, so smugglers have to get
 * past the garrison" is false where a house on the roster moves goods beneath the walls (a smuggling network's or a smuggling
 * operation's tunnels and false cellars, an underground network, an underground city: 135 of the line's 250 towns on the
 * census's 720 at 6cf555801): that town takes the twin. Walls with gates, no siege (the caller's branch).
 * @param {string} lawRef the force noun @param {boolean} many whether it takes a plural verb
 * @param {ReadonlyArray<{ name?: unknown } | null | undefined>} institutions the roster
 * @returns {string}
 */
export function gatesSmugglersLine(lawRef, many, institutions) {
  return (institutions || []).some((i) => BENEATH_THE_WALLS.test(String(i?.name ?? '')))
    ? lineText({ text: ` The ${lawRef} ${many ? 'keep' : 'keeps'} the gates, but smugglers have ways in beneath the walls.`, needs: ['gate', 'walls'] })
    : ` Everyone comes and goes by the gates, so smugglers have to get past the ${lawRef}.`;
}
const BENEATH_THE_WALLS = /smuggling (?:network|operation)|underground (?:network|city)/i;

/**
 * TAIL-DISPLAY-CIVIC-4 (V10, the chair's ruling of 2026-11-15): "Petty theft is the primary risk; organized crime has a limited
 * foothold." where no criminal house stands on the roster (16 of its 33 tab towns at 6cf555801, each beside the Defense tab's "No
 * criminal infrastructure has been identified"): no foothold.
 * @param {boolean} criminalHouse whether a criminal house stands @returns {string}
 */
export function footholdWord(criminalHouse) {
  return criminalHouse ? 'a limited foothold' : 'found no foothold';
}

/**
 * TAIL-DISPLAY-CIVIC-4 (V10): under a siege nothing comes in by road, gate or water, so the two smuggling hooks that have a
 * load arriving take their twins (the draw stands: the same slot, the same index; 3 of the first's 49 towns at 6cf555801).
 * @param {string} hook the drawn hook @param {boolean} siege @returns {string}
 */
export function smugglingHookUnderSiege(hook, siege) {
  return siege && Object.hasOwn(SMUGGLING_HOOK_SIEGE_TWINS, hook) ? SMUGGLING_HOOK_SIEGE_TWINS[hook] : hook;
}
/** @type {Readonly<Record<string, string>>} */
const SMUGGLING_HOOK_SIEGE_TWINS = Object.freeze({
  'The smuggling network is moving something unusual this week, not the normal contraband. Someone wants to know what it is before it arrives.':
    lineText({ text: 'The smugglers have gone quiet since the siege closed the roads, and someone wants to know what their last load was.', needs: ['crisis: siege'] }),
  'A smuggled load went missing on the way in, and the people who paid for it are asking questions.':
    lineText({ text: 'The last smuggled load before the siege went missing, and the people who paid for it are asking questions.', needs: ['crisis: siege'] }),
});

// ─── BAR3-DEFECON (2026-11-15; REVIEW-BAR-3 and REVIEW-WIDE, the DEFECON rows): the safety lines against the page's state ───
/** Does a house on the roster move goods beneath the walls (the gates line's own reading, V7 above). @param {ReadonlyArray<{ name?: unknown } | null | undefined>} institutions @returns {boolean} */
export function beneathTheWalls(institutions) {
  return (institutions || []).some((i) => BENEATH_THE_WALLS.test(String(i?.name ?? '')));
}
/** C20212 C26238: the Very Safe line's "Everyone comes in by the gates, where the guard sees them" where smugglers have ways in
 * beneath the walls (8 of its 20 towns on the census's 720 at 8b45191a5): the twin. */
export const GATES_KEPT_SMUGGLERS_BENEATH = lineText({ text: ' The guard keeps the gates, but smugglers have ways in beneath the walls.', needs: ['gate', 'walls'] });
/** C55188: "keeps the guard exceptionally well-drilled" where no garrison or watch stands, only volunteers or no one (8 of its
 * 13 towns): the threat, and no drill claimed. */
export const MONSTER_THREAT_NO_DRILL = ' The constant monster threat keeps everyone here on their guard.';
/** C14930: the religious-fraud line where the place has no church of its own (`facts/institutions.js :: hasInstitution(record,
 * 'temple')`; an "Access to parish church" row is a neighbour's): no cover of its own church, no clergy of its own. */
export const RELIGIOUS_FRAUD_NO_CHURCH = 'Fake relics and forged dispensations are sold here in the faith\'s name, by people who treat it as a commercial opportunity.';

const SETTLED_BEFORE_BLOWS = 'and most are settled before they come to blows.';
/**
 * C25320: "A quarrel goes to the heads of the oldest families, and most are settled before they come to blows" where the
 * safety label reads violence (Dangerous, Critical, Desperate: 18 of its 72 towns on the census's 720 at 8b45191a5, the
 * read town's "Violence and theft are routine … quarrels are settled with fists and knives" among them): its twin.
 * @param {string} line the drawn no-watch line @param {unknown} safetyLabel @returns {string}
 */
export function quarrelUnderViolence(line, safetyLabel) {
  if (!/^(?:Dangerous|Critical|Desperate)\b/.test(String(safetyLabel ?? '')) || !String(line).endsWith(SETTLED_BEFORE_BLOWS)) return line;
  return `${String(line).slice(0, -SETTLED_BEFORE_BLOWS.length)}though many come to blows first.`;
}

/** The tithes rows of the income record (`economy/economicState.js`). */
const TITHES_SOURCE = /^Church Tithes/;
/**
 * WHETHER THE CHURCH HOLDS THE ECONOMY (the theocratic flag's claim: "Economic activity flows through religious institutions …
 * Whoever controls trade and tithes holds more practical power"): the tithes row is the income record's largest (its own
 * "dominating the local economy" cut, `economy/incomeLineSiblings.js :: trueIncomeDesc`) and a religious power stands at Strong
 * or Dominant (the Power tab's own word). Measured on the census's 720 at 8b45191a5: 20 towns carry the flag; the read
 * town's Minor power and 7% tithes is the class.
 * @param {unknown} incomeSources @param {unknown} seats @returns {boolean}
 */
export function theocraticEconomyStands(incomeSources, seats) {
  const rows = /** @type {Array<{ source?: unknown, percentage?: unknown }>} */ (Array.isArray(incomeSources) ? incomeSources : []);
  const pct = (/** @type {{ percentage?: unknown }} */ r) => (typeof r?.percentage === 'number' ? r.percentage : 0);
  const tithes = rows.filter((r) => TITHES_SOURCE.test(String(r?.source ?? ''))).reduce((m, r) => Math.max(m, pct(r)), 0);
  const top = rows.reduce((m, r) => Math.max(m, pct(r)), 0);
  const strong = (Array.isArray(seats) ? seats : []).some((f) => f?.category === 'religious' && ['Strong', 'Dominant'].includes(String(f?.powerLabel ?? '')));
  return tithes > 0 && tithes >= top && strong;
}

/**
 * C12387: the background-crime line's "No single dominant organisation" beside the Defense tab's one ring: the crime
 * structure's own key (`facts/criminalStructureKey.js`, the tab's reader) answers "organized" from the final roster
 * (read at assembly by `safetyProfile.js :: settleCrimeLinesToSignal`).
 * @param {unknown} economicState @param {{ seats?: unknown, estate?: unknown } | null | undefined} lists @returns {boolean}
 */
/**
 * BAR3-DEFECON-2 (C17459 C22802 C31257, the chair's grant AS1): three safety lines say crime is kept in hand, and a live
 * crime-wave tension (`history.currentTensions`, drawn at the narratives step, after the economy) says it is rising faster
 * than it is answered. Measured on the census's 720 at 7a4b48a84: false in 9 of 33, 37 of 136 and 6 of 28 printing towns.
 * Each pair is (the line's words as the economy step spells them, the twin true under a crime wave), settled at assembly
 * (`safetyProfile.js :: settleCrimeLinesToSignal`); the label is not touched; no draw.
 */
export const CRIME_WAVE_TWINS = Object.freeze({
  safetyDesc: Object.freeze([
    Object.freeze(['Crime exists but is well-managed. ', 'Crime is on the rise. ']),
    Object.freeze(['Thieves are scarce now; the danger is informers and occupation officials, and the resistance works out of sight.',
      'Theft is rising even under the curfew, and the greater danger is informers and occupation officials; the resistance works out of sight.']),
  ]),
  economicDragDesc: Object.freeze([
    Object.freeze(['Some goods change hands here without a licence or a duty paid. It is noticed, and so far it does little harm.',
      'Some goods change hands here without a licence or a duty paid.']),
  ]),
});

/**
 * The safety profile's crime-kept-in-hand lines settled to a live crime wave (`CRIME_WAVE_TWINS`). Returns the input BY
 * REFERENCE where no crime wave stands or no line changes, else a copy with a copied safety profile.
 * @template E @param {E} economicState @param {unknown} tensions the record's `history.currentTensions` @returns {E}
 */
export function settleCrimeWaveLines(economicState, tensions) {
  const sp = /** @type {any} */ (economicState)?.safetyProfile;
  const wave = Array.isArray(tensions) && tensions.some((t) => t && typeof t === 'object' && /** @type {{ type?: unknown }} */ (t).type === 'crime_wave');
  if (!wave || !sp || typeof sp !== 'object') return economicState;
  /** @type {Record<string, string>} */
  const changed = {};
  for (const [field, pairs] of Object.entries(CRIME_WAVE_TWINS)) {
    const text = sp[field];
    if (typeof text !== 'string') continue;
    const settled = pairs.reduce((acc, [line, twin]) => acc.replace(line, twin), text);
    if (settled !== text) changed[field] = settled;
  }
  if (!Object.keys(changed).length) return economicState;
  return /** @type {E} */ ({ .../** @type {any} */ (economicState), safetyProfile: { ...sp, ...changed } });
}

export function oneRingRules(economicState, lists) {
  return criminalStructureKeyOf(/** @type {never} */ ({ powerStructure: { factions: lists?.seats }, institutions: lists?.estate, economicState })) === 'organized';
}

/**
 * The theocratic-economy flag (`safetyProfile.flags.theocraticEconomy`, the birth's stress draw, kept as drawn at the economy
 * step, where neither the power roster nor the final income stands) as stored on the record: settled at assembly
 * (`safetyProfile.js :: settleCrimeLinesToSignal`), it stands only where `theocraticEconomyStands`. Draw-free; the economy is
 * copied only when the flag changes.
 * @template E @param {E} economicState @param {unknown} seats @returns {E}
 */
export function settleTheocraticFlag(economicState, seats) {
  const es = /** @type {any} */ (economicState);
  const sp = es?.safetyProfile;
  if (sp?.flags?.theocraticEconomy !== true || theocraticEconomyStands(es?.incomeSources, seats)) return economicState;
  return /** @type {E} */ ({ ...es, safetyProfile: { ...sp, flags: { ...sp.flags, theocraticEconomy: false } } });
}
