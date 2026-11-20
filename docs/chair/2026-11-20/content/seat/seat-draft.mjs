/**
 * docs/chair/2026-11-20/content/seat/seat-draft.mjs — SEAT-1's MEASUREMENT DRAFT of train 1's three pure pieces
 * (the seventh chair's CS2, CS4, CS5, CS6). It is an INSTRUMENT, not the build: nothing under src/ imports it, and the
 * builders write their own leaves to the rulings, red first. It exists so the proposal's figures are executed against
 * one stated reading rather than reasoned.
 *
 *   SEAT_TABLE      CS6: one table, kind x size band -> the forms that kind may hold, weighted; a pair outside a
 *                   kind's own rows carries the circumstance that licenses it (the merchant king).
 *   formKindOf      CS4: a seat's form read as its form (the one table, inverted), civic forms -> 'government'.
 *   contestKindOf   CS4: one reader of a power's kind for the contest (craft read off the name first, as
 *                   powerSupport.js :: backingArchetypeOf does; civic folded into government).
 *   holderOf        CS2: who holds the seat, in the chair's stated order, with the rule that answered.
 *   CIRCUMSTANCES   CS5: the closed list, each a pure read of what the town records.
 *   CIRCUMSTANCE_FACTORS  CS5: kind x circumstance -> factor (the proposed figures; the build lands them DARK).
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const imp = (p) => import(join(ROOT, p));
const { factionArchetype } = await imp('src/domain/factionArchetypes.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const { liveSeatCandidatesOf } = await imp('src/domain/dossier/powerStrata.js');
const { isVeiledPower } = await imp('src/domain/people/cardVeil.js');
const { APPOINTED_GOVERNMENTS } = await imp('src/generators/people/representatives.js');

/** The size band, as rulingPower.js :: tierBand reads it. */
export const bandOf = (tier) => (['thorp', 'hamlet', 'village'].includes(String(tier)) ? 'small' : ['city', 'metropolis'].includes(String(tier)) ? 'large' : 'town');

/**
 * CS6 — THE ONE TABLE. Each row: a form, the bands it is held at, its weight within the kind at that band, its
 * competition-layer family (factionCompetition.js's eight ids, widened by three where the two old tables disagree),
 * and, for an unusual pair, the circumstance that licenses it. The FIRST row per kind and band is the transfer's
 * preferred label (rulingPower.js :: GOVERNMENT_PREFERENCES today, kept byte for byte); `alt` is ALT_GOVERNMENT_LABELS.
 * Birth-only forms (the generator's names that the transfer never emits) are listed so the inverse reads every form
 * the record can hold.
 */
export const SEAT_TABLE = Object.freeze({
  military: { family: 'military_order', alt: 'Garrison Command', forms: [
    ['Militia Command', 'small', 3], ['Military Council', 'town', 3], ['Grand Military Council', 'large', 3],
    ['Military City Council', 'large', 1], ['Garrison Command', '*', 0] ] },
  religious: { family: 'temple_authority', alt: 'Ecclesiastical Council', forms: [
    ['Church Council', 'small', 3], ['Theocratic Council', 'town', 3], ['High Theocratic Council', 'large', 3],
    ['Ecclesiastical Council', '*', 1], ['Priestly Guidance', 'small', 1] ] },
  merchant: { family: 'merchant_charter', alt: 'Merchant oligarchy', forms: [
    ['Merchant Council', 'small', 3], ['Merchant City Council', 'town', 3], ['Grand Merchant Senate', 'large', 3],
    ['Merchant oligarchy', '*', 2], ['Grand Merchant Oligarchy', 'large', 2], ['Merchant Guild Council', '*', 2],
    ['Grand Guild Consortium', 'large', 2], ['Guild Council', '*', 1],
    // THE MERCHANT KING: a merchant holder of a noble form, licensed by trade wealth or the town's debts.
    ['Royal Authority', 'large', 1, 'trade_wealth'], ['Ducal Governorship', 'town', 1, 'trade_wealth'] ] },
  noble: { family: 'noble_patronage', alt: 'Noble Regency', forms: [
    ['Feudal Stewardship', 'small', 3], ['Ducal Governorship', 'town', 3], ['Royal Authority', 'large', 3],
    ['Noble Governorship', '*', 2], ['Feudal Appointee', 'small', 2], ['Noble Regency', '*', 0] ] },
  arcane: { family: 'arcane_magocracy', alt: null, forms: [
    ['Circle of Adepts', 'small', 3], ['Arcane Council', 'town', 3], ['Grand Arcane Council', 'large', 3], ['Arcane Senate', 'large', 1] ] },
  craft: { family: 'guild_charter', alt: null, forms: [
    ["Guildmasters' Moot", 'small', 3], ['Guildhall Council', 'town', 3], ['Grand Guild Assembly', 'large', 3],
    ['Guild Council', '*', 2], ['Guild Authority', '*', 1], ['Grand Guild Council', 'large', 1] ] },
  labor: { family: 'communal_assembly', alt: null, forms: [
    ['Commons Assembly', 'small', 3], ["Workers' Assembly", 'town', 3], ['Grand Commons Assembly', 'large', 3] ] },
  outsider: { family: 'foreign_administration', alt: null, forms: [
    ['Foreign Stewardship', 'small', 3], ['Foreign Administration', 'town', 3], ['Foreign Administration', 'large', 3] ] },
  occupation: { family: 'occupation_rule', alt: 'Martial Administration', forms: [
    ['Occupation Authority', '*', 3], ['Martial Administration', '*', 0] ] },
  criminal: { family: 'criminal_shadow_rule', alt: null, forms: [
    ['Corrupt Council', 'small', 3], ['Corrupt City Council', 'town', 3], ['Shadow Senate', 'large', 3] ] },
  government: { family: 'council_rule', alt: null, forms: [
    ['Elder Council', 'small', 3], ['Town Council', 'town', 3], ['City Council', 'large', 3],
    ['Town Mayor', '*', 2], ['Grand Council', 'large', 2], ['Democratic assembly', '*', 1], ['City-State Council', 'large', 1],
    ['Elected Reeve', 'small', 1], ['Household Council', 'small', 1], ['Free Elder Council', 'small', 1], ['Elder Consensus', 'small', 1],
    ["Headman's Authority", 'small', 1], ['Mixed Council', '*', 0] ] },
});

/** A civic form may be held by the kinds the dual hat lets a civic leader come from (representatives.js :: CIVIC_HOUSE_KINDS). */
export const CIVIC_HOLDER_KINDS = Object.freeze(['craft', 'merchant', 'noble']);

/** The inverse: a form name -> the kind whose OWN (unlicensed) rows hold it, first match in table order. */
const FORM_KIND = (() => {
  const m = new Map();
  for (const [kind, row] of Object.entries(SEAT_TABLE)) for (const [form, , , license] of row.forms) if (!license && !m.has(form)) m.set(form, kind);
  return m;
})();

/**
 * CS4 — a seat's form read as its form. A transfer's "<label> Ascendant" reads as its label. Null for a form the one
 * table does not hold (the caller falls back to the row's own kind).
 */
export function formKindOf(form) {
  const f = String(form || '').replace(/ Ascendant$/, '');
  return FORM_KIND.get(f) || null;
}

/** CS4 — one reader of a power's kind for the contest. */
export function contestKindOf(faction) {
  const k = factionArchetype(faction);
  // a criminal power stays criminal whatever its name says (an "Artisans' Syndicate" never enters the contest as craft)
  if (k === 'criminal' || isVeiledPower(faction)) return k;
  if (/craft|artisan/i.test(nameOf(faction) || '')) return 'craft';
  return k === 'civic' ? 'government' : k;
}

/** Is `form` one a holder of `kind` may hold at `band` (its own rows, or civic), and under which license, if any? */
export function pairLicense(kind, form, band) {
  const f = String(form || '').replace(/ Ascendant$/, '');
  const own = SEAT_TABLE[kind]?.forms.find(([n, , , lic]) => n === f && !lic); // a kind's own form is holdable at any band; the band weighs only the transfer's draw
  if (own) return { ok: true, license: null };
  if (FORM_KIND.get(f) === 'government' && CIVIC_HOLDER_KINDS.includes(kind)) return { ok: true, license: null };
  // the dual hat's own fallback (representatives.js :: dualHatHouseOf): where no trade or landed house stands, a civic
  // leader comes from the heaviest open house of any other kind; the pair is the record's, not an unusual one
  if (FORM_KIND.get(f) === 'government' && kind !== 'criminal') return { ok: true, license: 'civic_fallback' };
  const lic = SEAT_TABLE[kind]?.forms.find(([n, , , l]) => n === f && l);
  if (lic) return { ok: true, license: lic[3] };
  return { ok: false, license: null };
}

const rankOne = (npc, power) => Array.isArray(npc?.memberships) && npc.memberships.some((m) => m && m.power === power && m.rank === 1);
const ofSeat = (s) => (s.powerStructure?.factions || []);

/**
 * R1's read: the taker of the last transfer, by the edge transferRulingPower writes today
 * (`${winner} is the power behind the ${toGovernment.toLowerCase()}. The seat answers to them now.`), matched EXACTLY
 * against the current form, so an older transfer's edge (renamed onto the new form, its narrative naming the old one)
 * never answers.
 */
export function lastTransferTakerOf(s) {
  const gov = governingFactionOf(s);
  if (!gov) return null;
  const form = nameOf(gov);
  for (const rel of [...(s.powerStructure?.factionRelationships || [])].reverse()) {
    if (!Array.isArray(rel?.pair) || !rel.pair.includes(form)) continue;
    const other = rel.pair.find((n) => n !== form);
    if (other && rel.narrative === `${other} is the power behind the ${form.toLowerCase()}. The seat answers to them now.`) {
      const row = ofSeat(s).find((f) => nameOf(f) === other && f !== gov);
      if (row) return row;
    }
  }
  return null;
}

/**
 * CS2 — WHO HOLDS THIS SEAT, in the chair's order. Returns { rule, holder (a power row or null), seatHolder (the
 * person), kind (the holder's contest kind, or the form's kind where the office holds itself), veiled }.
 *   R1 transfer   — the taker of the last transfer the record holds;
 *   R2 dualHat    — the power whose first member is the seat-holder (the person in the seat);
 *   R3 sameKind   — for a seat of a kind, the leading open power of that kind;
 *   R4 office     — nobody outside: a civic seat holds itself;
 *   R5 appointed  — a government that sends its own man: the one who appoints (the record names none at birth).
 * `audience: 'public'` never answers a veiled power (hidden, or criminal) and never one a served document lacks.
 */
export function holderOf(s, { audience = 'owner', order = ['R1', 'R2', 'R3'] } = {}) {
  const gov = governingFactionOf(s);
  if (!gov) return { rule: 'none', holder: null, seatHolder: null, kind: null, veiled: false };
  const form = nameOf(gov);
  const seatHolder = liveSeatCandidatesOf(s)[0] || null;
  const fk = formKindOf(form) || contestKindOf(gov);
  const usable = (f) => f && f !== gov && (audience === 'owner' || !isVeiledPower(f));
  const answers = {
    R1: () => { const r = lastTransferTakerOf(s); return usable(r) ? r : null; },
    R2: () => {
      if (!seatHolder) return null;
      const heads = ofSeat(s).filter((f) => usable(f) && rankOne(seatHolder, nameOf(f)));
      return heads[0] || null;
    },
    R3: () => {
      if (['government', 'civic', 'other'].includes(fk)) return null;
      const same = ofSeat(s).filter((f) => usable(f) && !isVeiledPower(f) && contestKindOf(f) === fk)
        .sort((a, b) => (Number(b.power) || 0) - (Number(a.power) || 0) || (nameOf(a) < nameOf(b) ? -1 : 1));
      return same[0] || null;
    },
  };
  for (const r of order) {
    const h = answers[r]();
    if (h) return { rule: r, holder: h, seatHolder, kind: contestKindOf(h), veiled: isVeiledPower(h) };
  }
  if (APPOINTED_GOVERNMENTS.includes(form.replace(/ Ascendant$/, ''))) return { rule: 'R5', holder: null, seatHolder, kind: fk, veiled: false };
  return { rule: 'R4', holder: null, seatHolder, kind: fk, veiled: false };
}

/** Every rule's own answer (for the disagreement count). */
export function holderAnswers(s) {
  const out = {};
  for (const r of ['R1', 'R2', 'R3']) {
    const h = holderOf(s, { order: [r] });
    out[r] = h.rule === r ? nameOf(h.holder) : null;
  }
  return out;
}

// ── CS5: the circumstances (each a pure read of the record) ──────────────────
const stressTypesOf = (s) => {
  const t = new Set([...(Array.isArray(s.config?.stressTypes) ? s.config.stressTypes : [])]);
  if (s.stress && typeof s.stress === 'object' && s.stress.type) t.add(s.stress.type);
  for (const x of Array.isArray(s.stressors) ? s.stressors : []) if (x?.type) t.add(x.type);
  return t;
};
const powerOfKind = (s, kind) => Math.max(0, ...ofSeat(s).filter((f) => !f.isGoverning && contestKindOf(f) === kind).map((f) => Number(f.power) || 0));
const prio = (s, k) => Number(s.config?.[k] ?? 50);

/**
 * The closed list. Each entry: the stored field(s) it reads, and the read. Nothing is minted; a town whose record holds
 * none has every factor at 1.
 */
export const CIRCUMSTANCES = Object.freeze({
  craft_led: { reads: "powerStructure.factions[] (a non-governing craft power at least four fifths as strong as the strongest merchant power), or economicState.incomeSources' 'Guild Fees' / 'Guild Licensing' at 25 per cent or more with a craft power standing",
    test: (s) => { const c = powerOfKind(s, 'craft'); if (!(c > 0)) return false;
      const guild = (s.economicState?.incomeSources || []).some((x) => /^Guild (Fees|Licensing)$/.test(String(x?.source)) && Number(x?.percentage) >= 25);
      return c >= 0.8 * powerOfKind(s, 'merchant') || guild; } },
  trade_wealth: { reads: "economicState.prosperity in {Prosperous, Wealthy} and the largest of economicState.incomeSources is a trade source (Market Taxes, Trade Tariffs, Tolls, Port Fees, Caravan …)",
    test: (s) => { const e = s.economicState || {}; if (!['Prosperous', 'Wealthy'].includes(e.prosperity)) return false;
      const top = [...(e.incomeSources || [])].sort((a, b) => (Number(b?.percentage) || 0) - (Number(a?.percentage) || 0))[0];
      return /market|trade|tariff|toll|port|caravan|customs|exchange/i.test(String(top?.source || '')); } },
  strong_faith: { reads: 'config.priorityReligion >= 70, or the religious_conversion stress', test: (s) => prio(s, 'priorityReligion') >= 70 || stressTypesOf(s).has('religious_conversion') },
  martial_pressure: { reads: 'the under_siege / wartime / insurgency / monster_pressure stress, or config.priorityMilitary >= 70',
    test: (s) => ['under_siege', 'wartime', 'insurgency', 'monster_pressure'].some((t) => stressTypesOf(s).has(t)) || prio(s, 'priorityMilitary') >= 70 },
  hunger: { reads: "the famine stress, or economicState.foodSecurity.label beginning 'Deficit'",
    test: (s) => stressTypesOf(s).has('famine') || /^Deficit/.test(String(s.economicState?.foodSecurity?.label || '')) },
  mandate: { reads: "powerStructure.publicLegitimacy (isContested or isLegitimacyCrisis), the governing row's 'vacant' modifier, or the succession_void / politically_fractured stress",
    test: (s) => { const l = s.powerStructure?.publicLegitimacy || {}; const g = governingFactionOf(s);
      return !!(l.isContested || l.isLegitimacyCrisis) || (g?.modifiers || []).includes('vacant') || stressTypesOf(s).has('succession_void') || stressTypesOf(s).has('politically_fractured'); } },
  outside_debt: { reads: "the indebted stress, or a power named for creditors (Crown Creditors / Creditor's Representative)",
    test: (s) => stressTypesOf(s).has('indebted') || ofSeat(s).some((f) => /creditor/i.test(nameOf(f))) },
  occupation: { reads: "the occupied stress, or a row carrying the 'occupied' modifier", test: (s) => stressTypesOf(s).has('occupied') || ofSeat(s).some((f) => (f.modifiers || []).includes('occupied')) },
});

/** CS5 — the proposed figures (kind x circumstance). Absent = 1. Each factor in [1, 1.5]; the product is clamped. */
export const CIRCUMSTANCE_FACTORS = Object.freeze({
  // Proposed after the first pass (holder-*.md's lift table, first run): a factor on a kind that already contends in
  // nearly every town where it stands (military, religious under a questioned mandate) moved nothing but the order of
  // the three, so it is struck; what is left lifts the kinds the owner named (nobles, craftsmen) and the kinds train 2
  // will bear (labourers, outsiders: inert until a power of theirs is born).
  craft_led: { craft: 1.5 },
  trade_wealth: { merchant: 1.15 },
  strong_faith: { religious: 1.25 },
  martial_pressure: { noble: 1.15 },
  hunger: { labor: 1.4 },
  mandate: { noble: 1.3, craft: 1.2 },
  outside_debt: { outsider: 1.4, merchant: 1.15 },
  occupation: { outsider: 1.2 },
});
export const CIRCUMSTANCE_PRODUCT_CEILING = 1.6;

export function circumstancesOf(s) {
  return Object.entries(CIRCUMSTANCES).filter(([, c]) => c.test(s)).map(([k]) => k);
}
export function circumstanceFactor(kind, held, factors = CIRCUMSTANCE_FACTORS) {
  let p = 1;
  for (const c of held) p *= factors[c]?.[kind] ?? 1;
  return Math.min(CIRCUMSTANCE_PRODUCT_CEILING, p);
}
