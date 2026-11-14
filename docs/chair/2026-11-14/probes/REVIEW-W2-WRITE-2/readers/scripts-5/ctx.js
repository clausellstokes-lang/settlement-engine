const {page}=require("./lib");const [t,needle,n]=[process.argv[2],process.argv[3],+(process.argv[4]||1)];
const ls=page(t).split("\n");ls.forEach((l,i)=>{if(l.includes(needle)){for(let j=Math.max(0,i-n);j<=Math.min(ls.length-1,i+n);j++)console.log(j+1+":",ls[j].slice(0,700));console.log("--");}});
