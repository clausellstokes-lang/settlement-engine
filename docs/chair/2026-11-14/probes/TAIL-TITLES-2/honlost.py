# TAIL-TITLES-2 KT1: every sentence that prints in fewer towns (or none) holds an old honorific word of the seven pools;
# every sentence that prints in more towns (or is new) holds a new one. python3 -I honlost.py <before.json> <after.json>
import json, sys, re
B = json.load(open(sys.argv[1])); A = json.load(open(sys.argv[2]))
OLD = re.compile(r"\b(Frontman|Ferryman|Foreman|Headman|Spokesman|Mother|Matron)\b")
NEW = re.compile(r"\b(Nominal Owner|Ferry Keeper|Boat-Master|Overseer|Chief|Speaker|Keeper)\b")
def towns(d, s): return set(d.get(s, {'towns': []})['towns'])
lost = [(s, towns(B, s) - towns(A, s)) for s in B]; lost = [x for x in lost if x[1]]
gain = [(s, towns(A, s) - towns(B, s)) for s in A]; gain = [x for x in gain if x[1]]
bl = [x for x in lost if not OLD.search(x[0])]; bg = [x for x in gain if not NEW.search(x[0])]
print(f'sentences that lost towns {len(lost)} (towns {len(set().union(*[t for _, t in lost])) if lost else 0}); without an old honorific word {len(bl)}')
for s, t in sorted(bl, key=lambda x: -len(x[1]))[:15]: print('   -', len(t), s[:160], sorted(t)[:3])
print(f'sentences that gained towns {len(gain)} (towns {len(set().union(*[t for _, t in gain])) if gain else 0}); without a new honorific word {len(bg)}')
for s, t in sorted(bg, key=lambda x: -len(x[1]))[:15]: print('   +', len(t), s[:160], sorted(t)[:3])
