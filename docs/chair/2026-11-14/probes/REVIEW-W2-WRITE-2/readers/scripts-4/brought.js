const {lines,feat,page}=require("./lib");
for(const i of [10,28,29]){const l=lines[i];let T=0,F=[],c={};
for(const p of l.prints){const f=feat(p.town);const crisis=f.st.filter(s=>/siege|famine|plague|occup/.test(s)).join("+")||"-";c[crisis]=(c[crisis]||0)+1;
 const ic=f.vb.importCoverage||0, sh=ic/(f.vb.dailyNeed||1);
 let ok=f.impPct>=20&&!f.st.includes("plague_onset");
 if(f.st.includes("under_siege")&&sh<0.2)ok=false;
 if(ok)T++;else F.push(p.town+":imp"+f.impPct+":cov"+Math.round(sh*100)+"%:"+crisis+":"+f.acc);}
console.log(i,l.id,JSON.stringify(c),"true",T,"false",F.length,F.join(" "));}
