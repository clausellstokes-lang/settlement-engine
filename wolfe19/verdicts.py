import json, os
claims = json.loads(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/wolfe19/claims-in.json',encoding='utf-8').read())
V = [
 (1023,"VERIFIED_VERBATIM","\"If nothing is wrong, leave it alone\"",
  "Cambridge Core chapter page fetched live with a browser UA; the public Summary block carries the full rule list. The sentence stands in the third rule, 'Revise your story as needed', immediately after 'When your story is rejected, read it over again.' Page metadata on the same page reads 'pp. 203', matching the citation."),
 (1024,"VERIFIED_VERBATIM","\"no plot is better than too much plot\"",
  "Live Cambridge Core Summary, penultimate paragraph. Verbatim. Caution for downstream use: Wolfe's full sentence opens by preferring plot to none and only then ranks excess plot worst, so the claim must not be read as Wolfe preferring plotlessness. Page metadata 'pp. 206 - 207' matches."),
 (1025,"VERIFIED_VERBATIM","\"Great novels are concerned with love and death, lesser novels\"",
  "Live Cambridge Core Summary, final lines. The quoted fragment is contiguous and the page completes it with sex and violence, exactly as the claim states. Wolfe's next sentence adds that love and death are sex and violence handled by a great novelist. Metadata 'pp. 206 - 207' matches."),
 (1026,"VERIFIED_VERBATIM","\"distinguishes one character from another, particularly in dialogue\"",
  "Live Cambridge Core Summary. Wolfe's first of three aims of characterisation, introduced 'First, characterisation ...' and demonstrated by an unattributed three-line exchange he claims the reader can assign. Metadata 'pp. 204 - 205' matches the citation."),
 (1027,"VERIFIED_VERBATIM","\"The hard things about writing are telling a good story\"",
  "Live Cambridge Core Summary, opening paragraph. The page completes the sentence with skilful prose and adds that plotting and characterisation are by contrast easy, which is the hierarchy the claim names. Metadata 'pp. 204 - 205' matches."),
 (1028,"VERIFIED_VERBATIM","\"It wouldn't fetch a copper in the market\"",
  "Live Cambridge Core Summary, third demonstration passage (characterisation making the reader care). The preceding sentence has the character fingering a worn rope, so the rope is indeed priced against a copper and then judged still strong enough. Wolfe's own composed example, so the 'applies' polarity holds."),
 (1029,"PARTIAL","\"Another mouth to feed. Well, hell.\" - six words",
  "Quotation is verbatim on the live page, inside single curly quotes, as Wolfe's demonstration of the second aim, taking the reader into the character's psyche - so the 'interior register' limb holds. The word count does not: the thought as printed runs six words. Only its first sentence is four words, and the claim's own quote field carries all six."),
 (1030,"VERIFIED_VERBATIM","\"The only way I know to write is to write\"",
  "Live Cambridge Core Summary, first GW answer. The page completes it with the kind of thing he would like to read himself. Speaker attribution confirmed on the page by the LM/GW dialogue tags and the headnote naming McCaffery's 1988 Science Fiction Studies interview. Metadata 'pp. 79 - 100' matches."),
 (1031,"VERIFIED_VERBATIM","\"content to focus on everyday events\"",
  "Live Cambridge Core Summary, closing GW answer of the excerpt. Wolfe frames it as a matter of whether you are content with that or want to encompass the entire universe, which supplies the second half of the claimed antithesis and the chapter title."),
 (1032,"VERIFIED_VERBATIM","\"apt to answer a query with a terse and precise\"",
  "Live Cambridge Core Summary. The sentence sits in the first-person introduction ('I first met Gene Wolfe ...') that follows Peter Wright's headnote naming Frazier's Thrust interview, so attribution to Frazier holds. The page completes it with 'reply, rather than talk on and on in vacuous phrases'. Metadata 'pp. 44 - 55' matches."),
 (1033,"VERIFIED_VERBATIM","\"it is a highly-wrought, intelligent, perceptive work\"",
  "SpringerLink abstract via the Wayback raw capture 20180618115401id_, as the routeHint predicted; the live page is behind a Client Challenge. Manlove's second sentence, prefaced 'Certainly' and completed with 'full of amazing bursts of imaginative creation'. Chapter paginated pp. 198-216 on the same page."),
 (1034,"VERIFIED_VERBATIM","\"reminiscent of Peake and Borges in its richness of creation\"",
  "Same Wayback capture of the SpringerLink abstract. Manlove's third sentence; the page extends the list with inwardness and a questioning of reality. The subject is the four-book Book of the New Sun named in the opening sentence, so 'the tetralogy' is right."),
 (1035,"VERIFIED_VERBATIM","\"with his coolness of intellect\"",
  "Same Wayback capture. The full sentence has Severian the torturer, so qualified, recalling Peake's much more evil Steerpike or Borges's narrators with their methodical rationality. The claim names only the Borges half; that half is supported and the Steerpike comparison is omitted, not contradicted."),
 (1036,"VERIFIED_VERBATIM","\"with rituals, guilds, myths and religions, and few machines\"",
  "Same Wayback capture. The page reads that the society described is largely of an antique or medieval character, then the quoted list. One wording note: the page says 'the society described' and never prints the name Urth, though it places the tetralogy on our Earth far into the future, which is the same referent."),
 (1037,"VERIFIED_VERBATIM","\"Reference is made occasionally to a previous, aeons-past technological age\"",
  "Same Wayback capture, immediately after the antique-society sentence. The page completes it with 'of interplanetary travel, but that is all' - and that closing clause is what supports the claim's restrictive 'only occasionally'."),
]
verdicts=[{"index":i,"verdict":v,"trueWording":t,"note":n} for i,v,t,n in V]
bad=[(d["index"],len(d["trueWording"].split())) for d in verdicts if len(d["trueWording"].split())>12]
assert not bad, bad
assert len(verdicts)==15 and [c["index"] for c in claims]==[d["index"] for d in verdicts]
out={"name":"wolfe","chunk":19,"claims":claims,"verdicts":verdicts}
p='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/verdicts-wolfe-i1023-1037.json'
open(p,'w',encoding='utf-8').write(json.dumps(out,indent=1,ensure_ascii=False))
print("wrote",p,os.path.getsize(p),"bytes")
print("max trueWording words:",max(len(d["trueWording"].split()) for d in verdicts))
from collections import Counter
print(Counter(d["verdict"] for d in verdicts))
