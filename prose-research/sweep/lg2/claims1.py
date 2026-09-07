# -*- coding: utf-8 -*-
W = "https://web.archive.org/web/%sid_/https://www.depauw.edu/sfs/backissues/7/%s7art.htm"
U_SLUS = "https://web.archive.org/web/20250524105632id_/https://www.depauw.edu/sfs/review_essays/sluss53.htm"
U_JAM  = W % ("20250607182307","jameson")
U_SUV  = W % ("20260206193435","suvin")
U_WAT  = W % ("20260107011510","watson")
U_NUD  = W % ("20221202232531","nudelman")
U_BAR  = W % ("20251225062058","barbour")
U_BIE  = W % ("20251219192652","bierman")
U_HUN  = W % ("20250317044239","huntington")
U_POR  = W % ("20251209040531","porter")
U_THE  = W % ("20251222093314","theall")
U_LEG  = W % ("20251215080725","leguin")

RH = "Wayback raw capture (web.archive.org/web/<ts>id_/) of the DePauw SFS page; the live DePauw URL now 404s"

CLAIMS = [
 dict(_file="sluss53.txt", feature="cadence and rhythm",
  claim="George Slusser asserts that Le Guin's writing gives the reader precise prose rhythms, in contrast to SF identified by its icons.",
  source="George Slusser, 'Le Guin and the Future of SF Criticism', Science Fiction Studies #53 (March 1991)",
  url=U_SLUS, quote="Le Guin gives us precise prose rhythms.", page="closing paragraph",
  kind="analysis", polarity="asserts", date="1991-03", routeHint=RH,
  registerHint="none", confidence="high"),

 dict(_file="sluss53.txt", feature="other: ethnographic anthology form",
  claim="Slusser describes Always Coming Home as building its vision through an objective-sounding layering of one didactic essay upon another.",
  source="George Slusser, 'Le Guin and the Future of SF Criticism', Science Fiction Studies #53 (March 1991)",
  url=U_SLUS, quote="objective-sounding layering of didactic essay upon essay", page="paragraph on Always Coming Home and Number of the Beast",
  kind="analysis", polarity="asserts", date="1991-03", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="sluss53.txt", feature="per-speaker register",
  claim="Slusser reports that Cummins's reading of Always Coming Home gave him the impression of a strong identity speaking through a controlled polyphony of fictional voices.",
  source="George Slusser summarising Elizabeth Cummins, in Science Fiction Studies #53 (March 1991)",
  url=U_SLUS, quote="a controlled polyphony of fictional voices", page="paragraph contrasting Cummins with Selinger",
  kind="analysis", polarity="asserts", date="1991-03", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="sluss53.txt", feature="other: reputation as stylist",
  claim="Slusser quotes Harold Bloom's 1986 introduction calling Le Guin a superbly imaginative creator and major stylist.",
  source="George Slusser quoting Harold Bloom's introduction to Modern Critical Views: Ursula K. Le Guin (1986), in Science Fiction Studies #53 (March 1991)",
  url=U_SLUS, quote="a superbly imaginative creator and major stylist", page="third paragraph",
  kind="analysis", polarity="mentions", date="1991-03", routeHint=RH,
  registerHint="none", confidence="high"),

 dict(_file="jameson.txt", feature="register modulation",
  claim="Fredric Jameson argues that The Left Hand of Darkness is built from heterogeneous narrative modes superposed into what amounts to an anthology of narrative strands.",
  source="Fredric Jameson, 'World Reduction in Le Guin: The Emergence of Utopian Narrative', Science Fiction Studies #7 (November 1975)",
  url=U_JAM, quote="a virtual anthology of narrative strands of different kinds", page="opening paragraph",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="jameson.txt", feature="omission as information",
  claim="Jameson names Le Guin's world-building technique world-reduction, a deliberate thinning of reality by radical abstraction and simplification.",
  source="Fredric Jameson, 'World Reduction in Le Guin', Science Fiction Studies #7 (November 1975)",
  url=U_JAM, quote="an operation of radical abstraction and simplification", page="section introducing the term world-reduction",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="jameson.txt", feature="omission as information",
  claim="Jameson's abstract states that in world reduction omission functions as utopian exclusion.",
  source="Fredric Jameson, 'World Reduction in Le Guin', Science Fiction Studies #7 (November 1975), abstract",
  url=U_JAM, quote="omission functions as utopian exclusion", page="ABSTRACT",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="jameson.txt", feature="place and institution description",
  claim="Jameson says readers are struck by descriptive details such as the cornerstone ceremony and the spring caravan, in which contradictory elements of the real world are recombined into piquant montages.",
  source="Fredric Jameson, 'World Reduction in Le Guin', Science Fiction Studies #7 (November 1975)",
  url=U_JAM, quote="juxtaposed and recombined into piquant montages", page="section on details suggesting an attempt to reimagine history",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="jameson.txt", feature="annalist voice and deep time",
  claim="Jameson attributes the effect of Karhide to the immense time span involved and the great antiquity of its science and technology.",
  source="Fredric Jameson, 'World Reduction in Le Guin', Science Fiction Studies #7 (November 1975)",
  url=U_JAM, quote="the immense time span involved, and the great antiquity", page="section on Karhide's technology",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="chronicle-line", confidence="high"),

 dict(_file="suvin.txt", feature="plainness and economy",
  claim="Darko Suvin calls Le Guin a classical writer whose energy is strictly controlled within a taut and spare architectural system of narrative cells.",
  source="Darko Suvin, 'Parables of De-Alienation: Le Guin's Widdershins Dance', Science Fiction Studies #7 (November 1975), abstract as printed on the SFS page",
  url=U_SUV, quote="a taut and spare architectural system of narrative cells", page="ABSTRACT",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="medium",
  ),

 dict(_file="suvin.txt", feature="other: centripetal narrowing description",
  claim="Suvin writes that Le Guin delineates ever more precisely the same object, describing her method as centripetal.",
  source="Darko Suvin, 'Parables of De-Alienation', Science Fiction Studies #7 (November 1975), abstract as printed on the SFS page",
  url=U_SUV, quote="she delineates ever more precisely the same object", page="ABSTRACT",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="medium"),

 dict(_file="suvin.txt", feature="plainness and economy",
  claim="Suvin judges the Earthsea trilogy Le Guin's best work up to The Dispossessed when seen from a purely formal viewpoint of internal consistency and stylistic clarity.",
  source="Darko Suvin, 'Parables of De-Alienation', Science Fiction Studies #7 (November 1975)",
  url=U_SUV, quote="internal consistency and stylistic clarity, that trilogy is", page="section on the Earthsea Trilogy",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="none", confidence="high"),

 dict(_file="suvin.txt", feature="other: formal polish and closure",
  claim="Suvin characterises the Earthsea Trilogy as beautiful, polished and self-enclosed like a diamond necklace.",
  source="Darko Suvin, 'Parables of De-Alienation', Science Fiction Studies #7 (November 1975)",
  url=U_SUV, quote="polished, and self-enclosed like a diamond necklace", page="section on the Earthsea Trilogy",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="none", confidence="high"),

 dict(_file="suvin.txt", feature="closing sentence",
  claim="Suvin says the closing segment of 'The New Atlantis' is rendered all the weightier for consisting of only three sentences.",
  source="Darko Suvin, 'Parables of De-Alienation', Science Fiction Studies #7 (November 1975)",
  url=U_SUV, quote="all the weightier for consisting of only three sentences", page="section on The New Atlantis",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="chronicle-line", confidence="high"),

 dict(_file="suvin.txt", feature="plainness and economy",
  claim="Suvin describes Le Guin as austerely, almost puritanically, operating a retrenchment throughout her work.",
  source="Darko Suvin, 'Parables of De-Alienation', Science Fiction Studies #7 (November 1975)",
  url=U_SUV, quote="the retrenchment she austerely", page="section on Le Guin's ideology and world-reduction",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="suvin.txt", feature="other: stylistic lineage",
  claim="Suvin attributes much of Le Guin's stylistic power and accessibility to a blend of nineteenth-century realism, lyric-poetic technique and the ethical abstraction of American romances.",
  source="Darko Suvin, 'Parables of De-Alienation', Science Fiction Studies #7 (November 1975)",
  url=U_SUV, quote="account for much of her stylistic power and accessibility", page="closing section",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="none", confidence="high"),

 dict(_file="theall.txt", feature="civic record register",
  claim="Donald F. Theall argues that because LHD's narrator is a professional cultural analyst concerned with a thorough account of the culture, the novel takes on the characteristic features of an anthropological report.",
  source="Donald F. Theall, 'The Art of Social-Science Fiction', Science Fiction Studies #7 (November 1975)",
  url=U_THE, quote="the characteristic features of an anthropological report", page="second section, on the stranger visiting a new world",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="theall.txt", feature="point of view and distance",
  claim="Theall argues that the outsider's separateness makes him observer as well as participant and so allows Le Guin a particularly descriptive approach.",
  source="Donald F. Theall, 'The Art of Social-Science Fiction', Science Fiction Studies #7 (November 1975)",
  url=U_THE, quote="allows for the particularly descriptive approach", page="second section, on the stranger visiting a new world",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="theall.txt", feature="concrete sensory noun",
  claim="Theall says the sensory experience and subjective response of Le Guin's outsiders validates the carefully chosen and believable details that compose her accounts of her worlds.",
  source="Donald F. Theall, 'The Art of Social-Science Fiction', Science Fiction Studies #7 (November 1975)",
  url=U_THE, quote="the carefully chosen and believable details", page="second section, on the stranger visiting a new world",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="theall.txt", feature="place and institution description",
  claim="Theall lists physical geography, sexual customs, cultural evolution, ideology and life-style as the categories of detail through which readers learn Le Guin's two worlds in The Dispossessed.",
  source="Donald F. Theall, 'The Art of Social-Science Fiction', Science Fiction Studies #7 (November 1975)",
  url=U_THE, quote="details of physical geography, sexual customs, cultural evolution, ideology", page="second section",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="theall.txt", feature="civic record register",
  claim="Theall quotes LHD's narrator declaring that he will make his report as if he told a story.",
  source="Donald F. Theall quoting The Left Hand of Darkness §1, in Science Fiction Studies #7 (November 1975)",
  url=U_THE, quote="I'll make my report as if I told a story", page="block quotation in the second section",
  kind="analysis", polarity="applies", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="theall.txt", feature="place and institution description",
  claim="Theall links a Puritan or Yankee tradition to Le Guin's sensibility as it shows in descriptions of the rigors of Karhide and the asceticism of Anarres.",
  source="Donald F. Theall, 'The Art of Social-Science Fiction', Science Fiction Studies #7 (November 1975), note 1",
  url=U_THE, quote="the rigors of Karhide or the asceticism of Anarres", page="endnote 1",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="medium"),

 dict(_file="bierman.txt", feature="proverbs and sayings",
  claim="Judah Bierman identifies sententiae as the constant feature of Le Guin's style in The Dispossessed.",
  source="Judah Bierman, 'Ambiguity in Utopia: The Dispossessed', Science Fiction Studies #7 (November 1975)",
  url=U_BIE, quote="the sententiae that are her style", page="section on the ansible",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="chronicle-line", confidence="high"),

 dict(_file="bierman.txt", feature="plainness and economy",
  claim="Bierman disputes that Le Guin is a plain storyteller, saying she is rarely a simple, straightforward one.",
  source="Judah Bierman, 'Ambiguity in Utopia: The Dispossessed', Science Fiction Studies #7 (November 1975)",
  url=U_BIE, quote="Le Guin is rarely a simple, straightforward storyteller", page="section following the discussion of the ansible",
  kind="analysis", polarity="disputes", date="1975-11", routeHint=RH,
  registerHint="none", confidence="high"),

 dict(_file="huntington.txt", feature="place and institution description",
  claim="John Huntington says Karhide's feudal monarchy is realised with a care for the way politics works in that archaic system which is new to Le Guin.",
  source="John Huntington, 'Public and Private Imperatives in Le Guin's Novels', Science Fiction Studies #7 (November 1975)",
  url=U_HUN, quote="a care for the way politics works in this", page="section on LHD's political structures",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="barbour.txt", feature="metaphor discipline",
  claim="Douglas Barbour identifies the wall, introduced on the first page of The Dispossessed, as one major local image running through the novel.",
  source="Douglas Barbour, 'Wholeness and Balance: An Addendum', Science Fiction Studies #7 (November 1975)",
  url=U_BAR, quote="One major local image—a brilliantly ambiguous one—is the wall", page="third paragraph",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="none", confidence="high"),

 dict(_file="leguin.txt", feature="consequence on a household",
  claim="Le Guin complains that science fiction never makes the poor and the hard-working into persons.",
  source="Ursula K. Le Guin, 'American SF and the Other', Science Fiction Studies #7 (November 1975)",
  url=U_LEG, quote="Where are the poor, the people who work hard", page="fourth paragraph",
  kind="own-words", polarity="rejects", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="leguin.txt", feature="consequence on a household",
  claim="Le Guin states that in science fiction the people are not people but masses existing to be led by their superiors.",
  source="Ursula K. Le Guin, 'American SF and the Other', Science Fiction Studies #7 (November 1975)",
  url=U_LEG, quote="They are masses, existing for one purpose: to be led", page="fifth paragraph",
  kind="own-words", polarity="rejects", date="1975-11", routeHint=RH,
  registerHint="dossier-archivist", confidence="high"),

 dict(_file="watson.txt", feature="metaphor discipline",
  claim="Ian Watson reads Le Guin's phrase for the forest paths as a neural simile that supports an impression that the forest is conscious.",
  source="Ian Watson, 'The Forest as Metaphor for Mind', Science Fiction Studies #7 (November 1975)",
  url=U_WAT, quote="a neural simile which supports the impression", page="early section on The Word for World is Forest",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="none", confidence="high"),

 dict(_file="nudelman.txt", feature="other: structural iconicity",
  claim="Rafail Nudelman identifies thorough iconicity as the essential structural principle of Le Guin's SF, each episode being an image of the whole.",
  source="Rafail Nudelman, 'An Approach to the Structure of Le Guin's SF', Science Fiction Studies #7 (November 1975)",
  url=U_NUD, quote="its thorough iconicity", page="section on radial linkage",
  kind="analysis", polarity="asserts", date="1975-11", routeHint=RH,
  registerHint="none", confidence="medium"),
]
