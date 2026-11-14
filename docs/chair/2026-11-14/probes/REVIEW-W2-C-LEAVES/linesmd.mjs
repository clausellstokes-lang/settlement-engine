// REVIEW-W2-C-LEAVES linesmd.mjs <agents dir> > table.md : every family the readers read, its towns and its verdict, as a
// markdown table per surface, with THE STAGE'S OWN / CARRIED for each false family (OWN_RX below: classified by me against
// the base page of the same town, see the review file §2).
import fs from 'node:fs';
const D = process.argv[2];
const GROUPS = [['econ-trade-food', 'Economics tab: Trade Profile and Food Security'], ['econ-flows', 'Economics tab: Economic Flows (chain and service cards)'],
  ['resources', 'Resources tab'], ['defense-magic', 'Defense and Magic tabs'], ['surfaces', 'The PDF text and the Foundry journal']];
const OWN_RX = [/Semi-organized|coordinated enough|Rival crews|takes a cut|Legal Infrastructure|deterrence beyond force|Detention without process|Economic Flows \(#|All \(#\)Issues|worked all the way through|actually built on|easy half|works part of the line|half-finished|^Resource Exploitation: Partial|UnexploitedFish|Military ContractsService|No one here works the stone|There is X out there/];
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
for (const [g, title] of GROUPS) {
  const f = `${D}/out-${g}/result.json`; if (!fs.existsSync(f)) { console.log(`\n### ${title}\n\n(not read: no result)\n`); continue; }
  const r = JSON.parse(fs.readFileSync(f, 'utf8'));
  console.log(`\n### ${title}\n\n| family | prints in (towns) | verdict | false towns | severity · kind | own or carried | example (town: the fact) |\n|---|---|---|---|---|---|---|`);
  for (const x of r.families || []) {
    const bad = x.verdict !== 'TRUE';
    const own = !bad ? '' : (OWN_RX.some((re) => re.test(String(x.fam))) ? 'THE STAGE\'S OWN' : 'CARRIED');
    const e = (x.examples || [])[0];
    console.log(`| ${esc(String(x.fam).slice(0, 160))} | ${x.towns ?? ''} | ${x.verdict} | ${bad ? (x.falseTowns ?? '') : 0} | ${bad ? esc(`${x.severity ?? ''} ${x.kind ?? ''}`) : ''} | ${own} | ${bad && e ? esc(`${e.seed}: ${String(e.fact || '').slice(0, 220)}`) : ''} |`);
  }
}
