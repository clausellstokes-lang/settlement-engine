const {L,rec,page}=require("./lib");
const FAM={timber:{inst:/sawmill|carpenter|lumber|woodcutter|logging|shipyard|boatyard|woodcarver|bowyer|cooper/i,chain:/^(timber|shipbuilding|bowyer_fletcher|cooperage|carpentry)/,word:/timber|lumber|wood|forest/i},
stone:{inst:/quarry|mason|stonecutter/i,chain:/^(stone|fortification|masonry)/,word:/stone|quarr/i},
clay:{inst:/potter|brick|kiln|tile/i,chain:/^(pottery|clay|brick)/,word:/clay|pottery|brick/i},
wool:{inst:/weaver|fuller|textile|spinner|wool/i,chain:/^(wool|textile)/,word:/wool|textile|cloth/i},
"iron ore":{inst:/smelter|\bmine\b|mines|miner|bloomery/i,chain:/^(iron|mining|smelt)/,word:/iron/i},
"glass sand":{inst:/glass/i,chain:/^glass/,word:/glass/i},
"gold/silver ore":{inst:/smelter|mine|goldsmith|silversmith/i,chain:/^(precious|gold|silver|mining)/,word:/gold|silver|precious/i}};
module.exports=function check(l){const out=[];
for(const p of l.prints){const t=rec(p.town);const pr=(p.page[0]||{}).printed||p.pdf[0];
 const ex=t.resourceAnalysis.exploitation;const un=(ex.unexploited||[]).map(r=>r.rawResource);
 const r=un.find(x=>pr.includes(" "+x+" ")||pr.includes(" "+x+","))||un[0];const f=FAM[r];
 const names=t.institutions.map(x=>x.name);
 const I=names.filter(n=>f.inst.test(n));
 const C=(t.economicState.activeChains||[]).filter(c=>f.chain.test(c.chainId||"")&&c.status!=="dormant"&&(c.processingInstitutions||[]).some(pi=>names.includes(pi))).map(c=>c.label+":"+c.status);
 const Inc=(t.economicState.incomeSources||[]).filter(s=>f.word.test(s.source)).map(s=>s.source+" "+s.percentage+"%");
 const X=(t.economicState.primaryExports||[]).filter(x=>f.word.test(x));
 const P=(t.economicState.localProduction||[]).filter(x=>f.word.test(x));
 out.push({town:p.town,tier:p.tier,stress:(p.stress||[]).join("+"),r,I,C,Inc,X,P,false:!!(I.length||C.length||Inc.length||X.length)});}
return out;}
if(require.main===module){for(const i of process.argv.slice(2).map(Number)){const l=L[i];const o=module.exports(l);
 const fa=o.filter(x=>x.false);console.log("==",l.id,"true",o.length-fa.length,"false",fa.length);
 for(const x of o)console.log((x.false?"  F ":"  t ")+x.town,x.tier,x.stress,x.r,"I="+JSON.stringify(x.I),"C="+JSON.stringify(x.C),"Inc="+JSON.stringify(x.Inc),"X="+JSON.stringify(x.X),"P="+JSON.stringify(x.P));}}
