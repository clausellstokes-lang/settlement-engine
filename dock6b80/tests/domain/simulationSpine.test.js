/**
 * tests/domain/simulationSpine.test.js — Spine derivation contract.
 *
 * The spine is exposed in the dossier rail, the AI grounding prompt,
 * and (eventually) the PDF chapter-1 callout. It needs to be reliable
 * over both rich settlements and bare ones — and tolerant of legacy
 * field-name aliases.
 *
 * ── WHY THIS FILE GREW A GENERATION PIN ───────────────────────────────────
 *
 * The version of this suite that shipped the live defects was GREEN on every
 * assertion while six of the spine's seven rungs were dead in production. It
 * was green because its fixture was hand-written to the field names the
 * DERIVERS read — `economicState.topExport`, `powerStructure.governanceType`,
 * `defenseProfile.threats`, `settlementReason` as a bare string, faction rows
 * keyed `.name` — and the generator writes NONE of those. `primaryExports`,
 * `government`, no threats key at all, an ARRAY reason, and faction rows keyed
 * `.faction`. Fixture and deriver agreed with each other and neither agreed
 * with the pipeline, so every primary arm silently fell through to its
 * fallback and the rail printed the same generic seven lines for every
 * settlement in the game.
 *
 * A fixture cannot catch that, by construction: it is written from the same
 * belief the bug is made of. So `describe('over REAL generated settlements')`
 * below boots the actual pipeline and asserts, rung by rung, that the PRIMARY
 * arm fired and the FALLBACK did not. That is the pin that has to exist for
 * this class to stay dead; the fixture blocks around it cover shape tolerance
 * and grammar, which fixtures are good at.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveSimulationSpine,
  simulationSpineRows,
  SPINE_RUNGS,
} from '../../src/domain/simulationSpine.js';
import { STRESSOR_SPINE_PHRASES } from '../../src/data/stressorSpinePhrases.js';
import { STRESS_TYPE_META } from '../../src/data/stressTypesMeta.js';
import { gen } from '../simulation/simHelpers.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/**
 * A LEGACY-shaped settlement: every field spelled the way settlements saved
 * before the current pipeline spell them. Its job is to prove the aliases
 * still resolve, NOT to stand in for what the generator emits.
 */
const legacySettlement = () => ({
  name: 'Greycairn',
  tier: 'town',
  settlementReason: 'Founded at the river crossing where the salt road meets the road north.',
  history: { historicalCharacter: 'a quiet trade town, suspicious of strangers' },
  economicState: {
    topExport: 'Smoked river fish',
    prosperityBand: 'comfortable',
  },
  powerStructure: {
    governanceType: 'A merchant council',
    governingName: 'The Salt-Tongue Guild',
    publicLegitimacy: { label: 'Tolerated' },
    stability: 'unstable',
    factions: [
      { name: 'The Salt-Tongue Guild', power: 60 },
      { name: 'The Riverwarden Temple', power: 78 },
    ],
    recentConflict: 'a bread riot last winter',
  },
  stressors: [{ label: 'plague rumors' }, { label: 'cut trade route' }],
  defenseProfile: { threats: [{ label: 'bandits on the south road' }] },
  history2: { currentTensions: [] },
});

/** The frame text of a rung, by key. */
const frameOf = (key) => SPINE_RUNGS.find(r => r.key === key).frame;

/** Stressor entries in the catalog shape the pipeline actually writes. */
const stressorsOfTypes = (...types) => types.map(type => ({
  type,
  label: STRESS_TYPE_META[type].label,
  summary: `A whole paragraph about ${type}. It runs to several sentences. It is not a phrase.`,
}));

// ── The mold ───────────────────────────────────────────────────────────────

describe('the spine mold', () => {
  it('every clause rung composes as frame + complement, with no doubled frame', () => {
    const spine = deriveSimulationSpine(legacySettlement());
    const rows = simulationSpineRows(legacySettlement());

    for (const rung of SPINE_RUNGS) {
      const sentence = spine[rung.key];
      if (!sentence) continue;
      const row = rows.find(([frame]) => frame === rung.frame);
      expect(row, `rung ${rung.key} is in the spine but not in the rows`).toBeTruthy();
      const body = row[1];

      if (rung.mode === 'clause') {
        // The sentence form is exactly the frame plus the complement.
        expect(sentence, `${rung.key} sentence must open with its frame`)
          .toBe(`${rung.frame} ${body}`);
        // THE DEFECT: the body must not restate the frame. "It is currently
        // strained by / Strained by under Siege, infiltrated." doubled the
        // frame's own key word into the body.
        const frameKeyWord = rung.frame.split(/\s+/).pop().toLowerCase();
        expect(
          body.toLowerCase().startsWith(frameKeyWord),
          `${rung.key} body "${body}" restates its frame's key word "${frameKeyWord}"`,
        ).toBe(false);
      } else {
        // A statement rung stands alone: the frame is a heading, not a lead.
        expect(sentence).toBe(body);
      }
    }
  });

  it('no rung ever stacks terminal punctuation', () => {
    // The live line ended "…it is about survival.." — a '.' appended to a
    // field that already carried one.
    const settlements = [
      legacySettlement(),
      { ...legacySettlement(), settlementReason: 'Founded on the salt road.' },
      { ...legacySettlement(), settlementReason: 'Founded on the salt road' },
      {},
    ];
    for (const settlement of settlements) {
      for (const [frame, body] of simulationSpineRows(settlement)) {
        expect(body, `row "${frame}" stacked terminal marks`).not.toMatch(/[.!?]{2,}$/); // anchored: `body` is a non-empty rendered row string, asserted below; an empty or missing body would fail that assertion first.
        expect(body.length, `row "${frame}" rendered empty`).toBeGreaterThan(0);
        expect(body, `row "${frame}" must end in one terminal mark`).toMatch(/[^.!?][.!?]$/);
      }
    }
  });

  it('a clause body carries no sentence break inside it', () => {
    // A complement is a phrase. If a sentence ended inside one, a narrative
    // body got spliced into a noun slot.
    const settlement = {
      ...legacySettlement(),
      stressors: stressorsOfTypes('under_siege'),
      powerStructure: {
        ...legacySettlement().powerStructure,
        recentConflict:
          'The settlement is under active siege. Every resource decision is a military'
          + ' decision. The debate is no longer about policy, it is about survival.',
      },
    };
    for (const rung of SPINE_RUNGS) {
      if (rung.mode !== 'clause') continue;
      const row = simulationSpineRows(settlement).find(([frame]) => frame === rung.frame);
      if (!row) continue;
      const withoutTerminal = row[1].replace(/[.!?]$/, '');
      expect(withoutTerminal, `${rung.key} body contains a sentence break`)
        .not.toMatch(/[.!?]\s/); // anchored: the same body is asserted non-empty and well-terminated in the sibling test above, so an emptied row cannot pass this vacuously.
    }
  });
});

// ── The splice guard, one arm at a time ────────────────────────────────────

describe('the splice guard has TWO refusals, and each is load-bearing alone', () => {
  /**
   * `nounPhrase()` refuses a candidate for either of two independent reasons:
   *
   *   1. it is LONGER than MAX_PHRASE_CHARS — no slot was written for it;
   *   2. it carries a sentence terminator followed by whitespace — a body
   *      wearing a phrase's clothes.
   *
   * Neither refusal implies the other, and the suite used to prove only their
   * CONJUNCTION: the live vignette that motivated the guard is both long AND
   * multi-sentence, so deleting either check — or, in fact, both — left every
   * assertion green. Two guards proved by one fixture is one guard's worth of
   * proof and a free pass for whichever half is deleted first.
   *
   * Each fixture below therefore trips EXACTLY ONE refusal and is clean under
   * the other, so the deletion mutants can only be caught one at a time.
   */

  /** Long, and deliberately terminator-free: only the length cap can refuse it. */
  const OVERLONG_LABEL =
    'a caravan levy dispute between the salt factors and the river wardens'
    + ' that has run for three seasons';

  /** Short, and deliberately multi-sentence: only the terminator check refuses it. */
  const MID_SENTENCE_LABEL = 'The mill burned down. No one rebuilt it';

  it('the fixtures really do isolate one guard each', () => {
    // The control on the controls. If a fixture ever drifts across the other
    // guard's threshold, its mutant stops proving what it claims to prove and
    // this pin says so before the silence does.
    expect(OVERLONG_LABEL.length, 'the overlong fixture must exceed the cap')
      .toBeGreaterThan(80);
    expect(OVERLONG_LABEL, 'the overlong fixture must carry NO sentence break')
      .not.toMatch(/[.!?]\s/);
    expect(MID_SENTENCE_LABEL.length, 'the mid-sentence fixture must sit UNDER the cap')
      .toBeLessThanOrEqual(80);
    expect(MID_SENTENCE_LABEL, 'the mid-sentence fixture must carry a sentence break')
      .toMatch(/[.!?]\s/);
  });

  it('GUARD 1 — the LENGTH cap alone refuses an over-long phrase', () => {
    const spine = deriveSimulationSpine({
      name: 'Guardtown', stressors: [{ label: OVERLONG_LABEL }],
    });
    // Refused, so the arm declines and the fallback answers.
    expect(spine.strainedBy)
      .toBe('It is currently strained by nothing it cannot carry at the moment.');
    // Anchored on the fallback pinned above: a drift that empties the line
    // cannot pass this vacuously.
    expect(spine.strainedBy).not.toContain('caravan levy dispute');
  });

  it('GUARD 2 — the SENTENCE-BREAK check alone refuses a short two-sentence phrase', () => {
    const spine = deriveSimulationSpine({
      name: 'Guardtown', stressors: [{ label: MID_SENTENCE_LABEL }],
    });
    expect(spine.strainedBy)
      .toBe('It is currently strained by nothing it cannot carry at the moment.');
    expect(spine.strainedBy).not.toContain('The mill burned down');
    expect(spine.strainedBy).not.toContain('No one rebuilt it');
  });

  it('the guard is SPECIFIC: a phrase clean on both counts still gets through', () => {
    // The negative control for both mutants. Without this, deleting nothing
    // and refusing everything would satisfy the two pins above perfectly.
    const spine = deriveSimulationSpine({
      name: 'Guardtown', stressors: [{ label: 'Salt Blight' }],
    });
    expect(spine.strainedBy).toBe('It is currently strained by salt blight.');
  });

  it('both refusals hold on the FEAR rung too, not only the strain rung', () => {
    // `nounPhrase` is a shared chokepoint, so the guards must be provable at a
    // second slot: a per-rung fix would satisfy the strain pins and leave this
    // one red.
    for (const label of [OVERLONG_LABEL, MID_SENTENCE_LABEL]) {
      const spine = deriveSimulationSpine({
        name: 'Guardtown', defenseProfile: { threats: [{ label }] },
      });
      expect(spine.peopleFear, `threat "${label.slice(0, 24)}…" reached the fear slot`)
        .toBe('Its people fear nothing they will say out loud.');
    }
    // Specificity control at the same slot.
    expect(
      deriveSimulationSpine({
        name: 'Guardtown', defenseProfile: { threats: [{ label: 'Bandit Raids' }] },
      }).peopleFear,
    ).toBe('Its people fear bandit raids.');
  });
});

// ── The two defects the chair read on the live site ────────────────────────

describe('the first-contact prose defects', () => {
  const besieged = () => ({
    name: 'Villastagnum',
    tier: 'town',
    stressors: stressorsOfTypes('under_siege', 'infiltrated'),
    powerStructure: {
      governingName: 'Elected Reeve',
      government: 'Elected Reeve',
      stability: 'Critical (active siege, survival priority)',
      factions: [{ faction: 'Elected Reeve', power: 22, isGoverning: true }],
      publicLegitimacy: { label: 'Tolerated' },
      recentConflict:
        'The settlement is under active siege. Every resource decision is a military'
        + ' decision. The debate is no longer about policy, it is about survival.',
    },
  });

  it('DEFECT 1: the strained-by line no longer doubles the frame or mangles case', () => {
    const spine = deriveSimulationSpine(besieged());
    // BEFORE: "It is currently strained by — Strained by under Siege, infiltrated."
    expect(spine.strainedBy).toBe(
      'It is currently strained by an active siege and quiet penetration by an outside interest.',
    );
    // The title-case display label must never survive into the sentence. The
    // exact mangling shipped was "under Siege": a mid-sentence capital is the
    // tell that only the first character was lowered.
    expect(spine.strainedBy).toContain('siege');
    expect(spine.strainedBy).not.toContain('Siege'); // anchored: the lowercase 'siege' is asserted present on the line above, so this cannot pass against an empty or drifted string.
    expect(spine.strainedBy).not.toContain('Strained by'); // anchored: same, the full sentence equality above proves the subject is the live composed line.
  });

  it('DEFECT 2: the fear line takes the stressor FEAR form, never a description body', () => {
    const spine = deriveSimulationSpine(besieged());
    // BEFORE: "Its people fear — People fear a return of the settlement is under
    // active siege. Every resource decision… survival.."
    expect(spine.peopleFear).toBe(
      'Its people fear the wall coming down before any relief arrives'
      + ' and learning at last who has been listening.',
    );
    // The vignette that used to be spliced in is absent, anchored by the
    // phrase that IS there — so a drift that empties the line reds here.
    expectAbsentWithAnchor(
      spine.peopleFear,
      'Every resource decision',
      'the wall coming down',
      'the recentConflict vignette must not reach the fear slot',
    );
    expect(spine.peopleFear).not.toContain('People fear'); // anchored: the full sentence is pinned by the toBe above; the subject is demonstrably the live line.
    expect(spine.peopleFear).not.toMatch(/\.\./); // anchored: same equality pin above proves liveness.
  });

  it('the vignette is refused at ANY length, not merely truncated', () => {
    // A one-sentence recentConflict is still a finite CLAUSE, not a noun
    // phrase. The old guard-by-length instinct would have let this through.
    const spine = deriveSimulationSpine({
      name: 'Knockburn',
      powerStructure: {
        recentConflict:
          'A dispute over field rotation and grazing rights has divided the village.',
      },
    });
    expect(spine.peopleFear).toBe('Its people fear nothing they will say out loud.');
  });
});

// ── Stressor arity: 0, 1, 2, 3, many ───────────────────────────────────────

describe('the strained-by arms, by stressor count', () => {
  const withStressors = (stressors) => deriveSimulationSpine({ name: 'Arity', stressors });

  it('0 stressors and no economic issue: says so, in frame', () => {
    expect(withStressors([]).strainedBy)
      .toBe('It is currently strained by nothing it cannot carry at the moment.');
  });

  it('0 stressors but a live economic issue: uses the issue TITLE, not the object', () => {
    // The old code passed the issue OBJECT to a string test, so this arm was
    // unreachable and the "nothing strains it" line printed over a critical
    // food deficit.
    const spine = deriveSimulationSpine({
      name: 'Arity',
      economicViability: { issues: [{ title: 'Uncovered Local Food Deficit', description: 'Long body.' }] },
    });
    expect(spine.strainedBy)
      .toBe('It is currently strained by uncovered local food deficit.');
  });

  it('1 stressor: a bare phrase', () => {
    expect(withStressors(stressorsOfTypes('famine')).strainedBy)
      .toBe('It is currently strained by famine.');
  });

  it('2 stressors: joined with "and", no comma', () => {
    expect(withStressors(stressorsOfTypes('famine', 'insurgency')).strainedBy)
      .toBe('It is currently strained by famine and an active insurgency.');
  });

  it('3 stressors: an Oxford list', () => {
    expect(withStressors(stressorsOfTypes('famine', 'insurgency', 'indebted')).strainedBy)
      .toBe('It is currently strained by famine, an active insurgency, and debt to an outside power.');
  });

  it('4+ stressors: capped at three and marked as partial', () => {
    const spine = withStressors(stressorsOfTypes('famine', 'insurgency', 'indebted', 'plague_onset'));
    expect(spine.strainedBy).toBe(
      'It is currently strained by famine, an active insurgency, and debt to an outside power,'
      + ' among others.',
    );
  });

  it('a BARE OBJECT container (not an array) is one stressor, not zero', () => {
    // assembleSettlement dual-writes `stress`/`stressors` and the value is a
    // bare object when a single stressor survived confirmation.
    expect(withStressors(stressorsOfTypes('famine')[0]).strainedBy)
      .toBe('It is currently strained by famine.');
  });

  it('the legacy string form still resolves', () => {
    const spine = deriveSimulationSpine({ name: 'Arity', stress: 'flood season' });
    expect(spine.strainedBy).toBe('It is currently strained by flood season.');
  });

  it('a custom stressor outside the catalog falls back to its label, lowered WHOLE', () => {
    const spine = deriveSimulationSpine({ name: 'Arity', stressors: [{ label: 'Salt Blight' }] });
    expect(spine.strainedBy).toBe('It is currently strained by salt blight.');
  });
});

// ── Every named stressor family ────────────────────────────────────────────

describe('the stressor phrase vocabulary', () => {
  it('is TOTAL over the stressor catalog, in both directions', () => {
    expect(Object.keys(STRESSOR_SPINE_PHRASES).sort())
      .toEqual(Object.keys(STRESS_TYPE_META).sort());
  });

  it.each(Object.keys(STRESS_TYPE_META))(
    '%s composes grammatically into BOTH the strain and the fear frame',
    (type) => {
      const spine = deriveSimulationSpine({ name: 'Vocab', stressors: stressorsOfTypes(type) });
      const { strain, fear } = STRESSOR_SPINE_PHRASES[type];

      expect(spine.strainedBy).toBe(`${frameOf('strainedBy')} ${strain}.`);
      expect(spine.peopleFear).toBe(`${frameOf('peopleFear')} ${fear}.`);

      // Both forms are phrases, not sentences: lowercase-initial, no internal
      // sentence break, and never the catalog's title-case display label.
      for (const phrase of [strain, fear]) {
        expect(phrase, `${type} phrase must open lowercase`).toMatch(/^[a-z]/);
        expect(phrase, `${type} phrase must not end in a terminal mark`).toMatch(/[^.!?]$/);
        expect(phrase, `${type} phrase contains a sentence break`).not.toMatch(/[.!?]\s/); // anchored: the same phrase is asserted non-empty and lowercase-initial two lines above.
      }
      expect(strain).not.toBe(fear); // anchored: both values are pinned into full sentences above, so neither can be undefined here.
      expect(fear.toLowerCase()).not.toContain(STRESS_TYPE_META[type].label.toLowerCase()); // anchored: `fear` is pinned into the composed sentence above, proving it is the live authored value.
    },
  );
});

// ── The other five rungs ───────────────────────────────────────────────────

describe('the remaining rungs', () => {
  it('exists-because prints the AUTHORED reason, from an array or a string', () => {
    // The pipeline writes an ARRAY. Reading it as a string is why the founding
    // reason never once reached the spine.
    const fromArray = deriveSimulationSpine({
      settlementReason: ['Established along a road route, and the road still decides everything.'],
    });
    expect(fromArray.existsBecause)
      .toBe('Established along a road route, and the road still decides everything.');

    const fromString = deriveSimulationSpine({
      settlementReason: 'Founded at the river crossing.',
    });
    expect(fromString.existsBecause).toBe('Founded at the river crossing.');

    // It is a STATEMENT rung: the heading is not prefixed onto the sentence.
    expect(fromArray.existsBecause).not.toContain(frameOf('existsBecause')); // anchored: the exact sentence is pinned by the toBe above.
  });

  it('exists-because falls back to historical character without the quote wrapper', () => {
    const spine = deriveSimulationSpine({
      history: { historicalCharacter: 'a quiet trade town, suspicious of strangers' },
    });
    // BEFORE: 'Founded in keeping with: "a quiet trade town…"' under the
    // heading "This settlement exists because".
    expect(spine.existsBecause).toBe('A quiet trade town, suspicious of strangers.');
  });

  it('exists-because falls back to tier and route', () => {
    const spine = deriveSimulationSpine({ tier: 'town', config: { tradeRouteAccess: 'minor_road' } });
    expect(spine.existsBecause).toBe('A town grew up along the minor road route.');
  });

  it('survives-by reads primaryExports (the live key) and lowers goods names', () => {
    const spine = deriveSimulationSpine({
      economicState: { primaryExports: ['Milled timber', 'Charcoal', 'Peat fuel'] },
    });
    expect(spine.survivesBy).toBe('It survives by milled timber and charcoal, among others.');
  });

  describe('a list member may already BE a coordination', () => {
    /**
     * The trade-goods catalog carries eighteen names with an internal "and"
     * — "Furs and pelts", "Reeds and thatch", "Rare spices and exotic dyes" —
     * and joining two of them with a bare "and" produced lines no reader can
     * parse. Measured over 180 real generations (six tiers x five route arms x
     * six terrains), 30 printed a body carrying two or more "and"s:
     *
     *   It survives by furs and pelts and game meat, among others.
     *   It survives by rare spices and exotic dyes and meals and drink, …
     *
     * The cure is the serial comma the joiner already uses at three-or-more.
     */
    const survives = (primaryExports) =>
      deriveSimulationSpine({ economicState: { primaryExports } }).survivesBy;

    it('marks the top-level split with a comma when the FIRST member coordinates', () => {
      expect(survives(['Furs and pelts', 'Game meat']))
        .toBe('It survives by furs and pelts, and game meat.');
    });

    it('marks it when the SECOND member coordinates', () => {
      expect(survives(['Recovered artefacts', 'Meals and drink']))
        .toBe('It survives by recovered artefacts, and meals and drink.');
    });

    it('marks it when BOTH members coordinate', () => {
      // The worst line the scan found, and the one that most needs the comma.
      expect(survives(['Rare spices and exotic dyes', 'Meals and drink']))
        .toBe('It survives by rare spices and exotic dyes, and meals and drink.');
    });

    it('SPECIFICITY: a clean pair keeps the plain "A and B", with no comma', () => {
      // Without this, a joiner that always emitted the serial comma would
      // satisfy all three pins above while making every other line worse.
      expect(survives(['Milled timber', 'Charcoal']))
        .toBe('It survives by milled timber and charcoal.');
      // And the estate's idiom for a single item is untouched.
      expect(survives(['Milled timber'])).toBe('It survives by milled timber.');
    });

    it('the three-or-more form is unchanged: it was already serial', () => {
      expect(
        deriveSimulationSpine({ name: 'X', stressors: [
          { label: 'Famine' }, { label: 'Bandits and raiders' }, { label: 'Debt' },
        ] }).strainedBy,
      ).toBe('It is currently strained by famine, bandits and raiders, and debt.');
    });

    it('the rule holds at a SECOND rung, not only at survives-by', () => {
      // joinPhrases is shared by five arms; a fix applied at one call site
      // would satisfy the survives-by pins and leave this red.
      expect(
        deriveSimulationSpine({
          name: 'X', defenseProfile: { threats: [{ label: 'Bandits and raiders' }, { label: 'Wolves' }] },
        }).peopleFear,
      ).toBe('Its people fear bandits and raiders, and wolves.');
    });
  });

  it('survives-by still honours the legacy topExport alias', () => {
    expect(deriveSimulationSpine(legacySettlement()).survivesBy)
      .toBe('It survives by smoked river fish.');
  });

  it('survives-by falls back to the prosperity band, then to subsistence', () => {
    expect(deriveSimulationSpine({ economicState: { prosperity: 'Struggling' } }).survivesBy)
      .toBe('It survives by what the land yields, on a struggling footing.');
    expect(deriveSimulationSpine({}).survivesBy)
      .toBe('It survives by subsistence trade with its neighbours and what the land offers.');
  });

  it('ruled-by reads `government` (the live key) and gives the label its article', () => {
    const spine = deriveSimulationSpine({
      powerStructure: {
        government: 'Elected Reeve',
        governingName: 'Elected Reeve',
        factions: [{ faction: 'Elected Reeve', power: 22, isGoverning: true }],
      },
    });
    expect(spine.ruledBy).toBe('It is ruled by an elected reeve.');
  });

  it('ruled-by names the seat-holder when it differs from the government type', () => {
    expect(deriveSimulationSpine(legacySettlement()).ruledBy)
      .toBe('It is ruled by a merchant council, currently The Salt-Tongue Guild.');
  });

  it('real-power reads faction rows keyed `.faction`, not `.name`', () => {
    // The FACTION-KEY defect class: the live roster keys the name as
    // `.faction`, so a hand-rolled `.name` read returns nothing and the rung
    // vanished from the rail entirely.
    const spine = deriveSimulationSpine({
      powerStructure: {
        government: 'Elected Reeve',
        governingName: 'Elected Reeve',
        factions: [
          { faction: 'Elected Reeve', power: 22, isGoverning: true },
          { faction: 'Religious Authorities', power: 40 },
        ],
      },
    });
    expect(spine.realPower).toBe(
      'Its real power lies with Religious Authorities, whose practical influence'
      + ' outweighs the formal authority.',
    );
  });

  it('real-power reports alignment, and flags weak legitimacy when aligned', () => {
    const aligned = (label) => deriveSimulationSpine({
      powerStructure: {
        government: 'A merchant council',
        governingName: 'The Salt-Tongue Guild',
        publicLegitimacy: { label },
        factions: [{ faction: 'The Salt-Tongue Guild', power: 90, isGoverning: true }],
      },
    });
    expect(aligned('Endorsed').realPower).toContain('aligned');
    expect(aligned('Contested').realPower).toContain('legitimacy is contested');
  });

  it('likely-future humanizes the tension TYPE and never prints its description', () => {
    const spine = deriveSimulationSpine({
      history: {
        currentTensions: [
          { type: 'resource_scarcity', description: 'The supply of key goods is under pressure. It has been for a year.' },
          { type: 'occupation_legacy', description: 'A previous occupation ended badly.' },
        ],
      },
    });
    expect(spine.likelyFuture)
      .toBe('Its likely future is bound to the unresolved resource scarcity and occupation legacy.');
    expectAbsentWithAnchor(
      spine.likelyFuture,
      'The supply of key goods',
      'resource scarcity',
      'a tension description must not reach the future slot',
    );
  });

  it('likely-future falls back through the stability band', () => {
    const at = (stability) => deriveSimulationSpine({ powerStructure: { stability, factions: [] } }).likelyFuture;
    expect(at('Critical')).toBe('Its likely future is a crisis, unless someone intervenes.');
    expect(at('unstable')).toBe('Its likely future is a test of whoever holds the chair.');
    expect(at('Stable')).toBe('Its likely future is continuity, with the usual slow erosion of any settlement.');
    expect(deriveSimulationSpine({}).likelyFuture)
      .toBe('Its likely future is whatever the table decides to make it.');
  });
});

// ── Tolerance ──────────────────────────────────────────────────────────────

describe('tolerance', () => {
  it('handles a bare settlement without crashing', () => {
    const spine = deriveSimulationSpine({});
    for (const rung of SPINE_RUNGS) {
      if (rung.key === 'realPower') continue;
      expect(spine[rung.key], `${rung.key} came back empty on a bare settlement`).toBeTruthy();
    }
  });

  it('returns a placeholder spine for nullish input', () => {
    const spine = deriveSimulationSpine(null);
    expect(spine.existsBecause).toBe('Origin unknown.');
    expect(spine.realPower).toBeNull();
  });

  it('rows drop the null realPower row and keep canonical order', () => {
    const rows = simulationSpineRows({});
    expect(rows.map(([frame]) => frame)).toEqual([
      'Why it is here',
      'It survives by',
      'It is ruled by',
      'It is currently strained by',
      'Its people fear',
      'Its likely future is',
    ]);
  });
});

// ── The pin the old suite could not have: real generated settlements ───────

describe('over REAL generated settlements', () => {
  /**
   * THE SEED FAMILY. Every generation below goes through `gen(config, seed)` —
   * `generateSettlementPipeline(config, null, { seed, customContent: {} })`.
   *
   * ── WHY THE SPELLING IS LOAD-BEARING ─────────────────────────────────────
   *
   * This block used to call `generateSettlementPipeline({ seed, tier: 'town' })`
   * — seed and tier in the CONFIG slot. The pipeline reads
   * `options.seed || config._seed || generateSeed()`, so a config-level `seed`
   * key is NOT a seed: every run generated a different random world and these
   * pins were flaky by construction, passing or failing on the draw. `tier` is
   * not the config key either (`settType` is), so the "town" corpus was in fact
   * a corpus of default-tier villages. Both were silent: the pipeline's
   * fail-closed guard only catches an options bag misplaced into the
   * importedNeighbour slot, not a seed misplaced into the config slot.
   *
   * ── WHY A FAMILY, NOT ONE SEED ───────────────────────────────────────────
   *
   * A single-seed pin is vacuous against anything that varies by draw: it pins
   * one world and calls it the contract. The family spans the ROUTE arms
   * deliberately, because the origin and survival rungs are keyed on route, so
   * a one-route family would leave most arms unpinned.
   */
  const SPINE_FAMILY = Object.freeze([
    { seed: 'spine-pin-a', config: { settType: 'town',    tradeRouteAccess: 'crossroads' } },
    { seed: 'spine-pin-b', config: { settType: 'village', tradeRouteAccess: 'river' } },
    { seed: 'spine-pin-c', config: { settType: 'city',    tradeRouteAccess: 'port' } },
    { seed: 'spine-pin-d', config: { settType: 'town',    tradeRouteAccess: 'isolated' } },
    { seed: 'spine-pin-e', config: { settType: 'hamlet' } },
  ]);

  /** @type {Array<Record<string, any>>} */
  const generated = SPINE_FAMILY.map(({ config, seed }) => gen(config, seed));

  const BESIEGED_CONFIG = { settType: 'town', stressTypes: ['under_siege', 'infiltrated'] };
  /** @type {Array<Record<string, any>>} */
  const besieged = ['spine-pin-siege', 'spine-pin-siege-2'].map(seed => gen(BESIEGED_CONFIG, seed));

  it('the fixture corpus really did generate, AT THE SEED AND TIER ASKED FOR', () => {
    // Positive control for every anti-fallback assertion below — and the pin on
    // the defect above: if the seed or the tier is dropped on the floor again,
    // `_seed` stops matching and `tier` reverts to the default village.
    for (const [i, settlement] of [...generated].entries()) {
      expect(settlement.name).toBeTruthy();
      expect(settlement.powerStructure).toBeTruthy();
      expect(settlement._seed, 'the seed reached the pipeline').toBe(SPINE_FAMILY[i].seed);
      expect(settlement.tier, 'the requested tier reached the pipeline')
        .toBe(SPINE_FAMILY[i].config.settType);
    }
    for (const settlement of besieged) {
      expect(settlement.name).toBeTruthy();
      expect(settlement.powerStructure).toBeTruthy();
    }
  });

  it('the same seed renders byte-identical spine prose, twice running', () => {
    // The determinism assertion the unseeded pins could not make. THE PROMISE
    // ("a seed is a world, forever") is what this asserts at the spine's own
    // surface: same seed, same config, same seven lines.
    for (const { config, seed } of SPINE_FAMILY) {
      const first  = deriveSimulationSpine(gen(config, seed));
      const second = deriveSimulationSpine(gen(config, seed));
      expect(second, `seed "${seed}" did not reproduce its spine`).toEqual(first);
      expect(simulationSpineRows(gen(config, seed)))
        .toEqual(simulationSpineRows(gen(config, seed)));
    }
  });

  it('DIFFERENT seeds really do produce different worlds', () => {
    // The negative control for the determinism pin above: without this, a
    // derivation that returned a constant would satisfy "same seed, same
    // output" perfectly. At least one rung must differ across the family.
    const spines = generated.map(s => deriveSimulationSpine(s));
    const distinctNames = new Set(generated.map(s => s.name));
    expect(distinctNames.size, 'the family collapsed to one world').toBeGreaterThan(1);
    const varyingRungs = SPINE_RUNGS.filter(rung =>
      new Set(spines.map(spine => spine[rung.key])).size > 1);
    expect(varyingRungs.length, 'every rung printed the same line on every seed')
      .toBeGreaterThan(0);
  });

  it('the PRIMARY arm fires on every rung; no rung prints its fallback', () => {
    for (const settlement of generated) {
      const spine = deriveSimulationSpine(settlement);

      // exists-because: the authored reason array must reach the rung.
      const reason = settlement.settlementReason[0];
      expect(spine.existsBecause.slice(0, 40)).toBe(reason.slice(0, 40));
      expectAbsentWithAnchor(
        spine.existsBecause, 'reasons no one writes down', reason.slice(0, 20),
        'exists-because fell back despite an authored reason',
      );

      // survives-by: a real export or a real prosperity band, never subsistence.
      expectAbsentWithAnchor(
        spine.survivesBy, 'subsistence trade with its neighbours', 'It survives by',
        'survives-by fell back despite live economicState',
      );

      // ruled-by: the real government label, never "contested and unclear".
      expect(spine.ruledBy.toLowerCase())
        .toContain(settlement.powerStructure.government.toLowerCase());

      // real-power: the roster is keyed `.faction`; the rung must resolve a name.
      expect(spine.realPower).toBeTruthy();
      expectAbsentWithAnchor(
        spine.realPower, 'undefined', 'Its real power lies with',
        'real-power read the wrong faction key',
      );

      // likely-future: a real tension type or a real stability band.
      expectAbsentWithAnchor(
        spine.likelyFuture, 'whatever the table decides', 'Its likely future is',
        'likely-future fell back despite live tensions/stability',
      );
    }
  });

  it('a besieged settlement reports the siege in both the strain and the fear rung', () => {
    for (const settlement of besieged) {
      const spine = deriveSimulationSpine(settlement);
      expect(spine.strainedBy).toContain('an active siege');
      expect(spine.peopleFear).toContain('the wall coming down before any relief arrives');
      // And the vignette that used to be spliced here is gone, anchored by
      // the phrase that replaced it.
      expectAbsentWithAnchor(
        spine.peopleFear, 'Every resource decision', 'the wall coming down',
        'the live-site splice must not return on a real settlement',
      );
    }
  });

  it('a coordinating export name is comma-split on REAL settlements, not fixtures', () => {
    // The fixture pins above are written from a belief about the catalog. This
    // one reads the catalog: it generates across the terrain and route space
    // until it finds settlements whose top two exports include a name that is
    // itself a coordination ("Furs and pelts", "Meals and drink", …), and
    // requires the composed line to mark the top-level split. Without the
    // fix, 30 of these 180 generations printed "furs and pelts and game meat".
    let examined = 0;
    for (const settType of ['thorp', 'village', 'town', 'city', 'metropolis']) {
      for (const tradeRouteAccess of ['crossroads', 'port', 'river', 'isolated']) {
        for (const terrainOverride of ['coastal', 'riverside', 'plains', 'forest', 'mountain']) {
          // `terrainOverride` is the config key that actually resolves terrain.
          // `terrain` is NOT one: passing it silently yields the default, which
          // would narrow this corpus to a single terrain while the loop claimed
          // five.
          const settlement = gen(
            { settType, tradeRouteAccess, terrainOverride },
            `conj-${settType}-${tradeRouteAccess}-${terrainOverride}`,
          );
          const top = (settlement.economicState?.primaryExports || []).slice(0, 2);
          if (top.length < 2 || !top.some(name => / and /i.test(String(name)))) continue;
          examined++;
          const [a, b] = top.map(name => String(name).toLowerCase());
          expect(
            deriveSimulationSpine(settlement).survivesBy,
            `"${a}" + "${b}" were joined without the top-level comma`,
          ).toContain(`${a}, and ${b}`);
        }
      }
    }
    // Positive control: a corpus that found no coordinating export would pass
    // this test vacuously and prove nothing about the joiner.
    expect(examined, 'no generated settlement carried a coordinating export name')
      .toBeGreaterThan(0);
  });

  it('every rendered row is grammatical on every generated settlement', () => {
    for (const settlement of [...generated, ...besieged]) {
      for (const [frame, body] of simulationSpineRows(settlement)) {
        const rung = SPINE_RUNGS.find(r => r.frame === frame);
        expect(body, `"${frame}" rendered empty`).toBeTruthy();
        expect(body, `"${frame}" must end in one terminal mark`).toMatch(/[^.!?][.!?]$/);
        if (rung.mode === 'clause') {
          const frameKeyWord = frame.split(/\s+/).pop().toLowerCase();
          expect(
            body.toLowerCase().startsWith(frameKeyWord),
            `"${frame}" doubled its frame into the body: "${body}"`,
          ).toBe(false);
          expect(body.replace(/[.!?]$/, ''), `"${frame}" spliced a sentence into a slot`)
            .not.toMatch(/[.!?]\s/); // anchored: the same body is asserted truthy and well-terminated two lines above.
        }
      }
    }
  });
});
