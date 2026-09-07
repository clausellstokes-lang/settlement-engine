const fs = require('fs');
const O = process.env.O;
const t = JSON.parse(fs.readFileSync(`${O}/review-template.json`, 'utf8'));
const r = JSON.parse(fs.readFileSync(`${O}/report.json`, 'utf8'));

const SAME = 'ACCEPTED — UNMOVED. This rung re-anchors the migration receipt inside the lineage that'
  + ' carries the register; it changes no detector, no filter, no threshold and no corpus definition,'
  + ' so this identity is expected to reconcile as `same` and it does. Measured whole rather than row'
  + ' by row: predecessorSame 1397 with Gone/New/Increased/Decreased all 0, and the report’s own'
  + ' predecessorInventoryDigest EQUALS its targetInventoryDigest, so the target inventory is the'
  + ' predecessor inventory bit for bit. A single moved row anywhere would break that equality.';

const TRANSITION = 'ACCEPTED — the schema 17 → 18 scanner transition, THREE governed detector paths,'
  + ' each moved by this rung and by nothing else. MEASURED against the predecessor’s own recorded'
  + ' detectorTree manifest, not against HEAD and not by reasoning about which files the lane touched:'
  + ' before the rung was written ALL ELEVEN detector inputs were byte-identical, and after it exactly'
  + ' these three had moved, so declared == measured == 3 and the set is a fixed point of its own'
  + ' measurement (writing it changes migrate-observed-shape-readers.mjs, itself a member).'
  + ' (1) check-observed-shape-readers.mjs — the live-validator binding validateSchema17Baseline to'
  + ' validateSchema18Baseline in its three places, plus the register’s `_doc` header, which had'
  + ' described SCHEMA 10 and an eight-identity bank through eight rungs of drift and is cured here'
  + ' because this is the one write that emits it. (2) observed-shape-baseline.mjs — BASELINE_SCHEMA'
  + ' 17 to 18, the RETIRED_STRESS_TOPOLOGY_BASELINE_SCHEMA constant, and validateSchema17Baseline'
  + ' re-bound to its own retired literal so a schema-17 predecessor is still validated as 17.'
  + ' (3) migrate-observed-shape-readers.mjs — this rung’s own data rows. package.json and'
  + ' package-lock.json are MEASURED byte-same, not asserted, because any package.json byte is itself'
  + ' a mint trigger. No detector alphabet, no filter and no corpus byte moves: the reconciliation is'
  + ' EMPTY, which is the fence a re-anchoring must clear.';

let nSame = 0;
let nTrans = 0;
t.decisions = t.decisions.map((d) => {
  if (d.subject === 'scanner-transition') { nTrans += 1; return { ...d, decision: 'accept', note: TRANSITION }; }
  if (d.subject === 'predecessor-reconciliation') { nSame += 1; return { ...d, decision: 'accept', note: SAME }; }
  throw new Error(`unexpected review subject: ${d.subject}`);
});
fs.writeFileSync(`${O}/review-completed.json`, JSON.stringify(t, null, 2));
console.log('decisions written:', t.decisions.length, '| predecessor-reconciliation:', nSame, '| scanner-transition:', nTrans);
console.log('pending left:', t.decisions.filter((d) => d.decision !== 'accept').length);
console.log('empty notes:', t.decisions.filter((d) => !String(d.note || '').trim()).length);
console.log('report issues:', (r.issues || []).length, '| all dispositioned:',
  (r.issues || []).every((i) => t.decisions.some((d) => d.rowId === i.rowId && d.decision === 'accept')));
