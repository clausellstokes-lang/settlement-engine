# D-PL-r5: the three landed regexes (quoted from master 81f1cd963, measure-r5.out) against the words this round registers.
import re
ESC = re.compile(r'(arms_race|sabotage|incident|overreach|coup|rebellion|hostile|raid|extract|power_play|autonomy_bid|debt_spiral|forces_align|subjugat|war|sanction|embargo)', re.I)
DEESC = re.compile(r'(thaw|recovery|compact|protect|stability|alliance|allied|trade_partner|patronage|compliance|support|reconcil|dependency_coercion)', re.I)
WOUND = re.compile(r'war|betray|tribute|conquest|occupation|sack|raid|seiz|impos|contest_loss|contest_forestalled', re.I)
for w in ['riders_quartered', 'oathSince', 'service_answered', 'fealty_defied', 'peace_unkept']:
    print(f"{w:18s} ESCALATION_HINT={bool(ESC.search(w))} DEESCALATION_HINT={bool(DEESC.search(w))} WOUND_TYPE_RE={bool(WOUND.search(w))}")
