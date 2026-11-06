/**
 * scripts/audit/soak-review/checks.mjs — the per-settlement battery ("each in depth").
 *
 * One call, `reviewSettlement`, over the record and its rendered surfaces, returning findings
 * `{ check, surface, quote, detail }`. Four families, each named so the report can count it:
 *
 *   cert:*   the certification soak's own receipts (`generation-certification-soak.mjs ::
 *            inspectSettlement`: unresolved receipt, broken reference, conservation, non-finite).
 *   coh:*    the seven coherence instruments behind `src/domain/coherence/coherenceBattery.js ::
 *            coherenceBattery`, over every rendered surface; and two record checks of this
 *            module's own, `coh:roster-duplicate-secret` / `-goal` (`rosterDuplicate`).
 *   X-nn:*   the owner's experience rulings (docs/UX_CONSOLIDATION_2026-10-30.md X-46..X-52).
 *   A-nn:*   the coherence audit's numbered failure items (docs/GENERATION_COHERENCE_AUDIT_2026-11-02.md
 *            §2, items 1-15, as observed in its eighteen hand readings), each turned into a check
 *            where a machine can read it. The items no machine reads honestly are listed in
 *            `CHAIR_READINGS` and left to the chair's sample read.
 *
 * Every check maps to one of the root-cause doc's eight failure kinds
 * (docs/GENERATION_ROOT_CAUSES_2026-11-02.md, appendix: 1 food, 2 faith, 3 magic, 4 defence,
 * 5 rulers, 6 repetition, 7 unnamed, 8 small places as towns) or to none (`KIND_OF`), which the
 * stop rule reads.
 */
import { inspectSettlement } from '../generation-certification-soak.mjs';
import { normalizeRenderedSentence } from '../phrase-repetition.mjs';
import { coherenceBattery } from '../../../src/domain/coherence/coherenceBattery.js';
import { magicWorksAt } from '../../../src/domain/worldPulse/magicWorksAt.js';

/** The owner's bands (X-46, docs/UX_CONSOLIDATION_2026-10-30.md; car 1 is parked, not on this tip). */
export const OWNER_BANDS = Object.freeze({
  thorp: [5, 30], hamlet: [20, 100], village: [75, 400], town: [300, 2500], city: [2000, 15000], metropolis: [15000, Infinity],
});

/** Root-cause kind of each check (0 = none of the eight; -2 = informational tally, outside the stop rule). */
export const KIND_OF = Object.freeze({
  'coh:food-words': 1, 'coh:hook-truth-page': 1, 'X-49:stores-not-once': 1, 'X-52:endurance-not-once': 1, 'X-52:endurance-disagrees': 1, 'A-01:starving-fed': 1,
  'coh:faith-denial': 2,
  'coh:magic-words': 3, 'A-04:dragon-magic-off': 3, 'A-04:alchemist-magic-off': 3,
  'coh:defense-words': 4, 'A-05:hospital-absent': 4, 'A-05:arena-absent': 4,
  'coh:seat-holder': 5, 'A-08:hidden-ruler-note': 5,
  'X-50:boilerplate-twice': 6, 'A-09:behaviour-line-share': 6,
  'A-10:role-only-npc': 7, 'A-10:placeholder-faction': 7, 'A-03:tonight-they': 7,
  // REVIEW-INTAKE-3 R10: two people of one roster carrying one secret or one goal is a
  // contradiction about WHO (the chair: a contradiction kind the stop rule reads, not repetition
  // 6); keyed with the people family, 7.
  'coh:roster-duplicate-secret': 7, 'coh:roster-duplicate-goal': 7,
  'A-05:lacks-access-lines': -2,
  'coh:tier-noun': 8, 'A-14:guild-power-small': 8, 'A-14:lord-mayor-small': 8,
});

/** Audit items no machine reads honestly here; the chair's sample read carries them. */
export const CHAIR_READINGS = Object.freeze([
  'A-02 beyond the denial phrases: a Faith tab that names no god while the record has a High Priest (judged prose)',
  'A-03 "a weaker hook than the active crisis" (a judgment of strength)',
  'A-05 "X exists but lacks access to Y" lines that contradict the Institutions tab (needs a catalogue of goods-to-houses)',
  'A-06 crime organised, petty and absent at once (counted here only as the bare phrase pair; the reading is the chair\'s)',
  'A-11 culture only skin deep: generic medieval institutions under a non-European culture (judged)',
  'A-13 what the generator knows and does not show (ruled case by case: X-47 struck places, X-48 struck looks)',
  'A-15 people filed under a faction of another kind; relationship lines that ignore rank (needs a role-to-archetype table)',
  'the audit\'s "reads as one place" verdict itself',
]);

const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-Z"“‘'(])|\n+/;
/** @param {string} text */
export const sentencesOf = (text) => String(text || '').split(SENTENCE_SPLIT).map((x) => x.trim()).filter(Boolean);

const WATER_TERRAINS = /coast|river|lake|marsh|swamp|island|delta|fjord|wetland|sea/i;
const SEA_WORDS = /\b(?:harbou?r|fish(?:ing|ermen|erman|monger)?s?|fish market|ship(?:s|wright|yard|ping)?|docks?|wharf|wharves|quays?|fleet|sailors?|boats?)\b/i;

/** Does the place have water a boat or a net could use? */
function hasWater(s, config) {
  const terrain = String(s?.config?.terrainType ?? s?.terrain ?? config?.terrainOverride ?? s?.resourceAnalysis?.terrain ?? '');
  const route = String(s?.config?.tradeRouteAccess ?? config?.tradeRouteAccess ?? '');
  return WATER_TERRAINS.test(terrain) || route === 'port' || route === 'river';
}

/**
 * THE SAME TEXT ON TWO NPCs OF ONE ROSTER (REVIEW-INTAKE-3 R10; X-50's defect inside one dossier —
 * across dossiers a shared line is a feature, the owner's word of 2026-11-04). An instrument only:
 * the draw sites belong to the census compose, which owns the cure.
 * @param {ReadonlyArray<any>} npcs
 * @param {(npc: any) => unknown} textOf
 * @returns {{text: string, first: string, second: string, repeated: number}|null} the first text
 *   two NPCs share, who carries it, and how many distinct texts repeat on the roster
 */
export function rosterDuplicate(npcs, textOf) {
  /** @type {Map<string, string>} */
  const seen = new Map();
  /** @type {Set<string>} */
  const repeated = new Set();
  /** @type {{text: string, first: string, second: string}|null} */
  let hit = null;
  for (const npc of Array.isArray(npcs) ? npcs : []) {
    const raw = textOf(npc);
    const text = typeof raw === 'string' ? raw.trim() : '';
    if (!text) continue;
    if (!seen.has(text)) { seen.set(text, String(npc?.name ?? '')); continue; }
    repeated.add(text);
    hit ??= { text, first: seen.get(text) || '', second: String(npc?.name ?? '') };
  }
  return hit ? { ...hit, repeated: repeated.size } : null;
}
const secretTextOf = (npc) => (typeof npc?.secret === 'string' ? npc.secret : npc?.secret?.what);
const goalTextOf = (npc) => (typeof npc?.goal === 'string' ? npc.goal : npc?.goal?.short);

/**
 * The full per-settlement review.
 * @param {object} s the generated record
 * @param {object} config the config it was born from
 * @param {{ tabs: Record<string,string>, tonight: string, tonightSheet: any, pdf: string, foundry: string, errors: Record<string,string> }|null} r
 * @returns {Array<{check:string,surface:string,quote:string,detail:string}>}
 */
export function reviewSettlement(s, config, r) {
  const out = [];
  const add = (check, surface, quote, detail = '') => out.push({ check, surface, quote: String(quote ?? '').slice(0, 400), detail: String(detail ?? '').slice(0, 300) });

  // ── cert: the certification soak's own receipts
  for (const f of inspectSettlement(s, config)) add(`cert:${f.code}`, 'record', f.path, f.detail);

  // ── X-46 car 1: population inside the owner's band for its tier
  const band = OWNER_BANDS[s.tier];
  if (band && !(s.population >= band[0] && s.population <= band[1])) add('X-46:population-outside-band', 'record', String(s.population), `${s.tier} band ${band[0]}–${band[1]}`);

  // ── R10: one roster, the same secret or goal on two NPCs (record checks; no render needed)
  for (const [check, textOf] of [['coh:roster-duplicate-secret', secretTextOf], ['coh:roster-duplicate-goal', goalTextOf]]) {
    const dup = rosterDuplicate(s.npcs, textOf);
    if (dup) add(check, 'record', dup.text, `${dup.first} and ${dup.second}; ${dup.repeated} text(s) repeat on this roster`);
  }

  if (!r) return out;
  for (const [surface, error] of Object.entries(r.errors || {})) add('render:error', surface, '', error);

  const surfaces = { ...r.tabs, tonight: r.tonight, pdf: r.pdf, foundry: r.foundry };
  const screen = { ...r.tabs, tonight: r.tonight };
  const screenText = Object.values(screen).join('\n');
  const allText = Object.values(surfaces).join('\n');

  // ── coh: the seven instruments, every surface
  for (const f of coherenceBattery(s, surfaces)) add(`coh:${f.check}`, f.surface, f.quote, f.detail);

  // ── X-47: no district or tavern names on any text surface
  const quarters = (s.spatialLayout?.quarters || []).flatMap((q) => [q?.name]).filter((n) => typeof n === 'string' && n.length > 3);
  for (const [surface, text] of Object.entries(surfaces)) {
    for (const name of quarters) if (text.includes(name)) { add('X-47:district-name', surface, name); break; }
    const tavern = text.match(/\b(?:The|the) [A-Z][a-z]+(?: (?:and|&) [A-Z][a-z]+| [A-Z][a-z]+)? (?:Inn|Tavern|Alehouse|Taproom)\b/);
    if (tavern) add('X-47:tavern-name', surface, tavern[0]);
  }

  // ── X-48: no look, voice or tell in any export (and the screen card never did)
  const looks = [];
  for (const npc of s.npcs || []) {
    const p = npc?.physical || {};
    for (const k of ['feature', 'build', 'clothes']) if (typeof p[k] === 'string' && p[k].length > 8) looks.push([k, p[k]]);
    for (const k of ['tell', 'speech', 'voice', 'mannerism']) { const v = npc?.personality?.[k] ?? npc?.[k]; if (typeof v === 'string' && v.length > 8) looks.push([k, v]); }
  }
  for (const [surface, text] of Object.entries(surfaces)) {
    const hit = looks.find(([, v]) => text.includes(v));
    if (hit) add('X-48:look-voice-tell', surface, hit[1], hit[0]);
  }

  // ── X-49: the stores figure printed once, on the Economy tab
  const STORE = /\b(?:Stores: a granary, [^.]+ of grain|No granary; [^.]+ in (?:household stores|the larder))\./g;
  const storeHits = Object.entries(r.tabs).flatMap(([tab, text]) => (text.match(STORE) || []).map((q) => [tab, q]));
  const record = s.economicState?.foodSecurity?.foodRecord;
  const stored = Number(record?.storageMonths);
  const ecoHits = storeHits.filter(([tab]) => tab === 'economics');
  if (Number.isFinite(stored) && stored > 0 && ecoHits.length !== 1) add('X-49:stores-not-once', 'economics', ecoHits.map((h) => h[1]).join(' | '), `${ecoHits.length} stores rows on the Economy tab; record holds ${stored} months`);
  for (const [tab, q] of storeHits.filter(([tab]) => tab !== 'economics')) add('X-49:stores-not-once', tab, q, 'the stores figure off its home tab');

  // ── X-50: no boilerplate sentence twice on one surface
  for (const [surface, text] of Object.entries(screen)) {
    const counts = new Map();
    for (const sent of sentencesOf(text)) {
      if (sent.split(/\s+/).length < 8 || !/[.!?]["”’)]?$/.test(sent)) continue;
      const k = normalizeRenderedSentence(sent);
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    for (const [k, n] of counts) if (n > 1) add('X-50:boilerplate-twice', surface, k, `${n} times`);
  }

  // ── X-51: one Tonight sheet whose first line names the crisis
  const stressTypes = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.label).filter(Boolean);
  // The sheet's own opening line (`composeTonightSheet(...).opening`), which the page prints first
  // under its eyebrow; the eyebrow label itself ("Active crisis", "What is urgent") is not the line.
  const firstLine = String(r.tonightSheet?.opening ?? '').trim();
  if (stressTypes.length && !stressTypes.some((label) => firstLine.toLowerCase().includes(String(label).toLowerCase()))) add('X-51:first-line-not-crisis', 'tonight', firstLine, `crisis: ${stressTypes.join(', ')}`);
  if (/^(?:Where play begins: )?They\b/.test(firstLine)) add('A-03:tonight-they', 'tonight', firstLine, 'opens on an unnamed "they"');

  // ── X-52: the Food endurance line once on Defense, agreeing with the stores row
  const endurance = (r.tabs.defense.match(/Food endurance/g) || []).length;
  if (Number.isFinite(stored) && stored > 0 && endurance !== 1) add('X-52:endurance-not-once', 'defense', '', `${endurance} Food endurance lines; record holds ${stored} months`);
  if (endurance > 0 && record?.hasGranary === false && /the granary\b/.test(r.tabs.defense.split('Food endurance')[1]?.slice(0, 300) || '')) add('X-52:endurance-disagrees', 'defense', r.tabs.defense.split('Food endurance')[1].slice(0, 200), 'names a granary the record does not hold');

  // ── A-01: "starving" in the record's hooks where the food record is fed
  if (record && record.band !== 'famine' && (record.gapPct ?? 0) < 20) {
    const starving = sentencesOf(screenText).find((x) => /\bstarving\b/i.test(x));
    if (starving) add('A-01:starving-fed', 'screen', starving, `band ${record.band}, gap ${record.gapPct}%`);
  }

  // ── A-04: magic off, yet a dragon or an alchemist
  const magicOn = (() => { try { return magicWorksAt({ settlement: s }); } catch { return true; } })();
  if (!magicOn) {
    const dragon = sentencesOf(screenText).find((x) => /\bdragons?\b/i.test(x));
    if (dragon) add('A-04:dragon-magic-off', 'screen', dragon);
    const alch = (s.institutions || []).find((i) => /alchem/i.test(i?.name || ''));
    if (alch) add('A-04:alchemist-magic-off', 'record', alch.name);
  }

  // ── A-05: a house named in prose that the Institutions tab does not hold
  const instNames = (s.institutions || []).map((i) => String(i?.name || '').toLowerCase()).join(' | ');
  const hosp = sentencesOf(screenText).find((x) => /\bHospital present\b/i.test(x));
  if (hosp && !/hospital/.test(instNames)) add('A-05:hospital-absent', 'screen', hosp);
  const arena = sentencesOf(screenText).find((x) => /gladiator/i.test(x));
  if (arena && !/arena|amphithea|colosse|fighting pit/.test(instNames)) add('A-05:arena-absent', 'screen', arena);
  const lacks = (screenText.match(/exists but lacks access to/g) || []).length;
  if (lacks) add('A-05:lacks-access-lines', 'screen', '', `${lacks} lines`);

  // ── A-06: crime said absent beside an organised network
  if (/No criminal infrastructure/i.test(screenText) && /criminal network|thieves['’] guild|crime boss|kingpin/i.test(screenText)) add('A-06:crime-absent-and-organised', 'screen', 'No criminal infrastructure', 'and an organised network elsewhere');

  // ── A-08: the fixed hidden-ruler note that never says who
  const hidden = sentencesOf(screenText).find((x) => /appears to govern is not the faction that governs/i.test(x));
  if (hidden) add('A-08:hidden-ruler-note', 'screen', hidden);

  // ── A-09: one behaviour line covering much of a roster
  const roster = (s.npcs || []).length;
  if (roster >= 4) {
    const lines = new Map();
    for (const npc of s.npcs) { const k = npc?.personality?.dominant ?? npc?.personality?.behaviour ?? npc?.personality?.trait; if (typeof k === 'string') lines.set(k, (lines.get(k) || 0) + 1); }
    const top = Math.max(0, ...lines.values());
    if (top / roster >= 0.4) add('A-09:behaviour-line-share', 'record', [...lines].find(([, n]) => n === top)?.[0], `${top} of ${roster}`);
  }

  // ── A-10: role-only NPCs, placeholder factions
  for (const npc of s.npcs || []) if (/^The [A-Z]/.test(String(npc?.name || ''))) { add('A-10:role-only-npc', 'record', npc.name, npc.role || ''); break; }
  const factionNames = [...(s.factions || []), ...(s.powerStructure?.factions || [])].map((f) => String(f?.name ?? f?.faction ?? ''));
  const placeholder = factionNames.find((n) => /\b(?:Bloc|Faction) [A-Z]\b|Unknown Faction/.test(n));
  if (placeholder) add('A-10:placeholder-faction', 'record', placeholder);

  // ── A-11: sea words where there is no water
  if (!hasWater(s, config)) {
    const sea = sentencesOf(screenText).find((x) => SEA_WORDS.test(x));
    if (sea) add('A-11:sea-words-landlocked', 'screen', sea);
  }

  // ── A-12: the page vouches for itself while the battery finds a contradiction
  const vouch = sentencesOf(screenText).find((x) => /contradicts anything else in it/i.test(x));
  const contradictions = out.filter((f) => (KIND_OF[f.check] || 0) >= 1 && KIND_OF[f.check] !== 6).length;
  if (vouch && contradictions) add('A-12:self-vouch-false', 'screen', vouch, `${contradictions} contradiction findings`);

  // ── A-14: town furnishings in small places
  if (s.tier === 'thorp' || s.tier === 'hamlet') {
    const guild = factionNames.find((n) => /guild/i.test(n));
    if (guild) add('A-14:guild-power-small', 'record', guild, s.tier);
    if (/\bLord Mayor\b/.test(allText)) add('A-14:lord-mayor-small', 'screen', 'Lord Mayor', s.tier);
  }
  return out;
}
