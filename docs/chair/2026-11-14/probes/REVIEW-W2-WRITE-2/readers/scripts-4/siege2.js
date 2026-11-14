const {lines,feat}=require("./lib");const res={};
for(const i of process.argv.slice(2).map(Number)){const l=lines[i];let T=0,F=[],L=[];
for(const p of l.prints){const f=feat(p.town);const ic=f.vb.importCoverage||0,ch=f.vb.importChannel;const share=ic/(f.vb.dailyNeed||1);
 if(!f.st.includes("under_siege")){F.push(p.town+":nosiege");continue}
 if(ic>0&&(ch||share>=0.01))F.push(p.town+"("+f.acc+","+ic+"/"+f.vb.dailyNeed+","+(ch||"-")+")");else{T++;if(ic>0)L.push(p.town+":"+ic)}}
console.log(i,l.id,"true",T,"false",F.length,F.join(" "),"| trickle",L.join(" "));}
