const fs=require("fs");const P=fs.readFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/parsed.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const cls=x=>{const k=x.L.kinds||[];if(k.includes("under_siege"))return"siege";if(k.includes("famine"))return"famine";if(k.includes("occupied"))return"occupation";return k.length?"othercrisis":"calm"};
const ALIAS={"Harbour Dues":"Strategic Crossroads Toll","River Toll":"Strategic Crossroads Toll"};
function compat(p,c){const t=c.shown||"";if(p==="Active")return t==="running"||t==="operational";if(p==="Vulnerable")return t==="vulnerable";if(p==="Impaired")return t==="impaired";if(p==="Entrepôt")return t==="entrepot"||(c.entrepot&&t==="running");if(p==="Resource Depleted")return false;return false}
const kinds={};const towns={};const ex={};const hdr={agree:{},disagree:{}};const hdrEx=[];
for(const x of P){const c0=cls(x);let bad=new Set();
 for(const pc of x.pdf.chains){const c=x.L.chains.find(q=>q.name===(ALIAS[pc.name]||pc.name));if(!c){bad.add("noname");continue}
  if(!compat(pc.state,c)){const k="PDF "+pc.state+" / tab "+(c.shown||"(no state)")+" / raw "+c.raw;kinds[k]=kinds[k]||{};kinds[k][c0]=(kinds[k][c0]||0)+1;bad.add(k);(ex[k]=ex[k]||[]).length<6&&ex[k].push({seed:x.seed,chain:c.name,id:c.id,kinds:x.L.kinds.join("+")})}}
 towns[c0]=towns[c0]||{agree:0,disagree:0};if(bad.size)towns[c0].disagree++;else towns[c0].agree++;
 // headers
 const pdfImp=x.pdf.flowHeaders.reduce((a,h)=>a+(+((h.text.match(/· (\d+) impaired/)||[0,0])[1])),0);
 const tabImp=x.L.chains.filter(c=>c.shown==="impaired").length, rawImp=x.L.chains.filter(c=>c.raw==="impaired").length;
 const ok=pdfImp===tabImp;hdr[ok?"agree":"disagree"][c0]=(hdr[ok?"agree":"disagree"][c0]||0)+1;if(!ok&&hdrEx.length<400)hdrEx.push({seed:x.seed,cls:c0,pdfImpaired:pdfImp,tabImpaired:tabImp,rawImpaired:rawImp,headers:x.pdf.flowHeaders.map(h=>h.group+": "+h.text).join("; ")});
 const nH=+((x.pdf.flowsHeader||"").match(/(\d+)/)||[0,-1])[1];if(nH!==x.L.chains.length)console.log("count mismatch",x.seed,nH,x.L.chains.length);
}
const rawEq=hdrEx.filter(h=>h.pdfImpaired===h.rawImpaired).length;
const out={townsAgreeDisagree:towns,byKind:kinds,examples:ex,headers:{counts:hdr,disagreeTowns:hdrEx.length,pdfHeaderEqualsRawImpaired:rawEq,examples:hdrEx.slice(0,5)}};
fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/chainstate-out.json",JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1).slice(0,6000));
// towns per kind
const tk={};for(const x of P){const c0=cls(x);const ks=new Set();for(const pc of x.pdf.chains){const c=x.L.chains.find(q=>q.name===(ALIAS[pc.name]||pc.name));if(c&&!compat(pc.state,c)){let k;if(pc.state==="Resource Depleted")k="ResourceDepleted_vs_magically_sustained";else if(!c.shown)k="PDFActive_vs_tab_no_state(access-only house)";else if(c.shown==="impaired")k="PDF_Active/Entrepot_vs_tab_impaired(crisis)";else k="other:"+pc.state+"/"+c.shown;ks.add(k)}}for(const k of ks){tk[k]=tk[k]||{};tk[k][c0]=(tk[k][c0]||0)+1}}
console.log("TOWNS PER KIND",JSON.stringify(tk));fs.writeFileSync("/tmp/claude-0/rw2c/agents/out-surfaces/chainstate-townkinds.json",JSON.stringify(tk,null,1));
