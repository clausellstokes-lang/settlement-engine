# -*- coding: utf-8 -*-
import json, os
BASE="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep"
U_COMPTON="https://galaxykate0.tumblr.com/post/139774965871/so-you-want-to-build-a-generator"
U_SHORT="https://emshort.blog/2016/09/21/bowls-of-oatmeal-and-text-generation/"
U_SMITH="https://users.soe.ucsc.edu/~ejw/papers/smith-pcg-2010.pdf"
U_GRIN="https://pcgworkshop.com/archive/grinblat2017subverting.pdf"
U_RYAN="https://escholarship.org/content/qt1340j5h2/qt1340j5h2_noSplash_7b2b04b56dfeee9e4558c9f47e6cb25b.pdf"

S_COMPTON="Kate Compton, 'So you want to build a generator...', galaxykate0.tumblr.com, 22 Feb 2016"
S_SHORT="Emily Short, 'Bowls of Oatmeal and Text Generation', emshort.blog, 21 Sep 2016"
S_SMITH="Gillian Smith and Jim Whitehead, 'Analyzing the Expressive Range of a Level Generator', PCGames 2010 workshop (ACM), June 2010"
S_GRIN="Jason Grinblat and C. Brian Bucklew, 'Subverting Historical Cause & Effect: Generation of Mythic Biographies in Caves of Qud', FDG'17, Aug 2017"
S_RYAN="James Ryan, 'Curating Simulated Storyworlds', PhD dissertation, UC Santa Cruz, Dec 2018"

R_COMPTON="live URL, curl with browser user agent, HTML stripped to text"
R_SHORT="live URL, curl with browser user agent, HTML stripped to text"
R_PDF="PDF binary fetched with curl, text extracted with pdftotext (no -layout)"

def c(feature, claim, source, url, quote, page, kind, polarity, date, route, reg, conf, era):
    return dict(feature=feature, claim=claim, source=source, url=url, quote=quote, page=page,
                kind=kind, polarity=polarity, date=date, routeHint=route, registerHint=reg,
                confidence=conf, modelEra=era)

E_C="pre-LLM procedural generation, blog post of Feb 2016; register measured: game content generally (planets, trees, text), not model prose"
E_S="pre-LLM procedural text generation, blog post of Sep 2016; register measured: game text and interactive fiction prose"
E_SM="pre-LLM search-based level generation, 2010; register measured: 2D platformer level geometry, not prose"
E_G="pre-LLM grammar-based text generation, shipped Dec 2016 Caves of Qud build, paper Aug 2017; register measured: generated history texts ('gospels'), an archival/chronicle register"
E_R="pre-LLM simulation-based emergent narrative, dissertation Dec 2018; register measured: simulated storyworld chronicles and generated news/biography text"

claims=[]
A=claims.append

# ---- COMPTON ----
A(c("homogenisation","Compton names the failure of a generator whose outputs are mathematically unique but perceived as all alike the 10,000 Bowls of Oatmeal problem.",S_COMPTON,U_COMPTON,"But the user will likely just see a lot of oatmeal","section 'Aesthetics: the toughest challenge'","own-words","asserts","2016-02-22",R_COMPTON,"none","high",E_C))
A(c("other: perceptual uniqueness as the metric","Compton asserts that perceptual uniqueness, not mathematical uniqueness, is the real metric for a generator's output.",S_COMPTON,U_COMPTON,"Perceptual uniqueness is the real metric","section 'Aesthetics: the toughest challenge'","own-words","asserts","2016-02-22",R_COMPTON,"none","high",E_C))
A(c("other: perceptual differentiation","Compton distinguishes perceptual differentiation, the feeling that a piece of content is not identical to the previous one, as an easier bar than perceptual uniqueness.",S_COMPTON,U_COMPTON,"the feeling that this piece of content is not identical","section 'Aesthetics: the toughest challenge'","own-words","asserts","2016-02-22",R_COMPTON,"none","high",E_C))
A(c("homogenisation","Compton says a reader glancing at a line of trees can tell when they are less varied than expected, which reads as unnaturalness.",S_COMPTON,U_COMPTON,"","section 'Aesthetics: the toughest challenge'","own-words","asserts","2016-02-22",R_COMPTON,"herald-pools","medium",E_C+" (quote blanked: paraphrase of one sentence about a line of trees)"))
A(c("other: parametric variation ceiling","Compton says parametric methods, which vary an existing artifact along fixed numerical paths, can produce something new but never something surprising.",S_COMPTON,U_COMPTON,"but never something surprising","section 'Parametric methods'","own-words","asserts","2016-02-22",R_COMPTON,"none","high",E_C))
A(c("other: distribution methods fail on language","Compton says randomly selected strings of words do not have enough structure to make interesting meaning.",S_COMPTON,U_COMPTON,"enough structure to make interesting meaning","section 'Distribution'","own-words","asserts","2016-02-22",R_COMPTON,"herald-pools","high",E_C))
A(c("other: grammars cannot hold constraints","Compton says grammars do not have a way to handle constraints unless the constraints are implicitly encoded in the grammar itself.",S_COMPTON,U_COMPTON,"they do not have a way to handle constraints","section 'Grammars'","own-words","asserts","2016-02-22",R_COMPTON,"dossier-archivist","high",E_C))
A(c("steerability","Compton says restricting a generator to be more conservative in its choices may lose interesting possibility space.",S_COMPTON,U_COMPTON,"though that may lose interesting possibility space","section 'Ways that generators fail'","own-words","asserts","2016-02-22",R_COMPTON,"none","high",E_C))
A(c("other: evidence of process as character","Compton says humans seem to like perceiving evidence of process and forces in a generated artifact.",S_COMPTON,U_COMPTON,"Humans seem to like perceiving evidence of process and forces","section 'Aesthetics: the toughest challenge'","own-words","asserts","2016-02-22",R_COMPTON,"dossier-archivist","high",E_C))
A(c("other: failure mode taxonomy","Compton says the most common way generators fail is producing content that fails to be interesting.",S_COMPTON,U_COMPTON,"generators fail is that they produce content that fails to be interesting","section 'Aesthetics: the toughest challenge'","own-words","asserts","2016-02-22",R_COMPTON,"none","high",E_C))
A(c("other: uneven salience as a cure","Compton proposes that most generated artifacts can be drab background noise so that a few characterful artifacts stand out.",S_COMPTON,U_COMPTON,"highlighting the few characterful artifacts","section 'Aesthetics: the toughest challenge'","own-words","asserts","2016-02-22",R_COMPTON,"dossier-archivist","high",E_C))
A(c("other: possibility space","Compton defines a generator's possibility space as all the kinds of artifacts it can generate.",S_COMPTON,U_COMPTON,"all the kinds of artifacts it can generate","section on constraints and desirable properties","own-words","asserts","2016-02-22",R_COMPTON,"none","high",E_C))
A(c("detection and its failures","Compton says that when bad content cannot be defined it becomes impossible to filter.",S_COMPTON,U_COMPTON,"it becomes impossible to filter","section 'Ways that generators fail'","own-words","asserts","2016-02-22",R_COMPTON,"none","high",E_C))
A(c("other: elicit the human process first","Compton advises sitting with a practitioner and recording the questions they ask themselves while making the artifact, as the basis for a generator.",S_COMPTON,U_COMPTON,"What questions do they ask themselves along the way?","section 'Building Your Artist-in-a-Box'","own-words","asserts","2016-02-22",R_COMPTON,"dossier-archivist","high",E_C))
A(c("place and institution description","Compton cites Kevin Lynch's 'Image of the City' for the claim that there are factors that make cities memorable and describable, and suggests other such aesthetic rules may be discoverable.",S_COMPTON,U_COMPTON,"there are factors that make cities memorable and describable","section 'Aesthetics: the toughest challenge'","own-words","asserts","2016-02-22",R_COMPTON,"dossier-archivist","high",E_C))

# ---- EMILY SHORT ----
A(c("other: mechanical connection as the cure","Emily Short says the key question in avoiding procedural oatmeal is whether the generation is connected to anything mechanical.",S_SHORT,U_SHORT,"whether the generation is connected to anything mechanical","body, fourth paragraph","own-words","asserts","2016-09-21",R_SHORT,"none","high",E_S))
A(c("other: decorative generation","Emily Short says generated names and text are purely decorative unless tightly correlated with gameplay.",S_SHORT,U_SHORT,"purely decorative unless it is tightly correlated with gameplay","body, fourth paragraph","own-words","asserts","2016-09-21",R_SHORT,"herald-pools","high",E_S))
A(c("reader and expert judgment","Emily Short says the player will soon realize decorative generated text is decorative and start looking past it.",S_SHORT,U_SHORT,"realize that it is decorative and start looking past it","body, fourth paragraph","own-words","asserts","2016-09-21",R_SHORT,"none","high",E_S))
A(c("other: generation is not a content shortcut","Emily Short says procedural generation is not a substitute for designing content but a way of designing content.",S_SHORT,U_SHORT,"a substitute for designing content","body, closing paragraph","own-words","asserts","2016-09-21",R_SHORT,"none","high",E_S))
A(c("other: authoring cost","Emily Short says procedural generation is often at least as labor-intensive as other ways of designing content.",S_SHORT,U_SHORT,"at least as labor-intensive as other ways","body, closing paragraph","own-words","asserts","2016-09-21",R_SHORT,"none","high",E_S))
A(c("consequence on a household","Emily Short says procedural methods are good at low-level layered consequence, representing how the player has changed the world state persistently in a small way.",S_SHORT,U_SHORT,"representing how the player has changed the world state persistently","body, paragraph on layered consequence","own-words","asserts","2016-09-21",R_SHORT,"dossier-archivist","high",E_S))
A(c("homogenisation","A reader commenting as 'Dryman' frames the oatmeal problem as the difficulty of making generated differences matter to an audience, and Short answers that comment in the post.",S_SHORT,U_SHORT,"hard to make these differences *matter* to an audience","opening block quote of the reader comment","reader","asserts","2016-09-21",R_SHORT,"none","high",E_S))
A(c("other: generated text as status information","Emily Short says she wanted everything the robot in The Mary Jane of Tomorrow said to act as a reminder of her current training state.",S_SHORT,U_SHORT,"a reminder of her current training state","body, paragraph on The Mary Jane of Tomorrow","own-words","asserts","2016-09-21",R_SHORT,"dossier-archivist","high",E_S))

# ---- SMITH & WHITEHEAD ----
A(c("homogenisation","Smith and Whitehead say a generator that makes tens of thousands of levels quickly is useless if many of those levels are effectively identical to each other.",S_SMITH,U_SMITH,"many of those levels are effectively identical to each other","section 1, Introduction","analysis","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("other: expressive range as instrument","Smith and Whitehead measure a generator's expressive range by scoring many outputs on emergent metrics and plotting 2D histograms of the scores.",S_SMITH,U_SMITH,"creating a number of 2D histograms","section 2, Analytical Approach","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("other: metrics must be emergent","Smith and Whitehead require comparison metrics to measure emergent properties of outputs rather than the same parameters used to guide the generator.",S_SMITH,U_SMITH,"rather than simply using the same parameters that were used","section 4.2, Comparison Metrics","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("other: expressive range as instrument","Smith and Whitehead say expressive-range analysis can expose unexpected biases in the generation algorithm and holes in the expressive range.",S_SMITH,U_SMITH,"expose unexpected biases in the generation algorithm and holes","Abstract","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("homogenisation","Smith and Whitehead measured their own generator Launchpad as clearly biased towards more linear levels.",S_SMITH,U_SMITH,"The expressive range is clearly biased towards more linear levels","section 4.3, Expressive Range","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("other: sameness traced to one implementation detail","Smith and Whitehead trace Launchpad's linearity bias to a detail that slightly increases the probability of a component appearing again once chosen.",S_SMITH,U_SMITH,"the probability of that component appearing again is slightly increased","section 4.3, Expressive Range","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("other: sameness traced to one implementation detail","Smith and Whitehead call the linearity bias an unintended side effect of that design decision.",S_SMITH,U_SMITH,"The linearity bias is an unintended side effect","section 4.3, Expressive Range","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("detection and its failures","Smith and Whitehead say they would never have realized the far-reaching effect of that minor change without performing the expressive-range analysis.",S_SMITH,U_SMITH,"we never would have realized such a minor change","section 4.3, Expressive Range","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("other: grammars cannot hold constraints","Smith and Whitehead say design grammars are good at capturing local constraints, and they add global critics to address the resulting over-generation.",S_SMITH,U_SMITH,"Design grammars are good at capturing local constraints","section 3.1, Critics","analysis","asserts","2010-06",R_PDF,"dossier-archivist","high",E_SM))
A(c("other: expressive range as instrument","Smith and Whitehead base each expressive-range graph in the paper on 10,000 generated levels unless stated otherwise.",S_SMITH,U_SMITH,"based on 10,000 generated levels","section 4.3, Expressive Range","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("other: filtering cost","Smith and Whitehead report that of the 10,000 levels generated, approximately 100 have a good critic measure.",S_SMITH,U_SMITH,"approximately 100 have a good critic measure","section 4.5, Incorporating Critics","measurement","asserts","2010-06",R_PDF,"none","high",E_SM))
A(c("other: expressiveness without creativity","Smith and Whitehead say it is possible for a system to be expressive without necessarily being creative, and decline to call Launchpad creative.",S_SMITH,U_SMITH,"possible for a system to be expressive without necessarily being creative","section 5, Discussion and Future Work","analysis","asserts","2010-06",R_PDF,"none","high",E_SM))

# ---- GRINBLAT & BUCKLEW ----
A(c("other: effect before cause","Grinblat and Bucklew say there is no logic behind the choice of events in their history generator; events are chosen at random and their texts then profess causes.",S_GRIN,U_GRIN,"there's no logic behind the choice of events","section 4.3, Causality","own-words","asserts","2017-08",R_PDF,"chronicle-line","high",E_G))
A(c("other: effect before cause","Grinblat and Bucklew describe cases where the event invents the cause it needs, a full reversal in which the effect causes the cause.",S_GRIN,U_GRIN,"the effect causes the cause","section 4.3, Causality","own-words","asserts","2017-08",R_PDF,"chronicle-line","high",E_G))
A(c("other: shared state as coherence","Grinblat and Bucklew say the sultan's shared state acts as a glue that holds the disjointed generated events together.",S_GRIN,U_GRIN,"shared state acts as a glue that holds the disjointed events","section 4.4, Parameterization and Narrative Coherence","own-words","asserts","2017-08",R_PDF,"chronicle-line","high",E_G))
A(c("repetition and refrain","Grinblat and Bucklew say the assigned domains act as narrative threads that tie together the events of a sultan's life.",S_GRIN,U_GRIN,"The domains act as narrative threads that tie together the events","section 4.4, Parameterization and Narrative Coherence","own-words","asserts","2017-08",R_PDF,"chronicle-line","high",E_G))
A(c("withheld information and inference","Grinblat and Bucklew say they deliberately let players employ apophenia, the human tendency to perceive patterns, rather than prescribing a narrative morphology.",S_GRIN,U_GRIN,"apophenia, the human tendency to perceive patterns","section 3, Motivation and Design Goals","own-words","asserts","2017-08",R_PDF,"chronicle-line","high",E_G))
A(c("plainness and economy","Grinblat and Bucklew say they aimed for evocative biographical narratives rather than meticulously detailed ones.",S_GRIN,U_GRIN,"evocative biographical narratives","section 3, Motivation and Design Goals","own-words","asserts","2017-08",R_PDF,"dossier-archivist","high",E_G))
A(c("other: account rather than simulation","Grinblat and Bucklew say they did not aim to explicitly simulate historical logic, and instead generated history in order to simulate historical accounts.",S_GRIN,U_GRIN,"we didn't aim to explicitly simulate historical logic","section 3, Motivation and Design Goals","own-words","asserts","2017-08",R_PDF,"chronicle-line","high",E_G))
A(c("place and institution description","Grinblat and Bucklew say places named in a sultan's generated life are instantiated as historic sites during world generation.",S_GRIN,U_GRIN,"instantiated as historic sites during world generation","section 4.6, Impact on the Generated World","own-words","asserts","2017-08",R_PDF,"dossier-archivist","high",E_G))
A(c("reception","Grinblat and Bucklew report that gospels appear in 14 of the 150 most popular screenshots uploaded to the Caves of Qud Steam community page over six months.",S_GRIN,U_GRIN,"gospels are featured in 14 of the 150 most popular screenshots","section 5, Evaluation","measurement","asserts","2017-08",R_PDF,"none","high",E_G))
A(c("other: pool size as a variety input","Grinblat and Bucklew say output variety would be improved by expanding the set of domains, then numbering ten, and the suite of historical events, then numbering nineteen.",S_GRIN,U_GRIN,"the set of domains (currently numbering ten)","section 6, Future Work","own-words","asserts","2017-08",R_PDF,"herald-pools","high",E_G))
A(c("point of view and distance","Grinblat and Bucklew propose as future work that one event generate multiple, conflicting gospels from different perspectives.",S_GRIN,U_GRIN,"conflicting gospels from different perspectives","section 6, Future Work","own-words","asserts","2017-08",R_PDF,"chronicle-line","high",E_G))
A(c("register modulation","Grinblat and Bucklew say Caves of Qud relies on a corpus of over 40,000 words to establish its voice, and that the replacement grammar let them codify that diction and repackage it procedurally.",S_GRIN,U_GRIN,"over 40,000 words","section 5, Evaluation","own-words","asserts","2017-08",R_PDF,"dossier-archivist","high",E_G))

# ---- RYAN ----
A(c("other: templates become visible with repetition","Jonathan Lessard, quoted in Ryan's dissertation, argues that readers will soon see through authored story patterns used to retrieve stories from a simulation.",S_RYAN,U_RYAN,"readers will soon see through them","Chapter 13, closing discussion","analysis","asserts","2018-12",R_PDF,"chronicle-line","high",E_R))
A(c("homogenisation","Lessard, quoted in Ryan, characterises the repeated template as the same story with a different name substituted.",S_RYAN,U_RYAN,"except with Bob instead of John","Chapter 13, closing discussion","analysis","asserts","2018-12",R_PDF,"chronicle-line","high",E_R))
A(c("other: sifting only finds what it was told to find","Ryan concedes that a system sifting a simulated history can only excavate material that matches the patterns it was given.",S_RYAN,U_RYAN,"the computer can only excavate material that matches those particular patterns",'Chapter 13, closing discussion',"own-words","asserts","2018-12",R_PDF,"chronicle-line","high",E_R))
A(c("other: boring substrate","Ryan names boringness as a fundamental pitfall of emergent narrative, saying some simulations are too boring to yield stories.",S_RYAN,U_RYAN,"some simulations are too boring","section 4.1.1, Boringness","own-words","asserts","2018-12",R_PDF,"none","high",E_R))
A(c("homogenisation","Ryan quotes Mike Cook's pronouncement that the aesthetics of big numbers is dead, made in the context of boredom with No Man's Sky.",S_RYAN,U_RYAN,"the aesthetics of big numbers is dead","Chapter 13, closing discussion","relay","asserts","2018-12",R_PDF,"none","high",E_R+"; relaying Mike Cook via a 2016 New Scientist article"))
A(c("homogenisation","Gillian Smith, quoted by Douglas Heaven in New Scientist and relayed by Ryan, says size alone is not enough to sustain interest in a generated world.",S_RYAN,U_RYAN,"size alone is not enough to sustain interest","Chapter 13, closing discussion","relay","asserts","2018-12",R_PDF,"none","high",E_R+"; relaying Gillian Smith via a 2016 New Scientist article"))
A(c("other: monotony as backdrop","Ryan says each Talk of the Town emergent scenario stands against the monotony of everyday existence that constitutes the far majority of a town's history.",S_RYAN,U_RYAN,"the monotony of everyday existence that constitutes the far majority","Chapter 10, on aesthetics of a larger context","own-words","asserts","2018-12",R_PDF,"dossier-archivist","high",E_R))
A(c("other: letting the archive speak","Lessard, quoted in Ryan, contrasts template-driven retrieval with the historians' practice of letting the archive speak.",S_RYAN,U_RYAN,"letting the archive speak","Chapter 13, closing discussion","analysis","asserts","2018-12",R_PDF,"dossier-archivist","high",E_R))

sources=[
 dict(title="So you want to build a generator...", url=U_COMPTON, kind="own-words", substantive=True, date="2016-02-22", route=R_COMPTON),
 dict(title="Bowls of Oatmeal and Text Generation", url=U_SHORT, kind="own-words", substantive=True, date="2016-09-21", route=R_SHORT),
 dict(title="Visualizing Procgen Text, Part Two", url="https://emshort.blog/2016/09/12/visualizing-procgen-text-part-two/", kind="own-words", substantive=False, date="2016-09-12", route=R_SHORT),
 dict(title="Analyzing the Expressive Range of a Level Generator", url=U_SMITH, kind="measurement", substantive=True, date="2010-06", route=R_PDF),
 dict(title="Subverting Historical Cause & Effect: Generation of Mythic Biographies in Caves of Qud", url=U_GRIN, kind="own-words", substantive=True, date="2017-08", route=R_PDF),
 dict(title="Curating Simulated Storyworlds (PhD dissertation, UCSC)", url=U_RYAN, kind="analysis", substantive=True, date="2018-12", route=R_PDF),
]

out=dict(complete=False,
  coverage="IN PROGRESS after 6 sources: Compton, Emily Short, Smith & Whitehead, Grinblat & Bucklew, Ryan fetched raw; Tarn Adams, Mark R. Johnson, Kreminski, Grinblat book chapter still outstanding.",
  sourcesRead=sources, claims=claims)
open(os.path.join(BASE,"found-ai-procgen-baseline.json"),"w",encoding="utf-8").write(json.dumps(out,indent=1,ensure_ascii=False))
print("claims",len(claims),"sources",len(sources))

# ================= ROUND 2 =================
U_TPCG="https://www.pcgamer.com/dwarf-fortress-creator-tarn-adams-talks-about-simulating-the-most-complex-magic-system-ever/"
U_T08="https://www.gamedeveloper.com/design/interview-the-making-of-dwarf-fortress"
U_JAISB="https://www.cs.kent.ac.uk/events/2015/AISB2015/proceedings/aiAndGames/AI-games-15_submission_01--MarkJohnson-modelling.pdf"
U_JBOOK="https://www.markrjohnsongames.com/2021/07/27/procedural-book-generation/"
U_FELT="https://mkremins.github.io/publications/Felt_SimpleStorySifter.pdf"

S_TPCG="Tarn Adams, interviewed by Wes Fenlon, 'Dwarf Fortress creator Tarn Adams talks about simulating the most complex magic system ever', PC Gamer, 16 Mar 2017"
S_T08="Tarn Adams, interviewed by John Harris, 'Interview: The Making Of Dwarf Fortress', Gamasutra, 27 Feb 2008"
S_JAISB="Mark R. Johnson, 'Modelling Cultural, Religious and Political Affiliation in Artificial Intelligence Decision-Making', AISB 2015 AI and Games symposium"
S_JBOOK="Mark R. Johnson, 'Procedural book generation!', markrjohnsongames.com (Ultima Ratio Regum dev blog), 27 Jul 2021"
S_FELT="Max Kreminski, Melanie Dickinson and Noah Wardrip-Fruin, 'Felt: A Simple Story Sifter', ICIDS 2019"

E_T17="pre-LLM simulation-based world and history generation, interview Mar 2017 describing Dwarf Fortress in development; register measured: generated world history read in Legends mode"
E_T08="pre-LLM simulation-based world generation, interview Feb 2008 describing Dwarf Fortress; register measured: generated game plot and world history"
E_J15="pre-LLM rule-based cultural generation, AISB 2015 paper describing Ultima Ratio Regum in development; register measured: generated cultures, religions and NPC behaviour"
E_J21="pre-LLM rule-based artifact generation, dev blog Jul 2021 describing URR 0.9; register measured: generated books as physical objects, an archival register"
E_K19="pre-LLM logic-programming story sifting, ICIDS 2019; register measured: simulated storyworld event chronicles"

R_LIVE="live URL, curl with browser user agent, HTML stripped to text"

A(c("reader and expert judgment","Tarn Adams says a whole class of Dwarf Fortress players skip both play modes and instead do archaeology on the worlds they have generated, reading the history in Legends mode.",S_TPCG,U_TPCG,"They just do archaeology on the worlds they've generated","body, section on the four modes","own-words","asserts","2017-03-16",R_LIVE,"chronicle-line","high",E_T17))
A(c("other: generated history that does not reach the present","Tarn Adams says many things that happen in world generation do not get pushed forward, leaving stories that cannot continue, and calls that bad.",S_TPCG,U_TPCG,"you have these stories that can't continue, which is bad","body, on carrying world-generation events into play","own-words","asserts","2017-03-16",R_LIVE,"chronicle-line","high",E_T17))
A(c("homogenisation","Tarn Adams says the named objects Dwarf Fortress dwarves had made for eleven years were not that interesting, though they existed and had names, until claims and history were attached to them.",S_TPCG,U_TPCG,"They're not that interesting, but they're there, they have names","body, on artifacts","own-words","asserts","2017-03-16",R_LIVE,"dossier-archivist","high",E_T17))
A(c("other: derive the system from the world's premise","Tarn Adams says deriving magic from each world's generated creation myth gives a deeper connection than a fixed ladder of level one and level two spells.",S_TPCG,U_TPCG,"There's a deeper connection than just, this is your level one spells","body, on myth generation and magic","own-words","asserts","2017-03-16",R_LIVE,"none","high",E_T17))
A(c("abstraction over the concrete","Tarn Adams says a random generator would be very hard-pressed to capture really beautiful symbolism or an advanced writing device.",S_T08,U_T08,"You'd be very hard-pressed to capture really beautiful symbolism","section 'Storytelling as an Idea Source'","own-words","asserts","2008-02-27",R_LIVE,"none","high",E_T08))
A(c("other: elicit the human process first","Tarn Adams describes his generation method as finding the key basic elements, finding the rules that govern them, and activating them in the world.",S_T08,U_T08,"finding the key, basic elements, finding the rules that govern them","section 'Storytelling as an Idea Source'","own-words","asserts","2008-02-27",R_LIVE,"none","high",E_T08))
A(c("other: generated detail must be load-bearing","Mark R. Johnson says Ultima Ratio Regum foregrounds generated civilizational, cultural and religious detail in its actors rather than leaving such content as background or lore, as many games do.",S_JAISB,U_JAISB,"rather than leaving such content as \"background\" or \"lore\"","section 2, Procedural Generation and Artificial Intelligence","own-words","asserts","2015",R_PDF,"dossier-archivist","high",E_J15))
A(c("other: generated detail must be load-bearing","Mark R. Johnson says the generated cultural backgrounds are the only route by which his actors' motivations, interests and agendas can be understood.",S_JAISB,U_JAISB,"whose motivations, interests and agendas can only be understood","section 2, Procedural Generation and Artificial Intelligence","own-words","asserts","2015",R_PDF,"dossier-archivist","high",E_J15))
A(c("other: typed pools of world facts","Mark R. Johnson says a URR algorithm can procedurally create over a million detailed religions carrying beliefs, gods, festivals, eschatology and altar appearance.",S_JAISB,U_JAISB,"procedurally create over a million detailed religions","section 2, Procedural Generation and Artificial Intelligence","own-words","asserts","2015",R_PDF,"dossier-archivist","high",E_J15))
A(c("homogenisation","Mark R. Johnson reports over 1 trillion possible generated AI actors in URR, and rests the claim of difference on their behaving differently by social and cultural context rather than on the count.",S_JAISB,U_JAISB,"over 1 trillion possible AI actors","section 2, Procedural Generation and Artificial Intelligence","own-words","asserts","2015",R_PDF,"none","high",E_J15))
A(c("other: every varying feature carries a fact","Mark R. Johnson says a bookmark on a generated URR book shows a scholarly nation, one of several visual features that each encode a fact about the book's nation of origin.",S_JBOOK,U_JBOOK,"a bookmark shows a scholarly nation","blog post body","own-words","asserts","2021-07-27",R_LIVE,"dossier-archivist","high",E_J21))
A(c("other: sifting only finds what it was told to find","Kreminski and colleagues describe a simulated storyworld's output as a profusion of events, many of which are relatively uninteresting as narrative building blocks.",S_FELT,U_FELT,"a profusion of events, many of which are relatively uninteresting","section 1, Introduction","analysis","asserts","2019",R_PDF,"chronicle-line","high",E_K19))
A(c("steerability","Kreminski and colleagues report that they found it very difficult to anticipate in advance the full range of questions a sifting-pattern author would want to ask about the game state, and so gave authors a real query language instead of a preauthored function library.",S_FELT,U_FELT,"very difficult to anticipate in advance the full range of questions","section 5.1, Authoring Sifting Patterns","measurement","asserts","2019",R_PDF,"none","high",E_K19))

sources.extend([
 dict(title="Dwarf Fortress creator Tarn Adams talks about simulating the most complex magic system ever (PC Gamer)", url=U_TPCG, kind="own-words", substantive=True, date="2017-03-16", route=R_LIVE),
 dict(title="Interview: The Making Of Dwarf Fortress (Gamasutra / Game Developer)", url=U_T08, kind="own-words", substantive=True, date="2008-02-27", route=R_LIVE),
 dict(title="Modelling Cultural, Religious and Political Affiliation in Artificial Intelligence Decision-Making (AISB 2015)", url=U_JAISB, kind="own-words", substantive=True, date="2015", route=R_PDF),
 dict(title="Procedural book generation! (Ultima Ratio Regum dev blog)", url=U_JBOOK, kind="own-words", substantive=True, date="2021-07-27", route=R_LIVE),
 dict(title="Felt: A Simple Story Sifter (ICIDS 2019)", url=U_FELT, kind="analysis", substantive=True, date="2019", route=R_PDF),
 dict(title="Generating Histories (chapter in Procedural Storytelling in Game Design, CRC/Routledge 2019)", url="https://www.taylorfrancis.com/chapters/edit/10.1201/9780429488337-18/generating-histories-jason-grinblat", kind="analysis", substantive=False, date="2019", route="BLOCKED: publisher paywall; only unlawful mirrors surfaced; no claims taken"),
 dict(title="Towards Qualitative Procedural Generation (Ultima Ratio Regum blog page named in the roster)", url="http://www.ultimaratioregum.co.uk/game/2016/01/23/towards-qualitative-procedural-generation/", kind="own-words", substantive=False, date="2016", route="NOT FOUND: 404 at the roster URL; substituted Johnson's AISB 2015 paper and 2021 dev blog"),
])

out=dict(complete=True,
  coverage=("Roster: FETCHED RAW and quoted - Compton (galaxykate0.tumblr, 22 Feb 2016), Grinblat & Bucklew FDG'17 PDF, Ryan's 2018 UCSC dissertation (eScholarship PDF, 815pp), "
            "Smith & Whitehead PCG 2010 (author PDF), Emily Short's oatmeal post (dated 21 Sep 2016, NOT Feb as the angle stated), Tarn Adams in two interviews (Gamasutra 2008, PC Gamer 2017), "
            "Mark R. Johnson (AISB 2015 paper + 2021 URR dev blog), Max Kreminski (Felt, ICIDS 2019, author's own site). "
            "NOT FOUND: Johnson's 'Towards Qualitative Procedural Generation' at the roster URL (404) and his RPS columns (404) - substituted his AISB paper and dev blog; Tarn Adams's Roguelike Celebration talk exists only as video, no transcript. "
            "BLOCKED: Grinblat's 'Generating Histories' chapter (Taylor & Francis paywall; only unlawful mirrors surfaced) and the GDC Vault Caves of Qud talk - zero claims taken from either. "
            "Ten substantive sources: 5 by direct live fetch, 5 by PDF-binary fetch plus pdftotext; discovery expanded by bibliography chasing from Grinblat's and Ryan's reference lists and by lateral search; "
            "stopped when the roster was exhausted and two consecutive searches surfaced nothing new that was lawfully reachable."),
  sourcesRead=sources, claims=claims)
open(os.path.join(BASE,"found-ai-procgen-baseline.json"),"w",encoding="utf-8").write(json.dumps(out,indent=1,ensure_ascii=False))
print("FINAL claims",len(claims),"sources",len(sources))
