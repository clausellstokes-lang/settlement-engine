# -*- coding: utf-8 -*-
"""inflight-scan.py [--once] — THE NET BENEATH THE CHECKPOINTS (owner 2026-09-06 08:17: "make sure the in-lane checkpoints are saved").
Every research agent's transcript is a JSONL file the harness appends continuously; it survives a window cutoff even when the
agent never returned and never wrote its found/verdict file. This scanner walks every workflow agent transcript of every session
dir, and for each agent writes sweep/inflight/<runId>-<agentId>.json: role (finder/verifier/regrade/synth/critic), sweep name,
angle or chunk tag, the URLs it fetched (WebFetch inputs and curl/wget URLs in Bash), the files it wrote, tool counts, first/last
timestamps, and whether the run's journal already holds its result. A summary table goes to sweep/inflight/SUMMARY.md. Nothing
here touches a state, found or verdict file. Loop: every 120 s unless --once."""
import json,glob,os,re,sys,time,io,collections
S=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(S,'inflight'); os.makedirs(OUT,exist_ok=True)
ROOT='/Users/cstokes/.claude/projects/-Users-cstokes-Desktop-settlement-engine'
URL=re.compile(r'https?://[^\s"\'<>)\]]+')
def role_of(prompt):
    if 'research FINDER' in prompt or 'You are a research finder' in prompt: return 'finder'
    if 'Adversarially verify EACH claim' in prompt: return 'verifier'
    if 'read the verifier\'s note and trueWording' in prompt: return 'regrade'
    if 'write the dossier section' in prompt: return 'synth'
    if 'completeness critic' in prompt: return 'critic'
    if 'ADVERSARIAL refuter' in prompt: return 'refuter'
    return 'other'
def scan_agent(path):
    prompt=None; tools=collections.Counter(); urls=[]; writes=[]; first=None; last=None; n=0; last_text=''
    with io.open(path,encoding='utf-8',errors='replace') as f:
        for line in f:
            n+=1
            try: e=json.loads(line)
            except Exception: continue
            ts=e.get('timestamp'); 
            if ts: first=first or ts; last=ts
            m=e.get('message') or {}; c=m.get('content')
            blocks=c if isinstance(c,list) else ([{'type':'text','text':c}] if isinstance(c,str) else [])
            for b in blocks:
                t=b.get('type')
                if t=='text':
                    if prompt is None and m.get('role')=='user': prompt=b.get('text','')
                    elif m.get('role')=='assistant': last_text=b.get('text','')[-300:]
                elif t=='tool_use':
                    nm=b.get('name',''); tools[nm]+=1; i=b.get('input') or {}
                    if nm=='WebFetch' and i.get('url'): urls.append(i['url'])
                    elif nm=='Bash': urls.extend(u for u in URL.findall(str(i.get('command',''))) if 'archive.org/wayback/available' not in u)
                    elif nm in ('Write','Edit','MultiEdit') and i.get('file_path'): writes.append(i['file_path'])
    prompt=prompt or ''
    role=role_of(prompt)
    name=angle=tag=None
    mm=re.search(r'find-([a-z]+)-([a-z0-9-]+)\.md',prompt)
    if mm: name,angle=mm.group(1),mm.group(2)
    mv=re.search(r'verdicts-([a-z]+)-(i\d+-\d+|chunk-\d+|regrade-[a-z0-9]+)\.json',prompt)
    if mv: name,tag=mv.group(1),mv.group(2)
    if not name:
        ms=re.search(r'sweep-state\.mjs merge ([a-z]+)',prompt) or re.search(r'the sweep "([a-z]+)"',prompt)
        if ms: name=ms.group(1)
    seen=set(); uu=[u for u in urls if not (u in seen or seen.add(u))]
    return {'role':role,'name':name,'angle':angle,'tag':tag,'lines':n,'firstTs':first,'lastTs':last,'tools':dict(tools),'urlsFetched':uu,'filesWritten':sorted(set(writes)),'lastAssistantText':last_text}
def journal_results(run_dir):
    done=set(); failed=set()
    jp=os.path.join(run_dir,'journal.jsonl')
    if os.path.exists(jp):
        for line in io.open(jp,encoding='utf-8',errors='replace'):
            try: e=json.loads(line)
            except Exception: continue
            if e.get('type')=='result': done.add(e.get('agentId'))
            if e.get('type')=='failed': failed.add(e.get('agentId'))
    return done,failed
def run_once():
    rows=[]
    for run_dir in sorted(glob.glob(ROOT+'/*/subagents/workflows/wf_*')):
        try:
            if time.time()-os.path.getmtime(run_dir)>6*3600: continue   # only runs alive in the last six hours
        except OSError: continue
        run=os.path.basename(run_dir); done,failed=journal_results(run_dir)
        for ap in glob.glob(run_dir+'/agent-*.jsonl'):
            aid=os.path.basename(ap)[6:-6]
            try: d=scan_agent(ap)
            except Exception as ex: d={'error':str(ex)}
            d.update({'run':run,'agent':aid,'transcript':ap,'journal':'result' if aid in done else ('failed' if aid in failed else 'in-flight'),'checkpointFile':None})
            if d.get('role')=='finder' and d.get('name') and d.get('angle'):
                fp=os.path.join(S,'found-%s-%s.json'%(d['name'],d['angle']))
                if os.path.exists(fp):
                    try: j=json.load(open(fp)); d['checkpointFile']={'path':fp,'claims':len(j.get('claims',[])),'complete':j.get('complete',True),'mtime':time.strftime('%H:%M:%S',time.localtime(os.path.getmtime(fp)))}
                    except Exception: d['checkpointFile']={'path':fp,'unreadable':True}
            if d.get('role')=='verifier' and d.get('name') and d.get('tag'):
                fp=os.path.join(S,'verdicts-%s-%s.json'%(d['name'],d['tag'])); d['checkpointFile']={'path':fp,'exists':os.path.exists(fp)}
            json.dump(d,open(os.path.join(OUT,'%s-%s.json'%(run,aid)),'w'),ensure_ascii=False,indent=1)
            rows.append(d)
    rows.sort(key=lambda r:(r.get('name') or '~',r.get('role') or '',r.get('angle') or r.get('tag') or ''))
    lines=['# IN-FLIGHT AGENT PROGRESS — scanned %s (inflight-scan.py; every 120 s; the autosave seals this dir)'%time.strftime('%Y-%m-%d %H:%M:%S'),'',
           '| sweep | role | angle / chunk | journal | urls fetched | files written | checkpoint | last activity |','|---|---|---|---|---:|---|---|---|']
    for r in rows:
        if r.get('error'): lines.append('| ? | error | %s | | | | %s | |'%(r['agent'],r['error'][:60])); continue
        cp=r.get('checkpointFile'); cps='—'
        if cp and cp.get('claims') is not None: cps='%d claims, complete=%s @%s'%(cp['claims'],cp['complete'],cp['mtime'])
        elif cp and 'exists' in cp: cps='verdict file %s'%('WRITTEN' if cp['exists'] else 'absent')
        lines.append('| %s | %s | %s | %s | %d | %s | %s | %s |'%(r.get('name') or '?',r['role'],r.get('angle') or r.get('tag') or '',r['journal'],len(r['urlsFetched']),', '.join(os.path.basename(w) for w in r['filesWritten'])[:80] or '—',cps,(r.get('lastTs') or '')[11:19]))
    lines+=['','RECOVERY after a cutoff: for a finder whose journal says in-flight/failed and whose checkpoint is absent or complete=false, its urlsFetched list is the seed for the re-run (`mk-round.py … --inflight` folds it into the angle prompt as PRIOR PROGRESS); a verifier chunk without its verdict file simply re-runs (15 claims).']
    io.open(os.path.join(OUT,'SUMMARY.md'),'w',encoding='utf-8').write('\n'.join(lines)+'\n')
    return len(rows)
if __name__=='__main__':
    once='--once' in sys.argv
    open(os.path.join(OUT,'.scan.pid'),'w').write(str(os.getpid()))
    while True:
        try: n=run_once(); io.open(os.path.join(OUT,'scan.log'),'a').write('%s scanned %d agents\n'%(time.strftime('%H:%M:%S'),n))
        except Exception as ex: io.open(os.path.join(OUT,'scan.log'),'a').write('%s ERROR %s\n'%(time.strftime('%H:%M:%S'),ex))
        if once: break
        time.sleep(120)
