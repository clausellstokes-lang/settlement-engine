// PAGE-1 helper C, F5: secrets and wants that contradict their holder. RECORD-LEVEL: the card prints the secret as
// `npc.secret.what` (npcComponents.jsx:577-601), the Wants line's first entry as `npc.goal.short`
// (npcInteriorityRead.js:269-273 firstText unwraps {short}), the Temperament chip as `personality.dominant`
// (entityLinks.js:214), so each is measured on the record.
// Run from the repository root:
//   node docs/chair/2026-11-20/content/page/measures/C/f5.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/C/f5.out.txt 2>&1
// Optional 3rd arg: towns per size (default 50 = the chair's 300). Optional env C_CACHE=<file> caches the forged towns.
import { loadTowns, pct, tally } from './towns.mjs';

const [, , L = process.cwd(), nA = '50'] = process.argv;
const towns = await loadTowns(L, +nA, process.env.C_CACHE || null);
const { NPC_CRIMINAL_SECRETS_BY_HOLDER, SECRETS_DENIED_BY_TEMPERAMENT } = await import(`${L}/src/data/npcData.js`);
const { TITLE_SECRETS } = await import(`${L}/src/data/people/titleSecretsPresentations.js`);
const { STRESS_INSTITUTION_EFFECTS } = await import(`${L}/src/data/stressInstitutionEffects.js`);
const { rareRowOf } = await import(`${L}/src/generators/people/rareSecrets.js`);
const { classOfRole } = await import(`${L}/src/domain/roles/roleClass.js`);
const { poolFor, POOL_BY_TITLE } = await import(`${L}/src/generators/people/poolMap.js`);
const { PERSONALITY_CLUSTER_OF } = await import(`${L}/src/data/people/goalFamilies.js`);
const say = (...a) => console.log(...a);
const SIZES = [...new Set(towns.map((t) => t.size))];

// ── THE POOLS: every secret text the record can carry, with its pool and who may draw it ───────────────────
const SOURCE = new Map(); // text -> { pool, who }
const add = (text, pool, who) => { const k = String(text).trim(); if (!SOURCE.has(k)) SOURCE.set(k, { pool, who }); };
for (const [key, types] of Object.entries(NPC_CRIMINAL_SECRETS_BY_HOLDER)) for (const [type, rows] of Object.entries(types)) for (const r of rows) add(r.secret, `criminal.${key}.${type}`, key === 'any' ? 'any holder (factionLeaderSecret.js:114 criminalSecretsForHolder)' : `holder class ${key} (roleClass.js classOfRole of the POOL role)`);
for (const [title, rows] of Object.entries(TITLE_SECRETS)) for (const r of rows) add(r.secret, `title:${title}`, `the face titled ${title} (npcGenerator.js:120-122 titleLinesFor)`);
for (const [stress, rows] of Object.entries(STRESS_INSTITUTION_EFFECTS)) for (const r of rows) if (r?.secret) add(r.secret, `stress:${stress}`, 'a crisis holder (stressInstitutionEffects.js crisisHolderAdmits)');
const sourceOf = (n) => {
  const what = String(n.secret?.what || '').trim();
  if (!what) return { pool: '(no secret)' };
  if (SOURCE.has(what)) return SOURCE.get(what);
  // npcGenerator.js:596-609 generateCrimeLevel's CRIME_KNOWLEDGE frames (a named other person), drawn for any holder at 25%
  if (/^Knows something about .+ that .+ believes no one else knows|^Was present when .+ did something they've never accounted for|^Owes .+ a debt from before either of them|^Has been reading .+'s correspondence through an intermediary/.test(what)) return { pool: 'crimeKnowledge (npcGenerator.js:596-609)', who: 'any holder' };
  // npcGenerator.js:1023 rewords the thieves' guild row to the town's own underworld
  if (/^On the payroll of .+ as a silent informant/.test(what)) return { pool: 'criminal.any.criminal (reworded, npcGenerator.js:1023)', who: 'any holder' };
  const rare = rareRowOf(n.secret);
  if (rare) return { pool: `rare.${rare.family}:${rare.row.key}`, who: 'rare deal (rareSecrets.js, holder keys of data/rareSecrets.js:65)' };
  // a reworded row (the town's own underworld for "the thieves' guild", market words stripped): match its first 30 characters
  const head = what.slice(0, 30);
  for (const [k, v] of SOURCE) if (k.slice(0, 30) === head) return { ...v, pool: `${v.pool} (reworded)` };
  return { pool: '(unmatched)' };
};

say(`F5 — secrets or wants that contradict their holder. ${towns.length} towns (${SIZES.map((s) => `${s} ${towns.filter((t) => t.size === s).length}`).join(', ')}).`);
say('\n§0 THE SECRET POOLS (INFERRED from the code; sizes EXECUTED from the data):');
say(`  npcData.js:843 NPC_CRIMINAL_SECRETS_BY_HOLDER: ${Object.entries(NPC_CRIMINAL_SECRETS_BY_HOLDER).map(([k, ts]) => `${k} {${Object.entries(ts).map(([t, r]) => `${t} ${r.length}`).join(', ')}}`).join(' · ')} — drawn by factionLeaderSecret.js:71 for a face with no title lines; holder class from classOfRole(POOL role) (factionLeaderSecret.js:112); 'any' rows are admitted for EVERY class.`);
say(`  titleSecretsPresentations.js:2271 TITLE_SECRETS: ${Object.keys(TITLE_SECRETS).length} titles × 3 — drawn by the title alone (npcGenerator.js:120-122). No clergy, magistrate, or watch title but "the watch commander", "the watch sergeant", "the prison warden", "the gaoler", "the warden", "the castellan" has a row: ${['the priest', 'the bishop', 'the dean', 'the senior abbot', 'the chief magistrate', 'the magistrate', 'the watch captain', 'the watch commander', 'the watch sergeant', 'the garrison commander', 'the militia captain', 'the castellan', 'the prison warden', 'the gaoler', 'the warden'].map((t) => `${t}:${TITLE_SECRETS[t] ? 'yes' : 'no'}`).join(' ')}`);
say(`  stressInstitutionEffects.js:41 STRESS_INSTITUTION_EFFECTS: ${Object.keys(STRESS_INSTITUTION_EFFECTS).length} crises; rareSecrets (data/rareSecrets.js:314) five families, keyed by holder words.`);

// ── THE HOLDER GROUPS (explicit, by the face's house title `institution.title`, which the card prints) ─────
const GROUP_TITLES = {
  CLERGY: ['the dean', 'the bishop', 'the priest', 'the senior abbot', 'the abbot', 'the grove elder', 'the almoner', 'the hospitaller', 'the archdruid', "the hospital's master", 'the foundling-mother'],
  JUSTICE: ['the chief magistrate', 'the magistrate'],
  WATCH: ['the watch commander', 'the watch captain', 'the watch sergeant', 'the militia captain', 'the garrison commander', 'the castellan', 'the warden', 'the prison warden', 'the gaoler'],
};
const groupOf = (n) => { const ti = n.institution?.title || n.title; for (const [g, ts] of Object.entries(GROUP_TITLES)) if (ts.includes(ti)) return g; return null; };
say('\n§1 THE HOLDER GROUPS (by institution.title; the brief\'s CLERGY / JUSTICE / WATCH): titles, cards, the POOL role each is born through (poolMap.js:57) and its classOfRole (roleClass.js:77):');
for (const [g, ts] of Object.entries(GROUP_TITLES)) say(`  ${g}: ${ts.map((t) => { const c = towns.reduce((a, x) => a + x.npcsFull.filter((n) => (n.institution?.title || n.title) === t).length, 0); const pr = POOL_BY_TITLE[t] ? poolFor(t).role : '?'; return `${t} ${c} [${pr} -> ${classOfRole(pr)}]`; }).join(' · ')}`);
say('  (left out, arms for hire or not a keeper of the peace: the company captain, the blade captain, the lanista, the lodge master; the customs collector and toll-keeper are offices of the purse.)');

// ── "ANOTHER TRADE'S WRONG": an explicit list of secret texts that presume a trade the holder must keep ──────
const OTHER_TRADE = [
  [/^Runs a protection scheme targeting the very merchants they're supposed to serve/, 'a market office: merchants they are supposed to serve (npcData.js criminal.any[5])'],
  [/^Has been falsifying inspection records for a fee/, 'an inspector: inspection records (criminal.any[6])'],
  [/^Their legitimate business is a front for moving contraband/, 'a business-keeper: a legitimate business (criminal.any[7])'],
  [/^Has been quietly betting against the ventures they talk their neighbours into/, 'a promoter of ventures (economic_betrayal[0])'],
  [/^The goods they sell as locally produced/, 'a seller of goods (economic_betrayal[1])'],
  [/^Has been paying a health official to suppress a finding about their product/, 'a maker of a product (economic_betrayal[2])'],
  [/^Has information about a competitor that would ruin them/, 'a business with competitors (economic_betrayal[3])'],
  [/^Their business partner died of natural causes/, 'a business with a partner (economic_betrayal[4])'],
];
const otherTradeOf = (n, group) => {
  const what = String(n.secret?.what || '');
  for (const [re, why] of OTHER_TRADE) if (re.test(what)) return why;
  const src = sourceOf(n).pool;
  const ti = n.institution?.title || n.title;
  if (src.startsWith('title:') && !src.startsWith(`title:${ti}`)) return `another title's own line (${src})`;
  return null;
};
const venalRe = /embezzl|fencing|payroll|brib|protection scheme|for a fee|contraband|skim|selling|\bsells\b|betting against|exploitative labour|suppress a finding|been paid|paid to|is paid|for a share|pocket|keeping back|on the side|smuggl|overcharg|charges the families|cut of|kickback|monthly payment|for a purse|who pays? for it|families can pay|taking offerings|give generously|for money|for gold|for coin/i;
const venalOf = (what) => venalRe.test(String(what || ''));

const groups = { CLERGY: [], JUSTICE: [], WATCH: [] };
for (const t of towns) for (const n of t.npcsFull) { const g = groupOf(n); if (g) groups[g].push({ t, n }); }
say('\n§2 THE GROUPS\' SECRETS: share whose secret is another trade\'s wrong (the list above), by group and size; and the source pool of every secret:');
for (const [g, xs] of Object.entries(groups)) {
  const ot = xs.filter((x) => otherTradeOf(x.n, g));
  say(`  ${g}: cards ${xs.length}; with a secret ${xs.filter((x) => x.n.secret?.what).length}; ANOTHER TRADE'S WRONG ${ot.length}/${xs.length} = ${pct(ot.length, xs.length)}; venal secret ${pct(xs.filter((x) => venalOf(x.n.secret?.what)).length, xs.length)}`);
  say(`    by size: ${SIZES.map((s) => { const a = xs.filter((x) => x.t.size === s); return `${s} ${a.filter((x) => otherTradeOf(x.n, g)).length}/${a.length}`; }).join(' | ')}`);
  say(`    which wrongs: ${tally(ot.map((x) => otherTradeOf(x.n, g))).map(([k, v]) => `${v} ${k}`).join(' · ')}`);
  say(`    source pools: ${tally(xs.map((x) => sourceOf(x.n).pool.replace(/:[^ ]+$/, (m) => m))).slice(0, 14).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
}
say('\n§2b THE SAME LIST ON EVERY OTHER CARD (the base rate; for a trade keeper some of these are its own trade): ' + (() => { const rest = towns.flatMap((t) => t.npcsFull.filter((n) => !groupOf(n)).map((n) => ({ t, n }))); const ot = rest.filter((x) => otherTradeOf(x.n, null)); return `${ot.length}/${rest.length} = ${pct(ot.length, rest.length)}; their categories: ${tally(ot.map((x) => x.n.category)).map(([k, v]) => `${k} ${v}`).join(' · ')}`; })());
say('§2c CLERGY / JUSTICE / WATCH drawing the soldier\'s past (criminal.any.military, npcData.js "Was captured and released...", "...decisive victory...won through treachery"): ' + Object.entries(groups).map(([g, xs]) => `${g} ${xs.filter((x) => sourceOf(x.n).pool === 'criminal.any.military').length}`).join(' · '));

// ── WANTS AND SECRETS ON ONE CARD ──────────────────────────────────────────────────────────────────────
const WANT_CLASS = (i) => {
  if (!i) return 'none';
  if (i.family === 'PERSONALITY' && ['duty', 'kindness', 'conviction'].includes(i.kind)) return 'PRINCIPLE';
  if (i.family === 'ALLEGIANCE' && ['warrant', 'suspicion'].includes(i.kind)) return 'LAW';
  if (i.family === 'PERSONALITY' && ['greed', 'hunger_for_status', 'forbidden_patron'].includes(i.kind)) return 'VENAL';
  if (i.family === 'ALLEGIANCE' && /^(serve_|keep_|front_keep)/.test(i.kind)) return 'VENAL';
  return 'NEUTRAL';
};
say('\n§3 THE CLASSIFICATION TABLES (explicit):');
say('  WANT (goal.intent.short; the card prints goal.short as its first want): PRINCIPLE = PERSONALITY/duty|kindness|conviction (goalFamilies.js:679,693,735); LAW = ALLEGIANCE/warrant|suspicion (goalFamilies.js:973,992); VENAL = PERSONALITY/greed|hunger_for_status|forbidden_patron, ALLEGIANCE/serve_*|keep_*|front_keep; NEUTRAL = every other (RANK, POWER, INSTITUTION, SUPPLY, TIES, the rest of PERSONALITY and ALLEGIANCE, UNCANNY, CRISIS).');
say(`  SECRET VENAL = the secret's words match ${venalRe} (crime for gain: money taken, goods moved, records sold or forged). Every distinct VENAL secret drawn on the 300 is listed in §6.`);
const TEMPER_PRINCIPLE = Object.entries(PERSONALITY_CLUSTER_OF).filter(([w, c]) => ['duty', 'kindness'].includes(c) || ['pious', 'idealistic', 'zealous'].includes(w)).map(([w]) => w);
say(`  TEMPERAMENT OF PRINCIPLE (personality.dominant, the "Temperament" chip, entityLinks.js:214): PERSONALITY_CLUSTER_OF (goalFamilies.js:125) duty + kindness, and pious, idealistic, zealous: ${TEMPER_PRINCIPLE.join(', ')}`);

const all = towns.flatMap((t) => t.npcsFull.map((n) => ({ t, n, g: groupOf(n) || 'OTHER', w: WANT_CLASS(n.goal?.intent?.short), wl: WANT_CLASS(n.goal?.intent?.long), v: venalOf(n.secret?.what) })));
say('\n§4 WANT x SECRET on one card (printed want = short):');
for (const g of ['CLERGY', 'JUSTICE', 'WATCH', 'OTHER']) {
  const xs = all.filter((x) => x.g === g);
  const pr = xs.filter((x) => (x.w === 'PRINCIPLE' || x.w === 'LAW') && x.v);
  say(`  ${g.padEnd(7)} cards ${xs.length}; venal secret ${pct(xs.filter((x) => x.v).length, xs.length)}; want PRINCIPLE ${xs.filter((x) => x.w === 'PRINCIPLE').length}, LAW ${xs.filter((x) => x.w === 'LAW').length}; PRINCIPLE/LAW want + VENAL secret: ${pr.length} (${pct(pr.length, xs.length)} of the cards; ${pct(pr.length, xs.filter((x) => x.w === 'PRINCIPLE' || x.w === 'LAW').length)} of the principled wants); long-vantage PRINCIPLE/LAW + venal: ${xs.filter((x) => (x.wl === 'PRINCIPLE' || x.wl === 'LAW') && x.v).length}`);
}
const allPr = all.filter((x) => (x.w === 'PRINCIPLE' || x.w === 'LAW') && x.v);
say(`  ALL cards: ${allPr.length}/${all.length} = ${pct(allPr.length, all.length)}; by size: ${SIZES.map((s) => { const a = all.filter((x) => x.t.size === s); return `${s} ${a.filter((x) => (x.w === 'PRINCIPLE' || x.w === 'LAW') && x.v).length}/${a.length}`; }).join(' | ')}`);
say('  examples (one per want class):');
for (const c of ['PRINCIPLE', 'LAW']) { const x = allPr.find((y) => y.w === c && y.g !== 'OTHER') || allPr.find((y) => y.w === c); if (x) say(`    ${x.t.seed} ${x.n.name} (${x.n.institution?.title || x.n.title}): Wants "${x.n.goal.short}" | Secret "${x.n.secret.what}"`); }

say('\n§5 TEMPERAMENT x SECRET: a temperament of principle printed beside a venal secret');
for (const g of ['CLERGY', 'JUSTICE', 'WATCH', 'OTHER']) {
  const xs = all.filter((x) => x.g === g && x.n.personality?.dominant);
  const bad = xs.filter((x) => TEMPER_PRINCIPLE.includes(x.n.personality.dominant) && x.v);
  say(`  ${g.padEnd(7)} cards with a temperament ${xs.length}; principled temperament + venal secret ${bad.length} (${pct(bad.length, xs.length)}); words: ${tally(bad.map((x) => x.n.personality.dominant)).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
}
const tAll = all.filter((x) => x.n.personality?.dominant && TEMPER_PRINCIPLE.includes(x.n.personality.dominant) && x.v);
say(`  ALL cards: ${tAll.length}/${all.filter((x) => x.n.personality?.dominant).length}; of which the existing guard (npcData.js:2548 SECRETS_DENIED_BY_TEMPERAMENT: ${Object.keys(SECRETS_DENIED_BY_TEMPERAMENT).join(', ')}) names the word: ${tAll.filter((x) => SECRETS_DENIED_BY_TEMPERAMENT[x.n.personality.dominant]).length}`);
const pIncl = tAll.filter((x) => x.n.personality.dominant === 'principled');
say(`  "principled" + venal secret: ${pIncl.length}${pIncl[0] ? `; e.g. ${pIncl[0].t.seed} ${pIncl[0].n.name} (${pIncl[0].n.institution?.title || pIncl[0].n.title}): "${pIncl[0].n.secret.what}"` : ''}`);

say('\n§6 EVERY DISTINCT SECRET DRAWN BY A CLERGY / JUSTICE / WATCH CARD, with its source pool, VENAL flag and other-trade flag (count):');
const rows = new Map();
for (const g of ['CLERGY', 'JUSTICE', 'WATCH']) for (const x of groups[g]) {
  const what = String(x.n.secret?.what || '(none)'); const k = `${g}\t${what}`;
  const r = rows.get(k) || { g, what, c: 0, src: sourceOf(x.n).pool, v: venalOf(what), ot: otherTradeOf(x.n, g) };
  r.c++; rows.set(k, r);
}
for (const r of [...rows.values()].sort((a, b) => a.g.localeCompare(b.g) || b.c - a.c)) say(`  ${r.g}\t${r.c}\t${r.v ? 'VENAL' : '-'}\t${r.ot ? 'OTHER-TRADE' : '-'}\t${r.src}\t${r.what.slice(0, 140)}`);

say('\n§7 EVERY DISTINCT VENAL SECRET ON THE 300 (all cards; count, source pool): the classification table for "venal"');
const vrows = new Map();
for (const x of all) if (x.v) { const k = String(x.n.secret.what); const r = vrows.get(k) || { c: 0, src: sourceOf(x.n).pool }; r.c++; vrows.set(k, r); }
for (const [k, r] of [...vrows].sort((a, b) => b[1].c - a[1].c)) say(`  ${r.c}\t${r.src}\t${k.slice(0, 150)}`);
say('\n§7b THE NON-VENAL secrets that a reader might call venal were checked by eye in §6; the regex is the whole rule.');

// ── §8 (added work, the coordinator's): THE CATCH-ALL ─────────────────────────────────────────────────────────────
// The catch-all = factionLeaderSecret.js's pools (NPC_CRIMINAL_SECRETS_BY_HOLDER), drawn by a face whose title has no row in
// TITLE_SECRETS (npcGenerator.js:120-127). Its lines that presume an office or a trade, with the card categories they FIT
// (my classification, explicit; a card of another category that drew the line is a MISFIT):
const OFFICE = ['government', 'military', 'religious'];
const TRADE = ['economy', 'crafts', 'other', 'criminal'];
const PRESUMES = [
  [/^Has been embezzling from the organisation they oversee/, 'oversees an organisation', null],
  [/^On the payroll of /, 'holds a post (stakes: "cost them their post")', OFFICE],
  [/^Has been systematically bribing multiple officials for preferential treatment/, 'a trade that seeks favour', TRADE],
  [/^Runs a protection scheme targeting the very merchants/, 'serves the merchants (a market office, a watch)', ['government', 'military']],
  [/^Has been falsifying inspection records for a fee/, 'an inspector', ['government']],
  [/^Their legitimate business is a front/, 'keeps a business', TRADE],
  [/^Their appointment was secured through forged credentials/, 'an appointed office', OFFICE],
  [/^Has been delaying vital information from reaching the decision-makers/, 'an official between the facts and the deciders', ['government', 'military']],
  [/^Has agreed to hand over authority to an external power/, 'holds authority', ['government', 'military', 'noble']],
  [/^Has been quietly betting against the ventures|^The goods they sell as locally produced|^Has been paying a health official to suppress a finding about their product|^Has information about a competitor|^Their business partner died/, 'keeps a business (economic_betrayal)', TRADE],
  [/^Was captured and released under terms/, 'a soldier\'s past', ['military']],
  [/^Has been studying a forbidden school of magic under a false research pretext/, 'a scholar of magic', ['magic']],
];
say('\n§8 THE CATCH-ALL (factionLeaderSecret.js pools, npcData.js:843): lines that presume an office or trade, the categories they fit, and who drew them on the 300');
for (const [re, presumes, fits] of PRESUMES) {
  const xs = all.filter((x) => re.test(String(x.n.secret?.what || '')));
  const mis = fits ? xs.filter((x) => !fits.includes(x.n.category)) : [];
  say(`  "${String(re).slice(2, 60)}…" presumes ${presumes}; fits ${fits ? fits.join('/') : 'any face (every face keeps a house)'}: drawn ${xs.length}, MISFIT ${mis.length}${mis.length ? ` (${tally(mis.map((x) => x.n.institution?.title || x.n.title)).slice(0, 8).map(([k, v]) => `${k} ${v}`).join(' · ')})` : ''}`);
}
const fromCatchAll = (x) => /^criminal\./.test(sourceOf(x.n).pool);
say(`\n§8b CARDS FALLING TO THE CATCH-ALL, per title (institution.title; cards on the 300; catch-all share; whether the title has a TITLE_SECRETS row):`);
const byTitle = new Map();
for (const x of all) { const ti = x.n.institution?.title || x.n.title || '(none)'; const r = byTitle.get(ti) || { n: 0, c: 0, cat: x.n.category }; r.n++; if (fromCatchAll(x)) r.c++; byTitle.set(ti, r); }
say(`  all cards: ${all.filter(fromCatchAll).length}/${all.length} = ${pct(all.filter(fromCatchAll).length, all.length)} from the catch-all`);
for (const [ti, r] of [...byTitle].filter(([, r]) => r.c > 0).sort((a, b) => b[1].c - a[1].c)) say(`  ${String(r.c).padStart(4)}/${String(r.n).padEnd(4)} ${ti} [${r.cat}]${TITLE_SECRETS[ti] ? ' (HAS a title row: its fall-through, held lines, or a mint)' : ''}`);
say(`  religious titles: ${[...byTitle].filter(([, r]) => r.cat === 'religious').map(([ti, r]) => `${ti} ${TITLE_SECRETS[ti] ? 'row' : 'NO ROW'} ${r.c}/${r.n}`).join(' · ')}`);
