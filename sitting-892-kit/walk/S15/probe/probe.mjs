import * as tip from './kernel-tip.js';
import * as base from './kernel-base.js';
import { DOSSIER_MOUNTS, UNMOUNTED_BLOCKS, sentenceMountForBlock, MOUNT_RUNGS } from './dossierMounts.js';
const pool = [
  { angle: 'ledger', text: 'A minor crime wave: petty theft.', marks: ['minor'] },
  { angle: 'ledger', text: 'Catastrophic crime wave: the town is lawless.', marks: ['catastrophic'] },
  { angle: 'street', text: 'Neutral sentence, no marks.' },
];
const base_el = base.eligibleVariants(pool, { audience: 'player' }).map(v => v.text);
const tip_none = tip.eligibleVariants(pool, { audience: 'player' }).map(v => v.text);
const tip_minor = tip.eligibleVariants(pool, { audience: 'player', dimensions: { severity: 'minor' } }).map(v => v.text);
const tip_cat = tip.eligibleVariants(pool, { audience: 'player', dimensions: { severity: 'catastrophic' } }).map(v => v.text);
console.log('BASE eligible (no dimension answer):', JSON.stringify(base_el));
console.log('TIP eligible, unanswered:', JSON.stringify(tip_none));
console.log('TIP eligible, severity=minor:', JSON.stringify(tip_minor));
console.log('TIP eligible, severity=catastrophic:', JSON.stringify(tip_cat));
console.log('TIP poolDimensions:', JSON.stringify(tip.poolDimensions(pool)));
console.log('TIP STATE_MARK_DIMENSIONS keys:', Object.keys(tip.STATE_MARK_DIMENSIONS).join(','), 'marks total:', Object.values(tip.STATE_MARK_DIMENSIONS).flat().length);
console.log('drawVariant identical?', base.drawVariant.toString() === tip.drawVariant.toString());
console.log('DOSSIER_MOUNTS length:', DOSSIER_MOUNTS.length, 'UNMOUNTED_BLOCKS length:', UNMOUNTED_BLOCKS.length, 'unique:', new Set(UNMOUNTED_BLOCKS).size);
console.log('sentenceMountForBlock(DS-GEN-1):', sentenceMountForBlock('DS-GEN-1'), 'rungs:', JSON.stringify(MOUNT_RUNGS));
