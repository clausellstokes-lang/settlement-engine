#!/usr/bin/env python3
# apply-892.py <payload.json> — ASCII-only collection writer for the Fable 5.1 chair (session d5b9a39f).
# All prose lives in the JSON payload. Builds every result IN MEMORY, asserts, then writes; refuses on any
# anchor that is not found exactly once and writes NOTHING on refusal. The FRQ is handled by apply-rulings.py
# (rulings under each row) plus a tail append here.
#
# payload: {
#   "odq_rows": ["<row text ending in \n>", ...],             # appended to the ledger in order
#   "odq_marker": "\n§892 ",                                    # must be ABSENT before the act
#   "card_new_block": "<markdown lines, no trailing blank>",   # inserted BEFORE the current top pickup heading
#   "card_top_heading_prefix": "## ⭐⭐⭐⭐⭐ PICKUP AT §891",
#   "card_demote_from": "## ⭐⭐⭐⭐⭐ PICKUP AT §891 — ",
#   "card_demote_to": "## (superseded) PICKUP AT §891 — ",
#   "card_edits": [{"old": "...", "new": "..."}],              # exact-once replacements, applied after the insert
#   "frq_in": "<path of the FRQ with rulings already applied>",
#   "frq_tail": "<text appended at the very end (the §892 sitting section)>",
#   "frq_out": "<path>"
# }
import io, json, sys
REPO = '/Users/cstokes/Desktop/settlement-engine'
ODQ = REPO + '/docs/OWNER_DECISION_QUEUE.md'
HAND = REPO + '/docs/HANDOFF_CURRENT.md'
p = json.load(io.open(sys.argv[1], encoding='utf-8'))

# --- ledger ---
odq = io.open(ODQ, encoding='utf-8').read()
if p['odq_marker'] in odq:
    print('REFUSED: ledger marker already present'); sys.exit(1)
if not odq.endswith('\n'):
    print('REFUSED: ledger does not end with newline'); sys.exit(1)
rows = p['odq_rows']
if not rows or any(not r.endswith('\n') for r in rows):
    print('REFUSED: every ledger row must end with newline'); sys.exit(1)
new_odq = odq + ''.join(rows)
if new_odq.count(p['odq_marker']) != 1:
    print('REFUSED: ledger marker count after append != 1'); sys.exit(1)

# --- handoff card ---
hand = io.open(HAND, encoding='utf-8').read()
lines = hand.split('\n')
hits = [i for i, l in enumerate(lines) if l.startswith(p['card_top_heading_prefix'])]
if len(hits) != 1:
    print('REFUSED: top heading count %d' % len(hits)); sys.exit(1)
i = hits[0]
if not lines[i].startswith(p['card_demote_from']):
    print('REFUSED: top heading does not start with the demote-from text'); sys.exit(1)
lines[i] = p['card_demote_to'] + lines[i][len(p['card_demote_from']):]
block = p['card_new_block'].rstrip('\n').split('\n')
lines = lines[:i] + block + [''] + lines[i:]
new_hand = '\n'.join(lines)
for e in p.get('card_edits', []):
    c = new_hand.count(e['old'])
    if c != 1:
        print('REFUSED: card anchor count %d for: %s' % (c, e['old'][:80])); sys.exit(1)
    new_hand = new_hand.replace(e['old'], e['new'])
if new_hand.count(p['card_new_block'].split('\n')[0]) != 1:
    print('REFUSED: new block heading count != 1'); sys.exit(1)
if len(new_hand) <= len(hand):
    print('REFUSED: card did not grow'); sys.exit(1)

# --- retrovalidation queue tail (OPTIONAL: when the payload has no frq_in, the queue was built by build-queue-892.py) ---
if 'frq_in' in p:
    frq = io.open(p['frq_in'], encoding='utf-8').read()
    if not frq.endswith('\n'):
        print('REFUSED: frq does not end with newline'); sys.exit(1)
    tail = p['frq_tail']
    if not tail.endswith('\n'):
        print('REFUSED: frq tail must end with newline'); sys.exit(1)
    head_line = tail.split('\n')[0]
    if head_line in frq:
        print('REFUSED: frq tail heading already present'); sys.exit(1)
    new_frq = frq + tail
    if new_frq.count(head_line) != 1:
        print('REFUSED: frq tail heading count != 1'); sys.exit(1)
    if not new_frq.startswith(frq):
        print('REFUSED: frq prefix broken'); sys.exit(1)
else:
    new_frq = None

# --- write, all three, only now ---
io.open(ODQ, 'w', encoding='utf-8').write(new_odq)
io.open(HAND, 'w', encoding='utf-8').write(new_hand)
if new_frq is not None:
    io.open(p['frq_out'], 'w', encoding='utf-8').write(new_frq)
    print('EDIT_OK ledger +%d B, card +%d B, frq +%d B' % (len(new_odq) - len(odq), len(new_hand) - len(hand), len(new_frq) - len(frq)))
else:
    print('EDIT_OK ledger +%d B, card +%d B (queue built separately)' % (len(new_odq) - len(odq), len(new_hand) - len(hand)))
