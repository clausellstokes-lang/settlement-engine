import { REGISTERED_WORDS } from '/home/user/w2fd10/src/domain/facts/registeredWords.js';
for (const id of process.argv.slice(2)) { const w = REGISTERED_WORDS[id]; console.log(id, '|', w ? JSON.stringify({atoms:w.atoms,sufficient:w.sufficient,kinds:w.kinds,bands:w.bands,notKinds:w.notKinds,words:String(w.words).slice(0,160), leaf:String(w.leaf).slice(0,140)}) : 'NONE'); }
