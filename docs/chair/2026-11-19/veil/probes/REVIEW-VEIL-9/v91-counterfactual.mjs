import { readFileSync } from 'node:fs';
const { beneathTheWalls, gatesSmugglersLine } = await import('<worktree>/src/generators/safetyLineTruth.js');
const st = JSON.parse(readFileSync('<this folder>/out/mayanek-stored-roster.json', 'utf8')); const sv = JSON.parse(readFileSync('<this folder>/out/mayanek-served-roster.json', 'utf8'));
console.log('stored roster (the owner):', beneathTheWalls(st), '|', String(gatesSmugglersLine('town watch', false, st)));
console.log('served roster (what the reader may see):', beneathTheWalls(sv), '|', String(gatesSmugglersLine('town watch', false, sv)));
