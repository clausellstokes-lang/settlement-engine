const E = /(arms_race|sabotage|incident|overreach|coup|rebellion|hostile|raid|extract|power_play|autonomy_bid|debt_spiral|forces_align|subjugat|war|sanction|embargo)/i; // relationshipRuleHelpers.js:78 @81f1cd963
const W = /war|betray|tribute|conquest|occupation|sack|raid|seiz|impos|contest_loss|contest_forestalled/i; // grievanceRead.js:48 @81f1cd963
for (const t of ['riders_quartered','recognition_withheld','appointment_imposed','faction_backed','charter_granted','narrowed_voice']) console.log(t, 'ESCALATION_HINT', E.test(t), 'WOUND_TYPE_RE', W.test(t));
