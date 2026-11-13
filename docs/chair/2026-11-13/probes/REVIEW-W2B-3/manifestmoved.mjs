// REVIEW-W2B-3 item 7: the dossier prose manifest's MOVED rows at a tree, against that tree's committed fixture
// (tests/fixtures/dossier-prose-manifest-golden.json, which this lane does not change). TREE=<tree> node manifestmoved.mjs <out.json>
import fs from 'node:fs';
const T = process.env.TREE;
const { driftRun } = await import(T + '/tests/helpers/dossierManifest.js');
const fixture = JSON.parse(fs.readFileSync(T + '/tests/fixtures/dossier-prose-manifest-golden.json', 'utf8')).rows;
const run = await driftRun();
const moved = [...run.rows.keys()].filter((k) => Object.hasOwn(fixture, k) && fixture[k] !== run.rows.get(k)).sort();
fs.writeFileSync(process.argv[2], JSON.stringify(Object.fromEntries(moved.map((k) => [k, run.rows.get(k)]))));
console.log('moved', moved.length);
