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

/** The census's small places (a district, a military command); TINY: streets too. */
export const SMALL_PLACES = Object.freeze(['thorp', 'hamlet', 'village']);
export const TINY_PLACES = Object.freeze(['thorp', 'hamlet']);

/**
 * How many gang houses the roster holds (the catalogue's several-gangs row counts two).
 * @param {ReadonlyArray<unknown>} institutions @returns {number}
 */
export function GANG_HOUSES_OF(institutions) {
  let n = 0;
  for (const i of institutions || []) {
    const name = String(typeof i === 'string' ? i : /** @type {{ name?: unknown }} */ (i)?.name || '').toLowerCase();
    n += name.includes('multiple criminal') ? 2 : name.includes('street gang') ? 1 : 0;
  }
  return n;
}

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
 * A patrol on its usual rounds (#459) where the watch's supply is cut off (the economy's own trade dependency,
 * severity critical: "Supply route severed. Operating at minimal capacity or shut down.").
 * @param {string} text @param {{ tradeDependencies?: unknown }} read @param {(law: string) => ReadonlyArray<string>} frames
 *   the guard line's patrol frames (`safetyProfile.js :: STANDARD_PATROL`) @returns {string}
 */
export function patrolTruth(text, read, frames) {
  const deps = /** @type {Array<{ severity?: unknown, institution?: unknown } | null>} */ (Array.isArray(read.tradeDependencies) ? read.tradeDependencies : []);
  const cut = deps.some((t) => t?.severity === 'critical' && partitionDefenseInstitutions([{ name: String(t?.institution ?? '') }]).watch.length > 0);
  if (!cut) return text;
  const m = /^(?:The (.+?) (?:maintains? standard|walks? the usual|patrols? on a regular|(?:is|are) well paid, well equipped and patrols?)|You will see the (.+?) on the rounds)/.exec(text);
  const law = m && (m[1] || m[2]);
  if (!law) return text;
  const many = manyForce(law);
  const lead = [...frames(law), `The ${law} ${many ? 'are' : 'is'} well paid, well equipped and ${many ? 'patrol' : 'patrols'} properly. They come when called, and though some take bribes, it is not the custom.`].find((f) => text.startsWith(f));
  return lead ? `The ${law} ${many ? 'keep what rounds they can' : 'keeps what rounds it can'} while the supplies ${many ? 'they need are' : 'it needs are'} cut off.${text.slice(lead.length)}` : text;
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
  const governs = (Array.isArray(seats) ? seats : []).some((seat) => seat?.category === 'criminal' && seat?.isGoverning === true);
  return entries.map((entry) => {
    const desc = typeof entry?.desc === 'string' ? entry.desc : '';
    if (entry?.type === 'Criminal governance' && !governs && desc.endsWith(VACUUM)) return { ...entry, desc: desc.slice(0, -VACUUM.length) + VACUUM_TWIN };
    if (entry?.type === 'Background crime' && powers && desc.startsWith(NO_DOMINANT)) return { ...entry, desc: NO_DOMINANT_TWIN + desc.slice(NO_DOMINANT.length) };
    return entry;
  });
}
