const {lines,feat}=require("./lib");for(const i of [17,18]){const l=lines[i];let T=0,F=[];const fills={},sts={};for(const p of l.prints){const f=feat(p.town);const pr=(p.page[0]||{}).printed||(p.pdf||[])[0]||"";
let ch=null,dep=null;for(const c of f.chains){for(const w of (c.upstreamWeak||[])){if(!ch){ch=w;dep=c}}}
const up=f.chains.find(c=>c.chainId===ch);const m=pr.match(/its (.+?), which/)||pr.match(/'s (.+?) puts/)||[];const fl=m[1];fills[fl]=(fills[fl]||0)+1;
const st=up?up.status:"NOTACTIVE";sts[st]=(sts[st]||0)+1;const ok=up&&!/^(running|productive|operational)$/i.test(st);
if(ok)T++;else F.push(p.town+":"+ch+":"+st+":dep="+(dep&&dep.chainId));}
console.log(i,l.prints.length,"true",T,"false",F.length,F.slice(0,12).join(" "));console.log(JSON.stringify(fills),JSON.stringify(sts));}
