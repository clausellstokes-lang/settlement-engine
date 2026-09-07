# FIND: ai / THE PROCEDURAL-GENERATION BASELINE — raw notes (Opus finder, 2026-09-07)

Result file: `sweep/found-ai-procgen-baseline.json` — 68 claims, 13 sources, complete:true.
Raw fetched text kept under `sweep/raw-procgen/` (every claim re-verifiable offline against those files).

## Roster status
| roster item | status | route |
|---|---|---|
| Compton, 'So you want to build a generator...' | FETCHED | live tumblr URL, browser UA, HTML→text |
| Grinblat & Bucklew, FDG'17 | FETCHED | pcgworkshop.com PDF → pdftotext (no -layout; -layout mangles words) |
| Grinblat, 'Generating Histories' chapter (CRC 2019) | BLOCKED | Taylor & Francis paywall; only unlawful mirrors surfaced; GDC Vault talk paywalled. ZERO claims taken |
| Tarn Adams on DF history/Legends | FETCHED ×2 | Gamasutra/Game Developer 2008 (John Harris); PC Gamer 2017 (Wes Fenlon). Roguelike Celebration talk = video only, no transcript |
| James Ryan, 'Curating Simulated Storyworlds' (2018) | FETCHED | eScholarship PDF, 815 pp → pdftotext |
| Mark R. Johnson, URR | FETCHED ×2 | AISB 2015 paper PDF (cs.kent.ac.uk); 2021 dev blog. The roster's ultimaratioregum.co.uk URL 404s; his RPS columns 404 |
| Smith & Whitehead, expressive range (2010) | FETCHED | author PDF at users.soe.ucsc.edu |
| Emily Short, 'Bowls of Oatmeal and Text Generation' | FETCHED | live emshort.blog. **Dated 21 Sep 2016, not Feb 2016 as the angle stated** |
| Max Kreminski | FETCHED | 'Felt: A Simple Story Sifter' (ICIDS 2019) PDF from mkremins.github.io |

Stopping rule met: roster exhausted; last two searches (Roguelike Celebration transcript, Grinblat chapter) surfaced nothing new that was lawfully reachable.

## The spine of the angle, as the sources actually put it
1. **The mechanism has a name and it is not lexical.** Compton: mathematical uniqueness is not perceptual uniqueness ("But the user will likely just see a lot of oatmeal"). The failure is at the level of PERCEPTION of a corpus, not of any one artifact — which is exactly the dossier problem: no single dossier reads wrong, the twentieth reads same.
2. **It was measured with an instrument, in 2010, before language models.** Smith & Whitehead score 10,000 outputs on EMERGENT metrics (never the generator's own input parameters) and plot 2D histograms; the histogram exposed a linearity bias they traced to one line — a slightly increased repeat probability — and they say flatly they would never have found it without the analysis. This is the direct ancestor of a same-seed corpus histogram over dossier features.
3. **~1% survives a global critic.** Of 10,000 Launchpad levels, approximately 100 pass a good critic value. Grammars capture local constraints; global properties need a separate critic pass.
4. **The archival/encyclopedic register HAS been measured — by Grinblat & Bucklew.** Their 'gospels' are generated history texts in a fixed authorial voice, codified from a 40,000-word handwritten corpus via a replacement grammar. That is the closest published relative of the archivist dossier, and it is in the roster's favour.
5. **Their cure is the one the reconstruction should study: state as glue, domain as refrain, cause invented after the fact.** No causal logic behind event choice; the sultan's shared state holds disjoint events together; an assigned 'domain' (ice, glass, chance) recurs across the whole life as a narrative thread; and where no cause exists the event INVENTS one ("the effect causes the cause"). Coherence is manufactured by shared state and one recurring motif, not by simulation fidelity.
6. **Variety is bought with pool size, and they say so:** ten domains, nineteen events — expanding those pools is their own first item of future work. (Cf. the standing repo hazard that a pool's LENGTH is a seed input.)
7. **The cure everyone converges on: the generated detail must be load-bearing.** Emily Short: purely decorative unless tightly correlated with gameplay, and the reader starts looking past it. Johnson: foreground the generated culture in the actors, never leave it as "background" or "lore"; every visible feature of a generated book encodes a fact (bookmark = scholarly nation). Tarn Adams: named artifacts were "not that interesting" until claims and history attached to them; world-gen events that don't reach the present leave "stories that can't continue, which is bad".
8. **The counter-warning the reconstruction must hear (Ryan, quoting Lessard).** Retrieval by authored story patterns produces "the revenge for humiliation story, except with Bob instead of John" — readers see through templates. Ryan concedes a sifter can only excavate what its patterns match. Lessard's alternative is the historian's "letting the archive speak". This is the strongest live argument against a fixed move order and FOR the owner's latent-grammar directive.
9. **Uneven salience is a legitimate design answer** (Compton): most artifacts can be drab background, highlighting the few characterful ones — "Not everyone can be a main character". Ryan's version: each scenario stands against "the monotony of everyday existence".
10. **Compton's diagnosis of pool-and-template architecture is unflattering and precise:** distribution methods over words lack "enough structure to make interesting meaning"; parametric variation gives "something new, but never something surprising"; grammars "do not have a way to handle constraints". All three describe SettlementForge's own architecture.
11. **Cost honesty.** Short: procgen is "not a substitute for designing content" and is "at least as labor-intensive as other ways". Kreminski: it proved near-impossible to anticipate the questions an author would want to ask, so they shipped a query language instead of a fixed function library.

## Attribution traps handled
- The "10,000 bowls of plain oatmeal" phrasing in the Emily Short post is a READER's comment (Dryman) quoting Compton, not Short's own words — logged kind=reader.
- "the aesthetics of big numbers is dead" (Mike Cook) and "size alone is not enough to sustain interest" (Gillian Smith) reach us only through Ryan quoting a 2016 New Scientist piece — both logged kind=relay.
- The Lessard critique is a reviewer's comment quoted in Ryan's dissertation, not Ryan's own position; Ryan's own concession is a separate claim.
- Every claim's modelEra says PRE-LLM plus the year and the register measured; none of these sources observed a language model. That is the point of the angle and must not be blurred in synthesis.

## Extraction hazard for the verifier
`pdftotext -layout` on grinblat2017.pdf mangles words ("Subv erting", "real-lifehistoriesaretangled"). Plain `pdftotext` (no -layout) reflows cleanly and is the extraction every Grinblat quote was verified against. Same for the Ryan and Smith PDFs.
