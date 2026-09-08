import json, os
K="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research"
P=K+"/primary"
order=[("leguin-nonfiction",P),("leguin-nonfiction-written",P),("leguin-nonfiction-spoken",P),
       ("leguin-fiction",P),("leguin-all",P),("tolkien-plain",P),("tolkien-elevated",P),
       ("martin-narrative",P),("martin-chronicle",P),("dnd-flavor",P),("dnd-rules",P),("estate-state",K)]
D={}
for lbl,base in order:
    D[lbl]=json.load(open(f"{base}/{lbl}.fingerprint.json"))
rows=[
 ("sentences", lambda d: d["sentences"]),
 ("wps mean", lambda d: d["wordsPerSentence"]["mean"]),
 ("wps sd", lambda d: d["wordsPerSentence"]["sd"]),
 ("wps p50", lambda d: d["wordsPerSentence"]["p50"]),
 ("wps p90", lambda d: d["wordsPerSentence"]["p90"]),
 ("shareUnder8", lambda d: d["wordsPerSentence"]["shareUnder8"]),
 ("shareOver30", lambda d: d["wordsPerSentence"]["shareOver30"]),
 ("neighbourVar", lambda d: d["wordsPerSentence"]["neighbourVariation"]),
 ("emDash", lambda d: d["punctuation"]["emDashRate"]),
 ("semicolon", lambda d: d["punctuation"]["semicolonRate"]),
 ("colon", lambda d: d["punctuation"]["colonRate"]),
 ("antithesis", lambda d: d["shapes"]["antithesisRate"]),
 ("triad", lambda d: d["shapes"]["triadRate"]),
 ("participialOpener", lambda d: d["shapes"]["participialOpenerRate"]),
 ("doubledAdj", lambda d: d["shapes"]["doubledAdjectiveRate"]),
 ("adverbs/sent", lambda d: d["shapes"]["adverbsPerSentence"]),
 ("abstractCloser", lambda d: d["closers"]["abstractNounRate"]),
 ("runs3SameBand", lambda d: d["runsOfThreeSameLengthBand"]),
]
labs=[l for l,_ in order]
print("| metric | " + " | ".join(labs) + " |")
print("|" + "---|"*(len(labs)+1))
for name,fn in rows:
    print(f"| {name} | " + " | ".join(str(fn(D[l])) for l in labs) + " |")
print()
print("| corpus | top 5 openers | top 5 closers |")
print("|---|---|---|")
for l in labs:
    d=D[l]
    o=", ".join(f"{w or '∅'} {n}" for w,n in d["openers"]["topOpeners"][:5])
    c=", ".join(f"{w or '∅'} {n}" for w,n in d["closers"]["topClosers"][:5])
    print(f"| {l} | {o} | {c} |")
