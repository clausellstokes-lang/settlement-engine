// Parse all three surfaces + leaves + record facts per town -> parsed.jsonl
const fs=require("fs");const R="/tmp/claude-0/rw2c/run/";
const leaves=fs.readFileSync(R+"leaves-tip.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const out=fs.createWriteStream("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl");
const STATES=new Set(["Active","Vulnerable","Impaired","Entrepôt","Resource Depleted","Magically sustained","Magically Sustained","Running","Operational"]);
function splitList(s){const o=[];let d=0,cur="";for(const ch of s){if(ch==="(")d++;if(ch===")")d--;if(ch===","&&d===0){o.push(cur.trim());cur="";}else cur+=ch;}if(cur.trim())o.push(cur.trim());return o;}
function stripPages(t){const o=[];for(let i=0;i<t.length;i++){if(t[i]==="SettlementForge"&&t[i+2]==="SETTLEMENT DOSSIER"){i+=3;continue}o.push(t[i])}return o;}
for(const L of leaves){
  const s=L.seed;
  const rec=JSON.parse(fs.readFileSync(R+"tip/records/"+s+".json","utf8"));
  const raw=fs.readFileSync(R+"surf-tip/"+s+".pdf-canon_dossier.txt","utf8").split("\n");
  const t=stripPages(raw);
  // trade flows
  const pdf={exports:null,imports:null,local:null,necessity:null,chains:[],flowHeaders:[],exploit:[],gaps:[]};
  let i=t.indexOf("TRADE FLOWS");
  if(i>=0){let cur=null;const map={"EXPORTS":"exports","IMPORTS":"imports","LOCAL PRODUCTION":"local","NECESSITY IMPORTS":"necessity"};
    for(let j=i+1;j<t.length&&j<i+400;j++){const x=t[j];if(x==="FOOD SECURITY"||x==="ECONOMIC FLOWS"||x.startsWith("ECONOMIC FLOWS")||x==="CRITICAL DEPENDENCIES")break;
      if(map[x]){cur=map[x];pdf[cur]=[];continue}
      if(!cur)continue; if(x==="•")continue; if(x==="ENTREPÔT"){pdf.entrepotBadge=true;continue} pdf[cur].push(x);}
  }
  // active supply chains cards
  let a=t.findIndex(x=>x.startsWith("ACTIVE SUPPLY CHAINS"));
  if(a>=0){pdf.chainsHeader=t[a];let end=t.findIndex((x,k)=>k>a&&(x==="Institutions"));if(end<0)end=a+600;
    for(let k=a+1;k<end;k++){if(t[k].startsWith("NEED ")){let st=t[k-1],nm=t[k-2];if(!STATES.has(st)){nm=st;st=null}
      const flow=(t[k+1]||"");pdf.chains.push({name:nm,state:st,need:t[k],flow});}}}
  // economic flows headers
  let e=t.findIndex(x=>x.startsWith("ECONOMIC FLOWS"));
  if(e>=0){pdf.flowsHeader=t[e];let end=t.findIndex((x,k)=>k>e&&(x==="SHADOW ECONOMY"||x==="Resources & Production"));if(end<0)end=e+500;
    pdf.flowsBody=t.slice(e+1,end);
    for(let k=e+1;k<end;k++){if(/^\d+ chain/.test(t[k]))pdf.flowHeaders.push({group:t[k-1],text:t[k]});}}
  // resource chains
  let r=t.indexOf("RESOURCE CHAINS");
  if(r>=0){let grp=null;for(let k=r+1;k<t.length&&k<r+400;k++){const x=t[k];if(x==="NEARBY RESOURCES"||x==="IMPORT DEPENDENCIES"||x==="GAPS & OPPORTUNITIES")break;
     if(/^(FULLY EXPLOITED|PARTIALLY EXPLOITED|UNEXPLOITED)$/.test(x)){grp={grp:x,count:t[k+1],rows:[]};pdf.exploit.push(grp);k++;continue}
     if(grp&&t[k+1]==="»"&&t[k+3]==="»"){grp.rows.push({r:x,proc:t[k+2],out:t[k+4],word:t[k+5]});k+=5;}}}
  let g=t.indexOf("GAPS & OPPORTUNITIES");
  if(g>=0){for(let k=g+1;k<t.length;k+=2){if(!/^(Low|Medium|High|Critical)$/.test(t[k]))break;pdf.gaps.push({sev:t[k],text:t[k+1]})}}
  // crime / supporting
  let c=t.findIndex(x=>x.startsWith("Criminal structure ·"));pdf.crime=c>=0?t[c]:null;
  let sc=t.indexOf("SUPPORTING CAPABILITIES");pdf.support=sc>=0?t.slice(sc+1,sc+12):null;
  // journal
  const J=fs.readFileSync(R+"surf-tip/"+s+".journal.txt","utf8").split("\n");
  const jr={exports:null,imports:null,chains:[],exploit:[]};
  let page=null,sub=null;
  for(const x of J){if(x.startsWith("== ")){page=x.slice(3);sub=null;continue}if(x.startsWith("## ")){sub=x.slice(3);continue}
    const un=x.replace(/\\([()\[\]*_#])/g,"$1");
    if(page==="Economics & Trade"){let m=un.match(/^- \*\*Exports:\*\* (.*)$/);if(m){jr.exports=splitList(m[1]);jr.exportsRaw=m[1];}m=un.match(/^- \*\*Imports:\*\* (.*)$/);if(m){jr.imports=splitList(m[1]);jr.importsRaw=m[1];}
      if(sub==="Supply chains"){m=x.match(/^- \*\*(.+?)\*\*(?: \*\((.+?)\)\*)?/);if(m)jr.chains.push({name:m[1],state:m[2]||""});}}
    if(page==="Resources & Production"&&sub==="Exploitation"&&un.startsWith("| ")&&!un.startsWith("| Resource")&&!un.startsWith("| ---")){const p=un.split("|").slice(1,-1).map(z=>z.trim());jr.exploit.push({r:p[0],st:p[1],proc:p[2],out:p[3]});}
  }
  const es=rec.economicState||{};
  const facts={tier:rec.tier,pop:rec.population,stress:Array.isArray(rec.stress)?rec.stress.map(z=>z.type):(rec.stress?[rec.stress.type]:[]),
    conds:(rec.activeConditions||[]).map(z=>z.archetype+":"+z.status),exp:es.primaryExports,imp:es.primaryImports,loc:es.localProduction,transit:es.transit,tradeAccess:es.tradeAccess,
    inst:(rec.institutions||[]).map(z=>z.name),
    exploitation:Object.fromEntries(Object.entries((rec.resourceAnalysis||{}).exploitation||{}).filter(([k])=>k!=="warnings").map(([k,v])=>[k,(v||[]).map(z=>typeof z==="string"?z:z.rawResource)])),
    chains:(es.activeChains||[]).map(z=>({id:z.chainId,label:z.label,status:z.status,outputs:z.outputs,input:z.resourceInputKey,res:z.resource,houses:z.processingInstitutions}))};
  out.write(JSON.stringify({seed:s,L,pdf,jr,facts})+"\n");
}
out.end();
