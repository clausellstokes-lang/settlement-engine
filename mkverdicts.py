import json
base='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/'
src=json.load(open(base+'chunks/leguin-01.json',encoding='utf-8'))
V=[
 (15,"VERIFIED_SUBSTANCE","holds up those seven writers as successful examples",
  "Raw wikitext + rendered plaintext (Special:Export + action=query prop=extracts). Page: 'In her argument that fantastic creation should reach to the very words and grammar in fantasy writers, she holds up Lord Dunsany, E. R. Eddison, Kenneth Morris, J. R. R. Tolkien, James Branch Cabell, Evangeline Walton, and Jack Vance as successful examples.' All seven names match in order; the claim's gloss 'models of style that fits its world' is a paraphrase of 'fantastic creation should reach to the very words and grammar', hence SUBSTANCE not VERBATIM (claim carried no quote).",None),
 (16,"VERIFIED_VERBATIM","because there is no known framework for the reader's mind to rest upon",
  "Raw wikitext, Style-and-mood section: 'Le Guin herself said that in fantasy it was necessary to be clear and direct with language, because there is no known framework for the reader's mind to rest upon.' Quoted fragment is word-for-word; both limbs (clear and direct; no framework for the reader) supported. Cited to Slusser 1976 pp.32-35.",None),
 (17,"PARTIAL","makes the narrator seem sympathetic, does not distance his thoughts",
  "Raw wikitext: 'This narrative technique, which Cadden characterizes as \"free indirect discourse\", makes the narrator of the book seem sympathetic to the protagonist, and does not distance his thoughts from the reader.' Quote verbatim; 'Mike Cadden' confirmed elsewhere on the same page ('Scholar Mike Cadden'); sympathy limb supported; blending of protagonist feelings with narration supported only loosely ('does not distance his thoughts from the reader') and stated squarely on the SEPARATE Ursula K. Le Guin article, not this one. Nothing on this page says anything about narrative flexibility.",
  "'while keeping narrative flexibility' - the cited page never claims the technique preserves flexibility"),
 (18,"VERIFIED_VERBATIM","the narration switches from looking ahead into Ged's future",
  "Raw wikitext: 'The story often appears to assume that readers are familiar with the geography and history of Earthsea, a technique which allowed Le Guin to avoid exposition ... In keeping with the notion of an epic, the narration switches from looking ahead into Ged's future and looking back into the past of Earthsea.' Quote verbatim; all limbs present. Minor hedge: the page says 'often appears to assume' where the claim asserts it flatly.",None),
 (19,"VERIFIED_VERBATIM","gives Le Guin's world the mysterious depths of Tolkien's, but without his tiresome back-stories and versifying",
  "Raw wikitext: 'a reviewer wrote that this method \"gives Le Guin's world the mysterious depths of Tolkien's, but without his tiresome back-stories and versifying\"', ref name='Craig 2003' (Amanda Craig, The Guardian, 24 Sep 2003). Quote verbatim; 'a reviewer' and the crediting of the no-exposition method both supported.",None),
 (20,"VERIFIED_VERBATIM","Slusser described the mood of the novel as \"strange and dreamlike\"",
  "Raw wikitext: 'Slusser described the mood of the novel as \"strange and dreamlike\", fluctuating between objective reality and the thoughts in Ged's mind'. Quote verbatim; the fluctuation limb is present word for word; 'George Slusser' is given in full earlier in the same section, cited to Slusser 1976 pp.35-38.",None),
 (21,"VERIFIED_VERBATIM","in prose as taut and clean as a ship's sail",
  "Raw wikitext, Reception: 'a review in The Guardian by author and journalist Amanda Craig said it was \"The most thrilling, wise and beautiful children's novel ever, [written] in prose as taut and clean as a ship's sail.\"' Quote verbatim; Craig and The Guardian both named on the page.",None),
 (22,"PARTIAL","Slusser: \"work of high style and imagination\"; \"genuine epic vision\" cited to Cadden",
  "Raw wikitext: 'Slusser described the Earthsea cycle as a \"work of high style and imagination\",{{sfn|Slusser|1976|pp=32-35}} and the original trilogy of books a product of \"genuine epic vision\".{{sfn|Cadden|2005|p=86}}' The quoted limb is verbatim and is Slusser 1976. The second limb is footnoted to Cadden 2005 and its object is the original trilogy, not the cycle.",
  "'the Earthsea cycle ... with genuine epic vision' per Slusser 1976 - the page applies 'genuine epic vision' to the original trilogy and footnotes it to Cadden 2005"),
 (23,"VERIFIED_VERBATIM","Every word was exactly in place and every sentence or line had resonance",
  "Raw wikitext: 'literary critic Harold Bloom described Le Guin as an \"exquisite stylist\", saying that in her writing, \"Every word was exactly in place and every sentence or line had resonance\".' Quote verbatim; 'exquisite stylist', exact placement and resonance all present.",None),
 (24,"VERIFIED_VERBATIM","described her as using \"a lean but lyrical style\" to explore issues of moral relevance",
  "Raw wikitext: 'The New York Times described her as using \"a lean but lyrical style\" to explore issues of moral relevance.' Quote verbatim; the moral-issues limb is supported as 'issues of moral relevance'. The page attributes the style to her writing rather than the word 'prose', a wording difference only.",None),
 (25,"VERIFIED_VERBATIM","Her prose, according to Zadie Smith, was \"as elegant and beautiful as any written in the twentieth century\"",
  "Raw wikitext: exact sentence present, ref 'Fellow Writers' (Library of America, 26 Jan 2018). Quote verbatim; every limb supported.",None),
 (26,"VERIFIED_VERBATIM","personal narration, diary extracts, Gethenian myths, and ethnological reports; \"distinctly post-modern\"",
  "Raw wikitext, same paragraph: 'The heterogeneous structure of The Left Hand of Darkness, described as \"distinctly post-modern\", was unusual for the time of its publication' and '... the material, consisting of personal narration, diary extracts, Gethenian myths, and ethnological reports.' Quote verbatim; all four components present.",None),
 (27,"VERIFIED_VERBATIM","described by Bloom as \"precise, dialectical-always evocative in its restrained pathos\"",
  "Raw wikitext has 'restrained [[pathos]]' (wikilink), so the quote was confirmed against the RENDERED plaintext extract via action=query&prop=extracts&explaintext, where the exact string 'precise, dialectical—always evocative in its restrained pathos' is present (em dash, as in the claim). Attributed to Bloom 1987 and applied to Le Guin's writing style in this novel.",None),
 (28,"VERIFIED_SUBSTANCE","tales immediately precede chapters describing Ai's similar experience; explain culture and philosophy",
  "Raw wikitext: 'The myths and legends serve to explain specific features about Gethenian culture, as well as larger philosophical aspects of society. Many of the tales used in the novel immediately precede chapters describing Ai's experience with a similar situation.' Claim carried no quote and is a paraphrase; both limbs supported. Page hedges with 'Many of the tales' where the claim generalises.",None),
 (29,"VERIFIED_SUBSTANCE","first-person narration reflects his slowly developing view; White: initially confusing to reviewers",
  "Raw wikitext: 'Ai's first-person narration reflects his slowly developing view, and the reader's knowledge and understanding of the Gethens evolves with Ai's awareness. He begins in naivety, gradually discovering his profound errors in judgement.' And: 'In 1999, literary scholar Donna White wrote that the unorthodox structure of the novel made it initially confusing to reviewers, before it was interpreted as an attempt to follow the trajectory of Ai's changing views.' Both limbs supported; claim carried no quote, hence SUBSTANCE.",None),
]
verdicts=[]
for i,v,tw,note,limb in V:
    d={"index":i,"verdict":v,"trueWording":tw,"note":note}
    if limb: d["unsupportedLimb"]=limb
    verdicts.append(d)
out={"name":"leguin","chunk":1,"claims":src["claims"],"verdicts":verdicts}
p=base+'verdicts-leguin-i15-29.json'
json.dump(out,open(p,'w',encoding='utf-8'),indent=1,ensure_ascii=False)
print("wrote",p,len(verdicts))
