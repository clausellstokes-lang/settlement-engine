import re, statistics as st, json
SENT_SPLIT = re.compile(r'(?<=[.?!])\s+(?=[“"(]?[A-Z0-9])')
def sentences(paras):
    out=[]
    for p in paras:
        for s in SENT_SPLIT.split(p):
            s=s.strip()
            if len(s.split())>=2: out.append(s)
    return out
CONTR = re.compile(r"\b\w+n[’']t\b|\b\w+[’'](re|ve|ll|m)\b|\b(it|that|there|what|let|he|she|who|here)[’']s\b", re.I)
def measure(label, paras, note=''):
    S=sentences(paras)
    lens=[len(s.split()) for s in S]
    words=sum(lens)
    text=' '.join(paras)
    mean=st.mean(lens); sd=st.pstdev(lens)
    srt=sorted(lens); pct=lambda p: srt[int(p*(len(srt)-1))]
    burst=sum(abs(lens[i]-lens[i-1]) for i in range(1,len(lens)))/max(1,len(lens)-1)/mean
    def srate(rx): return round(sum(1 for s in S if re.search(rx,s))/len(S),4)
    def per1k(rx): return round(len(re.findall(rx,text))/words*1000,2)
    return {
      'label':label,'note':note,
      'paragraphs':len(paras),'sentences':len(S),'words':words,
      'wordsPerSentence':{'mean':round(mean,1),'sd':round(sd,1),'min':min(lens),'max':max(lens),
        'p10':pct(.10),'p50':pct(.50),'p90':pct(.90),
        'shareUnder8':round(sum(1 for l in lens if l<8)/len(lens),4),
        'shareOver30':round(sum(1 for l in lens if l>30)/len(lens),4),
        'neighbourVariation':round(burst,3)},
      'sentencesPerParagraph':round(len(S)/len(paras),2),
      'secondPerson':{'sentenceRate':srate(r'\b(you|your|yours|yourself)\b'),
                      'per1000words':per1k(r'\b(?:you|your|yours|yourself)\b')},
      'digits':{'sentenceRate':srate(r'\d'),'per1000words':per1k(r'\d+')},
      'emDash':{'count':len(re.findall(r'—',text)),'sentenceRate':srate(r'—'),'per1000words':per1k(r'—')},
      'contractions':{'count':len(CONTR.findall(text)),'sentenceRate':round(sum(1 for s in S if CONTR.search(s))/len(S),4),
                      'per1000words':round(len(CONTR.findall(text))/words*1000,2)},
      'tenseProxy':{'isAre_per1000':per1k(r'\b(?:is|are)\b'),'wasWere_per1000':per1k(r'\b(?:was|were)\b'),
                    'hasHave_per1000':per1k(r'\b(?:has|have)\b'),'had_per1000':per1k(r'\bhad\b')},
      'punctuation':{'semicolonSentenceRate':srate(r';'),'colonSentenceRate':srate(r':\s'),
                     'parenSentenceRate':srate(r'\('),'questionSentenceRate':srate(r'\?'),
                     'exclamationSentenceRate':srate(r'!')},
      'lengthHistogram':lens,
    }
