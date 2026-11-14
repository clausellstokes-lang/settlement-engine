const {lines,feat,page}=require("./lib");
for(const i of [6,7,8,9]){const l=lines[i];let T=0,F=[],G=[];
for(const p of l.prints){const f=feat(p.town);let ok=f.band==="secure"&&f.gap<=5&&!f.st.some(s=>/siege|famine/.test(s));
 if(i===7)ok=ok&&f.stor<12; if(i===8||i===9)ok=ok&&f.stor>=12;
 const P=page(p.town);if((i==8||i==9)&&/nothing to spare against a bad year/.test(P))G.push(p.town);
 if(ok)T++;else F.push(p.town+":"+f.band+":"+f.gap+":"+f.stor);}
console.log(i,"true",T,"false",F.length,F.slice(0,5),"g-nothing-to-spare",G.length);}
