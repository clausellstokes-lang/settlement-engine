// usage: node find.js town regex  -> paths whose key or string value matches
const {rec}=require("./lib");const [t,re]=process.argv.slice(2);const R=new RegExp(re,"i");
const out=[];(function w(o,p){if(out.length>60)return;if(o&&typeof o==="object"){for(const k in o){if(R.test(k)&&typeof o[k]!=="object")out.push(p+"."+k+"="+JSON.stringify(o[k]).slice(0,160));else if(R.test(k))out.push(p+"."+k+"={..}"+JSON.stringify(o[k]).slice(0,160));w(o[k],p+"."+k)}}else if(typeof o==="string"&&R.test(o))out.push(p+"="+o.slice(0,200))})(rec(t),"");
console.log(out.join("\n"));
