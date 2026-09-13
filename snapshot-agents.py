#!/usr/bin/env python3
# snapshot-agents.py — PER AGENT, PER LANE progress (owner, 2026-09-11: "regularly save the progress that they've made per agent
# per lane"). For every workflow run of the chair session: each agent's label, status (DONE with its result head / FAILED /
# IN FLIGHT with its last act), transcript mtime, tool calls, and the files it has written so far. Mirrors every journal and
# the per-agent summary under $SC/_progress/<wf>/ so a successor has them beside the packets. Called by snapshot-lanes.sh.
import json, os, sys, time, glob, re
SC = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit'
PROJ = '/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine'
sess = sys.argv[1] if len(sys.argv) > 1 else ''
out_dir = os.path.join(SC, '_progress'); os.makedirs(out_dir, exist_ok=True)
def mt(p): return time.strftime('%m-%d %H:%M', time.localtime(os.path.getmtime(p)))
lines = []
runs = sorted(glob.glob(os.path.join(PROJ, sess, 'subagents', 'workflows', 'wf_*')), key=os.path.getmtime, reverse=True) if sess else []
for run in runs:
    wf = os.path.basename(run); jp = os.path.join(run, 'journal.jsonl')
    started, results, failed, keyof, superseded = [], {}, {}, {}, set()
    if os.path.exists(jp):
        for line in open(jp):
            try: o = json.loads(line)
            except Exception: continue
            t = o.get('type'); a = o.get('agentId'); k = o.get('key')
            if t == 'started':
                for b, kb in keyof.items():
                    if kb == k and b != a and b not in results: superseded.add(b)  # a later start on the same key = a RETRY of the earlier attempt
                started.append(a); keyof[a] = k
            elif t == 'result': results[a] = o.get('result')
            elif t in ('failed', 'error', 'skipped'): failed[a] = o.get('error') or t
    pdir = os.path.join(out_dir, wf); os.makedirs(pdir, exist_ok=True)
    if os.path.exists(jp):
        try:
            src = open(jp).read(); dst = os.path.join(pdir, 'journal.jsonl')
            if not os.path.exists(dst) or open(dst).read() != src: open(dst, 'w').write(src)
        except Exception as e: lines.append('  (journal mirror failed: %s)' % e)
    done = len(results); n = len(started); nsup = len(superseded)
    nfail = len([a for a in failed if a not in superseded])  # a dead attempt later retried is RETRIED, not FAILED
    inflight = n - done - nfail - nsup
    lines.append('- **%s** (mtime %s): agent calls %d (%d distinct) · DONE %d · FAILED (not retried) %d · RETRIED (superseded attempts) %d · IN FLIGHT %d — mirror `_progress/%s/`' % (wf, mt(run), n, len(set(keyof.values())), done, nfail, nsup, inflight, wf))
    agent_lines = []
    for a in started:
        tp = os.path.join(run, 'agent-%s.jsonl' % a); mp = os.path.join(run, 'agent-%s.meta.json' % a)
        label = ''
        try: label = json.load(open(mp)).get('label') or json.load(open(mp)).get('name') or ''
        except Exception: pass
        status = 'DONE' if a in results else ('RETRIED (a later attempt on the same key runs)' if a in superseded else ('FAILED' if a in failed else 'IN FLIGHT'))
        tools = 0; last = ''; files = []; size = 0; tmt = ''
        if os.path.exists(tp):
            size = os.path.getsize(tp); tmt = mt(tp)
            if not label:
                try:
                    first = json.loads(open(tp).readline()); fm = first.get('message') or {}; fc = fm.get('content')
                    ptxt = fc if isinstance(fc, str) else ' '.join(b.get('text', '') for b in fc if isinstance(b, dict)) if isinstance(fc, list) else ''
                    role = re.search(r'You are (?:the |an? )?(?:Opus |Fable )?([A-Z][A-Z-]{3,})', ptxt); role = role.group(1) if role else ''
                    if not role and 'YOU ARE THE FOLDER' in ptxt: role = 'FOLDER'
                    if not role and 'YOU ARE THE REFUTER' in ptxt: role = 'REFUTER'
                    if not role and 'YOUR DESK:' in ptxt: role = 'SURVEYOR'
                    pool = re.search(r"pool key '([^']+)'", ptxt); desk = re.search(r'YOUR DESK: (\w+)|for the desk (\w+)', ptxt); rnd = re.search(r'(?:cure |draft |CURE ROUND |round )(\d+)', ptxt)
                    label = ' '.join(x for x in [role, (pool.group(1) if pool else ''), ((desk.group(1) or desk.group(2)) if desk else ''), ('r' + rnd.group(1)) if rnd else ''] if x) or '?'
                except Exception: label = '?'
            try:
                for line in open(tp):
                    if '"tool_use"' not in line: continue
                    try: o = json.loads(line)
                    except Exception: continue
                    m = o.get('message') or {}; c = m.get('content') if isinstance(m, dict) else None
                    if not isinstance(c, list): continue
                    for b in c:
                        if b.get('type') != 'tool_use': continue
                        tools += 1; inp = b.get('input') or {}
                        nm = b.get('name', '')
                        if nm in ('Write', 'Edit', 'MultiEdit') and inp.get('file_path'): files.append(inp['file_path'])
                        if nm == 'Bash':
                            cmd = str(inp.get('command', ''))
                            for mm in re.finditer(r'>\s*([^\s;&|]+\.(?:md|json|txt))', cmd): files.append(mm.group(1))
                            if 'git commit' in cmd: files.append('(git commit)')
                        last = nm + ' ' + (str(inp.get('command') or inp.get('file_path') or inp.get('pattern') or json.dumps(inp))[:110]).replace('\n', ' ')
            except Exception as e: last = 'transcript read error: %s' % e
        files = list(dict.fromkeys(files))[-4:]
        head = ''
        if a in results:
            r = results[a]; head = (json.dumps(r) if not isinstance(r, str) else r)[:160].replace('\n', ' ')
        agent_lines.append('    - `%s` %s · %s · transcript %s %d KB · %d tool calls%s%s%s' % (a[:9], (label or '?'), status, tmt, size // 1024, tools,
            (' · files: ' + ', '.join(os.path.basename(f) if f.startswith('/') else f for f in files)) if files else '',
            (' · last: ' + last) if (status == 'IN FLIGHT' and last) else '',
            (' · result: ' + head) if head else ''))
    lines.extend(agent_lines)
    try: open(os.path.join(pdir, 'agents.md'), 'w').write('# %s — per-agent progress, %s\n' % (wf, time.strftime('%Y-%m-%d %H:%M:%S')) + '\n'.join(agent_lines) + '\n')
    except Exception: pass
print('\n'.join(lines) if lines else '- (no workflow runs found for session %s)' % (sess or '?'))
