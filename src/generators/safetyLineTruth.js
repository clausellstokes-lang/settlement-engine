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
