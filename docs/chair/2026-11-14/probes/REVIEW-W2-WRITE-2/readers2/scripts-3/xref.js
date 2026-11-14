const L=require("../removals-3.json");const {diff,grep}=require("./lib.js");
const i=+process.argv[2];const re=new RegExp(process.argv[3],'i');
for(const e of L[i].read){let found=null;
 for(const r of L)for(const x of r.read)if(x.town===e.town&&x.baseParagraph&&re.test(x.baseParagraph)){const d=diff(x.baseParagraph,x.tipParagraph);found={gone:d.gone.filter(s=>re.test(s)),add:d.added.filter(s=>re.test(s))};}
 const tipLines=grep(e.town,re).map(l=>l.match(new RegExp('[^.]*'+process.argv[3]+'[^.]*\\.','i'))?.[0]).filter(Boolean);
 console.log(e.town,'| base:',JSON.stringify(found),'| tipdump:',JSON.stringify([...new Set(tipLines)]).slice(0,300));}
