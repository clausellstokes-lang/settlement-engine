const {L,rec}=require("./lib.js");
const i=+process.argv[2];const re=process.argv[3]?new RegExp(process.argv[3]):null;const verbose=process.argv[4];
const agg={};
for(const p of L[i].prints){const r=rec(p.town);const txt=p.page[0]?p.page[0].printed:"";const g=re?(txt.match(re)||[])[1]:"";
 const ch=(r.economicState.activeChains||[]).filter(c=>c.magicNote);
 const desc=ch.map(c=>c.label+"{"+c.status+","+c.resourceCondition+",sub="+c.substituteActive+",rec="+c.magicRecovery+",out="+(c.outputs||[]).join("/")+"}::"+c.magicNote).join(" || ");
 const match=ch.some(c=>g&&((c.outputs||[]).concat(c.label).join(" ").toLowerCase().includes(g.toLowerCase().split(" ").slice(-1)[0].replace(/s$/,""))));
 const short=ch.some(c=>c.status!=="running"||c.resourceCondition!=="available");
 const k=(r.config.stressTypes||[]).join("+");
 console.log((match?"M":"-")+(short?"S":"-"),p.town,r.tier,k,"good="+g,"|",verbose?desc:desc.slice(0,300));}
