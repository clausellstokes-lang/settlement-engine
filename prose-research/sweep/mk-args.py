# -*- coding: utf-8 -*-
"""mk-args.py <name> [--angles a,b,c] [--extra <json-file>] [--chunks] — builds the Workflow args for research-workflow-v2.js:
resume chunks (from chunk-manifests.json) and/or a top-up (existing claims as djb2 hashes of the content key, baseIndex = claim count).
The djb2 here MUST match the script's: h=5381; h=((h*33)^ord(ch)) & 0xffffffff per char; hex."""
import json,sys,os
SC=os.path.dirname(os.path.abspath(__file__))
KIT=os.path.dirname(SC)
def djb2(s):
    h=5381
    for ch in s: h=((h*33)^ord(ch))&0xffffffff
    return format(h,'x')
def key(c): return (str(c.get('source',''))+'|'+str(c.get('feature',''))+'|'+str(c.get('claim',''))[:60]).lower()
name=sys.argv[1]; a=sys.argv[2:]
angles=[]; extra=[]; chunks=[]
if '--angles' in a: angles=a[a.index('--angles')+1].split(',')
if '--extra' in a: extra=json.load(open(a[a.index('--extra')+1]))
sp=os.path.join(SC,'state-%s.json'%name); st=json.load(open(sp)) if os.path.exists(sp) else {'claims':[],'verdicts':{}}
if '--chunks' in a: chunks=json.load(open(os.path.join(SC,'chunk-manifests.json'))).get(name,{}).get('chunks',[])
args={'name':name,'cap':1,'verifiedCount':len(st.get('verdicts') or {}),'stateFile':sp,'outDir':SC,'kitDir':KIT,'chunks':chunks}
if angles or extra:
    args.update({'findAngles':angles,'extraAngles':extra,'baseIndex':len(st['claims']),'existingHashes':[djb2(key(c)) for c in st['claims']]})
out=os.path.join(SC,'args-%s.json'%name); json.dump(args,open(out,'w'),ensure_ascii=False)
print(out, len(json.dumps(args)),'bytes; chunks',len(chunks),'angles',angles,'extra',[e['key'] for e in extra],'baseIndex',args.get('baseIndex'))
