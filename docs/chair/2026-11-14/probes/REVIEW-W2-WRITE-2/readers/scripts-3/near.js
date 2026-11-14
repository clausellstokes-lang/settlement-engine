// print the sentence with ~N chars around it, plus requested page rows
const {line,L,page,rec}=require("./lib.js");const f=require("./facts.js");
const [id,extra,...towns]=process.argv.slice(2);const l=/^\d+$/.test(id)?L[+id]:line(id);
const W=+process.env.W||250;
for(const t of towns){const p=l.prints.find(p=>p.town===t);const x=f(t);const pg=page(t);
 console.log("=====",t,x.tier,x.pop,x.st.join("+"),"|rd",x.rd,x.rl,"|walls",x.walls.join("/"),"|gar",x.garrison.join("/"),"|mil",x.militia.join("/"),"|watch",x.watch.join("/"),"|merc",x.merc.join("/"),"|chart",x.charter.join("/"),"|md",x.magicDef.join("/"));
 if(!p){console.log("  (not printed)");continue;}
 for(const v of p.page){const k=pg.indexOf(v.printed);console.log("  ["+v.view+"]",k<0?"(NOT FOUND) "+v.printed:"…"+pg.slice(Math.max(0,k-W),k).replace(/\n/g," ⏎ ")+" <<"+v.printed+">> "+pg.slice(k+v.printed.length,k+v.printed.length+W).replace(/\n/g," ⏎ ")+"…");}
 if(extra&&extra!=="-") for(const re of extra.split("|")){const m=pg.split("\n").filter(z=>new RegExp(re,"i").test(z));console.log("  /"+re+"/:",JSON.stringify(m.slice(0,3).map(z=>z.slice(0,200))));}
}
