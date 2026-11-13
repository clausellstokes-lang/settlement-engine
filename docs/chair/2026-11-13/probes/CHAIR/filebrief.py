#!/usr/bin/env python3
"""File a seat's brief on the chair lane, verbatim from the chair's own transcript.

usage: filebrief.py <session_id> <SEAT-NAME> [<session_id> <SEAT-NAME> ...]

For each pair: finds the create_session call whose result carries the session id,
asserts the prompt names no model, and writes
docs/chair/2026-11-13/briefs/BRIEF-<SEAT-NAME>.md with the standing header.
Prints one line per brief (path, time sent, bytes); never prints the prompt.
"""
import json, re, sys, os

T = '/root/.claude/projects/-home-user-settlement-engine/91e46373-23dd-54eb-90fd-9c73625986f8.jsonl'
OUT = '/home/user/settlement-engine/docs/chair/2026-11-13/briefs'
# The pattern that finds a model's name is kept out of the repository: pass it in CHAIR_MODEL_PATTERN.
MODEL = re.compile(os.environ.get('CHAIR_MODEL_PATTERN', r'$^'), re.I)

def load():
    uses, results = {}, {}
    with open(T) as fh:
        for line in fh:
            try:
                o = json.loads(line)
            except Exception:
                continue
            msg = o.get('message') or {}
            content = msg.get('content')
            if not isinstance(content, list):
                continue
            for c in content:
                if not isinstance(c, dict):
                    continue
                if c.get('type') == 'tool_use' and c.get('name', '').endswith('create_session'):
                    uses[c['id']] = (c.get('input') or {}, o.get('timestamp'))
                elif c.get('type') == 'tool_result':
                    body = c.get('content')
                    text = body if isinstance(body, str) else json.dumps(body)
                    results[c.get('tool_use_id')] = (text, o.get('timestamp'))
    return uses, results

def main(argv):
    pairs = list(zip(argv[0::2], argv[1::2]))
    uses, results = load()
    for sid, seat in pairs:
        hit = None
        for uid, (inp, ts) in uses.items():
            res = results.get(uid)
            if res and sid in res[0]:
                hit = (inp, ts, res[0])
        if not hit:
            print('NOT FOUND', sid, seat)
            sys.exit(2)
        inp, ts, res = hit
        prompt = inp['prompt']
        m = MODEL.search(prompt)
        if m:
            print('MODEL NAMED IN PROMPT', seat, repr(m.group(0)))
            sys.exit(3)
        created = re.search(r'created_at\\?":\\?"(\d{4}-\d\d-\d\d)T(\d\d:\d\d):\d\d', res)
        day, hhmm = created.group(1), created.group(2)
        title = inp.get('title', seat)
        head = (
            f"# BRIEF: {title}\n\n"
            f"The seat's first message, exactly as the chair sent it on {day} at {hhmm} UTC "
            f"(the time is the chair's own transcript's). Session {sid}; checked out at "
            f"`{inp.get('source_revision')}`; the seat's own branch `{inp.get('outcome_branch')}`; "
            f"a clone of {inp.get('clone_depth')} commits; effort {inp.get('effort')}; the model as the chair's "
            f"records of that day give the mix. Filed by the chair so the assignment outlives the session. "
            f"Rulings sent after it are in the chair's records.\n\n---\n\n"
        )
        m2 = MODEL.search(head)
        if m2:
            print('MODEL NAMED IN HEADER', seat, repr(m2.group(0)))
            sys.exit(3)
        path = os.path.join(OUT, f'BRIEF-{seat}.md')
        if os.path.exists(path):
            print('EXISTS, not overwritten', path)
            sys.exit(4)
        with open(path, 'w') as fh:
            fh.write(head + prompt.rstrip('\n') + '\n')
        print(f'filed {path} sent {day} {hhmm} UTC bytes {len(prompt.encode())}')

if __name__ == '__main__':
    main(sys.argv[1:])
