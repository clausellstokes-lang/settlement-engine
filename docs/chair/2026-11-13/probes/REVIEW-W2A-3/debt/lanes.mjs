import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const A=JSON.parse(fs.readFileSync('/home/user/wt/debt/attrib2.json','utf8'));
const RD=JSON.parse(fs.readFileSync('/home/user/wt/debt/redeal.json','utf8'));
const LANES={write:'4f52408b7',data:'7574ae27e',upkeep:'9fccbd8ed',merge:'b629ab345'};
const TIP='817980b33';
const grepIn=(tree,t)=>{ try{ return execFileSync('git',['-C',tree,'grep','-l','-F','-i',t,'--','src','docs/content'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);}catch{return [];} };
const changed={}; for(const [k,c] of Object.entries(LANES)) changed[k]=new Set(execFileSync('git',['-C','/home/user/settlement-engine','diff','--name-only',TIP,c],{encoding:'utf8'}).trim().split('\n'));
// pool id for corpus lines
const MD0=fs.readFileSync('/home/user/wt/tip/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md','utf8').split('\n'); const MDL={};
const md=fs.readFileSync('/home/user/wt/tip/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md','utf8').split('\n');
const poolOf=(run)=>{ if(!run) return null; const i=md.findIndex(l=>l.toLowerCase().includes(run.toLowerCase())); if(i<0) return null; for(let j=i;j>=0;j--){ const m=md[j].match(/(DS-[A-Z]+-\d+)/); if(m && /^#/.test(md[j])) return m[1]; } return null; };
const dumps={}; const dump=(k,t)=>dumps[k+t]??=fs.readFileSync(`/home/user/wt/r-${k}/dumps/${t}.txt`,'utf8');
for(const x of A){ x.pool=x.owner==='corpus'?poolOf(x.run):null; x.lanes={};
  for(const k of Object.keys(LANES)){
    const tree=`/home/user/wt/l-${k}`;
    const fileTouched=!!x.file && changed[k].has(x.file);
    let declTouched=false, variantGone=null; if(x.owner==='corpus'&&x.run){ const r=x.run.toLowerCase(); const t0=MD0.find(l=>l.toLowerCase().includes(r)); const lmd=(MDL[k]??=fs.readFileSync(`/home/user/wt/l-${k}/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`,'utf8').split('\n')); const t1=lmd.find(l=>l.toLowerCase().includes(r)); variantGone=!t1; const tag=(l)=>(l||'').match(/`\[([^\]]*)\]`/)?.[1]||''; if(t0&&t1&&tag(t0)!==tag(t1)) declTouched=true; x.lanesTag??={}; x.lanesTag[k]={before:tag(t0),after:tag(t1)}; }
    const literalGone=x.run? grepIn(tree,x.run).length===0 : null;
    const prints=dump(k,x.town).includes(x.sentence);
    x.lanes[k]={fileTouched,declTouched,variantGone,literalGone,prints,town:RD[k][x.town]};
  } }
fs.writeFileSync('/home/user/wt/debt/lanes.json',JSON.stringify(A,null,1));
for(const k of Object.keys(LANES)){ const c={touchedFile:0,decl:0,variantGone:0,literalGone:0,goneFromPage:0,goneRedealt:0}; const byS={HIGH:{gone:0},MED:{gone:0}};
  for(const x of A){ const l=x.lanes[k]; if(l.fileTouched)c.touchedFile++; if(l.declTouched)c.decl++; if(l.variantGone)c.variantGone++; if(l.literalGone)c.literalGone++; if(!l.prints){ if(l.town.startsWith('RE-DEALT')) c.goneRedealt++; else {c.goneFromPage++; byS[x.severity].gone++;} } }
  console.log(k, LANES[k], JSON.stringify(c), 'gone (identity kept) HIGH', byS.HIGH.gone, 'MED', byS.MED.gone); }
