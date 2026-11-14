// Cross-family notes appended to result.json.
const fs = require('fs');
const { T } = require('./ctx.js');
let n = 0, t = 0;
for (const x of Object.values(T)) { if (!x) continue; let h = 0; for (const c of x.cards) for (const l of c.lines) if (/^Contributes to .* - \d+% of income$/.test(l)) { n++; h = 1; } t += h; }
const r = JSON.parse(fs.readFileSync(__dirname + '/result.json', 'utf8'));
r.also = [
  { kind: 'h', severity: 'LOW', note: `Not a family line, same section: "Contributes to <income> - N% of income" prints on ${n} chain cards in ${t} towns, the machinery of a rating (a percentage share).` },
  { kind: 'e', severity: 'LOW', note: '"Economic Flows (N active ...)" and "All (N)" count the access-only cards (Faith & Worship, Grain & Bread, River Mill, Pilgrimage with no chip) that the tab treats as not run here; e.g. r2r-thorp-0 "Economic Flows (1 active)" whose one card is Faith & Worship via "Access to parish church".' },
  { kind: 'g', severity: 'LOW', note: 'Siege-form need sentences in ports under siege stand beside the same tab\'s Exports pills marked "(naval route only)", e.g. rr3w-metropolis-under_siege-port-0: the sea route the exports use is not said to be cut.' },
  { kind: 'note', note: 'Checked and true: every Impaired header sits under a siege in force (chain on its own land ground or on trade; a port\'s sea fishing excepted) or a famine whose failed source is the chain\'s own ground; every no-chip header is a chain whose only house is an "Access to ..." row; every "brought in by magic" town has a Teleportation circle or an arcane house; every siege-form sentence is under a siege and no calm form prints under one; every named service is the dependency house\'s own and the house stands on the roster.' },
];
fs.writeFileSync(__dirname + '/result.json', JSON.stringify(r, null, 1));
console.log(n, t);
