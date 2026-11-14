// usage: node ctx.js town "needle" [before] [after]
const {page}=require("./lib");const [t,n,b=3,a=3]=process.argv.slice(2);
const L=page(t).split("\n");let hdr="";
L.forEach((x,i)=>{if(/^== /.test(x))hdr=x;if(x.includes(n)){console.log(">>",t,"@",i,hdr);for(let j=Math.max(0,i-b);j<=Math.min(L.length-1,i+ +a);j++)console.log((j===i?"* ":"  ")+L[j].slice(0,400));}});
