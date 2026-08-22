/**
 * faithPanelModel — the pure read-model behind the dossier faith surface (W-F6).
 * Pins the branches the component depends on: the no-embed short-circuit, the
 * static (day-one) vs live shapes, the piety arc (rising/falling/steady), the
 * legitimacy bands, the amplifier receipt, and the secularization/revival sink
 * sentence direction. It never reads config.latentPantheon.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { faithPanelModel, legitimacyBand, pietyTrend, FALL_SENTENCE } from '../../src/components/settlement/faithPanelModel.js';
import { projectReligionStateOntoSettlement } from '../../src/domain/worldPulse/religionState.js';
import { PATRON_FALL_CAUSES, recordPatronFall } from '../../src/domain/worldPulse/patronFall.js';
import { nicheOf } from '../../src/domain/worldPulse/cultImpositionApply.js';
import { scrubImportedConfig } from '../../src/lib/importScrub.js';
import { CONDITIONAL_LEDGER_KEYS } from '../../src/domain/worldPulse/worldState.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── WF-1E · THE FaithSection CAUSE-CHAIN LINE ────────────────────────────────────────
// ⛔ EVERY FIXTURE BELOW WAS RUN AND ITS OUTPUT PRINTED BEFORE ITS ASSERTION WAS WRITTEN,
// once against a pristine `git archive` tree at the base and once wired (lane receipt
// laneTEWF1E-receipt.md §3). The hazard being avoided is the QUIET FIXTURE: WF-1C's first
// fall fixture recorded nothing, so its pins passed over an engine that never executed the
// behaviour they named. Every arm here asserts its ring is really seeded BEFORE using it.
//
// ⛔ THE DEITY DOCTRINE BINDS THE FIXTURES: deities arrive through the doctrine path —
// config.primaryDeitySnapshot, what SET_PRIMARY_DEITY writes — never a catalogue or a
// premade pool, and the ring is written only by its ONE sanctioned writer recordPatronFall.
const deity = (name) => ({ _deityRef: `custom:lu_${name.toLowerCase()}`, name, temperamentAxis: 'peaceful', alignmentAxis: 'good', rankAxis: 'major' });
const dref = (x) => `custom:lu_${x.toLowerCase()}`;
const AURUM = deity('Aurum');
const FADED = deity('Faded');

/** A live, deity-BEARING religion state: a seated patron and a real rival. */
function faithState() {
  const deities = {};
  for (const [d, share] of [[AURUM, 70], [FADED, 30]]) {
    deities[String(d._deityRef)] = {
      deityRef: String(d._deityRef), snapshot: d, niche: nicheOf(d), share,
      standing: 'ascendant', legitimacy: 0.8, suppressed: false,
    };
  }
  return { deities, patronRef: String(AURUM._deityRef), capacity: 5, noneShare: 4 };
}

/** A fall-bearing state, with the ring ASSERTED PRESENT before any arm consumes it. */
function fallBearing(cause = 'discredited') {
  const st = faithState();
  recordPatronFall(st, { ref: dref('Faded'), cause, atTick: 12 });
  // NON-VACUITY CONTROL: the writer really wrote. A refused write would leave every
  // downstream arm asserting over a world where nothing ever fell.
  expect(st.patronFalls).toEqual([{ ref: dref('Faded'), cause, atTick: 12 }]);
  return st;
}

const settlementFor = () => ({
  tier: 'city', population: 20000,
  config: { primaryDeityRef: AURUM._deityRef, primaryDeitySnapshot: AURUM },
  powerStructure: { government: 'Theocratic Council', publicLegitimacy: { score: 50, label: 'Stable' } },
});
const project = (state, rules) => projectReligionStateOntoSettlement(settlementFor(), { s: state }, 's', null, null, rules);

describe('faithPanelModel', () => {
  it('returns { hasEmbed:false } for a deity-free (or latent-only) settlement', () => {
    expect(faithPanelModel({ config: {} })).toEqual({ hasEmbed: false });
    // A latent record alone is NOT an embed — the model never reads it.
    expect(faithPanelModel({ config: { latentPantheon: { patron: { name: 'Secret' } } } })).toEqual({ hasEmbed: false });
  });

  it('builds a static (day-one) model from embeds alone, with the effects disclosure', () => {
    const m = faithPanelModel({ config: { primaryDeitySnapshot: { name: 'Sun', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun', alignmentAxis: 'good' } } });
    expect(m.hasEmbed).toBe(true);
    expect(m.live).toBe(false);
    expect(m.patron.name).toBe('Sun');
    expect(m.patron.lawAxis).toBe('lawful');
    expect(m.ranks).toEqual([]);
    expect(Array.isArray(m.effects)).toBe(true);
    expect(m.effects.length).toBeGreaterThan(0);
  });

  it('drops a neutral lawAxis (legacy / true-neutral says nothing)', () => {
    const m = faithPanelModel({ config: { primaryDeitySnapshot: { name: 'X', rankAxis: 'cult', lawAxis: 'neutral' } } });
    expect(m.patron.lawAxis).toBeNull();
  });

  it('builds a live model with ranks, piety arc, unaffiliated, and cause sentences', () => {
    const m = faithPanelModel({
      config: {
        primaryDeitySnapshot: { name: 'Sun', rankAxis: 'major' },
        faithProfile: {
          deities: [
            { deityRef: 'a', name: 'Sun', share: 60, standing: 'ascendant', legitimacy: 0.8, isPatron: true },
            { deityRef: 'b', name: 'Ash', share: 26, standing: 'established', legitimacy: 0.3, isPatron: false },
          ],
          contested: false, patronSecurity: 0.7, unaffiliated: 14,
          piety: {
            local01: 0.3, structuralTarget: 0.5, localMult: 1.2, realmMult: 1.0, composite: 1.2,
            causes: [
              { source: 'religious_authority', value: 0.5 },
              { source: 'institutions', value: 0.6 },
              { source: 'devotion', value: 0.4 },
              { source: 'conduct_drift', value: 0.2 },
            ],
          },
        },
      },
    });
    expect(m.live).toBe(true);
    expect(m.ranks).toHaveLength(2);
    expect(m.ranks[0].band.label).toBe('secure');       // 0.8
    expect(m.ranks[1].band.label).toBe('tenuous');      // 0.2
    expect(m.piety.trend).toBe('rising');               // 0.3 → 0.5
    expect(m.piety.bars).toHaveLength(3);               // authority / institutions / devotion
    expect(m.piety.amplifier.dir).toBe('up');
    expect(m.piety.sentences).toContain('The town no longer lives like its god — devotion is ebbing.');
    // Rising piety + an unaffiliated bucket ⇒ REVIVAL.
    expect(m.sinkSentence).toMatch(/Crisis calls the faithful home/);
  });

  it('reads secularization when piety is falling with an unaffiliated bucket', () => {
    const m = faithPanelModel({
      config: {
        primaryDeitySnapshot: { name: 'Sun' },
        faithProfile: {
          deities: [{ deityRef: 'a', name: 'Sun', share: 70, standing: 'ascendant', legitimacy: 0.6, isPatron: true }],
          unaffiliated: 22,
          piety: { local01: 0.6, structuralTarget: 0.4, composite: 0.9, causes: [] },
        },
      },
    });
    expect(m.piety.trend).toBe('falling');
    expect(m.piety.amplifier.dir).toBe('down');
    expect(m.sinkSentence).toMatch(/Comfort drains the pews/);
  });

  it('legitimacyBand + pietyTrend edge helpers', () => {
    expect(legitimacyBand(0.9).label).toBe('secure');
    expect(legitimacyBand(0.6).label).toBe('established');
    expect(legitimacyBand(0.3).label).toBe('tenuous');
    expect(legitimacyBand(0.1).label).toBe('contested');
    expect(pietyTrend(0.5, 0.5)).toBe('steady');
    expect(pietyTrend(0.5, 0.6)).toBe('rising');
    expect(pietyTrend(0.5, 0.4)).toBe('falling');
  });

  it('WF-1E A1 · a lit ring renders the typed fall sentence, and the copy table spans the whole vocabulary', () => {
    // The LITERAL `faithUnseatingEnabled: true` drive is load-bearing: mechanismLitCoverage
    // grants lit credit only on a literal, and a computed key attributes to no flag at all.
    const model = faithPanelModel(project(fallBearing('discredited'), { faithUnseatingEnabled: true }));
    expect(model.patronFallSentence).toBe('The patron fell — discredited: the creed lost its rightful claim, and the town let another take the seat.');
    // VOCABULARY TOTALITY. The copy table's key set EQUALS the frozen cause vocabulary, so a
    // fifth cause, a renamed token or a deleted row reds HERE rather than silently rendering
    // nothing for a fall the engine can really produce. Both sides sorted: neither literal's
    // declaration order is the claim being made.
    expect([...Object.keys(FALL_SENTENCE)].sort()).toEqual([...PATRON_FALL_CAUSES].sort());
    // Every member really renders, and the four sentences are distinct copy.
    const rendered = PATRON_FALL_CAUSES.map((c) => faithPanelModel(project(fallBearing(c), { faithUnseatingEnabled: true })).patronFallSentence);
    expect(rendered.every((s) => typeof s === 'string' && s.length > 0)).toBe(true);
    expect(new Set(rendered).size).toBe(PATRON_FALL_CAUSES.length);
    // THE DEITY DOCTRINE, ASSERTED RATHER THAN TRUSTED: the line names what believers and
    // rulers did. No clause says a god fell, failed, died or departed, and no deity ref or
    // name is printed — the raw slug stays out of the panel (§2.3).
    for (const s of rendered) {
      // anchored: the four sentences were asserted non-empty and mutually distinct two lines up, so this is a real absence in real copy rather than a vacuous scan of nothing
      expect(s).not.toMatch(/\bgod (?:fell|failed|died|departed)\b|custom:lu_/);
    }
  });

  it('WF-1E A2 · absent, false and lit differ only in the fenced byte on the serialized config', () => {
    // NON-VACUITY CONTROL FIRST: every arm really projected a faith-bearing world. Without
    // this, byte-identity between two empty profiles would "pass" and prove nothing.
    const arms = [{}, { faithUnseatingEnabled: false }, { faithUnseatingEnabled: true }]
      .map((rules) => project(fallBearing(), rules).config.faithProfile);
    for (const fp of arms) {
      expect(fp.patron.name).toBe('Aurum');
      expect(fp.deities.map((d) => d.name)).toEqual(['Aurum', 'Faded']);
    }
    const [absent, off, lit] = arms.map((fp) => JSON.stringify(fp));
    // ABSENT ≡ FALSE at the byte level — the dormancy fence.
    expect(absent).toBe(off);
    // THE LIT-MUTANT CONTROL. The absent-vs-false differential is blind by design: it would
    // pass over a subsystem that was never wired at all. The lit arm proves the fence can see.
    expect(lit).not.toBe(absent);
    expect(JSON.parse(lit).patronFall).toEqual({ ref: dref('Faded'), cause: 'discredited', atTick: 12 });
    // anchored: the same serialized string was just asserted to carry Aurum and Faded and to differ from the lit arm, so this absence is the missing FENCED KEY and not an empty subject
    expect(absent).not.toContain('patronFall');
  });

  it('WF-1E A3 · lit with no ring materializes no key at all and derives no sentence', () => {
    const ringless = faithState();
    expect(ringless.patronFalls).toBeUndefined();
    const fp = project(ringless, { faithUnseatingEnabled: true }).config.faithProfile;
    // POSITIVE CONTROL IN THE SAME TEST: the identical drive WITH a ring carries the key, so
    // the absence below is the FENCE holding rather than the drive never reaching the writer.
    const withRing = project(fallBearing(), { faithUnseatingEnabled: true }).config.faithProfile;
    expect(withRing).toHaveProperty('patronFall');
    // anchored: the positive control one line up proves this exact drive DOES materialize the key when a ring exists, so this is the fence and not a dead arm
    expect(fp).not.toHaveProperty('patronFall');
    // ABSENT, never null — a key is a byte in the save.
    expect(Object.keys(fp)).toEqual(['patron', 'deities', 'contested', 'patronSecurity', 'unaffiliated']);
    expect(faithPanelModel(project(ringless, { faithUnseatingEnabled: true })).patronFallSentence).toBeNull();
  });

  it('WF-1E A4 · the DS-FTH-1 signature agrees across corpus, generated artefact and the live model', () => {
    const SIG = /faithPanelModel\(settlement\) → \{([^}]*)\}/;
    const doc = readFileSync(join(ROOT, 'docs/content/RECEIPT_POOLS_DOSSIER_STATE.md'), 'utf8');
    const gen = readFileSync(join(ROOT, 'src/data/dossierStateProse/warFaith.generated.js'), 'utf8');
    // ⛔ SECTION-SLICED ON BOTH SIDES, never a whole-document match: a document-wide
    // `includes` goes vacuous on the block's own surrounding prose, which names these keys
    // too — the recorded doc-agreement vacuity class.
    const docSection = doc.slice(doc.indexOf('### DS-FTH-1'), doc.indexOf('### DS-FTH-2'));
    const genSection = gen.slice(gen.indexOf('"DS-FTH-1"'), gen.indexOf('"DS-FTH-2"'));
    expect(docSection.length).toBeGreaterThan(0);
    expect(genSection.length).toBeGreaterThan(0);
    const docKeys = SIG.exec(docSection)[1].split(',').map((s) => s.trim());
    const genKeys = SIG.exec(genSection)[1].split(',').map((s) => s.trim());
    // THE ROUND TRIP: the generated artefact carries the corpus's own ordered signature, so
    // an amendment landed without re-running the generator reds here (Lane P's same-commit law).
    expect(genKeys).toEqual(docKeys);
    expect(docKeys).toContain('patronFallSentence');
    // AND THE SPELLING BINDS THE MODEL: every key the corpus names is a real key of a REAL
    // built model. The bound list is a deliberate SUBSET — hasEmbed / effects / contested /
    // patronSecurity sit outside it — so this is containment, measured, not set equality.
    const live = Object.keys(faithPanelModel(project(fallBearing(), { faithUnseatingEnabled: true })));
    expect(docKeys.filter((k) => !live.includes(k))).toEqual([]);
  });

  it('WF-1E A5 · the lifecycle: import drops the profile, no ledger key moves, and a darkened tick self-heals', () => {
    const lit = project(fallBearing(), { faithUnseatingEnabled: true });
    expect(lit.config.faithProfile).toHaveProperty('patronFall');
    // IMPORT: scrubImportedConfig drops faithProfile OUTRIGHT, so the projected key can never
    // arrive from a foreign save. Positive control: a sibling config key really survives.
    const scrubbed = scrubImportedConfig({ ...lit.config, tradeRouteAccess: 'road' });
    expect(scrubbed.tradeRouteAccess).toBe('road');
    // anchored: the surviving sibling key one line up proves the scrub returned a populated config rather than an empty object, so this absence is the intended drop
    expect(scrubbed).not.toHaveProperty('faithProfile');
    // ZERO new top-level worldState keys — the array order IS the serialized key order and
    // this member adds nothing to it. The ring itself was WF-1a's bill, already paid.
    expect(CONDITIONAL_LEDGER_KEYS).toContain('religionStates');
    // anchored: religionStates was just asserted present, so the list is really populated and this is a genuine absence rather than a scan of an empty array
    expect(CONDITIONAL_LEDGER_KEYS).not.toContain('patronFall');
    // THE SELF-HEAL (§2.4). History is immutable under THE PROMISE, so the ring survives a
    // darkening; the PROJECTION is re-derived every tick and therefore follows the flag. The
    // SAME state re-projected dark carries no key — proved on the identical object.
    const state = fallBearing();
    expect(project(state, { faithUnseatingEnabled: true }).config.faithProfile).toHaveProperty('patronFall');
    const darkened = project(state, {}).config.faithProfile;
    expect(state.patronFalls).toHaveLength(1);
    // anchored: the identical state object was asserted to carry the key when lit two lines up, and its ring is still intact one line up, so this absence is the fence self-healing
    expect(darkened).not.toHaveProperty('patronFall');
  });
});
