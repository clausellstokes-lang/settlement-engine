#!/usr/bin/env python3
"""v3: merge the 01:14 lane's verified table (v2 copy) with the 05:34 lane's finds and this pass's
new sources. Every non-empty quote is machine-checked verbatim (after quote/whitespace/PDF-hyphen/
Polish-diacritic normalisation) against a locally fetched copy of its source; abort on any miss."""
import json, os, re, sys
BASE="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
src=open(os.path.join(BASE,"build-kay-academic-v2.py")).read()
exec(src[:src.index("def norm(s):")])   # defines BASE, RAW, S, C from the verified v1 table
R2=os.path.join(BASE,"kay-raw2"); R3=os.path.join(BASE,"kay-raw3")

# ---- re-point v1 entries whose Wayback reads can no longer be re-fetched to live pages read today
S["home-away"]=("Guy Gavriel Kay, 'Home and Away' (keynote essay for an academic conference in Toronto; shorter version in The Globe and Mail, fall 1999)",
                "https://brightweavings.com/globe/","author essay",True,os.path.join(R2,"home-away-globe.txt"))
S["clarkesworld"]=("Chris Urie, 'The Quarter Turn of History: A Conversation with Guy Gavriel Kay', Clarkesworld 117 (June 2016)",
                   "https://clarkesworldmagazine.com/kay_interview/","author interview",True,os.path.join(R2,"clarkesworld.txt"))
S["locus"]=("'Guy Gavriel Kay: Margins of History', Locus (May 2025 excerpt)",
            "https://locusmag.com/feature/guy-gavriel-kay-margins-of-history/","author interview",True,os.path.join(R2,"locus-margins.txt"))
S["walton-sar"]=("Jo Walton, 'Mosaics and charioteers: Guy Gavriel Kay's Sarantine Mosaic', Tor.com (2009-11-02), reprinted on Bright Weavings",
                 "https://brightweavings.com/mosaics-and-charioteers-guy-gavriel-kays-sarantine-mosaic/","critical essay (reprint; reactormag original 403s)",True,os.path.join(R2,"walton-sarantine.txt"))
S["c2c"]=("Bob Tarantino, 'The fantastic fiction of Guy Gavriel Kay', C2C Journal (2016-09-07)",
          "https://c2cjournal.ca/2016/09/the-fantastic-fiction-of-guy-gavriel-kay/","critical essay",True,os.path.join(R2,"c2c.txt"))
S["tor2016"]=(S["tor2016"][0]+" — NOTE: web.archive.org is unreachable from this tool as of 2026-09-06; the read stands from the earlier lane's fetch",)+S["tor2016"][1:]
C=[c for c in C if c[2]!="c2c"]
C+=[("compact, spare style","Tarantino contrasts Kay with Tolkienesque sagas and Martin-style marathons: a compact, spare style expressed in stand-alone books or duologies.","c2c","His compact, spare style finds expression in succinct stand-alone books"),
    ("elegiac tone / melancholy of farewells","Tarantino says Kay's writings are suffused with an elegiac tone and the gentle melancholy of farewells, so readers dread the end of the book.","c2c","elegiac tone and the gentle melancholy of farewells")]

# ---- new sources (this pass; second lane's finds re-fetched and read today)
N={
 "gutensohn":("Joyce Gutensohn, 'Songs in the Blood: The Discourse of Music in Three Canadian Novels' — the Tigana chapter (MA thesis, University of Victoria, 2004), reprinted on Bright Weavings",
              "https://brightweavings.com/tiganamusic/","master's thesis chapter",True,os.path.join(R3,"gutensohn.txt")),
 "allard":("James Allard, '\"The Unacknowledged Legislators of the World\": Songs and Poetry in Guy Gavriel Kay's A Song for Arbonne' (University of Waterloo; 1997 Academic Conference on Canadian SF&F)",
           "http://brightweavings.com/legislatorsarbonne/","conference paper",True,os.path.join(R3,"allard.txt")),
 "aardse":("Kent Aardse, 'Postcolonialism in Guy Kay's Tigana' (University of Lethbridge, 2008)",
           "https://brightweavings.com/postcolonialism/","undergraduate paper (thematic; nothing on prose technique)",False,os.path.join(R3,"aardse.txt")),
 "encyc":("'Kay, Guy Gavriel 1954–', Contemporary Authors entry on Encyclopedia.com (Sidelights section quoting Riskind, Speller, Kirkus, Burns, Publishers Weekly, de Lint)",
          "https://www.encyclopedia.com/arts/educational-magazines/kay-guy-gavriel-1954-0","reference synthesis with cited critics",True,os.path.join(R3,"encyc2.txt")),
 "encyc1":("'Kay, Guy Gavriel 1954-', second Contemporary Authors entry on Encyclopedia.com (adds Michelle West, F&SF, on Ysabel)",
           "https://www.encyclopedia.com/arts/educational-magazines/kay-guy-gavriel-1954","reference synthesis with cited critics",True,os.path.join(R3,"encyc1.txt")),
 "camelot":("Raymond H. Thompson, 'Interview with Guy Gavriel Kay' (Mythcon, Vancouver, 30 July 1989), The Camelot Project, Robbins Library, University of Rochester",
            "https://d.lib.rochester.edu/camelot/text/interview-with-guy-gavriel-kay.html","scholarly-archive author interview",True,os.path.join(R2,"camelot1989.txt")),
 "sh2000":("Christopher Cobb and Mary Anne Mohanraj, \"'We must learn to bend, or we break': The Art of Living in Guy Gavriel Kay's Sarantine Mosaic\", Strange Horizons (13 Nov 2000)",
           "https://strangehorizons.com/wordpress/non-fiction/reviews/we-must-learn-to-bend-or-we-break-the-art-of-living-in-guy-gavriel-kays-sarantine-mosaic/","critical review-dialogue",True,os.path.join(R2,"strangehorizons.txt")),
 "wolfe2016":("Gary K. Wolfe, review of Children of Earth and Sky, Locus (June 2016) — live URL returns 403 to WebFetch; read from the earlier lane's saved fetch of the same URL",
              "https://locusmag.com/2016/06/gary-k-wolfe-reviews-guy-gavriel-kay/","critical review (academic critic)",True,os.path.join(R2,"locus-wolfe2016.txt")),
 "boingboing":("Guy Gavriel Kay, 'On the strengths of fiction done as near-history', Boing Boing (1 June 2016) — WebFetch 403; read from a curl fetch made today",
               "https://boingboing.net/2016/06/01/author-guy-gavriel-kay-on-the.html","author essay",True,os.path.join(R3,"boingboing.txt")),
 "bs-orbis":("Sylwia Borowska-Szerszun, 'The limits of the happy ending: Eucatastrophe and cultural memory in Guy Gavriel Kay's Tigana', Orbis Litterarum (4 June 2026) — abstract via Crossref; Wiley page 403",
             "https://doi.org/10.1111/oli.70057","peer-reviewed journal article (abstract only)",False,os.path.join(R3,"crossref-oli.txt")),
 "bs-zenodo":("Sylwia Borowska-Szerszun, 'Między historią a fantazją. Mediewalizm i głos kobiet w Pieśni dla Arbonne', Creatio Fantastica 60.1 (2020) 27-40 — Zenodo record with abstract",
              "https://zenodo.org/records/3597808","journal article (abstract read; Polish PDF not read)",False,None),
 "johnston":("Susan Johnston, 'When Are We Ever at Home? Exile and Nostalgia in the Work of Guy Gavriel Kay', in Canadian Science Fiction, Fantasy, and Horror: Bridging the Solitudes (Palgrave, 2019) 119-133 — Crossref record only; Springer and dokumen.pub 403",
             "https://doi.org/10.1007/978-3-030-15685-5_7","monograph chapter (record only; not read)",False,None),
 "toswell":("M. J. Toswell, ch. 3 'Historical Fantasy: Guy Gavriel Kay', Medievalism in English Canadian Identity and Literature (Arc Humanities Press, Arc Medievalist, 2025) — publisher TOC only",
            "https://www.arc-humanities.org/9781802702675/medievalism-in-english-canadian-identity-and-literature/","monograph chapter (TOC only; not read)",False,os.path.join(R3,"arc-toswell.txt")),
 "doshlova":("M. R. Doshlova, 'Метафорическая картина мира в романе Г. Г. Кея «Тигана»: к проблеме памяти и национальной идентичности' (XIV International Conference of Young Scholars, Yekaterinburg, Feb 2026, pp. 1237-1244; Ural Federal University archive)",
             "https://elar.urfu.ru/handle/10995/151646","conference paper (Russian; PDF read in full)",True,os.path.join(BASE,"doshlova-tigana.txt")),
 "doshlova2":("M. R. Doshlova, 'Диалектика метафор «памяти» и «забвения» в романе Г. Г. Кея «Тигана»' (Language and Intercultural Communication conf., Pinsk, May 2026, pp. 75-78; Polessky State University repository)",
              "https://rep.polessu.by/handle/123456789/35977","conference article (abstract read)",False,os.path.join(R3,"polessu.txt")),
 "walsh":("Kathleen Susan Maeve Walsh, 'Drifting from the pattern: the changing treatment of religion in the novels of Guy Gavriel Kay' (MA thesis, University of Victoria, 1994) — repository abstract",
          "https://hdl.handle.net/1828/20033","master's thesis (abstract read)",False,os.path.join(R3,"walsh.txt")),
 "stopa":("Jacek Stopa, 'Prawda czasu, prawda fantazji – historia a literatura fantasy', in Tekstowe światy fantastyki (Białystok: Prymat, 2017) — Kay passage read from the repository PDF",
          "https://repozytorium.uwb.edu.pl/jspui/bitstream/11320/6107/1/J_Stopa_Prawda_czasu_prawda_fantazji_%E2%80%93_historia_a_literatura_fantasy.pdf","monograph chapter (Polish)",True,os.path.join(BASE,"stopa-2017.txt")),
 "wilson2009":("Anna Wilson, 'Loving the Past: In defence of historical RPF' (blog, 23 Aug 2009) — a response quoting Kay's ICFA 2009 Guest of Honor speech 'The Fiction of Privacy' (the speech itself, JFA 20.2, is not online; Locus report 403)",
               "http://goingmedievalthere.blogspot.com/2009/08/in-defence-of-historical-rpf-real.html","blog response (secondary witness to the speech)",False,os.path.join(R3,"wilson2009.txt")),
 "ff-barnard":("Ashley Barnard, 'The World of Guy Gavriel Kay', Fantasy-Faction (2011)",
               "https://fantasy-faction.com/2011/the-world-of-guy-gavriel-kay","fan-site survey essay",False,os.path.join(R2,"ff-barnard.txt")),
 "campbell":("Narelle Campbell, 'Now and then: traces of the present in medievalist fantasy fiction' (PhD thesis, University of Wollongong, 2013; Fionavar + Nix) — repository 403",
             "https://ro.uow.edu.au/articles/thesis/Now_and_then_traces_of_the_present_in_medievalist_fantasy_fiction/27662556","doctoral thesis (blocked, not read)",False,None),
 "mendlesohn":("Farah Mendlesohn, Rhetorics of Fantasy (Wesleyan, 2008) — Google Books in-book search for 'Tigana' returned no snippets; Kay discussion known only via Rettino's application of the club-story/portal-quest argument",
               "https://books.google.com/books?id=oLyi9lQH3OgC&q=Tigana","monograph (not read)",False,None),
 "sfe":("Encyclopedia of Fantasy (Clute & Grant) entry 'Kay, Guy Gavriel' — 429/404 on every attempt",
        "https://sf-encyclopedia.com/fe/kay_guy_gavriel","encyclopedia entry (blocked, not read)",False,None),
 "locus2009":("'Any human heart', Locus Online (March 2009) — report on Kay's ICFA 2009 GoH speech; 403 and Wayback unreachable",
              "https://locusmag.com/2009/03/any-human-heart/","conference report (blocked, not read)",False,None),
 "jfa2009":("Gary K. Wolfe, 'Guy Gavriel Kay: An Introduction', Journal of the Fantastic in the Arts 20.2 (2009) 238; and Guy Gavriel Kay, 'The Fiction of Privacy: Fantasy and the Past', JFA 20.2 (2009) 240 — JSTOR issue TOC only",
            "https://www.jstor.org/stable/i24352238","journal issue TOC (not read)",False,None),
 "poulain":("Emmanuelle Poulain-Gautret, 'Les Dieux anciens chez Guy Gavriel Kay', in Merveilleux et spiritualité, ed. M. White-Le Goff (PUPS, 2014) 229-240 — citation only",
            "https://pro.univ-lille.fr/emmanuelle-poulain-gautret/publications","book chapter (citation only; not read)",False,None),
 "openalex":("OpenAlex API roster of works about Guy Gavriel Kay (used to locate Doshlova x2, Walsh, Stopa, Campbell, Toswell, Wolfe JFA, Poulain-Gautret)",
             "https://api.openalex.org/works?search=%22Guy%20Gavriel%20Kay%22&per-page=50","bibliographic API (roster only)",False,None),
}
S.update(N)
C+=[
 # Gutensohn 2004
 ("music as textual code","Gutensohn argues that in Tigana music rather than magic is the prevalent textual code indexing the fantasy world, so musical discourse rather than spell-craft signals narrative sequence and character.","gutensohn","music rather than magic is the more prevalent textual code"),
 ("musical imagery in the Prologue","Gutensohn notes musical imagery is woven into the Prologue as the sign that music will structure the novel.","gutensohn","musical imagery is woven into the Prologue"),
 ("harmonizing voices as foreshadowing","Gutensohn reads the 'harmonizing voices' of the opposing armies in the Prologue as foreshadowing the political unity of the ending.","gutensohn","harmonizing voices"),
 ("vocal range as characterisation","Gutensohn observes Catriana is characterised through description of her vocal range rather than the music she performs.","gutensohn","revealed through description of her vocal range"),
 ("melody as identification element","Gutensohn shows a wordless cradle-song melody functions as an identification element among Tigana-born exiles.","gutensohn","functioning as an identification element"),
 # Allard 1997
 ("convention made self-conscious","Allard says Kay uses the embedded-song convention so that it draws attention to itself as a convention, mapping its possibilities rather than deconstructing it.","allard","draws attention to itself as a convention"),
 ("songs beyond exposition","Allard notes songs and poetry in Arbonne are not simply means of conveying historical and cultural information, though they do that too.","allard","not simply means of conveying historical and cultural information"),
 ("language as cue, not act","Allard argues Arbonne shows language as at most a blueprint for action that acts only as a cue; words can never exist as actions.","allard","acts only as a cue for action"),
 ("troubadours, not songs, hold power","Allard notes it is the troubadours who have real physical power, not their songs, inverting the usual fantasy formula.","allard","it is the troubadours that have power"),
 # Encyclopedia.com (Contemporary Authors)
 ("psychological characters and ambience","Riskind (Washington Post Book World, via Contemporary Authors) credits Kay with complex psychological characters and a rich sense of ambience, place and time.","encyc","complex psychological characters and a rich sense of ambience"),
 ("heavy prose (criticism)","Kirkus (via Contemporary Authors) complained of The Darkest Road that even the prose weighs a ton and the intricate layering produces a density often impenetrable.","encyc","Even the prose weighs a ton"),
 ("chiaroscuro of magic","Burns (Quill & Quire, via Contemporary Authors) describes Sarantium's magic as adding the chiaroscuro of pagan blood-worship to a tale about a people afraid of the dark.","encyc","the chiaroscuro of pagan blood-worship"),
 ("art-and-religion description","Publishers Weekly (via Contemporary Authors) finds Kay at his best describing the intertwining of art and religion and explicating mosaic craft.","encyc","the intertwining of art and religion"),
 ("gift with language (de Lint)","De Lint (F&SF, via Contemporary Authors) credits Lord of Emperors with Kay's sheer gift with language.","encyc","Kay's sheer gift with language"),
 ("memory, elegy, romantic love","Michelle West (F&SF, via Contemporary Authors) says Kay plays along the edges of memory, elegy, and romantic love.","encyc1","edges of memory, elegy, and romantic love"),
 # Camelot Project 1989
 ("restraint as sonnet-form","Kay tells Thompson that using the Arthurian motifs imposed the same kind of restraint a sonnet imposes on a writer.","camelot","the same kind of restraint that a sonnet imposes"),
 ("gemstone in a setting","Kay describes fitting the Arthurian story into Fionavar like a gemstone in a setting.","camelot","like a gemstone in a setting"),
 ("guarding against mythic overbalance","Kay says he was in danger of overbalancing his narrative with mythic, iconographic figures and deliberately limited them.","camelot","overbalancing my narrative with mythic, iconographic figures"),
 ("earned surprise","Kay aims for moments where the reader is caught, then says 'I shouldn't have been surprised, but I was'.","camelot","I shouldn't have been surprised, but I was"),
 ("early prose he would polish","Kay says he became more assured as the trilogy progressed and would polish the prose of the opening chapters.","camelot","I might polish the prose itself"),
 # Strange Horizons 2000
 ("repeated image reworked","Cobb and Mohanraj note Kay repeats an image (the rose) from book to book but reworks it to vary its impact and meaning, making the work itself like a mosaic.","sh2000","reworks it to vary the impact and meaning"),
 ("trajectory toward historical realism","Cobb finds the Sarantine Mosaic much less idealized in its approach to history, part of a trajectory away from high fantasy.","sh2000","much less idealized in its approach to history"),
 ("loose plot focus (criticism)","Cobb concedes the Mosaic's plot isn't always tightly focused because Kay spends more time on characters and cultures.","sh2000","the plot isn't always tightly focused"),
 ("love for the spectacle of the world","The reviewers characterise the books' tone as an unwearying spirit of love for the spectacle of the world.","sh2000","unwearying spirit of love for the spectacle of the world"),
 # Wolfe 2016
 ("tactically restrained supernatural","Wolfe says Kay's use of supernatural elements is deliberately, even tactically, restrained; ghosts serve as conduits of otherwise unavailable information, as in Shakespeare.","wolfe2016","deliberately, even tactically, restrained"),
 ("harmonic not melodic constraints","Wolfe says Kay is as constrained by research as he wants to be, the constraints being more harmonic than melodic: improvisation up to a defined point.","wolfe2016","more harmonic than melodic"),
 ("depth for walk-on figures","Wolfe credits Kay with a remarkable gift for lending surprising depth to even walk-on figures.","wolfe2016","surprising depth to even walk-on figures"),
 ("ingenuity kept just short of excess","Wolfe notes the threads merge ingeniously, always just a bit short of seeming too ingenious.","wolfe2016","always just a bit short of seeming too ingenious"),
 ("amalgam / tapestry method","Wolfe adopts Kay's own word 'amalgam' for the renaming-and-rebranding of actual events, places and characters.","wolfe2016","renaming and essentially rebranding actual events"),
 # Kay, Boing Boing 2016
 ("near-history definition","Kay defines his mode as nearly our known history but not quite, a spin or quarter turn to the fantastic.","boingboing","Nearly our known history, but not quite"),
 ("intuition, not plan","Kay warns readers to be skeptical when writers present intuitive processes as thought-out planning; the quarter turn was an evolution.","boingboing","be skeptical when writers present intuitive processes"),
 ("Tigana loosely tied","Kay says Tigana was far more loosely tied to real places and events than the books from Arbonne on.","boingboing","far more loosely tied to real places and events"),
 ("tighten focus on themes","Kay says invented settings let him work with history but tighten focus on themes and have characters be what he needs.","boingboing","work with history but tighten focus on themes"),
 ("light touch on the thought-experiment","Kay says he tried to do the Arbonne reversal lightly, letting each reader go as far as they wish; each reader makes the book they read.","boingboing","each reader makes the book they read"),
 ("refusing invented interiority for real men","Kay did not want to give real men invented personalities, relationships, desires and thoughts imposed on them.","boingboing","giving real men invented personalities"),
 ("interactions not ideologies","Kay changed the three religions to explore interactions not ideologies and detach readers from assumptions.","boingboing","explore interactions not ideologies"),
 ("telescoped Reconquista","Kay telescoped the Reconquista in Lions so a culture's demise plays out in one or two generations.","boingboing","I telescoped the Reconquista in Lions"),
 ("magic as cynical tool in Arbonne","Kay says Arbonne has almost nothing fantastical; magic is treated as a false, cynical tool of organized faiths.","boingboing","treated as a false, cynical 'tool' of organized faiths"),
 ("starter bibliographies","Kay always includes starter bibliographies so readers may go on to non-fiction.","boingboing","I always include starter bibliographies"),
 # Borowska-Szerszun Orbis Litterarum 2026 (abstract)
 ("eucatastrophe with limits of recovery","Borowska-Szerszun's abstract argues Tigana's eucatastrophe operates as a mode of cultural memory enabling collective reconstitution while preserving the limits of recovery.","bs-orbis","preserving the limits of recovery"),
 # Doshlova 2026
 ("three metaphors as one system","Doshlova argues the central metaphors of Tigana — the lost name, distorted memory, music — form an integral artistic system representing identity's formation, loss and recovery.","doshlova","образуют целостную художественную систему"),
 ("memory as burden, wound and debt","Doshlova reads the oath passage as giving memory a bodily dimension: burden, wound and debt at once.","doshlova","раной и долгом одновременно"),
 ("music as alternative channel of memory","Doshlova reads music and sound as an alternative channel for transmitting cultural memory past the spell, art as repository of identity.","doshlova","альтернативный канал передачи культурной памяти"),
 ("naming inverted against Attebery","Doshlova sets Tigana against Attebery's fantasy formula that power lies in the true name: here power lies with the one who erases it (paraphrase; no verbatim quote kept).","doshlova",""),
 ("memory/oblivion dialectic","Doshlova's second paper treats forced oblivion as a tool of cultural destruction and the name as the node of collective and individual memory (abstract only).","doshlova2",""),
 # Walsh 1994
 ("ironic heroic quest","Walsh's abstract reads Tigana's ironic treatment of the heroic quest as showing at once the futility and valour of human morality.","walsh","Tigana's ironic treatment of the heroic quest"),
 ("from mythic drama toward reality","Walsh traces Kay moving from grand mythic drama to a context more closely connected to reality, humanity dislocated from the divine.","walsh","moves from grand mythic drama"),
 # Stopa 2017
 ("alternative rather than altered history","Stopa says Kay does not so much change history as create an alternative to it (Arbonne saving a fairy-tale counterpart of doomed Languedoc).","stopa","nie tyle więc zmienia historię, co tworzy dla niej alternatywę"),
 ("fictional nature declared at the outset","Stopa praises Kay's work because its fictional nature is revealed to the reader at the outset by the author himself.","stopa","fikcyjna natura zostaje już na wstępie objawiona"),
 ("discomfort ascribing words to real people","Stopa reports Kay's stated reason for not writing straight historicals: discomfort ascribing thoughts and words of his own authorship to people who really lived.","stopa","przypisując faktycznie żyjącym niegdyś osobom myśli i słowa"),
 # Wilson 2009 (witness to the ICFA speech)
 ("entitlement to the lives of others","Wilson reports Kay's ICFA speech diagnosing an erosion of privacy and a widespread sense of entitlement to look at or make use of the lives of others, his reason for renaming.","wilson2009","sense of entitlement to look at"),
 # Fantasy-Faction
 ("lyrical without being flowery","Barnard characterises Kay's prose as lyrical without being flowery.","ff-barnard","lyrical without being flowery"),
]

def norm(s):
    s=(s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"').replace("–","-").replace("—","-").replace(" "," ").replace("«",'"').replace("»",'"'))
    s=re.sub(r"\s+"," ",s)
    s=re.sub(r"(\w) ?- (\w)",r"\1\2",s)                 # PDF soft-hyphen artefacts
    s=re.sub(r"(\w) ([ąćęłńóśźż])",r"\1\2",s)             # PDF-split Polish diacritics
    return s.lower()
texts={}
for k,(t,u,kind,sub,f) in S.items():
    if f:
        p=f if f.startswith("/") else os.path.join(RAW,f)
        texts[k]=norm(open(p,encoding="utf-8",errors="replace").read()) if os.path.exists(p) else ""
        if not texts[k]: print("WARN no text for",k,p)
bad=[]
for feat,claim,src_,q in C:
    assert src_ in S, src_
    n=len(q.split())
    if q and n>=12: bad.append(("LONG",feat,n,q))
    if q and texts.get(src_) and norm(q) not in texts[src_]: bad.append(("MISS",feat,src_,q))
    if q and not texts.get(src_): bad.append(("NOCHECK",feat,src_,q))
if bad:
    for b in bad: print(b)
    sys.exit(1)
claims=[{"feature":f,"claim":c,"source":S[s][0],"url":S[s][1],"quote":q} for f,c,s,q in C]
sources=[{"title":t,"url":u,"kind":k,"substantive":sub} for (t,u,k,sub,f) in S.values()]
json.dump({"claims":claims,"sourcesRead":sources},open(os.path.join(BASE,"found-kay-academic.json"),"w"),ensure_ascii=False,indent=1)
print("claims",len(claims),"sources",len(sources),"substantive",sum(1 for s in sources if s["substantive"]))
