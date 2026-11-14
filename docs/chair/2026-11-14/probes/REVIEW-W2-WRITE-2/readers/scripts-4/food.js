const {lines,feat}=require("./lib");const i=+process.argv[2];const l=lines[i];const c={};
for(const p of l.prints){const f=feat(p.town);const k=f.band+"|st:"+(f.st.filter(s=>/siege|famine|plague|occup/.test(s)).join("+")||"-");c[k]=(c[k]||0)+1;}
console.log(i,l.id,l.prints.length,JSON.stringify(c));
