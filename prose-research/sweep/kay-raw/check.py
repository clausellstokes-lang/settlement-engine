import json,re,unicodedata
base='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/'
d=json.load(open(base+'chunks/kay-01.json'))
m={'https://whatever.scalzi.com/2025/05/28/the-big-idea-guy-gavriel-kay-4/':'bigidea',
'https://brightweavings.com/children-of-earth-and-sky-author-questions/':'coes',
'https://brightweavings.com/letter-to-the-reader-of-ysabel/':'ysabel',
'https://brightweavings.com/interview-with-kristin-centorcelli/':'centorcelli',
'https://brightweavings.com/fionavarafterword/':'fionavar',
'https://brightweavings.com/exile/':'exile',
'https://brightweavings.com/6-books-i-love/':'sixbooks',
'https://brightweavings.com/interview-with-alison-flood-for-the-guardian/':'flood',
'https://lareviewofbooks.org/article/fantastic-worlds-guy-gavriel-kay/':'larb'}
def norm(s):
    s=unicodedata.normalize('NFKC',s)
    for a,b in [('‘',"'"),('’',"'"),('“','"'),('”','"'),('–','-'),('—','-'),('…','...')]:
        s=s.replace(a,b)
    return re.sub(r'\s+',' ',s).lower()
cache={}
for c in d['claims']:
    f=m[c['url']]
    if f not in cache: cache[f]=norm(open(f+'.txt2',encoding='utf-8').read())
    q=norm(c['quote'])
    print(c['index'], f, 'EXACT' if q in cache[f] else 'MISS', '|', c['quote'][:70])
