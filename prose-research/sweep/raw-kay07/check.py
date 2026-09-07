import re,sys,json
def norm(t):
    t = t.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    t = t.replace('—','--').replace('–','-').replace(' ',' ')
    t = re.sub(r'\s+',' ',t)
    return t
pairs = [
 (625,"halasz","sometimes ten or fifteen times for a scene"),
 (627,"halasz","the punctilious choice of word and image"),
 (629,"trudel","hammered on the head with the author’s didactic or pedantic point"),
 (632,"trudel","an ambience, a generally mythic flavour and realm would emerge"),
 (640,"dictionary","(Guy Gavriel Kay, The Summer Tree, Toronto, 1984;"),
 (656,"stern","his choice of tense, depending on which character the novel is"),
 (657,"stern","Most sections are written in the past tense, except for those"),
 (658,"stern","his narration shifts to present tense for the scene"),
 (659,"walschots","The language in River of Stars is formal and poetic"),
 (660,"walschots","the sentences laid out like layers of diaphanous fabric"),
 (665,"barbour","This is narration of a high quality, indeed."),
 (666,"barbour","quietly but consistently moved his narratives ever further away from the"),
 (671,"tourjournal","feels like a betrayal (even a large one) of the characters"),
 (676,"tourjournal","he forges his own rules when it comes to punctuation"),
 (678,"tourjournal","It’s exactly as he wants it when he submits the manuscript."),
]
cache={}
for idx,f,q in pairs:
    if f not in cache:
        cache[f]=norm(open(f+".txt",encoding="utf-8").read())
    t=cache[f]; qq=norm(q)
    pos=t.find(qq)
    print("="*70)
    print(idx,f,"EXACT" if pos>=0 else "MISS")
    if pos>=0:
        print("CTX:", t[max(0,pos-450):pos+550])
