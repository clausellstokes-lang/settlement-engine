const {leaves,lines,rec,dump}=require("./lib");
const num=s=>s==null?0:Number(s.replace(/,/g,""));
function parseRow(t){const m=t.match(/^Production: ([\d,]+) lbs\/day(?:\+ ([\d,]+) imported)?(?:\+ ([\d,]+) by (\w+) provision)?Need: ([\d,]+) lbs\/day(?:Short: ([\d,]+) lbs\/day)?$/);if(!m)return null;return {prod:num(m[1]),imp:num(m[2]),magic:num(m[3]),kind:m[4]||null,need:num(m[5]),short:num(m[6])}}
function foodSection(seed){const d=dump(seed).split("\n");const out=[];let on=false;for(const x of d){if(/^Food Security▲/.test(x)){on=true;continue}if(on){if(/▲/.test(x)||/^==/.test(x))break;out.push(x)}}return out}
function parseSentence(t){const o={};let m;
 if(m=t.match(/^(.+?) grows (.+?) of what it eats, and (ships|boats|carts|trade) brings? in (.+?)(?: of)? the rest\./)){o.name=m[1];o.grown=m[2];o.carrier=m[3];o.rest=m[4]}
 if(/^No food comes into (.+?) by trade\./.test(t))o.nofood=true;
 if(m=t.match(/(Divine|Druidic|Arcane) provision makes up (.+?) of what it eats\./)){o.kind=m[1].toLowerCase();o.magic=m[2]}
 if(m=t.match(/(A few|Some|Many|Most) households (?:still )?go short, and (.+)$/)){o.hh=m[1];o.tail=m[2]}
 if(/^What is grown here covers/.test(t))o.covers="grown";if(/^What is grown here and brought in covers/.test(t))o.covers="both";if(/nothing to spare/.test(t))o.nospare=true;
 return o}
module.exports={parseRow,foodSection,parseSentence};
if(require.main===module){
 const words={grown:{},rest:{},magic:{}};
 for(const l of lines){if(!/^FOOD:/.test(l.fam))continue;const sec=foodSection(l.seed);const row=parseRow(sec[0]||"");if(!row){console.log("NOROW",l.seed,sec[0]);continue}
  const s=parseSentence(l.line);const add=(k,w,v)=>{(words[k][w]=words[k][w]||[]).push(v)};
  if(s.grown)add("grown",s.grown,row.prod/row.need);
  if(s.rest)add("rest",s.rest.replace(/ the$/,""),row.imp/(row.need-row.prod));
  if(s.magic)add("magic",s.magic,row.magic/row.need);}
 for(const k in words)for(const w in words[k]){const a=words[k][w];console.log(k,JSON.stringify(w),a.length,"min",Math.min(...a).toFixed(3),"max",Math.max(...a).toFixed(3))}
}
