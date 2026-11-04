/**
 * domain/dossier/powerSupport.js — the Power tab's institution-support web.
 *
 * Owner order (2026-07-22): "in the power tab, there should show when you click a
 * power all of the institutions that support that power for the DM to understand
 * the web."
 *
 * Derives, READ-ONLY in the display layer, which of a settlement's institutions
 * stand behind each power (faction). No generation change; no store write; pure
 * and deterministic over the settlement it is handed.
 *
 * THE DATA REALITY (probed from the FULL pipeline, 2026-07-22): the generator
 * emits NO per-institution controlling-faction field and NO per-faction
 * institution list. The only join between an institution and a faction is the
 * faction DISPLAY-NAME STRING. Two honest signals exist:
 *   - factionSource  — a sparse (~1 institution/settlement) EXACT marker naming
 *     the faction that raised a landmark (Great cathedral -> Religious Authorities,
 *     Citadel -> Military/Guard). Strong but rare.
 *   - category alignment — an institution's `priorityCategory` maps to a faction
 *     `category`; the leading faction of that category is its backer. This is the
 *     SAME relation the InstitutionCard "Backed by" row shows: we reuse its exact
 *     helper (institutionBackingFactionName) so the two never diverge. Coarse by
 *     nature (category-level, disambiguated to the dominant faction of the
 *     category) because that is the strongest BROAD signal the data carries.
 *
 * The basis vocabulary is a FROZEN, FINITE enum (the finite-semantics law): every
 * "why this institution backs this power" line is one of a fixed set of typed
 * phrases keyed by the signal + the backing faction's canonical archetype — never
 * a free-composed reason. No dashes / no apostrophes (F24 copy law).
 *
 * X-45 (the owner, 2026-11-02: "every institution backs powers, some inherently back multiple
 * where appropriate, and we need to also just make sure that it still balances out to the
 * power ranking and influences … make sure that we balance it on our end and it doesn't end
 * up becoming redundant or a double counting … catalog every institution and make those
 * judgment calls individually"): the broad signal is no longer the economy tag. It is THE
 * BACKING CATALOGUE (`data/institutionBacking.js`): one hand-written row per house family,
 * shares over power archetypes that sum to one, a weight, a fallback. A share lands on the
 * leading faction of its archetype in this settlement; the government share lands on the
 * seat whatever the seat's own tag says; a share with nobody to land on lapses (never
 * inflating another power), unless the row names a fallback. A house whose every share
 * lapsed answers to the ruling power at NO weight (the `default` basis). The exact mark
 * (`factionSource`) still takes a house whole, and the DM's own list (the house's `backs`
 * edit record, domain/userEdits.js) replaces every derived reason, an empty list included,
 * with the house's weight split equally. `houseBacksOf` is the one per-house truth; the
 * Power tab's web (`deriveFactionSupport`), the Institutions card's line
 * (`institutionBackers`) and the balance ledger (`backingLedger`, the measurement the owner
 * reads before letting the catalogue feed the power figures) are all read off it.
 */

import { institutionBackingFactionName } from '../display/institutionProfile.js';
import { factionArchetype, FACTION_ARCHETYPES as A } from '../factionArchetypes.js';
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { walkUserEdits } from '../userEdits.js';
import { BACKS_SEPARATOR, formatBacksValue, parseBacksValue } from '../userEditLines.js';
import { backingRowFor } from '../../data/institutionBacking.js';

/**
 * The four reasons a house stands behind a power:
 *   founded   the exact `factionSource` mark, this power raised the house;
 *   aligned   the house's category names this power's domain (the broad signal);
 *   default   neither holds, so the house answers to the ruling power;
 *   authored  the DM named the powers (the `backs` edit), replacing every derived reason.
 * @typedef {'founded'|'aligned'|'default'|'authored'} SupportBasisKind
 */

/**
 * The loose settlement fields this derivation reads (structurally typed, no
 * `any`, so the domain any-cast ratchet stays flat).
 * @typedef {{ faction?: string, name?: string, category?: string, power?: number }} SupportFaction
 * @typedef {{ name?: string, priorityCategory?: string, category?: string, factionSource?: string }} SupportInstitution
 * @typedef {{ powerStructure?: { factions?: SupportFaction[] }, institutions?: SupportInstitution[] }} SupportSettlement
 */

/**
 * @typedef {Object} SupportEdge
 * @property {SupportInstitution} institution  The raw settlement institution object.
 * @property {string} name          The institution display name.
 * @property {SupportBasisKind} basis
 * @property {string} why           The typed one-line basis phrase (finite set).
 */

// The `aligned` basis phrase, keyed by the backing faction's canonical archetype
// so the line names the shared domain. Frozen: a typo key reads `undefined` and
// falls to OTHER, never a silent miss.
/** @type {Readonly<Record<string, string>>} */
const ALIGNED_BASIS = Object.freeze({
  [A.MERCHANT]:   'A commercial house of this power',
  [A.MILITARY]:   'In the service of this command',
  [A.RELIGIOUS]:  'A house of this faith',
  [A.ARCANE]:     'Under this arcane power',
  [A.CRIMINAL]:   'A front under this influence',
  [A.NOBLE]:      'Beholden to this line',
  [A.GOVERNMENT]: 'Held under this authority',
  [A.CIVIC]:      'Held under this authority',
  [A.CRAFT]:      'A trade under this craft power',
  [A.LABOR]:      'A workshop of this commons',
  [A.OUTSIDER]:   'Aligned with this outside power',
  [A.OCCUPATION]: 'Held under this occupying power',
  [A.OTHER]:      'Aligned with this power',
});

// The `founded` basis phrase (the exact factionSource signal).
const FOUNDED_BASIS = 'Raised by this power';
// The `default` basis phrase (X-45): a house of no power's own kind answers to the ruler.
const DEFAULT_BASIS = 'Under the ruling power, with no power of its own kind here';
// The `authored` basis phrase (X-45): the DM named the powers.
const AUTHORED_BASIS = 'Named by you';

/** The finite basis vocabulary, exported so the drift pin can enumerate it. */
export const SUPPORT_BASIS = Object.freeze({
  founded: FOUNDED_BASIS,
  aligned: ALIGNED_BASIS,
  default: DEFAULT_BASIS,
  authored: AUTHORED_BASIS,
});

/** The rank a reason sorts by inside a power's bucket: the DM's word, then the exact mark,
 *  then the broad signal, then the default. */
const BASIS_RANK = Object.freeze({ authored: 0, founded: 1, aligned: 2, default: 3 });

/**
 * THE `backs` EDIT'S SPELLING (X-45). The DM's list lives in the house's own edit record
 * (`domain/userEdits.js`, path `backs`) as ONE line of power names parted by a middle dot,
 * a string, because every reader of an edit record (the AI overlay's verbatim pass, the
 * export, the Edited count) reads prose. These two helpers are the only spellers.
 */
// RUNG1B-F8: the spelling lives in the leaf the faction rename re-keys it through
// (domain/userEditLines.js), so a renamed power keeps the house the DM put behind it.
export { BACKS_SEPARATOR, parseBacksValue, formatBacksValue };

/**
 * @typedef {Object} HouseBack
 * @property {string} faction          The power's display name, the roster's spelling.
 * @property {SupportBasisKind} basis
 * @property {string} why              The typed one-line phrase (finite set).
 * @property {number} share            The part of the house that stands behind this power, 0 to 1.
 * @property {number} weight           The house's political weight, 0 to 3 (the catalogue's).
 */

/** @param {string} arch @returns {string} */
const alignedWhy = (arch) => ALIGNED_BASIS[arch] || ALIGNED_BASIS[A.OTHER];

/**
 * The archetype a share lands on. Two corrections to the canonical detector, for the
 * arithmetic only: the Craft Guilds carry the generator's `economy` tag and would otherwise
 * hand every craft house to the merchants; and a civic faction is the seat for backing.
 * @param {SupportFaction} faction @returns {string}
 */
function backingArchetypeOf(faction) {
  if (/craft|artisan/i.test(nameOf(faction) || '')) return A.CRAFT;
  const arch = factionArchetype(faction);
  return arch === A.CIVIC ? A.GOVERNMENT : arch;
}

/**
 * The roster read for the arithmetic: who leads each archetype, and who the seat is. The
 * seat takes the government share whatever its own tag says (with no seat marked, the leading
 * civic faction does), and competes for its own
 * archetype's share only when no other faction of that archetype is seated, so a merchant
 * council does not hoover up both halves of every market.
 * @param {SupportSettlement} settlement
 */
function powerIndex(settlement) {
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const ruler = nameOf(governingFactionOf(settlement)) || null;
  /** @type {Map<string, string>} lower-cased display name -> the roster's spelling */
  const roster = new Map();
  /** @type {Map<string, string>} */
  const archByName = new Map();
  /** @type {Map<string, { name: string, power: number }>} */
  const leaders = new Map();
  for (const f of factions) {
    const name = nameOf(f);
    if (!name) continue;
    if (!roster.has(name.toLowerCase())) roster.set(name.toLowerCase(), name);
    const arch = backingArchetypeOf(f);
    if (!archByName.has(name)) archByName.set(name, arch);
    if (name === ruler) continue;
    const power = Number(f.power) || 0;
    const cur = leaders.get(arch);
    if (!cur || power > cur.power) leaders.set(arch, { name, power });
  }
  const rulerArch = ruler ? archByName.get(ruler) : undefined;
  /** @param {string} arch @returns {string | null} */
  const leaderOf = (arch) => {
    // the seat takes the government share; with no seat marked, the leading civic faction does
    if (arch === A.GOVERNMENT) return ruler || leaders.get(arch)?.name || null;
    const led = leaders.get(arch);
    if (led) return led.name;
    return ruler && rulerArch === arch ? ruler : null;
  };
  /** @param {string} name @returns {string} */
  const archOf = (name) => archByName.get(name) || A.OTHER;
  return { roster, ruler, leaderOf, archOf };
}

/**
 * THE POWERS EACH HOUSE STANDS BEHIND, house by house (X-45): the catalogue's shares landed
 * on this settlement's roster, the exact mark, the DM's own list. Keyed by the house's raw
 * roster name, in the roster's order, each list strongest share first. A list is empty only
 * for a house the DM cleared, or in a settlement with no ruling power to answer to.
 * @param {SupportSettlement} settlement
 * @returns {Map<string, HouseBack[]>}
 */
export function houseBacksOf(settlement) {
  /** @type {Map<string, HouseBack[]>} */
  const byHouse = new Map();
  const factions = settlement?.powerStructure?.factions;
  const institutions = settlement?.institutions;
  if (!Array.isArray(factions) || !Array.isArray(institutions)) return byHouse;
  const { roster, ruler, leaderOf, archOf } = powerIndex(settlement);
  // THE DM'S WORD, read once through the settlement-level walk of the edit records (the
  // one read of `_userEdits` the observed-shape register banks), keyed by roster index.
  /** @type {Map<number, unknown>} */
  const authoredBacks = new Map();
  for (const edit of walkUserEdits(/** @type {import('../userEdits.js').EditableEntity} */ (settlement))) {
    if (edit.kind === 'institution' && edit.path === 'backs' && edit.record) authoredBacks.set(edit.entityIndex, edit.record.value);
  }

  for (let index = 0; index < institutions.length; index += 1) {
    const inst = institutions[index];
    const key = String(inst?.name || '');
    if (!key) continue;
    const row = backingRowFor(key);
    const weight = row ? row.weight : 1;
    /** @type {HouseBack[]} */
    const list = [];
    /** Land `share` of the house on a named power; a power the roster lacks is refused.
     * @param {string} faction @param {SupportBasisKind} basis @param {string} why @param {number} share */
    const add = (faction, basis, why, share) => {
      const spelled = roster.get(String(faction).toLowerCase());
      if (!spelled) return false;
      const have = list.find((b) => b.faction === spelled);
      if (have) have.share += share; // the first landing keeps its phrase (the larger share lands first)
      else list.push({ faction: spelled, basis, why, share, weight });
      return true;
    };
    // THE DM'S WORD REPLACES EVERY DERIVED REASON, an empty word included: a house the DM
    // cleared stands behind nobody. The weight splits equally.
    if (authoredBacks.has(index)) {
      const names = parseBacksValue(authoredBacks.get(index)).filter((n) => roster.has(n.toLowerCase()));
      for (const n of names) add(n, 'authored', AUTHORED_BASIS, 1 / names.length);
      byHouse.set(key, list);
      continue;
    }
    // THE EXACT MARK: factionSource names the power that raised the house, which takes it whole.
    if (inst.factionSource && add(String(inst.factionSource), 'founded', FOUNDED_BASIS, 1)) {
      byHouse.set(key, list);
      continue;
    }
    if (row) {
      // THE CATALOGUE: each share lands on its archetype's leader; a lapsed share goes to
      // the row's fallback, or nowhere.
      let lapsed = 0;
      const shares = Object.entries(row.shares).sort((x, y) => y[1] - x[1]);
      for (const [arch, share] of shares) {
        const target = leaderOf(arch);
        if (target) add(target, 'aligned', alignedWhy(arch), share);
        else lapsed += share;
      }
      if (lapsed > 0 && row.fallback) {
        const target = leaderOf(row.fallback);
        if (target) add(target, 'aligned', alignedWhy(row.fallback), lapsed);
      }
    } else {
      // A house the catalogue does not place (custom content, a stranger): the economy tag's
      // category alignment, whole, as before.
      const backer = institutionBackingFactionName(inst, settlement);
      if (backer) add(backer, 'aligned', alignedWhy(archOf(backer)), 1);
    }
    // THE DEFAULT: nothing landed, so the house answers to the seat at no weight.
    if (list.length === 0 && ruler) list.push({ faction: ruler, basis: 'default', why: DEFAULT_BASIS, share: 0, weight });
    list.sort((x, y) => y.share - x.share || BASIS_RANK[x.basis] - BASIS_RANK[y.basis]);
    byHouse.set(key, list);
  }
  return byHouse;
}

/**
 * @typedef {Object} LedgerRow
 * @property {string} faction
 * @property {string} archetype
 * @property {boolean} governing
 * @property {number} generated   The generated power figure, a percentage of the roster.
 * @property {number} backed      Weight landed on this power by the houses (share × weight, summed).
 * @property {number} implied     `backed` as a percentage of all landed weight.
 */
/**
 * @typedef {Object} BackingLedger
 * @property {LedgerRow[]} rows
 * @property {number} distance    Half the summed absolute gap between implied and generated, 0 to 100.
 * @property {number | null} rank The rank agreement of the two orderings (Spearman), null under three powers.
 * @property {number} houses      Houses read.
 * @property {number} weighed     Their summed weight.
 * @property {number} lapsed      The part of that weight that found no power to land on.
 */

/** @param {number[]} xs @returns {number[]} average ranks, ties shared */
function ranksOf(xs) {
  const order = xs.map((v, i) => ({ v, i })).sort((p, q) => p.v - q.v);
  const out = new Array(xs.length).fill(0);
  let i = 0;
  while (i < order.length) {
    let j = i;
    while (j + 1 < order.length && order[j + 1].v === order[i].v) j += 1;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) out[order[k].i] = avg;
    i = j + 1;
  }
  return out;
}

/** @param {number[]} xs @param {number[]} ys @returns {number | null} */
function spearman(xs, ys) {
  const n = xs.length;
  if (n < 3) return null;
  const rx = ranksOf(xs), ry = ranksOf(ys);
  const mx = rx.reduce((acc, v) => acc + v, 0) / n, my = ry.reduce((acc, v) => acc + v, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i += 1) {
    const ex = rx[i] - mx, ey = ry[i] - my;
    num += ex * ey; dx += ex * ex; dy += ey * ey;
  }
  return dx > 0 && dy > 0 ? num / Math.sqrt(dx * dy) : null;
}

/**
 * THE BALANCE LEDGER (X-45): what the catalogue implies for each power against what
 * generation decided, so the owner can read how far the two sit before deciding whether the
 * catalogue feeds the power figures. Pure; reads `houseBacksOf` and the roster, nothing else.
 * @param {SupportSettlement} settlement
 * @returns {BackingLedger}
 */
export function backingLedger(settlement) {
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  const { ruler, archOf } = powerIndex(settlement);
  /** @type {Map<string, number>} */
  const backed = new Map();
  let houses = 0, weighed = 0, lapsed = 0;
  for (const list of houseBacksOf(settlement).values()) {
    houses += 1;
    const weight = list[0]?.weight ?? 0;
    let spent = 0;
    for (const b of list) {
      spent += b.share;
      backed.set(b.faction, (backed.get(b.faction) || 0) + b.share * weight);
    }
    weighed += weight;
    lapsed += Math.max(0, 1 - spent) * weight;
  }
  const total = [...backed.values()].reduce((acc, v) => acc + v, 0);
  /** @type {LedgerRow[]} */
  const rows = [];
  for (const f of factions) {
    const name = nameOf(f);
    if (!name || rows.some((r) => r.faction === name)) continue;
    const landed = backed.get(name) || 0;
    rows.push({
      // the seat is read as the government whatever its own tag, since that is the share it takes
      faction: name, archetype: name === ruler ? A.GOVERNMENT : archOf(name), governing: name === ruler,
      generated: Number(f.power) || 0, backed: landed, implied: total > 0 ? (landed / total) * 100 : 0,
    });
  }
  const distance = rows.reduce((acc, r) => acc + Math.abs(r.implied - r.generated), 0) / 2;
  return { rows, distance, rank: spearman(rows.map((r) => r.generated), rows.map((r) => r.implied)), houses, weighed, lapsed };
}


/**
 * Map each power faction (by display name) to the institutions that stand behind it. Returns
 * a Map keyed by the faction display name; each value is an ordered list of SupportEdge, the
 * DM's word first, then the exact mark, then the broad signal, then the default, each in the
 * settlement's own institution order (deterministic). A house appears under EVERY power it
 * backs (X-45: "where appropriate an institution may back multiple powers"); the per-house
 * truth is `houseBacksOf`, so this web and the Institutions card can never disagree.
 *
 * @param {SupportSettlement} settlement
 * @returns {Map<string, SupportEdge[]>}
 */
export function deriveFactionSupport(settlement) {
  /** @type {Map<string, SupportEdge[]>} */
  const byFaction = new Map();
  const factions = settlement?.powerStructure?.factions;
  const institutions = settlement?.institutions;
  if (!Array.isArray(factions) || !Array.isArray(institutions)) return byFaction;

  // Seed a bucket for every faction (by display name).
  for (const f of factions) {
    const key = nameOf(f);
    if (key && !byFaction.has(key)) byFaction.set(key, []);
  }
  const backs = houseBacksOf(settlement);
  for (const inst of institutions) {
    const name = String(inst?.name || '');
    for (const back of backs.get(name) || []) {
      const bucket = byFaction.get(back.faction);
      if (bucket) bucket.push({ institution: inst, name, basis: back.basis, why: back.why });
    }
  }
  for (const bucket of byFaction.values()) {
    bucket.sort((a, b) => BASIS_RANK[a.basis] - BASIS_RANK[b.basis]); // stable: roster order within a rank
  }
  return byFaction;
}

/**
 * THE NAMES ALONE (X-40, the owner 2026-11-01: on an institution "mention which power(s) they
 * support. A simple line underneath that just lists who they contribute to"): for each house
 * (by its raw roster name) the display names of the powers it stands behind, strongest reason
 * first. Read off `houseBacksOf`, the one per-house truth the Power tab's web is built from.
 * A house that backs no power is absent (the card reads `houseBacksOf` itself, where a list
 * the DM cleared is present and empty).
 * @param {SupportSettlement} settlement
 * @returns {Map<string, string[]>}
 */
export function institutionBackers(settlement) {
  /** @type {Map<string, string[]>} */
  const byInstitution = new Map();
  for (const [name, list] of houseBacksOf(settlement)) {
    if (list.length) byInstitution.set(name, list.map((b) => b.faction));
  }
  return byInstitution;
}
