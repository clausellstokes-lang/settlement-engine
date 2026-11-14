// jbr.js: catalogue brackets (count ranges, household ranges, gates, "multiple") left in the journal, by page
const fs=require("fs"); const t={}; const ex={}; const RX=/\\?\(\d[\d,]*\s*[-–]\s*\d[\d,]*\+?\\?\)|\\?\(\d[\d,]*\+?\s*households\\?\)|\\?\([\d,]+\+ only\\?\)|\\?\(high magic\\?\)|\\?\(if walled\\?\)|\\?\(multiple\\?\)/i;
for(const l of fs.readFileSync("journal.jsonl","utf8").trim().split("\n")){ const {seed,pages}=JSON.parse(l);
 for(const p of pages){ let sub=''; for(const line of p.md.split("\n")){ if(/^#/.test(line)) sub=line; if(RX.test(line)){ const k=p.name+" "+sub; t[k]=(t[k]||0)+1; (ex[k]=ex[k]||[]).length<3 && ex[k].push(seed+" :: "+line.slice(0,220)); } } } }
console.log(t); console.log(ex);
