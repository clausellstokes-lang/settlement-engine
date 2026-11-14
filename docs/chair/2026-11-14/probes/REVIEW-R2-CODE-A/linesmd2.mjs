import fs from 'node:fs';
const [S] = process.argv.slice(2); const L=JSON.parse(fs.readFileSync(S+'/probe/lines.json')); const H=JSON.parse(fs.readFileSync(S+'/hits-tip.json')); const HB=JSON.parse(fs.readFileSync(S+'/hits-base.json'));
const V=['A','B','C','D'].flatMap(k=>JSON.parse(fs.readFileSync(`${S}/verdicts/${k}.json`)).map(v=>({...v,reader:k})));
let md='| line | file · where · declared condition | prints in (tip / base, of 3,048) | sizes at tip | towns read | TRUE | FALSE (H/M/L) | UNSURE |\n|---|---|---|---|---|---|---|---|\n';
for(const l of L){ const vs=V.filter(v=>v.line===l.id&&!v.neighbour&&!/\[extra\]/.test(v.fact||'')&&!v.offsheet); const c=(x)=>vs.filter(v=>v.verdict===x).length; const fl=vs.filter(v=>v.verdict==='FALSE'); const sev=(s)=>fl.filter(v=>v.severity===s).length;
  const h=H[l.id]; md+=`| ${l.id} | \`${l.file}\` · ${l.where} · ${l.cond} | ${h?h.n:'(derived)'} / ${HB[l.id]?HB[l.id].n:'-'} | ${h?Object.entries(h.sizes).map(([k,v])=>k+' '+v).join(', '):''} | ${vs.length} | ${c('TRUE')} | ${fl.length} (${sev('HIGH')}/${sev('MED')}/${sev('LOW')}) | ${c('UNSURE')} |\n`; }
md+='\n### Every non-TRUE reading, verbatim (reader A/B/C/D; "nb" = a neighbouring sentence of another writer, "extra"/"off" = read beyond the sheet)\n\n';
for(const v of V.filter(v=>v.verdict!=='TRUE')) md+=`- **${v.line}** ${v.verdict} ${v.severity||''} ${v.kind?'('+v.kind+')':''} ${v.neighbour?'nb ':''}${/\[extra\]/.test(v.fact||'')?'extra ':''}· \`${v.town}\`${v.tab?' · '+v.tab:''}${v.holder?' · '+v.holder:''}: "${String(v.sentence).replace(/\|/g,'/')}" — ${String(v.fact).replace(/\n/g,' ')}${v.replaced?` · replaced: "${v.replaced}" (${v.replacedVerdict})`:''}\n`;
fs.writeFileSync(S+'/lines-table.md', md); console.log(V.length, md.length);
