const {lines,feat,page}=require("./lib");const i=+process.argv[2];const l=lines[i];let n=0,imp=[],pg=[];
for(const p of l.prints){const f=feat(p.town);n++;const P=page(p.town);
 const m=P.match(/[^\n.]*(bring in a little|bring in some|bring in most|bring in much|brought in|come in by|imported)[^\n.]*/i);
 const sie=f.st.includes("under_siege");
 if(!sie)pg.push(p.town+":NOSIEGE");
 if(f.impCov>0)imp.push(p.town+"("+f.acc+",imp"+f.impCov+")");
 if(/(ships|boats|carts|barges|caravans|traders) bring in/i.test(P))pg.push(p.town+":"+(P.match(/[^.\n]*(ships|boats|carts|barges|caravans|traders) bring in[^.\n]*/i)[0]).slice(0,140));}
console.log(l.id,n,"impCov>0:",imp.length,imp.slice(0,30).join(" "));console.log("page:",pg.length);pg.slice(0,40).forEach(x=>console.log("  ",x));
