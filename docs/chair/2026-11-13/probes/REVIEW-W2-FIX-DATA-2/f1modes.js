const fs=require("fs"),zlib=require("zlib");
const FAM_O=/prevents famine|hold off famine/, FAM_T=/This year it has not been enough|The famine is drawing them down/;
const SIE_O=/Carts go out at dusk|carts that go out at dusk/, SIE_T=/with the roads cut it now holds|Since the siege closed the roads/;
const out={};const ex=[];
for(const line of zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().split("\n").filter(Boolean)){const {seed,s}=JSON.parse(line);
 const mode=seed.split("-")[2]; const st=s.stress; const T=Array.isArray(st)?st.map(x=>x.type):st?.type?[st.type]:[];
 for(const i of s.institutions||[]){const d=i.desc||"";
  for(const [k,O,Tw,c] of [["famine",FAM_O,FAM_T,"famine"],["siege",SIE_O,SIE_T,"under_siege"]]){const has=T.includes(c);
   const add=(w)=>{const key=`${mode}|${k}|${w}`;out[key]=(out[key]||0)+1;};
   if(O.test(d)){add(has?"ORIGINAL-FALSE":"original-true"); if(has&&ex.length<6) ex.push(seed+" "+JSON.stringify(T)+" "+d.slice(0,70));}
   if(Tw.test(d)) add(has?"twin-true":"TWIN-FALSE");}}}
console.log(JSON.stringify(Object.fromEntries(Object.entries(out).sort())),"\n",ex.join("\n "));
