# find-wolfe-close — raw notes (Opus finder, close-reading angle)
Started 2026-09-06. Prior round left raw captures in sweep/wolfe-close-raw/ (fetched 07:55-07:58, no notes, no found file) — reused, every quote re-verified against the bytes on disk and, for the Urth list, against a freshly pulled Wayback capture of identical byte size.

## Route notes
- lists.urth.net is DEAD from here (curl returns 000, two attempts, live + follow-redirects). Working route = Wayback raw capture:
  https://web.archive.org/web/2021id_/http://lists.urth.net/pipermail/urth-urth.net/2006-September/<N>.html
  Byte sizes of the Wayback captures match the locally saved live captures exactly (058531: 7128; 002915: 6881; 002922: 6778; 002935: 5541).
- Plain-text mailing-list bodies are hard-wrapped at ~70 cols: every quote taken from them is confined to ONE source line so it stays contiguous with no newline.
- sffchronicles/metafilter/reactor/katemacdonald/markrkelly all fetched fine as raw HTML; text extracted with h2t.py (an HTMLParser strip). sffchron's extraction SQUASHES some inter-word spaces ("usually,in my opinion") — quotes chosen to avoid those runs.

## Sources read
1. Matthew Keeley, "How Gene Wolfe Starts a Story (and Where to Start Reading His Work)", Reactor (Tor.com), 2017-11-09. https://reactormag.com/how-gene-wolfe-starts-a-story-and-where-to-start-reading-his-work/
   - 5HC's first line is a riff on Proust's; the missing comma in "my brother David" is a grammatical clue the book eventually explains; a single first-person sentence near the end of a third-person book reframes the whole.
2. Mark R. Kelly, "Rereading Gene Wolfe's 'The Fifth Head of Cerberus'", Views from Crestmont Drive, 2014-07-03. https://www.markrkelly.com/Blog/2014/07/03/rereading-gene-wolfes-the-fifth-head-of-cerberus/
   - narrator "describes his surroundings at face value"; an underlying real story the POV character does not grasp; the brothel fact "develops"; Joan Gordon (1986) relayed on small details (the 666 address).
3. Kate Macdonald, "Gene Wolfe's The Shadow of the Torturer", 2017-01-09. https://katemacdonald.net/2017/01/09/gene-wolfes-the-shadow-of-the-torturer/
   - trade mysteries left unexplained; coinages mainly nouns, meaning obvious in context; destrier = a real word re-pointed; the frame invites reading the books as "histories, reports, assessments, commentaries" (CIVIC RECORD REGISTER — best single line in the sweep for the dossier); clinical viewpoint; the torture scene's omissions.
4. MetaFilter, "Gene Wolfe: The Reliably Unreliable Author", 2015-05-08. https://www.metafilter.com/149475/Gene-Wolfe-The-Reliably-Unreliable-Author
   - user straight: the blind man never named as blind; "Everything means something, but not everything means very much" (attributed to Wolfe BY A READER — relay, not primary); deliberate frustration of expectations.
   - user RogerB DISPUTES the ambiguity reading: puzzle assembled from careful cluing, not epistemic uncertainty.
   - user Pseudoephedrine: horror revealed by what "slips through" the narration.
   - user Ipsifendus: the typo anecdote — a contradiction he took for a clue; Wolfe answered by letter: "Typo."
5. SFF Chronicles thread 11050, "The Fifth Head of Cerberus (caution: spoilers!)", opened 2006-06-13 by iansales (Ian Sales), with a long 2013-03-24 analysis by felicibusbrevis written for the Urth list. https://www.sffchronicles.com/threads/11050/
   - Sales: opening reads as a conventional childhood memory, then three paragraphs in the father trades in children; 'V.R.T.' is built out of taped interviews, field journal, interrogation transcripts, prison diary read by an officer deciding an incarceration; the ballistics table the authorities read as proof of assassination.
   - felicibusbrevis: "objective outside detail ... at the heart of getting to the bottom of things in Wolfe"; "A Story" written in a different (mythic dream) register.
6. SFF Chronicles thread 528814, "Peace (*SPOILERS*)", opened 2010-09-14. https://www.sffchronicles.com/threads/528814/ — thin; one usable reader attestation (taking things at face value and missing the allusions).
7-10. Urth mailing list, "Close Reading: Torturer Chapter I", September 2006 (four messages read in full):
   058531 JWillard 2006-09-04 (the project proposal + chapter-1 observations)
   002915 "b sharp" 2006-09-05
   002922 Dan'l Danehy-Oakes 2006-09-05
   002935 Roy C. Lackey 2006-09-05
   - JWillard: "I don't believe in trivial trivia"; "why I walk through Wolfe like a minefield"; the hedge word "perhaps" as an unreliability signal.
   - Danehy-Oakes: the first sentence as a time-signal, the first page dense with forward references; the fight "more like a real fight than most in fiction"; the narrator's own offered explanation "doesn't wash".
   - Lackey: COUNTER-EVIDENCE — the pistol contradiction is repeated in the Citadel appendix, "so the mistake is probably Wolfe's" (i.e. some anomalies are authorial error, not narratorial unreliability). Pairs with the MetaFilter "Typo." letter.

## Still to do
- YouTube caption routes for the two saved video ids (7zvBdTEaJ1M, T4GYEQynCv0) — caption URLs saved by the prior finder are signed and expire.
- Ultan's Library (ultan.org.uk), Alzabo Soup, r/genewolfe, Wolfe Wiki, blackgate, "Rereading Wolfe" series, Peace close readings (the elm tree / the fall).
