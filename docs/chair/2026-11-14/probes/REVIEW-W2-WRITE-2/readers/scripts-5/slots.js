// extract slot values from printed text given template
exports.slots=(tpl,printed)=>{
  const names=[];let re=tpl.replace(/[.*+?^$()|[\]\\]/g,"\\$&").replace(/\\?\{(\w+)\\?\}/g,(m,n)=>{names.push(n);return "(.+?)";});
  // also allow clipped
  const m=new RegExp("^"+re).exec(printed)||new RegExp(re.split(/[,;]/)[0]).exec(printed);
  const o={};if(m)names.forEach((n,i)=>o[n]=m[i+1]);return o;};
