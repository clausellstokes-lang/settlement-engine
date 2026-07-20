/**
 * components/howto/HandbookVoiced.jsx — V-26b: the HOUSE-VOICE draft of the Keeper's
 * Handbook's NARRATIVE prose, staged dark behind the `handbookVoice` flag.
 *
 * This module carries ONLY the voice-bearing surfaces — the handbook header and the
 * QuickTab "why it works this way" concept essay — rewritten in the covenant/chronicler
 * register the About manifesto and the Chronicler's Letter already speak. It coexists
 * with the plain original in HowToUse.jsx: flag OFF renders the original byte-identical,
 * flag ON renders this. It is imported ONLY by the (already-lazy) HowToUse module, so it
 * contributes ZERO first-paint bytes.
 *
 * THE CLARITY CLAUSE binds this rewrite: the numbered how-to STEPS, the Reference
 * lifeline, and the billing FAQ are clarity-mandated and are NOT voiced — they stay plain
 * in both states (mandated plainness stays plain). The facts here are unchanged from the
 * plain copy — same mechanisms, same claims — only the voice differs (claims-parity).
 */

import { GOLD, serif_, FS, swatch } from '../theme.js';

/** The voiced handbook header — the eyebrow / title / subtitle strings. The Compendium
 *  LINK stays present and plain (findability is clarity, not voice). */
export const VOICED_HEADER = Object.freeze({
  eyebrow: 'The keeper’s craft',
  title: 'The Keeper’s Handbook',
  subtitleLead: 'How to keep a world, day to day — the plain working of the engine. Any rule or catalog is set down in the ',
  subtitleTail: '.',
});

/**
 * The voiced concept essay — the "why it works this way" coda in house voice. Same panel
 * shape as the plain original (the dark parchment card), same facts, house register.
 */
export function VoicedConceptIntro() {
  return (
    <div style={{ padding: '12px 14px', background: 'linear-gradient(135deg,#1c1409 0%,#2d1f0e 100%)', marginBottom: 14 }}>
      <div style={{ fontFamily: serif_, fontSize: FS['16'], fontWeight: 600, color: GOLD, marginBottom: 6 }}>
        A generator that keeps a world. And stays inside your bounds.
      </div>
      <p style={{ fontSize: FS.sm, color: swatch['#C8B098'], lineHeight: 1.7, margin: '0 0 8px' }}>
        Most generators roll on a table. This one keeps a world. Every institution, every guarded secret, every
        faction&rsquo;s grudge and the reach of its trade is derived &mdash; not drawn from a hat, but settled by the
        same mechanical pressures that governed real towns. Nothing here is decoration.
      </p>
      <p style={{ fontSize: FS.sm, color: swatch['#C8B098'], lineHeight: 1.7, margin: '0 0 8px' }}>
        <strong style={{ color: GOLD }}>Constraint</strong> is the whole method. You do not describe the town you
        want; you set the bounds of the town that can exist. A slider, a stress, a forced institution, the terrain at
        its gates, the temper of its neighbours &mdash; each is a wall. The settlement that emerges is the only one
        that can stand inside all of them at once. That is a different act from rolling dice, prompting for prose, or
        choosing from a list.
      </p>
      <p style={{ fontSize: FS.sm, color: swatch['#C8B098'], lineHeight: 1.7, margin: '0 0 8px' }}>
        <strong style={{ color: GOLD }}>Coherence</strong> is the reward for constraint. A hungry frontier town told
        to fear its criminals will grow a bought guard, a starved wall, a black market, and people whose secrets bend
        to exactly that pressure &mdash; because every one of those answers is drawn from the same set of bounds, not
        invented apart from the others.
      </p>
      <p style={{ fontSize: FS.sm, color: swatch['#C8B098'], lineHeight: 1.7, margin: '0 0 8px' }}>
        <strong style={{ color: GOLD }}>The Narrative Refinement Layer</strong> waits under a single button. The town
        itself is simulated, never written; but when you want table-ready prose, the layer gathers the whole simulated
        state &mdash; the faction tensions, the strain on the purse, the character earned by its history, the texture
        of a working day &mdash; into one voice that says only what the engine already holds. It dresses the truth; it
        never replaces it.
      </p>
      <p style={{ fontSize: FS.sm, color: swatch['#C8B098'], lineHeight: 1.7, margin: 0 }}>
        <strong style={{ color: GOLD }}>The Narrative AI Prompt</strong> is for deeper work. The export packs the full
        brief &mdash; economy, power, every goal and secret, the standing stresses, the history &mdash; as a structured
        prompt for any outside tool. Because the brief is coherent, an outside assistant keeps its story straight across
        a dozen questions. Hand it over and ask it anything about the town.
      </p>
    </div>
  );
}

// A stable anchor string the pin uses to assert the voiced register is genuinely distinct
// from the plain original ("Most generators roll on a table…").
export const VOICED_ANCHOR = 'This one keeps a world.';
