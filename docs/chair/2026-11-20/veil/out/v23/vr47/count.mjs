// VR47 count: node count.mjs (in this directory) -> count.txt. red.json (old seed id::institution key) vs green.json
// (new seed name::title), both written by probe.mjs over the render-twice harness's three born towns.
import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync(new URL('./red.json', import.meta.url), 'utf8'));
const g = JSON.parse(fs.readFileSync(new URL('./green.json', import.meta.url), 'utf8'));
const per = []; const rows = []; let ch = 0; let tot = 0; let birthsEqual = true;
r.towns.forEach((t, i) => {
  const G = g.towns[i]; let c = 0;
  birthsEqual &&= t.birthSha256 === G.birthSha256 && t.storedSha256 === G.storedSha256;
  for (const [id, row] of Object.entries(t.owner.rows)) {
    tot += 1; const n = G.owner.rows[id];
    if (row.shown !== n.shown) { ch += 1; c += 1; rows.push(`  ${t.seed} | ${id} | ${row.name} | ${row.title} | ${row.shown} -> ${n.shown}`); }
  }
  per.push(`${t.seed}: ${c} of ${t.cards} cards`);
});
const text = [
  "VR47 COUNT (the owner's page, the stored ids; seatKeeperDisplay.js :: shownHonorificOf, the printed honorific):",
  `${ch} of ${tot} born-town cards with an institution print a different honorific under the new seed (name::title) than under the old (id::institution key): the same person, the same office.`,
  `Births and stored records byte-equal across red and green: ${birthsEqual}. styledTitleOf table sha256 equal: ${r.styledTitleTable.sha256 === g.styledTitleTable.sha256}.`,
  '', ...per, '', 'town | card id | name | title | old -> new', ...rows, '',
];
fs.writeFileSync(new URL('./count.txt', import.meta.url), text.join('\n'));
console.log(text.slice(0, 7).join('\n'));
