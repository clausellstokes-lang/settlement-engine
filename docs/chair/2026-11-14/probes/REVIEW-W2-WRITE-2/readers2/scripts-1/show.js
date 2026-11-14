// usage: node show.js <removalIndex> [from] [to]
const {facts}=require("./facts.js");
const L=require("/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-1.json");
const i=+process.argv[2];const r=L[i];const a=+(process.argv[3]||0),b=+(process.argv[4]||r.read.length);
const split=p=>((p||"").match(/[^.!?]+(?:[.!?]+["')]*)(?=\s|$)|[^.!?]+$/g)||[]).map(s=>s.trim()).filter(Boolean);
const norm=s=>s.replace(/\s+/g," ").trim();
function repl(x){const bs=split(x.baseParagraph),ts=split(x.tipParagraph);
 const rs=x.removedSentence?norm(x.removedSentence):null;
 let j=rs?bs.findIndex(s=>norm(s)===rs||rs.startsWith(norm(s))||norm(s).startsWith(rs.slice(0,40))):-1;
 if(j<0)return {pos:"?",added:ts.filter(s=>!bs.includes(s))};
 // previous base sentence that exists in tip
 let lo=-1;for(let k=j-1;k>=0;k--){const q=ts.indexOf(bs[k]);if(q>=0){lo=q;break;}}
 let hi=ts.length;for(let k=j+1;k<bs.length;k++){const q=ts.indexOf(bs[k]);if(q>=0&&q>lo){hi=q;break;}}
 const W=s=>new Set(s.toLowerCase().match(/[a-z']+/g)||[]);const sim=(a,b)=>{const A=W(a),B=W(b);let n=0;for(const w of A)if(B.has(w))n++;return n/Math.max(1,Math.min(A.size,B.size));};
 const reg=ts.slice(lo+1,hi).filter(s=>!bs.includes(s)).map(s=>{const m=Math.max(0,...bs.filter((_,q)=>q!==j).map(b=>sim(s,b)));return m>0.7?"~"+s:s;});
 return {pos:j,added:reg,others:ts.filter((s,q)=>(q<=lo||q>=hi)&&!bs.includes(s))};}
console.log("##",i,r.id,r.kind,"removedFrom",r.removedFrom);console.log("TEXT:",r.text);
r.read.slice(a,b).forEach((x,k)=>{const R=repl(x);
 console.log(`\n[${a+k}] ${facts(x.town)}`);
 console.log("  REM:",x.removedSentence?x.removedSentence.slice(0,70):null);
 console.log("  NEW@"+R.pos+":",R.added.length?R.added.join(" || "):"(silence)");
 if(process.env.OTH&&R.others&&R.others.length)console.log("  OTHER-CHANGED:",R.others.join(" || "));
 if(process.env.FULL){console.log("  BASE:",x.baseParagraph);console.log("  TIP:",x.tipParagraph);}
});
