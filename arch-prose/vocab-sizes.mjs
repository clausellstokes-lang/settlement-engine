import { SENSORY_NOUNS, SENSE_OF_NOUN } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/src/domain/prose/presenceMeasure.js';
import * as L from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/src/domain/prose/entryLexicons.js';
import { TABLE_COLUMNS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/src/domain/institutions/institutionTable.js';
import { SAFETY_BANDS, STABILITY_BANDS, COMPLEXITY_LABEL, COMPLEXITY_BAND_BY_LABEL } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/domain/display/labelBands.js';
import { STATE_MARK_DIMENSIONS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/domain/display/stateProse/stateProseKernel.js';
let tot=0; for (const [s,n] of Object.entries(SENSORY_NOUNS)) { console.log(`sensory ${s}: ${n.length}`); tot+=n.length; }
console.log(`sensory listed ${tot} · DISTINCT nouns after the one-bucket partition ${Object.keys(SENSE_OF_NOUN).length}`);
console.log(`SAFETY_BANDS ${SAFETY_BANDS.length} · STABILITY_BANDS ${STABILITY_BANDS.length} · COMPLEXITY labels ${Object.keys(COMPLEXITY_LABEL).length} · distinct complexity BAND words ${new Set(Object.values(COMPLEXITY_BAND_BY_LABEL)).size}`);
console.log(`BAND_PHRASES ${L.BAND_PHRASES.length} · COUNT_NOUNS ${L.COUNT_NOUNS.length} · QUANTIFIERS ${L.QUANTIFIERS.length} · CARDINAL_WORDS ${L.CARDINAL_WORDS.length} · AUTHORED_MAGNITUDES ${L.AUTHORED_MAGNITUDES.length}`);
console.log(`DUTY_PREDICATES ${L.DUTY_PREDICATES.length} · DUTY_STEM_NOUNS ${L.DUTY_STEM_NOUNS.length} · EXEMPTION_LEMMAS ${L.EXEMPTION_LEMMAS.length} · AMBIGUOUS ${L.AMBIGUOUS_EXEMPTION_LEMMAS.length} · OFFICE_NOUN_CANDIDATES ${L.OFFICE_NOUN_CANDIDATES.length} · RELATION_LEMMAS ${L.RELATION_LEMMAS.length}`);
console.log(`BAND_EQUIVALENCE classes ${L.BAND_EQUIVALENCE.length} · SMALL_PARTICULARS ${L.SMALL_PARTICULARS.length} · CLOSE_KINDS ${Object.keys(L.CLOSE_KINDS).length}`);
console.log(`PROVENANCE_LEXICONS ${Object.entries(L.PROVENANCE_LEXICONS).map(([k,v])=>k+':'+v.length).join(' · ')}`);
console.log(`SUPPLY_CLAIM_LEXICONS ${Object.entries(L.SUPPLY_CLAIM_LEXICONS).map(([k,v])=>k+':'+v.length).join(' · ')}`);
console.log(`TABLE_COLUMNS ${TABLE_COLUMNS.length}: ${TABLE_COLUMNS.join(', ')}`);
console.log(`STATE_MARK_DIMENSIONS ${Object.entries(STATE_MARK_DIMENSIONS).map(([k,v])=>k+':'+v.length).join(' · ')}`);
