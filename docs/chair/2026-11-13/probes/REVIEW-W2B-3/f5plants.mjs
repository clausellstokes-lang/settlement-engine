// REVIEW-W2B-3 item 3 (5): hand-made findings of my own through the tip's classify.mjs (its `past` and `eventhook` rules).
// node f5plants.mjs <dir>  — writes <dir>/page.json and <dir>/corpus.ndjson.gz (one empty town) for classify.mjs.
import fs from 'node:fs'; import zlib from 'node:zlib';
const dir = process.argv[2];
const L = [
  ['present, "once a month"', 'clergy', 'Story/History', 'Once a month the priest walks the bounds and blesses the fields.'],
  ['present main clause, past relative', 'guardCaptain', 'Summary/Overview', 'The guard captain who came with the refugees now keeps the gate.'],
  ['past then present claim', 'armedForce', 'Story/Crisis', 'The garrison was doubled last spring, and the soldiers still hold the gate.'],
  ['present, "had better"', 'clergy', 'Story/Plot Hooks', 'The priest had better find the relic before the bishop arrives.'],
  ['present, "were" subjunctive', 'smith', 'Story/NPCs', 'If the smith were to leave, no one could shoe the horses.'],
  ['present, "founded on"', 'clergy', 'Summary/Overview', 'The town is founded on the clergy\'s goodwill and the miller\'s credit.'],
  ['present, "established"', 'physician', 'People/Relationships', 'The physician is an established figure at every council meeting.'],
  ['present, "took" idiom', 'notary', 'Story/Plot Hooks', 'The notary has taken a bribe and the council has not found out.'],
  ['past, true past (control)', 'clergy', 'Story/History', 'The priests were driven out a generation ago and never returned.'],
  ['present, no past word (control)', 'clergy', 'Story/History', 'The priest still collects the tithe at every harvest.'],
];
const findings = L.map(([label, word, view, quote]) => ({ seed: 'plant', size: 'village', arm: 'calm', row: 'VOCAB', view, word, side: 'names', quote, detail: label, kind: 'thing', layer: 'P', source: 'written in code', file: '', lit: '' }));
fs.writeFileSync(`${dir}/page.json`, JSON.stringify({ read: 1, literals: 0, findings }));
fs.writeFileSync(`${dir}/corpus.ndjson.gz`, zlib.gzipSync(JSON.stringify({ seed: 'plant', s: { powerStructure: { factions: [] } } }) + '\n'));
