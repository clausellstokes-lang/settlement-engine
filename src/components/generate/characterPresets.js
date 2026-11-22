/**
 * characterPresets.js — the 17 "Character" archetypes.
 *
 * Extracted VERBATIM from ConfigurationPanel.jsx's in-file ARCHETYPES /
 * ARCHETYPE_GROUPS so the same data drives both the promoted top-level Character
 * preset card (Create Tier-1) and the legacy slider-panel dropdown. Applying a
 * preset writes the SAME priority slider values + monsterThreat it always did —
 * the Create reorg is a UI reshuffle, not a config→generator mapping change, so
 * generation stays byte-identical.
 *
 * Pure data. No store, no React.
 */

export const ARCHETYPES = [
  { key: 'balanced', name: 'Balanced', desc: 'No dominant characteristic', threat: 'frontier', e: 50, m: 50, mg: 50, r: 50, c: 50 },
  { key: 'merchant_republic', name: 'Merchant Republic', desc: 'Trade hub; guild security', threat: 'heartland', e: 82, m: 38, mg: 42, r: 32, c: 62 },
  { key: 'trade_crossroads', name: 'Trade Crossroads', desc: 'Major overland hub; active guilds', threat: 'heartland', e: 85, m: 55, mg: 45, r: 40, c: 55 },
  { key: 'mining_colony', name: 'Mining Colony', desc: 'Resource extraction; high military', threat: 'frontier', e: 68, m: 72, mg: 22, r: 35, c: 52 },
  { key: 'military_fortress', name: 'Military Fortress', desc: 'Heavily garrisoned; spartan', threat: 'frontier', e: 28, m: 92, mg: 18, r: 42, c: 28 },
  { key: 'frontier_outpost', name: 'Frontier Outpost', desc: 'Small post on edge of civilisation', threat: 'frontier', e: 35, m: 80, mg: 25, r: 38, c: 40 },
  { key: 'besieged_holdout', name: 'Besieged Holdout', desc: 'Under constant threat; fortified by necessity', threat: 'plagued', e: 25, m: 88, mg: 32, r: 65, c: 35 },
  { key: 'plague_of_beasts', name: 'Embattled: Creature Threat', desc: 'Hostile incursion; survival economy', threat: 'plagued', e: 22, m: 75, mg: 38, r: 78, c: 48 },
  { key: 'theocracy', name: 'Theocracy', desc: 'Church controls civic life', threat: 'heartland', e: 38, m: 52, mg: 35, r: 92, c: 18 },
  { key: 'holy_sanctuary', name: 'Holy Sanctuary', desc: 'Peaceful pilgrimage centre', threat: 'heartland', e: 35, m: 22, mg: 38, r: 95, c: 15 },
  { key: 'crusader_chapter', name: 'Crusader Chapter', desc: 'Faith and force unified', threat: 'frontier', e: 32, m: 82, mg: 28, r: 82, c: 18 },
  { key: 'mage_city', name: 'Mage City', desc: 'Arcane research centre', threat: 'heartland', e: 62, m: 28, mg: 92, r: 22, c: 38 },
  { key: 'arcane_academy', name: 'Arcane Academy', desc: 'Magical education above all', threat: 'heartland', e: 52, m: 32, mg: 96, r: 28, c: 35 },
  { key: 'monster_hunters', name: "Monster Hunters' Lodge", desc: 'Magic and military vs creatures', threat: 'plagued', e: 42, m: 72, mg: 68, r: 38, c: 30 },
  { key: 'lawless_frontier', name: 'Lawless Frontier', desc: 'Criminal networks fill the vacuum', threat: 'frontier', e: 42, m: 58, mg: 30, r: 28, c: 82 },
  { key: 'criminal_haven', name: 'Criminal Haven', desc: 'The guild IS the government', threat: 'heartland', e: 72, m: 25, mg: 35, r: 20, c: 90 },
  { key: 'safe_province_capital', name: 'Safe Province Capital', desc: 'Peaceful administrative centre', threat: 'heartland', e: 68, m: 42, mg: 48, r: 55, c: 38 },
];

export const ARCHETYPE_GROUPS = [
  { label: 'Neutral', keys: ['balanced'] },
  { label: 'Economic', keys: ['merchant_republic', 'trade_crossroads', 'mining_colony'] },
  { label: 'Military', keys: ['military_fortress', 'frontier_outpost', 'besieged_holdout', 'plague_of_beasts'] },
  { label: 'Religious', keys: ['theocracy', 'holy_sanctuary', 'crusader_chapter'] },
  { label: 'Arcane', keys: ['mage_city', 'arcane_academy', 'monster_hunters'] },
  { label: 'Criminal', keys: ['lawless_frontier', 'criminal_haven'] },
  { label: 'Civic', keys: ['safe_province_capital'] },
];

/**
 * The config patch a Character archetype applies — the SAME priority values +
 * monsterThreat the legacy SliderPanel dropdown wrote. Returns null for an
 * unknown key. Pure.
 * @param {string} key
 * @returns {{ priorityEconomy: number, priorityMilitary: number, priorityMagic: number, priorityReligion: number, priorityCriminal: number, monsterThreat: string } | null}
 */
export function archetypePatch(key) {
  const a = ARCHETYPES.find(x => x.key === key);
  if (!a) return null;
  return {
    priorityEconomy: a.e,
    priorityMilitary: a.m,
    priorityMagic: a.mg,
    priorityReligion: a.r,
    priorityCriminal: a.c,
    monsterThreat: a.threat,
  };
}
