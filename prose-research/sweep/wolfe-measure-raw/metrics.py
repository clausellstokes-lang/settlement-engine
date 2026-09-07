import re,sys,json,math,statistics as st

TOP=[w.strip() for w in open('freq10k.txt',encoding='utf-8') if w.strip()]
TOP5=set(TOP[:5000]); TOP10=set(TOP)
DICT=set(w.strip().lower() for w in open('/usr/share/dict/web2',encoding='utf-8',errors='replace'))

ABBR=r'(?:Mr|Mrs|Ms|Dr|St|Sgt|Capt|Lt|Col|Gen|Prof|Rev|Jr|Sr|vs|etc|Mme|Mlle|No|Ave|Fr)\.'
SUB = r"\b(that|which|who|whom|whose|because|although|though|while|whilst|when|whenever|where|wherever|whereas|if|unless|until|till|since|before|after|than|whether|lest)\b"
SPEECH = r"\b(said|says|asked|asks|replied|answered|answers|told|tells|cried|whispered|murmured|shouted|muttered|added|began|continued|demanded|inquired|repeated|explained|remarked|observed|returned)\b"

def sentences(t):
    t=re.sub(r'\s+',' ',t).strip()
    t=re.sub(ABBR, lambda m:m.group(0).replace('.',''), t)
    parts=re.split(r'(?<=[.!?…])["”’\')\]]*\s+', t)
    parts=[p.strip() for p in parts]
    return [p for p in parts if re.search(r'[A-Za-z]',p)]

def words(s):
    return re.findall(r"[A-Za-z][A-Za-z'’-]*", s)

def norm(w):
    return re.sub(r"['’-]",'',w.lower())

def measure(name, text, target=2000):
    sents=sentences(text)
    acc=[];n=0
    for s in sents:
        acc.append(s); n+=len(words(s))
        if n>=target: break
    sents=acc
    lens=[len(words(s)) for s in sents]
    toks=[w for s in sents for w in words(s)]
    ntok=len(toks)
    lower=[norm(w) for w in toks]
    lower=[w for w in lower if w]
    from collections import Counter
    c=Counter(lower)
    rare5=sum(1 for w in lower if w not in TOP5)/len(lower)
    rare10=sum(1 for w in lower if w not in TOP10)/len(lower)
    oov=sum(1 for w in lower if w not in DICT and w not in TOP10)/len(lower)
    long9=sum(1 for w in lower if len(w)>=9)/len(lower)
    hapax=sum(1 for w,k in c.items() if k==1)/len(lower)
    sub_counts=[len(re.findall(SUB,s,re.I)) for s in sents]
    paren=sum(1 for s in sents if '(' in s)
    emd=sum(1 for s in sents if '—' in s or '–' in s)
    either=sum(1 for s in sents if '(' in s or '—' in s or '–' in s)
    quoted=[s for s in sents if re.search(r'["“”]',s)]
    tagged=[s for s in quoted if re.search(SPEECH,s,re.I)]
    return {
      "sample":name,"sentences":len(sents),"words":ntok,
      "mean_sentence_words":round(st.mean(lens),2),
      "sd_sentence_words":round(st.pstdev(lens),2),
      "cv_sentence_words":round(st.pstdev(lens)/st.mean(lens),3),
      "median_sentence_words":st.median(lens),
      "max_sentence_words":max(lens),"min_sentence_words":min(lens),
      "pct_sentences_over_40w":round(100*sum(1 for l in lens if l>40)/len(lens),1),
      "pct_sentences_under_8w":round(100*sum(1 for l in lens if l<8)/len(lens),1),
      "sub_markers_per_sentence":round(st.mean(sub_counts),2),
      "sub_markers_per_100w":round(100*sum(sub_counts)/ntok,2),
      "pct_sentences_with_parentheses":round(100*paren/len(sents),1),
      "pct_sentences_with_dash":round(100*emd/len(sents),1),
      "pct_sentences_with_any_parenthetical":round(100*either/len(sents),1),
      "pct_sentences_quoted_speech":round(100*len(quoted)/len(sents),1),
      "pct_quoted_sentences_with_speech_verb":round(100*len(tagged)/len(quoted),1) if quoted else None,
      "speech_tags_per_1000w":round(1000*len(tagged)/ntok,2),
      "rare_rate_outside_top5000":round(100*rare5,2),
      "rare_rate_outside_top10000":round(100*rare10,2),
      "out_of_dictionary_rate":round(100*oov,2),
      "pct_tokens_9chars_plus":round(100*long9,2),
      "hapax_share_of_tokens":round(100*hapax,2),
    }

def body(path,a,b):
    ls=open(path,encoding='utf-8').read().split('\n')
    return ' '.join(ls[a-1:b])

samples=[
 ("1972 The Fifth Head of Cerberus (Tor/Forge excerpt)", body('fifthhead.txt',9,57)),
 ("1980 The Shadow of the Torturer ch.1 (Shadow & Claw excerpt)", body('shadowclaw-wb.txt',9,114)),
 ("2013 The Land Across (Reactor excerpt)", body('landacross.txt',15,228)),
 ("2015 A Borrowed Man (Reactor excerpt)", body('borrowedman.txt',16,199)),
]
res=[measure(n,t) for n,t in samples]
print(json.dumps(res,indent=1))
