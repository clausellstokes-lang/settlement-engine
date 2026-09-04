#!/usr/bin/env python3
# apply-cutoff.py <payload.json> — ASCII-only: append ONE ledger row and insert a new PICKUP block at the top of
# the handoff card (demoting the current top heading). Builds in memory, asserts, then writes; refuses on any
# anchor not found exactly once and writes nothing on refusal. No queue edit (Enrols: none).
# payload: {"odq_row": "...\n", "odq_marker": "\n§891.1 ", "card_new_block": "...", "card_top_heading_prefix": "...",
#           "card_demote_from": "...", "card_demote_to": "...", "card_edits": [{"old","new"}]}
import io, json, sys
REPO = '/Users/cstokes/Desktop/settlement-engine'
ODQ = REPO + '/docs/OWNER_DECISION_QUEUE.md'
HAND = REPO + '/docs/HANDOFF_CURRENT.md'
p = json.load(io.open(sys.argv[1], encoding='utf-8'))
odq = io.open(ODQ, encoding='utf-8').read()
if p['odq_marker'] in odq:
    print('REFUSED: ledger marker already present'); sys.exit(1)
if not p['odq_row'].endswith('\n'):
    print('REFUSED: row must end with newline'); sys.exit(1)
row = p['odq_row'] if odq.endswith('\n') else ('\n' + p['odq_row'])  # the ledger tail may lack its newline: keep one blank line between rows
new_odq = odq + row
if new_odq.count(p['odq_marker']) != 1:
    print('REFUSED: marker count after append != 1'); sys.exit(1)
hand = io.open(HAND, encoding='utf-8').read()
lines = hand.split('\n')
hits = [i for i, l in enumerate(lines) if l.startswith(p['card_top_heading_prefix'])]
if len(hits) != 1:
    print('REFUSED: top heading count %d' % len(hits)); sys.exit(1)
i = hits[0]
if not lines[i].startswith(p['card_demote_from']):
    print('REFUSED: demote-from text not at the top heading'); sys.exit(1)
lines[i] = p['card_demote_to'] + lines[i][len(p['card_demote_from']):]
block = p['card_new_block'].rstrip('\n').split('\n')
lines = lines[:i] + block + [''] + lines[i:]
new_hand = '\n'.join(lines)
for e in p.get('card_edits', []):
    c = new_hand.count(e['old'])
    if c != 1:
        print('REFUSED: card anchor count %d for: %s' % (c, e['old'][:80])); sys.exit(1)
    new_hand = new_hand.replace(e['old'], e['new'])
if new_hand.count(block[0]) != 1 or len(new_hand) <= len(hand):
    print('REFUSED: card block heading count != 1 or card did not grow'); sys.exit(1)
io.open(ODQ, 'w', encoding='utf-8').write(new_odq)
io.open(HAND, 'w', encoding='utf-8').write(new_hand)
print('EDIT_OK ledger +%d B, card +%d B' % (len(new_odq) - len(odq), len(new_hand) - len(hand)))
