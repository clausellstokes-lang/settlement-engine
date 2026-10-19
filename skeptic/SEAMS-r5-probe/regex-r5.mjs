// read-only: the three landed regexes copied verbatim from master 81f1cd963
const ESCALATION_HINT = /(arms_race|sabotage|incident|overreach|coup|rebellion|hostile|raid|extract|power_play|autonomy_bid|debt_spiral|forces_align|subjugat|war|sanction|embargo)/i;
const DEESCALATION_HINT = /(thaw|recovery|compact|protect|stability|alliance|allied|trade_partner|patronage|compliance|support|reconcil|dependency_coercion)/i;
const WOUND_TYPE_RE = /war|betray|tribute|conquest|occupation|sack|raid|seiz|impos|contest_loss|contest_forestalled/i;
const toks = ['shared_faith','peace_unkept','peace_kept','riders_quartered','guild_war','menace_absorbed','warden_attempted','hunt_won','escaped','sponsor_exposed','casus_taken','demand_made','gave_shelter','robbed_quarter','paid_quarter','fed_poor','raided','robbed_road'];
for (const t of toks) console.log(t.padEnd(18), 'esc', ESCALATION_HINT.test(t), 'deesc', DEESCALATION_HINT.test(t), 'wound', WOUND_TYPE_RE.test(t));
