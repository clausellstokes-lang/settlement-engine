import json,re,unicodedata
base='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/'
claims=json.load(open(base+'prose-research/sweep/chunks/dnd-04.json'))['claims']
files={
 'https://www.enworld.org/threads/compiling-wolfgang-baurs-ama.663114/':'enworld.txt',
 'http://www.wizards.com/default.asp?x=dnd/ab/20060728a':'wotc_ab1.txt',
 'http://www.wizards.com/default.asp?x=dnd/ab/20060811a':'wotc_ab2.txt',
 'http://www.wizards.com/default.asp?x=dnd/dd/20070727a':'wotc_dd1.txt',
 'http://richard-baker.blogspot.com/2015/03/twenty-eight-adventures-part-1.html':'baker.txt',
 'https://critical-hits.com/blog/2012/12/19/freelancer-chronicles-the-coast-wizards-and-i-some-lessons/':'crit.txt',
 'https://slyflourish.com/on_writing_adventures.html':'sly.txt',
 'https://koboldpress.com/making-the-realms-shine-a-conversation-with-ed-greenwood-part-i/':'kobold.txt',
}
def norm(s):
    s=unicodedata.normalize('NFKD',s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','-').replace('–','-')
    s=''.join(c for c in s if not unicodedata.combining(c))
    return re.sub(r'\s+',' ',s).strip().lower()
for c in claims:
    t=norm(open(base+'dnd4/'+files[c['url']],encoding='utf-8').read())
    q=norm(c['quote'])
    print(c['index'], 'EXACT' if q in t else 'MISS', '|', c['quote'][:70])
