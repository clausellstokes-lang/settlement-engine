const {ESLint}=require('eslint');
(async()=>{ const e=new ESLint({overrideConfig:[{rules:{'max-lines':['error',{max:1,skipBlankLines:true,skipComments:true}]}}]}); for(const f of process.argv.slice(2)){ const [r]=await e.lintFiles([f]); const m=r.messages.find(m=>m.ruleId==='max-lines'); console.log(f, m?m.message:'<=1'); } })();
