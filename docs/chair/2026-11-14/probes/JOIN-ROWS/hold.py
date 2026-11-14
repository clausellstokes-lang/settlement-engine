"""JOIN-ROWS-1: trace each row's writer on the joined tree and the lanes that hold it BY FUNCTION.
Usage (from the repository): python3 hold.py <rows.merged.json> <out.json>
Holder = a lane whose OWN diff (merge-base with lane/integration-2026-11-07 .. lane tip, -U0) has a hunk inside the
writer's enclosing unit (the function, the table, or the pool variant) in the lane's copy. Unit = innermost brace frame
whose opening line looks like a function, a const, or a JSON object/array key, found by a brace-stack scan with
single-line string literals stripped (a heuristic: named as such in the table)."""
import json,re,subprocess,sys,functools,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from writers import W
J='origin/lane/join-2026-11-14'; INT='origin/lane/integration-2026-11-07'
LANES=['w2-write-2026-11-13','w2-fix-data-2026-11-13','coherence-upkeep-2026-11-12','powers-follow-up-2026-11-13','r2-code-a-2026-11-13','r2-code-b-2026-11-13','r3-code-c-2026-11-13','w2-c-leaves-2026-11-13','r3-tabs-2026-11-13']
def git(*a):
    p=subprocess.run(['git',*a],capture_output=True,text=True); return p.stdout if p.returncode==0 else None
@functools.lru_cache(None)
def show(ref,f): return git('show',f'{ref}:{f}')
@functools.lru_cache(None)
def mb(l): return git('merge-base',INT,'origin/lane/'+l).strip()
@functools.lru_cache(None)
def mbj(l): return git('merge-base',J,'origin/lane/'+l).strip()
@functools.lru_cache(None)
def hunks(a,b,f):
    d=git('diff','-U0',a,b,'--',f) or ''
    out=[]
    for m in re.finditer(r'^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@',d,re.M):
        s=int(m.group(3)); n=int(m.group(4) if m.group(4) is not None else 1)
        out.append((s, s+max(n,1)-1))
    return out
STR=re.compile(r"'(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\"|`(?:\\.|[^`\\])*`")
HEAD=re.compile(r"(function\s+[\w$]+|[\w$]+\s*[:=]\s*(async\s*)?(function|\([^)]*\)\s*=>|[\w$]+\s*=>)|^\s*(export\s+)?(const|let|var)\s+[\w$]+|^\s*(?!(if|for|while|switch|catch|else|return)\b)[\w$]+\s*\([^)]*\)\s*\{|^\s*[\"'][^\"']+[\"']\s*:\s*[\[{(]|^\s*\{\s*$|^\s*\{\s*[\w$]+\s*:)")
def unit(text,line):
    L=text.split('\n'); stack=[]
    for i,l in enumerate(L[:line],start=1):
        s=STR.sub(lambda m: '"'+m.group(0)[1:-1].replace('{','').replace('}','').replace('[','').replace(']','')+'"' if m.group(0)[0]=='"' and re.match(r'^\s*"',l) else '""',l)
        s=re.sub(r'//.*$','',s)
        for ch in s:
            if ch in '{[': stack.append((i,L[i-1]))
            elif ch in '}]' and stack: stack.pop()
    # choose: innermost frame whose header line looks like a unit
    chosen=None
    for (i,h) in reversed(stack):
        if HEAD.search(h): chosen=(i,h);break
    if not chosen:
        return (1,len(L),'(file)')
    start=chosen[0]; depth=0; end=len(L)
    for j in range(start,len(L)+1):
        l=L[j-1]; s=STR.sub('""',l); s=re.sub(r'//.*$','',s)
        for ch in s:
            if ch in '{[': depth+=1
            elif ch in '}]': depth-=1
        if j>start and depth<=0: end=j;break
        if j==start and depth<=0 and ('{' in s or '[' in s): end=j;break
    name=chosen[1].strip()[:90]
    return (start,end,name)
def locate(text,needle):
    if needle is None: return None
    for i,l in enumerate(text.split('\n'),start=1):
        if needle in l: return i
    return None
rows=json.load(open(sys.argv[1])); out=[]
for r in rows:
    wr=W.get(r['id'],[]); recs=[]
    for f,nd in wr:
        jt=show(J,f)
        if jt is None: recs.append(dict(file=f,needle=nd,on_join=False));continue
        ln=locate(jt,nd)
        u=unit(jt,ln) if ln else (1,len(jt.split('\n')),'(file)')
        rec=dict(file=f,needle=nd,on_join=True,line_on_join=ln,unit=u[2],unit_range=[u[0],u[1]],lanes={})
        for l in LANES:
            lt=show('origin/lane/'+l,f)
            if lt is None: continue
            hk=hunks(mb(l),'origin/lane/'+l,f)
            if not hk: continue
            lln=locate(lt,nd)
            lu=unit(lt,lln) if lln else (1,len(lt.split('\n')),'(file)')
            touch_unit=(any(a<=lu[1] and b>=lu[0] for a,b in hk) if lu[2]!='(file)' else None) if lln else None
            touch_line=any(a<=lln<=b for a,b in hk) if lln else None
            near=min((min(abs(a-lu[0]),abs(b-lu[1])) for a,b in hk),default=None)
            post=hunks(mbj(l),'origin/lane/'+l,f)
            post_line=any(a<=lln<=b for a,b in post) if (lln and post) else False
            rec['lanes'][l]=dict(hunks=len(hk),needle_line=lln,unit=lu[2],touch_unit=touch_unit,touch_line=touch_line,nearest=near,post_join_hunks=len(post),post_join_touch_line=post_line,needle_at_tip=lln is not None)
        recs.append(rec)
    out.append(dict(id=r['id'],writers=recs))
json.dump(out,open(sys.argv[2],'w'),indent=1)
# compact print
for o in out:
    parts=[]
    for w in o['writers']:
        if not w.get('on_join'): parts.append(f"{w['file']}:NOFILE");continue
        hold=[l.split('-20')[0] for l,v in w['lanes'].items() if v['touch_unit']]
        filel=[l.split('-20')[0] for l,v in w['lanes'].items() if v['hunks'] and not v['touch_unit']]
        line=[l.split('-20')[0] for l,v in w['lanes'].items() if v['touch_line']]
        post=[l.split('-20')[0] for l,v in w['lanes'].items() if v['post_join_hunks']]
        gone=[l.split('-20')[0] for l,v in w['lanes'].items() if w['needle'] and not v['needle_at_tip']]
        parts.append(f"{w['file'].replace('src/','')}:{w['line_on_join']} [{w['unit'][:40]}] H={','.join(hold) or '-'} L={','.join(line) or '-'} F={','.join(filel) or '-'}"+(f" POST={','.join(post)}" if post else '')+(f" GONE@={','.join(gone)}" if gone else ''))
    print(o['id'],' || '.join(parts) if parts else 'NO WRITER MAPPED')
