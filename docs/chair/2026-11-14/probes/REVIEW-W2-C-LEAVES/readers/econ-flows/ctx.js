// Shared loader: every family line with its card, the leaves chain, the record.
const fs = require('fs');
const RUN = '/tmp/claude-0/rw2c/run';
const OUT = '/tmp/claude-0/rw2c/agents/out-econ-flows';
const lines = fs.readFileSync(RUN + '/fam-all/econ-flows.jsonl', 'utf8').trim().split('\n').map(JSON.parse);
const T = JSON.parse(fs.readFileSync(OUT + '/cards.json', 'utf8'));
const LV = Object.fromEntries(fs.readFileSync(RUN + '/leaves-tip.jsonl', 'utf8').trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r]; }));
const recCache = {};
const rec = (seed) => recCache[seed] || (recCache[seed] = JSON.parse(fs.readFileSync(`${RUN}/tip/records/${seed}.json`, 'utf8')));
const dump = (seed) => fs.readFileSync(`${RUN}/tip/dumps/${seed}.txt`, 'utf8').split('\n');
function ctxOf(r) {
  const t = T[r.seed]; const lv = LV[r.seed];
  let card = null, where = null;
  if (t.head === r.line) where = 'head'; else if (t.tabs === r.line) where = 'tabs';
  else for (const c of t.cards) { if (c.header === r.line) { card = c; where = 'header'; break; } if (c.lines.includes(r.line)) { card = c; where = 'body'; break; } }
  let chain = null, rchain = null;
  if (card && card.kind === 'chain') {
    const k = t.cards.filter((c) => c.kind === 'chain').indexOf(card);
    chain = lv.chains[k]; rchain = rec(r.seed).economicState.activeChains.find((c) => c.chainId === chain.id) || rec(r.seed).economicState.activeChains[k];
  }
  return { ...r, t, lv, card, where, chain, rchain, R: rec(r.seed) };
}
const crisisOf = (lv) => new Set(lv.crisis || []);
const roster = (R) => (R.institutions || []).map((i) => String(i.name));
const ownRoster = (R) => roster(R).filter((n) => !/^access to/i.test(n));
const sizeOrder = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
module.exports = { lines, T, LV, rec, dump, ctxOf, crisisOf, roster, ownRoster, sizeOrder, OUT };
