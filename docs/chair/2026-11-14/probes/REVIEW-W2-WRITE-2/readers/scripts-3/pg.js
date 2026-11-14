const {page}=require("./lib.js");
function after(t,label,n=1){const ls=page(t).split("\n");const i=ls.findIndex(l=>l.trim()===label);return i<0?null:ls.slice(i+1,i+1+n).join(" | ");}
function has(t,re){return re.test(page(t));}
function grepl(t,re){return page(t).split("\n").filter(l=>re.test(l));}
module.exports={after,has,grepl};
module.exports.rating=function(t,label){const {page}=require("./lib.js");const ls=page(t).split("\n");const i=ls.findIndex(l=>l.trim()===label);if(i<0)return null;for(let j=i+1;j<i+5;j++){const m=ls[j].match(/^(Critical|Weak|Adequate|Strong|Excellent|Fortress|Vulnerable)[▼▲]?$/);if(m)return m[1];}return "?";};
