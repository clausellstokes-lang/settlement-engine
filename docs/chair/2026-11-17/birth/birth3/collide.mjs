const R = process.env.TREE + '/src';
const { subsumeTradeGoods } = await import(R + '/domain/region/goodsCatalog.js');
const { IMPORT_WORD } = await import(R + '/domain/facts/houseKinds.js');
const { resourceShortageImport } = await import(R + '/domain/resourceSemantics.js');
const { RESOURCE_DATA } = await import(R + '/data/goods/identity.js');
const words = new Map(); for (const [k, w] of Object.entries(IMPORT_WORD)) words.set(w, 'word:' + k);
for (const g of Object.keys(RESOURCE_DATA)) { const w = resourceShortageImport(g); if (w) words.set(w, 'ground:' + g); }
const list = [...words.keys()]; const out = [];
for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) if (subsumeTradeGoods([list[i], list[j]]).length === 1 && list[i].replace(/\(.*\)/, '').trim().toLowerCase() !== list[j].replace(/\(.*\)/, '').trim().toLowerCase()) out.push(`${list[i]} [${words.get(list[i])}] ~ ${list[j]} [${words.get(list[j])}]`);
console.log(out.join('\n'));
