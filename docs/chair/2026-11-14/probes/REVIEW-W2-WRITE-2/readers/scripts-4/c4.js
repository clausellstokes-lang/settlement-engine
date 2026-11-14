const {lines,feat}=require("./lib");const i=+process.argv[2];const l=lines[i];
const LOW=["Subsistence","Struggling","Poor","Destitute","Impoverished"];const c={};let bad=[];
for(const p of l.prints){const f=feat(p.town);const k=f.pros+"|"+f.acc+"|"+f.st.join("+");c[f.pros]=(c[f.pros]||0)+1;
 const ok=LOW.includes(f.pros)&&!["isolated","mountain_pass"].includes(f.acc);if(!ok)bad.push(p.town+":"+k);}
console.log(c,"bad",bad.length,bad.slice(0,10));
if(l.priorFalse)for(const q of l.priorFalse)console.log("prior",q.town,"prints?",l.prints.some(p=>p.town===q.town));
