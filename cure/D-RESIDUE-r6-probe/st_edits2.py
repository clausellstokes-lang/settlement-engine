import json
E=[]
def e(o,n): E.append([o,n])
B=" [CURED 2026-10-19 (fp-final r6) — RULINGS-ROUND6 B.2: one store, one door]"
e("the one writer returns the at-hand courts' sightings — written into the holder's own belief record by its owner's door, none for an id-less gang,",
  "the one writer returns the at-hand courts' sightings — written into MN's ONE sighting store by `recordSighting` (subject the holder)"+B+", none for an id-less gang,")
e("returns the at-hand courts' sightings for the holder's belief owner (A.5) — the first telling",
  "returns the at-hand courts' sightings for MN's one door `recordSighting` (A.5 · B.2)"+B+" — the first telling")
e("(written into the taker's own belief record by its owner's door, A.5)",
  "(written into MN's one sighting store by `recordSighting`, A.5 · B.2"+B+")")
e("the at-hand courts' sightings are rows of the HOLDER'S OWN belief record (MN's, THE BODIES'), written by its owner's door at the act",
  "the at-hand courts' sightings are rows of MN's ONE sighting store (`spatialLedgers.sightings`, keyed court × subject), written by its one door `recordSighting` at the act"+B)
e("a patrol's LOOK at a site is a SIGHTING written by PR into the HOLDER'S OWN belief record (MN's for a menace, THE BODIES' for a body) by its owner's door",
  "a patrol's LOOK at a site is a SIGHTING written by PR through MN's one door `recordSighting` into the one store (B.2)"+B)
e("the sightings need their belief owners (MN's record for a menace, THE BODIES' for a body; with THE BODIES dark a body holder is believed by the told arm alone, as an id-less gang is)",
  "the sightings need MN's ONE store (`spatialLedgers.sightings`, built at MN-3; a menace-subject row where MN is lit, a body-subject row where THE BODIES are lit — with THE BODIES dark a body holder is believed by the told arm alone, as an id-less gang is)"+B)
e("writes Kell's sighting into THE BODIES' `believedBodyOf` by its owner's door,",
  "writes Kell's body-subject sighting into MN's one store by `recordSighting` (read by THE BODIES' `believedBodyOf`, B.2)"+B+",")
e("— whose store, door, callers and horizon are theirs (ROUTED);",
  "— whose store, door, callers and horizon are theirs (ROUTED) — ↳ r6: ONE store for both, MN's `spatialLedgers.sightings` keyed court × subject, one door `recordSighting` (RULINGS-ROUND6 B.2), and `believedDenOf` reads it BY PLACE, never by the truth holder [CURED 2026-10-19 (fp-final r6) — B.2 · ST-r5-verify A.5];")
json.dump(E,open('/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-RESIDUE-r6-probe/st_edits2.json','w',encoding='utf-8'),ensure_ascii=False)
