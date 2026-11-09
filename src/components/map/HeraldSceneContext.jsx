/**
 * Exact, session-only context carried from the settlement portrait.
 *
 * This card is intentionally not a RealmItem card. Scene semantics and Herald
 * stories have different identity vocabularies; presenting what the portrait
 * noted is more honest than guessing which story "must" match.
 *
 * D2·12 + D·89 (STYLE-2-PULSE-FOLLOWUP, 2026-11-09, the chair's ruling): the face
 * prints plain words — the kind and the cause family humanized, no scene id, no
 * canonical record id, no raw provenance reference. The ids stay in the record:
 * the context object is untouched and the card carries them as data attributes
 * (`data-scene-id`, `data-canonical-ref`) for anyone who inspects it.
 */

import {
  BODY,
  BORDER,
  CARD_ALT,
  FS,
  INK,
  SECOND,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import { heraldDestinationForSceneAction } from './heraldCommandNavigation.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';
import { humanizeToken } from '../../domain/display/humanizeEngineTokens.js';

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value : '';
}

/** @param {unknown} value @returns {string} a token in words, first letter raised */
function words(value) {
  const w = humanizeToken(text(value));
  return w ? w.charAt(0).toUpperCase() + w.slice(1) : '';
}

function causeText(cause) {
  const displayText = text(cause?.displayText);
  if (displayText) return displayText;
  const effect = words(cause?.effect);
  const sourceRef = text(cause?.sourceRef);
  if (effect && sourceRef) return `${effect}: ${sourceRef}`;
  return effect || sourceRef || 'A cause the portrait noted, without a description.';
}

export default function HeraldSceneContext({ context, onDismiss }) {
  const mobile = useIsMobile();
  if (!context) return null;
  const destination = heraldDestinationForSceneAction(context.action);
  if (!destination.action) return null;

  const causes = Array.isArray(context.provenance) ? context.provenance : [];
  const causeById = new Map(causes.map((cause) => [cause.id, cause]));
  const references = Array.isArray(context.provenanceRefs)
    ? context.provenanceRefs
    : [];
  const canonicalKind = text(context.canonicalRef?.kind);
  const canonicalId = text(context.canonicalRef?.id);

  return (
    <section
      aria-label="Settlement portrait context"
      data-testid="herald-scene-context"
      data-scene-id={text(context.sceneId) || undefined}
      data-canonical-ref={canonicalKind && canonicalId ? `${canonicalKind}:${canonicalId}` : undefined}
      style={{
        display: 'grid',
        gap: 8,
        marginBottom: 12,
        padding: 12,
        border: `1px solid ${BORDER}`,
        borderRadius: 0,
        background: CARD_ALT,
        color: INK,
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'start', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            color: SECOND,
            fontSize: chromeFontSize(FS.micro, mobile),
            fontWeight: 850,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}>
            From the settlement portrait
          </div>
          <h2 style={{ margin: '3px 0 0', fontSize: FS.md }}>
            {text(context.label) || words(context.entityKind) || 'A place in the portrait'}
          </h2>
        </div>
        {onDismiss && (
          <Button
            size="sm"
            variant="ghost"
            aria-label="Dismiss settlement portrait context"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        )}
      </div>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content minmax(0, 1fr)',
          gap: '3px 8px',
          margin: 0,
          color: BODY,
          fontSize: chromeFontSize(FS.xs, mobile),
        }}
      >
        <dt style={{ color: INK, fontWeight: 800 }}>Action</dt>
        <dd style={{ margin: 0 }}>{destination.label}</dd>
        {words(context.entityKind) && (
          <>
            <dt style={{ color: INK, fontWeight: 800 }}>Kind</dt>
            <dd style={{ margin: 0 }}>{words(context.entityKind)}</dd>
          </>
        )}
      </dl>

      {references.length > 0 && (
        <div style={{ display: 'grid', gap: 4, color: BODY, fontSize: chromeFontSize(FS.xs, mobile) }}>
          <strong style={{ color: INK }}>Why this is here</strong>
          <ul style={{ margin: 0, paddingInlineStart: 18 }}>
            {references.map((reference) => {
              const cause = causeById.get(reference);
              return (
                <li key={reference} style={{ marginBottom: 3 }}>
                  {causeText(cause)}
                  {words(cause?.family) ? ` · ${words(cause?.family)}` : ''}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <p style={{ margin: 0, color: SECOND, fontSize: proseFontSize(FS.micro, mobile) }}>
        These are the notes the settlement’s portrait was built from. The Herald
        has not guessed which story this place belongs to.
      </p>
    </section>
  );
}
