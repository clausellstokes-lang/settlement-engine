// REVIEW-W2B-3: the widened register's strip rows (tip) against the sites the TIP's strip walk finds in each tree's src.
// TIP=<tip tree> node stripgrowth.mjs <tree>... — for each tree: sites found, and which banked rows have no site there.
import fs from 'node:fs';
const TIP = process.env.TIP;
const { stripTree, stripKey } = await import(TIP + '/tests/lint/presumedThings.shared.mjs');
const wid = JSON.parse(fs.readFileSync(TIP + '/tests/lint/presumedThings.widened.register.json', 'utf8'));
const banked = new Set((wid.strips || []).map((r) => stripKey(r[0], r[1])));
const reasons = {}; for (const r of wid.strips || []) reasons[r[2]] = (reasons[r[2]] || 0) + 1; console.log('reasons', JSON.stringify(reasons));
console.log('banked strip rows at the tip', banked.size, JSON.stringify([...banked][0]));
for (const tree of process.argv.slice(2)) {
  const sites = stripTree(tree).map((x) => stripKey(x.file, x.receiver));
  const set = new Set(sites);
  const missing = [...banked].filter((k) => !set.has(k)); const unbanked = sites.filter((k) => !banked.has(k));
  console.log(tree.split('/').pop(), 'sites', sites.length, 'banked rows with no site in this tree', missing.length, 'sites not banked', unbanked.length);
  for (const k of missing.slice(0, 20)) console.log('   no site:', k);
  for (const k of unbanked.slice(0, 20)) console.log('   unbanked:', k);
}
