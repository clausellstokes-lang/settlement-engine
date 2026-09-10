const fs = require('fs');
const O = process.env.O;
const D = process.env.D;
const pre = JSON.parse(fs.readFileSync(`${O}/baseline.PRE.json`, 'utf8'));
const post = JSON.parse(fs.readFileSync(`${D}/scripts/.observed-shape-readers-baseline.json`, 'utf8'));

const J = (v) => JSON.stringify(v);
const keys = [...new Set([...Object.keys(pre), ...Object.keys(post)])].sort();
console.log('=== TOP-LEVEL FIELDS ===');
for (const k of keys) {
  const same = J(pre[k]) === J(post[k]);
  if (['inventory', 'rowTags', 'manifests', 'migrationReview', 'digests', '_doc', 'corpusMeta', 'scanStats', 'sentinel', 'scannerProvenance'].includes(k)) {
    console.log(`  ${same ? 'SAME ' : 'MOVED'}  ${k}   (expanded below)`);
  } else {
    console.log(`  ${same ? 'SAME ' : 'MOVED'}  ${k}: ${J(pre[k])} -> ${J(post[k])}`);
  }
}

const sub = (name) => {
  console.log(`\n=== ${name} ===`);
  const a = pre[name] || {}; const b = post[name] || {};
  const ks = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
  for (const k of ks) {
    const same = J(a[k]) === J(b[k]);
    const va = J(a[k]); const vb = J(b[k]);
    console.log(`  ${same ? 'SAME ' : 'MOVED'}  ${k}: ${va.length > 90 ? `${va.slice(0, 86)}…` : va}${same ? '' : ` -> ${vb.length > 90 ? `${vb.slice(0, 86)}…` : vb}`}`);
  }
};
sub('corpusMeta'); sub('scanStats'); sub('sentinel'); sub('scannerProvenance'); sub('digests');

console.log('\n=== manifests (by sub-manifest digest) ===');
for (const k of Object.keys(post.manifests)) {
  console.log(`  ${pre.manifests[k].digest === post.manifests[k].digest ? 'SAME ' : 'MOVED'}  ${k}: ${pre.manifests[k].digest.slice(0, 16)}… -> ${post.manifests[k].digest.slice(0, 16)}…  (entries ${pre.manifests[k].entries.length} -> ${post.manifests[k].entries.length})`);
}

console.log('\n=== migrationReview (every field) ===');
const ks = [...new Set([...Object.keys(pre.migrationReview), ...Object.keys(post.migrationReview)])].sort();
for (const k of ks) {
  const same = pre.migrationReview[k] === post.migrationReview[k];
  console.log(`  ${same ? 'SAME ' : 'MOVED'}  ${k}: ${String(pre.migrationReview[k]).slice(0, 20)}… -> ${String(post.migrationReview[k]).slice(0, 20)}…`);
}

console.log('\n=== INVENTORY, ROW BY ROW ===');
const gone = []; const neu = []; const moved = [];
for (const [f, rows] of Object.entries(pre.inventory)) {
  for (const [id, c] of Object.entries(rows)) {
    const l = post.inventory[f] && post.inventory[f][id];
    if (l === undefined) gone.push(`${f} :: ${id} (was ${c})`);
    else if (l !== c) moved.push(`${f} :: ${id}  ${c} -> ${l}`);
  }
}
for (const [f, rows] of Object.entries(post.inventory)) {
  for (const [id, c] of Object.entries(rows)) {
    if (!(pre.inventory[f] && pre.inventory[f][id] !== undefined)) neu.push(`${f} :: ${id} (now ${c})`);
  }
}
console.log(`  GONE ${gone.length} · NEW ${neu.length} · COUNT-MOVED ${moved.length}`);
gone.concat(neu, moved).forEach((x) => console.log(`    ${x}`));
console.log(`  inventory digest identical: ${J(pre.inventory) === J(post.inventory)}`);
console.log(`  rowTags   digest identical: ${J(pre.rowTags) === J(post.rowTags)}`);

console.log('\n=== _doc, LINE BY LINE ===');
const n = Math.max(pre._doc.length, post._doc.length);
for (let i = 0; i < n; i += 1) {
  if (pre._doc[i] === post._doc[i]) console.log(`  SAME  [${i}] ${String(pre._doc[i]).slice(0, 84)}`);
  else {
    if (pre._doc[i] !== undefined) console.log(`  -OLD  [${i}] ${pre._doc[i]}`);
    if (post._doc[i] !== undefined) console.log(`  +NEW  [${i}] ${post._doc[i]}`);
  }
}
