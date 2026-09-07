import json,sys,os
P='found-leguin-record-register.json'
d=json.load(open(P))
def addsrc(**k):
    if any(s['url']==k['url'] for s in d['sourcesRead']): return
    d['sourcesRead'].append(k)
def addclaim(**k):
    key=(k['url'],k['claim'])
    if any((c['url'],c['claim'])==key for c in d['claims']): return
    d['claims'].append(k)
