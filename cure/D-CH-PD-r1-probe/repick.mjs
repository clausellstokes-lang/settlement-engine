// D-CH-PD-r1 probe (CH-PD-r1-5): normalizeParagon's re-pick through the ONE builder is a fixed point.
import { commitDeityEmbed, DEITY_AUTHORED_CHARACTER_KEYS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/deityCommitEmbed.js';
import { isDeepStrictEqual } from 'node:util';
const src = { name: 'The Lantern', alignmentAxis: 'good', lawAxis: 'lawful', rankAxis: 'major', temperamentAxis: 'peacelike', domain: 'light', authoredTemper: 'warlike', characterAxes: ['TEMPER:patient:2'], boonChannel: 'harvest', boonStrength: 'minor', junk: 'x', wallClock: 123 };
const e1 = commitDeityEmbed('deity:7:the-lantern', src);
const e2 = commitDeityEmbed(e1._deityRef, e1);
console.log('first commit keys:', Object.keys(e1).join(','));
console.log('foreign keys dropped (junk, wallClock):', !('junk' in e1) && !('wallClock' in e1));
console.log('re-pick through the builder is a fixed point:', isDeepStrictEqual(e1, e2));
const legacy = commitDeityEmbed('Old Oak', { name: 'Old Oak' });
console.log('legacy minimal snapshot fills neutral axes:', JSON.stringify(legacy));
console.log('fixed point on the legacy embed:', isDeepStrictEqual(legacy, commitDeityEmbed(legacy._deityRef, legacy)));
console.log('authored-character keys carried:', DEITY_AUTHORED_CHARACTER_KEYS.filter((k) => k in e1).join(','));
