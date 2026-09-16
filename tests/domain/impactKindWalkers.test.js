/**
 * impactKindWalkers.test.js — the impactKind coverage walkers (content-immersion-r2-1/-2).
 *
 * Two registration walkers over the impactKinds the engine MINTS (source-scanned from
 * every `impactKind: '<literal>'` write site in src/domain). They stop the two display
 * surfaces from silently lagging the engine as new waves add impactKinds:
 *
 *   1. PHRASING (content-immersion-r2-2): every minted impactKind must have an explicit
 *      WHAT_PHRASES entry in settlementRumors.js, so a rumor headline never renders a raw
 *      de-underscored slug ("Merchants bring word of generosity relief"). Reds until phrased.
 *
 *   2. VOICE (content-immersion-r2-1): every minted impactKind must be CLASSIFIED in the
 *      EXPECTED_VOICE manifest below — either to a real crier VoiceCategory or explicitly to
 *      null (no voice). A new mint reds this until its author decides whether it deserves a
 *      crier line, which — with the set-but-unclassified guard in newsVoiceCategory — is what
 *      keeps a boom from borrowing the trade crier's market-shortage line.
 *
 * The manifest-walker idiom (structural prevention §2): discovery is automatic (the scan),
 * registration is manual (WHAT_PHRASES + EXPECTED_VOICE), and these tests force them together.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { newsVoiceCategory } from '../../src/domain/display/newsVoice.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOMAIN = join(ROOT, 'src', 'domain');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

// Every `impactKind: '<literal>'` minted by a domain kernel/news-builder. (Dynamic
// `impactKind: <var>` assignments — the proposal candidateType path, where
// applyWorldPulse stamps `impactKind: outcome.candidateType || outcome.type` — are out
// of this literal scan's reach; that sibling path is covered by its own walker,
// candidateTypeVoicePhrasing.walker.test.js, which locks the phrasing + no-mis-voice
// invariants for every minted candidateType.)
const MINT_RE = /impactKind:\s*['"]([a-z][a-z0-9_]*)['"]/g;

function mintedImpactKinds() {
  const kinds = new Set();
  for (const abs of walk(DOMAIN)) {
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(MINT_RE)) kinds.add(m[1]);
  }
  return [...kinds].sort();
}

// The VOICE classification of every minted impactKind: a crier VoiceCategory, or null for
// "no voice" (out of scope — the crier stays silent). A new minted kind must be added here
// (the exact-set test below fails otherwise), forcing a conscious voice decision.
const EXPECTED_VOICE = {
  // voiced beats
  boom: 'prosperity', flourishing: 'prosperity', reconstruction: 'prosperity',
  bust: 'trade', calamity: 'calamity', plague_arrival: 'pestilence', generosity_relief: 'succor',
  // deliberately unvoiced (no crier beat for these impacts)
  belief_misjudgment: null, blockade_declared: null, blockade_lifted: null, cause_lifecycle: null, diplomacy: null,
  // WR-2 disposition receipts already carry their own authored house-voice line.
  // None borrows a generic crier category: the war/trade cells describe active
  // blows and shortages, while these records describe learned temper and temple
  // pressure. The explicit null is the voice decision, not a classifier accident.
  disposition_martial_crossed: null,
  disposition_mercantile_crossed: null,
  disposition_diplomatic_crossed: null,
  disposition_insular_crossed: null,
  disposition_reversal: null,
  deity_war_pressure: null,
  deity_peace_pressure: null,
  war_culture_suppressed: null,
  // WR-3's graduation beat owns its authored lineage sentence; it must not
  // borrow a generic events or war crier voice on top of that receipt.
  lineage_edge_recorded: null,
  // TE-DENSITY-1 (§810.4 R18 / §810.3 R14): a house ending because its roster emptied, and
  // a ruling seat left standing empty, both carry their own authored in-world receipt naming
  // the house and the town. Neither borrows a crier VoiceCategory — there is no existing
  // category for "a polity ceased to exist", and inventing one to cover two beats would put
  // a generic voice over a line that already says the specific thing (the lineage_edge_recorded
  // and npc_ladder precedents exactly). The explicit null IS the voice decision.
  faction_dissolved: null,
  faction_interregnum: null,
  // §810.1 R7/R9's cadence beats join them for the same reason: a house rising or
  // folding is a court beat that already names the house and the town in its own line.
  faction_seat_formed: null,
  faction_seat_folded: null,
  faction_capture: null, field_battle: null, generosity_credit_default: null,
  generosity_purchase: null, generosity_refuge: null, generosity_refusal: null,
  generosity_trade_overture: null, harvest: null, hierarchy_cascade: null, hungry_gap: null,
  intervention: null, intervention_clash: null, moral_reckoning: null, pantheon_ascendancy: null,
  pantheon_extinction: null, pantheon_twilight: null, queue_refused: null, realm_verb_refused: null, sea_battle: null,
  spring_thaw: null, stressor_aftermath: null, stressor_graduated: null, stressor_wind_down: null,
  // THE GROWTH LAYER (owner commission #36): a person weathering into a learned trait is a
  // quiet local character beat, NOT a town-crier proclamation — deliberately unvoiced.
  npc_growth: null,
  // THE URBAN FABRIC LAYER (owner commission #39): stone turning at masonry pace is a
  // quiet chronicle beat, NOT a town-crier proclamation — deliberately unvoiced (the
  // npc_growth precedent; catastrophe itself is already voiced via the calamity beat).
  urban_fabric: null,
  // CAPACITY C1 — THE CROWDING LINE: a settlement meeting the wall of what its own
  // fields or ground can hold is a chronicle beat that already names the place and
  // says what the wall is, in two authored sentences. A crier category on top of that
  // would put a generic voice over a line that already says the specific thing (the
  // urban_fabric and npc_growth precedents exactly). The explicit null IS the decision.
  population_crowding: null,
  // DOOR 1 — THE SPATIAL CONSEQUENCE LAYER (owner ruling #8): WHERE a calamity/intrigue
  // landed is district-precision chronicle detail, NOT a town-crier proclamation —
  // deliberately unvoiced (the urban_fabric precedent; the calamity itself is already
  // voiced via the calamity beat).
  spatial_consequence: null,
  // THE LADDER (owner commission, engine lift #3): a rise/fall within a faction's rank
  // order is a quiet court beat carrying its own reason receipt, NOT a town-crier
  // proclamation — deliberately unvoiced (the npc_growth/urban_fabric precedent).
  npc_ladder: null,
  // THE CONTESTED GOALS CLASS (Deep Couplings D-4): a head-to-head goal rivalry and a linked
  // support-goal outcome are quiet court beats carrying their own reason receipts, NOT
  // town-crier proclamations — deliberately unvoiced (the npc_ladder precedent exactly).
  npc_contest: null,
  npc_support: null,
  // THE TRADITIONS (owner commission, engine lift #4): a festival held or set aside is a
  // chronicle beat carrying its own reason receipt, and no crier VoiceCategory fits a
  // culture observance — deliberately unvoiced (the npc_ladder/urban_fabric precedent; a
  // dedicated 'culture' crier is a T-5 surface question, not a T-2 mis-route).
  tradition: null,
  // DEEP COUPLINGS (D-0 / D-1c): the belief-axis SUBSTRATE beats — a refugee column
  // (migration_flight, the demographic axis) and a reshaped observance (tradition_change,
  // the cultural axis) enter the rumor net to feed distant courts' beliefs, but neither is
  // a town-crier proclamation: migration_flight would spam a crier on every column (the
  // aggregate migration_pressure keeps the 'migration' voice), and tradition_change follows
  // the tradition:null precedent (no culture crier). Deliberately unvoiced (JUDGMENT, vetoable).
  migration_flight: null,
  tradition_change: null,
  // THE ROADS (owner commission, engine lift #5): a named NPC's journey / capture /
  // ransom / return is a chronicle beat carrying its own roadsProse headline+summary,
  // NOT a town-crier proclamation — deliberately unvoiced (the tradition/npc_ladder
  // precedent; newsVoiceCategory returns null for it via the set-but-unclassified guard).
  roads: null,
  // V-22 THE ASSIZE + V-23 THE COMMONS' VOICE (Vision lane V-K): a seated judgement and the
  // three rungs of the commons' escalation each carry their OWN in-register headline+summary
  // (naming the accused/charge/verdict, or the grievance and rung) — chronicle beats, NOT
  // generic town-crier proclamations, so they take no crier VoiceCategory (the ladder/roads/
  // traditions precedent exactly; newsVoiceCategory returns null via the set-but-unclassified
  // guard). Deliberately unvoiced (JUDGMENT, vetoable — a dedicated 'assize'/'commons' crier
  // register is a surface question, not an engine-lane mis-route).
  assize_verdict: null,
  commons_petition: null,
  commons_gathering: null,
  commons_riot: null,
  // THE PACT LIFECYCLE BEATS (treatyLifecycleVoice.js): a pact reaching the end of its
  // own term, and an owed court entering its counterpart in default. Both are minted with
  // an AUTHORED headline + a pact-grammar summary line naming the two courts, the closing
  // term and the ending — chronicle beats carrying their own receipt, not town-crier
  // proclamations (the assize_verdict / roads / npc_ladder precedent exactly). They must
  // also NOT borrow the trade or authority criers: the shortfall a court weighs is an oath
  // kept or broken, not a market shortage, and the mint's own comment records that these
  // deliberately took their OWN impactKinds rather than riding `diplomacy` (which the
  // Herald's SINGLE_PRODUCER_KEYS walker pins to the one treaty-signing beat, and which is
  // itself classified null here). Deliberately unvoiced (JUDGMENT, vetoable).
  treaty_lapsed: null,
  treaty_default_detected: null,
  // IN-0C's open-article beat (treatyLifecycleVoice.js treatyDisclosureOpenedBeats,
  // minted at 29e2dc3c) is the same cohort and the same shape as treaty_lapsed: an
  // AUTHORED headline over a GR-0 grammar-receipt summary, with a registry row that
  // MIRRORS treaty_lapsed's by chair ruling CR-IN0C-2-R1 (grammarNews.js). It must NOT
  // borrow the trade crier merely because it shares that kind's trade DESK: the desk
  // FILES a beat, the crier VOICES one, and a market-shortage line beneath "must open
  // its books" is the exact mis-route the set-but-unclassified guard exists to stop.
  // No crier register fits a transparency clause, so it stays deliberately unvoiced,
  // which is what newsVoiceCategory already returns (JUDGMENT, vetoable).
  treaty_disclosure_opened: null,
  // ENC-4 (ROAD B, the chance meeting's Herald line, §899): the recorded meeting carries the
  // chair's own authored sentences (the sealed §A pool) and its own significance; it borrows
  // no generic crier category, exactly as the treaty and disposition receipts above do not.
  // The classifier's set-but-unclassified guard already returns null for it; this row makes
  // that the DECISION rather than the accident the guard exists to prevent. ⚠ THE FORK: ENC-4
  // minted the kind and moved neither this roster nor pantheon A5's freezes, and no vitest ran
  // in that lane — both were red at its tip and are moved by the Fable chair at the landing.
  chance_meeting_recorded: null,
  // ENC-4b/ENC-4c (ROAD B's second beat, §900): the EXPOSED refusal is the same cohort and the
  // same shape as the recorded meeting above — one of the chair's own authored sentences (§B when
  // the host offered, §B2 when the guest did) over a reason the builder reads back off the
  // instrument itself (`CHANCE_MEETING_EXPOSED_REASON`), filed at a registry section with its own
  // significance. It must NOT borrow a generic crier category merely because a refusal that did
  // not stay private sounds like news: no crier register fits a private offer made public, and a
  // market or authority line beneath it would misdescribe it exactly as the set-but-unclassified
  // guard exists to prevent. MEASURED at this tip: `newsVoiceCategory({ impactKind:
  // 'chance_meeting_exposed' })` already returns null through that guard, so this row DECIDES
  // rather than changes (JUDGMENT, vetoable — the chance_meeting_recorded precedent exactly).
  chance_meeting_exposed: null,
  // GR-4b's succession disavowal (treatySuccessionVoice.js) is the same cohort and the same
  // shape again: an AUTHORED headline naming both courts over a pact-grammar summary that
  // names the hand which swore, with its own recorded reason read back off the instrument.
  // It must NOT borrow the trade crier merely because it shares that cohort's trade DESK —
  // the desk FILES a beat and the crier VOICES one, and a market-shortage line beneath a
  // torn-up oath is the exact mis-route the set-but-unclassified guard exists to stop. No
  // crier register fits an oathbreaking, so it stays deliberately unvoiced (JUDGMENT,
  // vetoable — the treaty_lapsed / treaty_disclosure_opened precedent exactly).
  disavowed_by_succession: null,
  // GR-4b-iii-a is the unanswered opening beat from the same authored treaty cohort.
  succession_question_opened: null,
  // GR-4b-ii-W2 is that question's HONOR terminal, answered aloud — the same cohort and the
  // same shape once more, and the beat that closes the docket the line above opened. No
  // crier register fits an oath kept, and it must not borrow the trade crier merely because
  // it shares the cohort's trade DESK (the desk FILES, the crier VOICES). Deliberately
  // unvoiced (JUDGMENT, vetoable — the succession_question_opened precedent exactly).
  reaffirmed: null,
  // W-COIN-2's two state-treasury beats. Both file at the trade DESK, and both are
  // deliberately unvoiced for the reason this manifest keeps insisting on: the desk FILES a
  // beat and the crier VOICES one. The trade crier's register is the market — goods, prices,
  // roads — and a crown's LEDGER is not a market event. A vault crossing a band, or a court
  // that cannot meet its army's wages, is a fact about the treasury's own books; hearing it
  // cried in a market voice would misdescribe it exactly as the set-but-unclassified guard
  // exists to prevent. Deliberately unvoiced (JUDGMENT, vetoable — the reaffirmed /
  // succession_question_opened precedent exactly, and newsVoiceCategory already returns
  // null for both through that same guard, so these rows decide rather than change).
  treasury_shortfall: null,
  treasury_band: null,
};

describe('impactKind walkers (content-immersion-r2-1/-2)', () => {
  const minted = mintedImpactKinds();

  test('the mint scan is non-vacuous', () => {
    expect(minted.length).toBeGreaterThan(20);
  });

  test('every minted impactKind is phrased in WHAT_PHRASES (no raw slug reaches a headline)', () => {
    const unphrased = minted.filter((k) => !(k in WHAT_PHRASES));
    // To comply: add `k: '<in-world phrase a townsperson would say>'` to WHAT_PHRASES.
    expect(unphrased).toEqual([]);
  });

  test('every minted impactKind is classified in EXPECTED_VOICE (voice decision forced)', () => {
    const unclassified = minted.filter((k) => !(k in EXPECTED_VOICE));
    const stale = Object.keys(EXPECTED_VOICE).filter((k) => !minted.includes(k));
    // A new mint → add it to EXPECTED_VOICE (a real category or null). A removed mint →
    // delete its stale entry.
    expect({ unclassified, stale }).toEqual({ unclassified: [], stale: [] });
  });

  test('newsVoiceCategory returns each minted kind\'s expected category', () => {
    const wrong = [];
    for (const k of minted) {
      const got = newsVoiceCategory({ impactKind: k });
      if (got !== EXPECTED_VOICE[k]) wrong.push(`${k}: expected ${EXPECTED_VOICE[k]}, got ${got}`);
    }
    expect(wrong).toEqual([]);
  });
});
