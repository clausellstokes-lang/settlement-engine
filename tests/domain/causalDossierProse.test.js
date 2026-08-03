/**
 * causalDossierProse.test.js — LANE P-3: the [angle x arm] join reader.
 *
 * Three properties carry this module, and each is a way the dossier could lie:
 *
 *   THE JOIN MUST EXIST. The reader renders only joins it is HANDED, and has no path to
 *   a settlement or a ledger from which it could select one. Pinned structurally (the
 *   module imports nothing that could reach state) and behaviourally (an unknown family
 *   renders nothing rather than guessing).
 *
 *   THE ARM MUST BE THIS TOWN'S. R-DOS-A: `{settlement}` is always the page's own town,
 *   whichever end of the join it sits on. A wrong or missing arm renders NOTHING rather
 *   than falling through — falling through would print the neighbour's condition on this
 *   town's page, which is the annex's own "most likely thing to be silently mis-wired".
 *
 *   THE ANCHOR STATE MUST BE PRESENT. Seed the state, see the line; take the state away,
 *   the line is gone — with the surviving lines as the liveness anchor.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CAUSAL_SECTION_TARGETS,
  causalArms,
  causalFamiliesForSection,
  causalLinesForSection,
  readCausalDossierLine,
} from '../../src/domain/display/stateProse/causalDossierProse.js';
import { DOSSIER_CAUSAL_PROSE } from '../../src/data/dossierCausalProse.generated.js';
import { AUDIENCE_DM, AUDIENCE_PLAYER } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const MODULE = resolve(import.meta.dirname, '../../src/domain/display/stateProse/causalDossierProse.js');

/** Render one variant's text with a slot bag, exactly as the reader would. */
function renderVariant(variant, slots) {
  return variant.text.replace(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (whole, name) =>
    (slots[name] === undefined ? whole : String(slots[name])));
}

/** A full slot bag for one family, so eligibility turns on the property under test. */
function fullSlots(familyId) {
  const pool = DOSSIER_CAUSAL_PROSE[familyId].pools['*'];
  return Object.fromEntries(
    [...new Set(pool.flatMap((v) => v.slots))].map((slot) => [slot, `the ${slot}`]),
  );
}

describe('the corpus itself is arm-addressable', () => {
  it('tags every variant with an arm its family declares', () => {
    const untagged = [];
    for (const [id, family] of Object.entries(DOSSIER_CAUSAL_PROSE)) {
      for (const variant of family.pools['*']) {
        const arms = (variant.marks || []).filter((m) => family.arms.includes(m));
        if (arms.length !== 1) untagged.push(`${id} :: ${variant.angle} :: ${arms.length} arms`);
      }
    }
    expect(untagged).toEqual([]);
  });

  it('lands every family in at least one of the eight dossier sections', () => {
    const stray = [];
    for (const [id, family] of Object.entries(DOSSIER_CAUSAL_PROSE)) {
      const targets = family.sectionTarget || [];
      if (targets.length === 0) { stray.push(`${id} declares no section`); continue; }
      for (const target of targets) {
        if (!CAUSAL_SECTION_TARGETS.includes(target)) stray.push(`${id} → ${target}`);
      }
    }
    expect(stray).toEqual([]);
  });

  it('reaches every section from the discovery index', () => {
    for (const section of CAUSAL_SECTION_TARGETS) {
      expect(causalFamiliesForSection(section).length, `section ${section}`).toBeGreaterThan(0);
    }
  });
});

describe('the reader cannot conjure a join', () => {
  it('imports nothing that could reach a settlement, a ledger or a rumor record', () => {
    // The contamination fence, made structural. A module with no path to state cannot
    // select a family from a band, and cannot read a belief map as a content source.
    const imports = [...readFileSync(MODULE, 'utf8')
      .matchAll(/^\s*import\s[^;]*?from\s+['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    expect(imports.sort()).toEqual([
      '../../../data/dossierCausalProse.generated.js',
      './stateProseKernel.js',
    ]);
  });

  it('renders nothing for a family the corpus does not carry', () => {
    expect(readCausalDossierLine({ familyId: 'JF-NOT-A-FAMILY', arm: 'cut', slots: {} })).toBeNull();
    expect(causalArms('JF-NOT-A-FAMILY')).toEqual([]);
  });

  it('renders only the joins it is handed, never every family in the section', () => {
    const available = causalFamiliesForSection('economy');
    expect(available.length).toBeGreaterThan(1);
    const lines = causalLinesForSection('economy',
      [{ familyId: 'JF-CPL-1a', arm: 'cut', slots: fullSlots('JF-CPL-1a') }],
      { seed: 'w1', audience: AUDIENCE_DM });
    expect(lines.length).toBe(1);
    expect(lines[0].familyId).toBe('JF-CPL-1a');
  });

  it('renders nothing at all when the town has no joins', () => {
    expect(causalLinesForSection('economy', [], { seed: 'w1' })).toEqual([]);
  });
});

describe('R-DOS-A: the page town owns {settlement}, and the arm says which end that is', () => {
  it('renders the arm it is given', () => {
    const slots = fullSlots('JF-CPL-1a');
    const cut = readCausalDossierLine({ familyId: 'JF-CPL-1a', arm: 'cut', slots }, { seed: 's', audience: AUDIENCE_DM });
    const closer = readCausalDossierLine({ familyId: 'JF-CPL-1a', arm: 'closer', slots }, { seed: 's', audience: AUDIENCE_DM });
    expect(cut?.arm).toBe('cut');
    expect(closer?.arm).toBe('closer');
    // Both ends of one join, one seed: the two sentences must not be the same line.
    expect(cut?.text).not.toBe(closer?.text);
  });

  it('renders NOTHING for an arm the family does not declare, rather than the other arm', () => {
    const slots = fullSlots('JF-CPL-1a');
    const armless = readCausalDossierLine({ familyId: 'JF-CPL-1a', arm: '', slots }, { seed: 's', audience: AUDIENCE_DM });
    const wrong = readCausalDossierLine({ familyId: 'JF-CPL-1a', arm: 'aggrieved', slots }, { seed: 's', audience: AUDIENCE_DM });
    expect(armless).toBeNull();
    expect(wrong).toBeNull();
    // The anchor: the declared arms DO render, so the two nulls above measure the arm
    // rule and not a broken family.
    expect(causalArms('JF-CPL-1a')).toContain('cut');
    expect(readCausalDossierLine({ familyId: 'JF-CPL-1a', arm: 'cut', slots }, { seed: 's', audience: AUDIENCE_DM }))
      .not.toBeNull();
  });

  it('keeps each arm inside its own half of the pool', () => {
    for (const [id, family] of Object.entries(DOSSIER_CAUSAL_PROSE)) {
      for (const arm of family.arms) {
        const slots = fullSlots(id);
        const line = readCausalDossierLine({ familyId: id, arm, slots }, { seed: `${id}::x`, audience: AUDIENCE_DM });
        if (!line) continue;
        // Identify the source variant by its RENDERED text, not by a prefix: many
        // variants open with `{settlement}`, so a prefix match is the empty string and
        // would match any line — a vacuous pin wearing a real assertion's clothes.
        const source = family.pools['*'].find((v) => renderVariant(v, slots) === line.text);
        expect(source, `${id} / ${arm}: rendered line must trace to a variant`).toBeTruthy();
        expect(source.marks, `${id} / ${arm}`).toContain(arm);
      }
    }
  });
});

describe('anchored liveness at the join grain', () => {
  it('drops exactly the lines whose anchor state went away', () => {
    const slots = fullSlots('JF-CPL-1a');
    const withAll = [];
    const withoutCounterpart = [];
    for (const arm of causalArms('JF-CPL-1a')) {
      for (let i = 0; i < 40; i++) {
        const seed = `probe-${i}`;
        const a = readCausalDossierLine({ familyId: 'JF-CPL-1a', arm, slots }, { seed, audience: AUDIENCE_DM });
        const { counterpart, ...thin } = slots;
        const b = readCausalDossierLine({ familyId: 'JF-CPL-1a', arm, slots: thin }, { seed, audience: AUDIENCE_DM });
        if (a) withAll.push(a.text);
        if (b) withoutCounterpart.push(b.text);
      }
    }
    const counterpartLine = withAll.find((t) => t.includes('the counterpart'));
    expect(counterpartLine, 'the family must speak about its counterpart somewhere').toBeTruthy();
    expectPresentThenAbsent(withAll, withoutCounterpart, counterpartLine, 'counterpart record removed');
    expect(withoutCounterpart.length, 'the unanchored lines survive — the liveness anchor')
      .toBeGreaterThan(0);
  });

  it('renders no line at all when the join names records the town does not hold', () => {
    // Every variant of this family names {counterpart}; strip it and the family goes
    // silent rather than speaking a half-sentence.
    const silent = readCausalDossierLine(
      { familyId: 'JF-CPL-1a', arm: 'cut', slots: { settlement: 'Thornwall' } },
      { seed: 's', audience: AUDIENCE_DM },
    );
    expect(silent).toBeNull();
  });

  it('keeps a covert join off the player page', () => {
    const covertFamily = Object.entries(DOSSIER_CAUSAL_PROSE).find(([, f]) =>
      f.pools['*'].some((v) => (v.marks || []).includes('dm-only')));
    expect(covertFamily, 'no covert causal family shipped — the pin would be vacuous').toBeTruthy();
    const [id, family] = covertFamily;
    const covert = family.pools['*'].find((v) => (v.marks || []).includes('dm-only'));
    const arm = covert.marks.find((m) => family.arms.includes(m));
    const slots = fullSlots(id);
    const dmTexts = [];
    const playerTexts = [];
    for (let i = 0; i < 60; i++) {
      dmTexts.push(readCausalDossierLine({ familyId: id, arm, slots }, { seed: `s${i}`, audience: AUDIENCE_DM })?.text);
      playerTexts.push(readCausalDossierLine({ familyId: id, arm, slots }, { seed: `s${i}`, audience: AUDIENCE_PLAYER })?.text);
    }
    const covertText = renderVariant(covert, slots);
    expect(dmTexts, 'the covert variant must be reachable by the DM').toContain(covertText);
    const openText = playerTexts.find(Boolean);
    expectAbsentWithAnchor(playerTexts, covertText, openText, 'player projection of a covert join');
  });
});

describe('section placement', () => {
  it('marks a second-target line as such, and can be told to withhold it', () => {
    // JF-CPL-1a is primary `economy`, second `defense`.
    const join = { familyId: 'JF-CPL-1a', arm: 'cut', slots: fullSlots('JF-CPL-1a') };
    const onDefense = causalLinesForSection('defense', [join], { seed: 'w', audience: AUDIENCE_DM });
    expect(onDefense[0]?.isSecondTarget).toBe(true);
    expect(causalLinesForSection('defense', [join], { seed: 'w', audience: AUDIENCE_DM, secondTargets: false }))
      .toEqual([]);
    expect(causalLinesForSection('economy', [join], { seed: 'w', audience: AUDIENCE_DM, secondTargets: false })
      .length).toBe(1);
  });

  it('never places a family in a section it does not declare', () => {
    const join = { familyId: 'JF-CPL-1a', arm: 'cut', slots: fullSlots('JF-CPL-1a') };
    expect(causalLinesForSection('faith', [join], { seed: 'w', audience: AUDIENCE_DM })).toEqual([]);
  });
});
