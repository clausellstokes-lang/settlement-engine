// REVIEW-W2B-3 items 3 (8, 9) and 4: the instrument's word rules on hand-made towns and sentences (the tip's own code).
// TREE=<tree> node wordplants.mjs
const T = process.env.TREE;
const { vocabularyPageFindings } = await import(T + '/src/domain/coherence/vocabularyPageFindings.js');
const { thingsNamedIn } = await import(T + '/src/domain/facts/registeredWords.js');
const { institutionalCatalog } = await import(T + '/src/data/institutionalCatalog.js');
const town = (tier, population, institutions, extra = {}) => ({ tier, population, config: {}, stress: [], institutions, powerStructure: { factions: [{ faction: 'Elders' }] }, ...extra });
const w = (rec, line, view = 'Systems/Overview') => vocabularyPageFindings(rec, { [view]: [line] }).map((f) => `${f.word}/${f.side}`).join(',') || '-';
console.log('— F8: the church words (thingsNamedIn: the walker\'s and the page\'s matcher)');
for (const s of ['The faith\'s god and the church\'s name are yours to set.', 'The church\'s name is carved over the door of the nave.',
  'Everyone in the hamlet knows the church\'s name and its saint.', 'The church’s name was changed when the new priest came.', 'Give the church a name and a patron.',
  'Name the church\'s patron saint and its feast day.', 'The churches\' names are written in the parish book.']) console.log(' ', JSON.stringify(thingsNamedIn(s)).padEnd(12), s);
console.log('— F9: counted houses (a town with the rows shown)');
const C = [
  [['Parish churches (2-5)'], 'Five temples serve the parish.'], [['Parish churches (2-5)'], 'Six temples serve the parish.'],
  [['Access to external mill'], 'Two mills grind for the whole valley.'], [['Mill', 'Access to external mill'], 'Two mills grind for the whole valley.'],
  [['Wayside shrine'], 'Two temples face each other across the square.'], [['Craft guilds (5-15)', 'Merchant guild'], 'Sixteen guilds share the hall.'],
  [['Craft guilds (5-15)', 'Merchant guild'], 'The 16 guilds share the hall.'], [['Craft guilds (5-15)', 'Merchant guild'], 'The 17 guilds share the hall.'],
  [['Granary'], 'Both granaries stand full this autumn.'], [['Market square'], 'Two markets serve the town, one for grain and one for cloth.'],
];
for (const [rows, s] of C) console.log(' ', w(town('town', 3000, rows.map((name) => ({ name }))), s).padEnd(22), JSON.stringify(rows), s);
console.log('— single-number ranges in the catalogue (rowCount reads them as one)');
const names = new Set(); for (const tier of Object.values(institutionalCatalog)) for (const shelf of Object.values(tier || {})) for (const n of Object.keys(shelf || {})) names.add(n);
console.log(' ', [...names].filter((n) => /\(\d+\)/.test(n)).slice(0, 10), [...names].filter((n) => /\(\d+\s*(?:-|–)\s*\d+\)/.test(n) && /temple|church|chapel|shrine|mill|market|granar|guild/i.test(n)).length, 'counted-house range rows');
console.log('— the size words against the chair\'s standard');
const Z = [['village', 331, 'Its neighbourhoods keep to themselves after dark.'], ['village', 331, 'The suburbs spill past the old boundary stones.'],
  ['village', 200, 'The town square fills on market day.'], ['village', 200, 'Its people live in quarters by trade and kin.'], ['village', 200, 'The merchant quarter shuts at dusk.'],
  ['hamlet', 80, 'Its people live in quarters by trade and kin.'], ['hamlet', 80, 'The lanes are muddy in spring.'], ['hamlet', 80, 'The street is muddy in spring.'],
  ['thorp', 20, 'It is built in masonry around the agora.'], ['town', 1200, 'The tenements by the river are crowded.'], ['village', 300, 'The tenements by the river are crowded.'],
  ['village', 300, 'Life here is more urban than rural.'], ['village', 300, 'The district reeve hears disputes.']];
for (const [tier, pop, s] of Z) console.log(' ', w(town(tier, pop, [{ name: 'Village headman' }]), s).padEnd(22), tier, pop, s);
