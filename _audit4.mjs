import { institutionalCatalog } from './src/data/institutionalCatalog.js';
// which tiers produce 'Alehouse' vs 'Ale house', 'Fishing community', etc.
const find = ['Alehouse','Ale house','Fishing community','Fisher\'s landing','Woodcutter\'s camp','Farmland','Common grazing land','International trade center'];
for (const tier of Object.keys(institutionalCatalog)){
  for (const cat of Object.keys(institutionalCatalog[tier])){
    for (const name of Object.keys(institutionalCatalog[tier][cat])){
      if (find.includes(name)) console.log(`${tier} / ${cat} / ${name}`);
    }
  }
}
