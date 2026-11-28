// failtext.mjs <json> <file-substring> : the failure messages of that file's failed tests, paths and stack folded
import fs from 'node:fs';
const [f, sub] = process.argv.slice(2); const j = JSON.parse(fs.readFileSync(f,'utf8'));
for (const r of j.testResults) if (r.name.includes(sub)) for (const a of r.assertionResults) if (a.status==='failed')
  console.log('## '+a.fullName+'\n'+a.failureMessages.join('\n').split('\n').filter(l=>!/^\s+at /.test(l)).join('\n').replace(/\/home\/user\/wt\/[A-Za-z0-9_-]+\//g,'TREE/'));
