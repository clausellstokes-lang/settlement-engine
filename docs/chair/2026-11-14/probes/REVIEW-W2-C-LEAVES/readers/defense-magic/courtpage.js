const fs=require("fs");const B="/tmp/claude-0/rw2c/run/";
const L=fs.readFileSync(B+"fam-all/defense-magic.jsonl","utf8").trim().split("\n").map(JSON.parse);
const fam=process.argv[2];const seeds=[...new Set(L.filter(r=>r.fam===fam).map(r=>r.seed))];
const AFF=/go before the court|A court exists|court can try|court passes sentences|working court|court sits|tried and held|court's lists|hearing in the hall|law can name a wrong|before the magistrate|cells are real|appointed to judge/i;
const res=[];
for(const s of seeds){const page=fs.readFileSync(B+"tip/dumps/"+s+".txt","utf8").split("\n");let view="";const hits=[];
 for(const l of page){if(l.startsWith("== "))view=l;else if(AFF.test(l))hits.push(view.replace(/==/g,"").trim()+" :: "+l.match(new RegExp("[^.]*("+AFF.source+")[^.]*\\.?","i"))[0].trim())}
 res.push({s,hits});}
const n=res.filter(r=>r.hits.length).length;console.log(fam,"towns",res.length,"withCourtOnPage",n);
for(const r of res)if(process.argv[3])console.log(r.s,JSON.stringify(r.hits));
fs.writeFileSync("courtpage-"+fam.replace(/\W+/g,"_").slice(0,40)+".json",JSON.stringify(res,null,1));
