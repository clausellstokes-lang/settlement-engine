import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const m=await import(pathToFileURL(path.join(D,'src/domain/display/stateProse/dossierMounts.js')).href);
console.log('mount rows:', m.DOSSIER_MOUNTS.length);
console.log('sentence rows:', m.DOSSIER_MOUNTS.filter(r=>r.rung==='sentence').length, 'glance rows:', m.DOSSIER_MOUNTS.filter(r=>r.rung==='glance').length);
console.log('distinct blocks mounted:', new Set(m.DOSSIER_MOUNTS.map(r=>r.blockId)).size);
console.log('UNMOUNTED_BLOCKS:', m.UNMOUNTED_BLOCKS.length, m.UNMOUNTED_BLOCKS.join(' '));
console.log('exports:', Object.keys(m).join(' '));
