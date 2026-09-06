import json, sys
SOURCES=[]
CLAIMS=[]
def S(**k): SOURCES.append(k)
def C(**k): CLAIMS.append(k)

# ---------- 1 Fafnir review of Young ----------
FAF="https://journal.finfar.org/articles/book-review-george-r-r-martin-and-the-fantasy-form/"
S(title="Book Review: George R. R. Martin and the Fantasy Form (C. Palmer-Patel), Fafnir 9.1: 117-121",
  url=FAF, kind="analysis", substantive=True, date="2022", route="curl with browser user agent (live page)")
C(feature="concrete sensory noun",
  claim="Reviewing Young's monograph, Palmer-Patel reports that Martin repeatedly makes authorial choices directing the reader to notice filth and other low mimetic markers.",
  source="C. Palmer-Patel, book review, Fafnir - Nordic Journal of Science Fiction and Fantasy Research 9.1 (2022)",
  url=FAF, quote="makes authorial choices that direct the reader to take note of", page="review body, discussion of Chapter 1",
  kind="analysis", polarity="asserts", date="2022", routeHint="curl with browser user agent (live page)",
  registerHint="dossier-archivist", confidence="high")
C(feature="point of view and distance",
  claim="Palmer-Patel reports that Young classifies A Song of Ice and Fire mostly as immersive fantasy, a structure in which the world is focalised by characters already familiar with it.",
  source="C. Palmer-Patel, book review, Fafnir 9.1 (2022), reporting Joseph Rex Young",
  url=FAF, quote="focalised by characters already familiar with it", page="review body, discussion of Chapter 3",
  kind="analysis", polarity="applies", date="2022", routeHint="curl with browser user agent (live page)",
  registerHint="dossier-archivist", confidence="high")
C(feature="other: genre convention use vs subversion",
  claim="Palmer-Patel quotes Young's thesis that Martin, rather than abandoning or subverting his genre's conventions, is using them particularly well.",
  source="Joseph Rex Young, quoted at p.5 in C. Palmer-Patel's review, Fafnir 9.1 (2022)",
  url=FAF, quote="is actually using them particularly well", page="review body, quoting Young p.5",
  kind="analysis", polarity="asserts", date="2022", routeHint="curl with browser user agent (live page)",
  registerHint="none", confidence="high")

# ---------- 2 JTR review of Young + Honegger ----------
JTR="https://scholar.valpo.edu/journaloftolkienresearch/vol18/iss1/7/"
RT="live PDF 403; Wayback raw capture https://web.archive.org/web/20250602181043id_/https://scholar.valpo.edu/cgi/viewcontent.cgi?article=1357&context=journaloftolkienresearch, pypdf text extract"
S(title="Review of Young, George R.R. Martin and the Fantasy Form (2019) and Honegger, Tweaking Things a Little (2023), by Andrew Higgins, Journal of Tolkien Research 18.1 art.7",
  url=JTR, kind="analysis", substantive=True, date="2023", route=RT)
C(feature="register modulation",
  claim="Higgins reports that Young finds Martin using a low mimetic register in both his characters and his descriptions.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Joseph Rex Young",
  url=JTR, quote="register in both his characters and descriptions", page="p.3 of PDF, on Young's Chapter 1",
  kind="analysis", polarity="asserts", date="2023", routeHint=RT, registerHint="dossier-archivist", confidence="high")
C(feature="place and institution description",
  claim="Higgins observes in his own voice that Tolkien never gives details of what the refuse situation must have been like in a besieged Gondor, a concreteness he credits to Martin's low mimetic manner.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023)",
  url=JTR, quote="the refuse situation must have been like in a besieged Gondor", page="p.3 of PDF",
  kind="analysis", polarity="asserts", date="2023", routeHint=RT, registerHint="dossier-archivist", confidence="high")
C(feature="annalist voice and deep time",
  claim="Higgins quotes Young that Martin's entire written world appears to be a shadow of its former self, subject to decline from past glories.",
  source="Joseph Rex Young, quoted at p.69 in Andrew Higgins's review, Journal of Tolkien Research 18.1 (2023)",
  url=JTR, quote="appears to be a shadow of its former self", page="p.4 of PDF, quoting Young p.69",
  kind="analysis", polarity="asserts", date="2023", routeHint=RT, registerHint="chronicle-line", confidence="high")
C(feature="annalist voice and deep time",
  claim="Higgins quotes Young that Martin's narrative is shot through with references to and insinuations of a cleaner, nobler past.",
  source="Joseph Rex Young, quoted at p.67 in Andrew Higgins's review, Journal of Tolkien Research 18.1 (2023)",
  url=JTR, quote="references to and insinuations of a cleaner, nobler past", page="p.4 of PDF, quoting Young p.67",
  kind="analysis", polarity="asserts", date="2023", routeHint=RT, registerHint="chronicle-line", confidence="high")
C(feature="omission as information",
  claim="Higgins reports that Honegger applies Hemingway's literary iceberg to Martin, the idea that stories are strengthened by leaving things or events out.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Thomas Honegger",
  url=JTR, quote="stories are strengthened by leaving things or events out", page="p.5 of PDF, on Honegger's world-building chapter",
  kind="analysis", polarity="applies", date="2023", routeHint=RT, registerHint="dossier-archivist",
  confidence="medium — Honegger's argument reported at one remove by the reviewer")
C(feature="other: worldbuilding order",
  claim="Higgins reports Honegger's finding that Martin invented his world from the top down, with the backstories invented after the main narratives.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Thomas Honegger",
  url=JTR, quote="with the backstories being invented after the main narratives", page="p.5 of PDF",
  kind="analysis", polarity="asserts", date="2023", routeHint=RT, registerHint="chronicle-line",
  confidence="medium — Honegger's argument reported at one remove by the reviewer")
C(feature="annalist voice and deep time",
  claim="Higgins reports Honegger's argument that Martin's in-narrative poems create the sense of an older transmitted oral tradition.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Thomas Honegger",
  url=JTR, quote="the sense of an older transmitted oral tradition", page="p.5 of PDF, on the three poems",
  kind="analysis", polarity="asserts", date="2023", routeHint=RT, registerHint="herald-pools",
  confidence="medium — Honegger's argument reported at one remove by the reviewer")
C(feature="diction (native vs latinate)",
  claim="Higgins reproduces Martin's own statement, cited by Honegger, that he does not have a gift for languages.",
  source="George R. R. Martin, interview quoted by Honegger at p.159, reproduced in Andrew Higgins's review, Journal of Tolkien Research 18.1 (2023)",
  url=JTR, quote="have a gift for languages", page="p.6 of PDF, quoting Honegger p.159",
  kind="relay", polarity="asserts", date="2023", routeHint=RT, registerHint="none",
  confidence="medium — Martin's words at two removes, the original interview not dated in this source")
C(feature="naming and forms of address",
  claim="Higgins reports Honegger's finding that Martin's language invention amounts to a handful of invented words for the Dothraki.",
  source="Andrew Higgins, review, Journal of Tolkien Research 18.1 (2023), reporting Thomas Honegger",
  url=JTR, quote="a handful of invented words for the Dothraki", page="p.6 of PDF",
  kind="analysis", polarity="asserts", date="2023", routeHint=RT, registerHint="none",
  confidence="medium — Honegger's argument reported at one remove by the reviewer")

# ---------- 3 Math Horizons ----------
MH="https://digitaleditions.walsworthprintgroup.com/article/Network+Of+Thrones/2426397/294160/article.html"
RMH="tandfonline 403; full article text via the Math Horizons digital edition (Walsworth), curl with browser user agent"
S(title="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (April 2016) 18-22",
  url=MH, kind="measurement", substantive=True, date="2016-04", route=RMH)
C(feature="stylometry",
  claim="Beveridge and Shan build their A Storm of Swords character network with 107 vertices representing characters.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=MH, quote="The 107 vertices represent the characters", page="section 'The Social Network'",
  kind="measurement", polarity="asserts", date="2016-04", routeHint=RMH, registerHint="none", confidence="high")
C(feature="naming and forms of address",
  claim="Beveridge and Shan generated network edges by incrementing a weight whenever two characters' names or nicknames appeared within 15 words of one another in the ebook.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=MH, quote="appeared within 15 words of one another", page="section 'The Social Network'",
  kind="measurement", polarity="applies", date="2016-04", routeHint=RMH, registerHint="none", confidence="high")
C(feature="other: narrative community structure",
  claim="Beveridge and Shan report that the King's Landing community accounts for 37 percent of their A Storm of Swords network.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=MH, quote="community accounts for 37 percent of the network", page="section 'Community Detection'",
  kind="measurement", polarity="asserts", date="2016-04", routeHint=RMH, registerHint="none", confidence="high")
C(feature="other: narrative community structure",
  claim="Beveridge and Shan report that the network layout and colours identify seven communities in A Storm of Swords.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=MH, quote="clearly identify seven communities", page="section 'Community Detection'",
  kind="measurement", polarity="asserts", date="2016-04", routeHint=RMH, registerHint="none", confidence="high")
C(feature="other: character prominence measurement",
  claim="Beveridge and Shan report that betweenness centrality is the only one of their six measures in which Tyrion does not come out on top.",
  source="Andrew Beveridge and Jie Shan, 'Network of Thrones', Math Horizons 23.4 (2016)",
  url=MH, quote="the only measure in which Tyrion does not come out on top", page="section 'Centrality Measures'",
  kind="measurement", polarity="asserts", date="2016-04", routeHint=RMH, registerHint="none", confidence="high")

# ---------- 4 PNAS ----------
PN="https://www.pnas.org/doi/10.1073/pnas.2006465117"
RPN="pnas.org 403; author accepted PDF from Warwick Research Archive Portal (wrap.warwick.ac.uk/144216), pypdf text extract"
S(title="Gessey-Jones, Connaughton, Dunbar, Kenna, MacCarron, O'Conchobhair, Yose, 'Narrative structure of A Song of Ice and Fire creates a fictional world with realistic measures of social complexity', PNAS 117.46 (2020)",
  url=PN, kind="measurement", substantive=True, date="2020-11", route=RPN)
C(feature="stylometry",
  claim="Gessey-Jones and colleagues identified characters across the five books of whom 1,806 interact with another at least once.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)",
  url=PN, quote="of which 1,806 interact with another at least once", page="Results, 'Evolution of the Social Network Structure'",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=RPN, registerHint="none", confidence="high")
C(feature="other: cast size per unit of text",
  claim="Gessey-Jones and colleagues found that the number of characters per chapter settles at around 35 after the opening book.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)",
  url=PN, quote="the number of characters per chapter settles at around 35", page="Results, 'Evolution of the Social Network Structure'",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=RPN, registerHint="none", confidence="high")
C(feature="point of view and distance",
  claim="Gessey-Jones and colleagues state that A Song of Ice and Fire is presented from the personal perspectives of 24 point of view characters.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)",
  url=PN, quote="presented from the personal perspectives of 24 point of view", page="Results, opening paragraph",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=RPN, registerHint="none", confidence="high")
C(feature="point of view and distance",
  claim="Gessey-Jones and colleagues measured the 14 major point of view characters as having an average degree of 154.0 within the network of all characters.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)",
  url=PN, quote="have an average degree of 154.0 within the network", page="Results, 'Evolution of the Social Network Structure'",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=RPN, registerHint="none", confidence="high")
C(feature="other: event scheduling and unpredictability",
  claim="Gessey-Jones and colleagues found the distribution of intervals between significant deaths measured in chapters to be geometric rather than power law.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)",
  url=PN, quote="geometric rather than power law", page="Abstract",
  kind="measurement", polarity="asserts", date="2020-11", routeHint=RPN, registerHint="chronicle-line", confidence="high")
C(feature="other: interaction extraction method",
  claim="Gessey-Jones and colleagues counted two characters as having interacted if they directly meet or the text makes it explicitly clear they knew one another.",
  source="Gessey-Jones et al., PNAS 117.46 (2020)",
  url=PN, quote="if they directly meet each other or it is explicitly", page="Materials and Methods",
  kind="measurement", polarity="applies", date="2020-11", routeHint=RPN, registerHint="none", confidence="high")

# ---------- 5 Fafnir review of Carroll ----------
FC="https://journal.finfar.org/articles/book-review-medievalism-in-a-song-of-ice-and-fire-and-game-of-thrones/"
S(title="Book Review: Medievalism in A Song of Ice and Fire and Game of Thrones (Don Riggs), Fafnir 6.2: 73-75",
  url=FC, kind="analysis", substantive=True, date="2019", route="curl with browser user agent (live page)")
C(feature="other: authenticity claim",
  claim="Riggs reports that Carroll's main thrust is that Martin uses an argument from authenticity to justify his treatment of women, violence and non-Westerosi characters.",
  source="Don Riggs, book review, Fafnir 6.2 (2019), reporting Shiloh Carroll",
  url=FC, quote="Martin uses an argument from", page="review body, opening paragraph",
  kind="analysis", polarity="disputes", date="2019", routeHint="curl with browser user agent (live page)",
  registerHint="none", confidence="high")
C(feature="withheld information and inference",
  claim="Riggs reports that Carroll sees Martin taking up medieval romance tropes only to subvert them by curtailing the reader's expectation with real-life intrusions.",
  source="Don Riggs, book review, Fafnir 6.2 (2019), reporting Shiloh Carroll",
  url=FC, quote="curtailing the reader", page="review body, on the chapter 'Romance and Anti-Romance'",
  kind="analysis", polarity="asserts", date="2019", routeHint="curl with browser user agent (live page)",
  registerHint="none", confidence="high")
C(feature="place and institution description",
  claim="Riggs quotes Carroll's closing judgement that in reaching for realism Martin created compelling characters, complex plots and subplots, and a masterpiece of worldbuilding.",
  source="Shiloh Carroll, quoted at p.182 in Don Riggs's review, Fafnir 6.2 (2019)",
  url=FC, quote="Martin has created compelling characters, complex plots and subplots", page="review body, quoting Carroll p.182",
  kind="analysis", polarity="asserts", date="2019", routeHint="curl with browser user agent (live page)",
  registerHint="none", confidence="high")

# ---------- 6 Public Medievalist, Carroll ----------
PM="https://publicmedievalist.com/grimdark-medievalism/"
S(title="Shiloh Carroll, 'Grimdark Medievalism in A Song of Ice and Fire', The Public Medievalist, 15 May 2018",
  url=PM, kind="analysis", substantive=True, date="2018-05-15", route="curl with browser user agent (live page)")
C(feature="register modulation",
  claim="Carroll characterises Martin's medievalism, his way of reimagining the Middle Ages, as violent, dark, brutal, and relentlessly masculine.",
  source="Shiloh Carroll, 'Grimdark Medievalism in A Song of Ice and Fire', The Public Medievalist (2018)",
  url=PM, quote="violent, dark, brutal, and relentlessly masculine", page="section 'Fantasy for People Who Hate Fantasy'",
  kind="analysis", polarity="asserts", date="2018-05-15", routeHint="curl with browser user agent (live page)",
  registerHint="none", confidence="high")
C(feature="concrete sensory noun",
  claim="Carroll argues Martin goes too far in counteracting a rosy vision of the past with one covered in mud.",
  source="Shiloh Carroll, 'Grimdark Medievalism in A Song of Ice and Fire', The Public Medievalist (2018)",
  url=PM, quote="counteracting a rosy vision of the past with one covered in mud",
  page="section 'Fantasy for People Who Hate Fantasy'",
  kind="analysis", polarity="disputes", date="2018-05-15", routeHint="curl with browser user agent (live page)",
  registerHint="dossier-archivist", confidence="high")
C(feature="other: realism justification",
  claim="Carroll quotes Martin's own defence that it is fundamentally dishonest to write a war story and leave rape out.",
  source="George R. R. Martin, quoted by Shiloh Carroll, The Public Medievalist (2018)",
  url=PM, quote="fundamentally dishonest if you write a war story and you leave that out",
  page="section 'A Savage Beast in Every Man'",
  kind="own-words", polarity="asserts", date="2018-05-15", routeHint="curl with browser user agent (live page)",
  registerHint="none", confidence="medium — Martin's words as quoted in Carroll's article, original interview not identified on the page")

out={"complete": False,
     "coverage": "IN PROGRESS — 6 substantive sources read raw so far.",
     "sourcesRead": SOURCES, "claims": CLAIMS}
json.dump(out, open("/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-martin-scholarship.json","w"), indent=1, ensure_ascii=False)
print("sources",len(SOURCES),"claims",len(CLAIMS))
