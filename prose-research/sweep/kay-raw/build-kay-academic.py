#!/usr/bin/env python3
"""Build find-kay-academic.md (raw notes) and found-kay-academic.json (checkpoint).
Every non-empty quote is verified verbatim (after quote/whitespace normalisation)
against the locally fetched text of its source; the script aborts on any miss."""
import json, os, re, sys

BASE = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep"
RAW = os.path.join(BASE, "kay-raw", "clean")

# key -> (title, url, kind, substantive, local text file or None)
S = {
 "randall": ("Neil Randall, 'Shifting Focalization and the Strategy of Delay: The Narrative Weaving of The Fionavar Tapestry', Canadian Literature 129 (Summer 1991), reprinted on Bright Weavings",
             "https://brightweavings.com/randallfionavar/", "peer-reviewed journal article (reprint)", True, "randall.txt"),
 "kleander": ("Anya Kleander, 'Present Reality in Historical Fantasy' (Honours dissertation, University of Stirling, 2008)",
              "https://brightweavings.com/presentreality/", "undergraduate dissertation", True, "kleander.txt"),
 "rettino": ("Matthew Rettino, 'Fantasies of History: Guy Gavriel Kay's Synthesis of the Historical Fantasy Novel' (Honours thesis, McGill University, 2012)",
             "https://brightweavings.com/fantasies-of-history-guy-gavriel-kays-synthesis-of-the-historical-fantasy-novel/", "undergraduate honours thesis", True, "rettino.txt"),
 "rettino-blog": ("Matthew Rettino, 'History as Fantasy: My Honours Thesis on Guy Gavriel Kay Summarized' (blog, 2013-04-29)",
                  "https://matthewrettino.com/2013/04/29/history-as-fantasy-my-honours-thesis-on-guy-gavriel-kay-summarized/", "blog summary of thesis", False, None),
 "cobb": ("Christopher Cobb, 'Guy Gavriel Kay and the Psychology of History', Foundation (Summer 2005), reprinted on Bright Weavings",
          "https://brightweavings.com/hspsychologyhistory/", "peer-reviewed journal article (reprint)", True, "cobb.txt"),
 "toyryla": ("Roosa Töyrylä, 'Ambiguities and Divided Loyalties: Focalization in Guy Gavriel Kay's Tigana' (BA thesis, University of Helsinki, 2017)",
             "https://brightweavings.com/ambiguities-and-divided-loyalties-focalization-in-guy-gavriel-kays-tigana/", "bachelor's thesis", True, "toyryla.txt"),
 "webb1991": ("Janeen Webb, 'Myth and the New High Fantasy: Guy Gavriel Kay's Tigana', The Ring Bearer 8.2 (Spring 1991)",
              "https://brightweavings.com/webbtigana/", "journal article (Mythopoeic Literature Society of Australia)", True, "webbtigana.txt"),
 "webb1995": ("Janeen Webb, 'Post-Romantic Romance: Guy Gavriel Kay's Tigana and A Song for Arbonne', New York Review of Science Fiction 77 (Jan 1995)",
              "https://brightweavings.com/webbarbonne/", "critical essay (NYRSF)", True, "webbarbonne.txt"),
 "ordway": ("Holly E. Ordway, 'The World-Building of Guy Gavriel Kay' (UMass Amherst independent study, 1998; presented at the 1998 Academic Conference on Canadian SF&F)",
            "https://brightweavings.com/worldbuilding/", "conference paper", True, "ordway-wb.txt"),
 "gunn": ("James Gunn, 'The Other Side of the Mirror: Tigana' (introduction to the Easton Press edition, 1998)",
          "https://brightweavings.com/the-other-side-of-the-mirror-tigana/", "critical introduction (cites Encyclopedia of Fantasy, St James Guide)", True, "mirror-tigana.txt"),
 "taylor-lions": ("Dena Taylor, 'Three Glasses of Wine: The Accommodation of Culture in The Lions of Al-Rassan' (Babel Handbooks/Nimrod Press chapter)",
                  "https://brightweavings.com/denalions/", "critical essay", True, "dena-lions.txt"),
 "taylor-sailing": ("Dena Taylor, 'On Sailing to Sarantium', TransVersions 10 (1999)",
                    "https://brightweavings.com/denasailing/", "critical review-essay", True, "dena-sailing.txt"),
 "malosse": ("Pierre-Louis Malosse, 'Justinien visité et revisité', Anabases 5 (2007) 229-235, English translation by Morgon Mills",
             "https://brightweavings.com/justinian-visited-and-revisited/", "peer-reviewed journal article (translation)", True, "justinian.txt"),
 "ringel": ("Faye Ringel, 'Kay's Provence: From Arbonne to Ysabel' (ICFA 2009 / Anticipation 2009 paper)",
            "https://brightweavings.com/kaysprovence/", "conference paper", True, "ringel.txt"),
 "hatch": ("Jillian Hatch, 'The Creative Construction of History in Guy Gavriel Kay's The Sarantine Mosaic' (University of Calgary undergraduate paper, 2005)",
           "https://brightweavings.com/creative_history/", "undergraduate paper", True, "hatch.txt"),
 "bs-romance": ("Sylwia Borowska-Szerszun, 'Remembering the Romance: Medievalist Romance in Fantasy Fiction by Guy Gavriel Kay and Charles de Lint', in Medievalism in English Canadian Literature (Boydell & Brewer, 2020), pp. 155-171 — abstract page",
                "https://www.cambridge.org/core/books/abs/medievalism-in-english-canadian-literature/remembering-the-romance-medievalist-romance-in-fantasy-fiction-by-guy-gavriel-kay-and-charles-de-lint/BCD555D514EC39CF190DEEAC896686A8", "monograph chapter (abstract only, paywalled)", False, "cambridge-rr.txt"),
 "bs-ceeol": ("Sylwia Borowska-Szerszun, 'Między historią a fantazją. Mediewalizm i głos kobiet w Pieśni dla Arbonne', Creatio Fantastica 60.1 (2019) 27-40 — CEEOL abstract",
              "https://www.ceeol.com/search/article-detail?id=819567", "journal article (abstract only; Polish)", False, "ceeol.txt"),
 "bs-faire": ("Sylwia Borowska-Szerszun, 'Faire Ladies Re-Imagined: Female Characters in A Song for Arbonne' (Tekstowe światy fantastyki, 2017) — abstract on Bright Weavings",
              "https://brightweavings.com/faire-ladies-re-imagined-female-characters-in-guy-gavriel-kays-a-song-for-arbonne-by-sylwia-borowska-szerszun/", "chapter abstract", False, "faire-ladies.txt"),
 "bs-gods": ("Sylwia Borowska-Szerszun, 'When Gods are Absent from Fantasy: Religion and Spiritual Experience in The Lions of Al-Rassan and The Sarantine Mosaic' (The Light of Life, 2017/2021) — abstract on Bright Weavings; UWB repository PDF is image-only",
             "https://brightweavings.com/when-gods-are-absent-from-fantasy-religion-and-spiritual-experience-in-guy-gavriel-kays-the-lions-of-al-rassan-and-the-sarantine-mosaic-by-sylwia-borowska-szerszun/", "chapter abstract", False, "gods-absent.txt"),
 "bs-tf": ("Sylwia Borowska-Szerszun, 'The other Middle Ages: Cultural memory and alterity in The Lions of Al-Rassan', in Significant Others (Routledge, 2021), ch. 3 — landing page only",
           "https://www.taylorfrancis.com/chapters/edit/10.4324/9781003023906-3/middle-ages-sylwia-borowska-szerszun", "monograph chapter (paywalled; page returned navigation only)", False, None),
 "cawsey-dal": ("Kathy Cawsey, 'Magic and Realism: An Interview with Guy Gavriel Kay', The Dalhousie Review (2021), pp. 307-317",
                "https://ojs.library.dal.ca/dalhousiereview/article/view/11332/10100", "journal interview with critical introduction (PDF)", True, "dalhousie.txt"),
 "cawsey-abs": ("Kathy Cawsey, 'The Once and Future Childslayer: Guy Gavriel Kay's Inversion of Malory's Morte Darthur' — abstract on Bright Weavings",
                "https://brightweavings.com/the-once-and-future-childslayer-by-kathy-cawsey/", "article abstract", False, "cawsey.txt"),
 "home-away": ("Guy Gavriel Kay, 'Home and Away' (keynote essay; shorter version in The Globe and Mail, fall 1999) — Wayback copy of the Bright Weavings text",
               "https://web.archive.org/web/20081016010636id_/http://www.brightweavings.com/ggkswords/globe.htm", "author essay", True, "home-away-wb.txt"),
 "writing-advice": ("Guy Gavriel Kay, 'Some Writing Advice: Don't Take Others' Advice' (LitHub 2019, reprinted on Bright Weavings)",
                    "https://brightweavings.com/some-writing-advice-dont-take-others-advice/", "author essay (process, not prose)", False, "writing-advice.txt"),
 "hnr": ("Teresa Basinski Eckford, 'Parallel Universes: Guy Gavriel Kay reflects on twenty years of alternative history', Historical Novels Review (Nov 2004)",
         "https://brightweavings.com/hsparalleluniverses/", "author interview", True, "hsparallel.txt"),
 "larb": ("Christine Fischer Guy, 'The Fantastic Worlds of Guy Gavriel Kay', Los Angeles Review of Books (2016-08-14)",
          "https://lareviewofbooks.org/article/fantastic-worlds-guy-gavriel-kay/", "author interview", True, "larb.txt"),
 "clarkesworld": ("Chris Urie, 'The Quarter Turn of History: A Conversation with Guy Gavriel Kay', Clarkesworld 117 (June 2016) — read via Wayback copy (live site is behind a JS challenge)",
                  "https://clarkesworldmagazine.com/kay_interview/", "author interview", True, "cw-archive.txt"),
 "locus": ("'Guy Gavriel Kay: Margins of History', Locus (May 2025 excerpt) — read via Wayback copy",
           "https://locusmag.com/feature/guy-gavriel-kay-margins-of-history/", "author interview", True, "locus-wb.txt"),
 "tor2016": ("'How Guy Gavriel Kay Mashes Up Real Events and People Into Alternate History Fantasy', Tor.com (2016-04-29; io9 interview digest) — read via Wayback copy",
             "https://reactormag.com/2016/04/29/guy-gavriel-kay-alternate-history-research", "author interview digest", True, "reactor-kay-wb.txt"),
 "psychopomp": ("'A Conversation With Guy Gavriel Kay', Psychopomp.com (c. 2008)",
                "https://psychopomp.com/fantasy/miscellaneous/a-conversation-with-guy-gavriel-kay/", "author interview (read by keyword extraction only)", True, "psychopomp.txt"),
 "vector": ("Niall Harrison, 'Under Heaven' (review), Vector / BSFA (2010-08-18)",
            "https://vector-bsfa.com/2010/08/18/under-heaven/", "critical review", True, "vector-uh.txt"),
 "walton-sar": ("Jo Walton, 'Mosaics and charioteers: Guy Gavriel Kay's Sarantine Mosaic', Tor.com/Reactor (2009-11-02)",
                "https://reactormag.com/mosaics-and-charioteers-guy-gavriel-kays-sarantine-mosaic/", "critical essay", True, "walton-sarantine.txt"),
 "walton-arb": ("Jo Walton, 'Provencal Fantasy: Guy Gavriel Kay's A Song for Arbonne', Tor.com/Reactor (2010-08-06)",
                "https://reactormag.com/provencal-fantasy-guy-gavriel-kays-a-song-for-arbonne/", "critical essay", True, "walton-arbonne.txt"),
 "palmatier": ("Joshua Palmatier, 'Altering the Familiar: Tigana by Guy Gavriel Kay', Tor.com/Reactor (2016-07-06)",
               "https://reactormag.com/altering-the-familiar-tigana-by-guy-gavriel-kay/", "writer's craft essay", True, "walton-tigana.txt"),
 "c2c": ("Bob Tarantino, 'The fantastic fiction of Guy Gavriel Kay', C2C Journal (2016-09-07)",
         "https://c2cjournal.ca/2016/09/the-fantastic-fiction-of-guy-gavriel-kay/", "critical essay (read via WebFetch summary only)", True, None),
 "rowanwood": ("Chris McBean, 'Fantasy as Memory: The Historical Imagination of Guy Gavriel Kay', The Rowanwood Chronicles (blog, 2025-12-24)",
               "https://therowanwoodchronicles.blog/2025/12/24/fantasy-as-memory-the-historical-imagination-of-guy-gavriel-kay/", "uncited blog essay (WebFetch summary only)", False, None),
 "litstack": ("J.S. Hood, 'The Lions of Al-Rassan: A Masterclass in Weaving the Slow Burn', LitStack (2026-05-30)",
              "https://www.litstack.com/the-lions-of-al-rassan-by-guy-gavriel-kay/", "review", True, "litstack.txt"),
 "wiki-kay": ("Wikipedia: Guy Gavriel Kay", "https://en.wikipedia.org/wiki/Guy_Gavriel_Kay", "encyclopedia article (no style/reception content)", False, "wiki-kay.txt"),
 "wiki-ceas": ("Wikipedia: Children of Earth and Sky (Reception section citing Hobbs, Wolfe, Kirkus, Capossere/Jones, Alexander)", "https://en.wikipedia.org/wiki/Children_of_Earth_and_Sky", "encyclopedia article with cited critics", True, "wiki-ceas.txt"),
 "wiki-brightness": ("Wikipedia: A Brightness Long Ago (Reception citing Domise, Wolfe, Capossere/Jones, Alexander, Kirkus)", "https://en.wikipedia.org/wiki/A_Brightness_Long_Ago", "encyclopedia article with cited critics", True, "wiki-brightness.txt"),
 "wiki-sarantine": ("Wikipedia: The Sarantine Mosaic (Reception citing Charles de Lint; Further reading Borowska-Szerszun)", "https://en.wikipedia.org/wiki/The_Sarantine_Mosaic", "encyclopedia article with cited critics", True, "wiki-sarantine.txt"),
 "wiki-uh": ("Wikipedia: Under Heaven (novel) (author's letter; Reception citing Wiersema, Dirda)", "https://en.wikipedia.org/wiki/Under_Heaven_(novel)", "encyclopedia article with cited critics", True, "wiki-uh.txt"),
 "wiki-lastlight": ("Wikipedia: The Last Light of the Sun (Reception citing Hromic, Dusmann)", "https://en.wikipedia.org/wiki/The_Last_Light_of_the_Sun", "encyclopedia article with cited critics", True, "wiki-lastlight.txt"),
 "wiki-lions": ("Wikipedia: The Lions of Al-Rassan (Major themes citing Ordway, Taylor, Kilheffer)", "https://en.wikipedia.org/wiki/The_Lions_of_Al-Rassan", "encyclopedia article", False, "wiki-lions.txt"),
 "wiki-tigana": ("Wikipedia: Tigana", "https://en.wikipedia.org/wiki/Tigana", "encyclopedia article (plot/riselka only)", False, "wiki-tigana.txt"),
 "wiki-arbonne": ("Wikipedia: A Song for Arbonne", "https://en.wikipedia.org/wiki/A_Song_for_Arbonne", "encyclopedia article", False, "wiki-arbonne.txt"),
 "wiki-ysabel": ("Wikipedia: Ysabel", "https://en.wikipedia.org/wiki/Ysabel", "encyclopedia article", False, "wiki-ysabel.txt"),
 "wiki-fionavar": ("Wikipedia: The Fionavar Tapestry", "https://en.wikipedia.org/wiki/The_Fionavar_Tapestry", "encyclopedia article", False, "wiki-fionavar.txt"),
 "bw-prof": ("Bright Weavings — Professional Scholarship index (roster of published criticism on Kay)", "https://brightweavings.com/scholarship/professional-scholarship/", "bibliographic index", False, "prof-schol.txt"),
 "bw-student": ("Bright Weavings — Student Papers index (theses and papers on Kay)", "https://brightweavings.com/scholarship/student-papers/", "bibliographic index", False, "student-papers.txt"),
 "jstor-jfa": ("Journal of the Fantastic in the Arts 13.2 (2002) issue page — contains 'Paradigms of Colonization: Exploring Themes of Imperialism in Guy Gavriel Kay's Tigana' (author not retrievable; JSTOR blocked the fetch)",
               "https://www.jstor.org/stable/i40131613", "journal issue TOC (blocked, not read)", False, None),
 "core-weaver": ("'The weaver at the loom: A discussion of Guy Gavriel Kay's use of myth and legend in The Fionavar Tapestry' (thesis record on CORE; 403 on fetch)",
                 "https://core.ac.uk/works/8030170", "thesis record (blocked, not read)", False, None),
 "jadslight": ("Andrew Patton, 'We See by Jad's Light Alone: Guy Gavriel Kay and the New Sanctuary Mosaicist' (in-world parody scholarship, 'Sarantine Letters')",
               "https://brightweavings.com/jadslight/", "satirical faux-scholarship (not citable as criticism)", False, "jadslight.txt"),
 "taylor-fionavar": ("Dena Taylor, 'The Double-Edged Gift: Power and Moral Choice in The Fionavar Tapestry'", "https://brightweavings.com/denafionavar/", "critical essay (keyword-scanned only; thematic, nothing on prose)", False, "dena-fionavar.txt"),
 "doherty": ("John J. Doherty, 'The High Fantasies of Lawhead and Kay' (from 'Arthurian Fantasy, 1980-1989')", "https://brightweavings.com/doherty/", "critical survey (keyword-scanned; Arthurian content, nothing on Kay's prose)", False, "doherty.txt"),
 "clements": ("Susannah Clements, 'From Middle Earth to Fionavar: Free Will and Sacrifice' (Conference on Christianity and Literature 2002)", "https://brightweavings.com/clementsfionavarlotr/", "conference paper (keyword-scanned; thematic)", False, "clements.txt"),
 "tondi": ("Mirco Tondi, 'La mitologia, fonte di consapevolezza e ispirazione' (Fantasy Magazine) — English synopsis", "https://brightweavings.com/tondi_synopsis/", "synopsis of Italian article", False, "tondi.txt"),
 "nath": ("Nathalie Labrousse-Marchau, 'A Song for Arbonne: De-romanticised fantasy' (English translation)", "https://brightweavings.com/nath_arbonne/", "reader essay (keyword-scanned)", False, "nath.txt"),
 "medievalists": ("Medievalists.net review of Children of Earth and Sky (2016-06)", "https://www.medievalists.net/2016/06/book-review-children-of-earth-and-sky-guy-gavriel-kay/", "review (keyword-scanned)", False, "medievalists-ceas.txt"),
}

# claims: (feature, claim, source-key, quote)
C = [
 # --- Randall 1991 (Canadian Literature) ---
 ("shifting-focalization density", "Randall counts that only three chapters of the Fionavar Tapestry are focalized through a single character while chapter 8 of The Summer Tree shifts focalization twenty-one times in twenty-four pages, which he reads as strategy rather than ineptness.", "randall", "shifts focalization twenty-one times"),
 ("focalizant roster", "Randall counts twenty-six distinct focalizants in the trilogy plus, in a very few places, an unspecified omniscient focalizant.", "randall", "employs twenty-six different agents of focalization (focalizants)"),
 ("Victorian / Dunnett lineage", "Randall places Kay's multi-focalized technique with the richly populated Victorian novel and the thick historical novel of Dorothy Dunnett rather than with single-focalizer fantasies like Tolkien, Donaldson or Wolfe.", "randall", "closest correlation is to the thick historical novel"),
 ("four effects of shifting focalization", "Randall argues the shifts (1) let the reader assimilate the secondary world, (2) build knowledge of character, (3) move the story from kernel to kernel, and (4) delay the unfolding of each plot-line, all serving a rhetoric of grandeur and scope.", "randall", "the shifts delay the unfolding of the story"),
 ("strategy of delay", "Randall shows Darien's climactic line being deferred: his maturation is postponed by six other kernels across sixty pages, and during his search for Rakoth the narrative shifts focalization eighty-seven times with Darien as focalizant only nine.", "randall", "shifts focalization eighty-seven times, with Darien as focalizant only nine"),
 ("register contrast: plain vs high style", "Randall contrasts Darien's death (short sentences, concrete description, matter-of-fact tone, strictly focalized) with the zero-focalized 'high style' of the Arthurian departure, arguing the register tracks who is perceiving.", "randall", "Sentences are short, description is concrete."),
 ("high-style set pieces", "Randall notes that Kevin's death, Paul's death on the Summer Tree, Diarmuid's death and the Arthurian departure are written as an obvious attempt at rhetorical high style, i.e. myth-in-the-making passages.", "randall", "an obvious attempt at rhetorical"),
 ("pathos / sentimental register", "Randall reads the Darien plot as carried by a rhetoric of the sentimental, with attempts at child-like thought and pathos in both the classical and common senses.", "randall", "contains a rhetoric of the sentimental"),
 ("typographic sectioning", "Randall documents the trilogy's hierarchy of Book > Chapter > Section (marked by a graphic symbol from the jacket painting) > Subsection (marked by blank space), the units within which focalization shifts occur.", "randall", "Sections are distinguished by a graphic symbol"),
 ("tightly-knit kernels, no off-stage surprise", "Randall contrasts Kay with Tolkien's off-stage Aragorn: Kay keeps important events from surprising the reader by shifting attention among characters far more frequently.", "randall", "determined not to have important events surprise us"),
 ("zero focalization used sparingly", "Randall identifies the few zero-focalized (omniscient) passages as the mythic set pieces perceived by no character, e.g. the Arthurian trio's departure.", "randall", "shifts to an unspecified focalizant, to omniscience"),
 # --- Kleander 2008 ---
 ("focalization census (Tigana)", "Kleander's count: twenty-one focalizants and more than 150 focalizations in Tigana, Devin focalized forty-one times, Dianora twenty-seven, plus twenty-one separate non-focalized passages.", "kleander", "twenty-one separate focalizants in Tigana, and more than 150 separate focalizations"),
 ("delayed counter-focalizant", "Kleander shows Part One's twenty-two focalizations (twelve through Devin) uphold a simple good/evil quest before Part Two hands nine of twelve sections to Dianora and demolishes the image of Brandin as evil.", "kleander", "made up of twenty-two separate focalizations"),
 ("antagonist focalized once, late", "Kleander notes Brandin, who originates the whole fabula, is focalized through only once, for about a page at the end of the battle, after the reader has already formed a judgment.", "kleander", "No more than a page long, Brandin’s focalization"),
 ("prologue as mosaic of focalizations", "Kleander quotes Kay that the prologue of Sailing to Sarantium was written as a mosaic of different focalizations.", "kleander", "the prologue of Sailing to Sarantium was written as a mosaic"),
 ("telescoping of events", "Kleander documents Kay's admitted 'telescoping' (iconoclasm moved centuries earlier; a 750-year Reconquista compressed to one lifetime) so that historical loss lands on the same set of characters and intensifies emotional response.", "kleander", "intensify the emotional and intellectual response to what really happened"),
 ("accumulation of detail", "Kleander quotes Kay's stated method of a quiet, steady accumulation of detail and complexity that reaches readers subliminally and builds trust.", "kleander", "quiet, steady accumulation of detail and complexity"),
 ("retrospective hints", "Kleander observes that Kay plants hints to Valentin's identity as Rhun throughout Tigana which only make sense in retrospect.", "kleander", "the hints only make sense in retrospect"),
 ("withheld duel outcome", "Kleander notes that who survived the Ammar–Rodrigo duel is not revealed until halfway through the epilogue, by which point the outcome is 'strangely unimportant'.", "kleander", "not until halfway through the epilogue that Kay reveals who survived"),
 ("parallel-structured prayer passages", "Kleander sets side by side two near-identical prayer paragraphs (Asharite and Jaddite) as the clearest example of Kay using structural repetition to show how alike the religions are.", "kleander", "the clearest example of how alike the religions are"),
 ("historian as unreliable narrator-in-text", "Kleander reads Pertennius (Procopius) as Kay's illustration that history is carved and chosen, with the narrator's opening line that writers of history seek the dramatic over the truth.", "kleander", "exquisitely phrased vituperation"),
 ("juxtaposed ideological orientations", "Kleander (via Toolan) argues Kay's structure leaves the reader torn between different views rather than resolved.", "kleander", "left them ‘torn between different views’"),
 # --- Rettino 2012 ---
 ("chronicle-register opening", "Rettino reads Tigana's first sentence ('In the autumn season of wine, word went forth...') as an entry in a chronicle lending historical flavour, then subverted when the reported death proves faked.", "rettino", "reads like an entry in a chronicle"),
 ("speculative narrator-historian persona", "Rettino notes the narrator adopts a cautious, guessing persona ('perhaps because...') whose judgments the naive reader must nonetheless accept, the club-story authority of portal-quest fantasy.", "rettino", "The narrator’s speculative persona supposedly only guesses"),
 ("omniscient historian breaches immersion", "Rettino cites the Lions passage 'One hundred and thirty-nine citizens of Fezana... This was the way of it' as the omniscient historian's voice breaking the immersive character perspective.", "rettino", "the narrator’s omniscient historian’s voice"),
 ("exposition disguised as thought", "Rettino shows the narrator's voice and Jehane's thoughts intersecting so that distanced background exposition is disguised as the character's reflections.", "rettino", "disguising it as Jehane’s thoughts"),
 ("free indirect discourse for world-information", "Rettino notes Jehane's noticing what is unusual, in free indirect discourse, dispenses world information without a guide figure.", "rettino", "she notes, in free indirect discourse"),
 ("exposed seams / prophecy", "Rettino argues that riselka prophecies foreshadow and expose the structural lines of Tigana, seams a mimetic novelist would hide.", "rettino", "foreshadow and expose the structural lines in his novel"),
 ("later-dynasty historian voice", "Rettino documents that Under Heaven's narrator speaks in several scenes in the voice of a later-dynasty historian, citing chroniclers' consensus and then departing from it with knowing irony.", "rettino", "speaks in several scenes in the voice of a historian"),
 ("ironic exclamation in narratorial voice", "Rettino points to the narrator's exclamation that Shen Tai 'hadn't even passed the examinations at that point!' as the moment author and historian-narrator blend.", "rettino", "The exclamation point is telling"),
 ("incidental figure given a full death", "Rettino cites the Kanlin messenger killed with Spring Rain's letter, an 'incidental figure' living the drama of his own life and death, as Kay's device for showing history's lost documents.", "rettino", "living through the drama and passion of his own life"),
 ("local, sorrow-weighted eucatastrophe", "Rettino argues Kay's endings grant refuge to a few characters rather than reversing historical catastrophe: a happy ending weighted with sorrow.", "rettino", "a happy ending, though one weighted with sorrow"),
 ("deliberate ambiguity at the climax", "Rettino notes Jehane sees 'a good man raise his sword and... a good man fall' with deliberate ambiguity, resolved only in the epilogue.", "rettino", "With deliberate ambiguity on Kay’s part"),
 ("recognition as false assumption", "Rettino reads Tai's recognition scene as a false assumption about his role in shaping history, with Sima Zian calling such knowledge arrogance.", "rettino", "a false assumption about his role in shaping history"),
 ("narratorial aphorism on pattern", "Rettino cites the narrator's essayistic passage that humans demand order and pattern in the flux of history, exposing Kay's own patterning.", "rettino", "questions the integrity of historical narratives"),
 ("unnamed-figure coda", "Rettino notes Under Heaven closes on two unnamed men burying the dead until they die and the spirits fall silent.", "rettino", "not even the dead can grieve forever"),
 ("elegiac lament closes Lions", "Rettino reads Ammar's closing poem as setting an elegiac tone, with children's laughter audible through the window.", "rettino", "The poem sets an elegiac tone"),
 ("burden of memory as bondage", "Rettino reads Baerd carrying memory 'like a cart yoked to his shoulders' and Alessan's blade-in-the-soul oath as memory chosen as bondage rather than escape.", "rettino", "like a cart yoked to his shoulders"),
 ("mirror world", "Rettino terms Kay's settings 'mirror worlds' that distort a historical original so its story can be projected onto other contexts.", "rettino", "The Palm is a “mirror world” of Italy"),
 ("portal-quest authority (criticism)", "Rettino, via Mendlesohn, finds it troubling that Tigana relies on the incontestable club-story authority of guides (Baerd, Alessan) in a novel about how power controls history.", "rettino", "it is somewhat troubling that Kay should choose"),
 # --- Cobb 2005 ---
 ("emotional rather than rational history", "Cobb argues Kay's enrichment of the reader is primarily emotional rather than rational, helping readers bear the burden of history rather than master it.", "cobb", "primarily emotional rather than rational"),
 ("memory as wound and support", "Cobb reads the Tigana oath as memory that is both a wound and a rod of support.", "cobb", "This memory is both a wound and a rod of support"),
 ("unacknowledged history (criticism)", "Cobb notes it is perfectly possible to read Tigana without knowing it recasts Renaissance Italy, so its revision uncomfortably resembles the tyrant's spell.", "cobb", "perfectly possible to read the novel without any awareness"),
 ("minimal renaming plus acknowledgements", "Cobb observes that the Sarantine Mosaic's minimal adaptation of place-names and extensive acknowledgements force the reader to recognise actual history.", "cobb", "minimal adaptation of place-names (Sarantium)"),
 ("artist-protagonist as authorial analogue", "Cobb reads Crispin's mosaic as an analogy for Kay's own project of re-creating history in art.", "cobb", "makes an analogy between his own artistic project and Crispin’s"),
 ("smaller, oblique work that lasts", "Cobb notes Crispin's surviving second mosaic is on a smaller scale and more obliquely expressed, the novel implying that is why it lasts.", "cobb", "on a smaller scale and more obliquely expressed"),
 ("human smallness before history", "Cobb contrasts Kay's sense of proportion, the smallness of the human being in relation to the world, with Silverberg's hero who masters history.", "cobb", "the smallness of the human being in relation to the world"),
 # --- Töyrylä 2017 ---
 ("variable internal focalization share", "Töyrylä estimates about sixty per cent of Tigana is focalized through Devin or Dianora, with at least nineteen other identifiable focal characters and most chapters alternating three or more perspectives.", "toyryla", "About sixty per cent of the text"),
 ("narrated monologue amplifies emotion", "Töyrylä shows Dianora's passages use free indirect thought with the character's own metaphors, deictics and incomplete sentences, amplifying the emotional notes.", "toyryla", "incomplete sentences point in the direction of the character"),
 ("polysyndetic verb chains", "Töyrylä points to the long list of verbs ('battered and levelled and burned... and killed... and taken away') as the character's voice inside the narration.", "toyryla", "the long list of verbs"),
 ("antagonist as focal character", "Töyrylä notes Alberico is a regular focal character, which humanises him with frustration and fear without making him sympathetic.", "toyryla", "Using the antagonist as a focal character makes him"),
 ("multiple focalization of one scene", "Töyrylä analyses the Ring Dive as narrated twice or thrice through Devin, Dianora and Alessan, with contradictory readings of Brandin's expressionless face.", "toyryla", "some of the events are narrated twice or even thrice"),
 ("withheld focal character", "Töyrylä shows Rhun is never a focal character until the final pages, enabling the Valentin twist while other focalizants register him in passing.", "toyryla", "the focalization unexpectedly shifts to him"),
 ("minor focalizant then flat execution", "Töyrylä reads the innkeeper Ettocio: focalized for a few pages, then a shift to narratorial focalization enables the matter-of-fact description of his execution.", "toyryla", "enables the matter-of-fact description of his execution"),
 ("indifferent narrator, minimal commentary", "Töyrylä finds narratorial passages are matter-of-fact description with only minimal commentary (e.g. 'Unfortunately'), denying readers a guiding moral voice.", "toyryla", "matter-of-fact description with only minimal commentary"),
 ("report-style summary of violence", "Töyrylä notes the Senzio courtyard slaughter is narrated in summary with 'according to most reports later' and approximate casualties, the narrator restricting omniscience to what becomes known.", "toyryla", "the narrator is merely reporting what happened, without any commentary"),
 ("'as everyone knows' communal viewpoint", "Töyrylä identifies a narrator who reports what the world seems like to an average inhabitant, adopting the Palm's religious stance ('as everyone knows') and using 'word went forth' to mislead truthfully.", "toyryla", "reporting what the world seems like to an average person"),
 ("intermental / group focalization with irony", "Töyrylä analyses tavern-patron and Astibar-town passages focalized through a group, combining sardonic tone with dramatic irony since readers know more.", "toyryla", "a sardonic tone is combined with the deeper level irony"),
 ("truthful misdirection at the opening", "Töyrylä argues Kay's 'outright lie' opening is not a lie: the narrator says only that word went forth of Sandre's death.", "toyryla", "the narrator does not claim that Sandre is dead"),
 ("authorial aim: ambiguities and divided loyalties", "Töyrylä quotes Kay's afterword that Tigana aimed to stretch the reader with ambiguities and divided loyalties in a genre that tends not to work that way.", "toyryla", "to stretch the reader with ambiguities and divided loyalties"),
 ("hidden identity in minor-character scene", "Töyrylä notes the Ettocio scene describes Alessan, Devin and the disguised Sandre without naming them, so readers half-recognise what the focalizant cannot.", "toyryla", "readers are not directly told who the characters are"),
 # --- Webb 1991 / 1995 ---
 ("internalised magic, no talismans", "Webb notes Tigana's magic correlates with psychological strength and the text contains no talismanic objects, staffs or reforged swords.", "webb1991", "the text contains no talismanic objects"),
 ("three plaited strands", "Webb describes three major narrative strands plaited toward one outcome whose players never see the whole; the gods and the reader do.", "webb1991", "The gods, and the reader, may see the whole tapestry"),
 ("Ember-day timing as weave", "Webb observes that decisive freely-willed acts are timed to the Ember Days, which interweaves the separate strands.", "webb1991", "It is this timing that helps to interweave the narrative strands"),
 ("punning names", "Webb reads Rhun as a deliberate pun on 'ruin' and a Welsh reference, naming being crucial to the text.", "webb1991", "a deliberate pun on ruin"),
 ("closing on in-world prophecy", "Webb notes Tigana ends with a riselka whose presence is a prophecy in itself.", "webb1991", "whose presence is a prophecy in itself"),
 ("nineteenth-century romance sentence structure", "Webb argues Kay keeps, line by line, the sentence structure, ambience and style of nineteenth-century romance while repudiating its cosy certainties.", "webb1995", "the sentence structure, the ambience, the style of nineteenth century romance"),
 ("myth to faith to religion", "Webb traces a progression from Homeric gods (Fionavar) to intercessory gods (Tigana) to off-stage gods and engineered miracles (Arbonne).", "webb1995", "a clear progression from myth through faith to religion"),
 ("historical-romance rootstock", "Webb calls A Song for Arbonne a meta-fantasy bred from nineteenth-century historical romance crossed with late-twentieth-century cynicism.", "webb1995", "bred from the root stock of nineteenth century historical romance"),
 ("Dunnett's Lymond as model", "Webb sees Bertran de Talair as reminiscent of Dunnett's Francis Crawford of Lymond, musician and strategist.", "webb1995", "reminiscent of Dunnett’s Francis Crawford of Lymond"),
 ("dark/light hair symbolism", "Webb notes a colour symbolism of darkness and light in the female characters carried from Tigana into Arbonne.", "webb1995", "The colour symbolism of darkness and light has been retained"),
 ("author's dissent noted in text", "Webb's essay carries an appended 'GGK NOTE' in which Kay disputes her reading of Arbonne's gender balance, a rare author–critic exchange in the record.", "webb1995", "Janeen Webb takes the unusual and generous step"),
 # --- Ordway 1998 ---
 ("modernised detail", "Ordway shows Kay converting the Cid's beard-pulling into a whip-scar because the scarring impresses a modern reader.", "ordway", "unlikely to impress a modern reader, whereas the scarring does"),
 ("compressed reconquest for felt complexity", "Ordway argues the twenty-year reconquest lets the reader experience victory through characters tied to both sides, so complexities are brought home rather than stated in an epilogue.", "ordway", "the complexities of the reconquest are brought home"),
 ("one primary source per standalone", "Ordway contrasts Fionavar's many myths with the standalone novels' focus on a single source each.", "ordway", "he focuses on a single source for each novel"),
 ("full-circle minor character", "Ordway notes Lions comes full circle by ending on the reaction of Alvar, one of the first characters introduced.", "ordway", "the novel also comes full circle"),
 ("legend-frame summary", "Ordway quotes the surgery passage that opens 'what happened that night... became legendary', a retrospective legend-framing of an event.", "ordway", "became legendary"),
 # --- Gunn 1998 ---
 ("consequences faced", "Gunn identifies Tigana's flavour as facing up to consequences other fantasy glosses over, e.g. the enslaved wizard's protest.", "gunn", "facing-up to the consequences of actions glossed over"),
 ("dense historical-novel texture", "Gunn says Tigana reads like a richly tapestried historical novel dense with character and detail.", "gunn", "richly tapestried historical novel dense with character and detail"),
 ("killing major characters", "Gunn notes Kay's willingness to kill off attractive major characters gives an edge of reality.", "gunn", "his willingness to kill off major characters"),
 ("gritty world (Encyclopedia of Fantasy)", "Gunn quotes Kuzca's Encyclopedia of Fantasy entry that Kay attempts a grittier, harsher world than is common within fantasy, and speculates TV work taught scene-setting and dialogue.", "gunn", "grittier, harsher world than is common within fantasy"),
 # --- Malosse 2007 (Anabases) ---
 ("many narrative points of view", "Malosse notes the 1300-page Mosaic has many characters and narrative points of view, making summary difficult.", "malosse", "many characters and many narrative points of view"),
 ("period conceits, not modern", "Malosse credits Kay with giving characters the knowledge, conceits and superstitions of the time; anachronisms are of nuance not fact.", "malosse", "the knowledge and the conceits of the time"),
 ("'true lying' Byzantium", "Malosse argues the deliberately unfaithful Sarantium evokes Late Antiquity more exactly than de Camp's or Silverberg's respectful time-travel novels.", "malosse", "Its false Byzantium is more real"),
 ("transparent renaming", "Malosse lists the transparent substitutions (Rhodias/Rome, Varena/Ravenna, Pertennius/Procopius) as an undisguised debt.", "malosse", "under the new names – often transparent"),
 ("scene remembered by a witness", "Malosse chooses Alixana's porphyry-shroud speech, narrated as a senator's later memory, to exemplify Kay's style against Procopius's account.", "malosse", "as compared with the narrative supplied by Procopius"),
 # --- Taylor ---
 ("resolution by action and historical whim", "Taylor notes Lions resolves outcomes by both individual action and the whims of history, magic and heroism alone being precluded.", "taylor-lions", "both individual action and the whims of history"),
 ("closing symbolic image", "Taylor reads the epilogue's three full glasses of wine left standing together as the novel's culminating image.", "taylor-lions", "Three full glasses of wine, intentionally left standing together"),
 ("Yeats intertext", "Taylor documents that the Sarantine titles and vision derive from Yeats's Byzantium poems and that the title phrase is an in-world idiom for a life at a cusp.", "taylor-sailing", "Kay at his most historical"),
 # --- Hatch 2005 ---
 ("cyclical narration = causation", "Hatch argues the non-chronological, flashback-laden, multi-focalized narrative creates a sense of cause and effect in history rather than a timeline.", "hatch", "creates a sense of cause and effect in history"),
 ("opening aphorism on historians", "Hatch cites the Mosaic's first-page narratorial claim that writers of history often seek the dramatic over the truth.", "hatch", "writers of history often seek the dramatic over the truth"),
 ("leaders and common people", "Hatch notes the narrative is focused on both leaders and the 'common' man, unlike traditional history.", "hatch", "focused on both the affairs of leaders"),
 # --- Cawsey / Dalhousie 2021 ---
 ("magic only as believed", "Cawsey's introduction states Kay includes only supernatural elements the depicted society believed, presented from the inside-out so the setting renders these beliefs as true.", "cawsey-dal", "renders these beliefs as true"),
 ("magic left unexplained", "Cawsey reports Kay's Bagehot-derived principle of leaving the workings of magic unexplained, since characters would not analyse their beliefs.", "cawsey-dal", "leaves the exact details of the workings of magic unexplained"),
 ("great events at the personal level", "Kay tells Cawsey the death of a far-off emperor means less to a farmer than his hired hand's broken leg, the personal running through his fiction.", "cawsey-dal", "The death of the emperor far off means far less"),
 ("unrecorded lives", "Kay tells Cawsey he has become even more engaged with giving value to lives that go unrecorded, drawing on recent social history.", "cawsey-dal", "giving value to lives that often go unrecorded"),
 ("drive toward complexity", "Kay tells Cawsey he has a drive towards complexity, even celebrating it, against the cultural tendencies of the day.", "cawsey-dal", "a drive towards complexity, I think—even towards celebrating it"),
 ("invented setting universalises", "Kay tells Cawsey the absence of a specific time and place lets readers see a story as not tied to one place, at the cost of readers who want to be educated.", "cawsey-dal", "the absence of a specific time and place"),
 ("mythic sources of Fionavar", "Kay lists Frazer, Graves, Campbell, the Mabinogion, Malory and the Poetic Edda as the steeping of the first trilogy.", "cawsey-dal", "so much steeped in myth, legend, and folklore"),
 # --- Kay, Home and Away ---
 ("detaching the tale", "Kay: fantasy detaches the tale from a narrow context and erodes prejudices, so a story cannot be read as only about Spain seven hundred years ago.", "home-away", "detaches the tale from a narrow context"),
 ("honesty about limitations", "Kay answers Henry James: treating the past as fantasy acknowledges the impossibility of recovering past world-views, a way of being honest about limitations.", "home-away", "a way of being honest about limitations"),
 ("appropriate distance from real people", "Kay says inventing a man based on El Cid but clearly not him demonstrates a measure of appropriate distance and declares his guesswork.", "home-away", "demonstrating a measure of appropriate distance"),
 ("escape that brings you home", "Kay adopts Douglas Barbour's phrase for what fantasy can do.", "home-away", "The kind of escape that brings you home"),
 # --- HNR 2004 ---
 ("saga-shaped telling for Last Light", "Kay says for The Last Light of the Sun he tried to shape language and a form of telling using elements from the sagas to show a less urbane world.", "hnr", "shape language and a form of telling the tale"),
 ("character revealed within action (Dunnett)", "Kay names Dorothy Dunnett's ability to reveal character within and through action scenes as unmatched and a model.", "hnr", "reveal and showcase character within and through action scenes"),
 ("real people kept off the page", "Kay prefers a Valerius and Alixana based on Justinian and Theodora as an up-front admission that no one knows what the real people were like in private.", "hnr", "we have no idea what the ‘real’ people were like"),
 ("variations on historical themes", "Kay describes his world-building as variations on historical themes rather than create-from-scratch worlds.", "hnr", "variations on historical themes, not create-from-scratch worlds"),
 ("poet first", "Kay notes his first published work and awards were for poetry.", "hnr", "My first published work was poetry"),
 # --- LARB 2016 ---
 ("same conversation retold differently", "Kay says several scenes in Children of Earth and Sky narrate one conversation from more than one participant and the conversation is not the same.", "larb", "the conversation isn’t the same"),
 ("two moons as signal", "Kay says the two moons declare 'We're not here', setting the rules of engagement with the reader.", "larb", "The two moons say, We’re not here."),
 ("borderland lives of the not-powerful", "Kay says Children of Earth and Sky takes place in the lives of not-powerful people on the borderlands for whom emperors' ambitions matter little.", "larb", "in the lives of not-powerful people"),
 ("world as characters believe it", "Kay says the fantastic lets him present the world as characters believe it, matter-of-factly, removing the modern reader's smugness (his definition of magic realism).", "larb", "the world is presented as the characters believe it to be"),
 ("past as alien, against relatability", "Kay calls the past staggeringly alien and criticises commercial historical writing that turns on relatability.", "larb", "staggeringly alien"),
 ("invisible seam between fact and invention", "Kay says if a reader can pick out what is made up from what is real, the storytelling is botched.", "larb", "you’ve botched your storytelling"),
 ("reverence for language / poetic prose", "The interviewer characterises Kay's prose as poetic and steeped in myth, with a reverence for language running through everything.", "larb", "A reverence for language runs through everything he writes"),
 ("multiple points of view", "The interviewer states all Kay's novels are told from multiple points of view, some scenes from several characters in turn; Kay declines to call this a comment on who tells history.", "larb", "Some scenes are told from several characters’ points of view"),
 # --- Clarkesworld 2016 ---
 ("quarter turn as shared admission", "Kay says the quarter turn acknowledges from the outset that we cannot get history exactly right, an awareness reader and author share.", "clarkesworld", "we can’t get it exactly right"),
 ("rotating protagonists", "Kay says five protagonists all move to the centre in different parts of the narrative and balancing them is a core task.", "clarkesworld", "all move to the center in different parts"),
 ("epic backdrop, ordinary lives", "Kay wanted a book that felt epic against a great war but was about non-powerful men and women getting on with their lives.", "clarkesworld", "non-powerful men and women trying to get on"),
 # --- Locus 2025 ---
 ("no direct mapping", "Kay never wants a character or event to map directly onto a real one; history rhymes rather than repeats.", "locus", "where things map directly"),
 ("wit shown via unexplained references", "Kay borrows Dunnett's method of demonstrating intelligence by having characters say things the reader does not get.", "locus", "say things the reader doesn’t understand"),
 ("elements per book's need", "Kay lists the supernatural, the erotic, intrigue, suspense and lyric language as elements a book may or may not require.", "locus", "another might be lyric language"),
 ("hack verse as pastiche", "Kay enjoys writing a bad poet's work, e.g. the bad troubadour early in Arbonne.", "locus", "It’s fun writing a bad writer, too"),
 ("margins of history", "Kay says the unwritten lives of women and the poor at the margins of history have been part of his fiction forever.", "locus", "the people at the margins of history"),
 ("teaching the reader to read", "Kay says every serious writer is teaching a reader how to read them.", "locus", "teaching a reader how to read them"),
 # --- Tor/io9 2016 ---
 ("cusp-of-transition settings", "Kay is drawn to times and places on the cusp of transition and to borderlands, while wary of proposing lessons.", "tor2016", "times and places on the cusp of transition"),
 ("quarter turn imports other centuries", "Kay says the quarter turn let him give Children an emperor modelled on Rudolph II, a century out of period.", "tor2016", "let me make use of some elements I couldn’t have"),
 # --- Psychopomp ---
 ("no outlining", "Kay says he does not outline; period and place, then theme, then characters, and the arc emerges.", "psychopomp", "I don’t outline the books."),
 ("Dunnett: character through action", "Kay praises Dunnett as unmatched at revealing character through action rather than stopping the narrative.", "psychopomp", "revelation of character through action"),
 # --- Vector 2010 (Harrison) ---
 ("superlative-rich style (criticism)", "Harrison finds Kay's superlative-rich style risks beauty fatigue and that its extravagance might be better expressed as poems.", "vector", "Kay’s superlative-rich style risks beauty fatigue"),
 ("magic but little mystery", "Harrison describes Kay's affect as magic but little mystery, a platonic ideal of Tang China described with precision and thoroughness.", "vector", "magic but little mystery"),
 ("stately narrative", "Harrison says Tai's absurdly ambitious mourning is credible only when rendered within Kay's stately narrative.", "vector", "rendered within Kay’s stately narrative"),
 ("implied narrator becomes real narrator", "Harrison notes that in the final third the implied narrator becomes a real narrator and the focus pulls back, making the novel a threnody and one telling among many.", "vector", "the implied narrator becomes a real narrator"),
 ("set-piece events off-stage", "Harrison notes the horse-gift frame keeps expected big set-piece events off-stage in favour of the feel of a moment of historical possibility.", "vector", "big set-piece events off-stage"),
 ("elevated register", "Harrison (in comments) says the elevated register is characteristic of Kay's work generally, not specific to Kitai.", "vector", "the elevated register is characteristic of Kay’s work"),
 ("present tense for women's viewpoints", "Harrison (in comments) states Under Heaven's sections with women viewpoint characters are in present tense while male-viewpoint sections are in past tense.", "vector", "are in present tense"),
 ("narrator on coincidence and historians", "Harrison quotes the narrator's remark that only a patient historian or a story-shaper would note such conjunctions, as Kay's self-reflexive use of history.", "vector", "Only a patient historian with access to records"),
 # --- Walton on Sarantine ---
 ("veiled omniscient", "Walton names Kay's Sarantine style an odd, distanced, elegiac 'veiled omniscient': a narrator who knows everything but draws and lifts veils.", "walton-sar", "odd, distanced, elegaic style that I want to call veiled omniscient"),
 ("withheld identity trick (criticism)", "Walton dislikes Kay's Dunnett-like trick of describing a character for pages without saying who is who.", "walton-sar", "plays tricks where he described but doesn’t say who is who"),
 ("pulling back / artifice", "Walton says there is always a pulling back, events interpreted through a consciousness of artifice, like the wrong end of a telescope.", "walton-sar", "there’s always a pulling back"),
 ("no throwaway viewpoints", "Walton notes many points of view but Kay never takes up a character just to throw them away; ironic omniscient linking underlines everything.", "walton-sar", "he never takes up a character just to throw them away"),
 ("single-day compression and pluperfect", "Walton observes the books concentrate on single days with heavy flashback, using more pluperfect than anything she can think of, almost like Ulysses.", "walton-sar", "more use of the pluperfect tense in these than anything else"),
 ("one event from many strata", "Walton notes a chariot race is seen from a driver, someone in the crowd and an undercook making soup.", "walton-sar", "an undercook for the Blue faction making soup"),
 ("mediating metaphors", "Walton says Kay mediates the world through chariot races and mosaic-making, describing heresy and empire in those terms.", "walton-sar", "mediates the world through the chariot races"),
 ("details that bite", "Walton praises details real enough to bite: tesserae quality, mud, fish sauces, the arrow-extraction tool.", "walton-sar", "The details are all real enough to bite"),
 ("historical fantasy is open", "Walton argues renaming reshuffles the deck so no reader knows the ending: a historical novel is inevitably tragedy, a historical fantasy is open.", "walton-sar", "a historical fantasy is open"),
 ("sparse glinting magic", "Walton says the little magic runs glinting through everything like silver threads in shot silk.", "walton-sar", "like the silver threads in shot silk"),
 # --- Walton on Arbonne ---
 ("mannered and distanced (criticism)", "Walton finds Arbonne mannered, distanced and held at arm's length, its world denser than its gossamer characters.", "walton-arb", "mannered and distanced and held at arm’s length"),
 ("set-piece moments", "Walton remembers Arbonne chiefly through set-piece moments of the kind Kay does so well.", "walton-arb", "a few set-piece moments, of the kind Kay does so well"),
 ("trajectory away from magic", "Walton traces a trajectory away from magic from Fionavar through Tigana and Arbonne to Lions.", "walton-arb", "a trajectory away from magic"),
 # --- Palmatier ---
 ("ninety-percent familiar base", "Palmatier argues Kay's worlds are essentially ninety percent familiar, altered through everyday rituals and lore (riselka) so each change informs the whole.", "palmatier", "essentially 90 percent familiar"),
 ("impressionistic language", "Palmatier calls Kay's writing evocative, even impressionistic in places, transporting through simple word choices and turns of phrase.", "palmatier", "evocative, even impressionistic in places"),
 # --- LitStack ---
 ("prolepsis", "Hood says Kay relies heavily on prolepsis, revealing outcomes first so reading becomes a countdown scanning every sentence for tripwires of fate.", "litstack", "Kay relies heavily on prolepsis"),
 ("obstructed climactic view", "Hood notes the final duel is seen through Jehane's eyes, obstructed by a veil of sunlight showing only silhouettes, identity withheld to the end.", "litstack", "obstructed by a veil of sunlight"),
 ("momentum by subtleties", "Hood says the novel's momentum is driven by subtleties: a shared look, a double-meaning line of poetry, a change of stance.", "litstack", "The novel’s momentum is driven by subtleties"),
 # --- Wikipedia-cited critics ---
 ("telling not showing (criticism)", "Hobbs (Globe and Mail, via Wikipedia) finds Kay's prose an obstacle, describing a character as unconventional rather than enacting it, with bothersome Tolkien-like sentence structures.", "wiki-ceas", "stop finding bothersome sentence structures"),
 ("restrained supernatural", "Wolfe and Kirkus (via Wikipedia) describe Kay's supernatural as intentionally restrained, a light touch with the fantasy.", "wiki-ceas", "light touch with the fantasy"),
 ("macro-to-micro scaling", "Capossere (via Wikipedia) says the story shifts seamlessly from macro to micro, scaling down epic events so history becomes humanized.", "wiki-ceas", "scaling down epic events so that history becomes humanized"),
 ("slow pace, journeys", "Alexander (via Wikipedia) says Kay never races to a destination; the joy is in the journeys; the slow pace is typical.", "wiki-ceas", "the joy of his novels is invariably in the journeys"),
 ("carried-away prose (criticism)", "Kirkus (via Wikipedia) notes writing that sometimes gets carried away with itself among Kay's usual elements.", "wiki-brightness", "that sometimes gets carried away with itself"),
 ("fringe characters given depth", "Alexander (via Wikipedia) praises fringe characters created with depth, tenderness and intelligence, the insignificant given significance.", "wiki-brightness", "depth and tenderness and intelligence"),
 ("gift with language", "De Lint (via Wikipedia) credits small telling historical insights and Kay's sheer gift with language.", "wiki-sarantine", "Kay’s sheer gift with language"),
 ("appealing minor characters", "Dirda (via Wikipedia) notes Under Heaven is leavened with appealing minor characters.", "wiki-uh", "appealing minor characters"),
 ("right to telescope events", "Kay's author's letter for Under Heaven (quoted on Wikipedia) reserves the right to change or telescope events so a history-knowing reader still cannot predict the story.", "wiki-uh", "I reserve the right to change, or telescope events"),
 ("many characters slow the tale (criticism)", "Dusmann (via Wikipedia) says the in-depth examination of so many characters slows The Last Light of the Sun with little left to wonder about.", "wiki-lastlight", "in-depth examination of so many characters slows the tale down"),
 ("glimpsed threads of a larger tapestry", "Hromic (via Wikipedia) describes the usual sense of far more in the background than told, glimpsing a few shining threads in a larger tapestry.", "wiki-lastlight", "glimpsing a few shining threads in a larger tapestry"),
 # --- Ringel ---
 ("weak magic keyed to romance sources", "Ringel notes magic in Arbonne is weak, no wizard's duels, in keeping with the scarcity of pagan marvels in real medieval romances.", "ringel", "there are no wizard’s duels"),
 ("palimpsest of time", "Ringel reads Arbonne and Ysabel as portraying Provence as a palimpsest where older history bleeds through into the present.", "ringel", "a palimpsest of time and space"),
 ("centuries collapsed (Bethune)", "Ringel quotes Bethune that events separated by centuries are often collapsed into a single era while only the cultural milieu is kept.", "ringel", "often collapsed into a single era"),
 ("troubadour poems transformed", "Ringel shows Kay transforming troubadour poems (Peire Vidal, Bernart de Ventadorn) into the in-world song of the title.", "ringel", "transforms these and other troubadour poems"),
 # --- C2C (WebFetch only; no verbatim quote kept) ---
 ("elegiac tone and consequence", "Tarantino's essay characterises Kay's writing as elegiac and gently melancholy, turning on memory, continuity and the consequences of conduct (read via summary; quote withheld).", "c2c", ""),
]

def norm(s):
    return (s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"')
             .replace("–","-").replace("—","-").replace(" "," "))
def squash(s):
    return re.sub(r"\s+"," ",norm(s)).lower()

texts = {}
for k,(t,u,kind,sub,f) in S.items():
    if f:
        p=os.path.join(RAW,f)
        texts[k]=squash(open(p).read()) if os.path.exists(p) else ""

bad=[]
for feat,claim,src,q in C:
    assert src in S, src
    n=len(q.split())
    if q and n>=12: bad.append(("LONG",feat,n,q))
    if q and texts.get(src) and squash(q) not in texts[src]: bad.append(("MISS",feat,src,q))
    if q and not texts.get(src): bad.append(("NOCHECK",feat,src,q))
if bad:
    for b in bad: print(b)
    sys.exit(1)

claims=[{"feature":f,"claim":c,"source":S[s][0],"url":S[s][1],"quote":q} for f,c,s,q in C]
sources=[{"title":t,"url":u,"kind":k,"substantive":sub} for (t,u,k,sub,f) in S.values()]
out={"claims":claims,"sourcesRead":sources}
json.dump(out,open(os.path.join(BASE,"found-kay-academic.json"),"w"),ensure_ascii=False,indent=1)

md=[]
md.append("# Kay — academic / scholarly angle: raw notes\n")
md.append("Session 2026-09-06 (fetch date for every URL). Angle: journals, theses, conference papers, encyclopedia syntheses with their cited critics, plus Kay's own essays/interviews used by that criticism. Web search budget was exhausted at 200 calls (shared session budget) after ~25 queries on this angle; remaining discovery was by following citations, Bright Weavings' scholarship indexes and Wikipedia further-reading lists, fetched with curl/WebFetch and read from local text.\n")
md.append("## Method\n")
md.append("Queries issued (WebSearch): prose style scholarly criticism; Tigana memory history academic; 'quarter turn' essay; Extrapolation/Mythlore/JFA/Foundation; dissertation OR thesis; brightweavings scholarship; Sarantine Mosaic scholarly; Lions convivencia medievalism; stylometry/corpus/narrative voice; 'Paradigms of Colonization' JFA; Under Heaven orientalism; Webb 'Myth and the New High Fantasy'; Borowska-Szerszun; Mendlesohn Rhetorics; 'Home and Away' privacy of the dead; Ordway Fionavar; Children/Brightness/Seas scholarly; Ringel Provence; JFA/Extrapolation/SFS/Foundation article; Google Scholar lyrical restraint; prolepsis/'would remember'. Six further queries (negation: overwrought/purple; present tense; Töyrylä; Randall canlit; Malosse Anabases; Dalhousie) were refused by the budget cap — the negation search was therefore covered only by reading the critics already fetched (Hobbs, Kirkus, Walton, Harrison, Dusmann, Cobb, Rettino/Mendlesohn), which do carry the counter-case.\n")
md.append("Fetched and read in full from local text: Randall, Kleander, Rettino, Cobb, Töyrylä, Webb x2, Ordway, Gunn, Taylor x2, Malosse, Ringel, Hatch, Cawsey/Dalhousie (PDF via pypdf), Kay 'Home and Away' (Wayback), Kay LitHub essay, HNR 2004, LARB 2016, Clarkesworld 2016 (Wayback), Locus 2025 (Wayback), Tor/io9 2016 (Wayback), Vector 2010, Walton x2, Palmatier, LitStack 2026, Wikipedia x11, Bright Weavings indexes. Keyword-scanned only: Taylor Fionavar, Doherty, Clements, Nath, Medievalists, Psychopomp, Patton parody. WebFetch-summary only (no verbatim text held): C2C, Rowanwood, Rettino blog. Blocked: JSTOR JFA 13.2 (2002) issue; CORE 'weaver at the loom' thesis; ResearchGate x2; Taylor & Francis chapter body; Zenodo (406); Helsinki repository (Anubis); Borowska-Szerszun 'When Gods are Absent' PDF fetched (4.8 MB) but image-only, no text layer.\n")
md.append("Quote hygiene: every non-empty quote below was machine-checked verbatim (after curly-quote/whitespace normalisation) against the fetched text of its source and is under twelve words.\n")
md.append("## Coverage table\n")
md.append("| Source | Kind | Angle served | Read |\n|---|---|---|---|\n")
for (t,u,k,sub,f) in S.values():
    md.append(f"| {t} | {k} | {'substantive' if sub else 'thin/abstract/blocked'} | {u} |\n")
md.append("\n## Claims (feature — claim — source — quote)\n")
for f,c,s,q in C:
    md.append(f"- **{f}** — {c} — _{S[s][0]}_ — {S[s][1]} — “{q}”\n")
md.append("\n## Open-questions ledger\n")
md.append("- Unverified/unread: 'Paradigms of Colonization: Exploring Themes of Imperialism in Guy Gavriel Kay's Tigana', JFA 13.2 (2002) — exists on JSTOR, author and content not retrieved. Borowska-Szerszun's three chapters/articles (Routledge 2021; Boydell 2020; Creatio Fantastica 2019; Light of Life 2017) — abstracts only; they are about cultural memory/medievalism/gender, not sentence-level prose. Ordway's Dictionary of Literary Biography vol. 251 (2002) entry on Kay (cited by Rettino) not fetched. Joyce Gutensohn's UVic MA thesis chapter on Tigana ('Songs in the Blood') listed but not fetched. Kay's 2021 Tolkien Lecture 'Just Enough Light' is video; Cawsey's Dalhousie introduction is the only text summary read.\n")
md.append("- Single-sourced claims to treat as PLAUSIBLE: the present-tense/past-tense gender split in Under Heaven (Niall Harrison, comment thread); the 'more pluperfect than anything else' observation (Walton); the 90-percent-familiar figure (Palmatier, impressionistic); the focalization counts (Randall for Fionavar, Kleander and Töyrylä for Tigana — the two Tigana counts differ in method, 21 focalizants vs 'at least nineteen other' + 2, and are consistent).\n")
md.append("- No stylometric or corpus study of Kay was found; the only quantified prose data are the hand-counted focalization tallies (Randall 1991; Kleander 2008; Töyrylä 2017). 'The weaver at the loom' thesis title surfaced but the record was blocked.\n")
md.append("- Negation search was budget-blocked as a query but the fetched record already carries the counter-case: Hobbs (telling over showing; Tolkien-like sentence structures), Kirkus (prose that gets carried away), Walton (mannered, distanced; the who-is-who trick), Harrison (superlative-rich style, beauty fatigue), Dusmann (too many characters slow the tale), Cobb (Tigana's unacknowledged revision resembles the tyrant's spell), Rettino/Mendlesohn (portal-quest authority undercuts Tigana's own argument).\n")
md.append("- Concurrency note: another lane wrote cw-archive/reactor-ama/sffchron/cbc-2019 into the same kay-raw directory during this run; only cw-archive (Clarkesworld) was used here, as the archived text of a source this lane had independently located.\n")
open(os.path.join(BASE,"find-kay-academic.md"),"w").write("".join(md))
print("claims",len(claims),"sources",len(sources))
