const fs=require('fs');
// VERBATIM from tests/copy/voiceMechanics.test.js @ f537ce47e
function stringLiteralContents(src){
  const out=[]; let i=0; const n=src.length;
  while(i<n){
    const c=src[i];
    if(c==='/'&&src[i+1]==='/'){while(i<n&&src[i]!=='\n')i++;continue;}
    if(c==='/'&&src[i+1]==='*'){i+=2;while(i<n&&!(src[i]==='*'&&src[i+1]==='/'))i++;i+=2;continue;}
    if(c==="'"||c==='"'){const q=c;let buf='';i++;while(i<n&&src[i]!==q){if(src[i]==='\\'){buf+=src[i+1]??'';i+=2;continue;}buf+=src[i];i++;}i++;out.push(buf);continue;}
    if(c==='`'){let buf='';i++;while(i<n&&src[i]!=='`'){if(src[i]==='\\'){buf+=src[i+1]??'';i+=2;continue;}
      if(src[i]==='$'&&src[i+1]==='{'){i+=2;let d=1;while(i<n&&d>0){if(src[i]==='{')d++;else if(src[i]==='}')d--;i++;}buf+=' ';continue;}
      buf+=src[i];i++;}i++;out.push(buf);continue;}
    i++;
  }
  return out;
}
function countFile(abs){let em=0,bang=0;const hits=[];
  for(const text of stringLiteralContents(fs.readFileSync(abs,'utf8'))){
    const e=(text.match(/—/g)||[]).length, b=(text.match(/!/g)||[]).length;
    em+=e;bang+=b;
    if(e||b)hits.push({em:e,bang:b,text:text.slice(0,150)});
  }
  return {em,bang,hits};
}
for(const rel of process.argv.slice(3)){
  const abs=process.argv[2]+'/'+rel;
  if(!fs.existsSync(abs)){console.log('MISSING '+rel);continue;}
  const c=countFile(abs);
  console.log((c.em||c.bang?'⛔ ':'   ')+'em:'+String(c.em).padEnd(3)+' bang:'+String(c.bang).padEnd(3)+'  '+rel);
  for(const h of c.hits) console.log('       [em:'+h.em+' bang:'+h.bang+'] "'+h.text.replace(/\n/g,'\\n')+'"');
}
