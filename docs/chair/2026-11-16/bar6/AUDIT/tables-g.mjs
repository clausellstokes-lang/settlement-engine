// BAR6-AUDIT-G · the hand-back's tables from the inventory (law5w-inventory-g.mjs, run with --render).
//   node tables-g.mjs <inventory.json> <out.md> [seed=616]
// Writes: the true stock by class (every file; the files that PRINT, i.e. one of their lines was found in the render;
// the lines found printed), by file, the crisis classes declared for ONE crisis only, the sovereign words, and fifty
// lines of the stock drawn at random (seeded) from the printing files for judging by hand.
import fs from 'node:fs';
const [invPath, outPath, seedArg] = process.argv.slice(2);
if (!invPath || !outPath) { console.error('usage: tables-g.mjs <inventory.json> <out.md> [seed]'); process.exit(2); }
const H = JSON.parse(fs.readFileSync(invPath, 'utf8'));
const DECLARED = new Set(['declared', 'twin', 'scoped', 'gate', 'keyed', 'bound']);
const CRISIS = new Set(['outside', 'plenty', 'work', 'animals', 'iron', 'law', 'ease', 'threat']);
const stock = (h, c) => !DECLARED.has(h.status[c]);
const printingFiles = new Set(H.filter((h) => h.printed > 0).map((h) => h.file));
const L = [];
const classes = [...new Set(H.flatMap((h) => h.classes))];
L.push('## T1 · THE TRUE STOCK BY CLASS', '', 'A line counts once a class. STOCK = no declaration answers the class (any + colour + other + none). "Printing files" = the files one of whose class-word lines the 150 towns\' pages print.', '',
  '| class | lines | declared (incl. twin, scoped, gate, keyed, bound) | of which keyed + bound (coarse) | any | colour | other | none | STOCK, all of src | STOCK in printing files | STOCK lines seen printed |', '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
const tot = { n: 0, d: 0, kb: 0, any: 0, colour: 0, other: 0, none: 0, s: 0, sp: 0, pr: 0 };
for (const c of classes) {
  const X = H.filter((h) => h.classes.includes(c));
  const v = { n: X.length, d: X.filter((h) => DECLARED.has(h.status[c])).length, kb: X.filter((h) => ['keyed', 'bound'].includes(h.status[c])).length,
    any: X.filter((h) => h.status[c] === 'any').length, colour: X.filter((h) => h.status[c] === 'colour').length, other: X.filter((h) => h.status[c] === 'other').length, none: X.filter((h) => h.status[c] === 'none').length,
    s: X.filter((h) => stock(h, c)).length, sp: X.filter((h) => stock(h, c) && printingFiles.has(h.file)).length, pr: X.filter((h) => stock(h, c) && h.printed > 0).length };
  for (const k of Object.keys(tot)) tot[k] += v[k];
  L.push(`| ${c} | ${v.n} | ${v.d} | ${v.kb} | ${v.any} | ${v.colour} | ${v.other} | ${v.none} | ${v.s} | ${v.sp} | ${v.pr} |`);
}
L.push(`| **all (line·class pairs)** | ${tot.n} | ${tot.d} | ${tot.kb} | ${tot.any} | ${tot.colour} | ${tot.other} | ${tot.none} | **${tot.s}** | **${tot.sp}** | **${tot.pr}** |`);
const anyStock = H.filter((h) => h.classes.some((c) => stock(h, c)));
L.push('', `DISTINCT LINES holding at least one undeclared class: ${anyStock.length} of ${H.length} in all of src; ${anyStock.filter((h) => printingFiles.has(h.file)).length} in the ${printingFiles.size} printing files; ${anyStock.filter((h) => h.printed > 0).length} seen printed in the 150 towns.`, '');

// T2 by file (printing files)
const byFile = new Map();
for (const h of anyStock) { if (!printingFiles.has(h.file)) continue; const v = byFile.get(h.file) || { n: 0, pr: 0, cls: {} }; v.n++; if (h.printed > 0) v.pr++; for (const c of h.classes) if (stock(h, c)) v.cls[c] = (v.cls[c] || 0) + 1; byFile.set(h.file, v); }
L.push('## T2 · THE STOCK BY FILE (the printing files, by undeclared lines)', '', '| file | undeclared lines | seen printed | by class |', '|---|---:|---:|---|');
for (const [f, v] of [...byFile].sort((a, b) => b[1].n - a[1].n).slice(0, 40)) L.push(`| \`${f}\` | ${v.n} | ${v.pr} | ${Object.entries(v.cls).sort((a, b) => b[1] - a[1]).map(([c, n]) => `${c} ${n}`).join(', ')} |`);
L.push('', `(${byFile.size} printing files hold stock; the forty largest shown.)`, '');
// T2b the not-printing files
const np = new Map(); for (const h of anyStock) if (!printingFiles.has(h.file)) np.set(h.file, (np.get(h.file) || 0) + 1);
L.push(`Files holding stock whose lines the 150 towns never print: ${np.size}, ${[...np.values()].reduce((a, b) => a + b, 0)} lines (the herald, the world pulse, the compendium, the validators' own messages, the gallery: a page of another kind, or no page). Largest: ${[...np].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([f, n]) => `\`${f.replace('src/', '')}\` ${n}`).join(', ')}.`, '');

// T3 crisis classes declared for ONE crisis only
const oneCrisis = H.filter((h) => h.classes.some((c) => CRISIS.has(c) && h.status[c] === 'declared') && (() => { const v = String(h.via); const kinds = [...v.matchAll(/crisis: ([a-z_]+)/g)].map((m) => m[1]).filter((k) => k !== 'any'); const fam = /\b(threat|hunger|crisis\b(?!:))/.test(v.replace(/crisis: \w+/g, '')); return new Set(kinds).size === 1 && !fam; })());
L.push('## T3 · DECLARED FOR ONE CRISIS ONLY', '', `Lines of a crisis class whose declaration names exactly one crisis kind and no family (most: \`excludes: ['crisis: under_siege']\`, beside \`crisis: ['any']\`): ${oneCrisis.length}, ${oneCrisis.filter((h) => h.printed > 0).length} seen printed. They pass a famine, a war, an occupation and a monster frontier unasked (C150831's porters: \`excludes: crisis: under_siege\`, printed under a famine).`, '');
// T4 sovereign words
const lord = H.filter((h) => /\b(lord(s|'s)?|liege|overlord)\b/i.test(h.text)); const crown = H.filter((h) => /\bcrown\b/i.test(h.text));
const und = (X) => X.filter((h) => stock(h, 'sovereign'));
L.push('## T4 · THE SOVEREIGN WORDS', '', `lord / liege / overlord: ${lord.length} lines in ${new Set(lord.map((h) => h.file)).size} files, ${und(lord).length} undeclared for the class (no \`ruler:\`, \`war:\` or crisis atom), ${und(lord).filter((h) => printingFiles.has(h.file)).length} of them in printing files, ${und(lord).filter((h) => h.printed > 0).length} seen printed. crown: ${crown.length} lines in ${new Set(crown.map((h) => h.file)).size} files, ${und(crown).length} undeclared, ${und(crown).filter((h) => h.printed > 0).length} seen printed. (BAR5-THINGS' 98 in about 45 files counted lord, liege and overlord over a different reading of a line: its count and this one differ by what a "line" is; this inventory's is distinct texts of four words or more.)`, '');

// T5 fifty lines of the stock, seeded, from the printing files
let s = Number(seedArg || 616); const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
const pool = anyStock.filter((h) => printingFiles.has(h.file)); const pick = []; const seen = new Set();
while (pick.length < 50 && seen.size < pool.length) { const i = Math.floor(rnd() * pool.length); if (seen.has(i)) continue; seen.add(i); pick.push(pool[i]); }
L.push(`## T5 · FIFTY LINES OF THE STOCK, DRAWN AT RANDOM (seed ${seedArg || 616}) FROM THE PRINTING FILES, FOR JUDGING BY HAND`, '', '| # | file | undeclared classes | printed in | text |', '|---:|---|---|---:|---|');
pick.forEach((h, i) => L.push(`| ${i + 1} | \`${h.file.replace('src/', '')}\` | ${h.classes.filter((c) => stock(h, c)).map((c) => `${c}:${h.status[c]}`).join(' ')} | ${h.printed ?? '-'} | ${h.text.slice(0, 150).replace(/\|/g, '/')} |`));
// T6 THE OVERLAP WITH THE ROUND IN FLIGHT: the stock of the printing files by the BAR5 seat whose section names the
// file (BRIEF-BAR5's nine seat sections), split into law 5's six crisis classes (the round's LAW 5 rows) and the widening
const OWNER = [
  ['BAR5-MARKS', /^src\/data\/(crisisDependence|institutionDescVariants|institutionDescColour|institutionServices|institutionalCatalog)\.js$|^src\/domain\/display\/crisisStoppedRow\.js$/],
  ['BAR5-SAFETY', /^src\/generators\/safetyProfile\.js$/],
  ['BAR5-CHAINS', /^src\/data\/resourceChains\.js$|^src\/generators\/economy\/computeActiveChains\.js$|^src\/domain\/display\/(chainStateShown|validationOnPage)\.js$|^src\/domain\/facts\/houseInputAtHand\.js$/],
  ['BAR5-FOOD', /^src\/domain\/foodways\.js$|^src\/generators\/economy\/(foodBalance|prosperity|incomeLineSiblings)\.js$|^src\/components\/new\/tabs\/ResourcesTab\.jsx$/],
  ['BAR5-MAGIC', /^src\/domain\/(magicReliance|display\/magicProvisionShown)\.js$|^src\/components\/new\/magicDeskRead\.js$|^src\/generators\/narrativeText\.js$/],
  ['BAR5-POWERS', /^src\/generators\/(power\/rulingStructure|factionDynamics|power\/economyReconciliation|npcStructure)\.js$|^src\/domain\/display\/(stateProse\/powerStateProse|npcInteriorityRead)\.js$/],
  ['BAR5-THINGS', /^src\/data\/(npcData|stressInstitutionEffects|arrivalProse)\.js$|^src\/domain\/(hookThemes|facts\/tradeAtWork)\.js$/],
  ['BAR5-WORLD', /^src\/generators\/narrative\/settlementOriginProse\.js$|^src\/data\/(cultureProfiles|narrativeData|historyData)\.js$|^src\/components\/new\/dailyLifeLogic\.js$|^src\/domain\/dailyLife\.js$/],
];
const annexOwner = (h) => { const m = /^(DS-[A-Z]+)-(\d+)/.exec(h.pool || ''); if (!m) return null; const [, d, n] = m;
  if (d === 'DS-DEF') return n === '9' ? 'BAR5-MAGIC' : 'BAR5-SAFETY'; if (d === 'DS-ECO' || d === 'DS-SUP') return 'BAR5-FOOD'; if (d === 'DS-POW') return 'BAR5-POWERS'; if (['DS-GEN', 'DS-REL', 'DS-POP', 'DS-HK'].includes(d)) return 'BAR5-THINGS'; return null; };
const ownerOf = (h) => annexOwner(h) || (OWNER.find(([, re]) => re.test(h.file)) || [null])[0] || '(no BAR5 seat)';
const LAW5 = new Set(['outside', 'plenty', 'work', 'animals', 'iron', 'law']);
const ov = new Map();
for (const h of anyStock) { if (!printingFiles.has(h.file)) continue; const o = ownerOf(h); const v = ov.get(o) || { lines: 0, law5: 0, widened: 0, printed: 0 };
  v.lines++; if (h.printed > 0) v.printed++; const st = h.classes.filter((c) => stock(h, c)); if (st.some((c) => LAW5.has(c))) v.law5++; if (st.some((c) => !LAW5.has(c))) v.widened++; ov.set(o, v); }
L.push('', '## T6 · THE OVERLAP WITH THE ROUND IN FLIGHT (the printing files\' stock by the BAR5 seat whose section names the file or the annex desk)', '',
  '| BAR5 seat | undeclared lines | with a law-5 class (the round\'s LAW 5 rows) | with a widened class (no BAR5 seat names it) | seen printed |', '|---|---:|---:|---:|---:|');
for (const [o, v] of [...ov].sort((a, b) => b[1].lines - a[1].lines)) L.push(`| ${o} | ${v.lines} | ${v.law5} | ${v.widened} | ${v.printed} |`);
fs.writeFileSync(outPath, L.join('\n') + '\n');
fs.writeFileSync(outPath.replace(/\.md$/, '.sample50.json'), JSON.stringify(pick.map((h) => ({ file: h.file, pool: h.pool, line: h.line, classes: h.classes, status: h.status, printed: h.printed, text: h.text })), null, 1));
console.log(`wrote ${outPath}: ${H.length} lines, ${anyStock.length} with stock, ${printingFiles.size} printing files`);
