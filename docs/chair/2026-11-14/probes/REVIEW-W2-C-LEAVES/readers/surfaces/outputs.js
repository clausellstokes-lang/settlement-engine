const fs=require("fs");const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const cls=x=>{const k=x.L.kinds||[];if(k.includes("under_siege"))return"siege";if(k.includes("famine"))return"famine";if(k.includes("occupied"))return"occupation";return k.length?"othercrisis":"calm"};
const ALIAS={"Harbour Dues":"Strategic Crossroads Toll","River Toll":"Strategic Crossroads Toll"};
function splitList(s){const o=[];let d=0,cur="";for(const ch of s){if(ch==="(")d++;if(ch===")")d--;if(ch===","&&d===0){o.push(cur.trim());cur="";}else cur+=ch;}if(cur.trim())o.push(cur.trim());return o;}
const towns={};const kinds={};const ex={};let chainsAll=0,chainsBad=0;
for(const x of P){let bad=false;const c0=cls(x);
 for(const pc of x.pdf.chains){const c=x.L.chains.find(q=>q.name===(ALIAS[pc.name]||pc.name));if(!c)continue;chainsAll++;
  let seg=pc.flow.split(" » ");let o=seg[seg.length-1];const normally=/^Normally yields: /.test(o);o=o.replace(/^Normally yields: /,"");
  const pOut=seg.length>1?splitList(o):[];
  const tOut=c.outsShown||[];
  if(JSON.stringify(pOut)!==JSON.stringify(tOut)){bad=true;chainsBad++;
   const extra=pOut.filter(z=>!tOut.includes(z)),miss=tOut.filter(z=>!pOut.includes(z));
   const k=(tOut.length===0?"tab prints no Outputs":"tab prints subset")+(normally?" [PDF 'Normally yields']":"")+" / tab "+(c.shown||"nostate");kinds[k]=kinds[k]||{};kinds[k][c0]=(kinds[k][c0]||0)+1;
   (ex[k]=ex[k]||[]).length<8&&ex[k].push({seed:x.seed,chain:c.name,state:c.shown,raw:c.raw,pdf:pc.flow,tab:tOut,recordOutputs:c.outputs,pdfExtra:extra,pdfMissing:miss});}}
 towns[c0]=towns[c0]||{agree:0,disagree:0};towns[c0][bad?"disagree":"agree"]++;}
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/outputs-out.json",JSON.stringify({towns,chainsAll,chainsBad,kinds,ex},null,1));
console.log(JSON.stringify({towns,chainsAll,chainsBad,kinds},null,0));for(const k in ex)console.log("##",k,"\n",ex[k].slice(0,3).map(e=>JSON.stringify(e)).join("\n"));
