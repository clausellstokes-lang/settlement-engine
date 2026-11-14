import { needMetBy } from '/home/user/settlement-engine/src/domain/display/tradeListDisplay.js';
const imps = ["Dressed stone (local quarry depleted)","Wool","Iron","Timber (local managed woodland cleared)","Grain","Medicinal herbs","Paper","Paper materials","Luxury materials","Salted fish (local river fishery exhausted)"];
for (const n of ['Precious metals','Fuel','Metal ore']) console.log(n, imps.filter(i=>needMetBy(n,i)));
console.log('fuel', ["Iron","Timber","Capital","Salt","Reeds, peat, and marsh herbs (local wetlands exhausted)"].filter(i=>needMetBy('Fuel',i)));
