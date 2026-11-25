#!/usr/bin/env node
/**
 * E8 (WORDS-1): THE HAND-CLASSED TABLE of every line that prints a they-reflexive on a person's card or in a tie, and the
 * count of each class over `e8-records.mjs`'s TSV. Classed BY HAND from the measure (C and V at 0ec96f13d), by the words that
 * carry the reflexive:
 *   BOUND      the reflexive binds ONE person whose gender the record holds (the card's own person; the tie's named end),
 *              and no other they-form in its clause binds that person: the slot writes himself / herself;
 *   BOUND-THEY the reflexive binds the card's person, but its clause also binds that person with "they"/"them" ("they have
 *              kept quiet to save themselves"): singular they throughout, consistent; left as written (a reflexive slot
 *              alone would make "they … himself");
 *   OTHER      the reflexive binds someone else: a plural ("the owners … themselves"), an indefinite ("someone who cannot
 *              stand up for themselves"), the pair together ("keep their reasons to themselves").
 * Usage: node e8-classes.mjs <e8rec.tsv>   (prints the count by class and field, and every reflexive string no row classes)
 */
import { readFileSync } from 'node:fs';

/** @type {ReadonlyArray<[RegExp, 'BOUND' | 'BOUND-THEY' | 'OTHER', string]>} [the words, the class, the home of the line] */
export const E8_CLASSES = [
  [/speaks of themselves in the third person when angry/, 'BOUND', 'npcData.js tells'],
  [/and make themselves useful to them\./, 'BOUND', 'goalFamilies.js RANK.enter'],
  [/sure of themselves, and not careless with it/, 'BOUND', 'npcData.js presentation'],
  [/Is themselves a newcomer/, 'BOUND', 'stressInstitutionEffects.js secret'],
  [/whatever the cost to themselves/, 'BOUND', 'npcGenerator.js goal.long'],
  [/telling themselves it doesn't matter/, 'BOUND', 'stressInstitutionEffects.js secret'],
  [/Gives away little about themselves/, 'BOUND', 'titleSecretsPresentations.js presentation'],
  [/cannot bring themselves to sell it/, 'BOUND', 'rareSecrets.js stoleRelic'],
  [/Is not themselves when the moon is full/, 'BOUND', 'rareSecrets.js moonChanged'],
  [/Taught themselves to read/, 'BOUND', 'rareSecrets.js oneBook'],
  [/never once let themselves be seen/, 'BOUND', 'rareSecrets.js feedsNeighbour'],
  [/spending it on themselves/, 'BOUND', 'titleSecretsPresentations.js headman'],
  [/moved the stone themselves/, 'BOUND', 'titleSecretsPresentations.js'],
  [/^Set the terms between .+ themselves, and stop taking them from others\./, 'BOUND', 'goalFamilies.js POWER'],
  [/would rather keep to themselves\./, 'BOUND', 'npcData.js mutual_leverage.tension[12] (the tie\'s second end)'],
  [/^Make themselves so valuable to .+ that they are protected\./, 'BOUND-THEY', 'goalFamilies.js'],
  [/^Make themselves worth more to .+ than the help is worth to them\./, 'BOUND-THEY', 'goalFamilies.js'],
  [/sit up a night with them and see the thing for themselves/, 'BOUND-THEY', 'goalFamilies.js UNCANNY'],
  [/For six weeks they have kept quiet to save themselves/, 'BOUND-THEY', 'stressInstitutionEffects.js stakes'],
  [/think they talk to themselves/, 'BOUND-THEY', 'rareSecrets.js ghost stakes'],
  [/they would deal with it themselves/, 'OTHER', 'the owners'],
  [/would turn on the (trainer|madam) to save themselves/, 'OTHER', 'the buyers / the customers'],
  [/stand up for someone who cannot stand up for themselves/i, 'OTHER', 'someone (indefinite)'],
  [/blamed on the newcomers themselves/, 'OTHER', 'the newcomers'],
  [/keep their reasons to themselves/, 'OTHER', 'the pair'],
  [/officials who are themselves on the take/, 'OTHER', 'the officials'],
  [/name every buyer to save themselves/, 'OTHER', "the boats' owners"],
];

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const lines = readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean);
  const by = {}; const unclassed = {};
  for (const l of lines) {
    const [seed, size, field, gender, text] = l.split('\t');
    if (!/^(npcs|relationships|prominentRelationship)/.test(field)) continue;
    if (!/\b(themselves|themself)\b/.test(text)) continue;
    const row = E8_CLASSES.find(([re]) => re.test(text));
    if (!row) { const k = `${field} | ${text.slice(0, 120)}`; unclassed[k] = (unclassed[k] || 0) + 1; continue; }
    const k = `${row[1]}\t${row[2]}\t${field}`;
    const e = (by[k] ||= { n: 0, places: new Set(), g: {} }); e.n++; e.places.add(seed); e.g[gender] = (e.g[gender] || 0) + 1;
  }
  const tot = {};
  for (const [k, e] of Object.entries(by).sort()) {
    const cls = k.split('\t')[0]; (tot[cls] ||= { n: 0, places: new Set() }).n += e.n; for (const p of e.places) tot[cls].places.add(p);
    console.log(`${String(e.n).padStart(5)} ${String(e.places.size).padStart(4)}p  ${k.replace(/\t/g, ' | ')}  ${JSON.stringify(e.g)}`);
  }
  for (const [c, t] of Object.entries(tot)) console.log(`TOTAL ${c}: ${t.n} strings in ${t.places.size} places`);
  const u = Object.entries(unclassed);
  console.log(`UNCLASSED: ${u.length}`); for (const [k, n] of u) console.log(`  ${n} ${k}`);
}
