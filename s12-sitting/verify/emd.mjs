import { readFileSync } from 'node:fs';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/';
const { execSync } = await import('node:child_process');
for (const name of ['customContentSchema.js','labelBands.js','searchIndex.js','dossierViewModel.js']) {
  const p = execSync(`find ${D} -name ${name} | head -1`).toString().trim(); if(!p){console.log(name,'NOT FOUND');continue;}
  let s = readFileSync(p,'utf8').replace(/\/\*[\s\S]*?\*\//g,'').split('\n').filter(l=>!/^\s*\/\//.test(l)).map(l=>l.replace(/\s\/\/.*$/,'')).join('\n');
  const total=(readFileSync(p,'utf8').match(/—/g)||[]).length; const strs=(s.match(/(["'`])(?:(?!\1)[^\\]|\\.)*—(?:(?!\1)[^\\]|\\.)*\1/g)||[]).length;
  console.log(`${name}: em dashes total ${total} · in string literals (comment-stripped) ${strs}`);
}
