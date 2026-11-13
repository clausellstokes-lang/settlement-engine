// REVIEW-W2B-3 item 2: the cold lines the page member missed, by what the instrument has for them: a registered word the
// sentence names that is WITHDRAWN from the page list; a word on the page list that the town's leaf calls true; or NO word.
//   TREE=<tip> node missed.mjs <recall.json> [HIGH,MED]
import fs from 'node:fs';
const T = process.env.TREE;
const W = await import(T + '/src/domain/facts/registeredWords.js');
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const sev = new Set((process.argv[3] || 'HIGH,MED').split(','));
const miss = r.rows.filter((x) => sev.has(x.severity) && !x.found);
const cls = {}; const noword = {};
for (const x of miss) {
  const s = x.sentence; const named = [...W.thingsNamedIn(s), ...W.newWordsNamedIn(s)]; const denied = [...W.thingsDeniedIn(s), ...W.newWordsDeniedIn(s)];
  const ids = [...new Set([...named, ...denied])];
  const withdrawn = ids.filter((id) => W.REGISTERED_WORDS[id].pageWithdrawn && !(W.REGISTERED_WORDS[id].pageKept?.test(s)));
  const k = !ids.length ? 'no registered word' : withdrawn.length === ids.length ? 'withdrawn word only' : 'word on the list, leaf says true (or a context/sense rule)';
  cls[k] ||= {}; cls[k][x.mechanism] = (cls[k][x.mechanism] || 0) + 1;
  if (k === 'withdrawn word only') for (const id of withdrawn) noword['withdrawn: ' + (W.REGISTERED_WORDS[id].kind || 'thing') + ' ' + id] = (noword['withdrawn: ' + (W.REGISTERED_WORDS[id].kind || 'thing') + ' ' + id] || 0) + 1;
}
console.log('missed', miss.length); for (const [k, v] of Object.entries(cls)) console.log(k, Object.values(v).reduce((a, b) => a + b, 0), JSON.stringify(v));
console.log('withdrawn words carrying missed lines:', JSON.stringify(Object.fromEntries(Object.entries(noword).sort((a, b) => b[1] - a[1]).slice(0, 15))));
