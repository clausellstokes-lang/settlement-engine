/**
 * InstantWorldEntry.jsx — the premium-gated "Instant World" entry, shown beside
 * the Basic/Advanced mode picker on the Create landing (W-R2 INSTANT WORLD).
 *
 * ONE CLICK + BASIC CONFIG → a coherent staged realm. This component is the
 * INTERFACE GATE (the only gate): a non-premium reach fires the pricing moment
 * and opens the purchase modal; a premium reach expands the config card and
 * calls the tier-blind store action. Tier never reaches the composer.
 *
 * THE ONE QUESTION (MG-1, docs/DESIGN_REALM_MAGIC_TOGGLE §4). Three knobs are
 * chips in the card; the fourth — does magic exist in these lands? — is a modal
 * interposed between the Generate CTA and the store action. It is asked rather
 * than defaulted because it is the only knob that cannot be nudged after the
 * fact: every member is minted under it. Dismissing the question cancels the
 * generation; the last answer is remembered per device and echoed in the card.
 *
 * Lazy-loaded by WizardEmptyState (never in first paint); the heavy composer +
 * generator load only when the user actually presses Generate (the store
 * action's dynamic import).
 */
import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import { REALM_SIZES, TONES, MAP_KINDS, MAGIC_CHOICES, DEFAULT_REALM_SIZE, DEFAULT_TONE, DEFAULT_MAP_KIND, DEFAULT_MAGIC, isMagicChoice } from '../../domain/instantWorld/worldPlan.js';
import Button from '../primitives/Button.jsx';
import Segmented from '../primitives/Segmented.jsx';
import { ChoiceDialog } from '../primitives/Dialog.jsx';
import { INK, BODY, MUTED, BORDER, BORDER2, CARD, CARD_HDR, GOLD, sans, serif_, FS, SP, swatch } from '../theme.js';

const REALM_OPTIONS = Object.values(REALM_SIZES).map(s => ({ id: s.id, label: s.label }));
const TONE_OPTIONS = TONES.map(t => ({ id: t.id, label: t.label }));
// The modal's choice rows (MG-1). Authored from the knob vocabulary so the
// question and the plan can never disagree about what the answers are.
const MAGIC_OPTIONS = MAGIC_CHOICES.map(m => ({ id: m.id, label: m.label, description: m.blurb }));

/** A short, human-typeable random seed for the "surprise me" default + reroll. */
function freshSeed() {
  return Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);
}

export default function InstantWorldEntry({ isMobile, onNavigate }) {
  const tier = useStore(s => s.auth?.tier);
  const isElevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const instantWorld = useStore(s => s.instantWorld);
  const busy = useStore(s => s.instantWorldBusy);
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const setActivePricingMoment = useStore(s => s.setActivePricingMoment);
  // The remembered answer to the magic question (device-scoped, MG-1). Clamped
  // HERE rather than in the slice: the vocabulary lives in the lazy composer
  // lane, so the store holds an opaque string and this reader owns the clamp.
  const rememberedMagic = useStore(s => (isMagicChoice(s.displayPrefs?.realmMagicChoice)
    ? s.displayPrefs.realmMagicChoice
    : DEFAULT_MAGIC));
  const setRealmMagicChoice = useStore(s => s.setRealmMagicChoice);

  const canGenerate = tier === 'premium' || isElevated;

  const [open, setOpen] = useState(false);
  const [realmSize, setRealmSize] = useState(DEFAULT_REALM_SIZE);
  const [tone, setTone] = useState(DEFAULT_TONE);
  const [mapKind, setMapKind] = useState(DEFAULT_MAP_KIND);
  const [seed, setSeed] = useState(freshSeed);
  const [error, setError] = useState(null);
  // The pre-generation question (MG-1). Interposed between the Generate CTA and
  // the store action: the realm's magic stance is the one knob that cannot be
  // nudged after the fact, so it is ASKED rather than defaulted, every time.
  const [askMagic, setAskMagic] = useState(false);

  const handleLockedReach = () => {
    triggerPricingMoment('map_realm_teaser', setActivePricingMoment, { tier });
    setPurchaseModalOpen?.(true);
  };

  const handleEntry = () => {
    if (!canGenerate) { handleLockedReach(); return; }
    setOpen(o => !o);
  };

  // The CTA no longer generates: it asks. Nothing is composed until the DM has
  // answered the magic question for THIS realm (Esc / dismiss cancels outright —
  // never a silent default, MG-1).
  const handleGenerate = () => {
    if (!canGenerate) { handleLockedReach(); return; }
    if (busy) return;
    setError(null);
    setAskMagic(true);
  };

  const handleMagicAnswer = async (magic) => {
    setAskMagic(false);
    if (!isMagicChoice(magic)) return;
    // Remember the answer for this machine BEFORE the long compose, so a
    // navigation away mid-build still pre-selects what the DM last chose.
    setRealmMagicChoice?.(magic);
    const result = await instantWorld?.({ realmSize, tone, mapKind, magic }, { seed });
    if (result?.ok) {
      // Land the user in the freshly staged realm (canonize is their next act).
      onNavigate?.('realm');
    } else if (result?.reason === 'not_enough_slots') {
      setError(t('errors.realmSlots'));
    } else if (result && result.ok === false && result.reason !== 'in_flight') {
      setError(result.message || t('errors.realmBuild'));
    }
  };

  return (
    <div
      data-testid="instant-world-entry"
      style={{ border: `2px solid ${GOLD}`, overflow: 'hidden', background: CARD }}
    >
      {/* ── Header / entry CTA ─────────────────────────────────────────── */}
      <div style={{ padding: `${SP.md}px ${SP.lg}px`, background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`, display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
            <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK }}>Instant World</span>
            <span style={{
              fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, letterSpacing: 0.4, textTransform: 'uppercase',
              color: swatch.white, background: GOLD, padding: '2px 6px',
            }}>
              Premium
            </span>
          </div>
          <p style={{ margin: `${SP.xs}px 0 0`, fontFamily: sans, fontSize: FS.sm, color: BODY, lineHeight: 1.45 }}>
            One click and a little configuration builds a whole coherent realm: a map, a mix of settlements, and the ties between them, all staged and ready for you to shape. The advanced wizard stays here for full control.
          </p>
        </div>
        <Button
          variant={canGenerate ? 'gold' : 'secondary'}
          size="md"
          onClick={handleEntry}
          aria-expanded={open}
          data-testid="instant-world-open"
        >
          {canGenerate ? (open ? 'Hide options' : 'Build a realm') : 'See Premium'}
        </Button>
      </div>

      {/* ── Basic config (premium, expanded) ───────────────────────────── */}
      {open && canGenerate && (
        <div style={{ padding: SP.lg, display: 'grid', gap: SP.lg }}>
          <Knob label="Realm size" hint={REALM_SIZES[realmSize]?.blurb}>
            <Segmented options={REALM_OPTIONS} value={realmSize} onChange={setRealmSize} size="sm" ariaLabel="Realm size" />
          </Knob>

          <Knob label="Tone" hint={TONES.find(t => t.id === tone)?.blurb}>
            <Segmented options={TONE_OPTIONS} value={tone} onChange={setTone} size="sm" ariaLabel="Tone" />
          </Knob>

          <Knob label="Map kind">
            <select
              aria-label="Map kind"
              value={mapKind}
              onChange={(e) => setMapKind(e.target.value)}
              style={{
                fontFamily: sans, fontSize: FS.sm, color: INK, background: CARD,
                border: `1px solid ${BORDER}`, padding: `${SP.xs}px ${SP.sm}px`, minHeight: 34,
              }}
            >
              {MAP_KINDS.map(k => <option key={k.id || 'random'} value={k.id}>{k.label}</option>)}
            </select>
          </Knob>

          <Knob label="Seed" hint="Everything else is a surprise. Same seed always rebuilds the same realm.">
            <div style={{ display: 'flex', gap: SP.sm, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                aria-label="Seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                style={{
                  fontFamily: sans, fontSize: FS.sm, color: INK, background: CARD,
                  border: `1px solid ${BORDER}`, padding: `${SP.xs}px ${SP.sm}px`, minHeight: 34, minWidth: 140,
                }}
              />
              <Button variant="ghost" size="sm" onClick={() => setSeed(freshSeed())} data-testid="instant-world-surprise">
                Surprise me
              </Button>
            </div>
          </Knob>

          {/* The magic question is asked in a modal at Generate, not answered
              here — but the remembered answer is shown so the modal never
              surprises (MG-1: "a read-only echo chip of the remembered choice"). */}
          <Knob label="Magic" hint="Asked once before the realm is built. It shapes every settlement in it.">
            <span
              data-testid="instant-world-magic-echo"
              style={{
                justifySelf: 'start', fontFamily: sans, fontSize: FS.xs, fontWeight: 700,
                color: BODY, background: CARD_HDR, border: `1px solid ${BORDER2}`,
                padding: `${SP.xs}px ${SP.sm}px`,
              }}
            >
              {MAGIC_CHOICES.find(m => m.id === rememberedMagic)?.label}
            </span>
          </Knob>

          {error && (
            <div role="alert" style={{ fontFamily: sans, fontSize: FS.sm, color: swatch.danger }}>{error}</div>
          )}

          <Button
            variant="primary"
            fullWidth
            busy={busy}
            onClick={handleGenerate}
            data-testid="instant-world-generate"
            style={{
              padding: isMobile ? `${SP.lg}px 0` : `${SP.md}px 0`,
              background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
              color: swatch.white, border: 'none',
              fontFamily: serif_, fontSize: isMobile ? 20 : FS.xl, fontWeight: 600,
            }}
          >
            {busy ? 'Building your realm…' : 'Generate Instant World'}
          </Button>
          <p style={{ margin: 0, textAlign: 'center', fontFamily: sans, fontSize: FS.xxs, color: MUTED }}>
            It places everything and canonizes nothing. You can move, edit, or regenerate before mapping the geography.
          </p>
        </div>
      )}

      {/* ── The one question asked before the world exists (MG-1) ────────── */}
      <ChoiceDialog
        open={askMagic}
        tone="default"
        title="Does magic exist in these lands?"
        body="This shapes every settlement in the realm: its mages and arcane orders, its magical events, its enchanted trade. Gods and temples remain either way — belief is not a spell."
        choices={MAGIC_OPTIONS}
        defaultChoiceId={rememberedMagic}
        cancelLabel="Not yet"
        onChoose={handleMagicAnswer}
        onCancel={() => setAskMagic(false)}
      />
    </div>
  );
}

function Knob({ label, hint, children }) {
  return (
    <div style={{ display: 'grid', gap: SP.xs }}>
      <span style={{ fontFamily: sans, fontSize: FS.xs, fontWeight: 900, letterSpacing: 0.4, textTransform: 'uppercase', color: MUTED }}>
        {label}
      </span>
      {children}
      {hint && <span style={{ fontFamily: sans, fontSize: FS.xxs, color: BODY, lineHeight: 1.4 }}>{hint}</span>}
    </div>
  );
}
