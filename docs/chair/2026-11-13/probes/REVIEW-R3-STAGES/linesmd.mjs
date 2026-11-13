// linesmd.mjs <lines.json> <selA.json> <selC.json> <verdicts.json> <out.md>: the step-1 list, one row per line.
import fs from 'node:fs';
const [lf, sa, sc, vf, outf] = process.argv.slice(2);
const L=JSON.parse(fs.readFileSync(lf)); const SEL={...JSON.parse(fs.readFileSync(sa)),...JSON.parse(fs.readFileSync(sc))}; const V=JSON.parse(fs.readFileSync(vf));
let md=`# REVIEW-R3-STAGES — step 1: every new or reworded line, read where it prints

The reviewer's own cold list, written and pushed before either stage's hand-back or any commit message of the two ranges was opened. Ranges: **A2** = lane/r2-code-a-2026-11-13, 2f114a4c9..0d3972d8f; **C1** = lane/r3-code-c-2026-11-13, aac79b808..fb8b24fbe. Lines found from the diffs of src/ (code and data), every pool variant, clause and label added or reworded, with its file, its pool or function and the conditions it is declared under.

**Births.** 1,536 towns per tree, born at each base and each tip: the census's 720 (r2r-/r2s-, the census's own configuration, verbatim) and 816 in the app's own configuration shape (rr3-<size>-<calm | each of the 15 crises | siege+famine>-<rand|port>-<i>: DEFAULT_CONFIG, \`selectedStressesRandom:false\` with the ticked list, \`_randomizePriorities:true\`), plus 90 for the plagued-threat route (rr3p-). Probes: \`probes/REVIEW-R3-STAGES/births.mjs\`, \`seeds720.txt\`, \`seeds-app.txt\`, \`seeds-plagued.txt\`.
**Where it prints.** Record lines: every string leaf of every tip birth matched (\`select.mjs\`); display lines (C1's domain leaves): the tip's own domain functions over its own births, base against tip (\`derivedC.mjs\`, \`derivedDiff.mjs\`). **Read.** Each line's reading towns (a siege, a famine and an occupation where it prints under one; its smallest and largest size; filled to four or five) rendered through the real OutputContainer as the owner sees it, every group, tab and disclosure opened (\`render.sh\`, \`render.rr3s.jsx\`: REVIEW-R2-STAGES's render with only cfgFor changed), 120 towns at A2's tip and 28 at C1's; each line read on its page against the town's record (\`readsheet.mjs\`), then checked by script against the record in EVERY town it prints in (\`facts.mjs\`).
**Scale.** REVIEW-R2-STAGES READER-BRIEF.md: HIGH, MEDIUM, LOW.

## Tally
`;
const tally={}; for(const l of L){ const v=(V[l.id]||['?'])[0]; const k=l.stage+' '+(v.startsWith('FALSE')?v.split('(')[0].trim():v.startsWith('NEVER')?'NEVER PRINTS (on the page)':v.startsWith('TRUE')?'TRUE':'?'); tally[k]=(tally[k]||0)+1; }
md+=Object.entries(tally).sort().map(([k,v])=>`- ${k}: ${v}`).join('\n')+'\n\n## The lines\n\n| # | Stage | File · pool or function | Declared under | Prints in (of 1,536) | Towns read | Verdict |\n|---|---|---|---|---|---|---|\n';
for(const l of L){ const s=SEL[l.id]||{n:0,sizes:[],pick:[]}; const v=V[l.id]||['?','']; md+=`| ${l.id} | ${l.stage} | \`${l.file}\` · ${l.where} | ${l.cond} | ${s.n}${s.sizes.length?' ('+s.sizes.join(', ')+')':''} | ${s.pick.join(', ')||'none'} | **${v[0]}**. ${v[1].replace(/\|/g,'\\|')} |\n`; }
fs.writeFileSync(outf, md); console.log('ok', md.length);
