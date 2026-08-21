/**
 * FounderChairBio.jsx — the founder's own line on their plate in the Founders' Hall
 * (docs/DESIGN_FOUNDERS_HALL.md §2, "THE BIO DRAWER").
 *
 * THE PRESENCE DISCIPLINE, EXACTLY AS ORDERED: this block EXISTS only when the
 * account holds a chair. Not disabled for everyone else, not shown with an
 * upsell — absent. A surface that offers to write a founder's bio to someone who
 * is not a founder has already told a small lie about what the product is.
 *
 * DORMANT-SAFE, the FounderCreditToggle pattern (its sibling two lines below in
 * the Profile section, and its precedent): the bio column and its founder-gated
 * RPC ship with the chair schema, which is OWNER-GATED and undeployed (§8). Until
 * then this block feature-detects and hides itself rather than spewing errors at
 * a founder for a migration that is not their fault.
 *
 * ONE CONSENT, EVERYWHERE (§2/§6): the bio rides the SAME single display-identity
 * opt-in as the name and the image. This surface therefore never asks for a
 * second consent — it says plainly where the text will appear and to whom.
 *
 * ⚠️ THE CIVILITY GUARD IS NOT WIRED HERE YET, AND THE COPY DOES NOT PRETEND IT
 * IS. The guard (blocklist + normalizer, one validator with a client mirror and a
 * server mirror) belongs to the profile-identity lane
 * (docs/DESIGN_PROFILE_IMAGE.md §9). validateChairBio takes it as an injected
 * function and reports `civilityChecked:false` when none ran; this component
 * passes the seam through unchanged, so wiring the guard is a one-argument change
 * at exactly this call site and the letter's.
 */
import { useCallback, useEffect, useId, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import { HALL_BIO_MIN, HALL_BIO_MAX, validateChairBio, HALL_CIVILITY_GUARD } from '../../lib/foundersHall.js';
import { MUTED, SECOND, INK, BORDER, CARD, SP, FS, sans, serif_ } from '../theme.js';

/** Why a band-failed bio was refused — plainly, without moralizing or echoing. */
function refusal(reason) {
  if (reason === 'short') return `A little more, please — at least ${HALL_BIO_MIN} characters.`;
  if (reason === 'long') return `A plate is not a blog: keep this under ${HALL_BIO_MAX} characters.`;
  if (reason === 'blocked') return 'That wording can’t be used here. Think this is wrong? Feedback & support.';
  return null;
}

/**
 * @param {{ civilityGuard?: ((text: string) => { blocked: boolean })|null }} props
 */
export default function FounderChairBio({ civilityGuard = HALL_CIVILITY_GUARD }) {
  const isFounder = useStore((s) => s.isFounder?.() ?? false);
  const [bio, setBio] = useState(null);        // null = unknown
  const [available, setAvailable] = useState(true); // false ⇒ column/RPC undeployed
  const [draft, setDraft] = useState('');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fieldId = useId();

  useEffect(() => {
    if (!isFounder) return undefined;
    let alive = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (alive) setAvailable(false); return; }
        const { data, error: readErr } = await supabase
          .from('profiles').select('founder_bio').eq('id', user.id).maybeSingle();
        if (!alive) return;
        if (readErr) { setAvailable(false); return; } // column undeployed → hide
        const current = typeof data?.founder_bio === 'string' ? data.founder_bio : '';
        setBio(current);
        setDraft(current);
      } catch {
        if (alive) setAvailable(false);
      }
    })();
    return () => { alive = false; };
  }, [isFounder]);

  const onSave = useCallback(async () => {
    const check = validateChairBio(draft, { civility: civilityGuard });
    if (!check.ok) { setError(refusal(check.reason)); setSaved(false); return; }
    setError(null);
    setSaving(true);
    try {
      const { error: rpcErr } = await supabase.rpc('set_founder_chair_bio', { p_bio: check.value });
      if (rpcErr) { setAvailable(false); return; } // RPC undeployed → hide gracefully
      setBio(check.value);
      setSaved(true);
    } catch {
      setAvailable(false);
    } finally {
      setSaving(false);
    }
  }, [draft, civilityGuard]);

  if (!isFounder || !available || bio === null) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
      {/* The control is NESTED in its label as well as bound by id — the house's
          Profile-section idiom, and the only shape the a11y lint accepts as
          provably labelled. */}
      <label
        htmlFor={fieldId}
        style={{ display: 'flex', flexDirection: 'column', gap: SP.xs, fontSize: FS.xs, fontWeight: 700, color: SECOND, fontFamily: sans }}
      >
        Your line in the Founders&rsquo; Hall
        <span style={{ fontSize: FS.xs, fontWeight: 400, color: MUTED, fontFamily: sans }}>
          Optional. It appears on your chair&rsquo;s plate, under the same display consent
          as your name. Leave it empty and the chair speaks for itself.
        </span>
        <textarea
          id={fieldId}
          aria-label="Your line in the Founders' Hall"
          rows={4}
          value={draft}
          maxLength={HALL_BIO_MAX}
          onChange={(e) => { setDraft(e.target.value); setSaved(false); }}
          style={{
            padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`,
            fontSize: FS.sm, fontFamily: serif_, fontWeight: 400, lineHeight: 1.6, color: INK,
            background: CARD, resize: 'vertical',
          }}
        />
      </label>
      {error && <span role="alert" style={{ fontSize: FS.xs, color: SECOND, fontFamily: sans }}>{error}</span>}
      <Button
        variant="secondary"
        size="sm"
        onClick={onSave}
        busy={saving}
        style={{ alignSelf: 'flex-start' }}
      >
        {saved ? 'Saved' : 'Save your line'}
      </Button>
    </div>
  );
}
