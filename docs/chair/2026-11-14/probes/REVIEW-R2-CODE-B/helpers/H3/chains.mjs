import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const { chainHousesOf, chainSourceOf } = await import(S+'/tip/src/domain/display/chainHouses.js');
const { chainPrintName } = await import(S+'/tip/src/domain/display/chainPrintName.js');
const { institutionHouseLabel } = await import(S+'/tip/src/domain/display/institutionDisplayName.js');
const file = process.argv[2] || S+'/out/births-tip.ndjson.gz';
const rl = readline.createInterface({ input: fs.createReadStream(file).pipe(zlib.createGunzip()) });
const pairs=new Map(), emptyVia=new Map(), srcIssues=[], notOnRoster=[]; let towns=0, chains=0, srcPrinted=0, srcNull=0;
const bump=(m,k,seed)=>{const e=m.get(k)||[0,seed]; e[0]++; m.set(k,e);};
for await (const line of rl) { const {seed,s}=JSON.parse(line); towns++;
  const names=(s.institutions||[]).map(i=>i.name||''); const labels=new Set(names.map(n=>institutionHouseLabel(n)));
  const rc=new Map((s.resourceAnalysis?.resourceConditions||[]).map(r=>[r.key,r.condition]));
  const avail=new Set(s.resourceAnalysis?.availableResources||[]);
  for (const c of s.economicState?.activeChains||[]) { chains++;
    for (const p of c.processingInstitutions||[]) { const hs=chainHousesOf([p],names); bump(pairs, p+' -> '+(hs.map(h=>h.name).join(' | ')||'(none)'), seed); }
    const hs=chainHousesOf(c.processingInstitutions,names);
    for (const h of hs) if(!labels.has(h.name)) notOnRoster.push(seed+' '+c.chainId+' '+h.name);
    if(!hs.length) bump(emptyVia, c.chainId+' status='+c.status+' procs='+JSON.stringify(c.processingInstitutions), seed);
    const shown=chainPrintName(c,s); const src=chainSourceOf(c,shown);
    if(!src){srcNull++; continue;} srcPrinted++;
    const renamed = shown.resource!==c.resource;
    const cond = renamed? 'renamed' : (rc.get(c.resourceKey) ?? (avail.has(c.resourceKey)?'avail-nocond':'NOT-IN-RECORD'));
    if (!renamed && (cond==='depleted' && !c.resourceDepleted || cond==='absent' || cond==='NOT-IN-RECORD' || c.resourceCondition==='depleted'&&!c.resourceDepleted))
      srcIssues.push([seed,c.chainId,src,c.resourceKey,'rec='+cond,'chainCond='+c.resourceCondition,'dep='+c.resourceDepleted,'inAvail='+avail.has(c.resourceKey), 'status='+c.status].join(' '));
    if (renamed) bump(pairs,'RENAMED '+c.chainId+' '+c.resource+' => '+src+' route='+s.config?.tradeRouteAccess, seed);
  }
}
console.log({towns,chains,srcPrinted,srcNull,notOnRoster:notOnRoster.length,srcIssues:srcIssues.length});
fs.writeFileSync('pairs.out',[...pairs].sort().map(([k,[n,s]])=>n+'\t'+k+'\t'+s).join('\n'));
fs.writeFileSync('emptyvia.out',[...emptyVia].sort((a,b)=>b[1][0]-a[1][0]).map(([k,[n,s]])=>n+'\t'+k+'\t'+s).join('\n'));
fs.writeFileSync('srcissues.out',srcIssues.join('\n')); fs.writeFileSync('notonroster.out',notOnRoster.join('\n'));
